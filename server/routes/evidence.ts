import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import { MockAIAnalysisService } from '../services/MockAIAnalysisService.js';

export const evidenceRouter = Router();

const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// List evidence
evidenceRouter.get('/', (req, res) => {
  try {
    const { caseId } = req.query;
    let query = 'SELECT * FROM evidence ORDER BY created_at DESC';
    let params: any[] = [];

    if (caseId) {
      query = 'SELECT * FROM evidence WHERE case_id = ? ORDER BY created_at DESC';
      params = [caseId as string];
    }

    const rows: any[] = db.prepare(query).all(...params);

    const formatted = rows.map((e) => ({
      id: e.id,
      caseId: e.case_id,
      title: e.title,
      type: e.type,
      source: e.source,
      date: e.date,
      time: e.time,
      description: e.description,
      accountUsername: e.account_username,
      fileUrl: e.file_url,
      fileType: e.file_type,
      fileSize: e.file_size,
      riskLevel: e.risk_level,
      analysisStatus: e.analysis_status,
      createdAt: e.created_at
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch evidence' });
  }
});

// Get Evidence Detail by ID
evidenceRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const e: any = db.prepare('SELECT * FROM evidence WHERE id = ?').get(id);

    if (!e) {
      return res.status(404).json({ error: 'Evidence item not found' });
    }

    const aiRow: any = db.prepare('SELECT * FROM ai_analysis WHERE evidence_id = ?').get(id);
    let aiAnalysis = null;
    if (aiRow) {
      aiAnalysis = {
        id: aiRow.id,
        evidenceId: aiRow.evidence_id,
        riskLevel: aiRow.risk_level,
        score: aiRow.score,
        confidence: aiRow.confidence,
        detectedCategories: JSON.parse(aiRow.detected_categories || '[]'),
        keyIndicators: JSON.parse(aiRow.key_indicators || '[]'),
        extractedText: aiRow.extracted_text,
        explanation: aiRow.explanation,
        metadataAnalysis: aiRow.metadata_analysis ? JSON.parse(aiRow.metadata_analysis) : undefined,
        createdAt: aiRow.created_at
      };
    }

    const reviewRows: any[] = db.prepare('SELECT * FROM human_reviews WHERE evidence_id = ? ORDER BY timestamp DESC').all(id);
    const reviews = reviewRows.map((r) => ({
      id: r.id,
      evidenceId: r.evidence_id,
      caseId: r.case_id,
      reviewerId: r.reviewer_id,
      reviewerName: r.reviewer_name,
      originalRisk: r.original_risk,
      finalRisk: r.final_risk,
      action: r.action,
      notes: r.notes,
      timestamp: r.timestamp
    }));

    return res.json({
      evidence: {
        id: e.id,
        caseId: e.case_id,
        title: e.title,
        type: e.type,
        source: e.source,
        date: e.date,
        time: e.time,
        description: e.description,
        accountUsername: e.account_username,
        fileUrl: e.file_url,
        fileType: e.file_type,
        fileSize: e.file_size,
        riskLevel: e.risk_level,
        analysisStatus: e.analysis_status,
        createdAt: e.created_at
      },
      aiAnalysis,
      reviews
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch evidence details' });
  }
});

// Upload Evidence
evidenceRouter.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, caseId, type, source, date, time, description, accountUsername } = req.body;

    if (!title || !caseId || !type || !source) {
      return res.status(400).json({ error: 'Title, case, type, and source are required' });
    }

    // Generate evidence ID e.g. DS-EV-1042
    const evCount: any = db.prepare('SELECT COUNT(*) as count FROM evidence').get();
    const idNum = String(evCount.count + 1).padStart(4, '0');
    const id = `DS-EV-${idNum}`;

    let fileUrl = '';
    let fileType = '';
    let fileSize = 0;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileType = req.file.mimetype;
      fileSize = req.file.size;
    }

    const userId = 'user-demo-001';
    const evDate = date || new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO evidence (
        id, case_id, user_id, title, type, source, date, time, description, account_username, file_url, file_type, file_size, risk_level, analysis_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'LOW', 'Pending')
    `).run(
      id,
      caseId,
      userId,
      title,
      type,
      source,
      evDate,
      time || '',
      description || '',
      accountUsername || '',
      fileUrl,
      fileType,
      fileSize
    );

    // Auto trigger AI analysis for quick response
    const aiService = new MockAIAnalysisService();
    const aiResult = await aiService.analyzeEvidence(title, description || '', type, source, fileType, req.file?.originalname);

    const aiId = `ai-${Date.now()}`;
    db.prepare(`
      INSERT OR REPLACE INTO ai_analysis (
        id, evidence_id, risk_level, score, confidence, detected_categories, key_indicators, extracted_text, explanation, metadata_analysis
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      aiId,
      id,
      aiResult.riskLevel,
      aiResult.score,
      aiResult.confidence,
      JSON.stringify(aiResult.detectedCategories),
      JSON.stringify(aiResult.keyIndicators),
      aiResult.extractedText,
      aiResult.explanation,
      JSON.stringify(aiResult.metadataAnalysis || null)
    );

    // Update evidence risk level and analysis status
    db.prepare('UPDATE evidence SET risk_level = ?, analysis_status = ? WHERE id = ?').run(
      aiResult.riskLevel,
      aiResult.riskLevel === 'HIGH' || aiResult.riskLevel === 'CRITICAL' ? 'Flagged' : 'Completed',
      id
    );

    // Notification if High or Critical risk
    if (aiResult.riskLevel === 'HIGH' || aiResult.riskLevel === 'CRITICAL') {
      const notifId = `notif-${Date.now()}`;
      db.prepare(`
        INSERT INTO notifications (id, user_id, title, message, type, link)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        notifId,
        userId,
        `High Risk Evidence Detected (${aiResult.riskLevel})`,
        `Evidence ${id} ("${title}") was flagged with ${aiResult.riskLevel} risk score (${aiResult.score}/100). Human review required.`,
        'alert',
        `/review`
      );
    }

    return res.json({
      id,
      caseId,
      title,
      type,
      source,
      date: evDate,
      time: time || '',
      description: description || '',
      accountUsername: accountUsername || '',
      fileUrl,
      fileType,
      fileSize,
      riskLevel: aiResult.riskLevel,
      analysisStatus: aiResult.riskLevel === 'HIGH' || aiResult.riskLevel === 'CRITICAL' ? 'Flagged' : 'Completed',
      aiAnalysis: aiResult,
      createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Evidence upload failed' });
  }
});

// Delete Evidence
evidenceRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM evidence WHERE id = ?').run(id);
    return res.json({ message: 'Evidence deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete evidence' });
  }
});

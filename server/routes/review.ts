import { Router } from 'express';
import { db } from '../db.js';

export const reviewRouter = Router();

// Get items in Review Queue
reviewRouter.get('/', (req, res) => {
  try {
    const pendingItems: any[] = db.prepare(`
      SELECT e.*, 
             c.title as case_title,
             a.score as ai_score,
             a.confidence as ai_confidence,
             a.detected_categories as ai_categories,
             a.key_indicators as ai_indicators,
             a.explanation as ai_explanation
      FROM evidence e
      JOIN cases c ON e.case_id = c.id
      LEFT JOIN ai_analysis a ON e.id = a.evidence_id
      ORDER BY e.created_at DESC
    `).all();

    const formatted = pendingItems.map((item) => ({
      evidence: {
        id: item.id,
        caseId: item.case_id,
        caseTitle: item.case_title,
        title: item.title,
        type: item.type,
        source: item.source,
        date: item.date,
        description: item.description,
        fileUrl: item.file_url,
        riskLevel: item.risk_level,
        analysisStatus: item.analysis_status,
        createdAt: item.created_at
      },
      aiAnalysis: item.ai_score ? {
        score: item.ai_score,
        confidence: item.ai_confidence,
        detectedCategories: JSON.parse(item.ai_categories || '[]'),
        keyIndicators: JSON.parse(item.ai_indicators || '[]'),
        explanation: item.ai_explanation
      } : null,
      reviews: db.prepare('SELECT * FROM human_reviews WHERE evidence_id = ? ORDER BY timestamp DESC').all(item.id)
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch review queue' });
  }
});

// Submit Human Review Decision
reviewRouter.post('/', (req, res) => {
  try {
    const { evidenceId, finalRisk, action, notes } = req.body;

    if (!evidenceId || !finalRisk || !action) {
      return res.status(400).json({ error: 'Evidence ID, final risk, and action are required' });
    }

    const ev: any = db.prepare('SELECT * FROM evidence WHERE id = ?').get(evidenceId);
    if (!ev) {
      return res.status(404).json({ error: 'Evidence item not found' });
    }

    const reviewId = `rev-${Date.now()}`;
    const reviewerId = 'user-demo-001';
    const reviewerName = 'Demo Human Reviewer';

    // Save audit record
    db.prepare(`
      INSERT INTO human_reviews (
        id, evidence_id, case_id, reviewer_id, reviewer_name, original_risk, final_risk, action, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reviewId,
      evidenceId,
      ev.case_id,
      reviewerId,
      reviewerName,
      ev.risk_level,
      finalRisk,
      action,
      notes || ''
    );

    // Update evidence final risk level and mark Completed
    db.prepare('UPDATE evidence SET risk_level = ?, analysis_status = ? WHERE id = ?').run(
      finalRisk,
      'Completed',
      evidenceId
    );

    // Notification
    const notifId = `notif-${Date.now()}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      notifId,
      reviewerId,
      'Human Review Completed',
      `Review submitted for ${evidenceId}: Status updated to "${action}" with final risk "${finalRisk}".`,
      'success',
      `/cases/${ev.case_id}`
    );

    return res.json({
      message: 'Human review submitted successfully',
      reviewId,
      evidenceId,
      finalRisk,
      action
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit human review' });
  }
});

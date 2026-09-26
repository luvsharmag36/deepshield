import { Router } from 'express';
import { db } from '../db.js';
import { MockAIAnalysisService } from '../services/MockAIAnalysisService.js';

export const analysisRouter = Router();

// Trigger AI analysis on evidence
analysisRouter.post('/:evidenceId', async (req, res) => {
  try {
    const { evidenceId } = req.params;
    const ev: any = db.prepare('SELECT * FROM evidence WHERE id = ?').get(evidenceId);

    if (!ev) {
      return res.status(404).json({ error: 'Evidence item not found' });
    }

    const aiService = new MockAIAnalysisService();
    const result = await aiService.analyzeEvidence(ev.title, ev.description || '', ev.type, ev.source, ev.file_type);

    const aiId = `ai-${Date.now()}`;
    db.prepare(`
      INSERT OR REPLACE INTO ai_analysis (
        id, evidence_id, risk_level, score, confidence, detected_categories, key_indicators, extracted_text, explanation, metadata_analysis
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      aiId,
      evidenceId,
      result.riskLevel,
      result.score,
      result.confidence,
      JSON.stringify(result.detectedCategories),
      JSON.stringify(result.keyIndicators),
      result.extractedText,
      result.explanation,
      JSON.stringify(result.metadataAnalysis || null)
    );

    db.prepare('UPDATE evidence SET risk_level = ?, analysis_status = ? WHERE id = ?').run(
      result.riskLevel,
      result.riskLevel === 'HIGH' || result.riskLevel === 'CRITICAL' ? 'Flagged' : 'Completed',
      evidenceId
    );

    return res.json({
      id: aiId,
      evidenceId,
      ...result
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI analysis failed' });
  }
});

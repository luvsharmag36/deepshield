import { Router } from 'express';
import { db } from '../db.js';
import { ReportGeneratorService } from '../services/ReportGeneratorService.js';

export const reportsRouter = Router();

function getReportData(caseId: string) {
  const caseItem: any = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId);
  if (!caseItem) return null;

  const evidenceRows: any[] = db.prepare('SELECT * FROM evidence WHERE case_id = ? ORDER BY date ASC').all(caseId);
  const evidenceList = evidenceRows.map((e) => ({
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

  const analysisRows: any[] = db.prepare(`
    SELECT a.* FROM ai_analysis a
    JOIN evidence e ON a.evidence_id = e.id
    WHERE e.case_id = ?
  `).all(caseId);

  const analyses = analysisRows.map((a) => ({
    id: a.id,
    evidenceId: a.evidence_id,
    riskLevel: a.risk_level,
    score: a.score,
    confidence: a.confidence,
    detectedCategories: JSON.parse(a.detected_categories || '[]'),
    keyIndicators: JSON.parse(a.key_indicators || '[]'),
    extractedText: a.extracted_text,
    explanation: a.explanation,
    createdAt: a.created_at
  }));

  const reviewRows: any[] = db.prepare(`
    SELECT r.* FROM human_reviews r
    JOIN evidence e ON r.evidence_id = e.id
    WHERE e.case_id = ?
    ORDER BY r.timestamp DESC
  `).all(caseId);

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

  return {
    caseInfo: {
      id: caseItem.id,
      title: caseItem.title,
      description: caseItem.description,
      category: caseItem.category,
      status: caseItem.status,
      createdAt: caseItem.created_at,
      updatedAt: caseItem.updated_at
    },
    evidenceList,
    analyses,
    reviews,
    generatedAt: new Date().toISOString(),
    generatedBy: 'Demo Investigator'
  };
}

// Get Report JSON Data
reportsRouter.get('/:caseId/json', (req, res) => {
  try {
    const data = getReportData(req.params.caseId);
    if (!data) {
      return res.status(404).json({ error: 'Case not found' });
    }
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to compile report data' });
  }
});

// Download Report PDF
reportsRouter.get('/:caseId/pdf', (req, res) => {
  try {
    const data = getReportData(req.params.caseId);
    if (!data) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const pdfDoc = ReportGeneratorService.generatePdf(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=DeepShield_Report_${data.caseInfo.id}.pdf`);

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate PDF report' });
  }
});

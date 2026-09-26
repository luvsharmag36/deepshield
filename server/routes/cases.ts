import { Router } from 'express';
import { db } from '../db.js';

export const casesRouter = Router();

// List cases
casesRouter.get('/', (req, res) => {
  try {
    const cases: any[] = db.prepare(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM evidence WHERE case_id = c.id) as evidenceCount,
        (SELECT COUNT(*) FROM evidence WHERE case_id = c.id AND (risk_level = 'HIGH' OR risk_level = 'CRITICAL')) as highRiskCount
      FROM cases c
      ORDER BY c.created_at DESC
    `).all();

    const formatted = cases.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      category: c.category,
      status: c.status,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      evidenceCount: c.evidenceCount,
      highRiskCount: c.highRiskCount
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch cases' });
  }
});

// Get case details by ID
casesRouter.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const caseItem: any = db.prepare('SELECT * FROM cases WHERE id = ?').get(id);

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const evidenceList: any[] = db.prepare('SELECT * FROM evidence WHERE case_id = ? ORDER BY date DESC, created_at DESC').all(id);

    const formattedEvidence = evidenceList.map(e => ({
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

    return res.json({
      id: caseItem.id,
      title: caseItem.title,
      description: caseItem.description,
      category: caseItem.category,
      status: caseItem.status,
      createdAt: caseItem.created_at,
      updatedAt: caseItem.updated_at,
      evidenceList: formattedEvidence
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch case details' });
  }
});

// Create Case
casesRouter.post('/', (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const id = `DS-CASE-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = 'user-demo-001';

    db.prepare(`
      INSERT INTO cases (id, user_id, title, description, category, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, title, description || '', category, status || 'Open');

    // Create notification
    const notifId = `notif-${Date.now()}`;
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(notifId, userId, 'New Case Created', `Case ${id} ("${title}") was successfully created.`, 'info', `/cases/${id}`);

    return res.json({
      id,
      title,
      description,
      category,
      status: status || 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidenceCount: 0,
      highRiskCount: 0
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create case' });
  }
});

// Update Case
casesRouter.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, status } = req.body;

    db.prepare(`
      UPDATE cases 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          category = COALESCE(?, category),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(title, description, category, status, id);

    return res.json({ message: 'Case updated successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update case' });
  }
});

// Delete Case
casesRouter.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM cases WHERE id = ?').run(id);
    return res.json({ message: 'Case deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete case' });
  }
});

import { Router } from 'express';
import { db } from '../db.js';

export const notificationsRouter = Router();

// Get Notifications
notificationsRouter.get('/', (req, res) => {
  try {
    const userId = 'user-demo-001';
    const rows: any[] = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId);

    const formatted = rows.map((n) => ({
      id: n.id,
      userId: n.user_id,
      title: n.title,
      message: n.message,
      type: n.type,
      isRead: Boolean(n.is_read),
      link: n.link,
      createdAt: n.created_at
    }));

    return res.json(formatted);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch notifications' });
  }
});

// Mark single as read
notificationsRouter.put('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
    return res.json({ message: 'Marked as read' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update notification' });
  }
});

// Mark all as read
notificationsRouter.put('/read-all', (req, res) => {
  try {
    const userId = 'user-demo-001';
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    return res.json({ message: 'All notifications marked as read' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update notifications' });
  }
});

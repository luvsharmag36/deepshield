import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDB, db } from './db.js';
import { seedData } from './seed.js';
import { authRouter } from './routes/auth.js';
import { casesRouter } from './routes/cases.js';
import { evidenceRouter } from './routes/evidence.js';
import { analysisRouter } from './routes/analysis.js';
import { reviewRouter } from './routes/review.js';
import { reportsRouter } from './routes/reports.js';
import { notificationsRouter } from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Database & Seed if empty
initDB();
const userCount: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (!userCount || userCount.count === 0) {
  seedData();
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder
const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/review', reviewRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DeepShield Backend', timestamp: new Date().toISOString() });
});

// Serve frontend static build in production if available
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('{*path}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`DeepShield backend server running on http://localhost:${PORT}`);
});

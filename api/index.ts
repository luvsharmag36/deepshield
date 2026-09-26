import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDB, db } from '../server/db.js';
import { seedData } from '../server/seed.js';
import { authRouter } from '../server/routes/auth.js';
import { casesRouter } from '../server/routes/cases.js';
import { evidenceRouter } from '../server/routes/evidence.js';
import { analysisRouter } from '../server/routes/analysis.js';
import { reviewRouter } from '../server/routes/review.js';
import { reportsRouter } from '../server/routes/reports.js';
import { notificationsRouter } from '../server/routes/notifications.js';

const app = express();

// Initialize Database & Seed if empty (auto-runs on Vercel cold boot)
try {
  initDB();
  const userCount: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (!userCount || userCount.count === 0) {
    seedData();
  }
} catch (e) {
  console.error('Vercel DB Init Notice:', e);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads folder (for tmp uploads on Vercel)
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routers
app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);
app.use('/api/evidence', evidenceRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/review', reviewRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'DeepShield Backend', 
    platform: 'Vercel Serverless', 
    timestamp: new Date().toISOString() 
  });
});

export default app;

import bcrypt from 'bcryptjs';
import { db, initDB } from './db.js';

export async function seedData() {
  initDB();

  console.log('Seeding database with DeepShield demo records...');

  // 1. Demo User
  const demoUserId = 'user-demo-001';
  const passwordHash = await bcrypt.hash('Demo@123', 10);

  db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(demoUserId, 'Demo User', 'demo@deepshield.local', passwordHash, 'Investigator');

  // 2. Sample Cases
  const case1Id = 'DS-CASE-1001';
  const case2Id = 'DS-CASE-1002';

  db.prepare(`
    INSERT OR REPLACE INTO cases (id, user_id, title, description, category, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    case1Id,
    demoUserId,
    'Persistent Instagram Stalking & Threat Messages',
    'Ongoing cyberstalking campaign involving explicit threats of location tracking and repeated unwanted DMs across multiple burner accounts.',
    'Cyberstalking',
    'Open',
    '2026-09-20T10:30:00.000Z'
  );

  db.prepare(`
    INSERT OR REPLACE INTO cases (id, user_id, title, description, category, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    case2Id,
    demoUserId,
    'Deepfake Image Leak & Impersonation Account',
    'Suspected AI-generated manipulated media uploaded to fake social profile impersonating target individual.',
    'Image Manipulation',
    'Under Review',
    '2026-09-22T14:15:00.000Z'
  );

  // 3. Sample Evidence Items
  const ev1 = {
    id: 'DS-EV-0001',
    caseId: case1Id,
    title: 'Explicit Violent Threat DM Screenshot',
    type: 'Screenshot',
    source: 'Instagram DM (@shadow_track_99)',
    date: '2026-09-20',
    time: '22:14',
    description: 'Screenshot showing direct text: "I know where you live and what time you get home alone. Watch your step."',
    accountUsername: '@shadow_track_99',
    riskLevel: 'CRITICAL',
    analysisStatus: 'Flagged'
  };

  const ev2 = {
    id: 'DS-EV-0002',
    caseId: case1Id,
    title: 'Repeated Unwanted Contact & Coercion Message',
    type: 'Message',
    source: 'WhatsApp (+1-555-0192)',
    date: '2026-09-21',
    time: '01:45',
    description: 'Message stating: "Pay me or I will expose and leak your private personal photos to your workplace."',
    accountUsername: '+1-555-0192',
    riskLevel: 'CRITICAL',
    analysisStatus: 'Flagged'
  };

  const ev3 = {
    id: 'DS-EV-0003',
    caseId: case2Id,
    title: 'Suspected AI-Generated Deepfake Portrait',
    type: 'Image',
    source: 'Telegram Channel',
    date: '2026-09-22',
    time: '18:00',
    description: 'Edited portrait photo with obvious boundary distortion around facial features and synthetic lighting artifacts.',
    accountUsername: '@anon_uploader',
    riskLevel: 'HIGH',
    analysisStatus: 'Flagged'
  };

  const ev4 = {
    id: 'DS-EV-0004',
    caseId: case2Id,
    title: 'Impersonation Profile Screenshot',
    type: 'Social Media Profile',
    source: 'Twitter / X',
    date: '2026-09-23',
    time: '11:20',
    description: 'Profile using victim stolen photo and full name posting derogatory claims.',
    accountUsername: '@fake_victim_profile',
    riskLevel: 'MEDIUM',
    analysisStatus: 'Completed'
  };

  const ev5 = {
    id: 'DS-EV-0005',
    caseId: case1Id,
    title: 'Personal Incident Log Document',
    type: 'Document',
    source: 'Notes App Export',
    date: '2026-09-24',
    time: '09:00',
    description: 'Self-reported timeline of incidents between Sept 15 and Sept 24.',
    accountUsername: 'N/A',
    riskLevel: 'LOW',
    analysisStatus: 'Completed'
  };

  const evidenceArray = [ev1, ev2, ev3, ev4, ev5];

  for (const ev of evidenceArray) {
    db.prepare(`
      INSERT OR REPLACE INTO evidence (
        id, case_id, user_id, title, type, source, date, time, description, account_username, risk_level, analysis_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      ev.id,
      ev.caseId,
      demoUserId,
      ev.title,
      ev.type,
      ev.source,
      ev.date,
      ev.time,
      ev.description,
      ev.accountUsername,
      ev.riskLevel,
      ev.analysisStatus
    );
  }

  // 4. Sample AI Analyses
  db.prepare(`
    INSERT OR REPLACE INTO ai_analysis (
      id, evidence_id, risk_level, score, confidence, detected_categories, key_indicators, extracted_text, explanation, metadata_analysis
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ai-seed-001',
    'DS-EV-0001',
    'CRITICAL',
    92,
    94,
    JSON.stringify(['Threat / Intimidation', 'Cyberstalking']),
    JSON.stringify(['Explicit Threat of Harm / Violence', 'Cyberstalking & Surveillance Indicator']),
    '[OCR Extracted]: "I know where you live and what time you get home alone. Watch your step."',
    'CRITICAL RISK: Direct explicit threat of harm combined with active location tracking signals detected. Immediate human verification required. [AI-assisted prototype analysis — not forensic verification.]',
    JSON.stringify({ fileDimensions: '1170x2532 px', fileFormat: 'image/png', compressionSignals: 'Clean PNG' })
  );

  db.prepare(`
    INSERT OR REPLACE INTO ai_analysis (
      id, evidence_id, risk_level, score, confidence, detected_categories, key_indicators, extracted_text, explanation, metadata_analysis
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ai-seed-002',
    'DS-EV-0002',
    'CRITICAL',
    88,
    91,
    JSON.stringify(['Blackmail / Coercion', 'Abusive Communication']),
    JSON.stringify(['Blackmail / Coercion / Extortion Indicator', 'Persistent Repeated Unwanted Contact']),
    'Message text: "Pay me or I will expose and leak your private personal photos to your workplace."',
    'CRITICAL RISK: Coercive blackmail language detected demanding payment/actions under threat of photo leakage. [AI-assisted prototype analysis — not forensic verification.]',
    null
  );

  db.prepare(`
    INSERT OR REPLACE INTO ai_analysis (
      id, evidence_id, risk_level, score, confidence, detected_categories, key_indicators, extracted_text, explanation, metadata_analysis
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'ai-seed-003',
    'DS-EV-0003',
    'HIGH',
    76,
    88,
    JSON.stringify(['Media Manipulation', 'Impersonation']),
    JSON.stringify(['Suspected Media Manipulation / Deepfake Artifacts']),
    'Portrait photo file analysis',
    'HIGH RISK: Facial boundary inconsistencies and lighting vector mismatches detected (76% confidence signal). [AI-assisted prototype analysis — not forensic verification.]',
    JSON.stringify({
      fileDimensions: '2048x2048 px',
      fileFormat: 'image/jpeg',
      compressionSignals: 'JPEG Quantization Anomaly',
      manipulationSignals: [
        'Inconsistent ELA heatmap variance around jawline',
        'Potential facial boundary blurring artifacts detected (76% confidence)',
        'Non-uniform specular highlights'
      ]
    })
  );

  // 5. Sample Human Reviews
  db.prepare(`
    INSERT OR REPLACE INTO human_reviews (
      id, evidence_id, case_id, reviewer_id, reviewer_name, original_risk, final_risk, action, notes, timestamp
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'rev-seed-001',
    'DS-EV-0001',
    case1Id,
    demoUserId,
    'Demo Investigator',
    'CRITICAL',
    'CRITICAL',
    'Confirmed',
    'Confirmed explicit threat language. Verified user identity and documented screenshot timestamp.',
    '2026-09-21T14:30:00.000Z'
  );

  // 6. Sample Notifications
  const notifications = [
    {
      id: 'notif-001',
      title: 'High Risk Evidence Flagged',
      message: 'Evidence DS-EV-0001 was assigned CRITICAL risk score (92/100). Human review required.',
      type: 'alert',
      isRead: 0,
      link: '/review'
    },
    {
      id: 'notif-002',
      title: 'Deepfake Signal Detected',
      message: 'Image DS-EV-0003 contains synthetic manipulation indicators (76% confidence).',
      type: 'warning',
      isRead: 0,
      link: '/cases/DS-CASE-1002'
    },
    {
      id: 'notif-003',
      title: 'Case Report Available',
      message: 'Report ready for download for Case DS-CASE-1001.',
      type: 'success',
      isRead: 1,
      link: '/reports'
    }
  ];

  for (const n of notifications) {
    db.prepare(`
      INSERT OR REPLACE INTO notifications (id, user_id, title, message, type, is_read, link)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(n.id, demoUserId, n.title, n.message, n.type, n.isRead, n.link);
  }

  console.log('Database seeding complete successfully!');
}

if (process.argv[1]?.includes('seed')) {
  seedData();
}

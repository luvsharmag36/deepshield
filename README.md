# DeepShield Women — AI-Assisted Cyber-Harassment Evidence Vault

**DeepShield Women** is a full-stack web application prototype designed to help users organize, evaluate risk, catalog, and report digital cyber-harassment evidence (threatening messages, cyberstalking, fake accounts, abusive communications, and manipulated/deepfake media).

> **Prototype Disclaimer:** DeepShield Women provides organizational assistance and heuristic risk classification. AI outputs serve as decision-support aids requiring human verification and do not constitute legally binding forensic or criminal determinations.

---

## 🌟 Key Features

1. **Cybersecurity SaaS Landing Page & Demo Access:** Modern light/dark navy interface with 1-click Demo credentials (`demo@deepshield.local` / `Demo@123`).
2. **Multi-Format Evidence Vault:** Drag & drop uploader for screenshots, text messages, social media profile links, documents, and media files.
3. **Automated AI Risk Heuristic Engine:** Transparent risk scoring engine evaluating explicit violence threats, extortion, stalking indicators, and visual media manipulation signals (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
4. **Human-in-the-Loop (HITL) Governance:** Review Center enabling human investigators to confirm, modify, or reject AI threat flags with complete audit trails:
   $$\text{AI Assessment} + \text{Human Review} = \text{Final Case Assessment}$$
5. **Chronological Incident Timeline:** Visual timeline mapping harassment events over time with filter controls and pattern analysis.
6. **Case Management:** Group evidence into structured investigation cases.
7. **Downloadable PDF Case Reports:** Server-side PDF export compiler (`pdfkit`) synthesizing case overview, evidence inventories, AI findings, and reviewer audit logs.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Run Commands

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Seed Initial Demo Data:**
   ```bash
   npm run seed
   ```

3. **Start Development Environment (Frontend + Backend):**
   ```bash
   npm run dev
   ```
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:5000

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 🔑 Demo Account Credentials

- **Email:** `demo@deepshield.local`
- **Password:** `Demo@123`

Click the **"Use Demo Account (1-Click Login)"** button on the login screen to enter immediately.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend:** Node.js, Express, SQLite (`better-sqlite3`), Multer file handler
- **Report Engine:** PDFKit server-side PDF generator
- **AI Abstraction Layer:** `MockAIAnalysisService` (pluggable interface for future model integration)

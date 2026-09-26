import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { CasesPage } from './pages/CasesPage.js';
import { CaseDetailPage } from './pages/CaseDetailPage.js';
import { EvidenceUploadPage } from './pages/EvidenceUploadPage.js';
import { AIAnalysisPage } from './pages/AIAnalysisPage.js';
import { TimelinePage } from './pages/TimelinePage.js';
import { ReviewCenterPage } from './pages/ReviewCenterPage.js';
import { ReportsPage } from './pages/ReportsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/evidence" element={<DashboardPage />} />
          <Route path="/evidence/:id" element={<AIAnalysisPage />} />
          <Route path="/upload" element={<EvidenceUploadPage />} />
          <Route path="/analysis" element={<AIAnalysisPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/review" element={<ReviewCenterPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

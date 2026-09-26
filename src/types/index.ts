export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EvidenceType = 
  | 'Screenshot' 
  | 'Message' 
  | 'Social Media Profile' 
  | 'Image' 
  | 'Video' 
  | 'Document';

export type CaseStatus = 'Open' | 'Under Review' | 'Resolved' | 'Archived';

export type CaseCategory = 
  | 'Cyberstalking' 
  | 'Threat' 
  | 'Harassment' 
  | 'Fake Account' 
  | 'Image Manipulation' 
  | 'Impersonation' 
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface CaseItem {
  id: string;
  title: string;
  description: string;
  category: CaseCategory;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  evidenceCount?: number;
  highRiskCount?: number;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  type: EvidenceType;
  source: string;
  date: string;
  time?: string;
  description: string;
  accountUsername?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  riskLevel: RiskLevel;
  analysisStatus: 'Pending' | 'Completed' | 'Flagged';
  createdAt: string;
}

export interface AIAnalysisResult {
  id: string;
  evidenceId: string;
  riskLevel: RiskLevel;
  score: number; // 0 - 100
  confidence: number; // 0 - 100
  detectedCategories: string[];
  keyIndicators: string[];
  extractedText?: string;
  explanation: string;
  metadataAnalysis?: {
    fileDimensions?: string;
    fileFormat?: string;
    compressionSignals?: string;
    manipulationSignals?: string[];
  };
  suggestedMetadata?: Record<string, string>;
  createdAt: string;
}

export interface HumanReviewRecord {
  id: string;
  evidenceId: string;
  caseId?: string;
  reviewerId: string;
  reviewerName: string;
  originalRisk: RiskLevel;
  finalRisk: RiskLevel;
  action: 'Confirmed' | 'Modified Risk' | 'Rejected Flag';
  notes: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface CaseReportData {
  caseInfo: CaseItem;
  evidenceList: EvidenceItem[];
  analyses: AIAnalysisResult[];
  reviews: HumanReviewRecord[];
  generatedAt: string;
  generatedBy: string;
}

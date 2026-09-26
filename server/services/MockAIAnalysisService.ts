import { RiskAssessmentEngine } from './RiskAssessmentEngine.js';

export interface AIAnalysisOutput {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  score: number;
  confidence: number;
  detectedCategories: string[];
  keyIndicators: string[];
  extractedText: string;
  explanation: string;
  metadataAnalysis?: {
    fileDimensions?: string;
    fileFormat?: string;
    compressionSignals?: string;
    manipulationSignals?: string[];
  };
  suggestedMetadata?: Record<string, string>;
}

export class MockAIAnalysisService {
  /**
   * Performs AI-assisted classification and threat analysis on digital evidence items.
   */
  public async analyzeEvidence(
    title: string,
    description: string,
    type: string,
    source: string,
    fileType?: string,
    fileName?: string
  ): Promise<AIAnalysisOutput> {
    // Simulate brief AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const combinedText = `${title} ${description}`;
    const riskEval = RiskAssessmentEngine.calculateRisk(combinedText, title, type);

    // Extract categories
    const categories: string[] = [];
    if (riskEval.indicators.some(i => i.includes('Threat'))) categories.push('Threat / Intimidation');
    if (riskEval.indicators.some(i => i.includes('Stalking'))) categories.push('Cyberstalking');
    if (riskEval.indicators.some(i => i.includes('Blackmail'))) categories.push('Blackmail / Coercion');
    if (riskEval.indicators.some(i => i.includes('Abusive'))) categories.push('Abusive Communication');
    if (riskEval.indicators.some(i => i.includes('Impersonation'))) categories.push('Impersonation');
    if (riskEval.indicators.some(i => i.includes('Manipulation'))) categories.push('Media Manipulation');

    if (categories.length === 0) {
      categories.push('General Evidence Item');
    }

    // Extracted text mock
    let extractedText = description;
    if (type === 'Screenshot' || type === 'Image') {
      extractedText = `[OCR Extracted Text]: "${description.length > 20 ? description : 'User message capture: ' + title}"`;
    }

    // Metadata analysis for images/screenshots
    let metadataAnalysis;
    if (type === 'Image' || type === 'Screenshot') {
      const isSuspected = riskEval.indicators.some(i => i.includes('Manipulation')) || description.toLowerCase().includes('fake');
      metadataAnalysis = {
        fileDimensions: '1920x1080 px',
        fileFormat: fileType || 'image/png',
        compressionSignals: isSuspected ? 'High Compression Variance Detected (JPEG Quantization Anomaly)' : 'Standard PNG Compression',
        manipulationSignals: isSuspected ? [
          'Inconsistent ELA (Error Level Analysis) heatmap variance',
          'Potential facial boundary blurring artifacts detected (72% confidence)',
          'Non-uniform lighting vectors observed on target subject'
        ] : [
          'EXIF headers intact',
          'Uniform compression artifacts'
        ]
      };
    }

    // Confidence metric (82 - 96%)
    const confidence = Math.floor(82 + Math.random() * 14);

    return {
      riskLevel: riskEval.level,
      score: riskEval.score,
      confidence,
      detectedCategories: categories,
      keyIndicators: riskEval.indicators,
      extractedText,
      explanation: `${riskEval.explanation} [AI-assisted prototype analysis — not forensic verification.]`,
      metadataAnalysis,
      suggestedMetadata: {
        'Platform': source,
        'Flagged Language Count': String(riskEval.indicators.length),
        'AI Provider': 'DeepShield Heuristic Engine v1.0'
      }
    };
  }
}

export interface RiskEvaluation {
  score: number;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  indicators: string[];
  explanation: string;
  requiresHumanReview: boolean;
}

export class RiskAssessmentEngine {
  /**
   * Calculates transparent risk score based on detected indicators and text analysis.
   */
  public static calculateRisk(text: string, title: string, evidenceType: string): RiskEvaluation {
    const content = `${title} ${text}`.toLowerCase();
    const indicators: string[] = [];
    let score = 10; // Baseline score

    // Threat / Violence checks
    if (/(kill|hurt|destroy|find you|track you|end you|watch your step|know where you live)/i.test(content)) {
      indicators.push('Explicit Threat of Harm / Violence');
      score += 45;
    }

    // Blackmail / Coercion checks
    if (/(expose|pay me|send money|leak|share your photos|ruin your life|tell everyone)/i.test(content)) {
      indicators.push('Blackmail / Coercion / Extortion Indicator');
      score += 35;
    }

    // Stalking / Location tracking
    if (/(following you|outside your|saw you at|know what time|home alone|looking at you)/i.test(content)) {
      indicators.push('Cyberstalking & Surveillance Indicator');
      score += 30;
    }

    // Severe Harassment & Abusive Language
    if (/(bitch|whore|slut|die|hate you|ugly|worthless|ruin you)/i.test(content)) {
      indicators.push('Severe Abusive / Degrading Language');
      score += 25;
    }

    // Impersonation / Fake Profile
    if (/(fake account|stole your photo|impersonat|pretending to be|catfish)/i.test(content)) {
      indicators.push('Impersonation / Fraudulent Profile Activity');
      score += 20;
    }

    // Repeated unwanted contact
    if (/(block me|kept calling|multiple messages|every day|stop messaging)/i.test(content)) {
      indicators.push('Persistent Repeated Unwanted Contact');
      score += 15;
    }

    // Media manipulation signal
    if (evidenceType === 'Image' || evidenceType === 'Screenshot') {
      if (/(deepfake|fake image|edited|photoshop|manipulated|altered photo)/i.test(content)) {
        indicators.push('Suspected Media Manipulation / Deepfake Artifacts');
        score += 20;
      }
    }

    // Cap score at 100
    score = Math.min(100, score);

    // Determine Risk Level
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) {
      level = 'CRITICAL';
    } else if (score >= 60) {
      level = 'HIGH';
    } else if (score >= 35) {
      level = 'MEDIUM';
    }

    const requiresHumanReview = level === 'HIGH' || level === 'CRITICAL';

    let explanation = 'Low severity detected based on routine content evaluation.';
    if (level === 'CRITICAL') {
      level = 'CRITICAL';
      explanation = 'CRITICAL RISK: Multiple severe indicators (e.g. violent threats, coercion, or active surveillance) were detected. Urgent human review required.';
    } else if (level === 'HIGH') {
      explanation = 'HIGH RISK: Explicit harassment or threat language detected. Human verification is strongly recommended.';
    } else if (level === 'MEDIUM') {
      explanation = 'MEDIUM RISK: Persistent unwanted contact or abusive terms flagged for monitoring.';
    }

    if (indicators.length === 0) {
      indicators.push('Standard digital artifact (no severe threat keywords detected)');
    }

    return {
      score,
      level,
      indicators,
      explanation,
      requiresHumanReview
    };
  }
}

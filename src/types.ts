export type AlignmentLevel = 'Excellent' | 'Strong' | 'Moderate' | 'Weak';
export type GapPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScoreBreakdown {
  requiredSkills: number; // 0-40 (weight 40%)
  relevantExperience: number; // 0-25 (weight 25%)
  roleAlignment: number; // 0-20 (weight 20%)
  educationQualifications: number; // 0-10 (weight 10%)
  relevantKeywords: number; // 0-5 (weight 5%)
  explanation: string;
}

export interface SkillMatchSection {
  matched: string[];
  partiallyMatched: string[];
  missing: string[];
  percentage: number; // 0-100
  technicalSkills?: string[];
  toolsAndPlatforms?: string[];
}

export interface MissingGaps {
  high: string[];
  medium: string[];
  low: string[];
}

export interface CourseRecommendation {
  courseOrTopic: string;
  reason: string;
  priority: GapPriority;
}

export interface ScoreBoosterTip {
  category: string;
  currentGap: string;
  actionableTip: string;
  potentialPoints: number;
  exampleRewrite?: string;
}

export interface GeneralAtsTip {
  title: string;
  category: string;
  tip: string;
  impact: string;
}

export interface CandidateAnalysis {
  candidateId: string;
  candidateName: string;
  atsScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  skillSetMatch: SkillMatchSection;
  alignment: AlignmentLevel;
  alignmentExplanation: string;
  alignmentFactors: {
    jobRole: string;
    responsibilities: string;
    experience: string;
    projects: string;
    technologies: string;
    education: string;
    certifications: string;
  };
  missingGaps: MissingGaps;
  recommendedCourses: CourseRecommendation[];
  scoreBoosterTips?: ScoreBoosterTip[];
}

export interface CandidateRank {
  rank: number;
  candidateName: string;
  atsScore: number;
  skillMatch: number;
  alignment: AlignmentLevel;
  keyStrengths: string;
}

export interface AnalysisResult {
  jobTitle?: string;
  jobDescriptionSummary?: string;
  candidates: CandidateAnalysis[];
  ranking: CandidateRank[];
  shortlistRecommendation: {
    recommendedCandidateNames: string[];
    explanation: string;
  };
  generalAtsTips?: GeneralAtsTip[];
  rawMarkdownReport: string;
  timestamp: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: 'jd' | 'resume';
  content: string; // extracted text
  base64?: string; // if PDF
  mimeType?: string;
  fileSize?: number;
}

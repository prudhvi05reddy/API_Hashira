import React, { useState } from 'react';
import { UploadedDoc, AnalysisResult } from './types';
import { WhatsAppChatListScreen } from './components/WhatsAppChatListScreen';
import { AtsFullScreenAnalyzer } from './components/AtsFullScreenAnalyzer';
import { RulesModal } from './components/RulesModal';
import {
  SAMPLE_JOB_DESCRIPTION,
  SAMPLE_RESUME_1,
  SAMPLE_RESUME_2,
  SAMPLE_RESUME_3,
  SAMPLE_ANALYSIS_RESULT,
} from './data/sampleData';

export default function App() {
  // Pre-load with sample documents and evaluation result so user immediately sees live ATS scores & details!
  const defaultJd: UploadedDoc = {
    id: 'sample_jd_1',
    name: 'Senior Full Stack Engineer (CloudScale Technologies).txt',
    type: 'jd',
    content: SAMPLE_JOB_DESCRIPTION,
    mimeType: 'text/plain',
    fileSize: SAMPLE_JOB_DESCRIPTION.length,
  };

  const defaultResumes: UploadedDoc[] = [
    {
      id: 'sample_res_1',
      name: 'Alexander Rivera - Resume.txt',
      type: 'resume',
      content: SAMPLE_RESUME_1,
      mimeType: 'text/plain',
      fileSize: SAMPLE_RESUME_1.length,
    },
    {
      id: 'sample_res_2',
      name: 'Priya Patel - Resume.txt',
      type: 'resume',
      content: SAMPLE_RESUME_2,
      mimeType: 'text/plain',
      fileSize: SAMPLE_RESUME_2.length,
    },
    {
      id: 'sample_res_3',
      name: 'Marcus Vance - Resume.txt',
      type: 'resume',
      content: SAMPLE_RESUME_3,
      mimeType: 'text/plain',
      fileSize: SAMPLE_RESUME_3.length,
    },
  ];

  const [jobDescription, setJobDescription] = useState<UploadedDoc | null>(defaultJd);
  const [resumes, setResumes] = useState<UploadedDoc[]>(defaultResumes);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(SAMPLE_ANALYSIS_RESULT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFullScreenAtsOpen, setIsFullScreenAtsOpen] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  // 1-Click Load Realistic Sample Data & Immediately View Results
  const handleLoadSample = () => {
    setJobDescription(defaultJd);
    setResumes(defaultResumes);
    setAnalysisResult(SAMPLE_ANALYSIS_RESULT);
    setError(null);
  };

  const handleReset = () => {
    setJobDescription(null);
    setResumes([]);
    setAnalysisResult(null);
    setError(null);
  };

  const handleRunAnalysis = async () => {
    if (!jobDescription || resumes.length === 0) {
      setError('Please provide one Job Description and at least one Candidate Resume.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalyzingStep('Validating documents & initializing ATS scanner...');

    try {
      setAnalyzingStep('Evaluating 5-factor weighted scores & skill matches...');
      const payload = {
        jobDescription: {
          name: jobDescription.name,
          text: jobDescription.content,
          base64: jobDescription.base64,
          mimeType: jobDescription.mimeType,
        },
        resumes: resumes.map((r) => ({
          id: r.id,
          name: r.name,
          text: r.content,
          base64: r.base64,
          mimeType: r.mimeType,
        })),
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${response.status}`);
      }

      setAnalyzingStep('Formulating gap analysis, ranking, and score booster tips...');
      const data: AnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Error running ATS analysis:', err);
      let message = err?.message || 'An unexpected error occurred while analyzing resumes.';
      if (message.includes('503') || message.includes('high demand') || message.includes('UNAVAILABLE')) {
        message =
          'The AI model experienced a temporary spike in traffic (503 Service Unavailable). We have enabled automatic multi-model failover. Please click "Retry" below to re-submit your evaluation.';
      }
      setError(message);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStep('');
    }
  };

  const highestAtsScore = analysisResult?.candidates?.length
    ? Math.max(...analysisResult.candidates.map((c) => c.atsScore))
    : 94;

  return (
    <div className="min-h-screen bg-[#0B141A] text-slate-100 font-sans relative">
      {/* 1. PRIMARY BACKGROUND: WHATSAPP CHAT LIST SCREEN (Matching user's screenshot) */}
      <WhatsAppChatListScreen
        onOpenAtsAnalyzer={() => {
          setIsFullScreenAtsOpen(true);
        }}
        onLoadSample={handleLoadSample}
        resumesCount={resumes.length}
        highestScore={highestAtsScore}
      />

      {/* 2. FULL SCREEN ATS RESUME ANALYZER (Opens in full screen when user clicks bottom right green ATS icon) */}
      {isFullScreenAtsOpen && (
        <AtsFullScreenAnalyzer
          onClose={() => setIsFullScreenAtsOpen(false)}
          jobDescription={jobDescription}
          resumes={resumes}
          analysisResult={analysisResult}
          onSetJobDescription={setJobDescription}
          onAddResume={(doc) => setResumes((prev) => [...prev, doc])}
          onRemoveResume={(id) => setResumes((prev) => prev.filter((r) => r.id !== id))}
          onRunAnalysis={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          analyzingStep={analyzingStep}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
          onOpenRules={() => setRulesModalOpen(true)}
        />
      )}

      {/* 3. RULES AND SCORING MODAL */}
      <RulesModal isOpen={rulesModalOpen} onClose={() => setRulesModalOpen(false)} />
    </div>
  );
}

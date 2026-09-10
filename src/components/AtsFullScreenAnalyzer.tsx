import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Upload,
  FileText,
  FileCheck,
  Trash2,
  Sparkles,
  Zap,
  RotateCcw,
  Target,
  Trophy,
  Users,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  HelpCircle,
  Printer,
  ChevronRight,
  MessageCircle,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { UploadedDoc, AnalysisResult, CandidateAnalysis } from '../types';
import { readFileAsTextOrBase64 } from '../utils/fileParser';
import { RankingTable } from './RankingTable';
import { CandidateCard } from './CandidateCard';
import { AtsTipsSection } from './AtsTipsSection';
import { MarkdownReportView } from './MarkdownReportView';
import { WhatsAppChartWidget } from './WhatsAppChartWidget';

interface AtsFullScreenAnalyzerProps {
  onClose: () => void;
  jobDescription: UploadedDoc | null;
  resumes: UploadedDoc[];
  analysisResult: AnalysisResult | null;
  onSetJobDescription: (doc: UploadedDoc | null) => void;
  onAddResume: (doc: UploadedDoc) => void;
  onRemoveResume: (id: string) => void;
  onRunAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
  analyzingStep?: string;
  onLoadSample: () => void;
  onReset: () => void;
  onOpenRules: () => void;
}

export const AtsFullScreenAnalyzer: React.FC<AtsFullScreenAnalyzerProps> = ({
  onClose,
  jobDescription,
  resumes,
  analysisResult,
  onSetJobDescription,
  onAddResume,
  onRemoveResume,
  onRunAnalysis,
  isAnalyzing,
  analyzingStep,
  onLoadSample,
  onReset,
  onOpenRules,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'candidates' | 'charts' | 'tips' | 'chat' | 'report'>('upload');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [pasteMode, setPasteMode] = useState<'jd' | 'resume' | null>(null);
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  // File upload handler
  const handleFileUpload = async (files: FileList | null, forceType?: 'jd' | 'resume') => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsed = await readFileAsTextOrBase64(file);
        const isJd = forceType === 'jd' || file.name.toLowerCase().includes('jd') || file.name.toLowerCase().includes('job');
        const doc: UploadedDoc = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type: isJd ? 'jd' : 'resume',
          content: parsed.text || '',
          base64: parsed.base64,
          mimeType: parsed.mimeType,
          fileSize: file.size,
        };

        if (doc.type === 'jd') {
          onSetJobDescription(doc);
        } else {
          onAddResume(doc);
        }
      } catch (err) {
        console.error('File parsing error:', err);
      }
    }
  };

  // Paste text handler
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || !pasteMode) return;

    const doc: UploadedDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: pastedTitle.trim() || (pasteMode === 'jd' ? 'Job Description (Pasted)' : 'Candidate Resume (Pasted)'),
      type: pasteMode,
      content: pastedText.trim(),
      mimeType: 'text/plain',
      fileSize: pastedText.length,
    };

    if (pasteMode === 'jd') {
      onSetJobDescription(doc);
    } else {
      onAddResume(doc);
    }

    setPasteMode(null);
    setPastedTitle('');
    setPastedText('');
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files, 'resume');
    }
  };

  // Chart preparation
  const scoreChartData = (analysisResult?.candidates || []).map((c) => ({
    name: c.candidateName.split(' ')[0],
    fullName: c.candidateName,
    atsScore: c.atsScore,
    skillMatch: c.skillSetMatch?.percentage || 0,
    alignment: c.alignment,
    fill: c.atsScore >= 80 ? '#10B981' : c.atsScore >= 60 ? '#F59E0B' : '#EF4444',
  }));

  const factorRadarData = [
    { factor: 'Required Skills (40%)', weight: 40, fullMark: 40 },
    { factor: 'Experience (25%)', weight: 25, fullMark: 25 },
    { factor: 'Role Alignment (20%)', weight: 20, fullMark: 20 },
    { factor: 'Education (10%)', weight: 10, fullMark: 10 },
    { factor: 'Keywords (5%)', weight: 5, fullMark: 5 },
  ];

  const highestScore = analysisResult?.candidates?.length
    ? Math.max(...analysisResult.candidates.map((c) => c.atsScore))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 text-slate-900 flex flex-col overflow-y-auto font-sans animate-in fade-in duration-200">
      {/* Hidden file inputs */}
      <input
        ref={jdInputRef}
        type="file"
        accept=".pdf,.txt,.docx,.doc,.md"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files, 'jd')}
      />
      <input
        ref={resumeInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.docx,.doc,.md"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files, 'resume')}
      />

      {/* TOP FULL SCREEN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Back button to return to WhatsApp */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00A884]/10 hover:bg-[#00A884]/20 text-[#00A884] font-bold text-xs transition-colors cursor-pointer border border-[#00A884]/20"
            title="Return to WhatsApp Chats"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp Chats</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>ATS Resume Analyzer</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Full Screen Mode
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Upload Job Description & candidate resumes to calculate 5-factor compatibility scores (0-100)
            </p>
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            title="Load realistic candidate resumes and Job Description"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sample Data</span>
          </button>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-colors cursor-pointer"
            title="View 5-Factor ATS Scoring Rules"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Scoring Formula</span>
          </button>

          {/* Close / Return X button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Close Full Screen"
            aria-label="Close Full Screen"
          >
            ✕
          </button>
        </div>
      </header>

      {/* VIEW TABS BAR */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between overflow-x-auto no-scrollbar shrink-0 gap-2">
        <div className="flex items-center space-x-1.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="h-3.5 w-3.5 text-emerald-600" />
            <span>Upload Documents ({resumes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span>Leaderboard & Cards</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'charts'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-indigo-600" />
            <span>Visual Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tips'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Score Booster Tips</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-[#00A884] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 text-white" />
            <span>WhatsApp Bot</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-slate-600" />
            <span>Report</span>
          </button>
        </div>

        {/* Quick Run Evaluation Button */}
        <button
          onClick={onRunAnalysis}
          disabled={isAnalyzing || !jobDescription || resumes.length === 0}
          className="px-3.5 py-1.5 rounded-xl bg-[#00A884] hover:bg-[#009373] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Zap className="h-3.5 w-3.5 fill-white" />
          <span>{isAnalyzing ? 'Calculating ATS Scores...' : 'Run ATS Evaluation'}</span>
        </button>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* SUMMARY STATS BANNER */}
        {analysisResult && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#00A884] to-emerald-400 flex items-center justify-center text-slate-950 font-black font-mono text-lg shadow-md">
                {highestScore}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  Top ATS Candidate Match
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {analysisResult.ranking?.[0]?.candidateName || 'Alexander Rivera'}
                </h3>
                <p className="text-xs text-slate-300">
                  Target Role: <strong className="text-white">{analysisResult.jobTitle}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Shortlisted</span>
                <span className="text-sm font-bold text-emerald-300">
                  {analysisResult.shortlistRecommendation?.recommendedCandidateNames?.length || 1} of {analysisResult.candidates?.length || resumes.length}
                </span>
              </div>

              <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block">Threshold</span>
                <span className="text-sm font-bold text-white font-mono">70+ Score</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: UPLOAD DOCUMENTS & RESUMES */}
        {activeTab === 'upload' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* INSTRUCTIONS BOX */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
              <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">Welcome to the ATS Resume Screener!</h4>
                <p className="mt-0.5 leading-relaxed text-emerald-800">
                  Upload your <strong>Job Description</strong> and one or more <strong>Candidate Resumes</strong> (PDF, DOCX, or TXT).
                  Then click <strong>"Run ATS Evaluation"</strong> to calculate weighted compatibility scores, detect skill gaps, and view visual charts!
                </p>
              </div>
            </div>

            {/* TWO-COLUMN UPLOAD SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* 1. JOB DESCRIPTION CARD */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                        1
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">Target Job Description</h3>
                    </div>
                    {jobDescription && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </div>

                  {jobDescription ? (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
                          <span className="font-bold text-xs text-slate-800 truncate">
                            {jobDescription.name}
                          </span>
                        </div>
                        <button
                          onClick={() => onSetJobDescription(null)}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove JD"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3">
                        {jobDescription.content.substring(0, 250)}...
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {(jobDescription.fileSize / 1024).toFixed(1)} KB • {jobDescription.content.length} characters
                      </span>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3 bg-slate-50/50">
                      <Target className="h-8 w-8 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-xs font-semibold text-slate-700">Upload Target Job Description</p>
                        <p className="text-[11px] text-slate-400">PDF, DOCX, or TXT file</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          onClick={() => jdInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          Browse File
                        </button>
                        <button
                          onClick={() => setPasteMode('jd')}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-colors cursor-pointer"
                        >
                          Paste Text
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Benchmark requirement for ATS screening</span>
                  <button
                    onClick={onLoadSample}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    Use Sample Role
                  </button>
                </div>
              </div>

              {/* 2. CANDIDATE RESUMES CARD */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-colors ${
                  isDraggingOver ? 'border-[#00A884] bg-emerald-50/40' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        2
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        Candidate Resumes ({resumes.length})
                      </h3>
                    </div>
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-[#00A884] hover:bg-[#009373] text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Resume</span>
                    </button>
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onClick={() => resumeInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl p-4 text-center space-y-1.5 cursor-pointer transition-colors"
                  >
                    <Upload className="h-6 w-6 text-[#00A884] mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Drop Candidate Resumes here or click to browse
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports PDF, DOCX, and TXT files • Multi-file upload allowed
                    </p>
                  </div>

                  {/* Resumes List */}
                  <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {resumes.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileCheck className="h-4 w-4 text-[#00A884] shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {res.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono shrink-0">
                            ({(res.fileSize / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveResume(res.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                          title="Remove Resume"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Attach up to 10 resumes for batch ranking</span>
                  <button
                    onClick={() => setPasteMode('resume')}
                    className="text-[#00A884] hover:underline font-semibold cursor-pointer"
                  >
                    Paste Resume Text
                  </button>
                </div>
              </div>

            </div>

            {/* PASTE MODAL / FORM */}
            {pasteMode && (
              <div className="bg-white rounded-2xl border border-slate-300 p-5 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    Paste {pasteMode === 'jd' ? 'Job Description' : 'Candidate Resume'} Text
                  </h4>
                  <button
                    onClick={() => setPasteMode(null)}
                    className="text-slate-400 hover:text-slate-700 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handlePasteSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    placeholder={pasteMode === 'jd' ? 'Role Title (e.g. Senior Backend Engineer)' : 'Candidate Name (e.g. Rahul Sharma)'}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#00A884] focus:outline-hidden"
                  />
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste the full text here..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#00A884] focus:outline-hidden"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setPasteMode(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!pastedText.trim()}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#00A884] text-white hover:bg-[#009373] disabled:opacity-50 cursor-pointer"
                    >
                      Save Document
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* EVALUATE ACTION CARD */}
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center space-y-3 shadow-lg border border-slate-700">
              <Zap className="h-10 w-10 text-[#00A884] mx-auto animate-pulse" />
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-white">Ready for ATS Evaluation?</h3>
                <p className="text-xs text-slate-300">
                  Click below to screen all loaded candidate resumes against the Job Description using the 5-factor scoring engine.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onRunAnalysis}
                  disabled={isAnalyzing || !jobDescription || resumes.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-[#00A884] hover:bg-[#009373] text-white font-bold text-sm shadow-lg shadow-[#00A884]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>{analyzingStep || 'Screening Resumes...'}</span>
                    </span>
                  ) : (
                    `⚡ Calculate ATS Scores (${resumes.length} Candidates)`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LEADERBOARD & CANDIDATE CARDS */}
        {activeTab === 'dashboard' && analysisResult && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Ranking Table */}
            <RankingTable
              ranking={analysisResult.ranking}
              shortlistRecommendation={analysisResult.shortlistRecommendation}
              onSelectCandidate={(name) => {
                const cand = analysisResult.candidates.find((c) => c.candidateName === name);
                if (cand) setSelectedCandidateId(cand.candidateId);
              }}
              onViewTips={() => setActiveTab('tips')}
            />

            {/* Candidate Cards Grid */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  Detailed Candidate Evaluations
                </h3>
                <span className="text-xs text-slate-500">
                  Showing {analysisResult.candidates.length} candidates
                </span>
              </div>

              <div className="space-y-4">
                {analysisResult.candidates.map((candidate, idx) => (
                  <div key={candidate.candidateId} id={`candidate-card-${candidate.candidateId}`}>
                    <CandidateCard
                      candidate={candidate}
                      index={idx}
                      totalCandidates={analysisResult.candidates.length}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VISUAL CHARTS */}
        {activeTab === 'charts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Comparative Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Candidate Comparative ATS Scores
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Scale: 0-100</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreChartData} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl space-y-1">
                                <p className="font-bold">{d.fullName}</p>
                                <p className="text-emerald-300 font-mono font-bold">
                                  ATS Score: {d.atsScore}/100
                                </p>
                                <p className="text-slate-300 text-[11px]">Alignment: {d.alignment}</p>
                                <p className="text-indigo-300 text-[11px]">Skill Match: {d.skillMatch}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="atsScore" radius={[6, 6, 0, 0]}>
                        {scoreChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-around text-xs pt-2 border-t border-slate-100 text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
                    <span>80-100 (Excellent)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-amber-500 inline-block" />
                    <span>60-79 (Moderate)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500 inline-block" />
                    <span>0-59 (Low)</span>
                  </span>
                </div>
              </div>

              {/* 5-Factor Radar Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    5-Factor ATS Scoring Weights
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold">100% Total Weight</span>
                </div>

                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={factorRadarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10, fill: '#1e293b' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} />
                      <Radar
                        name="Maximum Weight"
                        dataKey="weight"
                        stroke="#00A884"
                        fill="#00A884"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  Required Skills: <strong>40%</strong> • Experience: <strong>25%</strong> • Role Alignment: <strong>20%</strong> • Education: <strong>10%</strong> • Keywords: <strong>5%</strong>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: SCORE BOOSTER TIPS */}
        {activeTab === 'tips' && (
          <div className="animate-in fade-in duration-150">
            <AtsTipsSection
              candidates={analysisResult?.candidates || []}
              generalTips={analysisResult?.generalAtsTips || []}
            />
          </div>
        )}

        {/* TAB 5: WHATSAPP RECRUITER ASSISTANT CHAT */}
        {activeTab === 'chat' && (
          <div className="animate-in fade-in duration-150">
            <WhatsAppChartWidget
              analysisResult={analysisResult}
              jobDescription={jobDescription}
              resumes={resumes}
              onSetJobDescription={onSetJobDescription}
              onAddResume={onAddResume}
              onRemoveResume={onRemoveResume}
              onRunAnalysis={onRunAnalysis}
              isAnalyzing={isAnalyzing}
              onLoadSample={onLoadSample}
              isOpen={true}
              onToggleOpen={() => {}}
              isPrimaryView={true}
            />
          </div>
        )}

        {/* TAB 6: STANDALONE REPORT */}
        {activeTab === 'report' && analysisResult && (
          <div className="animate-in fade-in duration-150">
            <MarkdownReportView
              markdown={analysisResult.rawMarkdownReport || '# ATS Analysis Report\nNo markdown available.'}
              jobTitle={analysisResult.jobTitle}
            />
          </div>
        )}

      </main>
    </div>
  );
};

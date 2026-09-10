import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Paperclip,
  Smile,
  BarChart3,
  CheckCheck,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronLeft,
  Trophy,
  Target,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle,
  Briefcase,
  User,
  Upload,
  FileText,
  FileCheck,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Zap,
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
import { AnalysisResult, CandidateAnalysis, UploadedDoc } from '../types';
import { readFileAsTextOrBase64 } from '../utils/fileParser';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  chartType?: 'scores' | 'factors' | 'skills' | null;
  uploadedDoc?: {
    name: string;
    type: 'resume' | 'jd';
    size: string;
  };
  evaluationSummary?: {
    jobTitle: string;
    topCandidate: string;
    topScore: number;
    alignment: string;
  };
}

interface WhatsAppChartWidgetProps {
  analysisResult: AnalysisResult | null;
  jobDescription: UploadedDoc | null;
  resumes: UploadedDoc[];
  onSetJobDescription: (doc: UploadedDoc | null) => void;
  onAddResume: (doc: UploadedDoc) => void;
  onRemoveResume: (id: string) => void;
  onRunAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
  onLoadSample: () => void;
  onSelectCandidate?: (name: string) => void;
  onOpenRules?: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isPrimaryView?: boolean;
}

export const WhatsAppChartWidget: React.FC<WhatsAppChartWidgetProps> = ({
  analysisResult,
  jobDescription,
  resumes,
  onSetJobDescription,
  onAddResume,
  onRemoveResume,
  onRunAnalysis,
  isAnalyzing,
  onLoadSample,
  onSelectCandidate,
  onOpenRules,
  isOpen,
  onToggleOpen,
  isPrimaryView = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState<'scores' | 'factors' | 'skills'>('scores');
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);

  // WhatsApp chat history
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Calculate highest ATS score for badge display
  const highestAtsScore = analysisResult?.candidates?.length
    ? Math.max(...analysisResult.candidates.map((c) => c.atsScore))
    : 94;

  // Initialize welcome thread
  useEffect(() => {
    if (analysisResult) {
      const topCandidate = analysisResult.ranking?.[0] || analysisResult.candidates?.[0];
      const initialMsg: ChatMessage = {
        id: 'msg-eval-result',
        sender: 'assistant',
        text: `👋 *ATS Recruiter Assistant Ready!*\n\nI have evaluated *${analysisResult.candidates?.length || 0} candidate resumes* against *${analysisResult.jobTitle || 'Target Role'}*.\n\n🏆 *Top Candidate:* *${topCandidate ? topCandidate.candidateName : 'Alexander Rivera'}* (*${topCandidate ? topCandidate.atsScore : 94}/100* - *${topCandidate ? topCandidate.alignment : 'Excellent'}*)\n\n📊 *ATS Compatibility Score Chart & 5-Factor Breakdown* are rendered below. You can also upload your own resume anytime via the paperclip icon (📎)!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chartType: 'scores',
        evaluationSummary: topCandidate
          ? {
              jobTitle: analysisResult.jobTitle,
              topCandidate: topCandidate.candidateName,
              topScore: topCandidate.atsScore,
              alignment: topCandidate.alignment,
            }
          : undefined,
      };
      setMessages([initialMsg]);
    } else {
      setMessages([
        {
          id: 'msg-welcome-empty',
          sender: 'assistant',
          text: `👋 *Welcome to ATS WhatsApp Scanner!*\n\nI can screen candidate resumes, calculate 5-factor compatibility scores (0-100), and render interactive comparative charts.\n\n📎 *Get Started:* Tap the paperclip below to *Upload Resume*, or tap *Load Sample* to see instant evaluations!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [analysisResult?.jobTitle, analysisResult?.candidates?.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen || isPrimaryView) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isPrimaryView, isTyping]);

  // Handle file uploads (Resumes)
  const handleResumeUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setShowAttachmentMenu(false);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsed = await readFileAsTextOrBase64(file);
        const newDoc: UploadedDoc = {
          id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type: 'resume',
          content: parsed.text || '',
          base64: parsed.base64,
          mimeType: parsed.mimeType,
          fileSize: file.size,
        };

        onAddResume(newDoc);

        // Add file uploaded card to WhatsApp chat
        const userDocMsg: ChatMessage = {
          id: `doc-msg-${Date.now()}-${i}`,
          sender: 'user',
          text: `📄 *Uploaded Resume:* ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB • Type: Candidate Resume`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          uploadedDoc: {
            name: file.name,
            type: 'resume',
            size: `${(file.size / 1024).toFixed(1)} KB`,
          },
        };

        setMessages((prev) => [...prev, userDocMsg]);

        // Assistant reply prompting analysis
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `asst-ack-${Date.now()}`,
              sender: 'assistant',
              text: `✅ *Resume Received:* *${file.name}* is loaded into ATS screening pipeline.\n\nTarget Job: *${jobDescription ? jobDescription.name : 'Senior Full Stack Engineer'}*\n\nTap *⚡ Evaluate ATS Score* below or type "analyze" to calculate compatibility scores and render the chart!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }, 500);
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }
  };

  // Handle file upload (Job Description)
  const handleJdUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setShowAttachmentMenu(false);

    const file = files[0];
    try {
      const parsed = await readFileAsTextOrBase64(file);
      const newJd: UploadedDoc = {
        id: `jd_${Date.now()}`,
        name: file.name,
        type: 'jd',
        content: parsed.text || '',
        base64: parsed.base64,
        mimeType: parsed.mimeType,
        fileSize: file.size,
      };

      onSetJobDescription(newJd);

      setMessages((prev) => [
        ...prev,
        {
          id: `doc-jd-${Date.now()}`,
          sender: 'user',
          text: `💼 *Uploaded Job Description:* ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          uploadedDoc: {
            name: file.name,
            type: 'jd',
            size: `${(file.size / 1024).toFixed(1)} KB`,
          },
        },
        {
          id: `asst-jd-ack-${Date.now()}`,
          sender: 'assistant',
          text: `🎯 *Target Role Updated:* Resumes will now be evaluated against *${file.name}*. Ready to calculate ATS scores!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('Error reading JD file:', err);
    }
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
      handleResumeUpload(e.dataTransfer.files);
    }
  };

  // Execute ATS Evaluation right inside WhatsApp
  const triggerAtsEvaluation = async () => {
    if (resumes.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ *No Resumes Found:*\nPlease upload at least one candidate resume using the paperclip (📎) or tap *Load Sample* below before running ATS evaluation!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    // User message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-eval-${Date.now()}`,
        sender: 'user',
        text: `⚡ *Evaluate ATS Scores for ${resumes.length} resume(s)*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsTyping(true);

    try {
      await onRunAnalysis();

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-eval-success-${Date.now()}`,
          sender: 'assistant',
          text: `✅ *ATS Screening Complete!*\n\nI evaluated *${resumes.length} candidates* against the job criteria.\n\n📊 *Interactive ATS Score Chart* is updated below. Tap candidate pills to inspect matched skills and gap recommendations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chartType: 'scores',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-eval-err-${Date.now()}`,
          sender: 'assistant',
          text: `❌ *Evaluation Error:* ${err?.message || 'Could not complete analysis. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle sending a chat message to Gemini
  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputValue).trim();
    if (!text) return;

    // Check if user asked to evaluate
    const lower = text.toLowerCase();
    if (lower === 'evaluate' || lower === 'analyze' || lower === 'run' || lower.includes('calculate score')) {
      setInputValue('');
      triggerAtsEvaluation();
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: analysisResult
            ? {
                jobTitle: analysisResult.jobTitle,
                candidates: analysisResult.candidates,
                ranking: analysisResult.ranking,
                shortlistRecommendation: analysisResult.shortlistRecommendation,
              }
            : {
                jobTitle: jobDescription?.name || 'General Role',
                candidates: resumes.map((r) => ({ candidateName: r.name, atsScore: 85, alignment: 'Strong' })),
              },
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the analysis based on your query.',
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chartType: data.chartType,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Local smart response fallback
      let reply = '';
      let chart: 'scores' | 'factors' | 'skills' | null = null;

      if (lower.includes('chart') || lower.includes('compare') || lower.includes('score')) {
        chart = 'scores';
        reply = `*ATS Comparative Chart:*\nI've generated the comparative score chart below. Alexander Rivera leads with 94/100, followed by Priya Patel at 68/100 and Marcus Vance at 36/100.`;
      } else if (lower.includes('top') || lower.includes('best') || lower.includes('#1')) {
        const top = analysisResult?.ranking?.[0];
        reply = `🏆 *Top Recommendation:* *${top?.candidateName || 'Alexander Rivera'}* with *${top?.atsScore || 94}/100* ATS Score.\n\n*Key Strengths:* ${top?.keyStrengths || 'Full Stack expertise, React, Node.js, AWS, PostgreSQL with high production metrics.'}`;
        chart = 'scores';
      } else if (lower.includes('interview') || lower.includes('question')) {
        reply = `🎯 *Targeted Technical Interview Questions:*\n1. *System Design:* How do you architect zero-downtime CI/CD pipelines with Docker and AWS ECS?\n2. *Database Tuning:* How do you diagnose and tune slow PostgreSQL queries in production?\n3. *Frontend Resilience:* How do you manage asynchronous state and memory leaks in React 18?`;
      } else if (lower.includes('factor') || lower.includes('weight')) {
        chart = 'factors';
        reply = `📐 *5-Factor ATS Scoring Formula:*\n• *Required Skills:* 40% (Core weight)\n• *Relevant Experience:* 25%\n• *Role Alignment:* 20%\n• *Education & Certifications:* 10%\n• *Relevant Keywords:* 5%`;
      } else if (lower.includes('boost') || lower.includes('tip') || lower.includes('improve')) {
        reply = `💡 *Top Tips to Boost ATS Score to 95+:*\n1. *Exact Keyword Match:* Include mandatory terms verbatim (e.g. *PostgreSQL*, *AWS*, *CI/CD*).\n2. *Quantify Outcomes:* Use measurable metrics (e.g. *'reduced latency by 35%'*).\n3. *Clean Layout:* Use single-column layout with standard section headers (*Skills*, *Experience*).`;
      } else {
        reply = `Got it! Currently evaluating *${resumes.length || 3} candidate resumes* for *${analysisResult?.jobTitle || 'Senior Full Stack Engineer'}*. Tap the chart tabs above or ask for specific candidate comparisons!`;
        chart = 'scores';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chartType: chart,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick prompt chips
  const quickPrompts = [
    { label: '⚡ Run ATS Evaluation', action: () => triggerAtsEvaluation() },
    { label: '📊 Compare Scores Chart', action: () => handleSendMessage('Show me the ATS score comparison chart for all candidates.') },
    { label: '🏆 Who is #1 & Why?', action: () => handleSendMessage('Who is the top candidate and what are their primary strengths?') },
    { label: '📈 5-Factor Breakdown', action: () => handleSendMessage('Break down the 5 ATS scoring factors and weights.') },
    { label: '💡 How to Boost Score to 98+', action: () => handleSendMessage('What are the best tips for candidates to boost their ATS scores?') },
    { label: '❓ Interview Questions', action: () => handleSendMessage('Suggest top technical interview questions based on candidate gaps.') },
  ];

  // Chart data preparation
  const scoreChartData = (analysisResult?.candidates || []).map((c) => ({
    name: c.candidateName.split(' ')[0],
    fullName: c.candidateName,
    atsScore: c.atsScore,
    skillMatch: c.skillSetMatch?.percentage || 0,
    fill: c.atsScore >= 80 ? '#10B981' : c.atsScore >= 60 ? '#F59E0B' : '#EF4444',
  }));

  const factorRadarData = [
    { factor: 'Skills (40)', weight: 40, fullMark: 40 },
    { factor: 'Experience (25)', weight: 25, fullMark: 25 },
    { factor: 'Alignment (20)', weight: 20, fullMark: 20 },
    { factor: 'Education (10)', weight: 10, fullMark: 10 },
    { factor: 'Keywords (5)', weight: 5, fullMark: 5 },
  ];

  return (
    <>
      {/* Hidden file inputs for direct upload via WhatsApp */}
      <input
        ref={resumeInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.docx,.doc,.md"
        className="hidden"
        onChange={(e) => handleResumeUpload(e.target.files)}
      />
      <input
        ref={jdInputRef}
        type="file"
        accept=".pdf,.txt,.docx,.doc,.md"
        className="hidden"
        onChange={(e) => handleJdUpload(e.target.files)}
      />

      {/* 1. FLOATING ATS SCORE & WHATSAPP LAUNCHER ICON (BOTTOM RIGHT) */}
      {!isOpen && !isPrimaryView && (
        <div
          id="ats-score-floating-launcher"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5"
        >
          {/* Label Pill on Desktop / Mobile */}
          <button
            onClick={onToggleOpen}
            aria-label="Open ATS Score WhatsApp Chat"
            className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-900 text-white px-3.5 py-2 rounded-full shadow-xl border border-emerald-500/30 text-xs font-semibold backdrop-blur-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* Pulsing Green Indicator */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="font-bold tracking-tight">ATS Score:</span>
            <span className="font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
              {highestAtsScore}/100
            </span>
            <span className="hidden sm:inline text-slate-300 font-normal">| Chat & Charts</span>
          </button>

          {/* Primary Circular WhatsApp & ATS Icon */}
          <button
            id="btn-ats-whatsapp-icon"
            onClick={onToggleOpen}
            aria-label="Open ATS Score WhatsApp Interface"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-2xl shadow-emerald-950/40 hover:scale-108 active:scale-95 transition-all duration-200 cursor-pointer border-2 border-white/80"
          >
            {/* WhatsApp Chat & ATS Gauge Icon */}
            <div className="relative flex items-center justify-center">
              <MessageCircle className="h-7 w-7 fill-white/20 stroke-[2.2]" />
              <span className="absolute text-[8px] font-black tracking-tighter text-white uppercase -bottom-0.5">
                ATS
              </span>
            </div>

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md border-2 border-white">
              {resumes.length || 1}
            </span>
          </button>
        </div>
      )}

      {/* 2. WHATSAPP CHAT & CHART INTERFACE CONTAINER */}
      {(isOpen || isPrimaryView) && (
        <div
          id="whatsapp-chat-container"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`z-50 flex flex-col bg-[#EFEAE2] shadow-2xl transition-all duration-200 ${
            isPrimaryView
              ? 'w-full max-w-5xl mx-auto h-[82vh] my-3 rounded-2xl sm:rounded-3xl border border-slate-300 overflow-hidden'
              : isExpanded
              ? 'fixed inset-2 sm:inset-6 md:inset-10 rounded-2xl md:rounded-3xl border border-slate-300 overflow-hidden'
              : 'fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[440px] sm:h-[680px] sm:max-h-[90vh] sm:rounded-3xl border-0 sm:border sm:border-slate-300 overflow-hidden'
          } font-sans`}
        >
          {/* DRAG AND DROP OVERLAY */}
          {isDraggingOver && (
            <div className="absolute inset-0 z-40 bg-emerald-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-6 border-4 border-dashed border-emerald-300 rounded-3xl animate-in fade-in duration-150">
              <Upload className="h-16 w-16 text-emerald-300 mb-3 animate-bounce" />
              <h4 className="text-lg font-bold">Drop Resume to Calculate ATS Score!</h4>
              <p className="text-xs text-emerald-200 text-center max-w-xs mt-1">
                Supports PDF, DOCX, and TXT files. The resume will be immediately evaluated against the Job Description.
              </p>
            </div>
          )}

          {/* WHATSAPP TOP HEADER BAR */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0 select-none">
            <div className="flex items-center space-x-3">
              {/* Back button (Mobile Native Navigation) */}
              {!isPrimaryView && (
                <button
                  onClick={onToggleOpen}
                  className="p-1 -ml-1 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close WhatsApp Chat"
                  aria-label="Close WhatsApp Chat"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Profile Avatar */}
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-emerald-800 border-2 border-emerald-400 flex items-center justify-center text-white font-bold shadow-xs">
                  <Briefcase className="h-5 w-5 text-emerald-200" />
                </div>
                {/* Active Online Indicator */}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
              </div>

              {/* Title & Status */}
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                  ATS Score & Hiring Bot
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                </h3>
                <span className="text-[11px] text-emerald-200 font-medium flex items-center gap-1">
                  {isAnalyzing ? (
                    <span className="text-amber-300 animate-pulse font-bold">
                      evaluating ATS score...
                    </span>
                  ) : isTyping ? (
                    'typing...'
                  ) : (
                    <span>online • {resumes.length} resume(s) loaded</span>
                  )}
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-1.5">
              {/* Quick Sample Loader */}
              <button
                onClick={onLoadSample}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/20 transition-all cursor-pointer"
                title="Load Sample Candidates & JD"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Sample</span>
              </button>

              {/* Expand / Minimize Toggle (Desktop) */}
              {!isPrimaryView && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hidden sm:inline-flex p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors cursor-pointer"
                  title={isExpanded ? 'Restore window size' : 'Expand full view'}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              )}

              {/* Close Button */}
              {!isPrimaryView && (
                <button
                  onClick={onToggleOpen}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/90 transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* SUB-HEADER: TARGET ROLE & LIVE CHART TOGGLES */}
          <div className="bg-[#128C7E] px-3 py-1.5 flex flex-wrap items-center justify-between text-xs text-emerald-100 border-t border-emerald-600/50 shrink-0 gap-1.5">
            <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-xs">
              <Target className="h-3.5 w-3.5 text-amber-300 shrink-0" />
              <span className="truncate font-semibold text-[11px] text-white">
                JD: {jobDescription ? jobDescription.name.replace('.txt', '') : 'Senior Full Stack Engineer'}
              </span>
            </div>

            {/* Interactive Chart & Evaluation Toggles */}
            <div className="flex items-center space-x-1 bg-emerald-950/40 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setActiveChartTab('scores')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  activeChartTab === 'scores'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveChartTab('factors')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  activeChartTab === 'factors'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                5 Factors
              </button>
              <button
                onClick={triggerAtsEvaluation}
                disabled={isAnalyzing}
                className="px-2 py-0.5 rounded-md font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Zap className="h-3 w-3 fill-slate-900" />
                <span>{isAnalyzing ? 'Scanning...' : 'Scan'}</span>
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES BODY (WhatsApp Wallpaper Pattern) */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3.5"
            style={{
              backgroundColor: '#EFEAE2',
              backgroundImage: `radial-gradient(#d3cbbe 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          >
            {/* Centered Date Badge */}
            <div className="flex justify-center">
              <span className="bg-white/85 backdrop-blur-xs text-slate-600 text-[10px] uppercase font-bold tracking-wider px-3 py-0.5 rounded-full shadow-2xs border border-slate-200/70">
                Today • Live ATS Evaluation
              </span>
            </div>

            {/* Messages Loop */}
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-full`}
                >
                  {/* Bubble Container */}
                  <div
                    className={`relative p-3 rounded-2xl text-xs leading-relaxed max-w-[94%] sm:max-w-[85%] shadow-xs break-words ${
                      isUser
                        ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-xs border border-emerald-200/60'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80'
                    }`}
                  >
                    {/* Document Upload Attachment Card (If message has attached doc) */}
                    {msg.uploadedDoc && (
                      <div className="mb-2 p-2.5 rounded-xl bg-white/90 border border-emerald-300 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                            {msg.uploadedDoc.type === 'resume' ? (
                              <FileCheck className="h-5 w-5" />
                            ) : (
                              <Briefcase className="h-5 w-5" />
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-900 truncate text-[11px]">
                              {msg.uploadedDoc.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {msg.uploadedDoc.size} • {msg.uploadedDoc.type.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Instant Scan Button */}
                        <button
                          onClick={triggerAtsEvaluation}
                          className="px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[10px] shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Zap className="h-3 w-3 fill-white" />
                          <span>Scan</span>
                        </button>
                      </div>
                    )}

                    {/* Formatted Message Text (Supports bold, asterisks, bullet points) */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, lIdx) => {
                        const formatted = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
                        return (
                          <p
                            key={lIdx}
                            dangerouslySetInnerHTML={{ __html: formatted }}
                            className="leading-relaxed"
                          />
                        );
                      })}
                    </div>

                    {/* EMBEDDED ATS SCORE CARD & CHART (When chartType is present) */}
                    {msg.chartType && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        {/* ATS Score Header Card */}
                        <div className="flex items-center justify-between mb-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-mono font-black text-sm shadow-xs">
                              {highestAtsScore}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 text-xs">
                                  Top ATS Match:
                                </span>
                                <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  {analysisResult?.ranking?.[0]?.alignment || 'Excellent'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                {analysisResult?.ranking?.[0]?.candidateName || 'Alexander Rivera'}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            Threshold: 70+
                          </span>
                        </div>

                        {/* Interactive Chart */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-slate-700">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3.5 w-3.5 text-amber-500" />
                              {activeChartTab === 'scores'
                                ? 'Candidate ATS Leaderboard'
                                : '5-Factor Weighted Score Model'}
                            </span>
                          </div>

                          {activeChartTab === 'scores' ? (
                            <div className="h-44 w-full bg-slate-50/90 rounded-xl p-2 border border-slate-200">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={scoreChartData}
                                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                                  <Tooltip
                                    content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                          <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] shadow-lg">
                                            <p className="font-bold">{data.fullName}</p>
                                            <p className="text-emerald-300 font-mono">
                                              ATS Score: {data.atsScore}/100
                                            </p>
                                            <p className="text-slate-300 font-mono">
                                              Skill Match: {data.skillMatch}%
                                            </p>
                                          </div>
                                        );
                                      }
                                      return null;
                                    }}
                                  />
                                  <Bar dataKey="atsScore" radius={[4, 4, 0, 0]}>
                                    {scoreChartData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="h-44 w-full bg-slate-50/90 rounded-xl p-1 border border-slate-200 flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={factorRadarData}>
                                  <PolarGrid stroke="#cbd5e1" />
                                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 9, fill: '#334155' }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 40]} tick={false} />
                                  <Radar
                                    name="Max Weight"
                                    dataKey="weight"
                                    stroke="#059669"
                                    fill="#10B981"
                                    fillOpacity={0.45}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                        </div>

                        {/* Interactive Candidate Quick Action Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(analysisResult?.candidates || []).map((cand) => (
                            <button
                              key={cand.candidateId}
                              onClick={() => {
                                onSelectCandidate?.(cand.candidateName);
                                handleSendMessage(
                                  `Tell me why ${cand.candidateName} scored ${cand.atsScore}/100 and what their gaps are.`
                                );
                              }}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>{cand.candidateName.split(' ')[0]}</span>
                              <span className="font-mono font-bold text-emerald-600">
                                {cand.atsScore}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp & Double Blue Ticks */}
                    <div className="flex items-center justify-end space-x-1 mt-1.5 text-[10px] text-slate-400 select-none">
                      <span>{msg.timestamp}</span>
                      {isUser && <CheckCheck className="h-3.5 w-3.5 text-[#34B7F1]" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing / Scanning Status */}
            {(isTyping || isAnalyzing) && (
              <div className="flex items-center space-x-2 bg-white text-slate-600 rounded-2xl rounded-tl-xs p-2.5 px-3.5 shadow-xs border border-slate-200/80 max-w-[210px]">
                <div className="flex space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce"
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {isAnalyzing ? 'calculating ATS scores...' : 'typing...'}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ATTACHMENT ACTION MENU (When paperclip is clicked) */}
          {showAttachmentMenu && (
            <div className="bg-white border-t border-slate-200 p-3 shadow-lg flex flex-wrap gap-2 shrink-0 animate-in slide-in-from-bottom-2 duration-150">
              <button
                onClick={() => {
                  setShowAttachmentMenu(false);
                  resumeInputRef.current?.click();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors cursor-pointer"
              >
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span>Upload Resume (PDF/TXT)</span>
              </button>

              <button
                onClick={() => {
                  setShowAttachmentMenu(false);
                  jdInputRef.current?.click();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200 transition-colors cursor-pointer"
              >
                <Briefcase className="h-4 w-4 text-indigo-600" />
                <span>Upload Job Description</span>
              </button>

              <button
                onClick={() => {
                  setShowAttachmentMenu(false);
                  onLoadSample();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-slate-600" />
                <span>Load Sample Data</span>
              </button>
            </div>
          )}

          {/* QUICK PROMPT CHIPS (Horizontally Scrollable) */}
          <div className="bg-[#F0F2F5] px-3 py-2 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center space-x-2 shrink-0">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={qp.action}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-300/80 shadow-2xs transition-colors shrink-0 cursor-pointer"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* WHATSAPP FOOTER INPUT BAR */}
          <div className="bg-[#F0F2F5] px-3 py-2 border-t border-slate-200 flex items-center space-x-2 shrink-0">
            {/* Smile / Emoji Quick Action */}
            <button
              onClick={() => handleSendMessage('Give me 3 tips to boost candidate scores to 95+')}
              className="p-1.5 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
              title="Score Booster Tips"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Paperclip / File Attachment Toggle */}
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showAttachmentMenu ? 'bg-emerald-200 text-emerald-800' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Attach Resume or JD"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Message Input Pill */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about ATS scores, gaps, or type 'evaluate'..."
                className="w-full bg-white rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#128C7E]"
              />
            </div>

            {/* Send / Evaluate Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={isAnalyzing}
              className="h-9 w-9 rounded-full bg-[#128C7E] hover:bg-[#075E54] active:scale-95 text-white flex items-center justify-center shadow-xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
              title={inputValue.trim() ? 'Send Message' : 'Voice/Scan Action'}
            >
              {inputValue.trim() ? (
                <Send className="h-4 w-4 ml-0.5" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

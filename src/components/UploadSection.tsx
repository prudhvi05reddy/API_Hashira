import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  Edit3,
  AlertCircle,
  Eye,
  Check,
  RefreshCw,
} from 'lucide-react';
import { UploadedDoc } from '../types';
import { readFileAsTextOrBase64 } from '../utils/fileParser';

interface UploadSectionProps {
  jobDescription: UploadedDoc | null;
  resumes: UploadedDoc[];
  onSetJobDescription: (doc: UploadedDoc | null) => void;
  onAddResume: (doc: UploadedDoc) => void;
  onRemoveResume: (id: string) => void;
  onAutoClassify: (docs: UploadedDoc[]) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
  onLoadSample: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  jobDescription,
  resumes,
  onSetJobDescription,
  onAddResume,
  onRemoveResume,
  onAutoClassify,
  onRunAnalysis,
  isAnalyzing,
  onLoadSample,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pasteType, setPasteType] = useState<'jd' | 'resume'>('jd');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  const [previewDoc, setPreviewDoc] = useState<UploadedDoc | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jdInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null, forcedType?: 'jd' | 'resume') => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsed = await readFileAsTextOrBase64(file);
        const newDoc: UploadedDoc = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          type: forcedType || (file.name.toLowerCase().includes('jd') || file.name.toLowerCase().includes('job') ? 'jd' : 'resume'),
          content: parsed.text || '',
          base64: parsed.base64,
          mimeType: parsed.mimeType,
          fileSize: file.size,
        };

        if (newDoc.type === 'jd') {
          onSetJobDescription(newDoc);
        } else {
          onAddResume(newDoc);
        }
      } catch (err) {
        console.error('Failed to parse file:', file.name, err);
      }
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedContent.trim()) return;

    const newDoc: UploadedDoc = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: pastedTitle.trim() || (pasteType === 'jd' ? 'Job Description (Pasted)' : `Resume (Pasted)`),
      type: pasteType,
      content: pastedContent.trim(),
      mimeType: 'text/plain',
      fileSize: pastedContent.length,
    };

    if (pasteType === 'jd') {
      onSetJobDescription(newDoc);
    } else {
      onAddResume(newDoc);
    }

    setPastedTitle('');
    setPastedContent('');
  };

  // Convert all docs for AI Auto-Detection if user uploads mixed files
  const triggerAutoDetection = async () => {
    const allDocs: UploadedDoc[] = [];
    if (jobDescription) allDocs.push(jobDescription);
    resumes.forEach((r) => allDocs.push(r));

    if (allDocs.length < 2) return;

    setIsDetecting(true);
    try {
      const payload = {
        documents: allDocs.map((d) => ({
          id: d.id,
          name: d.name,
          textPreview: d.content.slice(0, 800),
        })),
      };

      const res = await fetch('/api/detect-doc-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Auto-detection failed');
      const data = await res.json();

      if (data.classifications && Array.isArray(data.classifications)) {
        let foundJD: UploadedDoc | null = null;
        const newResumes: UploadedDoc[] = [];

        for (const item of data.classifications) {
          const doc = allDocs.find((d) => d.id === item.id);
          if (doc) {
            if (item.type === 'jd' && !foundJD) {
              foundJD = { ...doc, type: 'jd' };
            } else {
              newResumes.push({ ...doc, type: 'resume' });
            }
          }
        }

        if (foundJD) onSetJobDescription(foundJD);
        // replace resumes
        // Clear existing and re-add
        resumes.forEach((r) => onRemoveResume(r.id));
        newResumes.forEach((r) => onAddResume(r));
      }
    } catch (error) {
      console.error('Error during auto-detect:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const canRun = Boolean(jobDescription && resumes.length > 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="h-6 w-6 text-indigo-600" />
              Recruiter Intake: Job Description & Candidate Resumes
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Provide exactly <strong>one Job Description</strong> and <strong>one or more candidate resumes</strong> (PDF, TXT, or text).
              Our AI first validates and separates documents to ensure the JD is never confused with a resume.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-quick-sample-load"
              onClick={onLoadSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>Load Realistic Sample</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle (File Upload vs Paste Text) */}
        <div className="flex items-center gap-2 mt-6 border-b border-slate-100 pb-3">
          <button
            id="tab-upload-files"
            onClick={() => setActiveTab('upload')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload Documents (PDF / TXT)</span>
          </button>
          <button
            id="tab-paste-text"
            onClick={() => setActiveTab('paste')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'paste'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Paste Text Directly</span>
          </button>

          {(jobDescription || resumes.length > 0) && (
            <button
              id="btn-auto-detect-types"
              onClick={triggerAutoDetection}
              disabled={isDetecting || (!jobDescription && resumes.length < 2)}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 disabled:opacity-50 transition-colors"
              title="AI will inspect uploaded text to ensure the JD and resumes are properly designated"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isDetecting ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isDetecting ? 'Auto-Detecting...' : 'Auto-Verify Doc Types'}</span>
            </button>
          )}
        </div>

        {activeTab === 'upload' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            {/* 1. Job Description Drop Zone */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  1. Target Job Description (Required)
                </span>
                {jobDescription && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                )}
              </div>

              {!jobDescription ? (
                <div
                  id="dropzone-jd"
                  onClick={() => jdInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files, 'jd');
                  }}
                  className="flex-1 min-h-[160px] border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <input
                    ref={jdInputRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files, 'jd')}
                  />
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform mb-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drop Job Description
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Supports PDF or plain text</p>
                </div>
              ) : (
                <div className="border border-indigo-200 bg-indigo-50/40 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {jobDescription.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {jobDescription.content.length > 0
                            ? `${jobDescription.content.split(/\s+/).length} words extracted`
                            : 'PDF Document loaded'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        id="btn-preview-jd"
                        onClick={() => setPreviewDoc(jobDescription)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                        title="Preview text"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        id="btn-remove-jd"
                        onClick={() => onSetJobDescription(null)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                        title="Remove JD"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 font-medium text-indigo-800">
                      <Check className="h-3.5 w-3.5 text-indigo-600" />
                      Role Description Active
                    </span>
                    <button
                      id="btn-replace-jd"
                      onClick={() => jdInputRef.current?.click()}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      Replace JD
                    </button>
                    <input
                      ref={jdInputRef}
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files, 'jd')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Resumes Drop Zone */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  2. Candidate Resumes ({resumes.length})
                </span>
                <span className="text-xs text-slate-500">
                  {resumes.length === 0
                    ? 'Upload 1 or more'
                    : resumes.length === 1
                    ? '1 candidate ready'
                    : `${resumes.length} candidates ready`}
                </span>
              </div>

              <div
                id="dropzone-resumes"
                onClick={() => resumeInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files, 'resume');
                }}
                className="border-2 border-dashed border-emerald-200 hover:border-emerald-400 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[100px]"
              >
                <input
                  ref={resumeInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files, 'resume')}
                />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800">
                      Add Candidate Resume(s)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Select single or multiple files (PDF/TXT)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Resumes List */}
              {resumes.length > 0 && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {resumes.map((resume, idx) => (
                    <div
                      key={resume.id}
                      className="border border-slate-200 bg-slate-50/70 hover:bg-slate-50 rounded-lg p-2.5 flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="h-5 w-5 rounded bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {resume.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {resume.content.slice(0, 45)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          id={`btn-preview-resume-${idx}`}
                          onClick={() => setPreviewDoc(resume)}
                          className="p-1 text-slate-500 hover:text-indigo-600 rounded"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          id={`btn-remove-resume-${idx}`}
                          onClick={() => onRemoveResume(resume.id)}
                          className="p-1 text-slate-500 hover:text-rose-600 rounded"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Direct Paste Section */
          <form onSubmit={handlePasteSubmit} className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700">Target Section:</label>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setPasteType('jd')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      pasteType === 'jd' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Job Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteType('resume')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      pasteType === 'resume' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Candidate Resume
                  </button>
                </div>
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder={pasteType === 'jd' ? 'Job Title / Company (Optional)' : "Candidate's Full Name (Optional)"}
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <textarea
                rows={6}
                value={pastedContent}
                onChange={(e) => setPastedContent(e.target.value)}
                placeholder={
                  pasteType === 'jd'
                    ? 'Paste the full Job Description here (Role, responsibilities, required skills, qualifications)...'
                    : 'Paste candidate resume content here (Summary, work experience, projects, skills, education)...'
                }
                className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {pastedContent.trim().length > 0
                  ? `${pastedContent.trim().split(/\s+/).length} words typed`
                  : 'Type or paste raw text'}
              </span>
              <button
                type="submit"
                disabled={!pastedContent.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add {pasteType === 'jd' ? 'Job Description' : 'Resume'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Action / Launch Bar */}
        <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {!jobDescription ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" /> Please upload or paste 1 Job Description
              </span>
            ) : resumes.length === 0 ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="h-4 w-4" /> Please upload or paste at least 1 Candidate Resume
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <Check className="h-4 w-4" /> Ready to screen 1 JD against {resumes.length} {resumes.length === 1 ? 'candidate' : 'candidates'}
              </span>
            )}
          </div>

          <button
            id="btn-run-analysis"
            onClick={onRunAnalysis}
            disabled={!canRun || isAnalyzing}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
              !canRun || isAnalyzing
                ? 'bg-slate-300 cursor-not-allowed opacity-70'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Calculating ATS Scores & Alignments...</span>
              </>
            ) : (
              <>
                <span>Run Detailed ATS Evaluation</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Text Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {previewDoc.type === 'jd' ? 'Job Description' : 'Candidate Resume'}
                </span>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {previewDoc.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-5 overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 flex-1">
              {previewDoc.content || '[Binary PDF File preview is processed directly by AI engine]'}
            </div>
            <div className="p-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

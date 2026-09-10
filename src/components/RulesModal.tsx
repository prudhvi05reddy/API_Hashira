import React from 'react';
import { X, ShieldCheck, Scale, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                ATS Compatibility & Scoring Directives
              </h3>
              <p className="text-xs text-slate-500">
                Standardized, non-random recruiter evaluation criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Weights */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              1. Compatibility Formula (100 Points Total)
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-slate-800">Required Skills</span>
                <span className="font-mono font-bold text-indigo-700">40% (0–40 pts)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-slate-800">Relevant Experience</span>
                <span className="font-mono font-bold text-indigo-700">25% (0–25 pts)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-slate-800">JD-Role Alignment</span>
                <span className="font-mono font-bold text-indigo-700">20% (0–20 pts)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-slate-800">Education / Qualifications</span>
                <span className="font-mono font-bold text-indigo-700">10% (0–10 pts)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <span className="font-semibold text-slate-800">Relevant Keywords</span>
                <span className="font-mono font-bold text-indigo-700">5% (0–5 pts)</span>
              </div>
            </div>
          </div>

          {/* Core Recruiter Rules */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
              2. Strict Recruiter Compliance Rules
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No invented data:</strong> Never assume a candidate knows a technology unless verifiable evidence exists in the resume.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Demonstrated competence over exact keyword matching:</strong> Candidates are not penalized merely because a keyword is phrased differently if equivalent hands-on experience is clearly demonstrated.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Required vs Preferred distinction:</strong> Explicitly required skills carry strict priority over nice-to-have items.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Targeted Gap Learning:</strong> Course recommendations target strictly identified gaps for the role.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span><strong>Bias-free evaluation:</strong> Analysis ignores protected characteristics and evaluates exclusively on verifiable job-relevant criteria.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

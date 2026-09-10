import React from 'react';
import { Briefcase, Sparkles, RotateCcw, FileText, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  hasData: boolean;
  activeView: 'chat' | 'dashboard' | 'report' | 'tips';
  setActiveView: (view: 'chat' | 'dashboard' | 'report' | 'tips') => void;
  onOpenRulesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadSample,
  onReset,
  hasData,
  activeView,
  setActiveView,
  onOpenRulesModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800">
            <Briefcase className="h-5 w-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 tracking-tight text-lg">
                ATS Resume Analyzer
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                WhatsApp Edition
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Conversational ATS screening, live Recharts evaluation & score boosting
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center text-xs font-semibold">
            <button
              id="tab-whatsapp-chat"
              onClick={() => setActiveView('chat')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'chat'
                  ? 'bg-[#128C7E] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
              <span>WhatsApp Chat</span>
            </button>

            <button
              id="tab-dashboard"
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {hasData ? 'Dashboard' : 'Upload & Screen'}
            </button>

            <button
              id="tab-tips"
              onClick={() => setActiveView('tips')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeView === 'tips'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Tips</span>
            </button>

            {hasData && (
              <button
                id="tab-raw-report"
                onClick={() => setActiveView('report')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeView === 'report'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Report</span>
              </button>
            )}
          </div>

          <button
            id="btn-scoring-rules"
            onClick={onOpenRulesModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="View weighted scoring criteria"
          >
            <ShieldCheck className="h-4 w-4 text-slate-500" />
            <span className="hidden md:inline">ATS Criteria</span>
          </button>

          {!hasData ? (
            <button
              id="btn-load-sample"
              onClick={onLoadSample}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
              <span>Load Full Sample Demo</span>
            </button>
          ) : (
            <button
              id="btn-reset-analysis"
              onClick={onReset}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Upload New</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

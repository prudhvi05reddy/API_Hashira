import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Check, Download, FileText, Code } from 'lucide-react';

interface MarkdownReportViewProps {
  markdown: string;
  jobTitle?: string;
}

export const MarkdownReportView: React.FC<MarkdownReportViewProps> = ({
  markdown,
  jobTitle = 'Role',
}) => {
  const [copied, setCopied] = useState(false);
  const [rawView, setRawView] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `ATS_Analysis_${jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <span className="font-bold text-sm text-slate-800">
            Official ATS Markdown Report
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Compliant with required 5-factor output specification)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRawView(!rawView)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <Code className="h-3.5 w-3.5" />
            <span>{rawView ? 'Formatted Preview' : 'Raw Markdown'}</span>
          </button>

          <button
            id="btn-copy-markdown"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            id="btn-download-markdown"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 overflow-x-auto">
        {rawView ? (
          <pre className="font-mono text-xs text-slate-800 bg-slate-900 text-slate-100 p-6 rounded-xl overflow-x-auto whitespace-pre leading-relaxed">
            {markdown}
          </pre>
        ) : (
          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            <Markdown>{markdown}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

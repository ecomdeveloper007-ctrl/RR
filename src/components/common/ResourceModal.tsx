import React, { useEffect } from 'react';
import { X, BookOpen, CheckCircle2, Download, ExternalLink, Sparkles } from 'lucide-react';
import type { ResourceItem } from '../../types/portfolio';

interface ResourceModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (resource) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resource, onClose]);

  if (!resource) return null;

  const takeaways = resource.keyTakeaways
    ? resource.keyTakeaways.split('\n').map((item) => item.trim()).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto border border-slate-200">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {resource.category}
            </span>
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close guide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Banner */}
        {resource.illustrationUrl && (
          <div className="relative h-48 sm:h-56 w-full bg-slate-900 overflow-hidden">
            <img
              src={resource.illustrationUrl}
              alt={resource.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {resource.title}
              </h2>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-6">
          {!resource.illustrationUrl && (
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {resource.title}
            </h2>
          )}

          <div className="text-xs sm:text-sm font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 leading-relaxed">
            {resource.shortDescription}
          </div>

          {/* Detailed Content */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Chapter Guide & Strategy Breakdown
            </h3>
            <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-5 rounded-xl border border-slate-200/60 font-normal">
              {resource.detailedContent}
            </div>
          </div>

          {/* Key Takeaways */}
          {takeaways.length > 0 && (
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Actionable Execution Takeaways
              </h4>
              <ul className="space-y-2.5">
                {takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer with PDF download / consultation */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            {resource.pdfUrl ? (
              <a
                href={resource.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Chapter PDF</span>
              </a>
            ) : (
              <a
                href="https://www.fiverr.com/pjangid"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-colors"
              >
                <span>Order Custom Strategy on Fiverr</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

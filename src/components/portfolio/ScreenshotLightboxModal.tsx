import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Maximize2 } from 'lucide-react';
import type { PaidAdCaseStudyItem } from '../../types/portfolio';

interface ScreenshotLightboxModalProps {
  ad: PaidAdCaseStudyItem | null;
  onClose: () => void;
}

export const ScreenshotLightboxModal: React.FC<ScreenshotLightboxModalProps> = ({ ad, onClose }) => {
  useEffect(() => {
    if (!ad) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ad, onClose]);

  return (
    <AnimatePresence>
      {ad && ad.screenshotUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${ad.clientName} campaign dashboard screenshot`}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-5 py-4 sm:px-6 border-b border-[#E2E8F0] bg-[#F3F7F5] flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#D1FAE5] text-[#059669] border border-[#10B981]/30">
                    {ad.platform}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium truncate">
                    {ad.objectiveLabel}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-[#111827] truncate">
                  {ad.clientName} — Campaign Manager Report
                </h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {ad.destinationUrl && (
                  <a
                    href={ad.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-semibold text-[#111827] hover:border-[#10B981] hover:text-[#059669] transition-colors"
                  >
                    <span>Visit Destination</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] hover:bg-slate-50 transition-colors"
                  aria-label="Close screenshot preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Screenshot Image Container */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-900/5 flex items-center justify-center">
              <img
                src={ad.screenshotUrl}
                alt={ad.screenshotAlt || `${ad.clientName} dashboard screenshot`}
                className="max-w-full max-h-[68vh] w-auto h-auto rounded-2xl border border-[#E2E8F0] shadow-md object-contain bg-white"
              />
            </div>

            {/* Footer Caption */}
            <div className="px-5 py-3 sm:px-6 border-t border-[#E2E8F0] bg-white flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#10B981]" />
                {ad.screenshotCaption || 'Campaign dashboard screenshot supplied by the campaign manager'}
              </span>
              <span className="font-semibold text-[#111827]">
                {ad.heroStatValue.toLocaleString()} {ad.heroStatLabel}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CaseStudiesSection: React.FC = () => {
  const { caseStudies, siteSettings } = usePortfolio();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const published = caseStudies.filter((c) => c.isPublished);

  if (published.length === 0) return null;

  const safeIndex = activeIndex < published.length ? activeIndex : 0;
  const activeStudy = published[safeIndex];
  const studyKey = activeStudy.id || String(safeIndex);
  const isExpanded = expandedId === studyKey;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + published.length) % published.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % published.length);
  };

  return (
    <section id="case-studies" className="scroll-mt-20 py-8 sm:py-10 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        {/* Compact Header + Slider Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="max-w-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span>Case Studies</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#64748B] font-medium">Verified Performance Benchmarks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
              Transparent Outcomes &amp; Benchmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Measured results across e-commerce conversion rate and organic search authority.
            </p>
          </div>

          {published.length > 1 && (
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
              <span className="text-xs font-medium text-[#64748B] tabular-nums mr-1">
                {safeIndex + 1} / {published.length}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous case study"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-[#10B981] hover:text-[#059669] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next case study"
                className="w-10 h-10 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Compact Client Selector Tabs */}
        {published.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {published.map((study, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={study.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 tabular-nums ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-[#F3F7F5] text-slate-600 border-slate-200 hover:border-[#10B981]/60 hover:text-slate-900'
                  }`}
                >
                  <span className={isSelected ? 'text-emerald-400' : 'text-[#059669]'}>
                    0{idx + 1}
                  </span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span>{study.clientName}</span>
                  <span className="hidden md:inline font-normal opacity-70">
                    · {study.industry}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Case Study Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={studyKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="bg-[#F3F7F5] rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 space-y-3.5"
          >
            {/* Top Bar: Unboxed Metadata & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="font-semibold text-[#059669]">{activeStudy.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeStudy.clientName}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
                  {activeStudy.title}
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] shrink-0 self-start sm:self-center">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Outcome</span>
              </div>
            </div>

            {/* Hairline-Divided Metrics Strip */}
            {activeStudy.metrics && activeStudy.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200/80 rounded-xl overflow-hidden border border-slate-200/80">
                {activeStudy.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="bg-white px-3.5 py-2.5">
                    <span className="text-[11px] font-medium text-slate-500 block truncate">
                      {m.label}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#059669] tracking-tight tabular-nums mt-0.5 block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Concise Challenge & Strategy Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 pt-0.5">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#111827]">Core Challenge</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStudy.challenge}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#111827]">Strategic Solution</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStudy.strategy}
                </p>
              </div>
            </div>

            {/* Expandable Execution Details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pt-3 border-t border-slate-200/80 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#111827]">Hands-On Execution</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeStudy.execution}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#111827]">Channels Deployed</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeStudy.platforms}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-[#059669]">Business Impact</h4>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium">
                        {activeStudy.resultsSummary}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Card Bottom: Toggle & CTA */}
            <div className="pt-2.5 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => toggleExpand(studyKey)}
                className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#059669] transition-colors self-start sm:self-auto"
              >
                <span>{isExpanded ? 'Hide Details' : 'Read Full Case Study'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <a
                href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-semibold hover:bg-[#059669] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Hire on Fiverr</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

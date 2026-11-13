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
    <section id="case-studies" className="py-10 sm:py-12 lg:py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-7">
        {/* Section Header + Slider Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Case Studies &amp; Measured Results
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight">
              Transparent Outcomes &amp; Performance Benchmarks
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Real data from real client collaborations across e-commerce conversion rate and organic search authority.
            </p>
          </div>

          {published.length > 1 && (
            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <span className="text-xs font-bold text-slate-500 bg-[#F3F7F5] px-3.5 py-2 rounded-xl border border-slate-200 tabular-nums">
                Case Study <span className="text-slate-900">{safeIndex + 1}</span> / {published.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous case study"
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 hover:border-emerald-500 hover:text-emerald-700 flex items-center justify-center transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next case study"
                  className="w-10 h-10 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] flex items-center justify-center transition-colors shadow-xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Client Selector Tabs */}
        {published.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {published.map((study, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={study.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`min-h-[40px] px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                      : 'bg-[#F3F7F5] text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#10B981] text-white' : 'bg-white text-emerald-700'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span>{study.clientName}</span>
                  <span className="hidden sm:inline font-medium opacity-75">
                    &bull; {study.industry}
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="bg-[#F3F7F5] rounded-3xl border border-emerald-100/90 overflow-hidden shadow-sm"
          >
            <div className="p-5 sm:p-8 space-y-6">
              {/* Top Bar: Title & Client info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      {activeStudy.industry}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Client: {activeStudy.clientName}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activeStudy.title}
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs shrink-0 self-start md:self-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Client Outcome</span>
                </div>
              </div>

              {/* Verified Metrics Cards */}
              {activeStudy.metrics && activeStudy.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {activeStudy.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs"
                    >
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 block">
                        {m.label}
                      </span>
                      <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-600 tracking-tight mt-0.5 block">
                        {m.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary & Approach Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    The Core Challenge
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {activeStudy.challenge}
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Strategic Solution
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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
                    transition={{ duration: 0.25 }}
                    className="space-y-4 pt-4 border-t border-emerald-200/60 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Hands-On Execution
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                          {activeStudy.execution}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Platforms &amp; Channels Deployed
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                          {activeStudy.platforms}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Measurable Business Impact
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-200 font-medium">
                        {activeStudy.resultsSummary}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Card Bottom: Toggle, Dots & CTA */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => toggleExpand(studyKey)}
                  className="min-h-[42px] inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Detailed Architecture' : 'Read Full Case Study'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <a
                  href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  <span>Hire Me on Fiverr</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

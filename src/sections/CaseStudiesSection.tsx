import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const CaseStudiesSection: React.FC = () => {
  const { caseStudies } = usePortfolio();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const published = caseStudies.filter((c) => c.isPublished);

  if (published.length === 0) return null;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="case-studies" className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Case Studies & Measured Results
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Transparent Outcomes & Performance Benchmarks
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Real data from real client collaborations. Verified impact across e-commerce revenue, mobile conversion rate, and organic search authority.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-10">
          {published.map((study, idx) => {
            const isExpanded = expandedId === (study.id || String(idx));

            return (
              <div
                key={study.id || idx}
                className="bg-[#F3F7F5] rounded-3xl border border-emerald-100/90 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6 sm:p-10 space-y-8">
                  {/* Top Bar: Title & Client info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 pb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                          {study.industry}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Client: {study.clientName}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {study.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-sm shrink-0">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified Client Outcome</span>
                    </div>
                  </div>

                  {/* Verified Metrics Cards */}
                  {study.metrics && study.metrics.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Key Measured Benchmarks:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {study.metrics.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs"
                          >
                            <span className="text-xs font-semibold text-slate-500 block">
                              {m.label}
                            </span>
                            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight mt-1 block">
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary & Approach Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        The Core Challenge
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {study.challenge}
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/70">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Strategic Solution
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {study.strategy}
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
                        transition={{ duration: 0.3 }}
                        className="space-y-6 pt-4 border-t border-emerald-200/60 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Hands-On Execution
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                              {study.execution}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                              Platforms & Channels Deployed
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                              {study.platforms}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Measurable Business Impact
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-200 font-medium">
                            {study.resultsSummary}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Card Bottom: Toggle & CTA */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(study.id || String(idx))}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Detailed Architecture' : 'Read Full Case Study'}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <span>Achieve Similar Results</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

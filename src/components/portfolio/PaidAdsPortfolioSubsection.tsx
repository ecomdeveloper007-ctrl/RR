import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  BarChart3,
  ExternalLink,
  Maximize2,
  BookOpen,
  TrendingUp,
  Layers,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { PaidAdCaseStudyItem } from '../../types/portfolio';
import { AnimatedCounter } from './AnimatedCounter';
import { ScreenshotLightboxModal } from './ScreenshotLightboxModal';

interface PaidAdsPortfolioSubsectionProps {
  standalone?: boolean;
}

export const PaidAdsPortfolioSubsection: React.FC<PaidAdsPortfolioSubsectionProps> = ({
  standalone = false,
}) => {
  const { paidAds, adGlossary } = usePortfolio();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedScreenshotAd, setSelectedScreenshotAd] = useState<PaidAdCaseStudyItem | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const publishedAds = paidAds
    .filter((ad) => ad.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const publishedGlossary = adGlossary
    .filter((term) => term.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (publishedAds.length === 0) return null;

  const safeIndex = activeIndex < publishedAds.length ? activeIndex : 0;
  const activeAd = publishedAds[safeIndex];
  const isGoogleAds = activeAd.platform.toLowerCase().includes('google');

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + publishedAds.length) % publishedAds.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % publishedAds.length);
  };

  return (
    <div
      id="paid-ads-performance"
      className={
        standalone ? 'space-y-5 sm:space-y-6' : 'mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-[#E2E8F0] space-y-5 sm:space-y-6'
      }
    >
      {/* Subsection Header & Slider Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="max-w-3xl space-y-2.5 min-w-0">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#059669] tracking-wider uppercase bg-[#D1FAE5]/70 px-3 py-1 rounded-md border border-[#10B981]/30">
            <BarChart3 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Paid Ads &amp; Campaign Performance</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Paid Advertising That Turns Strategy Into Measurable Results
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
            Explore selected Meta Ads and Google Ads campaigns, including lead generation, website traffic, audience reach, and video visibility. Each case study explains the campaign objective, reported performance, and business context.
          </p>
        </div>

        {/* Slide Counter + Prev/Next Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-xs font-bold text-[#64748B] bg-white px-3.5 py-2 rounded-xl border border-[#E2E8F0] tabular-nums">
            Campaign <span className="text-[#111827]">{safeIndex + 1}</span> / {publishedAds.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous campaign case study"
              className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#10B981] hover:text-[#059669] flex items-center justify-center transition-colors shadow-xs active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next campaign case study"
              className="w-10 h-10 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] flex items-center justify-center transition-colors shadow-xs active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Case Study Switcher Strip (Horizontal Scroll on Mobile, Clean Wrap/Row on Desktop) */}
      <div
        role="tablist"
        aria-label="Select paid advertising campaign case study"
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1"
      >
        {publishedAds.map((ad, idx) => {
          const isSelected = idx === safeIndex;
          return (
            <button
              key={ad.id || idx}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveIndex(idx)}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl border text-left transition-all shrink-0 flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#10B981]/60 hover:text-[#111827]'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isSelected
                    ? 'bg-[#10B981] text-white'
                    : 'bg-[#D1FAE5]/70 text-[#059669]'
                }`}
              >
                0{idx + 1}
              </span>
              <span className="text-xs font-bold whitespace-nowrap">{ad.clientName}</span>
            </button>
          );
        })}
      </div>

      {/* Minimal Active Case Study Slide Card */}
      <AnimatePresence mode="wait">
        <motion.article
          key={activeAd.id || safeIndex}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden"
        >
          <div className="p-5 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Metrics & Concise Context */}
            <div className="lg:col-span-7 space-y-5 min-w-0">
              {/* Metadata Badges + Client Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      isGoogleAds
                        ? 'bg-[#111827] text-white border-[#111827]'
                        : 'bg-[#D1FAE5] text-[#059669] border-[#10B981]/30'
                    }`}
                  >
                    {activeAd.platform}
                  </span>
                  <span className="text-xs font-semibold text-[#64748B]">
                    {activeAd.objectiveLabel}
                  </span>
                  {activeAd.budgetContext && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#F3F7F5] text-[#111827] border border-[#E2E8F0]">
                      {activeAd.budgetContext}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-3">
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#111827] tracking-tight">
                    {activeAd.clientName}
                  </h4>
                  {activeAd.destinationUrl && (
                    <a
                      href={activeAd.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669] hover:text-[#10B981] hover:underline break-all"
                    >
                      <span>{activeAd.destinationDisplay || activeAd.destinationUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[#111827]/90 leading-relaxed font-medium">
                  {activeAd.achievedSummary}
                </p>
              </div>

              {/* Hero Stat + 4 Reported KPI Cards */}
              <div className="space-y-3">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F3F7F5] border border-[#E2E8F0] flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <AnimatedCounter
                      value={activeAd.heroStatValue}
                      className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10B981] tracking-tight"
                    />
                    <span className="text-xs sm:text-sm font-bold text-[#111827]">
                      {activeAd.heroStatLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    Reported Performance
                  </span>
                </div>

                {activeAd.metrics && activeAd.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeAd.metrics.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="p-3 rounded-xl bg-[#F3F7F5] border border-[#E2E8F0] space-y-0.5"
                      >
                        <div className="text-base sm:text-lg font-extrabold text-[#111827] tracking-tight tabular-nums">
                          {m.value}
                        </div>
                        <div className="text-[11px] font-semibold text-[#64748B] leading-tight">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3-Column Concise Narrative Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="p-3.5 rounded-xl bg-[#F3F7F5]/75 border border-[#E2E8F0] space-y-1">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                    Client reality
                  </h5>
                  <p className="text-xs text-[#64748B] leading-relaxed">{activeAd.clientReality}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F3F7F5]/75 border border-[#E2E8F0] space-y-1">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                    How the ads helped
                  </h5>
                  <p className="text-xs text-[#64748B] leading-relaxed">{activeAd.howAdsHelped}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#D1FAE5]/30 border border-[#10B981]/25 space-y-1">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                    What this means
                  </h5>
                  <p className="text-xs text-[#111827] font-medium leading-relaxed">
                    {activeAd.whatThisMeans}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard Screenshot OR Metric Spotlight */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {activeAd.screenshotUrl ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScreenshotAd(activeAd)}
                    className="group relative w-full rounded-2xl border border-[#E2E8F0] bg-[#F3F7F5] overflow-hidden shadow-xs hover:border-[#10B981] hover:shadow-md transition-all text-left block focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    aria-label={`Inspect ${activeAd.clientName} campaign dashboard screenshot`}
                  >
                    <div className="px-3 py-2 bg-white border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-medium">
                      <span className="truncate font-semibold text-[#111827]">
                        {activeAd.platform} Manager Report
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#059669] font-semibold shrink-0">
                        <Maximize2 className="w-3 h-3" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                    <div className="bg-white p-2 sm:p-3">
                      <img
                        src={activeAd.screenshotUrl}
                        alt={activeAd.screenshotAlt || `${activeAd.clientName} campaign dashboard`}
                        loading="lazy"
                        className="w-full h-auto max-h-[280px] sm:max-h-[320px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>
                  </button>
                  <p className="text-[11px] text-[#64748B] text-center">
                    {activeAd.screenshotCaption ||
                      'Campaign dashboard screenshot supplied by the campaign manager'}
                  </p>
                </div>
              ) : (
                <div className="w-full min-h-[240px] sm:min-h-[280px] rounded-2xl bg-gradient-to-br from-[#F3F7F5] via-white to-[#D1FAE5]/45 border border-[#10B981]/30 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-2.5 shadow-xs">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#059669] bg-[#D1FAE5] px-2.5 py-1 rounded-md">
                    Reported Performance Highlight
                  </span>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight tabular-nums">
                    {activeAd.heroStatValue.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#059669] max-w-xs">
                    {activeAd.spotlightCaption || activeAd.heroStatLabel}
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#64748B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Verified {activeAd.platform} Delivery</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slider Progress Dots Bar */}
          <div className="px-5 py-3 bg-[#F3F7F5]/70 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {publishedAds.map((ad, idx) => (
                <button
                  key={ad.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View ${ad.clientName} campaign`}
                  className={`h-2 rounded-full transition-all ${
                    idx === safeIndex ? 'w-6 bg-[#10B981]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-[#111827] px-2 py-1 rounded-lg hover:bg-white transition-colors"
              >
                Prev
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleNext}
                className="text-[#059669] hover:text-[#10B981] px-2 py-1 rounded-lg hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>

      {/* Compact Throughline + Collapsible Advertising Glossary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-[#111827] text-white flex flex-col justify-between space-y-3 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
              <Layers className="w-3.5 h-3.5" />
              <span>Campaign Strategy Summary</span>
            </div>
            <h4 className="text-lg sm:text-xl font-extrabold tracking-tight">
              The throughline across every campaign
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Different platforms, different audiences, different offers — but the same pattern each time: a clear entry point, a controlled budget, and a result that gives the business somewhere real to go next.
            </p>
          </div>
          <p className="text-[11px] text-slate-400">
            Case studies compiled from campaign manager dashboards.
          </p>
        </div>

        {/* Minimal Expandable Advertising Glossary Card */}
        {publishedGlossary.length > 0 && (
          <div
            id="ad-glossary"
            className="lg:col-span-7 bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#059669] bg-[#D1FAE5]/70 px-2 py-0.5 rounded-md border border-[#10B981]/25">
                  <BookOpen className="w-3 h-3" />
                  Advertising Glossary ({publishedGlossary.length} Terms)
                </span>
                <h4 className="text-lg font-extrabold text-[#111827] tracking-tight">
                  How to read a campaign result
                </h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Advertising dashboards can feel technical. This short guide explains the terms used throughout the portfolio, so the numbers are easy to follow at a glance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGlossaryOpen((prev) => !prev)}
                aria-expanded={isGlossaryOpen}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#F3F7F5] border border-[#E2E8F0] hover:border-[#10B981] text-xs font-bold text-[#111827] inline-flex items-center justify-center gap-1.5 shrink-0 transition-colors"
              >
                <span>{isGlossaryOpen ? 'Hide Glossary' : 'View 12 Terms'}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#10B981] transition-transform duration-200 ${
                    isGlossaryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {!isGlossaryOpen ? (
              <div className="flex flex-wrap gap-1.5">
                {publishedGlossary.map((item, gIdx) => (
                  <button
                    key={item.id || gIdx}
                    type="button"
                    onClick={() => setIsGlossaryOpen(true)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F3F7F5] border border-[#E2E8F0] text-[#111827] hover:border-[#10B981] hover:text-[#059669] transition-colors"
                  >
                    {item.term}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {publishedGlossary.map((item, gIdx) => (
                  <div
                    key={item.id || gIdx}
                    className="p-3 rounded-xl bg-[#F3F7F5] border border-[#E2E8F0] space-y-1"
                  >
                    <h5 className="text-xs font-extrabold text-[#111827]">{item.term}</h5>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">{item.definition}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Campaign Dashboard Screenshots */}
      <ScreenshotLightboxModal
        ad={selectedScreenshotAd}
        onClose={() => setSelectedScreenshotAd(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  BarChart3,
  ExternalLink,
  Maximize2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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
  const { paidAds } = usePortfolio();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedScreenshotAd, setSelectedScreenshotAd] = useState<PaidAdCaseStudyItem | null>(null);

  const publishedAds = paidAds
    .filter((ad) => ad.isPublished)
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
        standalone ? 'space-y-3.5 sm:space-y-4' : 'mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E2E8F0] space-y-3.5 sm:space-y-4'
      }
    >
      {/* Compact Subsection Header & Slider Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div className="max-w-2xl space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#059669]">
            <BarChart3 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Paid Ads &amp; Campaign Performance</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight leading-tight [text-wrap:balance]">
            Paid Advertising That Turns Strategy Into Results
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Selected Meta Ads and Google Ads campaigns across lead generation, traffic, reach, and video visibility.
          </p>
        </div>

        {/* Compact Slide Counter + Prev/Next Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
          <span className="text-xs font-semibold text-[#64748B] bg-white px-3 py-1.5 rounded-lg border border-[#E2E8F0] tabular-nums">
            <span className="text-[#111827]">{safeIndex + 1}</span> / {publishedAds.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous campaign case study"
              className="w-9 h-9 rounded-lg bg-white border border-[#E2E8F0] text-[#111827] hover:border-[#10B981] hover:text-[#059669] flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next campaign case study"
              className="w-9 h-9 rounded-lg bg-[#10B981] text-white hover:bg-[#059669] flex items-center justify-center transition-colors active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Case Study Switcher Strip */}
      <div
        role="tablist"
        aria-label="Select paid advertising campaign case study"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 -mx-1 px-1"
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
              className={`min-h-[36px] px-3 py-1.5 rounded-lg border text-left transition-colors shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#111827] text-white border-[#111827]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#10B981]/60 hover:text-[#111827]'
              }`}
            >
              <span
                className={`text-[10px] font-bold tabular-nums ${
                  isSelected ? 'text-[#10B981]' : 'text-[#059669]'
                }`}
              >
                0{idx + 1}
              </span>
              <span className="text-xs font-semibold whitespace-nowrap">{ad.clientName}</span>
            </button>
          );
        })}
      </div>

      {/* Compact Active Case Study Card */}
      <AnimatePresence mode="wait">
        <motion.article
          key={activeAd.id || safeIndex}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
        >
          <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-center">
            {/* Left Column: Metrics & Compact Context */}
            <div className="lg:col-span-7 space-y-3 min-w-0">
              {/* Unboxed Metadata + Client Header */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold">
                  <span className={isGoogleAds ? 'text-[#111827]' : 'text-[#059669]'}>
                    {activeAd.platform}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="text-[#64748B] font-medium">{activeAd.objectiveLabel}</span>
                  {activeAd.budgetContext && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[#111827]">{activeAd.budgetContext}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3">
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#111827] tracking-tight">
                    {activeAd.clientName}
                  </h4>
                  {activeAd.destinationUrl && (
                    <a
                      href={activeAd.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] hover:text-[#10B981] hover:underline truncate max-w-full"
                    >
                      <span className="truncate">{activeAd.destinationDisplay || activeAd.destinationUrl}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                </div>

                <p className="text-xs text-[#334155] leading-relaxed">
                  {activeAd.achievedSummary}
                </p>
              </div>

              {/* Compact Hero Stat + KPI Strip */}
              <div className="p-3 rounded-xl bg-[#F3F7F5] border border-[#E2E8F0] space-y-2.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <AnimatedCounter
                      value={activeAd.heroStatValue}
                      className="text-2xl sm:text-3xl font-extrabold text-[#10B981] tracking-tight tabular-nums"
                    />
                    <span className="text-xs font-bold text-[#111827]">
                      {activeAd.heroStatLabel}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-[#64748B]">
                    Reported Performance
                  </span>
                </div>

                {activeAd.metrics && activeAd.metrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E2E8F0]">
                    {activeAd.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="min-w-0">
                        <div className="text-sm font-extrabold text-[#111827] tracking-tight tabular-nums">
                          {m.value}
                        </div>
                        <div className="text-[11px] font-medium text-[#64748B] truncate">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Compact 3-Column Narrative Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F3F7F5]/75 border border-[#E2E8F0] space-y-0.5">
                  <h5 className="text-[10px] font-bold tracking-wide text-[#059669]">
                    Client reality
                  </h5>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{activeAd.clientReality}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F3F7F5]/75 border border-[#E2E8F0] space-y-0.5">
                  <h5 className="text-[10px] font-bold tracking-wide text-[#059669]">
                    How the ads helped
                  </h5>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{activeAd.howAdsHelped}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#D1FAE5]/25 border border-[#10B981]/25 space-y-0.5">
                  <h5 className="text-[10px] font-bold tracking-wide text-[#059669]">
                    What this means
                  </h5>
                  <p className="text-[11px] text-[#111827] font-medium leading-relaxed">
                    {activeAd.whatThisMeans}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Compact Dashboard Screenshot OR Metric Spotlight */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {activeAd.screenshotUrl ? (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedScreenshotAd(activeAd)}
                    className="group relative w-full rounded-xl border border-[#E2E8F0] bg-[#F3F7F5] overflow-hidden hover:border-[#10B981] transition-colors text-left block focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    aria-label={`Inspect ${activeAd.clientName} campaign dashboard screenshot`}
                  >
                    <div className="px-3 py-1.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span className="truncate font-semibold text-[#111827]">
                        {activeAd.platform} Manager Report
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#059669] font-semibold shrink-0">
                        <Maximize2 className="w-3 h-3" />
                        <span>Enlarge</span>
                      </span>
                    </div>
                    <div className="bg-white p-2">
                      <img
                        src={activeAd.screenshotUrl}
                        alt={activeAd.screenshotAlt || `${activeAd.clientName} campaign dashboard`}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-auto max-h-[190px] sm:max-h-[210px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    </div>
                  </button>
                  <p className="text-[11px] text-[#64748B] text-center truncate">
                    {activeAd.screenshotCaption ||
                      'Campaign dashboard screenshot supplied by the campaign manager'}
                  </p>
                </div>
              ) : (
                <div className="w-full min-h-[180px] rounded-xl bg-gradient-to-br from-[#F3F7F5] via-white to-[#D1FAE5]/40 border border-[#10B981]/30 p-5 flex flex-col items-center justify-center text-center space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#059669]">
                    Reported Performance Highlight
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight tabular-nums">
                    {activeAd.heroStatValue.toLocaleString()}
                  </div>
                  <p className="text-xs font-semibold text-[#059669] max-w-xs">
                    {activeAd.spotlightCaption || activeAd.heroStatLabel}
                  </p>
                  <div className="pt-0.5 flex items-center gap-1 text-[11px] text-[#64748B]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Verified {activeAd.platform} Delivery</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slim Slider Footer */}
          <div className="px-4 py-2 bg-[#F3F7F5]/70 border-t border-[#E2E8F0] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {publishedAds.map((ad, idx) => (
                <button
                  key={ad.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`View ${ad.clientName} campaign`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === safeIndex ? 'w-5 bg-[#10B981]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
              <button
                type="button"
                onClick={handlePrev}
                className="hover:text-[#111827] px-2 py-0.5 rounded hover:bg-white transition-colors"
              >
                Prev
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleNext}
                className="text-[#059669] hover:text-[#10B981] px-2 py-0.5 rounded hover:bg-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </motion.article>
      </AnimatePresence>

      {/* Lightbox Modal for Campaign Dashboard Screenshots */}
      <ScreenshotLightboxModal
        ad={selectedScreenshotAd}
        onClose={() => setSelectedScreenshotAd(null)}
      />
    </div>
  );
};

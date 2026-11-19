import React from 'react';
import { ExternalLink, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const FiverrCtaSection: React.FC = () => {
  const { siteSettings } = usePortfolio();
  const fiverrUrl = siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid';

  const highlights = [
    'Escrow Buyer Protection',
    'Guaranteed Turnaround',
    'Custom Milestones',
  ];

  return (
    <section id="fiverr-cta" className="py-8 sm:py-10 bg-[#111827] text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-8">
          {/* Left Content */}
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Fiverr Pro Partner</span>
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-medium">All orders backed by Fiverr escrow</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight [text-wrap:balance]">
              Ready to Grow Your{' '}
              <span className="text-emerald-400">Digital Presence?</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Turn ideas into measurable results through creative content, strategic marketing, and Shopify solutions.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-1">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Compact Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <a
              href="#services"
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-semibold text-xs hover:bg-[#059669] transition-colors active:scale-95 whitespace-nowrap"
            >
              <span>Explore Fiverr Gigs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs hover:bg-slate-700 hover:text-white transition-colors active:scale-95 whitespace-nowrap"
            >
              <span>Visit Fiverr Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

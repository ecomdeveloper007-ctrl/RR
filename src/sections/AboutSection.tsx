import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Compass, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutSection: React.FC = () => {
  const { about, siteSettings } = usePortfolio();

  if (!about.isVisible) return null;

  return (
    <section id="about" className="py-10 sm:py-12 lg:py-16 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-[#D1FAE5] px-3 py-1 rounded-full border border-emerald-300/60 mb-2.5">
            About PJ
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            {about.headline || 'Creative Storytelling. Strategic Marketing. Measurable Digital Growth.'}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
            {about.bio ||
              'I combine creative storytelling with strategic digital marketing to help businesses build meaningful online connections, strengthen their brand presence, and achieve sustainable growth.'}
          </p>
        </div>

        {/* 3 Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="bg-[#F3F7F5] p-5 sm:p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Creative Storytelling
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.creativePhilosophy ||
                  'Attention is earned through clarity, empathy, and undeniable relevance. We replace generic noise with content that hooks, informs, and builds genuine human affinity.'}
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-200/60 mt-4 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Human-First Connection</span>
            </div>
          </div>

          <div className="bg-[#F3F7F5] p-5 sm:p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Strategic Marketing
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.strategicApproach ||
                  'Data guides our creative iterations. By continuously tracking engagement velocity, CPA, and retention, we ensure every asset directly advances bottom-line business objectives.'}
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-200/60 mt-4 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data-Driven Scaling</span>
            </div>
          </div>

          <div className="bg-[#F3F7F5] p-5 sm:p-6 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Conversion Architecture
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.leadershipSummary ||
                  'Combining cross-functional engineering, UX speed optimization, and frictionless checkout funnels to turn transient views into repeat buyers.'}
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-200/60 mt-4 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sustainable Revenue</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-7 sm:mt-8 p-5 sm:p-6 rounded-3xl bg-[#111827] text-white flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h4 className="text-lg font-bold tracking-tight">Ready to Elevate Your Brand Presence?</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore specialized commercial gigs and hire directly through my verified Fiverr Pro profile.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="#services"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold hover:bg-slate-700 transition-all shadow-xs"
            >
              Explore Services
            </a>
            <a
              href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-all shadow-md gap-2"
            >
              <span>View My Fiverr Profile</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

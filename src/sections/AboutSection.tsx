import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Compass, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutSection: React.FC = () => {
  const { about } = usePortfolio();

  if (!about.isVisible) return null;

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-[#D1FAE5] px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
            About Patricia
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            {about.headline || 'Creative Storytelling. Strategic Marketing. Measurable Digital Growth.'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
            {about.bio ||
              'I combine creative storytelling with strategic digital marketing to help businesses build meaningful online connections, strengthen their brand presence, and achieve sustainable growth.'}
          </p>
        </div>

        {/* 3 Philosophy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F3F7F5] p-7 sm:p-8 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Creative Storytelling
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.creativePhilosophy ||
                  'Attention is earned through clarity, empathy, and undeniable relevance. We replace generic noise with content that hooks, informs, and builds genuine human affinity.'}
              </p>
            </div>
            <div className="pt-6 border-t border-emerald-200/60 mt-6 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Human-First Connection</span>
            </div>
          </div>

          <div className="bg-[#F3F7F5] p-7 sm:p-8 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-5">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Strategic Marketing
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.strategicApproach ||
                  'Data guides our creative iterations. By continuously tracking engagement velocity, CPA, and retention, we ensure every asset directly advances bottom-line business objectives.'}
              </p>
            </div>
            <div className="pt-6 border-t border-emerald-200/60 mt-6 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data-Driven Scaling</span>
            </div>
          </div>

          <div className="bg-[#F3F7F5] p-7 sm:p-8 rounded-3xl border border-emerald-100 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shadow-xs mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] mb-2">
                Conversion Architecture
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                {about.leadershipSummary ||
                  'Combining cross-functional engineering, UX speed optimization, and frictionless checkout funnels to turn transient views into repeat buyers.'}
              </p>
            </div>
            <div className="pt-6 border-t border-emerald-200/60 mt-6 flex items-center gap-2 text-xs font-semibold text-[#10B981]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sustainable Revenue</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-12 p-8 rounded-3xl bg-[#111827] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold tracking-tight">Ready to Elevate Your Brand Presence?</h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore our 6 specialized commercial services formulated to make your business impossible to ignore.
            </p>
          </div>
          <a
            href="#services"
            className="px-6 py-3 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Explore Services</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

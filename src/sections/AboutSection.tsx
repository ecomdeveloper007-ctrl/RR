import React from 'react';
import { TrendingUp, Compass, Target, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutSection: React.FC = () => {
  const { about } = usePortfolio();

  if (!about.isVisible) return null;

  const pillars = [
    {
      icon: Compass,
      title: 'Creative Storytelling',
      body:
        about.creativePhilosophy ||
        'Attention is earned through clarity, empathy, and relevance. We replace noise with content that hooks, informs, and builds genuine brand affinity.',
      highlight: 'Human-First Connection',
    },
    {
      icon: Target,
      title: 'Strategic Marketing',
      body:
        about.strategicApproach ||
        'Data guides every creative iteration. By tracking engagement velocity, CPA, and retention, every asset directly advances business objectives.',
      highlight: 'Data-Driven Scaling',
    },
    {
      icon: TrendingUp,
      title: 'Conversion Architecture',
      body:
        about.leadershipSummary ||
        'Combining cross-functional execution, UX speed optimization, and frictionless checkout funnels to turn transient views into repeat buyers.',
      highlight: 'Sustainable Revenue',
    },
  ];

  return (
    <section id="about" className="py-8 sm:py-10 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Full-Width Section Header */}
        <div className="w-full space-y-1.5 mb-5 sm:mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
            <span>About PJ</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-[#64748B] font-medium">Philosophy &amp; Approach</span>
          </div>
          <h2 className="w-full text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight">
            {about.headline || 'Creative Storytelling. Strategic Marketing. Measurable Digital Growth.'}
          </h2>
          <p className="w-full text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
            {about.bio ||
              'I combine creative storytelling with strategic digital marketing to help businesses build meaningful online connections, strengthen their brand presence, and achieve sustainable growth.'}
          </p>
        </div>

        {/* Compact 3 Philosophy Pillars */}
        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0">
          {pillars.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <article
                key={pillar.title}
                className="min-w-[80%] sm:min-w-[46%] md:min-w-0 snap-start bg-[#F3F7F5] p-4 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-[#10B981] flex items-center justify-center border border-emerald-200 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#64748B] leading-relaxed font-normal">
                    {pillar.body}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#059669]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>{pillar.highlight}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

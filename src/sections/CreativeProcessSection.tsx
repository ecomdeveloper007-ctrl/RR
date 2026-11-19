import React from 'react';
import {
  Search,
  BarChart3,
  TrendingUp,
  PenTool,
  Zap,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const processIcons: Record<string, React.ElementType> = {
  Search,
  BarChart3,
  TrendingUp,
  PenTool,
  Zap,
  RefreshCw,
};

export const CreativeProcessSection: React.FC = () => {
  const { creativeProcess } = usePortfolio();

  return (
    <section id="process" className="py-8 sm:py-10 bg-[#F3F7F5] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="max-w-2xl space-y-1 mb-5 sm:mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tabular-nums">
            <span>Execution Methodology</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-[#64748B] font-medium">
              {creativeProcess.length}-Stage Workflow
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
            Creative &amp; Strategic Growth Process
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
            A structured workflow engineered to eliminate guesswork and deliver compounding digital momentum.
          </p>
        </div>

        {/* Compact Process Stages Grid: Swipeable on mobile, 2 cols tablet, 3 cols desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
          {creativeProcess.map((stage) => {
            const IconComp = processIcons[stage.iconName] || TrendingUp;

            return (
              <article
                key={stage.id || stage.stepNumber}
                className="min-w-[78%] sm:min-w-0 snap-start bg-white p-4 rounded-2xl border border-[#E2E8F0] hover:border-[#10B981]/60 transition-colors flex flex-col justify-between gap-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#D1FAE5]/60 text-[#059669] flex items-center justify-center">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#059669] tabular-nums">
                      Step 0{stage.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-[15px] font-bold text-[#111827] leading-snug">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed font-normal line-clamp-2">
                    {stage.shortDesc}
                  </p>
                </div>

                {/* Compact Deliverables */}
                {stage.deliverables && stage.deliverables.length > 0 && (
                  <div className="space-y-1 pt-2.5 border-t border-slate-100">
                    {stage.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-[#334155]">
                        <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="leading-snug">{del}</span>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

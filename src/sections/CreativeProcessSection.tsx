import React from 'react';
import { motion } from 'motion/react';
import {
  Search,
  BarChart3,
  TrendingUp,
  PenTool,
  Zap,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
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
    <section id="process" className="py-10 sm:py-12 lg:py-16 bg-[#F3F7F5] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 mb-2.5">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            Execution Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            The 6-Stage Creative & Strategic Growth Process
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            A battle-tested workflow engineered to eliminate guesswork, accelerate turnaround, and deliver compounding digital momentum.
          </p>
        </div>

        {/* 6 Process Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {creativeProcess.map((stage) => {
            const IconComp = processIcons[stage.iconName] || TrendingUp;

            return (
              <motion.div
                key={stage.id || stage.stepNumber}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-xs">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-200 tracking-tight">
                      0{stage.stepNumber}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {stage.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                    {stage.shortDesc}
                  </p>

                  {/* Deliverables bullets */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Deliverables:
                    </span>
                    {stage.deliverables.map((del, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                  <span>Stage {stage.stepNumber} of 6</span>
                  <ArrowRight className="w-3 h-3 text-emerald-600" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

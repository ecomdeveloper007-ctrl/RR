import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const FiverrCtaSection: React.FC = () => {
  const { siteSettings } = usePortfolio();
  const fiverrUrl = siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid';

  const highlights = [
    'Direct Order & Escrow Buyer Protection on Fiverr',
    'Clear Deliverables & Guaranteed Turnaround Times',
    'Custom Milestones & Strategic Growth Solutions',
  ];

  return (
    <section id="fiverr-cta" className="py-12 sm:py-14 lg:py-16 bg-[#111827] text-white relative overflow-hidden">
      {/* Subtle emerald atmospheric background glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Fiverr Pro Partner</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
          >
            Ready to Grow Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
              Digital Presence?
            </span>
          </motion.h2>

          {/* Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Let&apos;s turn your ideas into meaningful digital experiences through creative content, strategic marketing, and professional digital solutions.
          </motion.p>

          {/* Trust Guarantees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2"
          >
            {highlights.map((h, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95"
            >
              <span>Explore My Fiverr Gigs</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm hover:bg-slate-700 hover:text-white transition-all duration-200 active:scale-95"
            >
              <span>Visit My Fiverr Profile</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All contracts, milestone payments, and deliverables are safely backed by Fiverr escrow protection.</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

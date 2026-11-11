import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Sparkles, MessageCircle, Play } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const HeroSection: React.FC = () => {
  const { hero } = usePortfolio();

  if (!hero.isVisible) return null;

  const platforms = [
    'Instagram',
    'Facebook',
    'TikTok',
    'YouTube',
    'LinkedIn',
    'X / Twitter',
  ];

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#F3F7F5] via-white to-white"
    >
      {/* Subtle emerald atmospheric background glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 -z-10 w-72 h-72 bg-teal-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 text-xs font-bold tracking-wider uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{hero.subtitle || 'SOCIAL MEDIA MARKETING & DIGITAL GROWTH'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.12]">
              Making Brands{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Impossible to Ignore.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl font-normal">
              {hero.description ||
                'I help businesses build a stronger digital presence through creative social media content, strategic marketing, audience engagement, SEO, and conversion-focused digital solutions.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={hero.ctaUrlWork || '#portfolio'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] shadow-lg shadow-emerald-500/25 transition-all duration-200 active:scale-95"
              >
                <span>{hero.ctaTextWork || 'Explore My Work'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={hero.ctaUrlContact || '#contact'}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#111827] border border-[#E2E8F0] font-semibold text-sm hover:bg-[#F3F7F5] hover:border-slate-300 transition-all duration-200 active:scale-95 shadow-xs"
              >
                <span>{hero.ctaTextContact || "Let's Discuss Your Project"}</span>
              </a>

              <a
                href="#videos"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#10B981] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Showreel</span>
              </a>
            </div>

            {/* Supported Social Platforms Ribbon */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block">
                Cross-Platform Growth Ecosystem:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {platforms.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#111827] shadow-xs"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Visual Brand Representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl blur-lg" />

              <div className="relative bg-white p-3 rounded-3xl shadow-xl border border-[#E2E8F0]">
                <div className="relative h-96 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={
                      hero.profileImageUrl ||
                      'https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_original/v1/attachments/profile/photo/9e7939e1f4ea9eefd97b1622afb2fffc-1775900790435/8274214f-1465-4c61-80e9-a882cf332a8a.png'
                    }
                    alt="Patricia - Social Media Marketing & Digital Growth"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                    <div className="text-white space-y-0.5">
                      <div className="text-xl font-bold tracking-tight"P></div>
                      <div className="text-xs text-emerald-400 font-medium">
                        Creative Storyteller & Digital Growth Strategist
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-3 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold text-sm">
                    P
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#111827]">Strategic Marketing</div>
                    <div className="text-[11px] text-[#64748B] font-medium">Measurable Outcomes</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

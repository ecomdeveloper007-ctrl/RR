import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

export const HeroSection: React.FC = () => {
  const { hero, isHeroReady, siteSettings } = usePortfolio();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCompactPortrait, setIsCompactPortrait] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const heroImageSrc = isHeroReady
    ? hero.profileImageUrl || DEFAULT_HERO_IMAGE
    : '';

  const evaluateImageDimensions = (img: HTMLImageElement) => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    // Prevent upscaling blur when source image is smaller than the studio frame
    setIsCompactPortrait(w > 0 && (w < 450 || h < 450));
    setIsImageLoaded(true);
  };

  useEffect(() => {
    const img = imgRef.current;
    if (heroImageSrc && img?.complete && img.naturalWidth > 0) {
      evaluateImageDimensions(img);
    } else {
      setIsImageLoaded(false);
      setIsCompactPortrait(false);
    }
  }, [heroImageSrc]);

  if (!hero.isVisible) return null;

  const platforms = [
    { name: 'Instagram', focus: 'Reels & Brand' },
    { name: 'Facebook', focus: 'Meta Ads' },
    { name: 'TikTok', focus: 'Discovery' },
    { name: 'YouTube', focus: 'Long-Form' },
    { name: 'LinkedIn', focus: 'B2B Growth' },
    { name: 'X / Twitter', focus: 'Real-Time' },
  ];

  return (
    <section
      id="home"
      className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-28 lg:pb-12 overflow-hidden bg-gradient-to-b from-[#F3F7F5] via-white to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 lg:gap-10 items-center">
          {/* Left Column: Clear Positioning, CTAs & Channel Matrix */}
          <div className="md:col-span-7 space-y-3.5 sm:space-y-4 order-2 md:order-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tracking-wide">
              <span>{hero.subtitle || 'Social Media Marketing & Digital Growth'}</span>
            </div>

            <h1 className="text-[1.85rem] sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#111827] tracking-tight leading-[1.12] [text-wrap:balance]">
              Making Brands{' '}
              <span className="text-[#059669]">
                Impossible to Ignore.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-xl font-normal">
              {hero.description ||
                'I help businesses build a stronger digital presence through creative social media content, strategic marketing, audience engagement, SEO, and conversion-focused digital solutions.'}
            </p>

            {/* Responsive Action Buttons */}
            <div className="pt-1 grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-2.5 sm:gap-3">
              <a
                href={hero.ctaUrlWork || '#portfolio'}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-semibold text-xs hover:bg-[#059669] transition-colors active:scale-95 whitespace-nowrap"
              >
                <span>{hero.ctaTextWork || 'Explore Work'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </a>

              <a
                href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-white text-[#111827] border border-[#E2E8F0] font-semibold text-xs hover:bg-[#F3F7F5] hover:border-slate-300 transition-colors active:scale-95 whitespace-nowrap"
              >
                <span>Hire on Fiverr</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              </a>

              <a
                href="#videos"
                className="col-span-2 sm:col-span-1 min-h-[40px] inline-flex items-center justify-center sm:justify-start gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#10B981] transition-colors whitespace-nowrap"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span>Watch Showreel</span>
              </a>
            </div>

            {/* Architectural Cross-Platform Channel Matrix (Clean gap-px hairlines on all viewports) */}
            <div className="pt-3.5 border-t border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-bold text-[#111827] tracking-tight">
                  Active Growth Channels
                </span>
                <span className="text-[#059669] font-semibold tabular-nums">
                  0{platforms.length} Platforms
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E2E8F0] rounded-xl border border-[#E2E8F0] overflow-hidden">
                {platforms.map((platform, idx) => (
                  <div
                    key={platform.name}
                    className="bg-white px-2.5 py-2 hover:bg-[#F3F7F5] transition-colors group/channel min-w-0"
                  >
                    <div className="text-[10px] font-bold text-[#10B981] tabular-nums leading-none mb-1">
                      0{idx + 1}
                    </div>
                    <div className="text-xs font-bold text-[#111827] group-hover/channel:text-[#059669] transition-colors truncate">
                      {platform.name}
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate leading-tight">
                      {platform.focus}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column / Mobile Top Identity Card: Single responsive card optimized for all viewports */}
          <div className="md:col-span-5 flex justify-center md:justify-end order-1 md:order-2">
            <div className="w-full md:max-w-[360px] lg:max-w-[400px] bg-white p-2.5 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-row md:flex-col items-center md:items-stretch gap-3.5 md:gap-2.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-full md:h-64 lg:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d2822] to-emerald-950 flex items-center justify-center shrink-0">
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(16,185,129,0.22),transparent_65%)] pointer-events-none"
                />

                {(!heroImageSrc || !isImageLoaded) && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 animate-pulse"
                  />
                )}

                {heroImageSrc && (
                  <div
                    className={
                      isCompactPortrait
                        ? 'w-full h-full md:w-40 md:h-40 lg:w-48 lg:h-48 md:-mt-8 md:rounded-2xl overflow-hidden md:border-2 md:border-emerald-400/50 md:shadow-xl md:ring-2 md:ring-emerald-500/15 bg-slate-800'
                        : 'w-full h-full'
                    }
                  >
                    <img
                      ref={imgRef}
                      src={heroImageSrc}
                      alt="Patricia - Social Media Marketing & Digital Growth"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onLoad={(e) => evaluateImageDimensions(e.currentTarget)}
                      onError={() => setIsImageLoaded(true)}
                      className={`w-full h-full object-cover object-top transition-opacity duration-150 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                )}

                {/* Desktop/Tablet Overlay Nameplate */}
                <div
                  className={`hidden md:flex absolute inset-0 items-end p-4 pointer-events-none ${
                    isCompactPortrait
                      ? 'bg-gradient-to-t from-slate-950/90 via-transparent to-transparent justify-center text-center'
                      : 'bg-gradient-to-t from-slate-950/80 via-transparent to-transparent'
                  }`}
                >
                  <div className="text-white space-y-0.5">
                    <div className="text-base font-bold tracking-tight">Patricia</div>
                    <div className="text-[11px] text-emerald-300 font-medium">
                      Creative Storyteller &amp; Digital Growth Strategist
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Inline Identity & Verified Footer on Desktop */}
              <div className="flex-1 min-w-0 md:px-1 md:pb-0.5 flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                <div className="md:hidden space-y-0.5 min-w-0">
                  <div className="text-sm font-extrabold text-[#111827] tracking-tight truncate">
                    Patricia
                  </div>
                  <div className="text-[11px] text-[#64748B] font-medium truncate">
                    Creative Storyteller &amp; Growth Strategist
                  </div>
                </div>

                <div className="hidden md:block text-[11px] font-semibold text-[#111827] truncate">
                  Strategy · Creative · Paid Ads
                </div>

                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669] shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Verified Fiverr Pro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

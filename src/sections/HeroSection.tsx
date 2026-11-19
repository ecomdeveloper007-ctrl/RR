import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
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
    // Prevent upscaling blur when source image is smaller than the card
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
      className="relative pt-20 pb-8 lg:pt-24 lg:pb-10 overflow-hidden bg-gradient-to-b from-[#F3F7F5] via-white to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Compact Positioning & CTAs */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="text-xs font-semibold text-[#059669] tracking-wide">
              {hero.subtitle || 'Social Media Marketing & Digital Growth'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#111827] tracking-tight leading-[1.12] [text-wrap:balance]">
              Making Brands{' '}
              <span className="text-[#059669]">
                Impossible to Ignore.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-xl font-normal">
              {hero.description ||
                'I help businesses build a stronger digital presence through creative social media content, strategic marketing, audience engagement, SEO, and conversion-focused digital solutions.'}
            </p>

            {/* Compact Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href={hero.ctaUrlWork || '#portfolio'}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#10B981] text-white font-semibold text-xs hover:bg-[#059669] transition-colors active:scale-95 whitespace-nowrap"
              >
                <span>{hero.ctaTextWork || 'Explore My Work'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-[#111827] border border-[#E2E8F0] font-semibold text-xs hover:bg-[#F3F7F5] hover:border-slate-300 transition-colors active:scale-95 whitespace-nowrap"
              >
                <span>Hire Me on Fiverr</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
              </a>

              <a
                href="#videos"
                className="min-h-[40px] inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#64748B] hover:text-[#10B981] transition-colors whitespace-nowrap"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
                <span>Watch Showreel</span>
              </a>
            </div>

            {/* Compact Cross-Platform Line */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-semibold text-[#111827]">Platforms:</span>
              <span className="text-[#64748B]">{platforms.join(' · ')}</span>
            </div>
          </div>

          {/* Right Column: Compact Brand Portrait Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs sm:max-w-sm bg-white p-2.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d2822] to-emerald-950 flex items-center justify-center">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(16,185,129,0.22),transparent_65%)] pointer-events-none"
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
                        ? 'relative -mt-12 sm:-mt-10 w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-xl ring-2 ring-emerald-500/15 bg-slate-800'
                        : 'w-full h-full'
                    }
                  >
                    <img
                      ref={imgRef}
                      src={heroImageSrc}
                      alt="PJ - Social Media Marketing & Digital Growth"
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

                <div
                  className={`absolute inset-0 flex items-end p-4 pointer-events-none ${
                    isCompactPortrait
                      ? 'bg-gradient-to-t from-slate-950/90 via-transparent to-transparent justify-center text-center'
                      : 'bg-gradient-to-t from-slate-950/80 via-transparent to-transparent'
                  }`}
                >
                  <div className="text-white space-y-0.5">
                    <div className="text-base font-bold tracking-tight">PJ</div>
                    <div className="text-[11px] text-emerald-300 font-medium">
                      Creative Storyteller &amp; Digital Growth Strategist
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

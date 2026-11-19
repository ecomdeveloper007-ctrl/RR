import React, { useState } from 'react';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { initialFiverrGigs } from '../firebase/seed';
import type { FiverrGigItem } from '../types/portfolio';

export const ServicesSection: React.FC = () => {
  const { fiverrGigs, siteSettings } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Use Firestore gigs or fallback to initial gigs
  const activeGigs: FiverrGigItem[] = (
    fiverrGigs && fiverrGigs.length > 0 ? fiverrGigs : initialFiverrGigs
  ).filter((gig) => gig.isActive !== false);

  const categories = [
    'All',
    ...Array.from(new Set(activeGigs.map((g) => g.category))),
  ];

  const filteredGigs =
    selectedCategory === 'All'
      ? activeGigs
      : activeGigs.filter((g) => g.category === selectedCategory);

  const fiverrProfileUrl = siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid';

  return (
    <section id="services" className="py-8 sm:py-10 bg-[#F3F7F5] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="flex flex-col gap-3.5 mb-5 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-6">
            <div className="max-w-2xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tabular-nums">
                <span>Services</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-[#64748B] font-medium">
                  {activeGigs.length} Fiverr Offerings
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight [text-wrap:balance]">
                Build, Grow &amp; Strengthen Your Digital Presence
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
                Social media content, digital marketing, SEO, and Shopify development tailored for business growth.
              </p>
            </div>

            <div className="flex items-center justify-between lg:flex-col lg:items-end gap-1.5 shrink-0 text-xs">
              <span className="text-[#64748B] font-medium tabular-nums">
                Showing {filteredGigs.length} of {activeGigs.length}
              </span>
              <a
                href={fiverrProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#059669] hover:text-[#111827] transition-colors whitespace-nowrap"
              >
                <span>View Fiverr Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Compact Category Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter services by category"
            className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto no-scrollbar max-w-full lg:w-fit lg:flex-wrap"
          >
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? activeGigs.length
                  : activeGigs.filter((g) => g.category === cat).length;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981] ${
                    isSelected
                      ? 'bg-[#10B981] text-white'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`tabular-nums text-[11px] font-medium ${
                      isSelected ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Services Grid: Swipeable on mobile, 2 cols tablet, 3 cols laptop, 4 cols desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
          {filteredGigs.map((gig, idx) => {
            const gigKey = gig.id || `${gig.title}-${idx}`;
            const hasImage = Boolean(gig.imageUrl) && !failedImages[gigKey];

            return (
              <article
                key={gigKey}
                className="min-w-[78%] sm:min-w-0 snap-start bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#10B981]/60 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Compact Visual Header */}
                  <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                    {hasImage ? (
                      <img
                        src={gig.imageUrl}
                        alt={gig.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [gigKey]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-800 flex items-center justify-center p-4 text-center">
                        <span className="text-xs font-semibold text-emerald-200 line-clamp-2">
                          {gig.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-emerald-200 tracking-wide tabular-nums">
                      0{idx + 1} · {gig.category}
                    </span>
                  </div>

                  {/* Compact Content Body */}
                  <div className="p-3.5 sm:p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#059669]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Fiverr Verified</span>
                    </div>

                    <h3 className="text-sm sm:text-[15px] font-bold text-[#111827] group-hover:text-[#059669] transition-colors leading-snug line-clamp-2">
                      {gig.title}
                    </h3>

                    <p className="text-xs text-[#64748B] leading-relaxed font-normal line-clamp-2">
                      {gig.description}
                    </p>
                  </div>
                </div>

                {/* Compact Bottom CTA */}
                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#64748B] font-medium truncate">
                    Order on Fiverr
                  </span>

                  <a
                    href={gig.fiverrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-colors active:scale-95 whitespace-nowrap shrink-0"
                  >
                    <span>{gig.buttonLabel || 'Explore'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

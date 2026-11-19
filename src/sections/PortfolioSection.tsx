import React, { useState } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { ProjectItem } from '../types/portfolio';
import { PaidAdsPortfolioSubsection } from '../components/portfolio/PaidAdsPortfolioSubsection';

const PAID_ADS_CATEGORY = 'Paid Ads & Campaign Performance';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { projects, paidAds } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const publishedProjects = projects.filter((p) => p.isPublished);
  const hasPublishedPaidAds = paidAds.some((ad) => ad.isPublished);

  const baseCategories = Array.from(new Set(publishedProjects.map((p) => p.category)));
  const categories = hasPublishedPaidAds
    ? ['All', ...baseCategories, ...(baseCategories.includes(PAID_ADS_CATEGORY) ? [] : [PAID_ADS_CATEGORY])]
    : ['All', ...baseCategories];

  const isPaidAdsOnly = activeCategory === PAID_ADS_CATEGORY;
  const showPaidAdsSection = hasPublishedPaidAds && (activeCategory === 'All' || isPaidAdsOnly);

  const filteredProjects =
    activeCategory === 'All'
      ? publishedProjects
      : isPaidAdsOnly
      ? []
      : publishedProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-8 sm:py-10 bg-[#F3F7F5] border-t border-[#E2E8F0] overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-2xl min-w-0 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tabular-nums">
              <span>Portfolio</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#64748B] font-medium">
                Selected Work &amp; Proven Impact
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight leading-tight [text-wrap:balance]">
              Featured Case Studies &amp; Deliverables
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Platform architectures, Shopify storefronts, and multi-market conversion campaigns.
            </p>
          </div>

          {/* Compact Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter portfolio by category"
            className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-xl border border-[#E2E8F0] w-full xl:w-auto xl:max-w-2xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F3F7F5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Projects Gallery: Swipeable on mobile, 2 cols tablet, 3 cols desktop */}
        {filteredProjects.length > 0 && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
            {filteredProjects.map((project, idx) => {
              const projectKey = project.id || `${project.title}-${idx}`;
              const hasImage = Boolean(project.thumbnail) && !failedImages[projectKey];
              const techList = project.technologies
                ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3)
                : [];

              return (
                <article
                  key={projectKey}
                  onClick={() => onSelectProject(project)}
                  className="min-w-[80%] sm:min-w-0 snap-start bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#10B981]/60 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Compact Thumbnail Container */}
                    <div className="relative h-36 sm:h-40 w-full bg-slate-900 overflow-hidden">
                      {hasImage ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [projectKey]: true }))
                          }
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-800 flex items-center justify-center p-4 text-center">
                          <span className="text-xs font-semibold text-emerald-200 line-clamp-2">
                            {project.title}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold text-emerald-300 tracking-wide block truncate">
                            {project.clientName}
                          </span>
                          <h3 className="text-sm sm:text-[15px] font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors line-clamp-1">
                            {project.title}
                          </h3>
                        </div>
                        {project.isFeatured && (
                          <span
                            title="Featured project"
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-200 shrink-0"
                          >
                            <Star className="w-3 h-3 fill-current text-emerald-400" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Content Info */}
                    <div className="p-3.5 sm:p-4 space-y-2">
                      <div className="text-[11px] font-semibold text-[#059669] truncate">
                        {project.category}
                      </div>

                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2">
                        {project.shortSummary}
                      </p>

                      {techList.length > 0 && (
                        <p className="text-[11px] text-[#64748B] truncate pt-0.5">
                          {techList.join(' · ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Compact Card Bottom Action */}
                  <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#059669] group-hover:text-[#111827] flex items-center gap-1 transition-colors">
                      <span>Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-[11px] text-[#64748B] font-medium">Read Results →</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Dedicated Paid Ads & Campaign Performance Subsection */}
        {showPaidAdsSection && <PaidAdsPortfolioSubsection standalone={isPaidAdsOnly} />}
      </div>
    </section>
  );
};

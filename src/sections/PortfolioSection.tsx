import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowUpRight, Star, Cpu, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { ProjectItem } from '../types/portfolio';
import { PaidAdsPortfolioSubsection } from '../components/portfolio/PaidAdsPortfolioSubsection';

const PAID_ADS_CATEGORY = 'Paid Ads & Campaign Performance';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { projects, paidAds, siteSettings } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

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
    <section id="portfolio" className="py-10 sm:py-12 lg:py-16 bg-[#F3F7F5] border-t border-slate-200/80 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-5 lg:gap-6 mb-7 sm:mb-8">
          <div className="max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
              Selected Work &amp; Proven Impact
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Featured Case Studies &amp; High-Impact Deliverables
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Explore in-depth breakdowns of enterprise platform architectures, custom Shopify storefronts, and multi-market conversion funnels.
            </p>
          </div>

          {/* Filter Tabs: Clean responsive wrap on tablet/desktop & easy-tap wrap on mobile */}
          <div
            role="tablist"
            aria-label="Filter portfolio by category"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full xl:w-auto xl:max-w-2xl"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[38px] sm:min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F3F7F5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Gallery */}
        {filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {filteredProjects.map((project, idx) => {
              const techList = project.technologies
                ? project.technologies.split(',').map((t) => t.trim()).slice(0, 3)
                : [];

              return (
                <motion.div
                  key={project.id || idx}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
                  onClick={() => onSelectProject(project)}
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-56 sm:h-64 lg:h-72 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-slate-900 backdrop-blur-sm shadow-sm truncate">
                        {project.category}
                      </span>
                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[11px] sm:text-xs font-medium text-emerald-300 uppercase tracking-wider block mb-1">
                        {project.clientName}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content info */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                      {project.shortSummary}
                    </p>

                    {/* Tech stack badges */}
                    {techList.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {techList.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card bottom click action */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1.5">
                        View In-Depth Case Study <ArrowUpRight className="w-4 h-4" />
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Read Results →</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Dedicated Paid Ads & Campaign Performance Subsection */}
        {showPaidAdsSection && <PaidAdsPortfolioSubsection standalone={isPaidAdsOnly} />}

        {/* Interested in Similar Work CTA Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-[#111827]">Interested in Similar Work?</h4>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Discover custom service packages tailored to your brand goals on my verified Fiverr profile.
            </p>
          </div>
          <a
            href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>Explore My Fiverr Services</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

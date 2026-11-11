import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, ArrowUpRight, Star, Cpu, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { ProjectItem } from '../types/portfolio';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const publishedProjects = projects.filter((p) => p.isPublished);

  const categories = ['All', ...Array.from(new Set(publishedProjects.map((p) => p.category)))];

  const filteredProjects =
    activeCategory === 'All'
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 lg:py-28 bg-[#F3F7F5] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
              Selected Work & Proven Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Featured Case Studies & High-Impact Deliverables
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Explore in-depth breakdowns of enterprise platform architectures, custom Shopify storefronts, and multi-market conversion funnels.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-slate-900 backdrop-blur-sm shadow-sm">
                      {project.category}
                    </span>
                    {project.isFeatured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-sm">
                        <Star className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider block mb-1">
                      {project.clientName}
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
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
      </div>
    </section>
  );
};

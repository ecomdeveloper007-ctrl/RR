import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { initialFiverrGigs } from '../firebase/seed';
import type { FiverrGigItem } from '../types/portfolio';

export const ServicesSection: React.FC = () => {
  const { fiverrGigs, siteSettings } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
    <section id="services" className="py-10 sm:py-12 lg:py-16 bg-[#F3F7F5] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:gap-5 mb-7 sm:mb-9">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 lg:gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-3 tabular-nums">
                <span>Explore My Services</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-[#64748B] font-medium">
                  {activeGigs.length} Specialized Fiverr Gigs
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#111827] tracking-tight leading-[1.15] [text-wrap:balance]">
                Everything You Need to Build, Grow and Strengthen Your Digital Presence.
              </h2>
              <p className="mt-3.5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed font-normal max-w-2xl">
                From social media content and digital marketing to SEO and Shopify website development, explore my services and find the right solution for your business.
              </p>
            </div>

            <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 pt-1 lg:pt-0 shrink-0 text-xs">
              <span className="text-[#64748B] font-medium tabular-nums">
                Showing {filteredGigs.length} of {activeGigs.length} services
              </span>
              <a
                href={fiverrProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#059669] hover:text-[#111827] transition-colors whitespace-nowrap min-h-[40px] lg:min-h-0"
              >
                <span>View My Fiverr Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Category Filter Tabs: Horizontal swipe on mobile/tablet, clean wrap on desktop */}
          <div
            role="tablist"
            aria-label="Filter services by category"
            className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#E2E8F0] overflow-x-auto no-scrollbar max-w-full lg:w-fit lg:flex-wrap"
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
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] sm:min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B981] ${
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

        {/* 7 Fiverr Gigs Grid: 3 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredGigs.map((gig, idx) => (
            <motion.div
              key={gig.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Visual Header with Hover Zoom */}
                <div className="relative h-52 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={gig.imageUrl}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-emerald-800 border border-emerald-200/80 backdrop-blur-md shadow-xs uppercase tracking-wider">
                      {gig.category}
                    </span>
                  </div>

                  {/* Verified Fiverr Tag */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 text-emerald-300 border border-emerald-700/60 backdrop-blur-md flex items-center gap-1 shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Fiverr Verified</span>
                    </span>
                  </div>

                  {/* Title Preview on image bottom */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] font-medium text-emerald-300 uppercase tracking-widest block mb-0.5">
                      Service Offering 0{idx + 1}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-[#111827] group-hover:text-emerald-700 transition-colors leading-snug">
                    {gig.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal min-h-[4.5rem]">
                    {gig.description}
                  </p>
                </div>
              </div>

              {/* Card Bottom CTA */}
              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>Order on Fiverr</span>
                  </div>

                  <a
                    href={gig.fiverrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] shadow-sm shadow-emerald-500/20 hover:shadow-md transition-all active:scale-95 group/btn"
                  >
                    <span>{gig.buttonLabel || 'Explore Service'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Hire Me Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 max-w-2xl text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Looking for a Custom Package or Ongoing Digital Retainer?
            </h4>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Directly request a custom offer or consultation through my verified Fiverr Pro profile with full escrow protection.
            </p>
          </div>

          <a
            href={fiverrProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#111827] text-white text-xs sm:text-sm font-semibold hover:bg-[#10B981] shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>Hire Me on Fiverr</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

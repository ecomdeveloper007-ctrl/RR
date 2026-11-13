import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Video, Film, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { VideoItem } from '../types/portfolio';

interface VideosSectionProps {
  onSelectVideo: (video: VideoItem) => void;
}

export const VideosSection: React.FC<VideosSectionProps> = ({ onSelectVideo }) => {
  const { videos, siteSettings } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const publishedVideos = videos.filter((v) => v.isPublished);

  const categories = ['All', ...Array.from(new Set(publishedVideos.map((v) => v.category)))];

  const filteredVideos =
    activeCategory === 'All'
      ? publishedVideos
      : publishedVideos.filter((v) => v.category === activeCategory);

  if (publishedVideos.length === 0) return null;

  return (
    <section id="videos" className="py-10 sm:py-12 lg:py-16 bg-[#F3F7F5] border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7 sm:mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
              <Film className="w-3.5 h-3.5 text-emerald-600" />
              Creative Video & Showreel Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              High-Retention Video Production & Strategy Breakdowns
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed font-normal">
              Short-form reels, campaign breakdowns, and conversion walkthroughs built to capture immediate viewer attention and drive action.
            </p>
          </div>

          {/* Filter Categories with Horizontal Scroll on Touch Devices */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-slate-200 shadow-sm overflow-x-auto no-scrollbar max-w-full shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
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

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredVideos.map((video, idx) => (
            <motion.div
              key={video.id || idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectVideo(video)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Thumbnail Frame */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-600/90 text-white flex items-center justify-center pl-0.5 shadow-lg shadow-emerald-600/30 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-sm text-white">
                      {video.category}
                    </span>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-white">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{video.duration}</span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  Watch Video Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-slate-500">Click to Play</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Need Creative Content CTA Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-bold text-[#111827]">Need Creative Content?</h4>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Order viral short-form video reels, scripts, and social management on my verified Fiverr profile.
            </p>
          </div>
          <a
            href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>View My Fiverr Services</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

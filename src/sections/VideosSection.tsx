import React, { useState } from 'react';
import { Play, Clock, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { VideoItem } from '../types/portfolio';

interface VideosSectionProps {
  onSelectVideo: (video: VideoItem) => void;
}

export const VideosSection: React.FC<VideosSectionProps> = ({ onSelectVideo }) => {
  const { videos } = usePortfolio();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const publishedVideos = videos.filter((v) => v.isPublished);

  const categories = ['All', ...Array.from(new Set(publishedVideos.map((v) => v.category)))];

  const filteredVideos =
    activeCategory === 'All'
      ? publishedVideos
      : publishedVideos.filter((v) => v.category === activeCategory);

  if (publishedVideos.length === 0) return null;

  return (
    <section id="videos" className="py-8 sm:py-10 bg-[#F3F7F5] border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div className="max-w-2xl space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tabular-nums">
              <span>Video Showcase</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#64748B] font-medium">
                {publishedVideos.length} Productions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
              Video Production &amp; Strategy Breakdowns
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
              Short-form reels, campaign breakdowns, and conversion walkthroughs built to drive action.
            </p>
          </div>

          {/* Compact Filter Categories */}
          <div
            role="tablist"
            aria-label="Filter videos by category"
            className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E2E8F0] overflow-x-auto no-scrollbar max-w-full shrink-0"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#64748B] hover:text-[#111827] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Video Cards Grid: Swipeable on mobile, 2 cols tablet, 3 cols laptop, 4 cols desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0">
          {filteredVideos.map((video, idx) => {
            const videoKey = video.id || `${video.title}-${idx}`;
            const hasImage = Boolean(video.thumbnail) && !failedImages[videoKey];

            return (
              <article
                key={videoKey}
                onClick={() => onSelectVideo(video)}
                className="min-w-[78%] sm:min-w-0 snap-start bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden hover:border-[#10B981]/60 hover:-translate-y-0.5 transition-all duration-150 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Compact Thumbnail Frame */}
                  <div className="relative h-32 sm:h-36 w-full bg-slate-900 overflow-hidden">
                    {hasImage ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={() =>
                          setFailedImages((prev) => ({ ...prev, [videoKey]: true }))
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-800 flex items-center justify-center p-4 text-center">
                        <span className="text-xs font-semibold text-emerald-200 line-clamp-2">
                          {video.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/35 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-[#10B981]/95 text-white flex items-center justify-center pl-0.5 shadow-md group-hover:scale-110 group-hover:bg-[#059669] transition-all duration-200">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {video.duration && (
                      <div className="absolute bottom-2 right-2.5 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-950/80 text-white tabular-nums">
                        <Clock className="w-2.5 h-2.5 text-emerald-400" />
                        <span>{video.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 sm:p-4 space-y-1">
                    <div className="text-[11px] font-semibold text-[#059669] truncate">
                      {video.category}
                    </div>
                    <h3 className="text-sm sm:text-[15px] font-bold text-[#111827] group-hover:text-[#059669] transition-colors leading-snug line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed font-normal line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#059669] flex items-center gap-1">
                    <span>Watch Breakdown</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-[#64748B]">Play</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

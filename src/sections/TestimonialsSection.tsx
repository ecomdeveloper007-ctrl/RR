import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const ITEMS_PER_PAGE = 3;

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'C';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolio();
  const [pageIndex, setPageIndex] = useState(0);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>({});
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const published = [...testimonials]
    .filter((t) => t.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (published.length === 0) return null;

  const totalPages = Math.ceil(published.length / ITEMS_PER_PAGE);
  const safePageIndex = pageIndex < totalPages ? pageIndex : 0;
  const visibleReviews =
    totalPages > 1
      ? published.slice(
          safePageIndex * ITEMS_PER_PAGE,
          safePageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      : published;

  const avgRating = (
    published.reduce((sum, item) => sum + (item.rating || 5), 0) / published.length
  ).toFixed(1);

  const handlePrev = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    setPageIndex((prev) => (prev + 1) % totalPages);
  };

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 py-8 sm:py-10 bg-[#F3F7F5] border-t border-[#E2E8F0] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 sm:mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] tabular-nums">
              <span>Client Reviews</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#111827] font-bold">{avgRating} / 5.0</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-[#64748B] font-medium">
                {published.length} Verified {published.length === 1 ? 'Endorsement' : 'Endorsements'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
              Trusted by Founders &amp; Global Teams
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
              <span className="text-xs font-medium text-[#64748B] tabular-nums mr-1">
                {safePageIndex + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous reviews"
                className="w-10 h-10 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] flex items-center justify-center hover:border-[#10B981] hover:text-[#059669] transition-colors active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next reviews"
                className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center hover:bg-[#059669] transition-colors active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Compact 3-Column Review Strip (Swipeable on mobile, 3-up on desktop) */}
        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0">
          {visibleReviews.map((item, idx) => {
            const cardKey = item.id || `${item.clientName}-${idx}`;
            const hasAvatar = Boolean(item.avatarUrl) && !failedAvatars[cardKey];
            const isLongQuote = item.testimonialText.length > 210;
            const isExpanded = Boolean(expandedCards[cardKey]);

            return (
              <article
                key={cardKey}
                className="min-w-[82%] sm:min-w-[46%] md:min-w-0 snap-start bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 flex flex-col justify-between gap-4 hover:border-[#10B981]/50 transition-colors"
              >
                <div className="space-y-2.5">
                  {/* Compact Rating & Verified Metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx < (item.rating || 5)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-[11px] font-bold text-[#111827] tabular-nums">
                        {(item.rating || 5).toFixed(1)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#059669]">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified</span>
                    </span>
                  </div>

                  {/* Concise Quote Copy */}
                  <div>
                    <blockquote
                      className={`text-xs sm:text-[13px] text-[#334155] leading-relaxed font-normal ${
                        isLongQuote && !isExpanded ? 'line-clamp-4' : ''
                      }`}
                    >
                      &ldquo;{item.testimonialText}&rdquo;
                    </blockquote>
                    {isLongQuote && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCards((prev) => ({
                            ...prev,
                            [cardKey]: !prev[cardKey],
                          }))
                        }
                        className="mt-1 text-[11px] font-semibold text-[#059669] hover:text-[#111827] transition-colors"
                      >
                        {isExpanded ? 'Show less' : 'Read full review'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Compact Author Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 min-w-0">
                  {hasAvatar ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.clientName}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() =>
                        setFailedAvatars((prev) => ({ ...prev, [cardKey]: true }))
                      }
                      className="w-9 h-9 rounded-full object-cover border border-[#E2E8F0] shrink-0"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-bold flex items-center justify-center shrink-0"
                    >
                      {getInitials(item.clientName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#111827] truncate">
                      {item.clientName}
                    </h3>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {item.designation}
                      {item.company ? ` · ${item.company}` : ''}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

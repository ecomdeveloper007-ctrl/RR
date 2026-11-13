import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = usePortfolio();
  const [currentIndex, setCurrentIndex] = useState(0);

  const published = testimonials.filter((t) => t.isPublished);

  if (published.length === 0) return null;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % published.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + published.length) % published.length);
  };

  const current = published[currentIndex];

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 py-10 sm:py-12 lg:py-16 bg-[#F3F7F5] border-t border-slate-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7 sm:mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
              <Quote className="w-3.5 h-3.5 text-emerald-600" />
              Client Endorsements
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Trusted by Founders, Directors & Global Brands
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Real feedback from executive leaders on Agile sprint governance, Shopify architecture, and digital strategy.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTestimonial}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Active Card Display */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id || currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative"
            >
              <Quote className="absolute top-6 right-8 w-14 h-14 text-emerald-100 pointer-events-none" />

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="text-lg sm:text-2xl font-medium text-slate-800 leading-relaxed tracking-tight mb-6">
                &ldquo;{current.testimonialText}&rdquo;
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <div className="flex items-center gap-4">
                  {current.avatarUrl && (
                    <img
                      src={current.avatarUrl}
                      alt={current.clientName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/30"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {current.clientName}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500">
                      {current.designation} &bull;{' '}
                      <span className="font-medium text-slate-700">{current.company}</span>
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Client</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator with Accessible Touch Targets */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {published.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className="min-h-[44px] min-w-[32px] flex items-center justify-center p-2"
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <span
                  className={`h-2 rounded-full transition-all block ${
                    currentIndex === i ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

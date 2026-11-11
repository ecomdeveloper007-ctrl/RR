import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  PenTool,
  Share2,
  Link,
  Target,
  ShoppingBag,
  CheckCircle2,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const serviceIconMap: Record<string, React.ElementType> = {
  FileText,
  PenTool,
  Share2,
  Link,
  Target,
  ShoppingBag,
};

export const ServicesSection: React.FC = () => {
  const { services } = usePortfolio();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const publishedServices = services.filter((s) => s.isPublished);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Specialized Professional Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Six Strategic Services Engineered for Measurable Digital Outcomes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Formulated from verified execution methodologies in our Social Media & Growth Playbooks. Every deliverable is designed to solve critical bottlenecks and generate tangible ROI.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service, idx) => {
            const IconComp = serviceIconMap[service.iconName] || ShoppingBag;
            const isExpanded = expandedId === (service.id || String(idx));
            const deliverables = service.deliverables
              ? service.deliverables.split('\n').map((d) => d.trim()).filter(Boolean)
              : [];

            return (
              <motion.div
                key={service.id || idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Service Card Top */}
                <div>
                  {/* Image banner if present */}
                  {service.imageUrl && (
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-sm">
                          Service #{idx + 1}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Icon and Category */}
                    {!service.imageUrl && (
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200 shadow-sm">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          0{idx + 1}
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {service.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {service.shortDescription}
                    </p>

                    {/* Expandable deliverables and full details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-2 space-y-3 overflow-hidden"
                        >
                          <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 leading-relaxed">
                            {service.fullDescription}
                          </div>

                          {deliverables.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                Exact Deliverables:
                              </span>
                              {deliverables.map((d, dIdx) => (
                                <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{d}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Service Card Bottom Actions */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100/80 flex items-center justify-between gap-3">
                  <button
                    onClick={() => toggleExpand(service.id || String(idx))}
                    className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Show Less' : 'View Deliverables'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <a
                    href={service.ctaUrl || '#contact'}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 shadow-sm transition-all active:scale-95"
                  >
                    <span>{service.ctaText || 'Inquire Now'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

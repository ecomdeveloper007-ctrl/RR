import React from 'react';
import { ArrowUpRight, Mail, Phone, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { siteSettings, services } = usePortfolio();

  return (
    <footer className="bg-[#111827] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Introduction */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-[#111827] font-extrabold text-base shadow-lg shadow-emerald-500/20">
                P
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {siteSettings.brandingName || 'Patricia'}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              Creative storytelling. Strategic marketing. Measurable digital growth. Building high-retention social content, authoritative SEO footprints, and conversion-focused digital storefronts.
            </p>

              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#services" className="hover:text-[#10B981] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-[#10B981] transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-[#10B981] transition-colors">
                  Video Showcase
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-[#10B981] transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-[#10B981] transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#10B981] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {services.slice(0, 6).map((srv, idx) => (
                <li key={srv.id || idx}>
                  <a href="#services" className="hover:text-[#10B981] transition-colors line-clamp-1">
                    {srv.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Profiles & Fiverr Link */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Verified Profiles
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 border border-slate-700/60 transition-all font-medium text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    Fiverr Pro Portfolio
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row (no admin link or credentials exposed) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{siteSettings.copyrightText || '© 2026 Patricia. All Rights Reserved.'}</div>
          <div className="text-slate-500">
            Creative Storytelling &bull; Strategic Marketing &bull; Measurable Digital Growth
          </div>
        </div>
      </div>
    </footer>
  );
};

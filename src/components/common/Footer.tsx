import React from 'react';
import { ArrowUpRight, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { initialFiverrGigs } from '../../firebase/seed';

export const Footer: React.FC = () => {
  const { siteSettings, fiverrGigs } = usePortfolio();

  const gigs = (fiverrGigs && fiverrGigs.length > 0 ? fiverrGigs : initialFiverrGigs).filter(
    (g) => g.isActive !== false
  );

  const fiverrUrl = siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid';
  const brandName = siteSettings.brandingName || 'Patricia';

  return (
    <footer className="bg-[#111827] text-slate-300 pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 pb-8 border-b border-slate-800">
          {/* Brand & Introduction */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-[#111827] font-extrabold text-base shadow-lg shadow-emerald-500/20">
                {brandName.charAt(0) || 'P'}
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {brandName}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              Creative storytelling. Strategic marketing. Measurable digital growth. Discover high-converting social campaigns, Shopify engineering, and specialized Fiverr gig solutions.
            </p>

            <div className="pt-2">
              <a
                href={fiverrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 text-emerald-400 text-xs font-semibold hover:bg-slate-800 hover:text-emerald-300 border border-slate-700/70 transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Fiverr Pro Partner</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (No Contact Link) */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#home" className="hover:text-[#10B981] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#10B981] transition-colors">
                  About {brandName}
                </a>
              </li>
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
                <a href="#guide" className="hover:text-[#10B981] transition-colors">
                  Social Media Guide
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
            </ul>
          </div>

          {/* Seven Fiverr Gigs Direct Links */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Fiverr Gigs
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {gigs.map((gig, idx) => (
                <li key={gig.id || idx}>
                  <a
                    href={gig.fiverrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#10B981] transition-colors line-clamp-1 flex items-center justify-between group"
                  >
                    <span>{gig.title}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-[#10B981] shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Verified Profiles & Direct Hiring */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Direct Ordering
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] transition-all font-semibold shadow-md shadow-emerald-500/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Hire Me on Fiverr
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href={fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-all font-medium text-slate-300"
                >
                  <span>Explore My Fiverr Gigs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href={fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700/60 transition-all font-medium text-slate-300"
                >
                  <span>Order Your Service</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              {siteSettings.linkedinUrl && (
                <li>
                  <a
                    href={siteSettings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl text-slate-400 hover:text-white transition-all text-xs"
                  >
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{siteSettings.copyrightText || `© 2026 ${brandName}. All Rights Reserved.`}</div>
          <div className="text-slate-500">
            Creative Storytelling &bull; Strategic Marketing &bull; Measurable Digital Growth
          </div>
        </div>
      </div>
    </footer>
  );
};

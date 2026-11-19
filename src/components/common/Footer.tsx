import React from 'react';
import { ArrowUpRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { initialFiverrGigs } from '../../firebase/seed';

export const Footer: React.FC = () => {
  const { siteSettings, fiverrGigs } = usePortfolio();

  const gigs = (fiverrGigs && fiverrGigs.length > 0 ? fiverrGigs : initialFiverrGigs).filter(
    (g) => g.isActive !== false
  );

  const fiverrUrl = siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid';
  const brandName = siteSettings.brandingName || 'Patricia';

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: `About ${brandName}`, href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Guide', href: '#guide' },
    { label: 'Videos', href: '#videos' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <footer className="bg-[#111827] text-slate-300 py-6 sm:py-7 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Row: Compact Brand & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10B981] flex items-center justify-center text-[#111827] font-extrabold text-sm shrink-0">
                {brandName.charAt(0) || 'P'}
              </div>
              <span className="font-extrabold text-base text-white tracking-tight whitespace-nowrap">
                {brandName}
              </span>
              <span aria-hidden="true" className="text-slate-600 hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Verified Fiverr Pro Partner</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xl font-normal">
              High-converting social campaigns, Shopify solutions, and specialized Fiverr gig services.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={fiverrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <span>Hire Me on Fiverr</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {siteSettings.linkedinUrl && (
              <a
                href={siteSettings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700/70 transition-colors text-xs font-medium whitespace-nowrap shrink-0"
              >
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Middle Row: Inline Navigation & Fiverr Gigs */}
        <div className="space-y-2.5 pb-4 border-b border-slate-800 text-xs">
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="text-white font-semibold shrink-0">Explore:</span>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-400 hover:text-[#10B981] transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {gigs.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="text-white font-semibold shrink-0">Fiverr Gigs:</span>
              {gigs.map((gig, idx) => (
                <a
                  key={gig.id || idx}
                  href={gig.fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-[#10B981] transition-colors group"
                >
                  <span>{gig.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-[#10B981] shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>{siteSettings.copyrightText || `© 2026 ${brandName}. All Rights Reserved.`}</div>
          <div>
            Creative Storytelling &bull; Strategic Marketing &bull; Measurable Digital Growth
          </div>
        </div>
      </div>
    </footer>
  );
};

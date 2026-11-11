import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Navbar: React.FC = () => {
  const { siteSettings } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 40);

      const sections = [
        'home',
        'about',
        'services',
        'portfolio',
        'guide',
        'videos',
        'case-studies',
        'testimonials',
        'contact',
      ];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Social Media Guide', href: '#guide' },
    { name: 'Videos', href: '#videos' },
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <>
      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#10B981] transition-all duration-150 origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E2E8F0] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group text-[#111827]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-teal-700 flex items-center justify-center text-white font-extrabold text-base shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#111827] group-hover:text-[#10B981] transition-colors">
                Patricia
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
                Digital Growth
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#F3F7F5] p-1.5 rounded-full border border-[#E2E8F0] backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-[#10B981] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-white/70'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Header Action Button */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#111827] text-white hover:bg-[#10B981] shadow-xs hover:shadow-md transition-all duration-200 active:scale-95"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white/98 backdrop-blur-xl border-b border-[#E2E8F0] px-6 py-6 shadow-xl space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                    activeSection === link.href.replace('#', '')
                      ? 'bg-[#D1FAE5] text-emerald-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]">
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-[#10B981] text-white font-semibold text-xs shadow-md shadow-emerald-500/20 block"
              >
                Let&apos;s Discuss Your Project
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { ProjectModal } from './components/common/ProjectModal';
import { ResourceModal } from './components/common/ResourceModal';
import { VideoModal } from './components/common/VideoModal';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ServicesSection } from './sections/ServicesSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { ResourcesSection } from './sections/ResourcesSection';
import { VideosSection } from './sections/VideosSection';
import { CaseStudiesSection } from './sections/CaseStudiesSection';
import { CreativeProcessSection } from './sections/CreativeProcessSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import type { ProjectItem, ResourceItem, VideoItem } from './types/portfolio';

function PortfolioApp() {
  const { isAdmin, user } = useAuth();
  const { toastMessage, clearToast } = usePortfolio();

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Check URL path or hash for /pj-control or #pj-control (plus /admin and #admin fallback)
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isPathAdmin = path.startsWith('/pj-control') || path.startsWith('/admin');
      const isHashAdmin = hash === '#pj-control' || hash === '#admin';

      if (isPathAdmin || isHashAdmin) {
        if (isAdmin || user) {
          setIsAdminOpen(true);
        } else {
          setIsLoginOpen(true);
        }
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    window.addEventListener('popstate', checkRoute);
    return () => {
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('popstate', checkRoute);
    };
  }, [isAdmin, user]);

  const cleanAdminUrl = () => {
    if (window.location.hash === '#pj-control' || window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    if (
      window.location.pathname.startsWith('/pj-control') ||
      window.location.pathname.startsWith('/admin')
    ) {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 font-sans antialiased">
      {/* Sticky Navigation with 9 Public Anchors */}
      <Navbar />

      {/* Main Single-Page Continuous Public Scrolling Sections */}
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection onSelectProject={setSelectedProject} />
        <ResourcesSection onSelectResource={setSelectedResource} />
        <VideosSection onSelectVideo={setSelectedVideo} />
        <CaseStudiesSection />
        <CreativeProcessSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      {/* Dark Footer with verified links and no admin indicator */}
      <Footer />

      {/* In-Page Interactive Case Study Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      {/* In-Page Interactive Starter Guide Reader Modal */}
      <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />

      {/* Dedicated Click-to-Play Video Modal */}
      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

      {/* Private Admin Authentication Dialog */}
      {isLoginOpen && (
        <AdminLogin
          onClose={() => {
            setIsLoginOpen(false);
            cleanAdminUrl();
          }}
          onSuccess={() => {
            setIsLoginOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      {/* Private Admin CMS Dashboard with 17 Modules */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => {
            setIsAdminOpen(false);
            cleanAdminUrl();
          }}
        />
      )}

      {/* Global Real-time Toast Notifications */}
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PortfolioProvider>
        <PortfolioApp />
      </PortfolioProvider>
    </AuthProvider>
  );
}


import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, AlertTriangle, Lightbulb, Cpu, ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '../../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const galleryList = project.galleryImages
    ? project.galleryImages.split(',').map((url) => url.trim()).filter(Boolean)
    : [];

  const techList = project.technologies
    ? project.technologies.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto border border-slate-200">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {project.category}
            </span>
            <span className="ml-2 text-xs text-slate-500 font-medium">
              Client: {project.clientName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero image */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-900 overflow-hidden">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl">
                {project.shortSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Project Overview
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Challenges & Strategy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                The Core Challenges
              </div>
              <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
                {project.challenges}
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-5">
              <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                Strategic Approach
              </div>
              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed">
                {project.strategy}
              </p>
            </div>
          </div>

          {/* Verified Results */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified Measured Outcomes
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {project.results}
            </p>
          </div>

          {/* Technologies Used */}
          {techList.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                Technologies & Architecture Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {techList.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Previews if multiple images */}
          {galleryList.length > 1 && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Project Gallery
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryList.map((img, i) => (
                  <div key={i} className="h-32 rounded-lg overflow-hidden border border-slate-200">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* External links */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                >
                  <span>Visit Live Solution</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {project.fiverrUrl && (
                <a
                  href={project.fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <span>Order Similar on Fiverr</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Back to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

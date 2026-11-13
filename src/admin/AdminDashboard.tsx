import React, { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  User,
  ShoppingBag,
  BookOpen,
  Briefcase,
  Film,
  BarChart3,
  Quote,
  RefreshCw,
  Mail,
  Image,
  Navigation,
  Search,
  Users,
  History,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle,
  Eye,
  ExternalLink,
  ShieldCheck,
  Filter,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { PaidAdsManagerTab } from './PaidAdsManagerTab';
import type {
  ProjectItem,
  VideoItem,
  CaseStudyItem,
  CreativeProcessItem,
  ResourceItem,
  TestimonialItem,
  EnquiryItem,
  MediaItem,
  FiverrGigItem,
} from '../types/portfolio';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const {
    siteSettings,
    hero,
    about,
    fiverrGigs,
    projects,
    paidAds,
    videos,
    caseStudies,
    creativeProcess,
    resources,
    testimonials,
    enquiries,
    mediaList,
    auditLogs,
    isDbConnected,
    updateSiteSettings,
    updateHero,
    updateAbout,
    saveFiverrGig,
    deleteFiverrGig,
    saveProject,
    deleteProject,
    saveVideo,
    deleteVideo,
    saveCaseStudy,
    deleteCaseStudy,
    saveProcessStage,
    deleteProcessStage,
    saveResource,
    deleteResource,
    saveTestimonial,
    deleteTestimonial,
    updateEnquiryStatus,
    deleteEnquiry,
    addMediaItem,
    deleteMediaItem,
    refreshSeedData,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Single-doc forms
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [heroForm, setHeroForm] = useState({ ...hero });
  const [aboutForm, setAboutForm] = useState({ ...about });

  // Modal / Editing states for collections
  const [editingFiverrGig, setEditingFiverrGig] = useState<FiverrGigItem | null>(null);
  const [showPreviewGig, setShowPreviewGig] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudyItem | null>(null);
  const [editingProcess, setEditingProcess] = useState<CreativeProcessItem | null>(null);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // Enquiry filters
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState<string>('');

  // Media form
  const [newMediaForm, setNewMediaForm] = useState({
    fileName: '',
    fileUrl: '',
    fileType: 'image/jpeg',
    fileSize: 180000,
  });

  // User management state
  const [adminUsersList, setAdminUsersList] = useState([
    { email: 'prakashinfosys1234@gmail.com', role: 'Super Admin', status: 'Active' },
  ]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'content_editor'>('content_editor');

  const menuItems = [
    { id: 'overview', label: '1. Dashboard Overview', icon: LayoutDashboard },
    { id: 'homepage', label: '2. Homepage Manager', icon: Home },
    { id: 'about', label: '3. About Manager', icon: User },
    { id: 'fiverr_gigs', label: '4. Fiverr Gig Manager', icon: ShoppingBag, count: fiverrGigs.length },
    { id: 'guide', label: '5. Social Media Guide Manager', icon: BookOpen, count: resources.length },
    { id: 'portfolio', label: '6. Portfolio Manager', icon: Briefcase, count: projects.length },
    { id: 'paid_ads', label: '7. Paid Ads & Glossary', icon: BarChart3, count: paidAds.length },
    { id: 'videos', label: '8. Video Manager', icon: Film, count: videos.length },
    { id: 'case_studies', label: '8. Case Studies Manager', icon: BarChart3, count: caseStudies.length },
    { id: 'testimonials', label: '9. Testimonials Manager', icon: Quote, count: testimonials.length },
    { id: 'process', label: '10. Creative Process Manager', icon: RefreshCw, count: creativeProcess.length },
    { id: 'media', label: '11. Media Library', icon: Image, count: mediaList.length },
    { id: 'navigation', label: '12. Navigation & Footer', icon: Navigation },
    { id: 'seo', label: '13. SEO Settings', icon: Search },
    { id: 'users', label: '14. User & Role Management', icon: Users },
    { id: 'audit', label: '15. Audit Logs', icon: History, count: auditLogs.length },
    { id: 'settings', label: '16. Website Settings', icon: Settings },
  ];

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesFilter = enquiryFilter === 'all' || e.status === enquiryFilter;
    const query = enquirySearch.toLowerCase();
    const matchesSearch =
      !query ||
      e.fullName.toLowerCase().includes(query) ||
      e.email.toLowerCase().includes(query) ||
      (e.businessName && e.businessName.toLowerCase().includes(query)) ||
      (e.service && e.service.toLowerCase().includes(query)) ||
      e.message.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Off-canvas drawer on mobile/tablet, fixed column on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 ease-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              PJ
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">PJ Admin CMS</h2>
              <p className="text-[10px] text-slate-400">Firebase Cloud Firestore</p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16 Menu items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#10B981] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      isActive
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="truncate font-medium">{user?.email || 'Authorized Admin'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
          </div>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-950/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between bg-slate-950/60 shrink-0 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile hamburger menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h1>
            <span className="hidden md:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-medium shrink-0">
              Live Cloud Firestore
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={refreshSeedData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
              title="Synchronize defaults"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sync Defaults</span>
            </button>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Website</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Projects', val: projects.length, color: 'text-emerald-400' },
                  { label: 'Published Work', val: projects.filter((p) => p.isPublished).length, color: 'text-teal-400' },
                  { label: 'Total Videos', val: videos.length, color: 'text-cyan-400' },
                  { label: 'Case Studies', val: caseStudies.length, color: 'text-amber-400' },
                  {
                    label: 'Fiverr Gigs',
                    val: fiverrGigs.length,
                    color: 'text-emerald-400 font-extrabold',
                  },
                  { label: 'Testimonials', val: testimonials.length, color: 'text-blue-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {stat.label}
                    </span>
                    <span className={`text-2xl font-bold mt-1 block ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>

              {/* Quick Actions & Fiverr Gigs Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#10B981]" />
                      <h3 className="font-bold text-sm text-white">Active Fiverr Commercial Gigs</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold">
                        {fiverrGigs.filter((g) => g.isActive).length} Live
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('fiverr_gigs')}
                      className="text-xs text-[#10B981] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Manage All ({fiverrGigs.length})</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {fiverrGigs.slice(0, 4).map((gig) => (
                      <div
                        key={gig.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={gig.imageUrl}
                            alt={gig.title}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white truncate">{gig.title}</span>
                              {gig.isFeatured && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  FEATURED
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-emerald-400 block truncate">
                              {gig.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={gig.fiverrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Open Gig on Fiverr"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setEditingFiverrGig(gig);
                              setActiveTab('fiverr_gigs');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-850">
                    <span>Direct profile link: <strong className="text-slate-200">fiverr.com/pjangid</strong></span>
                    <a
                      href="https://www.fiverr.com/pjangid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#10B981] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Visit Fiverr Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800">
                    Quick Operations
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setEditingFiverrGig({
                          title: '',
                          description: '',
                          category: 'SEO & Content Writing',
                          fiverrUrl: 'https://www.fiverr.com/pjangid',
                          buttonLabel: 'Order on Fiverr',
                          imageUrl:
                            'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
                          displayOrder: fiverrGigs.length + 1,
                          isActive: true,
                          isFeatured: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        });
                        setActiveTab('fiverr_gigs');
                      }}
                      className="w-full text-left p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-xs font-semibold text-emerald-300 flex items-center justify-between"
                    >
                      <span>+ Add New Fiverr Gig</span>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#10B981]" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingVideo({
                          title: '',
                          category: 'Reels & Video Content',
                          description: '',
                          videoUrl: '',
                          videoType: 'youtube',
                          thumbnail:
                            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
                          isFeatured: true,
                          displayOrder: videos.length + 1,
                          isPublished: true,
                        });
                        setActiveTab('videos');
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>+ Add Video Breakdown</span>
                      <Film className="w-3.5 h-3.5 text-[#10B981]" />
                    </button>

                    <button
                      onClick={() => {
                        setEditingCaseStudy({
                          title: '',
                          clientName: '',
                          industry: '',
                          objective: '',
                          challenge: '',
                          strategy: '',
                          execution: '',
                          platforms: 'Instagram, Meta Ads, Shopify',
                          resultsSummary: '',
                          metrics: [{ label: 'ROAS', value: '4.2x' }],
                          thumbnail: '',
                          displayOrder: caseStudies.length + 1,
                          isPublished: true,
                        });
                        setActiveTab('case_studies');
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>+ Create Case Study</span>
                      <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
                    </button>

                    <button
                      onClick={() => setActiveTab('homepage')}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between"
                    >
                      <span>Edit Hero & Headline</span>
                      <Home className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOMEPAGE MANAGER */}
          {activeTab === 'homepage' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Homepage & Hero Section Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Small Subtitle / Category Label
                  </label>
                  <input
                    type="text"
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={heroForm.headline}
                    onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Hero Supporting Description
                  </label>
                  <textarea
                    rows={3}
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Brand / Profile Photo URL
                    </label>
                    <input
                      type="text"
                      value={heroForm.profileImageUrl || ''}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, profileImageUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Primary CTA Label & Link
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={heroForm.ctaTextWork}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaTextWork: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={heroForm.ctaUrlWork}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaUrlWork: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => updateHero(heroForm)}
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Homepage Content</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT MANAGER */}
          {activeTab === 'about' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">About PJ Section Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Section Headline
                  </label>
                  <input
                    type="text"
                    value={aboutForm.headline}
                    onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Professional Introduction
                  </label>
                  <textarea
                    rows={4}
                    value={aboutForm.bio}
                    onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Creative Philosophy
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.creativePhilosophy || ''}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, creativePhilosophy: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Strategic Marketing Approach
                    </label>
                    <textarea
                      rows={3}
                      value={aboutForm.strategicApproach || ''}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, strategicApproach: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => updateAbout(aboutForm)}
                  className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update About Content</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: FIVERR GIG MANAGER */}
          {activeTab === 'fiverr_gigs' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#10B981]" />
                    <span>Official Fiverr Gigs ({fiverrGigs.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage commercial services and packages linked directly to your verified Fiverr profile.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.fiverr.com/pjangid"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <span>Fiverr Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => {
                      setEditingFiverrGig({
                        title: '',
                        description: '',
                        category: 'SEO & Content Writing',
                        fiverrUrl: 'https://www.fiverr.com/pjangid',
                        buttonLabel: 'Order on Fiverr',
                        imageUrl:
                          'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
                        displayOrder: fiverrGigs.length + 1,
                        isActive: true,
                        isFeatured: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      });
                      setShowPreviewGig(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Fiverr Gig</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Fiverr Gig Form */}
              {editingFiverrGig && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 shadow-xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">
                        {editingFiverrGig.id ? 'Edit Fiverr Commercial Gig' : 'Add New Fiverr Commercial Gig'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewGig(!showPreviewGig)}
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreviewGig ? 'Hide Live Preview' : 'Show Live Preview'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Fields Column */}
                    <div className={showPreviewGig ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Gig Title *
                        </label>
                        <input
                          type="text"
                          value={editingFiverrGig.title}
                          onChange={(e) =>
                            setEditingFiverrGig({ ...editingFiverrGig, title: e.target.value })
                          }
                          placeholder="e.g. SEO Website Content Writing & Conversion Copy"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Service Category *
                          </label>
                          <input
                            type="text"
                            value={editingFiverrGig.category}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, category: e.target.value })
                            }
                            placeholder="e.g. SEO & Content Writing"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            CTA Button Label
                          </label>
                          <input
                            type="text"
                            value={editingFiverrGig.buttonLabel}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, buttonLabel: e.target.value })
                            }
                            placeholder="Order on Fiverr"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Official Fiverr Gig URL *
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={editingFiverrGig.fiverrUrl}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, fiverrUrl: e.target.value })
                            }
                            placeholder="https://www.fiverr.com/pjangid/..."
                            className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                          />
                          <a
                            href={editingFiverrGig.fiverrUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-emerald-400"
                            title="Test Link in New Tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Must be a valid Fiverr link under your profile (https://www.fiverr.com/pjangid).
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Cover Image URL *
                          </label>
                          <input
                            type="text"
                            value={editingFiverrGig.imageUrl}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, imageUrl: e.target.value })
                            }
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Display Order (Sort)
                          </label>
                          <input
                            type="number"
                            value={editingFiverrGig.displayOrder}
                            onChange={(e) =>
                              setEditingFiverrGig({
                                ...editingFiverrGig,
                                displayOrder: parseInt(e.target.value, 10) || 1,
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
                          <input
                            type="checkbox"
                            checked={editingFiverrGig.isActive}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, isActive: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                          />
                          <span>Active on Public Website</span>
                        </label>

                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-amber-300">
                          <input
                            type="checkbox"
                            checked={editingFiverrGig.isFeatured}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, isFeatured: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                          />
                          <span>Featured Gig (Prominent Badge)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Gig Description & Deliverables *
                        </label>
                        <textarea
                          rows={4}
                          value={editingFiverrGig.description}
                          onChange={(e) =>
                            setEditingFiverrGig({ ...editingFiverrGig, description: e.target.value })
                          }
                          placeholder="Comprehensive description of what is included, deliverables, turn-around time, and strategic value..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Live Preview Card Column */}
                    {showPreviewGig && (
                      <div className="lg:col-span-5 bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Live Card Preview
                          </span>
                          <span className="text-[10px] text-emerald-400">Public Appearance</span>
                        </div>

                        <div className={`rounded-2xl border overflow-hidden bg-white text-slate-900 shadow-lg ${
                          editingFiverrGig.isFeatured ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                        }`}>
                          <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                            <img
                              src={editingFiverrGig.imageUrl || 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'}
                              alt="Gig preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-emerald-700 backdrop-blur-xs shadow-xs">
                                {editingFiverrGig.category || 'Category'}
                              </span>
                              {editingFiverrGig.isFeatured && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981] text-white flex items-center gap-1 shadow-xs">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <h5 className="font-bold text-sm text-slate-900 line-clamp-2">
                              {editingFiverrGig.title || 'Untitled Fiverr Gig'}
                            </h5>
                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {editingFiverrGig.description || 'Gig description will appear here on public display.'}
                            </p>
                            <div className="pt-2 border-t border-slate-100">
                              <span className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] text-white font-semibold text-xs shadow-xs">
                                <span>{editingFiverrGig.buttonLabel || 'Order on Fiverr'}</span>
                                <ExternalLink className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingFiverrGig(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!editingFiverrGig.title.trim() || !editingFiverrGig.fiverrUrl.trim()) {
                          return;
                        }
                        await saveFiverrGig(editingFiverrGig);
                        setEditingFiverrGig(null);
                      }}
                      className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Gig to Firebase</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Gigs List with Reordering & Quick Toggles */}
              <div className="space-y-3">
                {fiverrGigs
                  .slice()
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((gig, idx, arr) => (
                    <div
                      key={gig.id || idx}
                      className={`p-4 rounded-2xl bg-slate-950 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        gig.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-850 opacity-60'
                      }`}
                    >
                      {/* Left thumbnail and info */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        {/* Display order & reordering controls */}
                        <div className="flex flex-col items-center gap-0.5 shrink-0 bg-slate-900 p-1 rounded-lg border border-slate-800">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={async () => {
                              if (idx > 0) {
                                const prev = arr[idx - 1];
                                const currentOrder = gig.displayOrder;
                                const prevOrder = prev.displayOrder;
                                await saveFiverrGig({ ...gig, displayOrder: prevOrder });
                                await saveFiverrGig({ ...prev, displayOrder: currentOrder });
                              }
                            }}
                            className="p-1 hover:text-emerald-400 disabled:opacity-20 text-slate-400"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-bold text-slate-300">#{gig.displayOrder}</span>
                          <button
                            type="button"
                            disabled={idx === arr.length - 1}
                            onClick={async () => {
                              if (idx < arr.length - 1) {
                                const next = arr[idx + 1];
                                const currentOrder = gig.displayOrder;
                                const nextOrder = next.displayOrder;
                                await saveFiverrGig({ ...gig, displayOrder: nextOrder });
                                await saveFiverrGig({ ...next, displayOrder: currentOrder });
                              }
                            }}
                            className="p-1 hover:text-emerald-400 disabled:opacity-20 text-slate-400"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <img
                          src={gig.imageUrl}
                          alt={gig.title}
                          className="w-16 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                        />

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-white line-clamp-1">{gig.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-850 text-emerald-400 font-semibold border border-slate-800">
                              {gig.category}
                            </span>
                            {gig.isFeatured && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Featured</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                            {gig.description}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="text-slate-500">CTA: <strong className="text-slate-300">{gig.buttonLabel}</strong></span>
                            <a
                              href={gig.fiverrUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                            >
                              <span>Official Fiverr Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right action toggles & buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {/* Quick Active Toggle */}
                        <button
                          type="button"
                          onClick={() => saveFiverrGig({ ...gig, isActive: !gig.isActive })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            gig.isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          }`}
                          title="Click to toggle visibility on website"
                        >
                          {gig.isActive ? 'Active' : 'Hidden'}
                        </button>

                        {/* Quick Featured Toggle */}
                        <button
                          type="button"
                          onClick={() => saveFiverrGig({ ...gig, isFeatured: !gig.isFeatured })}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            gig.isFeatured
                              ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-300'
                          }`}
                          title="Toggle Featured status"
                        >
                          <Star className={`w-3.5 h-3.5 ${gig.isFeatured ? 'fill-current' : ''}`} />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFiverrGig(gig);
                            setShowPreviewGig(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete gig "${gig.title}"?`)) {
                              if (gig.id) deleteFiverrGig(gig.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                          title="Delete Gig"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                {fiverrGigs.length === 0 && (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">No Fiverr gigs configured in database yet.</p>
                    <button
                      onClick={refreshSeedData}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 font-semibold"
                    >
                      Restore 7 Default Fiverr Gigs
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GUIDE MANAGER */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Social Media Starter Guide Modules ({resources.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingResource({
                      title: '',
                      category: 'Social Media Starter Guide',
                      subsectionKey: 'A',
                      shortDescription: '',
                      detailedContent: '',
                      keyTakeaways: '',
                      displayOrder: resources.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guide Topic</span>
                </button>
              </div>

              {editingResource && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Topic Title</label>
                      <input
                        type="text"
                        value={editingResource.title}
                        onChange={(e) =>
                          setEditingResource({ ...editingResource, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Subsection Key (A through N)
                      </label>
                      <input
                        type="text"
                        value={editingResource.subsectionKey || ''}
                        onChange={(e) =>
                          setEditingResource({ ...editingResource, subsectionKey: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Detailed Content</label>
                    <textarea
                      rows={5}
                      value={editingResource.detailedContent}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, detailedContent: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingResource(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveResource(editingResource);
                        setEditingResource(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Topic
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {resources.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Module {item.subsectionKey || idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.shortDescription}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingResource(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => item.id && deleteResource(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PORTFOLIO MANAGER */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Portfolio Projects ({projects.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingProject({
                      title: '',
                      clientName: '',
                      category: 'Social Media Content',
                      shortSummary: '',
                      overview: '',
                      challenges: '',
                      strategy: '',
                      results: '',
                      technologies: '',
                      thumbnail:
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                      isFeatured: true,
                      displayOrder: projects.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {editingProject && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editingProject.clientName}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, clientName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingProject.category}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Summary</label>
                    <input
                      type="text"
                      value={editingProject.shortSummary}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortSummary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveProject(editingProject);
                        setEditingProject(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{p.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.shortSummary}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-850 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingProject(p)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => p.id && deleteProject(p.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6B / 7: PAID ADS & GLOSSARY MANAGER */}
          {activeTab === 'paid_ads' && <PaidAdsManagerTab />}

          {/* TAB 7: VIDEO MANAGER */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Video Showcase ({videos.length})</h3>
                <button
                  onClick={() =>
                    setEditingVideo({
                      title: '',
                      category: 'Reels & Video Content',
                      description: '',
                      videoUrl: '',
                      videoType: 'youtube',
                      thumbnail:
                        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
                      isFeatured: true,
                      displayOrder: videos.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Video</span>
                </button>
              </div>

              {editingVideo && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Video Title</label>
                      <input
                        type="text"
                        value={editingVideo.title}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={editingVideo.category}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Video URL (YouTube, Vimeo, or MP4)
                      </label>
                      <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={editingVideo.videoUrl}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, videoUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Thumbnail URL</label>
                      <input
                        type="text"
                        value={editingVideo.thumbnail}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, thumbnail: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingVideo.description}
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveVideo(editingVideo);
                        setEditingVideo(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Video
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {v.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{v.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{v.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingVideo(v)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => v.id && deleteVideo(v.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CASE STUDIES */}
          {activeTab === 'case_studies' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Case Studies & Results ({caseStudies.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingCaseStudy({
                      title: '',
                      clientName: '',
                      industry: 'Fashion Retail',
                      objective: '',
                      challenge: '',
                      strategy: '',
                      execution: '',
                      platforms: 'Instagram, Meta Ads, Shopify',
                      resultsSummary: '',
                      metrics: [{ label: 'ROAS', value: '3.8x' }],
                      thumbnail:
                        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
                      displayOrder: caseStudies.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Case Study</span>
                </button>
              </div>

              {editingCaseStudy && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingCaseStudy.title}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editingCaseStudy.clientName}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, clientName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Industry</label>
                      <input
                        type="text"
                        value={editingCaseStudy.industry}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, industry: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Results Summary (Verified figures only)
                    </label>
                    <textarea
                      rows={2}
                      value={editingCaseStudy.resultsSummary}
                      onChange={(e) =>
                        setEditingCaseStudy({ ...editingCaseStudy, resultsSummary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingCaseStudy(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveCaseStudy(editingCaseStudy);
                        setEditingCaseStudy(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Case Study
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        {cs.industry} &bull; {cs.clientName}
                      </span>
                      <h4 className="text-sm font-bold text-white">{cs.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{cs.resultsSummary}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingCaseStudy(cs)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => cs.id && deleteCaseStudy(cs.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Testimonials ({testimonials.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingTestimonial({
                      clientName: '',
                      designation: '',
                      company: '',
                      testimonialText: '',
                      rating: 5,
                      displayOrder: testimonials.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {editingTestimonial && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editingTestimonial.clientName}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            clientName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Company</label>
                      <input
                        type="text"
                        value={editingTestimonial.company}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            company: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Role</label>
                      <input
                        type="text"
                        value={editingTestimonial.designation}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            designation: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Review</label>
                    <textarea
                      rows={3}
                      value={editingTestimonial.testimonialText}
                      onChange={(e) =>
                        setEditingTestimonial({
                          ...editingTestimonial,
                          testimonialText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingTestimonial(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveTestimonial(editingTestimonial);
                        setEditingTestimonial(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Testimonial
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {t.clientName} &bull; <span className="text-xs text-slate-400">{t.company}</span>
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">&ldquo;{t.testimonialText}&rdquo;</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTestimonial(t)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => t.id && deleteTestimonial(t.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: CREATIVE PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-6 max-w-4xl">
              <h3 className="font-bold text-sm text-white">
                6-Stage Creative Process Management ({creativeProcess.length})
              </h3>
              <div className="space-y-3">
                {creativeProcess.map((step) => (
                  <div
                    key={step.id || step.stepNumber}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold flex items-center justify-center">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">{step.shortDesc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {step.deliverables.map((d, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: CONTACT INBOX */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Contact Inbox ({enquiries.length})</h3>
                  <p className="text-xs text-slate-400">
                    Lead submissions captured from the single-page contact form.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search by name, email..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <select
                    value={enquiryFilter}
                    onChange={(e) => setEnquiryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value="all">All</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{enq.fullName}</span>
                        {enq.businessName && (
                          <span className="text-xs text-emerald-400">({enq.businessName})</span>
                        )}
                        <a
                          href={`mailto:${enq.email}`}
                          className="text-xs text-slate-400 hover:underline"
                        >
                          {enq.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            enq.id &&
                            updateEnquiryStatus(
                              enq.id,
                              e.target.value as EnquiryItem['status'],
                              enq.notes
                            )
                          }
                          className="text-xs font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          onClick={() => enq.id && deleteEnquiry(enq.id)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold">Service:</span> {enq.service} &bull;{' '}
                      <span className="text-slate-400 font-semibold">Budget:</span>{' '}
                      {enq.budgetRange || 'Unspecified'}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 text-xs text-slate-200">
                      {enq.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-5xl">
              <h3 className="font-bold text-sm text-white">Central Media Assets & Previews</h3>
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase">Register New Asset</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="File Name"
                    value={newMediaForm.fileName}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, fileName: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Direct Asset URL"
                    value={newMediaForm.fileUrl}
                    onChange={(e) => setNewMediaForm({ ...newMediaForm, fileUrl: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                  <button
                    onClick={async () => {
                      if (!newMediaForm.fileName || !newMediaForm.fileUrl) return;
                      await addMediaItem(newMediaForm);
                      setNewMediaForm({ fileName: '', fileUrl: '', fileType: 'image/jpeg', fileSize: 180000 });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold"
                  >
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: NAVIGATION & FOOTER */}
          {activeTab === 'navigation' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Navigation & Footer Links</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Fiverr Pro URL</label>
                  <input
                    type="text"
                    value={settingsForm.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, fiverrUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Copyright Statement</label>
                  <input
                    type="text"
                    value={settingsForm.copyrightText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => updateSiteSettings(settingsForm)}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold"
                >
                  Save Navigation Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 14: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Search Engine Optimization</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.seoDescription || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => updateSiteSettings(settingsForm)}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold"
                >
                  Save SEO Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 15: USER & ROLE MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">User & Role Management</h3>
              <div className="space-y-3">
                {adminUsersList.map((adm, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{adm.email}</span>
                      <span className="ml-3 text-[11px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                        {adm.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{adm.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 16: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="max-w-4xl space-y-3">
              <h3 className="font-bold text-sm text-white">Immutable Security Audit Logs ({auditLogs.length})</h3>
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-400">{log.action}</span>
                    <span className="text-slate-500 ml-2">in {log.module}</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 17: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Global Website Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Branding Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandingName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandingName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800">
                <button
                  onClick={() => updateSiteSettings(settingsForm)}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold"
                >
                  Save Global Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

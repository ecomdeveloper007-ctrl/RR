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
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import type {
  ServiceItem,
  ProjectItem,
  VideoItem,
  CaseStudyItem,
  CreativeProcessItem,
  ResourceItem,
  TestimonialItem,
  EnquiryItem,
  MediaItem,
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
    services,
    projects,
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
    saveService,
    deleteService,
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

  // Single-doc forms
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [heroForm, setHeroForm] = useState({ ...hero });
  const [aboutForm, setAboutForm] = useState({ ...about });

  // Modal / Editing states for collections
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
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
    { id: 'services', label: '4. Services Manager', icon: ShoppingBag, count: services.length },
    { id: 'guide', label: '5. Social Media Guide Manager', icon: BookOpen, count: resources.length },
    { id: 'portfolio', label: '6. Portfolio Manager', icon: Briefcase, count: projects.length },
    { id: 'videos', label: '7. Video Manager', icon: Film, count: videos.length },
    { id: 'case_studies', label: '8. Case Studies Manager', icon: BarChart3, count: caseStudies.length },
    { id: 'testimonials', label: '9. Testimonials Manager', icon: Quote, count: testimonials.length },
    { id: 'process', label: '10. Creative Process Manager', icon: RefreshCw, count: creativeProcess.length },
    {
      id: 'enquiries',
      label: '11. Contact Inbox',
      icon: Mail,
      count: enquiries.filter((e) => e.status === 'new').length,
      badgeColor: 'bg-rose-500',
    },
    { id: 'media', label: '12. Media Library', icon: Image, count: mediaList.length },
    { id: 'navigation', label: '13. Navigation & Footer', icon: Navigation },
    { id: 'seo', label: '14. SEO Settings', icon: Search },
    { id: 'users', label: '15. User & Role Management', icon: Users },
    { id: 'audit', label: '16. Audit Logs', icon: History, count: auditLogs.length },
    { id: 'settings', label: '17. Website Settings', icon: Settings },
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
      {/* Sidebar Navigation */}
      <aside className="w-64 sm:w-72 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              Patricia
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Patricia Admin CMS</h2>
              <p className="text-[10px] text-slate-400">Backend</p>
            </div>
          </div>
        </div>

        {/* 17 Menu items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
                      item.badgeColor
                        ? `${item.badgeColor} text-white`
                        : isActive
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
        <header className="h-16 border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-white capitalize">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-medium">
              Live Cloud Firestore
            </span>
          </div>

          <div className="flex items-center gap-3">
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
                    label: 'New Inquiries',
                    val: enquiries.filter((e) => e.status === 'new').length,
                    color: 'text-rose-400 font-extrabold',
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

              {/* Quick Actions & Recent Enquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#10B981]" />
                      Recent Inbound Enquiries
                    </h3>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs text-[#10B981] hover:underline font-semibold"
                    >
                      Manage Inbox ({enquiries.length})
                    </button>
                  </div>

                  {enquiries.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No customer enquiries yet. Submissions from the contact form appear here in real time.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {enquiries.slice(0, 4).map((enq) => (
                        <div
                          key={enq.id}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{enq.fullName}</span>
                              {enq.businessName && (
                                <span className="text-[11px] text-slate-400">({enq.businessName})</span>
                              )}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  enq.status === 'new'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {enq.status}
                              </span>
                            </div>
                            <span className="text-xs text-slate-400 block line-clamp-1 mt-0.5">
                              {enq.service || 'General'}: {enq.message}
                            </span>
                          </div>
                          <button
                            onClick={() => setActiveTab('enquiries')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 shrink-0"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800">
                    Quick Operations
                  </h3>
                  <div className="space-y-2">
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
              <h3 className="font-bold text-sm text-white">About Patricia Section Content</h3>
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

          {/* TAB 4: SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  6 Core Commercial Services ({services.length})
                </h3>
                <button
                  onClick={() =>
                    setEditingService({
                      title: '',
                      shortDescription: '',
                      fullDescription: '',
                      iconName: 'ShoppingBag',
                      deliverables: '',
                      benefits: '',
                      displayOrder: services.length + 1,
                      isPublished: true,
                    })
                  }
                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              {editingService && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <h4 className="font-bold text-sm text-emerald-400">
                    {editingService.id ? 'Edit Service' : 'New Service'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Service Title</label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) =>
                          setEditingService({ ...editingService, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingService.imageUrl || ''}
                        onChange={(e) =>
                          setEditingService({ ...editingService, imageUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingService.shortDescription}
                      onChange={(e) =>
                        setEditingService({ ...editingService, shortDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Deliverables (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={editingService.deliverables}
                      onChange={(e) =>
                        setEditingService({ ...editingService, deliverables: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white font-mono text-[11px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveService(editingService);
                        setEditingService(null);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
                    >
                      Save Service
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {services.map((srv, idx) => (
                  <div
                    key={srv.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{srv.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{srv.shortDescription}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingService(srv)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => srv.id && deleteService(srv.id)}
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

import React, { useEffect, useMemo, useState } from 'react';
import {
  LayoutDashboard,
  Home,
  User,
  Briefcase,
  ShoppingBag,
  BookOpen,
  Film,
  BarChart3,
  Quote,
  RefreshCw,
  Mail,
  Image as ImageIcon,
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
  Eye,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Star,
  Menu,
  X,
  Loader2,
  Lock,
  Copy,
  Layers,
  Upload,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import { PaidAdsManagerTab } from './PaidAdsManagerTab';
import { TeamManagementTab } from './TeamManagementTab';
import { MediaUploadField } from './components/MediaUploadField';
import { uploadMediaFile } from '../firebase/storage';
import { ROLE_METADATA } from '../utils/rbac';
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
  FiverrGigItem,
  TeamPermissionKey,
} from '../types/portfolio';

interface AdminDashboardProps {
  onClose: () => void;
}

interface MenuItemConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  perm?: TeamPermissionKey;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const {
    user,
    teamMember,
    isSuperAdmin,
    canWrite,
    canDelete,
    hasPermission,
    logout,
  } = useAuth();
  const {
    siteSettings,
    hero,
    about,
    services,
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
    teamMembers,
    auditLogs,
    isDbConnected,
    updateSiteSettings,
    updateHero,
    updateAbout,
    saveService,
    deleteService,
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
    showToast,
  } = usePortfolio();

  const currentRole = teamMember?.role || (isSuperAdmin ? 'super_admin' : 'viewer');
  const isRoleAdminOrHigher = isSuperAdmin || currentRole === 'admin';
  const roleMeta = ROLE_METADATA[currentRole];

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Single-doc forms synced continuously with Cloud Firestore snapshots
  const [settingsForm, setSettingsForm] = useState({ ...siteSettings });
  const [heroForm, setHeroForm] = useState({ ...hero });
  const [aboutForm, setAboutForm] = useState({ ...about });

  useEffect(() => {
    setSettingsForm({ ...siteSettings });
  }, [siteSettings]);

  useEffect(() => {
    setHeroForm({ ...hero });
  }, [hero]);

  useEffect(() => {
    setAboutForm({ ...about });
  }, [about]);

  // Modal / Editing states for collections
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingFiverrGig, setEditingFiverrGig] = useState<FiverrGigItem | null>(null);
  const [showPreviewGig, setShowPreviewGig] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudyItem | null>(null);
  const [editingProcess, setEditingProcess] = useState<CreativeProcessItem | null>(null);
  const [processDeliverablesText, setProcessDeliverablesText] = useState<string>('');
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // Enquiry filters
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState<string>('');

  // Media Library upload & manual URL states
  const [libraryUploadProgress, setLibraryUploadProgress] = useState<number | null>(null);
  const [newMediaForm, setNewMediaForm] = useState({
    fileName: '',
    fileUrl: '',
    fileType: 'image/jpeg',
    fileSize: 180000,
  });

  const menuItems = useMemo<MenuItemConfig[]>(() => {
    const allItems: MenuItemConfig[] = [
      { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, perm: 'view_dashboard' },
      { id: 'homepage', label: 'Homepage Manager', icon: Home, perm: 'manage_portfolio' },
      { id: 'about', label: 'About Manager', icon: User, perm: 'manage_portfolio' },
      { id: 'services', label: 'Services Manager', icon: Layers, perm: 'manage_services', count: services.length },
      { id: 'fiverr_gigs', label: 'Fiverr Gig Manager', icon: ShoppingBag, perm: 'manage_services', count: fiverrGigs.length },
      { id: 'guide', label: 'Social Media Guide', icon: BookOpen, perm: 'manage_portfolio', count: resources.length },
      { id: 'portfolio', label: 'Portfolio Manager', icon: Briefcase, perm: 'manage_portfolio', count: projects.length },
      { id: 'paid_ads', label: 'Paid Ads & Glossary', icon: BarChart3, perm: 'manage_portfolio', count: paidAds.length },
      { id: 'videos', label: 'Video Manager', icon: Film, perm: 'manage_videos', count: videos.length },
      { id: 'case_studies', label: 'Case Studies Manager', icon: BarChart3, perm: 'manage_case_studies', count: caseStudies.length },
      { id: 'testimonials', label: 'Testimonials Manager', icon: Quote, perm: 'manage_testimonials', count: testimonials.length },
      { id: 'process', label: 'Creative Process', icon: RefreshCw, perm: 'manage_portfolio', count: creativeProcess.length },
      { id: 'media', label: 'Media Library', icon: ImageIcon, perm: 'manage_media', count: mediaList.length },
      { id: 'enquiries', label: 'Contact Enquiries', icon: Mail, perm: 'view_dashboard', count: enquiries.length },
      { id: 'navigation', label: 'Navigation & Footer', icon: Navigation, perm: 'manage_website_settings', adminOnly: true },
      { id: 'seo', label: 'SEO Settings', icon: Search, perm: 'manage_website_settings', adminOnly: true },
      { id: 'team', label: 'Team Management', icon: Users, perm: 'manage_team_members', superAdminOnly: true, count: teamMembers.length },
      { id: 'audit', label: 'Audit Logs', icon: History, adminOnly: true, count: auditLogs.length },
      { id: 'settings', label: 'Website Settings', icon: Settings, perm: 'manage_website_settings', adminOnly: true },
    ];

    return allItems.filter((item) => {
      if (item.superAdminOnly && !isSuperAdmin) return false;
      if (item.adminOnly && !isRoleAdminOrHigher) return false;
      if (item.perm && !hasPermission(item.perm)) return false;
      return true;
    });
  }, [
    services.length,
    fiverrGigs.length,
    resources.length,
    projects.length,
    paidAds.length,
    videos.length,
    caseStudies.length,
    testimonials.length,
    creativeProcess.length,
    mediaList.length,
    enquiries.length,
    teamMembers.length,
    auditLogs.length,
    isSuperAdmin,
    isRoleAdminOrHigher,
    hasPermission,
  ]);

  // Redirect automatically if active tab becomes unauthorized due to live permission/role change
  useEffect(() => {
    if (menuItems.length > 0 && !menuItems.some((item) => item.id === activeTab)) {
      setActiveTab(menuItems[0].id);
    }
  }, [menuItems, activeTab]);

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesFilter = enquiryFilter === 'all' || e.status === enquiryFilter;
    const q = enquirySearch.toLowerCase();
    const matchesSearch =
      !q ||
      e.fullName.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.businessName && e.businessName.toLowerCase().includes(q)) ||
      (e.service && e.service.toLowerCase().includes(q)) ||
      e.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleLibraryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setLibraryUploadProgress(0);
    try {
      const uploaded = await uploadMediaFile(file, 'library', {
        acceptedCategory: 'any',
        onProgress: (pct) => setLibraryUploadProgress(pct),
      });
      await addMediaItem({
        fileName: uploaded.fileName,
        fileUrl: uploaded.downloadUrl,
        storagePath: uploaded.storagePath,
        fileType: uploaded.fileType,
        fileSize: uploaded.fileSize,
        uploadedBy: user?.email || 'admin',
      });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Upload failed.', 'error');
    } finally {
      setLibraryUploadProgress(null);
    }
  };

  const runSave = async (key: string, fn: () => Promise<void>, onSuccess?: () => void) => {
    setSavingKey(key);
    try {
      await fn();
      if (onSuccess) onSuccess();
    } catch {
      // Error toast already surfaced by PortfolioContext
    } finally {
      setSavingKey(null);
    }
  };

  const currentMenuIndex = menuItems.findIndex((m) => m.id === activeTab);
  const currentMenuLabel =
    currentMenuIndex >= 0
      ? `${currentMenuIndex + 1}. ${menuItems[currentMenuIndex].label}`
      : 'Dashboard';

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
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
              <p className="text-[10px] text-slate-400">
                {isDbConnected ? 'Firebase Cloud Firestore' : 'Connecting Firestore...'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permitted Menu Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item, idx) => {
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
                  <span className="truncate">
                    {idx + 1}. {item.label}
                  </span>
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

        {/* Sidebar Footer with Live Role Badge */}
        <div className="p-4 border-t border-slate-800 space-y-2.5">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-white truncate">
                {teamMember?.name || user?.displayName || 'Authorized Admin'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Verified Active" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {user?.email || teamMember?.email}
            </div>
            <div className="pt-0.5">
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleMeta.badgeClass}`}
              >
                {roleMeta.label}
              </span>
            </div>
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
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {currentMenuLabel}
            </h1>
            <span className="hidden md:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-medium shrink-0">
              Live Cloud Firestore
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isSuperAdmin && (
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      'Restore default PJ portfolio data into any empty sections? Existing customized records with the same IDs may be overwritten.'
                    )
                  ) {
                    refreshSeedData();
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                title="Synchronize defaults"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sync Defaults</span>
              </button>
            )}

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
          {/* Read-only notice for Viewers */}
          {!canWrite && (
            <div className="max-w-6xl p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Read-only Viewer access: You can inspect permitted dashboard sections and enquiries, but adding, editing, publishing, or deleting content is disabled.
              </span>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Projects', val: projects.length, color: 'text-emerald-400' },
                  { label: 'Services', val: services.length, color: 'text-teal-400' },
                  { label: 'Total Videos', val: videos.length, color: 'text-cyan-400' },
                  { label: 'Case Studies', val: caseStudies.length, color: 'text-amber-400' },
                  { label: 'Fiverr Gigs', val: fiverrGigs.length, color: 'text-emerald-400 font-extrabold' },
                  { label: 'Enquiries', val: enquiries.length, color: 'text-blue-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {stat.label}
                    </span>
                    <span className={`text-2xl font-bold mt-1 block ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>

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
                    {hasPermission('manage_services') && (
                      <button
                        onClick={() => setActiveTab('fiverr_gigs')}
                        className="text-xs text-[#10B981] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Manage All ({fiverrGigs.length})</span>
                      </button>
                    )}
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
                          {canWrite && hasPermission('manage_services') && (
                            <button
                              onClick={() => {
                                setEditingFiverrGig(gig);
                                setActiveTab('fiverr_gigs');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-850">
                    <span>
                      Direct profile link: <strong className="text-slate-200">fiverr.com/pjangid</strong>
                    </span>
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
                    {canWrite && hasPermission('manage_services') && (
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
                    )}

                    {canWrite && hasPermission('manage_videos') && (
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
                    )}

                    {canWrite && hasPermission('manage_case_studies') && (
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
                    )}

                    {hasPermission('manage_portfolio') && (
                      <button
                        onClick={() => setActiveTab('homepage')}
                        className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between"
                      >
                        <span>Edit Hero &amp; Headline</span>
                        <Home className="w-3.5 h-3.5 text-cyan-400" />
                      </button>
                    )}

                    {isSuperAdmin && (
                      <button
                        onClick={() => setActiveTab('team')}
                        className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-between"
                      >
                        <span>Manage Team Members ({teamMembers.length})</span>
                        <Users className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HOMEPAGE MANAGER */}
          {activeTab === 'homepage' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Homepage &amp; Hero Section Content</h3>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!canWrite}
                    checked={heroForm.isVisible}
                    onChange={(e) => setHeroForm({ ...heroForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                  />
                  <span>Section Visible</span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Small Subtitle / Category Label
                  </label>
                  <input
                    type="text"
                    disabled={!canWrite}
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Main Headline *
                  </label>
                  <input
                    type="text"
                    disabled={!canWrite}
                    value={heroForm.headline}
                    onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Hero Supporting Description *
                  </label>
                  <textarea
                    rows={3}
                    disabled={!canWrite}
                    value={heroForm.description}
                    onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>

                <MediaUploadField
                  label="Brand / Profile Photo"
                  value={heroForm.profileImageUrl || ''}
                  storagePath={heroForm.storagePath}
                  folder="hero"
                  acceptedCategory="image"
                  disabled={!canWrite}
                  onChange={(url, newStoragePath) =>
                    setHeroForm({ ...heroForm, profileImageUrl: url, storagePath: newStoragePath })
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Primary CTA Label &amp; Link
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        disabled={!canWrite}
                        value={heroForm.ctaTextWork}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaTextWork: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        disabled={!canWrite}
                        value={heroForm.ctaUrlWork}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaUrlWork: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Secondary Contact CTA &amp; Link
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        disabled={!canWrite}
                        value={heroForm.ctaTextContact}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaTextContact: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                      <input
                        type="text"
                        disabled={!canWrite}
                        value={heroForm.ctaUrlContact}
                        onChange={(e) => setHeroForm({ ...heroForm, ctaUrlContact: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">IT Experience</label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={heroForm.yearsIt}
                      onChange={(e) => setHeroForm({ ...heroForm, yearsIt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">PM Experience</label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={heroForm.yearsPm}
                      onChange={(e) => setHeroForm({ ...heroForm, yearsPm: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Projects Delivered</label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={heroForm.projectsDelivered}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, projectsDelivered: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Team Size Led</label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={heroForm.teamSizeLed}
                      onChange={(e) => setHeroForm({ ...heroForm, teamSizeLed: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {canWrite && (
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={savingKey === 'hero'}
                    onClick={() => setHeroForm({ ...hero })}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Reset to Saved
                  </button>
                  <button
                    type="button"
                    disabled={savingKey === 'hero'}
                    onClick={() => {
                      if (!heroForm.headline.trim()) {
                        showToast('Main Headline cannot be empty.', 'error');
                        return;
                      }
                      runSave('hero', () => updateHero(heroForm));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-60"
                  >
                    {savingKey === 'hero' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{savingKey === 'hero' ? 'Saving...' : 'Update Homepage Content'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ABOUT MANAGER */}
          {activeTab === 'about' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">About PJ Section Content</h3>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!canWrite}
                    checked={aboutForm.isVisible}
                    onChange={(e) => setAboutForm({ ...aboutForm, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                  />
                  <span>Section Visible</span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Section Headline *
                  </label>
                  <input
                    type="text"
                    disabled={!canWrite}
                    value={aboutForm.headline}
                    onChange={(e) => setAboutForm({ ...aboutForm, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    Professional Introduction *
                  </label>
                  <textarea
                    rows={4}
                    disabled={!canWrite}
                    value={aboutForm.bio}
                    onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Leadership Summary
                    </label>
                    <textarea
                      rows={3}
                      disabled={!canWrite}
                      value={aboutForm.leadershipSummary || ''}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, leadershipSummary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Client Coordination
                    </label>
                    <textarea
                      rows={3}
                      disabled={!canWrite}
                      value={aboutForm.clientCoordination || ''}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, clientCoordination: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Creative Philosophy
                    </label>
                    <textarea
                      rows={3}
                      disabled={!canWrite}
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
                      disabled={!canWrite}
                      value={aboutForm.strategicApproach || ''}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, strategicApproach: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      IT Experience Years
                    </label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={aboutForm.itExperienceYears}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, itExperienceYears: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Project Management Years
                    </label>
                    <input
                      type="text"
                      disabled={!canWrite}
                      value={aboutForm.pmExperienceYears}
                      onChange={(e) =>
                        setAboutForm({ ...aboutForm, pmExperienceYears: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {canWrite && (
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={savingKey === 'about'}
                    onClick={() => setAboutForm({ ...about })}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Reset to Saved
                  </button>
                  <button
                    type="button"
                    disabled={savingKey === 'about'}
                    onClick={() => {
                      if (!aboutForm.headline.trim() || !aboutForm.bio.trim()) {
                        showToast('Headline and Professional Introduction are required.', 'error');
                        return;
                      }
                      runSave('about', () => updateAbout(aboutForm));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs flex items-center gap-2 disabled:opacity-60"
                  >
                    {savingKey === 'about' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{savingKey === 'about' ? 'Saving...' : 'Update About Content'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: SERVICES MANAGER */}
          {activeTab === 'services' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Core Services Manager ({services.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage your core service offerings, deliverables, and call-to-action links.
                  </p>
                </div>
                {canWrite && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        title: '',
                        shortDescription: '',
                        fullDescription: '',
                        iconName: 'Sparkles',
                        imageUrl: '',
                        deliverables: '',
                        benefits: '',
                        ctaText: 'Discuss This Service',
                        ctaUrl: '#contact',
                        displayOrder: services.length + 1,
                        isPublished: true,
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                )}
              </div>

              {editingService && canWrite && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white">
                      {editingService.id ? 'Edit Core Service' : 'Add New Service'}
                    </h4>
                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingService.isPublished}
                        onChange={(e) =>
                          setEditingService({ ...editingService, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                      />
                      <span>Published</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Service Title *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingService.displayOrder}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            displayOrder: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Short Description *</label>
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
                    <label className="block text-xs text-slate-400 mb-1">Full Description</label>
                    <textarea
                      rows={3}
                      value={editingService.fullDescription}
                      onChange={(e) =>
                        setEditingService({ ...editingService, fullDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Deliverables (one per line)
                      </label>
                      <textarea
                        rows={3}
                        value={editingService.deliverables}
                        onChange={(e) =>
                          setEditingService({ ...editingService, deliverables: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Icon Name &amp; CTA
                      </label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Icon (e.g. Target, Film, BarChart3)"
                          value={editingService.iconName}
                          onChange={(e) =>
                            setEditingService({ ...editingService, iconName: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="CTA Text"
                            value={editingService.ctaText || ''}
                            onChange={(e) =>
                              setEditingService({ ...editingService, ctaText: e.target.value })
                            }
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="CTA URL"
                            value={editingService.ctaUrl || ''}
                            onChange={(e) =>
                              setEditingService({ ...editingService, ctaUrl: e.target.value })
                            }
                            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <MediaUploadField
                    label="Service Feature Image (Optional)"
                    value={editingService.imageUrl || ''}
                    storagePath={editingService.storagePath}
                    folder="services"
                    acceptedCategory="image"
                    onChange={(url, newPath) =>
                      setEditingService({ ...editingService, imageUrl: url, storagePath: newPath })
                    }
                  />

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={savingKey === 'service'}
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'service'}
                      onClick={() => {
                        if (
                          !editingService.title.trim() ||
                          !editingService.shortDescription.trim()
                        ) {
                          showToast('Service Title and Short Description are required.', 'error');
                          return;
                        }
                        runSave(
                          'service',
                          () => saveService(editingService),
                          () => setEditingService(null)
                        );
                      }}
                      className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingKey === 'service' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{savingKey === 'service' ? 'Saving...' : 'Save Service'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {services.map((srv, idx) => (
                  <div
                    key={srv.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400">
                          #{srv.displayOrder}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{srv.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {srv.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={!canWrite}
                        onClick={() =>
                          saveService({ ...srv, isPublished: !srv.isPublished }).catch(() => {})
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          srv.isPublished
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        } disabled:opacity-60`}
                      >
                        {srv.isPublished ? 'Published' : 'Hidden'}
                      </button>
                      {canWrite && (
                        <button
                          type="button"
                          onClick={() => setEditingService(srv)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 font-semibold"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => {
                            if (srv.id && window.confirm(`Delete service "${srv.title}"?`)) {
                              deleteService(srv.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FIVERR GIG MANAGER */}
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
                  {canWrite && (
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
                  )}
                </div>
              </div>

              {editingFiverrGig && canWrite && (
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

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
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
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Display Order
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

                      <MediaUploadField
                        label="Gig Cover Image *"
                        value={editingFiverrGig.imageUrl}
                        storagePath={editingFiverrGig.storagePath}
                        folder="fiverr-gigs"
                        acceptedCategory="image"
                        onChange={(url, newPath) =>
                          setEditingFiverrGig({
                            ...editingFiverrGig,
                            imageUrl: url,
                            storagePath: newPath,
                          })
                        }
                      />

                      <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
                          <input
                            type="checkbox"
                            checked={editingFiverrGig.isActive}
                            onChange={(e) =>
                              setEditingFiverrGig({ ...editingFiverrGig, isActive: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700"
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
                            className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                          />
                          <span>Featured Gig (Prominent Badge)</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Gig Description &amp; Deliverables *
                        </label>
                        <textarea
                          rows={4}
                          value={editingFiverrGig.description}
                          onChange={(e) =>
                            setEditingFiverrGig({ ...editingFiverrGig, description: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white leading-relaxed focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    {showPreviewGig && (
                      <div className="lg:col-span-5 bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Live Card Preview
                          </span>
                          <span className="text-[10px] text-emerald-400">Public Appearance</span>
                        </div>

                        <div
                          className={`rounded-2xl border overflow-hidden bg-white text-slate-900 shadow-lg ${
                            editingFiverrGig.isFeatured
                              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                            <img
                              src={
                                editingFiverrGig.imageUrl ||
                                'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80'
                              }
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
                              {editingFiverrGig.description ||
                                'Gig description will appear here on public display.'}
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
                      disabled={savingKey === 'fiverr_gig'}
                      onClick={() => setEditingFiverrGig(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'fiverr_gig'}
                      onClick={() => {
                        if (!editingFiverrGig.title.trim() || !editingFiverrGig.fiverrUrl.trim()) {
                          showToast('Gig Title and Fiverr URL are required.', 'error');
                          return;
                        }
                        runSave(
                          'fiverr_gig',
                          () => saveFiverrGig(editingFiverrGig),
                          () => setEditingFiverrGig(null)
                        );
                      }}
                      className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs disabled:opacity-60"
                    >
                      {savingKey === 'fiverr_gig' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>{savingKey === 'fiverr_gig' ? 'Saving...' : 'Save Gig to Firebase'}</span>
                    </button>
                  </div>
                </div>
              )}

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
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        {canWrite && (
                          <div className="flex flex-col items-center gap-0.5 shrink-0 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={async () => {
                                if (idx > 0) {
                                  const prev = arr[idx - 1];
                                  try {
                                    await saveFiverrGig({ ...gig, displayOrder: prev.displayOrder });
                                    await saveFiverrGig({ ...prev, displayOrder: gig.displayOrder });
                                  } catch {
                                    // Toast shown
                                  }
                                }
                              }}
                              className="p-1 hover:text-emerald-400 disabled:opacity-20 text-slate-400"
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
                                  try {
                                    await saveFiverrGig({ ...gig, displayOrder: next.displayOrder });
                                    await saveFiverrGig({ ...next, displayOrder: gig.displayOrder });
                                  } catch {
                                    // Toast shown
                                  }
                                }
                              }}
                              className="p-1 hover:text-emerald-400 disabled:opacity-20 text-slate-400"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}

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
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          disabled={!canWrite}
                          onClick={() =>
                            saveFiverrGig({ ...gig, isActive: !gig.isActive }).catch(() => {})
                          }
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            gig.isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-slate-900 text-slate-400 border border-slate-800'
                          } disabled:opacity-60`}
                        >
                          {gig.isActive ? 'Active' : 'Hidden'}
                        </button>

                        {canWrite && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                saveFiverrGig({ ...gig, isFeatured: !gig.isFeatured }).catch(() => {})
                              }
                              className={`p-1.5 rounded-lg border transition-colors ${
                                gig.isFeatured
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/80'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-300'
                              }`}
                            >
                              <Star className={`w-3.5 h-3.5 ${gig.isFeatured ? 'fill-current' : ''}`} />
                            </button>

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
                          </>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => {
                              if (gig.id && window.confirm(`Delete gig "${gig.title}"?`)) {
                                deleteFiverrGig(gig.id).catch(() => {});
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: GUIDE MANAGER */}
          {activeTab === 'guide' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Social Media Starter Guide Modules ({resources.length})
                </h3>
                {canWrite && (
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
                )}
              </div>

              {editingResource && canWrite && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Topic Title *</label>
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
                        Subsection Key (A-N)
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
                    <label className="block text-xs text-slate-400 mb-1">Short Description *</label>
                    <input
                      type="text"
                      value={editingResource.shortDescription}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, shortDescription: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Detailed Content *</label>
                    <textarea
                      rows={5}
                      value={editingResource.detailedContent}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, detailedContent: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Key Takeaways</label>
                    <textarea
                      rows={2}
                      value={editingResource.keyTakeaways}
                      onChange={(e) =>
                        setEditingResource({ ...editingResource, keyTakeaways: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingResource.isPublished}
                        onChange={(e) =>
                          setEditingResource({ ...editingResource, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                      />
                      <span>Published</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={savingKey === 'resource'}
                        onClick={() => setEditingResource(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingKey === 'resource'}
                        onClick={() => {
                          if (!editingResource.title.trim() || !editingResource.detailedContent.trim()) {
                            showToast('Topic Title and Detailed Content are required.', 'error');
                            return;
                          }
                          runSave(
                            'resource',
                            () => saveResource(editingResource),
                            () => setEditingResource(null)
                          );
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {savingKey === 'resource' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>{savingKey === 'resource' ? 'Saving...' : 'Save Topic'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {resources.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase">
                        Module {item.subsectionKey || idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.shortDescription}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canWrite && (
                        <button
                          onClick={() => setEditingResource(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (item.id && window.confirm(`Delete guide module "${item.title}"?`)) {
                              deleteResource(item.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PORTFOLIO MANAGER */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Portfolio Projects ({projects.length})
                </h3>
                {canWrite && (
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
                        externalUrl: '',
                        fiverrUrl: '',
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
                )}
              </div>

              {editingProject && canWrite && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white">
                      {editingProject.id ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
                    </h4>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.isFeatured}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, isFeatured: e.target.checked })
                          }
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500"
                        />
                        <span>Featured</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.isPublished}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, isPublished: e.target.checked })
                          }
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                        />
                        <span>Published</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Project Title *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Client Name *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Category *</label>
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
                    <label className="block text-xs text-slate-400 mb-1">Short Summary *</label>
                    <input
                      type="text"
                      value={editingProject.shortSummary}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, shortSummary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>

                  <MediaUploadField
                    label="Project Cover Thumbnail *"
                    value={editingProject.thumbnail}
                    storagePath={editingProject.storagePath}
                    folder="projects"
                    acceptedCategory="image"
                    onChange={(url, newPath) =>
                      setEditingProject({ ...editingProject, thumbnail: url, storagePath: newPath })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Overview</label>
                      <textarea
                        rows={2}
                        value={editingProject.overview}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, overview: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Challenges</label>
                      <textarea
                        rows={2}
                        value={editingProject.challenges}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, challenges: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Strategy</label>
                      <textarea
                        rows={2}
                        value={editingProject.strategy}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, strategy: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Measurable Results</label>
                      <textarea
                        rows={2}
                        value={editingProject.results}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, results: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Tools / Technologies
                      </label>
                      <input
                        type="text"
                        value={editingProject.technologies}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, technologies: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">External URL</label>
                      <input
                        type="url"
                        value={editingProject.externalUrl || ''}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, externalUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingProject.displayOrder}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            displayOrder: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={savingKey === 'project'}
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'project'}
                      onClick={() => {
                        if (!editingProject.title.trim() || !editingProject.shortSummary.trim()) {
                          showToast('Project Title and Short Summary are required.', 'error');
                          return;
                        }
                        runSave(
                          'project',
                          () => saveProject(editingProject),
                          () => setEditingProject(null)
                        );
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingKey === 'project' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{savingKey === 'project' ? 'Saving...' : 'Save Project'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div className="flex gap-3">
                      {p.thumbnail && (
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="w-16 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 truncate">{p.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{p.shortSummary}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={!canWrite}
                        onClick={() =>
                          saveProject({ ...p, isPublished: !p.isPublished }).catch(() => {})
                        }
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.isPublished
                            ? 'bg-emerald-950 text-emerald-300'
                            : 'bg-slate-900 text-slate-400'
                        } disabled:opacity-60`}
                      >
                        {p.isPublished ? 'Published' : 'Hidden'}
                      </button>
                      <div className="flex gap-2">
                        {canWrite && (
                          <button
                            onClick={() => setEditingProject(p)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              if (p.id && window.confirm(`Delete project "${p.title}"?`)) {
                                deleteProject(p.id).catch(() => {});
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PAID ADS & GLOSSARY MANAGER */}
          {activeTab === 'paid_ads' && <PaidAdsManagerTab />}

          {/* TAB: VIDEO MANAGER */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Video Showcase ({videos.length})</h3>
                {canWrite && (
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
                        duration: '',
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
                )}
              </div>

              {editingVideo && canWrite && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white">
                      {editingVideo.id ? 'Edit Video Showcase' : 'Add Video Showcase'}
                    </h4>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-amber-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingVideo.isFeatured}
                          onChange={(e) =>
                            setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })
                          }
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500"
                        />
                        <span>Featured</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingVideo.isPublished}
                          onChange={(e) =>
                            setEditingVideo({ ...editingVideo, isPublished: e.target.checked })
                          }
                          className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                        />
                        <span>Published</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Video Title *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Category *</label>
                      <input
                        type="text"
                        value={editingVideo.category}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Source Type</label>
                      <select
                        value={editingVideo.videoType}
                        onChange={(e) =>
                          setEditingVideo({
                            ...editingVideo,
                            videoType: e.target.value as VideoItem['videoType'],
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="mp4">MP4 Upload / Direct URL</option>
                      </select>
                    </div>
                  </div>

                  <MediaUploadField
                    label="Video URL or MP4 File Upload *"
                    value={editingVideo.videoUrl}
                    storagePath={editingVideo.videoStoragePath}
                    folder="videos"
                    acceptedCategory="video"
                    placeholder="https://www.youtube.com/watch?v=... or upload MP4"
                    onChange={(url, newStoragePath) =>
                      setEditingVideo({
                        ...editingVideo,
                        videoUrl: url,
                        videoStoragePath: newStoragePath,
                        videoType: newStoragePath ? 'mp4' : editingVideo.videoType,
                      })
                    }
                  />

                  <MediaUploadField
                    label="Video Thumbnail Image *"
                    value={editingVideo.thumbnail}
                    storagePath={editingVideo.storagePath}
                    folder="video-thumbnails"
                    acceptedCategory="image"
                    onChange={(url, newStoragePath) =>
                      setEditingVideo({
                        ...editingVideo,
                        thumbnail: url,
                        storagePath: newStoragePath,
                      })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
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
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Duration (e.g. 0:45)
                      </label>
                      <input
                        type="text"
                        value={editingVideo.duration || ''}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, duration: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={savingKey === 'video'}
                      onClick={() => setEditingVideo(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'video'}
                      onClick={() => {
                        if (!editingVideo.title.trim() || !editingVideo.videoUrl.trim()) {
                          showToast('Video Title and Video URL/File are required.', 'error');
                          return;
                        }
                        runSave(
                          'video',
                          () => saveVideo(editingVideo),
                          () => setEditingVideo(null)
                        );
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingKey === 'video' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{savingKey === 'video' ? 'Saving...' : 'Save Video'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {v.thumbnail && (
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-16 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">
                          {v.category}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5 truncate">{v.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{v.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canWrite && (
                        <button
                          onClick={() => setEditingVideo(v)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (v.id && window.confirm(`Delete video "${v.title}"?`)) {
                              deleteVideo(v.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CASE STUDIES */}
          {activeTab === 'case_studies' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Case Studies &amp; Results ({caseStudies.length})
                </h3>
                {canWrite && (
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
                )}
              </div>

              {editingCaseStudy && canWrite && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="font-bold text-sm text-white">
                      {editingCaseStudy.id ? 'Edit Case Study' : 'Add Case Study'}
                    </h4>
                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingCaseStudy.isPublished}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, isPublished: e.target.checked })
                        }
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                      />
                      <span>Published</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Title *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Client Name *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Industry *</label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Objective</label>
                      <textarea
                        rows={2}
                        value={editingCaseStudy.objective}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, objective: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Challenge</label>
                      <textarea
                        rows={2}
                        value={editingCaseStudy.challenge}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, challenge: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Strategy</label>
                      <textarea
                        rows={2}
                        value={editingCaseStudy.strategy}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, strategy: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Execution</label>
                      <textarea
                        rows={2}
                        value={editingCaseStudy.execution}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, execution: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Platforms</label>
                      <input
                        type="text"
                        value={editingCaseStudy.platforms}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, platforms: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editingCaseStudy.displayOrder}
                        onChange={(e) =>
                          setEditingCaseStudy({
                            ...editingCaseStudy,
                            displayOrder: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Results Summary *
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

                  {/* Metrics editor */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Key Campaign Metrics</span>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingCaseStudy({
                            ...editingCaseStudy,
                            metrics: [...(editingCaseStudy.metrics || []), { label: '', value: '' }],
                          })
                        }
                        className="text-[11px] font-semibold text-emerald-400 hover:underline"
                      >
                        + Add Metric
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(editingCaseStudy.metrics || []).map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Label (e.g. ROAS)"
                            value={m.label}
                            onChange={(e) => {
                              const next = [...editingCaseStudy.metrics];
                              next[mIdx] = { ...next[mIdx], label: e.target.value };
                              setEditingCaseStudy({ ...editingCaseStudy, metrics: next });
                            }}
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 4.2x)"
                            value={m.value}
                            onChange={(e) => {
                              const next = [...editingCaseStudy.metrics];
                              next[mIdx] = { ...next[mIdx], value: e.target.value };
                              setEditingCaseStudy({ ...editingCaseStudy, metrics: next });
                            }}
                            className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCaseStudy({
                                ...editingCaseStudy,
                                metrics: editingCaseStudy.metrics.filter((_, i) => i !== mIdx),
                              })
                            }
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <MediaUploadField
                    label="Case Study Cover Image"
                    value={editingCaseStudy.thumbnail}
                    storagePath={editingCaseStudy.storagePath}
                    folder="case-studies"
                    acceptedCategory="image"
                    onChange={(url, newPath) =>
                      setEditingCaseStudy({
                        ...editingCaseStudy,
                        thumbnail: url,
                        storagePath: newPath,
                      })
                    }
                  />

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={savingKey === 'case_study'}
                      onClick={() => setEditingCaseStudy(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'case_study'}
                      onClick={() => {
                        if (!editingCaseStudy.title.trim() || !editingCaseStudy.clientName.trim()) {
                          showToast('Title and Client Name are required.', 'error');
                          return;
                        }
                        runSave(
                          'case_study',
                          () => saveCaseStudy(editingCaseStudy),
                          () => setEditingCaseStudy(null)
                        );
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingKey === 'case_study' && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      <span>{savingKey === 'case_study' ? 'Saving...' : 'Save Case Study'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {cs.thumbnail && (
                        <img
                          src={cs.thumbnail}
                          alt={cs.title}
                          className="w-14 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase">
                          {cs.industry} &bull; {cs.clientName}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate">{cs.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{cs.resultsSummary}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canWrite && (
                        <button
                          onClick={() => setEditingCaseStudy(cs)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (cs.id && window.confirm(`Delete case study "${cs.title}"?`)) {
                              deleteCaseStudy(cs.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Testimonials ({testimonials.length})
                </h3>
                {canWrite && (
                  <button
                    onClick={() =>
                      setEditingTestimonial({
                        clientName: '',
                        designation: '',
                        company: '',
                        testimonialText: '',
                        rating: 5,
                        avatarUrl: '',
                        displayOrder: testimonials.length + 1,
                        isPublished: true,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                )}
              </div>

              {editingTestimonial && canWrite && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Client Name *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Company *</label>
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
                      <label className="block text-xs text-slate-400 mb-1">Role / Title</label>
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
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editingTestimonial.rating}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            rating: Math.min(5, Math.max(1, parseInt(e.target.value, 10) || 5)),
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Review Quote *</label>
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

                  <MediaUploadField
                    label="Client Avatar Image (Optional)"
                    value={editingTestimonial.avatarUrl || ''}
                    storagePath={editingTestimonial.storagePath}
                    folder="testimonials"
                    acceptedCategory="image"
                    onChange={(url, newPath) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        avatarUrl: url,
                        storagePath: newPath,
                      })
                    }
                  />

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTestimonial.isPublished}
                        onChange={(e) =>
                          setEditingTestimonial({
                            ...editingTestimonial,
                            isPublished: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
                      />
                      <span>Published</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={savingKey === 'testimonial'}
                        onClick={() => setEditingTestimonial(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingKey === 'testimonial'}
                        onClick={() => {
                          if (
                            !editingTestimonial.clientName.trim() ||
                            !editingTestimonial.testimonialText.trim()
                          ) {
                            showToast('Client Name and Review text are required.', 'error');
                            return;
                          }
                          runSave(
                            'testimonial',
                            () => saveTestimonial(editingTestimonial),
                            () => setEditingTestimonial(null)
                          );
                        }}
                        className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                      >
                        {savingKey === 'testimonial' && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                        <span>
                          {savingKey === 'testimonial' ? 'Saving...' : 'Save Testimonial'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white">
                        {t.clientName} &bull;{' '}
                        <span className="text-xs text-slate-400">{t.company}</span>
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        &ldquo;{t.testimonialText}&rdquo;
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {canWrite && (
                        <button
                          onClick={() => setEditingTestimonial(t)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => {
                            if (t.id && window.confirm(`Delete testimonial from "${t.clientName}"?`)) {
                              deleteTestimonial(t.id).catch(() => {});
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CREATIVE PROCESS */}
          {activeTab === 'process' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">
                  Creative Process Stages ({creativeProcess.length})
                </h3>
                {canWrite && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProcess({
                        stepNumber: creativeProcess.length + 1,
                        title: '',
                        shortDesc: '',
                        deliverables: [],
                        iconName: 'Compass',
                      });
                      setProcessDeliverablesText('');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stage</span>
                  </button>
                )}
              </div>

              {editingProcess && canWrite && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Step Number *</label>
                      <input
                        type="number"
                        value={editingProcess.stepNumber}
                        onChange={(e) =>
                          setEditingProcess({
                            ...editingProcess,
                            stepNumber: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Stage Title *</label>
                      <input
                        type="text"
                        value={editingProcess.title}
                        onChange={(e) =>
                          setEditingProcess({ ...editingProcess, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Icon Name</label>
                      <input
                        type="text"
                        value={editingProcess.iconName}
                        onChange={(e) =>
                          setEditingProcess({ ...editingProcess, iconName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Description *</label>
                    <textarea
                      rows={2}
                      value={editingProcess.shortDesc}
                      onChange={(e) =>
                        setEditingProcess({ ...editingProcess, shortDesc: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Deliverables (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={processDeliverablesText}
                      onChange={(e) => setProcessDeliverablesText(e.target.value)}
                      placeholder="Audit Report, Brand Voice Guide, KPI Roadmap"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      disabled={savingKey === 'process'}
                      onClick={() => setEditingProcess(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingKey === 'process'}
                      onClick={() => {
                        if (!editingProcess.title.trim() || !editingProcess.shortDesc.trim()) {
                          showToast('Stage Title and Description are required.', 'error');
                          return;
                        }
                        const deliverables = processDeliverablesText
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        runSave(
                          'process',
                          () => saveProcessStage({ ...editingProcess, deliverables }),
                          () => setEditingProcess(null)
                        );
                      }}
                      className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingKey === 'process' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{savingKey === 'process' ? 'Saving...' : 'Save Stage'}</span>
                    </button>
                  </div>
                </div>
              )}

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
                      <div className="flex items-center gap-2">
                        {canWrite && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProcess(step);
                              setProcessDeliverablesText((step.deliverables || []).join(', '));
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => {
                              if (step.id && window.confirm(`Delete stage "${step.title}"?`)) {
                                deleteProcessStage(step.id).catch(() => {});
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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

          {/* TAB: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base text-white">
                    Central Media Library &amp; Firebase Storage ({mediaList.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Upload images, videos, or PDFs directly to Firebase Storage and copy permanent CDN URLs anywhere.
                  </p>
                </div>

                {canWrite && (
                  <label className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold inline-flex items-center gap-2 cursor-pointer shrink-0">
                    {libraryUploadProgress !== null ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading {libraryUploadProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload File to Storage</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      disabled={libraryUploadProgress !== null}
                      onChange={handleLibraryFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {canWrite && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase">
                    Or Register Existing External Asset URL
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="File Name (e.g. brand-banner.png)"
                      value={newMediaForm.fileName}
                      onChange={(e) =>
                        setNewMediaForm({ ...newMediaForm, fileName: e.target.value })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newMediaForm.fileUrl}
                      onChange={(e) => setNewMediaForm({ ...newMediaForm, fileUrl: e.target.value })}
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                    <button
                      type="button"
                      disabled={savingKey === 'media_add'}
                      onClick={() => {
                        if (!newMediaForm.fileName.trim() || !newMediaForm.fileUrl.trim()) {
                          showToast('Please enter both a File Name and Direct URL.', 'error');
                          return;
                        }
                        if (
                          newMediaForm.fileUrl.startsWith('blob:') ||
                          newMediaForm.fileUrl.startsWith('data:')
                        ) {
                          showToast('Temporary blob/data URLs cannot be stored permanently.', 'error');
                          return;
                        }
                        runSave(
                          'media_add',
                          () => addMediaItem(newMediaForm),
                          () =>
                            setNewMediaForm({
                              fileName: '',
                              fileUrl: '',
                              fileType: 'image/jpeg',
                              fileSize: 180000,
                            })
                        );
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                    >
                      {savingKey === 'media_add' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>Add External URL</span>
                    </button>
                  </div>
                </div>
              )}

              {mediaList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mediaList.map((item) => {
                    const isVideo =
                      item.fileType.startsWith('video/') || /\.(mp4|webm|mov)(\?|$)/i.test(item.fileUrl);
                    const isPdf = item.fileType === 'application/pdf';
                    return (
                      <div
                        key={item.id || item.fileUrl}
                        className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between"
                      >
                        <div className="aspect-video bg-slate-900 relative overflow-hidden flex items-center justify-center">
                          {isVideo ? (
                            <video
                              src={item.fileUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : isPdf ? (
                            <span className="text-xs font-bold text-emerald-400">PDF Document</span>
                          ) : (
                            <img
                              src={item.fileUrl}
                              alt={item.fileName}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="text-xs font-bold text-white truncate">{item.fileName}</div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{Math.max(1, Math.round(item.fileSize / 1024))} KB</span>
                            <span>{item.storagePath ? 'Firebase Storage' : 'External Link'}</span>
                          </div>
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-900">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(item.fileUrl);
                                  showToast('Asset URL copied to clipboard!');
                                } catch {
                                  showToast('Failed to copy URL automatically.', 'info');
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-emerald-400 inline-flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy URL</span>
                            </button>
                            {canDelete && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete "${item.fileName}" permanently from Firebase Storage & Library?`
                                    )
                                  ) {
                                    deleteMediaItem(item).catch(() => {});
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                                title="Delete Asset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No uploaded media assets yet. Click &ldquo;Upload File to Storage&rdquo; above to add permanent images, videos, or PDFs.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: CONTACT ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Contact Inbox ({enquiries.length})</h3>
                  <p className="text-xs text-slate-400">
                    Lead submissions captured permanently in Cloud Firestore.
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
                    <option value="archived">Archived</option>
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
                          disabled={!isRoleAdminOrHigher}
                          onChange={(e) =>
                            enq.id &&
                            updateEnquiryStatus(
                              enq.id,
                              e.target.value as EnquiryItem['status'],
                              enq.notes
                            ).catch(() => {})
                          }
                          className="text-xs font-semibold px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white disabled:opacity-60"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                        {isRoleAdminOrHigher && (
                          <button
                            onClick={() => {
                              if (
                                enq.id &&
                                window.confirm(`Delete enquiry from "${enq.fullName}"?`)
                              ) {
                                deleteEnquiry(enq.id).catch(() => {});
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-400 font-semibold">Service:</span>{' '}
                      {enq.service || 'General'} &bull;{' '}
                      <span className="text-slate-400 font-semibold">Budget:</span>{' '}
                      {enq.budgetRange || 'Unspecified'}
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-900 text-xs text-slate-200">
                      {enq.message}
                    </div>
                  </div>
                ))}

                {filteredEnquiries.length === 0 && (
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                    No matching enquiries found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: NAVIGATION & FOOTER */}
          {activeTab === 'navigation' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Navigation &amp; Footer Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Fiverr Pro URL</label>
                  <input
                    type="text"
                    value={settingsForm.fiverrUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, fiverrUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={settingsForm.linkedinUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={settingsForm.instagramUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={settingsForm.githubUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, githubUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">Copyright Statement</label>
                  <input
                    type="text"
                    value={settingsForm.copyrightText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, copyrightText: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...siteSettings })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  disabled={savingKey === 'nav_settings'}
                  onClick={() =>
                    runSave('nav_settings', () => updateSiteSettings(settingsForm))
                  }
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  {savingKey === 'nav_settings' && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Save Navigation Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SEO SETTINGS */}
          {activeTab === 'seo' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Search Engine Optimization</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Website Title</label>
                  <input
                    type="text"
                    value={settingsForm.websiteTitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, websiteTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, seoTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.seoDescription || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, seoDescription: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...siteSettings })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  disabled={savingKey === 'seo_settings'}
                  onClick={() =>
                    runSave('seo_settings', () => updateSiteSettings(settingsForm))
                  }
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  {savingKey === 'seo_settings' && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Save SEO Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: TEAM MANAGEMENT */}
          {activeTab === 'team' && <TeamManagementTab />}

          {/* TAB: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="max-w-4xl space-y-3">
              <h3 className="font-bold text-sm text-white">
                Security Audit Logs ({auditLogs.length})
              </h3>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-emerald-400">{log.action}</span>
                    <span className="text-slate-500 ml-2">in {log.module}</span>
                    <span className="text-slate-400 block text-[11px] mt-0.5">
                      Actor: {log.adminEmail} &bull; Record: {log.recordId}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px] shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: WEBSITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-4xl bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="font-bold text-sm text-white">Global Website Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Branding Name *</label>
                  <input
                    type="text"
                    value={settingsForm.brandingName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, brandingName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Resume / Portfolio PDF URL</label>
                  <input
                    type="text"
                    value={settingsForm.resumeUrl || ''}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, resumeUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <MediaUploadField
                label="Brand Logo Image (Optional)"
                value={settingsForm.logoUrl || ''}
                folder="branding"
                acceptedCategory="image"
                onChange={(url) => setSettingsForm({ ...settingsForm, logoUrl: url })}
              />

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...siteSettings })}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  disabled={savingKey === 'global_settings'}
                  onClick={() => {
                    if (!settingsForm.brandingName.trim() || !settingsForm.contactEmail.trim()) {
                      showToast('Branding Name and Contact Email are required.', 'error');
                      return;
                    }
                    runSave('global_settings', () => updateSiteSettings(settingsForm));
                  }}
                  className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
                >
                  {savingKey === 'global_settings' && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Save Global Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

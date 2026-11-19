import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  collection,
  doc,
  getDocFromServer,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, testConnection, auth } from '../firebase/config';
import firebaseConfig from '../../firebase-applet-config.json';
import { deleteStorageObject } from '../firebase/storage';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { useAuth } from './AuthContext';
import {
  seedInitialDataIfNeeded,
  initialSiteSettings,
  initialHeroData,
  initialAboutData,
  initialServices,
  initialProjects,
  initialVideos,
  initialCaseStudies,
  initialProcessStages,
  initialGuideSubsections,
  initialTestimonials,
  initialFiverrGigs,
  initialPaidAdCaseStudies,
  initialAdGlossaryTerms,
  seedPaidAdsAndGlossaryIfNeeded,
} from '../firebase/seed';
import {
  normalizeEmail,
  normalizePermissionsForRole,
  isPrimarySuperAdminEmail,
} from '../utils/rbac';
import type {
  SiteSettings,
  HeroData,
  AboutData,
  ServiceItem,
  ProjectItem,
  VideoItem,
  CaseStudyItem,
  CreativeProcessItem,
  ResourceItem,
  TestimonialItem,
  EnquiryItem,
  MediaItem,
  AuditLogItem,
  FiverrGigItem,
  PaidAdCaseStudyItem,
  AdGlossaryTermItem,
  TeamMemberItem,
  TeamPermissions,
  TeamRole,
  TeamStatus,
} from '../types/portfolio';

function sanitizeFirestoreData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val !== undefined) {
        out[key] = sanitizeFirestoreData(val);
      }
    }
    return out as T;
  }
  return value;
}

function formatWriteError(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    if (error.message.includes('permission-denied') || error.message.includes('PERMISSION_DENIED')) {
      return 'Permission denied: Your account does not have permission to perform this action.';
    }
    if (error.message.includes('offline')) {
      return 'Network offline: Unable to save changes to Cloud Firestore right now.';
    }
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error) return String(parsed.error);
    } catch {
      // Not JSON
    }
    return error.message || fallback;
  }
  return fallback;
}

interface PortfolioContextType {
  siteSettings: SiteSettings;
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  fiverrGigs: FiverrGigItem[];
  projects: ProjectItem[];
  paidAds: PaidAdCaseStudyItem[];
  adGlossary: AdGlossaryTermItem[];
  videos: VideoItem[];
  caseStudies: CaseStudyItem[];
  creativeProcess: CreativeProcessItem[];
  resources: ResourceItem[];
  testimonials: TestimonialItem[];
  enquiries: EnquiryItem[];
  mediaList: MediaItem[];
  teamMembers: TeamMemberItem[];
  auditLogs: AuditLogItem[];
  isLoading: boolean;
  isHeroReady: boolean;
  isDataSynced: boolean;
  isDbConnected: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  // Content CRUD actions
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateHero: (data: Partial<HeroData>) => Promise<void>;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;
  saveService: (item: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveFiverrGig: (item: FiverrGigItem) => Promise<void>;
  deleteFiverrGig: (id: string) => Promise<void>;
  saveProject: (item: ProjectItem) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  savePaidAd: (item: PaidAdCaseStudyItem) => Promise<void>;
  deletePaidAd: (id: string) => Promise<void>;
  saveAdGlossaryTerm: (item: AdGlossaryTermItem) => Promise<void>;
  deleteAdGlossaryTerm: (id: string) => Promise<void>;
  saveVideo: (item: VideoItem) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  saveCaseStudy: (item: CaseStudyItem) => Promise<void>;
  deleteCaseStudy: (id: string) => Promise<void>;
  saveProcessStage: (item: CreativeProcessItem) => Promise<void>;
  deleteProcessStage: (id: string) => Promise<void>;
  saveResource: (item: ResourceItem) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  saveTestimonial: (item: TestimonialItem) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  submitEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateEnquiryStatus: (id: string, status: EnquiryItem['status'], notes?: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  addMediaItem: (media: Omit<MediaItem, 'id' | 'createdAt'>) => Promise<void>;
  deleteMediaItem: (item: MediaItem) => Promise<void>;
  refreshSeedData: () => Promise<void>;
  syncPaidAdsDefaults: (force?: boolean) => Promise<void>;
  // Team Management actions
  inviteTeamMember: (params: {
    name: string;
    email: string;
    role: TeamRole;
    permissions?: Partial<TeamPermissions>;
    sendInviteEmail?: boolean;
  }) => Promise<{ inviteLink: string; emailSent: boolean; emailNotice?: string }>;
  updateTeamMember: (
    memberEmail: string,
    updates: { name?: string; role?: TeamRole; permissions?: TeamPermissions; status?: TeamStatus }
  ) => Promise<void>;
  toggleTeamMemberStatus: (member: TeamMemberItem, nextStatus: 'active' | 'inactive') => Promise<void>;
  revokeTeamMemberAccess: (member: TeamMemberItem) => Promise<void>;
  removeTeamMemberRecord: (member: TeamMemberItem) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, isSuperAdmin, sendInviteSignInLink } = useAuth();

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [hero, setHero] = useState<HeroData>(initialHeroData);
  const [about, setAbout] = useState<AboutData>(initialAboutData);
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [fiverrGigs, setFiverrGigs] = useState<FiverrGigItem[]>(initialFiverrGigs);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [paidAds, setPaidAds] = useState<PaidAdCaseStudyItem[]>(initialPaidAdCaseStudies);
  const [adGlossary, setAdGlossary] = useState<AdGlossaryTermItem[]>(initialAdGlossaryTerms);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(initialCaseStudies);
  const [creativeProcess, setCreativeProcess] = useState<CreativeProcessItem[]>(initialProcessStages);
  const [resources, setResources] = useState<ResourceItem[]>(initialGuideSubsections);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHeroReady, setIsHeroReady] = useState<boolean>(false);
  const [isDataSynced, setIsDataSynced] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const systemInitializedRef = useRef<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 5000);
  }, []);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const logAudit = useCallback(async (action: string, moduleName: string, recordId: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) return;
      const logData: AuditLogItem = {
        adminEmail: currentUser.email.toLowerCase(),
        action: action.slice(0, 120),
        module: moduleName.slice(0, 60),
        recordId: recordId.slice(0, 100),
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, 'auditLogs'), logData);
    } catch {
      // Audit log non-blocking
    }
  }, []);

  // Initialize connection & public Firestore real-time listeners
  useEffect(() => {
    let isMounted = true;
    let hasLiveHeroSnapshot = false;

    async function prefetchHeroFast() {
      try {
        const restUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${firebaseConfig.firestoreDatabaseId}/documents/hero/main`;
        const res = await fetch(restUrl, { method: 'GET', cache: 'no-store' });
        if (!res.ok) return;
        const json = (await res.json()) as {
          fields?: Record<string, { stringValue?: string; booleanValue?: boolean }>;
        };
        if (!json.fields || hasLiveHeroSnapshot || !isMounted) return;

        const fields = json.fields;
        const parsedHero: HeroData = {
          ...initialHeroData,
          ...(fields.headline?.stringValue !== undefined ? { headline: fields.headline.stringValue } : {}),
          ...(fields.subtitle?.stringValue !== undefined ? { subtitle: fields.subtitle.stringValue } : {}),
          ...(fields.description?.stringValue !== undefined ? { description: fields.description.stringValue } : {}),
          ...(fields.profileImageUrl?.stringValue !== undefined
            ? { profileImageUrl: fields.profileImageUrl.stringValue }
            : {}),
          ...(fields.storagePath?.stringValue !== undefined ? { storagePath: fields.storagePath.stringValue } : {}),
          ...(fields.ctaTextWork?.stringValue !== undefined ? { ctaTextWork: fields.ctaTextWork.stringValue } : {}),
          ...(fields.ctaUrlWork?.stringValue !== undefined ? { ctaUrlWork: fields.ctaUrlWork.stringValue } : {}),
          ...(fields.ctaTextContact?.stringValue !== undefined
            ? { ctaTextContact: fields.ctaTextContact.stringValue }
            : {}),
          ...(fields.ctaUrlContact?.stringValue !== undefined
            ? { ctaUrlContact: fields.ctaUrlContact.stringValue }
            : {}),
          ...(fields.resumeUrl?.stringValue !== undefined ? { resumeUrl: fields.resumeUrl.stringValue } : {}),
          ...(fields.yearsIt?.stringValue !== undefined ? { yearsIt: fields.yearsIt.stringValue } : {}),
          ...(fields.yearsPm?.stringValue !== undefined ? { yearsPm: fields.yearsPm.stringValue } : {}),
          ...(fields.projectsDelivered?.stringValue !== undefined
            ? { projectsDelivered: fields.projectsDelivered.stringValue }
            : {}),
          ...(fields.teamSizeLed?.stringValue !== undefined ? { teamSizeLed: fields.teamSizeLed.stringValue } : {}),
          ...(fields.isVisible?.booleanValue !== undefined ? { isVisible: fields.isVisible.booleanValue } : {}),
        };

        setHero(parsedHero);
        setIsHeroReady(true);
      } catch {
        // Fallback smoothly to onSnapshot listener
      }
    }

    async function init() {
      try {
        const connected = await testConnection();
        if (isMounted) setIsDbConnected(connected);

        // Check system/init from server so we know whether collections are intentionally empty
        try {
          const sysSnap = await getDocFromServer(doc(db, 'system', 'init'));
          if (sysSnap.exists() && sysSnap.data()?.seededOnce === true) {
            systemInitializedRef.current = true;
          }
        } catch {
          // Ignore if offline or doc doesn't exist yet
        }
      } catch (err) {
        console.warn('Initial setup check:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    prefetchHeroFast();
    init();

    const heroFallbackTimer = window.setTimeout(() => {
      if (isMounted) setIsHeroReady(true);
    }, 1500);

    const unsubSystem = onSnapshot(
      doc(db, 'system', 'init'),
      (snap) => {
        if (snap.exists() && snap.data()?.seededOnce === true) {
          systemInitializedRef.current = true;
        }
      },
      () => {}
    );

    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'global'),
      (snap) => {
        if (snap.exists()) {
          setSiteSettings(snap.data() as SiteSettings);
          if (isMounted) setIsDataSynced(true);
        }
      },
      (error) => console.warn('siteSettings listener error:', error)
    );

    const unsubHero = onSnapshot(
      doc(db, 'hero', 'main'),
      (snap) => {
        hasLiveHeroSnapshot = true;
        window.clearTimeout(heroFallbackTimer);
        if (snap.exists()) {
          setHero(snap.data() as HeroData);
        }
        if (isMounted) {
          setIsHeroReady(true);
          setIsDataSynced(true);
        }
      },
      (error) => {
        hasLiveHeroSnapshot = true;
        window.clearTimeout(heroFallbackTimer);
        if (isMounted) setIsHeroReady(true);
        console.warn('hero listener error:', error);
      }
    );

    const unsubAbout = onSnapshot(
      doc(db, 'about', 'main'),
      (snap) => {
        if (snap.exists()) setAbout(snap.data() as AboutData);
      },
      (error) => console.warn('about listener error:', error)
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: ServiceItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ServiceItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setServices(items);
        }
      },
      (error) => console.warn('services listener error:', error)
    );

    const unsubFiverrGigs = onSnapshot(
      collection(db, 'fiverr_gigs'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: FiverrGigItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as FiverrGigItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setFiverrGigs(items);
        }
      },
      (error) => console.warn('fiverr_gigs listener error:', error)
    );

    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: ProjectItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ProjectItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setProjects(items);
        }
      },
      (error) => console.warn('projects listener error:', error)
    );

    const unsubVideos = onSnapshot(
      collection(db, 'videos'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: VideoItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as VideoItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setVideos(items);
        }
      },
      (error) => console.warn('videos listener error:', error)
    );

    const unsubCaseStudies = onSnapshot(
      collection(db, 'caseStudies'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: CaseStudyItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as CaseStudyItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setCaseStudies(items);
        }
      },
      (error) => console.warn('caseStudies listener error:', error)
    );

    const unsubProcess = onSnapshot(
      collection(db, 'creativeProcess'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: CreativeProcessItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as CreativeProcessItem),
          }));
          items.sort((a, b) => a.stepNumber - b.stepNumber);
          setCreativeProcess(items);
        }
      },
      (error) => console.warn('creativeProcess listener error:', error)
    );

    const unsubResources = onSnapshot(
      collection(db, 'resources'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: ResourceItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ResourceItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setResources(items);
        }
      },
      (error) => console.warn('resources listener error:', error)
    );

    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: TestimonialItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TestimonialItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setTestimonials(items);
        }
      },
      (error) => console.warn('testimonials listener error:', error)
    );

    const unsubPaidAds = onSnapshot(
      collection(db, 'paid_ads'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: PaidAdCaseStudyItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as PaidAdCaseStudyItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setPaidAds(items);
        }
      },
      (error) => console.warn('paid_ads listener error:', error)
    );

    const unsubAdGlossary = onSnapshot(
      collection(db, 'ad_glossary'),
      (snap) => {
        if (!snap.empty || systemInitializedRef.current) {
          const items: AdGlossaryTermItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as AdGlossaryTermItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setAdGlossary(items);
        }
      },
      (error) => console.warn('ad_glossary listener error:', error)
    );

    return () => {
      isMounted = false;
      window.clearTimeout(heroFallbackTimer);
      unsubSystem();
      unsubSettings();
      unsubHero();
      unsubAbout();
      unsubServices();
      unsubFiverrGigs();
      unsubProjects();
      unsubVideos();
      unsubCaseStudies();
      unsubProcess();
      unsubResources();
      unsubTestimonials();
      unsubPaidAds();
      unsubAdGlossary();
    };
  }, []);

  // Listen to Admin-only & RBAC collections ONLY when verified active team member is signed in
  useEffect(() => {
    if (!user || !isAdmin) {
      setEnquiries([]);
      setMediaList([]);
      setAuditLogs([]);
      setTeamMembers([]);
      return;
    }

    // Seed initial data ONLY if system/init does not yet exist
    seedInitialDataIfNeeded(false);

    const qEnquiries = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));
    const unsubEnquiries = onSnapshot(
      qEnquiries,
      (snap) => {
        const items: EnquiryItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as EnquiryItem),
        }));
        setEnquiries(items);
      },
      () => {}
    );

    const qMedia = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubMedia = onSnapshot(
      qMedia,
      (snap) => {
        const items: MediaItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as MediaItem),
        }));
        setMediaList(items);
      },
      () => {}
    );

    const qLogs = query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'));
    const unsubLogs = onSnapshot(
      qLogs,
      (snap) => {
        const items: AuditLogItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as AuditLogItem),
        }));
        setAuditLogs(items);
      },
      () => {}
    );

    let unsubTeam = () => {};
    if (isSuperAdmin) {
      const qTeam = query(collection(db, 'teamMembers'), orderBy('createdAt', 'desc'));
      unsubTeam = onSnapshot(
        qTeam,
        (snap) => {
          const items: TeamMemberItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TeamMemberItem),
          }));
          setTeamMembers(items);
        },
        (err) => {
          console.warn('teamMembers listener error:', err);
        }
      );
    }

    return () => {
      unsubEnquiries();
      unsubMedia();
      unsubLogs();
      unsubTeam();
    };
  }, [user, isAdmin, isSuperAdmin]);

  // Content CRUD Operations — strictly server-confirmed before success toast or state updates
  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    try {
      const merged = sanitizeFirestoreData({ ...siteSettings, ...data });
      await setDoc(doc(db, 'siteSettings', 'global'), merged, { merge: true });
      setSiteSettings(merged);
      await logAudit('Updated Site Settings', 'SiteSettings', 'global');
      showToast('Website settings saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save website settings.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, 'siteSettings/global', auth.currentUser);
    }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    try {
      const merged = sanitizeFirestoreData({ ...hero, ...data });
      await setDoc(doc(db, 'hero', 'main'), merged, { merge: true });
      setHero(merged);
      setIsHeroReady(true);
      await logAudit('Updated Hero Section', 'Hero', 'main');
      showToast('Homepage & Hero section saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save homepage settings.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, 'hero/main', auth.currentUser);
    }
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    try {
      const merged = sanitizeFirestoreData({ ...about, ...data });
      await setDoc(doc(db, 'about', 'main'), merged, { merge: true });
      setAbout(merged);
      await logAudit('Updated About PJ Section', 'About', 'main');
      showToast('About section saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save About section.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, 'about/main', auth.currentUser);
    }
  };

  const saveService = async (item: ServiceItem) => {
    const id = item.id || `service_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'services', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Service' : 'Added Service', 'Services', id);
      showToast('Service saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save service.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `services/${id}`, auth.currentUser);
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      await logAudit('Deleted Service', 'Services', id);
      showToast('Service deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete service.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`, auth.currentUser);
    }
  };

  const saveFiverrGig = async (item: FiverrGigItem) => {
    const id = item.id || `fiverr_gig_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({
        ...item,
        updatedAt: new Date().toISOString(),
        createdAt: item.createdAt || new Date().toISOString(),
      });
      delete toSave.id;
      await setDoc(doc(db, 'fiverr_gigs', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Fiverr Gig' : 'Added Fiverr Gig', 'Fiverr Gigs', id);
      showToast('Fiverr Gig saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save Fiverr Gig.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `fiverr_gigs/${id}`, auth.currentUser);
    }
  };

  const deleteFiverrGig = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fiverr_gigs', id));
      await logAudit('Deleted Fiverr Gig', 'Fiverr Gigs', id);
      showToast('Fiverr Gig deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete Fiverr Gig.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `fiverr_gigs/${id}`, auth.currentUser);
    }
  };

  const saveProject = async (item: ProjectItem) => {
    const id = item.id || `project_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'projects', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Project' : 'Added Project', 'Projects', id);
      showToast('Portfolio project saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save portfolio project.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `projects/${id}`, auth.currentUser);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      await logAudit('Deleted Project', 'Projects', id);
      showToast('Portfolio project deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete project.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`, auth.currentUser);
    }
  };

  const savePaidAd = async (item: PaidAdCaseStudyItem) => {
    const id = item.id || `paid_ad_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'paid_ads', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Paid Ad Case Study' : 'Added Paid Ad Case Study', 'PaidAds', id);
      showToast('Paid Ad case study saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save Paid Ad case study.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `paid_ads/${id}`, auth.currentUser);
    }
  };

  const deletePaidAd = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'paid_ads', id));
      await logAudit('Deleted Paid Ad Case Study', 'PaidAds', id);
      showToast('Paid Ad case study deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete Paid Ad case study.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `paid_ads/${id}`, auth.currentUser);
    }
  };

  const saveAdGlossaryTerm = async (item: AdGlossaryTermItem) => {
    const id = item.id || `ad_glossary_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'ad_glossary', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Ad Glossary Term' : 'Added Ad Glossary Term', 'AdGlossary', id);
      showToast('Advertising glossary term saved permanently!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save glossary term.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `ad_glossary/${id}`, auth.currentUser);
    }
  };

  const deleteAdGlossaryTerm = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ad_glossary', id));
      await logAudit('Deleted Ad Glossary Term', 'AdGlossary', id);
      showToast('Glossary term removed permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete glossary term.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `ad_glossary/${id}`, auth.currentUser);
    }
  };

  const saveVideo = async (item: VideoItem) => {
    const id = item.id || `video_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'videos', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Video' : 'Added Video', 'Videos', id);
      showToast('Video saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save video.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `videos/${id}`, auth.currentUser);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      await logAudit('Deleted Video', 'Videos', id);
      showToast('Video deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete video.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `videos/${id}`, auth.currentUser);
    }
  };

  const saveCaseStudy = async (item: CaseStudyItem) => {
    const id = item.id || `case_study_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'caseStudies', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Case Study' : 'Added Case Study', 'CaseStudies', id);
      showToast('Case study saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save case study.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `caseStudies/${id}`, auth.currentUser);
    }
  };

  const deleteCaseStudy = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'caseStudies', id));
      await logAudit('Deleted Case Study', 'CaseStudies', id);
      showToast('Case study deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete case study.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `caseStudies/${id}`, auth.currentUser);
    }
  };

  const saveProcessStage = async (item: CreativeProcessItem) => {
    const id = item.id || `process_${item.stepNumber || Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'creativeProcess', id), toSave, { merge: true });
      await logAudit('Updated Process Stage', 'CreativeProcess', id);
      showToast('Creative process stage saved permanently!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save creative process stage.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `creativeProcess/${id}`, auth.currentUser);
    }
  };

  const deleteProcessStage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'creativeProcess', id));
      await logAudit('Deleted Process Stage', 'CreativeProcess', id);
      showToast('Process stage deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete process stage.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `creativeProcess/${id}`, auth.currentUser);
    }
  };

  const saveResource = async (item: ResourceItem) => {
    const id = item.id || `guide_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'resources', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Guide Topic' : 'Added Guide Topic', 'Resources', id);
      showToast('Guide topic saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save guide topic.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `resources/${id}`, auth.currentUser);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
      await logAudit('Deleted Guide Topic', 'Resources', id);
      showToast('Guide topic deleted permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete guide topic.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `resources/${id}`, auth.currentUser);
    }
  };

  const saveTestimonial = async (item: TestimonialItem) => {
    const id = item.id || `testimonial_${Date.now()}`;
    try {
      const toSave = sanitizeFirestoreData({ ...item });
      delete toSave.id;
      await setDoc(doc(db, 'testimonials', id), toSave, { merge: true });
      await logAudit(item.id ? 'Edited Testimonial' : 'Added Testimonial', 'Testimonials', id);
      showToast('Testimonial saved permanently to Firebase!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save testimonial.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `testimonials/${id}`, auth.currentUser);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      await logAudit('Deleted Testimonial', 'Testimonials', id);
      showToast('Testimonial removed permanently', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete testimonial.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`, auth.currentUser);
    }
  };

  const submitEnquiry = async (enquiry: Omit<EnquiryItem, 'id' | 'status' | 'createdAt'>) => {
    try {
      const newEnquiry: Omit<EnquiryItem, 'id'> = sanitizeFirestoreData({
        ...enquiry,
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      await addDoc(collection(db, 'enquiries'), newEnquiry);
      showToast('Thank you! Your message has been sent. PJ will reply shortly.', 'success');
    } catch (error) {
      showToast('Unable to submit enquiry. Please verify fields and try again.', 'error');
      handleFirestoreError(error, OperationType.CREATE, 'enquiries', auth.currentUser);
    }
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryItem['status'], notes?: string) => {
    try {
      const data: Partial<EnquiryItem> = { status };
      if (notes !== undefined) data.notes = notes;
      await updateDoc(doc(db, 'enquiries', id), data);
      await logAudit(`Updated Enquiry Status to ${status}`, 'Enquiries', id);
      showToast(`Enquiry updated to ${status}`);
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to update enquiry.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`, auth.currentUser);
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      await logAudit('Deleted Enquiry', 'Enquiries', id);
      showToast('Enquiry removed', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete enquiry.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`, auth.currentUser);
    }
  };

  const addMediaItem = async (media: Omit<MediaItem, 'id' | 'createdAt'>) => {
    try {
      const newMedia: Omit<MediaItem, 'id'> = sanitizeFirestoreData({
        ...media,
        uploadedBy: media.uploadedBy || auth.currentUser?.email || 'admin',
        createdAt: new Date().toISOString(),
      });
      const docRef = await addDoc(collection(db, 'media'), newMedia);
      await logAudit('Uploaded Media', 'Media', docRef.id);
      showToast('Media saved permanently to Firebase Storage & Library!');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to save media record.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.CREATE, 'media', auth.currentUser);
    }
  };

  const deleteMediaItem = async (item: MediaItem) => {
    if (!item.id) return;
    try {
      await deleteDoc(doc(db, 'media', item.id));
      if (item.storagePath) {
        await deleteStorageObject(item.storagePath);
      }
      await logAudit('Deleted Media', 'Media', item.id);
      showToast('Media item removed from Library', 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to delete media item.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `media/${item.id}`, auth.currentUser);
    }
  };

  const refreshSeedData = async () => {
    setIsLoading(true);
    const result = await seedInitialDataIfNeeded(true);
    setIsLoading(false);
    if (result.seeded) {
      systemInitializedRef.current = true;
      showToast('Synchronized complete PJ portfolio data with Firestore!');
    } else {
      showToast(`Sync notice: ${result.message}`, 'error');
    }
  };

  const syncPaidAdsDefaults = async (force = true) => {
    setIsLoading(true);
    const result = await seedPaidAdsAndGlossaryIfNeeded(force);
    setIsLoading(false);
    if (result.seeded) {
      showToast('Paid Ads Case Studies & Glossary synchronized with Firestore!');
    } else {
      showToast(`Sync notice: ${result.message}`, 'error');
    }
  };

  // Team Management CRUD Actions
  const inviteTeamMember = async (params: {
    name: string;
    email: string;
    role: TeamRole;
    permissions?: Partial<TeamPermissions>;
    sendInviteEmail?: boolean;
  }): Promise<{ inviteLink: string; emailSent: boolean; emailNotice?: string }> => {
    const cleanEmail = normalizeEmail(params.email);
    const cleanName = params.name.trim();
    if (!cleanName) throw new Error('Team member name is required.');
    if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(cleanEmail)) {
      throw new Error('Please enter a valid email address.');
    }

    const nowIso = new Date().toISOString();
    const resolvedPermissions = normalizePermissionsForRole(params.role, params.permissions);
    const existingMember = teamMembers.find((m) => normalizeEmail(m.email) === cleanEmail);

    if (existingMember && existingMember.status === 'active') {
      throw new Error(`"${cleanEmail}" is already an active team member.`);
    }

    const memberPayload: TeamMemberItem = sanitizeFirestoreData({
      name: cleanName,
      email: cleanEmail,
      role: params.role,
      status: 'pending',
      permissions: resolvedPermissions,
      invitedBy: auth.currentUser?.email?.toLowerCase() || 'prakashinfosys1234@gmail.com',
      inviteMethod: params.sendInviteEmail ? 'email_link' : 'google_or_email',
      createdAt: existingMember?.createdAt || nowIso,
      updatedAt: nowIso,
    });

    try {
      await setDoc(doc(db, 'teamMembers', cleanEmail), memberPayload);
      await logAudit(`Invited Team Member (${params.role})`, 'TeamManagement', cleanEmail);

      let emailSent = false;
      let emailNotice: string | undefined;
      if (params.sendInviteEmail) {
        const res = await sendInviteSignInLink(cleanEmail);
        emailSent = res.sent;
        emailNotice = res.message;
      }

      const inviteLink = `${window.location.origin}/?invite=${encodeURIComponent(cleanEmail)}#pj-control`;
      showToast(`Invitation created for ${cleanName} (${cleanEmail}).`);
      return { inviteLink, emailSent, emailNotice };
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to invite team member.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `teamMembers/${cleanEmail}`, auth.currentUser);
    }
  };

  const updateTeamMember = async (
    memberEmail: string,
    updates: { name?: string; role?: TeamRole; permissions?: TeamPermissions; status?: TeamStatus }
  ) => {
    const cleanEmail = normalizeEmail(memberEmail);
    const existing = teamMembers.find((m) => normalizeEmail(m.email) === cleanEmail);
    if (!existing) throw new Error('Team member record not found.');

    if (isPrimarySuperAdminEmail(cleanEmail)) {
      if ((updates.role && updates.role !== 'super_admin') || (updates.status && updates.status !== 'active')) {
        throw new Error('The primary Super Admin account cannot be downgraded or deactivated.');
      }
    }

    const nextRole = updates.role || existing.role;
    const nextPermissions = normalizePermissionsForRole(
      nextRole,
      updates.permissions || existing.permissions
    );

    const payload: TeamMemberItem = sanitizeFirestoreData({
      ...existing,
      name: updates.name !== undefined ? updates.name.trim() : existing.name,
      role: nextRole,
      status: updates.status || existing.status,
      permissions: nextPermissions,
      updatedAt: new Date().toISOString(),
    });
    delete payload.id;

    try {
      await setDoc(doc(db, 'teamMembers', cleanEmail), payload, { merge: true });
      await logAudit(`Updated Role/Permissions (${nextRole})`, 'TeamManagement', cleanEmail);
      showToast(`Permissions updated for ${payload.name}.`);
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to update team member.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `teamMembers/${cleanEmail}`, auth.currentUser);
    }
  };

  const toggleTeamMemberStatus = async (
    member: TeamMemberItem,
    nextStatus: 'active' | 'inactive'
  ) => {
    const cleanEmail = normalizeEmail(member.email);
    if (isPrimarySuperAdminEmail(cleanEmail)) {
      throw new Error('The primary Super Admin account cannot be deactivated.');
    }
    const payload: TeamMemberItem = sanitizeFirestoreData({
      ...member,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    });
    delete payload.id;

    try {
      await setDoc(doc(db, 'teamMembers', cleanEmail), payload, { merge: true });
      await logAudit(
        nextStatus === 'active' ? 'Activated Team Member' : 'Deactivated Team Member',
        'TeamManagement',
        cleanEmail
      );
      showToast(
        nextStatus === 'active'
          ? `${member.name} has been reactivated.`
          : `${member.name} has been deactivated.`
      );
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to update team member status.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `teamMembers/${cleanEmail}`, auth.currentUser);
    }
  };

  const revokeTeamMemberAccess = async (member: TeamMemberItem) => {
    const cleanEmail = normalizeEmail(member.email);
    if (isPrimarySuperAdminEmail(cleanEmail)) {
      throw new Error('The primary Super Admin account cannot be revoked.');
    }
    const nowIso = new Date().toISOString();
    const payload: TeamMemberItem = sanitizeFirestoreData({
      ...member,
      status: 'revoked',
      revokedAt: nowIso,
      revokedBy: auth.currentUser?.email?.toLowerCase() || 'super_admin',
      updatedAt: nowIso,
    });
    delete payload.id;

    try {
      await setDoc(doc(db, 'teamMembers', cleanEmail), payload, { merge: true });
      await logAudit('Revoked Team Access', 'TeamManagement', cleanEmail);
      showToast(`Access immediately revoked for ${member.name}. Historical content preserved.`, 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to revoke team member access.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.WRITE, `teamMembers/${cleanEmail}`, auth.currentUser);
    }
  };

  const removeTeamMemberRecord = async (member: TeamMemberItem) => {
    const cleanEmail = normalizeEmail(member.email);
    if (isPrimarySuperAdminEmail(cleanEmail)) {
      throw new Error('The primary Super Admin record cannot be removed.');
    }
    try {
      await deleteDoc(doc(db, 'teamMembers', cleanEmail));
      await logAudit('Removed Team Member Record', 'TeamManagement', cleanEmail);
      showToast(`Team record removed for ${member.email}. All content & audit records remain intact.`, 'info');
    } catch (error) {
      const msg = formatWriteError(error, 'Failed to remove team member record.');
      showToast(msg, 'error');
      handleFirestoreError(error, OperationType.DELETE, `teamMembers/${cleanEmail}`, auth.currentUser);
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        siteSettings,
        hero,
        about,
        services,
        fiverrGigs,
        projects,
        paidAds,
        adGlossary,
        videos,
        caseStudies,
        creativeProcess,
        resources,
        testimonials,
        enquiries,
        mediaList,
        teamMembers,
        auditLogs,
        isLoading,
        isHeroReady,
        isDataSynced,
        isDbConnected,
        toastMessage,
        showToast,
        clearToast,
        updateSiteSettings,
        updateHero,
        updateAbout,
        saveService,
        deleteService,
        saveFiverrGig,
        deleteFiverrGig,
        saveProject,
        deleteProject,
        savePaidAd,
        deletePaidAd,
        saveAdGlossaryTerm,
        deleteAdGlossaryTerm,
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
        submitEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        addMediaItem,
        deleteMediaItem,
        refreshSeedData,
        syncPaidAdsDefaults,
        inviteTeamMember,
        updateTeamMember,
        toggleTeamMemberStatus,
        revokeTeamMemberAccess,
        removeTeamMemberRecord,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

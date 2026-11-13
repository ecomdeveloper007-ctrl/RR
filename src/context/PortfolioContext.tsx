import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, testConnection, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
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
} from '../types/portfolio';

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
  auditLogs: AuditLogItem[];
  isLoading: boolean;
  isHeroReady: boolean;
  isDbConnected: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
  // CRUD actions
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
  deleteMediaItem: (id: string) => Promise<void>;
  refreshSeedData: () => Promise<void>;
  syncPaidAdsDefaults: (force?: boolean) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const HERO_CACHE_KEY = 'pj_cached_hero_v1';

function getCachedHero(): HeroData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(HERO_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HeroData;
  } catch {
    return null;
  }
}

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cachedHero] = useState<HeroData | null>(() => getCachedHero());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [hero, setHero] = useState<HeroData>(() => cachedHero || initialHeroData);
  const [isHeroReady, setIsHeroReady] = useState<boolean>(() => Boolean(cachedHero));
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
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const clearToast = useCallback(() => setToastMessage(null), []);

  const logAudit = useCallback(async (action: string, moduleName: string, recordId: string) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      const logData: AuditLogItem = {
        adminEmail: currentUser.email || 'Admin',
        action,
        module: moduleName,
        recordId,
        timestamp: new Date().toISOString(),
      };
      await addDoc(collection(db, 'auditLogs'), logData);
    } catch {
      // Audit log non-blocking
    }
  }, []);

  // Initialize and test connection
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        const connected = await testConnection();
        if (isMounted) setIsDbConnected(connected);
      } catch (err) {
        console.warn('Initial setup check:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    init();

    // Setup snapshot listeners for public data
    const unsubSettings = onSnapshot(
      doc(db, 'siteSettings', 'global'),
      (snap) => {
        if (snap.exists()) setSiteSettings(snap.data() as SiteSettings);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'siteSettings/global', auth.currentUser)
    );

    const heroFallbackTimer = window.setTimeout(() => {
      if (isMounted) setIsHeroReady(true);
    }, 3000);

    const unsubHero = onSnapshot(
      doc(db, 'hero', 'main'),
      (snap) => {
        window.clearTimeout(heroFallbackTimer);
        if (snap.exists()) {
          const nextHero = snap.data() as HeroData;
          setHero(nextHero);
          try {
            window.localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(nextHero));
          } catch {
            // Ignore storage quota errors
          }
        }
        if (isMounted) setIsHeroReady(true);
      },
      (error) => {
        window.clearTimeout(heroFallbackTimer);
        if (isMounted) setIsHeroReady(true);
        handleFirestoreError(error, OperationType.GET, 'hero/main', auth.currentUser);
      }
    );

    const unsubAbout = onSnapshot(
      doc(db, 'about', 'main'),
      (snap) => {
        if (snap.exists()) setAbout(snap.data() as AboutData);
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'about/main', auth.currentUser)
    );

    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty) {
          const items: ServiceItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ServiceItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setServices(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'services', auth.currentUser)
    );

    const unsubFiverrGigs = onSnapshot(
      collection(db, 'fiverr_gigs'),
      (snap) => {
        if (!snap.empty) {
          const items: FiverrGigItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as FiverrGigItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setFiverrGigs(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'fiverr_gigs', auth.currentUser)
    );

    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          const items: ProjectItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ProjectItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setProjects(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'projects', auth.currentUser)
    );

    const unsubVideos = onSnapshot(
      collection(db, 'videos'),
      (snap) => {
        if (!snap.empty) {
          const items: VideoItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as VideoItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setVideos(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'videos', auth.currentUser)
    );

    const unsubCaseStudies = onSnapshot(
      collection(db, 'caseStudies'),
      (snap) => {
        if (!snap.empty) {
          const items: CaseStudyItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as CaseStudyItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setCaseStudies(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'caseStudies', auth.currentUser)
    );

    const unsubProcess = onSnapshot(
      collection(db, 'creativeProcess'),
      (snap) => {
        if (!snap.empty) {
          const items: CreativeProcessItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as CreativeProcessItem),
          }));
          items.sort((a, b) => a.stepNumber - b.stepNumber);
          setCreativeProcess(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'creativeProcess', auth.currentUser)
    );

    const unsubResources = onSnapshot(
      collection(db, 'resources'),
      (snap) => {
        if (!snap.empty) {
          const items: ResourceItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as ResourceItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setResources(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'resources', auth.currentUser)
    );

    const unsubTestimonials = onSnapshot(
      collection(db, 'testimonials'),
      (snap) => {
        if (!snap.empty) {
          const items: TestimonialItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as TestimonialItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setTestimonials(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'testimonials', auth.currentUser)
    );

    const unsubPaidAds = onSnapshot(
      collection(db, 'paid_ads'),
      (snap) => {
        if (!snap.empty) {
          const items: PaidAdCaseStudyItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as PaidAdCaseStudyItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setPaidAds(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'paid_ads', auth.currentUser)
    );

    const unsubAdGlossary = onSnapshot(
      collection(db, 'ad_glossary'),
      (snap) => {
        if (!snap.empty) {
          const items: AdGlossaryTermItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as AdGlossaryTermItem),
          }));
          items.sort((a, b) => a.displayOrder - b.displayOrder);
          setAdGlossary(items);
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'ad_glossary', auth.currentUser)
    );

    return () => {
      isMounted = false;
      window.clearTimeout(heroFallbackTimer);
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

  // Listen to Admin-only collections when admin is logged in
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        setEnquiries([]);
        setMediaList([]);
        setAuditLogs([]);
        return;
      }

      // Auto seed defaults if empty when admin logs in
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

      return () => {
        unsubEnquiries();
        unsubMedia();
        unsubLogs();
      };
    });

    return () => unsubAuth();
  }, []);

  // CRUD Operations
  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    try {
      const merged = { ...siteSettings, ...data };
      await setDoc(doc(db, 'siteSettings', 'global'), merged, { merge: true });
      setSiteSettings(merged);
      await logAudit('Updated Site Settings', 'SiteSettings', 'global');
      showToast('Website settings saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteSettings/global', auth.currentUser);
    }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    try {
      const merged = { ...hero, ...data };
      await setDoc(doc(db, 'hero', 'main'), merged, { merge: true });
      setHero(merged);
      setIsHeroReady(true);
      try {
        window.localStorage.setItem(HERO_CACHE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore storage quota errors
      }
      await logAudit('Updated Hero Section', 'Hero', 'main');
      showToast('Hero section updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'hero/main', auth.currentUser);
    }
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    try {
      const merged = { ...about, ...data };
      await setDoc(doc(db, 'about', 'main'), merged, { merge: true });
      setAbout(merged);
      await logAudit('Updated About PJ Section', 'About', 'main');
      showToast('About section updated successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'about/main', auth.currentUser);
    }
  };

  const saveService = async (item: ServiceItem) => {
    try {
      const id = item.id || `service_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'services', id), toSave);
      await logAudit(item.id ? 'Edited Service' : 'Added Service', 'Services', id);
      showToast('Service saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `services/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      await logAudit('Deleted Service', 'Services', id);
      showToast('Service deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `services/${id}`, auth.currentUser);
    }
  };

  const saveFiverrGig = async (item: FiverrGigItem) => {
    try {
      const id = item.id || `fiverr_gig_${Date.now()}`;
      const toSave = {
        ...item,
        updatedAt: new Date().toISOString(),
        createdAt: item.createdAt || new Date().toISOString(),
      };
      delete toSave.id;
      await setDoc(doc(db, 'fiverr_gigs', id), toSave);
      await logAudit(item.id ? 'Edited Fiverr Gig' : 'Added Fiverr Gig', 'Fiverr Gigs', id);
      showToast('Fiverr Gig saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `fiverr_gigs/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteFiverrGig = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'fiverr_gigs', id));
      await logAudit('Deleted Fiverr Gig', 'Fiverr Gigs', id);
      showToast('Fiverr Gig deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `fiverr_gigs/${id}`, auth.currentUser);
    }
  };

  const saveProject = async (item: ProjectItem) => {
    try {
      const id = item.id || `project_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'projects', id), toSave);
      await logAudit(item.id ? 'Edited Project' : 'Added Project', 'Projects', id);
      showToast('Portfolio item saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `projects/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      await logAudit('Deleted Project', 'Projects', id);
      showToast('Project deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`, auth.currentUser);
    }
  };

  const savePaidAd = async (item: PaidAdCaseStudyItem) => {
    try {
      const id = item.id || `paid_ad_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'paid_ads', id), toSave);
      await logAudit(item.id ? 'Edited Paid Ad Case Study' : 'Added Paid Ad Case Study', 'PaidAds', id);
      showToast('Paid Ad case study saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `paid_ads/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deletePaidAd = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'paid_ads', id));
      await logAudit('Deleted Paid Ad Case Study', 'PaidAds', id);
      showToast('Paid Ad case study deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `paid_ads/${id}`, auth.currentUser);
    }
  };

  const saveAdGlossaryTerm = async (item: AdGlossaryTermItem) => {
    try {
      const id = item.id || `ad_glossary_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'ad_glossary', id), toSave);
      await logAudit(item.id ? 'Edited Ad Glossary Term' : 'Added Ad Glossary Term', 'AdGlossary', id);
      showToast('Advertising glossary term saved!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `ad_glossary/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteAdGlossaryTerm = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ad_glossary', id));
      await logAudit('Deleted Ad Glossary Term', 'AdGlossary', id);
      showToast('Glossary term removed', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `ad_glossary/${id}`, auth.currentUser);
    }
  };

  const saveVideo = async (item: VideoItem) => {
    try {
      const id = item.id || `video_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'videos', id), toSave);
      await logAudit(item.id ? 'Edited Video' : 'Added Video', 'Videos', id);
      showToast('Video item saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `videos/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'videos', id));
      await logAudit('Deleted Video', 'Videos', id);
      showToast('Video removed', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `videos/${id}`, auth.currentUser);
    }
  };

  const saveCaseStudy = async (item: CaseStudyItem) => {
    try {
      const id = item.id || `case_study_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'caseStudies', id), toSave);
      await logAudit(item.id ? 'Edited Case Study' : 'Added Case Study', 'CaseStudies', id);
      showToast('Case study saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `caseStudies/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteCaseStudy = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'caseStudies', id));
      await logAudit('Deleted Case Study', 'CaseStudies', id);
      showToast('Case study deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `caseStudies/${id}`, auth.currentUser);
    }
  };

  const saveProcessStage = async (item: CreativeProcessItem) => {
    try {
      const id = item.id || `process_${item.stepNumber || Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'creativeProcess', id), toSave);
      await logAudit('Updated Process Stage', 'CreativeProcess', id);
      showToast('Process stage saved!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `creativeProcess/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteProcessStage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'creativeProcess', id));
      await logAudit('Deleted Process Stage', 'CreativeProcess', id);
      showToast('Process stage deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `creativeProcess/${id}`, auth.currentUser);
    }
  };

  const saveResource = async (item: ResourceItem) => {
    try {
      const id = item.id || `guide_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'resources', id), toSave);
      await logAudit(item.id ? 'Edited Guide Topic' : 'Added Guide Topic', 'Resources', id);
      showToast('Guide topic saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `resources/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
      await logAudit('Deleted Guide Topic', 'Resources', id);
      showToast('Guide topic deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `resources/${id}`, auth.currentUser);
    }
  };

  const saveTestimonial = async (item: TestimonialItem) => {
    try {
      const id = item.id || `testimonial_${Date.now()}`;
      const toSave = { ...item };
      delete toSave.id;
      await setDoc(doc(db, 'testimonials', id), toSave);
      await logAudit(item.id ? 'Edited Testimonial' : 'Added Testimonial', 'Testimonials', id);
      showToast('Testimonial saved successfully!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `testimonials/${item.id || 'new'}`, auth.currentUser);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      await logAudit('Deleted Testimonial', 'Testimonials', id);
      showToast('Testimonial removed', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`, auth.currentUser);
    }
  };

  const submitEnquiry = async (enquiry: Omit<EnquiryItem, 'id' | 'status' | 'createdAt'>) => {
    try {
      const newEnquiry: Omit<EnquiryItem, 'id'> = {
        ...enquiry,
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'enquiries'), newEnquiry);
      showToast('Thank you! Your message has been sent. PJ will reply shortly.', 'success');
    } catch (error) {
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
      handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`, auth.currentUser);
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'enquiries', id));
      await logAudit('Deleted Enquiry', 'Enquiries', id);
      showToast('Enquiry removed', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`, auth.currentUser);
    }
  };

  const addMediaItem = async (media: Omit<MediaItem, 'id' | 'createdAt'>) => {
    try {
      const newMedia: Omit<MediaItem, 'id'> = {
        ...media,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'media'), newMedia);
      await logAudit('Uploaded Media', 'Media', docRef.id);
      showToast('Media registered in library!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'media', auth.currentUser);
    }
  };

  const deleteMediaItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'media', id));
      await logAudit('Deleted Media', 'Media', id);
      showToast('Media item deleted', 'info');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `media/${id}`, auth.currentUser);
    }
  };

  const refreshSeedData = async () => {
    setIsLoading(true);
    const result = await seedInitialDataIfNeeded(true);
    setIsLoading(false);
    if (result.seeded) {
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
        auditLogs,
        isLoading,
        isHeroReady,
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

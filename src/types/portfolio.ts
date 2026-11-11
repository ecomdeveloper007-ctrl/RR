export interface SiteSettings {
  websiteTitle: string;
  brandingName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  copyrightText: string;
  seoTitle?: string;
  seoDescription?: string;
  fiverrUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
}

export interface HeroData {
  headline: string;
  subtitle: string;
  description: string;
  profileImageUrl?: string;
  ctaTextWork: string;
  ctaUrlWork: string;
  ctaTextContact: string;
  ctaUrlContact: string;
  resumeUrl?: string;
  yearsIt: string;
  yearsPm: string;
  projectsDelivered: string;
  teamSizeLed: string;
  isVisible: boolean;
}

export interface AboutData {
  headline: string;
  bio: string;
  leadershipSummary?: string;
  clientCoordination?: string;
  creativePhilosophy?: string;
  strategicApproach?: string;
  itExperienceYears: string;
  pmExperienceYears: string;
  isVisible: boolean;
}

export interface ExpertiseItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface ServiceItem {
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  imageUrl?: string;
  deliverables: string; // newline-separated list
  benefits?: string; // newline-separated list
  ctaText?: string;
  ctaUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface ProjectItem {
  id?: string;
  title: string;
  clientName: string;
  category: string;
  shortSummary: string;
  overview: string;
  challenges: string;
  strategy: string;
  results: string;
  technologies: string;
  thumbnail: string;
  galleryImages?: string; // comma-separated URLs
  externalUrl?: string;
  fiverrUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface VideoItem {
  id?: string;
  title: string;
  category: string;
  description: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'mp4';
  thumbnail: string;
  duration?: string;
  isFeatured: boolean;
  displayOrder: number;
  isPublished: boolean;
}

export interface CaseStudyItem {
  id?: string;
  title: string;
  clientName: string;
  industry: string;
  objective: string;
  challenge: string;
  strategy: string;
  execution: string;
  platforms: string;
  resultsSummary: string;
  metrics: { label: string; value: string }[];
  thumbnail: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface CreativeProcessItem {
  id?: string;
  stepNumber: number;
  title: string;
  shortDesc: string;
  deliverables: string[];
  iconName: string;
}

export interface ResourceItem {
  id?: string;
  title: string;
  category: string;
  subsectionKey?: string; // A through N
  shortDescription: string;
  detailedContent: string;
  keyTakeaways: string;
  checklistItems?: string[];
  pdfUrl?: string;
  illustrationUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface TestimonialItem {
  id?: string;
  clientName: string;
  designation: string;
  company: string;
  testimonialText: string;
  rating: number;
  avatarUrl?: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface EnquiryItem {
  id?: string;
  fullName: string;
  email: string;
  businessName?: string;
  phone?: string;
  service?: string;
  budgetRange?: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'completed' | 'archived';
  notes?: string;
  createdAt: string;
}

export interface MediaItem {
  id?: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy?: string;
  createdAt: string;
}

export interface AdminUserItem {
  id?: string;
  email: string;
  role: 'super_admin' | 'content_editor';
  createdAt: string;
}

export interface AuditLogItem {
  id?: string;
  adminEmail: string;
  action: string;
  module: string;
  recordId: string;
  timestamp: string;
}

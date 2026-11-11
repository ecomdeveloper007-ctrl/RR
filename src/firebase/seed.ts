import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from './config';
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
} from '../types/portfolio';

export const initialSiteSettings: SiteSettings = {
  websiteTitle: 'PJ | Premium Social Media Marketing & Digital Growth Portfolio',
  brandingName: 'PJ',
  logoUrl: '',
  contactEmail: 'prakashinfosys1234@gmail.com',
  contactPhone: '+1 (555) 019-2834',
  copyrightText: '© 2026 PJ. All Rights Reserved.',
  seoTitle: 'PJ - Social Media Marketing, Strategic Growth & Digital Solutions',
  seoDescription:
    'Creative storytelling. Strategic marketing. Measurable digital growth. Discover high-converting social campaigns, Shopify engineering, and SEO authority by PJ.',
  fiverrUrl: 'https://www.fiverr.com/pjangid',
  linkedinUrl: 'https://www.linkedin.com',
  instagramUrl: 'https://www.instagram.com',
  githubUrl: 'https://github.com',
  resumeUrl: '#contact',
};

export const initialHeroData: HeroData = {
  headline: 'Making Brands Impossible to Ignore.',
  subtitle: 'SOCIAL MEDIA MARKETING & DIGITAL GROWTH',
  description:
    'I help businesses build a stronger digital presence through creative social media content, strategic marketing, audience engagement, SEO, and conversion-focused digital solutions.',
  profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  ctaTextWork: 'Explore My Work',
  ctaUrlWork: '#portfolio',
  ctaTextContact: "Let's Discuss Your Project",
  ctaUrlContact: '#contact',
  resumeUrl: '#contact',
  yearsIt: '10+',
  yearsPm: '5+',
  projectsDelivered: '120+',
  teamSizeLed: '25+',
  isVisible: true,
};

export const initialAboutData: AboutData = {
  headline: 'Creative Storytelling. Strategic Marketing. Measurable Digital Growth.',
  bio: `I combine creative storytelling with strategic digital marketing to help businesses build meaningful online connections, strengthen their brand presence, and achieve sustainable growth.

With over 10 years of cross-functional digital engineering and 5+ years leading high-performance project execution, I bridge the divide between captivating aesthetic presentation and revenue-generating performance metrics.

Whether building viral social campaigns, conversion-tuned Shopify storefronts, or authoritative SEO footprints, my methodology treats every digital touchpoint as part of an integrated, scalable flywheel.`,
  creativePhilosophy:
    'Attention is earned through clarity, empathy, and undeniable relevance. We replace generic noise with content that hooks, informs, and builds genuine human affinity.',
  strategicApproach:
    'Data guides our creative iterations. By continuously tracking engagement velocity, CPA, and retention, we ensure every asset directly advances bottom-line business objectives.',
  leadershipSummary:
    'Proven track record leading multidisciplinary teams of up to 25 creators, engineers, and growth strategists with 99% on-time milestone delivery.',
  clientCoordination:
    'Trusted partner to founders, e-commerce brands, and global enterprises, translating ambitious visions into structured, high-ROI deliverables.',
  itExperienceYears: '10+',
  pmExperienceYears: '5+',
  isVisible: true,
};

export const initialServices: ServiceItem[] = [
  {
    title: 'Social Media Content Creation & Management',
    shortDescription: 'Engaging social media posts, high-retention carousels, and viral reels backed by consistent scheduling.',
    fullDescription:
      'End-to-end social media governance designed to establish an unforgettable brand presence. We script, design, publish, and analyze multi-platform content that turns passive scrollers into loyal advocates.',
    iconName: 'Share2',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'Engaging social posts, carousels & reels\nSocial profile management & content scheduling\nPersonalised social media growth strategies\nAudience engagement & active community response\nBrand voice and visual consistency governance',
    benefits:
      'Consistent daily brand visibility\nAccelerated follower-to-customer conversion\nZero algorithmic distribution penalties',
    ctaText: 'Start Social Growth',
    ctaUrl: '#contact',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'SEO Website & Blog Content Writing',
    shortDescription: 'SEO-optimised website copy, cornerstone articles, and landing pages that rank and resonate.',
    fullDescription:
      'Compelling editorial copy engineered for search visibility and human connection. From high-converting landing pages to comprehensive thought leadership articles, every word communicates your brand story effectively.',
    iconName: 'PenTool',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'SEO-optimised website pages & landing copy\nBlog posts, long-form articles & whitepapers\nCompelling brand storytelling and ghostwriting\nKeyword intent mapping & heading architecture\nReadability and conversion tuning',
    benefits:
      'High-ranking organic search visibility\nCompelling brand positioning\nLower customer acquisition costs',
    ctaText: 'Commission Content',
    ctaUrl: '#contact',
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'SEO Backlink Strategy & Domain Authority Growth',
    shortDescription: 'Ethical, white-hat link-building campaigns that build sustainable domain authority and rank durability.',
    fullDescription:
      'Safe, compliant, and durable off-page search engine optimization. We secure genuine contextual backlinks and editorial citations to elevate your domain rating without risking algorithmic penalties.',
    iconName: 'Link',
    imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'High-quality white-hat backlink building\nContextual link-building strategic roadmaps\nDomain authority & rating acceleration\nToxic link audit & clean-up remediation\nSearch engine guideline compliance monitoring',
    benefits:
      'Permanent domain authority growth\nProtection from Google updates\nCompound referral and search traffic',
    ctaText: 'Boost Authority',
    ctaUrl: '#contact',
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Instagram & Facebook Ads Setup',
    shortDescription: 'Precision Meta Ads architecture, pixel & CAPI tracking, custom audiences, and high-ROAS lead generation.',
    fullDescription:
      'Maximize paid advertising efficiency with conversion-focused campaign architecture. We handle server-side tracking, creative testing matrices, demographic segmentation, and automated retargeting.',
    iconName: 'Target',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'Targeted Meta advertising campaign setup\nMeta Pixel & CAPI tracking configurations\nCustom & lookalike audience segmentation\nLead generation, sales & brand awareness funnels\nMulti-creative testing & weekly ROAS scaling',
    benefits:
      'Predictable lead & customer acquisition\nElimination of wasted ad spend\nGranular conversion tracking',
    ctaText: 'Launch Meta Ads',
    ctaUrl: '#contact',
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Shopify & Website Design That Converts',
    shortDescription: 'Modern, mobile-first Shopify stores and custom web platforms built for speed, UX, and checkout conversion.',
    fullDescription:
      'Transform casual browsers into loyal customers. We architect modern, conversion-engineered Shopify stores and custom web platforms featuring frictionless checkout, mobile-first design, and seamless third-party app stacks.',
    iconName: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'Modern, responsive Shopify store development\nProducts, collections, menus & payments setup\nFull website redesign & layout modernization\nSpeed, core web vitals & UX optimization\nConversion-focused landing page design\nOngoing website maintenance & enhancements',
    benefits:
      'Higher average order value & checkout rate\nSub-second mobile loading speed\nFrictionless customer purchase journey',
    ctaText: 'Build Modern Store',
    ctaUrl: '#contact',
    displayOrder: 5,
    isPublished: true,
  },
  {
    title: 'Business Plans & Investor-Ready Proposals',
    shortDescription: 'Data-backed business plans, financial projections, and pitch decks crafted to secure institutional funding.',
    fullDescription:
      'Turn your vision into an institutional-grade investment document. We combine thorough market intelligence, competitor benchmarking, financial forecasting, and risk analysis into an executive-ready proposal.',
    iconName: 'FileText',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    deliverables:
      'Professional business plan documentation\nComprehensive market & competitor research\n5-year financial projections & models\nInvestor-ready proposals & pitch decks\nSWOT and strategic risk matrices\nBusiness strategy & execution roadmaps',
    benefits:
      'Institutional credibility before investors\nCrystal-clear commercial execution path\nAccurate revenue and margin forecasting',
    ctaText: 'Request Business Plan',
    ctaUrl: '#contact',
    displayOrder: 6,
    isPublished: true,
  },
];

export const initialProjects: ProjectItem[] = [
  {
    title: 'E-Commerce Growth Funnel & Shopify Re-Architecture',
    clientName: 'Aura Living Lifestyle',
    category: 'Shopify & E-Commerce',
    shortSummary:
      'End-to-end Shopify modernization with custom Liquid components, sub-second mobile performance, and automated abandoned cart recovery.',
    overview:
      'Aura Living faced severe cart abandonment and sluggish mobile page load on their legacy platform. We completely re-architected their digital storefront on Shopify.',
    challenges: 'High 78% mobile cart abandonment, 5.2s initial load time, fragmented inventory management.',
    strategy:
      'Built a lightweight custom theme, implemented single-page checkout optimizations, and connected real-time Meta CAPI server-side tracking.',
    results: '+100% conversion rate increase (1.8% to 3.6%), 1.1s mobile load time, -38% cart abandonment.',
    technologies: 'Shopify Plus, Liquid, Tailwind CSS, Klaviyo, Meta CAPI',
    thumbnail:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    externalUrl: 'https://www.fiverr.com/pjangid',
    fiverrUrl: 'https://www.fiverr.com/pjangid',
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Viral Organic Social Campaign & Creator Network',
    clientName: 'Nova Audio Technologies',
    category: 'Social Media Marketing',
    shortSummary:
      'Multi-platform short-form video campaign that generated 1.8M organic views and 4,200 newsletter subscribers in 90 days.',
    overview:
      'Nova Audio launched a disruptive noise-canceling headphone line. We designed a pattern-interrupt video creative strategy across Instagram Reels and TikTok.',
    challenges: 'Crowded market dominated by legacy brands with $10M+ ad budgets.',
    strategy:
      'Developed 30 high-retention reel scripts emphasizing acoustic science and real-world audio comparisons with clear lead-magnet CTAs.',
    results: '1.8M organic views, 4,200 email leads, 14.2% average reel engagement rate.',
    technologies: 'CapCut Pro, DaVinci Resolve, Instagram Graph API, Notion Content Hub',
    thumbnail:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    externalUrl: 'https://www.fiverr.com/pjangid',
    fiverrUrl: 'https://www.fiverr.com/pjangid',
    isFeatured: true,
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'B2B SaaS Organic Authority & Inbound Lead Engine',
    clientName: 'CloudMatrix Analytics',
    category: 'SEO & Content Marketing',
    shortSummary:
      '310% organic search traffic growth and $120K in pipeline generation through topical authority clusters and technical SEO.',
    overview:
      'CloudMatrix needed to reduce reliance on costly $180/click paid Google ads by establishing long-term organic search dominance.',
    challenges: 'Domain rating of DR 12, zero rankings for commercial keyword clusters, thin competitor copy.',
    strategy:
      'Constructed 25 cornerstone technical guides, implemented schema markup, and executed a structured digital PR backlink strategy.',
    results: '+310% organic search traffic, DR increased from 12 to 46, monthly demo pipeline grew by 240%.',
    technologies: 'Ahrefs, Semrush, Google Search Console, Screaming Frog, Webflow',
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    externalUrl: 'https://www.fiverr.com/pjangid',
    fiverrUrl: 'https://www.fiverr.com/pjangid',
    isFeatured: true,
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Paid Meta Ads Scaling Matrix & Precision Retargeting',
    clientName: 'PureBiome Wellness',
    category: 'Paid Advertising',
    shortSummary:
      'Multi-tiered paid advertising infrastructure delivering consistent 3.8x ROAS at $45,000/month spend.',
    overview:
      'PureBiome had hit a performance plateau with rising cost per acquisition on generic ad creatives. We completely rebuilt their ad hierarchy.',
    challenges: 'High iOS 14.5 attribution loss, ad fatigue within 48 hours, high CPA.',
    strategy:
      'Deployed dynamic creative testing (DCT), integrated Conversions API with zero data loss, and structured a 3-stage TOFU/MOFU/BOFU retargeting funnel.',
    results: '3.8x blended ROAS, -42% customer acquisition cost, $170K monthly incremental revenue.',
    technologies: 'Meta Ads Manager, Triple Whale, GA4, Shopify CAPI Gateway',
    thumbnail:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    externalUrl: 'https://www.fiverr.com/pjangid',
    fiverrUrl: 'https://www.fiverr.com/pjangid',
    isFeatured: true,
    displayOrder: 4,
    isPublished: true,
  },
];

export const initialVideos: VideoItem[] = [
  {
    title: 'Viral Reel Breakdown: Organic Hook to Conversion Funnel',
    category: 'Reels & Video Content',
    description: 'Deconstructing the first 3 seconds: Visual pattern interrupt, text hook, pacing, and seamless transition into the comment CTA.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    duration: '2:15',
    isFeatured: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'Shopify Checkout CRO: Slashing Cart Abandonment by 40%',
    category: 'Website Strategy',
    description: 'Walkthrough of mobile UX tweaks, one-click payment badges, and trust triggers that boosted conversions for a direct-to-consumer apparel store.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    duration: '3:45',
    isFeatured: true,
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'Meta Ads Scaling Matrix: TOFU to Retargeting Architecture',
    category: 'Paid Advertising',
    description: 'How we structured a multi-tiered Meta campaign with CAPI server-side tracking, custom audiences, and dynamic product catalogs.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    duration: '4:10',
    isFeatured: true,
    displayOrder: 3,
    isPublished: true,
  },
];

export const initialCaseStudies: CaseStudyItem[] = [
  {
    title: 'Direct-to-Consumer Lifestyle Brand E-Commerce Scale',
    clientName: 'Aura Living',
    industry: 'Fashion & Lifestyle Retail',
    objective: 'Modernize legacy mobile storefront and build an automated organic social funnel to slash reliance on expensive ads.',
    challenge: '5.2-second mobile load time, cart abandonment exceeding 78%, and low organic social engagement.',
    strategy: 'Rebuilt storefront on lightweight custom Liquid, deployed 3x weekly educational carousels, and implemented automated abandoned cart WhatsApp recovery.',
    execution: 'Delivered custom Shopify theme in 4 weeks, launched 20 high-retention reels, and configured server-side CAPI tracking.',
    platforms: 'Shopify, Instagram, Meta Ads, WhatsApp Direct',
    resultsSummary: 'Mobile page load dropped to 1.1s; store conversion rate increased from 1.8% to 3.6% within 60 days.',
    metrics: [
      { label: 'Conversion Rate', value: '+100%' },
      { label: 'Mobile Load Time', value: '1.1s' },
      { label: 'Organic Impressions', value: '450K+' },
      { label: 'Cart Abandonment', value: '-38%' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'B2B SaaS Organic Authority & Inbound Lead Engine',
    clientName: 'CloudMatrix Analytics',
    industry: 'Enterprise Software',
    objective: 'Establish organic search dominance for 12 key commercial topics and build an inbound B2B pipeline.',
    challenge: 'Overreliance on $180/lead Google search ads and zero organic domain authority against legacy portals.',
    strategy: 'Authored 25 cornerstone technical guides, executed ethical white-hat backlink outreach, and repurposed insights into LinkedIn carousels.',
    execution: 'Shipped weekly long-form content with schema markup, secured 35 DR60+ editorial backlinks, and engaged executive communities daily.',
    platforms: 'LinkedIn, WordPress Headless, Google Search, Email Automation',
    resultsSummary: 'Organic search traffic grew by 310% in 6 months; B2B inbound demos increased by 240% while slashing CPA to $52.',
    metrics: [
      { label: 'Organic Traffic', value: '+310%' },
      { label: 'Inbound Trial Leads', value: '+240%' },
      { label: 'Domain Rating', value: 'DR 46' },
      { label: 'Cost Per Acquisition', value: '-71%' },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    isPublished: true,
  },
];

export const initialProcessStages: CreativeProcessItem[] = [
  {
    stepNumber: 1,
    title: 'Discovery',
    shortDesc: 'Deep dive into your business model, commercial objectives, and target buyer persona.',
    deliverables: ['Audience ICP persona breakdown', 'Current digital audit', 'Growth milestone roadmap'],
    iconName: 'Search',
  },
  {
    stepNumber: 2,
    title: 'Research',
    shortDesc: 'Comprehensive analysis of competitors, viral content formats, and market gaps.',
    deliverables: ['Competitor benchmark report', 'Content gap analysis', 'Channel opportunity matrix'],
    iconName: 'BarChart3',
  },
  {
    stepNumber: 3,
    title: 'Strategy',
    shortDesc: 'Custom marketing architecture connecting social, search, and conversion mechanisms.',
    deliverables: ['Editorial content calendar', 'Conversion funnel blueprint', 'KPI measurement scorecard'],
    iconName: 'TrendingUp',
  },
  {
    stepNumber: 4,
    title: 'Creation',
    shortDesc: 'Crafting high-impact carousels, video scripts, ad copy, and high-converting landing pages.',
    deliverables: ['High-retention visual assets', 'Persuasive sales copywriting', 'On-brand design tokens'],
    iconName: 'PenTool',
  },
  {
    stepNumber: 5,
    title: 'Execution',
    shortDesc: 'Publishing, active community management, and running targeted Meta ad campaigns.',
    deliverables: ['Scheduled multi-platform publishing', 'Real-time comment engagement', 'Paid campaign launching'],
    iconName: 'Zap',
  },
  {
    stepNumber: 6,
    title: 'Optimisation',
    shortDesc: 'Reviewing real-world metrics, A/B testing creative variations, and scaling winning assets.',
    deliverables: ['Weekly analytics dashboard', 'A/B test findings report', 'Budget and scaling recommendations'],
    iconName: 'RefreshCw',
  },
];

export const initialGuideSubsections: ResourceItem[] = [
  {
    title: 'What Is Social Media?',
    category: 'Social Media Starter Guide',
    subsectionKey: 'A',
    shortDescription: 'Digital spaces where communities connect, share moments, exchange ideas, and discover brands.',
    detailedContent: `Social media platforms are digital spaces where people share photos, videos, ideas, and messages. For modern businesses, they represent the world's largest gathering of potential customers.

Popular Platforms Overview:
- Instagram: Visual storytelling, reels, aesthetics, and direct shopping.
- Facebook: Diverse demographics, community groups, and local business targeting.
- TikTok: Fast-paced short-form video discovery powered by algorithmic interest.
- YouTube: Long-form authority, search intent, tutorials, and lasting video archives.
- X (formerly Twitter): Real-time conversations, industry commentary, and thought leadership.
- LinkedIn: B2B networking, professional partnerships, and corporate decision-maker reach.`,
    keyTakeaways:
      'Choose platforms where your actual buyers spend active time\nVisual clarity and immediate relevance win attention\nNever spread thin; master one or two channels before expanding',
    illustrationUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    isPublished: true,
  },
  {
    title: 'How Social Media Actually Works',
    category: 'Social Media Starter Guide',
    subsectionKey: 'B',
    shortDescription: 'The 4-step organic distribution engine: From account creation to compounding algorithmic reach.',
    detailedContent: `Understanding the mechanical loop behind social media algorithms:

1. Create your account: Set up your profile with clear positioning and verified contact details.
2. Post your content: Share photos, carousels, and videos that solve real problems or entertain.
3. Platform distributes: The recommendation algorithm displays your post to a small test audience.
4. Engagement grows reach: Likes, saves, watch-time, and comments signal quality, prompting the platform to expand visibility to wider audiences.`,
    keyTakeaways:
      'The algorithm is not your enemy; it wants to keep users engaged\nEarly engagement velocity in the first 60 minutes matters\nShares and saves carry 5x more weight than passive likes',
    illustrationUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    isPublished: true,
  },
  {
    title: 'The Growth Formula',
    category: 'Social Media Starter Guide',
    subsectionKey: 'C',
    shortDescription: 'The timeless equation: Good content + Happy customers = Compounding free advertising.',
    detailedContent: `Organic reach is not random luck. It is the natural consequence of a repeatable formula:

Principle 1: Good Content
Valuable, authentic, and engaging posts that answer audience questions or entertain.

Principle 2: Happy Customers
Satisfied followers who comment, share with colleagues, and recommend your solutions.

Principle 3: Free Advertising
As engagement multiplies, the platform becomes your free distribution engine, driving compounding organic visibility without expensive ad spend.`,
    keyTakeaways:
      'Consistency + High-Value Resonance + Audience Engagement = Compounding Reach\nFocus on helping one person per post\nWord-of-mouth remains the most credible referral channel',
    illustrationUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    isPublished: true,
  },
  {
    title: 'Social Media for Business',
    category: 'Social Media Starter Guide',
    subsectionKey: 'D',
    shortDescription: 'Your 24/7 digital storefront: Displaying products, engaging visitors, and converting leads.',
    detailedContent: `A social profile is your always-open digital storefront:
- Display products and case studies beautifully.
- Encourage scrollers to stop, comment, and interact.
- Build consistent social proof through client feedback and behind-the-scenes moments.
- Attract pre-qualified leads through helpful tips.
- Seamlessly transition interested visitors into paying customers.`,
    keyTakeaways:
      'Your profile is a landing page; optimize your bio for conversions\nMake it effortless for visitors to take the next step\nTreat comments as warm sales conversations',
    illustrationUrl: 'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
    isPublished: true,
  },
  {
    title: 'Eight-Step Business Growth Process',
    category: 'Social Media Starter Guide',
    subsectionKey: 'E',
    shortDescription: 'Step-by-step roadmap from profile setup to repeat buyers and loyal brand community.',
    detailedContent: `The 8-step journey to predictable revenue:
1. Open your profile: Establish a dedicated business account.
2. Create your signboard: Write a clear bio stating who you help and how.
3. Display products: Showcase your services, portfolio, and deliverables clearly.
4. Attract customers: Publish engaging, helpful content on a steady cadence.
5. Algorithm boosts you: Consistency and watch-time trigger expanded distribution.
6. Instant buyers arrive: Convert hot leads with clear calls to action.
7. Followers return: Nurture followers into repeat buyers with stories and tips.
8. Happy customers expand reach: Encourage referrals, reviews, and word-of-mouth.`,
    keyTakeaways:
      'Every step feeds the next\nNever skip the clear offer; remind followers how to work with you\nFocus on building a community, not just collecting vanity metrics',
    illustrationUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
    isPublished: true,
  },
  {
    title: 'Do’s & Don’ts of Social Media',
    category: 'Social Media Starter Guide',
    subsectionKey: 'F',
    shortDescription: 'Essential etiquette, visual standards, and critical safety rules to protect your brand reputation.',
    detailedContent: `THE DO’S:
- Be kind and professional at all times.
- Post regularly (3–5 times weekly as a consistent guide).
- Use quality visuals with readable typography.
- Reply to comments promptly to build connection.
- Use 5–15 relevant, niche hashtags.
- Be authentic; let your unique perspective shine.

THE DON’TS:
- Don't share sensitive personal or client confidential details carelessly.
- Don't copy other creators' work without attribution.
- Don't buy fake followers (they destroy your account engagement rate permanently).
- Don't fight or engage in toxic online arguments.
- Don't spam direct messages with cold pitches.
- Don't post emotionally when angry.`,
    keyTakeaways:
      'Professional integrity is your most valuable asset\nEngagement pods and fake bots kill algorithmic reach\nConsistency beats brute-force spamming',
    illustrationUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
    isPublished: true,
  },
  {
    title: 'How to Grow Organically & Content Ideas',
    category: 'Social Media Starter Guide',
    subsectionKey: 'H',
    shortDescription: '5 organic growth principles and 4 evergreen content ideas that consistently captivate audiences.',
    detailedContent: `5 Organic Growth Principles:
1. Pick one platform: Focus on mastering one channel before branching out.
2. Complete your profile: Add clear links, contact details, and location.
3. Post consistently: Maintain a predictable schedule (daily or alternate days).
4. Time it right: Post when your target demographic is actively browsing.
5. Use trending audio: Leverage audio trends where relevant to your niche.

Best Content Ideas That Always Work:
- Behind-the-scenes content (work in progress, drafts, client prep).
- Quick actionable tips (one clear tip solved in 30 seconds).
- Questions and interactive polls (fostering discussion and feedback).
- Relatable human moments (honest lessons learned and milestones).`,
    keyTakeaways:
      'Show the messy middle, not just the polished highlight reel\nInteractive stickers and questions boost engagement metrics\nDeliver immediate value before asking for a sale',
    illustrationUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    displayOrder: 7,
    isPublished: true,
  },
  {
    title: 'Turning Followers Into Paying Customers',
    category: 'Social Media Starter Guide',
    subsectionKey: 'K',
    shortDescription: 'The 7-step organic conversion funnel: From initial reel discovery to completed transaction.',
    detailedContent: `How attention transforms into revenue:
1. Reel captures attention: High-hook short-form video stops the scroll.
2. Like shows interest: The viewer expresses initial approval.
3. Profile visit: The viewer navigates to your bio to learn more.
4. Follow commits: The viewer opts into your regular content stream.
5. Stories build trust: Daily casual stories show personality and credibility.
6. Offer presented: A direct, compelling offer solves their specific problem.
7. Sale completed: The customer completes checkout or signs the agreement.`,
    keyTakeaways:
      'Stories are for selling; reels are for reach\nDo not be afraid to invite followers to buy\nStreamline checkout and contact forms to eliminate friction',
    illustrationUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    displayOrder: 8,
    isPublished: true,
  },
  {
    title: 'Website = Your Home Base & Omnichannel Marketing',
    category: 'Social Media Starter Guide',
    subsectionKey: 'L',
    shortDescription: 'Why your website is your single platform-proof asset, combined with Email, WhatsApp, and Paid Ads.',
    detailedContent: `Social platforms are rented land; your website is the home base you own completely.

Why Your Website Matters:
- Professionalism: Establishes instant corporate legitimacy.
- Google Search: Captures inbound commercial intent customers.
- Direct Lead Capture: Stores customer contact info without platform restrictions.
- Platform-Proof: Protects your business from sudden algorithm changes.

Connecting The Omnichannel Ecosystem:
- Email Marketing: Deep relationship building and automated nurture sequences.
- WhatsApp Direct: High-speed conversational commerce and instant customer support.
- Paid Meta Ads: Retargeting warm website visitors to complete consideration loops.`,
    keyTakeaways:
      'Always drive social traffic to owned assets (email list, CRM, website)\nMultichannel presence multiplies perceived brand authority\nSpeed to response in WhatsApp closes high-ticket contracts',
    illustrationUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    displayOrder: 9,
    isPublished: true,
  },
  {
    title: 'Monthly Social Media Execution Checklist',
    category: 'Social Media Starter Guide',
    subsectionKey: 'N',
    shortDescription: 'Interactive monthly routine: Posting frequency, comment responsiveness, testimonial updates, and lead collection.',
    detailedContent: `The non-negotiable monthly operational routine:
- Posted 20–30 high-value content pieces?
- Replied to 100% of sincere comments and DMs?
- Added fresh client testimonials to your profile and site?
- Ran a limited-time promotional campaign or incentive?
- Exported and saved new lead contacts into your private CRM?`,
    keyTakeaways:
      'Consistent systems eliminate creative burnout\nAudit your analytics monthly to double down on what converts\nNever let a week pass without checking in on your active leads',
    checklistItems: [
      'Published 20–30 strategic posts across selected platforms',
      'Responded to comments within 60 minutes of posting',
      'Updated website with fresh client case studies & reviews',
      'Conducted monthly promotional push or seasonal offer',
      'Safeguarded and backed up new customer contact details',
    ],
    illustrationUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    displayOrder: 10,
    isPublished: true,
  },
];

export const initialTestimonials: TestimonialItem[] = [
  {
    clientName: 'Alexander Vance',
    designation: 'Chief Technology Officer',
    company: 'Vance Logistics International',
    testimonialText:
      'PJ brought exceptional clarity, velocity, and structure to our digital branding and portal overhaul. His strategic marketing insights and technical governance ensured we launched ahead of schedule with remarkable adoption.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    displayOrder: 1,
    isPublished: true,
  },
  {
    clientName: 'Elena Rostova',
    designation: 'Founder & Creative Director',
    company: 'Lumiere Lifestyle Group',
    testimonialText:
      'Working with PJ on our social media campaigns and Shopify architecture was transformative. Our mobile conversion rate doubled and our reel engagement soared within 60 days. Truly makes brands impossible to ignore.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    displayOrder: 2,
    isPublished: true,
  },
  {
    clientName: 'Marcus Sterling',
    designation: 'Head of Growth',
    company: 'Apex FinTech Solutions',
    testimonialText:
      'The investor-ready proposals, content strategy, and SEO architecture PJ built helped us complete our funding round with absolute stakeholder confidence. Highly professional, responsive, and strategic.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    displayOrder: 3,
    isPublished: true,
  },
];

/**
 * Safe Initial Data Seeding Utility
 * Only creates records if collection or doc is missing. Requires admin authentication.
 */
export async function seedInitialDataIfNeeded(force = false): Promise<{ seeded: boolean; message: string }> {
  if (!auth.currentUser) {
    return { seeded: false, message: 'Admin authentication required to seed Firestore data.' };
  }

  try {
    // 1. Site Settings
    const settingsRef = doc(db, 'siteSettings', 'global');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists() || force) {
      await setDoc(settingsRef, initialSiteSettings, { merge: !force });
    }

    // 2. Hero
    const heroRef = doc(db, 'hero', 'main');
    const heroSnap = await getDoc(heroRef);
    if (!heroSnap.exists() || force) {
      await setDoc(heroRef, initialHeroData, { merge: !force });
    }

    // 3. About
    const aboutRef = doc(db, 'about', 'main');
    const aboutSnap = await getDoc(aboutRef);
    if (!aboutSnap.exists() || force) {
      await setDoc(aboutRef, initialAboutData, { merge: !force });
    }

    // 4. Services
    const servicesSnap = await getDocs(collection(db, 'services'));
    if (servicesSnap.empty || force) {
      for (let i = 0; i < initialServices.length; i++) {
        await setDoc(doc(db, 'services', `service_${i + 1}`), initialServices[i]);
      }
    }

    // 4b. Projects
    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty || force) {
      for (let i = 0; i < initialProjects.length; i++) {
        await setDoc(doc(db, 'projects', `project_${i + 1}`), initialProjects[i]);
      }
    }

    // 5. Videos
    const videosSnap = await getDocs(collection(db, 'videos'));
    if (videosSnap.empty || force) {
      for (let i = 0; i < initialVideos.length; i++) {
        await setDoc(doc(db, 'videos', `video_${i + 1}`), initialVideos[i]);
      }
    }

    // 6. Case Studies
    const caseStudiesSnap = await getDocs(collection(db, 'caseStudies'));
    if (caseStudiesSnap.empty || force) {
      for (let i = 0; i < initialCaseStudies.length; i++) {
        await setDoc(doc(db, 'caseStudies', `case_study_${i + 1}`), initialCaseStudies[i]);
      }
    }

    // 7. Creative Process
    const processSnap = await getDocs(collection(db, 'creativeProcess'));
    if (processSnap.empty || force) {
      for (let i = 0; i < initialProcessStages.length; i++) {
        await setDoc(doc(db, 'creativeProcess', `process_${i + 1}`), initialProcessStages[i]);
      }
    }

    // 8. Resources / Guide Sections
    const resourcesSnap = await getDocs(collection(db, 'resources'));
    if (resourcesSnap.empty || force) {
      for (let i = 0; i < initialGuideSubsections.length; i++) {
        await setDoc(doc(db, 'resources', `guide_${i + 1}`), initialGuideSubsections[i]);
      }
    }

    // 9. Testimonials
    const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
    if (testimonialsSnap.empty || force) {
      for (let i = 0; i < initialTestimonials.length; i++) {
        await setDoc(doc(db, 'testimonials', `testimonial_${i + 1}`), initialTestimonials[i]);
      }
    }

    return { seeded: true, message: 'All verified PJ portfolio data synchronized successfully with Firestore.' };
  } catch (error) {
    console.error('Data seeding notice:', error);
    return { seeded: false, message: error instanceof Error ? error.message : String(error) };
  }
}

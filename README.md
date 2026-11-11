# Prakash Jangid - Premium Portfolio & Firebase CMS

A production-grade, single-page professional portfolio website with a private Firebase-powered Admin Dashboard, advanced lightweight animations, dynamic content management, and complete educational resource integration based on the **Social Media Starter Guide**.

---

## Key Features

1. **One-Page Public Architecture**:
   - Sticky navigation with real-time scroll progress indicator.
   - Anchor-based section jumping (`#home`, `#about`, `#expertise`, `#services`, `#portfolio`, `#resources`, `#contact`).
   - In-page case study view modal (no page redirects).
   - In-page Social Media Starter Guide chapter reader modal.
2. **Design System**:
   - Apple-inspired minimalism and contemporary agency editorial layout.
   - Palette: **Emerald Green** (`#10B981`) + **Charcoal** (`#111827`) + **Sage/Soft Green** (`#F3F7F5`).
   - Smooth viewport-triggered animations powered by `motion/react`.
   - Accessible reduced-motion support.
3. **Professional Services (Social Media Starter Guide Reference)**:
   - *Service 1*: Business Plans & Investor-Ready Proposals
   - *Service 2*: SEO Website & Blog Content Writing
   - *Service 3*: Social Media Content Creation & Management
   - *Service 4*: SEO Backlink Strategy & Domain Authority Growth
   - *Service 5*: Instagram & Facebook Ads Setup
   - *Service 6*: Shopify & Website Design That Converts
4. **Educational Resources**:
   - 7 core modules from the 16-page Social Media Starter Guide (Fundamentals, Business Growth, Best Practices, Content Strategy, Safety, Marketing Channels, Monthly Checklist).
5. **Secure Admin Dashboard (`/admin` or `#admin`)**:
   - **16 Content Modules**: Dashboard Overview, Website Settings, Hero Section, About Me, Expertise Management, Services Management, Portfolio Management, Achievements Management, Resources Management, Testimonials Management, Contact Enquiries Manager, Social Media Links, SEO Settings, Media Library, Admin Profile, and Audit Logs.
   - Lead management table with status pipeline (`new`, `read`, `in_progress`, `completed`, `archived`), internal private notes, search, and filtering.
6. **Firebase Backend Architecture**:
   - Cloud Firestore with zero-trust Attribute-Based Access Control (ABAC) in `firestore.rules`.
   - Firebase Authentication with Google Sign-In & Email/Password.
   - Contact form spam protection via honeypot traps and string boundary enforcement.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion for React.
- **Backend**: Firebase Cloud Firestore, Firebase Authentication, Firebase Storage, Firebase Security Rules.
- **Hosting Target**: Vercel (SPA routing configured in `vercel.json`).

---

## Getting Started Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` to view the public website.
Click **Admin** in the header or visit `http://localhost:3000/#admin` to access the CMS.

---

## Deployment to Vercel via GitHub

1. Push this repository to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: complete portfolio website and Firebase CMS"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import the GitHub repository.
4. Set the Framework Preset to **Vite**.
5. Add the environment variables from `.env.example` in the Vercel Project Settings:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
6. Click **Deploy**. Vercel will build and launch your production portfolio!

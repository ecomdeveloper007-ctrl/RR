import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Globe,
  Mail,
  MessageCircle,
  Target,
  CheckSquare,
  Square,
  ChevronDown,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { ResourceItem } from '../types/portfolio';

interface ResourcesSectionProps {
  onSelectResource: (resource: ResourceItem) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ onSelectResource }) => {
  const { resources } = usePortfolio();

  // Local interactive checklist states
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleChecklist = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const monthlyChecklistDefaults = [
    'Published 20–30 high-value content pieces across selected channels',
    'Replied to 100% of sincere audience comments and direct messages',
    'Collected and showcased new customer reviews & project results',
    'Ran a limited-time seasonal offer or conversion campaign',
    'Exported and backed up new customer email/WhatsApp leads to private CRM',
  ];

  return (
    <section id="guide" className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Social Media Starter Guide Playbook
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            The Complete 16-Page Social Media Blueprint, Reimagined
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Step-by-step methodologies on platform mechanics, business growth, content formats, safety standards, and converting followers into paying clients.
          </p>
        </div>

        {/* SUBSECTION A: WHAT IS SOCIAL MEDIA & POPULAR PLATFORMS */}
        <div className="bg-[#F3F7F5] rounded-3xl p-6 sm:p-10 border border-emerald-100 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                Module A &bull; Core Foundations
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                What Is Social Media & Popular Platforms
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Digital spaces where people share photos, videos, ideas, and messages — and where businesses meet ready buyers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            {[
              { name: 'Instagram', role: 'Visuals & Reels', tag: 'Visual Commerce' },
              { name: 'Facebook', role: 'Communities & Ads', tag: 'Broad Reach' },
              { name: 'TikTok', role: 'Discovery Videos', tag: 'High Velocity' },
              { name: 'YouTube', role: 'Long-Form Authority', tag: 'Search Intent' },
              { name: 'X / Twitter', role: 'Real-Time Insights', tag: 'Conversation' },
              { name: 'LinkedIn', role: 'B2B & Partnerships', tag: 'Corporate' },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 text-center space-y-1 shadow-xs"
              >
                <div className="text-xs font-extrabold text-slate-900">{p.name}</div>
                <div className="text-[11px] text-slate-500 font-medium">{p.role}</div>
                <div className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-0.5 rounded">
                  {p.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSECTIONS B, C, D: HOW IT WORKS, GROWTH FORMULA & BUSINESS VALUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* How Social Media Actually Works */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Module B &bull; The Mechanics
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1 mb-4">
                How Social Media Actually Works
              </h4>
              <div className="space-y-3 text-xs text-slate-700">
                {[
                  '1. Create Account: Sign up on your selected channel',
                  '2. Post Content: Share engaging photos and videos',
                  '3. Algorithm Distributes: Shown to relevant test viewers',
                  '4. Engagement Grows: Interactions trigger expanded reach',
                ].map((step, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                    {step}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500">
              Engagement velocity directly multiplies organic distribution.
            </div>
          </div>

          {/* The Growth Formula */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Module C &bull; The Equation
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1 mb-4">
                The Core Growth Formula
              </h4>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="font-bold text-xs text-emerald-900">Good Content</div>
                  <p className="text-[11px] text-emerald-800">Valuable, engaging, solution-oriented posts.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="font-bold text-xs text-emerald-900">Happy Customers</div>
                  <p className="text-[11px] text-emerald-800">Satisfied followers who comment, save & share.</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="font-bold text-xs text-emerald-900">Free Advertising</div>
                  <p className="text-[11px] text-emerald-800">Algorithms reward engagement with compounding reach.</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500">
              Good Content + Happy Followers = Sustainable Inbound Growth.
            </div>
          </div>

          {/* Social Media for Business */}
          <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Module D &bull; Commerce
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1 mb-4">
                Social Media for Business
              </h4>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Works as your 24/7 online storefront</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Display products and proof beautifully</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Build consistent, active brand credibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Convert engaged leads into paying clients</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 mt-4 text-[11px] text-slate-500">
              Social platforms are always open to buyers worldwide.
            </div>
          </div>
        </div>

        {/* SUBSECTION F & G: DO'S AND DON'TS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Do's */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>The Do&apos;s of Social Media (Module F)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-emerald-950 font-medium">
              {[
                { title: 'Be Kind', desc: 'Maintain respect and professional dignity' },
                { title: 'Post Regularly', desc: '3–5 times weekly as a consistent guide' },
                { title: 'Use Quality Visuals', desc: 'Clear lighting and crisp typography' },
                { title: 'Reply to Comments', desc: 'Foster two-way community connection' },
                { title: 'Relevant Hashtags', desc: '5–15 niche-specific tags per post' },
                { title: 'Be Yourself', desc: 'Authenticity builds lasting trust' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/80 p-3 rounded-xl border border-emerald-200/60 space-y-0.5">
                  <div className="font-bold text-emerald-800">{item.title}</div>
                  <div className="text-[11px] text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The Don'ts */}
          <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-7 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>The Don&apos;ts of Social Media (Module G)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-rose-950 font-medium">
              {[
                { title: "Don't share personal details", desc: 'Safeguard private financial or client data' },
                { title: "Don't copy content", desc: 'Plagiarism harms credibility and rankings' },
                { title: "Don't buy fake followers", desc: 'Bots ruin your account engagement rate' },
                { title: "Don't fight online", desc: 'Never argue with internet trolls' },
                { title: "Don't spam DMs", desc: 'Avoid aggressive, unsolicited pitching' },
                { title: "Don't post when angry", desc: 'Maintain composure and brand reputation' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/80 p-3 rounded-xl border border-rose-200/60 space-y-0.5">
                  <div className="font-bold text-rose-800">{item.title}</div>
                  <div className="text-[11px] text-slate-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBSECTION K: TURNING FOLLOWERS INTO PAYING CUSTOMERS (INTERACTIVE FUNNEL) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Module K &bull; The Conversion Engine
            </span>
            <h3 className="text-2xl font-bold mt-1">
              Turning Followers Into Paying Customers
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              The 7-step psychological progression that transforms passive social attention into closed revenue:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 pt-2">
            {[
              { step: '1', title: 'Reel/Post', action: 'Captures Attention' },
              { step: '2', title: 'Like/Save', action: 'Shows Interest' },
              { step: '3', title: 'Profile Visit', action: 'Explores Offer' },
              { step: '4', title: 'Follow', action: 'Commits to Brand' },
              { step: '5', title: 'Stories', action: 'Deepens Trust' },
              { step: '6', title: 'Direct Offer', action: 'Solves Pain Point' },
              { step: '7', title: 'Sale Done', action: 'Repeat Customer' },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/70 text-center space-y-1"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center justify-center">
                  {f.step}
                </span>
                <div className="font-bold text-xs text-white">{f.title}</div>
                <div className="text-[11px] text-emerald-400">{f.action}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSECTION L & M: WEBSITE AS HOME BASE + MULTICHANNEL CHANNELS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Website Home Base */}
          <div className="p-7 rounded-3xl bg-[#F3F7F5] border border-emerald-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Website = Your Home Base (Module L)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Social platforms are rented land where policies and algorithms change without warning. Your website is the permanent digital asset you own completely.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Professionalism</span>
                <span className="text-[11px] text-slate-500">Instant commercial legitimacy</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Google Search</span>
                <span className="text-[11px] text-slate-500">Inbound buyer discovery</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Lead Capture</span>
                <span className="text-[11px] text-slate-500">Owned email/phone lists</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block">Platform-Proof</span>
                <span className="text-[11px] text-slate-500">Zero algorithmic risk</span>
              </div>
            </div>
          </div>

          {/* Email, WhatsApp & Paid Ads */}
          <div className="p-7 rounded-3xl bg-[#F3F7F5] border border-emerald-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Target className="w-5 h-5 text-emerald-600" />
              <span>Email, WhatsApp & Paid Ads (Module M)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Integrate complementary channels into an uninterrupted customer acquisition flywheel:
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Email & Text</span>
                  <span className="text-[11px] text-slate-600">
                    Build owned audience lists, automate follow-ups, and deliver valuable offers.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Direct</span>
                  <span className="text-[11px] text-slate-600">
                    Rapid one-on-one conversational commerce, sharing product catalogues and closing warm deals.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Targeted Paid Ads</span>
                  <span className="text-[11px] text-slate-600">
                    Reach laser-targeted buyer cohorts, test creative variants, and scale predictable ROAS.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSECTION N: INTERACTIVE MONTHLY CHECKLIST */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Module N &bull; Operational Routine
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Interactive Monthly Social Media Checklist
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click checkboxes below to audit your monthly marketing discipline
            </span>
          </div>

          <div className="space-y-3">
            {monthlyChecklistDefaults.map((task, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleChecklist(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isChecked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 text-emerald-600">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 fill-emerald-100" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </span>
                    <span className="text-xs sm:text-sm">{task}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isChecked ? 'Completed' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Starter Guide Chapters Grid */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Full Chapter Library & Downloads
              </h3>
              <p className="text-xs text-slate-500">
                Click any chapter to read in-depth playbooks and takeaways in an in-page overlay.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelectResource(item)}
                className="bg-[#F3F7F5] rounded-3xl p-6 border border-emerald-100/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Module {item.subsectionKey || idx + 1}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">0{idx + 1}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    Read Chapter <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">In-Page Reader</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

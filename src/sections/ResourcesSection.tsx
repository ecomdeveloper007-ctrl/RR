import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { ResourceItem } from '../types/portfolio';

interface ResourcesSectionProps {
  onSelectResource: (resource: ResourceItem) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = () => {
  return (
    <section id="guide" className="py-8 sm:py-10 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        {/* Compact Section Header */}
        <div className="max-w-2xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#059669]">
            <BookOpen className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span>Social Media Starter Guide</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-[#64748B] font-medium">16-Page Playbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight [text-wrap:balance]">
            The Complete Social Media Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed font-normal">
            Platform mechanics, business growth, content standards, and converting followers into paying clients.
          </p>
        </div>

        {/* SUBSECTION A: WHAT IS SOCIAL MEDIA & POPULAR PLATFORMS */}
        <div className="bg-[#F3F7F5] rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-[#059669]">
                Module A · Core Foundations
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#111827]">
                What Is Social Media &amp; Popular Platforms
              </h3>
            </div>
            <p className="text-xs text-[#64748B] max-w-md">
              Digital spaces where audiences discover brands and connect with businesses ready to serve them.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[#E2E8F0] rounded-xl border border-[#E2E8F0] overflow-hidden">
            {[
              { name: 'Instagram', role: 'Visuals & Reels', tag: 'Visual Commerce' },
              { name: 'Facebook', role: 'Communities & Ads', tag: 'Broad Reach' },
              { name: 'TikTok', role: 'Discovery Videos', tag: 'High Velocity' },
              { name: 'YouTube', role: 'Long-Form Authority', tag: 'Search Intent' },
              { name: 'X / Twitter', role: 'Real-Time Insights', tag: 'Conversation' },
              { name: 'LinkedIn', role: 'B2B & Partnerships', tag: 'Corporate' },
            ].map((p, i) => (
              <div key={i} className="bg-white p-2.5 sm:p-3 space-y-0.5 min-w-0">
                <div className="text-xs font-bold text-[#111827] truncate">{p.name}</div>
                <div className="text-[11px] text-[#64748B] truncate">{p.role}</div>
                <div className="text-[10px] font-semibold text-[#059669] truncate">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSECTIONS B, C, D: HOW IT WORKS, GROWTH FORMULA & BUSINESS VALUE */}
        <div className="flex md:grid md:grid-cols-3 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-1 md:pb-0">
          {/* Module B */}
          <div className="min-w-[82%] sm:min-w-[46%] md:min-w-0 snap-start bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] font-semibold text-[#059669]">
                  Module B · The Mechanics
                </span>
                <h4 className="text-sm sm:text-[15px] font-bold text-[#111827]">
                  How Social Media Actually Works
                </h4>
              </div>
              <ol className="space-y-1.5 text-xs text-[#334155]">
                {[
                  '1. Create Account: Sign up on your selected channel',
                  '2. Post Content: Share engaging photos & videos',
                  '3. Algorithm Distributes: Shown to test viewers',
                  '4. Engagement Grows: Interactions expand reach',
                ].map((step, sIdx) => (
                  <li key={sIdx} className="py-1.5 px-2.5 rounded-lg bg-[#F3F7F5] font-medium text-[11px]">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#64748B]">
              Engagement velocity multiplies organic reach.
            </div>
          </div>

          {/* Module C */}
          <div className="min-w-[82%] sm:min-w-[46%] md:min-w-0 snap-start bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] font-semibold text-[#059669]">
                  Module C · The Equation
                </span>
                <h4 className="text-sm sm:text-[15px] font-bold text-[#111827]">
                  The Core Growth Formula
                </h4>
              </div>
              <div className="space-y-1.5">
                <div className="p-2 rounded-lg bg-[#F3F7F5]">
                  <div className="font-bold text-xs text-[#111827]">Good Content</div>
                  <p className="text-[11px] text-[#64748B]">Valuable, engaging, solution-oriented posts.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F3F7F5]">
                  <div className="font-bold text-xs text-[#111827]">Happy Customers</div>
                  <p className="text-[11px] text-[#64748B]">Satisfied followers who comment, save &amp; share.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#F3F7F5]">
                  <div className="font-bold text-xs text-[#111827]">Free Advertising</div>
                  <p className="text-[11px] text-[#64748B]">Algorithms reward engagement with organic reach.</p>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#64748B]">
              Good Content + Happy Followers = Inbound Growth.
            </div>
          </div>

          {/* Module D */}
          <div className="min-w-[82%] sm:min-w-[46%] md:min-w-0 snap-start bg-white p-4 rounded-2xl border border-[#E2E8F0] flex flex-col justify-between gap-3">
            <div className="space-y-2.5">
              <div>
                <span className="text-[11px] font-semibold text-[#059669]">
                  Module D · Commerce
                </span>
                <h4 className="text-sm sm:text-[15px] font-bold text-[#111827]">
                  Social Media for Business
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-[#334155]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Works as your 24/7 online storefront</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Displays products and social proof clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Builds consistent, active brand credibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                  <span>Converts engaged leads into paying clients</span>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#64748B]">
              Always open to qualified buyers worldwide.
            </div>
          </div>
        </div>

        {/* SUBSECTION F & G: DO'S AND DON'TS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* The Do's */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>The Do&apos;s of Social Media (Module F)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { title: 'Be Kind', desc: 'Respect & dignity' },
                { title: 'Post Regularly', desc: '3–5 times weekly' },
                { title: 'Quality Visuals', desc: 'Clear lighting & type' },
                { title: 'Reply Fast', desc: 'Two-way community' },
                { title: 'Niche Hashtags', desc: '5–15 relevant tags' },
                { title: 'Be Authentic', desc: 'Consistency builds trust' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-emerald-200/60">
                  <div className="font-bold text-[11px] text-emerald-900">{item.title}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The Don'ts */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-rose-950 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>The Don&apos;ts of Social Media (Module G)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { title: "Don't overshare", desc: 'Guard private data' },
                { title: "Don't copy", desc: 'Original work ranks' },
                { title: "Don't buy bots", desc: 'Ruins engagement' },
                { title: "Don't argue", desc: 'Avoid online trolls' },
                { title: "Don't spam DMs", desc: 'No cold pitching' },
                { title: "Don't rush posts", desc: 'Protect brand voice' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-rose-200/60">
                  <div className="font-bold text-[11px] text-rose-900">{item.title}</div>
                  <div className="text-[11px] text-[#64748B] truncate">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBSECTION K: TURNING FOLLOWERS INTO PAYING CUSTOMERS */}
        <div className="bg-[#111827] text-white rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400">
                Module K · The Conversion Engine
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Turning Followers Into Paying Customers
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              7-step progression from passive attention to repeat buyer
            </p>
          </div>

          <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { step: '1', title: 'Reel/Post', action: 'Attention' },
              { step: '2', title: 'Like/Save', action: 'Interest' },
              { step: '3', title: 'Profile Visit', action: 'Explores' },
              { step: '4', title: 'Follow', action: 'Commits' },
              { step: '5', title: 'Stories', action: 'Trust' },
              { step: '6', title: 'Direct Offer', action: 'Solution' },
              { step: '7', title: 'Sale Done', action: 'Repeat Client' },
            ].map((f, i) => (
              <div
                key={i}
                className="min-w-[110px] lg:min-w-0 bg-slate-800/80 px-2.5 py-2.5 rounded-xl border border-slate-700/70 text-center space-y-0.5 shrink-0"
              >
                <div className="text-[10px] font-bold text-emerald-400 tabular-nums">
                  0{f.step}
                </div>
                <div className="font-bold text-xs text-white truncate">{f.title}</div>
                <div className="text-[10px] text-slate-300 truncate">{f.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

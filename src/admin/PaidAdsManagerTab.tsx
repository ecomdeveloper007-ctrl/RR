import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Save,
  BookOpen,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { PaidAdCaseStudyItem, AdGlossaryTermItem } from '../types/portfolio';

export const PaidAdsManagerTab: React.FC = () => {
  const {
    paidAds,
    adGlossary,
    savePaidAd,
    deletePaidAd,
    saveAdGlossaryTerm,
    deleteAdGlossaryTerm,
    syncPaidAdsDefaults,
  } = usePortfolio();

  const [editingAd, setEditingAd] = useState<PaidAdCaseStudyItem | null>(null);
  const [editingTerm, setEditingTerm] = useState<AdGlossaryTermItem | null>(null);

  const sortedAds = [...paidAds].sort((a, b) => a.displayOrder - b.displayOrder);
  const sortedGlossary = [...adGlossary].sort((a, b) => a.displayOrder - b.displayOrder);

  const moveAdOrder = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sortedAds.length) return;
    const current = sortedAds[index];
    const swap = sortedAds[targetIndex];
    await savePaidAd({ ...current, displayOrder: swap.displayOrder });
    await savePaidAd({ ...swap, displayOrder: current.displayOrder });
  };

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#10B981]" />
            <span>Paid Ads &amp; Campaign Performance ({paidAds.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Meta Ads &amp; Google Ads case studies, exact performance metrics, dashboard screenshots, and advertising glossary items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Synchronize default Paid Ads case studies and 12 glossary terms into Firestore? Existing unrelated collections will not be modified.'
                )
              ) {
                syncPaidAdsDefaults(true);
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sync Paid Ads Defaults</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setEditingAd({
                clientName: '',
                platform: 'Meta Ads',
                objectiveLabel: 'Lead generation campaign',
                destinationDisplay: '',
                destinationUrl: 'https://',
                achievedSummary: '',
                heroStatValue: 0,
                heroStatLabel: 'reported results',
                metrics: [
                  { value: '$0.00', label: 'Cost per result' },
                  { value: '$0.00', label: 'Amount spent' },
                  { value: '0', label: 'Impressions' },
                  { value: '0', label: 'Reach' },
                ],
                budgetContext: '',
                clientReality: '',
                howAdsHelped: '',
                whatThisMeans: '',
                screenshotUrl: '',
                screenshotAlt: '',
                screenshotCaption: 'Campaign dashboard screenshot supplied by the campaign manager',
                spotlightCaption: '',
                displayOrder: paidAds.length + 1,
                isPublished: true,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Paid Ad Study</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Paid Ad Case Study Form */}
      {editingAd && (
        <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-white">
              {editingAd.id ? `Edit Campaign: ${editingAd.clientName}` : 'Add New Paid Ad Case Study'}
            </h4>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={editingAd.isPublished}
                onChange={(e) => setEditingAd({ ...editingAd, isPublished: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500"
              />
              <span>Published on Website</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client / Project Name *</label>
              <input
                type="text"
                value={editingAd.clientName}
                onChange={(e) => setEditingAd({ ...editingAd, clientName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Platform *</label>
              <select
                value={editingAd.platform}
                onChange={(e) => setEditingAd({ ...editingAd, platform: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              >
                <option value="Meta Ads">Meta Ads</option>
                <option value="Google Ads">Google Ads</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Campaign Objective *</label>
              <input
                type="text"
                value={editingAd.objectiveLabel}
                onChange={(e) => setEditingAd({ ...editingAd, objectiveLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Destination URL *</label>
              <input
                type="url"
                value={editingAd.destinationUrl}
                onChange={(e) => setEditingAd({ ...editingAd, destinationUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Short Display URL</label>
              <input
                type="text"
                value={editingAd.destinationDisplay}
                onChange={(e) => setEditingAd({ ...editingAd, destinationDisplay: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Achieved Summary *</label>
            <textarea
              rows={2}
              value={editingAd.achievedSummary}
              onChange={(e) => setEditingAd({ ...editingAd, achievedSummary: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hero Stat Number *</label>
              <input
                type="number"
                value={editingAd.heroStatValue}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, heroStatValue: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hero Stat Caption *</label>
              <input
                type="text"
                value={editingAd.heroStatLabel}
                onChange={(e) => setEditingAd({ ...editingAd, heroStatLabel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Budget / Campaign Note</label>
              <input
                type="text"
                value={editingAd.budgetContext || ''}
                onChange={(e) => setEditingAd({ ...editingAd, budgetContext: e.target.value })}
                placeholder="e.g. $20 daily budget"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Display Order</label>
              <input
                type="number"
                value={editingAd.displayOrder}
                onChange={(e) =>
                  setEditingAd({ ...editingAd, displayOrder: parseInt(e.target.value, 10) || 1 })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          {/* 4 Reported Metrics Editor */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Reported Performance Figures</span>
              <button
                type="button"
                onClick={() =>
                  setEditingAd({
                    ...editingAd,
                    metrics: [...(editingAd.metrics || []), { value: '', label: '' }],
                  })
                }
                className="text-[11px] font-semibold text-emerald-400 hover:underline"
              >
                + Add Metric
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(editingAd.metrics || []).map((metric, mIdx) => (
                <div key={mIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Value (e.g. $0.03)"
                    value={metric.value}
                    onChange={(e) => {
                      const next = [...editingAd.metrics];
                      next[mIdx] = { ...next[mIdx], value: e.target.value };
                      setEditingAd({ ...editingAd, metrics: next });
                    }}
                    className="w-28 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Cost per result)"
                    value={metric.label}
                    onChange={(e) => {
                      const next = [...editingAd.metrics];
                      next[mIdx] = { ...next[mIdx], label: e.target.value };
                      setEditingAd({ ...editingAd, metrics: next });
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = editingAd.metrics.filter((_, idx) => idx !== mIdx);
                      setEditingAd({ ...editingAd, metrics: next });
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                    title="Remove metric"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Explanations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Client reality</label>
              <textarea
                rows={3}
                value={editingAd.clientReality}
                onChange={(e) => setEditingAd({ ...editingAd, clientReality: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">How the ads helped</label>
              <textarea
                rows={3}
                value={editingAd.howAdsHelped}
                onChange={(e) => setEditingAd({ ...editingAd, howAdsHelped: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">What this means</label>
              <textarea
                rows={3}
                value={editingAd.whatThisMeans}
                onChange={(e) => setEditingAd({ ...editingAd, whatThisMeans: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          {/* Screenshot / Spotlight Panel Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Dashboard Screenshot Path / URL (leave blank to use Spotlight)
              </label>
              <input
                type="text"
                value={editingAd.screenshotUrl || ''}
                onChange={(e) => setEditingAd({ ...editingAd, screenshotUrl: e.target.value })}
                placeholder="/images/ads/sherria-cotton-meta-ads.png"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Spotlight Caption (if no screenshot)
              </label>
              <input
                type="text"
                value={editingAd.spotlightCaption || ''}
                onChange={(e) => setEditingAd({ ...editingAd, spotlightCaption: e.target.value })}
                placeholder="landing page views at $0.29 each"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setEditingAd(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!editingAd.clientName) return;
                await savePaidAd(editingAd);
                setEditingAd(null);
              }}
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Campaign Study</span>
            </button>
          </div>
        </div>
      )}

      {/* Existing Paid Ads List */}
      <div className="space-y-3">
        {sortedAds.map((ad, idx) => (
          <div
            key={ad.id || idx}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveAdOrder(idx, -1)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedAds.length - 1}
                  onClick={() => moveAdOrder(idx, 1)}
                  className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {ad.screenshotUrl ? (
                <img
                  src={ad.screenshotUrl}
                  alt={ad.screenshotAlt || ad.clientName}
                  className="w-16 h-12 rounded-xl object-cover border border-slate-800 shrink-0 bg-white"
                />
              ) : (
                <div className="w-16 h-12 rounded-xl border border-emerald-500/30 bg-emerald-950/50 flex items-center justify-center text-xs font-extrabold text-emerald-300 shrink-0">
                  {ad.heroStatValue.toLocaleString()}
                </div>
              )}

              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {ad.platform}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate">{ad.clientName}</h4>
                  <span className="text-xs font-bold text-emerald-400">
                    {ad.heroStatValue.toLocaleString()} {ad.heroStatLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{ad.achievedSummary}</p>
                {ad.destinationUrl && (
                  <a
                    href={ad.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline"
                  >
                    <span>{ad.destinationDisplay || ad.destinationUrl}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => savePaidAd({ ...ad, isPublished: !ad.isPublished })}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  ad.isPublished
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                {ad.isPublished ? 'Published' : 'Hidden'}
              </button>
              <button
                type="button"
                onClick={() => setEditingAd(ad)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (ad.id && window.confirm(`Delete "${ad.clientName}" Paid Ad case study?`)) {
                    deletePaidAd(ad.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advertising Glossary CMS Subsection */}
      <div className="pt-8 border-t border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#10B981]" />
              <span>Advertising Glossary Terms ({adGlossary.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Plain-language explanations displayed in the &ldquo;How to read a campaign result&rdquo; section.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setEditingTerm({
                term: '',
                definition: '',
                displayOrder: adGlossary.length + 1,
                isPublished: true,
              })
            }
            className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Glossary Term</span>
          </button>
        </div>

        {editingTerm && (
          <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Term *</label>
                <input
                  type="text"
                  value={editingTerm.term}
                  onChange={(e) => setEditingTerm({ ...editingTerm, term: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Display Order</label>
                <input
                  type="number"
                  value={editingTerm.displayOrder}
                  onChange={(e) =>
                    setEditingTerm({
                      ...editingTerm,
                      displayOrder: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Plain-Language Definition *</label>
              <textarea
                rows={2}
                value={editingTerm.definition}
                onChange={(e) => setEditingTerm({ ...editingTerm, definition: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingTerm(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!editingTerm.term || !editingTerm.definition) return;
                  await saveAdGlossaryTerm(editingTerm);
                  setEditingTerm(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white"
              >
                Save Term
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedGlossary.map((item, gIdx) => (
            <div
              key={item.id || gIdx}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{item.term}</h4>
                  <span className="text-[10px] text-slate-500">#{item.displayOrder}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.definition}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => saveAdGlossaryTerm({ ...item, isPublished: !item.isPublished })}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.isPublished
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {item.isPublished ? 'Active' : 'Hidden'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTerm(item)}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (item.id && window.confirm(`Delete glossary term "${item.term}"?`)) {
                      deleteAdGlossaryTerm(item.id);
                    }
                  }}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

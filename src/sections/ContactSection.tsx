import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Mail, Phone, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const ContactSection: React.FC = () => {
  const { siteSettings, services, submitEnquiry } = usePortfolio();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    service: services[0]?.title || 'Social Media Content Creation & Management',
    budgetRange: '$1,000 - $3,000 / month',
    message: '',
    honeypot: '', // anti-spam trap
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      setIsSubmitted(true);
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, email, and project details.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await submitEnquiry({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        businessName: formData.businessName.trim() || undefined,
        service: formData.service,
        budgetRange: formData.budgetRange,
        message: formData.message.trim(),
      });

      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        businessName: '',
        service: services[0]?.title || '',
        budgetRange: '$1,000 - $3,000 / month',
        message: '',
        honeypot: '',
      });
    } catch (err: unknown) {
      console.error('Contact error:', err);
      setErrorMessage('Unable to submit enquiry right now. Please try again or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact context */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase bg-[#D1FAE5] px-3 py-1 rounded-full border border-emerald-300/60 mb-3">
                Let&apos;s Connect
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
                Let&apos;s Discuss Your Next Digital Leap
              </h2>
              <p className="mt-4 text-base text-[#64748B] leading-relaxed font-normal">
                Ready to make your brand impossible to ignore? Share your goals, current challenges, and timeline, and I will prepare a structured proposal for your team.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F3F7F5] border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Direct Email
                  </div>
                  <a
                    href={`mailto:${siteSettings.contactEmail || ''}`}
                    className="text-sm font-bold text-[#111827] hover:text-[#10B981] transition-colors"
                  >
                    {siteSettings.contactEmail || ''}
                  </a>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Average turnaround: &lt; 4 hours</p>
                </div>
              </div>

              {siteSettings.contactPhone && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F3F7F5] border border-emerald-100">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                      WhatsApp / Phone
                    </div>
                    <div className="text-sm font-bold text-[#111827]">
                      {siteSettings.contactPhone}
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">Direct client consultations</p>
                  </div>
                </div>
              )}
            </div>

            {/* Escrow badge */}
            <div className="p-5 rounded-2xl bg-[#111827] text-white flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#10B981]">Prefer Escrow Protection?</div>
                <div className="text-xs text-slate-300">Order securely through my verified Fiverr Pro profile</div>
              </div>
              <a
                href={siteSettings.fiverrUrl || 'https://www.fiverr.com/pjangid'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-colors"
              >
                <span>Fiverr Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#F3F7F5] p-8 sm:p-10 rounded-3xl border border-emerald-100 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#111827]">Message Received!</h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your project details have been sent directly to PJ. You will receive a personalized response shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#10B981] text-white text-xs font-semibold hover:bg-[#059669] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for anti-spam */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981] placeholder:text-slate-400"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="elena@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981] placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                      Business / Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lumiere Co."
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981] placeholder:text-slate-400"
                    />
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                      Budget Range (Optional)
                    </label>
                    <select
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                    >
                      <option value="Under $1,000">Under $1,000</option>
                      <option value="$1,000 - $3,000 / month">$1,000 - $3,000 / month</option>
                      <option value="$3,000 - $5,000 / month">$3,000 - $5,000 / month</option>
                      <option value="$5,000+ / Custom Retainer">$5,000+ / Custom Retainer</option>
                    </select>
                  </div>
                </div>

                {/* Service required */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                    Service Required
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981]"
                  >
                    {services.map((s, idx) => (
                      <option key={s.id || idx} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="End-to-End Digital Growth Retainer">
                      End-to-End Digital Growth Retainer
                    </option>
                  </select>
                </div>

                {/* Project details */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#111827] mb-1">
                    Project Details & Goals *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your current bottleneck, target timeline, and what success looks like..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-xs sm:text-sm focus:outline-none focus:border-[#10B981] placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending to PJ...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Project Details</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#64748B] pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Strict confidentiality: We never share or sell your details.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

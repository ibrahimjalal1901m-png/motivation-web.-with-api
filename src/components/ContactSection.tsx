import React, { useState } from 'react';
import { Send, MapPin, Mail, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useToast } from './Toast';
import { soundFx } from '../utils/audio';

export const ContactSection: React.FC = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Executive Mentorship & Strategy',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Proposal description cannot be empty.';
    } else if (formData.message.length < 15) {
      errs.message = 'Please provide at least 15 characters describing your proposal.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      soundFx.playClick();
      return;
    }

    setSubmitting(true);
    soundFx.playSave();

    // Simulate verified executive submission with client demo notice
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      soundFx.playComplete();
      showToast(
        'Inquiry Transmitted (Demo Mode)',
        'Your message has been processed locally in demonstrative testing mode.',
        'success'
      );
    }, 900);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: 'Executive Mentorship & Strategy',
      message: '',
    });
    setSubmitted(false);
    setErrors({});
  };

  return (
    <section id="about-contact" className="py-20 lg:py-28 bg-[#0B0B0E]/80 backdrop-blur-md relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Context Details (5 Columns) */}
        <div data-reveal="heading" className="lg:col-span-5 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#D4AF37]">
              Direct Channel
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white tracking-tight">
              Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37]">Executive</span> Contact
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Interested in institutional keynote addresses, private advisory sessions, or media partnerships? Submit an inquiry directly to our inner circle.
            </p>
          </div>

          <div className="flex flex-col gap-5 pt-2">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111114] border border-white/[0.06] gold-glow-card">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#FFE08A] flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Global HQ
                </span>
                <span className="text-sm font-medium text-white mt-0.5">
                  Zurich • New York • Singapore
                </span>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111114] border border-white/[0.06] gold-glow-card">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#FFE08A] flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Confidential Dispatch
                </span>
                <a
                  href="mailto:director@aspirework.vip"
                  className="text-sm font-mono text-[#FFE08A] hover:underline mt-0.5"
                >
                  director@aspirework.vip
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111114] border border-white/[0.06] gold-glow-card">
              <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#FFE08A] flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Response Latency
                </span>
                <span className="text-sm font-medium text-white mt-0.5">
                  Sub-4-Hour SLA for Verified Entities
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Card (7 Columns) */}
        <div data-reveal="fade-up" className="lg:col-span-7 rounded-2xl bg-[#111114] border border-[#D4AF37]/35 p-6 sm:p-10 shadow-2xl flex flex-col gap-6 gold-glow-card">
          {submitted ? (
            <div className="py-10 flex flex-col items-center text-center gap-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#F5D76E]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-white">
                Inquiry Logged (Demo Mode)
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed">
                Thank you, <strong className="text-white">{formData.name}</strong>. Because this platform is operating in demonstration preview mode, no external email server credentials have been provisioned. For real executive queries, please reach out directly to{' '}
                <span className="text-[#F5D76E] font-mono">director@aspirework.vip</span>.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs uppercase font-mono tracking-wider text-zinc-200 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sterling Hayes"
                    className={`w-full px-4 py-3 rounded-lg bg-[#0A0A0C] border text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-600 ${
                      errors.name ? 'border-rose-500' : 'border-white/10'
                    }`}
                  />
                  {errors.name && <span className="text-[11px] text-rose-400">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Direct Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sterling@hayescapital.com"
                    className={`w-full px-4 py-3 rounded-lg bg-[#0A0A0C] border text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-600 ${
                      errors.email ? 'border-rose-500' : 'border-white/10'
                    }`}
                  />
                  {errors.email && <span className="text-[11px] text-rose-400">{errors.email}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Purpose of Inquiry *
                </label>
                <select
                  id="contact-subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0A0A0C] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <option value="Executive Mentorship & Strategy">Executive Mentorship & Strategy</option>
                  <option value="Media & Content Syndication">Media & Content Syndication</option>
                  <option value="Global Keynote Address">Global Keynote Address</option>
                  <option value="Private Brand Alliance">Private Brand Alliance</option>
                  <option value="General Strategic Dispatch">General Strategic Dispatch</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Your Proposal *
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {formData.message.length} / 500
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  rows={4}
                  maxLength={500}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your operational goals, timelines, and scope..."
                  className={`w-full px-4 py-3 rounded-lg bg-[#0A0A0C] border text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-zinc-600 resize-none ${
                    errors.message ? 'border-rose-500' : 'border-white/10'
                  }`}
                />
                {errors.message && <span className="text-[11px] text-rose-400">{errors.message}</span>}
              </div>

              {/* Demo Mode Disclaimer */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-900/60 border border-white/5 text-zinc-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#F5D76E] flex-shrink-0" />
                <span>
                  Demo Mode: Submissions validate client-side safely without transmitting unsolicited web traffic.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-lg font-display text-xs uppercase tracking-[0.16em] font-bold text-[#080808] bg-gradient-to-r from-[#F5D76E] to-[#D4AF37] hover:brightness-110 shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_4px_32px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
              >
                <span>{submitting ? 'Transmitting Intelligence...' : 'Transmit Inquiry'}</span>
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

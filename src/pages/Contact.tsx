import React, { useState, useEffect } from 'react';
import { PageShell } from '../components/layout/PageShell';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Mail, MapPin, Clock, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Contact — VYRA | Your Campus. Your Moments.';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setIsSubmitted(true);
  };

  return (
    <PageShell>
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-20 relative z-20">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          {/* Header */}
          <section className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/25 text-xs font-mono uppercase tracking-widest text-secondary shadow-glow-lime">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>COMMUNITY SUPPORT</span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-white">
              CONNECT WITH VYRA.
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Have a question about an upcoming moment, club recruitment, or organizer studio tooling? Drop us a note below.
            </p>
          </section>

          {/* Contact Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 items-start">
            {/* Contact Info Sidebar (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#10121A]/80 border border-white/10 space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-white mb-2">
                    Campus Help Desk
                  </h2>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Student community representatives and developer chapter leads are available to assist with event submissions.
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/20 text-electric-purple flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-text-muted">Campus Inquiries</p>
                      <p className="text-xs font-mono text-white font-semibold">support@vyra.campus</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-text-muted">Student Hub Location</p>
                      <p className="text-xs text-white leading-relaxed">
                        Tech Park Innovation Labs • Level 3<br />
                        <span className="text-text-muted text-[11px]">SRM Campus (Preview Sandbox)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-text-muted">Desk Hours</p>
                      <p className="text-xs font-mono text-white">Mon – Fri • 09:00 – 18:00 IST</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-text-muted leading-relaxed">
                  <span className="text-secondary font-bold">NOTE:</span> Non-production placeholder contacts for frontend verification. Real campus routing will connect during backend onboarding.
                </div>
              </div>
            </div>

            {/* Contact Form Card (3 cols) */}
            <div className="lg:col-span-3">
              <div className="p-6 sm:p-10 rounded-3xl bg-[#10121A]/80 border border-white/10 relative overflow-hidden">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-4 animate-fade-in">
                    <div className="w-14 h-14 rounded-2xl bg-secondary/20 text-secondary border border-secondary/30 flex items-center justify-center mx-auto shadow-glow-lime">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white">
                      MESSAGE TRANSMITTED
                    </h3>
                    <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out, {formData.name}. Your inquiry has been received in the local preview state.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', category: 'General Inquiry', message: '' });
                        }}
                        className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors"
                      >
                        Send Another Note
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      <h2 className="text-lg font-display font-bold text-white">
                        Send a Message
                      </h2>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                        Your Full Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                          SRM / Student Email <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="aarav@srmist.edu.in"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                          Inquiry Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#08090D] border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Event Registration">Event Registration</option>
                          <option value="Club Recruitment">Club Recruitment</option>
                          <option value="Organizer Access">Organizer Access</option>
                          <option value="Technical Feedback">Technical Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-text-secondary mb-1.5">
                        Your Message <span className="text-secondary">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us what you need help with or share feedback on your campus moments..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm bg-white/[0.04] border border-white/10 text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-secondary hover:bg-secondary-hover shadow-glow-lime transition-all duration-200 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </PageShell>
  );
};

export default Contact;

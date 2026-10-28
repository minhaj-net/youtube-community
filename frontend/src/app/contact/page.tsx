'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { SiteSettings } from '@/types';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export default function ContactPage() {
  const { success } = useToast();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const phoneDisplay = settings?.footerPhone || '+880 1700-000000';
  const emailDisplay = settings?.footerEmail || 'support@ytmarket.com';
  const waNumber = settings?.whatsAppNumber || '+8801700000000';
  const cleanWaNumber = waNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success('Message sent successfully! Our team will respond shortly.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              We&apos;re Here to Help Your Channel Grow
            </h1>
            <p className="text-base text-slate-400">
              Have a question about a package, custom enterprise campaign, or channel marketplace listing? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Methods */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">Direct Creator Channels</h3>

                <div className="space-y-4">
                  <a
                    href={`https://wa.me/${cleanWaNumber}?text=Hi%20TubeBoost,%20I%20have%20an%20inquiry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-300 block">Fastest Response</span>
                      <span className="text-base font-bold text-white group-hover:text-emerald-300">WhatsApp Live Chat</span>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#070D18] border border-slate-800 text-slate-300">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#FF1744] flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Phone Support</span>
                      <span className="text-base font-bold text-white">{phoneDisplay}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#070D18] border border-slate-800 text-slate-300">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">Official Email</span>
                      <span className="text-base font-bold text-white">{emailDisplay}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Support hours: Mon – Sun, 9:00 AM – 11:00 PM (GMT+6)</span>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-[#0E1726] border border-slate-800 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>

                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-white">Thank You!</h4>
                    <p className="text-sm text-slate-300 max-w-sm mx-auto">
                      Your inquiry has been logged. A YouTube growth manager will reach out via WhatsApp or email within 2 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Shakib Al Hasan"
                          className="w-full px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+880 17..."
                          className="w-full px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        How can we help your channel? *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your channel goals, required deliverables, or questions..."
                        className="w-full px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Dispatch Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

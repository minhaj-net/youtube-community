'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { ChannelListing, SiteSettings } from '@/types';
import {
  Users,
  Eye,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

function ChannelDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const [channel, setChannel] = useState<ChannelListing | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryNote, setInquiryNote] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    if (slug) {
      Promise.all([api.getChannelBySlug(slug), api.getSiteSettings()])
        .then(([chn, sett]) => {
          setChannel(chn);
          setSettings(sett);
          setLoading(false);
        })
        .catch(() => {
          setChannel(null);
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Channel Listing Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">This listing may have already been sold or withdrawn.</p>
          <Link
            href="/marketplace/channels"
            className="px-6 py-3 rounded-xl bg-[#FF1744] text-white font-bold text-sm"
          >
            Back to Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanWaNumber = (settings?.whatsAppNumber || '+8801700000000').replace(/[^0-9]/g, '');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/marketplace/channels"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Channel Listings</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                <img
                  src={channel.image}
                  alt={channel.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                    {channel.niche}
                  </span>
                  {channel.monetized && (
                    <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                      <DollarSign className="w-3.5 h-3.5" />
                      Monetized & Active
                    </span>
                  )}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800">
                  <Users className="w-5 h-5 text-[#FF1744] mb-2" />
                  <span className="text-xs text-slate-400 block font-medium">Subscribers</span>
                  <span className="text-2xl font-black text-white">{channel.subscribers.toLocaleString()}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800">
                  <Eye className="w-5 h-5 text-blue-400 mb-2" />
                  <span className="text-xs text-slate-400 block font-medium">Monthly Views</span>
                  <span className="text-2xl font-black text-white">
                    {channel.monthlyViews ? channel.monthlyViews.toLocaleString() : 'Active'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#091120] border border-slate-800 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                  <span className="text-xs text-slate-400 block font-medium">Copyright Standing</span>
                  <span className="text-xl font-bold text-emerald-400">0 Strikes</span>
                </div>
              </div>

              {/* Description */}
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-white">Channel Overview & History</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {channel.description}
                </p>
              </div>

              {/* Transfer & Legal Disclaimers */}
              <div className="p-6 rounded-3xl bg-[#111A2E] border border-slate-700/80 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Verified Transfer & Compliance Protocol</span>
                </div>
                <p className="leading-relaxed">
                  TubeBoost operates a secure escrow facilitation model. Under YouTube’s official guidelines, the seller grants Primary Owner rights to the buyer via YouTube Studio Brand Permissions. Payment is released to the seller only after the buyer confirms full primary ownership transfer.
                </p>
              </div>
            </div>

            {/* Right: Price & Inquiry Box */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#0E1726] border-2 border-slate-700/80 shadow-2xl space-y-6 sticky top-28">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
                    Verified Channel Listing
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                    {channel.title}
                  </h1>
                </div>

                <div className="p-4 rounded-2xl bg-[#060D1A] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Verified Asking Price</span>
                    <span className="text-3xl font-black text-white">
                      {channel.currency}{channel.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    Escrow Protected
                  </span>
                </div>

                {/* WhatsApp Quick Inquire */}
                <a
                  href={`https://wa.me/${cleanWaNumber}?text=Hi%20TubeBoost,%20I%20am%20interested%20in%20inspecting%20or%20buying%20the%20channel:%20${encodeURIComponent(
                    channel.title
                  )}%20(ID:%20${channel._id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition group"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Inspect Channel via WhatsApp</span>
                </a>

                {/* Direct Inquiry Form */}
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-3">Submit Acquisition Inquiry</h4>
                  {inquirySent ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                      Inquiry received! Our senior broker will message you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#060D1A] border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Your WhatsApp Phone Number"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#060D1A] border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        rows={3}
                        placeholder="Any questions or offer notes..."
                        value={inquiryNote}
                        onChange={(e) => setInquiryNote(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#060D1A] border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                      >
                        Submit Acquisition Request
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ChannelDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" /></div>}>
      <ChannelDetailContent />
    </React.Suspense>
  );
}

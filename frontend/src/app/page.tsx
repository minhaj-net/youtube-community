'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Play,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  Eye,
  Star,
  HelpCircle,
  ChevronDown,
  Layers,
  MessageSquare,
  Clock,
  Award,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PackageCard } from '@/components/PackageCard';
import { ServiceCard } from '@/components/ServiceCard';
import { ChannelCard } from '@/components/ChannelCard';
import { VideoCard } from '@/components/VideoCard';
import { api } from '@/lib/api';
import { PackageItem, ServiceItem, ChannelListing, VideoListing } from '@/types';

export default function HomePage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [channels, setChannels] = useState<ChannelListing[]>([]);
  const [videos, setVideos] = useState<VideoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [pkgs, srvs, chns, vids] = await Promise.all([
          api.getPackages().catch(() => []),
          api.getFeaturedServices().catch(() => []),
          api.getChannels().catch(() => []),
          api.getVideos().catch(() => []),
        ]);
        setPackages(pkgs);
        setServices(srvs);
        setChannels(chns);
        setVideos(vids);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const faqs = [
    {
      q: 'Are these audience-growth packages compliant with YouTube Community Guidelines?',
      a: 'Yes, absolutely. We do not use fake bots, simulated click farms, or deceptive automation. Our promotional campaigns utilize legitimate social discovery feeds, niche creator syndication, and compliant content discovery networks that respect YouTube Terms of Service.',
    },
    {
      q: 'How fast does order delivery start after checkout?',
      a: 'Most audience growth campaigns and thumbnail orders initiate within 2 to 4 hours after order placement. Video editing and comprehensive channel audits are delivered within 24 to 72 hours according to the package schedule.',
    },
    {
      q: 'Can buying a monetized channel risk my AdSense account?',
      a: 'We only list verified channels with clean copyright standing and active AdSense eligibility. We provide step-by-step guidance on compliant primary owner transfers under YouTube’s official ownership transition policies to ensure your account remains 100% secure.',
    },
    {
      q: 'What details do I need to provide during checkout?',
      a: 'You only need to provide your full name, WhatsApp phone number, email address, and your public YouTube channel or video URL. We never ask for your account password or Google login credentials.',
    },
    {
      q: 'What if I am not satisfied with the creator services?',
      a: 'All our production services (thumbnails, video editing, SEO) include revision rounds to ensure the final deliverable matches your creative vision. We also maintain a clear refund policy if our team fails to deliver according to specifications.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1">
        {/* SECTION 1: HERO */}
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
          {/* Subtle glow background gradients */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1744]/10 border border-[#FF1744]/30 text-[#FF1744] text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <span>The #1 Trusted Creator Growth Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                  Scale Your YouTube Channel With{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1744] via-rose-500 to-amber-400">
                    Industry-Grade
                  </span>{' '}
                  Growth & Production
                </h1>

                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8">
                  Compliant audience-growth packages, high-CTR thumbnail design, cinematic video editing, and verified channel listings. Built exclusively for creators who want real results.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
                  <Link
                    href="/packages"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-base shadow-xl shadow-red-500/25 transition duration-200 group"
                  >
                    <span>Explore Growth Packages</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition duration-150" />
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#0E1726] hover:bg-[#162238] border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-semibold text-base transition duration-200"
                  >
                    <span>Browse Production Services</span>
                  </Link>
                </div>

                {/* Quick Trust Highlights */}
                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 w-full max-w-lg">
                  <div>
                    <span className="text-2xl font-black text-white block">100%</span>
                    <span className="text-xs text-slate-400">Policy Compliant</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white block">2,400+</span>
                    <span className="text-xs text-slate-400">Channels Scaled</span>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white block">4.9 / 5</span>
                    <span className="text-xs text-slate-400">Creator Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Analytics & Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl bg-gradient-to-b from-[#101A2E] to-[#070D18] border border-slate-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden">
                  {/* Decorative glowing header badge */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md">
                        <YoutubeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Creator Studio Analytics</h4>
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                          Live Growth Stream
                        </span>
                      </div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                      +348% CTR
                    </span>
                  </div>

                  {/* Growth Metrics Simulation */}
                  <div className="py-6 space-y-4">
                    <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Audience Retention & Velocity</span>
                        <span className="text-white font-mono font-bold">89.4%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF1744] to-emerald-400 rounded-full w-[89%]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                          Average View Duration
                        </span>
                        <span className="text-xl font-extrabold text-white">12m 45s</span>
                        <span className="text-[11px] text-emerald-400 block mt-1">↑ +42% vs previous</span>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800">
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block mb-1">
                          Monetization Status
                        </span>
                        <span className="text-xl font-extrabold text-emerald-400">Eligible</span>
                        <span className="text-[11px] text-slate-400 block mt-1">AdSense Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Banner inside card */}
                  <div className="p-4 rounded-2xl bg-[#FF1744]/10 border border-[#FF1744]/20 flex items-center gap-3 text-xs text-slate-300">
                    <ShieldCheck className="w-5 h-5 text-[#FF1744] shrink-0" />
                    <span>Gradual drip-feed delivery pacing to maintain natural discovery curves.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRUST & BENEFITS INDICATORS */}
        <section className="py-10 bg-[#070D18] border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0C1527] border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 text-[#FF1744] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Policy Compliant</h4>
                  <p className="text-xs text-slate-400">Strict adherence to YouTube guidelines</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0C1527] border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Natural Paced Delivery</h4>
                  <p className="text-xs text-slate-400">Organic drip-feed pacing</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0C1527] border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Pro Studio Quality</h4>
                  <p className="text-xs text-slate-400">High CTR thumbnails & 4K edits</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0C1527] border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">24/7 WhatsApp Support</h4>
                  <p className="text-xs text-slate-400">Direct response from our specialists</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: MOST POPULAR AUDIENCE GROWTH PACKAGES */}
        <section id="packages-section" className="py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full border border-[#FF1744]/20 inline-block mb-3">
                Commercial Packages
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
                Audience Growth & Promotion Packages
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                Choose the growth velocity suited for your channel. Delivered with high retention, organic syndication, and zero risk to your channel standing.
              </p>
            </div>

            {/* Grid of Packages */}
            {loading ? (
              <div className="flex items-center justify-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-sm">No audience growth packages currently listed in the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {packages.slice(0, 4).map((pkg) => (
                  <PackageCard key={pkg._id} pkg={pkg} />
                ))}
              </div>
            )}

            {/* View all packages button */}
            <div className="mt-12 text-center">
              <Link
                href="/packages"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#0E1726] hover:bg-[#162238] border border-slate-700 hover:border-[#FF1744] text-white font-bold text-sm transition"
              >
                <span>View All 7 Growth Tiers (Up to 10,000 Units)</span>
                <ArrowRight className="w-4 h-4 text-[#FF1744]" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: FEATURED CREATOR SERVICES */}
        <section className="py-20 lg:py-28 bg-[#070D19] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block mb-3">
                  Production Studio
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  Featured YouTube Creator Services
                </h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  High-converting thumbnails, cinematic video editing, viral short-form pacing, and full YouTube SEO audits.
                </p>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FF1744] transition shrink-0"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Clean Light-surface Cards Section for Visual Contrast */}
            {loading ? (
              <div className="flex items-center justify-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-sm">No featured creator services currently listed in the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.slice(0, 3).map((srv) => (
                  <ServiceCard key={srv._id} service={srv} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: CHANNEL MARKETPLACE PREVIEW */}
        <section className="py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 inline-block mb-3">
                  Verified Assets
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  YouTube Channel Marketplace
                </h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  Acquire established channels with clean copyright standing, active subscribers, and verified AdSense monetization eligibility.
                </p>
              </div>

              <Link
                href="/marketplace/channels"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FF1744] transition shrink-0"
              >
                <span>View All Channel Listings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : channels.length === 0 ? (
              <div className="text-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-sm">No verified channels currently listed in the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {channels.slice(0, 3).map((channel) => (
                  <ChannelCard key={channel._id} channel={channel} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: VIDEO MARKETPLACE PREVIEW */}
        <section className="py-20 lg:py-28 bg-[#070D19] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 inline-block mb-3">
                  Commercial Rights Included
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                  Turnkey Video Marketplace
                </h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  Ready-to-publish documentaries, faceless niche videos, and 4K cinematic b-roll with exclusive or commercial licenses.
                </p>
              </div>

              <Link
                href="/marketplace/videos"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#FF1744] transition shrink-0"
              >
                <span>View All Video Assets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16 bg-[#091120] rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-sm">No turnkey video assets currently listed in the database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.slice(0, 3).map((vid) => (
                  <VideoCard key={vid._id} video={vid} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: HOW IT WORKS */}
        <section className="py-20 lg:py-28 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full border border-[#FF1744]/20 inline-block mb-3">
                Simple & Seamless
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                How TubeBoost Works
              </h2>
              <p className="text-base text-slate-400">
                Four simple steps from ordering to seeing measurable creator results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 relative">
                <span className="text-5xl font-black text-slate-800 absolute top-6 right-6">01</span>
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#FF1744] flex items-center justify-center font-bold mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Select Your Solution</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Choose from growth packages, thumbnail packages, video editing, or channel listings.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 relative">
                <span className="text-5xl font-black text-slate-800 absolute top-6 right-6">02</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-6">
                  <Play className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Provide Channel Link</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Enter your public YouTube channel or video URL during guest checkout. No password required.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 relative">
                <span className="text-5xl font-black text-slate-800 absolute top-6 right-6">03</span>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-6">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Secure Order Review</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Instant order confirmation with a unique tracking ID and direct contact with our specialist team.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 relative">
                <span className="text-5xl font-black text-slate-800 absolute top-6 right-6">04</span>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Results & Delivery</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Campaign initiates in hours with natural drip-feed pacing, delivering high-retention engagement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: TESTIMONIALS */}
        <section className="py-20 lg:py-28 bg-[#070D19] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
                Creator Feedback
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                What Creators Say About TubeBoost
              </h2>
              <p className="text-base text-slate-400">
                Real feedback from active YouTube creators who scaled their channels with our services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    &ldquo;The 1,000 unit package was the exact push my channel needed to clear the monetization threshold. The delivery was gradual and natural, and my AdSense application was approved 4 days later!&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-red-600 font-bold text-white flex items-center justify-center text-sm">
                    F
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Farhan Mahmud</h5>
                    <span className="text-xs text-slate-400">Tech & Gadgets Creator</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    &ldquo;Their custom thumbnail design took my click-through rate from 3.2% to 9.8%. That single change doubled my weekly view velocity. TubeBoost is now a permanent part of my video upload routine.&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-blue-600 font-bold text-white flex items-center justify-center text-sm">
                    S
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Shakil Hasan</h5>
                    <span className="text-xs text-slate-400">Gaming & Commentary</span>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    &ldquo;I bought an established cooking channel through the marketplace. The escrow process and owner transfer support on WhatsApp was totally transparent. Couldn&apos;t be happier with the turnaround!&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 font-bold text-white flex items-center justify-center text-sm">
                    A
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Ayesha Siddiqua</h5>
                    <span className="text-xs text-slate-400">Food & Lifestyle Channel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: FAQ ACCORDION */}
        <section className="py-20 lg:py-28 relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full border border-[#FF1744]/20 inline-block mb-3">
                Help & Answers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-base text-slate-400">
                Everything you need to know about our services, ordering process, and policies.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-[#0C1527] border border-slate-800 overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/20"
                    >
                      <span className="text-base font-bold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#FF1744]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

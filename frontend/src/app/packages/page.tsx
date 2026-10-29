'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PackageCard } from '@/components/PackageCard';
import { api } from '@/lib/api';
import { PackageItem } from '@/types';
import { Sparkles, ShieldCheck, CheckCircle2, Zap, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/lib/prefetch';

export default function PackagesPage() {
  const {
    data: packages = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<PackageItem[]>(QUERY_KEYS.PACKAGES, () => api.getPackages());

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full border border-[#FF1744]/20 inline-block mb-3">
              Official Audience Growth
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Compliant YouTube Growth Packages
            </h1>
            <p className="text-base text-slate-400 leading-relaxed">
              Accelerate your channel milestone achievement. Our promotional syndication methods strictly comply with YouTube Community Guidelines, delivering natural retention velocity.
            </p>
          </div>

          {/* Policy Compliance Banner */}
          <div className="mb-12 p-5 rounded-2xl bg-[#0C1527] border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-white block">100% Policy-Safe Promotional Reach</span>
                <span className="text-slate-400">Zero artificial bots, no fake engagement, no password needed.</span>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 shrink-0">
              Money-Back Retention Guarantee
            </span>
          </div>

          {/* Packages Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#091120] rounded-3xl border border-slate-800 mb-20">
              <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Loading growth packages from database...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#091120] rounded-3xl border border-rose-500/30 mb-20 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unable to load packages</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">{error?.message || 'Server error occurred'}</p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF1744] text-white font-bold text-xs shadow-lg shadow-red-500/20 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20 bg-[#091120] rounded-3xl border border-slate-800 mb-20">
              <p className="text-slate-400 text-base">No growth packages currently available in the database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch mb-20">
              {packages.map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          )}

          {/* Additional Package Specs / Comparison */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#091120] border border-slate-800">
            <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Growth System?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Natural Drip Delivery
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Engagement is never dumped all at once. We distribute reach over natural timelines (24h to 7 days depending on package tier) to reflect natural organic viral traction.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Niche Targeted Feed
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Campaigns are routed to viewers interested in your specific category (tech, gaming, vlogs, education), boosting real watch time and follow-on views.
                </p>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  No Account Access Required
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We never ask for your email password, 2FA code, or studio access. All we need is your public YouTube channel URL to initiate syndication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

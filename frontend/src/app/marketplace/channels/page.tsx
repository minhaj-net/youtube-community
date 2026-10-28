'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChannelCard } from '@/components/ChannelCard';
import { api } from '@/lib/api';
import { ChannelListing } from '@/types';
import { Search, ShieldCheck, DollarSign, Users, Info, AlertCircle, RefreshCw } from 'lucide-react';

export default function ChannelsMarketplacePage() {
  const [channels, setChannels] = useState<ChannelListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [monetizedOnly, setMonetizedOnly] = useState(false);
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getChannels();
      setChannels(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load channels from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const niches = ['All', 'Tech & Gadgets', 'Gaming', 'Food & Lifestyle', 'Personal Finance'];

  const filteredChannels = useMemo(() => {
    return channels.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.niche.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMonetized = !monetizedOnly || c.monetized;
      const matchesNiche = selectedNiche === 'All' || c.niche.toLowerCase() === selectedNiche.toLowerCase();

      return matchesSearch && matchesMonetized && matchesNiche;
    });
  }, [channels, searchQuery, monetizedOnly, selectedNiche]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 inline-block mb-3">
              Verified Channel Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Acquire Established YouTube Channels
            </h1>
            <p className="text-base text-slate-400">
              Browse vetted channels with verified subscriber history, active monetization standing, and organic reach.
            </p>
          </div>

          {/* Policy Compliance Notice */}
          <div className="mb-10 p-4 rounded-2xl bg-[#091120] border border-slate-800 flex items-start gap-3.5 text-xs text-slate-300">
            <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">YouTube Ownership Transfer Guarantee</span>
              All channel transactions follow YouTube’s official primary owner transfer procedure with escrow protection. Funds are safely held until owner status transitions seamlessly.
            </div>
          </div>

          {/* Controls Bar */}
          <div className="mb-10 p-4 sm:p-6 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search channels by name, niche, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={monetizedOnly}
                  onChange={(e) => setMonetizedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-[#FF1744] focus:ring-0 focus:ring-offset-0 bg-[#050B14] w-4 h-4"
                />
                <span>Monetized Only</span>
              </label>

              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-slate-200 text-xs sm:text-sm cursor-pointer focus:outline-none"
              >
                {niches.map((n) => (
                  <option key={n} value={n}>{n === 'All' ? 'All Niches' : n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid / Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0A1120] rounded-3xl border border-slate-800">
              <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Loading channels from database...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#0A1120] rounded-3xl border border-rose-500/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unable to load channels</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">{error}</p>
              <button
                onClick={fetchChannels}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF1744] text-white font-bold text-xs shadow-lg shadow-red-500/20 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : filteredChannels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredChannels.map((channel) => (
                <ChannelCard key={channel._id} channel={channel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0A1120] rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-base mb-4">No channels found matching the current search parameters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setMonetizedOnly(false);
                  setSelectedNiche('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF1744] text-white text-xs font-bold cursor-pointer"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

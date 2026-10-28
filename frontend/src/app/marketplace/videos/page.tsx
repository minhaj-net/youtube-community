'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VideoCard } from '@/components/VideoCard';
import { api } from '@/lib/api';
import { VideoListing } from '@/types';
import { Search, Film, ShieldCheck } from 'lucide-react';

export default function VideosMarketplacePage() {
  const [videos, setVideos] = useState<VideoListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVideos().then(setVideos).finally(() => setLoading(false));
  }, []);

  const categories = ['All', 'Cinematic B-Roll', 'Turnkey Faceless Videos', 'Nature & Landscapes'];

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesSearch =
        searchQuery === '' ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' ||
        v.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [videos, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20 inline-block mb-3">
              Commercial Video Assets
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Turnkey YouTube Videos & B-Roll
            </h1>
            <p className="text-base text-slate-400">
              Download professionally edited videos, complete faceless documentary packages, and 4K cinema drone footage with full commercial monetization licenses.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="mb-10 p-6 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search turnkey videos, b-roll, 4K footage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#050B14] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0A1120] rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-base mb-4">No video assets found matching criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#FF1744] text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

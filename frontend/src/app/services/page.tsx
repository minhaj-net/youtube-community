'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ServiceCard } from '@/components/ServiceCard';
import { api } from '@/lib/api';
import { ServiceItem } from '@/types';
import { Search, SlidersHorizontal, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useQuery } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/lib/prefetch';

const CATEGORIES = [
  'All',
  'Thumbnail Design',
  'Video Editing',
  'Shorts Editing',
  'YouTube SEO',
  'Channel Audit',
  'Banner Design',
];

export default function ServicesPage() {
  const {
    data: services = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<ServiceItem[]>(QUERY_KEYS.SERVICES, () => api.getServices());

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (selectedCategory !== 'All') {
      result = result.filter(
        (s) => s.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [services, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 inline-block mb-3">
              Professional Production
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              YouTube Creator Services
            </h1>
            <p className="text-base text-slate-400">
              Work with vetted graphic designers, video editors, and YouTube SEO strategists who know how the YouTube algorithm works.
            </p>
          </div>

          {/* Filters & Search Bar */}
          <div className="mb-10 p-4 sm:p-6 rounded-3xl bg-[#091120] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. thumbnails, video editing, SEO)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#FF1744] transition cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#FF1744] text-white shadow-md shadow-red-500/20'
                    : 'bg-[#0E1726] text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0A1120] rounded-3xl border border-slate-800">
              <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Loading services from database...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#0A1120] rounded-3xl border border-rose-500/30 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Unable to load services</h3>
              <p className="text-slate-400 text-sm max-w-md mb-6">{error?.message || 'Server error occurred'}</p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF1744] text-white font-bold text-xs shadow-lg shadow-red-500/20 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#0A1120] rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-base mb-4">No creator services found matching your criteria.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
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

'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ChannelListing } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Tv,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Users,
  Eye,
  DollarSign,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export default function AdminChannelsPage() {
  const { success, error: toastError } = useToast();
  const [channels, setChannels] = useState<ChannelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelListing | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subscribers, setSubscribers] = useState(10000);
  const [monthlyViews, setMonthlyViews] = useState(50000);
  const [price, setPrice] = useState(35000);
  const [niche, setNiche] = useState('Tech & Reviews');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [sellerContact, setSellerContact] = useState('');
  const [monetized, setMonetized] = useState(true);
  const [verified, setVerified] = useState(true);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [saving, setSaving] = useState(false);

  const fetchChannels = async () => {
    try {
      const data = await api.getAdminChannels();
      setChannels(data);
    } catch {
      toastError('Failed to fetch channel listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const openCreateModal = () => {
    setEditingChannel(null);
    setTitle('');
    setSlug('');
    setSubscribers(10000);
    setMonthlyViews(50000);
    setPrice(35000);
    setNiche('Tech & Reviews');
    setCategory('Technology');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setSellerContact('support@ytmarket.com');
    setMonetized(true);
    setVerified(true);
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (channel: ChannelListing) => {
    setEditingChannel(channel);
    setTitle(channel.title);
    setSlug(channel.slug);
    setSubscribers(channel.subscribers);
    setMonthlyViews(channel.monthlyViews || 0);
    setPrice(channel.price);
    setNiche(channel.niche);
    setCategory(channel.category);
    setDescription(channel.description);
    setImage(channel.image);
    setSellerContact(channel.sellerContact || '');
    setMonetized(channel.monetized);
    setVerified(channel.verified || false);
    setStatus(channel.status);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingChannel) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Partial<ChannelListing> = {
      title,
      slug: slug || `channel-${Date.now()}`,
      subscribers: Number(subscribers),
      monthlyViews: Number(monthlyViews),
      price: Number(price),
      niche,
      category,
      description,
      image,
      sellerContact,
      monetized,
      verified,
      status,
    };

    try {
      if (editingChannel) {
        const updated = await api.updateChannel(editingChannel._id, payload);
        setChannels((prev) => prev.map((c) => (c._id === editingChannel._id ? updated : c)));
        success('Channel listing updated successfully');
      } else {
        const created = await api.createChannel(payload);
        setChannels((prev) => [created, ...prev]);
        success('New channel listing created');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toastError(err?.message || 'Failed to save channel listing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.deleteChannel(id);
      setChannels((prev) => prev.filter((c) => c._id !== id));
      success('Channel listing deleted');
    } catch {
      toastError('Failed to delete channel listing');
    }
  };

  const filteredChannels = channels.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Tv className="w-8 h-8 text-[#FF1744]" />
            Channel Marketplace Management
          </h1>
          <p className="text-sm text-slate-400">
            Publish, edit, and audit turnkey YouTube channel listings for creators and investors.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF1744] hover:bg-[#D9002C] text-white font-bold text-sm shadow-lg shadow-red-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Channel Listing</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search channels by name, niche, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold hidden sm:block">
          Total: {filteredChannels.length} channel(s)
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading listings...</p>
        </div>
      ) : filteredChannels.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091120] border border-slate-800">
          <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No channels found</h3>
          <p className="text-xs text-slate-400">Add a channel listing or adjust your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChannels.map((channel) => (
            <div
              key={channel._id}
              className="rounded-3xl bg-[#091120] border border-slate-800 overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Image banner */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={channel.image}
                  alt={channel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                  {channel.monetized && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white backdrop-blur-sm shadow">
                      Monetized
                    </span>
                  )}
                  {channel.verified && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/90 text-white backdrop-blur-sm shadow flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      channel.status === 'published'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-amber-500/80 text-white'
                    }`}
                  >
                    {channel.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-bold text-[#FF1744] uppercase tracking-wider mb-1">
                    {channel.niche}
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{channel.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {channel.description || 'Verified YouTube channel asset available for transfer.'}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#050B14] border border-slate-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Subscribers</span>
                    <strong className="text-white font-mono">
                      {channel.subscribers.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Monthly Views</span>
                    <strong className="text-white font-mono">
                      {(channel.monthlyViews || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Footer and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Asking Price</span>
                    <span className="text-base font-black text-white font-mono">
                      ৳{channel.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(channel)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(channel._id, channel.title)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">
                {editingChannel ? 'Edit Channel Listing' : 'Add New Channel Listing'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Channel Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Apex Tech Lab"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Subscribers *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={subscribers}
                    onChange={(e) => setSubscribers(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Monthly Views
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={monthlyViews}
                    onChange={(e) => setMonthlyViews(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Asking Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Niche / Focus
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. Gaming, Tech, Finance"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Thumbnail / Banner Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Channel Description & Highlights
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Seller Contact Email/Phone
                  </label>
                  <input
                    type="text"
                    value={sellerContact}
                    onChange={(e) => setSellerContact(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Listing Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={monetized}
                    onChange={(e) => setMonetized(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF1744] focus:ring-0"
                  />
                  <span>Monetization Enabled</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#FF1744] focus:ring-0"
                  />
                  <span>Verified Identity Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#D9002C] text-white font-bold text-xs shadow-lg shadow-red-500/20 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingChannel ? 'Update Listing' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { VideoListing } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Film,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Play,
  Clock,
  Award,
  DollarSign,
  Download,
} from 'lucide-react';

export default function AdminVideosPage() {
  const { success, error: toastError } = useToast();
  const [videos, setVideos] = useState<VideoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoListing | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Tech & Gaming');
  const [price, setPrice] = useState(1500);
  const [duration, setDuration] = useState('10:45 min');
  const [resolution, setResolution] = useState('4K UHD 60fps');
  const [rightsText, setRightsText] = useState(
    'Full Commercial Monetization Rights\nZero Copyright Claims Guaranteed\nMaster Audio & Video WAV/MP4 Included'
  );
  const [deliverables, setDeliverables] = useState(
    '4K Master MP4, Premiere Pro Timeline, Clean Thumbnail PSD'
  );
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    try {
      const data = await api.getAdminVideos();
      setVideos(data);
    } catch {
      toastError('Failed to fetch video listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setSlug('');
    setCategory('Tech & Gaming');
    setPrice(1500);
    setDuration('10:45 min');
    setResolution('4K UHD 60fps');
    setRightsText(
      'Full Commercial Monetization Rights\nZero Copyright Claims Guaranteed\nMaster Audio & Video WAV/MP4 Included'
    );
    setDeliverables('4K Master MP4, Premiere Pro Timeline, Clean Thumbnail PSD');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80');
    setStatus('published');
    setIsModalOpen(true);
  };

  const openEditModal = (video: VideoListing) => {
    setEditingVideo(video);
    setTitle(video.title);
    setSlug(video.slug);
    setCategory(video.category);
    setPrice(video.price);
    setDuration(video.duration || '10 min');
    setResolution(video.resolution || '1080p');
    setRightsText((video.rightsIncluded || []).join('\n'));
    setDeliverables(video.deliverables || '');
    setDescription(video.description);
    setImage(video.image);
    setStatus(video.status);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingVideo) {
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

    const rightsIncluded = rightsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<VideoListing> = {
      title,
      slug: slug || `video-${Date.now()}`,
      category,
      price: Number(price),
      duration,
      resolution,
      rightsIncluded,
      deliverables,
      description,
      image,
      status,
    };

    try {
      if (editingVideo) {
        const updated = await api.updateVideo(editingVideo._id, payload);
        setVideos((prev) => prev.map((v) => (v._id === editingVideo._id ? updated : v)));
        success('Video asset listing updated');
      } else {
        const created = await api.createVideo(payload);
        setVideos((prev) => [created, ...prev]);
        success('New turnkey video listing created');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toastError(err?.message || 'Failed to save video listing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      success('Video asset deleted');
    } catch {
      toastError('Failed to delete video asset');
    }
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Film className="w-8 h-8 text-[#FF1744]" />
            Video Marketplace Management
          </h1>
          <p className="text-sm text-slate-400">
            Manage turnkey pre-produced video assets, monetization licenses, and deliverables.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF1744] hover:bg-[#D9002C] text-white font-bold text-sm shadow-lg shadow-red-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Asset</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
          />
        </div>
        <div className="text-xs text-slate-400 font-semibold hidden sm:block">
          Total: {filteredVideos.length} asset(s)
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading video assets...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091120] border border-slate-800">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No video assets found</h3>
          <p className="text-xs text-slate-400">Add a video asset or adjust your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="rounded-3xl bg-[#091120] border border-slate-800 overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-950/80 text-white backdrop-blur-sm shadow flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.duration || '10 min'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF1744]/90 text-white backdrop-blur-sm shadow">
                    {video.resolution || '1080p'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      video.status === 'published'
                        ? 'bg-emerald-500/80 text-white'
                        : 'bg-amber-500/80 text-white'
                    }`}
                  >
                    {video.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] font-bold text-[#FF1744] uppercase tracking-wider mb-1">
                    {video.category}
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{video.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {video.description || 'Full turnkey YouTube video asset with commercial rights.'}
                  </p>
                </div>

                {/* Deliverables snippet */}
                {video.deliverables && (
                  <div className="p-2.5 rounded-xl bg-[#050B14] border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 truncate">
                    <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{video.deliverables}</span>
                  </div>
                )}

                {/* Footer and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 block">License Price</span>
                    <span className="text-base font-black text-white font-mono">
                      ৳{video.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(video)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video._id, video.title)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-xl font-black text-white">
                {editingVideo ? 'Edit Video Asset' : 'Add New Video Asset'}
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
                    Video Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 10 AI Tools That Feel Illegal"
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
                    Price (৳) *
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

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 10:45 min"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Resolution
                  </label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="e.g. 4K UHD 60fps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
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

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Thumbnail / Preview Image URL
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
                  Deliverables Specification
                </label>
                <input
                  type="text"
                  value={deliverables}
                  onChange={(e) => setDeliverables(e.target.value)}
                  placeholder="e.g. 4K Master MP4, Premiere Pro Timeline, Clean Thumbnail PSD"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Rights Included (One per line)
                </label>
                <textarea
                  rows={3}
                  value={rightsText}
                  onChange={(e) => setRightsText(e.target.value)}
                  placeholder="Full Commercial Monetization Rights&#10;Zero Copyright Claims Guaranteed"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Description & Content Synopsis
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#FF1744]"
                />
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
                  {saving ? 'Saving...' : editingVideo ? 'Update Video' : 'Create Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ServiceItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function AdminServicesPage() {
  const { success, error: toastError } = useToast();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState(500);
  const [category, setCategory] = useState('Thumbnail Design');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const fetchServices = async () => {
    try {
      const data = await api.getAdminServices();
      setServices(data);
    } catch {
      toastError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setName('');
    setSlug('');
    setPrice(500);
    setCategory('Thumbnail Design');
    setImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setDeliveryInfo('Delivered within 24 hours. Revisions included.');
    setFeaturesText('High Resolution\nFast Turnaround\nUnlimited Revisions');
    setIsFeatured(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setName(srv.name);
    setSlug(srv.slug);
    setPrice(srv.price);
    setCategory(srv.category);
    setImage(srv.image);
    setDescription(srv.description);
    setDeliveryInfo(srv.deliveryInformation || '');
    setFeaturesText(srv.features.join('\n'));
    setIsFeatured(srv.isFeatured);
    setIsActive(srv.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingService) {
        await api.updateService(editingService._id, {
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(price),
          category,
          image,
          description,
          deliveryInformation: deliveryInfo,
          features,
          isFeatured,
          isActive,
        });
        success(`Service "${name}" updated successfully`);
      } else {
        await api.createService({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          price: Number(price),
          category,
          image,
          description,
          deliveryInformation: deliveryInfo,
          features,
          isFeatured,
          isActive,
        });
        success(`Service "${name}" created successfully`);
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: string, srvName: string) => {
    if (confirm(`Are you sure you want to delete "${srvName}"?`)) {
      try {
        await api.deleteService(id);
        success(`Service "${srvName}" deleted`);
        fetchServices();
      } catch {
        toastError('Failed to delete service');
      }
    }
  };

  const filtered = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Services Management</h1>
          <p className="text-xs text-slate-400">Manage creator studio production offerings and pricing.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white text-xs font-bold transition shadow-md shadow-red-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-[#0C1527] border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search creator services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-slate-300 focus:outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Thumbnail Design">Thumbnail Design</option>
          <option value="Video Editing">Video Editing</option>
          <option value="Shorts Editing">Shorts Editing</option>
          <option value="YouTube SEO">YouTube SEO</option>
          <option value="Channel Audit">Channel Audit</option>
          <option value="Banner Design">Banner Design</option>
        </select>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl bg-[#0C1527] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#070D18] border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#FF1744] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Loading creator services from database...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No creator services found in database.
                  </td>
                </tr>
              ) : (
                filtered.map((srv) => (
                  <tr key={srv._id} className="hover:bg-slate-800/20 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={srv.image}
                          alt={srv.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{srv.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{srv.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-300">{srv.category}</td>
                    <td className="p-4 font-bold text-white">৳{srv.price.toLocaleString()}</td>
                    <td className="p-4">
                      {srv.isFeatured ? (
                        <span className="bg-[#FF1744]/20 text-[#FF1744] text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          srv.isActive
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {srv.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv._id, srv.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1726] border border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingService ? 'Edit Service' : 'Create New Service'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. High-CTR Thumbnail Design"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                  >
                    <option value="Thumbnail Design">Thumbnail Design</option>
                    <option value="Video Editing">Video Editing</option>
                    <option value="Shorts Editing">Shorts Editing</option>
                    <option value="YouTube SEO">YouTube SEO</option>
                    <option value="Channel Audit">Channel Audit</option>
                    <option value="Banner Design">Banner Design</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service description"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Delivery / Turnaround Info
                </label>
                <input
                  type="text"
                  value={deliveryInfo}
                  onChange={(e) => setDeliveryInfo(e.target.value)}
                  placeholder="e.g. Delivered within 24 hours via Google Drive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#FF1744] focus:ring-0"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-500 focus:ring-0"
                  />
                  <span>Active & Listed</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

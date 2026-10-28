'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PackageItem } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

export default function AdminPackagesPage() {
  const { success, error: toastError } = useToast();
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [price, setPrice] = useState(160);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Audience Growth');
  const [featuresText, setFeaturesText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const fetchPackages = async () => {
    try {
      const data = await api.getAdminPackages();
      setPackages(data);
    } catch {
      toastError('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setEditingPackage(null);
    setName('');
    setSlug('');
    setQuantity(100);
    setPrice(160);
    setDescription('');
    setCategory('Audience Growth');
    setFeaturesText('Compliant Reach\nHigh Retention\nWhatsApp Support');
    setIsFeatured(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PackageItem) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setSlug(pkg.slug);
    setQuantity(pkg.quantity);
    setPrice(pkg.price);
    setDescription(pkg.description);
    setCategory(pkg.category);
    setFeaturesText(pkg.features.join('\n'));
    setIsFeatured(pkg.isFeatured);
    setIsActive(pkg.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingPackage) {
        await api.updatePackage(editingPackage._id, {
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          quantity: Number(quantity),
          price: Number(price),
          description,
          category,
          features,
          isFeatured,
          isActive,
        });
        success(`Package "${name}" updated successfully`);
      } else {
        await api.createPackage({
          name,
          slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          quantity: Number(quantity),
          price: Number(price),
          description,
          category,
          features,
          isFeatured,
          isActive,
        });
        success(`Package "${name}" created successfully`);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (err: any) {
      toastError(err?.message || 'Failed to save package');
    }
  };

  const handleDelete = async (id: string, pkgName: string) => {
    if (confirm(`Are you sure you want to delete package "${pkgName}"?`)) {
      try {
        await api.deletePackage(id);
        success(`Package "${pkgName}" deleted`);
        fetchPackages();
      } catch {
        toastError('Failed to delete package');
      }
    }
  };

  const filtered = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Packages Management</h1>
          <p className="text-xs text-slate-400">Configure audience-growth tiers, pricing, and active status.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white text-xs font-bold transition shadow-md shadow-red-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Growth Tier</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-[#0C1527] border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search package tiers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* Packages Table */}
      <div className="rounded-3xl bg-[#0C1527] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-[#070D18] border-b border-slate-800">
              <tr>
                <th className="p-4 font-semibold">Tier Name</th>
                <th className="p-4 font-semibold">Units</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Featured</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((pkg) => (
                <tr key={pkg._id} className="hover:bg-slate-800/20 transition">
                  <td className="p-4">
                    <span className="font-bold text-white block">{pkg.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{pkg.slug}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">
                    {pkg.quantity.toLocaleString()} Units
                  </td>
                  <td className="p-4 font-bold text-white">৳{pkg.price.toLocaleString()}</td>
                  <td className="p-4">
                    {pkg.isFeatured ? (
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
                        pkg.isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Package"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id, pkg.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                      title="Delete Package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create / Edit Package */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#0E1726] border border-slate-800 p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingPackage ? 'Edit Package Tier' : 'Create New Package Tier'}
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
                <label className="text-slate-300 font-semibold block mb-1">Tier Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 1,000 Growth Units"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Quantity (Units)</label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                  />
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
                <label className="text-slate-300 font-semibold block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of target use case"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Features (One per line)
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
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
                  <span>Featured & Popular Badge</span>
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
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

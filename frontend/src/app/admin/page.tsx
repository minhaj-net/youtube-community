'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardStats, Order } from '@/types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Package,
  Layers,
  Tv,
  Film,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminDashboard().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fulfillment metrics, order pipeline status, and commercial revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white text-xs font-bold transition shadow-md shadow-red-500/20"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white block">{stats.totalOrders}</span>
          <span className="text-[11px] text-slate-400">Lifetime transactions logged</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-amber-400 block">{stats.pendingOrders}</span>
          <span className="text-[11px] text-slate-400">Requires verification/fulfillment</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-400 block">{stats.completedOrders}</span>
          <span className="text-[11px] text-slate-400">Fulfilled campaigns & assets</span>
        </div>

        <div className="p-6 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-[#FF1744]/10 text-[#FF1744] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-white block">৳{stats.revenue.toLocaleString()}</span>
          <span className="text-[11px] text-slate-400">Paid orders accounting only</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/admin/packages"
          className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-[#FF1744] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-[#FF1744] transition">
              Packages
            </span>
            <span className="text-[11px] text-slate-400">Pricing & units</span>
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-blue-400 transition">
              Services
            </span>
            <span className="text-[11px] text-slate-400">Design & editing</span>
          </div>
        </Link>

        <Link
          href="/admin/channels"
          className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-purple-400 transition">
              Channels
            </span>
            <span className="text-[11px] text-slate-400">Market listings</span>
          </div>
        </Link>

        <Link
          href="/admin/videos"
          className="p-5 rounded-2xl bg-[#091120] border border-slate-800 hover:border-slate-700 transition flex items-center gap-3.5 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold text-white block group-hover:text-emerald-400 transition">
              Videos
            </span>
            <span className="text-[11px] text-slate-400">Turnkey footage</span>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Customer Orders</h3>
            <span className="text-xs text-slate-400">Latest orders submitted across all channels</span>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-[#FF1744] hover:underline flex items-center gap-1"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Total</th>
                <th className="pb-3 font-semibold">Payment</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-slate-800/30 transition">
                  <td className="py-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-4">
                    <span className="font-bold text-slate-200 block">{ord.customerName}</span>
                    <span className="text-[11px] text-slate-400">{ord.customerPhone}</span>
                  </td>
                  <td className="py-4 text-slate-300">
                    {ord.items.map((i) => i.title).join(', ')}
                  </td>
                  <td className="py-4 font-bold text-white">৳{ord.total.toLocaleString()}</td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ord.orderStatus === 'processing'
                          ? 'bg-blue-500/20 text-blue-400'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/admin/orders`}
                      className="text-xs font-semibold text-blue-400 hover:text-white"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

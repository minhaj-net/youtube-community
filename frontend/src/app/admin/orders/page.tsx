'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  ExternalLink,
  Phone,
  Mail,
  User,
  X,
  CreditCard,
  DollarSign,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';

export default function AdminOrdersPage() {
  const { success, error: toastError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminOrders(statusFilter, search);
      setOrders(data);
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch orders from database';
      setError(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    newPayment?: PaymentStatus
  ) => {
    setIsUpdating(true);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, newPayment);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(updated);
      }
      success(`Order updated to ${newStatus}`);
    } catch (err: any) {
      toastError(err?.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Paid
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Refunded
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            Failed
          </span>
        );
      case 'unpaid':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            Unpaid
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-[#FF1744]" />
            Orders Management
          </h1>
          <p className="text-sm text-slate-400">
            Review customer orders, fulfill deliverables, and update fulfillment progress.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#091120] border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                statusFilter === tab
                  ? 'bg-[#FF1744] text-white shadow-md shadow-red-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050B14] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
          />
        </form>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading orders from database...</p>
        </div>
      ) : error ? (
        <div className="p-12 text-center rounded-3xl bg-[#091120] border border-rose-500/30">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Failed to fetch orders</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 rounded-xl bg-[#FF1744] text-white text-xs font-bold transition shadow"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#091120] border border-slate-800">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No orders found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'Try modifying your search query or status filter.'
              : 'New guest checkout orders will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#091120] border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050B14] text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items</th>
                  <th className="py-4 px-6">Total</th>
                  <th className="py-4 px-6">Payment</th>
                  <th className="py-4 px-6">Fulfillment</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      {order.orderNumber}
                      <span className="block text-[10px] text-slate-500 font-sans">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{order.customerName}</div>
                      <div className="text-[11px] text-slate-400">{order.customerPhone}</div>
                      <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        {order.items.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="truncate max-w-xs text-slate-200">
                            {item.quantity}x {item.title}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-[10px] text-slate-500 italic">
                            +{order.items.length - 2} more items
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-white">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">{getPaymentBadge(order.paymentStatus)}</td>
                    <td className="py-4 px-6">{getStatusBadge(order.orderStatus)}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-[#FF1744] text-white font-bold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-[#091120] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-[#FF1744] tracking-wider uppercase">
                  Order Management
                </span>
                <h3 className="text-xl font-black text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="p-4 rounded-2xl bg-[#050B14] border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-300 block">
                Update Fulfillment Status:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['pending', 'processing', 'completed', 'cancelled'] as OrderStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border ${
                        selectedOrder.orderStatus === st
                          ? 'bg-[#FF1744] text-white border-[#FF1744]'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>

              {/* Payment Status Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <span className="text-slate-400">Payment Status:</span>
                <div className="flex gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, selectedOrder.orderStatus, 'paid')
                    }
                    className={`px-3 py-1 rounded-lg font-bold ${
                      selectedOrder.paymentStatus === 'paid'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Mark Paid
                  </button>
                  <button
                    disabled={isUpdating}
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, selectedOrder.orderStatus, 'unpaid')
                    }
                    className={`px-3 py-1 rounded-lg font-bold ${
                      selectedOrder.paymentStatus === 'unpaid'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Mark Unpaid
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Customer Information
              </h4>
              <div className="p-4 rounded-2xl bg-[#050B14] border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Name</span>
                  <strong className="text-white">{selectedOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Phone</span>
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="text-white hover:text-[#FF1744]"
                  >
                    {selectedOrder.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block">Email</span>
                  <a
                    href={`mailto:${selectedOrder.customerEmail}`}
                    className="text-white hover:text-[#FF1744] truncate block"
                  >
                    {selectedOrder.customerEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Target YouTube URL */}
            {selectedOrder.targetUrl && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Target Deliverable URL
                </h4>
                <div className="p-3.5 rounded-2xl bg-[#050B14] border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <YoutubeIcon className="w-4 h-4 text-[#FF1744] shrink-0" />
                    <span className="font-mono text-white truncate">
                      {selectedOrder.targetUrl}
                    </span>
                  </div>
                  <a
                    href={selectedOrder.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {selectedOrder.instructions && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer Instructions
                </h4>
                <div className="p-3.5 rounded-2xl bg-[#050B14] border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedOrder.instructions}
                </div>
              </div>
            )}

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#050B14] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.quantity} x ৳{item.unitPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white">
                      ৳{item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-slate-800">
                <span className="text-slate-400">Total Order Amount</span>
                <span className="text-white text-base">
                  ৳{selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

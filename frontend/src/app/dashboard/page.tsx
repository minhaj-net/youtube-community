'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUserAuth } from '@/context/UserAuthContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import { Order } from '@/types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Package,
} from 'lucide-react';

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useUserAuth();
  const { success, error: toastError } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Order for Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      setRefreshing(true);
      const data = await api.getUserOrders();
      setOrders(data);
    } catch (err: any) {
      toastError(err?.message || 'Failed to fetch order history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setOrders([]);
    await logout();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    success('Order ID copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-xs">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Prevent flash of private content if unauthenticated or signing out
  if (!isAuthenticated || isSigningOut) {
    return null;
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.items.some((i) => i.title.toLowerCase().includes(query)) ||
      (order.targetUrl && order.targetUrl.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending').length;
  const processingOrders = orders.filter((o) => o.orderStatus === 'processing').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'completed').length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const getPaymentBadge = (status: string) => {
    if (status?.toLowerCase() === 'paid') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        Payment Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* User Profile Banner Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C1527] via-[#0E1A33] to-[#0C1527] border border-slate-800/80 p-6 sm:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF1744] to-[#B70024] flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl shadow-red-500/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {user?.name || 'Creator Account'}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified User
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {user?.email}
                    </span>
                    {user?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {user?.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={loadOrders}
                  disabled={refreshing}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#111C33] border border-slate-700/70 text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#FF1744]' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  <LogOut className={`w-3.5 h-3.5 ${isSigningOut ? 'animate-spin' : ''}`} />
                  {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>

            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0B1324] border border-slate-800/80 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">Total Orders Placed</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">{totalOrders}</span>
                <span className="text-xs text-slate-500">all time</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1324] border border-slate-800/80 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">Active Deliveries</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-400">
                  {pendingOrders + processingOrders}
                </span>
                <span className="text-xs text-slate-500">in progress</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1324] border border-slate-800/80 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">Completed Deliveries</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">{completedOrders}</span>
                <span className="text-xs text-slate-500">delivered</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0B1324] border border-slate-800/80 shadow-md">
              <span className="text-xs text-slate-400 font-medium block mb-1">Total Amount Invested</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-[#FF1744]">৳{totalSpent.toLocaleString()}</span>
                <span className="text-xs text-slate-500">BDT</span>
              </div>
            </div>
          </div>

          {/* Orders Section Header & Controls */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#FF1744]" />
                  Your Order History
                </h2>
                <p className="text-xs text-slate-400">
                  Track all your YouTube audience growth packages, creator services, and asset purchases.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/packages"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FF1744] hover:bg-[#E00034] text-white shadow-lg shadow-red-500/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Order Growth Package
                </Link>
                <Link
                  href="/services"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#111C33] hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition"
                >
                  Browse Services
                </Link>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0B1324] border border-slate-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {['all', 'pending', 'processing', 'completed', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition whitespace-nowrap ${
                      statusFilter === tab
                        ? 'bg-[#FF1744] text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search order ID or item..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#050B14] border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Orders List / Cards */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl bg-[#0B1324] border border-slate-800/80 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">No orders found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No orders match your filter criteria. Try clearing search or filters.'
                    : 'You haven’t placed any orders yet. Kickstart your YouTube growth today!'}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-xs shadow-lg shadow-red-500/25 transition"
                >
                  Explore Popular Packages
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0B1324] border border-slate-800/80 hover:border-slate-700 transition shadow-lg space-y-4"
                >
                  {/* Top Bar: Order ID, Date, Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm sm:text-base font-black text-white tracking-wide">
                          {order.orderNumber}
                        </span>
                        <button
                          onClick={() => handleCopy(order.orderNumber)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                          title="Copy Order ID"
                        >
                          {copiedId === order.orderNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-slate-600">•</span>

                      <span className="text-xs text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {getPaymentBadge(order.paymentStatus)}
                      {getStatusBadge(order.orderStatus)}
                    </div>
                  </div>

                  {/* Order Items Snapshot */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#060D1A] border border-slate-800/80 flex items-center gap-3"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-500/20 text-[#FF1744] flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate" title={item.title}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                            <span className="capitalize text-slate-500">{item.itemType}</span>
                            <span>•</span>
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold">
                              ৳{(item.subtotal || item.unitPrice * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Target URL & Footer Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
                    {order.targetUrl ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 max-w-md truncate">
                        <span className="text-slate-500 font-medium shrink-0">Target:</span>
                        <a
                          href={order.targetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:text-blue-300 truncate flex items-center gap-1"
                        >
                          {order.targetUrl}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No target URL specified</div>
                    )}

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">Total Amount</span>
                        <span className="text-base font-black text-white">
                          ৳{order.total.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#14203B] hover:bg-slate-700/80 text-slate-200 hover:text-white transition flex items-center gap-1.5"
                      >
                        View Invoice
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0B1324] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF1744]">
                  Invoice Details
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Status Header */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#060D1A] border border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Status</span>
                {getStatusBadge(selectedOrder.orderStatus)}
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Payment</span>
                {getPaymentBadge(selectedOrder.paymentStatus)}
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Date</span>
                <span className="font-semibold text-slate-300">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Total</span>
                <span className="font-black text-[#FF1744] text-sm">
                  ৳{selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Target URL & Instructions */}
            {(selectedOrder.targetUrl || selectedOrder.instructions) && (
              <div className="space-y-3 p-4 rounded-2xl bg-[#060D1A] border border-slate-800/80 text-xs">
                {selectedOrder.targetUrl && (
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Target YouTube URL:</span>
                    <a
                      href={selectedOrder.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all flex items-center gap-1"
                    >
                      {selectedOrder.targetUrl}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
                {selectedOrder.instructions && (
                  <div>
                    <span className="text-slate-500 font-semibold block mb-1">Special Instructions:</span>
                    <p className="text-slate-300 italic">{selectedOrder.instructions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Purchased Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchased Items ({selectedOrder.items.length})
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#08101F] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.title}</span>
                      <span className="text-slate-500 capitalize">
                        {item.itemType} • Qty: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="font-black text-emerald-400 text-sm">
                      ৳{(item.subtotal || item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-2xl bg-[#060D1A] border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>৳{(selectedOrder.subtotal || selectedOrder.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Promotional Discount</span>
                <span className="text-emerald-400">-৳{(selectedOrder.discount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white border-t border-slate-800 pt-2">
                <span>Final Total</span>
                <span className="text-[#FF1744]">৳{selectedOrder.total.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/order-confirmation/${selectedOrder.orderNumber}`}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                View Full Confirmation Page
              </Link>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


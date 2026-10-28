'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { Order, SiteSettings } from '@/types';
import {
  CheckCircle2,
  Package,
  Clock,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { useToast } from '@/context/ToastContext';

function OrderConfirmationContent() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { success } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      Promise.all([api.getOrderByNumber(orderId), api.getSiteSettings()])
        .then(([ord, sett]) => {
          setOrder(ord);
          setSettings(sett);
          setLoading(false);
        })
        .catch(() => {
          setOrder(null);
          setLoading(false);
        });
    }
  }, [orderId]);

  const copyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      success('Order number copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Located</h2>
          <p className="text-slate-400 text-sm mb-6">
            We could not find an order matching identifier &ldquo;{orderId}&rdquo;.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#FF1744] text-white font-bold text-sm"
          >
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cleanWaNumber = (settings?.whatsAppNumber || '+8801700000000').replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#101D33] to-[#091120] border-2 border-emerald-500/40 text-center mb-10 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full inline-block">
              Order Received Successfully
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Thank You, {order.customerName}!
            </h1>

            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your order has been recorded into our fulfillment pipeline. A summary has been dispatched to your contact details.
            </p>

            {/* Public Order ID Badge */}
            <div className="inline-flex items-center gap-3 bg-[#050B14] border border-slate-700 px-5 py-3 rounded-2xl text-white font-mono text-base font-bold shadow-sm">
              <span className="text-slate-400 text-xs uppercase font-sans">Order ID:</span>
              <span className="text-[#FF1744]">{order.orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="p-1 hover:text-[#FF1744] transition text-slate-400"
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Next Steps / Payment Instructions Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0C1527] border border-slate-800 mb-8 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Next Steps & Payment Verification</span>
            </h3>

            <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
              <p>
                To finalize campaign launch or dispatch your production team, please confirm your payment via bKash / Nagad or send your transaction ID to our WhatsApp support agent quoting Order Number <strong className="text-white">{order.orderNumber}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-[#060D18] border border-slate-800 text-xs font-mono space-y-1 text-slate-300">
                <div>bKash Merchant / Personal: <strong className="text-emerald-400">{settings?.footerPhone || '+880 1700-000000'}</strong></div>
                <div>Reference Code: <strong className="text-white">{order.orderNumber}</strong></div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20TubeBoost,%20I%20have%20placed%20order%20${encodeURIComponent(
                  order.orderNumber
                )}%20for%20৳${order.total}.%20Please%20verify%20my%20details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp Now</span>
              </a>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#091120] border border-slate-800 space-y-6 mb-8">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Order Breakdown
            </h3>

            {/* Target URL */}
            {order.targetUrl && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#050B14] border border-slate-800 text-xs">
                <YoutubeIcon className="w-5 h-5 text-[#FF1744] shrink-0" />
                <div className="truncate">
                  <span className="text-slate-400 block">Target YouTube Link:</span>
                  <a
                    href={order.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline font-mono truncate"
                  >
                    {order.targetUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Line Items */}
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm py-2 border-b border-slate-800/60"
                >
                  <div>
                    <span className="font-bold text-white block">{item.title}</span>
                    <span className="text-xs text-slate-400">
                      Quantity: {item.quantity} × ৳{item.unitPrice.toLocaleString()}
                    </span>
                  </div>
                  <span className="font-bold text-slate-200">
                    ৳{item.subtotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white">৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Status</span>
                <span
                  className={`font-bold uppercase text-xs px-2.5 py-0.5 rounded-full ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fulfillment Status</span>
                <span className="font-bold uppercase text-xs text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-slate-800">
                <span className="text-base font-bold text-white">Total Amount</span>
                <span className="text-2xl font-black text-white">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm shadow-lg shadow-red-500/25 transition flex items-center justify-center gap-2"
            >
              <span>View in My Orders Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition text-center"
            >
              Back to TubeBoost Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </React.Suspense>
  );
}

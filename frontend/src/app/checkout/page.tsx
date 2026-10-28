'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart, isCartLoaded } = useCart();
  const { error: toastError, success: toastSuccess } = useToast();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isCartLoaded && cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, isCartLoaded, router]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 8) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    // Check if target URL is relevant (package or service usually requires URL)
    const requiresUrl = cart.some((i) => i.itemType === 'package' || i.itemType === 'service');
    if (requiresUrl && (!targetUrl.trim() || !targetUrl.includes('youtube.com') && !targetUrl.includes('youtu.be'))) {
      errors.targetUrl = 'Please provide a valid YouTube channel or video URL (e.g. https://youtube.com/@yourchannel).';
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'You must accept the terms of service to proceed.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toastError('Please fix the form errors before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        targetUrl: targetUrl.trim(),
        instructions: instructions.trim(),
        items: cart.map((i) => ({
          id: i.id,
          itemType: i.itemType,
          quantity: i.quantity,
        })),
      };

      const createdOrder = await api.createOrder(orderPayload);
      if (createdOrder && createdOrder.orderNumber) {
        clearCart();
        toastSuccess(`Order ${createdOrder.orderNumber} placed successfully!`);
        router.push(`/order-confirmation/${createdOrder.orderNumber}`);
      } else {
        throw new Error('Order creation failed.');
      }
    } catch (err: any) {
      toastError(err?.message || 'Failed to place order. Please check your network and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCartLoaded || cart.length === 0) {
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

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF1744] bg-[#FF1744]/10 px-3 py-1 rounded-full inline-block mb-2">
              Guest Order Checkout
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Finalize Your Order
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              No account creation or password required. Server-verified pricing applied.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Customer Information & Delivery Channel Info */}
            <div className="lg:col-span-7 space-y-8">
              {/* Customer Details Box */}
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <span>1. Contact & Customer Information</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Full Name <span className="text-[#FF1744]">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tanvir Ahmed"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#050B14] border ${
                        formErrors.fullName ? 'border-red-500' : 'border-slate-800'
                      } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition`}
                    />
                    {formErrors.fullName && (
                      <span className="text-xs text-red-400 mt-1 block">{formErrors.fullName}</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        WhatsApp / Phone Number <span className="text-[#FF1744]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +880 1712-345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#050B14] border ${
                          formErrors.phone ? 'border-red-500' : 'border-slate-800'
                        } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition`}
                      />
                      {formErrors.phone && (
                        <span className="text-xs text-red-400 mt-1 block">{formErrors.phone}</span>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Email Address <span className="text-[#FF1744]">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. creator@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl bg-[#050B14] border ${
                          formErrors.email ? 'border-red-500' : 'border-slate-800'
                        } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition`}
                      />
                      {formErrors.email && (
                        <span className="text-xs text-red-400 mt-1 block">{formErrors.email}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Target Box */}
              <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <YoutubeIcon className="w-5 h-5 text-[#FF1744]" />
                  <span>2. Delivery YouTube Link & Instructions</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      YouTube Channel / Video Link <span className="text-[#FF1744]">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@yourchannel or https://youtube.com/watch?v=..."
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl bg-[#050B14] border ${
                        formErrors.targetUrl ? 'border-red-500' : 'border-slate-800'
                      } text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition`}
                    />
                    {formErrors.targetUrl ? (
                      <span className="text-xs text-red-400 mt-1 block">{formErrors.targetUrl}</span>
                    ) : (
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Never share passwords. We only need your public YouTube URL.
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Additional Notes or Specific Instructions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Preferred pacing curve, target audience niche, thumbnail colors, title references..."
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#FF1744] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Acceptance */}
              <div className="p-6 rounded-3xl bg-[#091120] border border-slate-800 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 rounded text-[#FF1744] focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 leading-relaxed">
                    I understand that TubeBoost operates fully compliant promotional campaigns adhering to YouTube guidelines. I agree to the{' '}
                    <Link href="/terms" target="_blank" className="text-[#FF1744] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/refund-policy" target="_blank" className="text-[#FF1744] hover:underline">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
                {formErrors.agreeTerms && (
                  <span className="text-xs text-red-400 block pl-7">{formErrors.agreeTerms}</span>
                )}
              </div>
            </div>

            {/* Right: Order Snapshot and Action */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#0E1726] border border-slate-800 space-y-6 sticky top-28">
                <h3 className="text-xl font-bold text-white pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Order Items</span>
                  <span className="text-xs text-slate-400">{cart.length} item types</span>
                </h3>

                {/* Line Items Snapshot */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-800/50">
                      <div>
                        <span className="font-bold text-white block line-clamp-1">{item.title}</span>
                        <span className="text-slate-400">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</span>
                      </div>
                      <span className="font-bold text-slate-200">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal</span>
                    <span className="font-bold text-white">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Estimated Tax / Fee</span>
                    <span className="font-bold text-emerald-400">৳0</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
                    <span className="text-base font-bold text-white">Final Total</span>
                    <span className="text-2xl font-black text-white">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-red-500/25 transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying & Submitting Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>Submit & Confirm Order</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-xs text-slate-400 pt-2 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>256-Bit SSL Encrypted & Protected</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

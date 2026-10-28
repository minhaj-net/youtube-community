'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { ServiceItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Star,
  Sparkles,
  Zap,
} from 'lucide-react';

function ServiceDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const { success } = useToast();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      api.getServiceBySlug(slug)
        .then((res) => {
          setService(res);
          setLoading(false);
        })
        .catch(() => {
          setService(null);
          setLoading(false);
        });
    }
  }, [slug]);

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

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The requested service could not be located or has been archived.</p>
          <Link
            href="/services"
            className="px-6 py-3 rounded-xl bg-[#FF1744] text-white font-bold text-sm"
          >
            Back to All Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: service._id,
      itemType: 'service',
      title: service.name,
      slug: service.slug,
      price: service.price,
      image: service.image,
      category: service.category,
      quantity,
    });
    success(`Added ${quantity}x "${service.name}" to your cart`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Services</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Media & Showcase */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                  {service.category}
                </div>
              </div>

              {/* Service Features & Deliverables */}
              <div className="p-8 rounded-3xl bg-[#0B1322] border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">What You Receive in This Package</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {service.deliveryInformation && (
                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Turnaround & Delivery Pipeline
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {service.deliveryInformation}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Pricing Box & Checkout Action */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#0E1726] border-2 border-slate-700/80 shadow-2xl space-y-6 sticky top-28">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF1744] block mb-2">
                    {service.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                    {service.name}
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#060D1A] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Standard Package Price</span>
                    <span className="text-3xl font-black text-white">
                      {service.currency}{service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Revision Guaranteed</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-semibold text-slate-300">Quantity / Assets:</span>
                  <div className="flex items-center border border-slate-700 rounded-xl bg-[#060D1A]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-slate-300 hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-bold text-white min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-1.5 text-slate-300 hover:text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart (৳{(service.price * quantity).toLocaleString()})</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#FF1744]" />
                    <span>Order & Proceed to Checkout</span>
                  </button>
                </div>

                {/* Trust bullets */}
                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dedicated Creator Support on WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Source Files Included (PSD, Premiere, MP4)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ServiceDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" /></div>}>
      <ServiceDetailContent />
    </React.Suspense>
  );
}

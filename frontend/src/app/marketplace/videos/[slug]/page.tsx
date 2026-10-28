'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api } from '@/lib/api';
import { VideoListing } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import {
  ShoppingBag,
  Film,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Play,
  Zap,
  Download,
} from 'lucide-react';

function VideoDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addToCart } = useCart();
  const { success } = useToast();

  const [video, setVideo] = useState<VideoListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.getVideoBySlug(slug).then((res) => {
        setVideo(res);
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

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Video Asset Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">This video asset has been removed or is no longer listed.</p>
          <Link
            href="/marketplace/videos"
            className="px-6 py-3 rounded-xl bg-[#FF1744] text-white font-bold text-sm"
          >
            Back to Video Marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: video._id,
      itemType: 'video',
      title: video.title,
      slug: video.slug,
      price: video.price,
      image: video.image,
      category: video.category,
      quantity: 1,
    });
    success(`Added "${video.title}" to cart`);
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
          <div className="mb-8">
            <Link
              href="/marketplace/videos"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Video Marketplace</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Media & Details */}
            <div className="lg:col-span-7 space-y-8">
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                  {video.category}
                </div>

                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-white">
                  {video.resolution} • {video.duration}
                </div>
              </div>

              {/* Rights and Licensing */}
              <div className="p-8 rounded-3xl bg-[#0B1322] border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-white">Licensing & Rights Included</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {video.rightsIncluded.map((right, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{right}</span>
                    </div>
                  ))}
                </div>

                {video.deliverables && (
                  <div className="pt-6 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Deliverables & File Package
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {video.deliverables}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Box */}
            <div className="lg:col-span-5">
              <div className="p-8 rounded-3xl bg-[#0E1726] border-2 border-slate-700/80 shadow-2xl space-y-6 sticky top-28">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">
                    {video.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
                    {video.title}
                  </h1>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#060D1A] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Commercial License Price</span>
                    <span className="text-3xl font-black text-white">
                      {video.currency}{video.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                    Instant Delivery
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Video Asset to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[#FF1744]" />
                    <span>Buy Now & Download</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Instant High-Speed Google Drive / Cloud Link</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Cleared for YouTube AdSense Monetization</span>
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

export default function VideoDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050B14] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" /></div>}>
      <VideoDetailContent />
    </React.Suspense>
  );
}

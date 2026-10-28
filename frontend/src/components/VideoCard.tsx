'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ShoppingBag, Film, Sparkles, Check, ArrowRight } from 'lucide-react';
import { VideoListing } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface VideoCardProps {
  video: VideoListing;
}

export function VideoCard({ video }: VideoCardProps) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: video._id,
      itemType: 'video',
      title: video.title,
      slug: video.slug,
      price: video.price,
      image: video.image,
      category: video.category,
    });
    success(`Added "${video.title}" to cart`);
  };

  return (
    <div className="group rounded-3xl bg-[#0D1527] border border-slate-800/80 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          <img
            src={video.image}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#FF1744] transition-all">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </div>

          <div className="absolute top-3 left-3 bg-[#050B14]/80 backdrop-blur-md text-slate-200 text-xs px-2.5 py-1 rounded-full border border-white/10 font-medium">
            {video.category}
          </div>

          <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-white">
            {video.resolution || '4K UHD'} • {video.duration || 'Full Master'}
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <Link href={`/marketplace/videos/${video.slug}`}>
            <h4 className="text-lg font-bold text-white group-hover:text-[#FF1744] transition line-clamp-1 mb-2">
              {video.title}
            </h4>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {video.description}
          </p>

          <div className="space-y-1.5 mb-2">
            {video.rightsIncluded.slice(0, 2).map((right, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Commercial Rights
          </span>
          <span className="text-xl font-black text-white">
            {video.currency}{video.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/marketplace/videos/${video.slug}`}
            className="p-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="px-3.5 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20 transition cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

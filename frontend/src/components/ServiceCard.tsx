'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Star, Clock } from 'lucide-react';
import { ServiceItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: service._id,
      itemType: 'service',
      title: service.name,
      slug: service.slug,
      price: service.price,
      image: service.image,
      category: service.category,
    });
    success(`Added "${service.name}" to cart`);
  };

  return (
    <div className="group rounded-3xl bg-white text-slate-900 border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10">
            {service.category}
          </span>
          {service.isFeatured && (
            <span className="bg-[#FF1744] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-300" />
          <span>Fast Turnaround</span>
        </div>
      </div>

      {/* Body content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/services/${service.slug}`} className="block group-hover:text-[#FF1744] transition">
            <h4 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2">
              {service.name}
            </h4>
          </Link>
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {service.features.slice(0, 3).map((feat, i) => (
              <span
                key={i}
                className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
              >
                ✓ {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
              Starting at
            </span>
            <span className="text-xl font-extrabold text-slate-900">
              {service.currency}{service.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/services/${service.slug}`}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition"
              title="View Service Details"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="px-4 py-2.5 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20 transition cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShoppingBag, Zap, Shield, Sparkles } from 'lucide-react';
import { PackageItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface PackageCardProps {
  pkg: PackageItem;
  featured?: boolean;
}

export function PackageCard({ pkg, featured }: PackageCardProps) {
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: pkg._id,
      itemType: 'package',
      title: pkg.name,
      slug: pkg.slug,
      price: pkg.price,
      category: pkg.category,
    });
    success(`Added "${pkg.name}" to cart`);
  };

  const isPopular = featured || pkg.isFeatured;

  return (
    <div
      className={`relative rounded-3xl transition-all duration-300 flex flex-col justify-between ${
        isPopular
          ? 'bg-gradient-to-b from-[#151D2F] to-[#0A101C] border-2 border-[#FF1744] shadow-2xl shadow-red-500/10 scale-100 lg:-translate-y-2'
          : 'bg-[#0B1322] border border-slate-800/80 hover:border-slate-700 hover:shadow-xl'
      } p-6 sm:p-8`}
    >
      {isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF1744] to-[#D50000] text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Most Popular</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {pkg.category}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
            {pkg.quantity.toLocaleString()} Units
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed min-h-[40px]">
          {pkg.description}
        </p>

        <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-800">
          <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {pkg.currency}{pkg.price.toLocaleString()}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ one-time</span>
        </div>

        <ul className="space-y-3 mb-8">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isPopular
                    ? 'bg-[#FF1744]/20 text-[#FF1744]'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-2 flex flex-col gap-3">
        <button
          onClick={handleAddToCart}
          className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition duration-200 cursor-pointer ${
            isPopular
              ? 'bg-[#FF1744] hover:bg-[#E00034] text-white shadow-lg shadow-red-500/30'
              : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>

        <Link
          href={`/packages`}
          className="text-center text-xs font-medium text-slate-400 hover:text-white transition py-1"
        >
          View package specs & guarantee
        </Link>
      </div>
    </div>
  );
}

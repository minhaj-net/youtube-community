'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Eye, CheckCircle2, DollarSign, ShieldCheck, ArrowRight } from 'lucide-react';
import { ChannelListing } from '@/types';

interface ChannelCardProps {
  channel: ChannelListing;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <div className="group rounded-3xl bg-[#0C1424] border border-slate-800/80 hover:border-slate-700 shadow-xl overflow-hidden flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Cover / Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          <img
            src={channel.image}
            alt={channel.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1424] via-transparent to-transparent" />
          
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-[#050B14]/80 backdrop-blur-md text-slate-200 text-xs px-2.5 py-1 rounded-full border border-white/10 font-medium">
              {channel.niche}
            </span>
            {channel.monetized && (
              <span className="bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <DollarSign className="w-3 h-3" />
                Monetized
              </span>
            )}
          </div>

          {channel.verified && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Analytics</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <Link href={`/marketplace/channels/${channel.slug}`}>
            <h4 className="text-lg font-bold text-white group-hover:text-[#FF1744] transition line-clamp-1 mb-2">
              {channel.title}
            </h4>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-5">
            {channel.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#070D18] border border-slate-800/60 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-[#FF1744] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Subscribers</span>
                <span className="text-sm font-bold text-white">{channel.subscribers.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Monthly Views</span>
                <span className="text-sm font-bold text-white">
                  {channel.monthlyViews ? channel.monthlyViews.toLocaleString() : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-800/60">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
            Asking Price
          </span>
          <span className="text-xl font-black text-white">
            {channel.currency}{channel.price.toLocaleString()}
          </span>
        </div>

        <Link
          href={`/marketplace/channels/${channel.slug}`}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-[#FF1744] text-white text-xs font-bold transition shadow-sm group/btn"
        >
          <span>Inspect Channel</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
        </Link>
      </div>
    </div>
  );
}

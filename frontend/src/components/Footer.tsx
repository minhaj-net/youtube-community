'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { api } from '@/lib/api';
import { SiteSettings } from '@/types';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.getSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const phone = settings?.footerPhone || '+880 1700-000000';
  const email = settings?.footerEmail || 'support@ytmarket.com';
  const whatsApp = settings?.whatsAppNumber || '+8801700000000';
  const cleanWaNumber = whatsApp.replace(/[^0-9]/g, '');

  return (
    <footer className="w-full bg-[#03070E] border-t border-slate-800/80 text-slate-400">
      {/* Floating / Direct WhatsApp Callout Banner */}
      <div className="border-b border-slate-800/50 bg-gradient-to-r from-[#0B1424] via-[#0D182B] to-[#0B1424] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Need immediate assistance or custom order?</h4>
              <p className="text-sm text-slate-400">Our senior creator growth consultants respond within minutes on WhatsApp.</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${cleanWaNumber}?text=Hi%20TubeBoost,%20I%20have%20an%20inquiry%20regarding%20your%20services`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20 group"
          >
            <span>Chat on WhatsApp</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-150" />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1744] to-[#B70024] flex items-center justify-center shadow-lg shadow-red-500/20">
                <YoutubeIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Tube<span className="text-[#FF1744]">Boost</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier destination for serious YouTube creators. Compliant audience growth packages, professional video & thumbnail production, and verified channel marketplace.
            </p>
            <div className="flex flex-col gap-2 pt-2 text-sm">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#FF1744]" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#FF1744]" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Creator Services</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/packages" className="hover:text-white transition">Audience Growth Packages</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">All Production Services</Link>
              </li>
              <li>
                <Link href="/services/high-ctr-thumbnail-design" className="hover:text-white transition">Thumbnail Design</Link>
              </li>
              <li>
                <Link href="/services/pro-video-editing" className="hover:text-white transition">Long-form Video Editing</Link>
              </li>
              <li>
                <Link href="/services/shorts-reels-editing-pack" className="hover:text-white transition">Shorts & Reels Editing</Link>
              </li>
              <li>
                <Link href="/services/youtube-seo-optimization" className="hover:text-white transition">YouTube SEO Suite</Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Links */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Marketplace</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/marketplace/channels" className="hover:text-white transition">Monetized Channels</Link>
              </li>
              <li>
                <Link href="/marketplace/videos" className="hover:text-white transition">Turnkey Video Assets</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">About Our Platform</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">FAQ & Help Center</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal & Trust</h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-white transition">Refund & Guarantee</Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white transition">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer and Copyright */}
        <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> TubeBoost is an independent digital services and marketplace provider. TubeBoost is not affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Google LLC, or Alphabet Inc. All YouTube logos, trademarks, and registered trademarks are properties of Google LLC.
          </p>
          <p className="shrink-0">
            &copy; 2026 TubeBoost Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

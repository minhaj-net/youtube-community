'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Layers,
  Video,
  UserCheck,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { SiteSettings } from '@/types';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();
  const { totalCount } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    api.getSiteSettings().then(setSiteSettings).catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages', badge: 'Popular' },
    { name: 'Services', href: '/services' },
    { name: 'Channels', href: '/marketplace/channels' },
    { name: 'Videos', href: '/marketplace/videos' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF1744] to-[#B70024] flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition duration-200">
              <YoutubeIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Tube<span className="text-[#FF1744]">Boost</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400">
                Creator Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'text-white bg-white/10 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.name}
                    {link.badge && (
                      <span className="bg-[#FF1744] text-[10px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Action Area: Cart & Admin */}
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl bg-[#0E1726] border border-slate-800 text-slate-200 hover:text-white hover:border-[#FF1744]/40 transition group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition duration-150" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF1744] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Admin Panel
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded"
              >
                Admin
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-[#0E1726] border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-[#070D18]/95 backdrop-blur-xl px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition ${
                    active
                      ? 'bg-[#FF1744]/10 text-[#FF1744] border border-[#FF1744]/20'
                      : 'text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-[#FF1744] text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0E1726] text-white"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#FF1744]" />
                  Shopping Cart
                </span>
                <span className="bg-[#FF1744] text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCount} items
                </span>
              </Link>
              <Link
                href={isAuthenticated ? '/admin' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-center text-sm font-medium text-slate-400 hover:text-white"
              >
                {isAuthenticated ? 'Admin Dashboard' : 'Admin Portal Login'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserAuth } from '@/context/UserAuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Tv,
  Film,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, isLoading: adminLoading, isAuthenticated: isAdminAuth, logout: adminLogout } = useAuth();
  const { user, isLoading: userLoading, isAuthenticated: isUserAuth, logout: userLogout } = useUserAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAuthChecking = adminLoading || userLoading;
  const isAuthorizedAdmin =
    (isAdminAuth && admin && (admin.role === 'admin' || admin.role === 'superadmin')) ||
    (isUserAuth && user && (user.role === 'admin' || user.role === 'superadmin' || user.isAdmin));

  useEffect(() => {
    if (!isAuthChecking) {
      if (!isAuthorizedAdmin) {
        // If logged in as regular user, redirect to user dashboard
        if (isUserAuth && user && user.role === 'user' && !user.isAdmin) {
          router.replace('/dashboard/user');
        } else {
          // Otherwise redirect to login
          router.replace('/admin/login?redirect=/dashboard/admin');
        }
      }
    }
  }, [isAuthChecking, isAuthorizedAdmin, isUserAuth, user, router]);

  const handleSignOut = async () => {
    await adminLogout();
    await userLogout();
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs">Authenticating Administrator Suite...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return null;
  }

  const menuItems = [
    { name: 'Dashboard Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Catalog Packages', href: '/admin/packages', icon: Package },
    { name: 'Growth Services', href: '/admin/services', icon: Layers },
    { name: 'Marketplace Channels', href: '/admin/channels', icon: Tv },
    { name: 'Marketplace Videos', href: '/admin/videos', icon: Film },
    { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  const adminEmail = admin?.email || user?.email || 'admin@ytmarket.com';
  const adminRole = admin?.role || user?.role || 'superadmin';

  return (
    <div className="min-h-screen flex bg-[#050B14] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#091120] border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800">
          <Link href="/dashboard/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF1744] to-[#B70024] flex items-center justify-center shadow-md">
              <YoutubeIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white tracking-tight">TubeBoost</span>
              <span className="text-[10px] uppercase font-bold text-[#FF1744] tracking-widest">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition ${
                  active
                    ? 'bg-[#FF1744] text-white shadow-lg shadow-red-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#050B14] text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <span>Live Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-[#091120]/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Admin Control Center
              </h2>
              <span className="text-[10px] text-slate-400 block -mt-0.5">
                Restricted System Management Interface
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-white block">{adminEmail}</span>
              <span className="text-[10px] text-emerald-400 font-mono uppercase">
                {adminRole}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              <ShieldCheck className="w-4 h-4 text-[#FF1744]" />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-[#091120] border-r border-slate-800 flex flex-col h-full z-10 p-4 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-bold text-white text-sm">Admin Navigation</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-slate-400 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1">
                {menuItems.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold ${
                        active ? 'bg-[#FF1744] text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}


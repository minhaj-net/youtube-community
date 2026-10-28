'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('admin@ytmarket.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email.trim(), password);
      toastSuccess('Authenticated successfully. Welcome back!');
      router.push('/admin');
    } catch (err: any) {
      toastError(err?.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF1744] to-[#B70024] flex items-center justify-center mx-auto shadow-lg shadow-red-500/20 text-white">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-400">
              Authorized management access for TubeBoost platform administrators.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 shadow-2xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@ytmarket.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer disabled:bg-slate-700"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Authenticate & Access Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Test Credentials Helper Box */}
            <div className="p-3.5 rounded-2xl bg-[#060D1A] border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="text-slate-300 font-semibold block">Demo Admin Credentials:</span>
              <div>Email: <strong className="text-white">admin@ytmarket.com</strong></div>
              <div>Password: <strong className="text-white">admin123</strong></div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Public Marketplace
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

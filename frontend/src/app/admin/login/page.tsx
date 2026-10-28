'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons/YoutubeIcon';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { error: toastError, success: toastSuccess } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated as admin, go straight to /admin
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toastError('Please enter both your admin email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toastSuccess('Administrator authenticated successfully. Welcome to TubeBoost Console!');
      router.replace('/admin');
    } catch (err: any) {
      toastError(err?.message || 'Invalid administrator credentials. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#040810] px-4 sm:px-6 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand & Security Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF1744] to-[#8A0019] text-white shadow-xl shadow-red-500/25 mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              TubeBoost Admin Console
            </h1>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                <ShieldAlert className="w-3 h-3" />
                Restricted System Access
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Authentication required. Only authorized administrators may access this portal.
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="p-8 rounded-3xl bg-[#091122] border border-slate-800/90 shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Admin Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ytmarket.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744] transition"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744] transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Authenticate Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-[#060A14] border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All login attempts are rate-limited, logged, and monitored. Stored securely via environment-based credentials.
            </span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Return to TubeBoost Marketplace
          </Link>
        </div>

      </div>
    </div>
  );
}


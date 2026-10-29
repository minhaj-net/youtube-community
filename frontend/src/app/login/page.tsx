'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useUserAuth } from '@/context/UserAuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  User,
  Phone,
  Sparkles,
  UserPlus,
  LogIn,
  CheckCircle2,
} from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirectUrl = searchParams.get('redirect');
  const redirectUrl = rawRedirectUrl && rawRedirectUrl !== '/dashboard' ? rawRedirectUrl : null;
  const modeParam = searchParams.get('mode');
  const isLoggedOut = searchParams.get('logged_out') === 'true';

  const {
    login: userLogin,
    register: userRegister,
    isAuthenticated: isUserAuth,
    user,
  } = useUserAuth();

  const { error: toastError, success: toastSuccess } = useToast();

  // Mode: 'login' | 'register' (Admin is completely removed from public UI)
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync tab with URL query parameter
  useEffect(() => {
    if (modeParam === 'register') {
      setActiveTab('register');
    } else if (modeParam === 'login') {
      setActiveTab('login');
    }
  }, [modeParam]);

  // Redirect if already authenticated
  useEffect(() => {
      if (isUserAuth && user) {
        if (user.role === 'admin' || user.role === 'superadmin' || user.isAdmin) {
          router.replace('/dashboard/admin');
        } else {
          router.replace(redirectUrl || '/dashboard/user');
        }
      }
}, [isUserAuth, user, router, redirectUrl]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (activeTab === 'register') {
      if (!name.trim()) throw new Error('Please enter your full name.');
      if (!email.trim()) throw new Error('Please enter a valid email address.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');

      await userRegister(name.trim(), email.trim(), phone.trim(), password);
      toastSuccess('Account created successfully! Welcome to TubeBoost.');
      router.replace('/dashboard/user');
    } else {
      const result = await userLogin(email.trim(), password);
      if (
        result?.isAdmin ||
        result?.role === 'superadmin' ||
          result?.role === 'admin'
        ) {
  toastSuccess('Administrator authenticated successfully. Welcome to Admin Suite!');
  window.location.replace('/dashboard/admin');
} else {
  toastSuccess('Signed in successfully. Welcome back!');
  router.replace(redirectUrl || '/dashboard/user');
}
      }
    } catch (err: any) {
  toastError(err?.message || 'Authentication failed. Please check your credentials.');
} finally {
  setLoading(false);
}
  };

const setDemoUser = () => {
  setActiveTab('login');
  setEmail('tanvir@gmail.com');
  setPassword('user123');
};

return (
  <div className="min-h-screen flex flex-col bg-[#050B14]">
    <Navbar />

    <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF1744] to-[#B70024] flex items-center justify-center mx-auto shadow-lg shadow-red-500/20 text-white">
            {activeTab === 'register' ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeTab === 'register' ? 'Create Creator Account' : 'Sign In to Your Account'}
          </h1>
          <p className="text-xs text-slate-400">
            {activeTab === 'register'
              ? 'Join TubeBoost to manage your orders, track growth campaigns, and access services.'
              : 'Access your personal order history, project deliverables, and delivery status.'}
          </p>
        </div>

        {/* Logged Out Alert Banner */}
        {isLoggedOut && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 shadow-lg">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>You have signed out successfully. Please log in again to continue.</span>
          </div>
        )}

        {/* Tab Switcher: Only Sign In and Sign Up (Admin completely hidden) */}
        <div className="p-1 rounded-2xl bg-[#091122] border border-slate-800 flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'login'
                ? 'bg-[#FF1744] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${activeTab === 'register'
                ? 'bg-[#FF1744] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name (Registration only) */}
            {activeTab === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                />
              </div>
            </div>

            {/* Phone (Registration only) */}
            {activeTab === 'register' && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Phone / WhatsApp Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050B14] border border-slate-800 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-[#FF1744]"
                  />
                </div>
              </div>
            )}

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition cursor-pointer disabled:bg-slate-700"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {activeTab === 'register' ? 'Create Account & Continue' : 'Sign In to Dashboard'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper Box (Only for User) */}
          <div className="p-3.5 rounded-2xl bg-[#060D1A] border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Demo User:</span>
            <button
              type="button"
              onClick={setDemoUser}
              className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition cursor-pointer text-xs font-semibold"
            >
              Fill (tanvir@gmail.com)
            </button>
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

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}

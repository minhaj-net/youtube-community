'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShieldCheck, Target, Users, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full inline-block">
              About TubeBoost
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Empowering YouTube Creators with Legitimate Growth & Production
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Founded by veteran YouTube content strategists, TubeBoost was created to bridge the gap between creative creators and algorithmic reach.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-[#FF1744] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To provide safe, policy-compliant promotional syndication and professional production services that empower independent creators to achieve monetization and build sustainable digital businesses.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Strict Compliance Standard</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe in longevity. Unlike fraudulent bot services, all of our syndication campaigns utilize compliant content discovery networks that preserve account reputation and channel health.
              </p>
            </div>
          </div>

          {/* Why We Are Different */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#091120] border border-slate-800 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-black text-white text-center">
              The TubeBoost Difference
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Algorithm-Tuned
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our thumbnail designers and video editors follow high-retention editing pacing to satisfy YouTube’s recommendation signals.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified Escrow
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Channel marketplace transfers are safeguarded with full seller verification and YouTube Studio primary ownership transition guidance.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Direct 24/7 Support
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  No automated chatbots. You connect directly with real YouTube consultants via WhatsApp whenever you have a question.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

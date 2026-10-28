'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3 py-1 rounded-full inline-block mb-3">
              Legal
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-slate-400">Effective Date: October 2026</p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Service Description</h2>
              <p>
                TubeBoost provides compliant YouTube audience promotion services, creative production (graphic design, video editing, SEO optimization), and verified digital asset marketplace listings. By placing an order, you agree to comply with these terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Policy Compliance Standards</h2>
              <p>
                We do not sell artificial bots, automated click farms, or deceptive metrics. All campaigns are targeted syndication campaigns intended to stimulate real discovery. You agree not to submit channels featuring prohibited, defamatory, or illegal content.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Channel Marketplace Escrow & Ownership Disclaimers</h2>
              <p>
                TubeBoost does not guarantee automatic channel ownership transfer. Transfer of channel ownership must strictly occur according to YouTube’s official primary owner delegation protocol (requiring a 7-day YouTube Studio brand account grace period). TubeBoost acts as an escrow facilitator.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Order Fulfillment & Pacing</h2>
              <p>
                Delivery schedules commence upon verification of the target URL and payment. Delivery is paced deliberately to safeguard retention metrics and comply with natural velocity curves.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Independent Entity Disclaimer</h2>
              <p>
                TubeBoost is an independent digital services firm. TubeBoost is not affiliated, sponsored, authorized, or endorsed by YouTube or Google LLC. YouTube and the YouTube logo are trademarks of Google LLC.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

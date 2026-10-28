'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3 py-1 rounded-full inline-block mb-3">
              Guarantees
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-slate-400">Clear, transparent customer protection</p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Non-Fulfillment Guarantee</h2>
              <p>
                If TubeBoost is unable to commence delivery of your purchased audience growth package within 48 hours of payment verification, you are entitled to a full 100% refund, no questions asked.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Creator Production Services (Thumbnails & Video Editing)</h2>
              <p>
                Because creative services involve dedicated human labor, completed digital deliverables are non-refundable. However, we include unlimited revisions for thumbnail designs and 2 revision rounds for video editing to ensure your creative requirements are fully satisfied.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Channel Marketplace Escrow Protection</h2>
              <p>
                In channel acquisition transactions, funds remain in escrow. If the seller fails to initiate or complete the Primary Ownership transfer under YouTube guidelines within the stipulated window, the buyer receives a 100% refund immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. Refund Request Procedure</h2>
              <p>
                To request a refund, please send your Order Number and payment reference to <span className="text-white font-semibold">support@ytmarket.com</span> or contact our WhatsApp support desk directly.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

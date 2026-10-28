'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
              <p>
                When you place an order or contact us through TubeBoost, we collect necessary guest checkout details such as your full name, email address, WhatsApp/phone number, and the public YouTube URL required to fulfill your promotional campaign or production service.
              </p>
              <p className="text-white font-medium">
                We NEVER ask for, collect, or store your Google account password, channel login credentials, or sensitive authentication cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Processing, fulfilling, and delivering creator service packages.</li>
                <li>Communicating order status updates and delivery verification via WhatsApp or email.</li>
                <li>Preventing fraudulent orders and maintaining platform security.</li>
                <li>Fulfilling statutory accounting and legal compliance obligations.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Data Sharing & Third Parties</h2>
              <p>
                We do not sell, rent, or trade your personal information to third parties. Information is only shared with trusted service providers essential to completing your order (such as payment processing communication) under strict confidentiality agreements.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">4. YouTube Independent Disclaimer</h2>
              <p>
                TubeBoost is an independent platform and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with YouTube, Google LLC, or Alphabet Inc.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">5. Contact Regarding Privacy</h2>
              <p>
                If you have questions about our data handling, please contact our Data Protection Team at <span className="text-white font-semibold">support@ytmarket.com</span>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

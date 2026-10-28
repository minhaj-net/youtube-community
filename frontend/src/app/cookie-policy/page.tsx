'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CookiePolicyPage() {
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
              Cookie Policy
            </h1>
            <p className="text-xs text-slate-400">Effective Date: October 2026</p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-[#0C1527] border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">1. What Are Cookies?</h2>
              <p>
                Cookies are compact text files stored on your browser or device when you browse websites. They enable websites to remember user preferences and maintain shopping cart sessions across page reloads.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">2. Cookies We Use</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-400">
                <li>
                  <strong className="text-white">Essential Shopping Cart Cookies:</strong> Used by your browser to preserve items placed in your shopping cart without requiring user registration.
                </li>
                <li>
                  <strong className="text-white">Session Security Tokens:</strong> Retained securely during admin sessions to verify authorized administrative requests.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-white">3. Managing Cookie Preferences</h2>
              <p>
                You can configure your browser to block or alert you about cookies. Note that disabling essential cookies may prevent items from persisting in your cart during checkout.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

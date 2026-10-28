'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      category: 'Audience Growth & Compliance',
      items: [
        {
          q: 'Does TubeBoost use bots, fake accounts, or click-farms?',
          a: 'No. TubeBoost strictly prohibits fake bot engagement. Our promotional syndication relies on real viewer traffic, social syndication networks, suggested video discovery campaigns, and niche-specific creator feeds.',
        },
        {
          q: 'Will my channel get banned or receive a strike?',
          a: 'No. Because our syndication complies with YouTube Community Guidelines and uses organic pacing, channels experience zero strikes or suspension risk. We have scaled over 2,400+ channels safely.',
        },
        {
          q: 'Do you need my YouTube account password or Google login?',
          a: 'Never. We will never ask for your Google account credentials, 2-step verification codes, or channel password. All campaigns are executed using only your public channel or video URL.',
        },
      ],
    },
    {
      category: 'Delivery, Turnaround & Pacing',
      items: [
        {
          q: 'How fast does order delivery start after checkout?',
          a: 'Audience growth packages typically launch within 2 to 4 hours after order verification. Deliveries are paced over 24 to 72 hours (or longer for large 5,000+ unit packages) to ensure steady, natural growth curves.',
        },
        {
          q: 'What is the turnaround time for thumbnails and video editing?',
          a: 'Custom thumbnail designs are delivered within 24 hours. Video editing projects (long-form or shorts packages) are completed within 48 to 72 hours, with unlimited draft revisions.',
        },
      ],
    },
    {
      category: 'Marketplace & Payments',
      items: [
        {
          q: 'How does channel transfer work on the marketplace?',
          a: 'We manage verified escrow. The seller designates the buyer as the Primary Owner through YouTube Studio Brand Account permissions. The transaction funds are released only when the buyer verifies full ownership.',
        },
        {
          q: 'What payment methods are supported?',
          a: 'We accept bKash, Nagad, Rocket, Bank Transfer, and secure digital invoices. Guest checkout is enabled for all purchases.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF1744] bg-[#FF1744]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Help Center & FAQs
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-base text-slate-400">
              Clear answers regarding our promotional compliance, delivery mechanics, and marketplace standards.
            </p>
          </div>

          <div className="space-y-12">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                  <span className="text-[#FF1744]">#</span> {cat.category}
                </h3>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const uniqueIdx = catIdx * 10 + itemIdx;
                    const isOpen = openIndex === uniqueIdx;

                    return (
                      <div
                        key={itemIdx}
                        className="rounded-2xl bg-[#0C1527] border border-slate-800 overflow-hidden transition"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : uniqueIdx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30"
                        >
                          <span className="text-sm sm:text-base font-bold text-white">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                              isOpen ? 'rotate-180 text-[#FF1744]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-[#091120] border border-slate-800 text-center space-y-4">
            <h4 className="text-lg font-bold text-white">Still have questions?</h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Our growth strategists are available on WhatsApp to answer your specific channel queries.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-xs shadow-md transition"
            >
              <span>Contact Support Specialist</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

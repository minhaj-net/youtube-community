'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalCount, subtotal, isCartLoaded } = useCart();

  if (!isCartLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050B14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#FF1744] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-[#FF1744]" />
              <span>Your Shopping Cart</span>
              <span className="text-sm font-semibold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                {totalCount} {totalCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-24 px-6 rounded-3xl bg-[#091120] border border-slate-800 max-w-2xl mx-auto space-y-6">
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your cart is currently empty</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Explore our compliant subscriber growth packages, high-CTR thumbnail designs, or turnkey video assets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/packages"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm shadow-md transition"
                >
                  Browse Growth Packages
                </Link>
                <Link
                  href="/services"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition"
                >
                  Browse Services
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Item List */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => {
                  const isUnitRestricted = item.itemType === 'channel';
                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 rounded-3xl bg-[#0C1527] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700/80 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-slate-700 flex items-center justify-center text-[#FF1744] shrink-0 font-bold">
                            <Package className="w-8 h-8" />
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF1744] bg-[#FF1744]/10 px-2 py-0.5 rounded-full inline-block mb-1">
                            {item.category || item.itemType}
                          </span>
                          <h4 className="text-base font-bold text-white line-clamp-1">
                            {item.title}
                          </h4>
                          <span className="text-sm font-semibold text-slate-300">
                            ৳{item.price.toLocaleString()} each
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Subtotal Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        {isUnitRestricted ? (
                          <span className="text-xs text-slate-400 italic">Qty: 1</span>
                        ) : (
                          <div className="flex items-center border border-slate-700 rounded-xl bg-[#070D18]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-slate-300 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-sm font-bold text-white min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-slate-300 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="text-right min-w-[90px]">
                          <span className="text-lg font-black text-white block">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-4 flex justify-between items-center text-sm">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Continue shopping</span>
                  </Link>
                </div>
              </div>

              {/* Order Summary & Checkout Card */}
              <div className="lg:col-span-4">
                <div className="p-8 rounded-3xl bg-[#0E1726] border border-slate-800 space-y-6 sticky top-28">
                  <h3 className="text-xl font-bold text-white pb-4 border-b border-slate-800">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-white">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Service Delivery Fee</span>
                      <span className="font-bold text-emerald-400">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Platform Compliance Guarantee</span>
                      <span className="font-bold text-emerald-400">Included</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-2xl font-black text-white">
                      ৳{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 rounded-2xl bg-[#FF1744] hover:bg-[#E00034] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-150" />
                  </Link>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Guest Checkout • No Login Needed</span>
                    </div>
                    <p className="leading-relaxed">
                      Server-side price verification automatically applies at final order submission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

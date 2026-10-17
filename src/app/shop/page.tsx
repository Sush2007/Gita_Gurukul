"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Minus, Plus, Truck, Clock, CheckCircle } from "lucide-react";

export default function Shop() {
  const [quantity, setQuantity] = useState(1);
  const [settings, setSettings] = useState({
    price: 799,
    original_price: 999,
    in_stock: true,
    stock_badge: "In Stock",
    dispatch_time: "24-48 hours",
    dispatch_days: "Mon - Sat",
    cutoff_time: "2:00 PM",
  });

  const { user, profile, openLoginModal, initRazorpay } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(() => {});
  }, []);

  const PRICE_PER_ITEM = Number(settings.price) || 799;
  const totalPrice = quantity * PRICE_PER_ITEM;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const handleCheckout = () => {
    if (!settings.in_stock) return;

    const data = { 
      amount: totalPrice, 
      items: quantity + "x Bhagavad Gita Diary",
      quantity: quantity 
    };
    if (!user) {
      openLoginModal("CHECKOUT", data);
    } else if (!profile?.address || !profile?.pincode) {
      openLoginModal("CHECKOUT", data); 
    } else {
      initRazorpay(data, profile);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <div className="max-w-[1280px] w-full mx-auto pt-8 md:pt-12 lg:pt-14 pb-16 px-4 sm:px-6 lg:px-[60px]">
        {/* Page Opening Header */}
        <div className="flex flex-col gap-3 mb-10 lg:mb-14 text-center lg:text-left items-center lg:items-start animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-semibold tracking-wide shadow-xs">
            <span>✨</span>
            <span>Sacred Vedic Collection • 2026 Edition</span>
          </div>
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl tracking-tight text-brand-dark">
            Curated Editions
          </h1>
          <p className="font-body text-base sm:text-lg text-gray-700 max-w-2xl leading-relaxed">
            Discover our collection of beautifully bound Bhagavad Gita diaries, designed for reflection, daily focus, and spiritual poise.
          </p>
        </div>
      
        <div className="w-full">
          {/* Main Product Area */}
          <main className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Product Image Card */}
            <div className="w-full lg:w-[480px] flex-shrink-0 relative bg-[#FAF7F2] p-6 sm:p-8 lg:p-12 rounded-3xl border border-brand-primary/20 shadow-[0_8px_32px_rgba(17,33,19,0.04),0_1px_3px_rgba(17,33,19,0.02)] flex flex-col items-center justify-center group">
              <div className="absolute top-4 left-4 bg-white border border-brand-primary/30 text-brand-dark text-xs font-medium px-3 py-1 rounded-full shadow-xs">
                🌿 Hand-bound Sacred Edition
              </div>
              <Image 
                src="/images/screenshot_from_2026_07_12_18_39_10_1.png" 
                alt="Gita Gurukul Diary" 
                width={420} 
                height={420} 
                className="w-full max-w-[280px] sm:max-w-[340px] h-auto object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                priority
              />
            </div>
            
            {/* Product Configuration & Checkout */}
            <div className="w-full lg:flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
              <div className="space-y-3">
                <div className="flex items-center justify-center lg:justify-start gap-2.5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border shadow-xs ${
                    settings.in_stock 
                      ? "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]" 
                      : "bg-red-50 text-red-900 border-red-200"
                  }`}>
                    {settings.in_stock && <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>}
                    {settings.stock_badge || (settings.in_stock ? "In Stock" : "Out of Stock")}
                  </span>
                  <span className="text-gray-400 font-bold">•</span>
                  <span className="text-xs font-medium text-gray-700">27 Sacred Shlokas</span>
                </div>

                <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-[44px] leading-tight text-brand-dark">
                  Gita Gurukul Diary
                </h2>
                <p className="font-body text-base sm:text-lg text-gray-700 max-w-xl leading-relaxed">
                  A perfect companion for daily reflection. Features 27 handpicked shlokas carefully curated to bring calmness, focus, and purposeful habit-building.
                </p>
              </div>
              
              {/* Quantity Selector */}
              <div className="flex flex-col gap-2 mt-1 items-center lg:items-start">
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Select Quantity</span>
                <div className="flex items-center gap-5 bg-white border border-gray-300 rounded-2xl p-1.5 px-4 shadow-xs">
                  <button 
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || !settings.in_stock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-dark hover:bg-gray-100 disabled:opacity-30 transition-all cursor-pointer font-bold"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-display font-medium text-2xl w-8 text-center text-brand-dark">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    disabled={quantity >= 10 || !settings.in_stock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-brand-dark hover:bg-gray-100 disabled:opacity-30 transition-all cursor-pointer font-bold"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Pricing & Checkout Card */}
              <div className="pt-6 border-t border-brand-primary/15 w-full max-w-lg flex flex-col gap-5 items-center lg:items-start">
                <div className="flex items-baseline gap-3">
                  <span className="text-gray-700 font-semibold text-sm uppercase tracking-wider">Total:</span>
                  <span className="font-display font-bold text-4xl text-brand-primary">
                    ₹{totalPrice}
                  </span>
                  {Number(settings.original_price) > PRICE_PER_ITEM && (
                    <>
                      <span className="text-gray-500 line-through font-display text-xl font-medium">
                        ₹{Number(settings.original_price) * quantity}
                      </span>
                      <span className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {Math.round(((Number(settings.original_price) - PRICE_PER_ITEM) / Number(settings.original_price)) * 100)}% SAVINGS
                      </span>
                    </>
                  )}
                </div>

                {/* Pickup & Ready Days Schedule Notice */}
                <div className="flex flex-col gap-2 p-4 bg-[#FAF7F2] rounded-2xl border border-brand-primary/25 w-full text-xs shadow-xs text-left">
                  <div className="flex items-center gap-2.5 text-brand-dark font-medium">
                    <div className="w-7 h-7 rounded-lg bg-brand-primary/15 text-brand-primary flex items-center justify-center flex-shrink-0">
                      <Truck size={15} />
                    </div>
                    <span>
                      Ready for Dispatch: <strong className="text-brand-dark font-semibold">{settings.dispatch_days || "Mon - Sat"}</strong> ({settings.dispatch_time || "24-48 hours"})
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 pl-0 sm:pl-9.5 text-xs font-normal">
                    <Clock size={13} className="text-brand-primary flex-shrink-0 mt-0.5" />
                    <span>Orders placed before <strong className="text-brand-dark font-semibold">{settings.cutoff_time || "2:00 PM"}</strong> are prepped for same-day dispatch.</span>
                  </div>
                </div>
                
                {/* Primary CTA Button */}
                {settings.in_stock ? (
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-brand-primary hover:bg-[#c57929] text-white font-button font-bold text-lg py-4 px-8 rounded-2xl shadow-[0_8px_24px_rgba(217,138,54,0.35)] hover:shadow-[0_12px_32px_rgba(217,138,54,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ) : (
                  <button 
                    disabled
                    className="w-full bg-gray-200 text-gray-500 font-button font-bold text-lg py-4 px-8 rounded-2xl cursor-not-allowed"
                  >
                    Temporarily Out of Stock
                  </button>
                )}

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-medium text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={15} className="text-emerald-700" /> 100% Genuine Print
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={15} className="text-emerald-700" /> Razorpay Verified
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={15} className="text-emerald-700" /> Pan-India Express
                  </span>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


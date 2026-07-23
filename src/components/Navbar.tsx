"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="w-full bg-brand-dark shadow-md fixed top-0 z-50">
      <nav className="max-w-[1280px] mx-auto h-[85px] flex justify-between items-center px-6 lg:px-[60px]">
        
        {/* Standardized Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center">
          <Image
            src="/images/sss_adjusted_1.png"
            alt="Gita Gurukul Logo"
            width={240}
            height={110}
            className="w-[140px] md:w-[160px] lg:w-[200px] h-auto object-contain"
          />
        </Link>
        
        {/* Navigation Links and Button */}
        <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/shop" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors">
              About
            </Link>
          </div>
          
          {/* Desktop/Tablet Donate Button */}
          <Link href="/donate" className="hidden sm:block">
            <button 
              type="button" 
              className="bg-brand-primary text-white font-button font-bold text-lg px-6 md:px-10 py-3 rounded-md shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all"
            >
              Donate
            </button>
          </Link>

          {/* Mobile Hamburger Icon */}
          <button 
            className="md:hidden text-white hover:text-brand-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-tan/10 w-full absolute top-[85px] left-0 shadow-lg flex flex-col px-6 py-8 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <Link 
            href="/shop" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center"
          >
            Shop
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center"
          >
            About
          </Link>
          <Link 
            href="/donate" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="sm:hidden w-full mt-2"
          >
            <button 
              type="button" 
              className="w-full bg-brand-primary text-white font-button font-bold text-xl px-6 py-4 rounded-md shadow-md hover:bg-opacity-90 transition-all"
            >
              Donate Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

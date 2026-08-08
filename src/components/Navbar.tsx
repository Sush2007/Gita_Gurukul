"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    if (user) {
      router.push("/profile");
    } else {
      openLoginModal("PROFILE");
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full shadow-md fixed top-0 z-50 flex flex-col">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#faf7f2] text-brand-dark py-2 px-6 flex justify-center items-center gap-2 border-b border-brand-tan/20">
        <div className="flex items-center gap-2 text-brand-dark/80">
          <a href="https://wa.me/919599850400?text=Hi" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          <span className="text-[10px] md:text-xs font-bold tracking-wider mx-0.5 opacity-60">OR</span>
          <a href="tel:+919599850400" className="hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
        </div>
        <span className="font-body text-xs md:text-sm font-semibold tracking-wide">+91 95998 50400</span>
      </div>

      <div className="w-full bg-brand-dark">
        <nav className="w-full max-w-[1280px] mx-auto h-[85px] flex justify-between items-center px-6 lg:px-[60px]">
        
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
        <div className="flex items-center gap-4 md:gap-10">
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors cursor-pointer">
              Home
            </Link>
            <Link href="/shop" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors cursor-pointer">
              Shop
            </Link>
            <Link href="/about" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors cursor-pointer">
              About
            </Link>
          </div>
          
          {/* Desktop/Tablet Donate Button */}
          <Link href="/donate" className="hidden sm:block">
            <button 
              type="button" 
              className="bg-brand-primary text-white border-none font-button font-bold text-lg px-6 md:px-10 py-3 rounded-md shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all cursor-pointer"
            >
              Donate
            </button>
          </Link>

          {/* User Profile Icon */}
          <button 
            onClick={handleProfileClick}
            className="hidden md:flex text-white hover:text-brand-primary transition-colors ml-2"
            aria-label="User Profile"
          >
            <CircleUser strokeWidth={2} size={32} />
          </button>

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
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-brand-tan/10 w-full absolute top-full left-0 shadow-lg flex flex-col px-6 py-8 gap-6 animate-in slide-in-from-top-2 fade-in duration-200">
          <Link 
            href="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center cursor-pointer"
          >
            Home
          </Link>
          <Link 
            href="/shop" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center cursor-pointer"
          >
            Shop
          </Link>
          <Link 
            href="/about" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center cursor-pointer"
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
              className="w-full bg-brand-primary text-white font-button font-bold text-xl px-6 py-4 rounded-md shadow-md hover:bg-opacity-90 transition-all cursor-pointer"
            >
              Donate Now
            </button>
          </Link>
          <button 
            onClick={handleProfileClick}
            className="text-white font-nav font-bold text-xl hover:text-brand-primary transition-colors text-center w-full py-2 border border-brand-tan/20 rounded-md"
          >
            {user ? "My Profile" : "Login / Register"}
          </button>
        </div>
      )}
    </div>
  );
}

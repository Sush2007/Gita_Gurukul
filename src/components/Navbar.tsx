import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
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
            className="w-[160px] lg:w-[200px] h-auto object-contain"
          />
        </Link>
        
        {/* Navigation Links and Button */}
        <div className="flex items-center gap-8 lg:gap-12">
          <div className="hidden md:flex items-center gap-10">
            <Link href="/shop" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-white font-nav font-bold text-lg hover:text-brand-primary transition-colors">
              About
            </Link>
          </div>
          
          <Link href="/donate">
            <button 
              type="button" 
              className="bg-brand-primary text-white font-button font-bold text-lg px-10 py-3 rounded-md shadow-md hover:bg-opacity-90 hover:shadow-lg transition-all"
            >
              Donate
            </button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

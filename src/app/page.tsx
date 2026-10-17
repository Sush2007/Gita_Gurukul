import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="bg-[#FDFBF7]">
      <div className="max-w-[1280px] w-full mx-auto relative px-4 sm:px-6 lg:px-[60px]">
        
        {/* HERO SECTION */}
        <AnimatedSection className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 pt-8 md:pt-12 lg:pt-16 pb-16 lg:pb-24">
          
          {/* Hero Left Content */}
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start animate-in fade-in duration-500">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-semibold tracking-wide shadow-xs">
              <span>✨</span>
              <span>Eternal Vedic Wisdom • Guided Daily Journal</span>
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[62px] leading-[1.12] tracking-tight text-brand-dark">
              A diary worth the success
            </h1>
            <p className="font-body text-base sm:text-lg leading-relaxed text-gray-700 max-w-2xl">
              Discover the transformative power of ancient Vedic wisdom. This Bhagavad Gita diary contains 27 handpicked shlokas carefully curated to guide your daily reflection and spiritual growth. As you engage with these profound teachings, your mind grows steadier, calmer, and more focused. A perfect companion for anyone seeking mindfulness, inner peace, and a deeper connection to Krishna consciousness in the modern world.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link 
                href="/shop"
                className="bg-brand-primary hover:bg-[#c57929] text-white font-button font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-[0_8px_24px_rgba(217,138,54,0.35)] hover:shadow-[0_12px_32px_rgba(217,138,54,0.45)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer" 
              >
                <span>Order Your Diary</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>

              <Link 
                href="/about"
                className="bg-white hover:bg-gray-50 border border-brand-primary/30 text-brand-dark font-button font-semibold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-xs hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer" 
              >
                <span>Our Sacred Story</span>
              </Link>
            </div>
          </div>
          
          {/* Hero Right Image */}
          <div className="w-full max-w-[360px] lg:max-w-none lg:w-[440px] flex-shrink-0 flex justify-center lg:justify-end">
            <div className="relative w-full bg-[#FAF7F2] p-6 sm:p-8 lg:p-12 rounded-3xl border border-brand-primary/20 shadow-[0_12px_40px_rgba(17,33,19,0.06),0_1px_3px_rgba(17,33,19,0.02)] flex items-center justify-center group">
              <Image 
                src="/images/screenshot_from_2026_07_12_18_39_10_1.png" 
                alt="Bhagavad Gita Diary" 
                width={420} 
                height={420} 
                className="w-full h-auto object-contain drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                priority
              />
            </div>
          </div>
        </AnimatedSection>

        {/* MISSION TEASER SECTION */}
        <AnimatedSection className="flex flex-col items-center py-8 lg:py-14">
          <div className="w-full bg-brand-dark border border-brand-primary/30 shadow-[0_16px_48px_rgba(0,0,0,0.15)] rounded-3xl flex flex-col items-center py-10 sm:py-12 px-5 sm:px-8 lg:px-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-90"></div>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center mb-6 border border-brand-primary/20">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6h8l-6.4 4.8 2.4 7.6-6.4-4.8-6.4 4.8 2.4-7.6-6.4-4.8h8z" /></svg>
            </div>
            <h2 className="font-display font-medium text-3xl lg:text-[42px] leading-[1.2] tracking-tight text-white mb-6 max-w-3xl">
              Why Thousands Begin Their Day With the Gita
            </h2>
            <p className="font-body text-base sm:text-lg leading-relaxed text-brand-tan/90 max-w-3xl">
              The teachings of the Bhagavad Gita aren't just meant to be read—they are meant to be lived.<br className="hidden md:inline" />
              Our unique spiritual journal transforms timeless Hindu philosophy and ancient Vedic wisdom into practical daily exercises. This guided reflection process helps you build better habits, strengthen your mindset, and cultivate deep inner peace.
            </p>
          </div>
        </AnimatedSection>

        {/* ABOUT SECTION */}
        <AnimatedSection className="flex flex-col-reverse lg:flex-row items-center lg:items-center gap-12 lg:gap-16 py-10 lg:py-16">
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-semibold tracking-wide shadow-xs">
              <span>🌿</span>
              <span>Our Roots &amp; Lineage</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-brand-dark">About Us</h2>
            <p className="font-body text-base sm:text-lg leading-relaxed text-gray-700">
              Gita Gurukul was created to help you build a life of calmness, focus, success, and devotion. Founder Papiya Ranabijayini Samal spent seven years studying the Gita in depth, and from its 700+ verses, selected the 27 that offer the clearest path to mastering calmness and achieving greatness in life.
            </p>
            <Link 
              href="/about" 
              className="bg-brand-primary hover:bg-[#c57929] text-white font-button font-bold text-base px-8 py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(217,138,54,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-2 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Our Story</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
          
          <div className="w-full max-w-[380px] lg:max-w-none mx-auto lg:w-[460px] flex-shrink-0 relative rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(17,33,19,0.08)] border border-brand-primary/15 group">
            <Image 
              src="/images/oleg_churakov_akr89i3xf94_unsplash_1.png" 
              alt="About Us" 
              width={460} 
              height={320} 
              className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>
        </AnimatedSection>

        {/* DONATION SECTION */}
        <AnimatedSection className="flex flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-16 py-10 lg:py-16">
          <div className="w-full max-w-[380px] lg:max-w-none mx-auto lg:w-[460px] flex-shrink-0 relative rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(17,33,19,0.08)] border border-brand-primary/15 group">
            <Image 
              src="/images/manojkumar_bathala_jqfrgnf7cqo_unsplash_1.png" 
              alt="Donation" 
              width={460} 
              height={320} 
              className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>
          
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-semibold tracking-wide shadow-xs">
              <span>🪷</span>
              <span>Seva &amp; Philanthropy</span>
            </div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-brand-dark">
              Support Our Mission
            </h2>
            <p className="font-body text-base sm:text-lg leading-relaxed text-gray-700">
              Gita Gurukul is dedicated to spreading the timeless wisdom of the Bhagavad Gita. Through your contributions and journal purchases, you directly support spiritual learning, preservation of ancient texts, and daily seva for seekers in Rishikesh.
            </p>
            <Link 
              href="/donate" 
              className="bg-brand-primary hover:bg-[#c57929] text-white font-button font-bold text-base px-8 py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(217,138,54,0.3)] hover:-translate-y-0.5 transition-all duration-300 mt-2 flex items-center gap-2.5 cursor-pointer"
            >
              <span>Donate Now</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" /></svg>
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About Our Story & Sacred Lineage | Founder Papiya Samal",
  description: "Learn how founder Papiya Ranabijayini Samal spent seven years studying the Bhagavad Gita's 700+ verses to curate the 27 most transformative shlokas for daily calmness and focus.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Gita Gurukul | 7-Year Curation by Papiya Ranabijayini Samal",
    description: "Discover our roots in Rishikesh and the story behind the 27 sacred verses of the Gita Gurukul Diary.",
    url: "https://www.gitagurukul.com/about",
    images: [
      {
        url: "/images/oleg_churakov_akr89i3xf94_unsplash_1.png",
        width: 1200,
        height: 630,
        alt: "Gita Gurukul Sacred Lineage",
      },
    ],
  },
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      
      {/* Our Story Header Section */}
      <div className="w-full bg-[#FAF7F2] border-b border-brand-primary/10">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-[60px] pt-8 md:pt-12 lg:pt-16 pb-14 lg:pb-20">
          
          <AnimatedSection className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">
            {/* Left Column */}
            <div className="w-full lg:w-[35%] flex flex-col gap-3 text-center lg:text-left items-center lg:items-start animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs font-semibold tracking-wide shadow-xs">
                <span>🌿</span>
                <span>Sacred Lineage</span>
              </div>
              <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-brand-dark">
                Our Story
              </h1>
              <p className="font-body text-base sm:text-lg text-gray-600 mt-1 max-w-sm">
                Born from a deep desire to make sacred Vedic texts accessible and living in everyday life.
              </p>
            </div>

            {/* Right Column (Refined Google-like Card) */}
            <div className="w-full lg:w-[65%] flex flex-col gap-6">
              <div className="bg-white p-6 sm:p-8 lg:p-12 rounded-3xl border border-brand-primary/15 shadow-[0_8px_32px_rgba(17,33,19,0.04),0_1px_3px_rgba(17,33,19,0.02)]">
                <p className="font-body text-base sm:text-lg text-gray-700 leading-relaxed">
                  Founder Papiya Ranabijayini Samal spent seven years immersed in the study of the Gita. Reading, reflecting, and returning to its verses again and again, she noticed which verses consistently brought clarity in moments of doubt, and steadiness in moments of change. From this lifelong devotion, she curated 27 transformative shlokas—the core foundation of the Gita diary—chosen not for mere popularity, but for their power to ground, steady, and uplift a person through everyday life.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Vision Section */}
      <AnimatedSection className="w-full py-12 lg:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-[60px]">
          <div className="w-full bg-brand-dark border border-brand-primary/30 shadow-[0_16px_48px_rgba(0,0,0,0.15)] rounded-3xl p-6 sm:p-10 lg:p-16 text-center flex flex-col gap-5 items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-90"></div>
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/15 text-brand-primary flex items-center justify-center border border-brand-primary/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="font-display font-medium text-3xl lg:text-[40px] leading-[1.2] tracking-tight text-white max-w-2xl">Our Vision</h2>
            <p className="font-body font-semibold text-lg lg:text-xl text-brand-tan/90 leading-relaxed max-w-3xl">
              To foster a global community rooted in Dharma, where individuals find balance and strength through the systematic study and application of eternal wisdom. We envision a world where the principles of the Gita inspire mindful action and universal well-being.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Container for Purpose, Approach, Who We Serve */}
      <div className="max-w-[1280px] w-full mx-auto relative overflow-hidden px-4 sm:px-6 lg:px-[60px] py-16 lg:py-24 space-y-20 lg:space-y-32">

        {/* Purpose Section (Image Left, Text Right) */}
        {/* Mobile: Image on top -> flex-col lg:flex-row */}
        <AnimatedSection className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
           <div className="w-full max-w-[360px] lg:max-w-none mx-auto lg:w-[500px] h-[250px] lg:h-[350px] flex-shrink-0 relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-primary/10">
            <Image 
              src="/images/usha_kiran_lke8fsdqqtc_unsplash_1.png" 
              alt="Our Purpose" 
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <h2 className="font-display font-normal text-3xl lg:text-[40px] leading-[1.1] tracking-tight text-brand-dark">Our Purpose</h2>
            <p className="font-body font-semibold text-xl lg:text-xl leading-relaxed text-gray-950">
              Gita Gurukul was born from a simple belief: that the wisdom of the Bhagavad Gita, when engaged with daily, can quietly reshape how a person moves through the world. Not through grand gestures, but through steady, focused presence.
            </p>
          </div>
        </AnimatedSection>

        {/* Approach Section (Text Left, Image Right) */}
        {/* Mobile: Image on top -> flex-col-reverse lg:flex-row */}
        <AnimatedSection className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <h2 className="font-display font-normal text-3xl lg:text-[40px] leading-[1.1] tracking-tight text-brand-dark">Our Approach</h2>
            <div className="font-body font-semibold text-xl lg:text-xl leading-relaxed text-gray-950 flex flex-col gap-2 text-center lg:text-left">
              <p>Everything we make is built around three ideas:</p>
              <p>Depth over volume. Twenty-seven shlokas, chosen with care, rather than an overwhelming compilation.</p>
              <p>Practice over theory. A diary format that invites daily engagement, not a one-time read.</p>
              <p>Devotion over trend. Rooted in Krishna consciousness, not repackaged as a lifestyle product.</p>
            </div>
          </div>
          <div className="w-full max-w-[360px] lg:max-w-none mx-auto lg:w-[500px] flex-shrink-0 relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-primary/10">
            <Image 
              src="/images/vd_photography_v8qhvuponc_unsplash_1.png" 
              alt="Our Approach" 
              width={500}
              height={350}
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </AnimatedSection>

        {/* Who We Serve Section (Image Left, Text Right) */}
        {/* Mobile: Image on top -> flex-col lg:flex-row */}
        <AnimatedSection className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
           <div className="w-full max-w-[360px] lg:max-w-none mx-auto lg:w-[500px] h-[250px] lg:h-[350px] flex-shrink-0 relative rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-brand-primary/10">
            <Image 
              src="/images/sai_sai_jc_cyvf5jmk_unsplash_1.png" 
              alt="Who We Serve" 
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-5 text-center lg:text-left items-center lg:items-start">
            <h2 className="font-display font-normal text-3xl lg:text-[40px] leading-[1.1] tracking-tight text-brand-dark">Who We Serve</h2>
            <p className="font-body font-semibold text-xl lg:text-xl leading-relaxed text-gray-950">
              Gita Gurukul is for anyone seeking to bring more calm, focus, and meaning into daily life, whether you are new to the Gita or have walked with it for years. There is no prerequisite of knowledge, only a willingness to sit with the text and let it work.
            </p>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
}

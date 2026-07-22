import Image from "next/image";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-[1280px] w-full mx-auto relative overflow-hidden">
      {/* Our Story Section */}
      <section className="w-full px-6 lg:px-[60px] pt-[120px] pb-10 lg:pb-12">
        <h2 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark mb-6">Our Story</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-brand-light p-8 lg:p-10 rounded-[4px] shadow-sm flex flex-col justify-center">
            <h3 className="font-display font-bold text-3xl lg:text-4xl leading-[1.1] tracking-tight text-brand-primary mb-4">
              Born from a desire to make sacred texts accessible.
            </h3>
            <p className="font-body text-base lg:text-lg text-gray-800 leading-relaxed">
              Founder Papiya Ranabijayini Samal spent seven years immersed in the study of the Gita. Reading, reflecting, and returning to its 754 shlokas again and again, she began to notice which verses consistently brought clarity in moments of doubt, and steadiness in moments of change. From this study, she selected 27 shlokas, the foundation of the Gita diary, chosen not for their popularity but for their power to hold a person through everyday life.
            </p>
          </div>
          <div className="bg-white border-[2px] border-brand-border p-8 lg:p-10 rounded-[4px] shadow-sm flex flex-col justify-center">
            <Image src="/images/icon.svg" alt="Icon" width={32} height={28} className="mb-4" />
            <p className="font-body text-lg lg:text-xl text-brand-dark font-medium leading-relaxed italic">
              "We set out to design diaries and tools that aren't just reading materials, but daily<br />
              companions for reflection and growth. By combining high-end design with deep<br />
              spiritual substance, we aim to create a 'Sattvic' space in your everyday routine."
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Purpose */}
      <section className="w-full bg-brand-dark py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-white mb-8">Our Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <p className="font-body text-lg lg:text-xl text-brand-tan leading-relaxed">
              To foster a global community rooted in Dharma, where individuals find balance and strength through the<br />
              systematic study and application of eternal wisdom. We envision a world where the principles of the Gita<br />
              inspire mindful action and universal well-being.
            </p>
            <div className="w-full h-[250px] lg:h-[350px] relative rounded-sm overflow-hidden drop-shadow-xl">
              <Image 
                src="/images/sai_sai_jc_cyvf5jmk_unsplash_1.png" 
                alt="Our Vision" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Purpose & Approach */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        
        {/* Purpose */}
        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="md:w-1/2 flex flex-col gap-5">
            <h2 className="font-display font-black text-4xl lg:text-[56px] leading-[1.1] tracking-tight text-brand-dark">Our Purpose</h2>
            <p className="font-body text-base lg:text-lg text-gray-800 leading-relaxed">
              Gita Gurukul was born from a simple belief: that the wisdom of the Bhagavad Gita, when engaged with daily, can quietly reshape how a person moves through the world. Not through grand gestures, but through steady, focused presence.
            </p>
          </div>
          <div className="md:w-1/2 w-full h-[250px] relative rounded-sm overflow-hidden drop-shadow-md">
            <Image 
              src="/images/usha_kiran_lke8fsdqqtc_unsplash_1.png" 
              alt="Our Purpose" 
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Approach */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2 flex flex-col gap-5">
            <h2 className="font-display font-black text-4xl lg:text-[56px] leading-[1.1] tracking-tight text-brand-dark">Our Approach</h2>
            <div className="font-body text-base lg:text-lg text-gray-800 leading-relaxed">
              Everything we make is built around three ideas:<br />
              Depth over volume. Twenty-seven shlokas, chosen with care, rather than an overwhelming compilation.<br />
              Practice over theory. A diary format that invites daily engagement, not a one-time read.<br />
              Devotion over trend. Rooted in Krishna consciousness, not repackaged as a lifestyle product.
            </div>
          </div>
          <div className="md:w-1/2 w-full h-[250px] relative rounded-sm overflow-hidden drop-shadow-md">
            <Image 
              src="/images/vd_photography_v8qhvuponc_unsplash_1.png" 
              alt="Our Approach" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="w-full bg-gray-50 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center flex flex-col gap-4">
          <h2 className="font-display font-black text-4xl lg:text-[56px] leading-[1.1] tracking-tight text-brand-dark">Who We Serve</h2>
          <p className="font-body text-lg lg:text-xl text-gray-800 leading-relaxed">
            Gita Gurukul is for anyone seeking to bring more calm, focus, and meaning into daily life, whether you are new to the Gita or have walked with it for years. There is no prerequisite of knowledge, only a willingness to sit with the text and let it work.
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}

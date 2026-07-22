import Image from "next/image";

export default function Donate() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-[1280px] w-full mx-auto relative overflow-hidden">
      {/* Hero */}
      <section className="w-full px-6 lg:px-[60px] pt-[120px] pb-10 lg:pb-12 text-center flex flex-col gap-4">
        <h1 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark">Support the Journey of Eternal Wisdom</h1>
        <p className="font-body text-lg lg:text-xl text-gray-700 max-w-[800px] mx-auto">
          Your generous contribution helps us continue spreading the timeless teachings of the Bhagavad Gita and supporting seekers on their path.
        </p>
      </section>

      {/* Hero Image */}
      <div className="w-full h-[300px] lg:h-[450px] relative rounded-sm overflow-hidden drop-shadow-md max-w-5xl mx-auto">
        <Image 
          src="/images/evan_krause_hqgvoc_nyda_unsplash_1.png" 
          alt="Support" 
          fill
          className="object-cover"
        />
      </div>

      {/* Who We Serve */}
      <section className="w-full bg-white py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-6 lg:px-[60px] flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
            <h2 className="font-display font-black text-4xl lg:text-[56px] leading-[1.1] tracking-tight text-brand-dark">Who We Serve</h2>
            <p className="font-body text-base lg:text-lg text-gray-800 leading-relaxed">
              Beyond our annual celebration, our team works year-round with spiritual seekers in the Himalayas, particularly in Rishikesh. Many arrive with little more than their devotion. We help provide:
            </p>
            <div className="font-body text-base lg:text-lg text-gray-800 leading-relaxed space-y-2">
              Food, so daily needs don't interrupt spiritual practice<br />
              Clothing, especially through harsh Himalayan seasons<br />
              Shelter and sleeping comfort, so rest is not a struggle
            </div>
            <p className="font-body text-base lg:text-lg text-gray-800 leading-relaxed font-semibold italic text-brand-primary">
              Our goal is simple: to let these seekers focus on their spiritual path, unburdened by basic hardship.
            </p>
          </div>
          <div className="w-full lg:w-1/2 h-[300px] relative rounded-sm overflow-hidden shadow-md">
            <Image 
              src="/images/tong_kbp_xpommw690he_unsplash_1.png" 
              alt="Seekers in Rishikesh" 
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="w-full bg-gray-50 py-12 lg:py-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-[60px] flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Why Donate Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div>
              <h3 className="font-display font-black text-3xl lg:text-4xl mb-4 text-brand-dark">Why Donate?</h3>
              <p className="font-body text-base text-gray-700 leading-relaxed">
                Your support is vital. By donating to Gita Gurukul, you<br />
                are directly investing in the curation, design, and<br />
                distribution of resources that bring ancient Vedic<br />
                wisdom into modern daily lives.
              </p>
            </div>
            
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-display font-bold text-2xl text-brand-dark mb-2">Support that reaches those who need it most.</h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  Every donation to Gita Gurukul goes directly toward two things: spreading Krishna consciousness through community celebration, and supporting spiritual seekers who have little else.
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold text-2xl text-brand-dark mb-2">Bhagavad Gita Jayanti</h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  Each December, we mark Bhagavad Gita Jayanti with a large yagnya and a community food distribution for devotees. This is one of our most meaningful times of year, made possible entirely through donor support. Your contribution helps us hold this celebration with the scale and sincerity it deserves.
                </p>
              </div>
              <div>
                <h4 className="font-display font-bold text-2xl text-brand-dark mb-2">Where Your Contribution Goes</h4>
                <p className="font-body text-base text-gray-700 leading-relaxed">
                  Every rupee donated is directed toward these two efforts, the Gita Jayanti celebration and ongoing support for seekers in Rishikesh. No portion is set aside for anything beyond these purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-1/2 bg-white p-8 lg:p-10 shadow-lg border border-gray-100 rounded-sm">
            <h3 className="font-display font-black text-3xl lg:text-4xl text-brand-dark mb-6">Make a Contribution</h3>
            
            <form className="flex flex-col gap-6">
              {/* Amount Selection */}
              <div className="flex flex-col gap-3">
                <label className="font-body font-semibold text-base text-brand-dark">Select Amount</label>
                <div className="flex flex-wrap gap-3">
                  {['₹101', '₹501', '₹1001', '₹1501', '₹2001'].map((amount) => (
                    <button 
                      key={amount}
                      type="button"
                      className="px-5 py-2 border border-brand-primary text-brand-primary font-body font-medium rounded-sm hover:bg-brand-primary hover:text-white transition-colors"
                    >
                      {amount}
                    </button>
                  ))}
                  <div className="flex items-center border border-gray-300 rounded-sm px-3 py-2 flex-grow min-w-[120px]">
                    <span className="text-gray-500 mr-2">₹</span>
                    <input 
                      type="number" 
                      placeholder="Other Amount" 
                      className="outline-none font-body w-full text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-brand-dark">Full Name</label>
                  <input type="text" placeholder="Enter your full name" className="border border-gray-300 rounded-sm p-2.5 font-body text-base focus:outline-brand-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-brand-dark">Email Address</label>
                  <input type="email" placeholder="Enter your email address" className="border border-gray-300 rounded-sm p-2.5 font-body text-base focus:outline-brand-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-body text-sm font-semibold text-brand-dark">Dedicate this donation in honor of someone</label>
                  <input type="text" placeholder="In honor of someone (optional)" className="border border-gray-300 rounded-sm p-2.5 font-body text-base focus:outline-brand-primary" />
                </div>
              </div>

              <div className="mt-2">
                <button 
                  type="button"
                  className="w-full bg-brand-primary text-white font-button font-medium text-xl py-3 rounded-md shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                  disabled
                >
                  Donate Now
                </button>
                <p className="text-center text-xs text-gray-500 italic mt-2">
                  *Donations are currently disabled.
                </p>
              </div>
            </form>
          </div>

        </div>
        <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
          <p className="font-body text-lg text-brand-primary font-medium italic">
            "Whether large or small, your contribution becomes part of a larger act of devotion, helping others walk their own path toward the Gita's wisdom."
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}

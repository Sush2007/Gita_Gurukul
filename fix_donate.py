with open('src/app/donate/page.tsx', 'w', encoding='utf-8') as f:
    f.write('''"use client";

import Image from "next/image";
import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { useAuth } from "@/context/AuthContext";

export default function Donate() {
  const { user, profile, openLoginModal, initRazorpay } = useAuth();
  
  // State for the predefined selected amount
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  // State for a custom amount entered by the user
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCheckout = () => {
    // If a custom amount is entered and valid, use it. Otherwise use the selected predefined amount.
    const parsedCustom = parseInt(customAmount);
    const amount = (parsedCustom > 0) ? parsedCustom : selectedAmount;

    const data = { amount, items: "Donation to Gita Gurukul" };
    
    if (!user) {
      openLoginModal("CHECKOUT", data);
    } else if (!profile?.address || !profile?.pincode) {
      openLoginModal("CHECKOUT", data);
    } else {
      initRazorpay(data, profile);
    }
  };

  const predefinedAmounts = [1000, 2000, 5000];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-[1280px] w-full mx-auto pt-[140px] pb-8 px-6 lg:px-[60px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Hero Text */}
          <div className="w-full lg:flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start pt-4 lg:pt-8">
            <AnimatedSection>
              <h1 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark mb-4">
                Empower the Future with Vedic Wisdom
              </h1>
              <p className="font-body text-base lg:text-lg text-gray-700">
                Your donation helps us distribute Bhagavad Gita diaries to students across India, fostering moral education and spiritual growth.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={200} className="w-full relative mt-8 lg:mt-12 rounded-lg overflow-hidden h-[300px] lg:h-[400px]">
              <Image 
                src="/images/oleg_churakov_akr89i3xf94_unsplash_1.png" 
                alt="Students studying" 
                fill 
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply"></div>
            </AnimatedSection>
          </div>

          {/* Right Column - Donation Form */}
          <AnimatedSection delay={100} className="w-full lg:w-[450px] flex-shrink-0 relative">
            <div className="lg:absolute lg:right-0 lg:-top-[60px] w-full z-10">
              <div className="bg-[#faf7f2] border border-brand-tan/30 rounded-lg p-6 lg:p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-primary opacity-10 rounded-bl-full"></div>
                
                <h2 className="font-display font-black text-2xl lg:text-3xl text-brand-dark mb-2">Secure Donation</h2>
                <p className="font-body text-sm text-gray-600 mb-6">Choose an amount to contribute</p>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    {predefinedAmounts.map((amount) => (
                      <button 
                        key={amount} 
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount(""); // Clear custom amount when predefined is selected
                        }}
                        className={order  rounded-sm py-3 font-display font-bold text-base transition-colors}
                      >
                        ₹ {amount.toLocaleString('en-IN')}
                      </button>
                    ))}
                    <div className="flex items-center border border-[#D98A36]/30 bg-white rounded-sm px-3 py-3 col-span-1">
                      <span className="text-gray-500 mr-1 text-sm">₹</span>
                      <input 
                        type="number" 
                        placeholder="Custom" 
                        min="101"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) {
                            setSelectedAmount(0); // Deselect predefined when typing
                          }
                        }}
                        className="outline-none font-display font-bold w-full text-sm lg:text-base text-brand-dark bg-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-3 mt-2">
                    <input type="checkbox" id="dedicate" className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary" />
                    <label htmlFor="dedicate" className="font-body text-xs text-gray-500">Dedicate this donation in honor of someone</label>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-brand-primary text-white font-button font-medium text-lg py-4 rounded-md shadow-md hover:bg-opacity-90 hover:-translate-y-0.5 hover:shadow-lg transition-all mt-6"
                >
                  Donate Now
                </button>
                
                <p className="text-xs text-center text-gray-400 mt-4 font-body">
                  100% Secure Processing.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
''')

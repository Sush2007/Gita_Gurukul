import re

with open('src/app/donate/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add "use client" and imports
if '"use client";' not in content:
    content = '"use client";\n\n' + content

content = content.replace(
    'import AnimatedSection from "@/components/AnimatedSection";',
    'import AnimatedSection from "@/components/AnimatedSection";\nimport { useState } from "react";\nimport { useAuth } from "@/context/AuthContext";'
)

# Modify the Donate function definition
new_donate_header = '''export default function Donate() {
  const { user, profile, openLoginModal, initRazorpay } = useAuth();
  
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCheckout = () => {
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
  };'''

content = content.replace('export default function Donate() {', new_donate_header)

# Replace the form HTML
old_form = '''              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Amount Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <button type="button" className="border-2 border-[#D98A36] bg-[#D98A36]/5 text-brand-dark rounded-md py-4 font-display font-bold text-lg lg:text-xl transition-all">
                    ₹ 1,000
                  </button>
                  <button type="button" className="border border-gray-200 hover:border-[#D98A36] text-gray-600 hover:text-brand-dark bg-white rounded-md py-4 font-display font-bold text-lg lg:text-xl transition-all">
                    ₹ 2,000
                  </button>
                  <button type="button" className="border border-gray-200 hover:border-[#D98A36] text-gray-600 hover:text-brand-dark bg-white rounded-md py-4 font-display font-bold text-lg lg:text-xl transition-all col-span-2 lg:col-span-1">
                    ₹ 5,000
                  </button>
                </div>

                {/* Custom Amount */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-sm font-semibold text-gray-700">Custom Amount (₹)</label>
                  <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md px-4 py-3 focus-within:border-[#D98A36] focus-within:ring-1 focus-within:ring-[#D98A36] transition-all">
                    <span className="text-gray-500 font-display font-bold text-lg mr-2">₹</span>
                    <input 
                      type="number" 
                      placeholder="101" 
                      min="101"
                      className="w-full bg-transparent outline-none font-display font-bold text-lg lg:text-xl text-brand-dark"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    type="button"
                    className="w-full bg-[#D98A36] text-white font-display font-bold text-lg py-4 rounded-sm shadow-md hover:bg-opacity-90 transition-all"
                  >
                    Donate Now
                  </button>
                </div>
              </form>'''

new_form = '''              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                
                {/* Amount Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[1000, 2000, 5000].map((amount) => (
                    <button 
                      key={amount}
                      type="button" 
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={
                        (selectedAmount === amount && !customAmount)
                          ? "border-2 border-[#D98A36] bg-[#D98A36]/5 text-brand-dark rounded-md py-4 font-display font-bold text-lg lg:text-xl transition-all" + (amount === 5000 ? " col-span-2 lg:col-span-1" : "")
                          : "border border-gray-200 hover:border-[#D98A36] text-gray-600 hover:text-brand-dark bg-white rounded-md py-4 font-display font-bold text-lg lg:text-xl transition-all" + (amount === 5000 ? " col-span-2 lg:col-span-1" : "")
                      }
                    >
                      ₹ {amount.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="flex flex-col gap-2">
                  <label className="font-body text-sm font-semibold text-gray-700">Custom Amount (₹)</label>
                  <div className="flex items-center border border-gray-200 bg-gray-50 rounded-md px-4 py-3 focus-within:border-[#D98A36] focus-within:ring-1 focus-within:ring-[#D98A36] transition-all">
                    <span className="text-gray-500 font-display font-bold text-lg mr-2">₹</span>
                    <input 
                      type="number" 
                      placeholder="101" 
                      min="101"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) setSelectedAmount(0);
                      }}
                      className="w-full bg-transparent outline-none font-display font-bold text-lg lg:text-xl text-brand-dark"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-[#D98A36] text-white font-display font-bold text-lg py-4 rounded-sm shadow-md hover:bg-opacity-90 transition-all"
                  >
                    Donate Now
                  </button>
                </div>
              </form>'''

if old_form in content:
    content = content.replace(old_form, new_form)
else:
    print("Could not find the old form to replace")

with open('src/app/donate/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")

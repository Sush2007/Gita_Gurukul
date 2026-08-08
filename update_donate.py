import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add use client and imports
if '"use client";' not in content:
    content = '"use client";\n' + content

content = content.replace(
    'import AnimatedSection from "@/components/AnimatedSection";',
    'import AnimatedSection from "@/components/AnimatedSection";\nimport { useState } from "react";\nimport { useAuth } from "@/context/AuthContext";'
)

# 2. Update the Donate component to have state and Razorpay logic
old_header = "export default function Donate() {"
new_header = """export default function Donate() {
  const { user, profile, openLoginModal, initRazorpay } = useAuth();
  
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleCheckout = () => {
    const parsedCustom = parseInt(customAmount);
    const amount = (parsedCustom > 0) ? parsedCustom : selectedAmount;
    
    if (amount <= 0) return;

    const data = { amount, items: "Donation to Gita Gurukul" };
    
    if (!user) {
      openLoginModal("CHECKOUT", data);
    } else if (!profile?.address || !profile?.pincode) {
      openLoginModal("CHECKOUT", data);
    } else {
      initRazorpay(data, profile);
    }
  };"""

content = content.replace(old_header, new_header)

# 3. Update the form
# In the original file, it has:
# {["₹ 1,000", "₹ 2,000", "₹ 5,000"].map((amount, idx) => (
#   <button ...

old_map = """                    {["₹ 1,000", "₹ 2,000", "₹ 5,000"].map((amount, idx) => (
                      <button 
                        key={idx} 
                        type="button"
                        className="py-3 bg-transparent border border-[#D98A36]/30 text-brand-dark font-display font-bold rounded-sm hover:bg-[#D98A36] hover:text-white hover:border-[#D98A36] transition-colors text-sm lg:text-base"
                      >
                        {amount}
                      </button>
                    ))}"""

new_map = """                    {[1000, 2000, 5000].map((amount) => (
                      <button 
                        key={amount} 
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount("");
                        }}
                        className={`py-3 font-display font-bold rounded-sm transition-colors text-sm lg:text-base ${
                          (selectedAmount === amount && !customAmount) 
                            ? "bg-[#D98A36] text-white border-2 border-[#D98A36]" 
                            : "bg-transparent border border-[#D98A36]/30 text-brand-dark hover:bg-[#D98A36] hover:text-white hover:border-[#D98A36]"
                        }`}
                      >
                        ₹ {amount.toLocaleString('en-IN')}
                      </button>
                    ))}"""

content = content.replace(old_map, new_map)

# 4. Update the custom input
old_input = """                      <input 
                        type="number" 
                        placeholder="Custom" 
                        min="0"
                        className="outline-none font-display font-bold w-full text-sm lg:text-base text-brand-dark bg-transparent"
                      />"""

new_input = """                      <input 
                        type="number" 
                        placeholder="Custom" 
                        min="0"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setSelectedAmount(0);
                        }}
                        className="outline-none font-display font-bold w-full text-sm lg:text-base text-brand-dark bg-transparent"
                      />"""

content = content.replace(old_input, new_input)

# 5. Update the Donate Now button
old_button = """                  <button 
                    type="button"
                    className="w-full bg-[#D98A36] text-white font-display font-bold text-lg py-4 rounded-sm shadow-md hover:bg-opacity-90 transition-all"
                  >
                    Donate Now
                  </button>"""

new_button = """                  <button 
                    type="button"
                    onClick={handleCheckout}
                    className="w-full bg-[#D98A36] text-white font-display font-bold text-lg py-4 rounded-sm shadow-md hover:bg-opacity-90 transition-all"
                  >
                    Donate Now
                  </button>"""

content = content.replace(old_button, new_button)

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")

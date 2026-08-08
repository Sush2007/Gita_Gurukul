import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add onBlur handler to enforce 101 minimum
old_input = """                      <input 
                        type="number" 
                        placeholder="Custom" 
                        min="101"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setSelectedAmount(0);
                        }}
                        className="outline-none font-display font-bold w-full text-sm lg:text-base text-brand-dark bg-transparent"
                      />"""

new_input = """                      <input 
                        type="number" 
                        placeholder="Custom" 
                        min="101"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          if (e.target.value) setSelectedAmount(0);
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (val > 0 && val < 101) {
                            setCustomAmount("101");
                          }
                        }}
                        className="outline-none font-display font-bold w-full text-sm lg:text-base text-brand-dark bg-transparent"
                      />"""

content = content.replace(old_input, new_input)

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated onBlur")

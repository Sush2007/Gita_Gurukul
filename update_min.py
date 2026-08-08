import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Change min="0" to min="101"
content = content.replace('min="0"', 'min="101"')

# Add validation in handleCheckout
old_checkout = """  const handleCheckout = () => {
    const parsedCustom = parseInt(customAmount);
    const amount = (parsedCustom > 0) ? parsedCustom : selectedAmount;
    
    if (amount <= 0) return;

    const data = { amount, items: "Donation to Gita Gurukul" };"""

new_checkout = """  const handleCheckout = () => {
    const parsedCustom = parseInt(customAmount);
    const amount = (parsedCustom > 0) ? parsedCustom : selectedAmount;
    
    if (amount <= 0) return;
    
    if (amount < 101) {
      alert("Minimum donation amount is ₹101");
      return;
    }

    const data = { amount, items: "Donation to Gita Gurukul" };"""

content = content.replace(old_checkout, new_checkout)

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated")

import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_donation_text = """            <h2 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark">
              Donation
            </h2>
            <p className="font-body text-base lg:text-lg leading-relaxed text-gray-800">
              Gita Gurukul was created to help you build a life of calmness, focus, success, and devotion. Founder Papiya Ranabijayini Samal spent seven years studying the Gita in depth, and from its 754 shlokas, selected the 27 that offer the clearest path to mastering calmness and achieving greatness in life.
            </p>"""

new_donation_text = """            <h2 className="font-display font-black text-5xl lg:text-[64px] leading-[1.1] tracking-tight text-brand-dark">
              Support Our Mission
            </h2>
            <p className="font-body text-base lg:text-lg leading-relaxed text-gray-800">
              Gita Gurukul is a dedicated e-commerce and donation platform designed to spread the wisdom of the Bhagavad Gita. By creating a secure account, users can seamlessly purchase our curated spiritual diaries, manage their order history, and make charitable donations to support spiritual seekers in Rishikesh. Your account allows us to securely process payments and deliver physical products directly to your shipping address.
            </p>"""

content = content.replace(old_donation_text, new_donation_text)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated homepage text")

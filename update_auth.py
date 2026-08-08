import re

with open("src/context/AuthContext.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_profile = 'const emptyProfile = { name: "", email: "", phone: currentUser.phoneNumber || "", address: "", state: "", pincode: "" };'
new_profile = 'const emptyProfile = { name: currentUser.displayName || "", email: currentUser.email || "", phone: currentUser.phoneNumber || "", address: "", state: "", pincode: "" };'

content = content.replace(old_profile, new_profile)

with open("src/context/AuthContext.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AuthContext")

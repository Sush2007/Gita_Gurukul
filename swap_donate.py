import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# We know the structure:
# A = Everything up to Hero Section end
# B = Who We Serve Section
# C = Goal Banner
# D = How to give? Section
# E = Footer Banner and rest

# Find boundaries
hero_end = content.find("      {/* Who We Serve Section (Zig-zag Layout) */}")
who_we_serve_start = hero_end
goal_banner_start = content.find("      {/* Goal Banner */}")
how_to_give_start = content.find("      {/* How to give? Section */}")
footer_banner_start = content.find("      {/* Footer Banner */}")

A = content[:who_we_serve_start]
B = content[who_we_serve_start:goal_banner_start]
C = content[goal_banner_start:how_to_give_start]
D = content[how_to_give_start:footer_banner_start]
E = content[footer_banner_start:]

# New order: A + D + B + C + E
new_content = A + D + B + C + E

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Swapped sections successfully")

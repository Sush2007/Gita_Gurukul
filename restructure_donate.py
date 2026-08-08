import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Extract the sections
# Hero Section
hero_start = content.find("      {/* Hero Section (Background Image with Overlay Text) */}")
hero_end = content.find("      {/* How to give? Section */}")
if hero_start == -1 or hero_end == -1:
    print("Could not find hero or how to give section boundaries")

hero_section = content[hero_start:hero_end]

# How to give section
how_to_give_start = hero_end
how_to_give_end = content.find("      {/* Who We Serve Section (Zig-zag Layout) */}")
how_to_give_section = content[how_to_give_start:how_to_give_end]

# Rest of the page (Who we serve -> Footer)
rest_of_page = content[how_to_give_end:]

# 2. Modify Hero Section to be a middle Banner
hero_section = hero_section.replace("h-[calc(100vh-85px)] mt-[85px]", "h-[350px] lg:h-[400px]")

# 3. Modify How to give section
# Add top padding for navbar
how_to_give_section = how_to_give_section.replace("py-16 lg:py-24", "pt-[120px] pb-16 lg:pt-[160px] lg:pb-24")

# Swap the columns inside How to give section
# The left column is the form, the right column is Why donate
form_col_start = how_to_give_section.find("            {/* LEFT COLUMN: Donation Form */}")
why_donate_start = how_to_give_section.find("            {/* RIGHT COLUMN: Why Donate Info */}")
why_donate_end = how_to_give_section.find("          </AnimatedSection>", why_donate_start)

if form_col_start == -1 or why_donate_start == -1 or why_donate_end == -1:
    print("Could not find column boundaries in How to give")

form_col = how_to_give_section[form_col_start:why_donate_start]
why_donate_col = how_to_give_section[why_donate_start:why_donate_end]

# Let's fix the comments
form_col = form_col.replace("LEFT COLUMN", "RIGHT COLUMN")
why_donate_col = why_donate_col.replace("RIGHT COLUMN", "LEFT COLUMN")

# Reconstruct How to give section with columns swapped
how_to_give_section_top = how_to_give_section[:form_col_start]
how_to_give_section_bottom = how_to_give_section[why_donate_end:]
new_how_to_give_section = how_to_give_section_top + why_donate_col + form_col + how_to_give_section_bottom

# 4. Combine in new order
prefix = content[:hero_start]
new_content = prefix + new_how_to_give_section + hero_section + rest_of_page

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Restructured successfully")

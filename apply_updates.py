import re

with open("src/app/donate/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Make the hero banner full screen again
content = content.replace('className="relative w-full h-[350px] lg:h-[400px] flex items-center justify-center"', 'className="relative w-full h-[calc(100vh-85px)] flex items-center justify-center"')

# 2. Remove "How to give?" heading
how_to_give_heading_pattern = r'\s*<div className="text-center">\s*<h2 className="[^"]*">\s*How to give\?\s*</h2>\s*</div>'
content = re.sub(how_to_give_heading_pattern, '', content)

with open("src/app/donate/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updates applied")

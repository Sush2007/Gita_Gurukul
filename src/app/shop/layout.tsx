import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Bhagavad Gita Diary | 27 Sacred Shlokas Edition",
  description: "Order the authentic hand-bound Gita Gurukul Diary featuring 27 handpicked shlokas for daily reflection, mindfulness, and inner peace. Free delivery across India.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Order Bhagavad Gita Diary | Gita Gurukul Curated Edition",
    description: "Handcrafted spiritual journal with 27 curated shlokas for daily reflection. Special Edition with gold foil stamping and archival ivory paper.",
    url: "https://www.gitagurukul.com/shop",
    images: [
      {
        url: "/images/screenshot_from_2026_07_12_18_39_10_1.png",
        width: 1200,
        height: 630,
        alt: "Gita Gurukul Sacred Diary",
      },
    ],
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

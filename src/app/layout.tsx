import type { Metadata } from "next";
import { Montserrat, Outfit, Commissioner, Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-momo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gita Gurukul | Eternal Vedic Wisdom for the Modern Seeker",
    template: "%s | Gita Gurukul",
  },
  description: "Discover the profound teachings of the Bhagavad Gita with Gita Gurukul. A perfect companion for daily reflection, spiritual growth, and bringing calmness into your everyday life through ancient Vedic wisdom and Krishna consciousness.",
  keywords: ["Bhagavad Gita", "Gita Gurukul", "Vedic Wisdom", "Daily Reflection", "Spiritual Growth", "Krishna Consciousness", "Rishikesh", "Meditation", "Mindfulness Diary", "Hindu Philosophy"],
  authors: [{ name: "Gita Gurukul" }],
  creator: "Gita Gurukul",
  publisher: "Gita Gurukul",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gita Gurukul | Eternal Vedic Wisdom",
    description: "Bring ancient Vedic wisdom into your modern daily life. Start your journey of spiritual growth and mindful reflection.",
    url: "https://www.gitagurukul.com",
    siteName: "Gita Gurukul",
    images: [
      {
        url: "/images/1_1.png", // Hero image used as OG image
        width: 1200,
        height: 630,
        alt: "Gita Gurukul - Eternal Wisdom",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gita Gurukul | Eternal Vedic Wisdom",
    description: "Bring ancient Vedic wisdom into your modern daily life. Start your journey of spiritual growth and mindful reflection.",
    images: ["/images/1_1.png"],
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_HTML_TAG_ID_HERE",
  },
  other: {
    "geo.region": "IN-UK",
    "geo.placename": "Rishikesh",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${outfit.variable} ${commissioner.variable} ${roboto.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-body bg-white text-black">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

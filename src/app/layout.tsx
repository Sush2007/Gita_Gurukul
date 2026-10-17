import type { Metadata } from "next";
import { Cormorant, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuthProvider } from "@/context/AuthContext";
import LoginModal from "@/components/LoginModal";
import ScrollToTop from "@/components/ScrollToTop";
import Script from "next/script";
import { SEO_KEYWORDS, GITA_GURUKUL_STRUCTURED_DATA } from "@/data/seo_data";
import "./globals.css";

const cormorant = Cormorant({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.gitagurukul.com"),
  title: {
    default: "Gita Gurukul | Eternal Vedic Wisdom for the Modern Seeker",
    template: "%s | Gita Gurukul",
  },
  description: "Discover the profound teachings of the Bhagavad Gita with Gita Gurukul. A perfect companion for daily reflection, spiritual growth, and bringing calmness into your everyday life through ancient Vedic wisdom and Krishna consciousness.",
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Gita Gurukul" }, { name: "Papiya Ranabijayini Samal" }],
  creator: "Gita Gurukul",
  publisher: "Gita Gurukul",
  category: "Spiritual Literature & Guided Reflection",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Gita Gurukul | Eternal Vedic Wisdom for the Modern Seeker",
    description: "Bring ancient Vedic wisdom into your modern daily life with the 27 Sacred Shlokas Bhagavad Gita diary. Start your journey of spiritual growth and mindful reflection.",
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
    locale: "en_IN",
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
    "geo.region": "IN-UT",
    "geo.placename": "Rishikesh",
    "geo.position": "30.0869;78.2676",
    "ICBM": "30.0869, 78.2676",
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
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM Context Index" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GITA_GURUKUL_STRUCTURED_DATA) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-body bg-[#FDFBF7] text-brand-dark antialiased">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        <AuthProvider>
          <ScrollToTop />
          <Navbar />
          <LoginModal />
          <main className="flex-1 flex flex-col w-full min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}


import type { Metadata } from "next";
import { Montserrat, Outfit, Commissioner, Roboto } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "Gita Gurukul",
  description: "A diary worth the success.",
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
      </body>
    </html>
  );
}

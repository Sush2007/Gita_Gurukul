import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Gita Gurukul",
  description: "Find answers to common questions about the Gita Gurukul Diary, 27 sacred shlokas, Rishikesh roots, express delivery, and returns.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Gita Gurukul Guide",
    description: "Learn more about our mission, our Bhagavad Gita diaries, delivery timelines, and our roots in Rishikesh.",
    url: "https://www.gitagurukul.com/faq",
    images: [
      {
        url: "/images/1_1.png",
        width: 1200,
        height: 630,
        alt: "Gita Gurukul FAQ",
      },
    ],
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

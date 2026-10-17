import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate & Support Our Seva | Gita Gurukul Rishikesh",
  description: "Contribute to Gita Gurukul's sacred initiatives: supporting spiritual seekers in Rishikesh and organizing the annual Bhagavad Gita Jayanti yagnyas and annadanam.",
  alternates: {
    canonical: "/donate",
  },
  openGraph: {
    title: "Support Our Mission & Sacred Seva in Rishikesh | Gita Gurukul",
    description: "Every contribution directly supports spiritual seekers in the Himalayan foothills and community Gita Jayanti celebrations.",
    url: "https://www.gitagurukul.com/donate",
    images: [
      {
        url: "/images/manojkumar_bathala_jqfrgnf7cqo_unsplash_1.png",
        width: 1200,
        height: 630,
        alt: "Gita Gurukul Seva in Rishikesh",
      },
    ],
  },
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

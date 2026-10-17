"use client";

import AnimatedSection from "@/components/AnimatedSection";
import Link from "next/link";

export default function FAQ() {
  const faqs = [
    {
      question: "What is the Gita Gurukul Diary?",
      answer: "The Gita Gurukul Diary is a beautifully crafted journal containing 27 handpicked shlokas from the Bhagavad Gita. It is designed to help modern seekers practice daily reflection, mindfulness, and integrate ancient Vedic wisdom into their everyday lives."
    },
    {
      question: "Where is Gita Gurukul based?",
      answer: "Our spiritual roots and operations are based in the sacred city of Rishikesh, India—nestled in the foothills of the Himalayas. Our team works year-round with seekers and monks in this holy region."
    },
    {
      question: "Do you ship your diaries internationally?",
      answer: "Yes, while we are proudly based in India, we ship our Bhagavad Gita diaries to spiritual seekers worldwide. Delivery times and shipping costs will vary depending on your global location."
    },
    {
      question: "Are these teachings suitable for beginners?",
      answer: "Absolutely. The shlokas and reflections included in our diary are carefully selected to be accessible to everyone, whether you are just beginning your journey into Hindu philosophy or have been practicing Krishna consciousness for years."
    },
    {
      question: "How does my purchase help the community?",
      answer: "A portion of every purchase goes directly towards supporting spiritual seekers and monks in Rishikesh and the Himalayas. We help provide essential food, clothing for harsh Himalayan winters, and safe shelter so their daily spiritual practice remains uninterrupted."
    },
    {
      question: "Can I return or exchange my diary?",
      answer: "Due to the personal nature of our journals, we can only accept returns or exchanges for products that arrive damaged or defective. Please contact our support team within 7 days of receiving your order with photographic proof."
    },
    {
      question: "How can I contact your team?",
      answer: "You can reach out to us anytime via email at gitagurukulm@gmail.com. We are always happy to connect with our community."
    }
  ];

  return (
    <div className="bg-[#FDFBF7] min-h-screen pt-8 md:pt-12 lg:pt-14 pb-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-[60px]">
        <div className="flex flex-col items-center text-center mb-12 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-semibold tracking-wide mb-3 shadow-xs">
            <span>❓</span>
            <span>Support &amp; Community Guide</span>
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl lg:text-5xl text-brand-dark mb-3">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-base sm:text-lg text-gray-600 max-w-xl">
            Learn more about our mission, our Bhagavad Gita diaries, delivery timelines, and our roots in Rishikesh.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#FAF7F2] p-6 lg:p-8 rounded-3xl shadow-[0_4px_24px_rgba(17,33,19,0.03)] border border-brand-primary/15 hover:border-brand-primary/30 transition-all">
              <h3 className="font-display font-medium text-lg sm:text-xl text-brand-dark mb-2.5">
                {faq.question}
              </h3>
              <p className="font-body font-semibold text-gray-700 leading-relaxed text-sm sm:text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="font-body font-semibold text-lg text-gray-950 mb-6">
            Still have questions? We'd love to hear from you.
          </p>
          <a 
            href="https://mail.google.com/mail/?view=cm&fs=1&to=gitagurukulm@gmail.com&su=Inquiry%20from%20Gita%20Gurukul%20Website"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-brand-primary text-white font-button font-medium text-lg px-8 py-3 rounded-md shadow-md hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(226,154,44,0.3)] transition-all duration-300"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}

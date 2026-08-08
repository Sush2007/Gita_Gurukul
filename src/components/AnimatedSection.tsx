"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatedSection({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: delay / 1000 }}
      className={`w-full flex flex-col ${className}`}
    >
      {children}
    </motion.section>
  );
}

"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({ children, className, delay = 0 }: AnimatedPageProps & { delay?: number }) {
  return (
    <motion.div
      variants={item}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

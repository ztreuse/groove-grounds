"use client";

import { motion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  // Seconds; use small steps (0.06) to stagger siblings.
  delay?: number;
  as?: "div" | "section" | "li";
};

// Fades content up into place the first time it scrolls into view.
// Use below the fold only; <MotionConfig reducedMotion="user"> turns the
// movement off for people who prefer less motion.
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

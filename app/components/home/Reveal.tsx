"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Scroll reveal per docs/motion-system.md: opacity + 24px translate-y,
 * --m-reveal (0.6s), reveal once, stagger via delay index (80ms steps,
 * capped at 5). Reduced motion renders static.
 */
export default function Reveal({
  children,
  delayIndex = 0,
  className,
}: {
  children: React.ReactNode;
  delayIndex?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        ease: [0.2, 0.8, 0.2, 1],
        delay: Math.min(delayIndex, 5) * 0.08,
      }}
    >
      {children}
    </motion.div>
  );
}

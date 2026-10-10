import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  amount = 0.25,
  as: Component = motion.div,
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}

export default FadeIn;

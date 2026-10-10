import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Subtle magnetic pull toward the cursor on desktop.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.28,
  ...props
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * strength, y: y * strength });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      className={cn(className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={reduce ? undefined : { x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default MagneticButton;

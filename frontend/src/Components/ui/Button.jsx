import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../../lib/utils";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-accent-rose px-5 py-2.5 font-semibold text-white shadow-soft transition duration-200 hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-rose focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:pointer-events-none disabled:opacity-50",
};

const sizes = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  magnetic = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e) => {
    if (reduce || !magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.22, y: y * 0.22 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(variants[variant], sizes[size], className)}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={reduce || !magnetic ? undefined : { x: offset.x, y: offset.y }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      {...props}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </motion.button>
  );
}

export default Button;

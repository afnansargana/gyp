import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * Animated 6-digit OTP input with pop / shake / success states.
 * Uses a single hidden input for a11y + paste support.
 */
export function OtpInput({
  value = "",
  onChange,
  length = 6,
  status = "idle", // idle | error | success
  disabled = false,
  autoFocus = true,
}) {
  const inputRef = useRef(null);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const focusInput = () => {
    if (!disabled) inputRef.current?.focus();
  };

  const handleChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, length);
    onChange?.(raw);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !value) {
      e.preventDefault();
    }
  };

  const activeIndex = Math.min(value.length, length - 1);

  return (
    <motion.div
      animate={
        status === "error"
          ? { x: [0, -6, 6, -6, 6, 0] }
          : { x: 0 }
      }
      transition={{ duration: 0.4 }}
      className="relative"
      onClick={focusInput}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={length}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="One-time password"
        className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
      />

      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, i) => {
          const filled = digit.trim() !== "";
          const isActive = !disabled && status === "idle" && i === activeIndex;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={
                filled
                  ? { scale: [0.6, 1.12, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={cn(
                "flex h-12 w-10 items-center justify-center rounded-xl border bg-ink-900/80 font-display text-xl font-semibold text-ink-50 shadow-neu sm:h-14 sm:w-12 sm:text-2xl",
                "border-ink-700 transition duration-200",
                isActive && "border-brand-400 ring-2 ring-brand-400/40",
                status === "error" && "border-accent-rose ring-2 ring-accent-rose/40",
                status === "success" &&
                  "border-accent-emerald ring-2 ring-accent-emerald/40",
                filled && status === "idle" && "border-brand-500/50"
              )}
            >
              {filled ? digit : ""}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default OtpInput;

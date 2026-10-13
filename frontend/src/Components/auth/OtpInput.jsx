import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Premium animated 6-digit OTP input.
 * Features:
 * - Pop animation on keystroke (scale spring)
 * - Staggered success fill with emerald glow
 * - Shake animation on error (x keyframes)
 * - Cursor blink on active cell
 * - Paste support via single hidden input
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

  // Stagger variants for success animation
  const successVariants = {
    hidden: { scale: 0.7, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <motion.div
      animate={status === "error" ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      className="relative select-none"
      onClick={focusInput}
    >
      {/* Hidden real input for a11y + paste */}
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

      {/* Visual cells */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, i) => {
          const filled = digit.trim() !== "";
          const isActive = !disabled && status === "idle" && i === activeIndex;
          const isSuccess = status === "success";
          const isError = status === "error";

          return (
            <motion.div
              key={i}
              custom={i}
              variants={isSuccess ? successVariants : undefined}
              initial={isSuccess ? "hidden" : false}
              animate={
                isSuccess
                  ? "visible"
                  : filled
                  ? { scale: [0.65, 1.15, 1] }
                  : { scale: 1 }
              }
              transition={
                isSuccess ? undefined : { duration: 0.22, ease: "easeOut" }
              }
              className={cn(
                "relative flex h-12 w-10 items-center justify-center rounded-xl border",
                "font-display text-xl font-semibold text-ink-50 shadow-neu",
                "sm:h-14 sm:w-12 sm:text-2xl",
                "transition-colors duration-200",
                // Base
                !isActive && !isError && !isSuccess && "border-ink-700 bg-ink-900/80",
                // Active (cursor position)
                isActive && "border-brand-400 bg-ink-900/90 ring-2 ring-brand-400/40",
                // Error
                isError && "border-accent-rose bg-accent-rose/5 ring-2 ring-accent-rose/30",
                // Success
                isSuccess && "border-accent-emerald bg-accent-emerald/10 ring-2 ring-accent-emerald/40",
                // Filled non-active
                filled && !isActive && !isError && !isSuccess && "border-brand-500/50 bg-ink-900/90"
              )}
            >
              {/* Cursor blink line when active and not filled */}
              {isActive && !filled && (
                <motion.span
                  className="absolute h-5 w-0.5 rounded-full bg-brand-400"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "steps(1)" }}
                />
              )}

              {/* Digit or success icon */}
              {filled && (
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.06 + 0.1, duration: 0.3, type: "spring" }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-accent-emerald" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="digit"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {digit}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default OtpInput;

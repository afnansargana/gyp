import React, { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className,
    wrapperClassName,
    id,
    type = "text",
    ...props
  },
  ref
) {
  const inputId = id || props.name;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className={cn("w-full", wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="label-field">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={cn(
            "input-field",
            leftIcon && "pl-11",
            (rightIcon || isPassword) && "pr-11",
            error &&
              "border-accent-rose focus:border-accent-rose focus:ring-accent-rose/30",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-500 transition hover:text-ink-200"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        ) : (
          rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500">
              {rightIcon}
            </span>
          )
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key={error}
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="mt-1.5 text-sm text-accent-rose"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;

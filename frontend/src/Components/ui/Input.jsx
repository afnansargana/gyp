import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";

/**
 * @typedef {object} InputProps
 * @property {string} [label]
 * @property {string} [error]
 * @property {string} [hint]
 * @property {React.ReactNode} [leftIcon]
 * @property {React.ReactNode} [rightIcon]
 * @property {string} [className]
 * @property {string} [wrapperClassName]
 */

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
    ...props
  },
  ref
) {
  const inputId = id || props.name;

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
          className={cn(
            "input-field",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
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
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500">
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 animate-fade-up text-sm text-accent-rose"
          role="alert"
        >
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;

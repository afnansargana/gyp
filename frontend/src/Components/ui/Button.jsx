import React from "react";
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

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant]
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {boolean} [props.isLoading]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(variants[variant], sizes[size], className)}
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
    </button>
  );
}

export default Button;

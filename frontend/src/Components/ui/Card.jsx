import React from "react";
import { cn } from "../../lib/utils";

export function Card({ hover = false, glass = false, className, children, ...props }) {
  return (
    <div
      className={cn(
        glass ? "glass-panel" : hover ? "surface-card-hover" : "surface-card",
        "p-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4 space-y-1", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("font-display text-lg font-semibold text-ink-50", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-ink-400", className)} {...props}>
      {children}
    </p>
  );
}

export default Card;

import React from "react";
import { cn } from "../../lib/utils";

const tones = {
  brand: "bg-brand-500/15 text-brand-300 ring-brand-500/30",
  emerald: "bg-accent-emerald/15 text-emerald-300 ring-accent-emerald/30",
  amber: "bg-accent-amber/15 text-amber-300 ring-accent-amber/30",
  rose: "bg-accent-rose/15 text-rose-300 ring-accent-rose/30",
  muted: "bg-ink-700/60 text-ink-300 ring-ink-600/40",
};

export function Badge({ tone = "brand", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;

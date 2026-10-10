import React from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

/**
 * Polished empty state for lists, carts, dashboards.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "When content is available, it will show up in this space.",
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 bg-ink-900/40 px-6 py-14 text-center",
        className
      )}
      role="status"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-50">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-400">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

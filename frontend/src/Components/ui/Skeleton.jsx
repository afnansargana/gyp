import React from "react";
import { cn } from "../../lib/utils";

/**
 * Single skeleton block with shimmer.
 */
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("skeleton-shimmer", className)}
      aria-hidden
      {...props}
    />
  );
}

/**
 * Preset: product / service card placeholder.
 */
export function CardSkeleton({ className }) {
  return (
    <div
      className={cn(
        "surface-card overflow-hidden p-4 space-y-4",
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
}

/**
 * Preset: dashboard metric strip.
 */
export function DashboardSkeleton({ cards = 4, className }) {
  return (
    <div
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      role="status"
      aria-label="Loading dashboard"
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="glass-panel space-y-3 p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Preset: text lines (profile, lists).
 */
export function TextSkeleton({ lines = 3, className }) {
  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export default Skeleton;

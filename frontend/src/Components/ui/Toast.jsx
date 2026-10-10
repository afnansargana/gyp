import React from "react";
import { Toaster, toast } from "sonner";

/**
 * Mount once near the app root.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      theme="dark"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "glass-panel-strong !border-ink-700 !font-sans !shadow-lift",
          title: "!font-display !font-semibold !text-ink-50",
          description: "!text-ink-400",
          success: "!border-accent-emerald/40",
          error: "!border-accent-rose/40",
        },
      }}
    />
  );
}

/** Typed helpers for consistent messaging */
export const notify = {
  success: (message, description) =>
    toast.success(message, description ? { description } : undefined),
  error: (message, description) =>
    toast.error(message, description ? { description } : undefined),
  info: (message, description) =>
    toast(message, description ? { description } : undefined),
  promise: (promise, messages) => toast.promise(promise, messages),
};

export { toast };
export default AppToaster;

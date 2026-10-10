import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-dark text-ink-100">
      <div
        className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-accent-emerald/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <Link
          to="/"
          className="mb-8 flex items-center justify-center gap-2.5 text-ink-50 transition hover:text-brand-300"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 ring-1 ring-brand-400/30">
            <Wrench className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            AutoFixHub
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel-strong p-6 sm:p-8"
        >
          <div className="mb-6 text-center">
            <h1 className="font-display text-2xl font-semibold text-ink-50 sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                {subtitle}
              </p>
            )}
          </div>
          {children}
        </motion.div>

        {footer && (
          <p className="mt-6 text-center text-sm text-ink-400">{footer}</p>
        )}
      </div>
    </div>
  );
}

export default AuthLayout;

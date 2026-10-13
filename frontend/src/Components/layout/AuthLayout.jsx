import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Wrench, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Premium split-screen auth layout.
 * Left: animated branding panel. Right: the form card.
 */
export function AuthLayout({ title, subtitle, children, footer, step, totalSteps }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100 flex">
      {/* ── Left Branding Panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-10 bg-mesh-dark overflow-hidden">
        {/* Decorative orbs */}
        <div
          className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-accent-emerald/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent-violet/5 blur-3xl"
          aria-hidden
        />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-3 group w-fit">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-400 ring-1 ring-brand-400/30 group-hover:bg-brand-500/30 transition duration-200">
            <Wrench className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-white">
            AutoFixHub
          </span>
        </Link>

        {/* Central Feature Showcase */}
        <div className="relative z-10 space-y-8">
          {/* Animated floating card */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="glass-panel p-6 max-w-xs"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-emerald/20 text-accent-emerald">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-100">AI Diagnostics</p>
                <p className="text-xs text-ink-500">Smart symptom analysis</p>
              </div>
            </div>
            <div className="space-y-2">
              {["Engine noise detected", "Brake inspection needed", "Oil change due"].map(
                (item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span className="text-xs text-ink-400">{item}</span>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: "1,200+", label: "Services Done" },
              { val: "98%", label: "Satisfaction" },
              { val: "24/7", label: "Support" },
            ].map(({ val, label }) => (
              <div key={label} className="glass-panel p-3 text-center">
                <p className="font-display text-xl font-bold text-brand-300">{val}</p>
                <p className="text-[10px] text-ink-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer tagline */}
        <p className="relative z-10 text-xs text-ink-600">
          © 2024 AutoFixHub · Premium Auto Services
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
        {/* Mobile logo */}
        <Link
          to="/"
          className="mb-8 flex items-center gap-2.5 text-ink-50 transition hover:text-brand-300 lg:hidden"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 ring-1 ring-brand-400/30">
            <Wrench className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">AutoFixHub</span>
        </Link>

        {/* Step indicator */}
        {totalSteps && (
          <div className="mb-6 flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < step
                    ? "bg-brand-400 w-8"
                    : i === step
                    ? "bg-brand-500 w-6"
                    : "bg-ink-700 w-4"
                }`}
              />
            ))}
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Card */}
          <motion.div variants={itemVariants} className="glass-panel-strong p-7 sm:p-9">
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-7 text-center">
              <h1 className="font-display text-2xl font-bold text-ink-50 sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{subtitle}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>{children}</motion.div>
          </motion.div>

          {/* Footer link */}
          {footer && (
            <motion.p
              variants={itemVariants}
              className="mt-5 text-center text-sm text-ink-400"
            >
              {footer}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;

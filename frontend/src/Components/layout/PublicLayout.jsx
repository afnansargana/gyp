import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "../Navbar";
import FooterSection from "../FooterSection";
import { useAuthStore } from "../../store/useAuthStore";
import { cn } from "../../lib/utils";

/**
 * Shared shell for customer-facing pages: nav + animated outlet + footer.
 * Staff already have a sidebar; navbar/footer stay hidden for them.
 */
export function PublicLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const role = useAuthStore((s) => s.role);
  const isStaff = role === "admin" || role === "mechanic";
  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 text-ink-900">
      {!isStaff && <Navbar />}
      <main className={cn("flex-1", !isStaff && !isHome && "pt-16")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!isStaff && <FooterSection />}
    </div>
  );
}

export default PublicLayout;

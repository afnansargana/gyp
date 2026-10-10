import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Navbar from "../../Components/Navbar";
import FooterSection from "../../Components/FooterSection";

/**
 * Shared shell for customer-facing pages: nav + animated outlet + footer.
 */
export function PublicLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 text-ink-900">
      <Navbar />
      <main className="flex-1">
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
      <FooterSection />
    </div>
  );
}

export default PublicLayout;

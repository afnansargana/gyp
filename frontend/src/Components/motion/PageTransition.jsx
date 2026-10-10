import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

export function PageTransition({ children }) {
  const location = useLocation();
  const reduce = useReducedMotion();

  if (reduce) {
    return <div key={location.pathname}>{children}</div>;
  }

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;

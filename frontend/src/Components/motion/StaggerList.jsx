import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerList({ children, className, once = true }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.15 }}
    >
      {React.Children.map(children, (child) =>
        child ? <motion.div variants={item}>{child}</motion.div> : null
      )}
    </motion.div>
  );
}

export default StaggerList;

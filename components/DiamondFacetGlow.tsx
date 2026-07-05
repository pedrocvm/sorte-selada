"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function DiamondFacetGlow({
  pulse,
  color = "#876B45",
}: {
  pulse: boolean;
  color?: string;
}) {
  return (
    <AnimatePresence>
      {pulse && (
        <motion.svg
          viewBox="0 0 24 24"
          className="w-6 h-6 inline-block"
          initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.15, 1.35], rotate: 18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          aria-hidden="true"
        >
          <polygon points="12,2 21,9 12,22 3,9" fill={color} />
        </motion.svg>
      )}
    </AnimatePresence>
  );
}

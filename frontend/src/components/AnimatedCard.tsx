"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Props = {
  children: ReactNode;
  index?: number;
};

export default function AnimatedCard({ children, index = 0 }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

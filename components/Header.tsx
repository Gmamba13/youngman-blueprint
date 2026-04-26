"use client";
import { motion } from "framer-motion";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-5 pt-12 pb-5"
    >
      {subtitle && <div className="label mb-1">{subtitle}</div>}
      <h1 className="font-display text-3xl text-primary leading-tight">{title}</h1>
    </motion.div>
  );
}

"use client";
import { motion } from "framer-motion";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* subtle gold top-right */}
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{ backgroundColor: "rgba(201,150,59,0.06)" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* subtle blue bottom-left */}
      <motion.div
        className="absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full blur-[140px]"
        style={{ backgroundColor: "rgba(74,127,165,0.05)" }}
        animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

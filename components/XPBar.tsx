"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { levelForXp } from "@/lib/levels";

export default function XPBar({ xp }: { xp: number }) {
  const { current, next, progress } = levelForXp(xp);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-4xl p-5 overflow-hidden bg-elevated"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-end justify-between mb-4 relative">
        <div>
          <div className="label mb-1">Level {current.level}</div>
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl text-primary">{current.name}</span>
            <Link
              href="/levels"
              className="w-7 h-7 rounded-full bg-stone border border-border flex items-center justify-center text-secondary active:scale-90 transition"
            >
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
        <div className="text-right">
          <div className="label mb-1">Total XP</div>
          <span className="font-display text-2xl tabular-nums text-primary">{xp.toLocaleString()}</span>
        </div>
      </div>

      {/* Bar track */}
      <div className="h-2 rounded-full bg-stone overflow-hidden relative">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #C9963B 0%, #E8A84A 60%, #F0C060 100%)",
            boxShadow: "0 0 10px rgba(201,150,59,0.45)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
        </motion.div>
      </div>

      <div className="mt-2 label">
        {next ? `${(next.xpRequired - xp).toLocaleString()} XP to ${next.name}` : "Max level reached"}
      </div>
    </motion.div>
  );
}

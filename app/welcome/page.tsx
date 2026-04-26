"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckSquare, TrendingUp, BookOpen, Layers } from "lucide-react";
import FloatingCards from "@/components/FloatingCards";

export default function WelcomePage() {
  return (
    <div className="min-h-screen px-6 pt-10 pb-8 flex flex-col relative overflow-hidden"
      style={{ background: "#F7F7F7" }}>

      {/* very subtle ambient */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: "rgba(201,150,59,0.05)" }} />

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2.5 relative z-10"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display text-sm text-white font-bold"
          style={{ background: "#0D0D0D" }}>
          Y
        </div>
        <div className="label text-primary">YoungmanBlueprint</div>
      </motion.div>

      {/* Floating cards */}
      <div className="mt-4 relative z-0">
        <FloatingCards />
      </div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="font-display text-[40px] leading-[1.05] relative z-10 mt-2 text-primary"
      >
        You're not<br />broken.<br />
        <span className="text-secondary">You're</span><br />
        <span className="text-secondary">uncoached.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="text-sm text-secondary mt-5 max-w-[300px] leading-relaxed relative z-10"
      >
        You don't need another podcast. You need a system. The Young Man Blueprint turns "I should probably get my life together" into a daily practice. one habit, one goal, one level at a time.
      </motion.p>

      {/* Feature grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-2 gap-2.5 mt-6 relative z-10"
      >
        {[
          { label: "Habits",     Icon: CheckSquare, color: "#C9963B" },
          { label: "XP & Levels",Icon: TrendingUp,  color: "#6B8E6B" },
          { label: "Workbooks",  Icon: BookOpen,    color: "#4A7FA5" },
          { label: "10 Pillars", Icon: Layers,      color: "#7B6F9E" },
        ].map(({ label, Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.06 }}
            className="rounded-2xl p-3 flex items-center gap-2.5 bg-elevated border border-border"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: color + "15" }}>
              <Icon size={16} style={{ color }} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-primary">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 relative z-10"
      >
        <Link href="/onboarding" className="btn-primary w-full">
          Begin Your Journey <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

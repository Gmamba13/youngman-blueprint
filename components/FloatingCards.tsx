"use client";
import { motion } from "framer-motion";
import { Flame, Check, Trophy } from "lucide-react";

import type { Easing } from "framer-motion";
const EASE: Easing = "easeInOut";
const float = (delay: number, amount = 7) => ({
  animate: { y: [0, -amount, 0] },
  transition: { duration: 4 + delay * 0.4, repeat: Infinity, ease: EASE, delay },
});

const card = "rounded-3xl overflow-hidden";
const glass = {
  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
  border: "1px solid rgba(0,0,0,0.06)",
};

export default function FloatingCards() {
  return (
    <div className="relative h-[260px] w-full pointer-events-none select-none">
      {/* XP / Level — top left */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -5 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute top-0 left-2"
      >
        <motion.div {...float(0)}>
          <div className={`${card} p-4 w-[172px]`} style={glass}>
            <div className="flex items-center justify-between">
              <div className="label">Level 4</div>
              <Trophy size={12} style={{ color: "#C9963B" }} />
            </div>
            <div className="font-display text-lg text-primary mt-0.5">Warrior</div>
            <div className="h-1.5 rounded-full mt-2 bg-stone overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: "64%",
                background: "linear-gradient(90deg, #C9963B, #E8A84A)",
                boxShadow: "0 0 8px rgba(201,150,59,0.4)",
              }} />
            </div>
            <div className="label mt-1.5">820 / 1,000 XP</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Streak — top right */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 6 }}
        animate={{ opacity: 1, y: 0, rotate: 6 }}
        transition={{ delay: 0.35, duration: 0.6 }}
        className="absolute top-4 right-0"
      >
        <motion.div {...float(0.9)}>
          <div className={`${card} p-4 w-[120px]`} style={{
            background: "#0D0D0D",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}>
            <Flame size={20} style={{ color: "#E8A84A" }} />
            <div className="font-display text-3xl mt-1 text-white">12</div>
            <div className="label mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>day streak</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Habit check — middle */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -3 }}
        animate={{ opacity: 1, y: 0, rotate: -3 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-[115px] left-8"
      >
        <motion.div {...float(1.5)}>
          <div className={`${card} p-3 pr-4 flex items-center gap-2.5`} style={glass}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#C9963B" }}>
              <Check size={15} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary">Workout</div>
              <div className="text-[10px] font-semibold" style={{ color: "#C9963B" }}>+20 XP</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Pillar tile — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="absolute top-[148px] right-4"
      >
        <motion.div {...float(2.1)}>
          <div className={`${card} p-3 w-[115px]`} style={{
            ...glass,
            borderLeft: "3px solid #6B8E6B",
          }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ backgroundColor: "rgba(107,142,107,0.15)" }}>💪</div>
            <div className="text-xs font-semibold text-primary mt-2">Physical</div>
            <div className="label mt-0.5">3 habits</div>
          </div>
        </motion.div>
      </motion.div>

      {/* ambient glow — barely visible on light bg */}
      <div className="absolute -z-10 top-12 left-1/3 w-48 h-48 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(201,150,59,0.05)" }} />
    </div>
  );
}

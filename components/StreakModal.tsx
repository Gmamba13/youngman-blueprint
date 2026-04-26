"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, Calendar, Trophy, Zap } from "lucide-react";
import { useStore } from "@/lib/store";

function getLast14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    return d.toISOString().slice(0, 10);
  });
}

function streakMessage(streak: number): string {
  if (streak === 0) return "Start today. Day 1 is the hardest.";
  if (streak < 3) return "You've started. Don't stop now.";
  if (streak < 7) return "Building momentum. Keep it going.";
  if (streak < 14) return "A full week. You're building something real.";
  if (streak < 30) return "Two weeks strong. This is becoming who you are.";
  if (streak < 60) return "A month in. Most people quit. You didn't.";
  return "Elite level. You're in the top 1%.";
}

export default function StreakModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { streak, habitLogs } = useStore();
  const days = getLast14Days();

  // mark a day as active if ANY habit was logged that day
  const activeDays = new Set(Object.values(habitLogs).flat());

  // best streak
  let best = 0;
  let cur = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (activeDays.has(d)) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }

  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4 pb-8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="bg-cream rounded-[2.5rem] shadow-lift overflow-hidden">
              {/* Header */}
              <div className="relative bg-ink px-6 pt-8 pb-10 overflow-hidden">
                <motion.div
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-clay/30 blur-3xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-sun/20 blur-3xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />

                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cream"
                >
                  <X size={15} />
                </button>

                <div className="text-[10px] text-cream/60 uppercase tracking-[0.22em]">
                  Daily Streak
                </div>

                <div className="flex items-end gap-4 mt-2 relative">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], rotate: [-4, 4, -4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Flame size={48} className="text-clay" />
                  </motion.div>
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display text-6xl text-cream leading-none"
                    >
                      {streak}
                    </motion.div>
                    <div className="text-cream/60 text-sm">days</div>
                  </div>
                </div>

                <p className="text-cream/80 text-sm mt-4 relative">
                  {streakMessage(streak)}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 px-5 -mt-5 relative z-10">
                <div className="bg-white rounded-3xl shadow-soft p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-clay/15 flex items-center justify-center">
                    <Flame size={18} className="text-clay" />
                  </div>
                  <div>
                    <div className="font-display text-xl">{streak}</div>
                    <div className="text-[11px] text-muted">Current</div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl shadow-soft p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sun/20 flex items-center justify-center">
                    <Trophy size={18} className="text-ink" />
                  </div>
                  <div>
                    <div className="font-display text-xl">{best}</div>
                    <div className="text-[11px] text-muted">Best</div>
                  </div>
                </div>
              </div>

              {/* 14-day calendar */}
              <div className="px-5 mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={13} className="text-muted" />
                  <span className="text-[10px] text-muted uppercase tracking-wider">Last 14 days</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {dayLabels.map((l) => (
                    <div key={l} className="text-center text-[9px] text-muted uppercase tracking-wider pb-1">
                      {l}
                    </div>
                  ))}
                  {days.map((d, i) => {
                    const active = activeDays.has(d);
                    const isToday = d === new Date().toISOString().slice(0, 10);
                    return (
                      <motion.div
                        key={d}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
                        className={`aspect-square rounded-xl flex items-center justify-center relative ${
                          active ? "bg-ink" : "bg-sand"
                        } ${isToday ? "ring-2 ring-clay ring-offset-1" : ""}`}
                      >
                        {active && (
                          <Flame size={12} className="text-cream" />
                        )}
                        {!active && isToday && (
                          <Zap size={11} className="text-muted" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="px-5 py-5">
                <button
                  onClick={onClose}
                  className="btn-primary w-full"
                >
                  Keep the streak going
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

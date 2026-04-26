"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { useStore, isHabitDoneToday, habitStreak } from "@/lib/store";

export default function HabitItem({
  id, title, xp, accent = "#C9963B",
}: {
  id: string; title: string; xp: number; accent?: string;
}) {
  const logs   = useStore((s) => s.habitLogs);
  const toggle = useStore((s) => s.toggleHabit);
  const done   = isHabitDoneToday(logs, id);
  const streak = habitStreak(logs, id);
  const [popKey, setPopKey]     = useState(0);
  const [showPop, setShowPop]   = useState(false);

  const handleToggle = () => {
    const wasDone = isHabitDoneToday(useStore.getState().habitLogs, id);
    toggle(id, xp);
    if (!wasDone) {
      setPopKey((k) => k + 1);
      setShowPop(true);
      setTimeout(() => setShowPop(false), 900);
    }
  };

  return (
    <motion.button
      layout
      whileTap={{ scale: 0.97 }}
      onClick={handleToggle}
      className="w-full flex items-center gap-3 p-4 rounded-3xl bg-elevated relative overflow-visible transition-all"
      style={{
        boxShadow: done
          ? `0 2px 16px ${accent}22, 0 1px 4px rgba(0,0,0,0.06)`
          : "0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
        borderLeft: done ? `3px solid ${accent}` : "3px solid transparent",
      }}
      animate={{ scale: 1 }}
    >
      {/* ripple */}
      {done && (
        <motion.div
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute left-5 top-1/2 w-10 h-10 rounded-full -translate-y-1/2 pointer-events-none"
          style={{ backgroundColor: accent + "40" }}
        />
      )}

      {/* XP pop */}
      <AnimatePresence>
        {showPop && (
          <motion.div
            key={popKey}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -48, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-50"
          >
            <div
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
              style={{
                background: accent,
                boxShadow: `0 4px 16px ${accent}55`,
              }}
            >
              ✦ +{xp} XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* checkbox */}
      <motion.div
        animate={{
          borderColor: done ? accent : "#D1D5DB",
          backgroundColor: done ? accent : "transparent",
        }}
        transition={{ duration: 0.25 }}
        className="w-9 h-9 rounded-2xl flex items-center justify-center border-2 shrink-0"
      >
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
            >
              <Check size={17} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* label */}
      <div className="flex-1 text-left">
        <div className={`font-medium text-sm ${done ? "line-through text-secondary" : "text-primary"}`}>
          {title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-semibold" style={{ color: accent }}>+{xp} XP</span>
          {streak > 0 && (
            <span className="text-[11px] flex items-center gap-0.5 text-secondary">
              <Flame size={10} className="text-clay" /> {streak}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

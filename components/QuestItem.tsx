"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, X } from "lucide-react";
import { useStore, isHabitDoneToday, habitStreak, QUEST_XP } from "@/lib/store";

export default function QuestItem({ id, title }: { id: string; title: string }) {
  const logs   = useStore((s) => s.habitLogs);
  const toggle = useStore((s) => s.toggleHabit);
  const remove = useStore((s) => s.removeQuest);
  const done   = isHabitDoneToday(logs, id);
  const streak = habitStreak(logs, id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -30, scale: 0.93 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="w-full flex items-center gap-3 p-4 rounded-3xl bg-elevated relative overflow-visible transition-all"
      style={{
        boxShadow: done
          ? "0 2px 16px rgba(201,150,59,0.15), 0 1px 4px rgba(0,0,0,0.06)"
          : "0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
        borderLeft: done ? "3px solid #C9963B" : "3px solid transparent",
      }}
    >
      {/* ripple */}
      {done && (
        <motion.div
          initial={{ scale: 0, opacity: 0.3 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute left-5 top-1/2 w-10 h-10 rounded-full -translate-y-1/2 pointer-events-none"
          style={{ backgroundColor: "rgba(201,150,59,0.3)" }}
        />
      )}

      {/* checkbox */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => toggle(id, QUEST_XP)}
        animate={{
          borderColor: done ? "#C9963B" : "#D1D5DB",
          backgroundColor: done ? "#C9963B" : "transparent",
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
      </motion.button>

      {/* label */}
      <button onClick={() => toggle(id, QUEST_XP)} className="flex-1 text-left">
        <div className={`font-medium text-sm ${done ? "line-through text-secondary" : "text-primary"}`}>{title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-semibold" style={{ color: "#C9963B" }}>+{QUEST_XP} XP</span>
          {streak > 0 && (
            <span className="text-[11px] flex items-center gap-0.5 text-secondary">
              <Flame size={10} className="text-clay" /> {streak}
            </span>
          )}
        </div>
      </button>

      {/* delete */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => { if (confirm(`Delete "${title}"?`)) remove(id); }}
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-stone border border-border text-secondary"
      >
        <X size={13} />
      </motion.button>
    </motion.div>
  );
}

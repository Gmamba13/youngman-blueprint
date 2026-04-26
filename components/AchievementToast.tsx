"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { ACHIEVEMENT_BY_ID, RARITY_COLORS } from "@/lib/achievements";

export default function AchievementToast() {
  const newAchievement = useStore((s) => s.newAchievement);
  const dismissAchievement = useStore((s) => s.dismissAchievement);

  useEffect(() => {
    if (!newAchievement) return;
    const t = setTimeout(dismissAchievement, 3500);
    return () => clearTimeout(t);
  }, [newAchievement, dismissAchievement]);

  const ach = newAchievement ? ACHIEVEMENT_BY_ID[newAchievement] : null;

  return (
    <AnimatePresence>
      {ach && (
        <motion.div
          key={ach.id}
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[88%] max-w-[380px]"
          onClick={dismissAchievement}
        >
          <div
            className="rounded-3xl bg-void px-4 py-3 flex items-center gap-3"
            style={{ boxShadow: `0 8px 40px rgba(0,0,0,0.25), 0 0 0 1px ${RARITY_COLORS[ach.rarity]}44` }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: RARITY_COLORS[ach.rarity] + "22", border: `1px solid ${RARITY_COLORS[ach.rarity]}44` }}
            >
              {ach.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: RARITY_COLORS[ach.rarity] }}>
                Achievement Unlocked
              </div>
              <div className="font-display text-sm text-white leading-tight mt-0.5">{ach.title}</div>
              <div className="text-xs text-white/50 mt-0.5 truncate">{ach.description}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

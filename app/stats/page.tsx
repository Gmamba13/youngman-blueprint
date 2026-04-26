"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore, isHabitDoneOn, habitStreak } from "@/lib/store";
import { levelForXp } from "@/lib/levels";
import XPBar from "@/components/XPBar";
import ShareCard from "@/components/ShareCard";
import { Flame, Trophy, CheckSquare, Calendar } from "lucide-react";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  const dow = new Date(dateStr + "T12:00:00").getDay(); // 0=Sun
  const map = [6, 0, 1, 2, 3, 4, 5]; // Sun=6, Mon=0, ...
  return DAY_LABELS[map[dow]];
}

export default function StatsPage() {
  const { xp, streak, habitLogs, dailyHabits } = useStore();

  const totalCheckIns = useMemo(
    () => Object.values(habitLogs).reduce((a, b) => a + b.length, 0),
    [habitLogs]
  );

  const daysActive = useMemo(
    () => new Set(Object.values(habitLogs).flat()).size,
    [habitLogs]
  );

  // Best streak: scan 365 days backwards for consecutive active days
  const bestStreak = useMemo(() => {
    let best = 0;
    let current = 0;
    const allDates = new Set(Object.values(habitLogs).flat());
    for (let i = 0; i < 365; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      if (allDates.has(d)) {
        current++;
        if (current > best) best = current;
      } else {
        current = 0;
      }
    }
    return best;
  }, [habitLogs]);

  // Weekly chart: last 7 days, count distinct habits logged each day
  const last7 = useMemo(() => getLast7Days(), []);
  const weeklyData = useMemo(() => {
    return last7.map((date) => {
      const count = Object.values(habitLogs).filter((dates) => dates.includes(date)).length;
      return { date, count, label: getDayLabel(date) };
    });
  }, [last7, habitLogs]);

  const maxWeekly = Math.max(...weeklyData.map((d) => d.count), 1);

  // Habit consistency: top 5 daily habits by streak
  const topHabits = useMemo(() => {
    return [...dailyHabits]
      .map((h) => ({ habit: h, streak: habitStreak(habitLogs, h.id) }))
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [dailyHabits, habitLogs]);

  // 14-day dot grid for a habit
  const getLast14 = useMemo(() => {
    const days: string[] = [];
    for (let i = 13; i >= 0; i--) {
      days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
    }
    return days;
  }, []);

  const summaryStats = [
    { label: "Current Streak", value: streak, Icon: Flame, color: "#C9963B" },
    { label: "Best Streak", value: bestStreak, Icon: Trophy, color: "#9BB8C9" },
    { label: "Total Check-ins", value: totalCheckIns, Icon: CheckSquare, color: "#6B8E6B" },
    { label: "Days Active", value: daysActive, Icon: Calendar, color: "#B9A7C9" },
  ];

  return (
    <div className="pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 pt-12 pb-5"
      >
        <div className="label mb-1">Stats</div>
        <h1 className="font-display text-3xl text-primary leading-tight">Your Progress</h1>
      </motion.div>

      {/* Summary grid */}
      <div className="px-5 grid grid-cols-2 gap-3">
        {summaryStats.map(({ label, value, Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card"
          >
            <Icon size={16} style={{ color }} />
            <div className="font-display text-2xl mt-1 text-primary">{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* This week chart */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="px-5 mt-6"
      >
        <div className="label mb-3">This week</div>
        <div className="card">
          <div className="flex items-end justify-between gap-1.5 h-28 pt-4">
            {weeklyData.map(({ date, count, label }) => {
              const heightPct = count === 0 ? 4 : Math.max(8, (count / maxWeekly) * 100);
              const isToday = date === new Date().toISOString().slice(0, 10);
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[10px] text-muted">{count > 0 ? count : ""}</div>
                  <div className="w-full flex items-end justify-center" style={{ height: 72 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                      className="w-full rounded-t-lg"
                      style={{
                        background: count === 0 ? "#F0F0F0" : "#C9963B",
                        opacity: isToday ? 1 : 0.8,
                      }}
                    />
                  </div>
                  <div className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted"}`}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Habit consistency */}
      {topHabits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="px-5 mt-6"
        >
          <div className="label mb-3">Habit consistency</div>
          <div className="card space-y-4">
            {topHabits.map(({ habit, streak: s }) => (
              <div key={habit.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-primary font-medium truncate">{habit.title}</span>
                  <span className="text-xs text-gold font-semibold shrink-0 ml-2">{s} day streak</span>
                </div>
                <div className="flex gap-1">
                  {getLast14.map((date) => {
                    const done = isHabitDoneOn(habitLogs, habit.id, date);
                    return (
                      <div
                        key={date}
                        className="flex-1 h-2.5 rounded-sm"
                        style={{ background: done ? "#C9963B" : "#F0F0F0" }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {topHabits.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="px-5 mt-6"
        >
          <div className="label mb-3">Habit consistency</div>
          <div className="rounded-3xl border border-dashed border-border py-10 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-muted">Add habits to track consistency.</p>
          </div>
        </motion.div>
      )}

      {/* XP Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="px-5 mt-6"
      >
        <div className="label mb-3">XP Breakdown</div>
        <div className="card">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="font-display text-4xl text-primary">{xp.toLocaleString()}</div>
              <div className="text-xs text-muted mt-1">all time</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted mb-1">Level {levelForXp(xp).current.level}</div>
              <div className="text-sm font-display text-primary">{levelForXp(xp).current.name}</div>
            </div>
          </div>
          <XPBar xp={xp} />
        </div>
      </motion.div>

      {/* Share progress */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.30 }}
        className="px-5 mt-6"
      >
        <div className="label mb-3">Share</div>
        <ShareCard />
      </motion.div>
    </div>
  );
}

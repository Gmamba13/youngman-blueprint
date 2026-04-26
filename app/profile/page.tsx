"use client";
import Link from "next/link";
import Header from "@/components/Header";
import XPBar from "@/components/XPBar";
import RadarChart from "@/components/RadarChart";
import { useStore, isHabitDoneToday } from "@/lib/store";
import { PILLARS } from "@/lib/pillars";
import { Flame, Trophy, CheckSquare, RefreshCw, Mail, BarChart2, ArrowRight, Activity, LogOut, Bell, BellOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ACHIEVEMENTS, RARITY_COLORS, RARITY_LABELS } from "@/lib/achievements";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { requestNotificationPermission, scheduleReminder, cancelReminder } from "@/lib/notifications";

export default function ProfilePage() {
  const { name, age, xp, streak, habitLogs, pillarScores, assessmentDone, letterWrittenAt, letterRevealed, letterLockDays, reset, unlockedAchievements, notificationsEnabled, notificationTime, setNotificationSettings } = useStore();
  const [notifLoading, setNotifLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleNotifToggle = async () => {
    setNotifLoading(true);
    try {
      if (notificationsEnabled) {
        await cancelReminder();
        setNotificationSettings(false, notificationTime);
      } else {
        const granted = await requestNotificationPermission();
        if (!granted) { setNotifLoading(false); return; }
        const [h, m] = notificationTime.split(":").map(Number);
        await scheduleReminder(h, m);
        setNotificationSettings(true, notificationTime);
      }
    } finally {
      setNotifLoading(false);
    }
  };

  const handleTimeChange = async (time: string) => {
    setNotificationSettings(notificationsEnabled, time);
    if (notificationsEnabled) {
      const [h, m] = time.split(":").map(Number);
      await scheduleReminder(h, m);
    }
  };
  const daysUntilUnlock = letterWrittenAt
    ? Math.max(0, Math.ceil((new Date(letterWrittenAt).getTime() + letterLockDays * 86400000 - Date.now()) / 86400000))
    : null;

  const totalHabits = PILLARS.flatMap((p) => p.habits);
  const doneToday = totalHabits.filter((h) => isHabitDoneToday(habitLogs, h.id)).length;
  const totalCheckins = Object.values(habitLogs).reduce((a, b) => a + b.length, 0);

  const stats = [
    { label: "Streak", value: streak, Icon: Flame },
    { label: "Done today", value: `${doneToday}/${totalHabits.length}`, Icon: CheckSquare },
    { label: "Total check-ins", value: totalCheckins, Icon: Trophy },
  ];

  return (
    <div className="pb-32">
      <Header subtitle="Your progress" title={name || "Profile"} />
      <div className="px-5">
        <div className="text-xs text-muted">{age ? `${age} years old` : ""}</div>
      </div>

      <div className="px-5 mt-4">
        <XPBar xp={xp} />
      </div>

      <div className="px-5 mt-5 grid grid-cols-2 gap-3">
        {stats.map(({ label, value, Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`card ${i === 2 ? "col-span-2" : ""}`}
          >
            <Icon size={16} className="text-muted" />
            <div className="font-display text-2xl mt-1">{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* View Stats card */}
      <div className="px-5 mt-4">
        <Link href="/stats">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-4xl overflow-hidden bg-void active:scale-[0.98] transition"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
          >
            <div className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <BarChart2 size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Analytics</div>
                <div className="font-display text-base text-white leading-tight mt-0.5">Detailed Stats</div>
                <div className="text-xs text-white/50 mt-0.5">Habits · Streaks · Progress</div>
              </div>
              <ArrowRight size={16} className="text-white/30 shrink-0" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Blueprint Radar */}
      <div className="px-5 mt-5">
        <div className="card">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="text-[10px] text-muted uppercase tracking-[0.2em]">Life map</div>
              <h2 className="font-display text-xl mt-0.5">Blueprint Radar</h2>
            </div>
            <Link
              href="/assessment"
              className="flex items-center gap-1.5 text-xs text-muted bg-sand rounded-full px-3 py-1.5"
            >
              <RefreshCw size={11} />
              {assessmentDone ? "Retake" : "Take assessment"}
            </Link>
          </div>

          {assessmentDone ? (
            <RadarChart scores={pillarScores} />
          ) : (
            <div className="py-10 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-sm text-muted">Take the Blueprint Assessment to see your life radar.</p>
              <Link href="/assessment" className="btn-primary inline-flex mt-4 text-sm">
                Start Assessment
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-6 mb-4">
        <Link href="/assessment/results" className={!assessmentDone ? "pointer-events-none opacity-40" : ""}>
          <div className="btn-ghost w-full">View full results</div>
        </Link>
      </div>

      {/* Letter to Future Self */}
      <div className="px-5 mt-5">
        <Link href="/letter">
          <div className="relative rounded-4xl overflow-hidden bg-void" style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
            <div className="p-5 flex items-center gap-3">
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-3xl shrink-0">✉️</motion.div>
              <div className="flex-1">
                <div className="text-[10px] text-white/50 uppercase tracking-[0.2em]">Time capsule</div>
                <div className="font-display text-base text-white leading-tight mt-0.5">Letter to Future You</div>
                <div className="text-xs text-white/50 mt-0.5">
                  {!letterWrittenAt ? "Not written yet" : letterRevealed ? "Read your letter" : `Sealed · ${daysUntilUnlock} days left`}
                </div>
              </div>
              <Mail size={16} className="text-white/30 shrink-0" />
            </div>
          </div>
        </Link>
      </div>

      {/* Body Metrics link */}
      <div className="px-5 mt-4">
        <Link href="/metrics">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card flex items-center gap-3 active:scale-[0.98] transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-stone flex items-center justify-center shrink-0">
              <Activity size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-primary">Body Metrics</div>
              <div className="text-xs text-muted mt-0.5">Weight, sleep &amp; custom tracking</div>
            </div>
            <ArrowRight size={14} className="text-muted shrink-0" />
          </motion.div>
        </Link>
      </div>

      {/* Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="px-5 mt-5"
      >
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: notificationsEnabled ? "#C9963B" : "#F2F2F2" }}>
                {notificationsEnabled
                  ? <Bell size={18} color="#fff" />
                  : <BellOff size={18} color="#AAAAAA" />}
              </div>
              <div>
                <div className="text-sm font-semibold text-primary">Daily Reminder</div>
                <div className="text-xs text-muted mt-0.5">
                  {notificationsEnabled ? `Fires at ${notificationTime} every day` : "Off"}
                </div>
              </div>
            </div>
            <button
              onClick={handleNotifToggle}
              disabled={notifLoading}
              className="relative w-12 h-7 rounded-full transition-colors duration-200 shrink-0"
              style={{ background: notificationsEnabled ? "#C9963B" : "#E8E8E8" }}
              aria-label="Toggle notifications"
            >
              <span
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200"
                style={{ left: notificationsEnabled ? "calc(100% - 24px)" : "4px" }}
              />
            </button>
          </div>
          {notificationsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border flex items-center justify-between"
            >
              <span className="text-sm text-secondary">Reminder time</span>
              <input
                type="time"
                value={notificationTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="text-sm font-semibold text-primary bg-stone rounded-xl px-3 py-2 border border-border"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Badges */}
      <div className="px-5 mt-6">
        <div className="label mb-3">Badges</div>
        <div className="grid grid-cols-3 gap-2.5">
          {ACHIEVEMENTS.map((ach, i) => {
            const unlocked = unlockedAchievements.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-3xl p-3 flex flex-col items-center gap-1.5 text-center border"
                style={{
                  background: unlocked ? RARITY_COLORS[ach.rarity] + "0D" : "#F7F7F7",
                  borderColor: unlocked ? RARITY_COLORS[ach.rarity] + "44" : "#E8E8E8",
                  boxShadow: unlocked ? `0 2px 12px ${RARITY_COLORS[ach.rarity]}22` : "none",
                }}
              >
                <div className="text-2xl" style={{ filter: unlocked ? "none" : "grayscale(1) opacity(0.35)" }}>
                  {ach.emoji}
                </div>
                <div className="text-[10px] font-semibold leading-tight" style={{ color: unlocked ? "#0D0D0D" : "#AAAAAA" }}>
                  {ach.title}
                </div>
                {unlocked && (
                  <div
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{ background: RARITY_COLORS[ach.rarity] + "22", color: RARITY_COLORS[ach.rarity] }}
                  >
                    {RARITY_LABELS[ach.rarity]}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-5 mt-4">
        <button
          onClick={handleSignOut}
          className="btn-ghost w-full flex items-center justify-center gap-2"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

      <div className="px-5 mt-3">
        <button
          onClick={() => {
            if (confirm("Reset all progress? This can't be undone.")) reset();
          }}
          className="btn-ghost w-full text-clay"
        >
          Reset all progress
        </button>
      </div>

      <div className="px-5 mt-3 mb-2">
        <Link href="/delete-account">
          <div className="btn-ghost w-full text-red-500 flex items-center justify-center gap-2 text-sm">
            Delete Account
          </div>
        </Link>
      </div>
    </div>
  );
}

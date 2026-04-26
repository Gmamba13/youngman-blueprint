"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  useStore,
  isHabitDoneToday,
  isHabitDoneOn,
  isHabitScheduledOn,
  QUEST_XP,
  MAX_QUESTS,
  type DailyHabit,
  type CustomQuest,
} from "@/lib/store";
import { PILLARS } from "@/lib/pillars";
import { topFocusPillar, suggestedQuestTitles, FOCUS_MESSAGES } from "@/lib/personalization";
import { levelForXp } from "@/lib/levels";
import QuestItem from "@/components/QuestItem";
import StreakModal from "@/components/StreakModal";
import { Flame, Plus, X, Sparkles, ArrowRight, Lock } from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--)
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
  return days;
}

// ─── time config ──────────────────────────────────────────────────────────────

const TIME_BANDS = [
  { start: 5,  end: 12, label: "Morning",   icon: "☀️",  accent: "#C9963B", bg: "#FFFBF2" },
  { start: 12, end: 17, label: "Afternoon", icon: "⚡",  accent: "#7BAABF", bg: "#F2F8FC" },
  { start: 17, end: 21, label: "Evening",   icon: "🌅",  accent: "#E86B3A", bg: "#FFF5F0" },
  { start: 21, end: 24, label: "Night",     icon: "🌙",  accent: "#9B8AB9", bg: "#F5F2FA" },
  { start: 0,  end: 5,  label: "Night",     icon: "🌙",  accent: "#9B8AB9", bg: "#F5F2FA" },
];

// ─── CountUp ──────────────────────────────────────────────────────────────────

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ctrl = animate(0, to, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => { if (node) node.textContent = Math.round(v) + suffix; },
    });
    return () => ctrl.stop();
  }, [to, suffix]);
  return <span ref={ref}>{to}{suffix}</span>;
}

// ─── CompletionRing ───────────────────────────────────────────────────────────

function CompletionRing({ done, total }: { done: number; total: number }) {
  const r = 11;
  const circ = 2 * Math.PI * r;
  const pct = total === 0 ? 0 : done / total;
  const offset = circ * (1 - pct);
  const complete = total > 0 && done === total;
  return (
    <svg width={26} height={26} viewBox="0 0 26 26">
      <circle cx={13} cy={13} r={r} fill="none" stroke="#F0F0F0" strokeWidth={2.5} />
      <motion.circle
        cx={13} cy={13} r={r}
        fill="none"
        stroke={complete ? "#6B8E6B" : "#C9963B"}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        transform="rotate(-90 13 13)"
      />
    </svg>
  );
}

// ─── LevelArcCard ─────────────────────────────────────────────────────────────

function LevelArcCard({ xp }: { xp: number }) {
  const { current, next, progress } = levelForXp(xp);
  const r = 38;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * 0.75;
  const fillLen = arcLen * progress;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card flex flex-col items-center justify-center gap-0 py-4"
    >
      <div className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Level</div>
      <div className="relative">
        <svg width={96} height={96} viewBox="0 0 96 96">
          {/* track */}
          <circle
            cx={48} cy={48} r={r}
            fill="none" stroke="#F0F0F0" strokeWidth={7}
            strokeDasharray={`${arcLen} ${circ - arcLen}`}
            strokeLinecap="round"
            transform="rotate(135 48 48)"
          />
          {/* progress */}
          <motion.circle
            cx={48} cy={48} r={r}
            fill="none" stroke="#C9963B" strokeWidth={7}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${fillLen} ${circ - fillLen}` }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.3 }}
            transform="rotate(135 48 48)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-3xl text-primary leading-none">{current.level}</div>
        </div>
      </div>
      <div className="font-display text-sm text-primary mt-1">{current.name}</div>
      {next && (
        <div className="text-[9px] text-muted mt-0.5 text-center">
          {xp.toLocaleString()} / {next.xpRequired.toLocaleString()} XP
        </div>
      )}
    </motion.div>
  );
}

// ─── WeeklyBarsCard ───────────────────────────────────────────────────────────

function WeeklyBarsCard({
  habitLogs,
  dailyHabits,
  customQuests,
}: {
  habitLogs: Record<string, string[]>;
  dailyHabits: DailyHabit[];
  customQuests: CustomQuest[];
}) {
  const days = useMemo(() => getLast7Days(), []);
  const todayStr = new Date().toISOString().slice(0, 10);
  const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const data = useMemo(
    () =>
      days.map((date) => {
        const scheduled = dailyHabits.filter((h) => isHabitScheduledOn(h, date));
        const done =
          scheduled.filter((h) => isHabitDoneOn(habitLogs, h.id, date)).length +
          customQuests.filter((q) => (habitLogs[q.id] ?? []).includes(date)).length;
        return { date, done };
      }),
    [days, habitLogs, dailyHabits, customQuests]
  );

  const max = Math.max(...data.map((d) => d.done), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="card flex flex-col gap-2 py-4 px-3"
    >
      <div className="text-[10px] text-muted uppercase tracking-[0.15em]">This week</div>
      <div className="flex items-end justify-between gap-1 mt-1" style={{ height: 68 }}>
        {data.map(({ date, done }) => {
          const isToday = date === todayStr;
          const heightPct = done === 0 ? 5 : Math.max(10, (done / max) * 100);
          const dow = new Date(date + "T12:00:00").getDay();
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end" style={{ height: 52 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="w-full rounded-t-sm"
                  style={{
                    background: done === 0 ? "#F0F0F0" : isToday ? "#C9963B" : "#C9963B55",
                  }}
                />
              </div>
              <div className={`text-[8px] font-medium ${isToday ? "text-primary" : "text-muted"}`}>
                {DAY_LABELS[dow]}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── PillarScoreRow ───────────────────────────────────────────────────────────

function PillarScoreRow({
  scores,
  assessmentDone,
}: {
  scores: Record<string, number>;
  assessmentDone: boolean;
}) {
  return (
    <div className="mt-6">
      <div className="px-5 flex items-center justify-between mb-3">
        <h2 className="font-display text-xl text-primary">Pillars</h2>
        <Link href="/pillars" className="text-xs text-secondary">
          See all →
        </Link>
      </div>
      <div
        className="flex gap-2 overflow-x-auto px-5 pb-1"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {PILLARS.map((pillar, i) => {
          const score = scores[pillar.slug] ?? 0;
          const r = 22;
          const circ = 2 * Math.PI * r;
          const arcLen = circ * 0.75;
          const fillLen = assessmentDone ? arcLen * (score / 10) : 0;

          return (
            <Link key={pillar.slug} href={`/pillars/${pillar.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="flex flex-col items-center gap-1 active:scale-95 transition shrink-0"
                style={{ width: 60 }}
              >
                <div className="relative">
                  <svg width={52} height={52} viewBox="0 0 52 52">
                    {/* tinted bg */}
                    <circle cx={26} cy={26} r={20} fill={pillar.color + "12"} />
                    {/* track */}
                    <circle
                      cx={26} cy={26} r={r}
                      fill="none" stroke="#EBEBEB" strokeWidth={3.5}
                      strokeDasharray={`${arcLen} ${circ - arcLen}`}
                      strokeLinecap="round"
                      transform="rotate(135 26 26)"
                    />
                    {/* fill */}
                    <motion.circle
                      cx={26} cy={26} r={r}
                      fill="none"
                      stroke={pillar.color}
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      initial={{ strokeDasharray: `0 ${circ}` }}
                      animate={{ strokeDasharray: `${fillLen} ${circ - fillLen}` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 + i * 0.04 }}
                      transform="rotate(135 26 26)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-base leading-none">
                    {pillar.emoji}
                  </div>
                </div>
                <div className="font-display text-[11px] font-bold text-primary leading-none">
                  {assessmentDone ? score : "—"}
                </div>
                <div
                  className="text-[9px] text-muted text-center leading-tight truncate w-full text-center"
                >
                  {pillar.name.split(" ")[0]}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const {
    onboarded,
    name,
    occupation,
    xp,
    streak,
    focusPillars,
    struggles,
    why,
    habitLogs,
    customQuests,
    addQuest,
    letterWrittenAt,
    letterLockDays,
    letterRevealed,
    dailyHabits,
    journalEntries,
    pillarScores,
    assessmentDone,
  } = useStore();

  const daysUntilUnlock = letterWrittenAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(letterWrittenAt).getTime() + letterLockDays * 86400000 - Date.now()) /
            86400000
        )
      )
    : null;

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [streakOpen, setStreakOpen] = useState(false);

  const todayStr = new Date().toISOString().slice(0, 10);
  const hour = new Date().getHours();
  const timeBand =
    TIME_BANDS.find((t) => hour >= t.start && hour < t.end) ?? TIME_BANDS[0];

  // Habits scheduled + done today
  const habitsScheduledToday = useMemo(
    () => dailyHabits.filter((h) => isHabitScheduledOn(h, todayStr)),
    [dailyHabits, todayStr]
  );
  const habitsDoneToday = useMemo(
    () => habitsScheduledToday.filter((h) => isHabitDoneOn(habitLogs, h.id, todayStr)).length,
    [habitsScheduledToday, habitLogs, todayStr]
  );

  // XP earned today
  const xpToday = useMemo(() => {
    const habitXp = habitsScheduledToday
      .filter((h) => isHabitDoneOn(habitLogs, h.id, todayStr))
      .reduce((sum, h) => sum + h.xp, 0);
    const questXp =
      customQuests.filter((q) => (habitLogs[q.id] ?? []).includes(todayStr)).length * QUEST_XP;
    return habitXp + questXp;
  }, [habitsScheduledToday, habitLogs, todayStr, customQuests]);

  const journalToday = !!journalEntries[todayStr];
  const questsDone = customQuests.filter((q) => isHabitDoneToday(habitLogs, q.id)).length;
  const atLimit = customQuests.length >= MAX_QUESTS;

  const todayPillar = topFocusPillar(struggles, focusPillars);
  const todayMessage = FOCUS_MESSAGES[todayPillar.slug] || todayPillar.tagline;

  const suggestions = suggestedQuestTitles(struggles, focusPillars, occupation, 5);
  const existingTitles = new Set(customQuests.map((q) => q.title.toLowerCase()));
  const unusedSuggestions = suggestions.filter((s) => !existingTitles.has(s.toLowerCase()));

  useEffect(() => {
    if (!onboarded) router.replace("/welcome");
    else if (!useStore.getState().assessmentDone) router.replace("/assessment");
  }, [onboarded, router]);

  if (!onboarded) return null;

  const submit = () => {
    if (!draft.trim() || atLimit) return;
    const ok = addQuest(draft);
    if (ok) { setDraft(""); setAdding(false); }
  };

  return (
    <div className="pb-36">

      {/* ── Time-aware hero ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-5 mt-10 rounded-4xl overflow-hidden relative"
        style={{ background: timeBand.bg, boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
      >
        {/* ambient glow */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: timeBand.accent }}
        />
        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-base leading-none">{timeBand.icon}</span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: timeBand.accent }}
                >
                  {timeBand.label}
                </span>
              </div>
              <h1 className="font-display text-[2rem] leading-none text-primary">
                {name || "Brother"}
              </h1>
              {occupation && (
                <div className="text-xs text-secondary mt-1 capitalize">{occupation}</div>
              )}
              <div className="text-[11px] text-secondary mt-2">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {why && (
                <div
                  className="mt-3 pl-3"
                  style={{ borderLeft: `2px solid ${timeBand.accent}` }}
                >
                  <p
                    className="text-xs leading-relaxed italic"
                    style={{ color: timeBand.accent }}
                  >
                    &ldquo;{why}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Streak pill */}
            <motion.button
              onClick={() => setStreakOpen(true)}
              whileTap={{ scale: 0.92 }}
              animate={streak > 0 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-1.5 bg-white rounded-full px-3 py-1.5 border border-border shrink-0 mt-0.5"
              style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}
            >
              <motion.div
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Flame size={14} className="text-clay" />
              </motion.div>
              <span className="text-sm font-semibold text-primary">{streak}</span>
            </motion.button>
          </div>
        </div>
        <StreakModal open={streakOpen} onClose={() => setStreakOpen(false)} />
      </motion.div>

      {/* ── At a Glance ──────────────────────────────────────────── */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        {(
          [
            {
              emoji: "🔥",
              label: "Day streak",
              content: <CountUp to={streak} />,
              delay: 0.06,
              dim: false,
            },
            {
              emoji: "✅",
              label: "Habits today",
              content: (
                <span>
                  {habitsDoneToday}
                  <span className="text-secondary text-lg">
                    /{habitsScheduledToday.length || "0"}
                  </span>
                </span>
              ),
              delay: 0.1,
              dim: false,
            },
            {
              emoji: "⚡",
              label: "XP today",
              content: <CountUp to={xpToday} suffix=" xp" />,
              delay: 0.14,
              dim: false,
            },
            {
              emoji: "📖",
              label: "Journal",
              content: <span>{journalToday ? "Done ✓" : "Not yet"}</span>,
              delay: 0.18,
              dim: !journalToday,
            },
          ] as const
        ).map(({ emoji, label, content, delay, dim }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="card"
          >
            <div className="text-xl mb-1 leading-none">{emoji}</div>
            <div
              className={`font-display text-2xl leading-tight mt-1 ${
                dim ? "text-secondary" : "text-primary"
              }`}
            >
              {content}
            </div>
            <div className="text-xs text-muted mt-0.5">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Level arc + Weekly bars ───────────────────────────────── */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <LevelArcCard xp={xp} />
        <WeeklyBarsCard
          habitLogs={habitLogs}
          dailyHabits={dailyHabits}
          customQuests={customQuests}
        />
      </div>

      {/* ── Today's Focus ─────────────────────────────────────────── */}
      <div className="px-5 mt-4">
        <Link href={`/pillars/${todayPillar.slug}`} className="block">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="rounded-4xl p-5 bg-elevated active:scale-[0.98] transition relative overflow-hidden"
            style={{
              boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
              borderLeft: `3px solid ${todayPillar.color}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={13} className="text-secondary" />
                <div className="text-[10px] text-secondary uppercase tracking-[0.2em]">
                  Today&apos;s focus
                </div>
              </div>
              <ArrowRight size={15} className="text-secondary" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: todayPillar.color + "18" }}
              >
                {todayPillar.emoji}
              </div>
              <div>
                <div className="font-display text-xl leading-tight text-primary">
                  {todayPillar.name}
                </div>
                <div className="text-xs text-secondary">{todayPillar.tagline}</div>
              </div>
            </div>
            <p className="text-sm text-secondary mt-3 leading-relaxed">{todayMessage}</p>
          </motion.div>
        </Link>
      </div>

      {/* ── Today's Quests ────────────────────────────────────────── */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-primary">Today&apos;s Quests</h2>
          <div className="flex items-center gap-2">
            <CompletionRing done={questsDone} total={customQuests.length} />
            <span className="text-xs font-semibold text-secondary tabular-nums">
              {questsDone}/{customQuests.length}
            </span>
            <button
              onClick={() => setAdding((v) => !v)}
              disabled={atLimit && !adding}
              className="w-8 h-8 rounded-full bg-void text-white flex items-center justify-center active:scale-95 disabled:opacity-40 transition"
            >
              {adding ? <X size={16} /> : <Plus size={16} />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-2"
            >
              <div className="bg-elevated rounded-3xl p-3 flex items-center gap-2 border border-border">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="New quest (e.g. Read 10 pages)"
                  maxLength={80}
                  className="flex-1 bg-stone rounded-2xl px-3 py-2 text-sm outline-none text-primary placeholder:text-secondary"
                />
                <button
                  onClick={submit}
                  disabled={!draft.trim()}
                  className="px-3 py-2 rounded-2xl bg-void text-white text-xs font-semibold disabled:opacity-40"
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <AnimatePresence>
            {customQuests.map((q) => (
              <QuestItem key={q.id} id={q.id} title={q.title} />
            ))}
          </AnimatePresence>
        </div>

        {!atLimit && unusedSuggestions.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] text-secondary uppercase tracking-wider mb-2">
              {customQuests.length === 0 ? "Suggested for you" : "Add more"}
            </div>
            <div className="flex flex-wrap gap-2">
              {unusedSuggestions
                .slice(0, MAX_QUESTS - customQuests.length)
                .map((title) => (
                  <button
                    key={title}
                    onClick={() => addQuest(title)}
                    className="bg-elevated border border-border rounded-full px-3 py-2 text-xs font-medium flex items-center gap-1.5 active:scale-95 transition text-primary"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                  >
                    <Plus size={12} />
                    {title}
                  </button>
                ))}
            </div>
          </div>
        )}

        {atLimit && (
          <div className="text-[11px] text-secondary text-center mt-2">
            Max {MAX_QUESTS} quests per day reached.
          </div>
        )}
      </div>

      {/* ── Pillar score row ──────────────────────────────────────── */}
      <PillarScoreRow scores={pillarScores} assessmentDone={assessmentDone} />

      {/* ── Letter to Future Self ─────────────────────────────────── */}
      <div className="px-5 mt-4 mb-4">
        <Link href="/letter">
          <motion.div
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.33 }}
            className="relative rounded-4xl overflow-hidden bg-void"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
          >
            <div className="relative p-5 flex items-center gap-4">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl shrink-0"
              >
                ✉️
              </motion.div>
              <div className="flex-1">
                <div className="text-[10px] text-white/50 uppercase tracking-[0.2em]">
                  Time capsule
                </div>
                <div className="font-display text-lg text-white leading-tight mt-0.5">
                  Letter to Future You
                </div>
                <div className="text-xs text-white/50 mt-1">
                  {!letterWrittenAt
                    ? "Write a letter to the man you'll become"
                    : letterRevealed
                    ? "Read your letter from the past"
                    : daysUntilUnlock === 0
                    ? "Your letter is ready to open ✨"
                    : `Sealed · Opens in ${daysUntilUnlock} days`}
                </div>
              </div>
              <div className="shrink-0">
                {letterWrittenAt && !letterRevealed && daysUntilUnlock! > 0 ? (
                  <Lock size={16} className="text-white/40" />
                ) : (
                  <ArrowRight size={16} className="text-white/40" />
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

    </div>
  );
}

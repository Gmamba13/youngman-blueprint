"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNewlyUnlocked, AchState } from "./achievements";

type HabitLog = Record<string, string[]>;

export type CustomQuest = { id: string; title: string };

export type PillarCheckIn = {
  id: string;
  date: string; // YYYY-MM-DD
  score: number; // 0.0–10.0 normalized
  rawScore: number;
  maxScore: number;
  answers: Record<string, number>;
};

export type DailyHabit = {
  id: string;
  title: string;
  xp: number;
  // 'daily' = every day, 'custom' = only on specific days of week
  recurrence: "daily" | "custom";
  // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat (only used when recurrence='custom')
  days: number[];
  createdAt: string;
};

export type JournalEntry = {
  date: string;      // YYYY-MM-DD
  text: string;
  prompt: string;
};

export type GoalMilestone = { id: string; title: string; done: boolean };

export type Goal = {
  id: string;
  title: string;
  pillarSlug?: string;
  timeframe: "week" | "month" | "quarter" | "year";
  milestones: GoalMilestone[];
  completed: boolean;
  completedAt?: string;
  createdAt: string;
};

export type BodyMetricEntry = { date: string; value: number };
export type BodyMetric = { id: string; name: string; unit: string; entries: BodyMetricEntry[] };

type State = {
  onboarded: boolean;
  name: string;
  age: number | null;
  occupation: string;
  relationshipStatus: string;
  location: string;
  struggles: string[];
  why: string;
  dailyCommitment: string;
  focusPillars: string[];
  xp: number;
  habitLogs: HabitLog;
  lastActiveDate: string | null;
  streak: number;
  customQuests: CustomQuest[];
  letter: string;
  letterWrittenAt: string | null;
  letterLockDays: number;
  letterRevealed: boolean;
  writeLetter: (text: string, lockDays: number) => void;
  revealLetter: () => void;
  pillarScores: Record<string, number>;
  assessmentDone: boolean;
  setAssessment: (scores: Record<string, number>) => void;
  pillarHabits: Record<string, { id: string; title: string; xp: number }[]>;
  addPillarHabit: (slug: string, title: string, xp?: number) => void;
  removePillarHabit: (slug: string, habitId: string) => void;
  initPillarHabits: (slug: string, defaults: { id: string; title: string; xp: number }[]) => void;
  // Custom daily habits (habits tab)
  dailyHabits: DailyHabit[];
  addDailyHabit: (title: string, xp: number, recurrence: DailyHabit["recurrence"], days: number[]) => void;
  removeDailyHabit: (id: string) => void;
  setProfile: (p: {
    name: string;
    age: number;
    occupation: string;
    relationshipStatus: string;
    location: string;
    struggles: string[];
    why: string;
    dailyCommitment: string;
    focusPillars: string[];
  }) => void;
  toggleHabit: (habitId: string, xp: number) => void;
  toggleHabitOnDate: (habitId: string, xp: number, date: string) => void;
  addQuest: (title: string) => boolean;
  removeQuest: (id: string) => void;
  // Journal
  journalEntries: Record<string, JournalEntry>;
  saveJournalEntry: (date: string, text: string, prompt: string) => void;
  // Goals
  goals: Goal[];
  addGoal: (title: string, pillarSlug: string | undefined, timeframe: Goal["timeframe"], milestones: string[]) => void;
  removeGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  completeGoal: (id: string) => void;
  // Pillar check-ins
  pillarCheckIns: Record<string, PillarCheckIn[]>;
  addPillarCheckIn: (slug: string, score: number, rawScore: number, maxScore: number, answers: Record<string, number>) => void;
  // Achievements
  unlockedAchievements: string[];
  newAchievement: string | null;
  dismissAchievement: () => void;
  // Body metrics
  bodyMetrics: BodyMetric[];
  addMetric: (name: string, unit: string) => void;
  removeMetric: (id: string) => void;
  logMetricEntry: (metricId: string, date: string, value: number) => void;
  // Cloud sync
  loadCloudData: (data: Partial<State>) => void;
  reset: () => void;
  // Notifications
  notificationsEnabled: boolean;
  notificationTime: string; // "HH:MM"
  setNotificationSettings: (enabled: boolean, time: string) => void;
};

export type { State };

export const QUEST_XP = 10;
export const MAX_QUESTS = 10;

const today = () => new Date().toISOString().slice(0, 10);

function computeStreak(prev: string | null, prevStreak: number): { last: string; streak: number } {
  const t = today();
  if (prev === t) return { last: t, streak: prevStreak || 1 };
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (prev === yesterday) return { last: t, streak: prevStreak + 1 };
  return { last: t, streak: 1 };
}

function checkAchievements(s: {
  streak: number;
  xp: number;
  habitLogs: HabitLog;
  dailyHabits: DailyHabit[];
  goals: Goal[];
  journalEntries: Record<string, JournalEntry>;
  pillarCheckIns: Record<string, PillarCheckIn[]>;
  bodyMetrics: BodyMetric[];
  unlockedAchievements: string[];
}): Partial<State> {
  const achState: AchState = {
    streak: s.streak,
    xp: s.xp,
    habitLogs: s.habitLogs,
    dailyHabits: s.dailyHabits,
    goals: s.goals,
    journalEntries: s.journalEntries,
    pillarCheckIns: s.pillarCheckIns,
    bodyMetrics: s.bodyMetrics,
  };
  const newOnes = getNewlyUnlocked(achState, s.unlockedAchievements);
  if (!newOnes.length) return {};
  return {
    unlockedAchievements: [...s.unlockedAchievements, ...newOnes],
    newAchievement: newOnes[0],
  };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      onboarded: false,
      name: "",
      age: null,
      occupation: "",
      relationshipStatus: "",
      location: "",
      struggles: [],
      why: "",
      dailyCommitment: "",
      focusPillars: [],
      xp: 0,
      habitLogs: {},
      lastActiveDate: null,
      streak: 0,
      customQuests: [],
      letter: "",
      letterWrittenAt: null,
      letterLockDays: 90,
      letterRevealed: false,
      writeLetter: (text, lockDays) =>
        set({ letter: text, letterWrittenAt: new Date().toISOString(), letterLockDays: lockDays, letterRevealed: false }),
      revealLetter: () => set({ letterRevealed: true }),
      notificationsEnabled: false,
      notificationTime: "08:00",
      setNotificationSettings: (enabled, time) => set({ notificationsEnabled: enabled, notificationTime: time }),
      pillarScores: {},
      assessmentDone: false,
      setAssessment: (scores) => set({ pillarScores: scores, assessmentDone: true }),
      pillarHabits: {},
      initPillarHabits: (slug, defaults) => {
        if (get().pillarHabits[slug]) return;
        set({ pillarHabits: { ...get().pillarHabits, [slug]: defaults } });
      },
      addPillarHabit: (slug, title, xp = 10) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const id = `ph-${slug}-${Date.now()}`;
        const current = get().pillarHabits[slug] ?? [];
        set({ pillarHabits: { ...get().pillarHabits, [slug]: [...current, { id, title: trimmed, xp }] } });
      },
      removePillarHabit: (slug, habitId) => {
        const current = get().pillarHabits[slug] ?? [];
        const logs = { ...get().habitLogs };
        delete logs[habitId];
        set({
          pillarHabits: { ...get().pillarHabits, [slug]: current.filter((h) => h.id !== habitId) },
          habitLogs: logs,
        });
      },
      // Daily habits (habits tab)
      dailyHabits: [],
      addDailyHabit: (title, xp, recurrence, days) => {
        const trimmed = title.trim();
        if (!trimmed) return;
        const id = `dh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const habit: DailyHabit = {
          id,
          title: trimmed,
          xp,
          recurrence,
          days: recurrence === "daily" ? [] : days,
          createdAt: today(),
        };
        const newHabits = [...get().dailyHabits, habit];
        const s = get();
        set({
          dailyHabits: newHabits,
          ...checkAchievements({
            streak: s.streak,
            xp: s.xp,
            habitLogs: s.habitLogs,
            dailyHabits: newHabits,
            goals: s.goals,
            journalEntries: s.journalEntries,
            pillarCheckIns: s.pillarCheckIns,
            bodyMetrics: s.bodyMetrics,
            unlockedAchievements: s.unlockedAchievements,
          }),
        });
      },
      removeDailyHabit: (id) => {
        const logs = { ...get().habitLogs };
        const wasDoneToday = (logs[id] ?? []).includes(today());
        const habit = get().dailyHabits.find((h) => h.id === id);
        delete logs[id];
        set({
          dailyHabits: get().dailyHabits.filter((h) => h.id !== id),
          habitLogs: logs,
          xp: wasDoneToday && habit ? Math.max(0, get().xp - habit.xp) : get().xp,
        });
      },
      setProfile: (p) => set({ onboarded: true, ...p }),
      addQuest: (title) => {
        const trimmed = title.trim();
        if (!trimmed) return false;
        const list = get().customQuests;
        if (list.length >= MAX_QUESTS) return false;
        const id = `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set({ customQuests: [...list, { id, title: trimmed }] });
        return true;
      },
      removeQuest: (id) => {
        const logs = { ...get().habitLogs };
        const wasDoneToday = (logs[id] ?? []).includes(today());
        delete logs[id];
        set({
          customQuests: get().customQuests.filter((q) => q.id !== id),
          habitLogs: logs,
          xp: wasDoneToday ? Math.max(0, get().xp - QUEST_XP) : get().xp,
        });
      },
      toggleHabit: (habitId, xp) => {
        const t = today();
        const logs = { ...get().habitLogs };
        const dates = logs[habitId] ?? [];
        const has = dates.includes(t);
        logs[habitId] = has ? dates.filter((d) => d !== t) : [...dates, t];
        const deltaXp = has ? -xp : xp;
        const newXp = Math.max(0, get().xp + deltaXp);
        if (has) {
          set({ habitLogs: logs, xp: newXp });
        } else {
          const { last, streak } = computeStreak(get().lastActiveDate, get().streak);
          const s = get();
          set({
            habitLogs: logs,
            xp: newXp,
            lastActiveDate: last,
            streak,
            ...checkAchievements({
              streak,
              xp: newXp,
              habitLogs: logs,
              dailyHabits: s.dailyHabits,
              goals: s.goals,
              journalEntries: s.journalEntries,
              pillarCheckIns: s.pillarCheckIns,
              bodyMetrics: s.bodyMetrics,
              unlockedAchievements: s.unlockedAchievements,
            }),
          });
        }
      },
      toggleHabitOnDate: (habitId, xp, date) => {
        const logs = { ...get().habitLogs };
        const dates = logs[habitId] ?? [];
        const has = dates.includes(date);
        logs[habitId] = has ? dates.filter((d) => d !== date) : [...dates, date];
        const deltaXp = has ? -xp : xp;
        const newXp = Math.max(0, get().xp + deltaXp);
        if (has) {
          set({ habitLogs: logs, xp: newXp });
        } else {
          const { last, streak } = computeStreak(get().lastActiveDate, get().streak);
          const s = get();
          set({
            habitLogs: logs,
            xp: newXp,
            lastActiveDate: last,
            streak,
            ...checkAchievements({
              streak,
              xp: newXp,
              habitLogs: logs,
              dailyHabits: s.dailyHabits,
              goals: s.goals,
              journalEntries: s.journalEntries,
              pillarCheckIns: s.pillarCheckIns,
              bodyMetrics: s.bodyMetrics,
              unlockedAchievements: s.unlockedAchievements,
            }),
          });
        }
      },
      // Pillar check-ins
      pillarCheckIns: {},
      addPillarCheckIn: (slug, score, rawScore, maxScore, answers) => {
        const checkIn: PillarCheckIn = {
          id: `pci-${Date.now()}`,
          date: today(),
          score,
          rawScore,
          maxScore,
          answers,
        };
        const existing = get().pillarCheckIns[slug] ?? [];
        const newCheckIns = { ...get().pillarCheckIns, [slug]: [checkIn, ...existing] };
        const s = get();
        set({
          pillarCheckIns: newCheckIns,
          pillarScores: { ...s.pillarScores, [slug]: Math.round(score) },
          assessmentDone: true,
          ...checkAchievements({
            streak: s.streak,
            xp: s.xp,
            habitLogs: s.habitLogs,
            dailyHabits: s.dailyHabits,
            goals: s.goals,
            journalEntries: s.journalEntries,
            pillarCheckIns: newCheckIns,
            bodyMetrics: s.bodyMetrics,
            unlockedAchievements: s.unlockedAchievements,
          }),
        });
      },
      // Journal
      journalEntries: {},
      saveJournalEntry: (date, text, prompt) => {
        const newEntries = { ...get().journalEntries, [date]: { date, text, prompt } };
        const s = get();
        set({
          journalEntries: newEntries,
          ...checkAchievements({
            streak: s.streak,
            xp: s.xp,
            habitLogs: s.habitLogs,
            dailyHabits: s.dailyHabits,
            goals: s.goals,
            journalEntries: newEntries,
            pillarCheckIns: s.pillarCheckIns,
            bodyMetrics: s.bodyMetrics,
            unlockedAchievements: s.unlockedAchievements,
          }),
        });
      },
      // Goals
      goals: [],
      addGoal: (title, pillarSlug, timeframe, milestones) => {
        const now = Date.now();
        const goal: Goal = {
          id: `g-${now}`,
          title: title.trim(),
          pillarSlug,
          timeframe,
          milestones: milestones.map((m, i) => ({ id: `gm-${i}-${now}`, title: m.trim(), done: false })).filter((m) => m.title),
          completed: false,
          createdAt: today(),
        };
        set({ goals: [...get().goals, goal] });
      },
      removeGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),
      toggleMilestone: (goalId, milestoneId) => {
        set({
          goals: get().goals.map((g) =>
            g.id !== goalId
              ? g
              : { ...g, milestones: g.milestones.map((m) => m.id === milestoneId ? { ...m, done: !m.done } : m) }
          ),
        });
      },
      completeGoal: (id) => {
        const newGoals = get().goals.map((g) =>
          g.id !== id ? g : { ...g, completed: true, completedAt: today() }
        );
        const s = get();
        set({
          goals: newGoals,
          ...checkAchievements({
            streak: s.streak,
            xp: s.xp,
            habitLogs: s.habitLogs,
            dailyHabits: s.dailyHabits,
            goals: newGoals,
            journalEntries: s.journalEntries,
            pillarCheckIns: s.pillarCheckIns,
            bodyMetrics: s.bodyMetrics,
            unlockedAchievements: s.unlockedAchievements,
          }),
        });
      },
      // Achievements
      unlockedAchievements: [],
      newAchievement: null,
      dismissAchievement: () => set({ newAchievement: null }),
      // Body metrics
      bodyMetrics: [],
      addMetric: (name, unit) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const id = `metric-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        set({ bodyMetrics: [...get().bodyMetrics, { id, name: trimmed, unit: unit.trim() || "unit", entries: [] }] });
      },
      removeMetric: (id) => set({ bodyMetrics: get().bodyMetrics.filter((m) => m.id !== id) }),
      logMetricEntry: (metricId, date, value) => {
        const metrics = get().bodyMetrics.map((m) => {
          if (m.id !== metricId) return m;
          const entries = m.entries.filter((e) => e.date !== date);
          return { ...m, entries: [...entries, { date, value }].sort((a, b) => a.date.localeCompare(b.date)) };
        });
        const s = get();
        set({
          bodyMetrics: metrics,
          ...checkAchievements({
            streak: s.streak,
            xp: s.xp,
            habitLogs: s.habitLogs,
            dailyHabits: s.dailyHabits,
            goals: s.goals,
            journalEntries: s.journalEntries,
            pillarCheckIns: s.pillarCheckIns,
            bodyMetrics: metrics,
            unlockedAchievements: s.unlockedAchievements,
          }),
        });
      },
      loadCloudData: (data) => {
        // Merge cloud data into store, skipping undefined values and functions
        const safe: Partial<State> = {};
        const allowed: (keyof State)[] = [
          "onboarded","name","age","occupation","relationshipStatus","location",
          "struggles","why","dailyCommitment","focusPillars","xp","habitLogs",
          "lastActiveDate","streak","customQuests","letter","letterWrittenAt",
          "letterLockDays","letterRevealed","pillarScores","assessmentDone",
          "pillarHabits","dailyHabits","journalEntries","goals","pillarCheckIns",
          "unlockedAchievements","bodyMetrics",
        ];
        for (const key of allowed) {
          if (data[key] !== undefined) (safe as Record<string, unknown>)[key] = data[key];
        }
        set(safe);
      },
      reset: () =>
        set({
          onboarded: false,
          name: "",
          age: null,
          occupation: "",
          relationshipStatus: "",
          location: "",
          struggles: [],
          why: "",
          dailyCommitment: "",
          focusPillars: [],
          xp: 0,
          habitLogs: {},
          lastActiveDate: null,
          streak: 0,
          customQuests: [],
          letter: "",
          letterWrittenAt: null,
          letterLockDays: 90,
          letterRevealed: false,
          pillarScores: {},
          assessmentDone: false,
          pillarHabits: {},
          dailyHabits: [],
          journalEntries: {},
          goals: [],
          pillarCheckIns: {},
          unlockedAchievements: [],
          newAchievement: null,
          bodyMetrics: [],
          notificationsEnabled: false,
          notificationTime: "08:00",
        }),
    }),
    { name: "ymbp-store" }
  )
);

export function isHabitDoneToday(logs: HabitLog, habitId: string): boolean {
  return (logs[habitId] ?? []).includes(new Date().toISOString().slice(0, 10));
}

export function isHabitDoneOn(logs: HabitLog, habitId: string, date: string): boolean {
  return (logs[habitId] ?? []).includes(date);
}

export function habitStreak(logs: HabitLog, habitId: string): number {
  const dates = new Set(logs[habitId] ?? []);
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (dates.has(d)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

export function isHabitScheduledOn(habit: { recurrence: string; days: number[] }, date: string): boolean {
  if (habit.recurrence === "daily") return true;
  const dow = new Date(date + "T12:00:00").getDay(); // 0=Sun ... 6=Sat
  return habit.days.includes(dow);
}

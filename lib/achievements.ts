export interface AchState {
  streak: number;
  xp: number;
  habitLogs: Record<string, string[]>;
  dailyHabits: { id: string }[];
  goals: { completed: boolean }[];
  journalEntries: Record<string, unknown>;
  pillarCheckIns: Record<string, unknown[]>;
  bodyMetrics: { entries: { date: string; value: number }[] }[];
}

export type AchievementRarity = "common" | "rare" | "epic";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  rarity: AchievementRarity;
  condition: (s: AchState) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_habit",   title: "First Rep",       description: "Log your first habit",              emoji: "🏃", rarity: "common", condition: (s) => Object.values(s.habitLogs).some((d) => d.length > 0) },
  { id: "streak_3",      title: "On a Roll",        description: "Hit a 3-day streak",                emoji: "🔥", rarity: "common", condition: (s) => s.streak >= 3 },
  { id: "streak_7",      title: "Week Warrior",     description: "Maintain a 7-day streak",           emoji: "💪", rarity: "rare",   condition: (s) => s.streak >= 7 },
  { id: "streak_14",     title: "Fortnight",        description: "Maintain a 14-day streak",          emoji: "⚡", rarity: "rare",   condition: (s) => s.streak >= 14 },
  { id: "streak_30",     title: "Iron Will",        description: "Maintain a 30-day streak",          emoji: "🏆", rarity: "epic",   condition: (s) => s.streak >= 30 },
  { id: "habits_5",      title: "Habit Stack",      description: "Create 5 daily habits",             emoji: "📋", rarity: "common", condition: (s) => s.dailyHabits.length >= 5 },
  { id: "first_goal",    title: "Target Locked",    description: "Complete your first goal",          emoji: "🎯", rarity: "common", condition: (s) => s.goals.some((g) => g.completed) },
  { id: "goals_3",       title: "Triple Threat",    description: "Complete 3 goals",                  emoji: "🚀", rarity: "rare",   condition: (s) => s.goals.filter((g) => g.completed).length >= 3 },
  { id: "first_journal", title: "First Word",       description: "Write your first journal entry",    emoji: "✍️", rarity: "common", condition: (s) => Object.keys(s.journalEntries).length >= 1 },
  { id: "journal_7",     title: "Deep Thinker",     description: "Write 7 journal entries",           emoji: "📖", rarity: "rare",   condition: (s) => Object.keys(s.journalEntries).length >= 7 },
  { id: "first_checkin", title: "Self-Aware",       description: "Complete your first pillar check-in", emoji: "🔍", rarity: "common", condition: (s) => Object.values(s.pillarCheckIns).some((a) => a.length > 0) },
  { id: "all_pillars",   title: "Full Blueprint",   description: "Check in on all 10 pillars",        emoji: "🌐", rarity: "epic",   condition: (s) => Object.keys(s.pillarCheckIns).filter((k) => (s.pillarCheckIns[k]?.length ?? 0) > 0).length >= 10 },
  { id: "xp_500",        title: "Building Momentum", description: "Earn 500 XP",                     emoji: "⚡", rarity: "common", condition: (s) => s.xp >= 500 },
  { id: "level_5",       title: "Strategist",       description: "Reach level 5",                    emoji: "⭐", rarity: "rare",   condition: (s) => s.xp >= 1000 },
  { id: "first_metric",  title: "Tracking",         description: "Log your first body metric",       emoji: "📊", rarity: "common", condition: (s) => s.bodyMetrics.some((m) => m.entries.length > 0) },
];

export function getNewlyUnlocked(state: AchState, currentUnlocked: string[]): string[] {
  const unlocked = new Set(currentUnlocked);
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && a.condition(state)).map((a) => a.id);
}

export const ACHIEVEMENT_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: "#6B8E6B",
  rare: "#9BB8C9",
  epic: "#C9963B",
};

export const RARITY_LABELS: Record<AchievementRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
};

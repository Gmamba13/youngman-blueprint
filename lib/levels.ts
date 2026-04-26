export type Level = { level: number; name: string; xpRequired: number };

export const LEVELS: Level[] = [
  { level: 1, name: "Initiate", xpRequired: 0 },
  { level: 2, name: "Apprentice", xpRequired: 100 },
  { level: 3, name: "Seeker", xpRequired: 250 },
  { level: 4, name: "Warrior", xpRequired: 500 },
  { level: 5, name: "Strategist", xpRequired: 1000 },
  { level: 6, name: "Craftsman", xpRequired: 1750 },
  { level: 7, name: "Commander", xpRequired: 2750 },
  { level: 8, name: "Sovereign", xpRequired: 4000 },
  { level: 9, name: "Architect", xpRequired: 6000 },
  { level: 10, name: "Blueprint Master", xpRequired: 9000 },
];

export function levelForXp(xp: number): { current: Level; next: Level | null; progress: number } {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.xpRequired) current = l;
  const nextIdx = LEVELS.findIndex((l) => l.level === current.level) + 1;
  const next = LEVELS[nextIdx] ?? null;
  const progress = next
    ? (xp - current.xpRequired) / (next.xpRequired - current.xpRequired)
    : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}

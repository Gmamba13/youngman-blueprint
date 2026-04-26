import { PILLARS, PILLAR_BY_SLUG, type Pillar } from "./pillars";

// Career habits are tailored to what the user's actually doing day-to-day.
export const CAREER_HABITS_BY_OCCUPATION: Record<
  string,
  { id: string; title: string; xp: number }[]
> = {
  Student: [
    { id: "career-student-study", title: "Deep study session 45 min", xp: 15 },
    { id: "career-student-project", title: "Build a personal project 30 min", xp: 20 },
    { id: "career-student-read", title: "Read something outside class", xp: 10 },
    { id: "career-student-mentor", title: "Talk to 1 professor or mentor", xp: 15 },
    { id: "career-student-intern", title: "Apply to 1 internship", xp: 20 },
  ],
  Working: [
    { id: "career-work-skill", title: "Upskill 30 min (outside 9–5)", xp: 15 },
    { id: "career-work-side", title: "Work on side project 30 min", xp: 20 },
    { id: "career-work-network", title: "Reach out to 1 new contact", xp: 15 },
    { id: "career-work-review", title: "Review today's wins & losses", xp: 10 },
    { id: "career-work-ask", title: "Ask for feedback at work", xp: 10 },
  ],
  "Between jobs": [
    { id: "career-between-apply", title: "Apply to 2 jobs today", xp: 25 },
    { id: "career-between-skill", title: "Build/practice skill 1 hour", xp: 20 },
    { id: "career-between-reach", title: "Message 3 people for leads", xp: 15 },
    { id: "career-between-routine", title: "Stick to morning routine", xp: 10 },
    { id: "career-between-portfolio", title: "Update resume or portfolio", xp: 15 },
  ],
};

export function getPillarForUser(slug: string, occupation: string): Pillar {
  const base = PILLAR_BY_SLUG[slug];
  if (!base) return base;
  if (slug === "career" && CAREER_HABITS_BY_OCCUPATION[occupation]?.length) {
    return { ...base, habits: CAREER_HABITS_BY_OCCUPATION[occupation] };
  }
  return base;
}

// Each struggle boosts a weighted set of pillars.
export const STRUGGLE_TO_PILLARS: Record<string, Record<string, number>> = {
  "Feeling stuck": { motivation: 3, discipline: 2, "mental-health": 1 },
  "Low motivation": { motivation: 3, discipline: 2 },
  "Addiction": { addiction: 4, discipline: 2, "mental-health": 1 },
  "Breakup": { relationships: 3, "mental-health": 3, discipline: 1 },
  "Lost / no direction": { motivation: 3, career: 3, discipline: 1 },
  "Anxiety / depression": { "mental-health": 4, "physical-health": 2 },
  "Out of shape": { "physical-health": 4, discipline: 2, appearance: 1 },
  "Broke": { finances: 4, career: 2, investing: 2 },
  "Lonely": { relationships: 4, "mental-health": 2 },
  "Lack discipline": { discipline: 4, "physical-health": 1 },
  "Career confusion": { career: 4, motivation: 2 },
  "Porn": { addiction: 4, discipline: 2, "mental-health": 1 },
  "Screen addiction": { addiction: 3, discipline: 3 },
};

// Tailored daily message per pillar — shown in "Today's Focus" card.
export const FOCUS_MESSAGES: Record<string, string> = {
  career: "Pick one career rep today. One skill, one application, one message sent. Small moves compound.",
  "physical-health": "Your body is the foundation. Move it today — even 20 minutes counts. Eat clean. Sleep hard.",
  relationships: "Isolation is a silent killer. Reach out to one person today. No agenda, just connection.",
  addiction: "You don't have to be perfect forever. Just win today. Stay clean for the next 24 hours.",
  finances: "Every dollar tracked is a dollar you control. Check your spending today. Awareness comes first.",
  "mental-health": "Hard men still feel things. 5 minutes of journaling or a walk in the sun beats bottling it up.",
  discipline: "Do the hard thing first. Cold shower, workout, or your biggest task — before 9am.",
  motivation: "Motivation follows action, not the other way around. Start before you feel ready.",
  appearance: "Respect yourself enough to show up. Shower, groom, stand tall. Small effort, massive signal.",
  investing: "Time in the market beats timing it. Even $25 today is a future version of yourself you're funding.",
};

export function computePillarScores(
  struggles: string[],
  focusPillars: string[]
): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const p of PILLARS) scores[p.slug] = 0;

  // Struggles add the biggest weight
  for (const s of struggles) {
    const weights = STRUGGLE_TO_PILLARS[s] || {};
    for (const [slug, w] of Object.entries(weights)) {
      scores[slug] = (scores[slug] || 0) + w;
    }
  }

  // Focus pillars add a strong bonus too
  for (const slug of focusPillars) {
    scores[slug] = (scores[slug] || 0) + 5;
  }

  return scores;
}

export function topFocusPillar(
  struggles: string[],
  focusPillars: string[]
): Pillar {
  const scores = computePillarScores(struggles, focusPillars);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winnerSlug = sorted[0]?.[0] || focusPillars[0] || "discipline";
  return PILLAR_BY_SLUG[winnerSlug] || PILLARS[0];
}

export function suggestedQuestTitles(
  struggles: string[],
  focusPillars: string[],
  occupation: string = "",
  limit = 5
): string[] {
  const scores = computePillarScores(struggles, focusPillars);
  const sortedPillars = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .map(([slug]) => getPillarForUser(slug, occupation))
    .filter(Boolean);

  // Pull 1 habit from each top pillar, round-robin, until we hit the limit
  const suggestions: string[] = [];
  const seen = new Set<string>();
  let idx = 0;
  while (suggestions.length < limit && idx < 10) {
    for (const p of sortedPillars) {
      const habit = p.habits[idx];
      if (habit && !seen.has(habit.title)) {
        suggestions.push(habit.title);
        seen.add(habit.title);
        if (suggestions.length >= limit) break;
      }
    }
    idx++;
  }
  return suggestions;
}

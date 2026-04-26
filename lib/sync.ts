import { createClient } from "@/lib/supabase";
import type { State } from "@/lib/store";

const SYNC_KEYS: (keyof State)[] = [
  "onboarded", "name", "age", "occupation", "relationshipStatus", "location",
  "struggles", "why", "dailyCommitment", "focusPillars", "xp", "habitLogs",
  "lastActiveDate", "streak", "customQuests", "letter", "letterWrittenAt",
  "letterLockDays", "letterRevealed", "pillarScores", "assessmentDone",
  "pillarHabits", "dailyHabits", "journalEntries", "goals", "pillarCheckIns",
  "unlockedAchievements", "bodyMetrics",
];

export function extractSyncData(state: State): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const key of SYNC_KEYS) {
    data[key] = state[key];
  }
  return data;
}

export async function saveToCloud(userId: string, state: State): Promise<void> {
  try {
    const supabase = createClient();
    await supabase
      .from("user_data")
      .upsert(
        { user_id: userId, data: extractSyncData(state), updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );
  } catch (e) {
    console.warn("Cloud save failed:", e);
  }
}

export async function loadFromCloud(userId: string): Promise<Partial<State> | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("user_data")
      .select("data")
      .eq("user_id", userId)
      .single();

    if (error || !data?.data) return null;
    return data.data as Partial<State>;
  } catch (e) {
    console.warn("Cloud load failed:", e);
    return null;
  }
}

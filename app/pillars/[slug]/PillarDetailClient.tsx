"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getPillarForUser } from "@/lib/personalization";
import HabitItem from "@/components/HabitItem";
import { useStore } from "@/lib/store";
import { PILLAR_TOOL_BY_SLUG } from "@/lib/pillar-tools";
import { ArrowLeft, ArrowRight, Plus, X, Trash2 } from "lucide-react";

export default function PillarDetailClient() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const occupation    = useStore((s) => s.occupation);
  const pillarHabits  = useStore((s) => s.pillarHabits);
  const initHabits    = useStore((s) => s.initPillarHabits);
  const addHabit      = useStore((s) => s.addPillarHabit);
  const removeHabit   = useStore((s) => s.removePillarHabit);
  const pillarCheckIns = useStore((s) => s.pillarCheckIns);

  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  const pillar = getPillarForUser(slug as string, occupation);

  // seed defaults into store the first time this pillar is opened
  useEffect(() => {
    if (pillar) initHabits(slug as string, pillar.habits);
  }, [slug, pillar, initHabits]);

  if (!pillar) {
    return (
      <div className="p-6">
        <p className="text-primary">Pillar not found.</p>
        <button onClick={() => router.back()} className="btn-ghost mt-4">Back</button>
      </div>
    );
  }

  const activeHabits  = pillarHabits[slug as string] ?? pillar.habits;
  const activeIds     = new Set(activeHabits.map((h) => h.id));
  const suggestions   = pillar.habits.filter((h) => !activeIds.has(h.id));
  const checkIns      = pillarCheckIns[slug as string] ?? [];
  const latestCheckIn = checkIns[0];

  const submit = () => {
    if (!draft.trim()) return;
    addHabit(slug as string, draft.trim());
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="pb-32">
      {/* Hero header */}
      <div
        className="relative px-5 pt-10 pb-10 bg-elevated"
        style={{
          borderBottom: "1px solid #E8E8E8",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* vivid color accent strip */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: pillar.color }}
        />

        <button
          onClick={() => router.back()}
          className="relative text-secondary text-sm flex items-center gap-1 mb-6 bg-stone px-3 py-1.5 rounded-full border border-border active:scale-95 transition"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative w-16 h-16 rounded-3xl flex items-center justify-center text-3xl border border-border bg-stone"
        >
          {pillar.emoji}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl leading-tight mt-4 relative text-primary"
        >
          {pillar.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-secondary text-sm mt-1 relative"
        >
          {pillar.tagline}
        </motion.p>
      </div>

      {/* Check-in card */}
      <div className="px-5 mt-6">
        <Link href={`/pillars/${slug}/checkin`}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="rounded-4xl p-5 bg-void text-white relative overflow-hidden"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
          >
            {/* subtle color accent glow */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ backgroundColor: pillar.color + "30" }}
            />
            <div className="relative flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ backgroundColor: pillar.color + "25" }}
              >
                {pillar.emoji}
              </div>
              <div className="flex-1">
                <div className="label mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {PILLAR_TOOL_BY_SLUG[slug as string]?.toolName}
                </div>
                <div className="font-display text-lg text-white leading-tight">Take Check-In</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {latestCheckIn
                    ? `Last: ${latestCheckIn.score.toFixed(1)}/10 · ${latestCheckIn.date}`
                    : "See where you stand"}
                </div>
              </div>
              <ArrowRight size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Habits — editable */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-primary">Daily Habits</h2>
          <button
            onClick={() => setAdding((v) => !v)}
            className="w-8 h-8 rounded-full bg-void text-white flex items-center justify-center active:scale-90 transition"
            aria-label="Add habit"
          >
            {adding ? <X size={15} /> : <Plus size={15} />}
          </button>
        </div>

        {/* Add input */}
        <AnimatePresence initial={false}>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="rounded-3xl p-3 flex items-center gap-2 border border-border bg-elevated">
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="New habit (e.g. Stretch 10 min)"
                  maxLength={80}
                  className="flex-1 bg-stone rounded-2xl px-3 py-2 text-sm outline-none text-primary placeholder:text-secondary"
                />
                <button
                  onClick={submit}
                  disabled={!draft.trim()}
                  className="px-3 py-2 rounded-2xl text-white text-xs font-semibold disabled:opacity-40 shrink-0"
                  style={{ background: pillar.color }}
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active habits */}
        <div className="space-y-2">
          <AnimatePresence>
            {activeHabits.map((h) => (
              <motion.div
                key={h.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <HabitItem id={h.id} title={h.title} xp={h.xp} accent={pillar.color} />
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    if (confirm(`Remove "${h.title}"?`)) removeHabit(slug as string, h.id);
                  }}
                  className="w-9 h-9 rounded-2xl bg-elevated border border-border flex items-center justify-center text-secondary shrink-0 active:bg-stone"
                  aria-label="Delete habit"
                >
                  <Trash2 size={14} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {activeHabits.length === 0 && (
          <button
            onClick={() => setAdding(true)}
            className="w-full p-5 rounded-3xl border-2 border-dashed border-border text-secondary text-sm"
          >
            No habits yet. Tap + to add one.
          </button>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-4">
            <div className="text-[10px] text-secondary uppercase tracking-wider mb-2">Suggestions</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((h) => (
                <motion.button
                  key={h.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addHabit(slug as string, h.title, h.xp)}
                  className="bg-elevated border border-border rounded-full px-3 py-2 text-xs font-medium flex items-center gap-1.5 active:scale-95 transition text-primary"
                  style={{
                    borderColor: pillar.color + "55",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                >
                  <Plus size={11} style={{ color: pillar.color }} />
                  {h.title}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Check-in history */}
      {checkIns.length > 0 && (
        <div className="px-5 mt-8 mb-4">
          <div className="label mb-3">Check-in history</div>
          <div className="space-y-2">
            {checkIns.slice(0, 5).map((ci, i) => (
              <motion.div
                key={ci.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: pillar.color + "18" }}
                >
                  <span className="font-display text-base" style={{ color: pillar.color }}>
                    {ci.score.toFixed(1)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-primary">
                    {PILLAR_TOOL_BY_SLUG[slug as string]?.scoreLabel(ci.score)}
                  </div>
                  <div className="text-xs text-secondary mt-0.5">{ci.date}</div>
                </div>
                <div className="text-xs text-muted">{ci.rawScore}/{ci.maxScore} pts</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

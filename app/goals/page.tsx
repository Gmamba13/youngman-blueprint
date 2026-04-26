"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, Goal } from "@/lib/store";
import { PILLARS, PILLAR_BY_SLUG } from "@/lib/pillars";
import { Plus, X, Trash2, CheckCircle2, Circle } from "lucide-react";

const TIMEFRAME_LABELS: Record<Goal["timeframe"], string> = {
  week: "This Week",
  month: "30 Days",
  quarter: "90 Days",
  year: "1 Year",
};

const TIMEFRAME_COLORS: Record<Goal["timeframe"], string> = {
  week: "#6B8E6B",
  month: "#9BB8C9",
  quarter: "#C9963B",
  year: "#B9A7C9",
};

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);
  return (
    <div className="h-1.5 rounded-full bg-stone overflow-hidden mt-3">
      <motion.div
        className="h-full rounded-full bg-gold"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

function GoalCard({ goal, onToggleMilestone, onComplete, onRemove }: {
  goal: Goal;
  onToggleMilestone: (milestoneId: string) => void;
  onComplete: () => void;
  onRemove: () => void;
}) {
  const pillar = goal.pillarSlug ? PILLAR_BY_SLUG[goal.pillarSlug] : null;
  const color = pillar?.color ?? "#AAAAAA";
  const doneMilestones = goal.milestones.filter((m) => m.done).length;
  const allDone = goal.milestones.length === 0 || doneMilestones === goal.milestones.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: goal.completed ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="card overflow-hidden"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {pillar && <span className="text-xl shrink-0 mt-0.5">{pillar.emoji}</span>}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base text-primary leading-snug">{goal.title}</h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: TIMEFRAME_COLORS[goal.timeframe] + "22", color: TIMEFRAME_COLORS[goal.timeframe] }}
            >
              {TIMEFRAME_LABELS[goal.timeframe]}
            </span>
            {goal.completed && goal.completedAt && (
              <span className="text-[10px] text-muted">Completed {goal.completedAt}</span>
            )}
          </div>
        </div>
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-xl bg-stone border border-border flex items-center justify-center text-muted active:scale-90 transition shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Milestones */}
      {goal.milestones.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {goal.milestones.map((m) => (
            <button
              key={m.id}
              disabled={goal.completed}
              onClick={() => onToggleMilestone(m.id)}
              className="w-full flex items-center gap-2.5 text-left group active:scale-[0.98] transition disabled:pointer-events-none"
            >
              {m.done
                ? <CheckCircle2 size={16} style={{ color }} className="shrink-0" />
                : <Circle size={16} className="shrink-0 text-muted" />
              }
              <span className={`text-sm ${m.done ? "line-through text-muted" : "text-primary"}`}>
                {m.title}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {goal.milestones.length > 0 && (
        <ProgressBar done={doneMilestones} total={goal.milestones.length} />
      )}

      {/* Mark complete */}
      {!goal.completed && allDone && (
        <motion.button
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          className="mt-3 w-full py-2 rounded-2xl bg-void text-white text-xs font-semibold active:scale-[0.98] transition"
        >
          Mark Complete ✓
        </motion.button>
      )}
    </motion.div>
  );
}

export default function GoalsPage() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const removeGoal = useStore((s) => s.removeGoal);
  const toggleMilestone = useStore((s) => s.toggleMilestone);
  const completeGoal = useStore((s) => s.completeGoal);

  const [tab, setTab] = useState<"active" | "done">("active");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [timeframe, setTimeframe] = useState<Goal["timeframe"]>("month");
  const [pillarSlug, setPillarSlug] = useState<string | undefined>(undefined);
  const [milestones, setMilestones] = useState<string[]>(["", "", ""]);

  const activeGoals = goals.filter((g) => !g.completed);
  const doneGoals = goals.filter((g) => g.completed);

  const resetForm = () => {
    setTitle("");
    setTimeframe("month");
    setPillarSlug(undefined);
    setMilestones(["", "", ""]);
    setShowForm(false);
  };

  const handleAddGoal = () => {
    if (!title.trim()) return;
    addGoal(title, pillarSlug, timeframe, milestones.filter((m) => m.trim()));
    resetForm();
  };

  const updateMilestone = (i: number, val: string) => {
    const next = [...milestones];
    next[i] = val;
    setMilestones(next);
  };

  const addMilestone = () => {
    if (milestones.length < 5) setMilestones([...milestones, ""]);
  };

  const removeMilestone = (i: number) => {
    setMilestones(milestones.filter((_, idx) => idx !== i));
  };

  const displayGoals = tab === "active" ? activeGoals : doneGoals;

  return (
    <div className="pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 pt-12 pb-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="label mb-1">Goals</div>
            <h1 className="font-display text-3xl text-primary leading-tight">Your Goals</h1>
            <p className="text-sm text-secondary mt-1">Set the targets.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="w-10 h-10 rounded-full bg-void text-white flex items-center justify-center active:scale-90 transition shrink-0"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Add Goal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 card space-y-4">
              <div>
                <div className="label mb-1.5">Goal name</div>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Run a 5K"
                  maxLength={80}
                  className="w-full bg-stone rounded-2xl px-3 py-2.5 text-sm outline-none text-primary placeholder:text-secondary"
                />
              </div>

              {/* Timeframe */}
              <div>
                <div className="label mb-1.5">Timeframe</div>
                <div className="grid grid-cols-2 gap-2">
                  {(["week", "month", "quarter", "year"] as Goal["timeframe"][]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className="py-2.5 rounded-2xl text-xs font-semibold border transition active:scale-95"
                      style={{
                        background: timeframe === tf ? TIMEFRAME_COLORS[tf] : "transparent",
                        color: timeframe === tf ? "#fff" : "#888",
                        borderColor: timeframe === tf ? TIMEFRAME_COLORS[tf] : "#E8E8E8",
                      }}
                    >
                      {TIMEFRAME_LABELS[tf]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pillar Picker */}
              <div>
                <div className="label mb-1.5">Pillar (optional)</div>
                <div className="flex flex-wrap gap-2">
                  {PILLARS.map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => setPillarSlug(pillarSlug === p.slug ? undefined : p.slug)}
                      className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg border transition active:scale-90"
                      style={{
                        background: pillarSlug === p.slug ? p.color + "33" : "transparent",
                        borderColor: pillarSlug === p.slug ? p.color : "#E8E8E8",
                      }}
                      title={p.name}
                    >
                      {p.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div>
                <div className="label mb-1.5">Milestones (optional)</div>
                <div className="space-y-2">
                  {milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={m}
                        onChange={(e) => updateMilestone(i, e.target.value)}
                        placeholder={`Step ${i + 1}`}
                        maxLength={60}
                        className="flex-1 bg-stone rounded-xl px-3 py-2 text-sm outline-none text-primary placeholder:text-secondary"
                      />
                      <button
                        onClick={() => removeMilestone(i)}
                        className="w-7 h-7 rounded-lg bg-stone border border-border flex items-center justify-center text-muted active:scale-90 transition shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {milestones.length < 5 && (
                    <button
                      onClick={addMilestone}
                      className="flex items-center gap-1.5 text-xs text-secondary active:scale-95 transition"
                    >
                      <Plus size={12} /> Add step
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddGoal}
                disabled={!title.trim()}
                className="w-full py-3 rounded-2xl bg-void text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition"
              >
                Add Goal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 bg-stone rounded-2xl p-1">
          {(["active", "done"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition capitalize"
              style={{
                background: tab === t ? "#0D0D0D" : "transparent",
                color: tab === t ? "#fff" : "#888",
              }}
            >
              {t === "active" ? `Active (${activeGoals.length})` : `Done (${doneGoals.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Goals list */}
      <div className="px-5 space-y-3">
        <AnimatePresence mode="popLayout">
          {displayGoals.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-border py-12 text-center"
            >
              <div className="text-4xl mb-3">{tab === "active" ? "🎯" : "🏆"}</div>
              <p className="text-sm text-muted">
                {tab === "active"
                  ? "No active goals. Tap + to set your first target."
                  : "Nothing completed yet. Keep pushing."}
              </p>
            </motion.div>
          ) : (
            displayGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleMilestone={(mid) => toggleMilestone(goal.id, mid)}
                onComplete={() => completeGoal(goal.id)}
                onRemove={() => {
                  if (confirm(`Remove "${goal.title}"?`)) removeGoal(goal.id);
                }}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

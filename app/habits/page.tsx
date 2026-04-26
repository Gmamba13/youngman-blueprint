"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Check, Flame, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import {
  useStore,
  isHabitDoneOn,
  habitStreak,
  isHabitScheduledOn,
  type DailyHabit,
} from "@/lib/store";

// ─── Date helpers ────────────────────────────────────────────────────────────
const DAY_ABBR  = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_FULL  = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function todayStr() {
  return isoDate(new Date());
}

function dateLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  const t = todayStr();
  if (dateStr === t) return "Today";
  const yesterday = isoDate(new Date(Date.now() - 86400000));
  if (dateStr === yesterday) return "Yesterday";
  return `${DAY_FULL[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

// Returns the 7 dates for a given week offset (0 = current week Sun-Sat)
function weekDates(weekOffset: number): string[] {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dow + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return isoDate(d);
  });
}

// ─── Tiny habit row used in the list ─────────────────────────────────────────
function HabitRow({
  habit,
  dateStr,
  isToday,
  onDelete,
}: {
  habit: DailyHabit;
  dateStr: string;
  isToday: boolean;
  onDelete: () => void;
}) {
  const logs         = useStore((s) => s.habitLogs);
  const toggleToday  = useStore((s) => s.toggleHabit);
  const done         = isHabitDoneOn(logs, habit.id, dateStr);
  const streak       = habitStreak(logs, habit.id);
  const [pop, setPop] = useState(false);
  const [popKey, setPopKey] = useState(0);

  const handleToggle = () => {
    if (!isToday) return;
    const wasDone = isHabitDoneOn(useStore.getState().habitLogs, habit.id, dateStr);
    toggleToday(habit.id, habit.xp);
    if (!wasDone) {
      setPopKey((k) => k + 1);
      setPop(true);
      setTimeout(() => setPop(false), 900);
    }
  };

  const recurrenceLabel =
    habit.recurrence === "daily"
      ? "Every day"
      : habit.days.map((d) => DAY_ABBR[d]).join(" · ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, scale: 0.95 }}
      className="flex items-center gap-2"
    >
      {/* Main row */}
      <motion.button
        whileTap={isToday ? { scale: 0.97 } : {}}
        onClick={handleToggle}
        className="flex-1 flex items-center gap-3 p-4 rounded-3xl bg-elevated relative overflow-visible transition-all"
        style={{
          cursor: isToday ? "pointer" : "default",
          boxShadow: done
            ? "0 2px 16px rgba(201,150,59,0.15), 0 1px 4px rgba(0,0,0,0.06)"
            : "0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
          borderLeft: done ? "3px solid #C9963B" : "3px solid transparent",
        }}
      >
        {/* ripple on complete */}
        {done && isToday && (
          <motion.div
            initial={{ scale: 0, opacity: 0.3 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute left-5 top-1/2 w-10 h-10 rounded-full -translate-y-1/2 pointer-events-none"
            style={{ backgroundColor: "rgba(201,150,59,0.3)" }}
          />
        )}

        {/* XP pop */}
        <AnimatePresence>
          {pop && (
            <motion.div
              key={popKey}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -44, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none z-50"
            >
              <div className="px-3 py-1.5 rounded-full text-xs font-bold text-white whitespace-nowrap"
                style={{ background: "#C9963B", boxShadow: "0 4px 16px rgba(201,150,59,0.5)" }}>
                ✦ +{habit.xp} XP
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Checkbox */}
        <motion.div
          animate={{
            borderColor: done ? "#C9963B" : "#D1D5DB",
            backgroundColor: done ? "#C9963B" : "transparent",
          }}
          transition={{ duration: 0.2 }}
          className="w-9 h-9 rounded-2xl flex items-center justify-center border-2 shrink-0"
        >
          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 16 }}
              >
                <Check size={17} className="text-white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Label */}
        <div className="flex-1 text-left">
          <div className={`font-medium text-sm ${done ? "line-through text-secondary" : "text-primary"}`}>
            {habit.title}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-semibold" style={{ color: "#C9963B" }}>
              +{habit.xp} XP
            </span>
            <span className="text-[11px] text-secondary flex items-center gap-0.5">
              <Repeat size={9} className="shrink-0" />
              {recurrenceLabel}
            </span>
            {streak > 0 && (
              <span className="text-[11px] flex items-center gap-0.5 text-secondary">
                <Flame size={10} className="text-clay" /> {streak}
              </span>
            )}
          </div>
        </div>
      </motion.button>

      {/* Delete — only shown on today */}
      {isToday && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onDelete}
          className="w-9 h-9 rounded-2xl bg-elevated border border-border flex items-center justify-center text-secondary shrink-0"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <Trash2 size={14} />
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── XP option button ──────────────────────────────────────────────────────
function XpButton({ value, selected, onSelect }: { value: number; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition ${
        selected ? "bg-void text-white" : "bg-stone text-secondary"
      }`}
    >
      {value}
    </button>
  );
}

// ─── Day-of-week toggle pill ─────────────────────────────────────────────────
function DayPill({ abbr, selected, onToggle }: { abbr: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-9 h-9 rounded-full text-xs font-semibold transition ${
        selected ? "bg-void text-white" : "bg-stone text-secondary"
      }`}
    >
      {abbr}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function HabitsPage() {
  const dailyHabits    = useStore((s) => s.dailyHabits);
  const habitLogs      = useStore((s) => s.habitLogs);
  const addDailyHabit  = useStore((s) => s.addDailyHabit);
  const removeDailyHabit = useStore((s) => s.removeDailyHabit);

  // Calendar state
  const [weekOffset, setWeekOffset]     = useState(0);
  const [selectedDate, setSelectedDate] = useState(todayStr());

  // Add-habit form state
  const [adding, setAdding]             = useState(false);
  const [draft, setDraft]               = useState("");
  const [draftXp, setDraftXp]           = useState(10);
  const [draftRec, setDraftRec]         = useState<DailyHabit["recurrence"]>("daily");
  const [draftDays, setDraftDays]       = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const week = weekDates(weekOffset);
  const today = todayStr();
  const isToday = selectedDate === today;

  // Compute habits scheduled for the selected date
  const selectedDow = new Date(selectedDate + "T12:00:00").getDay();
  const scheduledHabits = dailyHabits.filter((h) => isHabitScheduledOn(h, selectedDate));
  const doneCount  = scheduledHabits.filter((h) => isHabitDoneOn(habitLogs, h.id, selectedDate)).length;

  // Per-day completion dots for calendar
  function dayCompletionFraction(dateStr: string) {
    const scheduled = dailyHabits.filter((h) => isHabitScheduledOn(h, dateStr));
    if (!scheduled.length) return 0;
    const done = scheduled.filter((h) => isHabitDoneOn(habitLogs, h.id, dateStr)).length;
    return done / scheduled.length;
  }

  const toggleDraftDay = (d: number) =>
    setDraftDays((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);

  const submitHabit = () => {
    if (!draft.trim()) return;
    if (draftRec === "custom" && draftDays.length === 0) return;
    addDailyHabit(draft.trim(), draftXp, draftRec, draftDays);
    setDraft("");
    setDraftXp(10);
    setDraftRec("daily");
    setDraftDays([]);
    setAdding(false);
  };

  const openAdd = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const d = new Date(selectedDate + "T12:00:00");
  const headerDateStr = `${DAY_FULL[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;

  return (
    <div className="pb-32">
      {/* ── Header ── */}
      <div className="px-5 pt-10 pb-4">
        <div className="label mb-1">Daily Habits</div>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-3xl text-primary leading-tight">
            {isToday ? "Today" : dateLabel(selectedDate)}
          </h1>
          {!isToday && (
            <button
              onClick={() => { setSelectedDate(today); setWeekOffset(0); }}
              className="text-xs text-secondary bg-stone px-3 py-1.5 rounded-full border border-border"
            >
              Back to today
            </button>
          )}
        </div>
        <p className="text-sm text-secondary mt-0.5">
          {isToday ? headerDateStr : ""}
        </p>
      </div>

      {/* ── Week calendar strip ── */}
      <div className="px-5 mb-5">
        <div
          className="bg-elevated rounded-4xl p-4"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)" }}
        >
          {/* Month + nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="w-8 h-8 rounded-full bg-stone flex items-center justify-center text-secondary active:scale-90 transition"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-semibold text-primary">
              {(() => {
                const first = new Date(week[0] + "T12:00:00");
                const last  = new Date(week[6] + "T12:00:00");
                if (first.getMonth() === last.getMonth())
                  return `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`;
                return `${MONTH_NAMES[first.getMonth()]} – ${MONTH_NAMES[last.getMonth()]}`;
              })()}
            </span>
            <button
              onClick={() => setWeekOffset((o) => Math.min(o + 1, 0))}
              disabled={weekOffset === 0}
              className="w-8 h-8 rounded-full bg-stone flex items-center justify-center text-secondary active:scale-90 transition disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Days row */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day labels */}
            {DAY_ABBR.map((l) => (
              <div key={l} className="text-center text-[10px] text-secondary uppercase tracking-wider pb-1">
                {l}
              </div>
            ))}

            {/* Day buttons */}
            {week.map((dateStr) => {
              const num     = new Date(dateStr + "T12:00:00").getDate();
              const isSelected = dateStr === selectedDate;
              const isT     = dateStr === today;
              const frac    = dayCompletionFraction(dateStr);
              const isFuture = dateStr > today;
              const hasAny  = dailyHabits.some((h) => isHabitScheduledOn(h, dateStr));

              return (
                <button
                  key={dateStr}
                  onClick={() => !isFuture && setSelectedDate(dateStr)}
                  disabled={isFuture}
                  className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition ${
                    isSelected
                      ? "bg-void"
                      : isT
                      ? "bg-stone border border-border"
                      : "hover:bg-stone"
                  } ${isFuture ? "opacity-30 cursor-default" : "active:scale-95"}`}
                >
                  <span className={`text-sm font-semibold leading-none ${isSelected ? "text-white" : "text-primary"}`}>
                    {num}
                  </span>

                  {/* Completion indicator */}
                  {hasAny ? (
                    <div className="w-4 h-1 rounded-full overflow-hidden bg-stone">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${frac * 100}%`,
                          background: isSelected ? "rgba(255,255,255,0.7)" : frac === 1 ? "#22C55E" : "#C9963B",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-4 h-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Habits list ── */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-display text-xl text-primary">Habits</span>
            {scheduledHabits.length > 0 && (
              <span className="ml-2 text-sm text-secondary">
                {doneCount}/{scheduledHabits.length} done
              </span>
            )}
          </div>
          {isToday && (
            <button
              onClick={openAdd}
              className="w-8 h-8 rounded-full bg-void text-white flex items-center justify-center active:scale-90 transition"
              aria-label="Add habit"
            >
              <Plus size={15} />
            </button>
          )}
        </div>

        {/* ── Add habit form ── */}
        <AnimatePresence initial={false}>
          {adding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div
                className="bg-elevated rounded-4xl p-4 space-y-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)" }}
              >
                {/* Habit name */}
                <div>
                  <label className="label mb-1.5 block">Habit name</label>
                  <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitHabit()}
                    placeholder="e.g. Morning workout"
                    maxLength={60}
                    className="w-full bg-stone rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-secondary outline-none"
                  />
                </div>

                {/* XP */}
                <div>
                  <label className="label mb-1.5 block">XP reward</label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((v) => (
                      <XpButton key={v} value={v} selected={draftXp === v} onSelect={() => setDraftXp(v)} />
                    ))}
                  </div>
                </div>

                {/* Recurrence */}
                <div>
                  <label className="label mb-1.5 block">Repeat</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDraftRec("daily")}
                      className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition ${
                        draftRec === "daily" ? "bg-void text-white" : "bg-stone text-secondary"
                      }`}
                    >
                      Every day
                    </button>
                    <button
                      onClick={() => setDraftRec("custom")}
                      className={`flex-1 py-2 rounded-2xl text-sm font-semibold transition ${
                        draftRec === "custom" ? "bg-void text-white" : "bg-stone text-secondary"
                      }`}
                    >
                      Specific days
                    </button>
                  </div>

                  {/* Day picker */}
                  <AnimatePresence initial={false}>
                    {draftRec === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex justify-between mt-3">
                          {DAY_ABBR.map((abbr, i) => (
                            <DayPill
                              key={abbr}
                              abbr={abbr}
                              selected={draftDays.includes(i)}
                              onToggle={() => toggleDraftDay(i)}
                            />
                          ))}
                        </div>
                        {draftRec === "custom" && draftDays.length === 0 && (
                          <p className="text-[11px] text-secondary mt-2">Pick at least one day.</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setAdding(false)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-stone text-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitHabit}
                    disabled={!draft.trim() || (draftRec === "custom" && draftDays.length === 0)}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-void text-white disabled:opacity-40 transition"
                  >
                    Add habit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habit rows */}
        <div className="space-y-2">
          <AnimatePresence>
            {scheduledHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                dateStr={selectedDate}
                isToday={isToday}
                onDelete={() => {
                  if (confirm(`Remove "${habit.title}"?`)) removeDailyHabit(habit.id);
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {scheduledHabits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            {isToday ? (
              <>
                <div className="text-4xl mb-3">🎯</div>
                <p className="font-display text-lg text-primary">No habits yet.</p>
                <p className="text-sm text-secondary mt-1">Tap + to build your first daily habit.</p>
                <button
                  onClick={openAdd}
                  className="mt-4 inline-flex items-center gap-2 bg-void text-white px-5 py-2.5 rounded-full text-sm font-semibold"
                >
                  <Plus size={14} /> Add habit
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">📅</div>
                <p className="text-sm text-secondary">No habits scheduled for this day.</p>
              </>
            )}
          </motion.div>
        )}

        {/* All habits on non-today with none scheduled */}
        {!isToday && dailyHabits.length > 0 && scheduledHabits.length === 0 && (
          <p className="text-xs text-secondary text-center mt-2">
            {DAY_FULL[new Date(selectedDate + "T12:00:00").getDay()]} has no habits scheduled.
          </p>
        )}
      </div>

      {/* ── All habits summary (today only) ── */}
      {isToday && dailyHabits.length > 0 && (
        <div className="px-5 mt-8">
          <div className="label mb-3">All habits ({dailyHabits.length})</div>
          <div className="space-y-2">
            {dailyHabits
              .filter((h) => !scheduledHabits.find((s) => s.id === h.id))
              .map((habit) => {
                const recurrenceLabel =
                  habit.recurrence === "daily"
                    ? "Every day"
                    : habit.days.map((d) => DAY_ABBR[d]).join(" · ");
                return (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-4 rounded-3xl bg-elevated border border-border opacity-50"
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <div className="w-9 h-9 rounded-2xl bg-stone flex items-center justify-center shrink-0">
                      <Repeat size={14} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-primary">{habit.title}</div>
                      <div className="text-[11px] text-secondary mt-0.5">
                        Not scheduled today · {recurrenceLabel}
                      </div>
                    </div>
                    <button
                      onClick={() => { if (confirm(`Remove "${habit.title}"?`)) removeDailyHabit(habit.id); }}
                      className="w-8 h-8 rounded-xl bg-stone flex items-center justify-center text-secondary shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

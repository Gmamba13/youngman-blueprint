"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, BodyMetric } from "@/lib/store";
import { Plus, X, Trash2, Check } from "lucide-react";

const SUGGESTIONS = [
  { name: "Weight", unit: "kg" },
  { name: "Sleep", unit: "hrs" },
  { name: "Body Fat", unit: "%" },
  { name: "Water", unit: "L" },
];

function MetricChart({ entries }: { entries: { date: string; value: number }[] }) {
  const W = 280, H = 80;
  const padding = { top: 8, right: 8, bottom: 8, left: 32 };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
  if (sorted.length === 0) {
    return (
      <div className="h-20 flex items-center justify-center text-xs text-muted">
        No data yet
      </div>
    );
  }
  if (sorted.length === 1) {
    return (
      <div className="h-20 flex items-center justify-center">
        <div className="text-xs text-muted">Log more entries to see a chart</div>
      </div>
    );
  }

  const values = sorted.map((e) => e.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const rangeV = maxV === minV ? 1 : maxV - minV;

  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;

  const points = sorted.map((e, i) => ({
    x: padding.left + (i / (sorted.length - 1)) * chartW,
    y: padding.top + chartH - ((e.value - minV) / rangeV) * chartH,
    value: e.value,
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      {/* Y axis labels */}
      <text x="0" y={padding.top + 4} fontSize="8" fill="#AAAAAA" textAnchor="start">{maxV}</text>
      <text x="0" y={H - padding.bottom} fontSize="8" fill="#AAAAAA" textAnchor="start">{minV}</text>
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke="#C9963B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#C9963B" />
      ))}
      {/* Latest value label */}
      {points.length > 0 && (
        <text
          x={points[points.length - 1].x}
          y={points[points.length - 1].y - 6}
          fontSize="8"
          fill="#C9963B"
          textAnchor="middle"
          fontWeight="600"
        >
          {points[points.length - 1].value}
        </text>
      )}
    </svg>
  );
}

function formatEntryDate(dateStr: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateStr === today) return "Today";
  if (dateStr === yesterday) return "Yesterday";
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MetricCard({ metric, onRemove }: { metric: BodyMetric; onRemove: () => void }) {
  const logMetricEntry = useStore((s) => s.logMetricEntry);
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayEntry = metric.entries.find((e) => e.date === todayStr);

  const [logging, setLogging] = useState(false);
  const [logDate, setLogDate] = useState(todayStr);
  const [inputVal, setInputVal] = useState("");
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const existingEntry = metric.entries.find((e) => e.date === logDate);

  const openLog = (date: string = todayStr) => {
    setLogDate(date);
    setInputVal(metric.entries.find((e) => e.date === date)?.value.toString() ?? "");
    setLogging(true);
  };

  const handleLog = () => {
    const v = parseFloat(inputVal);
    if (isNaN(v)) return;
    logMetricEntry(metric.id, logDate, v);
    setLogging(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sortedEntries = [...metric.entries].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-display text-base text-primary">{metric.name}</div>
          <div className="text-xs text-muted mt-0.5">
            {metric.entries.length} {metric.entries.length === 1 ? "entry" : "entries"} · {metric.unit}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {todayEntry && !logging && !saved && (
            <span className="text-xs font-semibold text-gold">Today: {todayEntry.value}{metric.unit}</span>
          )}
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-green-600 flex items-center gap-1">
              <Check size={12} /> Saved
            </motion.span>
          )}
          <button
            onClick={() => { if (confirm(`Remove "${metric.name}"?`)) onRemove(); }}
            className="w-7 h-7 rounded-xl bg-stone border border-border flex items-center justify-center text-muted active:scale-90 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <MetricChart entries={metric.entries} />

      {/* Log form */}
      <div className="mt-3">
        <AnimatePresence mode="wait">
          {logging ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 mt-1">
                {/* Date + value row */}
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={logDate}
                    max={todayStr}
                    onChange={(e) => {
                      setLogDate(e.target.value);
                      setInputVal(metric.entries.find((en) => en.date === e.target.value)?.value.toString() ?? "");
                    }}
                    className="w-36 bg-stone rounded-2xl px-3 py-2.5 text-sm outline-none text-primary"
                  />
                  <input
                    autoFocus
                    type="number"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={metric.unit}
                    className="flex-1 bg-stone rounded-2xl px-3 py-2.5 text-sm outline-none text-primary placeholder:text-secondary"
                    onKeyDown={(e) => e.key === "Enter" && handleLog()}
                  />
                </div>
                {existingEntry && (
                  <p className="text-[10px] text-muted px-1">
                    Existing: {existingEntry.value}{metric.unit} — will be overwritten
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleLog}
                    disabled={!inputVal.trim() || isNaN(parseFloat(inputVal))}
                    className="flex-1 py-2.5 rounded-2xl bg-void text-white text-xs font-semibold disabled:opacity-40 active:scale-95 transition"
                  >
                    Save Entry
                  </button>
                  <button
                    onClick={() => setLogging(false)}
                    className="w-10 h-10 rounded-2xl bg-stone border border-border flex items-center justify-center text-muted active:scale-90 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <button
              key="log-btn"
              onClick={() => openLog(todayStr)}
              className="w-full py-2 rounded-2xl bg-stone text-xs font-semibold text-secondary border border-border active:scale-[0.98] transition"
            >
              {todayEntry ? "Update today's entry" : "+ Log entry"}
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Entry history */}
      {sortedEntries.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="w-full flex items-center justify-between text-xs text-muted active:opacity-70 transition"
          >
            <span>History ({sortedEntries.length})</span>
            <span>{showHistory ? "▲" : "▼"}</span>
          </button>
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 space-y-1">
                  {sortedEntries.map((entry) => (
                    <button
                      key={entry.date}
                      onClick={() => openLog(entry.date)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-stone active:scale-[0.98] transition"
                    >
                      <span className="text-xs text-secondary">{formatEntryDate(entry.date)}</span>
                      <span className="text-xs font-semibold text-primary">{entry.value} {metric.unit}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export default function MetricsPage() {
  const bodyMetrics = useStore((s) => s.bodyMetrics);
  const addMetric = useStore((s) => s.addMetric);
  const removeMetric = useStore((s) => s.removeMetric);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    addMetric(name, unit);
    setName("");
    setUnit("");
    setShowForm(false);
  };

  const handleSuggestion = (s: { name: string; unit: string }) => {
    addMetric(s.name, s.unit);
  };

  const suggestionNames = new Set(bodyMetrics.map((m) => m.name));

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
            <div className="label mb-1">Tracking</div>
            <h1 className="font-display text-3xl text-primary leading-tight">Body Metrics</h1>
            <p className="text-sm text-secondary mt-1">Log and track over time.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="w-10 h-10 rounded-full bg-void text-white flex items-center justify-center active:scale-90 transition shrink-0"
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>
      </motion.div>

      {/* Add Metric Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-4 card space-y-3">
              <div className="label">New metric</div>
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (e.g. Weight)"
                  maxLength={30}
                  className="flex-1 bg-stone rounded-2xl px-3 py-2.5 text-sm outline-none text-primary placeholder:text-secondary"
                />
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Unit"
                  maxLength={10}
                  className="w-20 bg-stone rounded-2xl px-3 py-2.5 text-sm outline-none text-primary placeholder:text-secondary"
                />
              </div>
              <button
                onClick={handleAdd}
                disabled={!name.trim()}
                className="w-full py-3 rounded-2xl bg-void text-white text-sm font-semibold disabled:opacity-40 active:scale-[0.98] transition"
              >
                Add Metric
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick-add suggestions */}
      {SUGGESTIONS.some((s) => !suggestionNames.has(s.name)) && (
        <div className="px-5 mb-4">
          <div className="label mb-2">Quick add</div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.filter((s) => !suggestionNames.has(s.name)).map((s) => (
              <button
                key={s.name}
                onClick={() => handleSuggestion(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone border border-border text-xs font-medium text-secondary active:scale-95 transition"
              >
                <Plus size={11} /> {s.name} ({s.unit})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metrics list */}
      <div className="px-5 space-y-3">
        <AnimatePresence mode="popLayout">
          {bodyMetrics.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-border py-14 text-center"
            >
              <div className="text-4xl mb-3">📈</div>
              <p className="text-sm text-muted">No metrics yet.</p>
              <p className="text-xs text-muted mt-1">Tap + or use Quick Add to start tracking.</p>
            </motion.div>
          ) : (
            bodyMetrics.map((metric) => (
              <MetricCard
                key={metric.id}
                metric={metric}
                onRemove={() => removeMetric(metric.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

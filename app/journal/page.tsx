"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { getDailyPrompt } from "@/lib/journal-prompts";
import { Pencil, CheckCircle2 } from "lucide-react";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function JournalPage() {
  const today = new Date().toISOString().slice(0, 10);
  const prompt = getDailyPrompt(today);
  const journalEntries = useStore((s) => s.journalEntries);
  const saveJournalEntry = useStore((s) => s.saveJournalEntry);

  const todayEntry = journalEntries[today];

  // Start in "submitted" view if an entry already exists
  const [text, setText] = useState(todayEntry?.text ?? "");
  const [submitted, setSubmitted] = useState(!!todayEntry?.text);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const pastEntries = Object.values(journalEntries)
    .filter((e) => e.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date));

  const entryCount = Object.keys(journalEntries).length;

  const handleSubmit = () => {
    if (!text.trim()) return;
    saveJournalEntry(today, text.trim(), prompt);
    setSubmitted(true);
  };

  const handleEditToday = () => {
    setSubmitted(false);
  };

  const handleStartEditPast = (date: string, currentText: string) => {
    setEditingDate(date);
    setEditText(currentText);
    setExpandedDate(null);
  };

  const handleSavePast = (date: string, entryPrompt: string) => {
    if (!editText.trim()) return;
    saveJournalEntry(date, editText.trim(), entryPrompt);
    setEditingDate(null);
    setEditText("");
  };

  return (
    <div className="pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-5 pt-12 pb-5 flex items-start justify-between"
      >
        <div>
          <div className="label mb-1">Journal</div>
          <h1 className="font-display text-3xl text-primary leading-tight">{formatDate(today)}</h1>
        </div>
        {entryCount > 0 && (
          <div className="mt-2 bg-stone rounded-full px-3 py-1.5 border border-border">
            <span className="text-xs font-medium text-secondary">
              {entryCount} {entryCount === 1 ? "entry" : "entries"}
            </span>
          </div>
        )}
      </motion.div>

      {/* Today's Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-5 card"
        style={{ borderLeft: "3px solid #C9963B" }}
      >
        <div className="label mb-2" style={{ color: "#C9963B" }}>Today&apos;s prompt</div>
        <p className="font-display text-base text-primary leading-snug">{prompt}</p>
      </motion.div>

      {/* Today's Entry */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="px-5 mt-4"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            /* ── Submitted view ── */
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-xs font-semibold text-green-600">Entry saved</span>
                </div>
                <button
                  onClick={handleEditToday}
                  className="flex items-center gap-1.5 text-xs text-secondary bg-stone px-3 py-1.5 rounded-full border border-border active:scale-95 transition"
                >
                  <Pencil size={11} />
                  Edit
                </button>
              </div>
              <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">{text}</p>
            </motion.div>
          ) : (
            /* ── Writing view ── */
            <motion.div
              key="writing"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write here..."
                rows={7}
                autoFocus
                className="w-full bg-stone rounded-3xl px-4 py-3 text-sm outline-none resize-none text-primary placeholder:text-secondary leading-relaxed"
                style={{ minHeight: 160 }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!text.trim()}
                className="w-full mt-3 py-3.5 rounded-full text-sm font-semibold transition disabled:opacity-40"
                style={{
                  background: text.trim() ? "#0D0D0D" : "#F2F2F2",
                  color: text.trim() ? "#FFFFFF" : "#AAAAAA",
                }}
              >
                Submit Entry
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Past Entries */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-5 mt-8"
      >
        <div className="label mb-3">Past entries</div>

        {pastEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-10 text-center">
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm text-muted">Your past entries will appear here.</p>
            <p className="text-xs text-muted mt-1">Keep writing — consistency builds clarity.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {pastEntries.map((entry) => (
                <motion.div
                  key={entry.date}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  {editingDate === entry.date ? (
                    /* ── Edit mode for past entry ── */
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="text-xs font-medium text-secondary mb-2">
                        {formatDateShort(entry.date)}
                      </div>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={6}
                        autoFocus
                        className="w-full bg-stone rounded-2xl px-4 py-3 text-sm outline-none resize-none text-primary leading-relaxed"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSavePast(entry.date, entry.prompt)}
                          disabled={!editText.trim()}
                          className="flex-1 py-2.5 rounded-full bg-void text-white text-xs font-semibold disabled:opacity-40 transition active:scale-[0.98]"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingDate(null)}
                          className="px-4 py-2.5 rounded-full bg-stone border border-border text-xs font-semibold text-secondary transition active:scale-[0.98]"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── Read mode for past entry ── */
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => setExpandedDate(expandedDate === entry.date ? null : entry.date)}
                        >
                          <div className="text-xs font-medium text-secondary mb-1">
                            {formatDateShort(entry.date)}
                          </div>
                          <p className="text-sm text-primary leading-snug">
                            {expandedDate === entry.date
                              ? entry.text
                              : entry.text.slice(0, 80) + (entry.text.length > 80 ? "…" : "")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 mt-0.5">
                          <button
                            onClick={() => handleStartEditPast(entry.date, entry.text)}
                            className="text-secondary active:text-primary transition p-1"
                            aria-label="Edit entry"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => setExpandedDate(expandedDate === entry.date ? null : entry.date)}
                            className="text-muted text-xs"
                          >
                            {expandedDate === entry.date ? "▲" : "▼"}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedDate === entry.date && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="text-[10px] uppercase tracking-wider text-muted mb-1">Prompt</div>
                              <p className="text-xs text-secondary italic leading-relaxed">{entry.prompt}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}

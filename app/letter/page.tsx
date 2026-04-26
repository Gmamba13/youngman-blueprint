"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { ArrowLeft, Lock, Unlock, Send, Clock } from "lucide-react";

const LOCK_OPTIONS = [
  { days: 30,  label: "30 days",  sub: "One month from now" },
  { days: 60,  label: "60 days",  sub: "Two months from now" },
  { days: 90,  label: "90 days",  sub: "Three months — recommended" },
  { days: 180, label: "6 months", sub: "Half a year" },
];

function useCountdown(writtenAt: string | null, lockDays: number) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0, unlocked: false });

  useEffect(() => {
    if (!writtenAt) return;
    const tick = () => {
      const unlock = new Date(writtenAt).getTime() + lockDays * 86400000;
      const diff = unlock - Date.now();
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, mins: 0, unlocked: true });
      } else {
        setRemaining({
          days:     Math.floor(diff / 86400000),
          hours:    Math.floor((diff % 86400000) / 3600000),
          mins:     Math.floor((diff % 3600000) / 60000),
          unlocked: false,
        });
      }
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [writtenAt, lockDays]);

  return remaining;
}

export default function LetterPage() {
  const router = useRouter();
  const { name, letter, letterWrittenAt, letterLockDays, letterRevealed, writeLetter, revealLetter } = useStore();

  const [draft, setDraft]           = useState("");
  const [lockDays, setLockDays]     = useState(90);
  const [sealing, setSealing]       = useState(false);
  const [revealing, setRevealing]   = useState(false);
  const [sealDone, setSealDone]     = useState(false);

  const countdown = useCountdown(letterWrittenAt, letterLockDays);
  const hasLetter = !!letterWrittenAt;

  const seal = () => {
    if (draft.trim().length < 20) return;
    setSealing(true);
    setTimeout(() => {
      writeLetter(draft.trim(), lockDays);
      setSealDone(true);
      setSealing(false);
    }, 1800);
  };

  const reveal = () => {
    setRevealing(true);
    setTimeout(() => {
      revealLetter();
      setRevealing(false);
    }, 1600);
  };

  const unlockDate = letterWrittenAt
    ? new Date(new Date(letterWrittenAt).getTime() + letterLockDays * 86400000)
    : null;

  // ── STATE 1: Write the letter ─────────────────────────────────────────────
  if (!hasLetter) {
    return (
      <div className="min-h-screen bg-ink flex flex-col">
        {/* header */}
        <div className="px-5 pt-12 pb-6 flex items-center gap-3 relative z-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-cream"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-[10px] text-cream/50 uppercase tracking-[0.25em]">Time capsule</div>
            <h1 className="font-display text-xl text-cream leading-tight">Letter to Future You</h1>
          </div>
        </div>

        {/* ambient */}
        <motion.div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-clay/15 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />
        <motion.div className="absolute bottom-32 left-0 w-56 h-56 rounded-full bg-lilac/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 14, repeat: Infinity, delay: 2 }} />

        <div className="flex-1 flex flex-col px-5 relative z-10">
          {/* intro */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-cream/60 text-sm leading-relaxed mb-5"
          >
            Write to the man you'll be when this unlocks. Be honest about where you are today. Tell him what you're fighting for.
          </motion.p>

          {/* salutation */}
          <div className="text-cream/40 text-sm font-display mb-2">
            Dear {name || "future me"},
          </div>

          {/* textarea */}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Right now I'm struggling with... The man I want to become is... I promise you that by the time you read this..."
            className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-4 text-cream text-sm leading-relaxed outline-none resize-none min-h-[240px] placeholder:text-cream/25 font-display"
          />
          <div className="text-[11px] text-cream/30 text-right mt-1">{draft.length} characters</div>

          {/* sign off */}
          <div className="text-cream/40 text-sm font-display mt-2">
            — {name || "Me"}, {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>

          {/* lock picker */}
          <div className="mt-6">
            <div className="text-[10px] text-cream/50 uppercase tracking-[0.2em] mb-2">Seal it for</div>
            <div className="grid grid-cols-4 gap-2">
              {LOCK_OPTIONS.map((o) => (
                <button
                  key={o.days}
                  onClick={() => setLockDays(o.days)}
                  className={`rounded-2xl p-2.5 text-center transition ${
                    lockDays === o.days ? "bg-cream text-ink" : "bg-white/10 text-cream/70"
                  }`}
                >
                  <div className="font-display text-base leading-tight">{o.label.split(" ")[0]}</div>
                  <div className="text-[9px] opacity-70">{o.label.split(" ")[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* seal button */}
          <motion.button
            onClick={seal}
            disabled={draft.trim().length < 20 || sealing}
            whileTap={{ scale: 0.97 }}
            className="btn-primary w-full mt-5 mb-8 disabled:opacity-40 bg-cream text-ink justify-center"
          >
            {sealing ? (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                Sealing…
              </motion.span>
            ) : (
              <><Lock size={15} /> Seal the Letter</>
            )}
          </motion.button>
        </div>

        {/* sealing animation overlay */}
        <AnimatePresence>
          {sealing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink flex flex-col items-center justify-center z-50"
            >
              <motion.div
                animate={{ scale: [1, 1.3, 0.8, 1.1, 1], rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="text-7xl"
              >
                ✉️
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="text-cream/70 mt-4 text-sm"
              >
                Sealing your letter…
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── STATE 2: Letter is sealed and still locked ────────────────────────────
  if (hasLetter && !letterRevealed && !countdown.unlocked) {
    return (
      <div className="min-h-screen bg-ink flex flex-col">
        <motion.div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-clay/15 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 12, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 left-0 w-56 h-56 rounded-full bg-sky/10 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 16, repeat: Infinity, delay: 3 }} />

        <div className="px-5 pt-12 flex items-center gap-3 relative z-10">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-cream">
            <ArrowLeft size={16} />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 relative z-10 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-6"
          >
            ✉️
          </motion.div>

          <div className="text-[10px] text-cream/50 uppercase tracking-[0.25em]">Your letter is sealed</div>
          <h1 className="font-display text-3xl text-cream mt-2 leading-tight">
            Opens in
          </h1>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-end gap-3 mt-6"
          >
            {[
              { val: countdown.days,  label: "days"  },
              { val: countdown.hours, label: "hours" },
              { val: countdown.mins,  label: "mins"  },
            ].map(({ val, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="bg-white/10 rounded-2xl px-4 py-3 min-w-[64px]">
                  <div className="font-display text-4xl text-cream tabular-nums text-center">{val}</div>
                </div>
                <div className="text-[10px] text-cream/40 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </motion.div>

          <p className="text-cream/50 text-sm mt-6 max-w-[260px] leading-relaxed">
            Written on {new Date(letterWrittenAt!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-cream/30 text-sm mt-1">
            Unlocks {unlockDate?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="mt-8 flex items-center gap-2 text-cream/30 text-xs">
            <Lock size={12} /> Sealed for {letterLockDays} days
          </div>
        </div>
      </div>
    );
  }

  // ── STATE 3: Ready to unlock ──────────────────────────────────────────────
  if (hasLetter && !letterRevealed && countdown.unlocked) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-5 relative overflow-hidden">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-clay/20 to-ink pointer-events-none" />
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl pointer-events-none"
            initial={{ opacity: 0, y: 100, x: Math.random() * 300 - 150 }}
            animate={{ opacity: [0, 1, 0], y: -200 }}
            transition={{ delay: i * 0.15, duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
          >
            {["✨", "🔥", "⭐", "💫"][i % 4]}
          </motion.div>
        ))}

        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-8xl relative z-10 mb-6"
        >
          ✉️
        </motion.div>
        <div className="text-[10px] text-cream/50 uppercase tracking-[0.25em] relative z-10">Time capsule</div>
        <h1 className="font-display text-4xl text-cream mt-2 text-center leading-tight relative z-10">
          Your letter<br />is ready.
        </h1>
        <p className="text-cream/60 text-sm mt-3 text-center max-w-[260px] relative z-10">
          {letterLockDays} days ago you wrote this to yourself. Are you ready to read it?
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={reveal}
          className="mt-8 relative z-10 bg-cream text-ink font-medium px-8 py-4 rounded-full flex items-center gap-2 shadow-lift"
        >
          {revealing ? (
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
              Opening…
            </motion.span>
          ) : (
            <><Unlock size={16} /> Open the Letter</>
          )}
        </motion.button>

        <AnimatePresence>
          {revealing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cream z-50 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [0.8, 1.4, 1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 1.4 }}
                className="text-8xl"
              >
                ✉️
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── STATE 4: Letter revealed ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative bg-ink px-5 pt-12 pb-10 rounded-b-5xl overflow-hidden">
        <motion.div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-clay/20 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} />

        <button onClick={() => router.back()} className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-cream mb-6">
          <ArrowLeft size={16} />
        </button>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="text-5xl relative mb-4">✉️</motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="text-[10px] text-cream/50 uppercase tracking-[0.25em]">Written {letterLockDays} days ago</div>
          <h1 className="font-display text-3xl text-cream mt-1 leading-tight">
            A letter from<br />your past self.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mt-3 text-cream/50 text-xs"
        >
          <Clock size={11} />
          {new Date(letterWrittenAt!).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex-1 px-5 pt-8 pb-10"
      >
        <div className="text-sm text-muted font-display mb-3">
          Dear {name || "future me"},
        </div>
        <div className="font-display text-base text-ink leading-relaxed whitespace-pre-wrap bg-white rounded-4xl p-6 shadow-soft">
          {letter}
        </div>
        <div className="text-sm text-muted font-display mt-4 text-right">
          — {name || "Me"}, {new Date(letterWrittenAt!).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-ink rounded-4xl p-5 text-cream"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-cream/50">Reflect</div>
          <p className="text-sm mt-2 leading-relaxed text-cream/80">
            Did you become who you promised? What changed? What stayed the same?
          </p>
        </motion.div>

        <button
          onClick={() => { if (confirm("Write a new letter? This will replace the current one.")) { useStore.getState().writeLetter("", 0); window.location.reload(); } }}
          className="btn-ghost w-full mt-6"
        >
          <Send size={14} /> Write a new letter
        </button>
      </motion.div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { PILLARS } from "@/lib/pillars";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

const STRUGGLES = [
  "Feeling stuck",
  "Low motivation",
  "Addiction",
  "Breakup",
  "Lost / no direction",
  "Anxiety / depression",
  "Out of shape",
  "Broke",
  "Lonely",
  "Lack discipline",
  "Career confusion",
  "Porn",
  "Screen addiction",
];

const TOTAL_STEPS = 6;

export default function Onboarding() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [location, setLocation] = useState("");
  const [struggles, setStruggles] = useState<string[]>([]);
  const [why, setWhy] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (list: string[], setList: (v: string[]) => void, val: string) =>
    setList(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  const canContinue = () => {
    switch (step) {
      case 0: return true;
      case 1:
        return (
          name.trim().length > 0 &&
          Number(age) > 0 &&
          occupation !== "" &&
          relationshipStatus !== ""
        );
      case 2: return struggles.length >= 1;
      case 3: return why.trim().length >= 3;
      case 4: return picked.length >= 1;
      case 5: return true;
      default: return false;
    }
  };

  const next = () => {
    if (!canContinue()) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      setProfile({
        name: name.trim(),
        age: Number(age),
        occupation,
        relationshipStatus,
        location: location.trim(),
        struggles,
        why: why.trim(),
        dailyCommitment: "",
        focusPillars: picked,
      });
      router.push("/assessment");
    }
  };

  const back = () => {
    if (step === 0) router.push("/welcome");
    else setStep(step - 1);
  };

  return (
    <div className="min-h-screen px-6 pt-12 pb-10 flex flex-col">
      {/* Top bar: back + progress */}
      <div className="flex items-center gap-3">
        <button
          onClick={back}
          className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-sand overflow-hidden">
          <motion.div
            className="h-full bg-ink"
            initial={false}
            animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="text-[11px] text-muted tabular-nums">
          {step + 1}/{TOTAL_STEPS}
        </div>
      </div>

      <div className="flex-1 mt-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="relative"
            >
              {/* Ambient blobs */}
              <div className="absolute -z-10 -top-4 -right-6 w-40 h-40 rounded-full bg-clay/15 blur-3xl" />
              <div className="absolute -z-10 top-10 -left-10 w-40 h-40 rounded-full bg-lilac/20 blur-3xl" />

              {/* Floating mini cards */}
              <div className="relative h-[140px]">
                <motion.div
                  initial={{ opacity: 0, y: 14, rotate: -5 }}
                  animate={{
                    opacity: 1,
                    y: [0, -6, 0],
                    rotate: -5,
                  }}
                  transition={{
                    opacity: { delay: 0.2, duration: 0.5 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute top-0 left-0"
                >
                  <div className="bg-white rounded-3xl shadow-lift p-3 pr-4 flex items-center gap-2 border border-black/5">
                    <div className="w-8 h-8 rounded-xl bg-ink flex items-center justify-center text-cream text-sm font-display">
                      4
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-muted">Level up</div>
                      <div className="text-xs font-semibold">Warrior</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14, rotate: 6 }}
                  animate={{
                    opacity: 1,
                    y: [0, -8, 0],
                    rotate: 6,
                  }}
                  transition={{
                    opacity: { delay: 0.35, duration: 0.5 },
                    y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                  }}
                  className="absolute top-4 right-0"
                >
                  <div
                    className="rounded-3xl shadow-lift p-3 pr-4 flex items-center gap-2 border border-black/5"
                    style={{ backgroundColor: "#E8F0E8" }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-sage flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-sageDark">Quest</div>
                      <div className="text-xs font-semibold">+10 XP</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 14, rotate: -3 }}
                  animate={{
                    opacity: 1,
                    y: [0, -5, 0],
                    rotate: -3,
                  }}
                  transition={{
                    opacity: { delay: 0.5, duration: 0.5 },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
                  }}
                  className="absolute top-[78px] left-12"
                >
                  <div className="bg-ink text-cream rounded-3xl shadow-lift p-3 pr-4 flex items-center gap-2">
                    <span className="text-lg">🔥</span>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-cream/60">Streak</div>
                      <div className="text-xs font-semibold">12 days</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="text-xs text-muted uppercase tracking-[0.2em] mt-2">Before we begin</div>
              <h1 className="font-display text-4xl leading-tight mt-3">
                This isn't your<br />average habit<br />tracker app.
              </h1>
              <p className="text-muted text-sm mt-5 leading-relaxed">
                This is designed specifically for young men. Most habit tracker apps are too broad and don't solve the real problems that young men face.
              </p>
              <p className="text-ink text-sm mt-5 font-medium">
                Answer these questions as honestly as possible.
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="font-display text-4xl leading-tight">Who are you?</h1>
              <p className="text-muted text-sm mt-2">The basics. Takes 30 seconds.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs text-muted uppercase tracking-wider">First name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. James"
                    className="w-full mt-1 bg-white rounded-2xl px-4 py-3 shadow-soft outline-none text-base"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="18"
                      className="w-full mt-1 bg-white rounded-2xl px-4 py-3 shadow-soft outline-none text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted uppercase tracking-wider">Location</label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City"
                      className="w-full mt-1 bg-white rounded-2xl px-4 py-3 shadow-soft outline-none text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted uppercase tracking-wider">What do you do?</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Student", "Working", "Between jobs", "Other"].map((o) => {
                      const on = occupation === o;
                      return (
                        <button
                          key={o}
                          onClick={() => setOccupation(o)}
                          className={`px-3 py-2.5 rounded-2xl text-sm transition ${
                            on ? "bg-ink text-cream" : "bg-white shadow-soft"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted uppercase tracking-wider">Relationship status</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Single", "Dating", "In a relationship", "Married"].map((o) => {
                      const on = relationshipStatus === o;
                      return (
                        <button
                          key={o}
                          onClick={() => setRelationshipStatus(o)}
                          className={`px-3 py-2.5 rounded-2xl text-sm transition ${
                            on ? "bg-ink text-cream" : "bg-white shadow-soft"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="font-display text-4xl leading-tight">What brings<br />you here?</h1>
              <p className="text-muted text-sm mt-2">Pick everything that hits. Be honest.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {STRUGGLES.map((s) => {
                  const on = struggles.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggle(struggles, setStruggles, s)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        on ? "bg-ink text-cream" : "bg-white shadow-soft"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="font-display text-4xl leading-tight">What's<br />your why?</h1>
              <p className="text-muted text-sm mt-2">
                The deepest reason you want to change. You'll come back to this on hard days.
              </p>
              <input
                value={why}
                onChange={(e) => setWhy(e.target.value.replace(/\n/g, " "))}
                placeholder="Because I want to..."
                maxLength={80}
                className="w-full mt-6 bg-white rounded-2xl px-4 py-3 shadow-soft outline-none text-base"
              />
              <div className="text-[11px] text-muted text-right mt-1">{why.length}/80</div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <h1 className="font-display text-4xl leading-tight">Pick your<br />focus pillars</h1>
              <p className="text-muted text-sm mt-2">Where will you put your energy first?</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {PILLARS.map((p) => {
                  const on = picked.includes(p.slug);
                  return (
                    <button
                      key={p.slug}
                      onClick={() => toggle(picked, setPicked, p.slug)}
                      className={`rounded-3xl p-4 text-left transition ${
                        on ? "bg-ink text-cream" : "bg-white shadow-soft"
                      }`}
                    >
                      <div className="text-xl">{p.emoji}</div>
                      <div className="text-sm font-medium mt-2">{p.name}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5b" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="text-xs text-muted uppercase tracking-[0.2em]">You're in</div>
              <h1 className="font-display text-4xl leading-tight mt-3">
                The blueprint<br />is yours, {name || "brother"}.
              </h1>
              <div className="mt-6 card">
                <div className="text-xs text-muted uppercase tracking-wider">Your why</div>
                <p className="text-sm mt-1 leading-relaxed">"{why}"</p>
              </div>
              <p className="text-muted text-sm mt-6 leading-relaxed">
                Take this journey day by day. Every day you show up is a win.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={next}
        disabled={!canContinue()}
        className="btn-primary w-full mt-6 disabled:opacity-40"
      >
        {step === TOTAL_STEPS - 1 ? "Enter the Blueprint" : "Continue"} <ArrowRight size={16} />
      </button>
    </div>
  );
}

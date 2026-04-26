"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PILLARS } from "@/lib/pillars";
import { useStore } from "@/lib/store";

const QUESTIONS: Record<string, string> = {
  career:          "How clear are you on your career direction right now?",
  "physical-health": "How would you rate your physical fitness and daily habits?",
  relationships:   "How fulfilled are you with your friendships and social life?",
  addiction:       "How in control are you of addictive urges and habits?",
  finances:        "How in control are you of your money right now?",
  "mental-health": "How stable and positive is your mental and emotional state?",
  discipline:      "How consistent and disciplined are you with daily habits?",
  motivation:      "How motivated and driven do you feel day to day?",
  appearance:      "How intentional are you about how you present yourself?",
  investing:       "How actively are you building wealth for your future?",
};

const OPTIONS = [
  { label: "Struggling",   sub: "It's bad",              score: 2  },
  { label: "Needs work",   sub: "Below where I want",    score: 4  },
  { label: "Average",      sub: "Getting by",            score: 6  },
  { label: "Pretty good",  sub: "Above average",         score: 8  },
  { label: "Thriving",     sub: "Locked in",             score: 10 },
];

export default function AssessmentPage() {
  const router = useRouter();
  const setAssessment = useStore((s) => s.setAssessment);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const pillar = PILLARS[step];
  const total = PILLARS.length;
  const progress = (step / total) * 100;

  const choose = (score: number) => setSelected(score);

  const next = () => {
    if (selected === null) return;
    const updated = { ...scores, [pillar.slug]: selected };
    setScores(updated);
    if (step < total - 1) {
      setDirection(1);
      setSelected(null);
      setStep(step + 1);
    } else {
      setAssessment(updated);
      router.push("/assessment/results");
    }
  };

  const back = () => {
    if (step === 0) { router.push("/"); return; }
    setDirection(-1);
    setSelected(scores[PILLARS[step - 1].slug] ?? null);
    setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-10 pb-10">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={back}
          className="w-9 h-9 rounded-full bg-white shadow-soft flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 h-2 rounded-full bg-sand overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-ink"
            animate={{ width: `${progress + (1 / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="text-[11px] text-muted tabular-nums shrink-0">
          {step + 1}/{total}
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex-1 flex flex-col"
        >
          {/* Pillar hero */}
          <div
            className="relative rounded-4xl p-6 mb-6 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${pillar.color}55 0%, ${pillar.color}22 60%, #F4EFE600 100%)`,
            }}
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl"
              style={{ backgroundColor: pillar.color + "55" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="w-14 h-14 rounded-3xl bg-white shadow-lift flex items-center justify-center text-2xl"
            >
              {pillar.emoji}
            </motion.div>
            <div className="text-[10px] text-muted uppercase tracking-[0.2em] mt-4">
              Pillar {step + 1} of {total}
            </div>
            <h2 className="font-display text-2xl leading-tight mt-1">{pillar.name}</h2>
            <p className="text-ink/80 text-sm mt-3 leading-relaxed font-medium">
              {QUESTIONS[pillar.slug]}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2 flex-1">
            {OPTIONS.map((o, i) => {
              const on = selected === o.score;
              return (
                <motion.button
                  key={o.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => choose(o.score)}
                  className={`w-full flex items-center justify-between p-4 rounded-3xl border-2 transition ${
                    on
                      ? "bg-ink text-cream border-ink"
                      : "bg-white/80 border-transparent shadow-soft"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{o.label}</div>
                    <div className={`text-[11px] mt-0.5 ${on ? "text-cream/60" : "text-muted"}`}>
                      {o.sub}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* score dots */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            idx < o.score / 2
                              ? on ? "bg-cream" : "bg-ink"
                              : on ? "bg-cream/25" : "bg-sand"
                          }`}
                        />
                      ))}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        on ? "bg-cream border-cream" : "border-sand"
                      }`}
                    >
                      {on && <div className="w-2 h-2 rounded-full bg-ink" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={next}
        disabled={selected === null}
        whileTap={{ scale: 0.97 }}
        className="btn-primary w-full mt-6 disabled:opacity-40"
      >
        {step < total - 1 ? "Next Pillar" : "See My Blueprint"} <ArrowRight size={16} />
      </motion.button>
    </div>
  );
}

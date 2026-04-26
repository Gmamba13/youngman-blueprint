"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { PILLAR_TOOL_BY_SLUG, computeCheckInScore, type ToolQuestion } from "@/lib/pillar-tools";
import { PILLAR_BY_SLUG } from "@/lib/pillars";
import { useStore } from "@/lib/store";

type Phase = "intro" | "questions" | "result";

const SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;
const EASE = { duration: 0.28, ease: "easeOut" } as const;

// ─── Tap-10 input ──────────────────────────────────────────────────────────────
function Tap10Input({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-6 space-y-2">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <motion.button
            key={n}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(n)}
            className={`aspect-square rounded-2xl text-sm font-bold border transition-colors ${
              value === n
                ? "bg-void text-white border-void"
                : "bg-stone text-primary border-border"
            }`}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[6, 7, 8, 9, 10].map((n) => (
          <motion.button
            key={n}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(n)}
            className={`aspect-square rounded-2xl text-sm font-bold border transition-colors ${
              value === n
                ? "bg-void text-white border-void"
                : "bg-stone text-primary border-border"
            }`}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between mt-2 px-1">
        <span className="text-xs text-muted">Low</span>
        {value !== undefined && (
          <span className="font-display text-3xl text-primary">{value}</span>
        )}
        <span className="text-xs text-muted">High</span>
      </div>
    </div>
  );
}

// ─── Yes/No input ──────────────────────────────────────────────────────────────
function YesNoInput({
  question,
  value,
  onChange,
}: {
  question: ToolQuestion & { kind: "yesno" };
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const isYes = value !== undefined && value === question.yesPoints;
  const isNo = value !== undefined && value === question.noPoints && value !== question.yesPoints;

  return (
    <div className="mt-6 space-y-3">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onChange(question.yesPoints)}
        className={`w-full py-5 rounded-3xl text-base font-semibold transition-colors border ${
          isYes
            ? "bg-void text-white border-void"
            : "bg-stone border-border text-primary"
        }`}
      >
        Yes
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onChange(question.noPoints)}
        className={`w-full py-5 rounded-3xl text-base font-semibold transition-colors ${
          isNo
            ? "bg-stone border-2 border-void text-primary"
            : "bg-stone border border-border text-primary"
        }`}
      >
        No
      </motion.button>
    </div>
  );
}

// ─── Number input ──────────────────────────────────────────────────────────────
function NumberInput({
  question,
  value,
  onChange,
}: {
  question: ToolQuestion & { kind: "number" };
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const num = value ?? 0;

  const set = (raw: string) => {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 0) onChange(parsed);
    else if (raw === "" || raw === ".") onChange(0);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onChange(Math.max(0, parseFloat((num - 1).toFixed(1))))}
          className="w-14 h-14 rounded-2xl bg-stone border border-border flex items-center justify-center text-2xl font-bold text-primary active:bg-sand"
        >
          −
        </motion.button>

        <div className="flex-1 flex flex-col items-center">
          <input
            type="number"
            min="0"
            step="0.5"
            value={num === 0 ? "" : String(num)}
            onChange={(e) => set(e.target.value)}
            placeholder="0"
            className="w-full text-center font-display text-5xl text-primary bg-transparent outline-none border-none"
            style={{ MozAppearance: "textfield" } as React.CSSProperties}
          />
          <span className="text-sm text-secondary mt-1">{question.unit}</span>
        </div>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onChange(parseFloat((num + 1).toFixed(1)))}
          className="w-14 h-14 rounded-2xl bg-stone border border-border flex items-center justify-center text-2xl font-bold text-primary active:bg-sand"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function CheckinClient() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const tool = PILLAR_TOOL_BY_SLUG[slug as string];
  const pillar = PILLAR_BY_SLUG[slug as string];

  const pillarCheckIns = useStore((s) => s.pillarCheckIns);
  const addPillarCheckIn = useStore((s) => s.addPillarCheckIn);

  const [phase, setPhase] = useState<Phase>("intro");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!tool || !pillar) router.replace(`/pillars/${slug}`);
  }, [tool, pillar, router, slug]);

  if (!tool || !pillar) return null;

  const existingCheckIns = pillarCheckIns[slug as string] ?? [];
  const lastCheckIn = existingCheckIns[0];
  const total = tool.questions.length;
  const currentQ = tool.questions[qIndex];
  const currentAnswer = answers[currentQ?.id];

  const { score, rawScore, maxScore } = computeCheckInScore(tool, answers);

  const goBack = () => {
    if (phase === "intro") {
      router.back();
    } else if (phase === "questions") {
      if (qIndex === 0) {
        setPhase("intro");
      } else {
        setDirection(-1);
        setQIndex((i) => i - 1);
      }
    } else if (phase === "result") {
      setDirection(-1);
      setPhase("questions");
      setQIndex(total - 1);
    }
  };

  const goNext = () => {
    if (qIndex < total - 1) {
      setDirection(1);
      setQIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  const handleAnswer = (qId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSave = () => {
    addPillarCheckIn(slug as string, score, rawScore, maxScore, answers);
    setSaved(true);
  };

  // ── INTRO ────────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-surface pb-32">
        <div className="px-5 pt-10">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-secondary text-sm bg-stone px-3 py-1.5 rounded-full border border-border"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={EASE}
            className="mt-8"
          >
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-5"
              style={{ backgroundColor: pillar.color + "18" }}
            >
              {pillar.emoji}
            </div>

            <h1 className="font-display text-3xl text-primary leading-tight">{tool.toolName}</h1>
            <p className="text-secondary text-sm mt-2">{tool.toolSubtitle}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className="label text-muted">{total} questions</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="label text-muted">Takes ~1 min</span>
            </div>

            {lastCheckIn && (
              <div className="mt-5 px-4 py-3 rounded-2xl border border-border bg-elevated flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: pillar.color + "18" }}
                >
                  <span className="font-display text-sm" style={{ color: pillar.color }}>
                    {lastCheckIn.score.toFixed(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-medium text-primary">
                    Last score: {lastCheckIn.score.toFixed(1)}/10
                  </div>
                  <div className="text-xs text-muted">{lastCheckIn.date}</div>
                </div>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setPhase("questions"); setQIndex(0); setAnswers({}); setSaved(false); }}
              className="btn-primary w-full py-4 mt-8 text-base"
            >
              Start Check-in
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (phase === "result") {
    const label = tool.scoreLabel(score);
    return (
      <div className="min-h-screen bg-surface pb-32">
        <div className="px-5 pt-10">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={goBack}
            className="flex items-center gap-1.5 text-secondary text-sm bg-stone px-3 py-1.5 rounded-full border border-border"
          >
            <ArrowLeft size={14} /> Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={EASE}
            className="flex flex-col items-center mt-10"
          >
            <div
              className="w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center"
              style={{
                borderColor: pillar.color,
                backgroundColor: pillar.color + "15",
              }}
            >
              <span className="font-display text-4xl text-primary">{score.toFixed(1)}</span>
              <span className="text-xs text-secondary">/10</span>
            </div>

            <h2 className="font-display text-2xl text-primary mt-5">{label}</h2>
            <p className="text-sm text-muted mt-1">{rawScore} / {maxScore} pts</p>
          </motion.div>

          {/* Answers recap */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.1 }}
            className="card mt-8"
          >
            <div className="label mb-3">Your answers</div>
            <div className="space-y-3">
              {tool.questions.map((q, i) => {
                const ans = answers[q.id] ?? 0;
                let displayAns: string;
                if (q.kind === "tap10") {
                  displayAns = `${ans}/10`;
                } else if (q.kind === "yesno") {
                  displayAns = ans === q.yesPoints ? "Yes" : "No";
                } else {
                  displayAns = `${ans} ${q.unit}`;
                }
                return (
                  <div key={q.id} className="flex items-start gap-3">
                    <span className="label text-muted w-5 shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-secondary flex-1 leading-snug">{q.text}</span>
                    <span className="text-sm font-semibold text-primary shrink-0">{displayAns}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Save / done */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE, delay: 0.18 }}
            className="mt-6"
          >
            {!saved ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="btn-primary w-full py-4 text-base"
              >
                Save Result
              </motion.button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 py-3">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span className="text-sm font-semibold text-primary">Saved!</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/pillars/${slug}`)}
                  className="btn-primary w-full py-4 text-base"
                >
                  Back to {pillar.name}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ────────────────────────────────────────────────────────────────
  const progress = qIndex / total;
  const isAnswered = currentAnswer !== undefined;
  const isLast = qIndex === total - 1;

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Top bar */}
      <div className="px-5 pt-10">
        <div className="flex items-center gap-3 mb-5">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-stone border border-border flex items-center justify-center text-secondary shrink-0"
          >
            <ArrowLeft size={16} />
          </motion.button>

          <div className="flex-1 h-2 bg-stone rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "#0D0D0D" }}
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={SPRING}
            />
          </div>

          <span className="label text-muted shrink-0">
            {qIndex + 1}/{total}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-5 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`q-${qIndex}`}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={SPRING}
          >
            <h2 className="font-display text-2xl text-primary leading-tight">
              {currentQ.text}
            </h2>
            {currentQ.hint && (
              <p className="text-secondary text-sm mt-2">{currentQ.hint}</p>
            )}

            {currentQ.kind === "tap10" && (
              <Tap10Input
                value={currentAnswer}
                onChange={(v) => handleAnswer(currentQ.id, v)}
              />
            )}

            {currentQ.kind === "yesno" && (
              <YesNoInput
                question={currentQ}
                value={currentAnswer}
                onChange={(v) => handleAnswer(currentQ.id, v)}
              />
            )}

            {currentQ.kind === "number" && (
              <NumberInput
                question={currentQ}
                value={currentAnswer}
                onChange={(v) => handleAnswer(currentQ.id, v)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next button */}
      <div className="px-5 mt-8">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={goNext}
          disabled={!isAnswered}
          className="btn-primary w-full py-4 text-base disabled:opacity-30"
        >
          {isLast ? "See Results" : "Next"}
        </motion.button>
      </div>
    </div>
  );
}

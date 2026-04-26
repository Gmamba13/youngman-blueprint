"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { PILLARS, PILLAR_BY_SLUG } from "@/lib/pillars";
import RadarChart from "@/components/RadarChart";
import { ArrowRight, TrendingUp, AlertTriangle, Star } from "lucide-react";

function totalScore(scores: Record<string, number>) {
  const vals = Object.values(scores);
  if (!vals.length) return 0;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function blueprintTitle(avg: number) {
  if (avg <= 3) return "Starting Point";
  if (avg <= 5) return "Work in Progress";
  if (avg <= 7) return "Building Up";
  if (avg <= 8) return "Solid Foundation";
  return "Blueprint Locked In";
}

function blueprintMessage(avg: number) {
  if (avg <= 3)
    return "This is your honest starting point. The gap between where you are and where you want to be is fuel — not a verdict.";
  if (avg <= 5)
    return "You've got awareness. Now you need consistency. The pillars are clear — it's time to work.";
  if (avg <= 7)
    return "You're above average in some areas. Now it's about identifying the weak links and fixing them before they hold everything else back.";
  if (avg <= 8)
    return "Strong foundation. A few targeted upgrades and you're operating at a level most men never reach.";
  return "Rare. You've built something real. The work now is staying here and helping others rise.";
}

export default function ResultsPage() {
  const router = useRouter();
  const { pillarScores, assessmentDone, name } = useStore();

  useEffect(() => {
    if (!assessmentDone) router.replace("/assessment");
  }, [assessmentDone, router]);

  if (!assessmentDone) return null;

  const sorted = PILLARS.map((p) => ({
    ...p,
    score: pillarScores[p.slug] ?? 0,
  })).sort((a, b) => b.score - a.score);

  const strengths = sorted.slice(0, 3);
  const weaknesses = sorted.slice(-3).reverse();
  const avg = totalScore(pillarScores);
  const biggestOpp = weaknesses[0];

  return (
    <div className="pb-10">
      {/* Hero */}
      <div className="relative bg-ink px-5 pt-14 pb-10 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-clay/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-sky/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="text-[10px] text-cream/60 uppercase tracking-[0.25em]">
            Blueprint Assessment
          </div>
          <h1 className="font-display text-4xl text-cream leading-tight mt-2">
            {name ? `${name}'s` : "Your"}<br />Blueprint
          </h1>
        </motion.div>

        {/* Big score */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative flex items-end gap-3 mt-6"
        >
          <div className="font-display text-8xl text-cream leading-none tabular-nums">
            {avg}
          </div>
          <div className="mb-3">
            <div className="text-cream/40 text-lg">/10</div>
            <div className="text-cream/80 text-sm font-medium">{blueprintTitle(avg)}</div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative text-cream/70 text-sm mt-4 leading-relaxed max-w-xs"
        >
          {blueprintMessage(avg)}
        </motion.p>
      </div>

      {/* Radar chart */}
      <div className="px-5 mt-6">
        <div className="card">
          <div className="text-[10px] text-muted uppercase tracking-[0.2em] mb-1">Your life map</div>
          <h2 className="font-display text-xl mb-4">Blueprint Radar</h2>
          <RadarChart scores={pillarScores} />
        </div>
      </div>

      {/* All scores */}
      <div className="px-5 mt-5">
        <div className="text-[10px] text-muted uppercase tracking-[0.2em] mb-3">All pillars</div>
        <div className="space-y-2">
          {sorted.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-3xl shadow-soft px-4 py-3 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-2xl flex items-center justify-center text-lg shrink-0"
                style={{ backgroundColor: p.color + "44" }}
              >
                {p.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-sm font-display">{p.score}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-sand overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        p.score >= 7 ? "#6B8E6B" : p.score >= 5 ? "#E8C37A" : "#C97B5A",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.score / 10) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Strengths */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={13} className="text-sun" />
          <div className="text-[10px] text-muted uppercase tracking-[0.2em]">Your strengths</div>
        </div>
        <div className="flex gap-2">
          {strengths.map((p) => (
            <div
              key={p.slug}
              className="flex-1 rounded-3xl p-3 text-center shadow-soft bg-white"
              style={{ borderTop: `3px solid ${p.color}` }}
            >
              <div className="text-xl">{p.emoji}</div>
              <div className="text-[10px] font-medium mt-1">{p.name}</div>
              <div className="font-display text-lg">{p.score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Biggest opportunity */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={13} className="text-clay" />
          <div className="text-[10px] text-muted uppercase tracking-[0.2em]">Biggest opportunity</div>
        </div>
        <Link href={`/pillars/${biggestOpp.slug}`}>
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="rounded-4xl p-5 shadow-lift relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${biggestOpp.color}44, ${biggestOpp.color}11)`,
            }}
          >
            <motion.div
              className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl"
              style={{ backgroundColor: biggestOpp.color + "66" }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="flex items-center gap-3 relative">
              <div className="w-14 h-14 rounded-3xl bg-white shadow-soft flex items-center justify-center text-2xl">
                {biggestOpp.emoji}
              </div>
              <div className="flex-1">
                <div className="text-[10px] text-muted uppercase tracking-wider">Focus here first</div>
                <div className="font-display text-2xl leading-tight">{biggestOpp.name}</div>
                <div className="text-xs text-muted">Score: {biggestOpp.score}/10</div>
              </div>
              <TrendingUp size={20} className="text-ink/40" />
            </div>
            <p className="text-sm text-ink/70 mt-3 leading-relaxed relative">
              {biggestOpp.tagline} — this is where the biggest gains are hiding.
            </p>
          </motion.div>
        </Link>
      </div>

      {/* CTA */}
      <div className="px-5 mt-8">
        <Link href="/signup?from=assessment" className="btn-primary w-full">
          Save My Blueprint <ArrowRight size={16} />
        </Link>
        <button
          onClick={() => router.push("/assessment")}
          className="btn-ghost w-full mt-2 text-sm"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
}

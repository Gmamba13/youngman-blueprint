"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Check } from "lucide-react";
import { LEVELS, levelForXp } from "@/lib/levels";
import { useStore } from "@/lib/store";

export default function LevelsPage() {
  const router = useRouter();
  const xp = useStore((s) => s.xp);
  const { current } = levelForXp(xp);

  return (
    <div>
      <div className="px-5 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="text-muted text-sm flex items-center gap-1 mb-4"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <div className="text-xs text-muted uppercase tracking-wider">The path</div>
        <h1 className="font-display text-3xl leading-tight mt-1">All Levels</h1>
        <p className="text-muted text-sm mt-1">
          Every level demands more than the last. {xp} XP earned.
        </p>
      </div>

      <div className="px-5 space-y-3">
        {LEVELS.map((l, i) => {
          const unlocked = xp >= l.xpRequired;
          const isCurrent = l.level === current.level;
          const prev = LEVELS[i - 1];
          const step = prev ? l.xpRequired - prev.xpRequired : 0;

          return (
            <div
              key={l.level}
              className={`rounded-4xl p-5 shadow-soft flex items-center gap-4 ${
                isCurrent ? "bg-ink text-cream" : unlocked ? "bg-white" : "bg-white/60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display text-lg ${
                  isCurrent
                    ? "bg-cream text-ink"
                    : unlocked
                    ? "bg-sand text-ink"
                    : "bg-sand/60 text-muted"
                }`}
              >
                {unlocked ? (isCurrent ? l.level : <Check size={18} strokeWidth={3} />) : <Lock size={16} />}
              </div>
              <div className="flex-1">
                <div className={`text-[11px] uppercase tracking-wider ${isCurrent ? "text-cream/70" : "text-muted"}`}>
                  Level {l.level}
                </div>
                <div className="font-display text-lg leading-tight">{l.name}</div>
                <div className={`text-xs mt-0.5 ${isCurrent ? "text-cream/70" : "text-muted"}`}>
                  {l.xpRequired.toLocaleString()} XP{step > 0 ? ` · +${step.toLocaleString()} from last` : " · start"}
                </div>
              </div>
              {isCurrent && <span className="text-[10px] uppercase tracking-wider bg-cream text-ink px-2 py-1 rounded-full">You</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

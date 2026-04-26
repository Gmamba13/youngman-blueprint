"use client";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Download, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { levelForXp } from "@/lib/levels";
import { topFocusPillar } from "@/lib/personalization";

export default function ShareCard() {
  const { xp, streak, name, struggles, focusPillars } = useStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { current: level } = levelForXp(xp);
  const pillar = topFocusPillar(struggles, focusPillars);

  async function captureAndShare() {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "ymbp-progress.png", { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "My YoungmanBlueprint Progress",
          });
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "ymbp-progress.png";
          a.click();
          URL.revokeObjectURL(url);
        }
        setLoading(false);
      }, "image/png");
    } catch {
      setLoading(false);
    }
  }

  const totalHabits = Object.values(useStore.getState().habitLogs).reduce(
    (a, b) => a + b.length,
    0
  );

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full card active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "#C9963B" }}
        >
          <Share2 size={18} color="#fff" />
        </div>
        <div className="text-left">
          <div className="text-sm font-semibold text-primary">Share Your Progress</div>
          <div className="text-xs text-muted">Generate a shareable card</div>
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-sm"
            >
              {/* Close */}
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                >
                  <X size={16} color="#fff" />
                </button>
              </div>

              {/* The card that gets captured */}
              <div
                ref={cardRef}
                style={{
                  background: "linear-gradient(145deg, #0D0D0D 0%, #1A1512 60%, #0D0D0D 100%)",
                  borderRadius: 28,
                  padding: 32,
                  position: "relative",
                  overflow: "hidden",
                  fontFamily: "-apple-system, system-ui, sans-serif",
                }}
              >
                {/* Gold glow blob */}
                <div style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(201,150,59,0.18) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(201,150,59,0.10) 0%, transparent 70%)",
                  pointerEvents: "none",
                }} />

                {/* Top row: branding */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9963B", fontWeight: 600 }}>
                    YoungmanBlueprint
                  </div>
                  <div style={{
                    background: "rgba(201,150,59,0.15)",
                    border: "1px solid rgba(201,150,59,0.3)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 11,
                    color: "#C9963B",
                    fontWeight: 600,
                  }}>
                    Lv {level.level}
                  </div>
                </div>

                {/* Name + level title */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, fontFamily: "Georgia, serif" }}>
                    {name || "Blueprint Man"}
                  </div>
                  <div style={{ fontSize: 14, color: "#C9963B", marginTop: 4, fontWeight: 500 }}>
                    {level.name}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />

                {/* Stats row */}
                <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                  {/* Streak */}
                  <div style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "14px 12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{ fontSize: 22 }}>🔥</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginTop: 4 }}>{streak}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>day streak</div>
                  </div>

                  {/* XP */}
                  <div style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "14px 12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{ fontSize: 22 }}>⚡</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginTop: 4 }}>{xp.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>total xp</div>
                  </div>

                  {/* Habit check-ins */}
                  <div style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 16,
                    padding: "14px 12px",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>
                    <div style={{ fontSize: 22 }}>✅</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1, marginTop: 4 }}>{totalHabits}</div>
                    <div style={{ fontSize: 10, color: "#888", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>check-ins</div>
                  </div>
                </div>

                {/* Top pillar */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(201,150,59,0.08)",
                  border: "1px solid rgba(201,150,59,0.2)",
                  borderRadius: 16,
                  padding: "12px 16px",
                  marginBottom: 24,
                }}>
                  <div style={{ fontSize: 28 }}>{pillar.emoji}</div>
                  <div>
                    <div style={{ fontSize: 10, color: "#C9963B", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>Top Pillar</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#FFFFFF", marginTop: 1 }}>{pillar.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{pillar.tagline}</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ fontSize: 11, color: "#555", textAlign: "center", letterSpacing: "0.05em" }}>
                  youngmanblueprint.com
                </div>
              </div>

              {/* Share / Download buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={captureAndShare}
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Share2 size={16} />
                      Share
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

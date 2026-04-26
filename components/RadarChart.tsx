"use client";
import { motion } from "framer-motion";
import { PILLARS } from "@/lib/pillars";

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 108;
const LEVELS = 5;

function polar(angle: number, r: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function toPoints(pts: { x: number; y: number }[]) {
  return pts.map((p) => `${p.x},${p.y}`).join(" ");
}

export default function RadarChart({
  scores,
}: {
  scores: Record<string, number>;
}) {
  const n = PILLARS.length;
  const angleStep = 360 / n;

  // grid polygons
  const gridPolygons = Array.from({ length: LEVELS }, (_, i) => {
    const r = (R * (i + 1)) / LEVELS;
    const pts = PILLARS.map((_, idx) => polar(idx * angleStep, r));
    return toPoints(pts);
  });

  // score polygon — animated drawing via clip
  const scorePoints = PILLARS.map((p, idx) => {
    const score = scores[p.slug] ?? 0;
    const r = (score / 10) * R;
    return polar(idx * angleStep, r);
  });
  const scorePath = `M ${scorePoints.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

  return (
    <div className="flex items-center justify-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <defs>
          <radialGradient id="scoreGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#1C1C1C" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1C1C1C" stopOpacity="0.08" />
          </radialGradient>
        </defs>

        {/* grid rings */}
        {gridPolygons.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="1.2"
          />
        ))}

        {/* axis lines */}
        {PILLARS.map((_, idx) => {
          const outer = polar(idx * angleStep, R);
          return (
            <line
              key={idx}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="#E0E0E0"
              strokeWidth="1"
            />
          );
        })}

        {/* score fill — animated */}
        <motion.path
          d={scorePath}
          fill="url(#scoreGradient)"
          stroke="#1C1C1C"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* score dots */}
        {scorePoints.map((pt, idx) => {
          const score = scores[PILLARS[idx].slug] ?? 0;
          return (
            <motion.circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill={score >= 7 ? "#6B8E6B" : score >= 5 ? "#E8C37A" : "#C97B5A"}
              stroke="white"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + idx * 0.05, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
            />
          );
        })}

        {/* labels */}
        {PILLARS.map((p, idx) => {
          const labelR = R + 22;
          const pos = polar(idx * angleStep, labelR);
          const score = scores[p.slug] ?? 0;
          return (
            <g key={p.slug}>
              <text
                x={pos.x}
                y={pos.y - 4}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="13"
                className="select-none"
                fill="#1C1C1C"
              >
                {p.emoji}
              </text>
              <text
                x={pos.x}
                y={pos.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="#7A7268"
                fontFamily="system-ui"
                className="select-none uppercase"
                letterSpacing="0.05em"
              >
                {score}/10
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

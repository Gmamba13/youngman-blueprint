"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Pillar } from "@/lib/pillars";

export default function PillarCard({ pillar, index = 0 }: { pillar: Pillar; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileTap={{ scale: 0.96 }}
    >
      <Link href={`/pillars/${pillar.slug}`} className="block">
        <div
          className="relative rounded-4xl p-5 bg-elevated overflow-hidden"
          style={{
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.05)",
            borderLeft: `3px solid ${pillar.color}`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{ backgroundColor: pillar.color + "18" }}
            >
              {pillar.emoji}
            </motion.div>
            <div className="w-6 h-6 rounded-full bg-stone flex items-center justify-center">
              <ArrowUpRight size={12} className="text-secondary" />
            </div>
          </div>

          <div>
            <div className="font-display text-base text-primary leading-tight">{pillar.name}</div>
            <div className="text-[11px] text-secondary mt-1 leading-tight">{pillar.tagline}</div>
          </div>

          {/* vivid color dot accent */}
          <div
            className="absolute bottom-4 right-4 w-2 h-2 rounded-full"
            style={{ backgroundColor: pillar.color }}
          />
        </div>
      </Link>
    </motion.div>
  );
}

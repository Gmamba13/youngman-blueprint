"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import PillarCard from "@/components/PillarCard";
import { PILLARS } from "@/lib/pillars";

export default function PillarsPage() {
  return (
    <div>
      <Header subtitle="The 10 pillars" title="Rebuild every area" />
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.05 } },
        }}
        className="px-5 grid grid-cols-2 gap-3"
      >
        {PILLARS.map((p, i) => (
          <PillarCard key={p.slug} pillar={p} index={i} />
        ))}
      </motion.div>
    </div>
  );
}

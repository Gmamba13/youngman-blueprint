import { PILLARS } from "@/lib/pillars";
import PillarDetailClient from "./PillarDetailClient";

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export default function PillarPage() {
  return <PillarDetailClient />;
}

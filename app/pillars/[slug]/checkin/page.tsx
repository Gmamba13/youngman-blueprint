import { PILLARS } from "@/lib/pillars";
import CheckinClient from "./CheckinClient";

export function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export default function CheckinPage() {
  return <CheckinClient />;
}

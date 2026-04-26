"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkbooksPage() {
  const r = useRouter();
  useEffect(() => r.replace("/journal"), [r]);
  return null;
}

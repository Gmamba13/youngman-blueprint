"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { AlertTriangle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const CONSEQUENCES = [
  "All your habits and logs",
  "Every journal entry",
  "All goals and milestones",
  "Pillar check-in history",
  "Body metrics and XP",
  "Your letter to future you",
];

export default function DeleteAccountPage() {
  const router = useRouter();
  const reset = useStore((s) => s.reset);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmed = input === "DELETE";

  const handleDelete = async () => {
    if (!confirmed) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      // Calls a Supabase database function that deletes the current user
      const { error } = await supabase.rpc("delete_own_account");
      if (error) {
        setError(error.message || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      reset();
      await supabase.auth.signOut();
      router.push("/signup");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col px-5 py-12">
      <div className="w-full max-w-sm mx-auto">

        {/* Back */}
        <Link href="/profile" className="flex items-center gap-2 text-sm text-secondary mb-8">
          <ArrowLeft size={16} />
          Back to Profile
        </Link>

        {/* Warning icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <AlertTriangle size={28} className="text-red-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="font-display text-2xl text-primary">Delete Account</h1>
          <p className="text-sm text-secondary mt-2">
            This is permanent and cannot be undone.
          </p>
        </motion.div>

        {/* What gets deleted */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card mb-5"
        >
          <div className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
            Everything will be deleted
          </div>
          <div className="space-y-2">
            {CONSEQUENCES.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <span className="text-sm text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Confirmation input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-4"
        >
          <label className="block text-xs font-semibold text-primary mb-2">
            Type <span className="font-bold text-red-500">DELETE</span> to confirm
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type DELETE"
            className="w-full bg-stone rounded-2xl px-4 py-3 text-sm outline-none text-primary placeholder:text-secondary"
          />
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-500 text-center mb-3"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Delete button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleDelete}
          disabled={!confirmed || loading}
          className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-40"
          style={{
            background: confirmed ? "#DC2626" : "#F2F2F2",
            color: confirmed ? "#FFFFFF" : "#AAAAAA",
          }}
        >
          <Trash2 size={15} />
          {loading ? "Deleting..." : "Permanently Delete My Account"}
        </motion.button>

        <p className="text-xs text-muted text-center mt-4">
          Changed your mind?{" "}
          <Link href="/profile" className="text-primary underline">
            Go back
          </Link>
        </p>

      </div>
    </div>
  );
}

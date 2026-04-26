"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5 py-12">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="card space-y-5 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto"
            >
              <CheckCircle size={32} className="text-green-600" />
            </motion.div>
            <div>
              <h2 className="font-display text-xl text-primary">Email sent!</h2>
              <p className="text-sm text-secondary mt-2">
                Check your inbox for a password reset link. It may take a minute to
                arrive.
              </p>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-full bg-void text-white text-sm font-semibold active:scale-[0.98] transition flex items-center justify-center"
            >
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        className="w-full max-w-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back Button */}
        <motion.div variants={itemVariants} className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="w-14 h-14 rounded-3xl bg-void flex items-center justify-center mx-auto mb-4">
            <span className="font-display text-white text-xl">YB</span>
          </div>
          <h1 className="font-display text-2xl text-primary">Reset Password</h1>
          <p className="text-sm text-secondary mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div className="card space-y-4" variants={itemVariants}>
          <form onSubmit={handleReset} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-stone rounded-2xl px-4 py-3 text-sm outline-none text-primary placeholder:text-secondary"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-xs text-red-500 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-void text-white text-sm font-semibold active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

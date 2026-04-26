"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useStore } from "@/lib/store";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/welcome",
  "/onboarding",
  "/privacy",
];

/**
 * Client-side auth guard — replaces Next.js middleware for static exports.
 * - If loading, do nothing (avoid flash).
 * - If no user and on a protected route → redirect to /login.
 * - If user and on /login or /signup → redirect to /.
 */
export default function AppGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const onboarded = useStore((s) => s.onboarded);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isPublic =
      PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
      pathname.startsWith("/assessment");

    if (!user && !isPublic) {
      // New users with no data → send to welcome flow
      // Returning users with no session → send to login
      router.replace(onboarded ? "/login" : "/welcome");
      return;
    }

    if (user && !onboarded && !isPublic) {
      router.replace("/welcome");
      return;
    }

    if (user && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [user, loading, onboarded, pathname, router]);

  const isPublicRoute = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  // Public routes render immediately — no auth needed
  if (isPublicRoute) return <>{children}</>;

  // Show nothing while auth state resolves to prevent flash of wrong content
  if (loading) return null;

  return <>{children}</>;
}

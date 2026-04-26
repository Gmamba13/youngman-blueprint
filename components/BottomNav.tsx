"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, CheckSquare, BookOpen, Target, User, LayoutGrid } from "lucide-react";

const items = [
  { href: "/",        label: "Home",    Icon: Home        },
  { href: "/habits",  label: "Habits",  Icon: CheckSquare },
  { href: "/pillars", label: "Pillars", Icon: LayoutGrid  },
  { href: "/journal", label: "Journal", Icon: BookOpen    },
  { href: "/goals",   label: "Goals",   Icon: Target      },
  { href: "/profile", label: "Profile", Icon: User        },
];

export default function BottomNav() {
  const path = usePathname();
  if (
    path === "/onboarding" ||
    path === "/welcome" ||
    path.startsWith("/assessment") ||
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path === "/delete-account"
  )
    return null;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-50">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex items-center justify-between px-1 py-2 rounded-full border border-border bg-elevated"
        style={{
          backdropFilter: "blur(20px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {items.map(({ href, label, Icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex-1 flex flex-col items-center gap-0.5 py-1.5 px-0.5 rounded-full"
              aria-label={label}
            >
              {active && (
                <motion.div
                  layoutId="navPill"
                  className="absolute inset-0 rounded-full bg-void"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <div className={`relative z-10 transition-colors ${active ? "text-white" : "text-secondary"}`}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              </div>
              {active && (
                <span className="relative z-10 text-[9px] font-medium text-white leading-none">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}

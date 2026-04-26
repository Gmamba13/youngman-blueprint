import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AmbientBackground from "@/components/AmbientBackground";
import AchievementToast from "@/components/AchievementToast";
import { AuthProvider } from "@/components/AuthProvider";
import { SyncProvider } from "@/components/SyncProvider";
import AppGuard from "@/components/AppGuard";

export const metadata: Metadata = {
  title: "YoungmanBlueprint",
  description: "Your blueprint for becoming the man you're meant to be.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F7F7F7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AmbientBackground />
        <AuthProvider>
          <SyncProvider>
            <AppGuard>
              <div className="mx-auto max-w-md min-h-screen pb-28 relative">
                <AchievementToast />
                {children}
                <BottomNav />
              </div>
            </AppGuard>
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

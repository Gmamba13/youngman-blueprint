"use client";
import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { loadFromCloud, saveToCloud } from "@/lib/sync";

// Prevents saving back to cloud while we're loading from it
let loading = false;

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Load cloud data for the current session on mount
    async function hydrate(userId: string) {
      loading = true;
      const cloudData = await loadFromCloud(userId);
      if (cloudData && cloudData.onboarded) {
        useStore.getState().loadCloudData(cloudData);
      }
      loading = false;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) hydrate(session.user.id);
    });

    // Re-hydrate when the user signs in (e.g. after email verification redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        hydrate(session.user.id);
      }
    });

    // Debounced save — fires 2s after the last store change
    const unsub = useStore.subscribe((state) => {
      if (loading) return;
      if (!state.onboarded) return; // Don't save until onboarding is complete

      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await saveToCloud(session.user.id, state);
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      unsub();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  return <>{children}</>;
}

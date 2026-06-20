"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { AuthGate } from "./AuthGate";
import { ProfilePicker } from "./ProfilePicker";

export function AppGate({ children }: { children: React.ReactNode }) {
  const { status } = useStore();
  const pathname = usePathname();
  const isParent = pathname?.startsWith("/parent");

  if (status === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
          <p className="text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (status === "anon") return <AuthGate />;

  // Signed in but no learner picked: allow the parent dashboard through, else picker.
  if (status === "no-profile") return isParent ? <>{children}</> : <ProfilePicker />;

  return <>{children}</>;
}

"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { AuthGate } from "./AuthGate";
import { ProfilePicker } from "./ProfilePicker";
import { RecoveryLearning } from "./RecoveryLearning";

export function AppGate({ children }: { children: React.ReactNode }) {
  const { status, recoveryHints, activeProfile, selectProfile, switchProfile, logout } = useStore();
  const pathname = usePathname();
  const isParent = pathname?.startsWith("/parent");

  if (status === "recovery") {
    return <RecoveryLearning key={activeProfile?.id} hints={recoveryHints}
      onRetry={() => { if (activeProfile) void selectProfile(activeProfile.id); }}
      onSwitch={switchProfile} />;
  }

  if (status === "load-error") {
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-xl font-bold">We couldn&apos;t safely load your progress</h1>
          <p>Your cloud progress has not been replaced. Try again before continuing.</p>
          <div className="flex justify-center gap-3">
            {activeProfile && <button onClick={() => selectProfile(activeProfile.id)}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">Try again</button>}
            <button onClick={() => { void logout(); }}
              className="rounded-xl border px-5 py-3 font-semibold">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

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


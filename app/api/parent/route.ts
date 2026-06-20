import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { getProgress } from "@/lib/server/db";
import { verifySecret } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { pin } = await req.json().catch(() => ({}));
  if (!pin || !verifySecret(String(pin), acc.pinSalt, acc.pinHash)) {
    return NextResponse.json({ error: "Incorrect parent PIN." }, { status: 401 });
  }

  const learners = await Promise.all(
    acc.profiles.map(async (profile) => {
      const d = await getProgress(acc.id, profile.id);
      const a = d.analytics;
      return {
        profile,
        stars: d.stars,
        streak: d.streak,
        guidesRead: Object.keys(d.guidesRead).length,
        toReview: Object.keys(d.missed).length,
        answered: a.answered,
        correct: a.correct,
        totalTimeMs: a.totalTimeMs,
        sessionCount: a.sessionCount,
        firstActiveAt: a.firstActiveAt,
        lastActiveAt: a.lastActiveAt,
        days: a.days,
        topics: a.topics,
        log: a.log.slice(-40).reverse(),
      };
    }),
  );

  return NextResponse.json({ account: { id: acc.id, displayName: acc.displayName }, learners });
}

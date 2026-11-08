import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { getProgress } from "@/lib/server/db";
import { verifySecret } from "@/lib/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { pin, verifyOnly } = await req.json().catch(() => ({}));
  if (!pin || !verifySecret(String(pin), acc.pinSalt, acc.pinHash)) {
    return NextResponse.json({ error: "Incorrect parent PIN." }, { status: 401 });
  }
  // Lets the app confirm a grown-up is present (e.g. before resetting progress).
  if (verifyOnly) return NextResponse.json({ ok: true });

  const learners = await Promise.all(
    acc.profiles.map(async (profile) => {
      const d = await getProgress(acc.id, profile.id);
      const a = d.analytics;
      // Animated-lesson progress, from the stars awarded per chapter ("lesson:<topic>:<chapter>")
      // and for finishing ("lesson:<topic>").
      const lessons: Record<string, { chapters: number; done: boolean }> = {};
      for (const key of Object.keys(d.awarded)) {
        const m = /^lesson:([a-z-]+)(?::([a-z]+))?$/.exec(key);
        if (!m) continue;
        const entry = (lessons[m[1]] ??= { chapters: 0, done: false });
        if (m[2]) entry.chapters += 1;
        else entry.done = true;
      }
      return {
        profile,
        stars: d.stars,
        streak: d.streak,
        guidesRead: Object.keys(d.guidesRead).length,
        toReview: Object.keys(d.missed).length,
        reviewIds: Object.keys(d.srs),
        answered: a.answered,
        correct: a.correct,
        totalTimeMs: a.totalTimeMs,
        sessionCount: a.sessionCount,
        firstActiveAt: a.firstActiveAt,
        lastActiveAt: a.lastActiveAt,
        days: a.days,
        topics: a.topics,
        lessons,
        log: a.log.slice(-40).reverse(),
      };
    }),
  );

  return NextResponse.json({ account: { id: acc.id, displayName: acc.displayName }, learners });
}

import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { getProgress, saveProgress } from "@/lib/server/db";
import type { ProgressDoc } from "@/lib/profileTypes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const profileId = new URL(req.url).searchParams.get("profileId") || "";
  if (!acc.profiles.some((p) => p.id === profileId)) return NextResponse.json({ error: "Unknown profile." }, { status: 404 });
  const doc = await getProgress(acc.id, profileId);
  return NextResponse.json({ progress: doc });
}

export async function POST(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { profileId, progress } = await req.json().catch(() => ({}));
  if (!acc.profiles.some((p) => p.id === profileId)) return NextResponse.json({ error: "Unknown profile." }, { status: 404 });
  if (!progress || typeof progress !== "object") return NextResponse.json({ error: "Bad payload." }, { status: 400 });
  await saveProgress(acc.id, profileId, progress as ProgressDoc);
  return NextResponse.json({ ok: true });
}

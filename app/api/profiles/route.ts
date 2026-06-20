import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { addProfile, updateProfile, deleteProfile } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { name, emoji } = await req.json().catch(() => ({}));
  if (!name) return NextResponse.json({ error: "A name is required." }, { status: 400 });
  if (acc.profiles.length >= 12) return NextResponse.json({ error: "That's enough learners for one account!" }, { status: 400 });
  const profile = await addProfile(acc.id, String(name), String(emoji || "🧑‍🎓"));
  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { profileId, name, emoji } = await req.json().catch(() => ({}));
  if (!acc.profiles.some((p) => p.id === profileId)) return NextResponse.json({ error: "Unknown profile." }, { status: 404 });
  const profile = await updateProfile(acc.id, String(profileId), { name, emoji });
  return NextResponse.json({ profile });
}

export async function DELETE(req: Request) {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { profileId } = await req.json().catch(() => ({}));
  if (!acc.profiles.some((p) => p.id === profileId)) return NextResponse.json({ error: "Unknown profile." }, { status: 404 });
  const ok = await deleteProfile(acc.id, String(profileId));
  return NextResponse.json({ ok });
}

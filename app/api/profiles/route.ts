import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { addProfile } from "@/lib/server/db";

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

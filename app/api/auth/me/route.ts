import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server/session";
import { publicAccount } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const acc = await currentAccount();
  if (!acc) return NextResponse.json({ account: null }, { status: 200 });
  return NextResponse.json({ account: publicAccount(acc) });
}

import { NextResponse } from "next/server";
import { getAccount, publicAccount } from "@/lib/server/db";
import { verifySecret, signSession, toAccountId, SESSION_COOKIE } from "@/lib/server/auth";
import { sessionCookieOptions } from "@/lib/server/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  if (!username || !password) return NextResponse.json({ error: "Enter your name and password." }, { status: 400 });
  const acc = await getAccount(toAccountId(String(username)));
  if (!acc || !verifySecret(String(password), acc.passSalt, acc.passHash)) {
    return NextResponse.json({ error: "Name or password is incorrect." }, { status: 401 });
  }
  const res = NextResponse.json({ account: publicAccount(acc) });
  res.cookies.set(SESSION_COOKIE, signSession(acc.id), sessionCookieOptions());
  return res;
}

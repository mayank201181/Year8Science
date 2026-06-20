import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "./auth";
import { getAccount, type Account } from "./db";

export async function currentAccount(): Promise<Account | null> {
  const jar = await cookies();
  const id = verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!id) return null;
  return getAccount(id);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}

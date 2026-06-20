import { scryptSync, randomBytes, createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-me";

// ---- password / PIN hashing (scrypt) ----
export function hashSecret(plain: string): { salt: string; hash: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifySecret(plain: string, salt: string, hash: string): boolean {
  try {
    const test = scryptSync(plain, salt, 64);
    const ref = Buffer.from(hash, "hex");
    return test.length === ref.length && timingSafeEqual(test, ref);
  } catch {
    return false;
  }
}

// ---- signed session token (HMAC) ----
function b64url(b: Buffer): string {
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function signSession(accountId: string): string {
  const payload = b64url(Buffer.from(JSON.stringify({ a: accountId, t: Date.now() })));
  const sig = b64url(createHmac("sha256", SECRET).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = b64url(createHmac("sha256", SECRET).update(payload).digest());
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
    return typeof data.a === "string" ? data.a : null;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "y8session";

/** Normalise a username into a safe storage id. */
export function toAccountId(username: string): string {
  return username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

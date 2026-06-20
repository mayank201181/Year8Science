import { put, head, del } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;

/** Read a JSON document by key. Returns null if it doesn't exist. */
export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const meta = await head(key, { token });
    const res = await fetch(`${meta.url}?_=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Write a JSON document by key (overwrites). */
export async function writeJson(key: string, data: unknown): Promise<void> {
  await put(key, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    token,
    allowOverwrite: true,
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
  });
}

/** Delete a JSON document by key (ignores missing). */
export async function deleteJson(key: string): Promise<void> {
  try {
    const meta = await head(key, { token });
    await del(meta.url, { token });
  } catch {
    /* already gone */
  }
}

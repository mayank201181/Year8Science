import { readJson, writeJson, deleteJson } from "./blob";
import { hashSecret, toAccountId } from "./auth";
import type { Profile, ProgressDoc } from "../profileTypes";
import { emptyProgress } from "../profileTypes";
import { randomBytes } from "crypto";

export interface Account {
  id: string;
  displayName: string;
  passSalt: string;
  passHash: string;
  pinSalt: string;
  pinHash: string;
  createdAt: number;
  profiles: Profile[];
}

const accountKey = (id: string) => `accounts/${id}.json`;
const progressKey = (accountId: string, profileId: string) => `progress/${accountId}/${profileId}.json`;

export async function getAccount(id: string): Promise<Account | null> {
  return readJson<Account>(accountKey(id));
}

export async function saveAccount(acc: Account): Promise<void> {
  await writeJson(accountKey(acc.id), acc);
}

export async function createAccount(
  username: string,
  password: string,
  pin: string,
): Promise<{ ok: true; account: Account } | { ok: false; error: string }> {
  const id = toAccountId(username);
  if (id.length < 2) return { ok: false, error: "Please choose a longer name." };
  if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters." };
  if (!/^\d{4,8}$/.test(pin)) return { ok: false, error: "Parent PIN must be 4–8 digits." };
  const existing = await getAccount(id);
  if (existing) return { ok: false, error: "That name is already taken — try another or sign in." };
  const p = hashSecret(password);
  const pn = hashSecret(pin);
  const account: Account = {
    id,
    displayName: username.trim(),
    passSalt: p.salt,
    passHash: p.hash,
    pinSalt: pn.salt,
    pinHash: pn.hash,
    createdAt: Date.now(),
    profiles: [],
  };
  await saveAccount(account);
  return { ok: true, account };
}

export async function addProfile(accountId: string, name: string, emoji: string): Promise<Profile | null> {
  const acc = await getAccount(accountId);
  if (!acc) return null;
  const profile: Profile = {
    id: randomBytes(6).toString("hex"),
    name: name.trim().slice(0, 30) || "Learner",
    emoji: emoji || "🧑‍🎓",
    createdAt: Date.now(),
  };
  acc.profiles.push(profile);
  await saveAccount(acc);
  await saveProgress(accountId, profile.id, emptyProgress());
  return profile;
}

export async function updateProfile(
  accountId: string,
  profileId: string,
  patch: { name?: string; emoji?: string },
): Promise<Profile | null> {
  const acc = await getAccount(accountId);
  if (!acc) return null;
  const p = acc.profiles.find((x) => x.id === profileId);
  if (!p) return null;
  if (typeof patch.name === "string" && patch.name.trim()) p.name = patch.name.trim().slice(0, 30);
  if (typeof patch.emoji === "string" && patch.emoji) p.emoji = patch.emoji;
  await saveAccount(acc);
  return p;
}

export async function deleteProfile(accountId: string, profileId: string): Promise<boolean> {
  const acc = await getAccount(accountId);
  if (!acc) return false;
  const before = acc.profiles.length;
  acc.profiles = acc.profiles.filter((x) => x.id !== profileId);
  if (acc.profiles.length === before) return false;
  await saveAccount(acc);
  await deleteJson(progressKey(accountId, profileId));
  return true;
}

export async function getProgress(accountId: string, profileId: string): Promise<ProgressDoc> {
  const doc = await readJson<ProgressDoc>(progressKey(accountId, profileId));
  return doc ?? emptyProgress();
}

export async function saveProgress(accountId: string, profileId: string, doc: ProgressDoc): Promise<void> {
  await writeJson(progressKey(accountId, profileId), doc);
}

/** Public-safe view of an account (no secrets). */
export function publicAccount(acc: Account) {
  return { id: acc.id, displayName: acc.displayName, profiles: acc.profiles };
}

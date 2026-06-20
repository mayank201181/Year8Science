"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";

const EMOJIS = ["🧑‍🎓", "👦", "👧", "🧒", "👨‍🎓", "👩‍🎓", "👩‍🔬", "🧑‍🚀", "🦊", "🐼", "🐱", "🐶", "🦁", "🐯", "🦄", "🐧", "🚀", "⭐", "🌟", "🧠"];

export function ProfilePicker() {
  const { account, selectProfile, createProfile, updateProfile, deleteProfile, logout } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const profiles = account?.profiles ?? [];

  function openAdd() {
    setEditingId(null);
    setName("");
    setEmoji(EMOJIS[0]);
    setError("");
    setConfirmDel(false);
    setFormOpen(true);
  }
  function openEdit(id: string, n: string, e: string) {
    setEditingId(id);
    setName(n);
    setEmoji(e);
    setError("");
    setConfirmDel(false);
    setFormOpen(true);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");
    setBusy(true);
    const res = editingId ? await updateProfile(editingId, name, emoji) : await createProfile(name, emoji);
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "Could not save.");
      return;
    }
    setFormOpen(false); // create() navigates into the app; edit() returns here
  }

  async function remove() {
    if (!editingId) return;
    setBusy(true);
    const res = await deleteProfile(editingId);
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "Could not delete.");
      return;
    }
    setFormOpen(false);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="text-4xl">🔬</div>
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900">Who's studying?</h1>
        <p className="mt-1 text-sm text-slate-500">Pick your name to load your own progress.</p>

        {!formOpen ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {profiles.map((p) => (
              <div key={p.id} className="relative">
                <button
                  onClick={() => selectProfile(p.id)}
                  className="group flex w-28 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                >
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-indigo-50 text-4xl">{p.emoji}</span>
                  <span className="w-full truncate text-sm font-semibold text-slate-800">{p.name}</span>
                </button>
                <button
                  onClick={() => openEdit(p.id, p.name, p.emoji)}
                  aria-label={`Edit ${p.name}`}
                  className="absolute -right-1.5 -top-1.5 grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-sm shadow-sm hover:bg-slate-50"
                >
                  ✏️
                </button>
              </div>
            ))}
            <button
              onClick={openAdd}
              className="flex w-28 flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-4 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-3xl">＋</span>
              <span className="text-sm font-semibold">Add learner</span>
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <p className="text-center text-lg font-bold text-slate-900">{editingId ? "Edit profile" : "New learner"}</p>
            <div className="flex justify-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-indigo-50 text-5xl">{emoji}</span>
            </div>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mayank"
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
            <div>
              <span className="text-sm font-semibold text-slate-700">Choose an avatar</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`grid h-10 w-10 place-items-center rounded-full text-xl ${emoji === e ? "bg-indigo-600 ring-2 ring-indigo-300" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white hover:bg-indigo-700 disabled:opacity-60">
                {busy ? "Saving…" : editingId ? "Save changes" : "Start learning"}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>

            {editingId && (
              <div className="border-t border-slate-100 pt-3">
                {!confirmDel ? (
                  <button type="button" onClick={() => setConfirmDel(true)} className="text-sm font-semibold text-rose-500 hover:underline">
                    Delete this profile
                  </button>
                ) : (
                  <div className="rounded-xl bg-rose-50 p-3 text-sm">
                    <p className="text-rose-700">Delete this profile and all its progress? This can't be undone.</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" onClick={remove} disabled={busy} className="rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-700 disabled:opacity-60">
                        Yes, delete
                      </button>
                      <button type="button" onClick={() => setConfirmDel(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-600">
                        Keep it
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span>Signed in as <strong className="text-slate-700">{account?.displayName}</strong></span>
          <span className="hidden sm:inline">·</span>
          <Link href="/parent" className="font-semibold text-indigo-600 hover:underline">Parent dashboard 🔒</Link>
          <span className="hidden sm:inline">·</span>
          <button onClick={logout} className="font-semibold text-slate-500 hover:text-rose-600 hover:underline">Log out</button>
        </div>
      </div>
    </div>
  );
}

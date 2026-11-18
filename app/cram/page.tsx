import { Suspense } from "react";
import type { Metadata } from "next";
import { ALL_TOPICS } from "@/lib/topics";
import { buildTopicCramPack } from "@/lib/cram";
import { CramSheet } from "@/components/CramSheet";

export const metadata: Metadata = {
  title: "Exam Cram Sheet — Year 8 Science",
  description: "Select any 1, 3, or 4 topics in your test for an instant Exam Cram & Mark-Savers Sheet.",
};

export default function CramPage() {
  const packs = ALL_TOPICS.map((t) => buildTopicCramPack(t));
  return (
    <Suspense fallback={<p className="p-6 text-slate-500">Building Exam Cram Sheet…</p>}>
      <CramSheet packs={packs} subjectLabel="Year 8 Science" />
    </Suspense>
  );
}

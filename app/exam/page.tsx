"use client";

import Link from "next/link";
import { COMPREHENSIVE } from "@/lib/comprehensive";
import { QuestionBank } from "@/components/QuestionBank";

export default function ExamPage() {
  const total =
    COMPREHENSIVE.mcqPapers.reduce((n, p) => n + p.questions.length, 0) +
    COMPREHENSIVE.qaPapers.reduce((n, p) => n + p.questions.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700">
        ← Home
      </Link>

      <div className="mt-3 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-4xl shadow-sm">🏁</div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">The Big Exam</h1>
            <p className="text-slate-600">Everything, all at once — across all twelve topics.</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Four multiple-choice papers and four written papers, mixing Biology, Chemistry and Physics. Do
          these once you&apos;ve worked through the topics — they&apos;re the real test of how much has stuck.
          Your place in every paper is saved automatically.
          {total > 0 && <span className="font-semibold"> {total} questions in total.</span>}
        </p>
      </div>

      <div className="mt-6">
        <QuestionBank
          mcqPapers={COMPREHENSIVE.mcqPapers}
          qaPapers={COMPREHENSIVE.qaPapers}
          storagePrefix="exam"
        />
      </div>
    </div>
  );
}

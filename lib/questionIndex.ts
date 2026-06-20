import type { MCQ, QA } from "./types";
import { ALL_TOPICS } from "./topics";
import { COMPREHENSIVE } from "./comprehensive";

export interface IndexedQuestion {
  kind: "mcq" | "qa";
  q: MCQ | QA;
  topicId?: string;
  topicTitle: string;
}

function build(): Record<string, IndexedQuestion> {
  const idx: Record<string, IndexedQuestion> = {};
  for (const t of ALL_TOPICS) {
    for (const q of t.quiz.mcq) idx[q.id] = { kind: "mcq", q, topicId: t.id, topicTitle: t.title };
    for (const q of t.quiz.qa) idx[q.id] = { kind: "qa", q, topicId: t.id, topicTitle: t.title };
    for (const p of t.questionBank.mcqPapers) for (const q of p.questions) idx[q.id] = { kind: "mcq", q, topicId: t.id, topicTitle: t.title };
    for (const p of t.questionBank.qaPapers) for (const q of p.questions) idx[q.id] = { kind: "qa", q, topicId: t.id, topicTitle: t.title };
  }
  for (const p of COMPREHENSIVE.mcqPapers) for (const q of p.questions) idx[q.id] = { kind: "mcq", q, topicTitle: "Big Exam" };
  for (const p of COMPREHENSIVE.qaPapers) for (const q of p.questions) idx[q.id] = { kind: "qa", q, topicTitle: "Big Exam" };
  return idx;
}

export const QUESTION_INDEX: Record<string, IndexedQuestion> = build();

/** All MCQs for a topic (quiz + bank), used to build a challenge round. */
export function topicMcqPool(topicId: string): MCQ[] {
  const t = ALL_TOPICS.find((x) => x.id === topicId);
  if (!t) return [];
  return [...t.quiz.mcq, ...t.questionBank.mcqPapers.flatMap((p) => p.questions)];
}

export function lookup(qid: string): IndexedQuestion | undefined {
  return QUESTION_INDEX[qid];
}

import type { Topic } from "@/lib/types";

export interface QuestionTrapItem {
  question: string;
  commonError: string;
}

export interface TopicCramPack {
  id: string;
  title: string;
  strand: string;
  icon: string;
  summary: string;
  mustKnow: string[];
  examMistakes: string[];
  misconceptions: { wrong: string; right: string }[];
  mnemonics: { topic: string; device: string; explanation: string }[];
  keyFacts: { name: string; value: string }[];
  questionTraps: QuestionTrapItem[];
}

export function buildTopicCramPack(topic: Topic, strandLabel?: string): TopicCramPack {
  const seenErrors = new Set<string>();
  const questionTraps: QuestionTrapItem[] = [];
  for (const paper of topic.questionBank?.qaPapers ?? []) {
    for (const q of paper.questions ?? []) {
      if (q.commonError) {
        const norm = q.commonError.trim().toLowerCase();
        if (!seenErrors.has(norm)) {
          seenErrors.add(norm);
          const firstLine = q.question.split("\n").find((ln) => ln.trim()) ?? q.question;
          questionTraps.push({
            question: firstLine.length > 140 ? `${firstLine.slice(0, 137)}…` : firstLine,
            commonError: q.commonError.trim(),
          });
        }
        if (questionTraps.length >= 6) break;
      }
    }
    if (questionTraps.length >= 6) break;
  }

  const keyFacts: { name: string; value: string }[] = [];
  for (const sec of topic.guide ?? []) {
    for (const kp of (sec.keyPoints ?? []).slice(0, 2)) {
      keyFacts.push({ name: sec.heading, value: kp });
    }
  }

  return {
    id: topic.id,
    title: topic.title,
    strand: strandLabel ?? String(topic.subject),
    icon: topic.icon,
    summary: topic.summary,
    mustKnow: topic.mustKnow ?? [],
    examMistakes: topic.examMistakes ?? [],
    misconceptions: topic.misconceptions ?? [],
    mnemonics: topic.mnemonics ?? [],
    keyFacts: keyFacts.slice(0, 10),
    questionTraps,
  };
}

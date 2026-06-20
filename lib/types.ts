// Core data model for the Year 8 Science app.
// Content is authored as typed modules (one per topic) so the whole
// curriculum is type-checked at build time.

export type Subject = "Biology" | "Chemistry" | "Physics";

/** A single illustrated section of a topic guide. */
export interface GuideSection {
  /** Stable slug used to deep-link from a question back to the concept. */
  id: string;
  heading: string;
  /** Body text. Supports a tiny markdown subset (see MarkdownLite). */
  body: string;
  /** Optional inline SVG markup for a diagram. Self-contained, no network. */
  diagram?: string;
  /** Short caption shown under the diagram. */
  diagramCaption?: string;
  /** Bullet "key points" highlighted in a callout box. */
  keyPoints?: string[];
  /** Optional "Art of Problem Solving" style think-deeper prompt. */
  thinkDeeper?: string;
}

export interface Mnemonic {
  /** The thing to remember, e.g. "Order of the visible spectrum". */
  topic: string;
  /** The memory device, e.g. "Richard Of York Gave Battle In Vain". */
  device: string;
  /** How the device maps to the facts. */
  explanation: string;
}

export interface Misconception {
  wrong: string;
  right: string;
}

export interface ExpertDebate {
  question: string;
  detail: string;
}

export interface RealWorld {
  title: string;
  detail: string;
  emoji?: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface VideoLink {
  title: string;
  channel: string;
  /** A YouTube watch URL or search URL. */
  url: string;
}

/** Multiple-choice question. */
export interface MCQ {
  id: string;
  question: string;
  options: string[];
  /** Index into options of the correct answer. */
  answerIndex: number;
  /** Hidden hint, revealed on demand. */
  hint: string;
  /** Shown after answering: why right answer is right / others wrong. */
  explanation: string;
  /** id of the GuideSection this tests, for "back to the guide". */
  guideRef?: string;
}

/** One credit-worthy point in a written-answer mark scheme. */
export interface MarkPoint {
  /** Human description of the point, e.g. "States chlorophyll absorbs light". */
  point: string;
  /** Lower-case keywords; if the answer contains any, the point is credited. */
  keywords: string[];
}

/** Written (question-and-answer) question with auto self-assessment. */
export interface QA {
  id: string;
  question: string;
  /** Marks available (= number of mark points, usually). */
  marks: number;
  hint: string;
  /** A full model answer shown after the student attempts. */
  modelAnswer: string;
  /** Mark scheme used to auto-grade the typed answer by keyword coverage. */
  markScheme: MarkPoint[];
  /** What students commonly get wrong on this question. */
  commonError: string;
  guideRef?: string;
}

export interface Paper<Q> {
  id: string;
  title: string;
  questions: Q[];
}

export interface Topic {
  id: string;
  title: string;
  subject: Subject;
  /** Emoji used as the topic icon. */
  icon: string;
  /** One-line hook shown on the topic card. */
  summary: string;
  /** A short "why this matters" intro paragraph. */
  intro: string;

  guide: GuideSection[];
  mnemonics: Mnemonic[];
  examMistakes: string[];
  misconceptions: Misconception[];
  expertDebates: ExpertDebate[];
  realWorld: RealWorld[];
  flashcards: Flashcard[];
  /** "What every student should be able to do" checklist. */
  mustKnow: string[];
  videos: VideoLink[];

  /** The short topic quiz: 4 MCQ + 4 QA. */
  quiz: {
    mcq: MCQ[];
    qa: QA[];
  };

  /** The big practice bank: 4 MCQ papers + 4 QA papers. */
  questionBank: {
    mcqPapers: Paper<MCQ>[];
    qaPapers: Paper<QA>[];
  };
}

/** The comprehensive cross-topic exam. */
export interface ComprehensiveExam {
  mcqPapers: Paper<MCQ>[];
  qaPapers: Paper<QA>[];
}

// ---- Engagement extras (kept separate from the audited topic content) ----

/** A safe at-home / classroom mini-experiment. */
export interface Experiment {
  title: string;
  emoji: string;
  materials: string[];
  steps: string[];
  /** The science: what happens and why. */
  science: string;
  /** Optional safety note. */
  safety?: string;
}

export interface BonusDiagram {
  title: string;
  /** Inline SVG markup. */
  svg: string;
  caption?: string;
}

/**
 * Per-topic engagement add-ons. Stored in a registry keyed by topic id so the
 * core (audited) topic modules never need editing.
 */
export interface TopicExtras {
  /** A 1–2 sentence curiosity hook shown at the top of the guide. */
  hook?: string;
  /** Surprising "Did you know?" wow-facts. */
  didYouKnow?: string[];
  /** At-home experiments. */
  experiments?: Experiment[];
  /** Extra labelled diagrams to enrich the guide. */
  bonusDiagrams?: BonusDiagram[];
  /** Key of an interactive explorable widget to feature in the guide. */
  interactive?: string;
}


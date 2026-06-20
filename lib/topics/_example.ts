// REFERENCE EXAMPLE — not part of the curriculum, not registered.
// This shows the exact shape every topic module must follow. Content
// agents copy this structure and fill it with real, topic-specific
// material. See lib/types.ts for the authoritative type definitions.

import type { Topic } from "../types";

export const exampleTopic: Topic = {
  id: "example",
  title: "Example Topic",
  subject: "Physics",
  icon: "🧪",
  summary: "One sentence hook shown on the topic card.",
  intro:
    "A short, friendly paragraph explaining why this topic matters and what the student will be able to do by the end.",

  // ---- GUIDE: several illustrated sections. Use **bold**, *italic*, `code`,
  // blank lines for paragraphs, and lines starting with '- ' for bullets. ----
  guide: [
    {
      id: "intro-concept",
      heading: "The big idea",
      body:
        "Plain-language explanation. Define every key term the first time it appears, e.g. **energy** is the ability to do work.\n\nUse a second paragraph to build the idea step by step.\n\n- A bullet for a crisp fact\n- Another bullet",
      // Inline SVG keeps diagrams self-contained (no network needed).
      diagram:
        '<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Example diagram"><rect x="10" y="30" width="80" height="40" rx="6" fill="#dbeafe" stroke="#3b82f6"/><text x="50" y="55" font-size="11" text-anchor="middle" fill="#1e3a8a">Input</text><line x1="90" y1="50" x2="130" y2="50" stroke="#1e3a8a" stroke-width="2" marker-end="url(#ah)"/><defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1e3a8a"/></marker></defs><rect x="130" y="30" width="60" height="40" rx="6" fill="#dcfce7" stroke="#22c55e"/><text x="160" y="55" font-size="11" text-anchor="middle" fill="#14532d">Output</text></svg>',
      diagramCaption: "A short caption describing the diagram.",
      keyPoints: ["A headline fact to remember", "A second headline fact"],
      thinkDeeper:
        "An Art-of-Problem-Solving style prompt that pushes the student to reason, e.g. 'What would happen if you doubled the input — and why?'",
    },
  ],

  mnemonics: [
    {
      topic: "Order of the visible spectrum",
      device: "Richard Of York Gave Battle In Vain",
      explanation: "Red, Orange, Yellow, Green, Blue, Indigo, Violet.",
    },
  ],

  examMistakes: [
    "Writing the unit wrong (e.g. forgetting to convert grams to kilograms).",
  ],

  misconceptions: [
    { wrong: "A common but incorrect belief.", right: "The accurate scientific picture." },
  ],

  expertDebates: [
    {
      question: "An open question or subtlety even experts discuss.",
      detail: "A couple of sentences explaining the nuance and why it is debated.",
    },
  ],

  realWorld: [
    { title: "Where it shows up in life", detail: "A concrete, motivating real-world use.", emoji: "🚀" },
  ],

  flashcards: [{ front: "Key term or question", back: "Crisp definition or answer" }],

  mustKnow: ["A 'can you do this?' checklist item phrased as a skill."],

  videos: [
    { title: "Topic explained", channel: "FuseSchool", url: "https://www.youtube.com/results?search_query=fuseschool+example+topic" },
  ],

  // ---- SHORT QUIZ: exactly 4 MCQ + 4 QA ----
  quiz: {
    mcq: [
      {
        id: "ex-quiz-mcq-1",
        question: "A clear single-best-answer question?",
        options: ["Distractor A", "Correct option", "Distractor C", "Distractor D"],
        answerIndex: 1,
        hint: "A nudge that helps without giving the answer away.",
        explanation: "Why the correct option is right and why the tempting distractor is wrong.",
        guideRef: "intro-concept",
      },
    ],
    qa: [
      {
        id: "ex-quiz-qa-1",
        question: "An open question that expects 2–4 marked points.",
        marks: 2,
        hint: "Think about the two key ideas.",
        modelAnswer: "A full model answer a student could aim to write.",
        markScheme: [
          { point: "States the first key idea", keywords: ["idea one", "keyword", "synonym"] },
          { point: "States the second key idea", keywords: ["idea two", "another keyword"] },
        ],
        commonError: "The single most common way students lose marks here.",
        guideRef: "intro-concept",
      },
    ],
  },

  // ---- QUESTION BANK: 4 MCQ papers (25 each) + 4 QA papers (25 each) ----
  questionBank: {
    mcqPapers: [
      {
        id: "ex-mcq-p1",
        title: "MCQ Paper 1",
        questions: [
          {
            id: "ex-mcq-p1-q1",
            question: "Example bank MCQ?",
            options: ["A", "B", "C", "D"],
            answerIndex: 0,
            hint: "Hidden hint.",
            explanation: "Worked explanation.",
            guideRef: "intro-concept",
          },
        ],
      },
    ],
    qaPapers: [
      {
        id: "ex-qa-p1",
        title: "Written Paper 1",
        questions: [
          {
            id: "ex-qa-p1-q1",
            question: "Example bank written question?",
            marks: 3,
            hint: "Hidden hint.",
            modelAnswer: "Model answer.",
            markScheme: [
              { point: "Point one", keywords: ["kw1"] },
              { point: "Point two", keywords: ["kw2"] },
              { point: "Point three", keywords: ["kw3"] },
            ],
            commonError: "Common mistake.",
            guideRef: "intro-concept",
          },
        ],
      },
    ],
  },
};

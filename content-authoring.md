# Content authoring spec (for content agents)

You are writing **one** topic data file for a Year 8 (age 12–13) science web app
following the Cambridge Lower Secondary / IGCSE-foundations curriculum.

## Hard rules
1. **Write exactly one file**: `lib/topics/<id>.ts`. Do not touch any other file.
2. The file must `import type { Topic } from "../types";` and
   `export const <exportName>: Topic = { ... };` — names given in your task.
3. **Read first**: `lib/types.ts` (the contract) and `lib/topics/_example.ts`
   (the exact shape, escaping, and an example SVG diagram). Match that shape exactly.
4. **Do NOT run `npm run build` / `next build`** (other agents share this folder).
   You may run `npx tsc --noEmit --jsx react-jsx --skipLibCheck lib/topics/<id>.ts`
   to sanity-check syntax, but ignore import/module errors from that isolated check.
5. The content must be **scientifically accurate** and at the right level for a
   strong Year 8 student. Define every key term the first time it is used.

## String / escaping rules (to avoid syntax errors)
- Use **double quotes** for normal strings. An apostrophe inside is fine: `"it's"`.
- For any string that contains double quotes — **especially `diagram` SVG markup** —
  use a **backtick template literal**. SVG has no backticks, so this is safe.
  Do NOT put `${` sequences inside backtick strings.
- Keep SVGs small and valid: include `viewBox`, `xmlns="http://www.w3.org/2000/svg"`,
  and `role="img"` with an `aria-label`. Use simple shapes, labels and arrows.
  Every guide section SHOULD have a relevant diagram.

## Required content (fill EVERY field of Topic)
- `intro`: 2–3 sentence motivating paragraph.
- `guide`: **6–8 sections**. Each: unique `id` (kebab-case slug), `heading`,
  a rich multi-paragraph `body` (use `**bold**`, blank lines for paragraphs, and
  `- ` bullet lines), a relevant `diagram` (inline SVG, backtick string),
  a `diagramCaption`, 2–4 `keyPoints`, and a `thinkDeeper` reasoning prompt
  (Art-of-Problem-Solving style — make them reason, not recall).
- `mnemonics`: 2–4 genuinely helpful memory devices.
- `examMistakes`: 5–8 specific mistakes that lose marks.
- `misconceptions`: 4–6 `{ wrong, right }` pairs.
- `expertDebates`: 2–3 real nuances/frontiers (honest, age-appropriate).
- `realWorld`: 4–6 motivating real-life uses, each with an `emoji`.
- `flashcards`: 10–14 `{ front, back }` cards covering core facts.
- `mustKnow`: 6–10 "can you do this?" skill statements.
- `videos`: 3–4 links. Use **YouTube search URLs** so links never die, e.g.
  `https://www.youtube.com/results?search_query=...` from channels like
  FuseSchool, Cognito, Free Science Lessons, GCSE Science / Primrose Kitten.
- `quiz`: exactly **4 MCQ + 4 QA** (a quick check, mixed difficulty).
- `questionBank`:
  - `mcqPapers`: **4 papers**, titled "MCQ Paper 1..4", **25 questions each**.
  - `qaPapers`: **4 papers**, titled "Written Paper 1..4", **25 questions each**.

## Question quality
- Every MCQ: 4 plausible options, exactly one correct (`answerIndex` 0–3 — double
  check it points to the right option), a non-giveaway `hint`, and an `explanation`
  that says why the right answer is right AND why a tempting distractor is wrong.
- Every QA: realistic `marks` (2–5), a `hint`, a full `modelAnswer`, a `markScheme`
  of `marks`-many points — each with **3–6 lower-case `keywords`/synonyms** a student
  might write (the app credits a point if any keyword appears), and a `commonError`.
- Set `guideRef` on most questions to the `id` of the guide section it tests.
- Make questions **varied**: recall, definitions, explain-why, apply-to-scenario,
  interpret-data, compare/contrast, calculate, and evaluate. Avoid duplicates.
- Give every question a **unique `id`** using the pattern shown in your task.

Aim for genuinely useful, exam-style material a parent would be proud to hand their child.

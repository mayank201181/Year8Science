---
name: studyguideskill
description: >-
  Build a complete interactive study/revision web app for ANY school subject and year group
  (e.g. Year 11 Maths, Year 11 English, GCSE Biology, KS3 History). Generates illustrated
  guides, quizzes, full exam papers, a gamified learning engine, multi-learner profiles with
  cross-device cloud sync, a PIN-protected parent dashboard, PWA install, an AI tutor,
  per-topic interactive dashboards (change inputs, watch outputs), and spaced-repetition
  review — then deploys to Vercel. Built around Art of Problem Solving (AoPS)
  pedagogy by default: problem-first discovery, derive-don't-decree, laddered hints, multiple
  solution paths, tiered difficulty with genuine challenge problems, and explicitly-taught
  problem-solving strategies. Use whenever the user wants to create a learning/revision/
  exam-practice app for a child or student. Reference implementation: the "Year 8 Science Lab".
---

# Study Guide App Builder

A battle-tested playbook for building a polished, kid-friendly study app for one subject + year
group and shipping it to a shareable URL. Born from the **Year 8 Science Lab** build — reuse the
same architecture for Maths, English, History, etc. by swapping the content and a few
subject-specific tweaks (see **Subject adaptations**).

## 0. First, read the framework docs
This stack pins a specific Next.js. **Before writing code, read the relevant guides in
`node_modules/next/dist/docs/`** (App Router, route handlers, metadata/manifest, `next/og`
`ImageResponse`). Heed any `AGENTS.md`/`CLAUDE.md` in the repo — conventions may differ from
training data.

## 1. Intake (ask the user first, in one batched question set)
- **Subject & year/key-stage** (e.g. Year 11 Maths) and **exam board/curriculum** (e.g. AQA, Edexcel, Cambridge).
- **Topic list** (or offer a sensible default set for that subject+year and confirm).
- **Depth**: how many practice questions per topic, whether to include a cross-topic "big exam".
- **Engagement features** wanted (all are optional add-ons): explorables, AI tutor, parent dashboard, cross-device accounts, PWA, certificates, etc.
- **Cross-device sync?** If yes → backend required (accounts + Vercel Blob). If "same device only" → localStorage only (much simpler).

## 2. Tech stack & conventions
- **Next.js (App Router) + TypeScript + Tailwind v4.** Do **not** set `output: 'export'` — server route handlers are needed for accounts/AI.
- Client state via a React context store (`lib/store.tsx`); content as typed data modules (`lib/topics/<id>.ts`).
- Keep **audited exam content** completely separate from **engagement extras** (hooks, fun facts, experiments, interactive widgets) so content edits never risk the answer keys. Extras live in `lib/extras/<id>.ts` keyed by topic id; the store/guide look them up — the audited topic files are never touched to add engagement.
- Inline SVG for diagrams (no binary assets). Render via `dangerouslySetInnerHTML` into a `.diagram` wrapper. SVGs must include `viewBox`, `xmlns`, `role="img"`, `aria-label`, and contain **no backticks or `${`** (they're authored inside template strings).

## 2.5 Core teaching philosophy — Art of Problem Solving (AoPS) style  ← apply to ALL content by default
This pedagogy is the **default for every app built with this skill** (unless the user opts out). It matters most for Maths and other problem-based subjects, but the spirit — curiosity and reasoning over memorisation — applies to every subject.

Principles:
- **Problem-first / discovery.** Open each topic — and ideally each section — with an intriguing problem or puzzle the learner attempts *before* the method is explained. Let them feel the need for the idea, then develop it. Don't lead with the formula.
- **Derive, don't decree.** Show *where* a rule/formula comes from (a short derivation or visual), not just the statement. Include a "Why does this work?" note.
- **Productive struggle + laddered hints.** Never hand the answer immediately. Provide a **hint ladder** (gentle nudge → bigger hint → key step → full solution) the learner unlocks one step at a time.
- **Multiple solution paths.** Where natural, give two approaches (e.g. algebraic vs visual) and point out the *elegant* one — maths rewards insight, not just grinding.
- **Tiered difficulty incl. genuine challenge.** Every topic has **Warm-up → Core → Challenge**. Challenge problems must actually stretch a strong student (AoPS-hard), not just "more of the same".
- **Strategies, explicitly taught.** Name the moves: work backwards, find a pattern, try small cases, exploit symmetry, consider extremes, draw a diagram, introduce a variable, look for invariants. Surface a relevant **strategy tag** and a short "How to think about this" note.
- **Mistakes are data.** Make common misconceptions explicit (`commonError`); wrong answers feed spaced repetition and become teachable moments.
- **Understanding over memorisation; reward reasoning.** Mark schemes/explanations reward *method and reasoning*, not only the final answer. Celebrate clever thinking.
- **Reveal-after-attempt.** Solutions sit behind an "I've tried — show me" reveal so learners attempt first.

How the engine enforces it:
- **PaperRunner**: a "Try first" state; model solution and hint ladder reveal *progressively*, not all at once. Award **bonus stars for solving with fewer hints used**.
- **GuideView**: render the section's `discovery` problem at the top with a reveal for the idea; render `strategies` and a "Why does this work?" callout.
- **AI tutor**: AoPS-style system prompt — ask a guiding question back, give only the *next* hint, never the full solution to a posed problem unless the learner explicitly gives up; praise good reasoning.

Data-model additions that make this real (reflected in §3): `GuideSection.discovery?` / `strategies?` / `whyItWorks?`; `MCQ`/`QA` gain `difficulty?` (`warmup`|`core`|`challenge`), `hints?` (the ladder), and `solutions?` (one or more worked methods); each topic surfaces a separate **Challenge set**.

## 3. Data model (generalise per subject)
`lib/types.ts`:
- `Topic { id, title, subject, icon, intro, guide: GuideSection[], learn: LearnSmart, quiz: {mcq:MCQ[], qa:QA[]}, questionBank: {mcqPapers, qaPapers} }`
- `GuideSection { heading, body (markdown-lite), diagrams?, keyPoints?, thinkDeeper?, discovery?: {problem, idea}, strategies?: string[], whyItWorks? }`
- `MCQ { id, question, options[], answerIndex, explanation, guideRef?, difficulty?: "warmup"|"core"|"challenge", hints?: string[], strategy? }`
- `QA { id, question, modelAnswer, markScheme: string[], commonError?, guideRef?, difficulty?, hints?: string[], strategy?, solutions?: {label, steps}[] }`
- `Paper<T> { id, title, questions: T[] }`; `ComprehensiveExam { mcqPapers, qaPapers }`
- Engagement extras (`TopicExtras`): `hook?`, `didYouKnow?[]`, `experiments?[]`, `bonusDiagrams?[]`, `interactive?` (widget key).
- **Every question `id` must be globally unique** across all topics + the exam (e.g. `photo-mcq-b1-q03`). A global `QUESTION_INDEX` (built from all topics) powers review + challenge by id alone.

`lib/profileTypes.ts` (only if cloud sync): `Profile`, `ProgressDoc` (stars, awarded, attempts, guidesRead, missed, challengeBest, streak, **srs** for spaced repetition, **goalMinutes**, **analytics**), `SrsItem`, `Analytics` (time on task, sessions, per-day, per-topic, activity log).

## 4. Content generation pipeline (the big lift)
1. Build the **app skeleton** first (types, store, routing, one sample topic) and get it rendering.
2. **Generate content with parallel subagents** — one agent per topic (or per 2-3 topics), each writing a complete `lib/topics/<id>.ts` (guide + learn-smart + quiz + question bank). Give every agent the exact `types.ts`, the id-uniqueness rule, the house style, **and the §2.5 AoPS requirements**: a `discovery` opener + `whyItWorks` + `strategies` per section; every question tagged `difficulty` with a genuine spread of warmup/core/**challenge** (≥2-3 real challenge problems per topic); a `hints` ladder (3-4 steps) on core/challenge questions; and ≥1 multi-method `solutions` entry where a second approach is illuminating. Run them concurrently (background agents).
3. **Fresh-eyes correctness audit**: after generation, run a second agent pass per topic that re-verifies every answer key literally, checks each explanation matches the keyed answer, and validates model answers/mark-schemes. This catches the ~5-10% of LLM-authored questions with subtle key errors. Treat it as mandatory.
4. Engagement extras (hooks, fun facts, at-home activities, bonus diagrams, interactive widget keys) via a separate agent pass writing `lib/extras/<id>.ts` — never edit audited files.
5. After every batch: `npm run build` must be green (Type check + static generation) before moving on.

## 5. Learning-engine components (reuse these)
- **PaperRunner**: one component for MCQ or QA papers — autosave & resume, question navigator, instant self-assessment of written answers (keyword mark-scheme → correct / partial / needs-work via `lib/grade.ts`), "back to the guide" deep links, star awards. Calls `recordResult(qid, correct)` so wrong answers feed the review queue. **AoPS behaviour:** start in a "Try first" state; reveal the `hints` ladder **one step at a time** on request, and the worked `solutions` only after an attempt; award **bonus stars for fewer hints used**; show the `difficulty` badge and a `strategy` tag.
- **GuideView**: renders intro, sections, diagrams; mark-as-read; plus extras (hook banner, "Did you know?" cards, "Try this at home" experiments, bonus diagrams), a **Read-aloud** button (Web Speech API), a link to the Interactive tab, and the **AI tutor** widget.
- **Interactive tab (default — every topic gets one).** A dedicated tab on each topic (a `<TopicView>` tab beside Guide/Quiz/Papers) holding one or more **parameter-driven explorables**: the learner changes inputs and watches the output change live. This is core to the AoPS discovery pedagogy — prioritise it. Build a genuinely useful widget per topic, not a token one. Marquee example (Science): an **Atom & Element Builder** — steppers for protons/neutrons/electrons that live-update the element, symbol, mass number, and whether it's a neutral atom or an ion (with the charge), plus a Bohr-model SVG. Others built: molecule builder, reaction-rate (collision theory), exercise/respiration, breathing mechanics, digestion journey, pH slider, circuit lab, ray diagram, convection, sound wave, photosynthesis rate.
- **Explorables** (`components/Explorables.tsx` + `InteractiveWidgets.tsx`): small self-contained interactive widgets keyed by string in a registry (`EXPLORABLES_ALL`), mapped from a topic's `extras.interactive` (or `extras.interactives[]`) and rendered by the Interactive tab. Pattern: local state from steppers/sliders → compute → render result + a plain-language caption explaining the science. **Per subject:** Maths → function grapher, fraction/area visualiser, probability spinner, equation balance scale; English → sentence-structure / language-device highlighter, word-class sorter; Geography → population pyramid, climate-graph builder.
- **Gamification**: stars + ranks (`RANKS`), daily **streak**, **daily goal** (minutes) with progress + mascot nudges, timed **Challenge** mode per topic, printable **Certificate** of mastery.
- **Mascot** ("Professor Photon"): fixed, dismissible guide that reads store state (streak, due reviews, goal, progress) and shows one contextual nudge.
- **Spaced repetition**: missed questions schedule on a ladder `[1,3,7,16,35]` days; `recordResult` advances on correct (graduates after the last step) and resets to "due today" on wrong; the Review page surfaces only **due** items.

## 6. Accounts, cloud sync & parent dashboard (only if cross-device)
- **Storage**: Vercel **Blob** as a JSON KV. `lib/server/blob.ts` (readJson/writeJson/deleteJson with `cacheControlMaxAge:0`, `addRandomSuffix:false`, `allowOverwrite:true`, read via `head()`+`fetch(no-store)`). Keys: `accounts/<id>.json`, `progress/<accountId>/<profileId>.json`.
- **Auth** (`lib/server/auth.ts`): scrypt-hashed password + parent PIN; HMAC-signed session token in an httpOnly cookie (`AUTH_SECRET`). One **family account** (name + password + PIN) → multiple **learner profiles** (name + emoji avatar).
- **API routes**: `auth/{signup,login,logout,me}`, `profiles` (POST/PATCH/DELETE), `progress` (GET/POST), `parent` (POST {pin} → per-learner analytics). All `runtime="nodejs"`, `dynamic="force-dynamic"`.
- **Store** holds `status: loading|anon|no-profile|ready`, account, activeProfile, and debounce-syncs `ProgressDoc` to the server (localStorage as offline cache). `recordResult`/`markGuideRead`/heartbeat update `analytics`.
- **UI**: `AppGate` (loading → AuthGate → ProfilePicker → app), `ProfilePicker` ("Who's studying?" with add/edit/delete + avatar), header profile menu (switch/parent/logout), and `/parent` (PIN-gated) with per-learner time-on-task, accuracy, per-topic table, this-week chart, recent-activity log.

## 7. AI tutor (optional; needs an Anthropic key)
- `app/api/ai/route.ts` using `@anthropic-ai/sdk` (`import Anthropic from "@anthropic-ai/sdk"`), **gated behind `currentAccount()`**. **AoPS-style kid-safe system prompt**: warm Socratic tutor — respond to a posed problem with a guiding question or the *single next* hint, never the full solution unless the learner says they give up; nudge them to try; reward and build on their reasoning; explain *why*, show an elegant alternative when apt; short, age-appropriate; refuses/redirects off-topic.
- Model default `claude-opus-4-8`; allow `AI_MODEL` env override (e.g. `claude-haiku-4-5` for ~5× lower cost). `max_tokens` ~800, no thinking needed for short explanations. Handle `Anthropic.RateLimitError`.
- If `ANTHROPIC_API_KEY` is unset → return 503 with a friendly "ask a grown-up" message; the `AskAI` widget shows it gracefully.
- `components/AskAI.tsx`: a reusable button → panel with preset actions ("Explain simply", "Give an example", "Explain why", "Hint") + a free-text box. Wire into GuideView (topic context) and PaperRunner (after an answer is checked).

## 8. PWA (installable)
- `app/manifest.ts` (name, `display:"standalone"`, theme/background colour, icons).
- Generate icons with `next/og` `ImageResponse` — no binary assets: `app/apple-icon.tsx` (iOS) and an `app/api/appicon/route.tsx` PNG route referenced by the manifest at 192/512 (+ a maskable variant). **Emoji don't render in ImageResponse without a font — use letters/shapes** (e.g. "Y8 SCIENCE" on a gradient).
- In `layout.tsx`: `export const viewport = { themeColor }` and `metadata.appleWebApp`.

## 9. Infrastructure & deploy playbook
- **Vercel via API/CLI** with `VERCEL_TOKEN`. Provision Blob: `POST /v1/storage/stores/blob` → connect to project (`/v1/storage/stores/{id}/connections`) → injects `BLOB_READ_WRITE_TOKEN`. Add `AUTH_SECRET` (random) and `ANTHROPIC_API_KEY` via `POST /v10/projects/{id}/env` for production+preview+development. Pull values into `.env.local` for local testing (it's gitignored by `.env*`).
- **Connect GitHub→Vercel** so pushes auto-deploy: pushes to a branch → preview; merges to **main** → production. Production URL is `https://<project>.vercel.app`.
- Always `npm run build` clean before deploying.

## 10. Gotchas that cost time (avoid them)
- **Deploy BLOCKED: "Git author … must have access to the team."** Once the repo is git-connected, Vercel blocks deploys whose **HEAD commit author email** isn't a Vercel team member. Fix: `git config user.email <the Vercel account email>` and re-author (`git commit --amend --reset-author`); future commits use it.
- **Squash-merge divergence.** After squash-merging a PR, the feature branch shares only the root commit with `main`, so the next PR shows add/add conflicts. Fix: `git fetch origin main && git checkout -B <branch> origin/main && git cherry-pick <feature-commit>` (or reset to origin/main and re-apply), then force-push.
- **Secure cookies on http localhost.** Session cookies set `secure` in production → they won't be sent over `http://localhost` under `npm start` (NODE_ENV=production). Test auth flows with `npm run dev`.
- **Blob read-after-write/CDN staleness.** Set `cacheControlMaxAge:0` on `put` and read with `fetch(url, {cache:'no-store'})` + a cache-buster.
- **Globally-unique question ids** — enforce, then you can index/review/challenge by id alone.
- **Keep extras separate from audited content** — protects answer keys from engagement edits.
- **Don't over-trust generated answer keys** — always run the fresh-eyes audit pass.

## 11. Subject adaptations
- **Maths (lean hard into §2.5 AoPS)**: discovery openers that motivate each idea with a problem; derivations over stated formulas; multi-method worked `solutions` (e.g. algebra vs picture); a hint ladder on every non-trivial problem; a real **Challenge set** per topic (competition-flavoured: invariants, extremal cases, clever counting); explicit strategy tags. Plus: formula/identity sheets, numeric answers with tolerance, equivalent-form grading; explorables = function grapher, fraction/area visualiser, probability spinner. Consider plain-text math (avoid LaTeX unless you add a renderer).
- **English**: include **text extracts/passages**; comprehension MCQs + extended-response with a points-based mark scheme; model paragraphs (PEE/PEEL); quote banks; explorables = sentence-structure or language-device highlighter; grading leans on keyword/mark-scheme coverage for longer answers.
- **History/Geography/Languages**: source analysis, timelines/maps as SVG, vocab flashcards + SRS, case-study model answers.
- Keep the engine identical; only the content shape and a few widgets change.

## 12. Build order (fast path)
1. Confirm intake. 2. Scaffold app + types + store + one topic; build green. 3. Provision Vercel + Blob + env; connect GitHub; first deploy. 4. Parallel subagents author all topics; audit pass; build green. 5. Engagement extras pass. 6. Layer features the user asked for (profiles/parent, AI, PWA, SRS, gamification). 7. Deploy; verify live; share URL.

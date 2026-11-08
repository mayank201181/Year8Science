# Lesson playbook

The standard for every animated lesson. The reference is `lessons/respiration/`:
12 chapters, 113 narration lines, 1,874 words, 13.6 minutes, every line with a
visual that matches what is being said. New lessons must match it in quality
and quantity.

## 1. Shape of a lesson

1. **Intro** (`card: False`, ~25 s, 4 lines): the topic's `hook` from
   `lib/extras/<topic>.ts`, what the topic is, and a one-line roadmap.
2. **One chapter per guide section** of `lib/topics/<topic>.ts`, in order.
   Merge two small sections only when they are really one idea. Every section's
   body, `keyPoints` and relevant `mustKnow` items must be taught.
3. **Recap** (~55 s): the mnemonics ("memory hooks"), then five exam traps from
   `examMistakes`, one per line ("One: ...", "Two: ...").
4. **Quick-fire quiz** (~65 s): "Quick-fire quiz! Say each answer out loud
   before it appears.", five question/answer pairs (`q1`/`a1` ...; each
   question has `"pause": 4.0` for thinking time), then the outro "Brilliant
   work. Now try the <Name> quiz in your Science Lab, to lock it in."

Target 12–16 minutes, 1,700–2,300 words, 10–15 chapters. Weave in the topic's
misconceptions (correct them where they arise), its mnemonics (in context and
again in the recap), a few real-world examples, the best "did you know" facts,
the at-home experiments where they fit, and at most one short "science today"
line from `expertDebates`.

## 2. Script: `lessons/<topic>/script.py`

Copy the structure of `lessons/respiration/script.py` exactly.

- `META`: `name` (short, used in "<name>, animated" and "Back to <name>"),
  `kicker` ("Year 8 Science · Biology|Chemistry|Physics"), `dek` (one or two
  sentences; `{chapters}` becomes the chapter count in words).
- Chapter: `id` (lowercase ascii letters only, unique; also the URL hash),
  `title` (card title, at most 42 characters), `short` (chapter tag, at most 20
  characters), `card: False` on the intro only.
- Line: `id` (lowercase, unique within the chapter; the animation cue), `cap`
  (the caption), optional `say` (what the voice reads, when it differs),
  optional `pause` (extra silence after the line: 2–4 s when an animation needs
  time, 4.0 for quiz thinking time).

Writing:
- British English (colour, fibre, metres). Friendly, clear, Year 8 level.
  Address the learner as "you".
- One idea per line, so each line can have one visual beat. Mostly 10–25 words,
  never more than about 35.
- Captions use `**bold**` for the key words, real subscripts and superscripts
  (CO₂, cm³), and → for "gives" in equations. Exam-answer wording must match
  the guide.
- `say` whenever the caption has formulas, symbols, units or digits that matter:
  "C six H twelve O six", "six O two", "metres per second", "degrees Celsius",
  "H two O". Spell numbers in words where the voice must not guess.
- Avoid sentence openings that are mis-heard. A sentence-initial "Anaerobic"
  after a full stop was heard as "And aerobic"; keep such words mid-sentence.
- Fact-check every claim. If `lib/topics/<topic>.ts` or `lib/extras/<topic>.ts`
  contains an error, fix it there with a minimal edit and report it. Errors
  already found in Respiration: "every cell has hundreds of mitochondria" (red
  blood cells have none) and "yeast fizzes every fizzy drink" (soft drinks are
  carbonated with injected CO₂).

## 3. Storyboard: `lessons/<topic>/STORYBOARD.md`

For each chapter, a heading `## <id>: <title>` with a line about the chapter's
layout and art, then one bullet per line id saying what the screen shows while
that line is spoken: the visual beat that matches the words, and what fades as
the next beat arrives. Mark the showpiece moment of each chapter (Respiration's
were the atoms rearranging, the membrane unfolding and the dough rising). Name
lib art to reuse and any new art the chapter needs. End with a suggested split
of chapters into groups of about three for the animators, balanced by length
and difficulty.

## 4. Audio

```bash
S=<scratchpad>; T=<topic>
KOKORO_DIR=$S/tts python3 lessons/engine/make_audio.py --topic $T $S/audio/$T
WHISPER_DIR=$S/asr/sherpa-onnx-whisper-base.en python3 lessons/engine/check_audio.py --topic $T $S/audio/$T
```

- `make_audio.py` synthesises each line separately (cached by text), writes
  `$S/audio/$T/narration.mp3` and copies the timeline to
  `lessons/$T/timeline.json`. Re-running only re-synthesises changed lines.
- Before synthesising, check how the voice will say the technical words:
  `python3 -c "from kokoro_onnx.tokenizer import Tokenizer as T; print(T().phonemize('chlorophyll', 'en-us'))"`.
  Respell in `say` when the stress or sounds are wrong ("klorofil",
  "ress-pirometer").
- `check_audio.py` transcribes every line and prints the ones that differ from
  the script. Most flags are spelling conventions ("lime water", "6's",
  formulas written as symbols); act on real mishearings, the ones a listener
  would also mis-hear, by rewording or respelling, then re-run both commands.
- The voice is Kokoro `af_heart` at speed 0.95 for every lesson. Do not change it.

## 5. Scenes: `lessons/<topic>/scenes/NN_<chapter id>.js`

Read `lessons/engine/lib.js` (palette `C`, fonts `FD`/`FB`, helpers and art),
`lessons/engine/kit.js` (the shared lab kit: `beaker`, `testTube`, `flask`,
`bunsen`, circuit symbols `cellSym`/`bulbSym`/`switchSym`/`resistorSym`/`meterSym`,
`wire` with moving current dots, `magnet`, `sineWave`, `particleBox` for solids,
liquids and gases, `person` with `runPose`/`walkPose`, `sun`, `leaf`,
`labelLine`) and the reference scenes `lessons/respiration/scenes/00_intro.js`,
`02_aerobic.js`, `03_mito.js` and `09_investigate.js` before writing. Use the
kit wherever it fits, so equipment looks the same in every chapter.

```js
scene('<chapter id>', S => {
  const { at, end, mid } = S, root = S.root;   // at('line') start, end('line') end, mid('line', 0.4)
  // build every element once, inside root
  return t => { /* set attributes, opacity, transforms for chapter-local time t */ };
});
```

- `update(t)` is a pure function of chapter-local time: no state carried
  between frames, no `Math.random` (use `rng(seed)`), no timers, no elements
  created per frame. Hold the final state for any `t` beyond the chapter's end.
- Every line must have something on screen that matches what is being said at
  that moment; lines are not word-timed, so place beats by fraction of the line
  (`mid('line', 0.6)`). One main idea on screen per line; fade the previous beat
  as the next arrives.
- Stage 1200 × 750. Keep x < 560, y < 100 clear for the chapter tag. Labels
  ≥ 26 px, notes ≥ 24 px, titles 40–64 px; ≥ 30 px from the stage edges; no text
  overlapping text or art.
- The engine shows the chapter card for the first ~1.8 s and fades the scene
  in as the first line starts, so start the scene's own animation from
  `at('<first line>')`.
- Consistent palette: glucose amber hexagon, O₂ red atom pairs, CO₂ O=C=O,
  water red O + white H, energy yellow spark, heat orange waves, lactic acid
  pink, ethanol violet, plants green. Keep using lib art where it exists.
- Topic-specific helpers go in your own scene file. Only the scriptwriter may
  create `lessons/<topic>/lib.js`, before animation starts.
- Performance: no SVG filters (use `glow()` and `ball()` gradients), at most
  about 650 elements per scene, about 1 ms of script per frame. Tone idle
  motion down when `S.reduce`.

## 6. Checking scenes

```bash
S=<scratchpad>; T=<topic>; W=<your worker dir>
node --check lessons/$T/scenes/NN_id.js
python3 lessons/engine/build.py --topic $T --variant local --out $S/$W --fonts $S/fonts --only id1,id2
node lessons/engine/shot.js $S/$W/index.html $S/shots/$W id1 --cols 4 --name id1        # each line, 70% through
node lessons/engine/shot.js $S/$W/index.html $S/shots/$W "id1@3" --cols 4 --name id1t   # every 3 s
node lessons/engine/shot.js $S/$W/index.html $S/shots/$W "id1.line:0.2,id1.line:0.9"     # chosen moments
```

Read the contact sheets and fix what is wrong. "Fetch API cannot load file://"
and a missing narration file are expected; any other console message is a bug.
Done means every line's frame clearly shows what is being said, nothing
overlaps or is cut off, and the end of the chapter holds a clean final frame.

## 7. Delivery

Work only in your topic folder. The scriptwriter may also correct factual
errors in that topic's `lib/topics/<topic>.ts` and `lib/extras/<topic>.ts`. Do
not edit `lessons/engine/`, other topics, or app code, and do not commit; the
orchestrator reviews, builds and commits. Report in short: files written, one
line per beat, fact fixes, and anything you could not do or are unsure about.

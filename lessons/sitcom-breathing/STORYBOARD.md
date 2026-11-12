# LUNG HAUL, Episode 3 "Arrivals and Departures": storyboard

A mockumentary sitcom (a documentary crew films, characters talk to camera) that teaches Breathing & Gas Exchange.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Premise: Kavya's lungs are Lung International, the busiest airport in the body. The staff (her diaphragm, her
intercostal muscles, one of her alveoli) run it; the gases are the travellers. Read `script.py`: every line has
a speaker (`who`), and its caption shows the speaker's name.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'dennis'), mood, look })`.
  Everyone else on screen has `talk: 0`.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Dennis goes `deadpan` at every silly remark; Iggy `happy` (always); Alvi `happy`, `shock` when she is
  embarrassed; Ozzie `happy`/`shock`; Colin `smug`; Nigel stays `neutral` whatever happens (that is his joke);
  Smokey `smug`; Kavya `annoyed`/`deadpan`.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in (camera scale 1 → 1.06) on Dennis's deadpan face, Nigel blinking, Kavya staring at camera.
- **Talking heads** (line ids starting `th`, plus the lines marked TH below) use the confessional shot:
  `lhConf(root, kind)` full stage (tinted per character), the character big (s about 1.5) at about (430, 400),
  a prop or chip on the right (x 700-1100). The first time a character appears on screen, show
  `scLowerThird(root, ...LH_LOWER[kind])` for about 3 s. Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **Dennis's breathing:** whenever Dennis is on screen and not mid-joke, he quietly breathes: `flat: wave(t, 4)`
  (he contracts every 4 s, the real resting rhythm). Iggy breathes with him: `lift: wave(t, 4)`. In "run" both go
  at `wave(t, 1.5)` with `sweat: 1`.
- **Nigel is always somewhere.** In every set shot (terminal, departures, gates) Nigel drifts slowly through the
  background at s 0.5-0.7, unbothered, never reacting, never looking at anyone. Viewers should start spotting him.
- **Science on screen:** whenever a key word, number or equation is said, it appears big and clear (`lhChip`,
  a card, `lhSign`, or `lhBoard`). Subscripts are real (`lhRich(..., 'CO_2')`). Numbers exactly as said:
  21% / 16%, 0.04% / 4%, 78%, 70 m², 300–500 million. The jokes can be silly; the science must be exact.
- **Colours:** O₂ red pairs, CO₂ grey C with red O, N₂ blue pairs (`lhMol`), glucose amber, muscle red,
  alveoli pale pink, oxygen-poor blood dark red `LH.vein`, oxygen-rich bright red `LH.artery` (never blue blood).
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px; 30 px from the edges.

## Cast (lib.js `cast(root, kind, { s, mood })`)

| kind | who | look | lower third (`LH_LOWER`) |
| --- | --- | --- | --- |
| dennis | Dennis, the diaphragm: tired, sarcastic Head of Ground Operations; counts breaths; the straight man | red dome of muscle, yellow hard hat, hi-vis band, eye bags; `flat` 0..1 flattens him | DENNIS / Diaphragm. Head of Ground Operations. |
| iggy | Iggy, the intercostal muscles: gym bro, every day is rib day, "Up and OUT, baby!" | red striped muscle between two cream ribs, sweatband, flexing arms; `lift` raises the ribs | IGGY / Intercostal muscles. Lives between the ribs. |
| alvi | Alvi, one alveolus among 300–500 million: peppy, proud of her lanyard, keeps saying "moist" | pale pink sac on a bronchiole stalk, capillaries, lanyard badge; `sweat` = moist shine | ALVI / An alveolus. Gate 271,000,004. |
| ozzie | Ozzie, oxygen: first-time tourist, zero chill | two red atoms, one face, bucket hat, camera, backpack | OZZIE / Oxygen. First time in a lung. |
| colin | Colin, carbon dioxide: smug business-class flyer; "darling"; the brain watches HIM | O=C=O, sunglasses on head, purple cravat | COLIN / Carbon dioxide. Business class. |
| nigel | Nigel, nitrogen: 78% of the air, comes in and goes out unchanged, says one word all episode | two blue atoms, headphones, tiny mouth | NIGEL / Nitrogen. 78% of the air. Unchanged. |
| smokey | Smokey, tobacco smoke: shady visitor in a training video | lumpy grey-brown cloud, flat cap, thin moustache, tar stains | SMOKEY / Tobacco smoke. Not welcome. |
| kavya | Kavya, 12: exasperated, eating while she watches | `scKavya` bust; `scKavyaBody` + `runPose` for the run | KAVYA, 12 / Resting. Professionally. |

Sets: `lhLiving` (Kavya's HDB flat), `lhTerminal` (inside the lung), `lhExchange` (alveolus wall cross-section),
`lhConf(kind)` (confessional), `scTrack` (school field for the fitness test; add a "2.4 km" sign), `lhVHS` overlay
(the smoking training video). Props: `lhChest` (the breathing mechanism), `lhRouteMap`, `lhLining`, `lhCluster`,
`lhRBC`, `lhBoard`, `lhSign`, `lhBrain`, `lhMol`, `lhSnack`, `lhPlane`.

Running gags: Dennis's breath count; Kavya eating ("I'm literally eating right now"); Nigel in the background;
"Up and OUT, baby!"; lanyards; Colin's fame; Mitch (Ep 2's mitochondrion) never says hi; Larry (lactic acid).

## 0 cold: Cold open (card: none)
- kavya: `lhLiving`; Kavya (scKavya, s 1.35) slumped on the sofa at about (600, 470), mood deadpan, eyes on
  camera; a phone in her hand is optional. Chip top right "SATURDAY" (pops in), then "activity: none".
- resting: Kavya talks (deadpan, then annoyed on "lifestyle"); lower third KAVYA. A "34 °C" sun chip by the
  window on "thirty-four degrees"; the aircon's cold-air lines get a "❄ ON" chip. On "This is a lifestyle" she
  slides 12 px lower into the sofa.
- count: a documentary counter top right "BREATHS: 1 … 4" ticking up across the line; Kavya's chest (her group's
  y-scale) rises and falls on each count.
- inside: documentary zoom into the centre of her chest (camera push from k 1 to k 10 on her shirt); a dashed
  reticle; the viewfinder corners and a "ZOOM ×" readout. Fade through pink.
- airport: `lhTerminal`; a tiny `lhPlane` crosses the window; `lhSign` "TERMINAL 1 · LEFT LUNG" and
  "TERMINAL 2 · RIGHT LUNG" pop in on "two terminals"; chip "≈ 20 000 flights (breaths) a day". Small O₂
  travellers stream in from the left along the floor, CO₂ travellers out to the right. Nigel drifts across at s 0.5.
- hi (TH): Dennis confessional, `lhConf('dennis')`, Dennis s 1.5 at (430, 410), deadpan; lower third DENNIS;
  chip "**diaphragm**" right.
- floor: inset on the right: `lhChest` (s 0.55) with the diaphragm glowing and a label "diaphragm: a dome of muscle
  under the lungs"; Dennis looks right at it, then back at camera on "the floor", deadpan.
- every: Dennis flattens and domes on the words: "Contract." flat 1, "Relax." flat 0, twice; big chips
  "CONTRACT" (red) / "RELAX" (blue) swap in time.
- born: a framed certificate on the wall "12 YEARS' SERVICE · LUNCH BREAKS TAKEN: 0"; Dennis sad on "No lunch break".
- number: a big mechanical counter "87,600,012" beside him; Dennis deadpan, looking at it.
- thirteen: the counter rolls to "87,600,013" as Dennis flattens for one breath. Hold 1.0 s: deadpan stare at camera.
- title: logo "LUNG HAUL" (amber, a plane swooping round it) with "Episode 3: Arrivals and Departures" under it; the
  cast pops in below in a row, bobbing (Dennis, Iggy, Alvi, Ozzie, Colin, Kavya, Smokey; Nigel last, slightly late). Hold.

## 1 arrivals: Arrivals: the long way down
Layout: Ozzie's journey down the airway. `lhRouteMap` runs along the top (y about 150, x 100–1100, scaled
to fit) for the whole chapter; its marker advances one station per stop.
- batch: `lhTerminal` with an `lhBoard` "ARRIVALS" (rows: "OXYGEN · on time", "NITROGEN · on time"); a breath
  of air (O₂ and N₂ molecules) whooshes in from the left.
- ozzie: Ozzie bounces in, happy, camera flashing (a white flash circle); lower third OZZIE.
- thozzie (TH): Dennis confessional, deadpan; chip "O_2 = 2 oxygen atoms, 1 molecule".
- nose: a cartoon nose cross-section (hairs, warm orange glow, little water drops); three ticks pop in:
  "warms ✓", "moistens ✓", "filters ✓" (dust caught in the hairs). Route map marker on NOSE.
- spa: Ozzie in the nose with a tiny towel on his head, happy; Dennis inset deadpan.
- trachea: a long tube going down, ringed with C-shaped cartilage (draw the C open at the back); chip
  "**C-shaped rings of cartilage** keep it open". Marker on TRACHEA.
- goblet: `lhLining` full width; the goblet cells glow and label "goblet cells → **mucus**"; dust sticks in the mucus.
- cilia: the cilia beat (`rate` 1); label "ciliated cells: **cilia** sweep mucus up"; arrow "to the throat".
- thescal (TH): Dennis confessional; a sign `lhSign('MUCUS ESCALATOR', { arrow: 'up' })`; at the top of a little
  escalator drawing, a gulp (a mouth outline closing).
- eating: cut to Kavya on the sofa holding `lhSnack` (curry puff) mid-bite, frozen, annoyed, staring at camera. Hold.
- bronchi: the tube splits into two (Y shape); labels "bronchi" and, on one branch, "1 = bronchus". Marker on BRONCHI.
- bronchioles: branches keep splitting into a tree; label "bronchioles". Marker on BRONCHIOLES.
- maze: Ozzie spinning at a crossroads of `lhSign`s pointing everywhere ("THIS WAY", "ALSO THIS WAY"); shock.
- alveoli: the branch tips end in `lhCluster` bunches; label "**alveoli** (air sacs)" and "1 = alveolus". Marker on ALVEOLI.
- tbba (TH): Dennis confessional; the four words build as a vertical list with the initials big:
  **T**rachea, **B**ronchi, **B**ronchioles, **A**lveoli → "Tall Brontosaurs Breathe Air" with a little brontosaurus
  silhouette. Dennis deadpan on "I'm a muscle".
- nigel: Nigel drifts through the arrivals hall, headphones on, neutral, looking at nothing; lower third NIGEL.
  Everyone else (Ozzie) turns to look at him. Hold 1.2 s: he just blinks and keeps drifting.

## 2 ground: Ground operations
Layout: the "control room" under the lungs (dark red, warning stripes on the floor). The showpiece is
`lhChest` at s about 0.9, right of centre, breathing in and out with labels.
- vent: chip "**breathing** = **ventilation** = moving air in and out"; small crossed-out test tube "no chemistry".
- nomuscle: Dennis (left, s 1.1) beside `lhChest`; the lungs get a "NO MUSCLES" stamp.
- sponges (TH-like): the lungs squished like sponges (scale wobble); Dennis deadpan.
- iggy: Iggy bursts in from the right, flexing, happy; lower third IGGY.
- thiggy (TH): Dennis confessional, deadpan; a gym-style calendar where every day says "RIB DAY".
- rule: big diagram: a high-pressure box (crowded molecules) with an arrow to a low-pressure box (sparse);
  "gas moves from **high pressure** → **low pressure**".
- in: `lhChest.set(b → 1)` as Dennis says it; Dennis (inset, left) flattens (`flat: 1`); arrow down on the
  diaphragm; label "diaphragm **contracts** and **flattens**".
- up: Iggy (inset) lifts (`lift: 1`); the chest's ribs go up and out; labels "intercostal muscles **contract**",
  "ribs **up and out**". Iggy happy on "baby!".
- volume, rush: a 3-step chain builds under the chest: "volume ↑" → "pressure ↓" → "air pushed IN"
  (`lhChest.set(1, 1)`, the air arrow points in at the mouth).
- suck: cut to Kavya on the sofa, curious. Then the 1.2 s pause: hard cut to Dennis, slow push-in, deadpan.
- nobody: Dennis talks; a tiny diagram: the room gets bigger, outside air molecules push in.
- out: `lhChest.set(b → 0, -1)`; Dennis domes back up (`flat: 0`), Iggy relaxes (`lift: 0`); labels "muscles
  **relax**", "diaphragm domes up", "ribs **down and in**".
- outvol: the second chain: "volume ↓" → "pressure ↑" → "air pushed OUT".
- passive (TH): Dennis confessional, eyes half closed, blissful (`mood: 'happy'` on "favourite part").
- relax: Dennis fully relaxed, happy, dome up, a tiny "ahh"; hold 0.9 s.
- chain: both chains side by side, big: "volume ↑ pressure ↓ air IN" | "volume ↓ pressure ↑ air OUT".
- hand: Iggy holds up a hand drawn in marker: "IN = **CONTRACT**". Iggy happy, Dennis deadpan nod.

## 3 gates: Gate 271,000,004
- end: Ozzie arrives at the end of a bronchiole, `lhCluster` big; one sac lights up.
- alvi: Alvi (s 1.2) in the gate, happy, waving; a gate sign `lhSign('GATE 271,000,004')`; lower third ALVI.
- thalvi (TH): Alvi confessional (`lhConf('alvi')`); chip "300–500 million alveoli"; a fast zoom-out reveals
  a huge grid of identical tiny Alvis.
- all: every tiny Alvi holds up the same lanyard. Alvi's smile freezes (shock), hold 0.7 s.
- net: `lhCluster` with the capillary net highlighted; label "**capillaries**: the tiniest blood vessels".
- back: cut to `lhExchange`; in the capillary, blood labelled "back from the body: **low O_2, high CO_2**"
  (few red O₂, many CO₂); in the air side "**high O_2, low CO_2**".
- diffusion: chip "**diffusion**: high concentration → low concentration"; molecules start to drift across the
  thin walls (O₂ left → right, CO₂ right → left), slowly.
- off, whee: Ozzie (s 0.6) slides across the wall like a water-slide, happy; "O_2 → blood" arrow.
- rbc: an `lhRBC` taxi pulls up; Ozzie sits in one of its seats; label "red blood cell · **haemoglobin**".
- co2: CO₂ molecules cross the other way, "CO_2 → air (to be breathed out)".
- colin: Colin steps out of the blood, sunglasses down for a second, smug; lower third COLIN.
- pumps: Kavya (inset bust, top right) curious.
- nopump: Alvi happy; a pump icon with a big red cross; chip "**passive** · down the **concentration gradient**";
  a ramp graphic: "high" at the top, "low" at the bottom, molecules rolling down.
- steep: Dennis (inset) breathing; each breath brings fresh O₂ into the alveolus so the ramp stays steep;
  label "fresh air keeps the gradient **steep**".
- area: on "Why so fast?" a title card "ALVEOLI: BUILT FOR SPEED" flashes up, then a badminton court drawn in perspective, filling up with tiny sacs; chip "≈ 70 m² · a badminton court".
- thin: `lhExchange` close-up of the wall: two flat cells, a ruler "**one cell thick** + one cell thick = tiny distance".
- thdiet (TH): Alvi confessional, mildly offended (annoyed), holding her badge.
- moist: a film of water on the inside of the sac; O₂ dissolving into it (dots fading into the water);
  "gases **dissolve** first"; Alvi `sweat: 1`.
- stop: cut to Kavya, eating, deadpan, eyes closed. Hold.
- blood: the capillary flows faster; arrows carry the oxygen away; "rich blood supply → gradient stays steep".
- tims (TH): Dennis confessional; a 4-row card: **T** thin walls, **I** lots of blood **in** the capillaries,
  **M** moist lining, **S** big surface area (initials big and amber).
- three: three panels light in turn: "BREATHING moves air" (`lhChest`), "GAS EXCHANGE swaps gases" (`lhCluster`),
  "RESPIRATION in cells" (a muscle cell with a mitochondrion).
- eq: Ozzie rides the taxi into a muscle cell; whiteboard: **glucose + oxygen → carbon dioxide + water**
  (+ a yellow spark "energy released").
- mitch: a tiny orange mitochondrion (Mitch, from Ep 2, `mitochondrion` from the engine lib, with his tie) at a desk
  in the cell, does not look up. Dennis deadpan. Hold 0.7 s.

## 4 departures: Departures
- board: `lhTerminal`, departures side; an `lhBoard` "AIR IN vs AIR OUT" builds row by row through the chapter.
- oxygen: row "OXYGEN · in 21% · out 16%" (two bars, 21 and 16 long).
- plane: Colin, smug, beside a plane window where O₂ travellers are still sitting, asleep; chip "rescue breaths work".
- me: row "CARBON DIOXIDE · in 0.04% · out 4%" with "× 100" stamp; Colin poses (spotlight), "TRENDING ↑" chip.
- pure: Kavya bust (top right inset), curious.
- wish: Colin, sunglasses down, a pie chart of breathed-out air: a thin 4% slice labelled "Colin". Hold.
- vapour: row "WATER VAPOUR · low → high" (a cold window fogging up with a breath); row "TEMPERATURE · warmer".
- nitrogen: row "NITROGEN · in 78% · out 78% · UNCHANGED"; Nigel walks in one side and out the other, unchanged.
- thnigel (TH): Dennis confessional; behind him Nigel slowly drifts past the window. Hold 0.9 s.
- lime: two test tubes of **limewater** (clear); bubbles; the first goes **cloudy/milky**: "clear → cloudy = CO_2".
- carpet: Colin walks a red carpet between two test tubes; camera flashes; smug.
- proves: side by side: "breathed-out air: cloudy FAST" vs "room air: still clear", a stopwatch on each.

## 5 run: The fitness test
- monday: `scTrack`; a sign "FITNESS TEST · 2.4 km"; Kavya (`scKavyaBody`) at the start line, nervous; chip "34 °C".
- names: Kavya bust, annoyed, to camera; a clipboard (`scClipboard`) with "who designed this?" scribbled.
- faster: Kavya runs (`runPose`, track scrolls); cutaway to a leg muscle with sparks: "muscles **respire faster**".
- need: two meters: "oxygen needed ↑", "carbon dioxide made ↑".
- brain: `lhBrain` with its CO₂ gauge climbing into the red; signals (dashed arrows) shoot down to Dennis and Iggy:
  "breathe **faster** and **deeper**".
- thcolin (TH): Colin confessional, smug, a fake magazine cover "BRAIN'S MOST WATCHED".
- rate: control room alarms: Dennis flattening and doming fast (`flat: wave(t, 1.2)`), `sweat: 1`, shock;
  a gauge "breathing rate (breaths per minute) ↑".
- depth: Iggy, ecstatic, `lift` big and fast; a gauge "breathing depth ↑" (lungs inflating bigger in `lhChest`).
- heart: a beating heart with a bpm number climbing.
- done: finish line; Kavya flat on the grass, panting puffs; mood sad.
- debt: an invoice "OXYGEN DEBT: extra oxygen to break down **lactic acid**"; pink lactic acid dots in the muscle fade
  as oxygen arrives; Kavya still panting.
- larry: Dennis picks up a pink headband (Larry's, from Ep 2) off the floor, deadpan.
- recovery: graph "breaths per minute" vs time: rest → exercise (high) → recovery; two recovery curves, the fitter
  one dropping faster: "**recovery rate**".
- thagain (TH): Dennis confessional, sweating, deadpan; Iggy behind him doing star jumps. Hold.

## 6 smoke: Security training video
Whole chapter has the `lhVHS` overlay on (scanlines, PLAY, "SECURITY TRAINING · TAPE 3").
- drill: Dennis in front of a pull-down screen, holding a pointer; chip "Kavya: 12 · does not smoke".
- smokey: Smokey slides in (smug), a suitcase in hand with three luggage tags: TAR, CARBON MONOXIDE, NICOTINE;
  lower third SMOKEY.
- tar: brown sticky blobs ooze over `lhLining`; label "**tar**: sticky, coats the airways".
- cancer: a hazard label slaps on: "**carcinogen** = causes **cancer**".
- cilia: `lhLining.upd(t, 0, 1)`: cilia droop and stop, dust piles up; label "cilia paralysed → **smoker's cough**,
  chest infections".
- order: an "OUT OF ORDER" sign hung on the mucus escalator; Dennis deadpan.
- co: `lhRBC` taxis: CO molecules (`lhMol('CO')`) hop into the haemoglobin seats; label "**carbon monoxide** grabs
  haemoglobin".
- seats: Ozzie and other O₂ left standing at the kerb, shock; a gauge "oxygen carried ↓".
- nicotine: Smokey leans in close to camera, smug; tag "**nicotine** = **addictive**"; a chain-and-padlock icon.
- selling: Dennis deadpan. Hold 0.5 s. (Keep the three luggage tags lined up on screen behind him: **C**arbon monoxide,
  **C**ancer-causing tar, **T**obacco's nicotine, "Cigarettes Cause Trouble" as a small caption.)
- emph: `lhCluster` healthy (left) beside `lhCluster({ emph: true })` (right); the walls between sacs break and
  merge; label "**emphysema**: fewer, bigger sacs".
- area: Alvi, sad, holding a shrinking "surface area" bar; "breathless, even at rest".
- cancers: two stamps: "**lung cancer**", "**bronchitis**".
- escort: Smokey, annoyed, carried out by two security O₂ in caps; the tape ejects (VHS overlay off). Hold.

## 7 traps: The staff save you some marks
- intro: `lhTerminal` at night (darker), heading "6 EXAM TRAPS" on an `lhBoard`.
- t1–t6: quick confessional cuts, one per speaker (Dennis, Iggy, Kavya, Alvi, Colin, Ozzie), each with its trap on a
  card: 1 breathing ≠ respiration; 2 breathing IN: diaphragm and intercostals **contract**; 3 air is pushed in because
  the chest **pressure** falls (lungs don't suck); 4 oxygen enters the blood by **diffusion** (not pumped);
  5 breathed-out air: still about **16% O_2**, only about **4% CO_2** (not pure CO₂); 6 limewater: clear → **cloudy** with CO₂
  (it does not "go clear").
  Kavya's card gets a gold star (she listened).
- water: Ozzie's confessional is on a video call (`scVideoCall`) from a muscle cell; on "half of me" the call shows
  two water molecules (`molH2O`), each oxygen wearing half of his bucket hat, both happy.
- return: the logo returns: "LUNG HAUL will return… in about 4 seconds" with a breath counter ticking.
- anything, no, unchanged (stinger): Nigel's first confessional (`lhConf('nigel')`); long silence while he blinks;
  "No." (tiny mouth); cut to Dennis, deadpan, "Unchanged." Final frame: Nigel drifting out of shot, logo.

## Suggested split for animators
- A: cold (done), arrivals, ground (the airway journey and the breathing mechanism; `lhChest` showpiece).
- B: gates, departures (diffusion, adaptations, air in vs out, limewater).
- C: run, smoke, traps (exercise, smoking with the VHS overlay, the trap cuts and the stinger).

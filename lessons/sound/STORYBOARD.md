# Sound: storyboard

14 chapters, 130 lines. Each bullet is what the screen shows while that line is
spoken; the previous beat fades as the next one arrives. **Showpiece** marks the
moment each chapter builds towards.

## Shared look (use in every chapter, so the lesson looks like one piece)

- **Air particles**: circles r = 9, `ball(C.air, '#4E8FB8')`, rest spacing
  34 px. In a sound wave each particle sits at `x0 + A·sin(k·x0 − ω·t)` with
  A ≤ 10 px (so neighbours never cross) and about 10 particles per wavelength.
  Compressions and rarefactions then appear and travel outward by themselves,
  and every particle only jiggles **along** the direction of travel. One
  particle can be picked out in `C.energy` with a small tick under its rest
  position.
- **Loudspeaker**: dark box with a grey cone facing right; the cone moves in
  and out **horizontally** (never up and down).
- **Traces and wave graphs**: kit `sineWave` (colour `C.good` on an oscilloscope
  screen, `C.air` elsewhere), always on a dashed rest line. Keep the time
  window fixed: **higher frequency = more waves in the same width, same height;
  louder = taller, same spacing.** Amplitude is always marked from the **rest
  line to a crest**, never crest to trough. One wavelength is crest to the next
  crest (or compression to the next compression).
- **Oscilloscope**: rounded dark-green screen (fill `#06140F`, grid lines
  `C.line` at 40%), with the trace drawn by kit `sineWave`.
- **Frequency line** (ear, echo, infra, recap, quiz): a log axis, equal steps
  for ×10 (2, 20, 200, 2,000, 20,000, 200,000 Hz). Zones: infrasound below
  20 Hz in `C.heat` (orange), hearing range 20–20,000 Hz in `C.good` (green),
  ultrasound above 20,000 Hz in `C.ethanol` (violet). Build it once per scene
  with the same proportions everywhere.
- **Light** is `C.energy` yellow (rays, flashes, radio waves); **sound** arcs and
  pulses are `C.air`; ultrasound pulses `C.ethanol`; infrasound `C.heat`.
- Vibrations are drawn **slowed down** to a visible 4–10 wobbles a second, with
  faint ghost copies at the two extremes. Real frequencies are far higher; no
  label should claim the drawn rate is the real one.
- Lib art to reuse: `arrow`, `chip`, `card`, `tick`, `cross`, `strike`, `meter`
  (a "sound" loudness gauge), `bolt` (lightning), `spark` (energy), `thermometer`,
  `ring` (quiz countdown), `glow`, `ball`. Kit art: `sineWave`, `particleBox`,
  `person`, `wire` (signal dots), `labelLine`.

## intro: The silent explosion

Full-stage starfield, then a row of air particles, then a four-step roadmap.
New art: an exploding star (expanding glowing shell, no sound arcs).

- `hook`: A bright star swells and bursts into an expanding orange-yellow shell
  of glowing debris. A small lib `meter` labelled "sound" sits beside it and
  stays at **zero** throughout. No sound arcs anywhere. **Showpiece.**
- `why`: The shell fades to a nebula; two chips face each other, "the loudest
  event" and "total silence", with a big "?" between them.
- `def`: The stars dim; a single row of air particles spans the stage. A
  vibrating prong at the left nudges the first particle and the nudge is passed
  particle to particle to an ear on the right. Label: "sound = a vibration,
  passed on".
- `plan`: Four icon chips pop in left to right: a travelling pulse ("how it
  travels"), a fast and a slow wave ("high or low"), a tall and a short wave
  ("loud or quiet"), a bat with violet pulses ("sounds we can't hear").

## vibrate: Sound is made by vibrations

A central stage where each source appears in turn, each with a dashed rest line
and ghosted extremes. New art: guitar string between two fixed ends, drum with
stick, head-and-throat profile with vocal cords inset, loudspeaker, ruler
clamped on a desk edge, bell with hammer, hand.

- `start`: The word "vibrating" with its letters jittering; faint icons of the
  sources orbit it.
- `vibrate`: One dot moves back and forth about a dashed "fixed position" line,
  with a two-headed arrow "back and forth". A yellow `spark` is given off:
  "energy".
- `string`: A plucked guitar string bows up and down past its rest line between
  two fixed ends.
- `drum`: A stick hits a drum; the skin flexes up and down.
- `voice`: A head-and-throat profile; an inset of the throat shows two flaps
  (the vocal cords) vibrating. Fingertips on the throat, with small buzz marks.
- `speaker`: A loudspeaker; its cone moves in and out (horizontally), nudging a
  few air particles in front of it.
- `ruler`: A ruler clamped to a desk edge; the overhanging end blurs up and down
  as a fan of ghost positions; buzz marks.
- `stop`: A ringing bell with vibration marks and a `meter` reading high. A
  finger presses on the bell: the marks vanish and the meter drops to zero
  together. **Showpiece.**
- `source`: The five sources sit in a ring around a chip "vibration: the source
  of all sound"; a small magnifier over one hints "even when too small to see".

## wave: Sound travels as a wave

Loudspeaker at the left, a field of air particles (5 rows × about 28 columns,
the shared look above), an ear at the right. Kit `particleBox` (solid, liquid,
gas) and kit `person` for the people model. New art: cup-and-string telephone,
bowl with cling film and rice, baking tray and wooden spoon.

- `knock`: The cone pushes forward once and nudges the first column of
  particles.
- `pass`: The nudge passes column to column, then the cone keeps vibrating and
  a train of compressions travels right. Label "sound wave" and an arrow "wave
  travels →".
- `medium`: Label "medium" over the field; three small `particleBox` panels pop
  in below (solid, liquid, gas). Then a cup-and-string telephone: two cups and a
  taut string, labelled "the string is the medium".
- `one`: One particle turns yellow, with a tick marking its rest position. It
  moves back and forth around the tick as compressions sweep past, and ends
  where it started. A short trail shows its path is only a short back-and-forth
  stroke. **Showpiece.**
- `energy`: A singer (kit `person`) at the left, a listener at the right. The
  particles between them only jiggle in place while a yellow glow (the energy)
  runs through them to the listener's ear. Chips: "air flows to your ear"
  struck out; "energy travels" ticked.
- `long`: Back on the field: a two-headed arrow "particles vibrate ↔" and an
  arrow "wave travels →", both horizontal and parallel. Label "longitudinal".
- `comp`: The field pauses: brackets over the bunched regions, "compression:
  squeezed together", and over the gaps, "rarefaction: spread out". It
  resumes, and the labels ride outward with the pattern.
- `line`: A row of eight kit `person` figures shoulder to shoulder. The first is
  shoved; a lean passes down the line, each person tipping and recovering.
  Footprint marks show nobody leaves their spot.
- `rice`: A bowl with stretched cling film and rice grains; a spoon strikes a
  baking tray nearby (not touching the bowl). Sound arcs cross the gap, the film
  ripples, and the grains jump.

## vacuum: Sound can't cross a vacuum

The bell-jar apparatus centre stage: a glass dome on a base, an electric bell
hanging from the top on a wire (clear gap all round), a pipe to a vacuum pump at
the right, air particles inside, a `meter` "loudness" beside it, an ear and an
eye outside. New art: bell jar and pump, film-strip frame, two astronauts (kit
`person` in white with helmet circles).

- `need`: A particle row passes a pulse along, then hits a stretch with no
  particles: the pulse stops dead. Chip "no particles, no sound".
- `vacuum`: An empty dark box with a few stars, labelled "vacuum: no particles,
  like outer space".
- `jar`: The bell jar builds. The hammer strikes, sound arcs leave the jar to
  the ear, the meter reads high. Label "not touching the sides" with a leader to
  the gap.
- `pump`: The pump runs; particles stream out through the pipe and thin out
  inside. The arcs outside shrink and fade and the meter falls, while the hammer
  keeps striking. **Showpiece.**
- `see`: Two or three particles left; the meter near zero. Yellow light rays
  still pass from the bell through the glass to the eye, which gets a tick.
- `back`: A valve opens; particles flood back in; the arcs and the meter return.
- `proves`: Two chips: "sound needs a medium" (ear icon) and "light doesn't"
  (eye and yellow ray), each ticked.
- `space`: A film-strip frame shows a space battle with a big "BOOM!"; the word
  is struck out and the explosion plays silently, its light still reaching the
  viewer. Chip "silent, but light gets through".
- `radio`: Two astronauts face each other in space; a speech bubble is crossed
  out; yellow radio-wave arcs pass between their helmet antennas.
- `aware`: Mnemonic card "No air, no aware": an air-particle icon struck out,
  then "no medium, no sound".

## speed: The speed of sound

A three-lane race (air, water, steel), then a storm landscape. Speeds **to
scale**, 340 : 1,500 : 5,000: if the steel pulse crosses an 800 px lane in 2 s,
the water pulse covers 240 px and the air pulse 54 px in the same time. New art:
stopwatch, 1 km distance bar, storm cloud over a far hill, house with an
observer, whip.

- `time`: A stopwatch and a distance bar marked 0 to 1 km: a sound arc crosses
  the bar while the stopwatch ticks to 3 s. Label "330–340 m/s".
- `depends`: Three kit `particleBox` panels: gas (far apart), liquid (close,
  jumbled), solid (packed). A highlight hops particle to particle in each,
  fastest where they are packed.
- `gas`: Lane 1, "air (gas)": its pulse sets off, slowly.
- `liquid`: Lane 2, "water (liquid)": the pulse runs about 4.4 times faster
  than in the air lane. Label "about 1,500 m/s".
- `solid`: Lane 3, "steel (solid)": the pulse runs about 15 times faster than
  in air and wins easily. Label "about 5,000 m/s". Then all three replay
  together from the same start, to scale. **Showpiece.**
- `solids`: Card "fastest in air?" with a cross, then "slowest in air" with a
  tick; mnemonic chip "Solids Speed, Gases Go slow".
- `light`: A yellow light arrow and a blue sound arrow leave together: the light
  is across the stage at once, while the sound has barely moved. Label "nearly
  a million times faster". Do not draw a linear bar chart of the two speeds.
- `storm`: The storm landscape: lightning (lib `bolt`) flashes over the far
  hill; the flash reaches the observer at once; the thunder's sound front
  crawls across the ground towards them.
- `count`: Ground markers at 1 km and 2 km; a counter "1, 2, 3..." ticks as the
  sound front moves, reaching the 1 km marker at about 3; the rule "seconds ÷ 3 =
  km".
- `six`: The counter reaches 6 as the front reaches the observer, 2 km away:
  "6 ÷ 3 = 2 km".
- `warm`: Two lib `thermometer`s, warm and cold, each with a speed arrow; the
  warm one only slightly longer (about 5%). Label "340 m/s: a typical value".
- `whip`: A whip cracks; its tip outruns a sound arc, and a tiny V-shaped boom
  trails from the tip. Label "tip faster than sound".

## pitch: Pitch and loudness

A source icon at the left and a large trace panel at the right (kit `sineWave`,
fixed time window), later a 2×2 grid. New art: whistle, small bird, bass drum,
big dog, guitar neck with one string, tuning peg, finger.

- `two`: Two chips, "pitch" and "loudness", each with a dial; a vibrating
  source between them.
- `pitch`: A trace with a bracket marking a 1-second window and a counter
  ticking over the complete waves inside it. Label "frequency: complete waves
  each second".
- `hertz`: The counter result becomes "4 waves a second = 4 Hz", then a single
  dot vibrating once a second shows "1 Hz = one vibration per second".
- `high`: A trace with many closely spaced waves; whistle and small bird icons.
  Label "high frequency → high pitch".
- `low`: A trace with few, widely spaced waves at the **same height**; bass drum
  and big dog icons. Label "low frequency → low pitch".
- `loud`: A dashed rest line and an arrow from it to the top of one crest,
  labelled "amplitude: rest position → furthest point".
- `big`: Two traces with the **same spacing**: a tall one (speaker with big arcs,
  "loud") and a short one (small arcs, "quiet").
- `fast`: Mnemonic card "Fast Pitch, Big Bang": F links to frequency and pitch,
  B to amplitude and a loud bang.
- `indep`: A 2×2 grid: columns "low" and "high" (frequency), rows "quiet" and
  "loud" (amplitude). Each trace differs from its neighbours in only one way.
  Chip "higher ≠ louder". **Showpiece.**
- `guitar`: A guitar string with its trace beside it. In turn: the peg tightens,
  a finger presses a fret (a shorter vibrating length), then a thinner string.
  Each time the trace packs in more waves at the same height.
- `harder`: The finger plucks harder: the string's swing widens and the trace
  grows taller, with the spacing unchanged.

## scope: Seeing sound on an oscilloscope

A speaker at the left sends arcs to a microphone; a kit `wire` with moving dots
carries the signal to an oscilloscope on the right (the shared screen look).
New art: microphone, oscilloscope with screen and grid.

- `mic`: Arcs reach the microphone; its diaphragm vibrates; dots flow along the
  wire. Label "electrical signal".
- `scope`: The screen lights and a green trace draws itself from left to right.
  Label "trace".
- `spacing`: The trace switches between close-packed and spread-out waves, with
  a bracket between two peaks: "close = high pitch", "spread = low pitch".
- `height`: An arrow from the rest line to a peak: "tall = loud", "short =
  quiet".
- `louder`: The trace grows smoothly taller. Small dots on the peaks keep their
  sideways positions: "spacing the same".
- `higher`: The trace squeezes in more waves across the same screen; two dashed
  lines at the top and bottom of the waves stay put: "height the same".
  **Showpiece.**
- `try`: Two screens side by side: A (tall, far apart) and B (short, close
  together). A lib `ring` counts down through the pause.
- `answer`: Chips appear under each: A "loud, low pitch"; B "quiet, high pitch".
- `words`: Exam card: "loudness → amplitude" and "pitch → frequency (wave
  spacing)", each ticked; vague words like "bigger" and "wavier" are struck
  out.

## ear: The ear and hearing range

A large cross-section of the ear (pinna, ear canal, ear drum, three tiny bones,
cochlea, nerve to a brain icon) on the left two-thirds, labelled with kit
`labelLine`; then the shared frequency line. New art: ear cross-section, brain
icon, dog, dog whistle, ear defenders, headphones with a volume slider, a loud
machine (pneumatic drill).

- `ear`: The cross-section fades in; sound arcs approach from the left.
- `pinna`: The pinna glows; the arcs are funnelled into the ear canal.
- `drum`: The ear drum glows and flexes in and out.
- `bones`: The three tiny bones rock in turn, passing the movement to the
  cochlea, a coiled tube with fluid inside.
- `nerve`: The fluid ripples, the sensitive cells flicker, and yellow pulses
  run along the nerve to the brain, which lights up. **Showpiece**: the whole
  journey reads as one travelling highlight, pinna to brain.
- `range`: The frequency line slides in; the green hearing band grows from
  20 Hz to 20,000 Hz. Label "hearing range".
- `twenty`: Chips "20" and "20k" at the two ends of the band; "k = thousand".
- `whistle`: A dog whistle sends violet arcs; a marker on the line at
  25,000 Hz sits just beyond the green band. The dog's ears prick up (tick); the
  person hears nothing. Chip "still real sound".
- `age`: The top end of the green band slides back a little as an age counter
  rises. Label "normal".
- `damage`: Inside the cochlea, huge-amplitude waves arrive; some of the tiny
  cells bend and turn grey. A warning triangle.
- `protect`: Ear defenders settle over an ear beside a loud drill; a headphone
  volume slider slides down.

## echo: Echoes and ultrasound

A cliff scene, then two rooms, then the frequency line, a scan, a cleaning
bath, and a ship at sea with a depth scale. Ultrasound pulses are short violet
packets of closely spaced arcs. New art: cliff, shouting person (kit `person`),
bare and furnished rooms, ultrasound probe and fan-shaped scan image, cleaning
bath with a ring and glasses, ship, submarine, sea floor, stopwatch, bat and
moth, dolphin.

- `reflect`: A person shouts at a cliff; the arcs hit the cliff and bounce back.
- `echo`: The reflected arcs reach the person a moment later. A small timeline
  shows the shout and the later echo. Label "echo".
- `absorb`: Split screen: in a bare room the arcs bounce around again and
  again; in a furnished room (curtains, carpet, sofa) they fade into the soft
  surfaces.
- `ultra`: The frequency line; the violet zone above 20,000 Hz lights up,
  labelled "ultrasound", with an ear and a cross.
- `scan`: A probe on a pregnant belly sends violet pulses in; echoes return
  from boundaries inside; a grey fan-shaped image builds up into a baby's
  outline. Chip "no harmful radiation".
- `clean`: A bath of liquid with a ring and a pair of glasses; violet waves
  shake the liquid and specks of dirt lift off.
- `sonar`: A ship and a submarine send violet pings down to the sea floor; the
  echoes come back up. Chip "speed known → time gives distance".
- `ship`: The ship sends one pulse straight down. A stopwatch runs: the pulse
  reaches the floor at 2 s and returns at 4 s. Label "in water: about 1,500
  m/s". The scene holds during the pause.
- `halve`: The sum builds: 1,500 × 4 = 6,000 m, drawn as a down arrow plus an up
  arrow. "There and back" → "cut in half, ÷ 2" → a single depth arrow, 3,000 m, on a depth
  scale. **Showpiece.**
- `bats`: Night sky: a bat sends violet pulses that bounce off a moth and
  return; beside it, a dolphin does the same in murky water. Label
  "echolocation".

## measure: Wavelength, frequency and speed

A particle strip (shared look) above a large kit `sineWave` graph, with brackets,
then a marker post and a stopwatch, then formula cards. If the strip and the
graph are lined up, the graph must be labelled as **pressure** (compressions
line up with crests); otherwise show them separately. New art: marker post,
distance bar "340 m", magnifier.

- `measure`: Two recap chips, "frequency" and "amplitude", from earlier
  chapters; the wave graph fades in.
- `length`: On the particle strip, a bracket from one compression to the next:
  "one wavelength". The same bracket appears on the wave graph, crest to next
  crest. Unit "metres (m)".
- `lambda`: A large λ replaces the word on the bracket.
- `period`: A marker post with the wave moving past it and a stopwatch: one
  complete wave passes; label "time period T", "seconds (s)".
- `five`: In one second, 5 waves pass the post (a counter ticks to 5); each
  takes 0.2 s, shown as "1/5 s"; chip "5 Hz".
- `formula`: Formula card "T = 1 ÷ f", with "f = 5 Hz → T = 1/5 s" beneath.
- `equation`: Formula card "speed = frequency × wavelength", the three words
  colour-matched to the earlier chips.
- `metre`: A speaker sends out waves for one second; the first wave reaches a
  "340 m" marker; a counter shows 340 waves filling the distance; a magnifier on
  one wave reads "1 m".
- `shorter`: Two speakers, one low note and one high note. Their wave fronts
  travel side by side at the **same speed** (fronts stay level), but the high
  note's waves are packed closer: "higher frequency → shorter wavelength".
  **Showpiece.**

## kinds: Longitudinal and transverse waves

Two lanes: top, a slinky spring pushed by a hand (longitudinal); bottom, a rope
flicked by a hand (transverse). Each has a "wave travels →" arrow. New art:
slinky, rope with a red ribbon, hands, torch beam, pond ripples.

- `families`: Both lanes appear still, each with a "wave travels →" arrow and a
  "vibration?" tag.
- `long`: The slinky's coils bunch and spread as the pattern travels right; one
  painted coil moves ↔, parallel to the travel arrow. Labels "compressions",
  "rarefactions".
- `slinky`: The hand pushes and pulls; chip "sound is longitudinal" with a
  speaker icon.
- `trans`: The rope lane: a painted point moves ↕, with a right-angle mark
  between its arrow and the travel arrow.
- `rope`: The hand flicks; the red ribbon only moves up and down while the
  wobble runs along. Labels "crest" and "trough". **Showpiece**: the ribbon and
  the painted coil both stay in place as the waves pass, one moving across, one
  along.
- `light`: Icons: a torch beam drawn as a transverse wave, an
  electromagnetic-spectrum strip, and pond ripples seen from the side with
  crests and troughs.
- `key`: Comparison card: "longitudinal: along ↔ (sound)", "transverse: across ↕
  (light, water ripples)". A yellow energy spark runs along both lanes while
  the coil and the ribbon stay put: "energy moves, material doesn't".

## infra: Infrasound: below our hearing

The shared frequency line along the bottom, with illustrations above the orange
infrasound zone. Infrasound waves are slow, long, low arcs. New art: two
elephants and ground vibration lines, whale, volcano, earthquake crack,
detector station with a trace, dog and birds.

- `below`: The orange zone below 20 Hz lights up: "infrasound: too low to hear".
- `elephant`: An elephant sends long, slow orange rumbles across a wide
  plain (a "kilometres" marker) to a distant herd; vibration lines run through
  the ground into the far elephant's feet. **Showpiece.**
- `whale`: A whale under the sea; long, slow arcs spread across a wide ocean.
- `quake`: A volcano erupts and a crack opens; orange waves reach a detector
  station whose trace jumps; a warning icon.
- `animals`: A dog and some birds react (ears up, birds take off) ahead of an
  "earthquake" label; a small "maybe" chip keeps it tentative.
- `slice`: The whole frequency line: orange infrasound, the green slice we hear,
  violet ultrasound. The green band is highlighted: "just a slice".

## recap: Recap: memory hooks and exam traps

As in Respiration: a padlock clicks shut, four memory-hook cards build a 2×2
grid, then five traps, each with the wrong idea struck out and the right idea
ticked, with a small picture.

- `lock`: A padlock clicks shut.
- `fast`: Card 1, "Fast Pitch, Big Bang": a many-wave trace by "pitch" and a tall
  trace by "bang".
- `aware`: Card 2, "No air, no aware": a mini bell jar.
- `solids`: Card 3, "Solids Speed, Gases Go slow": three mini lanes, to scale.
- `twenty`: Card 4, "20 to 20k": the mini green hearing band. The 2×2 grid is
  complete. **Showpiece.**
- `traps`: The cards shrink away; title "5 exam traps".
- `t1`: "Sound travels through space" struck out; "no particles, no sound"
  ticked, with the silent star.
- `t2`: "Pitch = amplitude" struck out; "pitch → frequency, loudness →
  amplitude" ticked.
- `t3`: "Particles travel with the wave" struck out; "particles vibrate, energy
  travels" ticked, with the yellow particle jiggling.
- `t4`: "Sound ≈ the speed of light" struck out; "340 m/s vs 300,000,000 m/s"
  ticked, with lightning and thunder.
- `t5`: "Depth = speed × time" struck out; "there and back: cut it in half" ticked,
  with a sonar ping.

## quiz: Quick-fire quiz

As in Respiration: five question cards; a lib `ring` runs through each 4 s
pause; the answer appears with a small picture and a progress dot fills.

- `intro`: Title card "Quick-fire quiz!" and five empty progress dots.
- `q1`: Question card. `a1`: an empty jar with "no particles".
- `q2`: Question card. `a2`: a trace growing taller, spacing unchanged.
- `q3`: Question card. `a3`: the steel lane winning the race.
- `q4`: Question card. `a4`: the frequency line with the violet zone lit.
- `q5`: Question card. `a5`: lightning over a hill marked "1 km".
- `outro`: "Brilliant work!" with a burst of sparks. **Showpiece.**

## Suggested split for the animators

Grouped so chapters that share art stay together; durations are from the
narration timeline.

| Group | Chapters | Length | Notes |
| --- | --- | --- | --- |
| A | intro (26 s), vibrate (51 s), wave (78 s) | 2 min 34 s | Sets the air-particle and loudspeaker look; the `wave` chapter is the hardest scene |
| B | vacuum (63 s), speed (84 s) | 2 min 27 s | Bell jar and pump, the to-scale race, the storm; short but busy |
| C | pitch (73 s), scope (67 s), kinds (54 s) | 3 min 13 s | All kit `sineWave` traces; one shared trace panel |
| D | ear (70 s), echo (84 s), infra (46 s) | 3 min 20 s | Shares the frequency line; ear anatomy and the sonar sum |
| E | measure (64 s), recap (53 s), quiz (68 s) | 3 min 05 s | Formula cards, then templated recap and quiz (copy mini art from A–D) |

# PASS IT ON, Claude Sitcom Ep 11 "Bar Forty-Seven": storyboard

A mockumentary sitcom (a documentary crew films; characters talk to camera) that teaches Sound.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

**Premise.** Kavya (12) is at school band practice in a hot school hall. She plays the triangle: forty-six
bars of rests, then one ding, in bar forty-seven. The documentary is really about the air between her
triangle and everybody's ears, where Nigel, a tired nitrogen molecule, works in "sound delivery" without
ever going anywhere: he passes it on. Running gags: Nigel "doesn't go anywhere"; Archie the trainee gets
everything enthusiastically wrong, then right; Belle the school bell is never welcome; Freq is fast and
squeaky, Amp is LOUD; Echo, the hall's tiled back wall, only ever repeats the end of the last line, and in
the stinger she steals Kavya's one big moment.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame, for every visible character:
  `c.set({ t, talk: scTalk(S, t, '<who>'), mood, look })`. Echo is `'echo'`; Kavya is `'kavya'`.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Nigel goes `deadpan` at every Archie line and `annoyed` at the loudspeaker and Amp; Archie is `happy`
  (and `bounce: 1` when excited), then `shock` when corrected; Belle is `sad` until the class cheers; Freq is
  `happy` with `buzz: 1` while talking; Amp is `neutral`/`smug`, `sad` on "SORRY"; Coco is brisk `neutral`,
  `annoyed` at loud noise; Echo is `deadpan` always, `ghost: 1` while she speaks; Kavya is `deadpan` or `annoyed`.
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence: hold the reaction there (a slow
  push-in on Nigel's deadpan face, Echo blinking, Belle's lip wobbling, Kavya staring at the camera).
- **Echo's lines** (`echo`, `echo2`, `mmf`, stinger): cut (or whip-pan) to the hall's back wall; Echo's face is
  on the tiles, `ghost: 1` so faint copies of her outline ripple outward. Her caption words also appear as a
  fading, slightly offset "double" text near her (a visual echo). Whoever she repeated stares at the wall.
- **Talking heads** (line ids starting `th`, plus those marked TH below) use the confessional shot:
  `pioConf(root, kind)` full stage, the character big (s about 1.5) at about (430, 400), a prop where it helps.
  The first time a character appears in a confessional or speaks on screen, show
  `scLowerThird(root, NAME, ROLE)` for about 3 s. Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **Science on screen:** whenever a key word, number or equation is said, it appears big and clear (chip, card
  or whiteboard). Numbers with units exactly as captioned (340 m/s, 1,500 m/s, 5,000 m/s, 300,000,000 m/s,
  20 Hz, 20,000 Hz). λ for wavelength, T = 1 ÷ f, speed = frequency × wavelength. The jokes can be silly; the
  science must be exact. In every particle picture, the particles **vibrate about fixed positions** and the
  bunching travels: never let a particle drift across the screen with the wave.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Nothing in the bottom
  caption strip.

## Cast (lib.js `cast(parent, kind, { s, mood })`, about 200 px tall at s = 1)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| nigel | Nigel, a nitrogen molecule (N₂): tired, sarcastic, the expert straight man. "I pass it on." | blue peanut (two fused N atoms), navy courier cap with a sound-wave badge | NIGEL / Nitrogen. Air particle. Doesn't go anywhere. |
| archie | Archie, an argon atom: over-keen trainee, gets it wrong first | teal ball, spiky fringe, yellow TRAINEE badge; `bounce` | ARCHIE / Argon. Trainee. First day. |
| belle | Belle, the electric school bell: mopey, unloved | red gong dome, hammer on the right; `ring` | BELLE / School bell. Ends recess. Unloved. |
| freq | Freq, frequency: hyper, fast, squeaky; bubble tea | lime capsule, zigzag belly stripe, spring antenna; `buzz` | FREQ / Frequency. Vibrations per second. |
| amp | Amp, amplitude: huge, LOUD, kind | coral one-hump wave with a ↕ arrow on his front; `big` | AMP / Amplitude. Size of the vibration. |
| coco | Coco, the cochlea: brisk front-desk receptionist | pink spiral shell with a headset | COCO / Cochlea. Front desk, inner ear. |
| echo | Echo, the hall's tiled back wall: deadpan, only repeats | tiled panel with a face; `ghost` | ECHO / The back wall. Hard. Flat. Repeats things. |
| kavya | Kavya, 12, the human: exasperated | `scKavya` bust (PE shirt "8"); full body `scKavyaBody` | KAVYA, 12 / Triangle. Bar 47. |

Sets and props (lib.js): `pioHall` (school hall, fans, stage curtains, Echo's tiled wall at `g.wall`),
`pioAir` (inside the air, microscopic), `pioLab` (science lab), `pioJar` (bell jar + vacuum pump),
`pioStorm` (storm over HDB blocks through a window), `pioSea` (sonar), `pioTriangle` (the triangle, beater,
gripping hand), `pioRow` (a longitudinal wave of particles, with a red-ringed particle to watch and
`compAt` for compression labels), `pioScope` (oscilloscope with `trace`), `pioEar` (ear cross-section with
`hi` and `wave`), `pioCurtains`, `pioBubbleTea`, `pioSheet` (the bar-47 sheet music). Kit art to reuse:
`particleBox` (solid/liquid/gas), `person`/`runPose` (stadium-wave crowd), `sineWave`, `arrow`, `chip`, `card`.

## 0 cold: Cold open (card: none)
- kavya: `pioHall` (fans turning). Kavya (bust, s 1.3) front right holding `pioTriangle` up beside her, mood
  deadpan, eyes on camera. Chips pop in: "Kavya, 12", then "school band", then a big "TRIANGLE" chip on "triangle".
- bars: Kavya talks, annoyed. `pioSheet` slides in at the top: bars 41–46 of rests, bar 47 with one note,
  circled in red on "Bar forty-seven". Lower third KAVYA, 12 / Triangle. Bar 47.
- hall: wide shot of the hall: band members (simple silhouettes with drum kit and music stands) on the stage;
  a "34 °C" thermometer chip; the ceiling fans spin; Kavya fans herself with the sheet music.
- small: documentary zoom (viewfinder corners, "ZOOM ×1" counter) on the air between the triangle and a
  listener's ear: a reticle, then the picture dissolves into `pioAir`.
- this: a field of tiny blue air particles jiggling in place ("air particles" label; "ZOOM ×1 000 000");
  the camera zooms onto one particle: it is Nigel, who looks up, unimpressed.
- hi (TH): Nigel's confessional, deadpan; lower third NIGEL. Chip "nitrogen molecule (N₂)".
- percent: a pie chart of the air: 78% nitrogen (blue, huge), 21% oxygen (red), 1% argon and others (teal
  sliver). Nigel annoyed at the oxygen slice, which has a little spotlight on it.
- job: three delivery tickets fly in: a drum, a "DING!" triangle, a speech bubble "Kavya, focus!".
- go: Nigel shakes his head on "I don't"; a small row of particles beside him passes a bump along while
  Nigel just wobbles on the spot (a dashed "home" circle under him); chip "pass it on".
- echo: hard cut to the hall's tiled back wall: Echo's face, `ghost: 1`, deadpan, "...pass it on." as fading
  double text. Lower third ECHO.
- thecho (TH): Nigel's confessional again, side-eye to the right (toward the wall).
- echo2: back to Echo: "...repeats things." Long hold; Echo blinks once.
- title: title card: "PASS IT ON" logo with compression rings pulsing out from it, "Episode 11: Bar Forty-Seven";
  the cast pops in below, bobbing. Hold.

## 1 vibrate: Something is always vibrating
- start: hall stage; a big "VIBRATE = move quickly back and forth" card; a ruler-style blur diagram: an object
  with double-headed arrow "back and forth about a fixed position" (the fixed position a dashed line).
- drum: Nigel on a clipboard (`scClipboard`) as "sound inspector" beside a drum; the drum skin flexes in and
  out (exaggerated), "drum skin vibrates" chip.
- guitar: a guitar string blurs side to side (draw the plucked string as a curve swapping sides fast), "string".
- speaker: a loudspeaker cone pumps in and out; a row of air particles in front gets shoved; Nigel annoyed and
  pushed back a little on "shoving us. Rude." Chip "cone".
- hum: Kavya (bust) hums, eyes closed; small wavy lines from her throat.
- cords: cutaway: a throat cross-section with two pink flaps vibrating (V shape opening and closing); label
  "vocal cords: two flaps of tissue". On "complains", a tiny grumble speech bubble.
- mostly: Kavya, deadpan, to camera.
- archie: Archie bursts in, `bounce: 1`, happy; lower third ARCHIE. Chip "argon (Ar)".
- thnigel (TH): Nigel's confessional, deadpan. Inset: Archie bouncing at everything (a passing fly, a fan).
- test: hall: Kavya with the triangle, beater ready; Nigel points.
- grab: `pioTriangle`: `hit` 0→1, then `ring: 1` (vibration lines, a big "DING!"), then `held: true` at about
  60% of the line: the lines vanish at once; "sound STOPS" chip with a red stop icon.
- source: card "vibration is the source of ALL sound"; second chip "sound is a form of ENERGY" (yellow spark).
- thkavya (TH): Kavya's confessional (`pioConf(root,'kavya')`), annoyed; a counter "dings in the song: 1".

## 2 relay: Pass it on (but don't go anywhere)
- how: hall wide: the triangle on the left, a listener's ear (Echo's wall side, a band member) on the right,
  a dotted "?" path between them.
- run: `pioAir`; Archie mimes grabbing a "DING!" parcel and sprinting right (zoom lines). Nigel deadpan.
- no: freeze: Archie stops mid-run; slow push-in on Nigel's deadpan face during the pause.
- knock: `pioRow` across the screen (w about 1000), the wave front (`front`) moving right from a vibrating
  triangle icon on the left; first column bumps, then the next, and so on.
- back: the showpiece: the red-ringed particle (`hi`) with a dashed "start" marker beneath; it vibrates back and
  forth across its marker as the wave passes, and ends on it. Chip "we vibrate, we DON'T travel with the wave".
- wave: an energy spark rides the wave front left to right while the particles stay put; label "sound wave",
  "ENERGY travels, particles stay".
- thnigel (TH): Nigel confessional; inset: an audience member whose hair is blown back by a drum solo.
- long: `pioRow` again with two arrows above it: "wave travels →" and "particles vibrate ↔" (same direction);
  title "LONGITUDINAL".
- squash: freeze the row; brackets over the bunched regions labelled "compression" (use `compAt`) and over the
  spread regions "rarefaction". Archie, inside the row, gets squashed and spread with it, delighted.
- stadium: Archie, eyes wide, imagining a stadium crowd (kit `person` figures in seats).
- across: the crowd does a stadium wave: each person stands up and sits down while the wave moves right.
  Arrows: "people move ↕", "wave travels →"; title "TRANSVERSE (across)".
- light: split screen: left "TRANSVERSE: light, water ripples" with a sine (kit `sineWave`) and ripples; right
  "LONGITUDINAL: sound" with a mini `pioRow`. Nigel points at the right: "we go along".
- medium: three boxes (kit `particleBox` solid, liquid, gas) labelled solid, liquid, gas with "MEDIUM" over
  them; on "Here, it's Nigel" the gas box zooms and Nigel waves from it, deadpan.

## 3 jar: Belle in a jar
- lab: `pioLab`: a bench, Year 8 silhouettes, the jar setup (`pioJar`) on the bench, still empty.
- belle: Belle on the corridor wall (a corridor cutaway with lockers and a RECESS clock); lower third BELLE.
- nobody: Belle rings (`ring: 1`), and the students in the corridor groan (sad faces, slumping); Belle `sad`.
- thnigel (TH): Nigel confessional; inset ranking card: "LEAST POPULAR SOUNDS: 1. Belle 2. the recorder".
- jar: `pioJar` with Belle inside (`g.inside`), hanging from the top, not touching the glass (a small label
  "not touching the sides"); `ring: 1`, air 1: sound arcs outside the jar; a student's ear icon with a tick.
- pump: the pump runs (dial turns, `air` 1→0.15 over the line); air particles inside the jar disappear; little
  Nigel-cousins wave goodbye as they are sucked down the tube. Chip "VACUUM PUMP".
- quiet: Belle still ringing hard (hammer chattering), but the outside arcs fade to nothing; a volume meter
  dropping to near zero; an eye icon with a tick: "you can still SEE it".
- still: close on Belle inside the jar, shouting, `sad`/`shock`; her speech bubble shrinks to nothing.
- vacuum: card "VACUUM = no particles"; the jar interior empty; "no particles → no sound" chip.
- lightok: light rays pass straight through the jar to an eye; chip "light doesn't need a medium".
- back: air flows back in (particles reappear), the arcs return; the class cheers (confetti).
- happy: Belle, tearful-happy (mood happy with a single tear); hold the pause.
- space: space: an exploding star in silence (big silent flash, the word "BOOM" crossed out); an astronaut
  floating; chip "space is a vacuum: SILENT".
- radio: two astronauts with radio waves (zigzag arrows) between their helmets; chip "radio crosses a vacuum".
- rhyme: Archie, `bounce: 1`; big chip "NO AIR, NO AWARE", and under it "no medium, no sound". In the 0.5 s pause, Nigel (inset, deadpan) gives one tiny reluctant nod.

## 4 storm: Lightning alert
- four: `pioStorm`, rain on; a "4:00 PM" clock chip; a "LIGHTNING ALERT" sign (school notice).
- flash: `flash: 1` at the start of the line; Kavya (bust) at the window, flinching (`shock`), then annoyed; a
  "FLASH" chip at once, then a "BOOM" chip that arrives late (on "seconds later").
- fast: two lanes racing: a yellow light beam that crosses instantly with "300,000,000 m/s", and a slow sound
  wave crawling with "340 m/s".
- million: a scale bar: light's bar zooms off the right edge; sound's bar is a dot. Chip "nearly a MILLION times
  faster". Nigel deadpan.
- count: a card "seconds from flash to bang ÷ 3 = distance in km".
- counting: a big stopwatch counting 1 to 6 in time with Kavya's words (place the numbers by fraction of the
  line: 1 at 0.05, 2 at 0.2, … 6 at 0.9).
- two: "6 ÷ 3 = 2 km" written big; Archie bouncing.
- hawker: a little map from the school to a hawker centre "2 km" with a storm cloud over it; a plate of
  chicken rice getting rained on.
- gas: three-lane race (kit `particleBox`: gas, liquid, solid lanes, each with a pulse running through it);
  Team Gas lane first: Nigel and Archie in it, the pulse slowest; "340 m/s" chip; "SLOWEST".
- liquid: the liquid lane's pulse overtakes: "1,500 m/s", "more than 4× faster".
- solid: the steel lane's pulse wins by a mile: "5,000 m/s", "FASTEST" medal.
- wrong: Archie, confident, with a "AIR IS FASTEST?" thought bubble.
- packed: the bubble gets a red cross; the three lanes zoom to show particle spacing (far apart, close,
  touching in a lattice); chip "closer particles pass it on faster"; mnemonic card "SOLIDS SPEED, GASES GO SLOW".

## 5 scope: Freq and Amp
- two: hall; two spotlight circles on the floor, empty; chips "PITCH: how high or low" and "LOUDNESS".
- freq: Freq zips into the left spotlight (`buzz: 1`), with bubble tea; lower third FREQ; chips "FREQUENCY =
  vibrations per second", "1 Hz = 1 vibration per second".
- amp: Amp stomps into the right spotlight (`big` 0→1, the camera shakes slightly); lower third AMP; a
  rest-position line with a double arrow from it to the peak: "AMPLITUDE: from rest position to the furthest point".
- thnigel (TH): Nigel's confessional, deadpan; inset: Freq's empty bubble tea cups piled up.
- pitch: `pioScope` beside Freq: waves close together ("HIGH frequency → HIGH pitch", whistle icon), then
  spread out ("LOW frequency → LOW pitch", bass drum icon).
- loud: the scope: tall waves ("BIG amplitude → LOUD"), then short ("SMALL amplitude → QUIET").
- same: Archie with a wrong equation chip "high = loud?".
- whisper: Freq whispers (small mouth, a finger-to-lips "shh" puff); the scope shows close-together, SHORT waves:
  "high + quiet".
- boom: Amp booms (`big: 1`); the scope shows far-apart, TALL waves: "low + loud". The "high = loud?" chip
  cracks and falls.
- indep: card "PITCH ↔ FREQUENCY", "LOUDNESS ↔ AMPLITUDE", "independent"; mnemonic "FAST PITCH, BIG BANG".
- guitar: a guitar string: three quick panels "tighten", "shorten", "thinner" (the string vibrating faster in
  each, scope waves closer).
- harder: a pluck: the string swings wider; scope waves taller, same spacing: "same note, louder".
- scope: a microphone → cable → `pioScope`, a trace appearing; labels "microphone", "oscilloscope", "trace".
- read: on the scope, a vertical arrow on one peak "height = amplitude (loudness)" and a horizontal arrow between
  two peaks "spacing = frequency (pitch)".
- quiz: two scopes side by side, "A" tall and far apart, "B" short and close together; a thinking timer runs in
  the 1.4 s pause.
- answer: under A: "LOUD, LOW-PITCHED"; under B: "QUIET, HIGH-PITCHED"; ticks.
- correct: Nigel deadpan; Archie `bounce`.
- length: a wave (or `pioRow` frozen) with an arrow from one compression to the next labelled "λ wavelength
  (metres)".
- period: Freq with a clock: five waves pass in one second; chip "T = 1 ÷ f", "5 Hz → T = 1/5 s = 0.2 s".
- equation: whiteboard: "speed = frequency × wavelength" (big), then two waves at the same speed: the higher
  frequency one has the shorter λ. Chip "same speed: higher f → shorter λ".

## 6 ear: Out of range
- arrive: the ding's wave travels into Kavya's ear (Kavya bust, a zoom to her ear).
- coco: Coco at a reception desk with a "INNER EAR · FRONT DESK" sign and a bell; lower third COCO.
- pinna: `pioEar`, `hi('pinna')` then `hi('canal')`; `wave` travelling in; labels "pinna", "ear canal".
- drum: `hi('drum')`, the ear drum wobbling; label "ear drum: thin, tight membrane".
- bones: `hi('bones')` then `hi('cochlea')`; labels "3 tiny bones", "cochlea: coiled, fluid-filled tube".
  Coco poses smugly on "It's a look".
- nerve: `hi('nerve')`; signals (yellow dashes) run to the brain; label "nerve signals → brain".
- range: a frequency ruler (log-like spacing is fine): a green band "20 Hz to 20,000 Hz: HEARING RANGE";
  mnemonic "20 to 20k"; on "drops with age" the top end of the band shrinks a little with an "older" arrow.
- ultra: the ruler's right side "ULTRASOUND: above 20,000 Hz", left side "INFRASOUND: below 20 Hz" with an
  elephant rumbling (low wavy lines). Freq points both ways, `buzz`.
- dog: a dog whistle at "25,000 Hz" (beyond the green band); a dog's ears pop up; Kavya hears nothing (a "?" ).
- loud: Coco annoyed; Amp at a huge speaker; a warning card "very loud sounds can damage the cochlea
  PERMANENTLY".
- sorry: Amp shrinks (`big` 1→0), sad. In the pause: small icons of ear defenders and a headphone volume slider
  sliding down (a silent tip).
- reflect: hall: sound arcs travel from the triangle to Echo's tiled wall and bounce back (reflected arcs a
  different colour); chips "hard, flat surfaces REFLECT", "ECHO = reflected sound heard a moment later".
- echo: Echo, `ghost: 1`: "...an echo." with the double text.
- absorb: stage curtains (`pioCurtains`) slide shut in front of Echo, the arcs sink into them; chip "soft
  materials ABSORB sound".
- mmf: Echo's muffled "...mmf." from behind the curtain (only her eyes peek over it). Hold.
- scans: an ultrasound scan screen showing a cartoon baby outline; then a jewellery cleaner (a ring in a tank of
  liquid with fizzing ultrasound lines).
- sonar: `pioSea`: the ship, the pulse going down (`p` 0→1).
- sum: the echo coming back up (`p` 1→2); chips "echo after 4 s", "sound in water: 1,500 m/s"; a thinking timer
  in the 1.4 s pause.
- times: "1,500 × 4 = 6,000 m" on a whiteboard; Archie happy.
- half: the 6,000 m path drawn as down AND up arrows; "there and back ÷ 2"; "depth = 3,000 m" with a ruler down
  to the seabed.
- knew: Archie smug.
- echo2: Echo, from the wall: "...knew that." Archie turns to stare at her. Hold.

## 7 traps: The cast saves you some marks
- intro: "6 EXAM TRAPS" heading.
- t1–t6: quick confessional cuts, one per speaker, each with its trap on a card: 1 (Belle) no sound in a vacuum;
  2 (Archie) particles vibrate, the energy travels; 3 (Freq, then Amp in the same card) pitch ↔ frequency,
  loudness ↔ amplitude; 4 (Nigel) sound 340 m/s vs light 300,000,000 m/s; 5 (Coco) Hz for frequency, m/s for
  speed; 6 (Archie) echo sums: there and back, ÷ 2.
- return: the "PASS IT ON" logo: "will return".
- bar: back in the hall, band playing (notes floating up); the sheet music "47" glows; Kavya raises the beater,
  determined.
- ding: Kavya strikes: a huge "DING!" with rings travelling across the hall (a `pioRow` flash through the air).
  Hold the 1.2 s pause on Kavya's satisfied face.
- echo: cut to Echo: "...ding." (a smaller, fainter "ding" text). The band turns to look at the wall.
- nailed: Kavya, smug, to camera.
- last: Echo, deadpan, "...nailed it.", `ghost: 1`. Final frame: Echo's deadpan face with the logo; hold.

## Suggested animation groups
- A: cold (done), vibrate, relay
- B: jar, storm
- C: scope
- D: ear, traps

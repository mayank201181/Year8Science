# PUSH & PULL, Episode 13 "Moving Day": storyboard

A mockumentary sitcom (a documentary crew films; characters talk to camera) that teaches Forces & Motion.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

Premise: Kavya's family moves out of the old HDB flat into a new BTO flat. The documentary follows the
invisible staff of **Push & Pull Removals**, the forces that actually move everything. Their foreman, Rex,
is the **resultant force**: everyone else pushes and pulls, Rex is whatever is left over. When the forces
balance, Rex is zero, literally shrinks to a dot, and goes on his break. The documentary sees the crew
through its **FORCE-CAM** (green tint, scanlines, "FORCE-CAM" HUD): with it off, things just move; with it
on, the crew is there doing the work. Use the FORCE-CAM toggle whenever a scene cuts from the human world
to the crew (see `scenes/00_cold.js` for the exact look).

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'rex'), mood, look })`.
  Pass the character's extras every frame too (`len` for Rex, `arms` for Pushpa, `stretch`/`wonky` for Tess,
  `hug` for Graham).
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Rex goes `deadpan` at every silly remark, Pushpa `happy` (then `shock` when corrected), Frieda `annoyed`
  (she is `smug` only when something stops), Norm `sad` (`happy` only on "lovely"), Graham `happy`,
  Tess `shock` with `sweat: 1`, Piv `neutral`, never moving. Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in on Rex's deadpan face, Norm staring at the floor, Piv blinking, Kavya's flat stare at the camera.
- **Rex's length is the running gag AND the science.** Whenever the forces are balanced, Rex is `len: 0`
  (a round dot, happy, on his break: a tiny deckchair or "ON BREAK" sign). When there is a resultant force,
  he is an arrow whose length matches it and points the way it acts. Never show Rex as a long arrow while
  the forces are balanced.
- **Talking heads** (line ids starting `th`, plus the ones marked TH below) use the confessional:
  `ppConf(root, who)` full stage, the character big (s about 1.5) at about (430, 400). The first time a
  character appears in a confessional, show `scLowerThird(root, NAME, ROLE)` for about 3 s (the cast table
  has the text). Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **Force arrows are exact.** Draw every force with `ppForce(parent, { color: ppCol.<force>, dir, label })`,
  tail at the point where the force acts, length proportional to the size (pick a scale per scene and keep it:
  for example 1 px per newton in the sofa scene, so 100 N = 100 px, 300 N = 300 px). Equal forces get equal
  arrows. Weight always points straight down; the normal force at right angles to the surface (up from a floor);
  friction and drag always against the motion. Colours (`ppCol`): push coral, friction orange, weight periwinkle,
  normal cream, tension teal, resultant green, drag sky blue.
- **Science on screen:** whenever a key word or equation is said, it appears big and clear (chip, card or the
  site whiteboard `ppWhiteboard`). Equations exactly as captioned: `speed = distance ÷ time`,
  `W = m × g`, `moment = force × distance from the pivot`, `pressure = force ÷ area`; units N, kg, N/kg,
  m/s, km/h, N m, N/m², Pa (superscript ² as a real character or `tspan`).
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px, 30 px from the edges.

## Cast (`lib.js`: `cast(parent, kind, { s, mood })`)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| rex | Rex, the **resultant force**: the tired, sarcastic foreman. Straight man. | fat green arrow pointing right, round face end, yellow hard hat; `len` 0 = a dot | REX / Resultant force. Foreman. |
| pushpa | Pushpa, an **applied force** (a push): over-eager intern, first day, voices the misconceptions | coral ball, black top-knot, yellow sweatband, "NEW" badge; `arms: 'push'` palms out to the right | PUSHPA / Applied force. Intern. Day one. |
| frieda | Frieda, **friction** (and, outdoors, **drag / air resistance**): safety-officer killjoy, "Objection." | sandpaper block, jagged rough bottom, glasses, bun with pencil, whistle | FRIEDA / Friction. Against it. |
| graham | Graham, **gravity**, i.e. your **weight**: warm, clingy uncle, "works remotely" (non-contact) | iron kettlebell with handle, "10 N/kg" on his belly, pink cheeks; `hug` raises arms | GRAHAM / Gravity. Works remotely. |
| norm | Norm, the **normal force**: the floor, mopey, never thanked | parquet block, arms up holding flat palms on top | NORM / Normal force. The floor. |
| tess | Tess, **tension**, the spring inside the newtonmeter: anxious, sweaty | teal head with frazzled hair on a metal coil with a hook; `stretch`, `wonky` | TESS / Tension. Very tense. |
| piv | Piv, **the pivot**: silent all episode, steals the stinger | small grey triangle, hinge pin at the apex; never bobs | PIV / The pivot. Doesn't talk. |
| kavya | Kavya, 12, the human: exasperated | `scKavya` bust; full body `scKavyaBody` + kit `runPose`/`walkPose` | KAVYA, 12 / Moving house. Not thrilled. |

Sets: `ppFlat` (old HDB flat; `g.night(v)` for the pre-dawn briefing), `ppCorridor` (HDB corridor, lift lobby),
`ppRoad` (expressway), `ppNewFlat` (new BTO flat), `ppConf(root, who)` confessionals. Props: `ppBox`,
`ppSofa` (`g.pads(v)`, `g.legs`), `ppTrolley`, `ppLorry`, `ppNewtonmeter` (`g.set(F)`, `g.hookY`), `ppForce`,
`ppDTGraph`, `ppPlank`, `ppDoor` (`g.set(open)`, hinge at its origin), `ppWhiteboard`, `ppLogo`, `ppPad`.
All documented in the header of `lib.js`. Kit art to reuse: `person` (Kavya's dad: an adult `person` at
s 1.15 in a grey T-shirt; Mum likewise in a green blouse; Kavya's little brother at s 0.75), `thermometer`,
`spark`, `chip`, `card`, `tick`/`cross`, `labelLine`.

## 0 cold: Cold open (card: none) — DONE, see `scenes/00_cold.js`
- kavya: `ppFlat`; a tower of `ppBox`es labelled MISC (one says SHOES); Kavya bust (s 1.4) on the right,
  annoyed; chips "Kavya, age 12" and a red "MOVING DAY".
- boxes: tighter; Kavya glances up at the tower, then deadpan at camera; card "47 boxes / 46 of them say “MISC”";
  lower third KAVYA.
- small: wide shot of the living room with the sofa; the FORCE-CAM flickers on; the crew pop in one by one:
  Pushpa pushing the sofa's left arm, Frieda at its right foot, Graham hugging the seat, Norm under the legs
  holding them up, Tess hanging from the ceiling holding a plant pot, Piv at the door hinge. Chip "the invisible crew".
- every: three beats with chips: "moves" (the sofa nudges right, Pushpa pushing), "stops" (a MISC box topples
  off the stack, falls and stops dead on the floor), "turns" (the door swings on its hinges by Piv). Then a
  spotlight: Rex appears above the sofa; chip "the foreman".
- hi (TH): Rex confessional; lower third REX; chip "RESULTANT FORCE / all the forces, added up".
- job: a sum card: coral 300 N arrow right, orange 200 N arrow left, a line, then a green 100 N arrow right.
- decide: four chips: speed up, slow down, turn, nothing.
- nothing: Rex shrinks to a dot (`len` 0), happy, "z z z", the "nothing" chip lights up green, chip
  "resultant = 0". Hold the pause on the happy dot.
- since: Rex pops back into an arrow, deadpan then sad; card: a Big Bang burst, "Thank-yous received: 0".
- sofa: cutaway to the room: the sofa slides; speech bubble “The sofa moved!”; then FORCE-CAM on: Pushpa
  pushing (smug), Frieda objecting; green stamp "WE moved the sofa."; Rex small on the right, talking.
- title: `ppLogo` (PUSH & PULL with a coral arrow pushing right and a teal arrow pulling left), "Episode 13:
  Moving Day", the whole cast pops in below in a row (Rex, Pushpa, Frieda, Graham, Norm, Tess, Piv, Kavya).

## 1 crew: The morning briefing
The old flat before dawn (`ppFlat`, `g.night(0.8)`); the crew are on the coffee table / a cardboard box,
small, FORCE-CAM on. Rex at a tiny `ppWhiteboard` like a site foreman's toolbox talk.
- seven: night flat, a clock "7:00 AM", the crew filing in onto the box top; Rex sets up the whiteboard.
- rule1: whiteboard: "RULE 1: a FORCE is a PUSH or a PULL". Pushpa demonstrates a push (on a small box: it
  slides), Tess a pull (a string). Arrows: coral push, teal pull.
- rule2: whiteboard: "RULE 2: you can't see a force, only what it DOES". FORCE-CAM switches off for 1 s:
  a box slides by itself; switches on: Pushpa is pushing it. Rex deadpan.
- do: five icons pop in a row on the board as each is said: START (a still box begins to move), SPEED UP
  (speed lines), SLOW DOWN (brake skid), DIRECTION (curved arrow), SHAPE (a cushion squashed). Then the
  initials "S S S D S" underline them.
- pushpa: Pushpa bursts in, happy, waving (`arms: 'up'`); lower third PUSHPA; she shows the door she
  practised on (a little door wobbling).
- thpushpa (TH): Rex confessional, deadpan; on "energy" a sparkle by Pushpa in an inset; on "Not literally.
  Different episode." a sticky note "ENERGY: different episode" slaps onto the frame. Hold Rex's stare.
- newtons: chip "unit: the newton, N"; an apple on a little `ppNewtonmeter` reading 1 N; chip "1 small apple ≈ 1 N".
- arrows: whiteboard: two `ppForce` arrows, 5 N (short) and 10 N (twice as long), same direction; label
  "arrow points the way the force acts" and "longer arrow = bigger force".
- contact: the board splits into two columns: "CONTACT (touching)" | "NON-CONTACT (at a distance)".
  Frieda, Norm and Tess step into the CONTACT column as they introduce themselves.
- frieda: Frieda (annoyed), lower third FRIEDA; she drags her rough bottom on the box: little sparks of
  grit; chip "friction".
- norm: Norm (sad) under the coffee table holding it up; lower third NORM; a small up arrow at right angles
  to the table top ("normal = at right angles"); chip "normal force".
- tess: Tess on a rope tied to a box, stretched, sweating (`sweat: 1`); lower third TESS; a "34 °C" sun icon;
  chip "tension".
- noncontact: the NON-CONTACT column lights up.
- graham: Graham in the NON-CONTACT column, waving; lower third GRAHAM. On "I work remotely": Graham at a tiny
  desk with a laptop, a dashed periwinkle "pull" line reaching from him to a box without touching.
- cousins: two small cousins pop in beside him: a red/blue bar `magnet` with little eyes, and a
  crackling static spark (`spark` in pale blue) with eyes; chips "magnetic force", "electrostatic force"; neither touches anything.
- thgraham (TH): Rex confessional, deadpan; an inset: Earth with Graham's dashed pull arrows pointing to its
  centre from all sides; chip "weight acts towards the centre of the Earth". Graham, in an inset, hugging a box.
- upthrust: a whiteboard magnet-name "UPTHRUST" (water-blue) with a sticky note "DAY OFF"; an empty swimming
  pool sign crossed out. Hold the pause on Rex deadpan.

## 2 sofa: The sofa will not move
Old flat (`ppFlat`), daylight. Showpiece: Rex shrinking to a dot and growing back to a 100 N arrow as the forces
balance and unbalance. Arrow scale: 1 px per newton.
- nine: Kavya (`scKavyaBody`, pushing pose: lean 20, both arms forward) behind the `ppSofa`; clock 9:00 AM.
- go: FORCE-CAM on: Pushpa behind Kavya's hands (`arms: 'push'`, happy); coral arrow 100 N → at the sofa's left.
- objection: Frieda at the sofa's feet, annoyed; orange arrow 100 N ← at the floor; "Objection." with a whistle blast.
- stuck: Kavya (bust cut-in, sweating, annoyed); the sofa does not move at all.
- balanced: the two 100 N arrows, equal length, opposite; chip "BALANCED: equal size, opposite direction".
- zero: Rex shrinks to a dot (`len` 0), happy, sits in a tiny deckchair with an "ON BREAK" sign; chips
  "resultant force = 0" and "balanced → a still object stays still"; the sofa sits there.
- up: FORCE-CAM: Graham hugging the sofa (`hug: 1`) with a periwinkle arrow down (weight), Norm under it with a
  cream arrow up of the same length (normal force). Label "weight" and "normal force". Norm talks.
- thanks: Norm, sad, slow push-in; nobody reacts. Hold.
- dad: Kavya's dad (kit `person`, s 1.15, grey T-shirt) joins and pushes; Pushpa gets a second Pushpa-shaped
  ghost behind her (or a bigger coral arrow).
- three: coral arrow grows to 300 N (300 px), Pushpa thrilled.
- limit: Frieda's orange arrow grows to 200 N and stops; she strains (annoyed); chip "friction: 200 N max (here)".
- subtract: the sum card: 300 N → minus 200 N ← = 100 N →; Rex jumps out of the deckchair and becomes a 100 px
  green arrow pointing right (`len` about 0.6), smug. "Subtract opposite forces" on the card.
- unbalanced: the sofa starts to slide right and speeds up (speed lines grow); chip "UNBALANCED → resultant force
  → changes the motion: speeds up".
- trolley: `ppCorridor`, camera tracking (`g.upd(t, speed)` with a constant speed); the sofa on a `ppTrolley`
  rolling at a steady speed; a speedometer chip steady at the same number. Kavya walks behind it.
- harder: Pushpa pushing harder and harder (coral arrow growing, sweat), shock/happy, eyes on Rex.
- no: hard cut to Rex, deadpan, slow push-in. "No."
- steady: back to the trolley: Pushpa's coral arrow and Frieda's orange arrow (friction on the wheels) equal; Rex
  is a dot again (balanced) yet the trolley keeps rolling at the same speed; chip "balanced → steady speed in a
  straight line".
- change: three mini panels: speed up (coral bigger than orange), slow down (orange bigger than coral), turn (push
  from the side); Rex appears as a small arrow only in those; chip "resultant force = CHANGE in motion".

## 3 weigh: The heaviest box
Old flat, by the box tower. Showpiece: Graham on the Moon, the same box weighing 200 N on Earth and 32 N on the Moon.
- box: a big `ppBox` labelled MISC, "BOX 31" chip; it thuds down (camera shake).
- twenty: Kavya hugging the box, straining (sweat), annoyed; chip "20 kg".
- mass: Rex, deadpan; the chip "20 kg" gets a label "MASS" stamped on it.
- matter: card "MASS = amount of matter · kilograms (kg) · never changes"; the box shown on Earth, on the Moon and
  in space with "20 kg" under each.
- weight: Graham hugging the box (happy, `hug: 1`), periwinkle arrow straight down from the box; card "WEIGHT =
  force of gravity on the mass · newtons (N)".
- wmg: whiteboard: **W = m × g** and the word equation **weight = mass × gravitational field strength**.
- g: "g ≈ 10 N/kg on Earth" (Graham points to the "10 N/kg" on his belly); the board writes "20 kg × 10 N/kg = …".
- arms: "= 200 N" pops in; Kavya (bust), flat, sweating; a little arm icon with "200 N".
- moon: Kavya (bust) gazing up hopefully; a thought bubble with the Moon.
- moong: the Moon's surface (grey, craters, black sky, Earth in the sky): the same box with "mass 20 kg" and a
  short periwinkle arrow "weight 32 N" next to an Earth panel with "mass 20 kg" and a long arrow "200 N";
  card "Moon: g ≈ 1.6 N/kg"; a tiny Graham on the Moon, much smaller (he's weaker there).
- sixth: Graham (sad) hugging Kavya's leg (or the box); chip "about 1/6 the weight". Hold the pause.
- meter: Rex hangs the box on a big `ppNewtonmeter` (max 250, step 50); the pointer drops to 200 N; chip
  "newtonmeter = spring balance"; through the window we see the spring; cut in: Tess is the spring.
- ext (TH-like close-up): Tess stretching (`stretch` rising to 1), sweating; a ruler beside her: original
  length, new length, and the extension bracketed: "extension = new length − original length".
- hooke: a mini sequence: 1 weight → stretch 1 unit; 2 weights → 2 units (Tess at `stretch` 0.5 then 1); chip
  "double the force → double the extension"; title chip "HOOKE'S LAW: extension ∝ force".
- line: whiteboard graph: force (up) against extension (along), a straight line through the origin, points
  appearing on it.
- limit: the line continues to a dot "elastic limit", then curves away (red); Tess goes `wonky: true`, shock;
  chip "past the elastic limit: permanently stretched".
- uncle (TH): Tess confessional; an inset photo of a trampoline with a saggy, `wonky` spring in a picture frame
  with a black ribbon. Hold the pause.

## 4 slide: Frieda is not the villain
Old flat floor, shiny wet. Showpiece: the zoom into the "smooth" floor to see the bumps catching.
- mop: Mum (kit `person`, green blouse) mopping; the floor gets a glossy sheen; Kavya in socks (sock close-up:
  smooth); a yellow "WET FLOOR" sign.
- whoa: "No, no, no, no, NO!": Kavya (`scKavyaBody`, arms out) slides across the stage, wobbling, into a stack of boxes.
- wet: FORCE-CAM: Frieda tiny and faint under Kavya's socks, a very short orange arrow; chip "less friction".
- thfrieda (TH): Frieda confessional; lower third FRIEDA (first confessional); chip "friction always acts
  AGAINST the motion" with a motion arrow → and a friction arrow ←.
- useful: three quick icons tick in: walking (a shoe gripping), a tyre gripping the road, a brake pad on a
  wheel; then a cartoon of everyone sliding into a wall (cross). Chip "friction is USEFUL".
- bumps: magnifier zoom: two surfaces that look smooth, at ×1000 jagged, the bumps interlocking and catching
  as the top one tries to slide; label "even smooth surfaces are rough close up".
- squeak: the `ppTrolley`'s wheel close-up, squeaking ("SQUEAK" text), heat waves (`heatWaves`) at the axle,
  a worn wheel; chips "wastes energy as heat", "wears parts out".
- oil: Rex with an oil can; drips on the axle; the heat waves stop; chip "REDUCE friction: lubricant (oil)".
- object: Frieda, annoyed, blows her whistle: "Objection, Rex."
- overruled: "Objection overruled.": Rex, deadpan, bangs a tiny gavel (or stamps "OVERRULED"). Hold.
- grip: Kavya swaps socks for rubber-soled school shoes; sole close-up with treads, and a tyre tread; chip
  "INCREASE friction: rougher surfaces".
- drag: outside (`ppRoad` or the corridor's open side): Frieda puts on a windbreaker jacket and goggles; chip
  "AIR RESISTANCE = DRAG".
- faster: a cyclist (kit `person` on a simple bike) or Kavya on a scooter: the sky-blue drag arrow grows as speed
  rises (three speeds, three arrow lengths); chip "drag: friction from air or water · bigger when faster".
- stream: side by side: a brick shape with messy air lines vs a streamlined teardrop with smooth flowing lines;
  chip "STREAMLINED: smooth and pointed".
- lorry: the `ppLorry` drives past, boxy, air lines crashing into its flat front; Frieda deadpan. Hold.

## 5 lorry: The longest half hour
`ppRoad` with the `ppLorry`, then the graph. Showpiece: the distance-time graph drawing itself in sync with the
lorry's trip, and Pushpa's "backwards?" moment on the flat part.
- noon: clock 12:00; the lorry pulls up; boxes go in; chips "new flat: 15 km away" and "trip: 30 min = ½ hour"
  (a clock face sweeping half an hour).
- speed: whiteboard: **speed = distance ÷ time** (big, with the ÷ sign).
- units: chips "m/s (metres per second)" and "km/h (kilometres per hour)".
- calc: Kavya (in the cab, bust) working it out on the board: 15 km ÷ ½ h = 30 km/h; then a little old
  grandma on a scooter overtakes the lorry. Kavya flat.
- average: chip "AVERAGE speed = total distance ÷ total time"; the speedometer needle swinging around during
  the trip (not steady).
- graph: `ppDTGraph(w 640, h 360, { tMax: 30, dMax: 15, ticksT: [0,10,20,30], ticksD: [0,5,10,15] })` slides in;
  labels "time (min)" along, "distance (km)" up. The journey: `[[0,0],[6,3],[15,12],[25,12],[30,15]]`
  (town 30 km/h, expressway 60 km/h, jam 10 min stopped, town again). Draw the first piece.
- slope: the first piece (steady 30 km/h) highlighted: "straight slope = steady speed"; then the
  expressway piece draws, steeper: "steeper = faster".
- express: the lorry on the expressway (`ppRoad` at high speed); Pushpa riding on the roof, `happy`, hair
  flying.
- flat: the graph draws the flat piece (minutes 15 to 25); Pushpa, `shock`, points at it.
- stopped: chip "FLAT = STATIONARY (not moving), NOT backwards"; the lorry in a traffic jam (rows of cars).
- jam: a clock ticking ten minutes on the flat bit; Rex as a dot (balanced, stationary), deadpan.
- best: Frieda, `smug`, relaxed in the jam with her feet up. Hold.
- gradient: the last piece draws; a gradient triangle on the expressway piece: 9 km up, 9 min along → "gradient
  = speed"; chip "gradient (steepness) = speed".

## 6 newflat: Turning and pressing
`ppNewFlat`. Showpiece: the seesaw balancing on Piv, with the moments adding up to 400 N m on each side.
- one: the new flat, empty and sunny; a clock 1:00 PM; "fresh paint" smell lines.
- door: the `ppDoor` (hinge on the left); Pushpa pushes it right next to the hinges (at x about 30).
- stuck: Pushpa straining (`arms: 'push'`, sweat), the door barely moves; coral arrow near the hinge.
- moment: whiteboard: **moment = force × distance from the pivot**; a top-view diagram: the door as a line
  from the hinge, the force arrow at a distance d marked with a bracket.
- piv: Piv at the hinge, neutral, blinking; chip "PIVOT: the point it turns around"; lower third PIV. Hold the
  1 s pause on Piv blinking.
- handle: Pushpa moves to the handle (x 200); the same-length coral arrow, now with a long distance bracket; chip
  "same force, more distance, bigger moment"; an inset of a long spanner turning a bolt.
- opens: the door swings open (`g.set` to 1); Pushpa thrilled.
- seesaw: `ppPlank` balanced on Piv (Piv's apex at the plank centre); whiteboard "balanced when
  force × distance (left) = force × distance (right)".
- kids: Kavya (`scKavyaBody`, sitting) 1 m from Piv on the left, her brother (kit `person` s 0.75) 2 m out on
  the right; distance brackets "1 m", "2 m"; arrows "400 N", "200 N"; sums "400 × 1 = 400 N m" and
  "200 × 2 = 400 N m"; the plank levels (`g.set(0)`), a green tick.
- tv: Kavya (bust) glaring at the camera, annoyed. Hold.
- legs: the sofa (`ppSofa`) lowered onto the new floor; zoom to one tiny leg.
- ow: "Ouch, ouch...": FORCE-CAM: Norm under the leg, `shock`, a dent forming; the leg's contact patch glowing red.
- pressure: whiteboard: **pressure = force ÷ area**; the same weight arrow over a tiny area (big red "HIGH
  pressure").
- pascal: chip "unit: N/m² = pascal (Pa)".
- pads: Mum sticks `ppPad`s under the legs (`sofa.pads(1)`); the same weight arrow spread over a wide area
  (green "LOW pressure"); the dent pops out.
- lovely: Norm `happy`, tearful (sweat drops as tears), slow push-in. Hold.
- cutter: a box cutter (Dad's hand) slicing tape on a MISC box; close-up of the thin edge: "tiny area → huge pressure".

## 7 traps: The crew saves you some marks
- intro: "6 EXAM TRAPS" heading, the crew lined up.
- t1–t6: quick confessional cuts (`ppConf`), one per speaker, each with its trap on a card:
  1 (Graham) mass in kg, weight in N; 2 (Pushpa) a moving thing needs no forward resultant force: balanced =
  steady speed (Rex as a dot beside a rolling trolley); 3 (Frieda) friction and drag oppose motion, drag grows
  with speed; 4 (Rex) speed = distance ÷ time, pressure = force ÷ area, "÷ not ×"; 5 (Tess, `wonky`) Hooke's law
  only up to the elastic limit; 6 (Norm) flat line on a distance-time graph = stationary, not backwards (tiny graph).
- return: the show logo returns: `ppLogo` with "will return".
- ask, me, wrong, dont (stinger): Piv's confessional (`ppConf(root, 'piv')`), lower third PIV; long silence
  (1.4 s) while he blinks; then "...Everything revolves around me." (tiny mouth); a slow rotation of the whole
  confessional background around Piv's apex; Norm, sad, nods; Rex, deadpan, "Don't encourage him." Final frame:
  Piv on the logo, blinking.

## Suggested split for the animators
- A: 1 crew + 2 sofa (the crew introductions and the balanced/unbalanced showpiece; Rex's `len` gag).
- B: 3 weigh + 4 slide (mass/weight, the Moon, the newtonmeter and Hooke's law; friction and drag).
- C: 5 lorry + 6 newflat + 7 traps (graph, moments, pressure, the stinger).

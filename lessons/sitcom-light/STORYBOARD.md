# LIGHT WORK, Episode 10 "Return to Sender": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Light & Optics.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

**Premise.** Ray is a ray of white light, a tired courier for Light Work Express: he travels 150 million km
from the Sun, in a straight line, to deliver pictures into people's eyes, and nobody ever tips. The crew
follows his deliveries to Kavya, 12, through one Saturday in her HDB flat, from the 7 a.m. wake-up to
lights out: the bedroom (how we see, materials, shadows), the bathroom mirror (reflection), the swimming
complex (refraction), Grandma's window after a thunderstorm (dispersion), the drama-club stage lights
(colour, filters, mixing) and, finally, the inside of her eye.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'ray'), mood, look })`.
  The narrator (`narr`) has no body; Kavya is `cast(.., 'kavya', { outfit })` and talks like everyone else.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Ray goes `deadpan` at every silly remark (his default), Norman `annoyed` whenever someone measures from
  the surface, Mirabel `smug` (default) or `shock` when told she is virtual, Dennis slow `neutral`/`happy`,
  Rosie `deadpan` with the occasional `smug`, Violet `happy` and bouncing, Indigo `sad`, Kavya `annoyed`.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction in the silence:
  a slow push-in on Ray's deadpan face, Mirabel's shocked face, Indigo blinking, the empty tip jar.
- **Talking heads** (line ids starting `th`, plus the ones marked TH below) use the confessional shot:
  `lwConf(root, kind)` full stage (fade it with `g.set(p, t)`), the character big (s about 1.4) at about
  (430, 390), a prop where it helps. The first time a character appears (in a confessional or a scene),
  show `lwLower(root, kind)` for about 3 s. Cuts are snappy: hard cuts or a fade of 0.25 s at most.
- **Running gags (keep them visual):** Ray's empty tip jar (`lwTipJar`) and "Nobody tips"; Norman never
  bobs and is always exactly at 90° to whatever surface he stands on (stand him on the mirror, the water,
  the glass); Mirabel admiring herself; Dennis being slow (his lines are slow: let him blink slowly);
  Rosie's list (`lwList`) and "Not on the list"; Indigo being mistaken for Blue.
- **Science on screen:** whenever a key word or rule is said, it appears big and clear (chip, card,
  whiteboard), with real superscripts (`tspan`) for 3 × 10⁸. Every ray diagram uses the lib's optics
  helpers (`lwBounce`, `lwBend`, `lwNormal`, `lwArcFromNormal`, `lwRayPath`, `lwGlassBlock`, `lwPrism`
  with `g.trace`, `lwEyeSection`): they are physically exact (i = r, Snell's law, TIR at 42° for glass,
  violet bends most). Rays are straight lines with arrowheads pointing the way the light travels: FROM the
  source, INTO the eye, never out of it. Angles are always drawn and labelled from the dashed normal.
  The jokes can be silly; the science must be exact.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px; nothing overlapping.
- Performance: at most about 650 elements per scene; no SVG filters; tone idle motion down when `S.reduce`.

## Cast (`lib.js`: `cast(root, kind, { s, mood, outfit })`)

| kind | who | look | lower third (`lwLower`) |
| --- | --- | --- | --- |
| ray | Ray, a ray of white light: tired, sarcastic courier, the straight man. "I don't do curves." "Nobody tips." | glowing pale-yellow round head with light spikes, blue courier cap with a straight-arrow badge, cream trench coat, blue courier bag; `set({ coat: 0..1 })` opens the coat to show the seven colours stacked inside | RAY / Ray of light. Courier, Light Work Express. |
| norman | Norman, the normal: pedantic, earnest, imaginary, turns up uninvited at every surface. "Measure from me." | tall dashed pole, square glasses, neat side parting, "90°" badge, right-angle mark at his foot; never bobs | NORMAN / The normal. Imaginary. Always 90°. |
| mirabel | Mirabel, Kavya's bathroom mirror (a plane mirror): vain, theatrical, "darling" | oval silver glass, ornate gold frame, lashes, lavender lids, pink bow | MIRABEL / Plane mirror. Bathroom. Stunning. |
| dennis | Dennis, the swimming-pool water: slow, gentle, deeper than he looks | slab of blue water, wavy surface, bubbles, orange goggles on his forehead | DENNIS / The pool. Optically dense. |
| violet | Violet, one of the seven colours in Ray's coat: hyper, bends the most | purple ball, hair bun, sparkle | VIOLET / Bends the most. Loves it. |
| indigo | Indigo, another of the seven: mopey, keeps being mistaken for blue; steals the stinger | indigo ball, knitted beanie | INDIGO / A real colour. Honestly. |
| red | Red: silent, very relaxed, bends the least | red ball, shades on his head | (none) |
| hue | orange, yellow, green, blue (silent extras): `cast(root, 'hue', { hue: 'green' })` | plain coloured balls | (none) |
| rosie | Rosie, a red filter working the stage spotlight like a bouncer: "Not on the list." | red see-through gel in a dark frame, shades pushed up, earpiece, arms folded | ROSIE / Red filter. Stage lights. Exclusive. |
| kavya | Kavya, 12, the human: exasperated, sharp | `outfit`: 'pyjamas' (cold, seeing, eye), 'pe' (mirror, traps), 'swim' (pool, prism), 'tree' (filter) | KAVYA, 12 / Wanted to sleep in. |

Sets: `lwBedroom(back, front)` (cold, seeing, eye), `lwSpace` (cold), `lwBathroom` (mirror), `lwPool(back, front)`
(pool), `lwStorm` and `lwLivingRoom` (prism), `lwHall` + `lwSpot` (filter), `lwEyeSection` (eye), `lwConf`
confessionals everywhere. Props: `lwTipJar`, `lwTorch`, `lwHandDino`, `lwMoon`, `lwApple`, `lwBook`, `lwList`,
`lwRainbow`, `lwRGB`, `lwPixels`. Kavya in bed: bust (s about 0.9) at about (330, 470) between the bed and the
blanket (the blanket goes in the `front` layer). The episode's colour key: white light pale yellow
(`LW_OPT.ray`), the spectrum `LW_SPECTRUM`, water `C.water`, glass `LW_OPT.glassFill/glassStroke`, the normal
grey dashed (`LW_OPT.normal`), angle i amber, angle r cyan.

## 0 cold: Cold open (card: none)
- kavya: `lwBedroom`, morning light; Kavya (pyjamas) asleep in bed: the bust tipped onto the pillow, blanket to
  her chin, "Z z z" letters floating up. Chips pop in: "Kavya, age 12", an alarm clock reading 7:00 with
  "SATURDAY", and a sticky note on the headboard "PLAN: sleep until lunch".
- sun: the curtains part a crack; a hard sunbeam lands on her face. She jolts upright (tip back to 0°), squinting,
  mood annoyed, glaring at the window. Lower third KAVYA, 12 / Wanted to sleep in.
- small: documentary move: the camera follows the beam back from her face to the gap in the curtains; a dashed
  reticle locks on to the beam; chip "the thing that just hit her in the face".
- this: the beam pulls together into Ray, standing in the sunbeam in front of the window; he looks into the
  lens, deadpan. Hold the pause (0.5 s).
- hi (TH): Ray's confessional; lower third RAY; chip "ray of light". Mood deadpan, a small nod on "deliveries".
- commute: cutaway `lwSpace`: a tiny glowing Ray leaves the Sun and travels along a straight dashed line to the
  Earth; a timer counts 0:00 → 8:20 ("minutes"), a chip "150 000 000 km"; the route stays dead straight.
- speed: card: "speed of light ≈ 300 000 km/s = 3 × 10⁸ m/s" (real superscript), with "nothing is faster".
- curves (TH): confessional; three signs pop in beside Ray with red crosses: a winding road "curves", a
  "SHORTCUT" arrow sign, a palm-tree "SCENIC ROUTE" sign; then one long straight arrow "straight lines ✓".
- thboss (TH): confessional; a framed photo of the Sun wearing sunglasses: "THE BOSS"; chip
  "luminous = makes its own light". Ray rolls his eyes (look up, deadpan).
- tips (TH): an empty tip jar (`lwTipJar`) slides in on the desk beside Ray.
- notip: push in on the empty jar; a single moth flutters out of it. Ray deadpan. Hold the 0.9 s pause.
- title: the show logo "LIGHT WORK" (a white beam shoots under it, left to right, with an arrowhead) and
  "Episode 10: Return to Sender"; the whole cast pops in below in a row, bobbing: Ray, Norman, Mirabel, Dennis,
  Rosie, Violet, Indigo, Kavya.

## 1 seeing: Your eyes are not lasers
Layout: the bedroom, Kavya sitting up in bed (pyjamas). Ray stands on the floor by the window (s about 0.8).
- window: three straight parallel rays (`lwRayPath`) come through the window glass without bending; chip
  "transparent: light passes straight through".
- curtain: rays hit the curtains and come out the other side scattered in all directions (short rays fanning out);
  chip "translucent: some light through, scattered". Ray annoyed.
- blanket: Kavya pulls the blanket over her head (her bust slides down behind the blanket layer); rays hit the
  blanket and stop dead (small red crosses where they stop); chip "opaque: no light through".
- neighbour: Ray, deadpan, puts a little parcel down at the foot of the bed. Hold the pause.
- job: the "delivery route" diagram builds over the room: Sun → (ray) → the poster on the wall → (reflected ray)
  → Kavya's eye (she has poked her head out). Each ray has its arrowhead; a chip "we see an object when light
  reflects off it and enters our eye".
- lasers: Kavya, curious; a thought bubble shows two cartoon red laser beams shooting out of her eyes. Hold the
  1.2 s pause: hard cut to Ray, slow push-in, deadpan.
- no: "No." The laser thought bubble pops.
- receive: the route diagram again, arrows only INTO the eye ("eyes only RECEIVE light", big); a letterbox
  icon next to Kavya's head on "letterbox". Kavya annoyed.
- wall: the wall glows faintly as a ray arrives and bounces off; chip "non-luminous: makes no light of its own".
  A tiny side card: "luminous: Sun, lamp, flame, screen".
- moon: through the window, a pale daytime Moon (`lwMoon`) in the sky; Kavya points; thought bubble Moon with
  "makes light?".
- moonno: diagram: Sun → Moon → Earth, the Moon's light is a reflected ray (arrows from the Sun, bouncing off
  the Moon); chip "the Moon is NON-luminous: it reflects sunlight". Ray smug on "takes all the credit".
- torch: Kavya holds her phone (`lwTorch`) up, torch on, aimed at the wall; her other hand in the beam.
- roar: the dinosaur shadow (`lwHandDino`) on the wall; Kavya deadpan "Roar". Hold.
- shadow: side diagram (inset card): torch (point) → straight rays → hand blocks some → a dark region on the wall
  exactly where the blocked rays would have landed; label "shadow: light blocked (light travels in straight lines)".
- closer: the hand moves closer to the torch; the edge rays spread wider and the dinosaur on the wall grows to
  about twice the size; chip "closer to the source → bigger shadow".
- big: Kavya, deadpan: "Big dinosaur. Roar." The giant dino shadow fills the wall.
- lamp: the desk lamp (a big source) replaces the torch: the shadow gets a dark core and a lighter fuzzy ring;
  labels "umbra (no light)" and "penumbra (partly lit)" with leader lines. Inset ray diagram: rays from the top
  and bottom of the lamp make the two regions.

## 2 mirror: Mirabel, the plane mirror
Layout: `lwBathroom`; Mirabel on the wall at `g.mirrorAt` (s about 1.2); Kavya (PE shirt) brushing her teeth at
the sink, front of frame, three-quarter to the mirror.
- bathroom: "7:15 AM" chip; Kavya brushing teeth, grumpy; a sunbeam comes in.
- hello: Mirabel wakes up, glamorous, smug; sparkles; lower third MIRABEL. A small "PLANE MIRROR = flat mirror" chip.
- thmira (TH): Ray's confessional, deadpan; small inset: Mirabel blowing a kiss at herself.
- norman: Norman pops up at the mirror's surface, standing exactly perpendicular to it (rotate him so his foot-line
  lies on the mirror); lower third NORMAN; chip "the normal: an imaginary line at 90° to the surface"
  with the 90° box flashing.
- thnorm (TH): Ray's confessional; behind him, Norman appears at a window, a floor tile and the mug, each time
  standing at exactly 90°. "He comes anyway": Norman waves.
- fromme: big ray diagram (`lwPlaneMirror`, `lwNormal` with square, `lwBounce`): Kavya (or the student) measures
  the angle from the MIRROR SURFACE: arc in red, with a red cross and a buzzer; then Norman stamps the correct
  arc FROM THE NORMAL (amber). Norman annoyed, then smug.
- inout: Mirabel; the diagram's incident ray comes in at 30° and reflects at 30°.
- law: whiteboard: "THE LAW OF REFLECTION: angle of incidence = angle of reflection", then big "i = r";
  labels "incident ray", "reflected ray", arcs "i = 30°" (amber) and "r = 30°" (cyan) from the normal.
  Sweep the incident ray from 20° to 50° and back: r follows exactly.
- towel: zoom on the towel's rough surface (`lwRough`): five parallel rays come in and leave in all directions,
  each still obeying i = r at its own little facet (show one facet's tiny normal); chip "diffuse reflection: rough
  surface, rays scatter".
- smooth: beside it, Mirabel's smooth surface: five parallel rays stay parallel after reflecting; chip "regular
  reflection: smooth surface, parallel rays stay parallel → clear image". Mirabel smug.
- behind: top-down diagram: Kavya in front of the mirror at distance d, her image behind at the same d (two equal
  arrows labelled d); two reflected rays reach the eye, and dashed extensions go back behind the mirror to meet at
  the image.
- virtual: the dashed lines glow; a cinema screen placed behind the mirror stays blank; chip "VIRTUAL: no light
  really gets there, can't be caught on a screen".
- real: Mirabel in shock, then outraged; dramatic zoom on her face.
- still: Norman, deadpan; hold 0.7 s on Mirabel's offended face.
- vusl: card with four rows, each popping: **V**irtual, **U**pright, **S**ame size, **L**aterally inverted;
  the initials drop into a big "VUSL".
- wave: Kavya raises her right hand; mirror Kavya raises the hand on the same side of the screen (her left);
  "R" and "L" labels on the hands.
- updown: Mirabel; a little roller-coaster loop doodle flashes beside her; an upside-down Kavya image appears with
  a red cross. Chip "a plane mirror does NOT flip up and down". Mirabel smug.

## 3 pool: Deeper than he looks
Layout: `lwPool(back, front)`, the pool in cross-section (we see through its glass wall). Kavya (swim outfit)
at the edge, later in the water up to her chest.
- pool: chips "2:00 PM" and "33 °C"; the sun blazing; Ray dives off the deck into the water (a cartoon splash).
- dennis: the water gets a face: Dennis appears in the pool (s about 1.3, half above the surface), sleepy-friendly;
  lower third DENNIS.
- optical: Dennis, slow; chip "optically dense". Hold 0.7 s: Ray deadpan.
- bend: ray diagram at the surface (`lwNormal`, `lwBend` with n1 1, n2 1.33): a ray in air hits the surface at
  40° and continues in water at about 29°; little speed tags "fast" (air) and "slow" (water) on the ray; chip
  "REFRACTION: light changes speed in a new medium, so it bends". Label "medium = the material light travels
  through".
- shortcut: Kavya, curious; thought bubble: Ray with a map, taking a shortcut. Hold the 1 s pause on Ray, deadpan.
- noshort: the bubble pops; chip "it bends because its SPEED CHANGES"; a speedometer needle drops as the ray
  enters the water.
- towards: Norman appears standing on the water surface (perpendicular, the normal); the ray into the water swings
  TOWARDS him (arc i in air, arc r in water, r smaller); chip "slows down → bends TOWARDS the normal".
- away: the reverse: a ray from the bottom of the pool comes up and leaves the water, bending AWAY from Norman
  (angle in air bigger); chip "speeds up → bends AWAY from the normal".
- thnorm (TH): Norman's confessional; lower third NORMAN (if first time); a red-pen exam script reading
  "light always bends towards the normal" crossed out.
- sloto: mnemonic card: "SloTo, FastAway: SLOw down → bend TOwards, FAST → AWAY".
- along: a ray goes straight down along Norman; it does not bend; speed tag changes from "fast" to "slow";
  chip "along the normal: slows down, no bending".
- shallow: a coin on the pool floor; rays from it bend away from the normal at the surface into Kavya's eye; dashed
  backward extensions show where the coin seems to be: higher up; labels "real depth" and "apparent depth".
- deeper: Dennis, wistful; Ray glances at him. Hold 0.8 s.
- legs: Kavya standing in the water: her legs under the water look shorter (draw the underwater part squashed
  vertically to about 70%); Kavya annoyed, looks down.
- parallel: `lwGlassBlock` diagram with `g.trace`: the ray enters, bends towards the normal, crosses, leaves bending
  away; the incoming direction is extended as a dashed line so the emerging ray is visibly parallel to it; a double
  arrow between them labelled "lateral displacement".
- critical: `lwSemiBlock` (or a glass block) diagram: inside the glass, the angle of incidence grows; the escaping
  ray bends further from the normal until it runs along the surface at the critical angle (42°, labelled); beyond
  it, the ray reflects back inside (TIR). Chip "beyond the critical angle: total internal reflection" and, smaller,
  "needs: light going from the denser material, and an angle bigger than the critical angle".
- fibre: a curving optical fibre; a light pulse zig-zags inside, bouncing at every wall; labels "optical fibre",
  "total internal reflection". Ray rides it like a slide.
- thnet (TH): Ray's confessional; a phone with a buffering spinner appears; on "It's your Wi-Fi", a little router
  with blinking lights looks guilty. Hold 0.7 s.

## 4 prism: Seven colours in a trench coat
Layout: first `lwStorm`, then `lwLivingRoom`.
- storm: chip "4:00 PM"; heavy rain, dark sky.
- flash: a lightning flash (`g.upd(t, 1, flash)`); Ray (small, in the confessional corner inset or at the window)
  points; a running race: a light pulse arrives at Kavya's window instantly, a slow "BOOM" sound-wave ring is still
  crawling across the town.
- sound: card "light ≈ 300 000 km/s · sound ≈ 0.34 km/s: light is about a million times faster" with the two
  speeds as bars (the light bar runs off the card).
- crystal: `lwLivingRoom`: the rain stops, the sun comes out; a beam of white light hits the hanging prism; label
  "prism: a triangular block of glass".
- secret (TH): Ray's confessional, serious, leaning in.
- coat: Ray's coat swings open (`coat: 1`): seven colours stacked inside, all waving. Chip "WHITE LIGHT = a mixture
  of colours". Hold 0.8 s: Kavya's mouth hanging open (shock).
- spread: big prism diagram (`lwPrism`, `g.trace` per `LW_SPECTRUM` colour): one white ray in, refracted at both
  faces, fanning out into seven coloured rays; the seven colour characters ride their own rays like slides.
- violet: Violet, lower third VIOLET, whooshing down the most-bent ray, bouncing happily; the violet ray glows,
  label "bends the MOST".
- red: Red lounges on the top ray (least bent) in his shades, smug; label "bends the LEAST".
- order: the spectrum band on the wall, with the seven names popping in order; title chip "DISPERSION:
  splitting white light into the visible spectrum".
- richard: mnemonic card: **R**ichard **O**f **Y**ork **G**ave **B**attle **I**n **V**ain, each initial coloured.
- indigo (TH): Indigo's confessional; lower third INDIGO; a small swatch strip "blue | indigo | violet".
- feelings: Indigo, sad, blinks; a tiny rain cloud over his beanie. Hold 0.8 s.
- made: Kavya (swim towel round her shoulders), pointing at the rainbow on the wall.
- nomade: two-prism demo: the spectrum from the first prism goes into a second, upside-down prism and comes out
  white again; chip "a prism does NOT add colour: it SEPARATES colours already in white light". The seven colours
  climb back into Ray's coat (coat closes).
- rainbow: outdoor shot: a rainbow arc (`lwRainbow`, red outside, violet inside) over the HDB blocks; Kavya seen from
  behind with the Sun behind her; raindrops sparkle; chip "Sun BEHIND you, rain in front".

## 5 filter: Not on the list
Layout: `lwHall` stage. Kavya in the tree costume (`outfit: 'tree'`) on stage beside two cardboard trees.
- hall: chip "6:00 PM"; the hall, white spotlights on.
- tree: Kavya, deadpan, as Tree Number Three; a script page "TREE 3: (no lines)". Hold 0.6 s.
- apple: a red prop apple on a stool in white light; incoming white light shown as seven thin coloured arrows; only
  the red arrow bounces off towards the camera; the other six arrows stop at the apple ("absorbed").
- noglow: chip "the apple does not glow and does not turn light red: it REFLECTS red, ABSORBS the rest"; a crossed-out
  icon of a glowing apple.
- whiteblack: two props side by side: a white ball reflecting all seven arrows, a black ball absorbing all seven.
- rosie: Rosie slides into the spotlight's gel holder (the top spotlight turns red); she drops down to camera height
  for her intro; lower third ROSIE; she checks `lwList`.
- list: the seven colour characters queue at the spotlight like a club line; Red walks through ("on the list", the
  red ray continues); Green and Blue bump into Rosie and vanish ("absorbed"); Rosie unimpressed.
- filter: chip "FILTER: TRANSMITS its own colour, ABSORBS the others" and the mnemonic "a filter is selfish".
- throsie (TH): Rosie's confessional, smug.
- green: on stage, only red light falls on Kavya: no green arrow reaches her leaves; her green costume and leaves
  darken to black (`lwTint(kavya.leaves, '#1A1A1A', p)` and the shirt).
- black: Kavya, annoyed, looks down at her black leaves.
- notlist: Rosie, deadpan. Hold 0.8 s.
- primary: three spotlights (red, green, blue) switch on; chip "primary colours of light: red, green, blue".
- mix: `lwRGB`: the three circles overlap on the backdrop; the overlaps are labelled one by one as each sum is said:
  red + green = yellow, green + blue = cyan, red + blue = magenta, and the centre: white.
- hiagain: Ray steps into the white centre of the overlap; waves.
- screen: zoom into Kavya's phone (`lwPixels`) showing a yellow emoji; the magnifier shows only red and green
  sub-pixels lit; chip "no yellow dots: red + green".
- paint: a paint palette: blue and yellow paint swirl into a muddy dark green; chip "paints ABSORB light: mixing them
  makes darker colours".

## 6 eye: Final destination: the eye
Layout: the bedroom at night (`lwBedroom` with `g.dark(0.5)` and the desk lamp on), then `lwEyeSection` large.
- night: chip "10:00 PM"; Kavya in bed (pyjamas) reading a book (`lwBook`); Ray hops off the page towards her eye;
  the camera dives into her eye.
- cornea: `lwEyeSection` (big, R about 230, centred); light comes from the left; the cornea glows; label "cornea"
  with a leader; rays (`g.rays`) bend most at the cornea; chip "does MOST of the bending". Also label "sclera: the
  tough white coat" faintly.
- pupil: label "pupil (a hole!)"; Ray (small) dives through the gap like a cat flap.
- iris: front view (`lwIrisFront`) inset: bright light → small pupil, dim light → wide pupil (animate both);
  label "iris: coloured ring of muscle".
- lens: the lens glows; label "lens: fine-tunes the focus"; a tiny Dennis in a yoga pose in the corner.
- near: the book close to the eye; `g.focus(1)`: ciliary muscles contract, ligaments slack, lens fat, rays meet
  on the retina; labels "ciliary muscles: CONTRACT", "lens: FATTER, bends MORE".
- far: the clock far away; `g.focus(0)`: muscles relax, ligaments tight, lens thin, rays still meet on the
  retina; labels "suspensory ligaments: TIGHT", "lens: THINNER"; title chip "ACCOMMODATION".
- retina: the retina glows; a small upside-down picture of the book page lands on it (`g.image`); label "retina".
- upside: Kavya (bust inset), shocked. Hold.
- brain: the optic nerve lights up; signals (little pulses) run along it to a cartoon brain, which flips the
  picture the right way up; chips "REAL and INVERTED" and "optic nerve → brain".
- thbrain (TH): Ray's confessional; the brain gets its own tiny empty tip jar.
- lightsout: back in the bedroom: Kavya clicks off the lamp; `g.dark(1)`; the room goes dark blue.
- shift: Ray in the dark, a soft glow, puts on his cap, deadpan; an alarm clock shows 7:00 for tomorrow.

## 7 traps: The cast saves you some marks
- intro: "7 EXAM TRAPS" heading over a blackboard; the cast lined up.
- t1–t7: quick confessional cuts, one per speaker (Norman, Mirabel, Dennis, Violet, Ray, Rosie, Kavya), each with
  its trap on a card: 1 measure angles from the normal, not the surface; 2 plane-mirror image is virtual, not real;
  3 towards the normal only when slowing into a denser medium; 4 violet bends most, red least; 5 a prism separates
  colour, it does not add it; 6 objects reflect their own colour and absorb the rest; 7 eyes only receive light.
- return: the show logo returns: "LIGHT WORK will return".
- anyone (stinger): Indigo alone in an empty confessional, small, hopeful.
- course: Ray leans into frame, friendly, a thumbs-up-ish nod: "Course we did, Blue."
- indigo: Indigo, deadpan. Long hold (1.5 s); a single "blue?" swatch label flickers next to him and is crossed
  out to "INDIGO". Final frame: Indigo, the logo.

## Animation groups (suggested)
- A: cold (done), seeing.  B: mirror, pool.  C: prism, filter.  D: eye, traps.

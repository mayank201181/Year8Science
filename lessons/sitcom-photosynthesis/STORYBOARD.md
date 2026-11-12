# LIGHT WORK, Episode 1 "The Plant That Does Nothing": storyboard

Claude Sitcom, Ep 1 (Plants & Photosynthesis). A mockumentary (a documentary crew films; characters talk to
camera) that teaches Photosynthesis. Audience: a 12-year-old watching while eating. It must be FUNNY first and
teach every idea exactly. Read `script.py`: every line has a speaker (`who`); its caption shows the name.

**Premise.** Kavya, 12, has been given a pot plant (it is called Plant) to keep alive for a term, and she is sure it
does nothing. The crew goes inside one of its leaves and finds a solar-powered factory, run by Clive, a tired, dry
chloroplast who is sick of being mixed up with Phyllis, the diva chlorophyll who works inside him. Running gags:
"chloroPLAST, not chloroPHYLL"; Phyllis's "darling"; "You're welcome" (Cosmo, Kavya, then Olive); the Guards never
speak (until the stinger); the wardrobe incident; Plant drinks bubble tea all day.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'clive'), mood, look })`.
  The Guards are one speaker with two faces: `talk: scTalk(S, t, 'guards')` (the right face copies it).
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat: Clive goes
  `deadpan` at every silly remark; Phyllis `smug`/`happy`; Gus `happy` (always); Olive `deadpan`/`sad`; Cosmo `smug`
  (half-lidded, chilled); Dewi `shock`/`happy` and sweating (`sweat: 1`) when she has just arrived; the Guards
  `deadpan`, never move. Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** A line with a `pause` is followed by silence. Hold the reaction there: a slow push-in on
  Clive's deadpan face, the Guards not blinking, Olive staring, Kavya's flat look. Do not fill a pause with new info.
- **Confessionals (talking heads):** line ids starting `th`, and the lines marked TH below. Full stage
  `phConf(root, kind)` (`g.set(1, t)` blinks REC), the character big (s about 1.5) at about (430, 390), a prop where
  it helps. The first time a character speaks, show `phLower(root, kind)` for about 3 s (`win(t, a, a + 3.3, 0.3)`).
  Cuts are hard (`on(t, a, b)`, at most a 0.25 s fade): sitcom cuts are snappy.
- **Kavya** is in her bedroom (`phBedroom`), head and shoulders (`cast(root, 'kavya')`, s 1.3 to 2) or full body
  (`scKavyaBody`, kit poses). Her cutaways answer or ask the crew directly; she looks at camera (look 0) or at Plant.
- **Science on screen:** whenever a key word, equation or number is said, it appears big and clear (chip, card,
  whiteboard), with formulas built by `phChem` (real subscripts, coefficients in amber `C.glucose` or red). Jokes can
  be silly; the science must be exact. Colours: glucose amber hexagon, O₂ red pairs, CO₂ O=C=O grey/red, water blue
  with white H, chlorophyll/plants green, energy yellow sparks, starch blue-black, iodine orange-brown.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px; nothing overlaps text.
- Build every element once; `update(t)` is a pure function of t. Idle life (blinks, bob, Phyllis's tail, Cosmo's
  sway) comes from `t`; tone motion down when `S.reduce`. About 650 elements per scene at most.

## Cast (lib.js `cast(parent, kind, { s, mood })`)

| kind | who | look | lower third (`phLower`) |
| --- | --- | --- | --- |
| clive | Clive, a chloroplast: the tired, dry factory manager, straight man. Catchphrase: "Chloro-PLAST." | green oval, grana stacks, pale face patch, yellow hard hat, ID badge | CLIVE / Chloroplast. NOT chlorophyll. |
| phyllis | Phyllis, chlorophyll: diva, "darling", loves red and blue light, rejects green | round green face on four lobes, Mg gem, pink sunglasses pushed up, red + blue earrings, swishing tail | PHYLLIS / Chlorophyll. The green pigment. |
| cosmo | Cosmo, carbon dioxide: laid-back drifter, never hurries ("I diffuse.") | grey C face, red O each side, teal bucket hat; sways | COSMO / Carbon dioxide. Drifts in. |
| dewi | Dewi, water: breathless commuter, always just arrived "from the ROOTS" | blue round body, droplet tip, white H hair buns, lanyard; sweats | DEWI / Water. Up from the roots. |
| gus | Gus, glucose: over-keen new starter ("Is this my desk?") | amber hexagon with red ring-oxygen corner, cowlick, NEW sticker | GUS / Glucose. First day. |
| olive | Olive, oxygen: mopey teen, "the waste product" (secretly the most important) | red O2 capsule, purple beanie, headphones; default `deadpan` | OLIVE / Oxygen. The "waste product". |
| guards | The Guards, two guard cells: silent bouncers on the stoma door; say one word in the stinger | two green kidney cells either side of the pore, earpieces; `open` 0..1 | THE GUARDS / Guard cells. Stoma door. |
| kavya | Kavya, 12, owner of Plant: exasperated, sharp | scKavya (bust), scKavyaBody (full) | KAVYA, 12 / Owner of Plant. |

Sets: `phBedroom` (window, HDB blocks, the aircon compressor, sill with Plant, desk with lamp and bubble tea; day,
night), `phFactory` (inside Clive: grana machines, belt, the "DAYS WITHOUT A NAME MIX-UP: 0" board),
`phLeafSection` (the leaf as a building, `g.at`, `g.hi`), `phConf` (confessionals), `phTitle` + `phLogo` (title
card). A school lab bench for scene 6: draw it in that scene from kit art (`beaker`, `bunsen`, `testTube`) and
`phWaterBath`, `phTestLeaf`. Props: `phPlant`, `phLamp`, `phCompressor`, `phClock`, `phBoard`, `phChem`,
`phGraph`, `phXylem`, `phBubbleTea`. All documented in the lib.js header.

## 0 cold: Cold open (card: none)
- kavya: `phBedroom` (day, Plant on the sill). Kavya (bust, s 1.4) at about (840, 560) in front of the desk, annoyed,
  eyes on camera. Chips pop one by one: "Kavya, age 12", then a worksheet card "PLANT PROJECT: keep it alive for one
  term" (a sticky-note style card, tilted), with a small calendar chip "WEEK 6".
- nothing: tighter on Kavya (s 2), annoyed; lower third KAVYA. On "It just sits there" she side-eyes Plant (look -0.8);
  on "Being green" a little green chip "being green" next to Plant, ironically.
- name: hard cut to Plant, close: slow push-in on the pot; the sticky note "PLANT" readable.
- plant: Kavya (deadpan) says it. In the 0.9 s pause, cut to an extreme close-up of the sticky note "PLANT" (it is
  hand-written; one leaf droops a little). The pause is the joke.
- small: documentary zoom: a viewfinder (corner brackets, "ZOOM ×1 → ×1000") and a dashed reticle on the big right
  leaf; the camera pushes into the leaf. Chip "what Plant does all day".
- leaf: inside the leaf: a mosaic of tall palisade cells (green walls) each packed with chloroplasts (small green
  ovals); leader labels "leaf cells" and "chloroplasts", sub-chip "tiny green factories".
- this: zoom into one chloroplast; it turns out to be Clive (hard hat), who looks up, unimpressed (`neutral` → `deadpan`).
- hi (TH): Clive confessional (`phConf 'clive'`), lower third CLIVE. Key-word chip "chloroplast" (green) beside him.
- not: a two-panel card: left "chloroPLAST = the structure" with a little building icon (Clive's hard hat on a block),
  right "chloroPHYLL = the green pigment inside it" with a green paint drop. The PLAST / PHYLL syllables in big
  letters, PLAST in amber, PHYLL in green. Clive annoyed, then deadpan.
- exams: a pupil's exam answer: "Photosynthesis happens in the chlorophyll." with a red cross and "-1"; Clive deadpan.
- billion: cut to the factory floor (`phFactory`, lights on, belt moving): the safety board "DAYS WITHOUT A NAME
  MIX-UP: 0" is visible; a plaque "SOLAR POWERED SINCE: over a billion years ago". Clive in the middle with his
  clipboard (`scClipboard`), looking at it, neutral.
- does: back to the confessional, close (camera k 1.3), Clive deadpan. Slow push-in through the 1.0 s pause.
- title: `phTitle` + `phLogo` "LIGHT WORK" (logo pops), then "Episode 1: The Plant That Does Nothing"; the whole cast
  pops in below in a row, bobbing, in their default moods (Gus happy, Olive deadpan, Guards deadpan, Kavya annoyed,
  Clive deadpan, Phyllis smug). Hold it.

## 1 lights: Lights on
Layout: Kavya's window at sunrise, then the factory floor (`phFactory`) as the lights come on.
- seven: `phBedroom` at dawn (animate `night` 1 → 0 over the line), sun rises over the HDB blocks; `phClock` set to
  7 and a chip "7:00 AM". Then hard cut to the factory: `light` 0 → 1, beams fade up, machine lamps blink on, belt
  starts.
- lights: Clive on the factory floor, cupping his mouth, shouting up; happy-ish (it's work).
- phyllis: Phyllis sweeps in from the top (sunglasses on her head), poses in a sunbeam, `smug`; lower third PHYLLIS.
  Chip "chlorophyll = the green pigment".
- thphyllis (TH): Clive confessional, deadpan. Behind him, a row of tiny Phyllises (s 0.3) each striking a pose, one
  holding a microphone.
- job: Phyllis in a sunbeam; a "white" sunbeam splits into a rainbow fan (red, orange, yellow, green, blue, violet
  stripes); the red and blue stripes curve into Phyllis and she glows (energy sparks). Chip "absorbs light energy".
  On "Delicious" she licks her lips (happy).
- green: cut to Kavya at her desk (bust), smug, pointing at Plant: chip "absorbs green?" with a question mark.
- ugh: Phyllis, appalled (`shock` → `annoyed`), small "✗" over the green stripe.
- reflect: the green stripe bounces OFF Phyllis and travels into a big cartoon eye at the screen edge. Labels:
  "red + blue: absorbed ✓" and "green: reflected" with an arrow to the eye. "That's why leaves look green" chip.
- wears: Clive (in the factory) deadpan, side-eye at Phyllis, who is now wearing a green feather boa (her tail) like
  a fashion statement.
- word: title card in the factory: "PHOTO = light" + "SYNTHESIS = making" slide together into
  "PHOTOSYNTHESIS = making food, using light".
- soil: Kavya (bust), confident: a little card "plants eat soil?".
- producers: Clive, annoyed; chip "producers: make their own food"; a soil cross-section strip at the bottom with a
  root taking up blue water drops and two small mineral chips ("minerals"), and a red "✗ food" over the soil.
- three: a checklist board (`phBoard`) with three icons: sun "light ✓" (ticked, glowing), CO₂ molecule "carbon dioxide
  ?", water molecule "water ?". Clive taps his clipboard, looks at the door, annoyed.

## 2 tour: The factory tour
Layout: the leaf as a building: `phLeafSection`, a small Clive (s 0.55) as tour guide walking from part to part with
a clipboard and a little flag; each part glows (`g.hi`) and gets a building-style sign: ROOF, TOP FLOOR, DOWNSTAIRS,
DOORS, PIPES. Showpiece: the bubble-tea straw (transpiration).
- shape: start with a whole leaf (kit `leaf`, big) seen from above, then from the side (very thin). Chips "broad +
  flat = large surface area to catch light" and "thin = gases don't travel far". Then it slices open into the section.
- roof: `hi('cuticle')`; sign "ROOF: waxy cuticle"; chips "clear: lets light in" and "waterproof: keeps water in";
  sunlight passes through, a raindrop bounces off.
- top: `hi('palisade')`; sign "TOP FLOOR: palisade cells"; the chloroplasts inside twinkle; chips "packed with
  chloroplasts", "first to get the light", "most photosynthesis here". A VIP rope at the door, very exclusive.
- spongy: `hi('spongy')`; sign "DOWNSTAIRS: spongy layer"; the air spaces between the round cells glow pale blue;
  chip "air spaces: gases reach every cell".
- doors: `hi('stoma')` (and lower epidermis); the camera tilts down to the underside; chip "stomata (one: stoma)",
  "mostly on the underside".
- guards: cut to the stoma door, close: the Guards (`cast 'guards'`, s 1.3) either side of the pore, deadpan; they
  open (open 0 → 1) and close it once. Lower third THE GUARDS. Chips "guard cells: open and close the stoma",
  "control gas exchange + water loss".
- talk: hold on the Guards, arms folded, utterly still (`still: true`, no blink if possible); Clive (small, at the
  side) deadpan. The 1 s pause is the joke.
- cosmo: Cosmo drifts in through the open stoma from below, slowly turning, sunglasses-free but extremely chilled
  (`smug`); lower third COSMO. Chip "carbon dioxide (CO₂), from the air".
- diffuse: diagram: outside the leaf (bottom) many little CO₂ molecules (`molCO2`), inside few; an arrow "high
  concentration → low concentration" through the stoma; chip "diffusion". Cosmo drifting along the arrow.
- effort: chip "diffusion needs no energy"; Cosmo lies back on a pool float, drifting. Clive deadpan.
- dewi: Dewi bursts in from a pipe (`phXylem` mouth), puffing and sweating (`sweat: 1`, `shock` → `happy`), lower
  third DEWI. Chip "water (H₂O)".
- roots: cutaway: a root with root hair cells (long thin hairs) taking in water molecules; then a tall `phXylem`
  vessel up the stem with water rising. Labels "root hair cells" and "xylem: long, hollow tubes".
- up: Kavya (bust) in her bedroom, frowning at Plant: chip "water goes UP?".
- straw (showpiece): split screen: left, Kavya sipping her bubble tea (`phBubbleTea`, level dropping as she sips);
  right, the leaf with water molecules evaporating out of a stoma at the top and the whole column in the xylem moving
  up. Arrows "evaporation at the top pulls water up".
- transp: chip "TRANSPIRATION"; Plant on the sill drawn with a giant bubble-tea straw stuck in its pot. Clive deadpan.
- veins: back to the section, `hi('vein')`: zoom on the vein: "xylem: water IN" (blue arrow into the leaf, `hi('xylem')`)
  and "phloem: sugar OUT" (amber arrow, `hi('phloem')`), chip "veins".

## 3 recipe: The recipe
Layout: the factory (`phFactory`) as a kitchen-free production line: raw materials go into a grana machine; products
come out on the belt. A whiteboard (`phBoard`) for the equations. Showpiece: the atoms counted on both sides.
- go: Clive at the machine controls; Phyllis glows in the skylight beam; Cosmo and Dewi step onto the belt and ride
  into the machine (Dewi happy, Cosmo smug).
- join: inside the machine (cutaway window): light energy (yellow sparks) from Phyllis joins CO₂ and H₂O into a glucose
  hexagon. Chip "light energy joins carbon dioxide + water → glucose".
- gus: Gus pops out of the machine onto the belt, sparkling, `happy`, looking around; lower third GUS.
- thgus (TH): Clive confessional, deadpan; inset: Gus as a lunchbox with an energy spark inside; chip "light energy →
  stored as chemical energy".
- olive: Olive slumps out of the machine behind Gus, `deadpan`, headphones on; lower third OLIVE. Chip "oxygen (O₂):
  the by-product".
- rubbish: the Guards open the stoma and Olive drifts out, like a bin bag being put out (a little "RUBBISH" sign on
  the door). Olive sad.
- mine: Dewi (happy, proud, hand on hip) beside a diagram: a water molecule splitting; its O atoms pair up into an O₂
  (Olive's red colour); chip "the oxygen comes from WATER"; beside it, Cosmo with hands up and a red "✗" over a CO₂ → O₂ arrow:
  "not from carbon dioxide".
- word: whiteboard: the word equation builds term by term: carbon dioxide + water → glucose + oxygen (each term in its
  colour, with a tiny portrait of Cosmo, Dewi, Gus, Olive under it).
- cars: Kavya (bust) at her desk with flashcards; the initials light up: **C**ars **W**on't **G**o **O**n **G**rass
  lined up under carbon dioxide, water, glucose, oxygen.
- sun: Kavya pleased; a "+ sunlight" card slides in on the left side of the arrow. Hold the 1 s pause on Clive's face.
- arrow: the "sunlight" card is lifted off the left side and placed OVER the arrow, with "chlorophyll" UNDER the arrow;
  chip "light = the energy source, not a reactant".
- talent: Phyllis, smug, on top of the arrow like a stage, a spotlight on her; chip "needed, but not used up".
- eq: whiteboard: `phChem` "6CO_2 + 6H_2O → C_6H_12O_6 + 6O_2" with the 6s in amber; light/chlorophyll over the arrow.
- six: six small Cosmos (`molCO2`) line up under 6CO₂.
- sixw: six small Dewis (`molH2O`) under 6H₂O.
- one: ONE Gus (glucose) under C₆H₁₂O₆, shocked-proud; six O₂ under 6O₂. A price tag "VERY EXPENSIVE" on Gus.
- count: atom counters on both sides fill up: C 6 = 6, H 12 = 12, O 18 = 18 (grey, white, red counters), each pair
  ticked; then the 6s flash and a ghost version without them shows a red "doesn't balance ✗".

## 4 careers: Gus's careers day
Layout: a careers fair inside the factory: four booths (stalls with banners) in a row: RESPIRATION, STORAGE (starch),
CELL WALLS (cellulose), PROTEINS. Gus (with a name tag) visits each. Showpiece: Gus joining hands into a starch chain.
- noon: `phClock` 12, chip "12:00 noon"; many little glucose hexagons pour off the belt; a banner "CAREERS DAY".
- job: Gus, happy, holding a CV; Clive with clipboard, deadpan.
- resp: booth 1 "RESPIRATION: release energy": a mitochondrion (lib `mitochondrion`) with a mug, looking tired; glucose
  goes in, energy sparks come out. Chip "release energy". On "Very tired" the mitochondrion yawns.
- both: a day/night strip: "respiration: ALWAYS (day and night)" across both halves; "photosynthesis: only in light"
  across the day half only.
- starch: booth 2 "STORAGE": glucose hexagons click together into a long chain labelled "starch"; little stores in a
  leaf, a stem and a seed.
- chain: Gus, delighted, holding hands with copies of himself in a chain (they all smile).
- insol: a beaker of water: glucose dissolves (fades out, little hexagons spreading), starch stays as a solid lump;
  chip "starch is insoluble: doesn't upset the water balance".
- cell: booth 3 "CELL WALLS": glucose chains woven into fibres, building a plant cell wall like bricks; chip
  "cellulose: strong cell walls"; a little plant stands up straight.
- prot: booth 4 "PROTEINS": glucose + a "nitrates (from the soil)" chip → a protein chain (beads) → a plant grows
  taller; chip "for growth".
- rscp: the four booth banners light up in turn with the initials **R**eally **S**weet **C**runchy **P**lants; Gus
  dancing.
- mg: Phyllis taps the Mg gem on her forehead; chip "magnesium ions (from the soil) are needed to make chlorophyll".
- yellow: a leaf turns from green to yellow; chip "chlorosis"; then a chain of chips: "less chlorophyll → less light
  absorbed → less photosynthesis". Phyllis sad, fanning herself.
- talk: Phyllis turns away, hand up (`annoyed`), sunglasses down over her eyes.
- mass: a growing tree (three stages) with a big "?" and a soil pot labelled "the soil?" (most people's guess).
- me: Cosmo, smug: CO₂ molecules from the air stream into the tree; chip "most of the dry mass comes from carbon
  dioxide in the air". (The "dry mass" note: what is left when the water is removed.)
- wood: a log cross-section made of tiny Cosmo faces; chip "trees: mostly made from thin air". Cosmo smug, Clive deadpan.

## 5 limits: Kavya tries to help
Layout: Kavya's bedroom (`phBedroom`) for the human beats; the factory for the reactions; a rate graph (`phGraph`) on a
board. Showpiece: the graph rising and then going flat while the factory stalls.
- two: bedroom, `phClock` 14, chip "2:00 PM"; Kavya (full body, `scKavyaBody`) reading a "PROJECT" sheet.
- lamp: Kavya carries her desk lamp (`phLamp`) to the sill and switches it on (`set(1)`) over Plant; she is smug.
- rises: graph (`phGraph` kind 'plateau', x "light intensity"): the curve draws up as the lamp brightens; in the
  factory, belt speeds up, Gus after Gus pops out. Then the curve goes flat; the belt stays at the same speed.
- full: Kavya (bust), puzzled: chip "is it full?".
- notfull: factory: the CO₂ intake hopper is EMPTY (a sign "CO₂: OUT OF STOCK", Cosmo-shaped outline), Phyllis still
  glowing; Clive deadpan. Labels on the graph: rising part "light is limiting", flat part "CO₂ is limiting". On "In normal air, it often
  does": chip "in normal air, CO₂ is often the limiting factor"; Cosmo (small) shrugs, smug.
- define: card "LIMITING FACTOR = the factor in shortest supply"; two mini outcomes: "increase it → rate rises ✓",
  "increase anything else → no change".
- plateau: graph: the flat part glows, label "plateau = another factor is limiting" (NOT "plant is full", crossed out).
- lct: three icons (sun, CO₂, thermometer) with the initials **L**ight **C**ools **T**hings; labels "light intensity",
  "carbon dioxide concentration", "temperature".
- hot: Kavya eyes the aircon compressor outside the window (`hot` 1, heat shimmer), smug, holding Plant.
- enzymes: graph kind 'temp' (x "temperature"): rises to a peak at about 40–45 °C then crashes; label the peak
  "40–45 °C"; little enzyme shapes (Pac-Man-like) shown working, then melting out of shape: "denature".
- crash: Clive, sweating (`sweat: 1`), shock → begging; chip "shape destroyed → rate crashes".
- sunset: bedroom: sky goes to night (`night` 0 → 1), `phClock` 19, chip "7:00 PM"; factory lights off (`light` 0);
  chip "no light: photosynthesis stops", and a lit mitochondrion window "respiration: still on".
- night: night panel: plant with arrows "O₂ in" and "CO₂ out" (respiration only). Gus happy with a torch.
- day: day panel next to it: big arrows "CO₂ in" and "O₂ out", small respiration arrows the other way; chip
  "photosynthesis faster than respiration".
- opposite: two big arrows between "carbon dioxide + water" and "glucose + oxygen": "PHOTOSYNTHESIS: stores energy
  (needs light)" → and ← "RESPIRATION: releases energy (all the time)".

## 6 starch: The starch inspection
Layout: a school lab bench (draw it: worktop, tiled wall, safety poster), the test steps as numbered cards along the
top, the leaf (`phTestLeaf`) at the centre of every step. Clive and Phyllis watch from Plant on the bench (small, s
0.5) or in quick cutaways. Showpiece: the leaf going pale, then blue-black with the orange-brown foil strip.
- friday: lab; a calendar chip "FRIDAY"; Kavya in safety goggles; a clipboard "PROVE IT: test a leaf for starch";
  chip "spare glucose is stored as starch".
- destarch: card "DESTARCH: 1–2 days in the dark"; the plant in a dark cupboard; chip "uses up old starch".
- did: Kavya (bust, goggles), deadpan; inset: Plant inside her wardrobe between hanging clothes.
- remember: Clive confessional, haunted stare (`sad` → `deadpan`), very slow push-in; a single sad sock hanging in
  the corner of frame.
- foil: Plant with a foil strip on one leaf (`phPlant.set({ foil: 1 })`), sunlight on it; chip "foil = no light".
- boil: card "1. Boil in water"; beaker of boiling water on a Bunsen, the leaf goes in; chip "kills the leaf, breaks
  down membranes so iodine can get in".
- kevin: Clive (small, on Plant) looking at the beaker, then pointing at another leaf; a tiny chloroplast "KEVIN"
  name tag on the leaf in the beaker. Clive deadpan.
- ethanol: card "2. Boil in ethanol"; the leaf in a boiling tube of ethanol (`phWaterBath`); the ethanol turns green
  (`set({ green })`) and the leaf goes pale (`phTestLeaf pale` 0 → 1). Chip "removes chlorophyll".
- outrage: Phyllis, shock → annoyed, clutching her gem.
- safety: red safety card "ETHANOL IS FLAMMABLE": the Bunsen flame goes OFF (a crossed-out flame icon), the boiling
  tube stands in the hot water bath (`phWaterBath`). Chip "water bath, flame off".
- warm: card "3. Warm water: softens it" (leaf dipped), then card "4. Iodine solution": orange-brown drops from a
  dropper; chip "orange-brown → blue-black = starch".
- wewi: the four cards' initials light up: **W**e **E**nd **W**ith **I**odine (water, ethanol, warm water, iodine).
- result: `phTestLeaf` iodine 0 → 1: blue-black everywhere except the strip that was under the foil, which stays
  orange-brown; labels "starch ✓" and "no light → no starch"; Kavya happy.
- controls: two small panels: a variegated leaf (`phTestLeaf` with `{ variegated: true, strip: false }`) before
  (green middle, white edges) and after iodine (blue-black middle, orange-brown edges): "chlorophyll needed"; and a
  sealed flask with a leaf and a dish labelled "soda lime (absorbs CO₂)", the leaf stays orange-brown: "CO₂ needed".
- report: Kavya writing her report: big hand-written card "Conclusion: Plant does not do nothing." She underlines it.
- chain: a food chain across the screen: sun → Plant → a chicken → a plate of chicken rice; chip "photosynthesis
  starts nearly every food chain". Wink: if you are eating, your food began as sunlight.
- air: Olive in front of a world map / the sea: little O₂ bubbles rising from plants and from tiny plankton; Kavya
  breathing in. Chip "oxygen in the air comes from photosynthesis".
- main: Olive takes off her headphones; a spotlight; she is `smug` for the first time; a "MAIN CHARACTER" star on a
  dressing-room door.
- unbear: Clive confessional, deadpan, slow push-in.

## 7 traps: The staff save you some marks
- intro: heading "7 EXAM TRAPS", the whole staff lined up on the factory floor.
- t1–t7: quick confessional cuts, one per speaker (Clive, Phyllis, Cosmo, Olive, Gus, Dewi, Kavya), each with its trap
  on a numbered card (keep the card text exact):
  1 "chloroplast = the structure; chlorophyll = the green pigment inside it";
  2 "chlorophyll REFLECTS green; absorbs mainly red + blue";
  3 "light goes OVER the arrow (not a reactant); keep the 6s: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂";
  4 "photosynthesis: CO₂ IN, O₂ OUT (the reverse is respiration)";
  5 "plants respire ALL the time, not just at night";
  6 "a plateau means ANOTHER factor is limiting (not 'the plant is full')";
  7 "heat ethanol in a WATER BATH, flame OFF (flammable)".
- return: `phTitle` + `phLogo`: "LIGHT WORK will return".
- ask (stinger): the stoma door at dusk; the Guards (s 1.4) either side, deadpan; Clive (small) at the side asking.
  Hold 1.4 s of silence: the Guards do not move.
- closed: both Guards say "...Closed." (both mouths) and the stoma closes (`open` 1 → 0).
- stuck: the documentary camera view: the viewfinder with "REC", now pitch dark except the Guards' eyes; chip
  "Crew status: locked in until morning". Final frame: the Guards' eyes blink once, logo small in the corner.

## Suggested split for the animators
- A: 0 cold (done by the writer), 1 lights, 2 tour.
- B: 3 recipe, 4 careers.
- C: 5 limits, 6 starch, 7 traps.

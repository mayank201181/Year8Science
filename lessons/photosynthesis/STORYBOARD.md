# Photosynthesis: storyboard

What the screen shows while each line is spoken. Stage 1200 × 750; keep
x < 560, y < 100 clear for the chapter tag. Palette as in PLAYBOOK §5: glucose
amber hexagon (`molGlucose`), O₂ red pairs (`molO2`), CO₂ O=C=O (`molCO2`),
water red O + white H (`molH2O`), energy yellow (`spark`), plants green
(`C.plant`, `C.chloro`).

Shared art used across chapters (keep it identical wherever it appears):

- **Potted plant**: a stem (`C.stem`) carrying three or four kit `leaf`s, a
  terracotta pot and a soil band (`C.soil`), under kit `sun` at top right.
  Used in intro, bigidea, minerals and matters.
- **Leaf cross-section** (new art, about 700 × 420): waxy cuticle (thin pale
  band), upper epidermis (clear brick cells), palisade mesophyll (tall columns
  full of small `chloroplast`s), spongy mesophyll (round loose cells with pale
  blue air spaces), lower epidermis with one stoma between two sausage-shaped
  guard cells (`g.set(open 0..1)`), and one vein showing xylem (blue) and
  phloem (amber). Used in chloro (palisade line), leaf and supply; these three
  chapters are in one animator group so the art can be drawn once and copied.
- **Formula text with real subscripts**: copy the local `formula()` helper
  from `lessons/respiration/scenes/02_aerobic.js` (equations, matters, recap).
- **Rate graph**: axes "rate of photosynthesis" against a factor, curve drawn
  progressively with `pathLength` (limiting, recap t5).

## intro: Food from air, water and light

Night-blue sky, CO₂ molecules drifting slowly; a kit `person` on the left, the
potted plant on the right. Showpiece: one carbon atom's trip from the air into
a leaf as the sun comes up.

- **hook**: A kit `person` stands at left with a few grey carbon atoms
  (`atom(…, 'C')`) glowing inside the body outline; dotted trails run from each
  atom up into the air, where each sits inside a drifting `molCO2`. Label
  "carbon dioxide (invisible gas)".
- **grab**: The person fades. Kit `sun` rises at top right and a yellow beam
  lands on a kit `leaf`; one highlighted `molCO2` is drawn into the leaf and
  vanishes with a `spark` (showpiece). Three `chip`s pop up and get a `cross`
  each: "no mouth", "no muscles", "no machinery".
- **def**: Chips clear. "photosynthesis" types in at 60 px above the potted
  plant; three input chips ("carbon dioxide", "water", "light") slide in with
  `arrow`s to the leaf.
- **plan**: Roadmap row of three icons that pop in turn: a small leaf
  cross-section, a `molGlucose` hexagon, a blue-black leaf (starch test).

## bigidea: The big idea: making food from light

Left half: a word panel. Right half: the potted plant under kit `sun`, with a
cut-away pot so the roots show. Showpiece: the glucose "battery" charging with
light energy (store).

- **name**: "PHOTO | SYNTHESIS" splits apart: under "photo" a small kit `sun`
  and "= light"; under "synthesis" stacking bricks and "= making".
- **producers**: Word panel clears; `chip` "PRODUCER" lands on the plant; a
  knife-and-fork icon gets a `cross`, then "makes its own food" with a `tick`.
- **soil**: The pot becomes a cut-away; "food?" near the roots gets a `cross`;
  blue water drops and a few small mineral specks rise into the roots, labelled
  "water" and "a few minerals" (kit `labelLine`).
- **three**: Three inputs arrive at the leaf together: a yellow sunlight beam,
  `molCO2` from the air at left, `molH2O` up the stem from the soil. Labels:
  "light", "carbon dioxide (air)", "water (soil)".
- **chloro**: Zoom into the leaf: it glows green and the light beam sinks into
  it. Label "chlorophyll captures light".
- **glucose**: Inside the zoomed leaf, CO₂ and H₂O molecules slide together and
  become one amber `molGlucose`. Label "glucose (a sugar)".
- **oxygen**: Red `molO2` pairs float out of the leaf into the air. Label
  "oxygen: waste product".
- **store**: Showpiece. The hexagon becomes a lib `glucoseBattery`; yellow
  `spark`s from the light beam flow in and `g.set(level)` fills it. Two chips:
  "light energy → chemical energy".
- **later**: The battery drains as sparks travel to the plant's growing tip and
  a new leaf unfurls. Chip "respiration releases it".
- **dark**: The sun sets, the sky goes dark; water drops and CO₂ are still
  there, but the plant slowly droops and greys. Chip "no light → no new food".

## equations: The word and symbol equations

Equation band across the centre (y ≈ 280), atoms area below (y ≈ 430–650).
This is the mirror of Respiration's aerobic chapter: reuse its approach
(local `formula()` helper, braces under reactants and products, lib `atom`
balls). Showpiece: the 36 atoms rearranging (watch).

- **word**: The word equation types on: "carbon dioxide + water → glucose +
  oxygen".
- **cars**: The four first letters glow (C, W, G, O). A cartoon car rolls up to
  a strip of green grass and stops; "Cars Won't Go On Grass" lettering appears
  above it, each initial linked down to its word; the last G points to a small
  green plant.
- **reactants**: Car and grass fade. Braces draw under each side: "reactants
  (raw materials)" on the left, "products" on the right.
- **arrow**: A small kit `sun` labelled "light" drops onto the top of the arrow
  and a green chip "chlorophyll" onto the bottom; chip "energy source" by the
  sun.
- **notreactant**: A ghost "sunlight +" slides in at the left of the equation,
  then `strike` crosses it out with a red `cross`.
- **symbol**: The words morph into **6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂** (real
  subscripts), light and chlorophyll staying on the arrow.
- **coeff**: The big 6 pulses with a label "coefficient: how many molecules";
  then a small subscript glows with "atoms in one molecule".
- **count**: Below the left side, six `molCO2` and six `molH2O` appear in two
  rows; three tally chips count up: C 6, H 12, O 18.
- **watch**: Showpiece (3.2 s pause). All 36 atoms lift off, swirl and settle on
  the right as one glucose (six C, six O and twelve H in a hexagon-shaped
  cluster) and six `molO2` pairs. Keep the shuffle generic: do not show the
  CO₂ oxygens pairing up into O₂, because the last line says that oxygen comes
  from water.
- **right**: Tally chips on the right count C 6, H 12, O 18, each with a
  `tick`; chip "no atoms lost or made".
- **sixes**: Atoms clear back to the symbol equation; both big 6s on the left
  glow, and a chip reads "6 + 6 → 1 glucose".
- **water**: One `molH2O` splits apart in a yellow flash; its O atom joins
  another to rise as `molO2`, labelled "oxygen comes from water"; a `molCO2`
  beside it gets a small `cross`.

## chloro: Chloroplasts: why leaves are green

A zoom sequence: kit `leaf` → a palisade cell full of `chloroplast`s → one
large `chloroplast` → back out to a leaf for the light demo. Showpiece: white
light splitting, red and blue absorbed, the green ray bouncing into an eye
(reflect).

- **where**: Zoom from a kit `leaf` into one plant cell (green cell wall,
  vacuole) holding about ten lib `chloroplast`s; kit `labelLine`
  "chloroplasts".
- **packed**: Zoom into one chloroplast drawn large; its grana stacks glow in
  turn. Label "chlorophyll, in stacks of tiny discs".
- **absorb**: Back out: a white beam from kit `sun` fans into coloured rays
  (red, orange, yellow, green, blue, violet) that hit a large leaf; the red and
  blue rays sink in and turn into small `spark`s.
- **reflect**: Showpiece. The green ray bounces off the leaf to a big eye icon
  at right; the leaf brightens green. Label "green is reflected".
- **trap**: A trap card: "chlorophyll absorbs green" with `strike` and `cross`,
  replaced by "chlorophyll reflects green" with a `tick`.
- **words**: Split screen. Left: a kit `flask` of green liquid, "chlorophyll =
  the pigment". Right: a large `chloroplast`, "chloroplast = the structure".
- **palisade**: The top of the leaf cross-section (shared art) fades in: tall
  palisade cells crammed with chloroplasts, light rays arriving from above.
  Label "palisade cells".

## leaf: Leaf structure and adaptations

A big kit `leaf` under kit `sun`, then the shared leaf cross-section, labels
on the right with kit `labelLine`. Showpiece: the slice swinging open (slice),
and the guard cells opening the stoma (guard).

- **panel**: A large kit `leaf` basking under the sun; a solar-panel icon fades
  in beside it, then a small CO₂-in / O₂-out arrow pair: "solar panel +
  gas exchange".
- **flat**: The leaf turns face-on; a dashed outline traces its broad area as
  light rays land all over it. Label "large surface area".
- **thin**: The leaf rotates edge-on into a thin sliver; a short double arrow
  across it: "short distance for gases".
- **slice**: Showpiece (1 s pause). A cutting line sweeps across the leaf and
  the cut face swings out and grows into the full cross-section.
- **cuticle**: The top band glows; light rays pass straight through it and a
  water drop bounces back down off it. Label "waxy cuticle: cuts water loss,
  lets light through".
- **palisade**: The tall column cells light up, chloroplasts twinkling as the
  light reaches them first. Label "palisade mesophyll: most photosynthesis".
- **spongy**: The round cells below light up and the air spaces turn pale
  blue; a small `molCO2` wanders through the spaces to a cell. Label "spongy
  mesophyll + air spaces".
- **stomata**: The camera dips to the underside; a small `molCO2` drifts in
  through the stoma and a `molO2` drifts out. Label "stoma (many = stomata)".
- **guard**: Showpiece. The two guard cells swell and bow apart to open the
  pore, a CO₂ slips through, then they close again. Label "guard cells open
  and close it".
- **veins**: The vein highlights: blue water drops move in along the xylem and
  amber sugar hexagons move away along the phloem. Labels "xylem: water in",
  "phloem: sugars out".

## supply: Getting the raw materials in

Left: a tall potted plant with visible roots, root hairs and one highlighted
xylem tube up the stem. Right: the shared cross-section zoomed to one stoma.
Showpieces: dots diffusing through the stoma (diffuse) and water climbing the
xylem (xylem).

- **how**: Whole plant: `molCO2` in the air at top left labelled "air", water
  drops in the soil labelled "soil", both with `arrow`s to the leaf.
- **diffuse**: Showpiece. Zoom to the stoma: many CO₂ dots crowd outside and
  only a few are inside; dots drift through the pore from crowded to sparse.
  A horizontal gradient band runs "more concentrated → less concentrated".
- **usedup**: Inside, chloroplasts swallow the CO₂ dots (each one vanishes into
  a small glucose hexagon), so the inside stays sparse and the flow through the
  stoma speeds up. Chip "used up → faster diffusion".
- **noenergy**: A yellow `spark` with a `cross` over it: "no energy needed".
- **roots**: Back to the plant; zoom on one root hair cell, a long finger in the
  soil; blue water drops move into it.
- **xylem**: Showpiece (0.5 s pause). Water drops climb the xylem tube up the
  stem and into the leaf's vein; the view follows them upward.
- **transp**: Wisps of water vapour leave the leaf's stomata; with each wisp,
  the water column in the xylem ticks up a step. Label "transpiration".
- **out**: Back at the stoma, red `molO2` pairs diffuse out into the air.

## glucose: What happens to the glucose

A big `molGlucose` at centre left with four destination cards stacking on the
right (lib `card`, `arrow`), like the topic diagram. Showpiece: the two beakers
(insoluble).

- **jobs**: The glucose hexagon pops in; chip "4 uses".
- **resp**: Arrow to card 1, "respiration": glucose enters a small lib
  `mitochondrion` and `spark`s fly out; small sun and moon icons: "day and
  night".
- **both**: The potted plant appears small, with a green arrow in
  ("photosynthesis") and a red arrow out ("respiration"), and a `tick`: "both".
- **starch**: Card 2, "storage": hexagons link into a long chain that coils
  into a starch grain, which drops into small leaf, stem and seed icons.
- **insoluble**: Showpiece. Two kit `beaker`s of water: in one, glucose
  hexagons dissolve and spread with water arrows shifting around ("upsets
  water balance"); in the other, a starch grain sits undissolved with a `tick`
  ("insoluble: a perfect store").
- **potato**: A cut potato full of starch grains; an amber arrow runs down a
  stem from a leaf to it: "sugar sent down from the leaves".
- **cellulose**: Card 3: glucose chains line up into fibres and weave into a
  cell wall around a plant cell; a seedling stands up straighter.
- **proteins**: Card 4: a blue chip "nitrate" from the soil joins a glucose
  hexagon and they become a chain of beads ("protein"); a small oil drop
  appears beside it.
- **rscp**: The cards' initials R, S, C, P light up and the line "Really Sweet
  Crunchy Plants" writes beneath them.
- **oxygen**: Cards fade; `molO2` pairs float out of a leaf into the air, while
  a few curve back into a small mitochondrion inside it.

## minerals: Minerals, and mass from thin air

First half: two potted plants side by side, roots in soil with mineral ions.
Second half: van Helmont's willow in a pot on a balance. Showpiece: the
five-year time-lapse of the willow (willow), then the tree built from CO₂
(wood).

- **alone**: One potted plant; its roots light up as small ion chips ("nitrate",
  "magnesium") rise from the soil.
- **nitrate**: The "nitrate" chip climbs the stem and becomes protein beads; the
  plant grows a little taller. Label "nitrate → nitrogen → proteins".
- **short**: A second plant fades in beside it: shorter, with its older, lower
  leaves yellow. Label "short of nitrate".
- **magnesium**: A "magnesium" chip enters a lib `chloroplast`, which fills in
  green. Label "needed for chlorophyll".
- **chlorosis**: A third plant's leaves fade from green to yellow; incoming
  light arrows shrink and a lib `meter` for rate drops. Label "chlorosis".
- **question**: Plants clear. A sapling in a pot under a big "?", with small
  "?" arrows pointing from the soil, the water and the air.
- **willow**: Showpiece (0.3 s pause). Time-lapse: the willow grows from a twig
  to a tree as a year counter runs 1 to 5 and a mass readout climbs to "70+ kg".
- **soillost**: The pot's soil is weighed on a balance: "−60 g", a tiny crumb.
  Chip "not from the soil".
- **water**: A simple van Helmont figure with a watering can and a thought
  bubble "water!", then half a `tick`: "partly right".
- **dry**: Water drops evaporate out of the tree, leaving a "dry mass" block; a
  pie chart beside it is almost all CO₂-coloured, with thin slices for "water"
  and "minerals".
- **wood**: Showpiece. `molCO2` stream in from the air; grey carbon atoms peel
  off and stack up into the trunk and branches. Chip "wood from thin air!"

## limiting: Limiting factors: what sets the speed

Left: three vertical lib `meter`s (light, CO₂, temperature) feeding a rate
gauge; right: the shared rate graph. Last line: a pondweed kit `beaker`.
Showpiece: the curve rising and bending into a plateau (plateau).

- **define**: Three `meter`s labelled light, CO₂ and temperature; the lowest one
  glows red: "limiting factor".
- **rule**: The red meter rises and the rate gauge rises with it; then another
  meter rises and the rate gauge stays still.
- **three**: Meters clear; three icons pop in: kit `sun` "light intensity",
  `molCO2` "carbon dioxide concentration", lib `thermometer` "temperature".
- **lct**: The initials L, C, T glow under the icons: "Light Cools Things".
- **light**: Graph axes appear (rate against light intensity); a light slider
  moves right and the curve draws upward.
- **plateau**: Showpiece (0.5 s pause). The curve bends and levels into a flat
  plateau; the flat part shades in and is labelled "another factor is
  limiting", with a dashed line at the bend.
- **notfull**: A thought bubble "the plant is full" gets a `cross`; chip
  "another factor: CO₂ or temperature".
- **co2**: The x-axis relabels to "carbon dioxide concentration" and the same
  rise-and-plateau curve redraws.
- **temp**: The x-axis relabels to "temperature" with a `thermometer` beside
  it; the curve rises as the thermometer climbs.
- **denature**: Past a marker "40–45 °C" the curve peaks and plunges; a small
  enzyme shape beside it warps out of shape. Label "enzymes denature".
- **grower**: A glass greenhouse: lamps switch on, a CO₂ cylinder puffs, a
  heater glows orange, and the plants inside grow faster.
- **pondweed**: A kit `beaker` of water with green pondweed on a windowsill
  under kit `sun`; lib `bubbles` stream up, labelled "oxygen". The scene dims to
  night and the bubbles slow to a stop.

## starch: Testing a leaf for starch

A lab bench from left to right: kit `beaker` of water on kit `bunsen`, a kit
`testTube` of ethanol standing in a water-bath `beaker`, a warm-water
`beaker`, and a white tile with an iodine dropper. A pale-green leaf moves
along the steps. Showpiece: iodine turning the leaf blue-black (add).

- **proof**: Glucose hexagons inside a leaf link into starch grains; a
  magnifier over them reads "starch = proof".
- **iodine**: On the white tile, the dropper drips orange-brown iodine onto a
  starch blob and it turns blue-black. Two swatches: "no starch: orange-brown",
  "starch: blue-black".
- **boil**: "Step 1" tag; the leaf dips into the boiling water on the Bunsen
  (`g.set('blue')`, lib `bubbles`); a small cell outline beside it bursts.
- **ethanol**: "Step 2"; the leaf goes into the ethanol test tube in the water
  bath; green bleeds out into the ethanol (`g.set(level, green)`) and the leaf
  goes pale.
- **safety**: The Bunsen flame goes out (`g.set('off')`); a flame icon near the
  ethanol gets a `cross`: "flammable"; label "water bath".
- **warm**: "Step 3"; the pale, stiff leaf dips into warm water and relaxes.
- **add**: Showpiece (0.6 s pause). "Step 4"; iodine drips onto the leaf on
  the tile and blue-black spreads across it.
- **wewi**: The four step tags light up in turn under "We End With Iodine":
  water, ethanol, warm water, iodine.
- **destarch**: The bench clears. A potted plant goes into a dark cupboard; a
  "1–2 days" clock spins and the starch grains in its leaf fade away.
- **proves**: The plant comes back into light and fresh starch grains appear:
  "new starch: made during the experiment".
- **variegated**: A variegated leaf (green centre, white edges) is tested; only
  the green part turns blue-black.
- **foil**: A leaf with a foil strip across it; after testing, the strip stays
  orange-brown and the rest is blue-black.
- **sodalime**: A leaf sealed in a kit `flask` with soda-lime granules at the
  bottom; CO₂ molecules sink into the granules. Tested, it stays orange-brown,
  next to a normal leaf that has gone blue-black.

## matters: Why it matters: food, oxygen, respiration

First half: a food chain under kit `sun`, the ocean and a big tree. Second
half: the two-way cycle diagram (as in the topic's diagram) with a day and
night sky behind it. Showpiece: day turning to night with the gas arrows
flipping (day, night).

- **chain**: Sun → grass → rabbit → fox draws left to right with `arrow`s;
  yellow `spark`s hop along the chain.
- **plate**: A dinner plate with bread, an apple and a burger; a dotted line
  traces from each back to a plant icon.
- **oxygen**: `molO2` rise from land plants and from tiny green plankton dots
  in ocean waves; a bar splits half and half: "≈ half from ocean plankton".
- **carbon**: A big tree draws `molCO2` in from the air; a counter climbs to
  "20+ kg a year". Label "helps control the greenhouse effect".
- **opposite**: The cycle: "carbon dioxide + water" on the left, "glucose +
  oxygen" on the right; a green arrow across the top ("photosynthesis") and a
  red arrow back along the bottom ("respiration").
- **photo**: The top arrow highlights with its word equation; chips "stores
  energy" and "needs light" (small kit `sun`).
- **resp**: The bottom arrow highlights with its word equation; chips "releases
  energy" and "all the time" (`spark`).
- **day**: Showpiece. Bright sky: a plant with a big green CO₂-in arrow and O₂
  out, and only a small red respiration arrow.
- **night**: The sky darkens to moon and stars; only the respiration arrows
  remain: O₂ in, CO₂ out.
- **comp**: Dawn colours; the two arrows are equal and a balance beam levels
  out. Label "compensation point".
- **today**: A field of rice with a lib `meter` "1–2% of light stored"; a lab
  `flask` icon, and the meter nudges up as a taller crop grows.

## recap: Recap: memory hooks and exam traps

A deck of cards, as in Respiration's recap: four mnemonic cards, then five
numbered trap cards (wrong version struck with `strike` and `cross`, right
version with `tick`). Showpiece: the four mnemonic cards fanning out together
before the traps.

- **lock**: Title "Lock it in" with a padlock that clicks shut.
- **cars**: Card 1: "Cars Won't Go On Grass" over the word equation.
- **rscp**: Card 2: "Really Sweet Crunchy Plants" with four small icons
  (spark, starch grain, cell wall, protein beads).
- **lct**: Card 3: "Light Cools Things" with sun, CO₂ and thermometer icons.
- **wewi**: Card 4: "We End With Iodine" with four small beaker icons; the four
  cards fan out together.
- **traps**: Cards sweep away; heading "5 exam traps" with a warning triangle.
- **t1**: Trap 1: "absorbs green" struck; a green ray bouncing off a leaf.
- **t2**: Trap 2: pigment (green flask) vs structure (`chloroplast`) side by
  side.
- **t3**: Trap 3: "sunlight +" struck; light on the arrow; the 6s glow in the
  symbol equation.
- **t4**: Trap 4: a plant under sun and moon, a respiration `spark` in both:
  "all the time".
- **t5**: Trap 5: a small rate graph with its plateau labelled "another factor".

## quiz: Quick-fire quiz

As Respiration's quiz: a question card with a lib `ring` countdown during each
4-second pause, then the answer card with one icon. Showpiece: the answer
reveals.

- **intro**: Title "Quick-fire quiz!" with five empty answer dots.
- **q1**: Question card; `ring` counts down.
- **a1**: Chips "carbon dioxide" + "water" with `molCO2` and `molH2O`.
- **q2**: Question card; `ring`.
- **a2**: A leaf with the green ray bouncing off it.
- **q3**: Question card; `ring`.
- **a3**: Stoma close-up between two guard cells, labelled "stomata".
- **q4**: Question card; `ring`.
- **a4**: A test tube of ethanol turning green beside a pale leaf.
- **q5**: Question card; `ring`.
- **a5**: A tree drawing in `molCO2`, chip "from the air".
- **outro**: "Brilliant work" with a button-style chip "Photosynthesis quiz →
  Science Lab".

## Suggested split for the animators

Five groups, balanced by length (estimated seconds) and difficulty:

1. **intro, bigidea, equations** (about 190 s). Potted plant and sun; the
   atom rearrangement is the hardest beat (start from Respiration's
   `02_aerobic.js`).
2. **chloro, leaf, supply** (about 190 s). Owns the shared leaf
   cross-section: draw it once and copy it into all three scenes.
3. **glucose, minerals** (about 155 s). Cards, beakers, the willow time-lapse.
4. **limiting, starch** (about 185 s). Rate graph and the lab bench (kit
   `beaker`, `testTube`, `flask`, `bunsen`).
5. **matters, recap, quiz** (about 210 s). Food chain and gas-exchange cycle;
   recap and quiz are mostly cards.

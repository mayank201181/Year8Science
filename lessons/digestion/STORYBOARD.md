# Food & Digestion: storyboard

What the screen shows for every narration line in `script.py`. Line ids are the
animation cues. Durations come from `timeline.json`.

## Shared look for this lesson

- **Molecules** (used in `why`, `enzymes`, `villi`): **starch** is a chain of
  small amber hexagons (lib `molGlucose` at about 0.35 scale, linked by short
  bonds) and **glucose** is one hexagon; **protein** is a chain of round beads in
  four colours (coral `#FF8A80`, teal `#4DD0C8`, lime `#B5E655`, violet
  `C.ethanol`) and an **amino acid** is one bead; **fat** is a comb: a short cream
  glycerol bar (`#FFF0B8`) with three orange zig-zag fatty-acid tails (`#FFB347`).
  Digested, the comb splits into the bar and three loose tails.
- **Enzymes**: rounded blobs with a notch (the active site) that the matching
  molecule clicks into. Amylase sky blue (`C.water`), protease magenta
  (`C.lactic`), lipase orange (`C.heat`). **Bile** is green (`#7FBF4D`) droplets.
- **The gut** (used in `intro`, `canal`, `villi`, `egestion`): a faint torso
  outline with the alimentary canal as one continuous pink tube (`#F4A6B8`,
  stroke `#B8466A`): lips, oesophagus, a J-shaped stomach, coiled small
  intestine, a wider brown-pink large intestine framing the coils, rectum, anus.
  Helpers outside the tube: liver (dark red `#A8323E`, top left of the abdomen),
  gall bladder (small green sac under it), pancreas (yellow `#F2C14E`, behind the
  stomach). Food is a soft amber **bolus**. Labels with kit `labelLine`.
- **Food-test colours**: iodine orange-brown `#C67A2E` to blue-black `#1B2140`;
  Benedict's blue `#3D7BE0`, green `#5BB55B`, yellow `#E8D24A`, orange
  `#F08A2E`, brick-red `#B33A2A`; biuret blue `#5B8DEF` to lilac `#A77BD8`;
  emulsion clear to cloudy white. Use kit `testTube`, `beaker`, `bunsen`
  (`g.set(level, colour)` changes the liquid colour).
- **Blood** is a red capillary (`C.blood`) with glucose and bead molecules
  flowing in it. Energy is the lib `spark`, as in Respiration.
- A shared topic `lib.js` is not written yet. The gut, the molecule set and the
  villus are each used by more than one chapter, so the split below keeps those
  chapters together.

## intro: Taking lunch apart, molecule by molecule

Dark stage, a torso silhouette in the centre. Art: the gut tube, two simple car
silhouettes, a sandwich, molecule set.

- `hook`: The coiled canal glows inside the silhouette, then **unspools** to the
  right into one straight tube, laid beside two car outlines parked end to end
  that match its length. **Showpiece.**
- `acid`: The tube recoils into the body; zoom to the stomach, where a sandwich
  bobs in bubbling acid (lib `bubbles`, amber-green tint) and crumbles into
  small molecule beads. A large "?" over the stomach wall as the question is asked.
- `def`: The beads drift through the gut wall into a red capillary and flow
  away. Title "Digestion" fades in above.
- `plan`: Three roadmap chips (lib `chip`): a plate ("Balanced diet"), a test
  tube ("Food tests"), a sandwich on a path ("The journey"). They light in turn.

## diet: A balanced diet: seven nutrient groups

A big plate on the left (x ≈ 330) that fills sector by sector; a column of
nutrient cards on the right. Art: new food icons (bread, egg, fish, butter, oil
drop, orange, broccoli, milk, steak, wholegrain ear, water drop), lib `card`,
`chip`, `cross`, `tick`.

- `balanced`: An empty plate; seven blank sectors outline themselves; "7 nutrient
  groups" label.
- `crazy`: The mnemonic in big type, one word at a time, first letters in yellow
  (as in Respiration's recap); each word drops its nutrient name onto a sector.
  **Showpiece**: the plate is complete as "Wet" lands.
- `carbs`: The carbohydrate sector lifts out; bread, rice, pasta, potato icons
  around it; an energy `spark` with "main energy source".
- `protein`: Protein sector: meat, fish, egg, beans, nuts; a small brick wall
  rebuilding itself, "growth and repair".
- `fats`: Fats sector: butter, oil drop, cheese, nuts; three mini badges: battery
  "energy store", scarf "insulation", shield over an organ "protection".
- `fatok`: A "Fat = bad" sign gets struck out (lib `strike`); a balance scale
  appears with "energy in" and "energy out" pans level.
- `vitamins`: Vitamins sector: an orange and broccoli, chip "vitamin C", a
  "tiny amounts" pinch icon.
- `minerals`: Minerals sector: steak to a red blood cell ("iron"); milk to a
  bone and tooth ("calcium").
- `fibre`: Fibre sector: wholegrain ear, apple, veg; a gut tube where fibre bulk
  pushes food along; "not digested" chip.
- `water`: Water sector: a water drop over a body outline filling two-thirds
  full (blue level); small molecules dissolving in it.
- `variety`: Fibre and water cards show "0 energy" then a `tick` "essential";
  a single food (an apple) cannot fill the plate (`cross`); a mixed plate gets a
  `tick`.
- `label`: A food label card slides in; its rows (energy, fat, carbohydrate,
  protein, fibre, salt) light up and link to the plate sectors.

## deficiency: Deficiency diseases and energy needs

Four illness cards in a 2×2 grid, then an energy-needs chart. Art: new icons
(gums, bent leg bones, red blood cells, gut), a sailing ship, oranges and
lemons; kit `person` (with `runPose`/`walkPose`) and `sun`; lib `meter`, `card`,
`cross`, `tick`.

- `missing`: A nutrient icon is removed from a plate; a "deficiency disease"
  card appears.
- `germ`: A cartoon germ appears and is crossed out (lib `cross`): "a lack, not a
  germ".
- `scurvy`: Card 1: an orange with a red cross; gums with red spots; a slow
  healing cut. Label "vitamin C → scurvy".
- `lind`: Card 1 flips to a sailing ship on a kit `sineWave` sea; a crate of oranges and lemons
  comes aboard and a sailor's face goes from pale to healthy; "1747" chip.
- `rickets`: Card 2: two leg bones that bow outward; label "vitamin D or calcium
  → rickets".
- `sun`: A calcium icon passes from the gut into a bone, which straightens; kit
  `sun` shines on skin, with fish and egg icons: "vitamin D".
- `anaemia`: Card 3: a blood vessel with few red blood cells carrying few O₂
  pairs (lib `molO2`); a pale, tired face; "iron → anaemia".
- `constipation`: Card 4: a gut tube with waste stuck; "fibre → constipation".
- `energy`: Chart axes appear; five factor chips pop in turn: age, activity, body
  size, sex, pregnancy.
- `teen`: Three kit `person` figures with bars rising behind them: an office
  worker at a desk (short bar), a teenager (tall), an athlete running with
  `runPose` (tallest). **Showpiece.**
- `balance`: A balance scale: "energy in" heavier tips down with a body getting
  wider; lighter tips up with a tired face; the scale levels with a `tick`
  "balance".

## tests: Testing foods in the lab

A lab bench across the bottom; four kit `testTube`s in a rack, filled with a
pale food mixture. Art: kit `testTube`, `beaker` (water bath), `bunsen`; lib
`thermometer`, `heatWaves`, `tick`, `cross`, `chip`.

- `how`: Four tubes labelled starch, sugar, protein, fat; a colour wheel chip
  "colour change".
- `iodine`: A dropper adds orange-brown iodine to tube 1; it darkens to
  blue-black. Chip "starch: blue-black".
- `backwards`: Side by side: a no-starch tube that stays orange-brown and the
  blue-black one; arrow "orange-brown → blue-black" only one way.
- `benedict`: Blue Benedict's solution added to tube 2; the tube goes into a kit
  `beaker` water bath over a kit `bunsen` (`set('blue')`); lib `heatWaves`
  rise.
- `sweep`: The tube colour sweeps blue → green → yellow → orange → brick-red, a
  colour strip under it filling in step. **Showpiece.**
- `heat`: The Bunsen turns off and a second (cold) tube stays blue; lib `cross`
  "no heat, no result".
- `biuret`: Biuret added to tube 3; blue turns to purple/lilac.
- `fat`: Tube 4: food shaken with ethanol, then poured into a beaker of water;
  a cloudy white emulsion blooms.
- `strength`: Three sugar tubes in a row (green, orange, brick-red) with an
  arrow "more sugar".
- `control`: A fifth tube of plain water stays its starting colour; label
  "control: what negative looks like".

## why: Why food must be digested

Cutaway of the gut wall as a horizontal membrane at y ≈ 420 with tiny gaps;
gut on top, blood capillary underneath. Art: molecule set, lib `arrow`,
`chip`, `meter`; a zip-lock bag for the experiment.

- `big`: A starch chain and a protein chain wriggle in the gut; label "large,
  insoluble".
- `wall`: They bump against the gut wall and bounce off: too big for the gaps.
- `digestion`: Enzyme scissors snip the chains into single units.
- `absorbed`: The small units slip through the gaps into the capillary and flow
  off to a cell, which sparks (lib `spark`). **Showpiece.**
- `starch`: Equation row 1: starch chain → glucose hexagons.
- `protein`: Row 2: protein chain → amino acid beads.
- `fat`: Row 3: fat comb → glycerol bar + three fatty-acid tails; "and" in yellow.
- `mech`: The rows fade; a bread chunk is crushed into smaller crumbs (teeth
  icon, then a churning stomach outline): "mechanical".
- `chem`: Zoom on one crumb: an enzyme snips a bond with a flash: "chemical".
- `area`: One cube splits into eight smaller cubes; their total surface glows
  and a surface-area `meter` rises.
- `bag`: A zip-lock bag of bread and water, squeezed by two hands in waves; the
  bread turns to smooth mush.

## canal: The alimentary canal: mouth to anus

The full gut diagram fills the centre-left; organ labels with kit `labelLine`
on the right. A bolus travels down the tube, and each organ lights as it is
named. Art: the gut, bolus, lib `bubbles`, `chip`, `cross`, `tick`.

- `tube`: The whole canal draws itself from mouth to anus in one stroke; title
  "alimentary canal".
- `mouth`: Lips and teeth chew; saliva droplets with amylase blobs; the food
  rolls into a glossy bolus.
- `oesophagus`: The bolus slides down the oesophagus.
- `stomach`: The stomach churns (wall wobble), acid `bubbles`, protease blobs.
- `mucus`: Close-up of the stomach wall: a shiny green-white mucus layer between
  the acid and the cells; lining cells pop and are replaced along the wall.
- `small`: The mush flows into the coiled small intestine; small molecules seep
  into a red capillary.
- `notjust`: A "stomach only?" chip is struck out; the mouth and small intestine
  glow with "starts" and "finishes".
- `large`: Water droplets leave the large intestine; the waste gets drier and
  darker.
- `rectum`: The waste collects in the rectum and leaves through the anus.
- `anchovies`: The seven parts light in order as each mnemonic word appears,
  first letters yellow. **Showpiece**: the full path glows end to end.
- `helpers`: Liver, gall bladder and pancreas appear outside the tube; a green
  bile duct and a yellow enzyme duct feed into the small intestine.
- `notcanal`: The three helpers get a dashed outline and a `cross` against "part
  of the canal"; the bolus path visibly bypasses them.

## enzymes: Enzymes and bile: the chemical workers

Centre stage of molecules on a dark band. Art: molecule set, enzyme blobs, bile
droplets, lib `chip`, `tick`, `cross`, `meter`; a washing-machine drum (new).

- `catalysts`: An amylase blob snips a starch chain again and again; chip
  "biological catalyst"; the enzyme is unchanged after each snip.
- `notalive`: A heart-beat line is crossed out ("not alive"); a counter ticks up
  as the same enzyme breaks molecule after molecule.
- `amylase`: Amylase (blue) + starch → sugars; tiny icons: salivary glands,
  pancreas.
- `protease`: Protease (magenta) + protein chain → amino acid beads; icons:
  stomach, pancreas.
- `lipase`: Lipase (orange) + fat comb → glycerol + fatty acids; icon: pancreas.
- `names`: The three enzyme names with the matching letters in yellow: P/p, L/l,
  A/a.
- `specific`: Lock and key: protease's notch tries a starch chain (no fit,
  `cross`), then a protein (click, `tick`).
- `lactose`: A milk glass; lactose molecules arrive but the matching enzyme
  slot is empty; a grumbling tummy icon.
- `conditions`: Two pH chips: the stomach "acid" with protease, the small
  intestine "slightly alkaline" with amylase and lipase.
- `bile`: Liver makes green bile, gall bladder stores it, a duct releases it;
  "not an enzyme" chip.
- `emulsify`: One big yellow fat globule; green bile droplets hit it and it
  **shatters into dozens of tiny droplets**; a surface-area `meter` jumps; then
  lipase blobs swarm the droplets. **Showpiece.**
- `neutralise`: An acid wave meets green bile; a pH chip slides from acid to
  slightly alkaline; the small-intestine enzymes perk up.
- `washing`: A washing-machine drum; a T-shirt with blood and grease stains;
  protease and lipase blobs eat the stains away at a low-temperature dial.

## villi: Absorption, villi and peristalsis

Starts on the small-intestine wall, zooms into one villus (centre, about 420
tall), then pulls back to the whole gut. Art: villi row (as in the
`bonusDiagrams` "Villi" picture), one big villus with red capillary mesh and
cream lacteal, molecule set, kit `labelLine`, lib `meter`, `chip`.

- `absorb`: Digested molecules in the small intestine slide across its wall into
  the blood.
- `villi`: The wall's surface rises into a forest of finger-like villi; one
  highlighted, "villus".
- `zoom`: Camera zooms into that villus; four empty label slots appear.
- `area`: Label 1 "large surface area"; the folded lining unrolls into a flat
  sheet that grows into half a badminton court outline (a small `person` for
  scale). **Showpiece.**
- `thin`: Label 2: the villus wall shows a single row of cells; a molecule
  crosses in one short hop.
- `blood`: Label 3: capillary mesh pulses red; glucose and amino acids are
  carried away, so more keep moving in.
- `lacteal`: Label 4: the cream lacteal in the core takes in fatty acids and
  glycerol.
- `bloody`: The four labels shrink into a stack: Big, Thin, Bloody, Lacteal,
  first letters yellow.
- `water`: Pull back to the gut: the leftovers move into the large intestine;
  water droplets leave; the waste gets solid.
- `microbes`: The large intestine fills with tiny wobbling bacteria nibbling
  fibre strands; chip "science today".
- `peristalsis`: A straight section of gut: a ring of muscle squeezes behind a
  bolus and the squeeze travels along, pushing it; a toothpaste tube squeezed
  beside it.
- `upside`: The person and gut flip upside down; peristalsis still carries the
  bolus "up".
- `acid`: Back to the stomach: acid bubbles pop germs (crossed); protease blob
  glows with an "acid" chip.

## teeth: Teeth and mechanical digestion

A big open-mouth jaw diagram (upper and lower teeth in an arc) on the left,
tooth cards on the right. Art: new teeth (incisor chisel, canine point, premolar
two-cusp, molar multi-cusp, ivory `#F5EEDC`), apple/carrot pieces, lib `meter`,
`chip`, a cracker.

- `begin`: A side-view head outline with a glowing mouth; the view zooms into
  the open mouth until the jaw fills the stage.
- `physical`: A carrot chunk is chopped into smaller pieces; a "chemically
  changed?" chip is crossed; the surface-area `meter` rises.
- `four`: Four tooth types light up around the jaw arc, colour-coded.
- `incisors`: Incisor card: chisel shape slices an apple. Arrows: "cut, bite".
- `canines`: Canine card: pointed tooth grips and tears a strip of meat.
- `premolars`: Premolar card: two-cusped tooth crushes a nut.
- `molars`: Molar card: big tooth grinds pieces into pulp. **Showpiece**: the
  apple passes along the jaw, cut, torn, then ground.
- `bolus`: The pulp, wetted by saliva, rolls into a shiny ball: "bolus".
- `cracker`: A cracker on a tongue with a 60-second clock; a taste meter moves
  from "bland" to "sweet".
- `amylase`: Zoom into the cracker: amylase blobs snip starch chains into small
  sugars.
- `care`: A toothbrush brushes a tooth twice (×2 chip); a sugary drink is struck
  out.

## egestion: Egestion and excretion: not the same

Split screen: left panel "Egestion" (amber), right panel "Excretion" (blue).
Art: gut tube from `canal`, lib `animalCell`, `molCO2`, `lungs`, new kidneys
(two beans) and a bladder drop, lib `tick`, `cross`, `chip`.

- `two`: Two title cards slide in from each side: "egestion" and "excretion",
  with a "≠" between them.
- `egestion`: Left: fibre strands, dead cells and leftovers travel down the gut
  tube and leave as faeces.
- `never`: The gut lumen is drawn as "outside" the body (a dashed line along the
  wall); the faeces never cross it; chip "never absorbed".
- `excretion`: Right: an animal cell running its reactions makes waste
  molecules inside it.
- `co2`: CO₂ (lib `molCO2`) leaves the cell, travels in the blood to the lib
  `lungs`, and is breathed out.
- `urea`: The liver turns spare amino-acid beads into urea; the kidneys filter
  it into urine. **Showpiece**: the two waste routes run side by side.
- `salts`: Water drops and salt crystals join the urine; sweat drops on skin.
- `test`: A decision card: "From food never used? → egestion" (left lights) /
  "From the body's own reactions? → excretion" (right lights).

## recap: Recap: memory hooks and exam traps

Same layout as Respiration's recap: a padlock clicks shut, four memory-hook
cards build a 2×2 grid (first letters in yellow), then five trap cards, each
with the wrong idea struck out and the right idea ticked plus a small picture.

- `lock`: Padlock clicks shut: "Lock it in".
- `crazy`: Card 1: Crazy People Find Very Many Fish Wet, with the plate icon.
- `anchovies`: Card 2: My Old Stomach Sometimes Loves Roast Anchovies, with a
  mini gut.
- `names`: Card 3: Protease–protein, Lipase–lipids, Amylase–starch, enzyme
  blobs.
- `villus`: Card 4: Big, Thin, Bloody Lacteal, mini villus. **Showpiece**: the
  2×2 grid complete.
- `traps`: Grid fades; "5 exam traps" title with five empty slots.
- `t1`: Benedict's tube: cold (blue, cross) vs heated (brick-red, tick).
- `t2`: Iodine: "blue-black → orange-brown" struck; "orange-brown → blue-black"
  ticked.
- `t3`: "Bile digests fat" struck; bile emulsifies, lipase digests, ticked.
- `t4`: Liver, gall bladder and pancreas with "in the canal" struck.
- `t5`: Fat comb → fatty acids AND glycerol (the "and" in yellow); protein →
  amino acids.

## quiz: Quick-fire quiz

Same layout as Respiration's quiz: five progress dots top right, a question
card, a countdown lib `ring` through each 4-second pause, then the answer with a
small picture; outro sparks.

- `intro`: Speech bubble with "?" and "Say it out loud!"
- `q1`: Question card; a test tube beside a Bunsen; ring counts down.
- `a1`: "Benedict's: brick-red" with the tube turning brick-red; dot 1 fills.
- `q2`: Question card with a fat comb; ring.
- `a2`: "Lipase → fatty acids + glycerol"; dot 2.
- `q3`: Question card with an orange; ring.
- `a3`: "Vitamin C" with the scurvy card; dot 3.
- `q4`: Question card with a villus; ring.
- `a4`: Four mini labels: area, thin wall, blood supply, lacteal; dot 4.
- `q5`: "True or false?" card with a toilet-free gut icon; ring.
- `a5`: "False: egestion" with the faeces-never-absorbed picture; dot 5.
- `outro`: "Brilliant work!" with a burst of lib `spark`s and a "Food &
  Digestion quiz" button. **Showpiece**: all five dots full as the sparks
  burst.

## Suggested split for the animators

Four groups of three, balanced by length and difficulty (chapter lengths from
`timeline.json`; the whole lesson is 14.6 minutes). Chapters that share art stay
together.

| Group | Chapters | Length | Shared art and difficulty |
| --- | --- | --- | --- |
| A | intro (28 s), diet (93 s), deficiency (84 s) | 3.4 min | food icons, kit `person`/`sun`, charts; medium |
| B | tests (64 s), why (67 s), enzymes (103 s) | 3.9 min | kit glassware; the molecule set and enzyme blobs (draw once, use in `why` and `enzymes`); medium-hard |
| C | canal (82 s), villi (100 s), egestion (56 s) | 4.0 min | the gut diagram and villus (draw once); hardest art, fewest new ideas per line |
| D | teeth (71 s), recap (60 s), quiz (71 s) | 3.4 min | new teeth; recap and quiz follow the Respiration pattern; easiest |

`intro` needs a simple version of the gut tube: group A can draw a plain coiled
tube, or borrow group C's once it exists.

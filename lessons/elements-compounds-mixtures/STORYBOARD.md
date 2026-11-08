# Elements, Compounds & Mixtures: storyboard

What the screen shows for every narration line in `script.py`. One main idea on
screen per line; the previous beat fades as the next one arrives. Each chapter
names the lib (`lessons/engine/lib.js`) and kit (`lessons/engine/kit.js`) art to
reuse, and any new art it needs.

## Shared conventions (all chapters)

- **Atoms.** Use lib `atom()` for C (grey), H (white) and O (red), with
  `letter: true` wherever the symbol matters. Other elements are new art: one
  helper per scene file, `elAtom(parent, sym, r)`, a `ball()` sphere with its
  symbol in white, in these colours so every chapter matches:
  Na violet `#B48CFF`, Cl green `#6FD96F`, N blue `#5B8CFF`, Fe rust-brown
  `#C27A4A`, S yellow `#FFD84A`, Mg pale green `#9FE3B0`, Au gold `#FFC94A`,
  Cu copper `#E08A4F`, Zn blue-grey `#A9B8C8`, Ar lilac `#C9B8FF`.
  Ni and Co appear only as words on chips.
- **Bonds.** Bonded atoms touch or overlap a little, with a short bond line
  between them. Atoms in a mixture never touch their neighbours. NaCl is shown
  as a grid of alternating Na and Cl. Never label it a molecule.
- **Formulae.** Real subscripts, with the `formula()` helper copied from
  `respiration/scenes/02_aerobic.js`.
- **Glassware and heat.** Kit `beaker`, `flask` (conical), `testTube`, `bunsen`
  (blue when heating). Water is `C.water`; salt water is the same with small
  white particles; oil is amber `#F2B84B`; tea is brown `#9A5B2E`.
- **New apparatus**, used in filter, distil, funnel and recap. It must look the
  same in every chapter:
  - filter funnel: a glass cone (kit `GLASS` stroke) with a white filter-paper
    cone inside and a short stem, standing in a kit `flask`;
  - evaporating basin: a shallow white porcelain bowl on a black tripod with a
    wire-gauze square, kit `bunsen` underneath;
  - Liebig condenser: a straight glass tube in a wider pale-blue water jacket,
    sloping down to the right, with blue arrows for cooling water;
  - separating funnel: a pear-shaped glass bulb on a stand, with a tap and a
    short stem;
  - chromatography paper: a white strip with a pencil start line, hanging in
    a beaker of solvent;
  - top-pan balance: a grey block with a green digital readout (also used in
    Chemical Reactions' conservation-of-mass chapter).
- **Ticks and crosses**: lib `tick` and `cross`. **Labels**: kit `labelLine`.

---

## intro: From dangerous elements to table salt

Two hazard cards (left and right) that merge into one salt shaker in the
middle. Art: kit `beaker`, kit `flask`, lib `bubbles`, lib `spark`, `elAtom`
(Na, Cl). New: hazard diamond, salt shaker, a few chips.

- `hook`: Left card: a small silvery lump drops into a kit `beaker` of water.
  It fizzes (lib `bubbles`) and gives a bright flash (lib `spark`). Right card:
  a kit `flask` of pale green gas with a hazard diamond. Both cards wear a red
  "danger" border.
- `salt`: Names appear on the cards: "sodium **Na**" and "chlorine **Cl**".
  **Showpiece:** a violet Na atom and a green Cl atom leave their cards, snap
  together in the middle, and tile into a small alternating Na/Cl crystal. The
  crystal shrinks into a salt shaker sprinkling onto a cone of chips.
- `how`: Zoom back into the salt grain to show the alternating atoms. Then the
  screen splits: on the left, atoms **joined** (touching, with bond lines); on
  the right, the same atoms **mixed** (apart, drifting).
- `plan`: Three title chips slide in, "elements", "compounds" and "mixtures".
  A row of separation icons follows (filter funnel, condenser, chromatography
  strip, kit `magnet`).

## atoms: Atoms, elements and symbols

A zoom from everyday things into atoms, then a periodic-table grid, then big
symbol tiles. Art: lib `cross`, `tick`, `chip`; `elAtom` (Au, Mg, Na). New:
phone silhouette, microscope icon, gold bar, periodic-table grid (118 small
squares in the standard shape), symbol tiles (rounded squares with the
symbol large and the name small).

- `atoms`: A phone and a wisp of air. A magnifying circle zooms into the
  phone's metal and shows a packed grid of tiny atoms, labelled "atoms". A
  small microscope icon gets a lib `cross`: too small to see.
- `element`: A gold bar. The zoom circle shows identical gold `elAtom`s, all
  one colour. Label: "element = one type of atom".
- `simpler`: An arrow labelled "chemical reaction" strikes one gold atom and
  bounces off. The atom stays whole. Chip: "can't be broken down".
- `table`: **Showpiece:** the periodic table builds itself square by square
  while a counter runs up to **118**. Oxygen, iron, gold, carbon and hydrogen
  light up as they are named.
- `symbol`: Three tiles fly out of the table: **C** carbon, **O** oxygen,
  **Mg** magnesium.
- `rules`: The Mg tile grows. "M" glows with a "capital" label above it; "g"
  glows with a "lower case" label below it.
- `big`: "Big then small": a large **N** drops in, then a small **a** beside
  it, making **Na**. Next to it, "NA" gets a lib `cross`.
- `cobalt`: Two cards. "**Co**" (small o) shows a grey cobalt lump. "**CO**"
  (two capitals): the small o grows into a capital O, and the card becomes a
  grey C atom joined to a red O atom, labelled "carbon monoxide". A small note
  appears: "two capitals = two elements".

## compounds: Compounds and formulae

The centre stage shows molecules with their formulae beneath them. The
comparison beats use two columns. Art: lib `atom`, `molH2O`, `molCO2`,
`molO2`, `cross`, `tick`, `heatWaves`; `elAtom` (Na, Cl). New: fire icon,
water splash, salt shaker (from the intro), padlock icon.

- `def`: Two white H atoms and a red O atom drift in from different sides
  and bond. Label: "compound".
- `ratio`: The water molecule copies itself into a row of identical
  molecules. A "2 H : 1 O" badge locks with a small padlock.
- `water`: One big lib `molH2O` with **H₂O** beneath it. Both H atoms light
  up in turn as the "2" is spoken.
- `others`: lib `molCO2` with **CO₂**, then a small Na/Cl grid with **NaCl**
  and a "1 : 1" badge.
- `subs`: A large **H₂O**. An arrow curls from the subscript 2 back to the H.
  A ghost "1" appears after the O, then fades.
- `miss`: "**HO**" with a lib `cross` (a lone H and O, not water). Then
  "**CO**" with a cross beside a lib `molCO2`.
- `props`: Two columns, "elements" and "compound", with a big ≠ between them.
- `fire`: **Showpiece:** a hydrogen balloon flares, and an O₂ cloud makes a
  flame burn brighter. Their atoms bond into water molecules, which
  become a splash that puts the flame out.
- `salt`: Callback: the fizzing sodium lump and the green chlorine flask from
  the intro merge into the salt shaker, with a "harmless" tick.
- `joined`: The same three atoms twice: loose H, H, O with property tags
  "explosive gas" and "helps burning"; bonded H₂O with "puts out fires".
- `react`: A water molecule on a padlocked plinth. To split it, an arrow
  labelled "chemical reaction" is needed.

## molecules: Molecules and particle pictures

Single molecules first. Then the classic exam diagram: three particle-picture
boxes side by side. Art: lib `atom`, `molO2`, `molH2O`, `molCO2`, `chip`,
`tick`; kit `particleBox` frame style (drawn here with its own particles);
`elAtom` (N). New: three labelled boxes.

- `def`: Two atoms move together and a bond line forms. Label: "molecule".
- `elem`: lib `molO2` (red pair) labelled **O₂**, then a white H₂ pair and a
  blue N₂ pair slide in beside it.
- `still`: Each pair gets an "element" badge with a "same atoms" tick.
- `comp`: lib `molH2O` and `molCO2` slide in below, labelled "compound".
- `pictures`: Three empty rounded boxes appear across the stage. A small key
  shows "colour = atom type" and "joined = bonded".
- `ask`: Two question chips above the boxes: "same or different?" and
  "joined or mixed?".
- `element`: Box 1 fills with blue atoms, some single and some in identical
  pairs. Label: "element", with a tick.
- `compound`: Box 2 fills with identical groups of joined, different-coloured
  atoms. Label: "compound", with a tick.
- `mixture`: Box 3 fills with an assortment: blue singles, red pairs and a
  water molecule, none touching, drifting gently. Label: "mixture", with a
  tick.
- `sbf`: **Showpiece:** **Same**, **Bonded** and **Free** stamp down beneath
  the three boxes in turn, each with a matching flash in its box.
- `trap`: A new box of identical blue atoms joined in pairs, with a "?".
  It resolves to "element". Beside it, a lone "compound" chip notes "needs
  different elements".

## mixtures: Mixtures: mixed, not bonded

A beaker of loose particles, then three real mixtures (air, sea water,
alloys), then a two-column comparison. Art: kit `beaker`, `particleBox`
(state 'gas' for air, 'solid' for metals); lib `molO2`, `molCO2`, `meter`,
`chip`; `elAtom` (N, Ar, Cu, Zn, Fe, Au). New: brass bar, ring, comparison
table.

- `def`: Blue and yellow particles pour into a kit `beaker` together and
  stay separate: no bonds.
- `own`: Each kind keeps its own tag ("blue stays blue", "yellow stays
  yellow").
- `ratio`: A slider adds more and more yellow particles: "any ratio". Beside
  it, a water molecule stays locked at "2 : 1".
- `separate`: A curved arrow labelled "physical methods" sorts the particles
  back into two piles.
- `air`: **Showpiece:** a circle of air full of moving pairs (kit
  `particleBox`, 'gas'): blue N₂ pairs, red O₂ pairs, a few lilac argon atoms
  and one CO₂. The particles then sort themselves into a bar: **78%**, **21%**
  and a thin "1%" sliver.
- `sea`: A kit `beaker` of sea water. The zoom shows white salt particles
  spread among the water particles.
- `alloys`: A golden brass bar, zoomed into a jumble of copper and zinc atoms.
  Then a grey steel bar: iron atoms with a few small grey carbon atoms.
- `looks`: The brass bar looks smooth and uniform. The zoom shows the mixture,
  and its copper : zinc ratio slides from one recipe to another.
- `gold`: A gold ring. The zoom shows gold atoms with some copper atoms mixed
  in. A pure-gold ring beside it bends easily.
- `compound`: The left column of a table, "compound": bonded (bond icon),
  fixed ratio (padlock), chemical reaction (spark) to make or break.
- `mixture`: The right column, "mixture": not bonded, any ratio (slider),
  physical methods (filter-funnel icon).

## pure: Pure substances and melting points

A juice carton gives way to beakers, then a heating graph with a thermometer.
Art: lib `thermometer`, `meter`, `chip`, `tick`, `cross`, `molH2O`; kit
`beaker`. New: juice carton, heating-curve axes, road with ice and a
gritter, pill, computer chip, tap.

- `juice`: A "100% PURE" orange-juice carton. A magnifier shows many
  different particle types inside, and the word "pure?" gets a chemist's
  question mark.
- `def`: A kit `beaker` of water. The zoom shows only lib `molH2O` molecules.
  Label: "single element or compound".
- `impure`: A few salt particles sprinkle into the zoom. Label: "impure = a
  mixture".
- `test`: A lib `thermometer` rises beside the chips "melting point" and
  "boiling point".
- `sharp`: Axes appear: temperature against heating time. A green line draws
  itself with sharp flat steps at exactly **0 °C** and **100 °C**. A small ice
  cube melts at the first step.
- `impurity`: **Showpiece:** a dashed red line for impure ice draws over the
  green one. Its melting part slopes, lower and spread out; its boiling part
  slopes, higher. Arrows mark "lower", "higher" and "range".
- `roads`: A night road with ice, and a gritter spreading salt. The ice melts
  into puddles while a thermometer reads below zero.
- `check`: A pill on a melting-point test. A sharp, single step at the right
  temperature earns a tick.
- `today`: "100%?" in big type. A magnifier finds one odd particle among
  hundreds. Three icons follow (tap water, medicine, computer chip), each with
  a purity bar (lib `meter`) filled to a different level.

## solutions: Solutions: solute, solvent, solubility

A beaker of tea in the centre, with a particle zoom circle beside it. Art:
kit `beaker`, `particleBox` (liquid); lib `chip`, `arrow`, `meter`,
`thermometer`. New: sugar cube, spoon, squash glasses, top-pan balance (see
Shared conventions).

- `tea`: **Showpiece:** a sugar cube drops into a kit `beaker` of tea and
  disappears. In the zoom circle, sugar particles break away from the cube and
  spread out among the water particles. Label: "solution".
- `words`: Labels appear in turn: "solute" on the sugar, "solvent" on the
  water, then the chips "solute + solvent = solution".
- `soluble`: Two beakers. Salt vanishes into one: "soluble" with a tick. Sand
  settles at the bottom of the other: "insoluble".
- `saturated`: Spoonfuls of sugar keep going in. After a few, crystals pile up
  at the bottom and stay: "saturated".
- `solubility`: A small graph of "solubility" against "temperature" rises.
  Cold and hot beakers sit side by side, with more sugar dissolved in the hot
  one.
- `conc`: Two equal squares of solution: a few solute dots ("dilute") and many
  dots ("concentrated").
- `squash`: Two glasses: pale orange ("dilute") and deep orange
  ("concentrated"). Arrows show "+ squash" darkening one and "+ water"
  lightening it again.
- `notgone`: The zoom again. The solute particles glow among the water
  particles: "still there".
- `mass`: A top-pan balance reads 10 g of salt, then 100 g of water, then
  **110 g** once the salt has dissolved. A quick inset: heating the solution
  leaves the salt behind.

## filter: Filter, evaporate, crystallise

Apparatus centre stage: the filter funnel in a flask, then an evaporating
basin over a Bunsen. Art: kit `beaker`, `flask`, `bunsen` (blue, then off),
`labelLine`; lib `heatWaves`, `tick`, `cross`; new apparatus as in Shared
conventions. New: glass rod, crystals (small growing squares), a mug, coffee
filter, dark plate, day/night icon.

- `physical`: A toolbox opens to show four tools: filter funnel, evaporating
  basin, condenser and chromatography strip. Caption chip: "choose the right
  one".
- `filtration`: A kit `beaker` of sandy water, with brown grains swirling.
- `pour`: **Showpiece:** the sandy water pours into the filter funnel in a
  kit `flask`. Clear drops fall into the flask while the grains pile up on
  the paper. An inset zoom shows paper fibres with gaps smaller than the
  grains.
- `names`: Kit `labelLine`: "residue" on the sand in the paper, "filtrate"
  on the liquid in the flask.
- `cant`: Salt water pours through instead. In the zoom, tiny salt particles
  slip between the fibres, and the filtrate is still salty: lib `cross`.
- `evap`: The evaporating basin on its tripod over a blue kit `bunsen`.
  Steam rises (lib `heatWaves`), the level falls, and a white crust of salt
  is left.
- `cryst`: A fresh basin, heated gently. A glass rod dips in and comes out
  with tiny crystals: "saturated".
- `cool`: The Bunsen goes off (`set('off')`). As the basin cools, cubic
  crystals appear and grow.
- `dry`: The crystals are filtered off and patted dry between sheets of
  filter paper.
- `key`: A two-column summary: "filtration: traps an undissolved solid" and
  "evaporation / crystallisation: recovers a dissolved solid".
- `home`: The kitchen version: a mug of warm water with salty sand, a coffee
  filter in a funnel, and the clear liquid on a dark plate. A day/night icon
  ticks twice and white crystals appear.

## distil: Distillation and chromatography

The distillation rig spans the stage: flask over a Bunsen on the left,
condenser sloping down to a beaker on the right. A fractionating column
follows, then chromatography paper. Art: kit `flask`, `beaker`, `bunsen`,
`labelLine`; lib `bubbles`, `molH2O`, `thermometer`, `tick`; new apparatus
as in Shared conventions. New: fractionating column, refinery tower,
coloured dye spots, pen, note.

- `want`: A kit `flask` of salt water with a "water back?" question.
- `boil`: A blue kit `bunsen` heats the flask, with bubbles (lib `bubbles`).
  The zoom shows water molecules rising as vapour while salt particles stay
  in the liquid.
- `condense`: **Showpiece:** the vapour travels down the condenser with blue
  cooling-water arrows around it. Droplets form and drip into a clean kit
  `beaker`, which slowly fills with pure water.
- `diff`: A split: the evaporating basin, "keeps the solid", beside the
  distillate beaker, "keeps the liquid".
- `fractional`: A tall fractionating column on a flask holding two coloured
  liquids, with a lib `thermometer` at the top.
- `first`: The blue (lower boiling point) vapour climbs the column first and
  collects. The second colour follows later.
- `fuels`: A refinery tower with fractions tapped off at different heights:
  petrol near the top, jet fuel, then diesel lower down. A small liquid-air
  flask splits into "nitrogen" and "oxygen" chips.
- `chroma`: A pen draws a black ink spot.
- `paper`: A chromatography strip hangs in a kit `beaker` of solvent, with a
  pencil start line. The ink spot sits just above the liquid.
- `travel`: **Second showpiece:** the solvent front climbs the paper and the
  black spot separates into blue, yellow and pink spots at different heights.
- `identify`: A wider paper with four lanes: unknown "X" and known inks A, B
  and C. Dashed lines show X's spots level with B's.
- `forensic`: A handwritten note's ink is matched to pen B with a tick.
- `felt`: Kitchen paper in a glass of water. A black felt-tip dot spreads into
  rainbow bands.

## funnel: Separating funnels and magnets

The left half shows the separating funnel and the right half the magnet. The
puzzle at the end uses the whole stage. Art: kit `beaker`, `magnet`,
`bunsen`; lib `chip`, `tick`, `cross`, `ring` (3 s countdown on `puzzle`);
new apparatus as in Shared conventions. New: iron filings (small grey
slivers), sand (beige dots), dish.

- `two`: Two tool icons: separating funnel and kit `magnet`.
- `layers`: A beaker of oil and water is shaken and settles into amber oil on
  top of blue water. Label: "immiscible".
- `funnel`: The separating funnel on its stand fills with the two layers.
- `tap`: **Showpiece:** the tap opens and the water drains into a beaker
  below. The boundary sinks, and the tap closes just as the boundary reaches
  it, leaving only oil in the funnel.
- `magnet`: A dish of beige sand with grey iron filings mixed through it.
- `lift`: A kit `magnet` lowers. The filings jump up and cling to it while
  the sand stays behind.
- `only`: Chips: iron, steel, nickel and cobalt, each with a tick.
- `ask`: Three question cards: "solid, liquid or dissolved?", "do they
  mix?", "magnetic?".
- `fecd`: Four tiles, **F E C D**, each with its icon: filter funnel,
  evaporating basin, crystals and condenser.
- `puzzle`: A dish of jumbled sand, iron filings and salt, with "?". A lib
  `ring` counts down the 3-second pause.
- `solve`: The solution plays out in sequence: the magnet lifts the iron,
  water pours in, the filter traps the sand, and the salt crystallises in the
  basin. It ends with three neat piles labelled "iron", "sand" and "salt".

## recap: Recap: memory hooks and exam traps

Cards stack up like the Respiration recap: memory hooks first, then numbered
trap cards. Reuse each chapter's icons at small size. Art: lib `card`,
`chip`, `tick`, `cross`, `thermometer`.

- `lock`: Title: "Memory hooks".
- `sbf`: Three mini particle boxes labelled **Same**, **Bonded**, **Free**.
- `big`: The **Na** tile (big N, small a) and an **Mg** tile.
- `solute`: Sugar → water → solution icons, with "solute" and "solvent"
  tags.
- `fecd`: The four F E C D tiles.
- `traps`: Title: "5 exam traps".
- `t1`: "Co = cobalt" with a tick; "CO = carbon monoxide" beside a C=O pair.
- `t2`: A filter with salt particles slipping through, and a cross.
- `t3`: The basin ("solid") beside the distillate beaker ("liquid").
- `t4`: A thermometer with a down arrow, "lower", and a short sloping range.
- `t5`: A balance showing equal masses before and after dissolving.

## quiz: Quick-fire quiz

Respiration-style: a question card with a lib `ring` countdown during each
4-second pause, then the answer card with a small piece of art.

- `intro`: Title "Quick-fire quiz!" with five empty answer dots.
- `q1`: "Formula for water?" with the ring counting down.
- `a1`: **H₂O** with a lib `molH2O`.
- `q2`: "Air: element, compound or mixture?"
- `a2`: "Mixture", with the loose N₂ and O₂ pairs from the air circle.
- `q3`: "How does an impurity change the melting point?"
- `a3`: "Lowers it, spreads it over a range", with the dashed red curve.
- `q4`: "Which method separates the dyes in an ink?"
- `a4`: "Chromatography", with the separated spots.
- `q5`: "True or false: dissolved sugar is destroyed?"
- `a5`: "False", with sugar particles glowing among the water particles.
- `outro`: Five filled dots and the line "Now try the quiz in your Science
  Lab".

---

## Suggested animator split

Balanced by length and difficulty. The apparatus-heavy chapters (filter,
distil, funnel) share the new glassware, so whoever builds the first of them
should copy the same shapes into the others, as described under Shared
conventions.

| Group | Chapters | Approx. length | Notes |
| --- | --- | --- | --- |
| A | intro, atoms, compounds, quiz | ~4.3 min | Sets the `elAtom` colours and the Na/Cl grid; the quiz is light |
| B | molecules, mixtures, recap | ~3.7 min | Particle pictures, the air sort, the recap cards |
| C | pure, solutions, filter | ~4.1 min | Heating curves, dissolving zoom, the first glassware |
| D | distil, funnel | ~3.1 min | The hardest rigs: condenser, column, chromatography, separating funnel |

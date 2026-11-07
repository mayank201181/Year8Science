# Chemical Reactions: storyboard

What the screen shows for every narration line in `script.py`. One main idea on
screen per line; the previous beat fades as the next one arrives. Each chapter
names the lib (`lessons/engine/lib.js`) and kit (`lessons/engine/kit.js`) art to
reuse, and any new art it needs.

## Shared conventions (all chapters)

- **Atoms and molecules.** lib `atom()` for C (grey), H (white) and O (red);
  lib `molO2`, `molCO2`, `molH2O`. Other elements use one helper per scene
  file, `elAtom(parent, sym, r)`: a `ball()` sphere with its symbol in white.
  Use the same colours as the Elements, Compounds & Mixtures lesson: Mg pale
  green `#9FE3B0`, Fe rust-brown `#C27A4A`, Cu copper `#E08A4F`, Na violet
  `#B48CFF`, Cl green `#6FD96F`. New small molecules (draw them the same way
  everywhere):
  - methane CH₄: a grey C with four small white H around it;
  - carbon monoxide CO: a grey C touching one red O;
  - magnesium oxide MgO: a pale-green Mg touching a red O;
  - hydrogen peroxide H₂O₂: H–O–O–H in a short zigzag.
- **Formulae.** Real subscripts, with the `formula()` helper copied from
  `respiration/scenes/02_aerobic.js`. Big numbers (coefficients) are amber
  `C.energy`, so they stand out from subscripts.
- **Atom tallies.** Small counters under each side of an equation ("H 4 | O 2"),
  used in equations, mass and balance. Green when the two sides match,
  red when they don't.
- **Lab kit.** kit `beaker`, `testTube`, `flask`, `bunsen` (`set('yellow')`
  or `set('blue')`); lib `thermometer`, `bubbles`, `heatWaves`, `spark`,
  `meter`. Exothermic is warm (`C.heat` orange, heat waves out); endothermic
  is cold (`C.water` blue arrows pointing in, with a little frost).
- **Top-pan balance** (new): a grey block with a green digital readout,
  the same design as in Elements, Compounds & Mixtures. Use **rigid sealed
  flasks with a bung** for "closed system" beats, never balloons: a growing
  balloon changes the reading through buoyancy.
- Ticks and crosses: lib `tick`, `cross`. Labels: kit `labelLine`.

---

## intro: Where was the energy hiding?

A single match on a dark stage, then a zoom into its molecules. Art: lib
`heatWaves`, `spark`, `atom`, `molO2`, `molCO2`, `molH2O`, `chip`. New:
matchstick, small flame, fried egg, rusty nail and fuel can icons.

- `hook`: A match strikes and a flame flares, with light rays, lib
  `heatWaves` and a lib `spark`. A large "?" drifts up: where was that energy?
- `stored`: Zoom into the match head: C, H and O atoms glow faintly, and O₂
  molecules from the air drift in. Caption chip: "chemical reaction".
- `swap`: **Showpiece:** the atoms change partners. The fuel's atoms and the O₂
  molecules break apart and snap together as CO₂ and H₂O. Three icons follow:
  an egg cooking, a nail rusting, a fuel flame.
- `plan`: Four roadmap chips light in turn: "spot it", "write it", "weigh
  it", "speed it up".

## physical: Physical or chemical change?

Two columns: **physical** (blue, left) and **chemical** (red, right). Art:
kit `particleBox` ('solid' to 'liquid'), kit `beaker`, kit `bunsen`, lib
`bubbles`, `arrow`, `tick`, `cross`, `molH2O`. New: ice cube, sugar cube,
log, ash pile, smoke, egg, frying pan, protein chains.

- `two`: The two column headers drop in: "physical" and "chemical".
- `phys`: Physical column: an ice cube melts into a puddle. Beside it, a kit
  `particleBox` goes from 'solid' to 'liquid' with the same water particles
  throughout. Label: "no new substance".
- `egs`: Three small scenes: ice melting, a beaker boiling (lib `bubbles`),
  sugar dissolving in tea. Tags: "still water", "still sugar".
- `rev`: The puddle refreezes and the `particleBox` returns to 'solid'. A
  two-way arrow: "easy to reverse".
- `chem`: Chemical column: atoms regroup into a brand-new molecule. Label:
  "new substance, new properties".
- `wood`: A log burns down to ash, smoke and gas. The one-way arrow's return
  path gets a lib `cross`: "hard to reverse".
- `test`: A big question card, "new substance?", under a magnifier. Four icons
  tick in turn: burning, rusting, cooking, neutralising.
- `egg`: **Showpiece:** an egg cracks into a pan, and the clear runny white
  turns solid white. A zoom shows loose protein chains tangling and linking
  into a new network. A crossed-out return arrow reads "can't un-cook".

## signs: Five signs of a reaction

Five icon tiles along the top light up one by one, each with a short demo
below. Art: kit `testTube`, `beaker`, `bunsen` (off), lib `bubbles`,
`thermometer`, `spark`, `heatWaves`, `tick`, `cross`; kit `sineWave` for the
"bang" sound ripples; lib `molCO2`. New: eye/hand/ear icons, iron nail,
precipitate cloud, glow stick, kettle, dye drop, bottle and balloon.

- `evidence`: Eye, hand and ear icons: see, feel, hear.
- `colour`: Tile 1 lights. A shiny grey nail turns orange-brown with rust.
- `gas`: Tile 2. A test tube fizzes (lib `bubbles`) while the kit `bunsen`
  beside it stays off: nothing is boiling.
- `temp`: Tile 3. A lib `thermometer` in the mixture climbs, then a second one
  falls: hotter or colder, all on its own.
- `precip`: Tile 4. Two test tubes of clear liquid pour into one, and a
  cloudy yellow solid appears and settles.
- `define`: A `labelLine` points at the solid: "precipitate = insoluble
  solid".
- `light`: Tile 5. A flame, a glow, then a "BANG" burst with kit `sineWave`
  ripples, then a small "pop".
- `glow`: A glow stick bends, snaps and glows green in the dark. A lib
  `thermometer` beside it barely moves: "hardly any heat".
- `mnem`: The tiles' initials **C G T P L** light up as "Cool Guys Take Pretty
  Lasses" types out beneath them.
- `clue`: One tile lit gets a magnifier: "clue". Three tiles lit get a tick:
  "almost certain".
- `careful`: A boiling kettle and a drop of food dye swirling into water,
  both tagged "physical". A lib `cross` sits over "reaction".
- `balloon`: **Showpiece:** a bottle of vinegar with a floppy balloon on top.
  The balloon tips, baking soda falls in, the bottle fizzes and the balloon
  inflates. lib `molCO2` molecules fill it.

## equations: Reactants, products and equations

A big equation line across the middle: reactants card on the left (blue),
products card on the right (green). Art: lib `arrow`, `cross`, `chip`,
`atom`, `molO2`, `molCO2`, `molH2O`; `elAtom` (Mg); the atom tallies. New:
magnesium ribbon, white MgO powder, charcoal lump.

- `rp`: Two cards: "reactants" and "products".
- `arrow`: A lib `arrow` draws between the cards, labelled "turns into". An
  "=" sign tries to sit there and gets a lib `cross`.
- `word`: "magnesium + oxygen → magnesium oxide". A magnesium ribbon burns
  with a dazzling white flame and leaves white powder.
- `carbon`: "carbon + oxygen → carbon dioxide", with a glowing charcoal lump.
- `symbol`: The carbon equation's words morph into **C + O₂ → CO₂**, with
  lib `atom` C, `molO2` and `molCO2` beneath. Tallies appear: C 1 | 1 and
  O 2 | 2.
- `formula`: **H₂O** with lib `molH2O` beneath, labelled "2 H" and "1 O".
- `sub`: The subscript ₂ glows, with an arrow curling back to the H only.
- `big`: **Showpiece:** a big amber **2** slides in front of H₂O and the
  molecule copies itself: two lib `molH2O`.
- `atoms`: The two molecules split into counted atoms: four white H and two
  red O, with tallies "H 4" and "O 2".

## mass: Conservation of mass

A top-pan balance centre stage, with its readout always visible. Art: kit
`flask`, `testTube`, `bunsen`; lib `atom`, `molO2`, `molCO2`, `molH2O`,
`spark`, `tick`; `elAtom` (Mg); the balance. New: rigid sealed flask with a
bung, crucible, candle, steel wool, copper carbonate powder (green to black).

- `rearr`: A cluster of reactant atoms rearranges into product groups. A
  counter reads "atoms before: 6, after: 6".
- `law`: Two pans of a scale, "reactants" and "products", sit exactly
  level. Label: "law of conservation of mass".
- `hide`: Memory card: "Atoms can't hide, and can't die", with the atoms
  from `rearr` each getting a small tick.
- `sealed`: **Showpiece:** a sealed flask containing magnesium sits on the
  balance, reading **50.00 g**. The magnesium flashes white inside (lib
  `spark`), and the readout stays at 50.00 g.
- `open`: A crucible of magnesium on an open balance burns. The readout climbs
  from 2.40 g to 4.00 g.
- `why`: Zoom: O₂ molecules drift down from the air and join Mg atoms as
  MgO pairs. A dotted outline shows "not on the balance before".
- `carbonate`: A test tube of green copper carbonate over a blue kit `bunsen`.
  CO₂ molecules stream out of the open mouth.
- `lighter`: The powder turns black and the balance readout drops.
- `closed`: The same reaction in a sealed rigid flask: the CO₂ stays inside
  and the readout holds steady. Big tick: "the real rule".
- `candle`: Split screen. A candle on a balance: its readout falls as CO₂ and
  H₂O float away. Steel wool burning on a balance: its readout rises as O₂
  joins on.

## balance: Balancing symbol equations

The equation along the top, each formula's molecules beneath it, atom tallies
below them, and a see-saw (new) that tips while the sides differ and levels
when they match. Art: lib `atom`, `molO2`, `molH2O`, `chip`, `tick`,
`cross`, `ring` (3-second countdown on `try`); `elAtom` (Mg); the tallies.
New: see-saw, H₂O₂ molecule, MgO pairs.

- `same`: A level see-saw with identical atom piles on each side. Label:
  "same atoms each side".
- `rule`: An amber **2** slides in front of a formula and gets a tick. A hand
  trying to change a subscript gets a lib `cross`.
- `why`: lib `molH2O`, "water", beside an H–O–O–H molecule, "hydrogen
  peroxide (a bleach)". The changed subscript is circled.
- `method`: Three step chips: "count", "add big numbers", "count again".
- `start`: **H₂ + O₂ → H₂O** with a white H₂ pair, a red O₂ pair and one
  H₂O beneath. Tallies: left H 2, O 2; right H 2, O 1.
- `counto`: The oxygen tallies flash red, 2 against 1, and the see-saw tips.
- `fixo`: An amber **2** slides in front of H₂O and a second water molecule
  appears. The O tallies turn green, 2 and 2.
- `counth`: Now the hydrogen tallies flash red, 2 against 4, and the see-saw
  tips the other way.
- `fixh`: An amber **2** slides in front of H₂ and a second H₂ appears:
  **2H₂ + O₂ → 2H₂O**.
- `check`: **Showpiece:** every tally turns green (H 4 = 4, O 2 = 2). The
  see-saw settles level and a big tick stamps "Balanced!".
- `try`: **Mg + O₂ → MgO** with its molecules and tallies, while a lib `ring`
  counts down the 3-second pause.
- `ans`: An amber 2 appears before MgO, then before Mg. The second MgO pair and
  Mg atom slide in, the tallies go green and a tick lands.

## types: Families of reactions

A "family album" of six frames, one per family, each with its pattern and a
short demo. Finished frames shrink into a strip along the bottom. Art: kit
`bunsen`, `testTube`, `beaker`, `flask`; lib `atom`, `molO2`, `molCO2`,
`molH2O`, `spark`, `heatWaves`, `bubbles`, `tick`, `cross`; `elAtom` (Fe, Cu,
Na, Cl). New: methane molecule, gas hob, iron nails, rust flakes, drying
agent, oil layer, paint brush and oil can, zinc-coated bucket, copper
carbonate powder, acid and alkali bottles, blue copper sulfate solution.

- `families`: Six empty frames in an album.
- `combust`: Frame 1, a gas-cooker flame. Methane and O₂ molecules rearrange
  into CO₂ and H₂O, with a lib `spark` for the energy.
- `oxid`: Frame 2. An Fe atom picks up O atoms: "gains oxygen". A nail stands
  beside it.
- `rust`: Orange-brown rust patches spread over the nail as the word equation
  types out, with both O₂ and water drops shown.
- `nails`: **Showpiece:** the classic three-tube experiment. Nail in air and
  water: rusts. Nail in dry air over a drying agent: stays shiny. Nail in
  boiled water under a layer of oil: stays shiny. Ticks and crosses land
  under each tube.
- `prevent`: A bridge girder being painted, an oil can, a zinc-coated
  (galvanised) bucket. O₂ and water drops bounce off each one.
- `reduce`: Frame 3. Iron oxide (Fe with O) heats with grey carbon. The O
  atoms hop from Fe to C, and shiny iron is left behind.
- `pair`: Two labels with arrows: "iron oxide loses oxygen: reduced" and
  "carbon gains oxygen: oxidised".
- `decomp`: Frame 4. A test tube of green copper carbonate over a kit
  `bunsen` turns black while CO₂ escapes.
- `neutral`: Frame 5. Acid and alkali beakers pour together, making salt
  (Na and Cl) and water molecules. The word equation sits above.
- `absw`: **A B S W** tiles drop under acid, base, salt and water.
- `displace`: Frame 6. An iron nail dips into blue copper sulfate solution.
  Pink-brown copper coats the nail and the blue fades to pale green.

## energy: Exothermic and endothermic

A split stage: warm left (exothermic, orange glow) and cold right
(endothermic, blue frost), each with a reaction beaker and a lib
`thermometer`. Art: kit `beaker`, `testTube`, `bunsen`; lib `thermometer`,
`heatWaves`, `spark`, `arrow`, `atom`. New: EXIT and ENTER signs, hand-warmer
pouch, cold pack on an ankle, frost sparkles, bond "springs" between atoms.

- `energy`: One flask in the middle, with energy arrows to and from the
  surroundings.
- `exo`: Left side: a beaker reaction with heat waves spreading outward. Its
  thermometer climbs.
- `exoegs`: Icons: a flame, an acid-and-alkali beaker, a rusty nail, then a
  hand-warmer pouch glowing warm.
- `exit`: An "EXO = EXIT" sign like a fire-exit sign, with heat arrows leaving.
- `endo`: Right side: a beaker with blue arrows pointing inward, frost on the
  glass. Its thermometer falls.
- `endoegs`: Icons: a test tube on a Bunsen (decomposition), salt crystals
  dissolving, and a cold pack pressed on an ankle.
- `enter`: An "ENDO = ENTER" door sign, with arrows flowing in.
- `thermo`: **Showpiece:** two thermometers side by side, one rising, one
  falling, labelled "exothermic" and "endothermic". A small "temperature
  change" tile from the signs chapter lights up.
- `trap`: A hand holds the cold flask. Orange heat arrows flow out of the hand
  into the flask: "feels cold".
- `bonds`: Two molecules: their bonds stretch and break (small arrows of
  energy in), then new bonds snap together (bigger arrows of energy out).
  Label: "more out = exothermic".

## combustion: Complete and incomplete combustion

Centre stage, a kit `bunsen`. Comparison panels: complete (blue, left) and
incomplete (yellow, right). Art: kit `bunsen` (`set('blue')` /
`set('yellow')`), lib `meter`, `atom`, `molO2`, `molCO2`, `molH2O`, `spark`,
`heatWaves`, `thermometer`, and lib `animalCell`, `mitochondrion`,
`molGlucose` for the last line. New: petrol can, log, methane molecule, CO
molecule, soot specks, red blood cell, boiler, CO alarm.

- `fuel`: Three fuels: a petrol can, a gas flame (with methane) and a log,
  each with small C and H chips.
- `depends`: An "oxygen supply" lib `meter` slides between "plenty" and
  "limited".
- `complete`: Plenty: a methane molecule meets two O₂ molecules, and they
  rearrange into CO₂ and two H₂O.
- `methane`: The word equation, a clean blue flame and a large lib `spark`:
  "most energy".
- `incomplete`: Limited: a smoky yellow flame with a smaller spark, "less
  energy".
- `products`: Black soot specks, a CO molecule and an H₂O molecule come off
  the yellow flame.
- `co`: The CO molecule is highlighted as "colourless, no smell". A red blood
  cell carrying O₂ gets its seats taken by CO.
- `danger`: A boiler with a blocked flue, and a carbon monoxide alarm
  flashing and beeping.
- `bunsen`: **Showpiece:** a kit `bunsen` with its air hole closed:
  `set('yellow')`, smoky and wavering.
- `open`: The collar turns, air rushes in and the flame switches to
  `set('blue')`: roaring, with a lib `thermometer` above it climbing higher.
- `cells`: Callback to the Respiration lesson: a lib `animalCell` with a lib
  `mitochondrion`. lib `molGlucose` and O₂ go in, CO₂ and H₂O come out, and
  there's no flame anywhere.

## rate: How fast? The rate of reaction

A particle arena (a rounded box) in the centre, with two colours of moving
reactant particles. Factor tiles collect down the right side. Art: kit
`particleBox` motion for the arena (or the same bounce maths), lib `spark`
(collision flashes), `meter`, `bubbles`, `thermometer`; kit `bunsen`,
`flask`. New: firework burst, rusty car, speed dial, marble chip, marble
powder, gas-volume graph, energy hill.

- `range`: A firework bursts in an instant. A car rusts over a timeline of
  years.
- `rate`: A speed dial labelled "rate = how fast".
- `collide`: **Showpiece:** particles move in the arena. Gentle bumps bounce
  off. Hard collisions flash (lib `spark`) and the two particles join into a
  product. Label: "collision idea".
- `temp`: A kit `bunsen` lights under the arena. The particles speed up and
  the flashes come more often and brighter. Tile: "temperature".
- `conc`: More particles pour into the same arena, and collisions happen more
  often. Tile: "concentration".
- `surface`: One big lump beside the same mass as powder, with acid particles
  reaching every bit of the powder's surface. Tile: "surface area".
- `marble`: Two flasks of acid: a marble chip bubbles slowly, marble powder
  fizzes fast. A graph of gas made against time: the powder's line rises
  steeply, the chip's gently, and both level off at the same height.
- `catalyst`: An energy hill. Particles struggle over the high route, then
  take a lower route through a gold catalyst square, which is still there
  afterwards. Tile: "catalyst".
- `sum`: The four tiles group under three icons: "more collisions", "harder
  collisions", "easier route".

## catalysts: Catalysts at work

Three short scenes (body, kitchen, car), then the catalyst test on the
balance. Art: lib `animalCell`, `thermometer`, `meter`, `tick`; kit `beaker`,
`flask`; the balance. New: enzyme blob with a notch, starch chain splitting
into sugar units, yeast cells, loaf, car exhaust, honeycomb converter, gold
catalyst square.

- `reuse`: One gold catalyst square helps pair after pair of reactants join,
  with a counter ticking up. The square never changes.
- `enzymes`: A green enzyme blob with a notch (its active site), labelled
  "biological catalyst".
- `amylase`: A mouth and saliva: amylase snips a starch chain into small sugar
  pieces. Then yeast cells bubble inside rising dough.
- `body`: A lib `thermometer` at **37 °C**. Two rate meters: "with enzymes"
  fills fast, "without" barely moves.
- `converter`: **Showpiece:** a car's exhaust pipe opens into a cutaway
  catalytic converter. Inside is a honeycomb labelled "platinum".
- `co`: CO and O₂ molecules enter the honeycomb and leave as CO₂.
- `test`: The catalyst on the balance reads 2.0 g before the reaction and
  2.0 g after it, with a rate meter showing "faster".
- `not`: Two product bars, "with catalyst" and "without", end at the same
  height. Only the stopwatch differs.
- `exoendo`: Two thermometers show the same temperature change with and
  without the catalyst.

## recap: Recap: memory hooks and exam traps

Cards stack up like the Respiration recap: memory hooks first, then numbered
trap cards. Reuse each chapter's icons at small size. Art: lib `card`,
`chip`, `tick`, `cross`, `thermometer`.

- `lock`: Title: "Memory hooks".
- `cgtpl`: The five sign tiles with **C G T P L** lit.
- `exo`: The EXIT and ENTER signs with their arrows.
- `hide`: Atoms rearranging on the balance, readout unchanged.
- `absw`: The A B S W tiles under acid + base → salt + water.
- `traps`: Title: "5 exam traps".
- `t1`: An arrow with a tick; an "=" with a cross.
- `t2`: An amber 2 in front with a tick; a changed subscript with a cross.
- `t3`: An open test tube with gas escaping, and the readout dropping.
- `t4`: A nail with ticks on both "oxygen" and "water".
- `t5`: The yellow flame giving CO and soot, with "monoxide" highlighted.

## quiz: Quick-fire quiz

Respiration-style: a question card with a lib `ring` countdown during each
4-second pause, then the answer card with a small piece of art.

- `intro`: Title "Quick-fire quiz!" with five empty answer dots.
- `q1`: The three options as icons: ice cube, sugar cube, iron nail.
- `a1`: The nail rusts orange, with a tick.
- `q2`: A sealed flask with magnesium on the balance.
- `a2`: The readout stays the same, with a tick.
- `q3`: **2H₂O** in big type.
- `a3`: Two water molecules, with all four H atoms glowing.
- `q4`: A test tube with frost and a hand.
- `a4`: "Endothermic", with the falling thermometer.
- `q5`: The gold catalyst square with "used up?".
- `a5`: "False": the square is back on the balance, unchanged.
- `outro`: Five filled dots and the line "Now try the quiz in your Science
  Lab".

---

## Suggested animator split

Balanced by length and difficulty. Group B shares the equation, tally and
balance art across three chapters, so those stay consistent.

| Group | Chapters | Approx. length | Notes |
| --- | --- | --- | --- |
| A | intro, physical, signs, quiz | ~4.2 min | Short chapters; the quiz reuses icons from the whole lesson |
| B | equations, mass, balance | ~3.9 min | Formulae, atom tallies, the balance and the see-saw |
| C | types, energy, combustion | ~4.0 min | Six reaction demos, thermometers, the Bunsen flame switch |
| D | rate, catalysts, recap | ~3.2 min | Collision arena, energy hill, catalytic converter, recap cards |

# Acids, Bases & Metals: storyboard

What the screen shows for every narration line of `lessons/acids-metals/script.py`.
Fifteen chapters, 144 lines, about 16 minutes (chapter lengths in the split at the end).

**Look and palette.** The universal-indicator colours below are the colour code for the whole
lesson: acids are red, neutral is green, alkalis are blue to purple, in every pH bar, indicator
liquid, chip and label. Water is lib `molH2O` (red O, white H); hydrogen gas is two white lib
`atom('H')` balls touching; oxygen is lib `molO2`; carbon dioxide is lib `molCO2`; bubbles are lib
`bubbles()`. In equations, acid chips are red, bases and alkalis blue, salts green (`C.good`),
water `C.water`, hydrogen white, carbon dioxide `C.co2`, and each metal its own swatch. Glassware
is always kit `beaker`, `testTube` and `flask`; heat is always kit `bunsen`; labels use kit
`labelLine`; lib `chip`, `card`, `arrow`, `tick`, `cross` and `strike` for the rest.

**Shared art.** There is no `lessons/acids-metals/lib.js`. These pieces recur across animator
groups, so every group draws them to these specs:
- *pH bar*: 15 square cells, 56 × 56 px each (840 px long), pH 0 on the left, end cells rounded,
  numbers 0–14 in `FD` 26 px under the cells. Band colours (the guide's chart): 0–2 red
  `#E8424F` (`C.blood`), 3–4 orange `#FF8A3D` (`C.heat`), 5–6 yellow `#FFD84D`, 7 green
  `#56D69B` (`C.good`), 8–11 blue `#3F8FE8`, 12–14 purple `#8E5CF0`. Indicator liquids use the
  same colours. Upright, as the indicators chapter's "tower", pH 0 is at the bottom.
- *Litmus strips*: 40 × 150 px paper strips, red `#E8424F` or blue `#3F8FE8`, with a paler
  top end where they are held; dipping changes the colour from the wet end upwards.
- *Red cabbage juice*: purple `#8B4FB8` near neutral; pink-red `#F0508C` in acid; then blue
  `#3F8FE8`, green `#4CC26E` and yellow `#E6D34A` as the pH rises.
- *Ions*: H⁺ is a lib `atom(g, 'H', 14)` with a small red `+` badge; OH⁻ is a red
  `atom(g, 'O', 16)` joined to a white `atom(g, 'H', 10)` with a small blue `−` badge. Acid particles in the
  concentration beakers are red `ball()` circles, r 9, drifting as kit `particleBox` in `'gas'`
  mode at low energy (`box: false`), kept inside the beaker's liquid.
- *Metal swatches*: magnesium a curly silver ribbon `#E3E8EE`; zinc blue-grey granules `#A9B6C4`;
  iron a dark-grey nail or filings `#7A8590`; copper an orange-brown strip `#D9824B`; sodium and
  potassium soft pale lumps `#D8DEE6` (dull crust `#9AA3AD`); aluminium foil `#C7D0DA`; silver
  `#E8ECF0`; gold `#F5C542` with a white glint. Copper oxide is a black powder `#1E2328`;
  magnesium oxide a white powder.
- *Reactivity ladder*: 11 rungs, each a lib `chip` about 300 × 46 with the symbol and name in
  `FD` 28 px ("K potassium" … "Au gold"), tinted with the metal's swatch, most reactive at the
  top. The hydrogen rung is a dashed `C.air` outline, "(H) hydrogen", between iron and copper.
  A mini version (just the symbols, 34 px rungs) is reused wherever a chapter needs it.
- *Splint*: a 16 × 220 px wooden stick `#C8A165`. Lit: a small flame (yellow core, orange edge)
  with `glow('#FFB347')`. Glowing: an orange-red ember tip `#FF6A2A` with a small glow and no
  flame. Out: a dark tip and a grey smoke wisp.
- *POP*: an 8-point burst star (`C.energy` fill, `C.heat` edge) with "POP!" in `FD` 44 px bold
  and a few short radial lines; it springs in with lib `pop` easing.
- *Limewater*: a kit `testTube` whose liquid starts clear (`#CFE7F5` with `g.liquid` at about
  0.25 opacity) and turns milky (`g.set(level, '#EEF3F6')`, opacity up to about 0.9), as in
  Respiration's investigate chapter.
- *Solutions*: copper sulfate is turquoise blue `#1FA2D6`; iron sulfate pale green `#B8DDB0`;
  dilute acids are clear glass.

---

## intro: The cabbage that detects acids
A kitchen bench along the bottom third; small kit `beaker`s (no marks) as clear cups. No card:
start with the cabbage on screen.
- **hook**: a red cabbage (new art: purple-red ball with pale veins) splits in two and the pieces
  drop into a warm kit `beaker` (a faint lib `heatWaves` wisp); the water swirls to cabbage purple.
- **secret**: three cups of purple juice. A lemon drips into the left cup: it flashes pink-red; a
  spoon of bicarbonate of soda goes into the right cup: it turns blue; the middle stays purple.
  Labels "acid" and "alkali" (kit `labelLine`). Then three small icons rise behind the cups: a
  vinegar bottle, a spade of soil, a stomach outline. **Showpiece**: the cups flashing colour.
- **metals**: the cups slide away. Two kit `testTube`s of acid: magnesium ribbon fizzing hard (lib
  `bubbles`), a copper strip doing nothing; a large "?" chip between them.
- **plan**: roadmap: three chips pop in left to right, "pH scale" (with a mini pH bar),
  "neutralisation" (red + blue → green), "reactivity series" (a mini ladder).

## acids: Acids, bases and alkalis
Left half for the substances, right half for the Venn diagram that builds at the end.
- **acid**: a kit `beaker` of water; an acid particle drops in and splits, releasing white H⁺ ions
  (shared ion art) that spread through the water. Label "H⁺ hydrogen ions"; a small "sour" chip.
- **everyday**: the beaker shrinks to the corner; a lemon slice labelled "citric acid" and a
  vinegar bottle labelled "ethanoic acid (acetic acid)" slide in.
- **stomach**: a simple stomach (new art: pink J-shaped pouch) with a red-orange pool labelled
  "hydrochloric acid"; a thick translucent band along the inner wall labelled "mucus" glows.
- **base**: the stomach fades. A red "ACID" chip and a blue "BASE" chip slide together and meet;
  both soften to a green glow, "cancel out" (like the guide's diagram arrow).
- **oxides**: two dishes: black copper oxide powder and white magnesium hydroxide powder, labelled
  "metal oxide" and "metal hydroxide".
- **alkali**: a kit `beaker` of water; white pellets of a base drop in and shrink away to nothing
  as they dissolve; the water tints pale blue. Chip "dissolves = alkali".
- **examples**: the beaker is labelled "sodium hydroxide"; a cleaning spray bottle (new art)
  labelled "ammonia" joins it; soap bubbles float up beside "feels soapy", and a "cleaners" chip.
- **venn**: **Showpiece**: a large blue circle "BASES" draws on in the right half; a smaller pale
  circle "ALKALIS (soluble bases)" grows inside it; the sodium hydroxide and ammonia icons fly
  into the inner circle.
- **cuo**: copper oxide drops into a beaker of water and sinks to a black heap; the water stays
  clear. Its icon then slides into the BASES ring but outside ALKALIS, with a small `cross`
  beside the word "alkali".

## ph: The pH scale
The shared pH bar across the middle (x 180–1020, y about 330); everything else hangs off it.
- **scale**: the bar draws on cell by cell from 0 to 14, numbers fading in underneath; title
  "pH scale" above.
- **acidic**: a bracket under 0–6, "ACIDIC" in red; cells 6 down to 0 pulse in turn as an arrow
  grows to the left, "more acidic".
- **neutral**: a beaker of pure water drops onto cell 7; green chip "pH 7 neutral", with a small
  lib `thermometer` and the note "at room temperature".
- **alkaline**: bracket over 8–14, "ALKALINE" in blue-purple; an arrow grows to the right, "more
  alkaline". A ghost label "more acidic" tries to attach to that end and is struck out (lib
  `strike`).
- **ions**: above the bar, square tiles at pH 5, 4 and 3 fill with H⁺ dots: 1, then 10, then 100
  (a 10 × 10 grid), with "× 10" chips between them.
- **lemon**: **Showpiece**: the tiles become two glasses: tomato juice at pH 4 (one dot) and lemon
  juice at pH 2 (a hundred dots), pointers to cells 4 and 2, and a big "× 100" chip between.
- **strength**: the bar shrinks to the top. Two kit `beaker`s: "strong acid", where every acid
  particle has split into H⁺ and its partner ion; "weak acid", where most particles stay joined
  and only a few have split. Labels "ionises fully" and "only partly".
- **conc**: two beakers, a dilute strong acid (a few particles, all split) and a concentrated weak
  acid (many particles, few split), each with a pH meter reading the same "pH 3". A chip: "pH
  alone can't tell strong from weak".
- **meter**: a pH meter (new art: handheld box, probe and display) dips in and reads a number; a
  strip of universal-indicator paper beside it. Then a tongue icon and a hand icon, each with a
  lib `cross`: "never taste or touch".

## indicators: Indicators: colour clues
A rack of kit `testTube`s along the bottom; the shared pH bar above when it is needed.
- **what**: three tubes of colourless liquid (acid, water, alkali); a dropper adds indicator:
  they turn red, green and blue. Labels "acidic", "neutral", "alkaline".
- **litmus**: a blue litmus strip dips into the acid tube and turns red; a red strip dips into the
  alkali and turns blue. A chip "pH number?" gets a lib `cross`.
- **roofs**: **Showpiece**: the pH bar swings upright into a tower with a little roof on top, pH 0
  on the ground floor and 14 at the roof. A red strip slides to the bottom floors, a blue strip
  to the roof; "Red Bottoms, Blue Roofs" in 48 px, with "Red" and "Blue" in their colours.
- **ui**: the tower lies back down as a plain grey bar; a bottle labelled "universal indicator"
  pours, and colour floods the cells from left to right.
- **acids**: cells 0–2, 3–4 and 5–6 brighten in turn with chips "red 0–2", "orange 3–4",
  "yellow 5–6"; a tube above takes on each colour; bracket "acidic".
- **green**: cell 7 and the tube turn green; chip "green 7: neutral".
- **alkalis**: cells 8–11 and 12–14 brighten with chips "blue 8–11" and "purple 12–14"; bracket
  "alkaline".
- **chart**: a printed colour chart card (the bar on white) is held next to a tube; an arrow
  matches the tube's colour to its cell. Note "estimates pH, not strength".
- **cabbage**: the tubes refill with purple cabbage juice; a row of six cups along a mini pH bar
  shifts red, pink, purple, blue, green, yellow.
- **home**: back in the kitchen: two cups of juice; lemon juice turns one pink, bicarbonate of
  soda turns the other blue. Chip "try it at home".

## hazards: Hazards: concentration and strength
Two property cards, then hazard symbols, then two beakers, then the 2 × 2 grid.
- **acids**: card "ACIDS": a lemon wedge "sour" next to a tongue with a lib `cross` ("never taste in
  a lab!"), a blue litmus strip turning red, and two mini tubes fizzing, "metals" and "carbonates".
- **alkalis**: card "ALKALIS": soap bubbles "soapy", a red strip turning blue, chip "neutralises
  acids".
- **corrosive**: the cards slide off. A GHS-style corrosive diamond (new art: white diamond, red
  border, drops falling on a hand and a bar) grows beside a bottle labelled "concentrated acid";
  label "CORROSIVE: destroys living tissue".
- **irritant**: a second diamond with an exclamation mark beside a bottle "dilute acid"; label
  "IRRITANT: redness, itching".
- **dilute**: a kit `beaker` full of water with only six red acid particles drifting (shared
  particle art); label "DILUTE".
- **conc**: a second beaker, little water, thirty particles crowded together; label
  "CONCENTRATED".
- **danger**: a drop falls from each beaker and is magnified: one or two particles in the dilute
  drop, a crowd in the concentrated one, which gets a warning glow and the chip "more hazardous".
- **notsame**: split screen with a big "≠": left "STRENGTH" (the strong and weak particles from
  the pH chapter: split versus joined), right "CONCENTRATION" (crowded versus sparse beakers).
- **grid**: **Showpiece**: a 2 × 2 grid of small beakers, columns "dilute | concentrated", rows
  "strong | weak", each with its particle mix. "Dilute strong" and "concentrated weak" light up,
  and a chip "can be safer" lands on dilute strong.
- **goggles**: a pair of safety goggles (new art) drops into the centre; behind it, a bottle
  "concentrated weak acid" with a corrosive diamond.

## neutral: Neutralisation
A kit `flask` of acid with universal indicator in the centre; an equation strip across the top.
- **what**: a red ACID chip and a blue BASE chip slide together; a pointer on a mini pH bar moves
  from red towards the green 7.
- **eq**: equation boxes like the guide's diagram, enlarged: ACID (red) + BASE (blue) → SALT
  (green) + WATER (`C.water`); a small note "metal oxide or hydroxide" under BASE.
- **absw**: the letters A, B, S and W drop out of the boxes in 64 px.
- **example**: the boxes fill with "hydrochloric acid", "sodium hydroxide", "sodium chloride",
  "water".
- **ions**: **Showpiece**: zoom into the flask. H⁺ ions and OH⁻ ions (shared ion art) drift
  together and each pair snaps into a lib `molH2O` with a small flash; faint grey Na⁺ and green
  Cl⁻ balls (the dissolved salt) stay drifting in the background.
- **little**: back out to the flask: a dropper adds a little alkali; the red liquid only turns
  orange; the pH pointer stops at about 4; chip "still acidic".
- **much**: more drops: the liquid passes through green and on to blue; pointer at about 11;
  chip "alkaline". A ghost green "7" target and the chip "check with an indicator".
- **reaction**: two beakers: left, water is poured into acid and the red particles just spread
  out ("diluting: same acid"); right, a base goes in and the particles turn into salt and water
  ("neutralising: new substances").
- **soil**: a field cross-section (soil `C.soil`, sprouts made from kit `leaf`); a kit `person`
  walks along (`walkPose`) sprinkling white lime; a pH chip in the soil changes from yellow 5 to
  green 7 and the crops stand up.
- **antacid**: a stomach outline with red acid; a white tablet labelled "magnesium hydroxide"
  drops in and dissolves (no fizz); the acid eases from red to orange; chip "indigestion tablet".

## metals: Acids and metals: the squeaky pop
A rack of kit `testTube`s on the left; equations on the right.
- **fizz**: a magnesium ribbon drops into a tube of clear dilute acid; lib `bubbles` stream up and
  H₂ molecules rise out of the mouth; label "hydrogen gas".
- **eq**: equation chips: acid + metal → salt + hydrogen.
- **example**: the chips fill in: hydrochloric acid + magnesium → magnesium chloride + hydrogen.
- **test**: **Showpiece**: a lit splint (shared art) comes to the mouth of the tube: a flash and
  the POP burst, with a short kit `sineWave` "squeak" arc.
- **why**: zoom on the tube mouth: H₂ molecules meet lib `molO2` and flash into a few `molH2O`;
  label "a tiny amount burning explosively".
- **race**: four tubes in a row, labelled Mg, Zn, Fe, Cu, with the four metal swatches poised
  above; they drop in together.
- **mg**: the Mg tube erupts with dense, fast bubbles; chip "vigorous".
- **zn**: the Zn tube bubbles steadily; chip "steady".
- **fe**: a few slow bubbles in the Fe tube; chip "slow".
- **cu**: the Cu tube stays still while a small clock hand whirls round; chip "no reaction".
- **series**: a mini ladder slides in beside the tubes: Mg, Zn, Fe above the dashed H rung, Cu
  below it; each tube lines up with its rung.
- **naming**: back to "magnesium chloride": "magnesium" glows grey with an `arrow` from the metal,
  "chloride" glows red with an `arrow` from "hydrochloric acid".
- **acids**: a three-row table slides in: "hydrochloric acid, HCl → chlorides", "sulfuric acid,
  H₂SO₄ → sulfates", "nitric acid, HNO₃ → nitrates".
- **zinc**: equation zinc + sulfuric acid → zinc sulfate + hydrogen; a chip "sulfide" gets a red
  `strike`, "sulfate" gets a `tick`.

## carbonates: Acids and carbonates: milky limewater
The classic set-up: a tube of acid on the left, a delivery tube (new art) bending over into a tube
of limewater on the right.
- **carb**: white-grey lumps labelled "calcium carbonate (chalk, limestone)" drop into the acid
  tube; it fizzes.
- **eq**: equation chips: acid + metal carbonate → salt + water + carbon dioxide.
- **example**: the chips fill in: hydrochloric acid + calcium carbonate → calcium chloride + water
  + carbon dioxide.
- **three**: the three product chips pulse with badges 1, 2, 3; then a lit splint at the tube's
  mouth shrinks and goes out, leaving a smoke wisp; chip "no pop".
- **lime**: **Showpiece**: the delivery tube connects; bubbles carrying lib `molCO2` icons pass
  into the clear limewater, which clouds to milky white; chip "clear → milky".
- **why**: zoom into the milky liquid: tiny white specks swirl and settle; label "calcium carbonate
  (a white precipitate)".
- **apart**: two unlabelled white powders, both fizzing: a lit splint at the first gives the POP
  ("metal: hydrogen"); the second's gas turns limewater milky ("carbonate: carbon dioxide").
- **hook**: two big icons side by side, the POP burst and a milky tube, with "Pop = Hydrogen,
  Milky = CO₂" in 44 px.

## series: The reactivity series
The shared ladder builds in the left half (x about 110–450); demonstrations in the right half.
- **league**: a league-table frame with "MOST REACTIVE" at the top and "LEAST REACTIVE" at the
  bottom; a long lib `arrow` down its side, "decreasing reactivity".
- **top**: rungs drop in from the top, one per name: potassium, sodium, calcium, magnesium,
  aluminium, zinc, iron.
- **bottom**: the dashed hydrogen rung slides in, then copper, silver and gold, with gold glinting.
- **zebra**: the mnemonic words fly in beside the rungs, first letters lit to match: Please,
  Stop, Calling, Me, A, Zebra, Instead, Call, Some, Gold (the hydrogen rung gets no word).
- **hydrogen**: the hydrogen rung glows; the rungs above get a tiny bubbling-tube icon "react with
  acids", the rungs below a `cross` "don't".
- **water**: **Showpiece**: right half: a glass trough of water; a lump of sodium skates across
  the surface, fizzing, trailing bubbles and shrinking; then potassium whizzes even faster with a
  small lilac flame. Labels "sodium" and "potassium".
- **eq**: equation chips: metal + water → metal hydroxide + hydrogen, then sodium + water → sodium
  hydroxide + hydrogen.
- **alkaline**: indicator drops into the trough and the water turns blue-purple; chip "alkaline:
  sodium hydroxide".
- **mg**: two mini panels: magnesium ribbon in cold water with one slow bubble ("cold water:
  slow"); magnesium glowing in a jet of white steam ("steam: fast").
- **cu**: copper, silver and gold pieces sit in water; nothing happens; a `cross` "no reaction"
  under each.
- **predict**: the ladder lights top to bottom; a "?" metal slides along it; chip "predict before
  you test".

## displace: Displacement and extraction
A big kit `beaker` of copper sulfate in the centre; later, ore and extraction panels.
- **push**: a grey Fe ball bumps a copper-coloured Cu ball out of its partnership with a sulfate
  group and takes its place; label "more reactive pushes out less reactive".
- **nail**: an iron nail lowers into the blue copper sulfate solution; a mini ladder in the corner
  shows Fe above Cu.
- **eq**: equation chips: iron + copper sulfate → iron sulfate + copper (iron grey, copper sulfate
  blue, iron sulfate pale green, copper orange-brown).
- **see**: **Showpiece**: time-lapse with a spinning clock: the solution fades from blue to pale
  green, and a rough orange-brown copper coat grows over the dipped part of the nail.
- **never**: a second beaker of pale-green iron sulfate with a copper strip: nothing happens; a
  `cross` "no reaction"; the mini ladder shows why.
- **ores**: a lump of rock (new art) with metal atoms joined to red oxygen atoms (lib `atom('O')`);
  label "ore"; chip "extraction: getting the metal out".
- **carbon**: iron oxide (Fe and O balls) heated by a kit `bunsen` with grey carbon atoms
  (`atom('C')`): the carbon grabs the oxygen, leaving shiny iron; a slim "carbon" marker appears on
  the mini ladder between Al and Zn, above Fe.
- **electro**: aluminium oxide: carbon tries and bounces off; then an electrolysis cell (two
  electrodes in a molten bath, kit `wire` with current dots, a lib `bolt`) pulls the aluminium out;
  chip "expensive".
- **gold**: a gold nugget glinting in rock, with no oxygen attached; chip "found pure".
- **recycle**: a drinks can (new art) travels round a recycling loop; a lib `meter` shows "from
  ore 100%" against "recycled 5%"; a kit `sun` and a wind-turbine icon by "renewable electricity".

## burning: Burning and tarnishing
A kit `bunsen` left of centre, samples held in tongs (new art); equations on the right.
- **eq**: lib `molO2` molecules drift in from the air towards a metal sample; equation chips: metal
  + oxygen → metal oxide.
- **new**: a shiny metal block and a dull white powder side by side, with an `arrow`; label "new
  substance, different properties".
- **mg**: **Showpiece**: a magnesium ribbon in tongs over the Bunsen ignites into a dazzling white
  flare (a big `glow('#FFFFFF')`, the background dims), then dies down to a crumbly white powder.
  An eye icon with a `cross`: "never look straight at it".
- **mgeq**: word chips, then the symbol equation 2Mg + O₂ → 2MgO with atoms: two grey Mg balls
  and an O₂ pair rearrange into two Mg–O pairs.
- **na**: a knife slices a lump of sodium: the cut face shines silver and then dulls to grey;
  label "sodium oxide layer"; the lump drops into a jar of oil, "stored under oil".
- **fe**: iron filings sprinkle from a spatula into the Bunsen flame and give orange sparks.
- **rust**: an iron nail grows orange-brown rust patches among water droplets and O₂; then three
  protection icons: a paint tin, an oil drop and a zinc-coated nail.
- **gold**: a gold ring (new art) gleams; O₂ molecules bounce off it; a sparkle.
- **ladder**: the mini ladder slides in with flame icons beside it: big at magnesium, small at
  iron, none at gold.

## oxygen: Testing for oxygen
One large kit `testTube` labelled "oxygen?" in the centre; the shared splint art drawn large.
- **third**: small POP and milky-tube icons tuck into the top-right corner; the big tube appears
  with a "?" chip.
- **glow**: a splint is lit, then blown out (puff lines), leaving a glowing orange tip.
- **relight**: **Showpiece**: the glowing splint is pushed into the tube: the ember brightens and
  bursts back into a yellow flame; chip "relights!".
- **why**: a pie chart of air, one fifth red "oxygen" and the rest grey; then the tube fills with
  lib `molO2` pairs, "a tube full of oxygen".
- **h**: three columns begin. Column 1: lit splint, the POP, "Hydrogen".
- **o**: column 2: glowing splint, a relit flame, "Oxygen".
- **co**: column 3: limewater tube clouding to milky, "Carbon dioxide".
- **splints**: columns 1 and 2 highlight their splints with big labels "LIT → hydrogen" and
  "GLOWING → oxygen".

## salts: Making a soluble salt
A three-step strip across the stage (1 react, 2 filter, 3 crystallise); the active step enlarges.
- **useful**: a fungicide spray bottle over a vine (kit `leaf`) and a fertiliser sack; chips
  "copper sulfate" (blue) and "ammonium nitrate" (white).
- **how**: the equation strip: copper oxide (black powder icon) + sulfuric acid (clear) → copper
  sulfate (blue solution) + water; the three step numbers appear, dimmed.
- **react**: step 1 enlarges: a kit `beaker` of acid over a gently heating kit `bunsen` (blue
  flame); spatulas of black copper oxide tip in and stir away as the liquid turns blue.
- **excess**: more copper oxide stays as a black layer at the bottom; chip "excess: some left
  over"; a small pH chip changes from red "acid" to "all acid used up".
- **filter**: step 2: a filter funnel with folded paper (new art) over a kit `flask`; the black
  residue stays on the paper (label "residue"), blue liquid drips through (label "filtrate").
- **heat**: step 3: an evaporating basin (new art) on a tripod over the Bunsen; steam wisps rise
  and the blue level drops; chip "saturated".
- **cool**: **Showpiece**: the Bunsen goes off (`set('off')`); blue diamond-shaped crystals grow
  from the edge and the floor of the basin, staggered with `rng`.
- **dry**: the crystals are filtered off and laid out on paper; a sparkle; label "pure copper
  sulfate".
- **other**: in step 1, a metal granule and a carbonate lump swap in for the copper oxide; bubbles
  fizz, then stop, with a little solid left; chip "until the fizzing stops".

## recap: Recap: memory hooks and exam traps
Four memory-hook cards (lib `card`) slide in one at a time, then a list of five traps.
- **lock**: title "Memory hooks" with a padlock snapping shut.
- **zebra**: card 1: the mini ladder with the mnemonic words beside it.
- **roofs**: card 2: the pH tower, red at the bottom, blue at the roof.
- **pop**: card 3: the POP burst "= Hydrogen" and a milky tube "= CO₂".
- **absw**: card 4: ACID + BASE → SALT + WATER boxes with A, B, S, W.
- **traps**: the cards stack away; heading "5 exam traps" with a warning triangle.
- **t1**: "acid + metal → hydrogen" with a `tick`; "→ carbon dioxide" struck through, note "only
  carbonates".
- **t2**: the neutralisation equation with "water" glowing.
- **t3**: the Venn diagram again, copper oxide outside the alkali circle.
- **t4**: two beakers, "dilute strong" and "concentrated weak", with "≠" and "can be safer".
- **t5**: the mini ladder: Cu, Ag and Au below the hydrogen line, each with a still tube and a
  `cross`.

## quiz: Quick-fire quiz
A question card at the top, a lib `ring` countdown during each 4-second pause, and the answer art
below.
- **intro**: "Quick-fire quiz!" title and a speech-bubble icon "say it out loud".
- **q1**: a litmus strip hovers over a tube labelled "acid"; ring.
- **a1**: the strip turns red; chip "red".
- **q2**: a pH meter reading "12"; ring.
- **a2**: the pH bar with a pointer at 12, in the alkaline zone; chip "alkaline".
- **q3**: a carbonate lump fizzing in acid; ring.
- **a3**: the gas bubbles through limewater, which turns milky; chip "carbon dioxide".
- **q4**: an iron nail above blue copper sulfate solution; ring.
- **a4**: the displacement time-lapse: the blue fades and copper coats the nail.
- **q5**: chips "zinc" + "sulfuric acid" → "?"; ring.
- **a5**: "zinc sulfate" with a `tick`, "zinc sulfide" struck out, and a small H₂ "+ hydrogen".
- **outro**: "Brilliant work!" and a chip "Acids, Bases & Metals quiz" pointing to the Science Lab.

---

## Suggested animator split

Estimated chapter lengths: intro 30 s, acids 63 s, ph 70 s, indicators 72 s, hazards 69 s,
neutral 77 s, metals 80 s, carbonates 62 s, series 75 s, displace 77 s, burning 67 s,
oxygen 42 s, salts 67 s, recap 56 s, quiz 68 s.

| Group | Chapters | About | Notes |
| --- | --- | --- | --- |
| 1 | intro, acids, ph | 2.7 min | Sets the look: the pH bar, H⁺ ions, cabbage juice colours, the Venn diagram and the 1 → 10 → 100 dot tiles. Shortest, but every later group copies its pH bar. |
| 2 | indicators, hazards, neutral | 3.6 min | Colour work: litmus strips, the pH tower, universal indicator flooding the bar; particle beakers and the 2 × 2 grid; H⁺ + OH⁻ snapping into water. Medium. |
| 3 | metals, carbonates, oxygen | 3.1 min | The gas tests: bubbles, the splint in all three states, the POP, limewater clouding. Defines the splint and POP the recap reuses. Medium. |
| 4 | series, displace, recap | 3.5 min | Hardest chemistry animation: the ladder and mnemonic, sodium skating on water, the nail time-lapse, extraction and electrolysis. The recap reuses the shared art. |
| 5 | burning, salts, quiz | 3.4 min | Both Bunsen chapters: the magnesium flare, tarnishing sodium, rust, the three salt-making steps and growing crystals; the quiz reuses earlier art. Medium. |

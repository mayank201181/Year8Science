# The Periodic Table: storyboard

What the screen shows for every narration line in `script.py`. Line ids are the
animation cues. Durations come from `timeline.json`.

## Shared look for this lesson

Almost every chapter uses the same art, so it is written once in
`lessons/periodic-table/lib.js` (read the comments there for every option):
`ptGrid` (the table, with reveal, metal/non-metal colours, group, period and
family highlights, dimming, the staircase and labels), `ptTile` (a close-up
tile), `shellAtom` (a Bohr atom that fills shell by shell, with an incoming
electron, the outer-shell highlight, the outer-shell gap and orbiting) and
`ptElement(z)` (symbol, name, mass, period, group, family). They follow this
spec:

- **Element tile**: a rounded square (`rx` about 10% of its size) in the family
  colour, with the **symbol** large and bold in the centre, the **name** small
  underneath, the **mass number** small at the top and the **atomic number**
  small at the bottom (the layout on UK exam papers). Close-up tiles are about
  240 px; grid tiles are 56 px with a 4 px gap.
- **The table grid**: the 18-column, 7-row main block (no lanthanide/actinide
  strip), 60 px pitch, starting at about x = 60, y = 190, which keeps the
  chapter-tag corner clear. Group numbers above the main-group columns in the UK
  style (1, 2, 3 to 7, 0), period numbers down the left. The **staircase** is
  the usual stepped line starting left of boron and stepping down-right to
  between polonium and astatine.
- **Family colours**: metals blue `#7FB2E5`, non-metals green `C.chloro`,
  metalloids amber `#F2C14E`. Family highlights: Group 1 orange `C.heat`,
  Group 2 amber `C.glucose`, Group 7 lime `#B5E655`, Group 0 violet `C.ethanol`.
  Hydrogen is green (a non-metal) even though it sits at the top left.
- **Shell atom** (Bohr diagram): a nucleus cluster of red protons (`C.oxygen`,
  with "+") and grey neutrons (`C.carbon`), electrons as blue dots (`C.water`,
  with "−") on concentric rings (`C.line`), radii about 70, 120, 170, 220 px at
  full size. Outer-shell electrons turn yellow (`C.energy`) when the line is
  about them. Electrons are placed in pairs around each ring, as in the
  textbook picture.
- **Halogen colours**: fluorine `#F3EFA0` gas, chlorine `#C9E35A` gas, bromine
  `#8E2F1C` liquid with a brown vapour, iodine `#3B3F4A` crystals with a purple
  vapour `#9B59D0`.
- **Lab kit**: water troughs are wide kit `beaker`s with universal indicator
  (green, turning purple when alkaline); gas jars and tubes are kit `flask` and
  `testTube`; states use kit `particleBox` (`'solid'`, `'liquid'`, `'gas'`);
  hydrogen fizz is lib `bubbles`; flames use lib `glow()` (lilac `#C8A2F0`);
  labels use kit `labelLine`.
- Molecule pairs (O₂, Cl₂) are two touching balls, as lib `molO2` draws O₂;
  chlorine balls are lime with a "Cl" letter.

## intro: A table that predicted the future

A dark desk seen from above, covered in element cards. Art: element tiles,
a "?" tile, a date chip, a germanium sample (new: a grey metallic lump).

- `hook`: An "1869" chip; cards slide into a grid on the desk, leaving two empty
  slots that pulse with a "?".
- `predict`: Ghost writing fills one "?" slot (mass about 72, density 5.5, grey
  metal); a real grey lump drops in and the ghost numbers turn into ticks
  (lib `tick`). **Showpiece.** The question "How could a table predict the
  future?" fades in at the end of the line.
- `def`: The desk of cards morphs into the modern grid; title "The periodic
  table"; a pointer touches one tile and it glows.
- `plan`: Three roadmap chips (lib `chip`): a shell atom ("Inside the atom"), a
  grid ("Reading the table"), a fizzing trough ("The families"). They light in turn.

## what: What the periodic table is

Starts as a montage, then the grid builds itself. Art: grid and tiles, lib
`molO2`, `molH2O`, a phone icon and a person outline (kit `person`), a gold bar.

- `everything`: A phone, a glass of water, air and a person each dissolve into
  coloured atoms that fly off towards empty tiles.
- `element`: A gold bar zooms into a lattice of identical gold atoms: "one kind
  of atom"; a hammer and a flame bounce off it, with lib `cross` "can't break
  down".
- `known`: Gold, oxygen and carbon tiles pop in; a counter spins up to "118".
- `order`: The empty grid outline appears; an atomic-number counter at the top.
- `count`: H (1) drops into the top left, He (2) into the top right, then the
  counter ticks 3, 4, 5 ... as tiles fill row by row. **Showpiece.**
- `box`: Zoom into sodium's tile; kit `labelLine`s to symbol "Na", name, atomic
  number 11 (bottom) and mass number 23 (top).
- `notmass`: Tellurium (52, mass 128) and iodine (53, mass 127) sorted by mass
  swap, and iodine lands in the wrong column (red outline); they swap back by
  atomic number with a `tick`.
- `columns`: One column glows and its tiles share a colour: "similar
  properties".

## atom: Inside the atom: particles and shells

One big shell atom centre-left, a number panel on the right. Art: shell atom,
element tile, a cartoon bus (new), lib `meter`.

- `nucleus`: Zoom from sodium's tile into a tiny nucleus of red and grey balls.
- `charges`: "+" signs appear on the protons (`shellAtom` with `signs: true`)
  and a "no charge" label points at a neutron; blue electrons with "−" begin
  orbiting on faint rings.
- `atomicno`: The protons count up to 11 with a label "atomic number =
  protons"; the tile beside reads Na.
- `massno`: Protons and neutrons together count to 23: "mass number"; an
  electron on a weighing scale barely moves the pointer.
- `neutral`: 11 "+" and 11 "−" chips pair up and cancel; a charge `meter`
  settles at 0.
- `sodium`: The panel shows 11 and 23 from the tile, then "11 protons", "11
  electrons".
- `subtract`: "23 − 11 = 12" writes itself; 12 grey neutrons pop into the
  nucleus.
- `isotopes`: Two carbon nuclei side by side.
- `carbon`: Left "carbon-12": 6 red, 6 grey. Right "carbon-14": 6 red, 8 grey
  (the two extra neutrons glow).
- `same`: Both slide into one "C" tile; their identical electron shells (2, 4)
  overlay exactly.
- `shells`: Three empty rings labelled 2, 8, 8.
- `bus`: A cartoon bus with 2 seats at the front, 8 in the middle and 8 at the
  back; each seat block maps onto a ring.
- `build`: Sodium's 11 electrons drop onto the rings one by one: 2, then 8, then
  1, and the label builds "2, 8, 1". **Showpiece.**
- `outer`: The single outer electron pulses yellow: "outer electrons decide
  reactions".

## groups: Groups and periods

The grid on the left two-thirds; atom diagrams on the right. Art: grid, small
shell atoms, lib `arrow`, `cross`, `tick`.

- `group`: A column highlight sweeps down Group 1.
- `lnk`: Small shell atoms stack beside the column: Li 2, 1; Na 2, 8, 1; K 2, 8,
  8, 1. Each outer electron glows yellow.
- `similar`: The three atoms each give a matching fizz icon: "similar
  properties".
- `number`: Group numbers light above the columns; the outer-electron counts
  pop up in example atoms (1 in Group 1, 7 in Group 7).
- `period`: A row highlight sweeps across Period 3; period numbers 1 to 7 down
  the left.
- `across`: Period 3 tiles from Na to Ar light one by one while one atom
  diagram fills its third shell from 1 to 8 electrons. **Showpiece.**
- `chlorine`: Chlorine's 2, 8, 7 atom; one arrow up its column ("Group 7"),
  one along its row ("Period 3").
- `calcium`: Calcium's 2, 8, 8, 2 atom; column "Group 2", row "Period 4".
- `trap`: A big down arrow "group" and a big across arrow "period"; the swapped
  version is struck out (lib `strike`).
- `predict`: A mystery tile in Group 1 takes on the column's colour and gets
  the label "reactive metal".

## metals: Metals, non-metals and the staircase

The grid fills the top half, a demo bench below. Art: grid, kit `cellSym`,
`bulbSym`, `wire`, `magnet`, `particleBox`; a hammer, a bell, a pencil, a
silicon chip, a 1p coin (new, simple).

- `split`: Grid tiles colour blue across the left and centre, green on the
  right.
- `staircase`: The zig-zag staircase draws itself down between them.
  **Showpiece.**
- `most`: A pie chart fills to four-fifths blue; the hydrogen tile at the top
  left flashes green: "non-metal!".
- `shiny`: A metal bar with a shine sweep; on the bench, a circuit (kit
  `cellSym`, `wire` with current dots, `bulbSym`) lights through a metal rod.
- `malleable`: A hammer flattens a lump into a sheet; a rod stretches into a
  wire.
- `dense`: A metal block with a high melting-point bar; a bell rings with sound
  arcs: "sonorous".
- `dull`: Non-metal samples: a dull yellow sulfur lump, a gas jar with kit
  `particleBox` in `'gas'`.
- `brittle`: The circuit with a sulfur rod: the bulb stays dark; a hammer
  shatters the sulfur lump.
- `graphite`: A pencil lead in the circuit: the bulb lights; `tick` and
  "exception".
- `metalloids`: Silicon's tile glows amber on the staircase; a silicon chip
  icon.
- `magnet`: Kit `magnet` sweeps along a row: a paperclip and a steel spoon jump
  to it (`tick`); foil and copper wire stay put (`cross`).
- `coins`: A copper-coloured coin jumps to the magnet; a cutaway shows a thick
  steel core under a thin copper skin.

## alkali: Group 1: the alkali metals

Grid column to begin with, then three water troughs side by side across the
stage. Art: grid, shell atoms, kit `beaker` troughs, lib `bubbles`, `glow`,
`arrow`; a knife and an oil jar (new).

- `meet`: Group 1 lights orange; Li, Na and K tiles slide forward.
- `one`: Each tile flips to a shell atom with a single yellow outer electron;
  badge "most reactive metals".
- `soft`: A knife slices a block of sodium like butter (the cut face shines,
  then dulls); then all three bob on water.
- `oil`: Chunks sit in a jar of oil; oxygen and water molecules bounce off the
  oil's surface.
- `water`: One trough with universal indicator: a chunk fizzes, bubbles labelled
  "hydrogen", and the water turns purple: "alkaline".
- `li`: Left trough: lithium fizzes gently.
- `na`: Middle trough: sodium melts into a silver ball and zips around.
- `k`: Right trough: potassium shoots across and bursts into a lilac flame.
  **Showpiece.**
- `trend`: A big arrow down the column: "reactivity increases".
- `kids`: The mnemonic, first letters yellow, with Li, Na, K, Rb, Cs, Fr tiles
  dropping into the column.
- `bigger`: Li, Na and K atoms side by side, each larger; a distance arrow from
  nucleus to outer electron grows.
- `shield`: Inner shells shade like a curtain between the nucleus and the outer
  electron: "shielding".
- `lost`: The nucleus's pull on K's outer electron (a thin line) snaps and the
  electron drifts away: "lost more easily".
- `group2`: The Group 2 column lights amber; Mg and Ca atoms with two outer
  electrons; a reactivity bar shorter than Group 1's.
- `calcium`: Calcium fizzes steadily in one trough beside sodium zipping wildly
  in another.

## halogens: Group 7: the halogens

Grid column, then a row of sealed gas jars and bottles on a shelf. Art: grid,
shell atoms, kit `flask`, `testTube`, `particleBox`, `bunsen`; swimming-pool
and tap icons (new).

- `meet`: Group 7 lights lime; F, Cl, Br, I and At tiles slide forward.
- `seven`: Chlorine's 2, 8, 7 atom; the one gap in its outer shell blinks.
- `pairs`: Two chlorine balls click together into a pair labelled Cl₂.
- `fluorine`: Jar 1 fills with pale yellow gas.
- `chlorine`: Jar 2 fills with green-yellow gas; a pool and a tap appear beside
  it.
- `bromine`: A bottle of red-brown liquid gives off brown vapour; a drop of
  mercury beside it; label "liquid at room temperature".
- `iodine`: Dark grey crystals in a tube are gently warmed (kit `bunsen`) and
  purple vapour rises.
- `state`: The four samples line up over kit `particleBox` icons: gas, gas,
  liquid, solid; a melting and boiling point bar climbs.
- `clowns`: The mnemonic, first letters yellow, above the matching tiles.
- `twist`: An arrow down the column: "reactivity decreases", with Group 1's
  arrow shown faintly pointing the other way.
- `displace`: A kit `testTube` of colourless sodium bromide solution; pale
  chlorine water drips in; Cl atoms swap in, Br atoms are pushed out, and the
  solution turns orange. **Showpiece.**
- `gain`: An incoming electron is pulled into chlorine's outer-shell gap.
- `grip`: Fluorine and iodine atoms side by side: fluorine's small atom snaps an
  electron in; iodine's distant, shielded shell lets it slip past.

## noble: Group 0: the noble gases

Grid column, then three atoms on velvet cushions, then a night street. Art:
shell atoms, a balloon, an airship, an MRI ring, kit `sun`, a neon sign, a
filament bulb and a welding torch (all new, simple), lib `spark`, `glow`.

- `meet`: Group 0 lights violet; He, Ne and Ar tiles slide forward.
- `inert`: Other atoms bounce off the three noble gases, which do not react.
- `full`: Shell atoms: He 2; Ne 2, 8; Ar 2, 8, 8; each full outer ring glows.
- `stable`: Three arrows, "gain", "lose" and "share", each crossed out.
- `posh`: The three atoms wear tiny crowns and turn up their noses; an
  empty-shell picture is struck out beside a full one with a `tick`.
- `others`: Sodium hands its outer electron to chlorine: Na ends with 2, 8 (like
  neon), Cl with 2, 8, 8 (like argon).
- `salt`: A bright flash as they combine, then a salt shaker sprinkling onto
  chips.
- `helium`: A helium balloon and an airship float up; a crossed-out flame icon;
  then an MRI scanner ring with a frosty glow.
- `sun`: Kit `sun` with a spectrum strip below it and one bright yellow line;
  the word "Helios" over the Sun.
- `neon`: A dark street; a NEON sign flickers and glows orange-red.
  **Showpiece.**
- `argon`: An old filament bulb glowing with argon atoms inside; a welding torch
  sparks (lib `spark`) inside a cloud of argon.
- `xenon`: A xenon atom joined to fluorine atoms; a "1962" chip.

## mendeleev: Trends, prediction and Mendeleev

The grid, then Mendeleev's desk of cards. Art: grid, element cards, a portrait
card (bearded silhouette, new), kit `beaker`, lib `chip`, `tick`, `cross`.

- `power`: A magnifying glass passes over the grid and stops on an empty box:
  "prediction".
- `down`: Two column arrows: Group 1 "reactivity rises", Group 7 "falls"; a
  smooth melting-point curve beside them.
- `across`: A sweep across Period 3 blends the tiles from metal blue to
  non-metal green; outer-electron counts 1 to 8 appear above them.
- `rubidium`: The Rb tile below K; a trough with a violent flash and splash;
  "prediction" chip.
- `mendeleev`: A portrait card "Dmitri Mendeleev, 1869" beside his desk of
  cards.
- `arranged`: The cards line up in order and stack into columns of similar
  elements.
- `gaps`: Two "?" gaps glow, below aluminium and below silicon.
- `predicted`: A prediction card writes itself next to the silicon gap: mass
  about 72, density 5.5, grey metal, forms an oxide.
- `gallium`: The aluminium gap: gallium arrives (1875); a density reading "4.7"
  gets a red `cross`, a "measure again" arrow, then "5.9" with a `tick`.
- `germanium`: The silicon gap: germanium arrives (1886); real values (72.6,
  5.35, grey) slot in beside the prediction card, each ticked. **Showpiece.**
- `evidence`: The ticks merge into an "evidence" stamp; the table's columns
  glow as one pattern.
- `today`: Te and I tiles swap into their proton-number order (52, 53) with a
  `tick`.

## recap: Recap: memory hooks and exam traps

Same layout as Respiration's recap: a padlock clicks shut, four memory-hook
cards build a 2×2 grid (first letters in yellow), then five trap cards, each
with the wrong idea struck out and the right idea ticked plus a small picture.

- `lock`: Padlock clicks shut: "Lock it in".
- `bus`: Card 1: "2, 8, 8" with the mini bus.
- `kids`: Card 2: Little Naughty Kids Run Crazy Fast, with a down arrow
  "more reactive".
- `clowns`: Card 3: Funny Clowns Bring Ice, with a down arrow "less reactive".
- `posh`: Card 4: a crowned noble gas atom with a full shell. **Showpiece**: the
  2×2 grid complete.
- `traps`: Grid fades; "5 exam traps" title with five empty slots.
- `t1`: Sodium tile: 11 labelled "atomic number = protons", 23 labelled "mass
  number = protons + neutrons".
- `t2`: "23 neutrons" struck out; "23 − 11 = 12" ticked.
- `t3`: Group 1 arrow "increases", Group 7 arrow "decreases"; "both increase"
  struck out.
- `t4`: Column arrow "group", row arrow "period"; swapped version struck out.
- `t5`: "Ordered by mass" struck out; "ordered by atomic number" ticked.

## quiz: Quick-fire quiz

Same layout as Respiration's quiz: five progress dots top right, a question
card, a countdown lib `ring` through each 4-second pause, then the answer with a
small picture; outro sparks.

- `intro`: Speech bubble with "?" and "Say it out loud!"
- `q1`: Question card with a tile showing 23 and 11; ring counts down.
- `a1`: "12 neutrons" with 23 − 11 = 12; dot 1 fills.
- `q2`: Question card with a highlighted column; ring.
- `a2`: "Same number of outer electrons" with Li, Na, K outer electrons glowing;
  dot 2.
- `q3`: Question card with sodium on water; ring.
- `a3`: "Hydrogen" with bubbles and purple (alkaline) water; dot 3.
- `q4`: Question card with Mendeleev's "?" gap; ring.
- `a4`: "Undiscovered elements, predicted" with germanium ticking into the gap;
  dot 4.
- `q5`: "True or false?" card with the Group 7 column; ring.
- `a5`: "False: it decreases" with fluorine crowned most reactive; dot 5.
- `outro`: "Brilliant work!" with a burst of lib `spark`s and a "Periodic Table
  quiz" button. **Showpiece**: all five dots full as the sparks burst.

## Suggested split for the animators

Four groups, balanced by length and difficulty (chapter lengths from
`timeline.json`; the whole lesson is 14.5 minutes). Nearly every chapter needs
the grid or the shell atom: use `ptGrid`, `ptTile` and `shellAtom` from
`lessons/periodic-table/lib.js` rather than drawing new ones.

| Group | Chapters | Length | Art and difficulty |
| --- | --- | --- | --- |
| A | intro (32 s), what (66 s), mendeleev (92 s) | 3.2 min | the grid, tiles and Mendeleev's cards; medium |
| B | atom (101 s), groups (75 s), recap (55 s) | 3.8 min | shell atoms and grid highlights; recap follows the Respiration pattern; medium-hard |
| C | metals (87 s), alkali (98 s) | 3.1 min | demo bench, kit circuit and magnet, the three troughs (the lesson's big showpiece); hardest, so the shortest |
| D | halogens (95 s), noble (93 s), quiz (76 s) | 4.4 min | glassware colours, displacement, the neon sign; quiz follows the Respiration pattern; medium |

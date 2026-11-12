# HAPPILY EVER ATOM, Episode 6 "Just Flatmates": storyboard

A mockumentary sitcom (a documentary crew films; characters talk to camera) that teaches Elements,
Compounds & Mixtures. Audience: a 12-year-old watching while eating. It must be FUNNY first (dry,
deadpan, never mean) and teach every idea exactly. Read `script.py`: every line has a speaker (`who`),
and its caption shows the speaker's name.

**Premise.** Arthur, a tired argon atom, runs a matchmaking agency for atoms in the air above Kavya's
kitchen. Singles are **elements**. When two different elements bond they become a **compound** with a
brand new personality (Nate the sodium + Chloe the chlorine = Sal, table salt). Atoms that just share
a flat are a **mixture**, and they can move out (**separation techniques**). Arthur never bonds: he is
a **noble gas**. Running gags: Arthur's "No." pauses; "Big then small"; Sandy gets left behind by
everyone; Nigel and Nigel are identical; "Matching. It's what I do."; Kavya's brother is guilty.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'arthur'), mood, look })`.
  For the Nigels (two faces, one voice `nigels`): `talk: scTalk(S, t, 'nigels')` on the LEFT Nigel for
  `hi`, and `talkB` on the RIGHT Nigel for `also`; elsewhere move the mouth of the Nigel facing camera,
  or both mouths for lines that start "We".
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Arthur goes `deadpan` at every silly remark (his default), Nate `happy`/`shock`, Chloe `smug`, Sal
  `happy`, Sandy `sad`, the Nigels `neutral` (identical, always the same mood as each other), Inky
  `happy` then `shock`, Kavya `annoyed`/`deadpan`. Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** A line with a `pause` is followed by silence. Hold the reaction there:
  a slow push-in on Arthur's deadpan face, Sandy blinking, the Nigels staring in perfect sync.
- **Talking heads** (line ids starting `th`, and the lines marked **TH** below) use the confessional:
  `ecConfessional(root, kind)` full stage, the character big (s about 1.5) at about (430, 390), with a
  prop where it helps (Arthur's `ecMug`). The first time a character appears, show
  `scLowerThird(root, ...EC_LOWER[kind])` for about 3 s. Cut instantly (fade over 0.25 s at most):
  sitcom cuts are snappy.
- **Science on screen:** whenever a key word, formula or rule is said, it appears big and clear (chip,
  card or whiteboard) in the colours below. Formula subscripts are real `tspan`s (or ₂ characters at a
  readable size): H₂O, CO₂, O₂, N₂, NaCl. Symbols are written with the correct case every time (Na, Mg,
  Cl, Co); a wrong one (NA, CO for cobalt) is only ever shown crossed out or with a red ✗.
  The jokes can be silly; the science must be exact.
- **Atom colours (keep them in every scene, via `ecAtom`):** N blue, O red, H white, C grey, Na silver,
  Cl yellow-green, Ar lilac, Fe rust. Sodium chloride is drawn as a cube (Sal) or a lattice of silver
  and green dots, **never** as a single two-atom molecule.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. At most about
  650 elements per scene; no SVG filters.

## Cast (lib.js `cast(root, kind, { s, mood })`, all about 200-250 px tall at s = 1)

| kind | who | look | lower third (`EC_LOWER`) |
| --- | --- | --- | --- |
| arthur | Arthur, argon: the matchmaker who never bonds. Tired, dry, secretly kind. "No." | lilac glowing ball, grey side tufts and comb-over, lanyard "Ar" card; `ecMug` | ARTHUR / Argon. Noble gas. Doesn't bond. |
| nate | Nate, sodium: over-excited, reactive, scared of water | shiny silver ball, spiky quiff, yellow "Na" badge, flickering zaps; `sweat` | NATE / Sodium (Na). A very reactive metal. |
| chloe | Chloe, chlorine: gloomy, dramatic, deadpan goth | yellow-green gas cloud, wisps, purple beret, toxic badge | CHLOE / Chlorine (Cl). Poisonous gas. |
| sal | Sal, sodium chloride: the compound. Calm, happy, loves food and travel | white salt-crystal cube with a Na/Cl lattice | SAL / Sodium chloride (NaCl). Table salt. |
| nigels | Nigel & Nigel, nitrogen N₂: identical, polite, in sync (one voice) | two blue atoms, triple bond, same hair, same red bow tie | NIGEL & NIGEL / Nitrogen (N₂). Both Nigel. |
| sandy | Sandy, sand: insoluble, mopey, always left behind | speckled beige grain, pink sun hat; default `sad` | SANDY / Sand. Insoluble. |
| inky | Inky, black ink: a cheerful band frontwoman who turns out to be three dyes | indigo ink drop, pink headphones; `{ col }` for small blue/pink/yellow dye Inkys | INKY / Black ink. One colour. Allegedly. |
| kavya | Kavya, 12, the human: exasperated, sharp | `scKavya` (bust), `scKavyaBody` (full body) | KAVYA, 12 / Has homework. On a Saturday. |

Sets: `ecKitchen` (Kavya's HDB kitchen), `ecAgency` (the agency office, neon logo), `ecAirFlat`
(Arthur's flat in the air, drifting N₂/O₂/Ar), `ecLab` (school lab), `ecConfessional(root, kind)`.
Props: `ecLogo`, `ecMug`, `ecPeriodic`, `ecAtom`, `ecParticles`, `ecFilter`, `ecDistil`, `ecChroma`,
`ecSepFunnel`, `ecTehO`; kit `beaker`, `flask`, `bunsen`, `magnet`, `chip`, `card`, `tick`, `cross`, `arrow`.

## 0 cold: Cold open (card: none)
- kavya: `ecKitchen`; Kavya (scKavya, s about 1.35) behind the table at about (760, 560), a bowl of
  noodles steaming beside her and a worksheet in front. Chips pop in: "Kavya, age 12", "Saturday, 9:00 a.m.".
- homework: cut closer: the worksheet fills the left half: "HOMEWORK: find 20 things in your kitchen"
  with three empty columns ELEMENT | COMPOUND | MIXTURE. Kavya annoyed, reads it, looks at camera on
  "On a Saturday." Lower third KAVYA.
- bowls: whip-pan to the sink: a wobbling tower of dirty bowls. "my brother's bowls" is written in the
  MIXTURE column (an inset of the worksheet). Kavya deadpan in the corner. (The brother is the culprit
  in scene 6: plant him here.)
- small: documentary zoom: a dashed reticle over the noodle steam; the camera pushes in; "ZOOM ×10",
  "×1000"... in a viewfinder frame. Chip "something much, much smaller".
- air: the air fills with drifting molecules (`ecAirFlat`-style: blue N₂ pairs, red O₂ pairs, lilac Ar
  singles). A few single atoms have tiny heart thought-bubbles ("looking for a partner"). Labels "atoms".
- agency: the camera finds a tiny building floating on a cloud among the molecules: a little office with
  the neon `ecLogo` sign over the door. Push in through the door.
- hi (TH): Arthur's confessional, deadpan; lower third ARTHUR; chip "argon (Ar)".
- match: an inset: two atoms slide together, a bond line snaps between them, a heart pops: "bonded ♥".
- me: Arthur shakes his head; two atoms drift up to him and bounce off his glow. Card "NOBLE GAS:
  hardly reacts with anything".
- lazy: a dictionary card: "argon, from Greek *argos* = 'lazy'". Slow push-in on Arthur, deadpan.
- single: a wall counter "DAYS WITHOUT A BOND: 1 460 000 000 000" (4 billion years × 365 days). Arthur
  sips from `ecMug` ("WORLD'S OKAYEST MATCHMAKER") during the 0.9 s pause.
- title: the `ecLogo` "HAPPILY EVER ATOM" with "Episode 6: Just Flatmates"; the cast pops in below it
  in a row, bobbing (classic sitcom title card). Hold.

## 1 singles: The singles (atoms, elements, symbols)
Layout: `ecAgency` for the scene; the periodic table on the agency wall; Arthur behind the desk.
- open: `ecAgency`, a "9:00 a.m." clock; the ticket machine clicks to "08"; single atoms wait on the
  sofa (Nate bouncing among them). Chip "every client = an ELEMENT".
- element: Arthur at the desk. Card "ELEMENT: only ONE type of atom" with a gold bar zooming in to a
  grid of identical gold atoms ("Au, Au, Au...").
- catalogue: Arthur slaps a thick catalogue on the desk; it opens into `ecPeriodic` (big, centre);
  "about 118 elements"; chip "the PERIODIC TABLE".
- simpler: an atom on a workbench; a hammer and a test tube try to split it; it stays one atom. Card
  "can't be broken down into anything simpler by a chemical reaction". Arthur deadpan.
- nate: Nate bursts in (zaps flicker, happy); lower third NATE. Highlight Na on the periodic table.
- thnate (TH): Arthur confessional; an inset sign "NO SODIUM IN THE POOL" with a crossed-out Nate.
- na: a client form: "Name: Nate ✓"; Nate scribbles "Symbol: NA" in big capitals.
- lower: Arthur, deadpan, crosses out the capital A and writes a small "a": "Na". Hold the pause.
- rule: card "CHEMICAL SYMBOL: 1st letter CAPITAL, 2nd letter lower case".
- big: chips appear one by one: **Na** (sodium), **Mg** (magnesium), **C** (carbon), each lit on the
  periodic table. "Big then small" in amber.
- cobalt: two cards side by side: "Co = cobalt, a metal (an element)" with one blue-grey atom;
  "CO = carbon monoxide (a compound)" with a grey C bonded to a red O.
- couple: the CO card gets a little heart and two tiny wedding rings. Arthur deadpan.

## 2 match: The perfect match (compounds and formulae)
Layout: the agency, then a "bonding ceremony" arch (draw an arch of pink flowers in the scene).
- chloe: Nate at the desk, beaming, Arthur holding a file "MATCH FOUND"; Chloe drifts in, wisps trailing;
  lower third CHLOE; Nate `shock`, then `happy`.
- toxic: Chloe deadpan; a toxic hazard sign wobbles beside her.
- thchloe (TH): Arthur confessional; split inset: Nate dropped in water (splash, "BANG" star) and a green
  "POISON" gas cloud. "On paper, a disaster. In chemistry? Perfect." on the last beat Arthur shrugs.
- def: card "COMPOUND = two or more DIFFERENT elements, CHEMICALLY BONDED".
- bond: under the arch Nate and Chloe slide together; countdown 3, 2, 1; a white flash.
- sal: the flash clears: Sal the cube stands there, calm and smiling; lower third SAL.
- food: a salt shaker sprinkles Sal-crystals onto a plate of chicken rice; Sal blissful.
- where: Kavya in the kitchen with the salt shaker, holding it up to her eye, suspicious.
- props: a three-column comparison: sodium (soft metal, explodes in water) + chlorine (poisonous green
  gas) → sodium chloride (white crystals, safe to eat). Big "DIFFERENT PROPERTIES".
- ratio: Sal's side face zooms into the lattice: silver Na and green Cl dots alternating, "1 : 1";
  the formula **NaCl** in big type.
- water: two white H atoms (with "explosive gas" flame icons) and a red O (with "helps things burn")
  join into a water molecule; a little fire goes out with a hiss.
- h2o: big **H₂O**; an arrow points from the little ₂ to "2 hydrogen atoms"; from the O to "no number = 1".
- co2: **CO₂** = O=C=O molecule; the ₂ is rubbed out and it becomes **CO**: "carbon monoxide: a
  different compound!" (red ✗).
- split: Sal with a "DO NOT SEPARATE" sticker; card "to split a compound: a CHEMICAL REACTION".
- happy: Sal smiles; Nate's and Chloe's tiny faces wave from inside the lattice (a cute visual gag).

## 3 flat: Just flatmates (molecules, particle pictures, air, mixtures)
Layout: `ecAirFlat`; the Nigels and Arthur on the cloud sofa.
- flat: `ecAirFlat`; the door sign "FLAT: AIR"; molecules drift by.
- hi, also: the Nigels, in perfect sync; lower third NIGEL & NIGEL. Left Nigel talks on `hi`, right
  Nigel on `also`. Hold the 0.6 s pause: both blink at the same moment.
- thnigels (TH): Arthur confessional; chip "N₂ = a MOLECULE".
- def: card "MOLECULE = two or more atoms joined by chemical bonds" with an N≡N drawing.
- ask: Kavya (bust) on a laptop video call (`scVideoCall`), curious. Then the 1.2 s pause: hard cut to
  Arthur, slow push-in, deadpan.
- no: "No."
- same: two blue N atoms, both labelled N, "same type of atom → ELEMENT"; a "COMPOUND" stamp gets a red ✗.
  On "like O₂" an O₂ molecule (two red O) floats in: "O₂: also an ELEMENT".
- lot: the Nigels, both nodding in sync.
- pictures: three `ecParticles` boxes appear: 'element', 'compound', 'mixture', unlabelled.
- two: question cards: "same or different atoms?" "joined or just mixed?".
- sbf: labels drop onto the boxes in turn: ELEMENT (same), COMPOUND (different, bonded), MIXTURE
  (different particles, not bonded to each other). Then the mnemonic **Same, Bonded, Free** big in amber.
- share: a pie chart of air: 78% nitrogen (blue), 21% oxygen (red), about 1% argon (lilac, with a tiny
  Arthur); "AIR = a MIXTURE". The different gases are not joined to each other
  (each N₂ and O₂ is still its own molecule: the Nigels keep holding hands, but not with anyone else).
- alloys: a wave of sea water (salt dissolved), a brass trumpet (copper + zinc atoms jumbled), a steel
  beam (iron with a few carbon atoms). Chips "SEA WATER", "BRASS = copper + zinc", "STEEL = iron + carbon".
- brass: Kavya squints at the trumpet.
- costume: the trumpet wears a fake moustache and glasses; peeking behind it, jumbled Cu and Zn atoms.
- versus: a two-column card: COMPOUND (bonded ✓, fixed ratio ✓, split by a chemical reaction) vs
  MIXTURE (not bonded, each keeps its own properties, any ratio, separated by physical methods). Showpiece: build it row by row.

## 4 swim: Sal goes for a swim (purity, melting points, solutions)
Layout: kitchen breakfast, then `ecLab` with a big beaker.
- carton: Kavya with a juice carton "100% PURE ORANGE JUICE".
- pure: card "PURE (chemistry) = ONE element or ONE compound, nothing else mixed in"; the carton's
  contents fly out as icons: water, sugar, acids, bits: "a MIXTURE".
- melt: a thermometer in melting ice: the line is flat at exactly 0 °C (a small temperature-time graph
  with a sharp flat step). Chip "PURE: one sharp melting point".
- impurity: Sal jumps into the ice; the graph's step moves DOWN below 0 °C and becomes a slope (a range);
  a second chip "boiling point goes UP". Arrows ↓ melting point, ↑ boiling point, "over a RANGE".
- roads: a snowy road in a cold country; a gritting truck sprays salt; the ice melts.
- hot: Kavya, sweating (`sweat: 1`), "34 °C" sun. In the 0.7 s pause cut to Sal, wistful, holding a tiny
  postcard of a snowy mountain (he has never been).
- gone: hard cut to `ecLab`: a big beaker of water; Sal cannonballs in (splash); Kavya peers into the clear
  water: nothing visible. Shock.
- dissolved: zoom into the water: Sal's lattice breaks into separate particles spread evenly among
  blue water particles. Chip "DISSOLVED".
- words: three labels with leaders: SOLUTE (the salt particles), SOLVENT (the water), SOLUTION (the
  whole beaker). Mnemonic note: "the solUTE dissolves; the solVENT is the liquid it's IN".
- mass: a balance: 10 g salt + 100 g water = 110 g solution. "Nothing destroyed" (mass conserved).
- sandy: Sandy plops in and sinks to the bottom; lower third SANDY; chip "INSOLUBLE"; Sal particles
  swim around her. Hold the pause on Sandy, sad.
- saturated: more salt spoonfuls go in; the last ones sit undissolved at the bottom: "SATURATED: no more
  will dissolve".
- solubility: card "SOLUBILITY = the most that can dissolve"; a hot and a cold beaker: the hot one takes
  more sugar ("rises with temperature").
- peng: Kavya's iced teh-O (`ecTehO`, ice cubes) with a sugar pile at the bottom (`set(1)`).
- stir: a spoon stirs; Arthur deadpan.
- conc: two glasses of teh-O: few sugar particles "DILUTE", many sugar particles "CONCENTRATED", same volume.
- siewdai: a kopitiam order slip "teh-O siew dai = less sugar"; the dilute glass lights up. In the pause,
  cut to Arthur: a tiny proud smile (`happy` for one beat), then back to deadpan.

## 5 evict: Eviction night (filtration, evaporation, crystallisation, distillation)
Layout: `ecLab`, reality-show style: a lower-corner banner "EVICTION NIGHT" with spotlights.
- evict: a beaker of muddy, salty water (brown, with Sandy and Sal inside); banner "EVICTION NIGHT".
- filter: `ecFilter`; the mixture is poured in (`cloudy` up). Card "FILTRATION: insoluble solid from a liquid".
- stuck: Sandy stuck in the paper cone, flailing (`residue` up).
- holes: magnified paper: sand grains too big for the holes; tiny salt and water particles pass
  through. Labels RESIDUE (on the paper) and FILTRATE (in the flask).
- residue: Sandy on the paper, sad; the label RESIDUE wobbles.
- through: Sal's particles slide through the paper, waving.
- cant: card "You CAN'T filter salt out of salt water" (salt water + filter paper with a big red ✗).
- evap: an evaporating basin on a Bunsen; steam rises; white salt appears on the bottom. Chip "EVAPORATION".
- cryst: three numbered steps: 1 heat until saturated (a drop on a glass rod forms crystals), 2 cool
  slowly (cubic crystals grow), 3 filter and dry (crystals on filter paper).
- cube: Sal pops back together as a cube, sparkling, arms up.
- distil: Kavya with a clipboard (`scClipboard`): "now get the WATER back", then `ecDistil`; heat on: bubbles in
  the flask, vapour rises. Chip "SIMPLE DISTILLATION".
- condense: vapour along the condenser turns to drops; pure water collects in the beaker (`collect`
  up); the salt stays in the flask. Labels CONDENSER, "water in", "water out", "pure water".
- keep: a two-panel card: EVAPORATION keeps the SOLID (salt pile) | DISTILLATION keeps the LIQUID (beaker).
- fraction: a tall fractionating column; liquids rise; the lowest boiling point exits at the TOP first.
  Crude oil barrel icon. Chip "FRACTIONAL DISTILLATION: different boiling points".
- thair (TH): Arthur confessional; inset: Arthur's flat frozen into a liquid, then boiled off.
- first: the Nigels pop out at the top of the column first, holding a tiny trophy "LOWEST BOILING POINT".
  (Then argon, then oxygen: true for liquid air.)

## 6 band: The band breaks up (chromatography, separating funnel, magnets)
Layout: the kitchen (fridge), then a "crime board" style chromatography.
- crime: `ecKitchen`; the fridge door open, an empty bubble tea cup with its straw; a sticky note on the
  fridge.
- note: close-up of the note: "SORRY" in black ink. Three suspect cards: MUM, DAD, BROTHER (the bowls
  from the cold open behind BROTHER).
- inky: Inky leaps out of the note, headphones on; lower third INKY.
- chroma: card "CHROMATOGRAPHY: separates coloured substances (dyes)".
- spot: `ecChroma`: the paper with a dashed PENCIL line; four spots: NOTE, MUM, DAD, BROTHER; the solvent
  in the beaker sits just BELOW the spots. Labels "pencil line", "solvent".
- travel: `ecChroma.set(p)` runs: the solvent front climbs; the spots separate (showpiece). Labels
  "travels further: more soluble / sticks less to the paper".
- split: Inky splits into three small dye Inkys (blue, pink, yellow: `cast(.., 'inky', { col })`), each
  shocked.
- thinky (TH): Arthur confessional, deadpan.
- identify: lines across the paper join the NOTE spots to the matching BROTHER spots: all level ✓;
  MUM and DAD do not match ✗. Chip "same position = very likely the SAME substance".
- knew: Kavya (bust) points at camera, triumphant (`smug`); a "GUILTY" stamp on the BROTHER card.
- oil: `ecSepFunnel` filled: yellow oil layer on top of blue water. Labels "IMMISCIBLE", "less dense
  oil on top".
- funnel: the tap opens (`set(p)`): the lower water layer drains into the beaker; it closes just as the
  boundary reaches the tap.
- magnet: a dish of sand with grey iron filings; a bar magnet (kit `magnet`) lifts the filings out.
- leaving: Sandy alone in the dish, sad, waving at the iron.
- only: chips: iron, steel, nickel, **Co**balt, with "Co" in the cobalt chip highlighted (small o).
- method: a decision card, three questions: "solid, liquid or dissolved?" "do they mix?" "magnetic?",
  with the matching methods beneath. Title "MATCH THE METHOD TO THE MIXTURE".
- job: Arthur deadpan, a tiny shrug; a heart pops above the card.

## 7 traps: The cast saves you some marks
- intro: "7 EXAM TRAPS" heading over the agency logo.
- t1-t7: quick confessional cuts, one per speaker (Nate, Chloe, the Nigels, Sal, Sandy, Arthur, Inky),
  each with its trap on a card:
  1 symbols: **Na** not ~~NA~~, two capitals = two elements (CO is carbon monoxide);
  2 a compound has different properties from its elements (poison gas → on chips);
  3 identical atoms joined (N₂, O₂) are still an ELEMENT;
  4 dissolved ≠ destroyed: mass is conserved;
  5 you can't filter salt out of salt water (Sandy alone on the filter paper);
  6 evaporation keeps the solid, distillation keeps the liquid;
  7 impurities LOWER the melting point and spread it over a range.
- return: the `ecLogo` returns: "HAPPILY EVER ATOM will return".
- setup, noble, argon, flatmates (stinger): `ecAirFlat`; the Nigels present Arthur with a second lilac
  argon atom (same look, a little bow). Arthur deadpan on "I'm a noble gas"; hold the 1.0 s pause: the two
  argon atoms stare at each other. On "We'll be flatmates" they sit at opposite ends of the cloud sofa,
  not touching (still not bonded!). Final frame: the two of them on the sofa, the Nigels between, logo.

## Suggested split for the animators
- A: 01 singles, 02 match (the agency set, symbols, the bonding flash and Sal's lattice).
- B: 03 flat, 04 swim (the air flat, particle pictures, the melting-point graph, dissolving).
- C: 05 evict, 06 band, 07 traps (the apparatus props, chromatography and the stinger).

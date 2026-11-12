# TEST TUBE KITCHEN, Episode 7 "Nothing Is Lost": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Chemical Reactions.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

Premise: during a sweltering Year 8 practical, the camera shrinks into the bottom of Kavya's test tube,
where atoms are filming the final of a cooking competition. Ingredients are **reactants**, dishes are
**products**. Arrow (the reaction arrow) is the tired head judge; Olly (oxygen) is the celebrity guest chef
who joins in everything; Madam Mass (a digital balance) audits every dish's mass; Ferris (an iron nail) is
the mopey contestant who is slowly rusting and finally wins; Monty (carbon monoxide) is the guest nobody
invited; Kat (a platinum catalyst) says one word in the whole episode. Kavya's own practical (boiling water,
burning magnesium, a Bunsen burner, a cold pack, a piece of bread) is the human cutaway.

## Comedy rules (the most important part)
- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'arrow'), mood, look })`.
  The `who` keys are `arrow`, `olly`, `mass`, `ferris`, `monty`, `kat`, `kavya` (the narrator `narr` has no mouth).
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Arrow goes `deadpan` at every silly remark (his default), `annoyed` whenever anyone says "Equals";
  Olly `happy` (default) and `smug` when he thinks he is right, `shock` when corrected; Madam Mass `deadpan`
  (default), `smug` when the numbers balance; Ferris `sad` (default), `happy` only in scene 5 and at the end;
  Monty `smug` (default), `annoyed` at the alarm; Kat `deadpan` (asleep-looking) always.
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in on Arrow's deadpan face, Madam Mass's LCD not changing, Ferris blinking, Kat not moving at all.
- **Talking heads** (line ids starting `th`, plus the ones marked TH below) use the confessional shot:
  `tkConf(root, kind)` full stage, the character big (s about 1.4) at about (430, 400), a prop where it helps.
  The first time a character appears (confessional or not), show `scLowerThird(root, NAME, ROLE)` for about
  3 s (names below). Cut instantly (fade over 0.25 s at most): sitcom cuts are snappy.
- **The running gags:** (1) people call Arrow "Equals" (cold `therapy`, menu `equals`/`arrow`, traps `t1`):
  each time, a small red "=" floats near him and gets a red cross; (2) Ferris's rust (`set({ rust })`) creeps up
  through the episode: 0.25 in the cold open, 0.45 by scene 4, 0.7 by scene 5, then the copper coat
  (`set({ copper })`) at `winning`; (3) Kat is always somewhere in the background, asleep on the counter, in
  every kitchen shot from scene 1 on, never changing; (4) Madam Mass's LCD (`set({ reading })`).
- **Science on screen:** whenever a key word or equation is said, it appears big and clear (chip, stamp, card or
  the chalkboard `tkBoard`), with real subscripts via `tkFormula` (`'2H2 + O2 -> 2H2O'`; coefficients turn
  amber automatically). The jokes can be silly; the science must be exact. Atoms use the lib colours:
  O red, H white, C grey, Mg silver-white (`#D9E0E7` with a dark "Mg" label), Cu copper `#D9825B`, Fe grey.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Nothing on the bottom
  110 px except the lower third (captions live below the stage).

## Cast (lib.js `cast(root, kind, { s, mood })`, then `g.set({...})` every frame)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| arrow | Arrow, the reaction arrow (→): tired, sarcastic head judge. NOT an equals sign | gold arrow pointing right, face on the shaft, chef's toque, bow tie, eye-bags | ARROW / Head judge. Not an equals sign. |
| olly | Olly, oxygen (O₂): celebrity guest chef, joins in everything, very confident, often wrong | two fused red atoms, one big face, sunglasses up, headset mic; `sparkle` | OLLY / Oxygen. Celebrity guest chef. |
| mass | Madam Mass, a digital balance: strict auditor, deadpan, has never been surprised | grey top-pan balance, face on the front, half-moon glasses, green LCD (`reading`); `g.pan` | MADAM MASS / The balance. Auditor. |
| ferris | Ferris, an iron nail: mopey contestant, slowly rusting, wins | tall grey nail; `rust` 0..1, `copper` 0..1 | FERRIS / Iron nail. Contestant. |
| monty | Monty, carbon monoxide (CO): the sneaky, toxic, uninvited guest | grey C with face + red O, fedora, trench-coat collar | MONTY / Carbon monoxide. Not invited. |
| kat | Kat, a platinum catalyst: silent, sleepy, never used up | small silver cat, "Pt" collar tag; `tail` | KAT / Catalyst. Never used up. |
| kavya | Kavya, 12, the human: exasperated, hot, hungry | head and shoulders, lab coat, goggles on forehead; `sweat` | KAVYA, 12 / Still waiting. |

Sets: `tkKitchen` (the competition, at the bottom of the test tube) + `tkCounter` (the island, drawn IN FRONT of
the cast; top at `g.counterY` = 590), `tkLab` (Kavya's lab wall, 34 °C) + `tkBench` (the bench and test-tube
rack, IN FRONT of Kavya; top at `g.benchY` = 560; `g.tubes`), `tkConf(kind)` (confessionals).
Layer order in every kitchen/lab shot: set, cast, counter/bench, props on the counter/bench, chips, HUD.
Props: `tkBoard` (chalkboard menu), `tkFormula`, `tkDish` (plate + cloche), `tkStamp` (verdict stamps),
`tkAlarm` (CO alarm), `tkHob` (gas ring: blue/yellow), `tkTitle` (logo). Kit: `beaker`, `testTube`, `flask`,
`bunsen` (`set('yellow'|'blue')`), `thermometer`, `bubbles`, `heatWaves`, `spark`, `molO2/molCO2/molH2O`, `atom`.

Shot grammar: kitchen wide = `tkKitchen` with Arrow centre-right behind the island (about (760, 470), s 1),
Madam Mass at the right end of the island (about (1010, 500), s 0.8), Olly bouncing on the left
(about (300, 450)), Kat asleep on the island's left end (about (170, 545), s 0.45). Dishes sit on the island.

## 0 cold: Cold open (card: none)
- kavya: `tkLab`; Kavya (cast 'kavya', s 1.3) behind the bench, centre-left, sweating (`sweat: 0.6`), mood
  annoyed, staring at the middle test tube in the rack. Chips pop in: "Kavya, age 12", then a thermometer chip
  "34 °C" and an arrow to the aircon's "OUT OF ORDER" note. The ceiling fan turns.
- stare: tighter shot; a worksheet card pops in: "PRACTICAL: Observe a chemical reaction" with an empty
  "Observations: ________" line; a stopwatch counting "5:00". Lower third KAVYA, 12 / Still waiting.
- weekend: slow push-in on Kavya, deadpan; in the silence (pause 0.7) a single bubble rises in her test tube
  and pops. Nothing else happens.
- small: documentary zoom: a dashed reticle locks onto the bottom of the middle test tube; "ZOOM ×10" counter.
- shrink: the zoom races (counter to "×100 000 000"); the glass bottom fills the screen and becomes the
  `tkKitchen` set: the neon sign "TEST TUBE KITCHEN" flickers on, the spotlights sweep. Applause chip.
- hi (TH): Arrow confessional (`tkConf('arrow')`), deadpan; lower third ARROW / Head judge. Not an equals sign.
- rules: kitchen wide, Arrow behind the island: a plate of "ingredients" on the left (two grey C atoms and two
  red O₂ pairs), `tkDish` on the right; on "brand-new dish" the cloche lifts: the same atoms, now two CO₂
  molecules (same atoms, new partners). Chip: "chemical reaction = a new substance is made".
- noteq: Arrow confessional; a big "→" card with "turns into" under it; then a "=" card with a red cross
  stamped on it. Arrow annoyed on "not".
- therapy (TH): close-up push-in on Arrow; inset bubble: a cartoon question mark in glasses on a chair with a
  notepad (his therapist), nodding. Hold 1 s on Arrow's deadpan.
- tonight: kitchen wide: three spotlights hit three spots on "celebrity guest chef" (Olly, sparkling),
  "strict auditor" (Madam Mass, LCD "0.00 g") and "slowly turning orange" (Ferris, rust 0.25).
- ferris: close-up on Ferris, sad; his rust visibly creeps 0.25 -> 0.35 during the pause. Lower third
  FERRIS / Iron nail. Contestant.
- title: the show logo `tkTitle` with "Episode 7: Nothing Is Lost"; the whole cast pops in below it in a row
  (Olly, Madam Mass, Arrow, Ferris, Monty, Kat, Kavya), bobbing. Hold it.

## 1 newdish: Is it a new dish?
- round: kitchen wide; a "ROUND 1: SIGNATURE DISH" card; chip "every dish must be a NEW SUBSTANCE".
- olly: Olly bursts in from the left in a spotlight, sparkle on; lower third OLLY / Oxygen. Celebrity guest chef.
- tharrow (TH): Arrow confessional, deadpan; small inset: Olly squeezing into a family photo uninvited.
- choc: Olly lifts a cloche on the island: a bowl of melted chocolate (brown puddle with a spoon).
- same: Arrow deadpan; a split chip: "chocolate (solid)" → "chocolate (liquid)". The pause: Arrow stares.
- phys: stamp **PHYSICAL** (`tkStamp`, blue `#5AB4FF`); chips "no new substance", "easy to reverse"; a fridge icon
  turns the puddle back into a bar.
- sugar, still: a teacup; sugar cubes dissolve into it (particles spread out, still the same white particles);
  stamp **PHYSICAL** again, smaller.
- egg: Olly lifts the cloche: a fried egg on the plate.
- chem: stamp **CHEMICAL** (green `C.good`); chips "new substances", "new properties", "can't un-fry it ✗".
- taste: cut to Kavya at the bench (lab), hot, holding her test tube up, annoyed; a sign on the wall:
  "NO EATING OR DRINKING IN THE LAB".
- signs: kitchen; a chalkboard `tkBoard(…, 'FIVE SIGNS')` drops in beside Olly.
- colour, gas, temp, precip, light: one sign per line, each a big icon + word on the board, Olly pointing:
  colour (a liquid in a beaker turning blue → orange), gas (fizzing bubbles in a flask), temperature (a
  thermometer rising, then one falling), precipitate (two clear solutions poured together; a cloudy yellow solid
  settles at the bottom; label "insoluble solid"), light/sound (a flash and "BANG!"/"POP!"). The first letters
  C, G, T, P, L light up amber as they arrive.
- mnem: under the letters: "Cool Guys Take Pretty Lasses"; on "I didn't write it", Arrow annoyed, look away.
- boil: Kavya at the bench: a beaker of water boiling on a tripod over a Bunsen, big bubbles; she points,
  excited (happy).
- vapour: the bubbles get a label "water vapour = still water"; stamp **PHYSICAL**; Kavya deflates (sad).
- clue: kitchen; the board shows "1 sign = a clue" and a big question card: "Has a NEW SUBSTANCE been made?"

## 2 menu: Writing the menu
- round: "ROUND 2: WRITE THE MENU"; a `tkBoard(…, 'MENU')` lands; chip "menu = equation".
- rp: on the board: left "REACTANTS (ingredients)", right "PRODUCTS (dishes)", ingredient and dish icons.
- me: Arrow slides into the gap between the two columns and holds the pose; chip "→ means turns into".
- special: cut to Kavya's bench: tongs hold a strip of magnesium ribbon in the Bunsen flame; Olly (small) leaps
  onto it.
- whoa: the ribbon flares a dazzling white light (screen flash to white, then back); Kavya shields her eyes,
  shock; the ribbon becomes white powder in a crucible. (Safety: she does not look straight at it.)
- word: the board writes **magnesium + oxygen → magnesium oxide** term by term; "white powder" chip under the
  product.
- equals: Olly gives Arrow a thumbs-up wink; a little "=" floats up near Arrow.
- arrow: Arrow turns slowly to camera, annoyed; the "=" gets a red cross; hold 0.9 s.
- symbol: the board flips to "SYMBOL EQUATION"; chips "formulae", "count the atoms".
- sub: big **O₂** (`tkFormula`); the "2" glows and a bracket shows it counts only the O before it; two red O
  atoms joined beside it.
- gorgeous: Olly poses (smug), sparkle; two red circles outline his two lobes "O" "O".
- big: big **2H₂O** with the amber 2; two water molecules (`molH2O`) appear side by side under it.
- two: Olly, smug, holds up two fingers; a wrong chip "2 H?" wobbles.
- four: Arrow deadpan; the H atoms in both molecules light up one by one with counters "1, 2, 3, 4" and the O
  atoms "1, 2"; a tally "H: 4  O: 2". Olly shock.
- thconf (TH): Arrow confessional, deadpan; behind him, a soft-focus Olly waving at the camera.

## 3 audit: The audit
- round: kitchen; a spotlight swings onto Madam Mass at the island's end; "ROUND 3: THE AUDIT" card.
- hi: Madam Mass close, deadpan, LCD "0.00 g"; lower third MADAM MASS / The balance. Auditor.
- rule: a diagram on her right: a group of atoms in a box labelled "reactants" rearranges into new molecules
  labelled "products", same atoms, same count; chips "none made", "none destroyed".
- law: big card **LAW OF CONSERVATION OF MASS**: "mass of products = mass of reactants" (here "=" is right:
  it is an equation of masses, not a reaction).
- motto: her LCD scrolls "ATOMS CAN'T HIDE" then "ATOMS CAN'T DIE"; she pushes her glasses up.
- heavier: cut to Kavya at the bench with a lab balance: crucible of magnesium "before 24.12 g", then after
  burning "24.20 g"; Kavya shock, then confused.
- no: hard cut to Madam Mass, slow push-in, deadpan, LCD unchanged (pause 0.6).
- joined: Olly drops in from the top ("from the air") and clicks onto a silver Mg atom; label "magnesium + oxygen → magnesium oxide".
- fizz: on Madam Mass's pan (`g.pan`): an open conical flask (`flask`) with acid and marble chips, fizzing
  (`bubbles`); the LCD counts DOWN (e.g. 182.40 → 181.95 g); a red down-arrow.
- escaped: CO₂ molecules (`molCO2`) float out of the flask's mouth and off-screen; Madam Mass annoyed, looks
  after them; a sign-out clipboard with an empty signature line.
- sealed: the same flask now with a balloon/bung on top (sealed): fizzing, the CO₂ stays inside; the LCD holds
  steady "182.40 g"; a green tick; chip "sealed: total mass the same".
- thmass (TH): Madam Mass confessional (`tkConf('mass')`), deadpan; LCD reads "23 YEARS"; hold the silence:
  nothing changes. On "I would quite like to be", LCD flickers "?" once.
- balanced: kitchen board: chip "balanced = same number of each type of atom on both sides"; a see-saw icon.
- hydrogen: Olly presents a dish; the board shows **H₂ + O₂ → H₂O**, with atoms drawn under each formula.
- count: Madam Mass counts: O atoms highlighted "2" left, "1" right; stamp **UNBALANCED** (red).
- cheat: Olly (smug) scribbles a little 2 after the O in the water: **H₂O₂**; the dish turns bleach-white and
  smells (a "BLEACH" label on a bottle silhouette).
- bleach: Arrow annoyed; stamp **NEVER CHANGE A SUBSCRIPT**; the extra 2 is rubbed out; chip "only big numbers
  in front".
- fix: build it in two steps: an amber **2** before H₂O (O: 2 and 2 ✓, but H now 2 and 4 ✗, shown in red), then
  an amber **2** before H₂: **2H₂ + O₂ → 2H₂O**; atoms rearrange under the formulae: 4 H + 2 O on each side.
- approved: tallies "H 4 | 4, O 2 | 2"; stamp **APPROVED** (green); Madam Mass smug, LCD "BALANCED".

## 4 heat: The heat round
- round: kitchen; "ROUND 4: HEAT" card; two arrows "energy OUT" (orange) and "energy IN" (blue).
- exo: big chip **EXOTHERMIC = gives out heat → surroundings hotter**; thermometer rising; icons: a flame,
  a beaker "acid + alkali", a hand warmer pouch.
- warmer: Ferris (rust 0.45) holds the hand warmer, sad; a fast-forward "▶▶" icon over him; his rust flickers
  up and down.
- exit: an "EXIT" sign; heat waves (`heatWaves`) leave a beaker through the door: "EXO = EXIT".
- endo: chip **ENDOTHERMIC = takes in heat → surroundings colder**; thermometer falling; an "ENTER" sign with
  arrows pointing in: "ENDO = ENTER".
- pack: cut to Kavya (bench) holding an instant cold pack against her hand, happy-then-puzzled; small "❄" icons.
- nocold: diagram over her hand: orange heat arrows flow OUT of the hand INTO the pack; label "heat flows from
  your hand into the reaction"; "cold going in ✗".
- main: kitchen; "MAIN EVENT: COMBUSTION"; chip "fuel + oxygen → energy released".
- methane: a gas-cooker burner `tkHob` on the island, mode blue; board: **methane + oxygen → carbon dioxide +
  water**; Olly happy, several Olly-sized O₂ icons pouring in.
- blue: Arrow, approving (neutral); chips "complete combustion", "blue flame", "most energy".
- limited: the O₂ supply is cut (a valve closes, Olly squashed out); the hob flips to yellow with smoke and soot
  (`tkHob` 'yellow'); chips "incomplete combustion", "yellow flame", "less energy", "soot (carbon)". On "a guest
  nobody invited", the lights dim.
- monty: Monty fades in from 0 opacity, smug, from the smoke; lower third MONTY / Carbon monoxide. Not invited.
  Chips "colourless", "no smell".
- toxic: chip **TOXIC: stops your blood carrying oxygen**; a red blood cell icon with a padlock; Arrow
  annoyed, side-eye at Monty.
- alarm: a `tkAlarm` on the wall goes off (flashing, "BEEP!"); Monty annoyed, hands-over-ears look (shock).
- bunsen: Kavya at the bench with `bunsen`: air hole closed (draw a collar with a closed slot), yellow flame.
- open: she twists the collar: the slot opens, the flame turns blue and roars; chips "air hole open → more
  oxygen → complete combustion (blue)", "closed → incomplete (yellow)".

## 5 ferris: Ferris and the reaction families
- round: kitchen; "ROUND 5: REACTION FAMILIES"; five empty family cards line the back wall (filled as they come).
- first: spotlight on Ferris, rust 0.7, sad, alone at the island.
- rust: card 1 **OXIDATION = gaining oxygen** (rusting); O atoms cling to Ferris's surface.
- welcome: Olly pops up behind Ferris, happy, sparkle; Ferris sad.
- both: board: **iron + oxygen + water → hydrated iron oxide (rust)**; icons: O₂ ✓ + water drop ✓ = rust.
- dry: two test tubes: a nail in dry air (with a drying agent) "no rust", a nail in boiled water under a layer
  of oil "no rust"; a third, nail in tap water open to air: rusty.
- paint: Ferris wistful (sad) imagining himself in a paint coat (a ghosted blue Ferris); a bridge silhouette
  with a paintbrush; chip "paint/oil keeps oxygen and water away".
- reduce: card 2 **REDUCTION = losing oxygen**: diagram: iron oxide + carbon, heated; the O atoms jump from
  the iron to the carbon (CO₂ goes off), leaving grey iron.
- decomp: card 3 **THERMAL DECOMPOSITION: heat breaks one compound into simpler ones**; then a boiling tube of
  GREEN copper carbonate heated by a Bunsen turns BLACK (copper oxide); CO₂ bubbles off through a delivery tube;
  Olly cheering beside it.
- lime: the delivery tube bubbles into a tube of clear limewater, which turns milky white; chip "limewater
  turns milky = carbon dioxide".
- neutral: card 4 **NEUTRALISATION: acid + base → salt + water**.
- salt: board: **hydrochloric acid + sodium hydroxide → sodium chloride + water**; A, B, S, W letters glow under
  each term; a salt shaker drops onto the island; Arrow (deadpan) sprinkles it.
- displace: card 5 **DISPLACEMENT: a more reactive metal pushes a less reactive one out of its compound**.
- dip: Ferris lowers himself into a beaker of BLUE copper sulfate solution; a reactivity ladder icon: Fe above Cu.
- winning: Ferris rises out coated in copper (`copper: 1`, glint), happy; the solution has turned PALE GREEN
  (iron sulfate); chip "copper pushed out!". Confetti.
- thhappy (TH): Arrow confessional, deadpan; tiny inset: Ferris dancing.

## 6 speed: The speed round
- round: "ROUND 6: SPEED"; a stopwatch; an explosion icon "0.01 s" vs a rusty gate "years". Ferris in the
  background sighs.
- rate: chip **RATE = how fast reactants turn into products**; then particles in a box (`particleBox` gas)
  collide; flashes where they hit hard enough; "must collide, with enough energy".
- temp: a thermometer rises; the particles speed up (energy 0.4 → 1); a collision counter climbs faster;
  chips "more often", "harder".
- conc: two boxes: few particles vs many crammed in the same space; collision flashes multiply in the crowded
  one; chip "more concentrated = more collisions".
- mrt: the crowded box becomes an MRT carriage at rush hour (simple carriage outline, packed faces).
- surface: a big lump (cube) vs the same cube crushed into powder; the exposed surface glows; chip "more
  surface area = more collisions".
- cat: dramatic music sting: spotlight finds Kat asleep on the island; "CATALYST" title.
- kat: Kat opens one eye (neutral), then back to deadpan; lower third KAT / Catalyst. Never used up.
- route: an energy hill diagram: a tall hill "without catalyst" and a lower path "with catalyst" (dashed);
  particles roll over the lower path faster; Kat walks off unchanged (tail swish).
- more: Olly happy, holding a huge stack of plates.
- same: Arrow deadpan; two equal stacks of dishes, one with a stopwatch "faster"; chips "same products",
  "same amount".
- enzymes: chip **ENZYMES = biological catalysts**; amylase (a little pac-man shape) snips a starch chain
  (beads) into sugars.
- bread: Kavya at the bench chewing a piece of bread, mood smug; a "3:00" timer; tiny sugar sparkles on her
  tongue icon.
- car: a car's exhaust with a catalytic converter box (honeycomb, "Pt"); Monty goes in, comes out as CO₂
  (`molCO2`), grey and plain.
- boring: Monty (now grey, an extra O stuck on him) sad, deadpan.

## 7 traps: The judges save you some marks
- intro: kitchen; "6 EXAM TRAPS" heading on the board.
- t1, t2, t3, t4, t5, t6: quick confessional cuts (`tkConf(kind)`), one per speaker (Arrow, Olly, Madam Mass,
  Ferris, Monty, Arrow), each with its trap on a card: 1 → not = (a crossed-out "="); 2 balance with big numbers,
  never change a subscript (a crossed-out H₂O₂); 3 mass never destroyed, a gas escaped; 4 rusting needs oxygen
  AND water; 5 incomplete combustion → carbon monoxide + soot; 6 temperature rise = exothermic, fall =
  endothermic.
- winner: kitchen, drumroll; spotlights sweep; the cast lined up; a golden trophy shaped like a test tube.
- ferris: the spotlight lands on copper-coated Ferris; Arrow hands him the trophy.
- happy: Ferris happy for the first time on the whole show; confetti; his rust actually grows a little.
- return: the logo `tkTitle` returns: "TEST TUBE KITCHEN will return".
- tired, weigh, again (stinger): Arrow, deadpan, turns to Kat; Kat sits on Madam Mass's pan (`g.pan`), LCD
  "5.00 g"; long silence; Kat opens one eye: "...Again." (her only line, tiny mouth). Final frame: Kat curled
  up on the pan, the LCD still "5.00 g", logo.

## Suggested animator split (by length and difficulty)
- A: cold (done by the writer), newdish, menu
- B: audit, heat
- C: ferris, speed, traps

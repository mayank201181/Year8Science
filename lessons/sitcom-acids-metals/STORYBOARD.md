# NEUTRAL GROUND, Episode 8 "The Wedding Crasher": storyboard

Claude Sitcom, Ep 8: a mockumentary (documentary crew, characters talk to camera) that teaches Acids, Bases & Metals.
Audience: a 12-year-old watching while eating. FUNNY first (dry, a bit cynical, never mean), and every idea exact.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

Premise: Kavya (12) is doing a neutralisation practical in double Science. Inside her beaker is Neutral Ground, a tiny
wedding business run by Indi, a tired universal indicator whose body colour IS the pH (so she is also the mood
lighting). Today Hal (hydrochloric acid) marries Natalie (sodium hydroxide). Then Maggie (magnesium) crashes the wedding
and Henry (hydrogen, the best man) gets pushed out as bubbles. The particles call Kavya "the Giant".

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'indi'), mood, look })`.
  Indi also takes `ph` every frame (her colour); Maggie, Hal and Henry take `fizz` (0..1) when they bubble.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Indi goes `deadpan` at every silly remark; Hal `happy`/`smug` (thinks everything is a compliment);
  Natalie `smug`, `annoyed` at mess; Henry `shock` and `sweat` whenever anything happens; Maggie `happy`, always;
  Goldie `smug` (her default), half-lidded, fanning; Potassium `deadpan`, never blinks at anything, never talks until the stinger.
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Names:** "Indi" is voiced as "Indy" (`say`), so it is never "in-dye".
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow push-in on
  Indi's deadpan face, Henry trembling, Hal grinning at nothing, Potassium staring.
- **Talking heads** (ids starting `th`, plus those marked TH) use the confessional: `ngConf(root, kind)` full stage
  (its `g.set(p, t)` blinks the REC dot), the character big (s about 1.5) at about (430, 400), props or chips on the
  right (x 640 to 1160). A `th<name>` id names who is TALKED ABOUT; the `who` of the line is who is in the chair
  (`thhal` and `thnat` are Indi talking about Hal and Natalie; `thmaggie`, `thgoldie` are their own).
  The first time a character appears (venue or confessional), show `scLowerThird(root, NAME, ROLE)` for about 3 s.
  Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **The pH colour rule (this episode's signature):** universal-indicator colours mean pH everywhere: `ngPH(ph)` gives
  red 0-2, orange 3-4, yellow 5-6, green 7, blue 8-11, purple 12-14. Indi's body (`ph`), the venue liquid
  (`ngVenue g.set(ph, t)`) and any beaker in the lab must agree at every moment: acid only = pH 1 (red),
  at the end of the ceremony = 7 (green), after Kavya's "oops" = 12 (purple). Hal is red, Natalie purple.
- **Science on screen:** whenever a key word or equation is said, it appears big and clear (chip, card or `ngEq`),
  formulas with real sub/superscripts via `ngFormula` ("H^+", "OH^-", "H_2O", "CO_2"). Word equations build term by term
  with `ngEq(...).set(p)` timed across the line. The jokes can be silly; the science must be exact.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px, 30 px from the stage edges.

## Cast (lib.js `cast(parent, kind, o)`)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| indi | Indi, universal indicator: the wedding planner. Tired, sarcastic, precise. "I don't have moods. I have a pH." | teardrop whose colour is her pH, headset, clipboard | INDI / Universal indicator. Wedding planner. |
| hal | Hal, hydrochloric acid: the groom. Loud, competitive, takes every correction as a win. "Number ONE!" | red spiky star, bow tie, white buttonhole | HAL / Hydrochloric acid. The groom. pH 1. |
| natalie | Natalie, sodium hydroxide: the bride. A soapy clean freak. "Please wipe your feet." | purple soap bubble, veil, tiara, orbiting bubbles | NATALIE / Sodium hydroxide. An alkali. The bride. |
| henry | Henry, hydrogen (H₂): the best man. Tiny, nervous, terrified of lit splints. "Not the splint." | two small white atoms, cowlick, blue bow tie | HENRY / Hydrogen. The best man. |
| maggie | Maggie, magnesium: the wedding crasher. Over-enthusiastic gym energy, fizzes, burns bright. "Did somebody say ACID?!" | silver block, pink sweatband, a curl of ribbon, "Mg" | MAGGIE / Magnesium. A metal. Not invited. |
| goldie | Auntie Goldie, gold: lazy aristocrat, reacts to nothing. "Darling." | gold ingot, sunglasses up, pearls, fan, "Au" | AUNTIE GOLDIE / Gold. Bottom of the list. |
| potassium | Potassium: silent, kept in a jar of oil (`ngJar`), top table. Speaks once, in the stinger. | small grey cube, "K" | POTASSIUM / Top table. Kept under oil. |
| kavya | Kavya, 12, "the Giant": exasperated, in face goggles | `cast(p, 'kavya', { goggles: 'on' | 'up' })` | KAVYA, 12 / Wearing the goggles. |

Non-speaking extras the scenes draw themselves: copper oxide (a black powder heap with a sulky face, ch 1), Litmus
(a paper strip half red half blue, ch 2), a marble chip (white lumpy rock, ch 6), the copper atoms in ch 6 (brown balls, no face).

Sets: `ngLab` (Kavya's lab, with `ngBench` in a foreground layer), `ngVenue` (inside the beaker; recolour by pH),
`ngConf` (confessionals), `ngGiant` (the Giant's goggled eye at the glass). Props: `ngDropper`, `ngSplint`, `ngPop`,
`ngPhScale`, `ngSeating`, `ngJar`, `ngLogo`, `ngRibbon`, `ngNail`, `ngIon`, `ngEq`, `ngFormula`; kit `beaker`,
`testTube`, `flask`, `bunsen`.

## 0 cold: Cold open (card: none) [animated: scenes/00_cold.js]
- kavya: `ngLab`, Kavya (goggles on, s 1.55) behind the bench at (360, 470); on the bench a beaker of RED liquid
  (acid + universal indicator) at (800, 470) and an ALKALI bottle with a dropper; chips "Kavya, age 12",
  "Double Science". Mood annoyed.
- goggles: push in on Kavya; lower third KAVYA, 12 / Wearing the goggles. Green stink lines rise from the goggles on
  "other people's faces"; Kavya deadpan.
- task: wide; the task card: "TODAY'S TASK: Neutralise an acid. Add alkali, drop by drop, until the indicator turns
  [GREEN]" (green chip pulses). Kavya glances down at the beaker.
- small: documentary zoom into the beaker (ZOOM ×1 → ×200 viewfinder, a dashed reticle on the beaker, "inside the beaker").
- venue: cut to `ngVenue` (pH 1, red): a wooden plaque "NEUTRAL GROUND" over the flower arch, chip "weddings for acids
  & alkalis"; Indi glides in from the right with her clipboard, red.
- hi (TH): Indi's confessional (`ngConf 'indi'`), red; lower third INDI; chip "universal indicator / changes colour with pH".
- colour: `ngPhScale` (600 wide) on the right, pointer at 1; chip "red = very ACIDIC".
- moods: "MOODY?" pops up; Indi's colour flickers through the whole rainbow as she says "people say I'm moody", the word
  gets struck out, she snaps back to red, chip "pH 1"; slow deadpan push-in through the pause.
- busy: thirty mini beakers pop in (6 × 5, all red), "× 30 a lesson", then chips ACID (red) and ALKALI (purple), then a
  TISSUES box on "somebody always cries". Indi sad on the last beat.
- giant: back in the venue; a huge goggled brown eye (`ngGiant`) slides up against the glass on the right and looks down
  at Indi; chip "the Giant". Indi looks up, annoyed, then deadpan; the eye blinks in the pause.
- title: green (neutral) title card with slow rays: `ngLogo` "NEUTRAL GROUND" (red and purple rings, green heart), then
  "Episode 8: The Wedding Crasher"; the cast pops in along the bottom in a row: Indi, Hal, Natalie, Henry, Maggie,
  Goldie, Potassium (in his jar), Kavya (goggles up). Hold.

## 1 couple: Meet the happy couple
Set: `ngVenue` at pH 1 (red) all chapter; Indi stays red. Showpiece: the Venn diagram of bases and alkalis.
- hal: Hal bursts up through the aisle (pop-in, sparkles), happy; lower third HAL / Hydrochloric acid. The groom. pH 1.
  A red "pH 1" rosette pinned on him.
- thhal (TH): Indi's confessional, red, deadpan; inset: Hal with a spotlight beam he is holding over himself.
- ions: Hal in the water; small white `ngIon('H+')` balls pop off him and drift away, a green `ngIon('Cl-')` stays near
  him; card "ACID: releases hydrogen ions, H⁺, in water" + a lemon icon "tastes SOUR".
- sour: Hal smug, flexing; three icons pop in on his words: a lemon, a vinegar bottle, a stomach.
- cousins: the icons get labels: lemon "citric acid", vinegar "ethanoic acid", stomach "hydrochloric acid" (Hal's face
  appears on the stomach). Indi deadpan.
- bride: the `ngDropper` comes down through the surface at the top; a purple drop forms and falls.
- natalie: the drop lands and it is Natalie (veil, tiara), smug; she produces a tiny doormat; lower third NATALIE.
- soapy: purple `ngIon('OH-')` balls float off her; chips "hydroxide ions, OH⁻", "feels SOAPY", a spray bottle.
- thnat (TH): Indi's confessional, red, deadpan; inset: Natalie wiping the glass with a cloth, four tally marks.
- base: card "BASE: can NEUTRALISE an acid. Many are metal oxides or hydroxides." with examples "copper oxide",
  "magnesium hydroxide".
- alkali: Venn diagram on the right: big circle BASES, inner circle ALKALIS = "soluble bases (dissolve in water)";
  Natalie (small) hops into the inner circle.
- cousin: a black powder heap with a sulky face (copper oxide) appears in the BASES ring, outside ALKALIS, on the
  floor of the beaker with a tiny rain cloud; label "copper oxide: a base, insoluble".
- venn: two lines under the Venn: "all alkalis are bases ✓", "not all bases are alkalis ✓".
- scale: `ngPhScale` slides in big across the middle (w 980).
- seven: the three zones light up in turn on the words: 0-6 "ACIDIC" + arrow "lower = MORE acidic", 7 "NEUTRAL
  (pure water)" with a water drop, 8-14 "ALKALINE".
- fourteen: Hal grabs the pointer and drags it to 14, happy; pause 1.1 s: Hal grinning, Indi slow push-in, deadpan.
- no: Indi: "No." (close-up).
- higher: arrows under the scale: "← more ACIDIC" and "more ALKALINE →"; a red Hal tag at 1, a purple Natalie tag at 14.
- one: Hal, happy; a giant foam "No. 1" finger pops up next to him; Indi deadpan in the pause.

## 2 colours: Colour coordination
Set: venue (pH 1) and Indi's confessional. Showpiece: Indi walking along the pH scale, changing colour band by band.
- scheme: venue; Indi opens a fan of paint-chip swatches (rainbow); she is the colour scheme.
- what: three test tubes: red "acidic", green "neutral", purple "alkaline".
- litmus: `scVideoCall` with Litmus (a paper strip with a face, top half red, bottom half blue); a blue strip dipped in
  acid turns red, a red strip dipped in alkali turns blue; chip "no pH number ✗". Indi: "Bless her."
- rainbow (TH): Indi's confessional; three dye drops (red, yellow, blue) swirl together: "universal indicator = a
  mixture of dyes".
- acidside: Indi in front of `ngPhScale`; she slides along it and her body colour follows: red (0-2), orange (3-4),
  yellow (5-6), each band labelled with its range as she names it; "ACIDIC" bracket.
- green: Indi green at 7, happy, a little calm glow and a spa-music note; "NEUTRAL".
- alkside: blue (8-11), purple (12-14), "ALKALINE" bracket.
- red: venue: Hal pulls Indi next to him: she goes red.
- purple: Natalie pulls her the other way: purple.
- stop: Indi flickers red/purple, then deadpan "Please stop."; pause: she drifts back to green, eye twitch.
- strong: Hal flexing, chips "STRONG" and "CONCENTRATED" glued together over his head; pause: Indi stares.
- twothings: the two chips split apart with a "≠" between them.
- strength: two beakers side by side. STRONG: every acid molecule split into H⁺ and its partner ion. WEAK: only a few
  split, most still whole. Labels "ionises FULLY" / "ionises PARTLY".
- conc: two beakers: CONCENTRATED (crowded with acid particles, few water molecules) / DILUTE (a few acid particles,
  lots of water).
- today: a 2 × 2 grid (strong/weak × concentrated/dilute); Hal's face drops into "STRONG + DILUTE"; chip "school lab".
- corrosive: two hazard diamonds: CORROSIVE (drops eating into a hand and a surface) "destroys skin and eyes";
  IRRITANT (exclamation mark) "redness, itching".
- safer: the grid again: "dilute strong" gets a green "can be safer ✓", "concentrated weak" a warning "!" badge.
- goggles: lab: Kavya (goggles on), deadpan; a "NEVER TASTE" sign with a crossed-out tongue.

## 3 ceremony: The ceremony
Set: venue, colour changing with pH; inserts of the lab beaker. Showpiece: the colour walk red → green → purple as
the Giant adds drops.
- dropper: lab close-up: Kavya's hand squeezes the dropper over the red beaker.
- dearly ("gathered here today"): venue at pH 1: Indi at the arch with her clipboard (officiant), Hal (left) and Natalie (right) facing her,
  chairs, confetti waiting.
- what: chip "NEUTRALISATION: acid + base react and cancel out"; a small pH scale with the pointer sliding from 1
  towards 7.
- eq: `ngEq(['acid','+','base','→','salt','+','water'])` builds; then the first letters glow: A, B, S, W.
- vow1: Hal holds out a ring box: inside, an H⁺ (`ngIon`).
- vow2: Natalie holds out hers: an OH⁻ with soap suds; she wipes it first.
- ions: the two ions float together and snap into one water molecule (`molH2O`); `ngFormula` "H^+ + OH^- → H_2O".
- example: the full word equation in two rows: "hydrochloric acid + sodium hydroxide → / sodium chloride + water";
  a lilac Na⁺ and a green Cl⁻ pair up beside it.
- table: a salt shaker labelled "sodium chloride" pops up; Natalie confused.
- congrats: Indi deadpan; confetti falls; a tiny veil lands on the salt shaker. Hold the pause.
- little: split screen: the lab beaker (left) takes drops; the liquid steps red → orange → yellow, and Indi and the
  venue follow; chip "too little alkali: still ACIDIC"; Indi waves "keep going".
- green: everything goes GREEN (pH 7): venue, beaker, Indi (happy); chip "pH 7: NEUTRAL"; everyone freezes; pause.
- oops: lab: the dropper squeezes too hard, a big purple blob; Kavya shock then sheepish.
- much: the green tips to blue then purple (pH 12); Indi purple and annoyed; chip "too much alkali: ALKALINE";
  "mixing ≠ automatically pH 7".
- notjust: a watering can crossed out ("just diluting ✗"); "a chemical reaction → NEW substances: a salt + water ✓".
- uses: two panels: an indigestion-tablet box ("contains a base") with a stomach going from red to green; a farmer
  spreading a sack marked LIME on a field, the soil colour going from orange to green.
- dad: Kavya in the lab (goggles up), deadpan; inset of a plate of chilli crab and an indigestion tablet.

## 4 crasher: The wedding crasher
Set: venue at pH 1 for this chapter (a fresh tube of acid). Showpiece: Maggie takes Henry's place and Henry floats off
as hydrogen bubbles.
- ribbon: lab: the teacher's hand passes a strip of `ngRibbon` to Kavya; she drops it into a test tube of red acid.
- maggie: venue: Maggie cannonballs in through the meniscus, sparkles, fizz 1, happy; the wedding guests shock;
  lower third MAGGIE / Magnesium. A metal. Not invited.
- fizz: Maggie fizzing (fizz 1); bubbles stream up; chip "bubbles = HYDROGEN gas".
- henry: Henry (tiny, s 1.2) stands next to Hal; a card "H Cl" with the H highlighted on "the H in H C L";
  lower third HENRY / Hydrogen. The best man.
- pushed: Maggie barges between them, takes Hal's spot; Henry is shoved up into a bubble and floats away, sad.
  A small diagram: Mg + 2 HCl: the Cl's go to Mg, the H's pair up as H₂ and rise.
- eq: `ngEq(['acid','+','metal','→','salt','+','hydrogen'])`, "hydrogen" in white with a bubble.
- example: two rows: "hydrochloric acid + magnesium → / magnesium chloride + hydrogen".
- thmaggie (TH): Maggie's confessional (`ngConf 'maggie'`), happy, fizzing a little; on "Is there cake?" a slice of
  wedding cake floats into frame; she looks at it.
- test: lab close-up: a test tube with bubbles; `ngSplint` lit, moving towards the mouth.
- splint: Henry close-up inside the tube, shock, sweat 1, the flame getting bigger in the foreground.
- pop ("POP! ...Ouch."): `ngPop('POP!')` on "Pop", white flash, frame shake 0.2 s; then Henry, singed grey at the edges,
  a tiny smoke curl from his cowlick, sad, on "Ouch"; hold the pause.
- squeaky: Indi (venue, red), deadpan; chip "lit splint → squeaky POP = HYDROGEN".
- naming: a wedding name card "MAGNESIUM CHLORIDE": "MAGNESIUM" in silver with the label "from the metal",
  "CHLORIDE" in red with "from the acid".
- acids: three rows, built one by one: hydrochloric acid → chlorides, sulfuric acid → sulfates, nitric acid → nitrates.
- zinc: two rows: "zinc + sulfuric acid → / zinc sulfate + hydrogen"; then "sulfATE ✓" and "sulfIDE ✗" (struck out).

## 5 seating: The seating plan
Set: venue (pH 7 green, the reception), the seating board on an easel. Showpiece: the four-metal fizz race.
- plan: `ngSeating` board on an easel in the venue; title "SEATING PLAN"; chip "= the REACTIVITY SERIES".
- tables: an arrow down the left side: "MOST reactive" at the top (a crown), "LEAST reactive" at the bottom (a door icon).
- order: rows highlight one by one, top to bottom, timed to the names; the red HYDROGEN line appears between iron and copper.
- zebra: the bold first letters glow in turn; a banner builds "Please Stop Calling Me A Zebra, Instead Call Some Gold";
  a small cartoon zebra pops up in the pause.
- line: Henry stands on the hydrogen line like a doorman with a velvet rope; above it "react with dilute acid ✓",
  below it "no reaction ✗".
- job: Henry happy, puffs up, a tiny "STAFF" badge.
- race: four test tubes of the same dilute acid in a rack, labelled Mg, Zn, Fe, Cu.
- mg: the Mg tube fizzes VIGOROUSLY; Maggie cameo in the corner, happy.
- zn: Zn steady bubbles, then Fe slow bubbles, then the camera moves to Cu: nothing. Hold the 0.9 s pause on the still Cu tube.
- cu: a "NO REACTION" stamp thumps on the Cu tube; "below hydrogen".
- goldie: Goldie at the back table by the door, fanning, smug; lower third AUNTIE GOLDIE / Gold. Bottom of the list.;
  three chips with crosses: "dilute acid ✗", "water ✗", "gossip ✗".
- thgoldie (TH): Goldie's confessional (`ngConf 'goldie'`); inset: a gold nugget in a rock, "found as a PURE METAL".
- topk: the top table: Potassium in `ngJar` (oil), deadpan, a RESERVED card; lower third POTASSIUM / Top table. Kept under oil.
- jar: lab: Kavya, goggles on, confused, looking at the jar.
- water: chip "potassium & sodium: react FAST with COLD water"; a cartoon water trough where a small grey piece
  whizzes and fizzes on the surface. Potassium's eyes go wide at the word "water" (only time he moves).
- eqwater: `ngEq` "metal + water → metal hydroxide + hydrogen", then below "sodium + water → sodium hydroxide + hydrogen".
- me: Natalie happy, pointing at herself; the trough water turns purple (universal indicator): chip "ALKALINE solution".

## 6 party: Drama at the after-party
Set: venue with disco lights (pH 7), lab inserts. Showpieces: the nail turning copper-brown; the three gas tests.
- nail: lab: a beaker of BLUE copper sulfate solution; `ngNail` drops in.
- push: venue: a brown copper atom dancing with a sulfate partner (a blue SO₄ group); an iron atom (grey) cuts in and
  pushes copper aside; chip "DISPLACEMENT: a more reactive metal pushes a less reactive one out".
- eq: `ngEq(['iron','+','copper sulfate','→','iron sulfate','+','copper'])` (two rows if needed).
- see: lab close-up: the blue fades to pale green over the line; the nail's copper coat grows (`ngNail.set`), chip
  "brown coating of COPPER".
- never: a copper strip in iron sulfate solution: nothing happens; ✗ "copper can't displace iron".
- extract: a furnace icon: "iron ore + carbon → iron" with "carbon is more reactive than iron"; molten iron glows.
- guest: venue: a white lumpy marble chip drops in through the surface; label "calcium carbonate"; it fizzes on landing.
- carb: `ngEq(['acid','+','metal carbonate','→','salt','+','water','+','carbon dioxide'])` with a "3 products" badge.
- example: three rows: "hydrochloric acid + calcium carbonate → / calcium chloride + water / + carbon dioxide".
- notme: Henry, shock, sweat, bubbles all around him.
- lime: lab: a lit splint goes into the gas and goes OUT (`ngSplint` 'out'); then the gas bubbles through a tube of
  limewater, which turns milky white; chip "MILKY = CARBON DIOXIDE".
- phew: Henry happy, mops his brow; pause.
- burn: venue spotlight: Maggie bursts into a blinding white flare (white glow, sparks) and leaves a little heap of white
  powder; `ngEq(['magnesium','+','oxygen','→','magnesium oxide'])`.
- look: Indi turns away, shielding her eyes; chip "never look straight at burning magnesium".
- oxygen: lab: `ngSplint` 'glow' goes into a tube labelled "oxygen" and bursts back into flame ('lit');
  chip "glowing splint RELIGHTS = OXYGEN".
- favours: four little panels in a row, numbered: 1 black copper oxide powder stirred into warm acid, "EXCESS";
  2 a filter funnel: "residue" on the paper, blue "filtrate" below; 3 an evaporating basin over a Bunsen: "evaporate";
  4 blue crystals in tiny gift bags with ribbons: "cool slowly → CRYSTALS".

## 7 traps: The wedding party saves you some marks
- intro: a three-tier wedding cake with "8 EXAM TRAPS" on the top tier.
- t1-t8: quick confessional cuts, one per speaker, each with its trap on a card:
  1 Maggie: acid + metal → HYDROGEN; only carbonates → CO₂.
  2 Henry: squeaky pop = hydrogen; milky limewater = carbon dioxide.
  3 Hal: concentration ≠ strength (dilute strong can be safer than concentrated weak).
  4 Natalie: not all bases are alkalis (only soluble ones); a tiny copper oxide waves sadly.
  5 Indi: litmus RED in acid, BLUE in alkali; higher pH = more ALKALINE (Indi goes red, then blue).
  6 Hal: neutralisation ALWAYS makes water (+ the salt).
  7 Goldie: copper, silver, gold don't fizz with dilute acids: below hydrogen.
  8 Indi: sulfuric acid → sulfATES, not sulfIDES.
- return: the logo returns: "NEUTRAL GROUND will return".
- who (stinger): lab: Kavya, goggles up, pointing at the jar on the shelf.
- k: venue (green): Indi beside the jar, deadpan.
- kwater: close-up of Potassium in the jar: for the first time his eyes open fully; a tiny mouth: "...Is that... water?"
- offer: Henry, happy and helpful, holds out a glass of water towards the jar.
- no ("NO, HENRY, DON'T!"): Indi shock, lunging; HARD CUT to black, a lilac flash (potassium burns with a lilac flame) and a cartoon "FWOOMP"
  card; then the final frame: the logo with a lilac smoke ring, Potassium smug in his jar, everyone else singed and
  blinking (no one hurt).

## Animator split (about 3 chapters each)
- A: couple (1), colours (2) (the pH scale and Venn; Indi's colour walk).
- B: ceremony (3), crasher (4) (neutralisation colour walk, the pop test).
- C: seating (5), party (6), traps (7) (seating board, fizz race, the three gas tests, the stinger).

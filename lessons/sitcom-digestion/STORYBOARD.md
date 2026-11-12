# MIND THE GUT, Episode 4 "The Chicken Rice Express": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Food & Digestion.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

**Premise.** The gut is the **Alimentary Line**, an MRT-style line with seven stations (Mouth AL1,
Oesophagus AL2, Stomach AL3, Small Intestine AL4, Large Intestine AL5, Rectum AL6, Anus AL7). There are no
trains: the tunnel is a muscle, and the muscle is **Percy (peristalsis)**, the tired line operator who
squeezes every meal along and makes deadpan station announcements. Kavya's hawker-centre chicken rice
rides the line, past the enzymes who work its stations (Amy, Priya, Lionel), Bill the bile (who is not an
enzyme and never rides the line: he "commutes" in from the gall bladder), Phoebe the fibre (nobody digests
her; she goes all the way) and Vinny the villus (silent; steals the stinger).

Running gags: Percy's announcements ("Doors closing", service disruptions, "This service terminates
here"); every enzyme yelling "Mine!" at its own food; "I'm not an enzyme" (Bill); Phoebe's "Still here";
Vinny never talking (until the stinger). Callbacks: the fish in the mnemonic, the curry puffs, "the other end".

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'percy'), mood, look })`.
  Non-speakers get `talk: 0`. Kavya: `scTalk(S, t, 'kavya')`.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Percy goes `deadpan` at every silly remark; Amy `happy`; Priya `smug`; Bill `annoyed` whenever anyone says
  "enzyme" about him; Lionel `annoyed` at blobs, `happy` when it's tidy; Phoebe `sad`, and `shock`→`happy`
  on "I'm... useful?"; Vinny `neutral`, waving (`wave: 1`), never talking. Moods: neutral, happy, smug,
  annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in on Percy's deadpan face, Vinny waving, Phoebe staring, Bill's flat stare.
- **Talking heads** (line ids starting `th`, plus the ones marked TH below) use the confessional shot:
  `mgConf(root, kind)` full stage, the character big (s about 1.5) at about (430, 400), with a prop or a
  keyword card on the right (x about 880). The first time a character appears in a confessional or is
  introduced, show `scLowerThird(root, ...MG_NAME[kind])` for about 3 s. Cut instantly (fade over 0.25 s at
  most): sitcom cuts are snappy.
- **Announcements:** when Percy "announces" (marked ANN below), give him `mgMic` at his mouth and a slight
  amber LED-style chip or `mgBoard` on screen. He reads them flat, like a train announcement.
- **Science on screen:** whenever a key word, mnemonic or product is said, it appears big and clear (chip,
  card, whiteboard or `mgBoard`). The jokes can be silly; the science must be exact (see "Science checks").
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Nothing important
  below y = 690 (caption area).

## Cast (`cast(parent, kind, { s, mood })` in lib.js; Kavya is the shared `scKavya`)

| kind | who | look | lower third (`MG_NAME`) |
| --- | --- | --- | --- |
| percy | Percy, peristalsis: tired, sarcastic line operator; flat announcements | pink muscular tube segment with ring bands, MRT staff cap, arms akimbo, eye bags; `squeeze` pinches his waist | PERCY / Peristalsis. Runs the line. |
| amy | Amy, amylase (enzyme): wildly over-enthusiastic; "Snip!"; "Mine!" | sky-blue round blob, hexagon notch (active site) top right, curl, cheeks, AMY tag; `sparkle` | AMY / Amylase. Enzyme. Mouth. |
| priya | Priya, protease (enzyme): dry, unbothered, loves her "acid spa" | purple rounded square, square notch (active site) on the left, towel turban + goggles, towel on shoulders | PRIYA / Protease. Enzyme. Stomach. |
| lionel | Lionel, lipase (enzyme): fussy perfectionist; "Write both." | tall teal oval, three-slot comb notch on top (active site), round glasses, bow tie | LIONEL / Lipase. Enzyme. Small intestine. |
| bill | Bill, bile: weary; NOT an enzyme; "I commute." | yellow-green squeezy bottle, red nozzle, label "BILE / not an enzyme"; `bubbles` | BILL / Bile. Not an enzyme. |
| phoebe | Phoebe, fibre: mopey, undigested, secretly essential | tall pale-green celery stalk, stringy fibres, droopy leaves, thin arms | PHOEBE / Fibre. Not digested. |
| vinny | Vinny, a villus: silent, waves; one line in the stinger | small pink finger, microvilli fuzz on top, faint capillaries and lacteal inside; `wave` | VINNY / A villus. Does not talk. |
| kavya | Kavya, 12, the human: exasperated, sharp | `scKavya` bust (PE shirt "8"); `scKavyaBody` for full body | KAVYA, 12 / Test tomorrow. Eating. |

**Active sites (lock and key), keep them consistent:** Amy's hexagon notch fits one amber glucose hexagon at
the end of `mgChain('starch')`; Priya's square notch fits one square bead of `mgChain('protein')`; Lionel's
comb fits the three tails of `mgFat`. Bill has no notch: he is not an enzyme.

Sets (lib.js): `mgHawker` (+ `mgTable`, `mgTray`), `mgPlatform(name, code)` (station platforms; the sign
changes per chapter), `mgTunnel` (inside the oesophagus, looking down), `mgPeriTube` (side view of
peristalsis), `mgSpa` (stomach), `mgGut` (small intestine), `mgLab` (+ `mgRack`), `mgEnd` (large intestine,
end of the line), `mgConf(kind)` (confessionals). Props: `mgLineMap`, `mgBoard`, `mgMic`, `mgChain`, `mgFat`,
`mgBlob`, `mgBolus`, `mgVillusCut`, `mgTeeth`, `mgSign`. Kit: `testTube`, `labelLine`, `arrow`, `chip`, `tick`, `cross`.

## Science checks (do not get these wrong on screen)

- Seven nutrient groups: carbohydrates, proteins, fats, vitamins, minerals, fibre, water.
- Products: starch → sugars (amylase), and by the end of the small intestine → **glucose**; protein → **amino
  acids** (protease); fat → **fatty acids AND glycerol** (lipase): always both, three fatty acids + one glycerol.
- Amylase: salivary glands and pancreas. Protease: stomach and pancreas. Lipase: pancreas.
- Bile: made in the **liver**, stored in the **gall bladder**, enters the small intestine through a duct.
  Bile **emulsifies** (physical: big blob → many tiny droplets, same fat, more surface area) and is
  **alkaline** (neutralises stomach acid). It does NOT digest fat and is NOT an enzyme.
- Liver, gall bladder and pancreas are **not** part of the alimentary canal: on the map they are grey, off
  the line, joined only by dashed ducts to the small intestine.
- Stomach acid kills microbes and gives protease acidic conditions; protease does the digesting.
- Peristalsis: the muscle ring contracts BEHIND the food; the wall ahead stays relaxed.
- Villus: large surface area, wall one cell thick, capillaries (carry glucose and amino acids away), lacteal
  (fat products). 30 m² for the whole small-intestine lining (not one villus).
- Large intestine absorbs most of the remaining water. Faeces stored in the rectum, leave via the anus.
- Egestion (undigested food, never absorbed) ≠ excretion (waste from the body's own reactions in cells:
  CO₂ via the lungs; urea made by the liver, removed by the kidneys in urine).
- Food tests: iodine orange-brown → blue-black (starch); Benedict's blue → (heat in a water bath) green,
  yellow, orange → brick-red (reducing sugar); biuret blue → purple/lilac (protein); ethanol emulsion test →
  cloudy white emulsion (fat). Control = water, no food.

## 0 cold: Cold open (card: none) — DONE (`scenes/00_cold.js`), use it as the reference

- kavya: `mgHawker`; Kavya bust (s 1.5) behind `mgTable` in the foreground; chips "Kavya, age 12", "1:00 PM",
  "34 °C"; the `mgTray` pops onto the table on "chicken rice", with a "chicken rice" chip.
- test: tighter; lower third KAVYA; sticky note "SCIENCE TEST / TOMORROW: / DIGESTION"; a green "REVISION?"
  stamp on "That counts as revision"; Kavya smug.
- small: documentary push into Kavya's mouth (she chews, happy); an iris closes to dark, opening on
  `mgTunnel` (rings squeezing away): "the long, dark tube".
- line: dark grid map; pink header "THE ALIMENTARY LINE"; `mgLineMap` stations pop one by one (helpers hidden);
  chips "7 stations", "1 direction →" (a bolus rides the line left to right), red "NO REFUNDS" stamp.
- this: `mgPlatform('MOUTH','AL1')`, LED "NEXT ARRIVAL: YOUR LUNCH"; Percy rises into frame, then stares at camera.
- thpercy (TH): Percy confessional; lower third PERCY; chip "peristalsis" + "waves of muscle that push food along the gut".
- trains: platform; LED changes to "NEXT TRAIN: THERE ARE NO TRAINS"; a train icon gets a red cross ("no
  trains"); chips "the tunnel = a muscle", then "the muscle = Percy" while Percy squeezes himself, smug.
- squeeze: `mgPeriTube` side view: the contraction ring travels left to right, always behind the bolus;
  "muscle squeezes behind" arrow follows it; "food pushed along"; inset toothpaste tube squeezed ("like
  toothpaste"); "to the other end" arrow.
- otherend: confessional close-up, slow push; the station sign "AL7 ANUS" gets a black CENSORED bar. Hold 0.9 s.
- years: platform; a "SERVICE RECORD" board ticks "12 YEARS ✓ / EVERY MEAL ✓ / EVERY CURRY PUFF ✓"; a curry
  puff rides past; Percy sad on the last beat.
- puff: confessional; Percy shock, then sad; framed photo of four curry puffs, "four. one recess."
- title: logo "MIND THE GUT" (white MRT-style pill, pink roundel "AL", line stripe), "Episode 4: The Chicken
  Rice Express"; the cast pops in a row: Kavya, Percy, Amy, Priya, Lionel, Bill, Phoebe, Vinny (waving).

## 1 tray: The passenger check

Layout: the hawker table seen close (Kavya bust left, `mgTray` big on `mgTable`, s about 1.5, centre-right),
intercut with Percy on the MOUTH platform with `mgMic` and the `mgBoard`. Showpiece: the seven nutrient
groups "tapping in" through fare gates, and the service-disruption board.

- balanced (ANN): MOUTH platform; Percy with mic. A row of 7 MRT fare gates appears across the platform;
  chip "balanced diet = all 7 groups, in the right amounts".
- crazy: seven passenger chips walk through the gates one by one, each with its first letter in amber:
  **C**arbohydrates, **P**roteins, **F**ats, **V**itamins, **M**inerals, **F**ibre, **W**ater; above them the
  mnemonic builds word by word: "Crazy People Find Very Many Fish Wet".
- fish: cut to Kavya (bust, hawker), deadpan, pointing at the tray: no fish. Hold 0.5 s.
- keepup: Percy deadpan; a tiny cartoon fish on the mnemonic card gets a "memory trick" label. Kavya annoyed.
- rice: tray close-up: rice glows with chip "carbohydrates: main energy source"; then chicken glows,
  "protein: growth and repair".
- fat: the rice's fat shine (`g.parts.fat`) sparkles; three icon chips: battery "store of energy",
  scarf "keeps you warm", shield "protects organs".
- fatbad: Kavya, suspicious, mood annoyed.
- notbad: Percy deadpan; a balance scale: "energy in" vs "energy used"; tipping it far too much "in" lights
  "the problem". Chip "fat is NOT bad".
- cucumber: the three cucumber slices glow: chips "vitamins" + "minerals" ("tiny amounts"); on "And her", a
  slice wobbles and Phoebe pops up from behind the plate.
- phoebe: Phoebe intro, sad; lower third PHOEBE. Hold 0.7 s: Percy and Kavya stare.
- thpercy (TH): Percy confessional; the soup bowl as a prop: chip "water: the solvent for your reactions";
  then two cards side by side "water" and "fibre": "no energy ✗", "essential ✓".
- missing: platform; the `mgBoard` flips on: "SERVICE DISRUPTION" header; subtitle chip "deficiency disease =
  a nutrient missing for a long time".
- scurvy (ANN): board: "NO VITAMIN C" / "SCURVY: bleeding gums, slow healing".
- rickets (ANN): board: "NO VITAMIN D OR CALCIUM" / "RICKETS: soft, bent bones" (a bent bone icon).
- anaemia (ANN): board: "NO IRON" / "ANAEMIA: too few red blood cells, tired, pale".
- constip: Phoebe beside the board: "NO FIBRE" / "CONSTIPATION"; Phoebe sad, looking at camera.
- germ: Percy deadpan; a germ icon with a big red cross: "caused by a LACK, not a germ: you can't catch it".
  Hold 0.5 s.
- energy: hawker; Kavya; five icon chips pop around her: age (birthday cake), how active (running shoe),
  size (ruler), sex (♀/♂ icon), pregnancy (pram). Title chip "energy needs vary".
- upsize: Kavya waves at the stall: "UPSIZE?" speech bubble; mood happy.
- variety: Percy deadpan; a single, huge cucumber slice slides onto the tray (the upsize). Chip "no single
  food has everything: VARIETY".

## 2 mouth: Station one: the mouth

Layout: `mgPlatform('MOUTH','AL1')` and a "mouth cam" (a mouth-shaped frame: lips, tongue, teeth) for the
food. Showpiece: Amy snipping a starch chain.

- first: the line map (`mgLineMap`) with station 0 ringed; cut to the platform; chip "digestion BEGINS here".
- teeth: mouth cam: the bolus-to-be (rice and chicken pieces) is chopped into smaller pieces by closing teeth;
  chip "mechanical digestion: smaller pieces, NO chemical change".
- four: `mgTeeth`, each tooth labelled as it is said: incisors "cut", canines "grip and tear", premolars and
  molars "crush and grind" (premolar and molar light together).
- area: one big cube splits into 8 small cubes; the outside faces light up yellow: "bigger surface area →
  faster chemical digestion".
- amy: Amy bursts in, sparkle, happy; lower third AMY. A saliva droplet icon behind her.
- thamy (TH): Percy confessional, deadpan; inset of Amy bouncing in the background window.
- starch: `mgChain('starch', 7)` on a whiteboard-style card: "STARCH" over it; Amy fits her notch onto the end
  hexagon; arrow → "sugars".
- snip: on each "Snip!" a bond breaks (`set(p)` in three steps, 0.33, 0.66, 1) with a scissor flash. Hold 0.4 s.
- chem: Percy; card "chemical digestion: enzymes break bonds inside molecules"; tick "starts in the mouth too".
- cracker: Kavya bust (hawker), curious, holding a cracker.
- yes: Amy ecstatic (happy, bouncing); the cracker gets a "sweet!" sparkle.
- why: diagram: the gut wall as a row of cells with blood capillary below; big starch, protein and fat
  molecules bounce off the wall ("too big") with a red cross; chip "large, insoluble".
- soluble: the molecules shatter into small glucose, amino acids, fatty acids and glycerol, which slip through
  the wall into the blood: "small, soluble → absorbed" with a green tick.
- bolus: mouth cam: the tongue rolls the pieces into `mgBolus`; chip "bolus".
- cute: Amy hugs the bolus; Percy deadpan. Hold 0.6 s.
- doors (ANN): platform; screen doors close with a chime icon; LED "NEXT STATION: OESOPHAGUS"; the bolus
  slides off right. Hold 0.8 s.

## 3 stomach: The squeeze and the acid spa

Layout: oesophagus (`mgTunnel`, `mgPeriTube`), then `mgSpa`. Showpiece: the stomach's mucus shield, and
"Didn't fit" (lock and key).

- tube: `mgPlatform('OESOPHAGUS','AL2')` for a beat, then `mgTunnel`; chip "oesophagus: tube to the stomach".
- waves: `mgPeriTube` side view with the contraction ring behind the bolus; Percy small in the corner,
  squeezing in time (`squeeze`); chip "peristalsis".
- gravity: Kavya bust, puzzled.
- upside: a cartoon Kavya (`scKavyaBody`) hanging upside down from a bar eating rice, and the bolus still
  going UP her oesophagus inset ("works against gravity"); then a red "DON'T" stamp. Hold 0.6 s.
- stomach: `mgPlatform('STOMACH','AL3')`, then `mgSpa`: the walls churn (wobble) and acid bubbles; chips
  "muscular bag", "churns", "acid".
- priya: Priya lounging at the pool edge, smug; lower third PRIYA.
- job: `mgChain('protein', 6)`: Priya's square notch fits a bead; bonds break into separate amino acids
  (coloured squares); chip "protein → amino acids". "Mine." Priya smug.
- thpriya (TH): Percy confessional, deadpan; behind him the "ACID SPA" neon flickers.
- acid: Kavya bust, curious.
- kills: spa: green microbes drop into the acid and pop (×); chip "acid kills harmful microbes"; then a chip
  "acidic conditions for protease"; Priya points at herself: "protease digests".
- itself: Kavya bust, worried.
- mucus: `mgSpa`'s `g.mucus` layer glows; acid splashes bounce off it; chip "mucus layer"; a little calendar
  "new lining every few days".
- catalyst: card "ENZYMES = biological catalysts: speed up reactions, NOT used up"; Amy and Priya pose
  either side; one Priya processes protein after protein on a conveyor, counter going up, Priya unchanged.
- alive: Priya deadpan; chip "not alive: molecules"; counter "1 000 000 proteins today"; a lunch box with a
  red cross.
- specific: lock-and-key: a protein bead clicks into Priya's square notch (green tick); a starch hexagon
  bounces off (red cross). Chip "specific: one enzyme, one kind of molecule". Label "active site" on the notch.
- tried: Amy tries to fit her hexagon notch onto a protein bead.
- fit: it does not fit (bounce, red cross). Priya deadpan. Hold 0.7 s.
- notjust: line map with a bracket from MOUTH ("starts") to SMALL INTESTINE ("finishes"); chip "not just the stomach".
- still: Phoebe floating in the acid on a rubber ring, sad. Hold 0.7 s.

## 4 bile: Bill is not an enzyme

Layout: `mgPlatform('SMALL INTESTINE','AL4')`, then `mgGut`; the line map with helpers for "helpers". Showpiece:
the fat blob emulsifying into droplets.

- small: platform sign SMALL INTESTINE; chip "digestion FINISHES here".
- bill: Bill squirts in through the `mgGut` duct; a mini diagram: liver ("makes bile") → gall bladder ("stores
  bile") → duct → small intestine. Lower third BILL.
- fave: Amy hugs Bill, happy.
- not: Bill flat, deadpan; slow push-in. Hold 0.7 s.
- thbill (TH): Bill confessional; card "Bill: NOT an enzyme (no active site, breaks no bonds)"; a washing-up
  sponge prop.
- lionel: Lionel enters, neutral, adjusting glasses; lower third LIONEL. `mgFat` card: arrow → "fatty acids +
  glycerol".
- both: `mgFat.set(1)`: three fatty acids slide off the glycerol, each labelled; Lionel taps the card on
  "Both"; chip "fatty acids AND glycerol".
- blob: a huge `mgBlob` (r 120); Lionel can only nibble its surface (a few glints at the edge); Lionel annoyed.
- emulsify: Bill bubbles (`bubbles: 1`); `mgBlob.set(1)`: the blob breaks into droplets; chips "emulsify",
  "same fat, much more surface area". Hold 1.0 s.
- faster: Lionel zips from droplet to droplet (each shrinks to fatty acids + glycerol icons), happy; chip
  "lipase digests the fat, NOT bile". Bill deadpan.
- alkaline: a pH strip: red (acid) arrow shifts to green-blue ("neutralised"); chip "bile is alkaline";
  enzymes in the background relax.
- heard: `scVideoCall` with Priya (in her spa), smug-annoyed. Hold 0.6 s.
- pancreas: the duct again: a pancreas icon sends in three chips "amylase", "protease", "lipase".
- more: a second, identical Amy pops out of the duct; both Amys wave at each other. Hold 0.5 s.
- helpers: `mgLineMap.set(3, 1)`: LIVER, GALL BLADDER, PANCREAS appear in grey above the line under "NOT ON
  THE LINE"; a red cross over a train path going through them.
- commute: Bill on a little scooter riding along the dashed duct, deadpan. Hold 0.5 s.
- done: summary card: starch → glucose, protein → amino acids, fat → fatty acids + glycerol (icons: hexagon,
  coloured squares, glycerol + tails).
- still: Phoebe wedged between villi, sad. Hold 0.8 s.

## 5 lab: Meanwhile, in the school lab

Layout: `mgLab`, Kavya (`scKavyaBody` at the bench, or bust in front), `mgRack(4)` on the bench; the
enzymes react from small `scVideoCall` windows (top right). Showpiece: the Benedict's colour sweep.

- lab: lab wide; whiteboard title "FOOD TESTS: look for a colour change".
- iodine: tube 1: orange-brown iodine + food → blue-black; chip "starch".
- mine: Amy video call, ecstatic. 
- backwards: whiteboard: "iodine STARTS orange-brown" → "blue-black = starch"; a second tube with no starch
  staying orange-brown. Percy as a small inset (mic). 
- benedict: tube 2: blue Benedict's solution with sugary food; nothing changes; Kavya waits. Hold 1.0 s.
- nothing: Kavya annoyed; tube still blue.
- heat: Percy inset; a water bath (beaker with steam, `heatWaves`) appears; tube goes in; chip "HEAT it:
  no heat, no result".
- sweep: the tube sweeps blue → green → yellow → orange → brick-red; colour swatches tick along under it; chip
  "brick-red = reducing sugar". Hold 0.6 s.
- biuret: tube 3: blue biuret → purple; chip "protein".
- purple: Priya video call, smug.
- fat: tube 4: food shaken with ethanol, poured into water → cloudy white; chip "cloudy white emulsion = fat".
- move: Bill video call, delighted (happy for once).
- lionel: Lionel video call, deadpan. Hold 0.5 s.
- control: a fifth tube "control: water, no food"; a strength scale under tube 2 (light green → brick-red:
  "more colour = more nutrient").
- thkavya (TH): Kavya confessional (`mgConf('kavya')`); behind her, four tiny video-call windows all showing
  "MINE!". Hold 0.7 s.

## 6 villi: Vinny and the end of the line

Layout: `mgGut` and `mgVillusCut`, then `mgEnd`, then a home bathroom-door gag (no toilet on screen: a door
with a "BUSY" sign is enough). Showpiece: the villus diagram building BTBL.

- villi: `mgGut` wide: villi waving; molecules pass into them; zoom to one: chip "villi (one = villus)".
- vinny: Vinny alone in frame, waving (`wave: 1`), neutral; lower third VINNY. Hold 1.0 s, everyone staring.
- big: `mgVillusCut`; outline glows; a badminton court half filled in: "about 30 m²: half a badminton court";
  letter **B** of the mnemonic card.
- thin: `g.wall` highlighted, a zoom bubble on the single cell layer: "one cell thick: short distance"; **T**.
- bloody: `g.cap` glows red; glucose hexagons and amino-acid squares flow into the capillaries and away; **B**.
- lacteal: `g.lacteal` glows; fatty-acid and glycerol icons go into it; **L**. Card complete: "Big, Thin,
  Bloody, Lacteal".
- horror: Kavya bust; the mnemonic card gets dripping horror-film lettering; Vinny waves. Hold 0.6 s.
- large: line map station 4; `mgEnd`; water drops (`g.drops`) leave into the walls: "absorbs most of the
  remaining water".
- bulk: Phoebe in the middle of the leftovers, which now look like a firm mass around her; chip "fibre adds bulk".
- grip: `mgPeriTube` with a fibre-filled mass: the ring has something to push; chip "prevents constipation".
- useful: Phoebe shock → happy; a single gold star. Hold 0.7 s.
- rectum: "THE NEXT MORNING" title; line map stations 5 and 6; chips "faeces", "rectum: stores", "anus: leaves".
- egestion: card "EGESTION = removing undigested food (never absorbed)", Phoebe (part of the leftovers) waving; a tag "never entered the blood".
- excretion: Kavya bust (in pyjamas would be nice: a recolour of her shirt), raised eyebrow. Hold 0.4 s.
- no: card "EXCRETION = waste made by your body's own reactions, in your cells".
- urea: two icons: lungs breathing out CO₂ ("lungs"); liver → urea → kidneys → urine ("kidneys");
  Phoebe (small, to the side) with a tag "egestion, not excretion".
- stop: Phoebe with a tiny suitcase at the `mgEnd` buffer stop, waving. Hold 1.0 s.
- terminates (ANN): Percy with mic; LED "THIS SERVICE TERMINATES HERE"; lights dim. Hold 0.8 s.

## 7 traps: The staff save you some marks

- intro: "7 EXAM TRAPS" heading over the line map.
- t1–t7: quick confessional cuts (`mgConf(kind)`), one per speaker, each with its trap on a card:
  1 Percy: "digestion: starts in the mouth, finishes in the small intestine (not just the stomach)";
  2 Amy: "Benedict's: HEAT it" + "iodine: orange-brown → blue-black";
  3 Priya: "enzymes: not alive, not used up" + "acid doesn't digest: protease does";
  4 Bill: "bile emulsifies, doesn't digest" + mini line map: liver, gall bladder, pancreas off the line;
  5 Lionel: "fat → fatty acids AND glycerol", "protein → amino acids";
  6 Phoebe: "most leftover water: LARGE intestine" + "fibre isn't useless" (she shrugs);
  7 Kavya: "deficiency diseases aren't catching (no germ)".
- return: logo "MIND THE GUT will return".
- vinny: Vinny's confessional (`mgConf('vinny')`): long silence (1.4 s) while he waves and blinks; Percy
  off to the side, deadpan.
- singular: "...I'm a villus. Singular." (his first words: tiny mouth movement). A chip "villus = one, villi = many".
- talks: Amy bursts into frame, shock-happy.
- encourage: Percy deadpan. Final frame: Vinny waving, logo. Hold 1.5 s.

## Suggested split for animators

- A: `tray` + `traps` (board/announcement gags and quick confessional cuts).
- B: `mouth` + `stomach` (teeth, chains, lock-and-key, spa).
- C: `bile` + `lab` (emulsifying blob, line-map helpers, food-test colours).
- D: `villi` (villus diagram, end of the line).

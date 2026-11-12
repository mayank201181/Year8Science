# BLOCK 118, Episode 5 "Mind the Gap": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches The Periodic Table.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

**The premise in one picture:** Kavya's periodic-table poster is really a block of flats (`bkBlock`).
One element per flat. **Groups = stacks (columns). Periods = floors (rows).** Period 1 is the top row,
so "the first floor is at the top". The staircase line between metals and non-metals is a real staircase,
and the caretaker, Silas (silicon, a metalloid), lives on it.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'silas'), mood, look })`.
  Narrator lines (`narr`) move nobody's mouth.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Silas goes `deadpan` at every silly remark (he is the straight man), Sonny is `happy` almost always and
  `shock` with joy at the word "water", Chloe `happy`/`smug`, Helena `smug` (nose up), Harold `sad`,
  Gemma `happy`, Ah Gong `deadpan` and NEVER moves (his kind has `bob: 0`; also keep `look: 0`).
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in on Silas's deadpan face, Harold's rain cloud dripping, Ah Gong not moving at all.
- **Talking heads** (line ids starting `th`) use the confessional shot: `bkConf(root, kind)` full stage
  (a wrapper of `scConfessional` in that character's colours), the character big (s about 1.5) at about
  (430, 390), a prop where it helps. The FIRST time a character speaks in any shot, show
  `scLowerThird(root, ...BK_LT[kind])` for about 3 s (Silas in cold `hi`, Sonny in atom `sonny`, Harold in block `harold`, Helena in block `helena`, Chloe in stacks `chloe`, Gemma in penthouse
  `gemma`, Ah Gong in penthouse `thahgong` (shown by Silas, Ah Gong is silent), Kavya in cold `letters`).
  Cut instantly (fade over 0.25 s at most): sitcom cuts are snappy.
- **Running gags:** Sonny's orbiting electron (`g.electron`) is always circling him; he holds it out like a
  flyer whenever he says "free electron". Harold's rain cloud (`g.cloud`) is always over him. Helena's
  "I'm full" (she pats her balloon tummy). Silas's keys jingle when he walks.
- **Science on screen:** whenever a key word, number or equation is said, it appears big and clear (chip,
  card, letterbox or notice board), with subscripts as real `tspan`s (Cl₂). Equations: real arrows "→".
  The jokes can be silly; the science must be exact. Electrons are blue with a "−", protons red, neutrons grey
  (`bkAtom`). On the block, metals blue, non-metals orange, metalloids lilac (`g.layers`).
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Keep captions'
  bottom strip clear of lower thirds (they sit at y 600-700 by default, which is fine).

## Cast (lib.js `cast(root, kind, { s, mood })`; all about 200 px tall at s = 1, each with a symbol badge)

| kind | who | look | lower third (`BK_LT`) |
| --- | --- | --- | --- |
| silas | Silas, silicon (Si). Tired, sarcastic caretaker; the straight man. Default `deadpan`. | slate-blue crystal, green cap "118", keys, eye bags | SILAS / Silicon. Caretaker. Lives on the staircase. |
| sonny | Sonny, sodium (Na), Group 1. Reckless, loud, one electron to give away ("Free electron!"). Obsessed with water. | shiny silver ball, sodium-orange flame hair, a blue electron orbiting him | SONNY / Sodium. Group 1. One spare electron. |
| chloe | Chloe, chlorine (Cl₂), Group 7. Clingy, intense, needs ONE electron. Her "other half" is a second sphere with a smaller face that copies her. | two yellow-green spheres, pink heart clip | CHLOE / Chlorine. Group 7. Needs just one. |
| helena | Helena, helium (He), Group 0. Posh, bored, lives in the penthouse. "No thank you, darling. I'm full." | pink helium balloon, tiara, pearls; floats | HELENA / Helium. Group 0. The penthouse. |
| harold | Harold, hydrogen (H), flat 1. Mopey and unwanted: sits on top of Group 1 but isn't family; always the gas that gets released. | small pale-white ball, one droopy curl, own rain cloud | HAROLD / Hydrogen. Flat 1. Nobody's family. |
| gemma | Gemma, germanium (Ge). Cheerful new resident who moved into Mendeleev's empty flat. | silver-lilac rounded square, big glasses, "NEW" sticker, moving box (`bkBox`) | GEMMA / Germanium. New resident. |
| ahgong | Ah Gong, argon (Ar), Group 0. Silent; sits on a red plastic stool; has not reacted to anything since 1894. Steals the stinger. | violet ball, white singlet, bushy white eyebrows, red stool; never bobs | AH GONG / Argon. Group 0. No reaction since 1894. |
| kavya | Kavya, 12, the human, cramming at 11 pm. `cast(root,'kavya',{home:true})` = lavender home T-shirt. | `scKavya` | KAVYA, 12 / Test tomorrow. Not ready. |

Extras with faces, no lines: `lithium` (small, crimson hair), `potassium` (big, lilac hair), `fluorine`
(pale yellow pair; "Auntie Fluorine", mood annoyed), `bromine` (red-brown pair, drips), `iodine` (dark grey pair,
purple wisps), `neon` (orange-red glow), `carbon` with `{ label: 'C-12' }` / `{ label: 'C-14' }`.

Sets: `bkBedroom` (Kavya, 11 pm; the poster goes at `BK_POSTER`), `bkBlock` (the building; `g.look(0)` is the
poster), `bkVoidDeck` (letterboxes, chess table), `bkCorridor` (door + number plate), `bkOilFlat` (Sonny's flat,
under oil), `bkPenthouse` (Helena), `bkConf(root, kind)` (confessionals). Props: `bkLetterbox`, `bkAtom`,
`bkTrough`, `bkSign`, `bkStool`, `bkBox`, `bkBadge`. Shared kit: `scClipboard`, `scVideoCall`, kit `beaker`,
`testTube`, `bubbles`, `chip`, `arrow`, `tick`, `cross`.

## 0 cold: Cold open (card: none)
- kavya: `bkBedroom`; Kavya (`home: true`, s 1.25, about (330, 520)) at her desk, chin on hand, mood annoyed,
  looking up-right at the poster (bkBlock `look 0` at `BK_POSTER`). Chip "Kavya, 12" pops at top right-ish
  (not in the tag area); on "test" a red "SCIENCE TEST: TOMORROW" sticky note slaps onto the desk lamp.
- late: the desk clock reads 11:00 PM; fast-forward gag: the clock flicks 11:00 → 11:40 while Kavya's head sinks
  lower onto the desk. Lower third KAVYA, 12 at the start of `letters` (her first line).
- letters: cut closer to the poster: the Na box and the K box get a red circle each; Kavya annoyed, pointing.
  Hold her deadpan stare in the pause.
- poster: documentary push-in on the poster (camera scales the bkBlock up about 1.6x, around the middle).
- block: the poster morphs into the building (`g.look` 0 → 1 over about 1.2 s, starting a third into the line):
  roof slabs, windows, laundry poles appear; the bedroom fades to a blue sky behind; "BLK 118" sign.
  Chip "118 flats · 1 element each" pops on "one element in each". Show the viewfinder corners (documentary)
  as in the pilot.
- hi: hard cut to Silas's confessional (`bkConf 'silas'`), deadpan; lower third SILAS. Chip "silicon (Si)".
  On "I'm the caretaker" his phone pops up beside him, buzzing: "INCOMING: SONNY (Na)". Silas stares at it.
- water: split: Sonny bursts in from the right edge of the confessional, mood `shock` (joy), electron whizzing;
  a little paper cup of water icon with "?!" above his head.
- no: Silas, deadpan, does not even look at him. Hold 0.7 s of silence. Sonny's face falls to `sad`.
- thsonny: Silas alone again, deadpan, look at camera; a small "Na" warning sign (yellow triangle) behind him.
- title: title card: dark night sky with stars, the building faint behind (the same bkBlock, opacity 0.2),
  logo "BLOCK 118" big (yellow, thick navy outline) and "Episode 5: Mind the Gap" below; the cast pops in a row
  underneath, one by one, bobbing (Ah Gong does not bob). Hold it.

## 1 block: Welcome to Block 118
- element: `bkVoidDeck` outside the block; Silas walks in (keys jingling) with a clipboard (`scClipboard`); chip "ELEMENT = only one kind of atom"; a little cluster of identical atoms (all the same colour)
  next to it; on "No chemical reaction..." a second chip "can't be broken down into anything simpler", and a
  tiny hammer bounces off the atom cluster ("boink"). Silas deadpan in the pause.
- order: the building (`bkBlock`, look 1) at about (600, 380), s 1.0; a yellow counter runs flat 1, 2, 3... with
  each flat lighting up in order (light the first ~20 one by one, then sweep the rest fast to 118). Chip
  "atomic number = proton number = number of protons".
- harold: zoom to flat 1 (top left): Harold leans out of his window, sad; lower third HAROLD; chip "1 proton".
- helena: pan to flat 2 (top right): Helena opens her curtains, smug, sunglasses-down look; lower third HELENA;
  chip "2 protons"; on "No photographs, darling" the curtain snaps shut.
- mass: cut to Kavya (bust) at her desk, curious, pencil up.
- notmass: Silas confessional-style aside in front of the block: chip "ordered by ATOMIC NUMBER ✓" and
  "by mass ✗" with a red cross.
- letterbox: void deck letterbox wall; one letterbox flies forward and grows: `bkLetterbox` for sodium
  (11, Na, sodium, 23). Each part gets a label with a leader line as it is named: "symbol", "name",
  "atomic number" (the small top number), "mass number" (the bottom number).
- sodium: the parts pulse in turn as they are said: Na (with a small chip "Na ← natrium, Latin": this answers
  Kavya's cold-open complaint), then 11, then 23. In the pause, Sonny's flame hair pokes up from behind the
  letterbox and ducks away again (a tease; he is introduced properly in scene 2).
- group: the building again, `g.labels` on; one stack lights up (`g.stacks[1]`, yellow) on "group" with a big
  down arrow and chip "GROUP = column (a stack)"; then a floor lights (`g.floors[3]`, blue) on "period" with an
  across arrow and chip "PERIOD = row (a floor)".
- thtop (TH): Silas confessional; inset: the building with a lift indicator pointing to the TOP floor
  labelled "1". Silas deadpan; hold the pause.

## 2 atom: The flat inspection
- inspect: `bkCorridor`, plate "#03-01" (floor 3, stack 1), Silas with clipboard knocks; "ANNUAL INSPECTION"
  notice.
- sonny: the door swings open (`g.door.set`), cut inside: `bkOilFlat`; Sonny floating happily in the amber oil;
  lower third SONNY (his first line). On "Mind the oil!" Silas, in the doorway, deadpan, steps over an oil puddle.
- nucleus: the flat becomes an atom: `bkAtom(root, [2, 8, 1], { p: 11, n: 12 })`, big, centre; the nucleus
  glows; labels "nucleus", "protons", "neutrons".
- charges: labels on the nucleus balls: red "proton +", grey "neutron 0"; Silas in a corner, deadpan, on
  "adding weight" a tiny grey neutron does nothing at all.
- electrons: the shells and blue electrons fade in (`g.set` 0 → 11, inside-out); chip "electron −, in shells".
- atomicno: big chip "ATOMIC NUMBER = number of protons"; the 11 red protons blink; a big "11".
- massno: chip "MASS NUMBER = protons + neutrons"; red and grey balls count up to "23".
- guess: Kavya (bust) at her desk, confident, writing "23?" in her notebook.
- subtract: whiteboard: **23 − 11 = 12 neutrons** (big), Kavya's "23" crossed out. Silas deadpan.
- neutral: "+11" (red) and "−11" (blue) cancel to "0"; Sonny happy, waving.
- carbon: hard cut to the corridor of flat six: two carbon extras (`carbon` C-12 and C-14) in one doorway;
  side-by-side mini atoms: "6p 6n" and "6p 8n".
- isotopes: chip "ISOTOPES: same protons, different neutrons"; both carbons point to the same flat number "6".
- shells: `bkAtom` again, shells fill one electron at a time: first ring "2", second "8", third "8" (show a
  [2, 8, 8] atom, argon-like, with the counts beside each ring).
- mine: back to sodium's atom: "2, 8, 1" big; the single outer electron glows and wobbles.
- flyer: Sonny in the corridor holding his electron out to passers-by like a flyer; a cardboard sign "FREE e⁻";
  everyone walks past.
- thflyer (TH): Silas confessional, deadpan; inset sketch: a person holding out a flyer at an MRT exit.

## 3 stacks: Same stack, same layout
- same: `bkBlock` exterior, sunny; on "Same stack, same layout" three identical little floor plans fan out
  beside stack 1; then stack 1 is highlighted (`g.stacks[1]`) and each flat in it shows "1 outer e⁻".
- family: Lithium (top), Sonny (middle), Potassium (bottom) leaning out of their windows in stack 1, all waving;
  each has ONE orbiting electron. Shell diagrams 2,1 / 2,8,1 / 2,8,8,1 beside them, outer electron glowing.
- similar: chip "same outer electrons → similar chemical properties".
- number: `g.labels` on; group numbers glow: "1" over stack 1 with "1 outer e⁻", "7" over stack 17 with
  "7 outer e⁻".
- harold: flat 1 (top of stack 1, physically above Lithium): Harold alone at his window, sad, rain cloud; chip
  "H: 1 outer electron, but a non-metal gas"; below him the Group 1 family have a party (streamers) without him.
- thharold (TH): Silas confessional; inset: a starry universe full of tiny Harolds ("most common element").
  Hold Silas deadpan in the pause.
- shellsrow: a floor highlighted (`g.floors[3]`); chip "PERIOD number = number of shells"; three rings
  next to it.
- chloe: Chloe bursts onto her balcony at flat 17 (floor 3, stack 17); lower third CHLOE; her atom 2, 8, 7
  appears, then chips "7 outer → Group 7" and "3 shells → Period 3", with arrows to her stack and floor.
- one: close-up Chloe, intense (`happy`→`annoyed`), the empty slot in her outer shell flashing.
- me: Sonny pops up in the frame from flat 11, waving his electron, `shock` (joy).
- notnow: Silas steps between them, deadpan; hold 0.6 s.
- metals: the whole block; `g.layers.metal` (blue) washes in from the left, then `g.layers.nonmetal`
  (orange) on the right; chips "METALS" and "NON-METALS".
- stairs: `g.stair.set` draws the zig-zag (yellow); Silas stands ON it at flat 14 (Si), keys jingling.
- thstairs (TH): Silas confessional; inset: complaint letters flying at him from both sides (blue ones and
  orange ones); `g.layers.metalloid` lilac on the staircase flats.
- shiny: metal card with icons: sparkle (shiny), lightning + flame (conducts electricity and heat), hammer
  (malleable), wire (ductile), thermometer high (high melting point).
- dull: non-metal card: dull grey lump, broken pieces (brittle), gas cloud (many are gases), a crossed-out
  lightning bolt (poor conductor).
- graphite: a pencil lead (graphite) in a little circuit; a bulb lights; chip "graphite: non-metal that conducts".
  Silas deadpan "There's always one".

## 4 alkali: Free electron, anyone?
- meet: stack 1 lit (`g.layers.alkali`, minus H); Lithium, Sonny, Potassium in a row with names.
- oil: Sonny's flat full of oil (`bkOilFlat`); chips "reacts with oxygen + water in air" → "stored under oil".
- soft: a butter knife slices a corner off Sonny cleanly (cut face shiny silver); Sonny happy.
- cut: Silas holding the knife away, deadpan; hold the pause.
- float: Lithium, Sonny and Potassium bob on top of a beaker of water (float).
- water: Sonny `shock` (joy), electron spinning fast (`o.speed` higher, or a faster place).
- li: hard cut: `bkTrough` behind its safety screen (Silas standing well back with a clipboard); Lithium on the water, a gentle stream of fizz bubbles (kit
  `bubbles`); Lithium bored. Hold 1 s.
- na: Sonny melts into a shiny silver ball and zips across the surface, left to right, fizz trail.
- whee: Sonny zipping back the other way, `shock`/happy, speed lines.
- k: Potassium bursts into a lilac flame on the water; everyone else `shock`. Hold 1.2 s.
- hydrogen: Harold rises out of the fizz bubbles above the trough, sad, rain cloud; chip "hydrogen gas".
- equation: whiteboard: **sodium + water → sodium hydroxide + hydrogen**; then a universal-indicator
  colour strip shows the water going purple, chip "ALKALINE".
- trend: big down arrow beside stack 1: "REACTIVITY INCREASES ↓"; Li, Na, K reactions as three mini icons
  (small fizz, zipping, lilac flame).
- why: Kavya (bust), baffled.
- bigger: three shell diagrams side by side (Li 2,1 / Na 2,8,1 / K 2,8,8,1), growing; a ruler arrow from
  nucleus to outer electron gets longer: "further from the nucleus".
- shield: the inner shells of K's atom glow as a grey "shield" between the nucleus and the outer electron;
  the pull arrow from the nucleus gets thinner. Chip "SHIELDING".
- lost: the outer electron flies off potassium's atom; Potassium flicks it at the camera; Sonny laughing.
- group2: stack 2 lit (`g.layers.alkaline`); chips "Group 2: 2 outer electrons", "reactive, but less than
  Group 1"; magnesium and calcium labels; then a beaker where a calcium lump fizzes steadily and calmly,
  label "calcium + cold water: steady" (Sonny, beside it, looks unimpressed).

## 5 halogens: Chloe just needs one
- meet: stack 17 lit (`g.layers.halogen`); chip "HALOGENS: non-metals, 7 outer electrons".
- pair: Chloe on her balcony; chip "Cl₂" with a real subscript; her other half copies her expression exactly.
- colours: the halogen family in a row, one by one, each with a colour swatch and state: Fluorine (pale yellow
  gas), Chloe (green-yellow gas), Bromine (red-brown liquid, drips), Iodine (dark grey solid, purple vapour).
- state: under them: GAS, GAS, LIQUID, SOLID; an arrow down "melting points rise".
- twist: big down arrow beside stack 17: "REACTIVITY DECREASES ↓"; compare with stack 1's arrow "INCREASES ↓".
- auntie: Auntie Fluorine (top of the stack, flat 9) glaring out of her window, `annoyed`; tiny lightning bolts
  around her; Chloe looks away.
- trap: Kavya (bust), confused: two arrows on a sticky note: G1 ↓ more, G7 ↓ less.
- gain: chlorine's atom (`bkAtom [2, 8, 7]`) beside a bigger four-shell atom labelled "bromine: 7 outer
  electrons" (do NOT write bromine's full arrangement; Year 8 only uses 2, 8, 8): an incoming blue electron is
  pulled in; the pull arrow is thinner for the bigger atom; chips "further away", "more shielding", "weaker grip".
- grip: two-column card: GROUP 1 "wants to LOSE an electron → weak grip HELPS → more reactive going down" vs
  GROUP 7 "wants to GAIN an electron → weak grip HURTS → less reactive going down".
- partners: void deck chess table: Sonny and Bromine sitting together working on a project poster; chip
  "sodium bromide"; a small beaker of colourless sodium bromide solution on the table.
- move: Chloe arrives, `smug`; Bromine `shock`.
- displace: Chloe slides into Bromine's seat; Bromine is pushed out; the beaker turns orange. Chip
  "more reactive halogen DISPLACES a less reactive one".
- equation: whiteboard: **chlorine + sodium bromide → sodium chloride + bromine**.
- finally: Sonny turns to Chloe, holding out his electron, `happy`.
- yes: Chloe `shock` (joy), hearts; she grabs the electron.
- salt: the electron moves from Sonny's outer shell to Chloe's; both atoms now show full outer shells
  (Na 2, 8 and Cl 2, 8, 8); chip "sodium chloride".
- chicken: Kavya at her desk with a plate of chicken rice; a salt shaker labelled "NaCl"; she stares at it.
- thsalt (TH): Silas confessional; inset: an explosion icon + a green gas cloud "=" a plate of chicken rice.
  Hold Silas deadpan.

## 6 penthouse: The penthouse and the empty flat
- top: the building; a camera crane up to the top right flat (flat 2); stack 18 lit (`g.layers.noble`);
  chip "GROUP 0: NOBLE GASES". Cut to `bkPenthouse`.
- full: Helena floats by the window, `smug`, velvet rope with "NO REACTIONS" (on "We don't react, darling");
  then three mini atoms with full outer shells: He 2, Ne 2, 8, Ar 2, 8, 8; each outer shell glows gold with "FULL".
- stable: chip "full outer shell = stable → unreactive (inert)"; icons gain ✗, lose ✗, share ✗.
- offer: Sonny pops in through the door holding out his electron, happy.
- fullup: Helena, `smug`, pats her tummy, eyes closed; Sonny deflates (`sad`). Hold 0.7 s.
- empty: Kavya (bust), unsure; thought bubble of an atom with an EMPTY outer shell.
- gasp: Helena `shock`, nearly pops; the thought bubble's empty shell gets a red ✗ and refills with 8
  electrons: "FULL ✓". Hold.
- uses: Helena floating up like a party balloon (balloon string); chip "lighter than air, doesn't burn";
  a little MRI scanner icon with a snowflake "helium cools the magnets".
- neon: a neon sign glowing orange-red ("OPEN"), Neon (extra) smug beside it; then a light bulb and a welding
  torch with a protective argon cloud; Ah Gong on his stool in front of the welding sparks, totally unbothered.
- thahgong (TH): Silas confessional with an inset of Ah Gong on his stool (deadpan, still); lower third
  AH GONG over the inset. Hold the pause: Ah Gong blinks once.
- plans: sepia architect's blueprint of the block labelled "1869"; a desk with a quill (no portrait, no face).
- gaps: the blueprint shows the grid with dashed empty squares and "?" marks (`bkBlock` with `gaps: [32]`, or
  a simpler blueprint grid).
- empties: Silas points at the empty flat below his: a FOR RENT sign; chip "predicted the missing elements".
- thlisting (TH): Silas confessional holding the old listing card: "FLAT 32: grey, atomic mass ≈ 72".
- gemma: Gemma arrives with a moving box (`bkBox`), happy; lower third GEMMA; her own card: "grey ✓, 72.6 ✓".
- match: the building: the "?" on flat 32 fades (`g.gap[32]`) and "Ge" lights up; chip "1886: prediction
  confirmed → evidence of a real pattern".
- mind: (the scene's button) MRT-style sign "PLEASE MIND THE GAP" on the void deck; Silas deadpan beside it.

## 7 traps: The residents save you some marks
- intro: notice board on the void deck: "7 EXAM TRAPS" (Town Council style, `bkSign`).
- t1–t7: quick confessional cuts, one per speaker, each with its trap on a card:
  1 Silas: ordered by ATOMIC (proton) number, not mass; 2 Gemma: atomic number = smaller number; neutrons =
  mass − atomic (23 − 11 = 12); 3 Kavya (bust, proud): groups = columns ↓, periods = rows →;
  4 Sonny: Group 1 very reactive, increases ↓; 5 Chloe: Group 7 decreases ↓; 6 Helena: full outer shell, not
  empty; 7 Harold: the gas from Group 1 + water is HYDROGEN (Harold sad, cloud raining harder).
- return: the logo "BLOCK 118 will return" over the night building.
- ahgong: (stinger) Ah Gong's confessional (`bkConf 'ahgong'`), on his stool. Silas off-camera (or small at the
  edge) asks. Hold 1.4 s of nothing: Ah Gong does not move. Not even a blink.
- noreaction: "...No reaction." Tiny mouth movement only; nothing else moves.
- since: Silas deadpan; everyone else (Sonny, Chloe, Helena, Harold, Gemma) peeks in from the edges, `shock`.
  Final frame: Ah Gong, still, on his stool; logo.

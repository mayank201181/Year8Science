# EVERY JOULE COUNTS, Ep 14 "The Case of the Missing Joules": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Energy: Stores & Transfers.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

**Premise.** Inside the electricity meter outside Kavya's HDB flat (#08-34) is a tiny accounting firm,
Constance & Co., that accounts for every joule. The senior auditor, Constance, IS the law of conservation of
energy (never broken in 13.8 billion years). Kavya's mum says the aircon is "using up all the energy"; Kavya
says energy can't be used up. Constance opens a case. The trail runs through the eight store departments, the
courier Pat (a pathway, NOT a store), a bubble tea accident (conservation), Theo's basement (wasted energy
dissipates into the thermal store), Effie's performance review (efficiency, Sankey), and Colin the coal lump
(resources, power stations). Verdict: no joule was destroyed, but plenty were wasted; Mum was right too.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'con'), mood, look })`.
  The `who` keys: narr, kavya, mum, con, jules, pat, theo, effie, colin, gerald. Mum is never drawn.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Constance goes `deadpan` at every silly remark; Jules is `happy` (`shock` when told off); Theo is `sad`
  (`happy` for one frame-hold only when someone is nice to him); Pat goes `annoyed` whenever anyone treats him
  as a store; Effie is `smug`; Colin is `annoyed`/grumpy; Gerald is `deadpan` and never moves except to blink.
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** A line with a `pause` is followed by silence: hold the reaction there (a slow
  push-in on Constance's deadpan face, Gerald blinking, Theo staring at the floor). Do not fill pauses with new info.
- **Running gags:** (1) Constance's rubber stamp `enStamp`: "DENIED" thumps onto the screen every time she says
  "Denied" (basement.denied, review.check, supply.uranium) and "FILED" in traps.filed, "CASE CLOSED" in supply.closed.
  (2) Pat: "I'm. Not. A. Store." one word per beat (each word pops as a big chip). (3) Theo: every wasted joule
  ends up with him; he waves sadly from wherever the waste goes (a Sankey branch, a basement). (4) Gerald on the
  high shelf, silent, "a lot of potential", until the stinger.
- **Talking heads** (line ids starting `th`, plus those marked TH below) use the confessional shot:
  `enConf(root, who)` full stage, the character big (s about 1.5) at about (430, 400), REC blinking
  (`conf.set(1, t)`). The first time a character appears (anywhere), show `scLowerThird(root, NAME, ROLE)` for
  about 3 s. Cut instantly (a fade of 0.25 s at most): sitcom cuts are snappy.
- **Science on screen:** whenever a key word, equation or number is said, it appears big and clear (chip,
  `enBoard` ledger page, card), with the exact wording of the caption. Store names use the `EN_STORES` colours
  and `enStoreIcon`; pathways use `EN_PATHS` and `enPathIcon`. Arrows in energy flow diagrams are real arrows
  (`arrow()`), store boxes are store-coloured. The jokes can be silly; the science must be exact.
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Nothing over the bottom
  caption band beyond y 690 except the lower third.

## Cast (lib.js `cast(root, kind, { s, mood })`)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| con | Constance, the law of conservation of energy: tired, sarcastic, has never been wrong | green ledger book, grey bun with a pencil through it, gold half-moon glasses | CONSTANCE / Law of Conservation of Energy. Senior auditor. |
| jules | Jules, one joule: over-excited intern, the "only witness" | gold coin, lightning quiff, "1 J" badge, waving arms (`arms`) | JULES / One joule. Unit of energy. |
| pat | Pat, the courier: a transfer pathway, furious at being called a store | fat orange arrow, courier cap; badge shows the route (`route: 'mech'/'elec'/'heat'/'rad'`) | PAT / Courier. A pathway. NOT a store. |
| theo | Theo, the thermal store: mopey, everything ends up with him | droopy melting orange blob, heat shimmer hair, dots drifting off (`glow` when energy arrives) | THEO / Thermal store. The basement. |
| effie | Effie, efficiency: talent-show judge, harsh, smug | purple body, 0-100% gauge crown (`gauge` 0..1), pink cat-eye glasses | EFFIE / Efficiency. Reviews everything. |
| colin | Colin, a lump of coal: old, grumpy, reliable, smoky | dark faceted lump, yellow hard hat, white moustache, smoke (`smoke`) | COLIN / Coal. Fossil fuel. Non-renewable. |
| gerald | Gerald, a boulder on the high shelf: silent, "a lot of potential" | grey boulder, moss on top, sleepy | GERALD / Gravitational potential store. (in traps only) |
| kavya | Kavya, 12, the human: exasperated, smart, half right | `cast(root,'kavya')` (= scKavya), `scKavyaBody` for full body | KAVYA, 12 / Half right. |
| mum | Mum: off-screen voice only | an `enBubble` from the kitchen doorway of `enFlat` (tail pointing into the doorway) | (none) |

Sets: `enFlat` (living room, 34 °C, aircon, sofa, table, kitchen doorway, clock), `enCorridor` (HDB corridor,
front door #08-34, the meter), `enOffice` (inside the meter: firm sign, board, shelf, desk), `enDoors` (the
corridor of eight store departments, pans with `g.pan(x)`), `enBasement` (Theo's basement), `enReview`
(Effie's review room, a big screen for charts), `enPlant` (power station at dusk).
Props: `enMeter`, `enBubbleTea`, `enSplat`, `enFan`, `enKettle`, `enSankey`, `enBoard`, `enStamp`, `enBubble`,
`enTurbine`, `enWind`, `enSolar`, `enSmoke`, `enStoreIcon`, `enPathIcon`, plus lib `arrow`, `chip`, `spark`,
`heatWaves`, `thermometer`, `bolt`.

## 0 cold: Cold open (card: none)
- kavya: `enFlat`, clock at 1 p.m.; Kavya (bust, s 1.3) on the sofa side, mood deadpan, fanning herself with a
  worksheet; the aircon blowing (`upd(t, 1)`); chips pop: "Kavya, age 12", "Saturday", "34 °C" (red, with a
  `thermometer` high), and an aircon chip "ON since breakfast". The sun in the window pulses.
- mum: Mum's `enBubble` "Switch off the aircon!" pops from the kitchen doorway (tail into the doorway); Kavya
  winces (annoyed), looks left. The phrase "using up all the energy" appears as a second smaller bubble line.
- actually: Kavya, smug, turns to camera; lower third KAVYA, 12 / Half right. A small chip "energy can't be
  destroyed ✓" appears beside her as she says it.
- half: freeze frame (stop the bob: `still`) and a split: a "HALF RIGHT" stamp-style tag on Kavya, and another
  "HALF RIGHT" on the kitchen doorway. Hold for the pause: Kavya side-eyes the doorway.
- meter: hard cut to `enCorridor`: slow push-in on the meter box by the door (#08-34); digits running.
- inside: documentary zoom into the meter's digit window (viewfinder corners and "ZOOM ×" readout like the
  pilot), through it into `enOffice`. The firm sign is readable: "CONSTANCE & CO. / Energy auditors / est. 13.8
  billion years ago".
- hi (TH): Constance confessional (`enConf(root,'con')`), deadpan; lower third CONSTANCE / Law of Conservation
  of Energy. Senior auditor. Chip "LAW OF CONSERVATION OF ENERGY" (gold).
- law: an `enBoard` page "THE LAW" writes, line by line: "Energy cannot be **created**" (✗ icon), "or
  **destroyed**" (✗), "only **transferred** from one store to another" (✓, with an arrow between two little store
  boxes). Constance taps it with her eyes (look right).
- never: cut to a dusty shelf of failed "FREE ENERGY!!" machines (a wheel with weights, a magnet car, a perpetual
  motion bird) each with a red ✗; counter "Times broken: 0" and "Years: 13 800 000 000". Constance deadpan.
- case: back in the office: Constance snaps a folder shut; a case file slides in: "CASE 14: THE MISSING JOULES"
  with "Complaint: energy 'used up' at #08-34". Her stamp thumps "OPEN" (enStamp, green).
- title: show logo "EVERY JOULE COUNTS" (gold, outlined, with a spinning joule coin as the O in JOULE, or a
  coin beside it) and "Episode 14: The Case of the Missing Joules"; the cast pops in below in a row, bobbing:
  Constance, Jules, Pat, Theo, Effie, Colin, Gerald, Kavya. Hold.

## 1 stores: The eight departments
- file: `enOffice`; a manila folder "CASE FILE 1" slides onto the desk; Constance at the desk, Jules bouncing in.
- hi: Jules bursts into frame (shock-happy, `arms: 1`), sparkles; lower third JULES / One joule. Unit of energy.
  Chip "energy is measured in **joules (J)**".
- thjules (TH): Constance confessional, deadpan. Inset: a small apple lifted 1 m beside a metre-stick,
  label "≈ 1 J".
- apple: Jules (happy, eyes closed) beside a framed photo of himself lifting an apple, "BEST DAY". Constance
  deadpan in the pause.
- kilo: board: "**1 kJ = 1000 J**" (kJ in gold); 1000 tiny coins pour into a "kJ" box.
- banana: a banana cut open, crammed with tiny Jules faces; "≈ 400 000 J (400 kJ)". Jules happy; the banana
  bulges. Hold the pause on Constance.
- stores: cut to `enDoors`, pan 0; title chip "**8 ENERGY STORES**" and the corridor of eight doors.
- tour: Constance walks (slides) right, briskly, deadpan; Jules hurries behind. Pan starts moving.
- kin: pan to doors 1 and 2: door KINETIC opens (inside a ball whizzes across with speed lines; chip "moving");
  then GRAVITATIONAL opens (inside a book on a high shelf; chip "high up").
- gerald: the camera tilts up to the high shelf beside GRAVITATIONAL (`g.shelf`): Gerald the boulder, deadpan.
  He blinks once in the pause. Nobody else moves. (No lower third for Gerald yet: he hasn't spoken.)
- elastic: pan to ELASTIC (a spring squashes and stretches; chip "stretched or squashed") and CHEMICAL (food,
  a fuel can, a battery; chip "food, fuels, batteries").
- thermal: pan to THERMAL (door says BASEMENT ↓; warm glow and jiggling dots inside; chip "warm: particles
  jiggle") and NUCLEAR (an atom; the nucleus glows; chip "in the **nucleus**").
- electro: pan to ELECTROSTATIC (a balloon with + and − charges and a hair strand lifting; chip "charges attract or
  repel") and MAGNETIC (two magnets pulling together; chip "magnets attract or repel").
- mnemonic: Jules chants it slowly, word by word: the eight store icons drop into a row in order, one per word, each with its initial letter big: K G E C T N E M, and
  the words "Kind Gorillas Eat Chocolate, Tigers Never Eat Mango" build under them, initials in the store colours.
- thgorillas (TH): Constance confessional; a cut-in photo: Jules holding up a sign to two unimpressed gorillas
  eating chocolate. Constance deadpan.
- where: Kavya (bust) at home, hand raised, curious; three chips with question marks: "electricity?",
  "light?", "heat?".
- not: hard cut to Constance, slow push-in, deadpan. The three chips get a red stamp "NOT STORES". Hold.

## 2 pat: Pat is not a store
- pat: `enOffice` door bursts open; Pat the arrow zooms in left to right and brakes. Chip "**TRANSFER PATHWAYS**".
- hi: Pat (neutral), lower third PAT / Courier. A pathway. NOT a store. Two chips: "keep ✗" / "move ✓".
- thpat (TH): Constance confessional, deadpan; inset: Jules trying to hand Pat a filing box, Pat annoyed.
- mech: board "4 ROUTES" with the four `enPathIcon`s greyed; route 1 lights up: "1 **MECHANICALLY**: a force
  pushes, pulls or stretches". Pat's badge `route: 'mech'`.
- kick: a foot kicks a football; Pat (small, badge mech) rides the kick; the ball's kinetic store box fills.
  Flow: "force → **kinetic** store".
- elec: route 2 lights up (`route: 'elec'`): "2 **ELECTRICALLY**: an electric current"; a phone on a charger
  with current dots flowing along the cable (`wire()` dots).
- heat: route 3 (`route: 'heat'`): "3 **BY HEATING**: hotter → colder"; a hot pan (red glow) and an egg in it
  sizzling; an arrow from pan to egg.
- rad: route 4 (`route: 'rad'`): "4 **BY RADIATION**: waves (light, infrared, sound)"; the sun's rays and a
  speaker's sound waves, both drawn as waves travelling right.
- leave: Jules holds out a glowing "light energy" parcel towards Pat, happy.
- no: Pat, annoyed, one word per beat as huge chips: "I'M." "NOT." "A." "STORE." Hold the pause on Pat glaring;
  Jules slowly withdraws the parcel (sad).
- rule: two-column card: left "**STORES** = WHERE energy is held" (the eight small icons), right "**PATHWAYS** =
  HOW it moves" (the four route icons). Then a strip: "heat, light, sound, electricity → pathways ✓, stores ✗".
- kettle: cut to the flat's kitchen corner: `enKettle` on the counter, steaming; a "34 °C" chip with a sweating
  sun; a mug labelled "KOPI". (Dad is off-screen; just his hand on the kettle, or nothing.)
- first: energy flow builds: [mains plug] —ELECTRICALLY (route icon, Pat riding the cable)→ [heating element];
  the element glows red (`g.element` stroke red).
- then: → BY HEATING → [water: **thermal store**] (orange box, thermal icon); water bubbles, steam rises
  (`upd(t, 1)`).
- so: Kavya (bust), concentrating, counting on fingers; the full chain stays on screen with "2 pathways" under it.
- correct: Constance (office), deadpan; a tiny green ✓ on "Correct"; on "Annoyingly" she looks away (annoyed).
- thcorrect (TH): Kavya confessional (`enConf(root,'kavya')`), delighted (happy), hands up; a phone with
  "telling everyone" typing dots. Hold.

## 3 tea: The bubble tea incident (showpiece: the falling cup with live store bars)
- four: `enFlat`, clock at 4 p.m.; the word "A TRAGEDY." in dramatic serif letters, slow zoom.
- cup: close-up of the table edge: `enBubbleTea` right on the edge; Kavya's elbow (a sleeve shape) slides in
  slowly from the left. Ominous red vignette.
- before: freeze; Constance (small, inset bottom right, or the confessional) explains; the cup glows with a blue
  bar labelled "**gravitational potential** store" full, a red bar "**kinetic**" empty; a height arrow "high up".
- falling: slow-motion fall (the cup tumbles from table height to the floor over the line): the blue gravitational
  bar empties as the red kinetic bar fills, exactly in step; speed lines grow. Jules commentates (inset, happy,
  `arms: 1`).
- no: Kavya (bust), shock, both hands on her face, slow motion; the cup is just above the floor.
- lands: freeze 1 cm above the floor: bars show nearly all kinetic; then SPLAT (`enSplat` spreads), screen shake.
- theo: cut to `enBasement`: Theo, sad, glow on (`glow: 1`); lower third THEO / Thermal store. The basement.
- splat: split screen: the splat on the floor gives off a "SPLAT!" sound-wave ring (labelled "**sound**") and
  faint orange heat waves from the floor, tea and pearls (labelled "thermal"); a "tiny bit" thermometer rises
  only a hair.
- total: an `enBoard` ledger: "TOTAL BEFORE = TOTAL AFTER": a bar of 100 J gravitational on the left; on the
  right the same total split into kinetic, then thermal + sound; Constance ticks it with a pencil (✓ "counted").
- flow: the energy flow diagram, big and exact: [**gravitational potential**] → [**kinetic**] → [**thermal**] +
  [**sound**], boxes in store colours (sound in the radiation-pathway violet, labelled as carried by sound waves).
- toy: inset: a wind-up toy with a key; [**elastic** (spring)] → [**kinetic**] + a little [**thermal**
  (friction)]; the toy walks across.
- pearls: Kavya on the floor beside the splat, sad, holding up one pearl.
- thpearls (TH): Constance confessional, deadpan; the pearl in a tiny evidence bag "EXHIBIT A". Hold.

## 4 basement: Theo's basement
- fan: `enFlat`, clock 5 p.m.: the aircon off (no cold lines); `enFan` beside the sofa, spinning and rattling
  (`upd(t, 1)`); "rattle rattle" text wobbles by it; Kavya sweating (`sweat: 1`).
- useful: diagram over the fan: electricity in (yellow), a green arrow "**useful**: kinetic store of the moving
  air" with air swirl lines blowing out of the fan.
- wasted: a second, orange arrow from the motor "**wasted**: thermal store of the surroundings"; the motor glows
  faintly; heat waves.
- me: `enBasement`: Theo, sad; orange dots (wasted energy) float down the stairs and settle around him;
  labels as they arrive: "motor: warm", "rattle: sound → heat". `glow` on.
- theo (TH): Theo confessional (`enConf(root,'theo')`), sad; the lost umbrella from the basement leaned beside him.
- gone: Jules (office), shock-curious, `arms: 1`; a "POOF?" cloud chip (the misconception: wasted energy vanishes).
- denied: Constance deadpan; `enStamp(…, 'DENIED')` thumps over Jules's POOF cloud. Hold.
- spread: board: "**DISSIPATES** = spreads out into the surroundings"; a cluster of 20 orange dots spreads out
  across the whole screen, each getting fainter (none disappears: keep the count).
- thin: Theo in the basement, the dots spread so thin around him they are barely visible; a dustpan tries to
  sweep them up and catches nothing; chip "very hard to collect and reuse". Hold on "a slightly warmer room"
  (a thermometer that rises 0.1 °C).
- friction: two quick cutaways: a bicycle brake pad squeezing a wheel rim (sparks of heat, the pad glows), and
  air streaming past a cyclist; chips "**friction**" and "**air resistance**" → "**thermal** stores".
- rub: Kavya (bust) rubbing her palms fast (two hands moving), heat waves rising from them; chip "friction →
  **thermal store** of your skin".
- cool: Kavya, surprised then happy.
- warm: hard cut to Theo, deadpan-sad, in the basement. Hold in silence.

## 5 review: Effie's performance review (showpiece: the Sankey diagram)
- effie: `enReview`, spotlight sweeping; a queue of appliances waiting outside (fan, kettle, rice cooker drawn
  simply, aircon), nervous.
- hi: Effie at the judge's desk, smug; lower third EFFIE / Efficiency. Reviews everything. Her gauge needle
  swings and settles.
- theffie (TH): Effie confessional (`enConf(root,'effie')`), smug; inset: a rice cooker with a tear drop.
- formula: the formula full width on the big screen, exact caption wording:
  "**efficiency = useful energy transferred ÷ total energy supplied**" ("useful" green, "total" yellow).
- uot: Jules waves pom-poms (`arms: 1`); "Useful **O**ver **T**otal" with the U, O, T big; a fraction line drawn
  with "useful" on top and "total" underneath.
- fan: the fan on a little stage; screen: "supplied: **200 J**" (yellow bar), "useful (moving air): **150 J**"
  (green bar, 3/4 the length).
- divide: the sum writes itself: "150 ÷ 200 = 0.75", then "× 100 = **75%**"; Effie's gauge needle (`gauge: 0.75`)
  points at 75%.
- waste: "wasted: **50 J** (**25%**), mostly heat" in orange; the fan's motor glows.
- hello: Theo pokes into frame from below the screen, sad wave. Hold.
- never: Effie, firm; chip "**no real device is 100% efficient**"; her needle tries to reach 100% and stops short,
  trembling.
- more: Jules, happy, scribbling "110%" on a sticky note and slapping it on the screen.
- check: Constance appears, deadpan; `enStamp` "DENIED" over the 110% note; chip "out ≤ in: check your working".
- sankey: the big screen draws `enSankey({ total: 200, frac: 0.75, labels: { in: '200 J supplied', use: '150 J
  useful (moving air)', waste: '50 J wasted (heat)' } })`, growing left to right (`set(p)`); chip "**width** =
  **amount** of energy". Widths must be exactly proportional (input 200 px, useful 150, wasted 50).
- branch: highlight the useful band (pulse green) "carries straight on", then the wasted branch (pulse orange)
  "peels off, usually downwards".
- fat: two mini Sankeys side by side: a fat orange branch (e.g. 90% wasted) labelled "inefficient", a thin one
  (e.g. 10% wasted) labelled "efficient"; Effie smug on "Simple. Brutal. Beautiful."
- always: Theo sitting at the end of the downward orange branch of the big Sankey, sad. Hold.

## 6 supply: Where the joules come from
- where: `enCorridor` at dusk tint, a power cable leading away from the meter off screen; "?" chip.
- hi: Colin (annoyed) with smoke; lower third COLIN / Coal. Fossil fuel. Non-renewable. Chip "**fossil fuel**";
  a strata cutaway behind him with "300 million years".
- family: Colin with two family photos beside him: an oil drop "OIL" and a gas flame "NATURAL GAS"; chip
  "fossil fuels: coal, oil, natural gas"; a match lights Colin: "burn → **chemical store** released".
- station: `enPlant`, then a cutaway diagram: furnace → boiler with water turning to **steam** → `enTurbine`
  spinning → a generator (box with a coil) → wires. Labels on each as they are said.
- chain: the exact store chain builds as boxes: [**chemical** (fuel)] → [**thermal** (steam)] → [**kinetic**
  (turbine)] —**electrically**→ [the meter]. Store boxes in store colours; the last arrow is a pathway arrow (Pat
  rides it, badge `elec`).
- skip: three quick panels: `enWind` (kinetic store of moving air → turbine), a dam with falling water
  (gravitational store → turbine), `enSolar` with sunlight → "electricity, no turbine". Jules happy.
- reliable: Colin, smug for once; chips "reliable: day or night ✓", "a little fuel, a lot of energy ✓".
- but: Constance; chips "releases **carbon dioxide** (greenhouse gas → **climate change**) ✗" and
  "**non-renewable**: will run out ✗"; Colin's smoke drifts into a grey cloud labelled "CO₂".
- thcolin (TH): Colin confessional (`enConf(root,'colin')`), annoyed; a timeline bar: "300 000 000 years to make"
  vs a tiny sliver "20 minutes to burn".
- nuclear: Jules, hopeful, holding an atom icon; chip "low carbon dioxide ✓" … "so renewable?".
- uranium: `enStamp` "DENIED"; chip "nuclear fuel = **uranium**: mined, will run out → **non-renewable**".
- renew: two columns: NON-RENEWABLE (coal, oil, natural gas, nuclear) in red; RENEWABLE in green with seven icons
  appearing one by one as named: solar, wind, hydroelectric, tidal, wave, geothermal, biomass; chip "constantly
  replaced".
- horses: six horses (simple silhouettes) running with the initials S W H T W G B over them; the mnemonic "Six Wild
  Horses Took Wet Grass Back" builds with initials matching the seven renewables.
- unreliable: chips "little carbon dioxide ✓" then "unreliable ✗": the solar panel at night (moon, panel dark)
  and the wind turbine on a calm day (blades stopped).
- mix: Singapore skyline/HDB blocks with solar panels on the roofs; a big pie chip "mostly **natural gas**" and
  "+ solar on HDB roofs"; the word "**mix**".
- so: Kavya (bust) in the flat, thoughtful, looking at the meter through the open door.
- closed: office: Constance closes the case file; `enStamp` "CASE CLOSED"; the file shows "Destroyed: 0 J",
  "Wasted (dissipated as heat): lots".
- save: board: "Saving energy ≠ saving joules from vanishing" (strike) / "Saving energy = **wasting less**".
- how: three icons tick in: **insulate** (a house with loft insulation and double glazing), **efficient
  appliances** (an LED bulb and a fan with a high gauge), **switch off** (a TV with a red standby dot that
  goes dark).
- mum: Kavya, standing at the open front door, talking towards the meter, earnest; she switches off the aircon
  (cold lines stop).
- who: Mum's `enBubble` "Who are you talking to?" from the kitchen doorway; Kavya freezes (shock) and slowly looks
  at the camera. Hold the long pause.

## 7 traps: The firm saves you some marks
- intro: "6 EXAM TRAPS" heading over `enOffice`.
- t1–t6: quick confessional cuts, one per speaker (Constance, Pat, Theo, Effie, Colin, Jules), each with its
  trap on a card: 1 energy is never created or destroyed: transferred, not used up; 2 heat, light, sound and
  electricity are pathways, not stores (Pat's "I'M. NOT. A. STORE." chips again); 3 wasted energy dissipates
  into the thermal store of the surroundings; 4 efficiency is never more than 100%; 5 nuclear is non-renewable
  (uranium runs out); 6 energy is measured in joules (J), not watts or degrees. Cross out "W" and "°C" on t6.
- return: the show logo returns: "EVERY JOULE COUNTS will return".
- gerald (stinger): `enOffice` (or `enDoors`), the high shelf: Gerald, deadpan, nobody else on the shelf.
  Constance (below) looks up. In the 1.4 s silence Gerald blinks, then starts to tip.
- finally: Gerald (happy at last: years of potential) slides off the shelf and falls (gravitational → kinetic bars run
  in the corner, like the bubble tea), mouth open; lower third GERALD / Gravitational potential store. (finally).
- filed: THUD: screen shake, dust; `enStamp` "FILED"; Constance deadpan.
- mine: Theo pops up beside the dent, sad, a few orange dots floating off Gerald ("thermal + sound").
- worth: Gerald, on the floor, upside down or tilted, mouth: happy. "Worth it." Final frame holds: Gerald happy,
  logo small in the corner.

## Suggested split for the animators
- A: cold (done by the writer), stores, pat.
- B: tea, basement, review.
- C: supply, traps.

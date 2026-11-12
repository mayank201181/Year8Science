# BLOCK 34, Episode 9 "The Aircon Rule": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Heat & Temperature.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Read `script.py`: every line has a speaker (`who`), and its caption shows the speaker's name.

Premise: one sweltering June day in Kavya's HDB flat in Block 34, where it is 34 °C and Mum's rule says
the aircon only goes on after 9 p.m. The documentary is really about the things nobody notices: Jules
(thermal energy, a delivery courier who only ever goes hot to cold), Cel (the thermometer on the kitchen
wall, stuck on "34" all day), and the rest of the flat's tiny staff. Arc: 2 p.m. ice cube, 2:30 particles
and sweat, 3 p.m. lying on the floor tiles, 4 p.m. walking in the sun, 5 p.m. the freezing MRT, 9 p.m. the
aircon. Cel's number finally changes at the end (34 -> 25): that is the emotional payoff.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'cel'), mood, look })`.
  Vic never talks (he is a vacuum: no particles, no sound). In `traps.vic` his mouth may open and close
  silently (`talk: 0.5 + 0.5*sin`) while there is NO audio: that is the joke.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Cel goes `deadpan` at every silly remark, Jules `happy`, Woolly `sad` (until he is needed), Zip `shock`/`happy`,
  Ray `smug`, Gus `smug`/`neutral` (chill), Kavya `annoyed`/`deadpan`. Moods: neutral, happy, smug, annoyed,
  sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow
  push-in on Cel's deadpan face, Vic blinking, Woolly's lip wobbling, Kavya staring at the camera.
- **Talking heads** (line ids starting `th`, plus those marked TH below) use the confessional shot:
  `bkConfessional(root, kind)` full stage, the character big (s about 1.5) at about (430, 380), a prop where it
  helps. The first time a character appears in a confessional (or is introduced), show
  `scLowerThird(root, NAME, ROLE)` for about 3 s. Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **Running gags:** Cel always says 34 (his red column sits at 34 °C until `aircon.new`, where it slides to 25).
  Jules: "Hot to cold! Never the other way!" (give her a little road sign "HOT → COLD ONLY" on her bag strap
  when she says it). Zip: "Coming through!" (he streaks across the frame, `zoom: 1`). Woolly: "Nobody wants
  me in June." Ray: always on her phone, LIVE badge, "bestie". Kavya: deadpan looks at the camera.
- **Science on screen:** whenever a key word, number or unit is said it appears big and clear (chip, card or
  whiteboard): °C and J as real symbols, H₂O with a real subscript `tspan`. Arrows for energy flow are ALWAYS
  orange (C.heat) and ALWAYS point from the hotter thing to the colder thing. The jokes can be silly; the
  science must be exact. Particles: solid = touching, in rows, vibrating in place; liquid = touching but
  jumbled, sliding; gas = far apart, fast, straight lines between bounces (kit `particleBox`).
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px. Use `bkChip` for labels
  over the bright sets.

## Cast (lib.js `cast(root, kind, { s, mood })`, Kavya via the same call or `scKavya`)

| kind | who | look | lower third |
| --- | --- | --- | --- |
| cel | Cel, the thermometer on the kitchen wall: tired, dry, the straight man | glass tube on a nail, red bulb face, red column (`temp`) | CEL / Thermometer. Measures temperature. Not heat. |
| jules | Jules, thermal energy ("heat"): bubbly delivery courier, only goes hot to cold | orange glowing blob, flame hair, teal courier cap "J", delivery backpack | JULES / Thermal energy. Hot to cold only. |
| gus | Gus, a water particle: laid back, "bro" | red O with two white H ears, sunglasses on head (`ice`, `vib`) | GUS / Water particle. H₂O. Very chill. |
| zip | Zip, a free electron in a steel spoon: hyper, "Coming through!" | small electric-blue ball, lightning hair, "−" badge, red sneakers (`zoom`) | ZIP / Free electron. Lives in a spoon. |
| ray | Ray, infrared radiation: influencer, live from the Sun, "bestie" | deep-red wavy disc, wave tail, heart sunglasses, LIVE phone (`phone`) | RAY / Infrared radiation. Live from the Sun. |
| woolly | Woolly, a wool jumper: mopey, unwanted in June | rust knitted jumper, drooping sleeves, cream zig-zag band | WOOLLY / Wool jumper. Insulator. Unwanted. |
| vic | Vic, the vacuum in Kavya's flask: silent, steals the stinger | dashed outline, nothing inside but a face | VIC / A vacuum. Literally nothing. |
| kavya | Kavya, 12, the human: hot, exasperated, sharp | girl in PE shirt "8" (`scKavya`; full body `scKavyaBody`) | KAVYA, 12 / Lives in Block 34. Melting. |

Sets (lib.js): `bkLiving` (HDB living room: window with grilles, floor tiles, sofa, wooden coffee table,
ceiling fan, aircon high on the wall; `g.upd(t, { fan, ac })`), `bkKitchen` (Cel's nail at `g.CEL`, the fridge
with `g.freezer(p)`), `bkStreet` (HDB blocks, covered walkway that ends, the Sun, a car with a shiny sunshade),
`bkTrain` (MRT carriage, frosty vents). Props: `bkIceCube`, `bkGlass`, `bkSpoon`, `bkTea`, `bkPool`,
`bkFlask` (cutaway), `bkPhone`, `bkClock`, `bkRemote`, `bkLogo`, `bkChip`.

## 0 cold: Cold open (card: none)
- kavya: `bkLiving` (fan spinning lazily, `fan: 0.4`); Kavya (`scKavya`, s 1.3) slumped in front of the sofa,
  mood annoyed, `sweat: 1`; chips pop in: "Kavya, age 12", "June, Singapore", then a big "34 °C" (red, wobbling
  in heat shimmer, `heatWaves` above it).
- rule: Kavya talks to camera; lower third KAVYA. A hand-written note taped to the aircon (zoom to it):
  "AIRCON ONLY AFTER 9 P.M. — MUM" (with a heart). The aircon's LED is grey.
- soup: a `bkClock` reading "2:00 PM"; Kavya slides down a little (sweat 1), mood sad. Hold the pause on her face.
- block: cut outside: `bkStreet` blocks, push in on the "BLK 34" block; a big "34" chip beside it.
- dont: hard cut back to Kavya, deadpan into camera. Hold (pause 0.6).
- see: the camera drifts across the room in silence; the air shimmers; faint orange wisps flow from Kavya
  out into the room (all orange arrows point AWAY from her: her body is warmer than the room).
- move: one wisp swirls and gathers into a glowing orange ball.
- jules: it pops into Jules (`cast 'jules'`), happy, sparkles; lower third JULES. Chips "thermal energy" and
  "= heat" pop in.
- brand: a two-row card: "Jules (me)" / "joules, J (my unit)". The "J" on her cap glows. Jules smug.
- thcel (TH): `bkConfessional(root, 'cel')`; Cel (s 1.5), deadpan, red column at 34; lower third CEL.
  A "34 °C" readout beside him.
- thsigh (TH): small inset (top right, below the REC mark): Kavya walks past the thermometer, sighs; Cel
  `annoyed`. "I just read it out": Cel holds a tiny newsreader card "TODAY: 34 °C". Hold the pause.
- title: `bkLogo` pops in on a hot orange/red sunburst; "Episode 9: The Aircon Rule" fades in below; the whole
  cast pops in below in a row, bobbing (Kavya, Cel, Jules, Gus, Zip, Ray, Woolly, and Vic as a dashed outline
  that only shows up last). Hold it.

## 1 temp: Heat is not temperature
- ice: `bkKitchen`; the freezer door is open (`g.freezer(1)`), frost puffing out; Kavya (bust) holds a
  `bkIceCube` against her neck; clock chip "2:15 PM". Cel on his nail, deadpan.
- cold: Kavya happy, eyes shut, bliss. A dotted BLUE arrow labelled "cold?" flows from the ice into her neck,
  with a big "?" (this is the misconception: keep it dotted and questionable). Hold 1 s.
- no: hard cut to Cel, push-in, deadpan. The blue arrow cracks and falls off screen.
- out: Jules zooms out of Kavya's neck INTO the ice: a fat ORANGE arrow from neck to ice, labelled
  "thermal energy: hot → cold". Jules happy; a road sign "HOT → COLD ONLY" swings up.
- thing: card: "cold ≠ a thing" / "cold = less thermal energy". The ice cube visibly "eats" little orange
  sparks (Jules' parcels) as it starts to melt (`set(0.2)`).
- rob: Kavya annoyed, looks at the ice cube suspiciously. A tiny burglar mask appears on the ice cube.
- yes: Cel deadpan. Hold 0.7 s.
- mix: two big chips side by side, "HEAT" (orange) and "TEMPERATURE" (red), shuffling places.
- temp: the TEMPERATURE chip slides to Cel: card "TEMPERATURE = how hot · measured in °C · with a thermometer".
- heat: the HEAT chip slides to Jules: card "HEAT = thermal energy · a type of energy · measured in joules (J)".
- thdept (TH): Cel confessional, annoyed; two office door plates behind him: "TEMPERATURE (°C)" and
  "HEAT (J)". On "not even the same shape" a silhouette of Cel (tube) next to a silhouette of Jules (blob).
- tube: diagram: a big liquid-in-glass thermometer (bulb, thin tube labelled "capillary"); the bulb warms
  (orange glow) and the red liquid **expands** and climbs; label "liquid expands → rises up the tube".
- fixed: scale marks: "0 °C: pure water freezes" (ice icon), "100 °C: pure water boils" (steam icon); a red
  pointer stuck at "34" with a sad little "stuck" sticky note. Cel sad.
- equal: kitchen: neck and ice cube with an orange arrow that shrinks; two mini thermometers converge to the
  same reading; card "same temperature = thermal equilibrium"; the arrow disappears (no more flow).
- gone: the ice cube is a puddle (`set(1)`); Kavya deadpan into camera. Hold 0.5 s.
- thjules (TH): Jules confessional (`bkConfessional(root, 'jules')`), happy, holding up a scroll "CONTRACT:
  hot → cold. Never cold → hot." A road sign with a one-way arrow. Hold.

## 2 party: The particle party (showpiece: the ice melting into a liquid, particle by particle)
- zoom: documentary zoom: from Kavya's `bkGlass` of iced water into one ice cube (reticle, "ZOOM ×1 000 000").
- every: a lattice of red-and-white water particles (`molH2O`, in rows); chip "particles: always moving".
- gus: one particle in the lattice turns to camera: Gus (s 1.2) in the lattice, `ice: 1`, `vib: 0.3`; lower
  third GUS. Chip "H₂O" (real subscript).
- solid: the lattice vibrates in place (`particleBox` 'solid' style); label "SOLID: vibrate in fixed places".
  Inset: a hawker-centre queue of tiny people jiggling impatiently in a line. Gus deadpan.
- here: Jules rides in from the left on a delivery scooter (or just zooms), orange sparks spraying from her bag.
- faster: the sparks hit the lattice; every particle vibrates faster (`vib` up to 1); Gus shock, then happy.
- ke: chip "kinetic energy = energy of movement"; a meter "particle speed" rises. The lattice breaks apart
  into a jumbled, sliding liquid (`particleBox` solid -> liquid).
- liquid: label "LIQUID: close together, slide past each other"; Gus slides around happily (`ice: 0`).
- total: Cel appears in a corner inset (on his nail), deadpan. Over the particles: every particle gets a small
  speed bar; the bars stack up into one tall bar labelled "THERMAL ENERGY = total kinetic energy of ALL the
  particles".
- rude: Jules, offended, then shrugs (smug). Hold 0.5 s.
- average: the tall bar is replaced by a level line through the middle of the small bars: "TEMPERATURE =
  average kinetic energy".
- quiz: split screen: left `bkTea` "80 °C", right `bkPool` "30 °C"; a big "?" between them. Hold 0.8 s.
- pool: inside each: the tea has a FEW fast particles (long speed lines), the pool MANY slower particles; the
  thermometers read 80 and 30; then a "thermal energy" bar under each: the pool's bar is huge, the tea's short.
  Labels "hotter" (tea) and "more thermal energy" (pool).
- got: Kavya (bust), thinking; her line appears as a card: "tea: hotter (temperature) · pool: more heat".
- correct: Cel, deadpan but impressed; a little gold star sticker slaps onto Kavya's card. Hold.
- sweat: Kavya's arm, close up, with a big sweat drop; zoom in: Gus inside the drop of liquid, waving. A
  "?" and "Don't ask how" shrug.
- escape: inside the drop: particles at different speeds (speed lines); the fastest ones at the surface fly
  OUT into the air (Gus among them, happy, "Later!"); label "EVAPORATION: the fastest particles escape".
- cooler: the slow particles left behind get a bluer tint; an "average speed" meter drops; a thermometer on
  the drop falls a little; card "evaporation cools: sweating cools you".
- thgus (TH): Gus confessional, happy, sunglasses down over his eyes for a second then back up; behind him
  gas particles far apart, zipping in straight lines and bouncing. Label "GAS: far apart, moving freely".
  Lower third not needed again.

## 3 floor: The floor is the coolest
- three: `bkLiving`; Kavya (`scKavyaBody`, rotated to lie flat) spread-eagled on the floor tiles like a starfish;
  clock chip "3:00 PM".
- floor: Kavya (bust, lying sideways, head on the tiles) mood happy; "I live here now": she hugs a tile.
- same: Cel inset (kitchen wall): thermometers pop onto the tiles, the sofa and the wooden table: all read
  "34 °C". Chip "same temperature".
- why: Kavya, confused (looks from tiles to table).
- cond: big chip "CONDUCTION: energy through solids".
- pass (showpiece): a close-up cross-section of skin touching tile: a row of skin particles (warm pink) jiggling
  fast, touching a row of tile particles (grey) in a lattice; each particle bumps its neighbour and the
  vibration passes along, left to right; Jules (small) hops from particle to particle. Label "particle to
  particle: neighbour to neighbour". The particles stay in place.
- gossip: inset: a hawker centre seen from above: tables in rows, a speech bubble "psst" passing from table to
  table across the room while nobody gets up. Jules happy. Hold.
- better: back to the floor: a thick orange arrow from Kavya's back INTO the tiles (fast) vs a thin orange
  arrow from her hand into the wooden table (slow); labels "tile: better conductor" and "wood: poor conductor";
  card "the chill = your own thermal energy leaving".
- metals: pan to a steel `bkSpoon` on the floor by Kavya's head; chip "METALS: best conductors".
- zip: Zip streaks out of the spoon (`zoom: 1`) and screeches to a halt; lower third ZIP; chip "free electron".
- free: inside the spoon: a metal lattice (grey ions in rows) with tiny blue electrons (`zoom`) racing through
  the gaps from the hot end to the cold end, carrying orange sparks; a slower "vibration" wave crawls along the
  lattice behind them. Labels "free electrons: fast" and "vibrations: slow".
- thzip (TH): Cel confessional, deadpan; Zip jitters in a corner inset with seven tiny coffee cups. Hold 0.7 s.
- shiny: Kavya (bust), pointing at the shiny spoon; a sparkle on the spoon; chip "shiny?" with a "?".
- look: Zip poses (smug), sparkles; then the "shiny" chip gets a red cross and "free electrons" a green tick.
- insul: a shelf of insulators, each with a label: a wooden spoon "wood", a plastic plate "plastic", a ball of
  yarn "wool", and an empty frame with dotted air particles "air"; header "INSULATORS: slow thermal energy down".
- woolly: pan up to a dark cupboard; the door creaks open: Woolly, folded on the shelf, sad; lower third
  WOOLLY. A cobweb. Hold 1 s on his face.

## 4 ray: Ray goes live
- four: `bkStreet`; Kavya (`scKavyaBody`, `walkPose`) walks out from under the covered walkway past the
  "SHELTER ENDS HERE" sign into the sun; clock chip "4:00 PM". She wears a black T-shirt in this chapter
  (recolour her shirt: the elements with fill #2E7DD8 in scKavya / scKavyaBody -> #232323).
- attack: Kavya (bust), sweat 1, squinting at the sky; mood annoyed.
- ray: whip-pan to the Sun: Ray zooms down a beam (`cast 'ray'`), phone up, smug; lower third RAY.
  Phone `bkPhone` hearts counting up.
- waves: Ray's tail becomes a long sine wave (`sineWave`, deep red) from the Sun to Kavya; label
  "infrared = electromagnetic waves (like light)"; a "you can't see me" eye icon with a slash, and a "feel" hand
  with orange glow.
- vacuum: diagram: the Sun on the left, Earth on the right, black space between; label "VACUUM: no particles";
  the wave crosses it; chip "radiation: the only way to cross a vacuum".
- thray (TH): Cel confessional, deadpan; inset: the Sun-Earth diagram with "150 million km"; conduction and
  convection icons (a particle chain, a swirl) both with red crosses at the edge of space: "no particles".
  Ray waves in the background, smug.
- all: everything in the street gets a faint red infrared glow: the road, a bus, Kavya; label "everything gives
  off infrared"; then the hotter road glows MORE; chip "hotter → more radiation".
- me: Kavya (bust), shock, looks down at her glowing arms.
- glow: Ray happy, a heart pops on the phone. Kavya deadpan. Hold 0.5 s.
- shirt: close-up of Kavya's black T-shirt. Ominous zoom. Ray smug. Hold 0.8 s.
- dark: diagram: wave arrows hitting a dark matt panel: all absorbed (the panel glows hot orange); label "dark,
  matt: best absorber AND best emitter". A second arrow set leaving it ("emits").
- shiny: wave arrows hitting a shiny silver panel and bouncing off; label "light, shiny: poor absorber, poor
  emitter → reflects". Ray annoyed at the shiny panel.
- shade: the parked car (`g.car`): a close-up of its shiny windscreen sunshade bouncing the waves away; label
  "shiny sunshade reflects radiation". The glint flashes.
- wrong: Kavya (bust) looks down at her black shirt, deadpan. Hold.
- drinks: Ray's phone fills the screen: "Dark Drinks, Shiny Reflects" as a caption; hearts and a "LIKE &
  SUBSCRIBE" button. Ray happy.

## 5 flask: Woolly and the flask
- five: `bkTrain` (frosty vents, `g.upd`); Kavya (bust) in a seat, shivering; clock chip "5:00 PM"; a vent sign
  reading "ARCTIC MODE" with a snowflake.
- freeze: Kavya annoyed, teeth chattering (small horizontal jitter), frost on her hair tie.
- mum: Mum's hand-written note on the bag: "Bring a jumper! — Mum ♥". Woolly pops out of the bag.
- needed: Woolly (happy, eyes glistening), lower third not again; tiny sparkles. Hold 0.8 s.
- warm: Kavya wearing Woolly (draw Woolly behind her bust, sleeves over her shoulders), mood happy.
- notwarm: Woolly, earnest: chip "insulators add NO heat" with a red cross over a little flame.
- trap: close-up of the wool fibres: a tangle of strands with air particles trapped in the pockets, barely
  moving; Jules (small) tries to push through slowly; label "trapped air: great insulator".
- slow: Jules in slow motion, sweating, inching through the fibres; "SLOW" sign. Hold 0.4 s.
- flask: Kavya's `bkFlask`; push in; it turns into the cutaway (`set(1)`). Labels around it appear later.
- vic: in the gap between the two walls, Vic fades in (dashed outline, `cast 'vic'`, s about 0.35 so he fits the
  gap; or pull him out big beside the flask); lower third VIC. He blinks. Nothing else. Hold 0.8 s.
- blocked: label "vacuum: no particles → no conduction, no convection"; Jules bounces off the outer wall,
  dizzy, again and again (three tries, mood annoyed).
- silver: Ray on Kavya's phone screen (small inset); red wave arrows hit the silvered wall and reflect back;
  label "silvered walls reflect radiation".
- stopper: the stopper highlights; label "stopper: stops warm air getting in at the top (convection)"; tiny
  warm-air swirls blocked above it.
- soup: Kavya (bust), realisation; a thought bubble: the same flask full of steaming soup.
- both: split: left flask with soup, orange arrows trying to get OUT (blocked); right flask with iced water,
  orange arrows trying to get IN (blocked); chip "slows energy flow both ways". Jules happy.

## 6 aircon: Nine p.m.: the aircon goes on (showpiece: the convection current loop)
- nine: `bkLiving`, evening (darken the window sky, warm lamp); `bkClock` "8:59"; Kavya on the sofa holding
  `bkRemote` like a weapon, staring at the clock.
- count: Kavya counts down, deadpan to camera; the clock flips to "9:00" on "One".
- on: she presses; the aircon LED goes green, the flap opens (`ac: 1`); a triumphant "ding". Kavya happy.
- expand: Cel (on his nail, inset) explains; diagram: a block of particles heats (orange glow) and the
  particles spread further apart; the block grows; label "heated → particles move faster, further apart →
  EXPANDS".
- mass: two side-by-side blocks on a balance: before (small) and after (bigger): the balance stays LEVEL;
  labels "volume ↑" and "mass: SAME". Hold.
- order: three bars "gas" (longest), "liquid", "solid" (shortest): "how much they expand"; Gus (gas particle)
  stretches out happily.
- bridge: a bridge (or road) with an expansion gap (interlocking teeth); a sun heats it and the gap closes a
  little without buckling; label "expansion gap: no buckling".
- dense: two air parcels: a warm, spread-out one (orange, fewer particles in the same box) labelled "less dense
  → rises", and a cold, crowded one (blue) labelled "denser → sinks".
- loop (showpiece): the room in cross-section: cold blue air pours down from the aircon (high on the right),
  spreads across the floor, warms (turns orange), rises on the left, drifts back across the ceiling to the
  aircon, cools, and sinks again: a full circulating loop of arrows with Gus riding it, waving.
- current: label "CONVECTION CURRENT"; chip "only in fluids (liquids and gases): they can flow".
- zip: Zip bounces in, happy, pleading (hands together would be nice: just bounce).
- nozip: Cel deadpan; Zip's spoon appears with a label "solid: can't flow"; a red cross over a swirl.
- sad: Zip shuffles slowly out of frame (`still`, sad), no speed lines. Hold 0.6 s.
- rises: Kavya (bust), confident. Freeze. Hold 1 s: Cel's slow push-in, deadpan.
- warmair: a correction card: "heat rises ✗", "it's lighter ✗", "WARM AIR rises because it is LESS DENSE ✓".
- high: the room again: the aircon high on the wall, cold air sinking and sweeping across the whole room;
  label "aircon high up: cold air sinks".
- new: Cel's confessional: the red column slides from 34 down to 25 (`temp`); Cel's eyes glisten (sad -> happy);
  a "25 °C" readout. Hold 0.8 s.

## 7 traps: The residents save you some marks
- intro: `bkLogo` small at the top; heading "7 EXAM TRAPS".
- t1–t7: quick confessional cuts, one per speaker (Cel, Jules, Zip, Gus, Ray, Woolly, Kavya), each with its
  trap on a card (red cross for the wrong idea, green tick for the right one):
  1 heat (J) ≠ temperature (°C); 2 hot → cold, never cold → hot, cold does not flow; 3 metals conduct because of
  free electrons, not because they are shiny; 4 convection needs a fluid, warm fluid rises because it is less
  dense, not "lighter"; 5 radiation needs no particles, crosses a vacuum; shiny = poor absorber; 6 insulators
  add no heat, they slow the transfer; 7 expansion: volume up, mass the same. On "Yes. I was listening." Kavya
  smug.
- return: the logo returns: "BLOCK 34 will return".
- vic: Vic's confessional (`bkConfessional(root, 'vic')`): long silence; his mouth opens and closes, no sound
  (hold the 1.6 s); a caption chip "(no sound)".
- cant: Jules leans into frame, explains; chip "sound needs particles". Vic blinks.
- best: Cel (inset or cut), happy for the first time. Final frame: Vic waving silently, the logo. Hold.

## Suggested animator split
- A: cold (done by the writer), temp, party.
- B: floor, ray.
- C: flask, aircon, traps.

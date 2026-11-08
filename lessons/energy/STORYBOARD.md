# Energy: storyboard

What the screen shows for every narration line of `lessons/energy/script.py`.
Eleven chapters, 120 lines, 13.8 minutes.

**Look and palette.** Energy itself is always the yellow `spark()`. Energy that is being wasted
turns orange (`C.heat`) and, as it dissipates, spreads out and fades. Each of the eight stores has
one colour and one icon, used in every chapter:

| Store | Colour | Icon |
| --- | --- | --- |
| kinetic | `C.water` cyan | a ball with speed lines |
| gravitational potential | `C.good` green | a book on a shelf, with an up arrow |
| elastic potential | `C.lactic` pink | a coiled spring |
| chemical | `C.glucose` amber | a battery |
| thermal | `C.heat` orange | rising heat waves |
| nuclear | `C.ethanol` violet | a glowing nucleus |
| electrostatic | `C.air` pale blue | + and − charges |
| magnetic | split red and blue, like kit `magnet()` | a bar-magnet outline marked N and S |

**Shared art** lives in `lessons/energy/lib.js`. Use these helpers rather than redrawing them; the
header of that file gives every option.
- `EN`: the stores in mnemonic order (`EN.order`), each store's colour, name and letter
  (`EN.store[kind]`), the useful and wasted colours (`EN.useful` yellow, `EN.wasted` orange), the
  pathway labels, and the resource lists `EN.nonRenewable` and `EN.renewable`.
- `enBadge(parent, kind, o)`: a store badge (disc about 44 px radius, white icon, 26 px label).
  `set({ flip, glow, label })`; `flip` turns it over like a coin to its letter face, for the
  gorillas showpiece.
- `enJar(parent, kind, o)`: kit `beaker()` filled with the store's colour, its badge on the front.
  `set(level)`, plus `mouth` and `surface(level)` for spark paths in and out.
- `enSparkFlow(parent, pts, o)`: sparks along a path, yellow or (`color: EN.wasted`) orange.
  `set(t, amount)` gives a steady stream; `batch(p)` sends one batch from one jar to another.
- `enPathway(parent, kind, x1, y1, x2, y2, o)`: `'mech'`, a white lib `arrow()` pushed by a hand;
  `'elec'`, kit `wire()` with moving current dots; `'heat'`, an orange arrow carrying `heatWaves()`;
  `'rad'`, a travelling wave in kit `sineWave()`'s stroke that tapers into an arrowhead (`wave:`
  `'light'` yellow, `'ir'` orange, `'sound'` white). Each has an optional label chip.
  `set(p)` draws it in; `upd(t)` runs its motion.
- `enFlowChain(parent, items, o)`: an energy flow diagram, boxes edged in store colours with arrows
  between (conservation.flow, generating.chain). `set(p)` builds it box by box.
- `enDissipate(parent, w, h, o)`: orange sparks spreading thinly through a room as it takes a faint
  warm tint (what.useup, wasted.dissipate, recap.t1, quiz.a5). `set(p, t)`.
- `enSankey(parent, o)`: a Sankey diagram whose band widths show energy; useful carries straight on,
  wasted peels off downwards. `set({ grow, split, useful, labels })`; `geo` gives the band edges
  for the width bracket.
- `enGrid100(parent, o)`: the 100-square grid (efficiency.percent and rest, quiz.a3).
  `set({ useful, wasted })`.
- `enBulb(parent, 'filament' | 'led', o)`: the light bulbs (wasted, efficiency, generating.appliances,
  quiz.q5). `set(on)`.
- `enResource(parent, kind, o)`: the 11 resource icons: coal, oil, gas, uranium, solar, wind, hydro,
  tidal, wave, geothermal and biomass (resources, recap.horses, recap.t4, quiz.q4). `upd(t)` adds
  idle motion.

---

## intro: Where does all the energy go?
A fast montage, then a sealed "universe" counter. No chapter card.
- **hook**: four vignettes in turn: a beating heart, a lightning bolt (lib `bolt()`), a rocket
  lifting off, kit `sun()` shining; sparks stream out of each into the next.
- **never**: **Showpiece**: two counters, "joules created: 0" and "joules destroyed: 0", stay frozen
  at zero while sparks keep moving around them.
- **where**: a phone's battery jar drains; its sparks drift off into the room; a big "?".
- **plan**: roadmap chips: "8 stores" (a row of badges), "4 pathways" (four arrows), "efficiency",
  "saving".

## what: What energy is
Everyday things happening, then units, then the law of conservation as a balance.
- **happen**: a ball rolling, a kettle steaming, a speaker pulsing, a lamp glowing, a seedling growing
  (kit `leaf()`); a spark pops at each.
- **joules**: a big chip "J = joule" and a name card "James Joule".
- **apple**: an apple lifts up beside a metre rule from 0 to 1 m; chip "about 1 J".
- **kilo**: a "1 kJ" block breaks into a grid of 1000 tiny dots labelled "1000 J".
- **banana**: a banana beside a food label reading "about 400 kJ".
- **law**: title card "law of conservation of energy" over a level balance.
- **cannot**: "created" and "destroyed" are struck out (`strike()`); "transferred" lights up as
  sparks pour from one jar into another.
- **total**: **Showpiece**: two jars swap their sparks back and forth while a "total" counter above
  them never changes.
- **useup**: the phone battery jar empties: some sparks go out as light and sound (useful, yellow),
  the rest as warmth into the room (orange); the total counter is unchanged.
- **machine**: an overbalanced "perpetual motion" wheel turns, slows and stops; a `cross()` and the
  word "impossible".

## stores: The eight energy stores
Each store gets a short vignette, then its badge drops into a 4 × 2 grid that builds across the
chapter.
- **stores**: two jars; sparks move out of one and into the other; label "stores".
- **kinetic**: a runner (kit `person` with `runPose`) and a car with speed lines; the kinetic badge
  lands in the grid; chip "faster, heavier: more".
- **grav**: a book on a high shelf with a height arrow, then water behind a dam; the gravitational
  badge lands.
- **elastic**: a drawn bow, then a squashed spring; the elastic badge lands.
- **chemical**: food, a fuel can and a battery; the chemical badge lands.
- **thermal**: a hot drink with `heatWaves()` steam and jiggling kit `particleBox` particles; the
  thermal badge lands.
- **nuclear**: an atom whose nucleus glows, and a small kit `sun()`; the nuclear badge lands.
- **electro**: a charged balloon covered in + and − signs, then a thundercloud; the electrostatic
  badge lands.
- **magnetic**: two kit `magnet()`s held apart, straining towards each other; the magnetic badge
  completes the grid.
- **gorillas**: **Showpiece**: the eight badges flip over to show K, G, E, C, T, N, E, M, and the
  words of the mnemonic grow out of the letters.
- **list**: each badge flips back and pulses as its store is named.
- **groups**: the badges slide into three groups: "movement" (kinetic, thermal), "inside matter"
  (chemical, nuclear), "position or shape" (gravitational, elastic, electrostatic, magnetic).
- **lightning**: a thundercloud fires a lib `bolt()`; its electrostatic jar empties in a flash;
  chip "about 1 billion J".

## pathways: Four ways energy is transferred
Two jars, left and right, with a pathway arrow between them that changes style for each pathway;
a four-row legend builds on the right.
- **pathway**: the two jars and a plain arrow labelled "transfer pathway"; chip "4".
- **mech**: a foot kicks a ball: a white force arrow ("mechanically") carries sparks into the
  ball's kinetic jar.
- **elec**: a charger cable, kit `wire()` with current dots, runs from a socket into a phone; its
  chemical jar fills. Label "electrically".
- **heating**: a hob under a pan: an orange arrow with `heatWaves()` from the hot hob to the cooler
  pan, whose thermal jar fills. Label "by heating".
- **rad**: kit `sun()` sends yellow waves to a person; a speaker sends white sound waves to an ear.
  Label "by radiation".
- **merh**: the legend's rows light up with their letters: M, E, R, H.
- **where**: a split card: "Stores = where" (jars) and "Pathways = how" (arrows).
- **notstores**: the words "heat", "light", "sound" and "electricity" try to drop into jars, bounce
  off (`cross()`), and settle on the arrows instead (`tick()`).
- **kettle**: a kettle on its base: current dots flow from the socket to the element; label
  "electrically".
- **water**: **Showpiece**: the element glows; orange heat flows into the water, the thermal jar
  fills, and lib `bubbles()` rise as it comes to the boil.

## conservation: Conservation of energy
A tall drop zone on the left with a ball and a height scale, two jars (gravitational green, kinetic
cyan) and a "total" bar; then a flow diagram, a wind-up toy, a roller coaster and a pendulum.
- **before**: a balance with "total before" on one pan and "total after" on the other, level.
- **ball**: a ball held high beside the height scale; the gravitational jar is full, the kinetic jar
  empty.
- **falls**: the ball falls, speeding up; sparks flow from the gravitational jar into the kinetic jar
  while the total bar stays level; just before landing, nearly all are kinetic.
- **hits**: the ball hits the ground: white sound waves ring out and an orange glow spreads at the
  impact; the kinetic jar empties into a thermal jar.
- **flow**: the energy flow diagram builds left to right: "gravitational potential" → "kinetic" →
  "thermal + sound".
- **toy**: a wind-up toy walks: the elastic jar of its spring empties into kinetic, with a little
  orange thermal at its feet.
- **coaster**: a roller-coaster track; the car waits at the top of the first hill with a full
  gravitational jar.
- **swap**: **Showpiece**: the car races down and climbs the next hill; the two jars swap levels in
  step with its height: kinetic fullest at the bottom, gravitational at the top.
- **lower**: every later hill is lower than the first; a thin orange trickle from wheels and air
  fills a thermal jar.
- **pendulum**: a key on a string swings; "gravitational" lights at each end of the swing, "kinetic"
  at the bottom; the jars swap.
- **slows**: the swings shrink, the thermal jar slowly fills, and the key comes to rest.

## wasted: Useful and wasted energy
A device box with sparks in and out; then the filament bulb; then a whole room filling with
spread-out warmth; then friction.
- **useful**: sparks flow into a device box; the ones leaving on the useful side stay yellow and are
  labelled "useful".
- **wasted**: the rest turn orange and leave towards a label "thermal store of the surroundings".
- **bulb**: an old filament bulb switches on, glowing and shimmering with `heatWaves()`.
- **tenth**: ten sparks enter: one leaves as yellow light, nine as orange heat; chip "1/10 useful".
- **led**: an LED bulb beside it: far more of its sparks leave as light, far fewer as heat.
- **vanish**: the orange sparks don't disappear; a counter beside them stays the same.
- **dissipate**: **Showpiece**: the orange sparks drift out across the room, spreading thinner and
  thinner until they become a faint, even warm tint over the whole room.
- **hard**: a jar on a stick tries to scoop up the thin warmth and catches almost nothing; label
  "very hard to reuse".
- **friction**: two rough surfaces slide: kinetic sparks turn orange where they rub; air-resistance
  streaks curl round a cyclist.
- **hot**: a drill bit and a bicycle brake disc glow orange.
- **rub**: two hands rub together and the palms glow orange; label "kinetic → thermal".

## efficiency: Efficiency and Sankey diagrams
The formula card sits at the top; a motor and a 100-square grid below for the worked example; then
a large Sankey diagram fills the stage.
- **what**: a device with sparks in: yellow useful out of the front, orange wasted out of the side;
  a dial labelled "efficiency".
- **formula**: the formula card types in: "efficiency = useful energy transferred ÷ total energy
  supplied".
- **uot**: "Useful" over a fraction bar over "Total"; U, O and T glow.
- **motor**: a motor with "200 J" in and "150 J" out as a spinning wheel (kinetic).
- **calc**: "150 ÷ 200 = 0.75" builds; a number line from 0 to 1 puts a marker at 0.75.
- **percent**: "× 100" turns it into "75%"; a 100-square grid fills 75 squares yellow.
- **rest**: the other 25 squares turn orange: "50 J wasted (25%)".
- **never**: a gauge to 100% whose needle always stops short; label "always some waste", with an
  orange heat wisp.
- **check**: a result "efficiency = 120%" gets a `cross()`; chip "energy out ≤ energy in".
- **sankey**: **Showpiece**: a wide arrow grows in from the left; a bracket labels its width
  "amount of energy".
- **branch**: the arrow splits: the useful part carries straight on, the wasted part peels off
  downwards in orange.
- **fat**: two Sankeys side by side: a filament bulb (thin useful, fat wasted, "inefficient") and a
  device with a thin wasted branch ("efficient").

## resources: Renewable and non-renewable resources
Two columns, "non-renewable" (left, greys and browns) and "renewable" (right, greens), each filling
with icons; pros get `tick()` chips, cons `cross()` chips.
- **resource**: a plug and a pylon; title "energy resources"; two empty columns appear.
- **nonrenew**: a fuel gauge over the left column sinks towards empty.
- **fossil**: coal lumps, an oil barrel and a gas flame, bracketed "fossil fuels", then a glowing
  uranium fuel rod.
- **pros**: tick chips: "reliable", "on demand", "lots of energy from a little fuel".
- **cons**: a chimney puffs CO₂ molecules (lib `molCO2()`) up into a warming globe; cross chips
  "climate change", "pollution", "will run out".
- **nuclear**: the uranium rod is pinned firmly in the non-renewable column; chip "low-carbon, but
  non-renewable".
- **renew**: the right column gets a looping "replaced" arrow and a chip "little or no CO₂".
- **seven**: the seven `enResource` icons pop in, in mnemonic order: solar (with a kit `sun()`),
  wind, hydro, tidal, wave, geothermal and biomass.
- **horses**: **Showpiece**: the seven icons line up under S, W, H, T, W, G, B as the mnemonic
  forms, while a horse silhouette gallops across.
- **rcons**: day turns to night and the solar panel stops; the wind drops and the turbine stops.
- **space**: a huge solar farm, a dam flooding a valley, a "£££" build-cost tag and a disturbed
  habitat icon.
- **mix**: an energy-mix bar made of several resources, balancing three weights: reliability, cost,
  carbon.
- **debate**: the uranium rod on a balance: "low-carbon" on one side, a radioactive-waste drum
  "dangerous for thousands of years" on the other.

## generating: Generating electricity and saving energy
A power-station cutaway runs across the stage: furnace or reactor → boiler → steam pipe → turbine →
generator → pylons. Then three other sources, then a house for the saving tips.
- **turbine**: a turbine's blades spin, turning a generator; a lib `bolt()` icon lights at its output.
- **steam**: the furnace burns, the boiler water turns to steam, and the steam jets past the turbine,
  which spins faster.
- **chain**: **Showpiece**: store badges travel along the cutaway: chemical (amber) or nuclear
  (violet) at the furnace → thermal (orange) in the steam → kinetic (cyan) at the turbine.
- **generator**: the generator sends kit `wire()` current dots along the pylons to a house; label
  "electrically".
- **wind**: a wind turbine: moving air with a kinetic badge turns the blades directly; a struck-out
  "steam" chip.
- **hydro**: a dam: water falls from a high reservoir (gravitational badge) through a turbine.
- **solar**: solar cells under kit `sun()` turn light straight into current dots; chip "no turbine".
- **save**: the power station's chimney and a waste-heat cloud; heading "saving energy".
- **mean**: chip "stop energy vanishing" gets a `cross()`; chip "waste less fuel and electricity"
  gets a `tick()`, with a fuel can and a bill.
- **insulate**: a house cross-section (same style as the Heat lesson's insulation chapter): loft
  insulation, double glazing and draught strips appear, and the orange escaping arrows shrink.
- **appliances**: an LED bulb and a fridge with an energy-label sticker; ticks.
- **switch**: a TV with a glowing standby light is switched off at the wall; tick.
- **benefits**: three chips: "saves money" (a coin), "resources last longer" (a fuel gauge), "less
  CO₂" (a shrinking CO₂ molecule).

## recap: Recap: memory hooks and exam traps
Respiration's recap layout: memory-hook cards, then numbered traps with `tick()` and `cross()`.
- **lock**: title "Lock it in" with a padlock clicking shut.
- **gorillas**: **Showpiece**: the eight store badges cascade into a row under "Kind Gorillas Eat
  Chocolate, Tigers Never Eat Mango".
- **merh**: the four pathway arrows, lettered M, E, R, H.
- **uot**: the fraction "Useful / Total".
- **horses**: the seven renewable icons under "Six Wild Horses Took Wet Grass Back".
- **traps**: heading "5 exam traps" with a warning triangle.
- **t1**: "1": sparks spreading into a room, chip "dissipated, not destroyed".
- **t2**: "2": the words heat, light, sound, electricity sitting on arrows (tick), not in jars (cross).
- **t3**: "3": a 120% result crossed out; a 75% result ticked.
- **t4**: "4": the uranium rod in the non-renewable column.
- **t5**: "5": "J" ticked; "W" and "°C" crossed.

## quiz: Quick-fire quiz
Respiration's quiz layout: a question card, a lib `ring()` counting down through each 4 s pause,
then the answer with a `tick()`.
- **intro**: title "Quick-fire quiz!" with five dots for the questions.
- **q1**: a ball on a shelf with two empty jars; ring.
- **a1**: the ball falls; the gravitational jar empties into the kinetic jar.
- **q2**: the word "electricity" hovering over a jar; ring.
- **a2**: it bounces onto an arrow: "pathway".
- **q3**: a motor with "400 J" in and "300 J" useful out; ring.
- **a3**: **Showpiece**: "300 ÷ 400 = 0.75" and the 100-square grid filling 75 squares: "75%".
- **q4**: a uranium rod between the two columns; ring.
- **a4**: it drops into the non-renewable column.
- **q5**: a bulb shedding orange sparks; ring.
- **a5**: the sparks spread thinly through a room: "thermal store of the surroundings".
- **outro**: "Brilliant work!" and a chip "Energy quiz" pointing to the Science Lab.

---

## Suggested animator split

Chapter lengths from `timeline.json`: intro 27 s, what 68 s, stores 92 s, pathways 72 s,
conservation 91 s, wasted 72 s, efficiency 85 s, resources 99 s, generating 91 s, recap 55 s,
quiz 77 s.

| Group | Chapters | About | Notes |
| --- | --- | --- | --- |
| 1 | intro, what, stores | 3.1 min | Badges, jars and spark flows from `lib.js`; the gorillas flip is `enBadge`'s `flip`. Medium. |
| 2 | pathways, conservation, recap | 3.6 min | Pathway arrows, falling ball, roller-coaster swap; the recap reuses badges and arrows. Hard. |
| 3 | wasted, efficiency, quiz | 3.9 min | Bulb, dissipation, 100-square grid and Sankey; the quiz reuses the grid and jars. Medium. |
| 4 | resources, generating | 3.2 min | Many icons and the power-station cutaway. Medium-hard. |

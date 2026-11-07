# Heat & Temperature: storyboard

What the screen shows for every narration line of `lessons/heat/script.py`.
Twelve chapters, 132 lines, 14.3 minutes.

**Look and palette.** Hot is `C.heat` orange (deepening to `C.bad` red when very hot), cold is
`C.water` / `C.air` blue. Energy is the yellow `spark()`. A flow of thermal energy is always an
orange `arrow()` with `heatWaves()` riding on it, pointing from hot to cold. Infrared radiation is
kit `sineWave()` drawn in `C.heat`. Particles are kit `particleBox()` balls, tinted blue (slow) to
orange-red (fast). Metal is the `C.carbon` greys; free electrons are small `C.air` dots.

**Shared art.** No `lessons/heat/lib.js`: each new piece belongs mainly to one animator group,
but four pieces recur, so draw them to these specs in every chapter that uses them:
- *Floor slab* (intro, conduction): a floor seen at a low angle, left half blue-grey ceramic tiles
  on a grid, right half honey-brown wooden planks with grain lines; a bare foot about 160 px long.
- *Metal bar* (conduction, expansion): a 700 × 70 grey bar with a row of 12 particles inside;
  `bunsen()` under its left end.
- *Vacuum flask* (insulation, quiz): a tall cross-section like the "Inside a vacuum flask" bonus
  diagram in `lib/extras/heat.ts`: outer case, silvered double wall with a gap, stopper, red drink.
- *Mini panels* (radiation, recap): three small cards, conduction bar, convection loop, sun waves,
  like the "Three ways heat travels" bonus diagram.

---

## intro: Same temperature, different feel
The floor slab fills the lower stage; above it, two lib `thermometer()`s. No chapter card.
- **hook**: the bare foot steps onto the tiles: blue shiver lines and a frosty glow; then it steps
  onto the wood: a soft warm glow. Labels "tiles" and "wood" (kit `labelLine`).
- **same**: a `thermometer()` rises on each floor to the same level; chips "20 °C" and "20 °C"
  with a large "=" between them. **Showpiece**: the two columns climbing in step.
- **def**: the floor slides down; the word "heat" appears with an orange `arrow()` from a red-hot
  block to a blue cold block, `heatWaves()` riding along it.
- **plan**: roadmap: chips "conduction", "convection", "radiation" pop in a row, then a small
  vacuum-flask icon labelled "trap it".

## temp: Heat is not the same as temperature
Two-column card layout ("Temperature" left, "Heat" right), then the sparkler-and-bath set piece,
then two blocks for the golden rule.
- **mix**: the words "heat" and "temperature" tumble and overlap, then slide apart into two columns.
- **temp**: left column: a `thermometer()` rises; label "how hot"; unit chip "°C".
- **heat**: right column: a yellow `spark()` with label "thermal energy"; unit chip "J (joules)".
- **spark**: columns fade. A sparkler fizzes (orange-white sparks scattered with `rng`); one spark
  drifts onto an outline hand; tag "1000 °C+"; a tiny `meter()` beside it shows almost no energy.
- **bath**: right side: a bathtub of `C.water` water with gentle `heatWaves()` steam; tag "40 °C";
  its `meter()` fills almost to the top.
- **big**: **Showpiece**: the two meters side by side: the bath's bar towers over the spark's
  sliver; tick by the bath, chip "more heat".
- **rule**: two blocks, red "80 °C" and blue "20 °C"; an orange arrow flows hot → cold; a reversed
  arrow (cold → hot) appears and gets a `cross()`.
- **equal**: both blocks' small thermometers slide to the same reading and the colours meet in the
  middle; label "thermal equilibrium"; the arrow fades out.
- **ice**: a hand holds an ice cube. A blue "cold" arrow into the hand is struck through
  (`strike()`), then an orange arrow flows out of the hand into the ice.
- **zero**: a tall scale slides down past 0 °C to "absolute zero, −273 °C"; beside it a kit
  `particleBox` set to 'solid' with almost no energy, its particles nearly still.

## particles: Particles and thermal energy
A zoom into matter, then kit `particleBox` for each state, with a `meter()` for the total and a
`thermometer()` for the average.
- **zoom**: zoom from a cup of water into a circle of jiggling particles (`particleBox` liquid).
- **kinetic**: one particle highlighted, with a motion trail and a speed arrow; label "kinetic energy".
- **total**: a tiny spark lifts off every particle and flies into a big `meter()` labelled
  "thermal energy = total".
- **average**: a `thermometer()` joins the box, labelled "temperature = average"; one typical
  particle ringed. Meter (total) and thermometer (average) sit side by side.
- **faster**: kit `bunsen()` on a blue flame under the box: particles speed up (energy 0.4 → 0.9) and the
  thermometer rises.
- **solid**: three boxes appear; the first, `particleBox` 'solid', vibrates in its lattice, and the
  vibration widens as a flame warms it.
- **liquid**: second box, 'liquid', particles touching and sliding past each other.
- **gas**: third box, 'gas', particles far apart and fast; labels under all three.
- **cups**: a small cup and a big bucket (kit `beaker` small, a wide tub) with matching thermometers
  and chip "same temperature"; a few particles in each move at the same speed.
- **bucket**: **Showpiece**: sparks pour out of each into its own meter: the bucket's bar towers
  over the cup's; chip "more thermal energy".
- **jiggle**: mnemonic card: "Joules Jiggle" (J chip with jiggling particles) and "Celsius Counts
  hotness" (°C chip with a thermometer).

## conduction: Conduction: passing energy along
The metal bar across the middle of the stage; later the floor slab returns, then three ice cubes.
- **first**: title chip "Conduction" and a "solids" tag; the bar slides in.
- **end**: `bunsen()` lights under the left end; the left particles turn orange and vibrate harder.
- **bump**: **Showpiece**: the vibration passes particle to particle down the bar as a travelling
  colour wave (orange spreading right); neighbours visibly knock into each other.
- **along**: the right end's small thermometer rises; a dotted outline round the bar shows the bar
  itself stays put; label "energy moves, the bar doesn't".
- **metals**: small `C.air` dots, free electrons, appear and drift through the lattice; `labelLine`
  "free electrons".
- **zip**: the electrons carry yellow sparks from hot end to cold end, overtaking the slow vibration
  wave; chip "faster".
- **conductors**: three samples, copper (orange-brown), aluminium (silver), iron (dark grey); an
  orange arrow passes straight through each.
- **insulators**: wood, plastic, glass, wool and air samples; the arrow into each is short and
  dotted; wool shows trapped air pockets (`bubbles`-style circles, held still).
- **floor**: the floor slab returns with two equal thermometers; chip "same temperature"; then
  "better conductor" appears under the tiles.
- **feet**: the bare foot on the tiles: thick orange arrows stream from the foot into the tiles; on
  the wood only a trickle. Label "your own heat escaping".
- **spoon**: a hand holding a metal spoon and a wooden spoon: a thick arrow out of the hand into
  the metal, a thin one into the wood; chip "same temperature".
- **ice**: a metal tray, a wooden board and a plastic plate, each with an ice cube; a stopwatch
  starts.
- **melts**: arrows rise from the metal into its cube, which shrinks into a puddle first; the other
  two cubes barely change; tick on the metal.

## convection: Convection: currents in fluids
A large pan of water in cross-section on a `bunsen()`, centre stage; then a room with a radiator,
a coast, and a paper spiral.
- **second**: chip "Convection"; a kit `beaker()` of water and a puff of air, both labelled
  "fluids: they flow".
- **moves**: a warm orange parcel of water travels upward carrying a spark; a small inset recalls
  conduction's fixed particles.
- **pan**: the flame lights; the bottom layer turns orange and its particles spread apart; the
  layer swells.
- **dense**: the orange parcel rises; a side-by-side shows fewer particles in the same space;
  label "less dense".
- **sinks**: a blue parcel slides down the side to the bottom; label "denser".
- **cools**: at the top, the orange parcel turns blue and drifts sideways, then down.
- **loop**: **Showpiece**: the full loop: red arrows up the middle, blue arrows down the sides,
  tracer particles circulating continuously through the 2 s pause; label "convection current".
- **lifts**: chip "Hot Air Lifts"; a hot-air balloon rises with an orange glow inside; then
  "less dense" with a `tick()` and "lighter" with a `cross()`.
- **solids**: a solid block with locked particles; the word "convection" crossed out over it.
- **radiator**: a room cross-section: a radiator low on the left wall; warm air rises (orange),
  crosses the ceiling, sinks on the far side (blue) and returns along the floor.
- **land**: a coast: kit `sun()` above, sand on the left, sea on the right; the land's
  thermometer climbs faster than the sea's.
- **breeze**: air over the land rises; cool air flows in from the sea along the surface (blue
  arrows) and the loop closes; a beach flag streams towards the land; label "sea breeze".
- **snake**: a paper spiral on a thread above a radiator; rising warm air turns it; a small chip
  "never over a flame" with a crossed-out flame.

## radiation: Radiation: heat that travels as waves
Space for the Sun and Earth, then a room with a fire, then two surface panels, then three
real-world vignettes and the three-ways summary.
- **third**: chip "Radiation"; orange infrared waves (kit `sineWave()`, `C.heat`) roll across the stage.
- **waves**: the waves pass through an empty glass box labelled "vacuum: no particles"; chip
  "the only way across".
- **sun**: **Showpiece**: kit `sun()` on the left, a small Earth on the right, a starfield between;
  waves travel the gap; label "150 million km"; Earth's day side warms as they arrive.
- **fire**: a fireplace on one side of a room and a face on the other; waves travel straight
  across and the cheek glows warm.
- **all**: a mug, a person (kit `person`) and a radiator each give off waves; the hotter the object
  (thermometer tags), the bigger and faster its waves.
- **dark**: a dark matt panel: incoming waves sink in and it glows warm; then, when hot, it sends out
  strong waves. Labels "best absorber", "best emitter".
- **shiny**: a shiny silver panel beside it: incoming waves bounce off; outgoing waves are weak.
  Label "reflects".
- **drinks**: mnemonic card "Dark Drinks, Shiny Reflects": a dark cup sipping in waves, a mirror
  bouncing them away.
- **panels**: a black solar panel on a roof soaking up sunshine from kit `sun()`.
- **white**: a row of white-painted houses, sunshine bouncing off them.
- **foil**: a runner (kit `person`) wrapped in a shiny foil blanket; the body's waves bounce back
  inward.
- **three**: the three mini panels side by side: conduction bar, convection loop, sun waves.
- **cats**: chip "Cats Can't Radiate"; the C, C and R of the three panel titles light up in turn.

## insulation: Insulation: trapping thermal energy
A house cross-section (loft, cavity wall, double-glazed window), then the vacuum flask large and
centre, then a jumper and animals.
- **fins**: a computer chip with metal cooling fins shedding `heatWaves()` (escape wanted); then a
  house in winter leaking orange arrows from roof, walls and windows (escape not wanted).
- **loft**: the loft fills with a woolly yellow layer dotted with trapped air; the upward arrows
  shrink. Labels "conduction", "convection".
- **cavity**: zoom to the wall: two brick layers with a gap and a convection loop inside it; foam
  fills the gap and the loop stops.
- **glazing**: the window in cross-section: two panes with trapped air between; the arrow through
  it thins.
- **air**: trapped air pockets glow in the wool, the foam and the window gap; chips "conducts
  poorly", "no convection currents".
- **flask**: the vacuum flask slides in large: outer case, double wall, red hot drink, stopper.
- **vacuum**: **Showpiece**: the particles in the gap between the walls drain away, leaving the
  label "vacuum"; conduction and convection arrows hit the empty gap and stop, each with a `cross()`.
- **silver**: the walls turn mirror-silver; infrared waves from the drink bounce back in.
- **stopper**: the stopper presses home; the wisps of warm air and steam escaping from the top stop.
- **cold**: the drink turns to an iced blue drink; warmth from outside is turned back at the walls.
- **perfect**: thin orange wisps leak through the stopper and the supports; the drink's thermometer
  drops slowly.
- **jumper**: a person (kit `person`) in a woolly jumper: arrows leaving the body shorten and slow;
  a struck-out chip "adds heat".
- **animals**: a seal in cross-section showing its blubber layer, a bird with fluffed feathers,
  fur with trapped air between the hairs.

## expansion: Thermal expansion and contraction
The metal bar again, with a dotted outline of its starting length; then a railway, power lines,
a bimetallic strip and a thermostat circuit.
- **apart**: `bunsen()` under the bar; its particles vibrate harder and their spacing grows.
- **bigger**: **Showpiece**: the bar visibly stretches past its dotted outline; label "thermal
  expansion".
- **shrink**: a blue frost icon; the bar shrinks back past the outline; label "thermal contraction".
- **mass**: a balance shows the same mass before and after; chip "same particles"; a "volume"
  arrow grows.
- **order**: three bars ranked: gas (long arrow), liquid (medium), solid (short); labels.
- **force**: a bar fixed between two walls bows and buckles, with big force arrows.
- **gaps**: railway rails with a small gap close it on a hot day (kit `sun()`), while a track with
  no gap buckles; then a bridge expansion joint, its teeth sliding together.
- **wires**: pylons with power lines: loose and sagging in summer, tighter in winter, never snapping.
- **strip**: a two-colour bimetallic strip (brass and steel) curls into an arc when heated.
- **thermostat**: the strip bends away from a contact; a simple circuit (kit `wire`, `switchSym`)
  breaks and a heater icon switches off.
- **useful**: a liquid-in-glass thermometer slides in and its liquid rises: a handoff to the next
  chapter.

## thermometers: Measuring temperature
A large liquid-in-glass thermometer stands at the left with labelled parts; the right side holds
the comparison pieces (tubes, beakers, digital and infrared thermometers, eyes).
- **device**: three thermometers pop up (liquid-in-glass, digital, infrared gun), each showing a
  number.
- **glass**: the big thermometer builds: bulb, capillary, scale; `labelLine`s "bulb", "capillary".
- **rises**: the bulb dips into warm water (kit `beaker()`); red liquid creeps up the capillary.
- **liquid**: chip "cheap and simple"; labels "coloured alcohol" on the red liquid, then a small
  inset of an old silver mercury thermometer.
- **thin**: a wide tube and a thin tube on identical bulbs: for one degree, the thin tube's liquid
  moves much further.
- **fixed**: the scale gets two fixed points: an ice-water `beaker()` marks 0 °C; a boiling
  `beaker()` on a `bunsen()` (with `bubbles`) marks 100 °C. **Showpiece**: the two fixed points
  locking onto the scale.
- **hundred**: 100 tick marks fill the space between, sweeping up the scale.
- **digital**: a digital thermometer with a probe; inset of the thermistor; the LCD number changes
  fast.
- **infrared**: an infrared gun points at a hot pan; `C.heat` waves travel from the pan to the
  sensor; chip "no touching".
- **settle**: the reading creeps and settles; a bulb touching the beaker side gets a `cross()`, one
  in the middle of the liquid a `tick()`.
- **eye**: three eyes, above, level and below, with sight lines to the liquid's top; above and below
  read wrong (`cross()`), level reads right (`tick()`); label "parallax error".

## evaporation: Evaporation: a cooling effect
A dish of water in close-up, its surface band of particles colour-coded by speed (blue slow,
red fast), with a `thermometer()` in the liquid; then skin, a pool and a washing line.
- **speeds**: particles move with arrows of different lengths: slow blue, fast red.
- **escape**: the fastest red particles at the surface break free into the air above; label
  "evaporation".
- **below**: a puddle in the sun shrinks; its thermometer reads about 20 °C, far below a "100 °C
  boiling point" mark.
- **left**: **Showpiece**: an "average energy" `meter()` drops each time a fast particle leaves;
  the remaining particles shift bluer.
- **cooler**: the thermometer in the liquid falls; chip "cooling effect".
- **sweat**: a skin cross-section with sweat beads; fast particles escape and the skin's
  thermometer falls.
- **breeze**: wind arrows sweep the escaped particles away, so more escape; the skin cools faster.
- **pool**: a swimmer (kit `person`) climbs out of a pool into the wind; shiver lines.
- **faster**: four icons with rising rate arrows: warmer (sun), windier (wind), drier (dry air),
  bigger surface area (wide dish beside a narrow one).
- **washing**: a washing line of clothes flapping in sun and breeze; drips vanish into the air.

## recap: Recap: memory hooks and exam traps
Respiration's recap layout: memory-hook cards, then numbered traps with `tick()` and `cross()`.
- **lock**: title "Lock it in" with a padlock clicking shut.
- **jiggle**: card "Joules Jiggle, Celsius Counts hotness": J chip with jiggling particles, °C chip
  with a `thermometer()`.
- **cats**: **Showpiece**: card "Cats Can't Radiate"; the three mini panels fly in and line up
  under the C, C and R.
- **lifts**: card "Hot Air Lifts" with a rising orange parcel or balloon.
- **drinks**: card "Dark Drinks, Shiny Reflects": dark panel absorbing, shiny panel reflecting.
- **traps**: heading "5 exam traps" with a warning triangle.
- **t1**: "1": arrow hot → cold with a tick; cold → hot with a cross.
- **t2**: "2": a convection loop in a beaker with a tick; a solid block with a cross.
- **t3**: "3": waves crossing an empty vacuum box, with a tick.
- **t4**: "4": free electrons in a metal bar with a tick; a "shiny" sparkle with a cross.
- **t5**: "5": the bar longer, "volume ↑", beside a balance reading "mass: same".

## quiz: Quick-fire quiz
Respiration's quiz layout: a question card, a lib `ring()` counting down through each 4 s pause,
then the answer with a `tick()`.
- **intro**: title "Quick-fire quiz!" with five dots for the questions.
- **q1**: card with a thermometer and a spark; ring counts down.
- **a1**: "°C" lands under the thermometer, "J" under the spark.
- **q2**: a metal bar icon; ring.
- **a2**: free electrons zip along the bar carrying sparks.
- **q3**: a fire and a face across a room; ring.
- **a3**: waves travel to the face; label "radiation".
- **q4**: the vacuum flask; ring.
- **a4**: **Showpiece**: the empty gap glows "no particles"; conduction and convection arrows are
  crossed out.
- **q5**: a sweaty forehead; ring.
- **a5**: fast particles leave the skin; its thermometer drops.
- **outro**: "Brilliant work!" and a chip "Heat & Temperature quiz" pointing to the Science Lab.

---

## Suggested animator split

Chapter lengths from `timeline.json`: intro 28 s, temp 75 s, particles 68 s, conduction 90 s,
convection 82 s, radiation 85 s, insulation 92 s, expansion 66 s, thermometers 77 s,
evaporation 63 s, recap 57 s, quiz 74 s.

| Group | Chapters | About | Notes |
| --- | --- | --- | --- |
| 1 | intro, temp, particles | 2.8 min | Sets the look: floor slab, sparkler and bath, `particleBox` states. Medium. |
| 2 | conduction, convection, recap | 3.8 min | Hardest physics animation (vibration wave, free electrons, convection loop); the recap reuses this art plus the mini panels. |
| 3 | radiation, insulation, quiz | 4.2 min | Waves, surfaces, house and the vacuum flask; the quiz reuses the fire and the flask. |
| 4 | expansion, thermometers, evaporation | 3.4 min | Medium: bar stretch, railway, thermometer build, evaporating particles. |

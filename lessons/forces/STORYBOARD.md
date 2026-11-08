# Forces & Motion: storyboard

12 chapters, 121 lines. Each bullet is what the screen shows while that line is
spoken; the previous beat fades as the next one arrives. **Showpiece** marks the
moment each chapter builds towards.

## Shared look (use in every chapter, so the lesson looks like one piece)

The shared art is in `lessons/forces/lib.js` (its header lists every helper and
option). Use these rather than drawing your own, so all four animator groups
match.

- **Force arrows:** `fmArrow(parent, kind, x, y, newtons, dir, { scale })`
  draws an arrow to scale, `newtons × scale` px long, labelled like
  "weight 20 N". `g.set(p, newtons)` grows it in, resizes it (drag growing with
  speed), and keeps the label's value in step. The colour comes from the kind
  (`FM.col`), one per kind of force everywhere:
  - `weight` (gravity): `C.glucose` amber;
  - `normal` and `upthrust` (support pushes): `C.water` blue;
  - `friction` and `drag` (air or water resistance; pass `label: 'air
    resistance'`): `C.oxygen` red;
  - `push`, `pull` and `drive` (driving force): `C.good` green;
  - `tension`: `C.ethanol` violet;
  - `magnetic` and `electrostatic`: `C.lactic` pink;
  - `resultant`: `C.energy` yellow, thicker. A zero resultant is a "0 N" chip
    (lib `chip`), with no arrow.
- **Arrows are to scale.** Pick one `scale` (px per newton) per scene, use it
  for every arrow in that scene, and show `fmScaleBar` whenever numbers are on
  screen. Equal forces get exactly equal arrows. Directions follow the physics:
  - weight starts at the object's centre and points straight down;
  - the normal force starts at the contact surface and points away from it, at
    right angles, set about 16 px to one side of the weight arrow so the two
    never sit on top of each other;
  - friction acts along the contact surface, against the motion (or against the
    way the object is trying to slide);
  - drag points straight back against the motion;
  - upthrust points straight up;
  - tension points along the rope, away from the object;
  - a push drawn into an object uses `{ tip: true }`, so its head touches the
    object.

  `fmCrate(parent, w, h).at(x, y)` gives the anchor points in `g.pt`: centre,
  bottom, left, right, and the bottom corners. `fmCar` and `fmCyclist` give
  `g.pt.front` (start the driving force here, pointing forwards) and
  `g.pt.back` (start drag here, pointing backwards).
- **Objects:**
  - `fmFloor` for the ground (`rough` for friction close-ups);
  - `fmCrate` for the box;
  - `fmBag(parent, '2 kg')` for masses;
  - `fmMasses` for slotted 1 N masses (`g.set(count)`).
- **Newtonmeter** (force, mass, hooke, recap, quiz): `fmNewtonmeter({ max })`,
  with `g.set(newtons)` and `g.hook()` for where the load hangs. The hook slides
  down as the reading rises, so at full scale it hangs 2 × len + 160 px below
  the ring; leave room.
- **Springs** (hooke, recap): `fmSpring` (`g.set(length, warp)`; warp makes the
  coils uneven past the elastic limit). `fmExtension(newtons)` gives the
  chapter's numbers: 10 cm long, 3 cm per newton up to the 4 N elastic limit,
  then curving away.
- **Graphs** (speed, hooke, recap): `fmGraph` draws axes in `C.muted` with
  labels and a grid at 30%. `g.line(points).set(upto)` plots a line in
  `C.energy` as far as `x = upto`, so the distance-time graph draws itself live;
  `g.dots(points).set(k)` adds data points one at a time. On the distance-time
  graph, time runs along the bottom and distance up the side. On the
  force-extension graph, extension runs along the bottom and force up the
  side, as in the guide's diagram. Leave about 90 px below the axis and 100 px
  to its left for the labels.
- **Seesaw and distances** (moments, recap): `fmSeesaw({ pxPerM: 150 })`, with
  `g.set(tilt)` and `g.at(metres)`. Stand loads at `g.at(d)` and draw their
  weight arrows straight down. `fmDim` draws the distance brackets ("2 m",
  "3 cm"), measured from the pivot at right angles to the force's line.
- **The Moon, the hammer and the feather** (intro, mass, friction):
  - `fmMoon` and `fmSky` are the full-stage backdrops;
  - `fmHammer` and `fmFeather`;
  - `fmAstronaut` is a kit `person` in a spacesuit, posed with `g.pose`.
- **Vehicles** (force, types, balanced, friction, speed, recap, quiz): `fmCar`
  and `fmCyclist`. `g.roll(distance)` turns their wheels (and the pedals) by the
  distance moved.
- Lib art to reuse: `chip`, `card`, `tick`, `cross`, `strike`, `meter` (speed
  gauges), `heatWaves` (friction heat), `spark`, `ring` (quiz countdown), `glow`,
  `ball`. Kit art: `person` (with `runPose` and `walkPose`), `magnet`,
  `labelLine`.

## intro: The hammer and the feather

An Earth scene (sky, ground), then a Moon scene (grey ground, black sky, Earth
on the horizon), then a roadmap. New art: hammer, feather, astronaut (kit
`person` in white), Moon surface.

- `hook`: A hand lets go of a hammer and a feather at the same height. The
  hammer drops straight to the ground; the feather drifts and sways, still high
  up when the hammer lands.
- `moon`: On the Moon, an astronaut lets go of both. They fall side by side, at
  exactly the same height at every moment, and land together. They fall more
  slowly than the hammer did on Earth (the Moon's gravity is weaker, so take
  about 2.5 times as long for the same height). **Showpiece.**
- `why`: Split screen, Earth and Moon, with a "?" over the Earth feather. Then
  the word "forces" with a green push arrow and a green pull arrow.
- `plan`: Seven icon chips pop in: a balance (balanced forces), the Moon (weight),
  a tyre tread (friction), a stopwatch and graph (a journey), a spring, a seesaw
  (turning) and a drawing pin (pressing).

## force: What a force is

A crate on the floor centre stage, with chips at the side. New art: crate,
newtonmeter, apple, 1 kg bag of sugar, sponge, Isaac Newton silhouette.

- `push`: A hand pushes the crate (green arrow into it), then a rope pulls it
  (green arrow away from it). Labels "push" and "pull".
- `see`: The arrows turn into faint dashes with a "?"; the crate slides, and a
  magnifier shows only its movement: "you see what it does".
- `does`: Five mini panels, each a short loop: a ball starting to roll, a car
  speeding up, a bike slowing down, a ball bouncing off a bat (changing
  direction), a sponge squashed by a hand (changing shape).
- `sssds`: The initials of the five panels light up in turn: S, S, S, D, S, with
  the words beneath.
- `newtons`: A big "N", the word "newtons", and a simple silhouette of Isaac
  Newton with an apple.
- `meter`: A newtonmeter (shared look); a hand hooks a weight on and the pointer
  slides down the scale.
- `apple`: The newtonmeter holds a small apple, reading 1 N; then a 1 kg bag of
  sugar, reading 10 N.
- `arrow`: The crate with one green arrow: its tail where the force acts, its
  head the way the force acts. Labels "size" (along its length) and "direction"
  (at the head).
- `longer`: Two arrows on the crate, 5 N and 10 N, with a scale bar; the 10 N
  arrow is exactly twice as long. **Showpiece.**
- `contact`: Panel "contact forces": the crate sliding with red friction at the
  floor, a cyclist with red air resistance, a sledge on a violet rope, a book on
  a table with a blue normal force up.
- `noncontact`: Panel "non-contact forces": a falling apple with an amber weight
  arrow; a kit `magnet` pulling a paperclip across a gap; a rubbed balloon
  lifting hair across a gap (pink arrows). The gaps are marked with dashes.

## types: Types of force

A gallery of eight frames, one per force, with the colour key along the bottom.
New art: cyclist, swimmer (kit `person`, lying flat), hanging lamp on a cable,
book and table, balloon and hair, two sorting bins.

- `names`: Eight blank frames appear, each with a small push or pull icon.
- `weight`: An apple with an amber arrow from its centre straight down; a dashed
  line continues to the centre of a curved Earth. Tag "non-contact".
- `friction`: The crate slides right on a rough floor; a red friction arrow at
  the contact points left.
- `drag`: A cyclist rides right; a red drag arrow points back and grows as a
  lib `meter` speed gauge rises.
- `upthrust`: A swimmer floats still in a pool: amber weight down, blue upthrust
  up, exactly equal.
- `tension`: A lamp hangs on a cable: a violet tension arrow up the cable from
  the lamp, an amber weight arrow down, equal.
- `normal`: A book on a table: amber weight down from its centre, blue normal
  force up from the table top, equal. Then a person standing, with blue arrows
  up at the feet.
- `charges`: A kit `magnet` pulling a paperclip, and a rubbed balloon pulling
  hair, each across a dashed gap, with pink arrows.
- `sort`: Two bins, "non-contact" and "contact". Chips fly in, each with its
  coloured arrow: weight, magnetic, electrostatic into one; friction, drag,
  tension, upthrust, normal into the other. **Showpiece.**

## balanced: Balanced and unbalanced forces

The crate on a floor with a resultant readout, then a car, then a skydiver.
Scale in this chapter: 10 N = 40 px (30 N is 120 px, 12 N is 48 px, 18 N is 72 px). New art: car, skydiver (kit `person`,
spread-eagled), speed gauge (lib `meter`).

- `many`: The crate with four arrows: a green push right, red friction left,
  amber weight down, blue normal up.
- `resultant`: The horizontal arrows slide together head to tail and combine
  into one yellow "resultant" arrow; the vertical pair cancels.
- `balanced`: Two equal and opposite horizontal arrows (20 N each); the readout
  shows "0 N".
- `still`: A still crate with balanced arrows stays put (a "still" badge); then a
  moving crate with balanced arrows glides at a steady speed, its gauge needle
  fixed.
- `cruise`: A car cruising: a green driving force forward, a red friction and drag
  arrow backward, exactly equal; its speed gauge holds steady. Chip "no resultant
  needed to keep moving".
- `unbalanced`: Two unequal arrows; a yellow resultant arrow appears.
- `speeds`: Three mini panels: the resultant forward, and the crate speeds up; the
  resultant backward, and it slows down; a sideways resultant, and a ball's path
  curves.
- `add`: A number line: arrows the same way join head to tail (add); arrows the
  opposite way overlap and cancel (subtract).
- `example`: The crate: a green 30 N push and a red 12 N friction, to scale; the
  sum 30 − 12 = 18 N, and a yellow 18 N resultant arrow; the crate speeds up.
- `skydiver`: A skydiver falls with an amber weight arrow (fixed length) and a
  short red drag arrow; the speed gauge climbs. Label "weight > drag: speeds
  up".
- `terminal`: As the speed rises, the drag arrow grows until it exactly matches
  the weight arrow (which never changes); the gauge levels off. Label "terminal
  velocity". **Showpiece.**

## mass: Mass versus weight

A 2 kg bag that travels from Earth to the Moon to orbit, with a newtonmeter and
an amber weight arrow. Weight scale: 1 N = 10 px (20 N is 200 px; 3.2 N is
32 px). New art: bag of matter (particles inside), Earth, Moon, Space Station,
wrench icon.

- `same`: Two chips, "mass" and "weight", slide together (everyday talk), then
  spring apart (physics).
- `mass`: A bag full of particles stamped "2 kg" hops from Earth to the Moon to
  deep space; the stamp never changes. Label "kilograms (kg)".
- `weight`: Back on Earth: an amber arrow pulls the bag down. Label "newtons (N):
  changes with gravity".
- `matter`: Mnemonic card: "Mass is Matter (kg)" with the particle bag; "Weight is
  the Wrench of gravity (N)" with a wrench tugging down.
- `formula`: Formula card "weight = mass × gravitational field strength", then
  "W = m × g", then "We Most Go".
- `g`: Earth with a chip "g ≈ 10 N/kg (9.8)".
- `bag`: The bag on a newtonmeter on Earth: it reads 20 N, and the weight arrow is
  200 px. The sum 2 × 10 = 20 N.
- `moon`: The Moon with a chip "g ≈ 1.6 N/kg, about 1/6 of Earth's".
- `moonbag`: The same bag on the Moon: the newtonmeter reads 3.2 N and the arrow
  shrinks to 32 px, while the "2 kg" stamp stays put. An astronaut bounces in
  long, slow arcs. **Showpiece.**
- `orbit`: The Space Station circles the Earth; astronauts float inside. The
  station's path keeps falling towards the Earth and missing it. A weight arrow
  still points to the Earth's centre, nearly as long as at the surface (about
  90%). Chips "mass unchanged" and "gravity still acts".

## friction: Friction and drag

The crate with a zoom bubble, then drag scenes, uses, fixes, and the hammer and
feather again. New art: zoomed rough surfaces, parachutist, gears, oil can,
rollers, streamlined and boxy car shapes with airflow lines, tyre tread, boot
studs, hammer, feather, Moon scene (same as the intro).

- `friction`: The crate slides right and slows; a red friction arrow at the
  floor points left.
- `bumps`: A zoom bubble on the contact: jagged bumps on both surfaces catch on
  each other.
- `drag`: A cyclist: the red drag arrow is short at low speed and long at high
  speed; then sitting up (bigger area) makes it longer still. A small swimmer
  icon for "water resistance".
- `useful`: Three ticked icons: a shoe gripping the ground, a tyre gripping the
  road, brake pads closing on a wheel.
- `chute`: A parachute opens: a big red drag arrow appears and the falling speed
  gauge drops.
- `waste`: Two gears rubbing give off lib `heatWaves` and a worn patch; a car and
  a cyclist with drag arrows. Label "wastes energy as heat".
- `reduce`: An oil can drips on the gears and the heat waves shrink; rollers slide
  under a crate; then two cars in airflow: smooth lines around a streamlined
  shape, tangled lines behind a boxy one.
- `increase`: Close-ups of a tyre tread and football-boot studs gripping turf.
- `feather`: On Earth, the hammer and feather fall. The feather has a red drag
  arrow almost as long as its tiny amber weight arrow; the hammer has a tiny drag
  arrow and a long weight arrow.
- `moon`: On the Moon, the astronaut drops both: no drag arrows at all, only
  weight arrows (the hammer's much longer). They fall side by side and land
  together. Tag "Apollo 15, 1971". **Showpiece.**
- `fall`: Card: "no air resistance → everything falls at the same rate"; "drag,
  not weight, makes the difference".

## speed: Speed and distance-time graphs

A running track with distance markers and a stopwatch, then a road with traffic
lights above a distance-time graph that plots itself live. New art: stopwatch,
track, car, traffic lights, road signs (km/h, mph), snowflake.

- `speed`: A runner (kit `person` with `runPose`) runs along a track with
  distance markers while a stopwatch runs.
- `formula`: Formula card "speed = distance ÷ time".
- `units`: Chips "metres (m)" and "seconds (s)" merge into "metres per second
  (m/s)"; two small road signs show km/h and mph.
- `runner`: The runner covers 100 m as the stopwatch reaches 20 s (sped up to fit
  the line); the sum 100 ÷ 20 = 5 m/s builds.
- `average`: A car's whole route with two chips, "total distance" and "total
  time"; "average speed = total distance ÷ total time".
- `car`: The car speeds up, slows, stops at a red light, then goes on; a speed
  gauge swings, while an "average" chip holds one value.
- `graph`: Axes fade in under the road: time along the bottom, distance up the
  side. A dot plots the car's distance against time as it drives.
- `flat`: The car waits at the lights: the plotted line runs flat. Label
  "stationary"; a chip "going backwards" is struck out.
- `slope`: The car drives on steadily: a straight sloping line.
- `steep`: Two lines from the origin: a steep one (fast car) and a gentle one
  (slow cyclist). A gradient triangle on the steep line: 100 m up over 10 s
  along = 10 m/s. Label "gradient = speed". **Showpiece**: the whole graph
  drawing itself from the journey, slope, flat and steep.
- `frozen`: Mnemonic card "Steeper is Speedier, Flat is Frozen", with a steep
  arrow and a snowflake on a flat line.

## hooke: Hooke's law and springs

A spring hanging from a clamp beside a centimetre ruler, with 1 N weights, and a
force-extension graph on the right that plots point by point. Numbers: natural
length 10 cm; each 1 N adds 3 cm (1 N → 13 cm, 2 N → 16 cm, 3 N → 19 cm). New
art: clamp stand, spring, slotted 1 N weights, ruler, newtonmeter cutaway, home
setup (rubber band, pencil, cup on a paper clip, coins).

- `stretch`: A hand pulls the spring down and lets go; it springs back with a
  little bounce.
- `extension`: Two marks on the ruler, original length and new length, and a
  bracket between them: "extension = new length − original length".
- `example`: Hang 1 N: the spring goes from 10 cm to 13 cm; the bracket reads
  "3 cm".
- `law`: Card "extension is proportional to force".
- `double`: Add a second and a third 1 N weight: the extension goes 3, 6, 9 cm,
  equal steps, with the coils spreading evenly.
- `graph`: Each loading plots a point on the graph (extension along the bottom,
  force up the side); a straight line through the origin joins them.
- `limit`: A marker on the line, "elastic limit". The weights come off and the
  spring returns to exactly 10 cm.
- `past`: More weights: the new points curve away from the line, flattening
  (each extra newton now adds more stretch). With the weights off, the spring
  stays longer than 10 cm. Label "permanently stretched". **Showpiece.**
- `meter`: A newtonmeter cut open: its spring and an evenly spaced 0–10 N scale;
  equal weights move the pointer down equal steps.
- `home`: The home version: a rubber band hangs from a pencil taped across a
  shelf, with a paper cup on a paper clip; coins drop in one at a time and a
  small table fills in (coins, stretch).

## moments: Moments: the turning effect

A door seen from above (the hinge is the pivot), a spanner on a bolt, and a
seesaw. Force arrows meet the lever at right angles; distance brackets run from
the pivot. Scale on the seesaw: 100 N = 40 px, 1 m = 150 px. New art: door from
above, spanners (short and long) and bolt, crowbar, wheelbarrow, seesaw, two
children (kit `person`), moment readouts.

- `turn`: A door swings on its hinges, seen from above; a seesaw tips. Both pivots
  pulse.
- `moment`: Formula card "moment = force × distance from the pivot".
- `right`: A spanner on a bolt: a green force arrow at its end, at right angles
  to it; a bracket from the bolt's centre to the arrow's line, "distance (at right
  angles)". Chip "newton metres (N m)".
- `bigger`: The same spanner: a longer force arrow makes a bigger moment readout;
  the same force further out does too.
- `spanner`: A short spanner and a long spanner, the same force arrow on each: the
  long one turns the tight bolt, the short one doesn't.
- `door`: Door from above: a push near the hinge barely moves it; the same push
  at the handle swings it open.
- `levers`: Three icons, each with its pivot marked: a crowbar lifting a lid, a
  seesaw, a wheelbarrow.
- `balance`: The seesaw with labels "force × distance" on each side; when they
  match, the beam sits level.
- `kids`: To scale: a lighter child at 2 m on the left, a heavier one at 1 m on
  the right. Amber weight arrows 300 N and 600 N (the second exactly twice as
  long); distance brackets 2 m and 1 m (twice as long on the left). Readouts
  "300 × 2 = 600 N m" and "600 × 1 = 600 N m"; the beam stays level.
  **Showpiece.**
- `myth`: A bar on a pivot: a short arrow far out against a long arrow close in;
  the bar turns towards the short arrow's side. Chip "bigger force ≠ bigger
  turning effect".

## pressure: Pressure

Objects pressing on soft surfaces (snow, sand, a lawn), each with its force
arrow and a pressure readout, then a knife, then balloons and pins. Equal forces
get equal arrows. New art: block with faces of different sizes, sharp and blunt
knives, tomato, boot, snowshoe, skis, tractor tyre, camel, stiletto heel,
balloon, drawing pin, bed of pins.

- `what`: A force arrow presses on a surface; under the contact area, small
  arrows show how the push is shared out. A narrow contact concentrates them; a
  wide one spreads them.
- `formula`: Formula card "pressure = force ÷ area".
- `units`: "newtons ÷ square metres = newtons per square metre (N/m²)", a 1 m by
  1 m square, and "= pascals (Pa)".
- `example`: A 100 N block resting on a 2 m² face: 100 ÷ 2 = 50 N/m².
- `same`: The same block stood on a 0.5 m² face: the same 100 N arrow, but the
  readout jumps to 200 N/m², and it presses deeper into a soft surface.
- `sharp`: A sharp knife on a tomato: a tiny contact area, a huge pressure readout,
  and it slices in; pin and nail icons beside it.
- `myth`: A sharp and a blunt knife side by side with the same push arrow: very
  different pressure readouts. A chip "push harder?" is struck out.
- `wide`: A boot sinks into snow while a snowshoe under the same weight arrow
  stays on top; small ski and tractor-tyre icons.
- `camel`: A camel with a long weight arrow stands on sand and barely sinks; a
  person in stilettos, with a much shorter weight arrow (same scale), sinks a
  heel into a lawn. Readouts: camel low, heel high. **Showpiece.**
- `pin`: A balloon pressed gently onto one drawing pin pops; another, pressed with
  the same push onto a bed of many pins, survives. Tag "with an adult's help".
- `pares`: Mnemonic card: "Moments multiply: force × distance" and "Pressure
  pares down: force ÷ area".

## recap: Recap: memory hooks and exam traps

As in Respiration: a padlock clicks shut, four memory-hook cards build a 2×2
grid, then five traps, each with the wrong idea struck out and the right idea
ticked, with a small picture.

- `lock`: A padlock clicks shut.
- `sssds`: Card 1: the five mini panels with S, S, S, D, S.
- `matter`: Card 2: "Mass is Matter, Weight is the Wrench", and "We Most Go: W = m
  × g".
- `steeper`: Card 3: a mini distance-time graph, steep and flat.
- `moments`: Card 4: a mini seesaw and a pin: "Moments multiply, Pressure pares
  down". The 2×2 grid is complete. **Showpiece.**
- `traps`: The cards shrink away; title "5 exam traps".
- `t1`: "Weight in kg" struck out; "weight in newtons" ticked, with a newtonmeter.
- `t2`: "Moving needs a forward force" struck out; "balanced → steady speed"
  ticked, with the cruising car and its equal arrows.
- `t3`: "Friction can speed you up" struck out; "friction and drag oppose motion"
  ticked, with a drag arrow growing as a gauge rises.
- `t4`: "distance × time" and "force × area" struck out; "÷" ticked in both.
- `t5`: "Hooke's law for any stretch" struck out; "only up to the elastic limit"
  ticked, with the bending graph.

## quiz: Quick-fire quiz

As in Respiration: five question cards; a lib `ring` runs through each 4 s
pause; the answer appears with a small picture and a progress dot fills.

- `intro`: Title card "Quick-fire quiz!" and five empty progress dots.
- `q1`: Question card. `a1`: a big "N" beside a newtonmeter.
- `q2`: Question card. `a2`: a box with equal and opposite arrows and a "0 N" chip.
- `q3`: Question card. `a3`: a 3 kg bag on a newtonmeter reading 30 N.
- `q4`: Question card. `a4`: a cyclist with "200 m" and "25 s", then "8 m/s".
- `q5`: Question card. `a5`: sharp and blunt knives with their pressure readouts.
- `outro`: "Brilliant work!" with a burst of sparks. **Showpiece.**

## Suggested split for the animators

Grouped so chapters that share art stay together; durations are from the
narration timeline.

| Group | Chapters | Length | Notes |
| --- | --- | --- | --- |
| A | intro (29 s), mass (74 s), friction (90 s) | 3 min 13 s | The Moon, the astronaut and the hammer and feather appear in all three |
| B | force (70 s), types (74 s), balanced (87 s) | 3 min 50 s | Sets the force-arrow colours and scale; the skydiver |
| C | speed (69 s), hooke (70 s), moments (72 s) | 3 min 30 s | Both graphs, the spring, the seesaw |
| D | pressure (83 s), recap (57 s), quiz (69 s) | 3 min 29 s | Pressure scenes, then templated recap and quiz (copy mini art from A–C) |

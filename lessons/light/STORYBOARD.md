# Light & Optics: storyboard

14 chapters, 139 lines. Each chapter below has a layout line, then one bullet per
line id: what the screen shows while that line is spoken, and what fades as the
next beat arrives. **★ Showpiece** marks the chapter's big moment.

## Shared visual language (every chapter)

Keep these identical across all animators, so the rays look like one lesson.

- **Light lib (`lessons/light/lib.js`)**: use it for every ray diagram. It keeps the geometry right
  (angles from the normal, i = r, Snell's law, total internal reflection) and the style the same:
  `bounceRay` and `bendRay` (reflection and refraction points from a hit point, normal and angle),
  `rayPath` and `lightRay` (rays with mid-ray arrowheads; `set(p)` draws them in), `normalLine`,
  `angleArc` and `arcFromNormal` (labels place themselves clear of the rays), `planeMirror`,
  `roughSurface` (`reflect()` about each bump's own normal), `glassBlock` and `glassPrism` (`trace()` a ray
  through both faces), `semiBlock`, `convexLens` (`set(fat)`, `f()`) with `lensImage`, `eyeSection`
  (`pupil()`, `focus()`, `image()`, `rays()` and label anchors), `irisFront`, `eyeIcon`, `rayBox`,
  and `SPECTRUM`. The header comment of each function gives its options.
- **Rays**: lib `arrow()` drawn progressively with `g.set(p)`, so light always
  *travels* out from its source. Single rays are `C.energy` (#FFE45C), stroke 6,
  over a faint `glow(C.energy)` halo. Each ray has an arrowhead **part-way along**,
  pointing the way the light travels (put a second, shorter `arrow()` on top for
  the mid-ray head). White light is `C.ink`, stroke 8.
- **Spectrum colours** (dispersion, colour, mixing): red #FF4D4D, orange #FF9A3C,
  yellow #FFE45C, green #4CD964, blue #3B82F6, indigo #5B5BD6, violet #A066FF.
  Light primaries in the mixing chapter: red #FF4D4D, green #4CD964, blue #3B82F6;
  their overlaps are yellow #FFF04D, cyan #4DF0FF, magenta #FF4DFF and white #FFFFFF.
- **Normal**: dashed `C.muted` line, stroke 3, dash 10 8, always exactly **90° to
  the surface** at the point where the ray hits. Draw it on both sides of a boundary
  for refraction, and on the reflecting side for a mirror. A small right-angle box
  marks 90° the first time it appears.
- **Angles** are always arcs **between the ray and the normal**, never the surface:
  angle of incidence `i` in `C.glucose` (amber), angle of reflection or refraction
  `r` in `C.water` (cyan). Each arc has a letter label and a degree value at 26 px or more.
- **Mirror**: silver line #DCE6EE, stroke 8, with short diagonal hatching
  (`C.faint`) on the back. **Glass**: fill rgba(200,230,250,0.16), stroke `GLASS.stroke`
  (#CFE7F5, the kit glassware look). **Water**: `C.water` at 0.3 opacity under a
  brighter surface line. Medium names ("air", "glass", "water") in `C.muted`, 26 px.
- **Observer eye** (for ray diagrams): light lib `eyeIcon`, the same in every chapter.
- **Kit and lib art to use**: kit `sun` (the Sun, shadows, the rainbow), kit `person`
  with `walkPose` (the observer, the mirror, sunset shadow, the cinema), kit `labelLine`
  (every part label), kit `beaker` (the glass of water), kit `leaf` (green leaf),
  kit `bulbSym` (the glowing lamp), kit `bunsen` (a flame), kit `sineWave` (the
  sound of the firework), lib `heatWaves` (shimmering air over a star),
  lib `chip` (mnemonics and labels), lib `card` (panels), lib `tick` / `cross` /
  `strike` (wrong ideas corrected), lib `glow` (every light source), lib `ring`
  (quiz countdown).
- **Geometry**: refraction uses glass n = 1.5 and water n = 1.33, so air→glass at
  i = 50° gives r = 30.7° and air→water at 50° gives 35.2°. The critical angle for glass
  is 41.8° (say "about 42°") and for diamond 24.4°. Only the prism's colour spread may
  be exaggerated, and its order must stay right.

## intro: The pencil that seems to snap

Layout: a tabletop with a kit `beaker` (about 320 × 400) of water on the right half
and a yellow pencil (**new art**: a hexagonal pencil with a pink rubber). Viewed from
above and to one side, as in the textbook picture.

- `hook`: the pencil lowers into the water at a slant. The moment it crosses the
  surface, the underwater part is drawn bent up towards the surface (a shallower
  angle) with a clear kink at the waterline, so it looks snapped. ★ **Showpiece**.
- `whole`: the pencil lifts out and is straight again, and the kink vanishes as it
  leaves the water. A dotted path runs from the underwater tip to an observer eye,
  with a "?" chip on it.
- `def`: the glass shrinks away. Four icons slide in, each with a one-word label:
  a straight ray "travels", a ray off a mirror "bounces", a ray into a glass block
  "bends", a prism fanning a rainbow "splits".
- `plan`: the icons give way to three roadmap chips: a ray diagram, a red apple,
  and an eye.

## travels: How light travels and how we see

Layout: a dark stage with sources on the left. Each beat replaces the last.

- `straight`: a lamp (kit `bulbSym` in its `glow`) switches on and straight rays
  shoot out from it in every direction. Label "straight lines".
- `rays`: the other rays dim; one ray is redrawn as an `arrow()` and labelled "ray".
  Then a bundle of six parallel arrows sweeps across, labelled "beam = lots of rays".
- `speed`: a big counter rolls up to "300,000 km/s", with "3 × 10⁸ m/s" underneath
  in a smaller line.
- `earth`: Earth (**new art**: a blue and green disc about 260 px) with a bright light
  pulse lapping its equator seven and a half times while a "1 second" timer runs.
- `sound`: a firework (**new art**: a radial burst) explodes at the top right. Its
  flash reaches a kit `person` at bottom left at once, while a kit `sineWave` (sound)
  crawls towards them and arrives late. Chip "about 1,000,000 × faster".
- `luminous`: four glowing icons in a row: kit `sun`, a lamp, a flame (kit `bunsen`
  flame or a candle), a phone screen. Header "LUMINOUS: makes its own light".
- `nonlum`: the glows dim. A book, an apple and a kit `person` appear in flat,
  unlit grey. Header "NON-LUMINOUS".
- `see`: a lamp on the left, the apple in the middle, an observer eye on the right.
  A ray travels lamp → apple, the apple lights up red as the ray lands, and a
  reflected ray travels apple → eye. The key sentence appears as a card.
  ★ **Showpiece**.
- `eyes`: a wrong arrow from the eye out to the apple is drawn, then crossed out
  (lib `cross`). The correct path replays source → object → eye with a `tick`.
  Chip "eyes only receive light".
- `moon`: kit `sun` on the left, a grey Moon (lit only on its Sun-facing half) in
  the middle, and Earth with a tiny person on the right. A ray runs Sun → Moon →
  person. Label "non-luminous: reflects sunlight".

## shadows: Transparent, translucent, opaque & shadows

Layout: a beam of light from the left, a material panel in the middle and, behind
it, a small picture (a smiley) to look at.

- `transparent`: parallel rays pass straight through a clear glass pane. The smiley
  behind stays sharp. Label and examples: "clear glass, air, water".
- `translucent`: the pane turns frosted (white, grainy). Each ray breaks into short
  rays scattering in random directions (`rng`), and the smiley blurs. Examples:
  "frosted glass, tracing paper, thin curtains".
- `opaque`: the pane becomes a wooden board. The rays stop dead at its face and the
  smiley disappears. Examples: "wood, metal, brick".
- `shadow`: a point source on the left, an opaque cat cut-out in the middle and a
  screen on the right. Rays fan out from the point and stop where they hit the cat.
  The two edge rays just graze its outline and carry on, and an enlarged cat-shaped
  shadow appears between them on the screen. ★ **Showpiece**.
- `point`: zoom on the shadow's edge: a crisp boundary, because only one ray passes
  each edge point.
- `extended`: the source stretches into a long glowing strip. The umbra's edges are
  the rays from the **top of the source past the top of the object**, and from the
  **bottom of the source past the bottom**. The penumbra's outer edges are the crossing
  rays: bottom of the source past the top, top of the source past the bottom. Shade
  the umbra black and the penumbra grey, and label both.
- `closer`: back to a point source. The object slides towards the source (from
  halfway to a quarter of the way to the screen), the edge rays splay wider, and the
  shadow on the screen grows from 2× to 4× the object's size. Chip "closer → bigger".
- `sun`: outdoors, with a kit `person` on flat ground. With kit `sun` high (70°),
  the shadow is short (0.36 × height). Then the sun sinks to 15° and the sky warms
  to orange, and the shadow stretches to 3.7 × height. A dashed ray from the sun
  past the top of the head marks the shadow's tip each time.

## reflection: Reflection and the law of reflection

Layout: a classic ray diagram. A horizontal mirror at y = 560 runs from x = 300 to
900, and the ray hits it at O = (600, 560). A ray box (light lib `rayBox`)
sits at the upper left. Rays are 330 px long. At i = r = 40°
the incident ray starts at (388, 307) and the reflected ray ends at (812, 307).

- `bounce`: the ray leaves the box, hits O with a small flash, and bounces off to
  the upper right.
- `normal`: the dashed normal rises from O to (600, 240), with a right-angle box
  and "90°".
- `rule`: an arc between the ray and the **mirror surface** flashes and is crossed
  out. Then an arc between the ray and the **normal** appears with a tick. Chip
  "measure from the normal".
- `rays`: `labelLine` names the "incident ray" and the "reflected ray".
- `inc`: the amber arc `i` with "40°", between the incident ray and the normal.
- `ref`: the cyan arc `r` with "40°", between the reflected ray and the normal.
- `law`: a card reads "angle of incidence = angle of reflection", then a big
  "i = r" drops beneath it.
- `sweep`: the ray box swings so the incident ray sweeps from 40° to 60° (start
  (314, 395), end (886, 395)) and back to 30° (start (435, 274), end (765, 274)).
  The reflected ray mirrors it frame by frame, and live readouts tick
  "i = 30°, r = 30°" at the end. ★ **Showpiece**.
- `draw`: a three-item checklist on the right ticks off as each part of the diagram
  pulses: ① dashed normal ② arrows on the rays ③ i and r from the normal.
- `regular`: a new panel shows a smooth mirror with five parallel rays arriving at
  45°. They all leave parallel at 45°, and a crisp little face appears in the mirror.
  Label "regular reflection".
- `diffuse`: the surface turns into a zoomed, jagged edge with each tiny facet at a
  different tilt. Each of the five parallel rays reflects off its own facet with
  i = r about **that facet's own normal** (tiny dashed normals), so the reflected rays
  leave in five different directions. Label "diffuse reflection".
- `any`: two observer eyes at opposite sides above a sheet of paper each catch some
  of the scattered rays, and both get a tick. A small brick-wall icon carries
  "not a mirror".

## mirrors: Images in a plane mirror

Layout: a vertical plane mirror at x = 640 (y 170 to 640), with hatching on its
right (back) side. A candle (**new art**) stands 240 px in front, with its flame tip
at P = (400, 330) and its base at y = 520. An observer eye at lower left, about
(330, 590), is drawn about 90 px tall so it catches both rays.

- `plane`: the mirror slides in and the candle lights. A faint "?" floats behind
  the mirror.
- `two`: ray 1 runs from P to (640, 430) and reflects at 22.6°. Ray 2 runs from P
  to (640, 455) and reflects at 27.5°. Each has a short horizontal dashed normal with
  equal arcs, and the reflected rays reach the eye at y ≈ 559 and y ≈ 616.
- `back`: dashed extensions grow backwards from both hit points behind the mirror
  and meet at P′ = (880, 330). A ghostly, semi-transparent candle fades in there,
  upright and the same size. ★ **Showpiece**.
- `virtual`: a white screen card slides in behind the mirror at the image and stays
  blank. The dashed lines get the note "no light here". Chip "virtual".
- `distance`: two measuring arrows, candle → mirror "d" and mirror → image "d",
  with "same distance".
- `upright`: height bars beside the candle and its image are equal, both pointing
  up. Chips "upright", "same size".
- `lateral`: a new panel shows a kit `person` facing the mirror and raising their
  right hand. The reflection raises the hand on the same side of the picture, and
  labels read "your right" and "its left".
- `ambulance`: an ambulance front (**new art**) with "AMBULANCE" mirror-written
  (text with `scale(-1,1)`). A rear-view mirror frame pops up showing it reading
  correctly.
- `updown`: on the person and their reflection, a vertical up-arrow is unchanged in
  the image. A horizontal arrow pointing towards the mirror comes out reversed
  behind it. Label "front ↔ back, not up ↔ down".
- `vusl`: four chips arrive one by one (V Virtual, U Upright, S Same size,
  L Laterally inverted) under the header "Very Useful Smooth Looking-glass".

## refraction: Refraction: light changes speed and bends

Layout: the top half of the stage is air and the bottom half is glass, with the
boundary at y = 400 and the hit point at (600, 400). Then the glass of water, then
the rectangular block.

- `slow`: three lanes labelled air, water and glass. A light pulse races along each
  as a row of dots, and the dots bunch closer (slower) in water and closest in glass.
- `bend`: a ray from (401, 233) meets the boundary at 50° and carries on into the
  glass at 30.7°, to (733, 624). A flash at the boundary. Label "refraction".
- `why`: a thought bubble "it wants a shortcut" gets a `strike`, and the chip
  "its speed changes" gets a `tick`.
- `towards`: the dashed normal through the hit point, with arcs i = 50° (air) and
  r = 31° (glass). The refracted ray sits visibly closer to the normal. Note
  "slows → bends towards the normal".
- `away`: the same path replays with the arrows reversed (glass → air), with 31° in
  the glass and 50° in the air. Note "speeds up → bends away from the normal".
- `sloto`: chip "SloTo" beside the towards case and "FastAway" beside the away case.
- `zero`: a ray goes straight down the normal and does not bend. Its dot spacing
  still tightens in the glass. Note "no bend, just slower".
- `pencil`: back to the kit `beaker` and pencil. The water surface is at y = 380,
  the pencil enters at (600, 380) and its real tip is at (690, 560). A ray leaves
  the tip, meets the surface at about (583, 380) at 30.6° from the normal, and bends
  away to 42.8° on its way to the eye at (380, 160). The ray is then extended straight
  back (dashed) into the water, and the apparent tip appears on it at about
  (685, 490), higher than the real one. The underwater pencil is redrawn from
  (600, 380) to (685, 490): the "snap". Chip "Try it at home!". ★ **Showpiece**.
- `pool`: a pool cross-section with the real floor dashed and the apparent floor
  solid and shallower. A ray from the floor bends away from the normal at the
  surface into a swimmer's eye. Then a star twinkles (its opacity flickers) above a
  band of lib `heatWaves` moving air, and its ray wobbles.
- `block`: a rectangular glass block, top face y = 260, bottom face y = 500,
  x 400 to 800. A ray box at the upper left sends a ray from (327, 131) to the top
  face at A = (480, 260) at 50°.
- `inout`: inside, the ray runs at 30.7° to B = (623, 500). At A the arcs read
  50° / 31°, labelled "towards". At B the arcs read 31° / 50°, labelled "away".
  The emerging ray runs from B to (791, 641).
- `parallel`: a dashed "no block" line carries on from A in the original direction
  (it would cross y = 500 at x = 766). The emerging ray glows alongside it, and
  parallel marks (∥) appear on both.
- `shift`: a double-headed arrow, perpendicular to the two parallel rays and about
  92 px long, is labelled "lateral displacement".

## dispersion: Dispersion: splitting white light

Layout: a dark stage with an equilateral glass prism, apex up: apex at (600, 250),
base corners at (427, 550) and (773, 550). A white screen stands at x = 1060.

- `white`: a white beam crosses the stage. A zoom bubble shows it is seven coloured
  threads bundled together. Chip "a mixture of all colours".
- `prism`: the prism slides in. The beam from (231, 500) rises at 19.5° to the left
  face at (514, 400), bends towards the normal and runs horizontally to the right
  face at (687, 400). Both faces get their dashed normals.
- `speeds`: inside the prism the seven threads begin to separate. Violet's dots are
  bunched closest (slowest) and red's spaced widest.
- `fan`: at the right face the colours fan out to the screen, red highest (bent
  least, about 12° below horizontal) and violet lowest (bent most, about 28°). The
  real spread is about 2°; exaggerate it, but keep the order. Labels "red bends
  least" and "violet bends most". ★ **Showpiece**.
- `name`: the word "dispersion" sets above the prism.
- `order`: the colour names light up down the spectrum: red, orange, yellow, green,
  blue, indigo, violet.
- `richard`: chips "Richard Of York Gave Battle In Vain", with each initial in its
  own colour, line up beside the names.
- `notadd`: a chip "the prism adds colour" gets a `strike`. The fan runs backwards
  into the zoom bubble of seven threads: they were there all along.
- `rainbow`: a landscape with a kit `person` from behind, kit `sun` low behind them
  and rain falling in front. A rainbow arc builds, red on the outside and violet on
  the inside. Inset: one raindrop, with sunlight refracting in, reflecting off the
  back of the drop and refracting out as a small fan of colours heading back towards
  the person.
- `behind`: arrows mark "Sun behind you" and "rain in front".

## colour: Seeing colour: objects and filters

Layout: a white lamp on the left, an object in the middle and an observer eye on
the right. White light is drawn as a bundle of six coloured threads (red, orange,
yellow, green, blue, violet).

- `why`: a red apple and the eye, with chip "why red?".
- `apple`: the thread bundle strikes the apple. Five threads stop at the skin and
  sink into it with a small dark pulse (absorbed). Only the red thread bounces on to
  the eye. Labels "reflects red" and "absorbs the rest". ★ **Showpiece**.
- `leaf`: the apple swaps for kit `leaf`. Only the green thread reflects.
- `whiteblack`: split panel. A white card reflects all six threads (they rejoin
  white), and a black card absorbs all six, so nothing comes back.
- `noglow`: the lamp switches off and the apple goes black. The chip "it glows red"
  is struck through, and so is the chip "turns light red".
- `filter`: a red filter (a translucent red pane) stands in the white beam. Six
  threads go in and only red comes out; the others stop inside it. Labels
  "transmits red" and "absorbs the others".
- `selfish`: chip "a filter is selfish". The red filter passes red, then a green
  filter swapped in passes only green.
- `blue`: a blue book under the white lamp reflects a blue thread towards the eye.
  A red filter held in front of the eye stops it. The book seen through the filter's
  window is black.
- `shirt`: split panel. On the left, in white light, a red T-shirt has a green star
  logo. On the right, the lamp shines through a red filter: the shirt still reflects
  red, but the logo has no green to reflect and turns black.

## eye: The human eye

Layout: a large cross-section of the eye, side view, looking left (light lib
`eyeSection`, shared with `focus` and the quiz): eyeball centre (700, 400), radius 220. The cornea bulges at
the front (left edge). The iris is two short bars with the pupil gap between them,
the lens is an ellipse just behind, the retina is a pink lining around the back, and
the optic nerve leaves the back slightly below centre. An upright tree (object) on
the far left. Parts are labelled with kit `labelLine`, with labels kept clear of the
top-left tag area.

- `instrument`: the eyeball outline draws in; the tree appears on the left.
- `cornea`: the cornea glows and is labelled. Rays from the tree bend strongly as
  they cross it.
- `pupil`: the gap glows, labelled "pupil (a gap)".
- `iris`: the iris glows and is labelled. A front-view inset (light lib `irisFront`) appears at the upper right.
- `bright`: in the inset, kit `sun` appears and the pupil shrinks to small; the sun
  dims and the pupil opens wide.
- `cinema`: a kit `person` (`walkPose`) walks from a bright doorway into a dark
  cinema. The inset pupil starts small and widens, and the rows of seats fade into
  view.
- `lens`: the lens glows and is labelled.
- `retina`: the back lining glows and is labelled.
- `inverted`: rays from the top of the tree bend at the cornea and lens and land
  **low** on the retina, while rays from its base land **high**. An upside-down tree
  appears on the retina. Chip "real, inverted". ★ **Showpiece**.
- `brain`: a yellow signal pulse travels back from the retina to a brain icon
  (**new art**), and a thought bubble shows the tree the right way up.
- `glasses`: two quick cases: rays meeting in front of the retina (blurry) and
  behind it (blurry). A glasses lens slides in front of the eye and the rays meet
  exactly on the retina (sharp, tick).

## focus: Focusing the eye: near and far

Layout: a close-up of the lens: lens centred (560, 400); ciliary muscle (pink,
muscle-striped) cross-sections above and below at about (560, 190) and (560, 610);
suspensory ligaments as fine white fibres from each muscle to the lens rim; a
retina line on the right at x = 1000. Objects enter from the left.

- `shape`: a book (near) and a tree (far) alternate on the left while the lens
  morphs fatter and thinner once. Chip "accommodation".
- `ciliary`: the muscles glow and are labelled "ciliary muscles".
- `ligaments`: the fibres glow and are labelled "suspensory ligaments".
- `near`: the book sits close, so its rays spread strongly. The muscles **contract**
  (bulge and move in towards the lens), the ligaments go **slack** (wavy lines), and
  the lens grows **fatter and more curved**. The rays bend more and meet exactly on
  the retina. Tags "contract", "slack", "fatter", "bends more". ★ **Showpiece**.
- `far`: the tree is far away, so its rays arrive almost parallel. The muscles
  **relax** (move outward), the ligaments pull **tight** (straight lines), and the
  lens stretches **thinner and flatter**. The rays bend less and still meet on the
  retina. Tags "relax", "tight", "thinner", "bends less".
- `sclera`: zoom out to the whole eye from the `eye` chapter. The outer white coat
  glows, labelled "sclera", and the front-view inset shows "the white of your eye".
- `optic`: the optic nerve glows and is labelled. Yellow signal dots run along it
  from the retina to the brain icon.
- `blind`: the point where the nerve leaves the retina gets a dark ring, labelled
  "blind spot: no light-sensitive cells". A ray landing exactly there fades out
  with no signal.

## mixing: Mixing coloured light: secondary colours

Layout: three spotlights (**new art**: simple stage lamps) above a dark screen,
casting circles of light about 300 px across. Draw the overlaps explicitly (clip
each lens-shaped overlap with `clipPath`) rather than relying on blend modes.

- `primary`: the red, green and blue lamps switch on one by one, making three
  separate circles. Header "primary colours of light".
- `add`: the red and green circles slide together until they overlap. A "+" chip,
  then "additive mixing".
- `yellow`: the red-green overlap turns yellow. Chip "R + G = yellow".
- `cyan`: the blue circle joins green; their overlap turns cyan.
- `magenta`: blue moves to overlap red too; that overlap turns magenta.
- `white`: the three circles settle into the classic Venn layout and the centre
  turns white. ★ **Showpiece**.
- `secondary`: the three overlap petals get labels: yellow, cyan, magenta,
  "secondary colours".
- `screen`: a phone shows a bright yellow flower. A magnifier glides over it and
  reveals only tiny red, green and blue stripes, with no yellow at all.
- `amounts`: inside the magnifier, the R, G and B stripes brighten and dim with
  little sliders, and the patch colour follows: red and green full make yellow, all
  three full make white.
- `cones`: a small eye with three cone icons (red, green, blue) on its retina.
  Their signals merge in the brain icon into a single colour swatch.
- `paint`: a palette where red, green and blue paint blobs are stirred together
  into a muddy brown. Beside it, the light Venn glows. Labels "lights add → brighter"
  and "paints subtract → darker".

## fibres: Trapped light: total internal reflection

Layout: a semicircular glass block with its flat face on top at y = 330 and the
centre of that face at O = (600, 330), radius 250, curved side down. A ray box
sends rays in through the curved side along a radius aimed at O, so they don't bend
on the way in. The normal at O is vertical. Then an optical fibre, then the
real-world panels.

- `out`: inside angle 25°. A bright ray refracts out into the air at 39.3°, bent
  away from the normal, and a faint (0.25 opacity) ray reflects back inside at 25°.
- `bigger`: the ray box swings so the inside angle grows from 25° to 38°. The
  escaping ray swings down to 67° and the reflected ray brightens a little.
- `critical`: at 41.8° the escaping ray lies flat along the surface (90°).
  Label "critical angle ≈ 42°".
- `total`: at 55° the escaping ray is gone. The reflected ray is now full brightness
  at 55°, with matching i and r arcs inside the glass. Label "total internal
  reflection". ★ **Showpiece**.
- `one`: condition card 1: "inside the denser material (glass → air)", with a tick.
- `two`: condition card 2: "angle of incidence > critical angle" with
  "55° > 42°", and a tick.
- `fibre`: a long, gently curving glass fibre (**new art**, about 60 px thick, with
  a glowing core) sweeps across the stage.
- `zigzag`: a light pulse enters the left end and zig-zags along, reflecting off
  the walls at about 70° to the local normal (always well above 42°, including round
  the bends), until it bursts out of the right end.
- `internet`: a world-map silhouette with glowing undersea cables carrying pulses.
  Then an endoscope (**new art**: a flexible tube with a light at its tip) inside a
  simple body outline.
- `diamond`: a brilliant-cut diamond, side view (**new art**: pavilion facets at
  about 41°). A ray drops straight in through the top. It meets the first pavilion
  facet at about 41° and the second at about 58°, both above diamond's 24° critical
  angle, so it reflects at both and flashes back out of the top with a sparkle.

## recap: Recap: memory hooks and exam traps

Layout: a memory board. The four mnemonic cards arrive in a 2 × 2 grid with mini
diagrams, then shrink to a top strip while the five traps list below with `tick` and
`cross` icons.

- `lock`: header "Lock it in" with an open padlock icon (**new art**).
- `richard`: card 1: a mini spectrum band with R O Y G B I V initials coloured.
- `sloto`: card 2: two mini refraction rays, "SloTo" (into glass, towards the normal)
  and "FastAway" (out of the glass, away from it).
- `vusl`: card 3: a mini mirror with the candle and its ghost image; chips V U S L.
- `selfish`: card 4: a red filter with white light in and red out. The full board
  pulses once and the padlock snaps shut. ★ **Showpiece**.
- `traps`: the cards shrink into the top strip; header "5 exam traps".
- `t1`: a mini angle measured from the surface (cross) beside the same angle
  measured from the normal (tick).
- `t2`: "real" crossed, "virtual" ticked, beside a mini mirror with a dashed image.
- `t3`: two mini rays: into glass bending towards the normal and out of glass bending
  away, both ticked; the chip "always towards" crossed.
- `t4`: a mini prism fan labelled "violet most, red least", ticked; the swapped
  version crossed.
- `t5`: a Moon icon reflecting a sunbeam: "luminous" crossed, "non-luminous" ticked.

## quiz: Quick-fire quiz

Layout: as Respiration's quiz. The question card is centred with five progress pips;
a lib `ring` countdown fills during each 4-second pause; the answer reveals with a
`tick` and a mini diagram.

- `intro`: title "Quick-fire quiz!" with five empty pips.
- `q1`: a mirror diagram with the amber arc "i = 40°" and a "r = ?" chip.
- `a1`: the cyan arc fills to "40°"; tick; pip 1 fills.
- `q2`: an air/glass boundary with an incoming ray and two ghost options for the
  refracted ray, one towards the normal and one away.
- `a2`: the "towards the normal" ray lights up; tick.
- `q3`: a blue book under a red spotlight, its colour hidden behind a "?".
- `a3`: the book turns black; tick.
- `q4`: "? + ? = yellow", with two empty spotlight circles.
- `a4`: the circles fill red and green and overlap into yellow; tick.
- `q5`: an eye with the image on its retina hidden; chips "true" and "false".
- `a5`: an upside-down tree appears on the retina; the "false" chip lights up.
- `outro`: a rainbow arc sweeps across, one spectrum colour at a time, over
  "Brilliant work!" and a chip pointing to the Science Lab quiz. ★ **Showpiece**.

## Suggested split for the animators

Balanced by length (from the timeline) and difficulty, with chapters that share art
kept together. Whoever has `eye` builds the eye cross-section; `focus` and the quiz
reuse it.

1. **intro, travels, shadows**: about 2.5 minutes. Medium: sources, simple rays,
   `person` and `sun`, the umbra and penumbra geometry.
2. **reflection, mirrors, colour**: about 3.5 minutes. Medium: the ray box, mirror,
   angle arcs and candle image, plus the coloured threads for colour.
3. **refraction, dispersion**: about 2.6 minutes. Hard: normals and Snell angles,
   the pencil, the glass block, and the prism and rainbow.
4. **eye, focus, mixing**: about 3.3 minutes. Hard: the eye cross-section, the lens
   morph, and the Venn overlaps with the magnifier.
5. **fibres, recap, quiz**: about 3.6 minutes. Medium to hard: the TIR sweep and
   fibre zig-zag, then the mini-diagrams for the recap and quiz, which reuse the art
   from groups 1 to 4.

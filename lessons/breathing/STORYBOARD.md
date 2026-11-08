# Breathing: storyboard

What the screen shows while each line is spoken. Stage 1200 × 750; keep
x < 560, y < 100 clear for the chapter tag. Palette as in PLAYBOOK §5: O₂ red
pairs (`molO2`), CO₂ O=C=O (`molCO2`), glucose amber hexagon, energy yellow
(`spark`), blood `C.blood`, air `C.air`. In close-ups where many gas
particles move at once, use small dots instead of molecules: red for oxygen,
grey for carbon dioxide (keep the same two colours in every chapter).

Shared art used across chapters (keep it identical wherever it appears):

- **Lungs**: lib `lungs(parent, s)`; `g.set(breath 0..1)` inflates them. Drive
  idle breathing with lib `wave(t, 3.6)` (toned down when `S.reduce`).
- **Airway tree** (new art): mouth and nose, the trachea with C-shaped
  cartilage rings, two bronchi, bronchioles branching three or four times, and
  grape-like alveolus clusters at the tips. Draw it progressively from the top
  (`pathLength` dash reveal). Used in system, smoking and recap.
- **Chest, front view** (new art): rib arcs on each side with intercostal
  muscle bands between them, lib `lungs` inside, and the diaphragm as a thick
  dome below that can flatten (`g.set(in 0..1)`: diaphragm flat, ribs swung up
  and out). Used in three, system, mechanism and exercise.
- **Alveolus close-up** (new art): one pale blue air sac with a thin wall, a
  capillary curving round it, blood flowing from a bluish end (arriving) to a
  red end (leaving), red blood cells as small red discs. Used in three,
  exchange, alveoli and smoking.
- **Limewater tube**: kit `testTube` with `g.set(level, colour)`, a delivery
  tube, lib `bubbles`; clear liquid turning milky white. Used in air and quiz.

## intro: The hidden muscle under your lungs

A large kit `person` (front view) with lib `lungs` showing in the chest,
breathing gently. Showpiece: the lungs breathing in time with a fast-climbing
breath counter (hook).

- **hook**: Showpiece. The person breathes steadily (`lungs.set` driven by
  `wave(t, 3.6)`); a counter beside them races up to "22,000 breaths a day".
- **lungs**: The breathing freezes mid-breath and a "?" appears over the lungs;
  below them, the outline of a dome-shaped muscle pulses faintly (the hidden
  muscle). Then a small grey Moon slides in at the right with its own "?".
- **def**: Moon and "?" fade. Title "breathing and gas exchange"; red `molO2`
  pairs flow in down the windpipe and `molCO2` flow out.
- **plan**: Roadmap row of three icons that pop in turn: the airway tree, the
  chest with its diaphragm, an alveolus with an O₂ dot crossing into blood.

## three: Breathing, gas exchange and respiration

Three panels left to right, as in the topic diagram: "Breathing" (small
lungs), "Gas exchange" (alveolus close-up), "Respiration" (a body cell with a
lib `mitochondrion`). Showpiece: one oxygen molecule travelling through all
three panels (order, cells).

- **muddle**: Three word chips ("breathing", "gas exchange", "respiration")
  tumble over each other, then settle as the three panel headings.
- **breathing**: Panel 1 lights: small `lungs` inflate and deflate, with air
  arrows in and out of the windpipe. Label "ventilation = moving air".
- **muscles**: The diaphragm and rib arcs round the lungs pulse in time; a chip
  "chemical reaction?" gets a `cross`.
- **gasex**: Panel 2 lights: the alveolus close-up, sac beside a capillary.
- **swap**: Red dots cross from the sac into the blood and grey dots cross the
  other way; label "diffusion".
- **resp**: Panel 3 lights: a lib `animalCell` with a `mitochondrion`; a
  glucose hexagon and an O₂ pair go in and a `spark` glows.
- **eq**: The word equation types in under panel 3: glucose + oxygen → carbon
  dioxide + water (+ energy).
- **order**: Showpiece. One `molO2` travels from the air into panel 1's lungs,
  then across into the blood in panel 2; the arrows linking the panels light up
  as it passes.
- **cells**: The O₂ rides a red blood cell into panel 3's cell, and the spark
  flashes.
- **notsame**: Banner "breathing ≠ respiration". Panel 1's person holds their
  breath (cheeks puffed, lungs still) while panel 3's spark keeps flashing.

## system: The parts of the respiratory system

The airway tree draws in from the top down on the left half; close-up insets
appear on the right. Then the chest assembles around it. Showpiece: the mucus
escalator (escalator).

- **tree**: An upside-down tree silhouette (trunk at the top, branches below)
  morphs into the outline of the airway.
- **nose**: Inset: a head in profile, air entering the nose; three small icons
  pop up: warming (orange glow), moistening (droplets), filtering (dust caught
  on hairs).
- **trachea**: The trachea draws down from the throat. Label "trachea
  (windpipe)".
- **cartilage**: C-shaped rings appear along it; an inset cross-section shows a
  C ring keeping the tube round as air is drawn through.
- **goblet**: Inset of the airway lining: cup-shaped goblet cells ooze a sticky
  mucus layer; dust and germ dots stick to it. Label "goblet cells: mucus".
- **cilia**: Next to them, ciliated cells: rows of tiny hairs beat in a
  Mexican wave. Label "cilia".
- **escalator**: Showpiece (1 s pause). The mucus layer slides steadily up
  the inset like an escalator, carrying the dirt to the throat, where it drops
  out of view ("swallowed").
- **bronchi**: Back to the airway: the trachea splits into two bronchi, one to
  each side. Labels "bronchi" and "one bronchus".
- **bronchioles**: Bronchioles branch out again and again, each generation
  drawing in quickly after the last.
- **alveoli**: Grape-like clusters of alveoli pop out at the tips; an inset
  zooms on one cluster. Label "alveoli: gas exchange happens here".
- **count**: A counter runs up to "300–500 million" as the clusters multiply.
- **tbba**: Labels T, B, B, A light up down the airway in order, under "Tall
  Brontosaurs Breathe Air", with a small cartoon brontosaurus.
- **chest**: The chest builds round the airway: lib `lungs` fill the space, rib
  arcs close round them with intercostal bands between, and the diaphragm dome
  sits below. Kit `labelLine` labels each part.
- **pleura**: Zoom on the edge of one lung: two thin membranes with a fluid
  layer between; the lung slides against the chest wall but stays against it.

## mechanism: How you breathe in and out

The chest (front view) on the left; on the right, a lib `meter` for chest
volume and one for pressure, with a dashed "air outside" marker on the
pressure meter. Then the bottle model, then the Moon. Showpiece: the whole
in-breath with every part moving together (in → rush).

- **nomuscle**: Lungs alone in the chest; a flexed-arm muscle icon with a
  `cross`: "no muscles to pull air in".
- **rule**: Two kit `particleBox` gas boxes joined by a gap: the crowded one
  ("high pressure") empties into the sparse one ("low pressure").
- **in**: Boxes fade. Heading "Breathing in"; the diaphragm contracts and
  flattens, moving down (`chest.set` starts towards 1), with a down arrow.
- **ribs**: The ribs swing up and out as the intercostal bands shorten; up and
  out arrows.
- **volume**: The chest outline grows; the volume meter rises.
- **pressure**: Air particles inside the chest spread apart; the pressure meter
  falls below the "air outside" marker.
- **rush**: Showpiece (0.8 s pause). Air arrows rush in down the trachea and
  `lungs.set(1)` inflates them; the particles outside are shown pushing in.
- **out**: Heading "Breathing out"; the diaphragm relaxes and domes up, the ribs
  swing down and in (`chest.set` back towards 0).
- **outvol**: The volume meter falls, the pressure meter rises above the
  outside marker, air arrows stream out and `lungs.set(0)`.
- **chain**: Two rows light up step by step: "volume ↑ → pressure ↓ → air in"
  and "volume ↓ → pressure ↑ → air out".
- **passive**: A gentle breath out with no muscle arrows: the lungs shrink back
  by themselves like a stretched balloon. Chip "passive".
- **dips**: "IN" with its I glowing; "dips", "rise", "rises", "dips" appear by
  the diaphragm, ribs, volume meter and pressure meter, each with its i
  glowing.
- **model**: The chest fades; the bottle model draws in (new simple art): a
  plastic bottle with its bottom cut off, a balloon "lung" on a straw inside, a
  rubber "diaphragm" stretched across the bottom. Labels.
- **pull**: The rubber sheet is pulled down and the balloon inflates; pushed
  back up, it deflates (0.5 s pause).
- **moon**: A kit `person` stands on the grey Moon under a black sky; air
  arrows start towards the mouth and fade away: "no air to push in".

## exchange: Gas exchange in the alveoli

The alveolus close-up fills the stage, the capillary along its right side,
blood flowing up from the bluish end to the red end. Showpiece: oxygen dots
crossing the wall into the blood (otwo).

- **net**: A cluster of alveoli wrapped in a net of thin red capillaries; the
  view zooms into one alveolus and its capillary. Label "capillaries".
- **diffusion**: A side demo: dots spread from the crowded half of a box into
  the empty half until even. Label "high → low concentration".
- **blood**: Bluish blood enters the capillary from below, carrying few red dots
  and many grey dots. Labels "low in oxygen", "high in carbon dioxide".
- **air**: The sac fills with many red dots and few grey dots. Label "fresh
  air".
- **otwo**: Showpiece (0.6 s pause). Red dots stream across the thin wall into
  the blood, which turns redder as it flows up.
- **cotwo**: Grey dots stream out of the blood into the sac, then up and out
  through the bronchiole.
- **rbc**: Red blood cells in the capillary pick up the red dots, which cling to
  them (label "haemoglobin"), and carry them off the top of the stage.
- **nopump**: A pump icon with a `cross`; a bold arrow from high to low
  concentration, labelled "concentration gradient".
- **refresh**: Breath arrows pulse into the sac and top up its red dots; the
  gradient arrow stays bold: "kept steep".
- **altitude**: A mountain slope with a kit `person` in `walkPose` and an
  oxygen tank on the back; a breath bubble beside them holds fewer red dots.

## alveoli: Alveoli: built for fast gas exchange

The alveolus close-up at the centre, with four adaptation tiles that light up
round it. Showpiece: the alveoli unfolding into a badminton court (area).

- **built**: The central alveolus with speed lines and a chip "faster
  diffusion".
- **factors**: Three factor chips: "large surface area", "short distance",
  "steep concentration gradient".
- **area**: Showpiece. A cluster of alveoli unfolds into a flat sheet that
  spreads out into the outline of a badminton court, labelled "about 70 m²".
- **thin**: Zoom on the wall: the alveolus wall and the capillary wall, each one
  flat cell thick; a tiny measure bar across both. Tile 1 lights: "thin
  walls".
- **short**: A red dot hops across both walls in a blink (0.5 s pause); the
  distance arrow is tiny.
- **moist**: A thin blue film of moisture lines the sac; red dots shimmer into
  it (dissolving) before they cross. Tile lights: "moist lining".
- **blood**: Blood flows quickly past, carrying red dots away and bringing fresh
  bluish blood; the gradient arrow stays bold. Tile lights: "rich blood
  supply".
- **vent**: Fresh air arrows pulse in and out of the sac with each breath. Tile
  lights: "ventilation".
- **tims**: The tiles show T, I, M, S with their icons: thin wall, capillaries,
  moisture, surface area.
- **second**: A stopwatch reads "under 1 second" as one red blood cell zips past
  and turns bright red.

## air: Inhaled vs exhaled air, and limewater

Left: a bar chart with two bars per gas, "breathed in" and "breathed out".
Right: the limewater tubes. Showpiece: breathed-out air turning limewater
milky first (test).

- **table**: Column headings "breathed in" and "breathed out" with a small kit
  `person` between them, an arrow in and an arrow out.
- **oxygen**: Oxygen bars rise: 21% and 16%.
- **cpr**: A first-aider gives a rescue breath to a person lying down; red dots
  pass from one to the other.
- **cotwo**: Carbon dioxide bars: a tiny 0.04% sliver and a 4% bar, shown on a
  zoomed scale; a chip "× 100".
- **nitrogen**: Nitrogen bars, both at 78%, with a chip "unchanged".
- **water**: Water vapour bars go from low to high; a cold window beside them
  fogs up with a breath.
- **warm**: A lib `thermometer` beside the breathed-out column rises a little.
- **lime**: The chart fades. One limewater tube: clear liquid, CO₂ bubbles in
  through the delivery tube and it turns milky.
- **test**: Showpiece (0.4 s pause). Two tubes side by side, each with a
  small timer: breathed-out air bubbles through the left one, which goes milky
  fast; room air is drawn through the right one, which stays clear for much
  longer.
- **proves**: Chip "breathed-out air: far more carbon dioxide" with a `tick`.

## exercise: Exercise: breathing rate and depth

Left: a kit `person` running (`runPose`). Right: a breathing trace made with
kit `sineWave` (amplitude = depth, wavelength = rate), a heart-rate readout
and a CO₂ `meter`. Showpiece: the trace getting faster and deeper (rate,
depth).

- **harder**: The person starts running (`g.pose(runPose(t, speed))`); their leg
  muscles glow with small `spark`s.
- **needs**: Red arrows into the muscles and grey arrows out of them, both
  growing.
- **rate**: The `sineWave` trace scrolls; its wavelength shortens (more breaths
  per minute). Label "rate ↑".
- **depth**: Showpiece (0.5 s pause). The trace's amplitude grows and small
  lungs beside it inflate further each breath. Label "depth ↑".
- **trigger**: A brain icon with a CO₂ `meter` beside it.
- **rising**: The CO₂ meter climbs; signal pulses run from the brain down to the
  chest, and the trace speeds up again.
- **notwant**: A thought bubble "I want more oxygen" gets a `strike`; chip
  "carbon dioxide is rising" with a `tick`.
- **hold**: The runner fades; a person holds their breath (puffed cheeks) while
  the CO₂ meter climbs into the red, until they gasp.
- **heart**: A heart icon beats faster as its rate readout climbs.
- **debt**: The runner slows to a walk (`walkPose`) and stops; the trace stays
  fast, then settles; pink lactic acid dots in the muscle shrink as red dots
  arrive. Label "oxygen debt".
- **count**: A stopwatch and tally marks: a resting count, a higher count after
  star jumps, then counts falling back as breathing settles.
- **recovery**: A small graph of breathing rate against time after exercise:
  two curves falling back to resting, the fitter person's faster. Label
  "recovery rate".

## smoking: Smoking and other harm to the lungs

A cigarette and its smoke on the left; the airway and alveolus close-ups from
earlier chapters, damaged step by step. Showpiece: alveolus walls breaking
down and merging (emphysema).

- **delicate**: The airway tree glows softly; a cigarette slides in with grey
  smoke drifting towards it.
- **tar**: Sticky brown tar coats the inside of the airway.
- **cancer**: A warning chip "carcinogen: causes cancer" over the tar; a dark,
  lumpy cluster of cells grows in one airway wall.
- **cilia**: Inset of the lining: the cilia stop beating and lie flat; mucus
  piles up; a cough icon; germ dots multiply.
- **co**: A red blood cell with four binding spots: grey-black carbon monoxide
  pairs grab the spots before the red O₂ dots can, so fewer O₂ ride away.
- **strain**: A heart icon pumps harder; a small baby silhouette with an oxygen
  `meter` that drops.
- **nicotine**: A padlock-and-chain icon "addictive"; heart-rate and
  blood-pressure gauges rise.
- **cct**: Three initials light up, C, C, T, with icons: carbon monoxide pair,
  tar drop, nicotine chain.
- **emphysema**: Showpiece (0.5 s pause). A healthy cluster of small alveoli;
  the walls between them dissolve and they merge into a few big sacs.
- **area**: Side by side: the healthy cluster ("big surface area") and the merged
  sacs ("small surface area"); a person beside them, out of breath at rest.
- **diseases**: Chips "lung cancer" and "bronchitis".
- **other**: Three icons: asbestos fibres, fine dust, a smoggy skyline; the
  airway lining reddens (inflamed); an asthma inhaler.
- **vaping**: A vape with a vapour cloud: "no tar" with a `tick`, "nicotine"
  with a warning sign, "long-term effects?" chip.

## recap: Recap: memory hooks and exam traps

A deck of cards, as in Respiration's recap: four mnemonic cards, then five
numbered trap cards (wrong version struck with `strike` and `cross`, right
version with `tick`). Showpiece: the four mnemonic cards fanned out together
before the traps.

- **lock**: Title "Lock it in" with a padlock that clicks shut.
- **tbba**: Card 1: "Tall Brontosaurs Breathe Air" beside a small airway tree
  with T, B, B, A down it.
- **dips**: Card 2: "Breathing IN" with dips, rise, rises, dips, each i
  glowing, beside a small chest icon.
- **tims**: Card 3: "TIMS" with the four tile icons.
- **cct**: Card 4: "Cigarettes Cause Trouble" with the three icons; the four
  cards fan out together.
- **traps**: Cards sweep away; heading "5 exam traps" with a warning triangle.
- **t1**: Trap 1: "breathing = respiration" struck; lungs vs a cell's spark.
- **t2**: Trap 2: "diaphragm relaxes to breathe in" struck; a small diaphragm
  flattening with "contracts".
- **t3**: Trap 3: "lungs pull air in" struck; the pressure meter dropping and
  air arrows rushing in.
- **t4**: Trap 4: a pump with a `cross`; dots diffusing across a wall.
- **t5**: Trap 5: "breathe out pure CO₂" struck; the out-breath bars "16% O₂"
  and "4% CO₂".

## quiz: Quick-fire quiz

As Respiration's quiz: a question card with a lib `ring` countdown during each
4-second pause, then the answer card with one icon. Showpiece: the answer
reveals.

- **intro**: Title "Quick-fire quiz!" with five empty answer dots.
- **q1**: Question card; `ring` counts down.
- **a1**: The airway tree with its four labels lighting in order.
- **q2**: Question card; `ring`.
- **a2**: The diaphragm flattening, labelled "contracts".
- **q3**: Question card; `ring`.
- **a3**: Red dots crossing the alveolus wall into the blood.
- **q4**: Question card; `ring`.
- **a4**: A limewater tube turning milky.
- **q5**: Question card; `ring`.
- **a5**: Carbon monoxide pairs grabbing a red blood cell's spots.
- **outro**: "Brilliant work" with a button-style chip "Breathing quiz →
  Science Lab".

## Suggested split for the animators

Four groups, balanced by length (narration seconds, from timeline.json) and difficulty:

1. **intro, three, system** (196 s). Owns the lungs and the airway tree,
   including the cilia and mucus close-up that smoking reuses.
2. **mechanism, exchange, alveoli** (235 s). The hardest group: the
   moving chest, and the alveolus close-up shared by exchange and alveoli.
   If a fifth animator is free, give mechanism its own slot.
3. **air, exercise** (155 s). Bar chart, limewater tubes, the running
   person and the `sineWave` breathing trace.
4. **smoking, recap, quiz** (222 s). Copy the airway, cilia and alveolus
   art from groups 1 and 2; recap and quiz are mostly cards.

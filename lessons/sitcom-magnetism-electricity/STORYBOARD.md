# DRAWER 8B, Episode 12 "The Practical": storyboard

A mockumentary sitcom (documentary crew, characters talk to camera) that teaches Magnetism & Electricity.
Audience: a 12-year-old watching while eating. It must be FUNNY first, and teach every idea exactly.
Premise: the week before Kavya's Year 8 practical test, a documentary crew films the equipment that lives in
drawer 8B in the prep room behind Lab Three. Each day of the week is one scene (Mon loop, Tue series, Wed parallel
and resistance, Thu magnets, Fri electromagnet, the next Mon test day and static). Read `script.py`: every line has
a speaker (`who`), and its caption shows the speaker's name.

## Comedy rules (the most important part)

- **Mouths:** only the speaker's mouth moves. Every frame: `c.set({ t, talk: scTalk(S, t, 'cecil'), mood, look })`.
  Nora and Stan are ONE character (`cast(.., 'magnet')`): `talk: scTalk(S,t,'nora'), talkB: scTalk(S,t,'stan')`,
  `mood`/`look` for Nora, `moodB`/`lookB` for Stan.
- **Reactions sell the joke.** Listeners look at the speaker (`look` -1..1) and change mood on the beat:
  Cecil goes `deadpan` at every silly remark (he is the tired straight man), Dimitri `smug`/`happy` when lit and
  `sad`/`shock` when dimmed, Eddie always `happy`, Amy `neutral`/`smug` (proud of her readings), Vic `deadpan`
  always (he never changes, which is the joke), Auntie Rez `annoyed` (default) and `smug` when she wins, Nora
  `happy`/`annoyed`, Stan `deadpan`/`happy`, Sol `sad` when off and `smug`/`happy` when on.
  Moods: neutral, happy, smug, annoyed, sad, shock, deadpan.
- **Pauses are punchlines.** Lines with a `pause` are followed by silence. Hold the reaction there: a slow push-in
  on Cecil's deadpan face, Vic blinking, Dimitri staring in the dark.
- **Talking heads** (line ids starting `th`, plus the ones marked TH below) use the confessional shot:
  `drConf(root, kind)` full stage (a tinted `scConfessional`), the speaker big (s about 1.4) at about (430, 400).
  The first time a character appears (in a confessional or not), show
  `scLowerThird(root, ...DR_LOWER[kind])` for about 3 s. Cut instantly (fade 0.25 s at most): sitcom cuts are snappy.
- **Science on screen:** whenever a key word, rule or number is said, it appears big and clear (chip, card,
  badge, meter reading or whiteboard). Circuits are drawn with the kit symbols (`cellSym`, `bulbSym`,
  `switchSym`, `resistorSym`, `meterSym`, `wire` with moving dots) on `drBench`. The jokes can be silly; the
  science must be exact: current dots in `wire()` move + to − (conventional) unless the beat is about electrons;
  field lines N → S outside a magnet and never crossing; ammeters IN the loop, voltmeters ACROSS a component.
- **Running gags to keep visible:** every electron is an Eddie (crowds of `drElectron`, all identical); Cecil is
  NOT a battery; Vic only communicates with his sign (`vic.set({ sign: '1.5 V' })`); Dimitri's brightness is his
  mood (`glow`); Sol is a limp nail when off; "the rubber band incident" (a rubber band with a red ✗).
- Keep the engine's chapter tag area clear (x < 560, y < 100). Labels at least 26 px.

## Cast (lib.js `cast(root, kind, { s, mood })`)

| kind | who | look | lower third (`DR_LOWER`) |
| --- | --- | --- | --- |
| cecil | Cecil, a 1.5 V cell: tired, dry, sarcastic; has run the drawer since 2015 | upright navy cell, gold "1.5 V" band, + nub, cell-symbol pass | CECIL / Cell, 1.5 V. Not a battery. |
| eddie | Eddie, an electron (and all the other Eddies): over-enthusiastic | bright blue ball, backwards yellow cap with a "−" logo; crowds: `drElectron` | EDDIE / Electron. One of many Eddies. |
| dimitri | Dimitri, a lamp: a diva; brightness = ego; keeps being made dim | light bulb, filament quiff, red bow tie; `glow` 0..1 | DIMITRI / Lamp. The star (he says). |
| amy | Amy, an ammeter: brisk, loves queues and checking | round meter, RED rim, needle (`needle`), "A" tab, pen | AMY / Ammeter. Always in the line. |
| vic | Vic, a voltmeter: silent, stands across things, holds up signs | same meter, BLUE rim, "V" tab, three hairs, sign (`sign`) | VIC / Voltmeter. Stands across. Silent. |
| rez | Auntie Rez, a resistor: strict auntie, slows everybody down | beige capsule, colour bands, grey bun, half-moon glasses, wire legs | AUNTIE REZ / Resistor. Slows everyone down. |
| magnet | Nora (N, red, left, pink bow) and Stan (S, blue, right, flat cap, moustache): one bar magnet, married 40 years | 320 px bar, two faces | NORA & STAN / Bar magnet. North and south. 40 years. |
| sol | Sol, a solenoid on an iron nail: limp when off, gym bro when on | copper coil, nail head and point, wire arms; `on` 0..1, `pole` | SOL / Solenoid. Electromagnet (when on). |
| kavya | Kavya, 12, the human: exasperated, sharp | `scKavya` bust; full body `scKavyaBody` | KAVYA, 12 / Practical test in one week. |

Sets: `drCabinet` (prep room wall of drawers, 8B opens), `drDrawer` (inside drawer 8B: the "office", cast stands on
the grey foam, feet about y 600), `drLab` (Lab Three with HDB window and bench), `drBench` (dark bench top for
circuits), `drFlat` (Kavya's HDB flat at night: aircon, ceiling lights, brother's lamp), confessionals `drConf(kind)`.
Props: `drBadge(sym, name)` staff passes with circuit symbols, `drSym`, `drSign`, `drElectron`, `drCompass`,
`drField` (field lines), `drFilings`, `drDomains`, `drComb`, `drArrowCurrent`, `scClipboard`.

## 0 cold: Cold open (card: none)
- kavya: `drLab`; Kavya (scKavya s 1.3) behind the bench at about (420, 470), annoyed, eyes on camera. Chips pop in:
  "Kavya, age 12", a calendar page "PRACTICAL TEST: 7 DAYS" with a red ring, and on "build a working circuit" a
  worksheet card "TASK: build a working circuit" with a doodled lamp.
- plan: tight on Kavya (push-in); lower third KAVYA. On "four videos" a phone with "4 videos watched ✓"; on
  "zero circuits" a big "0"; on "confidence" she goes smug and a sticky note "PLAN: confidence" slaps onto the
  worksheet. Hold her smug face in the 0.6 s pause.
- small: documentary whip-pan to the right: the lab blurs past; chip "something much less interesting: a drawer".
- drawer: `drCabinet`; the camera pushes in on drawer 8B; its label and the yellow DO NOT TOUCH sticker are readable;
  at the end the drawer slides open (`g.open`) and pairs of eyes blink in the dark.
- hi: confessional `drConf('cecil')`; Cecil (s 1.45) at (430, 410), deadpan; lower third CECIL. Chip "cell" and a
  "1.5 V" card on "one point five volts".
- battery: a card: one cell symbol labelled "cell" = Cecil, then two cells in a row labelled "battery = 2 or more
  cells"; a stamp "NOT A BATTERY" lands across a photo of Cecil. Cecil annoyed on "And no".
- since: Cecil (deadpan) beside a wall calendar "2015" with dust; a battery-level icon "1.5 V ✓ (perfect)". On
  "I don't get out much" a cobweb in the corner of the frame. (Callback for the stinger, when Vic reads 1.4 V.)
- rubber: inside the drawer (`drDrawer`), the cast in a row on the foam (Cecil, Eddie, Dimitri, Amy, Vic, Rez,
  Nora & Stan, Sol), all turning to camera; on "rubber band" a framed photo slides in: a lamp, a cell and a
  rubber band in a loop, with a big red ✗ and "LAST YEAR". Everyone looks away; Cecil deadpan in the pause.
- title: the show logo "DRAWER 8B" (stencil-style label on a drawer front) with "Episode 12: The Practical";
  the whole cast pops in below it in a row, bobbing (classic sitcom title card). Dimitri lit. Hold it.

## 1 loop: No loop, no glow
- monday: `drLab`, a "MONDAY" chip; on the bench, the kit laid out: a cell, a lamp, two wires (draw them as real
  objects: a cell, a bulb in a holder, red and black leads with crocodile clips).
- dimitri: `drDrawer`; Dimitri (s 1.2) rises into a spotlight, lit (`glow 1`), smug; lower third DIMITRI. Chip "lamp".
- thdimitri (TH): Cecil confessional, deadpan; on "It sort of does" a tiny inset of Dimitri glowing, smug.
- eddies: a cut-away of the copper wire (a long tube with a plastic coat), packed with `drElectron`s; label
  "electrons: tiny, negative charge" with a "−" sign.
- eddie: Eddie (s 1.2) pops up in the wire, happy; lower third EDDIE. On each "That's Eddie" an identical Eddie pops
  in beside him with a name tag "EDDIE"; on "It saves time" a row of ten identical Eddies all wave; Cecil
  deadpan in the pause.
- current: `drBench`: a simple loop (cell, lamp, wires) with `drElectron`s drifting around it; a definition card
  "ELECTRIC CURRENT = the flow of charge around a circuit".
- pump: Cecil in the circuit with a pump handle (or as a water-pump icon beside him), pushing the Eddies on;
  chip "the cell pushes the charge round"; on "They were in the wire already" a dotted outline shows Eddies sitting
  in the wire even with no cell.
- oneway: `drBench`, Kavya's hand (or a wire end) connects only ONE wire, cell to lamp; the return wire lies loose,
  a visible gap.
- nothing: Dimitri unlit (`glow 0`), deadpan, in the circuit; a GAP marker with a red ring.
- gap: card "Current only flows round a COMPLETE LOOP"; the gap flashes; every electron in the wire freezes at
  once ("stops everywhere").
- shine: the second wire clicks into place; the loop closes; Dimitri blazes (`glow 1`, happy), Eddies start moving
  all round the loop.
- back: follow one Eddie (highlighted ring) all the way round back into Cecil; a counter "OUT: 100 Eddies /
  BACK: 100 Eddies"; chip "current is NOT used up".
- energy: energy sparks (`spark`) travel from Cecil to Dimitri, then light rays leave Dimitri into the room;
  labels "energy: cell → lamp → light". (Eddies keep circling, unchanged.)
- copper: the wire cut-away again: copper core glowing "CONDUCTOR"; chips for metals "copper, gold, aluminium",
  plus "carbon (graphite) ✓".
- plastic: the plastic coat highlighted "INSULATOR"; icons for plastic, rubber, glass, wood with ✗ "no current";
  Kavya's finger touching the coat safely, a ✓.
- hence: the rubber band photo from the cold open returns with its red ✗; Cecil deadpan; pause held.
- arrows: `drBench` circuit diagram (cellSym, bulbSym, wires): big gold `drArrowCurrent` arrows go round from the
  cell's + (long line) to its − (short line), label "conventional current: + → −".
- minus: the Eddies (blue `drElectron`s) on the same diagram move the OTHER way, − → +, with a blue label
  "electrons: − → +". Both arrow sets visible at once, clearly opposite.
- why: an old dusty book "Electricity, 1750s" with a + → − arrow; then a newspaper "1897: ELECTRON DISCOVERED";
  a sticky note on the book: "too late to change".
- theddie (TH): Eddie confessional (`drConf('eddie')`), sad-ish then happy again; a stack of textbooks with
  arrows all pointing the other way.
- exam: an exam paper with a circuit; a gold arrow drawn + → − gets a green ✓; chip "be consistent".

## 2 series: Two lamps, one loop
- tuesday: `drLab`, "TUESDAY" chip; worksheet card "Two lamps IN SERIES"; a diagram: one loop, cell → lamp → lamp.
- share: `drDrawer`; Dimitri, shock, next to a second, identical bulb (draw a plain kit bulb or a second Dimitri at
  smaller scale with no face changes; it's the "understudy").
- now: Cecil deadpan; hold.
- symbols: a corkboard "STAFF" with the passes (`drBadge`): cell, lamp, ammeter, voltmeter, resistor, switch.
- cell: Cecil's pass zooms in: the long thin line labelled "+ (positive)" and the short thick line "−".
- lamp: Dimitri's pass: circle with a cross; Dimitri smug; sparkles. In the last third, a quick-fire row of other
  passes slides along the bottom: switch, motor (M), buzzer, fuse, diode, LED; a note "wires = straight lines, neat corners".
- amy: Amy (s 1.2) in the drawer; lower third AMY; she stands IN the wire, current dots passing through her; chips
  "ammeter", "measures current in amps (A)", "in series".
- same: `drBench`: series circuit with two lamps and TWO ammeters (meterSym 'A'), one before and one after the
  lamps, both reading "0.2 A"; chip "same everywhere in series"; Amy smug.
- thamy (TH): Cecil confessional, deadpan; inset: Amy alone in a queue-barrier line, the only one there.
- vic: Vic (s 1.2) appears beside the lamp, with his two terminal wires reaching to either side of it (a little
  branch ACROSS the lamp); lower third VIC; chips "voltmeter", "voltage = potential difference, in volts (V)",
  "across, in parallel".
- signs: Vic slowly raises his sign; it reads "Hi." (pause 0.9 s: everyone stares). Then it flips to "1.5 V".
- shared: `drBench` series circuit with a voltmeter across each lamp: each reads "0.75 V"; a sum strip
  "0.75 V + 0.75 V = 1.5 V"; Vic's sign "0.75 V".
- dim: both lamps at half glow; Dimitri (`glow 0.5`) shock, then sad.
- name: Cecil deadpan; the caption-style card "DIM-itri" with "DIM" highlighted.
- dimmer: a third and fourth lamp slide into the loop; all four dim further (glow bars getting shorter); chip "more
  lamps in series = dimmer".
- unscrew: Kavya's hand unscrews one lamp; a gap opens in the loop.
- dark: every lamp goes out at once; current dots stop; chip "series: one goes, ALL go out". Hold the dark.
- betrayal: pitch dark except Dimitri's eyes and a faint outline; his line in the dark; pause held.

## 3 parallel: Branches, and Auntie Rez
- wednesday: `drLab`, "WEDNESDAY"; diagram: a parallel circuit, each lamp on its own branch (junction dots).
- bright: `drDrawer`; Dimitri fully lit (`glow 1`), happy, arms-out pose (a sparkle burst).
- full: `drBench` parallel circuit with a voltmeter across each branch, each reading "1.5 V"; chip "each branch gets
  the FULL voltage"; add a third branch: all three stay bright.
- split: the Eddies reach a junction dot and split, some up, some down; Eddie happy.
- addup: ammeters on each branch "0.4 A", "0.4 A" and in the main wire by the cell "0.8 A"; the sum strip
  "0.4 + 0.4 = 0.8 A"; Amy smug, ticking her clipboard.
- unscrew: Kavya unscrews one branch's lamp.
- still: the other branch stays lit; Dimitri shock → happy.
- keep: cut to `drFlat`: each light, the aircon and a socket on its own branch from the mains (simple wiring
  overlay); chip "homes are wired in parallel".
- aircon: Kavya (bust) on the sofa; the brother's side lamp blows (`g.lamp.set(0)`, a "pop" spark) while the aircon
  keeps blowing; Kavya smug; pause.
- rez: `drDrawer`; a lift/door opens and Auntie Rez steps out; chip "resistor".
- hi: Auntie Rez (s 1.1), annoyed; lower third AUNTIE REZ; her pass shows the rectangle symbol.
- less: `drBench` loop with a resistor; the Eddies slow as they squeeze through her; Amy's reading drops from
  "0.4 A" to "0.1 A"; chip "more resistance → smaller current".
- ohms: a big "Ω" with a little horseshoe drawn beside it; chip "resistance is measured in ohms (Ω)"; Rez smug.
- wire: two wires side by side: a long one (more resistance) vs a short one; a thin one (more) vs a thick one; then
  a long thin wire labelled "most resistance"; small meters show the current smaller in the long/thin one.
- threz (TH): Cecil confessional, annoyed side-eye; inset of a lamp safe behind Rez, chip "limits the current,
  protects components".
- nephew: the variable resistor symbol (rectangle with an arrow, `drSym('variable')`); a slider moves and a lamp dims
  and brightens with it; icons: a dimmer switch and a volume knob. Rez smug; chip "variable resistor (rheostat)".

## 4 magnets: Forty years, two poles
- thursday: `drDrawer`, "THURSDAY"; a small box labelled "MAGNETS" opens.
- nora, stan: Nora & Stan (s 1.2) rise out; lower third NORA & STAN; chips "N = north pole", "S = south pole",
  "one bar magnet, two poles"; a framed wedding photo of them (still joined, obviously).
- rule: a big card "LIKE POLES REPEL / UNLIKE POLES ATTRACT" with arrows (N–N pushing apart, N–S pulling together).
- away: a second bar magnet slides in N-end first towards Nora: both shove apart with repel arrows; Nora annoyed.
- met: the second magnet turns round: its S end clicks onto Nora's N end; little hearts; Stan happy.
- cut: Kavya (bust) holding toy scissors, smug.
- two: animation: the magnet is cut in half; each half instantly shows N on its left and S on its right (two smaller
  magnets), labelled "N S | N S"; chip "never one pole on its own".
- materials: paper clip (iron), a steel spoon, a nickel coin, a cobalt chip fly to the magnet; chip
  "iron, steel, nickel, cobalt" with the mnemonic "I See No Cobwebs" (initials highlighted).
- thnora (TH): Nora confessional; a copper pipe, an aluminium can and a gold ring sit next to her and do NOT move;
  each with "✗ not magnetic"; Nora deadpan.
- field: `drField` draws in around Nora & Stan (N left, S right); chip "magnetic field: where magnetic materials feel
  a force", then "field lines".
- lines: arrows on the field lines highlighted; chips "outside: N → S", "never cross".
- strong: the crowded lines at both ends pulse; chip "closest together = strongest (at the poles)".
- filings: `drFilings` sprinkles in (top-down paper view); then a row of `drCompass`es around the magnet, each needle
  lining up along the field (red end pointing along the arrows, away from N and towards S).
- compass: a compass on a hiker's map; the needle swings and settles north; then a giant Earth with a ghostly bar
  magnet inside it.
- core: cutaway Earth, glowing molten outer core with swirls; the bar magnet inside drawn with its S end under the
  geographic North Pole; labels "geographic North", "magnetic SOUTH pole". (Exact: the compass needle's N end
  points up to the Earth's magnetic S.)
- loves: the compass needle's red N end is pulled up to the Earth's S; chip "unlike poles attract".
- married: hard cut to Nora (happy) leaning on Stan (deadpan); hearts; pause held.

## 5 electro: The magnet with an off switch
- friday: `drDrawer`, "FRIDAY".
- sol: Sol (s 1.05, `on 0`, sad, drooping); lower third SOL; chip "solenoid: a coil of wire"; a woolly scarf
  doodle on "a nail in a scarf".
- wire: `drBench`: a straight wire with current; circular field rings around it (with arrows); then the wire coils
  up and the rings merge into a bar-magnet-shaped field.
- on: a switch closes (`switchSym`), current dots flow; Sol `on 1`, happy/smug, flexing; N at the top, S at the
  bottom; paper clips fly up and stick to his point.
- thsol (TH): Cecil confessional, deadpan; split inset: Sol ON (flexing) | Sol OFF (a nail).
- switch: chip "big advantage: switch it ON and OFF".
- off: the switch opens; `on` drops to 0; Sol droops; the paper clips clatter down; pause held.
- reverse: the cell is flipped round in the diagram; Sol `on 1, pole -1`: the N and S labels swap ends; chip
  "reverse the current → the poles swap".
- tic: a card "TIC" with three rows filling in: "T: more turns of wire" (extra coils appear on Sol), "I: increase
  the current" (a second cell joins), "C: iron core" (a glowing iron core). Sol's field gets bigger with each.
- more: a flood of Eddies through the coil, cheering.
- bigger: Cecil (annoyed) beside Nora & Stan, with a cell plugged into nothing; chip "permanent magnets don't need
  (or use) a cell".
- iron: Sol's iron nail highlighted: "pure iron = temporary (soft) magnet: loses its magnetism easily".
- steel: Nora & Stan: "steel = permanent magnet".
- domains: `drDomains` grid inside a cut-away of the steel magnet: all arrows aligned (pointing to Nora's N end,
  angle 180); chip "domains".
- stroke: a steel bar with jumbled domains (`set(0)`); a magnet's pole strokes along it in one direction, again and
  again (arrows show each stroke the same way); the domains swing into line (`set(1, 180)`); chip "magnetise".
- heat: a flame under the bar, then a hammer: the domains jumble again (`set(0)`); chips "heat ✗", "hammer ✗",
  "demagnetised"; Nora shock, then annoyed at the camera.
- crane: a scrapyard: a crane with a big electromagnet disc; switch ON lifts a car (blue glow), switch OFF drops it
  (crash, dust); then small icons: a bell, a loudspeaker, a motor.
- cousin: Sol `on 1`, smug; inset of a scrapyard crane dropping a car into a pile with a tiny "Sol's cousin" tag.

## 6 static: Test day, bad hair day
- monday: `drFlat` morning (lights on), "MONDAY: TEST DAY" chip; Kavya (bust) combing with `drComb`; a counter
  ticks "×31".
- hair: Kavya shock; her hair (draw extra strands around scKavya's head) standing straight up.
- friction: cut-away: comb teeth and hair strands; `drElectron`s hop from the hair onto the comb; Eddie happy;
  chip "friction moves electrons".
- static: chip "STATIC ELECTRICITY: charge that builds up and stays put".
- gained: the comb covered in "−" signs, "gained electrons: NEGATIVE"; the hair with "+" signs, "lost electrons:
  POSITIVE".
- only: the "+" signs sit still (little bored faces), the Eddies hop; chip "only electrons move".
- like: card "LIKE charges repel / UNLIKE charges attract" (mirror of the magnets card, with + and − instead of
  N and S).
- strands: Kavya (deadpan): her strands, each with a "+", pushing apart with little repel arrows.
- same: Nora & Stan in a small inset ("Thursday"), Nora smug.
- paper: the comb lifts tiny paper bits from the desk (they jump up and cling).
- earth: a metal rod / wire to the ground symbol; electrons flow away to the ground; then a fuel tanker with an
  earthing cable clipped to the ground; chip "earthing removes charge".
- lightning: a Singapore afternoon storm over HDB blocks, rain; Kavya (bust) at the window.
- sky: a lightning bolt between cloud and ground, with "−" charges in the cloud base; chip "lightning = a giant
  static spark"; Cecil (inset) deadpan.
- test: `drLab`, clock "10:00"; `drBench`: Kavya's test circuit: cell, lamp, Amy (A) in series in the loop, Vic (V)
  across the lamp; the lamp lights; Vic's sign "1.5 V".
- marks: Kavya (bust) holding a sheet "FULL MARKS"; smug.
- thanks: Dimitri lit, smug, bowing; confetti; pause held.

## 7 traps: The drawer saves you some marks
- intro: "7 EXAM TRAPS" heading on a drawer-label card.
- t1–t7: quick confessional cuts, one per speaker (Nora & Stan, Stan, Amy, Dimitri, Sol, Eddie, Cecil), each with its
  trap on a card: 1 like poles repel, unlike attract; 2 field lines N → S, never cross, and Earth's magnetic S pole is
  in the geographic north; 3 ammeter in series (amps), voltmeter across in parallel (volts); 4 more lamps in series =
  dimmer; 5 no current, no electromagnet; 6 current is not used up; 7 metals and carbon conduct, plastic and rubber
  insulate (rubber band ✗).
- return: the logo "DRAWER 8B will return"; the drawer starts to slide shut.
- vic, volts, camera (stinger): Vic's confessional (`drConf('vic')`), Cecil at the edge of frame; long silence while
  Vic blinks; "...1.4 V" (his only spoken words: tiny mouth; his sign also flips to "1.4 V"); hard cut to Cecil,
  shock, then deadpan; "...Turn the camera off." The REC dot goes out; black.

## Animator groups
- A: 00 cold (done), 01 loop, 02 series. B: 03 parallel, 04 magnets. C: 05 electro, 06 static, 07 traps.

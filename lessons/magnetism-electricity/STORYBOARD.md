# Magnetism & Electricity: storyboard

What the screen shows for every narration line of `lessons/magnetism-electricity/script.py`.
Fifteen chapters, 141 lines, 15.6 minutes. The 13 guide sections map onto chapters one to one,
except that `series` teaches both "Series and parallel circuits" and "Current and voltage rules",
and `static` teaches the static half of "Measuring current and voltage; static electricity" together
with "Static electricity in more detail".

**Look and palette.** Kit `magnet()` colours throughout: north `#E8424F` red, south `#3B82F6` blue.
Anything north-seeking is red (a compass needle's north half), so "red points at blue" reads as
"unlike poles attract". Iron and steel are the `C.carbon` greys, copper wire is `#D9893F`, plastic
insulation is `C.good` green. Conventional current is always kit `wire()` dots in `C.energy`
yellow. Electrons are small `C.water` blue dots with a white "−"; positive charge is a `C.bad` red
"+". Energy and light are `C.energy`, heat is `C.heat` with lib `heatWaves()`, sparks are lib
`spark()`, lightning is lib `bolt()`. Push or pull arrows are lib `arrow()`: green (`C.good`) for
attract, red (`C.bad`) for repel. Labels use kit `labelLine`; names and mnemonics use lib `chip()`
and `card()`.

## Circuit rules (every chapter)

Circuits must look identical in every chapter and behave correctly.
1. **Symbols**: kit only. Use `cellSym()` for one cell, `cellSym({ cells: 2 })` for the **3 V
   battery** used everywhere, plus `bulbSym()`, `switchSym()`, `resistorSym()`, `meterSym('A')`,
   `meterSym('V')` and `meterSym('M')` (motor). The six extra symbols are specified under Shared art.
   Wires are straight, with right-angle corners, and a solid junction dot (r 7, `C.ink`) marks
   every place where three wires meet.
2. **Standard loop**: a rectangle about 560 × 300, with the cell centred on the bottom wire and not
   rotated, so its long + plate is on the left. Conventional current then runs **clockwise**: up
   the left side, left to right along the top, down the right side and back into −. Bulbs and
   meters sit on the top wire. Parallel circuits put the cell on the bottom wire and stack the
   branches above it.
3. **Direction**: `wire()` dots run from the first point to the last, so list every wire's points
   from the + side round to the − side. Never animate dots from − to +, except the blue electrons
   in `direction` and `static`.
4. **Dot speed shows current**: 60 px/s for one bulb on the 3 V battery, 30 for two bulbs in
   series and 20 for three. In parallel, use 60 in each branch and 120 in the shared wires (60 again
   once one branch breaks). Every dot in a loop starts and stops at the same instant, never as a
   wave spreading from the cell.
5. **Brightness** (`bulbSym.set`): 1 for one bulb on the full 3 V, 0.4 for each of two in series
   (1.5 V each), 0.2 for each of three in series, and 1 for every bulb in parallel.
6. **Readings** (`meterSym.set`): one bulb reads 0.4 A. Two bulbs in series read 0.2 A at every point
   in the loop. Two in parallel read 0.4 A in each branch and 0.8 A beside the battery. Voltmeters
   read 1.5 V across each of two series bulbs, and 3 V across the battery or across any parallel
   branch.
7. **Meters**: ammeters always sit in line, inside the loop. Voltmeters always sit on their own
   short branch across one component, with two leads to its two sides.
8. **A broken bulb** drops out of its wire, leaving a visible gap. Every dot on that path stops at
   once, and its bulbs go dark.

## Field rules (every chapter)

1. Outside a magnet, field lines **leave N and enter S**, carry small arrowheads pointing along
   them, are nested and **never cross**, and crowd together at the poles. Draw 3 loops above,
   3 below, and a straight line out of each end (arrow pointing away from N on the N side, and
   into S on the S side). The line that leaves an end face nearest the magnet's axis loops
   furthest out, which keeps the loops from crossing. For geometry, copy the corrected
   `magnetic-fields` diagram in `lib/topics/magnetism-electricity.ts`, scaled up.
2. **Field direction at any point**, for compass needles and iron filings: model the magnet as a
   +1 pole at the centre of the N face and a −1 pole at the centre of the S face, so
   B(P) = (P − N)/|P − N|³ − (P − S)/|P − S|³. A compass's red end points along B. Filings lie
   along the line of B, with no arrowheads.
3. Inside a magnet or a coil, the lines run S to N. Show this only for the solenoid in `electro`.
4. **Solenoid poles** follow the right-hand grip rule. With the coil horizontal and conventional
   current running **down the front of each turn**, the **right-hand end is N**. Reverse the
   current, and the left-hand end is N.
5. **Straight wire**: with the current flowing up the screen, the field circles run anticlockwise
   seen from above. On a horizontal card drawn in perspective, the arrows on the front (lower) arc
   point right.

## Shared art

There is no `lessons/magnetism-electricity/lib.js`. Each piece below belongs mainly to one animator
group, but these recur across groups, so draw them to these specs wherever they appear:
- *Compass* (`fields`, `earth`, `quiz`): a round dial (`C.card` fill, `C.line` rim; r 34 for a
  plotting compass, r 90 for the big one) with a diamond needle: north half red `#E8424F`, south
  half `C.ink`, and a pivot dot. Rotate the needle by angle only.
- *Field-line set* (`fields`, `earth`, `electro`, `recap`): drawn to the field rules above.
- *Domain grid* (`permanent`): 6 rows × 12 short arrows inside a grey bar. Each arrow is a
  `C.ink` shaft with a red head (its north end). Driven by alignment 0..1 from seeded random angles
  (`rng(seed)`).
- *Nail electromagnet* (`intro`, `electro`): a grey nail about 420 × 26 with its point on the
  right, wrapped in about 10 turns of copper wire (back halves of the turns dimmer than the front
  halves). Two leads run to a side-on AA cell: a cylinder with a copper-coloured + end and a "+"
  mark. A heap of steel paperclips lies under the nail's point.
- *Extra circuit symbols* (`symbols`, `resistance`, `quiz`), all in kit style (stroke `WIRE`
  `#F2F7FA`, width 5, the same lead length as `resistorSym`):
  - Variable resistor: `resistorSym` with a diagonal arrow through it, from lower left to upper
    right.
  - Fuse: the `resistorSym` box with the wire line running straight through its middle.
  - Diode: a filled triangle pointing along the wire at a short bar across the wire. Conventional
    current can flow only the way the triangle points.
  - LED: the diode inside a circle, with two small arrows pointing up and outwards, away from it.
  - Buzzer: a dome (a semicircle, flat side down) sitting on the wire, with its two leads leaving
    the flat base.
  - Junction: a solid dot, r 7.

---

## intro: Switching magnetism on and off
No chapter card. The nail electromagnet fills the centre, with the paperclip heap below the nail's
point. Start the animation at `at('hook')`. New art: the nail electromagnet (shared), paperclips,
the five roadmap icons.
- **hook**: a lead touches the cell, yellow dots run from + through the coil and back to −, and the
  nail's tip glows faintly. **Showpiece**: three or four paperclips leap up and cling to the tip in
  a little chain.
- **drop**: the lead lifts off. The dots stop at once and fade, and the clips fall and bounce onto
  the heap. A large "?" floats above the nail.
- **def**: the nail shrinks to the left. Two cards come in: "magnetism" (a small kit `magnet()`
  with two field arcs) and "electricity" (a tiny loop with yellow dots), joined by a link line.
- **plan**: a roadmap of five icons that light in turn: magnet "magnets & fields", nail
  "electromagnets", loop "circuits", `meterSym('A')` "measuring", balloon with spark "static".

## poles: Magnets and their poles
Kit `magnet()` bars (300 × 80) centre stage on a plain background, labelled with `labelLine`. New art:
sample icons (iron bar, nickel disc, cobalt lump, copper coil, aluminium can, gold ring, plastic,
wooden and glass blocks), a cobweb, and a conveyor with steel and aluminium cans.
- **magnet**: one magnet slides in, with labels "north pole (N)" and "south pole (S)" at its ends.
  A paperclip slides across and clicks onto it.
- **repel**: two magnets meet N to N and spring apart, with red repel arrows. One flips, and they
  meet S to S and spring apart again. Chip "like poles repel".
- **attract**: one magnet turns so that N faces S, and they slide together and click, with green
  pull arrows. Chip "unlike poles attract".
- **lroa**: a mnemonic card, "Likes Repel, Opposites Attract", with the initials L R O A in yellow.
- **cut**: a single magnet. A dashed cut line appears down its middle, a small spark snaps, and the
  halves part. Ghost chips "only N?" and "only S?" hover over the halves.
- **two**: **Showpiece**: the ghost chips shatter, and each half recolours into a complete N|S
  magnet with new S and N labels on the cut faces. The halves split again into four small N|S
  magnets. The facing cut ends are unlike poles, so the pieces nudge back towards each other.
- **materials**: four samples pop up in a row, each pulled to the magnet with a green arrow: an iron
  bar, a steel paperclip, a nickel disc and a cobalt lump, labelled underneath.
- **cobwebs**: a card reading "I See No Cobwebs", with a small cobweb icon and the initials lit.
  Underneath, the four words, and a chip "steel ≈ mostly iron".
- **metals**: a copper coil, an aluminium can, a gold ring and a plastic, wooden and glass block
  each slide up to the magnet and stay put, each marked with a lib `cross()`.
- **cans**: a conveyor carries mixed cans under an overhead magnet. Steel cans (grey, "steel") jump
  up onto the magnet; aluminium cans (silver, "Al") roll on.

## fields: Magnetic fields and field lines
One large horizontal kit `magnet()` (320 × 80) at the centre, about y 420. The field lines and the
plotting compass follow the field rules. New art: a paperclip on a thread, a paper sheet, about 300
filings, pencil dots; the compass and field-line set are shared.
- **field**: a paperclip on a thread swings towards the magnet without touching it. A soft glow
  around the magnet is labelled "magnetic field".
- **lines**: the field-line set draws on, line by line, leaving N and looping round into S, with
  arrowheads riding along each line. Label "field lines: N → S".
- **cross**: at a spot where two lines run close, a red ghost line tries to cross them and is
  struck out with lib `cross()`. A tiny compass there points one way only. Note "one direction at
  each point".
- **strong**: the lines near both poles brighten, and a bracket across their tight spacing reads
  "close together = strong". Far out, a wide bracket reads "far apart = weak".
- **filings**: the lines fade, and a pale sheet of paper covers the magnet. About 300 grey filings
  scatter at random angles. **Showpiece**: each filing swings to lie along the field, and the
  pattern appears. The filings have no arrowheads.
- **shape**: chips "shape ✓" and "direction ?" sit above the filing pattern.
- **compass**: the filings fade. A plotting compass glides slowly along one field line, its red
  end always pointing along the field, away from N and towards S. Label "north end points along
  the field".
- **plot**: the compass stops beside the N end, and two pencil dots appear at the ends of its
  needle.
- **join**: the compass hops forward until its tail sits on the front dot. A new dot appears, and
  this repeats about seven times round to S. A pencil line joins the dots into a smooth curve, and
  an arrowhead is added.

## earth: The Earth as a giant magnet
The big compass on the left, the Earth (r 220) on the right. The Earth is a blue disc with green
land, its spin axis, and the labels "geographic North" at the top and "geographic South" at the
bottom. New art: the Earth with its core swirl, ship and waves, plane, GPS satellite, a stream of
solar particles, pigeon, turtle, bird, a simple map, a rock strip.
- **compass**: the big compass's needle wobbles, then settles with its red end up, towards North.
  Label "north pole of the needle".
- **earth**: the Earth turns partly see-through, showing an orange molten outer core whose swirl
  strokes slowly rotate (label "molten iron, outer core"), and a vertical bar magnet with no labels
  yet. Field lines loop outside the Earth from the southern half up to the northern half, with
  arrows pointing north along the surface.
- **twist**: the compass shrinks onto the Earth's surface near the top, its red end pointing to
  geographic North. Chip "unlike poles attract", with a small red-to-blue attract icon.
- **south**: **Showpiece**: the top of the inner magnet lights up blue and is labelled "magnetic
  south pole", right under "geographic North". A green attract arrow joins the compass's red end to
  it, and the bottom of the magnet is labelled N.
- **navigate**: a sailing ship on dark waves under clouds that hide the stars, steering by a
  glowing compass. Then a hiker (kit `person()`) and a small plane, each with a compass, and a GPS
  satellite icon crossed out.
- **shield**: back to the Earth, now small. A kit `sun()` far to the left streams yellow particles,
  which curve away around a soft blue boundary of the field.
- **animals**: a pigeon, a sea turtle and a migrating bird, each with a tiny compass, follow dotted
  routes across a simple map.
- **flip**: the inner magnet rotates 180°, so its N and S swap, and the field arrows reverse. Below
  it, a strip of rock layers in alternating red and blue stripes is labelled "rocks record the
  flips", next to a chip "why? still being researched".

## permanent: Permanent and temporary magnets
Two columns ("permanent", "temporary"), then one large bar filled with the domain grid. New art: a
fridge door with magnets and a drawing, a hammer, a coil; kit `bunsen()` and `sineWave()`.
- **perm**: left column: a fridge door with fridge magnets holding a drawing. A chip says "keeps its
  magnetism", and a steel bar is labelled "steel".
- **temp**: right column: an iron nail held near a magnet picks up two paperclips. The magnet pulls
  away, and the clips drop. A small icon reads "or inside a coil with a current". Label "pure
  iron: temporary (soft)".
- **domains**: zoom into a bar holding the domain grid, its arrows pointing every which way, with a
  chip "cancel out: no overall magnet".
- **stroke**: a kit `magnet()`, held N end down, strokes along the top of the bar from left to
  right, lifting off and arcing back to the start three times (chip "same direction"). The arrows
  begin turning as each stroke passes.
- **line**: **Showpiece**: all the arrows swing into line, every red head pointing **left**. The bar's
  left end is labelled N (red) and its right end S (blue): a stroke with an N pole finishing on the
  right leaves an S pole there.
- **demag**: three small panels, each ending with jumbled arrows: a `bunsen()` flame under the bar
  makes the arrows jitter and scatter; a hammer strikes and they scatter; the bar slides slowly out
  of a coil labelled with a kit `sineWave()` "alternating current", and they scatter.
- **iron**: an iron bar's arrows snap into line as a magnet comes near, then jumble the moment it
  leaves, twice and quickly. Labels "lines up easily" and "jumbles easily", then a light switch flips
  to "off".

## electro: Electromagnets
A straight wire, then a horizontal coil wired to the 3 V battery, then short vignettes. The current
and the poles follow the solenoid rule: dots run down the front of each turn, and the right-hand end
is N. New art: a perspective card with field circles, coils of 8 and 16 turns, a crane with an
electromagnet disc, a car and a scrap pile, bell, loudspeaker, rotor, relay, maglev train, a plug.
- **wire**: the intro's nail flashes up for half a second, then cuts to a vertical wire with dots
  running up it, through a horizontal card drawn in perspective. Field circles grow on the card,
  with small compasses around them pointing anticlockwise as seen from above (the front arc points
  right).
- **coil**: the wire curls into a coil of 8 turns lying across the stage. Little field circles
  around each turn merge, and inside the coil the field becomes straight lines along its axis.
- **bar**: the full field-line set grows around the coil, exactly like a bar magnet's: lines out of
  the right end, round the outside, into the left end, and straight through the inside from left to
  right. Labels N (right) and S (left), then the chip "electromagnet".
- **switch**: a kit `switchSym` in the coil's circuit opens. The dots stop, and the field lines and
  pole labels fade. It closes, and they come back.
- **reverse**: the battery turns round, so its + plate is now on the other side. The dots run the
  other way (up the front of each turn), the field arrows reverse, and N and S swap ends (N is now
  on the left).
- **stronger**: three small panels, each with a paperclip count: "more turns" (16 turns, denser
  lines), "more current" (faster dots, `meterSym('A')` reading 0.8 A instead of 0.4 A) and "iron
  core" (a grey bar slides into the coil, and the lines thicken). Each count goes up.
- **tic**: a mnemonic card, "TIC: Turns, Increase the current, Core", with the initials in yellow
  over the three panels.
- **battery**: left: the electromagnet with a bigger battery (`cellSym({ cells: 2 })`) lifts more
  clips. Right: a plain bar magnet beside a battery icon struck out with lib `cross()`, and a chip
  "no battery".
- **crane**: **Showpiece**: a scrapyard crane swings a round electromagnet over a side-on car. The
  current comes on (dots and a glow), and the car lifts. The current goes off, and the car drops
  onto a scrap pile with a bounce.
- **uses**: five tiles: an electric bell (hammer striking), a loudspeaker (cone pulsing, sound
  arcs), a motor (`meterSym('M')` beside a spinning rotor), a relay (a small coil pulling a large
  switch shut) and a maglev train hovering above its track with a visible gap.
- **try**: a home-experiment card: the nail electromagnet with "30 turns" and "1.5 V AA" labels. Its
  bare wire ends touch the cell, and paperclips cling one by one as a counter ticks up.
- **safe**: a safety card: a mains plug struck out, a hand lifting the wire off the cell, and
  `heatWaves()` rising from the coil. Chips "never the mains" and "disconnect between tries".

## current: Current, conductors and insulators
The standard loop: the 3 V battery on the bottom wire, a bulb on the top wire, and a switch on the
left wire. The kit symbols are labelled "cell", "bulb" and "switch", because the symbol chapter
comes next. New art: a pump icon, a test gap with two clips, material samples (copper, gold,
aluminium, graphite, plastic, rubber, glass, wood), a cable cutaway, a hand.
- **current**: clockwise dots, a lit bulb, and the label "current: flow of charge".
- **needs**: two ticks light in turn: "complete loop" (the whole outline glows) and "cell" (the cell
  glows). A second cell slides in beside the first, and the chip changes to "battery: 2+ cells".
- **pump**: a translucent pump icon sits over the battery, and the dots surge forward in step with
  its strokes.
- **gap**: the switch opens. **Every** dot freezes at the same instant and fades, and the bulb goes
  dark. Then a wire elsewhere snaps instead, with the same result.
- **instant**: **Showpiece**: the switch closes. The bulb lights at once, and every dot round the
  loop starts at the same moment, drifting slowly. Labels "charges drift slowly" and "all start
  together".
- **conductors**: the top wire now has a test gap between two clips. Copper, gold, aluminium and a
  graphite pencil lead slide in one at a time: each lights the bulb and starts the dots, with a tick.
- **insulators**: plastic, rubber, glass, wood and an empty air gap take their turn: the bulb stays
  dark, the dots stay still, and each gets a cross.
- **wire**: a cutaway cable: a copper core carrying yellow dots inside green plastic. A hand grips
  the plastic safely, with a tick.

## symbols: Circuit symbols and diagrams
A realistic circuit first, then a gallery of large symbols (one or two at a time, centre stage),
then the morph back to a diagram. New art: a realistic AA holder, toggle switch, torch bulb and
curly wires, a globe icon; this group draws the six extra symbols for everyone.
- **why**: a realistic circuit: an AA cell in a holder, a toggle switch and a torch bulb on curly
  wires. Beside it, a globe icon labelled "anyone, anywhere".
- **cell**: a large `cellSym()`, with `labelLine` notes "long thin line: +" and "short thick line: −"
  in the kit's red and blue.
- **battery**: it becomes `cellSym({ cells: 2 })`, then `cellSym({ cells: 3 })`. Label "battery".
- **lamp**: `bulbSym()` lights up, then the buzzer symbol appears beside it with sound arcs.
- **switch**: `switchSym()` opens and closes twice, with labels "open: a gap" and "closed".
- **meters**: `meterSym('A')`, `meterSym('V')` and `meterSym('M')` in a row, their letters
  flashing yellow as they are named, labelled "ammeter", "voltmeter" and "motor".
- **resistor**: `resistorSym()`, then the variable resistor drawn beside it, its arrow sliding in.
- **fuse**: the fuse symbol in a short wire with dots. The dots speed up, the line inside the box
  glows orange and parts with a small `spark()`, and the dots stop. Label "melts if the current is
  too high".
- **diode**: the diode in a short loop. Dots pass through in the direction the triangle points.
  Turned round, every dot in the loop stops at once, with a cross.
- **led**: the LED symbol, its arrows pulsing outwards as it glows. Label "light-emitting diode".
- **draw**: a wobbly hand-drawn loop straightens into neat lines with right-angle corners. A
  T-junction grows a solid dot, labelled "junction".
- **build**: **Showpiece**: the realistic circuit from `why` slides back in and morphs piece by
  piece: the AA cell becomes `cellSym`, the toggle becomes `switchSym`, the bulb becomes `bulbSym`,
  and the curly wires become straight `wire()` lines. The switch closes, the dots run clockwise
  from +, and the bulb lights.

## series: Series and parallel circuits
The series loop on the left half of the stage and the parallel circuit on the right half, each
about 460 wide, both on the 3 V battery and following the circuit rules. Each half is introduced
on its own before the comparison lines. New art: "push" bars, a string of Christmas lights, a
house cutaway.
- **two**: the series loop: two bulbs one after the other on the top wire, dots at speed 30, bulbs
  at 0.4. Label "series: one loop".
- **same**: every dot moves at the same speed all the way round. Twin counters at the battery's −
  and + ends tick "in" and "out" at the same rate. Chip "used up?", struck out.
- **shared**: a yellow "push" bar above the battery (3 V) splits into two half bars that slide over
  the two bulbs: "1.5 V + 1.5 V = 3 V".
- **dimmer**: a third bulb drops into the loop. All three dim (0.4 to 0.2) and the dots slow (30 to
  20). Label "more bulbs, dimmer". The third bulb lifts out again at the end of the line.
- **break**: one bulb drops out, leaving a gap. All the dots stop and both bulbs go dark. Then a
  short string of old Christmas lights goes dark when one bulb blinks out.
- **parallel**: the right half: two branches stacked above the battery, each with one bulb, with
  junction dots where they split and join. Label "parallel: separate branches".
- **full**: both parallel bulbs at full brightness (1), each branch topped by a full "3 V" push
  bar. Beside them, the dim series pair repeats for comparison, and a third branch is added that
  also glows at 1.
- **split**: the shared wires carry dots at speed 120, and each branch at 60. A thick arrow at
  the first junction divides into two thinner ones, and they rejoin at the second junction. Label
  "branch + branch = total".
- **keep**: **Showpiece**: both circuits get the same test at the same moment. One bulb drops out
  of each. The series loop goes dark everywhere; in the parallel circuit, the other bulb stays lit,
  its branch keeps flowing, and the shared wires slow from 120 to 60.
- **house**: a cutaway house: each room's light and socket sits on its own branch from the mains.
  The kitchen light switches off, and the other rooms stay lit. Label "full mains voltage to each".
- **rhyme**: a mnemonic card, "series shares the voltage; parallel splits the current", with a
  small split-voltage bar and a small split-current arrow.

## meters: Measuring current and voltage
The series loop with two bulbs (as in `series`), then the parallel circuit, then the series loop
again for the voltmeters. The circuit rules give every reading. New art: none beyond the kit, plus
a yellow energy glow on the dots.
- **ammeter**: `meterSym('A')` drops into the top wire between the battery's + side and the first
  bulb. It reads 0.2 A, and the dots flow through it. Label "ammeter: current, in amps (A), in
  series".
- **anywhere**: **Showpiece**: two more ammeters drop in, between the bulbs and after the second
  bulb. All three read 0.2 A, and their readings flash together.
- **branches**: the parallel circuit: an ammeter on each branch reads 0.4 A, and one in the shared
  wire beside the battery reads 0.8 A. Chip "0.4 A + 0.4 A = 0.8 A".
- **voltmeter**: a large `meterSym('V')` with the label "voltmeter: voltage (potential difference),
  in volts (V)".
- **push**: back to the series loop. Dots leaving the battery carry a small yellow glow, and each
  glow passes into the bulbs as light. Labels "push from the cell" and "energy transferred".
- **across**: a voltmeter swings in on two leads that clip to either side of the first bulb, forming
  its own short branch. A highlight traces "across".
- **readings**: voltmeters across each bulb read 1.5 V, and one across the battery reads 3 V. Chip
  "1.5 V + 1.5 V = 3 V".
- **mnemonic**: a card reading "Ammeter: Always in a line. Voltmeter: Verily across.", with a mini
  ammeter in line and a mini voltmeter across a bulb.
- **wrong**: a voltmeter is dropped into the top wire in place of the ammeter. The dots crawl
  almost to a stop and the bulbs go dark. A cross and the label "voltmeter in series ✗".

## resistance: Resistance and resistors
The standard loop with one bulb and an ammeter (0.4 A), then wire samples, then the rheostat. New
art: wire samples, a realistic rheostat, a large "Ω", a dimmer knob, a volume slider.
- **what**: a `resistorSym` replaces the bulb, and the dots bunch up and squeeze slowly through it.
  Label "resistance: how hard it is for current to flow".
- **less**: two identical loops side by side on the 3 V battery: a small resistance (fast dots,
  0.4 A) and a large one (slow dots, 0.1 A). Label "more resistance, smaller current".
- **ohm**: a large "Ω" with the label "ohms", and a resistor tagged "10 Ω".
- **long**: two copper wires of the same thickness clip into two identical loops, one short and one
  twice as long. The long wire's ammeter reads less. Label "longer: more resistance".
- **thin**: a thick wire and a thin wire of the same length: the thin one's ammeter reads less. A
  summary appears: "long and thin: most resistance; short and thick: least".
- **resistor**: an LED (the shared LED symbol) on the battery with no resistor flashes and pops with
  a `spark()`. Reset with a `resistorSym` in series: the LED glows steadily. Label "limits the
  current".
- **variable**: the variable resistor symbol beside a realistic rheostat: a coil of wire on a bar
  with a sliding contact on top. Label "variable resistor (rheostat)".
- **slide**: **Showpiece**: the rheostat is in series with the bulb. The slider moves to put more
  coil in the circuit: the bulb dims from 1 to 0.3, the ammeter falls from 0.4 A to 0.1 A, and the
  dots slow. The slider returns, and everything rises again.
- **uses**: a dimmer knob turns and a lamp dims, then a volume slider moves and sound arcs shrink.

## direction: Which way does the current flow?
The standard loop with one bulb, its dots flowing clockwise. A zoom-in window in the second half
shows the inside of the wire. New art: the zoom window with ions and electrons, an old book, an
"electron" stamp.
- **which**: the loop with a large "?" in the middle, and grey arrows pointing both ways.
- **conv**: large yellow lib `arrow()`s run clockwise round the loop, out of +, up the left, across
  the top, down and into −, with the yellow dots following. Label "conventional current: + to −".
- **electrons**: a round zoom window on the top wire shows grey metal ions (each with a red "+")
  standing still, and small blue electrons drifting between them. Label "electrons are negative".
- **opposite**: **Showpiece**: the zoom closes, and blue electron dots flow round the same loop
  **anticlockwise**, out of −, round, and into +, alongside the yellow arrows going the other way.
  Labels "conventional current: + to −" and "electrons: − to +".
- **why**: an old book opens on a page with a "+ to −" arrow. Much later, an "electron" stamp lands
  on the page, and the book closes with the arrow still in it.
- **works**: back to the loop with only the yellow arrows. An exam answer with a "+ to −" arrow gets
  a green `tick()`.

## static: Static electricity
A run of vignettes, each filling the stage and fading before the next. New art: balloons, hair,
paper scraps, a wall, a metal sphere on a stand, an earth symbol, a storm cloud, a fuel tanker and
aircraft, a printer drum, a carpet and a door handle.
- **what**: a balloon with blue "−" signs sitting still on its surface. Nothing flows. Label
  "static: charge that stays put".
- **rub**: a balloon rubs back and forth on a person's hair (kit `person()`, head and shoulders).
  Blue electrons hop from the hair onto the balloon. Label "friction moves electrons".
- **gain**: the balloon now carries "−" signs and the hair carries "+" signs. Labels "gains
  electrons: negative" and "loses electrons: positive". Chip "only electrons move".
- **rule**: two pairs of hanging balloons: two negatives swing apart (red arrows), and a negative
  and a positive swing together (green arrows). Labels "like charges repel" and "unlike charges
  attract".
- **hair**: the hair strands, each with a small "+", lift and fan out away from each other, with
  tiny red repel arrows between them.
- **neutral**: the negative balloon hovers over scraps of paper, which jump up and stick to it.
  Then it presses against a wall and stays there.
- **induction**: a zoom window on the wall surface by the balloon. In each region of the wall, the
  "+" shifts a little towards the balloon and the "−" a little away. A big green pull arrow on the
  near side beats a small red push arrow on the far side. Label "induction".
- **earthing**: a metal sphere on an insulating stand, covered in "−", is joined by a wire to an
  earth symbol (three bars of shrinking width). Electrons stream down the wire until the sphere is
  neutral. Then a "+" sphere: electrons flow up the wire into it until it is neutral.
- **lightning**: **Showpiece**: a storm cloud with "−" along its base above "+" ground. A lib
  `bolt()` strikes with a white flash. A kit `sun()` icon and the chip "about 5 × hotter than the
  Sun's surface".
- **fuel**: a fuel tanker beside an aircraft. A green earthing cable is clipped on before the fuel
  hose connects, and a spark icon is struck out.
- **useful**: a laser printer cutaway: a turning drum carries a charged letter shape that picks up
  black toner powder and rolls it onto a sheet of paper.
- **shock**: a person walks across a carpet (kit `person()` with `walkPose()`), with "−" charges
  building up on them. Their hand nears a metal door handle, and a `spark()` jumps the gap: "zap!".

## recap: Recap: memory hooks and exam traps
A grid of mnemonic cards, then a column of trap cards, each flipping from a red cross to a green
tick. New art: a padlock; everything else is small copies of earlier art.
- **lock**: the title "Lock it in" with a padlock icon snapping shut.
- **lroa**: a card: two small magnets repel and attract, and a "−" and a "+" attract. "Likes Repel,
  Opposites Attract".
- **cobwebs**: a card "I See No Cobwebs" with the iron, steel, nickel and cobalt icons.
- **tic**: a card "TIC" with three tiny panels: turns, current, core.
- **meters**: a card with a mini loop: an ammeter in line and a voltmeter across a bulb.
- **shares**: a card with a series voltage bar splitting in two, and a parallel current arrow
  splitting in two.
- **traps**: the cards slide off, and the heading "5 exam traps" appears.
- **t1**: **Showpiece**: a small magnet with lines drawn S to N and crossing gets a cross, then
  the lines untangle and redraw N to S, nested, with a tick.
- **t2**: a small Earth with its inner magnet (S at the top) and a compass whose red end points up.
  Label "magnetic S near geographic N".
- **t3**: a small electromagnet: the switch opens, and the clips fall. Label "magnetism vanishes".
- **t4**: a series loop gains a bulb, and all the bulbs dim. A "brighter" chip gets a cross.
- **t5**: chips "current: amps (A)" and "voltage: volts (V)" get ticks. A swapped pair gets a cross.

## quiz: Quick-fire quiz
A question card with a lib `ring()` countdown that runs for each four-second pause, then the answer
with a small illustration. New art: none beyond earlier art.
- **intro**: the title "Quick-fire quiz!", with the five question dots in a row.
- **q1**: question card, with a small Earth and a "?" at its top. Ring counts down.
- **a1**: the Earth's inner magnet shows S (blue) at the top, and the compass's red end swings to
  point at it.
- **q2**: question card with a small electromagnet and a "?". Ring counts down.
- **a2**: three chips: "turns", "current", "iron core".
- **q3**: question card with a bulb, a loose `meterSym('V')` and a "?". Ring counts down.
- **a3**: the voltmeter swings across the bulb on its own branch. Label "in parallel".
- **q4**: question card with a series loop of two lit bulbs. One bulb drops out. Ring counts down.
- **a4**: the other bulb goes dark and the dots stop. Label "one loop, broken".
- **q5**: question card with a plastic rod and a cloth. Ring counts down.
- **a5**: **Showpiece**: blue electrons hop from the cloth onto the rod. The rod shows "−" and the
  cloth "+".
- **outro**: "Brilliant work", and a chip "Try the Magnetism & Electricity quiz".

---

## Suggested split for the animators

Five groups of three chapters. The groups keep shared art together where possible, and are
balanced by length (from the timeline) and difficulty.

| Group | Chapters | Length | Why together |
| --- | --- | --- | --- |
| A | `poles`, `fields`, `earth` | 3.1 min | Magnets, field lines and the compass, all in one place. `fields` (the filings) is the hard one. |
| B | `intro`, `permanent`, `electro` | 2.9 min | The nail electromagnet, domains and the solenoid. `electro` is the longest and hardest chapter. |
| C | `current`, `symbols`, `series` | 3.3 min | The first circuits, the symbol gallery and the series versus parallel test. Owns the extra symbols. |
| D | `meters`, `resistance`, `direction` | 2.7 min | Meters and readings, the rheostat and the two-way flow. Shorter, with exacting circuit rules. |
| E | `static`, `recap`, `quiz` | 3.5 min | Static vignettes (hard), then two lighter chapters built from art the other groups made. |

Order of work: C should draw the six extra circuit symbols first, so that D (the variable
resistor and LED) and E (recap and quiz) copy them exactly. Groups A and B should agree on the
field-line set early, because `electro` and `earth` reuse it.

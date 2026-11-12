/* LIGHT WORK (Claude Sitcom Ep 1, Photosynthesis): cast, sets and props. Bundled after engine lib.js, kit.js
   and sitcom.js, so everything in those (scTalk, scMake, scKavya, scKavyaBody, scConfessional, scLowerThird,
   scVideoCall, scClipboard, chip, molCO2, molH2O, molO2, molGlucose, leaf, sun, beaker, testTube, bunsen ...)
   is available. Every global here starts with `ph`, except `cast`.

   CHARACTERS: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still })   call every frame
       talk 0..1 mouth open (use scTalk(S, t, kind)); mood: neutral | happy | smug | annoyed | sad | shock | deadpan
       look -1..1 pupils left/right; sweat 0..1 (clive, dewi, gus, kavya); still: true stops the idle bob
     kinds:
       'clive'   chloroplast: green oval with grana stacks, pale face patch, yellow hard hat. The tired, dry manager.
       'phyllis' chlorophyll: round green face on four green "lobes" (the ring of the real molecule), an Mg gem on her
                 forehead, sunglasses pushed up, one RED and one BLUE earring (the colours she absorbs), a wavy green
                 tail (the real molecule's long tail) that swishes. The diva.
       'cosmo'   carbon dioxide: grey C (face) with a red O on each side, teal bucket hat. Sways gently: he drifts.
       'dewi'    water: blue round body with a droplet tip, two white H hair buns, commuter lanyard. Always puffed out.
       'gus'     glucose: amber hexagon with its red ring-oxygen corner, a cowlick and a "NEW" sticker. Bouncy.
       'olive'   oxygen (one O2 molecule): two fused red O balls, one face in the middle, purple beanie, headphones.
       'guards'  the two guard cells of a stoma: two green kidney-shaped cells (with small chloroplasts) either side of
                 the pore, each with its own face. Extra in g.set: open 0..1 (default 1) closes the stoma at 0;
                 talkB / moodB / lookB drive the right-hand guard (default: same as the left one).
       'kavya'   Kavya (scKavya): head and shoulders.
   Full-body Kavya: scKavyaBody(parent) from the sitcom kit.

   CONFESSIONALS AND NAME STRAPS
     phConf(parent, kind)            scConfessional tinted for that character (kind as above); g.set(p, t)
     phLower(parent, kind)           scLowerThird with the character's name and role (phLT below); g.set(p)
     phLT[kind] = [NAME, role]       the lower-third text, if you want it elsewhere

   SETS (full stage, 1200 x 750, drawn from (0,0))
     phBedroom(parent)     Kavya's HDB bedroom: big window (sky, HDB blocks, the aircon compressor on the wall outside),
                           windowsill with Plant on it, desk with lamp, bubble tea and books.
                           g.set({ t, night 0..1, lamp 0..1, hot 0..1 })  night darkens the sky and lights the flats;
                           lamp switches the desk lamp on; hot shows heat shimmer over the compressor.
                           g.plant (the phPlant on the sill), g.plantAt [x, y] (its pot base), g.lampAt, g.compAt.
     phFactory(parent)     inside Clive (a chloroplast): green hall, double-membrane walls, a skylight with sunbeams,
                           four grana stacks as big machines with lamps, a conveyor belt, and the board
                           "DAYS WITHOUT A NAME MIX-UP: 0". g.set({ t, light 0..1, belt (px/s) }). g.beltY = 650.
     phLeafSection(parent) a leaf cut open like a building: sky and sun above, waxy cuticle (roof), upper epidermis,
                           palisade (tall cells packed with chloroplasts), spongy layer (round cells, air spaces), a vein
                           (xylem above, phloem below), lower epidermis with one stoma and its two guard cells, air below.
                           g.at = { cuticle, upper, palisade, spongy, vein, xylem, phloem, lower, stoma } -> [x, y]
                           g.hi(name, p) glows the outline of that part (same names); g.set({ t, sun 0..1 })
     phTitle(parent)       title-card background: deep green, sun and turning rays, leaf corners. g.set(t)
     phLogo(parent)        the show logo "LIGHT WORK" (about 760 x 130, centred on its origin) with a sun on the
                           left and a leaf on the right; g.sun (spin it).  Rays/glow centre of phTitle: (600, 220).
   PROPS (drawn around their origin; place with tr)
     phPlant(parent, s)    Plant in its pot, origin at the bottom of the pot, about 270 tall. A sticky note "PLANT" on the pot.
                           g.set({ t, droop 0..1, foil 0..1 })  droop: sad leaves (after the wardrobe); foil: a foil
                           strip across the big right leaf. g.leafAt [x, y]: centre of that leaf (plant coords, s = 1).
     phLamp(parent, s)     desk lamp, origin at its base, head pointing left. g.set(on 0..1) shows the light cone.
     phCompressor(parent, s) aircon compressor box with a fan; g.upd(t, hot 0..1) spins the fan, shows heat shimmer.
     phClock(parent, s)    wall clock, r 50; g.set(hours) e.g. 7, 12, 14, 19
     phBoard(parent, w, h) whiteboard centred on its origin, with a marker tray
     phChem(parent, x, y, str, o)  formula text: '_' makes the next digits a subscript and colours leading
                           coefficients: phChem(g, 600, 300, '6CO_2 + 6H_2O → C_6H_12O_6 + 6O_2', { size: 54, coef: C.glucose })
                           o: size, fill, coef (colour of the big numbers), anchor ('middle' default), weight
     phGraph(parent, w, h, o)  rate graph, origin at the axes' corner; o.kind 'plateau' (rise, then flat) or 'temp'
                           (rise to a peak at about 40-45 °C, then crash); o.x x-axis label; o.y y-axis label
                           (default 'rate of photosynthesis'). g.set(p 0..1) draws the curve; g.pt(p) -> [x, y] on it;
                           g.kneeP: the p where the plateau (or the peak) starts.
     phXylem(parent, h)    a xylem vessel h tall (origin at the bottom), water molecules rising; g.upd(t, speed 0..1)
     phBubbleTea(parent, s) a bubble tea cup with a fat straw and pearls, origin at the bottom; g.set(level 0..1)
     phTestLeaf(parent, s, o) the starch-test leaf, centred, 300 long at s = 1; o.variegated: white edges;
                           o.strip: false for a leaf that never had foil on it (no foil strip, no unstarched band).
                           g.set({ pale 0..1 (chlorophyll removed by ethanol), iodine 0..1 (blue-black where there is
                           starch, orange-brown where not), foil 0..1 (foil strip on top) }). The strip under the foil
                           and the white edges of a variegated leaf have no starch.
     phWaterBath(parent, s) the safe way to heat ethanol: a beaker of hot water with a boiling tube of ethanol in it,
                           origin at the bottom. g.upd(t), g.set({ green 0..1 }) turns the ethanol green
                           (chlorophyll dissolving out of the leaf).
*/

/* ---------- confessional tints and name straps ---------- */
const phTint = {
  clive: ['#10301E', '#1F5A36'], phyllis: ['#1C3810', '#3E6B1C'], cosmo: ['#1F262E', '#3A4A58'], dewi: ['#0E2C3A', '#14506A'],
  gus: ['#3A2A10', '#6B4A12'], olive: ['#2A1420', '#4E2338'], guards: ['#0F2418', '#20402C'], kavya: ['#14243A', '#25446B'],
};
const phLT = {
  clive: ['CLIVE', 'Chloroplast. NOT chlorophyll.'], phyllis: ['PHYLLIS', 'Chlorophyll. The green pigment.'],
  cosmo: ['COSMO', 'Carbon dioxide. Drifts in.'], dewi: ['DEWI', 'Water. Up from the roots.'],
  gus: ['GUS', 'Glucose. First day.'], olive: ['OLIVE', 'Oxygen. The "waste product".'],
  guards: ['THE GUARDS', 'Guard cells. Stoma door.'], kavya: ['KAVYA, 12', 'Owner of Plant.'],
};
function phConf(parent, kind) { const [a, b] = phTint[kind] || phTint.clive; return scConfessional(parent, a, b); }
function phLower(parent, kind) { const [n, r] = phLT[kind] || [String(kind).toUpperCase(), '']; return scLowerThird(parent, n, r); }

/* ---------- small helpers ---------- */
function phMix(a, b, p) {
  p = clamp(p);
  const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
function phPoly(pts) { return 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z'; }
function phHex(r, pointy) {
  const pts = [];
  for (let i = 0; i < 6; i++) { const a = (pointy ? -Math.PI / 2 : 0) + i * Math.PI / 3; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
  return pts;
}

/* ---------- the cast ---------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const ink = SC_INK;
  if (kind === 'clive') {
    return scMake(parent, { s: o.s, mood: o.mood, seed: 4, bob: 3,
      draw: g => {
        E('ellipse', { rx: 120, ry: 76, fill: ball('#74DE8A', '#1F7A3E'), stroke: ink, 'stroke-width': 5 }, g);
        E('ellipse', { rx: 106, ry: 63, fill: 'none', stroke: '#2C8C4C', 'stroke-width': 4, opacity: 0.75 }, g);   // inner membrane
        let d = '';   // grana: little stacks of discs, low on his body
        [[-84, 24], [-56, 36], [56, 36], [84, 24]].forEach(([x, y]) => { for (let k = 0; k < 3; k++) d += `M${x - 15},${y + k * 9} h30 a3.5,3.5 0 0 1 0,7 h-30 a3.5,3.5 0 0 1 0,-7 Z `; });
        E('path', { d, fill: '#1B6E37', stroke: '#0F4824', 'stroke-width': 1.5 }, g);
        E('ellipse', { cx: 0, cy: -8, rx: 72, ry: 48, fill: '#E4FAE8', opacity: 0.96 }, g);                       // face patch
        const hat = G(g);                                                                                         // hard hat
        E('path', { d: 'M-58,-64 Q-56,-128 0,-130 Q56,-128 58,-64 Z', fill: '#FFC93C', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hat);
        E('path', { d: 'M-8,-128 L-8,-66 M8,-128 L8,-66', stroke: '#E0A400', 'stroke-width': 4 }, hat);
        E('rect', { x: -80, y: -72, width: 160, height: 15, rx: 7.5, fill: '#FFB000', stroke: ink, 'stroke-width': 4 }, hat);
        // ID badge on a lanyard
        E('path', { d: 'M-30,44 L0,62 L30,44', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 3 }, g);
        E('rect', { x: -14, y: 58, width: 28, height: 20, rx: 3, fill: '#FFFFFF', stroke: ink, 'stroke-width': 2.5 }, g);
        E('rect', { x: -14, y: 58, width: 28, height: 6, fill: '#3F5BD9' }, g);
      },
      face: { x: 0, y: -12, eye: 17, gap: 54, mouthW: 44, mouthY: 28, lidCol: '#8FE59C' },
      sweat: [[-112, -40], [114, -30]] });
  }
  if (kind === 'phyllis') {
    let tail = null, tailInk = null;
    const tailD = t => { const p = []; for (let k = 0; k <= 10; k++) { const u = k / 10; p.push([70 + u * 95, 70 + u * 70 + Math.sin(u * 7 - t * 2.6) * 12 * u]); } return openPath(p); };
    return scMake(parent, { s: o.s, mood: o.mood, seed: 9, bob: 5,
      draw: g => {
        tailInk = E('path', { d: '', fill: 'none', stroke: ink, 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        tail = E('path', { d: '', fill: 'none', stroke: '#3DB862', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        [[-60, -52], [60, -52], [-60, 52], [60, 52]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 40, fill: ball('#8BE89A', '#23874A'), stroke: ink, 'stroke-width': 4 }, g));
        E('circle', { r: 80, fill: ball('#A6F2B0', '#3BAA5A'), stroke: ink, 'stroke-width': 5 }, g);
        const sg = G(g); tr(sg, 0, -100, 1, -8);                                                                  // sunglasses, pushed up
        E('path', { d: 'M-58,-16 L-8,-16 L-12,12 Q-34,22 -54,12 Z M8,-16 L58,-16 L54,12 Q34,22 12,12 Z', fill: '#FF5FA2', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, sg);
        E('path', { d: 'M-50,-10 L-14,-10 L-17,8 Q-34,15 -48,8 Z M14,-10 L50,-10 L48,8 Q34,15 17,8 Z', fill: '#2A2140' }, sg);
        E('path', { d: 'M-8,-12 Q0,-20 8,-12', fill: 'none', stroke: ink, 'stroke-width': 4 }, sg);
        E('path', { d: 'M-44,-4 L-28,-4 M22,-4 L38,-4', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.7, 'stroke-linecap': 'round' }, sg);
        const gem = G(g); tr(gem, 0, -58);                                                                       // the magnesium gem
        E('path', { d: 'M0,-15 L16,0 L0,15 L-16,0 Z', fill: ball('#E6DDFF', '#8C7BC9'), stroke: ink, 'stroke-width': 2.5 }, gem);
        T(gem, 0, 5, 'Mg', { size: 13, weight: 800, anchor: 'middle', fill: '#3A2A6B' });
        [[-1, '#FF4D5E'], [1, '#3D7BFF']].forEach(([sd, col]) => {                                               // red and blue earrings
          E('line', { x1: sd * 80, y1: 18, x2: sd * 86, y2: 36, stroke: '#E8E1C0', 'stroke-width': 3 }, g);
          E('circle', { cx: sd * 87, cy: 46, r: 12, fill: ball(col, col === '#FF4D5E' ? '#A0202C' : '#1F48A8'), stroke: ink, 'stroke-width': 3 }, g);
        });
        [-1, 1].forEach(sd => E('path', { d: `M${sd * 42},-14 l${sd * 10},-8 M${sd * 46},-6 l${sd * 12},-4 M${sd * 46},3 l${sd * 12},0`, stroke: ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g));   // lashes
        E('ellipse', { cx: -50, cy: 26, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.55 }, g);
        E('ellipse', { cx: 50, cy: 26, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.55 }, g);
      },
      face: { x: 0, y: 0, eye: 19, gap: 58, mouthW: 42, mouthY: 34, lidCol: '#9CEDA6' },
      upd: t => { const d = tailD(t); attr(tail, 'd', d); attr(tailInk, 'd', d); } });
  }
  if (kind === 'cosmo') {
    return scMake(parent, { s: o.s, mood: o.mood, seed: 6, bob: 6,
      draw: g => {
        E('path', { d: 'M-78,-4 L-66,-4 M-78,16 L-66,16 M66,-4 L78,-4 M66,16 L78,16', stroke: ink, 'stroke-width': 7 }, g);   // O=C=O double bonds
        [-1, 1].forEach(sd => { const ox = G(g); tr(ox, sd * 124, 6); E('circle', { r: 50, fill: ball(C.oxygen, C.oxygenDk), stroke: ink, 'stroke-width': 4 }, ox); T(ox, 0, 11, 'O', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE1DC' }); });
        E('circle', { r: 74, fill: ball(C.carbon, C.carbonDk), stroke: ink, 'stroke-width': 5 }, g);
        T(g, 52, 62, 'C', { size: 26, weight: 800, anchor: 'middle', fill: '#E8EEF3', opacity: 0.85 });
        const hat = G(g); tr(hat, 0, 0, 1, -7);                                                                   // bucket hat
        E('path', { d: 'M-50,-62 Q-46,-112 0,-114 Q46,-112 50,-62 Z', fill: '#2FB5A8', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hat);
        E('path', { d: 'M-78,-58 Q0,-80 78,-58 Q86,-48 70,-44 Q0,-62 -70,-44 Q-86,-48 -78,-58 Z', fill: '#24968B', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hat);
        [[-24, -92], [10, -100], [30, -78], [-6, -76]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 5, fill: '#FFE45C' }, hat));
      },
      face: { x: 0, y: -6, eye: 16, gap: 48, mouthW: 40, mouthY: 32, lidCol: '#B3BFCB' },
      upd: (t, g, st) => {   // a slow drift: sway as well as bob
        const b = Math.sin(t * TAU * 0.5 + 6) * 6 * (st.still ? 0 : 1), r = Math.sin(t * TAU * 0.23) * 4 * (st.still ? 0 : 1);
        g.setAttribute('transform', `translate(0 ${b.toFixed(2)}) rotate(${r.toFixed(2)})`);
      } });
  }
  if (kind === 'dewi') {
    return scMake(parent, { s: o.s, mood: o.mood, seed: 12, bob: 6,
      draw: g => {
        [-1, 1].forEach(sd => { const h = G(g); tr(h, sd * 66, -72); E('circle', { r: 31, fill: ball(C.hydrogen, C.hydrogenDk), stroke: ink, 'stroke-width': 4 }, h); T(h, 0, 9, 'H', { size: 26, weight: 800, anchor: 'middle', fill: '#6B7B8A' }); });
        E('path', { d: 'M-26,-80 Q-4,-98 0,-120 Q4,-98 26,-80 Z', fill: '#5CCDF2', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // droplet tip
        E('circle', { r: 88, fill: ball('#6FD6F7', C.waterDk), stroke: ink, 'stroke-width': 5 }, g);
        E('path', { d: 'M-56,-48 Q-40,-66 -18,-70', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, opacity: 0.55, 'stroke-linecap': 'round' }, g);   // shine
        E('path', { d: 'M-46,44 L0,70 L46,44', fill: 'none', stroke: '#FF7A59', 'stroke-width': 4 }, g);              // lanyard
        E('rect', { x: -20, y: 64, width: 40, height: 26, rx: 4, fill: '#FFFFFF', stroke: ink, 'stroke-width': 3 }, g);
        E('rect', { x: -20, y: 64, width: 40, height: 8, fill: '#FF7A59' }, g);
        E('ellipse', { cx: -52, cy: 24, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.5 }, g);
        E('ellipse', { cx: 52, cy: 24, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.5 }, g);
      },
      face: { x: 0, y: -8, eye: 18, gap: 52, mouthW: 40, mouthY: 32, lidCol: '#8FE0F8' },
      sweat: [[-84, -44], [88, -34], [-96, 6]] });
  }
  if (kind === 'gus') {
    const pts = phHex(94, true);
    return scMake(parent, { s: o.s, mood: o.mood, seed: 3, bob: 8,
      draw: g => {
        E('path', { d: 'M-4,-90 Q-24,-122 2,-132 M4,-90 Q12,-124 34,-120 M0,-92 Q-2,-116 -20,-126', fill: 'none', stroke: ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);   // cowlick
        E('path', { d: phPoly(pts), fill: ball(C.glucose, C.glucoseDk), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: phPoly(phHex(78, true)), fill: 'none', stroke: C.glucoseLt, 'stroke-width': 4, opacity: 0.6 }, g);
        E('circle', { cx: pts[1][0], cy: pts[1][1], r: 15, fill: ball(C.oxygen, C.oxygenDk), stroke: ink, 'stroke-width': 3 }, g);   // the ring's oxygen
        const st = G(g); tr(st, -50, 54, 1, -12);                                                                 // first-day sticker
        E('circle', { r: 24, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 3.5 }, st);
        T(st, 0, 6, 'NEW', { size: 16, weight: 800, anchor: 'middle', fill: '#E8424F' });
        [[-44, 22], [-36, 30], [-28, 22], [36, 22], [44, 30], [52, 22]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 2.6, fill: '#B57B12' }, g));   // freckles
      },
      face: { x: 0, y: -10, eye: 20, gap: 56, mouthW: 46, mouthY: 32, lidCol: '#FFD877', iris: '#5A2B07' },
      sweat: [[-92, -30], [92, -20]] });
  }
  if (kind === 'olive') {
    return scMake(parent, { s: o.s, mood: o.mood || 'deadpan', seed: 15, bob: 2,
      draw: g => {
        E('path', { d: 'M-120,-6 Q-124,-136 0,-138 Q124,-136 120,-6', fill: 'none', stroke: '#1E1A22', 'stroke-width': 11, 'stroke-linecap': 'round' }, g);   // headphone band
        // one O2 molecule: two O atoms fused into a soft capsule, a dip in the top outline and a faint seam where they meet
        E('path', { d: 'M-46,-62 Q0,-48 46,-62 A76,76 0 0 1 46,86 Q0,96 -46,86 A76,76 0 0 1 -46,-62 Z', fill: ball(C.oxygen, C.oxygenDk), stroke: ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M0,-52 L0,90', fill: 'none', stroke: C.oxygenDk, 'stroke-width': 3, opacity: 0.35, 'stroke-dasharray': '10 8' }, g);
        T(g, -68, 62, 'O', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE1DC', opacity: 0.9 });
        T(g, 68, 62, 'O', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE1DC', opacity: 0.9 });
        E('path', { d: 'M-104,-26 Q-104,-108 0,-112 Q104,-108 104,-26 Q0,-48 -104,-26 Z', fill: '#3B2A4A', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // beanie
        E('path', { d: 'M-108,-30 Q0,-54 108,-30 L106,-12 Q0,-36 -106,-12 Z', fill: '#57406E', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('circle', { cx: 0, cy: -116, r: 12, fill: '#57406E', stroke: ink, 'stroke-width': 3 }, g);
        [-1, 1].forEach(sd => { E('rect', { x: sd * 124 - 16, y: -34, width: 32, height: 58, rx: 12, fill: '#2A2430', stroke: ink, 'stroke-width': 4 }, g); E('rect', { x: sd * 124 - 6, y: -24, width: 12, height: 38, rx: 6, fill: '#FF5FA2' }, g); });
      },
      face: { x: 0, y: 14, eye: 17, gap: 52, mouthW: 36, mouthY: 34, lidCol: '#FF8E82' } });
  }
  if (kind === 'guards') {
    const beans = [], faces = [];
    let pore = null;
    const BEAN = 'M0,-108 C-64,-108 -66,108 0,108 C28,108 34,68 18,0 C34,-68 28,-108 0,-108 Z';
    return scMake(parent, { s: o.s, mood: o.mood || 'deadpan', seed: 5, bob: 1,
      draw: g => {
        pore = E('ellipse', { rx: 30, ry: 84, fill: '#0B2416', stroke: ink, 'stroke-width': 3 }, g);
        [-1, 1].forEach(sd => {
          const b = G(g); beans.push(b);
          E('path', { d: BEAN, fill: ball('#86E596', '#2C8C4C'), stroke: ink, 'stroke-width': 5, transform: sd > 0 ? 'scale(-1 1)' : '' }, b);
          let d = '';
          [[-24, -86], [-38, -62], [-40, 44], [-30, 74], [-8, 92]].forEach(([x, y]) => { const X = sd < 0 ? x : -x; d += `M${X - 7},${y} a7,4.5 0 1,0 14,0 a7,4.5 0 1,0 -14,0 `; });
          E('path', { d, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 1.5 }, b);                        // guard cells have chloroplasts
          E('path', { d: `M${sd * 46},-32 q${sd * 14},6 ${sd * 8},20 q${sd * -6},12 ${sd * 4},22`, fill: 'none', stroke: '#1E1A22', 'stroke-width': 3, 'stroke-linecap': 'round' }, b);   // security earpiece
          E('circle', { cx: sd * 46, cy: -32, r: 5, fill: '#1E1A22' }, b);
          const f = scFace(b, { eye: 13, gap: 32, mouthW: 28, mouthY: 28, lidCol: '#9CEDA6' }); tr(f, sd * 14, -18); faces.push(f);
        });
      },
      upd: (t, g, st) => {
        const op_ = st.open === undefined ? 1 : clamp(st.open), x = lerp(20, 58, op_);
        tr(beans[0], -x, 0); tr(beans[1], x, 0); attr(pore, 'rx', 2 + 38 * op_); attr(pore, 'ry', 50 + 34 * op_);
        const m = st.mood || o.mood || 'deadpan';
        faces[0].set({ mood: m, talk: st.talk || 0, look: st.look || 0, blink: scBlink(t, 5) });
        faces[1].set({ mood: st.moodB || m, talk: st.talkB ?? st.talk ?? 0, look: st.lookB ?? st.look ?? 0, blink: scBlink(t, 9) });
      } });
  }
  throw new Error('cast: unknown kind ' + kind);
}

/* ---------- props ---------- */
function phPlant(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const ink = SC_INK;
  E('path', { d: 'M-4,-104 C-10,-150 8,-190 0,-236', fill: 'none', stroke: '#2E8A4A', 'stroke-width': 10, 'stroke-linecap': 'round' }, inner);   // stem
  const LEAVES = [[-2, -150, -152, 0.5], [2, -170, -30, 0.5], [0, -205, -128, 0.46], [0, -216, -58, 0.44], [0, -236, -92, 0.42]];
  const BIG = [4, -124, -14, 0.66];   // the big right leaf (foil, zoom target)
  const lv = LEAVES.concat([BIG]).map(([x, y, a, sc]) => { const w = G(inner); const l = leaf(w, sc); tr(w, x, y, 1, a); return { w, x, y, a, sc, l }; });
  const big = lv[lv.length - 1];
  const foil = G(big.w);
  E('path', { d: 'M62,-34 L98,-36 L100,34 L64,32 Z', fill: linGrad('#F4F7FA', '#9FAAB5'), stroke: '#7D8892', 'stroke-width': 2.5 }, foil);
  E('path', { d: 'M70,-26 L76,24 M86,-30 L90,28', stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.7 }, foil);
  // pot, rim, soil, sticky note
  E('path', { d: 'M-66,-104 L66,-104 L54,0 L-54,0 Z', fill: ball('#D9774A', '#9C4A27'), stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
  E('rect', { x: -76, y: -118, width: 152, height: 22, rx: 6, fill: '#C9643A', stroke: ink, 'stroke-width': 4 }, inner);
  E('ellipse', { cx: 0, cy: -118, rx: 66, ry: 7, fill: '#5A3A24' }, inner);
  const note = G(inner); tr(note, 0, -54, 1, -5);
  E('rect', { x: -48, y: -24, width: 96, height: 48, fill: '#FFF176', stroke: '#C9B53A', 'stroke-width': 2 }, note);
  T(note, 0, 10, 'PLANT', { size: 26, weight: 700, anchor: 'middle', fill: '#2A3A8A', font: FB });
  g.leafAt = [4 + Math.cos(BIG[2] * Math.PI / 180) * 100 * BIG[3] * 1.0, -124 + Math.sin(BIG[2] * Math.PI / 180) * 100 * BIG[3]];
  g.set = st => {
    st = st || {};
    const t = st.t || 0, dr = clamp(st.droop || 0);
    lv.forEach(({ w, x, y, a }, i) => {
      const down = a < -90 ? -1 : 1;   // leaves on the left droop anticlockwise, on the right clockwise
      tr(w, x, y, 1, a + down * dr * 55 + Math.sin(t * 1.1 + i) * 1.5 * (1 - dr));
    });
    op(foil, st.foil || 0);
  };
  g.set({});
  return g;
}

function phLamp(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const ink = SC_INK;
  const cone = E('path', { d: 'M-118,-158 L-360,40 L-60,40 L-70,-122 Z', fill: '#FFF3A0' }, inner);
  E('ellipse', { cx: 0, cy: -6, rx: 52, ry: 12, fill: '#3F5BD9', stroke: ink, 'stroke-width': 4 }, inner);
  E('path', { d: 'M0,-10 L22,-110 L-64,-170', fill: 'none', stroke: ink, 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
  E('path', { d: 'M0,-10 L22,-110 L-64,-170', fill: 'none', stroke: '#5C7BFF', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
  E('circle', { cx: 22, cy: -110, r: 9, fill: '#2A3A8A', stroke: ink, 'stroke-width': 3 }, inner);
  const head = G(inner); tr(head, -64, -170, 1, 40);
  E('path', { d: 'M-10,-14 L10,-14 L44,40 L-44,40 Z', fill: '#3F5BD9', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, head);
  const bulb = E('ellipse', { cx: 0, cy: 42, rx: 30, ry: 10, fill: '#FFF7C2', stroke: ink, 'stroke-width': 3 }, head);
  const halo = E('circle', { cx: -94, cy: -138, r: 70, fill: glow('#FFF3A0') }, inner);
  g.set = on => { on = clamp(on); op(cone, 0.32 * on); op(halo, on); attr(bulb, 'fill', on > 0.5 ? '#FFFFFF' : '#E8E1C0'); };
  g.set(0);
  return g;
}

function phCompressor(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const ink = SC_INK;
  E('path', { d: 'M-90,62 L-90,78 M90,62 L90,78 M-100,78 L100,78', stroke: '#7D8892', 'stroke-width': 6 }, inner);   // bracket
  E('rect', { x: -96, y: -62, width: 192, height: 124, rx: 10, fill: '#E9EEF2', stroke: ink, 'stroke-width': 4 }, inner);
  E('circle', { cx: -26, cy: 0, r: 48, fill: '#9AA6B2', stroke: ink, 'stroke-width': 3 }, inner);
  const fan = G(inner); tr(fan, -26, 0);
  for (let i = 0; i < 3; i++) E('path', { d: 'M0,0 Q20,-10 40,-4 Q22,8 0,0 Z', fill: '#5A6B7A', transform: `rotate(${i * 120})` }, fan);
  let grill = '';
  for (let r = 12; r <= 44; r += 8) grill += `M${-26 - r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `;
  E('path', { d: grill, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 2 }, inner);
  for (let i = 0; i < 5; i++) E('line', { x1: 40, y1: -40 + i * 18, x2: 80, y2: -40 + i * 18, stroke: '#9AA6B2', 'stroke-width': 4 }, inner);
  const hw = heatWaves(inner, { n: 4, h: 90, spacing: 30, color: C.heat }); tr(hw, -26, -66);
  g.upd = (t, hot) => { tr(fan, -26, 0, 1, (t * 520) % 360); hw.upd(t); op(hw, clamp(hot === undefined ? 0 : hot)); };
  g.upd(0, 0);
  return g;
}

function phClock(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('circle', { r: 50, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, inner);
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ticks += `M${(Math.cos(a) * 38).toFixed(1)},${(Math.sin(a) * 38).toFixed(1)} L${(Math.cos(a) * 45).toFixed(1)},${(Math.sin(a) * 45).toFixed(1)} `; }
  E('path', { d: ticks, stroke: SC_INK, 'stroke-width': 3 }, inner);
  const hr = E('line', { x1: 0, y1: 0, x2: 0, y2: -22, stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, inner);
  const mn = E('line', { x1: 0, y1: 0, x2: 0, y2: -36, stroke: '#E8424F', 'stroke-width': 4, 'stroke-linecap': 'round' }, inner);
  E('circle', { r: 5, fill: SC_INK }, inner);
  g.set = h => { tr(hr, 0, 0, 1, (h % 12) * 30); tr(mn, 0, 0, 1, (h % 1) * 360); };
  g.set(7);
  return g;
}

function phBoard(parent, w, h) {
  const g = G(parent);
  E('rect', { x: -w / 2 - 12, y: -h / 2 - 12, width: w + 24, height: h + 24, rx: 12, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 6, fill: '#FBFDFF' }, g);
  E('path', { d: `M${-w / 2 + 30},${-h / 2 + 24} L${-w / 2 + 120},${-h / 2 + 18}`, stroke: '#E3EAF0', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
  E('rect', { x: -w / 2 + 40, y: h / 2 + 10, width: w - 80, height: 14, rx: 5, fill: '#7D8892', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('rect', { x: w / 2 - 150, y: h / 2 + 2, width: 60, height: 10, rx: 4, fill: '#3F5BD9' }, g);
  E('rect', { x: w / 2 - 80, y: h / 2 + 2, width: 60, height: 10, rx: 4, fill: '#E8424F' }, g);
  return g;
}

/* formula text: '_' before digits makes them a subscript; leading digits of a term get o.coef */
function phChem(parent, x, y, str, o) {
  o = o || {};
  const size = o.size || 48, fill = o.fill || SC_INK;
  const font = o.font || FD, wt = o.weight || 700;
  const t = E('text', { x, y, 'font-size': size, 'font-weight': wt, fill, 'text-anchor': o.anchor || 'middle', 'font-family': font }, parent);
  // tokens: ['sub', '2'] subscript digits, ['coef', '6'] a leading coefficient, ['txt', 'CO + '] plain text
  const toks = [];
  let i = 0, termStart = true;
  while (i < str.length) {
    const ch = str[i];
    if (ch === '_') { let j = i + 1; while (j < str.length && /[0-9]/.test(str[j])) j++; toks.push(['sub', str.slice(i + 1, j)]); i = j; termStart = false; continue; }
    if (termStart && /[0-9]/.test(ch)) { let j = i; while (j < str.length && /[0-9]/.test(str[j])) j++; toks.push(['coef', str.slice(i, j)]); i = j; termStart = false; continue; }
    if (/[+→=]/.test(ch)) termStart = true; else if (ch !== ' ') termStart = false;
    const last = toks[toks.length - 1];
    if (last && last[0] === 'txt') last[1] += ch; else toks.push(['txt', ch]);
    i++;
  }
  let low = false, w = 0;
  toks.forEach(([k, s]) => {
    const a = {};
    if (k === 'sub') { if (!low) a.dy = (size * 0.28).toFixed(1); a['font-size'] = (size * 0.62).toFixed(1); low = true; w += textWidth(s, size * 0.62, font, wt); }
    else { if (low) a.dy = (-size * 0.28).toFixed(1); low = false; if (k === 'coef') a.fill = o.coef || fill; w += textWidth(s, size, font, wt); }
    const sp = E('tspan', a, t); sp.textContent = s;
  });
  t.w = w;
  return t;
}

function phGraph(parent, w, h, o) {
  o = o || {};
  const g = G(parent), kind = o.kind || 'plateau';
  E('path', { d: `M0,${-h - 10} L0,0 L${w + 10},0`, fill: 'none', stroke: C.ink, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  E('path', { d: `M-9,${-h} L0,${-h - 18} L9,${-h} Z M${w},-9 L${w + 18},0 L${w},9 Z`, fill: C.ink }, g);
  const yl = T(g, -24, -h / 2, o.y || 'rate of photosynthesis', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  yl.setAttribute('transform', `rotate(-90 -24 ${-h / 2})`);
  T(g, w / 2, 46, o.x || 'light intensity', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const N = 72, pts = [];
  for (let k = 0; k <= N; k++) {
    const u = k / N;
    let v;
    if (kind === 'temp') v = u < 0.68 ? Math.pow(u / 0.68, 1.6) : Math.max(0, 1 - Math.pow((u - 0.68) / 0.2, 1.5));
    else v = 1 - Math.exp(-u * 5.2);
    pts.push([u * w, -v * h * 0.82]);
  }
  const curve = E('path', { d: '', fill: 'none', stroke: o.color || C.plant, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  g.curve = curve;
  g.kneeP = kind === 'temp' ? 0.68 : 0.55;
  g.pt = p => { const f = clamp(p) * N, k = Math.min(N - 1, Math.floor(f)), r = f - k; return [lerp(pts[k][0], pts[k + 1][0], r), lerp(pts[k][1], pts[k + 1][1], r)]; };
  g.set = p => {
    p = clamp(p);
    if (p <= 0) { attr(curve, 'd', ''); return; }
    const f = p * N, k = Math.floor(f), sub = pts.slice(0, k + 1);
    if (k < N) sub.push(g.pt(p));
    attr(curve, 'd', openPath(sub));
  };
  g.set(0);
  return g;
}

function phXylem(parent, h) {
  const g = G(parent), ink = SC_INK;
  E('rect', { x: -38, y: -h, width: 76, height: h, fill: 'rgba(160,220,255,0.18)' }, g);
  let rings = '';
  for (let y = -h + 14; y < 0; y += 26) rings += `M-38,${y} Q0,${y + 10} 38,${y} `;
  E('path', { d: rings, fill: 'none', stroke: '#8C6B3A', 'stroke-width': 4, opacity: 0.55 }, g);   // lignin rings
  E('path', { d: `M-38,${-h} L-38,0 M38,${-h} L38,0`, stroke: '#8C6B3A', 'stroke-width': 9 }, g);
  E('path', { d: `M-38,${-h} L-38,0 M38,${-h} L38,0`, stroke: ink, 'stroke-width': 3, opacity: 0.5 }, g);
  const ms = [];
  for (let i = 0; i < 7; i++) { const m = molH2O(g, 13); ms.push(m); }
  g.upd = (t, speed) => {
    const sp = speed === undefined ? 1 : speed;
    ms.forEach((m, i) => { const f = ((t * 0.16 * sp) + i / ms.length) % 1; tr(m, Math.sin(i * 2.1 + t) * 10, -f * h, 1, (i * 47 + t * 30 * sp) % 360); op(m, Math.min(1, f * 8, (1 - f) * 8)); });
  };
  g.upd(0, 1);
  return g;
}

function phBubbleTea(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const ink = SC_INK;
  const cupD = 'M-62,-190 L62,-190 L48,0 L-48,0 Z';
  const id = 'phbt' + Math.round((s || 1) * 1000);
  const cp = E('clipPath', { id }, defs()); E('path', { d: cupD }, cp);
  E('path', { d: cupD, fill: 'rgba(255,255,255,0.25)' }, inner);
  const tea = E('rect', { x: -70, y: -170, width: 140, height: 170, fill: '#D9A877', 'clip-path': `url(#${id})` }, inner);
  const pearls = G(inner, { 'clip-path': `url(#${id})` });
  const r = rng(41);
  for (let i = 0; i < 16; i++) E('circle', { cx: -40 + r() * 80, cy: -10 - r() * 40, r: 9, fill: '#2A1A12' }, pearls);
  E('path', { d: 'M10,-300 L24,-300 L6,-14 L-8,-14 Z', fill: '#FF6FB5', stroke: ink, 'stroke-width': 3 }, inner);   // fat straw
  E('path', { d: cupD, fill: 'none', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
  E('path', { d: 'M-68,-190 Q0,-236 68,-190 Z', fill: 'rgba(255,255,255,0.5)', stroke: ink, 'stroke-width': 4 }, inner);   // dome lid
  E('rect', { x: -64, y: -120, width: 128, height: 34, fill: '#FFFFFF', opacity: 0.85 }, inner);
  E('path', { d: 'M-30,-103 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0 M10,-103 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', fill: '#2A1A12' }, inner);   // pearl logo, no brand
  g.set = level => { level = clamp(level); attr(tea, 'y', -170 * level); attr(tea, 'height', 170 * level + 2); };
  g.set(0.8);
  return g;
}

function phTestLeaf(parent, s, o) {
  o = o || {};
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const L = 'M-150,0 C-110,-92 70,-100 150,0 C70,100 -110,92 -150,0 Z';
  const id = 'phtl' + (++phTestLeaf.n);
  const cp = E('clipPath', { id }, defs()); E('path', { d: L }, cp);
  E('path', { d: 'M-150,0 L-210,14', stroke: '#6B8E4E', 'stroke-width': 8, 'stroke-linecap': 'round' }, inner);   // stalk
  const base = E('path', { d: L, fill: '#3FAE5A' }, inner);              // the starch-making part
  const clipped = G(inner, { 'clip-path': `url(#${id})` });
  let margin = null;
  if (o.variegated) {
    margin = E('path', { d: L + ' M-104,0 C-76,-58 48,-64 104,0 C48,64 -76,58 -104,0 Z', fill: '#F4F1DE', 'fill-rule': 'evenodd' }, clipped);
  }
  const under = o.strip === false ? null : E('rect', { x: 10, y: -110, width: 54, height: 220, fill: '#3FAE5A' }, clipped);   // the strip that was under the foil
  E('path', { d: 'M-150,0 C-60,-6 60,-6 150,0', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.45 }, clipped);   // midrib
  let veins = '';
  for (let i = 1; i <= 5; i++) { const x = -150 + i * 48; veins += `M${x},-3 Q${x + 26},-30 ${x + 46},-52 M${x},3 Q${x + 26},30 ${x + 46},52 `; }
  E('path', { d: veins, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.3 }, clipped);
  E('path', { d: L, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, inner);
  const foil = G(inner);
  E('rect', { x: 4, y: -96, width: 66, height: 192, rx: 4, fill: linGrad('#F4F7FA', '#9FAAB5'), stroke: '#7D8892', 'stroke-width': 3 }, foil);
  E('path', { d: 'M16,-84 L22,80 M40,-88 L46,84', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.7 }, foil);
  const GREEN = '#3FAE5A', PALE = '#EFE3B8', BLUE = '#1C2238', ORANGE = '#C8782F', WHITE = '#F4F1DE';
  g.set = st => {
    st = st || {};
    const pale = clamp(st.pale || 0), io = clamp(st.iodine || 0);
    const c0 = phMix(GREEN, PALE, pale);
    attr(base, 'fill', phMix(c0, BLUE, io));          // starch here
    if (under) attr(under, 'fill', phMix(c0, ORANGE, io));   // no light under the foil: no starch
    if (margin) attr(margin, 'fill', phMix(phMix(WHITE, PALE, pale), ORANGE, io));   // no chlorophyll: no starch
    op(foil, under ? (st.foil || 0) : 0);
  };
  g.set({});
  return g;
}
phTestLeaf.n = 0;

function phWaterBath(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const bk = beaker(inner, 230, 210, { level: 0.68, liquid: '#7FC8F0', opacity: 0.6 }); tr(bk, 0, -105);
  const tube = testTube(inner, 54, 250, { level: 0.42, liquid: '#E9F2F7', opacity: 0.85 }); tr(tube, 10, -150, 1, 6);
  const bub = bubbles(inner, -100, -150, 200, 130, { n: 9, r: 6, seed: 7 });
  const steam = heatWaves(inner, { n: 3, h: 70, spacing: 40, color: '#FFFFFF', width: 4 }); tr(steam, -40, -215);
  g.upd = t => { bub.upd(t, 1); steam.upd(t); };
  g.set = st => { st = st || {}; tube.set(0.42, phMix('#E9F2F7', '#4FC26A', st.green || 0)); };
  g.upd(0);
  return g;
}

/* ---------- sets ---------- */
function phBedroom(parent) {
  const g = G(parent), ink = SC_INK;
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2E4D2', '#E2CDB6', true) }, g);   // wall
  // the window: sky, HDB blocks, the compressor
  const WX = 110, WY = 110, WW = 640, WH = 370;
  const id = 'phbrwin';
  const cp = E('clipPath', { id }, defs()); E('rect', { x: WX, y: WY, width: WW, height: WH }, cp);
  const view = G(g, { 'clip-path': `url(#${id})` });
  const skyDay = E('rect', { x: WX, y: WY, width: WW, height: WH, fill: linGrad('#6EC3F5', '#D2F0FF', true) }, view);
  const skyNight = E('rect', { x: WX, y: WY, width: WW, height: WH, fill: linGrad('#0B1433', '#2A3466', true) }, view);
  const sunG = G(view); tr(sunG, 640, 170);
  E('circle', { r: 90, fill: glow('#FFE45C') }, sunG); E('circle', { r: 36, fill: '#FFE45C' }, sunG);
  const moon = E('path', { d: 'M640,150 a30,30 0 1,0 30,40 a24,24 0 1,1 -30,-40 Z', fill: '#F4F1DE' }, view);
  const lit = [];
  const blocks = [[140, 210, 150, 300, '#F4EEE4', '#E07A5F'], [320, 160, 170, 350, '#EAF2F4', '#3D9DD8'], [520, 240, 140, 270, '#F6EBD9', '#6DBF7A']];
  blocks.forEach(([x, y, w, h, c, stripe], bi) => {
    E('rect', { x, y, width: w, height: h, fill: c, stroke: '#9C927C', 'stroke-width': 3 }, view);
    E('rect', { x, y, width: w, height: 16, fill: stripe }, view);
    let wins = '', litD = '';
    const r = rng(90 + bi);
    for (let yy = y + 32; yy < y + h - 20; yy += 30) for (let xx = x + 14; xx < x + w - 20; xx += 28) {
      wins += `M${xx},${yy} h16 v14 h-16 Z `;
      if (r() < 0.45) litD += `M${xx},${yy} h16 v14 h-16 Z `;
    }
    E('path', { d: wins, fill: '#7FA6BF' }, view);
    lit.push(E('path', { d: litD, fill: '#FFD86B' }, view));
  });
  const comp = phCompressor(view, 0.9); tr(comp, 640, 410);
  // window frame (a sliding window) and the sill
  E('rect', { x: WX, y: WY, width: WW, height: WH, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 16 }, g);
  E('rect', { x: WX, y: WY, width: WW, height: WH, fill: 'none', stroke: ink, 'stroke-width': 3, opacity: 0.6 }, g);
  E('line', { x1: WX + WW / 2, y1: WY, x2: WX + WW / 2, y2: WY + WH, stroke: '#FFFFFF', 'stroke-width': 12 }, g);
  E('rect', { x: WX - 30, y: WY + WH, width: WW + 60, height: 24, rx: 4, fill: '#FAF7F2', stroke: ink, 'stroke-width': 3 }, g);
  const night = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0B1433' }, g);   // room dims at night (behind the props)
  // desk, lamp, books, bubble tea
  E('rect', { x: 800, y: 500, width: 400, height: 26, fill: '#B07A45', stroke: ink, 'stroke-width': 4 }, g);
  E('rect', { x: 830, y: 526, width: 30, height: 224, fill: '#93622F', stroke: ink, 'stroke-width': 3 }, g);
  E('rect', { x: 1060, y: 526, width: 140, height: 160, fill: '#A06D38', stroke: ink, 'stroke-width': 3 }, g);
  E('line', { x1: 1080, y1: 600, x2: 1180, y2: 600, stroke: ink, 'stroke-width': 3 }, g);
  [['#E8424F', 0], ['#3F5BD9', 1], ['#56D69B', 2]].forEach(([c, i]) => E('rect', { x: 1060, y: 470 - i * 22, width: 110 - i * 8, height: 22, rx: 3, fill: c, stroke: ink, 'stroke-width': 3 }, g));
  const lamp = phLamp(g, 0.9); tr(lamp, 960, 500);
  const tea = phBubbleTea(g, 0.42); tr(tea, 880, 500);
  E('rect', { x: 0, y: 690, width: 1200, height: 60, fill: '#C9A27A' }, g);   // floor
  const plant = phPlant(g, 0.85); tr(plant, 330, WY + WH);
  g.plant = plant; g.plantAt = [330, WY + WH]; g.lampAt = [960, 500]; g.compAt = [640, 410];
  g.set = st => {
    st = st || {};
    const n = clamp(st.night || 0), t = st.t || 0;
    op(skyNight, n); op(sunG, 1 - n); op(moon, n); lit.forEach(l => op(l, n)); op(night, 0.35 * n);
    lamp.set(st.lamp || 0);
    comp.upd(t, st.hot || 0);
  };
  g.set({});
  return g;
}

function phFactory(parent) {
  const g = G(parent), ink = SC_INK;
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E3A22', '#1C5C38', true) }, g);
  E('rect', { x: 18, y: 18, width: 1164, height: 714, rx: 170, fill: 'none', stroke: '#7FE08F', 'stroke-width': 12, opacity: 0.45 }, g);   // outer membrane
  E('rect', { x: 40, y: 40, width: 1120, height: 670, rx: 150, fill: 'none', stroke: '#7FE08F', 'stroke-width': 6, opacity: 0.3 }, g);    // inner membrane
  // skylight + beams
  E('ellipse', { cx: 600, cy: 40, rx: 260, ry: 34, fill: '#FFF7C2', opacity: 0.35 }, g);
  const beams = E('path', { d: 'M420,40 L250,640 L470,640 L560,40 Z M640,40 L700,640 L930,640 L780,40 Z', fill: '#FFF3A0' }, g);
  // stroma lamellae: tubes joining the stacks
  E('path', { d: 'M170,520 C280,470 300,470 400,520 M400,520 C540,450 660,450 800,520 M800,520 C900,470 930,470 1030,520', fill: 'none', stroke: '#2C8C4C', 'stroke-width': 14, opacity: 0.8 }, g);
  const lamps = [];
  [170, 400, 800, 1030].forEach((x, i) => {   // grana stacks as machines
    const st = G(g); tr(st, x, 600);
    for (let k = 0; k < 6; k++) {
      E('ellipse', { cx: 0, cy: -k * 34, rx: 78, ry: 20, fill: ball('#4CC46A', '#1B6E37'), stroke: ink, 'stroke-width': 3 }, st);
    }
    E('rect', { x: -6, y: -230, width: 12, height: 30, fill: '#5A6B7A' }, st);
    lamps.push(E('circle', { cx: 0, cy: -238, r: 14, fill: '#FFE45C', stroke: ink, 'stroke-width': 3 }, st));
  });
  // conveyor belt
  E('rect', { x: 60, y: 640, width: 1080, height: 30, rx: 15, fill: '#3A4652', stroke: ink, 'stroke-width': 4 }, g);
  const dash = E('path', { d: '', stroke: '#9AA6B2', 'stroke-width': 4 }, g);
  for (let x = 90; x < 1130; x += 70) E('circle', { cx: x, cy: 686, r: 10, fill: '#5A6B7A', stroke: ink, 'stroke-width': 2 }, g);
  let hz = '';
  for (let x = 40; x < 1170; x += 40) hz += `M${x},700 l20,0 l-14,22 l-20,0 Z `;
  E('rect', { x: 40, y: 700, width: 1120, height: 22, fill: '#FFC93C' }, g);
  E('path', { d: hz, fill: '#2A2A2A' }, g);
  // the board
  const bd = G(g); tr(bd, 960, 190);
  E('rect', { x: -150, y: -78, width: 300, height: 156, rx: 10, fill: '#FBFDFF', stroke: ink, 'stroke-width': 4 }, bd);
  E('rect', { x: -150, y: -78, width: 300, height: 30, rx: 10, fill: '#2C8C4C' }, bd);
  T(bd, 0, -56, 'SAFETY BOARD', { size: 20, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(bd, 0, -8, 'DAYS WITHOUT A', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  T(bd, -18, 28, 'NAME MIX-UP:', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  T(bd, 104, 46, '0', { size: 64, weight: 800, anchor: 'middle', fill: '#E8424F' });
  g.beltY = 650;
  g.set = st => {
    st = st || {};
    const L = st.light === undefined ? 1 : clamp(st.light), t = st.t || 0;
    op(beams, 0.18 * L * (0.85 + 0.15 * Math.sin(t * 1.7)));
    lamps.forEach((l, i) => attr(l, 'fill', L > 0.5 && Math.sin(t * 5 + i * 1.7) > -0.3 ? '#FFE45C' : '#6B7A50'));
    const off = (t * (st.belt || 0)) % 60; let d = '';
    for (let x = 70 + off; x < 1130; x += 60) d += `M${x.toFixed(0)},655 l24,0 `;
    attr(dash, 'd', d);
  };
  g.set({});
  return g;
}

function phLeafSection(parent) {
  const g = G(parent), ink = SC_INK;
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7FCBF5', '#CDEFFF', true) }, g);
  const sunG = G(g); tr(sunG, 1080, 40);
  E('circle', { r: 110, fill: glow('#FFE45C') }, sunG); E('circle', { r: 46, fill: '#FFE45C' }, sunG);
  const rays = E('path', { d: 'M700,0 L640,108 L700,108 L760,0 Z M880,0 L820,108 L880,108 L940,0 Z M330,0 L270,108 L330,108 L390,0 Z', fill: '#FFF7C2', opacity: 0.5 }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#DCE9F2' }, g);   // the air under the leaf
  E('rect', { x: 0, y: 128, width: 1200, height: 430, fill: '#F1FAF2' }, g);    // inside the leaf: air spaces between cells
  // cuticle and upper epidermis
  E('rect', { x: 0, y: 110, width: 1200, height: 18, fill: '#F2FCFF', stroke: '#A9DDF2', 'stroke-width': 3 }, g);
  let ep = '';
  for (let x = 0; x < 1200; x += 80) ep += `M${x + 3},131 h74 a6,6 0 0 1 6,6 v26 a6,6 0 0 1 -6,6 h-74 a6,6 0 0 1 -6,-6 v-26 a6,6 0 0 1 6,-6 Z `;
  E('path', { d: ep, fill: '#E2F7E6', stroke: '#5BB070', 'stroke-width': 3 }, g);
  // palisade: tall columns packed with chloroplasts
  let pal = '', palC = '';
  for (let x = 6; x < 1200; x += 54) {
    pal += `M${x + 24},176 a22,22 0 0 1 22,22 v126 a22,22 0 0 1 -22,22 a22,22 0 0 1 -22,-22 v-126 a22,22 0 0 1 22,-22 Z `;
    for (let k = 0; k < 6; k++) { const cx = x + (k % 2 ? 34 : 14), cy = 196 + k * 24; palC += `M${cx - 8},${cy} a8,6 0 1,0 16,0 a8,6 0 1,0 -16,0 `; }
  }
  E('path', { d: pal, fill: '#C4F0CB', stroke: '#3E9E58', 'stroke-width': 3 }, g);
  E('path', { d: palC, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 1.5 }, g);
  // spongy layer: loose round cells with air spaces (kept clear above the stoma and around the vein)
  let sp = '', spC = '';
  const r = rng(33);
  for (let row = 0; row < 3; row++) for (let x = 30 + (row % 2) * 50; x < 1200; x += 104) {
    const cx = x + r() * 16, cy = 380 + row * 52 + r() * 10, rr = 26 + r() * 6;
    if (Math.abs(cx - 600) < 70 && cy > 420) continue;
    if (Math.hypot(cx - 880, cy - 432) < 120) continue;
    sp += `M${(cx - rr).toFixed(1)},${cy.toFixed(1)} a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0 a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0 `;
    spC += `M${(cx - 14).toFixed(1)},${(cy - 8).toFixed(1)} a6,4 0 1,0 12,0 a6,4 0 1,0 -12,0 M${(cx + 4).toFixed(1)},${(cy + 10).toFixed(1)} a6,4 0 1,0 12,0 a6,4 0 1,0 -12,0 `;
  }
  E('path', { d: sp, fill: '#D3F3D8', stroke: '#4FA866', 'stroke-width': 3 }, g);
  E('path', { d: spC, fill: C.chloro, stroke: C.chloroDk, 'stroke-width': 1.2 }, g);
  // the vein: xylem (top, thick walls) and phloem (bottom)
  const vein = G(g); tr(vein, 880, 432);
  E('ellipse', { rx: 96, ry: 70, fill: '#EAF5D9', stroke: '#6B8E4E', 'stroke-width': 4 }, vein);
  [[-46, -24], [-14, -32], [18, -30], [50, -20]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 15, fill: '#BFE6FA', stroke: '#8C6B3A', 'stroke-width': 6 }, vein));
  [[-40, 26], [-14, 34], [12, 34], [38, 26], [-26, 48], [0, 52], [26, 48]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 10, fill: '#FFE6B0', stroke: '#B88A3A', 'stroke-width': 2.5 }, vein));
  // lower epidermis with one stoma
  let le = '';
  for (let x = -20; x < 1200; x += 80) { if (x > 500 && x < 660) continue; le += `M${x + 3},522 h74 a6,6 0 0 1 6,6 v20 a6,6 0 0 1 -6,6 h-74 a6,6 0 0 1 -6,-6 v-20 a6,6 0 0 1 6,-6 Z `; }
  E('path', { d: le, fill: '#E2F7E6', stroke: '#5BB070', 'stroke-width': 3 }, g);
  E('path', { d: 'M500,522 L556,522 L556,554 L500,554 Z M644,522 L700,522 L700,554 L644,554 Z', fill: '#E2F7E6', stroke: '#5BB070', 'stroke-width': 3 }, g);
  E('path', { d: 'M556,516 C540,520 540,560 560,562 C584,564 590,548 590,538 C590,526 578,514 556,516 Z', fill: '#86E596', stroke: '#2C8C4C', 'stroke-width': 3 }, g);   // guard cells
  E('path', { d: 'M644,516 C660,520 660,560 640,562 C616,564 610,548 610,538 C610,526 622,514 644,516 Z', fill: '#86E596', stroke: '#2C8C4C', 'stroke-width': 3 }, g);
  // highlight outlines
  const HI = { cuticle: [0, 106, 1200, 26], upper: [0, 128, 1200, 44], palisade: [0, 172, 1200, 178], spongy: [0, 350, 1200, 168], vein: [780, 358, 200, 148],
    xylem: [818, 386, 124, 48], phloem: [826, 440, 108, 64], lower: [0, 518, 1200, 40], stoma: [530, 506, 140, 64] };
  const his = {};
  Object.keys(HI).forEach(k => { const [x, y, w, h] = HI[k]; his[k] = E('rect', { x, y, width: w, height: h, rx: 14, fill: '#FFE45C', 'fill-opacity': 0.12, stroke: '#FFE45C', 'stroke-width': 6 }, g); op(his[k], 0); });
  g.at = { cuticle: [600, 119], upper: [600, 150], palisade: [600, 262], spongy: [400, 432], vein: [880, 432], xylem: [880, 404], phloem: [880, 470], lower: [600, 538], stoma: [600, 540] };
  g.hi = (name, p) => op(his[name], clamp(p));
  g.set = st => { st = st || {}; const sn = st.sun === undefined ? 1 : st.sun; op(sunG, sn); op(rays, 0.5 * sn * (0.8 + 0.2 * Math.sin((st.t || 0) * 1.5))); };
  g.set({});
  return g;
}

function phLogo(parent) {
  const g = G(parent);
  const sunG = G(g); tr(sunG, -330, -26);
  E('circle', { r: 40, fill: '#FFE45C', stroke: '#5A4A07', 'stroke-width': 5 }, sunG);
  let d = '';
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; d += `M${(Math.cos(a) * 52).toFixed(1)},${(Math.sin(a) * 52).toFixed(1)} L${(Math.cos(a) * 66).toFixed(1)},${(Math.sin(a) * 66).toFixed(1)} `; }
  E('path', { d, stroke: '#FFE45C', 'stroke-width': 7, 'stroke-linecap': 'round' }, sunG);
  const t = T(g, 30, 0, 'LIGHT WORK', { size: 96, weight: 800, anchor: 'middle', fill: '#B8F27A' });
  t.setAttribute('stroke', '#163D12'); t.setAttribute('stroke-width', 12); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
  const lf = G(g); leaf(lf, 0.42); tr(lf, 300, -40, 1, -40);
  g.sun = sunG;
  return g;
}
function phTitle(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C2E1B', '#2C5E1E', true) }, g);
  let rays = '';
  for (let i = 0; i < 18; i++) { const a0 = i / 18 * TAU, a1 = a0 + TAU / 44; rays += `M0,0 L${(Math.cos(a0) * 1200).toFixed(0)},${(Math.sin(a0) * 1200).toFixed(0)} L${(Math.cos(a1) * 1200).toFixed(0)},${(Math.sin(a1) * 1200).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.08 }, g);
  E('circle', { cx: 600, cy: 220, r: 260, fill: glow('#FFE45C'), opacity: 0.45 }, g);
  [[30, 770, -60, 0.8], [1170, 770, -120, 0.8], [0, 680, -20, 0.6], [1200, 680, -160, 0.6]].forEach(([x, y, a, sc]) => { const w = G(g); leaf(w, sc); tr(w, x, y, 1, a); });
  g.set = t => tr(rayP, 600, 220, 1, ((t || 0) * 6) % 360);
  g.set(0);
  return g;
}

/* DRAWER 8B (Claude Sitcom Ep 12, Magnetism & Electricity): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (scWho, scTalk, scMake, scKavya, scKavyaBody,
   scConfessional, scLowerThird, scVideoCall, scClipboard, scTrack, scBlood). Every name here starts
   with "dr" except cast().

   Characters: cast(parent, kind, o) -> g, origin at the character's centre, about 200-260 px tall at s = 1.
     o: { s (scale), mood }.  Every frame: g.set({ t, talk, mood, look, sweat, still, ...extras })
       talk 0..1 (use scTalk(S, t, who)); mood neutral | happy | smug | annoyed | sad | shock | deadpan;
       look -1..1 pupils left/right; still: true stops the idle bob; sweat 0..1 (cecil, dimitri, kavya).
     kinds and their extras:
       'cecil'   Cecil, a 1.5 V cell standing upright (navy body, gold band, + nub on top, "1.5 V"),
                 staff pass with the cell symbol clipped on. Default mood deadpan.  ~250 px tall.
       'eddie'   Eddie, an electron: bright blue ball, big eager eyes, backwards cap with a "−" logo.
                 Use drElectron() for crowds of Eddies (cheap). ~200 px.
       'dimitri' Dimitri, a light bulb (glass globe, filament quiff, screw base, red bow tie).
                 extra: glow 0..1 (default 1 = fully lit; 0.5 = dim; 0 = off, grey glass). ~250 px.
       'amy'     Amy, an ammeter: round meter, RED rim, dial with a needle, "A" tab, two terminal feet,
                 a pen on her rim. extra: needle 0..1 (dial reading, default 0.35). ~210 px.
       'vic'     Vic, a voltmeter: same body, BLUE rim, "V" tab, three-hair tuft, heavy lids (default
                 deadpan). extras: needle 0..1, sign: string ('' hides) = the little whiteboard sign he
                 holds up on his right (viewer's right), e.g. '1.5 V'. ~210 px (sign adds 130 px right).
       'rez'     Auntie Rez, a resistor: beige capsule with colour bands (brown, black | red, gold),
                 grey hair bun, half-moon reading glasses on a chain, wire-lead legs. ~300 x 220 px.
       'magnet'  Nora (left half, RED, N, pink bow) and Stan (right half, BLUE, S, flat cap, moustache):
                 one bar magnet, two faces, 320 x 140 px. talk/mood/look drive Nora;
                 talkB/moodB/lookB drive Stan (like the pilot's twins).
       'sol'     Sol, a solenoid: copper coil round an iron nail (nail head on top, point below), face on
                 a pale patch, wire-lead arms. extras: on 0..1 (default 0): off = drooping, tilted, dull
                 copper, arms hanging; on = upright, flexing arms, cyan field glow, field loops, N/S
                 labels; pole 1 (default: N at the top, S at the bottom) or -1 (swapped). ~300 px.
       'kavya'   Kavya (scKavya, head and shoulders, PE shirt "8").

   Talking heads: drConf(parent, kind) -> scConfessional tinted for that speaker (g.set(p, t)).
     Put the speaker big (s about 1.4) at about (430, 400). Lower thirds: scLowerThird(parent, NAME, ROLE)
     with DR_LOWER[kind] = [NAME, ROLE].

   Sets (full stage 1200 x 750, origin top left):
     drCabinet(parent)  the prep room: a wall of grey lab drawers; drawer 8B is at g.d8b = [x, y]
                        (its centre, 630, 380), w 300, h 130; g.open(p) slides it open (0..1) and shows
                        the dark inside with two pairs of blinking eyes; call g.upd(t) for the blinks.
     drDrawer(parent)   inside drawer 8B: wooden walls, grey foam floor with cut-outs, the drawer label
                        card on the back wall, spare wires and clips lying about, light from above.
                        The cast stands on the foam (feet about y 600).
     drLab(parent)      Lab Three: pale wall, periodic-table poster, window with HDB blocks, black bench
                        across the front (bench top y 560). Put Kavya (scKavya s 1.3) behind the bench.
     drBench(parent)    close-up of the bench top: dark slate with a faint grid; build circuits on it with
                        kit symbols (cellSym, bulbSym, switchSym, resistorSym, meterSym, wire).
     drFlat(parent)     Kavya's HDB flat at evening: window with blocks, aircon unit (top right),
                        three ceiling lights g.lights[i].set(0..1), a side lamp g.lamp.set(0..1), sofa.
                        g.upd(t) moves the aircon flap.

   Props (drawn around their own origin):
     drBadge(parent, sym, name)  staff pass on a lanyard, about 150 x 210: the circuit symbol big, the
                        name below. sym: 'cell' | 'battery' | 'lamp' | 'ammeter' | 'voltmeter' | 'resistor' |
                        'variable' | 'switch' | 'motor' | 'buzzer' | 'fuse' | 'diode' | 'led'.
     drSym(parent, sym, o)  just the symbol in ink (o.color, o.w line width), about 120 px wide.
     drSign(parent, text)  Vic's handheld whiteboard sign (about 150 x 96); g.set(text).
     drElectron(parent, r)  a tiny Eddie for crowds: blue ball, two eyes, "−" (6 elements). Default r 16.
     drCompass(parent, r)   a plotting compass (needle red = north end); g.set(angleDeg): 0 = north
                        end pointing right (+x), 90 = pointing down (SVG angles, clockwise).
     drField(parent, w, o)  field lines of a bar magnet of width w centred on the origin, N on the LEFT
                        (as in cast 'magnet'), arrows from N to S; o.n loops per side (default 4),
                        o.color. g.set(p) draws them in (0..1). Lines are closest at the poles.
     drFilings(parent, w, o)  iron filings around a bar magnet of width w (N left): short dashes along
                        the field direction; g.set(p) sprinkles them in (0..1).
     drDomains(parent, cols, rows, size)  grid of little domain arrows; g.set(order 0..1, angleDeg):
                        0 = jumbled (cancel out), 1 = all pointing at angleDeg (180 = left, towards N).
     drComb(parent)     a plastic comb, about 200 x 60.
     drArrowCurrent(parent, len, o)  a fat current arrow pointing +x with a label (o.label, o.color).
*/

/* ---------- colours ---------- */
const DR_NAVY = '#24407A', DR_GOLD = '#E8B53A', DR_COPPER = '#D9822B', DR_COPPER_DK = '#7A3E12';
const DR_RED = '#E0474C', DR_BLUE = '#3F7BE0';
const DR_TINT = {
  cecil: ['#101A33', '#23365E'], eddie: ['#0C2636', '#155A78'], dimitri: ['#2E2508', '#5E4A10'],
  amy: ['#331414', '#5E2222'], vic: ['#101E36', '#1D3A66'], rez: ['#2E2214', '#5A4024'],
  magnet: ['#2A1430', '#4A2550'], sol: ['#2E1A0C', '#5A3416'], kavya: ['#14243A', '#25446B'],
};
const DR_LOWER = {
  cecil: ['CECIL', 'Cell, 1.5 V. Not a battery.'],
  eddie: ['EDDIE', 'Electron. One of many Eddies.'],
  dimitri: ['DIMITRI', 'Lamp. The star (he says).'],
  amy: ['AMY', 'Ammeter. Always in the line.'],
  vic: ['VIC', 'Voltmeter. Stands across. Silent.'],
  rez: ['AUNTIE REZ', 'Resistor. Slows everyone down.'],
  magnet: ['NORA & STAN', 'Bar magnet. North and south. 40 years.'],
  sol: ['SOL', 'Solenoid. Electromagnet (when on).'],
  kavya: ['KAVYA, 12', 'Practical test in one week.'],
};
function drConf(parent, kind) { const c = DR_TINT[kind] || DR_TINT.cecil; return scConfessional(parent, c[0], c[1]); }

/* ---------- circuit symbols in ink (for badges and signs) ---------- */
function drSym(parent, sym, o) {
  o = o || {};
  const g = G(parent), col = o.color || SC_INK, w = o.w || 6;
  const ln = (d, extra) => E('path', Object.assign({ d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, extra || {}), g);
  const leads = (a) => ln(`M-60,0 L${-a},0 M${a},0 L60,0`);
  if (sym === 'cell' || sym === 'battery') {
    const n = sym === 'battery' ? 2 : 1, gap = 26, wt = (n - 1) * gap + 14;
    leads(wt / 2);
    for (let i = 0; i < n; i++) {
      const x = -wt / 2 + i * gap;
      ln(`M${x},-30 L${x},30`);
      ln(`M${x + 14},-14 L${x + 14},14`, { 'stroke-width': w * 2 });
      if (i < n - 1) ln(`M${x + 14},0 L${x + gap},0`, { 'stroke-dasharray': '3 5', 'stroke-width': w * 0.6 });
    }
    T(g, -wt / 2 - 14, -26, '+', { size: 28, weight: 800, anchor: 'middle', fill: DR_RED });
    T(g, wt / 2 + 14, -26, '−', { size: 28, weight: 800, anchor: 'middle', fill: DR_BLUE });
  } else if (sym === 'lamp') {
    leads(24); E('circle', { r: 24, fill: 'none', stroke: col, 'stroke-width': w }, g); ln('M-17,-17 L17,17 M17,-17 L-17,17');
  } else if (sym === 'ammeter' || sym === 'voltmeter' || sym === 'motor') {
    leads(24); E('circle', { r: 24, fill: 'none', stroke: col, 'stroke-width': w }, g);
    T(g, 0, 10, sym === 'ammeter' ? 'A' : sym === 'voltmeter' ? 'V' : 'M', { size: 30, weight: 800, anchor: 'middle', fill: col });
  } else if (sym === 'resistor' || sym === 'variable' || sym === 'fuse') {
    leads(30); E('rect', { x: -30, y: -13, width: 60, height: 26, rx: 2, fill: 'none', stroke: col, 'stroke-width': w }, g);
    if (sym === 'variable') { ln('M-32,26 L30,-24'); ln('M30,-24 L14,-22 M30,-24 L26,-8'); }
    if (sym === 'fuse') ln('M-30,0 L30,0', { 'stroke-width': w * 0.7 });
  } else if (sym === 'switch') {
    ln('M-60,0 L-22,0 M22,0 L60,0'); E('circle', { cx: -22, r: 5, fill: col }, g); E('circle', { cx: 22, r: 5, fill: col }, g); ln('M-22,0 L20,-22');
  } else if (sym === 'buzzer') {
    ln('M-60,0 L-16,0 L-16,12 M16,12 L16,0 L60,0'); E('path', { d: 'M-26,12 A26,26 0 0 1 26,12 Z', fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linejoin': 'round' }, g);
  } else if (sym === 'diode' || sym === 'led') {
    leads(16); E('path', { d: 'M-16,-18 L16,0 L-16,18 Z', fill: col, stroke: col, 'stroke-width': w * 0.6, 'stroke-linejoin': 'round' }, g); ln('M16,-18 L16,18');
    if (sym === 'led') { ln('M4,-24 L18,-40 M22,-20 L36,-36'); ln('M10,-40 L18,-40 L18,-32 M28,-36 L36,-36 L36,-28'); }
  }
  return g;
}

function drBadge(parent, sym, name) {
  const g = G(parent);
  E('path', { d: 'M-34,-170 L-14,-104 M34,-170 L14,-104', stroke: '#3F7BE0', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);   // lanyard
  E('rect', { x: -20, y: -112, width: 40, height: 18, rx: 4, fill: '#B9C4CF', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('rect', { x: -75, y: -100, width: 150, height: 200, rx: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -75, y: -100, width: 150, height: 34, rx: 14, fill: '#2E7DD8' }, g);
  E('rect', { x: -75, y: -80, width: 150, height: 14, fill: '#2E7DD8' }, g);
  T(g, 0, -76, 'DRAWER 8B · STAFF', { size: 15, weight: 800, anchor: 'middle', fill: '#FFFFFF', font: FB });
  const s = drSym(g, sym, { w: 5 }); tr(s, 0, -4, 0.95);
  T(g, 0, 78, name || '', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  return g;
}

function drSign(parent, text) {
  const g = G(parent);
  E('rect', { x: -6, y: 40, width: 12, height: 70, rx: 4, fill: '#A87B4F', stroke: SC_INK, 'stroke-width': 3 }, g);   // handle
  E('rect', { x: -78, y: -50, width: 156, height: 96, rx: 10, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -70, y: -42, width: 140, height: 80, rx: 6, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 2 }, g);
  const tx = T(g, 0, 14, text || '', { size: 40, weight: 800, anchor: 'middle', fill: '#1D4FB0' });
  let cur = text || '';
  g.set = s => { s = s || ''; if (s !== cur) { cur = s; setText(tx, s); } };
  return g;
}

function drElectron(parent, r) {
  r = r || 16;
  const g = G(parent);
  E('circle', { r, fill: ball('#5EC8FF', '#1F6FB8'), stroke: '#1F5F9E', 'stroke-width': Math.max(1.5, r * 0.1) }, g);
  E('circle', { cx: -r * 0.32, cy: -r * 0.12, r: r * 0.24, fill: '#FFFFFF' }, g);
  E('circle', { cx: r * 0.32, cy: -r * 0.12, r: r * 0.24, fill: '#FFFFFF' }, g);
  E('path', { d: `M${-r * 0.4},${-r * 0.12} a${r * 0.1},${r * 0.1} 0 1 0 0.1,0 M${r * 0.24},${-r * 0.12} a${r * 0.1},${r * 0.1} 0 1 0 0.1,0`, stroke: SC_INK, 'stroke-width': r * 0.2, 'stroke-linecap': 'round', fill: 'none' }, g);
  E('path', { d: `M${-r * 0.28},${r * 0.45} L${r * 0.28},${r * 0.45}`, stroke: '#FFFFFF', 'stroke-width': Math.max(2, r * 0.16), 'stroke-linecap': 'round' }, g);
  return g;
}

function drCompass(parent, r) {
  r = r || 40;
  const g = G(parent);
  E('circle', { r: r + 6, fill: '#C9A24A', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('circle', { r, fill: '#FBF7EC', stroke: '#8A6D35', 'stroke-width': 2 }, g);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; E('line', { x1: Math.cos(a) * r * 0.78, y1: Math.sin(a) * r * 0.78, x2: Math.cos(a) * r * 0.92, y2: Math.sin(a) * r * 0.92, stroke: '#8A6D35', 'stroke-width': 2 }, g); }
  const nd = G(g);
  E('path', { d: `M0,${-r * 0.16} L${r * 0.8},0 L0,${r * 0.16} Z`, fill: DR_RED, stroke: SC_INK, 'stroke-width': 1.5 }, nd);
  E('path', { d: `M0,${-r * 0.16} L${-r * 0.8},0 L0,${r * 0.16} Z`, fill: '#E6EBF0', stroke: SC_INK, 'stroke-width': 1.5 }, nd);
  E('circle', { r: r * 0.09, fill: SC_INK }, g);
  g.set = a => tr(nd, 0, 0, 1, a || 0.001);
  g.set(0);
  return g;
}

/* field of a bar magnet (N at -x): two poles of strength +1 at (-p,0) and -1 at (+p,0) */
function drB(x, y, p) {
  const ax = x + p, bx = x - p, ra = Math.pow(ax * ax + y * y, 1.5) || 1e-6, rb = Math.pow(bx * bx + y * y, 1.5) || 1e-6;
  return [ax / ra - bx / rb, y / ra - y / rb];
}
function drField(parent, w, o) {
  o = o || {};
  const g = G(parent), n = o.n || 4, col = o.color || '#9FD8FF', half = w / 2, items = [];
  // loops above and below, from the N end (left) to the S end (right), starting near the pole face
  for (let side = -1; side <= 1; side += 2) {
    for (let k = 0; k < n; k++) {
      const y0 = side * (12 + k * 13), spread = 60 + k * 70, h = side * (40 + k * 62);
      const d = `M${-half},${y0} C${-half - spread},${y0 + h * 1.15} ${half + spread},${y0 + h * 1.15} ${half},${y0}`;
      const p = E('path', { d, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.9 }, g);
      const L = 2 * half + 2 * spread + Math.abs(h) * 1.6;
      // arrowhead at the top/bottom of the loop, pointing +x (from N towards S)
      const ay = y0 + h * 1.15 * 0.75, ah = E('path', { d: 'M-12,-9 L6,0 L-12,9 Z', fill: col }, g); tr(ah, 0, ay);
      items.push({ p, L, ah });
    }
  }
  // straight-ish lines out of the N end and into the S end
  [[-1, 0], [1, 0]].forEach(([sd]) => {
    const p = E('path', { d: `M${sd * half},0 L${sd * (half + 150)},0`, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const ah = E('path', { d: 'M-12,-9 L6,0 L-12,9 Z', fill: col }, g);
    tr(ah, sd * (half + 90), 0, 1, sd < 0 ? 180 : 180);     // left of N: away from N (points left); right of S: into S (points left)
    items.push({ p, L: 150, ah });
  });
  g.set = v => items.forEach(({ p, L, ah }, i) => {
    const q = clamp(v * 1.4 - i * 0.04);
    p.setAttribute('stroke-dasharray', q >= 0.999 ? 'none' : `${(L * 1.3 * q).toFixed(1)} ${(L * 2).toFixed(1)}`);
    op(ah, clamp((q - 0.7) / 0.3));
  });
  g.set(1);
  return g;
}
function drFilings(parent, w, o) {
  o = o || {};
  const g = G(parent), half = w / 2, r = rng(o.seed || 41), segs = [];
  const n = o.n || 260, W2 = o.width || 520, H2 = o.height || 300;
  for (let i = 0; i < n; i++) {
    const x = (r() * 2 - 1) * W2, y = (r() * 2 - 1) * H2;
    if (Math.abs(x) < half + 8 && Math.abs(y) < 50) continue;   // not on the magnet itself
    const [bx, by] = drB(x, y, half * 0.82), m = Math.hypot(bx, by) || 1, l = 9;
    segs.push({ d: `M${(x - bx / m * l).toFixed(1)},${(y - by / m * l).toFixed(1)} L${(x + bx / m * l).toFixed(1)},${(y + by / m * l).toFixed(1)}`, k: r() });
  }
  const groups = [0, 1, 2, 3].map(() => E('path', { d: '', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, g));
  const ds = ['', '', '', ''];
  segs.forEach(s => { ds[Math.min(3, Math.floor(s.k * 4))] += s.d + ' '; });
  groups.forEach((p, i) => attr(p, 'd', ds[i]));
  g.set = v => groups.forEach((p, i) => op(p, clamp(v * 4 - i)));
  g.set(1);
  return g;
}
function drDomains(parent, cols, rows, size) {
  size = size || 40;
  const g = G(parent), r = rng(cols * 7 + rows), arr = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const a = G(g), x = (i - (cols - 1) / 2) * size, y = (j - (rows - 1) / 2) * size;
    E('rect', { x: -size / 2 + 2, y: -size / 2 + 2, width: size - 4, height: size - 4, rx: 4, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 1.5, opacity: 0.18 }, a);
    const ar = G(a);
    E('path', { d: `M${-size * 0.3},0 L${size * 0.22},0`, stroke: DR_GOLD, 'stroke-width': 4, 'stroke-linecap': 'round' }, ar);
    E('path', { d: `M${size * 0.32},0 L${size * 0.1},${-size * 0.13} L${size * 0.1},${size * 0.13} Z`, fill: DR_GOLD }, ar);
    arr.push({ a, ar, x, y, rand: r() * 360 });
  }
  g.set = (p, ang) => arr.forEach(({ a, ar, x, y, rand }, i) => {
    tr(a, x, y);
    const target = ang === undefined ? 0 : ang;
    let d = target - rand; d = ((d % 360) + 540) % 360 - 180;
    const q = clamp(p * 1.3 - (i % 5) * 0.06);
    tr(ar, 0, 0, 1, rand + d * q);
  });
  g.set(0, 0);
  return g;
}
function drComb(parent) {
  const g = G(parent);
  E('rect', { x: -100, y: -30, width: 200, height: 26, rx: 8, fill: '#7E57C2', stroke: SC_INK, 'stroke-width': 3 }, g);
  let d = '';
  for (let x = -92; x <= 92; x += 9) d += `M${x},-4 L${x},28 `;
  E('path', { d, stroke: '#7E57C2', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  E('path', { d, stroke: SC_INK, 'stroke-width': 1, opacity: 0.3 }, g);
  return g;
}
function drArrowCurrent(parent, len, o) {
  o = o || {};
  const g = G(parent), col = o.color || DR_GOLD;
  E('path', { d: `M0,-9 L${len - 30},-9 L${len - 30},-22 L${len},0 L${len - 30},22 L${len - 30},9 L0,9 Z`, fill: col, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  if (o.label) T(g, len / 2, -34, o.label, { size: o.size || 28, weight: 800, anchor: 'middle', fill: col });
  return g;
}

/* ---------- the cast ---------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const S = (extra) => Object.assign({ s: o.s }, extra);

  if (kind === 'cecil') return scMake(parent, S({
    mood: o.mood || 'deadpan', seed: 3, bob: 2,
    draw: g => {
      E('ellipse', { cx: 0, cy: 124, rx: 70, ry: 10, fill: '#000000', opacity: 0.25 }, g);
      E('rect', { x: -22, y: -140, width: 44, height: 24, rx: 6, fill: ball('#E6EBF0', '#8E9BA8'), stroke: SC_INK, 'stroke-width': 4 }, g);   // + nub
      E('rect', { x: -64, y: -122, width: 128, height: 240, rx: 18, fill: DR_NAVY, stroke: SC_INK, 'stroke-width': 5 }, g);
      E('path', { d: 'M-64,-60 L-64,-104 Q-64,-122 -46,-122 L46,-122 Q64,-122 64,-104 L64,-60 Z', fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
      T(g, 0, -78, '1.5 V', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
      T(g, 0, -146, '+', { size: 24, weight: 800, anchor: 'middle', fill: SC_INK });
      E('rect', { x: -54, y: -54, width: 108, height: 98, rx: 16, fill: '#E8EEF8' }, g);                 // face label
      E('rect', { x: -52, y: 104, width: 104, height: 16, rx: 4, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, g);   // − end
      E('rect', { x: -60, y: -40, width: 6, height: 140, fill: '#FFFFFF', opacity: 0.12 }, g);          // shine
      const b = G(g); tr(b, 30, 78);                                                                      // staff pass
      E('rect', { x: -24, y: -20, width: 48, height: 40, rx: 5, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2.5 }, b);
      tr(drSym(b, 'cell', { w: 4 }), 0, 4, 0.32);
      T(g, -30, 92, '−', { size: 30, weight: 800, anchor: 'middle', fill: '#C9D3DC' });
    },
    face: { x: 0, y: -14, eye: 17, gap: 50, mouthW: 40, mouthY: 32, lidCol: '#C3CEDD' },
    sweat: [[-80, -60], [82, -40]],
  }));

  if (kind === 'eddie') return scMake(parent, S({
    mood: o.mood || 'happy', seed: 5, bob: 7,
    draw: g => {
      E('circle', { r: 132, fill: glow('#5EC8FF'), opacity: 0.35 }, g);
      E('circle', { r: 84, fill: ball('#5EC8FF', '#1F6FB8'), stroke: '#174E86', 'stroke-width': 6 }, g);
      // backwards cap with a "−" logo
      E('path', { d: 'M-70,-46 Q-66,-96 0,-98 Q66,-96 70,-46 Q0,-66 -70,-46 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M40,-88 Q80,-104 100,-84 Q86,-74 58,-76 Z', fill: '#E89A12', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // peak, at the back
      E('circle', { cx: 0, cy: -76, r: 15, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('path', { d: 'M-8,-76 L8,-76', stroke: '#1F6FB8', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      E('ellipse', { cx: -54, cy: 30, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.55 }, g);
      E('ellipse', { cx: 54, cy: 30, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.55 }, g);
    },
    face: { x: 0, y: -4, eye: 20, gap: 56, mouthW: 42, mouthY: 32, lidCol: '#5EC8FF' },
  }));

  if (kind === 'dimitri') {
    let halo, lit, fil;
    return scMake(parent, S({
      mood: o.mood || 'smug', seed: 7, bob: 4,
      draw: g => {
        halo = E('circle', { cx: 0, cy: -34, r: 190, fill: glow(C.energy, '#FFFBE0') }, g);
        E('path', { d: 'M-46,40 Q-40,60 -36,70 L36,70 Q40,60 46,40 Z', fill: '#DDE6EE', stroke: '#8FA3B5', 'stroke-width': 4 }, g);
        E('circle', { cx: 0, cy: -34, r: 88, fill: '#DCE5EC', stroke: '#7E93A6', 'stroke-width': 5 }, g);
        lit = E('circle', { cx: 0, cy: -34, r: 85, fill: ball('#FFF3A8', '#FFC93C') }, g);
        E('path', { d: 'M-52,-92 Q-60,-60 -48,-30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.7 }, g);   // glass shine
        E('path', { d: 'M-16,-80 L-16,-104 M16,-80 L16,-104', stroke: '#8FA3B5', 'stroke-width': 3 }, g);           // filament supports
        fil = E('path', { d: 'M-16,-104 L-10,-114 L-4,-104 L2,-114 L8,-104 L14,-114 L16,-104', fill: 'none', stroke: '#FF9E2C', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        // screw base
        E('rect', { x: -38, y: 68, width: 76, height: 56, rx: 8, fill: ball('#C9D3DC', '#7A8794'), stroke: SC_INK, 'stroke-width': 4 }, g);
        E('path', { d: 'M-38,84 L38,78 M-38,100 L38,94 M-38,116 L38,110', stroke: '#6B7783', 'stroke-width': 4 }, g);
        E('path', { d: 'M-18,124 L18,124 L10,138 L-10,138 Z', fill: '#3A4048', stroke: SC_INK, 'stroke-width': 3 }, g);
        // bow tie
        const bw = G(g); tr(bw, 0, 56);
        E('path', { d: 'M0,0 L-30,-15 L-30,15 Z M0,0 L30,-15 L30,15 Z', fill: '#D62F4A', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bw);
        E('circle', { r: 7, fill: '#A81E36', stroke: SC_INK, 'stroke-width': 3 }, bw);
      },
      face: { x: 0, y: -30, eye: 19, gap: 58, mouthW: 46, mouthY: 34, lidCol: '#E4E2D2' },
      sweat: [[-96, -70], [98, -50]],
      upd: (t, g, st) => {
        const v = st.glow === undefined ? 1 : clamp(st.glow);
        op(halo, v * (0.85 + 0.15 * Math.sin(t * 7))); op(lit, 0.15 + 0.85 * v);
        attr(fil, 'stroke', v > 0.05 ? '#FF9E2C' : '#6B7783');
      },
    }));
  }

  if (kind === 'amy' || kind === 'vic') {
    const amy = kind === 'amy', rim = amy ? DR_RED : DR_BLUE, rimDk = amy ? '#9E2A30' : '#1F4FA8';
    let needle, sign;
    return scMake(parent, S({
      mood: o.mood || (amy ? 'neutral' : 'deadpan'), seed: amy ? 11 : 13, bob: amy ? 4 : 1.5,
      draw: g => {
        E('ellipse', { cx: 0, cy: 118, rx: 70, ry: 9, fill: '#000000', opacity: 0.25 }, g);
        E('circle', { cx: -34, cy: 100, r: 13, fill: '#E0474C', stroke: SC_INK, 'stroke-width': 3 }, g);          // terminal feet
        E('circle', { cx: 34, cy: 100, r: 13, fill: '#2A2F36', stroke: SC_INK, 'stroke-width': 3 }, g);
        E('ellipse', { rx: 92, ry: 98, fill: rim, stroke: SC_INK, 'stroke-width': 5 }, g);
        E('ellipse', { rx: 78, ry: 84, fill: '#FBFBF5', stroke: rimDk, 'stroke-width': 3 }, g);
        let tk = '';
        for (let i = 0; i <= 8; i++) { const a = (-145 + i * 13.75) * Math.PI / 180, r1 = 58, r2 = i % 2 ? 50 : 46; tk += `M${(Math.cos(a) * r1).toFixed(1)},${(-26 + Math.sin(a) * r1).toFixed(1)} L${(Math.cos(a) * r2).toFixed(1)},${(-26 + Math.sin(a) * r2).toFixed(1)} `; }
        E('path', { d: 'M' + (Math.cos(-145 * Math.PI / 180) * 58).toFixed(1) + ',' + (-26 + Math.sin(-145 * Math.PI / 180) * 58).toFixed(1) + ' A58,58 0 0 1 ' + (Math.cos(-35 * Math.PI / 180) * 58).toFixed(1) + ',' + (-26 + Math.sin(-35 * Math.PI / 180) * 58).toFixed(1), fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, g);
        E('path', { d: tk, stroke: SC_INK, 'stroke-width': 2.5 }, g);
        needle = E('path', { d: 'M-3,0 L0,-54 L3,0 Z', fill: DR_RED, stroke: DR_RED, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
        E('circle', { cx: 0, cy: -26, r: 5, fill: SC_INK }, g);
        const tab = G(g); tr(tab, 0, 70);
        E('rect', { x: -24, y: -18, width: 48, height: 34, rx: 8, fill: rim, stroke: SC_INK, 'stroke-width': 3 }, tab);
        T(tab, 0, 10, amy ? 'A' : 'V', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
        if (amy) {   // a pen clipped to her rim
          const pen = G(g); tr(pen, 78, -66, 1, 30);
          E('rect', { x: -6, y: -34, width: 12, height: 60, rx: 4, fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 3 }, pen);
          E('path', { d: 'M-6,26 L0,38 L6,26 Z', fill: '#F2D1A0', stroke: SC_INK, 'stroke-width': 2 }, pen);
          E('ellipse', { cx: -50, cy: 30, rx: 12, ry: 7, fill: '#FF8FB0', opacity: 0.55 }, g);
          E('ellipse', { cx: 50, cy: 30, rx: 12, ry: 7, fill: '#FF8FB0', opacity: 0.55 }, g);
        } else {     // three hairs
          E('path', { d: 'M-10,-96 Q-16,-118 -6,-128 M0,-97 Q2,-122 12,-130 M10,-96 Q20,-114 30,-116', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
          sign = drSign(g, ''); tr(sign, 160, -10);
        }
      },
      face: { x: 0, y: 6, eye: 17, gap: 52, mouthW: 38, mouthY: 26, lidCol: amy ? '#F4D5D5' : '#D5E0F4' },
      upd: (t, g, st) => {
        const v = st.needle === undefined ? 0.35 : clamp(st.needle);
        needle.setAttribute('transform', `translate(0 -26) rotate(${(-55 + 110 * v + Math.sin(t * 9) * 1.2).toFixed(1)})`);
        if (sign) { sign.set(st.sign || ''); op(sign, st.sign ? 1 : 0); }
      },
    }));
  }

  if (kind === 'rez') return scMake(parent, S({
    mood: o.mood || 'annoyed', seed: 17, bob: 2,
    draw: g => {
      E('ellipse', { cx: 0, cy: 132, rx: 150, ry: 10, fill: '#000000', opacity: 0.25 }, g);
      [-1, 1].forEach(sd => E('path', { d: `M${sd * 118},14 L${sd * 140},14 Q${sd * 152},14 ${sd * 152},28 L${sd * 152},118 L${sd * 168},126`, fill: 'none', stroke: '#A9B5C0', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
      E('rect', { x: -120, y: -68, width: 240, height: 136, rx: 66, fill: ball('#F0DDB4', '#C9A76E'), stroke: '#6B4E22', 'stroke-width': 5 }, g);
      [[-94, '#7A4A22'], [-72, '#26211F'], [72, '#D23B3B'], [94, '#D4AF37']].forEach(([x, col]) => {
        const hh = Math.sqrt(Math.max(0, 66 * 66 - Math.pow(Math.max(0, Math.abs(x) + 7 - 54), 2))) - 3;
        E('rect', { x: x - 7, y: -hh, width: 14, height: 2 * hh, fill: col }, g);
      });
      // grey hair, bun and pin
      E('path', { d: 'M-56,-60 Q0,-92 56,-60 Q30,-70 0,-68 Q-30,-70 -56,-60 Z', fill: '#9AA0A8', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('circle', { cx: 0, cy: -90, r: 26, fill: '#9AA0A8', stroke: SC_INK, 'stroke-width': 4 }, g);
      E('path', { d: 'M-14,-96 Q0,-90 14,-100', fill: 'none', stroke: '#6B7178', 'stroke-width': 3 }, g);
      E('path', { d: 'M20,-106 L-8,-86', stroke: '#E8B53A', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      E('ellipse', { cx: -52, cy: 32, rx: 12, ry: 7, fill: '#E88A8A', opacity: 0.5 }, g);
      E('ellipse', { cx: 52, cy: 32, rx: 12, ry: 7, fill: '#E88A8A', opacity: 0.5 }, g);
    },
    face: { x: 0, y: -4, eye: 18, gap: 58, mouthW: 42, mouthY: 34, lidCol: '#E2C994' },
    upd: (() => {
      let gl = null;
      return (t, g) => {
        if (gl) return;   // half-moon reading glasses on a chain, drawn once, on top of the face
        gl = G(g);
        [-1, 1].forEach(sd => E('path', { d: `M${sd * 29 - 24},2 A24,22 0 0 0 ${sd * 29 + 24},2 Z`, fill: '#FFFFFF', 'fill-opacity': 0.18, stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, gl));
        E('path', { d: 'M-5,4 Q0,0 5,4', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, gl);
        E('path', { d: 'M-53,4 Q-66,40 -60,62 M53,4 Q66,40 60,62', fill: 'none', stroke: '#D4AF37', 'stroke-width': 2.5, 'stroke-dasharray': '3 4' }, gl);
      };
    })(),
  }));

  if (kind === 'magnet') return scMake(parent, S({
    mood: o.mood || 'happy', seed: 19, bob: 3,
    draw: g => {
      E('ellipse', { cx: 0, cy: 84, rx: 160, ry: 10, fill: '#000000', opacity: 0.25 }, g);
      E('rect', { x: -160, y: -68, width: 166, height: 136, rx: 18, fill: ball('#F06A6F', '#A4232E'), stroke: SC_INK, 'stroke-width': 5 }, g);
      E('rect', { x: -6, y: -68, width: 166, height: 136, rx: 18, fill: ball('#6FA0F0', '#1E4FA8'), stroke: SC_INK, 'stroke-width': 5 }, g);
      E('rect', { x: -8, y: -66, width: 14, height: 132, fill: '#A4232E' }, g);
      E('rect', { x: 0, y: -66, width: 8, height: 132, fill: '#2A5CB8' }, g);
      E('line', { x1: 0, y1: -66, x2: 0, y2: 66, stroke: SC_INK, 'stroke-width': 3 }, g);
      T(g, -136, 54, 'N', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
      T(g, 136, 54, 'S', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
      // Nora: pink bow, rosy cheeks
      const bw = G(g); tr(bw, -116, -70, 1, -14);
      E('path', { d: 'M0,0 L-26,-16 L-26,16 Z M0,0 L26,-16 L26,16 Z', fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bw);
      E('circle', { r: 7, fill: '#FF3E9A', stroke: SC_INK, 'stroke-width': 3 }, bw);
      E('ellipse', { cx: -124, cy: 18, rx: 11, ry: 7, fill: '#FFB3C8', opacity: 0.7 }, g);
      E('ellipse', { cx: -36, cy: 18, rx: 11, ry: 7, fill: '#FFB3C8', opacity: 0.7 }, g);
      // Stan: flat cap
      E('path', { d: 'M34,-64 Q40,-98 96,-100 Q140,-98 148,-70 Q170,-66 178,-58 Q150,-56 120,-62 Q80,-70 34,-64 Z', fill: '#5B6470', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M52,-80 Q96,-92 136,-78', fill: 'none', stroke: '#7A8491', 'stroke-width': 3 }, g);
    },
    face: { x: -80, y: -6, eye: 16, gap: 48, mouthW: 38, mouthY: 30, lidCol: '#F4A0A4' },
    faceB: { x: 80, y: -6, eye: 16, gap: 48, mouthW: 38, mouthY: 38, lidCol: '#A6C2F4' },
    upd: (() => {
      let mo = null;
      return (t, g) => {
        if (mo) return;   // Stan's moustache, on top of his face
        mo = E('path', { d: 'M56,22 Q68,11 80,17 Q92,11 104,22 Q92,27 80,23 Q68,27 56,22 Z', fill: '#E6EBF0', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      };
    })(),
  }));

  if (kind === 'sol') {
    let fieldG, haloE, armL, armR, nLab, sLab, coilFront, bodyG;
    const bobAmt = 3;
    return scMake(parent, S({
      mood: o.mood || 'sad', seed: 23, bob: 0,
      draw: g => {
        bodyG = g;
        haloE = E('ellipse', { cx: 0, cy: 10, rx: 220, ry: 240, fill: glow('#7FD4FF') }, g);
        fieldG = G(g);
        [1, 2].forEach(k => [-1, 1].forEach(sd => E('path', { d: `M0,-150 C${sd * (130 + k * 70)},${-170 - k * 30} ${sd * (130 + k * 70)},${190 + k * 30} 0,170`, fill: 'none', stroke: '#9FE3FF', 'stroke-width': 4, 'stroke-dasharray': '10 9', opacity: 0.8 }, fieldG)));
        E('ellipse', { cx: 0, cy: 158, rx: 80, ry: 10, fill: '#000000', opacity: 0.25 }, g);
        // iron nail
        E('rect', { x: -22, y: -116, width: 44, height: 236, fill: ball('#B9C4CF', '#6E7A86'), stroke: SC_INK, 'stroke-width': 4 }, g);
        E('path', { d: 'M-22,118 L0,156 L22,118 Z', fill: '#8E9BA8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('ellipse', { cx: 0, cy: -118, rx: 58, ry: 15, fill: ball('#D3DBE3', '#7A8692'), stroke: SC_INK, 'stroke-width': 4 }, g);
        // coil: dark back, copper turns in front
        E('rect', { x: -76, y: -92, width: 152, height: 196, rx: 22, fill: DR_COPPER_DK, stroke: SC_INK, 'stroke-width': 4 }, g);
        let d = '';
        for (let y = -82; y <= 96; y += 15) d += `M-72,${y} Q0,${y + 14} 72,${y} `;
        coilFront = E('path', { d, fill: 'none', stroke: DR_COPPER, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
        E('ellipse', { cx: 0, cy: -8, rx: 62, ry: 54, fill: '#F6DEC4', stroke: DR_COPPER_DK, 'stroke-width': 4 }, g);   // face patch
        armL = E('path', { d: '', fill: 'none', stroke: DR_COPPER, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
        armR = E('path', { d: '', fill: 'none', stroke: DR_COPPER, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
        nLab = T(g, 0, -150, 'N', { size: 40, weight: 800, anchor: 'middle', fill: DR_RED });
        sLab = T(g, 0, 196, 'S', { size: 40, weight: 800, anchor: 'middle', fill: '#6FA8FF' });
      },
      face: { x: 0, y: -14, eye: 17, gap: 50, mouthW: 40, mouthY: 30, lidCol: '#E9C7A2' },
      upd: (t, g, st) => {
        const on = clamp(st.on || 0), b = Math.sin(t * TAU * 0.5 + 23) * bobAmt * (st.still ? 0 : 1);
        tr(g, 0, b + 8 * (1 - on), 1 + 0.05 * on, -7 * (1 - on));
        op(haloE, on * (0.45 + 0.1 * Math.sin(t * 5)));
        op(fieldG, on); op(nLab, on); op(sLab, on);
        const flip = (st.pole || 1) < 0;
        tr(nLab, 0, flip ? 346 : 0); tr(sLab, 0, flip ? -346 : 0);
        attr(coilFront, 'stroke', on > 0.5 ? '#F29A3A' : DR_COPPER);
        // arms: hanging when off, flexing biceps when on
        const f = Math.sin(t * 4) * 6 * on;
        [[armL, -1], [armR, 1]].forEach(([a, sd]) => {
          const x0 = sd * 74, y0 = 20;
          const ex = lerp(sd * 108, sd * 128, on), ey = lerp(96, -44 - f, on), cx = lerp(sd * 100, sd * 150, on), cy = lerp(40, 30, on);
          attr(a, 'd', `M${x0},${y0} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`);
        });
      },
    }));
  }
  throw new Error('cast: unknown kind ' + kind);
}

/* ---------- sets ---------- */
function drCabinet(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#CFD8DE', '#AEBBC4', true) }, g);
  E('rect', { x: 0, y: 650, width: 1200, height: 100, fill: '#7A8894' }, g);
  E('rect', { x: 120, y: 120, width: 960, height: 540, rx: 10, fill: '#8C9AA6', stroke: '#56636E', 'stroke-width': 6 }, g);
  const labels = [['7A', 'ACIDS'], ['7B', 'CELLS'], ['7C', 'MIXTURES'], ['8A', 'LIGHT'], ['8B', 'ELECTRICITY &\nMAGNETISM'], ['8C', 'SOUND'], ['8D', 'HEAT'], ['8E', 'FORCES'], ['9A', 'MISC.']];
  const pos = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) pos.push([310 + i * 320, 220 + j * 160]);
  g.d8b = [790, 380];
  let d8b = null;
  pos.forEach(([x, y], k) => {
    const dg = G(g); tr(dg, x, y);
    E('rect', { x: -150, y: -65, width: 300, height: 130, rx: 8, fill: linGrad('#E4EAEE', '#C3CDD4', true), stroke: '#56636E', 'stroke-width': 4 }, dg);
    E('rect', { x: -40, y: 22, width: 80, height: 16, rx: 8, fill: '#56636E' }, dg);
    E('rect', { x: -110, y: -50, width: 220, height: 62, rx: 4, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, dg);
    const [code, name] = labels[k];
    T(dg, -96, -10, code, { size: 30, weight: 800, fill: code === '8B' ? DR_RED : SC_INK });
    T(dg, -40, name.includes('\n') ? -24 : -10, name, { size: name.includes('\n') ? 17 : 22, weight: 800, fill: '#3A4752', lh: 20, font: FB });
    if (code === '8B') { d8b = dg; g.d8b = [x, y]; }
  });
  // the "do not touch" sticker on 8B
  const st = G(d8b); tr(st, 104, 34, 1, 8);
  E('rect', { x: -58, y: -16, width: 116, height: 32, rx: 4, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, st);
  T(st, 0, 7, 'DO NOT TOUCH', { size: 15, weight: 800, anchor: 'middle', fill: SC_INK, font: FB });
  // the open drawer: dark inside with eyes
  const inside = G(g); tr(inside, g.d8b[0], g.d8b[1]);
  E('rect', { x: -150, y: -65, width: 300, height: 130, rx: 8, fill: '#14100C', stroke: '#56636E', 'stroke-width': 4 }, inside);
  const eyes = [[-84, -36], [-56, -36], [30, -24], [56, -24], [100, -44], [120, -44]].map(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 7, ry: 8, fill: '#FFF7C2' }, inside));
  g.insertBefore(inside, d8b);   // the cavity sits behind the drawer front
  g.inside = inside;
  g.open = p => { op(inside, clamp(p * 3)); tr(d8b, g.d8b[0], g.d8b[1] + 70 * clamp(p), 1 + 0.12 * clamp(p)); };
  g.upd = t => eyes.forEach((e, i) => { const bl = scBlink(t, i * 2 + 1); attr(e, 'ry', 8 * (1 - bl) + 0.6); });
  g.open(0); g.upd(0);
  return g;
}
function drDrawer(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6E4A2C', '#4A3020', true) }, g);
  // wood grain
  let gr = '';
  for (let i = 0; i < 9; i++) { const y = 40 + i * 52; gr += `M0,${y} C300,${y + 10} 600,${y - 12} 1200,${y + 6} `; }
  E('path', { d: gr, fill: 'none', stroke: '#3A2416', 'stroke-width': 3, opacity: 0.35 }, g);
  // side walls in perspective
  E('path', { d: 'M0,0 L120,90 L120,560 L0,750 Z', fill: '#3E2818' }, g);
  E('path', { d: 'M1200,0 L1080,90 L1080,560 L1200,750 Z', fill: '#3E2818' }, g);
  E('rect', { x: 120, y: 80, width: 960, height: 14, fill: '#2E1C10', opacity: 0.6 }, g);
  // light from the open top
  E('ellipse', { cx: 600, cy: 40, rx: 640, ry: 260, fill: glow('#FFE6B0'), opacity: 0.35 }, g);
  // label card on the back wall
  const lab = G(g); tr(lab, 860, 200, 1, -2);
  E('rect', { x: -170, y: -48, width: 340, height: 96, rx: 6, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, lab);
  T(lab, 0, -8, '8B · ELECTRICITY & MAGNETISM', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK, font: FB });
  T(lab, 0, 28, 'Do not touch. — Lab tech', { size: 20, weight: 600, anchor: 'middle', fill: '#5A6B7A', font: FB });
  E('circle', { cx: -150, cy: -34, r: 6, fill: '#C2453A' }, lab);
  // foam floor with cut-outs
  E('path', { d: 'M0,750 L120,560 L1080,560 L1200,750 Z', fill: '#2F3338' }, g);
  E('path', { d: 'M120,560 L1080,560', stroke: '#4A5058', 'stroke-width': 4 }, g);
  [[200, 640, 120, 40], [420, 690, 160, 36], [760, 650, 140, 40], [980, 700, 120, 30], [560, 600, 120, 26]].forEach(([x, y, w, h]) =>
    E('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 12, fill: '#1C1F23' }, g));
  // spare wires and a crocodile clip on the floor
  E('path', { d: 'M150,600 C260,560 300,660 420,620 S600,590 640,630', fill: 'none', stroke: '#E0474C', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M720,610 C820,640 900,580 1050,620', fill: 'none', stroke: '#2A2F36', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  const clip = G(g); tr(clip, 1050, 620, 1, -12);
  E('path', { d: 'M0,-8 L46,-12 L46,12 L0,8 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, clip);
  E('path', { d: 'M46,-12 L70,-4 M46,12 L70,4', stroke: '#9AA6B2', 'stroke-width': 4 }, clip);
  return g;
}
function drLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E6EEF2', '#CFDCE3', true) }, g);
  E('rect', { x: 0, y: 380, width: 1200, height: 180, fill: '#BFD3DD' }, g);    // tiles
  let tl = '';
  for (let x = 0; x <= 1200; x += 60) tl += `M${x},380 L${x},560 `;
  for (let y = 380; y <= 560; y += 45) tl += `M0,${y} L1200,${y} `;
  E('path', { d: tl, stroke: '#A6BCC8', 'stroke-width': 2 }, g);
  // window with HDB blocks
  const wn = G(g); tr(wn, 860, 90);
  E('rect', { x: 0, y: 0, width: 300, height: 250, rx: 6, fill: linGrad('#7CC8F5', '#CDEBFA', true), stroke: '#8A9AA6', 'stroke-width': 8 }, wn);
  [[20, 90, 70, 160, '#F2D7A0'], [110, 60, 80, 190, '#E8B8A8'], [210, 110, 70, 140, '#BFD9C2']].forEach(([x, y, w, h, c]) => {
    E('rect', { x, y, width: w, height: h, fill: c, stroke: '#8A7A6A', 'stroke-width': 2 }, wn);
    let d = ''; for (let yy = y + 14; yy < y + h - 6; yy += 18) d += `M${x + 8},${yy} L${x + w - 8},${yy} `;
    E('path', { d, stroke: '#7A6A5A', 'stroke-width': 3, opacity: 0.4 }, wn);
  });
  E('path', { d: 'M150,0 L150,250 M0,125 L300,125', stroke: '#8A9AA6', 'stroke-width': 6 }, wn);
  // periodic table poster
  const pt = G(g); tr(pt, 600, 130);
  E('rect', { x: 0, y: 0, width: 200, height: 130, fill: '#FFFFFF', stroke: '#8A9AA6', 'stroke-width': 3 }, pt);
  let cells = '';
  for (let j = 0; j < 6; j++) for (let i = 0; i < 12; i++) { if (j < 2 && i > 1 && i < 10) continue; cells += `M${10 + i * 15},${16 + j * 18} h12 v14 h-12 Z `; }
  E('path', { d: cells, fill: '#9FD8FF', stroke: '#5A8FB5', 'stroke-width': 1 }, pt);
  // lab sign (kept right of the chapter tag area)
  const sg = G(g); tr(sg, 690, 60);
  E('rect', { x: -70, y: -24, width: 140, height: 44, rx: 8, fill: '#2E7DD8' }, sg);
  T(sg, 0, 10, 'LAB 3', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // bench
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, g);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, g);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, g);
  E('path', { d: 'M1040,560 L1040,470 Q1040,446 1066,446 L1090,446', fill: 'none', stroke: '#8E9BA8', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);   // tap
  return g;
}
function drBench(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1E2B33', '#24343E', true) }, g);
  let d = '';
  for (let x = 0; x <= 1200; x += 50) d += `M${x},0 L${x},750 `;
  for (let y = 0; y <= 750; y += 50) d += `M0,${y} L1200,${y} `;
  E('path', { d, stroke: '#FFFFFF', 'stroke-width': 1, opacity: 0.05 }, g);
  E('ellipse', { cx: 600, cy: 380, rx: 560, ry: 340, fill: glow('#3A5566'), opacity: 0.5 }, g);
  return g;
}
function drFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F3E3C8', '#E6D2B0', true) }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#D9C2A0' }, g);
  let fl = ''; for (let x = 0; x <= 1200; x += 80) fl += `M${x},600 L${x},750 `; fl += 'M0,670 L1200,670';
  E('path', { d: fl, stroke: '#C2A982', 'stroke-width': 2 }, g);
  // window at night, HDB blocks with lit windows
  const wn = G(g); tr(wn, 140, 150);
  E('rect', { x: 0, y: 0, width: 360, height: 260, rx: 6, fill: linGrad('#1C2A4A', '#3A4C78', true), stroke: '#FFFFFF', 'stroke-width': 10 }, wn);
  [[30, 70, 90, 190], [140, 40, 90, 220], [250, 90, 80, 170]].forEach(([x, y, w, h]) => {
    E('rect', { x, y, width: w, height: h, fill: '#2A3550' }, wn);
    let d = ''; const r = rng(x);
    for (let yy = y + 12; yy < y + h - 8; yy += 20) for (let xx = x + 8; xx < x + w - 8; xx += 18) if (r() > 0.45) d += `M${xx},${yy} h10 v8 h-10 Z `;
    E('path', { d, fill: '#FFE6A0' }, wn);
  });
  E('path', { d: 'M180,0 L180,260', stroke: '#FFFFFF', 'stroke-width': 6 }, wn);
  // aircon unit (top right)
  const ac = G(g); tr(ac, 930, 150);
  E('rect', { x: -150, y: -40, width: 300, height: 90, rx: 18, fill: '#FAFBFC', stroke: '#9AA6B2', 'stroke-width': 4 }, ac);
  const flap = E('rect', { x: -130, y: 32, width: 260, height: 10, rx: 5, fill: '#C9D3DC' }, ac);
  E('circle', { cx: 120, cy: -18, r: 5, fill: '#56D69B' }, ac);
  const breeze = E('path', { d: 'M-100,70 q20,14 0,28 M-20,70 q20,14 0,28 M60,70 q20,14 0,28', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, ac);
  // ceiling lights
  g.lights = [380, 600, 820].map(x => {
    const L = G(g); tr(L, x, 30);
    E('line', { x1: 0, y1: -30, x2: 0, y2: 0, stroke: '#5A6B7A', 'stroke-width': 3 }, L);
    const h = E('ellipse', { cx: 0, cy: 50, rx: 120, ry: 90, fill: glow('#FFF3B0') }, L);
    E('path', { d: 'M-30,0 L30,0 L18,22 L-18,22 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, L);
    const b = E('circle', { cx: 0, cy: 26, r: 10, fill: '#FFF3B0' }, L);
    L.set = v => { op(h, clamp(v)); attr(b, 'fill', v > 0.1 ? '#FFF3B0' : '#7A8794'); };
    L.set(1);
    return L;
  });
  // side table with the brother's lamp
  const lp = G(g); tr(lp, 1060, 600);
  E('rect', { x: -60, y: -70, width: 120, height: 70, fill: '#8A5A3A', stroke: SC_INK, 'stroke-width': 3 }, lp);
  E('rect', { x: -6, y: -170, width: 12, height: 100, fill: '#5A6B7A' }, lp);
  const lh = E('circle', { cx: 0, cy: -170, r: 90, fill: glow('#FFE45C') }, lp);
  E('path', { d: 'M-46,-150 L-30,-210 L30,-210 L46,-150 Z', fill: '#F7E7B8', stroke: SC_INK, 'stroke-width': 3 }, lp);
  g.lamp = lp; lp.set = v => op(lh, clamp(v)); lp.set(1);
  // sofa
  E('path', { d: 'M560,600 L560,470 Q560,440 590,440 L900,440 Q930,440 930,470 L930,600 Z', fill: '#4E7FB0', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 540, y: 520, width: 410, height: 80, rx: 20, fill: '#5E92C6', stroke: SC_INK, 'stroke-width': 4 }, g);
  g.upd = t => { tr(flap, 0, 0, 1, 4 * Math.sin(t * 1.2)); op(breeze, 0.4 + 0.3 * Math.sin(t * 2)); tr(breeze, 0, 4 * Math.sin(t * 2)); };
  g.upd(0);
  return g;
}

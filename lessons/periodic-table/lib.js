/* ==========================================================================
   periodic-table/lib.js: art shared by the Periodic Table scenes. Bundled after
   engine/lib.js and kit.js, so it uses their C, E, G, T, tr, op, attr, ball,
   glow, clamp, lerp, ease ...

     ptElement(z)          data for element z (1 to 118)
     ptGrid(parent, o)     the 18-column table, top-left corner at (0,0)
     ptTile(parent, z, o)  one close-up element tile, centred on (0,0)
     shellAtom(parent, o)  a Bohr diagram, centred on (0,0)

   Same rules as lib.js: build once, then every frame call g.set(state) with a
   state worked out from the chapter time t. set() writes only what the state
   asks for (it skips attribute writes whose value has not changed, which never
   changes what is drawn), so scrubbing and seeking always work.
   ========================================================================== */

/* ---------- element data ---------- */
const PT_SYM = ('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr '
  + 'Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu '
  + 'Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr '
  + 'Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og').split(' ');
const PT_NAME = ('hydrogen helium lithium beryllium boron carbon nitrogen oxygen fluorine neon sodium magnesium '
  + 'aluminium silicon phosphorus sulfur chlorine argon potassium calcium scandium titanium vanadium chromium '
  + 'manganese iron cobalt nickel copper zinc gallium germanium arsenic selenium bromine krypton rubidium '
  + 'strontium yttrium zirconium niobium molybdenum technetium ruthenium rhodium palladium silver cadmium indium '
  + 'tin antimony tellurium iodine xenon caesium barium lanthanum cerium praseodymium neodymium promethium '
  + 'samarium europium gadolinium terbium dysprosium holmium erbium thulium ytterbium lutetium hafnium tantalum '
  + 'tungsten rhenium osmium iridium platinum gold mercury thallium lead bismuth polonium astatine radon '
  + 'francium radium actinium thorium protactinium uranium neptunium plutonium americium curium berkelium '
  + 'californium einsteinium fermium mendelevium nobelium lawrencium rutherfordium dubnium seaborgium bohrium '
  + 'hassium meitnerium darmstadtium roentgenium copernicium nihonium flerovium moscovium livermorium '
  + 'tennessine oganesson').split(' ');
/* rounded relative atomic masses as printed on UK exam tables; [n] = mass number of the most stable isotope */
const PT_MASS = ('1 4 7 9 11 12 14 16 19 20 23 24 27 28 31 32 35.5 40 39 40 45 48 51 52 55 56 59 59 63.5 65 70 73 75 79 '
  + '80 84 85 88 89 91 93 96 [98] 101 103 106 108 112 115 119 122 128 127 131 133 137 139 140 141 144 [145] 150 '
  + '152 157 159 163 165 167 169 173 175 178 181 184 186 190 192 195 197 201 204 207 209 [209] [210] [222] [223] '
  + '[226] [227] 232 231 238 [237] [244] [243] [247] [247] [251] [252] [257] [258] [259] [262] [267] [268] [269] '
  + '[270] [269] [278] [281] [282] [285] [286] [289] [290] [293] [294] [294]').split(' ');

/* family colours (storyboard): kinds for the metal / non-metal split, highlights for the families */
const PT_KIND_COL = { metal: '#7FB2E5', nonmetal: C.chloro, metalloid: '#F2C14E' };
const PT_FAMILY_COL = { alkali: C.heat, alkaline: C.glucose, halogen: '#B5E655', noble: C.ethanol };
const PT_UK_GROUP = { 1: '1', 2: '2', 13: '3', 14: '4', 15: '5', 16: '6', 17: '7', 18: '0' };
const PT_GROUP_COL = { 1: 1, 2: 2, 3: 13, 4: 14, 5: 15, 6: 16, 7: 17, 0: 18 };
const PT_GROUP_FAMILY = { 1: 'alkali', 2: 'alkaline', 7: 'halogen', 0: 'noble' };

/* [period, column]; column 0 = lanthanides and actinides, which are not in the main block */
function _ptPos(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [1, 18];
  if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8];
  if (z <= 18) return [3, z <= 12 ? z - 10 : z];
  if (z <= 36) return [4, z - 18];
  if (z <= 54) return [5, z - 36];
  if (z <= 57) return [6, z - 54];
  if (z <= 71) return [6, 0];
  if (z <= 86) return [6, z - 68];
  if (z <= 89) return [7, z - 86];
  if (z <= 103) return [7, 0];
  return [7, z - 100];
}
function _ptFamily(z, col) {
  if ([2, 10, 18, 36, 54, 86, 118].indexOf(z) >= 0) return 'noble';
  if ([9, 17, 35, 53, 85, 117].indexOf(z) >= 0) return 'halogen';
  if (z === 1) return 'nonmetal';
  if (col === 1) return 'alkali';
  if (col === 2) return 'alkaline';
  if ([5, 14, 32, 33, 51, 52].indexOf(z) >= 0) return 'metalloid';
  if ([6, 7, 8, 15, 16, 34].indexOf(z) >= 0) return 'nonmetal';
  if (col === 0 || (col >= 3 && col <= 12)) return 'transition';
  return 'metal';
}
/* { z, sym, name, mass (text, e.g. '35.5' or '[98]'), massNo (whole number, for neutrons), period,
     col (1-18; 0 if not in the main block), group ('1'..'7', '0', or null for transition metals),
     family ('alkali','alkaline','transition','metal','metalloid','nonmetal','halogen','noble'),
     kind ('metal','nonmetal','metalloid') } */
function ptElement(z) {
  const [period, col] = _ptPos(z);
  const family = _ptFamily(z, col);
  const mass = PT_MASS[z - 1];
  const m = parseFloat(mass.replace(/[[\]]/g, ''));
  return {
    z, sym: PT_SYM[z - 1], name: PT_NAME[z - 1], mass, massNo: Number.isInteger(m) ? m : Math.floor(m),
    period, col, group: PT_UK_GROUP[col] || null, family,
    kind: family === 'metalloid' ? 'metalloid' : (family === 'nonmetal' || family === 'halogen' || family === 'noble') ? 'nonmetal' : 'metal',
  };
}

/* ---------- small helpers ---------- */
const _ptRGB = {};
function _ptRgb(hex) {
  if (!_ptRGB[hex]) { const h = hex.replace('#', ''); _ptRGB[hex] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
  return _ptRGB[hex];
}
/* mix two '#rrggbb' colours, p = 0 gives a, 1 gives b */
function _ptMix(a, b, p) {
  p = clamp(p); if (p <= 0) return a; if (p >= 1) return b;
  const x = _ptRgb(a), y = _ptRgb(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
function _ptLum(hex) { const [r, g, b] = _ptRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
/* set an attribute (or 'opacity' via op, or 'transform') only when its value changes */
function _ptW(el, k, v) {
  const memo = el._pt || (el._pt = {});
  if (memo[k] === v) return;
  memo[k] = v;
  if (k === 'opacity') op(el, v); else el.setAttribute(k, v);
}

/* ---------- the table ----------
   const grid = ptGrid(root, o); tr(grid, 64, 190);      (1080 x 416 at the default 60 px pitch)
   o: pitch (60), tile (pitch - 4), symSize (26), numbers (false: small atomic numbers in each tile,
      13 px, so only for a grid shown at 2x or larger), labels (true: UK group numbers 1, 2, 3-7, 0 above
      the main-group columns and period numbers 1-7 down the left).
   grid.set({
     reveal: 118,   tiles with atomic number <= reveal are shown; tile z drops in as reveal goes z-1 -> z
     kind: 0,       0..1 blends every tile from plain to its metal / non-metal / metalloid colour
     hi: [ { group: 1, p, color } ],   highlights; each entry picks tiles with ONE of
                    group: UK group 1-7 or 0 (Group 1 leaves out hydrogen unless withH: true),
                    col: column 1-18, period: 1-7, z: number or [numbers], family: 'alkali' | 'alkaline'
                    | 'transition' | 'metal' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble', kind: 'metal' |
                    'nonmetal' | 'metalloid'.  p 0..1, color (default: the family colour for family:, and for group: 1, 2, 7 and 0; else C.energy),
                    lift (default true: the tile grows a little).
     dim: 0,        0..1 fades every tile that no highlight picks
     stair: 0,      0..1 draws the metal / non-metal staircase line
     labels: 1,     opacity of the group and period numbers
     numbers: 1,    opacity of the in-tile atomic numbers (if built with numbers: true)
   })
   grid.tile(z) -> { z, el, g, box, sym, cx, cy }    grid.xy(z) -> [cx, cy] (centre of tile z, grid coords)
   grid.colX(col), grid.rowY(period) -> centre lines; grid.w, grid.h, grid.pitch, grid.stairPath */
function ptGrid(parent, o) {
  o = o || {};
  const pitch = o.pitch || 60, ts = o.tile || pitch - 4, half = ts / 2, gap = pitch - ts;
  const g = G(parent), tilesG = G(g), tiles = [], list = [];
  for (let z = 1; z <= 118; z++) {
    const el = ptElement(z);
    if (!el.col) continue;
    const cx = (el.col - 1) * pitch + half, cy = (el.period - 1) * pitch + half;
    const tg = G(tilesG);
    const box = E('rect', { x: -half, y: -half, width: ts, height: ts, rx: ts * 0.13, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, tg);
    const sym = T(tg, 0, (o.symSize || 26) * 0.36, el.sym, { size: o.symSize || 26, weight: 700, anchor: 'middle', fill: C.ink });
    const num = o.numbers ? T(tg, -half + 5, -half + 14, String(z), { size: 13, weight: 600, anchor: 'start', fill: C.muted }) : null;
    tr(tg, cx, cy);
    const t = { z, el, g: tg, box, sym, num, cx, cy };
    tiles[z] = t; list.push(t);
  }
  /* staircase: left of boron, stepping down-right to between polonium and astatine */
  const sx = c => c * pitch - gap / 2, sy = r => r * pitch - gap / 2;
  let d = `M${sx(12)},${sy(1)} V${sy(2)}`;
  for (let k = 13; k <= 16; k++) d += ` H${sx(k)} V${sy(k - 10)}`;
  const stair = E('path', { d, fill: 'none', stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, g);
  op(stair, 0);
  const labG = G(g);
  if (o.labels !== false) {
    Object.keys(PT_UK_GROUP).forEach(c => T(labG, (c - 1) * pitch + half, -14, PT_UK_GROUP[c], { size: 26, weight: 700, anchor: 'middle', fill: C.muted }));
    for (let r = 1; r <= 7; r++) T(labG, -24, (r - 1) * pitch + half + 9, String(r), { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  }
  const groupCol = n => PT_GROUP_COL[n] !== undefined ? PT_GROUP_COL[n] : -1;
  function picks(h, t) {
    const el = t.el;
    if (h.group !== undefined) return el.col === groupCol(+h.group) && !(el.z === 1 && !h.withH);
    if (h.col !== undefined) return el.col === h.col;
    if (h.period !== undefined) return el.period === h.period;
    if (h.z !== undefined) return Array.isArray(h.z) ? h.z.indexOf(el.z) >= 0 : el.z === h.z;
    if (h.family !== undefined) return el.family === h.family;
    if (h.kind !== undefined) return el.kind === h.kind;
    return false;
  }
  g.set = s => {
    s = s || {};
    const reveal = s.reveal === undefined ? 999 : s.reveal, kind = clamp(s.kind || 0), dim = clamp(s.dim || 0);
    const his = (s.hi || []).filter(h => h && h.p > 0.001);
    for (const t of list) {
      const vis = clamp(reveal - (t.z - 1));
      _ptW(t.g, 'opacity', vis);
      if (vis <= 0) continue;
      let hp = 0, hc = null, lift = true;
      for (const h of his) if (h.p > hp && picks(h, t)) { hp = clamp(h.p); hc = h.color || PT_FAMILY_COL[h.family] || (h.group !== undefined && PT_FAMILY_COL[PT_GROUP_FAMILY[+h.group]]) || C.energy; lift = h.lift !== false; }
      const kc = PT_KIND_COL[t.el.kind];
      let fill = kind > 0 ? _ptMix(C.card2, kc, kind) : C.card2;
      if (hp > 0) fill = _ptMix(fill, hc, hp * 0.9);
      const stroke = hp > 0 ? _ptMix(C.line, '#FFFFFF', hp * 0.8) : (kind > 0 ? _ptMix(C.line, kc, kind * 0.5) : C.line);
      _ptW(t.box, 'fill', fill);
      _ptW(t.box, 'stroke', stroke);
      _ptW(t.box, 'stroke-width', hp > 0.5 ? 3 : 2);
      _ptW(t.sym, 'fill', _ptLum(fill) > 0.5 ? C.bg0 : C.ink);
      if (t.num) { _ptW(t.num, 'fill', _ptLum(fill) > 0.5 ? '#29495A' : C.muted); _ptW(t.num, 'opacity', s.numbers === undefined ? 1 : clamp(s.numbers)); }
      const sc = 1 + (lift ? 0.1 * hp : 0);
      const drop = (1 - easeOut(vis)) * -14;
      _ptW(t.g, 'transform', `translate(${t.cx} ${(t.cy + drop).toFixed(1)})${sc !== 1 ? ` scale(${sc.toFixed(3)})` : ''}`);
      if (dim > 0) _ptW(t.g, 'opacity', vis * (1 - 0.72 * dim * (1 - hp)));
      if (lift && hp > 0 && !t.top) { tilesG.appendChild(t.g); t.top = true; }   // lifted tiles draw over their neighbours (DOM order only)
    }
    const st = clamp(s.stair || 0);
    _ptW(stair, 'opacity', st > 0 ? 1 : 0);
    _ptW(stair, 'stroke-dashoffset', (1 - st).toFixed(4));
    _ptW(labG, 'opacity', s.labels === undefined ? 1 : clamp(s.labels));
  };
  g.tile = z => tiles[z];
  g.xy = z => [tiles[z].cx, tiles[z].cy];
  g.colX = col => (col - 1) * pitch + half;
  g.rowY = period => (period - 1) * pitch + half;
  g.w = 18 * pitch - gap; g.h = 7 * pitch - gap; g.pitch = pitch; g.stairPath = stair;
  g.set({});
  return g;
}

/* ---------- one close-up tile ----------
   const t = ptTile(root, 11, { size: 240 }); tr(t, 600, 380);
   Layout as on UK exam tables: mass number at the top, symbol, name, atomic number at the bottom.
   o: size (240), color (default: its metal / non-metal / metalloid colour), ink (text colour).
   t.set({ mass, sym, name, num }) sets each part's opacity (default 1); t.set({ hlMass, hlNum }) lights a
   yellow band behind the mass number / atomic number (0..1).
   t.at.mass / .sym / .name / .num -> [x, y] centre of each part (for kit labelLine); t.parts; t.size */
function ptTile(parent, z, o) {
  o = o || {};
  const el = ptElement(z), s = o.size || 240, h = s / 2, ink = o.ink || C.bg0;
  const g = G(parent);
  E('rect', { x: -h, y: -h, width: s, height: s, rx: s * 0.1, fill: o.color || PT_KIND_COL[el.kind], stroke: '#FFFFFF', 'stroke-opacity': 0.4, 'stroke-width': Math.max(2, s * 0.015) }, g);
  const fs = { mass: Math.round(s * 0.13), sym: Math.round(s * 0.4), name: Math.round(s * 0.11), num: Math.round(s * 0.13) };
  const y = { mass: -h + s * 0.2, sym: s * 0.12, name: s * 0.29, num: h - s * 0.075 };
  const band = (yy, size) => { const b = E('rect', { x: -h + s * 0.08, y: yy - size * 0.95, width: s * 0.84, height: size * 1.25, rx: size * 0.3, fill: C.energy }, g); op(b, 0); return b; };
  const bMass = band(y.mass, fs.mass), bNum = band(y.num, fs.num);
  const parts = {
    mass: T(g, 0, y.mass, el.mass, { size: fs.mass, weight: 600, anchor: 'middle', fill: ink }),
    sym: T(g, 0, y.sym, el.sym, { size: fs.sym, weight: 700, anchor: 'middle', fill: ink }),
    name: T(g, 0, y.name, el.name, { size: fs.name, weight: 600, anchor: 'middle', fill: ink }),
    num: T(g, 0, y.num, String(z), { size: fs.num, weight: 700, anchor: 'middle', fill: ink }),
  };
  g.parts = parts; g.size = s;
  g.at = { mass: [0, y.mass - fs.mass * 0.35], sym: [0, y.sym - fs.sym * 0.35], name: [0, y.name - fs.name * 0.35], num: [0, y.num - fs.num * 0.35] };
  g.set = st => {
    st = st || {};
    for (const k in parts) _ptW(parts[k], 'opacity', st[k] === undefined ? 1 : clamp(st[k]));
    _ptW(bMass, 'opacity', clamp(st.hlMass || 0) * 0.85);
    _ptW(bNum, 'opacity', clamp(st.hlNum || 0) * 0.85);
  };
  g.set({});
  return g;
}

/* ---------- a Bohr diagram ----------
   const na = shellAtom(root, { z: 11 }); tr(na, 420, 400);
   o: z (protons and electrons from the element; neutrons from its mass number), or protons / neutrons /
      electrons given directly; mass (an isotope's mass number, e.g. { z: 6, mass: 14 } for carbon-14);
      shells (explicit electrons per shell, e.g. [2, 8, 18, 8, 1]; default the 2, 8, 8 rule, so z <= 20);
      max (create this many electrons, so set({ e }) can add more, e.g. chlorine gaining one: max 18);
      radii ([70, 120, 170, 220]); rings (number of rings drawn, default one per shell used);
      er (electron radius, 10); nr (nucleus ball radius, 9; the nucleus shrinks to fit inside the first
      shell unless fit: false); nucleus: 'dot' (one plain ball, for small icons; nucR sets its radius);
      signs (false; true puts "+" on protons and "−" on electrons, shown by set({ charges }));
      seed (nucleus shuffle).
   a.set({
     e,        electrons shown (default all). Electron i sits in place when e > i; while e goes from i to
               i+1 the next one flies in from outside its shell (and back out as e falls), and the others in
               that shell slide to make room.
     outer,    0..1 turns the outermost shell's electrons yellow and a little larger
     gap,      0..1 a dashed circle at the next empty place in the outer shell (if it has one)
     rings,    opacity of the shell rings (default 1)
     nucleus,  opacity of the nucleus (default 1)
     p, n,     protons / neutrons shown (default all; fractional pops the next one in)
     charges,  opacity of the "+" and "−" signs (needs signs: true)
     t, orbit  idle motion: each shell turns at orbit / (shell + 1) degrees per second (pass 0, or
               S.reduce ? small : normal); positions are a pure function of t
   })
   a.shellsOf(n) -> electrons per shell, e.g. [2, 8, 1];  a.slotXY(i, n) -> [x, y] of electron i when n
   electrons are present (no orbit);  a.radii;  a.nucleusR */
function shellAtom(parent, o) {
  o = o || {};
  const el = o.z ? ptElement(o.z) : null;
  const total = o.electrons !== undefined ? o.electrons : (el ? el.z : 0);
  const protons = o.protons !== undefined ? o.protons : (el ? el.z : total);
  const neutrons = o.neutrons !== undefined ? o.neutrons : (o.mass ? o.mass - protons : (el ? el.massNo - el.z : 0));
  const maxE = Math.max(total, o.max || 0);
  const R = o.radii || [70, 120, 170, 220, 270, 320, 370];
  const er = o.er || 10;
  const caps = o.shells ? o.shells.slice() : [2, 8, 8, 8];
  const shellsOf = n => { const out = []; let left = n; for (let k = 0; k < caps.length && left > 0; k++) { const c = Math.min(caps[k], left); out.push(c); left -= c; } return out; };
  const g = G(parent);

  /* rings */
  const nRings = o.rings !== undefined ? o.rings : shellsOf(maxE).length;
  const ringsG = G(g);
  for (let k = 0; k < nRings; k++) E('circle', { r: R[k], fill: 'none', stroke: C.faint, 'stroke-width': 3, opacity: 0.8 }, ringsG);

  /* nucleus: protons and neutrons packed in a sunflower spiral, drawn from the outside in. It shrinks to
     fit inside the first shell (o.fit: false turns that off); o.nucleus: 'dot' draws one plain ball. */
  const N = o.nucleus === 'dot' ? 0 : protons + neutrons, nucG = G(g);
  let nr = o.nr || 9, cpack = nr * 1.12;
  const fitR = R[0] * 0.72, rawR = cpack * Math.sqrt(Math.max(0, N - 1)) + nr;
  if (o.fit !== false && rawR > fitR) { nr *= fitR / rawR; cpack *= fitR / rawR; }
  if (o.nucleus === 'dot') E('circle', { r: o.nucR || R[0] * 0.42, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, nucG);
  const rr = rng(o.seed || (el ? el.z * 7 + 3 : 17));
  const types = []; for (let i = 0; i < N; i++) types.push(i < protons ? 'p' : 'n');
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); const tmp = types[i]; types[i] = types[j]; types[j] = tmp; }
  const pBalls = [], nBalls = [], signEls = [];
  for (let i = N - 1; i >= 0; i--) {
    const rad = cpack * Math.sqrt(i), ang = i * 2.39996;
    const b = G(nucG); tr(b, Math.cos(ang) * rad, Math.sin(ang) * rad);
    const isP = types[i] === 'p';
    E('circle', { r: nr, fill: isP ? ball(C.oxygen, C.oxygenDk) : ball(C.carbon, C.carbonDk), stroke: isP ? C.oxygenDk : C.carbonDk, 'stroke-width': 1.5 }, b);
    if (o.signs && isP) signEls.push(T(b, 0, nr * 0.45, '+', { size: nr * 1.5, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
    (isP ? pBalls : nBalls).push(b);
  }
  pBalls.reverse(); nBalls.reverse();          // index 0 = nearest the centre, so counting up fills from the middle
  const nucleusR = o.nucleus === 'dot' ? (o.nucR || R[0] * 0.42) : cpack * Math.sqrt(Math.max(0, N - 1)) + nr;

  /* electron places: shell 1 top and bottom; outer shells in pairs at N, S, E, W (singles first) */
  const COMPASS = [-90, 90, 0, 180];
  function angles(k, n) {                      // n electrons in shell k -> their angles (degrees)
    if (caps[k] <= 2) return n === 1 ? [-90] : [-90, 90].slice(0, n);
    if (caps[k] > 8) { const a = []; for (let j = 0; j < n; j++) a.push(-90 + j * 360 / n); return a; }
    const dl = (er * 1.25 / R[k]) * 180 / Math.PI, a = [];
    for (let j = 0; j < n; j++) {
      const c = j % 4, paired = n > c + 4;
      a.push(COMPASS[c] + (paired ? (j < 4 ? -dl : dl) : 0));
    }
    return a;
  }
  function slots(n) {                          // n electrons -> [{ k, a }] in fill order
    const out = [], sh = shellsOf(n);
    sh.forEach((cnt, k) => angles(k, cnt).forEach(a => out.push({ k, a })));
    return out;
  }
  const eG = G(g), es = [];
  for (let i = 0; i < maxE; i++) {
    const b = G(eG);
    E('circle', { r: er, fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 1.5 }, b);
    const y = E('circle', { r: er, fill: ball(C.energy, '#C9A800'), stroke: '#C9A800', 'stroke-width': 1.5 }, b);
    op(y, 0);
    if (o.signs) signEls.push(T(b, 0, er * 0.42, '−', { size: er * 1.5, weight: 800, anchor: 'middle', fill: C.bg0 }));
    es.push({ b, y });
  }
  const gapEl = E('circle', { r: er + 3, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 4' }, g);
  op(gapEl, 0);
  const xy = (k, a, extra) => { const r = R[k] + (extra || 0), t = a * Math.PI / 180; return [Math.cos(t) * r, Math.sin(t) * r]; };

  g.set = st => {
    st = st || {};
    const e = clamp(st.e === undefined ? total : st.e, 0, maxE);
    const n0 = Math.floor(e + 1e-6), f = n0 < maxE ? e - n0 : 0;
    const gp = clamp(st.gap || 0), sh = shellsOf(n0), ko = sh.length - 1;
    const showGap = gp > 0 && ko >= 0 && sh[ko] < caps[ko];
    /* A: places for the electrons now; B: places once one more arrives (the others slide to make room
       as it flies in, or as the gap opens) */
    const A = slots(n0), B = f > 0 || showGap ? slots(n0 + 1) : A, room = Math.max(ease(f), showGap ? gp : 0);
    const outerK = (f > 0 ? B : A).reduce((m, s_) => Math.max(m, s_.k), -1);
    const rot = k => (st.t || 0) * (st.orbit || 0) / (k + 1);
    const outer = clamp(st.outer || 0);
    for (let i = 0; i < maxE; i++) {
      const E_ = es[i];
      if (i < n0) {
        const a = A[i], b = B[i] || a;
        const ang = lerp(a.a, b.a, room) + rot(a.k);
        const [x, y] = xy(a.k, ang);
        const big = a.k === outerK ? outer : 0;
        _ptW(E_.b, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})${big > 0 ? ` scale(${(1 + 0.25 * big).toFixed(3)})` : ''}`);
        _ptW(E_.b, 'opacity', 1);
        _ptW(E_.y, 'opacity', big);
      } else if (i === n0 && f > 0) {
        const b = B[i], p = ease(f);
        const [x, y] = xy(b.k, b.a + rot(b.k) - 40 * (1 - p), 110 * (1 - p));
        _ptW(E_.b, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        _ptW(E_.b, 'opacity', clamp(f * 1.6));
        _ptW(E_.y, 'opacity', b.k === outerK ? outer : 0);
      } else _ptW(E_.b, 'opacity', 0);
    }
    /* gap: the next free place in the outer shell (fades as an electron flies into it) */
    if (showGap) {
      const [x, y] = xy(ko, B[n0].a + rot(ko));
      _ptW(gapEl, 'transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      _ptW(gapEl, 'opacity', gp * (1 - f));
    } else _ptW(gapEl, 'opacity', 0);
    _ptW(ringsG, 'opacity', st.rings === undefined ? 1 : clamp(st.rings));
    _ptW(nucG, 'opacity', st.nucleus === undefined ? 1 : clamp(st.nucleus));
    const pop_ = (arr, v) => arr.forEach((b, i) => { const q = clamp((v === undefined ? arr.length : v) - i); _ptW(b, 'opacity', q); });
    pop_(pBalls, st.p); pop_(nBalls, st.n);
    const ch = st.charges === undefined ? 1 : clamp(st.charges);
    signEls.forEach(s_ => _ptW(s_, 'opacity', ch));
  };
  g.shellsOf = shellsOf;
  g.slotXY = (i, n) => { const s_ = slots(n === undefined ? total : n)[i]; return s_ ? xy(s_.k, s_.a) : [0, 0]; };
  g.radii = R; g.nucleusR = nucleusR;
  g.set({});
  return g;
}

/* ==========================================================================
   chemical-reactions/lib.js: art shared by the Chemical Reactions scenes.
   Bundled after engine/lib.js and engine/kit.js, so it uses their C, E, G, T,
   tr, op, attr, ball, glow, linGrad, defs, arrow, textWidth, clamp, rng, atom,
   ATOM ... Same rules as lib.js: each primitive draws around its own origin and
   returns a <g>; animated ones take g.set(...) and/or g.upd(t). Build once, then
   call set/upd from the scene's update(t) with values worked out from t, so
   scrubbing and seeking always work.

     RX                               shared colours: atoms, materials, big numbers, tallies
     rxAtom(parent, sym, r, o)        one atom ball (C, H, O are lib's atom(); the rest in RX.atom)
     rxMol(parent, kind, o)           a molecule built from rxAtom balls (kinds in RX_MOLS); g.atoms[i]
     rxFormula(parent, x, y, str, o)  formula or equation text: real subscripts, amber big numbers
     rxTally(parent, syms, o)         atom counters for one side of an equation; set(counts, marks)
     rxBalance(parent, o)             top-pan balance with a green digital readout; set({ reading })
     rxBung(parent, s, o)             rubber bung sealing a kit flask (or a kit testTube)
     rxNail(parent, len, o)           iron nail; set({ rust, copper })
     rxFlame(parent, s, o)            flame; set('yellow' | 'blue' | 'white' | 'candle', size), upd(t)
     rxCatalyst(parent, s, o)         the gold catalyst square; set({ glow })
     rxSignTile(parent, kind, o)      one of the five signs of a reaction; set({ lit, letter, dim })
     rxSignBoard(parent, text, o)     fire-exit style sign for "EXO = EXIT" and "ENDO = ENTER"
   ========================================================================== */

const RX = {
  /* atom colours, the same as in Elements, Compounds & Mixtures (C, H and O come from lib's ATOM) */
  atom: { Mg: '#9FE3B0', Fe: '#C27A4A', Cu: '#E08A4F', Na: '#B48CFF', Cl: '#6FD96F', N: '#5B8CFF', S: '#FFD84A', Zn: '#A9B8C8' },
  coef: C.energy,                 // big numbers (coefficients) in formulae
  ok: C.good, bad: C.bad,         // tallies: the two sides match / differ
  iron: '#AEB9C4', ironDk: '#5E6A75', rust: '#B5562A', rustLt: '#DB7A3E',
  copper: '#D9825B', cuCarbonate: '#4FB58A', cuOxide: '#2B3034', cuSulfate: '#3D8BFF', feSulfate: '#A9D9B2',
  mgOxide: '#F2F5F7', soot: '#3A3F45', precip: '#F3E27A',
  gold: '#F5C542', goldDk: '#A97C0C',
  exit: '#1E9E55', enter: '#2F6FD6',
};

/* ---------- small helpers ---------- */
let _rxId = 0;
function _rxRgb(hex) { const h = hex.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
/* darker (k < 1) or lighter (k > 1) version of a '#rrggbb' colour */
function _rxShade(hex, k) { return '#' + _rxRgb(hex).map(v => Math.round(clamp(v * k, 0, 255)).toString(16).padStart(2, '0')).join(''); }
/* readable symbol colour on a ball of this colour */
function _rxInk(hex) { const [r, g, b] = _rxRgb(hex); return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#17313D' : '#FFFFFF'; }
/* write an attribute, the opacity (k 'opacity') or the text (k 'text') only when it changes */
function _rxW(el, k, v) {
  const m = el._rx || (el._rx = {});
  if (m[k] === v) return;
  m[k] = v;
  if (k === 'opacity') op(el, v); else if (k === 'text') el.textContent = v; else el.setAttribute(k, v);
}
function _rxClip(parent, d) {
  const id = 'rxc' + (++_rxId), cp = E('clipPath', { id }, defs());
  E('path', { d }, cp);
  return G(parent, { 'clip-path': `url(#${id})` });
}

/* ---------- atoms and molecules ---------- */
/* one atom ball of radius r (18) around (0,0), with its symbol unless o.letter === false.
   C, H and O are lib's atom(), so they match every other lesson. */
function rxAtom(parent, sym, r, o) {
  r = r || 18; o = o || {};
  const show = o.letter !== false;
  if (ATOM[sym]) return atom(parent, sym, r, { letter: show });
  const col = RX.atom[sym] || '#B8C4CF', dk = _rxShade(col, 0.58);
  const g = G(parent);
  E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, g);
  if (show) T(g, 0, r * 0.33, sym, { size: r * (sym.length > 1 ? 0.84 : 1), weight: 700, fill: _rxInk(col), anchor: 'middle' });
  return g;
}
/* molecule layouts: [symbol, x, y, size], in units of the base radius r (size multiplies r).
   Atoms are drawn in this order, so later ones overlap earlier ones, as in lib's molCO2 and molH2O.
   NaCl is a small piece of salt crystal (a grid of four), not a molecule. */
const RX_MOLS = {
  H2: [['H', -0.45, 0, 0.62], ['H', 0.45, 0, 0.62]],
  O2: [['O', -0.72, 0, 1], ['O', 0.72, 0, 1]],
  N2: [['N', -0.72, 0, 0.95], ['N', 0.72, 0, 0.95]],
  H2O: [['H', -0.98, 0.72, 0.62], ['H', 0.98, 0.72, 0.62], ['O', 0, 0, 1]],
  CO2: [['O', -1.6, 0, 0.9], ['O', 1.6, 0, 0.9], ['C', 0, 0, 1]],
  CO: [['C', -0.8, 0, 1], ['O', 0.8, 0, 0.95]],
  CH4: [['H', -1, -1, 0.62], ['H', 1, -1, 0.62], ['H', -1, 1, 0.62], ['H', 1, 1, 0.62], ['C', 0, 0, 1]],
  MgO: [['Mg', -0.88, 0, 1.15], ['O', 0.88, 0, 0.95]],
  CuO: [['Cu', -0.88, 0, 1.12], ['O', 0.88, 0, 0.95]],
  H2O2: [['H', -1.45, 0.95, 0.62], ['H', 1.45, -0.95, 0.62], ['O', -0.7, 0, 1], ['O', 0.7, 0, 1]],
  CuCO3: [['Cu', -2.4, 0, 1.12], ['O', -0.75, 0, 0.95], ['O', 1.5, -1.3, 0.95], ['O', 1.5, 1.3, 0.95], ['C', 0.75, 0, 1]],
  Fe2O3: [['O', -2.5, 0.55, 0.95], ['O', 0, 0.55, 0.95], ['O', 2.5, 0.55, 0.95], ['Fe', -1.25, -0.45, 1.12], ['Fe', 1.25, -0.45, 1.12]],
  NaCl: [['Na', -0.95, -0.95, 1], ['Cl', 0.95, -0.95, 1.05], ['Cl', -0.95, 0.95, 1.05], ['Na', 0.95, 0.95, 1]],
};
/* a molecule centred on its bounding box: const m = rxMol(root, 'CH4', { r: 20 }); tr(m, x, y)
   o: r (base radius, 15), letter (false hides the symbols).
   m.atoms[i] = { sym, g, x, y, r } in the molecule's own coordinates, to move single atoms
   (e.g. tr(m.atoms[0].g, x, y) while atoms swap partners); m.w and m.h are its size in px. */
function rxMol(parent, kind, o) {
  o = o || {};
  const L = RX_MOLS[kind];
  if (!L) throw new Error('rxMol: unknown kind ' + kind);
  const r = o.r || 15, g = G(parent);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  L.forEach(([, x, y, k]) => { x0 = Math.min(x0, x - k); x1 = Math.max(x1, x + k); y0 = Math.min(y0, y - k); y1 = Math.max(y1, y + k); });
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  g.atoms = L.map(([sym, x, y, k]) => {
    const a = rxAtom(g, sym, r * k, { letter: o.letter });
    const px = (x - cx) * r, py = (y - cy) * r;
    tr(a, px, py);
    return { sym, g: a, x: px, y: py, r: r * k };
  });
  g.w = (x1 - x0) * r; g.h = (y1 - y0) * r;
  return g;
}

/* ---------- formulae and atom tallies ---------- */
/* formula or equation text at (x, y): rxFormula(root, 600, 300, '2H2 + O2 → 2H2O') draws 2H₂ + O₂ → 2H₂O
   with real (smaller, lowered) subscripts and the big numbers in amber. Tokens are separated by spaces;
   '+', '→' ('->') and '=' are operators; any other word ('energy', '(gas)') is drawn as it is.
   o: size (50), fill (C.ink), coef (RX.coef), op (operator colour; default fill), anchor ('middle'),
   weight (600). Returns the <text>; its .w is the drawn width in px. */
function rxFormula(parent, x, y, str, o) {
  o = o || {};
  const size = o.size || 50, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
  const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
  t.style.whiteSpace = 'pre';
  let low = false;
  const push = (txt, kind) => {
    const ts = E('tspan', {}, t);
    ts.textContent = txt;
    if (kind === 'sub') {
      ts.setAttribute('font-size', sub);
      if (!low) { ts.setAttribute('dy', dy); low = true; }
      return;
    }
    if (low) { ts.setAttribute('dy', -dy); low = false; }
    if (kind === 'coef') ts.setAttribute('fill', o.coef || RX.coef);
    if (kind === 'op' && o.op) ts.setAttribute('fill', o.op);
  };
  String(str).trim().split(/\s+/).forEach((tok, i) => {
    if (i) push(' ', 'text');
    if (/^(\+|→|->|=)$/.test(tok)) { push(tok === '->' ? '→' : tok, 'op'); return; }
    const m = tok.match(/^(\d*)((?:[A-Z][a-z]?\d*|[()]\d*)+)$/);
    if (!m) { push(tok, 'text'); return; }
    if (m[1]) push(m[1], 'coef');
    m[2].replace(/([A-Z][a-z]?|[()])(\d*)/g, (all, el, n) => { push(el, 'text'); if (n) push(n, 'sub'); return ''; });
  });
  try { t.w = t.getComputedTextLength(); } catch (e) { t.w = 0; }
  return t;
}
/* atom counters for one side of an equation, centred on (0,0): one pill per element, its ball then
   its count. const tl = rxTally(root, ['H', 'O']); tl.set({ H: 4, O: 2 }, { H: 1, O: -1 })
   marks: 1 = this element matches the other side (green), -1 = it doesn't (red), 0 or missing = plain.
   o: size (count text, 34), r (ball radius, 16), gap (14). tl.w is the row's width. */
function rxTally(parent, syms, o) {
  o = o || {};
  const size = o.size || 34, r = o.r || 16, gap = o.gap || 14;
  const cw = r * 2 + size * 1.3 + 26, ch = Math.max(r * 2 + 14, size * 1.45);
  const g = G(parent), W = syms.length * cw + (syms.length - 1) * gap, chips = {};
  syms.forEach((sym, i) => {
    const c = G(g); tr(c, -W / 2 + i * (cw + gap) + cw / 2, 0);
    const box = E('rect', { x: -cw / 2, y: -ch / 2, width: cw, height: ch, rx: ch / 2, fill: C.card2, stroke: C.line, 'stroke-width': 3 }, c);
    tr(rxAtom(c, sym, r), -cw / 2 + r + 9, 0);
    const n = T(c, -cw / 2 + r * 2 + 20, size * 0.36, '0', { size, weight: 700, fill: C.ink });
    chips[sym] = { box, n };
  });
  g.w = W;
  g.set = (counts, marks) => {
    counts = counts || {}; marks = marks || {};
    for (const sym in chips) {
      const k = chips[sym], m = marks[sym] || 0, col = m > 0.5 ? RX.ok : m < -0.5 ? RX.bad : null;
      _rxW(k.n, 'text', String(Math.round(counts[sym] || 0)));
      _rxW(k.n, 'fill', col || C.ink);
      _rxW(k.box, 'stroke', col || C.line);
    }
  };
  g.set({});
  return g;
}

/* ---------- lab kit ---------- */
/* top-pan balance. (0,0) is the middle of the pan's top surface, so things placed on it sit at y < 0;
   about w (320) wide and 118 tall below that. bal.set({ reading: 50, dp: 2, flash: 0 }) shows "50.00 g"
   (flash 0..1 makes the readout glow, e.g. while a reading changes). bal.w, bal.h. */
function rxBalance(parent, o) {
  o = o || {};
  const w = o.w || 320, pw = w * 0.74, bh = 92, g = G(parent);
  E('rect', { x: -pw / 2, y: 0, width: pw, height: 12, rx: 6, fill: linGrad('#E3E9EE', '#9AA8B4', true), stroke: '#C5D0D9', 'stroke-width': 2 }, g);
  E('rect', { x: -16, y: 12, width: 32, height: 14, fill: '#7B8996' }, g);
  E('rect', { x: -w / 2, y: 26, width: w, height: bh, rx: 16, fill: linGrad('#6F7D8A', '#46525D', true), stroke: '#9DB0BF', 'stroke-width': 2.5 }, g);
  const ww = w * 0.62, wh = 56, wx = -w / 2 + 26, wy = 26 + (bh - wh) / 2;
  const halo = E('rect', { x: wx - 14, y: wy - 14, width: ww + 28, height: wh + 28, rx: 18, fill: glow('#5CFFA0') }, g);
  E('rect', { x: wx, y: wy, width: ww, height: wh, rx: 8, fill: '#08261A', stroke: '#2C6B4A', 'stroke-width': 2.5 }, g);
  const val = T(g, wx + ww - 42, wy + wh / 2 + 14, '0.00', { size: 40, weight: 700, fill: '#5CFFA0', anchor: 'end' });
  T(g, wx + ww - 14, wy + wh / 2 + 14, 'g', { size: 32, weight: 700, fill: '#5CFFA0', anchor: 'end' });
  [0, 1].forEach(i => E('circle', { cx: w / 2 - 34, cy: 26 + bh * (0.3 + i * 0.4), r: 10, fill: i ? '#E8424F' : '#9FD8FF', stroke: '#1B2A33', 'stroke-width': 2 }, g));
  g.w = w; g.h = 26 + bh;
  g.set = st => {
    st = st || {};
    const dp = st.dp !== undefined ? st.dp : o.dp !== undefined ? o.dp : 2;
    _rxW(val, 'text', (+(st.reading || 0)).toFixed(dp));
    _rxW(halo, 'opacity', clamp(st.flash || 0) * 0.8);
  };
  g.set({});
  return g;
}
/* rubber bung pushed into a neck, drawn at the same scale s as its glassware:
     const fl = flask(root, s); rxBung(fl, s); tr(fl, x, y)            (kit flask: the defaults)
     const tt = testTube(root, 46, 200); rxBung(tt, 1, { neck: 46, y: -100 })
   o: neck (inside width of the neck at s = 1, default 34), y (top of the neck at s = 1, default -95). */
function rxBung(parent, s, o) {
  s = s || 1; o = o || {};
  const neck = o.neck || 34, top = o.y === undefined ? -95 : o.y, g = G(parent), inner = G(g);
  tr(inner, 0, 0, s);
  const wt = neck * 1.45, wb = neck * 0.96, h = neck * 0.78, y0 = top - h * 0.62;
  E('path', { d: `M${-wt / 2},${y0} L${wt / 2},${y0} L${wb / 2},${y0 + h} L${-wb / 2},${y0 + h} Z`, fill: linGrad('#A2483A', '#6E2A20', true), stroke: '#C46A58', 'stroke-width': 2, 'stroke-linejoin': 'round' }, inner);
  E('rect', { x: -wt / 2 + 4, y: y0 + 3, width: wt - 8, height: 4, rx: 2, fill: '#D88A78', opacity: 0.6 }, inner);
  return g;
}
/* iron nail about len (220) long, point down and head up, centred on (0,0).
   nail.set({ rust: 0..1, copper: 0..1 }): rust patches spread over it as rust goes 0 -> 1; copper coats
   the part below o.wet (fraction of the length, measured from the point, default 0.65), as in copper
   sulfate solution. o: w (shaft width), seed. */
function rxNail(parent, len, o) {
  len = len || 220; o = o || {};
  const w = o.w || Math.max(10, len * 0.085), g = G(parent), top = -len / 2, bot = len / 2, tip = len * 0.13;
  const shaft = `M${-w / 2},${top + w * 0.3} L${w / 2},${top + w * 0.3} L${w / 2},${bot - tip} L0,${bot} L${-w / 2},${bot - tip} Z`;
  E('path', { d: shaft, fill: linGrad(RX.iron, RX.ironDk), stroke: '#47525C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
  E('rect', { x: -w * 0.22, y: top + w * 0.7, width: w * 0.18, height: len * 0.6, rx: w * 0.09, fill: '#FFFFFF', opacity: 0.35 }, g);
  const inside = _rxClip(g, shaft);
  const tint = E('path', { d: shaft, fill: RX.rust }, inside);
  const rr = rng(o.seed || 23), spots = [];
  for (let i = 0; i < 16; i++) {
    const y = top + w + rr() * (len - w - tip * 0.6), x = (rr() - 0.5) * w * 0.9, rx = w * (0.3 + rr() * 0.35);
    spots.push({ el: E('ellipse', { cx: x, cy: y, rx, ry: rx * (1.3 + rr()), fill: rr() < 0.5 ? RX.rust : RX.rustLt }, inside), th: i / 16 });
  }
  const wet = o.wet === undefined ? 0.65 : o.wet, cy = bot - len * wet;
  const cu = E('rect', { x: -w, y: cy, width: 2 * w, height: bot - cy + 2, fill: RX.copper }, inside);
  E('rect', { x: -w * 1.35, y: top - w * 0.25, width: w * 2.7, height: w * 0.55, rx: w * 0.2, fill: linGrad('#C7D0D8', RX.ironDk, true), stroke: '#47525C', 'stroke-width': 2 }, g);
  g.set = st => {
    st = st || {};
    const ru = clamp(st.rust || 0), co = clamp(st.copper || 0);
    _rxW(tint, 'opacity', ru * 0.55);
    spots.forEach(s => _rxW(s.el, 'opacity', clamp((ru - s.th * 0.8) * 5) * 0.92));
    _rxW(cu, 'opacity', co);
  };
  g.set({});
  return g;
}
/* flame standing on (0,0), about 124*s tall.
   fl.set(mode, size): mode 'yellow' (luminous, smoky), 'blue' (hot, clean), 'white' (burning magnesium)
   or 'candle' (small, steady); size 0..2 grows it from nothing (default 1).
   fl.upd(t) flickers it, and puffs soot above a yellow flame built with o.smoke. */
const _RX_FLAMES = {
  yellow: ['#FFB13B', '#FFE07A', '#FFB347', 0.95, 0.11],
  blue: ['#5AA8FF', '#CFEAFF', '#5AA8FF', 0.35, 0.04],
  white: ['#F4FBFF', '#FFFFFF', '#FFFFFF', 1, 0.08],
  candle: ['#FFB13B', '#FFF2B0', '#FFB347', 0.7, 0.05],
};
function rxFlame(parent, s, o) {
  s = s || 1; o = o || {};
  const g = G(parent), inner = G(g);
  tr(inner, 0, 0, s);
  const halo = E('ellipse', { cx: 0, cy: -58, rx: 64, ry: 94 }, inner);
  const body = G(inner);
  const outer = E('path', { d: 'M0,0 C-30,-24 -26,-78 0,-124 C26,-78 30,-24 0,0 Z' }, body);
  const core = E('path', { d: 'M0,-4 C-13,-16 -13,-46 0,-72 C13,-46 13,-16 0,-4 Z' }, body);
  const soot = [];
  if (o.smoke) for (let i = 0; i < 5; i++) soot.push(E('circle', { r: 7 + (i % 3) * 3, fill: RX.soot }, inner));
  let mode = 'yellow', size = 1;
  g.set = (m, sz) => {
    if (_RX_FLAMES[m]) mode = m;
    size = sz === undefined ? 1 : clamp(sz, 0, 2);
    const f = _RX_FLAMES[mode];
    _rxW(outer, 'fill', f[0]); _rxW(core, 'fill', f[1]); _rxW(halo, 'fill', glow(f[2]));
    _rxW(halo, 'opacity', f[3] * Math.min(1, size));
    _rxW(body, 'opacity', size > 0.01 ? 1 : 0);
  };
  g.upd = t => {
    const k = _RX_FLAMES[mode][4], sc = Math.max(0.001, size * (mode === 'candle' ? 0.55 : 1));
    body.setAttribute('transform', `scale(${(sc * (1 + k * 0.4 * Math.sin(t * 9))).toFixed(3)} ${(sc * (1 + k * Math.sin(t * 13 + 1))).toFixed(3)})`);
    halo.setAttribute('transform', `scale(${sc.toFixed(3)})`);
    soot.forEach((p, i) => {
      const ph = (t * 0.45 + i / soot.length) % 1;
      attr(p, 'cx', Math.sin(t * 1.7 + i * 2) * 12 * ph);
      attr(p, 'cy', -124 * sc - ph * 120);
      op(p, mode === 'yellow' && size > 0.2 ? Math.sin(ph * Math.PI) * 0.75 : 0);
    });
  };
  g.set('yellow', 1); g.upd(0);
  return g;
}
/* the gold catalyst square, about 64*s across, centred on (0,0). cat.set({ glow: 0..1 }).
   o.label: a word under it, e.g. 'catalyst' or 'platinum'. */
function rxCatalyst(parent, s, o) {
  s = s || 1; o = o || {};
  const g = G(parent), inner = G(g);
  tr(inner, 0, 0, s);
  const halo = E('circle', { r: 72, fill: glow(RX.gold) }, inner);
  E('rect', { x: -32, y: -32, width: 64, height: 64, rx: 12, fill: linGrad('#FFE38A', RX.goldDk, true), stroke: '#FFF1BF', 'stroke-width': 3 }, inner);
  E('path', { d: 'M-21,-12 L-21,-21 L12,-21', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.7 }, inner);
  if (o.label) T(g, 0, 32 * s + 36, o.label, { size: 26, weight: 600, anchor: 'middle', fill: RX.gold });
  g.set = st => _rxW(halo, 'opacity', clamp((st && st.glow) || 0));
  g.set({});
  return g;
}

/* ---------- signs and boards ---------- */
const RX_SIGNS = {
  colour: { letter: 'C', label: 'colour' },
  gas: { letter: 'G', label: 'gas' },
  temp: { letter: 'T', label: 'temperature' },
  precip: { letter: 'P', label: 'precipitate' },
  light: { letter: 'L', label: 'light/sound' },
};
/* one of the five signs of a reaction, as a tile about o.size (180) square centred on (0,0):
   kind 'colour' | 'gas' | 'temp' | 'precip' | 'light', in the order of Cool Guys Take Pretty Lasses.
   tile.set({ lit, letter, dim }): lit 0..1 lights its border, letter 0..1 shows its initial (C G T P L)
   in a badge on the top-left corner, dim 0..1 fades it back. tile.letter, tile.label. */
function rxSignTile(parent, kind, o) {
  o = o || {};
  const info = RX_SIGNS[kind];
  if (!info) throw new Error('rxSignTile: unknown kind ' + kind);
  const s = o.size || 180, h = s / 2, g = G(parent), body = G(g);
  E('rect', { x: -h, y: -h, width: s, height: s, rx: s * 0.12, fill: C.card, stroke: C.line, 'stroke-width': 3 }, body);
  const lit = E('rect', { x: -h, y: -h, width: s, height: s, rx: s * 0.12, fill: 'rgba(255,228,92,0.10)', stroke: C.energy, 'stroke-width': 5 }, body);
  const icon = G(body);
  tr(icon, 0, -h * 0.18, s / 180);
  _rxSignIcon(icon, kind);
  T(body, 0, h - s * 0.12, info.label, { size: 26, weight: 600, anchor: 'middle', fill: C.ink });
  const badge = G(g);
  tr(badge, -h + 6, -h + 6);
  E('circle', { r: 30, fill: C.energy, stroke: C.bg0, 'stroke-width': 4 }, badge);
  T(badge, 0, 14, info.letter, { size: 40, weight: 700, anchor: 'middle', fill: C.bg0 });
  g.letter = info.letter; g.label = info.label;
  g.set = st => {
    st = st || {};
    _rxW(lit, 'opacity', clamp(st.lit || 0));
    _rxW(badge, 'opacity', clamp(st.letter || 0));
    _rxW(body, 'opacity', 1 - 0.65 * clamp(st.dim || 0));
  };
  g.set({});
  return g;
}
/* the tile icons, about 100 x 90 around (0,0) */
function _rxSignIcon(p, kind) {
  if (kind === 'colour') {
    E('circle', { cx: -32, cy: 0, r: 22, fill: ball(RX.iron, RX.ironDk) }, p);
    arrow(p, -4, 0, 12, 0, { color: C.muted, width: 4, head: 12 });
    E('circle', { cx: 34, cy: 0, r: 22, fill: ball(RX.rustLt, RX.rust) }, p);
  } else if (kind === 'gas') {
    [[-18, 22, 9], [6, 2, 12], [-10, -24, 8], [16, -34, 6]].forEach(([x, y, r]) =>
      E('circle', { cx: x, cy: y, r, fill: 'rgba(255,255,255,0.14)', stroke: '#CFE7F5', 'stroke-width': 3 }, p));
  } else if (kind === 'temp') {
    E('rect', { x: -9, y: -40, width: 18, height: 62, rx: 9, fill: '#E9F2F7', stroke: '#8FB0C2', 'stroke-width': 3 }, p);
    E('rect', { x: -4, y: -22, width: 8, height: 46, rx: 4, fill: C.bad }, p);
    E('circle', { cx: 0, cy: 28, r: 14, fill: C.bad, stroke: '#8FB0C2', 'stroke-width': 3 }, p);
    arrow(p, 34, 22, 34, -28, { color: C.heat, width: 5, head: 13 });
    arrow(p, -34, -28, -34, 22, { color: C.water, width: 5, head: 13 });
  } else if (kind === 'precip') {
    E('path', { d: 'M-17,-40 L-17,22 A17,17 0 0 0 17,22 L17,-40 Z', fill: 'rgba(76,201,240,0.22)' }, p);
    const rr = rng(5);
    for (let i = 0; i < 14; i++) E('circle', { cx: (rr() - 0.5) * 24, cy: 30 - rr() * 22, r: 3 + rr() * 2.5, fill: RX.precip }, p);
    E('path', { d: 'M-17,-40 L-17,22 A17,17 0 0 0 17,22 L17,-40', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, p);
  } else if (kind === 'light') {
    let d = '';
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, r = i % 2 ? 11 : (i % 4 ? 22 : 32); d += (i ? 'L' : 'M') + (-14 + Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('circle', { cx: -14, cy: 0, r: 44, fill: glow(C.energy) }, p);
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, p);
    [14, 24].forEach(r => E('path', { d: `M${22 + r * 0.2},${-r} Q${22 + r},0 ${22 + r * 0.2},${r}`, fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, p));
  }
}
/* fire-exit style sign centred on (0,0), sized to its text:
   rxSignBoard(root, 'EXO = EXIT') is green with an arrow leaving a doorway;
   rxSignBoard(root, 'ENDO = ENTER', { kind: 'enter' }) is blue with an arrow going in.
   o: size (text, 40), color. board.w, board.h. Fade it with op(board, p). */
function rxSignBoard(parent, text, o) {
  o = o || {};
  const size = o.size || 40, enter = o.kind === 'enter', col = o.color || (enter ? RX.enter : RX.exit);
  const tw = textWidth(text, size, FD, 700), door = size * 0.95, h = size * 2, pad = size * 0.55, gap = size * 1.5;
  const w = pad + door + gap + tw + pad, g = G(parent);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: size * 0.3, fill: col, stroke: '#FFFFFF', 'stroke-width': 4 }, g);
  const dx = -w / 2 + pad;
  E('rect', { x: dx, y: -h * 0.32, width: door, height: h * 0.64, rx: 3, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, g);
  const a = dx + door * 0.35, b = dx + door + gap * 0.8;
  arrow(g, enter ? b : a, 0, enter ? a : b, 0, { color: '#FFFFFF', width: 5, head: 14 });
  T(g, dx + door + gap, size * 0.36, text, { size, weight: 700, fill: '#FFFFFF' });
  g.w = w; g.h = h;
  return g;
}

/* ==========================================================================
   energy/lib.js: art shared by the Energy scenes. Bundled after engine/lib.js
   and kit.js, so it uses their C, E, G, T, tr, op, attr, ball, glow, spark,
   arrow, chip, heatWaves, beaker, wire, sineWave, leaf, clamp, lerp, ease ...

     EN                               the eight stores (colour, name, letter), in mnemonic order,
                                      pathway colours and labels, resource lists
     enBadge(parent, kind, o)         a store badge: coloured disc, white icon, label below
     enJar(parent, kind, o)           a store jar: kit beaker filled with the store's colour, badge on the front
     enSparkFlow(parent, pts, o)      energy sparks travelling along a path (a stream, or one batch)
     enPathway(parent, kind, x1, y1, x2, y2, o)
                                      a transfer pathway: 'mech' | 'elec' | 'heat' | 'rad'
     enFlowChain(parent, items, o)    an energy flow diagram: labelled boxes joined by arrows
     enDissipate(parent, w, h, o)     wasted energy spreading thinly through a room
     enSankey(parent, o)              a Sankey diagram: useful carries on, wasted peels off downwards
     enGrid100(parent, o)             a 10 x 10 grid of squares for percentages
     enBulb(parent, kind, o)          a filament or LED light bulb
     enResource(parent, kind, o)      an energy-resource icon: coal, oil, gas, uranium, solar, wind,
                                      hydro, tidal, wave, geothermal, biomass

   Same rules as lib.js: build once, then each frame call g.set(...) / g.upd(t) with
   values worked out from the chapter time t; every one is a pure function of its
   arguments, so scrubbing and seeking always work. Store kinds are the keys of
   EN.store: kinetic, gravitational, elastic, chemical, thermal, nuclear,
   electrostatic, magnetic.
   ========================================================================== */

const EN = {
  order: ['kinetic', 'gravitational', 'elastic', 'chemical', 'thermal', 'nuclear', 'electrostatic', 'magnetic'],
  store: {
    kinetic: { label: 'kinetic', name: 'kinetic', letter: 'K', color: C.water, dark: C.waterDk },
    gravitational: { label: 'gravitational', name: 'gravitational potential', letter: 'G', color: C.good, dark: '#1F7A50' },
    elastic: { label: 'elastic', name: 'elastic potential', letter: 'E', color: C.lactic, dark: C.lacticDk },
    chemical: { label: 'chemical', name: 'chemical', letter: 'C', color: C.glucose, dark: '#9A630A' },
    thermal: { label: 'thermal', name: 'thermal', letter: 'T', color: C.heat, dark: C.heatDk },
    nuclear: { label: 'nuclear', name: 'nuclear', letter: 'N', color: C.ethanol, dark: C.ethanolDk },
    electrostatic: { label: 'electrostatic', name: 'electrostatic', letter: 'E', color: C.air, dark: '#2F6E9E' },
    // magnetic is split red (N) and blue (S), like kit's magnet(); color is used where one colour is needed
    magnetic: { label: 'magnetic', name: 'magnetic', letter: 'M', color: '#E8424F', dark: '#A4232E', color2: '#3B82F6', dark2: '#1E4FA8' },
  },
  useful: C.energy,            // energy doing the job we want: yellow sparks
  wasted: C.heat,              // wasted energy: orange, spreading out
  wave: { light: C.energy, ir: C.heat, sound: '#FFFFFF' },
  pathLabel: { mech: 'mechanically', elec: 'electrically', heat: 'by heating', rad: 'by radiation' },
  nonRenewable: ['coal', 'oil', 'gas', 'uranium'],
  renewable: ['solar', 'wind', 'hydro', 'tidal', 'wave', 'geothermal', 'biomass'],    // Six Wild Horses Took Wet Grass Back
  resName: { coal: 'coal', oil: 'oil', gas: 'natural gas', uranium: 'uranium', solar: 'solar', wind: 'wind', hydro: 'hydroelectric', tidal: 'tidal', wave: 'wave', geothermal: 'geothermal', biomass: 'biomass' },
};

/* ---------- small helpers ---------- */
/* set an attribute (or 'opacity' via op) only when its value changes */
function _enW(el, k, v) {
  const memo = el._en || (el._en = {});
  if (memo[k] === v) return;
  memo[k] = v;
  if (k === 'opacity') op(el, v); else el.setAttribute(k, v);
}
const _enRGB = {};
function _enMix(a, b, p) {
  p = clamp(p); if (p <= 0) return a; if (p >= 1) return b;
  const rgb = h => _enRGB[h] || (_enRGB[h] = [0, 2, 4].map(i => parseInt(h.replace('#', '').slice(i, i + 2), 16)));
  const x = rgb(a), y = rgb(b);
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * p).toString(16).padStart(2, '0')).join('');
}
/* hard left/right split fill (magnetic store): left colour a, right colour b, split at the shape's middle */
const _enSplits = {};
function _enSplit(a, b) {
  const id = 'enSplit' + (a + b).replace(/[^0-9a-z]/gi, '');
  if (!_enSplits[id]) {
    const lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    [[0, a], [0.5, a], [0.5, b], [1, b]].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lg));
    _enSplits[id] = `url(#${id})`;
  }
  return _enSplits[id];
}
/* point and direction at arc length s along a polyline (segments precomputed by _enPoly) */
function _enPoly(pts) {
  const segs = []; let L = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push({ s0: L, l, a: pts[i], b: pts[i + 1] }); L += l; }
  const at = s => {
    s = clamp(s, 0, L);
    for (const sg of segs) if (s <= sg.s0 + sg.l || sg === segs[segs.length - 1]) {
      const p = sg.l ? (s - sg.s0) / sg.l : 0;
      return { x: lerp(sg.a[0], sg.b[0], p), y: lerp(sg.a[1], sg.b[1], p), dx: (sg.b[0] - sg.a[0]) / (sg.l || 1), dy: (sg.b[1] - sg.a[1]) / (sg.l || 1) };
    }
    return { x: pts[0][0], y: pts[0][1], dx: 1, dy: 0 };
  };
  return { L, at };
}

/* ---------- store icons (white, for a badge of radius 44; scaled to fit) ---------- */
function _enIcon(parent, kind, r) {
  const g = G(parent), k = G(g); tr(k, 0, 0, r / 44);
  const W_ = '#FFFFFF', line = (d, w) => E('path', { d, fill: 'none', stroke: W_, 'stroke-width': w || 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k);
  if (kind === 'kinetic') {                            // a ball with speed lines
    E('circle', { cx: 11, cy: 0, r: 13, fill: W_ }, k);
    line('M-27,0 L-6,0'); line('M-22,-10 L-7,-10'); line('M-22,10 L-7,10');
  } else if (kind === 'gravitational') {               // a book on a high shelf, with an up arrow
    line('M-6,13 L27,13', 4.5); line('M20,13 L26,21', 3.5);
    E('rect', { x: -2, y: -16, width: 11, height: 29, rx: 2, fill: W_ }, k);
    E('rect', { x: 11, y: -8, width: 9, height: 21, rx: 2, fill: W_, opacity: 0.8 }, k);
    line('M-19,16 L-19,-14', 4.5); line('M-27,-6 L-19,-16 L-11,-6', 4.5);
  } else if (kind === 'elastic') {                     // a coiled spring
    line('M-28,0 L-21,0 L-16,-13 L-8,13 L0,-13 L8,13 L16,-13 L21,0 L28,0', 4.5);
  } else if (kind === 'chemical') {                    // a battery
    E('rect', { x: -24, y: -13, width: 42, height: 26, rx: 5, fill: 'none', stroke: W_, 'stroke-width': 4.5 }, k);
    E('rect', { x: 18, y: -6, width: 7, height: 12, rx: 2, fill: W_ }, k);
    E('rect', { x: -19, y: -8, width: 20, height: 16, rx: 2, fill: W_ }, k);
  } else if (kind === 'thermal') {                     // rising heat waves
    [-13, 0, 13].forEach(x => line(`M${x},17 C${x - 7},9 ${x + 7},3 ${x},-4 C${x - 7},-11 ${x + 6},-16 ${x},-21`, 4.5));
  } else if (kind === 'nuclear') {                     // a glowing nucleus
    E('circle', { r: 30, fill: glow('#FFFFFF'), opacity: 0.55 }, k);
    [[0, 0], [-11, -5], [10, -6], [-6, 9], [8, 9], [0, -14], [-15, 6], [15, 4]].forEach(([x, y], i) => E('circle', { cx: x, cy: y, r: 7, fill: i % 2 ? '#E7DAFF' : W_, stroke: C.ethanolDk, 'stroke-width': 1.2 }, k));
  } else if (kind === 'electrostatic') {               // a + and a − charge
    E('circle', { cx: -13, cy: 0, r: 12.5, fill: 'none', stroke: W_, 'stroke-width': 4 }, k); line('M-19,0 L-7,0 M-13,-6 L-13,6', 4);
    E('circle', { cx: 14, cy: 0, r: 12.5, fill: 'none', stroke: W_, 'stroke-width': 4 }, k); line('M8,0 L20,0', 4);
  } else if (kind === 'magnetic') {                    // a bar magnet outline, N | S (the disc behind is red | blue)
    E('rect', { x: -27, y: -13, width: 54, height: 26, rx: 5, fill: 'none', stroke: W_, 'stroke-width': 4 }, k);
    line('M0,-13 L0,13', 3);
    T(k, -13.5, 6.5, 'N', { size: 19, weight: 800, anchor: 'middle', fill: W_ });
    T(k, 13.5, 6.5, 'S', { size: 19, weight: 800, anchor: 'middle', fill: W_ });
  }
  return g;
}

/* ---------- store badge ----------
   const b = enBadge(root, 'kinetic', o); tr(b, x, y);
   o: r (44), label (true: the store's short name, a string to override, false: none), size (label, 26),
      letter (the letter face, default the store's initial K G E C T N E M), ring (true: thin light rim).
   b.set({ flip, glow, label })   flip 0..1 turns the badge over like a coin to its letter face
                                  (the gorillas mnemonic); glow 0..1 a soft halo; label = its opacity (1).
   b.r, b.kind; the label's centre is (0, r + 34). */
function enBadge(parent, kind, o) {
  o = o || {};
  const st = EN.store[kind], r = o.r || 44, g = G(parent);
  const halo = E('circle', { r: r * 1.9, fill: glow(st.color) }, g); op(halo, 0);
  const face = G(g), front = G(face), back = G(face);
  const fill = st.color2 ? _enSplit(st.color, st.color2) : ball(st.color, st.dark);
  [front, back].forEach(side => {
    E('circle', { r, fill, stroke: o.ring === false ? 'none' : 'rgba(255,255,255,0.55)', 'stroke-width': Math.max(2, r * 0.07) }, side);
    if (st.color2) E('circle', { cx: -r * 0.3, cy: -r * 0.32, r: r * 0.42, fill: '#FFFFFF', opacity: 0.18 }, side);
  });
  _enIcon(front, kind, r);
  T(back, 0, r * 0.38, o.letter || st.letter, { size: Math.round(r * 1.08), weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  op(back, 0);
  const lab = o.label === false ? null : T(g, 0, r + 34, typeof o.label === 'string' ? o.label : st.label, { size: o.size || 26, weight: 700, anchor: 'middle', fill: C.ink });
  g.set = s => {
    s = s || {};
    const f = clamp(s.flip || 0), sx = Math.max(0.03, Math.abs(Math.cos(f * Math.PI)));
    _enW(face, 'transform', sx > 0.999 ? '' : `scale(${sx.toFixed(3)} 1)`);
    _enW(front, 'opacity', f < 0.5 ? 1 : 0); _enW(back, 'opacity', f < 0.5 ? 0 : 1);
    _enW(halo, 'opacity', clamp(s.glow || 0));
    if (lab) _enW(lab, 'opacity', s.label === undefined ? 1 : clamp(s.label));
  };
  g.r = r; g.kind = kind;
  g.set({});
  return g;
}

/* ---------- store jar ----------
   const j = enJar(root, 'gravitational', o); tr(j, x, y);   (about 120 x 160, centred)
   o: w (120), h (160), level (0.5), badge (true: its badge on the front, radius w * 0.24), label (true: the
      store's short name below, a string to override, false: none), size (label, 26).
   j.set(level 0..1) fills it;  j.mouth -> [x, y] of the jar's mouth and j.surface(level) -> [x, y] of the
   liquid's surface (both local), for spark paths in and out. */
function enJar(parent, kind, o) {
  o = o || {};
  const st = EN.store[kind], w = o.w || 120, h = o.h || 160, g = G(parent);
  const liq = st.color2 ? _enSplit(st.color, st.color2) : st.color;
  const b = beaker(g, w, h, { marks: false, level: o.level === undefined ? 0.5 : o.level, liquid: liq, opacity: 0.88 });
  if (o.badge !== false) { const bd = enBadge(g, kind, { r: Math.round(w * 0.24), label: false }); tr(bd, 0, h * 0.16); }
  if (o.label !== false) T(g, 0, h / 2 + 36, typeof o.label === 'string' ? o.label : st.label, { size: o.size || 26, weight: 700, anchor: 'middle', fill: C.ink });
  const top = -h / 2 + 18, bottom = h / 2;
  g.set = level => b.set(level);
  g.mouth = [0, -h / 2];
  g.surface = level => [0, bottom - (bottom - top) * clamp(level)];
  g.w = w; g.h = h; g.kind = kind;
  return g;
}

/* ---------- energy sparks along a path ----------
   const f = enSparkFlow(root, [[x1, y1], [x2, y2], ...], o);     (points in the parent's coordinates)
   o: n (6 sparks), r (10), color (EN.useful; EN.wasted for wasted energy), speed (160 px/s), wobble (0: px
      of sideways sway), seed.
   f.set(t, amount)   a steady stream moving first point -> last; amount 0..1 how many sparks are out
                      (0 none, 1 all n), so a flow can start, thin out and stop.
   f.batch(p)         instead, one batch: as p goes 0 -> 1 each spark leaves the start in turn and arrives at
                      the end (use for "sparks pour from one jar into the other").
   f.length (px). */
function enSparkFlow(parent, pts, o) {
  o = o || {};
  const g = G(parent), n = o.n || 6, path = _enPoly(pts), rr = rng(o.seed || 5), sp = [];
  for (let k = 0; k < n; k++) sp.push({ el: spark(g, o.r || 10, { color: o.color || EN.useful, seed: k + 1 }), ph: rr() * TAU, j: rr() * 2 - 1 });
  const place = (q, s, t, vis) => {
    const a = path.at(s), wob = (o.wobble || 0) * Math.sin(t * 3 + q.ph);
    tr(q.el, a.x - a.dy * wob, a.y + a.dx * wob);
    q.el.upd(t); op(q.el, vis);
  };
  g.set = (t, amount) => {
    t = t || 0; const am = amount === undefined ? 1 : clamp(amount), v = (o.speed || 160) / (path.L || 1);
    sp.forEach((q, k) => {
      const f = ((t * v + k / n) % 1 + 1) % 1, on = clamp(am * n - k);
      place(q, f * path.L, t, on * Math.min(1, f * 8, (1 - f) * 8));
    });
  };
  g.batch = p => {
    p = clamp(p);
    sp.forEach((q, k) => {
      const f = clamp((p - k * 0.5 / n) / 0.5);
      place(q, ease(f) * path.L, p * 4, f > 0 && f < 1 ? Math.min(1, f * 6, (1 - f) * 6) : 0);
    });
  };
  g.length = path.L;
  g.set(0, 0);
  return g;
}

/* ---------- transfer pathways ----------
   const pw = enPathway(root, 'elec', x1, y1, x2, y2, o);     (from the giving store to the receiving one)
   kind 'mech'  a white arrow pushed along by a hand (a force)
        'elec'  a kit wire with moving yellow current dots and a white arrowhead
        'heat'  an orange arrow carrying heatWaves()
        'rad'   a travelling sine wave (kit sineWave's stroke) that tapers into an arrowhead: o.wave 'light'
                (yellow, default), 'ir' (orange), 'sound' (white, longer waves)
   o: label (true: 'mechanically' / 'electrically' / 'by heating' / 'by radiation'; a string; false: none),
      side (1: label below the line, -1: above), width, amp and wl (rad), speed (elec dots px/s, rad waves/s).
   pw.set(p) draws it in from the start (0..1); pw.upd(t) runs its motion (call every frame). */
function enPathway(parent, kind, x1, y1, x2, y2, o) {
  o = o || {};
  const g = G(parent), ang = Math.atan2(y2 - y1, x2 - x1), deg = ang * 180 / Math.PI, cs = Math.cos(ang), sn = Math.sin(ang);
  const len = Math.hypot(x2 - x1, y2 - y1), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  let draw = () => {}, anim = () => {};
  const head = (col, s) => E('path', { d: `M0,0 L${-s},${-s * 0.62} L${-s * 0.72},0 L${-s},${s * 0.62} Z`, fill: col, 'stroke-linejoin': 'round', transform: `translate(${x2} ${y2}) rotate(${deg.toFixed(2)})` }, g);
  if (kind === 'mech') {
    const a = arrow(g, x1, y1, x2, y2, { color: '#FFFFFF', width: o.width || 8 });
    const hand = _enHand(g);
    draw = p => { a.set(p); op(hand, clamp(p * 5)); };
    anim = t => { const push = 7 * wave(t, 1.1); tr(hand, x1 - cs * (28 - push), y1 - sn * (28 - push), 1.15, deg); };
  } else if (kind === 'elec') {
    const hs = (o.width || 6) * 3.6, w = wire(g, [[x1, y1], [x2 - cs * hs * 0.7, y2 - sn * hs * 0.7]], { width: o.width || 6 });
    const line = w.querySelector('path'); line.setAttribute('pathLength', 1); line.setAttribute('stroke-dasharray', '1 1');
    const hd = head(WIRE, hs);
    draw = p => { line.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); w.set(clamp((p - 0.85) / 0.15)); op(hd, clamp((p - 0.8) / 0.2)); };
    anim = t => w.upd(t, o.speed || 70);
  } else if (kind === 'heat') {
    const a = arrow(g, x1, y1, x2, y2, { color: EN.wasted, width: o.width || 8 });
    const hw = heatWaves(g, { n: 3, h: 46, spacing: 17, color: EN.wasted, width: 4 }); tr(hw, mx, my - 14);
    draw = p => { a.set(p); op(hw, clamp((p - 0.4) * 2.5)); };
    anim = t => hw.upd(t);
  } else if (kind === 'rad') {
    // the same stroke as kit sineWave, but the amplitude tapers to 0 at both ends so the wave always lands on its head
    const col = EN.wave[o.wave || 'light'], hs = 22, wg = G(g); tr(wg, x1, y1, 1, deg);
    const wl = o.wl || (o.wave === 'sound' ? 72 : 44), amp = o.amp || 14, wlen = Math.max(20, len - hs * 0.7);
    const line = E('path', { fill: 'none', stroke: col, 'stroke-width': o.width || 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, wg);
    const shape = ph => {
      let d = '';
      for (let x = 0; x < wlen; x += 4) { const env = Math.min(1, x / (wl * 0.5), (wlen - x) / (wl * 0.75)); d += (x ? ' L' : 'M') + x + ',' + (-amp * env * Math.sin(TAU * (x / wl - ph))).toFixed(1); }
      return d + ` L${wlen.toFixed(1)},0`;
    };
    const hd = head(col, hs);
    draw = p => { line.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); op(hd, clamp((p - 0.8) / 0.2)); };
    anim = t => line.setAttribute('d', shape(t * (o.speed || 1.4)));
  }
  if (o.label !== false) {
    const side = o.side || 1, off = kind === 'rad' ? 50 : 42;
    const c = chip(g, typeof o.label === 'string' ? o.label : EN.pathLabel[kind], { size: 24, fill: C.card, stroke: kind === 'heat' ? EN.wasted : kind === 'rad' ? EN.wave[o.wave || 'light'] : kind === 'elec' ? C.energy : '#FFFFFF', sw: 2.5 });
    tr(c, mx - sn * off * side, my + cs * off * side);
    const d0 = draw; draw = p => { d0(p); op(c, clamp((p - 0.6) * 2.5)); };
  }
  g.set = p => draw(clamp(p));
  g.upd = t => anim(t || 0);
  g.kind = kind;
  g.upd(0); g.set(1);
  return g;
}
/* a pushing hand (mitten) pointing +x, about 50 x 36, palm front at x = +16 */
function _enHand(parent) {
  const g = G(parent);
  E('rect', { x: -32, y: -13, width: 16, height: 26, rx: 4, fill: C.air, stroke: '#5E9CC4', 'stroke-width': 2 }, g);
  E('path', { d: 'M-18,-15 L4,-15 Q17,-15 17,-3 L17,3 Q17,15 4,15 L-18,15 Z', fill: ball('#F0C4A0', '#C98E62'), stroke: '#B5774C', 'stroke-width': 2 }, g);
  E('path', { d: 'M-8,-15 Q-6,-25 4,-23 Q10,-21 6,-15', fill: '#F0C4A0', stroke: '#B5774C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M9,-7 L16,-7 M9,0 L17,0 M9,7 L16,7', stroke: '#B5774C', 'stroke-width': 2, 'stroke-linecap': 'round' }, g);
  return g;
}

/* ---------- energy flow diagram ----------
   const fc = enFlowChain(root, [{ kind: 'gravitational' }, { kind: 'kinetic' }, { kind: 'thermal', text: 'thermal + sound' }], o);
   tr(fc, 600, 400);   centred on the origin (fc.w wide, fc.h tall)
   items: kind (a store: box edged in its colour; text defaults to the store's full name), or just text.
   o: size (26), h (box height 70), gap (arrow length 70), pad (22), arrow ('#FFFFFF').
   fc.set(p): p from 0 to items.length; box k pops in as p goes k -> k + 1, and the arrow after it draws in
   at the end of that step.  fc.boxes[k] -> { cx, w } (local, for labels or badges). */
function enFlowChain(parent, items, o) {
  o = o || {};
  const size = o.size || 26, bh = o.h || 70, gap = o.gap || 70, pad = o.pad || 22;
  const g = G(parent), inner = G(g), boxes = [], arrows = [];
  let x = 0;
  items.forEach((it, k) => {
    const st = it.kind ? EN.store[it.kind] : null, text = it.text || (st ? st.name : '');
    const w = Math.max(o.minW || 0, Math.ceil(textWidth(text, size, FD, 700)) + pad * 2), bg = G(inner);
    E('rect', { x: -w / 2, y: -bh / 2, width: w, height: bh, rx: 18, fill: C.card2, stroke: st ? st.color : C.line, 'stroke-width': 4 }, bg);
    T(bg, 0, size * 0.36, text, { size, weight: 700, anchor: 'middle', fill: C.ink });
    boxes.push({ g: bg, cx: x + w / 2, w });
    x += w;
    if (k < items.length - 1) { arrows.push(arrow(inner, x + 10, 0, x + gap - 8, 0, { color: o.arrow || '#FFFFFF', width: 5 })); x += gap; }
  });
  tr(inner, -x / 2, 0);
  boxes.forEach(b => { b.cx -= x / 2; b.cx0 = b.cx + x / 2; });
  g.w = x; g.h = bh; g.boxes = boxes;
  g.set = p => {
    boxes.forEach((b, k) => { const q = clamp(p - k); _enW(b.g, 'opacity', q); _enW(b.g, 'transform', `translate(${b.cx0.toFixed(1)} 0) scale(${(0.8 + 0.2 * pop(q)).toFixed(3)})`); });
    arrows.forEach((a, k) => { const q = clamp((p - k - 0.6) / 0.4); a.set(q); op(a, q > 0 ? 1 : 0); });
  };
  g.set(items.length);
  return g;
}

/* ---------- dissipation ----------
   const d = enDissipate(root, 700, 380, o); tr(d, x, y);     (top-left corner at the origin)
   o: n (26 sparks), r (9), color (EN.wasted), from ([w/2, h/2], where they start, local), tint (0.16: how
      warm the area looks once it has all spread), end (0.45: final spark size), fade (0.3: final
      opacity), seed, rx (corner radius of the tint).
   d.set(p, t): p 0 -> 1 spreads the sparks from the start point out over the whole area, smaller and
   fainter, while the area takes a faint warm tint; t keeps them drifting gently. */
function enDissipate(parent, w, h, o) {
  o = o || {};
  const g = G(parent), n = o.n || 26, rr = rng(o.seed || 31), from = o.from || [w / 2, h / 2], col = o.color || EN.wasted;
  const tint = E('rect', { x: 0, y: 0, width: w, height: h, rx: o.rx === undefined ? 18 : o.rx, fill: col }, g); op(tint, 0);
  const ps = [];
  for (let k = 0; k < n; k++) {
    const a = rr() * TAU, d0 = rr() * 26;
    ps.push({ el: spark(g, o.r || 9, { color: col, seed: k + 3 }), s: [from[0] + Math.cos(a) * d0, from[1] + Math.sin(a) * d0], e: [w * (0.04 + 0.92 * rr()), h * (0.06 + 0.88 * rr())], ph: rr() * TAU });
  }
  g.set = (p, t) => {
    p = clamp(p); t = t || 0;
    const e = ease(p);
    ps.forEach(q => {
      const x = lerp(q.s[0], q.e[0], e) + Math.sin(t * 0.8 + q.ph) * 7 * e, y = lerp(q.s[1], q.e[1], e) + Math.cos(t * 0.7 + q.ph) * 6 * e;
      tr(q.el, x, y, lerp(1, o.end || 0.45, e)); q.el.upd(t); op(q.el, lerp(1, o.fade || 0.3, e));
    });
    op(tint, (o.tint === undefined ? 0.16 : o.tint) * e);
  };
  g.set(0, 0);
  return g;
}

/* ---------- Sankey diagram ----------
   const sk = enSankey(root, o); tr(sk, 140, 300);     input band's left end at the origin, centred on y = 0
   o: width (130: the input band, = all the energy supplied), useful (0.75: fraction), len (640: to the
      useful arrow's tip), split (len * 0.38: where the wasted branch leaves), drop (150: how far the wasted
      branch runs down after its bend), r (40: inner radius of the bend), labels ({ in, useful, wasted }:
      text at each end; '' for none; defaults 'energy in', 'useful', 'wasted').
   sk.set({ grow, split, useful, labels })
     grow 0..1    the input band grows from the left to the split point
     split 0..1   the useful band carries straight on while the wasted branch bends away downwards
     useful       change the useful fraction (0..1) on the fly
     labels 0..1  opacity of the three labels (each shows once its part is drawn)
   sk.geo -> { width, len, split, yTop, ySplit, yBottom, wasteX, wasteEnd } (local) for brackets and notes. */
function enSankey(parent, o) {
  o = o || {};
  const g = G(parent), bw = o.width || 130, len = o.len || 640, sx = o.split || Math.round(len * 0.38), drop = o.drop || 150, ri = Math.max(10, o.r || 40);
  const hd = Math.max(30, bw * 0.28), pad = 14;
  const inBand = E('path', { fill: EN.useful }, g);
  const useBand = E('path', { fill: EN.useful }, g);
  const wasteBand = E('path', { fill: EN.wasted }, g);
  const lab = o.labels || {};
  const mk = (txt, col, anchor) => T(g, 0, 0, txt, { size: 28, weight: 700, anchor, fill: col });
  const L = { in: mk(lab.in === undefined ? 'energy in' : lab.in, C.ink, 'middle'), useful: mk(lab.useful === undefined ? 'useful' : lab.useful, EN.useful, 'start'), wasted: mk(lab.wasted === undefined ? 'wasted' : lab.wasted, EN.wasted, 'start') };
  let u = o.useful === undefined ? 0.75 : o.useful;
  const f1 = v => v.toFixed(1);
  g.set = s => {
    s = s || {};
    if (s.useful !== undefined) u = clamp(s.useful);
    const grow = clamp(s.grow === undefined ? 1 : s.grow), sp = clamp(s.split === undefined ? 1 : s.split), labs = s.labels === undefined ? 1 : clamp(s.labels);
    const yT = -bw / 2, yB = bw / 2, yS = yT + u * bw, ww = yB - yS, yC = yB + ri, ro = ri + ww;
    // input band (and its split edge stays square)
    const xi = sx * grow;
    _enW(inBand, 'd', xi > 0.5 ? `M0,${f1(yT)} L${f1(xi)},${f1(yT)} L${f1(xi)},${f1(yB)} L0,${f1(yB)} Z` : 'M0,0');
    _enW(inBand, 'opacity', xi > 0.5 ? 1 : 0);
    // useful band: straight on, arrowhead at its tip
    const su = clamp(sp * 1.15), xu = sx + (len - hd - sx) * su;
    if (sp > 0 && u > 0.001) {
      const tip = xu + hd * clamp(su * 6);
      _enW(useBand, 'd', `M${sx - 1},${f1(yT)} L${f1(xu)},${f1(yT)} L${f1(xu)},${f1(yT - pad)} L${f1(tip)},${f1((yT + yS) / 2)} L${f1(xu)},${f1(yS + pad)} L${f1(xu)},${f1(yS)} L${sx - 1},${f1(yS)} Z`);
      _enW(useBand, 'opacity', 1);
    } else _enW(useBand, 'opacity', 0);
    // wasted branch: bends down (sweep 0 -> 90 degrees), then runs straight down to an arrowhead
    if (sp > 0 && ww > 0.5) {
      const th = Math.PI / 2 * clamp(sp * 2), l2 = drop * clamp(sp * 2 - 1);
      const oE = [sx + ro * Math.sin(th), yC - ro * Math.cos(th)], iE = [sx + ri * Math.sin(th), yC - ri * Math.cos(th)];
      let d = `M${sx - 1},${f1(yS)} L${sx},${f1(yS)} A${f1(ro)},${f1(ro)} 0 0 1 ${f1(oE[0])},${f1(oE[1])}`;
      if (l2 > 0.5) {
        const yE = yC + l2, hx = (ri + ro) / 2 + sx, tipY = yE + hd * clamp((sp * 2 - 1) * 6);
        d += ` L${f1(sx + ro)},${f1(yE)} L${f1(sx + ro + pad)},${f1(yE)} L${f1(hx)},${f1(tipY)} L${f1(sx + ri - pad)},${f1(yE)} L${f1(sx + ri)},${f1(yE)}`;
      } else d += ` L${f1(iE[0])},${f1(iE[1])}`;
      d += ` L${f1(iE[0])},${f1(iE[1])} A${f1(ri)},${f1(ri)} 0 0 0 ${sx},${f1(yB)} L${sx - 1},${f1(yB)} Z`;
      _enW(wasteBand, 'd', d); _enW(wasteBand, 'opacity', 1);
    } else _enW(wasteBand, 'opacity', 0);
    // labels
    attr(L.in, 'x', sx * 0.5); attr(L.in, 'y', yT - 22); op(L.in, labs * clamp(grow * 3 - 2));
    attr(L.useful, 'x', len + 16); attr(L.useful, 'y', (yT + yS) / 2 + 10); op(L.useful, labs * clamp(sp * 4 - 3));
    attr(L.wasted, 'x', sx + ro + pad + 14); attr(L.wasted, 'y', yC + drop * 0.62); op(L.wasted, labs * clamp(sp * 4 - 3));
    g.geo = { width: bw, len, split: sx, yTop: yT, ySplit: yS, yBottom: yB, wasteX: sx + (ri + ro) / 2, wasteEnd: yC + drop + hd };
  };
  g.set({});
  return g;
}

/* ---------- a 10 x 10 grid for percentages ----------
   const gr = enGrid100(root, o); tr(gr, x, y);     top-left corner at the origin, gr.w x gr.h
   o: cell (24), gap (5).
   gr.set({ useful, wasted }): the first `useful` squares (0..100, reading order) turn yellow, the next
   `wasted` squares orange, the rest stay empty; fractional values fade the next square in. */
function enGrid100(parent, o) {
  o = o || {};
  const cell = o.cell || 24, gap = o.gap === undefined ? 5 : o.gap, g = G(parent), sq = [];
  for (let i = 0; i < 100; i++) sq.push(E('rect', { x: (i % 10) * (cell + gap), y: Math.floor(i / 10) * (cell + gap), width: cell, height: cell, rx: Math.max(2, cell * 0.18), fill: C.card2, stroke: C.line, 'stroke-width': 1.5 }, g));
  g.w = g.h = 10 * cell + 9 * gap;
  g.set = s => {
    s = s || {};
    const u = clamp(s.useful || 0, 0, 100), uw = Math.ceil(u - 1e-6), wd = clamp(s.wasted || 0, 0, 100 - uw);
    sq.forEach((r, i) => {
      const pu = clamp(u - i), pw = clamp(wd - (i - uw));
      const fill = pu > 0 ? _enMix(C.card2, EN.useful, pu) : pw > 0 ? _enMix(C.card2, EN.wasted, pw) : C.card2;
      _enW(r, 'fill', fill);
      _enW(r, 'stroke', pu > 0.5 ? '#C9A800' : pw > 0.5 ? C.heatDk : C.line);
    });
  };
  g.set({});
  return g;
}

/* ---------- light bulbs ----------
   const b = enBulb(root, 'filament' | 'led', o); tr(b, x, y);    about 100 x 150 at s = 1, glass centre at (0, -30)
   o: s (scale, 1), on (0).
   b.set(on 0..1): the filament glows orange-white with a warm yellow halo; the LED's chip glows white with a
   cooler halo. (Add heatWaves() over a filament bulb for its waste heat.) */
function enBulb(parent, kind, o) {
  o = o || {};
  const g = G(parent), k = G(g); tr(k, 0, 0, o.s || 1);
  const led = kind === 'led';
  const halo = E('circle', { cx: 0, cy: -32, r: 120, fill: glow(led ? '#FFF7C2' : C.energy) }, k); op(halo, 0);
  const glassD = 'M-27,30 C-27,12 -50,-2 -50,-32 C-50,-62 -27,-82 0,-82 C27,-82 50,-62 50,-32 C50,-2 27,12 27,30 Z';
  const glass = E('path', { d: glassD, fill: led ? 'rgba(245,250,255,0.30)' : 'rgba(210,235,250,0.14)', stroke: '#DCEBF5', 'stroke-width': 3.5 }, k);
  const warm = E('path', { d: glassD, fill: led ? '#FFFBE6' : '#FFD27A' }, k); op(warm, 0);
  let fil = null, chipEl = null;
  if (led) {
    E('rect', { x: -22, y: 6, width: 44, height: 24, rx: 4, fill: '#E9EEF2', stroke: '#AEBAC4', 'stroke-width': 2 }, k);
    chipEl = E('rect', { x: -15, y: -36, width: 30, height: 14, rx: 3, fill: '#D7DEE4', stroke: '#9AA6B2', 'stroke-width': 2 }, k);
    E('path', { d: 'M-8,-22 L-8,6 M8,-22 L8,6', stroke: '#9AA6B2', 'stroke-width': 3 }, k);
  } else {
    E('path', { d: 'M-9,30 L-12,-26 M9,30 L12,-26', fill: 'none', stroke: '#8A95A0', 'stroke-width': 2.5 }, k);
    fil = E('path', { d: 'M-12,-26 L-8,-34 L-4,-26 L0,-34 L4,-26 L8,-34 L12,-26', fill: 'none', stroke: '#B9845A', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, k);
  }
  E('rect', { x: -27, y: 30, width: 54, height: 32, rx: 5, fill: ball('#B5C0CA', '#5D6B78'), stroke: '#4B5865', 'stroke-width': 2 }, k);
  [38, 46, 54].forEach(y => E('line', { x1: -26, y1: y, x2: 26, y2: y + 3, stroke: '#4B5865', 'stroke-width': 2 }, k));
  E('path', { d: 'M-12,62 L12,62 L6,72 L-6,72 Z', fill: '#3A444E' }, k);
  g.set = on => {
    on = clamp(on);
    op(halo, on * (led ? 0.75 : 0.9)); op(warm, on * (led ? 0.55 : 0.45));
    if (fil) { fil.setAttribute('stroke', _enMix('#B9845A', '#FFF4C8', on)); fil.setAttribute('stroke-width', (3 + 1.5 * on).toFixed(2)); }
    if (chipEl) chipEl.setAttribute('fill', _enMix('#D7DEE4', '#FFFFFF', on));
    glass.setAttribute('stroke', _enMix('#DCEBF5', '#FFF4C8', on));
  };
  g.kind = kind;
  g.set(o.on || 0);
  return g;
}

/* ---------- energy resources ----------
   const r = enResource(root, 'wind', o); tr(r, x, y);    each icon about 110 x 100, centred on the origin
   kinds: EN.nonRenewable (coal, oil, gas, uranium) and EN.renewable (solar, wind, hydro, tidal, wave,
   geothermal, biomass); EN.resName[kind] is its name.
   o: label (true: the name 34 px below the icon's foot at y = 50, a string to override, false: none), size (26).
   r.upd(t): idle motion (turbine blades, waves, tide, flame, steam); call every frame or leave still. */
function enResource(parent, kind, o) {
  o = o || {};
  const g = G(parent), k = G(g);
  let upd = () => {};
  const P = (d, fill, stroke, sw, extra) => E('path', Object.assign({ d, fill: fill || 'none', stroke: stroke || 'none', 'stroke-width': sw || 0, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, extra || {}), k);
  if (kind === 'coal') {
    P('M-46,40 L-40,10 L-18,0 L-4,16 L-8,40 Z', '#2B3035', '#5C6670', 2.5);
    P('M-10,40 L-6,6 L14,-10 L36,4 L42,40 Z', '#24292D', '#5C6670', 2.5);
    P('M-26,10 L-12,-20 L8,-26 L14,-8 L-4,16 Z', '#33393F', '#6D7781', 2.5);
    P('M-12,-20 L8,-26 L2,-12 Z', '#7D8893'); P('M14,-10 L36,4 L18,4 Z', '#58626C'); P('M-40,10 L-18,0 L-30,18 Z', '#58626C');
  } else if (kind === 'oil') {
    E('rect', { x: -32, y: -44, width: 64, height: 88, rx: 9, fill: ball('#4A5B69', '#26323C'), stroke: '#8DA2B3', 'stroke-width': 2.5 }, k);
    [-18, 18].forEach(y => E('line', { x1: -32, y1: y, x2: 32, y2: y, stroke: '#8DA2B3', 'stroke-width': 3 }, k));
    P('M0,-14 C10,-2 15,6 15,12 C15,21 8,27 0,27 C-8,27 -15,21 -15,12 C-15,6 -10,-2 0,-14 Z', '#0C0F12', '#C9D6DF', 2);
    E('ellipse', { cx: -5, cy: 13, rx: 3, ry: 5, fill: '#FFFFFF', opacity: 0.5 }, k);
  } else if (kind === 'gas') {
    E('rect', { x: -40, y: 34, width: 80, height: 12, rx: 6, fill: ball('#7B8894', '#3E4954'), stroke: '#9AA6B2', 'stroke-width': 2 }, k);
    const fl = G(k);
    E('path', { d: 'M0,-44 C16,-20 28,-6 26,12 C24,26 12,34 0,34 C-12,34 -24,26 -26,12 C-28,-6 -16,-20 0,-44 Z', fill: '#3B82F6', stroke: '#9CC3FF', 'stroke-width': 2 }, fl);
    E('path', { d: 'M0,-14 C8,-2 13,6 12,16 C11,26 6,30 0,30 C-6,30 -11,26 -12,16 C-13,6 -8,-2 0,-14 Z', fill: '#BFE0FF' }, fl);
    upd = t => fl.setAttribute('transform', `translate(0 34) scale(${(1 + 0.03 * Math.sin(t * 9)).toFixed(3)} ${(1 + 0.06 * Math.sin(t * 7 + 1)).toFixed(3)}) translate(0 -34)`);
  } else if (kind === 'uranium') {
    // violet, the nuclear store's colour (green would read as gravitational or renewable)
    E('circle', { r: 58, fill: glow(C.ethanol), opacity: 0.55 }, k);
    E('rect', { x: -15, y: -46, width: 30, height: 92, rx: 13, fill: ball('#DCCFFF', C.ethanolDk), stroke: '#F1EBFF', 'stroke-width': 2.5 }, k);
    [-24, -2, 20].forEach(y => E('line', { x1: -14, y1: y, x2: 14, y2: y, stroke: C.ethanolDk, 'stroke-width': 3 }, k));
  } else if (kind === 'solar') {
    P('M-50,16 L38,16 L52,-24 L-36,-24 Z', '#1D3D78', '#A9C8FF', 2.5);
    for (let i = 1; i < 4; i++) { const f = i / 4; P(`M${-50 + 88 * f},16 L${-36 + 88 * f},-24`, null, '#7FA6E8', 1.5); }
    P('M-43,-4 L45,-4', null, '#7FA6E8', 1.5);
    P('M-30,-18 L-10,-18', null, '#FFFFFF', 3, { opacity: 0.45 });
    P('M0,16 L0,40 M-18,44 L18,44', null, '#9AA6B2', 4);
  } else if (kind === 'wind') {
    P('M-4,46 L-1.8,-26 L1.8,-26 L4,46 Z', '#E8EEF2', '#AEBAC4', 1.5);
    const rot = G(k); tr(rot, 0, -28);
    for (let i = 0; i < 3; i++) E('path', { d: 'M0,0 C5,-6 6,-26 2,-44 C-1,-46 -3,-44 -3,-40 C-4,-24 -4,-8 0,0 Z', fill: '#F4F7FA', stroke: '#AEBAC4', 'stroke-width': 1.5, transform: `rotate(${i * 120})` }, rot);
    E('circle', { cx: 0, cy: -28, r: 5, fill: '#C9D3DC', stroke: '#8FA3B3', 'stroke-width': 1.5 }, k);
    upd = t => tr(rot, 0, -28, 1, (t * 70) % 360);
  } else if (kind === 'hydro') {
    E('rect', { x: -52, y: -24, width: 46, height: 64, fill: C.water, opacity: 0.85 }, k);
    P('M-52,-24 L-6,-24', null, '#BDEBFA', 3);
    P('M-10,-38 L8,-38 L26,40 L-10,40 Z', ball('#B5C0CA', '#6B7884'), '#4B5865', 2);
    const jet = P('M20,24 C34,26 40,32 44,40', null, '#9FE3F7', 6, { 'stroke-dasharray': '10 6' });
    upd = t => jet.setAttribute('stroke-dashoffset', (-(t * 40) % 16).toFixed(1));
  } else if (kind === 'tidal') {
    E('path', { d: 'M8,-40 A16,16 0 1 0 24,-14 A12,12 0 1 1 8,-40 Z', fill: '#F4F1DE' }, k);
    const sea = E('path', { fill: C.water, opacity: 0.85 }, k);
    P('M-26,-30 L-26,8 M-34,-20 L-26,-32 L-18,-20 M-34,-2 L-26,10 L-18,-2', null, '#FFFFFF', 4);
    upd = t => {
      const lv = 8 + 5 * Math.sin(t * 1.2); let d = `M-52,46 L-52,${lv}`;
      for (let x = -52; x <= 52; x += 8) d += ` L${x},${(lv + 3 * Math.sin(x * 0.12 + t * 2)).toFixed(1)}`;
      sea.setAttribute('d', d + ' L52,46 Z');
    };
  } else if (kind === 'wave') {
    const w1 = P('', null, C.water, 6), w2 = P('', null, '#BDEBFA', 4);
    const buoy = G(k);
    E('rect', { x: -7, y: -20, width: 14, height: 20, rx: 4, fill: C.glucose, stroke: '#B57B12', 'stroke-width': 2 }, buoy);
    E('line', { x1: 0, y1: -20, x2: 0, y2: -32, stroke: '#C9D3DC', 'stroke-width': 2.5 }, buoy);
    upd = t => {
      const yAt = (x, amp, y0, ph) => y0 - amp * Math.sin(x * 0.09 - t * 2.4 + ph);
      const line = (amp, y0, ph) => { let d = ''; for (let x = -52; x <= 52; x += 4) d += (d ? ' L' : 'M') + x + ',' + yAt(x, amp, y0, ph).toFixed(1); return d; };
      w1.setAttribute('d', line(12, 0, 0)); w2.setAttribute('d', line(8, 24, 1.3));
      tr(buoy, 0, yAt(0, 12, 0, 0) + 3);
    };
  } else if (kind === 'geothermal') {
    E('rect', { x: -52, y: -4, width: 104, height: 50, rx: 4, fill: '#6B4A33' }, k);
    E('rect', { x: -52, y: 24, width: 104, height: 22, rx: 4, fill: linGrad('#FF8A3D', '#E8424F', true) }, k);
    E('rect', { x: -6, y: -14, width: 12, height: 42, fill: '#9AA6B2', stroke: '#5D6B78', 'stroke-width': 2 }, k);
    const puffs = [0, 1, 2].map(() => E('circle', { r: 9, fill: '#F2F7FA' }, k));
    upd = t => puffs.forEach((pf, i) => { const q = (t * 0.45 + i / 3) % 1; attr(pf, 'cx', 4 * Math.sin(q * 6 + i)); attr(pf, 'cy', -18 - q * 30); attr(pf, 'r', 7 + q * 9); pf.style.opacity = (0.85 * (1 - q)).toFixed(3); });
  } else if (kind === 'biomass') {
    [[-20, 22], [20, 22], [0, -8]].forEach(([x, y]) => {
      E('circle', { cx: x, cy: y, r: 21, fill: ball('#C8955F', '#7A5230'), stroke: '#5A3B22', 'stroke-width': 2.5 }, k);
      E('circle', { cx: x, cy: y, r: 13, fill: 'none', stroke: '#8A5E36', 'stroke-width': 2 }, k);
      E('circle', { cx: x, cy: y, r: 5, fill: '#8A5E36' }, k);
    });
    const lf = leaf(k, 0.24); tr(lf, 22, -30, 1, -35);
  }
  upd(0);
  if (o.label !== false) T(g, 0, 50 + 34, typeof o.label === 'string' ? o.label : (EN.resName[kind] || kind), { size: o.size || 26, weight: 700, anchor: 'middle', fill: C.ink });
  g.upd = t => upd(t || 0);
  g.kind = kind;
  return g;
}

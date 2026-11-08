/* ==========================================================================
   lib.js: shared helpers and art for the animated Respiration lesson.

   The stage is an SVG, viewBox 0 0 1200 750, always dark (it is a "screen",
   like a video player, in both page themes). Scenes draw with the palette C,
   the fonts FD (display) / FB (body), and the art primitives below, so every
   chapter looks like part of one film.

   Every primitive returns a <g> drawn around its own origin (0,0); place it
   with tr(g, x, y, scale, rotateDeg). Animated primitives also get g.upd(t)
   or g.set(v). Rendering is a pure function of time: never keep state that
   depends on the previous frame, so scrubbing and seeking always work.
   ========================================================================== */

const SVGNS = 'http://www.w3.org/2000/svg';
const W = 1200, H = 750;
const FD = "'Fredoka', 'Nunito', 'Trebuchet MS', system-ui, sans-serif";            // display: titles, labels
const FB = "'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible', system-ui, sans-serif"; // body: small notes

const C = {
  bg0: '#0A1B27', bg1: '#0F2C3A', card: '#143646', card2: '#1B4457', line: '#2C5468',
  ink: '#F2F7FA', muted: '#A4BCCB', faint: '#62808F',
  glucose: '#FFC247', glucoseDk: '#B57B12', glucoseLt: '#FFE29A',
  oxygen: '#FF6B5C', oxygenDk: '#B5372D',          // O atoms and O2 (red, as in molecule kits)
  carbon: '#8F9CAB', carbonDk: '#57636F',          // C atoms (grey)
  hydrogen: '#F4F7FA', hydrogenDk: '#A9B5C0',      // H atoms (white)
  co2: '#B9C9D8',                                  // carbon dioxide as a word/label colour
  water: '#4CC9F0', waterDk: '#1D84A6',
  energy: '#FFE45C', energyLt: '#FFF7C2',
  heat: '#FF8A3D', heatDk: '#C25516',
  lactic: '#FF5FA2', lacticDk: '#B3326F',
  ethanol: '#B48CFF', ethanolDk: '#7550C4',
  mito: '#FF9466', mitoDk: '#C2453A', mitoIn: '#FFD6BF',
  chloro: '#5BD27A', chloroDk: '#22844A',
  cell: '#F7A8C8', cellDk: '#C25A88',              // animal cell membrane
  plant: '#5BD27A', plantDk: '#2C8C4C', stem: '#3FA463', soil: '#6B4A33',
  blood: '#E8424F', air: '#9FD8FF',
  good: '#56D69B', bad: '#FF6070',
};

/* ---------- DOM ---------- */
function E(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  if (attrs) for (const k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function G(parent, attrs) { return E('g', attrs || {}, parent); }
/* Static art from markup: frag(parent, '<circle r="4"/>...') returns a <g>. */
function frag(parent, markup, attrs) { const g = G(parent, attrs); g.innerHTML = markup; return g; }

/* Text. o: size, weight, fill, anchor ('start'|'middle'|'end'), font (FD|FB), ls (letter-spacing),
   opacity, lh (line height for '\n' lines), boldFill. "**word**" renders bold. */
function T(parent, x, y, str, o) {
  o = o || {};
  const size = o.size || 32;
  const t = E('text', {
    x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink,
    'text-anchor': o.anchor || 'start', 'font-family': o.font || FD,
    'letter-spacing': o.ls, opacity: o.opacity,
  }, parent);
  const lines = String(str).split('\n');
  lines.forEach((ln, i) => {
    const row = lines.length > 1 ? E('tspan', { x, dy: i === 0 ? 0 : (o.lh || size * 1.22) }, t) : t;
    ln.split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      if (seg.startsWith('**')) E('tspan', { 'font-weight': 800, fill: o.boldFill }, row).textContent = seg.slice(2, -2);
      else if (row === t && lines.length === 1 && !/\*\*/.test(ln)) t.textContent = seg;
      else E('tspan', {}, row).textContent = seg;
    });
  });
  return t;
}
function setText(t, str) { t.textContent = str; }

/* Width of a string in the stage's fonts (fonts are loaded before scenes build). */
let _measure = null;
function textWidth(str, size, font, weight) {
  if (!_measure) {
    const svg = document.getElementById('stage');
    _measure = E('text', { x: -9999, y: -9999, 'aria-hidden': 'true' }, svg);
  }
  _measure.setAttribute('font-size', size || 32);
  _measure.setAttribute('font-family', font || FD);
  _measure.setAttribute('font-weight', weight || 700);
  _measure.textContent = String(str).replace(/\*\*/g, '');
  let w = 0;
  try { w = _measure.getComputedTextLength(); } catch (e) { w = 0; }
  return w || String(str).length * (size || 32) * 0.56;
}

/* ---------- transform / visibility ---------- */
function tr(el, x, y, s, r) {
  let v = `translate(${(+x).toFixed(2)} ${(+y).toFixed(2)})`;
  if (r) v += ` rotate(${(+r).toFixed(2)})`;
  if (s !== undefined && s !== 1) v += ` scale(${typeof s === 'number' ? s.toFixed(4) : s})`;
  el.setAttribute('transform', v);
}
/* opacity 0..1; at 0 the element is display:none so it costs nothing to paint */
function op(el, v) {
  v = v < 0 ? 0 : v > 1 ? 1 : v;
  if (v <= 0.002) { if (el.style.display !== 'none') el.style.display = 'none'; return; }
  if (el.style.display === 'none') el.style.display = '';
  el.style.opacity = v >= 0.998 ? '' : v.toFixed(3);
}
function attr(el, k, v) { el.setAttribute(k, typeof v === 'number' ? +v.toFixed(3) : v); }

/* ---------- maths / timing ---------- */
const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const lerp = (a, b, p) => a + (b - a) * p;
const ease = p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);   // smooth in-out
const easeOut = p => 1 - Math.pow(1 - p, 3);
const easeIn = p => p * p * p;
const pop = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }; // overshoot
const linear = p => p;
/* progress of t through [t0, t0+dur], eased; 0 before, 1 after */
function P(t, t0, dur, fn) { if (dur === undefined) dur = 0.6; const p = clamp((t - t0) / dur); return (fn || ease)(p); }
/* 0..1 envelope: fades in at t0, out at t1 (fade seconds each) */
function win(t, t0, t1, fade) { if (fade === undefined) fade = 0.4; return Math.min(P(t, t0, fade, linear), 1 - P(t, t1 - fade, fade, linear)); }
/* 0..1 cosine wave with period (s) */
function wave(t, period, phase) { return 0.5 - 0.5 * Math.cos(2 * Math.PI * (t / period + (phase || 0))); }
const TAU = Math.PI * 2;
/* deterministic random numbers (same layout every frame and every visit) */
function rng(seed) {
  let a = seed >>> 0;
  return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------- paths ---------- */
/* smooth closed path through points [[x,y],...] (Catmull-Rom) */
function closedPath(pts) {
  const n = pts.length; let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
/* smooth open path through points */
function openPath(pts) {
  const n = pts.length; let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}
function lerpPts(a, b, p) { return a.map((q, i) => [lerp(q[0], b[i][0], p), lerp(q[1], b[i][1], p)]); }
/* wobbly blob outline around (0,0), animated by t */
function blobPts(rx, ry, n, t, amp, seed) {
  const r = rng(seed || 7), ph = [], fr = [];
  for (let i = 0; i < n; i++) { ph.push(r() * TAU); fr.push(0.25 + r() * 0.35); }
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU, k = 1 + (amp || 0.03) * Math.sin(t * fr[i] * TAU + ph[i]);
    pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]);
  }
  return pts;
}

/* ---------- defs: gradients made on demand ---------- */
let _defs = null; const _grads = {};
function defs() { if (!_defs) _defs = E('defs', {}, document.getElementById('stage')); return _defs; }
/* radial glow that fades to transparent: fill: glow('#FFE45C') */
function glow(color, inner) {
  const id = 'gl' + color.replace(/[^0-9a-z]/gi, '') + (inner ? 'i' : '');
  if (!_grads[id]) {
    const g = E('radialGradient', { id }, defs());
    E('stop', { offset: '0', 'stop-color': inner || color, 'stop-opacity': 0.95 }, g);
    E('stop', { offset: '0.35', 'stop-color': color, 'stop-opacity': 0.55 }, g);
    E('stop', { offset: '1', 'stop-color': color, 'stop-opacity': 0 }, g);
    _grads[id] = `url(#${id})`;
  }
  return _grads[id];
}
/* shaded sphere fill for atoms and balls */
function ball(color, dark) {
  const id = 'bl' + color.replace(/[^0-9a-z]/gi, '');
  if (!_grads[id]) {
    const g = E('radialGradient', { id, cx: '0.38', cy: '0.34', r: '0.75' }, defs());
    E('stop', { offset: '0', 'stop-color': '#ffffff', 'stop-opacity': 0.9 }, g);
    E('stop', { offset: '0.18', 'stop-color': color }, g);
    E('stop', { offset: '1', 'stop-color': dark || color }, g);
    _grads[id] = `url(#${id})`;
  }
  return _grads[id];
}
function linGrad(c0, c1, vertical) {
  const id = 'lg' + (c0 + c1).replace(/[^0-9a-z]/gi, '') + (vertical ? 'v' : 'h');
  if (!_grads[id]) {
    const g = E('linearGradient', { id, x1: 0, y1: 0, x2: vertical ? 0 : 1, y2: vertical ? 1 : 0 }, defs());
    E('stop', { offset: '0', 'stop-color': c0 }, g);
    E('stop', { offset: '1', 'stop-color': c1 }, g);
    _grads[id] = `url(#${id})`;
  }
  return _grads[id];
}

/* ---------- molecules ---------- */
const ATOM = { C: [C.carbon, C.carbonDk, '#ffffff'], H: [C.hydrogen, C.hydrogenDk, '#3B4A57'], O: [C.oxygen, C.oxygenDk, '#ffffff'] };
/* one atom; o.letter shows its symbol */
function atom(parent, kind, r, o) {
  r = r || 18; o = o || {};
  const [c, dk, lc] = ATOM[kind];
  const g = G(parent);
  E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, g);
  if (o.letter) T(g, 0, r * 0.36, kind, { size: r * 1.0, weight: 700, fill: lc, anchor: 'middle' });
  return g;
}
function molO2(parent, r, o) { r = r || 15; const g = G(parent); tr(atom(g, 'O', r, o), -r * 0.72, 0); tr(atom(g, 'O', r, o), r * 0.72, 0); return g; }
function molCO2(parent, r, o) {
  r = r || 15; const g = G(parent);
  tr(atom(g, 'O', r * 0.9, o), -r * 1.6, 0); tr(atom(g, 'O', r * 0.9, o), r * 1.6, 0); tr(atom(g, 'C', r, o), 0, 0);
  return g;
}
function molH2O(parent, r, o) {
  r = r || 15; const g = G(parent);
  tr(atom(g, 'H', r * 0.62, o), -r * 0.98, r * 0.72); tr(atom(g, 'H', r * 0.62, o), r * 0.98, r * 0.72); tr(atom(g, 'O', r, o), 0, 0);
  return g;
}
/* glucose drawn as its ring: an amber hexagon (one corner is the ring's oxygen) */
function molGlucose(parent, s, o) {
  s = s || 34; o = o || {};
  const g = G(parent);
  const pts = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([Math.cos(a) * s, Math.sin(a) * s]); }
  const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
  E('path', { d, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': s * 0.09, 'stroke-linejoin': 'round' }, g);
  E('path', { d, fill: 'none', stroke: C.glucoseLt, 'stroke-width': s * 0.05, opacity: 0.7, transform: 'scale(0.62)' }, g);
  E('circle', { cx: pts[1][0], cy: pts[1][1], r: s * 0.17, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
  if (o.label) T(g, 0, s + (o.labelSize || 26) * 1.15, o.label === true ? 'glucose' : o.label, { size: o.labelSize || 26, weight: 600, fill: C.glucoseLt, anchor: 'middle' });
  return g;
}
/* the glucose "battery": hexagon with an energy level inside; g.set(level 0..1) */
function glucoseBattery(parent, s) {
  s = s || 70; const g = G(parent);
  const pts = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([Math.cos(a) * s, Math.sin(a) * s]); }
  const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z';
  const id = 'clipbat' + Math.random().toString(36).slice(2, 8);
  const cp = E('clipPath', { id }, defs()); E('path', { d }, cp);
  E('path', { d, fill: '#2A2210', stroke: C.glucoseDk, 'stroke-width': s * 0.08 }, g);
  const lvl = E('rect', { x: -s, y: -s, width: 2 * s, height: 2 * s, fill: C.glucose, 'clip-path': `url(#${id})` }, g);
  E('path', { d, fill: 'none', stroke: C.glucoseLt, 'stroke-width': s * 0.05, transform: 'scale(0.78)', opacity: 0.5 }, g);
  const zap = bolt(g, s * 0.012); tr(zap, 0, 0, s * 0.012);
  g.set = v => { v = clamp(v); attr(lvl, 'y', s - 2 * s * v * 0.86 - s * 0.14); attr(lvl, 'height', 2 * s); };
  g.set(1);
  return g;
}

/* ---------- energy, heat ---------- */
/* 8-point energy star with a glow; g.upd(t) twinkles it */
function spark(parent, r, o) {
  r = r || 22; o = o || {};
  const g = G(parent);
  const halo = E('circle', { r: r * 2.4, fill: glow(o.color || C.energy) }, g);
  let d = '';
  for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? r * 0.36 : (i % 4 ? r * 0.7 : r); d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
  const star = E('path', { d: d + 'Z', fill: o.color || C.energy, stroke: C.energyLt, 'stroke-width': 1.5 }, g);
  const seed = o.seed || 0;
  g.upd = t => { const k = 0.85 + 0.15 * wave(t, 0.9, seed); tr(star, 0, 0, k, (t * 25 + seed * 40) % 360); tr(halo, 0, 0, 0.9 + 0.2 * wave(t, 1.3, seed)); };
  g.upd(0);
  return g;
}
/* lightning bolt icon, roughly 60 x 100 at s=1, centred */
function bolt(parent, s, color) {
  const g = G(parent);
  E('path', { d: 'M8,-50 L-26,6 L-4,6 L-12,50 L26,-8 L4,-8 Z', fill: color || C.energy, stroke: C.energyLt, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  if (s && s !== 1) tr(g, 0, 0, s);
  return g;
}
/* rising heat shimmer: n wavy strokes about h tall; g.upd(t) */
function heatWaves(parent, o) {
  o = o || {}; const n = o.n || 3, h = o.h || 70, sp = o.spacing || 22, col = o.color || C.heat;
  const g = G(parent); const ws = [];
  for (let i = 0; i < n; i++) ws.push(E('path', { fill: 'none', stroke: col, 'stroke-width': o.width || 5, 'stroke-linecap': 'round' }, g));
  g.upd = t => {
    ws.forEach((w, i) => {
      const ph = (t * (o.speed || 0.6) + i / n) % 1, x0 = (i - (n - 1) / 2) * sp, pts = [];
      for (let k = 0; k <= 8; k++) { const yy = -k * h / 8; pts.push([x0 + Math.sin(k * 0.9 + t * 4 + i) * 6, yy]); }
      w.setAttribute('d', openPath(pts));
      w.setAttribute('transform', `translate(0 ${(-ph * h * 0.5).toFixed(1)})`);
      w.style.opacity = (Math.sin(ph * Math.PI) * 0.9).toFixed(3);
    });
  };
  g.upd(0);
  return g;
}

/* ---------- arrows, chips, cards, labels ---------- */
/* arrow from (x1,y1) to (x2,y2); o: color, width, head, bend (curve offset), dash.
   g.set(p) draws it progressively (0..1). */
function arrow(parent, x1, y1, x2, y2, o) {
  o = o || {};
  const col = o.color || C.ink, w = o.width || 5, hs = o.head || w * 3.4;
  const g = G(parent);
  let cx, cy, ang;
  if (o.bend) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    cx = mx - dy / L * o.bend; cy = my + dx / L * o.bend; ang = Math.atan2(y2 - cy, x2 - cx);
  } else ang = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - Math.cos(ang) * hs * 0.7, ey = y2 - Math.sin(ang) * hs * 0.7;
  const d = o.bend ? `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}` : `M${x1},${y1} L${ex.toFixed(1)},${ey.toFixed(1)}`;
  const line = E('path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
  const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col, 'stroke-linejoin': 'round' }, g);
  head.setAttribute('transform', `translate(${x2} ${y2}) rotate(${(ang * 180 / Math.PI).toFixed(2)})`);
  g.set = p => { p = clamp(p); line.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); head.style.opacity = clamp((p - 0.82) / 0.18).toFixed(3); };
  g.set(1);
  return g;
}
/* rounded pill with centred text; o: size, fill, stroke, color, w, h, rx, font, weight, padX */
function chip(parent, text, o) {
  o = o || {};
  const size = o.size || 30, h = o.h || Math.round(size * 1.75), padX = o.padX !== undefined ? o.padX : size * 0.7;
  const w = o.w || Math.ceil(textWidth(text, size, o.font, o.weight || 700) + padX * 2);
  const g = G(parent);
  g.box = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || C.card2, stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
  g.label = T(g, 0, size * 0.35, text, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', font: o.font });
  g.w = w; g.h = h;
  return g;
}
/* panel with rounded corners at (x,y) top-left */
function card(parent, x, y, w, h, o) {
  o = o || {};
  return E('rect', { x, y, width: w, height: h, rx: o.rx !== undefined ? o.rx : 22, fill: o.fill || C.card, stroke: o.stroke || C.line, 'stroke-width': o.sw || 2, opacity: o.opacity }, parent);
}
/* a green tick or red cross, about 2s wide */
function tick(parent, s, color) { const g = G(parent); E('path', { d: `M${-s},0 L${-s * 0.3},${s * 0.7} L${s},${-s * 0.8}`, fill: 'none', stroke: color || C.good, 'stroke-width': s * 0.32, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
function cross(parent, s, color) { const g = G(parent); E('path', { d: `M${-s},${-s} L${s},${s} M${s},${-s} L${-s},${s}`, fill: 'none', stroke: color || C.bad, 'stroke-width': s * 0.32, 'stroke-linecap': 'round' }, g); return g; }
/* strike-through bar for crossing out a word: g.set(p) */
function strike(parent, x1, y, x2, color) {
  const l = E('line', { x1, y1: y, x2: x1, y2: y, stroke: color || C.bad, 'stroke-width': 6, 'stroke-linecap': 'round' }, parent);
  l.set = p => { attr(l, 'x2', lerp(x1, x2, clamp(p))); l.style.opacity = p > 0.01 ? 1 : 0; };
  l.set(0);
  return l;
}

/* ---------- cells and organelles ---------- */
/* animal cell: wobbly membrane, cytoplasm, nucleus. g.upd(t) wobbles it. o: fill, stroke, nucleus (bool) */
function animalCell(parent, rx, ry, o) {
  o = o || {};
  const g = G(parent);
  const mem = E('path', { fill: o.fill || 'rgba(247,168,200,0.13)', stroke: o.stroke || C.cell, 'stroke-width': o.sw || 5 }, g);
  g.inner = G(g);
  if (o.nucleus !== false) {
    const nx = o.nx !== undefined ? o.nx : -rx * 0.28, ny = o.ny !== undefined ? o.ny : -ry * 0.12, nr = o.nr || Math.min(rx, ry) * 0.26;
    E('circle', { cx: nx, cy: ny, r: nr, fill: 'rgba(150,120,220,0.35)', stroke: '#B79CF0', 'stroke-width': 3 }, g.inner);
    E('circle', { cx: nx + nr * 0.2, cy: ny - nr * 0.1, r: nr * 0.32, fill: '#B79CF0', opacity: 0.6 }, g.inner);
  }
  const seed = o.seed || 3;
  g.upd = t => mem.setAttribute('d', closedPath(blobPts(rx, ry, 18, t, o.amp || 0.025, seed)));
  g.upd(0);
  return g;
}
/* mitochondrion of length w and height h, centred; folded inner membrane (cristae). o.glow adds an energy glow */
function mitochondrion(parent, w, h, o) {
  o = o || {};
  const g = G(parent);
  if (o.glow) g.halo = E('ellipse', { rx: w * 0.75, ry: h * 1.1, fill: glow(C.energy) }, g);
  const r = h / 2;
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: r, fill: ball(C.mito, C.mitoDk), stroke: C.mitoDk, 'stroke-width': Math.max(2, h * 0.06) }, g);
  const iw = w - h * 0.28, ih = h - h * 0.28;
  E('rect', { x: -iw / 2, y: -ih / 2, width: iw, height: ih, rx: ih / 2, fill: C.mitoIn, opacity: 0.9 }, g);
  // cristae: fingers of inner membrane reaching in from top and bottom, alternately
  const n = o.folds || Math.max(3, Math.round(w / h * 2.2)), sw = Math.max(2, h * 0.07);
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = -iw / 2 + ih * 0.45 + (i + 0.5) * (iw - ih * 0.9) / n, top = i % 2 === 0;
    const y0 = top ? -ih / 2 + sw * 0.4 : ih / 2 - sw * 0.4, y1 = top ? ih * 0.2 : -ih * 0.2, fw = (iw - ih) / n * 0.32;
    d += `M${(x - fw).toFixed(1)},${y0.toFixed(1)} L${(x - fw).toFixed(1)},${(y1 + (top ? -fw : fw)).toFixed(1)} Q${x.toFixed(1)},${(y1 + (top ? fw : -fw) * 0.8).toFixed(1)} ${(x + fw).toFixed(1)},${(y1 + (top ? -fw : fw)).toFixed(1)} L${(x + fw).toFixed(1)},${y0.toFixed(1)} `;
  }
  E('path', { d, fill: 'none', stroke: C.mitoDk, 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  E('rect', { x: -iw / 2, y: -ih / 2, width: iw, height: ih, rx: ih / 2, fill: 'none', stroke: C.mitoDk, 'stroke-width': sw }, g);
  g.upd = t => { if (g.halo) tr(g.halo, 0, 0, 0.9 + 0.15 * wave(t, 1.6)); };
  return g;
}
/* chloroplast: green lens with stacks (grana) */
function chloroplast(parent, w, h) {
  const g = G(parent);
  E('ellipse', { rx: w / 2, ry: h / 2, fill: ball(C.chloro, C.chloroDk), stroke: C.chloroDk, 'stroke-width': Math.max(2, h * 0.06) }, g);
  const stacks = Math.max(3, Math.round(w / h * 2));
  for (let i = 0; i < stacks; i++) {
    const x = -w * 0.34 + i * (w * 0.68) / (stacks - 1), sy = (i % 2 ? -1 : 1) * h * 0.08;
    for (let k = 0; k < 3; k++) E('rect', { x: x - w * 0.06, y: sy - h * 0.22 + k * h * 0.15, width: w * 0.12, height: h * 0.11, rx: h * 0.05, fill: C.chloroDk, opacity: 0.9 }, g);
  }
  return g;
}

/* ---------- body parts ---------- */
/* lungs with windpipe, about 300 x 300 at s=1, centred on the chest. g.set(breath 0..1) inflates them */
function lungs(parent, s) {
  s = s || 1;
  const g = G(parent); const inner = G(g); tr(inner, 0, 0, s);
  E('path', { d: 'M0,-150 L0,-60 M0,-60 Q-18,-40 -46,-22 M0,-60 Q18,-40 46,-22', fill: 'none', stroke: '#E9C7D2', 'stroke-width': 16, 'stroke-linecap': 'round' }, inner);
  for (let k = 0; k < 5; k++) E('line', { x1: -9, x2: 9, y1: -140 + k * 17, y2: -140 + k * 17, stroke: '#C99AAA', 'stroke-width': 4 }, inner);
  const L = G(inner), R = G(inner);
  const lobe = 'M-30,-70 C-70,-90 -128,-40 -132,40 C-136,110 -112,150 -70,152 C-40,154 -22,130 -20,90 C-18,40 -10,-20 -30,-70 Z';
  E('path', { d: lobe, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 4 }, L);
  E('path', { d: lobe, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 4, transform: 'scale(-1 1)' }, R);
  const br = 'M-46,-22 Q-70,10 -84,48 M-60,8 Q-88,20 -104,30 M-70,40 Q-74,80 -66,112';
  E('path', { d: br, fill: 'none', stroke: '#FFD0DC', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.75 }, L);
  E('path', { d: br, fill: 'none', stroke: '#FFD0DC', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.75, transform: 'scale(-1 1)' }, R);
  g.set = b => { const k = 1 + 0.09 * clamp(b); L.setAttribute('transform', `translate(-20 0) scale(${k.toFixed(3)} ${(1 + 0.05 * b).toFixed(3)}) translate(20 0)`); R.setAttribute('transform', `translate(20 0) scale(${k.toFixed(3)} ${(1 + 0.05 * b).toFixed(3)}) translate(-20 0)`); };
  g.set(0);
  return g;
}

/* ---------- lab kit and gauges ---------- */
/* rising bubbles inside a box (x,y,w,h relative to the group); o: n, r, speed, color, seed. g.upd(t) */
function bubbles(parent, x, y, w, h, o) {
  o = o || {};
  const g = G(parent), n = o.n || 10, rr = rng(o.seed || 11), bs = [];
  for (let i = 0; i < n; i++) bs.push({ el: E('circle', { r: (o.r || 7) * (0.6 + rr() * 0.7), fill: o.fill || 'rgba(255,255,255,0.18)', stroke: o.color || 'rgba(255,255,255,0.75)', 'stroke-width': 2 }, g), x: x + rr() * w, ph: rr(), sp: 0.7 + rr() * 0.6, wob: rr() * TAU });
  g.upd = (t, rate) => {
    const k = rate === undefined ? 1 : rate;
    bs.forEach(b => {
      const p = ((t * (o.speed || 0.35) * b.sp) + b.ph) % 1;
      attr(b.el, 'cx', b.x + Math.sin(t * 3 + b.wob) * 4);
      attr(b.el, 'cy', y + h - p * h);
      b.el.style.opacity = (k * Math.min(1, p * 6, (1 - p) * 5)).toFixed(3);
    });
  };
  g.upd(0);
  return g;
}
/* bar gauge; o: w, h, vertical, color, track, label. g.set(v 0..1) */
function meter(parent, o) {
  o = o || {};
  const w = o.w || 220, h = o.h || 26, g = G(parent), v = !!o.vertical;
  E('rect', { x: 0, y: 0, width: w, height: h, rx: Math.min(w, h) / 2, fill: o.track || '#0B2230', stroke: C.line, 'stroke-width': 2 }, g);
  const bar = E('rect', { x: 0, y: 0, width: v ? w : 0, height: v ? 0 : h, rx: Math.min(w, h) / 2, fill: o.color || C.energy }, g);
  if (o.label) T(g, v ? w / 2 : 0, v ? h + 34 : -12, o.label, { size: o.labelSize || 24, weight: 600, fill: o.labelFill || C.muted, anchor: v ? 'middle' : 'start' });
  g.set = val => { val = clamp(val); if (v) { attr(bar, 'height', h * val); attr(bar, 'y', h - h * val); } else attr(bar, 'width', Math.max(val > 0 ? Math.min(w, h) : 0, w * val)); };
  g.set(0);
  return g;
}
/* thermometer, h tall, bulb at the bottom (0,0); g.set(v 0..1) */
function thermometer(parent, h, color) {
  h = h || 200; const g = G(parent);
  E('rect', { x: -12, y: -h, width: 24, height: h, rx: 12, fill: '#E9F2F7', stroke: '#8FB0C2', 'stroke-width': 3 }, g);
  E('circle', { cx: 0, cy: 6, r: 22, fill: color || C.bad, stroke: '#8FB0C2', 'stroke-width': 3 }, g);
  const col = E('rect', { x: -6, y: 0, width: 12, height: 0, rx: 6, fill: color || C.bad }, g);
  for (let i = 1; i < 6; i++) E('line', { x1: 12, x2: 22, y1: -h * i / 6, y2: -h * i / 6, stroke: '#8FB0C2', 'stroke-width': 3 }, g);
  g.set = v => { const hh = (h - 20) * (0.12 + 0.88 * clamp(v)); attr(col, 'y', -hh); attr(col, 'height', hh + 6); };
  g.set(0.2);
  return g;
}
/* countdown ring for "think" pauses; g.set(p 0..1 elapsed) */
function ring(parent, r, color) {
  const g = G(parent);
  E('circle', { r, fill: 'none', stroke: C.line, 'stroke-width': r * 0.16 }, g);
  const arc = E('circle', { r, fill: 'none', stroke: color || C.energy, 'stroke-width': r * 0.16, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', transform: 'rotate(-90)' }, g);
  g.set = p => arc.setAttribute('stroke-dashoffset', clamp(p).toFixed(4));
  g.set(0);
  return g;
}

/* ---------- scene registry ----------
   scene('aerobic', S => { ...build DOM in S.root...; return t => { ...update for local time t... }; });
   S.root   the scene's <g> (draw everything inside it)
   S.at(id) start time (s, chapter-local) of narration line `id`; S.end(id) its end;
   S.mid(id, f) a moment f (0..1) of the way through that line
   S.first  start of the first line; S.D chapter duration; S.reduce prefers-reduced-motion
   Keep the top-left band (y < 100, x < 560) clear: the chapter tag sits there. */
const SCENES = {};
function scene(id, build) { SCENES[id] = build; }

/* ==========================================================================
   kit.js: the shared lab kit and scenery, bundled after lib.js. Same rules as
   lib.js: each primitive draws around its own origin and returns a <g>;
   animated ones take g.set(...) and/or g.upd(t). Use these so glassware,
   circuits, magnets, waves, particles and people look the same in every
   chapter of every lesson.
   ========================================================================== */

let _kitId = 0;
function _clipUrl(d) { const id = 'kc' + (++_kitId); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; }
const GLASS = { stroke: '#CFE7F5', fill: 'rgba(200,230,250,0.10)', shine: 'rgba(255,255,255,0.28)' };

/* ---------- glassware: g.set(level 0..1, color) fills it from the bottom ---------- */
function _liquid(g, d, top, bottom, o) {
  const clip = _clipUrl(d);
  const liq = E('rect', { x: -400, y: bottom, width: 800, height: 0, fill: o.liquid || C.water, opacity: o.opacity || 0.85, 'clip-path': clip }, g);
  const surf = E('rect', { x: -400, y: bottom, width: 800, height: 4, fill: '#ffffff', opacity: 0.35, 'clip-path': clip }, g);
  g.set = (level, color) => {
    level = clamp(level); const y = bottom - (bottom - top) * level;
    attr(liq, 'y', y); attr(liq, 'height', bottom - y + 2); attr(surf, 'y', y);
    surf.style.opacity = level > 0.01 ? '' : '0';
    if (color) liq.setAttribute('fill', color);
  };
  g.liquid = liq;
  g.set(o.level !== undefined ? o.level : 0.5);
}
/* beaker about w x h; o: level, liquid (colour), marks (default true) */
function beaker(parent, w, h, o) {
  w = w || 140; h = h || 170; o = o || {};
  const g = G(parent), r = 14, x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
  const body = `M${x0},${y0 + 4} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 4} Z`;
  E('path', { d: body, fill: GLASS.fill }, g);
  _liquid(g, body, y0 + 18, y1, o);
  if (o.marks !== false) for (let i = 1; i <= 3; i++) E('line', { x1: x0 + 8, x2: x0 + 26, y1: y1 - i * h / 4.5, y2: y1 - i * h / 4.5, stroke: GLASS.stroke, 'stroke-width': 2.5, opacity: 0.7 }, g);
  E('path', { d: `M${x0 - 10},${y0} L${x0},${y0 + 6} L${x0},${y1 - r} Q${x0},${y1} ${x0 + r},${y1} L${x1 - r},${y1} Q${x1},${y1} ${x1},${y1 - r} L${x1},${y0 + 6} L${x1 + 4},${y0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  E('rect', { x: x1 - 22, y: y0 + 20, width: 7, height: h - 50, rx: 3.5, fill: GLASS.shine }, g);
  return g;
}
/* test tube about w x h, rounded bottom; o: level, liquid */
function testTube(parent, w, h, o) {
  w = w || 46; h = h || 200; o = o || {};
  const g = G(parent), x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2, r = w / 2;
  const body = `M${x0},${y0} L${x0},${y1 - r} A${r},${r} 0 0 0 ${x1},${y1 - r} L${x1},${y0} Z`;
  E('path', { d: body, fill: GLASS.fill }, g);
  _liquid(g, body, y0 + 10, y1, o);
  E('path', { d: `M${x0},${y0} L${x0},${y1 - r} A${r},${r} 0 0 0 ${x1},${y1 - r} L${x1},${y0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  E('ellipse', { cx: 0, cy: y0, rx: r + 4, ry: 5, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5 }, g);
  E('rect', { x: x1 - 13, y: y0 + 14, width: 5, height: h - r - 30, rx: 2.5, fill: GLASS.shine }, g);
  return g;
}
/* conical flask, about 160 wide x 190 tall at s=1; o: level, liquid */
function flask(parent, s, o) {
  s = s || 1; o = o || {};
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
  const body = 'M-17,-95 L-17,-38 L-76,78 Q-80,92 -66,92 L66,92 Q80,92 76,78 L17,-38 L17,-95 Z';
  E('path', { d: body, fill: GLASS.fill }, inner);
  _liquid(inner, body, -38, 92, o);
  E('path', { d: 'M-17,-95 L-17,-38 L-76,78 Q-80,92 -66,92 L66,92 Q80,92 76,78 L17,-38 L17,-95', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
  E('path', { d: 'M-23,-97 L23,-97', stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
  g.set = inner.set; g.liquid = inner.liquid;
  return g;
}
/* Bunsen burner, about 70 wide x 150 tall, tube top at (0,-120); g.set('off'|'yellow'|'blue'), g.upd(t) */
function bunsen(parent, s) {
  s = s || 1;
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
  E('rect', { x: -40, y: 0, width: 80, height: 18, rx: 6, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, inner);
  E('rect', { x: -11, y: -120, width: 22, height: 122, rx: 3, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, inner);
  E('rect', { x: -15, y: -40, width: 30, height: 16, rx: 3, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 2 }, inner);
  E('path', { d: 'M40,10 L70,10', stroke: '#E07A3E', 'stroke-width': 8, 'stroke-linecap': 'round' }, inner);
  const fl = G(inner); tr(fl, 0, -120);
  const halo = E('ellipse', { cx: 0, cy: -55, rx: 50, ry: 80, fill: glow('#FFB347') }, fl);
  const outer = E('path', { d: 'M0,0 C-22,-22 -20,-70 0,-118 C20,-70 22,-22 0,0 Z' }, fl);
  const core = E('path', { d: 'M0,-2 C-10,-14 -10,-40 0,-66 C10,-40 10,-14 0,-2 Z' }, fl);
  let mode = 'blue';
  g.set = m => {
    mode = m;
    op(fl, m === 'off' ? 0 : 1);
    if (m === 'yellow') { outer.setAttribute('fill', '#FFB13B'); core.setAttribute('fill', '#FFE07A'); halo.setAttribute('opacity', 0.9); }
    else { outer.setAttribute('fill', '#5AA8FF'); core.setAttribute('fill', '#BFE3FF'); halo.setAttribute('opacity', 0.35); }
  };
  g.upd = t => { const k = mode === 'yellow' ? 0.12 : 0.05; fl.setAttribute('transform', `translate(0 -120) scale(${(1 + k * 0.4 * Math.sin(t * 9)).toFixed(3)} ${(1 + k * Math.sin(t * 13 + 1)).toFixed(3)})`); };
  g.set('blue'); g.upd(0);
  return g;
}

/* ---------- circuits: standard symbols, wires carry current dots ---------- */
const WIRE = '#F2F7FA';
function _sym(parent, len) { const g = G(parent); E('path', { d: `M${-len},0 L${len},0`, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); return g; }
/* cell: long thin plate (+) on the left, short thick plate (-) on the right. o.cells for a battery of n cells */
function cellSym(parent, o) {
  o = o || {}; const n = o.cells || 1, gap = 34, wTot = (n - 1) * gap + 16;
  const g = G(parent);
  E('path', { d: `M${-wTot / 2 - 34},0 L${-wTot / 2},0 M${wTot / 2},0 L${wTot / 2 + 34},0`, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  E('rect', { x: -wTot / 2 + 1, y: -4, width: wTot - 2, height: 8, fill: C.bg0 }, g);
  for (let i = 0; i < n; i++) {
    const x = -wTot / 2 + i * gap;
    E('line', { x1: x, x2: x, y1: -30, y2: 30, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('line', { x1: x + 16, x2: x + 16, y1: -15, y2: 15, stroke: WIRE, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    if (i < n - 1) E('line', { x1: x + 16, x2: x + gap, y1: 0, y2: 0, stroke: WIRE, 'stroke-width': 4, 'stroke-dasharray': '4 5' }, g);
  }
  if (o.signs !== false) { T(g, -wTot / 2 - 4, -40, '+', { size: 30, weight: 700, anchor: 'middle', fill: C.bad }); T(g, wTot / 2 + 4, -40, '−', { size: 30, weight: 700, anchor: 'middle', fill: C.water }); }
  return g;
}
/* lamp: circle with a cross; g.set(on 0..1) lights it */
function bulbSym(parent) {
  const g = _sym(parent, 46);
  const halo = E('circle', { r: 64, fill: glow(C.energy) }, g);
  E('circle', { r: 24, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g);
  const fillC = E('circle', { r: 20, fill: C.energy }, g);
  E('path', { d: 'M-17,-17 L17,17 M17,-17 L-17,17', stroke: WIRE, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  g.set = v => { v = clamp(v); halo.style.opacity = v.toFixed(3); fillC.style.opacity = (0.95 * v).toFixed(3); };
  g.set(0);
  return g;
}
/* switch: g.set(closed 0..1) */
function switchSym(parent) {
  const g = G(parent);
  E('path', { d: 'M-50,0 L-24,0 M24,0 L50,0', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  E('circle', { cx: -24, cy: 0, r: 6, fill: WIRE }, g); E('circle', { cx: 24, cy: 0, r: 6, fill: C.bg0, stroke: WIRE, 'stroke-width': 4 }, g);
  const lever = E('line', { x1: -24, y1: 0, x2: 26, y2: 0, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  g.set = c => lever.setAttribute('transform', `rotate(${(-32 * (1 - clamp(c))).toFixed(2)} -24 0)`);
  g.set(0);
  return g;
}
function resistorSym(parent) { const g = _sym(parent, 54); E('rect', { x: -30, y: -13, width: 60, height: 26, rx: 3, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g); return g; }
/* meter: letter 'A' (ammeter) or 'V' (voltmeter); g.set(text) shows a reading beside it */
function meterSym(parent, letter) {
  const g = _sym(parent, 46);
  E('circle', { r: 24, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g);
  T(g, 0, 10, letter || 'A', { size: 28, weight: 700, anchor: 'middle', fill: WIRE });
  const rd = T(g, 0, -38, '', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  g.set = s => setText(rd, s || '');
  return g;
}
/* wire through points [[x,y],...] in parent coordinates; g.upd(t, speed) moves current dots from the
   first point to the last (conventional current: + to -); g.set(on 0..1) shows/hides the dots */
function wire(parent, pts, o) {
  o = o || {};
  const g = G(parent);
  E('path', { d: 'M' + pts.map(p => p[0] + ',' + p[1]).join(' L'), fill: 'none', stroke: o.color || WIRE, 'stroke-width': o.width || 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  const segs = []; let L = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push([L, l, pts[i], pts[i + 1]]); L += l; }
  const n = Math.max(2, Math.round(L / (o.spacing || 46))), dots = [];
  for (let k = 0; k < n; k++) dots.push(E('circle', { r: o.dot || 5.5, fill: o.dotColor || C.energy }, g));
  const at = s => { s = ((s % L) + L) % L; for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; } return pts[pts.length - 1]; };
  let on = 1;
  g.set = v => { on = clamp(v); dots.forEach(d => { d.style.opacity = on.toFixed(3); }); };
  g.upd = (t, speed) => { const sp = speed === undefined ? 60 : speed; dots.forEach((d, k) => { const q = at(k * L / n + t * sp); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); }); };
  g.length = L; g.set(o.on === undefined ? 1 : o.on); g.upd(0);
  return g;
}

/* ---------- magnets and waves ---------- */
/* bar magnet w x h, N (red) on the left; o.flip puts N on the right */
function magnet(parent, w, h, o) {
  w = w || 220; h = h || 60; o = o || {};
  const g = G(parent), nLeft = !o.flip;
  const red = '#E8424F', blue = '#3B82F6';
  E('rect', { x: -w / 2, y: -h / 2, width: w / 2, height: h, rx: 10, fill: ball(nLeft ? red : blue, nLeft ? '#A4232E' : '#1E4FA8') }, g);
  E('rect', { x: 0, y: -h / 2, width: w / 2, height: h, rx: 10, fill: ball(nLeft ? blue : red, nLeft ? '#1E4FA8' : '#A4232E') }, g);
  E('rect', { x: -12, y: -h / 2, width: 24, height: h, fill: nLeft ? blue : red, opacity: 0 }, g);
  T(g, -w / 4, h * 0.2, nLeft ? 'N' : 'S', { size: h * 0.55, weight: 700, anchor: 'middle', fill: '#fff' });
  T(g, w / 4, h * 0.2, nLeft ? 'S' : 'N', { size: h * 0.55, weight: 700, anchor: 'middle', fill: '#fff' });
  return g;
}
/* sine wave from x=0 to x=w around y=0; g.set({ amp, wl, phase }) (phase in wavelengths) */
function wave(parent, o) {
  o = o || {};
  const g = G(parent), w = o.w || 600;
  const p = E('path', { fill: 'none', stroke: o.color || C.water, 'stroke-width': o.width || 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  let st = { amp: o.amp || 50, wl: o.wl || 150, phase: 0 };
  g.set = v => {
    st = Object.assign(st, v || {});
    let d = '';
    for (let x = 0; x <= w; x += 4) { const y = -st.amp * Math.sin(TAU * (x / st.wl - st.phase)); d += (x ? 'L' : 'M') + x + ',' + y.toFixed(1); }
    p.setAttribute('d', d);
  };
  g.set();
  return g;
}

/* ---------- particles: solid / liquid / gas ---------- */
/* box w x h (top-left at 0,0) of n particles. g.set(state, t, energy 0..1) arranges them:
   'solid' a vibrating lattice, 'liquid' touching but jumbled and sliding, 'gas' far apart and fast.
   o: n, r, color, box (draw the container, default true), seed */
function particleBox(parent, w, h, o) {
  o = o || {};
  const g = G(parent), n = o.n || 30, r = o.r || 11, rr = rng(o.seed || 17);
  if (o.box !== false) E('rect', { x: -6, y: -6, width: w + 12, height: h + 12, rx: 10, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
  const cols = Math.ceil(Math.sqrt(n * w / h)), rows = Math.ceil(n / cols), ps = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols, rw = Math.floor(i / cols);
    ps.push({
      el: E('circle', { r, fill: ball(o.color || C.water, o.dark || C.waterDk) }, g),
      lx: (c + 0.5) * Math.min(w / cols, 2.3 * r), ly: h - (rw + 0.5) * Math.min(h / rows, 2.3 * r),
      jx: (c + 0.5 + (rr() - 0.5) * 0.6) * Math.min(w / cols, 2.3 * r), jy: h - (rw + 0.5 + (rr() - 0.5) * 0.5) * 2.05 * r,
      gx: r + rr() * (w - 2 * r), gy: r + rr() * (h - 2 * r), vx: (rr() - 0.5) * 2, vy: (rr() - 0.5) * 2, ph: rr() * TAU,
    });
  }
  const lw = Math.min(w / cols, 2.3 * r) * cols, offx = (w - lw) / 2;
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  g.set = (state, t, e) => {
    e = e === undefined ? 0.4 : clamp(e);
    ps.forEach(p => {
      let x, y;
      if (state === 'gas') { x = bounce(p.gx + p.vx * t * (60 + 140 * e), r, w - r); y = bounce(p.gy + p.vy * t * (60 + 140 * e), r, h - r); }
      else if (state === 'liquid') { x = offx + p.jx + Math.sin(t * 1.3 + p.ph) * (3 + 5 * e) + Math.sin(t * 0.35 + p.ph) * 10; y = p.jy + Math.cos(t * 1.7 + p.ph) * (2 + 3 * e); }
      else { x = offx + p.lx + Math.sin(t * 19 + p.ph) * (0.8 + 5 * e); y = p.ly + Math.cos(t * 23 + p.ph) * (0.8 + 5 * e); }
      attr(p.el, 'cx', x); attr(p.el, 'cy', y);
    });
  };
  g.set(o.state || 'solid', 0);
  return g;
}

/* ---------- people ---------- */
/* a simple person about 190 tall, feet at (0,0). g.pose({ lean, armL:[shoulder, elbow], armR, legL:[hip, knee], legR })
   with angles in degrees (0 = hanging straight down, positive swings forward). o: shirt, skin, hair, shorts, shoes */
function person(parent, o) {
  o = o || {};
  const g = G(parent), body = G(g);
  const skin = o.skin || '#C98E62', shirt = o.shirt || '#5B8DEF', shorts = o.shorts || '#A9BCD4', hair = o.hair || '#2B1D14', shoes = o.shoes || '#F2F7FA';
  const AU = 33, AL = 31, LU = 45, LL = 45;
  const limb = (upCol, lowCol, w, lu, ll, foot) => {
    const a = G(body);
    const up = E('line', { x1: 0, y1: 0, x2: 0, y2: lu, stroke: upCol, 'stroke-width': w, 'stroke-linecap': 'round' }, a);
    const lo = G(a);
    const low = E('line', { x1: 0, y1: 0, x2: 0, y2: ll, stroke: lowCol, 'stroke-width': w * 0.85, 'stroke-linecap': 'round' }, lo);
    if (foot) E('path', { d: `M-5,${ll - 2} Q-6,${ll + 7} 4,${ll + 7} L15,${ll + 7} Q19,${ll + 2} 12,${ll - 3} Z`, fill: shoes }, lo);
    else E('circle', { cx: 0, cy: ll + 2, r: w * 0.55, fill: skin }, lo);
    return { a, lo, up, low };
  };
  const legB = limb(shorts, skin, 15, LU, LL, true), armB = limb(shirt, skin, 11, AU, AL, false);
  E('path', { d: 'M-18,-152 Q0,-160 18,-152 L15,-92 Q0,-86 -15,-92 Z', fill: shirt }, body);
  const legF = limb(shorts, skin, 15, LU, LL, true), armF = limb(shirt, skin, 11, AU, AL, false);
  const head = G(body);
  E('rect', { x: -6, y: -160, width: 12, height: 10, fill: skin }, head);
  E('circle', { cx: 0, cy: -174, r: 19, fill: skin }, head);
  E('path', { d: 'M-19,-178 Q-16,-198 2,-196 Q18,-195 19,-180 Q8,-188 -19,-178 Z', fill: hair }, head);
  const setLimb = (L, x, y, a, b, seg) => { L.a.setAttribute('transform', `translate(${x} ${y}) rotate(${(-a).toFixed(1)})`); L.lo.setAttribute('transform', `translate(0 ${seg}) rotate(${(-b).toFixed(1)})`); };
  g.pose = p => {
    p = p || {};
    body.setAttribute('transform', `rotate(${(p.lean || 0).toFixed(1)} 0 -92)`);
    const aL = p.armL || [8, 10], aR = p.armR || [-8, 10], lL = p.legL || [3, -3], lR = p.legR || [-3, -3];
    setLimb(armB, 0, -146, aL[0], aL[1], AU); setLimb(armF, 0, -146, aR[0], aR[1], AU);
    setLimb(legB, 0, -92, lL[0], lL[1], LU); setLimb(legF, 0, -92, lR[0], lR[1], LU);
  };
  g.pose();
  return g;
}
/* running / walking poses for person(): pass the result to g.pose(...) */
function runPose(t, speed) {
  const s = Math.sin(t * TAU * (speed || 1.6)), c = Math.cos(t * TAU * (speed || 1.6));
  return { lean: 10, armL: [-55 * s, 85], armR: [55 * s, 85], legL: [45 * s, -(40 + 40 * Math.max(0, c))], legR: [-45 * s, -(40 + 40 * Math.max(0, -c))] };
}
function walkPose(t, speed) {
  const s = Math.sin(t * TAU * (speed || 0.9));
  return { lean: 2, armL: [-22 * s, 12], armR: [22 * s, 12], legL: [22 * s, -10 - 10 * Math.max(0, s)], legR: [-22 * s, -10 - 10 * Math.max(0, -s)] };
}

/* ---------- scenery ---------- */
/* sun of radius r with rays; g.upd(t) turns the rays slowly */
function sun(parent, r) {
  r = r || 50;
  const g = G(parent);
  E('circle', { r: r * 2.6, fill: glow('#FFD24A') }, g);
  const rays = G(g);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.cos(a) * r * 1.25, y1: Math.sin(a) * r * 1.25, x2: Math.cos(a) * r * 1.6, y2: Math.sin(a) * r * 1.6, stroke: '#FFD24A', 'stroke-width': r * 0.12, 'stroke-linecap': 'round' }, rays); }
  E('circle', { r, fill: ball('#FFE066', '#F5A300') }, g);
  g.upd = t => tr(rays, 0, 0, 1 + 0.05 * Math.sin(t * 2), (t * 8) % 360);
  return g;
}
/* leaf about 200 long pointing right from (0,0); o.color */
function leaf(parent, s, o) {
  s = s || 1; o = o || {};
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
  E('path', { d: 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z', fill: ball(o.color || C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, inner);
  E('path', { d: 'M-10,0 L200,0', stroke: '#C9F2D3', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, inner);
  for (let i = 1; i <= 4; i++) { const x = i * 38; E('path', { d: `M${x},0 Q${x + 16},-${18 + i * 2} ${x + 26},-${30 - i * 2} M${x},0 Q${x + 16},${18 + i * 2} ${x + 26},${30 - i * 2}`, fill: 'none', stroke: '#C9F2D3', 'stroke-width': 2.5, opacity: 0.6 }, inner); }
  return g;
}
/* label text at (x,y) with a leader line to the point (tx,ty); g.set(p 0..1) fades it in. o: size, fill, anchor */
function labelLine(parent, x, y, tx, ty, text, o) {
  o = o || {};
  const g = G(parent);
  const size = o.size || 26, anchor = o.anchor || (tx < x ? 'start' : 'end');
  const ex = anchor === 'start' ? x - 8 : x + 8;
  E('line', { x1: ex, y1: y - size * 0.32, x2: tx, y2: ty, stroke: o.line || C.muted, 'stroke-width': 2.5 }, g);
  E('circle', { cx: tx, cy: ty, r: 4.5, fill: o.line || C.muted }, g);
  T(g, x, y, text, { size, weight: o.weight || 600, fill: o.fill || C.ink, anchor });
  g.set = p => op(g, p);
  return g;
}

/* ==========================================================================
   forces/lib.js: art shared by the Forces & Motion scenes. Bundled after
   engine/lib.js and kit.js, so it uses their C, W, H, E, G, T, tr, op, attr,
   setText, clamp, lerp, ball, glow, linGrad, rng, person ...

     FM                                    force colours and names, the lesson's numbers
     fmArrow(parent, kind, x, y, newtons, dir, o)  a force arrow TO SCALE, labelled "weight 20 N"
     fmScaleBar(parent, x, y, newtons, o)  the key that goes with it: a bar labelled "10 N"
     fmDim(parent, x1, y1, x2, y2, text, o)  a distance bracket: "2 m", "3 cm"
     fmCrate(parent, w, h, o)              wooden crate standing on (0,0); g.at(x, y) gives anchor points
     fmFloor(parent, x1, x2, y, o)         ground line with hatching (o.rough: bumpy, for friction)
     fmSpring(parent, o)                   coil spring hanging down from (0,0); g.set(length)
     fmNewtonmeter(parent, o)              spring balance hanging from (0,0); g.set(newtons)
     fmMasses(parent, o)                   slotted 1 N masses on a hanger; g.set(count)
     fmBag(parent, text, o)                a sack labelled "2 kg", hanging from (0,0)
     fmGraph(parent, o)                    axes, ticks and labels; g.px(), g.line(), g.dots()
     fmSeesaw(parent, o)                   beam on a pivot, marked in metres; g.set(tilt), g.at(d)
     fmMoon(parent, o), fmSky(parent, o)   full-stage Moon and Earth backdrops
     fmHammer(parent, s), fmFeather(parent, s)
     fmAstronaut(parent, o)                kit person in a spacesuit (g.pose as for person)
     fmCar(parent, o)                      side-on car standing on (0,0); g.roll(distance)
     fmCyclist(parent, o)                  kit person riding a bike; g.roll(distance) pedals
     fmExtension(newtons)                  the Hooke chapter's spring: extension in cm

   FORCE ARROWS ARE TO SCALE: length = newtons x o.scale (px per newton). Pick
   one scale per scene, use it for every arrow in that scene, and show it with
   fmScaleBar whenever numbers are on screen. Colours come from the kind of
   force (FM.col), so every chapter matches the storyboard's key. Directions
   follow the physics: weight from the object's centre straight down; the
   normal force from the contact surface, at right angles to it; friction along
   the surface, against the motion; drag straight back; upthrust straight up;
   tension along the rope, away from the object. On vehicles (fmCar, fmCyclist)
   start the driving force at g.pt.front pointing forwards, and drag at
   g.pt.back pointing backwards, so neither arrow covers the art.

   Same rules as lib.js: build once, then every frame call g.set(...) with
   values worked out from the chapter time t (pure functions of their inputs).
   ========================================================================== */

const FM = {
  col: {
    weight: C.glucose, normal: C.water, upthrust: C.water, friction: C.oxygen, drag: C.oxygen,
    push: C.good, pull: C.good, drive: C.good, tension: C.ethanol, magnetic: C.lactic,
    electrostatic: C.lactic, resultant: C.energy,
  },
  name: {
    weight: 'weight', normal: 'normal force', upthrust: 'upthrust', friction: 'friction', drag: 'drag',
    push: 'push', pull: 'pull', drive: 'driving force', tension: 'tension', magnetic: 'magnetic',
    electrostatic: 'electrostatic', resultant: 'resultant',
  },
  scale: 4,                                         // default px per newton (10 N = 40 px)
  g: { earth: 10, moon: 1.6 },                      // N/kg, as the lesson uses them
  spring: { L0: 10, perN: 3, limit: 4, perm: 2 },   // cm: natural length, stretch per N, elastic limit (N), stretch kept after overloading
  wood: ['#C08A52', '#8A5A2E', '#E3B57E'],          // mid, dark, light
  metal: ['#DCE6EE', '#8597A6', '#B9C6D2'],         // light, dark, mid
};

/* ---------- small helpers ---------- */
/* unit vector for 'up' | 'down' | 'left' | 'right' or screen degrees (0 right, 90 down) */
function _fmDir(dir) {
  if (dir === 'up') return [0, -1];
  if (dir === 'down') return [0, 1];
  if (dir === 'left') return [-1, 0];
  if (dir === 'right' || dir === undefined) return [1, 0];
  const a = dir * Math.PI / 180; return [Math.cos(a), Math.sin(a)];
}
/* "20 N", "3.2 N", "0.5 N" */
function _fmN(n) { const r = Math.round(n * 10) / 10; return (Number.isInteger(r) ? String(r) : r.toFixed(1)) + ' N'; }
/* tick label: 2, 0.5, 1.6 */
function _fmNum(v) { const r = Math.round(v * 100) / 100; return String(r); }
/* path of a J-hook hanging from (x, y); its lowest point, where a load hangs, is (x, y + 26) */
function _fmHookD(x, y) {
  const f = v => v.toFixed(1);
  return `M${f(x)},${f(y)} L${f(x)},${f(y + 6)} C${f(x + 11)},${f(y + 8)} ${f(x + 11)},${f(y + 26)} ${f(x)},${f(y + 26)} C${f(x - 9)},${f(y + 26)} ${f(x - 11)},${f(y + 19)} ${f(x - 8)},${f(y + 14)}`;
}

/* ---------- force arrows ---------- */
/* A force arrow to scale, newtons x o.scale px long, in the colour of its kind (FM.col).
   (x, y) is where the force acts (the tail); o.tip: (x, y) is the TIP instead, for a push drawn into an object.
   dir: 'up' | 'down' | 'left' | 'right' or screen degrees (0 right, 90 down).
   o: scale (px per newton, FM.scale), label (text before the value; default FM.name[kind]; '' for none),
   value (false hides the "20 N"), side ('auto' | 'left' | 'right' | 'above' | 'below'; auto puts it right of
   an upright arrow and above a sideways one), labelAt ('mid' | 'tip', beyond the head), width (8; 11 for a
   resultant), size (label size, 26), color (overrides the kind's colour), nudge ([dx, dy] shifts the label).
   g.set(p, newtons): p grows it from the tail (0..1; the label fades in at the end); newtons resizes it
   (drag growing with speed), and the label's value follows. g.move(x, y, dir) re-anchors it.
   g.end() -> [x, y] of the tip now; g.len() -> its full length in px. */
function fmArrow(parent, kind, x, y, newtons, dir, o) {
  o = o || {};
  const col = o.color || FM.col[kind] || C.ink, w = o.width || (kind === 'resultant' ? 11 : 8), size = o.size || 26;
  const sc = o.scale || FM.scale, hs = o.head || w * 3.1;
  const g = G(parent);
  const shaft = E('line', { stroke: col, 'stroke-width': w, 'stroke-linecap': 'butt' }, g);   // butt: the length is exact
  const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col, 'stroke-linejoin': 'round' }, g);
  const name = o.label === undefined ? (FM.name[kind] || '') : o.label;
  const lab = (name || o.value !== false) ? T(g, 0, 0, ' ', { size, weight: 700, fill: col }) : null;
  let d = _fmDir(dir), N = newtons, prog = 1, ax = x, ay = y;
  const geo = () => {
    const L = Math.max(0, N * sc), sx = o.tip ? ax - d[0] * L : ax, sy = o.tip ? ay - d[1] * L : ay, len = L * prog;
    return { L, sx, sy, len, ex: sx + d[0] * len, ey: sy + d[1] * len };
  };
  const draw = () => {
    const q = geo(), show = q.len > 1.5;
    op(shaft, show ? 1 : 0); op(head, show ? 1 : 0);
    if (show) {
      const k = Math.min(1, q.len / (hs * 1.4)), back = hs * 0.6 * k;   // short arrows get a smaller head
      attr(shaft, 'x1', q.sx); attr(shaft, 'y1', q.sy); attr(shaft, 'x2', q.ex - d[0] * back); attr(shaft, 'y2', q.ey - d[1] * back);
      head.setAttribute('transform', `translate(${q.ex.toFixed(1)} ${q.ey.toFixed(1)}) rotate(${(Math.atan2(d[1], d[0]) * 180 / Math.PI).toFixed(2)}) scale(${k.toFixed(3)})`);
    }
    if (!lab) return;
    setText(lab, [name, o.value === false ? '' : _fmN(N)].filter(Boolean).join(' '));
    const upright = Math.abs(d[1]) >= Math.abs(d[0]), gap = w / 2 + 14;
    let lx, ly, anchor = 'middle';
    if (o.labelAt === 'tip') {
      const tx = q.sx + d[0] * q.L, ty = q.sy + d[1] * q.L;
      if (upright) { lx = tx; ly = d[1] > 0 ? ty + 14 + size * 0.8 : ty - 16; }
      else { lx = tx + d[0] * 16; ly = ty + size * 0.35; anchor = d[0] > 0 ? 'start' : 'end'; }
    } else {
      const mx = q.sx + d[0] * q.L / 2, my = q.sy + d[1] * q.L / 2;
      let side = o.side || 'auto';
      if (side === 'auto') side = upright ? 'right' : 'above';
      if (side === 'right') { lx = mx + gap; ly = my + size * 0.35; anchor = 'start'; }
      else if (side === 'left') { lx = mx - gap; ly = my + size * 0.35; anchor = 'end'; }
      else if (side === 'below') { lx = mx; ly = my + gap + size * 0.75; }
      else { lx = mx; ly = my - gap; }
    }
    if (o.nudge) { lx += o.nudge[0]; ly += o.nudge[1]; }
    attr(lab, 'x', lx); attr(lab, 'y', ly); lab.setAttribute('text-anchor', anchor);
    op(lab, q.L > 1.5 ? clamp(prog * 4 - 3) : 0);
  };
  g.set = (p, n) => { prog = clamp(p); if (n !== undefined) N = Math.max(0, n); draw(); };
  g.move = (x2, y2, dir2) => { ax = x2; ay = y2; if (dir2 !== undefined) d = _fmDir(dir2); draw(); };
  g.end = () => { const q = geo(); return [q.ex, q.ey]; };
  g.len = () => Math.max(0, N * sc);
  draw();
  return g;
}
/* The scale key for a scene: a bar newtons x o.scale long from (x, y) to the right, with end ticks and its
   value above ("10 N"). o: scale (FM.scale), color (C.muted), size (24), text. g.set(p) fades it. */
function fmScaleBar(parent, x, y, newtons, o) {
  o = o || {};
  const g = G(parent), L = newtons * (o.scale || FM.scale), col = o.color || C.muted;
  E('line', { x1: x, y1: y, x2: x + L, y2: y, stroke: col, 'stroke-width': 4 }, g);
  [x, x + L].forEach(xx => E('line', { x1: xx, y1: y - 9, x2: xx, y2: y + 9, stroke: col, 'stroke-width': 4 }, g));
  T(g, x + L / 2, y - 18, o.text || _fmN(newtons), { size: o.size || 24, weight: 600, fill: col, anchor: 'middle' });
  g.set = p => op(g, p);
  return g;
}
/* A distance bracket from (x1, y1) to (x2, y2): a line with end ticks and a label at its middle.
   o: off (shift the whole bracket sideways by this many px, e.g. below a beam), tick (12), color (C.muted),
   textColor (C.ink), size (26), side ('below' | 'above' for a level bracket, 'right' | 'left' for an upright
   one; default below / right). g.set(p) fades it; g.to(x1, y1, x2, y2, text) moves and relabels it. */
function fmDim(parent, x1, y1, x2, y2, text, o) {
  o = o || {};
  const g = G(parent), col = o.color || C.muted, size = o.size || 26, tk = o.tick || 12;
  const line = E('line', { stroke: col, 'stroke-width': 3 }, g);
  const t1 = E('line', { stroke: col, 'stroke-width': 3 }, g), t2 = E('line', { stroke: col, 'stroke-width': 3 }, g);
  const lab = T(g, 0, 0, text || ' ', { size, weight: 700, fill: o.textColor || C.ink, anchor: 'middle' });
  g.to = (a1, b1, a2, b2, txt) => {
    const dx = a2 - a1, dy = b2 - b1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, off = o.off || 0;
    const p1 = [a1 + nx * off, b1 + ny * off], p2 = [a2 + nx * off, b2 + ny * off];
    attr(line, 'x1', p1[0]); attr(line, 'y1', p1[1]); attr(line, 'x2', p2[0]); attr(line, 'y2', p2[1]);
    [[t1, p1], [t2, p2]].forEach(([t, p]) => { attr(t, 'x1', p[0] - nx * tk); attr(t, 'y1', p[1] - ny * tk); attr(t, 'x2', p[0] + nx * tk); attr(t, 'y2', p[1] + ny * tk); });
    const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, level = Math.abs(dx) >= Math.abs(dy);
    const side = o.side || (level ? 'below' : 'right');
    if (side === 'below') { attr(lab, 'x', mx); attr(lab, 'y', my + tk + size * 0.85); lab.setAttribute('text-anchor', 'middle'); }
    else if (side === 'above') { attr(lab, 'x', mx); attr(lab, 'y', my - tk - 8); lab.setAttribute('text-anchor', 'middle'); }
    else if (side === 'left') { attr(lab, 'x', mx - tk - 10); attr(lab, 'y', my + size * 0.35); lab.setAttribute('text-anchor', 'end'); }
    else { attr(lab, 'x', mx + tk + 10); attr(lab, 'y', my + size * 0.35); lab.setAttribute('text-anchor', 'start'); }
    if (txt !== undefined) setText(lab, txt);
  };
  g.set = p => op(g, p);
  g.to(x1, y1, x2, y2);
  return g;
}

/* ---------- objects ---------- */
/* A wooden crate w x h standing on (0,0) (its base centre). o.label: text on its side.
   g.at(x, y) places it with its base centre at (x, y) and sets g.pt, anchor points in the parent:
   centre (weight acts here), bottom (normal force and friction act here), top, left, right (mid-height sides,
   for pushes and pulls), bl, br (bottom corners). */
function fmCrate(parent, w, h, o) {
  w = w || 150; h = h || 120; o = o || {};
  const g = G(parent), [mid, dk, lt] = FM.wood;
  E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 6, fill: linGrad(lt, mid, true), stroke: dk, 'stroke-width': 5 }, g);
  for (let i = 1; i < 3; i++) E('line', { x1: -w / 2 + 6, x2: w / 2 - 6, y1: -h * i / 3, y2: -h * i / 3, stroke: dk, 'stroke-width': 2.5, opacity: 0.45 }, g);
  E('rect', { x: -w / 2 + 10, y: -h + 10, width: w - 20, height: h - 20, rx: 3, fill: 'none', stroke: dk, 'stroke-width': 5 }, g);
  E('line', { x1: -w / 2 + 14, y1: -14, x2: w / 2 - 14, y2: -h + 14, stroke: dk, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  if (o.label) T(g, 0, -h / 2 + 11, o.label, { size: o.size || 30, weight: 700, fill: '#2B1A0C', anchor: 'middle' });
  g.w = w; g.h = h;
  g.at = (x, y) => {
    tr(g, x, y);
    g.pt = { centre: [x, y - h / 2], bottom: [x, y], top: [x, y - h], left: [x - w / 2, y - h / 2], right: [x + w / 2, y - h / 2], bl: [x - w / 2, y], br: [x + w / 2, y] };
    return g;
  };
  g.at(0, 0);
  return g;
}
/* The ground: a line from x1 to x2 at height y, hatched underneath. o.rough: a bumpy top (seeded by o.seed)
   for friction close-ups; o.color. */
function fmFloor(parent, x1, x2, y, o) {
  o = o || {};
  const g = G(parent), col = o.color || '#8FA3B3';
  if (o.rough) {
    const rr = rng(o.seed || 5), pts = [];
    for (let x = x1; x <= x2; x += 14) pts.push(`${x},${(y - rr() * (o.rough === true ? 7 : o.rough)).toFixed(1)}`);
    E('polyline', { points: pts.join(' '), fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  } else E('line', { x1, x2, y1: y, y2: y, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  for (let x = x1 + 18; x < x2 - 4; x += 28) E('line', { x1: x, y1: y + 5, x2: x - 16, y2: y + 23, stroke: col, 'stroke-width': 3, opacity: 0.5, 'stroke-linecap': 'round' }, g);
  return g;
}

/* ---------- springs, newtonmeters, masses ---------- */
/* A coil spring hanging down from (0,0): a helix with its far side shaded. o: coils (12), r (half-width, 22),
   width (stroke, 5), lead (straight end, 12), len (start length), color, back (far-side colour), hook (true:
   a J-hook at the bottom). g.set(length, warp): the coils spread evenly as it stretches (it is never shorter
   than its closed coils, 2 x lead + 4.5 px a coil); warp (0..1) makes the spacing uneven, for a spring
   stretched past its elastic limit. g.end() -> [0, y] where a load hangs (the bottom of the hook). */
function fmSpring(parent, o) {
  o = o || {};
  const g = G(parent), r = o.r || 22, n = o.coils || 12, lead = o.lead || 12, sw = o.width || 5, col = o.color || FM.metal[0];
  const back = E('path', { fill: 'none', stroke: o.back || FM.metal[1], 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const front = E('path', { fill: 'none', stroke: col, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const hook = o.hook === false ? null : E('path', { fill: 'none', stroke: col, 'stroke-width': sw + 1, 'stroke-linecap': 'round' }, g);
  let len = 0;
  g.set = (L, warp) => {
    len = Math.max(lead * 2 + n * 4.5, L); warp = warp || 0;
    const span = len - lead * 2, t0 = Math.PI / 2, t1 = t0 + TAU * n;
    let fd = `M0,0 L0,${lead}`, bd = '', a = t0;
    while (a < t1 - 1e-6) {
      const b = Math.min(t1, (Math.floor(a / Math.PI + 1e-9) + 1) * Math.PI), isFront = Math.sin((a + b) / 2) > 0;
      let seg = '';
      for (let k = 0; k <= 6; k++) {
        const th = a + (b - a) * k / 6, u = (th - t0) / (t1 - t0);
        const yy = lead + span * (u + warp * 0.05 * Math.sin(3 * Math.PI * u)), xx = r * Math.cos(th);
        seg += (k === 0 && !(isFront && a === t0) ? ' M' : ' L') + xx.toFixed(1) + ',' + yy.toFixed(1);
      }
      if (isFront) fd += seg; else bd += seg;
      a = b;
    }
    front.setAttribute('d', fd + ` L0,${len.toFixed(1)}`);
    back.setAttribute('d', bd || 'M0,0');
    if (hook) hook.setAttribute('d', _fmHookD(0, len));
  };
  g.end = () => [0, len + (hook ? 26 : 0)];
  g.set(o.len || 200);
  return g;
}
/* A newtonmeter (spring balance) hanging from its ring at (0,0). The spring runs down the middle; the scale is
   on a plate to its right, 0 at the top, reading down. o: max (10 N), len (px from 0 to max, 180), every (a
   number every so many newtons, max / 5), minor (a tick every so many newtons, max / 10), readout (true: the
   reading in large yellow text beside the pointer), value (starting reading). g.set(newtons) moves the red
   pointer and stretches the spring; the rod and hook slide down with it, as on a real one, so at full scale
   the hook hangs 2 x len + 160 px below the ring: leave room for the load under that.
   g.hook() -> [x, y] where a load hangs (local coordinates). */
function fmNewtonmeter(parent, o) {
  o = o || {};
  const max = o.max || 10, L = o.len || 180, every = o.every || max / 5, minor = o.minor || max / 10;
  const g = G(parent), top = 30, y0 = top + 8 + 48, bodyB = y0 + L + 26, bw = 70, px0 = bw / 2 - 2, pw = 66;
  E('circle', { cx: 0, cy: 12, r: 11, fill: 'none', stroke: FM.metal[2], 'stroke-width': 5 }, g);
  E('rect', { x: -bw / 2, y: top, width: bw, height: bodyB - top, rx: 14, fill: 'rgba(200,230,250,0.10)', stroke: '#CFE7F5', 'stroke-width': 4 }, g);
  E('rect', { x: -bw / 2 - 4, y: top - 8, width: bw + 8, height: 16, rx: 6, fill: '#8E9CA9', stroke: FM.metal[2], 'stroke-width': 2 }, g);
  E('rect', { x: px0, y: y0 - 22, width: pw, height: L + 44, rx: 8, fill: '#E9F2F7', stroke: FM.metal[2], 'stroke-width': 2 }, g);
  for (let i = 0; i * minor <= max + 1e-9; i++) {
    const v = i * minor, yy = y0 + L * v / max, major = Math.abs(v / every - Math.round(v / every)) < 1e-6;
    E('line', { x1: px0, x2: px0 + (major ? 18 : 10), y1: yy, y2: yy, stroke: '#22323D', 'stroke-width': major ? 3 : 2 }, g);
    if (major) T(g, px0 + 24, yy + 8, _fmNum(v), { size: 24, weight: 700, fill: '#22323D' });
  }
  T(g, px0 + pw / 2, y0 + L + 40 + 8, 'N', { size: 24, weight: 700, fill: C.muted, anchor: 'middle' });
  const spr = fmSpring(g, { r: 15, coils: 8, lead: 6, width: 4, hook: false }); tr(spr, 0, top + 8);
  const rod = E('line', { x1: 0, x2: 0, stroke: FM.metal[2], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  const ptr = E('line', { x1: -bw / 2 + 7, x2: px0 + 6, stroke: C.bad, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  const hook = E('path', { fill: 'none', stroke: FM.metal[2], 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  const read = o.readout ? T(g, px0 + pw + 16, 0, ' ', { size: 34, weight: 700, fill: C.energy }) : null;
  const rodLen = bodyB - y0 + 22;
  let hy = 0;
  g.set = n => {
    const v = clamp(n, 0, max), yp = y0 + L * v / max;
    spr.set(yp - (top + 8));
    attr(ptr, 'y1', yp); attr(ptr, 'y2', yp);
    hy = yp + rodLen;
    attr(rod, 'y1', yp); attr(rod, 'y2', hy);
    hook.setAttribute('d', _fmHookD(0, hy));
    if (read) { setText(read, _fmN(n)); attr(read, 'y', yp + 12); }
  };
  g.hook = () => [0, hy + 26];
  g.set(o.value || 0);
  return g;
}
/* Slotted masses on a hanger, hanging from its loop at (0,0). o: n (discs, 5), per (newtons per disc, 1),
   w (disc width, 64), label (true: the total, e.g. "3 N", in weight amber, to the right). g.set(k) shows k
   discs (0..n), stacked from the base up. g.bottom: y of the base plate's underside. */
function fmMasses(parent, o) {
  o = o || {};
  const g = G(parent), n = o.n || 5, per = o.per || 1, dw = o.w || 64, dh = 16, rodTop = 30;
  const baseY = rodTop + (n + 0.5) * dh + 4;
  E('path', { d: `M0,${rodTop} L0,13 C0,-4 -17,-4 -17,9`, fill: 'none', stroke: FM.metal[2], 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  E('line', { x1: 0, y1: rodTop, x2: 0, y2: baseY, stroke: FM.metal[2], 'stroke-width': 5 }, g);
  E('rect', { x: -dw / 2 - 5, y: baseY, width: dw + 10, height: 9, rx: 3, fill: FM.metal[1], stroke: FM.metal[2], 'stroke-width': 1.5 }, g);
  const discs = [];
  for (let i = 0; i < n; i++) {
    const yy = baseY - (i + 1) * dh, dg = G(g);
    E('rect', { x: -dw / 2, y: yy + 1, width: dw, height: dh - 2, rx: 5, fill: linGrad('#AEBBC6', '#5F6E7B', true), stroke: '#D5DEE5', 'stroke-width': 1.5 }, dg);
    E('line', { x1: dw / 2 - 16, y1: yy + 3, x2: dw / 2 - 16, y2: yy + dh - 3, stroke: '#3A4651', 'stroke-width': 2 }, dg);
    discs.push(dg);
  }
  const lab = o.label === false ? null : T(g, dw / 2 + 16, baseY - 4, ' ', { size: 26, weight: 700, fill: C.glucose });
  g.set = k => {
    k = Math.max(0, Math.min(n, Math.round(k)));
    discs.forEach((dg, i) => op(dg, i < k ? 1 : 0));
    if (lab) setText(lab, k ? _fmN(k * per) : ' ');
  };
  g.bottom = baseY + 9;
  g.set(o.count === undefined ? n : o.count);
  return g;
}
/* A sack labelled text ("2 kg"), hanging from its loop at (0,0); about 120 x 170 at o.s = 1.
   g.centre: [0, y] of its middle (where its weight acts); g.h: its height. */
function fmBag(parent, text, o) {
  o = o || {};
  const s = o.s || 1, g = G(parent), inner = G(g); tr(inner, 0, 0, s);
  E('path', { d: 'M-11,24 C-13,-7 13,-7 11,24', fill: 'none', stroke: '#8A6A3E', 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
  E('path', { d: 'M-16,32 L16,32 C54,52 64,124 52,154 Q0,172 -52,154 C-64,124 -54,52 -16,32 Z', fill: ball('#DDBB82', '#A07A45'), stroke: '#7A5A30', 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
  E('rect', { x: -19, y: 24, width: 38, height: 11, rx: 4, fill: '#7A5A30' }, inner);
  T(inner, 0, 116, text || '1 kg', { size: 36, weight: 700, fill: '#3B2A14', anchor: 'middle' });
  g.centre = [0, 100 * s]; g.h = 170 * s;
  return g;
}

/* ---------- graphs ---------- */
/* Axes with the origin at (0,0): x to the right (w px for xmax), y up (h px for ymax). o: w (560), h (380),
   xmax, ymax (10), xstep, ystep (tick spacing, max / 5), xlabel, ylabel (e.g. 'time (s)', 'distance (m)'),
   grid (true), size (axis labels, 26), tick (numbers, 24).
   g.px(x, y) -> [px, py] for a data point. g.line(pts, o) -> a polyline of data points [[x, y], ...] (C.energy,
   o.color, o.width 6, o.dot: a dot rides its end); .set(upto) draws it as far as x = upto, so a graph can plot
   itself live. g.dots(pts, o) -> data dots; .set(k) shows the first k (fractions fade the next one in). */
function fmGraph(parent, o) {
  o = o || {};
  const g = G(parent), w = o.w || 560, h = o.h || 380, xmax = o.xmax || 10, ymax = o.ymax || 10;
  const xs = o.xstep || xmax / 5, ys = o.ystep || ymax / 5, size = o.size || 26, ts = o.tick || 24;
  const px = (x, y) => [x / xmax * w, -y / ymax * h];
  if (o.grid !== false) {
    for (let v = xs; v <= xmax + 1e-9; v += xs) E('line', { x1: px(v, 0)[0], x2: px(v, 0)[0], y1: 0, y2: -h, stroke: C.line, 'stroke-width': 2, opacity: 0.3 }, g);
    for (let v = ys; v <= ymax + 1e-9; v += ys) E('line', { x1: 0, x2: w, y1: px(0, v)[1], y2: px(0, v)[1], stroke: C.line, 'stroke-width': 2, opacity: 0.3 }, g);
  }
  E('path', { d: `M0,${-h - 22} L0,0 L${w + 22},0`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('path', { d: `M${w + 34},0 L${w + 18},-8 L${w + 18},8 Z`, fill: C.muted }, g);
  E('path', { d: `M0,${-h - 34} L-8,${-h - 18} L8,${-h - 18} Z`, fill: C.muted }, g);
  for (let v = 0; v <= xmax + 1e-9; v += xs) { const X = px(v, 0)[0]; E('line', { x1: X, x2: X, y1: 0, y2: 9, stroke: C.muted, 'stroke-width': 3 }, g); T(g, X, 36, _fmNum(v), { size: ts, weight: 600, fill: C.muted, anchor: 'middle' }); }
  for (let v = ys; v <= ymax + 1e-9; v += ys) { const Y = px(0, v)[1]; E('line', { x1: -9, x2: 0, y1: Y, y2: Y, stroke: C.muted, 'stroke-width': 3 }, g); T(g, -16, Y + 8, _fmNum(v), { size: ts, weight: 600, fill: C.muted, anchor: 'end' }); }
  if (o.xlabel) T(g, w / 2, 78, o.xlabel, { size, weight: 700, fill: C.ink, anchor: 'middle' });
  if (o.ylabel) { const yl = T(g, 0, 0, o.ylabel, { size, weight: 700, fill: C.ink, anchor: 'middle' }); yl.setAttribute('transform', `translate(${o.ylabelX || -78} ${-h / 2}) rotate(-90)`); }
  g.px = px; g.w = w; g.h = h;
  g.line = (pts, lo) => {
    lo = lo || {};
    const lg = G(g), col = lo.color || C.energy;
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': lo.width || 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lg);
    const dot = lo.dot ? E('circle', { r: lo.dotR || 10, fill: col, stroke: C.bg0, 'stroke-width': 3 }, lg) : null;
    lg.set = upto => {
      let d = '', last = null;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p[0] <= upto) { const q = px(p[0], p[1]); d += (d ? ' L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1); last = q; continue; }
        if (i > 0 && pts[i - 1][0] < upto) {
          const a = pts[i - 1], f = (upto - a[0]) / (p[0] - a[0]), q = px(lerp(a[0], p[0], f), lerp(a[1], p[1], f));
          d += ' L' + q[0].toFixed(1) + ',' + q[1].toFixed(1); last = q;
        }
        break;
      }
      path.setAttribute('d', d || 'M0,0'); op(path, d ? 1 : 0);
      if (dot) { op(dot, last ? 1 : 0); if (last) { attr(dot, 'cx', last[0]); attr(dot, 'cy', last[1]); } }
    };
    lg.set(Infinity);
    return lg;
  };
  g.dots = (pts, lo) => {
    lo = lo || {};
    const dg = G(g), els = pts.map(p => { const q = px(p[0], p[1]); return E('circle', { cx: q[0], cy: q[1], r: lo.r || 9, fill: lo.color || C.energy, stroke: C.bg0, 'stroke-width': 3 }, dg); });
    dg.set = k => els.forEach((e, i) => op(e, clamp(k - i)));
    dg.set(pts.length);
    return dg;
  };
  return g;
}

/* ---------- seesaw ---------- */
/* A seesaw: a beam len px long resting on a pivot whose top is at (0,0), marked every metre.
   o: len (760), pxPerM (150; the storyboard's moments scale), thick (16), pivotH (90), marks (true).
   g.set(deg) tilts the beam about the pivot (positive: right side down). g.at(d) -> [x, y] on the beam's top
   surface d metres from the pivot (negative: left), allowing for the tilt; stand loads there and draw their
   weight arrows straight down from their centres. g.m: px per metre. */
function fmSeesaw(parent, o) {
  o = o || {};
  const g = G(parent), len = o.len || 760, m = o.pxPerM || 150, th = o.thick || 16, ph = o.pivotH || 90;
  E('path', { d: `M0,0 L${-ph * 0.6},${ph} L${ph * 0.6},${ph} Z`, fill: linGrad('#9DB0BF', '#5F6E7B', true), stroke: FM.metal[2], 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const beam = G(g);
  E('rect', { x: -len / 2, y: -th, width: len, height: th, rx: th / 2, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 3 }, beam);
  if (o.marks !== false) for (let d = 1; d * m <= len / 2 - 12; d++) [-1, 1].forEach(s => E('line', { x1: s * d * m, x2: s * d * m, y1: -th + 3, y2: -3, stroke: FM.wood[1], 'stroke-width': 3 }, beam));
  E('circle', { cx: 0, cy: -th / 2, r: 6, fill: FM.metal[2], stroke: FM.metal[1], 'stroke-width': 2 }, beam);
  let ang = 0;
  g.set = deg => { ang = deg || 0; beam.setAttribute('transform', `rotate(${ang.toFixed(2)})`); };
  g.at = d => { const a = ang * Math.PI / 180, x = d * m, y = -th; return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]; };
  g.m = m; g.len = len;
  g.set(0);
  return g;
}

/* ---------- backdrops ---------- */
/* The Moon, filling the stage: black sky with stars, the Earth above the horizon, grey ground from y = o.ground
   (600) down. o: stars (70), seed, earth (false hides it), earthX, earthY, earthR. g.ground: the ground's y. */
function fmMoon(parent, o) {
  o = o || {};
  const g = G(parent), gy = o.ground || 600, rr = rng(o.seed || 11);
  E('rect', { x: 0, y: 0, width: W, height: gy, fill: '#04070C' }, g);
  for (let i = 0; i < (o.stars || 70); i++) E('circle', { cx: (rr() * W).toFixed(1), cy: (rr() * (gy - 30)).toFixed(1), r: (0.8 + rr() * 1.7).toFixed(2), fill: '#FFFFFF', opacity: (0.3 + rr() * 0.6).toFixed(2) }, g);
  if (o.earth !== false) {
    const ex = o.earthX || 1000, ey = o.earthY || 150, er = o.earthR || 42;
    E('circle', { cx: ex, cy: ey, r: er * 2, fill: glow('#4CC9F0'), opacity: 0.45 }, g);
    E('circle', { cx: ex, cy: ey, r: er, fill: ball('#4C9BE8', '#1D4E8F') }, g);
    E('path', { d: `M${ex - er * 0.55},${ey - er * 0.35} q${er * 0.3},${-er * 0.25} ${er * 0.55},${-er * 0.05} q${er * 0.1},${er * 0.35} ${-er * 0.2},${er * 0.55} q${-er * 0.35},${er * 0.1} ${-er * 0.35},${-er * 0.5} Z M${ex + er * 0.1},${ey + er * 0.25} q${er * 0.35},${-er * 0.1} ${er * 0.45},${er * 0.2} q${-er * 0.15},${er * 0.3} ${-er * 0.45},${er * 0.25} Z`, fill: '#5BD27A', opacity: 0.85 }, g);
    E('path', { d: `M${ex},${ey - er} A${er},${er} 0 0 1 ${ex},${ey + er} A${er * 0.55},${er} 0 0 0 ${ex},${ey - er} Z`, fill: '#04070C', opacity: 0.55 }, g);
  }
  E('rect', { x: 0, y: gy, width: W, height: H - gy, fill: linGrad('#A3ABB3', '#5E666E', true) }, g);
  E('line', { x1: 0, x2: W, y1: gy, y2: gy, stroke: '#C9D0D6', 'stroke-width': 3 }, g);
  for (let i = 0; i < 9; i++) { const cx = 60 + rr() * (W - 120), cy = gy + 30 + rr() * (H - gy - 50), rx = 18 + rr() * 40; E('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: rx.toFixed(1), ry: (rx * 0.28).toFixed(1), fill: '#757D85', stroke: '#B8C0C7', 'stroke-width': 2, opacity: 0.75 }, g); }
  g.ground = gy;
  return g;
}
/* Earth outdoors, filling the stage: a muted blue sky over green ground from y = o.ground (600) down.
   g.ground: the ground's y. */
function fmSky(parent, o) {
  o = o || {};
  const g = G(parent), gy = o.ground || 600;
  E('rect', { x: 0, y: 0, width: W, height: gy, fill: linGrad('#16405A', '#3C7FA0', true) }, g);
  [[230, 150, 120], [820, 110, 160], [1050, 210, 90]].forEach(([x, y, r]) => E('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.32, fill: '#DDEBF3', opacity: 0.16 }, g));
  E('rect', { x: 0, y: gy, width: W, height: H - gy, fill: linGrad('#3E8A4E', '#22512C', true) }, g);
  E('line', { x1: 0, x2: W, y1: gy, y2: gy, stroke: '#78C27C', 'stroke-width': 4 }, g);
  g.ground = gy;
  return g;
}

/* ---------- the hammer, the feather, the astronaut ---------- */
/* A hammer about 90 x 150 at s = 1, centred near its balance point, head up. */
function fmHammer(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('rect', { x: -7, y: -38, width: 14, height: 118, rx: 6, fill: linGrad('#D19A5E', '#8A5A2E'), stroke: '#6B4423', 'stroke-width': 2 }, inner);
  E('path', { d: 'M-40,-64 L30,-64 Q42,-64 42,-52 L42,-40 Q42,-30 30,-30 L-40,-30 Q-50,-30 -50,-42 L-50,-52 Q-50,-64 -40,-64 Z', fill: linGrad('#D5DDE3', '#6E7C88', true), stroke: '#4E5A64', 'stroke-width': 2.5 }, inner);
  return g;
}
/* A feather about 50 x 170 at s = 1, centred, quill down. */
function fmFeather(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('path', { d: 'M2,-82 C30,-62 32,-10 16,38 C10,56 4,66 2,72 C-6,52 -24,12 -22,-30 C-20,-60 -8,-76 2,-82 Z', fill: '#F2F7FA', stroke: '#C9D6DF', 'stroke-width': 2 }, inner);
  for (let i = 0; i < 6; i++) { const y = -58 + i * 18; E('path', { d: `M2,${y} Q${i % 2 ? 14 : -12},${y + 8} ${i % 2 ? 22 : -18},${y + 4}`, fill: 'none', stroke: '#C9D6DF', 'stroke-width': 1.5 }, inner); }
  E('path', { d: 'M2,-80 C4,-30 4,30 2,92', fill: 'none', stroke: '#B5C3CD', 'stroke-width': 3, 'stroke-linecap': 'round' }, inner);
  return g;
}
/* An astronaut: a kit person (about 190 tall, feet at (0,0), facing right) in a white suit, with a helmet,
   gold visor and backpack. g.pose(...) as for person(). */
function fmAstronaut(parent, o) {
  o = o || {};
  const suit = o.suit || '#E8EEF3';
  const g = person(parent, { shirt: suit, shorts: '#D8E0E6', skin: suit, hair: suit, shoes: '#9AA8B4' });
  const body = g.firstChild;
  const pack = E('rect', { x: -30, y: -160, width: 26, height: 64, rx: 8, fill: '#C3CDD5', stroke: '#8E9CA9', 'stroke-width': 2 });
  body.insertBefore(pack, body.firstChild);
  E('circle', { cx: 0, cy: -175, r: 28, fill: 'rgba(220,235,245,0.20)', stroke: '#F2F7FA', 'stroke-width': 4 }, body);
  E('path', { d: 'M3,-190 Q24,-184 22,-164 Q12,-158 3,-160 Z', fill: C.glucose, opacity: 0.8 }, body);
  return g;
}

/* ---------- vehicles ---------- */
/* A car side-on, about 270 x 120, wheels on the ground at y = 0, facing right (o.flip: left). o.color (silver,
   so it never reads as a force colour). g.roll(distance) turns the wheels by the distance travelled (px).
   g.pt: anchor points, front and back (bumpers, for driving force and drag), centre, roof. */
function fmCar(parent, o) {
  o = o || {};
  const g = G(parent), inner = G(g), col = o.color || '#C9D6DF', r = 28;
  if (o.flip) inner.setAttribute('transform', 'scale(-1 1)');
  E('path', { d: 'M-132,-32 L-132,-62 Q-130,-75 -114,-77 L-66,-79 L-36,-112 Q-29,-119 -17,-119 L46,-119 Q58,-119 67,-110 L97,-80 L121,-76 Q135,-72 135,-58 L135,-32 Q135,-23 126,-23 L-123,-23 Q-132,-23 -132,-32 Z', fill: linGrad(col, '#6E7F8D', true), stroke: '#4E5A64', 'stroke-width': 3 }, inner);
  E('path', { d: 'M-26,-84 L-6,-109 L22,-109 L22,-84 Z M32,-109 L55,-109 L80,-84 L32,-84 Z', fill: '#0F2C3A', stroke: '#9FD8FF', 'stroke-width': 2, opacity: 0.92 }, inner);
  E('circle', { cx: 127, cy: -58, r: 6, fill: C.energyLt }, inner);
  E('rect', { x: -132, y: -64, width: 8, height: 12, rx: 3, fill: C.bad }, inner);
  const spins = [-80, 80].map(cx => {
    const wg = G(inner); tr(wg, cx, -r);
    E('circle', { r, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 3 }, wg);
    E('circle', { r: r * 0.5, fill: '#9AA8B4' }, wg);
    const sp = G(wg);
    for (let k = 0; k < 3; k++) E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.48, stroke: '#4E5A64', 'stroke-width': 4, transform: `rotate(${k * 120})` }, sp);
    return sp;
  });
  const s = o.flip ? -1 : 1;
  g.roll = dist => { const deg = s * (dist / r) * 180 / Math.PI; spins.forEach(sp => sp.setAttribute('transform', `rotate(${(deg % 360).toFixed(1)})`)); };
  g.pt = { front: [s * 136, -50], back: [-s * 133, -50], centre: [0, -60], roof: [0, -119] };
  g.roll(0);
  return g;
}
/* Two-link reach (thigh + shin, or upper arm + forearm) from a joint to a target, in the limb's own frame
   (vector v, y down). Returns [upper, lower] angles in kit person() terms (0 = hanging down, + = forward).
   bendBack: the middle joint points backwards (an elbow) instead of forwards (a knee). */
function _fmReach(v, a, b, bendBack) {
  const D = clamp(Math.hypot(v[0], v[1]), Math.abs(a - b) + 0.5, a + b - 0.5), phi = Math.atan2(v[0], v[1]);
  const al = Math.acos(clamp((a * a + D * D - b * b) / (2 * a * D), -1, 1)), be = Math.acos(clamp((a * a + b * b - D * D) / (2 * a * b), -1, 1));
  const deg = x => x * 180 / Math.PI;
  return bendBack ? [deg(phi - al), deg(Math.PI - be)] : [deg(phi + al), -deg(Math.PI - be)];
}
/* A cyclist side-on, facing right, wheels on the ground at y = 0: a bike with a kit person riding it (about
   200 x 210). o: shirt, shorts, skin, hair (as for person), lean (torso lean, 38), color (frame, C.muted).
   g.roll(distance) turns the wheels by the distance travelled and pedals in step.
   g.pt: anchor points, front (for drag, in front of the rider), back, centre. */
function fmCyclist(parent, o) {
  o = o || {};
  const g = G(parent), r = 36, rear = [-58, -r], frontA = [58, -r], bb = [0, -34], seat = [-20, -102], bar = [50, -108];
  const fcol = o.color || C.muted;
  const wheel = c => { const wg = G(g); tr(wg, c[0], c[1]); E('circle', { r, fill: 'none', stroke: '#1C2329', 'stroke-width': 7 }, wg); E('circle', { r: r - 4, fill: 'none', stroke: '#5F6E7B', 'stroke-width': 2 }, wg); const sp = G(wg); for (let k = 0; k < 4; k++) E('line', { x1: 0, y1: -r + 5, x2: 0, y2: r - 5, stroke: '#8597A6', 'stroke-width': 2, transform: `rotate(${k * 45})` }, sp); E('circle', { r: 4, fill: '#B9C6D2' }, wg); return sp; };
  const spins = [wheel(rear), wheel(frontA)];
  const back = G(g);                                   // far crank and pedal, behind the frame
  E('path', { d: `M${rear[0]},${rear[1]} L${bb[0]},${bb[1]} L${seat[0] + 4},${seat[1] + 10} Z M${bb[0]},${bb[1]} L${bar[0] - 8},${bar[1] + 22} L${seat[0] + 4},${seat[1] + 10} M${bar[0] - 8},${bar[1] + 22} L${frontA[0]},${frontA[1]}`, fill: 'none', stroke: fcol, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  E('path', { d: `M${seat[0] - 14},${seat[1]} L${seat[0] + 14},${seat[1] - 2}`, stroke: '#1C2329', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  E('path', { d: `M${bar[0] - 8},${bar[1] + 22} L${bar[0] - 4},${bar[1]} L${bar[0] + 8},${bar[1] + 2}`, fill: 'none', stroke: '#1C2329', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  const rider = person(g, { shirt: o.shirt || '#5B8DEF', shorts: o.shorts, skin: o.skin, hair: o.hair, shoes: o.shoes });
  const hip = [seat[0], seat[1] - 4]; tr(rider, hip[0], hip[1] + 92);
  const front = G(g);                                  // near crank and pedal, in front of everything
  const crankB = E('line', { stroke: '#3A4651', 'stroke-width': 5, 'stroke-linecap': 'round' }, back), pedB = E('rect', { width: 14, height: 5, rx: 2, fill: '#3A4651' }, back);
  const crankF = E('line', { stroke: '#B9C6D2', 'stroke-width': 5, 'stroke-linecap': 'round' }, front), pedF = E('rect', { width: 14, height: 5, rx: 2, fill: '#B9C6D2' }, front);
  E('circle', { cx: bb[0], cy: bb[1], r: 7, fill: '#B9C6D2' }, front);
  g.insertBefore(back, g.firstChild);
  const lean = o.lean === undefined ? 38 : o.lean, Lr = lean * Math.PI / 180, crank = 15;
  const toBody = v => [v[0] * Math.cos(Lr) + v[1] * Math.sin(Lr), -v[0] * Math.sin(Lr) + v[1] * Math.cos(Lr)];   // undo the torso lean
  g.roll = dist => {
    const wdeg = (dist / r) * 180 / Math.PI, th = dist / r / 2.2;     // pedals turn slower than the wheels (gearing)
    spins.forEach(sp => sp.setAttribute('transform', `rotate(${(wdeg % 360).toFixed(1)})`));
    const pF = [bb[0] + crank * Math.cos(th), bb[1] + crank * Math.sin(th)], pB = [bb[0] - crank * Math.cos(th), bb[1] - crank * Math.sin(th)];
    [[crankF, pedF, pF], [crankB, pedB, pB]].forEach(([c, pd, p]) => { attr(c, 'x1', bb[0]); attr(c, 'y1', bb[1]); attr(c, 'x2', p[0]); attr(c, 'y2', p[1]); attr(pd, 'x', p[0] - 7); attr(pd, 'y', p[1] - 2); });
    const legR = _fmReach(toBody([pF[0] - hip[0], pF[1] - 4 - hip[1]]), 45, 45), legL = _fmReach(toBody([pB[0] - hip[0], pB[1] - 4 - hip[1]]), 45, 45);
    const sh = [hip[0] + 54 * Math.sin(Lr), hip[1] - 54 * Math.cos(Lr)];
    const arm = _fmReach(toBody([bar[0] + 2 - sh[0], bar[1] - sh[1]]), 33, 31, true);
    rider.pose({ lean, legR, legL, armR: arm, armL: [arm[0] - 6, arm[1]] });
  };
  g.pt = { front: [96, -150], back: [-96, -120], centre: [0, -110] };
  g.roll(0);
  return g;
}

/* ---------- the lesson's numbers ---------- */
/* The Hooke chapter's spring (storyboard): 10 cm long, 3 cm more for every newton up to the elastic limit at
   4 N, then curving away (more stretch for each extra newton). Returns the extension in cm for a load in N.
   Unloaded after going past the limit, it stays FM.spring.perm (2) cm longer. */
function fmExtension(newtons) {
  const s = FM.spring, over = Math.max(0, newtons - s.limit);
  return s.perN * Math.max(0, newtons) + 2 * over * over;
}

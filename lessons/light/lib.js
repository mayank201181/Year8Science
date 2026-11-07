/* ==========================================================================
   light/lib.js: shared ray-diagram art for the Light & Optics lesson.
   Bundled after engine/lib.js and engine/kit.js (it uses E, G, T, tr, op, attr,
   clamp, lerp, C, FD ...). Same conventions: each primitive draws around its own
   origin (rays use their parent's coordinates) and returns a <g>; animated parts
   take g.set(...) and friends. Pure functions of their arguments: call them from
   the scene's update(t) as often as you like.

   ANGLES are in degrees on screen: 0° points right and 90° points DOWN (SVG y
   grows downwards), so -90° points up. Optics angles (i, r) are always measured
   FROM THE NORMAL. The geometry helpers below do Snell's law and the law of
   reflection for you, so a diagram built with them is physically right:
     bounceRay  reflection, i = r about the normal
     bendRay    refraction (towards the normal into a denser medium, away out of
                it) or total internal reflection beyond the critical angle
     g.trace    a ray through a glass block or prism (both faces, TIR inside)
     lensImage  where a converging lens focuses a point; eye.rays() for the eye
   Index of refraction: glass 1.5, water 1.33 (LT.nGlass, LT.nWater). Only the
   prism's colour spread is exaggerated (SPECTRUM[k].n), with the order kept.
   ========================================================================== */

const LT = {
  ray: C.energy, white: C.ink, normal: C.muted, angI: C.glucose, angR: C.water,
  mirror: '#DCE6EE', hatch: C.faint,
  glassFill: 'rgba(200,230,250,0.16)', glassStroke: '#CFE7F5', waterFill: 'rgba(76,201,240,0.30)',
  nAir: 1, nWater: 1.33, nGlass: 1.5, nDiamond: 2.42,
};
/* spectrum colours, least bent (red) to most bent (violet); n is an EXAGGERATED index for a visible fan */
const SPECTRUM = [
  { name: 'red', color: '#FF4D4D', n: 1.47 }, { name: 'orange', color: '#FF9A3C', n: 1.49 },
  { name: 'yellow', color: '#FFE45C', n: 1.51 }, { name: 'green', color: '#4CD964', n: 1.535 },
  { name: 'blue', color: '#3B82F6', n: 1.56 }, { name: 'indigo', color: '#5B5BD6', n: 1.595 },
  { name: 'violet', color: '#A066FF', n: 1.63 },
];

/* ---------- geometry (screen degrees, y down) ---------- */
function ltDir(deg) { const a = deg * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; }
function ltAng(v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; }
/* the point len away from (x, y) in direction deg */
function ltPt(x, y, deg, len) { const d = ltDir(deg); return [x + d[0] * len, y + d[1] * len]; }
/* Snell's law: angle of refraction (deg) for angle of incidence i (deg) going from index n1 into n2;
   null when there is none (total internal reflection) */
function snellAngle(i, n1, n2) { const s = n1 / n2 * Math.sin(i * Math.PI / 180); return Math.abs(s) > 1 ? null : Math.asin(s) * 180 / Math.PI; }
/* critical angle (deg) going from the denser n1 into n2 (glass to air: 41.8°) */
function criticalAngle(n1, n2) { return Math.asin((n2 || 1) / n1) * 180 / Math.PI; }
function _ltUnit(v) { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
/* direction d reflected by a surface with normal nrm (either sign) */
function reflectVec(d, nrm) { d = _ltUnit(d); nrm = _ltUnit(nrm); const k = 2 * (d[0] * nrm[0] + d[1] * nrm[1]); return [d[0] - k * nrm[0], d[1] - k * nrm[1]]; }
/* direction d refracted crossing a surface with normal nrm (either sign) from index n1 into n2; null = TIR */
function refractVec(d, nrm, n1, n2) {
  d = _ltUnit(d); nrm = _ltUnit(nrm);
  let c = -(d[0] * nrm[0] + d[1] * nrm[1]);
  if (c < 0) { nrm = [-nrm[0], -nrm[1]]; c = -c; }
  const eta = n1 / n2, k = 1 - eta * eta * (1 - c * c);
  if (k < 0) return null;
  const m = eta * c - Math.sqrt(k);
  return [eta * d[0] + m * nrm[0], eta * d[1] + m * nrm[1]];
}
/* Reflection at (x, y). normalDeg: the normal, pointing out of the mirror towards the light.
   theta: angle of incidence from that normal; its sign picks the side the light comes from
   (the ray starts in direction normalDeg + theta). Returns { a: start, o: hit point, b: end, i, r } with i = r. */
function bounceRay(x, y, normalDeg, theta, lenIn, lenOut) {
  if (lenOut === undefined) lenOut = lenIn;
  return { a: ltPt(x, y, normalDeg + theta, lenIn), o: [x, y], b: ltPt(x, y, normalDeg - theta, lenOut), i: Math.abs(theta), r: Math.abs(theta), tir: false };
}
/* Refraction at (x, y) from index n1 (the side normalDeg points into, where the light comes from) into n2.
   theta as for bounceRay. b continues on the far side at the angle of refraction r (towards the normal when
   n2 > n1). If there is no refracted ray (n1 > n2 beyond the critical angle) the light is totally internally
   reflected: tir = true and b is the reflected end. part: the weak partial reflection's end (non-TIR). */
function bendRay(x, y, normalDeg, theta, n1, n2, lenIn, lenOut) {
  if (lenOut === undefined) lenOut = lenIn;
  const i = Math.abs(theta), r = snellAngle(i, n1, n2), s = theta < 0 ? -1 : 1, a = ltPt(x, y, normalDeg + theta, lenIn);
  if (r === null) return { a, o: [x, y], b: ltPt(x, y, normalDeg - theta, lenOut), i, r: i, tir: true };
  return { a, o: [x, y], b: ltPt(x, y, normalDeg + 180 + s * r, lenOut), i, r, tir: false, part: ltPt(x, y, normalDeg - theta, lenOut) };
}

/* ---------- rays ---------- */
/* A ray along the polyline pts [[x, y], ...] in the parent's coordinates, with an arrowhead part-way along
   each segment pointing the way the light travels. g.set(p) draws it from the source (0..1); g.pts(pts)
   re-routes it (sweeping rays); g.len is its length. o: color (LT.ray), width (6), glow (soft halo, true),
   heads (true | false | array of segment indexes), at (head position along a segment, 0.55), head (size),
   dash ('10 8' for a dashed virtual ray), opacity. */
function rayPath(parent, pts, o) {
  o = o || {};
  const col = o.color || LT.ray, w = o.width || 6, hs = o.head || Math.max(14, w * 2.6), at = o.at === undefined ? 0.55 : o.at;
  const g = G(parent, o.opacity !== undefined ? { opacity: o.opacity } : {});
  const halo = o.glow === false ? null : E('path', { fill: 'none', stroke: col, 'stroke-width': w * 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.16 }, g);
  const line = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || 'none' }, g);
  const hg = G(g);
  let P = [], segs = [], heads = [], prog = 1;
  const build = () => {
    segs = []; g.len = 0;
    for (let k = 1; k < P.length; k++) { const l = Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); segs.push({ a: P[k - 1], b: P[k], l, s0: g.len }); g.len += l; }
    while (heads.length < segs.length) heads.push(E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col }, hg));
    heads.forEach((h, k) => {
      const sg = segs[k], want = sg && sg.l > hs * 2 && (o.heads === undefined || o.heads === true || (Array.isArray(o.heads) && o.heads.indexOf(k) >= 0));
      h.style.display = want ? '' : 'none'; h.want = !!want;
      if (want) { const ang = Math.atan2(sg.b[1] - sg.a[1], sg.b[0] - sg.a[0]) * 180 / Math.PI, f = at + hs * 0.5 / sg.l;
        h.f = (sg.s0 + f * sg.l) / (g.len || 1);
        h.setAttribute('transform', `translate(${lerp(sg.a[0], sg.b[0], f).toFixed(1)} ${lerp(sg.a[1], sg.b[1], f).toFixed(1)}) rotate(${ang.toFixed(2)})`); }
    });
  };
  g.set = p => {
    prog = clamp(p);
    const stop = prog * g.len; let d = '';
    for (const sg of segs) {
      if (sg.s0 > stop) break;
      const f = Math.min(1, (stop - sg.s0) / (sg.l || 1)), e = [lerp(sg.a[0], sg.b[0], f), lerp(sg.a[1], sg.b[1], f)];
      d += (d ? '' : `M${sg.a[0].toFixed(1)},${sg.a[1].toFixed(1)}`) + ` L${e[0].toFixed(1)},${e[1].toFixed(1)}`;
    }
    line.setAttribute('d', d || 'M0,0'); line.style.display = d ? '' : 'none';
    if (halo) { halo.setAttribute('d', d || 'M0,0'); halo.style.display = d ? '' : 'none'; }
    heads.forEach(h => { if (h.want) op(h, clamp((prog - h.f) * (g.len || 1) / 30 + 1)); });
  };
  g.pts = pts2 => { P = pts2.map(q => [q[0], q[1]]); build(); g.set(prog); };
  g.color = c => { line.setAttribute('stroke', c); if (halo) halo.setAttribute('stroke', c); heads.forEach(h => h.setAttribute('fill', c)); };
  g.pts(pts);
  return g;
}
/* a single straight ray from (x1, y1) to (x2, y2): rayPath with two points */
function lightRay(parent, x1, y1, x2, y2, o) { return rayPath(parent, [[x1, y1], [x2, y2]], o); }

/* ---------- the normal ---------- */
/* Dashed normal through (x, y) along direction deg (the side the light is on), len long, plus o.back on the
   far side (default len; 0 for a mirror). o.square: draw the 90° box against the surface (true or a size);
   o.label: text placed beyond the end ('normal'); o.color, o.width. g.set(p) grows it out from the point. */
function normalLine(parent, x, y, deg, len, o) {
  o = o || {};
  const g = G(parent), col = o.color || LT.normal, back = o.back === undefined ? len : o.back;
  const ln = E('line', { x1: x, y1: y, x2: x, y2: y, stroke: col, 'stroke-width': o.width || 3, 'stroke-dasharray': o.dash || '10 8', 'stroke-linecap': 'round' }, g);
  let sq = null, lab = null;
  if (o.square) {
    const s = o.square === true ? 18 : o.square, n = ltDir(deg), t = [-n[1], n[0]];
    sq = E('path', { d: `M${x + n[0] * s},${y + n[1] * s} L${x + (n[0] + t[0]) * s},${y + (n[1] + t[1]) * s} L${x + t[0] * s},${y + t[1] * s}`, fill: 'none', stroke: col, 'stroke-width': 2.5 }, g);
  }
  if (o.label) { const p = ltPt(x, y, deg, len + (o.labelGap || 34)); lab = T(g, p[0], p[1] + 9, o.label, { size: o.size || 26, weight: 600, fill: col, anchor: 'middle' }); }
  g.set = p => {
    p = clamp(p); const a = ltPt(x, y, deg, len * p), b = ltPt(x, y, deg + 180, back * p);
    attr(ln, 'x1', b[0]); attr(ln, 'y1', b[1]); attr(ln, 'x2', a[0]); attr(ln, 'y2', a[1]);
    if (sq) op(sq, clamp(p * 3 - 2)); if (lab) op(lab, clamp(p * 3 - 2));
  };
  g.set(1);
  return g;
}

/* ---------- angle arcs ---------- */
/* Arc of radius r centred on (x, y) from screen angle a0 to a1 (deg), e.g. from the normal to a ray, with a
   pale wedge and a label on its middle line. o.text: label, where '{deg}' becomes the arc's size in whole
   degrees (e.g. 'i = {deg}°'); o.color (LT.angI), o.width (4), o.size (28), o.wedge (fill opacity, 0.18).
   The label is pushed out along the middle line until it clears both edges of the angle (so it never sits on
   the ray or the normal), between r + 30 and r + 140; o.lr fixes the distance instead.
   g.set(p) sweeps it open from a0 (0..1); g.to(x, y, a0, a1) re-aims it. */
function angleArc(parent, x, y, a0, a1, r, o) {
  o = o || {};
  const g = G(parent), col = o.color || LT.angI;
  const wedge = E('path', { fill: col, opacity: o.wedge === undefined ? 0.18 : o.wedge }, g);
  const arc = E('path', { fill: 'none', stroke: col, 'stroke-width': o.width || 4, 'stroke-linecap': 'round' }, g);
  const lab = o.text ? T(g, 0, 0, '', { size: o.size || 28, weight: 700, fill: col, anchor: 'middle' }) : null;
  let cx = x, cy = y, A0 = a0, A1 = a1, prog = 1;
  const draw = () => {
    const e = A0 + (A1 - A0) * prog, p0 = ltPt(cx, cy, A0, r), p1 = ltPt(cx, cy, e, r);
    const big = Math.abs(e - A0) > 180 ? 1 : 0, sw = e > A0 ? 1 : 0;
    const d = `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${big} ${sw} ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    arc.setAttribute('d', d); wedge.setAttribute('d', `M${cx},${cy} L${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${big} ${sw} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`);
    op(arc, prog > 0.001 ? 1 : 0); op(wedge, prog > 0.001 ? 1 : 0);
    if (lab) {
      const size = o.size || 28, str = o.text.replace('{deg}', Math.round(Math.abs(A1 - A0))), half = Math.abs(A1 - A0) * Math.PI / 360;
      const u = ltDir((A0 + A1) / 2), tw = textWidth(str, size, FD, 700);
      const need = (Math.abs(u[1]) * tw / 2 + Math.abs(u[0]) * size * 0.45 + 16) / Math.max(0.05, Math.sin(half));   // 16: clear the ray's glow too
      const d = o.lr || Math.min(r + 140, Math.max(r + 30, need)), m = ltPt(cx, cy, (A0 + e) / 2, d);
      attr(lab, 'x', m[0]); attr(lab, 'y', m[1] + size * 0.35); setText(lab, str);
      op(lab, clamp(prog * 4 - 3));
    }
  };
  g.set = p => { prog = clamp(p); draw(); };
  g.to = (x2, y2, b0, b1) => { cx = x2; cy = y2; A0 = b0; A1 = b1; draw(); };
  draw();
  return g;
}
/* arc from the normal (normalDeg) round to a ray theta degrees away from it: angleArc(..., normalDeg, normalDeg + theta) */
function arcFromNormal(parent, x, y, normalDeg, theta, r, o) { return angleArc(parent, x, y, normalDeg, normalDeg + theta, r, o); }

/* ---------- surfaces ---------- */
/* A plane mirror len long on the x-axis, centred on the origin, reflecting side up (its normal points to -90°),
   with hatching behind. tr(m, x, y, 1, -90) stands it upright facing left; tr(m, x, y, 1, 90) facing right. */
function planeMirror(parent, len, o) {
  o = o || {};
  const g = G(parent), h = G(g);
  for (let x = -len / 2 + 6; x < len / 2 - 4; x += o.gap || 16) E('line', { x1: x, y1: 5, x2: x - 12, y2: 20, stroke: o.hatch || LT.hatch, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, h);
  E('line', { x1: -len / 2, y1: 0, x2: len / 2, y2: 0, stroke: o.color || LT.mirror, 'stroke-width': o.width || 8, 'stroke-linecap': 'round' }, g);
  E('line', { x1: -len / 2 + 8, y1: -2.5, x2: len / 2 - 8, y2: -2.5, stroke: '#FFFFFF', 'stroke-width': 1.5, opacity: 0.6 }, g);
  return g;
}
/* A rough surface for diffuse reflection: n flat facets at random tilts (seeded) along the x-axis, centred on
   the origin, facing up. g.hit(x) -> { x, y, normalDeg } on the facet under x, so each ray reflects about its
   own facet's normal; g.reflect(x, deg, len) -> { p: hit point, b: end } for a ray travelling in direction deg
   that hits above x (law of reflection about that facet). o: n (9), amp (max facet tilt in degrees, 20: keeps
   every reflection of a 45° ray pointing up, away from the surface), seed, color. */
function roughSurface(parent, len, o) {
  o = o || {};
  const g = G(parent), rr = rng(o.seed || 7), n = o.n || 9, w = len / n, amp = o.amp === undefined ? 20 : o.amp;
  const pts = [[-len / 2, 0]], facets = [];
  for (let k = 0; k < n; k++) {
    const tilt = (rr() * 2 - 1) * amp, x0 = pts[k][0], y0 = pts[k][1], x1 = x0 + w;
    let y1 = y0 + Math.tan(tilt * Math.PI / 180) * w;
    if (Math.abs(y1) > w * 0.45) y1 = Math.sign(y1) * w * 0.45;
    const nd = ltAng([y1 - y0, -(x1 - x0)]);      // normal of the facet, pointing up out of the surface
    facets.push({ x0, y0, x1, y1, normalDeg: nd }); pts.push([x1, y1]);
  }
  E('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L') + ` L${len / 2},40 L${-len / 2},40 Z`, fill: o.fill || '#3A5568', stroke: o.color || '#C9D6DF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  g.facets = facets;
  g.hit = x => { const f = facets[Math.max(0, Math.min(n - 1, Math.floor((x + len / 2) / w)))], u = (x - f.x0) / (f.x1 - f.x0); return { x, y: lerp(f.y0, f.y1, u), normalDeg: f.normalDeg }; };
  g.reflect = (x, deg, L) => { const h = g.hit(x), d = reflectVec(ltDir(deg), ltDir(h.normalDeg)); return { p: [h.x, h.y], b: [h.x + d[0] * (L || 220), h.y + d[1] * (L || 220)], normalDeg: h.normalDeg }; };
  return g;
}

/* ---------- glass shapes ---------- */
/* adds g.at(x, y) (place it) and g.trace(start, deg, n, endLen) to a glass shape with corners verts
   (local, convex, any order around): the ray from start (parent coords) heading deg refracts in and out with
   index n inside, and reflects inside where it cannot get out (TIR). Returns the polyline [start, ...hits, end]. */
function _ltGlass(g, verts) {
  let ox = 0, oy = 0;
  g.verts = verts;
  g.at = (x, y) => { ox = x; oy = y; tr(g, x, y); return g; };
  g.trace = (start, deg, n, endLen) => {
    const V = verts.map(v => [v[0] + ox, v[1] + oy]), cx = V.reduce((s, v) => s + v[0], 0) / V.length, cy = V.reduce((s, v) => s + v[1], 0) / V.length;
    let p = [start[0], start[1]], d = ltDir(deg), inside = false, last = -1;
    const out = [p.slice()];
    for (let step = 0; step < 8; step++) {
      let best = null;
      for (let k = 0; k < V.length; k++) {
        if (k === last) continue;
        const a = V[k], b = V[(k + 1) % V.length], ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
        if (t > 1e-6 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, k, ex, ey };
      }
      if (!best) break;
      p = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; out.push(p.slice()); last = best.k;
      let nrm = _ltUnit([best.ey, -best.ex]);
      if ((p[0] - cx) * nrm[0] + (p[1] - cy) * nrm[1] < 0) nrm = [-nrm[0], -nrm[1]];   // outward normal
      const nd = inside ? refractVec(d, nrm, n, 1) : refractVec(d, nrm, 1, n);
      if (nd) { d = _ltUnit(nd); inside = !inside; if (!inside) break; }
      else d = _ltUnit(reflectVec(d, nrm));                                          // total internal reflection
    }
    out.push([p[0] + d[0] * (endLen || 200), p[1] + d[1] * (endLen || 200)]);
    return out;
  };
  return g;
}
/* A rectangular glass block w x h centred on the origin. o: label (e.g. 'glass'), fill, stroke, rx. g.at / g.trace as above. */
function glassBlock(parent, w, h, o) {
  o = o || {};
  const g = G(parent);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx === undefined ? 4 : o.rx, fill: o.fill || LT.glassFill, stroke: o.stroke || LT.glassStroke, 'stroke-width': 3 }, g);
  E('line', { x1: -w / 2 + 12, y1: -h / 2 + 10, x2: -w / 2 + Math.min(90, w * 0.3), y2: -h / 2 + 10, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  if (o.label) T(g, w / 2 - 16, h / 2 - 16, o.label, { size: 26, weight: 600, fill: LT.normal, anchor: 'end' });
  return _ltGlass(g, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
}
/* A semicircular glass block: flat face on the x-axis with its centre at the origin, curved side below (+y).
   A ray aimed at the origin along a radius crosses the curved face without bending, so the flat face shows
   refraction, the critical angle and TIR cleanly (use bendRay at the origin with normalDeg 90, n1 1.5, n2 1). */
function semiBlock(parent, r, o) {
  o = o || {};
  const g = G(parent);
  E('path', { d: `M${-r},0 L${r},0 A${r},${r} 0 0 1 ${-r},0 Z`, fill: o.fill || LT.glassFill, stroke: o.stroke || LT.glassStroke, 'stroke-width': 3 }, g);
  E('line', { x1: -r + 14, y1: 9, x2: -r * 0.55, y2: 9, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  if (o.label) T(g, 0, r * 0.62, o.label, { size: 26, weight: 600, fill: LT.normal, anchor: 'middle' });
  return g;
}
/* An equilateral glass prism, side s, apex up, centred on its bounding box: apex (0, -h/2), base on y = +h/2
   (h = 0.866 s). g.at / g.trace as above: trace each SPECTRUM colour with its own n for dispersion. */
function glassPrism(parent, s, o) {
  o = o || {};
  const g = G(parent), h = s * Math.sqrt(3) / 2, V = [[0, -h / 2], [s / 2, h / 2], [-s / 2, h / 2]];
  E('path', { d: `M${V[0]} L${V[1]} L${V[2]} Z`, fill: o.fill || LT.glassFill, stroke: o.stroke || LT.glassStroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  E('line', { x1: -s * 0.09, y1: -h * 0.24, x2: -s * 0.27, y2: h * 0.08, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  g.h = h;
  return _ltGlass(g, V);
}

/* ---------- lenses ---------- */
/* A convex (converging) lens h tall centred on the origin, axis along x. g.set(fat) morphs it from thin (0)
   to fat (1); g.f() is the matching focal length, from o.fThin (240) down to o.fFat (120): a fatter lens bends
   light more. Use lensImage() for where its rays meet. */
function convexLens(parent, h, o) {
  o = o || {};
  const g = G(parent), body = E('path', { fill: o.fill || 'rgba(200,230,250,0.22)', stroke: o.stroke || LT.glassStroke, 'stroke-width': 3 }, g);
  const shine = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.35, 'stroke-linecap': 'round' }, g);
  const t0 = o.thin || h * 0.07, t1 = o.thick || h * 0.24, fT = o.fThin || 240, fF = o.fFat || 120;
  let fat = o.fat === undefined ? 0.5 : o.fat;
  g.set = v => {
    fat = clamp(v); const w = lerp(t0, t1, fat), y = h / 2;
    body.setAttribute('d', `M0,${-y} C${w * 1.33},${-y * 0.62} ${w * 1.33},${y * 0.62} 0,${y} C${-w * 1.33},${y * 0.62} ${-w * 1.33},${-y * 0.62} 0,${-y} Z`);
    shine.setAttribute('d', `M${-w * 0.45},${-y * 0.45} Q${-w * 0.8},${-y * 0.1} ${-w * 0.62},${y * 0.2}`);
  };
  g.f = () => lerp(fT, fF, fat);
  g.set(fat);
  return g;
}
/* Thin-lens image (1/f = 1/u + 1/v) of the point (sx, sy) for a lens centred at (lx, ly), light travelling
   right: returns [x, y] of the real, inverted image, or null when the point is at or inside the focal length.
   Rays from the point to anywhere on the lens all meet there; parallel rays meet at (lx + f, ly) (lensFocus). */
function lensImage(lx, ly, f, sx, sy) { const u = lx - sx; if (u <= f) return null; const v = u * f / (u - f); return [lx + v, ly - (v / u) * (sy - ly)]; }
function lensFocus(lx, ly, f) { return [lx + f, ly]; }

/* ---------- the eye ---------- */
/* Cross-section of an eye looking left (light comes from the left); eyeball radius R (220) centred on the origin.
   g.parts.{sclera, cornea, iris, lens, ciliary, ligaments, retina, nerve, blind}: <g>s to highlight with op() or a
   glow; g.geo.anchors.<part>: [x, y] points for kit labelLine leaders.
   g.pupil(p): 0 small (bright light) .. 1 wide (dim).
   g.focus(near): 0 far (ciliary muscles relaxed, ligaments tight, lens thin) .. 1 near (muscles contracted,
   ligaments slack, lens fat).
   g.image(sx, sy): where light from the point (sx, sy) (local coords, left of the eye) lands on the retina: on the
   line through the lens centre, so it comes out upside down.
   g.rays(sx, sy, n, shift): n polylines [source, cornea, lens, retina] from that point through the pupil. They bend
   at the cornea (the most) and the lens and meet on the retina; shift < 0 makes them meet in front of the retina,
   > 0 behind it (blurry, for the glasses beat); shift is a fraction of R. Draw each with rayPath. */
function eyeSection(parent, R, o) {
  R = R || 220; o = o || {};
  const g = G(parent), P = {}, A = {};
  const part = name => (P[name] = G(g));
  const cA = 35 * Math.PI / 180, cx0 = -R * Math.cos(cA), cy0 = R * Math.sin(cA), cCtl = -R * 1.55;
  const lensX = -R * 0.53, lensRy = R * 0.36, irisX = -R * 0.8, Rr = R - 10, nerveDeg = 12;
  // vitreous body + sclera (white outer coat, open at the front for the cornea)
  E('circle', { r: R - 4, fill: o.fill || 'rgba(160,200,225,0.07)' }, g);
  const scl = part('sclera'), s0 = ltPt(0, 0, 180 + 35, R), s1 = ltPt(0, 0, 180 - 35, R);
  E('path', { d: `M${s0[0].toFixed(1)},${s0[1].toFixed(1)} A${R},${R} 0 1 1 ${s1[0].toFixed(1)},${s1[1].toFixed(1)}`, fill: 'none', stroke: '#EEF3F6', 'stroke-width': 11 }, scl);
  // retina (pink lining round the back) and blind spot where the optic nerve leaves
  const ret = part('retina'), r0 = ltPt(0, 0, -112, Rr), r1 = ltPt(0, 0, 112, Rr);
  E('path', { d: `M${r0[0].toFixed(1)},${r0[1].toFixed(1)} A${Rr},${Rr} 0 1 1 ${r1[0].toFixed(1)},${r1[1].toFixed(1)}`, fill: 'none', stroke: C.cell, 'stroke-width': 8, 'stroke-linecap': 'round' }, ret);
  const nv = part('nerve'), nb = ltPt(0, 0, nerveDeg, R - 6);
  E('path', { d: `M${nb[0] - 4},${nb[1] - 17} L${R + 125},${nb[1] + 2} L${R + 125},${nb[1] + 34} L${nb[0] - 4},${nb[1] + 17} Z`, fill: '#E9C46A', stroke: '#B8902F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, nv);
  const bl = part('blind'), bp = ltPt(0, 0, nerveDeg, Rr);
  E('circle', { cx: bp[0], cy: bp[1], r: 9, fill: '#3A2A1A', stroke: '#E9C46A', 'stroke-width': 2.5 }, bl);
  // cornea (clear bulge at the front)
  const cor = part('cornea');
  E('path', { d: `M${cx0},${-cy0} Q${cCtl},0 ${cx0},${cy0}`, fill: 'rgba(200,230,250,0.18)', stroke: LT.glassStroke, 'stroke-width': 5 }, cor);
  // ciliary muscles (top and bottom), suspensory ligaments, lens
  const cil = part('ciliary'), lig = part('ligaments'), lns = part('lens'), iri = part('iris');
  const mus = [-1, 1].map(sg => E('ellipse', { rx: R * 0.065, ry: R * 0.12, fill: ball('#E57A8A', '#9E3B4B'), stroke: '#F7B5BF', 'stroke-width': 2 }, cil));
  const fib = [-1, 1].map(() => [0, 1, 2].map(() => E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 2, opacity: 0.85 }, lig)));
  const lensEl = E('ellipse', { cx: lensX, cy: 0, rx: 10, ry: lensRy, fill: 'rgba(225,242,255,0.40)', stroke: LT.glassStroke, 'stroke-width': 3.5 }, lns);
  const bars = [-1, 1].map(() => E('line', { x1: irisX, x2: irisX, stroke: o.iris || '#9A6A3E', 'stroke-width': 13, 'stroke-linecap': 'round' }, iri));
  let pup = 0.5, near = 0;
  const lensRx = () => R * lerp(0.085, 0.17, near), lensRyNow = () => lensRy * lerp(1, 0.93, near);
  const layout = () => {
    const ph = R * lerp(0.08, 0.27, pup), top = cy0 * 0.98;
    bars.forEach((b, k) => { const sg = k ? 1 : -1; attr(b, 'y1', sg * top); attr(b, 'y2', sg * ph); });
    const rx = lensRx(), ry = lensRyNow(); attr(lensEl, 'rx', rx); attr(lensEl, 'ry', ry);
    mus.forEach((m, k) => {   // muscle sits against the wall behind the iris; contracting moves it in, towards the lens
      const sg = k ? 1 : -1, wall = ltPt(0, 0, sg > 0 ? 180 - 52 : 180 + 52, R - R * 0.075), inward = lerp(0, R * 0.05, near);
      tr(m, wall[0] + inward * 0.4, wall[1] - sg * inward, 1 + 0.18 * near, sg * -52);
      fib[k].forEach((f, j) => {
        const a = [wall[0] + inward * 0.4 + (j - 1) * 7, wall[1] - sg * (inward + R * 0.09)], b = [lensX + (j - 1) * rx * 0.55, sg * ry * (0.97 - Math.abs(j - 1) * 0.04)];
        const sag = R * 0.05 * near * (j === 1 ? 1 : 0.8), mx = (a[0] + b[0]) / 2 + sag, my = (a[1] + b[1]) / 2 - sg * sag * 0.3;
        f.setAttribute('d', `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`);
      });
    });
  };
  g.pupil = p => { pup = clamp(p); layout(); };
  g.focus = v => { near = clamp(v); layout(); };
  g.pupilHalf = () => R * lerp(0.08, 0.27, pup);
  const corneaAt = y => { const t = (y / cy0 + 1) / 2; return [(1 - t) * (1 - t) * cx0 + 2 * t * (1 - t) * cCtl + t * t * cx0, y]; };
  const retinaHit = (p, d) => { d = _ltUnit(d); const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - Rr * Rr, t = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * t, p[1] + d[1] * t]; };
  g.image = (sx, sy) => retinaHit([lensX, 0], [lensX - sx, -sy]);
  g.rays = (sx, sy, n, shift) => {
    n = n || 3; shift = shift || 0;
    const I = g.image(sx, sy), ax = _ltUnit([I[0] - lensX, I[1]]), M = [I[0] + ax[0] * shift * R, I[1] + ax[1] * shift * R];
    const Q = [M[0] + ax[0] * 2.4 * R, M[1] + ax[1] * 2.4 * R];     // the cornea alone would focus here, far behind the retina (it does about 2/3 of the bending)
    const half = g.pupilHalf() * 0.82, out = [];
    for (let k = 0; k < n; k++) {
      const yc = n === 1 ? 0 : lerp(-half, half, k / (n - 1)), Cp = corneaAt(yc);
      const u = (lensX - Cp[0]) / ((Q[0] - Cp[0]) || 1), Lp = [lensX, lerp(Cp[1], Q[1], u)];
      out.push([[sx, sy], Cp, Lp, retinaHit(Lp, [M[0] - Lp[0], M[1] - Lp[1]])]);      // the lens bends it on to M
    }
    return out;
  };
  A.cornea = corneaAt(-R * 0.3); A.pupil = [irisX - 4, 0]; A.iris = [irisX, -cy0 * 0.62]; A.lens = [lensX, -lensRy * 0.5];
  A.retina = ltPt(0, 0, -40, Rr); A.sclera = ltPt(0, 0, -70, R + 4); A.nerve = [R + 70, nb[1] + 18]; A.blind = bp;
  A.ciliary = ltPt(0, 0, 180 + 52, R * 0.88); A.ligaments = [lensX + 6, -lensRy * 1.12];
  g.parts = P; g.geo = { R, lensX, irisX, retinaR: Rr, cornea: [cx0, cy0, cCtl], anchors: A };
  layout();
  return g;
}
/* Front view of an eye about 2r wide: white sclera, coloured iris, black pupil. g.pupil(p) 0 small .. 1 wide. o.iris colour. */
function irisFront(parent, r, o) {
  o = o || {};
  const g = G(parent);
  E('path', { d: `M${-r * 1.9},0 Q0,${-r * 1.55} ${r * 1.9},0 Q0,${r * 1.55} ${-r * 1.9},0 Z`, fill: '#F4F7F9', stroke: '#C9D6DF', 'stroke-width': 3 }, g);
  E('circle', { r, fill: ball(o.iris || '#B07A45', '#6B4423'), stroke: '#4A2F18', 'stroke-width': 2 }, g);
  const pupil = E('circle', { r: r * 0.4, fill: '#0B0B0D' }, g);
  E('circle', { cx: -r * 0.32, cy: -r * 0.34, r: r * 0.14, fill: '#FFFFFF', opacity: 0.85 }, g);
  g.pupil = p => attr(pupil, 'r', r * lerp(0.22, 0.72, clamp(p)));
  g.pupil(0.5);
  return g;
}
/* A small side-view eye for ray diagrams, about 70 px at s = 1, centred, looking left (o.right: looking right). */
function eyeIcon(parent, s, o) {
  o = o || {};
  const g = G(parent), inner = G(g), k = s || 1;
  inner.setAttribute('transform', `scale(${o.right ? -k : k} ${k})`);
  E('path', { d: 'M-34,0 Q-6,-26 30,-12 Q38,0 30,12 Q-6,26 -34,0 Z', fill: '#F4F7F9', stroke: '#C9D6DF', 'stroke-width': 2.5 }, inner);
  E('ellipse', { cx: -20, cy: 0, rx: 6, ry: 12, fill: o.iris || '#6B4423' }, inner);
  E('ellipse', { cx: -22, cy: 0, rx: 3, ry: 6.5, fill: '#0B0B0D' }, inner);
  E('path', { d: 'M-30,-8 Q-6,-30 28,-16', fill: 'none', stroke: '#C98E62', 'stroke-width': 4, 'stroke-linecap': 'round' }, inner);
  return g;
}
/* A ray box (a lamp with a slit) about 100 x 46, centred, pointing right; rotate it with tr(). g.set(on 0..1) lights the slit. */
function rayBox(parent, o) {
  o = o || {};
  const g = G(parent);
  E('rect', { x: -50, y: -23, width: 100, height: 46, rx: 8, fill: ball('#4A5866', '#232C35'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, g);
  const halo = E('circle', { cx: 50, cy: 0, r: 34, fill: glow(o.color || LT.ray) }, g);
  const slit = E('rect', { x: 46, y: -8, width: 6, height: 16, rx: 2, fill: o.color || LT.ray }, g);
  g.set = p => { p = clamp(p); op(halo, p); slit.setAttribute('opacity', (0.25 + 0.75 * p).toFixed(3)); };
  g.set(1);
  return g;
}

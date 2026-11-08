/* Chapter 7: Seeing colour: objects and filters.
   White light is a bundle of six coloured threads. Beats: why does a red apple look red?
   -> ★ white light falls on the apple: red bounces on to the eye, the other five sink in (absorbed)
   -> a green leaf reflects only green -> a white card reflects all six, a black card absorbs all six
   -> in the dark the apple is black: it doesn't glow or turn the light red, it reflects red
   -> a red filter transmits red and absorbs the rest -> a filter is selfish (red, then green, then red)
   -> a blue book seen through a red filter looks black -> under red light a green logo looks black. */
scene('colour', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const TC = ['#FF4D4D', '#FF9A3C', '#FFE45C', '#4CD964', '#3B82F6', '#A066FF'];      // red, orange, yellow, green, blue, violet
  const ALL = [0, 1, 2, 3, 4, 5], but = k => ALL.filter(j => j !== k);
  const RED = 0, GRN = 3, BLU = 4;
  const bump = (t, t0, dur) => Math.sin(Math.PI * P(t, t0, dur || 0.5, linear));
  const ray = (r, p, a) => { p = clamp(p); r.set(p); op(r, p > 0.002 ? (a === undefined ? 1 : a) : 0); };   // a ray at 0 would leave a dot
  const zoomAt = (el, x, y, k) => el.setAttribute('transform', `translate(${x} ${y}) scale(${k.toFixed(4)}) translate(${-x} ${-y})`);
  const popIn = (el, t, t0, x, y) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, 0.6 + 0.4 * p)); return p; };
  const slideIn = (el, t, t0, x, y, out) => { const p = P(t, t0, 0.5, easeOut); op(el, p * (out === undefined ? 1 : out)); tr(el, x, y + (1 - p) * 12); return p; };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const el = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 700, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, el).textContent = s[0]; });
    return el;
  }

  /* ---------- geometry ---------- */
  const unit = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
  // first point where the ray p + s*d (s > 0) meets the polyline poly
  function hitPoly(p, d, poly) {
    let best = null;
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i], b = poly[i + 1], ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
      if (Math.abs(den) < 1e-9) continue;
      const s = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
      if (s > 1e-6 && u >= 0 && u <= 1 && (best === null || s < best)) best = s;
    }
    return best === null ? null : [p[0] + d[0] * best, p[1] + d[1] * best];
  }
  const xf = (pts, x, y, s, r) => { const c = Math.cos(r * Math.PI / 180), n = Math.sin(r * Math.PI / 180); return pts.map(q => [x + s * (q[0] * c - q[1] * n), y + s * (q[0] * n + q[1] * c)]); };
  const cubicPts = (a, b, c, d, n) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u; o.push([v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]); } return o; };
  const seg = (x1, y1, x2, y2) => [[x1, y1], [x2, y2]];
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };

  /* ---------- light ---------- */
  // White light as six coloured threads from src towards aim, each stopping where it meets the surface poly.
  // g.set(dist) draws them out from the lamp as one straight front; g.ends(points) re-aims where they stop.
  function bundle(parent, src, aim, gap, poly) {
    const g = G(parent), d = unit([aim[0] - src[0], aim[1] - src[1]]), n = [-d[1], d[0]];
    g.d = d;
    g.ks = TC.map((c, k) => {
      const off = (k - 2.5) * gap, s0 = [src[0] + d[0] * 44 + n[0] * off, src[1] + d[1] * 44 + n[1] * off];
      const e = hitPoly(s0, d, poly) || [s0[0] + d[0] * 300, s0[1] + d[1] * 300];
      return { k, c, s0, e, len: Math.hypot(e[0] - s0[0], e[1] - s0[1]), el: E('line', { stroke: c, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, g) };
    });
    g.hits = g.ks.map(K => K.e.slice());
    const Lm = Math.min(...g.ks.map(K => K.len)), hp = [src[0] + d[0] * (44 + Lm * 0.5), src[1] + d[1] * (44 + Lm * 0.5)];
    const head = E('path', { d: 'M0,0 L-20,-13 L-14,0 L-20,13 Z', fill: '#FFFFFF', stroke: C.bg0, 'stroke-width': 1.5, transform: `translate(${hp[0].toFixed(1)} ${hp[1].toFixed(1)}) rotate(${(Math.atan2(d[1], d[0]) * 180 / Math.PI).toFixed(1)})` }, g);
    let dist = 0;
    g.set = v => {
      dist = v;
      g.ks.forEach(K => { const L = clamp(v, 0, K.len); attr(K.el, 'x1', K.s0[0]); attr(K.el, 'y1', K.s0[1]); attr(K.el, 'x2', K.s0[0] + d[0] * L); attr(K.el, 'y2', K.s0[1] + d[1] * L); op(K.el, v > 0.5 ? 1 : 0); });
      op(head, clamp((v - Lm * 0.5 - 6) / 20));
    };
    g.ends = pts => { g.ks.forEach((K, k) => { K.e = pts[k]; K.len = Math.hypot(pts[k][0] - K.s0[0], pts[k][1] - K.s0[1]); }); g.set(dist); };
    g.time = v => v / 300;                                            // seconds for the front to travel v px
    g.set(0);
    return g;
  }
  // Absorbed threads sink into the surface (a short fading tail) with a dark pulse that keeps beating.
  // Each absorbed thread keeps sinking into the material as short coloured pellets that fade out; the first
  // arrival gives one small dark pulse. o: inset (start this far inside), depth (how far they sink), ring colour.
  function sinks(parent, bun, which, o) {
    o = o || {};
    const g = G(parent), d = bun.d, inset = o.inset || 0, D = o.depth || 40, PL = o.len || 12;
    const cen = which.reduce((s, k) => [s[0] + bun.ks[k].e[0] / which.length, s[1] + bun.ks[k].e[1] / which.length], [0, 0]);
    const ring = E('circle', { cx: cen[0] + d[0] * (inset + 4), cy: cen[1] + d[1] * (inset + 4), r: 8, fill: 'none', stroke: o.ring || '#0A0F14', 'stroke-width': 5 }, g);
    const pels = [];
    which.forEach((k, i) => { const K = bun.ks[k]; [0, 0.5].forEach(ph => pels.push({ e: K.e, ph: ph + i * 0.17, el: E('line', { stroke: K.c, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, g) })); });
    g.upd = (t, t0) => {
      const u = t - t0, rp = clamp(u / 0.9);
      op(ring, u > 0 && u < 0.9 ? 0.85 * (1 - rp) : 0); attr(ring, 'r', 8 + 30 * rp);
      pels.forEach(p => {
        if (u <= 0) { op(p.el, 0); return; }
        const q = (u * (0.35 + 0.55 * calm) + p.ph) % 1, a = inset + q * D;
        attr(p.el, 'x1', p.e[0] + d[0] * a); attr(p.el, 'y1', p.e[1] + d[1] * a);
        attr(p.el, 'x2', p.e[0] + d[0] * (a + PL)); attr(p.el, 'y2', p.e[1] + d[1] * (a + PL));
        op(p.el, 0.95 * (1 - q) * clamp(u * 2.5));
      });
    };
    return g;
  }
  // the lamp: the kit lamp, glowing white
  function lamp(parent) {
    const g = G(parent), b = bulbSym(g); b.set(1);
    const cs = b.querySelectorAll('circle'), halo = cs[0], fillC = cs[2];
    halo.setAttribute('fill', glow('#FFFFFF')); halo.setAttribute('r', 80);
    fillC.setAttribute('fill', '#FFFFFF');
    b.lastChild.setAttribute('stroke', '#9DB0BF');
    g.set = v => { op(halo, v); fillC.style.opacity = (0.95 * v).toFixed(3); };
    return g;
  }
  function pane(parent, w, h, col, edge) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 5, fill: col, stroke: edge, 'stroke-width': 3 }, g);
    E('line', { x1: -w / 2 + 7, y1: -h / 2 + 12, x2: -w / 2 + 7, y2: -h / 2 + Math.min(80, h * 0.4), stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.35, 'stroke-linecap': 'round' }, g);
    return g;
  }
  const PANE_RED = ['rgba(255,77,77,0.42)', '#FF8A8A'], PANE_GRN = ['rgba(76,217,100,0.40)', '#8EF0A0'];

  /* ---------- objects ---------- */
  // the red apple of the intro and chapter 1, about 2 × AR across; APPLE_SEGS is its outline (four cubics), which
  // the light's hit test follows too
  const AR = 92, APPLE_SEGS = [
    [[0, -0.62], [0.5, -1.05], [1.12, -0.72], [1.02, 0.05]], [[1.02, 0.05], [0.95, 0.75], [0.45, 1.05], [0, 0.88]],
    [[0, 0.88], [-0.45, 1.05], [-0.95, 0.75], [-1.02, 0.05]], [[-1.02, 0.05], [-1.12, -0.72], [-0.5, -1.05], [0, -0.62]],
  ].map(s => s.map(q => [q[0] * AR, q[1] * AR]));
  function apple(parent) {
    const g = G(parent), lit = G(g), dark = G(g), r = AR;
    const body = `M${APPLE_SEGS[0][0]} ` + APPLE_SEGS.map(s => `C${s[1]} ${s[2]} ${s[3]}`).join(' ') + ' Z';
    const stem = `M0,${-r * 0.6} Q${r * 0.04},${-r * 0.85} ${-r * 0.1},${-r * 1.05}`;
    E('path', { d: body, fill: ball('#FF5A5F', '#9E1C2A'), stroke: '#FFB3B5', 'stroke-width': 3 }, lit);
    E('path', { d: `M${-r * 0.55},${-r * 0.35} Q${-r * 0.7},${-r * 0.05} ${-r * 0.58},${r * 0.2}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': r * 0.09, 'stroke-linecap': 'round', opacity: 0.55 }, lit);
    E('path', { d: stem, fill: 'none', stroke: '#6B4423', 'stroke-width': r * 0.11, 'stroke-linecap': 'round' }, lit);
    E('path', { d: `M${-r * 0.02},${-r * 0.86} C${r * 0.2},${-r * 1.12} ${r * 0.52},${-r * 1.08} ${r * 0.62},${-r * 0.94} C${r * 0.4},${-r * 0.78} ${r * 0.14},${-r * 0.76} ${-r * 0.02},${-r * 0.86} Z`, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 1.5 }, lit);
    E('path', { d: body, fill: '#121619', stroke: '#33414C', 'stroke-width': 3 }, dark);
    E('path', { d: stem, fill: 'none', stroke: '#33414C', 'stroke-width': r * 0.11, 'stroke-linecap': 'round' }, dark);
    g.dark = v => { op(dark, v); op(lit, 1 - v); };
    g.dark(0);
    return g;
  }
  function book(parent, color, dk) {
    const g = G(parent);
    E('rect', { x: -70, y: -100, width: 150, height: 200, rx: 8, fill: '#F4EBD9', stroke: '#CDBF9F', 'stroke-width': 2 }, g);
    E('rect', { x: -80, y: -104, width: 150, height: 208, rx: 8, fill: color, stroke: dk, 'stroke-width': 3 }, g);
    E('rect', { x: -80, y: -104, width: 22, height: 208, rx: 6, fill: dk, opacity: 0.75 }, g);
    [-58, -36].forEach(y => E('rect', { x: -40, y, width: 90, height: 10, rx: 5, fill: '#FFFFFF', opacity: 0.75 }, g));
    return g;
  }
  const SHIRT = 'M-62,-112 L-28,-122 Q0,-100 28,-122 L62,-112 L112,-66 L86,-30 L62,-48 L62,112 L-62,112 L-62,-48 L-86,-30 L-112,-66 Z';
  const SHIRT_TOP = [[-112, -66], [-62, -112], [-28, -122], ...cubicPts([-28, -122], [-9.3, -107.3], [9.3, -107.3], [28, -122], 8).slice(1), [62, -112], [112, -66]];
  function starD(r) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr - 30).toFixed(1); } return d + 'Z'; }
  function shirt(parent) {
    const g = G(parent);
    const body = E('path', { d: SHIRT, fill: '#E8424F', stroke: '#FF9AA2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-28,-122 Q0,-100 28,-122', fill: 'none', stroke: '#9A1C28', 'stroke-width': 5 }, g);
    const star = E('path', { d: starD(32), fill: '#4CD964', stroke: '#2C8C4C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    g.paint = (b, s, edge) => { body.setAttribute('fill', b); body.setAttribute('stroke', edge || '#FF9AA2'); star.setAttribute('fill', s); };
    return g;
  }

  /* ================= the shared lamp, eye and red filter (they glide between layouts) ================= */
  const layer = G(root), top = G(root);
  const lampA = lamp(top);
  const eye = eyeIcon(top, 1.5);
  const eyeGlow = E('circle', { r: 26, fill: glow('#FF4D4D') }, top);
  const eyeRing = E('circle', { r: 30, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, top);
  const redPane = pane(layer, 40, 220, PANE_RED[0], PANE_RED[1]);
  const L_APPLE = [250, 205], L_WB = [600, 160], L_FIL = [170, 400], L_BLUE = [215, 185], L_SHIRT = [300, 160];
  const EYE_A = [985, 165], EYE_AR = -36, EYE_F = [1012, 393];
  const eyeFront = (c, rot) => ltPt(c[0], c[1], 180 + rot, 50);

  /* ================= A. the apple (why / apple / noglow) and the leaf ================= */
  const LA = G(layer);
  const AC = [600, 540];
  const apl = apple(LA); tr(apl, AC[0], AC[1]);
  const lf = G(LA); leaf(lf, 1.2);                                    // the kit leaf: 205 long, pointing right from (0, 0)
  const LF_AT = [462, 548, 1.2, -12];
  const leafPoly = xf([...cubicPts([0, 0], [40, -60], [150, -70], [205, 0], 24), ...cubicPts([205, 0], [150, 70], [40, 60], [0, 0], 24).slice(1)], LF_AT[0], LF_AT[1], LF_AT[2], LF_AT[3]);
  const applePoly = xf(APPLE_SEGS.flatMap((s, k) => cubicPts(s[0], s[1], s[2], s[3], 24).slice(k ? 1 : 0)), AC[0], AC[1], 1, 0);
  const bunA = bundle(LA, L_APPLE, [520, 492], 7.5, applePoly);      // lands on the apple's left shoulder: red leaves above the stem
  const leafHits = bunA.ks.map(K => hitPoly(K.s0, bunA.d, leafPoly) || K.e);
  const appleHits = bunA.hits;
  const FA = eyeFront(EYE_A, EYE_AR);
  const sinkA = sinks(LA, bunA, but(RED));
  const redOut = rayPath(LA, [appleHits[RED], FA], { color: TC[RED], width: 5 });
  // the leaf reuses the same light; its own hits for the sinks and the green ray
  const bunLeafProxy = { d: bunA.d, ks: bunA.ks.map((K, k) => ({ c: K.c, e: leafHits[k] })) };
  const sinkL = sinks(LA, bunLeafProxy, but(GRN));
  const grnOut = rayPath(LA, [leafHits[GRN], FA], { color: TC[GRN], width: 5 });
  const whyChip = chip(LA, 'why red?', { size: 34, fill: C.card2, stroke: '#FF8A8A' });
  const labWhite = T(LA, L_APPLE[0], L_APPLE[1] - 52, 'white light', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const labRed = T(LA, 0, 0, 'reflects red', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A8A' });
  const labAbs = G(LA);
  T(labAbs, 0, 0, 'absorbs the rest', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  { const c = but(RED).reduce((s, k) => [s[0] + appleHits[k][0] / 5, s[1] + appleHits[k][1] / 5], [0, 0]);
    const tx = c[0] - 340 + bunA.d[0] * 16, ty = c[1] - 572 + bunA.d[1] * 16;
    E('line', { x1: 126, y1: -14, x2: tx, y2: ty, stroke: C.muted, 'stroke-width': 2.5 }, labAbs);
    E('circle', { cx: tx, cy: ty, r: 4.5, fill: C.muted }, labAbs); }
  const labGrn = T(LA, 0, 0, 'reflects green', { size: 30, weight: 700, anchor: 'middle', fill: '#8EF0A0' });
  // noglow: two wrong ideas struck out, the right one ticked
  const NG = G(LA);
  const ngChips = [['it glows red', 476], ['it turns the light red', 548]].map(([s, y]) => {
    const g = G(NG); const c = chip(g, s, { size: 29, fill: C.card2, stroke: C.line }); tr(c, 0, 0);
    const st = strike(g, -c.w / 2 + 14, 0, c.w / 2 - 14); return { g, st, y };
  });
  const ngOk = G(NG); { const c = chip(ngOk, 'it reflects red', { size: 29, fill: 'rgba(86,214,155,0.14)', stroke: C.good }); const tk = tick(ngOk, 13); tr(tk, c.w / 2 + 26, 2); }

  /* ================= B. white card and black card ================= */
  const WB = G(layer);
  const cardW = E('rect', { x: 200, y: 503, width: 260, height: 40, rx: 7, fill: '#F2F7FA', stroke: '#C9D6DF', 'stroke-width': 3 }, WB);
  const cardB = E('rect', { x: 740, y: 503, width: 260, height: 40, rx: 7, fill: '#14181C', stroke: '#4A5A68', 'stroke-width': 3 }, WB);
  const bunW = bundle(WB, L_WB, [356, 503], 7.5, seg(200, 503, 460, 503));
  const bunK = bundle(WB, L_WB, [844, 503], 7.5, seg(740, 503, 1000, 503));
  // the white card sends all six back; they rejoin as white light
  const dR = [bunW.d[0], -bunW.d[1]];
  const cW = bunW.hits.reduce((s, q) => [s[0] + q[0] / 6, s[1] + q[1] / 6], [0, 0]);
  const merge = [cW[0] + dR[0] * 92, cW[1] + dR[1] * 92];
  const backW = bunW.hits.map((q, k) => rayPath(WB, [q, merge], { color: TC[k], width: 4.5, glow: false, heads: false }));
  const whiteOut = rayPath(WB, [merge, [merge[0] + dR[0] * 170, merge[1] + dR[1] * 170]], { color: C.ink, width: 8 });
  const sinkK = sinks(WB, bunK, ALL, { ring: '#7A8C9A' });
  const wbLab = [
    [T(WB, 330, 588, 'reflects all colours', { size: 29, weight: 700, anchor: 'middle' }), T(WB, 330, 624, 'so it looks white', { size: 26, weight: 600, anchor: 'middle', fill: C.muted })],
    [T(WB, 870, 588, 'absorbs all colours', { size: 29, weight: 700, anchor: 'middle' }), T(WB, 870, 624, 'reflects almost none', { size: 26, weight: 600, anchor: 'middle', fill: C.muted })],
  ];

  /* ================= C. filters ================= */
  const FL = G(layer);
  const PF = 525;                                                  // the filter's centre x (left face 505)
  const grnPane = pane(FL, 40, 220, PANE_GRN[0], PANE_GRN[1]);
  const bunF = bundle(FL, L_FIL, [600, 400], 8, seg(PF - 20, 260, PF - 20, 540));
  const FF = eyeFront(EYE_F, 0);
  const passR = rayPath(FL, [bunF.hits[RED], [FF[0], bunF.hits[RED][1]]], { color: TC[RED], width: 5 });
  const passG = rayPath(FL, [bunF.hits[GRN], [FF[0], bunF.hits[GRN][1]]], { color: TC[GRN], width: 5 });
  const sinkFR = sinks(FL, bunF, but(RED), { inset: 3, depth: 22 }), sinkFG = sinks(FL, bunF, but(GRN), { inset: 3, depth: 22 });
  const fLab = {
    red: T(FL, PF, 232, 'red filter', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A8A' }),
    grn: T(FL, PF, 232, 'green filter', { size: 30, weight: 700, anchor: 'middle', fill: '#8EF0A0' }),
    sub: T(FL, PF, 262, 'coloured, transparent', { size: 25, weight: 600, anchor: 'middle', fill: C.muted }),
    tR: T(FL, 0, 0, 'transmits red', { size: 30, weight: 700, anchor: 'middle', fill: '#FF8A8A' }),
    tG: T(FL, 770, 356, 'transmits green', { size: 30, weight: 700, anchor: 'middle', fill: '#8EF0A0' }),
    abs: T(FL, 0, 0, 'absorbs the others', { size: 29, weight: 700, anchor: 'middle' }),
  };
  const selfChip = chip(FL, 'a filter is selfish', { size: 32, fill: 'rgba(255,228,92,0.14)', stroke: C.energy, color: C.energy });

  /* ================= D. a blue book through a red filter ================= */
  const BL = G(layer);
  const BK = [440, 525];
  const bk = book(BL, '#3B82F6', '#1E4FA8'); tr(bk, BK[0], BK[1]);
  const PB = 865;                                                  // the red filter in front of the eye (left face 845)
  const bunB = bundle(BL, L_BLUE, [432, 455], 7.5, seg(BK[0] - 80, 455, BK[0] + 70, 455));
  const sinkB = sinks(BL, bunB, but(BLU));
  const bluePt = [PB - 20, 398];
  const blueOut = rayPath(BL, [bunB.hits[BLU], bluePt], { color: TC[BLU], width: 5 });
  const blueStop = sinks(BL, { d: unit([bluePt[0] - bunB.hits[BLU][0], bluePt[1] - bunB.hits[BLU][1]]), ks: [{ c: TC[BLU], e: bluePt }] }, [0], { inset: 3, depth: 22 });
  const view = G(BL);
  E('rect', { x: 908, y: 130, width: 204, height: 124, rx: 16, fill: 'rgba(255,77,77,0.30)', stroke: '#FF8A8A', 'stroke-width': 3 }, view);
  E('rect', { x: 982, y: 154, width: 58, height: 78, rx: 5, fill: '#0B0D10', stroke: '#2B333B', 'stroke-width': 2 }, view);
  E('rect', { x: 982, y: 154, width: 11, height: 78, rx: 3, fill: '#1C2229' }, view);
  T(view, 1010, 118, 'what you see', { size: 25, weight: 600, anchor: 'middle', fill: C.muted });
  const blackLab = T(view, 1010, 292, 'looks black', { size: 32, weight: 700, anchor: 'middle' });
  [[1001, 356, 6], [993, 334, 4.5], [988, 314, 3.5]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#DCE6EE' }, view));
  const bLab = {
    book: T(BL, 0, 0, 'a blue book', { size: 28, weight: 700, anchor: 'middle', fill: '#8DB8FF' }),
    refl: T(BL, 0, 0, 'reflects only blue', { size: 29, weight: 700, anchor: 'middle', fill: '#8DB8FF' }),
    abs: T(BL, 0, 0, 'absorbed', { size: 29, weight: 700, anchor: 'middle' }),
  };

  /* ================= E. a red shirt with a green logo, in white light and in red light ================= */
  const SH = G(layer);
  E('line', { x1: 600, y1: 130, x2: 600, y2: 690, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, SH);
  const shL = shirt(SH); tr(shL, 300, 478);
  const shR = shirt(SH); tr(shR, 900, 478);
  const lampR = lamp(SH); tr(lampR, 900, 160);
  const fR = pane(SH, 96, 20, PANE_RED[0], PANE_RED[1]); tr(fR, 900, 232);
  const bunSL = bundle(SH, L_SHIRT, [300, 400], 8, xf(SHIRT_TOP, 300, 478, 1, 0));
  const bunSR = bundle(SH, [900, 160], [900, 400], 8, seg(852, 222, 948, 222));
  const sinkSR = sinks(SH, bunSR, but(RED), { inset: 2, depth: 8, len: 6 });
  const redTop = hitPoly(bunSR.hits[RED], [0, 1], xf(SHIRT_TOP, 900, 478, 1, 0));
  const redDown = rayPath(SH, [bunSR.hits[RED], redTop], { color: TC[RED], width: 5 });
  const sLab = {
    wl: T(SH, 228, 168, 'white light', { size: 28, weight: 700, anchor: 'end', fill: C.ink }),
    rl: T(SH, 972, 168, 'red light', { size: 28, weight: 700, anchor: 'start', fill: '#FF8A8A' }),
    l1: T(SH, 0, 0, 'red shirt, green logo', { size: 28, weight: 700, anchor: 'middle' }),
    r1: rich(SH, 0, 0, [['looks red, but the logo is '], ['black', '#FFFFFF', 800]], { size: 27, weight: 600, anchor: 'middle' }),
    r2: T(SH, 0, 0, 'no green light to reflect', { size: 26, weight: 600, anchor: 'middle', fill: C.muted }),
  };

  return t => {
    const tA = at('apple'), tL = at('leaf'), tW = at('whiteblack'), tN = at('noglow'), tF = at('filter'), tS = at('selfish'), tB = at('blue'), tH = at('shirt');
    // ---- the lamp glides between layouts ----
    const mv = (a, b, t0) => { const p = P(t, t0 - 0.35, 0.7); return [lerp(a[0], b[0], p), lerp(a[1], b[1], p)]; };
    let Lp = L_APPLE;
    if (t >= tW - 0.4) Lp = mv(L_APPLE, L_WB, tW);
    if (t >= tN - 0.4) Lp = mv(L_WB, L_APPLE, tN);
    if (t >= tF - 0.4) Lp = mv(L_APPLE, L_FIL, tF);
    if (t >= tB - 0.4) Lp = mv(L_FIL, L_BLUE, tB);
    if (t >= tH - 0.75) Lp = mv(L_BLUE, L_SHIRT, tH - 0.35);
    tr(lampA, Lp[0], Lp[1]);
    op(lampA, P(t, S.first - 0.5, 0.5, linear));
    const lampOn = Math.min(P(t, tA - 0.05, 0.3, linear), 1 - win(t, tN - 0.2, mid('noglow', 0.44), 0.25));
    lampA.set(lampOn);
    // ---- the eye ----
    const eyeA = Math.min(P(t, mid('why', 0.3), 0.5, linear), 1 - win(t, tW - 0.3, tN + 0.1, 0.35)) * (1 - P(t, tH - 0.75, 0.35, linear));
    const em = P(t, tF - 0.35, 0.7), ep = [lerp(EYE_A[0], EYE_F[0], em), lerp(EYE_A[1], EYE_F[1], em)], er = lerp(EYE_AR, 0, em);
    tr(eye, ep[0], ep[1], 1, er); op(eye, eyeA);
    const eF = eyeFront(ep, er);
    const seeRed = Math.max(win(t, mid('apple', 0.6), tL + 0.1, 0.4), win(t, mid('noglow', 0.8), tF - 0.1, 0.3), win(t, mid('filter', 0.62), mid('selfish', 0.3), 0.3), win(t, mid('selfish', 0.8), tB + 0.1, 0.3));
    const seeGrn = Math.max(win(t, mid('leaf', 0.75), tW - 0.1, 0.3), win(t, mid('selfish', 0.46), mid('selfish', 0.64), 0.25));
    op(eyeGlow, 0.85 * Math.max(seeRed, seeGrn) * eyeA); eyeGlow.setAttribute('fill', glow(seeGrn > seeRed ? '#4CD964' : '#FF4D4D'));
    tr(eyeGlow, eF[0] + 4, eF[1], 1 + 0.12 * Math.sin(t * 5) * calm);
    const ringP = clamp((t - mid('why', 0.72)) / 1.0);
    op(eyeRing, ringP > 0 && ringP < 1 ? (1 - ringP) * eyeA : 0); tr(eyeRing, eF[0] + 4, eF[1], 0.5 + ringP);
    // ---- the red filter: in the beam, then in front of the eye ----
    const pm = P(t, tB - 0.35, 0.8), pIn = P(t, tF + 0.05, 0.5, easeOut), pOut = P(t, tH - 0.75, 0.35, linear);
    const swapOut = P(t, mid('selfish', 0.3), 0.4) * (1 - P(t, mid('selfish', 0.62), 0.4));     // red steps aside for green
    tr(redPane, lerp(PF, PB, pm), 400 + (1 - pIn) * -30 + swapOut * 260);
    op(redPane, pIn * (1 - pOut) * (1 - swapOut));

    /* ===== A: apple, leaf, noglow ===== */
    const aA = Math.max(win(t, S.first - 0.5, tW - 0.2, 0.3), win(t, tN - 0.2, tF - 0.2, 0.3));
    op(LA, aA);
    if (aA > 0) {
      const inN = t >= tN - 0.4;
      // the apple: in, out for the leaf, back for noglow (dark until the lamp comes back on)
      const swap = inN ? 0 : P(t, tL - 0.1, 0.5);
      const ap = P(t, S.first - 0.2, 0.6, pop);
      op(apl, clamp(ap * 2) * (1 - swap)); tr(apl, AC[0], AC[1], Math.max(0.01, (0.6 + 0.4 * ap) * (1 - 0.4 * swap)));
      apl.dark(inN ? 1 - P(t, mid('noglow', 0.44), 0.4, linear) : 0);
      const lfp = P(t, tL - 0.02, 0.5, pop);
      op(lf, inN ? 0 : clamp(lfp * 2)); tr(lf, LF_AT[0], LF_AT[1], Math.max(0.01, 0.6 + 0.4 * lfp), LF_AT[3]);
      // the light: from the lamp to the apple (and then the leaf), restarting in noglow
      const tBun = inN ? mid('noglow', 0.46) : tA + 0.12, spd = inN ? 430 : 270;
      bunA.ends(appleHits.map((q, k) => inN ? q : [lerp(q[0], leafHits[k][0], swap), lerp(q[1], leafHits[k][1], swap)]));
      bunA.set(Math.max(0, (t - tBun) * spd));
      op(bunA, inN ? P(t, mid('noglow', 0.44), 0.2, linear) : 1);
      // red off the apple, then green off the leaf
      const tRed = inN ? mid('noglow', 0.61) : mid('apple', 0.27);
      ray(redOut, P(t, tRed, inN ? 1.0 : 1.3, linear), 1 - swap);
      sinkA.upd(t, inN ? mid('noglow', 0.78) : mid('apple', 0.5)); op(sinkA, 1 - swap);
      ray(grnOut, P(t, mid('leaf', 0.36), 0.9, linear), inN ? 0 : 1);
      sinkL.upd(t, mid('leaf', 0.4)); op(sinkL, inN ? 0 : swap);
      // words
      const wc = P(t, mid('why', 0.12), 0.5, pop);
      op(whyChip, clamp(wc * 2) * (1 - P(t, tA - 0.1, 0.4, linear))); tr(whyChip, AC[0], 362, Math.max(0.01, 0.6 + 0.4 * wc));
      op(labWhite, win(t, tA + 0.05, tL - 0.05, 0.4));
      slideIn(labRed, t, mid('apple', 0.33), 874, 386, (1 - P(t, tL - 0.1, 0.3, linear)) * (inN ? 0 : 1));
      slideIn(labAbs, t, mid('apple', 0.55), 340, 572, inN ? 0 : 1 - swap);
      slideIn(labGrn, t, mid('leaf', 0.5), 874, 386, inN ? 0 : 1);
      // noglow: wrong ideas struck through, the right one ticked
      op(NG, inN ? 1 : 0);
      if (inN) {
        ngChips.forEach((c, i) => { slideIn(c.g, t, mid('noglow', [0.04, 0.27][i]), 900, c.y); c.st.set(P(t, mid('noglow', [0.18, 0.41][i]), 0.4)); });
        slideIn(ngOk, t, mid('noglow', 0.68), 880, 620);
      }
    }

    /* ===== B: white card, black card ===== */
    const aW = win(t, tW - 0.2, tN - 0.2, 0.3);
    op(WB, aW);
    if (aW > 0) {
      bunW.set(Math.max(0, (t - (tW + 0.15)) * 300));
      const tBack = tW + 0.15 + bunW.time(Math.max(...bunW.ks.map(K => K.len)));
      backW.forEach(r => ray(r, P(t, tBack, 0.4, linear)));
      ray(whiteOut, P(t, tBack + 0.4, 0.7, linear));
      bunK.set(Math.max(0, (t - mid('whiteblack', 0.46)) * 300));
      sinkK.upd(t, mid('whiteblack', 0.46) + bunK.time(Math.max(...bunK.ks.map(K => K.len))) + 0.1);
      wbLab[0].forEach((l, i) => op(l, P(t, mid('whiteblack', [0.3, 0.4][i]), 0.5, linear)));
      wbLab[1].forEach((l, i) => op(l, P(t, mid('whiteblack', [0.66, 0.8][i]), 0.5, linear)));
    }

    /* ===== C: filters ===== */
    const aF = win(t, tF - 0.2, tB - 0.2, 0.3);
    op(FL, aF);
    if (aF > 0) {
      const tBun = mid('filter', 0.1);
      bunF.set(Math.max(0, (t - tBun) * 300));
      const gIn = P(t, mid('selfish', 0.32), 0.4) * (1 - P(t, mid('selfish', 0.62), 0.4));    // the green filter's turn
      tr(grnPane, PF, 400 - (1 - gIn) * 260); op(grnPane, gIn);
      ray(passR, P(t, mid('filter', 0.4), 1.3, linear), 1 - gIn);
      ray(passG, P(t, mid('selfish', 0.4), 0.8, linear), gIn);
      sinkFR.upd(t, mid('filter', 0.7)); op(sinkFR, 1 - gIn);
      sinkFG.upd(t, mid('selfish', 0.38)); op(sinkFG, gIn);
      op(fLab.red, P(t, mid('filter', 0.06), 0.4, linear) * (1 - gIn)); op(fLab.grn, gIn);
      op(fLab.sub, P(t, mid('filter', 0.14), 0.4, linear) * (1 - P(t, tS - 0.1, 0.4, linear)));
      slideIn(fLab.tR, t, mid('filter', 0.46), 770, 356, 1 - gIn); op(fLab.tG, gIn * P(t, mid('selfish', 0.44), 0.3, linear));
      slideIn(fLab.abs, t, mid('filter', 0.72), PF, 578);
      popIn(selfChip, t, mid('selfish', 0.03), 790, 182);
    }

    /* ===== D: blue book ===== */
    const aB = win(t, tB - 0.2, tH - 0.35, 0.3);
    op(BL, aB);
    if (aB > 0) {
      const bp = P(t, tB - 0.05, 0.5, pop); op(bk, clamp(bp * 2)); tr(bk, BK[0], BK[1], Math.max(0.01, 0.7 + 0.3 * bp));
      const tBun = mid('blue', 0.1);
      bunB.set(Math.max(0, (t - tBun) * 300));
      sinkB.upd(t, mid('blue', 0.38));
      ray(blueOut, P(t, mid('blue', 0.33), 1.3, linear));
      blueStop.upd(t, mid('blue', 0.33) + 1.3);
      slideIn(bLab.book, t, mid('blue', 0.05), BK[0] - 5, 668);
      slideIn(bLab.refl, t, mid('blue', 0.4), 650, 392);
      slideIn(bLab.abs, t, mid('blue', 0.6), PB, 548);
      const vp = P(t, mid('blue', 0.78), 0.55, pop); op(view, clamp(vp * 2)); zoomAt(view, 1010, 220, Math.max(0.01, 0.7 + 0.3 * vp));
    }

    /* ===== E: shirts ===== */
    const aH = P(t, tH - 0.35, 0.4, linear);
    op(SH, aH);
    if (aH > 0) {
      bunSL.set(Math.max(0, (t - (tH - 0.1)) * 360));
      lampR.set(P(t, mid('shirt', 0.04), 0.3, linear));
      bunSR.set(Math.max(0, (t - mid('shirt', 0.06)) * 300));
      sinkSR.upd(t, mid('shirt', 0.06) + bunSR.time(bunSR.ks[0].len) + 0.1);
      const tDown = mid('shirt', 0.06) + bunSR.time(bunSR.ks[0].len);
      ray(redDown, P(t, tDown, 0.6, linear));
      const lit = P(t, tDown + 0.5, 0.5, linear);
      shL.paint('#E8424F', '#4CD964');
      shR.paint(mix('#24292F', '#E8424F', lit), '#121619', mix('#3A4652', '#FF9AA2', lit));
      op(sLab.wl, P(t, tH, 0.4, linear)); op(sLab.rl, P(t, mid('shirt', 0.06), 0.4, linear));
      slideIn(sLab.l1, t, mid('shirt', 0.12), 300, 636);
      slideIn(sLab.r1, t, mid('shirt', 0.46), 900, 636);
      slideIn(sLab.r2, t, mid('shirt', 0.74), 900, 674);
    }
  };
});

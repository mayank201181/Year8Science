/* Chapter: Leaf structure and adaptations.
   A big leaf basks under the sun: a solar panel and a gas-exchange surface -> broad and flat, light landing all
   over it (large surface area) -> edge-on: thin -> a knife slices it and the cut face swings out into the
   cross-section (showpiece) -> waxy cuticle -> palisade mesophyll -> spongy mesophyll and its air spaces -> the
   camera dips to the underside: a stoma lets CO2 in and O2 out -> the guard cells open and close it (showpiece,
   with a seen-from-below view) -> veins: xylem brings water in, phloem takes sugars away. */
scene('leaf', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ================= shared art: the leaf cross-section =================
     Identical code in 03_chloro.js, 04_leaf.js and 05_supply.js, so the section looks the same in all three.
     About 700 x 380 around (0,0). Top to bottom: waxy cuticle, upper epidermis (clear brick cells), palisade
     mesophyll (tall columns lined with chloroplasts), spongy mesophyll (round, loosely packed cells; the pale
     blue between them is air space), one vein (xylem vessels blue, phloem amber), and the lower epidermis with
     one stoma between two guard cells. g.set(open 0..1) opens the stoma; g.air(v) sets how blue the air spaces
     look; g.L.* are the layer groups (for dimming); g.pal / g.spo are the cells; g.P holds anchor points.
     o.x0 / o.x1 skip cells wholly outside that x range (fewer elements when only part of it shows). */
  function leafSection(parent, o) {
    o = o || {};
    const g = G(parent), rr = rng(4242), L = {};
    const xa = o.x0 === undefined ? -999 : o.x0, xb = o.x1 === undefined ? 999 : o.x1;
    const vis = (l, r) => r >= xa && l <= xb;
    const SX = 190, VX = 40, VY = 18, VR = 50, SG = 48;
    const Y = { c0: -196, e0: -185, e1: -153, p0: -149, p1: -42, s0: -40, s1: 145, l0: 146, l1: 177 };
    const WALL = '#6FD08C', CELL = '#1D5239', CLEAR = 'rgba(205,240,225,0.10)', EDGE = '#A9DCC2', WAX = '#E6F6C6';
    const f1 = v => +v.toFixed(1);
    const chl = (p, x, y, deg) => E('ellipse', { cx: f1(x), cy: f1(y), rx: 4.6, ry: 7.6, fill: ball(C.chloro, C.chloroDk), transform: deg ? `rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})` : undefined }, p);
    // the many small chloroplasts of a layer are drawn as one path (green, with a glint) to keep elements down
    const chlSet = () => { const d = [], gl = []; return { add(x, y, deg) { deg = deg || 0; const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), A = `A4.6,7.6 ${deg.toFixed(1)} 1 0 `;
      d.push(`M${f1(x - 4.6 * ca)},${f1(y - 4.6 * sa)} ${A}${f1(x + 4.6 * ca)},${f1(y + 4.6 * sa)} ${A}${f1(x - 4.6 * ca)},${f1(y - 4.6 * sa)}Z`);
      gl.push(`M${f1(x - 1.6 * ca + 3 * sa)},${f1(y - 1.6 * sa - 3 * ca)} l0.01,0`); },
      draw(p) { if (!d.length) return; E('path', { d: d.join(''), fill: '#4CC56F', stroke: C.chloroDk, 'stroke-width': 1.4 }, p); E('path', { d: gl.join(''), fill: 'none', stroke: '#EFFFF3', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, p); } }; };
    const brick = (grp, x0, x1, y0, y1, n) => {
      const ws = []; for (let i = 0; i < n; i++) ws.push(0.82 + rr() * 0.36);
      const sum = ws.reduce((a, b) => a + b, 0); let x = x0;
      ws.forEach(w => { const ww = w / sum * (x1 - x0); if (vis(x, x + ww)) E('rect', { x: f1(x + 1.5), y: y0, width: f1(ww - 3), height: y1 - y0, rx: 9, fill: CLEAR, stroke: EDGE, 'stroke-width': 2.5 }, grp); x += ww; });
    };
    // air spaces: pale blue behind the mesophyll, showing between the loose spongy cells
    L.air = G(g);
    const airR = E('rect', { x: -350, y: Y.p1 - 6, width: 700, height: Y.l0 - Y.p1 + 12, fill: C.air, 'fill-opacity': 0.13 }, L.air);
    // spongy mesophyll: round cells with gaps between them, clear of the vein and of the chamber above the stoma
    L.spo = G(g); g.spo = []; const spoChl = chlSet();
    for (let k = 0; k < 1500 && g.spo.length < 26; k++) {
      const rx = 24 + rr() * 9, ry = rx * (0.8 + rr() * 0.28), r = Math.max(rx, ry);
      const x = -347 + rx + rr() * (694 - 2 * rx), y = Y.s0 + ry + 1 + rr() * (Y.s1 - Y.s0 - 2 * ry - 2);
      if (Math.hypot(x - VX, y - VY) < VR + r + 9) continue;
      if (Math.abs(x - SX) < SG + rx && y + ry > 90) continue;
      if (g.spo.some(c => Math.hypot(c.x - x, c.y - y) < c.r + r + 11)) continue;
      g.spo.push({ x, y, rx, ry, r, seed: k });
    }
    g.spo.forEach(c => {
      const a0 = rr() * TAU, j = [rr(), rr(), rr()];
      c.chlAt = j.map((v, i) => { const a = a0 + i * TAU / 3 + (v - 0.5) * 0.6; return [c.x + Math.cos(a) * c.rx * 0.6, c.y + Math.sin(a) * c.ry * 0.6, a * 180 / Math.PI]; });
      if (!vis(c.x - c.r, c.x + c.r)) return;
      c.vis = true;
      c.el = E('path', { d: closedPath(blobPts(c.rx, c.ry, 10, 0, 0.09, c.seed + 5).map(p => [p[0] + c.x, p[1] + c.y])), fill: CELL, stroke: WALL, 'stroke-width': 2.5 }, L.spo);
      c.chlAt.forEach(q => spoChl.add(q[0], q[1], q[2]));
    });
    spoChl.draw(L.spo);
    // one vein: bundle sheath, xylem vessels (blue, hollow) above, phloem (amber) below
    L.vein = G(g);
    if (vis(VX - VR, VX + VR)) {
      E('circle', { cx: VX, cy: VY, r: VR, fill: '#215A43', stroke: '#8EE3A4', 'stroke-width': 3 }, L.vein);
      g.xyl = [[-19, -21, 11], [5, -27, 12], [25, -14, 10], [-32, -4, 8], [7, -3, 8.5]].map(([dx, dy, r]) => E('circle', { cx: VX + dx, cy: VY + dy, r, fill: '#0D3346', stroke: C.water, 'stroke-width': 4 }, L.vein));
      g.phl = [[-22, 19, 7], [-7, 27, 7], [11, 28, 7], [25, 15, 6.5], [-8, 14, 5.5], [9, 14, 5.5]].map(([dx, dy, r]) => E('circle', { cx: VX + dx, cy: VY + dy, r, fill: '#4D3B12', stroke: C.glucose, 'stroke-width': 3 }, L.vein));
    }
    // palisade mesophyll: tall columns lined with chloroplasts
    L.pal = G(g); g.pal = []; const palChl = chlSet();
    const NP = 16, PG = 4, PW = (700 - (NP - 1) * PG) / NP;
    for (let i = 0; i < NP; i++) {
      const x = -350 + i * (PW + PG), top = Y.p0 + rr() * 3, bot = Y.p1 - rr() * 5, h = bot - top, jit = [];
      for (let k = 0; k < 20; k++) jit.push(rr() - 0.5);
      const c = { x, w: PW, top, bot, cx: x + PW / 2, cy: (top + bot) / 2 };
      g.pal.push(c);
      if (!vis(x, x + PW)) continue;
      c.vis = true;
      c.el = E('rect', { x: f1(x), y: f1(top), width: f1(PW), height: f1(h), rx: 15, fill: CELL, stroke: WALL, 'stroke-width': 2.5 }, L.pal);
      for (let k = 0; k < 5; k++) {
        const yy = top + 14 + k * (h - 30) / 4;
        palChl.add(x + 9 + jit[4 * k] * 2, yy + jit[4 * k + 1] * 4);
        palChl.add(x + PW - 9 + jit[4 * k + 2] * 2, yy + 5 + jit[4 * k + 3] * 4);
      }
    }
    palChl.draw(L.pal);
    // upper epidermis (clear brick cells) and the waxy cuticle on top
    L.epi = G(g);
    brick(L.epi, -350, 350, Y.e0, Y.e1, 13);
    L.cut = G(g);
    E('rect', { x: -350, y: Y.c0, width: 700, height: Y.e0 - Y.c0 + 1, fill: WAX, opacity: 0.5 }, L.cut);
    E('line', { x1: -350, y1: Y.c0, x2: 350, y2: Y.c0, stroke: '#F6FFE6', 'stroke-width': 2.5 }, L.cut);
    // lower epidermis with a gap for the stoma, and its thin cuticle
    L.low = G(g);
    brick(L.low, -350, SX - SG, Y.l0, Y.l1, 10);
    brick(L.low, SX + SG, 350, Y.l0, Y.l1, 2);
    E('rect', { x: -350, y: Y.l1, width: SX - SG + 350, height: 4, fill: WAX, opacity: 0.5 }, L.low);
    E('rect', { x: SX + SG, y: Y.l1, width: 350 - SX - SG, height: 4, fill: WAX, opacity: 0.5 }, L.low);
    // the two guard cells either side of the pore: open, they swell and bow apart
    L.gua = G(g);
    const gc = [-1, 1].map(s => { const cg = G(L.gua); const el = E('ellipse', { rx: 20, ry: 16, fill: '#2E7D50', stroke: '#9BEAB2', 'stroke-width': 3 }, cg); chl(cg, -3 * s, -5); chl(cg, 5 * s, 6); return { s, cg, el }; });
    g.set = v => {
      v = clamp(v);
      const rx = lerp(23.2, 17, v), ry = lerp(14.5, 19.5, v);
      gc.forEach(c => { tr(c.cg, SX + c.s * (SG - rx), 161.5); attr(c.el, 'rx', rx); attr(c.el, 'ry', ry); });
      g.open = v; g.pore = SG - 2 * rx;     // half-width of the pore
    };
    g.set(o.open === undefined ? 0.6 : o.open);
    g.P = { cut: [0, Y.c0 + 5], pal: [0, (Y.p0 + Y.p1) / 2], sto: [SX, 162], cham: [SX, 112], vein: [VX, VY], xyl: [VX + 5, VY - 27], phl: [VX - 7, VY + 27] };
    Object.assign(g, { SX, VX, VY, VR, SG, Y, L });
    g.air = v => attr(airR, 'fill-opacity', v);
    return g;
  }

  /* ================= local helpers ================= */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a label with a leader line whose far end can move: g.aim(tx, ty) */
  function pointer(parent, x, y, segs, o) {
    o = o || {};
    const g = G(parent), size = o.size || 30, col = o.line || C.muted;
    const from = o.from || [x - 10, y - size * 0.33];
    const ln = E('line', { x1: from[0], y1: from[1], x2: from[0], y2: from[1], stroke: col, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    const dot = E('circle', { r: 5, fill: col }, g);
    g.text = rich(g, x, y, typeof segs === 'string' ? [segs] : segs, { size, weight: o.weight || 700, anchor: o.anchor || 'start' });
    g.aim = (tx, ty) => { attr(ln, 'x2', tx); attr(ln, 'y2', ty); attr(dot, 'cx', tx); attr(dot, 'cy', ty); };
    if (o.to) g.aim(o.to[0], o.to[1]);
    return g;
  }
  /* a soft light ray: g.set(x1, y1, x2, y2, p0, p1) shows the part of the segment between fractions p0 and p1 */
  function ray(parent, color, w) {
    const g = G(parent); w = w || 7;
    const ls = [E('line', { stroke: color, 'stroke-width': w * 3, 'stroke-linecap': 'round', opacity: 0.18 }, g), E('line', { stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g)];
    g.set = (x1, y1, x2, y2, p0, p1) => { ls.forEach(l => { attr(l, 'x1', lerp(x1, x2, p0)); attr(l, 'y1', lerp(y1, y2, p0)); attr(l, 'x2', lerp(x1, x2, p1)); attr(l, 'y2', lerp(y1, y2, p1)); }); };
    return g;
  }
  const DROP = 'M0,-11 C6,-3 8.5,3 8.5,6.5 A8.5,8.5 0 0 1 -8.5,6.5 C-8.5,3 -6,-3 0,-11 Z';
  const drop = parent => E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 1.5 }, parent);
  const bez = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  /* position along a polyline, u in 0..1 (by length) */
  function along(pts, u) {
    if (!pts.len) { pts.seg = []; pts.len = 0; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); pts.seg.push(l); pts.len += l; } }
    let d = clamp(u) * pts.len;
    for (let i = 0; i < pts.seg.length; i++) { if (d <= pts.seg[i] || i === pts.seg.length - 1) { const f = pts.seg[i] ? Math.min(1, d / pts.seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= pts.seg[i]; }
    return pts[pts.length - 1];
  }
  /* a smooth route through the section's air spaces from a to b (local coordinates), found on a grid */
  function airRoute(sec, a, b) {
    const ST = 5, X0 = -348, Y0 = sec.Y.p1 + 3, NX = Math.floor(696 / ST) + 1, NY = Math.floor((sec.Y.l0 - 4 - Y0) / ST) + 1;
    const blocked = (x, y) => Math.hypot(x - sec.VX, y - sec.VY) < sec.VR + 7 || sec.spo.some(c => ((x - c.x) / (c.rx + 7)) ** 2 + ((y - c.y) / (c.ry + 7)) ** 2 < 1);
    const snap = p => [clamp(Math.round((p[0] - X0) / ST), 0, NX - 1), clamp(Math.round((p[1] - Y0) / ST), 0, NY - 1)];
    const [si, sj] = snap(a), [gi, gj] = snap(b), goal = gj * NX + gi, prev = new Int32Array(NX * NY).fill(-2), q = [sj * NX + si];
    prev[q[0]] = -1;
    for (let h = 0; h < q.length && prev[goal] === -2; h++) {
      const c = q[h], ci = c % NX, cj = (c - ci) / NX;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const ni = ci + di, nj = cj + dj, n = nj * NX + ni;
        if (ni < 0 || nj < 0 || ni >= NX || nj >= NY || prev[n] !== -2) continue;
        if (n !== goal && blocked(X0 + ni * ST, Y0 + nj * ST)) continue;
        prev[n] = c; q.push(n);
      }
    }
    if (prev[goal] === -2) return [a, b];
    const pts = [];
    for (let c = goal; c !== -1; c = prev[c]) { const ci = c % NX; pts.push([X0 + ci * ST, Y0 + (c - ci) / NX * ST]); }
    pts.reverse();
    let sm = pts.filter((p, i) => i % 3 === 0 || i === pts.length - 1);
    sm[0] = a; sm[sm.length - 1] = b;
    for (let k = 0; k < 3; k++) { const o2 = [sm[0]]; for (let i = 0; i < sm.length - 1; i++) { const p = sm[i], n = sm[i + 1]; o2.push([p[0] * 0.75 + n[0] * 0.25, p[1] * 0.75 + n[1] * 0.25], [p[0] * 0.25 + n[0] * 0.75, p[1] * 0.25 + n[1] * 0.75]); } o2.push(sm[sm.length - 1]); sm = o2; }
    return sm;
  }
  /* double-headed arrow from (x, y1) to (x, y2) */
  function dArrow(parent, x, y1, y2, color) {
    const g = G(parent), h = 9;
    E('line', { x1: x, y1: y1 + h, x2: x, y2: y2 - h, stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${x},${y1} L${x - h},${y1 + h * 1.3} L${x + h},${y1 + h * 1.3} Z M${x},${y2} L${x - h},${y2 - h * 1.3} L${x + h},${y2 - h * 1.3} Z`, fill: color, stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* a stoma seen from below: two kidney-shaped guard cells around a pore; g.set(open 0..1) */
  function stomaFace(parent) {
    const g = G(parent);
    const pr = rng(77);
    for (let i = 0; i < 9; i++) {      // walls of the neighbouring epidermis cells
      const a = -Math.PI / 2 + i * TAU / 9 + (pr() - 0.5) * 0.3, r0 = 104, r1 = 190, pts = [];
      for (let k = 0; k <= 5; k++) { const rk = lerp(r0, r1, k / 5); pts.push([Math.cos(a + Math.sin(k * 1.7 + i) * 0.08) * rk * 0.82, Math.sin(a + Math.sin(k * 1.7 + i) * 0.08) * rk]); }
      E('path', { d: openPath(pts), fill: 'none', stroke: '#A9DCC2', 'stroke-width': 3, opacity: 0.55 }, g);
    }
    const pore = E('path', { fill: '#06131B', stroke: '#16402B', 'stroke-width': 2 }, g);
    const cells = [-1, 1].map(s => ({ s, el: E('path', { fill: '#2E7D50', stroke: '#9BEAB2', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g), wall: E('path', { fill: 'none', stroke: '#173F2B', 'stroke-width': 6, 'stroke-linecap': 'round' }, g), chl: [0, 1, 2].map(() => E('ellipse', { rx: 6, ry: 9.5, fill: ball(C.chloro, C.chloroDk) }, g)) }));
    g.set = v => {
      v = clamp(v);
      const ho = 96, wo = 68 + 8 * v, hp = 60 + 6 * v, wp = 3 + 19 * v;
      attr(pore, 'd', `M0,${-hp} Q${-2 * wp},0 0,${hp} Q${2 * wp},0 0,${-hp} Z`);
      cells.forEach(c => {
        const s = c.s, k = 4 / 3 * wo;
        attr(c.el, 'd', `M0,${-ho} C${s * -k},${-ho} ${s * -k},${ho} 0,${ho} L0,${hp} Q${s * -2 * wp},0 0,${-hp} Z`);
        attr(c.wall, 'd', `M0,${hp} Q${s * -2 * wp},0 0,${-hp}`);
        c.chl.forEach((e, i) => { const y = (i - 1) * 42, xi = wp * (1 - (y / hp) ** 2), xo = wo * Math.sqrt(Math.max(0, 1 - (y / ho) ** 2)); attr(e, 'cx', -s * (xi + xo) / 2); attr(e, 'cy', y); });
      });
    };
    g.set(0.5);
    return g;
  }

  /* ================= A. the whole leaf ================= */
  const A = G(root);
  const SUN = [1048, 170];
  const beams = G(A);
  E('line', { x1: SUN[0], y1: SUN[1], x2: 500, y2: 420, stroke: C.energy, 'stroke-width': 90, 'stroke-linecap': 'round', opacity: 0.07 }, beams);
  E('line', { x1: SUN[0], y1: SUN[1], x2: 905, y2: 470, stroke: C.energy, 'stroke-width': 60, 'stroke-linecap': 'round', opacity: 0.07 }, beams);
  const sunG = sun(A, 46); tr(sunG, SUN[0], SUN[1]);

  // the leaf: kit leaf (205 long) plus a stalk; its transform is set every frame
  const LT = [[0, 0], [40, -60], [150, -70], [205, 0]], LB = [[205, 0], [150, 70], [40, 60], [0, 0]];
  const topPts = []; for (let i = 0; i <= 80; i++) topPts.push(bez(LT[0], LT[1], LT[2], LT[3], i / 80));
  const halfH = x => { for (let i = 1; i < topPts.length; i++) if (topPts[i][0] >= x) { const a = topPts[i - 1], b = topPts[i], f = (x - a[0]) / ((b[0] - a[0]) || 1); return -lerp(a[1], b[1], f); } return 0; };
  const leafG = G(A);
  E('path', { d: 'M-54,22 Q-26,14 -2,0', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, leafG);
  leaf(leafG, 1);
  const K1 = { x: 268, y: 452, r: -14, s: 2.2 }, K2 = { x: 334, y: 415, r: 0, s: 2.6 };
  const CUT = 100, CUTX = K2.x + K2.s * CUT;
  const leafT = (k, dx, q) => `translate(${(k.x + dx).toFixed(1)} ${k.y.toFixed(1)}) rotate(${k.r.toFixed(2)}) scale(${k.s.toFixed(4)} ${(k.s * q).toFixed(4)})`;
  const toLeaf = (lx, ly) => [K2.x + K2.s * lx, K2.y + K2.s * ly];

  // solar panel icon
  const panelG = G(A); tr(panelG, 905, 470);
  E('path', { d: 'M0,40 L0,104 M-42,106 L42,106', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 8, 'stroke-linecap': 'round' }, panelG);
  const PF = [[-102, -30], [80, -64], [104, 24], [-78, 58]];
  E('path', { d: 'M' + PF.map(p => p.join(',')).join(' L') + 'Z', fill: linGrad('#2F6BC0', '#16386E', true), stroke: '#D5E4F3', 'stroke-width': 4, 'stroke-linejoin': 'round' }, panelG);
  { let d = ''; const lp = (a, b, u) => [lerp(a[0], b[0], u).toFixed(1), lerp(a[1], b[1], u).toFixed(1)].join(',');
    for (let i = 1; i < 4; i++) d += `M${lp(PF[0], PF[1], i / 4)} L${lp(PF[3], PF[2], i / 4)} `;
    for (let j = 1; j < 3; j++) d += `M${lp(PF[0], PF[3], j / 3)} L${lp(PF[1], PF[2], j / 3)} `;
    E('path', { d, fill: 'none', stroke: '#8FB4E0', 'stroke-width': 2 }, panelG); }
  E('path', { d: 'M-80,-18 L-30,-28 L-48,6 Z', fill: '#ffffff', opacity: 0.22 }, panelG);
  T(panelG, 0, 166, 'solar panel', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  // gas exchange under the leaf
  const gasG = G(A);
  const gasIn = arrow(gasG, 372, 672, 432, 556, { color: C.co2, width: 5 });
  const gasOut = arrow(gasG, 586, 532, 648, 650, { color: '#FF9A8F', width: 5 });
  const co2a = molCO2(gasG, 11), o2a = molO2(gasG, 12);
  const gasLab = rich(gasG, 510, 718, [['gas exchange: ', C.ink, 700], ['CO₂ in', C.co2, 700], ', ', ['O₂ out', '#FF9A8F', 700]], { size: 28, anchor: 'middle' });
  const adapted = chip(A, 'each part is **adapted** for photosynthesis', { size: 30, fill: C.card2, stroke: C.plant }); tr(adapted, 560, 168);
  adapted.label.querySelectorAll('tspan[font-weight="800"]').forEach(e => e.setAttribute('fill', C.plant));

  // broad and flat: a dashed outline, and light landing all over it
  const OUT = []; for (let i = 0; i <= 60; i++) OUT.push(bez(LT[0], LT[1], LT[2], LT[3], i / 60)); for (let i = 1; i <= 60; i++) OUT.push(bez(LB[0], LB[1], LB[2], LB[3], i / 60));
  const OUTS = OUT.map(p => [(p[0] - 102) * 1.06 + 102, p[1] * 1.12].map(v => K2.s * v)).map(p => [p[0] + K2.x, p[1] + K2.y]);
  const outCum = [0]; for (let i = 1; i < OUTS.length; i++) outCum.push(outCum[i - 1] + Math.hypot(OUTS[i][0] - OUTS[i - 1][0], OUTS[i][1] - OUTS[i - 1][1]));
  const dashD = p => {   // the dashed outline drawn as far as fraction p of the way round
    const L = outCum[outCum.length - 1] * clamp(p), DASH = 17, GAP = 11; let d = '', i = 1;
    for (let s0 = 0; s0 < L; s0 += DASH + GAP) {
      const s1 = Math.min(L, s0 + DASH); let started = false;
      for (i = Math.max(1, i - 1); i < OUTS.length && outCum[i - 1] < s1; i++) {
        const a = OUTS[i - 1], b = OUTS[i], la = outCum[i - 1], lb = outCum[i];
        if (lb < s0) continue;
        const f0 = clamp((s0 - la) / ((lb - la) || 1)), f1v = clamp((s1 - la) / ((lb - la) || 1));
        if (!started) { d += `M${lerp(a[0], b[0], f0).toFixed(1)},${lerp(a[1], b[1], f0).toFixed(1)}`; started = true; }
        d += ` L${lerp(a[0], b[0], f1v).toFixed(1)},${lerp(a[1], b[1], f1v).toFixed(1)}`;
      }
    }
    return d || 'M0,0';
  };
  const outline = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, A);
  const landR = rng(15), lands = [];
  for (let i = 0; i < 11; i++) {
    const lx = 22 + (i + landR() * 0.8) * 15.5, hh = halfH(lx), ly = (landR() * 1.3 - 0.65) * hh;
    const [x, y] = toLeaf(lx, ly), dx = SUN[0] - x, dy = SUN[1] - y, L = Math.hypot(dx, dy);
    const rg = G(A), r = ray(rg, C.energy, 5), spot = E('circle', { cx: x, cy: y, r: 22, fill: glow(C.energyLt) }, rg);
    lands.push({ rg, r, spot, x, y, ux: dx / L, uy: dy / L, t0: 0.18 + (i * 0.37) % 0.5 });
  }
  const bigLab = T(A, 600, 616, 'large surface area', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const bigSub = T(A, 600, 660, 'to catch light, and let gases in and out', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const flatGas = [molCO2(A, 9), molO2(A, 10)];

  // thin, edge-on
  const thinG = G(A);
  const thinArrow = dArrow(thinG, 600, 386, 444, C.energy);
  const thinLab = rich(thinG, 600, 520, [['thin', C.energy, 700], [': a short trip for gases', C.ink, 600]], { size: 34, anchor: 'middle' });
  const thinMols = [molCO2(thinG, 9), molCO2(thinG, 9)];

  // the slice: a knife line, two leaf halves (clipped copies), and the cut face that swings out
  const halves = [-1, 1].map(side => {
    const outer = G(A), inner = G(outer), id = 'phLeafHalf' + (side < 0 ? 'L' : 'R');
    const cp = E('clipPath', { id }, defs());
    E('rect', side < 0 ? { x: -80, y: -90, width: 80 + CUT, height: 180 } : { x: CUT, y: -90, width: 140, height: 180 }, cp);
    inner.setAttribute('clip-path', `url(#${id})`);
    if (side < 0) E('path', { d: 'M-54,22 Q-26,14 -2,0', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, inner);
    leaf(inner, 1);
    const hh = halfH(CUT);
    E('line', { x1: CUT, y1: -hh + 1, x2: CUT, y2: hh - 1, stroke: '#DFFBE6', 'stroke-width': 2.2, 'stroke-linecap': 'round' }, inner);
    return { side, outer };
  });
  const knife = G(A);
  const kLine = E('line', { x1: CUTX, y1: 236, x2: CUTX, y2: 236, stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '14 9' }, knife);
  const kTip = E('circle', { r: 22, fill: glow('#FFFFFF') }, knife);

  /* ================= B. the cross-section ================= */
  const B = G(root);
  const BASE = { x: 395, y: 425 };
  const secG = G(B);
  const sec = leafSection(secG, { open: 0.55 });
  const fx = G(secG);                        // effects in section coordinates (they zoom with it)
  let cam = { x: BASE.x, y: BASE.y, s: 1 };
  const toS = (lx, ly) => [cam.x + cam.s * lx, cam.y + cam.s * ly];
  const heading = T(B, 395, 196, 'a slice through a leaf', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  // cuticle: a glow on the band, water drops bouncing back down, light passing through
  const cutGlow = E('rect', { x: -350, y: -200, width: 700, height: 18, rx: 6, fill: C.energyLt }, fx);
  const cutDrops = [-230, -120, -10].map(x => ({ x, el: drop(fx) }));
  const cutRays = [140, 205, 270].map(x => ({ x, r: ray(fx, C.energy, 6) }));
  // palisade: per-column light, one column outlined, light stopping here, glucose made
  const palGlow = sec.pal.map(c => E('rect', { x: c.x, y: c.top, width: c.w, height: c.bot - c.top, rx: 15, fill: '#D6FFE0' }, fx));
  const PC = 3, pcol = sec.pal[PC];
  const palBox = E('rect', { x: pcol.x - 3, y: pcol.top - 3, width: pcol.w + 6, height: pcol.bot - pcol.top + 6, rx: 17, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, fx);
  const palRays = [-270, -140, -10, 120].map((x, i) => ({ x: sec.pal[Math.round((x + 350) / 43.75)].cx, r: ray(fx, C.energy, 6), sp: spark(fx, 12, { seed: i + 2 }) }));
  const palGlu = [1, 6, 9, 13].map(i => { const gg = molGlucose(fx, 11); return { g: gg, c: sec.pal[i] }; });
  // spongy: carbon dioxide finding its way through the air spaces to the cells
  const goalPal = sec.pal[11], goalSpo = sec.spo.reduce((b, c) => (Math.hypot(c.x + 150, c.y - 40) < Math.hypot(b.x + 150, b.y - 40) ? c : b));
  const routes = [
    [[sec.SX - 6, 232], [sec.SX - 2, 150]].concat(airRoute(sec, [sec.SX, 130], [goalPal.cx, sec.Y.p1 + 4])),
    [[sec.SX + 10, 240], [sec.SX + 2, 150]].concat(airRoute(sec, [sec.SX - 4, 128], [goalSpo.x + goalSpo.rx + 6, goalSpo.y])),
  ];
  const spoMols = routes.map(() => molCO2(fx, 8.5));
  // stomata: carbon dioxide in, oxygen out
  const inPath = [[sec.SX - 74, 252], [sec.SX - 22, 212], [sec.SX, 150], [sec.SX + 6, 110], [sec.SX - 20, 70]];
  const outPath = [[sec.SX + 26, 74], [sec.SX + 4, 118], [sec.SX, 160], [sec.SX + 24, 212], [sec.SX + 76, 252]];
  const stIn = molCO2(fx, 7), stOut = molO2(fx, 7.5);
  // guard: carbon dioxide slips in while it is open
  const gPath = [[sec.SX + 20, 300], [sec.SX + 4, 205], [sec.SX, 150], [sec.SX - 8, 100], [sec.SX - 36, 66]];
  const gMol = molCO2(fx, 7);
  const gDrop = drop(fx);
  // veins: water out of the xylem up into the cells, sugar from the cells down into the phloem
  const veinRing = E('circle', { cx: sec.VX, cy: sec.VY, r: sec.VR + 8, fill: 'none', stroke: C.water, 'stroke-width': 4, 'stroke-dasharray': '12 9' }, fx);
  const vDrops = [[sec.VX - 19, sec.VY - 21], [sec.VX + 25, sec.VY - 14], [sec.VX + 5, sec.VY - 27]].map((p, i) => ({ p, el: drop(fx), ph: i / 3 }));
  const vSug = [0, 1, 2].map(i => ({ g: molGlucose(fx, 9), ph: i / 3, path: [[sec.VX - 64 + i * 6, -86], [sec.VX - 74, -20], [sec.VX - 46, 44], [sec.VX - 14, 42]] }));

  // labels (screen coordinates)
  const labG = G(B);
  const LX = 780;
  const sub = (y, segs, o) => rich(labG, LX, y, segs, Object.assign({ size: 25, weight: 500, fill: C.muted }, o || {}));
  const labCut = pointer(labG, LX, 236, [['waxy cuticle', C.ink]]);
  const subCut1 = sub(274, [['waterproof', '#BDEBFA', 700], [': less water lost']]);
  const subCut2 = sub(308, [['clear', C.energyLt, 700], [': lets light through']]);
  const labPal = pointer(labG, LX, 320, [['palisade mesophyll', C.ink]]);
  const subPal1 = sub(358, [['tall', C.energy, 700], [' cells, full of chloroplasts']]);
  const subPal2 = sub(392, [['most photosynthesis', C.plant, 700], [' is here']]);
  const labSpo = pointer(labG, LX, 412, [['spongy mesophyll', C.ink]]);
  const subSpo1 = sub(450, [['loosely packed', C.plant, 700], [' cells']]);
  const subSpo2 = sub(484, [['air spaces', C.air, 700], [': CO₂ reaches them all']]);
  const labXyl = pointer(labG, LX, 486, [['xylem', C.water], [': water in', C.ink]]);
  const labPhl = pointer(labG, LX, 546, [['phloem', C.glucose], [': sugars out', C.ink]]);
  const labSto = pointer(labG, LX, 668, [['stoma + guard cells', C.ink]]);
  const sumCut = pointer(labG, LX, 236, [['waxy cuticle', C.ink]], { size: 28 });
  const sumPal = pointer(labG, LX, 320, [['palisade mesophyll', C.ink]], { size: 28 });
  const sumSpo = pointer(labG, LX, 412, [['spongy mesophyll', C.ink]], { size: 28 });
  // zoomed in on the stoma
  const stChip = chip(labG, '**stomata**: tiny pores', { size: 32, fill: C.card2, stroke: C.line }); tr(stChip, 975, 196);
  stChip.label.querySelectorAll('tspan[font-weight="800"]').forEach(e => e.setAttribute('fill', C.energy));
  const labOne = pointer(labG, 790, 612, [['one = a ', C.ink, 600], ['stoma', C.energy, 700]], { size: 30 });
  const labIn = rich(labG, 300, 702, [['carbon dioxide in', C.co2, 700]], { size: 28, anchor: 'middle' });
  const labOutT = rich(labG, 590, 702, [['oxygen out', '#FF9A8F', 700]], { size: 28, anchor: 'middle' });
  const labGuard = G(labG);
  const gLines = [0, 1].map(() => ({ ln: E('line', { stroke: C.energy, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, labGuard), dot: E('circle', { r: 5, fill: C.energy }, labGuard) }));
  rich(labGuard, 300, 676, [['guard cells', C.energy, 700]], { size: 32, anchor: 'middle' });
  // seen from below
  const inset = G(labG); tr(inset, 975, 420);
  const insetClip = E('clipPath', { id: 'phLeafInset' }, defs());
  E('rect', { x: -170, y: -150, width: 340, height: 300, rx: 26 }, insetClip);
  card(inset, -170, -150, 340, 300, { fill: '#163A2E', stroke: C.line });
  const faceG = G(inset); faceG.setAttribute('clip-path', 'url(#phLeafInset)');
  const face = stomaFace(faceG); tr(face, 0, 6, 0.95);
  T(inset, 0, -168, 'seen from below', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const stOpen = rich(inset, 0, 200, [['open', C.good, 700], [': gases in and out', C.ink, 600]], { size: 28, anchor: 'middle' });
  const stShut = rich(inset, 0, 200, [['closed', C.energy, 700], [': saves water', C.ink, 600]], { size: 28, anchor: 'middle' });

  routes.concat([inPath, outPath, gPath], vSug.map(o => o.path)).forEach(pts => along(pts, 0));   // measure paths now, not mid-play

  /* ================= update ================= */
  return t => {
    const tt = S.reduce ? 0 : t;
    const tPan = at('panel'), tFl = at('flat'), tTh = at('thin'), tSl = at('slice'), tCu = at('cuticle'), tPa = at('palisade'), tSp = at('spongy'), tSt = at('stomata'), tGu = at('guard'), tVe = at('veins');
    const tSplit = tSl + 1.05, tSwing = tSl + 1.15;

    /* ---------- A: the whole leaf ---------- */
    const aA = 1 - P(t, tSwing + 0.9, 0.6, linear);
    op(A, aA);
    if (aA > 0) {
      sunG.upd(tt);
      op(sunG, 1 - P(t, tTh - 0.2, 0.5, linear));
      const bm = (1 - P(t, tFl - 0.1, 0.5, linear));
      op(beams, bm);
      // where the leaf is
      const m1 = P(t, tFl - 0.1, 0.9), m2 = P(t, tTh - 0.05, 0.6), m3 = P(t, tSl - 0.1, 0.55);
      const k = { x: lerp(K1.x, K2.x, m1), y: lerp(K1.y, K2.y, m1), r: lerp(K1.r, K2.r, m1), s: lerp(K1.s, K2.s, m1) };
      const q = lerp(lerp(1, 0.15, m2), 1, m3);
      const pin = P(t, tPan - 0.3, 0.8, easeOut);
      leafG.setAttribute('transform', leafT(k, 0, q));
      op(leafG, pin * (t < tSplit ? 1 : 0));
      // panel and gas exchange
      const pp = P(t, mid('panel', 0.16), 0.6, pop), pOut = 1 - P(t, tFl - 0.1, 0.4, linear);
      op(panelG, clamp(pp * 2) * pOut); tr(panelG, 905, 470 + (1 - clamp(pp)) * 24, 0.85 + 0.15 * pp);
      const gA = P(t, mid('panel', 0.36), 0.5, linear) * pOut;
      op(gasG, gA);
      if (gA > 0) {
        gasIn.set(P(t, mid('panel', 0.36), 0.6)); gasOut.set(P(t, mid('panel', 0.46), 0.6));
        const u1 = ((t - mid('panel', 0.36)) / 2.6) % 1, u2 = ((t - mid('panel', 0.46)) / 2.6) % 1;
        tr(co2a, lerp(360, 436, ease(u1)), lerp(694, 548, ease(u1)), 1, -60); op(co2a, Math.min(1, u1 * 6, (1 - u1) * 5));
        tr(o2a, lerp(584, 650, ease(u2)), lerp(520, 672, ease(u2)), 1, 60); op(o2a, Math.min(1, u2 * 6, (1 - u2) * 5));
        op(gasLab, P(t, mid('panel', 0.5), 0.5, linear));
      }
      const ap = P(t, mid('panel', 0.66), 0.5, pop);
      op(adapted, clamp(ap * 2) * pOut); tr(adapted, 560, 168, Math.max(0.01, 0.7 + 0.3 * ap));

      // broad and flat
      const fA = win(t, tFl, tTh + 0.1, 0.4);
      op(outline, fA);
      if (fA > 0) outline.setAttribute('d', dashD(P(t, mid('flat', 0.1), 1.8, linear)));
      lands.forEach(o => {
        const t0 = mid('flat', o.t0), u = (t - t0) / 0.5, aL = win(t, t0 - 0.05, tTh + 0.1, 0.3);
        op(o.rg, aL);
        if (aL <= 0) return;
        const D = 300 * (1 - clamp(u));
        o.r.set(o.x + o.ux * (D + 110), o.y + o.uy * (D + 110), o.x + o.ux * D, o.y + o.uy * D, 0, 1);
        op(o.r, 1 - P(u, 0.85, 0.15, linear));
        op(o.spot, P(u, 0.9, 0.1, linear) * (1 - 0.6 * P(u, 1.1, 1.0, linear)));
      });
      op(bigLab, win(t, mid('flat', 0.4), tTh + 0.1, 0.4));
      op(bigSub, win(t, mid('flat', 0.62), tTh + 0.1, 0.4));
      [0, 1].forEach(i => {
        const m = flatGas[i], u = clamp((t - mid('flat', 0.74 + i * 0.08)) / 1.4);
        const p0 = i ? toLeaf(170, -30) : toLeaf(36, 22), p1 = i ? [p0[0] + 60, p0[1] - 120] : [p0[0] - 50, p0[1] + 110];
        const p = i ? ease(u) : 1 - ease(u);
        tr(m, lerp(p0[0], p1[0], p), lerp(p0[1], p1[1], p), 1, 30 * u);
        op(m, (u > 0 && u < 1 ? Math.min(1, u * 5, (1 - u) * 5) : 0) * (1 - P(t, tTh, 0.3, linear)));
      });

      // thin
      const thA = win(t, tTh + 0.3, tSl + 0.05, 0.3);
      op(thinG, thA);
      if (thA > 0) {
        tr(thinArrow, 0, 0); op(thinArrow, P(t, mid('thin', 0.3), 0.3, linear));
        op(thinLab, P(t, mid('thin', 0.38), 0.4, linear));
        thinMols.forEach((m, i) => {
          const u = clamp((t - mid('thin', 0.36 + i * 0.3)) / 0.8), x = i ? 700 : 500;
          tr(m, x, lerp(462, 416, ease(u)), 1, 90); op(m, u > 0 && u < 1 ? Math.min(1, u * 5, (1 - u) * 4) : 0);   // starts clear of the label
        });
      }

      // the slice
      const kn = P(t, tSl + 0.42, 0.6, linear);
      op(knife, (t > tSl + 0.4 ? 1 : 0) * (1 - P(t, tSwing + 0.1, 0.3, linear)));
      attr(kLine, 'y2', lerp(236, 594, kn)); tr(kTip, CUTX, lerp(236, 594, kn));
      const sp = P(t, tSplit, 0.7);
      halves.forEach(h => {
        op(h.outer, (t >= tSplit ? 1 : 0) * (1 - P(t, tSwing + 0.15, 0.6, linear)));
        h.outer.setAttribute('transform', leafT(K2, h.side * 46 * sp, 1));
      });
    }

    /* ---------- B: the cross-section ---------- */
    const aB = P(t, tSwing - 0.05, 0.2, linear);
    op(B, aB);
    if (aB <= 0) return;
    const sw = P(t, tSwing, 1.6, ease);
    // zoom: the camera dips to the stoma for stomata + guard, then pulls back out for the veins
    const Zp = P(t, tSt - 0.15, 1.1) * (1 - P(t, tVe - 0.3, 1.0));
    // (zoomed in, the section stays below the chapter tag: its top layers fade and the air spaces start at y = 134)
    const zs = lerp(1, 1.6, Zp), fxp = lerp(BASE.x + sec.SX, 440, Zp), fyp = lerp(BASE.y + 162, 470, Zp);
    cam = { x: fxp - zs * sec.SX, y: fyp - zs * 162, s: zs };
    if (sw < 1) {
      const x = lerp(CUTX, cam.x, sw), y = lerp(K2.y, cam.y, sw), r = 90 * (1 - P(sw, 0, 0.75, ease));
      const sx = lerp(2 * halfH(CUT) * K2.s / 700, 1, sw), sy = lerp(0.04, 1, P(sw, 0.25, 0.75, ease));
      secG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`);
    } else secG.setAttribute('transform', `translate(${cam.x.toFixed(1)} ${cam.y.toFixed(1)}) scale(${cam.s.toFixed(4)})`);
    op(heading, P(t, tSwing + 1.4, 0.5, linear) * (1 - P(t, mid('cuticle', 0.6), 0.4, linear)));

    // focus: the layer being described stays bright, the rest dims
    const dim = P(t, tCu - 0.2, 0.5, linear);
    const fCu = win(t, tCu - 0.1, tPa + 0.1, 0.4), fPa = win(t, tPa - 0.1, tSp + 0.1, 0.4), fSp = win(t, tSp - 0.1, tSt + 0.1, 0.4);
    const fSt = win(t, tSt - 0.1, tVe + 0.1, 0.4), fVe = P(t, tVe - 0.1, 0.4, linear);
    const base = 0.42 + 0.33 * P(t, tVe + 1.2, 1.0, linear);
    const lv = f => lerp(1, base + (1 - base) * f, dim);
    const zf = 1 - Zp;
    op(sec.L.cut, lv(fCu) * zf); op(sec.L.epi, lv(fCu) * zf); op(sec.L.pal, lv(fPa) * zf);
    op(sec.L.spo, lv(fSp)); op(sec.L.air, lv(Math.max(fSp, fSt * 0.6)));
    op(sec.L.low, lv(fSt)); op(sec.L.gua, lv(fSt)); op(sec.L.vein, lv(fVe) * (1 - 0.5 * Zp));
    sec.air(0.13 + 0.27 * P(t, mid('spongy', 0.44), 0.8, linear) * (1 - 0.5 * P(t, tVe, 0.8, linear)));

    // cuticle
    op(cutGlow, fCu * (0.25 + 0.3 * wave(tt, 1.6)) * P(t, tCu, 0.5, linear));
    cutDrops.forEach((o, i) => {
      const u = (t - mid('cuticle', 0.36 + i * 0.07)) / 1.5;
      if (u <= 0 || u >= 1 || fCu <= 0) { op(o.el, 0); return; }
      const y = u < 0.5 ? lerp(-128, -184, easeOut(u * 2)) : lerp(-184, -134, ease((u - 0.5) * 2));
      tr(o.el, o.x, y, 1.1); op(o.el, Math.min(1, u * 8, (1 - u) * 6) * fCu);
    });
    cutRays.forEach((o, i) => {
      const t0 = mid('cuticle', 0.76 + i * 0.05), u = clamp((t - t0) / 0.9);
      op(o.r, (t > t0 ? 1 : 0) * fCu);
      if (t > t0) o.r.set(o.x, -330, o.x - 20, -116, 0, ease(u));
    });

    // palisade
    const pw = P(t, mid('palisade', 0.05), 0.6, linear) * fPa;
    palGlow.forEach((e, i) => op(e, pw * (0.08 + 0.2 * wave(tt * 0.9 - i * 0.09, 1.8))));
    op(palBox, win(t, mid('palisade', 0.22), mid('palisade', 0.55), 0.3));
    palRays.forEach((o, i) => {
      const t0 = mid('palisade', 0.56 + i * 0.04), u = clamp((t - t0) / 0.8);
      const aR = (t > t0 ? 1 : 0) * fPa;
      op(o.r, aR); op(o.sp, aR * P(u, 0.85, 0.15, linear));
      if (aR > 0) { o.r.set(o.x + 12, -330, o.x, -88, 0, ease(u)); tr(o.sp, o.x, -88, 0.9 + 0.2 * wave(tt, 0.8, i * 0.2)); o.sp.upd(tt + i); }
    });
    palGlu.forEach((o, i) => { const p = P(t, mid('palisade', 0.8 + i * 0.04), 0.5, pop); op(o.g, clamp(p * 2) * fPa); tr(o.g, o.c.cx, o.c.cy + 6, Math.max(0.01, p)); });

    // spongy
    spoMols.forEach((m, i) => {
      const t0 = mid('spongy', 0.5 + i * 0.12), u = (t - t0) / 3.0;
      if (u <= 0 || u >= 1.25 || fSp <= 0) { op(m, 0); return; }
      const p = along(routes[i], Math.min(1, ease(Math.min(1, u)))), p2 = along(routes[i], Math.min(1, ease(Math.min(1, u)) + 0.02));
      tr(m, p[0], p[1], 1, Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI);
      op(m, Math.min(1, u * 6, (1.25 - u) * 4) * fSp);
    });

    // stomata: CO2 in, O2 out (the stoma is open)
    const gOpen = (() => {
      if (t < tGu + 0.6) return 0.62;
      const c1 = P(t, mid('guard', 0.12), 0.7), o1 = P(t, mid('guard', 0.3), 1.0), c2 = P(t, mid('guard', 0.68), 0.9);
      return lerp(lerp(lerp(lerp(0.62, 0, c1), 1, o1), 0, c2), 0.55, P(t, tVe + 0.6, 0.8));
    })();
    sec.set(gOpen); face.set(gOpen);
    const moveMol = (m, path, t0, dur, a) => {
      const u = (t - t0) / dur;
      if (u <= 0 || u >= 1 || a <= 0) { op(m, 0); return; }
      const p = along(path, ease(u)), p2 = along(path, Math.min(1, ease(u) + 0.02));
      tr(m, p[0], p[1], 1, Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI);
      op(m, Math.min(1, u * 6, (1 - u) * 6) * a);
    };
    const aSt = win(t, tSt + 0.8, tGu - 0.1, 0.3);
    moveMol(stIn, inPath, mid('stomata', 0.6), 2.4, aSt);
    moveMol(stOut, outPath, mid('stomata', 0.76), 2.0, aSt);
    moveMol(gMol, gPath, mid('guard', 0.44), 1.5, win(t, tGu, tVe, 0.3));
    { const u = clamp((t - mid('guard', 0.84)) / 1.1), a = win(t, mid('guard', 0.84), tVe - 0.1, 0.3);
      op(gDrop, a); tr(gDrop, sec.SX + 4, lerp(96, 136, easeOut(u)) - 6 * Math.sin(P(u, 0.7, 0.3, linear) * Math.PI), 1); }

    // veins
    op(veinRing, fVe * P(t, tVe + 0.5, 0.4, linear)); veinRing.setAttribute('stroke-dashoffset', (-tt * 20).toFixed(1));
    vDrops.forEach(o => {
      const t0 = mid('veins', 0.3), u = ((t - t0) / 1.8 + o.ph) % 1, a = (t > t0 ? 1 : 0) * fVe;
      if (a <= 0) { op(o.el, 0); return; }
      tr(o.el, o.p[0], lerp(o.p[1], -112, u), 0.9); op(o.el, a * Math.min(1, u * 6, (1 - u) * 4));
    });
    vSug.forEach(o => {
      const t0 = mid('veins', 0.62), u = ((t - t0) / 2.0 + o.ph) % 1, a = (t > t0 ? 1 : 0) * fVe;
      if (a <= 0) { op(o.g, 0); return; }
      const p = along(o.path, u); tr(o.g, p[0], p[1], Math.max(0.01, 1 - 0.75 * P(u, 0.72, 0.28, linear))); op(o.g, a * Math.min(1, u * 6, (1 - u) * 3));
    });

    /* ---------- labels ---------- */
    const lab = (g, a, tx, ty) => { op(g, a); if (a > 0 && g.aim) { const p = toS(tx, ty); g.aim(p[0], p[1]); } };
    lab(labCut, win(t, mid('cuticle', 0.06), end('cuticle') + 0.1, 0.35), 330, -191);
    op(subCut1, win(t, mid('cuticle', 0.42), end('cuticle') + 0.1, 0.35));
    op(subCut2, win(t, mid('cuticle', 0.75), end('cuticle') + 0.1, 0.35));
    lab(labPal, win(t, mid('palisade', 0.04), end('palisade') + 0.1, 0.35), sec.pal[14].cx, -96);
    op(subPal1, win(t, mid('palisade', 0.2), end('palisade') + 0.1, 0.35));
    op(subPal2, win(t, mid('palisade', 0.76), end('palisade') + 0.1, 0.35));
    const spoT = sec.spo.reduce((b, c) => (Math.hypot(c.x - 285, c.y - 2) < Math.hypot(b.x - 285, b.y - 2) ? c : b));
    lab(labSpo, win(t, mid('spongy', 0.04), end('spongy') + 0.1, 0.35), spoT.x + spoT.rx * 0.5, spoT.y - spoT.ry * 0.3);
    op(subSpo1, win(t, mid('spongy', 0.3), end('spongy') + 0.1, 0.35));
    op(subSpo2, win(t, mid('spongy', 0.46), end('spongy') + 0.1, 0.35));
    // zoomed in
    const cp = P(t, mid('stomata', 0.24), 0.5, pop);
    op(stChip, clamp(cp * 2) * (1 - P(t, tGu - 0.1, 0.4, linear))); tr(stChip, 975, 196, Math.max(0.01, 0.75 + 0.25 * cp));
    lab(labOne, win(t, mid('stomata', 0.42), tGu, 0.35), sec.SX, 180);
    op(labIn, win(t, mid('stomata', 0.62), tGu, 0.35));
    op(labOutT, win(t, mid('stomata', 0.8), tGu, 0.35));
    const aG = win(t, mid('guard', 0.14), tVe - 0.1, 0.35);
    op(labGuard, aG);
    if (aG > 0) gLines.forEach((o, i) => { const p = toS(sec.SX + (i ? 1 : -1) * 26, 176); attr(o.ln, 'x1', i ? 330 : 270); attr(o.ln, 'y1', 646); attr(o.ln, 'x2', p[0]); attr(o.ln, 'y2', p[1]); attr(o.dot, 'cx', p[0]); attr(o.dot, 'cy', p[1]); });
    const ip = P(t, mid('guard', 0.08), 0.6, pop), aIn = clamp(ip * 2) * (1 - P(t, tVe - 0.25, 0.4, linear));
    op(inset, aIn); tr(inset, 975, 420 + (1 - clamp(ip)) * 20, Math.max(0.01, 0.85 + 0.15 * ip));
    op(stOpen, aIn * clamp((gOpen - 0.45) * 5)); op(stShut, aIn * clamp((0.25 - gOpen) * 5) * P(t, mid('guard', 0.2), 0.3, linear));
    // veins and the summary
    lab(labXyl, P(t, mid('veins', 0.3), 0.4, linear), sec.VX + 5, sec.VY - 27);
    lab(labPhl, P(t, mid('veins', 0.6), 0.4, linear), sec.VX - 7, sec.VY + 27);
    const sA = 0.6 * P(t, tVe + 1.2, 0.8, linear);
    lab(sumCut, sA, 330, -191); lab(sumPal, sA, sec.pal[14].cx, -96); lab(sumSpo, sA, spoT.x + spoT.rx * 0.5, spoT.y - spoT.ry * 0.3);
    lab(labSto, sA, sec.SX, 182);
  };
});

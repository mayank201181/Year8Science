/* Chapter: Getting the raw materials in.
   A potted plant: carbon dioxide from the air and water from the soil, both heading for the chloroplasts ->
   a window zooms onto one stoma: CO2 crowds outside and drifts in through the pore, from more concentrated to
   less concentrated (showpiece) -> inside, chloroplasts use it up, so it keeps flowing in, faster -> no energy
   needed -> the window moves to a root hair cell soaking up water -> the camera follows water up the xylem into
   the leaf (showpiece) -> water evaporating from the leaf pulls the column up, step by step: transpiration ->
   back at the stoma, oxygen diffuses out. */
scene('supply', S => {
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
    g.text = rich(g, x, y, segs, { size, weight: o.weight || 700, anchor: o.anchor || 'start' });
    g.aim = (tx, ty) => { attr(ln, 'x2', tx); attr(ln, 'y2', ty); attr(dot, 'cx', tx); attr(dot, 'cy', ty); };
    if (o.to) g.aim(o.to[0], o.to[1]);
    return g;
  }
  /* a pill with coloured text segments; o: size, fill, stroke */
  function pill(parent, segs, o) {
    o = o || {};
    const size = o.size || 28, plain = segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
    const w = Math.ceil(textWidth(plain, size, FD, 700) + size * 1.5 + (o.extra || 0)), h = Math.round(size * 1.75);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || C.card2, stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    g.text = rich(g, (o.extra || 0) / 2, size * 0.35, segs, { size, weight: 700, anchor: 'middle' });
    g.w = w;
    return g;
  }
  const DROP = 'M0,-11 C6,-3 8.5,3 8.5,6.5 A8.5,8.5 0 0 1 -8.5,6.5 C-8.5,3 -6,-3 0,-11 Z';
  const drop = (parent, s) => { const d = E('path', { d: DROP, fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 1.5 }, parent); if (s) d.setAttribute('transform', `scale(${s})`); return d; };
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
  /* where something is on a timetable of moves: legs [[t0, t1, pts], ...]; null before the first leg */
  function legsAt(legs, t) {
    if (t < legs[0][0]) return null;
    for (let i = 0; i < legs.length; i++) {
      const [t0, t1, pts] = legs[i];
      if (t <= t1 || i === legs.length - 1) { const u = clamp((t - t0) / ((t1 - t0) || 1)); const p = along(pts, ease(u)), p2 = along(pts, Math.min(1, ease(u) + 0.03)); return { p, ang: Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI, u, i }; }
      if (i + 1 < legs.length && t < legs[i + 1][0]) { const pts2 = legs[i][2]; return { p: pts2[pts2.length - 1], ang: null, u: 1, i, wait: true }; }
    }
    return null;
  }
  const camLerp = (a, b, p) => ({ x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), s: lerp(a.s, b.s, p) });
  /* lib molCO2 / molO2 drawn without a group per atom (4 and 3 elements instead of 7 and 5); same look */
  const atomC = (g, kind, r, x) => E('circle', { cx: x, r, fill: ball(ATOM[kind][0], ATOM[kind][1]), stroke: ATOM[kind][1], 'stroke-width': Math.max(1.5, r * 0.08) }, g);
  const co2Lite = (parent, r) => { const g = G(parent); atomC(g, 'O', r * 0.9, -r * 1.6); atomC(g, 'O', r * 0.9, r * 1.6); atomC(g, 'C', r, 0); return g; };
  const o2Lite = (parent, r) => { const g = G(parent); atomC(g, 'O', r, -r * 0.72); atomC(g, 'O', r, r * 0.72); return g; };

  /* ================= the potted plant: the intro's plant (00_intro.js) with 01_bigidea.js's see-through
     pot and roots (plus root hairs). Plant coordinates are the intro plant's own, x K5; origin at the middle
     of the soil surface. The plant's art is drawn in layers (inK5) so the xylem, drops and vapour can sit
     between them. ================= */
  const K5 = 1.2, kp = p => [p[0] * K5, p[1] * K5];
  const plantCam = G(root), plant = G(plantCam);
  const inK5 = () => { const g = G(plant); tr(g, 0, 0, K5); return g; };
  E('path', { d: 'M-110,-6 L110,-6 L110,24 L100,24 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 L-100,24 L-110,24 Z', fill: linGrad('#7A5538', '#3E2818', true) }, inK5());
  // roots in the soil, with fine root hairs
  const ROOTS = [[[0, -4], [2, 40], [-6, 90], [-2, 150]], [[-1, 20], [-20, 40], [-40, 60], [-62, 92]], [[1, 30], [22, 52], [44, 70], [66, 104]], [[-2, 70], [-18, 92], [-30, 118], [-40, 150]], [[-1, 96], [14, 116], [26, 138], [34, 160]], [[-40, 58], [-56, 66], [-70, 70], [-84, 72]], [[40, 62], [54, 72], [64, 82], [76, 84]]].map(c => c.map(kp));
  { let rd = '', hd = '';
    ROOTS.forEach(c => {
      rd += `M${c[0]} C${c[1]} ${c[2]} ${c[3]} `;
      for (let i = 2; i <= 9; i++) { const u = i / 10, p = bez(c[0], c[1], c[2], c[3], u), q = bez(c[0], c[1], c[2], c[3], u + 0.02); const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1, s = (i % 2 ? 1 : -1) * 7; hd += `M${p[0].toFixed(1)},${p[1].toFixed(1)} l${(-dy / L * s).toFixed(1)},${(dx / L * s).toFixed(1)} `; }
    });
    E('path', { d: rd, fill: 'none', stroke: '#EAD7B7', 'stroke-width': 5 * K5, 'stroke-linecap': 'round' }, plant);
    E('path', { d: hd, fill: 'none', stroke: '#EAD7B7', 'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0.85 }, plant); }
  const soilDrops = [[-80, 50], [-70, 185], [36, 55], [92, 150], [-20, 104], [58, 177], [-88, 150]].map(([x, y], i) => ({ x, y, i, el: drop(plant) }));
  // the xylem: up the main root, up the stem, into one leaf's vein (leaf L2: the intro plant's lower right leaf)
  const STEM = [[0, -6], [-9, -90], [10, -180], [0, -268]].map(kp);
  const L2 = { x: 5 * K5, y: -135 * K5, r: -24 * Math.PI / 180, s: 0.66 * K5 };
  const onL2 = (lx, ly) => [L2.x + L2.s * (lx * Math.cos(L2.r) - ly * Math.sin(L2.r)), L2.y + L2.s * (lx * Math.sin(L2.r) + ly * Math.cos(L2.r))];
  let uL2 = 0; while (uL2 < 1 && bez(STEM[0], STEM[1], STEM[2], STEM[3], uL2)[1] > L2.y) uL2 += 0.002;
  const XP = [];
  for (let i = 20; i >= 0; i--) XP.push(bez(ROOTS[0][0], ROOTS[0][1], ROOTS[0][2], ROOTS[0][3], i / 20 * 0.8));
  for (let i = 0; i <= 30; i++) XP.push(bez(STEM[0], STEM[1], STEM[2], STEM[3], i / 30 * uL2));
  for (let i = 1; i <= 12; i++) XP.push(onL2(i / 12 * 182, 0));
  const xd = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  const xyRoot = G(plant);
  E('path', { d: xd(XP.slice(0, 21)), fill: 'none', stroke: '#9FD8FF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.6 }, xyRoot);
  E('path', { d: xd(XP.slice(0, 21)), fill: 'none', stroke: '#0D3346', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, xyRoot);
  // stem and leaves: the intro's (kit leaves; the side veins merged into one path)
  { const top = inK5();
    E('path', { d: 'M0,-6 C-9,-90 10,-180 0,-268 C-4,-298 0,-318 0,-330', fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, top);
    [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56], [0, -328, -64, 0.2], [0, -328, -116, 0.2]].forEach(([x, y, r, s], i) => {
      const el = leaf(top, s), veins = Array.from(el.firstChild.children).slice(2); tr(el, x, y, 1, r);
      if (i < 4) veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' '));
      veins.slice(i < 4 ? 1 : 0).forEach(v => v.remove());
    }); }
  const xyGlow = E('path', { d: xd(XP.slice(20)), fill: 'none', stroke: C.water, 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, plant);
  E('path', { d: xd(XP.slice(20)), fill: 'none', stroke: '#9FD8FF', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.6 }, plant);
  E('path', { d: xd(XP.slice(20)), fill: 'none', stroke: '#0D3346', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, plant);
  const NXD = 16, XGAP = 1 / (NXD - 1);
  const xyDrops = []; for (let i = 0; i < NXD; i++) xyDrops.push(drop(plant));
  // water vapour leaving the leaf (transpiration)
  const LTOP = [[0, 0], [40, -60], [150, -70], [205, 0]], topPts = []; for (let i = 0; i <= 60; i++) topPts.push(bez(LTOP[0], LTOP[1], LTOP[2], LTOP[3], i / 60));
  const halfH = x => { for (let i = 1; i < topPts.length; i++) if (topPts[i][0] >= x) { const a = topPts[i - 1], b = topPts[i]; return -lerp(a[1], b[1], (x - a[0]) / ((b[0] - a[0]) || 1)); } return 0; };
  const NW = 8;
  const wisps = [60, 132, 96, 160, 74, 146, 112, 50].map((lx, k) => {
    const wg = G(plant);
    return { k, wg, els: [E('path', { fill: 'none', stroke: '#BFE8FF', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.16 }, wg), E('path', { fill: 'none', stroke: '#E2F5FF', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, wg)], a: onL2(lx, halfH(lx) * 0.9) };
  });
  const wN = [-Math.sin(L2.r), Math.cos(L2.r)], wT = [Math.cos(L2.r), Math.sin(L2.r)];   // away from the underside; along the leaf
  // the see-through pot, its rim and the soil surface go on top, so things behind them hide
  { const pot = inK5();
    E('path', { d: 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z', fill: 'rgba(217,130,74,0.2)', stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pot);
    E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: 'rgba(227,149,94,0.3)', stroke: '#F0B48A', 'stroke-width': 3 }, pot);
    E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, pot);
    E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, pot); }
  const LEAFPT = onL2(110, 18), ROOTPT = bez(ROOTS[1][0], ROOTS[1][1], ROOTS[1][2], ROOTS[1][3], 0.8);

  /* ================= how: air, soil, and the question ================= */
  const H = G(root);
  const CAM_HOW = { x: 590, y: 500, s: 0.9 }, CAM_L = { x: 285, y: 505, s: 0.82 };
  const sp = (c, p) => [c.x + c.s * p[0], c.y + c.s * p[1]];
  const airMols = [[205, 182], [300, 205], [235, 262], [330, 285], [170, 248]].map(([x, y], i) => ({ x, y, i, g: molCO2(H, 12) }));
  const airLab = G(H);
  rich(airLab, 250, 340, [['air', C.air, 700]], { size: 36, anchor: 'middle' });
  rich(airLab, 250, 376, [['carbon dioxide', C.co2, 600]], { size: 27, anchor: 'middle' });
  const airArrow = arrow(H, 336, 266, 478, 352, { color: C.co2, width: 6, bend: -24 });
  const soilLab = G(H);
  rich(soilLab, 790, 604, [['soil', '#E2B98E', 700]], { size: 36 });
  rich(soilLab, 790, 640, [['water', C.water, 600]], { size: 27 });
  const waterArrow = arrow(H, 624, 600, 614, 356, { color: C.water, width: 6, bend: 18 });
  const LP_HOW = sp(CAM_HOW, LEAFPT), BUB = [965, 330], BR = 112;
  const bub = G(H);
  { const dx = BUB[0] - LP_HOW[0], dy = BUB[1] - LP_HOW[1], d = Math.hypot(dx, dy), al = Math.asin(BR / d), th = Math.atan2(dy, dx), tl = Math.sqrt(d * d - BR * BR);
    [th + al, th - al].forEach(a => E('line', { x1: LP_HOW[0], y1: LP_HOW[1], x2: LP_HOW[0] + tl * Math.cos(a), y2: LP_HOW[1] + tl * Math.sin(a), stroke: '#9FB8C8', 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, bub)); }
  E('circle', { cx: BUB[0], cy: BUB[1], r: BR, fill: '#0E2635', stroke: '#9FB8C8', 'stroke-width': 3 }, bub);
  E('circle', { cx: LP_HOW[0], cy: LP_HOW[1], r: 9, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, bub);
  const bubChl = G(bub); tr(bubChl, BUB[0], BUB[1] - 14); chloroplast(bubChl, 170, 90);
  const qMark = T(bub, BUB[0] + 72, BUB[1] - 50, '?', { size: 64, weight: 700, anchor: 'middle', fill: C.energy });
  T(bub, BUB[0], BUB[1] + BR + 40, 'a chloroplast', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const bubCO2 = molCO2(bub, 10), bubH2O = molH2O(bub, 12);
  const bubTk = [tick(bub, 10), tick(bub, 10)];

  /* ================= the window (zooms in on a stoma, later on a root hair) ================= */
  const callG = G(root);
  const callPoly = E('path', { fill: 'rgba(159,216,255,0.05)' }, callG);
  const callL = [0, 1].map(() => E('line', { stroke: '#9FB8C8', 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, callG));
  const callDot = E('circle', { r: 9, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, callG);
  const WIN = { x: 600, y: 125, w: 560, h: 565 };
  const winG = G(root);
  const wc = E('clipPath', { id: 'phSupplyWin' }, defs());
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, rx: 26 }, wc);
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, rx: 26, fill: '#0B202C' }, winG);
  const winIn = G(winG); winIn.setAttribute('clip-path', 'url(#phSupplyWin)');
  const stomaView = G(winIn), rootView = G(winIn);
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, rx: 26, fill: 'none', stroke: '#9FB8C8', 'stroke-width': 3 }, winG);
  const winLab = G(winG);

  /* ----- stoma view: the shared cross-section, zoomed ----- */
  const ZS = 2.3, STO = [820, 455];
  const TX = STO[0] - ZS * 190, TY = STO[1] - ZS * 162;
  E('rect', { x: WIN.x, y: TY + ZS * 182, width: WIN.w, height: 200, fill: C.air, opacity: 0.05 }, stomaView);
  const flowArr = E('path', { d: '', fill: C.co2, opacity: 0.16 }, stomaView);
  const outArr = E('path', { d: '', fill: C.oxygen, opacity: 0.18 }, stomaView);
  const secW = G(stomaView); secW.setAttribute('transform', `translate(${TX.toFixed(1)} ${TY.toFixed(1)}) scale(${ZS})`);
  const sec = leafSection(secW, { open: 0.75, x0: 88, x1: 348 });
  [sec.L.pal, sec.L.epi, sec.L.cut, sec.L.vein].forEach(l => l.remove());   // not in view
  sec.air(0.2);
  { const SX = sec.SX, up = (x, y0, y1, w, hw) => `M${x - w},${y0} L${x - w},${y1 + hw * 1.1} L${x - hw},${y1 + hw * 1.1} L${x},${y1} L${x + hw},${y1 + hw * 1.1} L${x + w},${y1 + hw * 1.1} L${x + w},${y0} Z`;
    const toW = (x, y) => [TX + ZS * x, TY + ZS * y];
    const a0 = toW(SX, 262), a1 = toW(SX, 86);
    flowArr.setAttribute('d', up(a0[0], a0[1], a1[1], 17, 36));
    const b0 = toW(SX, 86), b1 = toW(SX, 262);
    outArr.setAttribute('d', `M${b0[0] - 17},${b0[1]} L${b0[0] - 17},${b1[1] - 40} L${b0[0] - 36},${b1[1] - 40} L${b0[0]},${b1[1]} L${b0[0] + 36},${b1[1] - 40} L${b0[0] + 17},${b1[1] - 40} L${b0[0] + 17},${b0[1]} Z`); }
  const mols = G(secW);
  const visCells = sec.spo.filter(c => c.vis && c.y > 8 && c.y - c.ry < 146 && c.x > 96 && c.x < 340);
  const cellGlow = visCells.map(c => E('ellipse', { cx: c.x, cy: c.y, rx: c.rx * 1.25, ry: c.ry * 1.25, fill: glow(C.chloro) }, mols));
  const R = 4.6, SX = sec.SX;
  // the crowd outside the leaf
  const cr = rng(303), crowd = [];
  for (let k = 0; k < 300 && crowd.length < 15; k++) {
    const x = 104 + cr() * 228, y = 196 + cr() * 40;
    if (crowd.some(c => Math.hypot((c.x - x) * 0.7, c.y - y) < 17)) continue;
    crowd.push({ x, y, ph: cr() * TAU, a: cr() * 180, g: co2Lite(mols, R) });
  }
  // chloroplasts that will use the carbon dioxide, and routes to them through the air spaces
  const CH0 = [SX, 112];
  const targets = [];
  visCells.forEach(c => c.chlAt.forEach(q => { if (q[1] > 26 && q[0] > 100 && q[0] < 336) targets.push({ c, x: q[0], y: q[1] }); }));
  targets.sort((a, b) => Math.hypot(a.x - CH0[0], a.y - CH0[1]) - Math.hypot(b.x - CH0[0], b.y - CH0[1]));
  const TG = targets.slice(0, 8).map(tg => {
    const dx = tg.x - tg.c.x, dy = tg.y - tg.c.y, L = Math.hypot(dx, dy) || 1, ox = tg.c.x + dx / L * (tg.c.r + 9), oy = tg.c.y + dy / L * (tg.c.r + 9);
    return Object.assign(tg, { route: airRoute(sec, CH0, [ox, oy]).concat([[tg.x, tg.y]]) });
  });
  // the timetable: CO2 drifts in slowly at first, then faster and faster once the leaf uses it up
  const tD = at('diffuse'), tU = at('usedup'), tR = at('roots'), tO = at('out');
  const entries = [0.1, 0.28, 0.46, 0.64, 0.82].map(f => mid('diffuse', f));
  for (let te = tU + 0.5; te < tR - 0.45;) { entries.push(te); te += lerp(1.35, 0.55, clamp((te - tU) / 6)); }
  entries.push(mid('out', 0.15), mid('out', 0.55));
  const inFree = (x, y, m) => !sec.spo.some(c => ((x - c.x) / (c.rx + m)) ** 2 + ((y - c.y) / (c.ry + m)) ** 2 < 1);
  const PARK = []; { const r = rng(91); for (let k = 0; k < 900 && PARK.length < 7; k++) { const x = 112 + r() * 212, y = 60 + r() * 76; if (inFree(x, y, 10) && PARK.every(q => Math.hypot(q[0] - x, q[1] - y) > 40)) PARK.push([x, y]); } }
  const parkRoute = PARK.map(p => airRoute(sec, CH0, p));
  const tgRouteRev = p => airRoute(sec, p, CH0);
  const tgRoute = (from, tg) => { const dx = tg.x - tg.c.x, dy = tg.y - tg.c.y, L = Math.hypot(dx, dy) || 1; return airRoute(sec, from, [tg.c.x + dx / L * (tg.c.r + 9), tg.c.y + dy / L * (tg.c.r + 9)]).concat([[tg.x, tg.y]]); };
  const fr = rng(55);
  let parked = 0, used = 0;
  const flows = entries.map((e, k) => {
    const sx = 112 + fr() * 216, jx = (fr() - 0.5) * 10, before = e < tU;
    const tg = TG[(k * 3 + 1) % TG.length];
    const legs = [[e - 1.9, e - 0.3, [[sx, 270], [lerp(sx, SX, 0.6), 226], [SX + jx, 198]]], [e - 0.3, e + 0.35, [[SX + jx, 198], [SX + jx * 0.5, 162], [SX + jx * 0.3, 126]]]];
    let cons;
    let done;
    if (before) {
      const pi = parked++ % PARK.length;
      legs.push([e + 0.35, e + 0.6, [[SX + jx * 0.3, 126], CH0]], [e + 0.6, e + 1.8, parkRoute[pi]]);
      cons = tU + 0.3 + used * 0.5;
      legs.push([cons, cons + 1.4, tgRoute(PARK[pi], tg)]);
      done = cons + 1.4;
    } else {
      cons = e + 0.4;
      legs.push([cons, cons + 0.3, [[SX + jx * 0.3, 126], CH0]], [cons + 0.3, cons + 1.55, tg.route]);
      done = cons + 1.55;
    }
    used++;
    return { e, legs, tg, done, g: co2Lite(mols, R), hex: used % 3 === 0 ? molGlucose(mols, 6.5) : null, hexAt: [tg.x + 8, tg.y - 6] };
  });
  // two were already inside, wandering in the air space
  const inside = [PARK[5] || [168, 104], PARK[6] || [216, 122]].map((p, i) => ({ p, g: co2Lite(mols, R), tg: TG[(i * 5 + 2) % TG.length], t0: tU + 0.05 + i * 0.6 }));
  inside.forEach(o => { o.legs = [[o.t0, o.t0 + 1.5, tgRoute(o.p, o.tg)]]; });
  // a flash where each one is used: a few shared circles, since only one or two flash at a time
  const FL = flows.map(f => [f.done, f.tg.x, f.tg.y]).concat(inside.map(o => [o.legs[0][1], o.tg.x, o.tg.y])).sort((a, b) => a[0] - b[0]);
  const flashPool = [0, 1, 2].map(() => E('circle', { r: 14, fill: glow('#EFFFD9') }, mols));
  // oxygen diffusing out at the end
  const o2s = [0, 1, 2, 3].map(k => { const jx = (k % 2 ? 1 : -1) * (4 + k * 3), st = PARK[k % PARK.length]; return { k, g: o2Lite(mols, R * 1.05), path: tgRouteRev(st).concat([[SX + jx * 0.3, 128], [SX + jx * 0.2, 162], [SX + jx, 204], [SX + jx * 6, 272]]) }; });
  // concentration bar and labels
  const barG = G(stomaView);
  E('rect', { x: 1112, y: 150, width: 24, height: 520, rx: 12, fill: linGrad('rgba(185,201,216,0.04)', 'rgba(185,201,216,0.85)', true), stroke: '#5C7C8E', 'stroke-width': 2 }, barG);
  E('path', { d: 'M1124,134 L1112,152 L1136,152 Z', fill: '#B9C9D8' }, barG);
  const chOut = pill(winLab, [['outside: ', C.ink], ['more', C.co2], [' concentrated', C.ink]], { size: 28 }); tr(chOut, 850, 655);
  const chIn = pill(winLab, [['inside: ', C.ink], ['less', C.co2], [' concentrated', C.ink]], { size: 28 }); tr(chIn, 850, 165);
  const chUsed = pill(winLab, [['used up', C.plant], [' → faster diffusion', C.ink]], { size: 28, stroke: C.plant }); tr(chUsed, 850, 165);
  const chNo = pill(winLab, [['no energy', C.energy], [' needed', C.ink]], { size: 30, stroke: C.energy, extra: 64 }); tr(chNo, 850, 165);
  const noSp = spark(chNo, 15, { seed: 6 }); tr(noSp, -chNo.w / 2 + 40, 0);
  const noX = cross(chNo, 15); tr(noX, -chNo.w / 2 + 40, 0);
  const chO2 = pill(winLab, [['oxygen', '#FF9A8F'], [' diffuses out', C.ink]], { size: 28, stroke: C.oxygen }); tr(chO2, 850, 655);
  const difLab = pill(winLab, [['diffusion', C.co2]], { size: 28, fill: 'rgba(11,32,44,0.92)' }); tr(difLab, 985, 372);

  /* ----- root view: a root hair cell in the soil ----- */
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, fill: linGrad('#4C3524', '#2C1F15', true) }, rootView);
  const HAIR = [[812, 232], [846, 420], [1012, 566]];
  const hairAt = u => [(1 - u) * (1 - u) * HAIR[0][0] + 2 * (1 - u) * u * HAIR[1][0] + u * u * HAIR[2][0], (1 - u) * (1 - u) * HAIR[0][1] + 2 * (1 - u) * u * HAIR[1][1] + u * u * HAIR[2][1]];
  { const pr = rng(64), parts = [], dd = ['', ''];
    for (let k = 0; k < 600 && parts.length < 17; k++) {
      const x = 610 + pr() * 545, y = 268 + pr() * 420, r = 22 + pr() * 22;
      let near = false; for (let i = 0; i <= 20; i++) { const h = hairAt(i / 20); if (Math.hypot(h[0] - x, h[1] - y) < r + 26) { near = true; break; } }
      if (near || parts.some(p => Math.hypot(p[0] - x, p[1] - y) < p[2] + r + 16)) continue;
      parts.push([x, y, r]);
      dd[pr() > 0.5 ? 0 : 1] += closedPath(blobPts(r, r * 0.8, 7, 0, 0.2, k).map(p => [p[0] + x, p[1] + y]));
    }
    ['#7A5A40', '#6B4A33'].forEach((col, i) => E('path', { d: dd[i], fill: col, stroke: '#8F6D50', 'stroke-width': 2 }, rootView)); }
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: 22, fill: '#5E4A38' }, rootView);
  for (let x = 560, i = 0; x < 1180; x += 96, i++) E('rect', { x: x + 2, y: 147, width: 92, height: 84, rx: 16, fill: i === 2 ? 'rgba(255,228,92,0.10)' : 'rgba(234,215,183,0.14)', stroke: i === 2 ? C.energy : '#EAD7B7', 'stroke-width': i === 2 ? 3.5 : 2.5 }, rootView);
  const hairD = `M${HAIR[0][0]},${HAIR[0][1] - 8} Q${HAIR[1][0]},${HAIR[1][1]} ${HAIR[2][0]},${HAIR[2][1]}`;
  E('path', { d: hairD, fill: 'none', stroke: C.energy, 'stroke-width': 30, 'stroke-linecap': 'round' }, rootView);
  E('path', { d: hairD, fill: 'none', stroke: '#3A3024', 'stroke-width': 24, 'stroke-linecap': 'round' }, rootView);
  E('rect', { x: 756, y: 149, width: 88, height: 80, rx: 14, fill: '#3A3024' }, rootView);
  E('ellipse', { cx: 790, cy: 186, rx: 18, ry: 14, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 2.5 }, rootView);
  const rDrops = [0, 1, 2, 3, 4, 5, 6].map(k => { const u = 0.25 + (k * 0.11) % 0.7, h = hairAt(u), side = k % 2 ? 1 : -1; return { u, s: [h[0] + side * (70 + (k * 23) % 50), h[1] + (k % 3 - 1) * 30], el: drop(rootView), ph: k / 7 }; });
  const rootLab = pointer(winLab, 890, 300, [['root hair cell', C.energy]], { size: 34, to: [842, 214] });
  const rootSub = rich(winLab, 890, 340, [['absorbs ', C.ink, 500], ['water', C.water, 700]], { size: 28 });

  /* ================= labels for the plant's own beats ================= */
  const L = G(root);
  const xyLab = pointer(L, 830, 300, [['xylem', C.water]], { size: 40 });
  rich(xyLab, 830, 342, [['long, ', C.ink, 600], ['hollow', C.water, 700], [' tubes', C.ink, 600]], { size: 30 });
  const qLift = T(L, 300, 700, '?', { size: 96, weight: 700, anchor: 'middle', fill: C.energy });
  const trLab = G(L);
  T(trLab, 990, 604, 'transpiration', { size: 48, weight: 700, anchor: 'middle', fill: C.air });
  T(trLab, 990, 650, 'evaporation pulls water up', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const vapLab = rich(L, 770, 452, [['water vapour', '#D7F1FF', 700]], { size: 30 });

  // measure every path now, so the first frame that uses one does not stall
  [XP].concat(TG.map(g => g.route), o2s.map(o => o.path), ...flows.map(f => f.legs.map(l => l[2])), ...inside.map(o => o.legs.map(l => l[2]))).forEach(pts => along(pts, 0));

  /* ================= update ================= */
  return t => {
    const tt = S.reduce ? 0 : t;
    const tH = at('how'), tN = at('noenergy'), tX = at('xylem'), tT = at('transp');

    /* ---------- camera ---------- */
    const hu = P(t, tX, end('xylem') + 0.4 - tX, linear), head = 0.5 - 0.5 * Math.cos(Math.PI * hu);
    const hp = along(XP, head);
    const camF = { x: 560 - 1.5 * hp[0], y: 420 - 1.5 * hp[1], s: 1.5 };
    let cam = camLerp(CAM_HOW, CAM_L, P(t, tD - 0.35, 0.9));
    cam = camLerp(cam, camF, P(t, tX - 0.3, 0.8));
    cam = camLerp(cam, { x: 460, y: 729, s: 1.6 }, P(t, end('xylem') + 0.25, 0.9));
    cam = camLerp(cam, CAM_L, P(t, tO - 0.65, 0.85));
    plantCam.setAttribute('transform', `translate(${cam.x.toFixed(1)} ${cam.y.toFixed(1)}) scale(${cam.s.toFixed(4)})`);

    /* ---------- the plant ---------- */
    soilDrops.forEach(o => { const pulse = win(t, mid('how', 0.74), tD, 0.4); tr(o.el, o.x + Math.sin(tt * 1.3 + o.i) * 1.5, o.y, 0.62 * (1 + 0.25 * pulse * wave(tt, 0.9, o.i * 0.14))); });
    const xg = win(t, tX - 0.1, tO - 0.4, 0.5);
    op(xyGlow, 0.28 * xg);
    let steps = 0; for (let k = 0; k < NW; k++) steps += P(t, mid('transp', 0.16 + k * 0.085) + 0.3, 0.4, ease);
    const showX = win(t, tX + 0.15, tO - 0.3, 0.3);
    xyDrops.forEach((d, i) => {
      let u = head - i * XGAP;
      if (hu >= 1) { u = 1 - i * XGAP + steps * XGAP; if (u > 1 + XGAP * 0.5) u -= NXD * XGAP; }
      if (showX <= 0 || u < -0.001) { op(d, 0); return; }
      const p = along(XP, clamp(u));
      tr(d, p[0], p[1], 0.72);
      op(d, showX * Math.min(1, (u + 0.02) * 30, (1.04 - u) * 12));
    });
    wisps.forEach(w => {
      const t0 = mid('transp', 0.16 + w.k * 0.085), u = (t - t0) / 2.1;
      if (u <= 0 || u >= 1) { op(w.wg, 0); return; }
      const d0 = 2 + easeOut(u) * 40, len = 16 + 42 * Math.min(1, u * 2.2), pts = [];
      for (let j = 0; j <= 9; j++) { const f = j / 9, s = d0 + f * len, wv = Math.sin(f * 7.5 - tt * 4 + w.k) * 6 * f, up = -14 * f * f * u; pts.push([w.a[0] + wN[0] * s + wT[0] * (wv + 8 * f * f), w.a[1] + wN[1] * s + wT[1] * wv + up]); }
      const d = openPath(pts); w.els.forEach(e => e.setAttribute('d', d));
      op(w.wg, Math.sin(Math.PI * u) * 0.95);
    });

    /* ---------- how ---------- */
    const aH = 1 - P(t, tD - 0.45, 0.35, linear);
    op(H, aH);
    if (aH > 0) {
      airMols.forEach(o => tr(o.g, o.x + Math.sin(tt * 0.6 + o.i * 2) * 10, o.y + Math.cos(tt * 0.5 + o.i) * 7, 1, (tt * 12 + o.i * 40) % 360));
      const aAir = P(t, mid('how', 0.46), 0.45, linear);
      airMols.forEach(o => op(o.g, aAir));
      op(airLab, aAir);
      airArrow.set(P(t, mid('how', 0.52), 0.6)); op(airArrow, aAir);
      const aSoil = P(t, mid('how', 0.76), 0.45, linear);
      op(soilLab, aSoil); waterArrow.set(P(t, mid('how', 0.8), 0.7)); op(waterArrow, aSoil);
      const bp = P(t, mid('how', 0.06), 0.6, pop);
      op(bub, clamp(bp * 2));
      op(qMark, clamp(bp * 2) * (1 - P(t, mid('how', 0.92), 0.4, linear)) * (0.75 + 0.25 * wave(tt, 1.2)));
      const c1 = P(t, mid('how', 0.62), 0.5, pop), c2 = P(t, mid('how', 0.9), 0.5, pop);
      tr(bubCO2, BUB[0] - 44, BUB[1] + 64, Math.max(0.01, c1)); op(bubCO2, clamp(c1 * 2));
      tr(bubH2O, BUB[0] + 44, BUB[1] + 62, Math.max(0.01, c2)); op(bubH2O, clamp(c2 * 2));
      tr(bubTk[0], BUB[0] - 44 + 34, BUB[1] + 50); op(bubTk[0], P(t, mid('how', 0.66), 0.3, linear));
      tr(bubTk[1], BUB[0] + 44 + 30, BUB[1] + 48); op(bubTk[1], P(t, mid('how', 0.94), 0.3, linear));
    }

    /* ---------- the window ---------- */
    const lpt = sp(cam, LEAFPT), rpt = sp(cam, ROOTPT);
    const open1 = P(t, tD + 0.05, 0.75, easeOut), shut = P(t, tX - 0.4, 0.5, easeIn), open2 = P(t, tO - 0.3, 0.65, easeOut);
    const toRoot = P(t, tR - 0.55, 0.6) * (1 - P(t, tO - 0.4, 0.01));
    const org = t < tO - 0.4 ? [lerp(lpt[0], rpt[0], toRoot), lerp(lpt[1], rpt[1], toRoot)] : lpt;
    const ws = t < tO - 0.3 ? open1 * (1 - shut) : open2;
    op(winG, clamp(ws * 3));
    if (ws > 0.001) winG.setAttribute('transform', `translate(${org[0].toFixed(1)} ${org[1].toFixed(1)}) scale(${Math.max(0.02, ws).toFixed(4)}) translate(${(-org[0]).toFixed(1)} ${(-org[1]).toFixed(1)})`);
    const cA = clamp((ws - 0.6) / 0.4);
    op(callG, cA);
    if (cA > 0) {
      const cpt = t < tO - 0.4 ? org : lpt;
      callPoly.setAttribute('d', `M${cpt[0].toFixed(1)},${cpt[1].toFixed(1)} L${WIN.x},${WIN.y + 18} L${WIN.x},${WIN.y + WIN.h - 18} Z`);
      callL.forEach((l, i) => { attr(l, 'x1', cpt[0]); attr(l, 'y1', cpt[1]); attr(l, 'x2', WIN.x); attr(l, 'y2', i ? WIN.y + WIN.h - 18 : WIN.y + 18); });
      attr(callDot, 'cx', cpt[0]); attr(callDot, 'cy', cpt[1]);
    }
    const vRoot = P(t, tR - 0.3, 0.3, linear) * (t < tO - 0.4 ? 1 : 0);
    op(rootView, vRoot); op(stomaView, t < tO - 0.4 ? 1 - P(t, tR - 0.62, 0.3, linear) : 1);

    if (ws > 0.001) {
      // flow arrows, labels
      op(flowArr, win(t, mid('diffuse', 0.1), tR - 0.3, 0.5));
      op(outArr, P(t, mid('out', 0.08), 0.5, linear));
      op(chOut, win(t, mid('diffuse', 0.47), tR - 0.3, 0.4) * (t < tO - 1 ? 1 : 0));
      op(chIn, win(t, mid('diffuse', 0.73), tU + 0.2, 0.4));
      op(chUsed, win(t, mid('usedup', 0.52), tN, 0.4));
      op(chNo, win(t, tN - 0.1, tR - 0.3, 0.4)); noSp.upd(tt); op(noX, P(t, mid('noenergy', 0.3), 0.3, linear));
      op(chO2, P(t, mid('out', 0.3), 0.4, linear));
      op(difLab, win(t, mid('diffuse', 0.3), tU + 0.2, 0.4));
      op(barG, win(t, mid('diffuse', 0.5), tR - 0.3, 0.5));
      const glowA = P(t, mid('usedup', 0.5), 1.2, linear) * (1 - P(t, tR - 0.6, 0.5, linear));
      cellGlow.forEach((e, i) => op(e, glowA * (0.35 + 0.25 * wave(tt, 1.6, i * 0.17))));
      // the crowd outside
      const aCr = 1 - 0.35 * P(t, tO - 0.5, 0.5, linear);
      crowd.forEach((c, i) => { tr(c.g, c.x + Math.sin(tt * 0.9 * calm + c.ph) * 7, c.y + Math.cos(tt * 1.1 * calm + c.ph * 1.3) * 4, 1, c.a + tt * 25 * calm); op(c.g, aCr); });
      // molecules drifting in, waiting, then used by a chloroplast
      flows.forEach(f => {
        const s = legsAt(f.legs, t);
        if (f.hex) { const hp2 = P(t, f.done + 0.1, 0.5, pop); op(f.hex, clamp(hp2 * 2)); tr(f.hex, f.hexAt[0], f.hexAt[1], Math.max(0.01, hp2)); }
        if (!s || t > f.done) { op(f.g, 0); return; }
        const wobble = s.wait ? [Math.sin(tt * 1.7 + f.e) * 3, Math.cos(tt * 1.3 + f.e) * 3] : [0, 0];
        tr(f.g, s.p[0] + wobble[0], s.p[1] + wobble[1], 1, s.ang === null ? (tt * 30 + f.e * 50) % 360 : s.ang);
        op(f.g, Math.min(1, (t - f.legs[0][0]) * 3, (f.done - t) * 4 + 0.2));
      });
      inside.forEach(o => {
        const s = t < o.t0 ? { p: o.p, ang: null } : legsAt(o.legs, t), done = o.legs[0][1];
        if (t > done) { op(o.g, 0); return; }
        const wob = t < o.t0 ? [Math.sin(tt * 1.5 + o.p[0]) * 3, Math.cos(tt * 1.2 + o.p[1]) * 3] : [0, 0];
        tr(o.g, s.p[0] + wob[0], s.p[1] + wob[1], 1, s.ang === null ? (tt * 30 + o.p[0]) % 360 : s.ang);
        op(o.g, P(t, tD, 0.4, linear));
      });
      flashPool.forEach(e => op(e, 0));
      FL.forEach((f, i) => { const fl = (t - f[0]) / 0.6; if (fl > 0 && fl < 1) { const e = flashPool[i % 3]; op(e, Math.sin(Math.PI * fl)); tr(e, f[1], f[2], 0.6 + 0.6 * fl); } });
      o2s.forEach(o => {      // oxygen keeps leaving, one after another, to the end
        const t0 = mid('out', 0.05) + o.k * 0.62, c = (t - t0) / 2.5;
        if (c <= 0) { op(o.g, 0); return; }
        const u = c % 1, p = along(o.path, ease(u)), p2 = along(o.path, Math.min(1, ease(u) + 0.03));
        tr(o.g, p[0], p[1], 1, Math.atan2(p2[1] - p[1], p2[0] - p[0]) * 180 / Math.PI); op(o.g, Math.min(1, u * 6, (1 - u) * 5));
      });
      sec.set(0.75);
      // the root hair soaking up water
      if (vRoot > 0) rDrops.forEach(d => {
        const u = ((t - tR + 0.3) / 2.2 + d.ph) % 1, h0 = hairAt(d.u);
        let p;
        if (u < 0.45) { const q = ease(u / 0.45); p = [lerp(d.s[0], h0[0], q), lerp(d.s[1], h0[1], q)]; }
        else { const q = (u - 0.45) / 0.55; p = hairAt(d.u * (1 - q)); if (q > 0.8) p = [lerp(p[0], 800, (q - 0.8) * 5), lerp(p[1], 190, (q - 0.8) * 5)]; }
        tr(d.el, p[0], p[1], 1.1); op(d.el, Math.min(1, u * 8, (1 - u) * 6));
      });
      op(rootLab, vRoot * P(t, mid('roots', 0.2), 0.4, linear)); op(rootSub, vRoot * P(t, mid('roots', 0.5), 0.4, linear));
    }

    /* ---------- xylem and transpiration labels ---------- */
    const aXl = win(t, mid('xylem', 0.48), tT + 0.3, 0.4);
    op(xyLab, aXl);
    if (aXl > 0) { const q = along(XP, clamp(head - 0.12)); xyLab.aim(cam.x + cam.s * q[0], cam.y + cam.s * q[1]); }
    op(qLift, win(t, tT, mid('transp', 0.3), 0.3) * (0.8 + 0.2 * wave(tt, 0.8)));
    op(vapLab, win(t, mid('transp', 0.28), tO - 0.6, 0.4));
    op(trLab, win(t, mid('transp', 0.76), tO - 0.6, 0.4));
  };
});

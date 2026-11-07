/* Chapter: Distillation and chromatography.
   Beats: salt water, "water back?" -> heat it: the zoom shows water leaving as vapour while the salt stays
   -> showpiece: the vapour runs down a Liebig condenser, condenses and drips into a clean beaker
   -> evaporation keeps the solid, distillation keeps the liquid -> a fractionating column on two mixed liquids
   -> the lower-boiling (blue) liquid comes over first -> refinery tower and liquid air
   -> chromatography: a pen spots black ink -> the strip stands in solvent -> showpiece: the dyes separate
   -> four lanes: the unknown X matches B -> the note's ink matches pen B -> felt-tip and kitchen paper at home. */
scene('distil', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- colours ---------- */
  const SALT = '#F4F7FA', SALTDK = '#9FB2C1';
  const LOW = '#5B8CFF', LOWDK = '#2F55B8', HIGH = '#FF7BAC', HIGHDK = '#B8436F';     // lower / higher boiling point
  const PAPER = '#F6F3EC', PENCIL = '#8A949C', INK = '#17171D', SOLV = '#9CD3F5';
  const DYE = { blue: '#3F7BFF', yellow: '#FFD23F', pink: '#FF4FA0', orange: '#FF8A3C', teal: '#22C3B0', purple: '#9B5CFF', green: '#2FBF6A' };
  const beat = (t, a, b) => win(t, a, b, 0.45);
  const show = (el, t, t0, d) => { const p = P(t, t0, d || 0.45, linear); op(el, p); return p; };
  const popAt = (el, t, t0, x, y, s) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p))); return p; };
  const riseAt = (el, t, t0, x, y) => { const p = P(t, t0, 0.5, easeOut); op(el, p); tr(el, x, y + (1 - p) * 18); return p; };

  /* ---------- helpers ---------- */
  // position along a polyline; f(u) for u in 0..1, f.L is its length, f.lens the segment lengths
  function pathOf(pts) {
    const lens = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); L += l; }
    const f = u => {
      let d = clamp(u) * L;
      for (let i = 0; i < lens.length; i++) { if (d <= lens[i] || i === lens.length - 1) { const k = lens[i] ? clamp(d / lens[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= lens[i]; }
      return pts[pts.length - 1];
    };
    f.L = L; f.lens = lens;
    return f;
  }
  function glassTube(parent, d, w) {
    const g = G(parent);
    E('path', { d, fill: 'none', stroke: GLASS.stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#123848', 'stroke-width': w - 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function bung(parent, x, y, w, h) {
    return E('path', { d: `M${x - w / 2},${y} L${x + w / 2},${y} L${x + w * 0.4},${y + h} L${x - w * 0.4},${y + h} Z`, fill: ball('#B0543F', '#6E2A21'), stroke: '#D27A66', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, parent);
  }
  // black tripod with a wire-gauze square; gauze top at y=0, feet at y=h
  function tripod(parent, w, h) {
    const g = G(parent);
    const legs = `M${w * 0.06},8 L${w * 0.1},${h - 6} M${-w * 0.4},8 L${-w * 0.56},${h} M${w * 0.4},8 L${w * 0.56},${h}`;
    E('path', { d: legs, fill: 'none', stroke: '#6E808E', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    E('path', { d: legs, fill: 'none', stroke: '#1B242B', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -w / 2, y: 2, width: w, height: 10, rx: 4, fill: '#1B242B', stroke: '#6E808E', 'stroke-width': 2 }, g);
    E('rect', { x: -w * 0.62, y: -6, width: w * 1.24, height: 8, rx: 2, fill: '#97A6B2', stroke: '#C9D4DC', 'stroke-width': 1.5 }, g);
    let d = ''; for (let x = -w * 0.62 + 5; x < w * 0.62 - 3; x += 9) d += `M${x.toFixed(1)},-6 l3,8 `;
    E('path', { d, stroke: '#5A6874', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* Liebig condenser along +x from (0,0) to (L,0): inner glass tube inside a pale-blue water jacket (j0..j1),
     outlet arm (top, near j0) and inlet arm (bottom, near j1). g.fill(p) fills the jacket from the inlet end;
     g.flow(t, a, p) moves the cooling-water chevrons from the inlet end towards the outlet. */
  function condenser(parent, L, o) {
    const g = G(parent), j0 = o.j0, j1 = o.j1, jw = o.jw || 28, arm = o.arm || 34, a0 = j0 + 34, a1 = j1 - 34;
    [[a0, -1], [a1, 1]].forEach(([u, k]) => {
      const d = `M${u},${k * (jw - 6)} L${u},${k * (jw + arm)}`;
      E('path', { d, stroke: GLASS.stroke, 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
      E('path', { d, stroke: '#1D5D78', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    });
    const r = 12;
    const jd = `M${j0 + r},${-jw} L${j1 - r},${-jw} Q${j1},${-jw} ${j1},${-jw + r} L${j1},${jw - r} Q${j1},${jw} ${j1 - r},${jw} L${j0 + r},${jw} Q${j0},${jw} ${j0},${jw - r} L${j0},${-jw + r} Q${j0},${-jw} ${j0 + r},${-jw} Z`;
    E('path', { d: jd, fill: GLASS.fill }, g);
    const water = E('rect', { x: j1, y: -jw, width: 0, height: 2 * jw, fill: 'rgba(76,201,240,0.34)', 'clip-path': _clipUrl(jd) }, g);
    const chev = [], nC = o.chev !== undefined ? o.chev : Math.max(3, Math.round((j1 - j0) / 72));
    for (let i = 0; i < nC; i++) for (const v of [-jw * 0.6, jw * 0.6]) chev.push({ el: E('path', { d: 'M4,-5 L-3,0 L4,5', fill: 'none', stroke: '#C9F0FF', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g), v, k: i / nC });
    E('path', { d: jd, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5 }, g);
    E('path', { d: `M0,0 L${L},0`, stroke: GLASS.stroke, 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M0,0 L${L},0`, stroke: '#123848', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${j0 + 14},${-jw + 7} L${j1 - 14},${-jw + 7}`, stroke: GLASS.shine, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    let filled = 0;
    g.fill = p => { filled = clamp(p); const w = (j1 - j0) * filled; attr(water, 'x', j1 - w); attr(water, 'width', w); };
    g.flow = (t, a) => chev.forEach(c => {
      const q = (t * 0.42 + c.k) % 1, u = lerp(j1 - 14, j0 + 14, q), wet = u >= j1 - (j1 - j0) * filled ? 1 : 0;
      tr(c.el, u, c.v); op(c.el, a * wet * Math.min(1, q * 6, (1 - q) * 6));
    });
    g.fill(0); g.flow(0, 0);
    Object.assign(g, { j0, j1, jw, a0, a1, arm });
    return g;
  }
  // shallow white porcelain evaporating basin, rim centre at (0,0); g.set(liquid 0..1, crust 0..1)
  function basin(parent, w) {
    const g = G(parent), hw = w / 2, d = w * 0.3;
    const bowl = `M${-hw},0 C${-hw},${d * 1.25} ${hw},${d * 1.25} ${hw},0 Z`;
    const clip = _clipUrl(bowl);
    E('path', { d: bowl, fill: ball('#FFFFFF', '#AFBDC8'), stroke: '#E8EEF2', 'stroke-width': 3 }, g);
    const liq = E('rect', { x: -hw, y: 0, width: w, height: d * 1.3, fill: C.water, opacity: 0.85, 'clip-path': clip }, g);
    const crust = E('path', { d: `M${-hw * 0.6},${d * 0.62} Q${-hw * 0.42},${d * 0.5} ${-hw * 0.24},${d * 0.6} Q${-hw * 0.05},${d * 0.46} ${hw * 0.16},${d * 0.58} Q${hw * 0.38},${d * 0.48} ${hw * 0.6},${d * 0.62} Q${hw * 0.3},${d * 1.05} 0,${d * 0.98} Q${-hw * 0.3},${d * 1.05} ${-hw * 0.6},${d * 0.62} Z`, fill: '#FFFFFF', stroke: '#C9D4DC', 'stroke-width': 1.5, 'clip-path': clip }, g);
    E('ellipse', { cx: 0, cy: 0, rx: hw, ry: 5, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    g.set = (lv, cr) => { lv = clamp(lv); attr(liq, 'y', d * 0.94 - d * 0.82 * lv); op(liq, lv > 0.01 ? 1 : 0); op(crust, cr); };
    g.set(0.6, 0);
    return g;
  }
  // felt-tip pen, tip at (0,0), barrel pointing up
  function pen(parent, capColor, letter) {
    const g = G(parent);
    E('path', { d: 'M-6,-20 L6,-20 L2,-3 Q0,1 -2,-3 Z', fill: INK }, g);
    E('rect', { x: -10, y: -42, width: 20, height: 24, rx: 3, fill: '#C9D4DC' }, g);
    E('rect', { x: -12, y: -172, width: 24, height: 134, rx: 9, fill: ball('#55626D', '#1E262C'), stroke: '#8FA2B0', 'stroke-width': 2 }, g);
    E('rect', { x: -14, y: -180, width: 28, height: 18, rx: 7, fill: capColor || INK, stroke: '#8FA2B0', 'stroke-width': 2 }, g);
    if (letter) T(g, 0, -96, letter, { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  function saltCube(parent, s) { return E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.2, fill: SALT, stroke: SALTDK, 'stroke-width': Math.max(1, s * 0.1) }, parent); }
  function drop(parent, r, color) { return E('path', { d: `M0,${-r * 1.55} C${r * 0.55},${-r * 0.7} ${r},${-r * 0.15} ${r},${r * 0.3} A${r},${r} 0 0 1 ${-r},${r * 0.3} C${-r},${-r * 0.15} ${-r * 0.55},${-r * 0.7} 0,${-r * 1.55} Z`, fill: color || C.water }, parent); }
  function h2o(parent, r) {
    const g = G(parent);
    [-1, 1].forEach(k => E('circle', { cx: k * r * 0.98, cy: r * 0.72, r: r * 0.62, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 1.5 }, g));
    E('circle', { r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  function o2Pair(parent, r) {
    const g = G(parent);
    [-1, 1].forEach(k => E('circle', { cx: k * r * 0.72, cy: 0, r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g));
    return g;
  }
  // many small static dots or squares as one path
  const dotsD = pts => pts.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`).join('');
  const squaresD = pts => pts.map(([x, y, h]) => `M${(x - h).toFixed(1)},${(y - h).toFixed(1)} h${2 * h} v${2 * h} h${-2 * h} Z`).join('');
  function nPair(parent, r) {
    const g = G(parent);
    [-1, 1].forEach(k => E('circle', { cx: k * r * 0.72, cy: 0, r, fill: ball('#5B8CFF', '#2F55B8'), stroke: '#2F55B8', 'stroke-width': Math.max(1.5, r * 0.08) }, g));
    return g;
  }
  // a rounded card with two centred lines, drawn around (0,0)
  function card2(parent, w, l1, l2, stroke, size) {
    const g = G(parent), sz = size || 30, h = sz * 2.9;
    card(g, -w / 2, -h / 2, w, h, { fill: C.card2, stroke: stroke || C.line, sw: 3, rx: 20 });
    T(g, 0, -sz * 0.18, l1, { size: sz, weight: 600, anchor: 'middle' });
    T(g, 0, sz * 1.02, l2, { size: sz, weight: 700, anchor: 'middle', fill: stroke || C.ink });
    return g;
  }
  function title(parent, text) { return T(parent, 60, 150, text, { size: 44, weight: 700 }); }
  function spot(parent, color, rx, ry) { return E('ellipse', { rx: rx || 12, ry: ry || 11, fill: color }, parent); }
  const scribble = (x, y, n, amp) => { let d = `M${x},${y}`; for (let i = 0; i < n; i++) d += ` q7,${(i % 2 ? amp : -amp)} 14,0`; return d; };

  /* ================= A. simple distillation ================= */
  const FX = 250, FS = 1.1, GY = 514, FY = GY - 92 * FS;          // flask centre x, scale, gauze top, flask origin y
  const rigA = G(root);
  const bun = bunsen(rigA, 0.8); tr(bun, FX, 690);
  tr(tripod(rigA, 150, 705 - GY), FX, GY);
  const fl = flask(rigA, FS, { level: 0.6, liquid: C.water });
  tr(fl, FX, FY);
  // salt specks and bubbles inside the flask (its inner coordinates, clipped to the glass)
  const flIn = fl.liquid.parentNode;
  const flCont = E('g', { 'clip-path': fl.liquid.getAttribute('clip-path') });
  flIn.insertBefore(flCont, fl.liquid.nextSibling.nextSibling);
  const sr = rng(13), specks = [];
  for (let i = 0; i < 16; i++) { const f = 0.08 + sr() * 0.84, y0 = 92 - f * 60; const hw = 17 + 59 * (y0 + 38) / 116 - 8; specks.push({ x: (sr() - 0.5) * 2 * hw, f }); }
  const speckP = E('path', { fill: SALT, stroke: SALTDK, 'stroke-width': 0.8 }, flCont);
  const bub = bubbles(flIn, -36, 40, 72, 46, { n: 6, r: 4.8, seed: 4, speed: 0.6 });
  const steam = heatWaves(rigA, { n: 3, h: 80, spacing: 15, color: '#D5ECF8', width: 4 }); tr(steam, FX, 292);
  const ttlA = title(rigA, 'Simple distillation');
  const lblSalt = labelLine(rigA, 380, 476, FX + 42, 466, 'salt water', { size: 28 });
  const qB = G(rigA);
  E('circle', { cx: -158, cy: 84, r: 7, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, qB);
  E('circle', { cx: -132, cy: 60, r: 11, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, qB);
  card(qB, -110, -46, 290, 92, { fill: C.card2, stroke: C.water, rx: 46, sw: 3 });
  tr(drop(qB, 16, C.water), -72, 8);
  T(qB, -44, 12, 'water back?', { size: 34, weight: 700 });

  /* the zoom: water molecules leave as vapour, salt particles stay in the liquid */
  const ZX = 800, ZY = 352, ZR = 180, SURF = 4;
  const zoom = G(root);
  const c1 = [FX + 18, 470], r1 = 24;
  const zdx = ZX - c1[0], zdy = ZY - c1[1], zdd = Math.hypot(zdx, zdy), zang = Math.atan2(zdy, zdx), zgam = Math.acos((r1 - ZR) / zdd);
  const tp = (c, r, a) => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  const za = tp(c1, r1, zang + zgam), zb = tp([ZX, ZY], ZR, zang + zgam), zc = tp([ZX, ZY], ZR, zang - zgam), zd = tp(c1, r1, zang - zgam);
  const zCone = G(zoom);
  E('path', { d: `M${za[0]},${za[1]} L${zb[0]},${zb[1]} L${zc[0]},${zc[1]} L${zd[0]},${zd[1]} Z`, fill: 'rgba(159,216,255,0.06)', stroke: 'rgba(207,231,245,0.45)', 'stroke-width': 2 }, zCone);
  E('circle', { cx: c1[0], cy: c1[1], r: r1, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3 }, zCone);
  const zIn = G(zoom);
  E('circle', { r: ZR, fill: '#0B2430' }, zIn);
  const zCl = G(zIn, { 'clip-path': _clipUrl(`M${-ZR},0 A${ZR},${ZR} 0 1 0 ${ZR},0 A${ZR},${ZR} 0 1 0 ${-ZR},0 Z`) });
  E('rect', { x: -ZR, y: SURF, width: 2 * ZR, height: ZR, fill: 'rgba(76,201,240,0.26)' }, zCl);
  E('path', { d: `M${-ZR},${SURF} L${ZR},${SURF}`, stroke: '#9FE3FF', 'stroke-width': 3, opacity: 0.7 }, zCl);
  const zr = rng(81), zPos = [];
  for (let tries = 0; zPos.length < 14 && tries < 2000; tries++) {
    const x = (zr() - 0.5) * 2 * (ZR - 24), y = SURF + 26 + zr() * (ZR - 104);     // keep the bottom band clear for the label
    if (Math.hypot(x, y) > ZR - 24 || zPos.some(p => Math.hypot(p[0] - x, p[1] - y) < 43)) continue;
    zPos.push([x, y]);
  }
  const zItems = zPos.map((p, i) => ({ el: i % 3 === 1 ? saltCube(zCl, 21) : h2o(zCl, 13), salt: i % 3 === 1, x: p[0], y: p[1], ph: zr() * TAU }));
  zItems.filter(o => o.salt).forEach(o => zCl.appendChild(o.el));
  const zVap = [0, 1, 2, 3].map(i => ({ el: h2o(zCl, 13), x: -96 + i * 64, ph: i / 4 }));
  E('circle', { r: ZR, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 6 }, zIn);
  const zChipV = chip(zIn, 'water vapour', { size: 26, fill: 'rgba(10,27,39,0.85)', stroke: C.water, sw: 2 }); tr(zChipV, 0, -ZR + 46);
  const zChipS = chip(zIn, 'salt stays', { size: 26, fill: 'rgba(10,27,39,0.85)', stroke: SALT, sw: 2 }); tr(zChipS, 0, ZR - 42);
  const bpW = chip(zoom, 'water boils at 100 °C', { size: 26, fill: C.card2, stroke: C.water, sw: 2 });
  const bpS = chip(zoom, 'salt boils above 1,400 °C', { size: 26, fill: C.card2, stroke: SALT, sw: 2 });

  /* the condenser assembly */
  const S0 = [290, 256], TH = Math.atan2(1, 3), CL = 600, cs = Math.cos(TH), sn = Math.sin(TH);
  const cpt = (u, v) => [S0[0] + u * cs - v * sn, S0[1] + u * sn + v * cs];
  const S1 = cpt(CL, 0);
  const asm = G(root);
  const ctrl = [S0[0] - 30 * cs, S0[1] - 30 * sn];
  glassTube(asm, `M${FX},${FY - 86 * FS} L${FX},272 Q${ctrl[0].toFixed(1)},${ctrl[1].toFixed(1)} ${S0[0]},${S0[1]}`, 16);
  bung(asm, FX, 296, 46, 26);
  const cond = condenser(asm, CL, { j0: 70, j1: 550, jw: 30, chev: 5 });
  const aIn = arrow(asm, ...cpt(516, 128), ...cpt(516, 76), { color: C.water, width: 5 });
  const aOut = arrow(asm, ...cpt(104, -76), ...cpt(104, -116), { color: C.water, width: 5 });
  const lblCond = labelLine(asm, 650, 246, ...cpt(330, -31), 'condenser', { size: 28 });
  const lblIn = T(asm, 726, 584, 'cold water in', { size: 26, weight: 600, anchor: 'end', fill: '#9FE3FF' });
  const lblOut = T(asm, 448, 204, 'water out', { size: 26, weight: 600, fill: '#9FE3FF' });
  const qb = u => { const a = [FX, 272], v = 1 - u; return [v * v * a[0] + 2 * v * u * ctrl[0] + u * u * S0[0], v * v * a[1] + 2 * v * u * ctrl[1] + u * u * S0[1]]; };
  const VP = [[FX, 400], [FX, 272], qb(0.33), qb(0.66), S0, S1];
  const vp = pathOf(VP);
  const Lpre = vp.lens.slice(0, 4).reduce((a, b) => a + b, 0);
  const uJ0 = (Lpre + 70) / vp.L, uJ1 = (Lpre + 250) / vp.L;
  const vapG = G(asm), parts = [];
  const NV = 11, TC = 2.4, TF = 0.45, CYC = TC + TF, GAP = CYC / NV;
  for (let i = 0; i < NV; i++) parts.push(E('circle', { r: 6.5, fill: '#EAF6FF', stroke: '#C9F0FF', 'stroke-width': 1.2 }, vapG));
  const mixC = (a, b, k) => { const pa = [1, 3, 5].map(j => parseInt(a.substr(j, 2), 16)), pb = [1, 3, 5].map(j => parseInt(b.substr(j, 2), 16)); return 'rgb(' + pa.map((v, j) => Math.round(lerp(v, pb[j], k))).join(',') + ')'; };
  const lblPure = labelLine(asm, 990, 646, 918, 672, 'pure water', { size: 28 });
  const tagVap = T(asm, 300, 222, 'vapour', { size: 26, weight: 700, anchor: 'middle', fill: '#EAF6FF' });
  const tagLiq = T(asm, 874, 484, 'liquid', { size: 26, weight: 700, fill: C.water });
  const BKX = 880, BKY = 620;
  const bkG = G(root);
  const bk = beaker(bkG, 150, 170, { level: 0, liquid: C.water });

  /* ================= B. evaporation keeps the solid, distillation keeps the liquid ================= */
  const Dg = G(root);
  const dL = G(Dg), dR = G(Dg);
  card(dL, 70, 130, 500, 545, { fill: C.card, stroke: C.line });
  card(dR, 630, 130, 500, 545, { fill: C.card, stroke: C.line });
  const dTL = T(dL, 320, 196, 'Evaporation', { size: 42, weight: 700, anchor: 'middle' });
  const dTR = T(dR, 880, 196, 'Distillation', { size: 42, weight: 700, anchor: 'middle' });
  const dArtL = G(dL);
  const eb = bunsen(dArtL, 0.62); tr(eb, 320, 560);
  tr(tripod(dArtL, 130, 571 - 432), 320, 432);
  const bas = basin(dArtL, 190); tr(bas, 320, 372);
  const dSteam = heatWaves(dArtL, { n: 3, h: 90, spacing: 30, color: '#CFE7F5', width: 4 }); tr(dSteam, 320, 354);
  const dKeepL = T(dL, 320, 640, 'keeps the **solid**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  const dTickL = tick(dL, 16); tr(dTickL, 440, 432);
  const dArtR = G(dR);
  const mini = condenser(dArtR, 210, { j0: 34, j1: 176, jw: 22, arm: 22, chev: 2 });
  const MTIP = [BKX - 22, 388], MS0 = [MTIP[0] - 210 * cs, MTIP[1] - 210 * sn];
  mini.setAttribute('transform', `translate(${MS0[0].toFixed(1)} ${MS0[1].toFixed(1)}) rotate(${(TH * 180 / Math.PI).toFixed(2)})`);
  mini.fill(1);
  const mDrops = [0, 1].map(() => E('circle', { r: 4.5, fill: C.water, stroke: '#C9F0FF', 'stroke-width': 1.2 }, dArtR));
  const dKeepR = T(dR, 880, 640, 'keeps the **liquid**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  const dTickR = tick(dR, 16); tr(dTickR, 990, 560);
  const BKD = [BKX, 500];
  root.appendChild(bkG);

  /* ================= C. fractional distillation ================= */
  const Fr = G(root);
  const RX = 640, RG = 514, RY = RG - 92;
  const bun2 = bunsen(Fr, 0.8); tr(bun2, RX, 690);
  tr(tripod(Fr, 150, 705 - RG), RX, RG);
  const fl2 = flask(Fr, 1, { level: 0.55, liquid: '#8C7CF2' }); tr(fl2, RX, RY);
  const fl2In = fl2.liquid.parentNode, mixG = E('g', { 'clip-path': fl2.liquid.getAttribute('clip-path') });
  fl2In.insertBefore(mixG, fl2.liquid.nextSibling.nextSibling);
  const mr = rng(29), mix = [];
  for (let i = 0; i < 10; i++) { const y = 84 - mr() * 56, hw = 17 + 59 * (y + 38) / 116 - 11; mix.push({ el: E('circle', { r: 6, fill: i % 2 ? ball(LOW, LOWDK) : ball(HIGH, HIGHDK) }, mixG), x: (mr() - 0.5) * 2 * hw, y, ph: mr() * TAU }); }
  const COLT = 150, COLB = 336, COLW = 40, SIDE = 182;
  const colG = G(Fr);
  E('rect', { x: RX - COLW / 2, y: COLT, width: COLW, height: COLB - COLT, rx: 8, fill: GLASS.fill }, colG);
  const beads = [];
  for (let row = 0; row < 9; row++) for (let k = 0; k < 2; k++) beads.push([RX - 8 + k * 16 + (row % 2 ? 4 : -4), COLB - 18 - row * 15.5, 6.5]);
  E('path', { d: dotsD(beads), fill: 'rgba(207,231,245,0.14)', stroke: 'rgba(207,231,245,0.55)', 'stroke-width': 1.5 }, colG);
  E('rect', { x: RX - COLW / 2, y: COLT, width: COLW, height: COLB - COLT, rx: 8, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4 }, colG);
  const F0 = [RX + COLW / 2 - 2, SIDE], TH2 = Math.PI / 6, CL2 = 440;
  const F1 = [F0[0] + CL2 * Math.cos(TH2), F0[1] + CL2 * Math.sin(TH2)];
  const cond2 = condenser(Fr, CL2, { j0: 60, j1: 400, jw: 26, arm: 26, chev: 0 });
  cond2.setAttribute('transform', `translate(${F0[0]} ${F0[1]}) rotate(30)`);
  cond2.fill(1);
  bung(Fr, RX, 316, 46, 26);
  bung(Fr, RX, COLT - 12, 42, 20);
  const thG = G(Fr); const th2 = thermometer(thG, 120, C.bad); tr(thG, RX, SIDE - 6, 0.6);
  const blockG = G(Fr);
  E('rect', { x: 990, y: 596, width: 144, height: 110, rx: 8, fill: linGrad('#7A5A44', '#523A2A', true), stroke: '#A07A5E', 'stroke-width': 3 }, blockG);
  const bk2 = beaker(Fr, 130, 150, { level: 0, liquid: LOW }); tr(bk2, 1062, 521);
  const frTtlG = G(root), frTtl = title(frTtlG, 'Fractional distillation');
  const legend = G(Fr);
  [[LOW, LOWDK, 'lower boiling point', 230], [HIGH, HIGHDK, 'higher boiling point', 284]].forEach(([c, dk, txt, y]) => {
    const g = G(legend);
    E('circle', { cx: 76, cy: y - 9, r: 12, fill: ball(c, dk) }, g);
    T(g, 100, y, txt, { size: 28, weight: 600 });
  });
  const lblMix = labelLine(Fr, 505, 486, 596, 482, 'mixture of liquids', { size: 28 });
  const lblCol = labelLine(Fr, 590, 392, 619, 292, 'fractionating column', { size: 28 });
  const lblTh = labelLine(Fr, 672, 116, 650, 128, 'thermometer', { size: 26 });
  const firstChip = card2(Fr, 330, 'lowest boiling point', 'comes off first', LOW, 30);
  // vapour in the column: pink only part-way, blue part-way and then right over into the condenser
  const vapF = G(Fr);
  const pinkV = [0, 1, 2, 3, 4].map(i => ({ el: E('circle', { r: 6, fill: ball(HIGH, HIGHDK) }, vapF), ph: i / 5, k: i }));
  const blueV = [0, 1, 2, 3, 4].map(i => ({ el: E('circle', { r: 6, fill: ball(LOW, LOWDK) }, vapF), ph: (i + 0.5) / 5, k: i }));
  const FP = pathOf([[RX, 450], [RX, SIDE], F0, F1]);
  const NB = 8, TB = 2.0, TBF = 0.4, CYB = TB + TBF, GB = CYB / NB;
  const blueF = []; for (let i = 0; i < NB; i++) blueF.push(E('circle', { r: 6, fill: ball(LOW, LOWDK) }, vapF));

  /* ================= D. crude oil and liquid air ================= */
  const Fu = G(root);
  const TWX = 300, TWT = 180, TWB = 650, TWW = 130;
  const tower = G(Fu);
  const fracs = [{ name: 'petrol', y: 268, c: '#FFE38A' }, { name: 'jet fuel', y: 388, c: '#F2B84B' }, { name: 'diesel', y: 508, c: '#D9822B' }];
  fracs.forEach(f => {
    E('path', { d: `M${TWX + TWW / 2 - 4},${f.y} L${TWX + TWW / 2 + 64},${f.y}`, stroke: '#9DB0BF', 'stroke-width': 16, 'stroke-linecap': 'round' }, tower);
    E('path', { d: `M${TWX + TWW / 2 - 4},${f.y} L${TWX + TWW / 2 + 64},${f.y}`, stroke: f.c, 'stroke-width': 8, 'stroke-linecap': 'round' }, tower);
  });
  E('path', { d: `M84,600 L${TWX - TWW / 2 + 4},600`, stroke: '#9DB0BF', 'stroke-width': 16, 'stroke-linecap': 'round' }, tower);
  E('path', { d: `M84,600 L${TWX - TWW / 2 + 4},600`, stroke: '#3A2A1E', 'stroke-width': 8, 'stroke-linecap': 'round' }, tower);
  E('rect', { x: TWX - TWW / 2, y: TWT, width: TWW, height: TWB - TWT, rx: 50, fill: linGrad('#4E6E86', '#9E5536', true), stroke: '#C9D6DE', 'stroke-width': 4 }, tower);
  let trays = ''; for (let i = 0; i < 8; i++) { const y = TWT + 66 + i * 54; trays += `M${TWX - TWW / 2 + 12},${y} L${TWX + TWW / 2 - 12},${y}`; }
  E('path', { d: trays, stroke: 'rgba(230,240,248,0.32)', 'stroke-width': 3, 'stroke-dasharray': '10 7' }, tower);
  const fuTtl = T(Fu, 84, 566, 'crude oil', { size: 30, weight: 700, fill: '#E6C8A8' });
  const crudeArrow = arrow(Fu, 150, 600, 222, 600, { color: '#E6C8A8', width: 5 });
  const cool = T(Fu, 222, 220, 'cooler', { size: 24, weight: 600, anchor: 'end', fill: '#9FC8E8' });
  const hot = T(Fu, 222, 650, 'hotter', { size: 24, weight: 600, anchor: 'end', fill: '#FFB08A' });
  const fChips = fracs.map(f => { const c = chip(Fu, f.name, { size: 30, fill: f.c, color: '#2A1A08' }); f.cx = TWX + TWW / 2 + 84 + c.w / 2; return c; });
  const fBlobs = [];
  for (let i = 0; i < 6; i++) fBlobs.push({ el: E('circle', { r: 9, fill: fracs[i % 3].c, stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 1.5 }, Fu), f: fracs[i % 3], ph: (i * 0.37) % 1, dx: ((i * 7) % 5 - 2) * 14 });
  const LA = G(Fu);
  const laFl = flask(LA, 0.9, { level: 0.5, liquid: '#CFEFFF' }); tr(laFl, 790, 468);
  const laIn = laFl.liquid.parentNode, laG = E('g', { 'clip-path': laFl.liquid.getAttribute('clip-path') });
  laIn.insertBefore(laG, laFl.liquid.nextSibling.nextSibling);
  const laMol = [[-38, 62, 'N'], [8, 72, 'N'], [44, 56, 'O'], [-14, 40, 'N'], [26, 34, 'N'], [-50, 84, 'O']].map(([x, y, k]) => { const g = k === 'N' ? nPair(laG, 9) : o2Pair(laG, 9); tr(g, x, y); return { g, x, y }; });
  const fog = heatWaves(LA, { n: 3, h: 70, spacing: 16, color: '#E6F6FF', width: 4 }); tr(fog, 790, 378);
  const laLbl = T(LA, 790, 604, 'liquid air', { size: 30, weight: 700, anchor: 'middle', fill: '#CFEFFF' });
  const arN = arrow(LA, 868, 432, 948, 372, { color: C.muted, width: 5 }), arO = arrow(LA, 868, 498, 948, 558, { color: C.muted, width: 5 });
  const chN = chip(LA, 'nitrogen', { size: 30, fill: '#17305C', stroke: LOW, color: '#BFD3FF', sw: 3 });
  const chO = chip(LA, 'oxygen', { size: 30, fill: '#4A1E1A', stroke: C.oxygen, color: '#FFC4BC', sw: 3 });

  /* ================= E. chromatography: strip, solvent, separation ================= */
  const Cg = G(root);
  const STX = 560, STW = 90, STT = 336, STB = 680, SLY = 630;
  const ttlC = title(Cg, 'Chromatography');
  const stG = G(Cg);
  E('rect', { x: STX - STW / 2, y: STT, width: STW, height: STB - STT, rx: 3, fill: PAPER, stroke: '#D8D2C4', 'stroke-width': 2 }, stG);
  const wet = E('rect', { x: STX - STW / 2 + 1, y: STB, width: STW - 2, height: 0, fill: 'rgba(110,170,225,0.30)' }, stG);
  E('line', { x1: STX - STW / 2 + 6, x2: STX + STW / 2 - 6, y1: SLY, y2: SLY, stroke: PENCIL, 'stroke-width': 3, 'stroke-linecap': 'round' }, stG);
  const front = E('path', { fill: 'none', stroke: '#6FA8DC', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, stG);
  const RF = [['yellow', 0.84], ['pink', 0.55], ['blue', 0.28]];
  const trails = RF.map(([c]) => E('rect', { x: STX - 9, y: SLY, width: 18, height: 0, rx: 9, fill: DYE[c], opacity: 0.22 }, stG));
  const dyes = RF.map(([c]) => spot(stG, DYE[c], 13, 11));
  const black = spot(stG, INK, 13, 12); tr(black, STX, SLY);
  const pen1 = pen(Cg, INK);
  const lblInk = labelLine(Cg, 430, 560, 548, 626, 'ink: a mixture of dyes', { size: 28 });
  const inkDots = G(lblInk);
  ['blue', 'yellow', 'pink'].forEach((c, i) => E('circle', { cx: 246 + i * 30, cy: 596, r: 10, fill: DYE[c] }, inkDots));
  const bkC = beaker(Cg, 200, 360, { level: 0.11, liquid: SOLV, opacity: 0.5 });
  const rod = G(Cg);
  E('rect', { x: 430, y: 326, width: 260, height: 12, rx: 6, fill: ball('#E9F2F7', '#8FB0C2') }, rod);
  E('rect', { x: STX - 16, y: 326, width: 32, height: 26, rx: 4, fill: '#2B3640', stroke: '#8FA2B0', 'stroke-width': 2 }, rod);
  const lblPaper = labelLine(Cg, 700, 420, STX + STW / 2 + 2, 446, 'chromatography paper', { size: 28 });
  const lblLine = labelLine(Cg, 700, 612, STX + 40, SLY, 'pencil start line', { size: 28 });
  const lblSolv = labelLine(Cg, 700, 694, 628, 682, 'solvent', { size: 28 });
  const lblAbove = labelLine(Cg, 430, 560, 546, 628, 'spot just above the liquid', { size: 28 });
  const tkAbove = tick(Cg, 14); tr(tkAbove, 96, 551);
  const FRONT0 = 662, FRONT1 = 372;
  const lblFront = labelLine(Cg, 700, 366, STX + STW / 2 + 2, FRONT1, 'solvent front', { size: 28 });
  const lblFar = labelLine(Cg, 700, 428, STX + 16, SLY - 0.84 * (SLY - FRONT1), 'very soluble: travels far', { size: 28 });
  const lblLess = labelLine(Cg, 700, 574, STX + 16, SLY - 0.28 * (SLY - FRONT1), 'sticks to the paper: moves less', { size: 28 });

  /* ================= F. identify: four lanes ================= */
  const Id = G(root);
  const IX0 = 330, IX1 = 870, ITOP = 175, IBOT = 572, ILINE = 500, ISOLV = 528, IFRONT = 205;
  const tankD = 'M310,455 L310,578 Q310,590 322,590 L878,590 Q890,590 890,578 L890,455';
  E('path', { d: tankD + ' Z', fill: GLASS.fill }, Id);
  const ipG = G(Id);
  E('rect', { x: IX0, y: ITOP, width: IX1 - IX0, height: IBOT - ITOP, rx: 4, fill: PAPER, stroke: '#D8D2C4', 'stroke-width': 2 }, ipG);
  const iWet = E('rect', { x: IX0 + 1, y: IBOT, width: IX1 - IX0 - 2, height: 0, fill: 'rgba(110,170,225,0.30)' }, ipG);
  E('line', { x1: IX0 + 14, x2: IX1 - 14, y1: ILINE, y2: ILINE, stroke: PENCIL, 'stroke-width': 3 }, ipG);
  const iFront = E('line', { x1: IX0 + 2, x2: IX1 - 2, y1: IBOT, y2: IBOT, stroke: '#6FA8DC', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, ipG);
  const LANES = [
    { id: 'X', x: 397, sp: [['yellow', 0.82], ['pink', 0.55], ['blue', 0.28]] },
    { id: 'A', x: 532, sp: [['orange', 0.64], ['teal', 0.36]] },
    { id: 'B', x: 667, sp: [['yellow', 0.82], ['pink', 0.55], ['blue', 0.28]] },
    { id: 'C', x: 802, sp: [['purple', 0.47], ['green', 0.16]] },
  ];
  const bHi = E('rect', { x: 667 - 46, y: 228, width: 92, height: 300, rx: 16, fill: 'rgba(86,214,155,0.10)', stroke: C.good, 'stroke-width': 4 }, ipG);
  const dashG = G(ipG);
  const dashes = LANES[0].sp.map(([c, rf]) => { const y = ILINE - rf * (ILINE - IFRONT); return E('line', { x1: 397 + 20, x2: 667 - 20, y1: y, y2: y, stroke: DYE[c], 'stroke-width': 3.5, 'stroke-dasharray': '9 7' }, dashG); });
  LANES.forEach(L => {
    L.black = spot(ipG, INK, 12, 11); tr(L.black, L.x, ILINE);
    L.spots = L.sp.map(([c]) => spot(ipG, DYE[c], 13, 11));
  });
  E('path', { d: `M311,${ISOLV} L889,${ISOLV} L889,578 Q889,589 878,589 L322,589 Q311,589 311,578 Z`, fill: SOLV, opacity: 0.45 }, Id);
  E('path', { d: tankD, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, Id);
  const laneLbl = G(Id);
  LANES.forEach(L => T(laneLbl, L.x, 634, L.id, { size: 34, weight: 700, anchor: 'middle' }));
  const subX = T(Id, 397, 680, 'unknown', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  const subK = G(Id);
  E('path', { d: 'M506,650 L506,656 L828,656 L828,650', fill: 'none', stroke: C.muted, 'stroke-width': 2.5 }, subK);
  T(subK, 667, 690, 'known inks', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const sameChip = chip(Id, 'level spots: the same substance', { size: 28, fill: C.card2, stroke: C.good, sw: 3 });
  const sameTick = tick(Id, 16);

  /* ================= G. forensic: the note matches pen B ================= */
  const Fo = G(root);
  const foTtl = title(Fo, 'Forensic science');
  const note = G(Fo);
  E('rect', { x: -130, y: -90, width: 260, height: 180, rx: 6, fill: '#FFF6DE', stroke: '#E5D6AE', 'stroke-width': 2 }, note);
  [[-104, -42, 14, 7], [-104, 0, 12, 8], [-104, 42, 9, 7]].forEach(([x, y, n, a]) => E('path', { d: scribble(x, y, n, a), fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, note));
  const noteLbl = T(Fo, 230, 540, 'ink from a note', { size: 28, weight: 600, anchor: 'middle' });
  const foA1 = arrow(Fo, 380, 410, 470, 410, { color: C.muted, width: 5 });
  const mc = G(Fo);
  E('rect', { x: 500, y: 270, width: 180, height: 260, rx: 6, fill: PAPER, stroke: '#D8D2C4', 'stroke-width': 2 }, mc);
  E('rect', { x: 501, y: 300, width: 178, height: 229, fill: 'rgba(110,170,225,0.22)' }, mc);
  E('line', { x1: 512, x2: 668, y1: 500, y2: 500, stroke: PENCIL, 'stroke-width': 3 }, mc);
  [['yellow', 0.82], ['pink', 0.55], ['blue', 0.28]].forEach(([c, rf]) => {
    const y = 500 - rf * 195;
    E('line', { x1: 562, x2: 618, y1: y, y2: y, stroke: DYE[c], 'stroke-width': 3, 'stroke-dasharray': '7 6' }, mc);
    [548, 632].forEach(x => E('ellipse', { cx: x, cy: y, rx: 12, ry: 10, fill: DYE[c] }, mc));
  });
  T(mc, 548, 566, 'X', { size: 30, weight: 700, anchor: 'middle' });
  T(mc, 632, 566, 'B', { size: 30, weight: 700, anchor: 'middle' });
  const foA2 = arrow(Fo, 710, 410, 790, 410, { color: C.muted, width: 5 });
  const pens = ['A', 'B', 'C'].map((k, i) => { const g = G(Fo); const glowE = i === 1 ? E('ellipse', { cx: 0, cy: -90, rx: 58, ry: 130, fill: glow(C.good) }, g) : null; pen(g, INK, k); return { g, glowE, x: 870 + i * 100 }; });
  const penTick = tick(Fo, 18);
  const matchChip = chip(Fo, 'the ink matches pen B', { size: 30, fill: C.card2, stroke: C.good, sw: 3 });

  /* ================= H. try it at home: felt-tip and kitchen paper ================= */
  const Fe = G(root);
  const feTtl = title(Fe, 'Try it at home');
  const GX = 600, GT = 344, GB2 = 660, WTOP = 612;
  const glassD = `M${GX - 104},${GT} L${GX - 84},${GB2 - 10} Q${GX - 82},${GB2} ${GX - 70},${GB2} L${GX + 70},${GB2} Q${GX + 82},${GB2} ${GX + 84},${GB2 - 10} L${GX + 104},${GT}`;
  E('path', { d: glassD + ' Z', fill: GLASS.fill }, Fe);
  const kStrip = G(Fe);
  const KW = 76, KT = 340, KB = 640, KDOT = 586;
  E('rect', { x: GX - KW / 2, y: KT, width: KW, height: KB - KT, rx: 3, fill: '#F2F0EA', stroke: '#D9D4C8', 'stroke-width': 2 }, kStrip);
  const quilt = []; for (let r = 0; r < 6; r++) for (let k = 0; k < 2; k++) quilt.push([GX - 18 + k * 36, KT + 34 + r * 46, 2.2]);
  E('path', { d: dotsD(quilt), fill: '#DCD6CA' }, kStrip);
  const kWet = E('rect', { x: GX - KW / 2 + 1, y: KB, width: KW - 2, height: 0, fill: 'rgba(110,170,225,0.30)' }, kStrip);
  const BANDS = [['blue', 0.2], ['purple', 0.4], ['pink', 0.6], ['yellow', 0.8]];
  const bands = BANDS.map(([c]) => { const g = G(kStrip); E('ellipse', { rx: 36, ry: 1, fill: DYE[c], opacity: 0.35 }, g); E('ellipse', { rx: 30, ry: 1, fill: DYE[c], opacity: 0.75 }, g); return g; });
  const kDot = spot(kStrip, INK, 12, 11); tr(kDot, GX, KDOT);
  const wallX = y => 104 - 20 * (y - GT) / (GB2 - 10 - GT) - 2.5;
  E('path', { d: `M${GX - wallX(WTOP)},${WTOP} L${GX - wallX(GB2 - 10)},${GB2 - 10} Q${GX - 81},${GB2 - 2} ${GX - 70},${GB2 - 2} L${GX + 70},${GB2 - 2} Q${GX + 81},${GB2 - 2} ${GX + wallX(GB2 - 10)},${GB2 - 10} L${GX + wallX(WTOP)},${WTOP} Z`, fill: C.water, opacity: 0.45 }, Fe);
  E('path', { d: glassD, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, Fe);
  const pencil = G(Fe);
  E('rect', { x: 452, y: 324, width: 268, height: 16, rx: 3, fill: '#F2C84B', stroke: '#B88C1E', 'stroke-width': 2 }, pencil);
  E('rect', { x: 440, y: 324, width: 16, height: 16, rx: 3, fill: '#F28BA8' }, pencil);
  E('path', { d: 'M720,324 L748,332 L720,340 Z', fill: '#E9C9A0', stroke: '#B88C1E', 'stroke-width': 2, 'stroke-linejoin': 'round' }, pencil);
  E('path', { d: 'M740,329.7 L748,332 L740,334.3 Z', fill: '#3A3A3A' }, pencil);
  E('rect', { x: GX - 22, y: 330, width: 44, height: 26, rx: 3, fill: 'rgba(230,240,248,0.55)', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 1.5 }, pencil);
  const pen2G = G(Fe); pen(pen2G, INK); tr(pen2G, 468, 666, 1, -90);
  const lblPen = T(Fe, 360, 630, 'felt-tip pen', { size: 28, weight: 600, anchor: 'middle' });
  const lblKit = labelLine(Fe, 740, 440, GX + KW / 2 + 2, 452, 'kitchen paper', { size: 28 });
  const lblWat = labelLine(Fe, 740, 664, GX + 66, 638, 'a little water', { size: 28 });
  const rainbow = card2(Fe, 340, 'one black ink', 'several colours!', C.energy, 30);

  /* ================= update ================= */
  return t => {
    const tA = at('want'), tB = at('boil'), tCo = at('condense'), tD = at('diff'), tFr = at('fractional'), tFi = at('first');
    const tFu = at('fuels'), tCh = at('chroma'), tPa = at('paper'), tTr = at('travel'), tId = at('identify'), tFo = at('forensic'), tFe = at('felt');

    /* ---- A. simple distillation rig ---- */
    const aA = beat(t, tA - 0.3, tD + 0.25);
    op(rigA, aA);
    if (aA > 0) {
      const lit = t >= tB + 0.15;
      bun.set(lit ? 'blue' : 'off'); bun.upd(t);
      const lvl = 0.6 - 0.06 * P(t, tB + 1.5, 5.5, linear) - 0.08 * P(t, tCo + 2.5, 7, linear);
      fl.set(lvl);
      speckP.setAttribute('d', squaresD(specks.map(s => [s.x, 92 - s.f * 130 * lvl + Math.sin(t * 2 + s.x) * calm, 2.3])));
      bub.upd(t, lit ? P(t, tB + 0.3, 1.2, linear) : 0);
      steam.upd(t); op(steam, 0.85 * win(t, tB + 0.9, tCo + 0.25, 0.4));
      op(ttlA, P(t, mid('want', 0.55), 0.5, linear));
      lblSalt.set(win(t, mid('want', 0.15), mid('boil', 0.16), 0.35));
      const qp = P(t, mid('want', 0.06), 0.5, pop), qo = 1 - P(t, tB + 0.1, 0.35, linear);
      op(qB, clamp(qp * 2) * qo); tr(qB, 575, 300 + (1 - clamp(qp)) * 14, 0.85 + 0.15 * qp);
    }

    /* ---- the zoom ---- */
    const zA = win(t, mid('boil', 0.16), tCo + 0.3, 0.35);
    op(zoom, zA);
    if (zA > 0) {
      const gp = P(t, mid('boil', 0.16), 0.7, easeOut);
      tr(zIn, lerp(c1[0], ZX, gp), lerp(c1[1], ZY, gp), lerp(0.14, 1, gp));
      op(zCone, P(t, mid('boil', 0.16) + 0.45, 0.4, linear));
      zItems.forEach(o => {
        const jx = Math.sin(t * 1.9 + o.ph) * 3 * calm, jy = Math.cos(t * 1.4 + o.ph) * 2.5 * calm;
        if (o.salt) tr(o.el, o.x + jx * 0.5, o.y + jy * 0.5, 1, 18);
        else tr(o.el, o.x + jx, o.y + jy, 1, 14 * Math.sin(t * 0.8 + o.ph) * calm);
      });
      zVap.forEach((v, i) => {
        const q = (t * 0.4 + v.ph) % 1;
        tr(v.el, v.x + Math.sin(q * 6 + i) * 14, SURF + 6 - q * 104, 1, q * 220 * calm);      // fades out below the top label
        op(v.el, Math.min(1, q * 7, (1 - q) * 3));
      });
      op(zChipV, P(t, mid('boil', 0.3), 0.4, linear)); op(zChipS, P(t, mid('boil', 0.8), 0.4, linear));
      riseAt(bpW, t, mid('boil', 0.5), ZX, 586); riseAt(bpS, t, mid('boil', 0.6), ZX, 642);
    }

    /* ---- condenser assembly, drops, the beaker ---- */
    const asA = Math.min(P(t, tCo - 0.05, 0.4, linear), 1 - P(t, tD - 0.1, 0.45, linear));
    op(asm, asA);
    if (asA > 0) {
      const sp = P(t, tCo, 0.7, easeOut), off = -(1 - sp) * 60;
      cond.setAttribute('transform', `translate(${(S0[0] + off * cs).toFixed(1)} ${(S0[1] + off * sn).toFixed(1)}) rotate(${(TH * 180 / Math.PI).toFixed(2)})`);
      op(cond, sp);
      const fillP = P(t, tCo + 0.5, 1.5, ease);
      cond.fill(fillP); cond.flow(t, P(t, tCo + 0.5, 0.5, linear));
      aIn.set(P(t, tCo + 0.45, 0.5)); aOut.set(P(t, tCo + 1.7, 0.5));
      op(aIn, P(t, tCo + 0.45, 0.2, linear)); op(aOut, P(t, tCo + 1.7, 0.2, linear));
      op(lblIn, P(t, tCo + 0.6, 0.4, linear)); op(lblOut, P(t, tCo + 1.9, 0.4, linear));
      lblCond.set(P(t, mid('condense', 0.1), 0.4, linear));
      lblPure.set(P(t, mid('condense', 0.8), 0.4, linear));
      op(tagVap, P(t, mid('condense', 0.32), 0.4, linear)); op(tagLiq, P(t, mid('condense', 0.5), 0.4, linear));
      const bl = 0.42 * P(t, tCo + 3.4, 9, linear), surfY = BKY + 85 - 152 * bl;
      const tF0 = tCo + 0.5;
      parts.forEach((p, i) => {
        const tt = t - tF0 - i * GAP;
        if (tt < 0) { op(p, 0); return; }
        const ph = tt % CYC;
        let x, y, vap, fade = 1;
        if (ph < TC) { [x, y] = vp(ph / TC); vap = 1 - clamp((ph / TC - uJ0) / (uJ1 - uJ0)); }
        else { const f = (ph - TC) / TF; x = S1[0] + 1; y = lerp(S1[1] + 6, surfY, f * f); vap = 0; fade = 1 - P(f, 0.85, 0.15, linear); }
        const hidden = Math.abs(x - FX) < 0.5 && y > 292 && y < 326 ? 0 : 1;
        attr(p, 'cx', x); attr(p, 'cy', y); attr(p, 'r', lerp(4.5, 6.5, vap));
        p.setAttribute('fill', mixC(C.water, '#EAF6FF', vap)); p.setAttribute('stroke-opacity', (1 - vap).toFixed(2));
        op(p, lerp(1, 0.85, vap) * hidden * fade);
      });
      bk.set(bl);
    }
    const bkA = Math.min(P(t, tCo + 0.25, 0.4, linear), 1 - P(t, tFr - 0.45, 0.4, linear));
    op(bkG, bkA);
    if (bkA > 0) {
      const mv = P(t, tD - 0.1, 0.8);
      const bp = P(t, tCo + 0.25, 0.5, pop);
      tr(bkG, lerp(BKX, BKD[0], mv), lerp(BKY, BKD[1], mv), Math.max(0.01, 0.7 + 0.3 * bp));
      if (t > tD) bk.set(0.42 * P(t, tCo + 3.4, 9, linear));
    }

    /* ---- B. evaporation vs distillation ---- */
    const aD = beat(t, tD - 0.15, tFr - 0.05);
    op(Dg, aD);
    if (aD > 0) {
      const pl = P(t, tD - 0.1, 0.5, easeOut), pr = P(t, tD + 0.05, 0.5, easeOut);
      op(dL, pl); tr(dL, (1 - pl) * -30, 0); op(dR, pr); tr(dR, (1 - pr) * 30, 0);
      op(dTL, P(t, mid('diff', 0.12), 0.4, linear)); op(dTR, P(t, mid('diff', 0.55), 0.4, linear));
      eb.upd(t);
      const ev = P(t, tD + 0.2, 2.2, linear);
      bas.set(0.6 * (1 - ev), P(t, tD + 1.2, 1.2, linear));
      dSteam.upd(t); op(dSteam, 0.85 * (1 - P(t, tD + 2.6, 0.6, linear)));
      op(dKeepL, P(t, mid('diff', 0.3), 0.4, linear));
      const tl = P(t, mid('diff', 0.42), 0.4, pop); op(dTickL, clamp(tl * 2)); tr(dTickL, 446, 392, Math.max(0.01, tl));
      const mp = P(t, mid('diff', 0.45), 0.5, linear); op(mini, mp);
      mini.flow(t, mp);
      mDrops.forEach((d, i) => { const q = ((t - tD) / 0.9 + i * 0.5) % 1; attr(d, 'cx', MTIP[0] + 1); attr(d, 'cy', lerp(MTIP[1] + 6, BKD[1] + 85 - 152 * 0.42 * P(t, tCo + 3.4, 9, linear), q * q)); op(d, mp * Math.min(1, q * 8, (1 - q) * 6)); });
      op(dKeepR, P(t, mid('diff', 0.76), 0.4, linear));
      const tr2 = P(t, mid('diff', 0.86), 0.4, pop); op(dTickR, clamp(tr2 * 2)); tr(dTickR, 1002, 540, Math.max(0.01, tr2));
    }

    /* ---- C. fractional distillation ---- */
    const aF = beat(t, tFr - 0.1, tFu + 0.25);
    op(Fr, aF);
    if (aF > 0) {
      const rp = P(t, tFr - 0.1, 0.6, easeOut);
      tr(Fr, 0, (1 - rp) * 20);
      bun2.set('blue'); bun2.upd(t);
      mix.forEach(o => { attr(o.el, 'cx', o.x + Math.sin(t * 1.6 + o.ph) * 4 * calm); attr(o.el, 'cy', o.y + Math.cos(t * 1.3 + o.ph) * 3 * calm); });
      th2.set(lerp(0.12, 0.5, P(t, tFr + 1.2, 5, ease)));
      op(legend, P(t, mid('fractional', 0.42), 0.45, linear));
      lblMix.set(P(t, mid('fractional', 0.28), 0.4, linear) * (1 - P(t, tFi + 0.2, 0.4, linear)));
      lblCol.set(P(t, mid('fractional', 0.76), 0.4, linear));
      lblTh.set(P(t, mid('fractional', 0.9), 0.4, linear) * (1 - P(t, tFi + 0.2, 0.4, linear)));
      const fc = P(t, mid('first', 0.12), 0.5, pop); op(firstChip, clamp(fc * 2)); tr(firstChip, 968, 172, Math.max(0.01, 0.8 + 0.2 * fc));
      const vOn = P(t, mid('fractional', 0.45), 0.8, linear);
      const yTopP = COLB - 0.42 * (COLB - SIDE), yTopB = COLB - 0.72 * (COLB - SIDE);
      pinkV.forEach(o => {
        const q = (t * 0.32 + o.ph) % 1, h = Math.sin(q * Math.PI);
        const y = lerp(452, yTopP, h);
        attr(o.el, 'cx', RX + Math.sin(q * 11 + o.k) * 9); attr(o.el, 'cy', y);
        op(o.el, vOn * Math.min(1, h * 5) * (y > 313 && y < 345 ? 0.3 : 1));
      });
      const handOver = P(t, tFi - 0.5, 0.5, linear);
      blueV.forEach(o => {
        const q = (t * 0.34 + o.ph) % 1, h = Math.sin(q * Math.PI);
        const y = lerp(452, yTopB, h);
        attr(o.el, 'cx', RX + Math.sin(q * 11 + o.k + 2) * 9); attr(o.el, 'cy', y);
        op(o.el, vOn * (1 - handOver) * Math.min(1, h * 5) * (y > 313 && y < 345 ? 0.3 : 1));
      });
      const bl2 = 0.36 * P(t, tFi - 0.6 + CYB, 4.5, linear), surf2 = 521 + 75 - 132 * bl2;
      blueF.forEach((e, i) => {
        const tt = t - (tFi - 0.6) - i * GB;
        if (tt < 0) { op(e, 0); return; }
        const ph = tt % CYB;
        let x, y;
        if (ph < TB) { const u = ph / TB; [x, y] = FP(u); if (u < 0.36) x += Math.sin(u * 40 + i) * 8 * (1 - u / 0.36); }
        else { const f = (ph - TB) / TBF; x = F1[0] + 1; y = lerp(F1[1] + 6, surf2, f * f); }
        attr(e, 'cx', x); attr(e, 'cy', y);
        op(e, Math.min(1, tt * 3) * (Math.abs(x - RX) < 10 && y > 313 && y < 345 ? 0.3 : 1));
      });
      bk2.set(bl2);
    }

    op(frTtlG, beat(t, tFr - 0.05, tCh + 0.05));

    /* ---- D. crude oil and liquid air ---- */
    const aU = beat(t, tFu - 0.1, tCh + 0.2);
    op(Fu, aU);
    if (aU > 0) {
      const tp2 = P(t, tFu - 0.1, 0.6, easeOut);
      op(tower, tp2); tr(tower, 0, (1 - tp2) * 20);
      op(fuTtl, P(t, mid('fuels', 0.08), 0.4, linear)); crudeArrow.set(P(t, mid('fuels', 0.1), 0.5));
      op(cool, P(t, mid('fuels', 0.2), 0.4, linear)); op(hot, P(t, mid('fuels', 0.2), 0.4, linear));
      const say = { petrol: 0.3, diesel: 0.38, 'jet fuel': 0.46 };
      fracs.forEach((f, i) => { const p = P(t, mid('fuels', say[f.name]), 0.45, pop); op(fChips[i], clamp(p * 2)); tr(fChips[i], f.cx + (1 - clamp(p)) * -20, f.y); });
      const bOn = P(t, mid('fuels', 0.12), 0.6, linear);
      fBlobs.forEach((b, i) => {
        const q = (t * 0.38 + b.ph) % 1, yb = TWB - 46, up = 0.7;
        let x, y;
        if (q < up) { const u = q / up; x = TWX + b.dx * (1 - u) + Math.sin(u * 9 + i) * 6; y = lerp(yb, b.f.y, ease(u)); }
        else { const u = (q - up) / (1 - up); x = lerp(TWX, TWX + TWW / 2 + 60, u); y = b.f.y; }
        attr(b.el, 'cx', x); attr(b.el, 'cy', y);
        op(b.el, bOn * Math.min(1, q * 8, (1 - q) * 8));
      });
      const la = P(t, mid('fuels', 0.54), 0.5, easeOut);
      op(LA, la); tr(LA, (1 - la) * 30, 0);
      laMol.forEach((m, i) => tr(m.g, m.x + Math.sin(t * 1.5 + i) * 3 * calm, m.y + Math.cos(t * 1.2 + i) * 2 * calm, 1, (t * 30 * calm + i * 40) % 360));
      fog.upd(t);
      arN.set(P(t, mid('fuels', 0.7), 0.45)); arO.set(P(t, mid('fuels', 0.8), 0.45));
      popAt(chN, t, mid('fuels', 0.74), 1050, 360); popAt(chO, t, mid('fuels', 0.84), 1050, 572);
    }

    /* ---- E. chromatography ---- */
    const aC = beat(t, tCh - 0.1, tId + 0.2);
    op(Cg, aC);
    if (aC > 0) {
      op(ttlC, P(t, tCh + 0.1, 0.45, linear));
      const sp3 = P(t, tCh + 0.1, 0.5, easeOut); op(stG, sp3); tr(stG, 0, (1 - sp3) * 20);
      // pen dabs the spot
      const pin = P(t, mid('chroma', 0.08), 0.7, easeOut), pout = P(t, mid('chroma', 0.62), 0.6, easeIn);
      const dab = Math.sin(Math.PI * P(t, mid('chroma', 0.08) + 0.7, 0.4, linear)) * 6;
      tr(pen1, STX + (1 - pin) * 180 + pout * 200, SLY - (1 - pin) * 170 - pout * 190 + dab, 1, 32);
      op(pen1, Math.min(P(t, mid('chroma', 0.08), 0.3, linear), 1 - P(t, mid('chroma', 0.62) + 0.3, 0.3, linear)));
      const dot = P(t, mid('chroma', 0.08) + 0.75, 0.35, easeOut);
      lblInk.set(win(t, mid('chroma', 0.62), tPa + 0.2, 0.35));
      // the beaker of solvent rises to meet the strip
      const bp2 = P(t, mid('paper', 0.48), 0.7, easeOut);
      op(bkC, bp2); tr(bkC, STX, 520 + (1 - bp2) * 90);
      op(rod, bp2);
      lblPaper.set(win(t, mid('paper', 0.08), tTr + 0.1, 0.35));
      lblLine.set(win(t, mid('paper', 0.24), tTr + 0.1, 0.35));
      lblSolv.set(win(t, mid('paper', 0.6), tTr + 0.1, 0.35));
      const ab = win(t, mid('paper', 0.8), tTr + 0.1, 0.35); lblAbove.set(ab);
      const tk = P(t, mid('paper', 0.86), 0.4, pop); op(tkAbove, clamp(tk * 2) * ab); tr(tkAbove, 96, 551, Math.max(0.01, tk));
      // the solvent soaks up and the dyes separate
      const fp = P(t, tTr + 0.2, 5.4, easeOut), fy = lerp(FRONT0, FRONT1, fp);
      attr(wet, 'y', fy); attr(wet, 'height', Math.max(0, STB - fy)); op(wet, bp2);
      front.setAttribute('d', `M${STX - STW / 2 + 2},${fy.toFixed(1)} Q${STX - 20},${(fy - 4).toFixed(1)} ${STX},${fy.toFixed(1)} T${STX + STW / 2 - 2},${fy.toFixed(1)}`);
      op(front, fp > 0.01 ? 1 : 0);
      const run = clamp((SLY - fy) / (SLY - FRONT1));
      const sep = clamp(run / 0.2);
      tr(black, STX, SLY, Math.max(0.01, dot)); op(black, dot * (1 - sep));
      dyes.forEach((d, i) => {
        const rf = RF[i][1], y = SLY - rf * (SLY - Math.min(SLY, fy));
        tr(d, STX, y); attr(d, 'ry', 11 + 4 * run); op(d, run > 0 ? clamp(sep * 1.6) : 0);
        attr(trails[i], 'y', y); attr(trails[i], 'height', Math.max(0, SLY - y)); op(trails[i], run > 0 ? 1 : 0);
      });
      lblFront.set(P(t, mid('travel', 0.45), 0.4, linear));
      lblFar.set(P(t, mid('travel', 0.62), 0.4, linear));
      lblLess.set(P(t, mid('travel', 0.82), 0.4, linear));
    }

    /* ---- F. identify ---- */
    const aI = beat(t, tId - 0.1, tFo + 0.25);
    op(Id, aI);
    if (aI > 0) {
      const ip = P(t, tId - 0.1, 0.6, easeOut); tr(Id, 0, (1 - ip) * 20);
      op(laneLbl, P(t, mid('identify', 0.06), 0.4, linear));
      op(subX, P(t, mid('identify', 0.4), 0.4, linear)); op(subK, P(t, mid('identify', 0.46), 0.4, linear));
      const fp = P(t, mid('identify', 0.3), 2.8, easeOut), fy = lerp(ISOLV, IFRONT, fp);
      attr(iWet, 'y', fy); attr(iWet, 'height', Math.max(0, IBOT - fy));
      attr(iFront, 'y1', fy); attr(iFront, 'y2', fy); op(iFront, fp > 0.01 ? 1 : 0);
      const run = clamp((ILINE - fy) / (ILINE - IFRONT)), sep = clamp(run / 0.2);
      LANES.forEach(L => {
        op(L.black, 1 - sep);
        L.spots.forEach((s, k) => { tr(s, L.x, ILINE - L.sp[k][1] * (ILINE - Math.min(ILINE, fy))); attr(s, 'ry', 11 + 4 * run); op(s, run > 0 ? clamp(sep * 1.6) : 0); });
      });
      dashes.forEach((l, k) => { const p = P(t, mid('identify', 0.64) + k * 0.15, 0.5); attr(l, 'x2', lerp(397 + 20, 667 - 20, p)); op(l, p > 0 ? 1 : 0); });
      op(dashG, P(t, mid('identify', 0.64), 0.5, linear));
      const hi = P(t, mid('identify', 0.8), 0.5, linear); op(bHi, hi);
      const sc = P(t, mid('identify', 0.84), 0.5, pop); op(sameChip, clamp(sc * 2)); tr(sameChip, 600, 136, Math.max(0.01, 0.8 + 0.2 * sc));
      op(sameTick, clamp(sc * 2)); tr(sameTick, 600 - sameChip.w / 2 - 28, 138, Math.max(0.01, sc));
    }

    /* ---- G. forensic ---- */
    const aO = beat(t, tFo - 0.1, tFe + 0.05);
    op(Fo, aO);
    if (aO > 0) {
      op(foTtl, P(t, tFo + 0.2, 0.4, linear));
      const np = P(t, tFo, 0.5, pop); op(note, clamp(np * 2)); tr(note, 230, 410, Math.max(0.01, 0.8 + 0.2 * np), -5);
      op(noteLbl, P(t, tFo + 0.3, 0.4, linear));
      foA1.set(P(t, mid('forensic', 0.18), 0.4)); op(foA1, P(t, mid('forensic', 0.18), 0.2, linear));
      riseAt(mc, t, mid('forensic', 0.22), 0, 0);
      foA2.set(P(t, mid('forensic', 0.4), 0.4)); op(foA2, P(t, mid('forensic', 0.4), 0.2, linear));
      const hiB = P(t, mid('forensic', 0.62), 0.5, linear);
      pens.forEach((p, i) => {
        const pp = P(t, mid('forensic', 0.38) + i * 0.1, 0.5, pop);
        op(p.g, clamp(pp * 2) * (i === 1 ? 1 : 1 - 0.5 * hiB)); tr(p.g, p.x, 500 + (1 - clamp(pp)) * 20 - (i === 1 ? 16 * hiB : 0));
        if (p.glowE) op(p.glowE, hiB * 0.8);
      });
      const pt = P(t, mid('forensic', 0.66), 0.4, pop); op(penTick, clamp(pt * 2)); tr(penTick, 970, 560, Math.max(0.01, pt));
      const mcp = P(t, mid('forensic', 0.72), 0.5, pop); op(matchChip, clamp(mcp * 2)); tr(matchChip, 970, 630, Math.max(0.01, 0.8 + 0.2 * mcp));
    }

    /* ---- H. felt-tip at home ---- */
    const aH = P(t, tFe - 0.1, 0.45, linear);
    op(Fe, aH);
    if (aH > 0) {
      op(feTtl, P(t, tFe + 0.2, 0.4, linear));
      const gp = P(t, tFe - 0.1, 0.6, easeOut); tr(Fe, 0, (1 - gp) * 20);
      op(lblPen, P(t, mid('felt', 0.12), 0.4, linear));
      lblKit.set(P(t, mid('felt', 0.28), 0.4, linear));
      lblWat.set(P(t, mid('felt', 0.42), 0.4, linear));
      const wp = P(t, mid('felt', 0.46), 3.4, easeOut), wy = lerp(WTOP, KT + 40, wp);
      attr(kWet, 'y', wy); attr(kWet, 'height', Math.max(0, KB - wy));
      const run = clamp((KDOT - wy) / (KDOT - KT - 40)), sep = clamp(run / 0.18);
      op(kDot, 1 - sep);
      bands.forEach((b, i) => {
        const y = KDOT - BANDS[i][1] * (KDOT - Math.min(KDOT, wy));
        tr(b, GX, y); attr(b.firstChild, 'ry', 13 + 9 * run); attr(b.lastChild, 'ry', 8 + 6 * run);
        op(b, run > 0 ? clamp(sep * 1.5) : 0);
      });
      const rc = P(t, mid('felt', 0.8), 0.5, pop); op(rainbow, clamp(rc * 2)); tr(rainbow, 940, 300, Math.max(0.01, 0.8 + 0.2 * rc));
    }
  };
});

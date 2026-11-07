/* Chapter 6, Dispersion: splitting white light.
   Beats: a white beam, and a zoom bubble shows seven coloured threads bundled inside it -> a prism slides in and
   the beam refracts at both faces -> inside the glass each colour has its own speed (violet slowest) and the threads
   start to part -> they fan out to a screen, red bent least and violet most: the visible spectrum (showpiece) ->
   'dispersion' -> the bench steps aside for the colours in order, least to most bent -> Richard Of York Gave Battle
   In Vain -> the prism adds nothing: the fan runs back into the beam's seven threads, then out again -> a rainbow
   over the rain with the Sun low behind, and inside one raindrop: refracted in, reflected at the back, refracted out,
   back towards the watcher -> Sun behind you, rain in front. The prism's colour spread is exaggerated (light lib
   SPECTRUM indices), with the order kept; so is the raindrop's. */
scene('dispersion', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const NG = LT.nGlass, NS = SPECTRUM.length;
  // the spectrum colours as text: lighter where the pure colour is too dark to read on the stage
  const TXT = ['#FF6B6B', '#FFAD5C', '#FFE45C', '#5EE07A', '#6FA8FF', '#9A9AF5', '#BE94FF'];
  const WORDS = ['Richard', 'Of', 'York', 'Gave', 'Battle', 'In', 'Vain'];

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.75 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  const slideIn = (el, p, dx, dy) => { op(el, clamp(p * 2)); tr(el, (1 - clamp(p)) * (dx || 0), (1 - clamp(p)) * (dy === undefined ? 14 : dy)); };
  const setP = (g, p) => { if (g._p !== p) { g._p = p; g.set(p); } };
  // a ray drawn to p (0..1) at opacity a; hidden at 0, where its round cap would still paint a dot
  const drawRay = (g, p, a) => { setP(g, p); op(g, p > 0.001 ? (a === undefined ? 1 : a) : 0); };
  const pt = (a, d, k) => [a[0] + d[0] * k, a[1] + d[1] * k];
  const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
  const unit = v => { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; };
  const flashAt = (parent, p, r) => E('circle', { cx: p[0], cy: p[1], r: r || 50, fill: glow(C.energy) }, parent);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.6, linear));
  let _cid = 0;
  const clipCircle = (cx, cy, r) => { const id = 'disp-clip-' + (++_cid); const cp = E('clipPath', { id }, defs()); E('circle', { cx, cy, r }, cp); return `url(#${id})`; };
  /* dots streaming along a -> b, sp apart, with one at `phase` px from a (as in the refraction chapter) */
  function dotLine(parent, a, b, sp, o) {
    o = o || {};
    const g = G(parent), L = dist(a, b), r = o.r || 4.5;
    const d = `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`;
    const paths = [[r * 3.6, 0.25], [r * 2, 1]].map(([w, a_]) => E('path', { d, fill: 'none', stroke: o.color || '#FFFBE0', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': `0.01 ${(sp - 0.01).toFixed(2)}`, opacity: a_ }, g));
    g.upd = ph => { const off = (-(((ph % sp) + sp) % sp)).toFixed(2); paths.forEach(p => p.setAttribute('stroke-dashoffset', off)); };
    g.len = L;
    g.upd(0);
    return g;
  }
  /* a pill holding a word whose initial is in colour (the mnemonic) */
  function wordChip(parent, word, col) {
    const size = 32, h = 52, w = Math.ceil(textWidth(word, size, FD, 700) + 40), g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke: col, 'stroke-width': 2.5 }, g);
    const t = E('text', { x: 0, y: size * 0.35, 'font-size': size, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, g);
    E('tspan', { fill: col, 'font-weight': 800 }, t).textContent = word[0];
    E('tspan', {}, t).textContent = word.slice(1);
    g.w = w;
    return g;
  }

  /* ================= the prism bench: ray box, prism, screen (steps aside for the colour list) ================= */
  const DG = G(root);
  const SL0 = [231, 500], DEG0 = ltAng([514 - 231, 400 - 500]), bdir = ltDir(DEG0);     // the beam rises at 19.5°
  const boxG = G(DG), box = rayBox(boxG, { color: C.ink }); { const c = pt(SL0, bdir, -50); tr(boxG, c[0], c[1], 1, DEG0); }
  const prG = G(DG), prism = glassPrism(prG, 346).at(600, 400);                           // apex (600, 250), base y = 550
  const prLab = T(prG, 600, 506, 'prism', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const SXF = 1052;                                                                       // the screen's front face
  const toScreen = (p, q) => { const k = (SXF - p[0]) / (q[0] - p[0]); return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
  const wtr = prism.trace(SL0, DEG0, NG, 10), IN = wtr[1], WOUT = wtr[2], WEND = toScreen(wtr[2], wtr[3]);
  const COLS = SPECTRUM.map((c, k) => { const tp = prism.trace(SL0, DEG0, c.n, 10); return { c, k, out: tp[2], end: toScreen(tp[2], tp[3]) }; });
  // the screen and the spectrum that lands on it
  const scrG = G(DG);
  E('rect', { x: SXF - 30, y: 656, width: 76, height: 12, rx: 5, fill: '#7F93A3' }, scrG);
  E('rect', { x: SXF, y: 340, width: 16, height: 320, rx: 6, fill: '#E3EBF0', stroke: '#9FB3C1', 'stroke-width': 2 }, scrG);
  const ys = COLS.map(c => c.end[1]);
  const bnd = ys.map((y, k) => (k === 0 ? y - (ys[1] - ys[0]) / 2 : (ys[k - 1] + y) / 2)).concat([ys[NS - 1] + (ys[NS - 1] - ys[NS - 2]) / 2]);
  const patches = COLS.map((c, k) => {
    const g = G(scrG);
    E('rect', { x: SXF - 14, y: bnd[k] - 4, width: 44, height: bnd[k + 1] - bnd[k] + 8, rx: 8, fill: c.c.color, opacity: 0.22 }, g);
    E('rect', { x: SXF - 1, y: bnd[k], width: 18, height: bnd[k + 1] - bnd[k] + 0.5, fill: c.c.color }, g);
    return g;
  });
  const spotW = G(scrG);
  E('rect', { x: SXF - 14, y: WEND[1] - 16, width: 44, height: 32, rx: 10, fill: '#FFFFFF', opacity: 0.25 }, spotW);
  E('rect', { x: SXF - 1, y: WEND[1] - 9, width: 18, height: 18, rx: 3, fill: '#FFFFFF' }, spotW);
  // normals at the two faces
  const nIn = normalLine(DG, IN[0], IN[1], -150, 78, { back: 78 }), nOut = normalLine(DG, WOUT[0], WOUT[1], -30, 78, { back: 78 });
  // white light: in, straight on (before the prism), through, out (with colour fringes)
  const W_FAR = pt(SL0, bdir, 920);
  const wInc = rayPath(DG, [SL0, IN], { color: C.ink, width: 8 });
  const wFar = rayPath(DG, [IN, W_FAR], { color: C.ink, width: 8, at: 0.4 });
  const wIns = rayPath(DG, [IN, WOUT], { color: C.ink, width: 8, heads: false });
  const fringe = G(DG);
  { const ed = unit([WEND[0] - WOUT[0], WEND[1] - WOUT[1]]), en = [-ed[1], ed[0]];
    [[-6, 0], [6, NS - 1]].forEach(([o, k]) => { const a = pt(WOUT, en, o), b = pt(WEND, en, o); E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: SPECTRUM[k].color, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, fringe); }); }
  const wExit = rayPath(DG, [WOUT, WEND], { color: C.ink, width: 8 });
  // the seven colours: inside the glass, then fanned out to the screen
  const thr = COLS.map(c => rayPath(DG, [IN, c.out], { color: c.c.color, width: 3.5, heads: false, glow: false }));
  const fan = COLS.map((c, k) => rayPath(DG, [c.out, c.end], { color: c.c.color, width: 5, head: 15, at: 0.62, heads: k === 0 || k === NS - 1 }));
  const flIn = flashAt(DG, IN), flOut = flashAt(DG, WOUT);
  // labels on the bench
  const lbRed = T(DG, 930, 410, 'red bends least', { size: 26, weight: 700, fill: TXT[0], anchor: 'middle' });
  const lbViolet = T(DG, 800, 592, 'violet bends most', { size: 26, weight: 700, fill: TXT[6], anchor: 'middle' });
  const lbSpec = T(DG, 1040, 702, 'visible spectrum', { size: 28, weight: 700, anchor: 'middle' });

  /* ================= zoom bubble 1: white light is seven colours bundled together ================= */
  const WB = G(root);
  const WBC = [300, 255], WBR = 100, WBP = pt(SL0, bdir, 130);
  { const u = unit([WBP[0] - WBC[0], WBP[1] - WBC[1]]), a = pt(WBC, u, WBR + 3), b = pt(WBP, u, -16);
    E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, WB);
    E('circle', { cx: WBP[0], cy: WBP[1], r: 16, fill: 'none', stroke: C.muted, 'stroke-width': 3 }, WB); }
  E('circle', { cx: WBC[0], cy: WBC[1], r: WBR, fill: '#0B2230' }, WB);
  const wbIn = G(WB, { 'clip-path': clipCircle(WBC[0], WBC[1], WBR) });
  const bperp = [-bdir[1], bdir[0]];
  const wbThreads = SPECTRUM.map(c => { const a = pt(WBC, bdir, -140), b = pt(WBC, bdir, 140); return E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c.color, 'stroke-width': 7, 'stroke-linecap': 'round' }, wbIn); });
  const wbWhite = (() => { const a = pt(WBC, bdir, -140), b = pt(WBC, bdir, 140); return E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#FFFFFF', 'stroke-width': 74 }, wbIn); })();
  E('circle', { cx: WBC[0], cy: WBC[1], r: WBR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 6 }, WB);
  const chMix = chip(root, 'a mixture of all colours', { size: 30, fill: C.card2, stroke: C.ink });
  const allAlong = G(root);
  { const tk = tick(allAlong, 14); tr(tk, 196, 129); T(allAlong, 222, 140, 'there all along', { size: 28, weight: 700, fill: C.good }); }

  /* ================= zoom bubble 2: inside the glass, each colour has its own speed ================= */
  const SB = G(root);
  const SBC = [950, 222], SBR = 105, SBP = [600, 400];
  { const u = unit([SBP[0] - SBC[0], SBP[1] - SBC[1]]), a = pt(SBC, u, SBR + 3), b = pt(SBP, u, -15);
    E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, SB);
    E('circle', { cx: SBP[0], cy: SBP[1], r: 15, fill: 'none', stroke: C.muted, 'stroke-width': 3 }, SB); }
  E('circle', { cx: SBC[0], cy: SBC[1], r: SBR, fill: '#14394B' }, SB);
  const sbIn = G(SB, { 'clip-path': clipCircle(SBC[0], SBC[1], SBR) });
  const sbDots = SPECTRUM.map((c, k) => {
    const a = [SBC[0] - 130, SBC[1] + (k - 3) * 8], b = [SBC[0] + 130, SBC[1] + (k - 3) * 17];      // the threads part as they go
    E('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: c.color, 'stroke-width': 3, opacity: 0.85 }, sbIn);
    const sp = 40 - k * 3.3;                                     // exaggerated: violet's dots bunch closest, red's spread widest
    return { d: dotLine(sbIn, a, b, sp, { color: c.color, r: 4.5 }), v: sp * 1.7 };
  });
  E('circle', { cx: SBC[0], cy: SBC[1], r: SBR, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 6 }, SB);
  const sbHead = T(SB, SBC[0], 106, 'inside the glass', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const sbRed = T(SB, SBC[0] - SBR - 18, SBC[1] - 19, 'red: fastest', { size: 26, weight: 700, fill: TXT[0], anchor: 'end' });
  const sbVio = T(SB, SBC[0] - SBR - 18, SBC[1] + 39, 'violet: slowest', { size: 26, weight: 700, fill: TXT[6], anchor: 'end' });

  /* ================= the name, and the colours in order ================= */
  const titleG = G(root);
  T(titleG, 0, 0, 'dispersion', { size: 64, weight: 700, anchor: 'middle' });
  const ul = SPECTRUM.map((c, k) => E('rect', { x: -140 + k * 40, y: 18, width: 40, height: 7, fill: c.color }, titleG));
  const LD = G(root);
  const LY0 = 196, LDY = 66;
  const lLeast = T(LD, 700, 152, 'least bent', { size: 24, weight: 600, fill: C.muted });
  const lMost = T(LD, 700, 662, 'most bent', { size: 24, weight: 600, fill: C.muted });
  const rows = SPECTRUM.map((c, k) => {
    const y = LY0 + k * LDY, g = G(LD);
    const sw = E('rect', { x: 700, y: y - 21, width: 64, height: 42, rx: 10, fill: c.color }, g);
    const nm = G(g); T(nm, 786, y + 11, c.name, { size: 32, weight: 700 });
    const wc = wordChip(LD, WORDS[k], TXT[k]);
    return { g, sw, nm, wc, y, x: 930 + wc.w / 2 };
  });

  /* ================= 'the prism adds colour'? No: it separates them ================= */
  const chAdd = chip(root, 'the prism adds colour', { size: 30, fill: C.card2, stroke: C.bad });
  const adW = textWidth('the prism adds colour', 30, FD, 700);
  const adStrike = strike(chAdd, -adW / 2 - 6, -1, adW / 2 + 6);
  const adX = cross(chAdd, 14); tr(adX, chAdd.w / 2 + 30, 0);
  const chSep = chip(root, 'it just separates them', { size: 30, fill: C.card2, stroke: C.good });
  const sepTk = tick(chSep, 15); tr(sepTk, -chSep.w / 2 - 32, 2);

  /* ================= a rainbow: dispersion on a giant scale ================= */
  const RB = G(root);
  E('rect', { x: 0, y: 0, width: W, height: 610, fill: linGrad('#0E2335', '#2D4C64', true) }, RB);
  E('path', { d: 'M0,598 Q300,578 600,596 T1200,590 L1200,750 L0,750 Z', fill: '#1C4630' }, RB);
  const sunG = G(RB), theSun = sun(sunG, 40); tr(sunG, 118, 466);                // low in the sky, behind the watcher
  E('path', { d: 'M0,652 Q380,618 760,656 T1200,646 L1200,750 L0,750 Z', fill: '#163A27' }, RB);
  // rain falling from a cloud
  const rainG = G(RB), rr = rng(23), drops = [];
  for (let k = 0; k < 40; k++) drops.push({ el: E('line', { x1: 0, y1: 0, x2: -5, y2: 24, stroke: '#A9CFE2', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 }, rainG), x: 664 + rr() * 456, ph: rr(), sp: 0.8 + rr() * 0.4 });
  const cloud = G(RB);
  [[-160, 14, 48], [-92, -14, 64], [-8, -30, 76], [80, -12, 64], [154, 12, 50], [0, 18, 52]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#5A6C7B' }, cloud));
  E('rect', { x: -176, y: 10, width: 352, height: 46, rx: 23, fill: '#5A6C7B' }, cloud);
  [[-92, -24, 40], [-8, -42, 48]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#6E8090', opacity: 0.8 }, cloud));
  tr(cloud, 890, 168);
  // the bow: red outside, violet inside
  const RBC = [860, 640], RB0 = 292, RBW = 10;
  const bowGlow = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 96, opacity: 0.05 }, RB);
  const bow = SPECTRUM.map((c, k) => {
    const r = RB0 - k * RBW, s = Math.sqrt(r * r - 40 * 40);
    return E('path', { d: `M${(RBC[0] - s).toFixed(1)},600 A${r},${r} 0 0 1 ${(RBC[0] + s).toFixed(1)},600`, fill: 'none', stroke: c.color, 'stroke-width': RBW + 0.8, opacity: 0.85, pathLength: 1, 'stroke-dasharray': '1 1' }, RB);
  });
  { const r = RB0 - 3 * RBW, s = Math.sqrt(r * r - 40 * 40); bowGlow.setAttribute('d', `M${(RBC[0] - s).toFixed(1)},600 A${r},${r} 0 0 1 ${(RBC[0] + s).toFixed(1)},600`); }
  // sunlight goes out over the watcher's head into the rain, and comes back in colour
  const PX = 360, PY = 646, PS_ = 0.8, EYE = [PX + 9 * PS_, PY - 176 * PS_];
  const sunRay = rayPath(RB, [[161, 458], [700, 418]], { color: C.ink, width: 6 });
  const bowPt = (k, deg) => { const r = RB0 - k * RBW, a = deg * Math.PI / 180; return [RBC[0] + r * Math.cos(a), RBC[1] - r * Math.sin(a)]; };
  const backRays = [0, NS - 1].map(k => rayPath(RB, [bowPt(k, 124), EYE], { color: SPECTRUM[k].color, width: 5, head: 14, at: 0.5 }));
  const watcher = person(RB, { shirt: '#5B8DEF' }); tr(watcher, PX, PY, PS_);
  // inset: one raindrop
  const IS = G(RB);
  card(IS, 50, 112, 460, 280, { fill: C.card, stroke: C.line });
  T(IS, 490, 150, 'one raindrop', { size: 26, weight: 700, fill: C.muted, anchor: 'end' });
  const DC = [285, 244], DR = 80, DB = 0.861;                                              // b: the rainbow ray's impact parameter
  E('circle', { cx: DC[0], cy: DC[1], r: DR, fill: 'rgba(120,200,240,0.20)', stroke: '#BFE6F7', 'stroke-width': 3 }, IS);
  { const rs = DR - 12, a = ltPt(DC[0], DC[1], 205, rs), b = ltPt(DC[0], DC[1], 160, rs);           // shine on the drop's free left side
    E('path', { d: `M${a[0].toFixed(1)},${a[1].toFixed(1)} A${rs},${rs} 0 0 0 ${b[0].toFixed(1)},${b[1].toFixed(1)}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.4, 'stroke-linecap': 'round' }, IS); }
  const hitDrop = (p, d) => { const fx = p[0] - DC[0], fy = p[1] - DC[1], b = fx * d[0] + fy * d[1], c = fx * fx + fy * fy - DR * DR, tt = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * tt, p[1] + d[1] * tt]; };
  const DIN = [DC[0] - Math.sqrt(DR * DR - (DB * DR) ** 2), DC[1] - DB * DR];
  const dropPaths = SPECTRUM.map((c, k) => {
    const n = 1.318 + 0.008 * k;                                                          // exaggerated: real water spans about 1.331 to 1.343
    let d = unit(refractVec([1, 0], unit([DIN[0] - DC[0], DIN[1] - DC[1]]), 1, n));
    const p2 = hitDrop(DIN, d);
    d = unit(reflectVec(d, unit([p2[0] - DC[0], p2[1] - DC[1]])));
    const p3 = hitDrop(p2, d);
    const dOut = unit(refractVec(d, unit([p3[0] - DC[0], p3[1] - DC[1]]), n, 1));
    return { c, p2, p3, inside: rayPath(IS, [DIN, p2, p3], { color: c.color, width: 3, heads: false, glow: false }), out: rayPath(IS, [p3, pt(p3, dOut, 84)], { color: c.color, width: 4, head: 13, at: 0.5, heads: k === 0 || k === NS - 1, glow: false }) };
  });
  const sunIn = rayPath(IS, [[82, DIN[1]], DIN], { color: C.ink, width: 6 });
  const dFlash = [DIN, dropPaths[3].p2, dropPaths[3].p3].map(p => flashAt(IS, p, 30));
  const dLabs = [
    T(IS, 112, DIN[1] + 36, 'sunlight', { size: 26, weight: 600, fill: C.muted }),
    T(IS, DIN[0], DIN[1] - 22, 'refracts', { size: 26, weight: 700, anchor: 'middle' }),
    T(IS, dropPaths[3].p2[0] + 20, dropPaths[3].p2[1] - 4, 'reflects', { size: 26, weight: 700 }),
    T(IS, dropPaths[3].p3[0] + 26, dropPaths[3].p3[1] + 36, 'refracts', { size: 26, weight: 700 }),
    T(IS, 72, 372, 'back to you', { size: 26, weight: 700, fill: C.energy }),
  ];
  // Sun behind you, rain in front
  const arBack = arrow(RB, PX - 40, 652, 166, 652, { color: C.ink, width: 6 });
  const arFront = arrow(RB, PX + 40, 652, 640, 652, { color: C.ink, width: 6 });
  const chBehind = chip(RB, 'Sun behind you', { size: 26, fill: C.card2, stroke: C.energy });
  const chFront = chip(RB, 'rain in front', { size: 26, fill: C.card2, stroke: C.water });

  /* ================= update ================= */
  return t => {
    /* ---- the prism bench ---- */
    const aD = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, at('rainbow') - 0.1, 0.55, linear));
    op(DG, aD);
    const shr = P(t, at('order') - 0.1, 0.9) * (1 - P(t, at('notadd') - 0.1, 0.9));          // steps aside for the list
    DG.setAttribute('transform', `translate(${lerp(0, -30, shr).toFixed(1)} ${lerp(0, 190, shr).toFixed(1)}) scale(${lerp(1, 0.6, shr).toFixed(4)})`);
    const benchLab = 1 - P(t, at('order') - 0.2, 0.4, linear);
    if (aD > 0) {
      // white: the beam crosses the stage
      box.set(P(t, S.first - 0.2, 0.4, linear));
      const Linc = dist(SL0, IN), Lfar = dist(IN, W_FAR), q = P(t, S.first + 0.1, 2.0, linear) * (Linc + Lfar);
      // (the straight-on beam goes as the prism arrives, so light never seems to pass through glass unbent)
      drawRay(wInc, clamp(q / Linc)); drawRay(wFar, clamp((q - Linc) / Lfar), 1 - P(t, at('prism') - 0.3, 0.25, linear));
      // prism: it rises into place; the beam refracts at the first face, crosses, refracts at the second
      const pIn = P(t, at('prism') - 0.05, 0.8, easeOut);
      tr(prG, 0, (1 - pIn) * 70); op(prG, clamp(pIn * 1.6));
      op(prLab, P(t, mid('prism', 0.12), 0.4, linear) * benchLab);
      op(scrG, P(t, mid('prism', 0.3), 0.6, linear));
      const tA = mid('prism', 0.24), tB = mid('prism', 0.46);
      op(flIn, Math.max(pulse(t, tA - 0.25), 0.8 * pulse(t, mid('speeds', 0.62), 0.7)));
      op(flOut, Math.max(pulse(t, tB - 0.25), 0.7 * pulse(t, mid('fan', 0.0), 0.7)));
      setP(nIn, P(t, tA, 0.5)); op(nIn, P(t, tA, 0.2, linear));
      setP(nOut, P(t, tB, 0.5)); op(nOut, P(t, tB, 0.2, linear));
      const whiteOff = 1 - P(t, mid('speeds', 0.04), 0.5, linear);                              // the white beam gives way to its colours
      drawRay(wIns, P(t, tA, tB - tA, linear), whiteOff);
      drawRay(wExit, P(t, tB, 0.9, linear), whiteOff);
      op(fringe, 0.85 * P(t, mid('prism', 0.76), 0.8, linear) * whiteOff * (P(t, tB + 0.9, 0.1, linear)));
      op(spotW, P(t, tB + 0.85, 0.3, linear) * whiteOff);
      // speeds: seven threads inside the glass; fan: out to the screen; notadd: back into the beam, then out again
      const back1 = P(t, mid('notadd', 0.3), 0.55, linear), back2 = P(t, mid('notadd', 0.4), 0.5, linear);
      COLS.forEach((c, k) => {
        const th = Math.max(P(t, mid('speeds', 0.02) + k * 0.05, 0.9, linear) * (1 - back2), P(t, mid('notadd', 0.64) + k * 0.02, 0.45, linear));
        drawRay(thr[k], th);
        const fp = Math.max(P(t, mid('fan', 0.02) + k * 0.012, 1.3, linear) * (1 - back1), P(t, mid('notadd', 0.71) + k * 0.012, 0.6, linear));
        drawRay(fan[k], fp);
        op(patches[k], clamp((fp - 0.92) / 0.08));
        const lit = pulse(t, mid('order', 0.33 + k * 0.093) - 0.1, 0.7);                          // each colour glows as it is named
        fan[k].firstChild.setAttribute('opacity', (0.16 + 0.55 * lit).toFixed(3));
      });
      op(lbViolet, P(t, mid('fan', 0.14), 0.4, linear) * benchLab);
      op(lbRed, P(t, mid('fan', 0.32), 0.4, linear) * benchLab);
      op(lbSpec, P(t, mid('fan', 0.6), 0.5, linear) * benchLab);
    }

    /* ---- bubble 1 (white, and again in notadd) ---- */
    const b1 = Math.max(win(t, mid('white', 0.3), at('prism') + 0.2, 0.4), win(t, mid('notadd', 0.46), at('rainbow') - 0.1, 0.4));
    const b1p = Math.max(P(t, mid('white', 0.3), 0.5, pop), P(t, mid('notadd', 0.46), 0.5, pop));
    op(WB, b1);
    if (b1 > 0) {
      WB.setAttribute('transform', `translate(${WBC[0]} ${WBC[1]}) scale(${(0.7 + 0.3 * clamp(b1p, 0, 1.1)).toFixed(3)}) translate(${-WBC[0]} ${-WBC[1]})`);
      const sp = t > at('prism') + 1 ? 1 : P(t, mid('white', 0.52), 0.9);
      wbThreads.forEach((l, k) => { const o = (k - 3) * 10 * sp; tr(l, bperp[0] * o, bperp[1] * o); });
      op(wbWhite, t > at('prism') + 1 ? 0 : 1 - P(t, mid('white', 0.52), 0.8, linear));
    }
    popIn(chMix, P(t, mid('white', 0.64), 0.5, pop) * (1 - P(t, at('prism') - 0.05, 0.4, linear)), 650, 205);
    slideIn(allAlong, P(t, mid('notadd', 0.56), 0.5, easeOut) * (1 - P(t, at('rainbow') - 0.1, 0.4, linear)), -16, 0);

    /* ---- bubble 2 (speeds) ---- */
    const b2 = win(t, mid('speeds', 0.1), at('fan') + 0.15, 0.4);
    op(SB, b2);
    if (b2 > 0) {
      const p = P(t, mid('speeds', 0.1), 0.5, pop);
      SB.setAttribute('transform', `translate(${SBC[0]} ${SBC[1]}) scale(${(0.7 + 0.3 * clamp(p, 0, 1.1)).toFixed(3)}) translate(${-SBC[0]} ${-SBC[1]})`);
      sbDots.forEach(s => s.d.upd(t * s.v * (0.4 + 0.6 * calm)));
      op(sbHead, P(t, mid('speeds', 0.18), 0.4, linear));
      op(sbRed, P(t, mid('speeds', 0.3), 0.4, linear)); op(sbVio, P(t, mid('speeds', 0.4), 0.4, linear));
    }

    /* ---- the name, then the list ---- */
    const tName = P(t, mid('name', 0.1), 0.6, pop), tOff = 1 - P(t, at('notadd') - 0.15, 0.4, linear);
    op(titleG, clamp(tName * 2) * tOff);
    if (tName > 0) {
      const sx = lerp(600, 330, shr), sy = lerp(190, 262, shr), s = lerp(1, 0.72, shr) * (0.8 + 0.2 * clamp(tName, 0, 1.1));
      tr(titleG, sx, sy, s);
      ul.forEach((u, k) => op(u, P(t, mid('name', 0.3) + k * 0.1, 0.3, linear)));
    }
    const aL = win(t, at('order') + 0.1, at('notadd') + 0.05, 0.4);
    op(LD, aL);
    if (aL > 0) {
      op(lLeast, P(t, mid('order', 0.08), 0.4, linear)); op(lMost, P(t, mid('order', 0.2), 0.4, linear));
      rows.forEach((r, k) => {
        const lit = P(t, mid('order', 0.33 + k * 0.093), 0.35, linear);
        slideIn(r.g, P(t, at('order') + 0.15 + k * 0.05, 0.45, easeOut), 24, 0);
        r.sw.setAttribute('opacity', (0.28 + 0.72 * lit).toFixed(3));
        slideIn(r.nm, lit, -12, 0);
        popIn(r.wc, P(t, mid('richard', 0.36 + k * 0.088), 0.4, pop), r.x, r.y);
      });
    }

    /* ---- notadd ---- */
    const aN = 1 - P(t, at('rainbow') - 0.1, 0.4, linear);
    popIn(chAdd, P(t, mid('notadd', 0.06), 0.5, pop) * aN, 715, 165);
    adStrike.set(P(t, mid('notadd', 0.2), 0.45));
    op(adX, P(t, mid('notadd', 0.26), 0.3, linear));
    popIn(chSep, P(t, mid('notadd', 0.8), 0.5, pop) * aN, 640, 680);
    const tk = P(t, mid('notadd', 0.86), 0.45, pop); op(sepTk, clamp(tk * 2)); tr(sepTk, -chSep.w / 2 - 32, 2, Math.max(0.01, tk));

    /* ---- the rainbow ---- */
    const aR = P(t, at('rainbow') - 0.15, 0.6, linear);
    op(RB, aR);
    if (aR > 0) {
      theSun.upd(t * calm);
      drops.forEach(d => {
        const u = ((t * 0.55 * d.sp * (0.4 + 0.6 * calm)) + d.ph) % 1;
        tr(d.el, d.x - u * 20, 214 + u * 380);
        op(d.el, Math.min(1, u * 8, (1 - u) * 6));
      });
      bow.forEach((b, k) => b.setAttribute('stroke-dashoffset', (1 - P(t, mid('rainbow', 0.06) + k * 0.12, 1.5, ease)).toFixed(4)));
      op(bowGlow, P(t, mid('rainbow', 0.2), 1.2, linear));
      drawRay(sunRay, P(t, mid('rainbow', 0.44), 1.0, linear));
      backRays.forEach((r, k) => drawRay(r, P(t, mid('rainbow', 0.84) + k * 0.06, 0.8, linear)));
      // inset: one raindrop
      const iIn = P(t, mid('rainbow', 0.36), 0.5, easeOut) * (1 - P(t, at('behind') - 0.05, 0.45, linear));
      slideIn(IS, iIn, -24, 0);
      if (iIn > 0) {
        const s0 = mid('rainbow', 0.44), s1 = s0 + 0.8, s2 = mid('rainbow', 0.72), s3 = mid('rainbow', 0.8);
        drawRay(sunIn, P(t, s0, s1 - s0, linear));
        dropPaths.forEach((dp, k) => { drawRay(dp.inside, P(t, s1 + k * 0.03, s2 - s1, linear)); drawRay(dp.out, P(t, s3 + k * 0.02, 0.7, linear)); });
        const tBack = lerp(s1, s2, 0.5);
        op(dFlash[0], pulse(t, s1 - 0.25)); op(dFlash[1], pulse(t, tBack - 0.25)); op(dFlash[2], pulse(t, s2 + 0.05 - 0.25));
        op(dLabs[0], P(t, s0, 0.4, linear));
        op(dLabs[1], P(t, s1 - 0.1, 0.4, linear)); op(dLabs[2], P(t, tBack, 0.4, linear)); op(dLabs[3], P(t, s3, 0.4, linear));
        op(dLabs[4], P(t, s3 + 0.6, 0.4, linear));
      }
      // Sun behind you, rain in front
      const bb = P(t, mid('behind', 0.08), 0.7), bf = P(t, mid('behind', 0.48), 0.7);
      arBack.set(bb); op(arBack, bb > 0 ? 1 : 0); arFront.set(bf); op(arFront, bf > 0 ? 1 : 0);
      popIn(chBehind, P(t, mid('behind', 0.2), 0.5, pop), 240, 694);
      popIn(chFront, P(t, mid('behind', 0.6), 0.5, pop), 520, 694);
    }
  };
});

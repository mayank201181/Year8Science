/* Intro: the hidden muscle under your lungs.
   Beats: a person breathes while a counter races to 22,000 breaths a day -> the breath freezes, "?" on
   the lungs, a hidden dome of muscle pulses below them, the Moon slides in -> the title, with oxygen
   flowing in down the windpipe and carbon dioxide flowing out -> a three-step roadmap. */
scene('intro', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- shared breathing art (same in every chapter of this lesson) ---------- */
  const SKIN = '#C98E62', SKINDK = '#9C6B45', SHIRT = '#5B8DEF', SHIRTDK = '#3F6FCC', HAIR = '#2B1D14';
  const TUBE = '#E9C7D2', TUBEDK = '#C99AAA', MUSCLE = '#D24B63', MUSCLELT = '#F59AAE', BONE = '#EFE6D2';
  const O2T = '#FF9A8F';

  /* The chest, front view, drawn exactly as "How you breathe in and out" (03_mechanism) draws it, in lib lungs
     units centred on the chest: six ribs a side with intercostal muscles between them (behind the lungs), the
     lungs, and the diaphragm in front of the lung bases. g.set(d, r, gd, gi): d diaphragm flattening 0..1
     (domed -> flat and lower), r ribs up and out 0..1 (defaults to d), gd / gi how hard the diaphragm /
     intercostals are contracting (brighter red). Parts: g.cav, g.bands, g.ribs, g.lw (lungs), g.dia. */
  function chestArt(parent) {
    const BONE_ = '#EFE7D4', BONE_DK = '#8F8370', MUS = '#9C3449', MUS_ON = '#FF6A84', MUS_LT = '#F6A0B0';
    const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
    const mus = p => { const A = hx(MUS), B = hx(MUS_ON); p = clamp(p); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',') + ')'; };
    const q2 = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
    const fx = v => v.toFixed(1);
    const RIBS = [[[40, -122], [104, -142], [128, -92]], [[46, -74], [130, -100], [160, -38]], [[52, -24], [146, -50], [176, 18]],
      [[58, 26], [154, 0], [182, 72]], [[64, 76], [158, 52], [182, 124]], [[70, 124], [154, 104], [172, 170]]];
    const ribPts = (i, r, side) => {
      const [A, Q, B] = RIBS[i], ang = -(10 - i * 1.2) * r * Math.PI / 180, ca = Math.cos(ang), sa = Math.sin(ang), dx = 16 * r, dy = -(6 - i * 0.6) * r;
      const f = p => { const x = p[0] - A[0], y = p[1] - A[1]; return [A[0] + x * ca - y * sa + dx, A[1] + x * sa + y * ca + dy]; };
      const a = [A[0] + dx, A[1] + dy], q = f(Q), b = f(B);
      return side > 0 ? [a, q, b] : [[-a[0], a[1]], [-q[0], q[1]], [-b[0], b[1]]];
    };
    const DU = [-1, -0.85, -0.62, -0.34, 0, 0.34, 0.62, 0.85, 1], DRISE = [0, 22, 44, 60, 66, 60, 44, 22, 0], DFLAT = [0, 186, 187, 188, 188, 188, 187, 186, 0];
    const DTH = [14, 18, 22, 25, 26, 25, 22, 18, 14];
    const diaTop = (d, r) => { const b5 = ribPts(5, r, 1)[2], ex = b5[0] + 4, ey = b5[1] + 24; return DU.map((u, k) => [u * ex, k === 0 || k === 8 ? ey : lerp(ey - DRISE[k], DFLAT[k], d)]); };
    const bandPath = (top, th) => { const bot = top.map((p, k) => [p[0], p[1] + th[k]]).reverse(); return openPath(top) + ' L' + fx(bot[0][0]) + ',' + fx(bot[0][1]) + openPath(bot).replace(/^M[^C]*/, '') + 'Z'; };
    const cavPts = (d, r) => {
      const R = [];
      for (let i = 0; i < 6; i++) { const [a, q, b] = ribPts(i, r, 1), p = q2(a, q, b, 0.9); R.push([p[0] - 12, p[1] + 4]); }
      const top = diaTop(d, r);
      const floor = [[top[8][0] - 10, top[8][1] - 4]].concat(top.slice(1, 8).reverse().map(p => [p[0], p[1] - 2]), [[top[0][0] + 10, top[0][1] - 4]]);
      return [[-46, -138], [46, -138]].concat(R, floor, R.slice().reverse().map(p => [-p[0], p[1]]));
    };
    const g = G(parent);
    g.cav = E('path', { fill: C.air, 'fill-opacity': 0.06, stroke: C.air, 'stroke-opacity': 0.3, 'stroke-width': 2 }, g);
    g.bands = G(g); g.ribs = G(g); g.lw = G(g); g.lungs = lungs(g.lw, 1); g.dia = G(g);
    const ribEls = [], bandEls = [];
    [1, -1].forEach(side => {
      for (let i = 0; i < 5; i++) bandEls.push({ side, i, el: E('path', { stroke: '#6E2232', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g.bands), fib: E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.55, 'stroke-linecap': 'round' }, g.bands) });
      for (let i = 0; i < 6; i++) { const rg = G(g.ribs); ribEls.push({ side, i, g: rg, base: E('path', { fill: 'none', stroke: BONE_DK, 'stroke-width': 13, 'stroke-linecap': 'round' }, rg), core: E('path', { fill: 'none', stroke: BONE_, 'stroke-width': 8, 'stroke-linecap': 'round' }, rg) }); }
    });
    const dia = E('path', { stroke: '#5E1A2A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g.dia);
    const diaFib = E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round' }, g.dia);
    const diaHi = E('path', { fill: 'none', stroke: MUS_LT, 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }, g.dia);
    g.ribEls = ribEls; g.bandEls = bandEls;
    g.domeD = d => openPath(diaTop(d, 0));             // the top edge of the diaphragm, 0 domed .. 1 flat
    g.set = (d, r, gd, gi) => {
      d = clamp(d); r = r === undefined ? d : clamp(r);
      const ribs = {};
      ribEls.forEach(o => { const p = ribPts(o.i, r, o.side), dd = `M${fx(p[0][0])},${fx(p[0][1])} Q${fx(p[1][0])},${fx(p[1][1])} ${fx(p[2][0])},${fx(p[2][1])}`; ribs[o.side + ':' + o.i] = p; o.base.setAttribute('d', dd); o.core.setAttribute('d', dd); });
      const bf = mus(gi || 0);
      bandEls.forEach(o => {
        const A = ribs[o.side + ':' + o.i], B = ribs[o.side + ':' + (o.i + 1)], pa = [], pb = [];
        for (let s = 0; s <= 6; s++) { const u = 0.3 + 0.7 * s / 6; pa.push(q2(A[0], A[1], A[2], u)); pb.push(q2(B[0], B[1], B[2], u)); }
        o.el.setAttribute('d', 'M' + pa.concat(pb.reverse()).map(p => fx(p[0]) + ',' + fx(p[1])).join(' L') + 'Z'); o.el.setAttribute('fill', bf);
        let fd = ''; [0.48, 0.64, 0.8].forEach(u => { const p = q2(A[0], A[1], A[2], u + 0.03), s2 = q2(B[0], B[1], B[2], u - 0.05); fd += `M${fx(p[0])},${fx(p[1] + 5)} L${fx(s2[0])},${fx(s2[1] - 5)} `; });
        o.fib.setAttribute('d', fd);
      });
      const top = diaTop(d, r);
      dia.setAttribute('d', bandPath(top, DTH)); dia.setAttribute('fill', mus(gd || 0));
      diaHi.setAttribute('d', openPath(top.slice(1, 8).map(p => [p[0], p[1] + 4])));
      diaFib.setAttribute('d', [0.4, 0.7].map(f => openPath(top.slice(1, 8).map((p, k) => [p[0], p[1] + DTH[k + 1] * f]))).join(' '));
      g.cav.setAttribute('d', closedPath(cavPts(d, r)));
      const b = clamp(0.5 * d + 0.5 * r), kx = 1 + 0.09 * b, ky = 1 + 0.05 * b;
      g.lungs.set(b);
      const sx = (132 + 18 * r) / (20 + 112 * kx), sy = (lerp(142, 187, d) + 4 + 150) / (152 * ky + 150);
      g.lw.setAttribute('transform', `translate(0 -150) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 150)`);
    };
    g.set(0);
    return g;
  }
  /* A person from the waist up, front view, drawn round the chest (0,0) in the same units as chestArt.
     g.chest is the chest art; g.puff(p) puffs the cheeks (holding a breath). */
  function bust(parent) {
    const g = G(parent);
    for (const sg of [-1, 1]) E('path', { d: `M${sg * 196},-150 C${sg * 236},-90 ${sg * 246},40 ${sg * 244},380`, fill: 'none', stroke: SHIRTDK, 'stroke-width': 54, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-40,-206 C-96,-206 -172,-202 -202,-166 C-224,-138 -226,-80 -222,-10 L-214,380 L214,380 L222,-10 C226,-80 224,-138 202,-166 C172,-202 96,-206 40,-206 Q0,-178 -40,-206 Z', fill: SHIRT }, g);
    E('rect', { x: -34, y: -270, width: 68, height: 80, rx: 14, fill: SKIN }, g);
    E('path', { d: 'M-40,-206 Q0,-178 40,-206', fill: 'none', stroke: SHIRTDK, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    g.tube = G(g);
    E('path', { d: 'M0,-258 L0,-150', stroke: TUBE, 'stroke-width': 16, 'stroke-linecap': 'round' }, g.tube);
    for (let k = 0; k < 6; k++) E('line', { x1: -9, x2: 9, y1: -246 + k * 17, y2: -246 + k * 17, stroke: TUBEDK, 'stroke-width': 4 }, g.tube);
    g.chest = chestArt(g);
    const h = g.head = G(g);
    for (const sg of [-1, 1]) E('ellipse', { cx: sg * 78, cy: -330, rx: 14, ry: 22, fill: SKIN, stroke: SKINDK, 'stroke-width': 3 }, h);
    g.faceEl = E('ellipse', { cx: 0, cy: -335, rx: 78, ry: 86, fill: SKIN }, h);
    const puffs = [-1, 1].map(sg => E('ellipse', { cx: sg * 60, cy: -300, rx: 22, ry: 20, fill: SKIN }, h));
    E('path', { d: 'M-80,-330 C-92,-404 -34,-430 6,-428 C56,-426 94,-398 82,-330 C72,-366 38,-384 -2,-378 C-38,-374 -66,-358 -80,-330 Z', fill: HAIR }, h);
    for (const sg of [-1, 1]) { E('circle', { cx: sg * 28, cy: -340, r: 8, fill: '#2A1D14' }, h); E('circle', { cx: sg * 28 + 2.5, cy: -343, r: 2.6, fill: '#FFFFFF' }, h); }
    E('path', { d: 'M-6,-318 Q0,-308 6,-318', fill: 'none', stroke: SKINDK, 'stroke-width': 4, 'stroke-linecap': 'round' }, h);
    const cheeks = [-1, 1].map(sg => E('ellipse', { cx: sg * 47, cy: -304, rx: 14, ry: 9, fill: '#E8848A', opacity: 0.45 }, h));
    const smile = E('path', { d: 'M-22,-292 Q0,-276 22,-292', fill: 'none', stroke: '#5A2A22', 'stroke-width': 5, 'stroke-linecap': 'round' }, h);
    const shut = E('path', { d: 'M-11,-289 L11,-289', fill: 'none', stroke: '#5A2A22', 'stroke-width': 5, 'stroke-linecap': 'round' }, h);
    g.puff = p => {
      p = clamp(p);
      attr(g.faceEl, 'rx', 78 + 6 * p);
      puffs.forEach((e, i) => { op(e, p); attr(e, 'cx', (i ? 1 : -1) * (58 + 8 * p)); attr(e, 'rx', 16 + 10 * p); attr(e, 'ry', 14 + 8 * p); });
      cheeks.forEach((e, i) => { attr(e, 'cx', (i ? 1 : -1) * (47 + 14 * p)); attr(e, 'rx', 14 + 4 * p); });
      op(smile, 1 - p); op(shut, p);
    };
    g.puff(0);
    return g;
  }
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  function badge(parent, text, r, fill, color) {
    const g = G(parent);
    E('circle', { r: r * 1.9, fill: glow(fill) }, g);
    E('circle', { r, fill, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    T(g, 0, r * 0.38, text, { size: r * 1.15, weight: 700, anchor: 'middle', fill: color || C.bg0 });
    return g;
  }
  function moon(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.7, fill: glow('#C9D3DE'), opacity: 0.5 }, g);
    E('circle', { r, fill: ball('#D7DCE3', '#7D8794'), stroke: '#EEF2F6', 'stroke-width': 3 }, g);
    [[-0.38, -0.3, 0.2], [0.3, -0.42, 0.13], [0.24, 0.22, 0.24], [-0.32, 0.38, 0.12], [-0.02, 0.02, 0.09]].forEach(([x, y, k]) =>
      E('circle', { cx: x * r, cy: y * r, r: k * r, fill: '#9AA4B0', stroke: '#B9C2CC', 'stroke-width': 2, opacity: 0.85 }, g));
    return g;
  }
  function football(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: '#F4F7FA', stroke: '#2A3440', 'stroke-width': 3 }, g);
    const pts = []; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; pts.push([Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36]); }
    E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', fill: '#2A3440' }, g);
    pts.forEach(p => E('line', { x1: p[0], y1: p[1], x2: p[0] * 2.6, y2: p[1] * 2.6, stroke: '#2A3440', 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
    return g;
  }

  /* ---------- the person ---------- */
  const BX = 330, BY = 470, BS = 0.9;
  const person = G(root);
  const bu = bust(person);
  tr(person, BX, BY, BS);
  op(bu.chest.ribs, 0); op(bu.chest.bands, 0); op(bu.chest.dia, 0); op(bu.chest.cav, 0);
  // the hidden muscle: a dashed dome outline under the lungs
  const hidden = G(bu.chest);
  const hidGlow = E('ellipse', { cx: 0, cy: 168, rx: 230, ry: 70, fill: glow('#FF8FA3') }, hidden);
  const hidLine = E('path', { d: bu.chest.domeD(0.35), fill: 'none', stroke: '#FFD0DA', 'stroke-width': 7, 'stroke-dasharray': '16 12', 'stroke-linecap': 'round' }, hidden);
  const toStage = (x, y) => [BX + x * BS, BY + y * BS];

  // breath clock: runs, slows to a stop mid-breath on 'lungs', restarts on 'def'
  const PH = 0.682, PER = 3.6;                       // frozen breath sits at about 0.35
  // (it restarts 1.4 s into 'def', so the poster frame at def + 2.2 s shows a breath of oxygen coming in)
  const t1 = at('lungs') - 0.3, L1 = 0.8, t3 = at('def') + 1.4, M1 = 0.8;
  function bclock(t) {
    if (t < t1) return t;
    if (t < t1 + L1) { const d = t - t1; return t1 + d - d * d / (2 * L1); }
    if (t < t3) return t1 + L1 / 2;
    if (t < t3 + M1) { const d = t - t3; return t1 + L1 / 2 + d * d / (2 * M1); }
    return t1 + L1 / 2 + M1 / 2 + (t - t3 - M1);
  }

  /* ---------- hook: the counter, and "not even thinking about it" ---------- */
  const hookG = G(root);
  const about = T(hookG, 860, 262, 'about', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const count = T(hookG, 860, 384, '0', { size: 124, weight: 700, anchor: 'middle', fill: C.energy });
  const perDay = T(hookG, 860, 452, 'breaths a day', { size: 42, weight: 600, anchor: 'middle' });
  const think = G(root);
  E('circle', { cx: 432, cy: 214, r: 8, fill: '#F2F7FA', opacity: 0.9 }, think);
  E('circle', { cx: 456, cy: 186, r: 12, fill: '#F2F7FA', opacity: 0.9 }, think);
  E('path', { d: closedPath(blobPts(56, 42, 10, 0, 0.12, 5)), fill: '#F2F7FA', transform: 'translate(518 132)' }, think);
  const ball_ = football(think, 26); tr(ball_, 518, 132);

  /* ---------- lungs: "?" on the lungs, the hidden muscle, the Moon ---------- */
  const qLungs = badge(root, '?', 34, C.energy);
  const hidLab = G(root);
  E('line', { x1: 552, y1: 642, x2: 470, y2: 624, stroke: C.muted, 'stroke-width': 2.5 }, hidLab);
  E('circle', { cx: 470, cy: 624, r: 4.5, fill: C.muted }, hidLab);
  T(hidLab, 568, 652, 'a hidden muscle?', { size: 30, weight: 600, fill: '#FFD0DA' });
  const moonG = G(root);
  const moonArt = moon(moonG, 92);
  const qMoon = badge(moonG, '?', 30, C.energy); tr(qMoon, 98, -86);
  const moonLab = T(moonG, 0, 150, 'the Moon', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });

  /* ---------- def: title, oxygen in, carbon dioxide out ---------- */
  const title = G(root);
  T(title, 0, 0, 'Breathing', { size: 100, weight: 700, anchor: 'middle' });
  const sub = T(title, 0, 66, 'and gas exchange', { size: 50, weight: 600, anchor: 'middle', fill: C.air });
  const rowO = G(root), rowC = G(root);
  tr(molO2(rowO, 17), 664, 412);
  T(rowO, 716, 424, '**oxygen** in', { size: 38, weight: 500, boldFill: O2T });
  T(rowO, 716, 462, 'your cells need it', { size: 26, weight: 500, fill: C.muted, font: FB });
  tr(molCO2(rowC, 14), 664, 540);
  T(rowC, 716, 552, '**carbon dioxide** out', { size: 38, weight: 500, boldFill: C.co2 });
  T(rowC, 716, 590, 'a waste gas', { size: 26, weight: 500, fill: C.muted, font: FB });
  // molecules carried by each breath (bust units): in through the mouth, down the windpipe, into a lung
  const PATH_IN = [[[280, -318], [80, -296], [0, -290], [0, -250], [0, -150], [0, -60], [-46, -22], [-84, 46]],
    [[280, -318], [80, -296], [0, -290], [0, -250], [0, -150], [0, -60], [46, -22], [86, 52]]];
  const PATH_OUT = [[[-84, 46], [-46, -22], [0, -60], [0, -150], [0, -250], [0, -290], [80, -300], [200, -360]],
    [[86, 52], [46, -22], [0, -60], [0, -150], [0, -250], [0, -290], [80, -300], [200, -360]]];
  const flowG = G(root);
  const o2s = [0, 1, 2, 3].map(() => molO2(flowG, 13));
  const co2s = [0, 1, 2, 3].map(() => molCO2(flowG, 11));

  /* ---------- plan: three stops ---------- */
  const road = G(root);
  const STOPX = [240, 600, 960];
  // 1: the airway tree
  function miniTree(g) {
    const br = [];
    const mk = (pts, w) => { const d = openPath(pts); const o = E('path', { d, fill: 'none', stroke: TUBEDK, 'stroke-width': w + 4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g); const i = E('path', { d, fill: 'none', stroke: TUBE, 'stroke-width': w, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g); br.push([o, i]); };
    mk([[0, -92], [0, -34]], 12);
    const tips = [];
    for (const sg of [-1, 1]) {
      mk([[0, -34], [sg * 16, -20], [sg * 38, -10]], 9);
      [[[sg * 38, -10], [sg * 54, 6], [sg * 64, 30]], [[sg * 38, -10], [sg * 38, 14], [sg * 30, 40]]].forEach(p => {
        mk(p, 6);
        const e = p[2];
        [[e[0] + sg * 10, e[1] + 22], [e[0] - sg * 6, e[1] + 24]].forEach(tp => { mk([e, tp], 4); tips.push(tp); });
      });
    }
    const cl = tips.map(([x, y]) => { const c = G(g); [[0, 0], [-6, 5], [6, 5], [0, 9], [-4, -4], [5, -3]].forEach(([dx, dy]) => E('circle', { cx: dx, cy: dy, r: 4.6, fill: ball('#C7EBFF', '#5FA8D8'), stroke: '#E8F7FF', 'stroke-width': 1 }, c)); return { c, x, y: y + 4 }; });
    return { br, cl };
  }
  // 2: the chest with its diaphragm
  // 3: an alveolus with an oxygen dot crossing into the blood
  function miniAlv(g) {
    // a bronchiole ends in one air sac; a capillary hugs its lower right: bluish blood in, red blood out
    // colours of the alveolus close-up in "Gas exchange": dark air sac with a pale blue wall, plasma bluish -> red
    E('path', { d: 'M-104,-92 L-62,-44', fill: 'none', stroke: '#BFE6FA', 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
    const cap = [[-118, 62], [-74, 52], [-28, 50], [12, 34], [34, 2], [36, -34], [52, -66], [84, -88]];
    E('path', { d: openPath(cap), fill: 'none', stroke: '#E9BDC9', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: openPath(cap), fill: 'none', stroke: linGrad('#A3303E', '#584D9C', true), 'stroke-width': 25, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: -34, cy: -12, r: 46, fill: '#1E4256', stroke: '#BFE6FA', 'stroke-width': 4 }, g);
    E('path', { d: 'M-104,-92 L-58,-40', fill: 'none', stroke: '#1E4256', 'stroke-width': 15, 'stroke-linecap': 'round' }, g);
    const dots = [[-52, -16], [-30, 8], [-50, 12], [-20, -30], [-6, -6]].map(([x, y]) => { const d = E('circle', { cx: x, cy: y, r: 6.5, fill: C.oxygen, stroke: '#FFC2BA', 'stroke-width': 1.5 }, g); return { d, x, y }; });
    const rbc = [0, 1, 2].map(() => E('ellipse', { rx: 8, ry: 5.5, fill: '#F04A57', stroke: '#FFD0D5', 'stroke-width': 1.2 }, g));
    const mover = E('circle', { r: 7.5, fill: C.oxygen, stroke: '#FFFFFF', 'stroke-width': 2.5 }, g);
    return { mover, dots, rbc, cap };
  }
  const stops = [
    { text: 'Down your airways', draw: g => { const a = G(g); tr(a, 0, 6); return miniTree(a); } },
    { text: 'What moves the air', draw: g => { const a = G(g); tr(a, 0, -4, 0.36); const c = chestArt(a); const gl = E('ellipse', { cx: 0, cy: 175, rx: 230, ry: 60, fill: glow('#FF8FA3') }, a); a.insertBefore(gl, a.firstChild); return { c, gl }; } },
    { text: 'Into your blood', draw: g => { const a = G(g); tr(a, 0, 0); return miniAlv(a); } },
  ].map((st, i) => {
    const g = G(road); tr(g, STOPX[i], 440);
    card(g, -160, -130, 320, 270, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -22);
    const parts = st.draw(art);
    T(g, 0, 104, st.text, { size: 29, weight: 600, anchor: 'middle' });
    return { g, parts };
  });
  const roadArrows = [arrow(road, 404, 440, 436, 440, { color: C.faint, width: 5 }), arrow(road, 764, 440, 796, 440, { color: C.faint, width: 5 })];
  const airDot = E('circle', { r: 7, fill: C.air, stroke: '#FFFFFF', 'stroke-width': 2 }, stops[0].g);

  return t => {
    const tb = bclock(t), q = ((tb / PER + PH) % 1 + 1) % 1, br = 0.5 - 0.5 * Math.cos(TAU * q);
    const live = AMP;                                  // breathing depth (toned down when reduced motion)

    /* --- the person --- */
    const fP = Math.min(P(t, 0.05, 0.6, linear), 1 - P(t, at('plan') - 0.1, 0.6, linear));
    op(person, fP);
    if (fP > 0) {
      bu.chest.set(br * live);
      const pin = P(t, 0.05, 0.9, easeOut);
      tr(person, BX, BY + (1 - pin) * 26, BS);
      // hidden muscle
      const hm = win(t, mid('lungs', 0.42), at('def') + 0.1, 0.5);
      op(hidden, hm);
      if (hm > 0) { const w = wave(t, 1.5); op(hidLine, 0.45 + 0.5 * w); op(hidGlow, 0.25 + 0.55 * w); hidLine.setAttribute('stroke-dashoffset', (-t * 18 * AMP).toFixed(1)); }
    }

    /* --- hook --- */
    const fH = win(t, 0.3, at('lungs') + 0.2, 0.5);
    op(hookG, fH);
    if (fH > 0) {
      const n = 22000 * P(t, at('hook') + 0.3, 2.6, easeOut);
      setText(count, fmt(Math.round(n / 10) * 10));
      op(about, P(t, at('hook') + 0.2, 0.5, linear));
      op(perDay, P(t, at('hook') + 0.5, 0.5, linear));
      const cp = P(t, at('hook') + 0.2, 0.6, pop);
      count.setAttribute('transform', `translate(860 360) scale(${(0.7 + 0.3 * cp).toFixed(3)}) translate(-860 -360)`);
    }
    const fT = win(t, mid('hook', 0.55), at('lungs') + 0.1, 0.4);
    op(think, fT);
    if (fT > 0) tr(ball_, 518, 132 + Math.sin(t * 5) * 3 * AMP, 1, (t * 60 * AMP) % 360);

    /* --- lungs --- */
    const qp = P(t, mid('lungs', 0.1), 0.5, pop), qOut = 1 - P(t, at('def') - 0.1, 0.4, linear);
    op(qLungs, clamp(qp * 2) * qOut);
    const [qx, qy] = toStage(0, 20);
    tr(qLungs, qx, qy, Math.max(0.01, qp) * (1 + 0.05 * Math.sin(t * 4) * AMP));
    op(hidLab, win(t, mid('lungs', 0.48), at('def') + 0.1, 0.4));
    const mIn = P(t, mid('lungs', 0.7), 1.0, easeOut), mOut = 1 - P(t, at('def') - 0.1, 0.5, linear);
    op(moonG, mIn * mOut);
    if (mIn * mOut > 0) {
      tr(moonG, lerp(1320, 960, mIn), 300 + Math.sin(t * 0.9) * 4 * AMP);
      const pm = P(t, mid('lungs', 0.86), 0.5, pop);
      op(qMoon, clamp(pm * 2)); tr(qMoon, 98, -86, Math.max(0.01, pm));
      op(moonLab, P(t, mid('lungs', 0.8), 0.4, linear));
      tr(moonArt, 0, 0, 1, (t * 4 * AMP) % 360);
    }

    /* --- def: title, gas rows, molecules --- */
    const tp = P(t, at('def') + 0.1, 0.9, easeOut), tq = P(t, at('plan') + 0.05, 0.9);
    op(title, tp);
    tr(title, lerp(870, 600, tq), lerp(lerp(252, 226, tp), 150, tq), lerp(1, 0.72, tq));
    op(sub, P(t, mid('def', 0.1), 0.5, linear));
    const rO = P(t, mid('def', 0.44), 0.5, easeOut), rC = P(t, mid('def', 0.76), 0.5, easeOut), rOut = 1 - P(t, at('plan') - 0.1, 0.5, linear);
    op(rowO, rO * rOut); tr(rowO, (1 - rO) * 24, 0);
    op(rowC, rC * rOut); tr(rowC, (1 - rC) * 24, 0);
    const fl = P(t, t3, 0.4, linear) * (1 - P(t, at('plan') - 0.1, 0.5, linear));
    op(flowG, fl);
    if (fl > 0) {
      const cyc = Math.floor(tb / PER + PH);
      o2s.forEach((m, j) => {
        const u = clamp((q - 0.02 - j * 0.07) / 0.4), path = PATH_IN[(cyc + j) % 2];
        const [px, py] = along(path, ease(u)), [x, y] = toStage(px, py);
        tr(m, x, y, 1, j * 40 + u * 60);
        op(m, u <= 0 || u >= 1 ? 0 : Math.min(1, u * 8, (1 - u) * 6));
      });
      co2s.forEach((m, j) => {
        const u = clamp((q - 0.52 - j * 0.07) / 0.4), path = PATH_OUT[(cyc + j + 1) % 2];
        const [px, py] = along(path, ease(u)), [x, y] = toStage(px, py);
        tr(m, x, y, 1, -20 + j * 15 - u * 40);
        op(m, u <= 0 || u >= 1 ? 0 : Math.min(1, u * 8, (1 - u) * 5));
      });
    }

    /* --- plan: roadmap --- */
    op(road, P(t, at('plan'), 0.4, linear));
    const showAt = [mid('plan', 0.02), mid('plan', 0.38), mid('plan', 0.68)];
    stops.forEach((st, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, STOPX[i], 440 + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
    });
    // 1: the tree draws in, then a puff of air runs down it
    const tree = stops[0].parts;
    tree.br.forEach(([o, i], k) => { const d = (1 - P(t, showAt[0] + 0.3 + (k === 0 ? 0 : k < 3 ? 0.35 : k < 7 ? 0.6 : 0.85), 0.5)).toFixed(4); o.setAttribute('stroke-dashoffset', d); i.setAttribute('stroke-dashoffset', d); });
    tree.cl.forEach((o, k) => { const p = P(t, showAt[0] + 1.3 + (k % 4) * 0.08, 0.4, pop); op(o.c, clamp(p * 2)); tr(o.c, o.x, o.y, Math.max(0.01, p)); });
    const ad = ((t - showAt[0] - 1.8) / 2.2) % 1;
    if (t > showAt[0] + 1.8) {
      const [x, y] = along([[0, -100], [0, -34], [16, -20], [38, -10], [54, 6], [64, 30], [74, 52]], ease(ad));
      attr(airDot, 'cx', x); attr(airDot, 'cy', y - 22); op(airDot, Math.min(1, ad * 6, (1 - ad) * 6));
    } else op(airDot, 0);
    // 2: the chest breathes, its diaphragm glowing
    const ch = stops[1].parts;
    const b2 = wave(t - showAt[1], 3.0) * AMP;
    ch.c.set(b2); op(ch.gl, P(t, showAt[1] + 0.4, 0.5, linear) * (0.35 + 0.5 * b2));
    // 3: one oxygen dot crosses from the air sac into the blood, which carries it away
    const al = stops[2].parts;
    const u3 = ((t - showAt[2] - 0.5) / 2.0) % 1;
    if (t > showAt[2] + 0.5) {
      const [x, y] = along([[-40, -4], [-14, 10], [2, 22], [16, 30], [32, 4], [36, -34], [52, -66], [80, -86]], ease(u3));
      attr(al.mover, 'cx', x); attr(al.mover, 'cy', y); op(al.mover, Math.min(1, u3 * 6, (1 - u3) * 5));
    } else op(al.mover, 0);
    al.dots.forEach((d, k) => { attr(d.d, 'cx', d.x + Math.sin(t * 2 + k) * 3 * AMP); attr(d.d, 'cy', d.y + Math.cos(t * 1.7 + k) * 3 * AMP); });
    al.rbc.forEach((e, k) => {
      const u = (t * 0.16 * AMP + k / 3) % 1, [x, y] = along(al.cap, u), [x2, y2] = along(al.cap, Math.min(1, u + 0.02));
      tr(e, x, y, 1, Math.atan2(y2 - y, x2 - x) * 180 / Math.PI);
      e.setAttribute('fill', u < 0.45 ? '#926CDC' : '#F04A57');
      op(e, Math.min(1, u * 10, (1 - u) * 10));
    });
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
  };
});

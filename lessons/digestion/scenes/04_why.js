/* Chapter: Why food must be digested.
   A cutaway of the gut wall: a starch chain and a protein chain wriggle in the gut, bounce off the wall
   (too big), enzymes snip them into single units, and the units slip through the wall into the blood and
   flow off to a body cell, which sparks (showpiece). Then three equation rows (starch, protein, fat),
   mechanical vs chemical digestion side by side, one cube cut into eight (surface area), and the
   squished-bread bag to try at home. */
scene('why', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- the lesson's molecule set and enzyme blobs ---------- */
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  function mix(a, b, p) { const A_ = hx(a), B_ = hx(b), q = clamp(p); return '#' + A_.map((v, i) => Math.round(lerp(v, B_[i], q)).toString(16).padStart(2, '0')).join(''); }
  const hexPath = s => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (Math.cos(a) * s).toFixed(1) + ',' + (Math.sin(a) * s).toFixed(1); } return d + 'Z'; };
  function hexU(parent, s) {                               // glucose: amber hexagon with its ring oxygen
    const g = G(parent);
    E('path', { d: hexPath(s), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.12), 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: (s * 0.866).toFixed(1), cy: (-s * 0.5).toFixed(1), r: (s * 0.2).toFixed(1), fill: C.oxygen }, g);
    return g;
  }
  const BEADC = [['#FF8A80', '#C2534C'], ['#4DD0C8', '#1E8C85'], ['#B5E655', '#6E9A26'], [C.ethanol, C.ethanolDk]];
  function bead(parent, r, k) { const [c, dk] = BEADC[k % 4]; return E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.2, r * 0.12) }, parent); }
  function tail(parent, s) {                               // fatty acid: orange zig-zag from its left end
    let d = 'M0,0'; for (let i = 1; i <= 6; i++) d += ` L${(i * 11 * s).toFixed(1)},${((i % 2 ? -5 : 5) * s).toFixed(1)}`;
    return E('path', { d, fill: 'none', stroke: '#FFB347', 'stroke-width': 6 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function bar(parent, s) { return E('rect', { x: -8 * s, y: -34 * s, width: 16 * s, height: 68 * s, rx: 8 * s, fill: ball('#FFF0B8', '#C9B46A'), stroke: '#C9B46A', 'stroke-width': 2 }, parent); }
  const ENZ = { amy: [C.water, C.waterDk], pro: [C.lactic, C.lacticDk], lip: [C.heat, C.heatDk] };
  /* enzyme: a rounded blob with its active site (a notch shaped for its molecule) at the top centre */
  function enzyme(parent, kind, R) {
    const [c, dk] = ENZ[kind], g = G(parent), top = -0.55 * R, bot = 0.75 * R, n = 0.34 * R;
    let notch;
    if (kind === 'pro') notch = `A${n.toFixed(1)},${n.toFixed(1)} 0 0 0 ${n.toFixed(1)},${top.toFixed(1)}`;
    else if (kind === 'amy') { const s = n / 0.866; notch = `L${-n},${top + 0.5 * s} L0,${top + s} L${n},${top + 0.5 * s} L${n},${top}`; }
    else notch = `L${-n},${top + 0.9 * n} L${n},${top + 0.9 * n} L${n},${top}`;
    const d = `M${-n},${top} ${notch} C${0.62 * R},${top} ${R},${top + 0.1 * R} ${R},${0.1 * R} C${R},${0.55 * R} ${0.6 * R},${bot} 0,${bot} C${-0.6 * R},${bot} ${-R},${0.55 * R} ${-R},${0.1 * R} C${-R},${top + 0.1 * R} ${-0.62 * R},${top} ${-n},${top} Z`;
    E('path', { d, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(2, R * 0.07), 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: -0.45 * R, cy: 0.02 * R, rx: 0.22 * R, ry: 0.12 * R, fill: '#FFFFFF', opacity: 0.35, transform: `rotate(-24 ${-0.45 * R} ${0.02 * R})` }, g);
    g.top = top;
    return g;
  }
  function flash(parent, r) {
    const g = G(parent); r = r || 18;
    E('circle', { r: r * 1.3, fill: glow('#FFFFFF') }, g);
    let d = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; d += `M${(Math.cos(a) * r * 0.45).toFixed(1)},${(Math.sin(a) * r * 0.45).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `; }
    E('path', { d, stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  const flashAt = (f, t, t0, x, y) => { const u = (t - t0) / 0.38; if (u < 0 || u > 1) { op(f, 0); return; } op(f, 1 - u * u); tr(f, x, y, 0.5 + 0.9 * u); };
  const pill = (parent, text, o) => chip(parent, text, Object.assign({ size: 28, fill: 'rgba(10,27,39,0.86)', stroke: C.line, sw: 2.5 }, o || {}));
  const popIn = (el, t, t0, x, y, d) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * (d === undefined ? 14 : d), Math.max(0.01, 0.85 + 0.15 * p)); return p; };
  function along(pts, u) {
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const f = seg[i] ? clamp(d / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= seg[i]; }
    return pts[pts.length - 1];
  }
  const pathLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };

  /* ================= A. the gut wall cutaway ================= */
  const A = G(root);
  const WY0 = 395, WY1 = 430, CAPY = 520, PORES = [];
  for (let x = 70; x < 1200; x += 100) PORES.push(x);
  E('rect', { x: 0, y: 104, width: W, height: WY0 - 104, rx: 0, fill: 'rgba(244,166,184,0.05)' }, A);
  E('rect', { x: 0, y: WY1, width: W, height: H - WY1, fill: 'rgba(232,66,79,0.07)' }, A);
  const wallG = G(A);
  const segs = [[-20, PORES[0] - 19]];
  for (let i = 0; i < PORES.length - 1; i++) segs.push([PORES[i] + 19, PORES[i + 1] - 19]);
  segs.push([PORES[PORES.length - 1] + 19, 1220]);
  segs.forEach(([a, b]) => E('rect', { x: a, y: WY0, width: b - a, height: WY1 - WY0, rx: 13, fill: linGrad('#F7B9C8', '#D9788F', true), stroke: '#B8466A', 'stroke-width': 2.5 }, wallG));
  // the blood capillary, and red blood cells flowing along it
  E('path', { d: `M-40,${CAPY} L1240,${CAPY}`, stroke: '#E8424F', 'stroke-width': 70 }, A);
  E('path', { d: `M-40,${CAPY} L1240,${CAPY}`, stroke: '#45121C', 'stroke-width': 58 }, A);
  const rbcs = []; for (let k = 0; k < 8; k++) rbcs.push(E('ellipse', { rx: 13, ry: 8, fill: ball('#FF7A86', '#B8303D'), opacity: 0.85 }, A));
  const cellG = G(A); tr(cellG, 1045, 640);
  const cell = animalCell(cellG, 92, 60, { sw: 5, seed: 8, nr: 17, nx: 30, ny: -6 });
  const sparks = [[-40, -10], [10, 22], [-62, 24], [40, -26], [-8, -30]].map((p, k) => ({ el: spark(cellG, 13, { seed: k + 1 }), p }));
  const lbGut = T(A, 40, 378, 'inside the gut', { size: 26, weight: 600, fill: '#F7B9C8' });
  const lbWall = T(A, 1170, 466, 'gut wall', { size: 26, weight: 600, anchor: 'end', fill: '#F7B9C8' });
  const lbBlood = T(A, 40, 474, 'blood', { size: 26, weight: 700, fill: '#FF8A94' });
  const lbCell = T(A, 930, 668, 'body cell', { size: 26, weight: 600, anchor: 'end', fill: C.cell });

  // the two big molecules (bonds behind units; enzymes behind both)
  const molG = G(A), enzG = G(molG), bondG = G(molG), unitG = G(molG), fxG = G(molG);
  const NU = 9;
  const CH = [
    { kind: 'amy', sp: 34, r: 17, cx: 380, cy: 222, D: 152, ph: 0, lag: 0, bond: '#C98F22' },
    { kind: 'pro', sp: 31, r: 14, cx: 760, cy: 292, D: 85, ph: 1.3, lag: 0.22, bond: '#C8B6CF' },
  ];
  const sr = rng(23);
  CH.forEach((c, ci) => {
    c.bonds = []; c.units = [];
    for (let k = 0; k < NU - 1; k++) c.bonds.push(E('line', { stroke: c.bond, 'stroke-width': 5, 'stroke-linecap': 'round' }, bondG));
    for (let k = 0; k < NU; k++) {
      const el = ci ? bead(unitG, c.r, k) : hexU(unitG, c.r);
      const sx = c.cx + (k - (NU - 1) / 2) * c.sp * 1.25 + (sr() - 0.5) * 18, sy = 312 + sr() * 52 + (ci ? 6 : -6);
      const xp = PORES.reduce((b, p) => (Math.abs(p - sx) < Math.abs(b - sx) ? p : b), PORES[0]);
      c.units.push({ el, sx, sy, xp, j: (sr() - 0.5) * 22, cj: [(sr() - 0.5) * 70, (sr() - 0.5) * 40], ph: sr() * TAU });
    }
    c.enz = enzyme(enzG, c.kind, 36);
    c.flash = flash(fxG, 18);
    c.tag = T(A, 0, 0, ci ? 'protein' : 'starch', { size: 28, weight: 700, anchor: 'end', fill: ci ? '#FFB3AC' : C.glucoseLt });
    c.snips = []; for (let k = 0; k < NU - 1; k++) c.snips.push(mid('digestion', 0.16) + c.lag + k * 0.4);
  });
  // absorption order: alternate starch and protein units, left to right
  const ORDER = []; for (let k = 0; k < NU; k++) { ORDER.push([0, k]); ORDER.push([1, k]); }
  ORDER.forEach(([ci, k], o) => {
    const u = CH[ci].units[k];
    u.t0 = at('absorbed') + 0.05 + o * 0.1;
    u.path = [[u.sx, u.sy], [u.xp, WY0 - 18], [u.xp, WY1 + 16], [u.xp + 14, CAPY + u.j], [985, CAPY + u.j], [1016, 594], [1045 + u.cj[0], 640 + u.cj[1] * 0.6]];
    u.dur = pathLen(u.path) / 235;
  });
  const xs = [cross(A, 15), cross(A, 15)];
  const chLarge = pill(A, 'large, insoluble molecules', { stroke: C.bad, color: '#FFB3BA' });
  const chBig = pill(A, 'too big to get through', { stroke: C.bad, color: '#FFB3BA' });
  const chSmall = pill(A, 'small, soluble molecules', { stroke: C.good, color: '#BFF5DA' });
  const LX = 50 + chLarge.w / 2, SXc = 1150 - chSmall.w / 2;
  const digArrow = arrow(A, LX + chLarge.w / 2 + 16, 160, SXc - chSmall.w / 2 - 16, 160, { color: C.energy, width: 6 });
  const digLbl = T(A, (LX + chLarge.w / 2 + SXc - chSmall.w / 2) / 2, 138, 'digestion', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const chAbs = pill(A, 'absorbed into the blood', { stroke: '#FF8A94', color: '#FFC2C8' });
  const chUse = pill(A, 'for energy, growth and repair', { size: 26, stroke: C.energy, color: C.energy });

  /* ================= B. three equation rows ================= */
  const B = G(root);
  const RY = [205, 380, 555], LX0 = 290, AR = [442, 560];
  const rows = [0, 1, 2].map(i => {
    const g = G(B), left = G(g), right = G(g), Y = RY[i];
    const prods = [];
    if (i === 0) {
      for (let k = 0; k < 5; k++) E('line', { x1: LX0 + (k - 2.5) * 39, y1: Y, x2: LX0 + (k - 1.5) * 39, y2: Y, stroke: '#C98F22', 'stroke-width': 6 }, left);
      for (let k = 0; k < 6; k++) tr(hexU(left, 20), LX0 + (k - 2.5) * 39, Y);
      for (let k = 0; k < 6; k++) { const h = hexU(right, 20); prods.push({ el: h, x: 650 + k * 58, y: Y + (k % 2 ? 9 : -9), r: k * 23 }); }
    } else if (i === 1) {
      for (let k = 0; k < 5; k++) E('line', { x1: LX0 + (k - 2.5) * 36, y1: Y, x2: LX0 + (k - 1.5) * 36, y2: Y, stroke: '#C8B6CF', 'stroke-width': 6 }, left);
      for (let k = 0; k < 6; k++) tr(bead(left, 17.5, k), LX0 + (k - 2.5) * 36, Y);
      for (let k = 0; k < 6; k++) prods.push({ el: bead(right, 17.5, k), x: 652 + k * 57, y: Y + (k % 2 ? 10 : -10), r: 0 });
    } else {
      const s = 1.35, comb = G(left); tr(comb, LX0 - 40, Y);
      [-1, 0, 1].forEach(k => tr(tail(comb, s), 8 * s, k * 24 * s));
      bar(comb, s);
      [[652, Y - 36, -9], [670, Y + 2, 6], [650, Y + 40, -4]].forEach(([x, y, r]) => { const tg = G(right); tail(tg, s); prods.push({ el: tg, x, y, r }); });
      const bg = G(right); bar(bg, s); prods.push({ el: bg, x: 912, y: Y, r: 0 });
    }
    const arw = arrow(g, AR[0], Y, AR[1], Y, { color: C.ink, width: 6 });
    const names = [['starch', 'glucose'], ['protein', 'amino acids'], ['fat', null]][i];
    const lL = T(g, LX0, Y + 74, names[0], { size: 32, weight: 700, anchor: 'middle', fill: [C.glucoseLt, '#FFB3AC', '#FFD9A0'][i] });
    let lR;
    if (names[1]) lR = [T(g, 795, Y + 74, names[1], { size: 32, weight: 700, anchor: 'middle', fill: [C.glucoseLt, '#FFB3AC'][i] })];
    else {
      const ws = ['fatty acids', 'and', 'glycerol'].map((w, j) => textWidth(w, 32, FD, j === 1 ? 800 : 700)), gap = 16;
      let x = 795 - (ws[0] + ws[1] + ws[2] + 2 * gap) / 2;
      lR = ['fatty acids', 'and', 'glycerol'].map((w, j) => { const e = T(g, x, Y + 90, w, { size: 32, weight: j === 1 ? 800 : 700, fill: ['#FFD9A0', C.energy, '#FFF0B8'][j] }); x += ws[j] + gap; return e; });
    }
    return { g, left, right, prods, arw, lL, lR };
  });

  /* ================= C. mechanical vs chemical ================= */
  const Cg = G(root);
  const panL = G(Cg), panR = G(Cg);
  card(panL, 50, 110, 530, 580, { fill: 'rgba(20,54,70,0.7)', stroke: C.line });
  card(panR, 620, 110, 530, 580, { fill: 'rgba(20,54,70,0.7)', stroke: C.line });
  T(panL, 315, 172, 'Mechanical', { size: 42, weight: 700, anchor: 'middle', fill: '#FFD9A0' });
  const subL = T(panL, 315, 214, 'breaks food into smaller pieces', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  T(panR, 885, 172, 'Chemical', { size: 42, weight: 700, anchor: 'middle', fill: C.water });
  const subR = T(panR, 885, 214, 'enzymes break the bonds', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // bread pieces: generations 0..4 (1, 2, 4, 8, 14 pieces), then crumbs churned in the stomach
  const MCX = 315, MCY = 450, pr = rng(31);
  function crumb(parent, rx, ry, seed) {
    const r = rng(seed), pts = [];
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, k = 0.78 + r() * 0.3; pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]); }
    return E('path', { d: closedPath(pts), fill: '#F2CF8E', stroke: '#B5733A', 'stroke-width': Math.max(3, rx * 0.09), 'stroke-linejoin': 'round' }, parent);
  }
  const GEN = [1, 2, 4, 8, 14].map((n, gi) => {
    const rx = [78, 56, 40, 29, 21][gi], ry = rx * 0.78, list = [];
    for (let k = 0; k < n; k++) {
      let x = 0, y = 0;
      if (n > 1) { const cols = Math.ceil(Math.sqrt(n * 1.4)), row = Math.floor(k / cols), col = k % cols, rows = Math.ceil(n / cols); x = (col - (cols - 1) / 2) * rx * 2.3 + (pr() - 0.5) * rx * 0.5; y = (row - (rows - 1) / 2) * ry * 2.4 + (pr() - 0.5) * ry * 0.5; }
      const g = G(panL); crumb(g, rx, ry, 100 + gi * 20 + k);
      list.push({ g, x, y, r: (pr() - 0.5) * 50 });
    }
    return list;
  });
  const jaw = G(panL);
  function teethRow(parent, up) {
    const g = G(parent);
    E('rect', { x: -150, y: up ? -46 : 0, width: 300, height: 46, rx: 22, fill: '#E57F98', stroke: '#B8466A', 'stroke-width': 3 }, g);
    for (let k = 0; k < 5; k++) { const x = -112 + k * 56; E('path', { d: up ? `M${x - 24},-4 L${x + 24},-4 L${x + 20},34 Q${x},44 ${x - 20},34 Z` : `M${x - 24},4 L${x + 24},4 L${x + 20},-34 Q${x},-44 ${x - 20},-34 Z`, fill: '#F5EEDC', stroke: '#C9BFA8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g); }
    return g;
  }
  const upper = teethRow(jaw, true), lower = teethRow(jaw, false);
  const stomach = E('path', { d: '', fill: 'rgba(244,166,184,0.12)', stroke: '#F4A6B8', 'stroke-width': 8, 'stroke-linejoin': 'round' }, panL);
  panL.insertBefore(stomach, GEN[0][0].g);
  const gullet = E('path', { d: '', fill: 'none', stroke: '#F4A6B8', 'stroke-width': 8, 'stroke-linecap': 'round' }, panL);
  panL.insertBefore(gullet, stomach);
  const STP = [[-62, -150], [-4, -150], [12, -104], [4, -56], [34, -18], [110, -4], [176, 22], [182, 82], [110, 120], [10, 160], [-104, 146], [-176, 72], [-180, -26], [-128, -112]];
  const lbTeeth = T(panL, 315, 668, 'teeth chewing', { size: 28, weight: 700, anchor: 'middle', fill: '#F5EEDC' });
  const lbChurn = T(panL, 315, 668, 'stomach churning', { size: 28, weight: 700, anchor: 'middle', fill: '#F7B9C8' });
  // chemical: one crumb, zoomed in to its molecules
  const ZX = 885, ZY = 470, ZR = 150;
  const zoomG = G(panR);
  const zCrumb = G(zoomG); crumb(zCrumb, 30, 24, 77); tr(zCrumb, ZX, 276);
  const zLines = E('path', { d: `M${ZX - 26},${290} L${ZX - ZR + 12},${ZY - 54} M${ZX + 26},${290} L${ZX + ZR - 12},${ZY - 54}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7', fill: 'none' }, zoomG);
  const zClipId = 'dgWhyZoomClip';
  { const cp = E('clipPath', { id: zClipId }, defs()); E('circle', { cx: ZX, cy: ZY, r: ZR - 3 }, cp); }
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'rgba(255,226,154,0.07)' }, zoomG);
  const zIn = G(zoomG, { 'clip-path': `url(#${zClipId})` });
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4 }, zoomG);
  const zEnz = enzyme(zIn, 'amy', 40);
  const zBonds = [], zUnits = [];
  for (let k = 0; k < 5; k++) zBonds.push(E('line', { stroke: '#C98F22', 'stroke-width': 6, 'stroke-linecap': 'round' }, zIn));
  for (let k = 0; k < 6; k++) zUnits.push(hexU(zIn, 17));
  const zFlash = flash(zIn, 24);
  const zBondLbl = G(panR);
  E('line', { x1: ZX - 19, y1: ZY - 16, x2: ZX - 40, y2: ZY - 68, stroke: C.ink, 'stroke-width': 2.5 }, zBondLbl);
  T(zBondLbl, ZX - 44, ZY - 76, 'bond', { size: 26, weight: 700, anchor: 'end', fill: C.ink });
  const zEnzLbl = T(panR, 0, 0, 'enzyme', { size: 26, weight: 700, anchor: 'middle', fill: C.water });

  /* ================= D. surface area: one cube cut into eight ================= */
  const Dg = G(root);
  const ISO = Math.cos(Math.PI / 6);
  function cubeFaces(parent, e) {
    const top = E('path', { d: `M0,${-e} L${e * ISO},${-e / 2} L0,0 L${-e * ISO},${-e / 2} Z`, fill: '#F7D79A' }, parent);
    const left = E('path', { d: `M${-e * ISO},${-e / 2} L0,0 L0,${e} L${-e * ISO},${e / 2} Z`, fill: '#E2B266' }, parent);
    const right = E('path', { d: `M0,0 L${e * ISO},${-e / 2} L${e * ISO},${e / 2} L0,${e} Z`, fill: '#C9934A' }, parent);
    return [top, left, right];
  }
  const CXc = 420, CYc = 440, EB = 120;
  const bigCube = G(Dg); const bigF = cubeFaces(bigCube, EB); tr(bigCube, CXc, CYc);
  bigF.forEach(f => { f.setAttribute('stroke', '#8A5A22'); f.setAttribute('stroke-width', 3); f.setAttribute('stroke-linejoin', 'round'); });
  const small = [];
  for (const z of [-1, 1]) for (const y of [-1, 1]) for (const x of [-1, 1]) small.push({ x, y, z });
  small.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z));
  small.forEach(c => { c.g = G(Dg); c.f = cubeFaces(c.g, EB / 2); c.f.forEach(f => { f.setAttribute('stroke-linejoin', 'round'); }); });
  const saMeter = meter(Dg, { w: 46, h: 300, vertical: true, color: C.energy }); tr(saMeter, 838, 272);
  T(Dg, 861, 618, 'surface area', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const x2 = T(Dg, 905, 330, '×2', { size: 44, weight: 700, fill: C.energy });
  const lbOne = T(Dg, CXc, 660, '1 big piece', { size: 30, weight: 700, anchor: 'middle' });
  const lbEight = T(Dg, CXc, 660, '8 smaller pieces', { size: 30, weight: 700, anchor: 'middle' });
  const dEnz = [[-150, -120], [150, -150], [-190, 60], [175, 70], [-40, -205], [40, 190]].map(p => ({ g: enzyme(Dg, 'amy', 20), p }));
  const dNote = T(Dg, 600, 170, 'more surface for enzymes to work on', { size: 30, weight: 700, anchor: 'middle', fill: C.water });

  /* ================= E. try it at home: the bread bag ================= */
  const Eg = G(root);
  const tryChip = pill(Eg, 'Try it at home', { size: 30, stroke: C.energy, color: C.energy }); tr(tryChip, 600, 150);
  const BXc = 600, BYc = 430;
  const bag = G(Eg);
  const bagD = 'M-200,-140 L200,-140 L200,128 Q200,150 178,150 L-178,150 Q-200,150 -200,128 Z';
  const bagClip = 'dgWhyBagClip';
  { const cp = E('clipPath', { id: bagClip }, defs()); E('path', { d: bagD }, cp); }
  E('path', { d: bagD, fill: 'rgba(200,230,250,0.10)' }, bag);
  const inBag = G(bag, { 'clip-path': `url(#${bagClip})` });
  const water = E('rect', { x: -210, y: -40, width: 420, height: 200, fill: '#8FD3F0', opacity: 0.4 }, inBag);
  const mush = E('rect', { x: -210, y: -40, width: 420, height: 200, fill: '#E3C894', opacity: 0 }, inBag);
  const flecks = G(inBag), fr = rng(57);
  for (let k = 0; k < 16; k++) E('circle', { cx: ((fr() - 0.5) * 360).toFixed(0), cy: (-20 + fr() * 150).toFixed(0), r: (3 + fr() * 4).toFixed(1), fill: '#C9A262' }, flecks);
  const bits = []; for (let k = 0; k < 9; k++) { const g = G(inBag); crumb(g, 30 + fr() * 14, 22 + fr() * 10, 300 + k); bits.push({ g, x: -150 + (k % 5) * 75 + (fr() - 0.5) * 20, y: (k < 5 ? 10 : 80) + (fr() - 0.5) * 24, r: fr() * 60 - 30, ph: fr() * TAU }); }
  E('path', { d: bagD, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bag);
  E('path', { d: 'M-196,-118 L196,-118', stroke: '#E8424F', 'stroke-width': 6, 'stroke-linecap': 'round' }, bag);
  E('path', { d: 'M-196,-106 L196,-106', stroke: '#3D7BE0', 'stroke-width': 6, 'stroke-linecap': 'round' }, bag);
  E('path', { d: 'M-160,-80 L-160,100', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.16 }, bag);
  function hand(parent, flip) {
    const g = G(parent), k = G(g); if (flip) k.setAttribute('transform', 'scale(-1 1)');
    E('rect', { x: -140, y: -36, width: 74, height: 72, rx: 14, fill: '#5B8DEF', stroke: '#9DBCF7', 'stroke-width': 2.5 }, k);
    E('path', { d: 'M-74,-34 Q-74,-46 -60,-46 L14,-46 Q44,-46 44,-16 Q44,14 14,14 L-6,14 Q4,26 -4,38 L-60,38 Q-74,38 -74,24 Z', fill: ball('#E8B48E', '#B9825A'), stroke: '#B9825A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M-30,-46 Q-24,-70 0,-64 Q12,-60 6,-46', fill: '#E8B48E', stroke: '#B9825A', 'stroke-width': 2.5 }, k);
    return g;
  }
  const hL = hand(Eg, false), hR = hand(Eg, true);
  const watch = G(Eg); tr(watch, 960, 240);
  E('circle', { r: 46, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, watch);
  E('rect', { x: -9, y: -64, width: 18, height: 14, rx: 3, fill: C.muted }, watch);
  const wArc = E('path', { d: '', fill: 'rgba(255,228,92,0.35)' }, watch);
  const wHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -32, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 5, fill: C.energy }, watch);
  const wTxt = T(Eg, 960, 326, '2 minutes', { size: 28, weight: 700, anchor: 'middle' });
  const lbMuscle = T(Eg, 600, 630, 'squeeze, like stomach muscles', { size: 28, weight: 600, anchor: 'middle', fill: '#F7B9C8' });
  const mushChip = pill(Eg, 'soupy mush!', { size: 30, stroke: '#E3C894', color: '#F2DDAE' });

  /* ================= update ================= */
  return t => {
    /* ----- A: the cutaway ----- */
    const aA = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('starch') - 0.4, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      rbcs.forEach((e, k) => { attr(e, 'cx', ((t * 150 + k * 165) % 1340) - 70); attr(e, 'cy', CAPY + (k % 3 - 1) * 12); });
      cell.upd(t);
      tr(cellG, 1045, 640, 1 + 0.04 * P(t, mid('absorbed', 0.8), 0.8) * (0.6 + 0.4 * wave(t, 1.6)));
      sparks.forEach((s, k) => { const p = P(t, mid('absorbed', 0.62 + k * 0.06), 0.45, pop); op(s.el, clamp(p * 2)); tr(s.el, s.p[0], s.p[1], Math.max(0.01, p)); s.el.upd(t); });
      op(lbGut, P(t, mid('big', 0.05), 0.5, linear)); op(lbWall, P(t, mid('wall', 0.4), 0.5, linear));
      op(lbBlood, P(t, mid('wall', 0.75), 0.5, linear)); op(lbCell, P(t, mid('absorbed', 0.5), 0.5, linear));
      // chips across the top
      const cl = popIn(chLarge, t, mid('big', 0.42), LX, 160); op(chLarge, clamp(cl * 2) * (1 - P(t, at('absorbed') - 0.3, 0.4, linear)));
      const cb = popIn(chBig, t, mid('wall', 0.3), SXc, 160); op(chBig, clamp(cb * 2) * (1 - P(t, at('digestion') - 0.15, 0.3, linear)));
      digArrow.set(P(t, mid('digestion', 0.02), 0.7)); op(digArrow, P(t, mid('digestion', 0.02), 0.2, linear) * (1 - P(t, at('absorbed') - 0.3, 0.4, linear)));
      op(digLbl, P(t, mid('digestion', 0.05), 0.4, linear) * (1 - P(t, at('absorbed') - 0.3, 0.4, linear)));
      const cs = popIn(chSmall, t, mid('digestion', 0.66), SXc, 160); op(chSmall, clamp(cs * 2) * (1 - P(t, at('absorbed') - 0.3, 0.4, linear)));
      popIn(chAbs, t, mid('absorbed', 0.06), 600, 160);
      popIn(chUse, t, mid('absorbed', 0.66), 520, 662);
      // the chains
      const b = ci => P(t, at('wall') + 0.1 + CH[ci].lag * 0.5, 0.75, easeIn) * (1 - P(t, mid('wall', 0.4), 0.8, easeOut));
      const ripple = k => 0.16 * Math.sin(Math.PI * clamp((t - mid('big', 0.62) - k * 0.09) / 0.45));
      CH.forEach((c, ci) => {
        const bb = b(ci);
        const pos = k => {
          const wr = 8 * (1 - 0.75 * bb) * calm * (1 - 0.6 * P(t, at('digestion'), 0.6, linear));
          return [c.cx + 14 * Math.sin(t * 0.45 + c.ph) * calm + (k - (NU - 1) / 2) * c.sp,
            c.cy + bb * c.D + wr * Math.sin(k * 0.85 + t * 1.7 + c.ph) + 5 * Math.sin(t * 0.6 + c.ph) * calm];
        };
        const P_ = c.units.map((u, k) => {
          const chainP = pos(k);
          const tf = c.snips[Math.min(k, NU - 2)], free = P(t, tf, 1.1, easeOut);
          const m = 1 - P(t, u.t0 - 0.3, 0.3, linear);
          const wig = [Math.sin(t * 1.3 + u.ph) * 6 * calm * m, Math.cos(t * 1.1 + u.ph) * 5 * calm * m];
          let x = lerp(chainP[0], u.sx + wig[0], free), y = lerp(chainP[1], u.sy + wig[1], free);
          let alpha = 1;
          if (t > u.t0) { const q = along(u.path, (t - u.t0) / u.dur); x = q[0]; y = q[1]; alpha = 1 - P(t, u.t0 + u.dur, 0.35, linear); }
          const s = 1 + (free < 0.01 ? ripple(k) : 0);
          tr(u.el, x, y, s, ci === 0 ? (free * 40 + (t > u.t0 ? (t - u.t0) * 90 : 0)) : 0);
          op(u.el, alpha);
          return [x, y];
        });
        c.bonds.forEach((ln, k) => {
          const cut = t >= c.snips[k];
          op(ln, cut ? 0 : 1);
          if (!cut) { attr(ln, 'x1', P_[k][0]); attr(ln, 'y1', P_[k][1]); attr(ln, 'x2', P_[k + 1][0]); attr(ln, 'y2', P_[k + 1][1]); }
        });
        // tag beside the chain's left end
        const tg = P(t, mid('big', ci ? 0.9 : 0.8), 0.4, linear) * (1 - P(t, at('digestion') + 0.4, 0.4, linear));
        op(c.tag, tg); if (tg > 0) { attr(c.tag, 'x', P_[0][0] - c.r - 12); attr(c.tag, 'y', P_[0][1] + 10); }
        // crosses where the chains hit the wall
        const xp = P(t, at('wall') + 0.85 + c.lag * 0.5, 0.35, pop) * (1 - P(t, at('digestion') - 0.1, 0.3, linear));
        op(xs[ci], clamp(xp * 2)); tr(xs[ci], c.cx + (ci ? 40 : -40), WY0 - 2, Math.max(0.01, xp));
        // the enzyme snips bond after bond
        const e0 = c.snips[0] - 0.55, eEnd = c.snips[NU - 2] + 0.25;
        const eIn = P(t, e0, 0.5, easeOut), eOut = P(t, eEnd, 0.6, linear);
        op(c.enz, eIn * (1 - eOut));
        if (eIn > 0 && eOut < 1) {
          let k = 0; while (k < NU - 2 && t > c.snips[k] + 0.12) k++;
          const bpos = j => { const a = pos(j), z = pos(j + 1); return [(a[0] + z[0]) / 2, (a[1] + z[1]) / 2]; };
          let bx, by;
          if (k === 0 || t <= c.snips[k - 1] + 0.12) { [bx, by] = bpos(k); }
          else { const a = bpos(k - 1), z = bpos(k), f = ease(clamp((t - c.snips[k - 1] - 0.12) / (c.snips[k] - c.snips[k - 1] - 0.18))); bx = lerp(a[0], z[0], f); by = lerp(a[1], z[1], f); }
          if (t > eEnd) { const [ax, ay] = bpos(NU - 2); bx = ax + (t - eEnd) * 120; by = ay - (t - eEnd) * 80; }
          const nudge = 6 * Math.sin(Math.PI * clamp((t - c.snips[k]) / 0.2 + 1));
          tr(c.enz, bx, by - c.enz.top - 3 - (t < e0 + 0.5 ? (1 - eIn) * 60 : 0) - nudge);
        }
        let last = -1; for (let k = 0; k < NU - 1; k++) if (t >= c.snips[k]) last = k;
        if (last >= 0) { const pa = pos(last), pz = pos(last + 1); flashAt(c.flash, t, c.snips[last], (pa[0] + pz[0]) / 2, (pa[1] + pz[1]) / 2); }
        else op(c.flash, 0);
      });
    }

    /* ----- B: the three rows ----- */
    const aB = win(t, at('starch') - 0.3, at('mech') - 0.1, 0.4);
    op(B, aB);
    if (aB > 0) {
      ['starch', 'protein', 'fat'].forEach((id, i) => {
        const r = rows[i];
        const pl = P(t, at(id) - 0.1, 0.45, pop);
        op(r.left, clamp(pl * 2)); tr(r.left, LX0 * (1 - Math.max(0.01, 0.85 + 0.15 * pl)), RY[i] * (1 - Math.max(0.01, 0.85 + 0.15 * pl)), Math.max(0.01, 0.85 + 0.15 * pl));
        op(r.lL, P(t, at(id) + 0.1, 0.4, linear));
        r.arw.set(P(t, mid(id, 0.22), 0.5)); op(r.arw, P(t, mid(id, 0.22), 0.15, linear));
        const t0 = i === 2 ? mid(id, 0.42) : mid(id, i === 0 ? 0.5 : 0.42);
        r.prods.forEach((q, k) => {
          const st = i === 2 && k === 3 ? mid(id, 0.76) : t0 + k * 0.09;
          const p = P(t, st, 0.5, easeOut);
          op(q.el, clamp(p * 3));
          tr(q.el, lerp(AR[1] - 10, q.x, p), lerp(RY[i], q.y, p), Math.max(0.01, 0.5 + 0.5 * p), q.r * p);
        });
        if (i < 2) op(r.lR[0], P(t, mid(id, i === 0 ? 0.72 : 0.62), 0.4, linear));
        else { op(r.lR[0], P(t, mid(id, 0.5), 0.4, linear)); op(r.lR[1], P(t, mid(id, 0.76), 0.3, linear)); op(r.lR[2], P(t, mid(id, 0.8), 0.4, linear)); }
      });
    }

    /* ----- C: mechanical and chemical ----- */
    const aC = win(t, at('mech') - 0.1, at('area') - 0.1, 0.4);
    op(Cg, aC);
    if (aC > 0) {
      const pL = P(t, at('mech'), 0.5, pop), pR = P(t, mid('mech', 0.08), 0.5, pop);
      op(panL, clamp(pL * 2)); op(panR, clamp(pR * 2) * (0.45 + 0.55 * P(t, at('chem') - 0.2, 0.4, linear)));
      op(subL, P(t, mid('mech', 0.44), 0.5, linear)); op(subR, P(t, mid('chem', 0.3), 0.5, linear));
      // teeth chomp four times; each chomp doubles the pieces
      const CH_T = [0.44, 0.54, 0.64, 0.74].map(f => mid('mech', f));
      let gen = 0; CH_T.forEach(c => { if (t >= c + 0.12) gen++; });
      const jawOn = P(t, mid('mech', 0.2), 0.4, linear) * (1 - P(t, mid('mech', 0.83), 0.4, linear));
      op(jaw, jawOn);
      let close = 0; CH_T.forEach(c => { close = Math.max(close, Math.sin(Math.PI * clamp((t - c + 0.18) / 0.36))); });
      tr(upper, MCX, lerp(304, MCY - 52, close)); tr(lower, MCX, lerp(592, MCY + 52, close));
      const churn = P(t, mid('mech', 0.84), 0.5, linear);
      op(stomach, churn); op(gullet, churn);
      if (churn > 0) {
        const sp = STP.map((p, i) => [MCX + 10 + p[0] * (1 + 0.045 * Math.sin(t * 5 * calm + i)), MCY + 18 + p[1] * (1 + 0.045 * Math.cos(t * 5 * calm + i * 1.3))]);
        stomach.setAttribute('d', closedPath(sp));
        gullet.setAttribute('d', `M${(sp[0][0] - 2).toFixed(1)},${(sp[0][1] - 40).toFixed(1)} L${(sp[0][0] + 4).toFixed(1)},${(sp[0][1] + 4).toFixed(1)} M${(sp[1][0] + 2).toFixed(1)},${(sp[1][1] - 40).toFixed(1)} L${(sp[1][0] - 2).toFixed(1)},${(sp[1][1] + 4).toFixed(1)}`);
      }
      GEN.forEach((list, gi) => {
        const on = gi === gen ? 1 : 0;
        const born = gi === 0 ? P(t, mid('mech', 0.18), 0.4, linear) : P(t, CH_T[gi - 1] + 0.12, 0.2, linear);
        list.forEach((q, k) => {
          op(q.g, on * born);
          if (on) {
            const sp = gi === 0 ? 0 : P(t, CH_T[gi - 1] + 0.12, 0.5, easeOut);
            let x = q.x * (0.7 + 0.3 * sp), y = q.y * (0.7 + 0.3 * sp), r = q.r;
            if (churn > 0) { const a = churn * (t - mid('mech', 0.84)) * 1.6 * calm + k; const rr = Math.hypot(q.x, q.y); x = lerp(x, -20 + Math.cos(a) * rr * 0.92, churn); y = lerp(y, 44 + Math.sin(a) * rr * 0.58, churn); r += churn * (t * 60 * calm + k * 30); }
            tr(q.g, MCX + x, MCY + y, 1, r);
          }
        });
      });
      op(lbTeeth, P(t, mid('mech', 0.66), 0.4, linear) * (1 - P(t, mid('mech', 0.84), 0.3, linear)));
      op(lbChurn, P(t, mid('mech', 0.86), 0.4, linear));
      // chemical: zoom into a crumb; an enzyme snips two bonds
      const zIn_ = P(t, at('chem') + 0.1, 0.6, linear);
      op(zoomG, zIn_);
      const S1 = mid('chem', 0.6), S2 = mid('chem', 0.86);
      const sep1 = P(t, S1, 0.8, easeOut), sep2 = P(t, S2, 0.8, easeOut);
      const UX = k => ZX - 17 + (k - 2.5) * 36 + (k >= 3 ? 22 * sep1 : -10 * sep1) + (k >= 5 ? 22 * sep2 : 0);
      const UY = k => ZY + 6 * Math.sin(k * 1.2 + t * 1.5) * calm + (k >= 3 ? 14 * sep1 : -8 * sep1) + (k >= 5 ? 16 * sep2 : 0);
      zUnits.forEach((u, k) => tr(u, UX(k), UY(k)));
      zBonds.forEach((ln, k) => { const cut = (k === 2 && t >= S1) || (k === 4 && t >= S2); op(ln, cut ? 0 : 1); attr(ln, 'x1', UX(k)); attr(ln, 'y1', UY(k)); attr(ln, 'x2', UX(k + 1)); attr(ln, 'y2', UY(k + 1)); });
      const e1 = P(t, mid('chem', 0.35), 0.7, easeOut), e2 = P(t, S1 + 0.25, 0.7);
      const bx = lerp(lerp(ZX - 20, (UX(2) + UX(3)) / 2, e1), (UX(4) + UX(5)) / 2, e2), by = lerp(ZY + 170, (UY(2) + UY(3)) / 2, e1);
      tr(zEnz, bx, by - zEnz.top - 2);
      if (t >= S2) flashAt(zFlash, t, S2, (UX(4) + UX(5)) / 2, (UY(4) + UY(5)) / 2); else flashAt(zFlash, t, S1, (UX(2) + UX(3)) / 2, (UY(2) + UY(3)) / 2);
      op(zBondLbl, P(t, mid('chem', 0.5), 0.3, linear) * (1 - P(t, S1, 0.25, linear)));
      // the label rides under the enzyme but stays inside the lens
      const ly = by - zEnz.top + 54, hw = Math.sqrt(Math.max(0, (ZR - 8) * (ZR - 8) - (ly - ZY) * (ly - ZY)));
      op(zEnzLbl, P(t, mid('chem', 0.4), 0.4, linear) * zIn_); attr(zEnzLbl, 'x', clamp(bx, ZX - hw + 48, ZX + hw - 48)); attr(zEnzLbl, 'y', ly);
    }

    /* ----- D: surface area ----- */
    const aD = win(t, at('area') - 0.1, at('bag') - 0.1, 0.4);
    op(Dg, aD);
    if (aD > 0) {
      const app = P(t, at('area'), 0.5, pop), split = P(t, mid('area', 0.12), 0.9, easeOut);
      op(bigCube, clamp(app * 2) * (split > 0 ? 0 : 1)); tr(bigCube, CXc, CYc, Math.max(0.01, 0.85 + 0.15 * app));
      const glowOn = P(t, mid('area', 0.4), 0.5, linear);
      small.forEach(c => {
        op(c.g, split > 0 ? 1 : 0);
        const k = 1 + 0.42 * split, e = EB / 2, X = c.x * e / 2 * k, Y = c.y * e / 2 * k, Z = c.z * e / 2 * k;
        tr(c.g, CXc + (X - Y) * ISO, CYc + (X + Y) * 0.5 - Z + (c.z < 0 ? 0 : 0));
        c.f.forEach(f => { f.setAttribute('stroke', glowOn > 0 ? mix('#8A5A22', '#FFE45C', glowOn) : '#8A5A22'); f.setAttribute('stroke-width', (3 + 2 * glowOn).toFixed(1)); });
      });
      saMeter.set(lerp(0.42, 0.84, P(t, mid('area', 0.44), 0.9, easeOut)) * P(t, at('area') + 0.2, 0.5, linear));
      op(x2, P(t, mid('area', 0.56), 0.4, linear));
      op(lbOne, P(t, at('area') + 0.1, 0.4, linear) * (1 - P(t, mid('area', 0.12), 0.3, linear)));
      op(lbEight, P(t, mid('area', 0.2), 0.4, linear));
      dEnz.forEach((d, k) => {
        const p = P(t, mid('area', 0.62 + k * 0.05), 0.7, easeOut);
        op(d.g, clamp(p * 3));
        const tx = CXc + d.p[0] * 0.62, ty = CYc + d.p[1] * 0.62;
        tr(d.g, lerp(CXc + d.p[0] * 2.2, tx, p), lerp(CYc + d.p[1] * 1.8, ty, p) + Math.sin(t * 3 + k) * 2 * calm, 1, Math.atan2(CYc - ty, CXc - tx) * 180 / Math.PI + 90);
      });
      op(dNote, P(t, mid('area', 0.62), 0.5, linear));
    }

    /* ----- E: the bread bag ----- */
    const aE = P(t, at('bag') - 0.1, 0.4, linear);
    op(Eg, aE);
    if (aE > 0) {
      popIn(tryChip, t, at('bag'), 600, 150);
      const bIn = P(t, mid('bag', 0.14), 0.5, easeOut);
      const sqOn = P(t, mid('bag', 0.22), 0.4, linear) * (1 - P(t, mid('bag', 0.84), 0.5, linear));
      const sq = sqOn * wave(t - mid('bag', 0.22), 1.1) * (S.reduce ? 0.5 : 1);
      bag.setAttribute('transform', `translate(${BXc} ${BYc + (1 - bIn) * 30}) scale(${(1 - 0.09 * sq).toFixed(3)} ${(1 + 0.05 * sq).toFixed(3)})`);
      op(bag, bIn);
      const m = P(t, mid('bag', 0.26), (mid('bag', 0.86) - mid('bag', 0.26)), linear);
      bits.forEach((b, k) => { const s = lerp(1, 0.25, clamp(m * 1.25 - k * 0.03)); op(b.g, 1 - P(m, 0.7, 0.3, linear)); tr(b.g, b.x * (1 - 0.15 * sq), b.y + Math.sin(t * 2.2 + b.ph) * 6 * calm, s, b.r + Math.sin(t + b.ph) * 10 * calm); });
      attr(mush, 'opacity', 0.85 * P(m, 0.25, 0.75, linear)); attr(water, 'opacity', 0.4 * (1 - 0.6 * m));
      op(flecks, P(m, 0.3, 0.5, linear));
      const hIn = P(t, mid('bag', 0.18), 0.4, linear) * (1 - P(t, mid('bag', 0.86), 0.5, linear));
      op(hL, hIn); op(hR, hIn);
      tr(hL, BXc - 262 + 34 * sq, BYc + 10); tr(hR, BXc + 262 - 34 * sq, BYc + 10);
      const wIn = P(t, mid('bag', 0.48), 0.4, linear); op(watch, wIn); op(wTxt, wIn);
      const sweep = P(t, mid('bag', 0.5), mid('bag', 0.9) - mid('bag', 0.5), linear), a = sweep * TAU;
      attr(wHand, 'transform', `rotate(${(sweep * 360).toFixed(1)})`);
      wArc.setAttribute('d', sweep > 0.001 ? `M0,0 L0,-36 A36,36 0 ${sweep > 0.5 ? 1 : 0} 1 ${(Math.sin(a) * 36).toFixed(1)},${(-Math.cos(a) * 36).toFixed(1)} Z` : '');
      op(lbMuscle, P(t, mid('bag', 0.62), 0.4, linear) * (1 - P(t, mid('bag', 0.82), 0.3, linear)));
      popIn(mushChip, t, mid('bag', 0.84), 600, 640);
    }
  };
});

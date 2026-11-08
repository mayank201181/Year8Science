/* Big idea: photo + synthesis = building with light -> plants are producers -> food does not come from the
   soil, only water and a few minerals (cut-away pot) -> light, carbon dioxide and water reach a leaf -> zoom
   in: chlorophyll captures the light, CO2 and water join into glucose, oxygen floats out -> the glucose
   "battery" charges with light energy -> zoom out: respiration spends it on new growth -> in the dark the
   plant droops and greys. */
scene('bigidea', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const D2R = Math.PI / 180;
  const bez = (q, u) => { const v = 1 - u; return [v * v * v * q[0][0] + 3 * v * v * u * q[1][0] + 3 * v * u * u * q[2][0] + u * u * u * q[3][0], v * v * v * q[0][1] + 3 * v * v * u * q[1][1] + 3 * v * u * u * q[2][1] + u * u * u * q[3][1]]; };
  const qpt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  const along = (pts, u) => {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  };
  const fmt = p => p[0].toFixed(2) + ',' + p[1].toFixed(2);
  const DROP = 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z';

  /* ---------- shared art: the potted plant (as in the intro), with a cut-away pot, droop and greying ---------- */
  const LEAVES = [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56]];
  const STEM_LO = [[0, -8], [-4.95, -52.2], [-1.43, -100.2], [1.08, -148.7]];     // the intro's stem, split at its middle
  const STEM_HI = [[1.08, -148.7], [3.13, -188.4], [4.5, -228.4], [0, -268]];
  const PIV = STEM_LO[3];
  const LEAFD = 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z';
  const BODY = 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z';
  const PL = [870, 478, 0.95];
  const pS = p => [PL[0] + PL[2] * p[0], PL[1] + PL[2] * p[1]];
  function leafUnit(parent, s) {
    const g = G(parent);
    leaf(g, s);
    const grey = G(g); tr(grey, 0, 0, s);
    E('path', { d: LEAFD, fill: ball('#A39C7A', '#5F5A44'), stroke: '#6F6A54', 'stroke-width': 3 }, grey);
    E('path', { d: 'M-10,0 L200,0', stroke: '#CFC8A8', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }, grey);
    op(grey, 0);
    return { g, grey };
  }

  /* ---------- sky: darkness, stars and moon for the last line ---------- */
  const darkSky = E('rect', { width: W, height: H, fill: '#020814', opacity: 0 }, root);
  const nightG = G(root), stars = [], str = rng(23);
  for (let i = 0; i < 18; i++) {
    let x = 60 + str() * 1080; const y = 120 + str() * 230, s = 2 + str() * 3;
    if (x < 600 && y < 140) x += 600;
    stars.push({ el: E('path', { d: `M${x.toFixed(1)},${(y - s * 2).toFixed(1)} L${(x + s * 0.45).toFixed(1)},${(y - s * 0.45).toFixed(1)} L${(x + s * 2).toFixed(1)},${y.toFixed(1)} L${(x + s * 0.45).toFixed(1)},${(y + s * 0.45).toFixed(1)} L${x.toFixed(1)},${(y + s * 2).toFixed(1)} L${(x - s * 0.45).toFixed(1)},${(y + s * 0.45).toFixed(1)} L${(x - s * 2).toFixed(1)},${y.toFixed(1)} L${(x - s * 0.45).toFixed(1)},${(y - s * 0.45).toFixed(1)} Z`, fill: '#EAF2FF' }, nightG), ph: str() });
  }
  const moon = G(nightG); tr(moon, 648, 150);
  E('circle', { r: 76, fill: glow('#BFD3FF') }, moon);
  E('path', { d: 'M0,-34 A34,34 0 1 0 0,34 A23,34 0 0 1 0,-34 Z', fill: '#F3F0D8', stroke: '#FFFBE6', 'stroke-width': 2 }, moon);

  /* ---------- the sun and its beam (stage space, shared by the wide and the zoomed views) ---------- */
  const SUN = [1090, 118];
  const sunBig = sun(root, 44);
  const beamG = G(root);
  const beamWide = E('path', { fill: C.energy, opacity: 0.15 }, beamG);
  const beamCore = E('path', { fill: C.energyLt, opacity: 0.2 }, beamG);
  const beamDash = [0, 1, 2, 3, 4].map(() => E('line', { stroke: C.energyLt, 'stroke-width': 4, 'stroke-linecap': 'round' }, beamG));

  /* ---------- the world: plant in its pot ---------- */
  const worldG = G(root);
  const plantG = G(worldG); tr(plantG, PL[0], PL[1], PL[2]);
  const inner = G(plantG);
  E('path', { d: 'M-110,-6 L110,-6 L110,24 L100,24 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 L-100,24 L-110,24 Z', fill: linGrad('#7A5538', '#3E2818', true) }, inner);
  ['M0,-4 C2,40 -6,90 -2,150', 'M-1,20 C-20,40 -40,60 -62,92', 'M1,30 C22,52 44,70 66,104', 'M-2,70 C-18,92 -30,118 -40,150', 'M-1,96 C14,116 26,138 34,160', 'M-40,58 C-56,66 -70,70 -84,72', 'M40,62 C54,72 64,82 76,84']
    .forEach(d => E('path', { d, fill: 'none', stroke: '#EAD7B7', 'stroke-width': 5, 'stroke-linecap': 'round' }, inner));
  const RT = [[-2, 146], [-62, 92], [66, 104], [-40, 148], [34, 158], [-84, 72], [76, 84], [-30, 50]];
  const dr = rng(19);
  const inPot = (x, y) => { y = clamp(y, 30, 162); const hw = 100 - 20 * (y - 22) / 142 - 14; return [clamp(x, -hw, hw), y]; };
  const drops = []; for (let i = 0; i < 8; i++) { const tg = RT[i % RT.length]; drops.push({ el: E('path', { d: DROP, fill: C.water, stroke: '#BDEBFA', 'stroke-width': 1.5 }, inner), a: inPot(tg[0] + (dr() - 0.5) * 70, tg[1] + 26 + dr() * 20), b: inPot(tg[0], tg[1]), ph: dr() }); }
  const specks = []; for (let i = 0; i < 5; i++) { const tg = RT[(i * 3 + 1) % RT.length]; specks.push({ el: E('circle', { r: 5, fill: '#D9BEFF', stroke: '#9C77DD', 'stroke-width': 1.5 }, inner), a: inPot(tg[0] + (dr() - 0.5) * 80, tg[1] + 18 + dr() * 20), b: inPot(tg[0], tg[1]), ph: dr() }); }
  const potFront = G(plantG);
  E('path', { d: BODY, fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, potFront);
  E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: ball('#E3955E', '#A9592A'), stroke: '#F0B48A', 'stroke-width': 3 }, potFront);
  const potLine = G(plantG);
  E('path', { d: BODY, fill: 'rgba(217,130,74,0.10)', stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, potLine);
  E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: 'rgba(227,149,94,0.22)', stroke: '#F0B48A', 'stroke-width': 3 }, potLine);
  E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, plantG);
  E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, plantG);
  const stemPath = q => `M${fmt(q[0])} C${fmt(q[1])} ${fmt(q[2])} ${fmt(q[3])}`;
  E('path', { d: stemPath(STEM_LO), fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, plantG);
  const greyLo = E('path', { d: stemPath(STEM_LO), fill: 'none', stroke: '#8D8768', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0 }, plantG);
  const units = [];
  [0, 1].forEach(i => units.push(Object.assign(leafUnit(plantG, LEAVES[i][3]), { i })));
  const upperG = G(plantG);
  const hiD = stemPath(STEM_HI) + ' C-4,-298 0,-318 0,-330';
  E('path', { d: hiD, fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, upperG);
  const greyHi = E('path', { d: hiD, fill: 'none', stroke: '#8D8768', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0 }, upperG);
  [2, 3].forEach(i => units.push(Object.assign(leafUnit(upperG, LEAVES[i][3]), { i })));
  const ext = E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 11, 'stroke-linecap': 'round' }, upperG);
  const newGlow = E('ellipse', { cx: 30, cy: -370, rx: 70, ry: 46, fill: glow(C.chloro) }, upperG);
  const newLeaf = leafUnit(upperG, 0.52);
  const tipG = G(upperG);
  const tipL = [leafUnit(tipG, 0.2), leafUnit(tipG, 0.2)];
  const L4c = pS([LEAVES[3][0] + Math.cos(LEAVES[3][2] * D2R) * 205 * LEAVES[3][3] * 0.5, LEAVES[3][1] + Math.sin(LEAVES[3][2] * D2R) * 205 * LEAVES[3][3] * 0.5]);
  const L4b = pS([LEAVES[3][0], LEAVES[3][1]]);

  /* ---------- the zoom: the world maps leaf 4 onto a big leaf ---------- */
  const BIG = { base: [300, 545], rot: -14, s: 2.9 };
  const K1 = BIG.s / (LEAVES[3][3] * PL[2]), DROT = BIG.rot - LEAVES[3][2];
  const zoomT = z => { const k = Math.exp(Math.log(K1) * z), F = [lerp(L4b[0], BIG.base[0], z), lerp(L4b[1], BIG.base[1], z)]; return { k, F, r: DROT * z }; };
  const W2S = (p, z) => { const { k, F, r } = zoomT(z), c = Math.cos(r * D2R), s = Math.sin(r * D2R), dx = (p[0] - L4b[0]) * k, dy = (p[1] - L4b[1]) * k; return [F[0] + c * dx - s * dy, F[1] + s * dx + c * dy]; };
  const bd = [Math.cos(BIG.rot * D2R), Math.sin(BIG.rot * D2R)], bn = [-bd[1], bd[0]];
  const bP = (a, b) => [BIG.base[0] + a * bd[0] + b * bn[0], BIG.base[1] + a * bd[1] + b * bn[1]];
  const MIDA = 205 * BIG.s * 0.5, GC = bP(MIDA, 0);                                   // the leaf's centre: glucose forms here
  const bigG = G(root);
  const bigGlow = E('ellipse', { rx: 380, ry: 210, fill: glow(C.chloro), transform: `translate(${GC[0].toFixed(1)} ${GC[1].toFixed(1)}) rotate(${BIG.rot})` }, bigG);
  E('path', { d: `M${BIG.base[0] + 6},${BIG.base[1] + 2} Q170,600 -40,660`, fill: 'none', stroke: C.stem, 'stroke-width': 30, 'stroke-linecap': 'round' }, bigG);
  const bigLeaf = leaf(bigG, BIG.s); tr(bigLeaf, BIG.base[0], BIG.base[1], 1, BIG.rot);
  const glints = [], gr = rng(5);
  for (let i = 0; i < 14; i++) { const a = 90 + gr() * 420, w = 105 * Math.sin(Math.PI * a / (205 * BIG.s)), b = (gr() - 0.5) * 2 * w; const p = bP(a, b); glints.push({ el: E('path', { d: 'M0,-9 L2.5,-2.5 L9,0 L2.5,2.5 L0,9 L-2.5,2.5 L-9,0 L-2.5,-2.5 Z', fill: '#DFFFE8' }, bigG), p, ph: gr() }); }

  /* ---------- molecules inside the zoomed leaf ---------- */
  const molG = G(root);
  const CO2S = [[-150, 72], [-72, 96], [8, 104], [88, 96], [166, 70], [-24, 54]].map((o, k) => ({ g: molCO2(molG, 13), pre: bP(MIDA + o[0], o[1]), from: [380 + k * 78, 790 + (k % 2) * 30] }));
  const H2OS = [[-176, -58], [-100, -86], [-20, -98], [62, -92], [140, -70], [-60, -40]].map((o, k) => { const pre = bP(MIDA + o[0], o[1]); return { g: molH2O(molG, 14), pre, path: [[-50, 676], [150, 588], bP(30, 0), bP(Math.max(60, MIDA + o[0] - 60), o[1] * 0.3), pre] }; });
  const flash = E('circle', { r: 120, fill: glow('#FFF3A0') }, molG);
  const gluG = G(root); molGlucose(gluG, 46);
  const O2S = [0, 1, 2, 3, 4, 5].map(k => ({ g: molO2(root, 15), to: [380 + k * 52, 178 + (k % 3) * 34], c: [GC[0] - 40 - k * 20, GC[1] - 220] }));
  const batt = glucoseBattery(root, 70);
  const flyG = G(root);
  const fly = [0, 1, 2, 3, 4, 5, 6, 7].map(k => spark(flyG, 13, { seed: k + 2 }));

  /* ---------- word panel: photo | synthesis ---------- */
  const nameG = G(root);
  const WS = 78, WY = 300;
  const wFull = textWidth('photosynthesis', WS, FD, 700), wPhoto = textWidth('photo', WS, FD, 700), wSyn = textWidth('synthesis', WS, FD, 700);
  const X0 = 600 - wFull / 2, PX = 316, SX = 846;
  const tPhoto = T(nameG, X0, WY, 'photo', { size: WS, weight: 700, fill: C.energy });
  const tSyn = T(nameG, X0 + wPhoto, WY, 'synthesis', { size: WS, weight: 700, fill: C.glucoseLt });
  const means = T(nameG, 600, 176, 'means “**building with light**”', { size: 38, weight: 500, anchor: 'middle', fill: C.muted, boldFill: C.ink });
  const divider = E('line', { x1: 590, y1: 228, x2: 590, y2: 548, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '2 12' }, nameG);
  const eqLight = T(nameG, PX, 548, '= light', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const eqMake = T(nameG, SX, 548, '= making', { size: 44, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const bricks = [[-58, 0], [0, 0], [58, 0], [-29, -32], [29, -32], [0, -64]].map(([x, y]) => {
    const g = G(nameG);
    E('rect', { x: -27, y: -14, width: 54, height: 28, rx: 4, fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 2.5 }, g);
    return { g, x: SX + x, y: 446 + y };
  });
  const SUNP = [PX, 420];                                   // the small sun under "photo", which flies up to become the sky's sun

  /* ---------- producers: no knife and fork, makes its own food ---------- */
  const prodG = G(root);
  const producer = chip(prodG, 'PRODUCER', { size: 28, fill: C.plantDk, stroke: '#9EF0B4', color: '#FFFFFF' });
  const cutG = G(prodG); tr(cutG, 330, 330);
  E('circle', { r: 52, fill: '#E9F2F7', stroke: '#B8CAD6', 'stroke-width': 3 }, cutG);
  E('circle', { r: 36, fill: 'none', stroke: '#C9D8E2', 'stroke-width': 3 }, cutG);
  { const f = G(cutG); tr(f, -86, 0);
    E('rect', { x: -4, y: -10, width: 8, height: 66, rx: 4, fill: '#C9D6DE' }, f);
    E('path', { d: 'M-12,-60 L-12,-26 Q-12,-10 0,-10 Q12,-10 12,-26 L12,-60', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, f);
    E('path', { d: 'M-4,-60 L-4,-26 M4,-60 L4,-26', stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, f);
    const k = G(cutG); tr(k, 86, 0);
    E('path', { d: 'M-5,-62 Q11,-50 9,-8 L-5,-8 Z', fill: '#E4ECF2', stroke: '#A9B8C4', 'stroke-width': 2 }, k);
    E('rect', { x: -6, y: -10, width: 12, height: 66, rx: 5, fill: '#8EA3B5' }, k); }
  const cutX = cross(prodG, 46); tr(cutX, 330, 330);
  const ownG = G(prodG);
  const ownChip = chip(ownG, 'makes its own food', { size: 32, fill: C.card2, stroke: C.good });
  tr(ownChip, 354, 486);
  const ownTick = tick(ownG, 20); tr(ownTick, 354 - ownChip.w / 2 - 34, 486);

  /* ---------- soil: not food, only water and a few minerals ---------- */
  const soilG = G(root);
  const foodC = chip(soilG, 'food?', { size: 30, fill: 'rgba(20,54,70,0.9)', stroke: C.faint }); tr(foodC, 668, 532);
  const foodX = cross(soilG, 22); tr(foodX, 668 - foodC.w / 2 - 32, 532);
  const dropSt = pS([-44, 118]), speckSt = pS([30, 150]);
  const lbWater = labelLine(soilG, 712, 604, dropSt[0], dropSt[1], 'water', { size: 32, fill: C.water, line: C.water, weight: 700 });
  const lbMin = labelLine(soilG, 712, 660, speckSt[0], speckSt[1], 'a few minerals', { size: 30, fill: '#D9BEFF', line: '#B898EE' });

  /* ---------- three inputs ---------- */
  const threeG = G(root);
  const inCO2 = [0, 1, 2].map(() => molCO2(threeG, 12));
  const inH2O = [0, 1, 2].map(() => molH2O(threeG, 12));
  const co2Path = [[250, 322], [470, 272], [700, 200], [800, 193], [850, 203], [L4c[0] + 4, L4c[1] + 4]];
  const stemUp = []; for (let i = 0; i <= 8; i++) stemUp.push(pS(bez(STEM_LO, i / 8))); for (let i = 1; i <= 8; i++) stemUp.push(pS(bez(STEM_HI, i / 8 * 0.98)));
  stemUp.push([L4c[0] - 10, L4c[1] + 6]);
  const lbLight = T(threeG, SUN[0], 236, 'light', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const lbAir = T(threeG, 300, 232, '**carbon dioxide** (air)', { size: 30, weight: 500, anchor: 'middle', fill: C.muted, boldFill: C.co2 });
  const lbSoil = labelLine(threeG, 742, 446, pS([-2, -36])[0] - 7, pS([-2, -36])[1], 'water (soil)', { size: 30, fill: C.water, line: C.water });

  /* ---------- labels in the zoomed leaf ---------- */
  const zLab = G(root);
  const lbChl = T(zLab, 600, 694, '**chlorophyll** captures the light energy', { size: 34, weight: 500, anchor: 'middle', boldFill: C.chloro });
  const lbGlu = T(zLab, 600, 694, '**glucose** (a sugar)', { size: 36, weight: 500, anchor: 'middle', boldFill: C.glucose });
  const lbO2 = T(zLab, 560, 136, '**oxygen**: a waste product', { size: 34, weight: 500, anchor: 'middle', boldFill: C.oxygen });
  const enG = G(root);
  const chLight = chip(enG, 'light energy', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
  const chChem = chip(enG, 'chemical energy', { size: 30, fill: C.card2, stroke: C.glucose, color: C.glucose });
  const EW = chLight.w + chChem.w + 110, EX = 600 - EW / 2;
  tr(chLight, EX + chLight.w / 2, 690); tr(chChem, EX + EW - chChem.w / 2, 690);
  const enArr = arrow(enG, EX + chLight.w + 18, 690, EX + chLight.w + 92, 690, { color: C.ink, width: 6 });

  /* ---------- later: respiration spends it on growth ---------- */
  const lateG = G(root);
  const respC = chip(lateG, 'respiration releases it', { size: 32, fill: C.card2, stroke: C.energy });
  tr(respC, 330, 300);
  const powT = T(lateG, 330, 372, 'to power growth and life', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });
  const packets = [0, 1, 2, 3, 4, 5].map(k => { const g = G(root); E('circle', { r: 30, fill: glow(C.glucose) }, g); molGlucose(g, 14); return { g, sp: spark(root, 16, { seed: 7 + k }), up: k % 2 === 0 }; });
  const stemDown = []; for (let i = 0; i <= 8; i++) stemDown.push(pS(bez(STEM_HI, 1 - i / 8))); for (let i = 1; i <= 8; i++) stemDown.push(pS(bez(STEM_LO, 1 - i / 8)));
  const pathUp = [L4c, L4b, pS([1, -300]), pS([0, -332])];
  const rootEnds = [pS([-62, 92]), pS([-2, 146]), pS([66, 104])];

  /* ---------- dark: weeks without light ---------- */
  const darkG = G(root);
  const weekC = chip(darkG, 'week 3 in the dark', { size: 30, fill: C.card2, stroke: '#7E8FB8' });
  tr(weekC, 330, 190);
  const airMols = [[220, 300], [330, 270], [430, 315]].map(p => ({ g: molCO2(darkG, 12), p }));
  const airOk = G(darkG); T(airOk, 330, 372, 'air', { size: 30, weight: 600, anchor: 'middle', fill: C.co2 }); tr(tick(airOk, 13), 380, 360);
  const waterOk = G(darkG); T(waterOk, 712, 604, 'water', { size: 32, weight: 700, anchor: 'end', fill: C.water }); tr(tick(waterOk, 13), 740, 592);
  const noFood = chip(darkG, 'no light → no new food', { size: 32, fill: C.card2, stroke: C.bad });
  tr(noFood, 330, 520);

  return t => {
    const tt = t * calm;
    const z = P(t, at('chloro') - 0.3, 1.3, ease) * (1 - P(t, at('later') - 0.3, 1.2, ease));
    const { k: zk, F: zF, r: zr } = zoomT(z);
    const nightP = P(t, mid('dark', 0.04), 2.2, ease);
    const droop = P(t, mid('dark', 0.2), Math.max(1.5, mid('dark', 0.95) - mid('dark', 0.2)), ease);

    /* sky */
    op(darkSky, 0.62 * nightP); op(nightG, nightP);
    if (nightP > 0) stars.forEach(s => op(s.el, 0.35 + 0.55 * wave(t * calm, 2.4, s.ph)));

    /* --- word panel --- */
    const nameA = 1 - P(t, at('producers') - 0.3, 0.4, linear);
    op(nameG, nameA);
    if (nameA > 0) {
      const wp = P(t, at('name') - 0.05, 0.6, pop), sp = P(t, mid('name', 0.47), 0.8, ease);
      op(tPhoto, clamp(wp * 2)); op(tSyn, clamp(wp * 2));
      attr(tPhoto, 'x', lerp(X0, PX - wPhoto / 2, sp)); attr(tSyn, 'x', lerp(X0 + wPhoto, SX - wSyn / 2, sp));
      nameG.setAttribute('transform', `translate(600 ${WY}) scale(${(0.86 + 0.14 * wp).toFixed(3)}) translate(-600 ${-WY})`);
      op(means, P(t, mid('name', 0.2), 0.5, linear));
      op(divider, P(t, mid('name', 0.5), 0.5, linear));
      op(eqLight, P(t, mid('name', 0.62), 0.45, linear));
      bricks.forEach((b, i) => { const p = P(t, mid('name', 0.66 + i * 0.03), 0.4, easeOut); op(b.g, clamp(p * 3)); tr(b.g, b.x, b.y - (1 - p) * 70); });
      op(eqMake, P(t, mid('name', 0.8), 0.45, linear));
    }

    /* --- sun: small under "photo", then flies to the sky, sets in the dark --- */
    const sunFly = P(t, at('producers') - 0.3, 1.0, ease);
    const sunIn = P(t, mid('name', 0.52), 0.5, pop);
    const setP = P(t, mid('dark', 0.02), 2.2, ease);
    op(sunBig, clamp(sunIn * 2) * (1 - setP));
    tr(sunBig, lerp(SUNP[0], SUN[0], sunFly), lerp(SUNP[1], SUN[1], sunFly) + setP * 300, Math.max(0.01, lerp(0.78, 1, sunFly) * (sunFly > 0 ? 1 : sunIn)));
    sunBig.upd(tt);

    /* --- the world (plant), zoom and droop --- */
    const plantIn = P(t, at('producers') - 0.05, 0.7, pop);
    const worldA = clamp(plantIn * 2) * (1 - P(z, 0.5, 0.42, linear));
    op(worldG, worldA);
    worldG.setAttribute('transform', `translate(${zF[0].toFixed(2)} ${zF[1].toFixed(2)}) rotate(${zr.toFixed(2)}) scale(${zk.toFixed(4)}) translate(${-L4b[0]} ${-L4b[1]}) translate(${PL[0]} ${PL[1] + (1 - clamp(plantIn)) * 40}) scale(${(0.9 + 0.1 * clamp(plantIn)).toFixed(4)}) translate(${-PL[0]} ${-PL[1]})`);
    const cut = P(t, at('soil') - 0.1, 0.8, linear);
    op(potFront, 1 - 0.88 * cut); op(potLine, cut);
    const dripOn = P(t, mid('soil', 0.45), 0.6, linear);
    drops.forEach(d => { const u = ((t - mid('soil', 0.45)) * 0.38 * calm + d.ph) % 1, uu = u < 0 ? u + 1 : u, p = ease(uu); tr(d.el, lerp(d.a[0], d.b[0], p), lerp(d.a[1], d.b[1], p), 1 - 0.4 * p); op(d.el, dripOn * Math.min(1, uu * 5, (1 - uu) * 5)); });
    const minOn = P(t, mid('soil', 0.6), 0.6, linear);
    specks.forEach(d => { const u = ((t - mid('soil', 0.6)) * 0.26 * calm + d.ph) % 1, uu = u < 0 ? u + 1 : u, p = ease(uu); attr(d.el, 'cx', lerp(d.a[0], d.b[0], p)); attr(d.el, 'cy', lerp(d.a[1], d.b[1], p)); op(d.el, minOn * Math.min(1, uu * 5, (1 - uu) * 5)); });
    // growth at the tip (later), then droop and grey (dark)
    const grow = P(t, mid('later', 0.48), 1.8, easeOut);
    attr(ext, 'd', `M0,-326 L0,${(-328 - 34 * grow).toFixed(1)}`); op(ext, grow > 0.01 ? 1 : 0);
    upperG.setAttribute('transform', `rotate(${(-22 * droop).toFixed(2)} ${PIV[0]} ${PIV[1]})`);
    units.forEach(u => { const [x, y, r] = LEAVES[u.i]; tr(u.g, x, y, 1, r + (r > 90 ? -52 : 52) * droop); op(u.grey, droop * 0.92); });
    tr(newLeaf.g, 2, -338, Math.max(0.01, clamp(grow * 1.15)), lerp(-84, -40, grow) + 52 * droop); op(newLeaf.g, grow > 0.01 ? 1 : 0); op(newLeaf.grey, droop * 0.92);
    op(newGlow, win(t, mid('later', 0.5), at('dark') + 0.4, 0.5) * 0.9);
    tr(tipG, 0, -328 - 34 * grow);
    tipL.forEach((u, k) => { tr(u.g, 0, 0, 1, (k ? -116 : -64) + (k ? -40 : 40) * droop); op(u.grey, droop * 0.92); });
    op(greyLo, droop * 0.9); op(greyHi, droop * 0.9);

    /* --- big leaf (locked to leaf 4 while the camera moves) --- */
    const bigA = P(z, 0.42, 0.42, linear);
    op(bigG, bigA);
    if (bigA > 0) {
      const kk = zk / K1;
      bigG.setAttribute('transform', `translate(${zF[0].toFixed(2)} ${zF[1].toFixed(2)}) rotate(${(zr - DROT).toFixed(2)}) scale(${kk.toFixed(4)}) translate(${-BIG.base[0]} ${-BIG.base[1]})`);
      const gw = P(t, mid('chloro', 0.15), 1.2, linear) * (1 - 0.45 * P(t, at('glucose'), 0.8, linear));
      op(bigGlow, gw * (0.75 + 0.25 * wave(t, 1.8)));
      glints.forEach(g => { const tw = wave(t * calm, 1.3, g.ph); op(g.el, gw * (tw > 0.6 ? (tw - 0.6) * 2.5 : 0)); tr(g.el, g.p[0], g.p[1], 0.6 + 0.6 * tw); });
    }

    /* --- beam --- */
    const tgt = W2S(L4c, z);
    const beamA = Math.max(win(t, mid('three', 0.36), at('dark') + 0.2, 0.5), 0) * (1 - setP);
    op(beamG, beamA);
    if (beamA > 0) {
      const dx = tgt[0] - SUN[0], dy = tgt[1] - SUN[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      const w0 = lerp(30, 56, z), w1 = lerp(40, 118, z);
      const quad = (a, b) => `M${(SUN[0] + nx * a).toFixed(1)},${(SUN[1] + ny * a).toFixed(1)} L${(tgt[0] + nx * b).toFixed(1)},${(tgt[1] + ny * b).toFixed(1)} L${(tgt[0] - nx * b).toFixed(1)},${(tgt[1] - ny * b).toFixed(1)} L${(SUN[0] - nx * a).toFixed(1)},${(SUN[1] - ny * a).toFixed(1)} Z`;
      beamWide.setAttribute('d', quad(w0, w1)); beamCore.setAttribute('d', quad(w0 * 0.4, w1 * 0.45));
      const sink = win(t, at('chloro') + 0.4, at('glucose') + 0.6, 0.4);
      beamDash.forEach((l, k) => {
        const u = ((tt * (0.5 + 0.3 * sink) + k / 5) % 1), a = 0.2 + 0.78 * u, b = Math.min(1, a + 0.1), off = ((k % 3) - 1) * lerp(8, 30, z);
        attr(l, 'x1', SUN[0] + dx * a + nx * off); attr(l, 'y1', SUN[1] + dy * a + ny * off); attr(l, 'x2', SUN[0] + dx * b + nx * off); attr(l, 'y2', SUN[1] + dy * b + ny * off);
        l.style.opacity = (Math.sin(u * Math.PI) * (u > 0.9 ? (1 - u) * 10 : 1)).toFixed(3);
      });
    }

    /* --- producers --- */
    const prodA = 1 - P(t, at('soil') - 0.15, 0.5, linear);
    op(prodG, prodA);
    if (prodA > 0) {
      const dp = P(t, mid('producers', 0.08), 0.6, easeOut), land = P(t, mid('producers', 0.08) + 0.5, 0.35, pop);
      const pp = pS([0, 96]);
      op(producer, P(t, mid('producers', 0.08), 0.2, linear)); tr(producer, pp[0], lerp(pp[1] - 260, pp[1], dp), 1 + 0.08 * Math.sin(Math.PI * clamp(land)));
      const cp = P(t, mid('producers', 0.3), 0.5, pop); op(cutG, clamp(cp * 2)); tr(cutG, 330, 330, Math.max(0.01, 0.7 + 0.3 * cp));
      const xp = P(t, mid('producers', 0.5), 0.35, pop); op(cutX, clamp(xp * 2)); tr(cutX, 330, 330, Math.max(0.01, xp));
      const op2 = P(t, mid('producers', 0.62), 0.5, easeOut); op(ownG, op2); tr(ownG, 0, (1 - op2) * 18);
      const tk = P(t, mid('producers', 0.62) + 0.35, 0.35, pop); op(ownTick, clamp(tk * 2)); tr(ownTick, 354 - ownChip.w / 2 - 34, 486, Math.max(0.01, tk));
    }

    /* --- soil labels --- */
    const soilA = win(t, at('soil'), at('three') + 0.1, 0.4);
    op(soilG, soilA);
    if (soilA > 0) {
      op(foodC, P(t, mid('soil', 0.14), 0.4, linear));
      const fx = P(t, mid('soil', 0.3), 0.35, pop); op(foodX, clamp(fx * 2)); tr(foodX, 668 - foodC.w / 2 - 32, 532, Math.max(0.01, fx));
      lbWater.set(P(t, mid('soil', 0.55), 0.4, linear)); lbMin.set(P(t, mid('soil', 0.7), 0.4, linear));
    }

    /* --- three inputs --- */
    const thrA = win(t, at('three') - 0.1, at('chloro') - 0.1, 0.4);
    op(threeG, thrA);
    if (thrA > 0) {
      op(lbLight, P(t, mid('three', 0.4), 0.4, linear));
      op(lbAir, P(t, mid('three', 0.5), 0.4, linear));
      lbSoil.set(P(t, mid('three', 0.76), 0.4, linear));
      inCO2.forEach((m, k) => {
        const u = (t - mid('three', 0.5) - k * 0.5) / 2.0;
        if (u <= 0) { op(m, 0); return; }
        const uu = Math.min(1, u), q = along(co2Path, ease(uu));
        tr(m, q[0], q[1], 1 - 0.35 * ease(uu), uu * 120); op(m, Math.min(1, u * 5) * (1 - P(uu, 0.86, 0.14, linear)));
      });
      inH2O.forEach((m, k) => {
        const u = (t - mid('three', 0.7) - k * 0.3) / 1.5;
        if (u <= 0) { op(m, 0); return; }
        const uu = Math.min(1, u), q = along(stemUp, ease(uu));
        tr(m, q[0], q[1], 0.8); op(m, Math.min(1, u * 5) * (1 - P(uu, 0.9, 0.1, linear)));
      });
    }

    /* --- zoomed leaf: labels, molecules, glucose, oxygen, battery --- */
    op(lbChl, win(t, mid('chloro', 0.25), at('glucose') + 0.1, 0.4));
    op(lbGlu, win(t, mid('glucose', 0.68), at('oxygen') + 0.1, 0.4));
    op(lbO2, win(t, mid('oxygen', 0.3), at('store') + 0.1, 0.4));
    const molA = P(t, at('glucose') - 0.3, 0.3, linear);
    op(molG, molA);
    const tJoin = mid('glucose', 0.47), tPop = mid('glucose', 0.6);
    if (molA > 0) {
      const conv = P(t, tJoin, tPop - tJoin, easeIn);
      CO2S.forEach((m, k) => {
        const u = P(t, mid('glucose', 0.02 + k * 0.035), 1.6, ease);
        const p = [lerp(m.from[0], m.pre[0], u), lerp(m.from[1], m.pre[1], u)];
        tr(m.g, lerp(p[0], GC[0], conv), lerp(p[1], GC[1], conv), Math.max(0.01, 1 - 0.7 * conv), (1 - u) * 90 + 6 * Math.sin(tt * 2 + k));
        op(m.g, u > 0 ? (1 - P(conv, 0.85, 0.15, linear)) : 0);
      });
      H2OS.forEach((m, k) => {
        const u = P(t, mid('glucose', 0.06 + k * 0.035), 1.7, ease);
        const p = along(m.path, u);
        tr(m.g, lerp(p[0], GC[0], conv), lerp(p[1], GC[1], conv), Math.max(0.01, 1 - 0.7 * conv), 8 * Math.sin(tt * 2.2 + k));
        op(m.g, u > 0 ? (1 - P(conv, 0.85, 0.15, linear)) : 0);
      });
      const fl = P(t, tPop - 0.1, 0.9, linear);
      op(flash, fl > 0 && fl < 1 ? Math.sin(fl * Math.PI) : 0); tr(flash, GC[0], GC[1], 0.5 + fl);
    }
    const gp = P(t, tPop, 0.55, pop), toBatt = P(t, at('store') + 0.05, 0.5, linear);
    op(gluG, clamp(gp * 2) * (1 - toBatt));
    tr(gluG, GC[0], GC[1], Math.max(0.01, gp) * (1 + 0.15 * toBatt));
    O2S.forEach((o, k) => {
      const u = P(t, at('oxygen') + k * 0.16, 2.3, linear);
      if (u <= 0 || u >= 1) { op(o.g, 0); return; }
      const q = qpt(GC, o.c, o.to, ease(u));
      tr(o.g, q[0], q[1], 0.5 + 0.5 * Math.min(1, u * 4), u * 80 + k * 30); op(o.g, Math.min(1, u * 6) * (1 - P(u, 0.8, 0.2, linear)));
    });

    /* battery: charges in the leaf (store), follows leaf 4 out (later), drains (later, dark) */
    const bA = toBatt * (1 - P(t, mid('dark', 0.62), 0.5, linear));
    op(batt, bA);
    if (bA > 0) {
      const bp = W2S(L4c, z);
      tr(batt, bp[0], bp[1], Math.max(0.01, lerp(0.42, 1, z) * (0.85 + 0.15 * toBatt)));
      const charge = P(t, mid('store', 0.14), Math.max(1, mid('store', 0.9) - mid('store', 0.14)), linear);
      const drain1 = P(t, mid('later', 0.32), Math.max(1, mid('later', 0.95) - mid('later', 0.32)), linear);
      const drain2 = P(t, mid('dark', 0.12), Math.max(1, mid('dark', 0.6) - mid('dark', 0.12)), linear);
      batt.set(0.04 + 0.86 * charge - 0.5 * drain1 - 0.4 * drain2);
    }
    const flyA = win(t, mid('store', 0.08), mid('store', 0.92), 0.3);
    op(flyG, flyA);
    if (flyA > 0) fly.forEach((s, k) => {
      const u = ((t - mid('store', 0.08)) / 1.0 + k / 8) % 1, b = GC;
      tr(s, lerp(SUN[0], b[0], ease(u)), lerp(SUN[1], b[1], ease(u)), 0.6 + 0.5 * (1 - u)); op(s, Math.min(1, u * 6) * (1 - P(u, 0.85, 0.15, linear))); s.upd(t);
    });
    const enA = win(t, mid('store', 0.2), at('later') + 0.1, 0.4);
    op(enG, enA);
    if (enA > 0) {
      const a1 = P(t, mid('store', 0.2), 0.5, pop), a2 = P(t, mid('store', 0.62), 0.5, pop);
      op(chLight, clamp(a1 * 2)); tr(chLight, EX + chLight.w / 2, 690, Math.max(0.01, 0.7 + 0.3 * a1));
      enArr.set(P(t, mid('store', 0.5), 0.5)); op(enArr, P(t, mid('store', 0.5), 0.1, linear));
      op(chChem, clamp(a2 * 2)); tr(chChem, EX + EW - chChem.w / 2, 690, Math.max(0.01, 0.7 + 0.3 * a2));
    }

    /* --- later: glucose packets to the tip and roots, sparks where they are used --- */
    const lateA = win(t, mid('later', 0.06), at('dark') + 0.1, 0.4);
    op(lateG, lateA);
    if (lateA > 0) { op(respC, P(t, mid('later', 0.06), 0.4, linear)); op(powT, P(t, mid('later', 0.55), 0.4, linear)); }
    packets.forEach((pk, k) => {
      const t0 = mid('later', 0.32) + Math.floor(k / 2) * 0.45, u = (t - t0) / 1.5;
      const path = pk.up ? pathUp : [L4c, L4b].concat(stemDown, [rootEnds[Math.floor(k / 2) % 3]]);
      if (u <= 0 || u >= 1) op(pk.g, 0);
      else { const q = along(path, ease(u)); tr(pk.g, q[0], q[1]); op(pk.g, Math.min(1, u * 6) * (1 - P(u, 0.85, 0.15, linear))); }
      const v = (t - t0 - 1.4) / 1.0;
      if (v <= 0 || v >= 1) op(pk.sp, 0);
      else { const q = path[path.length - 1]; tr(pk.sp, q[0], q[1] - (pk.up ? 6 : 0), 0.5 + 0.7 * Math.sin(v * Math.PI)); op(pk.sp, Math.sin(v * Math.PI)); pk.sp.upd(t); }
    });

    /* --- dark --- */
    const dkA = P(t, at('dark') + 0.2, 0.5, linear);
    op(darkG, dkA);
    if (dkA > 0) {
      const wk = 1 + Math.min(2, Math.floor(3 * P(t, mid('dark', 0.12), Math.max(1, mid('dark', 0.7) - mid('dark', 0.12)), linear)));
      setText(weekC.label, `week ${wk} in the dark`);
      op(weekC, P(t, at('dark') + 0.3, 0.4, linear));
      airMols.forEach((m, k) => { tr(m.g, m.p[0] + 10 * Math.sin(tt * 0.6 + k * 2), m.p[1] + 6 * Math.cos(tt * 0.5 + k), 1, 12 * Math.sin(tt * 0.4 + k)); op(m.g, P(t, mid('dark', 0.5 + k * 0.03), 0.4, linear)); });
      op(airOk, P(t, mid('dark', 0.58), 0.4, linear));
      op(waterOk, P(t, mid('dark', 0.54), 0.4, linear));
      const nf = P(t, mid('dark', 0.78), 0.5, pop); op(noFood, clamp(nf * 2)); tr(noFood, 330, 520, Math.max(0.01, 0.7 + 0.3 * nf));
    }
  };
});

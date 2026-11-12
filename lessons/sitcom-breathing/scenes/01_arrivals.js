/* Scene 1: "Arrivals: the long way down".
   Shots (hard sitcom cuts): arrivals hall (a breath whooshes in, Ozzie bounces in) -> Dennis confessional (O2: two
   atoms, one molecule, zero chill) -> the nose (warms, moistens, filters; Ozzie at the nose spa) -> the trachea
   (C-shaped rings of cartilage) -> the lining close up (goblet cells, mucus, cilia sweep it to the throat) ->
   Dennis confessional (the mucus escalator, gulp) -> Kavya, eating -> the airway tree (bronchi, bronchioles) ->
   Ozzie lost at the interchange -> alveoli -> Dennis confessional (Tall Brontosaurs Breathe Air) -> the hall
   again: Nigel drifts through. An MRT-style route map runs along the top through the airway journey. */
scene('arrivals', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------- local helpers (prefixed arr) ---------- */
  const arrCam = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy})`);
  // pop in at t0, fade out at t1 (or never)
  const arrShow = (el, t, t0, t1, x, y, s, r) => {
    const p = P(t, t0, 0.45, pop), out = t1 === undefined ? 0 : P(t, t1, 0.2, linear);
    const v = t >= t0 ? clamp(p * 2.5) * (1 - out) : 0;
    op(el, v); if (v > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r);
    return p;
  };
  const arrFade = (el, t, t0, t1) => op(el, (t >= t0 ? P(t, t0, 0.25, linear) : 0) * (t1 === undefined ? 1 : 1 - P(t, t1, 0.2, linear)));
  const arrLbl = (parent, str, o) => { o = o || {}; return lhChip(parent, str, { size: o.size || 34, fill: o.fill || 'rgba(16,8,14,0.9)', stroke: o.stroke || '#6E3A4E', sw: 3, color: o.color || C.ink, weight: o.weight || 700, boldFill: o.boldFill }); };
  // a time value that makes a cast member blink at each tb
  function arrBlinkT(t, seed, tbs) {
    const period = 3.1 + (seed % 5) * 0.37;
    for (const tb of tbs) if (t >= tb && t < tb + 0.13) { const n = Math.ceil((tb + seed * 0.71) / period) + 1; return t - tb + n * period - seed * 0.71; }
    return t;
  }
  const circ = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0 `;
  const along = (pts, f) => {   // point at fraction f along a polyline
    let L = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
    let s = clamp(f) * L;
    for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const q = s / seg[i]; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } s -= seg[i]; }
    return pts[pts.length - 1];
  };

  /* ---------- layers ---------- */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* =================== HALL (arrivals) =================== */
  const HALL = G(Lbg);
  lhTerminal(HALL);
  const board = lhBoard(HALL, 'ARRIVALS', [['OXYGEN', 'on time'], ['NITROGEN', 'on time']], { w: 520 });
  tr(board, 870, 156);
  const nRowHi = E('rect', { x: -244, y: 162, width: 488, height: 56, rx: 6, fill: 'none', stroke: LH.nitro, 'stroke-width': 5 }, board);
  const wind = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.5 }, HALL);
  const breathMols = [];
  for (let i = 0; i < 6; i++) {
    const kind = i % 3 === 1 ? 'O2' : 'N2';
    breathMols.push({ el: lhMol(HALL, kind, 15), y: 420 + (i * 37) % 70, ph: i / 6, kind });
  }

  /* =================== the route map (journey shots) =================== */
  const RM = G(Lfg);
  E('rect', { x: 70, y: 118, width: 1060, height: 166, rx: 22, fill: 'rgba(20,6,12,0.88)', stroke: '#6E3A4E', 'stroke-width': 3 }, RM);
  const rmap = lhRouteMap(RM); tr(rmap, 125, 196, 0.95);

  /* =================== NOSE =================== */
  const NOSE = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1420', '#5E2232', true) }, NOSE);
  E('path', { d: 'M660,300 L330,300 Q280,300 255,350 L120,610 Q100,655 150,662 L205,662 L268,662 Q285,705 320,722 L660,722 Z', fill: ball('#C98A5E', '#9A5E38'), stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, NOSE);
  E('path', { d: 'M205,662 Q198,600 250,520 Q300,420 420,398 L668,398 L668,592 L440,592 Q340,594 302,632 Q282,654 270,662 Z', fill: linGrad('#F28AA8', '#C9486E', true), stroke: '#7A2236', 'stroke-width': 5, 'stroke-linejoin': 'round' }, NOSE);
  E('path', { d: 'M350,404 Q400,438 450,404 Q500,432 550,402 Q600,430 650,402', fill: 'none', stroke: '#A8355A', 'stroke-width': 12, 'stroke-linecap': 'round' }, NOSE);   // turbinate shelves
  const noseGlow = E('ellipse', { cx: 470, cy: 500, rx: 220, ry: 90, fill: glow('#FF9A3D') }, NOSE);
  let hairs = '';
  for (let i = 0; i < 9; i++) { const y = 600 + i * 7, x0 = 214 + i * 2 + (i % 2) * 40, sgn = i % 2 ? -1 : 1; hairs += `M${x0},${y} q${sgn * 14},-10 ${sgn * 26},-6 `; }
  E('path', { d: hairs, fill: 'none', stroke: '#3A1E18', 'stroke-width': 4, 'stroke-linecap': 'round' }, NOSE);
  let dropsD = '';
  [[320, 452], [400, 424], [520, 418], [610, 420], [360, 578], [470, 586], [580, 584], [262, 560]].forEach(([x, y]) => { dropsD += `M${x},${y - 11} Q${x + 8},${y + 2} ${x},${y + 7} Q${x - 8},${y + 2} ${x},${y - 11} Z `; });
  const noseDrops = E('path', { d: dropsD, fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, NOSE);
  const AIRPATH = [[40, 770], [150, 720], [236, 664], [262, 584], [330, 488], [440, 474], [560, 492], [700, 496]];
  const noseMols = [];
  for (let i = 0; i < 5; i++) noseMols.push({ el: lhMol(NOSE, i % 3 === 0 ? 'O2' : 'N2', 11), ph: i / 5 });
  const dust = [];
  for (let i = 0; i < 5; i++) dust.push({ r: 6 + (i % 2) * 2, x: 222 + i * 9 + (i % 2) * 22, y: 606 + i * 9 });
  const dustP = E('path', { d: '', fill: '#6B5A4A', stroke: '#2E241C', 'stroke-width': 2 }, NOSE);
  const noseHead = arrLbl(Lfg, 'the **nose**', { size: 46, color: LH.signTx, stroke: LH.signTx, boldFill: LH.signTx });
  const ticks = ['warms the air', 'makes it moist', 'filters it'].map((s, i) => {
    const g = G(Lfg); tick(g, 18); T(g, 34, 13, s, { size: 40, weight: 700 }); return g;
  });
  const filtNote = T(Lfg, 800, 655, '(hairs + mucus trap dust)', { size: 26, weight: 600, fill: C.muted, font: FB });
  const spaSign = lhSign(Lfg, 'NOSE SPA · OPEN 24/7', { size: 30 });
  const steam = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.55 }, Lfg);
  // Dennis watching the spa, from an inset
  const dIn = G(Lfg);
  const dInClip = E('clipPath', { id: 'arrDInClip' }, defs()); E('circle', { r: 92 }, dInClip);
  E('circle', { r: 96, fill: linGrad('#3A1418', '#6E2630', true), stroke: '#FFFFFF', 'stroke-width': 5 }, dIn);
  const dInBox = G(dIn, { 'clip-path': 'url(#arrDInClip)' });
  const dennisIn = cast(dInBox, 'dennis', { mood: 'deadpan' }); tr(dennisIn, 0, 30, 0.5);
  E('circle', { r: 94, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6 }, dIn);

  /* =================== TRACHEA =================== */
  const TRA = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1420', '#5E2232', true) }, TRA);
  E('rect', { x: 186, y: 290, width: 148, height: 480, rx: 20, fill: INK }, TRA);
  E('rect', { x: 192, y: 290, width: 136, height: 480, rx: 16, fill: linGrad('#C9486E', '#F28AA8', false) }, TRA);
  E('rect', { x: 236, y: 290, width: 48, height: 480, fill: '#7A2236', opacity: 0.45 }, TRA);   // the dark inside
  let rings = '';
  for (let y = 314; y < 760; y += 42) rings += `M196,${y} Q260,${y + 16} 324,${y} `;
  E('path', { d: rings, fill: 'none', stroke: INK, 'stroke-width': 22, 'stroke-linecap': 'round' }, TRA);
  E('path', { d: rings, fill: 'none', stroke: LH.bone, 'stroke-width': 14, 'stroke-linecap': 'round' }, TRA);
  const traName = G(Lfg);
  T(traName, 0, 0, 'trachea', { size: 54, weight: 800, fill: LH.signTx });
  const traWind = T(traName, 0, 46, '(the windpipe)', { size: 32, weight: 600, fill: C.muted });
  // the C ring in cross-section: open at the back
  const cRing = G(Lfg);
  E('circle', { r: 64, fill: '#3A1220' }, cRing);
  const arcD = (r, a0, a1) => `M${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 1 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)}`;
  E('path', { d: arcD(78, 0.75, -0.75), fill: 'none', stroke: INK, 'stroke-width': 32, 'stroke-linecap': 'round' }, cRing);
  E('path', { d: arcD(78, 0.75, -0.75), fill: 'none', stroke: LH.bone, 'stroke-width': 22, 'stroke-linecap': 'round' }, cRing);
  E('path', { d: `M${(Math.cos(-0.62) * 78).toFixed(1)},${(Math.sin(-0.62) * 78).toFixed(1)} Q92,0 ${(Math.cos(0.62) * 78).toFixed(1)},${(Math.sin(0.62) * 78).toFixed(1)}`, fill: 'none', stroke: LH.muscle, 'stroke-width': 9, 'stroke-linecap': 'round' }, cRing);
  T(cRing, -112, 10, 'front', { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  T(cRing, 116, 10, 'open at the back', { size: 28, weight: 700, fill: '#FFFFFF' });
  T(cRing, 0, 128, 'one ring, from above', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const cTxt = G(Lfg);
  lhRich(cTxt, 0, 0, '**C-shaped rings**', { size: 42, anchor: 'middle', fill: '#FFFFFF', boldFill: LH.bone });
  lhRich(cTxt, 0, 54, 'of **cartilage**', { size: 42, anchor: 'middle', fill: '#FFFFFF', boldFill: LH.bone });
  const cStop = arrLbl(Lfg, 'stop it collapsing', { size: 32, color: C.good, stroke: C.good });

  /* =================== LINING (close up) =================== */
  const LIN = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2E1020', '#4E1A30', true) }, LIN);
  const linG = G(LIN); tr(linG, 50, 372);
  const lining = lhLining(linG, 1100);
  const gobGlow = G(linG);
  lining.gob.forEach(cx => E('ellipse', { cx, cy: 146, rx: 46, ry: 56, fill: glow('#F4FF7A') }, gobGlow));
  const linHead = T(Lfg, 70, 336, 'the trachea lining, close up', { size: 28, weight: 600, fill: C.muted });
  const gobLbl = arrLbl(Lfg, '**goblet cells**', { size: 38, color: '#FFFFFF', boldFill: '#E8F2A0', stroke: '#9AA83A' });
  const gobPtr = E('path', { d: lining.gob.map(cx => `M${50 + cx},${372 + 186} L${lerp(50 + cx, 600, 0.55).toFixed(0)},${618}`).join(' '), stroke: '#E8F2A0', 'stroke-width': 3, 'stroke-dasharray': '7 6', fill: 'none' }, Lfg);
  const mucLbl = arrLbl(Lfg, 'make sticky **mucus**', { size: 34, boldFill: '#E8F2A0', stroke: '#9AA83A' });
  const trapLbl = arrLbl(Lfg, 'traps **dust** and **germs**', { size: 34, boldFill: '#C9A27A' });
  const ciliLbl = arrLbl(Lfg, '**ciliated cells**', { size: 38, boldFill: '#F7B6C4', stroke: '#C9637F' });
  const ciliPtr = E('path', { d: 'M200,615 L146,556 M300,615 L338,556', stroke: '#F7B6C4', 'stroke-width': 3, 'stroke-dasharray': '7 6', fill: 'none' }, Lfg);
  const ciliWord = arrLbl(Lfg, 'tiny **cilia** **sweep** the mucus', { size: 34, boldFill: '#F7B6C4' });
  const sweepArr = arrow(Lfg, 450, 648, 740, 648, { color: '#FFFFFF', width: 7 });
  const swallowLbl = arrLbl(Lfg, 'to the throat: **swallowed**', { size: 32, boldFill: LH.signTx });

  /* =================== CONFESSIONAL (Dennis) =================== */
  const CF = G(Lbg), CFcam = G(CF);
  const conf = lhConf(CFcam, 'dennis');
  const dennis = cast(CFcam, 'dennis', { mood: 'deadpan' });
  // card 1: Ozzie is O2
  const k1 = G(CFcam);
  card(k1, 700, 140, 440, 470, { fill: 'rgba(14,8,12,0.9)', stroke: '#6E2323', sw: 3 });
  const k1a = lhRich(k1, 920, 214, '**oxygen** = O_2', { size: 52, anchor: 'middle', fill: '#FFFFFF', boldFill: '#FF9A8F' });
  const k1m = G(k1); tr(k1m, 920, 304); molO2(k1m, 40);
  const k1mL = E('path', { d: 'M890,346 L862,380 M950,346 L978,380', stroke: '#FF9A8F', 'stroke-width': 4, 'stroke-linecap': 'round' }, k1);
  const k1b = T(k1, 920, 414, '2 oxygen atoms', { size: 38, weight: 700, anchor: 'middle' });
  const k1c = T(k1, 920, 470, '= 1 molecule', { size: 38, weight: 700, anchor: 'middle', fill: LH.signTx });
  const k1d = arrLbl(k1, 'chill: 0', { size: 34, color: '#FF9A8F', stroke: '#FF9A8F' }); tr(k1d, 920, 548);
  // card 2: the mucus escalator
  const k2 = G(CFcam);
  const escSign = lhSign(k2, 'MUCUS ESCALATOR', { size: 32, arrow: 'up' }); tr(escSign, 900, 176);
  E('path', { d: 'M680,676 L700,676 L990,388 L1010,388', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 10, 'stroke-linejoin': 'round' }, k2);
  E('path', { d: 'M680,640 L700,640 L990,352 L1010,352', fill: 'none', stroke: INK, 'stroke-width': 8 }, k2);
  E('path', { d: 'M700,676 L990,388 L990,404 L708,686 Z', fill: '#5A6470' }, k2);
  // the moving steps, the mucus blobs riding them and their dust: one path each, rebuilt per frame
  const stepP = E('path', { d: '', fill: '#C9D3DC', stroke: INK, 'stroke-width': 2.5 }, k2);
  const blobP = E('path', { d: '', fill: '#E8F2A0', stroke: '#9AA83A', 'stroke-width': 2.5 }, k2);
  const specP = E('path', { d: '', fill: '#6B5A4A' }, k2);
  const mouth = G(k2); tr(mouth, 1070, 334);
  const mouthIn = E('ellipse', { rx: 46, ry: 30, fill: '#5A1E2A', stroke: INK, 'stroke-width': 5 }, mouth);
  const lipU = E('path', { d: '', fill: '#E87A8A', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, mouth);
  const lipL = E('path', { d: '', fill: '#D9606F', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, mouth);
  const gulp = T(k2, 1070, 446, 'GULP.', { size: 44, weight: 800, anchor: 'middle', fill: LH.signTx });
  // card 3: Tall Brontosaurs Breathe Air
  const k3 = G(CFcam);
  card(k3, 690, 126, 450, 428, { fill: 'rgba(14,8,12,0.9)', stroke: '#6B4E12', sw: 3 });
  const TB = [['T', 'rachea', 'Tall'], ['B', 'ronchi', 'Brontosaurs'], ['B', 'ronchioles', 'Breathe'], ['A', 'lveoli', 'Air']];
  const tbRows = TB.map(([ini, rest, mn], i) => {
    const g = G(k3), y = 196 + i * 100;
    const big = T(g, 744, y + 24, ini, { size: 84, weight: 800, anchor: 'middle', fill: LH.signTx });
    const w1 = T(g, 790, y - 4, ini + rest, { size: 38, weight: 700, fill: '#FFFFFF' });
    const w2 = T(g, 790, y + 38, mn, { size: 34, weight: 800, fill: LH.signTx });
    return { g, w1, w2 };
  });
  const bronto = G(k3); tr(bronto, 975, 652);
  E('path', { d: 'M-100,10 Q-60,-44 10,-40 Q40,-40 58,-70 Q70,-118 92,-124 Q112,-128 116,-114 Q110,-104 98,-104 Q84,-96 82,-60 Q78,-14 52,10 L52,46 L36,46 L34,18 L-30,18 L-32,46 L-48,46 L-50,14 Q-90,24 -140,20 Q-110,12 -100,10 Z', fill: '#7BC77E', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bronto);
  E('circle', { cx: 102, cy: -116, r: 3.5, fill: INK }, bronto);
  const bTxt = T(k3, 945, 712, 'Tall Brontosaurs Breathe Air', { size: 28, weight: 700, anchor: 'middle', fill: '#C8F2C9' });
  const muscleLbl = arrLbl(CFcam, "(he's a muscle)", { size: 28, color: C.muted, stroke: '#6E2630' });

  /* =================== KAVYA (eating) =================== */
  const KAV = G(Lbg), KAVcam = G(KAV);
  const living = lhLiving(KAVcam);
  const kav = cast(KAVcam, 'kavya', { mood: 'annoyed' });
  const snackG = G(KAVcam);
  const snack = lhSnack(snackG, 0.7); tr(snack, 0, 0, 0.7, -14);
  E('circle', { cx: 4, cy: 30, r: 22, fill: '#B9784E', stroke: INK, 'stroke-width': 4 }, snackG);   // her hand
  const crumbs = E('path', { d: circ(-30, 40, 3) + circ(-12, 54, 2.5) + circ(-40, 70, 3), fill: '#B5701A' }, snackG);
  const eatChip = arrLbl(KAV, 'lunch: in progress', { size: 30, color: LH.signTx, stroke: LH.signTx });

  /* =================== TREE (bronchi, bronchioles, alveoli) =================== */
  const TREE = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2E1020', '#4E1A30', true) }, TREE);
  const lobes = E('path', { d: 'M420,330 C300,300 150,380 150,560 C150,690 270,712 410,690 Z M480,330 C600,300 750,380 750,560 C750,690 630,712 490,690 Z', fill: '#F48FA6', opacity: 0.13 }, TREE);
  const segs = [[], [], [], [], []], tips = [];
  const LEN = [96, 118, 82, 60, 44], SPR = [0, 0.78, 0.5, 0.42, 0.36];
  (function grow(x, y, a, l, chain) {
    const x2 = x + Math.cos(a) * LEN[l], y2 = y + Math.sin(a) * LEN[l], ch = chain.concat([[x2, y2]]);
    segs[l].push(`M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `);
    if (l < 4) { grow(x2, y2, a - SPR[l + 1], l + 1, ch); grow(x2, y2, a + SPR[l + 1], l + 1, ch); } else tips.push([x2, y2, a, ch]);
  })(450, 296, Math.PI / 2, 0, [[450, 296]]);
  const WID = [34, 26, 17, 11, 8];
  const lvl = segs.map((s, l) => {
    const g = G(TREE), d = s.join('');
    E('path', { d, fill: 'none', stroke: INK, 'stroke-width': WID[l] + 8, 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: l === 1 ? '#FF9AB8' : LH.lung, 'stroke-width': WID[l], 'stroke-linecap': 'round' }, g);
    return g;
  });
  let grapes = '';
  tips.forEach(([x, y, a]) => {
    const dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx;
    grapes += circ(x + dx * 12 + px * 9, y + dy * 12 + py * 9, 10) + circ(x + dx * 12 - px * 9, y + dy * 12 - py * 9, 10) + circ(x + dx * 26, y + dy * 26, 10);
  });
  const grapeG = G(TREE);
  E('path', { d: grapes, fill: 'none', stroke: INK, 'stroke-width': 7 }, grapeG);
  E('path', { d: grapes, fill: LH.sac }, grapeG);
  const T0 = tips.reduce((b, q) => (q[0] > b[0] ? q : b), tips[0]);   // the right-most tip: magnified
  const OZT = tips.reduce((b, q) => (q[0] < b[0] ? q : b), tips[0]);  // Ozzie rides to the left-most tip
  const bronchusLbl = G(Lfg);
  T(bronchusLbl, 0, 0, 'one = a', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(bronchusLbl, 0, 38, 'bronchus', { size: 36, weight: 800, anchor: 'middle', fill: '#FF9AB8' });
  const bronchusPtr = arrow(Lfg, 252, 452, 390, 440, { color: '#FF9AB8', width: 4, head: 14 });
  const tracheaLbl = T(Lfg, 400, 340, 'trachea', { size: 28, weight: 700, anchor: 'end', fill: C.muted });
  const brLbl = G(Lfg);
  lhChip(brLbl, '**bronchi**', { size: 50, fill: 'rgba(16,8,14,0.9)', stroke: '#FF9AB8', sw: 3, boldFill: '#FF9AB8' });
  T(brLbl, 0, 76, 'two: one per lung', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const brlLbl = G(Lfg);
  lhChip(brlLbl, '**bronchioles**', { size: 46, fill: 'rgba(16,8,14,0.9)', stroke: LH.lung, sw: 3, boldFill: LH.lung });
  T(brlLbl, 0, 72, 'branch again and again', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const mag = G(Lfg);
  const magLine = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '8 6', fill: 'none' }, mag);
  const magBody = G(mag); tr(magBody, 985, 448);
  E('circle', { r: 132, fill: '#2A0E1C', stroke: '#FFFFFF', 'stroke-width': 6 }, magBody);
  const clusterG = G(magBody); tr(clusterG, 0, 16, 0.66);
  const cluster = lhCluster(clusterG);
  const alvLbl = G(Lfg);
  lhChip(alvLbl, '**alveoli** (air sacs)', { size: 36, fill: 'rgba(16,8,14,0.9)', stroke: LH.sac, sw: 3, boldFill: LH.sac });
  T(alvLbl, 0, 62, 'one = an alveolus', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* =================== MAZE =================== */
  const MAZE = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1420', '#5E2232', true) }, MAZE);
  const tube = 'M-40,470 L1240,470 M600,140 L600,800 M80,140 L1120,800 M1120,140 L80,800';
  E('path', { d: tube, stroke: INK, 'stroke-width': 130, fill: 'none' }, MAZE);
  E('path', { d: tube, stroke: '#D9607F', 'stroke-width': 116, fill: 'none' }, MAZE);
  E('circle', { cx: 600, cy: 470, r: 150, fill: '#E87A96', stroke: INK, 'stroke-width': 7 }, MAZE);
  const MSIGN = [['THIS WAY', 'left', 250, 300, 0.32], ['ALSO THIS WAY', 'right', 935, 300, 0.42], ['THIS WAY TOO', 'down', 265, 650, 0.52], ['NO, THIS WAY', 'up', 935, 650, 0.6]];
  const mSigns = MSIGN.map(([s, a, x, y, f]) => ({ el: lhSign(Lfg, s, { size: 30, arrow: a }), x, y, f }));
  const mrt = arrLbl(Lfg, 'INTERCHANGE · 23 levels deep', { size: 28, color: '#FFFFFF', stroke: '#FFFFFF' });

  /* =================== shared cast: Ozzie and Nigel =================== */
  const nigel = cast(Lcast, 'nigel', { mood: 'neutral' });
  const ozzie = cast(Lcast, 'ozzie', { mood: 'happy' });
  const towel = G(ozzie.firstChild);
  E('path', { d: 'M-70,-74 Q-70,-140 0,-142 Q70,-140 70,-74 Q0,-90 -70,-74 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, towel);
  E('path', { d: 'M-62,-104 Q0,-120 62,-104 M-58,-90 Q0,-104 58,-90', fill: 'none', stroke: '#FF8FB0', 'stroke-width': 6 }, towel);
  E('path', { d: 'M40,-136 Q66,-160 80,-132 Q66,-124 50,-128 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 4 }, towel);
  const ozChip = arrLbl(Lfg, '**oxygen** (O_2)', { size: 40, boldFill: '#FF9A8F', stroke: '#FF9A8F' });
  const n2Chip = arrLbl(Lfg, '**nitrogen** (N_2)', { size: 40, boldFill: '#A9B8FF', stroke: LH.nitro });
  const later = arrLbl(Lfg, 'more on Nigel later', { size: 28, color: C.muted });

  /* ---------- HUD: lower thirds, camera flash ---------- */
  const ltOz = scLowerThird(Lhud, ...LH_LOWER.ozzie);
  const ltNi = scLowerThird(Lhud, ...LH_LOWER.nigel);
  const flashDot = E('circle', { r: 40, fill: '#FFFFFF' }, Lhud);
  const flashAll = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, Lhud);

  /* ---------- the shot list ---------- */
  const SH = [
    ['hall', -1e9], ['th1', at('thozzie') - 0.08], ['nose', at('nose') - 0.08], ['tra', at('trachea') - 0.08],
    ['lin', at('goblet') - 0.08], ['th2', at('thescal') - 0.08], ['kav', at('eating') - 0.08], ['tree', at('bronchi') - 0.08],
    ['maze', at('maze') - 0.08], ['tree2', at('alveoli') - 0.08], ['th3', at('tbba') - 0.08], ['hall2', at('nigel') - 0.08],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const ALL_FG = [noseHead, ...ticks, filtNote, spaSign, steam, dIn, traName, cRing, cTxt, cStop, linHead, gobLbl, gobPtr, mucLbl, trapLbl, ciliLbl, ciliPtr, ciliWord, sweepArr, swallowLbl,
    bronchusLbl, bronchusPtr, tracheaLbl, brLbl, brlLbl, mag, alvLbl, ...mSigns.map(m => m.el), mrt, ozChip, n2Chip, later, RM];

  // where the route-map marker is
  const routeP = t => {
    let p = 0;
    [['trachea', 0.25], ['bronchi', 0.5], ['bronchioles', 0.75], ['alveoli', 1]].forEach(([id, v]) => { if (t >= at(id)) p = lerp(p, v, P(t, at(id), 0.9, ease)); });
    return p;
  };

  return t => {
    const sid = shotAt(t)[0];
    const isConf = sid === 'th1' || sid === 'th2' || sid === 'th3';
    op(HALL, sid === 'hall' || sid === 'hall2' ? 1 : 0); op(NOSE, sid === 'nose' ? 1 : 0); op(TRA, sid === 'tra' ? 1 : 0);
    op(LIN, sid === 'lin' ? 1 : 0); op(CF, isConf ? 1 : 0); op(KAV, sid === 'kav' ? 1 : 0);
    op(TREE, sid === 'tree' || sid === 'tree2' ? 1 : 0); op(MAZE, sid === 'maze' ? 1 : 0);
    ALL_FG.forEach(e => op(e, 0));
    op(ozzie, 0); op(nigel, 0); op(towel, 0); op(flashDot, 0); op(flashAll, 0);
    const oz = (x, y, s, st) => { op(ozzie, 1); tr(ozzie, x, y, s); ozzie.set(Object.assign({ t, talk: scTalk(S, t, 'ozzie'), mood: 'happy' }, st)); };
    const ni = (x, y, s, st) => { op(nigel, 1); tr(nigel, x, y, s); nigel.set(Object.assign({ t, talk: 0, mood: 'neutral' }, st)); };
    const showMap = () => { op(RM, 1); rmap.set(routeP(t)); };

    /* ---------- HALL: the breath arrives, Ozzie bounces in ---------- */
    if (sid === 'hall') {
      board.set(clamp((t - mid('batch', 0.35)) / 1.6)); op(nRowHi, 0);
      // the breath: a fast whoosh, then a gentle drift
      const whoosh = P(t, at('batch'), 1.4, easeOut);
      let wd = '';
      if (t > at('batch') && t < end('batch') + 1) for (let i = 0; i < 5; i++) { const x = ((t - at('batch')) * 900 + i * 260) % 1400 - 200, y = 400 + i * 22; wd += `M${x.toFixed(0)},${y} L${(x + 140).toFixed(0)},${y} `; }
      attr(wind, 'd', wd); op(wind, 0.5 * (1 - P(t, end('batch'), 0.8, linear)));
      breathMols.forEach(m => {
        const x0 = -80 + m.ph * 1300;
        const x = t < at('batch') ? -100 : ((x0 * whoosh + (t - at('batch')) * (60 + 60 * (1 - whoosh)) * AMP) % 1380) - 90;
        op(m.el, t < at('batch') ? 0 : 1); tr(m.el, x, m.y + 6 * Math.sin(t * 3 + m.ph * 9) * AMP, 1, 20 * Math.sin(t * 2 + m.ph * 7));
      });
      // Nigel drifts through the back of the hall, unbothered
      ni(lerp(1060, 640, clamp(t / 11)), 556, 0.45, { look: 0 });
      // Ozzie bounces in
      const t0 = at('ozzie') - 0.3;
      if (t >= t0) {
        const p = P(t, t0, 0.7, easeOut);
        const hop = Math.abs(Math.sin((t - t0) * 7)) * (t - t0 < 0.9 ? 70 : 14 * AMP);
        const x = lerp(-180, 380, p), y = 492 - hop;
        let look = 0.2;
        if (t > mid('ozzie', 0.4) && t < mid('ozzie', 0.7)) look = 0.9;   // backpack: looks round at it
        oz(x, y, 0.85, { look });
        arrShow(ozChip, t, mid('ozzie', 0.32), 1e9, 380, 336);
        ltOz.set(win(t, at('ozzie') + 0.3, at('ozzie') + 3.5, 0.3));
        // camera flashes
        [mid('ozzie', 0.12), mid('ozzie', 0.85)].forEach(tf => {
          if (t >= tf && t < tf + 0.35) {
            const q = (t - tf) / 0.35;
            op(flashDot, 1 - q); tr(flashDot, x - 5, y + 68, 0.3 + 1.6 * q);
            op(flashAll, 0.45 * (1 - q));
          }
        });
      } else ltOz.set(0);
    } else ltOz.set(0);

    /* ---------- CONFESSIONALS ---------- */
    if (isConf) {
      conf.set(1, t);
      op(k1, sid === 'th1' ? 1 : 0); op(k2, sid === 'th2' ? 1 : 0); op(k3, sid === 'th3' ? 1 : 0); op(muscleLbl, 0);
      let flat = 0.55 * wave(t, 4) * AMP, mood = 'deadpan', look = 0, k = 1;
      if (sid === 'th1') {
        k = 1 + 0.06 * P(t, end('thozzie'), 0.9, ease);
        const tt = (f) => mid('thozzie', f);
        op(k1a, P(t, tt(0.12), 0.25, linear));
        arrShow(k1m, t, tt(0.36), undefined, 920, 304);
        op(k1mL, P(t, tt(0.4), 0.25, linear)); op(k1b, P(t, tt(0.4), 0.25, linear));
        op(k1c, P(t, tt(0.6), 0.25, linear));
        arrShow(k1d, t, tt(0.82), undefined, 920, 548);
        look = t > tt(0.36) && t < tt(0.7) ? 0.8 : 0;
      } else if (sid === 'th2') {
        k = 1 + 0.06 * P(t, end('thescal'), 0.9, ease);
        arrShow(escSign, t, mid('thescal', 0.1), undefined, 900, 176);
        let sd = '', bd = '', dd = '';
        for (let i = 0; i < 8; i++) {
          const f = (t * 0.22 * AMP + i / 8) % 1, x = lerp(712, 984, f), y = lerp(664, 382, f);
          sd += `M${(x - 22).toFixed(1)},${y.toFixed(1)} h44 v10 h-44 Z `;
          if (i % 2 === 0 && f < 0.93) { bd += `M${(x - 16).toFixed(1)},${y.toFixed(1)} q-2,-20 16,-22 q18,2 16,22 Z `; dd += circ(x + 2, y - 10, 4.5); }
        }
        attr(stepP, 'd', sd); attr(blobP, 'd', bd); attr(specP, 'd', dd);
        // the mouth at the top: open, then GULP
        const tg = mid('thescal', 0.78);
        const shut = t < tg ? 0 : t < tg + 0.18 ? (t - tg) / 0.18 : t < tg + 0.5 ? 1 : 1 - P(t, tg + 0.5, 0.3, ease) * 0.75;
        const o = 1 - shut;
        attr(lipU, 'd', `M-52,0 Q-26,${(-30 * o - 8).toFixed(1)} 0,${(-26 * o - 4).toFixed(1)} Q26,${(-30 * o - 8).toFixed(1)} 52,0 Q0,${(-16 * o + 4).toFixed(1)} -52,0 Z`);
        attr(lipL, 'd', `M-52,0 Q0,${(16 * o - 4).toFixed(1)} 52,0 Q26,${(32 * o + 8).toFixed(1)} 0,${(30 * o + 6).toFixed(1)} Q-26,${(32 * o + 8).toFixed(1)} -52,0 Z`);
        tr(mouthIn, 0, 0, Math.max(0.01, o));
        op(gulp, t >= tg ? P(t, tg, 0.15, linear) : 0); tr(gulp, 0, 0, 1);
        look = t > mid('thescal', 0.3) && t < mid('thescal', 0.7) ? 0.85 : 0;
      } else {
        k = 1 + 0.06 * P(t, end('tbba'), 0.8, ease);
        const f = [0.03, 0.11, 0.19, 0.3];
        tbRows.forEach((r, i) => {
          const ap = P(t, mid('tbba', f[i]), 0.35, pop);
          op(r.g, t >= mid('tbba', f[i]) ? clamp(ap * 2.5) : 0);
          r.g.setAttribute('transform', `translate(744 ${196 + i * 100}) scale(${Math.max(0.01, 0.7 + 0.3 * ap).toFixed(3)}) translate(-744 ${-(196 + i * 100)})`);
          op(r.w2, P(t, mid('tbba', 0.4 + i * 0.06), 0.25, linear));
        });
        arrShow(bronto, t, mid('tbba', 0.6), undefined, 975, 652, 0.82);
        op(bTxt, P(t, mid('tbba', 0.62), 0.3, linear));
        if (t > mid('tbba', 0.86)) { arrShow(muscleLbl, t, mid('tbba', 0.86), undefined, 430, 650); }
        look = t > mid('tbba', 0.05) && t < mid('tbba', 0.6) ? 0.8 : 0;
      }
      arrCam(CFcam, k, 430, 400);
      tr(dennis, 430, 410, 1.5);
      dennis.set({ t, talk: scTalk(S, t, 'dennis'), mood, look, flat });
    }

    /* ---------- NOSE ---------- */
    if (sid === 'nose') {
      showMap();
      const lt = t - at('nose');
      noseMols.forEach(m => { const f = (lt * 0.16 * (0.6 + 0.4 * AMP) + m.ph) % 1; const [x, y] = along(AIRPATH, f); tr(m.el, x, y, 1, f * 200); op(m.el, f > 0.94 ? (1 - f) / 0.06 : 1); });
      const tw = mid('nose', 0.42), tm = mid('nose', 0.62), tf = mid('nose', 0.84);
      op(noseGlow, 0.15 + 0.75 * P(t, tw, 0.5, linear) * (0.8 + 0.2 * Math.sin(t * 3)));
      op(noseDrops, P(t, tm, 0.4, linear));
      let dd = '';
      dust.forEach((d, i) => {
        const t0 = tf - 0.5 + i * 0.08, p = P(t, t0, 0.7, easeOut);
        if (t > t0) dd += circ(lerp(80 + i * 20, d.x, p), lerp(760, d.y, p), d.r);
      });
      attr(dustP, 'd', dd);
      arrShow(noseHead, t, mid('nose', 0.12), undefined, 920, 346);
      const spaOn = t >= at('spa') - 0.1;
      const tOff = spaOn ? at('spa') - 0.05 : undefined;
      ticks.forEach((g, i) => arrShow(g, t, [tw, tm, tf][i], tOff, 768, 440 + i * 84));
      op(filtNote, P(t, tf + 0.3, 0.3, linear) * (spaOn ? 1 - P(t, tOff, 0.2, linear) : 1));
      if (spaOn) {
        op(noseHead, 0);
        arrShow(spaSign, t, at('spa') - 0.05, undefined, 905, 346);
        // Ozzie in the spa, towel on his head
        oz(470, 512 + 4 * Math.sin(t * 2), 0.48, { look: 0.3, mood: 'happy' });
        op(towel, 1);
        let sd = '';
        for (let i = 0; i < 3; i++) { const ph = ((t * 0.6 + i / 3) % 1); const x = 420 + i * 50, y = 450 - ph * 60; sd += `M${x},${y.toFixed(0)} q10,-12 0,-24 q-10,-12 0,-24 `; }
        attr(steam, 'd', sd); op(steam, 0.6);
        // Dennis in his inset, deadpan
        arrShow(dIn, t, mid('spa', 0.5), undefined, 940, 560);
        dennisIn.set({ t, talk: 0, mood: 'deadpan', look: -0.6, flat: 0.55 * wave(t, 4) * AMP });
      }
    }

    /* ---------- TRACHEA ---------- */
    if (sid === 'tra') {
      showMap();
      const f = (x) => mid('trachea', x);
      arrShow(traName, t, f(0.08), undefined, 384, 352);
      op(traWind, P(t, f(0.28), 0.3, linear));
      arrShow(cTxt, t, f(0.46), undefined, 920, 352);
      arrShow(cRing, t, f(0.56), undefined, 560, 560);
      arrShow(cStop, t, f(0.8), undefined, 920, 482);
      // Ozzie slides down the windpipe
      const sp = P(t, at('trachea') + 0.2, 4.6, linear);
      oz(260, lerp(290, 700, sp), 0.3, { look: 0, mood: 'happy' });
    }

    /* ---------- LINING ---------- */
    if (sid === 'lin') {
      showMap();
      const cil = t >= at('cilia') - 0.08;
      // the cilia speed up from a lazy 0.25 to full speed: integrate the rate so nothing jumps
      const tc = mid('cilia', 0.3), d = 1, r0 = 0.25;
      let tau = r0 * t;
      if (t > tc) tau += (1 - r0) * (t < tc + d ? (t - tc) * (t - tc) / (2 * d) : d / 2 + (t - tc - d));
      lining.upd(tau * (0.5 + 0.5 * AMP), 1, 0);
      op(gobGlow, cil ? 0 : P(t, mid('goblet', 0.2), 0.3, linear) * (0.7 + 0.3 * Math.sin(t * 5)));
      if (!cil) {
        op(linHead, 1 - P(t, mid('goblet', 0.5), 0.3, linear));
        arrShow(gobLbl, t, mid('goblet', 0.2), undefined, 600, 648);
        op(gobPtr, P(t, mid('goblet', 0.25), 0.3, linear));
        arrShow(mucLbl, t, mid('goblet', 0.55), undefined, 330, 336);
        arrShow(trapLbl, t, mid('goblet', 0.8), undefined, 860, 336);
      } else {
        arrShow(ciliLbl, t, mid('cilia', 0.08), undefined, 250, 648);
        op(ciliPtr, P(t, mid('cilia', 0.12), 0.3, linear));
        arrShow(ciliWord, t, mid('cilia', 0.32), undefined, 600, 336);
        const sw = P(t, mid('cilia', 0.5), 0.8, ease);
        op(sweepArr, t > mid('cilia', 0.5) ? 1 : 0); sweepArr.set(sw);
        arrShow(swallowLbl, t, mid('cilia', 0.72), undefined, 950, 648);
      }
    }

    /* ---------- KAVYA, eating ---------- */
    if (sid === 'kav') {
      living.upd(t);
      const k = 1 + 0.07 * P(t, end('eating'), 1.0, ease);
      arrCam(KAVcam, k, 600, 420);
      tr(kav, 600, 430, 1.35);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'annoyed', look: 0, still: t > end('eating') });
      tr(snackG, 712, 478, 1, -8);
      op(crumbs, 1);
      arrShow(eatChip, t, mid('eating', 0.55), undefined, 960, 320);
    }

    /* ---------- TREE: bronchi, bronchioles, alveoli ---------- */
    if (sid === 'tree' || sid === 'tree2') {
      showMap();
      const LT = [at('bronchi') - 0.1, mid('bronchi', 0.2), mid('bronchioles', 0.15), mid('bronchioles', 0.3), mid('bronchioles', 0.45)];
      lvl.forEach((g, l) => op(g, P(t, LT[l], 0.4, linear)));
      op(lobes, 1);
      const alv = sid === 'tree2';
      op(grapeG, alv ? P(t, mid('alveoli', 0.2), 0.4, linear) : 0);
      op(tracheaLbl, 1);
      if (!alv) {
        arrShow(brLbl, t, mid('bronchi', 0.22), at('bronchioles') - 0.1, 985, 350);
        arrShow(bronchusLbl, t, mid('bronchi', 0.72), at('bronchioles') - 0.1, 172, 432);
        op(bronchusPtr, t >= mid('bronchi', 0.72) && t < at('bronchioles') - 0.1 ? P(t, mid('bronchi', 0.72), 0.3, linear) : 0);
        arrShow(brlLbl, t, mid('bronchioles', 0.5), undefined, 985, 350);
        // Ozzie, tiny, rides down the left branches
        const pth = OZT[3];
        const f = t < at('bronchioles') ? 0.35 * P(t, at('bronchi'), 3, ease) : 0.35 + 0.6 * P(t, at('bronchioles') + 0.5, 4, ease);
        const [x, y] = along(pth, f);
        oz(x, y - 24, 0.2, { mood: 'happy', look: -0.4 });
      } else {
        const [tx, ty] = T0;
        attr(magLine, 'd', `M${tx.toFixed(0)},${ty.toFixed(0)} L860,420`);
        op(mag, t >= mid('alveoli', 0.25) ? 1 : 0); op(magLine, P(t, mid('alveoli', 0.25), 0.3, linear));
        arrShow(magBody, t, mid('alveoli', 0.25), undefined, 985, 448);
        cluster.upd(t * AMP);
        arrShow(alvLbl, t, mid('alveoli', 0.3), undefined, 985, 640);
        oz(OZT[0], OZT[1] - 26, 0.2, { mood: 'happy', look: 0.6 });
      }
    }

    /* ---------- MAZE ---------- */
    if (sid === 'maze') {
      const f = (x) => mid('maze', x);
      const lookSeq = [[0, 0], [0.05, -1], [0.13, 1], [0.21, -1], [0.29, -1]];
      let look = 0; lookSeq.forEach(([x, v]) => { if (t >= f(x)) look = v; });
      const shock = t >= f(0.5);
      const spin = t >= f(0.3) ? Math.cos((t - f(0.3)) * 7 * AMP) : 1;
      oz(600, 470 + 6 * Math.sin(t * 4), 0.7, { look: shock ? 0 : look, mood: shock ? 'shock' : 'neutral' });
      ozzie.setAttribute('transform', `translate(600 ${(470 + 6 * Math.sin(t * 4)).toFixed(1)}) scale(${(0.7 * (Math.abs(spin) < 0.08 ? 0.08 * Math.sign(spin || 1) : spin)).toFixed(3)} 0.7)`);
      mSigns.forEach(m => arrShow(m.el, t, f(m.f), undefined, m.x, m.y));
      arrShow(mrt, t, f(0.7), undefined, 600, 200);
      // Nigel drifts past behind the junction, who knows the way
      ni(lerp(1150, 860, P(t, at('maze'), 5, linear)), 410, 0.42, { look: 0 });
    }

    /* ---------- HALL 2: Nigel ---------- */
    if (sid === 'hall2') {
      board.set(1);
      op(nRowHi, t > mid('nigel', 0.2) ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
      attr(wind, 'd', ''); breathMols.forEach(m => op(m.el, 0));
      const nx = lerp(1060, 560, clamp((t - at('nigel') + 0.2) / 8));
      ni(nx, 548, 0.72, { look: 0, mood: 'neutral', t: arrBlinkT(t, 22, [end('nigel') + 0.35, end('nigel') + 1.0]) });
      const ox = 250;
      oz(ox, 480, 0.68, { look: clamp((nx - ox) / 260, -1, 1), mood: t > mid('nigel', 0.45) ? 'neutral' : 'happy', talk: 0 });
      arrShow(n2Chip, t, mid('nigel', 0.42), undefined, 300, 340);
      arrShow(later, t, mid('nigel', 0.8), undefined, 940, 680);
      ltNi.set(win(t, at('nigel') + 0.3, at('nigel') + 3.6, 0.3));
    } else ltNi.set(0);
  };
});

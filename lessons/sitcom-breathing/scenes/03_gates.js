/* Scene 3: "Gate 271,000,004" (gas exchange in the alveoli).
   Shots (hard sitcom cuts): Ozzie slides down the last bronchiole into one alveolus (route map at ALVEOLI)
   -> the gate: Alvi welcomes him (lower third ALVI), Ozzie takes photos, Nigel drifts behind
   -> Alvi's confessional: 300-500 million; a fast zoom-out reveals a grid of identical Alvis; she raises her lanyard
   -> wide: every tiny Alvi raises the same lanyard -> close-up: Alvi's smile freezes
   -> capillary net -> the exchange wall (blood low O2 / high CO2; diffusion; Ozzie slides across; the red-blood-cell
      taxi and haemoglobin; CO2 crosses back; Colin steps out of the blood, lower third COLIN; Kavya asks who pushes)
   -> the ramp (passive, concentration gradient, no pump) -> Dennis: every breath keeps it steep
   -> "BUILT FOR SPEED" card -> 1 surface area (badminton court) -> 2 one cell thick (ruler) -> "not a diet"
   -> 3 moist (gases dissolve first) -> Kavya, eating, eyes shut -> 4 rich blood supply -> Dennis: TIMS
   -> breathing / gas exchange / respiration -> the muscle cell: word equation -> Mitch never looks up -> Dennis. */
scene('gates', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------------- local helpers (prefixed gts) ---------------- */
  const gtsPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.72 + 0.28 * clamp(p, 0, 1.2))), r); };
  const gtsCam = (g, k, fx, fy) => g.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  const gtsLabel = (parent, text, o) => { o = o || {}; return lhChip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,20,30,0.9)', stroke: o.stroke || 'rgba(255,255,255,0.35)', sw: 2, color: o.color || C.ink, boldFill: o.boldFill || LH.signTx, weight: o.weight || 700 }); };
  const gtsUse = (parent, id) => E('use', { href: '#' + id }, parent);
  // a numbered heading: amber disc with the number, then a chip; origin = left end
  function gtsHead(parent, n, text) {
    const g = G(parent);
    E('circle', { cx: 34, cy: 0, r: 34, fill: LH.signTx, stroke: INK, 'stroke-width': 4 }, g);
    T(g, 34, 15, String(n), { size: 44, weight: 800, anchor: 'middle', fill: INK });
    const c = gtsLabel(g, text, { size: 32 }); tr(c, 82 + c.w / 2, 0);
    g.w = 82 + c.w;
    return g;
  }
  // Alvi raises her lanyard badge (no arms: it floats up beside her face on its string)
  function gtsBadgeUp(a) {
    const g = a.firstChild;
    const badge = [...g.children].find(c => c.tagName === 'g' && c.textContent === 'GATE');
    const strap = badge ? badge.previousElementSibling : null;
    const up = G(g);
    E('path', { d: 'M40,52 L0,72 L-40,52 Q-104,36 -116,-24', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 5, 'stroke-linejoin': 'round' }, up);
    const b = G(up); tr(b, -124, -56, 1.6, -12);
    E('rect', { x: -26, y: -18, width: 52, height: 40, rx: 6, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, b);
    E('rect', { x: -26, y: -18, width: 52, height: 12, rx: 4, fill: '#3F5BD9' }, b);
    T(b, 0, 14, 'GATE', { size: 14, weight: 800, anchor: 'middle', fill: INK });
    const shine = E('path', { d: 'M-40,-30 L-34,-22 M40,-30 L34,-22 M0,-40 L0,-30', stroke: LH.signTx, 'stroke-width': 3, 'stroke-linecap': 'round' }, b);
    a.badgeUp = v => { op(up, v); if (badge) op(badge, 1 - v); if (strap) op(strap, 1 - v); op(shine, v); };
    a.badgeUp(0);
    a.film = E('circle', { r: 84, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 8, opacity: 0.75 }, g);   // "moist" lining
    g.insertBefore(a.film, g.children[3]);
    op(a.film, 0);
  }
  // Kavya with her eyes shut (lids drawn over her eyes)
  function gtsEyesShut(k) {
    const g = k.firstChild, lids = G(g);
    [-25, 25].forEach(x => {
      E('ellipse', { cx: x, cy: -22, rx: 18, ry: 19.5, fill: '#B9784E' }, lids);
      E('path', { d: `M${x - 14},-21 Q${x},-12 ${x + 14},-21`, fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, lids);
    });
    k.shut = v => op(lids, v);
    k.shut(0);
  }
  // Mitch, the mitochondrion (from Ep 2), with his tie
  function gtsMitch(parent) {
    return scMake(parent, { seed: 9, bob: 1.5, mood: 'deadpan',
      draw: g => {
        mitochondrion(g, 200, 96);
        E('path', { d: 'M-12,36 L12,36 L6,46 L-6,46 Z M-6,46 L6,46 L12,84 L0,96 L-12,84 Z', fill: '#3F5BD9', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      },
      face: { x: 0, y: -8, eye: 14, gap: 46, mouthW: 30, mouthY: 20, lidCol: C.mito } });
  }

  /* ---------------- shared art in <defs> (drawn once, placed with <use>) ---------------- */
  const D = G(defs());
  molO2(G(D, { id: 'gtsO2' }), 15);
  molCO2(G(D, { id: 'gtsCO2' }), 13);
  const tinyAlvi = cast(G(D, { id: 'gtsAlvi' }), 'alvi', { mood: 'happy' });
  gtsBadgeUp(tinyAlvi);
  const pat = E('pattern', { id: 'gtsSacPat', width: 24, height: 20, patternUnits: 'userSpaceOnUse' }, defs());
  E('rect', { width: 24, height: 20, fill: '#E86A8E' }, pat);
  E('circle', { cx: 12, cy: 10, r: 8.5, fill: LH.sac, stroke: '#B8466A', 'stroke-width': 2 }, pat);
  const revealCp = E('clipPath', { id: 'gtsCourtCp' }, defs());
  const revealR = E('rect', { x: 0, y: 610, width: 1200, height: 0 }, revealCp);
  const kinCp = E('clipPath', { id: 'gtsKinCp' }, defs());
  E('rect', { x: -146, y: -101, width: 292, height: 202, rx: 11 }, kinCp);

  /* ---------------- shot list ---------------- */
  const SH = [
    ['arrive', -1e9], ['gate', at('alvi') - 0.08], ['confA', at('thalvi') - 0.06], ['grid', at('all') - 0.06],
    ['shock', end('all') + 0.12], ['net', at('net') - 0.06], ['exch', at('back') - 0.06], ['ramp', at('nopump') - 0.06],
    ['steep', at('steep') - 0.06], ['speed', at('area') - 0.06], ['court', mid('area', 0.19)], ['thin', at('thin') - 0.06],
    ['diet', at('thdiet') - 0.06], ['moist', at('moist') - 0.06], ['stop', at('stop') - 0.06], ['blood', at('blood') - 0.06],
    ['tims', at('tims') - 0.06], ['three', at('three') - 0.06], ['eq', at('eq') - 0.06], ['last', end('mitch') + 0.55],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };

  /* ---------------- layers ---------------- */
  const cam = G(root), BG = G(cam), PR = G(cam), CA = G(cam), FG = G(cam), HUD = G(root);
  const ALL = [];
  const M = el => { ALL.push(el); return el; };

  /* ---------------- sets ---------------- */
  const wall = M(E('rect', { x: -4000, y: -4000, width: 9000, height: 9000, fill: '#4E1F38' }, BG));
  const plum = M(E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1428', '#5E2240', true) }, BG));
  const veins = M(E('path', { d: 'M-20,700 Q200,520 160,300 Q140,160 260,40 M1220,690 Q980,560 1040,330 Q1080,170 960,30 M160,300 Q60,240 -10,250 M1040,330 Q1150,280 1220,300', fill: 'none', stroke: '#8E2B4A', 'stroke-width': 26, 'stroke-linecap': 'round', opacity: 0.45 }, BG));
  const term = M(lhTerminal(BG));
  const exWrap = M(G(BG)), exch = lhExchange(exWrap);
  const confA = M(lhConf(BG, 'alvi'));
  const confD = confA, gradA = linGrad(LH_TINT.alvi[0], LH_TINT.alvi[1], true), gradD = linGrad(LH_TINT.dennis[0], LH_TINT.dennis[1], true);
  const cellBg = M(G(BG));
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5A1420', '#2E0A12', true) }, cellBg);
  { let d = ''; for (let y = 60; y < 760; y += 46) d += `M0,${y} Q300,${y - 18} 600,${y} T1200,${y} `; E('path', { d, fill: 'none', stroke: '#7A2230', 'stroke-width': 10, opacity: 0.5 }, cellBg); }

  /* ---------------- props ---------------- */
  // route map (arrive)
  const threeHost = G(PR);
  const route = M(lhRouteMap(PR));
  // the cluster (arrive, net, three)
  const cluster = M(lhCluster(PR));
  const sacGlow = M(E('circle', { r: 70, fill: glow('#FFE45C') }, PR));
  const SACS = [[0, -30, 44], [-70, -4, 44], [70, -4, 44], [-36, 60, 46], [40, 62, 46], [-96, 70, 38], [100, 72, 38], [0, 120, 40], [-62, 124, 34], [64, 128, 34]];
  const capNet = M(G(PR));
  { let cap = ''; SACS.forEach(([x, y, r]) => { cap += `M${x - r * 0.9},${y + r * 0.3} Q${x},${y + r * 1.1} ${x + r * 0.9},${y + r * 0.3} M${x - r * 0.4},${y - r * 0.9} Q${x - r * 0.2},${y} ${x - r * 0.6},${y + r * 0.7} `; });
    E('path', { d: cap, fill: 'none', stroke: '#FF6B7E', 'stroke-width': 15, 'stroke-linecap': 'round', opacity: 0.45 }, capNet);
    capNet.flow = E('path', { d: cap, fill: 'none', stroke: '#FFD0D8', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '8 14' }, capNet); }
  // gate sign
  const gateSign = M(lhSign(PR, 'GATE 271,000,004', { size: 34, icon: 'plane' }));
  // the grid of identical Alvis (confA / grid)
  const ZC = [430, 410], ZK = 0.22, ZD = 130 / ZK;
  const gpat = E('pattern', { id: 'gtsGridPat', x: ZC[0] - ZD / 2, y: ZC[1] - ZD / 2, width: ZD, height: ZD, patternUnits: 'userSpaceOnUse' }, defs());
  tr(gtsUse(gpat, 'gtsAlvi'), ZD / 2, ZD / 2, 1.5);
  const grid = M(E('rect', { x: ZC[0] - 6.5 * ZD, y: ZC[1] - 4.5 * ZD, width: 13 * ZD, height: 9 * ZD, fill: 'url(#gtsGridPat)' }, PR));
  // exchange molecules
  const molG = M(G(PR));
  const mk = (id, x, y) => ({ el: gtsUse(molG, id), x, y });
  const AO2 = [[300, 250], [430, 250], [360, 330], [470, 380], [330, 470], [460, 480], [390, 590], [480, 300]].map(([x, y]) => mk('gtsO2', x, y));
  const BO2 = [[1010, 250], [1090, 560]].map(([x, y]) => mk('gtsO2', x, y));
  const BCO2 = [[720, 260], [880, 300], [1110, 290], [960, 390], [1110, 440], [880, 580], [1010, 650]].map(([x, y]) => mk('gtsCO2', x, y));
  const ACO2 = [[260, 600], [500, 410]].map(([x, y]) => mk('gtsCO2', x, y));
  // movers: [molecule, destination, start, duration]
  const MOVE = [
    [AO2[1], [770, 320], mid('diffusion', 0.35), 3.2], [AO2[3], [830, 440], mid('diffusion', 0.5), 3.4], [AO2[5], [760, 520], mid('diffusion', 0.62), 3.0],
    [BCO2[0], [420, 200], mid('diffusion', 0.42), 3.3], [BCO2[3], [250, 300], mid('diffusion', 0.58), 3.5],
    [BCO2[1], [330, 540], mid('co2', 0.12), 2.6], [BCO2[4], [470, 640], mid('co2', 0.25), 2.8], [BCO2[5], [200, 260], mid('co2', 0.4), 2.6],
  ];
  const ALLMOL = [...AO2, ...BO2, ...BCO2, ...ACO2];
  const arrO2 = M(arrow(PR, 500, 290, 700, 290, { color: C.oxygen, width: 9, head: 28 }));
  const arrCO2 = M(arrow(PR, 700, 470, 500, 470, { color: C.co2, width: 9, head: 28 }));
  // the red-blood-cell taxi
  const taxi = M(lhRBC(PR, 1.3));
  // ramp (nopump / steep)
  const ramp = M(G(PR));
  E('path', { d: 'M600,300 L1120,560 L1120,580 L600,580 Z', fill: linGrad('#F48FA6', '#8E2B4A', true), stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, ramp);
  T(ramp, 600, 262, 'HIGH concentration', { size: 30, weight: 800, fill: '#FFD0D8' });
  T(ramp, 1130, 622, 'LOW concentration', { size: 30, weight: 800, anchor: 'end', fill: '#FFD0D8' });
  const pump = G(ramp); tr(pump, 1010, 190);
  E('rect', { x: -30, y: -40, width: 60, height: 90, rx: 10, fill: '#9AA6B2', stroke: INK, 'stroke-width': 4 }, pump);
  E('path', { d: 'M0,-40 L0,-74 M-30,-74 L30,-74', stroke: INK, 'stroke-width': 8, 'stroke-linecap': 'round' }, pump);
  E('path', { d: 'M30,30 Q70,30 70,60', fill: 'none', stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, pump);
  const pumpX = cross(pump, 50, '#FF3B3B');
  T(pump, 0, 96, 'NO PUMP', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const rollers = [0, 1, 2, 3, 4].map(() => gtsUse(ramp, 'gtsO2'));
  const fresh = [0, 1, 2].map(() => gtsUse(ramp, 'gtsO2'));
  const freshArr = arrow(ramp, 440, 250, 560, 270, { color: C.air, width: 6, head: 20 });
  const freshTx = T(ramp, 430, 230, 'fresh air', { size: 26, weight: 700, anchor: 'end', fill: C.air });
  // badminton court
  const court = M(G(PR));
  const CY0 = 300, CY1 = 610, cl = y => lerp(690, 560, (y - CY0) / (CY1 - CY0)), cr = y => lerp(1030, 1160, (y - CY0) / (CY1 - CY0));
  const quad = (y0, y1) => `M${cl(y0)},${y0} L${cr(y0)},${y0} L${cr(y1)},${y1} L${cl(y1)},${y1} Z`;
  E('path', { d: quad(CY0 - 14, CY1 + 14), fill: '#2F8F5B', stroke: INK, 'stroke-width': 5 }, court);
  E('path', { d: quad(CY0, CY1), fill: 'url(#gtsSacPat)', 'clip-path': 'url(#gtsCourtCp)' }, court);
  { const ym = 440, ys1 = 400, ys2 = 490, xm = y => (cl(y) + cr(y)) / 2;
    let d = quad(CY0, CY1) + ` M${cl(ys1)},${ys1} L${cr(ys1)},${ys1} M${cl(ys2)},${ys2} L${cr(ys2)},${ys2} M${xm(CY0)},${CY0} L${xm(ys1)},${ys1} M${xm(ys2)},${ys2} L${xm(CY1)},${CY1}`;
    E('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, court);
    E('path', { d: `M${cl(ym) - 8},${ym} L${cl(ym) - 8},${ym - 60} L${cr(ym) + 8},${ym - 60} L${cr(ym) + 8},${ym}`, fill: 'rgba(255,255,255,0.18)', stroke: '#FFFFFF', 'stroke-width': 4 }, court); }
  // thin: the ruler (screen coordinates of the zoomed wall: 516..688)
  const ruler = M(G(PR));
  E('path', { d: 'M516,402 L516,458 M688,402 L688,458', stroke: '#FFFFFF', 'stroke-width': 6 }, ruler);
  arrow(ruler, 600, 430, 520, 430, { color: '#FFFFFF', width: 6, head: 18 }); arrow(ruler, 604, 430, 684, 430, { color: '#FFFFFF', width: 6, head: 18 });
  { const c = gtsLabel(ruler, '**tiny distance**', { size: 30 }); tr(c, 602, 500); }
  const zipO2 = M(gtsUse(PR, 'gtsO2'));
  // moist panel
  const moistP = M(G(PR));
  E('rect', { x: 660, y: 170, width: 480, height: 430, rx: 18, fill: '#3A2A4E', stroke: '#FFFFFF', 'stroke-width': 4 }, moistP);
  E('rect', { x: 662, y: 330, width: 476, height: 42, fill: '#4CC9F0', opacity: 0.6 }, moistP);
  E('rect', { x: 662, y: 372, width: 476, height: 36, fill: LH.sac, stroke: LH.sacDk, 'stroke-width': 3 }, moistP);
  E('rect', { x: 662, y: 408, width: 476, height: 36, fill: '#F7B6C4', stroke: '#B8466A', 'stroke-width': 3 }, moistP);
  E('path', { d: 'M662,444 L1138,444 L1138,580 Q1138,598 1120,598 L680,598 Q662,598 662,580 Z', fill: '#8E1F2A' }, moistP);
  T(moistP, 1124, 212, 'air', { size: 28, weight: 800, anchor: 'end', fill: '#FFFFFF' });
  T(moistP, 1124, 362, 'water', { size: 26, weight: 800, anchor: 'end', fill: '#06283A' });
  T(moistP, 1124, 418, 'wall', { size: 26, weight: 800, anchor: 'end', fill: INK });
  T(moistP, 1124, 584, 'blood', { size: 28, weight: 800, anchor: 'end', fill: '#FFFFFF' });
  const drops = [0, 1, 2, 3].map(() => ({ m: gtsUse(moistP, 'gtsO2'), d: E('circle', { r: 7, fill: C.oxygen, stroke: '#FFE1DC', 'stroke-width': 2 }, moistP) }));
  // blood: carried-away arrows
  const awayArr = M(G(PR));
  [800, 1000].forEach(x => arrow(awayArr, x, 180, x, 600, { color: '#FFD0D8', width: 8, head: 26 }));
  const bloodO2 = [0, 1, 2, 3, 4].map(() => gtsUse(molG, 'gtsO2'));
  // three panels
  const three = M(G(threeHost));
  const PAN = [[210, 'BREATHING', 'moves air'], [600, 'GAS EXCHANGE', 'swaps gases'], [990, 'RESPIRATION', 'in cells']].map(([x, ti, su]) => {
    const g = G(three); tr(g, x, 0);
    const box = E('rect', { x: -175, y: 150, width: 350, height: 420, rx: 20, fill: '#1A0E18', stroke: '#6E3A52', 'stroke-width': 4 }, g);
    T(g, 0, 206, ti, { size: 34, weight: 800, anchor: 'middle', fill: LH.signTx });
    T(g, 0, 544, su, { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    return { g, box, x };
  });
  const lungA = G(PAN[0].g); tr(lungA, 0, 370); const lungArt = lungs(lungA, 0.62);
  const lungAir = arrow(PAN[0].g, 0, 250, 0, 290, { color: C.air, width: 7, head: 20 });
  const mcell = G(PAN[2].g); tr(mcell, 0, 380);
  const mcellM = animalCell(mcell, 125, 86, { fill: 'rgba(232,66,79,0.28)', stroke: '#F28A97', nx: -60, ny: -20, nr: 22, seed: 5 });
  tr(mitochondrion(mcell, 74, 34), 40, -20); tr(mitochondrion(mcell, 60, 28, { folds: 3 }), 20, 40);
  // eq: the muscle cell, the board, Mitch's desk
  const bigCell = M(animalCell(PR, 360, 150, { fill: 'rgba(232,66,79,0.22)', stroke: '#F28A97', nucleus: false, seed: 8, sw: 6 }));
  const board = M(G(PR));
  E('rect', { x: 110, y: 118, width: 980, height: 200, rx: 16, fill: '#F7F4EC', stroke: '#8A6A4A', 'stroke-width': 8 }, board);
  const EQ = [['glucose', C.glucose, '#3A2600', 0.47], ['+', 0, 0, 0.55], ['oxygen', C.oxygen, '#FFFFFF', 0.58], ['→', 0, 0, 0.67], ['carbon dioxide', C.carbon, '#FFFFFF', 0.72], ['+', 0, 0, 0.86], ['water', C.water, '#06283A', 0.89]].map(([tx, f, c, fr]) => {
    const g = G(board);
    if (tx === '+') { T(g, 0, 14, '+', { size: 44, weight: 800, anchor: 'middle', fill: '#5A4A3A' }); return { g, w: 34, fr }; }
    if (tx === '→') { arrow(g, -26, 0, 26, 0, { color: '#2A1A22', width: 6, head: 20 }); return { g, w: 58, fr }; }
    const ch = lhChip(g, tx, { size: 32, fill: f, color: c, stroke: INK, sw: 3 }); return { g, w: ch.w, fr };
  });
  { let tot = 0; EQ.forEach((e, i) => tot += e.w + (i ? 12 : 0)); let x = 600 - tot / 2; EQ.forEach((e, i) => { if (i) x += 12; e.x = x + e.w / 2; x += e.w; }); }
  const eqTi = T(board, 600, 166, 'respiration, in the muscle cell:', { size: 30, weight: 700, anchor: 'middle', fill: '#8A6A4A' });
  const eqEn = G(board);
  const eqSpark = spark(eqEn, 22, { seed: 2 });
  T(eqEn, 34, 11, 'energy released', { size: 30, weight: 700, fill: '#B57B12' });
  const desk = M(G(FG));
  E('rect', { x: -130, y: -10, width: 260, height: 20, rx: 6, fill: '#8A5A3A', stroke: INK, 'stroke-width': 4 }, desk);
  E('rect', { x: -116, y: 10, width: 232, height: 62, fill: '#6B4A33', stroke: INK, 'stroke-width': 4 }, desk);
  T(desk, 0, 52, 'MITCH', { size: 28, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 3 });
  E('path', { d: 'M84,-10 L88,-34 L126,-34 L122,-10 Z M90,-34 L94,-46 L130,-46 L126,-34', fill: '#FFFFFF', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, desk);
  const flash = M(E('circle', { r: 60, fill: glow('#FFFFFF') }, FG));

  /* ---------------- cast ---------------- */
  const CAST = {};
  ['nigel', 'alvi', 'ozzie', 'colin', 'dennis'].forEach(k => { CAST[k] = cast(CA, k); });
  gtsBadgeUp(CAST.alvi);
  const mitch = gtsMitch(CA);

  // Colin's sunglasses: up on his head, or down over his eyes
  {
    const g = CAST.colin.firstChild, face = g.lastElementChild, orig = face.previousElementSibling;
    const down = G(g);
    E('path', { d: 'M-58,-24 L-6,-24 L-10,2 Q-30,14 -52,4 Z M6,-24 L58,-24 L52,4 Q30,14 10,2 Z', fill: '#1E2630', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, down);
    E('path', { d: 'M-6,-20 L6,-20 M-58,-22 L-74,-28 M58,-22 L74,-28', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, down);
    E('path', { d: 'M-46,-16 L-32,-16 M18,-16 L32,-16', stroke: '#8FA3B8', 'stroke-width': 3, 'stroke-linecap': 'round' }, down);
    CAST.colin.shades = v => { op(down, v > 0.5 ? 1 : 0); op(orig, v > 0.5 ? 0 : 1); };
    CAST.colin.shades(0);
  }

  /* ---------------- HUD ---------------- */
  const hc = (text, o) => M(gtsLabel(HUD, text, o));
  const cOne = hc('1 alveolus = 1 tiny **air sac**');
  const cAlv = hc('**alveolus** = an air sac', { size: 34 });
  const cMil = M(G(HUD));
  { E('rect', { x: -190, y: -50, width: 380, height: 140, rx: 22, fill: 'rgba(30,8,20,0.88)', stroke: LH.signTx, 'stroke-width': 3 }, cMil); T(cMil, 0, 12, '300–500 million', { size: 44, weight: 800, anchor: 'middle', fill: LH.signTx }); T(cMil, 0, 64, 'alveoli in your lungs', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' }); }
  const cCap = hc('**capillaries**: the tiniest blood vessels', { size: 32 });
  const capArr = M(arrow(HUD, 760, 300, 560, 380, { color: LH.signTx, width: 6, head: 22 }));
  const cAir = hc('**high O_2**, low CO_2', { size: 30 }), cAirS = M(T(HUD, 280, 214, 'air in the alveolus', { size: 26, weight: 700, anchor: 'middle', fill: '#E3D7FF' }));
  const cBl = hc('low O_2, **high CO_2**', { size: 30 }), cBlS = M(T(HUD, 920, 214, 'blood back from the body', { size: 26, weight: 700, anchor: 'middle', fill: '#FFD0D8' }));
  const cDif = hc('**diffusion**: high concentration → low concentration', { size: 30 });
  const cWhee = hc('**O_2** → blood', { size: 34 });
  const cRbc = hc('**red blood cell**', { size: 32 });
  const cHb = hc('carries O_2 using **haemoglobin**', { size: 30 });
  const cCo2 = hc('**CO_2** → air (to be breathed out)', { size: 30 });
  const cPass = hc('**passive**: down the **concentration gradient**', { size: 32 });
  const cSteep = hc('fresh air keeps the gradient **steep**', { size: 32 });
  const h1 = M(gtsHead(HUD, 1, 'huge **surface area**')), h2 = M(gtsHead(HUD, 2, '**thin** walls')), h3 = M(gtsHead(HUD, 3, '**moist** lining')), h4 = M(gtsHead(HUD, 4, 'rich **blood supply**'));
  const cCourt = hc('≈ **70 m²** · a badminton court', { size: 34 });
  const cThin = hc('**one cell** + **one cell** = a tiny **distance**', { size: 32 });
  const thinL = M(G(HUD));
  T(thinL, 480, 236, 'alveolus wall', { size: 28, weight: 800, anchor: 'end', fill: '#FFD3DE' });
  T(thinL, 480, 270, '1 cell thick', { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  T(thinL, 724, 236, 'capillary wall', { size: 28, weight: 800, fill: '#FFD3DE' });
  T(thinL, 724, 270, '1 cell thick', { size: 28, weight: 700, fill: '#FFFFFF' });
  arrow(thinL, 486, 262, 548, 300, { color: '#FFFFFF', width: 5, head: 16 }); arrow(thinL, 718, 262, 656, 300, { color: '#FFFFFF', width: 5, head: 16 });
  const job = M(G(HUD));
  E('rect', { x: -200, y: -150, width: 400, height: 300, rx: 16, fill: '#FFFDF4', stroke: '#8A6A4A', 'stroke-width': 6 }, job);
  E('rect', { x: -200, y: -150, width: 400, height: 62, rx: 16, fill: '#3F5BD9' }, job);
  T(job, 0, -108, 'JOB REQUIREMENTS', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 1 });
  const jobRows = ['one cell thick', 'always moist', 'wear lanyard'].map((s, i) => { const r = G(job); tr(r, 0, -40 + i * 66); tick(r, 14).setAttribute('transform', 'translate(-150 -10)'); T(r, -118, 0, s, { size: 30, weight: 700, fill: INK }); return r; });
  const cDis = hc('gases **dissolve** first', { size: 34 });
  const cRich = hc('blood carries O_2 away → gradient stays **steep**', { size: 30 });
  const tims = M(G(HUD));
  E('rect', { x: -255, y: -190, width: 510, height: 380, rx: 20, fill: 'rgba(14,10,18,0.92)', stroke: LH.signTx, 'stroke-width': 4 }, tims);
  const timsT = T(tims, 0, -130, 'TIMS', { size: 56, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 8 });
  const timsR = [['T', 'thin walls'], ['I', 'lots of blood **in** capillaries'], ['M', 'moist lining'], ['S', 'big surface area']].map(([l, s], i) => {
    const r = G(tims); tr(r, -220, -62 + i * 74);
    T(r, 18, 18, l, { size: 56, weight: 800, anchor: 'middle', fill: LH.signTx });
    T(r, 56, 10, s, { size: 27, weight: 700, fill: '#FFFFFF', boldFill: LH.signTx });
    return r;
  });
  const hi = M(G(HUD));
  E('path', { d: 'M-70,-34 Q-70,-56 -48,-56 L48,-56 Q70,-56 70,-34 L70,-6 Q70,16 48,16 L-6,16 L-26,36 L-22,16 L-48,16 Q-70,16 -70,-6 Z', fill: '#FFFFFF', stroke: INK, 'stroke-width': 4 }, hi);
  T(hi, 0, -8, 'hi Mitch!', { size: 26, weight: 800, anchor: 'middle', fill: INK });
  const cMus = hc('muscle cell', { size: 28 });
  // the BUILT FOR SPEED card
  const speed = M(G(HUD));
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FFD23F', '#FF9A3D', true) }, speed);
  { let d = ''; for (let i = 0; i < 9; i++) { const y = 120 + i * 62; d += `M${-200 + (i % 3) * 90},${y} L${380 + (i % 4) * 60},${y} `; } E('path', { d, stroke: '#FFFFFF', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.55 }, speed); }
  const spIn = G(speed);
  T(spIn, 0, -40, 'ALVEOLI:', { size: 64, weight: 800, anchor: 'middle', fill: '#5A1F33', ls: 4 });
  T(spIn, 0, 60, 'BUILT FOR SPEED', { size: 88, weight: 800, anchor: 'middle', fill: '#5A1F33', ls: 2 });
  // Kavya inset
  const kin = M(G(HUD));
  E('rect', { x: -150, y: -105, width: 300, height: 210, rx: 14, fill: linGrad('#F6DDB6', '#EBC795', true), stroke: '#FFFFFF', 'stroke-width': 5 }, kin);
  const kinClip = G(kin, { 'clip-path': 'url(#gtsKinCp)' });
  E('rect', { x: -150, y: 40, width: 300, height: 70, fill: '#2FA59A' }, kinClip);
  E('rect', { x: 58, y: -86, width: 78, height: 58, rx: 4, fill: linGrad('#6FC8FF', '#CFEFFF', true), stroke: '#FFFFFF', 'stroke-width': 4 }, kinClip);
  E('path', { d: 'M97,-86 L97,-28 M58,-57 L136,-57', stroke: '#FFFFFF', 'stroke-width': 3 }, kinClip);
  const kinK = cast(kinClip, 'kavya'); gtsEyesShut(kinK);
  const kinSnack = lhSnack(kinClip, 0.38);
  const kinLive = lhChip(kin, 'LIVE · SOFA', { size: 22, fill: '#D32F2F', color: '#FFFFFF', h: 34 }); tr(kinLive, -150 + kinLive.w / 2 + 10, -105 + 26);
  const ltA = M(scLowerThird(HUD, ...LH_LOWER.alvi)), ltC = M(scLowerThird(HUD, ...LH_LOWER.colin));

  /* ================= update ================= */
  return t => {
    ALL.forEach(e => op(e, 0));
    const sh = shotAt(t), pose = {};
    let k = 1, fx = 600, fy = 375;
    const who = scWho(S, t);
    const lookAtX = (fromX, toX) => clamp((toX - fromX) / 160, -1, 1);
    CAST.alvi.badgeUp(0); op(CAST.alvi.film, 0); kinK.shut(0); op(kinLive, 1); tr(kinSnack, 92, 68, 0.38); tinyAlvi.badgeUp(0);
    const breath = AMP * wave(t, 4);

    /* ---------- arrive: down the last bronchiole ---------- */
    if (sh === 'arrive') {
      op(plum, 1); op(veins, 1); op(route, 1); op(cluster, 1);
      tr(route, 100, 150); route.set(lerp(0.75, 1, P(t, at('end') - 0.3, 1.6)));
      tr(cluster, 600, 475, 1.25); cluster.upd(t);
      const lit = P(t, mid('end', 0.62), 0.4, linear);
      op(sacGlow, lit * (0.75 + 0.25 * wave(t, 0.8))); tr(sacGlow, 600, 437, 0.9 + 0.15 * lit);
      const u = P(t, at('end') - 0.2, 2.6, easeOut);
      pose.ozzie = { x: 600 + 10 * Math.sin(u * 9) * (1 - u), y: lerp(230, 432, u), s: 0.3, r: 18 * Math.sin(u * 7) * (1 - u), mood: u < 1 ? 'shock' : 'happy', look: 0 };
      gtsPop(cOne, 960, 470, P(t, mid('end', 0.72), 0.45, pop));
    }

    /* ---------- gate: Alvi welcomes Ozzie ---------- */
    if (sh === 'gate') {
      op(term, 1); op(gateSign, 1); tr(gateSign, 820, 222);
      const hop = Math.abs(Math.sin((t - at('alvi')) * 6)) * 16 * AMP * (1 - P(t, mid('alvi', 0.3), 0.3, linear));
      pose.alvi = { x: 380, y: 410 - hop, s: 1.2, mood: 'happy', look: t > mid('alvi', 0.4) ? 0 : 0.6 };
      pose.ozzie = { x: 900, y: 540, s: 0.62, mood: 'happy', look: -1 };
      pose.nigel = { x: lerp(1150, 720, clamp((t - at('alvi') + 0.1) / 6)), y: 445, s: 0.5, mood: 'neutral', look: 0 };
      const fl = Math.max(win(t, mid('alvi', 0.36), mid('alvi', 0.36) + 0.22, 0.08), win(t, mid('alvi', 0.6), mid('alvi', 0.6) + 0.22, 0.08));
      op(flash, fl); tr(flash, 896, 590, 1 + fl);
      gtsPop(cAlv, 860, 340, P(t, mid('alvi', 0.8), 0.45, pop));
      ltA.set(win(t, at('alvi') + 0.3, at('alvi') + 3.5, 0.3));
    }

    /* ---------- Alvi's confessional: 300-500 million ---------- */
    if (sh === 'confA' || sh === 'grid' || sh === 'shock' || sh === 'diet') {
      op(confA, 1); confA.set(1, t); attr(confA.firstChild, 'fill', gradA);
      let a = { x: ZC[0], y: ZC[1], s: 1.5, mood: 'happy', look: 0 };
      if (sh === 'confA') {
        const zo = P(t, mid('thalvi', 0.22), 0.5, easeOut), zi = P(t, mid('thalvi', 0.64), 0.35, easeIn);
        const z = zo * (1 - zi);
        k = lerp(1, ZK, z); fx = ZC[0]; fy = ZC[1];
        op(wall, z > 0.01 ? 1 : 0); op(confA, 1 - clamp(z * 3)); op(grid, clamp(z * 4));
        CAST.alvi.badgeUp(P(t, mid('thalvi', 0.74), 0.3, pop));
        if (t > mid('thalvi', 0.66)) a.mood = 'smug';
        gtsPop(cMil, 900, 230, P(t, mid('thalvi', 0.18), 0.45, pop));
      }
      if (sh === 'grid') {
        k = ZK; fx = ZC[0]; fy = ZC[1]; op(wall, 1); op(confA, 0); op(grid, 1);
        const b = P(t, mid('all', 0.45), 0.35, pop);
        CAST.alvi.badgeUp(b); tinyAlvi.badgeUp(b);
      }
      if (sh === 'shock') {
        k = 1 + 0.07 * P(t, end('all') + 0.15, 1.0); fx = ZC[0]; fy = ZC[1] - 40;
        a.mood = 'shock'; a.still = true; CAST.alvi.badgeUp(1);
      }
      if (sh === 'diet') {
        a.mood = 'annoyed'; CAST.alvi.badgeUp(1);
        k = 1 + 0.06 * P(t, end('thdiet') - 0.1, 1.0); fx = ZC[0]; fy = ZC[1];
        gtsPop(job, 920, 330, P(t, mid('thdiet', 0.08), 0.45, pop));
        jobRows.forEach((r, i) => op(r, P(t, mid('thdiet', 0.2 + i * 0.2), 0.25, linear)));
      }
      pose.alvi = a;
      tinyAlvi.set({ t, mood: 'happy', look: 0 });
    }

    /* ---------- the capillary net ---------- */
    if (sh === 'net') {
      op(plum, 1); op(veins, 1); op(cluster, 1); op(capNet, 1);
      const s = 1.45 * (1 + 0.03 * Math.sin(t * 1.6));
      tr(cluster, 400, 450, 1.45); cluster.upd(t); tr(capNet, 400, 450, s);
      attr(capNet.flow, 'stroke-dashoffset', (-t * 40 * AMP).toFixed(1));
      op(capNet, P(t, mid('net', 0.4), 0.5, linear));
      gtsPop(cCap, 850, 240, P(t, mid('net', 0.42), 0.45, pop));
      capArr.set(P(t, mid('net', 0.5), 0.4)); op(capArr, P(t, mid('net', 0.5), 0.1, linear));
    }

    /* ---------- the exchange wall ---------- */
    if (sh === 'exch' || sh === 'blood' || sh === 'thin') {
      op(exWrap, 1);
      exch.upd(sh === 'blood' ? t * 3.5 : t);
      if (sh === 'thin') exWrap.setAttribute('transform', 'translate(600 375) scale(2.2) translate(-600 -375)');
      else exWrap.removeAttribute('transform');
    }
    if (sh === 'exch') {
      op(molG, 1); bloodO2.forEach(u => op(u, 0));
      ALLMOL.forEach((m, i) => { tr(m.el, m.x + Math.sin(t * 1.7 + i * 2.1) * 6 * AMP, m.y + Math.cos(t * 1.3 + i * 1.7) * 6 * AMP, 1, Math.sin(t + i) * 12 * AMP); op(m.el, 1); });
      MOVE.forEach(([m, [x1, y1], t0, dur], i) => {
        const u = P(t, t0, dur, ease);
        if (u <= 0) return;
        const jx = Math.sin(t * 1.7 + i * 2.1) * 6 * AMP, jy = Math.cos(t * 1.3 + i * 1.7) * 6 * AMP;
        tr(m.el, lerp(m.x, x1, u) + jx, lerp(m.y, y1, u) + jy + Math.sin(u * Math.PI) * -30, 1, u * 360);
      });
      // labels
      const lab = 1 - P(t, mid('diffusion', 0.3), 0.25, linear);
      gtsPop(cBl, 920, 162, P(t, mid('back', 0.4), 0.45, pop) * lab); op(cBlS, P(t, mid('back', 0.45), 0.3, linear) * lab);
      gtsPop(cAir, 280, 162, P(t, mid('back', 0.82), 0.45, pop) * lab); op(cAirS, P(t, mid('back', 0.86), 0.3, linear) * lab);
      gtsPop(cDif, 600, 676, P(t, mid('diffusion', 0.1), 0.45, pop) * (1 - P(t, at('off') + 0.1, 0.25, linear)));
      const ar = win(t, mid('diffusion', 0.35), at('off') + 0.3, 0.25);
      arrO2.set(P(t, mid('diffusion', 0.35), 0.5)); op(arrO2, ar); arrCO2.set(P(t, mid('diffusion', 0.42), 0.5)); op(arrCO2, ar);
      // Ozzie waits in the air, then slides across the wall
      const sl = P(t, at('whee') - 0.1, 1.5, ease);
      let oz = { x: 200, y: 430, s: 0.5, mood: 'happy', look: 0.6 };
      if (t >= at('whee') - 0.1) {
        const sx = lerp(330, 860, sl), sy = lerp(400, 500, sl) - Math.sin(sl * Math.PI) * 60;
        oz = { x: lerp(200, sx, P(t, at('whee') - 0.1, 0.2, linear)), y: sy, s: 0.5, r: Math.sin(sl * Math.PI) * 25, mood: 'happy', look: 1 };
      } else if (t >= at('off') - 0.2) oz.x = lerp(200, 330, P(t, at('off'), 1.5));
      // rbc taxi
      const tIn = P(t, at('rbc') - 0.3, 1.4, easeOut), tOut = P(t, mid('co2', 0.2), 2.4, easeIn);
      const tx = 880, ty = lerp(-140, 470, tIn) + lerp(0, 520, tOut);
      if (t >= at('rbc') - 0.3) { op(taxi, 1); tr(taxi, tx, ty, 1.3, 4 * Math.sin(t * 3) * AMP); }
      if (t >= mid('rbc', 0.32)) {
        const h = P(t, mid('rbc', 0.32), 0.5, ease);
        oz = { x: lerp(860, tx - 39, h), y: lerp(500, ty - 70, h) - Math.sin(h * Math.PI) * 60, s: lerp(0.5, 0.3, h), mood: 'happy', look: 0.4 };
      }
      if (ty < 840) pose.ozzie = oz;
      gtsPop(cWhee, 600, 676, P(t, mid('whee', 0.3), 0.4, pop) * (1 - P(t, at('rbc') + 0.2, 0.25, linear)));
      gtsPop(cRbc, 880, 300, P(t, mid('rbc', 0.12), 0.45, pop) * (1 - P(t, at('co2') + 0.1, 0.25, linear)));
      gtsPop(cHb, 900, 612, P(t, mid('rbc', 0.62), 0.45, pop) * (1 - P(t, at('co2') + 0.1, 0.25, linear)));
      gtsPop(cCo2, 600, 676, P(t, mid('co2', 0.2), 0.45, pop) * (1 - P(t, at('colin') + 0.1, 0.25, linear)));
      // Alvi tells Ozzie to go
      if (t >= at('off') - 0.2 && t < at('rbc') + 0.5) {
        const ap = P(t, at('off') - 0.2, 0.4, pop) * (1 - P(t, at('rbc'), 0.4, ease));
        pose.alvi = { x: 140, y: 600 + 160 * (1 - ap), s: 0.62, mood: 'happy', look: 1 };
      }
      // Colin steps out of the blood, through the wall
      if (t >= at('colin') - 0.4) {
        const rise = P(t, at('colin') - 0.4, 0.8, easeOut), walk = P(t, mid('colin', 0.08), 1.2, ease);
        const shades = win(t, mid('colin', 0.42), mid('colin', 0.8), 0.08);
        pose.colin = { x: lerp(940, 360, walk), y: lerp(820, 420, rise), s: 0.95, mood: 'smug', look: sh === 'exch' && t >= at('pumps') - 0.2 ? 1 : (walk < 1 ? -0.6 : 0), shades };
        ltC.set(win(t, mid('colin', 0.25), mid('colin', 0.25) + 3.2, 0.3));
      }
      if (t >= at('pumps') - 0.1) {
        gtsPop(kin, 1000, 250, P(t, at('pumps') - 0.1, 0.4, pop));
        kinK.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'neutral', look: -0.6 }); tr(kinK, -10, 48, 0.62);
      }
    }

    /* ---------- ramp: passive, no pump; Dennis keeps it steep ---------- */
    if (sh === 'ramp' || sh === 'steep') {
      op(plum, 1); op(ramp, 1);
      const rate = sh === 'steep' ? 0.2 : 0.16;
      rollers.forEach((u, i) => {
        const q = (t * rate + i / 5) % 1;
        tr(u, lerp(610, 1100, q) + 8, lerp(305, 550, q) - 22, 1, q * 900);
        op(u, Math.min(1, q * 8, (1 - q) * 8));
      });
      op(pumpX, P(t, mid('nopump', 0.15), 0.25, linear));
      tr(pumpX, 0, 0, Math.max(0.01, P(t, mid('nopump', 0.15), 0.35, pop)));
      if (sh === 'ramp') {
        pose.alvi = { x: 290, y: 430, s: 1.15, mood: 'happy', look: 0.5 };
        gtsPop(cPass, 790, 684, P(t, mid('nopump', 0.45), 0.45, pop));
        fresh.forEach(f => op(f, 0)); op(freshArr, 0); op(freshTx, 0);
      } else {
        const ever = t > mid('steep', 0.72);
        k = ever ? 1 + 0.07 * P(t, mid('steep', 0.74), 1.3) : 1; fx = 290; fy = 430;
        pose.dennis = { x: 290, y: 450, s: 1.0, mood: ever ? 'deadpan' : 'neutral', look: ever ? 0 : 0.6, flat: wave(t, 4) };
        const tin = P(t, mid('steep', 0.12), 0.4, linear);
        fresh.forEach((f, i) => { const q = ((t - at('steep')) / 4 + i * 0.12) % 1, a = Math.sin(Math.PI * clamp(q * 2.2)); tr(f, lerp(470, 640, clamp(q * 2.2)), 262 + i * 24, 1, q * 400); op(f, tin * a); });
        op(freshArr, tin); op(freshTx, tin);
        gtsPop(cSteep, 790, 684, P(t, mid('steep', 0.32), 0.45, pop));
      }
    }

    /* ---------- BUILT FOR SPEED, then the badminton court ---------- */
    if (sh === 'speed') {
      op(speed, 1);
      const p = P(t, at('area') - 0.06, 0.4, pop);
      tr(spIn, 600 + 90 * (1 - P(t, at('area') - 0.06, 0.3, easeOut)), 380, Math.max(0.01, 0.8 + 0.2 * p), -4);
      pose.alvi = { x: 1020, y: 600, s: 0.6, mood: 'happy', look: -0.6, r: -12 };
    }
    if (sh === 'court') {
      op(plum, 1); op(court, 1);
      const f = P(t, mid('area', 0.32), (end('area') - mid('area', 0.32)) * 0.9, ease);
      attr(revealR, 'y', lerp(626, 286, f)); attr(revealR, 'height', lerp(0, 340, f));
      pose.alvi = { x: 250, y: 470, s: 0.95, mood: 'happy', look: 0.6 };
      gtsPop(h1, 600, 150, P(t, mid('area', 0.22), 0.45, pop));
      gtsPop(cCourt, 840, 684, P(t, mid('area', 0.62), 0.45, pop));
    }

    /* ---------- 2: one cell thick ---------- */
    if (sh === 'thin') {
      op(ruler, P(t, mid('thin', 0.6), 0.3, linear));
      op(thinL, P(t, mid('thin', 0.18), 0.4, linear));
      const q = ((t - at('thin')) / 1.6) % 1;
      op(zipO2, Math.sin(Math.PI * q)); tr(zipO2, lerp(330, 880, q), 600, 1.3, q * 360);
      pose.alvi = { x: 190, y: 560, s: 0.72, mood: 'happy', look: 1 };
      gtsPop(h2, 740, 138, P(t, at('thin') + 0.05, 0.45, pop));
      gtsPop(cThin, 600, 680, P(t, mid('thin', 0.66), 0.45, pop));
    }

    /* ---------- 3: moist ---------- */
    if (sh === 'moist') {
      op(plum, 1); op(moistP, 1);
      pose.alvi = { x: 320, y: 420, s: 1.3, mood: 'happy', look: 0.6, sweat: 1 };
      op(CAST.alvi.film, 0.8);
      const on = P(t, mid('moist', 0.42), 0.3, linear);
      drops.forEach(({ m, d }, i) => {
        const q = (Math.max(0, t - mid('moist', 0.42)) / 2.6 + i / 4) % 1, x = 760 + i * 90;
        if (q < 0.42) { tr(m, x, lerp(200, 345, q / 0.42), 1, q * 300); op(m, on * Math.min(1, q * 10)); op(d, 0); }
        else if (q < 0.55) { const s = 1 - (q - 0.42) / 0.13; tr(m, x, 348, Math.max(0.05, s)); op(m, on * s); attr(d, 'cx', x); attr(d, 'cy', 350); op(d, on * (1 - s)); }
        else { op(m, 0); attr(d, 'cx', x + Math.sin(q * 20) * 4); attr(d, 'cy', lerp(352, 560, (q - 0.55) / 0.45)); op(d, on * Math.min(1, (1 - q) * 6)); }
      });
      gtsPop(h3, 640, 116, P(t, at('moist') + 0.05, 0.45, pop));
      gtsPop(cDis, 900, 670, P(t, mid('moist', 0.55), 0.45, pop));
    }

    /* ---------- Kavya: please stop ---------- */
    if (sh === 'stop') {
      // the sofa inset, blown up to full frame; slow push-in on her shut eyes
      op(kin, 1); op(kinLive, 0);
      tr(kin, 600, 375, 4.1 * (1 + 0.06 * P(t, mid('stop', 0.5), 1.6)));
      tr(kinK, 0, 20, 0.33); kinK.shut(1);
      kinK.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'deadpan', look: 0 });
      tr(kinSnack, 24, 34, 0.15, -18);
    }

    /* ---------- 4: rich blood supply ---------- */
    if (sh === 'blood') {
      op(molG, 1); op(awayArr, P(t, mid('blood', 0.3), 0.4, linear));
      ALLMOL.forEach(m => op(m.el, 0));
      AO2.forEach((m, i) => { op(m.el, 1); tr(m.el, m.x + Math.sin(t * 1.7 + i * 2.1) * 6 * AMP, m.y, 1); });
      bloodO2.forEach((u, i) => {
        const q = ((t - at('blood')) * 0.42 + i / 5) % 1;
        const x = q < 0.4 ? lerp(470, 760 + i * 60, q / 0.4) : 760 + i * 60, y = q < 0.4 ? 260 + i * 70 : lerp(260 + i * 70, 820, (q - 0.4) / 0.6);
        tr(u, x, y, 1, q * 300); op(u, Math.min(1, q * 8));
      });
      pose.alvi = { x: 160, y: 560, s: 0.7, mood: 'happy', look: 1 };
      gtsPop(h4, 660, 130, P(t, at('blood') + 0.05, 0.45, pop));
      gtsPop(cRich, 610, 682, P(t, mid('blood', 0.45), 0.45, pop));
    }

    /* ---------- Dennis: TIMS ---------- */
    if (sh === 'tims' || sh === 'last') {
      op(confD, 1); confD.set(1, t); attr(confD.firstChild, 'fill', gradD);
      pose.dennis = { x: 430, y: 420, s: 1.5, mood: 'deadpan', look: 0, flat: 0.55 * breath };
      if (sh === 'tims') {
        k = 1 + 0.04 * P(t, end('tims'), 0.8); fx = 430; fy = 400;
        gtsPop(tims, 915, 380, P(t, at('tims'), 0.45, pop));
        op(timsT, P(t, at('tims') + 0.05, 0.2, linear));
        [0.2, 0.42, 0.66, 0.84].forEach((f, i) => { const p = P(t, mid('tims', f), 0.35, pop); op(timsR[i], clamp(p * 2.5)); tr(timsR[i], -220 - 30 * (1 - p), -62 + i * 74); });
      } else {
        k = 1 + 0.07 * P(t, end('mitch') + 0.6, 1.4); fx = 430; fy = 380;
      }
    }

    /* ---------- breathing / gas exchange / respiration ---------- */
    if (sh === 'three') {
      op(plum, 1); op(three, 1); op(cluster, 1); tr(cluster, 600, 380, 0.78); cluster.upd(t);
      lungArt.set(wave(t, 3)); lungAir.setAttribute('transform', wave(t, 3) > 0.5 ? '' : 'rotate(180 0 270)');
      mcellM.upd(t);
      [0.08, 0.4, 0.72].forEach((f, i) => {
        const p = P(t, mid('three', f), 0.45, pop), cur = t >= mid('three', f) && (i === 2 || t < mid('three', [0.08, 0.4, 0.72][i + 1]));
        op(PAN[i].g, 0.25 + 0.75 * clamp(p)); tr(PAN[i].g, PAN[i].x, 0 + (1 - clamp(p)) * 12);
        attr(PAN[i].box, 'stroke', cur ? LH.signTx : '#6E3A52');
        if (i === 1) op(cluster, 0.25 + 0.75 * clamp(p));
      });
    }

    /* ---------- the muscle cell: respiration, and Mitch ---------- */
    if (sh === 'eq') {
      op(cellBg, 1); op(bigCell, 1); op(board, 1); op(desk, 1);
      tr(bigCell, 760, 545); bigCell.upd(t);
      gtsPop(cMus, 760, 712, P(t, at('eq') + 0.4, 0.4, pop));
      tr(desk, 950, 580);
      // taxi brings Ozzie; he diffuses into the cell
      const tIn = P(t, at('eq') - 0.1, 1.6, easeOut), tx = lerp(-150, 330, tIn);
      op(taxi, 1); tr(taxi, tx, 640, 1.0, 3 * Math.sin(t * 3) * AMP);
      const hop = P(t, mid('eq', 0.3), 0.9, ease), walk = P(t, at('mitch') + 0.2, 1.2, ease);
      const ozx = lerp(lerp(tx - 30, 600, hop), 780, walk), ozy = lerp(lerp(600, 560, hop), 540, walk) - Math.sin(hop * Math.PI) * 70;
      const wave_ = t > mid('mitch', 0.35) ? Math.abs(Math.sin(t * 7)) * 18 * AMP : 0;
      pose.ozzie = { x: ozx, y: ozy - wave_, s: lerp(0.24, 0.42, hop), mood: 'happy', look: 1 };
      pose.dennis = { x: 150, y: 590, s: 0.72, mood: t >= at('mitch') ? 'deadpan' : 'neutral', look: 1, flat: 0.55 * breath };
      pose.mitch = { x: 950, y: 505, s: 0.85, mood: 'deadpan', look: 0 };
      op(eqTi, P(t, at('eq') + 0.3, 0.4, linear));
      EQ.forEach(e => gtsPop(e.g, e.x, 226, P(t, mid('eq', e.fr), 0.4, pop)));
      const ep = P(t, mid('eq', 0.95), 0.45, pop); gtsPop(eqEn, 500, 288, ep); eqSpark.upd(t);
      gtsPop(hi, 790, 430, P(t, mid('mitch', 0.38), 0.35, pop) * (1 - P(t, end('mitch') + 0.3, 0.2, linear)));
    }

    /* ---------- apply the cast ---------- */
    gtsCam(cam, k, fx, fy);
    Object.keys(CAST).forEach(name => {
      const p = pose[name], c = CAST[name];
      if (!p) { op(c, 0); return; }
      op(c, 1); tr(c, p.x, p.y, p.s, p.r || 0);
      c.set({ t, talk: scTalk(S, t, name), mood: p.mood, look: p.look || 0, sweat: p.sweat || 0, flat: p.flat || 0, still: p.still });
    });
    if (pose.colin) { CAST.colin.shades(pose.colin.shades || 0); } else CAST.colin.shades(0);
    if (pose.mitch) { op(mitch, 1); tr(mitch, pose.mitch.x, pose.mitch.y, pose.mitch.s); mitch.set({ t, mood: 'deadpan', look: 0 }); } else op(mitch, 0);
  };

});

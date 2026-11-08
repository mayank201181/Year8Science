/* Chapter 8, Series and parallel circuits.
   Two ways to join components -> series: one loop, the same current all the way round (as much flows in
   as out), the cell's push shared 1.5 V + 1.5 V, a third bulb makes all three dimmer, one bulb breaks and
   all go out (old Christmas lights) -> parallel: separate branches, each its own path through the cell,
   each gets the full 3 V and stays bright when a branch is added, the current splits and adds up
   -> the same test on both at once: series goes dark, parallel keeps working (showpiece) -> a house wired
   in parallel -> "series shares the voltage; parallel splits the current".
   Circuit rules: 3 V battery; dots 30 px/s for two bulbs in series, 20 for three; 60 per parallel branch and
   60 x branches in the shared wires; brightness 0.4 / 0.2 in series, 1 in parallel. */
scene('series', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;
  const BIG = 1e6;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* each wire's current is a list of runs of steady flow [t0, t1, speed]: dots are placed by distance flowed,
     so all of them start and stop at the same instant */
  const distOf = (t, runs) => { let d = 0; for (const r of runs) if (t > r[0]) d += r[2] * (Math.min(t, r[1]) - r[0]); return d; };
  const onAt = (t, runs) => runs.some(r => t >= r[0] && t < r[1]);
  const lastStop = (t, runs) => { let s = -1; for (const r of runs) if (r[1] <= t && r[1] > s) s = r[1]; return s; };
  const lastStart = (t, runs) => { let s = -1; for (const r of runs) if (r[0] <= t && r[0] > s) s = r[0]; return s; };
  /* drive a set of kit wires from one run list: moving dots when on, frozen and faded when off */
  function drive(wires, t, runs) {
    const d = distOf(t, runs);
    let dop;
    if (onAt(t, runs)) dop = lerp(0.3, 1, P(t, lastStart(t, runs), 0.12, linear));
    else { const s = lastStop(t, runs); dop = s < 0 ? 0.3 : 1 - 0.7 * P(t, s, 0.4, linear); }
    wires.forEach(w => { w.upd(d, 1); w.set(dop); });
  }
  function bgPaint() {
    const id = 'me8cut';
    if (!document.getElementById(id)) {
      const lg = E('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H }, defs());
      E('stop', { offset: 0, 'stop-color': C.bg1 }, lg); E('stop', { offset: 1, 'stop-color': C.bg0 }, lg);
    }
    return `url(#${id})`;
  }
  /* yellow "push" bar, w wide (160 for 3 V), with its voltage written on it */
  function pushBar(parent, w, label) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -16, width: w, height: 32, rx: 16, fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, g);
    T(g, 0, 9, label, { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    return g;
  }
  const junction = (parent, x, y) => E('circle', { cx: x, cy: y, r: 7, fill: C.ink }, parent);
  /* a bulb falling out of its place, or rising back into it: p 0..1 */
  function fall(el, x, y, rot, p) { tr(el, x, y + 150 * easeIn(p), 1, rot + 40 * p); op(el, 1 - P(p, 0.5, 0.5, linear)); }

  /* ================= title chips ================= */
  const chSer = chip(root, 'series', { size: 34, fill: C.card2, stroke: C.energy, color: C.energy }); tr(chSer, 310, 150);
  const chPar = chip(root, 'parallel', { size: 34, fill: C.card2, stroke: C.energy, color: C.energy }); tr(chPar, 890, 150);

  /* ================= series loop (left half) ================= */
  const sg = G(root);
  const SL = 80, SR = 540, ST = 230, SB = 520, SBX = 310, B1X = 210, B2X = 410, B3Y = 375;
  const sTrace = E('path', { d: `M${SBX},${SB} L${SL},${SB} L${SL},${ST} L${SR},${ST} L${SR},${SB} Z`, fill: 'none', stroke: C.energyLt, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.12 0.88' }, sg);
  const sGlow = E('path', { d: `M${SBX},${SB} L${SL},${SB} L${SL},${ST} L${SR},${ST} L${SR},${SB} Z`, fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0.22 }, sg);
  const SW = [
    wire(sg, [[SBX - 59, SB], [SL, SB], [SL, ST], [B1X - 46, ST]]),
    wire(sg, [[B1X + 46, ST], [B2X - 46, ST]]),
    wire(sg, [[B2X + 46, ST], [SR, ST], [SR, SB], [SBX + 59, SB]]),
  ];
  const cut = bgPaint();
  const b3Cut = E('rect', { x: SR - 11, y: B3Y - 46, width: 22, height: 92, fill: cut }, sg);
  tr(cellSym(sg, { cells: 2 }), SBX, SB);
  const sb1 = bulbSym(sg); tr(sb1, B1X, ST);
  const sb2 = bulbSym(sg); tr(sb2, B2X, ST);
  const sb3 = bulbSym(sg); tr(sb3, SR, B3Y, 1, 90);
  // series labels, inside the loop
  const SCX = 310, SCY = 375;
  const cOne = chip(sg, 'one single loop', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(cOne, SCX, SCY);
  const cSame = chip(sg, 'current: the same everywhere', { size: 27, fill: C.card2, stroke: C.line }); tr(cSame, SCX, SCY - 40);
  const cUsed = G(sg); tr(cUsed, SCX, SCY + 34);
  const cUsedChip = chip(cUsed, 'used up?', { size: 28, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, color: '#FFB3BA' });
  const cUsedX = strike(cUsed, -cUsedChip.w / 2 + 10, 0, cUsedChip.w / 2 - 10);
  const cntG = G(sg);
  const cntOut = chip(cntG, 'out: 0', { size: 28, w: 128, fill: C.card, stroke: C.line }); tr(cntOut, 180, 598);
  const cntIn = chip(cntG, 'in: 0', { size: 28, w: 128, fill: C.card, stroke: C.line }); tr(cntIn, 440, 598);
  arrow(cntG, 232, 552, 186, 552, { color: C.energy, width: 5 });
  arrow(cntG, 434, 552, 388, 552, { color: C.energy, width: 5 });
  const bar3 = pushBar(sg, 160, '3 V');
  const barH = [pushBar(sg, 80, '1.5 V'), pushBar(sg, 80, '1.5 V')];
  const cSum = chip(sg, '1.5 V + 1.5 V = 3 V', { size: 30, fill: C.card2, stroke: C.energy }); tr(cSum, SCX, SCY + 20);
  const cDim = chip(sg, 'more bulbs: all dimmer', { size: 30, fill: C.card2, stroke: C.line }); tr(cDim, SCX - 20, SCY + 10);
  const cGap = chip(sg, 'a gap: they all go out', { size: 30, fill: 'rgba(255,96,112,0.14)', stroke: C.bad }); tr(cGap, SCX, SCY + 10);

  /* ================= parallel circuit (right half) ================= */
  const pg = G(root);
  const PL = 660, PR = 1120, PA = 226, PB = 331, PC = 421, PBOT = 520, PX = 890;
  const trA = E('path', { d: `M${PX},${PBOT} L${PL},${PBOT} L${PL},${PA} L${PR},${PA} L${PR},${PBOT} Z`, fill: 'none', stroke: C.energyLt, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.12 0.88' }, pg);
  const trB = E('path', { d: `M${PX},${PBOT} L${PL},${PBOT} L${PL},${PB} L${PR},${PB} L${PR},${PBOT} Z`, fill: 'none', stroke: C.energyLt, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.12 0.88' }, pg);
  const glA = E('path', { d: `M${PX},${PBOT} L${PL},${PBOT} L${PL},${PA} L${PR},${PA} L${PR},${PBOT} Z`, fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0.22 }, pg);
  const glB = E('path', { d: `M${PX},${PBOT} L${PL},${PBOT} L${PL},${PB} L${PR},${PB} L${PR},${PBOT} Z`, fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0.22 }, pg);
  // shared pieces are 270 and 90 px long (multiples of 45), so their dots line up across the plain joins at y 421
  const PW = {
    lLow: wire(pg, [[PX - 59, PBOT], [PL, PBOT], [PL, PC]], { spacing: 45 }),
    lMid: wire(pg, [[PL, PC], [PL, PB]], { spacing: 45 }),
    a1: wire(pg, [[PL, PB], [PL, PA], [PX - 46, PA]]),
    a2: wire(pg, [[PX + 46, PA], [PR, PA], [PR, PB]]),
    b1: wire(pg, [[PL, PB], [PX - 46, PB]]),
    b2: wire(pg, [[PX + 46, PB], [PR, PB]]),
    rMid: wire(pg, [[PR, PB], [PR, PC]], { spacing: 45 }),
    rLow: wire(pg, [[PR, PC], [PR, PBOT], [PX + 59, PBOT]], { spacing: 45 }),
  };
  const cBr = G(pg);                                         // the third branch, added for a moment
  const PWC = [wire(cBr, [[PL, PC], [PX - 46, PC]]), wire(cBr, [[PX + 46, PC], [PR, PC]])];
  const pbC = bulbSym(cBr); tr(pbC, PX, PC);
  junction(cBr, PL, PC); junction(cBr, PR, PC);
  const barC = pushBar(cBr, 160, '3 V'); tr(barC, 1030, PC - 30);
  tr(cellSym(pg, { cells: 2 }), PX, PBOT);
  const pbA = bulbSym(pg); tr(pbA, PX, PA);
  const pbB = bulbSym(pg); tr(pbB, PX, PB);
  const jn = [junction(pg, PL, PB), junction(pg, PR, PB)];
  const barP = [pushBar(pg, 160, '3 V'), pushBar(pg, 160, '3 V')]; tr(barP[0], 1030, PA - 30); tr(barP[1], 1030, PB - 30);
  // split and rejoin: arrows as thick as the current, riding on the wires
  const spG = G(pg);
  const AW = { color: 'rgba(255,228,92,0.62)' };
  const spL = [arrow(spG, PL, 508, PL, 352, Object.assign({ width: 22, head: 44 }, AW)), arrow(spG, PL, 320, PL, 250, Object.assign({ width: 11, head: 30 }, AW)), arrow(spG, PL + 12, PB, 800, PB, Object.assign({ width: 11, head: 30 }, AW))];
  const spR = [arrow(spG, PR, 250, PR, 318, Object.assign({ width: 11, head: 30 }, AW)), arrow(spG, 980, PB, PR - 12, PB, Object.assign({ width: 11, head: 30 }, AW)), arrow(spG, PR, 345, PR, 505, Object.assign({ width: 22, head: 44 }, AW))];
  // labels under each circuit
  const LY = 612;
  const lab = (x, text, col, edge) => { const c = chip(root, text, { size: 30, fill: C.card2, stroke: edge || C.line, color: col || C.ink }); tr(c, x, LY); return c; };
  const pSep = lab(PX, 'separate branches', C.energy, C.energy);
  const sDim = lab(310, 'series: dimmer', C.muted);
  const pBri = lab(PX, 'parallel: brighter', C.energy, C.energy);
  const pMore = lab(PX, 'add more: still bright', C.energy, C.energy);
  const pSum = lab(PX, 'branch + branch = total', C.energy, C.energy);
  const sOut = lab(310, 'series: all go out', '#FFB3BA', C.bad);
  const pKeep = lab(PX, 'parallel: the rest keep working', C.good, C.good);
  const sOutX = cross(root, 13); tr(sOutX, 310 - sOut.w / 2 - 28, LY);
  const pKeepT = tick(root, 15); tr(pKeepT, PX - pKeep.w / 2 - 30, LY);

  /* ================= old Christmas lights ================= */
  const xmG = G(root);
  const XL = 660, XR = 1120, XY = 296, XSAG = 64, XN = 9, DUD = 5;
  const xAt = u => [lerp(XL, XR, u), XY + XSAG * 4 * u * (1 - u)];
  const xs = []; for (let k = 0; k <= 24; k++) xs.push(xAt(k / 24));
  E('path', { d: openPath(xs), fill: 'none', stroke: '#3E7D4F', 'stroke-width': 4, 'stroke-linecap': 'round' }, xmG);
  const XCOL = ['#FF5C5C', '#FFD24A', '#5CC8FF', '#7CE07C', '#FF9A3D', '#C78CFF', '#FF5C5C', '#FFD24A', '#5CC8FF'];
  const xmB = XCOL.map((col, i) => {
    const [x, y] = xAt((i + 0.5) / XN);
    const g = G(xmG); tr(g, x, y + 4);
    const halo = E('circle', { cx: 0, cy: 18, r: 30, fill: glow(col) }, g);
    const body = E('path', { d: 'M0,4 C-10,8 -11,24 0,32 C11,24 10,8 0,4 Z', fill: col, stroke: '#FFFFFF', 'stroke-width': 1.5, 'stroke-opacity': 0.5 }, g);
    E('rect', { x: -5, y: -3, width: 10, height: 8, rx: 2, fill: '#8E9BA7' }, g);
    return { g, halo, body, col };
  });
  const xmHead = chip(xmG, 'old Christmas lights', { size: 30, fill: C.card2, stroke: C.line }); tr(xmHead, 890, 226);
  const xmNote = rich(xmG, 890, 470, [['one dud bulb: ', C.ink], ['the whole string goes dark', '#FFB3BA', 700]], { size: 28, anchor: 'middle' });

  /* ================= a house wired in parallel ================= */
  const hsG = G(root);
  const HX0 = 180, HX1 = 780, HY0 = 262, HY1 = 640, HM = 480, HF = 451;
  E('path', { d: `M${HX0 - 34},${HY0} L${HM},${HY0 - 122} L${HX1 + 34},${HY0} Z`, fill: '#2B4A5C', stroke: '#5E8AA3', 'stroke-width': 4, 'stroke-linejoin': 'round' }, hsG);
  E('rect', { x: HX0, y: HY0, width: HX1 - HX0, height: HY1 - HY0, fill: '#122F3D', stroke: '#5E8AA3', 'stroke-width': 6 }, hsG);
  E('line', { x1: HX0, x2: HX1, y1: HF, y2: HF, stroke: '#5E8AA3', 'stroke-width': 6 }, hsG);
  E('line', { x1: HM, x2: HM, y1: HY0, y2: HY1, stroke: '#3C6278', 'stroke-width': 4 }, hsG);
  E('rect', { x: HX0 - 60, y: HY1, width: HX1 - HX0 + 120, height: 8, rx: 4, fill: '#3E7D4F' }, hsG);
  [['bedroom', 390, 398], ['bathroom', 578, 398], ['kitchen', 390, 588], ['living room', 588, 588]].forEach(([n, x, y]) => T(hsG, x, y, n, { size: 26, weight: 600, anchor: 'middle', fill: C.muted }));
  const HLX = [290, 670], CEIL = [280, 470], SOCK = [420, 610], SKX = [250, 710];
  const live = G(hsG), hw = G(hsG);
  const branchD = [];                                         // each light and socket on its own branch from the riser
  CEIL.forEach(y => HLX.forEach(x => branchD.push({ d: `M${HM},${y} L${x},${y} L${x},${y + 30}`, kind: 'light', x, y })));
  SOCK.forEach(y => SKX.forEach(x => branchD.push({ d: `M${HM},${y} L${x + (x < HM ? 20 : -20)},${y}`, kind: 'sock', x, y })));
  const KITCHEN = 2;                                           // bottom floor, left light
  branchD[KITCHEN].d = `M${368},${CEIL[1]} L${HLX[0]},${CEIL[1]} L${HLX[0]},${CEIL[1] + 30}`;   // beyond the kitchen switch
  E('path', { d: `M${HM},${CEIL[1]} L${432},${CEIL[1]}`, fill: 'none', stroke: C.energy, 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.16 }, live);
  const glows = branchD.map(b => E('path', { d: b.d, fill: 'none', stroke: C.energy, 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.22 }, live));
  branchD.forEach((b, i) => { if (i !== KITCHEN) E('path', { d: b.d, fill: 'none', stroke: WIRE, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, hw); });
  E('path', { d: `M${HM},${CEIL[1]} L${432},${CEIL[1]} M${368},${CEIL[1]} L${HLX[0]},${CEIL[1]} L${HLX[0]},${CEIL[1] + 30}`, fill: 'none', stroke: WIRE, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, hw);
  const kSw = switchSym(hw); tr(kSw, 400, CEIL[1], 0.62);
  const riserGlow = E('path', { d: `M${HM},672 L${HM},${CEIL[0]}`, fill: 'none', stroke: C.energy, 'stroke-width': 16, 'stroke-linecap': 'round', opacity: 0.22 }, live);
  E('path', { d: `M${HM},672 L${HM},${CEIL[0]}`, fill: 'none', stroke: WIRE, 'stroke-width': 6, 'stroke-linecap': 'round' }, hw);
  [CEIL[0], SOCK[0], CEIL[1], SOCK[1]].forEach(y => junction(hw, HM, y));
  const lamps = [];
  CEIL.forEach(y => HLX.forEach(x => {
    const g = G(hsG); tr(g, x, y + 44);
    const halo = E('circle', { r: 64, fill: glow(C.energy) }, g);
    E('path', { d: 'M-16,-14 L16,-14 L10,-4 L-10,-4 Z', fill: '#C9D3DC' }, g);
    const bulbOn = E('circle', { cy: 8, r: 13, fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, g);
    E('circle', { cy: 8, r: 13, fill: 'none', stroke: '#E8EEF2', 'stroke-width': 2 }, g);
    lamps.push({ g, halo, bulbOn });
  }));
  SOCK.forEach(y => SKX.forEach(x => {
    const g = G(hsG); tr(g, x, y);
    E('rect', { x: -19, y: -19, width: 38, height: 38, rx: 6, fill: '#EEF3F6', stroke: '#9AA6B0', 'stroke-width': 2 }, g);
    E('rect', { x: -3, y: -12, width: 6, height: 10, rx: 1, fill: '#3A4652' }, g);
    E('rect', { x: -11, y: 3, width: 7, height: 5, rx: 1, fill: '#3A4652' }, g); E('rect', { x: 4, y: 3, width: 7, height: 5, rx: 1, fill: '#3A4652' }, g);
  }));
  const mains = G(hsG); tr(mains, HM, 694);
  E('rect', { x: -74, y: -22, width: 148, height: 44, rx: 10, fill: '#C9D3DC', stroke: '#EEF3F6', 'stroke-width': 2 }, mains);
  T(mains, 0, 9, 'mains', { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
  const hsTxt = G(hsG);
  T(hsTxt, 830, 300, 'homes are wired in', { size: 30, weight: 600, fill: C.muted });
  T(hsTxt, 830, 362, 'parallel', { size: 58, weight: 700, fill: C.energy });
  const hsVolt = G(hsG);
  T(hsVolt, 830, 446, 'full mains voltage', { size: 32, weight: 700 });
  T(hsVolt, 830, 484, 'to each light and socket', { size: 28, weight: 500, fill: C.muted });
  const hsOwn = G(hsG);
  const hsTick = tick(hsOwn, 15); tr(hsTick, 848, 560);
  T(hsOwn, 878, 572, 'each one works', { size: 30, weight: 600 });
  T(hsOwn, 878, 610, 'on its own', { size: 30, weight: 600 });

  /* ================= the memory hook ================= */
  const rmG = G(root);
  card(rmG, 170, 206, 860, 392, { fill: C.card, stroke: C.line });
  T(rmG, 600, 268, 'Remember', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const rm1 = G(rmG), rm2 = G(rmG);
  rich(rm1, 420, 382, [['series', C.energy, 700], [' shares the ', C.ink], ['voltage', C.energy, 700]], { size: 42 });
  rich(rm2, 420, 512, [['parallel', C.energy, 700], [' splits the ', C.ink], ['current', C.energy, 700]], { size: 42 });
  const rmBar = pushBar(rm1, 154, '3 V'); const rmHalves = [pushBar(rm1, 76, '1.5 V'), pushBar(rm1, 76, '1.5 V')];
  const rmArr = [arrow(rm2, 236, 496, 300, 496, { color: C.energy, width: 14, head: 32 }), arrow(rm2, 306, 496, 370, 466, { color: C.energy, width: 7, head: 22 }), arrow(rm2, 306, 496, 370, 526, { color: C.energy, width: 7, head: 22 })];

  /* ================= timings ================= */
  const tS0 = mid('two', 0.42);                                         // the series loop starts flowing
  const tB3in = mid('dimmer', 0.25), tB3out = end('dimmer') + 0.15;    // the third bulb
  const tBreakS = mid('break', 0.08), tRet = end('break') + 0.7;       // bulb 2 drops out, comes back
  const tPon = at('parallel') + 0.35;                                  // the parallel circuit starts flowing
  const tCon = mid('full', 0.66), tCoff = tCon + 3.0;                  // third branch; 3.0 s keeps the lattices in step
  const tKeep = mid('keep', 0.15);                                     // the same test on both, at the same moment
  const tDud = mid('break', 0.72), tDark = mid('break', 0.84);
  const RSER = [[tS0, tB3in, 30], [tB3in, tB3out, 20], [tB3out, tBreakS, 30], [tRet, tKeep, 30]];
  const RSH = [[tPon, tCon, 120], [tCon, tCoff, 180], [tCoff, tKeep, 120], [tKeep, BIG, 60]];
  const RMID = [[tPon, tKeep, 120], [tKeep, BIG, 60]];
  const RA = [[tPon, BIG, 60]], RB = [[tPon, tKeep, 60]], RC = [[tCon, tCoff, 60]];
  const tH = at('house') - 0.25, tRm = at('rhyme') - 0.15;

  /* ================= update ================= */
  return t => {
    const aCirc = 1 - P(t, tH, 0.5, linear);

    /* --- title chips --- */
    const c1 = P(t, mid('two', 0.02), 0.5, pop), c2 = P(t, mid('two', 0.12), 0.5, pop);
    op(chSer, clamp(c1 * 2) * aCirc); tr(chSer, 310, 150, 0.8 + 0.2 * c1);
    const parDim = win(t, mid('two', 0.4), at('parallel') + 0.1, 0.4);
    op(chPar, clamp(c2 * 2) * (1 - 0.65 * parDim) * aCirc); tr(chPar, 890, 150, 0.8 + 0.2 * c2 + 0.08 * Math.sin(Math.PI * P(t, at('parallel'), 0.5, linear)));

    /* --- series loop --- */
    const aS = P(t, mid('two', 0.3), 0.5, linear) * aCirc;
    op(sg, aS);
    if (aS > 0) {
      drive(SW, t, RSER);
      const on = onAt(t, RSER), bright = !on ? 0 : t >= tB3in && t < tB3out ? 0.2 : 0.4;
      sb1.set(bright); sb2.set(bright); sb3.set(bright);
      // one after another: the bulbs pulse in turn
      [sb1, sb2].forEach((b, i) => { if (b === sb2 && t >= tBreakS) return; const k = 1 + 0.18 * Math.sin(Math.PI * P(t, mid('two', 0.8 + i * 0.09), 0.45, linear)); tr(b, i ? B2X : B1X, ST, k); });
      // bulb 2: drops out in break, comes back, drops out again in keep
      if (t >= tKeep) fall(sb2, B2X, ST, 0, P(t, tKeep, 0.7));
      else if (t >= tRet - 0.5) { const p = P(t, tRet - 0.5, 0.5, easeOut); tr(sb2, B2X, ST + 130 * (1 - p)); op(sb2, p); }
      else if (t >= tBreakS) fall(sb2, B2X, ST, 0, P(t, tBreakS, 0.7));
      else op(sb2, 1);
      // the third bulb slides in from the right and out again
      const in3 = P(t, tB3in - 0.4, 0.4, easeOut), out3 = P(t, tB3out, 0.4, easeIn);
      op(sb3, in3 * (1 - out3)); tr(sb3, SR + 110 * (1 - in3) + 110 * out3, B3Y, 1, 90);
      op(b3Cut, t >= tB3in && t < tB3out ? 1 : 0);
      // one single loop: tracer round from +
      const tTr = mid('two', 0.58), u = P(t, tTr, 1.1, linear);
      op(sTrace, win(t, tTr, tTr + 1.15, 0.12)); sTrace.setAttribute('stroke-dashoffset', (-u).toFixed(4));
      op(sGlow, win(t, tTr + 0.2, at('same') + 0.1, 0.4));
      op(cOne, win(t, mid('two', 0.66), at('same') + 0.05, 0.35));
      // same current everywhere; counters in and out
      op(cSame, win(t, mid('same', 0.04), at('shared') - 0.05, 0.35));
      const tC0 = mid('same', 0.3), sp = SW[0].length / 12;
      const aCnt = win(t, tC0, at('shared') - 0.05, 0.35);
      op(cntG, aCnt);
      if (aCnt > 0) {
        const m = Math.floor(distOf(t, RSER) / sp), m0 = Math.floor(distOf(tC0, RSER) / sp);
        const n = Math.max(0, m - m0), tTick = tS0 + m * sp / 30;
        setText(cntOut.label, 'out: ' + n); setText(cntIn.label, 'in: ' + n);
        const fl = n > 0 ? 1 - P(t, tTick, 0.4, linear) : 0;
        [cntOut, cntIn].forEach(c => { c.box.setAttribute('stroke', fl > 0.05 ? C.energy : C.line); tr(c, c === cntOut ? 180 : 440, 598, 1 + 0.1 * fl); });
      }
      op(cUsed, win(t, mid('same', 0.48), at('shared') - 0.05, 0.3)); cUsedX.set(P(t, mid('same', 0.6), 0.4));
      // the push is shared: 3 V splits into 1.5 V + 1.5 V
      const aSh = win(t, mid('shared', 0.04), at('dimmer') + 0.05, 0.35);
      const sp1 = P(t, mid('shared', 0.26), 0.8);
      op(bar3, aSh * (1 - P(t, mid('shared', 0.26), 0.15, linear))); tr(bar3, SBX, 430, 0.85 + 0.15 * P(t, mid('shared', 0.04), 0.4, easeOut));
      barH.forEach((b, i) => { op(b, aSh * P(t, mid('shared', 0.26), 0.12, linear)); tr(b, lerp(SBX + (i ? 40 : -40), i ? B2X : B1X, sp1), lerp(430, ST + 62, sp1)); });
      op(cSum, win(t, mid('shared', 0.62), at('dimmer') + 0.05, 0.35));
      op(cDim, win(t, mid('dimmer', 0.42), at('break') + 0.05, 0.35));
      op(cGap, win(t, mid('break', 0.16), end('break') + 0.3, 0.35));
    }

    /* --- old Christmas lights --- */
    const aX = win(t, mid('break', 0.42), end('break') + 0.45, 0.4) * aCirc;
    op(xmG, aX);
    if (aX > 0) {
      const flick = (t > tDud && t < tDud + 0.1) || (t > tDud + 0.24 && t < tDud + 0.32);
      xmB.forEach((b, i) => {
        const lit = t < tDark && !(i === DUD && flick);
        b.body.setAttribute('fill', lit ? b.col : '#46525E');
        op(b.halo, lit ? 0.75 + 0.25 * calm * wave(t, 1.6, i * 0.37) : 0);
      });
      op(xmNote, P(t, tDark + 0.1, 0.4, linear));
    }

    /* --- parallel circuit --- */
    const aP = P(t, at('parallel') - 0.05, 0.5, linear) * aCirc;
    op(pg, aP);
    if (aP > 0) {
      drive([PW.lLow, PW.rLow], t, RSH);
      drive([PW.lMid, PW.rMid], t, RMID);
      drive([PW.a1, PW.a2], t, RA);
      drive([PW.b1, PW.b2], t, RB);
      drive(PWC, t, RC);
      pbA.set(onAt(t, RA) ? 1 : 0); pbB.set(onAt(t, RB) ? 1 : 0); pbC.set(onAt(t, RC) ? 1 : 0);
      if (t >= tKeep) fall(pbB, PX, PB, 0, P(t, tKeep, 0.7)); else { op(pbB, 1); tr(pbB, PX, PB); }
      const cIn = P(t, tCon - 0.45, 0.45, easeOut), cOut = P(t, tCoff, 0.4, easeIn);
      op(cBr, cIn * (1 - cOut)); tr(cBr, 0, -26 * cOut);
      op(barC, P(t, tCon + 0.2, 0.4, linear));
      const pp = P(t, at('parallel') + 0.15, 0.5, pop);
      jn.forEach(j => attr(j, 'r', 7 * Math.max(0.01, pp)));
      // each branch is its own path through the cell
      const tA = mid('parallel', 0.6), tB = mid('parallel', 0.8);
      op(trA, win(t, tA, tA + 1.15, 0.12)); trA.setAttribute('stroke-dashoffset', (-P(t, tA, 1.1, linear)).toFixed(4));
      op(trB, win(t, tB, tB + 1.15, 0.12)); trB.setAttribute('stroke-dashoffset', (-P(t, tB, 1.1, linear)).toFixed(4));
      op(glA, win(t, tA + 0.3, tA + 1.3, 0.35)); op(glB, win(t, tB + 0.3, tB + 1.3, 0.35));
      // full voltage on each branch
      barP.forEach((b, i) => { const q = P(t, mid('full', 0.04 + i * 0.08), 0.5, pop); op(b, clamp(q * 2) * (1 - P(t, at('split') - 0.1, 0.4, linear))); tr(b, 1030, (i ? PB : PA) - 30, Math.max(0.01, 0.8 + 0.2 * q)); });
      // the current splits and rejoins
      const sL = P(t, mid('split', 0.06), 0.5), sR = P(t, mid('split', 0.42), 0.5), sOff = 1 - P(t, at('keep') - 0.1, 0.4, linear);
      op(spG, (t > mid('split', 0.06) ? 1 : 0) * sOff);
      spL[0].set(sL); spL[1].set(P(t, mid('split', 0.06) + 0.35, 0.45)); spL[2].set(P(t, mid('split', 0.06) + 0.35, 0.45));
      spR[0].set(sR); spR[1].set(sR); spR[2].set(P(t, mid('split', 0.42) + 0.35, 0.45));
      [spL, spR].forEach((a, i) => a.forEach(x => op(x, (i ? sR : sL) > 0 ? 1 : 0)));
    }

    /* --- labels under the circuits --- */
    const L1 = (el, a, b) => op(el, win(t, a, b, 0.3) * aCirc);
    L1(pSep, mid('parallel', 0.42), at('full') + 0.05);
    L1(sDim, mid('full', 0.36), at('split') + 0.05);
    L1(pBri, mid('full', 0.36), mid('full', 0.66));
    L1(pMore, mid('full', 0.62), at('split') + 0.05);
    L1(pSum, mid('split', 0.6), at('keep') + 0.05);
    const ko = P(t, mid('keep', 0.4), 0.4, linear) * aCirc;
    op(sOut, ko); op(sOutX, ko); op(pKeep, P(t, mid('keep', 0.55), 0.4, linear) * aCirc); op(pKeepT, P(t, mid('keep', 0.55), 0.4, linear) * aCirc);

    /* --- the house --- */
    const aH = win(t, tH + 0.2, tRm, 0.45);
    op(hsG, aH);
    if (aH > 0) {
      const kOff = mid('house', 0.8);
      kSw.set(1 - P(t, kOff, 0.25));
      const kitOn = t < kOff + 0.25;
      glows.forEach((g, i) => { const seq = win(t, mid('house', 0.08 + i * 0.035), mid('house', 0.08 + i * 0.035) + 0.6, 0.2); op(g, (i === KITCHEN && !kitOn ? 0 : 0.7) + 0.3 * seq); });
      op(riserGlow, 0.75 + 0.25 * calm * wave(t, 1.4));
      lamps.forEach((l, i) => { const on = !(i === KITCHEN && !kitOn); op(l.halo, on ? 0.85 : 0); op(l.bulbOn, on ? 1 : 0); });
      op(hsTxt, P(t, mid('house', 0.05), 0.4, linear));
      op(hsVolt, P(t, mid('house', 0.42), 0.4, linear));
      op(hsOwn, P(t, kOff + 0.35, 0.4, linear));
    }

    /* --- the memory hook --- */
    const aR = P(t, tRm, 0.5, linear);
    op(rmG, aR);
    if (aR > 0) {
      op(rm1, P(t, mid('rhyme', 0.08), 0.4, linear)); op(rm2, P(t, mid('rhyme', 0.5), 0.4, linear));
      const q = P(t, mid('rhyme', 0.2), 0.7);
      tr(rmBar, 300, 334);
      rmHalves.forEach((b, i) => { op(b, P(t, mid('rhyme', 0.2), 0.15, linear)); tr(b, 300 + (i ? 1 : -1) * lerp(19, 39, q), lerp(334, 378, q)); });
      rmArr.forEach((a, i) => a.set(P(t, mid('rhyme', 0.6) + (i ? 0.35 : 0), 0.45)));
    }
  };
});

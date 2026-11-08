/* Chapter 4: Conservation of mass.
   Beats: six atoms change partners (2 H2 + O2 -> 2 H2O), six before and six after -> a two-pan scale:
   products and reactants weigh the same -> "Atoms can't hide, and can't die" -> showpiece: magnesium
   flashes inside a sealed flask and the balance stays at 50.00 g -> burnt in an open crucible it climbs
   from 2.40 g to 4.00 g -> zoom: oxygen from the air joins on -> copper carbonate is heated in an open
   tube and carbon dioxide escapes -> back on the balance it is lighter -> a closed system: copper carbonate
   fizzes in acid in a bunged flask, the gas stays in and the reading holds: the real rule -> a candle seems
   to lose mass; steel wool gains mass. */
scene('mass', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'middle', fill: o.fill || C.ink }, parent);
    t.style.whiteSpace = 'pre';
    t.parts = segs.map(s => { const ts = E('tspan', { fill: s[1], 'font-weight': s[2] }, t); ts.textContent = s[0]; return ts; });
    return t;
  }
  /* a crinkled coil of magnesium ribbon, about w wide, sitting on (0,0) */
  const coilD = (w, h) => { let d = `M${-w / 2},0`; const n = 4; for (let i = 0; i < n; i++) { const x0 = -w / 2 + i * w / n, x1 = x0 + w / n; d += ` C${(x0 + w / n * 0.2).toFixed(1)},${-h} ${(x1 - w / n * 0.2).toFixed(1)},${-h} ${x1.toFixed(1)},0`; } return d; };

  /* ================= A. atoms rearrange; the two-pan scale ================= */
  const A = G(root);
  const R0 = 32, RH = R0 * 0.62;
  const REACT = { H1: [271, 292], H2: [299, 292], H3: [271, 386], H4: [299, 386], O1: [392, 339], O2: [438, 339] };
  const PROD = { O1: [790, 316], H1: [759, 339], H3: [821, 339], O2: [890, 362], H2: [859, 385], H4: [921, 385] };
  const ORDER = ['O1', 'H1', 'H3', 'O2', 'H2', 'H4'];
  const ghostG = G(A), copyG = G(A), copyO = G(A), moverG = G(A), moverO = G(A), tickG = G(A);
  const kindOf = k => k[0];
  const ghosts = {}, copies = {}, movers = {};
  Object.keys(REACT).forEach(k => {
    const r = kindOf(k) === 'H' ? RH : R0;
    ghosts[k] = E('circle', { cx: REACT[k][0], cy: REACT[k][1], r: r - 1, fill: 'none', stroke: kindOf(k) === 'H' ? C.hydrogen : C.oxygen, 'stroke-width': 2.5, 'stroke-dasharray': '5 5', opacity: 0.5 }, ghostG);
  });
  // draw H first and O on top, as in lib's molecules
  ['H1', 'H2', 'H3', 'H4', 'O1', 'O2'].forEach(k => {
    const H = kindOf(k) === 'H';
    copies[k] = rxAtom(H ? copyG : copyO, k[0], H ? RH : R0);
    movers[k] = rxAtom(H ? moverG : moverO, k[0], H ? RH : R0);
  });
  const T0 = mid('rearr', 0.24), STAG = 0.15, FLY = 1.25;
  const flight = {}; ORDER.forEach((k, i) => { flight[k] = { st: T0 + i * STAG, bend: 120 + (i % 3) * 18 }; });
  const ticks = ORDER.map(() => tick(tickG, 10));
  const rxArw = arrow(A, 522, 345, 678, 345, { color: C.ink, width: 7 });
  const cntB = rich(A, 360, 470, [['atoms before: ', C.muted], ['6', C.energy, 800]], { size: 32 });
  const cntA = rich(A, 840, 470, [['atoms after: ', C.muted], ['6', C.energy, 800]], { size: 32 });
  const cntTick = tick(A, 13); tr(cntTick, 974, 458);

  // the two-pan scale (its pans stay level while the beam tips)
  const PIV = [600, 470], ARM = 240, PANY = 410;
  const scale = G(A), scaleBack = G(scale);
  E('rect', { x: 589, y: PIV[1], width: 22, height: 140, rx: 6, fill: linGrad('#B9C6D2', '#6F7D8A'), stroke: '#9DB0BF', 'stroke-width': 2 }, scaleBack);
  E('rect', { x: 500, y: PIV[1] + 136, width: 200, height: 18, rx: 8, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, scaleBack);
  E('path', { d: `M592,${PIV[1] - 96} L608,${PIV[1] - 96} L600,${PIV[1] - 84} Z`, fill: C.ink }, scaleBack);
  const beam = G(scale);
  E('rect', { x: 600 - ARM - 16, y: PIV[1] - 8, width: 2 * ARM + 32, height: 16, rx: 8, fill: linGrad('#E3E9EE', '#8A98A5', true), stroke: '#C5D0D9', 'stroke-width': 2 }, beam);
  E('line', { x1: 600, y1: PIV[1], x2: 600, y2: PIV[1] - 78, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, beam);
  E('circle', { cx: 600, cy: PIV[1], r: 11, fill: '#C5D0D9', stroke: '#6F7D8A', 'stroke-width': 3 }, scale);
  const pans = [-1, 1].map(() => {
    const g = G(scale);
    E('rect', { x: -9, y: 12, width: 18, height: PIV[1] - PANY - 12, fill: '#8A98A5', stroke: '#C5D0D9', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M-132,0 L132,0 Q124,16 104,16 L-104,16 Q-124,16 -132,0 Z', fill: linGrad('#E3E9EE', '#8A98A5', true), stroke: '#C5D0D9', 'stroke-width': 2 }, g);
    return g;
  });
  const chR = chip(A, 'reactants', { size: 30, fill: C.water, color: C.bg0 }); tr(chR, 360, 540);
  const chP = chip(A, 'products', { size: 30, fill: C.good, color: C.bg0 }); tr(chP, 840, 540);
  const lawChip = chip(A, 'the law of conservation of mass', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(lawChip, 600, 682);
  // memory hook
  const memo = G(A);
  const MEMO = "Atoms can't hide, and can't die.";
  const mw = Math.max(620, textWidth(MEMO, 40, FD, 700) + 90);
  card(memo, 600 - mw / 2, 116, mw, 118, { fill: C.card2, stroke: C.energy, sw: 3, rx: 24 });
  T(memo, 600 - mw / 2 + 28, 150, 'memory hook', { size: 26, weight: 600, fill: C.energy });
  T(memo, 600, 204, MEMO, { size: 40, weight: 700, anchor: 'middle' });

  /* ================= B. the top-pan balance ================= */
  const B = G(root);
  const BX = 600, PY = 560, FS = 1.2;
  const bal = rxBalance(B, { w: 360 }); tr(bal, BX, PY);
  const G1 = G(B), G2 = G(B), G4 = G(B), G5 = G(B);     // one group per experiment: apparatus and labels

  // B1. sealed flask with magnesium
  const fl1 = G(G1); tr(fl1, BX, PY - 92 * FS);
  const fk1 = flask(fl1, FS, { level: 0 });
  const o2in = [0, 1, 2, 3].map(k => ({ g: molO2(fl1, 7.5), x: -34 + k * 23, y: 30 + (k % 2) * 30, ph: k * 1.7 }));
  const coil1 = E('path', { d: coilD(64, 14), fill: 'none', stroke: '#B9C4CE', 'stroke-width': 5, 'stroke-linecap': 'round', transform: `translate(0 ${92 * FS - 6})` }, fl1);
  const mgo1 = E('path', { d: 'M-40,0 Q-30,-14 0,-16 Q30,-14 40,0 Z', fill: RX.mgOxide, transform: `translate(0 ${92 * FS - 4})` }, fl1);
  rxBung(fk1, FS);
  const flash1 = E('ellipse', { cx: 0, cy: 40, rx: 130, ry: 150, fill: glow('#FFFFFF') }, fl1);
  const spark1 = spark(fl1, 30, { seed: 4 }); tr(spark1, 0, 92 * FS - 18);
  const lbSealed = labelLine(G1, 760, 336, 626, 330, 'sealed', { anchor: 'start', size: 30 });
  const lbMg1 = labelLine(G1, 430, 506, 562, 540, 'magnesium', { anchor: 'end' });
  const noChange = G(G1);
  tr(tick(noChange, 14), 828, 626);
  T(noChange, 854, 638, 'no change', { size: 32, weight: 700, fill: C.good });

  // B2. an open crucible of burning magnesium
  const cru = G(G2); tr(cru, BX, PY);
  E('path', { d: 'M-66,-74 L66,-74 L48,-6 Q46,0 38,0 L-38,0 Q-46,0 -48,-6 Z', fill: linGrad('#F4F1EA', '#B9B1A2', true), stroke: '#E9E4DA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cru);
  E('ellipse', { cx: 0, cy: -74, rx: 66, ry: 10, fill: '#4E4942', stroke: '#E9E4DA', 'stroke-width': 2.5 }, cru);
  const coil2 = E('path', { d: coilD(70, 18), fill: 'none', stroke: '#B9C4CE', 'stroke-width': 5, 'stroke-linecap': 'round', transform: 'translate(0 -72)' }, cru);
  const mgo2 = E('path', { d: 'M-58,0 Q-40,-22 0,-24 Q40,-22 58,0 Z', fill: RX.mgOxide, transform: 'translate(0 -72)' }, cru);
  const glow2 = E('circle', { cx: 0, cy: -110, r: 140, fill: glow('#FFFFFF') }, cru);
  const rays2 = G(cru);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.cos(a) * 50, y1: Math.sin(a) * 50, x2: Math.cos(a) * (i % 2 ? 86 : 112), y2: Math.sin(a) * (i % 2 ? 86 : 112), stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.75 }, rays2); }
  const fl2 = rxFlame(cru, 0.9); tr(fl2, 0, -76);
  const lbOpen = labelLine(G2, 800, 470, 668, 488, 'open to the air', { anchor: 'start' });
  const heavier = G(G2);
  arrow(heavier, 822, 660, 822, 600, { color: C.energy, width: 6 });
  T(heavier, 848, 642, 'heavier?', { size: 32, weight: 700, fill: C.energy });
  const plusO = T(G2, BX, 714, '4.00 g = 2.40 g magnesium + 1.60 g oxygen', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9A8F' });

  // B3. zoom: oxygen joins the magnesium
  const ZX = 950, ZY = 320, ZR = 180;
  const Z = G(G2);
  const cone = G(Z);
  E('path', { d: `M640,480 L${ZX - ZR * 0.86},${ZY - ZR * 0.5} M640,486 L${ZX - ZR * 0.7},${ZY + ZR * 0.72}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7', fill: 'none' }, cone);
  E('circle', { cx: ZX, cy: ZY, r: ZR, fill: 'rgba(10,27,39,0.92)', stroke: C.muted, 'stroke-width': 4 }, Z);
  const zIn = G(Z);
  const MGP = [[892, 282], [1012, 282], [892, 378], [1012, 378]];
  const zMg = MGP.map(([x, y]) => { const g = rxAtom(zIn, 'Mg', 25); tr(g, x - 20, y); return g; });
  const zO = [0, 1, 2, 3].map(() => rxAtom(zIn, 'O', 21));
  const zRing = [0, 1, 2, 3].map(() => E('circle', { r: 29, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, zIn));
  const zFrom = [[905, 168], [945, 168], [985, 196], [1025, 196]];      // O atoms start as two O2 molecules
  const lbAir = T(Z, 760, 196, 'oxygen from the air', { size: 28, weight: 700, anchor: 'end', fill: '#FF9A8F' });
  const lbMgO = T(Z, ZX, 448, 'magnesium oxide', { size: 28, weight: 600, anchor: 'middle' });
  const lbBefore = G(Z);
  E('circle', { cx: ZX - 168, cy: 554, r: 14, fill: 'none', stroke: '#FF9A8F', 'stroke-width': 3, 'stroke-dasharray': '5 5' }, lbBefore);
  T(lbBefore, ZX - 144, 564, 'not on the balance before', { size: 28, weight: 600, fill: '#FF9A8F' });

  // B4. copper carbonate heated in an open tube
  const bunG = G(G4); const bun = bunsen(bunG, 1); tr(bunG, 300, 646);
  const rack = G(G4), rackBack = G(rack); tr(rack, BX, PY);
  const WOOD = linGrad('#C9925A', '#8A5A2E', true);
  E('rect', { x: -58, y: -10, width: 116, height: 10, rx: 4, fill: WOOD, stroke: '#E3B887', 'stroke-width': 2 }, rackBack);
  [-58, 48].forEach(x => E('rect', { x, y: -112, width: 10, height: 104, rx: 3, fill: WOOD, stroke: '#E3B887', 'stroke-width': 2 }, rackBack));
  const tubeG = G(G4);
  const holder = G(tubeG);
  E('rect', { x: 18, y: -74, width: 120, height: 16, rx: 7, fill: linGrad('#D6A06A', '#8A5A2E', true), stroke: '#E3B887', 'stroke-width': 2 }, holder);
  E('rect', { x: -32, y: -78, width: 52, height: 24, rx: 6, fill: 'none', stroke: '#8A5A2E', 'stroke-width': 5 }, holder);
  const tube = testTube(tubeG, 50, 200, { level: 0.22, liquid: RX.cuCarbonate });
  const rackFront = G(rack);
  E('rect', { x: -58, y: -118, width: 116, height: 14, rx: 5, fill: WOOD, stroke: '#E3B887', 'stroke-width': 2 }, rackFront);
  const TUBE_ON = [BX, PY - 10 - 100], TUBE_HEAT = [300, 338];
  const co2s = [0, 1, 2, 3, 4, 5].map(k => ({ g: molCO2(G4, 9), ph: k / 6, dx: (k % 2 ? 1 : -1) * (24 + (k % 3) * 22) }));
  const lbCarb = labelLine(G4, 800, 430, 626, 528, 'copper carbonate', { anchor: 'start', fill: '#7FD9AF' });
  const lbCO2 = T(G4, 392, 190, 'carbon dioxide escapes', { size: 28, weight: 700, fill: C.co2 });
  const lbCuO = labelLine(G4, 800, 430, 626, 528, 'black copper oxide', { anchor: 'start' });
  const lighter = G(G4);
  arrow(lighter, 822, 600, 822, 660, { color: C.bad, width: 6 });
  T(lighter, 848, 642, 'lighter', { size: 32, weight: 700, fill: C.bad });

  // B5. a closed system: copper carbonate fizzes in dilute acid inside a bunged flask (no heating), so the
  // carbon dioxide it gives off stays in
  const fl3 = G(G5); tr(fl3, BX, PY - 92 * FS);
  const ACID = '#CFE6F2';
  const fk3 = flask(fl3, FS, { level: 0.3, liquid: ACID, opacity: 0.5 });
  const powder3 = E('path', { d: 'M-60,109 Q-40,82 0,80 Q40,82 60,109 Z', fill: RX.cuCarbonate }, fl3);
  const fizz3 = bubbles(fl3, -48, 66, 96, 38, { n: 9, r: 5, seed: 17, speed: 0.8 });
  // carbon dioxide fills the space above the acid: x is a fraction of the cone's half-width at that height
  const co2in = [0, 1, 2, 3, 4].map(k => ({ g: molCO2(fl3, 8), u0: -0.8 + k * 0.4, y0: -16 + k * 14, vu: (k % 2 ? 1 : -1) * (0.45 + k * 0.08), vy: (k % 3 ? 1 : -1) * (18 + k * 4) }));
  const coneHW = y => FS * (17 + (y / FS + 38) * 59 / 116) - 22;
  const co2neck = molCO2(fl3, 8);
  rxBung(fk3, FS);
  const lbMix = labelLine(G5, 770, 532, 640, 552, 'copper carbonate + acid', { anchor: 'start' });
  const closedG = G(G5);
  const clChip = chip(closedG, 'closed system', { size: 32, fill: C.card2, stroke: C.good, color: C.good }); tr(clChip, 290, 312);
  T(closedG, 290, 370, 'nothing gets in or out', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const lbStay = labelLine(G5, 770, 412, 648, 470, 'carbon dioxide stays in', { anchor: 'start' });
  const rule = G(G5);
  tr(tick(rule, 26), 162, 474);
  T(rule, 200, 490, 'the real rule', { size: 44, weight: 700, fill: C.good });

  /* ================= C. candle and steel wool ================= */
  const Cg = G(root);
  E('line', { x1: 600, y1: 150, x2: 600, y2: 700, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, Cg);
  const balL = rxBalance(Cg, { w: 300 }); tr(balL, 300, 540);
  const balR = rxBalance(Cg, { w: 300 }); tr(balR, 900, 540);
  // candle
  const candle = G(Cg); tr(candle, 300, 540);
  E('rect', { x: -26, y: -118, width: 52, height: 118, rx: 6, fill: linGrad('#FFF6E2', '#D9C9A4'), stroke: '#F3E9D2', 'stroke-width': 2 }, candle);
  E('path', { d: 'M-26,-112 Q-20,-96 -22,-84 Q-18,-92 -14,-112 Z', fill: '#FFF6E2' }, candle);
  E('line', { x1: 0, y1: -118, x2: 0, y2: -132, stroke: '#2A2420', 'stroke-width': 4, 'stroke-linecap': 'round' }, candle);
  const cfl = rxFlame(candle, 1.1); tr(cfl, 0, -128); cfl.set('candle', 1);
  const gasUp = [];
  for (let k = 0; k < 6; k++) gasUp.push({ g: k % 2 ? molH2O(Cg, 10) : molCO2(Cg, 8.5), ph: k / 6, dx: [-34, 6, 40][k % 3] });
  const lbGas = G(Cg);
  T(lbGas, 238, 206, 'carbon dioxide', { size: 28, weight: 700, anchor: 'end', fill: C.co2 });
  T(lbGas, 238, 242, 'and water vapour', { size: 28, weight: 700, anchor: 'end', fill: C.water });
  T(lbGas, 238, 278, 'escape', { size: 28, weight: 700, anchor: 'end', fill: C.ink });
  const lbCandle = labelLine(Cg, 196, 470, 272, 480, 'candle', { anchor: 'end' });
  const loseG = G(Cg);
  arrow(loseG, 150, 672, 150, 716, { color: C.bad, width: 6 });
  T(loseG, 176, 706, 'seems to lose mass', { size: 30, weight: 700, fill: C.bad });
  // steel wool
  const wool = G(Cg); tr(wool, 900, 540);
  const wr = rng(71); let wd = 'M-62,-8';
  for (let i = 0; i < 26; i++) { const x = -64 + wr() * 128, y = -8 - wr() * 48; wd += ` Q${(x + (wr() - 0.5) * 60).toFixed(1)},${(y - 20 + wr() * 40).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`; }
  const woolGlow = E('ellipse', { cx: 0, cy: -26, rx: 110, ry: 60, fill: glow('#FF8A3D') }, wool);
  const woolGrey = E('path', { d: wd, fill: 'none', stroke: '#B8C2CB', 'stroke-width': 3, 'stroke-linejoin': 'round' }, wool);
  const woolDark = E('path', { d: wd, fill: 'none', stroke: '#3E4652', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, wool);
  const embers = []; for (let i = 0; i < 14; i++) embers.push({ el: E('circle', { cx: -56 + wr() * 112, cy: -8 - wr() * 44, r: 2.5 + wr() * 2.5, fill: i % 3 ? '#FFB347' : '#FFE07A' }, wool), ph: wr(), th: i / 14 });
  const o2Down = [0, 1, 2, 3].map(k => ({ g: molO2(Cg, 9), ph: k / 4, x0: 720 + k * 34 }));
  const lbOx = T(Cg, 1150, 216, 'oxygen joins on', { size: 28, weight: 700, anchor: 'end', fill: '#FF9A8F' });
  const lbWool = labelLine(Cg, 1012, 470, 966, 506, 'steel wool', { anchor: 'start' });
  const gainG = G(Cg);
  arrow(gainG, 760, 716, 760, 672, { color: C.good, width: 6 });
  T(gainG, 786, 706, 'gains mass', { size: 30, weight: 700, fill: C.good });

  /* ================= update ================= */
  return t => {
    /* ---------- A ---------- */
    const aA = 1 - P(t, at('sealed') - 0.25, 0.45, linear);
    op(A, aA);
    if (aA > 0) {
      // the scale: a tilt right when the products load it, then level when the reactants do
      const sIn = P(t, at('law') - 0.05, 0.6, easeOut);
      const tR = mid('law', 0.12), tL = mid('law', 0.42);
      let th = 7 * P(t, tR, 0.6, easeOut) * (1 - P(t, tL, 0.5, ease));
      if (t > tL + 0.5) th += 2.2 * Math.exp(-2.6 * (t - tL - 0.5)) * Math.sin((t - tL - 0.5) * 7);
      const rad = th * Math.PI / 180, dyR = ARM * Math.sin(rad), dxA = ARM * (Math.cos(rad) - 1);
      const lift = (1 - sIn) * 40;
      op(scale, sIn);
      tr(scale, 0, lift);
      beam.setAttribute('transform', `rotate(${th.toFixed(2)} ${PIV[0]} ${PIV[1]})`);
      tr(pans[0], 600 - ARM - dxA, PANY - dyR); tr(pans[1], 600 + ARM + dxA, PANY + dyR);
      const offL = [-dxA, -dyR], offR = [dxA, dyR];
      // atoms: movers fly from the reactant places to the product places
      ORDER.forEach((k, i) => {
        const f = flight[k], u = clamp((t - f.st) / FLY), p = ease(u);
        const [x0, y0] = REACT[k], [x1, y1] = PROD[k];
        let x = x0, y = y0;
        if (u > 0) { const cx = (x0 + x1) / 2, cy = Math.min(y0, y1) - f.bend, q = 1 - p; x = q * q * x0 + 2 * q * p * cx + p * p * x1; y = q * q * y0 + 2 * q * p * cy + p * p * y1; }
        const pin = P(t, mid('rearr', 0.02 + (k[0] === 'O' ? 0.1 : i * 0.02)), 0.5, pop);
        const settle = u >= 1 ? 1 + 0.1 * Math.sin(Math.PI * P(t, f.st + FLY, 0.35, linear)) : 1;
        const jig = u <= 0 || u >= 1 ? Math.sin(t * 2 + i * 1.7) * 1.3 * AMP : 0;
        tr(movers[k], x + jig + offR[0], y + offR[1], Math.max(0.01, pin * settle));
        op(ghosts[k], P(t, f.st + 0.15, 0.5, linear) * 0.9 * (1 - P(t, mid('law', 0.34), 0.4, linear)));
        ghosts[k].setAttribute('transform', `translate(${offL[0].toFixed(1)} ${offL[1].toFixed(1)})`);
        // copies of the reactants for the left pan
        const pc = P(t, mid('law', 0.34), 0.5, linear);
        op(copies[k], pc); tr(copies[k], REACT[k][0] + offL[0], REACT[k][1] + offL[1]);
        // hide: every atom is still there
        const pt = P(t, mid('hide', 0.3 + i * 0.075), 0.4, pop);
        op(ticks[i], clamp(pt * 2)); tr(ticks[i], PROD[k][0] + offR[0] + (k[0] === 'O' ? 24 : 16), PROD[k][1] + offR[1] - (k[0] === 'O' ? 26 : 18), Math.max(0.01, pt));
      });
      const fc = 1 - P(t, at('law') - 0.15, 0.4, linear);
      rxArw.set(P(t, mid('rearr', 0.14), 0.6)); op(rxArw, fc);
      op(cntB, P(t, mid('rearr', 0.12), 0.4, linear) * fc);
      cntB.parts[1].textContent = String(Math.round(6 * P(t, mid('rearr', 0.12), 0.6, linear)));
      const landed = ORDER.filter(k => t >= flight[k].st + FLY).length;
      op(cntA, P(t, T0 + FLY - 0.3, 0.4, linear) * fc);
      cntA.parts[1].textContent = String(landed);
      const pk = P(t, mid('rearr', 0.8), 0.4, pop); op(cntTick, clamp(pk * 2) * fc); tr(cntTick, 974, 458, Math.max(0.01, pk));
      // labels on the scale, the law, the memory hook
      const pP = P(t, mid('law', 0.1), 0.45, pop), pR = P(t, mid('law', 0.36), 0.45, pop);
      op(chP, clamp(pP * 2)); tr(chP, 840 + offR[0], 540 + lift, Math.max(0.01, 0.7 + 0.3 * pP));
      op(chR, clamp(pR * 2)); tr(chR, 360 + offL[0], 540 + lift, Math.max(0.01, 0.7 + 0.3 * pR));
      const pl = P(t, mid('law', 0.62), 0.6, easeOut); op(lawChip, pl); tr(lawChip, 600, 682 + (1 - pl) * 18);
      const pm = P(t, at('hide') + 0.05, 0.55, pop); op(memo, clamp(pm * 2)); scaleAt(memo, 600, 175, 0.85 + 0.15 * pm);
    }

    /* ---------- B ---------- */
    const aB = P(t, at('sealed') - 0.2, 0.5, linear) * (1 - P(t, at('candle') - 0.25, 0.45, linear));
    op(B, aB);
    if (aB > 0) {
      const bIn = P(t, at('sealed') - 0.2, 0.7, easeOut);
      tr(bal, BX, PY + (1 - bIn) * 40);
      // which apparatus is on the pan
      const a1 = 1 - P(t, at('open') - 0.2, 0.35, linear);
      const a2 = P(t, at('open') - 0.1, 0.35, linear) * (1 - P(t, at('carbonate') - 0.25, 0.4, linear));
      const a4 = P(t, at('carbonate') - 0.1, 0.4, linear) * (1 - P(t, at('closed') - 0.25, 0.4, linear));
      const a5 = P(t, at('closed') - 0.1, 0.4, linear);
      op(G1, a1); op(G2, a2); op(G4, a4); op(G5, a5);
      tr(fl1, BX, PY - 92 * FS + (1 - bIn) * 40);

      // readings
      const cPick = P(t, mid('open', 0.2), end('open') + 0.25 - mid('open', 0.2), linear);
      const tLift = mid('carbonate', 0.31), tBack = mid('lighter', 0.25);
      let reading = 50, flash = 0;
      if (t >= at('open') - 0.1) { reading = lerp(2.4, 4.0, cPick); flash = cPick > 0 && cPick < 1 ? 0.6 : 0; }
      if (t >= at('carbonate') - 0.1) { reading = t < tLift ? 32.35 : t < tBack ? 0 : 27.95; flash = 0.8 * pulse(t, tBack, 0.6); }
      if (t >= at('closed') - 0.1) { reading = 86.4; flash = 0.8 * pulse(t, mid('closed', 0.5), 0.8); }
      if (t < at('open') - 0.1) flash = 0.85 * pulse(t, mid('sealed', 0.62), 1.0);
      bal.set({ reading, flash });

      // B1: sealed flask, the flash, no change
      if (a1 > 0) {
        const fx = P(t, mid('sealed', 0.45), 0.25, linear), fo = 1 - P(t, mid('sealed', 0.45) + 0.5, 0.8, linear);
        op(flash1, fx * fo * (0.85 + 0.15 * Math.sin(t * 31)));
        op(spark1, fx * fo); spark1.upd(t); tr(spark1, 0, 92 * FS - 18, 0.8 + 0.6 * fx * fo);
        const burnt = P(t, mid('sealed', 0.5), 0.5, linear);
        op(coil1, 1 - burnt); op(mgo1, burnt);
        o2in.forEach((o, k) => { tr(o.g, o.x + Math.sin(t * 0.9 * AMP + o.ph) * 10, o.y + Math.cos(t * 0.7 * AMP + o.ph) * 8, 1, (t * 25 * AMP + k * 60) % 360); op(o.g, 1 - P(t, mid('sealed', 0.47) + k * 0.06, 0.3, linear)); });
        lbSealed.set(P(t, mid('sealed', 0.14), 0.4, linear));
        lbMg1.set(P(t, mid('sealed', 0.04), 0.4, linear) * (1 - P(t, mid('sealed', 0.5), 0.3, linear)));
        const pn = P(t, mid('sealed', 0.66), 0.45, pop); op(noChange, clamp(pn * 2)); scaleAt(noChange, 880, 628, Math.max(0.01, 0.6 + 0.4 * pn));
      }
      // B2 + B3: the open crucible, then the zoom
      if (a2 > 0) {
        const lit = P(t, at('open') + 0.15, 0.3, linear) * (1 - P(t, end('open') + 0.1, 0.5, linear));
        fl2.set('white', lit * (1 + 0.1 * Math.sin(t * 17))); fl2.upd(t);
        op(glow2, lit * (0.8 + 0.2 * Math.sin(t * 23))); tr(glow2, 0, 0, 0.92 + 0.1 * Math.sin(t * 9));
        op(rays2, lit * 0.85); tr(rays2, 0, -110, 0.85 + 0.2 * wave(t, 0.35), (t * 30) % 360);
        op(coil2, 1 - cPick); op(mgo2, cPick); scaleAt(mgo2, 0, -72, 0.4 + 0.6 * cPick);
        lbOpen.set(win(t, mid('open', 0.08), at('why') + 0.2, 0.35));
        const ph = P(t, mid('open', 0.45), 0.45, pop); op(heavier, clamp(ph * 2) * (1 - P(t, at('why') + 0.2, 0.4, linear)));
        // the zoom
        const zin = P(t, at('why') - 0.05, 0.6, easeOut);
        op(Z, zin); scaleAt(Z, ZX, ZY, 0.6 + 0.4 * zin);
        if (zin > 0) {
          const j0 = mid('why', 0.12), jn = mid('why', 0.36);
          zO.forEach((o, k) => {
            const [sx, sy] = zFrom[k], [mx, my] = MGP[k];
            const fall = P(t, j0, 1.3, ease), join = P(t, jn + k * 0.12, 0.9, ease);
            let x = sx, y = lerp(sy, sy + 70, fall);
            x = lerp(x, mx + 22, join); y = lerp(y, my, join);
            tr(o, x + (join < 1 ? Math.sin(t * 2 + k) * 2 * AMP : 0), y);
            op(o, P(t, at('why') + 0.05, 0.4, linear));
            const pr = P(t, mid('why', 0.62) + k * 0.06, 0.4, pop);
            op(zRing[k], clamp(pr * 2)); tr(zRing[k], mx + 22, my, Math.max(0.01, pr));
          });
          zMg.forEach((g, k) => tr(g, MGP[k][0] - 20 + Math.sin(t * 1.5 + k) * 1.2 * AMP, MGP[k][1]));
          op(lbAir, P(t, mid('why', 0.06), 0.4, linear));
          op(lbMgO, P(t, mid('why', 0.5), 0.4, linear));
          op(lbBefore, P(t, mid('why', 0.66), 0.4, linear));
        }
        op(plusO, P(t, mid('why', 0.82), 0.5, linear));
      }
      // B4: heat copper carbonate in an open tube; back on the balance it is lighter
      if (a4 > 0) {
        const go = P(t, tLift, 1.2, ease), back = P(t, mid('lighter', 0.02), 0.85, ease);
        const u = go * (1 - back);
        const x = lerp(TUBE_ON[0], TUBE_HEAT[0], u), y = lerp(TUBE_ON[1], TUBE_HEAT[1], u) - (go < 1 ? Math.sin(Math.PI * go) : Math.sin(Math.PI * back)) * 90;
        tr(tubeG, x, y);
        op(holder, P(t, tLift - 0.2, 0.3, linear) * (1 - P(t, tBack + 0.1, 0.3, linear)));
        const heat = P(t, tLift + 1.0, end('carbonate') - tLift - 0.4, linear);
        tube.set(0.22 - 0.05 * heat, mix(RX.cuCarbonate, RX.cuOxide, heat));
        const lit = P(t, tLift + 0.6, 0.3, linear) * (1 - P(t, end('carbonate') + 0.2, 0.3, linear));
        bun.set(lit > 0.01 ? 'blue' : 'off'); bun.upd(t); op(bun, 1);
        const gasOn = P(t, tLift + 1.4, 0.4, linear), gasOff = 1 - P(t, mid('lighter', 0.3), 0.6, linear);
        co2s.forEach((c, k) => {
          const q = ((t - tLift) * 0.42 + c.ph) % 1;
          const px = TUBE_HEAT[0] + c.dx * q + Math.sin(q * 6 + k) * 6, py = TUBE_HEAT[1] - 96 - q * 118;
          tr(c.g, px, py, 1, (q * 120 + k * 40) % 360);
          op(c.g, gasOn * gasOff * Math.sin(Math.PI * q) * (t > tLift + 1.2 ? 1 : 0));
        });
        lbCarb.set(win(t, mid('carbonate', 0.1), tLift + 0.1, 0.35));
        op(lbCO2, gasOn * (1 - P(t, mid('lighter', 0.5), 0.5, linear)) * P(t, mid('carbonate', 0.62), 0.4, linear));
        lbCuO.set(P(t, mid('lighter', 0.5), 0.4, linear));
        const pl = P(t, tBack + 0.15, 0.45, pop); op(lighter, clamp(pl * 2)); scaleAt(lighter, 870, 630, Math.max(0.01, 0.6 + 0.4 * pl));
      }
      // B5: the bunged flask: it fizzes, the gas stays in, the reading holds
      if (a5 > 0) {
        const r3 = P(t, mid('closed', 0.16), 3.6, linear);
        fizz3.upd(t, P(t, mid('closed', 0.12), 0.5, linear) * (1 - 0.4 * r3));
        fk3.set(0.3, mix(ACID, RX.cuSulfate, 0.6 * r3));
        powder3.setAttribute('transform', `translate(0 109) scale(${(1 - 0.35 * r3).toFixed(3)} ${(1 - 0.45 * r3).toFixed(3)}) translate(0 -109)`);
        lbMix.set(P(t, mid('closed', 0.1), 0.4, linear));
        co2in.forEach((c, k) => {
          const y = bounce(c.y0 + c.vy * t * AMP, -22, 44), x = bounce(c.u0 + c.vu * t * AMP, -1, 1) * coneHW(y);
          tr(c.g, x, y, 1, (t * 40 * AMP + k * 70) % 360);
          op(c.g, P(t, mid('closed', 0.24) + k * 0.12, 0.5, linear));
        });
        tr(co2neck, Math.sin(t * 1.7) * 3, bounce(-60 + t * 30 * AMP, -80, -50), 1, 90);
        op(co2neck, P(t, mid('closed', 0.42), 0.5, linear));
        const pc = P(t, mid('closed', 0.06), 0.5, pop); op(closedG, clamp(pc * 2)); scaleAt(closedG, 290, 330, Math.max(0.01, 0.8 + 0.2 * pc));
        lbStay.set(P(t, mid('closed', 0.4), 0.4, linear));
        const pr = P(t, mid('closed', 0.84), 0.5, pop); op(rule, clamp(pr * 2)); scaleAt(rule, 260, 478, Math.max(0.01, 0.6 + 0.4 * pr));
      }
    }

    /* ---------- C ---------- */
    const aC = P(t, at('candle') - 0.1, 0.5, linear);
    op(Cg, aC);
    if (aC > 0) {
      const L = end('candle') - at('candle');
      const burnL = P(t, mid('candle', 0.1), L * 0.78, linear);
      balL.set({ reading: lerp(20, 19.4, burnL), flash: burnL > 0 && burnL < 1 ? 0.45 : 0 });
      cfl.upd(t);
      gasUp.forEach((m, k) => {
        const q = ((t - at('candle')) * 0.36 + m.ph) % 1;
        tr(m.g, 300 + m.dx * q + Math.sin(q * 7 + k) * 7, 326 - q * 172, 1, (q * 90 + k * 50) % 360);
        op(m.g, P(t, mid('candle', 0.06), 0.4, linear) * Math.sin(Math.PI * q) * (t > at('candle') ? 1 : 0));
      });
      op(lbGas, P(t, mid('candle', 0.3), 0.4, linear));
      lbCandle.set(P(t, mid('candle', 0.03), 0.4, linear));
      op(loseG, P(t, mid('candle', 0.16), 0.4, linear));
      // steel wool
      const pw = P(t, mid('candle', 0.5), 0.6, easeOut);
      op(balR, pw); op(wool, pw); tr(balR, 900, 540 + (1 - pw) * 30); tr(wool, 900, 540 + (1 - pw) * 30);
      const burnR = P(t, mid('candle', 0.62), L * 0.34, linear), ign = P(t, mid('candle', 0.58), 0.5, linear);
      balR.set({ reading: lerp(5, 5.6, burnR), flash: burnR > 0 && burnR < 1 ? 0.45 : 0 });
      op(woolGlow, ign * (0.55 + 0.25 * wave(t, 0.7)));
      op(woolDark, ign * burnR);
      embers.forEach(e => op(e.el, ign * clamp((ign * 1.3 - e.th) * 3) * (0.35 + 0.65 * wave(t, 0.5 + e.ph * 0.6, e.ph))));
      o2Down.forEach((m, k) => {
        const q = ((t - mid('candle', 0.6)) * 0.45 + m.ph) % 1;
        tr(m.g, lerp(m.x0, 880 + k * 12, q), lerp(200, 500, q), 1, (q * 140 + k * 60) % 360);
        op(m.g, P(t, mid('candle', 0.6), 0.4, linear) * Math.min(1, q * 6, (1 - q) * 4) * (t > mid('candle', 0.6) ? 1 : 0));
      });
      op(lbOx, P(t, mid('candle', 0.8), 0.4, linear));
      lbWool.set(P(t, mid('candle', 0.54), 0.4, linear));
      op(gainG, P(t, mid('candle', 0.7), 0.4, linear));
    }
  };
});

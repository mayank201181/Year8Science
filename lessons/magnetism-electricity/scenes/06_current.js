/* Chapter 6, Current, conductors and insulators.
   The standard loop (a cell, a bulb, a switch) -> current is a flow of charge -> it needs a complete loop
   and a cell; a second cell makes a battery -> the cell as a pump -> a gap stops it everywhere at once
   -> close the switch: every charge starts together (showpiece) -> a test gap: conductors light the bulb,
   insulators don't -> a wire cut open: copper inside plastic. */
scene('current', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* The loop's current is a list of runs of steady flow [t0, t1, speed px/s, bulb brightness].
     Every dot is placed by the distance flowed so far, so all of them start and stop at the same instant. */
  const distOf = (t, runs) => { let d = 0; for (const r of runs) if (t > r[0]) d += r[2] * (Math.min(t, r[1]) - r[0]); return d; };
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  const runAt = (t, runs) => { for (const r of runs) if (t >= r[0] && t < r[1]) return r; return null; };
  const lastStop = (t, runs) => { let s = -1; for (const r of runs) if (r[1] <= t && r[1] > s) s = r[1]; return s; };
  /* paint that matches the stage background, to cut a visible gap in a wire */
  function bgPaint() {
    const id = 'me6cut';
    if (!document.getElementById(id)) {
      const lg = E('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 0, y2: H }, defs());
      E('stop', { offset: 0, 'stop-color': C.bg1 }, lg); E('stop', { offset: 1, 'stop-color': C.bg0 }, lg);
    }
    return `url(#${id})`;
  }
  /* the kit cell, able to grow into the kit's two-cell battery: g.set(shift 0..1, drop 0..1) */
  function growBattery(parent) {
    const g = G(parent);
    const line = (x1, x2, w, dash) => E('line', { x1, x2, y1: 0, y2: 0, stroke: WIRE, 'stroke-width': w || 5, 'stroke-linecap': dash ? 'butt' : 'round', 'stroke-dasharray': dash }, g);
    const leadL = line(-59, -8), leadR = line(8, 59), link = line(-9, 9, 4, '4 5');
    const plates = gg => {
      E('line', { x1: 0, x2: 0, y1: -30, y2: 30, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, gg);
      E('line', { x1: 16, x2: 16, y1: -15, y2: 15, stroke: WIRE, 'stroke-width': 10, 'stroke-linecap': 'round' }, gg);
    };
    const A = G(g); plates(A);
    const B = G(g); plates(B);
    const plus = T(g, -12, -40, '+', { size: 30, weight: 700, anchor: 'middle', fill: C.bad });
    const minus = T(g, 12, -40, '−', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
    g.set = (qa, qb) => {
      const xa = lerp(-8, -25, qa), landed = qb >= 1, e = easeOut(qb);
      tr(A, xa, 0); attr(leadL, 'x2', xa); attr(leadR, 'x1', landed ? 25 : xa + 16);
      op(link, landed ? 1 : 0);
      tr(B, lerp(80, 9, e), lerp(-110, 0, e)); op(B, clamp(qb * 3));
      attr(plus, 'x', xa - 4); attr(minus, 'x', lerp(xa + 20, 29, P(qb, 0.7, 0.3)));
    };
    g.set(0, 0);
    return g;
  }
  /* crocodile clip, jaws opening to the right of (0,0); flip for one facing left */
  function croc(parent, flip) {
    const g = G(parent), inner = G(g);
    if (flip) inner.setAttribute('transform', 'scale(-1 1)');
    E('rect', { x: -60, y: -12, width: 34, height: 24, rx: 8, fill: '#33414D', stroke: '#6F8597', 'stroke-width': 2.5 }, inner);
    const jaw = 'M-30,-5 L-2,-15 L4,-12 L-4,-9 L2,-7 L-6,-5 L-28,0 Z';
    E('path', { d: jaw, fill: linGrad('#F1F4F7', '#8E9BA7', true), stroke: '#C9D3DC', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, inner);
    E('path', { d: jaw, fill: linGrad('#F1F4F7', '#8E9BA7', true), stroke: '#C9D3DC', 'stroke-width': 1.5, 'stroke-linejoin': 'round', transform: 'scale(1 -1)' }, inner);
    E('circle', { cx: -26, cy: 0, r: 4, fill: '#C9D3DC' }, inner);
    return g;
  }
  /* test samples: 120 x 20 bars centred on (0,0) */
  const ART = {
    copper: g => { E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 10, fill: linGrad('#F7B985', '#A4521F', true), stroke: '#FFD2A8', 'stroke-width': 2 }, g); E('rect', { x: -50, y: -6, width: 100, height: 4, rx: 2, fill: '#FFE6CF', opacity: 0.55 }, g); },
    gold: g => { E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 4, fill: linGrad('#FFE89A', '#C08A12', true), stroke: '#FFF1C4', 'stroke-width': 2 }, g); E('rect', { x: -52, y: -6, width: 104, height: 4, rx: 2, fill: '#FFFBE6', opacity: 0.6 }, g); },
    aluminium: g => { E('rect', { x: -60, y: -9, width: 120, height: 18, rx: 3, fill: linGrad('#F4F7FA', '#8E9BA7', true), stroke: '#FFFFFF', 'stroke-width': 1.5 }, g); E('rect', { x: -52, y: -5, width: 104, height: 3, rx: 1.5, fill: '#FFFFFF', opacity: 0.7 }, g); },
    graphite: g => {
      E('path', { d: 'M-38,-9 L38,-9 L52,-3 L60,0 L52,3 L38,9 L-38,9 L-52,3 L-60,0 L-52,-3 Z', fill: '#E9C79C', stroke: '#B08A5E', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
      E('rect', { x: -38, y: -9, width: 76, height: 18, fill: '#F2C230' }, g);
      E('rect', { x: -38, y: -3, width: 76, height: 3, fill: '#FFE07A', opacity: 0.8 }, g);
      E('path', { d: 'M50,-3.6 L60,0 L50,3.6 Z M-50,-3.6 L-60,0 L-50,3.6 Z', fill: '#3E444B' }, g);
    },
    plastic: g => {
      E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 3, fill: 'rgba(80,170,255,0.55)', stroke: '#9FD3FF', 'stroke-width': 2 }, g);
      for (let k = 0; k <= 10; k++) E('line', { x1: -52 + k * 10.4, x2: -52 + k * 10.4, y1: -10, y2: k % 5 ? -4 : 0, stroke: '#E6F4FF', 'stroke-width': 1.5 }, g);
    },
    rubber: g => { E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 7, fill: linGrad('#FFA9BE', '#D45B7C', true), stroke: '#FFD0DC', 'stroke-width': 2 }, g); },
    glass: g => {
      E('rect', { x: -60, y: -9, width: 120, height: 18, rx: 9, fill: 'rgba(200,230,250,0.22)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, g);
      E('rect', { x: -50, y: -5, width: 96, height: 3.5, rx: 1.75, fill: '#FFFFFF', opacity: 0.55 }, g);
    },
    wood: g => {
      E('rect', { x: -60, y: -10, width: 120, height: 20, rx: 4, fill: linGrad('#D49A5E', '#8A5A2B', true), stroke: '#E8BC8A', 'stroke-width': 2 }, g);
      E('path', { d: 'M-52,-3 Q-20,-7 10,-2 T54,-3 M-48,4 Q-10,1 22,5 T56,3', fill: 'none', stroke: '#7A4A20', 'stroke-width': 1.6, opacity: 0.8 }, g);
    },
    air: g => {
      E('path', { d: 'M-40,-6 Q-26,-14 -12,-6 T16,-6 T44,-6 M-30,7 Q-16,-1 -2,7 T26,7', fill: 'none', stroke: C.air, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    },
  };
  function snail(parent) {
    const g = G(parent);
    E('path', { d: 'M-34,14 Q-36,4 -24,4 L18,4 Q30,4 34,-10 L38,-24 M34,-10 L30,-26', fill: 'none', stroke: '#BFD6C6', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-34,14 Q-38,4 -24,3 L22,3 Q34,2 36,-8 Q40,6 30,14 Z', fill: '#9FC7AE' }, g);
    E('circle', { cx: 38, cy: -26, r: 3.5, fill: '#2B3B33' }, g); E('circle', { cx: 30, cy: -28, r: 3.5, fill: '#2B3B33' }, g);
    E('circle', { cx: -4, cy: -12, r: 17, fill: ball('#FFC247', '#B57B12'), stroke: '#8A5A12', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-4,-12 m0,-3 a3,3 0 1 1 -3,3 a7,7 0 1 1 7,7 a11,11 0 1 1 -11,-11', fill: 'none', stroke: '#8A5A12', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= the standard loop ================= */
  const L = 190, R = 710, TOP = 230, BOT = 520, BX = 450, SWY = 375, BUX = 590;
  const GX0 = 300, GX1 = 380, GXC = 340;          // the test gap on the top wire (conductors)
  const SNY = 375;                                // where the right-hand wire snaps (gap)
  const cg = G(root);
  const LOOP_D = `M${BX},${BOT} L${L},${BOT} L${L},${TOP} L${R},${TOP} L${R},${BOT} Z`;
  const outline = E('path', { d: LOOP_D, fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0.22 }, cg);
  const tracer = E('path', { d: LOOP_D, fill: 'none', stroke: C.energyLt, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.12 0.88' }, cg);
  const cellGlow = E('circle', { cx: BX, cy: BOT, r: 120, fill: glow(C.energy) }, cg);
  const W1 = wire(cg, [[BX - 59, BOT], [L, BOT], [L, SWY + 50]]);
  const W2 = wire(cg, [[L, SWY - 50], [L, TOP], [BUX - 46, TOP]]);
  const W3 = wire(cg, [[BUX + 46, TOP], [R, TOP], [R, BOT], [BX + 59, BOT]]);
  const WIRES = [W1, W2, W3], DOTS = [];
  WIRES.forEach(w => w.querySelectorAll('circle').forEach(d => DOTS.push(d)));
  const cut = bgPaint();
  // the snapped wire: a cut in the right-hand wire with rounded broken ends
  const snapG = G(cg);
  E('rect', { x: R - 12, y: SNY - 13, width: 24, height: 26, fill: cut }, snapG);
  E('circle', { cx: R, cy: SNY - 13, r: 2.5, fill: WIRE }, snapG); E('circle', { cx: R, cy: SNY + 13, r: 2.5, fill: WIRE }, snapG);
  const snapSpark = spark(cg, 18, { seed: 5 });
  const mendRing = E('circle', { cx: R, cy: SNY, r: 10, fill: 'none', stroke: C.energyLt, 'stroke-width': 3 }, cg);
  // the test gap: a cut in the top wire, a lifted-out piece of wire
  const gapCut = E('rect', { x: GX0 - 4, y: TOP - 13, width: GX1 - GX0 + 8, height: 26, fill: cut }, cg);
  const liftPiece = E('line', { x1: GX0, x2: GX1, y1: TOP, y2: TOP, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, cg);
  // ping rings around every dot (all at the same instant)
  const ringG = G(cg);
  const RINGS = DOTS.map(() => E('circle', { r: 6, fill: 'none', stroke: C.energyLt, 'stroke-width': 3 }, ringG));
  // components
  const bat = growBattery(cg); tr(bat, BX, BOT);
  const bulb = bulbSym(cg); tr(bulb, BUX, TOP);
  const sw = switchSym(cg); tr(sw, L, SWY, 1, -90);
  // flow arrow for the first beat: clockwise round the loop
  const flowArc = G(cg);
  arrow(flowArc, 368, 356, 532, 356, { color: C.energy, width: 6, bend: -78 });
  arrow(flowArc, 532, 394, 368, 394, { color: C.energy, width: 6, bend: -78 });
  // the pump over the battery
  const pump = G(cg);
  E('rect', { x: BX - 92, y: BOT - 50, width: 184, height: 100, rx: 20, fill: 'rgba(255,228,92,0.10)', stroke: 'rgba(255,228,92,0.75)', 'stroke-width': 3 }, pump);
  const plunger = G(pump);
  E('rect', { x: -6, y: 0, width: 12, height: 74, rx: 3, fill: 'rgba(255,247,194,0.55)', stroke: 'rgba(255,228,92,0.9)', 'stroke-width': 2 }, plunger);
  E('rect', { x: -46, y: -10, width: 92, height: 18, rx: 9, fill: 'rgba(255,228,92,0.55)', stroke: C.energy, 'stroke-width': 2.5 }, plunger);
  const pushL = arrow(pump, BX - 120, BOT + 36, BX - 190, BOT + 36, { color: C.energy, width: 6 });
  const pushR = arrow(pump, BX + 190, BOT + 36, BX + 120, BOT + 36, { color: C.energy, width: 6 });
  // the test-gap clips and the samples between them
  const sampleG = G(cg);
  const clipL = croc(cg, false); tr(clipL, GX0, TOP);
  const clipR = croc(cg, true); tr(clipR, GX1, TOP);
  const gapTick = tick(cg, 17); tr(gapTick, GXC, 176);
  const gapCross = cross(cg, 15); tr(gapCross, GXC, 176);
  // symbol labels
  const lbBulb = T(cg, BUX, 160, 'bulb', { size: 30, weight: 600, anchor: 'middle' });
  const lbSwitch = T(cg, L - 46, SWY + 10, 'switch', { size: 30, weight: 600, anchor: 'end' });
  const chCell = chip(cg, 'cell', { size: 28, fill: C.card2, stroke: C.line }); tr(chCell, BX, 602);
  const chBat = chip(cg, 'battery: 2+ cells', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(chBat, BX, 602);

  /* ================= right-hand column ================= */
  const CX0 = 790;
  const curG = G(root);
  T(curG, CX0, 320, 'current', { size: 60, weight: 700, fill: C.energy });
  T(curG, CX0, 376, 'a flow of charge', { size: 34, weight: 600 });
  T(curG, CX0, 418, 'around a circuit', { size: 30, weight: 500, fill: C.muted });

  const ndG = G(root);
  T(ndG, CX0, 250, 'It needs:', { size: 32, weight: 600, fill: C.muted });
  const NEEDS = [[330, ['a ', ['complete loop', C.energy, 700]]], [410, ['a ', ['cell', C.energy, 700], ' to push it']]].map(([y, segs]) => {
    const g = G(ndG);
    E('rect', { x: CX0, y: y - 34, width: 44, height: 44, rx: 10, fill: '#0D2330', stroke: C.muted, 'stroke-width': 3 }, g);
    const tk = tick(g, 15); tr(tk, CX0 + 22, y - 13);
    rich(g, CX0 + 64, y, segs, { size: 32 });
    return { g, tk };
  });

  const pmG = G(root);
  T(pmG, CX0, 290, 'a cell is like', { size: 32, weight: 600, fill: C.muted });
  T(pmG, CX0, 356, 'a pump', { size: 60, weight: 700, fill: C.energy });
  T(pmG, CX0, 408, 'pushing charge', { size: 32, weight: 600 });
  T(pmG, CX0, 448, 'round the loop', { size: 32, weight: 600 });

  const gpG = G(root);
  const gpChip1 = chip(gpG, 'open switch', { size: 30, fill: 'rgba(255,96,112,0.16)', stroke: C.bad }); tr(gpChip1, CX0 + gpChip1.w / 2, 280);
  const gpChip2 = chip(gpG, 'broken wire', { size: 30, fill: 'rgba(255,96,112,0.16)', stroke: C.bad }); tr(gpChip2, CX0 + gpChip2.w / 2, 360);
  const gpTxt = G(gpG);
  T(gpTxt, CX0, 460, 'current stops', { size: 36, weight: 700 });
  rich(gpTxt, CX0, 504, [['everywhere', C.bad, 700], ', instantly'], { size: 32 });

  const inG = G(root);
  const ROWS_IN = [
    { y: 262, text: ['bulb lights ', ['at once', C.energy, 700]], icon: g => { const b = bulbSym(g); tr(b, 0, 0, 0.62); b.set(1); } },
    { y: 352, text: ['charges ', ['drift slowly', C.energy, 700]], icon: g => { g.snail = snail(g); tr(g.snail, -2, 4, 0.8); } },
    { y: 442, text: ['but they ', ['fill the wire', C.energy, 700]], icon: g => { E('line', { x1: -30, x2: 30, y1: 0, y2: 0, stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round' }, g); for (let k = 0; k < 4; k++) E('circle', { cx: -24 + k * 16, cy: 0, r: 5.5, fill: C.energy }, g); } },
    { y: 532, text: ['so ', ['all start together', C.energy, 700]], icon: g => { E('circle', { r: 6, fill: C.energy }, g); E('circle', { r: 14, fill: 'none', stroke: C.energyLt, 'stroke-width': 3 }, g); E('circle', { r: 23, fill: 'none', stroke: C.energyLt, 'stroke-width': 2.5, opacity: 0.5 }, g); } },
  ].map(r => {
    const g = G(inG);
    const ic = G(g); tr(ic, CX0 + 24, r.y - 10); r.icon(ic);
    rich(g, CX0 + 66, r.y, r.text, { size: 31 });
    return { g, ic, y: r.y };
  });

  /* ================= conductors and insulators: results cards ================= */
  const CARD_X = 782, CARD_W = 380;
  const cdG = G(root), isG = G(root);
  const topG = G(root);                           // samples fly above the cards; the clips grip over the samples
  [sampleG, clipL, clipR, gapTick, gapCross].forEach(e => topG.appendChild(e));
  card(cdG, CARD_X, 132, CARD_W, 250, { fill: C.card, stroke: C.line });
  const cdHead = tick(cdG, 13); tr(cdHead, CARD_X + 32, 172);
  T(cdG, CARD_X + 60, 184, 'conductors', { size: 34, weight: 700, fill: C.good });
  card(isG, CARD_X, 398, CARD_W, 282, { fill: C.card, stroke: C.line });
  const isHead = cross(isG, 11); tr(isHead, CARD_X + 32, 434);
  T(isG, CARD_X + 60, 446, 'insulators', { size: 34, weight: 700, fill: C.bad });

  const LIST = [
    { key: 'copper', name: 'copper', good: true, f: 0.30, row: 230, v: 60, b: 1 },
    { key: 'gold', name: 'gold', good: true, f: 0.47, row: 268, v: 60, b: 1 },
    { key: 'aluminium', name: 'aluminium', good: true, f: 0.63, row: 306, v: 60, b: 1 },
    { key: 'graphite', name: 'graphite (carbon)', good: true, f: 0.80, row: 344, v: 45, b: 0.7 },
    { key: 'plastic', name: 'plastic', good: false, f: 0.22, row: 494 },
    { key: 'rubber', name: 'rubber', good: false, f: 0.37, row: 532 },
    { key: 'glass', name: 'glass', good: false, f: 0.52, row: 570 },
    { key: 'wood', name: 'wood', good: false, f: 0.67, row: 608 },
    { key: 'air', name: 'dry air', good: false, f: 0.82, row: 646, air: true },
  ].map(s => {
    s.t = mid(s.good ? 'conductors' : 'insulators', s.f);
    // a conductor cycle: drop in 0.22 s, contact until +0.75, fly to its card row until +1.15; insulators are quicker
    s.tIn = s.t + (s.good ? 0.22 : 0.16); s.tOut = s.t + (s.good ? 0.75 : 0.46); s.tDone = s.tOut + (s.good ? 0.4 : 0.34);
    s.g = G(sampleG); ART[s.key](s.g);
    s.tag = T(topG, GXC, TOP + 58, s.name, { size: 28, weight: 600, anchor: 'middle', fill: s.good ? C.good : '#FF9AA4' });
    const host = s.good ? cdG : isG;
    s.rowG = G(host);
    T(s.rowG, CARD_X + 98, s.row, s.name, { size: 28, weight: 600 });
    const mk = s.good ? tick(s.rowG, 11) : cross(s.rowG, 9); tr(mk, CARD_X + CARD_W - 34, s.row - 9);
    return s;
  });

  /* ================= inside a wire ================= */
  const cbG = G(root);
  const CY = 400, SKIN = '#E2A877', SKIN_DK = '#A86E45';
  T(cbG, 600, 176, 'inside a wire', { size: 48, weight: 700, anchor: 'middle' });
  E('rect', { x: 110, y: CY - 40, width: 890, height: 80, rx: 40, fill: '#1B5E40' }, cbG);
  E('rect', { x: 500, y: CY - 17, width: 380, height: 34, rx: 4, fill: linGrad('#F7B985', '#9C4C1C', true) }, cbG);
  const strands = G(cbG);
  for (let k = 0; k < 22; k++) E('line', { x1: 506 + k * 17, y1: CY - 16, x2: 518 + k * 17, y2: CY + 16, stroke: '#7E3C14', 'stroke-width': 2, opacity: 0.55 }, strands);
  const cableDots = wire(cbG, [[130, CY], [985, CY]], { color: 'none', spacing: 42 });
  const sheathF = linGrad('#8DEBBE', '#2E9B67', true);
  E('path', { d: `M520,${CY - 40} L150,${CY - 40} A40,40 0 0 0 150,${CY + 40} L520,${CY + 40} Z`, fill: sheathF }, cbG);
  E('path', { d: `M860,${CY - 40} L960,${CY - 40} A40,40 0 0 1 960,${CY + 40} L860,${CY + 40} Z`, fill: sheathF }, cbG);
  E('rect', { x: 150, y: CY - 30, width: 370, height: 8, rx: 4, fill: '#D6FBE8', opacity: 0.45 }, cbG);
  E('rect', { x: 860, y: CY - 30, width: 100, height: 8, rx: 4, fill: '#D6FBE8', opacity: 0.45 }, cbG);
  [520, 860].forEach(x => {
    E('ellipse', { cx: x, cy: CY, rx: 13, ry: 40, fill: '#6FD6A3', stroke: '#2A8A5B', 'stroke-width': 2.5 }, cbG);
    E('ellipse', { cx: x, cy: CY, rx: 6, ry: 17, fill: '#D9893F', stroke: '#9C4C1C', 'stroke-width': 1.5 }, cbG);
  });
  const lbCopper = labelLine(cbG, 742, 532, 700, CY + 12, '**copper** carries the current', { size: 30, fill: '#F7B985' });
  const lbPlastic = labelLine(cbG, 560, 286, 470, CY - 36, '**plastic** keeps it in,', { size: 30, fill: '#8DEBBE', anchor: 'start' });
  const lbSafe = rich(cbG, 560, 326, [['and keeps ', C.ink], ['you safe', C.good, 700]], { size: 30 });
  const hand = G(cbG);
  E('path', { d: 'M-44,70 L-58,330 L58,330 L44,70 Z', fill: '#5B8DEF' }, hand);
  E('rect', { x: -48, y: 62, width: 96, height: 20, rx: 8, fill: '#4A78D6' }, hand);
  E('path', { d: 'M-58,18 Q-64,70 -40,80 L40,80 Q64,70 58,18 Z', fill: SKIN, stroke: SKIN_DK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, hand);
  for (let i = 0; i < 4; i++) {
    const x = -42 + i * 28, h = [86, 94, 92, 82][i];
    E('rect', { x: x - 14, y: -46 + (94 - h) * 0.5, width: 28, height: h, rx: 14, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 3 }, hand);
    E('path', { d: `M${x - 9},${-6} Q${x},${-1} ${x + 9},${-6}`, fill: 'none', stroke: SKIN_DK, 'stroke-width': 2, opacity: 0.7 }, hand);
  }
  E('path', { d: 'M-66,44 Q-80,0 -52,-22 Q-34,-34 -14,-20 Q-6,-12 -16,-4 Q-34,-10 -46,4 Q-54,20 -44,40 Z', fill: SKIN, stroke: SKIN_DK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, hand);
  const safeTick = tick(cbG, 22); tr(safeTick, 300, 286);

  /* ================= timings ================= */
  const tLift = mid('needs', 0.70), tDrop = tLift + 0.32, tLand = tDrop + 0.42;      // the second cell
  const tOpen1 = at('gap') + 0.3, tClose1 = tOpen1 + 1.72, tSnap = tClose1 + 1.0;   // switch open, closed, wire snaps
  const tOpen2 = tSnap + 1.5, tMend = tOpen2 + 0.42, tClose2 = at('instant') + 0.15; // quiet reset, then the showpiece
  const SWT = 0.25;                                                                 // lever travel; contact when it lands
  const tTest = at('conductors') - 0.25;                                            // the test gap opens
  const tp0 = at('pump') + 0.35, TP = 0.95, NP = 3, tp1 = tp0 + NP * TP, AMP = 36;  // pump strokes
  const RUNS = [
    [1.5, tLand, 30, 0.4],                 // one cell: half the push
    [tLand, tOpen1, 60, 1],                // the 3 V battery
    [tClose1 + SWT, tSnap, 60, 1],
    [tClose2 + SWT, tTest, 60, 1],
  ];
  LIST.forEach(s => { if (s.good) RUNS.push([s.tIn, s.tOut, s.v, s.b]); });
  const pumpExtra = t => (t <= tp0 ? 0 : t >= tp1 ? 0 : AMP * TP / TAU * (1 - Math.cos(TAU * (t - tp0) / TP)));
  const pings = [tClose2 + SWT, mid('instant', 0.76)];

  /* ================= update ================= */
  return t => {
    const tCB = at('wire') - 0.05;
    const aC = 1 - P(t, tCB, 0.5, linear);
    op(cg, aC); op(topG, aC);
    if (aC > 0) {
      // the current: runs of flow, dots, bulb
      const run = runAt(t, RUNS);
      const d = distOf(t, RUNS) + pumpExtra(t);
      let dop;
      if (run) dop = lerp(0.3, 1, P(t, run[0], 0.12, linear));
      else { const s = lastStop(t, RUNS); dop = s < 0 ? 1 : 1 - 0.7 * P(t, s, 0.4, linear); }
      WIRES.forEach(w => { w.upd(d, 1); w.set(dop); });
      bulb.set(run ? run[3] : 0);

      // the battery grows from one cell to two
      bat.set(P(t, tLift, 0.3), P(t, tDrop, tLand - tDrop, linear));
      op(chCell, 1 - P(t, tLand + 0.05, 0.3, linear));
      const cbp = P(t, tLand + 0.05, 0.45, pop); op(chBat, clamp(cbp * 2)); tr(chBat, BX, 602, 0.85 + 0.15 * cbp);

      // complete loop: a tracer runs round from +, the outline glows; then the cell glows
      const tTr = mid('needs', 0.2), tr2 = mid('instant', 0.56);
      const trP = P(t, tTr, 1.1, linear), trQ = P(t, tr2, 1.1, linear);
      const trOn = Math.max(win(t, tTr, tTr + 1.15, 0.12), win(t, tr2, tr2 + 1.15, 0.12));
      op(tracer, trOn);
      if (trOn > 0) tracer.setAttribute('stroke-dashoffset', (-(t < tr2 - 0.5 ? trP : trQ)).toFixed(4));
      op(outline, Math.max(win(t, tTr + 0.2, mid('needs', 0.5), 0.35), win(t, tr2 + 0.2, mid('instant', 0.72), 0.35)));
      op(cellGlow, win(t, mid('needs', 0.46), mid('needs', 0.68), 0.35) * (0.75 + 0.25 * wave(t, 1.2)));

      // first beat: the flow arrows
      const fa = win(t, mid('current', 0.5), at('needs') + 0.1, 0.4);
      op(flowArc, fa * (0.55 + 0.25 * wave(t, 1.6)));

      // the pump: plunger strokes, push arrows pulse
      const pmA = win(t, at('pump') - 0.05, tp1 + 0.35, 0.35);
      op(pump, pmA);
      if (pmA > 0) {
        const ph = t > tp0 && t < tp1 ? (t - tp0) / TP : 0;
        tr(plunger, BX, BOT - 124 + 30 * (1 - Math.cos(TAU * ph)) / 2);
        const surge = t > tp0 && t < tp1 ? Math.max(0, Math.sin(TAU * ph)) : 0;
        pushL.set(1); pushR.set(1);
        op(pushL, 0.45 + 0.55 * surge); op(pushR, 0.45 + 0.55 * surge);
      }

      // the switch: open, closed, the quiet reset, then the showpiece close
      const lever = t < tOpen1 ? 1 : t < tClose1 ? 1 - P(t, tOpen1, SWT) : t < tOpen2 ? P(t, tClose1, SWT) : t < tClose2 ? 1 - P(t, tOpen2, SWT) : P(t, tClose2, SWT, easeIn);
      sw.set(lever);

      // the snapped wire, and its mend
      const snapOn = t >= tSnap && t < tMend + 0.25 ? 1 - P(t, tMend, 0.25, linear) : 0;
      op(snapG, snapOn);
      const sp = (t - tSnap) / 0.55;
      if (sp > 0 && sp < 1) { op(snapSpark, Math.sin(sp * Math.PI)); tr(snapSpark, R, SNY, 0.4 + 0.8 * Math.sin(sp * Math.PI)); snapSpark.upd(t); } else op(snapSpark, 0);
      const mp = (t - tMend) / 0.5;
      if (mp > 0 && mp < 1) { op(mendRing, 1 - mp); attr(mendRing, 'r', 8 + 22 * mp); } else op(mendRing, 0);

      // pings: a ring round every dot at the same instant
      let pg = 0;
      pings.forEach(tp => { const u = (t - tp) / 0.7; if (u > 0 && u < 1) pg = Math.max(pg, 1 - u); });
      op(ringG, pg > 0 ? 1 : 0);
      if (pg > 0) RINGS.forEach((rg, k) => { const dd = DOTS[k]; attr(rg, 'cx', +dd.getAttribute('cx')); attr(rg, 'cy', +dd.getAttribute('cy')); attr(rg, 'r', 6 + 20 * (1 - pg)); rg.style.opacity = pg.toFixed(3); });

      // the test gap, the clips and the samples
      const gOn = t >= tTest ? 1 : 0;
      op(gapCut, gOn);
      const lp = P(t, tTest, 0.45, easeOut);
      op(liftPiece, t >= tTest ? 1 - lp : 0); tr(liftPiece, 0, -46 * lp);
      const cIn = P(t, tTest - 0.25, 0.4, easeOut);
      op(clipL, cIn); op(clipR, cIn);
      tr(clipL, GX0 - 40 * (1 - cIn), TOP); tr(clipR, GX1 + 40 * (1 - cIn), TOP);
      let tk = 0, xk = 0;
      LIST.forEach(s => {
        const rowX = CARD_X + 56, rowY = s.row - 9;
        if (s.air) {
          const on = win(t, s.t + 0.05, s.tDone + 0.1, 0.15);
          op(s.tag, on); xk = Math.max(xk, on);
          op(s.g, P(t, s.tOut, 0.3, linear)); tr(s.g, rowX, rowY, 0.42);
          op(s.rowG, P(t, s.tOut, 0.3, linear));
          return;
        }
        let x, y, sc = 1, a = 1;
        if (t < s.t) { a = 0; x = GXC; y = TOP - 80; }
        else if (t < s.tIn) { const p = easeIn(clamp((t - s.t) / (s.tIn - s.t))); x = GXC; y = lerp(TOP - 80, TOP, p); a = clamp((t - s.t) / 0.1); }
        else if (t < s.tOut) { x = GXC; y = TOP; }
        else { const p = ease(clamp((t - s.tOut) / (s.tDone - s.tOut))); [x, y] = cubic([GXC, TOP], [GXC + 90, TOP + 95], [rowX - 150, (TOP + 95 + rowY) / 2 + 20], [rowX, rowY], p); sc = lerp(1, 0.42, p); }
        op(s.g, a); tr(s.g, x, y, sc);
        const held = win(t, s.tIn, s.tOut + 0.05, 0.1);
        op(s.tag, held);
        if (s.good) tk = Math.max(tk, win(t, s.tIn + 0.12, s.tOut, 0.12)); else xk = Math.max(xk, win(t, s.tIn + 0.08, s.tOut, 0.1));
        op(s.rowG, P(t, s.tDone - 0.1, 0.3, linear));
      });
      op(gapTick, tk); op(gapCross, xk);

    }

    /* right-hand column */
    op(curG, win(t, mid('current', 0.3), at('needs') + 0.1, 0.45));
    const aN = win(t, at('needs'), at('pump') + 0.05, 0.4);
    op(ndG, aN);
    if (aN > 0) NEEDS.forEach((n, i) => { const p = P(t, mid('needs', [0.2, 0.46][i]), 0.45, pop); op(n.g, clamp(P(t, mid('needs', [0.18, 0.44][i]), 0.3, linear))); op(n.tk, clamp(p * 2)); tr(n.tk, CX0 + 22, [330, 410][i] - 13, Math.max(0.01, p)); });
    op(pmG, win(t, at('pump') + 0.1, at('gap') + 0.05, 0.4));
    const aG = win(t, tOpen1, at('instant') + 0.05, 0.3);
    op(gpG, aG);
    if (aG > 0) {
      const p1 = P(t, tOpen1 + 0.05, 0.45, pop); op(gpChip1, clamp(p1 * 2)); tr(gpChip1, CX0 + gpChip1.w / 2, 280, 0.85 + 0.15 * p1);
      const p2 = P(t, tSnap + 0.05, 0.45, pop); op(gpChip2, clamp(p2 * 2)); tr(gpChip2, CX0 + gpChip2.w / 2, 360, 0.85 + 0.15 * p2);
      op(gpTxt, P(t, tOpen1 + 0.35, 0.4, linear));
    }
    const aI = win(t, tClose2 + SWT, at('conductors') - 0.2, 0.35);
    op(inG, aI);
    if (aI > 0) {
      const shows = [tClose2 + SWT + 0.15, mid('instant', 0.36), mid('instant', 0.56), mid('instant', 0.74)];
      ROWS_IN.forEach((r, i) => { const p = P(t, shows[i], 0.4, linear); op(r.g, p); tr(r.g, (1 - p) * 20, 0); });
      tr(ROWS_IN[1].ic.snail, -2 + calm * 6 * Math.sin(t * 0.9), 4, 0.8);
    }
    const aCards = 1 - P(t, tCB, 0.5, linear);
    op(cdG, Math.min(P(t, at('conductors') + 0.2, 0.4, linear), aCards));
    op(isG, Math.min(P(t, at('insulators') - 0.1, 0.4, linear), aCards));

    /* inside a wire */
    const aW = P(t, tCB + 0.25, 0.6, linear);
    op(cbG, aW);
    if (aW > 0) {
      cableDots.upd((t - tCB) * 60, 1);
      op(lbCopper, P(t, mid('wire', 0.36), 0.5, linear));
      op(lbPlastic, P(t, mid('wire', 0.6), 0.5, linear));
      op(lbSafe, P(t, mid('wire', 0.82), 0.5, linear));
      const hp = P(t, mid('wire', 0.74), 0.7, easeOut);
      op(hand, clamp(hp * 1.5)); tr(hand, 300, CY + 120 * (1 - hp));
      const tp = P(t, mid('wire', 0.86), 0.45, pop);
      op(safeTick, clamp(tp * 2)); tr(safeTick, 300, 286, Math.max(0.01, tp));
    }
  };
});

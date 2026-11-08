/* Chapter 8, Measuring temperature.
   A large liquid-in-glass thermometer stands at the left; the right side holds the comparison pieces.
   Beats: three thermometers, each giving a number -> the liquid-in-glass one moves left: bulb, capillary
   -> warm water: the liquid expands up the tube against a °C scale -> cheap and simple: coloured alcohol,
   older mercury -> a thin tube moves further per degree -> the scale is wiped and re-made from pure water:
   0 °C and 100 °C lock on (showpiece) -> 100 ticks sweep up between -> digital (thermistor) -> infrared,
   no touching -> let it settle, bulb off the side -> read at eye level, parallax error. */
scene('thermometers', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const beat = (t, a, b) => win(t, a, b, 0.45);
  const LIQ = C.blood;

  /* ---------- local helpers ---------- */
  /* liquid-in-glass thermometer, origin at the bulb centre; g.set(y) puts the liquid top at y (negative) */
  function glassTherm(parent, H, o) {
    o = o || {};
    const g = G(parent), sw = o.sw || 40, rb = o.rb || 26, bore = o.bore || 8, liq = o.liq || LIQ, dk = o.dk || '#9E1F2C';
    const ro = rb + 5, hw = sw / 2, yj = -Math.sqrt(ro * ro - hw * hw);
    const d = `M${-hw},${yj.toFixed(1)} L${-hw},${-H + hw} A${hw},${hw} 0 0 1 ${hw},${-H + hw} L${hw},${yj.toFixed(1)} A${ro},${ro} 0 1 1 ${-hw},${yj.toFixed(1)} Z`;
    g.glass = E('path', { d, fill: 'rgba(200,230,250,0.12)' }, g);
    E('rect', { x: -bore / 2, y: -H + hw * 0.7, width: bore, height: H - hw * 0.7 + yj + 4, rx: bore / 2, fill: 'rgba(6,20,30,0.6)' }, g);
    g.bulb = E('circle', { r: rb, fill: ball(liq, dk) }, g);
    g.col = E('rect', { x: -bore / 2, width: bore, rx: Math.min(bore / 2, 5), fill: liq }, g);
    E('path', { d, fill: 'none', stroke: GLASS.stroke, 'stroke-width': o.lw || 4, 'stroke-linejoin': 'round' }, g);
    const shw = Math.max(3, sw * 0.11);
    E('rect', { x: o.shineRight ? hw - 6 - shw : -hw + 6, y: -H + hw + 4, width: shw, height: H - hw - 46, rx: 2.5, fill: GLASS.shine }, g);
    g.set = y => { attr(g.col, 'y', y); attr(g.col, 'height', Math.max(0, yj + 10 - y)); };
    g.set(-60);
    g.hw = hw; g.H = H; g.ro = ro;
    return g;
  }
  function labJack(parent) {
    const g = G(parent);
    E('rect', { x: -66, y: 0, width: 132, height: 10, rx: 4, fill: '#8E9CA9', stroke: '#C2CDD7', 'stroke-width': 2 }, g);
    E('rect', { x: -66, y: 134, width: 132, height: 10, rx: 4, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    E('path', { d: 'M-52,10 L52,134 M52,10 L-52,134 M-52,10 L-52,14 M52,10 L52,14', stroke: '#B9C6D2', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: 72, r: 7, fill: '#3E4954', stroke: '#C2CDD7', 'stroke-width': 2 }, g);
    return g;
  }
  function iceCube(parent, x, y, s, rot) {
    const g = G(parent); tr(g, x, y, 1, rot);
    E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.22, fill: 'rgba(235,248,255,0.8)', stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    E('path', { d: `M${-s * 0.25},${-s * 0.2} L${s * 0.05},${-s * 0.28}`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.9 }, g);
    return g;
  }
  function digitalTherm(parent) {
    const g = G(parent);
    E('path', { d: 'M-5,105 L-5,300 L0,318 L5,300 L5,105 Z', fill: linGrad('#E1E8EE', '#8796A4'), stroke: '#C9D3DC', 'stroke-width': 1.5 }, g);
    g.bead = E('circle', { cx: 0, cy: 304, r: 5, fill: '#3E4954' }, g);
    E('rect', { x: -72, y: -112, width: 144, height: 222, rx: 32, fill: linGrad('#4B8FF7', '#1E4FA8', true), stroke: '#A9C9FF', 'stroke-width': 3 }, g);
    g.lcdBox = E('rect', { x: -58, y: -90, width: 116, height: 70, rx: 10, fill: '#BFD9B4', stroke: '#24361F', 'stroke-width': 3 }, g);
    g.lcd = T(g, -6, -41, '21.4', { size: 38, weight: 700, anchor: 'middle', fill: '#14241A' });
    T(g, 40, -62, '°C', { size: 22, weight: 700, anchor: 'middle', fill: '#14241A' });
    E('circle', { cx: 0, cy: 40, r: 17, fill: '#E8EEF4', stroke: '#A9C9FF', 'stroke-width': 3 }, g);
    E('rect', { x: -26, y: 72, width: 52, height: 8, rx: 4, fill: '#1A3F86' }, g);
    return g;
  }
  function irGun(parent) {
    const g = G(parent);
    E('path', { d: 'M112,18 L150,18 L172,140 Q174,152 160,154 L132,154 Q120,154 118,142 Z', fill: '#2B3A44', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M100,22 Q96,48 114,56', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: 0, y: -34, width: 204, height: 60, rx: 16, fill: linGrad('#F5BE4A', '#C9851A', true), stroke: '#FFDB8E', 'stroke-width': 3 }, g);
    E('path', { d: 'M2,-32 L-24,-22 L-24,16 L2,24 Z', fill: '#3A4651', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: -24, cy: -3, r: 14, fill: ball('#7FD3FF', '#1D6FA6'), stroke: '#CFEFFF', 'stroke-width': 2 }, g);
    g.dispBox = E('rect', { x: 86, y: -26, width: 108, height: 44, rx: 8, fill: '#BFD9B4', stroke: '#24361F', 'stroke-width': 2.5 }, g);
    g.disp = T(g, 140, 6, '21 °C', { size: 26, weight: 700, anchor: 'middle', fill: '#14241A' });
    return g;
  }
  function eyeIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M38,0 Q0,-34 -38,0 Q0,34 38,0 Z', fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    E('circle', { cx: -10, cy: 0, r: 14, fill: ball('#6FB7FF', '#1D5FA6') }, g);
    E('circle', { cx: -12, cy: 0, r: 6.5, fill: '#0A1B27' }, g);
    E('circle', { cx: -15, cy: -4, r: 2.6, fill: '#ffffff' }, g);
    E('path', { d: 'M34,-6 Q0,-40 -36,-6', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -7, y: -r - 14, width: 14, height: 12, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 5 }, g);
    g.hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.7, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 5, fill: C.energy }, g);
    return g;
  }

  /* ================= the big thermometer (BT) ================= */
  const TX = 240, TBY = 515, TH = 360, PX = 2.5;
  const yOf = c => -80 - c * PX;                       // local y of c degrees
  const BTg = G(root);
  const BT = glassTherm(BTg, TH, { sw: 44, rb: 26, bore: 10, shineRight: true });
  const majors = [];
  for (let c = -10; c <= 110; c += 10) majors.push({ c, el: E('line', { x1: -7, x2: c % 20 === 0 ? -21 : -16, y1: yOf(c), y2: yOf(c), stroke: '#DCEBF5', 'stroke-width': 2.5 }, BT) });
  const minors = [];
  for (let c = 1; c < 100; c++) if (c % 10) minors.push({ c, el: E('line', { x1: -7, x2: c % 5 ? -11 : -14, y1: yOf(c), y2: yOf(c), stroke: '#DCEBF5', 'stroke-width': 1.3 }, BT) });
  const nums = [0, 20, 40, 60, 80, 100].map(c => ({ c, el: T(BT, -32, yOf(c) + 9, String(c), { size: 26, weight: 700, anchor: 'end' }) }));
  const unitC = T(BT, -32, yOf(100) - 30, '°C', { size: 26, weight: 700, fill: C.muted, anchor: 'end' });
  const locks = [0, 100].map(c => {
    const g = G(BT);
    const ring = E('circle', { cx: 0, cy: yOf(c), r: 20, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, g);
    const bar = E('line', { x1: -32, x2: 30, y1: yOf(c), y2: yOf(c), stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const num = T(g, -32, yOf(c) + 10, String(c), { size: 30, weight: 700, fill: C.energy, anchor: 'end' });
    return { c, g, ring, bar, num };
  });
  const lblBulb = labelLine(root, 340, 532, TX + 30, TBY, 'bulb', { size: 30 });
  const lblCap = labelLine(root, 340, 216, TX + 2, 234, 'capillary', { size: 30 });
  const lblAlc = labelLine(root, 348, 612, TX + 18, TBY + 14, 'coloured alcohol', { size: 28, fill: '#FF9AA2' });
  const bulbGlow = E('circle', { r: 58, fill: glow('#FF8A94') }, root);
  root.insertBefore(bulbGlow, BTg);
  const pIns = G(root);
  E('path', { d: `M${TX + 34},${TBY - 6} L684,452`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, pIns);
  E('circle', { cx: 800, cy: 420, r: 112, fill: '#0E2431', stroke: C.muted, 'stroke-width': 4 }, pIns);
  const pWarm = E('circle', { cx: 800, cy: 420, r: 108, fill: glow(C.heat) }, pIns);
  const pDots = [];
  { const pr = rng(19); for (let row = -2; row <= 2; row++) for (let k = -2; k <= 2; k++) { const x = k * 33 + (row % 2 ? 16 : 0) + (pr() - 0.5) * 8, y = row * 30 + (pr() - 0.5) * 8; if (Math.hypot(x, y) > 82) continue; pDots.push({ x, y, ph: pr() * TAU, el: E('circle', { r: 13, fill: ball('#FF7A86', '#A6283A') }, pIns) }); } }
  T(pIns, 800, 576, 'the liquid expands', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });
  T(pIns, 800, 610, 'its particles move a little further apart', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const readG = G(root);
  const readChip = chip(readG, '21 °C', { size: 28, fill: C.card2, stroke: C.line, w: 112 });
  const upG = G(root);
  const upA = arrow(upG, 0, 44, 0, -36, { color: C.heat, width: 8, head: 24 });
  T(upG, 26, 14, 'expands', { size: 30, weight: 700, fill: C.heat });
  T(upG, 26, 46, 'and rises', { size: 26, weight: 600, fill: C.heat });

  /* bench and the setups that slide under the bulb */
  const BENCH = 716, BK = { w: 150, h: 120, cy: 512 };
  const bench = E('rect', { x: 90, y: BENCH, width: 1020, height: 6, rx: 3, fill: C.line }, root);
  function underBulb(kind) {
    const g = G(root);
    if (kind === 'boil') {
      const bn = bunsen(g, 0.55); tr(bn, TX, BENCH - 10); g.bn = bn;
      E('path', { d: `M${TX - 70},${BK.cy + 62} L${TX + 70},${BK.cy + 62} M${TX - 58},${BK.cy + 62} L${TX - 76},${BENCH} M${TX + 58},${BK.cy + 62} L${TX + 76},${BENCH}`, stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    } else tr(labJack(g), TX, BK.cy + 62);
    const bk = beaker(g, BK.w, BK.h, { level: 0.94, liquid: kind === 'ice' ? '#7FD3F7' : C.water, marks: false }); tr(bk, TX, BK.cy);
    if (kind === 'ice') { g.ice = [iceCube(g, TX - 44, BK.cy - 38, 34, 12), iceCube(g, TX + 46, BK.cy - 40, 30, -18), iceCube(g, TX + 36, BK.cy + 12, 26, 30)]; }
    if (kind === 'boil') g.bub = bubbles(g, TX - 62, BK.cy - 40, 124, 92, { n: 12, r: 6, seed: 7, speed: 0.6 });
    g.steam = heatWaves(g, { n: 2, h: 70, spacing: 168, width: 4 }); tr(g.steam, TX, BK.cy - 64);
    return g;
  }
  const warmSet = underBulb('warm'), iceSet = underBulb('ice'), boilSet = underBulb('boil');
  const warmLbl = T(root, TX + 92, BK.cy + 44, 'warm water', { size: 26, weight: 600, fill: C.heat });
  const iceLbl = T(root, TX + 92, BK.cy + 44, 'ice and pure water', { size: 26, weight: 600, fill: '#BFE9FF' });
  const boilLbl = T(root, TX + 92, BK.cy + 44, 'boiling pure water', { size: 26, weight: 600, fill: C.heat });

  /* ================= right side: device row ================= */
  const DG = digitalTherm(root), IR = irGun(root);
  const devNames = G(root);
  const devN = [['liquid-in-glass', 300], ['digital', 620], ['infrared', 930]].map(([s, x]) => T(devNames, x, 668, s, { size: 28, weight: 600, anchor: 'middle', fill: C.muted }));
  const devGlow = [E('rect', { x: -66, y: -98, width: 132, height: 86, rx: 16, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, DG), E('rect', { x: 80, y: -32, width: 120, height: 56, rx: 12, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, IR)];

  /* ================= glass: title and capillary inset ================= */
  const ttlGlass = chip(root, 'liquid-in-glass', { size: 34, fill: C.card2, stroke: C.line }); tr(ttlGlass, 770, 196);
  const inset = G(root);
  E('path', { d: `M${TX + 24},300 L668,388`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, inset);
  E('circle', { cx: 770, cy: 410, r: 104, fill: '#0E2431', stroke: C.muted, 'stroke-width': 4 }, inset);
  E('circle', { cx: 770, cy: 410, r: 78, fill: 'rgba(200,230,250,0.18)', stroke: GLASS.stroke, 'stroke-width': 4 }, inset);
  E('circle', { cx: 770, cy: 410, r: 9, fill: LIQ, stroke: '#FFB3B9', 'stroke-width': 2 }, inset);
  E('path', { d: 'M712,372 A70,70 0 0 1 760,342', fill: 'none', stroke: '#ffffff', 'stroke-width': 5, opacity: 0.35, 'stroke-linecap': 'round' }, inset);
  T(inset, 770, 552, 'a very thin tube', { size: 30, weight: 700, anchor: 'middle' });
  T(inset, 770, 586, '(the stem, cut across)', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= liquid: cheap and simple, alcohol, mercury ================= */
  const chCheap = G(root); { const c = chip(chCheap, 'cheap and simple', { size: 32, fill: 'rgba(86,214,155,0.16)', stroke: C.good }); const tk = tick(chCheap, 13); tr(tk, c.w / 2 + 26, -2); }
  tr(chCheap, 750, 196);
  const merc = G(root);
  card(merc, 640, 284, 380, 330, { fill: C.card, stroke: C.line });
  const mTh = glassTherm(merc, 250, { sw: 30, rb: 18, bore: 7, liq: '#D9E2EA', dk: '#7E8C99', lw: 3 }); tr(mTh, 712, 570); mTh.set(-150);
  T(merc, 760, 380, 'mercury', { size: 34, weight: 700, fill: '#E2EAF1' });
  T(merc, 760, 420, 'a silvery liquid', { size: 26, weight: 600, fill: C.muted });
  T(merc, 760, 476, 'in older', { size: 26, weight: 600 });
  T(merc, 760, 508, 'thermometers', { size: 26, weight: 600 });

  /* ================= thin: wide tube vs thin tube ================= */
  const Th = G(root);
  const WIDE = glassTherm(Th, 300, { sw: 46, rb: 24, bore: 26 }); tr(WIDE, 640, 640);
  const THIN = glassTherm(Th, 300, { sw: 46, rb: 24, bore: 8 }); tr(THIN, 900, 640);
  T(Th, 640, 306, 'wide tube', { size: 30, weight: 700, anchor: 'middle' });
  T(Th, 900, 306, 'thin tube', { size: 30, weight: 700, anchor: 'middle' });
  const plus1 = chip(Th, '+1 °C', { size: 34, fill: C.card2, stroke: C.heat, color: C.heat }); tr(plus1, 770, 392);
  const brW = E('path', { fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Th);
  const brN = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Th);
  const tW = T(Th, 676, 0, 'a little', { size: 26, weight: 700, fill: C.muted });
  const tN = T(Th, 936, 0, 'much further', { size: 26, weight: 700, fill: C.energy });
  const chSee = chip(Th, 'small changes are easy to see', { size: 28, fill: C.card2, stroke: C.line }); tr(chSee, 770, 226);
  const L0W = -130;

  /* ================= fixed points and 100 degrees ================= */
  const Fx = G(root);
  const fTitle = T(Fx, 830, 300, 'the Celsius scale', { size: 40, weight: 700, anchor: 'middle' });
  const fSub = T(Fx, 830, 344, 'is fixed by pure water', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const cards = [{ c: 100, txt: '**100 °C**  water boils', icon: 'boil' }, { c: 0, txt: '**0 °C**  water freezes', icon: 'ice' }].map(o => {
    const g = G(Fx), y = TBY + yOf(o.c);
    const lead = E('path', { d: `M${TX + 34},${y} L640,${y}`, stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '7 7', pathLength: 1 }, g);
    const cg = G(g);
    card(cg, 650, y - 34, 360, 68, { fill: C.card, stroke: C.energy, rx: 34 });
    T(cg, 840, y + 11, o.txt, { size: 30, weight: 600, anchor: 'middle', boldFill: C.energy });
    return Object.assign(o, { g, lead, cg, y });
  });
  const chAir = chip(Fx, 'at normal air pressure', { size: 28, fill: C.card2, stroke: C.line }); tr(chAir, 830, 560);
  const cnt = G(Fx);
  const cntT = T(cnt, 830, 334, '0', { size: 64, weight: 700, anchor: 'middle', fill: C.energy });
  T(cnt, 830, 376, 'equal degrees', { size: 30, weight: 600, anchor: 'middle' });

  /* ================= digital ================= */
  const dTitle = T(root, 760, 160, 'digital thermometer', { size: 40, weight: 700, anchor: 'middle' });
  const dBeaker = beaker(root, 150, 110, { level: 0.75, liquid: C.water, marks: false }); tr(dBeaker, 640, BENCH - 55);
  const dSteam = heatWaves(root, { n: 2, h: 60, spacing: 100, width: 4 }); tr(dSteam, 640, BENCH - 112);
  const dHot = T(root, 734, BENCH - 30, 'hot water', { size: 26, weight: 600, fill: C.heat });
  const dInset = G(root);
  E('path', { d: 'M646,655 L928,520', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 7' }, dInset);
  E('circle', { cx: 1000, cy: 430, r: 100, fill: '#0E2431', stroke: C.muted, 'stroke-width': 4 }, dInset);
  E('path', { d: 'M972,330 L972,486 L1000,520 L1028,486 L1028,330', fill: linGrad('#E1E8EE', '#8796A4'), stroke: '#C9D3DC', 'stroke-width': 2 }, dInset);
  E('circle', { cx: 1000, cy: 482, r: 15, fill: ball('#5A6B7A', '#2B3A44'), stroke: C.energy, 'stroke-width': 3 }, dInset);
  E('rect', { x: 976, y: 376, width: 48, height: 22, fill: C.bg0, stroke: '#14241A', 'stroke-width': 3 }, dInset);
  E('path', { d: 'M960,412 L972,412 L1028,364', fill: 'none', stroke: '#14241A', 'stroke-width': 3 }, dInset);
  E('path', { d: 'M1000,358 L1000,376 M1000,398 L1000,468', stroke: '#14241A', 'stroke-width': 3 }, dInset);
  T(dInset, 1000, 572, 'thermistor', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const dRes = G(root);
  T(dRes, 1000, 610, 'its resistance changes', { size: 26, weight: 600, anchor: 'middle' });
  T(dRes, 1000, 642, 'with temperature', { size: 26, weight: 600, anchor: 'middle' });
  const chFast = chip(root, 'fast', { size: 30, fill: 'rgba(255,228,92,0.14)', stroke: C.energy, color: C.energy }); tr(chFast, 440, 250);
  const chEasy = chip(root, 'easy to read', { size: 30, fill: 'rgba(255,228,92,0.14)', stroke: C.energy, color: C.energy }); tr(chEasy, 440, 310);

  /* ================= infrared ================= */
  const irTitle = T(root, 760, 160, 'infrared thermometer', { size: 40, weight: 700, anchor: 'middle' });
  const hob = G(root);
  E('rect', { x: 430, y: BENCH - 30, width: 260, height: 30, rx: 6, fill: '#26343F', stroke: '#6B7A88', 'stroke-width': 2 }, hob);
  E('ellipse', { cx: 560, cy: BENCH - 30, rx: 92, ry: 8, fill: '#FF5A3D', opacity: 0.85 }, hob);
  E('rect', { x: 470, y: BENCH - 78, width: 180, height: 46, rx: 10, fill: ball('#5E6B78', '#2B3A44'), stroke: '#9DB0BF', 'stroke-width': 3 }, hob);
  E('rect', { x: 300, y: BENCH - 66, width: 176, height: 14, rx: 7, fill: '#2B3A44', stroke: '#6B7A88', 'stroke-width': 2 }, hob);
  const panGlow = E('ellipse', { cx: 560, cy: BENCH - 80, rx: 110, ry: 40, fill: glow(C.heat) }, hob);
  const panWaves = heatWaves(hob, { n: 3, h: 70, spacing: 46, width: 4 }); tr(panWaves, 560, BENCH - 84);
  const PANP = [588, BENCH - 92], LENS = [880, 520];
  const bAng = Math.atan2(LENS[1] - PANP[1], LENS[0] - PANP[0]), bLen = Math.hypot(LENS[0] - PANP[0], LENS[1] - PANP[1]) - 36;
  const irG = G(root);
  const beam = G(irG); tr(beam, PANP[0], PANP[1], 1, bAng * 180 / Math.PI);
  E('rect', { x: 0, y: -26, width: bLen, height: 52, rx: 26, fill: 'rgba(255,138,61,0.10)' }, beam);
  const irw = [sineWave(beam, { w: bLen, amp: 15, wl: 58, color: C.heat, width: 5 }), sineWave(beam, { w: bLen, amp: 9, wl: 58, color: '#FFB27A', width: 3 })];
  const irLbl = T(irG, 700, 518, 'infrared radiation', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
  const chTouch = chip(irG, 'no touching', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good }); tr(chTouch, 760, 330);
  const chFar = chip(irG, 'great for very hot or faraway things', { size: 28, fill: C.card2, stroke: C.line }); tr(chFar, 760, 392);

  /* ================= settle ================= */
  const st = G(root);
  const sw = stopwatch(st, 30); tr(sw, 640, 236);
  T(st, 690, 248, 'let it settle', { size: 34, weight: 700 });
  const sideG = G(root);
  const sb1 = beaker(sideG, 150, 130, { level: 0.75, liquid: C.water, marks: false }); tr(sb1, 680, BENCH - 65);
  const sb2 = beaker(sideG, 150, 130, { level: 0.75, liquid: C.water, marks: false }); tr(sb2, 950, BENCH - 65);
  const st1 = glassTherm(sideG, 210, { sw: 24, rb: 13, bore: 6, lw: 3 }); tr(st1, 623, BENCH - 32, 1, 14); st1.set(-120);
  const st2 = glassTherm(sideG, 210, { sw: 24, rb: 13, bore: 6, lw: 3 }); tr(st2, 950, BENCH - 46); st2.set(-120);
  const sideX = cross(sideG, 16); tr(sideX, 566, 404);
  const sideTk = tick(sideG, 18); tr(sideTk, 852, 404);
  T(sideG, 592, 414, 'touching the side', { size: 28, weight: 700, fill: C.bad });
  T(sideG, 880, 414, 'in the middle', { size: 28, weight: 700, fill: C.good });

  /* ================= eye level ================= */
  const EYE = [{ y: -150, kind: 'high', txt: 'too high' }, { y: 0, kind: 'ok', txt: 'eye level' }, { y: 150, kind: 'low', txt: 'too low' }];
  const eyes = EYE.map(o => {
    const g = G(root);
    const line = E('path', { fill: 'none', stroke: o.kind === 'ok' ? C.good : C.bad, 'stroke-width': 3.5, 'stroke-dasharray': '9 8', 'stroke-linecap': 'round' }, g);
    const ic = eyeIcon(g);
    const mark = o.kind === 'ok' ? tick(g, 17) : cross(g, 15);
    const lab = T(g, 0, 0, o.txt, { size: 30, weight: 700, fill: o.kind === 'ok' ? C.good : C.bad });
    return Object.assign(o, { g, line, ic, mark, lab });
  });
  const parG = G(root);
  const parLines = E('path', { fill: 'none', stroke: C.bad, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, parG);
  const chPar = chip(parG, 'parallax error', { size: 32, fill: 'rgba(255,96,112,0.14)', stroke: C.bad });

  /* ================= update ================= */
  return t => {
    const tGl = at('glass'), tRi = at('rises'), tLi = at('liquid'), tTn = at('thin'), tFx = at('fixed'), tHu = at('hundred');
    const tDi = at('digital'), tIn = at('infrared'), tSe = at('settle'), tEy = at('eye');

    /* --- the big thermometer: placement, dimming --- */
    const pIn = P(t, S.first - 0.1, 0.6, pop), pMv = P(t, mid('glass', 0.04), 1.1, ease);
    tr(BTg, lerp(300, TX, pMv), lerp(560, TBY, pMv), lerp(0.62 * Math.max(0.01, pIn), 1, pMv));
    const dim = Math.max(beat(t, tTn - 0.1, tFx + 0.2), beat(t, tDi + 0.3, tSe + 0.2));
    op(BTg, clamp(pIn * 2) * (1 - 0.55 * dim));

    /* --- liquid level (degrees) --- */
    let c = 21;
    c = lerp(c, 60, P(t, mid('rises', 0.12), mid('rises', 0.62) - mid('rises', 0.12), ease));
    c = lerp(c, 21, P(t, tLi + 0.2, 2.6, ease));
    c = lerp(c, 0, P(t, mid('fixed', 0.3), mid('fixed', 0.48) - mid('fixed', 0.3), ease));
    c = lerp(c, 100, P(t, mid('fixed', 0.64), mid('fixed', 0.78) - mid('fixed', 0.64), ease));
    c = lerp(c, 21, P(t, tDi + 0.3, 2.6, ease));
    c = lerp(c, 50, P(t, tSe + 0.4, 2.4, easeOut));
    BT.set(yOf(c));

    /* --- scale: ticks and numbers (wiped for the fixed points, swept back in for 100 degrees) --- */
    const wipe = P(t, tFx, 0.5, linear);
    const sweep = 100 * P(t, mid('hundred', 0.1), 2.3, linear), swept = t >= mid('hundred', 0.1);
    const shown = cc => (1 - wipe) + (swept ? clamp((sweep - cc) / 4) : 0);
    majors.forEach(m => op(m.el, m.c < 0 || m.c > 100 ? 1 - wipe + (swept ? clamp((sweep - 99) / 4) : 0) : shown(m.c)));
    const minOn = P(t, mid('hundred', 0.1) - 0.1, 0.2, linear);
    minors.forEach(m => op(m.el, minOn * clamp((sweep - m.c) / 4)));
    const numIn = P(t, mid('rises', 0.66), 0.5, linear);
    const back = P(t, tDi, 0.6, linear);
    nums.forEach((n, i) => op(n.el, (n.c === 0 || n.c === 100) ? numIn * Math.max(1 - wipe, back) : numIn * shown(n.c)));
    op(unitC, numIn);
    locks.forEach((L, i) => {
      const tl = mid('fixed', i === 0 ? 0.5 : 0.8);
      const lp = P(t, tl, 0.5, pop), on = P(t, tl, 0.2, linear);
      op(L.g, on * (1 - back));
      if (on > 0) {
        const rp = P(t, tl, 0.8, easeOut);
        attr(L.ring, 'r', 14 + 46 * rp); op(L.ring, 1 - rp);
        op(L.bar, 1 - 0.55 * P(t, tl + 0.5, 0.6, linear));
        L.num.setAttribute('transform', `translate(-32 ${yOf(L.c)}) scale(${(0.6 + 0.4 * lp).toFixed(3)}) translate(32 ${-yOf(L.c)})`);
        op(L.bar, (1 - 0.55 * P(t, tl + 0.5, 0.6, linear)) * (1 - P(t, tDi, 0.5, linear)));
      }
    });
    // parts labels
    lblBulb.set(win(t, mid('glass', 0.37), tRi + 0.5, 0.35));
    lblCap.set(win(t, mid('glass', 0.86), tLi + 0.3, 0.35));
    lblAlc.set(win(t, mid('liquid', 0.4), tTn + 0.2, 0.35));
    // rising "expands" marker beside the column top
    const upOn = win(t, mid('rises', 0.22), tLi + 0.3, 0.35);
    op(upG, upOn); if (upOn > 0) { tr(upG, TX + 92, TBY + yOf(c) + 6); upA.set(P(t, mid('rises', 0.25), 0.6)); }
    // reading chip (device row, then settling)
    const rdDev = win(t, mid('device', 0.62), tGl + 0.2, 0.3), rdSet = win(t, tSe + 0.5, tEy + 0.2, 0.35);
    op(readG, Math.max(rdDev, rdSet));
    if (rdDev > 0) { tr(readG, 386, 560 + 0.62 * yOf(21)); setText(readChip.label, '21 °C'); }
    else if (rdSet > 0) { tr(readG, TX + 104, TBY + yOf(c)); setText(readChip.label, Math.round(c) + ' °C'); }

    /* --- setups under the bulb --- */
    const wOn = Math.max(beat(t, tRi - 0.1, tLi + 0.25), P(t, tSe - 0.1, 0.45, linear));
    const iOn = beat(t, mid('fixed', 0.26), mid('fixed', 0.6) + 0.2);
    const bOn = beat(t, mid('fixed', 0.58), tDi + 0.4);
    [[warmSet, wOn, warmLbl], [iceSet, iOn, iceLbl], [boilSet, bOn, boilLbl]].forEach(([g, a, lb]) => {
      op(g, a); op(lb, a);
      if (a > 0) {
        g.setAttribute('transform', `translate(0 ${((1 - a) * 46).toFixed(1)})`);
        g.steam.upd(t); op(g.steam, g === iceSet ? 0 : 0.8);
        if (g.bub) g.bub.upd(t, 1);
        if (g.bn) { g.bn.set('blue'); g.bn.upd(t); }
        if (g.ice) g.ice.forEach((ic, k) => ic.firstChild.setAttribute('transform', `translate(0 ${(Math.sin(t * 1.3 + k * 2) * 2 * calm).toFixed(1)})`));
      }
    });

    /* --- device row --- */
    const devA = beat(t, S.first - 0.2, tGl + 0.5);
    op(devNames, devA * (1 - P(t, tGl, 0.3, linear)));
    const pD = P(t, mid('device', 0.16), 0.6, pop), pI = P(t, mid('device', 0.3), 0.6, pop);
    op(devN[0], clamp(pIn * 2)); op(devN[1], clamp(pD * 2)); op(devN[2], clamp(pI * 2));
    const glow = k => P(t, mid('device', [0.62, 0.7][k]), 0.3, linear) * (1 - P(t, tGl, 0.3, linear));
    // digital: device row, then its own beat
    const dA = Math.max(devA * clamp(pD * 2) * (1 - P(t, tGl, 0.4, linear)), beat(t, tDi + 0.1, tIn + 0.35));
    op(DG, dA);
    const dBeat = t > tGl + 1;
    const dip = P(t, mid('digital', 0.74), 0.6, ease);
    if (dBeat) tr(DG, 640, 300 + 52 * dip, 1); else tr(DG, 620, 350, 0.85 * Math.max(0.01, pD));
    const dTemp = dBeat ? lerp(21.4, 64.8, P(t, mid('digital', 0.77), 0.7, easeOut)) : 21.4;
    setText(DG.lcd, dTemp.toFixed(1));
    op(devGlow[0], dBeat ? win(t, mid('digital', 0.86), tIn, 0.3) : glow(0));
    // infrared gun: device row, then its own beat
    const iA = Math.max(devA * clamp(pI * 2) * (1 - P(t, tGl, 0.4, linear)), beat(t, tIn + 0.1, tSe + 0.35));
    op(IR, iA);
    const iBeat = t > tGl + 1;
    if (iBeat) tr(IR, LENS[0] + 24 * Math.cos(bAng), LENS[1] + 24 * Math.sin(bAng), 1, bAng * 180 / Math.PI + 180 - 180);
    else tr(IR, 852, 392, 0.95 * Math.max(0.01, pI));
    op(devGlow[1], iBeat ? win(t, mid('infrared', 0.4), tSe, 0.3) : glow(1));

    /* --- glass --- */
    op(ttlGlass, win(t, mid('glass', 0.2), tLi + 0.2, 0.35));
    const ins = win(t, mid('glass', 0.6), tRi + 0.3, 0.35); op(inset, ins);
    if (ins > 0) inset.setAttribute('transform', `translate(770 410) scale(${(0.85 + 0.15 * P(t, mid('glass', 0.6), 0.5, easeOut)).toFixed(3)}) translate(-770 -410)`);
    const bp = win(t, mid('glass', 0.36), mid('glass', 0.62), 0.25); op(bulbGlow, bp); if (bp > 0) tr(bulbGlow, TX, TBY, 0.9 + 0.15 * wave(t, 0.9));
    const pa = win(t, mid('rises', 0.1), tLi + 0.3, 0.35); op(pIns, pa);
    if (pa > 0) { const k = clamp((c - 21) / 39), spread = 1 + 0.12 * k, amp = (1.5 + 4 * k) * calm; pDots.forEach(d => { attr(d.el, 'cx', 800 + d.x * spread + Math.sin(t * (6 + 8 * k) + d.ph) * amp); attr(d.el, 'cy', 420 + d.y * spread + Math.cos(t * (7 + 8 * k) + d.ph) * amp); }); op(pWarm, k); }

    /* --- liquid --- */
    op(chCheap, win(t, tLi, tTn + 0.2, 0.35));
    const mp = P(t, mid('liquid', 0.66), 0.5, easeOut); op(merc, mp * (1 - P(t, tTn - 0.1, 0.4, linear))); merc.setAttribute('transform', `translate(${((1 - mp) * 40).toFixed(1)} 0)`);

    /* --- thin --- */
    const aT = beat(t, tTn - 0.05, tFx + 0.3); op(Th, aT);
    if (aT > 0) {
      const r1 = P(t, mid('thin', 0.5), 1.1, ease);
      WIDE.set(L0W - 7 * r1); THIN.set(L0W - 74 * r1);
      op(plus1, P(t, mid('thin', 0.44), 0.35, linear));
      const bw = (x, y0, y1) => `M${x - 8},${y0} L${x},${y0} L${x},${y1} L${x - 8},${y1}`;
      const yW0 = 640 + L0W, yW1 = 640 + L0W - 7 * r1, yN0 = 640 + L0W, yN1 = 640 + L0W - 74 * r1;
      brW.setAttribute('d', bw(640 + 32, yW0, yW1)); brN.setAttribute('d', bw(900 + 32, yN0, yN1));
      const lb = P(t, mid('thin', 0.6), 0.4, linear);
      op(brW, lb); op(brN, lb); op(tW, lb); op(tN, lb);
      attr(tW, 'y', yW1 + 6); attr(tN, 'y', (yN0 + yN1) / 2 + 9);
      op(chSee, P(t, mid('thin', 0.7), 0.4, linear));
    }

    /* --- fixed points, 100 degrees --- */
    const aF = beat(t, tFx, tDi + 0.3); op(Fx, aF);
    if (aF > 0) {
      op(fTitle, P(t, tFx + 0.1, 0.4, linear) * (1 - P(t, tHu, 0.3, linear)));
      op(fSub, P(t, mid('fixed', 0.16), 0.4, linear) * (1 - P(t, tHu, 0.3, linear)));
      cards.forEach(o => {
        const tl = mid('fixed', o.c === 0 ? 0.5 : 0.8);
        o.lead.setAttribute('stroke-dashoffset', (1 - P(t, tl + 0.1, 0.5)).toFixed(3));
        o.lead.setAttribute('stroke-dasharray', P(t, tl + 0.1, 0.5) >= 1 ? '7 7' : '1 1');
        op(o.g, P(t, tl, 0.2, linear));
        const cp = P(t, tl + 0.15, 0.5, easeOut); op(o.cg, cp); o.cg.setAttribute('transform', `translate(${((1 - cp) * 50).toFixed(1)} 0)`);
      });
      op(chAir, P(t, mid('fixed', 0.86), 0.4, linear));
      const cn = P(t, mid('hundred', 0.05), 0.35, linear); op(cnt, cn);
      setText(cntT, String(Math.round(sweep)));
    }

    /* --- digital --- */
    const aD = beat(t, tDi + 0.1, tIn + 0.35);
    op(dTitle, aD); op(dBeaker, aD); op(dHot, aD); dSteam.upd(t); op(dSteam, 0.8 * aD);
    op(dInset, aD * P(t, mid('digital', 0.27), 0.5, linear)); op(dRes, aD * P(t, mid('digital', 0.45), 0.5, linear));
    op(chFast, aD * P(t, mid('digital', 0.83), 0.3, linear)); op(chEasy, aD * P(t, mid('digital', 0.9), 0.3, linear));

    /* --- infrared --- */
    const aI = beat(t, tIn + 0.1, tSe + 0.35);
    op(irTitle, aI); op(hob, aI); op(irG, aI);
    if (aI > 0) {
      panWaves.upd(t); op(panGlow, 0.5 + 0.2 * wave(t, 1.6));
      const bw2 = P(t, mid('infrared', 0.22), 0.6, linear); op(beam, bw2);
      irw.forEach((w, k) => w.set({ phase: t * 1.4 * calm + k * 0.25 }));   // from the hot pan to the sensor
      op(irLbl, P(t, mid('infrared', 0.3), 0.4, linear));
      setText(IR.disp, Math.round(lerp(21, 185, P(t, mid('infrared', 0.36), 0.6, easeOut))) + ' °C');
      op(chTouch, P(t, mid('infrared', 0.6), 0.4, linear)); op(chFar, P(t, mid('infrared', 0.76), 0.4, linear));
    } else setText(IR.disp, '21 °C');

    /* --- settle --- */
    const aS = beat(t, tSe + 0.1, tEy + 0.3); op(st, aS);
    if (aS > 0) attr(sw.hand, 'transform', `rotate(${(((t - tSe) * 120 * calm) % 360).toFixed(1)})`);
    const aSide = beat(t, mid('settle', 0.46), tEy + 0.3); op(sideG, aSide);
    if (aSide > 0) {
      const p1 = P(t, mid('settle', 0.62), 0.4, pop), p2 = P(t, mid('settle', 0.8), 0.4, pop);
      op(sideX, clamp(p1 * 2)); tr(sideX, 566, 404, Math.max(0.01, p1)); op(sideTk, clamp(p2 * 2)); tr(sideTk, 852, 404, Math.max(0.01, p2));
    }

    /* --- eye level --- */
    const aE = P(t, tEy, 0.45, linear);
    const ly = TBY + yOf(c);
    eyes.forEach((o, i) => {
      const t0 = mid('eye', [0.36, 0.08, 0.52][i]);
      const p = P(t, t0, 0.5, easeOut);
      op(o.g, aE * p);
      if (aE * p > 0) {
        const ex = 600, ey = ly + o.y;
        tr(o.ic, ex, ey);
        o.line.setAttribute('d', `M${ex - 44},${ey} L${TX + 4},${ly}`);
        o.line.setAttribute('stroke-dashoffset', ((1 - p) * 300).toFixed(1));
        const mk = P(t, t0 + 0.45, 0.4, pop);
        op(o.mark, clamp(mk * 2)); tr(o.mark, ex + 76, ey, Math.max(0.01, mk));
        attr(o.lab, 'x', ex + 104); attr(o.lab, 'y', ey + 11);
      }
    });
    op(parG, aE * P(t, mid('eye', 0.8), 0.4, linear));
    tr(chPar, 1010, ly);
    parLines.setAttribute('d', `M836,${ly - 150} Q870,${ly - 150} 878,${ly - 24} M836,${ly + 150} Q870,${ly + 150} 878,${ly + 24}`);
  };
});

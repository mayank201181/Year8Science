/* Heat is not the same as temperature.
   Beats: the two words tumble, then split into two cards (Temperature: how hot, °C | Heat: thermal energy, J)
   -> a sparkler's 1000 °C spark lands on a hand with almost no energy -> a 40 °C bath holds a lot
   -> the two energy meters side by side -> the golden rule: hot -> cold, never back -> thermal equilibrium
   -> an ice cube: cold doesn't flow in, energy flows out of the hand -> absolute zero, −273 °C. */
scene('temp', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const f1 = v => (+v).toFixed(1);
  const quad = (a, b, c, d) => `M${f1(a[0])},${f1(a[1])} L${f1(b[0])},${f1(b[1])} L${f1(c[0])},${f1(c[1])} L${f1(d[0])},${f1(d[1])} Z`;
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mixC = (a, b, p) => { const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // block colour for a hotness h (0 = cold blue, 0.5 = warm orange, 1 = red-hot)
  const RAMP = [[0, '#3FA4DC'], [0.2, '#97C6E4'], [0.36, '#E6C3A0'], [0.5, '#F2A04E'], [1, '#EE4E3A']];
  const ramp = h => { h = clamp(h); for (let i = 1; i < RAMP.length; i++) if (h <= RAMP[i][0]) return mixC(RAMP[i - 1][1], RAMP[i][1], (h - RAMP[i - 1][0]) / (RAMP[i][0] - RAMP[i - 1][0])); return RAMP[RAMP.length - 1][1]; };
  const deg = v => (v < 0 ? '−' + Math.abs(v) : String(v)) + ' °C';
  const popIn = (el, p, x, y, s0) => { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, (s0 === undefined ? 0.75 : s0) + (1 - (s0 === undefined ? 0.75 : s0)) * p)); };

  function block(parent, s) {
    const g = G(parent), h = s / 2, dx = s * 0.3, dy = -s * 0.24;
    const top = E('path', { d: quad([-h, -h], [h, -h], [h + dx, -h + dy], [-h + dx, -h + dy]), 'stroke-linejoin': 'round', 'stroke-width': 3 }, g);
    const side = E('path', { d: quad([h, -h], [h + dx, -h + dy], [h + dx, h + dy], [h, h]), 'stroke-linejoin': 'round', 'stroke-width': 3 }, g);
    const front = E('rect', { x: -h, y: -h, width: s, height: s, rx: 6, 'stroke-width': 3 }, g);
    E('path', { d: `M${-h + 14},${-h + 16} L${-h + 14},${h - 30}`, stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.25 }, g);
    g.heat = hh => {
      const c = ramp(hh);
      front.setAttribute('fill', c); top.setAttribute('fill', mixC(c, '#FFFFFF', 0.35)); side.setAttribute('fill', mixC(c, '#000000', 0.3));
      const e = mixC(c, '#FFFFFF', 0.55); [front, top, side].forEach(el => el.setAttribute('stroke', e));
    };
    return g;
  }
  function flowArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent);
    const a = arrow(g, x1, y1, x2, y2, { color: o.color || C.heat, width: o.width || 10 });
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, off = o.off || 9;
    const ws = [];
    for (let k = 0; k < (o.n || 3); k++) ws.push(heatWaves(g, { n: 3, h: o.h || 40, spacing: 10, width: 5, color: o.wave || '#FFB067', speed: 0.9 }));
    g.set = p => a.set(p);
    g.upd = (t, on) => {
      ws.forEach((w, k) => {
        const u = ((t * (o.speed || 0.32)) + k / ws.length) % 1, s = lerp(0.06, 0.74, u) * L;
        tr(w, x1 + ux * s + uy * off, y1 + uy * s - ux * off);
        w.upd(t + k * 0.37);
        op(w, (on === undefined ? 1 : on) * Math.min(1, 1.8 * Math.sin(u * Math.PI)));
      });
    };
    g.upd(0, 0);
    return g;
  }
  // palm-up hand facing right (side view): palm, four curled fingers, thumb, sleeve; things rest at (0,0)
  function cuppedHand(parent) {
    const g = G(parent);
    const skin = '#EDBB93', edge = '#C98D64', hi = '#F7D9C2';
    const stroked = (d, w) => { E('path', { d, fill: 'none', stroke: edge, 'stroke-width': w + 5, 'stroke-linecap': 'round' }, g); E('path', { d, fill: 'none', stroke: skin, 'stroke-width': w, 'stroke-linecap': 'round' }, g); };
    stroked('M50,4 Q92,-2 100,-40', 18);
    E('path', { d: 'M-128,-10 C-80,-6 -20,2 40,0 C58,0 72,8 74,24 C76,42 50,54 10,56 C-40,58 -92,52 -128,46 Z', fill: ball(skin, '#B9825A'), stroke: edge, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    stroked('M56,14 Q102,10 110,-30', 19);
    stroked('M60,26 Q106,24 116,-14', 19);
    stroked('M60,38 Q100,40 112,6', 17);
    E('path', { d: 'M-40,4 C-10,8 20,8 44,4', fill: 'none', stroke: hi, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    stroked('M-76,10 Q-68,-28 -38,-42', 22);
    E('rect', { x: -252, y: -40, width: 132, height: 102, rx: 18, fill: '#5A70C2', stroke: '#93A6EA', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-130,-34 L-130,56', stroke: '#93A6EA', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function iceCube(parent, s) {
    const g = G(parent), h = s / 2, dx = s * 0.3, dy = -s * 0.24;
    E('path', { d: quad([-h, -h], [h, -h], [h + dx, -h + dy], [-h + dx, -h + dy]), fill: 'rgba(230,248,255,0.9)', stroke: '#F2FBFF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: quad([h, -h], [h + dx, -h + dy], [h + dx, h + dy], [h, h]), fill: 'rgba(110,185,228,0.85)', stroke: '#E2F6FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -h, y: -h, width: s, height: s, rx: 10, fill: 'rgba(160,220,250,0.88)', stroke: '#F2FBFF', 'stroke-width': 3 }, g);
    E('path', { d: `M${-h + 14},${-h + 18} L${-h + 14},${h - 34} M${-h + 28},${-h + 14} L${-h + 52},${-h + 14}`, stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.6 }, g);
    return g;
  }

  /* ================= A. two words, two cards ================= */
  const gA = G(root);
  const cardL = card(gA, 90, 132, 460, 520, { fill: C.card, stroke: C.line });
  const cardR = card(gA, 650, 132, 460, 520, { fill: C.card, stroke: C.line });
  const wTemp = G(gA), wHeat = G(gA);
  T(wTemp, 0, 17, 'Temperature', { size: 50, weight: 700, anchor: 'middle', fill: '#FF8C96' });
  T(wHeat, 0, 17, 'Heat', { size: 50, weight: 700, anchor: 'middle', fill: C.energy });
  const neq = T(gA, 600, 420, '≠', { size: 96, weight: 700, anchor: 'middle', fill: C.muted });
  // temperature card
  const thG = G(gA); tr(thG, 196, 500);
  const thA = thermometer(thG, 236, C.bad);
  const howHot = G(gA);
  T(howHot, 280, 318, 'how hot', { size: 46, weight: 700, fill: '#FF9A8F' });
  T(howHot, 280, 358, 'something is', { size: 28, weight: 500, fill: C.muted });
  const withThermo = G(gA);
  T(withThermo, 280, 436, 'measured with a', { size: 27, weight: 500, fill: C.muted });
  T(withThermo, 280, 474, 'thermometer', { size: 33, weight: 700 });
  const unitC = G(gA);
  const cC = chip(unitC, '°C', { size: 40, fill: C.card2, stroke: '#FF8C96', w: 96 }); tr(cC, 196, 594);
  T(unitC, 262, 606, 'degrees Celsius', { size: 31, weight: 600 });
  // heat card
  const spG = G(gA); tr(spG, 760, 382);
  const spA = spark(spG, 50, { seed: 2 });
  const isEnergy = G(gA);
  T(isEnergy, 840, 318, 'a type of', { size: 28, weight: 500, fill: C.muted });
  T(isEnergy, 840, 364, 'energy', { size: 46, weight: 700, fill: C.energy });
  const thermal = G(gA);
  T(thermal, 840, 436, 'called', { size: 27, weight: 500, fill: C.muted });
  T(thermal, 840, 474, 'thermal energy', { size: 33, weight: 700 });
  const unitJ = G(gA);
  const cJ = chip(unitJ, 'J', { size: 40, fill: C.card2, stroke: C.energy, w: 96 }); tr(cJ, 756, 594);
  T(unitJ, 822, 606, 'joules', { size: 31, weight: 600 });

  /* ================= B. the sparkler, the bath and their energy meters ================= */
  const gB = G(root);
  const meterHead = T(gB, 615, 196, 'thermal energy', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const MW = 44, MH = 300, MY = 228;
  const bathGlow = E('ellipse', { cx: 670, cy: MY + MH * 0.5, rx: 70, ry: MH * 0.62, fill: glow(C.energy) }, gB);
  const mSparkG = G(gB), mBathG = G(gB);
  const mSpark = meter(mSparkG, { w: MW, h: MH, vertical: true, color: C.energy }); tr(mSpark, -MW / 2, 0);
  const mBath = meter(mBathG, { w: MW, h: MH, vertical: true, color: C.energy }); tr(mBath, -MW / 2, 0);
  T(mSparkG, 0, MH + 40, 'spark', { size: 27, weight: 600, anchor: 'middle' });
  T(mBathG, 0, MH + 40, 'bath', { size: 27, weight: 600, anchor: 'middle' });
  tr(mSparkG, 560, MY); tr(mBathG, 670, MY);
  const bigTick = tick(gB, 18); const moreHeat = chip(gB, 'more heat', { size: 30, fill: C.card2, stroke: C.good, color: C.good });
  // sparkler: bare wire, coating, burning tip and a spray of sparks
  const spkG = G(gB);
  const TIPX = 236, TIPY = 246, BX = 118, BY = 480;
  E('line', { x1: BX, y1: BY, x2: TIPX, y2: TIPY, stroke: '#A7B2BC', 'stroke-width': 5, 'stroke-linecap': 'round' }, spkG);
  E('line', { x1: lerp(BX, TIPX, 0.42), y1: lerp(BY, TIPY, 0.42), x2: lerp(BX, TIPX, 0.86), y2: lerp(BY, TIPY, 0.86), stroke: '#77726C', 'stroke-width': 13, 'stroke-linecap': 'round' }, spkG);
  E('line', { x1: lerp(BX, TIPX, 0.84), y1: lerp(BY, TIPY, 0.84), x2: lerp(BX, TIPX, 0.97), y2: lerp(BY, TIPY, 0.97), stroke: '#3B3530', 'stroke-width': 11, 'stroke-linecap': 'round' }, spkG);
  const tipGlow = E('circle', { cx: TIPX, cy: TIPY, r: 58, fill: glow('#FFE7A0', '#FFFFFF') }, spkG);
  E('circle', { cx: TIPX, cy: TIPY, r: 9, fill: '#FFFDF2' }, spkG);
  const sparks = [], spr = rng(71);
  for (let i = 0; i < 26; i++) sparks.push({ el: E('path', { fill: 'none', stroke: ['#FFF4C8', '#FFD36E', '#FFB04A', '#FFFFFF'][i % 4], 'stroke-width': i % 3 ? 3 : 2.2, 'stroke-linecap': 'round' }, spkG), a: (i / 26) * TAU + spr() * 0.2, len: 62 + spr() * 46, rate: 1.1 + spr() * 0.8, ph: spr() });
  const hsh = (k, i) => { const x = Math.sin(k * 12.9898 + i * 78.233) * 43758.5453; return x - Math.floor(x); };
  const glitter = []; for (let i = 0; i < 12; i++) glitter.push({ el: E('circle', { r: 2 + (i % 3), fill: i % 2 ? '#FFFFFF' : '#FFE7A0' }, spkG), rate: 2.2 + (i % 5) * 0.4, ph: i / 12 });
  const tagHot = chip(gB, 'over 1000 °C', { size: 28, fill: C.card2, stroke: C.heat, color: '#FFC08A' });
  // the hand that the spark lands on
  const handG = G(gB); tr(handG, 286, 604, 1.15);
  cuppedHand(handG);
  const drift = spark(gB, 13, { seed: 5 });
  const landGlow = E('circle', { r: 30, fill: glow('#FFE7A0') }, gB);
  const stings = T(gB, 300, 706, 'barely stings', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  // the bath (cut away to show the water), with gentle steam
  const bathG = G(gB); tr(bathG, 906, 520);
  const TUB_O = 'M-186,-82 L186,-82 Q192,-82 190,-72 L174,40 Q166,92 112,94 L-112,94 Q-166,92 -174,40 L-190,-72 Q-192,-82 -186,-82 Z';
  const TUB_I = 'M-170,-70 L170,-70 L157,34 Q150,78 106,80 L-106,80 Q-150,78 -157,34 Z';
  [[-118, 1], [118, -1]].forEach(([x, s]) => E('path', { d: `M${x - 16 * s},88 Q${x - 4 * s},104 ${x - 18 * s},122 L${x + 14 * s},122 Q${x + 18 * s},104 ${x + 14 * s},88 Z`, fill: '#C9D6DF', stroke: '#EEF4F7', 'stroke-width': 2 }, bathG));
  E('path', { d: TUB_O, fill: linGrad('#F4F8FB', '#B7C7D3', true), stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bathG);
  E('path', { d: TUB_I, fill: '#173C4D' }, bathG);
  const bathWater = G(bathG);
  const wClip = (() => { const id = 'heatTempTub'; const cp = E('clipPath', { id }, defs()); E('path', { d: TUB_I }, cp); return `url(#${id})`; })();
  const waterR = E('rect', { x: -180, y: -50, width: 360, height: 140, fill: C.water, opacity: 0.88, 'clip-path': wClip }, bathWater);
  const surf = E('path', { fill: 'none', stroke: '#BDEBFA', 'stroke-width': 3, 'clip-path': wClip }, bathWater);
  E('rect', { x: -198, y: -92, width: 396, height: 16, rx: 8, fill: '#FFFFFF', stroke: '#C9D6DF', 'stroke-width': 2 }, bathG);
  E('path', { d: 'M-160,-92 L-160,-128 Q-160,-142 -146,-142 L-118,-142', fill: 'none', stroke: '#C9D6DF', 'stroke-width': 9, 'stroke-linecap': 'round' }, bathG);
  const steam = [-92, 0, 92].map((x, i) => { const s = heatWaves(bathG, { n: 2, h: 66, spacing: 24, width: 5, color: '#E6F1F6', speed: 0.3 }); tr(s, x, -98); return s; });
  const tag40 = chip(gB, 'about 40 °C', { size: 30, fill: C.card2, stroke: C.heat, color: '#FFC08A' });

  /* ================= C. the golden rule and thermal equilibrium ================= */
  const gC = G(root);
  const rule = chip(gC, 'the golden rule', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy });
  const bHotG = G(gC), bColdG = G(gC);
  const bHotGlow = E('circle', { r: 160, fill: glow(C.heat) }, bHotG);
  const bHot = block(bHotG, 160), bCold = block(bColdG, 160);
  tr(bHotG, 312, 410); tr(bColdG, 872, 410);
  const tHotG = G(gC), tColdG = G(gC);
  const thHot = thermometer(tHotG, 170, C.bad), thCold = thermometer(tColdG, 170, C.bad);
  tr(tHotG, 168, 500); tr(tColdG, 1060, 500);
  const rdHot = chip(gC, '80 °C', { size: 34, fill: C.card2, stroke: C.line, w: 140 }), rdCold = chip(gC, '20 °C', { size: 34, fill: C.card2, stroke: C.line, w: 140 });
  tr(rdHot, 312, 560); tr(rdCold, 872, 560);
  const flowC = flowArrow(gC, 450, 410, 760, 410, { width: 12, n: 3, h: 44 });
  const backG = G(gC);
  const back = arrow(backG, 760, 470, 450, 470, { color: C.water, width: 8 });
  const backX = cross(backG, 26); tr(backX, 605, 470);
  const eqC = T(gC, 605, 436, '=', { size: 90, weight: 700, anchor: 'middle', fill: C.energy });
  const equil = G(gC); T(equil, 0, 0, 'thermal equilibrium', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= D. holding an ice cube ================= */
  const gD = G(root);
  const HX = 560, HY = 536, HS = 1.4;
  const hand2G = G(gD); tr(hand2G, HX, HY, HS);
  cuppedHand(hand2G);
  const iceG = G(gD);
  iceCube(iceG, 124);
  const puddle = E('ellipse', { cx: 0, cy: 0, rx: 70, ry: 9, fill: 'rgba(160,220,250,0.55)' }, gD);
  const drip = E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: '#BFE9FF' }, gD);
  const ICE_X = 602;
  const coldArrow = arrow(gD, ICE_X, 436, ICE_X, 610, { color: C.water, width: 10 });
  const coldLbl = T(gD, 800, 396, 'cold', { size: 38, weight: 700, anchor: 'middle', fill: C.air });
  const coldStrike = strike(gD, 750, 384, 850, C.bad);
  const warmArrow = flowArrow(gD, ICE_X, 616, ICE_X, 440, { width: 12, n: 3, h: 34, off: 22 });
  const warmLbl = T(gD, 330, 372, 'thermal energy', { size: 36, weight: 700, anchor: 'middle', fill: '#FFB27A' });
  const outIn = T(gD, 330, 412, 'out of the hand, into the ice', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= E. absolute zero ================= */
  const gE = G(root);
  const PY = 400, K = 1.9;                                    // pointer height; pixels per degree
  const winId = 'heatTempScale';
  { const cp = E('clipPath', { id: winId }, defs()); E('rect', { x: 120, y: 132, width: 330, height: 540 }, cp); }
  const scaleWin = G(gE, { 'clip-path': `url(#${winId})` });
  const scaleG = G(scaleWin);
  {
    const lg = E('linearGradient', { id: 'heatTempBar', x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
    [[0, '#FF9A5C'], [0.22, '#F6D9B8'], [0.3, '#BFE6FF'], [1, '#2A4FB0']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lg));
    // the scale runs from 120 °C (top) down to −273 °C (bottom end); scale-local y = −T·K
    E('rect', { x: 300, y: -120 * K, width: 46, height: 393 * K + 8, rx: 23, fill: 'url(#heatTempBar)', stroke: '#E9F2F7', 'stroke-width': 3 }, scaleG);
    let d = '';
    for (let v = 120; v >= -270; v -= 10) d += `M346,${f1(-v * K)} L${v % 50 === 0 ? 372 : 360},${f1(-v * K)} `;
    E('path', { d, stroke: '#CFE0EA', 'stroke-width': 3 }, scaleG);
    for (let v = 100; v >= -250; v -= 50) T(scaleG, 288, -v * K + 10, deg(v), { size: 27, weight: 600, anchor: 'end', fill: v === 0 ? C.air : C.muted });
    E('path', { d: `M290,${f1(273 * K)} L372,${f1(273 * K)}`, stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round' }, scaleG);
    T(scaleG, 288, 273 * K + 10, deg(-273), { size: 28, weight: 700, anchor: 'end', fill: C.air });
  }
  const ptr = G(gE);
  E('path', { d: `M380,${PY} L404,${PY - 15} L404,${PY + 15} Z`, fill: C.energy }, ptr);
  const readout = chip(ptr, '20 °C', { size: 34, fill: C.card2, stroke: C.energy, w: 168 }); tr(readout, 498, PY);
  const absZero = chip(gE, 'absolute zero', { size: 30, fill: '#14385A', stroke: C.air, color: C.air });
  const lessE = T(gE, 835, 196, 'cold = less thermal energy', { size: 34, weight: 700, anchor: 'middle', fill: C.air });
  const boxE = G(gE); tr(boxE, 675, 258);
  const pbE = particleBox(boxE, 320, 210, { n: 24, r: 14, state: 'solid', seed: 9 });
  const mE = meter(gE, { w: 320, h: 26, color: C.energy, label: 'thermal energy', labelSize: 26 }); tr(mE, 675, 560);
  const barely = T(gE, 835, 644, 'particles barely move', { size: 32, weight: 700, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    /* ----- A ----- */
    const aA = 1 - P(t, at('spark') - 0.1, 0.5, linear);
    op(gA, aA);
    if (aA > 0) {
      const t0 = at('mix'), u = t - t0;
      const settle = P(t, mid('mix', 0.52), 1.4, ease);
      const pIn = P(t, t0 - 0.05, 0.5, pop);
      const jx = R ? 0.3 : 1;
      // the two words orbit each other and swap places (mixed up), then settle into their columns
      const ang = (R ? 1 : 3) * Math.PI * clamp(u / (mid('mix', 0.52) - t0));   // ends swapped, just as they settle
      const tx0 = 600 + 150 * Math.cos(ang), ty0 = 372 + 48 * Math.sin(ang), tr0 = 16 * Math.sin(2.0 * u) * jx;
      const hx0 = 600 - 150 * Math.cos(ang), hy0 = 372 - 48 * Math.sin(ang), hr0 = -20 * Math.sin(2.4 * u + 0.4) * jx;
      wTemp.setAttribute('transform', `translate(${f1(lerp(tx0, 320, settle))} ${f1(lerp(ty0, 196, settle))}) rotate(${(tr0 * (1 - settle)).toFixed(2)}) scale(${Math.max(0.01, (0.7 + 0.3 * pIn) * lerp(1.15, 1, settle)).toFixed(3)})`);
      wHeat.setAttribute('transform', `translate(${f1(lerp(hx0, 880, settle))} ${f1(lerp(hy0, 196, settle))}) rotate(${(hr0 * (1 - settle)).toFixed(2)}) scale(${Math.max(0.01, (0.7 + 0.3 * pIn) * lerp(1.25, 1, settle)).toFixed(3)})`);
      op(wTemp, clamp(pIn * 2)); op(wHeat, clamp(pIn * 2));
      const pc = P(t, mid('mix', 0.62), 0.6, linear); op(cardL, pc); op(cardR, pc);
      const pn = P(t, mid('mix', 0.88), 0.5, pop); op(neq, clamp(pn * 2));
      neq.setAttribute('transform', `translate(600 400) scale(${Math.max(0.01, 0.6 + 0.4 * pn).toFixed(3)}) translate(-600 -400)`);
      // temperature card
      popIn(thG, P(t, at('temp') - 0.1, 0.5, pop), 196, 500);
      thA.set(lerp(0.05, 0.62, P(t, mid('temp', 0.06), 1.8, ease)));
      op(howHot, P(t, mid('temp', 0.12), 0.45, linear));
      op(withThermo, P(t, mid('temp', 0.38), 0.45, linear));
      op(unitC, P(t, mid('temp', 0.62), 0.45, linear)); tr(unitC, 0, (1 - P(t, mid('temp', 0.62), 0.5, easeOut)) * 14);
      // heat card
      popIn(spG, P(t, at('heat') - 0.05, 0.6, pop), 760, 382, 0.3); spA.upd(t);
      op(isEnergy, P(t, mid('heat', 0.14), 0.45, linear));
      op(thermal, P(t, mid('heat', 0.36), 0.45, linear));
      op(unitJ, P(t, mid('heat', 0.64), 0.45, linear)); tr(unitJ, 0, (1 - P(t, mid('heat', 0.64), 0.5, easeOut)) * 14);
    }

    /* ----- B ----- */
    const aB = P(t, at('spark') - 0.05, 0.5, linear) * (1 - P(t, at('rule') - 0.15, 0.5, linear));
    op(gB, aB);
    if (aB > 0) {
      const big = P(t, at('big') - 0.1, 0.6, linear);
      op(spkG, P(t, at('spark'), 0.5, linear) * (1 - 0.45 * big));
      const fizz = P(t, at('spark'), 0.6, linear);
      tipGlow.setAttribute('r', f1(52 + 8 * Math.sin(t * 23) * AMP));
      sparks.forEach((s, i) => {
        const q = t * s.rate + s.ph, k = Math.floor(q), u = q - k;
        const a = s.a + (hsh(k, i) - 0.5) * 0.9, d1 = 14 + u * s.len, d0 = Math.max(10, d1 - 18 - 14 * (1 - u));
        const ca = Math.cos(a), sa = Math.sin(a);
        let d = `M${f1(TIPX + ca * d0)},${f1(TIPY + sa * d0)} L${f1(TIPX + ca * d1)},${f1(TIPY + sa * d1)}`;
        if (u > 0.45) { const fl = 9 * (u - 0.45) / 0.55 + 4; [0.6, -0.6].forEach(b => { d += ` M${f1(TIPX + ca * d1)},${f1(TIPY + sa * d1)} L${f1(TIPX + ca * d1 + Math.cos(a + b) * fl)},${f1(TIPY + sa * d1 + Math.sin(a + b) * fl)}`; }); }
        s.el.setAttribute('d', d);
        s.el.style.opacity = (fizz * (1 - u * u)).toFixed(3);
      });
      glitter.forEach((gl, i) => {
        const q = t * gl.rate + gl.ph, k = Math.floor(q), u = q - k, a = hsh(k, i + 40) * TAU, d = 34 + hsh(k, i + 90) * 62;
        attr(gl.el, 'cx', TIPX + Math.cos(a) * d); attr(gl.el, 'cy', TIPY + Math.sin(a) * d);
        op(gl.el, fizz * Math.max(0, Math.sin(u * Math.PI * 2)));
      });
      popIn(tagHot, P(t, mid('spark', 0.1), 0.5, pop), 402, 384);
      op(tagHot, P(t, mid('spark', 0.1), 0.3, linear) * (1 - 0.45 * big));
      // one spark drifts down and lands on the hand
      op(handG, P(t, mid('spark', 0.2), 0.5, linear) * (1 - 0.45 * big));
      tr(handG, 286, 604 + (1 - P(t, mid('spark', 0.2), 0.6, easeOut)) * 30, 1.15);
      const d0 = mid('spark', 0.3), dLand = mid('spark', 0.46);
      const u = clamp((t - d0) / (dLand - d0)), pe = ease(u);
      const sx = lerp(TIPX + 30, 318, pe) + Math.sin(pe * 9) * 10 * (1 - pe), sy = lerp(TIPY + 40, 594, pe);
      tr(drift, sx, sy, 0.7 + 0.3 * Math.sin(t * 9) * (1 - pe)); drift.upd(t);
      const after = P(t, dLand, 0.9, linear);
      op(drift, (t > d0 ? 1 : 0) * (1 - after));
      op(landGlow, Math.sin(Math.PI * after) * 0.8); tr(landGlow, 318, 594, 1 + after);
      op(stings, P(t, dLand - 0.1, 0.5, linear) * (1 - P(t, at('bath') - 0.2, 0.5, linear)));
      // the spark's meter: almost nothing
      op(meterHead, P(t, mid('spark', 0.6), 0.5, linear));
      op(mSparkG, P(t, mid('spark', 0.6), 0.5, linear));
      mSpark.set(0.025 * P(t, mid('spark', 0.64), 0.8, easeOut));
      // the bath
      const pb = P(t, at('bath') - 0.1, 0.6, pop);
      op(bathG, clamp(pb * 2) * (1 - 0.45 * big)); tr(bathG, 906 + (1 - clamp(pb)) * 40, 520);
      const lvl = lerp(80, -52, P(t, at('bath'), 1.6, ease));
      attr(waterR, 'y', lvl); attr(waterR, 'height', 90 - lvl);
      let sd = ''; for (let x = -176; x <= 176; x += 16) sd += (x === -176 ? 'M' : 'L') + x + ',' + f1(lvl + 2 * Math.sin(x * 0.06 + t * 2.4 * AMP));
      surf.setAttribute('d', sd);
      const stOn = P(t, mid('bath', 0.2), 0.8, linear);
      steam.forEach((s, i) => { s.upd(t + i * 0.4); op(s, stOn * 0.75); });
      popIn(tag40, P(t, mid('bath', 0.14), 0.5, pop), 906, 300);
      op(tag40, P(t, mid('bath', 0.14), 0.3, linear) * (1 - 0.45 * big));
      op(mBathG, P(t, mid('bath', 0.55), 0.5, linear));
      mBath.set(0.93 * P(t, mid('bath', 0.62), 1.5, easeOut));
      // side by side: tick and "more heat"
      const pk = P(t, mid('big', 0.45), 0.5, pop);
      op(bigTick, clamp(pk * 2)); tr(bigTick, 720, MY + 12, Math.max(0.01, pk));
      const pm = P(t, mid('big', 0.55), 0.5, pop);
      popIn(moreHeat, pm, 826, MY + 12);
      op(bathGlow, big * (0.35 + 0.2 * wave(t, 1.2) * AMP));
    }

    /* ----- C ----- */
    const aC = P(t, at('rule') - 0.1, 0.5, linear) * (1 - P(t, at('ice') - 0.15, 0.5, linear));
    op(gC, aC);
    if (aC > 0) {
      popIn(rule, P(t, at('rule'), 0.5, pop), 600, 168);
      const ph = P(t, mid('rule', 0.12), 0.55, pop), pc = P(t, mid('rule', 0.22), 0.55, pop);
      popIn(bHotG, ph, 312, 410, 0.7); popIn(bColdG, pc, 872, 410, 0.7);
      op(tHotG, clamp(ph * 2)); op(tColdG, clamp(pc * 2));
      op(rdHot, clamp(ph * 2)); op(rdCold, clamp(pc * 2));
      // the temperatures meet in the middle
      const eq = P(t, at('equal') + 0.1, end('equal') - at('equal') - 1.6, ease);
      const vH = Math.round(lerp(80, 50, eq)), vC = Math.round(lerp(20, 50, eq));
      bHot.heat((vH - 20) / 60); bCold.heat((vC - 20) / 60);
      thHot.set(vH / 100); thCold.set(vC / 100);
      setText(rdHot.label, deg(vH)); setText(rdCold.label, deg(vC));
      op(bHotGlow, (1 - eq) * 0.9); tr(bHotGlow, 0, 0, 0.9 + 0.1 * wave(t, 1.5) * AMP);
      flowC.set(P(t, mid('rule', 0.36), 0.6));
      const fOn = P(t, mid('rule', 0.4), 0.4, linear) * (1 - P(t, lerp(at('equal'), end('equal'), 0.55), 0.5, linear));
      op(flowC, fOn); flowC.upd(t, 1 - 0.6 * eq);
      // never the other way
      const pbk = P(t, mid('rule', 0.7), 0.5, linear);
      back.set(P(t, mid('rule', 0.7), 0.5)); op(backG, pbk * (1 - P(t, at('equal'), 0.4, linear)));
      const px = P(t, mid('rule', 0.84), 0.4, pop); op(backX, clamp(px * 2)); tr(backX, 605, 470, Math.max(0.01, px));
      const pe = P(t, mid('equal', 0.6), 0.45, pop); op(eqC, clamp(pe * 2));
      eqC.setAttribute('transform', `translate(605 410) scale(${Math.max(0.01, 0.6 + 0.4 * pe).toFixed(3)}) translate(-605 -410)`);
      popIn(equil, P(t, mid('equal', 0.66), 0.5, pop), 600, 662, 0.85);
    }

    /* ----- D ----- */
    const aD = P(t, at('ice') - 0.1, 0.5, linear) * (1 - P(t, at('zero') - 0.15, 0.5, linear));
    op(gD, aD);
    if (aD > 0) {
      const ph = P(t, at('ice'), 0.6, easeOut);
      tr(hand2G, HX, HY + (1 - ph) * 30, HS);
      const melt = P(t, mid('ice', 0.6), 3.5, linear);
      const s = 1 - 0.12 * melt;
      tr(iceG, ICE_X - 14, HY - 2 - 62 * s + (1 - ph) * 30, s);
      op(puddle, melt * 0.9); tr(puddle, ICE_X + 4, HY + 2, 0.4 + 0.6 * melt);
      const dq = ((t - mid('ice', 0.62)) / 1.3) % 1;
      op(drip, t > mid('ice', 0.62) ? Math.sin(dq * Math.PI) : 0); tr(drip, ICE_X + 52 * s, HY - 30 + dq * 26);
      // "cold" into the hand: no
      const pCold = P(t, mid('ice', 0.1), 0.5);
      coldArrow.set(pCold);
      op(coldArrow, P(t, mid('ice', 0.1), 0.2, linear) * (1 - P(t, mid('ice', 0.48), 0.4, linear)));
      op(coldLbl, P(t, mid('ice', 0.14), 0.4, linear) * (1 - 0.4 * P(t, mid('ice', 0.48), 0.4, linear)));
      coldStrike.set(P(t, mid('ice', 0.36), 0.4));
      // thermal energy out of the hand, into the ice
      warmArrow.set(P(t, mid('ice', 0.5), 0.6));
      op(warmArrow, P(t, mid('ice', 0.5), 0.2, linear)); warmArrow.upd(t, P(t, mid('ice', 0.58), 0.4, linear));
      op(warmLbl, P(t, mid('ice', 0.56), 0.4, linear));
      op(outIn, P(t, mid('ice', 0.68), 0.4, linear));
    }

    /* ----- E ----- */
    const aE = P(t, at('zero') - 0.1, 0.5, linear);
    op(gE, aE);
    if (aE > 0) {
      const T1 = lerp(20, 0, P(t, mid('zero', 0.06), 2.0, ease));
      const Tc = lerp(T1, -273, P(t, mid('zero', 0.3), 3.6, ease));
      tr(scaleG, 0, PY + Tc * K);
      setText(readout.label, deg(Math.round(Tc)));
      const pz = P(t, mid('zero', 0.64), 0.5, pop); popIn(absZero, pz, 498, PY + 66);
      op(lessE, P(t, mid('zero', 0.04), 0.5, linear));
      const e = 0.6 * (Tc + 273) / 293;
      pbE.set('solid', t, e);
      mE.set(Math.max(0.012, e));
      op(barely, P(t, mid('zero', 0.8), 0.5, linear));
    }
  };
});

/* Chapter 9, Evaporation: a cooling effect.
   A dish of water in close-up, its particles colour-coded by speed (blue slow, red fast), a thermometer in
   the liquid. Beats: different speeds (arrows) -> the fastest surface particles escape: evaporation ->
   well below boiling point (puddle) -> each escape lowers the average energy, the rest shift bluer
   (showpiece) -> the thermometer falls: a cooling effect -> sweat on skin carries energy away -> a breeze
   sweeps the escaped particles off, so more escape -> a swimmer climbs out into the wind -> warmer,
   windier, drier, bigger surface -> washing dries on a warm, breezy day. */
scene('evaporation', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const beat = (t, a, b) => win(t, a, b, 0.45);

  /* ---------- speed colours: blue (slow) to red (fast), as shaded balls ---------- */
  const RAMP = ['#3FA9F5', '#62BDF2', '#9CCBEA', '#E2D6CF', '#FFB27A', '#FF8A4C', '#FF5A4E'];
  const DARK = ['#1D6FA6', '#2A82B4', '#5E8DAE', '#9A8C86', '#C2632C', '#C24A22', '#B5302B'];
  const FILLS = RAMP.map((c, i) => ball(c, DARK[i]));
  const bin = s => Math.max(0, Math.min(6, Math.round(clamp(s) * 6)));
  const fillOf = s => FILLS[bin(s)];
  function velArrow(parent, len) {
    const g = G(parent), d = `M19,0 L${len - 10},0`;
    E('path', { d, stroke: '#0A1B27', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.75 }, g);
    E('path', { d: `M${len + 3},0 L${len - 17},-11 L${len - 12},0 L${len - 17},11 Z`, fill: '#0A1B27', opacity: 0.75, 'stroke-linejoin': 'round' }, g);
    E('path', { d, stroke: '#F2F7FA', 'stroke-width': 5.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${len},0 L${len - 14},-8 L${len - 10},0 L${len - 14},8 Z`, fill: '#F2F7FA' }, g);
    return g;
  }
  function windStreaks(parent, n, y0, y1, seed, w) {
    const g = G(parent), r = rng(seed), ss = [];
    for (let i = 0; i < n; i++) ss.push({ el: E('path', { fill: 'none', stroke: C.air, 'stroke-width': w || 4, 'stroke-linecap': 'round' }, g), y: lerp(y0, y1, r()), ph: r(), len: 90 + r() * 90, sp: 300 + r() * 160 });
    g.upd = (t, x0, x1) => ss.forEach(s => {
      const Wd = x1 - x0 + 360, u = ((t * s.sp + s.ph * Wd) % Wd), x = x0 - 180 + u, L = s.len;
      s.el.setAttribute('d', `M${(x - L).toFixed(1)},${s.y.toFixed(1)} Q${(x - L / 2).toFixed(1)},${(s.y - 10).toFixed(1)} ${x.toFixed(1)},${s.y.toFixed(1)} q20,-1 15,-17`);
      s.el.style.opacity = (0.75 * Math.min(1, u / 120, (Wd - u) / 120)).toFixed(3);
    });
    return g;
  }
  function droplet(parent, r, color) {
    return E('path', { d: `M0,${-r * 1.5} C${r * 0.55},${-r * 0.6} ${r},${-r * 0.1} ${r},${r * 0.35} A${r},${r} 0 0 1 ${-r},${r * 0.35} C${-r},${-r * 0.1} ${-r * 0.55},${-r * 0.6} 0,${-r * 1.5} Z`, fill: color || C.water, stroke: '#BDEBFA', 'stroke-width': 2 }, parent);
  }

  /* ================= A. the dish close-up ================= */
  const A = G(root);
  const SURF = 400, DX0 = 70, DX1 = 880;
  E('rect', { x: DX0, y: SURF, width: DX1 - DX0, height: 360, fill: C.water, opacity: 0.16 }, A);
  const surfLine = E('path', { fill: 'none', stroke: '#9FE3FA', 'stroke-width': 3, opacity: 0.8 }, A);
  E('path', { d: `M${DX0 - 8},330 L${DX0 - 8},760 M${DX1 + 8},330 L${DX1 + 8},760`, stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linecap': 'round' }, A);
  const partG = G(A);
  const pr = rng(91), parts = [];
  const ESC = [[0, 1], [0, 4], [0, 9], [0, 6], [0, 11], [0, 2], [0, 13], [0, 7], [0, 12]];
  const ARROWS = { '1,3': 0.18, '2,6': 0.92, '1,9': 0.4, '3,10': 0.86, '2,14': 0.12, '1,16': 0.62, '3,2': 0.95, '2,11': 0.26, '0,15': 0.8, '3,7': 0.5 };
  for (let rI = 0; rI < 6; rI++) for (let cI = 0; cI < 19; cI++) {
    const sx = DX0 + 24 + cI * 42 + (rI % 2 ? 21 : 0); if (sx > DX1 - 18) continue;
    const sy = SURF + 24 + rI * 37;
    const base = (pr() + pr() + pr()) / 3;
    let s = clamp(0.06 + 1.1 * Math.pow(base, 1.35));
    const key = rI + ',' + cI;
    if (ARROWS[key] !== undefined) s = ARROWS[key];
    const e = ESC.findIndex(q => q[0] === rI && q[1] === cI);
    if (e >= 0) s = 0.5;                               // an escaper: ordinary until a collision speeds it up
    else if (rI === 0 && s > 0.7) s = 0.55;
    const p = { sx, sy, s, rI, esc: e, ph1: pr() * TAU, ph2: pr() * TAU, ph3: pr() * TAU, el: E('circle', { r: 15, fill: fillOf(s) }, partG) };
    if (ARROWS[key] !== undefined) p.arrow = velArrow(A, 28 + 62 * s);
    if (e >= 0) { p.refill = E('circle', { r: 15, fill: fillOf(0.25) }, partG); p.ring = E('circle', { r: 24, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, A); }
    parts.push(p);
  }
  E('rect', { x: DX0, y: 590, width: DX1 - DX0, height: 170, fill: linGrad('rgba(10,27,39,0)', '#0A1B27', true) }, A);
  const escapers = parts.filter(p => p.esc >= 0).sort((a, b) => a.esc - b.esc);
  const ESC_T = [mid('escape', 0.36), mid('escape', 0.54), mid('below', 0.45), mid('left', 0.28), mid('left', 0.42), mid('left', 0.56), mid('left', 0.7), mid('cooler', 0.18), mid('cooler', 0.5)];
  const GAS = 4.6;
  /* after escaping, a particle shoots out of the surface and then wanders in the air above as a gas */
  const escPos = (p, t) => {
    const u = t - ESC_T[p.esc], e = p.esc, h = 120 + (e * 37) % 80, vx = (e % 2 ? 1 : -1) * (40 + (e * 17) % 40);
    let x = p.sx + vx * u + 16 * Math.sin(1.4 * u + e);
    const L = 100, Wd = 540, q = ((x - L) % (2 * Wd) + 2 * Wd) % (2 * Wd); x = L + (q < Wd ? q : 2 * Wd - q);
    return [x, p.sy - h * (1 - Math.exp(-u / 0.4)) - 9 * u + 9 * Math.sin(1.9 * u + e)];
  };
  const coolOf = t => { let c = 0; ESC_T.forEach(te => { c += 0.026 * P(t, te + 0.15, 0.6, ease); }); return c; };
  // thermometer in the liquid
  const thA = thermometer(A, 330, C.bad); tr(thA, 802, 452);
  const boilMk = G(A);
  E('line', { x1: 776, x2: 828, y1: 142, y2: 142, stroke: C.bad, 'stroke-width': 3.5, 'stroke-dasharray': '7 5' }, boilMk);
  T(boilMk, 764, 151, 'boiling point 100 °C', { size: 26, weight: 700, anchor: 'end', fill: '#FF9AA2' });
  const readA = chip(A, '20 °C', { size: 28, fill: C.card2, stroke: C.line, w: 104 });
  const readDown = arrow(A, 0, -16, 0, 16, { color: C.water, width: 6, head: 18 });
  // right panel: legend, label, puddle, meter
  const legend = [[0.15, 300, 'slow', 38], [0.95, 380, 'fast', 88]].map(([s, y, txt, L]) => {
    const g = G(A);
    E('circle', { cx: 940, cy: y, r: 15, fill: fillOf(s) }, g);
    const a = velArrow(g, L); tr(a, 940, y);
    T(g, 940 + L + 16, y + 11, txt, { size: 32, weight: 700, fill: RAMP[bin(s)] });
    return g;
  });
  const evapLbl = G(A);
  T(evapLbl, 1032, 250, 'evaporation', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  T(evapLbl, 1032, 292, 'the fastest escape', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(evapLbl, 1032, 324, 'and become a gas', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const pud = G(A);
  card(pud, 905, 130, 260, 250, { fill: C.card, stroke: C.line });
  const pudSun = sun(pud, 22); tr(pudSun, 1112, 184);
  E('rect', { x: 925, y: 302, width: 220, height: 14, rx: 6, fill: '#5E6B78' }, pud);
  const puddle = E('ellipse', { cx: 1012, cy: 302, rx: 92, ry: 13, fill: C.water, opacity: 0.9 }, pud);
  const pudV = [0, 1, 2, 3].map(i => E('circle', { r: 5, fill: RAMP[6] }, pud));
  T(pud, 1035, 352, 'a puddle drying up', { size: 26, weight: 700, anchor: 'middle' });
  const mtrG = G(A);
  const mtr = meter(mtrG, { w: 40, h: 300, vertical: true, color: C.heat, label: 'average energy', labelSize: 26, labelFill: C.ink }); tr(mtr, 1012, 236);
  T(mtrG, 1032, 606, 'of the particles left', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const mtrBar = mtr.childNodes[1];
  const stepMk = G(mtrG); const stepA = arrow(stepMk, 0, -14, 0, 14, { color: C.water, width: 5, head: 16 });
  const topChips = [chip(A, 'lower average', { size: 28, fill: C.card2, stroke: C.line }), G(A), chip(A, 'a cooling effect', { size: 32, fill: 'rgba(76,201,240,0.18)', stroke: C.water, color: '#BDEBFA' })];
  tr(topChips[0], 1032, 186); tr(topChips[2], 1020, 186);
  T(topChips[1], 1032, 176, 'temperature', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  T(topChips[1], 1032, 208, 'measures this', { size: 26, weight: 600, anchor: 'middle', fill: C.energyLt });
  const linkA = E('path', { d: 'M1004,262 Q900,214 826,282', fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '8 7' }, A);
  const thRing = E('circle', { r: 40, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, A);

  /* ================= B. sweat on skin, then a breeze ================= */
  const B = G(root);
  const SK = 480;
  E('rect', { x: 0, y: SK, width: 1200, height: 52, fill: '#E2A98A' }, B);
  E('rect', { x: 0, y: SK + 50, width: 1200, height: 230, fill: '#B9666E' }, B);
  E('path', { d: `M0,${SK} L1200,${SK}`, stroke: '#F4C9AE', 'stroke-width': 4 }, B);
  const BEADS = [330, 560, 790];
  BEADS.forEach((x, i) => {
    let d = `M${x},${SK} L${x - 4},${SK + 120}`;
    for (let k = 0; k < 5; k++) d += ` C${x + 44},${SK + 126 + k * 18} ${x + 44},${SK + 146 + k * 18} ${x},${SK + 140 + k * 18} C${x - 44},${SK + 134 + k * 18} ${x - 44},${SK + 154 + k * 18} ${x},${SK + 158 + k * 18}`;
    E('path', { d, fill: 'none', stroke: '#F3B8C1', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.85 }, B);
  });
  T(B, 980, SK + 38, 'skin', { size: 28, weight: 700, anchor: 'end', fill: '#7A3B2E' });
  T(B, 60, SK + 120, 'sweat glands', { size: 26, weight: 600, fill: '#FFE1E6' });
  const beadG = BEADS.map((x, i) => {
    const g = G(B);
    E('path', { d: `M${x - 74},${SK + 2} Q${x - 70},${SK - 52} ${x},${SK - 54} Q${x + 70},${SK - 52} ${x + 74},${SK + 2} Z`, fill: C.water, opacity: 0.85, stroke: '#BDEBFA', 'stroke-width': 3 }, g);
    E('path', { d: `M${x - 40},${SK - 34} Q${x - 20},${SK - 46} ${x + 4},${SK - 46}`, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.5, 'stroke-linecap': 'round' }, g);
    const br = rng(40 + i), ps = [];
    for (let k = 0; k < 6; k++) { const s = [0.2, 0.45, 0.3, 0.6, 0.15, 0.5][k]; ps.push({ el: E('circle', { r: 8, fill: fillOf(s) }, g), x: x - 46 + k * 18 + (k % 2 ? 0 : 0), y: SK - 14 - (k % 2) * 16, ph: br() * TAU, s }); }
    g.ps = ps;
    return g;
  });
  const heatUp = BEADS.map(x => arrow(B, x, SK + 44, x, SK - 10, { color: C.heat, width: 8, head: 22 }));
  const heatW = BEADS.map(x => { const h = heatWaves(B, { n: 2, h: 34, spacing: 26, width: 3.5 }); tr(h, x, SK + 44); return h; });
  const NSLOT = 14, SWS = mid('sweat', 0.3), BRS = at('breeze') + 0.8, R1 = 2.6, R2 = 6.5, FLYB = 1.7;
  const phi = t => (t < SWS ? -1 : t < BRS ? R1 * (t - SWS) : R1 * (BRS - SWS) + R2 * (t - BRS));
  const phiInv = k => (k <= R1 * (BRS - SWS) ? SWS + k / R1 : BRS + (k - R1 * (BRS - SWS)) / R2);
  const slots = [];
  for (let j = 0; j < NSLOT; j++) { const g = G(B); const sp = spark(g, 9, { seed: j }); tr(sp, 12, -12); E('circle', { r: 8, fill: fillOf(0.96) }, g); slots.push({ g, sp }); }
  const windB = windStreaks(B, 7, 200, 440, 7);
  const skinTh = thermometer(B, 200, C.bad); tr(skinTh, 1085, SK + 14);
  const skinChip = chip(B, 'skin 35 °C', { size: 28, fill: C.card2, stroke: C.line, w: 170 }); tr(skinChip, 1085, 248);
  const skinDown = arrow(B, 984, 230, 984, 268, { color: C.water, width: 5, head: 16 });
  const lblSweat = labelLine(B, 214, 380, 300, SK - 30, 'sweat', { size: 30, fill: '#BDEBFA' });
  const bChips = ['sweat evaporates', 'it carries energy away from your skin', 'moving air carries them away', 'so more can evaporate'].map((s, i) => { const c = chip(B, s, { size: 30, fill: C.card2, stroke: i >= 2 ? C.air : C.line }); tr(c, 560, 166); return c; });
  const chBreeze = chip(B, 'breeze', { size: 30, fill: 'rgba(159,216,255,0.16)', stroke: C.air, color: C.air }); tr(chBreeze, 150, 250);
  const chColder = chip(B, 'even colder', { size: 28, fill: 'rgba(76,201,240,0.18)', stroke: C.water, color: '#BDEBFA' }); tr(chColder, 1060, 196);

  /* ================= C. out of the pool into the wind ================= */
  const Cg = G(root);
  const DECK = 560, POOLX = 600;
  E('rect', { x: 0, y: DECK, width: POOLX, height: 200, fill: '#8FA7B5' }, Cg);
  let tiles = ''; for (let x = 60; x < POOLX; x += 60) tiles += `M${x},${DECK} L${x},760 `; for (let y = DECK + 50; y < 760; y += 50) tiles += `M0,${y} L${POOLX},${y} `;
  E('path', { d: tiles, stroke: '#C9D6DE', 'stroke-width': 2, opacity: 0.6 }, Cg);
  const swimmer = person(Cg, { shirt: '#C98E62', shorts: '#2F6FE0', shoes: '#C98E62' });
  const water = E('rect', { x: POOLX, y: 590, width: 1200 - POOLX, height: 170, fill: '#2F9ED8', opacity: 0.82 }, Cg);
  const poolSurf = E('path', { fill: 'none', stroke: '#BDEBFA', 'stroke-width': 4 }, Cg);
  E('rect', { x: POOLX - 30, y: DECK - 6, width: 60, height: 24, rx: 10, fill: '#E9F2F7' }, Cg);
  const windC = windStreaks(Cg, 7, 170, 520, 13);
  const shiver = G(Cg);
  [-1, 1].forEach(sd => E('path', { d: `M${sd * 34},-150 l${sd * 10},8 l${-sd * 8},8 l${sd * 10},8 l${-sd * 8},8 l${sd * 10},8`, fill: 'none', stroke: '#BDEBFA', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, shiver));
  const drips = [];
  for (let i = 0; i < 8; i++) drips.push(E('circle', { r: 6, fill: fillOf(0.96) }, Cg));
  const chWindy = chip(Cg, 'windy day', { size: 30, fill: 'rgba(159,216,255,0.16)', stroke: C.air, color: C.air }); tr(chWindy, 170, 170);
  const chFreeze = chip(Cg, 'feels freezing!', { size: 32, fill: 'rgba(76,201,240,0.18)', stroke: C.water, color: '#BDEBFA' }); tr(chFreeze, 760, 300);

  /* ================= D. what makes evaporation faster ================= */
  const Dg = G(root);
  const dHead = T(Dg, 600, 158, 'Evaporation is faster when it is…', { size: 40, weight: 700, anchor: 'middle' });
  const DX = [189, 463, 737, 1011];
  const dCards = ['warmer', 'windier', 'drier', 'bigger surface area'].map((s, i) => {
    const g = G(Dg);
    card(g, DX[i] - 125, 206, 250, 380, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, DX[i], 350);
    if (i === 3) { T(g, DX[i], 474, 'bigger', { size: 30, weight: 700, anchor: 'middle' }); T(g, DX[i], 508, 'surface area', { size: 30, weight: 700, anchor: 'middle' }); }
    else T(g, DX[i], 490, s, { size: 34, weight: 700, anchor: 'middle' });
    const up = arrow(g, DX[i] - 44, 568, DX[i] - 44, 530, { color: C.good, width: 6, head: 18 });
    T(g, DX[i] - 22, 564, 'faster', { size: 26, weight: 700, fill: C.good });
    return { g, art, up };
  });
  const dSun = sun(dCards[0].art, 46);
  const dWind = G(dCards[1].art);
  [[-30, 120], [6, 150], [42, 104]].forEach(([y, L], k) => E('path', { d: `M${-L / 2 - 10},${y} L${L / 2 - 20},${y} q30,0 26,-22 q-4,-14 -18,-8`, fill: 'none', stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, dWind));
  { const a = dCards[2].art;
    E('path', { d: 'M-80,30 C-96,0 -70,-32 -40,-26 C-34,-60 20,-64 32,-34 C70,-46 96,-6 72,24 C80,48 -66,52 -80,30 Z', fill: 'rgba(159,216,255,0.22)', stroke: C.air, 'stroke-width': 3 }, a);
    const dr = G(a); droplet(dr, 18, C.water); tr(dr, 0, 4);
    E('line', { x1: -34, y1: 36, x2: 34, y2: -32, stroke: C.bad, 'stroke-width': 7, 'stroke-linecap': 'round' }, a);
    T(a, 0, 92, 'dry air', { size: 26, weight: 600, anchor: 'middle', fill: C.muted }); }
  const dSA = G(dCards[3].art);
  E('path', { d: 'M-104,-6 L-104,28 Q-104,36 -96,36 L-8,36 Q0,36 0,28 L0,-6', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4 }, dSA);
  E('rect', { x: -102, y: 14, width: 100, height: 20, fill: C.water, opacity: 0.85 }, dSA);
  E('path', { d: 'M36,-60 L36,28 Q36,36 44,36 L72,36 Q80,36 80,28 L80,-60', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4 }, dSA);
  E('rect', { x: 38, y: -28, width: 40, height: 62, fill: C.water, opacity: 0.85 }, dSA);
  const saDots = [];
  for (let i = 0; i < 6; i++) saDots.push({ el: E('circle', { r: 5.5, fill: fillOf(0.96) }, dSA), wide: i < 5, x: i < 5 ? -92 + i * 20 : 58, y: i < 5 ? 12 : -30, ph: i * 0.21 });

  /* ================= E. washing on the line ================= */
  const Eg = G(root);
  const sunW = sun(Eg, 42); tr(sunW, 1060, 160);
  E('path', { d: 'M120,660 L120,236 M1000,660 L1000,236', stroke: '#B9C6D2', 'stroke-width': 10, 'stroke-linecap': 'round' }, Eg);
  E('rect', { x: 60, y: 660, width: 1000, height: 6, rx: 3, fill: '#3E6B4A' }, Eg);
  const lineY = x => 244 + 26 * Math.sin(Math.PI * (x - 120) / 880);
  E('path', { d: `M120,244 Q560,296 1000,244`, fill: 'none', stroke: '#E9F2F7', 'stroke-width': 3 }, Eg);
  const CLOTHES = [
    { x: 260, d: 'M-70,0 L-30,0 Q0,22 30,0 L70,0 L96,40 L66,58 L54,40 L54,150 L-54,150 L-54,40 L-66,58 L-96,40 Z', fill: '#FF8A94', w: 192 },
    { x: 470, d: 'M-60,0 L60,0 L60,190 L-60,190 Z', fill: '#FFE45C', w: 120 },
    { x: 680, d: 'M-56,0 L56,0 L60,200 L18,200 L4,60 L-10,200 L-52,200 Z', fill: '#5B8DEF', w: 116 },
    { x: 870, d: 'M-14,0 L14,0 L14,70 Q14,92 34,96 L34,116 Q-6,118 -14,92 Z', fill: '#56D69B', w: 48 },
  ].map((c, i) => {
    const g = G(Eg), body = G(g);
    E('path', { d: c.d, fill: c.fill, stroke: '#ffffff', 'stroke-width': 2.5, 'stroke-linejoin': 'round', opacity: 0.95 }, body);
    E('path', { d: c.d, fill: 'rgba(29,132,166,0.35)' }, body).setAttribute('class', 'wet');
    [-c.w / 2 + 12, c.w / 2 - 12].forEach(px => E('rect', { x: px - 5, y: -10, width: 10, height: 22, rx: 3, fill: '#C9D3DC' }, g));
    const y0 = lineY(c.x);
    return Object.assign(c, { g, body, wet: body.lastChild, y0, ph: i * 1.3 });
  });
  const windE = windStreaks(Eg, 8, 300, 600, 31);
  const vap = [];
  for (let i = 0; i < 8; i++) vap.push({ el: E('circle', { r: 5, fill: fillOf(0.96) }, Eg), c: i % 4, ph: i * 0.37 });
  const dripE = [];
  for (let i = 0; i < 6; i++) { const g = G(Eg); droplet(g, 6, C.water); dripE.push({ g, c: i % 4, ph: i * 0.53 }); }
  const chDry = chip(Eg, 'warm + breezy = dries fastest', { size: 32, fill: 'rgba(86,214,155,0.16)', stroke: C.good }); tr(chDry, 560, 600);

  /* ================= update ================= */
  return t => {
    const tB = at('sweat') - 0.1, tC = at('pool') - 0.1, tD = at('faster') - 0.1, tE = at('washing') - 0.1;
    const aA = beat(t, S.first - 0.3, tB + 0.35), aB = beat(t, tB, tC + 0.35), aC = beat(t, tC, tD + 0.35), aD = beat(t, tD, tE + 0.35), aE = P(t, tE, 0.45, linear);
    op(A, aA); op(B, aB); op(Cg, aC); op(Dg, aD); op(Eg, aE);

    /* --- A: the dish --- */
    if (aA > 0) {
      let d = `M${DX0},${SURF}`;
      for (let x = DX0; x <= DX1; x += 20) d += ` L${x},${(SURF + 3 * Math.sin(x * 0.03 + t * 1.6 * calm)).toFixed(1)}`;
      surfLine.setAttribute('d', d);
      const cool = coolOf(t);
      const arrowsOn = win(t, mid('speeds', 0.4), at('escape') + 0.3, 0.4);
      parts.forEach((p, i) => {
        const kick = p.esc >= 0 ? P(t, ESC_T[p.esc] - 1.5, 0.5, linear) : 0, s0 = p.esc >= 0 ? lerp(p.s, 0.96, kick) : p.s;
        const sp = p.esc >= 0 ? s0 : p.s * (1 - cool);
        const A1 = (2 + 6 * s0) * calm, w1 = 0.8 + 2.8 * s0, w2 = 0.7 + 2.4 * s0;
        const x = p.sx + A1 * Math.sin(w1 * t + p.ph1) + 5 * calm * Math.sin(0.4 * t + p.ph3), y = p.sy + A1 * Math.cos(w2 * t + p.ph2);
        if (p.esc >= 0) {
          const te = ESC_T[p.esc], u = t - te;
          let ex = x, ey = y, eo = 1;
          if (u > 0) { const q = escPos(p, t); ex = q[0]; ey = q[1]; eo = 1 - P(u, GAS, 0.8, linear); }
          attr(p.el, 'cx', ex); attr(p.el, 'cy', ey); op(p.el, eo); p.el.setAttribute('fill', fillOf(sp));
          op(p.ring, win(t, te - 1.3, te + 0.45, 0.3)); attr(p.ring, 'cx', ex); attr(p.ring, 'cy', ey);
          const rf = P(t, te + 0.7, 0.8, linear);
          op(p.refill, rf); if (rf > 0) { attr(p.refill, 'cx', p.sx + 2 * Math.sin(t * 1.1 + p.ph1)); attr(p.refill, 'cy', p.sy + 2 * Math.cos(t * 1.3 + p.ph2)); p.refill.setAttribute('fill', fillOf(0.25 * (1 - cool))); }
        } else { attr(p.el, 'cx', x); attr(p.el, 'cy', y); p.el.setAttribute('fill', fillOf(sp)); }
        if (p.arrow) {
          op(p.arrow, arrowsOn);
          if (arrowsOn > 0) { const vx = A1 * w1 * Math.cos(w1 * t + p.ph1), vy = -A1 * w2 * Math.sin(w2 * t + p.ph2); tr(p.arrow, x, y, 1, Math.atan2(vy, vx) * 180 / Math.PI); }
        }
      });
      // thermometer and its reading
      const T0 = 20 - 5 * P(t, mid('cooler', 0.36), 2.4, ease);
      thA.set(T0 / 100);
      const colTop = 452 - (330 - 20) * (0.12 + 0.88 * T0 / 100);
      op(boilMk, P(t, at('below') + 0.1, 0.5, linear));
      const rd = P(t, mid('below', 0.12), 0.4, linear);
      op(readA, rd); tr(readA, 724, colTop); setText(readA.label, Math.round(T0) + ' °C');
      const rdn = win(t, mid('cooler', 0.36), mid('cooler', 0.36) + 3.2, 0.3); op(readDown, rdn); tr(readDown, 664, colTop);
      // legend, label, puddle
      op(legend[0], win(t, mid('speeds', 0.74), at('escape') + 0.2, 0.35)); op(legend[1], win(t, mid('speeds', 0.85), at('escape') + 0.2, 0.35));
      op(evapLbl, win(t, mid('escape', 0.6), at('below') + 0.25, 0.35));
      const pdA = win(t, mid('below', 0.56), at('left') + 0.3, 0.35); op(pud, pdA);
      if (pdA > 0) { pudSun.upd(t * calm); const sh = P(t, mid('below', 0.6), 2.4, ease); attr(puddle, 'rx', lerp(92, 40, sh)); attr(puddle, 'ry', lerp(13, 7, sh)); pudV.forEach((v, k) => { const q = ((t * 0.7 + k / 4) % 1); attr(v, 'cx', 1012 + (k - 1.5) * 22 * (1 - 0.5 * sh)); attr(v, 'cy', 296 - q * 100); op(v, Math.sin(q * Math.PI) * 0.9); }); }
      // meter: average energy of the particles left
      const mA = P(t, at('left') + 0.1, 0.5, linear); op(mtrG, mA);
      const coolL = coolOf(at('left'));
      const mv = clamp(0.88 - 2.6 * (cool - coolL));
      mtr.set(mv); mtrBar.setAttribute('fill', mv > 0.74 ? C.heat : mv > 0.6 ? '#F3A06A' : mv > 0.5 ? '#B9B4C8' : C.water);
      let lastE = -1; ESC_T.forEach((te, k) => { if (t >= te + 0.15) lastE = k; });
      const sk = lastE >= 3 ? win(t, ESC_T[lastE] + 0.15, ESC_T[lastE] + 1.0, 0.2) : 0;
      op(stepMk, sk * mA); tr(stepMk, 1084, 236 + 300 * (1 - mv));
      op(topChips[0], win(t, mid('left', 0.7), at('cooler') + 0.1, 0.3));
      op(topChips[1], win(t, at('cooler') + 0.05, mid('cooler', 0.66), 0.3));
      const ce = P(t, mid('cooler', 0.68), 0.5, pop); op(topChips[2], clamp(ce * 2)); tr(topChips[2], 1020, 186, 0.85 + 0.15 * ce);
      const lk = win(t, at('cooler') + 0.15, mid('cooler', 0.66), 0.3); op(linkA, lk); linkA.setAttribute('stroke-dashoffset', (-t * 30).toFixed(1));
      op(thRing, lk); attr(thRing, 'cx', 802); attr(thRing, 'cy', colTop); attr(thRing, 'r', 30 + 4 * wave(t, 0.8));
    }

    /* --- B: sweat, then a breeze --- */
    if (aB > 0) {
      beadG.forEach((g, i) => {
        const gr = P(t, at('sweat') + i * 0.25, 0.6, easeOut);
        g.setAttribute('transform', `translate(${BEADS[i]} ${SK}) scale(${(0.4 + 0.6 * gr).toFixed(3)}) translate(${-BEADS[i]} ${-SK})`); op(g, clamp(gr * 2));
        g.ps.forEach(p => { attr(p.el, 'cx', p.x + 3 * Math.sin(t * (2 + 3 * p.s) + p.ph) * calm); attr(p.el, 'cy', p.y + 2 * Math.cos(t * (2 + 3 * p.s) + p.ph) * calm); });
      });
      const ha = P(t, mid('sweat', 0.6), 0.6, easeOut); heatUp.forEach(a => { a.set(ha); op(a, 0.95 * clamp(ha * 3)); });
      heatW.forEach((h, i) => { h.upd(t + i * 0.3); op(h, 0.9 * ha); });
      const w = P(t, at('breeze') + 0.3, 1.2, ease);
      const ph = phi(t);
      slots.forEach((sl, j) => {
        if (ph < j) { op(sl.g, 0); return; }
        const k = j + NSLOT * Math.floor((ph - j) / NSLOT), te = phiInv(k), age = t - te;
        if (age < 0 || age > FLYB) { op(sl.g, 0); return; }
        const bx = BEADS[k % 3] + ((k * 37) % 50) - 25, by = SK - 46;
        const x = bx + 10 * Math.sin(3 * age + j) + w * (200 * age + 140 * age * age), y = by - 125 * age + w * 40 * age;
        tr(sl.g, x, y); sl.sp.upd(t + j);
        op(sl.g, Math.min(1, age * 6) * (1 - P(age, FLYB - 0.45, 0.45, linear)) * clamp((1180 - x) / 60));
      });
      windB.upd(t * calm, 0, 1200); op(windB, w);
      const Tsk = 35 - 2 * P(t, mid('sweat', 0.62), 1.8, ease) - 2.5 * P(t, mid('breeze', 0.42), 2.4, ease);
      skinTh.set((Tsk - 25) / 15); setText(skinChip.label, 'skin ' + Math.round(Tsk) + ' °C');
      op(skinDown, win(t, mid('sweat', 0.62), mid('breeze', 0.95), 0.3));
      lblSweat.set(win(t, at('sweat') + 0.4, mid('sweat', 0.7), 0.3));
      const cw = [[mid('sweat', 0.3), mid('sweat', 0.59)], [mid('sweat', 0.59), at('breeze') + 0.2], [mid('breeze', 0.36), mid('breeze', 0.79)], [mid('breeze', 0.79), at('pool') + 0.3]];
      bChips.forEach((c, i) => op(c, win(t, cw[i][0], cw[i][1], 0.3)));
      op(chBreeze, P(t, at('breeze') + 0.2, 0.4, linear));
      op(chColder, P(t, mid('breeze', 0.12), 0.4, linear));
    }

    /* --- C: out of the pool --- */
    if (aC > 0) {
      const cl = P(t, at('pool') + 0.1, 1.6, ease);
      const px = lerp(690, 470, cl), py = lerp(738, DECK, ease(clamp(cl * 1.25)));
      const sh = P(t, at('pool') + 1.5, 0.4, linear);
      const jit = sh * Math.sin(t * 80) * 1.6 * calm;
      tr(swimmer, px + jit, py, '-1 1');
      const climb = 1 - sh;
      swimmer.pose({ lean: -4 * climb, armL: [lerp(150, 35, sh), lerp(10, 120, sh)], armR: [lerp(140, 30, sh), lerp(10, 118, sh)], legL: [lerp(40, 3, cl), lerp(-60, -3, cl)], legR: [lerp(-10, -3, cl), -3] });
      let d = `M${POOLX},590`; for (let x = POOLX; x <= 1200; x += 24) d += ` L${x},${(590 + 4 * Math.sin(x * 0.04 + t * 2.2 * calm)).toFixed(1)}`;
      poolSurf.setAttribute('d', d);
      windC.upd(t * calm, 0, 1200); op(windC, P(t, at('pool') + 0.4, 0.8, linear));
      op(shiver, sh); tr(shiver, px + jit, py);
      drips.forEach((dp, i) => {
        const q = ((t - at('pool') - 1.2) * 0.8 + i / 8) % 1;
        if (t < at('pool') + 1.2) { op(dp, 0); return; }
        attr(dp, 'cx', px - 20 + (i % 4) * 14 + q * 260); attr(dp, 'cy', py - 150 + (i % 3) * 40 - q * 90); op(dp, Math.sin(q * Math.PI) * 0.95);
      });
      op(chWindy, P(t, mid('pool', 0.55), 0.4, linear));
      const fz = P(t, mid('pool', 0.8), 0.4, pop); op(chFreeze, clamp(fz * 2)); tr(chFreeze, 760, 300, 0.85 + 0.15 * fz);
    }

    /* --- D: faster when... --- */
    if (aD > 0) {
      op(dHead, P(t, at('faster'), 0.4, linear));
      const show = [0.3, 0.41, 0.5, 0.66];
      dCards.forEach((c, i) => {
        const p = P(t, mid('faster', show[i]), 0.5, pop);
        op(c.g, clamp(p * 2)); tr(c.g, 0, (1 - clamp(p)) * 24);
        c.up.set(P(t, mid('faster', show[i]) + 0.3, 0.5));
      });
      dSun.upd(t * calm); tr(dWind, 6 * Math.sin(t * 2.2) * calm, 0);
      saDots.forEach((dt, i) => { const q = ((t * 0.6 + dt.ph) % 1); attr(dt.el, 'cx', dt.x + Math.sin(q * 6) * 4); attr(dt.el, 'cy', dt.y - q * 80); op(dt.el, Math.sin(q * Math.PI)); });
    }

    /* --- E: washing on a warm, breezy day --- */
    if (aE > 0) {
      sunW.upd(t * calm);
      const dry = P(t, at('washing') + 0.3, 3.2, linear);
      CLOTHES.forEach(c => {
        const sw = (5 + 3 * Math.sin(t * 1.3 + c.ph)) * calm, sk = 6 * Math.sin(t * 2.6 + c.ph) * calm;
        tr(c.g, c.x, c.y0);
        c.body.setAttribute('transform', `skewX(${sk.toFixed(2)}) rotate(${sw.toFixed(2)})`);
        op(c.wet, 1 - dry);
      });
      windE.upd(t * calm, 0, 1200);
      vap.forEach(v => { const c = CLOTHES[v.c], q = ((t * 0.55 + v.ph) % 1); attr(v.el, 'cx', c.x - 30 + (v.ph * 160) % 60 + q * 180); attr(v.el, 'cy', c.y0 + 90 - q * 150); op(v.el, Math.sin(q * Math.PI) * 0.9 * (1 - 0.6 * dry)); });
      dripE.forEach(dp => { const c = CLOTHES[dp.c], q = ((t * 0.7 + dp.ph) % 1); tr(dp.g, c.x - 20 + (dp.ph * 100) % 40, c.y0 + 170 + q * 120); op(dp.g, Math.sin(q * Math.PI) * (1 - q) * 1.6 * (1 - dry)); });
      const cd = P(t, mid('washing', 0.55), 0.5, pop); op(chDry, clamp(cd * 2)); tr(chDry, 560, 600, 0.85 + 0.15 * cd);
    }
  };
});

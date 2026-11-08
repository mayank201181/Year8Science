/* Chapter 7, Thermal expansion and contraction.
   Beats: the metal bar is heated, its particles vibrate and spread, and it stretches past its starting
   outline -> cooled, it shrinks inside it -> a balance: same mass, same particles, more volume -> gas,
   liquid, solid ranked -> a bar between two walls buckles -> a bridge joint and railway gaps on a hot day
   -> power lines in summer and winter -> a bimetallic strip bends -> a thermostat switches a heater off
   -> a liquid-in-glass thermometer rises (handoff to the next chapter). */
scene('expansion', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const beat = (t, a, b) => win(t, a, b, 0.45);

  /* ---------- local helpers ---------- */
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mixC = (a, b, p) => { const x = hex(a), y = hex(b); p = clamp(p); return `rgb(${Math.round(lerp(x[0], y[0], p))},${Math.round(lerp(x[1], y[1], p))},${Math.round(lerp(x[2], y[2], p))})`; };
  const METAL = () => linGrad('#94A1AE', '#505C68', true);
  function snowflake(parent, r, color) {
    const g = G(parent); let d = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, ca = Math.cos(a), sa = Math.sin(a);
      const q = (u, v) => `${(ca * u - sa * v).toFixed(1)},${(sa * u + ca * v).toFixed(1)}`;
      d += `M0,0 L${q(r, 0)} M${q(r * 0.55, 0)} L${q(r * 0.82, r * 0.24)} M${q(r * 0.55, 0)} L${q(r * 0.82, -r * 0.24)} `;
    }
    E('path', { d, fill: 'none', stroke: color || '#CFEFFF', 'stroke-width': Math.max(3, r * 0.13), 'stroke-linecap': 'round' }, g);
    return g;
  }
  function stand(parent, x, yTop, yBench) {
    const g = G(parent);
    E('rect', { x: x - 48, y: yBench - 14, width: 110, height: 14, rx: 5, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    E('rect', { x: x - 7, y: yTop, width: 14, height: yBench - 14 - yTop, rx: 4, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, g);
    return g;
  }
  function clampBlock(parent, x, y, w, h) {
    const g = G(parent);
    E('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 9, fill: linGrad('#9AA7B4', '#5E6B78', true), stroke: '#C2CDD7', 'stroke-width': 3 }, g);
    E('circle', { cx: x, cy: y, r: Math.min(9, h * 0.18), fill: '#3E4954', stroke: '#C2CDD7', 'stroke-width': 2 }, g);
    return g;
  }
  /* a bimetallic strip fixed at (x0, y0), length L, layer thickness th, bent with curvature k (up).
     Steel is the top (inner) layer, brass the bottom (outer) one, because brass expands more. */
  function stripPaths(x0, y0, L, k, th) {
    const N = 28, top = [], midl = [], bot = [];
    for (let i = 0; i <= N; i++) {
      const s = L * i / N, a = k * s;
      const cx = k > 1e-7 ? x0 + Math.sin(a) / k : x0 + s, cy = k > 1e-7 ? y0 - (1 - Math.cos(a)) / k : y0;
      const nx = -Math.sin(a), ny = -Math.cos(a);
      top.push([cx + nx * th, cy + ny * th]); midl.push([cx, cy]); bot.push([cx - nx * th, cy - ny * th]);
    }
    const poly = (a, b) => 'M' + a.concat(b.slice().reverse()).map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z';
    return { steel: poly(top, midl), brass: poly(midl, bot), tip: midl[N], tipBot: bot[N], ang: k * L };
  }
  const STEEL = ['#B4C0CB', '#7D8B98'], BRASS = ['#E2B04A', '#9C6E1B'];
  /* liquid-in-glass thermometer, origin at the bulb centre; g.set(y) puts the liquid top at y (negative) */
  function glassTherm(parent, H, o) {
    o = o || {};
    const g = G(parent), sw = o.sw || 40, rb = o.rb || 26, bore = o.bore || 8, liq = o.liq || C.blood;
    const ro = rb + 5, hw = sw / 2, yj = -Math.sqrt(ro * ro - hw * hw);
    const d = `M${-hw},${yj.toFixed(1)} L${-hw},${-H + hw} A${hw},${hw} 0 0 1 ${hw},${-H + hw} L${hw},${yj.toFixed(1)} A${ro},${ro} 0 1 1 ${-hw},${yj.toFixed(1)} Z`;
    E('path', { d, fill: 'rgba(200,230,250,0.12)' }, g);
    E('rect', { x: -bore / 2, y: -H + hw * 0.7, width: bore, height: H - hw * 0.7 + yj + 4, rx: bore / 2, fill: 'rgba(6,20,30,0.6)' }, g);
    E('circle', { r: rb, fill: ball(liq, '#9E1F2C') }, g);
    const col = E('rect', { x: -bore / 2, width: bore, rx: bore / 2, fill: liq }, g);
    E('path', { d, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -hw + 6, y: -H + hw + 4, width: 5, height: H - hw - 46, rx: 2.5, fill: GLASS.shine }, g);
    g.set = y => { attr(col, 'y', y); attr(col, 'height', Math.max(0, yj + 10 - y)); };
    g.set(-60);
    return g;
  }

  /* ================= A. the metal bar: expansion, then contraction ================= */
  const A = G(root);
  const BX0 = 250, BY = 330, L0 = 700, BH = 70, NP = 12, BENCH = 628;
  E('rect', { x: 120, y: BENCH, width: 960, height: 6, rx: 3, fill: C.line }, A);
  stand(A, 204, BY - 60, BENCH);
  const burner = bunsen(A, 1); tr(burner, 360, BENCH - 18);
  const barG = G(A);
  const body = E('rect', { x: BX0, y: BY - BH / 2, width: L0, height: BH, rx: 12, fill: METAL(), stroke: '#B4C0CB', 'stroke-width': 3 }, barG);
  const hotO = E('rect', { x: BX0, y: BY - BH / 2, width: L0, height: BH, rx: 12, fill: C.heat }, barG);
  const coldO = E('rect', { x: BX0, y: BY - BH / 2, width: L0, height: BH, rx: 12, fill: C.water }, barG);
  const shine = E('rect', { x: BX0 + 12, y: BY - BH / 2 + 7, width: L0 - 24, height: 6, rx: 3, fill: '#ffffff', opacity: 0.25 }, barG);
  const pr = rng(71), parts = [];
  for (let i = 0; i < NP; i++) {
    const g = G(barG);
    const vib = E('path', { d: 'M-29,-11 Q-36,0 -29,11 M29,-11 Q36,0 29,11', fill: 'none', stroke: C.energyLt, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 21, fill: ball('#C9D2DA', '#6C7884') }, g);
    const hot = E('circle', { r: 21, fill: ball(C.heat, C.heatDk) }, g);
    const cold = E('circle', { r: 21, fill: ball(C.water, C.waterDk) }, g);
    parts.push({ g, vib, hot, cold, ph: pr() * TAU });
  }
  const outline = E('rect', { x: BX0 - 6, y: BY - BH / 2 - 7, width: L0 + 12, height: BH + 14, rx: 16, fill: 'none', stroke: '#E9F2F7', 'stroke-width': 3, 'stroke-dasharray': '12 9' }, A);
  const outLbl = T(A, BX0 + L0 + 6, BY + BH / 2 + 46, 'starting length', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  clampBlock(A, 226, BY, 84, 82);
  const frost = G(A);
  E('circle', { r: 92, fill: glow('#9FD8FF') }, frost);
  const flake = snowflake(frost, 46);
  // labels
  const chVib = chip(A, 'vibrate more', { size: 30, fill: C.card2, stroke: C.heat }); tr(chVib, 420, 200);
  const chApart = chip(A, 'further apart', { size: 30, fill: C.card2, stroke: C.heat }); tr(chApart, 790, 200);
  const chArrow = arrow(A, 550, 200, 660, 200, { color: C.muted, width: 5 });
  const tExp = T(A, 600, 198, 'thermal expansion', { size: 54, weight: 700, anchor: 'middle', fill: C.heat });
  const tCon = T(A, 600, 198, 'thermal contraction', { size: 54, weight: 700, anchor: 'middle', fill: C.water });
  const dimG = G(A);
  const dimP = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, dimG);
  const dimLong = T(dimG, 0, 0, 'longer', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
  const dimShort = T(dimG, 0, 0, 'shorter', { size: 28, weight: 700, anchor: 'middle', fill: C.water });

  /* ================= B. same mass, same particles, more volume ================= */
  const B = G(root);
  const PV = [600, 300], ARM = 270;
  E('rect', { x: 510, y: 646, width: 180, height: 16, rx: 7, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, B);
  E('rect', { x: 593, y: PV[1], width: 14, height: 348, rx: 4, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, B);
  E('path', { d: 'M560,246 A48,48 0 0 1 640,246', fill: 'none', stroke: C.muted, 'stroke-width': 3 }, B);
  E('line', { x1: 600, y1: 240, x2: 600, y2: 254, stroke: C.good, 'stroke-width': 4, 'stroke-linecap': 'round' }, B);
  function miniBar(parent, len, hot) {
    const g = G(parent), n = 12, r = 8;
    E('rect', { x: -len / 2, y: -16, width: len, height: 32, rx: 7, fill: METAL(), stroke: '#B4C0CB', 'stroke-width': 2 }, g);
    E('rect', { x: -len / 2, y: -16, width: len, height: 32, rx: 7, fill: hot ? C.heat : C.water, opacity: hot ? 0.4 : 0.32 }, g);
    g.ps = [];
    for (let i = 0; i < n; i++) g.ps.push({ el: E('circle', { cx: -len / 2 + (i + 0.5) * len / n, cy: 0, r, fill: hot ? ball(C.heat, C.heatDk) : ball(C.water, C.waterDk) }, g), x: -len / 2 + (i + 0.5) * len / n, ph: i * 1.9 });
    return g;
  }
  function pan(parent) {
    const g = G(parent);
    E('path', { d: 'M0,0 L-118,150 M0,0 L118,150', stroke: '#C9D3DC', 'stroke-width': 3 }, g);
    E('path', { d: 'M-132,150 L132,150 Q112,178 0,181 Q-112,178 -132,150 Z', fill: linGrad('#D5DEE6', '#7D8C99', true), stroke: '#E9F2F7', 'stroke-width': 2.5 }, g);
    return g;
  }
  const panL = pan(B), panR = pan(B);
  const barCold = miniBar(panL, 228, false), barHot = miniBar(panR, 276, true);
  const hotWaves = heatWaves(panR, { n: 3, h: 44, spacing: 26, width: 4 });
  const beamG = G(B);
  E('rect', { x: -ARM - 12, y: -7, width: 2 * ARM + 24, height: 14, rx: 7, fill: linGrad('#D5DEE6', '#8E9CA9', true), stroke: '#B9C6D2', 'stroke-width': 2 }, beamG);
  E('line', { x1: 0, y1: 0, x2: 0, y2: -52, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, beamG);
  E('circle', { r: 11, fill: '#3E4954', stroke: '#D5DEE6', 'stroke-width': 3 }, beamG);
  const lCold = T(B, 330, 548, 'cold', { size: 32, weight: 700, anchor: 'middle', fill: C.water });
  const lHot = T(B, 870, 548, 'hot', { size: 32, weight: 700, anchor: 'middle', fill: C.heat });
  const nCold = T(B, 330, 588, '12 particles', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const nHot = T(B, 870, 588, '12 particles', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const chMass = G(B); { const c = chip(chMass, 'same mass', { size: 32, fill: 'rgba(86,214,155,0.16)', stroke: C.good }); const tk = tick(chMass, 13); tr(tk, c.w / 2 + 26, -2); }
  tr(chMass, 430, 180);
  const chSame = chip(B, 'same particles', { size: 32, fill: C.card2, stroke: C.line }); tr(chSame, 800, 180);
  const volG = G(B);
  const volA = arrow(volG, 1072, 520, 1072, 330, { color: C.good, width: 12, head: 34 });
  T(volG, 1072, 306, 'volume', { size: 32, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= C. gases expand most, solids least ================= */
  const Cg = G(root);
  const ordHead = T(Cg, 470, 164, 'how much each expands when heated', { size: 28, weight: 600, fill: C.muted });
  const ROWS = [
    { y: 250, state: 'gas', label: 'gas', len: 540, tail: 'most', n: 9, e: 0.6 },
    { y: 420, state: 'liquid', label: 'liquid', len: 280, tail: '', n: 14, e: 0.5 },
    { y: 590, state: 'solid', label: 'solid', len: 80, tail: 'least', n: 15, e: 0.35 },
  ].map((r, i) => {
    const g = G(Cg);
    const box = particleBox(g, 150, 100, { n: r.n, r: 10, color: C.heat, dark: C.heatDk, seed: 30 + i, state: r.state }); tr(box, 112, r.y - 50);
    T(g, 296, r.y + 12, r.label, { size: 36, weight: 700 });
    const a = arrow(g, 470, r.y, 470 + r.len, r.y, { color: C.heat, width: 16, head: 40 });
    if (r.tail) T(g, 470 + r.len + 26, r.y + 11, r.tail, { size: 32, weight: 700, fill: C.heat });
    return Object.assign(r, { g, box, a });
  });
  const tight = T(Cg, 470, 652, 'its particles are held together most tightly', { size: 26, weight: 600, fill: C.energyLt });
  const tightRing = E('rect', { x: 92, y: 520, width: 190, height: 140, rx: 18, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, Cg);

  /* ================= D. expansion pushes with enormous forces ================= */
  const Dg = G(root);
  function brickWall(parent, x, y, w, h) {
    const g = G(parent);
    E('rect', { x, y, width: w, height: h, rx: 4, fill: '#A65440', stroke: '#D08A72', 'stroke-width': 2 }, g);
    let d = '';
    for (let yy = y + 30; yy < y + h; yy += 30) d += `M${x},${yy} L${x + w},${yy} `;
    for (let k = 0; k * 30 < h; k++) { const y0 = y + k * 30, off = k % 2 ? 25 : 50; for (let xx = x + off; xx < x + w; xx += 50) d += `M${xx},${y0} L${xx},${Math.min(y + h, y0 + 30)} `; }
    E('path', { d, stroke: '#E6B8A3', 'stroke-width': 2.5, opacity: 0.55, fill: 'none' }, g);
    return g;
  }
  brickWall(Dg, 150, 250, 100, 360); brickWall(Dg, 950, 250, 100, 360);
  const FY = 440;
  const fBar = E('path', { fill: 'none', stroke: '#5E6B78', 'stroke-width': 46 }, Dg);
  const fBarIn = E('path', { fill: 'none', stroke: '#A9B6C2', 'stroke-width': 28 }, Dg);
  const fHot = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 46 }, Dg);
  const fWaves = [400, 600, 800].map((x, i) => { const h = heatWaves(Dg, { n: 3, h: 70, spacing: 22, width: 4 }); return { h, x, i }; });
  const crack = E('path', { d: 'M250,372 L236,394 L247,412 L231,436 L243,452 L229,480 M950,372 L964,394 L953,412 L969,436 L957,452 L971,480', fill: 'none', stroke: '#2A1209', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Dg);
  const fArL = arrow(Dg, 450, 540, 262, 540, { color: C.bad, width: 16, head: 44 });
  const fArR = arrow(Dg, 750, 540, 938, 540, { color: C.bad, width: 16, head: 44 });
  const fTitle = T(Dg, 600, 196, 'enormous forces', { size: 52, weight: 700, anchor: 'middle', fill: C.bad });
  const fPlan = chip(Dg, 'engineers must plan for it', { size: 30, fill: C.card2, stroke: C.line }); tr(fPlan, 600, 650);

  /* ================= E. bridge joints and railway gaps on a hot day ================= */
  const Eg = G(root);
  const sunE = sun(Eg, 42); tr(sunE, 1088, 168);
  const hotDay = T(Eg, 1088, 268, 'hot day', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD24A' });
  const BJ = G(Eg); tr(BJ, 465, 240);
  const roadL = E('rect', { y: -75, height: 150, fill: '#3E4A55', stroke: '#7F8E9B', 'stroke-width': 3 }, BJ);
  const roadR = E('rect', { y: -75, height: 150, fill: '#3E4A55', stroke: '#7F8E9B', 'stroke-width': 3 }, BJ);
  const plateL = E('path', { fill: linGrad('#C9D3DC', '#8796A4', true), stroke: '#E1E8EE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, BJ);
  const plateR = E('path', { fill: linGrad('#C9D3DC', '#8796A4', true), stroke: '#E1E8EE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, BJ);
  const laneL = E('line', { y1: 0, y2: 0, stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-dasharray': '34 22', opacity: 0.75 }, BJ);
  const laneR = E('line', { y1: 0, y2: 0, stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-dasharray': '34 22', opacity: 0.75 }, BJ);
  const bjLabel = G(Eg);
  { const ic = G(bjLabel); tr(ic, 285, 352);
    E('rect', { x: -46, y: -14, width: 92, height: 9, rx: 3, fill: '#C9D3DC' }, ic);
    E('path', { d: 'M-28,-5 L-28,14 M28,-5 L28,14', stroke: '#C9D3DC', 'stroke-width': 7 }, ic);
    E('path', { d: 'M-50,16 Q-38,10 -26,16 T-2,16 T22,16 T46,16', fill: 'none', stroke: C.water, 'stroke-width': 3 }, ic);
    E('circle', { cx: 0, cy: -10, r: 6, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, ic);
    T(bjLabel, 350, 364, 'bridge expansion joint', { size: 28, weight: 600 }); }
  /* one plate's steel comb: base strip from edge-dir*26, fingers reaching to edge+dir*TL on alternate bands */
  function comb(edge, dir, teethOn) {
    const TL = 50, BW = 150 / 8, Y0 = -75, base = edge - dir * 26;
    let d = `M${base.toFixed(1)},${Y0} L${edge.toFixed(1)},${Y0}`;
    for (let k = 0; k < 8; k++) {
      const y0 = Y0 + k * BW, y1 = y0 + BW;
      if (teethOn(k)) d += ` L${edge.toFixed(1)},${(y0 + 3).toFixed(1)} L${(edge + dir * TL).toFixed(1)},${(y0 + 3).toFixed(1)} L${(edge + dir * TL).toFixed(1)},${(y1 - 3).toFixed(1)} L${edge.toFixed(1)},${(y1 - 3).toFixed(1)}`;
      d += ` L${edge.toFixed(1)},${y1.toFixed(1)}`;
    }
    return d + ` L${base.toFixed(1)},${-Y0} Z`;
  }
  const RA = 458, RB = 606, SLP = [];
  for (let x = 140; x <= 880; x += 37) SLP.push(x);
  const railCol = '#C9D3DC';
  const trackA = G(Eg);
  SLP.forEach(x => E('rect', { x: x - 7, y: RA - 30, width: 14, height: 60, rx: 3, fill: '#7A5A3A', stroke: '#A07A52', 'stroke-width': 1.5 }, trackA));
  const SEGS = [[130, 370], [380, 620], [630, 880]];
  const segEls = SEGS.map(([a, b]) => [-15, 15].map(off => E('line', { x1: a, x2: b, y1: RA + off, y2: RA + off, stroke: railCol, 'stroke-width': 7 }, trackA)));
  const gapRings = [375, 625].map(x => E('circle', { cx: x, cy: RA, r: 30, fill: 'none', stroke: C.energy, 'stroke-width': 3.5, 'stroke-dasharray': '7 6' }, trackA));
  const lblA = T(Eg, 130, 416, 'rails with small gaps', { size: 28, weight: 600 });
  const tickA = tick(Eg, 22); tr(tickA, 938, RA);
  const trackB = G(Eg);
  const slB = SLP.map(() => E('rect', { x: -7, y: -30, width: 14, height: 60, rx: 3, fill: '#7A5A3A', stroke: '#A07A52', 'stroke-width': 1.5 }, trackB));
  const railB = [-15, 15].map(() => E('path', { fill: 'none', stroke: railCol, 'stroke-width': 7, 'stroke-linejoin': 'round' }, trackB));
  const lblB = T(Eg, 130, 564, 'no gaps', { size: 28, weight: 600 });
  const crossB = cross(Eg, 20); tr(crossB, 938, RB);
  const bucklesT = T(Eg, 972, RB + 11, 'buckles!', { size: 32, weight: 700, fill: C.bad });
  const kink = (x, a) => a * Math.sin(TAU * (x - 505) / 300) * Math.exp(-Math.pow((x - 505) / 125, 2));
  const kinkD = (x, a) => (kink(x + 1, a) - kink(x - 1, a)) / 2;

  /* ================= F. power lines: loose in summer, tighter in winter ================= */
  const Fg = G(root);
  const GROUND = 652, PYX = [170, 600, 1030], PTOP = 330;
  E('rect', { x: 40, y: GROUND, width: 1120, height: 8, rx: 4, fill: '#3E6B4A' }, Fg);
  function pylon(parent, x) {
    const g = G(parent), yb = GROUND, yt = PTOP;
    const lx = y => lerp(x - 48, x - 12, (yb - y) / (yb - yt)), rx = y => lerp(x + 48, x + 12, (yb - y) / (yb - yt));
    let d = `M${x - 48},${yb} L${x - 12},${yt} L${x + 12},${yt} L${x + 48},${yb}`;
    const lv = [yb, 560, 480, 410, 360, yt];
    for (let i = 0; i < lv.length - 1; i++) { const a = lv[i], b = lv[i + 1]; d += ` M${lx(a).toFixed(1)},${a} L${rx(b).toFixed(1)},${b} M${rx(a).toFixed(1)},${a} L${lx(b).toFixed(1)},${b} M${lx(b).toFixed(1)},${b} L${rx(b).toFixed(1)},${b}`; }
    d += ` M${x - 56},362 L${x + 56},362 M${x - 56},432 L${x + 56},432 M${x},${yt} L${x},${yt - 18}`;
    E('path', { d, fill: 'none', stroke: '#B9C6D2', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    [[-52, 362], [52, 362], [-52, 432], [52, 432]].forEach(([dx, y]) => E('rect', { x: x + dx - 4, y, width: 8, height: 18, rx: 3, fill: '#8FB0C2' }, g));
    return g;
  }
  PYX.forEach(x => pylon(Fg, x));
  const SPANS = [[30, 118], [222, 548], [652, 978], [1082, 1170]];
  const wires = [];
  SPANS.forEach(([x0, x1], si) => [380, 450].forEach(y => wires.push({ el: E('path', { fill: 'none', stroke: '#2B3A44', 'stroke-width': 5, 'stroke-linecap': 'round' }, Fg), x0, x1, y, part: si === 0 ? 'left' : si === 3 ? 'right' : 'full' })));
  wires.forEach(w => { w.hi = E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }, Fg); });
  const sunF = sun(Fg, 38); tr(sunF, 1080, 160);
  const flakeF = G(Fg); tr(flakeF, 1080, 160); E('circle', { r: 80, fill: glow('#9FD8FF') }, flakeF); snowflake(flakeF, 40);
  const seasonS = T(Fg, 1080, 262, 'summer', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD24A' });
  const seasonW = T(Fg, 1080, 262, 'winter', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
  const snow = G(Fg), snr = rng(83), flakes = [];
  for (let i = 0; i < 34; i++) flakes.push({ el: E('circle', { r: 2.5 + snr() * 3, fill: '#EAF6FF' }, snow), x: snr() * 1200, y: snr() * 760, sp: 40 + snr() * 40, ph: snr() * TAU });
  const chLoose = chip(Fg, 'hung slightly loose', { size: 30, fill: C.card2, stroke: C.line }); tr(chLoose, 560, 190);
  const chWinter = chip(Fg, 'winter: they contract and tighten', { size: 30, fill: C.card2, stroke: C.air }); tr(chWinter, 560, 190);
  const noSnap = G(Fg); { const tk = tick(noSnap, 18); tr(tk, 0, 0); T(noSnap, 32, 11, 'no snapping', { size: 30, weight: 700, fill: C.good }); }
  tr(noSnap, 300, 560);

  /* ================= G. the bimetallic strip ================= */
  const Gg = G(root);
  const SX0 = 280, SY0 = 470, SL = 520, STH = 16, SBENCH = 712;
  E('rect', { x: 120, y: SBENCH, width: 960, height: 6, rx: 3, fill: C.line }, Gg);
  stand(Gg, 243, SY0 - 30, SBENCH);
  const burnG = bunsen(Gg, 0.85); tr(burnG, 520, SBENCH - 18 * 0.85);
  const steelP = E('path', { fill: linGrad(STEEL[0], STEEL[1], true), stroke: '#E1E8EE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, Gg);
  const brassP = E('path', { fill: linGrad(BRASS[0], BRASS[1], true), stroke: '#F3D27E', 'stroke-width': 2, 'stroke-linejoin': 'round' }, Gg);
  const hotStrip = E('path', { fill: C.heat }, Gg);
  clampBlock(Gg, 248, SY0, 64, 70);
  const sTitle = T(Gg, 600, 176, 'bimetallic strip', { size: 52, weight: 700, anchor: 'middle' });
  const sSub = T(Gg, 600, 224, 'two metals joined together', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const lSteel = labelLine(Gg, 372, 398, 410, SY0 - 8, 'steel', { size: 30, fill: STEEL[0] });
  const lBrass = labelLine(Gg, 372, 556, 410, SY0 + 8, 'brass', { size: 30, fill: BRASS[0] });
  const exG = G(Gg);
  const exSteel = arrow(exG, 816, SY0 - 8, 866, SY0 - 8, { color: STEEL[0], width: 7, head: 22 });
  const exBrass = arrow(exG, 816, SY0 + 8, 986, SY0 + 8, { color: BRASS[0], width: 7, head: 22 });
  const exT1 = T(exG, 816, SY0 - 30, 'expands less', { size: 28, weight: 700, fill: STEEL[0] });
  const exT2 = T(exG, 816, SY0 + 56, 'expands more', { size: 28, weight: 700, fill: BRASS[0] });
  const bendsT = T(Gg, 930, 420, 'it bends!', { size: 40, weight: 700, anchor: 'middle', fill: C.heat });

  /* ================= H. a thermostat ================= */
  const Hg = G(root);
  const hTitle = T(Hg, 600, 168, 'thermostat', { size: 52, weight: 700, anchor: 'middle' });
  const cellH = cellSym(Hg); tr(cellH, 450, 260);
  const TX0 = 345, TY0 = 600, TL = 360, TTH = 8;
  const wA = wire(Hg, [[408, 260], [190, 260], [190, TY0], [318, TY0]], { spacing: 44 });
  const wB = wire(Hg, [[690, 640], [690, 682], [930, 682], [930, 495]], { spacing: 44 });
  const wC = wire(Hg, [[930, 365], [930, 260], [492, 260]], { spacing: 44 });
  E('rect', { x: 680, y: TY0 + TTH, width: 20, height: 640 - TY0 - TTH, rx: 3, fill: '#C9D3DC', stroke: '#E9F2F7', 'stroke-width': 2 }, Hg);
  const tSteel = E('path', { fill: linGrad(STEEL[0], STEEL[1], true), stroke: '#E1E8EE', 'stroke-width': 1.5 }, Hg);
  const tBrass = E('path', { fill: linGrad(BRASS[0], BRASS[1], true), stroke: '#F3D27E', 'stroke-width': 1.5 }, Hg);
  clampBlock(Hg, 332, TY0, 34, 46);
  const tSpark = spark(Hg, 16, { seed: 4 });
  const heater = G(Hg); tr(heater, 930, 430);
  E('rect', { x: -58, y: -66, width: 116, height: 132, rx: 14, fill: '#26343F', stroke: '#9DB0BF', 'stroke-width': 3 }, heater);
  const finsOff = G(heater), finsOn = G(heater);
  for (let i = 0; i < 5; i++) {
    const x = -44 + i * 22;
    E('rect', { x: x - 7, y: -54, width: 14, height: 108, rx: 7, fill: '#6B7A88' }, finsOff);
    E('rect', { x: x - 7, y: -54, width: 14, height: 108, rx: 7, fill: ball('#FFB36B', C.heatDk) }, finsOn);
  }
  const heatGlow = E('circle', { r: 120, fill: glow(C.heat) }, heater); heater.insertBefore(heatGlow, heater.firstChild);
  const hWaves = heatWaves(Hg, { n: 3, h: 90, spacing: 24 }); tr(hWaves, 1046, 470);
  const chOn = chip(Hg, 'heater on', { size: 28, fill: 'rgba(255,138,61,0.18)', stroke: C.heat }); tr(chOn, 1046, 556);
  const chOff = chip(Hg, 'heater off', { size: 28, fill: C.card2, stroke: C.line, color: C.muted }); tr(chOff, 1046, 556);
  const roomG = G(Hg); tr(roomG, 1010, 182);
  const roomTh = thermometer(roomG, 90, C.bad); tr(roomTh, -96, 26, 0.8);
  const roomT = T(roomG, -60, 12, 'room 17 °C', { size: 30, weight: 700 });
  const warmT = T(roomG, -60, 48, 'warm enough', { size: 26, weight: 700, fill: C.good });
  const stripLbl = T(Hg, 525, 548, 'bimetallic strip', { size: 28, weight: 600, anchor: 'middle', fill: BRASS[0] });
  const contactLbl = T(Hg, 712, 650, 'contact', { size: 26, weight: 600, fill: C.muted });

  /* ================= I. a liquid-in-glass thermometer ================= */
  const Ig = G(root);
  const iTitle = T(Ig, 600, 172, 'liquid-in-glass thermometer', { size: 46, weight: 700, anchor: 'middle' });
  const iBeaker = beaker(Ig, 170, 140, { level: 0.82, liquid: C.water, marks: false }); tr(iBeaker, 600, 616);
  const iSteam = heatWaves(Ig, { n: 2, h: 60, spacing: 116, width: 4 }); tr(iSteam, 600, 538);
  const iWarm = T(Ig, 712, 640, 'warm water', { size: 26, weight: 600, fill: C.heat });
  const iTh = glassTherm(Ig, 360, { sw: 40, rb: 26, bore: 9 });
  const iTicks = G(iTh);
  for (let k = 0; k <= 10; k++) E('line', { x1: 7, x2: k % 5 ? 15 : 19, y1: -80 - k * 24, y2: -80 - k * 24, stroke: '#CFE7F5', 'stroke-width': 2.5 }, iTicks);
  const iUp = arrow(Ig, 680, 0, 680, -70, { color: C.heat, width: 8, head: 24 });
  const iLbl = T(Ig, 705, 0, 'the liquid expands', { size: 30, weight: 700, fill: C.heat });

  return t => {
    const tA = S.first - 0.25, tB = at('mass') - 0.1, tC = at('order') - 0.1, tD = at('force') - 0.1, tE = at('gaps') - 0.1;
    const tF = at('wires') - 0.1, tG = at('strip') - 0.1, tH = at('thermostat') - 0.1, tI = at('useful') - 0.1;
    const aA = beat(t, tA, tB + 0.35), aB = beat(t, tB, tC + 0.35), aC = beat(t, tC, tD + 0.35), aD = beat(t, tD, tE + 0.35);
    const aE = beat(t, tE, tF + 0.35), aF = beat(t, tF, tG + 0.35), aG = beat(t, tG, tH + 0.35), aH = beat(t, tH, tI + 0.35), aI = P(t, tI, 0.45, linear);
    op(A, aA); op(B, aB); op(Cg, aC); op(Dg, aD); op(Eg, aE); op(Fg, aF); op(Gg, aG); op(Hg, aH); op(Ig, aI);

    /* --- A: heat, expand, cool, contract --- */
    if (aA > 0) {
      const H1 = 0.6 * P(t, at('apart') + 0.4, 3.8, ease) + 0.4 * P(t, at('bigger') + 0.1, 2.4, ease);
      const cool = P(t, at('shrink') + 0.1, 2.2, ease), H = H1 * (1 - cool);
      const Cd = P(t, at('shrink') + 0.6, 3.0, ease);
      const len = L0 * (1 + 0.15 * H - 0.1 * Cd);
      const lit = t >= at('apart') + 0.15 && t < at('shrink') + 0.05;
      burner.set(lit ? 'blue' : 'off'); burner.upd(t); op(burner, 1 - P(t, at('shrink') + 0.3, 0.5, linear));
      attr(body, 'width', len); attr(hotO, 'width', len); attr(coldO, 'width', len); attr(shine, 'width', len - 24);
      op(hotO, 0.42 * H); op(coldO, 0.32 * Cd);
      const spacing = (len - 20) / NP;
      parts.forEach((p, i) => {
        const hi = clamp(H * 1.45 - 0.45 * i / (NP - 1));
        const amp = (1.3 + 6.5 * hi) * (1 - 0.7 * Cd) * calm;
        tr(p.g, BX0 + 20 + (i + 0.5) * spacing + Math.sin(t * 19 + p.ph) * amp, BY + Math.cos(t * 23 + p.ph * 1.7) * amp * 0.8);
        op(p.hot, hi); op(p.cold, Cd); op(p.vib, clamp(hi * 1.4 - 0.35));
      });
      op(outline, P(t, at('apart') + 0.1, 0.5, linear));
      op(outLbl, win(t, mid('bigger', 0.15), at('mass'), 0.4));
      op(chVib, win(t, mid('apart', 0.4), at('bigger') + 0.2, 0.35));
      op(chApart, win(t, mid('apart', 0.72), at('bigger') + 0.2, 0.35));
      chArrow.set(P(t, mid('apart', 0.6), 0.5)); op(chArrow, win(t, mid('apart', 0.6), at('bigger') + 0.2, 0.35));
      const ep = P(t, mid('bigger', 0.6), 0.6, pop);
      op(tExp, clamp(ep * 2) * (1 - P(t, at('shrink') + 0.1, 0.4, linear)));
      tExp.setAttribute('transform', `translate(600 198) scale(${(0.85 + 0.15 * ep).toFixed(3)}) translate(-600 -198)`);
      const cp = P(t, mid('shrink', 0.7), 0.6, pop);
      op(tCon, clamp(cp * 2));
      tCon.setAttribute('transform', `translate(600 198) scale(${(0.85 + 0.15 * cp).toFixed(3)}) translate(-600 -198)`);
      const xr = BX0 + len, xo = BX0 + L0 + 6, Y = BY - BH / 2 - 26;
      const longOn = win(t, at('bigger') + 0.15, at('shrink') + 0.6, 0.3), shortOn = P(t, mid('shrink', 0.55), 0.4, linear);
      const dimOn = Math.max(longOn * clamp((xr - xo) / 18), shortOn * clamp((xo - xr) / 18));
      op(dimG, dimOn);
      if (dimOn > 0) {
        const a = Math.min(xr, xo), b = Math.max(xr, xo), longer = xr > xo;
        dimP.setAttribute('d', `M${a.toFixed(1)},${Y + 11} L${a.toFixed(1)},${Y} L${b.toFixed(1)},${Y} L${b.toFixed(1)},${Y + 11}`);
        dimP.setAttribute('stroke', longer ? C.heat : C.water);
        op(dimLong, longer ? 1 : 0); op(dimShort, longer ? 0 : 1);
        const tx = longer ? (a + b) / 2 : Math.min((a + b) / 2, 1130);
        attr(dimLong, 'x', tx); attr(dimLong, 'y', Y - 13); attr(dimShort, 'x', tx); attr(dimShort, 'y', Y - 13);
      }
      const fp = P(t, at('shrink') + 0.25, 0.6, pop);
      op(frost, clamp(fp * 2)); tr(frost, 360, 486, Math.max(0.01, 0.7 + 0.3 * fp)); tr(flake, 0, 0, 1, (t * 12 * calm) % 360);
    }

    /* --- B: the balance --- */
    if (aB > 0) {
      const tL = mid('mass', 0.03), tR = mid('mass', 0.1);
      const dL = P(t, tL, 0.5, easeOut), dR = P(t, tR, 0.5, easeOut);
      let th = -7 * P(t, tL + 0.35, 0.45) + 7 * P(t, tR + 0.35, 0.55);
      const since = t - (tR + 0.9);
      if (since > 0) th += 2.2 * Math.sin(since * 7) * Math.exp(-since * 2.4);
      tr(beamG, PV[0], PV[1], 1, th);
      const rad = th * Math.PI / 180;
      tr(panL, PV[0] - ARM * Math.cos(rad), PV[1] - ARM * Math.sin(rad));
      tr(panR, PV[0] + ARM * Math.cos(rad), PV[1] + ARM * Math.sin(rad));
      tr(barCold, 0, 134 - (1 - dL) * 110); op(barCold, clamp(dL * 3));
      tr(barHot, 0, 134 - (1 - dR) * 110); op(barHot, clamp(dR * 3));
      barHot.ps.forEach(p => attr(p.el, 'cx', p.x + Math.sin(t * 17 + p.ph) * 1.8 * calm));
      tr(hotWaves, 0, 112); hotWaves.upd(t); op(hotWaves, 0.8 * dR);
      op(lCold, P(t, tL + 0.2, 0.4, linear)); op(lHot, P(t, tR + 0.2, 0.4, linear));
      const pm = P(t, mid('mass', 0.15), 0.5, pop); op(chMass, clamp(pm * 2)); tr(chMass, 430, 180, 0.85 + 0.15 * pm);
      op(nCold, P(t, mid('mass', 0.27), 0.4, linear)); op(nHot, P(t, mid('mass', 0.31), 0.4, linear));
      const ps = P(t, mid('mass', 0.34), 0.5, pop); op(chSame, clamp(ps * 2)); tr(chSame, 800, 180, 0.85 + 0.15 * ps);
      const vp = P(t, mid('mass', 0.8), 0.9, easeOut); volA.set(vp); op(volG, P(t, mid('mass', 0.8), 0.3, linear));
    }

    /* --- C: gas > liquid > solid --- */
    if (aC > 0) {
      op(ordHead, P(t, at('order'), 0.4, linear));
      ROWS.forEach((r, i) => {
        const t0 = mid('order', [0.02, 0.27, 0.42][i]);
        const p = P(t, t0, 0.5, linear);
        op(r.g, p); tr(r.g, (1 - p) * 30, 0);
        r.box.set(r.state, t * calm, r.e);
        r.a.set(P(t, t0 + 0.25, [1.4, 1.0, 0.6][i], easeOut));
      });
      const tp = P(t, mid('order', 0.55), 0.5, linear);
      op(tight, tp); op(tightRing, tp); tightRing.setAttribute('stroke-dashoffset', (-t * 14 * calm).toFixed(1));
    }

    /* --- D: a bar between walls buckles --- */
    if (aD > 0) {
      const hD = P(t, at('force') + 0.1, 1.4, ease);
      const A2 = 82 * P(t, at('force') + 0.6, 1.6, easeOut);
      const d = `M250,${FY} Q600,${(FY - 2 * A2).toFixed(1)} 950,${FY}`;
      fBar.setAttribute('d', d); fBarIn.setAttribute('d', d); fHot.setAttribute('d', d);
      op(fHot, 0.3 * hD);
      fWaves.forEach(w => { const u = (w.x - 250) / 700, y = FY - A2 * 4 * u * (1 - u) - 30; tr(w.h, w.x, y); w.h.upd(t + w.i * 0.4); op(w.h, 0.85 * hD); });
      crack.setAttribute('stroke-dashoffset', (1 - P(t, at('force') + 1.5, 0.8, linear)).toFixed(3));
      const fa = P(t, at('force') + 0.9, 0.6, easeOut); fArL.set(fa); fArR.set(fa);
      const ft = P(t, mid('force', 0.22), 0.5, pop); op(fTitle, clamp(ft * 2));
      fTitle.setAttribute('transform', `translate(600 196) scale(${(0.85 + 0.15 * ft).toFixed(3)}) translate(-600 -196)`);
      op(fPlan, P(t, mid('force', 0.62), 0.5, linear)); tr(fPlan, 600, 650 + (1 - P(t, mid('force', 0.62), 0.5, easeOut)) * 14);
    }

    /* --- E: bridge joint, rails with and without gaps --- */
    if (aE > 0) {
      const sp = P(t, at('gaps'), 0.6, pop); tr(sunE, 1088, 168, Math.max(0.01, sp)); sunE.upd(t * calm); op(hotDay, P(t, at('gaps') + 0.3, 0.4, linear));
      const pj = P(t, at('gaps'), 0.4, linear); op(BJ, pj); op(bjLabel, P(t, at('gaps') + 0.3, 0.4, linear));
      const dj = 14 * P(t, at('gaps') + 0.4, 1.5, ease);
      const xl = -40 + dj, xr = 40 - dj;
      plateL.setAttribute('d', comb(xl, 1, k => k % 2 === 0)); plateR.setAttribute('d', comb(xr, -1, k => k % 2 === 1));
      attr(roadL, 'x', -355); attr(roadL, 'width', xl - 24 + 355); attr(roadR, 'x', xr + 24); attr(roadR, 'width', 355 - xr - 24);
      const hotRail = mixC('#C9D3DC', '#FFB27A', 0.55 * P(t, mid('gaps', 0.4), 2.5, linear));
      attr(laneL, 'x1', -335); attr(laneL, 'x2', xl - 40); attr(laneR, 'x1', xr + 40); attr(laneR, 'x2', 335);
      const pa = P(t, mid('gaps', 0.3), 0.45, linear); op(trackA, pa); op(lblA, pa);
      const e = 4 * P(t, mid('gaps', 0.4), 1.4, ease);
      segEls.forEach(([r1, r2], i) => { const a = SEGS[i][0] - (i ? e : 0), b = SEGS[i][1] + (i < 2 ? e : 0); [r1, r2].forEach(r => { attr(r, 'x1', a); attr(r, 'x2', b); r.setAttribute('stroke', hotRail); }); });
      gapRings.forEach(g => op(g, win(t, mid('gaps', 0.32), mid('gaps', 0.9), 0.3)));
      const pb = P(t, mid('gaps', 0.54), 0.45, linear); op(trackB, pb); op(lblB, pb);
      const kA = 34 * P(t, mid('gaps', 0.63), 1.2, easeOut);
      SLP.forEach((x, i) => tr(slB[i], x, RB + kink(x, kA), 1, Math.atan(kinkD(x, kA)) * 180 / Math.PI));
      railB.forEach((r, j) => {
        const off = j ? 15 : -15; let d = '';
        for (let x = 130; x <= 880; x += 10) d += (x === 130 ? 'M' : 'L') + x + ',' + (RB + off + kink(x, kA)).toFixed(1);
        r.setAttribute('d', d); r.setAttribute('stroke', hotRail);
      });
      const pc = P(t, mid('gaps', 0.78), 0.4, pop); op(crossB, clamp(pc * 2)); tr(crossB, 938, RB, Math.max(0.01, pc)); op(bucklesT, P(t, mid('gaps', 0.82), 0.4, linear));
      const pt = P(t, mid('gaps', 0.9), 0.4, pop); op(tickA, clamp(pt * 2)); tr(tickA, 938, RA, Math.max(0.01, pt));
    }

    /* --- F: power lines --- */
    if (aF > 0) {
      const wn = P(t, mid('wires', 0.62), 1.1, ease);
      const sag = lerp(92, 36, wn);
      wires.forEach(w => {
        let d;
        if (w.part === 'full') d = `M${w.x0},${w.y} Q${(w.x0 + w.x1) / 2},${w.y + 2 * sag} ${w.x1},${w.y}`;
        else if (w.part === 'left') d = `M${w.x0},${w.y + sag * 0.7} Q${(w.x0 + w.x1) / 2},${w.y + sag * 0.15} ${w.x1},${w.y}`;
        else d = `M${w.x0},${w.y} Q${(w.x0 + w.x1) / 2},${w.y + sag * 0.15} ${w.x1},${w.y + sag * 0.7}`;
        w.el.setAttribute('d', d); w.hi.setAttribute('d', d);
      });
      sunF.upd(t * calm); op(sunF, 1 - wn); op(seasonS, 1 - wn);
      op(flakeF, wn); op(seasonW, wn); flakeF.lastChild.setAttribute('transform', `rotate(${((t * 12 * calm) % 360).toFixed(1)})`);
      op(snow, wn);
      if (wn > 0) flakes.forEach(f => { attr(f.el, 'cx', (f.x + Math.sin(t * 1.3 + f.ph) * 14 + 1200) % 1200); attr(f.el, 'cy', (f.y + t * f.sp * calm) % 760); });
      op(chLoose, win(t, mid('wires', 0.26), mid('wires', 0.68), 0.35));
      op(chWinter, P(t, mid('wires', 0.68), 0.4, linear));
      const ns = P(t, mid('wires', 0.86), 0.5, pop); op(noSnap, clamp(ns * 2)); tr(noSnap, 300, 560, 0.85 + 0.15 * ns);
    }

    /* --- G: bimetallic strip bends --- */
    if (aG > 0) {
      const heatOn = t >= mid('strip', 0.77);
      burnG.set(heatOn ? 'blue' : 'off'); burnG.upd(t);
      op(burnG, P(t, mid('strip', 0.66), 0.4, linear));
      const bend = P(t, mid('strip', 0.8), 2.0, ease);
      const sp = stripPaths(SX0, SY0, SL, bend * 0.75 / SL, STH);
      steelP.setAttribute('d', sp.steel); brassP.setAttribute('d', sp.brass);
      hotStrip.setAttribute('d', sp.steel + sp.brass); op(hotStrip, 0.35 * bend);
      const ps = P(t, at('strip'), 0.5, linear);
      op(sTitle, ps); op(sSub, P(t, mid('strip', 0.2), 0.4, linear));
      lSteel.set(P(t, mid('strip', 0.24), 0.4, linear)); lBrass.set(P(t, mid('strip', 0.3), 0.4, linear));
      const ex = win(t, mid('strip', 0.44), mid('strip', 0.86), 0.3);
      op(exG, ex); exSteel.set(P(t, mid('strip', 0.46), 0.5)); exBrass.set(P(t, mid('strip', 0.48), 1.0));
      op(exT1, P(t, mid('strip', 0.5), 0.3, linear)); op(exT2, P(t, mid('strip', 0.56), 0.3, linear));
      op(bendsT, P(t, mid('strip', 0.93), 0.4, linear));
    }

    /* --- H: thermostat switches the heater off --- */
    if (aH > 0) {
      const tOff = mid('thermostat', 0.7);
      const open = P(t, tOff, 0.4, easeOut);
      const k = open * (2 * 36 / (TL * TL));
      const sp = stripPaths(TX0, TY0, TL, k, TTH);
      tSteel.setAttribute('d', sp.steel); tBrass.setAttribute('d', sp.brass);
      const on = 1 - open;
      const flow = t < tOff ? t : tOff;
      [wA, wB, wC].forEach(w => { w.upd(flow * calm + 0.0001, 70); w.set(on); });
      op(finsOn, on); op(heatGlow, 0.55 * on); hWaves.upd(t); op(hWaves, on * 0.9);
      op(chOn, on); op(chOff, open);
      const sk = win(t, tOff, tOff + 0.5, 0.15); op(tSpark, sk); tr(tSpark, 690, 612, 0.6 + 0.6 * sk); tSpark.upd(t);
      const warm = P(t, at('thermostat') + 0.3, tOff - at('thermostat') - 0.3, linear);
      roomTh.set(0.25 + 0.5 * warm); setText(roomT, 'room ' + Math.round(17 + 4 * warm) + ' °C');
      op(warmT, P(t, tOff - 0.1, 0.4, linear));
      op(hTitle, P(t, mid('thermostat', 0.32), 0.5, linear));
      op(stripLbl, P(t, mid('thermostat', 0.08), 0.4, linear)); op(contactLbl, P(t, mid('thermostat', 0.14), 0.4, linear));
    }

    /* --- I: a thermometer rises (handoff) --- */
    if (aI > 0) {
      const sl = P(t, at('useful'), 0.8, easeOut);
      tr(iTh, 600, 612 - (1 - sl) * 60); op(iTh, sl);
      op(iTitle, P(t, mid('useful', 0.36), 0.5, linear));
      op(iBeaker, P(t, at('useful'), 0.4, linear)); iSteam.upd(t); op(iSteam, 0.8 * P(t, at('useful') + 0.3, 0.5, linear));
      op(iWarm, P(t, at('useful') + 0.3, 0.4, linear));
      const rise = P(t, mid('useful', 0.25), 2.2, ease);
      const y = lerp(-110, -300, rise);
      iTh.set(y);
      const ly = 612 + y;
      iUp.setAttribute('transform', `translate(0 ${(ly + 60).toFixed(1)})`); iUp.set(P(t, mid('useful', 0.3), 0.6));
      op(iUp, P(t, mid('useful', 0.28), 0.3, linear));
      attr(iLbl, 'y', (ly + 20).toFixed(1)); op(iLbl, P(t, mid('useful', 0.4), 0.4, linear));
    }
  };
});

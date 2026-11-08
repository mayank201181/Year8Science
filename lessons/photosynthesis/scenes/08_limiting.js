/* Chapter 8, Limiting factors: what sets the speed.
   Three supply meters feed a rate gauge, and the shortest one caps it -> raise it and the rate rises; raise
   another and nothing changes -> the three factors as big icons -> Light Cools Things -> a rate-against-light
   graph beside small meters: the curve rises, then bends into a plateau as CO2 takes over the cap (showpiece)
   -> "the plant is full" crossed out -> the same shape for CO2, with normal air on the slope -> temperature:
   enzymes speed it up, then denature past 40-45 °C and the rate crashes -> a greenhouse switching on lamps,
   CO2 and a heater -> pondweed bubbling on a sunny windowsill, fading to nothing in the dark. */
scene('limiting', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const idle = t => t * calm;

  /* ---------- local helpers ---------- */
  const rgb = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const mix = (a, b, p) => { const x = rgb(a), y = rgb(b), q = clamp(p); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * q)).join(',')})`; };
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const softmin = (a, b, e) => (a + b - Math.sqrt((a - b) * (a - b) + e * e)) / 2;
  /* pop an element in at (x, y): fades and grows from 0.6 */
  const popAt = (el, x, y, t0, t, s) => { const k = P(t, t0, 0.5, pop); op(el, clamp(k * 2)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * k))); return k; };
  /* a row of words centred on x, each with a bold first letter */
  function wordRow(parent, x, y, words, size, iniFill) {
    const gap = size * 0.3, ws = words.map(w => textWidth(w, size, FD, 700));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
    let cx = x - total / 2;
    return words.map((w, i) => {
      const xc = cx + ws[i] / 2; cx += ws[i] + gap;
      return { el: T(parent, xc, y, `**${w[0]}**${w.slice(1)}`, { size, weight: 700, anchor: 'middle', boldFill: iniFill }), x: xc };
    });
  }
  /* vertical supply gauge, origin at its top centre. g.set(v 0..1); g.lim(p 0..1) turns on the red
     "limiting" glow; g.topY(v) is the local y of the bar's top at level v */
  function gauge(parent, w, h, color) {
    const g = G(parent);
    g.halo = E('ellipse', { cx: 0, cy: h / 2, rx: w * 1.5, ry: h * 0.66, fill: glow(C.bad) }, g);
    g.ring = E('rect', { x: -w / 2 - 9, y: -9, width: w + 18, height: h + 18, rx: (w + 18) / 2, fill: 'none', stroke: C.bad, 'stroke-width': 4 }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: w / 2, fill: '#0B2230', stroke: C.line, 'stroke-width': 3 }, g);
    const pad = 6, bw = w - pad * 2;
    const bar = E('rect', { x: -bw / 2, width: bw, rx: bw / 2, fill: color }, g);
    g.topY = v => h - pad - Math.max(bw, (h - pad * 2) * clamp(v));
    g.set = v => { const y = g.topY(v); attr(bar, 'y', y); attr(bar, 'height', h - pad - y); };
    g.lim = p => { op(g.halo, p * 0.55); op(g.ring, p); bar.setAttribute('fill', mix(color, C.bad, p * 0.7)); };
    g.set(0); g.lim(0);
    return g;
  }
  /* an up arrow beside a meter, drawn progressively */
  const upArrow = (parent, x, y0, y1, color) => arrow(parent, x, y0, x, y1, { color: color || C.good, width: 6 });

  const FCOL = [C.energy, C.co2, C.heat];

  /* ================= A. three supply meters feeding a rate gauge ================= */
  const A = G(root);
  const MX = [200, 340, 480], MT = 205, MH = 290, MW = 62;
  const capLine = E('line', { stroke: C.bad, 'stroke-width': 4, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, A);
  const meters = MX.map((x, i) => { const m = gauge(A, MW, MH, FCOL[i]); tr(m, x, MT); return m; });
  const mLabs = ['light', 'CO₂', 'temperature'].map((s, i) => T(A, MX[i], MT + MH + 48, s, { size: 30, weight: 600, anchor: 'middle' }));
  const RX = 860, RW = 112;
  const rateG = G(A);
  const rate = gauge(rateG, RW, MH, C.plant); tr(rate, RX, MT);
  T(rateG, RX, MT - 30, 'rate of photosynthesis', { size: 30, weight: 700, anchor: 'middle', fill: C.plant });
  const feed = arrow(A, 556, MT + 74, 772, MT + 74, { color: C.muted, width: 6 });
  const limChip = chip(A, 'limiting factor', { size: 30, fill: 'rgba(255,96,112,0.16)', stroke: C.bad, color: '#FFB3BA' });
  const limNote = T(A, 340, 668, 'the one in shortest supply', { size: 26, weight: 500, anchor: 'middle', fill: C.muted, font: FB });
  const heldBack = T(A, RX + RW / 2 + 24, 0, 'held back', { size: 28, weight: 700, fill: '#FFB3BA' });
  const upCO2 = upArrow(A, MX[1] + 54, MT + MH - 30, MT + MH - 150, C.good);
  const upLight = upArrow(A, MX[0] + 54, MT + MH - 30, MT + MH - 150, C.good);
  const rises = G(A); { tick(rises, 13); T(rises, 26, 10, 'rate rises', { size: 30, weight: 700, fill: C.good }); }
  const same = G(A); { T(same, 0, 10, '=', { size: 40, weight: 700, fill: C.muted, anchor: 'middle' }); T(same, 26, 10, 'no change', { size: 30, weight: 700, fill: C.muted }); }

  /* ================= B. the three factors (icons fly on from A into C) ================= */
  const B = G(root);
  const FX = [230, 600, 970];
  const names = [['Light', 'intensity'], ['Carbon dioxide', 'concentration'], ['Temperature', '']].map(([main, sub], i) => {
    const g = G(B);
    const w = textWidth(main, 40, FD, 700), wi = textWidth(main[0], 40, FD, 700);
    const halo = E('circle', { cx: FX[i] - w / 2 + wi / 2, cy: 438, r: 36, fill: glow(C.energy) }, g);
    const tx = E('text', { x: FX[i], y: 452, 'font-size': 40, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, g);
    const ini = E('tspan', {}, tx); ini.textContent = main[0];
    E('tspan', {}, tx).textContent = main.slice(1);
    if (sub) T(g, FX[i], 496, sub, { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
    return { g, halo, ini };
  });
  const lct = wordRow(B, 600, 640, ['Light', 'Cools', 'Things'], 64, C.energy);

  const icons = G(root);
  const icSun = G(icons), sunI = sun(icSun, 46);
  const icCO2 = G(icons); molCO2(icCO2, 26, { letter: true });
  const icTh = G(icons); { const th = thermometer(G(icTh), 180, C.bad); tr(th, 0, 82); th.set(0.55); }
  const ICONS = [icSun, icCO2, icTh];
  const IC_A = [[200, 140, 0.42], [340, 146, 0.44], [480, 146, 0.38]];
  const IC_B = [[230, 296, 1], [600, 296, 1.05], [970, 296, 0.95]];
  const IC_C = [[142, 214, 0.34], [248, 216, 0.36], [354, 216, 0.3]];

  /* ================= C. the rate graph (axes stay on for D) ================= */
  const panel = G(root);
  card(panel, 62, 168, 372, 436, { fill: C.card, stroke: C.line });
  const Cp = G(panel);
  const NX = [142, 248, 354], NT = 262, NH = 220, NW = 44;
  const minis = NX.map((x, i) => { const m = gauge(Cp, NW, NH, FCOL[i]); tr(m, x, NT); return m; });
  ['light', 'CO₂', 'temperature'].forEach((s, i) => T(Cp, NX[i], NT + NH + 40, s, { size: 26, weight: 600, anchor: 'middle' }));
  const limTags = NX.map(x => T(Cp, x, NT + NH + 74, 'limiting', { size: 24, weight: 700, anchor: 'middle', fill: C.bad }));

  const Gr = G(root);
  const GX = 500, GY = 590, GW = 600, GH = 390, YM = 0.62;
  const axes = E('path', { d: `M${GX},${GY - GH - 4} L${GX},${GY} L${GX + GW + 12},${GY}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Gr);
  const heads = G(Gr);
  E('path', { d: `M${GX},${GY - GH - 20} l-10,17 l20,0 Z`, fill: C.muted }, heads);
  E('path', { d: `M${GX + GW + 28},${GY} l-17,-10 l0,20 Z`, fill: C.muted }, heads);
  T(heads, GX + 22, GY - GH + 8, 'rate of photosynthesis', { size: 28, weight: 600, fill: C.ink });
  const xLabs = ['light intensity', 'carbon dioxide concentration', 'temperature (°C)'].map(s => T(Gr, GX + GW / 2, GY + 64, s, { size: 30, weight: 600, anchor: 'middle', fill: C.ink }));
  const tTicks = G(Gr);
  [0, 20, 40, 60].forEach(c => { const x = GX + c / 60 * GW; E('line', { x1: x, x2: x, y1: GY, y2: GY + 10, stroke: C.muted, 'stroke-width': 3 }, tTicks); T(tTicks, x, GY + 34, String(c), { size: 24, weight: 600, anchor: 'middle', fill: C.muted }); });
  const band = G(Gr);
  E('rect', { x: GX + 40 / 60 * GW, y: GY - GH, width: 5 / 60 * GW, height: GH, fill: 'rgba(255,96,112,0.16)' }, band);
  E('line', { x1: GX + 40 / 60 * GW, x2: GX + 40 / 60 * GW, y1: GY - GH, y2: GY, stroke: C.bad, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, band);
  E('line', { x1: GX + 45 / 60 * GW, x2: GX + 45 / 60 * GW, y1: GY - GH, y2: GY, stroke: C.bad, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, band);
  T(band, GX + 42.5 / 60 * GW, GY - GH - 14, '40–45 °C', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3BA' });

  // curves
  const CAP_L = 0.5, CAP_C = 0.55;
  const ptL = u => [GX + u * GW, GY - softmin(u, CAP_L, 0.07) / YM * GH];
  const ptC = u => [GX + u * GW, GY - softmin(u, CAP_C, 0.07) / YM * GH];
  const rT = c => { if (c <= 3) return 0; const rise = Math.pow((c - 3) / 37, 1.25); const fall = c <= 41 ? 1 : c >= 53 ? 0 : Math.pow(Math.cos((c - 41) / 12 * Math.PI / 2), 2); return rise * fall; };
  const ptT = c => [GX + c / 60 * GW, GY - rT(c) / 1.12 * GH];
  const pathTo = (fn, a, b, n) => { let d = ''; const N = Math.max(2, Math.ceil(n)); for (let k = 0; k <= N; k++) { const [x, y] = fn(lerp(a, b, k / N)); d += (k ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); } return d; };
  const decoL = G(Gr), decoC = G(Gr);
  const curveL = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Gr);
  const curveC = E('path', { fill: 'none', stroke: C.co2, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Gr);
  const curveT = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Gr);
  const headDot = E('circle', { r: 10, fill: '#ffffff', stroke: C.bg0, 'stroke-width': 3 }, Gr);
  const knobL = G(Gr), knobLs = sun(knobL, 15);
  const knobC = G(Gr); molCO2(knobC, 10);

  // light: plateau decorations
  const bendL = GX + CAP_L * GW, platL = GY - CAP_L / YM * GH;
  const shadeL = E('rect', { x: bendL, y: platL, width: GX + GW - bendL, height: GY - platL, fill: 'rgba(255,96,112,0.12)' }, decoL);
  const dashL = E('line', { x1: bendL, x2: bendL, y1: platL - 36, y2: GY, stroke: C.bad, 'stroke-width': 3, 'stroke-dasharray': '9 7' }, decoL);
  const lbRise = T(decoL, 700, 548, 'light is limiting', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const lbPlat = G(decoL);
  T(lbPlat, (bendL + GX + GW) / 2, platL + 82, 'another factor', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3BA' });
  T(lbPlat, (bendL + GX + GW) / 2, platL + 118, 'is limiting', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3BA' });
  const lbPlateau = T(decoL, (bendL + GX + GW) / 2, platL - 18, 'plateau', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const which = chip(decoL, 'CO₂ or temperature', { size: 28, fill: C.card2, stroke: C.bad });
  tr(which, (bendL + GX + GW) / 2, platL + 186);
  const bubble = G(decoL);
  E('rect', { x: 846, y: 168, width: 252, height: 62, rx: 31, fill: '#E9F1F6', stroke: '#FFFFFF', 'stroke-width': 3 }, bubble);
  E('circle', { cx: 862, cy: 244, r: 9, fill: '#E9F1F6' }, bubble);
  E('circle', { cx: 846, cy: 261, r: 5.5, fill: '#E9F1F6' }, bubble);
  T(bubble, 972, 209, 'the plant is full', { size: 28, weight: 700, anchor: 'middle', fill: C.bg0 });
  const bubStrike = strike(bubble, 874, 199, 1070, C.bad);
  const bubX = cross(decoL, 17); tr(bubX, 1128, 199);

  // carbon dioxide: normal air sits on the slope
  const airU = 0.12, airP = ptC(airU);
  const airDash = E('line', { x1: airP[0], x2: airP[0], y1: airP[1], y2: GY, stroke: C.co2, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, decoC);
  const airLab = labelLine(decoC, 650, 552, airP[0] + 6, airP[1] + 4, 'normal air', { size: 28, fill: C.co2, anchor: 'start', line: C.co2 });
  const mainLim = chip(decoC, 'often the main limiting factor', { size: 28, fill: C.card2, stroke: C.co2 });
  const ML = [880, 470];

  root.appendChild(icons);                               // the icons ride above the panel card

  /* ================= D. temperature: thermometer and an enzyme ================= */
  const Dp = G(panel);
  const thBig = thermometer(Dp, 300, C.bad); tr(thBig, 140, 532);
  const thRead = T(Dp, 140, 208, '0 °C', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const EZ = [312, 372], ER = 60, NA = -0.85;          // enzyme centre, radius, active-site direction
  const enzG = G(Dp);
  const enz = E('path', { fill: ball('#4FD1BE', '#1F8C7E'), stroke: '#A9F2E6', 'stroke-width': 3, 'stroke-linejoin': 'round' }, enzG);
  const prods = [0, 1, 2, 3].map(() => molGlucose(Dp, 9));
  const enzLab = T(Dp, EZ[0], EZ[1] + 104, 'enzymes', { size: 30, weight: 700, anchor: 'middle', fill: '#7FE3D3' });
  const enzSub = T(Dp, EZ[0], EZ[1] + 140, 'work faster', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const denLab = G(Dp);
  T(denLab, EZ[0], EZ[1] + 140, 'denature:', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB3BA' });
  T(denLab, EZ[0], EZ[1] + 174, 'shape destroyed', { size: 26, weight: 600, anchor: 'middle', fill: '#FFB3BA' });
  const ER0 = [], ER1 = [];
  for (let i = 0; i < 40; i++) {
    const a = i / 40 * TAU, d = Math.abs(Math.atan2(Math.sin(a - NA), Math.cos(a - NA)));
    const notch = d < 0.3 ? 0.42 : d < 0.48 ? lerp(0.42, 1, (d - 0.3) / 0.18) : 1;
    ER0.push(ER * notch * (1 + 0.04 * Math.sin(a * 3)));
    ER1.push(ER * (0.92 + 0.2 * Math.sin(a * 3 + 1.2) + 0.12 * Math.sin(a * 5 + 0.4) + 0.08 * Math.sin(a * 7)));
  }
  const enzPath = (k, spin) => closedPath(ER0.map((r0, i) => { const a = i / 40 * TAU + spin, r = lerp(r0, ER1[i], k); return [Math.cos(a) * r, Math.sin(a) * r]; }));

  /* ================= E. a greenhouse ================= */
  const Eg = G(root);
  E('rect', { x: 110, y: 632, width: 980, height: 30, rx: 12, fill: C.soil }, Eg);
  const ghBack = E('path', { d: 'M262,632 L262,400 L600,252 L938,400 L938,632 Z', fill: 'rgba(159,216,255,0.07)' }, Eg);
  E('rect', { x: 300, y: 606, width: 600, height: 26, rx: 6, fill: '#55392A' }, Eg);
  // lamps: cords, light cones, shades
  const LAMPS = [440, 600, 760].map(x => {
    const yr = 400 - (338 - Math.abs(x - 600)) * 148 / 338;          // where the cord meets the roof
    const g = G(Eg);
    const cone = E('path', { d: `M${x - 30},378 L${x + 30},378 L${x + 92},604 L${x - 92},604 Z`, fill: 'rgba(255,228,92,0.15)' }, g);
    E('line', { x1: x, y1: yr, x2: x, y2: 352, stroke: '#9DB0BF', 'stroke-width': 3 }, g);
    const halo = E('circle', { cx: x, cy: 376, r: 46, fill: glow(C.energy) }, g);
    E('path', { d: `M${x - 22},352 L${x + 22},352 L${x + 38},374 L${x - 38},374 Z`, fill: ball('#7D8C99', '#4A5966'), stroke: '#B9C6D2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const bulb = E('circle', { cx: x, cy: 378, r: 9, fill: '#8796A4' }, g);
    return { g, cone, halo, bulb };
  });
  // plants
  const PLANTS = [430, 540, 660, 770].map((x, k) => {
    const g = G(Eg), inner = G(g);
    E('path', { d: 'M0,0 C-4,-40 5,-80 0,-128', fill: 'none', stroke: C.stem, 'stroke-width': 7, 'stroke-linecap': 'round' }, inner);
    // small leaves: kit leaf()'s outline and colour, without the fine veins that vanish at this size
    [[-30, -150, 0.27], [-56, -30, 0.27], [-82, -150, 0.24], [-104, -30, 0.22], [-126, -95, 0.2]].forEach(([y, r, s]) => {
      const lf = G(inner, { transform: `translate(0 ${y}) rotate(${r}) scale(${s})` });
      E('path', { d: 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z', fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 3 }, lf);
      E('path', { d: 'M-10,0 L200,0', stroke: '#C9F2D3', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, lf);
    });
    const toms = [[17, -64], [-19, -88], [15, -106]].map(([x2, y2]) => {
      const tg = G(inner);
      E('circle', { cx: x2, cy: y2, r: 11, fill: ball('#FF7A45', '#C2361A'), stroke: '#FFC2A3', 'stroke-width': 1.5 }, tg);
      E('path', { d: `M${x2 - 7},${y2 - 9} L${x2},${y2 - 6} L${x2 + 7},${y2 - 9} L${x2 + 2},${y2 - 12} L${x2},${y2 - 16} L${x2 - 2},${y2 - 12} Z`, fill: '#3FA463', stroke: '#2C8C4C', 'stroke-width': 1 }, tg);
      return tg;
    });
    return { g, inner, toms, x, k };
  });
  // heater (left) and CO2 cylinder (right)
  const heater = G(Eg);
  const hGlow = E('ellipse', { cx: 312, cy: 590, rx: 80, ry: 60, fill: glow(C.heat) }, heater);
  const fins = [0, 1, 2, 3].map(i => E('rect', { x: 284 + i * 16, y: 560, width: 11, height: 68, rx: 5.5, fill: '#8796A4', stroke: '#B9C6D2', 'stroke-width': 2 }, heater));
  E('rect', { x: 280, y: 622, width: 68, height: 8, rx: 4, fill: '#5E6B78' }, heater);
  const hWaves = heatWaves(heater, { n: 3, h: 60, spacing: 18, width: 4 }); tr(hWaves, 314, 552);
  const cyl = G(Eg);
  E('rect', { x: 1010, y: 456, width: 62, height: 176, rx: 26, fill: ball('#9FB2C2', '#56687A'), stroke: '#D3DEE5', 'stroke-width': 3 }, cyl);
  E('rect', { x: 1030, y: 432, width: 22, height: 26, rx: 5, fill: '#56687A', stroke: '#D3DEE5', 'stroke-width': 2.5 }, cyl);
  T(cyl, 1041, 560, 'CO₂', { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
  E('path', { d: 'M1041,432 L1041,420 L938,420 L912,420', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cyl);
  const puffs = [0, 1, 2, 3, 4].map(() => molCO2(Eg, 9));
  // the glass and frame in front
  E('path', { d: 'M262,632 L262,400 L600,252 L938,400 L938,632', fill: 'rgba(159,216,255,0.06)', stroke: '#CFE7F5', 'stroke-width': 5, 'stroke-linejoin': 'round' }, Eg);
  E('path', { d: 'M262,400 L938,400 M398,400 L398,632 M534,400 L534,632 M666,400 L666,632 M802,400 L802,632 M398,400 L398,341 M534,400 L534,281 M666,400 L666,281 M802,400 L802,341 M600,252 L600,400', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 2.5, opacity: 0.55 }, Eg);
  E('path', { d: 'M282,470 L330,422 M282,500 L350,432 M700,318 L740,300 M708,338 L770,312', fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.16 }, Eg);
  const labLamp = labelLine(Eg, 900, 248, 778, 360, 'lamps: more light', { size: 28, fill: C.energy, anchor: 'start', line: C.energy });
  const labCO2 = T(Eg, 1041, 396, 'extra CO₂', { size: 28, weight: 700, anchor: 'middle', fill: C.co2 });
  const labHeat = labelLine(Eg, 232, 520, 290, 566, 'heater', { size: 28, fill: C.heat, anchor: 'end', line: C.heat });
  const moreFood = G(Eg);
  { const c = chip(moreFood, 'more food, faster', { size: 32, fill: 'rgba(86,214,155,0.16)', stroke: C.good }); tr(c, 600, 690); const a = arrow(moreFood, 600 - c.w / 2 - 34, 708, 600 - c.w / 2 - 34, 670, { color: C.good, width: 6 }); a.set(1); }

  /* ================= F. pondweed on a windowsill ================= */
  const Fg = G(root);
  const WIN = { x: 330, y: 118, w: 540, h: 402 };
  const winClip = E('clipPath', { id: 'clipLimitingWindow' }, defs());
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h }, winClip);
  const sky = G(Fg, { 'clip-path': 'url(#clipLimitingWindow)' });
  const daySky = E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, fill: linGrad('#6FC0EE', '#CDEEFF', true) }, sky);
  const nightSky = G(sky);
  E('rect', { x: WIN.x, y: WIN.y, width: WIN.w, height: WIN.h, fill: linGrad('#081232', '#1B2A55', true) }, nightSky);
  const stars = [], str = rng(23);
  for (let i = 0; i < 16; i++) { const x = WIN.x + 20 + str() * (WIN.w - 40), y = WIN.y + 20 + str() * 220; stars.push({ el: E('circle', { cx: x, cy: y, r: 1.6 + str() * 2.2, fill: '#EAF2FF' }, nightSky), ph: str() }); }
  const moon = G(nightSky); tr(moon, 430, 206);
  E('circle', { r: 70, fill: glow('#BFD3FF') }, moon);
  E('path', { d: 'M0,-30 A30,30 0 1 0 0,30 A20,30 0 0 1 0,-30 Z', fill: '#F3F0D8', stroke: '#FFFBE6', 'stroke-width': 2 }, moon);
  const sunW = sun(sky, 40);
  const rays = G(sky);
  [[-0.5, 0], [0, 1], [0.5, 2]].forEach(([dx]) => E('path', { d: `M${760 + dx * 40},${240} L${600 + dx * 80},${330}`, stroke: '#FFE45C', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.35 }, rays));
  E('path', { d: `M${WIN.x},${WIN.y} h${WIN.w} v${WIN.h} h${-WIN.w} Z M${WIN.x + WIN.w / 2},${WIN.y} v${WIN.h} M${WIN.x},${WIN.y + 190} h${WIN.w}`, fill: 'none', stroke: '#E4D9C6', 'stroke-width': 12, 'stroke-linejoin': 'round' }, Fg);
  E('rect', { x: 296, y: 520, width: 608, height: 22, rx: 5, fill: '#B98A5E' }, Fg);
  E('rect', { x: 308, y: 542, width: 584, height: 16, rx: 4, fill: '#7A5538' }, Fg);
  // the jar, pondweed and bubbles
  const JX = 560, JY = 396, JW = 210, JH = 248;
  const jarBack = E('rect', { x: JX - JW / 2 + 4, y: JY - JH / 2 + 20, width: JW - 8, height: JH - 22, rx: 12, fill: '#0E2C3A', opacity: 0.55 }, Fg);
  const weed = G(Fg);
  const STEMS = [[-46, 150, -6], [-6, 172, 3], [36, 158, 9]].map(([dx, len, lean], k) => {
    const g = G(weed);
    E('path', { d: `M0,0 C${lean * 0.4},${-len * 0.35} ${lean},${-len * 0.7} ${lean * 1.3},${-len}`, fill: 'none', stroke: '#2C8C4C', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    for (let j = 1; j <= 9; j++) {
      const f = j / 9.5, y = -len * f, x = lean * 1.3 * f;
      [-1, 1].forEach(s => E('ellipse', { cx: x + s * 9, cy: y, rx: 11, ry: 4, fill: ball(C.plant, C.plantDk), transform: `rotate(${s * -32} ${x + s * 9} ${y})` }, g));
    }
    return { g, x: JX + dx, y: JY + JH / 2 - 10, k };
  });
  const bub = bubbles(Fg, JX - 58, 330, 116, 150, { n: 18, r: 7, seed: 9, speed: 0.42, fill: 'rgba(255,255,255,0.35)', color: '#FFFFFF' });
  const jar = beaker(Fg, JW, JH, { level: 0.86, liquid: '#5FC4E8', opacity: 0.32, marks: false }); tr(jar, JX, JY);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: C.bg0, opacity: 0.5 }, Fg);
  const home = chip(Fg, 'Try it at home', { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy });
  tr(home, 1160 - home.w / 2, 60);
  const labO2 = labelLine(Fg, 918, 300, 614, 316, 'oxygen', { size: 30, fill: '#FF9A8F', anchor: 'start', line: '#FF9A8F' });
  const labWeed = labelLine(Fg, 918, 452, 606, 448, 'pondweed', { size: 30, fill: C.plant, anchor: 'start', line: C.plant });
  const darkChip = chip(Fg, 'in the dark: no bubbles', { size: 30, fill: C.card2, stroke: C.line });
  tr(darkChip, 600, 640);

  /* ================= update ================= */
  return t => {
    const tt = idle(t);

    /* --- A: meters and the rate gauge --- */
    const aA = Math.min(P(t, S.first - 0.5, 0.5, linear), 1 - P(t, at('three') - 0.15, 0.5, linear));
    op(A, aA);
    let lvA = [0.78, 0.3, 0.64];
    if (aA > 0) {
      const fill = P(t, at('define') + 0.3, 1.4, easeOut);
      const RL = end('rule') - at('rule');
      const co2Up = P(t, mid('rule', 0.04), RL * 0.34, ease), lightUp = P(t, mid('rule', 0.52), RL * 0.3, ease);
      lvA = [lerp(0.78, 0.95, lightUp) * fill, lerp(0.3, 0.55, co2Up) * fill, 0.64 * fill];
      meters.forEach((m, i) => {
        const k = P(t, at('define') + i * 0.15, 0.5, easeOut);
        op(m, k); tr(m, MX[i], MT + (1 - k) * 24); m.set(lvA[i]);
        op(mLabs[i], k);
      });
      const rk = P(t, mid('define', 0.26), 0.5, easeOut);
      op(rateG, rk); tr(rateG, (1 - rk) * 24, 0);
      feed.set(P(t, mid('define', 0.22), 0.6)); op(feed, P(t, mid('define', 0.22), 0.2, linear));
      const rv = Math.min(lvA[0], lvA[1], lvA[2]) * P(t, mid('define', 0.3), 1.0, easeOut);
      rate.set(rv);
      const lim = P(t, mid('define', 0.5), 0.5, linear);
      meters[1].lim(lim);
      const capY = MT + meters[1].topY(lvA[1]);
      const cl = P(t, mid('define', 0.76), 0.8);
      attr(capLine, 'x1', MX[1] - MW / 2 - 6); attr(capLine, 'x2', lerp(MX[1] - MW / 2 - 6, RX + RW / 2 + 8, cl)); attr(capLine, 'y1', capY); attr(capLine, 'y2', capY);
      op(capLine, cl > 0 ? 1 : 0);
      popAt(limChip, MX[1], 612, mid('define', 0.52), t);
      op(limNote, P(t, mid('define', 0.66), 0.5, linear));
      op(heldBack, win(t, mid('define', 0.84), at('rule') + 0.1, 0.35)); attr(heldBack, 'y', capY + 10);
      upCO2.set(P(t, mid('rule', 0.04), 0.5)); op(upCO2, win(t, mid('rule', 0.04), mid('rule', 0.5), 0.3));
      upLight.set(P(t, mid('rule', 0.52), 0.5)); op(upLight, win(t, mid('rule', 0.52), at('three'), 0.3));
      op(rises, win(t, mid('rule', 0.2), mid('rule', 0.55), 0.3)); tr(rises, RX + RW / 2 + 30, capY + 2);
      op(same, P(t, mid('rule', 0.66), 0.3, linear)); tr(same, RX + RW / 2 + 34, capY + 2);
    }

    /* --- icons: A -> B -> C --- */
    const icA = Math.min(P(t, at('define') + 0.1, 0.5, linear), 1 - P(t, at('temp') - 0.1, 0.5, linear));
    op(icons, icA);
    if (icA > 0) {
      const ab = P(t, at('three') - 0.05, 1.0), bc = P(t, at('light') - 0.2, 0.9);
      ICONS.forEach((g, i) => {
        const a = IC_A[i], b = IC_B[i], c = IC_C[i];
        let x = lerp(lerp(a[0], b[0], ab), c[0], bc), y = lerp(lerp(a[1], b[1], ab), c[1], bc), s = lerp(lerp(a[2], b[2], ab), c[2], bc);
        const pulse = 0.12 * Math.sin(Math.PI * P(t, mid('lct', [0.6, 0.72, 0.85][i]), 0.5, linear));
        const k = P(t, at('define') + 0.1 + i * 0.15, 0.5, easeOut);
        tr(g, x, y + (1 - k) * 20, Math.max(0.01, s * (1 + pulse)));
      });
      sunI.upd(tt);
    }

    /* --- B: names and Light Cools Things --- */
    const aB = Math.min(P(t, at('three') + 0.2, 0.5, linear), 1 - P(t, at('light') - 0.25, 0.4, linear));
    op(B, aB);
    if (aB > 0) {
      names.forEach((n, i) => {
        const k = P(t, mid('three', [0.42, 0.6, 0.86][i]), 0.45, easeOut);
        op(n.g, k); tr(n.g, 0, (1 - k) * 16);
        const g = P(t, mid('lct', [0.16, 0.26, 0.36][i]), 0.4, linear);
        op(n.halo, g * 0.8); n.ini.setAttribute('fill', g > 0.5 ? C.energy : C.ink);
      });
      lct.forEach((w, i) => { const k = P(t, mid('lct', [0.16, 0.26, 0.36][i]), 0.45, pop); op(w.el, clamp(k * 2)); scaleAt(w.el, w.x, 620, 0.7 + 0.3 * k); });
    }

    /* --- C + D: the graph --- */
    const aG = Math.min(P(t, at('light') - 0.1, 0.5, linear), 1 - P(t, at('grower') - 0.15, 0.5, linear));
    op(Gr, aG); op(panel, aG);
    if (aG > 0) {
      axes.setAttribute('stroke-dashoffset', (1 - P(t, at('light') - 0.1, 0.7)).toFixed(4));
      op(heads, P(t, at('light') + 0.4, 0.4, linear));
      // which factor is on the x-axis
      const toC = P(t, at('co2') - 0.1, 0.5, linear), toT = P(t, at('temp') - 0.1, 0.5, linear);
      op(xLabs[0], P(t, at('light') + 0.2, 0.4, linear) * (1 - toC));
      op(xLabs[1], toC * (1 - toT)); op(xLabs[2], toT);
      op(tTicks, toT);

      // light, then plateau
      const uL = P(t, mid('light', 0.1), mid('plateau', 0.42) - mid('light', 0.1), linear);
      const aL = 1 - toC;
      op(curveL, aL); op(decoL, aL); op(knobL, aL * P(t, at('light'), 0.4, linear));
      if (aL > 0) {
        curveL.setAttribute('d', pathTo(ptL, 0, Math.max(0.001, uL), 80 * uL));
        const p = ptL(uL); tr(knobL, GX + uL * GW, GY); knobLs.upd(tt);
        op(dashL, P(t, mid('plateau', 0.44), 0.4, linear));
        op(shadeL, P(t, mid('plateau', 0.5), 0.6, linear));
        op(lbPlateau, P(t, mid('plateau', 0.4), 0.4, linear));
        op(lbPlat, P(t, mid('plateau', 0.62), 0.5, linear));
        op(lbRise, P(t, mid('plateau', 0.1), 0.5, linear));
        // the misconception bubble, crossed out, then the real answer
        const bp = P(t, mid('notfull', 0.04), 0.5, pop);
        op(bubble, clamp(bp * 2) * (1 - 0.6 * P(t, mid('notfull', 0.4), 0.5, linear)));
        scaleAt(bubble, 972, 230, 0.7 + 0.3 * bp);
        bubStrike.set(P(t, mid('notfull', 0.26), 0.45));
        const xp = P(t, mid('notfull', 0.3), 0.35, easeOut);
        op(bubX, xp * (1 - 0.6 * P(t, mid('notfull', 0.4), 0.5, linear))); tr(bubX, 1128, 199, 0.4 + 0.6 * xp);
        popAt(which, (bendL + GX + GW) / 2, platL + 186, mid('notfull', 0.62), t);
      }
      // carbon dioxide
      const uC = P(t, mid('co2', 0.1), mid('co2', 0.5) - mid('co2', 0.1), linear);
      const back = P(t, mid('co2', 0.6), 1.0);
      const uCd = lerp(uC, airU, back);
      const aC = toC * (1 - toT);
      op(curveC, aC); op(decoC, aC); op(knobC, aC);
      if (aC > 0) {
        curveC.setAttribute('d', pathTo(ptC, 0, Math.max(0.001, uC), 80 * uC));
        tr(knobC, GX + uCd * GW, GY);
        op(airDash, P(t, mid('co2', 0.66), 0.4, linear));
        airLab.set(P(t, mid('co2', 0.66), 0.4, linear));
        popAt(mainLim, ML[0], ML[1], mid('co2', 0.78), t);
      }
      // temperature
      const cT = lerp(0, 36, P(t, mid('temp', 0.18), end('temp') - mid('temp', 0.18), linear)) + lerp(0, 24, P(t, mid('denature', 0.25), mid('denature', 0.95) - mid('denature', 0.25), linear));
      op(curveT, toT); op(band, P(t, mid('denature', 0.06), 0.5, linear));
      if (toT > 0) curveT.setAttribute('d', pathTo(ptT, 0, Math.max(0.05, cT), 3 * cT));
      // the moving point on whichever curve is drawing
      let hp, hc;
      if (toT > 0.5) { hp = ptT(Math.max(0.05, cT)); hc = C.heat; }
      else if (toC > 0.5) { hp = ptC(uCd); hc = C.co2; }
      else { hp = ptL(uL); hc = C.energy; }
      attr(headDot, 'cx', hp[0]); attr(headDot, 'cy', hp[1]); headDot.setAttribute('stroke', hc);
      op(headDot, P(t, mid('light', 0.1), 0.3, linear) * (1 - win(t, at('co2') - 0.15, mid('co2', 0.1) + 0.1, 0.15)) * (1 - win(t, at('temp') - 0.15, mid('temp', 0.18) + 0.1, 0.15)));

      // left panel, C: the mini meters follow the graph
      const aCp = 1 - toT;
      op(Cp, aCp * P(t, at('light') - 0.1, 0.5, linear));
      if (aCp > 0) {
        const reset = P(t, at('co2') - 0.1, 0.7);
        const lvL = [uL, CAP_L, 0.72], lvC = [CAP_C, uCd, 0.8];
        const lv = lvL.map((v, i) => lerp(v, lvC[i], reset));
        minis.forEach((m, i) => m.set(lv[i]));
        // red glow on whichever is lowest (both, briefly, as two cross); notfull points at CO2 and temperature
        const lo = Math.min(...lv), w = lv.map(v => clamp(1 - (v - lo) / 0.035));
        const pulse = [0, mid('notfull', 0.62), mid('notfull', 0.8)].map((t0, i) => i ? 0.8 * Math.sin(Math.PI * P(t, t0, 0.9, linear)) : 0);
        minis.forEach((m, i) => { m.lim(clamp(w[i] + pulse[i])); op(limTags[i], clamp(w[i])); });
      }
      // left panel, D: thermometer and enzyme
      op(Dp, toT);
      if (toT > 0) {
        thBig.set(cT / 60); setText(thRead, Math.round(cT) + ' °C');
        const k = clamp((cT - 43) / 7), r = rT(cT);
        enz.setAttribute('d', enzPath(k, k * 0.5));
        tr(enzG, EZ[0], EZ[1], 1, 7 * r * (1 - k) * calm * Math.sin(tt * 11));
        enz.setAttribute('fill', k > 0.5 ? ball('#8FA3B2', '#4F616F') : ball('#4FD1BE', '#1F8C7E'));
        prods.forEach((g, i) => {
          const u = (tt * (0.35 + 0.9 * r) + i / 4) % 1;
          const d = 30 + u * 70, x = EZ[0] + Math.cos(NA) * (ER * 0.4 + d), y = EZ[1] + Math.sin(NA) * (ER * 0.4 + d);
          tr(g, x, y, 0.8 + 0.4 * u); op(g, r * (1 - k) * Math.sin(u * Math.PI));
        });
        op(enzLab, P(t, mid('temp', 0.3), 0.5, linear)); op(enzSub, P(t, mid('temp', 0.62), 0.5, linear) * (1 - k));
        op(denLab, k);
      }
    }

    /* --- E: the greenhouse --- */
    const aE = Math.min(P(t, at('grower') - 0.1, 0.5, linear), 1 - P(t, at('pondweed') - 0.15, 0.5, linear));
    op(Eg, aE);
    if (aE > 0) {
      const onL = P(t, mid('grower', 0.32), 0.4, linear), onC = P(t, mid('grower', 0.5), 0.4, linear), onH = P(t, mid('grower', 0.66), 0.4, linear);
      LAMPS.forEach((l, i) => { const on = P(t, mid('grower', 0.32) + i * 0.12, 0.25, linear); op(l.cone, on); op(l.halo, on); l.bulb.setAttribute('fill', on > 0.5 ? '#FFF7C2' : '#8796A4'); });
      labLamp.set(onL);
      op(labCO2, onC);
      puffs.forEach((g, i) => { const u = (tt * 0.42 + i / 5) % 1; tr(g, 898 - u * 250, 424 - u * 22 + Math.sin(u * 5 + i) * 8, 0.8 + 0.4 * u, u * 120); op(g, onC * Math.min(1, u * 6, (1 - u) * 3)); });
      op(hGlow, onH * 0.8); hWaves.upd(tt); op(hWaves, onH);
      fins.forEach(f => f.setAttribute('fill', onH > 0.5 ? '#FF9A4D' : '#8796A4'));
      labHeat.set(onH);
      const grow = 0.6 + 0.08 * onL + 0.08 * onC + 0.08 * onH + 0.16 * P(t, mid('grower', 0.74), 1.6, easeOut);
      PLANTS.forEach(p => {
        const sway = calm * 1.5 * Math.sin(tt * 1.2 + p.k);
        p.inner.setAttribute('transform', `rotate(${sway.toFixed(2)})`);
        tr(p.g, p.x, 606, grow);
        p.toms.forEach((c, j) => op(c, P(t, mid('grower', 0.8) + j * 0.12 + p.k * 0.05, 0.35, linear)));
      });
      const mf = P(t, mid('grower', 0.82), 0.5, easeOut); op(moreFood, mf); tr(moreFood, 0, (1 - mf) * 14);
    }

    /* --- F: pondweed on the windowsill --- */
    const aF = P(t, at('pondweed') - 0.1, 0.5, linear);
    op(Fg, aF);
    if (aF > 0) {
      const night = P(t, mid('pondweed', 0.78), 1.3, linear);
      op(nightSky, night); op(daySky, 1 - night * 0.999);
      stars.forEach(s => s.el.setAttribute('opacity', (0.4 + 0.6 * wave(tt, 2.4, s.ph)).toFixed(3)));
      tr(moon, 430, 226 - 20 * night);
      tr(sunW, 760, lerp(206, 600, night)); sunW.upd(tt); op(sunW, 1 - P(night, 0.4, 0.6, linear));
      op(rays, P(t, mid('pondweed', 0.3), 0.6, linear) * (1 - night));
      // pondweed goes in
      const drop = P(t, mid('pondweed', 0.12), 0.9, easeOut);
      op(weed, P(t, mid('pondweed', 0.12), 0.3, linear));
      STEMS.forEach(s => { s.g.setAttribute('transform', `translate(${s.x} ${s.y - (1 - drop) * 210}) rotate(${(calm * 3 * Math.sin(tt * 0.9 + s.k * 1.7)).toFixed(2)})`); });
      // bubbles: start in the sun, slow to a stop in the dark
      const b0 = mid('pondweed', 0.42), n0 = mid('pondweed', 0.8), D = 1.5;
      const tau = t < n0 ? t : t < n0 + D ? n0 + (t - n0) - (t - n0) * (t - n0) / (2 * D) : n0 + D / 2;
      bub.upd(tau, P(t, b0, 0.6, linear) * (1 - P(t, n0 + 0.2, D, linear)));
      labO2.set(P(t, mid('pondweed', 0.5), 0.4, linear));
      labWeed.set(P(t, mid('pondweed', 0.2), 0.4, linear));
      op(home, P(t, at('pondweed'), 0.4, linear));
      op(dim, night * 0.55);
      popAt(darkChip, 600, 640, mid('pondweed', 0.86), t);
    }
  };
});

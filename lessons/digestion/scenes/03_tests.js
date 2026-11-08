/* Chapter: Testing foods in the lab.
   A lab bench with a rack of four tubes of the same food mixture, one per nutrient. Each test lifts its
   tube into the work area on the right: iodine (starch) -> the one-way colour trap -> Benedict's in a hot
   water bath, the blue-to-brick-red sweep (showpiece) -> an unheated tube stays blue -> biuret (protein)
   -> the ethanol emulsion (fat) -> stronger colour, more nutrient -> a control rack of water shows what
   negative results look like. Each finished tube drops back into the rack with its result. */
scene('tests', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- food-test colours (storyboard palette) ---------- */
  const PALE = '#E6D6B2', IOD = '#C67A2E', BLK = '#1B2140';
  const BEN = ['#3D7BE0', '#5BB55B', '#E8D24A', '#F08A2E', '#B33A2A'];
  const BIU = '#5B8DEF', LIL = '#A77BD8', MILK = '#F4F1E8', WAT = '#CFE9F7', ETH = '#EEF4F7';
  const BENCH = 650, LBL = 706;

  /* ---------- helpers ---------- */
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  function mix(a, b, p) { const A = hx(a), B = hx(b), q = clamp(p); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], q)).toString(16).padStart(2, '0')).join(''); }
  function ramp(cols, u) { u = clamp(u) * (cols.length - 1); const i = Math.min(cols.length - 2, Math.floor(u)); return mix(cols[i], cols[i + 1], u - i); }
  const hexPath = s => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (Math.cos(a) * s).toFixed(1) + ',' + (Math.sin(a) * s).toFixed(1); } return d + 'Z'; };
  /* glucose unit: the lesson's amber hexagon with its ring oxygen */
  function hexU(parent, s) {
    const g = G(parent);
    E('path', { d: hexPath(s), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.12), 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: (s * 0.866).toFixed(1), cy: (-s * 0.5).toFixed(1), r: (s * 0.2).toFixed(1), fill: C.oxygen }, g);
    return g;
  }
  const BEADC = [['#FF8A80', '#C2534C'], ['#4DD0C8', '#1E8C85'], ['#B5E655', '#6E9A26'], [C.ethanol, C.ethanolDk]];
  function bead(parent, r, k) { const [c, dk] = BEADC[k % 4]; return E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.2, r * 0.12) }, parent); }
  /* fat: glycerol bar with three fatty-acid tails, centred */
  function fatIcon(parent, s) {
    const g = G(parent), k = G(g); tr(k, -22 * s, 0);
    [-1, 0, 1].forEach(j => { let d = `M${6 * s},${j * 13 * s}`; for (let i = 1; i <= 5; i++) d += ` L${((6 + i * 9) * s).toFixed(1)},${((j * 13 + (i % 2 ? -4 : 4)) * s).toFixed(1)}`; E('path', { d, fill: 'none', stroke: '#FFB347', 'stroke-width': 4.5 * s, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k); });
    E('rect', { x: -6 * s, y: -21 * s, width: 12 * s, height: 42 * s, rx: 6 * s, fill: ball('#FFF0B8', '#C9B46A'), stroke: '#C9B46A', 'stroke-width': 1.5 }, k);
    return g;
  }
  /* wooden rack on the bench for n tubes sp apart (tube width tw), centred on x = 0; tubes go in g.tubes */
  function rack(parent, n, sp, tw, barY) {
    const g = G(parent), w = (n - 1) * sp + tw + 56;
    E('rect', { x: -w / 2, y: BENCH - 16, width: w, height: 16, rx: 5, fill: '#7A5634', stroke: '#A8805A', 'stroke-width': 2 }, g);
    E('rect', { x: -w / 2 + 8, y: barY + 8, width: 12, height: BENCH - 24 - barY, fill: '#6A4A2E' }, g);
    E('rect', { x: w / 2 - 20, y: barY + 8, width: 12, height: BENCH - 24 - barY, fill: '#6A4A2E' }, g);
    g.tubes = G(g);
    E('rect', { x: -w / 2, y: barY, width: w, height: 15, rx: 5, fill: '#A97C50', stroke: '#D4AA7C', 'stroke-width': 2 }, g);
    return g;
  }
  /* a big tube (70 x 280) standing in its own one-slot rack; group origin at the tube's x, stage y */
  const WTY = 494, WH = 280;                      // big tube centre y (bottom at 634) and height
  function workTube(parent, liquid, level) {
    const g = G(parent);
    const rk = rack(g, 1, 0, 70, 470);
    const tg = G(rk.tubes);
    const tube = testTube(tg, 70, WH, { level, liquid });
    tr(tg, 0, WTY);
    return { g, rk, tg, tube };
  }
  const surfY = level => WTY + WH / 2 - (WH - 10) * level;      // stage y of a big tube's liquid surface
  /* glass dropper; origin at the top of the stem, tip 96*s below */
  function dropper(parent, color, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s);
    E('path', { d: 'M-9,0 L-9,74 L-3,96 L3,96 L9,74 L9,0 Z', fill: color, 'fill-opacity': 0.6, stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M-15,2 Q-17,-46 0,-50 Q17,-46 15,2 Z', fill: ball('#E8424F', '#9C1F2B'), stroke: '#FF9AA3', 'stroke-width': 2 }, k);
    return g;
  }
  const DROP = 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z';
  function drops(parent, color, n) { return Array.from({ length: n }, () => E('path', { d: DROP, fill: color, stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 1.5 }, parent)); }
  function dropsUpd(ds, t, t0, gap, x, y0, y1) {
    ds.forEach((d, k) => {
      const u = (t - t0 - k * gap) / 0.45;
      if (u <= 0 || u >= 1) { op(d, 0); return; }
      tr(d, x, lerp(y0, y1, u * u)); op(d, Math.min(1, (1 - u) * 8));
    });
  }
  /* reagent bottle standing on the bench (origin: bottom centre) */
  function bottle(parent, color, clearish) {
    const g = G(parent);
    const d = 'M-40,0 L-40,-92 Q-40,-110 -24,-114 L-14,-116 L-14,-138 L14,-138 L14,-116 L24,-114 Q40,-110 40,-92 L40,0 Z';
    E('path', { d, fill: GLASS.fill }, g);
    E('rect', { x: -34, y: -80, width: 68, height: 76, rx: 6, fill: color, opacity: clearish ? 0.3 : 0.88 }, g);
    E('rect', { x: -27, y: -66, width: 54, height: 26, rx: 4, fill: '#F4F7FA', opacity: 0.92 }, g);
    E('path', { d, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -20, y: -154, width: 40, height: 18, rx: 5, fill: '#3A4752', stroke: '#8FA3B2', 'stroke-width': 2 }, g);
    return g;
  }
  const lab = (parent, x, text, o) => T(parent, x, LBL, text, Object.assign({ size: 26, weight: 600, anchor: 'middle', fill: C.ink }, o || {}));
  const pill = (parent, text, o) => chip(parent, text, Object.assign({ size: 26, fill: 'rgba(10,27,39,0.86)', stroke: C.line, sw: 2.5 }, o || {}));
  const popIn = (el, t, t0, x, y, d) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * (d === undefined ? 14 : d), Math.max(0.01, 0.85 + 0.15 * p)); return p; };

  /* ---------- the bench ---------- */
  const bench = G(root);
  E('rect', { x: 0, y: BENCH, width: W, height: H - BENCH, fill: '#182A35' }, bench);
  E('rect', { x: 0, y: BENCH - 4, width: W, height: 12, fill: '#3B5767' }, bench);
  E('rect', { x: 0, y: BENCH + 8, width: W, height: 3, fill: '#0E1E28', opacity: 0.8 }, bench);

  /* ---------- the main rack: one food mixture, four tests ---------- */
  const SP = 105, RTY = 539;                      // rack tube 46 x 190, bottom at 634
  const rackG = G(root);
  const mainRack = rack(rackG, 4, SP, 46, 482);
  const NUT = ['starch', 'sugar', 'protein', 'fat'];
  const RES = [BLK, BEN[4], LIL, MILK];
  const rt = NUT.map((nm, i) => {
    const x = (i - 1.5) * SP, tg = G(mainRack.tubes);
    const tube = testTube(tg, 46, 190, { level: 0.45, liquid: PALE });
    const q = T(tg, 0, 76, '?', { size: 34, weight: 700, anchor: 'middle', fill: '#7A6648' });
    const lb = lab(rackG, x, nm);
    const ic = G(rackG);
    if (i === 0) [-1, 0, 1].forEach(k => tr(hexU(ic, 10), k * 18.5, 0));
    else if (i === 1) hexU(ic, 14);
    else if (i === 2) [-1, 0, 1].forEach(k => tr(bead(ic, 9, k + 1), k * 16, k === 0 ? -4 : 3));
    else fatIcon(ic, 0.8);
    return { x, tg, tube, q, lb, ic };
  });
  const foodChip = pill(rackG, 'with food', { stroke: C.glucose, color: C.glucoseLt });
  tr(foodChip, 0, 346);

  /* ---------- how: the question, and "colour change" ---------- */
  const howG = G(root);
  const howT = T(howG, 600, 176, 'What’s in this food?', { size: 46, weight: 700, anchor: 'middle' });
  const ccG = G(howG);
  const ccW = textWidth('colour change', 30, FD, 700) + 100;
  E('rect', { x: -ccW / 2, y: -28, width: ccW, height: 56, rx: 28, fill: C.card2, stroke: C.energy, 'stroke-width': 2.5 }, ccG);
  const wheel = G(ccG); tr(wheel, -ccW / 2 + 34, 0);
  [BLK, IOD, BEN[0], BEN[2], BEN[4], LIL].forEach((c, i) => {
    const a0 = i / 6 * TAU, a1 = (i + 1) / 6 * TAU, r = 18;
    E('path', { d: `M0,0 L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)} Z`, fill: c, stroke: '#0A1B27', 'stroke-width': 1.5 }, wheel);
  });
  T(ccG, 10, 10, 'colour change', { size: 30, weight: 700, anchor: 'middle' });
  // the food sample: mashed food and water in a mortar, poured into every tube
  const mortar = G(howG); tr(mortar, 205, BENCH);
  E('path', { d: 'M44,-70 L92,-168', stroke: '#8C9AA6', 'stroke-width': 24, 'stroke-linecap': 'round' }, mortar);
  E('path', { d: 'M44,-70 L92,-168', stroke: '#EEF2F5', 'stroke-width': 17, 'stroke-linecap': 'round' }, mortar);
  E('path', { d: 'M-78,-66 Q-74,-4 -32,-2 L32,-2 Q74,-4 78,-66 Z', fill: ball('#F4F7FA', '#97A6B2'), stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, mortar);
  E('ellipse', { cx: 0, cy: -64, rx: 72, ry: 12, fill: PALE, stroke: '#FFFFFF', 'stroke-width': 2.5 }, mortar);
  { const r = rng(7); let d = ''; for (let i = 0; i < 9; i++) d += `M${((r() - 0.5) * 110).toFixed(0)},${(-64 + (r() - 0.5) * 12).toFixed(0)} h0.1 `; E('path', { d, stroke: '#B8955E', 'stroke-width': 7, 'stroke-linecap': 'round' }, mortar); }
  const mortarL = lab(howG, 205, 'mashed food + water');
  const mortarA = arrow(howG, 296, 574, 372, 574, { color: C.muted, width: 5 });

  /* ================= Test 1: starch (iodine), and the one-way trap ================= */
  const t1 = G(root);
  const w1b = workTube(t1, IOD, 0.45);            // the no-starch tube (backwards)
  const w1 = workTube(t1, PALE, 0.42);            // the starch tube
  const b1 = bottle(t1, IOD); tr(b1, 1060, BENCH);
  const b1L = lab(t1, 1060, 'iodine solution');
  const lbSt = lab(t1, 0, 'starch');
  const lbNo = lab(t1, 650, 'no starch');
  const d1 = dropper(t1, IOD, 1.25);
  const dr1 = drops(t1, IOD, 4);
  const r1 = pill(t1, 'blue-black', { stroke: '#7F8FD0', color: C.ink });
  const st1 = pill(t1, 'iodine starts orange-brown', { size: 28, stroke: IOD, color: '#F3C08A' });
  const stays = pill(t1, 'stays orange-brown', { stroke: IOD, color: '#F3C08A' });
  const arOk = arrow(t1, 712, 545, 888, 545, { color: C.good, width: 6 });
  const arOkL = T(t1, 800, 522, '+ starch', { size: 26, weight: 700, anchor: 'middle', fill: C.good });
  const arNo = arrow(t1, 888, 606, 712, 606, { color: C.faint, width: 6 });
  const arX = cross(t1, 15); tr(arX, 800, 606);

  /* ================= Test 2: reducing sugar (Benedict's), heat, the sweep ================= */
  const t2 = G(root);
  const BX = 700;
  const rig = G(t2);
  E('path', { d: `M${BX - 100},444 L${BX - 128},${BENCH - 2} M${BX + 100},444 L${BX + 128},${BENCH - 2}`, stroke: '#1C2126', 'stroke-width': 9, 'stroke-linecap': 'round' }, rig);
  const burner = bunsen(rig, 0.85); tr(burner, BX, BENCH - 15);
  E('rect', { x: BX - 126, y: 436, width: 252, height: 10, rx: 4, fill: '#76808A', stroke: '#C9D1D8', 'stroke-width': 2 }, rig);
  const thermo = thermometer(rig, 196, C.bad); tr(thermo, BX + 76, 404);
  const bath = beaker(rig, 232, 190, { level: 0.7, liquid: '#8FD3F0', opacity: 0.32 }); tr(bath, BX, 341);
  const bathBub = bubbles(rig, BX - 104, 324, 208, 104, { n: 8, r: 5, seed: 13, speed: 0.5 });
  const steam = heatWaves(rig, { n: 3, h: 74, spacing: 20 }); tr(steam, BX - 70, 300);
  const w2 = workTube(t2, PALE, 0.42);
  const bathFront = G(t2);
  E('rect', { x: BX - 36, y: 317, width: 72, height: 114, fill: '#8FD3F0', opacity: 0.07 }, bathFront);
  E('line', { x1: BX - 36, y1: 316, x2: BX + 36, y2: 316, stroke: '#DDF3FB', 'stroke-width': 2.5, opacity: 0.75 }, bathFront);
  const b2 = bottle(t2, BEN[0]); tr(b2, 1060, BENCH);
  const b2L = lab(t2, 1060, 'Benedict’s');
  const lbSu = lab(t2, BX, 'sugar');
  const lbHot = lab(t2, BX, 'heated');
  const d2 = dropper(t2, BEN[0], 1.25);
  const dr2 = drops(t2, BEN[0], 4);
  const rsG = G(t2);                              // "reducing sugars, e.g. glucose"
  { const w = textWidth('reducing sugars, e.g. glucose', 26, FD, 700) + 92;
    E('rect', { x: -w / 2, y: -26, width: w, height: 52, rx: 26, fill: 'rgba(10,27,39,0.86)', stroke: C.glucose, 'stroke-width': 2.5 }, rsG);
    tr(hexU(rsG, 14), -w / 2 + 30, 0);
    T(rsG, 15, 9, 'reducing sugars, e.g. glucose', { size: 26, weight: 700, anchor: 'middle', fill: C.glucoseLt }); }
  // the colour strip
  const SX = 960, SYS = [196, 270, 344, 418, 492], SNM = ['blue', 'green', 'yellow', 'orange', 'brick-red'];
  const strip = G(t2);
  E('line', { x1: SX, y1: SYS[0], x2: SX, y2: SYS[4], stroke: C.line, 'stroke-width': 7, 'stroke-linecap': 'round' }, strip);
  const prog = E('line', { x1: SX, y1: SYS[0], x2: SX, y2: SYS[0], stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round' }, strip);
  const sw = BEN.map((c, i) => {
    E('circle', { cx: SX, cy: SYS[i], r: 24, fill: C.bg0, stroke: C.line, 'stroke-width': 3 }, strip);
    const dot = E('circle', { cx: 0, cy: 0, r: 24, fill: c, stroke: '#FFFFFF', 'stroke-width': 3 }, strip);
    const tx = T(strip, SX + 42, SYS[i] + 10, SNM[i], { size: 30, weight: 700, fill: C.ink });
    return { dot, tx };
  });
  const swTick = tick(strip, 16); tr(swTick, SX - 54, SYS[4]);
  // no heat: a second tube stays blue
  const wCold = workTube(t2, BEN[0], 0.47);
  const lbCold = lab(t2, 1010, 'not heated');
  const xCold = cross(t2, 20);
  const okHot = tick(t2, 20);
  const nhChip = pill(t2, 'no heat, no colour change', { stroke: C.bad, color: '#FFB3BA' });

  /* ================= Test 3: protein (biuret) ================= */
  const t3 = G(root);
  const w3 = workTube(t3, PALE, 0.42);
  const b3 = bottle(t3, BIU); tr(b3, 1060, BENCH);
  const b3L = lab(t3, 1060, 'biuret solution');
  const lbPr = lab(t3, 800, 'protein');
  const d3 = dropper(t3, BIU, 1.25);
  const dr3 = drops(t3, BIU, 4);
  const r3 = pill(t3, 'purple, or lilac', { stroke: LIL, color: '#E2D2FF' });

  /* ================= Test 4: fat (ethanol emulsion) ================= */
  const t4 = G(root);
  const FX = 700, RX4 = 960;
  const w4w = workTube(t4, WAT, 0.38);            // the tube of water
  const emul = G(t4), er = rng(42), emDots = [];
  for (let k = 0; k < 16; k++) emDots.push({ el: E('circle', { r: 2.5 + er() * 3.5, fill: '#FFFFFF', opacity: 0.85 }, emul), x: (er() - 0.5) * 52, y: surfY(0.48) + 10 + er() * (634 - surfY(0.48) - 30), d: er() });
  const w4 = workTube(t4, PALE, 0.38);            // food + ethanol
  // its liquid is drawn as a polygon that stays level however the tube is tilted
  const TUBEPOLY = (() => { const r = 32, top = -WH / 2 + 5, yb = WH / 2 - 35, pts = [[-r, top], [r, top], [r, yb]]; for (let i = 1; i < 8; i++) { const a = i / 8 * Math.PI; pts.push([Math.cos(a) * r, yb + Math.sin(a) * r]); } pts.push([-r, yb]); return pts; })();
  function clipHalf(pts, d, c) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], va = a[0] * d[0] + a[1] * d[1] - c, vb = b[0] * d[0] + b[1] * d[1] - c;
      if (va >= 0) out.push(a);
      if ((va >= 0) !== (vb >= 0)) { const f = va / (va - vb); out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); }
    }
    return out;
  }
  const polyArea = pts => { let s = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
  function levelPoly(theta, A) {
    const d = [Math.sin(theta), Math.cos(theta)];
    let lo = -200, hi = 200;
    for (let k = 0; k < 16; k++) { const m = (lo + hi) / 2; if (polyArea(clipHalf(TUBEPOLY, d, m)) > A) lo = m; else hi = m; }
    return clipHalf(TUBEPOLY, d, (lo + hi) / 2);
  }
  const A0 = polyArea(clipHalf(TUBEPOLY, [0, 1], WH / 2 - (WH - 10) * 0.38));
  const fatLiq = E('path', { d: '', fill: PALE, opacity: 0.9 }, w4.tube);
  w4.tube.insertBefore(fatLiq, w4.tube.childNodes[3]);
  w4.tube.set(0);
  const bung = E('path', { d: 'M-30,-154 L30,-154 L26,-126 L-26,-126 Z', fill: ball('#B5503F', '#7A2D22'), stroke: '#D88A78', 'stroke-width': 2, 'stroke-linejoin': 'round' }, w4.tg);
  const stream = E('path', { d: '', fill: 'none', stroke: mix(PALE, ETH, 0.5), 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.9 }, t4);
  const b4 = bottle(t4, ETH, true); tr(b4, 1060, BENCH);
  const b4L = lab(t4, 1060, 'ethanol');
  const lbFa = lab(t4, FX, 'fat');
  const lbWa = lab(t4, RX4, 'water');
  const d4 = dropper(t4, ETH, 1.25);
  const dr4 = drops(t4, '#E9F4FA', 3);
  const emChip = pill(t4, 'ethanol emulsion test', { size: 28, stroke: C.energy, color: C.energy });
  const shakeL = G(t4);
  [-1, 1].forEach(s => E('path', { d: `M${s * 62},-30 q${s * 14},30 0,60 M${s * 80},-20 q${s * 10},20 0,40`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, shakeL));
  const r4 = pill(t4, 'cloudy white emulsion', { stroke: '#FFFFFF', color: C.ink });

  /* ================= strength: stronger colour, more sugar ================= */
  const sG = G(root);
  const sRack = rack(sG, 3, 140, 46, 482); tr(sRack, 860, 0);
  const sTubes = [1, 3, 4].map((ci, k) => {
    const tg = G(sRack.tubes); const tb = testTube(tg, 46, 190, { level: 0.45, liquid: BEN[ci] }); tr(tg, (k - 1) * 140, RTY);
    const hx_ = G(sG), n = [1, 2, 4][k];
    for (let j = 0; j < n; j++) tr(hexU(hx_, 12), n === 1 ? 0 : (j % 2 - 0.5) * 24, n === 4 ? (Math.floor(j / 2) - 0.5) * 22 : 0);
    return { tg, hx: hx_, x: 860 + (k - 1) * 140 };
  });
  const sArrow = arrow(sG, 690, 336, 1032, 336, { color: C.energy, width: 7 });
  const sLbl = T(sG, 860, 312, 'more sugar', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const sChip = pill(sG, 'stronger colour = more of the nutrient', { size: 28, stroke: C.line });

  /* ================= control: water, no food ================= */
  const cG = G(root);
  const cRack = rack(cG, 4, SP, 46, 482); tr(cRack, 900, 0);
  const CNEG = [IOD, BEN[0], BIU, WAT];
  const cTubes = CNEG.map((c, i) => { const tg = G(cRack.tubes); const tb = testTube(tg, 46, 190, { level: 0, liquid: WAT }); tr(tg, (i - 1.5) * SP, RTY); return tb; });
  const cChip = pill(cG, 'control: water, no food', { stroke: C.water, color: '#BDEBFA' }); tr(cChip, 900, 346);
  const cLbl = lab(cG, 900, 'what negative looks like', { fill: '#BDEBFA' });
  const cmp = G(cG);
  arrow(cmp, 520, 560, 640, 560, { color: C.muted, width: 5 });
  arrow(cmp, 640, 560, 520, 560, { color: C.muted, width: 5 });
  T(cmp, 580, 536, 'compare', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ---------- top-right test headers ---------- */
  const header = text => { const c = chip(root, text, { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy }); tr(c, 1160 - c.w / 2, 60); return c; };
  const hd = ['Test 1 · Starch', 'Test 2 · Sugar', 'Test 3 · Protein', 'Test 4 · Fat'].map(header);

  /* ================= update ================= */
  return t => {
    const T1 = at('iodine'), T2 = at('benedict'), T3 = at('biuret'), T4 = at('fat'), T5 = at('strength'), T6 = at('control');
    const WIN = [[T1, T2], [T2, T3], [T3, T4], [T4, T5]];

    /* --- the rack: tubes drop in, slide left, lift out for their test and come back with the result --- */
    const slide = P(t, T1 - 0.42, 0.9);
    tr(rackG, lerp(600, 262, slide), 0);
    rt.forEach((r, i) => {
      const t0 = S.first + 0.05 + i * 0.16;
      const din = P(t, t0, 0.55, easeOut);
      const lift = P(t, WIN[i][0] + 0.05, 0.45) * (1 - P(t, WIN[i][1] - 0.55, 0.5, easeOut));
      tr(r.tg, r.x, RTY - (1 - din) * 170 - lift * 80);
      op(r.tg, Math.min(P(t, t0, 0.25, linear), 1 - lift));
      const done = t > WIN[i][0] + 0.6;
      r.tube.set(0.45, done ? RES[i] : PALE);
      attr(r.tube.liquid, 'opacity', done && i === 3 ? 0.95 : 0.85);
      op(r.q, done ? 0 : P(t, mid('how', 0.3 + i * 0.05), 0.4, linear));
      op(r.lb, P(t, t0 + 0.2, 0.4, linear));
      const ip = P(t, mid('how', 0.28 + i * 0.05), 0.5, pop);
      op(r.ic, clamp(ip * 2)); tr(r.ic, r.x, 404 + (1 - clamp(ip)) * 12, Math.max(0.01, 0.8 + 0.2 * ip));
    });
    op(foodChip, P(t, mid('control', 0.32), 0.4, linear));

    /* --- how --- */
    const aH = 1 - P(t, T1 - 0.5, 0.3, linear);
    op(howG, aH);
    if (aH > 0) {
      op(howT, P(t, mid('how', 0.04), 0.5, linear)); tr(howT, 0, (1 - P(t, mid('how', 0.04), 0.6, easeOut)) * 12);
      const mp = P(t, S.first, 0.5, linear); op(mortar, mp); op(mortarL, mp);
      mortarA.set(P(t, S.first + 0.5, 0.6)); op(mortarA, P(t, S.first + 0.5, 0.2, linear));
      popIn(ccG, t, mid('how', 0.62), 600, 262);
      tr(wheel, -ccW / 2 + 34, 0, 1, (t * 40 * calm) % 360);
    }

    /* --- test headers --- */
    hd.forEach((h, i) => op(h, win(t, WIN[i][0], WIN[i][1] - 0.1, 0.35)));

    /* --- Test 1: iodine --- */
    const a1 = win(t, T1 + 0.1, T2 - 0.05, 0.4);
    op(t1, a1);
    if (a1 > 0) {
      const wIn = P(t, T1 + 0.25, 0.6, easeOut), mv = P(t, at('backwards') - 0.1, 0.7);
      const x1 = lerp(800, 950, mv);
      tr(w1.g, x1, (1 - wIn) * 30); op(w1.g, wIn);
      tr(lbSt, x1, 0); op(lbSt, wIn);
      const bIn = P(t, mid('iodine', 0.04), 0.5, linear) * (1 - P(t, at('backwards') - 0.2, 0.4, linear));
      op(b1, bIn); op(b1L, bIn);
      // dropper and drops of orange-brown iodine
      const dIn = P(t, mid('iodine', 0.12), 0.5, easeOut), dOut = P(t, mid('iodine', 0.56), 0.45, linear);
      tr(d1, 800, lerp(120, 210, dIn)); op(d1, dIn * (1 - dOut));
      dropsUpd(dr1, t, mid('iodine', 0.2), 0.32, 800, 330, surfY(0.43));
      const tint = P(t, mid('iodine', 0.2) + 0.45, 1.2, linear), bb = P(t, mid('iodine', 0.8), 0.8, ease);
      w1.tube.set(0.42 + 0.03 * tint, mix(mix(PALE, IOD, 0.72 * tint), BLK, bb));
      // result chip rides with the tube
      const rp = P(t, mid('iodine', 0.86), 0.45, pop);
      op(r1, clamp(rp * 2)); tr(r1, x1, 300 + (1 - clamp(rp)) * 12, Math.max(0.01, 0.85 + 0.15 * rp));
      // backwards: the no-starch tube, the one-way arrow, the crossed reverse arrow
      const nIn = P(t, at('backwards') + 0.05, 0.6, easeOut);
      tr(w1b.g, 650, (1 - nIn) * 30); op(w1b.g, nIn); op(lbNo, nIn);
      const hl = Math.sin(Math.PI * P(t, mid('backwards', 0.62), 0.8, linear));
      attr(lbNo, 'fill', mix('#F2F7FA', '#F3C08A', hl));
      arNo.set(P(t, mid('backwards', 0.05), 0.5)); op(arNo, P(t, mid('backwards', 0.05), 0.2, linear));
      const xp = P(t, mid('backwards', 0.13), 0.4, pop); op(arX, clamp(xp * 2)); tr(arX, 800, 606, Math.max(0.01, xp));
      popIn(st1, t, mid('backwards', 0.25), 800, 212);
      arOk.set(P(t, mid('backwards', 0.4), 0.6)); op(arOk, P(t, mid('backwards', 0.4), 0.2, linear)); op(arOkL, P(t, mid('backwards', 0.46), 0.4, linear));
      popIn(stays, t, mid('backwards', 0.8), 650, 300);
    }

    /* --- Test 2: Benedict's, the water bath, the sweep, no heat --- */
    const a2 = win(t, T2 + 0.1, T3 - 0.05, 0.4);
    op(t2, a2);
    if (a2 > 0) {
      const wIn = P(t, T2 + 0.25, 0.6, easeOut);
      const tb = mid('benedict', 0.7);                  // into the water bath
      const up = P(t, tb, 0.55), down = P(t, tb + 0.55, 0.5, easeOut);
      const ty = lerp(lerp(WTY, 236, up), 290, down) + (1 - wIn) * 30;
      tr(w2.g, BX, 0); op(w2.g, wIn);
      tr(w2.tg, 0, ty);
      op(w2.rk.firstChild, 1 - up); [1, 2, 4].forEach(k => op(w2.rk.childNodes[k], 1 - up));
      op(lbSu, wIn * (1 - P(t, at('heat') - 0.1, 0.3, linear))); op(lbHot, P(t, at('heat') + 0.1, 0.4, linear));
      const rIn = P(t, tb + 0.05, 0.6, linear);
      op(rig, rIn);
      op(bathFront, down);
      burner.upd(t); bathBub.upd(t, rIn); steam.upd(t); op(steam, 0.85 * P(t, tb + 0.8, 0.8, linear));
      thermo.set(0.2 + 0.55 * P(t, tb + 0.5, 3.0, easeOut));
      const bIn = P(t, mid('benedict', 0.03), 0.5, linear) * (1 - P(t, tb - 0.1, 0.4, linear));
      op(b2, bIn); op(b2L, bIn);
      const rs = popIn(rsG, t, mid('benedict', 0.04), 955, 252); op(rsG, clamp(rs * 2) * (1 - P(t, tb - 0.15, 0.3, linear)));
      // blue Benedict's
      const dIn = P(t, mid('benedict', 0.32), 0.45, easeOut), dOut = P(t, mid('benedict', 0.66), 0.35, linear);
      tr(d2, BX, lerp(120, 210, dIn)); op(d2, dIn * (1 - dOut));
      dropsUpd(dr2, t, mid('benedict', 0.4), 0.28, BX, 330, surfY(0.43));
      const blue = P(t, mid('benedict', 0.4) + 0.45, 1.1, linear);
      // the sweep, keyed to the words: blue, green, yellow, orange, brick-red
      const K = [0.33, 0.46, 0.57, 0.68, 0.88].map(f => mid('sweep', f));
      let u = 0;
      for (let i = 1; i < 5; i++) { const d = 0.7 * (K[i] - K[i - 1]); if (t >= K[i]) u = i; else if (t > K[i] - d) { u = i - 1 + (t - (K[i] - d)) / d; break; } else break; }
      const col = u > 0 ? ramp(BEN, u / 4) : mix(PALE, BEN[0], blue);
      w2.tube.set(0.42 + 0.05 * blue, col);
      const aS = win(t, at('sweep') - 0.1, at('heat') + 0.05, 0.4);
      op(strip, aS);
      if (aS > 0) {
        sw.forEach((s, i) => {
          const p = P(t, K[i] - 0.12, 0.4, pop);
          op(s.dot, clamp(p * 2)); tr(s.dot, SX, SYS[i], Math.max(0.01, p));
          op(s.tx, 0.35 + 0.65 * P(t, K[i] - 0.12, 0.3, linear));
        });
        attr(prog, 'y2', lerp(SYS[0], SYS[4], clamp(u / 4)));
        const tk = P(t, K[4] + 0.25, 0.45, pop); op(swTick, clamp(tk * 2)); tr(swTick, SX - 54, SYS[4], Math.max(0.01, tk));
      }
      // no heat: a cold tube stays blue
      const cIn = P(t, at('heat') + 0.1, 0.5, easeOut);
      tr(wCold.g, 1010, (1 - cIn) * 30); op(wCold.g, cIn); op(lbCold, cIn);
      const cx_ = P(t, mid('heat', 0.5), 0.4, pop); op(xCold, clamp(cx_ * 2)); tr(xCold, 1010, 306, Math.max(0.01, cx_));
      const ck = P(t, mid('heat', 0.2), 0.4, pop); op(okHot, clamp(ck * 2)); tr(okHot, BX + 62, 128, Math.max(0.01, ck));
      popIn(nhChip, t, mid('heat', 0.55), 985, 214);
    }

    /* --- Test 3: biuret --- */
    const a3 = win(t, T3 + 0.1, T4 - 0.05, 0.4);
    op(t3, a3);
    if (a3 > 0) {
      const wIn = P(t, T3 + 0.25, 0.6, easeOut);
      tr(w3.g, 800, (1 - wIn) * 30); op(w3.g, wIn); op(lbPr, wIn);
      const bIn = P(t, mid('biuret', 0.04), 0.5, linear); op(b3, bIn); op(b3L, bIn);
      const dIn = P(t, mid('biuret', 0.14), 0.45, easeOut), dOut = P(t, mid('biuret', 0.5), 0.4, linear);
      tr(d3, 800, lerp(120, 210, dIn)); op(d3, dIn * (1 - dOut));
      dropsUpd(dr3, t, mid('biuret', 0.2), 0.26, 800, 330, surfY(0.43));
      const blue = P(t, mid('biuret', 0.2) + 0.45, 1.0, linear), pur = P(t, mid('biuret', 0.66), 0.9, ease);
      w3.tube.set(0.42 + 0.04 * blue, mix(mix(PALE, BIU, blue), LIL, pur));
      popIn(r3, t, mid('biuret', 0.82), 800, 300);
    }

    /* --- Test 4: ethanol emulsion --- */
    const a4 = win(t, T4 + 0.1, T5 - 0.05, 0.4);
    op(t4, a4);
    if (a4 > 0) {
      const wIn = P(t, T4 + 0.25, 0.6, easeOut);
      op(w4.g, wIn); op(lbFa, wIn);
      const bIn = P(t, mid('fat', 0.1), 0.5, linear) * (1 - P(t, mid('fat', 0.44), 0.35, linear)); op(b4, bIn); op(b4L, bIn);
      const ec = popIn(emChip, t, mid('fat', 0.14), 900, 168); op(emChip, clamp(ec * 2) * (1 - P(t, mid('fat', 0.52), 0.4, linear)));
      // shake with ethanol
      const dIn = P(t, mid('fat', 0.26), 0.4, easeOut), dOut = P(t, mid('fat', 0.42), 0.3, linear);
      tr(d4, FX, lerp(120, 210, dIn)); op(d4, dIn * (1 - dOut));
      dropsUpd(dr4, t, mid('fat', 0.31), 0.22, FX, 330, surfY(0.4));
      const eth = P(t, mid('fat', 0.31) + 0.4, 0.8, linear);
      const bungOn = P(t, mid('fat', 0.43), 0.3, easeOut), bungOff = P(t, mid('fat', 0.53), 0.3, linear);
      op(bung, bungOn * (1 - bungOff)); attr(bung, 'transform', `translate(0 ${((1 - bungOn) * -40 - bungOff * 40).toFixed(1)})`);
      const shake = win(t, mid('fat', 0.44), mid('fat', 0.53), 0.15);
      // pour into the water
      const toPour = P(t, mid('fat', 0.55), 0.5), pourBack = P(t, mid('fat', 0.74), 0.5);
      const flow = clamp((t - mid('fat', 0.585)) / (mid('fat', 0.72) - mid('fat', 0.585)));
      const pose = toPour * (1 - pourBack);
      const rx = lerp(FX, 952, pose), ry = lerp(WTY - WH / 2, 318, pose) - 40 * shake, th = 112 * pose + shake * 16 * Math.sin(t * 26 * calm);
      w4.tg.setAttribute('transform', `translate(${(rx - FX).toFixed(1)} ${ry.toFixed(1)}) rotate(${th.toFixed(1)}) translate(0 ${WH / 2})`);
      tr(w4.g, FX, (1 - wIn) * 30);
      op(shakeL, shake); tr(shakeL, FX, WTY - 40);
      const lp = levelPoly(th * Math.PI / 180, A0 * lerp(1 + 0.36 * eth, 0.07, flow));
      fatLiq.setAttribute('d', 'M' + lp.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L') + 'Z');
      fatLiq.setAttribute('fill', mix(PALE, ETH, 0.45 * eth));
      const pourOn = flow > 0 && flow < 1 ? Math.min(1, flow * 8, (1 - flow) * 8) : 0;
      op(stream, pourOn);
      if (pourOn > 0) {
        const a = th * Math.PI / 180, sx = rx + 32 * Math.cos(a) - 5 * Math.sin(a), sy = ry + 32 * Math.sin(a) + 5 * Math.cos(a), ey = surfY(0.4 + 0.1 * flow);
        stream.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} Q${(sx + 10).toFixed(1)},${(sy + 30).toFixed(1)} ${(sx + 14).toFixed(1)},${ey.toFixed(1)}`);
        attr(stream, 'stroke-width', 3 + 5 * Math.sin(Math.PI * flow));
      }
      // the water tube and the emulsion
      const wwIn = P(t, mid('fat', 0.5), 0.5, easeOut);
      tr(w4w.g, RX4, (1 - wwIn) * 30); op(w4w.g, wwIn); op(lbWa, wwIn);
      const cloud = P(t, mid('fat', 0.7), 1.6, ease);
      w4w.tube.set(0.38 + 0.1 * flow, mix(WAT, MILK, cloud)); attr(w4w.tube.liquid, 'opacity', lerp(0.45, 0.95, cloud));
      tr(emul, RX4, (1 - wwIn) * 30);
      emDots.forEach(o => { const p = P(t, mid('fat', 0.68) + o.d * 0.8, 0.7, easeOut); op(o.el, p * (1 - 0.6 * P(t, mid('fat', 0.92), 0.6, linear))); attr(o.el, 'cx', o.x * (0.3 + 0.7 * p)); attr(o.el, 'cy', lerp(surfY(0.48) + 6, o.y, p) + Math.sin(t * 2 + o.d * 9) * 2 * calm); });
      popIn(r4, t, mid('fat', 0.86), 960, 300);
    }

    /* --- strength --- */
    const aS = win(t, T5 - 0.05, T6 - 0.1, 0.35);
    op(sG, aS);
    if (aS > 0) {
      sTubes.forEach((o, k) => { const p = P(t, mid('strength', 0.02 + k * 0.1), 0.45, easeOut); tr(o.tg, (k - 1) * 140, RTY + (1 - p) * 40); op(o.tg, p); popIn(o.hx, t, mid('strength', 0.45 + k * 0.1), o.x, 406, 10); });
      popIn(sChip, t, mid('strength', 0.08), 860, 230);
      sArrow.set(P(t, mid('strength', 0.5), 0.7)); op(sArrow, P(t, mid('strength', 0.5), 0.2, linear));
      op(sLbl, P(t, mid('strength', 0.62), 0.4, linear));
    }

    /* --- control --- */
    const aC = P(t, T6 - 0.05, 0.4, linear);
    op(cG, aC);
    if (aC > 0) {
      const rIn = P(t, T6, 0.6, easeOut);
      tr(cRack, 900, (1 - rIn) * 30);
      popIn(cChip, t, mid('control', 0.06), 900, 346);
      const fill = P(t, mid('control', 0.32), 0.9, ease), dye = P(t, mid('control', 0.5), 0.9, ease);
      cTubes.forEach((tb, i) => { tb.set(0.45 * fill, mix(WAT, CNEG[i], dye)); attr(tb.liquid, 'opacity', i === 3 ? 0.45 : lerp(0.45, 0.88, dye)); });
      op(cLbl, P(t, mid('control', 0.62), 0.5, linear));
      op(cmp, P(t, mid('control', 0.76), 0.5, linear));
    }
  };
});

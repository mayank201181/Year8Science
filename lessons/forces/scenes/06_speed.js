/* Chapter 6, Speed and distance-time graphs.
   Beats: a runner on a track while a stopwatch runs -> speed = distance ÷ time -> metres and seconds give m/s,
   road signs in km/h and mph -> 100 m in 20 s: 100 ÷ 20 = 5 m/s -> a car's whole route: total distance, total
   time -> the trip: it speeds up, slows, waits at the lights; the gauge swings while the average holds
   -> a distance-time graph plots the journey live: sloping, flat (stationary, not backwards), sloping again
   -> a fast car (10 m/s) and a slow cyclist (3 m/s) from the origin, a gradient triangle: 100 m ÷ 10 s = 10 m/s
   -> Steeper is Speedier, Flat is Frozen. */
scene('speed', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;

  /* ---------- local helpers and art ---------- */
  const f1 = v => (+v).toFixed(1);
  const smooth = p => p * p * (3 - 2 * p);
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.8 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* text parts in a row centred on cx (baseline y); returns [{ el, x, w }] with each part's centre */
  function row(parent, cx, y, parts, size, gap) {
    gap = gap === undefined ? size * 0.3 : gap;
    const ws = parts.map(p => textWidth(p.t, size, FD, p.w || 600));
    const tot = ws.reduce((a, b) => a + b, 0) + gap * (parts.length - 1);
    let x = cx - tot / 2;
    const out = parts.map((p, i) => {
      const xc = x + ws[i] / 2; x += ws[i] + gap;
      return { el: T(parent, xc, y, p.t, { size, weight: p.w || 600, fill: p.fill || C.ink, anchor: 'middle' }), x: xc, w: ws[i] };
    });
    out.width = tot;
    return out;
  }
  /* stopwatch: the hand goes round once a minute, a digital reading below; g.set(seconds) */
  function stopwatch(parent, whole) {
    const g = G(parent);
    E('rect', { x: -13, y: -88, width: 26, height: 16, rx: 5, fill: '#8FA2B0' }, g);
    E('rect', { x: -6, y: -74, width: 12, height: 10, fill: '#8FA2B0' }, g);
    E('rect', { x: 44, y: -64, width: 20, height: 12, rx: 4, fill: '#8FA2B0', transform: 'rotate(42 54 -58)' }, g);
    E('circle', { r: 64, fill: '#E9EEF2', stroke: '#8FA2B0', 'stroke-width': 6 }, g);
    E('circle', { r: 55, fill: '#F7FAFC' }, g);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r1 = i % 3 ? 48 : 41; E('line', { x1: f1(Math.sin(a) * r1), y1: f1(-Math.cos(a) * r1), x2: f1(Math.sin(a) * 52), y2: f1(-Math.cos(a) * 52), stroke: '#3A4A56', 'stroke-width': i % 3 ? 2.5 : 4.5, 'stroke-linecap': 'round' }, g); }
    const hand = E('line', { x1: 0, y1: 9, x2: 0, y2: -44, stroke: C.bad, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 6.5, fill: C.bad }, g);
    const read = T(g, 0, 122, '0.0 s', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
    g.set = sec => { hand.setAttribute('transform', `rotate(${f1(sec * 6)})`); setText(read, whole ? Math.round(sec) + ' s' : sec.toFixed(1) + ' s'); };
    g.set(0);
    return g;
  }
  /* traffic lights on a pole standing on (0,0); g.set(red, amber, green) lights them (0..1 each) */
  function trafficLight(parent) {
    const g = G(parent);
    E('rect', { x: -5, y: -96, width: 10, height: 96, fill: '#6F808D' }, g);
    E('rect', { x: -21, y: -186, width: 42, height: 96, rx: 10, fill: '#1C2329', stroke: '#6F808D', 'stroke-width': 3 }, g);
    const lamps = [C.bad, C.glucose, C.good].map((c, i) => {
      const y = -168 + i * 30;
      E('circle', { cy: y, r: 11, fill: '#2C3740' }, g);
      const halo = E('circle', { cy: y, r: 28, fill: glow(c) }, g);
      const on = E('circle', { cy: y, r: 11, fill: c }, g);
      return [halo, on];
    });
    g.set = (r, a, gr) => [r, a, gr].forEach((v, i) => { op(lamps[i][0], v * 0.8); op(lamps[i][1], v); });
    g.set(1, 0, 0);
    return g;
  }
  /* round speed-limit sign on a post standing on (0, 128) */
  function roadSign(parent, num, unit) {
    const g = G(parent);
    E('rect', { x: -5, y: 40, width: 10, height: 88, fill: '#8FA2B0' }, g);
    E('circle', { r: 60, fill: '#F7FAFC', stroke: '#E8424F', 'stroke-width': 11 }, g);
    T(g, 0, 8, num, { size: 46, weight: 700, fill: '#1C2329', anchor: 'middle' });
    T(g, 0, 36, unit, { size: 24, weight: 700, fill: '#1C2329', anchor: 'middle' });
    return g;
  }
  /* speed gauge, 0..vmax m/s: the lib meter bar the other chapters use, with a readout; g.set(v) fills it;
     g.avg is a marker group set at avg. Centred on (0, 0). */
  function speedBar(parent, vmax, avg) {
    const g = G(parent), w = 240, h = 26, inner = G(g); tr(inner, -w / 2 - 50, -h / 2);
    const bar = meter(inner, { w, h, color: C.energy, label: 'speed' });
    g.avg = G(inner);
    const ax = w * avg / vmax;
    E('line', { x1: ax, x2: ax, y1: -8, y2: h + 8, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, g.avg);
    E('path', { d: `M${f1(ax)},${h + 12} l-9,14 l18,0 Z`, fill: C.ink }, g.avg);
    T(g.avg, ax, h + 54, 'average', { size: 26, weight: 700, fill: C.ink, anchor: 'middle' });
    const read = T(inner, w + 18, h - 2, '0 m/s', { size: 30, weight: 700, fill: C.ink });
    g.set = v => { bar.set(v / vmax); setText(read, Math.round(v) + ' m/s'); };
    g.set(0);
    return g;
  }
  /* six-armed snowflake of radius r */
  function snowflake(parent, r, color) {
    const g = G(parent);
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, c = Math.cos(a), s = Math.sin(a), px = k => f1(c * k), py = k => f1(s * k);
      d += `M0,0 L${px(r)},${py(r)} `;
      [0.55, 0.78].forEach(f => { const bx = c * r * f, by = s * r * f, b = r * 0.26; [1, -1].forEach(sg => { const a2 = a + sg * 0.7; d += `M${f1(bx)},${f1(by)} L${f1(bx + Math.cos(a2) * b)},${f1(by + Math.sin(a2) * b)} `; }); });
    }
    E('path', { d, fill: 'none', stroke: color || '#CFEFFF', 'stroke-width': Math.max(3, r * 0.13), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* flag on a pole standing on (0,0); chequered for the finish */
  function flagPole(parent, chequered) {
    const g = G(parent);
    E('rect', { x: -3, y: -92, width: 6, height: 92, fill: '#B9C6D2' }, g);
    if (chequered) for (let c = 0; c < 4; c++) for (let r2 = 0; r2 < 3; r2++) E('rect', { x: 3 + c * 11, y: -92 + r2 * 11, width: 11, height: 11, fill: (c + r2) % 2 ? '#1C2329' : '#F4F7FA' }, g);
    else E('path', { d: 'M3,-92 L46,-80 L3,-66 Z', fill: C.good }, g);
    return g;
  }
  const STAND = { lean: 0, armL: [8, 10], armR: [-8, 10], legL: [3, -3], legR: [-3, -3] };
  const blendPose = (a, b, u) => { const o = { lean: lerp(a.lean || 0, b.lean || 0, u) }; ['armL', 'armR', 'legL', 'legR'].forEach(k => { o[k] = [lerp(a[k][0], b[k][0], u), lerp(a[k][1], b[k][1], u)]; }); return o; };

  /* ================= A. the runner, the formula, the units ================= */
  const A = G(root);
  const TX0 = 150, TX1 = 1050, PXM = (TX1 - TX0) / 100, TY = 620;
  const track = G(A);
  E('rect', { x: 50, y: 598, width: 1100, height: 44, rx: 6, fill: '#9C4A37' }, track);
  E('path', { d: 'M50,599 H1150 M50,641 H1150', stroke: '#F4E9E2', 'stroke-width': 3 }, track);
  E('line', { x1: 50, x2: 1150, y1: 620, y2: 620, stroke: '#F4E9E2', 'stroke-width': 2, opacity: 0.4 }, track);
  for (let m = 0; m <= 100; m += 20) {
    const x = TX0 + m * PXM;
    if (m < 100) E('line', { x1: x, x2: x, y1: 600, y2: 640, stroke: '#FFFFFF', 'stroke-width': m === 0 ? 7 : 3, opacity: m === 0 ? 1 : 0.55 }, track);
    T(track, x, 682, m + ' m', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  }
  for (let c = 0; c < 2; c++) for (let r2 = 0; r2 < 5; r2++) E('rect', { x: TX1 - 8 + c * 8, y: 600 + r2 * 8, width: 8, height: 8, fill: (c + r2) % 2 ? '#1C2329' : '#F4F7FA' }, track);
  const runG = G(A), runner = person(runG, {});
  const howFar = fmDim(A, TX0, 404, TX0 + 2, 404, 'how far', { side: 'above' });
  const WX = 1030, WY = 200;
  const watch = stopwatch(A); tr(watch, WX, WY);
  const wLab = T(A, WX, WY + 176, 'in a certain time', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  // formula card
  const FX = 480, FY = 176;
  const fG = G(A), fBack = G(fG);
  const fP = row(fG, FX, FY + 20, [{ t: 'speed', fill: C.energy, w: 700 }, { t: '=', fill: C.muted }, { t: 'distance', w: 700 }, { t: '÷', fill: C.muted }, { t: 'time', w: 700 }], 56);
  card(fBack, FX - fP.width / 2 - 40, FY - 50, fP.width + 80, 100, { fill: C.card, stroke: C.line });
  // units
  const chM = chip(A, 'metres (m)', { size: 30, fill: C.card2, stroke: C.line });
  const chS = chip(A, 'seconds (s)', { size: 30, fill: C.card2, stroke: C.line });
  const chMS = chip(A, 'metres per second (m/s)', { size: 32, fill: '#33300F', stroke: C.energy, color: C.energy });
  const UY = 300;
  const signs = [roadSign(A, '50', 'km/h'), roadSign(A, '30', 'mph')];
  const SIGNX = [700, 880], SIGNY = 470;
  // the runner's sum
  const sumG = G(A);
  const sP = row(sumG, FX, 318, [{ t: '100 m', w: 700 }, { t: '÷', fill: C.muted }, { t: '20 s', w: 700 }, { t: '=', fill: C.muted }, { t: '5 m/s', fill: C.energy, w: 700 }], 50);

  /* ================= B. the road: a car's trip ================= */
  const B = G(root);
  const RX0 = 200, RPX = 4.5;                       // the car's front bumper is at RX0 + RPX x distance (m)
  const road = G(B);
  const flagS = flagPole(road, false); tr(flagS, RX0 - 14, 262);
  const flagF = flagPole(road, true); tr(flagF, RX0 + 200 * RPX + 14, 262);
  E('rect', { x: 40, y: 262, width: 1120, height: 44, rx: 6, fill: '#33404A' }, road);
  E('path', { d: 'M40,263 H1160 M40,305 H1160', stroke: '#8FA2B0', 'stroke-width': 3 }, road);
  E('line', { x1: 52, x2: 1150, y1: 284, y2: 284, stroke: '#E9EEF2', 'stroke-width': 3, 'stroke-dasharray': '22 18', opacity: 0.55 }, road);
  E('rect', { x: RX0 - 3, y: 264, width: 6, height: 40, fill: '#F4F7FA', opacity: 0.85 }, road);
  for (let r2 = 0; r2 < 5; r2++) for (let c = 0; c < 2; c++) E('rect', { x: RX0 + 200 * RPX - 6 + c * 6, y: 264 + r2 * 8, width: 6, height: 8, fill: (c + r2) % 2 ? '#1C2329' : '#F4F7FA' }, road);
  const LX = RX0 + 100 * RPX + 40;
  const lights = trafficLight(B); tr(lights, LX, 262);
  const carG = G(B), car = fmCar(carG, {});
  const cycG = G(B), cyc = fmCyclist(cycG, { shirt: '#7FC4F0' });
  const CS = 0.5;                                   // vehicles drawn at half size
  // the route, the trip readouts
  const B2 = G(B);
  const totD = fmDim(B2, RX0, 336, RX0 + 200 * RPX, 336, 'total distance');
  const aF = G(B2), aBack = G(aF);
  const aL1 = T(aF, 480, 470, '**average speed** =', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const aL2 = T(aF, 480, 528, 'total distance ÷ total time', { size: 40, weight: 700, anchor: 'middle' });
  card(aBack, 480 - 290, 418, 580, 140, { fill: C.card, stroke: C.line });
  const tW = stopwatch(B2, true);
  const tWX = 960, tWY = 486;
  const tWLab = T(B2, tWX, tWY - 104, 'total time', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const gauge = speedBar(B2, 15, 5); const GAX = 300, GAY = 488;
  const avgChip = chip(B2, 'average speed = 200 m ÷ 40 s = 5 m/s', { size: 30, fill: '#33300F', stroke: C.energy, color: C.energy });
  const ACX = 640, ACY = 664;

  /* ================= C. the distance-time graph ================= */
  const Cg = G(root);
  const GX = 220, GY = 625, GW = 600, GH = 280;
  const grG = G(Cg); tr(grG, GX, GY);
  const gr = fmGraph(grG, { w: GW, h: GH, xmax: 40, ymax: 200, xstep: 10, ystep: 50 });
  const xlG = G(grG); T(xlG, 0, 0, 'time (s)', { size: 28, weight: 700, anchor: 'middle' });
  const ylG = G(grG); T(ylG, 0, 0, 'distance (m)', { size: 28, weight: 700, anchor: 'middle' });
  const sweepX = E('line', { x1: 0, y1: 0, x2: GW + 26, y2: 0, stroke: C.ink, 'stroke-width': 16, 'stroke-linecap': 'round', opacity: 0.3, pathLength: 1, 'stroke-dasharray': '1 1' }, grG);
  const sweepY = E('line', { x1: 0, y1: 0, x2: 0, y2: -GH - 26, stroke: C.ink, 'stroke-width': 16, 'stroke-linecap': 'round', opacity: 0.3, pathLength: 1, 'stroke-dasharray': '1 1' }, grG);
  grG.insertBefore(sweepX, gr); grG.insertBefore(sweepY, gr);
  const px = gr.px;
  const guides = G(gr);
  const gH = E('line', { stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, guides);
  const gV = E('line', { stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, guides);
  const JOUR = [[0, 0], [10, 100], [30, 100], [40, 200]];
  const flatHi = E('line', { x1: px(10, 100)[0], y1: px(10, 100)[1], x2: px(30, 100)[0], y2: px(30, 100)[1], stroke: C.energyLt, 'stroke-width': 18, 'stroke-linecap': 'round', opacity: 0.3 }, gr);
  const jLine = gr.line(JOUR, { dot: true });
  const statLab = T(grG, px(20, 100)[0], px(20, 100)[1] - 24, 'stationary', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const backG = G(grG);
  const bkW = textWidth('going backwards', 28, FD, 700) + 96;
  E('rect', { x: -bkW / 2, y: -25, width: bkW, height: 50, rx: 25, fill: C.card2, stroke: C.line, 'stroke-width': 3 }, backG);
  arrow(backG, -bkW / 2 + 62, 0, -bkW / 2 + 22, 0, { color: C.ink, width: 4 });
  T(backG, -bkW / 2 + 76, 10, 'going backwards', { size: 28, weight: 700 });
  const backStrike = strike(backG, -bkW / 2 + 10, 0, bkW / 2 - 10);
  tr(backG, px(20, 100)[0], px(20, 100)[1] + 62);
  const steadyLab = T(grG, px(35, 150)[0] + 36, px(35, 150)[1] + 14, 'steady speed', { size: 30, weight: 700, fill: C.ink });
  const lCar = gr.line([[0, 0], [20, 200]], { dot: true });
  const lCyc = gr.line([[0, 0], [40, 120]], { dot: true, color: C.air });
  const carLab = T(grG, px(20, 200)[0] + 22, px(20, 200)[1] + 9, 'fast car', { size: 28, weight: 700, fill: C.energy });
  const cycLab = T(grG, px(40, 120)[0], px(40, 120)[1] - 22, 'slow cyclist', { size: 28, weight: 700, fill: C.air, anchor: 'end' });
  const tri = G(grG);
  const t0p = px(10, 100), t1p = px(20, 100), t2p = px(20, 200);
  const legH = E('line', { x1: t0p[0], y1: t0p[1], x2: t0p[0], y2: t0p[1], stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, tri);
  const legV = E('line', { x1: t1p[0], y1: t1p[1], x2: t1p[0], y2: t1p[1], stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, tri);
  const triH = T(tri, (t0p[0] + t1p[0]) / 2, t0p[1] + 34, '10 s', { size: 28, weight: 700, anchor: 'middle' });
  const triV = T(tri, t1p[0] + 14, (t1p[1] + t2p[1]) / 2 + 10, '100 m', { size: 28, weight: 700 });
  const gradChip = chip(Cg, 'gradient = speed', { size: 32, fill: '#33300F', stroke: C.energy, color: C.energy });
  const calcG = G(Cg);
  T(calcG, 0, 0, '100 m ÷ 10 s', { size: 30, weight: 700, anchor: 'middle' });
  T(calcG, 0, 44, '= 10 m/s', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const GCX = 1012;

  /* ================= D. Steeper is Speedier, Flat is Frozen ================= */
  const Dg = G(root);
  card(Dg, 300, 118, 600, 186, { fill: C.card, stroke: C.energy, sw: 3 });
  const rowA = G(Dg), rowB = G(Dg);
  E('path', { d: 'M352,206 L414,140', stroke: C.energy, 'stroke-width': 8, 'stroke-linecap': 'round' }, rowA);
  E('path', { d: 'M418,136 L396,140 L412,156 Z', fill: C.energy, stroke: C.energy, 'stroke-width': 4, 'stroke-linejoin': 'round' }, rowA);
  T(rowA, 450, 190, 'Steeper is **Speedier**', { size: 44, weight: 600, boldFill: C.energy });
  E('line', { x1: 348, y1: 268, x2: 420, y2: 268, stroke: C.air, 'stroke-width': 8, 'stroke-linecap': 'round' }, rowB);
  const flake = snowflake(rowB, 20); tr(flake, 384, 240);
  T(rowB, 450, 278, 'Flat is **Frozen**', { size: 44, weight: 600, boldFill: C.air });

  /* ---------- motion: where the car (and the cyclist) is at time t ---------- */
  // the trip (car line): speeds up, slows to stop at the lights at 100 m, waits, then on to 200 m: 40 s in all
  const TT0 = at('car') + 0.3, KT = 40 / 5.4;
  const tripD = q => q < 12 ? 100 * smooth(q / 12) : q < 27 ? 100 : 100 + 100 * smooth(clamp((q - 27) / 13));
  const tripV = q => { const p = q < 12 ? q / 12 : q < 27 ? -1 : clamp((q - 27) / 13); return p < 0 || p >= 1 ? 0 : 6 * p * (1 - p) * 100 / (q < 12 ? 12 : 13); };
  // the replay (graph): steady 10 m/s, 20 s at the lights, steady 10 m/s
  const KJ = 20 / 7, TJ0 = at('flat') - 10 / KJ;
  const jourD = q => q < 10 ? 10 * q : q < 30 ? 100 : Math.min(200, 100 + 10 * (q - 30));
  // the race (steep): car at 10 m/s, cyclist at 4 m/s
  const TR0 = at('steep') + 0.7, KR = 40 / 3;

  return t => {
    /* ================= A ================= */
    const aA = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('average') - 0.35, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      const r1t0 = S.first + 0.15, r1off = at('formula') - 0.35, V1 = 5 * PXM * 2.2;
      const r2in = at('runner') - 0.45, r2t0 = at('runner') + 0.3, r2t1 = mid('runner', 0.5);
      let rx, pose, rOp, secs, dist, lab;
      if (t < r2in) {
        const u = Math.max(0, Math.min(t, r1off + 0.3) - r1t0);
        rx = TX0 + V1 * u; dist = u * 5 * 2.2; secs = u * 2.2; lab = 'how far';
        pose = blendPose(STAND, runPose(t, 2.2), clamp(u / 0.35));
        rOp = 1 - P(t, r1off, 0.3, linear);
      } else {
        const u = clamp((t - r2t0) / (r2t1 - r2t0)), over = Math.max(0, t - r2t1);
        const runOut = 9 * PXM * easeOut(clamp(over / 0.8));
        rx = TX0 + 100 * PXM * u + runOut; dist = 100 * u; secs = 20 * u; lab = Math.round(dist) + ' m';
        const go = clamp((t - r2t0) / 0.3) * (1 - clamp((over - 0.25) / 0.6));
        pose = blendPose(STAND, runPose(t, 2.6), go);
        rOp = P(t, r2in, 0.35, linear);
      }
      runner.pose(pose); tr(runG, rx, TY, 0.9); op(runG, rOp);
      howFar.to(TX0, 404, TX0 + Math.max(2, dist * PXM), 404, lab); op(howFar, rOp * clamp(dist / 3));
      watch.set(secs);
      op(wLab, win(t, mid('speed', 0.45), at('formula') - 0.1, 0.4));
      // formula
      const fp = P(t, at('formula') + 0.05, 0.6, pop);
      op(fG, clamp(fp * 2));
      fG.setAttribute('transform', `translate(${FX} ${FY + (1 - clamp(fp)) * 16}) scale(${Math.max(0.01, 0.85 + 0.15 * fp).toFixed(3)}) translate(${-FX} ${-FY})`);
      // units: metres from the track, seconds from the stopwatch, then together: metres per second
      const uOut = 1 - P(t, at('runner') - 0.35, 0.35, linear);
      const mP = P(t, mid('units', 0.06), 0.8), sPp = P(t, mid('units', 0.24), 0.8), mg = P(t, mid('units', 0.44), 0.6);
      tr(chM, lerp(lerp(600, fP[2].x, mP), FX, mg), lerp(650, UY, mP));
      op(chM, P(t, mid('units', 0.06), 0.25, linear) * (1 - P(t, mid('units', 0.44) + 0.35, 0.25, linear)));
      tr(chS, lerp(lerp(WX, fP[4].x, sPp), FX, mg), lerp(WY + 178, UY, sPp));
      op(chS, P(t, mid('units', 0.24), 0.25, linear) * (1 - P(t, mid('units', 0.44) + 0.35, 0.25, linear)));
      const msp = P(t, mid('units', 0.44) + 0.4, 0.5, pop);
      popIn(chMS, msp, FX, UY, 0.7); op(chMS, clamp(msp * 2) * uOut);
      signs.forEach((sg, i) => { const p = P(t, mid('units', [0.64, 0.84][i]), 0.55, pop); popIn(sg, p, SIGNX[i], SIGNY, 0.6); op(sg, clamp(p * 2) * uOut); });
      // the runner's sum
      [0.52, 0.6, 0.6, 0.8, 0.8].forEach((f, i) => { const p = P(t, mid('runner', f), 0.45, easeOut); op(sP[i].el, p); sP[i].el.setAttribute('transform', `translate(0 ${f1((1 - p) * 12)})`); });
    }

    /* ================= B ================= */
    const aB = Math.min(P(t, at('average') - 0.1, 0.5, linear), 1 - P(t, at('frozen') - 0.25, 0.45, linear));
    op(B, aB);
    if (aB > 0) {
      // where the car is, and the lights
      let d = 0, cOp = 1, red = 1, amb = 0, grn = 0;
      const tripEnd = TT0 + 40 / KT, jourEnd = TJ0 + 40 / KJ;
      if (t < at('graph') - 0.1) {
        const q = clamp((t - TT0) * KT, 0, 40); d = tripD(q);
        red = q < 27 ? 1 : 0; amb = q >= 26 && q < 27 ? 1 : 0; grn = q >= 27 ? 1 : 0;
        cOp = P(t, mid('average', 0.22), 0.4, linear) * (1 - P(t, at('graph') - 0.45, 0.3, linear));
        gauge.set(tripV(q));
        tW.set(q);
      } else if (t < jourEnd + 0.25) {
        const q = clamp((t - TJ0) * KJ, 0, 40); d = jourD(q);
        red = q < 30 ? 1 : 0; amb = q >= 29 && q < 30 ? 1 : 0; grn = q >= 30 ? 1 : 0;
        cOp = P(t, at('graph') - 0.05, 0.35, linear) * (1 - P(t, jourEnd, 0.22, linear));
      } else {
        d = 10 * clamp((t - TR0) * KR, 0, 20); red = 0; grn = 1;
        cOp = P(t, jourEnd + 0.3, 0.3, linear);
      }
      lights.set(red, amb, grn);
      const cx = RX0 + RPX * d - 136 * CS;
      tr(carG, cx, 276, CS); car.roll(RPX * d / CS); op(carG, cOp);
      // the cyclist joins the race
      const dc = 3 * clamp((t - TR0) * KR, 0, 40);
      tr(cycG, RX0 + RPX * dc - 94 * CS, 300, CS); cyc.roll(RPX * dc / CS);
      op(cycG, P(t, TJ0 + 40 / KJ + 0.3, 0.3, linear));
      op(road, P(t, at('average') - 0.1, 0.5, linear));
      // the route and the trip readouts
      const b2 = 1 - P(t, at('graph') - 0.4, 0.4, linear);
      op(B2, b2);
      if (b2 > 0) {
        const dp = P(t, mid('average', 0.42), 0.6, easeOut);
        op(totD, dp); totD.to(RX0, 336, RX0 + 200 * RPX * dp + 1, 336, t > at('car') + 0.2 ? 'total distance: 200 m' : 'total distance');
        const ap = P(t, mid('average', 0.6), 0.6, pop);
        op(aF, clamp(ap * 2) * (1 - P(t, at('car') - 0.1, 0.4, linear)));
        aF.setAttribute('transform', `translate(480 488) scale(${Math.max(0.01, 0.85 + 0.15 * ap).toFixed(3)}) translate(-480 ${-488 + (1 - clamp(ap)) * 16})`);
        const tp = P(t, mid('average', 0.5), 0.55, pop);
        popIn(tW, tp, tWX, tWY, 0.7); op(tWLab, clamp(tp * 2));
        const gp = P(t, at('car') + 0.05, 0.55, pop);
        popIn(gauge, gp, GAX, GAY, 0.7);
        op(gauge.avg, P(t, mid('car', 0.6), 0.4, linear));
        const cp = P(t, mid('car', 0.6), 0.5, pop);
        popIn(avgChip, cp, ACX, ACY, 0.8);
      }
    }

    /* ================= C ================= */
    const aC = P(t, at('graph') - 0.1, 0.6, linear);
    op(Cg, aC);
    if (aC > 0) {
      const xp = P(t, mid('graph', 0.5), 0.5, pop), yp = P(t, mid('graph', 0.76), 0.5, pop);
      op(xlG, clamp(xp * 2)); tr(xlG, GW / 2, 78, Math.max(0.01, 0.8 + 0.2 * xp));
      op(ylG, clamp(yp * 2)); ylG.setAttribute('transform', `translate(-78 ${-GH / 2}) rotate(-90) scale(${Math.max(0.01, 0.8 + 0.2 * yp).toFixed(3)})`);
      sweepX.setAttribute('stroke-dashoffset', (1 - P(t, mid('graph', 0.5), 0.8)).toFixed(3)); op(sweepX, win(t, mid('graph', 0.5), mid('graph', 0.76) + 0.5, 0.3));
      sweepY.setAttribute('stroke-dashoffset', (1 - P(t, mid('graph', 0.76), 0.8)).toFixed(3)); op(sweepY, win(t, mid('graph', 0.76), end('graph') + 0.5, 0.3));
      // the journey plots itself
      const q = clamp((t - TJ0) * KJ, 0, 40), jOut = 1 - P(t, at('steep') + 0.15, 0.4, linear);
      jLine.set(q); op(jLine, (t >= TJ0 ? 1 : 0) * jOut);
      const dot = px(q, jourD(q));
      attr(gH, 'x1', 0); attr(gH, 'y1', dot[1]); attr(gH, 'x2', dot[0]); attr(gH, 'y2', dot[1]);
      attr(gV, 'x1', dot[0]); attr(gV, 'y1', 0); attr(gV, 'x2', dot[0]); attr(gV, 'y2', dot[1]);
      op(guides, (t >= TJ0 ? 1 : 0) * (1 - P(t, mid('flat', 0.56), 0.4, linear)) * 0.8);
      attr(flatHi, 'x2', px(clamp(q, 10, 30), 100)[0]); op(flatHi, q > 10.3 ? win(t, at('flat'), at('slope'), 0.4) : 0);
      const sp = P(t, mid('flat', 0.22), 0.5, pop);
      op(statLab, clamp(sp * 2) * jOut); statLab.setAttribute('transform', `translate(0 ${f1((1 - clamp(sp)) * 12)})`);
      const bp = P(t, mid('flat', 0.6), 0.5, pop);
      op(backG, clamp(bp * 2) * (1 - P(t, at('slope') + 0.1, 0.4, linear)));
      backStrike.set(P(t, mid('flat', 0.74), 0.4));
      op(steadyLab, P(t, mid('slope', 0.3), 0.4, linear) * jOut);
      // the race: two lines from the origin
      const qc = clamp((t - TR0) * KR, 0, 20), qy = clamp((t - TR0) * KR, 0, 40), rOn = t >= TR0 ? 1 : 0;
      lCar.set(qc); op(lCar, rOn); lCyc.set(qy); op(lCyc, rOn);
      op(carLab, P(t, TR0 + 20 / KR, 0.35, linear)); op(cycLab, P(t, TR0 + 40 / KR, 0.35, linear));
      // the gradient triangle
      const hP = P(t, mid('steep', 0.47), 0.5), vP = P(t, mid('steep', 0.47) + 0.5, 0.5);
      attr(legH, 'x2', lerp(t0p[0], t1p[0], hP)); attr(legV, 'y2', lerp(t1p[1], t2p[1], vP));
      op(legH, hP > 0 ? 1 : 0); op(legV, vP > 0 ? 1 : 0);
      op(triH, P(t, mid('steep', 0.47) + 0.3, 0.35, linear)); op(triV, P(t, mid('steep', 0.47) + 0.8, 0.35, linear));
      const gp = P(t, mid('steep', 0.66), 0.5, pop); popIn(gradChip, gp, GCX, 470, 0.7);
      const kp = P(t, mid('steep', 0.82), 0.5, pop); popIn(calcG, kp, GCX, 548, 0.8);
    }

    /* ================= D ================= */
    const aD = P(t, at('frozen') - 0.05, 0.45, linear);
    op(Dg, aD);
    if (aD > 0) {
      const pa = P(t, mid('frozen', 0.12), 0.5, pop), pb = P(t, mid('frozen', 0.5), 0.5, pop);
      op(rowA, clamp(pa * 2)); tr(rowA, 0, (1 - clamp(pa)) * 12);
      op(rowB, clamp(pb * 2)); tr(rowB, 0, (1 - clamp(pb)) * 12);
      flake.setAttribute('transform', `translate(384 240) rotate(${f1(R ? 0 : t * 20)})`);
    }
  };
});

/* Scene 5: The longest half hour (speed and distance-time graphs).
   Beats: noon, the lorry pulls up, boxes go in, 15 km in half an hour -> Rex at a roadside whiteboard:
   speed = distance ÷ time, m/s and km/h -> Kavya in the cab works out 30 km/h; Grandma overtakes on a
   scooter; Kavya's flat stare -> the dashboard: the needle swings around an average of 30 km/h (Rex is
   the bobblehead) -> the distance-time graph draws itself in sync with a mini lorry on a road strip:
   straight = steady, steeper = faster -> Pushpa on the roof on the expressway -> the flat bit: "backwards?"
   -> stationary: the traffic jam, Rex a dot on his break, ten minutes on the clock -> Frieda, feet up,
   smug -> the last piece and a gradient triangle: 9 km ÷ 9 min = 60 km/h, gradient = speed. */
scene('lorry', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed lorry) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const lorryCam = (el, k, cx, cy, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const lorryPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const seat = (ch, wrap) => { if (ch.parentNode !== wrap) wrap.appendChild(ch); };
  // a multi-line card centred on its origin: rows = [[text, size, colour], ...]
  function lorryCard(parent, rows, o) {
    o = o || {};
    const g = G(parent), pad = o.pad || 26, gap = o.gap || 12;
    const w = o.w || Math.max(...rows.map(([s, z]) => textWidth(s, z, FD, 800))) + pad * 2;
    const hs = rows.map(([, z]) => z * 1.12), h = hs.reduce((a, b) => a + b, 0) + gap * (rows.length - 1) + pad * 1.6;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    let y = -h / 2 + pad * 0.8;
    g.rows = rows.map(([s, z, col], i) => { y += hs[i]; const el = T(g, 0, y - z * 0.22, s, { size: z, weight: 800, anchor: 'middle', fill: col || C.ink }); y += gap; return el; });
    g.w = w; g.h = h;
    return g;
  }
  // a wall clock: g.set(hour, minute, sweepFrom, sweepTo) (minutes); the swept wedge is shaded
  function lorryClock(parent, r, col) {
    const g = G(parent);
    E('circle', { r: r + 8, fill: '#2A1A22' }, g);
    E('circle', { r, fill: '#FFFDF5', stroke: '#C9C0AA', 'stroke-width': 3 }, g);
    const wedge = E('path', { d: '', fill: col || ppCol.resultant, opacity: 0.55 }, g);
    let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = i % 3 ? r * 0.84 : r * 0.74; ticks += `M${(Math.sin(a) * r0).toFixed(1)},${(-Math.cos(a) * r0).toFixed(1)} L${(Math.sin(a) * r * 0.95).toFixed(1)},${(-Math.cos(a) * r * 0.95).toFixed(1)} `; }
    E('path', { d: ticks, stroke: '#2A1A22', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const hh = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.5, stroke: '#2A1A22', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    const mh = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.8, stroke: '#2A1A22', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 6, fill: '#E8424F' }, g);
    g.set = (h, m, s0, s1) => {
      tr(mh, 0, 0, 1, m * 6); tr(hh, 0, 0, 1, ((h % 12) + m / 60) * 30);
      if (s1 === undefined || s1 - s0 < 0.05) { attr(wedge, 'd', ''); return; }
      const a0 = s0 / 60 * TAU, a1 = s1 / 60 * TAU, rr = r * 0.92, big = s1 - s0 > 30 ? 1 : 0;
      attr(wedge, 'd', `M0,0 L${(Math.sin(a0) * rr).toFixed(1)},${(-Math.cos(a0) * rr).toFixed(1)} A${rr},${rr} 0 ${big} 1 ${(Math.sin(a1) * rr).toFixed(1)},${(-Math.cos(a1) * rr).toFixed(1)} Z`);
    };
    g.set(12, 0);
    return g;
  }
  // a small car, facing right; g.brake(v) lights the brake light
  function lorryCar(parent, col) {
    const g = G(parent), K = SC_INK;
    E('path', { d: 'M-80,-20 L-80,-46 Q-78,-56 -62,-58 L-40,-60 L-24,-88 Q-20,-94 -10,-94 L36,-94 Q46,-94 52,-86 L70,-60 L84,-56 Q96,-52 96,-40 L96,-20 Z', fill: col, stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-18,-62 L-6,-84 L18,-84 L18,-62 Z M26,-62 L26,-84 L40,-84 L56,-62 Z', fill: '#BFE6FF', stroke: K, 'stroke-width': 3 }, g);
    const bl = E('rect', { x: -86, y: -52, width: 10, height: 14, rx: 3, fill: '#FF3B3B' }, g);
    [-46, 60].forEach(x => { E('circle', { cx: x, cy: -18, r: 18, fill: '#232323', stroke: K, 'stroke-width': 3 }, g); E('circle', { cx: x, cy: -18, r: 7, fill: '#B9C2CB' }, g); });
    g.brake = v => attr(bl, 'fill', v > 0.5 ? '#FF3B3B' : '#8A2020');
    return g;
  }
  // FORCE-CAM overlay (same look as the cold open)
  function lorryFcam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    g.dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); if (v) op(g.dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }

  const Lworld = G(root), Lover = G(root), Lgraph = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the road (one set, reused by every road shot) ================= */
  const roadCam = G(Lworld);
  const road = ppRoad(roadCam);
  const backCars = G(roadCam);
  const jamBack = [[90, '#3F5BD9'], [280, '#56D69B'], [910, '#FFC247'], [1100, '#B48CFF']].map(([x, c]) => { const k = lorryCar(backCars, c); tr(k, x, 560, 0.8); return k; });
  const lorryG = G(roadCam);
  const lorry = ppLorry(lorryG);
  const kidWin = G(lorryG);                    // Kavya, tiny, in the cab window (wide shot)
  // the crew on the lorry roof (jam): deckchair, ON BREAK sign, Frieda's feet up
  const roofG = G(lorryG);
  const chair = G(roofG);
  E('path', { d: 'M-46,0 L-20,-60 M40,0 L-14,-58 M-56,-26 L52,-26', stroke: '#8C6235', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, chair);
  E('path', { d: 'M-22,-58 Q10,-30 46,-26 L-50,-26 Z', fill: '#FF7A59', stroke: SC_INK, 'stroke-width': 3, opacity: 0.95 }, chair);
  const breakSign = G(roofG);
  E('line', { x1: 0, y1: 0, x2: 0, y2: -80, stroke: '#8C6235', 'stroke-width': 6 }, breakSign);
  const bsChip = chip(breakSign, 'ON BREAK', { size: 26, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 3, rx: 8 }); tr(bsChip, 0, -98);
  const feet = G(roofG);
  tr(ppBox(feet, 'MISC', { size: 30 }), 0, 0, 0.42);
  [-22, 14].forEach(x => E('ellipse', { cx: x, cy: -46, rx: 22, ry: 13, fill: '#6A4A33', stroke: SC_INK, 'stroke-width': 3 }, feet));
  const drink = G(roofG);
  E('path', { d: 'M-14,-40 L14,-40 L10,0 L-10,0 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, drink);
  E('path', { d: 'M4,-40 L12,-64 L22,-64', stroke: '#E8424F', 'stroke-width': 4, fill: 'none' }, drink);
  const crewWorld = G(roofG);                  // crew seated in the road world (zooms with it)
  const boxesG = G(roadCam);
  const LOADB = [[150, 700], [270, 704], [205, 650]].map(([x, y]) => { const b = ppBox(boxesG, 'MISC', { size: 34 }); return { b, x, y }; });
  const frontCars = G(roadCam);
  const jamFront = [[140, '#E8424F'], [430, '#9AA6B2'], [790, '#4CC9F0'], [1060, '#FF9466']].map(([x, c]) => { const k = lorryCar(frontCars, c); tr(k, x, 740, 1.05); return k; });
  // Grandma on her scooter (wide shot)
  const gran = G(roadCam);
  const granBody = G(gran);
  const scoot = G(granBody);
  E('path', { d: 'M-70,-30 L60,-30 Q80,-30 84,-50 L96,-120', fill: 'none', stroke: '#E8424F', 'stroke-width': 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, scoot);
  E('path', { d: 'M84,-122 L112,-128', stroke: SC_INK, 'stroke-width': 8, 'stroke-linecap': 'round' }, scoot);
  E('path', { d: 'M-74,-36 Q-60,-70 -10,-64 L30,-34 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4 }, scoot);
  const granWheels = [-60, 78].map(x => { const w = G(scoot); tr(w, x, -16); E('circle', { r: 17, fill: '#232323', stroke: SC_INK, 'stroke-width': 3 }, w); E('line', { x1: -8, y1: 0, x2: 8, y2: 0, stroke: '#9AA6B2', 'stroke-width': 3 }, w); return w; });
  const granP = person(granBody, { skin: '#D9A07A', shirt: '#8E5BD9', shorts: '#5A3F7A', hair: '#E6E6E6', shoes: '#2A1A22' });
  tr(granP, -16, 16, 0.85);
  granP.pose({ lean: 14, armL: [70, 20], armR: [76, 14], legL: [80, -78], legR: [86, -82] });
  E('path', { d: 'M-20,-140 Q-20,-170 6,-170 Q32,-170 30,-142 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, granBody);   // helmet
  const granLines = E('path', { d: 'M-120,-150 L-200,-150 M-130,-110 L-230,-110 M-120,-70 L-190,-70', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, gran);
  const granTag = pill(gran, 'Grandma', { size: 28, color: '#FFE45C', stroke: '#FFE45C' }); tr(granTag, 10, -214);
  // wind / speed streaks for the expressway
  const streaks = G(roadCam);
  const STREAK = [[300, 300], [140, 360], [380, 250], [60, 420], [260, 470]].map(([x, y]) => E('line', { x1: 0, y1: y, x2: 140, y2: y, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7, 'data-x': x }, streaks));
  const hairLines = E('path', { d: 'M-70,-110 L-150,-120 M-80,-80 L-170,-80 M-60,-140 L-130,-160', stroke: '#2B1D14', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, crewWorld);

  /* ================= overlays: cab interior, dashboard, graph dimmer ================= */
  const cab = G(Lover);
  E('path', { d: 'M0,0 L1200,0 L1200,90 Q600,60 0,90 Z', fill: '#2B3138' }, cab);                                        // roof
  E('path', { d: 'M0,0 L120,0 L40,560 L0,560 Z M1200,0 L1080,0 L1160,560 L1200,560 Z', fill: '#3A4048' }, cab);            // pillars
  E('path', { d: 'M0,520 Q600,470 1200,520 L1200,750 L0,750 Z', fill: linGrad('#4A525C', '#2A3036', true), stroke: '#1C2126', 'stroke-width': 6 }, cab);   // dashboard
  E('rect', { x: 120, y: 540, width: 220, height: 40, rx: 10, fill: '#1C2126' }, cab);
  E('rect', { x: 860, y: 26, width: 180, height: 40, rx: 10, fill: '#1C2126', stroke: '#5A646E', 'stroke-width': 3 }, cab);   // mirror
  const dash = G(Lover);
  E('path', { d: 'M0,330 Q600,280 1200,330 L1200,750 L0,750 Z', fill: linGrad('#3F464F', '#22272D', true), stroke: '#15191D', 'stroke-width': 6 }, dash);
  E('path', { d: 'M0,0 L1200,0 L1200,70 Q600,50 0,70 Z', fill: '#2B3138' }, dash);
  // speedometer: 0..80 km/h over 240 degrees
  const speedo = G(dash); tr(speedo, 360, 540);
  const SPR = 175, ang = v => (-120 + 240 * v / 80) * Math.PI / 180;   // 0 = straight up
  E('circle', { r: SPR + 16, fill: '#15191D', stroke: '#8E99A4', 'stroke-width': 6 }, speedo);
  E('circle', { r: SPR, fill: '#0E1A24' }, speedo);
  let tkB = '', tkS = '';
  for (let v = 0; v <= 80; v += 5) {
    const a = ang(v), big = v % 20 === 0, r0 = big ? SPR - 34 : v % 10 ? SPR - 14 : SPR - 24;
    const seg = `M${(Math.sin(a) * r0).toFixed(1)},${(-Math.cos(a) * r0).toFixed(1)} L${(Math.sin(a) * (SPR - 4)).toFixed(1)},${(-Math.cos(a) * (SPR - 4)).toFixed(1)} `;
    if (big) tkB += seg; else tkS += seg;
    if (big) T(speedo, Math.sin(a) * (SPR - 64), -Math.cos(a) * (SPR - 64) + 10, String(v), { size: 30, weight: 800, anchor: 'middle', fill: '#F2F7FA' });
  }
  E('path', { d: tkB, stroke: '#F2F7FA', 'stroke-width': 5 }, speedo); E('path', { d: tkS, stroke: '#F2F7FA', 'stroke-width': 3 }, speedo);
  const avgA = ang(30);
  E('line', { x1: Math.sin(avgA) * 40, y1: -Math.cos(avgA) * 40, x2: Math.sin(avgA) * (SPR + 30), y2: -Math.cos(avgA) * (SPR + 30), stroke: ppCol.resultant, 'stroke-width': 6, 'stroke-dasharray': '12 9' }, speedo);
  T(speedo, 0, 74, 'km/h', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const needle = E('path', { d: `M-7,14 L0,${-SPR + 22} L7,14 Z`, fill: '#FF3B3B', stroke: '#7A1010', 'stroke-width': 2 }, speedo);
  E('circle', { r: 16, fill: '#9AA6B2', stroke: '#15191D', 'stroke-width': 3 }, speedo);
  const avgTag = pill(dash, 'average: 30 km/h', { size: 28, color: ppCol.resultant, stroke: ppCol.resultant }); tr(avgTag, 360, 725 - 12);
  const spring = E('path', { d: '', fill: 'none', stroke: '#B9C2CB', 'stroke-width': 5 }, dash);
  E('rect', { x: 880, y: 600, width: 120, height: 22, rx: 8, fill: '#15191D' }, dash);
  const dashRexSeat = G(dash);
  const avgCard = lorryCard(Lfg, [['AVERAGE speed', 46, ppCol.resultant], ['= total distance ÷ total time', 38, C.ink]]);
  const notSteady = pill(Lfg, 'not steady!', { size: 32, color: '#FF8A8A', stroke: '#FF8A8A' });
  const dimmer = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27', opacity: 0.86 }, Lover);

  /* ================= noon: clock and chips ================= */
  const noonClock = lorryClock(Lfg, 66);
  const noonTime = pill(Lfg, '12:00 noon', { size: 30, color: '#FFE45C', stroke: '#FFE45C' });
  const c15 = pill(Lfg, 'new flat: 15 km away', { size: 32 });
  const c30 = pill(Lfg, 'trip: 30 min = ½ hour', { size: 32, color: ppCol.resultant, stroke: ppCol.resultant });

  /* ================= the roadside whiteboard ================= */
  const wbG = G(Lfg);
  const wb = ppWhiteboard(wbG, 720, 330);
  const howFast = T(wb.board, 0, -112, 'How fast?', { size: 34, weight: 700, anchor: 'middle', fill: '#6C7A86' });
  const eqSpeed = T(wb.board, 0, -30, 'speed = distance ÷ time', { size: 58, weight: 800, anchor: 'middle', fill: SC_INK });
  const uMs = chip(wb.board, 'm/s = metres per second', { size: 32, fill: '#E7F6EE', color: '#1E7A4A', stroke: '#1E7A4A', sw: 3 });
  const uKmh = chip(wb.board, 'km/h = kilometres per hour', { size: 32, fill: '#FFF1E0', color: '#B8641A', stroke: '#B8641A', sw: 3 });
  tr(uMs, 0, 62); tr(uKmh, 0, 126);

  /* ================= Kavya's sum in the cab ================= */
  const calcCard = G(Lfg);
  E('rect', { x: -230, y: -120, width: 460, height: 240, rx: 14, fill: '#FFFDF5', stroke: '#C9C0AA', 'stroke-width': 4 }, calcCard);
  for (let i = 0; i < 4; i++) E('line', { x1: -200, x2: 200, y1: -60 + i * 52, y2: -60 + i * 52, stroke: '#CFE3F0', 'stroke-width': 2 }, calcCard);
  const calc1 = T(calcCard, 0, -28, '15 km ÷ ½ h', { size: 52, weight: 800, anchor: 'middle', fill: SC_INK });
  const calc2 = T(calcCard, 0, 62, '= 30 km/h', { size: 58, weight: 800, anchor: 'middle', fill: '#1E7A4A' });

  /* ================= the distance-time graph ================= */
  const GX = 170, GY = 600, GW = 640, GH = 360;
  const JOURNEY = [[0, 0], [6, 3], [15, 12], [25, 12], [30, 15]];
  const graphG = G(Lgraph);
  const strip = G(graphG);                                 // the road strip above the graph: 0..15 km
  E('line', { x1: GX, y1: 150, x2: GX + GW, y2: 150, stroke: '#9AA6B2', 'stroke-width': 10, 'stroke-linecap': 'round' }, strip);
  E('line', { x1: GX, y1: 150, x2: GX + GW, y2: 150, stroke: '#F2F7FA', 'stroke-width': 2, 'stroke-dasharray': '14 12' }, strip);
  [[GX, 'old flat'], [GX + GW, 'new flat']].forEach(([x, s]) => { E('circle', { cx: x, cy: 150, r: 9, fill: '#FFE45C' }, strip); T(strip, x + (x === GX ? -18 : 18), 160, s, { size: 26, weight: 700, anchor: x === GX ? 'end' : 'start', fill: C.muted }); });
  const miniWrap = G(strip);
  const miniLorry = ppLorry(miniWrap); tr(miniLorry, 0, 0, 0.2);
  const graphPan = G(graphG); tr(graphPan, GX, GY);
  const graph = ppDTGraph(graphPan, GW, GH, { tMax: 30, dMax: 15, ticksT: [0, 10, 20, 30], ticksD: [0, 5, 10, 15] });
  const glowP = E('path', { d: '', fill: 'none', stroke: '#FFE45C', 'stroke-width': 22, 'stroke-linecap': 'round', opacity: 0.45 }, graphPan);
  graph.insertBefore(glowP, graph.children[graph.children.length - 2]);
  const axT = E('rect', { x: GW / 2 - 92, y: 46, width: 184, height: 42, rx: 10, fill: 'none', stroke: '#FFE45C', 'stroke-width': 4 }, graphPan);
  const axD = E('rect', { x: -88, y: -GH / 2 - 100, width: 42, height: 200, rx: 10, fill: 'none', stroke: '#FFE45C', 'stroke-width': 4 }, graphPan);
  const XY = (tt, d) => graph.xy(tt, d);
  const segPath = (i) => { const [a, b] = [XY(...JOURNEY[i]), XY(...JOURNEY[i + 1])]; return `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`; };
  const statT = G(graphPan); const [fx0, fy] = XY(15, 12), [fx1] = XY(25, 12);
  const statChip = pill(statT, 'stationary', { size: 28, color: '#FFE45C', stroke: '#FFE45C' }); tr(statChip, (fx0 + fx1) / 2, fy - 44);
  const dist12 = E('line', { x1: 0, y1: fy, x2: fx0, y2: fy, stroke: '#FFE45C', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, graphPan);
  // gradient triangle on the expressway piece: 9 min along, 9 km up
  const triG = G(graphPan);
  const [ta] = [XY(6, 3)], [tb] = [XY(15, 3)], [tc] = [XY(15, 12)];
  const triLegs = E('path', { d: `M${ta[0]},${ta[1]} L${tb[0]},${tb[1]} L${tc[0]},${tc[1]}`, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-dasharray': '12 8' }, triG);
  const triFill = E('path', { d: `M${ta[0]},${ta[1]} L${tb[0]},${tb[1]} L${tc[0]},${tc[1]} Z`, fill: '#FFE45C', opacity: 0.14 }, triG);
  const triAlong = T(triG, (ta[0] + tb[0]) / 2, ta[1] + 36, '9 min', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const triUp = T(triG, tb[0] + 14, (tb[1] + tc[1]) / 2 + 10, '9 km', { size: 30, weight: 800, fill: '#FFE45C' });
  const gradCalc = G(graphPan);
  E('rect', { x: 14, y: -GH - 28, width: 250, height: 150, rx: 12, fill: 'rgba(10,27,39,0.95)', stroke: '#FFE45C', 'stroke-width': 3 }, gradCalc);
  T(gradCalc, 139, -GH + 14, '9 km ÷ 9 min', { size: 30, weight: 800, anchor: 'middle', fill: C.ink });
  T(gradCalc, 139, -GH + 56, '= 1 km each min', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  T(gradCalc, 139, -GH + 100, '= 60 km/h', { size: 36, weight: 800, anchor: 'middle', fill: ppCol.resultant });
  // right-hand cards
  const RC = 1030;
  const cSteady = lorryCard(Lgraph, [['straight slope', 30, '#FFE45C'], ['= steady speed', 30, C.ink]]);
  const cSteep = lorryCard(Lgraph, [['steeper', 30, '#FFE45C'], ['= faster', 30, C.ink]]);
  const cFlat = lorryCard(Lgraph, [['FLAT =', 30, '#FFE45C'], ['STATIONARY', 32, '#FFE45C'], ['(not moving)', 28, C.ink]]);
  const cNotBack = G(Lgraph);
  const nbChip = pill(cNotBack, 'NOT backwards', { size: 30, color: '#FF8A8A', stroke: '#FF8A8A' });
  const nbX = cross(cNotBack, 14); tr(nbX, -nbChip.w / 2 - 26, 0);
  const cGrad = lorryCard(Lgraph, [['gradient', 32, '#FFE45C'], ['(steepness)', 28, C.muted], ['= speed', 36, ppCol.resultant]]);
  const qMark = T(Lgraph, 0, 0, '?!', { size: 64, weight: 800, anchor: 'middle', fill: '#FFE45C' });

  /* ================= jam: ten minutes on the clock ================= */
  const jamClock = lorryClock(Lfg, 62, '#FF8A8A');
  const jamTag = pill(Lfg, '10 min: not moving', { size: 30, color: '#FF8A8A', stroke: '#FF8A8A' });
  const expChip = pill(Lfg, 'the steep bit = the expressway', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });

  /* ================= cast ================= */
  const rex = cast(root, 'rex', { mood: 'deadpan' });
  const pushpa = cast(root, 'pushpa');
  const frieda = cast(root, 'frieda');
  const kav = cast(root, 'kavya', { mood: 'neutral' });
  const fcam = lorryFcam(Lhud);
  const castScreen = G(Lfg);

  /* cut points */
  const cBoard = at('speed') - 0.06, cCab = at('calc') - 0.06, cWide = mid('calc', 0.58), cCab2 = mid('calc', 0.93);
  const cDash = at('average') - 0.06, cGraph = at('graph') - 0.06, cExp = at('express') - 0.06, cGraph2 = at('flat') - 0.06;
  const cJam = mid('stopped', 0.68), cBest = at('best') - 0.06, cGraph3 = at('gradient') - 0.06;
  const tArrive = at('noon') - 0.2, tStop = at('noon') + 2.4;

  return t => {
    const sNoon = on(t, -1, cBoard), sBoard = on(t, cBoard, cCab), sCab = on(t, cCab, cWide) || on(t, cCab2, cDash), sWide = on(t, cWide, cCab2);
    const sDash = on(t, cDash, cGraph), sGraph = on(t, cGraph, cExp) || on(t, cGraph2, cJam) || on(t, cGraph3, 1e9), sExp = on(t, cExp, cGraph2);
    const sJam = on(t, cJam, cBest), sBest = on(t, cBest, cGraph3);
    const shown = {};

    /* ---------- the road world ---------- */
    let rSpeed = 0, lx = 620, ly = 650, lspin = 0, camK = 1, camC = [600, 375], camP = null;
    if (sNoon) { const p = easeOut(clamp((t - tArrive) / (tStop - tArrive))); lx = lerp(-480, 620, p); lspin = lx + 480; }
    else if (sBoard) { lspin = 950; }
    else if (sCab || sDash) { rSpeed = sDash ? 0 : 340; }
    else if (sWide) { rSpeed = 260; lx = 560; lspin = t * 260; }
    else if (sExp) { rSpeed = 1500; lx = 600; ly = 650 + 2 * Math.sin(t * 40) * AMP; lspin = t * 1500; }
    else if (sJam || sBest) { lx = 590; lspin = 0; }
    if (sDash) rSpeed = 0;
    if (sBest) { const k = P(t, cBest, cGraph3 - cBest, linear); camK = 2.3 + 0.12 * k; camC = [690, 350]; camP = [700, 430]; }
    if (sJam) { const k = P(t, cJam, cBest - cJam, linear); camK = 1 + 0.03 * k; }
    road.upd(t, rSpeed);
    lorryCam(roadCam, camK, camC[0], camC[1], camP ? camP[0] : undefined, camP ? camP[1] : undefined);
    tr(lorryG, lx, ly); op(lorryG, sCab || sDash ? 0 : 1); lorry.upd(1, lspin);
    op(roadCam, sGraph ? 1 : 1);
    op(cab, sCab); op(dash, sDash); op(dimmer, sGraph);
    op(backCars, sJam || sBest); op(frontCars, sJam || sBest);
    [...jamBack, ...jamFront].forEach((k, i) => k.brake(Math.sin(t * 3 + i) > -0.6 ? 1 : 0));
    // boxes hop into the back of the lorry
    op(boxesG, sNoon);
    if (sNoon) LOADB.forEach(({ b, x, y }, i) => {
      const t0 = mid('noon', 0.28) + i * 0.45, p = clamp((t - t0) / 0.6);
      const tx = lx - 200, ty = 540;
      tr(b, lerp(x, tx, p), lerp(y, ty, p) - 170 * Math.sin(p * Math.PI), 0.45 * (1 - 0.5 * p), p * 30);
      op(b, 1 - P(t, t0 + 0.45, 0.15, linear));
    });
    // Grandma overtakes
    op(gran, sWide);
    if (sWide) {
      const gx = lerp(-260, 1450, clamp((t - mid('calc', 0.62)) / 1.5));
      tr(gran, gx, 712, 1.25); tr(granBody, 0, 2 * Math.sin(t * 30) * AMP);
      granWheels.forEach(w => tr(w, w === granWheels[0] ? -60 : 78, -16, 1, (t * 900) % 360));
    }
    op(streaks, sExp);
    if (sExp) STREAK.forEach((l, i) => { const x0 = +l.getAttribute('data-x'); const x = 1300 - ((t * 1400 + x0 * 3 + i * 260) % 1500); attr(l, 'x1', x); attr(l, 'x2', x + 150); });
    // roof props
    op(roofG, sJam || sBest || sExp);
    op(chair, sJam || sBest); tr(chair, -90, -250); op(breakSign, sJam); tr(breakSign, -235, -250);
    op(feet, sJam || sBest); tr(feet, 170, -238); op(drink, sJam || sBest); tr(drink, 40, -250);
    op(hairLines, sExp);

    /* ---------- FORCE-CAM ---------- */
    const fOn = sBoard || sExp || sJam || sBest;
    fcam.set(fOn ? 1 : 0, t);

    /* ---------- noon ---------- */
    op(noonClock, sNoon); op(noonTime, sNoon); op(c15, 0); op(c30, 0);
    if (sNoon) {
      tr(noonClock, 200, 230); tr(noonTime, 200, 340);
      const sw = 30 * ease(P(t, mid('noon', 0.78), 1.1, linear));
      noonClock.set(12, sw, 0, sw);
      lorryPop(c15, t, mid('noon', 0.5), 790, 200);
      lorryPop(c30, t, mid('noon', 0.78), 790, 290);
    }

    /* ---------- whiteboard ---------- */
    op(wbG, sBoard);
    if (sBoard) {
      tr(wbG, 480, 380);
      op(howFast, P(t, at('speed'), 0.3, linear));
      const ep = P(t, mid('speed', 0.32), 0.45, pop);
      op(eqSpeed, clamp(ep * 2.5)); tr(eqSpeed, 0, 0, Math.max(0.01, 0.7 + 0.3 * ep));
      const p1 = P(t, mid('units', 0.08), 0.4, pop), p2 = P(t, mid('units', 0.62), 0.4, pop);
      op(uMs, clamp(p1 * 2.5)); tr(uMs, 0, 62, Math.max(0.01, 0.7 + 0.3 * p1));
      op(uKmh, clamp(p2 * 2.5)); tr(uKmh, 0, 126, Math.max(0.01, 0.7 + 0.3 * p2));
      seat(rex, castScreen); shown.rex = 1; op(rex, 1);
      tr(rex, 1010, 470, '-0.8 0.8');
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: t < mid('speed', 0.3) ? 'neutral' : 'deadpan', look: 0.5, len: 0.45 });
      seat(pushpa, castScreen); shown.pushpa = 1; op(pushpa, 1);
      tr(pushpa, 1050, 612, 0.55);
      pushpa.set({ t, mood: t > mid('units', 0.6) ? 'shock' : 'happy', look: -0.8, arms: 'down' });
    }

    /* ---------- the cab: Kavya's sum ---------- */
    op(calcCard, sCab);
    if (sCab) {
      const back = t >= cCab2;
      tr(calcCard, 330, 330, 1, -2);
      op(calc1, P(t, at('calc') + 0.1, 0.3, linear));
      const c2 = P(t, mid('calc', 0.3), 0.45, pop); op(calc2, clamp(c2 * 2.5));
      seat(kav, castScreen); shown.kav = 1; op(kav, 1);
      const push = back ? P(t, cCab2, cDash - cCab2, linear) : 0;
      tr(kav, 860, 520 + (back ? -10 * push : 0), 1.3 * (1 + 0.08 * push));
      let mood = 'neutral', look = -0.7;
      if (t > mid('calc', 0.34)) { mood = 'smug'; look = -0.4; }
      if (t > mid('calc', 0.5)) { mood = 'annoyed'; look = 0.3; }
      if (back) { mood = 'deadpan'; look = 0; }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look });
    }

    /* ---------- wide: Grandma overtakes ---------- */
    op(kidWin, sWide);
    if (sWide) {
      seat(kav, kidWin); shown.kav = 1; op(kav, 1);
      tr(kav, 162, -150, 0.2);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'annoyed', look: 0.8 });
    }

    /* ---------- the dashboard ---------- */
    op(avgCard, 0); op(notSteady, 0);
    if (sDash) {
      const v = clamp(34 + 22 * Math.sin(1.3 * t) * (S.reduce ? 0.7 : 1) + 11 * Math.sin(3.7 * t + 1), 2, 78);
      tr(needle, 0, 0, 1, -120 + 240 * v / 80);
      road.upd(1, t * v * 9);
      lorryPop(avgCard, t, at('average') + 0.15, 600, 175);
      lorryPop(notSteady, t, mid('average', 0.78), 360, 318);
      // Rex, the bobblehead, on a spring
      seat(rex, dashRexSeat); shown.rex = 1; op(rex, 1);
      const bob = Math.sin(t * 7) * 16 * AMP + Math.sin(t * 3.7) * 8 * AMP;
      let d = 'M940,600'; for (let i = 1; i <= 8; i++) d += ` L${940 + (i % 2 ? 14 : -14)},${(600 - (60 + bob) * i / 8).toFixed(1)}`;
      attr(spring, 'd', d);
      tr(rex, 940, 470 - bob * 0.8, 0.72, Math.sin(t * 5) * 6 * AMP);
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: t > mid('average', 0.78) ? 'annoyed' : 'deadpan', look: -0.6, len: 0.4, still: true });
    }

    /* ---------- the graph ---------- */
    op(graphG, sGraph); [cSteady, cSteep, cFlat, cNotBack, cGrad, qMark].forEach(c => op(c, 0));
    let tNow = -1;
    if (sGraph) {
      tr(graphG, 400 * (1 - P(t, cGraph, 0.45, easeOut)), 0);
      if (t < cExp) {
        tNow = 6 * clamp((t - mid('graph', 0.84)) / (end('graph') - mid('graph', 0.84) + 0.2));
        if (t > mid('slope', 0.5)) tNow = 6 + 9 * clamp((t - mid('slope', 0.5)) / (mid('slope', 0.86) - mid('slope', 0.5)));
      } else if (t < cJam) tNow = 15 + 10 * clamp((t - at('flat')) / (mid('flat', 0.55) - at('flat')));
      else tNow = 25 + 5 * clamp((t - at('gradient')) / 0.9);
      graph.set(JOURNEY, tNow);
      op(axT, t < cExp ? win(t, mid('graph', 0.42), mid('graph', 0.66), 0.15) : 0);
      op(axD, t < cExp ? win(t, mid('graph', 0.68), mid('graph', 0.95), 0.15) : 0);
      // glow on the piece being talked about
      let gp = '', go = 0;
      if (t > at('slope') && t < mid('slope', 0.5)) { gp = segPath(0); go = win(t, at('slope') + 0.1, mid('slope', 0.5), 0.2); }
      else if (t > mid('slope', 0.86) && t < cExp) { gp = segPath(1); go = P(t, mid('slope', 0.86), 0.2, linear); }
      else if (t >= cGraph2 && t < cJam && t > mid('flat', 0.5)) { gp = segPath(2); go = P(t, mid('flat', 0.5), 0.2, linear); }
      else if (t >= cGraph3 && t > mid('gradient', 0.2)) { gp = segPath(1); go = P(t, mid('gradient', 0.2), 0.3, linear) * 0.8; }
      attr(glowP, 'd', gp); op(glowP, go * 0.45);
      // the mini lorry on the strip follows the distance
      const dNow = tNow < 0 ? 0 : (() => { for (let i = 1; i < JOURNEY.length; i++) { const [t0, d0] = JOURNEY[i - 1], [t1, d1] = JOURNEY[i]; if (tNow <= t1) return d0 + (d1 - d0) * (tNow - t0) / (t1 - t0); } return 15; })();
      tr(miniWrap, GX + GW * dNow / 15 - 30, 142);
      miniLorry.upd(1, dNow * 60);
      // right-hand cards
      if (t < cExp) {
        lorryPop(cSteady, t, at('slope') + 0.1, RC, 270);
        if (t > mid('slope', 0.5)) { op(cSteady, 0.4); lorryPop(cSteep, t, mid('slope', 0.55), RC, 400); }
      } else if (t < cJam) {
        op(qMark, P(t, mid('flat', 0.2), 0.3, linear)); tr(qMark, 1110, 330 + 4 * Math.sin(t * 8) * AMP);
        if (t > at('stopped')) { lorryPop(cFlat, t, at('stopped') + 0.05, RC, 260); lorryPop(cNotBack, t, mid('stopped', 0.25), RC + 14, 380); op(qMark, 0); }
      } else {
        lorryPop(cGrad, t, mid('gradient', 0.62), RC, 300);
      }
      op(statT, t >= cGraph2 && t < cJam ? P(t, at('stopped') + 0.1, 0.3, linear) : 0);
      op(dist12, t >= cGraph2 && t < cJam ? P(t, mid('stopped', 0.3), 0.3, linear) : 0);
      op(triG, t >= cGraph3 ? P(t, mid('gradient', 0.2), 0.3, linear) : 0);
      op(triAlong, t >= cGraph3 ? P(t, mid('gradient', 0.28), 0.3, linear) : 0);
      op(triUp, t >= cGraph3 ? P(t, mid('gradient', 0.36), 0.3, linear) : 0);
      op(gradCalc, t >= cGraph3 ? P(t, mid('gradient', 0.46), 0.3, linear) : 0);
      // Rex: a dot (steady pieces and the jam are all balanced)
      seat(rex, castScreen); shown.rex = 1; op(rex, 1);
      tr(rex, 1030, 600, 0.72);
      const flatBit = t >= cGraph2 && t < cJam;
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: flatBit && t < at('stopped') ? 'deadpan' : 'neutral', look: flatBit ? -0.3 : -0.8, len: 0 });
      if (flatBit && t < at('stopped') + 0.1) {
        seat(pushpa, castScreen); shown.pushpa = 1;
        const pp = P(t, at('flat'), 0.35, pop); op(pushpa, clamp(pp * 3));
        tr(pushpa, 1040, 400, 0.62 * Math.max(0.01, pp));
        pushpa.set({ t, talk: scTalk(S, t, 'pushpa'), mood: t < mid('flat', 0.3) ? 'neutral' : 'shock', look: -1, arms: 'up', sweat: t > mid('flat', 0.4) ? 1 : 0 });
      }
    }

    /* ---------- expressway: Pushpa on the roof ---------- */
    op(expChip, 0);
    if (sExp) {
      seat(pushpa, crewWorld); shown.pushpa = 1; op(pushpa, 1);
      tr(pushpa, -60, -310 + 4 * Math.sin(t * 22) * AMP, 0.62);
      pushpa.set({ t, talk: scTalk(S, t, 'pushpa'), mood: 'happy', look: 0.6, arms: 'up' });
      tr(hairLines, -60, -310, 0.62);
      lorryPop(expChip, t, at('express') + 0.2, 640, 190);
    }

    /* ---------- the jam: Rex on his break, Frieda feet up ---------- */
    op(jamClock, sJam); op(jamTag, sJam);
    if (sJam || sBest) {
      seat(rex, crewWorld); shown.rex = 1; op(rex, 1);
      tr(rex, -90, -330, 0.62);
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: 'deadpan', look: sBest ? 0.8 : 0, len: 0 });
      seat(frieda, crewWorld); shown.frieda = 1; op(frieda, 1);
      tr(frieda, 100, -312, 0.55, -12);
      frieda.set({ t, talk: scTalk(S, t, 'frieda'), mood: sBest || t > at('jam') ? 'smug' : 'neutral', look: sBest ? 0 : -0.5, still: sBest });
    }
    if (sJam) {
      tr(jamClock, 1010, 260); tr(jamTag, 1000, 370);
      const sw = 10 * clamp((t - at('jam')) / (end('jam') - at('jam') + 0.3));
      jamClock.set(12, 15 + sw, 15, 15 + sw);
      op(jamClock, P(t, at('jam') - 0.2, 0.3, linear)); op(jamTag, P(t, mid('jam', 0.4), 0.3, linear));
    }

    if (!shown.rex) op(rex, 0);
    if (!shown.pushpa) op(pushpa, 0);
    if (!shown.frieda) op(frieda, 0);
    if (!shown.kav) op(kav, 0);
  };
});

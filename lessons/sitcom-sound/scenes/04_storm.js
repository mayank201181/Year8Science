/* Scene 4: Lightning alert.
   Beats: 4 PM storm over the HDB blocks (LIGHTNING ALERT notice) -> FLASH, then the BOOM arrives late
   (Kavya flinches at the window) -> two-lane race: light finishes at once, sound crawls -> to scale:
   light's bar runs off the screen, sound's is a dot; "nearly a MILLION times faster" (push-in on Nigel)
   -> rule card: seconds from flash to bang / 3 = km -> Kavya counts 1..6 on a big stopwatch, BOOM
   -> Archie: 6 / 3 = 2 km -> map to the hawker centre, chicken rice getting rained on (a tiny umbrella,
   too late) -> three-lane race (Team Gas with Nigel and Archie, Team Liquid, Team Solid): 340, 1,500,
   5,000 m/s -> Archie: "AIR IS FASTEST?" -> crossed out, BACKWARDS; particle spacing panels and
   "SOLIDS SPEED, GASES GO SLOW". */
scene('storm', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed storm) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);   // hard sitcom cut
  const stormCam = (el, k, fx, fy, tx, ty) => el.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const stormPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  function stormLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  // lightning flicker envelope for a flash at t0
  function stormFlick(t, t0) {
    if (t < t0) return 0;
    const d = t - t0;
    if (d < 0.07) return 1;
    if (d < 0.14) return 0.3;
    if (d < 0.22) return 0.9;
    return Math.exp(-(d - 0.22) * 5);
  }
  // camera shake offset for a thump at t0
  const stormShake = (t, t0, a) => (t >= t0 && t < t0 + 0.6 ? (a || 9) * AMP * (1 - (t - t0) / 0.6) * Math.sin((t - t0) * 70) : 0);
  // a jagged "BOOM" burst
  function stormBurst(parent, text, r) {
    const g = G(parent);
    let d = '';
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, rr = i % 2 ? r * 0.72 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr * 1.25).toFixed(1) + ',' + (Math.sin(a) * rr * 0.85).toFixed(1); }
    E('path', { d: d + 'Z', fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    const tx = T(g, 0, r * 0.22, text, { size: Math.round(r * 0.6), weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    tx.setAttribute('stroke', SC_INK); tx.setAttribute('stroke-width', 6); tx.setAttribute('paint-order', 'stroke');
    return g;
  }
  // a rubber stamp
  function stormStamp(parent, text, size, col) {
    const g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.6;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    return g;
  }
  // nudge particles of a particle box as a compression pulse passes x = px (stage x, box at bx)
  function stormNudge(circles, bx, px, A) {
    circles.forEach(c => {
      const x = +c.getAttribute('cx'), u = (x + bx - px) / 34;
      if (u > -3 && u < 3) attr(c, 'cx', x - A * u * Math.exp(-u * u));
    });
  }
  const stormDx = (x, px, A) => { const u = (x - px) / 34; return -A * u * Math.exp(-u * u); };

  /* layers: everything under one camera, the HUD above */
  const camG = G(root);
  const Lbg = G(camG), Lcast = G(camG), Lfg = G(camG);

  /* ================= window shots: storm over the HDB blocks ================= */
  const winShot = G(Lbg);
  const storm = pioStorm(winShot);
  const hdb = labelLine(winShot, 700, 186, 560, 316, 'HDB blocks', { size: 28, fill: '#FFFFFF', line: '#FFFFFF' });
  const clockG = G(winShot); tr(clockG, 1000, 150);
  E('rect', { x: -130, y: -42, width: 260, height: 84, rx: 42, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 2 }, clockG);
  E('circle', { cx: -84, cy: 0, r: 28, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, clockG);
  E('line', { x1: -84, y1: 0, x2: -84, y2: -20, stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, clockG);
  E('line', { x1: -84, y1: 0, x2: -71, y2: 8, stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, clockG);   // hour hand on 4
  T(clockG, 20, 14, '4:00 PM', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const sgChip = stormLabel(winShot, 'very Singapore', { size: 28, color: '#FFE45C' });
  const alert = G(winShot);
  E('rect', { x: -190, y: -86, width: 380, height: 172, rx: 10, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 6 }, alert);
  E('rect', { x: -176, y: -72, width: 352, height: 144, rx: 6, fill: 'none', stroke: SC_INK, 'stroke-width': 2 }, alert);
  tr(bolt(alert, 0.55, '#1A1A1A'), -140, -16);
  T(alert, 22, -12, 'LIGHTNING', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
  T(alert, 22, 30, 'ALERT', { size: 40, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(alert, 0, 66, 'no outdoor activities', { size: 24, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  E('circle', { cx: 0, cy: -96, r: 9, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, alert);   // pin
  const dimWin = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#08121C', opacity: 0 }, winShot);

  // flash and boom labels
  const flashChip = G(Lfg);
  chip(flashChip, 'FLASH', { size: 56, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4, padX: 60 });
  tr(bolt(flashChip, 0.6, '#FFFFFF'), -98, 0);
  const boom1 = stormBurst(Lfg, 'BOOM', 110);
  const lateChip = stormLabel(Lfg, 'seconds later', { size: 30, color: '#FFB27A' });

  /* ================= race: light vs sound ================= */
  const raceShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0F2238', '#1C3C5E', true) }, raceShot);
  const LANE = [[170, 'LIGHT', '#FFE45C'], [370, 'SOUND', '#9FD8FF']];
  LANE.forEach(([y, name, col]) => {
    E('rect', { x: 90, y, width: 1020, height: 100, rx: 14, fill: 'rgba(255,255,255,0.06)', stroke: '#3B5E80', 'stroke-width': 3 }, raceShot);
    T(raceShot, 100, y - 16, name, { size: 32, weight: 800, fill: col });
  });
  E('line', { x1: 150, y1: 160, x2: 150, y2: 480, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: 0.6 }, raceShot);
  { // chequered finish
    E('rect', { x: 1076, y: 160, width: 28, height: 320, fill: '#FFFFFF' }, raceShot);
    let d = ''; for (let r = 0; r < 23; r++) d += `M${1076 + (r % 2) * 14},${160 + r * 14} h14 v14 h-14 Z `;
    E('path', { d, fill: '#1A1A1A' }, raceShot);
  }
  const beam = G(raceShot);
  const beamR = E('rect', { x: 150, y: 205, width: 0, height: 30, rx: 15, fill: '#FFE45C' }, beam);
  const beamGlow = E('rect', { x: 150, y: 190, width: 0, height: 60, rx: 30, fill: '#FFE45C', opacity: 0.25 }, beam);
  const beamHead = G(beam); tr(bolt(beamHead, 0.55), 0, 0);
  const sndBlob = G(raceShot), sndArcs = [0, 1, 2].map(i => E('path', { d: `M${i * 16},-30 Q${i * 16 + 16},0 ${i * 16},30`, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 7 - i, 'stroke-linecap': 'round' }, sndBlob));
  const lightChip = stormLabel(raceShot, '300,000,000 m/s', { size: 40, color: '#FFE45C', stroke: '#FFE45C' });
  const doneChip = G(raceShot);
  chip(doneChip, 'FINISHED', { size: 26, fill: '#2FBF71', color: '#FFFFFF' });
  const soundChip = stormLabel(raceShot, '340 m/s', { size: 40, color: '#9FD8FF', stroke: '#9FD8FF' });
  // million: bars to scale
  const scaleG = G(raceShot);
  const scaleBar = E('rect', { x: 150, y: 205, width: 0, height: 30, fill: '#FFE45C' }, scaleG);
  const offArrow = G(scaleG);
  E('path', { d: 'M0,-26 L26,0 L0,26 M-30,-26 L-4,0 L-30,26', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, offArrow);
  const offLbl = T(scaleG, 620, 304, 'light, to the same scale: about 3,000 screens long', { size: 28, weight: 700, anchor: 'middle', fill: '#FFE45C' });
  E('rect', { x: 150, y: 405, width: 4, height: 30, fill: '#9FD8FF' }, scaleG);
  E('path', { d: 'M168,420 L196,420', stroke: '#9FD8FF', 'stroke-width': 3 }, scaleG);
  T(scaleG, 206, 430, 'sound (drawn to scale)', { size: 28, weight: 700, fill: '#9FD8FF' });
  const millChip = chip(Lfg, 'nearly a MILLION times faster', { size: 46, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4 });

  /* ================= count: the rule card ================= */
  const rule = G(Lfg);
  E('rect', { x: -440, y: -200, width: 880, height: 400, rx: 26, fill: '#13283A', stroke: '#FFE45C', 'stroke-width': 4 }, rule);
  const r1 = G(rule);
  tr(bolt(r1, 0.5), -400, -126);
  T(r1, 24, -112, 'count the seconds from FLASH to BANG', { size: 38, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const r2 = T(rule, 0, 30, 'seconds ÷ 3', { size: 92, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const r3 = G(rule);
  T(r3, 0, 118, '= distance in kilometres', { size: 52, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  T(r3, 0, 162, '(roughly)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= counting: the stopwatch ================= */
  const watch = G(Lfg);
  E('rect', { x: -26, y: -196, width: 52, height: 36, rx: 8, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, watch);
  E('circle', { r: 165, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 6 }, watch);
  E('circle', { r: 140, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, watch);
  { let d = ''; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; d += `M${(Math.sin(a) * 118).toFixed(1)},${(-Math.cos(a) * 118).toFixed(1)} L${(Math.sin(a) * 134).toFixed(1)},${(-Math.cos(a) * 134).toFixed(1)} `; } E('path', { d, stroke: SC_INK, 'stroke-width': 5 }, watch); }
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -112, stroke: '#E8424F', 'stroke-width': 6, 'stroke-linecap': 'round' }, watch);
  const wNum = T(watch, 0, 46, '0', { size: 132, weight: 800, anchor: 'middle', fill: SC_INK });
  E('circle', { r: 8, fill: SC_INK }, watch);
  T(watch, 0, 222, 'seconds', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const boom2 = stormBurst(Lfg, 'BOOM', 96);
  const CNT = [0.05, 0.2, 0.38, 0.55, 0.72, 0.9];

  /* ================= two: Archie's sum ================= */
  const sum = G(Lfg);
  const sumT = T(sum, 0, 0, '6 ÷ 3 = 2 km', { size: 100, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  sumT.setAttribute('stroke', '#0A1B27'); sumT.setAttribute('stroke-width', 10); sumT.setAttribute('paint-order', 'stroke');
  const sumRing = E('ellipse', { cx: 178, cy: -34, rx: 120, ry: 72, fill: 'none', stroke: '#FFE45C', 'stroke-width': 7 }, sum);

  /* ================= hawker: the map ================= */
  const mapShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#22303D', '#3A4A58', true) }, mapShot);
  E('rect', { x: 60, y: 120, width: 1080, height: 590, rx: 22, fill: '#EFE6CC', stroke: '#B8A982', 'stroke-width': 5 }, mapShot);
  E('path', { d: 'M60,420 Q400,380 700,430 T1140,400', fill: 'none', stroke: '#C9C0A6', 'stroke-width': 26 }, mapShot);
  E('path', { d: 'M520,120 Q500,300 560,460 T600,710', fill: 'none', stroke: '#C9C0A6', 'stroke-width': 22 }, mapShot);
  E('ellipse', { cx: 760, cy: 560, rx: 110, ry: 60, fill: '#B8DDA0', opacity: 0.8 }, mapShot);
  E('ellipse', { cx: 210, cy: 240, rx: 90, ry: 50, fill: '#B8DDA0', opacity: 0.8 }, mapShot);
  const school = G(mapShot); tr(school, 330, 300);
  E('rect', { x: -70, y: -40, width: 140, height: 76, fill: '#F6F1E4', stroke: SC_INK, 'stroke-width': 4 }, school);
  E('path', { d: 'M-82,-40 L0,-86 L82,-40 Z', fill: '#C2453A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, school);
  E('rect', { x: -14, y: 0, width: 28, height: 36, fill: '#8A5A33' }, school);
  E('line', { x1: 0, y1: -86, x2: 0, y2: -122, stroke: SC_INK, 'stroke-width': 3 }, school);
  E('path', { d: 'M0,-122 L26,-114 L0,-106 Z', fill: '#E8424F' }, school);
  T(school, 0, 80, 'SCHOOL', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const hawk = G(mapShot); tr(hawk, 900, 310);
  E('rect', { x: -96, y: -30, width: 192, height: 70, fill: '#F6F1E4', stroke: SC_INK, 'stroke-width': 4 }, hawk);
  E('path', { d: 'M-110,-30 L-80,-70 L80,-70 L110,-30 Z', fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hawk);
  for (let i = 0; i < 4; i++) E('rect', { x: -84 + i * 44, y: -18, width: 34, height: 26, fill: ['#FFC247', '#FF8A3D', '#56D69B', '#FF6B5C'][i], stroke: SC_INK, 'stroke-width': 2 }, hawk);
  T(hawk, 0, 82, 'HAWKER CENTRE', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const route = E('path', { d: 'M410,300 Q610,220 800,300', fill: 'none', stroke: '#E8424F', 'stroke-width': 7, 'stroke-dasharray': '16 12', 'stroke-linecap': 'round' }, mapShot);
  const kmChip = chip(mapShot, '2 km', { size: 42, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const cloud = G(mapShot); tr(cloud, 900, 176);
  E('path', { d: 'M-110,20 Q-130,-24 -80,-30 Q-70,-70 -20,-60 Q10,-92 56,-62 Q110,-70 112,-24 Q140,0 110,24 Z', fill: '#5C6B7A', stroke: '#3A4652', 'stroke-width': 4 }, cloud);
  const cloudBolt = G(cloud); tr(bolt(cloudBolt, 0.5), 30, 56);
  const mapRain = E('path', { d: '', stroke: '#5AB4E0', 'stroke-width': 3, 'stroke-linecap': 'round' }, cloud);
  // the plate of chicken rice (inset)
  const plate = G(mapShot); tr(plate, 690, 565);
  E('circle', { r: 128, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, plate);
  E('circle', { r: 118, fill: '#8C6A4A' }, plate);   // table
  E('ellipse', { cx: 0, cy: 16, rx: 96, ry: 58, fill: '#F4F7FA', stroke: '#A9B5C0', 'stroke-width': 4 }, plate);
  E('path', { d: 'M-62,22 Q-56,-36 -6,-38 Q30,-36 34,18 Z', fill: '#FFF9E8', stroke: '#D9CFAE', 'stroke-width': 3 }, plate);   // rice dome
  [[30, 10], [48, 22], [62, 34]].forEach(([x, y], i) => E('path', { d: `M${x},${y - 18} Q${x + 18},${y - 14} ${x + 20},${y + 6} L${x - 2},${y + 10} Z`, fill: '#F2D19B', stroke: '#B98A4A', 'stroke-width': 2.5 }, plate));
  E('ellipse', { cx: -46, cy: 50, rx: 16, ry: 8, fill: '#7BC96F', stroke: '#3E8A3A', 'stroke-width': 2 }, plate);
  E('ellipse', { cx: -20, cy: 56, rx: 16, ry: 8, fill: '#7BC96F', stroke: '#3E8A3A', 'stroke-width': 2 }, plate);
  E('circle', { cx: 82, cy: -60, r: 18, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, plate);   // chilli saucer
  const puddle = E('ellipse', { cx: 0, cy: 30, rx: 0, ry: 0, fill: '#7FC3EE', opacity: 0.55 }, plate);
  const plateRain = E('path', { d: '', stroke: '#2E8BC9', 'stroke-width': 4, 'stroke-linecap': 'round' }, plate);
  const umb = G(plate);
  E('line', { x1: 0, y1: 0, x2: 0, y2: 40, stroke: '#8A5A33', 'stroke-width': 3 }, umb);
  E('path', { d: 'M-30,0 Q-28,-26 0,-28 Q28,-26 30,0 Q22,-6 15,0 Q8,-6 0,0 Q-8,-6 -15,0 Q-22,-6 -30,0 Z', fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2.5 }, umb);
  const soggy = stormStamp(mapShot, 'SOGGY', 34, '#2E8BC9');

  /* ================= gas / liquid / solid: the three-lane race ================= */
  const laneShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#1E3A58', true) }, laneShot);
  const LX = 270, LW = 690, LH = 120;
  const LANES = [
    { y: 150, team: 'TEAM GAS', sub: '(air)', state: 'gas', n: 8, color: '#8FB8FF', dark: '#2F56C2', v: 22, line: 'gas', chip: '340 m/s', col: '#9FD8FF' },
    { y: 320, team: 'TEAM LIQUID', sub: '(water)', state: 'liquid', n: 57, color: C.water, dark: C.waterDk, v: 22 * 1500 / 340, line: 'liquid', chip: '1,500 m/s', col: '#7FE0FF' },
    { y: 490, team: 'TEAM SOLID', sub: '(steel)', state: 'solid', n: 57, color: '#C9D3DC', dark: '#6E7C8A', v: 22 * 5000 / 340, line: 'solid', chip: '5,000 m/s', col: '#E6EDF3' },
  ];
  LANES.forEach((L, i) => {
    L.g = G(laneShot);
    T(L.g, 50, L.y + 56, L.team, { size: 30, weight: 800, fill: L.col });
    T(L.g, 50, L.y + 90, L.sub, { size: 24, weight: 600, fill: C.muted, font: FB });
    const bw = G(L.g); tr(bw, LX, L.y);
    L.box = particleBox(bw, LW, LH, { n: L.n, r: 16, color: L.color, dark: L.dark, state: L.state, seed: 31 + i * 7 });
    L.circ = [...L.box.querySelectorAll('circle')];
    L.pulse = E('ellipse', { cx: 0, cy: L.y + LH / 2, rx: 46, ry: 74, fill: glow('#FFE45C'), opacity: 0 }, L.g);
    E('line', { x1: LX + LW + 8, y1: L.y - 6, x2: LX + LW + 8, y2: L.y + LH + 6, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '8 6', opacity: 0.6 }, L.g);
    L.chipG = stormLabel(laneShot, L.chip, { size: 30, color: L.col, stroke: L.col });
    L.tag = G(laneShot);
  });
  T(LANES[0].tag, 0, 0, 'SLOWEST', { size: 28, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  T(LANES[1].tag, 0, 0, 'over 4× faster', { size: 26, weight: 700, anchor: 'middle', fill: '#7FE0FF', font: FB });
  E('circle', { cx: -62, cy: -9, r: 17, fill: ball('#FFE066', '#C98A00'), stroke: SC_INK, 'stroke-width': 3 }, LANES[2].tag);
  E('path', { d: 'M-72,-24 L-80,-46 M-52,-24 L-44,-46', stroke: '#E8424F', 'stroke-width': 6 }, LANES[2].tag);
  T(LANES[2].tag, 16, 0, 'FASTEST', { size: 28, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const passLbl = T(laneShot, 615, 700, 'each team passes the bump along', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= wrong / packed: Archie's bubble, then the spacing panels ================= */
  const airShot = G(Lbg);
  const airBg = pioAir(airShot);
  const bubble = G(Lfg);
  [[196, 146, 12], [158, 112, 18]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble));
  E('path', { d: 'M-190,0 Q-200,-80 -100,-86 Q-40,-120 30,-96 Q120,-110 170,-50 Q220,10 160,58 Q110,100 20,86 Q-60,104 -130,74 Q-200,60 -190,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubble);
  T(bubble, 0, -12, 'AIR IS', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
  T(bubble, 0, 36, 'FASTEST?', { size: 40, weight: 800, anchor: 'middle', fill: '#2E7DD8' });
  const bubX = cross(bubble, 70); tr(bubX, 0, 0);
  const backStamp = stormStamp(Lfg, 'BACKWARDS', 40, '#FF6070');
  // spacing panels
  const spShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#1E3A58', true) }, spShot);
  const PAN = [
    { x: 120, name: 'GAS', note: 'far apart', state: 'gas', n: 7, color: '#8FB8FF', dark: '#2F56C2', v: 26, sp: 340, val: '340 m/s' },
    { x: 470, name: 'LIQUID', note: 'close together', state: 'liquid', n: 40, color: C.water, dark: C.waterDk, v: 115, sp: 1500, val: '1,500 m/s' },
    { x: 820, name: 'SOLID', note: 'touching, in rows', state: 'solid', n: 48, color: '#C9D3DC', dark: '#6E7C8A', v: 380, sp: 5000, val: '5,000 m/s' },
  ];
  PAN.forEach((p, i) => {
    p.g = G(spShot);
    T(p.g, p.x + 130, 150, p.name, { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const bw = G(p.g); tr(bw, p.x, 170);
    p.box = particleBox(bw, 260, 200, { n: p.n, r: 14, color: p.color, dark: p.dark, state: p.state, seed: 61 + i * 5 });
    p.circ = [...p.box.querySelectorAll('circle')];
    T(p.g, p.x + 130, 412, p.note, { size: 26, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
    p.bar = E('rect', { x: p.x, y: 434, width: 0, height: 18, rx: 9, fill: '#FFE45C' }, p.g);
    T(p.g, p.x + 130, 490, p.val, { size: 28, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  });
  const closeChip = chip(Lfg, 'closer particles pass it on faster', { size: 34, fill: '#2F56C2', color: '#FFFFFF', stroke: '#BFD3FF', sw: 3 });
  const mnem = G(Lfg);
  E('rect', { x: -380, y: -44, width: 760, height: 88, rx: 18, fill: '#FFD23F', stroke: '#FFFFFF', 'stroke-width': 4 }, mnem);
  T(mnem, 0, 16, 'SOLIDS SPEED, GASES GO SLOW', { size: 46, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'deadpan' });
  const nigel = cast(Lcast, 'nigel', { mood: 'deadpan' });
  const archie = cast(Lcast, 'archie', { mood: 'happy' });

  /* cut points */
  const cB = at('flash') - 0.06, cC = at('fast') - 0.06, cD = at('count') - 0.06, cE = at('counting') - 0.06,
    cF = at('two') - 0.06, cG = at('hawker') - 0.06, cH = at('gas') - 0.06, cI = at('wrong') - 0.06, cJ = mid('packed', 0.25);
  const FL1 = at('flash') + 0.05, BM1 = mid('flash', 0.86), FL2 = at('counting') - 0.04, BM2 = end('counting') + 0.04;
  const T0 = LANES.map(L => at(L.line) + 0.35);

  return t => {
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF),
      sF = on(t, cF, cG), sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sJ = on(t, cJ, 1e9);
    const winOn = sA || sB || sD || sE || sF;

    /* ---------- camera ---------- */
    let sx = 0, sy = 0;
    if (sB) { sx = stormShake(t, BM1, 10); sy = stormShake(t + 0.13, BM1, 6); }
    if (sE) { sx = stormShake(t, BM2, 10); sy = stormShake(t + 0.13, BM2, 6); }
    if (sA) stormCam(camG, 1 + 0.04 * P(t, 0, cB, linear), 600, 375, 600, 375);
    else if (sC) { const p = P(t, mid('million', 0.7), cD - mid('million', 0.7), ease); stormCam(camG, 1 + 0.12 * p, 1030, 560, lerp(1030, 960, p), lerp(560, 520, p)); }
    else if (sG) { const p = P(t, end('hawker') - 0.2, cH - end('hawker') + 0.2, ease); stormCam(camG, 1 + 0.12 * p, 690, 560, lerp(690, 660, p), lerp(560, 500, p)); }
    else if (sI) { const p = P(t, end('wrong'), cJ - end('wrong'), ease) * (t < at('packed') ? 1 : 1); stormCam(camG, 1 + 0.14 * p, 250, 520, lerp(250, 300, p), lerp(520, 470, p)); }
    else camG.setAttribute('transform', sx || sy ? `translate(${sx.toFixed(1)} ${sy.toFixed(1)})` : '');

    /* ---------- window shots ---------- */
    op(winShot, winOn);
    if (winOn) {
      const f = Math.max(stormFlick(t, FL1), stormFlick(t, FL2)) * (S.reduce ? 0.6 : 1);
      storm.set({ t, flash: f, rain: 1 });
      op(dimWin, sD ? 0.6 : sF ? 0.45 : 0);
      op(hdb, sA ? win(t, mid('four', 0.35), cB, 0.25) : 0);
      op(clockG, sA || sB ? (sA ? P(t, at('four') + 0.1, 0.3, linear) : 1) : 0);
      if (sA) stormPop(sgChip, t, mid('four', 0.82), 1000, 240, 1, -3); else op(sgChip, 0);
      const ap = sA ? P(t, mid('four', 0.5), 0.45, pop) * (1 - P(t, cB - 0.25, 0.2, linear)) : 0;
      op(alert, clamp(ap * 2.5)); tr(alert, 900, 500, Math.max(0.01, 0.7 + 0.3 * ap), -3 + Math.sin(t * 2.2) * 1.2 * AMP);
    }
    // FLASH / BOOM in the flash line
    if (sB) {
      stormPop(flashChip, t, FL1, 760, 250, 1, -4);
      const bp = P(t, BM1, 0.35, pop);
      op(boom1, clamp(bp * 3)); tr(boom1, 900, 430, Math.max(0.01, 0.5 + 0.5 * bp), 6);
      op(lateChip, P(t, BM1 + 0.15, 0.25, linear)); tr(lateChip, 900, 590);
    } else { op(flashChip, 0); op(boom1, 0); op(lateChip, 0); }

    /* ---------- race: light vs sound ---------- */
    op(raceShot, sC);
    if (sC) {
      const pre = 1 - P(t, at('million') - 0.05, 0.25, linear);
      const bp = P(t, mid('fast', 0.06), 0.16, linear);
      op(beam, pre * (bp > 0 ? 1 : 0)); attr(beamR, 'width', 930 * bp); attr(beamGlow, 'width', 930 * bp); tr(beamHead, 150 + 930 * bp, 220);
      op(beamHead, bp < 1 ? 1 : 0);
      const sxp = 170 + 15 * Math.max(0, t - at('fast'));
      op(sndBlob, pre); tr(sndBlob, sxp, 420);
      sndArcs.forEach((a, i) => op(a, 0.5 + 0.5 * Math.abs(Math.sin(t * 6 + i))));
      if (pre > 0) {
        const lp = stormPop(lightChip, t, mid('fast', 0.16), 620, 220); op(lightChip, clamp(lp * 2.5) * pre);
        const dp = stormPop(doneChip, t, mid('fast', 0.1), 1000, 136); op(doneChip, clamp(dp * 2.5) * pre);
        const sp = stormPop(soundChip, t, mid('fast', 0.68), 760, 420); op(soundChip, clamp(sp * 2.5) * pre);
      } else { op(lightChip, 0); op(doneChip, 0); op(soundChip, 0); }
      const mp = P(t, at('million') + 0.1, 0.5, easeIn);
      op(scaleG, P(t, at('million'), 0.2, linear));
      attr(scaleBar, 'width', 1100 * mp); tr(offArrow, 1140 + 6 * Math.sin(t * 8) * AMP, 220); op(offArrow, mp >= 1 ? 1 : 0);
      op(offLbl, P(t, at('million') + 0.6, 0.3, linear));
      const cp = P(t, mid('million', 0.3), 0.45, pop);
      op(millChip, clamp(cp * 2.5)); tr(millChip, 560, 580, Math.max(0.01, 0.6 + 0.4 * cp), -2);
    } else { op(millChip, 0); }

    /* ---------- count: the rule card ---------- */
    op(rule, sD);
    if (sD) {
      const p0 = P(t, at('count') + 0.05, 0.4, pop);
      tr(rule, 600, 410, Math.max(0.01, 0.85 + 0.15 * p0)); op(rule, clamp(p0 * 2.5));
      op(r1, P(t, at('count') + 0.2, 0.3, linear));
      const p2 = P(t, mid('count', 0.5), 0.4, pop); op(r2, clamp(p2 * 2.5)); r2.setAttribute('transform', `translate(0 30) scale(${Math.max(0.01, 0.6 + 0.4 * p2).toFixed(3)}) translate(0 -30)`);
      op(r3, P(t, mid('count', 0.74), 0.35, linear));
    }

    /* ---------- counting: the stopwatch ---------- */
    op(watch, sE);
    if (sE) {
      let n = 0; CNT.forEach(f => { if (t >= mid('counting', f)) n++; });
      setText(wNum, String(n));
      const np = n ? P(t, mid('counting', CNT[n - 1]), 0.25, pop) : 1;
      wNum.setAttribute('transform', `translate(0 0) scale(${(0.7 + 0.3 * np).toFixed(3)})`);
      hand.setAttribute('transform', `rotate(${(n * 30 + (n ? 0 : 0)).toFixed(1)})`);
      tr(watch, 860, 370);
      const bp = P(t, BM2, 0.3, pop);
      op(boom2, clamp(bp * 3)); tr(boom2, 520, 210, Math.max(0.01, 0.5 + 0.5 * bp), -8);
    } else op(boom2, 0);

    /* ---------- two: 6 / 3 = 2 km ---------- */
    op(sum, sF);
    if (sF) {
      const p = P(t, at('two') + 0.1, 0.45, pop);
      tr(sum, 560, 240, Math.max(0.01, 0.6 + 0.4 * p)); op(sum, clamp(p * 2.5));
      op(sumRing, P(t, mid('two', 0.75), 0.3, linear));
    }

    /* ---------- hawker: the map ---------- */
    op(mapShot, sG);
    if (sG) {
      const rp = P(t, at('hawker') + 0.1, 0.8, ease);
      op(route, rp); attr(route, 'stroke-dashoffset', -t * 30 * AMP);
      stormPop(kmChip, t, at('hawker') + 0.6, 605, 236);
      let d = ''; for (let i = 0; i < 9; i++) { const ph = ((t * 1.8 + i * 0.37) % 1); const x = -90 + i * 22; d += `M${x - ph * 10},${30 + ph * 110} l-5,18 `; }
      attr(mapRain, 'd', d);
      op(cloudBolt, Math.sin(t * 3.1) > 0.92 ? 1 : 0);
      const pp = P(t, mid('hawker', 0.48), 0.45, pop);
      op(plate, clamp(pp * 2.5)); tr(plate, 690, 565, Math.max(0.01, 0.6 + 0.4 * pp));
      let pd = ''; for (let i = 0; i < 10; i++) { const ph = ((t * 2.2 + i * 0.29) % 1), x = -88 + i * 19; const y = -110 + ph * 170; if (Math.hypot(x, y) < 108 && Math.hypot(x - 6, y + 22) < 108) pd += `M${x.toFixed(0)},${y.toFixed(0)} l-4,16 `; }
      attr(plateRain, 'd', pd);
      const wet = P(t, mid('hawker', 0.55), end('hawker') - mid('hawker', 0.55) + 0.6, linear);
      attr(puddle, 'rx', 30 + 62 * wet); attr(puddle, 'ry', 14 + 28 * wet); op(puddle, wet > 0 ? 0.55 : 0);
      const up = P(t, end('hawker') + 0.15, 0.35, pop);
      op(umb, clamp(up * 3)); tr(umb, -20, -60 - 10 * up, Math.max(0.01, up), -8);
      const sp = P(t, mid('hawker', 0.86), 0.3, pop);
      op(soggy, clamp(sp * 3)); tr(soggy, 900, 520, Math.max(0.01, lerp(1.6, 1, clamp(sp))), -10);
    }

    /* ---------- the three-lane race ---------- */
    op(laneShot, sH);
    if (sH) {
      LANES.forEach((L, i) => {
        const lit = i === 0 ? 1 : (t >= at(L.line) - 0.1 ? 1 : 0.32);
        op(L.g, lit);
        L.box.set(L.state, t, i === 0 ? 0 : 0.3);
        const go = t >= T0[i];
        const px = LX + clamp(L.v * (t - T0[i]), 0, LW);
        op(L.pulse, go ? 0.9 : 0); attr(L.pulse, 'cx', px);
        if (go && px < LX + LW) stormNudge(L.circ, LX, px, 16 * AMP + 4);
        const cpop = P(t, i === 0 ? mid('gas', 0.6) : i === 1 ? mid('liquid', 0.6) : mid('solid', 0.45), 0.4, pop);
        op(L.chipG, clamp(cpop * 2.5)); tr(L.chipG, 1065, L.y + 44, Math.max(0.01, 0.6 + 0.4 * cpop));
        const tp = P(t, i === 0 ? mid('gas', 0.85) : i === 1 ? mid('liquid', 0.82) : mid('solid', 0.62), 0.35, pop);
        op(L.tag, clamp(tp * 2.5)); tr(L.tag, 1065, L.y + 102, Math.max(0.01, 0.6 + 0.4 * tp));
      });
      op(passLbl, P(t, at('gas') + 1.2, 0.4, linear));
    }

    /* ---------- wrong / packed: the air two-shot ---------- */
    op(airShot, sI);
    if (sI) airBg.upd(t);
    op(bubble, sI);
    if (sI) {
      const bp = P(t, mid('wrong', 0.2), 0.4, pop);
      op(bubble, clamp(bp * 2.5)); tr(bubble, 420, 230, Math.max(0.01, 0.6 + 0.4 * bp));
      const xp = P(t, at('packed') + 0.1, 0.3, pop);
      op(bubX, clamp(xp * 3)); tr(bubX, 0, 0, Math.max(0.01, xp));
      const sp = P(t, mid('packed', 0.15), 0.25, easeOut);
      op(backStamp, sp > 0 ? clamp(sp * 4) : 0); tr(backStamp, 430, 330, lerp(1.7, 1, sp), -8);
    } else op(backStamp, 0);

    /* ---------- spacing panels ---------- */
    op(spShot, sJ);
    if (sJ) {
      PAN.forEach((p, i) => {
        const ap = P(t, cJ + i * 0.12, 0.35, pop);
        op(p.g, clamp(ap * 2.5));
        p.box.set(p.state, t, i === 0 ? 0.1 : 0.3);
        const L = 260 + 80, px = p.x - 40 + ((t * p.v) % L);
        stormNudge(p.circ, p.x, px, 13 * AMP + 3);
        attr(p.bar, 'width', Math.max(6, 260 * p.sp / 5000 * P(t, cJ + 0.4 + i * 0.15, 0.5, ease)));
      });
      const cp = P(t, mid('packed', 0.45), 0.4, pop);
      op(closeChip, clamp(cp * 2.5)); tr(closeChip, 560, 568, Math.max(0.01, 0.6 + 0.4 * cp));
      const mp = P(t, mid('packed', 0.7), 0.45, pop);
      op(mnem, clamp(mp * 2.5)); tr(mnem, 560, 660, Math.max(0.01, 0.6 + 0.4 * mp), -1.5);
    } else { op(closeChip, 0); op(mnem, 0); }

    /* ---------- the cast ---------- */
    // Kavya: at the window (flash, counting) and on the map (hawker)
    const kOn = sB || sE || sG;
    op(kav, kOn);
    if (kOn) {
      let mood = 'deadpan', look = 0;
      if (sB) {
        const fl = t - FL1;
        mood = fl >= 0 && fl < 1.1 ? 'shock' : (t >= BM1 && t < BM1 + 0.9 ? 'shock' : (fl >= 0 ? 'annoyed' : 'neutral'));
        look = fl < 0 ? 0.6 : (t >= BM1 ? 0.8 : 0.5);
        const jump = fl >= 0 && fl < 0.5 ? Math.sin(fl / 0.5 * Math.PI) * 26 * AMP : 0;
        tr(kav, 290, 570 - jump, 1.25);
      } else if (sE) {
        mood = t >= BM2 ? 'annoyed' : 'deadpan'; look = t >= BM2 ? 0 : 0.7;
        tr(kav, 290, 570, 1.25);
      } else {
        mood = 'deadpan'; look = t < end('hawker') ? 0.6 : 0;
        tr(kav, 175, 610, 0.85);
      }
      kav.set({ t, talk: talk(t, 'kavya'), mood, look });
    }

    // Nigel: race commentator (fast, million), in Team Gas (gas, liquid, solid), the air two-shot (wrong, packed),
    // then a small corner on the spacing panels
    const nOn = sC || sH || sI || sJ;
    op(nigel, nOn);
    if (nOn) {
      let x = 1030, y = 600, s = 0.85, mood = 'deadpan', look = -0.5;
      if (sC) {
        look = t < mid('million', 0.6) ? -0.6 : 0;
        mood = t >= mid('fast', 0.7) && t < at('million') ? 'annoyed' : 'deadpan';
      } else if (sH) {
        const L = LANES[0], px = LX + clamp(L.v * (t - T0[0]), 0, LW);
        x = 420 + (t >= T0[0] ? stormDx(420, px, 14 * AMP + 4) : 0); y = L.y + 62; s = 0.4;
        look = scWho(S, t) === 'nigel' ? 0 : 1; mood = t >= mid('gas', 0.8) ? 'annoyed' : 'deadpan';
      } else if (sI) {
        x = 250; y = 560; s = 1; look = t < at('packed') ? 1 : 0.6;
        mood = t < at('packed') ? 'deadpan' : 'smug';
      } else { x = 1075; y = 612; s = 0.55; look = -0.6; mood = 'deadpan'; }
      tr(nigel, x, y, s);
      nigel.set({ t, talk: talk(t, 'nigel'), mood, look });
    }

    // Archie: 6 / 3 = 2 km (two), Team Gas, the air two-shot
    const aOn = sF || sH || sI;
    op(archie, aOn);
    if (aOn) {
      let x = 860, y = 500, s = 1.3, mood = 'happy', look = 0, bounce = 0;
      if (sF) { bounce = t < end('two') + 0.3 ? 1 : 0.4; look = -0.4; }
      else if (sH) {
        const L = LANES[0], px = LX + clamp(L.v * (t - T0[0]), 0, LW);
        x = 640 + (t >= T0[0] ? stormDx(640, px, 14 * AMP + 4) : 0); y = L.y + 62; s = 0.38;
        if (t < at('liquid')) { look = -1; mood = t >= mid('gas', 0.8) ? 'sad' : 'happy'; }
        else if (t < at('solid')) { look = 0.3; mood = 'shock'; }
        else { look = 0.6; mood = 'shock'; }
      } else {
        x = 790; y = 470; s = 1.25; look = -0.7;
        if (t < at('packed')) { mood = 'smug'; bounce = t < end('wrong') ? 0.5 : 0; }
        else mood = 'shock';
      }
      tr(archie, x, y, s);
      archie.set({ t, talk: talk(t, 'archie'), mood, look, bounce: bounce * AMP, sweat: sI && t >= at('packed') ? 0.8 : 0 });
    }
  };
});

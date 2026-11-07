/* Chapter 4, The speed of sound.
   Beats: a pulse crosses 1 km while a stopwatch runs to 3 s -> how closely packed particles pass a vibration on
   (gas, liquid, solid) -> a to-scale race through air, water and steel (showpiece) -> "fastest in air?" no:
   Solids Speed, Gases Go slow -> light against sound -> a thunderstorm: the flash at once, the thunder later
   -> count the seconds and divide by three -> 6 s is 2 km -> warm air is a little faster -> a whip's tiny sonic boom. */
scene('speed', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.35 : 1;

  /* ---------- local helpers and art ---------- */
  const f1 = v => (+v).toFixed(1);
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.8 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* side-view loudspeaker facing right (the lesson's shared look); g.set(dx, ghostAmp) */
  function speaker(parent) {
    const g = G(parent);
    E('rect', { x: -66, y: -80, width: 66, height: 160, rx: 12, fill: '#16232C', stroke: '#3A5666', 'stroke-width': 3 }, g);
    E('circle', { cx: -33, cy: -50, r: 9, fill: '#0B151B', stroke: '#3A5666', 'stroke-width': 2 }, g);
    const coneD = 'M-4,-24 L22,-62 L22,62 L-4,24 Z';
    const ghosts = [G(g), G(g)];
    ghosts.forEach(h => E('path', { d: coneD, fill: 'none', stroke: '#C9D3DB', 'stroke-width': 2, opacity: 0.35 }, h));
    const cone = G(g);
    E('path', { d: coneD, fill: linGrad('#6F7D89', '#B7C3CD'), stroke: '#D3DCE3', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('line', { x1: 22, y1: -62, x2: 22, y2: 62, stroke: '#E9EEF2', 'stroke-width': 5, 'stroke-linecap': 'round' }, cone);
    g.set = (dx, amp) => { tr(cone, dx, 0); tr(ghosts[0], -amp, 0); tr(ghosts[1], amp, 0); op(ghosts[0], amp > 0.5 ? 1 : 0); op(ghosts[1], amp > 0.5 ? 1 : 0); };
    g.set(0, 0);
    return g;
  }
  /* an ear seen from the side, listening to the left */
  function earIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-14,-40 C0,-62 42,-60 46,-22 C49,4 36,18 30,30 C24,44 22,60 4,60 C-8,60 -13,50 -12,40 L-10,30 C-2,29 6,22 10,12 C15,-2 13,-24 -1,-26 C-10,-27 -15,-21 -17,-15 Z', fill: ball('#F2C29C', '#B9825A'), stroke: '#FBE3CF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M2,-40 C24,-40 33,-20 28,-2', fill: 'none', stroke: '#B9825A', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -3, cy: 3, rx: 7, ry: 9, fill: '#5A2E1E' }, g);
    return g;
  }
  /* a sound pulse travelling right: three ")" arcs with a soft glow; apex of the front arc at (0,0) */
  function pulseIcon(parent, hh, b, color) {
    const g = G(parent), col = color || C.air;
    E('ellipse', { cx: -16, cy: 0, rx: Math.max(26, b * 2.4), ry: hh * 1.08, fill: glow(col) }, g);
    [0, 1, 2].forEach(k => {
      const x = -k * Math.max(13, b), y = hh * (1 - k * 0.12);
      E('path', { d: `M${f1(x - b)},${f1(-y)} Q${f1(x + b)},0 ${f1(x - b)},${f1(y)}`, fill: 'none', stroke: col, 'stroke-width': 5.5 - k * 1.3, 'stroke-linecap': 'round', opacity: 1 - k * 0.3 }, g);
    });
    return g;
  }
  /* stopwatch: one sweep of the hand per second, digital reading below; g.set(seconds) */
  function stopwatch(parent) {
    const g = G(parent);
    E('rect', { x: -13, y: -88, width: 26, height: 16, rx: 5, fill: '#8FA2B0' }, g);
    E('rect', { x: -6, y: -74, width: 12, height: 10, fill: '#8FA2B0' }, g);
    E('rect', { x: 44, y: -64, width: 20, height: 12, rx: 4, fill: '#8FA2B0', transform: 'rotate(42 54 -58)' }, g);
    E('circle', { r: 64, fill: '#E9EEF2', stroke: '#8FA2B0', 'stroke-width': 6 }, g);
    E('circle', { r: 55, fill: '#F7FAFC' }, g);
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r1 = i % 3 ? 48 : 41; E('line', { x1: f1(Math.sin(a) * r1), y1: f1(-Math.cos(a) * r1), x2: f1(Math.sin(a) * 52), y2: f1(-Math.cos(a) * 52), stroke: '#3A4A56', 'stroke-width': i % 3 ? 2.5 : 4.5, 'stroke-linecap': 'round' }, g); }
    const hand = E('line', { x1: 0, y1: 9, x2: 0, y2: -44, stroke: C.bad, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 6.5, fill: C.bad }, g);
    const read = T(g, 0, 124, '0.0 s', { size: 46, weight: 700, anchor: 'middle', fill: C.energy });
    g.set = sec => { hand.setAttribute('transform', `rotate(${f1((sec * 360) % 360)})`); setText(read, sec.toFixed(1) + ' s'); };
    g.set(0);
    return g;
  }
  /* pill with "**bold**" parts coloured boldFill */
  function richChip(parent, text, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75), w = Math.ceil(textWidth(text, size, FD, 700) + size * 1.5);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || C.card2, stroke: o.stroke || 'none', 'stroke-width': o.sw || 2.5 }, g);
    T(g, 0, size * 0.35, text, { size, weight: 600, anchor: 'middle', fill: o.color || C.ink, boldFill: o.boldFill });
    g.w = w; g.h = h;
    return g;
  }
  /* a tiled texture for a lane (particles of the medium) */
  function pattern(id, w, h, x, y, dots, r, fill) {
    const pt = E('pattern', { id, width: w, height: h, patternUnits: 'userSpaceOnUse', x, y }, defs());
    dots.forEach(([cx, cy]) => E('circle', { cx, cy, r, fill }, pt));
    return `url(#${id})`;
  }
  const header = text => { const c = chip(root, text, { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy }); tr(c, 1160 - c.w / 2, 60); op(c, 0); return c; };

  /* ================= A. time: about 1 km every 3 seconds ================= */
  const A = G(root);
  const BAR0 = 200, BAR1 = 1000, BY = 540, PY = 430;
  const spkA = speaker(A); tr(spkA, 118, PY);
  const watch = stopwatch(A); tr(watch, 600, 200);
  E('rect', { x: BAR0, y: BY - 8, width: BAR1 - BAR0, height: 16, rx: 8, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, A);
  const barFill = E('rect', { x: BAR0, y: BY - 8, width: 0, height: 16, rx: 8, fill: C.air }, A);
  T(A, BAR0, BY - 24, '0', { size: 30, weight: 700, anchor: 'middle' });
  T(A, BAR1, BY - 24, '1 km', { size: 30, weight: 700, anchor: 'middle' });
  const secT = [1, 2, 3].map(k => {
    const x = BAR0 + (BAR1 - BAR0) * k / 3;
    E('line', { x1: x, y1: BY - 15, x2: x, y2: BY + 15, stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, A);
    return T(A, x, BY + 48, k + ' s', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  });
  const pulseA = pulseIcon(A, 52, 16);
  const soundLbl = T(A, 0, PY - 68, 'sound', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const earAG = G(A), earAHalo = E('circle', { r: 72, fill: glow(C.air) }, earAG); earIcon(earAG); tr(earAG, 1070, PY);
  const chipV = richChip(A, 'about **330–340 m/s**', { size: 30, stroke: C.air, boldFill: C.air });
  const chipK = richChip(A, 'roughly **1 km every 3 s**', { size: 30, stroke: C.energy, boldFill: C.energy });
  const CHV = [BAR0 + 190, 664], CHK = [BAR1 - 190, 664];

  /* ================= B. depends: packing passes the vibration on ================= */
  const B = G(root);
  const dHead = T(B, 600, 168, 'The speed depends on the medium', { size: 40, weight: 700, anchor: 'middle' });
  const PW = 250, PH = 170, PY0 = 236;
  const PAN = [
    { st: 'gas', n: 10, col: C.air, dk: '#4E8FB8', seed: 3, x: 100, name: 'gas', desc: 'far apart', cross: 2.8, nameFill: C.air, e: 0.15 },
    { st: 'liquid', n: 30, col: C.water, dk: C.waterDk, seed: 5, x: 475, name: 'liquid', desc: 'close, jumbled', cross: 1.25, nameFill: C.water, e: 0.3 },
    { st: 'solid', n: 35, col: '#B7C3CD', dk: '#5D6B78', seed: 7, x: 850, name: 'solid', desc: 'packed tight', cross: 0.55, nameFill: '#C9D3DB', e: 0.12 },
  ].map(p => {
    p.g = G(root);
    p.box = particleBox(p.g, PW, PH, { n: p.n, r: 10, color: p.col, dark: p.dk, state: p.st, seed: p.seed });
    p.dots = Array.from(p.box.querySelectorAll('circle'));
    const cols = Math.ceil(Math.sqrt(p.n * PW / PH));
    p.chain = p.st === 'gas' ? null : Array.from({ length: cols }, (_, c) => p.dots[2 * cols + c]);
    p.hl = G(p.g);
    E('circle', { r: 30, fill: glow(C.energy) }, p.hl);
    E('circle', { r: 15, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, p.hl);
    p.lab = G(B);
    T(p.lab, p.x + PW / 2, PY0 + PH + 52, p.name, { size: 34, weight: 700, anchor: 'middle', fill: p.nameFill });
    T(p.lab, p.x + PW / 2, PY0 + PH + 90, p.desc, { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
    return p;
  });
  const dArrow = arrow(B, 180, 580, 1020, 580, { color: C.energy, width: 6 });
  const dNote = T(B, 600, 630, 'more closely packed → passes the vibration on faster', { size: 30, weight: 600, anchor: 'middle' });

  /* ================= C. the race, to scale ================= */
  const Cg = G(root);
  const L0 = 200, L1 = 1130, LEN = L1 - L0, LH = 58;
  const hdrRace = header('Race · speeds to scale');
  const LANES = [
    { y: 232, name: 'air (gas)', speed: 'about 340 m/s', v: 340, col: C.air, band: 'rgba(159,216,255,0.07)',
      pat: pattern('spdPatAir', 62, 58, L0, 232 - 29, [[12, 14], [40, 40], [52, 10], [26, 47]], 5, 'rgba(159,216,255,0.6)') },
    { y: 362, name: 'water (liquid)', speed: 'about 1,500 m/s', v: 1500, col: C.water, band: 'rgba(76,201,240,0.17)',
      pat: pattern('spdPatWater', 46, 58, L0, 362 - 29, [[7, 8], [23, 12], [39, 7], [13, 26], [30, 30], [42, 23], [6, 45], [21, 50], [37, 45]], 5.5, 'rgba(76,201,240,0.75)') },
    { y: 492, name: 'steel (solid)', speed: 'about 5,000 m/s', v: 5000, col: '#C9D3DB', band: linGrad('#5B6874', '#3A4550', true),
      pat: pattern('spdPatSteel', 13, 11.6, L0, 492 - 29, [[6.5, 5.8]], 4.3, '#9AA7B3') },
  ];
  E('line', { x1: L0, y1: 186, x2: L0, y2: 534, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '8 8' }, Cg);
  const finish = G(Cg);
  for (let k = 0; k < 22; k++) E('rect', { x: L1 + (k % 2) * 8, y: 194 + k * 15.5, width: 8, height: 15.5, fill: k % 2 ? '#F2F7FA' : '#1B2B36' }, finish);
  E('rect', { x: L1, y: 194, width: 16, height: 341, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 2 }, finish);
  T(Cg, L0, 566, 'start', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(Cg, L1 + 8, 566, 'finish', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  LANES.forEach(l => {
    l.g = G(Cg);
    E('rect', { x: L0, y: l.y - LH / 2, width: LEN, height: LH, rx: 12, fill: l.band }, l.g);
    E('rect', { x: L0, y: l.y - LH / 2, width: LEN, height: LH, rx: 12, fill: l.pat }, l.g);
    E('rect', { x: L0, y: l.y - LH / 2, width: LEN, height: LH, rx: 12, fill: 'none', stroke: C.line, 'stroke-width': 2 }, l.g);
    l.trail = E('rect', { x: L0, y: l.y - LH / 2, width: 0, height: LH, rx: 12, fill: C.air }, l.g);
    l.pulse = pulseIcon(l.g, 22, 8);
    l.nameT = T(Cg, L0 + 16, l.y - 42, l.name, { size: 30, weight: 700, fill: l.col });
    l.speedT = T(Cg, L1 - 14, l.y - 42, l.speed, { size: 28, weight: 700, anchor: 'end', fill: l.col });
    l.vpx = l.v * LEN / (5000 * 2.2);
  });
  const glowAir = E('rect', { x: L0 - 4, y: LANES[0].y - LH / 2 - 4, width: LEN + 8, height: LH + 8, rx: 15, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, Cg);
  const photo = E('rect', { x: L0, y: 196, width: LEN + 16, height: 340, rx: 12, fill: '#F2F7FA' }, Cg);
  const winTick = tick(Cg, 17); tr(winTick, 1162, 492);
  const HEATS = [mid('gas', 0.26), mid('liquid', 0.1), mid('solid', 0.12)];
  const tFin = HEATS[2] + 2.2;
  /* lane i: how far its pulse has gone (px) and how visible it is */
  function laneAt(i, t) {
    const tt = Math.min(t, tFin);
    let h = -1; for (let k = i; k < 3; k++) if (tt >= HEATS[k]) h = k;
    if (h < 0) return { d: 0, a: 0 };
    const el = tt - HEATS[h], d = Math.min(LEN, LANES[i].vpx * el);
    let a = clamp(el / 0.2);
    if (h < 2) a *= 1 - P(t, HEATS[h + 1] - 0.35, 0.3, linear);
    return { d, a };
  }
  // fastest in air? slowest! and the memory hook
  const chFast = G(Cg); const cf = chip(chFast, 'fastest in air?', { size: 30, fill: C.card2, stroke: C.bad, sw: 2.5 });
  const cfX = cross(chFast, 15); tr(cfX, cf.w / 2 + 34, 0);
  const chSlow = G(Cg); const cs = chip(chSlow, 'slowest in air!', { size: 30, fill: C.card2, stroke: C.good, sw: 2.5 });
  const csT = tick(chSlow, 15); tr(csT, cs.w / 2 + 34, 0);
  const mnem = richChip(Cg, '**S**olids **S**peed, **G**ases **G**o slow', { size: 32, fill: '#3A3210', stroke: C.energy, boldFill: C.energy });

  /* ================= D. light: nearly a million times faster ================= */
  const Dg = G(root);
  const DX0 = 182, DX1 = 1120, DLY = 286, DSY = 446;
  const dBolt = bolt(Dg); tr(dBolt, 116, 366, 1.0);
  const dBoltGlow = E('circle', { cx: 116, cy: 366, r: 90, fill: glow(C.energy) }, Dg);
  Dg.insertBefore(dBoltGlow, dBolt);
  [DLY, DSY].forEach(y => E('line', { x1: DX0, y1: y, x2: DX1, y2: y, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, Dg));
  const beamGlow = E('line', { x1: DX0, y1: DLY, x2: DX0, y2: DLY, stroke: C.energy, 'stroke-width': 24, 'stroke-linecap': 'round', opacity: 0.22 }, Dg);
  const beam = E('line', { x1: DX0, y1: DLY, x2: DX0, y2: DLY, stroke: C.energy, 'stroke-width': 8, 'stroke-linecap': 'round' }, Dg);
  const beamHead = E('path', { d: 'M0,0 L-30,-18 L-22,0 L-30,18 Z', fill: C.energy }, Dg);
  const sTrail = E('rect', { x: DX0, y: DSY - 26, width: 0, height: 52, rx: 10, fill: C.air }, Dg);
  const sPulse = pulseIcon(Dg, 26, 9);
  T(Dg, DX0, DLY - 40, 'light', { size: 32, weight: 700, fill: C.energy });
  const dLs = T(Dg, DX1, DLY - 40, 'about 300,000,000 m/s', { size: 30, weight: 700, anchor: 'end', fill: C.energy });
  T(Dg, DX0, DSY - 40, 'sound', { size: 32, weight: 700, fill: C.air });
  const dSs = T(Dg, DX1, DSY - 40, 'about 340 m/s', { size: 30, weight: 700, anchor: 'end', fill: C.air });
  const dBarely = T(Dg, DX0 + 64, DSY + 64, 'sound has barely moved', { size: 27, weight: 600, fill: C.muted });
  const dMillion = T(Dg, 600, 628, 'light is nearly a **million times** faster', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ================= E. the thunderstorm ================= */
  const Eg = G(root);
  E('rect', { x: 0, y: 0, width: W, height: H, fill: '#050F18', opacity: 0.55 }, Eg);
  const flash = E('rect', { x: 0, y: 0, width: W, height: H, fill: '#EAF4FF' }, Eg);
  const cloud = G(Eg); tr(cloud, 205, 196);
  [[-96, 22, 40], [-52, -6, 54], [8, -24, 62], [70, -6, 52], [116, 20, 38], [-128, 36, 28]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#3B4755', stroke: '#5A6878', 'stroke-width': 3 }, cloud));
  E('rect', { x: -150, y: 14, width: 290, height: 46, rx: 23, fill: '#3B4755' }, cloud);
  [[-96, 22, 36], [-52, -6, 50], [8, -24, 58], [70, -6, 48], [116, 20, 34]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y + 4, r, fill: '#3B4755' }, cloud));
  const rain = G(Eg), drops = [];
  for (let i = 0; i < 9; i++) drops.push(E('line', { x1: 96 + i * 26, y1: 262, x2: 76 + i * 26, y2: 432, stroke: 'rgba(159,216,255,0.35)', 'stroke-width': 3, 'stroke-dasharray': '14 18', 'stroke-linecap': 'round' }, rain));
  E('path', { d: 'M30,600 Q110,470 215,462 Q320,468 400,600 Z', fill: '#173A29', stroke: '#2E5E40', 'stroke-width': 3 }, Eg);
  E('path', { d: 'M0,596 Q300,578 600,592 T1200,598 L1200,750 L0,750 Z', fill: '#10271A', stroke: '#2E5E3E', 'stroke-width': 3 }, Eg);
  const sBolt = bolt(Eg); tr(sBolt, 214, 354, 2.1);
  const sBoltGlow = E('circle', { cx: 214, cy: 354, r: 160, fill: glow(C.energy) }, Eg);
  Eg.insertBefore(sBoltGlow, sBolt);
  // the house and the observer
  const house = G(Eg);
  E('rect', { x: 1062, y: 506, width: 98, height: 94, fill: '#5E4A3A', stroke: '#8C735D', 'stroke-width': 3 }, house);
  E('path', { d: 'M1050,510 L1111,456 L1168,510 Z', fill: '#8C3B32', stroke: '#B95A4C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, house);
  E('rect', { x: 1076, y: 528, width: 30, height: 28, rx: 3, fill: '#FFD27A', stroke: '#8C735D', 'stroke-width': 3 }, house);
  E('rect', { x: 1122, y: 548, width: 24, height: 52, rx: 3, fill: '#3A2C22' }, house);
  const OBS = [1002, 604], OS = 0.95;
  const obsG = G(Eg); tr(obsG, OBS[0], OBS[1], OS);
  const obsIn = G(obsG); obsIn.setAttribute('transform', 'scale(-1 1)');
  const obs = person(obsIn, { shirt: '#E8424F', shorts: '#3A4A5C' }); obs.pose({ armL: [6, 8], armR: [-6, 8] });
  const EYE = [OBS[0] - 8 * OS, OBS[1] - 176 * OS];
  // the light ray and the thunder's sound front
  const sRay = E('path', { d: `M236,${f1(398)} L${f1(EYE[0] - 14)},${f1(EYE[1])}`, stroke: C.energy, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-dasharray': '18 12' }, Eg);
  const SX0 = 214, SX2 = 980, SX1 = (SX0 + SX2) / 2, SV = (SX2 - SX0) / 6;
  const front = pulseIcon(Eg, 96, 26);
  const thunderRing = G(Eg); tr(thunderRing, EYE[0], EYE[1] + 20);
  [36, 54, 72].forEach((r, k) => E('circle', { r, fill: 'none', stroke: C.air, 'stroke-width': 4 - k, opacity: 0.8 - k * 0.2 }, thunderRing));
  const lblSee = G(Eg), lblHear = G(Eg);
  T(lblSee, 728, 306, 'see the flash at once', { size: 30, weight: 700, fill: C.energy });
  tr(bolt(lblSee), 704, 296, 0.3);
  T(lblHear, 728, 352, 'hear the thunder later', { size: 30, weight: 700, fill: C.air });
  tr(pulseIcon(lblHear, 15, 6), 712, 342);
  // ground ruler, counter bubble, rule card
  const ruler = G(Eg);
  E('line', { x1: SX0, y1: 626, x2: SX2, y2: 626, stroke: '#CFE3EE', 'stroke-width': 3, opacity: 0.7 }, ruler);
  const rTicks = [SX0, SX1, SX2].map((x, k) => {
    const g = G(ruler);
    E('line', { x1: x, y1: 612, x2: x, y2: 640, stroke: '#CFE3EE', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    g.t = T(g, x, 678, ['0 km', '1 km', '2 km'][k], { size: 30, weight: 700, anchor: 'middle', fill: '#CFE3EE' });
    return g;
  });
  const bub = G(Eg); tr(bub, 900, 318);
  E('path', { d: 'M-62,-44 L62,-44 Q78,-44 78,-28 L78,26 Q78,42 62,42 L54,42 L82,84 L22,42 L-62,42 Q-78,42 -78,26 L-78,-28 Q-78,-44 -62,-44 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bub);
  const bubT = T(bub, 0, 17, '1…', { size: 52, weight: 700, anchor: 'middle', fill: C.bg0 });
  const rule = G(Eg);
  card(rule, -200, -75, 400, 150, { fill: 'rgba(20,54,70,0.94)', stroke: C.line });
  T(rule, 0, -21, 'seconds **÷ 3** = km', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const sum1 = T(rule, 0, 41, '3 ÷ 3 = 1 km', { size: 34, weight: 700, anchor: 'middle', fill: C.air });
  const sum2 = T(rule, 0, 41, '6 ÷ 3 = 2 km', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= F. warm air is a little faster ================= */
  const Fg = G(root);
  const wChip = richChip(Fg, '**340 m/s**: a typical value', { size: 32, stroke: C.energy, boldFill: C.energy });
  const X340 = 230 + 340 * 2;
  const wLine = G(Fg);
  E('line', { x1: X340, y1: 268, x2: X340, y2: 590, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '9 9' }, wLine);
  T(wLine, X340, 626, '340 m/s', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const ROWS = [
    { y: 352, c: C.bad, lvl: 0.82, name: '**warm** air, 30 °C', nameFill: '#FF9A8F', v: 350, lab: 'about 350 m/s' },
    { y: 532, c: C.water, lvl: 0.18, name: '**cold** air, 0 °C', nameFill: C.water, v: 330, lab: 'about 330 m/s' },
  ].map(r => {
    r.g = G(Fg);
    const th = thermometer(r.g, 150, r.c); tr(th, 140, r.y + 50); th.set(r.lvl);
    T(r.g, 230, r.y - 52, r.name, { size: 30, weight: 600, boldFill: r.nameFill });
    r.arr = arrow(r.g, 230, r.y, 230 + r.v * 2, r.y, { color: C.air, width: 9 });
    r.lbl = T(r.g, 236, r.y + 50, r.lab, { size: 28, weight: 700, fill: C.air });
    return r;
  });

  /* ================= G. the whip's tiny sonic boom ================= */
  const Gw = G(root);
  const fun = chip(Gw, 'Fun fact', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(fun, 600, 140);
  const slow = T(Gw, 600, 192, 'slowed right down', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const WP = [150, 612];
  const whipper = person(Gw, { shirt: '#5B8DEF', shorts: '#2E3C4A' }); tr(whipper, WP[0], WP[1]);
  whipper.pose({ lean: 0, armL: [-12, 12], armR: [100, -10] });
  const HAND = [WP[0] + 33 * Math.sin(100 * Math.PI / 180) + 33, WP[1] - 146 + 33 * Math.cos(100 * Math.PI / 180)];
  const WH = [HAND[0] + 58, HAND[1] - 12], WL = 760;
  E('path', { d: `M${f1(HAND[0] - 8)},${f1(HAND[1] + 2)} L${f1(WH[0])},${f1(WH[1])}`, stroke: '#6B4A2B', 'stroke-width': 11, 'stroke-linecap': 'round' }, Gw);
  E('path', { d: `M${f1(HAND[0] - 8)},${f1(HAND[1] + 2)} L${f1(HAND[0] + 22)},${f1(HAND[1] - 4)}`, stroke: '#3A2A1A', 'stroke-width': 13, 'stroke-linecap': 'round' }, Gw);
  const rLoop = s => 70 * (1 - s) + 4;
  function lashPt(s, u) {
    const r = rLoop(s), a = s * (WL - Math.PI * r);
    if (u <= a) return [WH[0] + u, WH[1]];
    if (u <= a + Math.PI * r) { const ph = (u - a) / r; return [WH[0] + a + r * Math.sin(ph), WH[1] + r - r * Math.cos(ph)]; }
    return [WH[0] + a - (u - a - Math.PI * r), WH[1] + 2 * r];
  }
  const machG = G(Gw);
  const EMIT = [0.7, 0.76, 0.82, 0.88, 0.94], CS = 250;
  const circles = EMIT.map(() => E('circle', { r: 1, fill: 'none', stroke: C.air, 'stroke-width': 3.5 }, machG));
  const vLines = [0, 1].map(() => E('line', { stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-linecap': 'round' }, machG));
  const lash = [[0, 0.42, 7], [0.42, 0.76, 4.6], [0.76, 1, 2.8]].map(([u0, u1, w]) => ({ u0, u1, el: E('path', { fill: 'none', stroke: '#C9935A', 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Gw) }));
  const tipDot = E('circle', { r: 6, fill: '#F2D6A8' }, Gw);
  const crack = G(Gw);
  T(crack, 0, 0, 'CRACK!', { size: 56, weight: 700, anchor: 'middle', fill: C.energy });
  const lblTip = G(Gw);
  T(lblTip, 1004, 650, 'tip faster than sound', { size: 30, weight: 700, anchor: 'middle' });
  arrow(lblTip, 1022, 614, 1022, 484, { color: C.ink, width: 4 });
  const lblBoom = T(Gw, 690, 300, 'a tiny sonic boom', { size: 28, weight: 700, anchor: 'end', fill: '#F2F7FA' });
  const lblWaves = T(Gw, 640, 680, 'sound waves', { size: 27, weight: 700, anchor: 'middle', fill: C.air });
  const TC = 1.8;
  const crackS = p => 0.5 + 0.5 * Math.pow(clamp(p), 1.7);

  /* ================= update ================= */
  return t => {
    /* --- A: the stopwatch and 1 km --- */
    const aA = 1 - P(t, at('depends') - 0.2, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      const RUNS = [mid('time', 0.08), mid('time', 0.62)], RUN = 3.0;
      const k = t >= RUNS[1] ? 1 : 0, t0 = RUNS[k], el = clamp(t - t0, 0, RUN);
      const x = BAR0 + (BAR1 - BAR0) * el / RUN;
      let pa = t < t0 ? 0 : clamp((t - t0) / 0.15);
      if (k === 0) pa *= 1 - P(t, RUNS[1] - 0.7, 0.4, linear);
      tr(pulseA, x, PY); op(pulseA, pa);
      tr(soundLbl, x - 14, 0); op(soundLbl, pa);
      attr(barFill, 'width', x - BAR0); op(barFill, 0.65 * pa);
      watch.set(t < RUNS[0] ? 0 : el);
      const vib = clamp((t - t0) / 0.6) < 1 && t >= t0 ? 7 * Math.sin(TAU * 5 * (t - t0)) * (1 - (t - t0) / 0.6) : 0;
      spkA.set(vib * AMP, t >= t0 && t - t0 < 0.6 ? 7 * AMP : 0);
      secT.forEach((s, i) => s.setAttribute('fill', t >= t0 && el >= i + 1 - 0.02 ? C.energy : C.muted));
      op(earAHalo, 0.8 * win(t, t0 + RUN - 0.05, t0 + RUN + 1.1, 0.25));
      popIn(chipV, P(t, mid('time', 0.3), 0.6, pop), CHV[0], CHV[1]);
      popIn(chipK, P(t, RUNS[1] + RUN - 0.15, 0.6, pop), CHK[0], CHK[1]);
    }

    /* --- B: three panels; then they become the lane icons --- */
    const aB = Math.min(P(t, at('depends') - 0.1, 0.5, linear), 1 - P(t, at('gas') - 0.45, 0.3, linear));
    op(B, aB);
    const mv = P(t, at('gas') - 0.35, 0.9);
    const aP = Math.min(P(t, at('depends') - 0.1, 0.5, linear), 1 - P(t, at('light') - 0.3, 0.5, linear));
    PAN.forEach((p, i) => {
      if (aP <= 0) { op(p.g, 0); return; }
      const pin = P(t, mid('depends', 0.1 + i * 0.12), 0.6, pop);
      const s = lerp(1, 0.39, mv), x = lerp(p.x, 44, mv), y = lerp(PY0, LANES[i].y - 35, mv);
      tr(p.g, x, y + (1 - clamp(pin)) * 18, s * (0.85 + 0.15 * clamp(pin)));
      const laneOn = i === 0 ? 1 : P(t, at(['gas', 'liquid', 'solid'][i]) - 0.2, 0.4, linear);
      op(p.g, aP * clamp(pin * 2) * lerp(1, 0.4 + 0.6 * laneOn, mv));
      p.box.set(p.st, p.st === 'gas' ? t * 0.15 * AMP : t * AMP, p.e);
      // the energy hops particle to particle, left to right
      const hon = P(t, mid('depends', 0.32), 0.4, linear) * (1 - P(t, at('gas') - 0.4, 0.3, linear));
      op(p.hl, hon);
      if (hon > 0) {
        let pts;
        if (p.chain) pts = p.chain.map(el => [+el.getAttribute('cx'), +el.getAttribute('cy')]);
        else pts = p.dots.map(el => [+el.getAttribute('cx'), +el.getAttribute('cy')]).sort((a, b) => a[0] - b[0]);
        const q = (((t - mid('depends', 0.32)) / p.cross) % 1 + 1) % 1, kf = q * (pts.length - 1), k0 = Math.min(pts.length - 2, Math.floor(kf));
        const hop = ease(clamp((kf - k0 - 0.3) / 0.7));
        const hx = lerp(pts[k0][0], pts[k0 + 1][0], hop), hy = lerp(pts[k0][1], pts[k0 + 1][1], hop) - Math.sin(hop * Math.PI) * 10;
        tr(p.hl, hx, hy);
        op(p.hl, hon * Math.min(1, q * 12, (1 - q) * 12));
      }
    });
    if (aB > 0) {
      op(dHead, P(t, at('depends'), 0.5, linear));
      PAN.forEach((p, i) => op(p.lab, P(t, mid('depends', 0.14 + i * 0.12), 0.5, linear)));
      dArrow.set(P(t, mid('depends', 0.55), 1.0)); op(dArrow, P(t, mid('depends', 0.55), 0.2, linear));
      op(dNote, P(t, mid('depends', 0.62), 0.5, linear));
    }

    /* --- C: the race --- */
    const aC = Math.min(P(t, at('gas') + 0.1, 0.5, linear), 1 - P(t, at('light') - 0.3, 0.5, linear));
    op(Cg, aC); op(hdrRace, aC);
    if (aC > 0) {
      LANES.forEach((l, i) => {
        const tOn = at(['gas', 'liquid', 'solid'][i]) - 0.2, on = P(t, tOn, 0.4, linear);
        op(l.g, 0.3 + 0.7 * on);
        op(l.nameT, 0.35 + 0.65 * on);
        op(l.speedT, P(t, i === 0 ? mid('gas', 0.45) : mid(['gas', 'liquid', 'solid'][i], 0.42), 0.5, linear));
        const st = laneAt(i, t);
        tr(l.pulse, L0 + st.d, l.y); op(l.pulse, st.a);
        attr(l.trail, 'width', Math.max(0, st.d)); op(l.trail, 0.2 * st.a);
      });
      op(photo, 0.55 * (1 - P(t, tFin, 0.5, linear)) * (t >= tFin ? 1 : 0));
      const wt = P(t, tFin + 0.15, 0.45, pop); op(winTick, clamp(wt * 2)); tr(winTick, 1162, 492, Math.max(0.01, wt));
      op(glowAir, win(t, mid('solids', 0.36), at('light') - 0.2, 0.3) * (0.55 + 0.45 * wave(t, 1.0)));
      const pf = P(t, mid('solids', 0.03), 0.5, pop); popIn(chFast, pf, 380, 616);
      const px = P(t, mid('solids', 0.18), 0.4, pop); op(cfX, clamp(px * 2)); tr(cfX, cf.w / 2 + 34, 0, Math.max(0.01, px));
      const ps = P(t, mid('solids', 0.34), 0.5, pop); popIn(chSlow, ps, 820, 616);
      const pk = P(t, mid('solids', 0.42), 0.4, pop); op(csT, clamp(pk * 2)); tr(csT, cs.w / 2 + 34, 0, Math.max(0.01, pk));
      popIn(mnem, P(t, mid('solids', 0.6), 0.6, pop), 600, 690);
    }

    /* --- D: light against sound --- */
    const aD = Math.min(P(t, at('light') - 0.2, 0.5, linear), 1 - P(t, at('storm') - 0.2, 0.4, linear));
    op(Dg, aD);
    if (aD > 0) {
      const tL = mid('light', 0.12);
      const fl = win(t, tL - 0.05, tL + 0.5, 0.15);
      op(dBoltGlow, 0.35 + 0.65 * fl); tr(dBolt, 116, 366, 1 + 0.12 * fl);
      const xh = lerp(DX0, DX1, P(t, tL, 0.14, linear));
      attr(beam, 'x2', xh); attr(beamGlow, 'x2', xh);
      op(beam, t >= tL ? 1 : 0); op(beamGlow, t >= tL ? 1 : 0);
      beamHead.setAttribute('transform', `translate(${f1(xh + 6)} ${DLY})`); op(beamHead, t >= tL ? 1 : 0);
      const sd = Math.max(0, t - tL) * 7;
      tr(sPulse, DX0 + 18 + sd, DSY); op(sPulse, t >= tL ? 1 : 0.0);
      attr(sTrail, 'width', 18 + sd); op(sTrail, t >= tL ? 0.2 : 0);
      op(dLs, P(t, mid('light', 0.25), 0.5, linear)); op(dSs, P(t, mid('light', 0.4), 0.5, linear));
      op(dMillion, P(t, mid('light', 0.5), 0.6, linear));
      op(dBarely, P(t, mid('light', 0.62), 0.5, linear));
    }

    /* --- E: the storm, counting --- */
    const aE = Math.min(P(t, at('storm') - 0.2, 0.5, linear), 1 - P(t, at('warm') - 0.3, 0.5, linear));
    op(Eg, aE);
    if (aE > 0) {
      const tF = [at('storm') + 0.35, mid('count', 0.28)];
      const k = t >= tF[1] - 0.6 ? 1 : 0, t0 = tF[k];
      const fl = Math.max(win(t, tF[0], tF[0] + 0.35, 0.12), win(t, tF[1], tF[1] + 0.35, 0.12));
      op(flash, 0.42 * fl);
      const bl = Math.max(win(t, tF[0] - 0.02, tF[0] + 0.7, 0.1), win(t, tF[1] - 0.02, tF[1] + 0.7, 0.1));
      op(sBolt, bl); op(sBoltGlow, bl);
      op(sRay, Math.max(win(t, tF[0], tF[0] + 1.5, 0.15), win(t, tF[1], tF[1] + 1.5, 0.15)));
      sRay.setAttribute('stroke-dashoffset', f1(-t * 160));
      drops.forEach((d, i) => d.setAttribute('stroke-dashoffset', f1(-(t * 220 * AMP + i * 9))));
      // the sound front crawls along the ground at 1 km every 3 s
      const el = t - t0, fx = SX0 + SV * clamp(el, 0, 6);
      let fa = el < 0 ? 0 : clamp(el / 0.3);
      if (k === 0) fa *= 1 - P(t, tF[0] + 6.05, 0.5, linear);
      else fa *= 1 - 0.5 * P(t, tF[1] + 6.2, 0.6, linear);
      tr(front, fx, 512); op(front, fa);
      const arrive = Math.max(win(t, tF[0] + 5.9, tF[0] + 7.0, 0.2), P(t, tF[1] + 5.95, 0.25, linear));
      op(thunderRing, arrive); tr(thunderRing, EYE[0], EYE[1] + 20, 0.85 + 0.15 * wave(t, 0.5));
      op(lblSee, win(t, tF[0] + 0.25, at('count') + 0.1, 0.35));
      op(lblHear, win(t, tF[0] + 5.9, at('count') + 0.2, 0.3));
      // the count
      op(ruler, P(t, at('count') + 0.1, 0.5, linear));
      const n = Math.floor(clamp(t - tF[1], 0, 6));
      const bp = P(t, tF[1] + 0.85, 0.4, pop); popIn(bub, bp, 900, 318);
      setText(bubT, Math.max(1, n) + (n >= 6 ? '' : '…'));
      tr(bubT, 0, 0, 1 + 0.12 * Math.max(0, 1 - ((t - tF[1]) % 1) * 4) * (t > tF[1] + 0.95 ? 1 : 0));
      rTicks.forEach((g, i) => g.t.setAttribute('fill', (i === 1 && t >= tF[1] + 2.95) || (i === 2 && t >= tF[1] + 5.95) ? C.energy : '#CFE3EE'));
      const rp = P(t, mid('count', 0.5), 0.6, pop); popIn(rule, rp, 600, 187);
      op(sum1, P(t, tF[1] + 2.95, 0.4, linear) * (1 - P(t, tF[1] + 5.95, 0.22, linear)));
      op(sum2, P(t, tF[1] + 6.2, 0.35, linear));
    }

    /* --- F: warm and cold air --- */
    const aF = Math.min(P(t, at('warm') - 0.2, 0.5, linear), 1 - P(t, at('whip') - 0.3, 0.5, linear));
    op(Fg, aF);
    if (aF > 0) {
      popIn(wChip, P(t, at('warm') + 0.05, 0.6, pop), 600, 150);
      op(wLine, P(t, mid('warm', 0.12), 0.5, linear));
      ROWS.forEach((r, i) => {
        popIn(r.g, P(t, mid('warm', 0.3 + i * 0.06), 0.6, pop), 0, 0, 1);
        const dp = P(t, mid('warm', 0.42), 1.4, linear);
        r.arr.set(dp);                       // same time for both: the warm arrow grows faster and ends longer
        op(r.lbl, P(t, mid('warm', 0.42) + 1.3, 0.4, linear));
      });
    }

    /* --- G: the whip --- */
    const aG = P(t, at('whip') - 0.2, 0.5, linear);
    op(Gw, aG);
    if (aG > 0) {
      const tC0 = mid('whip', 0.13), p = clamp((t - tC0) / TC), s = crackS(p);
      op(slow, P(t, tC0 - 0.2, 0.4, linear));
      lash.forEach(sg => {
        const pts = [], nseg = Math.ceil((sg.u1 - sg.u0) * 70);
        for (let k = 0; k <= nseg; k++) pts.push(lashPt(s, (sg.u0 + (sg.u1 - sg.u0) * k / nseg) * WL));
        sg.el.setAttribute('d', openPath(pts));
      });
      const tip = lashPt(s, WL);
      attr(tipDot, 'cx', tip[0]); attr(tipDot, 'cy', tip[1]);
      // sound waves the tip gives off, and the V-shaped boom they pile into
      EMIT.forEach((pe, j) => {
        const c = lashPt(crackS(pe), WL), r = CS * TC * (p - pe);
        attr(circles[j], 'cx', c[0]); attr(circles[j], 'cy', c[1]); attr(circles[j], 'r', Math.max(0.5, r));
        op(circles[j], p > pe ? 0.85 : 0);
      });
      const c0 = lashPt(crackS(EMIT[0]), WL), r0 = CS * TC * (p - EMIT[0]);
      const dx = c0[0] - tip[0], dy = c0[1] - tip[1], dist = Math.hypot(dx, dy);
      const vOn = p > EMIT[0] + 0.06 && r0 < dist ? P(p, EMIT[0] + 0.06, 0.12, linear) : 0;
      if (vOn > 0) {
        const al = Math.asin(clamp(r0 / dist, 0, 0.95)), Lt = Math.sqrt(Math.max(0, dist * dist - r0 * r0)), base = Math.atan2(dy, dx);
        vLines.forEach((ln, i) => {
          const a = base + (i ? al : -al);
          attr(ln, 'x1', tip[0]); attr(ln, 'y1', tip[1]); attr(ln, 'x2', tip[0] + Math.cos(a) * Lt); attr(ln, 'y2', tip[1] + Math.sin(a) * Lt);
        });
      }
      vLines.forEach(ln => op(ln, vOn));
      const cp = P(t, tC0 + TC - 0.05, 0.4, pop); op(crack, clamp(cp * 2)); tr(crack, tip[0] - 20, tip[1] - 92, Math.max(0.01, 0.6 + 0.4 * cp), -6);
      op(lblTip, P(t, mid('whip', 0.58), 0.5, linear));
      op(lblBoom, P(t, mid('whip', 0.7), 0.5, linear));
      op(lblWaves, P(t, mid('whip', 0.48), 0.5, linear));
    }
  };
});

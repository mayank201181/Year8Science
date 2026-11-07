/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the silent
   thinking time, then the answer appears with a small picture and a progress dot fills: an empty bell jar,
   a trace growing taller with its spacing unchanged, the steel lane winning the race, the frequency line
   with the ultrasound zone lit, and lightning over a hill 1 km away. Outro: "Brilliant work!" with a burst
   of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const f1 = v => (+v).toFixed(1);

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const Y = C.energy;
  const CA = C.heat;   // amplitude orange: the quantity colour of chapter 9

  /* ---------- mini art drawn like the full chapters ---------- */
  /* chapter 3's bell-jar apparatus with no air inside, scaled s; origin = middle of the base: a glass jar with a
     bung, the electric bell hanging on its wires from a battery box, the base plate and the pipe to the pump.
     g.strike(hit 0..1) swings the hammer onto the gong */
  function bellJar(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    const yA = f1(-240 - 138 * Math.sqrt(1 - (16 / 170) * (16 / 170)));
    const jarD = `M-170,0 L-170,-240 A170,138 0 0 1 -16,${yA} L-16,-396 L16,-396 L16,${yA} A170,138 0 0 1 170,-240 L170,0`;
    E('path', { d: 'M180,13 L330,13', stroke: '#9DB7C6', 'stroke-width': 28, 'stroke-linecap': 'round' }, k);
    E('path', { d: 'M180,13 L330,13', stroke: '#0E2530', 'stroke-width': 21, 'stroke-linecap': 'round' }, k);
    E('path', { d: 'M280,13 L280,-34', stroke: '#9DB7C6', 'stroke-width': 26, 'stroke-linecap': 'round' }, k);
    E('path', { d: 'M280,13 L280,-34', stroke: '#0E2530', 'stroke-width': 19, 'stroke-linecap': 'round' }, k);
    E('rect', { x: 254, y: -27, width: 52, height: 14, rx: 7, fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 2 }, k);
    E('circle', { cx: 280, cy: -20, r: 7, fill: '#F4F7FA' }, k);
    E('rect', { x: -210, y: 0, width: 420, height: 26, rx: 6, fill: '#5E6E7B', stroke: '#8FA2B0', 'stroke-width': 2.5 }, k);
    E('path', { d: 'M-6,-300 L-6,-438 M6,-300 L6,-438', stroke: '#E9EEF2', 'stroke-width': 3 }, k);
    E('rect', { x: -48, y: -478, width: 96, height: 40, rx: 8, fill: '#2E3D48', stroke: '#6E8496', 'stroke-width': 2.5 }, k);
    tr(bolt(k), 0, -458, 0.27);
    const bell = G(k); tr(bell, 0, -300);
    E('rect', { x: -32, y: 0, width: 64, height: 36, rx: 7, fill: '#46545F', stroke: '#8FA2B0', 'stroke-width': 3 }, bell);
    E('rect', { x: -22, y: 8, width: 14, height: 20, rx: 3, fill: '#C9853F' }, bell);
    E('rect', { x: 8, y: 8, width: 14, height: 20, rx: 3, fill: '#C9853F' }, bell);
    E('line', { x1: 0, y1: 36, x2: 0, y2: 46, stroke: '#8FA2B0', 'stroke-width': 7 }, bell);
    E('circle', { cx: 0, cy: 82, r: 38, fill: ball('#F6D77A', '#A87A16'), stroke: '#FFE8A3', 'stroke-width': 2.5 }, bell);
    E('circle', { cx: 0, cy: 82, r: 29, fill: 'none', stroke: '#C99A2E', 'stroke-width': 2, opacity: 0.6 }, bell);
    E('circle', { cx: 0, cy: 82, r: 6, fill: '#8C6410' }, bell);
    const ham = G(bell);
    E('line', { x1: 0, y1: 0, x2: 0, y2: 46, stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, ham);
    E('circle', { cx: 0, cy: 52, r: 9, fill: ball('#E3EAEF', '#7D8C99') }, ham);
    E('circle', { cx: 30, cy: 32, r: 4.5, fill: '#1B2B36' }, bell);
    E('path', { d: jarD + 'Z', fill: GLASS.fill }, k);
    E('path', { d: jarD, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M-154,-40 L-154,-228 Q-146,-300 -70,-342', fill: 'none', stroke: GLASS.shine, 'stroke-width': 7, 'stroke-linecap': 'round' }, k);
    E('path', { d: 'M-22,-414 L22,-414 L17,-388 L-17,-388 Z', fill: '#8C4A3C', stroke: '#C27A6A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, k);
    g.strike = hit => tr(ham, 30, 32, 1, -20 - 24 * (1 - clamp(hit)));
    g.strike(0);
    return g;
  }
  /* chapter 6's oscilloscope screen (w x h, centred): dark green face, grid at 40%, dashed rest line */
  function scopeScreen(parent, w, h) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: '#06140F', stroke: '#2E4A3C', 'stroke-width': 3 }, g);
    const grid = G(g, { opacity: 0.4 });
    for (let i = 1; i < 10; i++) E('line', { x1: -w / 2 + i * w / 10, x2: -w / 2 + i * w / 10, y1: -h / 2 + 4, y2: h / 2 - 4, stroke: C.line, 'stroke-width': 1.5 }, grid);
    for (let j = 1; j < 8; j++) if (j !== 4) E('line', { x1: -w / 2 + 4, x2: w / 2 - 4, y1: -h / 2 + j * h / 8, y2: -h / 2 + j * h / 8, stroke: C.line, 'stroke-width': 1.5 }, grid);
    E('line', { x1: -w / 2 + 10, x2: w / 2 - 10, y1: 0, y2: 0, stroke: '#3E8A66', 'stroke-width': 2.5, 'stroke-dasharray': '9 8' }, g);
    return g;
  }
  /* chapter 4's sound pulse: three ")" arcs with a soft glow, apex of the front arc at (0,0) */
  function pulseIcon(parent, hh, b) {
    const g = G(parent);
    E('ellipse', { cx: -16, cy: 0, rx: Math.max(26, b * 2.4), ry: hh * 1.08, fill: glow(C.air) }, g);
    [0, 1, 2].forEach(k => {
      const x = -k * Math.max(13, b), y = hh * (1 - k * 0.12);
      E('path', { d: `M${f1(x - b)},${f1(-y)} Q${f1(x + b)},0 ${f1(x - b)},${f1(y)}`, fill: 'none', stroke: C.air, 'stroke-width': 5.5 - k * 1.3, 'stroke-linecap': 'round', opacity: 1 - k * 0.3 }, g);
    });
    return g;
  }
  /* chapter 4's race lanes at k x their size: a band with the medium's particles, a faint trail and a pulse */
  const LANE_LOOK = [
    { band: 'rgba(159,216,255,0.07)', tile: [62, 58], dots: [[12, 14], [40, 40], [52, 10], [26, 47]], r: 5, fill: 'rgba(159,216,255,0.6)' },
    { band: 'rgba(76,201,240,0.17)', tile: [46, 58], dots: [[7, 8], [23, 12], [39, 7], [13, 26], [30, 30], [42, 23], [6, 45], [21, 50], [37, 45]], r: 5.5, fill: 'rgba(76,201,240,0.75)' },
    { band: null, tile: [13, 11.6], dots: [[6.5, 5.8]], r: 4.3, fill: '#9AA7B3' },
  ];
  function raceLane(parent, i, x0, y, len, k, id) {
    const L = LANE_LOOK[i], h = 58 * k, g = G(parent);
    const pt = E('pattern', { id, width: f1(L.tile[0] * k), height: f1(L.tile[1] * k), patternUnits: 'userSpaceOnUse', x: x0, y: f1(y - h / 2) }, defs());
    L.dots.forEach(([cx, cy]) => E('circle', { cx: f1(cx * k), cy: f1(cy * k), r: f1(L.r * k), fill: L.fill }, pt));
    const box = { x: x0, y: y - h / 2, width: len, height: h, rx: 12 * k };
    E('rect', Object.assign({ fill: L.band || linGrad('#5B6874', '#3A4550', true) }, box), g);
    E('rect', Object.assign({ fill: `url(#${id})` }, box), g);
    E('rect', Object.assign({ fill: 'none', stroke: C.line, 'stroke-width': 2 }, box), g);
    g.trail = E('rect', Object.assign({}, box, { width: 0, fill: C.air, opacity: 0.2 }), g);
    g.pulse = G(g); pulseIcon(G(g.pulse, { transform: `scale(${k})` }), 22, 8);
    g.set = d => { attr(g.trail, 'width', Math.max(0, d)); tr(g.pulse, x0 + d, y); };
    g.set(0);
    return g;
  }
  /* horizontal gradient of one colour; stops [[offset, opacity], ...] */
  let gid = 0;
  function hgrad(color, stops) {
    const id = 'quiz-hg' + (++gid), lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    stops.forEach(([o, a]) => E('stop', { offset: o, 'stop-color': color, 'stop-opacity': a }, lg));
    return `url(#${id})`;
  }
  /* chapter 4's storm cloud, house and observer (the observer faces left, towards the storm) */
  function stormCloud(parent) {
    const g = G(parent);
    [[-96, 22, 40], [-52, -6, 54], [8, -24, 62], [70, -6, 52], [116, 20, 38], [-128, 36, 28]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#3B4755', stroke: '#5A6878', 'stroke-width': 3 }, g));
    E('rect', { x: -150, y: 14, width: 290, height: 46, rx: 23, fill: '#3B4755' }, g);
    [[-96, 22, 36], [-52, -6, 50], [8, -24, 58], [70, -6, 48], [116, 20, 34]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y + 4, r, fill: '#3B4755' }, g));
    return g;
  }
  function houseAndObserver(parent) {
    const g = G(parent), house = G(g);
    E('rect', { x: 60, y: -98, width: 98, height: 94, fill: '#5E4A3A', stroke: '#8C735D', 'stroke-width': 3 }, house);
    E('path', { d: 'M48,-94 L109,-148 L166,-94 Z', fill: '#8C3B32', stroke: '#B95A4C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, house);
    E('rect', { x: 74, y: -76, width: 30, height: 28, rx: 3, fill: '#FFD27A', stroke: '#8C735D', 'stroke-width': 3 }, house);
    E('rect', { x: 120, y: -56, width: 24, height: 52, rx: 3, fill: '#3A2C22' }, house);
    person(G(g, { transform: 'scale(-1 1)' }), { shirt: '#E8424F', shorts: '#3A4A5C' }).pose({ armL: [6, 8], armR: [-6, 8] });
    return g;
  }

  /* ---------- progress dots (top right) ---------- */
  const dotsG = G(root);
  const dots = [0, 1, 2, 3, 4].map(k => {
    const g = G(dotsG); tr(g, 984 + k * 42, 58);
    const ring_ = E('circle', { r: 14, fill: 'rgba(10,27,39,0.6)', stroke: C.muted, 'stroke-width': 3 }, g);
    const fill = E('circle', { r: 14, fill: Y }, g);
    const tk = tick(g, 7, C.bg0);
    return { g, ring_, fill, tk };
  });

  /* ---------- intro ---------- */
  const intro = G(root);
  const bub = G(intro); tr(bub, 600, 190);
  E('path', { d: 'M-70,-52 H70 Q92,-52 92,-30 V22 Q92,44 70,44 H-6 L-34,72 L-30,44 H-70 Q-92,44 -92,22 V-30 Q-92,-52 -70,-52 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bub);
  T(bub, 0, 22, '?', { size: 76, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(intro, 600, 350, 'Quick-fire quiz', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures for the answers (drawn around (0,0), placed at (300, 556)) ---------- */
  // 1. chapter 3's bell jar with the air pumped out: the hammer strikes, but there are no particles to carry the sound
  function picJar(g) {
    const jar = bellJar(g, 0.36); tr(jar, -20, 72);
    const ghosts = G(g);
    [[-60, -4], [18, -8], [-56, 40], [16, 44], [-20, 54], [-44, -40], [8, -42]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 9, fill: 'none', stroke: C.air, 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0.45 }, ghosts));
    const lab = chip(g, 'no particles', { size: 26, fill: C.card2, stroke: C.line, sw: 2 }); tr(lab, 0, 118);
    return t => {
      jar.strike(Math.pow(wave(t * calm, 0.7), 6));
      op(ghosts, 0.5 + 0.5 * wave(t, 1.8));
    };
  }
  // 2. louder at the same pitch, on chapter 6's oscilloscope: the trace grows taller, its peaks keep their places
  function picTrace(g) {
    const w = 270, h = 150;
    scopeScreen(g, w, h);
    const WL = 82, X0 = -123;
    const ghost = sineWave(g, { w: 246, amp: 16, wl: WL, color: C.good, width: 3 }); tr(ghost, X0, 0); ghost.setAttribute('opacity', 0.35);
    const halo = sineWave(g, { w: 246, amp: 16, wl: WL, color: C.good, width: 13 }); tr(halo, X0, 0); halo.firstChild.setAttribute('opacity', 0.16);
    const tr_ = sineWave(g, { w: 246, amp: 16, wl: WL, color: C.good, width: 4.5 }); tr(tr_, X0, 0);
    const peaks = [0, 1, 2].map(k => E('circle', { cx: X0 + WL * (k + 0.25), r: 6, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 1.5 }, g));
    T(g, 0, h / 2 + 40, 'taller, same spacing', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    return t => {
      const a = lerp(16, 50, P(t, at('a2') + 0.3, 1.4));
      halo.set({ amp: a, phase: 0 }); tr_.set({ amp: a, phase: 0 });
      peaks.forEach(p => attr(p, 'cy', -a));
    };
  }
  // 3. chapter 4's race lanes: speeds to scale (steel 5,000 : water 1,500 : air 340 m/s)
  function picRace(g) {
    const L0 = -70, L = 200;
    E('line', { x1: L0, y1: -84, x2: L0, y2: 80, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, g);
    for (let q = 0; q < 20; q++) E('rect', { x: L0 + L + (q % 2) * 5, y: -78 + q * 7.8, width: 5, height: 7.8, fill: q % 2 ? '#F2F7FA' : '#1B2B36' }, g);
    E('rect', { x: L0 + L, y: -78, width: 10, height: 156, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 1.5 }, g);
    const lanes = [['air', 340, C.air], ['water', 1500, C.water], ['steel', 5000, '#C9D3DB']].map(([nm, v, col], i) => {
      const y = -60 + i * 58;
      T(g, L0 - 16, y + 9, nm, { size: 27, weight: 700, fill: col, anchor: 'end' });
      return { lane: raceLane(g, i, L0, y, L, 0.52, 'quizLane' + i), y, d: L * v / 5000 };
    });
    const win_ = tick(g, 14); tr(win_, L0 + L + 40, lanes[2].y);
    T(g, 0, 118, 'fastest in solids', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    return t => {
      const p = P(t, at('a3') + 0.2, 1.3, linear);
      lanes.forEach(l => l.lane.set(l.d * p));
      const w = P(t, at('a3') + 1.5, 0.45, pop); op(win_, clamp(w * 2)); tr(win_, L0 + L + 40, lanes[2].y, Math.max(0.01, w));
    };
  }
  // 4. the lesson's frequency line (chapters 7, 8 and 11), drawn at DEC px per x10 instead of 186 with the same
  //    proportions (zones, fading ends, a tick for each x10 from 2 Hz to 200,000 Hz): the ultrasound zone lights up
  function picLine(g) {
    const DEC = 62, K = DEC / 186, y = 10, xL = -270, h = 12, fade = 60 * K, top = y - h / 2;
    const fx = hz => xL + fade + DEC * Math.log10(hz / 2), xR = fx(200000) + fade;
    const wT = xR - xL, wI = fx(20) - xL, wU = xR - fx(20000);
    E('rect', { x: xL, y: top, width: wT, height: h, fill: hgrad('#24485A', [[0, 0], [fade / wT, 1], [1 - fade / wT, 1], [1, 0]]) }, g);
    E('rect', { x: xL, y: top, width: wI, height: h, fill: hgrad(C.heat, [[0, 0], [fade / wI, 1], [1, 1]]), opacity: 0.55 }, g);
    E('rect', { x: fx(20), y: top, width: fx(20000) - fx(20), height: h, fill: C.good, opacity: 0.55 }, g);
    const halo = E('ellipse', { cx: (fx(20000) + xR) / 2, cy: y, rx: 70, ry: 40, fill: glow(C.ethanol) }, g);
    E('rect', { x: fx(20000), y: top, width: wU, height: h, fill: hgrad(C.ethanol, [[0, 1], [1 - fade / wU, 1], [1, 0]]) }, g);
    [2, 20, 200, 2000, 200000].forEach(hz => E('line', { x1: fx(hz), x2: fx(hz), y1: top + h + 2, y2: top + h + 9, stroke: C.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g));
    E('line', { x1: fx(20000), x2: fx(20000), y1: y - 18, y2: y + 18, stroke: C.ink, 'stroke-width': 3 }, g);
    T(g, fx(20000), y + 48, '20,000 Hz', { size: 26, weight: 700, fill: C.ink, anchor: 'middle' });
    T(g, (fx(20000) + fx(200000)) / 2, y - 28, 'ultrasound', { size: 27, weight: 700, fill: C.ethanol, anchor: 'middle' });
    const ear = G(g); tr(ear, (fx(20) + fx(20000)) / 2, y - 46, 0.42);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ear);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 7, 'stroke-linecap': 'round' }, ear);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, ear);
    return t => { op(halo, 0.55 + 0.45 * wave(t, 1.4)); };
  }
  // 5. chapter 4's storm in miniature: lightning over a hill, 1 km from the observer
  function picStorm(g) {
    const flash = E('circle', { cx: -120, cy: -30, r: 120, fill: glow(C.energy) }, g);
    E('path', { d: 'M-190,70 Q-160,21 -120,18 Q-80,20 -50,70 Z', fill: '#173A29', stroke: '#2E5E40', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-205,70 Q-5,64 195,70 L195,82 L-205,82 Z', fill: '#10271A', stroke: '#2E5E3E', 'stroke-width': 2.5 }, g);
    const cloud = stormCloud(g); tr(cloud, -124, -72, 0.46);
    const zap = bolt(g); tr(zap, -120, -13, 0.6);
    const obs = houseAndObserver(g); tr(obs, 92, 70, 0.36);
    const dimG = G(g);
    E('line', { x1: -116, x2: 88, y1: 104, y2: 104, stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, dimG);
    E('path', { d: 'M-118,104 l12,-8 l0,16 Z M90,104 l-12,-8 l0,16 Z', fill: Y }, dimG);
    E('path', { d: 'M-120,92 L-120,116 M92,92 L92,116', stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, dimG);
    const km = chip(g, '1 km', { size: 28, fill: C.bg0, stroke: Y, color: Y, sw: 2.5 }); tr(km, -14, 104);
    return t => {
      const t0 = at('a5') + 0.1, u = ((t - t0) * calm) % 2.6;
      const f = t < t0 ? 0 : Math.max(0, 1 - u / 0.35) * (u < 0.35 ? 1 : 0);
      op(flash, f * 0.9); op(zap, 0.45 + 0.55 * (u < 0.5 && t >= t0 ? 1 : 0));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'Why can’t sound travel\nthrough a vacuum?', a: [[['A vacuum has ', C.ink], ['no particles', Y, 800]], [['to pass the vibration along.', C.ink]]], pic: picJar },
    { q: 'A sound gets louder, but its pitch\nstays the same. What has changed?', a: [[['Its ', C.ink], ['amplitude', CA, 800], [' is bigger.', C.ink]], [['Its frequency is the same.', C.ink]]], pic: picTrace },
    { q: 'Is sound fastest through\nair, water or steel?', a: [[['Steel.', Y, 800]], [['Sound is fastest in solids.', C.ink]]], pic: picRace },
    { q: 'What is ultrasound?', a: [[['Sound ', C.ink], ['above 20,000 Hz', Y, 800], [':', C.ink]], [['too high for humans to hear.', C.ink]]], pic: picLine },
    { q: 'You see lightning, then hear the thunder\n3 seconds later. About how far away\nis the storm?', a: [[['About ', C.ink], ['1 kilometre', Y, 800], [':', C.ink]], [['3 seconds ÷ 3 = 1 km', C.ink]]], pic: picStorm },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const n = d.q.split('\n').length;
    T(qc, 600, n === 1 ? 277 : n === 2 ? 250 : 238, d.q, { size: n > 2 ? 38 : 42, weight: 700, anchor: 'middle', lh: n > 2 ? 48 : 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    d.a.forEach((line, k) => rich(ans, 464, 526 + k * 52, line, { size: 40, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Sound quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Sound  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);

  /* ---------- update ---------- */
  return t => {
    t = Math.min(t, S.D);                       // hold the final frame beyond the chapter's end
    // progress dots
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') + 0.1, 0.35);
    op(intro, ia);
    if (ia > 0) tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.2, nx + 0.05, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      if (ap > 0) q.anim(t);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4);
        const d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI));
        op(o.s, u > 0 ? Math.sin(Math.min(1, u) * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});

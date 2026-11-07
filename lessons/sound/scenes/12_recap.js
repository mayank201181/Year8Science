/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (Fast Pitch, Big Bang; No air,
   no aware; Solids Speed, Gases Go slow; 20 to 20k) -> the cards shrink away for "5 exam traps": each trap
   shows the wrong idea struck out and the right idea ticked, with a small picture. */
scene('recap', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const f1 = v => (+v).toFixed(1);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Solids Speed ..." with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy;
  const CF = C.good, CA = C.heat;   // frequency green, amplitude orange: the quantity colours of chapter 9
  /* a dashed rest line with a kit sine trace on it, from x0, w wide */
  function trace(parent, x0, y, w, amp, wl, color) {
    E('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, parent);
    const s = sineWave(parent, { w, amp, wl, color: color || C.air, width: 4 }); tr(s, x0, y);
    return s;
  }
  /* a small oscilloscope screen (w x h, centred), drawn like chapter 6's: dark green face, grid at 40%,
     dashed rest line, green trace with a soft halo; g.trace.set({...}) */
  function scope(parent, w, h, amp, wl) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: '#06140F', stroke: '#2E4A3C', 'stroke-width': 3 }, g);
    const grid = G(g, { opacity: 0.4 });
    for (let i = 1; i < 10; i++) E('line', { x1: -w / 2 + i * w / 10, x2: -w / 2 + i * w / 10, y1: -h / 2 + 4, y2: h / 2 - 4, stroke: C.line, 'stroke-width': 1.5 }, grid);
    for (let j = 1; j < 8; j++) if (j !== 4) E('line', { x1: -w / 2 + 4, x2: w / 2 - 4, y1: -h / 2 + j * h / 8, y2: -h / 2 + j * h / 8, stroke: C.line, 'stroke-width': 1.5 }, grid);
    E('line', { x1: -w / 2 + 10, x2: w / 2 - 10, y1: 0, y2: 0, stroke: '#3E8A66', 'stroke-width': 2.5, 'stroke-dasharray': '9 8' }, g);
    const halo = sineWave(g, { w: w - 24, amp, wl, color: C.good, width: 12 }); halo.firstChild.setAttribute('opacity', 0.16); tr(halo, -w / 2 + 12, 0);
    const line = sineWave(g, { w: w - 24, amp, wl, color: C.good, width: 4 }); tr(line, -w / 2 + 12, 0);
    g.trace = { set: v => { halo.set(v); line.set(v); } };
    return g;
  }
  /* chapter 3's bell-jar apparatus with no air inside, scaled s; origin = middle of the base: a glass jar with a
     bung, the electric bell (coils, gong and hammer) hanging on its wires from a battery box, the base plate.
     g.strike(hit 0..1) swings the hammer onto the gong */
  function bellJar(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    const yA = f1(-240 - 138 * Math.sqrt(1 - (16 / 170) * (16 / 170)));
    const jarD = `M-170,0 L-170,-240 A170,138 0 0 1 -16,${yA} L-16,-396 L16,-396 L16,${yA} A170,138 0 0 1 170,-240 L170,0`;
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
    const id = 'recap-hg' + (++gid), lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    stops.forEach(([o, a]) => E('stop', { offset: o, 'stop-color': color, 'stop-opacity': a }, lg));
    return `url(#${id})`;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2x2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CH = 255;
  function hookCard(x, y) { const g = G(hooks); tr(g, x, y); g.box = card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }
  // 1. Fast Pitch, Big Bang
  const h1 = hookCard(50, 115);
  const fastSegs = initials('Fast Pitch, Big Bang', C.ink);
  rich(h1, 30, 66, fastSegs, { size: fit(fastSegs, 34, 460), weight: 700 });
  const r1a = G(h1), r1b = G(h1);
  rich(r1a, 30, 146, [['frequency', CF, 800], [' → ', C.muted], ['pitch', C.ink, 700]], { size: 28 });
  const tr1a = trace(r1a, 330, 136, 160, 13, 160 / 6);
  rich(r1b, 30, 214, [['amplitude', CA, 800], [' → ', C.muted], ['loudness', C.ink, 700]], { size: 28 });
  const tr1b = trace(r1b, 330, 204, 160, 27, 80);
  // 2. No air, no aware
  const h2 = hookCard(630, 115);
  rich(h2, 30, 66, [['No ', C.ink], ['air', Y, 800], [', no ', C.ink], ['aware', Y, 800]], { size: 34, weight: 700 });
  const r2 = G(h2);
  rich(r2, 30, 150, [['no medium', Y, 800], [' → ', C.muted], ['no sound', C.ink, 700]], { size: 28 });
  T(r2, 30, 200, 'a vacuum has no particles', { size: 25, weight: 500, fill: C.muted, font: FB });
  const jar = bellJar(h2, 0.3); tr(jar, 404, 214);
  const noArc = G(h2); tr(noArc, 476, 160);
  E('path', { d: 'M-6,-16 Q6,0 -6,16 M4,-24 Q22,0 4,24', fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }, noArc);
  tr(cross(noArc, 12), 2, 0);
  // 3. Solids Speed, Gases Go slow: chapter 4's race lanes (air, water, steel), speeds to scale 340 : 1,500 : 5,000
  const h3 = hookCard(50, 395);
  const solSegs = initials('Solids Speed, Gases Go slow', C.ink);
  rich(h3, 30, 66, solSegs, { size: fit(solSegs, 34, 460), weight: 700 });
  const LANE0 = 130, LANEW = 328;
  E('line', { x1: LANE0, y1: 96, x2: LANE0, y2: 228, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, h3);
  for (let q = 0; q < 16; q++) E('rect', { x: LANE0 + LANEW + (q % 2) * 5, y: 100 + q * 7.75, width: 5, height: 7.75, fill: q % 2 ? '#F2F7FA' : '#1B2B36' }, h3);
  E('rect', { x: LANE0 + LANEW, y: 100, width: 10, height: 124, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 1.5 }, h3);
  const lanes3 = [['gas', 340, C.air], ['liquid', 1500, C.water], ['solid', 5000, '#C9D3DB']].map(([nm, v, col], i) => {
    const y = 118 + i * 44;
    T(h3, 30, y + 9, nm, { size: 27, weight: 700, fill: col });
    return { lane: raceLane(h3, i, LANE0, y, LANEW, 0.52, 'recapLane' + i), L: LANEW * v / 5000, y };
  });
  const win3 = tick(h3, 11); tr(win3, LANE0 + LANEW + 30, lanes3[2].y);
  // 4. 20 to 20k: the hearing band on the lesson's frequency line (chapters 7, 8 and 11), drawn at DEC px per x10
  //    instead of 186 with the same proportions: zones, fading ends, a tick for each x10 from 2 Hz to 200,000 Hz
  const h4 = hookCard(630, 395);
  rich(h4, 30, 66, [['20', Y, 800], [' to ', C.ink], ['20k', Y, 800]], { size: 34, weight: 700 });
  T(h4, 196, 66, 'hearing range, in Hz', { size: 26, weight: 600, fill: C.muted });
  const DEC = 78, FK = DEC / 186, FY = 160, FH = 28 * FK, FFADE = 60 * FK, FXL = 32, FT = FY - FH / 2;
  const fx = hz => FXL + FFADE + DEC * Math.log10(hz / 2);
  const wT = fx(200000) + FFADE - FXL, wI = fx(20) - FXL, wU = fx(200000) + FFADE - fx(20000);
  E('rect', { x: FXL, y: FT, width: wT, height: FH, fill: hgrad('#24485A', [[0, 0], [FFADE / wT, 1], [1 - FFADE / wT, 1], [1, 0]]) }, h4);
  const zInfra = E('rect', { x: FXL, y: FT, width: wI, height: FH, fill: hgrad(C.heat, [[0, 0], [FFADE / wI, 1], [1, 1]]) }, h4);
  const zUltra = E('rect', { x: fx(20000), y: FT, width: wU, height: FH, fill: hgrad(C.ethanol, [[0, 1], [1 - FFADE / wU, 1], [1, 0]]) }, h4);
  const zHear = E('rect', { x: fx(20), y: FT, width: 0, height: FH, fill: C.good }, h4);
  [2, 200, 2000, 200000].forEach(hz => E('line', { x1: fx(hz), x2: fx(hz), y1: FT + FH + 2, y2: FT + FH + 9, stroke: C.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, h4));
  const ends4 = G(h4);
  [[20, '20 Hz'], [20000, '20 kHz']].forEach(([hz, s]) => { E('line', { x1: fx(hz), x2: fx(hz), y1: FT + FH + 2, y2: FT + FH + 9, stroke: C.good, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, ends4); T(ends4, fx(hz), FY + 42, s, { size: 26, weight: 700, fill: C.good, anchor: 'middle' }); });
  const ear4 = G(h4); tr(ear4, (fx(20) + fx(20000)) / 2, 118, 0.44);
  E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ear4);
  E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 7, 'stroke-linecap': 'round' }, ear4);
  E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, ear4);
  const hookCards = [[h1, 'fast'], [h2, 'aware'], [h3, 'solids'], [h4, 'twenty']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['vacuum', 'pitch, loudness', 'particles', 'speed of light', 'there and back'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: 25, weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const wt = T(g, 458, 313, wrong, { size: 32, weight: 600, fill: C.muted });
    const sw = textWidth(wrong, 32, FD, 600);
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g); tr(ill, 760, 540);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    trapGroup('Sound travels through space', [['No particles', Y, 800], [', no sound', C.ink]], g => {
      // the silent star: a burst of light, and a sound meter that stays at zero
      const star = G(g); tr(star, -150, -8);
      E('circle', { r: 64, fill: glow(C.heat) }, star);
      const shell = E('circle', { r: 30, fill: 'none', stroke: C.heat, 'stroke-width': 5 }, star);
      let d = ''; for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? 10 : (i % 4 ? 20 : 30); d += (i ? 'L' : 'M') + f1(Math.cos(a) * rr) + ',' + f1(Math.sin(a) * rr); }
      E('path', { d: d + 'Z', fill: C.energy, stroke: C.energyLt, 'stroke-width': 2 }, star);
      const m = meter(g, { w: 200, h: 24, color: C.air, label: 'sound' }); tr(m, 30, -14);
      T(g, 248, 6, '0', { size: 30, weight: 700, fill: C.ink });
      T(g, 0, 74, 'space is a vacuum: total silence', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      return t => { const u = ((t * calm) / 1.8) % 1; attr(shell, 'r', 30 + 40 * u); op(shell, 1 - u); m.set(0); };
    }),
    trapGroup('Pitch = amplitude', [['pitch', Y, 800], [' → ', C.ink], ['frequency', CF, 800], [',  ', C.ink], ['loudness', Y, 800], [' → ', C.ink], ['amplitude', CA, 800]], g => {
      const a = scope(g, 230, 96, 22, 206 / 6); tr(a, -150, -10);
      const b = scope(g, 230, 96, 38, 206 / 2.5); tr(b, 150, -10);
      T(g, -150, 70, 'higher pitch: more waves', { size: 24, weight: 600, fill: C.muted, anchor: 'middle', font: FB });
      T(g, 150, 70, 'louder: taller waves', { size: 24, weight: 600, fill: C.muted, anchor: 'middle', font: FB });
      return t => { a.trace.set({ phase: t * 1.2 * calm }); b.trace.set({ phase: t * 0.5 * calm }); };
    }),
    trapGroup('Particles travel with the wave', [['Particles ', C.ink], ['vibrate', Y, 800], ['; the ', C.ink], ['energy', Y, 800], [' travels', C.ink]], g => {
      const ps = [];
      const en = E('ellipse', { cx: 0, cy: -14, rx: 40, ry: 34, fill: glow(C.energy) }, g);
      for (let i = 0; i < 13; i++) { const x0 = -204 + i * 34; ps.push({ x0, el: E('circle', { cx: x0, cy: -14, r: 9, fill: i === 6 ? ball(C.energy, '#C9A800') : ball(C.air, '#4E8FB8') }, g) }); }
      E('path', { d: 'M0,4 L0,14', stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      const ea = arrow(g, -120, -52, 120, -52, { color: C.energy, width: 4, head: 12 });
      T(g, 136, -44, 'energy', { size: 24, weight: 700, fill: C.energy });
      T(g, 0, 50, 'each particle stays where it is', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      return t => {
        const c = t * 0.8 * calm;
        ps.forEach(p => attr(p.el, 'cx', p.x0 + 8 * Math.sin(TAU * ((p.x0 + 204) / 170 - c))));
        attr(en, 'cx', -204 + ((c * 170) % 442)); ea.set(1);
      };
    }),
    trapGroup('Sound ≈ the speed of light', [['sound ', C.ink], ['340 m/s', C.air, 800], ['  vs  ', C.muted], ['light ', C.ink], ['300,000,000 m/s', Y, 800]], g => {
      // chapter 4's storm in miniature: the flash reaches the observer at once, the thunder's front crawls
      const flash = E('circle', { cx: -240, cy: -24, r: 56, fill: glow(C.energy) }, g);
      E('path', { d: 'M-305,44 Q-277,-2 -240,-4 Q-203,-2 -175,44 Z', fill: '#173A29', stroke: '#2E5E40', 'stroke-width': 2.5 }, g);
      E('path', { d: 'M-330,44 Q-165,38 0,43 T330,44 L330,54 L-330,54 Z', fill: '#10271A', stroke: '#2E5E3E', 'stroke-width': 2.5 }, g);
      const drops = [];
      for (let i = 0; i < 9; i++) drops.push(E('line', { x1: -287 + i * 11, y1: -34, x2: -295 + i * 11, y2: -6, stroke: 'rgba(159,216,255,0.35)', 'stroke-width': 2, 'stroke-dasharray': '6 8', 'stroke-linecap': 'round' }, g));
      const cloud = G(g); tr(cloud, -245, -64, 0.42);
      [[-96, 22, 40], [-52, -6, 54], [8, -24, 62], [70, -6, 52], [116, 20, 38], [-128, 36, 28]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#3B4755', stroke: '#5A6878', 'stroke-width': 3 }, cloud));
      E('rect', { x: -150, y: 14, width: 290, height: 46, rx: 23, fill: '#3B4755' }, cloud);
      [[-96, 22, 36], [-52, -6, 50], [8, -24, 58], [70, -6, 48], [116, 20, 34]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y + 4, r, fill: '#3B4755' }, cloud));
      const zap = bolt(g); tr(zap, -240, -21, 0.33);
      const house = G(g); tr(house, 240, 44, 0.36);
      E('rect', { x: 60, y: -98, width: 98, height: 94, fill: '#5E4A3A', stroke: '#8C735D', 'stroke-width': 3 }, house);
      E('path', { d: 'M48,-94 L109,-148 L166,-94 Z', fill: '#8C3B32', stroke: '#B95A4C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, house);
      E('rect', { x: 74, y: -76, width: 30, height: 28, rx: 3, fill: '#FFD27A', stroke: '#8C735D', 'stroke-width': 3 }, house);
      E('rect', { x: 120, y: -56, width: 24, height: 52, rx: 3, fill: '#3A2C22' }, house);
      const obsG = G(g); tr(obsG, 240, 44, 0.36);
      person(G(obsG, { transform: 'scale(-1 1)' }), { shirt: '#E8424F', shorts: '#3A4A5C' }).pose({ armL: [6, 8], armR: [-6, 8] });
      const ray = E('path', { d: 'M-232,-14 L232,-19', stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-dasharray': '12 8' }, g);
      const front = pulseIcon(g, 27, 8);
      T(g, 0, 80, 'you see the flash before you hear the thunder', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      const t0 = mid('t4', 0.55) + 0.35;
      return t => {
        const f = P(t, t0, 0.08, linear) * (1 - P(t, t0 + 0.5, 0.6, linear));
        op(zap, 0.35 + 0.65 * f); op(flash, f); op(ray, f);
        ray.setAttribute('stroke-dashoffset', f1(-t * 80));
        drops.forEach((d, i) => d.setAttribute('stroke-dashoffset', f1(-(t * 110 * calm + i * 5))));
        const u = clamp((t - t0) / 3.2);
        tr(front, lerp(-226, 222, u), 18); op(front, u > 0 && u < 1 ? Math.min(1, u * 8, (1 - u) * 6) : 0);
      };
    }),
    trapGroup('Depth = speed × time', [['there and back', Y, 800], [': cut it in ', C.ink], ['half', Y, 800]], g => {
      // chapter 8's sonar ship and sea in miniature: the ping goes down to the sea floor and back up
      E('rect', { x: -330, y: -40, width: 660, height: 110, fill: linGrad('#0F4C6B', '#061C2B', true) }, g);
      E('line', { x1: -330, x2: 330, y1: -40, y2: -40, stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.7 }, g);
      E('path', { d: 'M-330,70 Q-220,52 -110,66 Q0,80 110,62 Q220,48 330,68 L330,80 L-330,80 Z', fill: linGrad('#6B5A3F', '#2E2619', true), stroke: '#A08B64', 'stroke-width': 2.5 }, g);
      const ship = G(g); tr(ship, -150, -40, 0.36);
      E('path', { d: 'M-122,-14 L124,-14 L102,30 L-100,30 Z', fill: ball('#D0533E', '#8E2A1E'), stroke: '#F3A08F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, ship);
      E('rect', { x: -122, y: -18, width: 246, height: 8, fill: '#F2F7FA' }, ship);
      E('rect', { x: -70, y: -56, width: 96, height: 40, rx: 5, fill: '#EEF3F6', stroke: '#9DB0BF', 'stroke-width': 2 }, ship);
      for (let k = 0; k < 4; k++) E('rect', { x: -60 + k * 22, y: -48, width: 14, height: 12, rx: 2, fill: '#4CC9F0' }, ship);
      E('rect', { x: 44, y: -78, width: 24, height: 62, rx: 4, fill: '#F2C14E', stroke: '#B57B12', 'stroke-width': 2 }, ship);
      E('rect', { x: 44, y: -78, width: 24, height: 12, fill: '#2B2B2B' }, ship);
      E('rect', { x: -10, y: 30, width: 20, height: 7, rx: 3, fill: C.ethanol }, ship);
      const ping = E('path', { fill: 'none', stroke: C.ethanol, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      arrow(g, 10, -28, 10, 54, { color: C.ethanol, width: 4, head: 12 });
      arrow(g, 44, 54, 44, -28, { color: '#E4D6FF', width: 4, head: 12 });
      T(g, -6, 22, 'there', { size: 24, weight: 700, fill: C.ethanol, anchor: 'end' });
      T(g, 60, 22, 'back', { size: 24, weight: 700, fill: '#E4D6FF' });
      const half = chip(g, '÷ 2 = depth', { size: 28, fill: C.card2, stroke: C.ethanol, color: C.ink, sw: 2.5 }); tr(half, 230, 12);
      return t => {
        const u = ((t * calm) / 2.2) % 1, down = u < 0.5, y = down ? lerp(-30, 56, u * 2) : lerp(56, -30, (u - 0.5) * 2);
        const sgn = down ? 1 : -1; let d = '';
        for (let j = 0; j < 3; j++) { const yy = y - sgn * j * 8; d += `M-170,${f1(yy - sgn * 6)} Q-150,${f1(yy + sgn * 6)} -130,${f1(yy - sgn * 6)} `; }
        ping.setAttribute('d', d);
      };
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    t = Math.min(t, S.D);                       // hold the final frame beyond the chapter's end
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('fast') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('fast') - 0.3, 0.5));
    }

    // memory hooks build up, flash once as the grid completes, then shrink away for the traps
    const hookOut = P(t, at('traps') - 0.2, 0.55);
    op(hooks, 1 - hookOut);
    if (hookOut < 1) {
      const k = 1 - 0.18 * hookOut;
      hooks.setAttribute('transform', `translate(600 395) scale(${k.toFixed(3)}) translate(-600 -395)`);
      const flash = Math.sin(Math.PI * P(t, mid('twenty', 0.72), 0.9, linear));
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        const x = i % 2 ? 630 : 50, y = i < 2 ? 115 : 395;
        tr(g, x, y + (1 - clamp(p)) * 26);
        g.box.setAttribute('stroke', flash > 0.05 ? C.energy : C.line);
        g.box.setAttribute('stroke-width', (2 + 2 * flash).toFixed(2));
      });
      // 1: two traces
      op(r1a, P(t, mid('fast', 0.36), 0.5, linear)); op(r1b, P(t, mid('fast', 0.68), 0.5, linear));
      tr1a.set({ phase: t * 1.1 * calm }); tr1b.set({ phase: t * 0.45 * calm });
      // 2: the hammer keeps striking, but no sound gets out
      op(r2, P(t, mid('aware', 0.45), 0.5, linear));
      const hit = Math.pow(wave(t * calm, 0.7), 6);
      jar.strike(hit);
      op(noArc, P(t, mid('aware', 0.5), 0.4, linear));
      // 3: the three pulses race, to scale; steel wins
      const rp3 = P(t, mid('solids', 0.12), 1.4, linear);
      lanes3.forEach(l => { l.lane.set(l.L * rp3); op(l.lane.pulse, rp3 > 0 ? 1 : 0.45); });
      const w3 = P(t, mid('solids', 0.12) + 1.45, 0.4, pop); op(win3, clamp(w3 * 2)); tr(win3, LANE0 + LANEW + 30, lanes3[2].y, Math.max(0.01, w3));
      // 4: the green band grows from 20 Hz to 20 kHz
      const gb = P(t, mid('twenty', 0.12), 0.9);
      attr(zHear, 'width', (fx(20000) - fx(20)) * gb);
      op(zInfra, P(t, mid('twenty', 0.5), 0.5, linear)); op(zUltra, P(t, mid('twenty', 0.5), 0.5, linear));
      op(ends4, P(t, mid('twenty', 0.3), 0.5, linear));
      op(ear4, P(t, mid('twenty', 0.55), 0.5, linear));
    }

    // traps
    const ta = P(t, at('traps') - 0.1, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(head, P(t, at('traps') - 0.1, 0.5, linear));
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.15 + i * 0.12), 0.45, pop);
        const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
        op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? C.energy : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? C.energy : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
        s.tk.firstChild.setAttribute('stroke', C.bg0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, 0.3), 0.5, easeOut));
        const rp = P(t, mid(k, 0.38), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.55), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

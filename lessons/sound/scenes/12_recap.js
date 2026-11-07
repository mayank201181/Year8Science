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
  /* a dashed rest line with a kit sine trace on it, from x0, w wide */
  function trace(parent, x0, y, w, amp, wl, color) {
    E('line', { x1: x0, x2: x0 + w, y1: y, y2: y, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, parent);
    const s = sineWave(parent, { w, amp, wl, color: color || C.air, width: 4 }); tr(s, x0, y);
    return s;
  }
  /* a small oscilloscope screen (w x h, centred) with a green trace; g.trace.set({...}) */
  function scope(parent, w, h, amp, wl) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: '#06140F', stroke: '#2C5468', 'stroke-width': 3 }, g);
    for (let i = 1; i < 6; i++) E('line', { x1: -w / 2 + i * w / 6, x2: -w / 2 + i * w / 6, y1: -h / 2 + 3, y2: h / 2 - 3, stroke: C.line, 'stroke-width': 1.5, opacity: 0.4 }, g);
    for (let i = 1; i < 4; i++) E('line', { x1: -w / 2 + 3, x2: w / 2 - 3, y1: -h / 2 + i * h / 4, y2: -h / 2 + i * h / 4, stroke: C.line, 'stroke-width': 1.5, opacity: 0.4 }, g);
    g.trace = sineWave(g, { w: w - 24, amp, wl, color: C.good, width: 4 }); tr(g.trace, -w / 2 + 12, 0);
    return g;
  }
  /* a bell jar with a bell inside and nothing else: origin = middle of the base */
  function bellJar(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: 'M-46,0 L-46,-56 A46,46 0 0 1 46,-56 L46,0 Z', fill: 'rgba(200,230,250,0.10)' }, k);
    E('line', { x1: 0, y1: -100, x2: 0, y2: -70, stroke: '#C9D6DE', 'stroke-width': 3 }, k);
    const bell = G(k); tr(bell, 0, -70);
    E('path', { d: 'M-15,22 Q-15,0 0,0 Q15,0 15,22 Z', fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 2 }, bell);
    const ham = G(k); tr(ham, 0, -46);
    E('line', { x1: 0, y1: 0, x2: 22, y2: -6, stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linecap': 'round' }, ham);
    E('circle', { cx: 0, cy: 0, r: 5, fill: '#C9D6DE' }, ham);
    E('path', { d: 'M-46,0 L-46,-56 A46,46 0 0 1 46,-56 L46,0', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, k);
    E('rect', { x: -40, y: -96, width: 6, height: 50, rx: 3, fill: 'rgba(255,255,255,0.25)' }, k);
    E('rect', { x: -60, y: 0, width: 120, height: 12, rx: 4, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, k);
    g.ham = ham;
    return g;
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
  rich(r1a, 30, 146, [['frequency', Y, 800], [' → ', C.muted], ['pitch', C.ink, 700]], { size: 28 });
  const tr1a = trace(r1a, 330, 136, 160, 13, 160 / 6);
  rich(r1b, 30, 214, [['amplitude', Y, 800], [' → ', C.muted], ['loudness', C.ink, 700]], { size: 28 });
  const tr1b = trace(r1b, 330, 204, 160, 27, 80);
  // 2. No air, no aware
  const h2 = hookCard(630, 115);
  rich(h2, 30, 66, [['No ', C.ink], ['air', Y, 800], [', no ', C.ink], ['aware', Y, 800]], { size: 34, weight: 700 });
  const r2 = G(h2);
  rich(r2, 30, 150, [['no medium', Y, 800], [' → ', C.muted], ['no sound', C.ink, 700]], { size: 28 });
  T(r2, 30, 200, 'a vacuum has no particles', { size: 25, weight: 500, fill: C.muted, font: FB });
  const jar = bellJar(h2, 0.95); tr(jar, 408, 214);
  const noArc = G(h2); tr(noArc, 476, 160);
  E('path', { d: 'M-6,-16 Q6,0 -6,16 M4,-24 Q22,0 4,24', fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.6 }, noArc);
  tr(cross(noArc, 12), 2, 0);
  // 3. Solids Speed, Gases Go slow (three lanes, speeds to scale: 5,000 : 1,500 : 340)
  const h3 = hookCard(50, 395);
  const solSegs = initials('Solids Speed, Gases Go slow', C.ink);
  rich(h3, 30, 66, solSegs, { size: fit(solSegs, 34, 460), weight: 700 });
  const LANE0 = 140, LANEW = 350;
  const lanes3 = [['solid', 5000], ['liquid', 1500], ['gas', 340]].map(([nm, v], i) => {
    const g = G(h3), y = 118 + i * 44;
    T(g, 30, y + 9, nm, { size: 27, weight: 600, fill: C.ink });
    E('line', { x1: LANE0, x2: LANE0 + LANEW, y1: y, y2: y, stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const bar = E('line', { x1: LANE0, x2: LANE0, y1: y, y2: y, stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    const halo = E('circle', { cy: y, r: 20, fill: glow(C.air) }, g);
    const dot = E('circle', { cy: y, r: 8, fill: ball(C.air, '#4E8FB8') }, g);
    return { g, bar, halo, dot, L: LANEW * v / 5000 };
  });
  // 4. 20 to 20k: the hearing band on a log frequency line (2 Hz to 200 kHz, equal steps for x10)
  const h4 = hookCard(630, 395);
  rich(h4, 30, 66, [['20', Y, 800], [' to ', C.ink], ['20k', Y, 800]], { size: 34, weight: 700 });
  T(h4, 196, 66, 'hearing range, in Hz', { size: 26, weight: 600, fill: C.muted });
  const FX0 = 40, DEC = 88, FY = 160;
  const fx = hz => FX0 + DEC * Math.log10(hz / 2);
  E('rect', { x: FX0, y: FY - 11, width: 5 * DEC, height: 22, rx: 11, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, h4);
  const zInfra = E('rect', { x: FX0, y: FY - 11, width: DEC, height: 22, rx: 11, fill: C.heat, opacity: 0.85 }, h4);
  const zUltra = E('rect', { x: fx(20000), y: FY - 11, width: DEC, height: 22, rx: 11, fill: C.ethanol, opacity: 0.85 }, h4);
  const zHear = E('rect', { x: fx(20), y: FY - 13, width: 0, height: 26, rx: 6, fill: C.good }, h4);
  const ends4 = G(h4);
  [[20, '20 Hz'], [20000, '20 kHz']].forEach(([hz, s]) => { E('line', { x1: fx(hz), x2: fx(hz), y1: FY + 16, y2: FY + 26, stroke: C.good, 'stroke-width': 3 }, ends4); T(ends4, fx(hz), FY + 54, s, { size: 26, weight: 700, fill: C.good, anchor: 'middle' }); });
  const ear4 = G(h4); tr(ear4, (fx(20) + fx(20000)) / 2, 116, 0.44);
  E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ear4);
  E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 7, 'stroke-linecap': 'round' }, ear4);
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
    trapGroup('Pitch = amplitude', [['pitch', Y, 800], [' → frequency,  ', C.ink], ['loudness', Y, 800], [' → amplitude', C.ink]], g => {
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
      // a storm: the flash arrives at once, the thunder crawls
      E('path', { d: 'M-330,44 Q-246,-8 -150,44 Z', fill: '#2C4A3A', stroke: '#4E7A5E', 'stroke-width': 2 }, g);
      E('line', { x1: -330, x2: 330, y1: 44, y2: 44, stroke: '#4E7A5E', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      const cloud = G(g); tr(cloud, -240, -50);
      E('path', { d: 'M-48,16 C-70,16 -70,-12 -48,-14 C-50,-38 -18,-46 -6,-28 C4,-48 40,-44 40,-18 C64,-18 64,16 40,16 Z', fill: '#5E6F7E', stroke: '#9DB0BF', 'stroke-width': 3 }, cloud);
      const zap = bolt(cloud, 0.42); tr(zap, -4, 40, 0.42);
      const who = person(g, { shirt: '#5B8DEF' }); tr(who, 262, 44, 0.36);
      const ray = E('line', { x1: -232, y1: -6, x2: 250, y2: -18, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      const arcs = [0, 1, 2].map(() => E('path', { fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round' }, g));
      T(g, 0, 80, 'you see the flash before you hear the thunder', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      const t0 = mid('t4', 0.55) + 0.35;
      return t => {
        const f = P(t, t0, 0.08, linear) * (1 - P(t, t0 + 0.5, 0.6, linear));
        op(zap, 0.35 + 0.65 * f); op(ray, f);
        arcs.forEach((el, k) => {
          const u = clamp((t - t0 - k * 0.25) / 3.2), x = -196 + 420 * u;
          el.setAttribute('d', `M${f1(x - 6)},-20 Q${f1(x + 12)},10 ${f1(x - 6)},40`);
          op(el, u > 0 && u < 1 ? Math.min(1, u * 8, (1 - u) * 6) : 0);
        });
      };
    }),
    trapGroup('Depth = speed × time', [['there and back', Y, 800], [': cut it in ', C.ink], ['half', Y, 800]], g => {
      // sonar: the ping goes down to the sea floor and back up
      E('rect', { x: -330, y: -40, width: 660, height: 110, fill: 'rgba(76,201,240,0.10)' }, g);
      E('line', { x1: -330, x2: 330, y1: -40, y2: -40, stroke: C.water, 'stroke-width': 3 }, g);
      E('path', { d: 'M-330,70 Q-220,52 -110,66 Q0,80 110,62 Q220,48 330,68 L330,80 L-330,80 Z', fill: '#6B4A33' }, g);
      const ship = G(g); tr(ship, -150, -40);
      E('path', { d: 'M-46,-16 L46,-16 L32,6 L-34,6 Z', fill: '#C9D6DE', stroke: '#F4F7FA', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ship);
      E('rect', { x: -14, y: -34, width: 30, height: 18, rx: 3, fill: '#8FA3B3' }, ship);
      const ping = E('path', { fill: 'none', stroke: C.ethanol, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      arrow(g, 10, -28, 10, 54, { color: C.ethanol, width: 4, head: 12 });
      arrow(g, 44, 54, 44, -28, { color: C.ethanol, width: 4, head: 12 });
      T(g, -6, 22, 'there', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
      T(g, 60, 22, 'back', { size: 24, weight: 600, fill: C.muted });
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
      jar.ham.setAttribute('transform', `translate(0 -46) rotate(${(-28 + 22 * hit).toFixed(1)})`);
      op(noArc, P(t, mid('aware', 0.5), 0.4, linear));
      // 3: the three pulses race, to scale
      const rp3 = P(t, mid('solids', 0.12), 1.4, linear);
      lanes3.forEach(l => { const x = LANE0 + l.L * rp3; attr(l.bar, 'x2', x); attr(l.halo, 'cx', x); attr(l.dot, 'cx', x); op(l.halo, rp3 > 0 ? 1 : 0.4); });
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

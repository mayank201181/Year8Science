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
  // 1. an empty bell jar: the hammer strikes, but there are no particles to carry the sound
  function picJar(g) {
    const k = G(g); tr(k, 0, 64, 1.25);
    E('path', { d: 'M-46,0 L-46,-56 A46,46 0 0 1 46,-56 L46,0 Z', fill: 'rgba(200,230,250,0.10)' }, k);
    E('line', { x1: 0, y1: -100, x2: 0, y2: -70, stroke: '#C9D6DE', 'stroke-width': 3 }, k);
    const bell = G(k); tr(bell, 0, -70);
    E('path', { d: 'M-15,22 Q-15,0 0,0 Q15,0 15,22 Z', fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 2 }, bell);
    const ham = G(k);
    E('line', { x1: 0, y1: 0, x2: 22, y2: -6, stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linecap': 'round' }, ham);
    E('circle', { cx: 0, cy: 0, r: 5, fill: '#C9D6DE' }, ham);
    E('path', { d: 'M-46,0 L-46,-56 A46,46 0 0 1 46,-56 L46,0', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('rect', { x: -40, y: -96, width: 6, height: 50, rx: 3, fill: 'rgba(255,255,255,0.25)' }, k);
    E('rect', { x: -60, y: 0, width: 120, height: 12, rx: 4, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, k);
    E('path', { d: 'M60,6 L92,6 L92,-20', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k);
    const ghosts = G(g);
    [[-30, -14], [24, -22], [-8, 22], [30, 30], [-34, 40]].forEach(([x, y]) => E('circle', { cx: x, cy: y + 10, r: 9, fill: 'none', stroke: C.air, 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0.45 }, ghosts));
    const lab = chip(g, 'no particles', { size: 26, fill: C.card2, stroke: C.line, sw: 2 }); tr(lab, 0, 118);
    return t => {
      const hit = Math.pow(wave(t * calm, 0.7), 6);
      ham.setAttribute('transform', `translate(0 -46) rotate(${(-28 + 22 * hit).toFixed(1)})`);
      op(ghosts, 0.5 + 0.5 * wave(t, 1.8));
    };
  }
  // 2. louder at the same pitch: the trace grows taller, its peaks keep their places
  function picTrace(g) {
    const w = 270, h = 150;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 14, fill: '#06140F', stroke: '#2C5468', 'stroke-width': 3 }, g);
    for (let i = 1; i < 6; i++) E('line', { x1: -w / 2 + i * w / 6, x2: -w / 2 + i * w / 6, y1: -h / 2 + 3, y2: h / 2 - 3, stroke: C.line, 'stroke-width': 1.5, opacity: 0.4 }, g);
    for (let i = 1; i < 4; i++) E('line', { x1: -w / 2 + 3, x2: w / 2 - 3, y1: -h / 2 + i * h / 4, y2: -h / 2 + i * h / 4, stroke: C.line, 'stroke-width': 1.5, opacity: 0.4 }, g);
    const WL = 82, X0 = -123;
    const ghost = sineWave(g, { w: 246, amp: 16, wl: WL, color: C.good, width: 3 }); tr(ghost, X0, 0); ghost.setAttribute('opacity', 0.35);
    const tr_ = sineWave(g, { w: 246, amp: 16, wl: WL, color: C.good, width: 4.5 }); tr(tr_, X0, 0);
    const peaks = [0, 1, 2].map(k => E('circle', { cx: X0 + WL * (k + 0.25), r: 6, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 1.5 }, g));
    T(g, 0, h / 2 + 40, 'taller, same spacing', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    return t => {
      const a = lerp(16, 50, P(t, at('a2') + 0.3, 1.4));
      tr_.set({ amp: a, phase: 0 });
      peaks.forEach(p => attr(p, 'cy', -a));
    };
  }
  // 3. the race: speeds to scale (steel 5,000 : water 1,500 : air 340 m/s)
  function picRace(g) {
    const L0 = -70, L = 200, lanes = [['air', 340], ['water', 1500], ['steel', 5000]].map(([nm, v], i) => {
      const y = -60 + i * 58, lg = G(g);
      T(lg, L0 - 16, y + 9, nm, { size: 27, weight: 600, fill: nm === 'steel' ? Y : C.ink, anchor: 'end' });
      E('line', { x1: L0, x2: L0 + L, y1: y, y2: y, stroke: C.line, 'stroke-width': 6, 'stroke-linecap': 'round' }, lg);
      const bar = E('line', { x1: L0, x2: L0, y1: y, y2: y, stroke: C.air, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.55 }, lg);
      const dot = E('circle', { cy: y, r: 9, fill: ball(C.air, '#4E8FB8') }, lg);
      return { y, bar, dot, d: L * v / 5000 };
    });
    E('line', { x1: L0 + L + 12, x2: L0 + L + 12, y1: -84, y2: 80, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '6 6', opacity: 0.7 }, g);
    const win_ = tick(g, 14); tr(win_, L0 + L + 40, lanes[2].y);
    T(g, 0, 118, 'fastest in solids', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    return t => {
      const p = P(t, at('a3') + 0.2, 1.3, linear);
      lanes.forEach(l => { const x = L0 + l.d * p; attr(l.bar, 'x2', x); attr(l.dot, 'cx', x); });
      const w = P(t, at('a3') + 1.5, 0.45, pop); op(win_, clamp(w * 2)); tr(win_, L0 + L + 40, lanes[2].y, Math.max(0.01, w));
    };
  }
  // 4. the frequency line (log scale, equal steps for x10): the ultrasound zone lights up
  function picLine(g) {
    const X0 = -220, DEC = 56, y = 10;
    const fx = hz => X0 + DEC * Math.log10(hz / 2);
    E('rect', { x: X0, y: y - 12, width: 5 * DEC, height: 24, rx: 12, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, g);
    E('rect', { x: X0, y: y - 12, width: DEC, height: 24, rx: 12, fill: C.heat, opacity: 0.55 }, g);
    E('rect', { x: fx(20), y: y - 12, width: fx(20000) - fx(20), height: 24, rx: 6, fill: C.good, opacity: 0.55 }, g);
    const halo = E('ellipse', { cx: fx(20000) + DEC / 2, cy: y, rx: 70, ry: 44, fill: glow(C.ethanol) }, g);
    E('rect', { x: fx(20000), y: y - 14, width: DEC, height: 28, rx: 12, fill: C.ethanol, stroke: '#D8C4FF', 'stroke-width': 2 }, g);
    E('line', { x1: fx(20000), x2: fx(20000), y1: y - 26, y2: y + 26, stroke: C.ink, 'stroke-width': 3 }, g);
    T(g, fx(20000), y + 58, '20,000 Hz', { size: 26, weight: 700, fill: C.ink, anchor: 'middle' });
    T(g, fx(20000) + DEC / 2, y - 40, 'ultrasound', { size: 27, weight: 700, fill: C.ethanol, anchor: 'middle' });
    const ear = G(g); tr(ear, (fx(20) + fx(20000)) / 2, y - 58, 0.42);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ear);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 7, 'stroke-linecap': 'round' }, ear);
    return t => { op(halo, 0.55 + 0.45 * wave(t, 1.4)); };
  }
  // 5. lightning over a hill 1 km away
  function picStorm(g) {
    E('path', { d: 'M-190,70 Q-120,-6 -50,70 Z', fill: '#2C4A3A', stroke: '#4E7A5E', 'stroke-width': 2 }, g);
    E('line', { x1: -200, x2: 190, y1: 70, y2: 70, stroke: '#4E7A5E', 'stroke-width': 3 }, g);
    const cloud = G(g); tr(cloud, -120, -70);
    E('path', { d: 'M-56,18 C-82,18 -82,-14 -56,-16 C-58,-44 -20,-54 -6,-32 C6,-56 48,-50 48,-20 C76,-20 76,18 48,18 Z', fill: '#5E6F7E', stroke: '#9DB0BF', 'stroke-width': 3 }, cloud);
    const zap = bolt(cloud, 0.5); tr(zap, -6, 46, 0.5);
    const flash = E('circle', { cx: -120, cy: -30, r: 120, fill: glow(C.energy) }, g);
    const house = G(g); tr(house, 140, 70);
    E('path', { d: 'M-26,0 L-26,-34 L0,-56 L26,-34 L26,0 Z', fill: '#C98E62', stroke: '#F2C29C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, house);
    E('rect', { x: -8, y: -22, width: 16, height: 22, fill: '#3A2A1E' }, house);
    const dimG = G(g);
    E('line', { x1: -116, x2: 136, y1: 104, y2: 104, stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, dimG);
    E('path', { d: 'M-118,104 l12,-8 l0,16 Z M138,104 l-12,-8 l0,16 Z', fill: Y }, dimG);
    E('path', { d: 'M-120,92 L-120,116 M140,92 L140,116', stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, dimG);
    const km = chip(g, '1 km', { size: 28, fill: C.bg0, stroke: Y, color: Y, sw: 2.5 }); tr(km, 10, 104);
    return t => {
      const t0 = at('a5') + 0.1, u = ((t - t0) * calm) % 2.6;
      const f = t < t0 ? 0 : Math.max(0, 1 - u / 0.35) * (u < 0.35 ? 1 : 0);
      op(flash, f * 0.9); op(zap, 0.45 + 0.55 * (u < 0.5 && t >= t0 ? 1 : 0));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'Why can’t sound travel\nthrough a vacuum?', a: [[['A vacuum has ', C.ink], ['no particles', Y, 800]], [['to pass the vibration along.', C.ink]]], pic: picJar },
    { q: 'A sound gets louder, but its pitch\nstays the same. What has changed?', a: [[['Its ', C.ink], ['amplitude', Y, 800], [' is bigger.', C.ink]], [['Its frequency is the same.', C.ink]]], pic: picTrace },
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

/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the
   silent thinking time, then the answer appears with a small picture and a progress dot fills.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

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

  /* ---------- pictures for the answers ---------- */
  function picMito(g) { const m = mitochondrion(g, 190, 84, { glow: true }); tr(m, 0, 0, 1, -12); return t => m.upd(t); }
  function picEthanol(g) {
    const d = G(g); tr(d, -62, -14);
    E('path', { d: 'M0,-46 C20,-18 30,0 30,16 A30,30 0 0 1 -30,16 C-30,0 -20,-18 0,-46 Z', fill: ball(C.ethanol, C.ethanolDk), stroke: '#D8C4FF', 'stroke-width': 3 }, d);
    T(g, -62, 70, 'ethanol', { size: 25, weight: 700, fill: C.ethanol, anchor: 'middle' });
    const m = molCO2(g, 16); tr(m, 70, -6);
    T(g, 70, 70, 'CO₂', { size: 25, weight: 700, fill: C.co2, anchor: 'middle' });
    const bs = bubbles(g, 40, -90, 60, 70, { n: 5, r: 6, seed: 8, speed: 0.6 });
    return t => { bs.upd(t * calm); tr(m, 70, -6 + Math.sin(t * 2 * calm) * 4, 1, Math.sin(t * calm) * 10); };
  }
  function picLime(g) {
    const w = 72, h = 200, r = w / 2, q = r - 5, top = 70;
    const tg = G(g); tr(tg, 0, -100);
    E('path', { d: `M${-r},0 L${-r},${h - r} A${r},${r} 0 0 0 ${r},${h - r} L${r},0 Z`, fill: 'rgba(200,230,245,0.06)' }, tg);
    const liq = `M${-q},${top} L${-q},${h - r} A${q},${q} 0 0 0 ${q},${h - r} L${q},${top} Z`;
    E('path', { d: liq, fill: 'rgba(140,205,240,0.32)' }, tg);
    const milk = E('path', { d: liq, fill: '#EEF3F6' }, tg);
    E('path', { d: `M${-r},0 L${-r},${h - r} A${r},${r} 0 0 0 ${r},${h - r} L${r},0`, fill: 'none', stroke: '#BFD9E6', 'stroke-width': 4 }, tg);
    E('line', { x1: -r - 7, y1: 0, x2: r + 7, y2: 0, stroke: '#BFD9E6', 'stroke-width': 5, 'stroke-linecap': 'round' }, tg);
    const bs = bubbles(tg, -14, top + 8, 28, h - top - 30, { n: 6, r: 5, seed: 9, speed: 0.55 });
    return t => { bs.upd(t * calm); op(milk, 0.9 * P(t, at('a3') + 0.2, 1.3, ease)); };
  }
  function picRunner(g) {
    // tired runner, hands on knees, breathing hard: oxygen streams in to repay the debt
    const fig = G(g); tr(fig, -30, 0);
    const st = { stroke: '#F2E3D3', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' };
    E('path', Object.assign({ d: 'M-18,22 L4,54 L10,98 M-18,22 L-30,56 L-40,98' }, st), fig);       // legs, knees bent
    const torso = G(fig);
    E('path', Object.assign({ d: 'M-18,22 L22,-24' }, st, { 'stroke-width': 16 }), torso);            // back, leaning forward
    E('path', Object.assign({ d: 'M18,-18 L8,48 M14,-20 L-24,50' }, st, { 'stroke-width': 10 }), torso); // arms down to the knees
    E('circle', { cx: 40, cy: -44, r: 21, fill: ball('#F7C8A0', '#C98B5E') }, torso);
    E('ellipse', { cx: 58, cy: -38, rx: 5, ry: 6, fill: '#5A2A22' }, torso);                           // open mouth
    const sweat = E('path', { d: 'M28,-70 C31,-64 33,-61 33,-59 A5,5 0 0 1 23,-59 C23,-61 25,-64 28,-70 Z', fill: '#8FD8F7' }, torso);
    const o2 = [0, 1, 2, 3].map(() => molO2(g, 10));
    return t => {
      const b = wave(t, 0.8);
      tr(torso, 0, 3 * b * calm, 1, -2 * b * calm);
      op(sweat, 0.4 + 0.6 * wave(t, 1.6));
      o2.forEach((m, k) => { const u = ((t / 1.5) + k / 4) % 1; tr(m, lerp(112, 38, u), lerp(-66, -40, u), 1, u * 120); op(m, Math.min(1, u * 5, (1 - u) * 4)); });
    };
  }
  function picPlant(g) {
    const sun = G(g); tr(sun, -92, -64);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; E('line', { x1: Math.cos(a) * 30, y1: Math.sin(a) * 30, x2: Math.cos(a) * 41, y2: Math.sin(a) * 41, stroke: Y, 'stroke-width': 5, 'stroke-linecap': 'round' }, sun); }
    E('circle', { r: 22, fill: ball(Y, '#E0A800') }, sun);
    const moon = G(g); tr(moon, 92, -64);
    E('path', { d: 'M14.23,-21.76 A26,26 0 1 0 14.23,21.76 A22,22 0 1 1 14.23,-21.76 Z', fill: '#E4ECF5' }, moon);
    const plant = G(g); tr(plant, 0, 30);
    E('path', { d: 'M-30,24 L30,24 L23,62 L-23,62 Z', fill: '#B5653A', stroke: '#7F4022', 'stroke-width': 3 }, plant);
    E('path', { d: 'M0,24 C0,2 -2,-22 0,-52', stroke: C.stem, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, plant);
    E('path', { d: 'M0,-10 C-28,-14 -42,-32 -46,-48 C-24,-46 -6,-32 0,-10 Z M0,-28 C26,-34 38,-52 40,-66 C20,-62 4,-48 0,-28 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, plant);
    const sp1 = spark(plant, 9, { seed: 3 }); tr(sp1, -22, -30);
    const sp2 = spark(plant, 9, { seed: 5 }); tr(sp2, 20, -46);
    const stamp = G(g); tr(stamp, 0, 0, 1, -12);
    E('rect', { x: -96, y: -34, width: 192, height: 68, rx: 10, fill: 'rgba(10,27,39,0.35)', stroke: C.bad, 'stroke-width': 6 }, stamp);
    T(stamp, 0, 17, 'FALSE', { size: 46, weight: 700, fill: C.bad, anchor: 'middle', ls: 3 });
    return t => { sp1.upd(t); sp2.upd(t + 0.4); const sp = P(t, at('a5') - 0.05, 0.45, pop); op(stamp, clamp(sp * 2)); tr(stamp, 0, 0, 1.5 - 0.5 * clamp(sp), -12); };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'Where in the cell does aerobic\nrespiration happen?', a: [[['In the ', C.ink], ['mitochondria', Y, 800], ['.', C.ink]]], pic: picMito },
    { q: 'What does yeast make when it\nrespires without oxygen?', a: [[['Ethanol', C.ethanol, 800], [' and', C.ink]], [['carbon dioxide', C.co2, 800], ['.', C.ink]]], pic: picEthanol },
    { q: 'What happens to limewater when\ncarbon dioxide bubbles through it?', a: [[['It turns from clear', C.ink]], [['to ', C.ink], ['milky', Y, 800], ['.', C.ink]]], pic: picLime },
    { q: 'Why do you keep panting\nafter a sprint?', a: [[['To take in extra oxygen', C.ink]], [['and repay the ', C.ink], ['oxygen debt', Y, 800], [',', C.ink]], [['breaking down lactic acid.', C.ink]]], pic: picRunner, small: true },
    { q: 'True or false: plants only\nrespire at night.', a: [[['False.', C.bad, 800], [' Plants respire', C.ink]], [['all the time', Y, 800], [', day and night.', C.ink]]], pic: picPlant },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 250, d.q, { size: 42, weight: 700, anchor: 'middle', lh: 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 34 : 40, lh = d.small ? 44 : 52, y0 = d.small ? 512 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Respiration quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Respiration  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);

  /* ---------- update ---------- */
  return t => {
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
        op(o.s, u > 0 ? Math.sin(Math.min(1, u) * Math.PI) * 0.95 + (u >= 1 ? 0 : 0) : 0);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});

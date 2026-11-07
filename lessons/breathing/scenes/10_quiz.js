/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the
   silent thinking time, then the answer appears with a small picture and a progress dot fills.
   Pictures: the airway lighting trachea, bronchi, bronchioles, alveoli; the diaphragm flattening
   as it contracts; oxygen diffusing from an alveolus into the blood; limewater turning cloudy;
   carbon monoxide grabbing a red blood cell's spots. Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const Y = C.energy, OUT = '#E9C7D2', LUM = '#4A2233', STEEL = '#C9D6DE';
  const circD = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${(2 * r).toFixed(1)},0 a${r},${r} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  const LOBE = 'M-30,-70 C-70,-90 -128,-40 -132,40 C-136,110 -112,150 -70,152 C-40,154 -22,130 -20,90 C-18,40 -10,-20 -30,-70 Z';
  const LUNGS_D = LOBE + ' M30,-70 C70,-90 128,-40 132,40 C136,110 112,150 70,152 C40,154 22,130 20,90 C18,40 10,-20 30,-70 Z M-9,-150 L9,-150 L9,-64 L-9,-64 Z';
  function molCO(parent, r) { const g = G(parent); tr(atom(g, 'C', r), -r * 0.74, 0); tr(atom(g, 'O', r * 0.94), r * 0.74, 0); return g; }

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
  T(intro, 600, 350, 'Quick-fire quiz!', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures for the answers (drawn around (0,0), placed at (300,556)) ---------- */
  // 1. the airway: trachea, bronchi, bronchioles, alveoli light up in order
  function picAirway(g) {
    const GEN = [[0, 0], [50, 62], [30, 46], [26, 34]], WID = [16, 12, 8, 5];
    const br = [{ gen: 0, a: 0, x1: 0, y1: -30, d: 'M0,-124 L0,-30' }];
    (function grow(pi) {
      const p = br[pi], gen = p.gen + 1;
      if (gen > 3) return;
      [-1, 1].forEach(sg => {
        const a = p.a + sg * GEN[gen][0], L = GEN[gen][1], r = a * Math.PI / 180, pr = p.a * Math.PI / 180;
        const x1 = p.x1 + Math.sin(r) * L, y1 = p.y1 + Math.cos(r) * L, cx = p.x1 + Math.sin(pr) * L * 0.4, cy = p.y1 + Math.cos(pr) * L * 0.4;
        br.push({ gen, a, x1, y1, d: `M${p.x1.toFixed(1)},${p.y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}` });
        grow(br.length - 1);
      });
    })(0);
    let cd = '';
    br.filter(b => b.gen === 3).forEach(b => {
      const r = b.a * Math.PI / 180, dx = Math.sin(r), dy = Math.cos(r);
      [[6, 0, 8], [1, 8.5, 7], [1, -8.5, 7], [13, 6, 6.5], [13, -6, 6.5]].forEach(([al, pe, rr]) => { cd += circD(b.x1 + dx * al + dy * pe, b.y1 + dy * al - dx * pe, rr); });
    });
    const byGen = k => br.filter(b => b.gen === k).map(b => b.d).join(' ');
    const glows = [0, 1, 2].map(k => E('path', { d: byGen(k), fill: 'none', stroke: Y, 'stroke-width': WID[k] + 12, 'stroke-linecap': 'round' }, g));
    glows.push(E('path', { d: cd, fill: 'none', stroke: Y, 'stroke-width': 9 }, g));
    for (let k = 0; k <= 3; k++) E('path', { d: byGen(k), fill: 'none', stroke: OUT, 'stroke-width': WID[k], 'stroke-linecap': 'round' }, g);
    for (let k = 0; k <= 3; k++) E('path', { d: byGen(k), fill: 'none', stroke: LUM, 'stroke-width': WID[k] * 0.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-8,-104 Q0,-100 8,-104 M-8,-86 Q0,-82 8,-86 M-8,-68 Q0,-64 8,-68 M-8,-50 Q0,-46 8,-50', fill: 'none', stroke: '#C99AAA', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: cd, fill: ball('#F7A1B5', '#C25A7A'), stroke: '#FFD0DC', 'stroke-width': 1.5 }, g);
    const tags = [[-16, -72, 'T'], [-40, -20, 'B'], [-68, 42, 'B'], [-100, 124, 'A']].map(([x, y, L]) => T(g, x, y, L, { size: 30, weight: 800, fill: Y, anchor: 'end' }));
    const F = [0.02, 0.3, 0.52, 0.8];
    return t => {
      const lit = F.map(f => P(t, mid('a1', f) - 0.05, 0.3, linear));
      lit.forEach((p, k) => { const now = p * (1 - (k < 3 ? lit[k + 1] : 0)); op(glows[k], p * (0.16 + 0.34 * now * (0.7 + 0.3 * wave(t, 1.2)))); op(tags[k], p); });
    };
  }
  // 2. the diaphragm contracts and flattens
  function picDiaphragm(g) {
    const lu = E('path', { d: LUNGS_D, fill: ball('#F48FA6', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 5 }, g);
    E('path', { d: 'M-24,-82 Q-84,-76 -98,-14 M-24,-52 Q-82,-46 -96,16 M-24,-22 Q-78,-16 -90,44 M24,-82 Q84,-76 98,-14 M24,-52 Q82,-46 96,16 M24,-22 Q78,-16 90,44', fill: 'none', stroke: '#E4ECF5', 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    const dm = E('path', { fill: 'none', stroke: C.heat, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    const dn = arrow(g, 0, 72, 0, 104, { color: Y, width: 6 });
    const lb = chip(g, 'contracts', { size: 30, fill: C.card2, stroke: Y, color: Y }); tr(lb, 0, 140);
    return t => {
      const f = P(t, at('a2') - 0.05, 0.8, ease);
      dm.setAttribute('d', `M-98,64 Q0,${(64 - 66 * (1 - f)).toFixed(1)} 98,64`);
      lu.setAttribute('transform', `translate(0 ${(-38 + 8 * f).toFixed(1)}) scale(${(0.44 + 0.03 * f).toFixed(3)} ${(0.44 + 0.06 * f).toFixed(3)})`);
      dn.set(P(t, at('a2') + 0.1, 0.5)); op(dn, P(t, at('a2') + 0.1, 0.2, linear));
      op(lb, P(t, at('a2') + 0.2, 0.3, linear));
    };
  }
  // 3. oxygen diffuses from the alveolus into the blood in the capillary curving round it
  function picDiffusion(g) {
    const CX = -44, RC = 104, A0 = 70 * Math.PI / 180;
    const onCap = ph => [CX + RC * Math.cos(ph), RC * Math.sin(ph)];
    E('circle', { cx: CX, cy: 0, r: 84, fill: 'rgba(159,216,255,0.16)', stroke: '#9FD8FF', 'stroke-width': 3 }, g);
    const p0 = onCap(A0), p1 = onCap(-A0);
    const capD = `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${RC},${RC} 0 0 0 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    E('path', { d: capD, fill: 'none', stroke: '#FF9AA3', 'stroke-width': 38, 'stroke-linecap': 'round' }, g);
    E('path', { d: capD, fill: 'none', stroke: linGrad('#E8424F', '#7E4A9E', true), 'stroke-width': 31, 'stroke-linecap': 'round' }, g);
    T(g, CX - 38, 128, 'alveolus', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
    T(g, 96, 134, 'blood', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9AA3' });
    const dr = rng(23), dots = [];
    for (let k = 0; k < 12; k++) {
      const a = dr() * TAU, rr = Math.sqrt(dr()) * 60;
      dots.push({ el: E('circle', { r: 7, fill: ball(C.oxygen, C.oxygenDk) }, g), x0: CX + Math.cos(a) * rr, y0: Math.sin(a) * rr * 0.9, ph: k / 12, stay: k % 3 === 0, cap: (dr() - 0.5) * 1.6 });
    }
    return t => dots.forEach(d => {
      if (d.stay) { attr(d.el, 'cx', d.x0 + Math.sin(t * 1.6 + d.ph * 9) * 6 * calm); attr(d.el, 'cy', d.y0 + Math.cos(t * 1.3 + d.ph * 9) * 6 * calm); op(d.el, 1); return; }
      const u = ((t * 0.3) + d.ph) % 1;
      let q;
      if (u < 0.45) { const p = ease(u / 0.45), c = onCap(d.cap); q = [lerp(d.x0, c[0], p), lerp(d.y0, c[1], p)]; }
      else q = onCap(lerp(d.cap, -A0, (u - 0.45) / 0.55));
      attr(d.el, 'cx', q[0]); attr(d.el, 'cy', q[1]); op(d.el, Math.min(1, u * 8) * (1 - P(u, 0.86, 0.14, linear)));
    });
  }
  // 4. limewater turns cloudy
  function picLime(g) {
    const w = 72, h = 200, r = w / 2, q = r - 5, top = 70;
    const tg = G(g); tr(tg, 0, -84);
    E('path', { d: `M${-r},0 L${-r},${h - r} A${r},${r} 0 0 0 ${r},${h - r} L${r},0 Z`, fill: 'rgba(200,230,245,0.06)' }, tg);
    const liq = `M${-q},${top} L${-q},${h - r} A${q},${q} 0 0 0 ${q},${h - r} L${q},${top} Z`;
    E('path', { d: liq, fill: 'rgba(140,205,240,0.32)' }, tg);
    const milk = E('path', { d: liq, fill: '#EEF3F6' }, tg);
    E('path', { d: `M${-r},0 L${-r},${h - r} A${r},${r} 0 0 0 ${r},${h - r} L${r},0`, fill: 'none', stroke: '#BFD9E6', 'stroke-width': 4 }, tg);
    E('line', { x1: -r - 7, y1: 0, x2: r + 7, y2: 0, stroke: '#BFD9E6', 'stroke-width': 5, 'stroke-linecap': 'round' }, tg);
    E('path', { d: 'M-110,-40 L-12,-40 L-12,170', fill: 'none', stroke: '#9DB7C6', 'stroke-width': 11, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, tg);
    E('path', { d: 'M-110,-40 L-12,-40 L-12,170', fill: 'none', stroke: '#11303D', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, tg);
    T(g, -112, -134, 'breathed-out air', { size: 26, weight: 600, fill: C.air });
    const bs = bubbles(tg, -14, top + 8, 28, h - top - 30, { n: 6, r: 5, seed: 9, speed: 0.55 });
    return t => { bs.upd(t * calm); op(milk, 0.9 * P(t, at('a4') + 0.2, 1.3, ease)); };
  }
  // 5. carbon monoxide grabs a red blood cell's spots
  function picCO(g) {
    E('circle', { r: 92, fill: ball('#F05A66', '#9E1C2B'), stroke: '#FF9AA3', 'stroke-width': 3 }, g);
    E('circle', { r: 46, fill: 'rgba(110,10,25,0.28)' }, g);
    const SP = [-135, -45, 45, 135].map(a => [Math.cos(a * Math.PI / 180) * 52, Math.sin(a * Math.PI / 180) * 52]);
    SP.forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 20, fill: 'rgba(80,6,18,0.4)', stroke: '#FFC2C8', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, g));
    const locks = SP.slice(0, 2).map(([x, y]) => E('circle', { cx: x, cy: y, r: 22, fill: 'none', stroke: STEEL, 'stroke-width': 4 }, g));
    const ms = [0, 1].map(k => ({ m: molCO(g, 10), to: SP[k], from: [-190, -60 + k * 60] }));
    [2, 3].forEach(k => tr(molO2(g, 10), SP[k][0], SP[k][1]));
    T(g, 0, 128, 'red blood cell', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9AA3' });
    return t => ms.forEach((o, k) => {
      const p = P(t, at('a5') - 0.1 + k * 0.12, 0.55, easeOut);
      tr(o.m, lerp(o.from[0], o.to[0], p), lerp(o.from[1], o.to[1], p), 1, (1 - p) * 140);
      op(o.m, Math.min(1, p * 5)); op(locks[k], P(t, at('a5') + 0.45 + k * 0.12, 0.2, linear));
    });
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What’s the order of the airway, from\nthe trachea down to the air sacs?', pic: picAirway, words: true },
    { q: 'When you breathe in, does your\ndiaphragm contract or relax?', a: [[['It ', C.ink], ['contracts', Y, 800], [',', C.ink]], [['and flattens.', C.ink]]], pic: picDiaphragm },
    { q: 'How does oxygen get from the\nalveoli into your blood?', a: [[['By ', C.ink], ['diffusion', Y, 800], [', from a high', C.ink]], [['to a low concentration.', C.ink]]], pic: picDiffusion },
    { q: 'What happens to limewater when\nyou breathe out through it?', a: [[['It turns from clear', C.ink]], [['to ', C.ink], ['cloudy', Y, 800], [', because of', C.ink]], [['the carbon dioxide.', C.ink]]], pic: picLime, small: true },
    { q: 'Which gas from cigarette smoke cuts\nthe oxygen your blood can carry?', a: [[['Carbon monoxide.', Y, 800]]], pic: picCO },
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
    let words = null;
    if (d.words) {
      const l1 = rich(ans, 464, 526, [['Trachea', Y, 800], [', ', C.ink], ['bronchi', Y, 800], [',', C.ink]], { size: 40, weight: 700 });
      const l2 = rich(ans, 464, 578, [['bronchioles', Y, 800], [', ', C.ink], ['alveoli', Y, 800], ['.', C.ink]], { size: 40, weight: 700 });
      words = [l1.childNodes[0], l1.childNodes[2], l2.childNodes[0], l2.childNodes[2]];
    } else d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, words, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Breathing quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Breathing quiz  →  Science Lab', { size: 30, fill: Y, color: C.bg0 });
  tr(labChip, 600, 496);

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
    const ia = win(t, S.first - 0.6, at('q1') - 0.05, 0.3);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
    }

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.15, nx - 0.02, 0.25);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.12;
      const tv = win(t, a - 0.25, b, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      if (q.words) [0.02, 0.3, 0.52, 0.8].forEach((f, j) => q.words[j].setAttribute('fill', P(t, mid('a1', f) - 0.05, 0.3, linear) > 0.5 ? Y : C.muted));
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
        op(o.s, u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      const lp = P(t, mid('outro', 0.45), 0.5, pop); op(labChip, clamp(lp * 2)); tr(labChip, 600, 496, Math.max(0.01, 0.85 + 0.15 * lp));
    }
  };
});

/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid -> "5 exam traps":
   each trap shows the wrong idea struck out and the right idea ticked, with a small picture. */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Glad Owls ..." with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy;

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
  function hookCard(x, y) { const g = G(hooks); tr(g, x, y); card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }
  // 1. Glad Owls Carry Wet Eggs
  const h1 = hookCard(50, 115);
  const owl = G(h1); tr(owl, 462, 58);
  E('ellipse', { cx: 0, cy: 6, rx: 30, ry: 34, fill: ball('#B98A5E', '#7A5534'), stroke: '#D9B48A', 'stroke-width': 2 }, owl);
  E('path', { d: 'M-24,-20 L-28,-40 L-10,-27 Z M24,-20 L28,-40 L10,-27 Z', fill: '#7A5534' }, owl);
  E('circle', { cx: -12, cy: -6, r: 11, fill: '#FFFFFF' }, owl); E('circle', { cx: 12, cy: -6, r: 11, fill: '#FFFFFF' }, owl);
  const pupils = [E('circle', { cx: -12, cy: -6, r: 5, fill: '#1B1208' }, owl), E('circle', { cx: 12, cy: -6, r: 5, fill: '#1B1208' }, owl)];
  E('path', { d: 'M-6,6 L6,6 L0,15 Z', fill: C.heat }, owl);
  const owlSegs = initials('Glad Owls Carry Wet Eggs', C.ink);
  rich(h1, 30, 68, owlSegs, { size: fit(owlSegs, 34, 390), weight: 700 });
  const eq1 = G(h1);
  rich(eq1, 30, 140, [['g', Y, 800], ['lucose', C.glucose, 700], ' + ', ['o', Y, 800], ['xygen', C.oxygen, 700], ' →'], { size: 28 });
  rich(eq1, 30, 184, [['c', Y, 800], ['arbon dioxide', C.co2, 700], ' + ', ['w', Y, 800], ['ater', C.water, 700]], { size: 28 });
  rich(eq1, 30, 228, ['(+ ', ['e', Y, 800], ['nergy', C.energy, 700], ')'], { size: 28 });
  // 2. aerobic / anaerobic
  const h2 = hookCard(630, 115);
  T(h2, 30, 62, 'With or without oxygen?', { size: 30, weight: 700 });
  const r2a = G(h2), r2b = G(h2);
  T(r2a, 30, 128, 'aerobic', { size: 34, weight: 700 });
  T(r2a, 200, 128, '= with oxygen', { size: 28, weight: 600, fill: C.muted });
  const o2a = molO2(r2a, 14); tr(o2a, 448, 118); const tk2 = tick(r2a, 12); tr(tk2, 486, 120);
  rich(r2b, 30, 190, [['an', Y, 800], ['aerobic', C.ink, 700]], { size: 34 });
  T(r2b, 200, 190, '= without', { size: 28, weight: 600, fill: C.muted });
  const o2b = molO2(r2b, 14); tr(o2b, 448, 180); op(o2b, 0.55); const cx2 = cross(r2b, 12); tr(cx2, 448, 180);
  rich(r2b, 30, 234, [['an-', Y, 800], ' means absent'], { size: 25, fill: C.muted });
  // 3. Lazy Athletes, Energetic Yeast
  const h3 = hookCard(50, 395);
  const lazySegs = initials('Lazy Athletes, Energetic Yeast', C.ink);
  rich(h3, 30, 66, lazySegs, { size: fit(lazySegs, 34, 460), weight: 700 });
  const r3a = G(h3), r3b = G(h3);
  E('circle', { cx: 40, cy: 131, r: 9, fill: C.lactic }, r3a);
  rich(r3a, 62, 140, [['A', Y, 800], ['thletes (humans) → ', C.ink], ['l', Y, 800], ['actic acid', C.lactic, 800]], { size: 27 });
  E('circle', { cx: 40, cy: 197, r: 9, fill: C.ethanol }, r3b);
  rich(r3b, 62, 206, [['Y', Y, 800], ['east → ', C.ink], ['e', Y, 800], ['thanol + CO₂', C.ethanol, 800]], { size: 27 });
  // 4. Cells Respire, Lungs Ventilate
  const h4 = hookCard(630, 395);
  const crSegs = initials('Cells Respire, Lungs Ventilate', C.ink);
  rich(h4, 30, 66, crSegs, { size: fit(crSegs, 34, 460), weight: 700 });
  const miniCell = animalCell(h4, 24, 20, { sw: 3, nr: 7, seed: 9 }); tr(miniCell, 56, 132);
  rich(h4, 98, 142, [['cells', C.cell, 800], ': a chemical reaction'], { size: 27 });
  const miniLungs = lungs(h4, 0.16); tr(miniLungs, 56, 196);
  rich(h4, 98, 206, [['lungs', '#F48FA6', 800], ': move air in and out'], { size: 27 });
  const hookCards = [[h1, 'owls'], [h2, 'an'], [h3, 'lazy'], [h4, 'crlv']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['releases', '(+ energy), 6s', 'lactic acid only', 'all the time', 'less energy'];
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
    trapGroup('Respiration makes energy', ['Respiration ', ['releases', Y, 800], ' energy'], g => {
      const b = glucoseBattery(g, 44); tr(b, -110, 0);
      const a = arrow(g, -48, 0, 40, 0, { color: C.muted, width: 5 });
      const sp = spark(g, 26); tr(sp, 100, 0);
      T(g, 0, 78, 'stored in glucose, then transferred', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      return t => { sp.upd(t); b.set(1 - 0.5 * wave(t * calm, 3)); };
    }),
    trapGroup('C₆H₁₂O₆ + O₂ → CO₂ + H₂O', ['C₆H₁₂O₆ + ', ['6', Y, 800], 'O₂ → ', ['6', Y, 800], 'CO₂ + ', ['6', Y, 800], 'H₂O'], g => {
      const c = chip(g, '(+ energy)', { size: 34, fill: C.energy, color: C.bg0 });
      const s1 = spark(g, 16, { seed: 1 }); tr(s1, -c.w / 2 - 36, -6);
      const s2 = spark(g, 16, { seed: 2 }); tr(s2, c.w / 2 + 36, -6);
      T(g, 0, 78, 'energy goes in brackets', { size: 24, weight: 500, fill: C.muted, anchor: 'middle', font: FB });
      return t => { s1.upd(t); s2.upd(t + 0.5); };
    }),
    trapGroup('Muscles make lactic acid and CO₂', ['humans: glucose → ', ['lactic acid', C.lactic, 800], ' only'], g => {
      const m = molCO2(g, 18); tr(m, -60, 0);
      const x = cross(g, 30); tr(x, -60, 0);
      T(g, 20, 11, 'no CO₂, no water', { size: 28, weight: 700, fill: C.ink });
      return null;
    }),
    trapGroup('Plants only respire at night', ['Plants respire ', ['all the time', Y, 800]], g => {
      const sun = G(g); tr(sun, -150, -8);
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; E('line', { x1: Math.cos(a) * 32, y1: Math.sin(a) * 32, x2: Math.cos(a) * 44, y2: Math.sin(a) * 44, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, sun); }
      E('circle', { r: 24, fill: ball(C.energy, '#E0A800') }, sun);
      const moon = G(g); tr(moon, 150, -8);
      E('path', { d: 'M14.67,-23.85 A28,28 0 1 0 14.67,23.85 A24,24 0 1 1 14.67,-23.85 Z', fill: '#E4ECF5' }, moon);
      const plant = G(g); tr(plant, 0, 8);
      E('path', { d: 'M-26,20 L26,20 L20,52 L-20,52 Z', fill: '#B5653A', stroke: '#7F4022', 'stroke-width': 3 }, plant);
      E('path', { d: 'M0,20 C0,0 -2,-18 0,-40', stroke: C.stem, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, plant);
      E('path', { d: 'M0,-10 C-24,-14 -36,-30 -40,-44 C-22,-42 -6,-30 0,-10 Z M0,-24 C22,-30 32,-46 34,-58 C16,-54 4,-42 0,-24 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, plant);
      const tk1 = tick(g, 11); tr(tk1, -150, 56);
      const tk2 = tick(g, 11); tr(tk2, 150, 56);
      const sp = spark(g, 10, { seed: 4 }); tr(sp, 0, -20);
      return t => { sp.upd(t); };
    }),
    trapGroup('Anaerobic releases more energy', ['Anaerobic releases ', ['less', Y, 800], ' energy'], g => {
      E('line', { x1: -190, y1: 52, x2: 190, y2: 52, stroke: C.muted, 'stroke-width': 3 }, g);
      E('rect', { x: -140, y: -48, width: 70, height: 100, rx: 8, fill: C.energy }, g);
      E('rect', { x: 60, y: 28, width: 70, height: 24, rx: 6, fill: C.energy, opacity: 0.85 }, g);
      T(g, -105, 84, 'aerobic', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
      T(g, 95, 84, 'anaerobic', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
      return null;
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('owls') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('owls') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        const x = i % 2 ? 630 : 50, y = i < 2 ? 115 : 395;
        tr(g, x, y + (1 - clamp(p)) * 26);
      });
      op(eq1, P(t, mid('owls', 0.42), 0.6, linear));
      op(r2b, P(t, mid('an', 0.5), 0.5, linear));
      op(r3a, P(t, mid('lazy', 0.42), 0.5, linear)); op(r3b, P(t, mid('lazy', 0.68), 0.5, linear));
      const look = Math.sin(t * 1.3 * calm) * 3;
      pupils.forEach(p => tr(p, look, 0));
      miniCell.upd(t);
      miniLungs.set(wave(t * calm, 3.2));
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

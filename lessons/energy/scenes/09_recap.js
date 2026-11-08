/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid: the eight store badges cascade
   in under Kind Gorillas Eat Chocolate (showpiece), the four pathways lettered M, E, R, H, Useful Over Total,
   and the seven renewables under Six Wild Horses -> "5 exam traps": each shows the wrong idea struck out,
   the right idea ticked, and a small picture. */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW, weight) => { const w = textWidth(plain(segs), size, FD, weight || 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Kind Gorillas ..." with each first letter bold yellow */
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
  const CW = 520, CH = 255, POS = [[50, 115], [630, 115], [50, 395], [630, 395]];
  function hookCard(i) { const g = G(hooks); tr(g, POS[i][0], POS[i][1]); card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }
  // 1. Kind Gorillas Eat Chocolate, Tigers Never Eat Mango: the eight store badges in the Energy stores
  //    chapter's 4 x 2 grid, each word of the mnemonic over its badge
  const h1 = hookCard(0);
  const GX = [70, 190, 312, 432], GY = [84, 182];
  const gWords = ['Kind', 'Gorillas', 'Eat', 'Chocolate,', 'Tigers', 'Never', 'Eat', 'Mango'];
  const badges = EN.order.map((k, i) => ({
    w: rich(h1, GX[i % 4], GY[Math.floor(i / 4)] - 38, [[gWords[i][0], Y, 800], [gWords[i].slice(1), C.ink]], { size: 28, weight: 700, anchor: 'middle' }),
    b: enBadge(h1, k, { r: 24, label: false }), x: GX[i % 4], y: GY[Math.floor(i / 4)],
  }));
  const cap1 = T(h1, 260, 238, 'the 8 energy stores', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  // 2. M, E, R, H: the four pathways
  const h2 = hookCard(1);
  rich(h2, 30, 58, [['M', Y, 800], ', ', ['E', Y, 800], ', ', ['R', Y, 800], ', ', ['H', Y, 800], [': the 4 pathways', C.muted, 600]], { size: 34, weight: 700 });
  const MR = [['mech', 'M'], ['elec', 'E'], ['rad', 'R'], ['heat', 'H']].map(([kind, L], i) => {
    const g = G(h2), y = 100 + i * 42;
    const disc = G(g); tr(disc, 46, y);
    E('circle', { r: 19, fill: C.energy }, disc);
    T(disc, 0, 9, L, { size: 26, weight: 800, anchor: 'middle', fill: C.bg0 });
    const row = G(g);
    const ic = G(row); tr(ic, 114, y, 0.5);
    let anim;
    if (kind === 'heat') {
      arrow(ic, -60, 0, 60, 0, { color: C.heat, width: 8 });
      const hw = heatWaves(ic, { n: 3, h: 26, spacing: 16, color: C.heat, width: 4 }); tr(hw, 0, -8);
      anim = t => hw.upd(t * calm);
    } else {
      const pw = kind === 'mech' ? enPathway(ic, 'mech', 0, 0, 70, 0, { label: false, width: 7 }) : enPathway(ic, kind, -60, 0, 60, 0, { label: false, wave: 'light' });
      anim = t => pw.upd(t * calm);
    }
    T(row, 172, y + 9, EN.pathLabel[kind], { size: 26, weight: 700 });
    return { disc, row, anim };
  });
  // 3. Useful Over Total
  const h3 = hookCard(2);
  rich(h3, 30, 58, initials('Useful Over Total', C.ink), { size: 34, weight: 700 });
  const fr3a = G(h3), fr3b = G(h3), fr3c = G(h3);
  T(fr3a, 30, 164, 'efficiency =', { size: 28, weight: 700 });
  rich(fr3a, 340, 142, [['u', Y, 800], 'seful energy'], { size: 28, weight: 700, anchor: 'middle' });
  E('line', { x1: 200, y1: 154, x2: 480, y2: 154, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, fr3b);
  rich(fr3c, 340, 192, [['t', Y, 800], 'otal energy supplied'], { size: 28, weight: 700, anchor: 'middle' });
  const note3 = T(h3, 30, 236, '× 100 for a percentage', { size: 24, weight: 600, fill: C.muted });
  // 4. Six Wild Horses Took Wet Grass Back: the seven renewables
  const h4 = hookCard(3);
  rich(h4, 30, 56, initials('Six Wild Horses Took', C.ink), { size: 34, weight: 700 });
  rich(h4, 30, 98, initials('Wet Grass Back', C.ink), { size: 34, weight: 700 });
  const res = EN.renewable.map((k, i) => {
    const g = G(h4), r = enResource(g, k, { label: false }); tr(r, 0, 0, 0.42);
    T(g, 0, 60, 'SWHTWGB'[i], { size: 26, weight: 800, anchor: 'middle', fill: Y });
    return { g, r, x: 64 + i * 65 };
  });
  const hookCards = [[h1, 'gorillas'], [h2, 'merh'], [h3, 'uot'], [h4, 'horses']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['dissipates', 'pathways', 'never over 100%', 'non-renewable', 'joules'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: 26, weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const ws = fit([wrong], 32, 660, 600);
    const wt = T(g, 458, 313, wrong, { size: ws, weight: 600, fill: C.muted });
    const st = strike(g, 452, 302, 466 + textWidth(wrong, ws, FD, 600), C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g); tr(ill, 760, 540);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    trapGroup('Energy gets used up', ['Energy ', ['dissipates', Y, 800], ' into the surroundings'], g => {
      // the same room, warm tint and spreading sparks as the Useful and wasted chapter and the quiz
      const room = G(g); tr(room, -360, -58);
      E('rect', { x: 0, y: 0, width: 330, height: 116, rx: 14, fill: '#15303C', stroke: '#2F5A6E', 'stroke-width': 2.5 }, room);
      E('rect', { x: 0, y: 102, width: 330, height: 14, rx: 4, fill: '#4A3B30', stroke: '#6B5546', 'stroke-width': 2 }, room);
      const tint = E('rect', { x: 0, y: 0, width: 330, height: 104, rx: 14, fill: '#FF7A30' }, room); op(tint, 0);
      const bulb = enBulb(room, 'filament', { s: 0.42, on: 1 }); tr(bulb, 40, 80);
      const dis = enDissipate(room, 330, 102, { n: 16, r: 8, from: [42, 46], tint: 0, end: 0.52, fade: 0.45 });
      const c = chip(g, 'dissipated, not destroyed', { size: 26, fill: C.card2, stroke: EN.wasted }); tr(c, 190, 0);
      return (t, t0) => { const p = P(t, t0 + 0.1, 1.6); dis.set(p, t * calm); op(tint, 0.24 * ease(p)); bulb.set(1 - 0.95 * p); };
    }),
    trapGroup('Heat, light and sound are stores', ['They are ', ['pathways', Y, 800], ', not stores'], g => {
      const j = enJar(g, 'thermal', { w: 70, h: 92, level: 0.5, label: false }); tr(j, -322, 2);
      const jx = cross(g, 30); tr(jx, -322, 2);
      const anims = [];
      const cells = [['heat', 'heat', -150, -34], ['light', 'light', 120, -34], ['sound', 'sound', -150, 42], ['electricity', 'elec', 120, 42]].map(([word, kind, cx, cy]) => {
        if (kind === 'heat') arrow(g, cx - 110, cy, cx + 110, cy, { color: C.heat, width: 7 });
        else { const pw = enPathway(g, kind === 'elec' ? 'elec' : 'rad', cx - 110, cy, cx + 110, cy, { label: false, wave: kind }); anims.push(pw); }
        const c = chip(g, word, { size: 26, fill: C.card2, stroke: C.good }); tr(c, cx - 8, cy);
        const tk = tick(g, 11); tr(tk, cx + 130, cy);
        return { c, tk, cx, cy };
      });
      return (t, t0) => {
        anims.forEach(a => a.upd(t * calm));
        cells.forEach((c, i) => { const p = popIn(t, t0 + 0.15 + i * 0.12, 0.4); op(c.tk, clamp(p * 2)); tr(c.tk, c.cx + 130, c.cy, Math.max(0.01, p)); });
        const p = popIn(t, t0, 0.4); op(jx, clamp(p * 2)); tr(jx, -322, 2, Math.max(0.01, p));
      };
    }),
    trapGroup('Efficiency = 120%', ['Efficiency is ', ['never', Y, 800], ' more than 100%'], g => {
      const bad = chip(g, 'efficiency = 120%', { size: 30, fill: 'rgba(255,96,112,0.14)', stroke: C.bad }); tr(bad, -180, -16);
      const xb = cross(g, 20); tr(xb, -180 + bad.w / 2 + 34, -16);
      const good = chip(g, 'efficiency = 75%', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good }); tr(good, 170, -16);
      const tk = tick(g, 19); tr(tk, 170 + good.w / 2 + 34, -16);
      T(g, 0, 60, 'you can never get more energy out than you put in', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
      return (t, t0) => {
        const p1 = popIn(t, t0 + 0.2, 0.4), p2 = popIn(t, t0 + 0.55, 0.4);
        op(xb, clamp(p1 * 2)); tr(xb, -180 + bad.w / 2 + 34, -16, Math.max(0.01, p1));
        op(tk, clamp(p2 * 2)); tr(tk, 170 + good.w / 2 + 34, -16, Math.max(0.01, p2));
      };
    }),
    trapGroup('Nuclear power is renewable', ['Nuclear is ', ['non-renewable', Y, 800], ', though low-carbon'], g => {
      card(g, -350, -66, 310, 136, { fill: 'rgba(143,156,171,0.10)', stroke: '#8F9CAB' });
      T(g, -195, -32, 'non-renewable', { size: 26, weight: 700, anchor: 'middle', fill: '#C9D3DC' });
      card(g, 40, -66, 310, 136, { fill: 'rgba(86,214,155,0.10)', stroke: C.good });
      T(g, 195, -32, 'renewable', { size: 26, weight: 700, anchor: 'middle', fill: C.good });
      [['coal', -298], ['oil', -224], ['gas', -150]].forEach(([k, x]) => tr(enResource(g, k, { label: false }), x, 26, 0.5));
      const wnd = enResource(g, 'wind', { label: false }); tr(wnd, 110, 26, 0.5);
      [['solar', 196], ['hydro', 282]].forEach(([k, x]) => tr(enResource(g, k, { label: false }), x, 26, 0.5));
      const u = enResource(g, 'uranium', { label: false });
      const tk = tick(g, 14);
      return (t, t0) => {
        wnd.upd(t * calm);
        const p = P(t, t0 + 0.05, 0.8), q = 1 - p;
        tr(u, 2 * q * p * -40 + p * p * -82, q * q * -40 + 2 * q * p * -110 + p * p * 26, 0.5);
        const k = popIn(t, t0 + 0.85, 0.4); op(tk, clamp(k * 2)); tr(tk, -64, -30, Math.max(0.01, k));
      };
    }),
    trapGroup('Energy is measured in watts or °C', ['Energy is measured in ', ['joules (J)', Y, 800]], g => {
      const items = [['J', 'energy', true, -210], ['W', 'power', false, 0], ['°C', 'temperature', false, 210]].map(([sym, what, ok, x]) => {
        const d = G(g); tr(d, x, -16);
        E('circle', { r: 38, fill: ok ? C.energy : C.card2, stroke: ok ? '#FFF3A6' : C.line, 'stroke-width': 3 }, d);
        T(d, 0, 14, sym, { size: 40, weight: 700, anchor: 'middle', fill: ok ? C.bg0 : C.ink });
        T(g, x, 58, what, { size: 26, weight: 600, anchor: 'middle', fill: ok ? C.energy : C.muted });
        const m = ok ? tick(g, 15) : cross(g, 14);
        return { m, x };
      });
      // J ticked on "joules", W and °C crossed on "watts" and "degrees"
      return (t, t0) => items.forEach((it, i) => { const p = popIn(t, t0 + [0, 0.55, 1.15][i], 0.4); op(it.m, clamp(p * 2)); tr(it.m, it.x + 46, -50, Math.max(0.01, p)); });
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: the shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('gorillas') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('gorillas') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2)); tr(g, POS[i][0], POS[i][1] + (1 - clamp(p)) * 26);
      });
      // the badges cascade in letter-side up as each word is said, then turn over to show their stores
      // on "the eight energy stores"
      const GW = [0.01, 0.08, 0.17, 0.22, 0.36, 0.44, 0.5, 0.54];
      badges.forEach((o, i) => {
        const p = P(t, mid('gorillas', GW[i]) - 0.05, 0.5, pop);
        op(o.b, clamp(p * 2.5)); tr(o.b, o.x, o.y - 30 * (1 - clamp(p)), 0.7 + 0.3 * p); op(o.w, clamp(p * 2.5));
        o.b.set({ flip: 1 - P(t, mid('gorillas', 0.72 + i * 0.03), 0.4, linear) });
      });
      op(cap1, P(t, mid('gorillas', 0.74), 0.5, linear));
      // "M", "E", "R", "H" are said at 0, 0.08, 0.14 and 0.21 of the line; each pathway's row as it is named
      MR.forEach((r, i) => {
        const pd = popIn(t, mid('merh', [0.0, 0.075, 0.135, 0.21][i]), 0.4); op(r.disc, clamp(pd * 2)); tr(r.disc, 46, 100 + i * 42, Math.max(0.01, pd));
        const pr = P(t, mid('merh', [0.44, 0.6, 0.72, 0.86][i]), 0.5, linear); op(r.row, pr); tr(r.row, (1 - pr) * 16, 0);
        r.anim(t);
      });
      op(fr3a, P(t, mid('uot', 0.3), 0.45, linear)); op(fr3b, P(t, mid('uot', 0.6), 0.45, linear)); op(fr3c, P(t, mid('uot', 0.7), 0.45, linear));
      op(note3, P(t, mid('uot', 0.86), 0.45, linear));
      res.forEach((o, i) => {
        const p = P(t, mid('horses', 0.05 + i * 0.075), 0.5, pop);
        op(o.g, clamp(p * 2)); tr(o.g, o.x, 162 + (1 - clamp(p)) * 18, 0.8 + 0.2 * p);
        o.r.upd(t * calm);
      });
    }

    // traps
    const ta = P(t, at('traps') - 0.1, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
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
      // per trap: when the wrong idea is struck out, the right one is said, and its picture comes in
      const STK = [0.25, 0.3, 0.28, 0.28, 0.28], RGT = [0.55, 0.52, 0.36, 0.36, 0.36], ILL = [0.6, 0.58, 0.5, 0.5, 0.5];
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, STK[i]), 0.5, easeOut));
        const rp = P(t, mid(k, RGT[i]), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const tI = mid(k, ILL[i]), ip = P(t, tI, 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t, tI);
      });
    }
  };
});

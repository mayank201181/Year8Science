/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (the 2, 8, 8 bus; Little Naughty
   Kids Run Crazy Fast; Funny Clowns Bring Ice; the posh noble gases, showpiece) -> "5 exam traps": each
   trap shows the wrong idea struck out and the right idea ticked, with a small picture. */
scene('recap', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, ORANGE = C.heat, LIME = '#B5E655', RED = '#FF9A8F', GREY = '#C9D3DC';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Little Naughty Kids" with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], Y, 800], [w.slice(1), col]] : [w]));
  /* a small element tile: just the symbol */
  function miniTile(parent, z, s, col) {
    const g = G(parent);
    E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.14, fill: col, stroke: '#FFFFFF', 'stroke-opacity': 0.45, 'stroke-width': 2 }, g);
    T(g, 0, s * 0.2, ptElement(z).sym, { size: Math.round(s * 0.56), weight: 700, anchor: 'middle', fill: C.bg0 });
    return g;
  }
  /* the bus from the atom chapter (2, 8 and 8 seats), lighter; g.pass = electron passengers in fill order */
  function miniBus(parent) {
    const g = G(parent);
    for (const x of [-150, 150]) for (const s of [-1, 1]) E('rect', { x: x - 34, y: s * 96 - 13, width: 68, height: 26, rx: 10, fill: '#33444F', stroke: '#8EA3B0', 'stroke-width': 2.5 }, g);
    E('rect', { x: -252, y: -92, width: 504, height: 184, rx: 38, fill: '#E2553F', stroke: '#FFAA94', 'stroke-width': 4 }, g);
    E('rect', { x: -230, y: -72, width: 462, height: 144, rx: 24, fill: '#EBDDC3' }, g);
    E('path', { d: 'M-241,-58 Q-250,0 -241,58', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    for (const s of [-1, 1]) E('circle', { cx: -244, cy: s * 72, r: 8, fill: Y }, g);
    g.pass = [];
    [[-144], [-82, -44, -6, 32], [94, 132, 170, 208]].forEach(xs => xs.forEach(x => [-38, 38].forEach(y => {
      E('rect', { x: x - 15, y: y - 15, width: 30, height: 30, rx: 7, fill: '#7A93A3', stroke: '#506A7A', 'stroke-width': 2 }, g);
      const p = E('circle', { cx: x - 2, cy: y, r: 12, fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 1.5 }, g);
      op(p, 0); g.pass.push(p);
    })));
    return g;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: Y, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2x2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CH = 255, POS = [[50, 115], [630, 115], [50, 395], [630, 395]];
  function hookCard(i) { const g = G(hooks); tr(g, POS[i][0], POS[i][1]); card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }
  // 1. two, eight, eight: the bus rule
  const h1 = hookCard(0);
  const digs = ['2', '8', '8'].map((d, i) => { const g = G(h1); tr(g, 46 + i * 68, 62); T(g, 0, 20, d, { size: 56, weight: 800, anchor: 'middle', fill: Y }); return g; });
  [0, 1].forEach(i => T(h1, 74 + i * 68, 82, ',', { size: 56, weight: 700, anchor: 'middle', fill: C.muted }));
  const busNote = T(h1, 236, 80, 'the bus rule', { size: 32, weight: 700 });
  const bus = miniBus(h1); tr(bus, 262, 182, 0.56);
  // 2. Little Naughty Kids Run Crazy Fast
  const h2 = hookCard(1);
  const kidsA = initials('Little Naughty Kids', C.ink), kidsB = initials('Run Crazy Fast', C.ink);
  const kSize = Math.min(fit(kidsA, 34, 320), fit(kidsB, 34, 320));
  rich(h2, 30, 66, kidsA, { size: kSize, weight: 700 }); rich(h2, 30, 108, kidsB, { size: kSize, weight: 700 });
  const kidsNote = G(h2);
  T(kidsNote, 30, 170, 'Group 1 gets', { size: 27, weight: 600, fill: C.muted });
  rich(kidsNote, 30, 208, [['more', ORANGE, 800], ' reactive going down'], { size: 27 });
  const kidsTiles = [3, 11, 19, 37, 55, 87].map((z, i) => { const g = G(h2); tr(g, 404, 38 + i * 36); miniTile(g, z, 34, ORANGE); return g; });
  const kidsArrow = arrow(h2, 450, 30, 450, 224, { color: ORANGE, width: 6 });
  // 3. Funny Clowns Bring Ice
  const h3 = hookCard(2);
  const clA = initials('Funny Clowns', C.ink), clB2 = initials('Bring Ice', C.ink);
  rich(h3, 30, 66, clA, { size: 34, weight: 700 }); rich(h3, 30, 108, clB2, { size: 34, weight: 700 });
  const clNote = G(h3);
  T(clNote, 30, 170, 'Group 7 gets', { size: 27, weight: 600, fill: C.muted });
  rich(clNote, 30, 208, [['less', LIME, 800], ' reactive going down'], { size: 27 });
  const clTiles = [9, 17, 35, 53].map((z, i) => { const g = G(h3); tr(g, 404, 48 + i * 52); miniTile(g, z, 42, LIME); return g; });
  const clArrow = arrow(h3, 456, 30, 456, 224, { color: LIME, width: 6 });
  // 4. too posh to react: a crowned noble gas with a full outer shell
  const h4 = hookCard(3);
  T(h4, 30, 66, 'Noble gases are', { size: 28, weight: 600, fill: C.muted });
  rich(h4, 30, 108, ['too ', ['posh', Y, 800], ' to react'], { size: 36, weight: 700 });
  const fullNote = G(h4);
  T(fullNote, 30, 170, 'their outer shell is', { size: 27, weight: 600, fill: C.muted });
  rich(fullNote, 30, 208, [['full', Y, 800], ', not empty'], { size: 30, weight: 700 });
  const neG = G(h4); tr(neG, 432, 152);
  const ne = shellAtom(neG, { z: 10, radii: [26, 48], er: 8, nucleus: 'dot', nucR: 11 });
  const crown = G(h4);
  E('path', { d: 'M-30,12 L-34,-20 L-16,-4 L0,-28 L16,-4 L34,-20 L30,12 Z', fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, crown);
  [[-34, -20], [0, -28], [34, -20]].forEach(([x, yy]) => E('circle', { cx: x, cy: yy, r: 4.5, fill: C.lactic }, crown));
  const hookCards = [[h1, 'bus'], [h2, 'kids'], [h3, 'clowns'], [h4, 'posh']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['smaller number', 'subtract', 'opposite trends', 'down vs across', 'atomic number'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: fit([nm], 25, 200), weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    tk.firstChild.setAttribute('stroke', C.bg0);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const wt = T(g, 458, 313, wrong, { size: fit([wrong], 32, 660), weight: 600, fill: C.muted });
    const st = strike(g, 452, 302, 466 + textWidth(wrong, fit([wrong], 32, 660), FD, 600), C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g); tr(ill, 760, 540);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    trapGroup('The atomic number is the bigger number', ['atomic number = ', ['protons', Y, 800], ', the ', ['smaller', Y, 800], ' number'], g => {
      const tile = ptTile(g, 11, { size: 150 }); tr(tile, -210, 0);
      const lab = (y, ty, title, sub) => {
        E('line', { x1: -94, y1: y - 9, x2: -210 + 24, y2: ty, stroke: Y, 'stroke-width': 3 }, g);
        E('circle', { cx: -186, cy: ty, r: 5, fill: Y }, g);
        rich(g, -84, y, [[title, Y, 800], sub], { size: 27 });
      };
      lab(-44, tile.at.mass[1], 'mass number', ' = protons + neutrons');
      lab(66, tile.at.num[1], 'atomic number', ' = protons');
      return t => tile.set({ hlNum: 0.6 + 0.4 * wave(t * calm, 1.4), hlMass: 0.5 });
    }),
    trapGroup('Sodium has 23 neutrons', ['neutrons = mass number ', ['minus', Y, 800], ' atomic number'], g => {
      rich(g, 0, -4, [['23', Y, 800], ['  −  ', C.muted], ['11', RED, 800], ['  =  ', C.muted], ['12', GREY, 800]], { size: 56, anchor: 'middle' });
      const balls = [];
      for (let i = 0; i < 12; i++) { const b = E('circle', { cx: -154 + i * 28, cy: 58, r: 11.5, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g); balls.push(b); }
      T(g, 200, 66, 'neutrons', { size: 26, weight: 600, fill: GREY });
      return null;
    }),
    trapGroup('Reactivity increases down every group', [['increases', ORANGE, 800], ' down Group 1, ', ['decreases', LIME, 800], ' down Group 7'], g => {
      [[[3, 11, 19], ORANGE, 'Group 1', [44, 96, 148], -300], [[9, 17, 35], LIME, 'Group 7', [148, 96, 44], 40]].forEach(([zs, col, name, lens, x0]) => {
        rich(g, x0 - 19, -64, [[name, col, 800], ' reactivity'], { size: 26, fill: C.muted });
        zs.forEach((z, i) => {
          const tg = G(g); tr(tg, x0, -26 + i * 44); miniTile(tg, z, 40, col);
          E('rect', { x: x0 + 28, y: -26 + i * 44 - 8, width: lens[i], height: 16, rx: 8, fill: col }, g);
        });
      });
      return null;
    }),
    trapGroup('Groups are rows, periods are columns', [['groups', ORANGE, 800], ' are columns, ', ['periods', Y, 800], ' are rows'], g => {
      const x0 = -330, y0 = -56, pt = 34, NC = 7, NR = 4, CC = 2, RR = 2;      // a little table: column CC and row RR lit
      for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
        const isC = c === CC, isR = r === RR;
        E('rect', { x: x0 + c * pt, y: y0 + r * pt, width: pt - 5, height: pt - 5, rx: 6, fill: isC ? ORANGE : isR ? Y : C.card2, stroke: isC || isR ? '#FFFFFF' : C.line, 'stroke-opacity': 0.5, 'stroke-width': 1.5 }, g);
      }
      const cx = x0 + CC * pt + (pt - 5) / 2, ry = y0 + RR * pt + (pt - 5) / 2;
      arrow(g, cx, y0 - 14, cx, y0 + NR * pt + 8, { color: ORANGE, width: 5 });
      arrow(g, x0 - 16, ry, x0 + NC * pt + 14, ry, { color: Y, width: 5 });
      T(g, cx, y0 - 26, 'group', { size: 27, weight: 800, anchor: 'middle', fill: ORANGE });
      T(g, x0 + NC * pt + 26, ry + 10, 'period', { size: 27, weight: 800, fill: Y });
      rich(g, 130, -18, [['group', ORANGE, 800], ' = column ↓'], { size: 28 });
      rich(g, 130, 32, [['period', Y, 800], ' = row →'], { size: 28 });
      return null;
    }),
    trapGroup('The table is ordered by atomic mass', ['ordered by ', ['atomic number', Y, 800], ', not mass'], g => {
      const te = ptTile(g, 52, { size: 132 }), io = ptTile(g, 53, { size: 132 });
      tr(te, -250, 0); tr(io, -100, 0);
      rich(g, 0, -28, ['mass: ', ['128 then 127', RED, 800]], { size: 26, fill: C.muted });
      rich(g, 0, 50, ['atomic number: ', ['52 then 53', C.good, 800]], { size: 26, fill: C.muted });
      const tk = tick(g, 12); tr(tk, 348, 42);
      return t => { const p = 0.55 + 0.45 * wave(t * calm, 1.4); te.set({ hlNum: p }); io.set({ hlNum: p }); };
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: the shackle drops shut, a ring pulses, then it shrinks away
    const la = win(t, S.first - 0.6, at('bus') - 0.05, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.4), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.4) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.12 * P(t, at('bus') - 0.45, 0.4));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        tr(g, POS[i][0], POS[i][1] + (1 - clamp(p)) * 26);
      });
      // 2, 8, 8: the digits pop as they are said, the seats fill block by block
      digs.forEach((g, i) => { const p = P(t, mid('bus', 0.02 + i * 0.12), 0.4, pop); op(g, clamp(p * 2)); tr(g, 46 + i * 68, 62, Math.max(0.01, 0.6 + 0.4 * p)); });
      const fillAt = k => k < 2 ? mid('bus', 0.06 + k * 0.05) : k < 10 ? mid('bus', 0.18 + (k - 2) * 0.025) : mid('bus', 0.3 + (k - 10) * 0.025);
      bus.pass.forEach((p, k) => op(p, P(t, fillAt(k), 0.2, linear)));
      op(busNote, P(t, mid('bus', 0.38), 0.4, linear));
      // the alkali metals drop into their column, then the arrow
      const kT = [0.03, 0.11, 0.19, 0.26, 0.33, 0.41];
      kidsTiles.forEach((g, i) => { const p = P(t, mid('kids', kT[i]), 0.4, pop); op(g, clamp(p * 2)); tr(g, 404, 38 + i * 36 - (1 - clamp(p)) * 18, Math.max(0.01, 0.7 + 0.3 * p)); });
      kidsArrow.set(P(t, mid('kids', 0.56), 0.6)); op(kidsArrow, P(t, mid('kids', 0.56), 0.15, linear));
      op(kidsNote, P(t, mid('kids', 0.52), 0.45, linear));
      const cT = [0.03, 0.13, 0.23, 0.33];
      clTiles.forEach((g, i) => { const p = P(t, mid('clowns', cT[i]), 0.4, pop); op(g, clamp(p * 2)); tr(g, 404, 48 + i * 52 - (1 - clamp(p)) * 18, Math.max(0.01, 0.7 + 0.3 * p)); });
      clArrow.set(P(t, mid('clowns', 0.56), 0.6)); op(clArrow, P(t, mid('clowns', 0.56), 0.15, linear));
      op(clNote, P(t, mid('clowns', 0.52), 0.45, linear));
      // the posh noble gas: crown drops on, then the full outer shell glows
      ne.set({ t, orbit: S.reduce ? 3 : 16, outer: P(t, mid('posh', 0.55), 0.5, linear) * (0.8 + 0.2 * wave(t, 1.1)) });
      const cd = P(t, mid('posh', 0.18), 0.55, easeOut), bounce = Math.sin(Math.PI * P(t, mid('posh', 0.18) + 0.5, 0.35, linear)) * 5;
      op(crown, P(t, mid('posh', 0.18), 0.2, linear)); tr(crown, 432, lerp(24, 76, cd) - bounce, 1, -8 * (1 - cd) + 4 * Math.sin(t * 1.6 * calm));
      op(fullNote, P(t, mid('posh', 0.5), 0.45, linear));
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
        s.box.setAttribute('stroke', active ? Y : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? Y : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, 0.26), 0.5, easeOut));
        const rp = P(t, mid(k, 0.34), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.46), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

/* Recap: a padlock snaps shut on "Memory hooks" -> the hook cards build up: the five sign tiles light as
   Cool Guys Take Pretty Lasses, the EXIT and ENTER boards, atoms rearranging on a balance whose reading
   never changes, and the A B S W tiles -> "5 exam traps", Respiration style: each trap shows the wrong idea
   struck out and the right one ticked, with a small picture (arrow not equals, a big 2 not a changed
   subscript, gas escaping from an open tube on a balance, a nail that needs oxygen and water, a smoky
   yellow flame making carbon monoxide and soot). */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy;
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  const initials = (str, col) => str.split(/(\s+)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], Y, 800], [w.slice(1), col]] : [w]));
  const dot = (parent, r, col, dk) => E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.1) }, parent);

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(RX.gold, RX.goldDk), stroke: '#FFF1BF', 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: Y, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Memory hooks', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: one wide card, then three ---------- */
  const hooks = G(root);
  const H1 = G(hooks), H2 = G(hooks), H3 = G(hooks), H4 = G(hooks);
  card(H1, 0, 0, 1100, 262, { fill: C.card, stroke: C.line });
  [H2, H3, H4].forEach(g => card(g, 0, 0, 350, 320, { fill: C.card, stroke: C.line }));
  const HPOS = [[50, 106], [50, 392], [425, 392], [800, 392]];
  // 1. Cool Guys Take Pretty Lasses: the five signs
  const cgSegs = initials('Cool Guys Take Pretty Lasses', C.ink);
  rich(H1, 550, 56, cgSegs, { size: fit(cgSegs, 40, 900), weight: 700, anchor: 'middle' });
  const TILES = ['colour', 'gas', 'temp', 'precip', 'light'].map((k, i) => { const tl = rxSignTile(H1, k, { size: 160 }); tr(tl, 550 + (i - 2) * 182, 168); return tl; });
  // 2. EXO = EXIT, ENDO = ENTER
  const exitB = rxSignBoard(H2, 'EXO = EXIT', { size: 28 }); tr(exitB, 175, 70);
  const exitC = rich(H2, 175, 140, [['heat out', C.heat, 800], ', so hotter'], { size: 28, anchor: 'middle' });
  const enterB = rxSignBoard(H2, 'ENDO = ENTER', { size: 28, kind: 'enter' }); tr(enterB, 175, 202);
  const enterC = rich(H2, 175, 272, [['heat in', C.water, 800], ', so colder'], { size: 28, anchor: 'middle' });
  // 3. atoms can't hide, and can't die
  T(H3, 24, 50, 'Atoms can’t hide,', { size: 30, weight: 700 });
  T(H3, 24, 86, 'and can’t die', { size: 30, weight: 700 });
  const sameTxt = rich(H3, 24, 128, [['products', C.good, 800], ' = ', ['reactants', C.water, 800]], { size: 26 });
  const balG = G(H3); tr(balG, 175, 226, 0.66);
  const bal = rxBalance(balG); bal.set({ reading: 50 });
  // 2H2 + O2 -> 2H2O: six atoms change partners on the pan
  const AT = [
    { s: 'H', a: [104, 206], b: [112, 208] }, { s: 'H', a: [122, 206], b: [148, 208] },
    { s: 'H', a: [104, 180], b: [190, 208] }, { s: 'H', a: [122, 180], b: [226, 208] },
    { s: 'O', a: [196, 194], b: [130, 194] }, { s: 'O', a: [222, 194], b: [208, 194] },
  ].map(o => { o.g = rxAtom(H3, o.s, o.s === 'H' ? 9 : 14, { letter: o.s === 'O' }); return o; });
  const sameTk = G(H3); const stk = tick(sameTk, 11); tr(stk, 318, 268);
  // 4. acid + base -> salt + water, A B S W
  rich(H4, 175, 56, [['acid', '#FF8C8C', 800], ' + ', ['base', '#8FB8FF', 800], ' → ', ['salt', C.ink, 800], ' + ', ['water', C.water, 800]], { size: fit(['acid + base → salt + water'], 27, 310), anchor: 'middle' });
  const ABSW = [['A', C.bad], ['B', '#3F8FE8'], ['S', '#E6ECF0'], ['W', C.water]].map(([L, col], i) => {
    const g = G(H4);
    E('rect', { x: -30, y: -30, width: 60, height: 60, rx: 12, fill: col, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    T(g, 0, 13, L, { size: 38, weight: 700, anchor: 'middle', fill: L === 'S' ? C.bg0 : '#FFFFFF' });
    return { g, x: 175 + (i - 1.5) * 86 };
  });
  const ops = G(H4);
  [['+', 0.5], ['→', 1.5], ['+', 2.5]].forEach(([s, k]) => T(ops, 175 + (k - 1.5) * 86, 160, s, { size: 32, weight: 700, anchor: 'middle', fill: C.muted }));
  T(H4, 175, 238, 'neutralisation', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  rich(H4, 175, 282, [['A', Y, 800], 'cid, ', ['B', Y, 800], 'ase, ', ['S', Y, 800], 'alt, ', ['W', Y, 800], 'ater'], { size: 26, anchor: 'middle' });
  const hookCards = [[H1, 'cgtpl'], [H2, 'exo'], [H3, 'hide'], [H4, 'absw']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['arrow, not =', 'big numbers', 'gas escaped', 'oxygen + water', 'carbon monoxide'];
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
  /* wrong: plain text or a formula string (formula: true); right: rich segments or a formula string */
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    let wt, sw;
    if (wrong.formula) { wt = rxFormula(g, 458, 313, wrong.formula, { size: 32, fill: C.muted, anchor: 'start', coef: C.muted }); sw = wt.w || 300; }
    else { wt = T(g, 458, 313, wrong, { size: 32, weight: 600, fill: C.muted }); sw = textWidth(wrong, 32, FD, 600); }
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    if (right.formula) rxFormula(rg, 458, 414, right.formula, { size: 38, anchor: 'start', weight: 700 });
    else rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    // 1. an arrow, never an equals sign
    trapGroup({ formula: 'C + O2 = CO2' }, { formula: 'C + O2 → CO2' }, g => {
      const ar = arrow(g, 560, 528, 680, 528, { color: C.good, width: 9 });
      const at1 = tick(g, 14); tr(at1, 720, 526);
      T(g, 620, 596, 'turns into', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
      T(g, 900, 552, '=', { size: 90, weight: 700, anchor: 'middle', fill: C.muted });
      const x1 = cross(g, 30); tr(x1, 900, 526);
      T(g, 900, 596, 'not “equals”', { size: 28, weight: 700, anchor: 'middle', fill: C.bad });
      return t => ar.set(1);
    }),
    // 2. big numbers in front; never change a subscript
    trapGroup({ formula: 'H2 + O2 → H2O2' }, { formula: '2H2 + O2 → 2H2O' }, g => {
      const f1 = rxFormula(g, 640, 540, '2H2O', { size: 52, anchor: 'middle', weight: 700 });
      const tk1 = tick(g, 14); tr(tk1, 640 + (f1.w || 110) / 2 + 30, 524);
      T(g, 640, 600, 'two water molecules', { size: 26, weight: 600, anchor: 'middle', fill: C.good });
      const f2 = rxFormula(g, 900, 540, 'H2O2', { size: 52, anchor: 'middle', weight: 700, fill: '#FFB3B3' });
      const w2 = f2.w || 110;
      E('ellipse', { cx: 900 + w2 / 2 - 9, cy: 548, rx: 18, ry: 22, fill: 'none', stroke: C.bad, 'stroke-width': 4 }, g);
      const x2 = cross(g, 12); tr(x2, 900 + w2 / 2 + 34, 524);
      T(g, 900, 600, 'a bleach, not water!', { size: 26, weight: 600, anchor: 'middle', fill: C.bad });
      return null;
    }),
    // 3. mass is never destroyed: gas escaped from an open tube
    trapGroup('Mass was destroyed', ['Mass seems to drop: a ', ['gas escaped', Y, 800]], g => {
      const bg = G(g); tr(bg, 880, 553, 0.66);
      const b = rxBalance(bg);
      const rack = G(g); tr(rack, 868, 553);
      E('rect', { x: -40, y: -24, width: 80, height: 24, rx: 5, fill: '#6B5A48', stroke: '#9C8670', 'stroke-width': 2 }, rack);
      const tube = testTube(g, 34, 104, { level: 0.42, liquid: '#9FD8FF' }); tr(tube, 868, 497);
      const bub = bubbles(g, 856, 500, 24, 44, { n: 5, r: 4, speed: 0.6, seed: 13 });
      const gas = [0, 1, 2].map(() => molCO2(g, 8));
      T(g, 640, 486, 'carbon dioxide', { size: 26, weight: 700, anchor: 'middle', fill: C.co2 });
      T(g, 640, 518, 'escapes into the air', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
      const ga = arrow(g, 742, 476, 840, 452, { color: C.muted, width: 4, head: 12 });
      const dn = arrow(g, 1080, 530, 1080, 600, { color: C.bad, width: 6 });
      T(g, 1080, 518, 'lighter', { size: 26, weight: 700, anchor: 'middle', fill: C.bad });
      return t => {
        const t0 = at('t3');
        bub.upd(t, 1);
        gas.forEach((m, k) => { const q = ((t - t0) * 0.5 + k / 3) % 1; tr(m, 872 + q * 110, 446 - q * 6 + Math.sin(q * 6 + k) * 3 * calm, 1, q * 90); op(m, Math.sin(q * Math.PI) * 0.95); });
        b.set({ reading: 20 - 0.44 * P(t, mid('t3', 0.45), 2.4, linear) });
        ga.set(1); dn.set(P(t, mid('t3', 0.6), 0.6));
      };
    }),
    // 4. iron needs oxygen and water to rust
    trapGroup('Iron rusts in dry air', ['Rust needs ', ['oxygen', Y, 800], ' and ', ['water', Y, 800]], g => {
      const nail = rxNail(g, 210, { seed: 29 }); tr(nail, 760, 530, 1, 90);
      const o2 = molO2(g, 15); tr(o2, 562, 520);
      T(g, 562, 586, 'oxygen', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
      const tk1 = tick(g, 12); tr(tk1, 616, 520);
      const drop = G(g); tr(drop, 958, 520);
      E('path', { d: 'M0,-26 C12,-8 18,4 18,12 A18,18 0 0 1 -18,12 C-18,4 -12,-8 0,-26 Z', fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 2 }, drop);
      T(g, 958, 586, 'water', { size: 28, weight: 700, anchor: 'middle', fill: C.water });
      const tk2 = tick(g, 12); tr(tk2, 1006, 520);
      return t => nail.set({ rust: P(t, mid('t4', 0.5), 2.2, linear) });
    }),
    // 5. incomplete combustion: carbon monoxide and soot
    trapGroup({ formula: 'Incomplete combustion → CO2' }, ['It makes carbon ', ['monoxide', Y, 800], ' and ', ['soot', Y, 800]], g => {
      const fl = rxFlame(g, 0.82); tr(fl, 600, 618); fl.set('yellow', 1);
      const soot = [0, 1, 2, 3, 4].map(k => E('circle', { r: 6 + (k % 3) * 2, fill: RX.soot, stroke: '#5A6068', 'stroke-width': 1.5 }, g));
      T(g, 712, 470, 'soot', { size: 28, weight: 700, anchor: 'middle', fill: '#C9D0D6' });
      const co = rxMol(g, 'CO', { r: 18 }); tr(co, 880, 520);
      rich(g, 880, 584, ['carbon ', ['monoxide', Y, 800]], { size: 28, anchor: 'middle' });
      T(g, 880, 618, 'toxic, no colour, no smell', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
      return t => {
        fl.upd(t * calm + 0.5);
        soot.forEach((s, k) => { const q = ((t * 0.45) + k / 5) % 1; attr(s, 'cx', 612 + q * 90 + Math.sin(q * 6 + k) * 5); attr(s, 'cy', 508 - q * 30); op(s, Math.sin(q * Math.PI) * 0.9); });
        tr(co, 880, 520 + 4 * Math.sin(t * 1.6) * calm, 1, 6 * Math.sin(t * 0.9) * calm);
      };
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: the shackle drops shut and a ring pulses
    const la = win(t, S.first - 0.6, at('cgtpl') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('cgtpl') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        tr(g, HPOS[i][0], HPOS[i][1] + (1 - clamp(p)) * 26);
      });
      TILES.forEach((tl, i) => tl.set({ letter: P(t, mid('cgtpl', 0.06 + i * 0.075), 0.3, linear), lit: P(t, mid('cgtpl', 0.5 + i * 0.095), 0.3, linear) }));
      op(exitB, fade(t, mid('exo', 0.02))); op(exitC, fade(t, mid('exo', 0.22)));
      op(enterB, fade(t, mid('exo', 0.5))); op(enterC, fade(t, mid('exo', 0.72)));
      const rq = P(t, mid('hide', 0.22), 1.3);
      AT.forEach(o => tr(o.g, lerp(o.a[0], o.b[0], rq), lerp(o.a[1], o.b[1], rq) - Math.sin(rq * Math.PI) * (o.s === 'H' ? 22 : 12)));
      bal.set({ reading: 50, flash: Math.sin(Math.PI * clamp((t - mid('hide', 0.22)) / 1.8)) });
      op(sameTxt, fade(t, mid('hide', 0.5))); const sk = P(t, mid('hide', 0.62), 0.45, pop); op(sameTk, clamp(sk * 2)); tr(stk, 318, 268, Math.max(0.01, sk));
      ABSW.forEach((o, i) => { const p = P(t, mid('absw', 0.08 + i * 0.16), 0.45, pop); op(o.g, clamp(p * 2)); tr(o.g, o.x, 150 - (1 - clamp(p)) * 40); });
      op(ops, fade(t, mid('absw', 0.1)));
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
        _rxW(s.box, 'stroke', active ? Y : C.line); _rxW(s.box, 'fill', active ? C.card2 : C.card);
        _rxW(s.disc, 'fill', done ? C.good : active ? Y : C.card2);
        _rxW(s.num, 'fill', active ? C.bg0 : C.ink);
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
        const ip = P(t, mid(k, 0.52), 0.55, pop); op(g.ill, clamp(ip * 2));
        g.ill.setAttribute('transform', `translate(760 540) scale(${(0.85 + 0.15 * clamp(ip)).toFixed(3)}) translate(-760 -540)`);
        g.anim(t);
      });
    }
  };
});

/* Quick-fire quiz: five question cards. Each question shows its picture (the three options; a sealed flask
   on a balance; 2H2O; a frosty test tube in a hand; the catalyst, "used up?"), a countdown ring runs through
   the silent thinking time, then the answer appears and the picture shows it (the nail rusts; the readout
   holds at 50.00 g; two water molecules with their four H atoms glowing; heat flows in and the thermometer
   falls; the catalyst still weighs 2.00 g). A progress dot fills for each answer.
   Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  // a cube drawn in 3D, centred, 2s tall (ice blue, or sugar white)
  function cube3d(parent, s, cols) {
    const g = G(parent), k = s * 0.87;
    E('path', { d: `M${-k},${-s * 0.5} L0,0 L0,${s} L${-k},${s * 0.5} Z`, fill: cols[0], stroke: cols[3], 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,0 L${k},${-s * 0.5} L${k},${s * 0.5} L0,${s} Z`, fill: cols[1], stroke: cols[3], 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,${-s} L${k},${-s * 0.5} L0,0 L${-k},${-s * 0.5} Z`, fill: cols[2], stroke: cols[3], 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function frost(parent, x, y, s) {
    return E('path', { d: `M${x},${y - s} L${x + s * 0.25},${y - s * 0.25} L${x + s},${y} L${x + s * 0.25},${y + s * 0.25} L${x},${y + s} L${x - s * 0.25},${y + s * 0.25} L${x - s},${y} L${x - s * 0.25},${y - s * 0.25} Z`, fill: '#EAF8FF' }, parent);
  }
  function tickBadge(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: C.good, stroke: C.bg0, 'stroke-width': 4 }, g);
    tick(g, r * 0.45, C.bg0);
    return g;
  }

  /* ---------- progress dots: big under the title in the intro, then up in the top right ---------- */
  const dotsG = G(root);
  const dots = [0, 1, 2, 3, 4].map(k => {
    const g = G(dotsG);
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

  /* ---------- pictures: each draws around (0,0) = (300, 556) and returns an update(t) ---------- */
  function picOptions(g) {
    const ice = G(g); tr(ice, -112, -14); cube3d(ice, 32, ['#A9DDF6', '#7FC4EA', '#E4F6FF', '#E8F7FF']);
    const sug = G(g); tr(sug, 0, -14); cube3d(sug, 30, ['#E9EEF2', '#C9D3DA', '#FFFFFF', '#FFFFFF']);
    const nl = rxNail(g, 140, { seed: 3 }); tr(nl, 112, -14, 1, 18);
    const labs = [['ice', -112], ['sugar', 0], ['iron', 112]].map(([s, x]) => T(g, x, 86, s, { size: 30, weight: 700, anchor: 'middle' }));
    const x1 = cross(g, 22); tr(x1, -112, -14); const x2 = cross(g, 22); tr(x2, 0, -14);
    const ironOk = T(g, 112, 86, 'iron', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
    return t => {
      const a = P(t, at('a1') - 0.05, 0.5, linear);
      op(ice, 1 - 0.7 * a); op(sug, 1 - 0.7 * a); op(labs[0], 1 - 0.6 * a); op(labs[1], 1 - 0.6 * a);
      op(labs[2], 1 - a); op(ironOk, a);
      const xp = P(t, at('a1') + 0.1, 0.4, pop); op(x1, clamp(xp * 2)); op(x2, clamp(xp * 2));
      nl.set({ rust: P(t, at('a1') + 0.1, 1.5, linear) });
      tr(nl, 112, -14, 1 + 0.1 * a, 18);
    };
  }
  function picSealed(g) {
    const balG = G(g); tr(balG, 0, 52, 0.8);
    const bal = rxBalance(balG, { w: 300 }); bal.set({ reading: 50 });
    const fl = flask(g, 0.7, { level: 0, liquid: C.air }); tr(fl, 0, 52 - 64.5);
    const mg = E('path', { d: 'M-34,46 l10,-9 l10,9 l10,-9 l10,9 l10,-9 l10,9', fill: 'none', stroke: '#C9D3DB', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const ash = E('path', { d: 'M-40,52 Q-26,30 0,28 Q26,30 40,52 Z', fill: RX.mgOxide, stroke: '#C9D3DA', 'stroke-width': 2 }, g);
    rxBung(fl, 0.7);
    const flash = E('circle', { cx: 0, cy: 10, r: 80, fill: glow('#FFFFFF') }, g);
    const sp = spark(g, 20, { seed: 4, color: '#FFFFFF' }); tr(sp, 0, 30);
    T(g, 0, -118, 'sealed', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
    const tb = tickBadge(g, 22); tr(tb, 132, 30);
    return t => {
      const b = P(t, at('a2') - 0.25, 1.0, linear), f = Math.sin(Math.PI * b);
      op(flash, f); op(sp, f); tr(sp, 0, 30, Math.max(0.01, 0.4 + 0.8 * f)); sp.upd(t);
      op(mg, 1 - P(b, 0.4, 0.3, linear)); op(ash, P(b, 0.5, 0.4, linear));
      bal.set({ reading: 50, flash: 0.9 * Math.sin(Math.PI * P(t, at('a2') + 0.3, 1.0, linear)) });
      const tp = P(t, at('a2') + 0.6, 0.4, pop); op(tb, clamp(tp * 2)); tr(tb, 132, 30, Math.max(0.01, tp));
    };
  }
  function picFormula(g) {
    const fm = rxFormula(g, 0, 10, '2H2O', { size: 96, weight: 700 });
    const MX = [-82, 82], MY = 98;
    const mols = MX.map(x => { const m = rxMol(g, 'H2O', { r: 30 }); tr(m, x, MY); return m; });
    const glows = [];
    mols.forEach((m, i) => m.atoms.forEach(a => { if (a.sym === 'H') { const h = E('circle', { cx: MX[i] + a.x, cy: MY + a.y, r: 40, fill: glow(C.energy) }, g); g.insertBefore(h, g.firstChild); glows.push(h); } }));
    return t => {
      const mp = P(t, at('a3') - 0.05, 0.5, pop);
      mols.forEach((m, i) => { op(m, clamp(mp * 2)); tr(m, MX[i], MY + (1 - clamp(mp)) * 16); });
      tr(fm, 0, -14 * clamp(mp));
      glows.forEach((h, k) => op(h, P(t, at('a3') + 0.5 + k * 0.25, 0.3, linear) * (0.8 + 0.2 * wave(t * calm, 1.1, k * 0.2))));
    };
  }
  function picCold(g) {
    const tb = testTube(g, 62, 210, { level: 0.6, liquid: '#9FD8FF', opacity: 0.55 }); tr(tb, 10, -6);
    const fr = G(g);
    [[-12, -60, 8], [26, -30, 7], [-10, 10, 6], [28, 40, 8], [-6, 70, 6], [18, -84, 5]].forEach(([x, y, s]) => frost(fr, x + 10, y, s));
    const hand = G(g), sk = ball('#E8B48E', '#B9825A');
    E('rect', { x: -78, y: 10, width: 60, height: 92, rx: 26, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, hand);
    [18, 38, 58, 78].forEach((y, k) => E('rect', { x: -34, y: y - 8, width: k === 3 ? 66 : 76, height: 18, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, hand));
    E('rect', { x: -40, y: -14, width: 54, height: 18, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2, transform: 'rotate(-20 -40 -5)' }, hand);
    const brr = T(g, -100, -54, 'cold!', { size: 30, weight: 700, anchor: 'middle', fill: '#BFE9FA' });
    const heatIn = G(g);
    arrow(heatIn, -96, -40, -30, -40, { color: C.heat, width: 6, head: 16 });
    arrow(heatIn, -96, -8, -30, -8, { color: C.heat, width: 6, head: 16 });
    T(heatIn, -84, -66, 'heat in', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
    const thG = G(g); tr(thG, 124, 92);
    const th = thermometer(thG, 170, C.water);
    return t => {
      op(fr, 0.7 + 0.3 * wave(t * calm, 2.2)); op(brr, P(t, mid('q4', 0.5), 0.4, linear) * (1 - P(t, at('a4') - 0.1, 0.3, linear)));
      const a = P(t, at('a4') - 0.05, 0.5, linear);
      op(heatIn, a * (0.65 + 0.35 * wave(t * calm, 0.9)));
      op(thG, a); th.set(0.55 - 0.42 * P(t, at('a4') + 0.2, 1.6, ease));
    };
  }
  function picCatalyst(g) {
    const balG = G(g); tr(balG, 0, 52, 0.75);
    const bal = rxBalance(balG, { w: 300 }); bal.set({ reading: 2, dp: 2 });
    const cat = rxCatalyst(g, 1.15);
    const lab = T(g, 0, 70, 'catalyst', { size: 30, weight: 700, anchor: 'middle', fill: RX.gold });
    const used = chip(g, 'used up?', { size: 30, fill: C.card2, stroke: Y, color: Y }); tr(used, 0, 126);
    const tb = tickBadge(g, 22); tr(tb, 132, 34);
    const same = T(g, 0, -86, 'still 2.00 g', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
    return t => {
      cat.set({ glow: 0.45 + 0.25 * wave(t * calm, 1.6) });
      const a = P(t, at('a5') - 0.05, 0.8, ease);
      op(balG, a); tr(balG, 0, 52 + (1 - a) * 40, 0.75);
      tr(cat, 0, lerp(-6, 52 - 37, a), 1, 0);
      op(lab, 1 - a); op(used, 1 - P(t, at('a5') - 0.1, 0.3, linear));
      const tp = P(t, at('a5') + 0.8, 0.4, pop); op(tb, clamp(tp * 2)); tr(tb, 132, 34, Math.max(0.01, tp));
      op(same, P(t, at('a5') + 0.9, 0.4, linear));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: ['Which is a chemical change: ice melting,', 'sugar dissolving, or iron rusting?'], a: [[['Iron rusting.', Y, 800]], [['It makes a new substance:', C.ink]], [['rust', RX.rustLt, 800], ['.', C.ink]]], pic: picOptions, small: true },
    { q: ['Magnesium burns in a sealed container.', 'What happens to the total mass?'], a: [[['It ', C.ink], ['stays the same', Y, 800], ['.', C.ink]], [['Nothing can get in or out.', C.ink]]], pic: picSealed },
    { q: ['How many hydrogen atoms are there in', null], f: '2H2O', a: [[['Four', Y, 800], [':', C.ink]], [['two water molecules,', C.ink]], [['each with two hydrogen atoms.', C.ink]]], pic: picFormula, small: true },
    { q: ['A reaction makes a test tube feel cold.', 'Is it exothermic or endothermic?'], a: [[['Endothermic', C.water, 800], [':', C.ink]], [['it’s taking in heat', C.ink]], [['from its surroundings.', C.ink]]], pic: picCold, small: true },
    { q: ['True or false: a catalyst gets', 'used up in a reaction.'], a: [[['False.', C.bad, 800]], [['It speeds the reaction up,', C.ink]], [['and is left unchanged.', C.ink]]], pic: picCatalyst, small: true },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 250, d.q[0], { size: 42, weight: 700, anchor: 'middle' });
    if (d.q[1]) T(qc, 600, 304, d.q[1], { size: 42, weight: 700, anchor: 'middle' });
    else {
      const qm = textWidth('?', 46, FD, 700), fm = rxFormula(qc, 0, 308, d.f, { size: 48, weight: 700, anchor: 'start' });
      const w = (fm.w || 100) + qm + 4;
      fm.setAttribute('x', (600 - w / 2).toFixed(1));
      T(qc, 600 - w / 2 + (fm.w || 100) + 4, 308, '?', { size: 46, weight: 700 });
    }
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const pic = G(g); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 36 : 40, lh = d.small ? 46 : 52, y0 = d.small ? 514 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, pic, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  const TEXT_BOX = [[300, 240, 900, 350], [180, 362, 1020, 420], [340, 458, 860, 522], [500, 538, 700, 590]];
  for (let k = 0; k < 14; k++) {
    const s = spark(burst, 12 + br() * 10, { seed: k }), a = (k / 14) * TAU + br() * 0.3, d = 200 + br() * 120;
    const x = 600 + Math.cos(a) * d * 1.5, y = 300 + Math.sin(a) * d * 0.85, m = 40;
    const clear = x > 60 && x < 1140 && y > 110 && y < 690 && TEXT_BOX.every(([x0, y0, x1, y1]) => x + m < x0 || x - m > x1 || y + m < y0 || y - m > y1);
    sparks.push({ s, a, d, dl: br() * 0.4, stay: clear });
  }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Chemical Reactions quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Chemical Reactions  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);
  const lockT = rich(outro, 600, 572, [['to ', C.muted], ['lock it in', Y, 800]], { size: 30, anchor: 'middle' });

  /* ---------- update ---------- */
  return t => {
    // progress dots: big and empty under the title, then up to the corner; each fills as its answer
    // arrives; the current question's dot grows; all five cheer at the outro
    op(dotsG, P(t, mid('intro', 0.25), 0.5, linear));
    const up = P(t, end('intro') - 0.1, 0.7, ease);
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      const cheer = Math.sin(Math.PI * P(t, at('outro') + i * 0.12, 0.45, linear));
      const pi = P(t, mid('intro', 0.28 + i * 0.065), 0.45, pop);
      const x = lerp(600 + (i - 2) * 76, 984 + i * 42, up), y = lerp(512, 58, up);
      const s = lerp(1.7, 1, up) * (cur ? 1.18 + 0.06 * wave(t, 1) : 1 + 0.35 * cheer) * Math.max(0.01, clamp(pi));
      tr(d.g, x, y, s);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.15, 0.3);
    op(intro, ia);
    if (ia > 0) tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.15, nx - 0.15, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const pp = P(t, tq + 0.2, 0.5, pop);
      op(q.pic, clamp(pp * 2)); tr(q.pic, 300, 556 + (1 - clamp(pp)) * 20);
      q.anim(t);
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
    });

    // outro: the sparks fly out; the ones clear of the text stay and twinkle
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4), d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI * (o.stay ? 0.5 : 1)));
        op(o.s, u <= 0 ? 0 : o.stay ? Math.min(1, u * 3) * (0.7 + 0.3 * wave(t, 1.3, o.a)) : Math.sin(Math.min(1, u) * Math.PI) * 0.95);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.45), 0.5, linear));
      op(lockT, P(t, mid('outro', 0.8), 0.5, linear));
    }
  };
});

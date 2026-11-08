/* Quick-fire quiz: five question cards, as in the Respiration quiz. Each question shows a small clue
   picture beside a countdown ring that runs through the thinking time; then the answer appears, the
   picture shows why, and a progress dot fills. Outro: "Brilliant work!", all five dots full, sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, LIME = PT_FAMILY_COL.halogen, LIME_DK = '#6E9A1F';

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function crown(parent) {
    const g = G(parent);
    E('path', { d: 'M-32,10 L-36,-20 L-18,-6 L0,-28 L18,-6 L36,-20 L32,10 Z', fill: ball('#FFD54A', '#C48A0C'), stroke: '#FFF0A8', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -33, y: 6, width: 66, height: 11, rx: 4, fill: '#E5AE1F', stroke: '#FFF0A8', 'stroke-width': 2 }, g);
    E('path', { d: 'M0,-34 a5,5 0 1,0 0.1,0 Z M-36,-26 a4,4 0 1,0 0.1,0 Z M36,-26 a4,4 0 1,0 0.1,0 Z', fill: '#FF6B8A', stroke: '#FFC2CF', 'stroke-width': 1.5 }, g);
    return g;
  }

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
  const introTiles = [11, 9, 2].map((z, k) => { const g = G(intro); const t = ptTile(g, z, { size: 96 }); t.set({ mass: 0, num: 0, name: 0 }); return { g, x: 480 + k * 120 }; });

  /* ---------- the clue pictures (they become the answers' pictures) ---------- */
  // 1. sodium's tile: 23 at the top, 11 at the bottom
  function picTile(g) {
    const tl = ptTile(g, 11, { size: 190 });
    return t => tl.set({ hlMass: P(t, mid('q1', 0.16), 0.5, linear), hlNum: P(t, mid('q1', 0.41), 0.5, linear) });
  }
  // 2. a small table with Group 1 lit, then lithium, sodium and potassium with one outer electron each
  function picGroup(g) {
    const tab = G(g); let dAll = '', dG1 = '';
    for (let z = 1; z <= 118; z++) {
      const e = ptElement(z); if (!e.col) continue;
      const x = -144 + (e.col - 1) * 16, y = -60 + (e.period - 1) * 16, sq = `M${x},${y} h13 v13 h-13 Z `;
      if (e.col === 1 && z !== 1) dG1 += sq; else dAll += sq;
    }
    E('path', { d: dAll, fill: C.card2, stroke: C.line, 'stroke-width': 1 }, tab);
    const g1 = E('path', { d: dG1, fill: C.heat, stroke: '#FFD2B0', 'stroke-width': 1.5 }, tab);
    const tabL = T(tab, -136, 86, 'one group', { size: 26, weight: 700, fill: C.heat });
    const ats = [[3, -114, [13, 25]], [11, -22, [13, 25, 37]], [19, 92, [13, 25, 37, 49]]].map(([z, x, R]) => {
      const a = G(g); tr(a, x, 0);
      const at_ = shellAtom(a, { z, radii: R, er: 4.6, nucleus: 'dot', nucR: 7 });
      T(a, 0, 86, PT_SYM[z - 1], { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
      return { a, at_, x };
    });
    return t => {
      const sw = P(t, at('a2') - 0.1, 0.5, linear);
      op(tab, 1 - sw); op(g1, 0.75 + 0.25 * wave(t, 1.1));
      ats.forEach((o, k) => {
        const p = P(t, at('a2') + k * 0.15, 0.5, pop);
        op(o.a, clamp(p * 2)); tr(o.a, o.x, 0, Math.max(0.01, 0.8 + 0.2 * p));
        o.at_.set({ outer: P(t, mid('a2', 0.4), 0.5, linear), t, orbit: 20 * calm });
      });
      op(tabL, 1 - sw);
    };
  }
  // 3. sodium on water with universal indicator: fizz, hydrogen, purple
  function picWater(g) {
    const bk = beaker(g, 250, 150, { level: 0.62, liquid: '#5BD27A', opacity: 0.8 }); tr(bk, 0, 10);
    const surf = 10 + 75 - (150 - 18) * 0.62;          // water surface, beaker coordinates
    const bs = bubbles(g, -60, surf - 54, 120, 50, { n: 7, r: 6, seed: 4, speed: 0.8 });
    const na = G(g);
    E('ellipse', { rx: 17, ry: 12, fill: ball('#E4ECF2', '#8F9CAB'), stroke: '#FFFFFF', 'stroke-width': 1.5 }, na);
    const h2 = G(g);
    E('path', { d: 'M-44,-80 L-16,-48', stroke: C.muted, 'stroke-width': 2.5 }, h2);
    E('circle', { cx: -16, cy: -48, r: 4.5, fill: C.muted }, h2);
    T(h2, -50, -86, 'hydrogen', { size: 28, weight: 700, anchor: 'end', fill: '#FFFFFF' });
    const alk = T(g, 0, 128, 'alkaline', { size: 28, weight: 700, anchor: 'middle', fill: '#B48CFF' });
    return t => {
      const x = Math.sin(t * 1.9 * calm) * 70, y = surf - 4 + Math.sin(t * 5 * calm) * 1.5;
      tr(na, x, y);
      tr(bs, x * 0.6, 0); bs.upd(t * calm, 0.6 + 0.4 * P(t, at('a3'), 0.5, linear));
      const pu = P(t, at('a3') + 0.2, 1.6, ease);
      bk.liquid.setAttribute('fill', _ptMix('#5BD27A', '#8E5BD6', pu));
      op(h2, P(t, at('a3'), 0.4, linear)); op(alk, P(t, mid('a3', 0.78), 0.4, linear));
    };
  }
  // 4. Mendeleev's gap below silicon; germanium drops in
  function picGap(g) {
    const si = ptTile(g, 14, { size: 112 }); tr(si, 0, -68);
    const gap = G(g); tr(gap, 0, 56);
    E('rect', { x: -56, y: -56, width: 112, height: 112, rx: 11, fill: 'rgba(242,193,78,0.08)', stroke: '#F2C14E', 'stroke-width': 3, 'stroke-dasharray': '9 7' }, gap);
    const qm = T(gap, 0, 22, '?', { size: 64, weight: 700, anchor: 'middle', fill: '#F2C14E' });
    const geGlow = E('circle', { cx: 0, cy: 56, r: 100, fill: glow('#F2C14E') }, g);
    const ge = ptTile(g, 32, { size: 112 });
    const tk = tick(g, 16, C.good);
    return t => {
      op(qm, 0.55 + 0.45 * wave(t, 1.2));
      const d = P(t, mid('a4', 0.68), 0.6, pop);
      op(ge, clamp(d * 2)); tr(ge, 0, 56, Math.max(0.01, d));
      op(geGlow, Math.sin(Math.PI * P(t, mid('a4', 0.68), 1.2, linear)));
      op(gap, 1 - P(t, mid('a4', 0.68) + 0.3, 0.2, linear));
      const tp = P(t, mid('a4', 0.9), 0.4, pop); op(tk, clamp(tp * 2)); tr(tk, 92, 56, Math.max(0.01, tp));
    };
  }
  // 5. the Group 7 column: a question mark, then the answer, fluorine crowned
  function picColumn(g) {
    const ts = [9, 17, 35, 53].map((z, k) => { const tl = ptTile(g, z, { size: 58, color: LIME }); tl.set({ mass: 0, num: 0, name: 0 }); tr(tl, -70, -96 + k * 66); return tl; });
    const qa = G(g);
    arrow(qa, 20, -120, 20, 112, { color: C.muted, width: 6 });
    T(qa, 66, 18, '?', { size: 64, weight: 700, anchor: 'middle', fill: C.muted });
    const wd = G(g);
    const body = E('path', { fill: LIME, stroke: LIME, 'stroke-width': 2, 'stroke-linejoin': 'round' }, wd);
    const cr = crown(g);
    return t => {
      const a = P(t, at('a5') - 0.05, 0.4, linear);
      op(qa, 1 - a); op(wd, a);
      const p = clamp(P(t, at('a5'), 0.9)), y0 = -126, y1 = y0 + 248 * Math.max(p, 0.01), yb = Math.max(y0, y1 - 30);
      const w = lerp(40, 10, (yb - y0) / 218), hw = (w / 2 + 12) * clamp((y1 - y0) / 30);
      body.setAttribute('d', `M0,${y0} L40,${y0} L${20 + w / 2},${yb.toFixed(1)} L${(20 + hw).toFixed(1)},${yb.toFixed(1)} L20,${y1.toFixed(1)} L${(20 - hw).toFixed(1)},${yb.toFixed(1)} L${20 - w / 2},${yb.toFixed(1)} Z`);
      const cp = P(t, mid('a5', 0.44), 0.5, pop);
      op(cr, clamp(cp * 2)); tr(cr, -70, -140 - (1 - clamp(cp)) * 30, 0.62);
      ts.forEach((tl, k) => tr(tl, -70, -96 + k * 66, k === 0 ? 1 + 0.08 * Math.sin(Math.PI * P(t, mid('a5', 0.46), 0.6, linear)) : 1));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'An atom has a mass number of 23 and an\natomic number of 11. How many neutrons\ndoes it have?', a: [[['Twelve', Y, 800], [' neutrons', C.ink]], [['23 − 11 = 12', C.ink]]], pic: picTile },
    { q: 'What do all the elements in one\ngroup have in common?', a: [[['The same number of', C.ink]], [['electrons in their outer shell', Y, 800], [',', C.ink]], [['so similar properties.', C.ink]]], pic: picGroup, small: true },
    { q: 'Which gas is given off when\nsodium reacts with water?', a: [[['Hydrogen', Y, 800], [', and the', C.ink]], [['solution left behind', C.ink]], [['is ', C.ink], ['alkaline', '#B48CFF', 800], ['.', C.ink]]], pic: picWater, small: true },
    { q: 'Why did Mendeleev leave\ngaps in his table?', a: [[['For elements ', C.ink], ['not yet', Y, 800]], [['discovered', Y, 800], ['. He ', C.ink], ['predicted', Y, 800]], [['their properties,', C.ink]], [['and he was right!', C.ink]]], pic: picGap, small: true },
    { q: 'True or false: reactivity increases\nas you go down Group 7.', a: [[['False.', C.bad, 800], [' It ', C.ink], ['decreases', LIME, 800], ['.', C.ink]], [['Fluorine', Y, 800], [' is the most', C.ink]], [['reactive halogen.', C.ink]]], pic: picColumn, small: true },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const nl = d.q.split('\n').length;
    T(qc, 600, nl > 2 ? 236 : 250, d.q, { size: nl > 2 ? 38 : 42, weight: 700, anchor: 'middle', lh: nl > 2 ? 48 : 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const pic = G(g); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 34 : 40, lh = d.small ? 44 : 52, y0 = d.small ? 512 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, pic, anim, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  // the sparks whose resting place (with its glow) is clear of all the text stay, twinkling
  const TEXT_BOX = [[300, 240, 900, 350], [250, 362, 950, 420], [310, 458, 890, 522], [500, 538, 700, 590]];
  for (let k = 0; k < 14; k++) {
    const s = spark(burst, 12 + br() * 10, { seed: k }), a = (k / 14) * TAU + br() * 0.3, d = 200 + br() * 120;
    const x = 600 + Math.cos(a) * d * 1.5, y = 300 + Math.sin(a) * d * 0.85, m = 40;
    const clear = x > 60 && x < 1140 && y > 60 && TEXT_BOX.every(([x0, y0, x1, y1]) => x + m < x0 || x - m > x1 || y + m < y0 || y - m > y1);
    sparks.push({ s, a, d, dl: br() * 0.4, k, stay: clear });
  }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Periodic Table quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  The Periodic Table  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);
  const lockT = rich(outro, 600, 572, [['to ', C.muted], ['lock it in', Y, 800]], { size: 30, anchor: 'middle' });

  /* ---------- update ---------- */
  return t => {
    // progress dots: the current question's dot grows; each fills as its answer arrives; all five
    // pulse in turn at the outro
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      const cheer = Math.sin(Math.PI * P(t, at('outro') + i * 0.12, 0.45, linear));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1 + 0.35 * cheer);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.05, 0.3);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
      introTiles.forEach((o, k) => {
        const p = P(t, mid('intro', 0.3 + k * 0.1), 0.5, pop);
        op(o.g, clamp(p * 2)); tr(o.g, o.x, 540 + (1 - clamp(p)) * 24 + Math.sin(t * 1.6 * calm + k) * 5 * calm, 0.8 + 0.2 * p, (k - 1) * 6);
      });
    }

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
      const pp = P(t, tq + 0.2, 0.5, pop);
      op(q.pic, clamp(pp * 2)); tr(q.pic, 300, 556 + (1 - clamp(pp)) * 20);
      q.anim(t);
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
    });

    // outro: a burst of sparks, and some stay twinkling
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4), d = easeOut(u) * o.d, stay = o.stay;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI) + (stay ? 0.35 * u : 0));
        op(o.s, u <= 0 ? 0 : stay ? Math.max(Math.sin(Math.min(1, u) * Math.PI), u > 0.5 ? 0.7 * (0.6 + 0.4 * wave(t, 1.6, o.k * 0.13)) : 0) : Math.sin(Math.min(1, u) * Math.PI) * 0.95);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
      op(lockT, P(t, mid('outro', 0.82), 0.5, linear));
    }
  };
});

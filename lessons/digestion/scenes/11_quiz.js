/* Quick-fire quiz: five question cards, each with a picture. A countdown ring runs through the silent
   thinking time, then the answer appears, the picture shows it (Benedict's turns brick-red, lipase splits a
   fat, vitamin C and scurvy, a villus's four adaptations light up, faeces pass straight through) and a
   progress dot fills. Outro: "Brilliant work!" with a burst of sparks as all five dots glow. */
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
  /* an enzyme (as drawn in the enzymes chapter): a rounded blob with its active site at the top centre */
  const ENZ = { amy: [C.water, C.waterDk], pro: [C.lactic, C.lacticDk], lip: [C.heat, C.heatDk] };
  function enzyme(parent, kind, R) {
    const [c, dk] = ENZ[kind], g = G(parent), top = -0.55 * R, bot = 0.75 * R, n = 0.34 * R;
    let notch;
    if (kind === 'pro') notch = `A${n.toFixed(1)},${n.toFixed(1)} 0 0 0 ${n.toFixed(1)},${top.toFixed(1)}`;
    else if (kind === 'amy') { const s = n / 0.866; notch = `L${-n},${top + 0.5 * s} L0,${top + s} L${n},${top + 0.5 * s} L${n},${top}`; }
    else notch = `L${-n},${top + 0.9 * n} L${n},${top + 0.9 * n} L${n},${top}`;
    const d = `M${-n},${top} ${notch} C${0.62 * R},${top} ${R},${top + 0.1 * R} ${R},${0.1 * R} C${R},${0.55 * R} ${0.6 * R},${bot} 0,${bot} C${-0.6 * R},${bot} ${-R},${0.55 * R} ${-R},${0.1 * R} C${-R},${top + 0.1 * R} ${-0.62 * R},${top} ${-n},${top} Z`;
    E('path', { d, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(2, R * 0.07), 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: -0.45 * R, cy: 0.02 * R, rx: 0.22 * R, ry: 0.12 * R, fill: '#FFFFFF', opacity: 0.35, transform: `rotate(-24 ${-0.45 * R} ${0.02 * R})` }, g);
    return g;
  }
  /* a fatty acid: an orange zig-zag from its left end */
  function tail(parent, len) {
    const k = (len || 66) / 66;
    let d = 'M0,0'; for (let i = 1; i <= 6; i++) d += ` L${(i * 11 * k).toFixed(1)},${((i % 2 ? -5 : 5) * k).toFixed(1)}`;
    return E('path', { d, fill: 'none', stroke: '#FFB347', 'stroke-width': 6 * k, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  /* a villus as drawn in the villi chapter, at scale s: its base centre at (0,0) */
  function villus(parent, s) {
    const g = G(parent), q = v => (v * s).toFixed(1);
    const outer = `M${q(-100)},0 L${q(-100)},${q(-380)} A${q(100)},${q(100)} 0 0 1 ${q(100)},${q(-380)} L${q(100)},0`;
    g.outer = outer;
    E('path', { d: outer + ' Z', fill: '#F2A3BA' }, g);
    E('path', { d: `M${q(-76)},0 L${q(-76)},${q(-380)} A${q(76)},${q(76)} 0 0 1 ${q(76)},${q(-380)} L${q(76)},0 Z`, fill: '#6E2A3E' }, g);
    E('path', { d: outer, fill: 'none', stroke: '#B8466A', 'stroke-width': 3 }, g);
    g.wall = `M${q(-88)},0 L${q(-88)},${q(-380)} A${q(88)},${q(88)} 0 0 1 ${q(88)},${q(-380)} L${q(88)},0`;
    const loop = `M${q(-48)},0 L${q(-48)},${q(-380)} A${q(48)},${q(48)} 0 0 1 ${q(48)},${q(-380)} L${q(48)},0`;
    let links = ''; [-330, -250, -170, -90].forEach(y => { links += `M${q(-48)},${q(y)} C${q(-16)},${q(y - 16)} ${q(16)},${q(y + 16)} ${q(48)},${q(y)} `; });
    g.halo = E('path', { d: `M0,${q(-32)} L0,${q(-300)}`, stroke: '#FFE9A8', 'stroke-width': 64 * s, 'stroke-linecap': 'round', opacity: 0.3 }, g);   // its round end stops at the base
    E('path', { d: `M${q(-17)},0 L${q(-17)},${q(-300)} A${q(17)},${q(17)} 0 0 1 ${q(17)},${q(-300)} L${q(17)},0 Z`, fill: '#FFF0C8', stroke: '#E0C27A', 'stroke-width': 2.5 }, g);
    E('path', { d: links, fill: 'none', stroke: '#D2384A', 'stroke-width': 3.5 }, g);
    g.loopEl = E('path', { d: loop, fill: 'none', stroke: C.blood, 'stroke-width': 6.5 }, g);
    return g;
  }
  const BEN = ['#3D7BE0', '#5BB55B', '#E8D24A', '#F08A2E', '#B33A2A'];
  function mixHex(a, b, p) { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(p))).toString(16).padStart(2, '0')).join(''); }
  const sweepCol = p => { const x = clamp(p) * (BEN.length - 1), i = Math.min(BEN.length - 2, Math.floor(x)); return mixHex(BEN[i], BEN[i + 1], x - i); };

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

  /* ---------- pictures: shown with the question, they show the answer when it comes ---------- */
  function picBenedict(g) {
    const tube = testTube(g, 44, 140, { level: 0.55, liquid: BEN[0] }); tr(tube, 0, -44);
    const bath = beaker(g, 132, 90, { level: 0.7, liquid: '#9FD8FF', opacity: 0.3, marks: false }); tr(bath, 0, 10);
    E('line', { x1: -84, y1: 62, x2: 84, y2: 62, stroke: '#9DB0BF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-70,62 L-82,150 M70,62 L82,150', stroke: '#7D8C99', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const bn = bunsen(g, 0.4); tr(bn, 0, 158);
    return t => { bn.upd(t * calm); tube.set(0.55, sweepCol(P(t, at('a1') - 0.05, 1.5, linear))); };
  }
  function picFat(g) {
    const art = G(g); tr(art, 0, 0, 1.4);
    const bar = G(art); E('rect', { x: -8, y: -36, width: 16, height: 72, rx: 8, fill: ball('#FFF0B8', '#C9B46A'), stroke: '#C9B46A', 'stroke-width': 2 }, bar);
    const tails = [-23, 0, 23].map(y => { const tg = G(art); tail(tg, 64); return { tg, y }; });
    const lip = enzyme(g, 'lip', 28);
    const lab = G(g);
    T(lab, -118, 104, 'glycerol', { size: 26, weight: 700, fill: '#FFF0B8', anchor: 'middle' });
    T(lab, 73, 104, 'fatty acids', { size: 26, weight: 700, fill: '#FFB347', anchor: 'middle' });
    return t => {
      const ta = at('a2');
      const lp = P(t, ta - 0.1, 0.6, easeOut), sp = P(t, ta + 0.35, 0.7, easeOut);
      tr(lip, lerp(-150, -60, lp), lerp(-104, -84, lp) + Math.sin(t * 3 * calm) * 3, 1, 180);
      op(lip, P(t, ta - 0.1, 0.3, linear) * (1 - P(t, ta + 1.4, 0.4, linear)));
      tr(bar, lerp(-40, -84, sp), 0);
      tails.forEach(o => tr(o.tg, lerp(-31, 20, sp), o.y * (1 + 0.7 * sp)));
      op(lab, P(t, ta + 0.6, 0.4, linear));
    };
  }
  function picOrange(g) {
    const fruit = G(g); tr(fruit, 0, -6);
    E('circle', { r: 66, fill: ball('#FFA53D', '#C25E12'), stroke: '#FFD08A', 'stroke-width': 2.5 }, fruit);
    const dr = rng(12); for (let k = 0; k < 16; k++) { const a = dr() * TAU, r = 18 + dr() * 40; E('circle', { cx: Math.cos(a) * r, cy: Math.sin(a) * r, r: 2.2, fill: '#E0801E', opacity: 0.8 }, fruit); }
    E('path', { d: 'M0,-64 C-2,-72 0,-80 4,-84', fill: 'none', stroke: '#6B4A33', 'stroke-width': 5, 'stroke-linecap': 'round' }, fruit);
    E('path', { d: 'M4,-78 C14,-96 36,-94 42,-86 C30,-76 16,-72 4,-78 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, fruit);
    const badge = G(g);
    E('circle', { r: 30, fill: Y, stroke: '#FFF3A6', 'stroke-width': 3 }, badge);
    T(badge, 0, 14, 'C', { size: 40, weight: 700, fill: C.bg0, anchor: 'middle' });
    return t => { const p = P(t, at('a3') - 0.05, 0.45, pop); op(badge, clamp(p * 2)); tr(badge, 54, -58, Math.max(0.01, p)); };
  }
  function picVillus(g) {
    const v = villus(g, 0.5); tr(v, 0, 128);
    const wallGlow = E('path', { d: v.wall, fill: 'none', stroke: '#FFF3F7', 'stroke-width': 9 }, v);
    const surf = E('path', { d: v.outer, fill: 'none', stroke: Y, 'stroke-width': 8, 'stroke-linejoin': 'round' }, v);
    op(wallGlow, 0); op(surf, 0);
    return t => {
      const A = f => mid('a4', f);
      op(surf, 0.9 * P(t, A(0.2), 0.4, linear));
      op(wallGlow, 0.65 * P(t, A(0.42), 0.4, linear));
      const bp = P(t, A(0.62), 0.4, linear);
      v.loopEl.setAttribute('stroke-width', (6.5 + 3.5 * bp * (0.6 + 0.4 * wave(t * calm, 1.1))).toFixed(2));
      v.halo.setAttribute('opacity', (0.3 + 0.6 * P(t, A(0.82), 0.4, linear)).toFixed(3));
    };
  }
  function picGut(g) {
    // the end of the gut and a blood vessel, coloured as in the egestion chapter (large intestine, dark lumen)
    const TUBE = 'M-44,-108 L-44,84';
    E('path', { d: TUBE, fill: 'none', stroke: '#8C4A43', 'stroke-width': 58, 'stroke-linecap': 'round' }, g);
    E('path', { d: TUBE, fill: 'none', stroke: '#D79C8E', 'stroke-width': 46, 'stroke-linecap': 'round' }, g);
    E('path', { d: TUBE, fill: 'none', stroke: '#2E1C14', 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-44,84 L-44,116', fill: 'none', stroke: '#2A1A20', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    const pellets = [0, 1, 2, 3].map(() => E('ellipse', { rx: 11, ry: 15, fill: ball('#9A6844', '#5A3820'), stroke: '#C79A72', 'stroke-width': 1.5 }, g));
    const VES = 'M66,118 L66,-108';
    E('path', { d: VES, fill: 'none', stroke: '#5E1A26', 'stroke-width': 32, 'stroke-linecap': 'round' }, g);
    E('path', { d: VES, fill: 'none', stroke: '#C93242', 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
    const cells = [0, 1, 2, 3, 4].map(() => E('ellipse', { rx: 7, ry: 5, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.5 }, g));
    T(g, -44, 150, 'gut', { size: 24, weight: 700, fill: '#E3B2A4', anchor: 'middle' });
    T(g, 66, 150, 'blood', { size: 24, weight: 700, fill: '#FF8A94', anchor: 'middle' });
    const no = G(g);
    const ar = arrow(no, -6, -30, 40, -30, { color: C.muted, width: 5 });
    const x = cross(no, 15); tr(x, 18, -30);
    return t => {
      pellets.forEach((p, k) => { const u = ((t * 0.22 * calm) + k / 4) % 1; attr(p, 'cx', -44); attr(p, 'cy', lerp(-96, 128, u)); op(p, Math.min(1, u * 8, (1 - u) * 5)); });
      cells.forEach((c, k) => { const u = ((t * 0.3 * calm) + k / 5) % 1; attr(c, 'cx', 66); attr(c, 'cy', lerp(112, -102, u)); op(c, Math.min(1, u * 8, (1 - u) * 8)); });
      const np = P(t, at('a5') + 0.4, 0.5, pop); op(no, clamp(np * 2)); ar.set(P(t, at('a5') + 0.4, 0.5));
    };
  }

  /* ---------- the five questions ---------- */
  const PY = 548;
  const QS = [
    { q: 'Which food test must be heated, and\nwhat colour shows a positive result?', a: [[['Benedict’s', Y, 800], [' test, for', C.ink]], [['reducing sugar. It turns', C.ink]], [['brick-red', '#EE7A5C', 800], ['.', C.ink]]], pic: picBenedict, small: true },
    { q: 'Which enzyme digests fat,\nand what does it make?', a: [[['It’s ', C.ink], ['lipase', C.heat, 800], [', making', C.ink]], [['fatty acids', Y, 800]], [['and glycerol', Y, 800], ['.', C.ink]]], pic: picFat, small: true },
    { q: 'A lack of which vitamin\ncauses scurvy?', a: [[['Vitamin C.', Y, 800]]], pic: picOrange, big: true },
    { q: 'Name two ways a villus is\nadapted for absorption.', a: null, pic: picVillus },
    { q: 'True or false: getting rid of\nfaeces is called excretion.', a: [[['False.', C.bad, 800], [' It’s called', C.ink]], [['egestion', Y, 800], ['.', C.ink]]], pic: picGut, note: 'Faeces were never absorbed.' },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 250, d.q, { size: 42, weight: 700, anchor: 'middle', lh: 54 });
    const pic = G(g); tr(pic, 290, PY);
    const anim = d.pic(pic) || (() => {});
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const parts = [];
    if (d.a) {
      const size = d.big ? 56 : d.small ? 36 : 40, lh = d.small ? 46 : 52, y0 = d.big ? 540 : d.small ? 514 : 526;
      d.a.forEach((line, k) => parts.push(rich(ans, 464, y0 + k * lh, line, { size, weight: 700 })));
      if (d.note) parts.push(T(ans, 464, y0 + d.a.length * lh + 8, d.note, { size: 30, weight: 600, fill: C.muted }));
    }
    return { g, qc, think, rg, num, ans, anim, k: i + 1, parts };
  });
  // answer 3: the scurvy card
  const scurvy = G(QS[2].ans);
  card(scurvy, 464, 578, 420, 88, { fill: C.card2, stroke: C.line, rx: 18 });
  const gums = G(scurvy); tr(gums, 512, 622);
  E('path', { d: 'M-30,8 C-30,-24 30,-24 30,8', fill: 'none', stroke: '#F08A9A', 'stroke-width': 14, 'stroke-linecap': 'round' }, gums);
  [[-20, -6], [-7, -14], [8, -14], [21, -6]].forEach(([x, y]) => E('rect', { x: x - 5, y: y - 2, width: 10, height: 12, rx: 3, fill: '#F7F1E3' }, gums));
  [[-26, 4], [0, -18], [25, 3]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 3.5, fill: '#C21F34' }, gums));
  rich(scurvy, 560, 632, ['too little → ', ['scurvy', C.bad, 800]], { size: 30, weight: 600 });
  // answer 4: the four adaptations, any two
  const a4 = G(QS[3].ans);
  rich(a4, 464, 512, ['Any ', ['two', Y, 800], ' of:'], { size: 34, weight: 700 });
  const A4L = [['a large surface area', Y], ['a thin wall', '#FFB8D0'], ['a good blood supply', '#FF7A86'], ['a lacteal', '#FFE9A8']].map(([s, col], k) => {
    const g = G(a4), y = 556 + k * 44;
    E('circle', { cx: 478, cy: y - 10, r: 8, fill: col }, g);
    T(g, 498, y, s, { size: 32, weight: 700 });
    return g;
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Food & Digestion quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Food & Digestion  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);

  /* ---------- update ---------- */
  return t => {
    // progress dots: each fills with its answer; all five pulse as the outro sparks burst
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    const allP = Math.sin(Math.PI * P(t, at('outro') + 0.1, 0.9, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, (cur ? 1.18 + 0.06 * wave(t, 1) : 1) + 0.3 * allP * P(t, at('outro') + i * 0.08, 0.2, linear));
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.1, 0.3);
    op(intro, ia);
    if (ia > 0) tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      // the old card is gone before the next one arrives: no two cards overlap
      const v = Math.min(P(t, tq - 0.08, 0.3, linear), 1 - P(t, nx - 0.38, 0.3, linear));
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.08, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const pp = P(t, tq + 0.1, 0.5, pop); tr(q.g.childNodes[1], 290, PY + (1 - clamp(pp)) * 20); op(q.g.childNodes[1], clamp(pp * 2));
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      q.anim(t);
    });
    // answer extras
    const sc = P(t, at('a3') + 0.3, 0.45, pop); op(scurvy, clamp(sc * 2)); tr(scurvy, 0, (1 - clamp(sc)) * 14);
    A4L.forEach((g, k) => { const p = P(t, mid('a4', 0.18 + k * 0.21), 0.4, pop); op(g, clamp(p * 2)); tr(g, (1 - clamp(p)) * 16, 0); });
    const q5 = QS[4]; if (q5.parts[2]) op(q5.parts[2], P(t, mid('a5', 0.55), 0.4, linear));

    // outro
    const oa = P(t, at('outro') - 0.05, 0.5, linear);
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
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
    }
  };
});

/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (the seven nutrients fill a plate,
   the canal's seven parts light up a mini gut, the enzyme names next to their foods, Big Thin Bloody Lacteal
   beside a mini villus), and the grid glows complete -> "5 exam traps": each shows the wrong idea struck out,
   the right idea ticked, and a picture (heated Benedict's, iodine's colour order, bile vs lipase, the helper
   organs outside the canal, fat's two products). */
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
  const fit = (segs, size, maxW, wt) => { const w = textWidth(plain(segs), size, FD, wt || 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Crazy People ..." with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy;
  /* an enzyme (as drawn in the enzymes chapter): a rounded blob with its active site, a notch shaped for its
     molecule, at the top centre */
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
  const amylase = (p, r) => enzyme(p, 'amy', r);
  const protease = (p, r) => enzyme(p, 'pro', r);
  const lipase = (p, r) => enzyme(p, 'lip', r);
  /* glucose: an amber hexagon with its ring oxygen; starch is a chain of them */
  const hexPath = s => { let d = ''; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (Math.cos(a) * s).toFixed(1) + ',' + (Math.sin(a) * s).toFixed(1); } return d + 'Z'; };
  function hexU(parent, s) {
    const g = G(parent);
    E('path', { d: hexPath(s), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': Math.max(1.5, s * 0.12), 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: (s * 0.866).toFixed(1), cy: (-s * 0.5).toFixed(1), r: (s * 0.2).toFixed(1), fill: C.oxygen }, g);
    return g;
  }
  function starch(parent, n, s, gap) {
    const g = G(parent), span = (n - 1) * gap;
    for (let i = 0; i < n - 1; i++) E('line', { x1: -span / 2 + i * gap + s * 0.8, y1: 0, x2: -span / 2 + (i + 1) * gap - s * 0.8, y2: 0, stroke: '#C98F22', 'stroke-width': Math.max(3, s * 0.34), 'stroke-linecap': 'round' }, g);
    for (let i = 0; i < n; i++) tr(hexU(g, s), -span / 2 + i * gap, 0);
    return g;
  }
  /* protein: a chain of beads in four colours; an amino acid is one bead */
  const BEAD = [['#FF8A80', '#C2534C'], ['#4DD0C8', '#1E8C85'], ['#B5E655', '#6E9A26'], [C.ethanol, C.ethanolDk]];
  function bead(parent, k, r) { return E('circle', { r, fill: ball(BEAD[k % 4][0], BEAD[k % 4][1]), stroke: BEAD[k % 4][1], 'stroke-width': Math.max(1.2, r * 0.12) }, parent); }
  function protein(parent, n, r, gap) {
    const g = G(parent), span = (n - 1) * gap;
    E('line', { x1: -span / 2, y1: 0, x2: span / 2, y2: 0, stroke: '#C8B6CF', 'stroke-width': Math.max(2.5, r * 0.3) }, g);
    for (let i = 0; i < n; i++) { const b = bead(g, i, r); b.setAttribute('cx', -span / 2 + i * gap); }
    return g;
  }
  /* fat: a cream glycerol bar with three orange zig-zag fatty-acid tails; g.bar, g.tails */
  function tail(parent, len) {
    const k = (len || 66) / 66, a = 5 * Math.max(k, 0.8);
    let d = 'M0,0'; for (let i = 1; i <= 6; i++) d += ` L${(i * 11 * k).toFixed(1)},${(i % 2 ? -a : a).toFixed(1)}`;
    return E('path', { d, fill: 'none', stroke: '#FFB347', 'stroke-width': 6 * Math.max(k, 0.8), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  const barRect = (parent, h) => E('rect', { x: -7, y: -h / 2, width: 14, height: h, rx: 7, fill: ball('#FFF0B8', '#C9B46A'), stroke: '#C9B46A', 'stroke-width': 2 }, parent);
  function fat(parent, len) {
    const g = G(parent);
    g.tails = [-17, 0, 17].map(y => { const tg = G(g); tr(tg, 7, y); tail(tg, len || 48); return tg; });
    g.bar = G(g); barRect(g.bar, 54);
    return g;
  }
  /* a villus as drawn in the villi chapter, at scale s: its base centre at (0,0) */
  function villus(parent, s) {
    const g = G(parent), q = v => (v * s).toFixed(1);
    const outer = `M${q(-100)},0 L${q(-100)},${q(-380)} A${q(100)},${q(100)} 0 0 1 ${q(100)},${q(-380)} L${q(100)},0`;
    g.outer = outer;
    E('path', { d: outer + ' Z', fill: '#F2A3BA' }, g);
    E('path', { d: `M${q(-76)},0 L${q(-76)},${q(-380)} A${q(76)},${q(76)} 0 0 1 ${q(76)},${q(-380)} L${q(76)},0 Z`, fill: '#6E2A3E' }, g);
    E('path', { d: outer, fill: 'none', stroke: '#B8466A', 'stroke-width': Math.max(2, 3 * s * 2) }, g);
    g.wall = `M${q(-88)},0 L${q(-88)},${q(-380)} A${q(88)},${q(88)} 0 0 1 ${q(88)},${q(-380)} L${q(88)},0`;
    g.loop = `M${q(-48)},0 L${q(-48)},${q(-380)} A${q(48)},${q(48)} 0 0 1 ${q(48)},${q(-380)} L${q(48)},0`;
    let links = ''; [-330, -250, -170, -90].forEach(y => { links += `M${q(-48)},${q(y)} C${q(-16)},${q(y - 16)} ${q(16)},${q(y + 16)} ${q(48)},${q(y)} `; });
    g.halo = E('path', { d: `M0,0 L0,${q(-300)}`, stroke: '#FFE9A8', 'stroke-width': 64 * s, 'stroke-linecap': 'round', opacity: 0.3 }, g);
    E('path', { d: `M${q(-17)},0 L${q(-17)},${q(-300)} A${q(17)},${q(17)} 0 0 1 ${q(17)},${q(-300)} L${q(17)},0 Z`, fill: '#FFF0C8', stroke: '#E0C27A', 'stroke-width': Math.max(1.5, 2.5 * s * 1.6) }, g);
    E('path', { d: links, fill: 'none', stroke: '#D2384A', 'stroke-width': Math.max(2, 5 * s * 1.4) }, g);
    g.loopEl = E('path', { d: g.loop, fill: 'none', stroke: C.blood, 'stroke-width': Math.max(3, 10 * s * 1.3) }, g);
    return g;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball('#F4A6B8', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#5A1830' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#5A1830' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2x2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CH = 255;
  function hookCard(x, y) { const g = G(hooks); tr(g, x, y); g.box = card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }

  // 1. Crazy People Find Very Many Fish Wet, with a plate that fills sector by sector
  const h1 = hookCard(50, 115);
  const cp1 = initials('Crazy People Find', C.ink), cp2 = initials('Very Many Fish Wet', C.ink);
  const s1 = Math.min(fit(cp1, 36, 330), fit(cp2, 36, 330));
  rich(h1, 30, 62, cp1, { size: s1, weight: 700 }); rich(h1, 30, 106, cp2, { size: s1, weight: 700 });
  const plate = G(h1); tr(plate, 448, 86);
  E('circle', { r: 56, fill: '#E7EEF2', stroke: '#AFC1CC', 'stroke-width': 3 }, plate);
  E('circle', { r: 46, fill: '#F3F7F9', stroke: '#C9D6DE', 'stroke-width': 2 }, plate);
  const SECT = ['#F5B041', '#FF8A80', '#FFE27A', '#FF9F43', '#B48CFF', '#4FC37A', '#4CC9F0'];
  const sectors = SECT.map((c, k) => {
    const a0 = -Math.PI / 2 + k * TAU / 7, a1 = a0 + TAU / 7, r = 41;
    return E('path', { d: `M0,0 L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)} Z`, fill: c, stroke: '#FFFFFF', 'stroke-width': 2 }, plate);
  });
  const nl1 = initials('carbohydrates, proteins, fats,', C.ink), nl2 = initials('vitamins, minerals, fibre, water', C.ink);
  const s1b = Math.min(fit(nl1, 27, 460, 600), fit(nl2, 27, 460, 600));
  const n1 = rich(h1, 30, 172, nl1, { size: s1b, weight: 600 }), n2 = rich(h1, 30, 214, nl2, { size: s1b, weight: 600 });

  // 2. My Old Stomach Sometimes Loves Roast Anchovies, with a mini gut that lights part by part
  const h2 = hookCard(630, 115);
  const mo1 = initials('My Old Stomach Sometimes', C.ink), mo2 = initials('Loves Roast Anchovies', C.ink);
  const s2 = Math.min(fit(mo1, 34, 372), fit(mo2, 34, 372));
  rich(h2, 30, 58, mo1, { size: s2, weight: 700 }); rich(h2, 30, 100, mo2, { size: s2, weight: 700 });
  const gl1 = initials('mouth, oesophagus, stomach,', C.ink), gl2 = initials('small intestine, large intestine,', C.ink), gl3 = initials('rectum, anus', C.ink);
  const s2b = Math.min(fit(gl1, 26, 372, 600), fit(gl2, 26, 372, 600));
  const g1 = rich(h2, 30, 152, gl1, { size: s2b }), g2 = rich(h2, 30, 188, gl2, { size: s2b }), g3 = rich(h2, 30, 224, gl3, { size: s2b });
  const gut = G(h2); tr(gut, 458, 28, 0.5);
  const GUTP = [
    { d: 'M0,0', dot: true },                                                                  // mouth
    { d: 'M0,12 L0,100' },                                                                     // oesophagus
    { d: 'M0,100 C0,128 22,150 48,146 C72,142 76,112 60,104 C46,98 40,118 26,118', fat: 1 },    // stomach (J)
    { d: 'M40,146 L30,196 L-30,208 L30,222 L-30,238 L30,254 L-30,270 L30,286 L54,300' },     // small intestine
    { d: 'M54,300 L64,300 L64,176 L-64,176 L-64,312', w: 26, col: ['#D79C8E', '#8C4A43'] },    // large intestine
    { d: 'M-64,312 C-64,336 -10,334 0,352 L0,372', w: 24, col: ['#D79C8E', '#8C4A43'] },       // rectum
    { d: 'M0,384', dot: true },                                                                // anus
  ];
  const gutHalo = G(gut), gutBody = G(gut);
  const gutParts = GUTP.map(p => {
    const w = p.w || 18;
    const halo = p.dot ? E('circle', { cx: 0, cy: p.d === 'M0,0' ? 0 : 384, r: 22, fill: C.energy }, gutHalo)
      : E('path', { d: p.d, fill: 'none', stroke: C.energy, 'stroke-width': w + 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gutHalo);
    if (p.dot) E('circle', { cx: 0, cy: p.d === 'M0,0' ? 0 : 384, r: 12, fill: '#F4A6B8', stroke: '#B8466A', 'stroke-width': 4 }, gutBody);
    else if (p.fat) E('path', { d: p.d + ' Z', fill: '#F4A6B8', stroke: '#B8466A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, gutBody);
    else { const [fc, sc] = p.col || ['#F4A6B8', '#B8466A']; E('path', { d: p.d, fill: 'none', stroke: sc, 'stroke-width': w + 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gutBody); E('path', { d: p.d, fill: 'none', stroke: fc, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gutBody); }
    op(halo, 0);
    return halo;
  });

  // 3. enzyme names, each beside the food it digests
  const h3 = hookCard(50, 395);
  const ROWS3 = [
    { y: 70, make: protease, segs: [['P', Y, 800], ['rotease', C.lactic, 700], [' → ', C.muted], ['p', Y, 800], ['rotein', C.ink, 700]], pic: g => protein(g, 4, 8, 19) },
    { y: 146, make: lipase, segs: [['L', Y, 800], ['ipase', C.heat, 700], [' → ', C.muted], ['l', Y, 800], ['ipids', C.ink, 700]], pic: g => { const f = fat(g, 34); tr(f, -22, 0, 0.72); return f; } },
    { y: 222, make: amylase, segs: [['A', Y, 800], ['mylase', C.water, 700], [' → ', C.muted], ['st', C.ink, 700], ['a', Y, 800], ['rch', C.ink, 700]], pic: g => starch(g, 4, 9, 19) },
  ].map(r => {
    const g = G(h3);
    const e = r.make(g, 18); tr(e, 52, r.y - 12);
    rich(g, 92, r.y, r.segs, { size: 34, weight: 700 });
    const pic = G(g); tr(pic, 440, r.y - 12); r.pic(pic);
    return { g };
  });

  // 4. Big, Thin, Bloody Lacteal, with a mini villus
  const h4 = hookCard(630, 395);
  const bt = initials('Big, Thin, Bloody Lacteal', C.ink);
  rich(h4, 30, 62, bt, { size: fit(bt, 36, 360), weight: 700 });
  T(h4, 30, 100, 'the four adaptations of a villus', { size: 24, weight: 500, fill: C.muted, font: FB });
  const four = [['Big', ' surface area', 30, 158], ['Thin', ' wall', 272, 158], ['Blood', ' supply', 30, 210], ['Lacteal', '', 272, 210]].map(([a, b, x, y]) => {
    const g = G(h4);
    rich(g, x, y, [[a[0], Y, 800], [a.slice(1) + b, C.ink, 600]], { size: 28 });
    return g;
  });
  const vil = G(h4); tr(vil, 456, 230); villus(vil, 0.37);
  const hookCards = [[h1, 'crazy'], [h2, 'anchovies'], [h3, 'names'], [h4, 'villus']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['heat Benedict’s', 'iodine’s colours', 'bile emulsifies', 'not in the canal', 'and glycerol'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: Math.min(25, Math.floor(25 * 200 / textWidth(nm, 25, FD, 600))), weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const ws = Math.min(32, Math.floor(32 * 650 / textWidth(wrong, 32, FD, 600)));
    T(g, 458, 313, wrong, { size: ws, weight: 600, fill: C.muted });
    const sw = textWidth(wrong, ws, FD, 600);
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 650), weight: 700 });
    const ill = G(g); tr(ill, 760, 528);
    const anim = drawIllus(ill) || (() => {});
    return { g, st, rg, ill, anim };
  }
  const BEN = ['#3D7BE0', '#5BB55B', '#E8D24A', '#F08A2E', '#B33A2A'];
  const sweepCol = p => { const x = clamp(p) * (BEN.length - 1), i = Math.min(BEN.length - 2, Math.floor(x)); return mixHex(BEN[i], BEN[i + 1], x - i); };
  function mixHex(a, b, p) { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(p))).toString(16).padStart(2, '0')).join(''); }
  const tl = (g, x, y, s) => T(g, x, y, s, { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });

  const T5 = [
    // 1. Benedict's must be heated
    trapGroup('Just add Benedict’s and look', ['Benedict’s must be ', ['heated', Y, 800]], g => {
      const cold = testTube(g, 44, 120, { level: 0.6, liquid: BEN[0] }); tr(cold, -170, -10);
      const cx = cross(g, 14); tr(cx, -104, -40);
      tl(g, -170, 86, 'no heat');
      const hot = testTube(g, 44, 120, { level: 0.6, liquid: BEN[0] }); tr(hot, 110, -18);
      const bath = beaker(g, 140, 84, { level: 0.72, liquid: '#9FD8FF', opacity: 0.32, marks: false }); tr(bath, 110, 14);
      const hw1 = heatWaves(g, { n: 2, h: 54, spacing: 16 }); tr(hw1, 18, 56);
      const hw2 = heatWaves(g, { n: 2, h: 54, spacing: 16 }); tr(hw2, 202, 56);
      const tk = tick(g, 14); tr(tk, 204, -52);
      tl(g, 110, 86, 'heated');
      return t => { hw1.upd(t * calm); hw2.upd(t * calm + 0.4); const p = P(t, mid('t1', 0.4), 1.1, linear); hot.set(0.6, sweepCol(p)); op(tk, P(t, mid('t1', 0.4) + 1.1, 0.3, linear)); };
    }),
    // 2. iodine starts orange-brown, turns blue-black with starch
    trapGroup('Iodine goes blue-black → orange-brown', [['Orange-brown', Y, 800], ' → ', ['blue-black', Y, 800], ' with starch'], g => {
      const a = testTube(g, 44, 120, { level: 0.6, liquid: '#C67A2E' }); tr(a, -170, -10);
      tl(g, -170, 86, 'iodine');
      const ar = arrow(g, -108, -10, 56, -10, { color: C.muted, width: 5 });
      const st = starch(g, 4, 10, 22); tr(st, -26, -40);
      tl(g, -26, 26, '+ starch');
      const b = testTube(g, 44, 120, { level: 0.6, liquid: '#C67A2E' }); tr(b, 124, -10);
      tl(g, 124, 86, 'blue-black');
      return t => { ar.set(P(t, mid('t2', 0.5), 0.5)); b.set(0.6, mixHex('#C67A2E', '#1B2140', P(t, mid('t2', 0.55), 1.2, linear))); };
    }),
    // 3. bile emulsifies, lipase digests
    trapGroup('Bile digests fat', ['Bile ', ['emulsifies', Y, 800], ' fat: ', ['lipase', C.heat, 800], ' digests it'], g => {
      E('circle', { cx: -280, cy: -8, r: 32, fill: ball('#FFE08A', '#C9A13A'), stroke: '#FFF3C4', 'stroke-width': 2 }, g);
      T(g, -280, 58, 'fat', { size: 24, weight: 700, fill: '#FFE08A', anchor: 'middle' });
      const a1 = arrow(g, -234, -8, -160, -8, { color: C.muted, width: 5 });
      [[-214, -38], [-198, -46], [-182, -36]].forEach(([x, y]) => E('path', { d: `M${x},${y - 9} C${x + 5},${y - 2} ${x + 7},${y + 3} ${x + 7},${y + 6} A7,7 0 0 1 ${x - 7},${y + 6} C${x - 7},${y + 3} ${x - 5},${y - 2} ${x},${y - 9} Z`, fill: '#7FBF4D', stroke: '#C4E8A4', 'stroke-width': 1.5 }, g));
      T(g, -198, 26, 'bile', { size: 24, weight: 700, fill: '#9AD46A', anchor: 'middle' });
      const dr = rng(31), drops = [];
      for (let k = 0; k < 9; k++) drops.push(E('circle', { cx: -117 + (k % 3) * 22 + (dr() - 0.5) * 8, cy: -30 + Math.floor(k / 3) * 22 + (dr() - 0.5) * 8, r: 7 + dr() * 3, fill: ball('#FFE08A', '#C9A13A') }, g));
      const dLab = T(g, -95, 58, 'tiny droplets', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
      const a2 = arrow(g, -40, -8, 36, -8, { color: C.muted, width: 5 });
      const lp = lipase(g, 16); tr(lp, -2, -42);
      T(g, -2, 26, 'lipase', { size: 24, weight: 700, fill: C.heat, anchor: 'middle' });
      const prod = fat(g, 40); tr(prod, 110, -8);
      const pLab = T(g, 150, 58, 'fatty acids + glycerol', { size: 24, weight: 700, fill: '#FFB347', anchor: 'middle' });
      return t => {
        a1.set(P(t, mid('t3', 0.42), 0.5));
        drops.forEach((d, k) => op(d, P(t, mid('t3', 0.46) + k * 0.04, 0.3, linear)));
        op(dLab, P(t, mid('t3', 0.52), 0.4, linear));
        a2.set(P(t, mid('t3', 0.58), 0.5));
        const sp = P(t, mid('t3', 0.64), 0.6, easeOut);
        op(prod, P(t, mid('t3', 0.62), 0.3, linear)); op(pLab, P(t, mid('t3', 0.66), 0.4, linear));
        tr(prod.bar, -14 * sp, 0); prod.tails.forEach((tg, k) => tr(tg, 7 + 22 * sp, [-17, 0, 17][k] * (1 + 0.9 * sp)));
      };
    }),
    // 4. the liver, gall bladder and pancreas help from outside the canal
    trapGroup('Liver, gall bladder, pancreas: in the canal', ['They’re ', ['not', Y, 800], ' part of the alimentary canal'], g => {
      const tube = 'M-230,50 C-200,50 -190,30 -160,32 C-128,34 -126,66 -96,64 C-60,62 -40,50 0,50 C40,50 60,40 90,52 C120,64 150,40 180,50 L230,50';
      E('path', { d: tube, fill: 'none', stroke: '#B8466A', 'stroke-width': 26, 'stroke-linecap': 'round' }, g);
      E('path', { d: tube, fill: 'none', stroke: '#F4A6B8', 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
      T(g, -236, 94, 'canal', { size: 24, weight: 600, fill: '#F4A6B8' });
      E('path', { d: 'M-26,20 L-26,38 M112,10 L112,38', stroke: '#C9D6DE', 'stroke-width': 3 }, g);
      E('path', { d: 'M-235,-24 C-214,-46 -130,-48 -106,-26 C-94,-14 -110,8 -140,10 C-180,12 -228,6 -235,-24 Z', fill: ball('#C8444F', '#7A1F2A'), stroke: '#E37C86', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
      T(g, -168, -6, 'liver', { size: 24, weight: 700, fill: '#FFFFFF', anchor: 'middle' });
      E('path', { d: 'M-30,-14 C-16,-16 -10,0 -16,12 C-22,22 -34,20 -36,8 C-38,-2 -38,-12 -30,-14 Z', fill: ball('#A6DC78', '#4E8A2A'), stroke: '#CDEFAF', 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g);
      T(g, -26, -30, 'gall bladder', { size: 24, weight: 700, fill: '#9AD46A', anchor: 'middle' });
      E('path', { d: 'M44,-16 C64,-30 134,-34 168,-18 C182,-10 168,6 146,8 C110,12 64,12 48,2 C38,-4 36,-12 44,-16 Z', fill: ball('#F7D06A', '#B8892A'), stroke: '#FBE3A0', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
      T(g, 108, 0, 'pancreas', { size: 24, weight: 700, fill: '#5A3A00', anchor: 'middle' });
      const bol = E('circle', { r: 10, fill: ball('#F5BE62', '#B97A24') }, g);
      const tp = E('path', { d: tube, fill: 'none', stroke: 'none' }, g), PTS = [];
      let L = 0; try { L = tp.getTotalLength(); } catch (e) { L = 0; }
      for (let k = 0; k <= 60; k++) { let q = { x: -230 + 460 * k / 60, y: 50 }; if (L) { try { q = tp.getPointAtLength(L * k / 60); } catch (e) { /* straight */ } } PTS.push([q.x, q.y]); }
      return t => {
        const u = ((t * 0.28 * calm) % 1 + 1) % 1, f = u * 60, i = Math.min(59, Math.floor(f));
        const x = lerp(PTS[i][0], PTS[i + 1][0], f - i), y = lerp(PTS[i][1], PTS[i + 1][1], f - i);
        attr(bol, 'cx', x); attr(bol, 'cy', y);
        op(bol, Math.min(1, u * 12, (1 - u) * 12));
      };
    }),
    // 5. fat gives fatty acids AND glycerol; protein gives amino acids
    trapGroup('Fat → just fatty acids', ['Fat → fatty acids ', ['and', Y, 800], ' glycerol'], g => {
      const f = fat(g, 40); tr(f, -250, -36);
      const a1 = arrow(g, -184, -36, -130, -36, { color: C.muted, width: 5 });
      const bar = G(g); tr(bar, -104, -36); barRect(bar, 54);
      T(g, -86, -26, 'glycerol', { size: 26, weight: 700, fill: '#FFF0B8' });
      T(g, 30, -26, 'and', { size: 26, weight: 800, fill: Y });
      const tails = G(g); tr(tails, 84, -36); [-17, 0, 17].forEach(y => { const tg = G(tails); tr(tg, 0, y); tail(tg, 36); });
      T(g, 132, -26, 'fatty acids', { size: 26, weight: 700, fill: '#FFB347' });
      const pr = protein(g, 5, 9, 20); tr(pr, -226, 52);
      const a2 = arrow(g, -168, 52, -114, 52, { color: C.muted, width: 5 });
      const beads = [0, 1, 2, 3].map(k => { const b = bead(g, k, 9); return b; });
      T(g, 4, 61, 'protein → amino acids', { size: 26, weight: 700, fill: C.ink });
      return t => {
        a1.set(P(t, mid('t5', 0.42), 0.5)); a2.set(P(t, mid('t5', 0.56), 0.5));
        const sp = P(t, mid('t5', 0.6), 0.6, easeOut);
        beads.forEach((b, k) => { attr(b, 'cx', -90 + k * (16 + 8 * sp)); attr(b, 'cy', 52 + (k % 2 ? -4 : 4) * sp); });
      };
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('crazy') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('crazy') - 0.3, 0.5));
    }

    // memory hooks build up, glow complete, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        const x = i % 2 ? 630 : 50, y = i < 2 ? 115 : 395;
        tr(g, x, y + (1 - clamp(p)) * 26);
        const gl = Math.sin(Math.PI * P(t, mid('villus', 0.62) + i * 0.08, 0.9, linear));
        g.box.setAttribute('stroke', gl > 0.02 ? C.energy : C.line);
        g.box.setAttribute('stroke-width', (2 + 3 * gl).toFixed(2));
      });
      // plate fills as the nutrients are named
      sectors.forEach((s, k) => op(s, P(t, mid('crazy', 0.46 + k * 0.075), 0.3, linear)));
      op(n1, P(t, mid('crazy', 0.44), 0.5, linear)); op(n2, P(t, mid('crazy', 0.68), 0.5, linear));
      // canal parts light in order
      const GA = [0.46, 0.53, 0.6, 0.68, 0.78, 0.87, 0.94];
      gutParts.forEach((h, k) => op(h, 0.85 * P(t, mid('anchovies', GA[k]), 0.3, linear) * (1 - 0.6 * P(t, mid('anchovies', GA[k]) + 0.6, 0.5, linear))));
      op(g1, P(t, mid('anchovies', 0.45), 0.5, linear)); op(g2, P(t, mid('anchovies', 0.66), 0.5, linear)); op(g3, P(t, mid('anchovies', 0.85), 0.5, linear));
      ROWS3.forEach((r, k) => { const p = P(t, mid('names', [0.02, 0.34, 0.64][k]), 0.45, pop); op(r.g, clamp(p * 2)); tr(r.g, (1 - clamp(p)) * -18, 0); });
      four.forEach((g, k) => op(g, P(t, mid('villus', 0.08 + k * 0.1), 0.4, linear)));
    }

    // traps
    const ta = P(t, at('traps') - 0.1, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(head, P(t, at('traps') - 0.1, 0.5, linear));
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : end('t5') + 0.55;
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
        g.st.set(P(t, mid(k, 0.3), 0.5, easeOut));
        const rp = P(t, mid(k, 0.38), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.4), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 528, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

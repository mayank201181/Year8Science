/* Chapter 3, Mitochondria: where it happens.
   A cell full of mitochondria -> the powerhouses -> inside one: the folded inner membrane
   -> unfolded it is far longer -> active cells have more -> muscle, sperm, liver, fat
   -> energy-demand bars -> chloroplast vs mitochondrion -> bonus: once bacteria, own DNA. */
scene('mito', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const amp = R ? 0.3 : 1;

  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 6, fill: color || C.muted }, g);
    return g;
  }
  function dnaLoop(parent, r, color) {
    const pts = [];
    for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, k = r * (1 + 0.16 * Math.sin(a * 6)); pts.push([Math.cos(a) * k, Math.sin(a) * k]); }
    return E('path', { d: closedPath(pts), fill: 'none', stroke: color || '#5B2FB8', 'stroke-width': 5 }, parent);
  }

  /* ---------- A. a cell full of mitochondria ---------- */
  const A = G(root);
  const CX = 500, CY = 430;
  const cellG = G(A);
  const cell = animalCell(cellG, 330, 245, { sw: 6, seed: 12, amp: 0.02 });
  const MP = [[80, -150, 12], [205, -60, -40], [190, 105, 25], [40, 170, -8], [-150, 150, 30], [-240, 30, -70], [-205, -140, -25], [60, 10, 80]];
  const mitos = MP.map(([x, y, r]) => { const g = G(cell.inner); const m = mitochondrion(g, 104, 48, { glow: true }); return { g, m, x, y, r }; });
  const ONE = 3;
  const ringG = G(cell.inner); tr(ringG, MP[ONE][0], MP[ONE][1], 1, MP[ONE][2]);
  E('ellipse', { rx: 74, ry: 44, fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-dasharray': '12 9' }, ringG);
  const sparkG = G(cell.inner), sr = rng(31), sparks = [];
  for (let j = 0; j < 18; j++) sparks.push({ el: spark(sparkG, 12, { seed: j }), k: j % MP.length, ang: sr() * TAU, ph: sr(), dist: 55 + sr() * 45 });

  const labMany = G(A);
  [0, 1, 7].forEach(k => leader(labMany, 862, 246, CX + MP[k][0], CY + MP[k][1]));
  T(labMany, 875, 238, 'mitochondria', { size: 38, weight: 700 });
  T(labMany, 875, 278, 'lots of them', { size: 28, weight: 500, fill: C.muted });
  const labOne = G(A);
  leader(labOne, 862, 588, CX + MP[ONE][0] + 50, CY + MP[ONE][1] - 6, C.energy);
  T(labOne, 875, 582, 'mitochondrion', { size: 38, weight: 700, fill: C.energy });
  T(labOne, 875, 622, 'just one', { size: 28, weight: 500, fill: C.muted });
  const labPow = G(A);
  T(labPow, 875, 262, 'the', { size: 30, weight: 500, fill: C.muted });
  T(labPow, 875, 316, 'powerhouses', { size: 46, weight: 700, fill: C.energy });
  T(labPow, 875, 362, 'of the cell', { size: 34, weight: 600 });
  T(labPow, 875, 440, 'most of the energy\nis released here', { size: 27, weight: 500, fill: C.muted, lh: 36 });

  /* ---------- B. inside one: the folded inner membrane ---------- */
  const B = G(root);
  const big = G(B);
  const OW = 760, OH = 300, IW = 700, IH = 240;
  const outer = E('rect', { x: -OW / 2, y: -OH / 2, width: OW, height: OH, rx: OH / 2, fill: ball(C.mito, C.mitoDk), stroke: C.mitoDk, 'stroke-width': 7 }, big);
  E('rect', { x: -IW / 2, y: -IH / 2, width: IW, height: IH, rx: IH / 2, fill: C.mitoIn, opacity: 0.92 }, big);
  const mem = E('path', { fill: 'none', stroke: C.mitoDk, 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, big);
  const tracer = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 13, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.07 0.93' }, big);

  // the inner membrane as one long line: caps, top edge with folds down, bottom edge with folds up
  const raw = [];
  const arc = (cx, cy, rr, a0, a1, n) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; raw.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); } };
  const FW = 30, DEP = 150, TOP = -IH / 2, BOT = IH / 2, RC = IH / 2;
  arc(-IW / 2 + RC, 0, RC, Math.PI, Math.PI * 1.5, 16);
  [-190, -114, -38, 38, 114, 190].forEach(xc => {
    raw.push([xc - FW / 2, TOP]); raw.push([xc - FW / 2, TOP + DEP - FW / 2]);
    arc(xc, TOP + DEP - FW / 2, FW / 2, Math.PI, 0, 8);
    raw.push([xc + FW / 2, TOP]);
  });
  arc(IW / 2 - RC, 0, RC, -Math.PI / 2, Math.PI / 2, 30);
  [152, 76, 0, -76, -152].forEach(xc => {
    raw.push([xc + FW / 2, BOT]); raw.push([xc + FW / 2, BOT - DEP + FW / 2]);
    arc(xc, BOT - DEP + FW / 2, FW / 2, 0, -Math.PI, 8);
    raw.push([xc - FW / 2, BOT]);
  });
  arc(-IW / 2 + RC, 0, RC, Math.PI / 2, Math.PI * 0.965, 14);
  const STEP = 9, FP = [raw[0]];
  let carry = 0, LEN = 0;
  for (let i = 1; i < raw.length; i++) {
    const [x0, y0] = raw[i - 1], [x1, y1] = raw[i], seg = Math.hypot(x1 - x0, y1 - y0);
    let pos = STEP - carry;
    while (pos <= seg) { const f = pos / seg; FP.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]); pos += STEP; }
    carry = seg - (pos - STEP); LEN += seg;
  }
  const NP = FP.length, SPAN = (NP - 1) * STEP;
  const SEND = 1080 / SPAN;                 // final scale: the unfolded line spans 1080 px
  const SMALL_Y = 252, LINE_Y = 470;        // stage y of the small mitochondrion and of the line
  const SP = FP.map((p, i) => [-SPAN / 2 + i * STEP, (LINE_Y - SMALL_Y) / SEND]);
  const toD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const D_FOLDED = toD(FP);
  mem.setAttribute('d', D_FOLDED); tracer.setAttribute('d', D_FOLDED);

  const labB = G(B);
  leader(labB, 262, 214, 402, 252, C.ink);
  T(labB, 120, 206, 'outer membrane', { size: 30, weight: 600 });
  leader(labB, 600, 586, 600, 526, C.energy);
  T(labB, 600, 622, 'inner membrane: folded', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const labU = G(B);
  T(labU, 700, 262, 'mitochondrion', { size: 28, weight: 600, fill: C.muted });
  T(labU, 600, 530, 'its inner membrane, unfolded', { size: 32, weight: 600, anchor: 'middle' });
  const uSparks = [];
  for (let i = 0; i < 9; i++) { const s = spark(labU, 12, { seed: i + 3 }); tr(s, 120 + i * 120, LINE_Y); uSparks.push(s); }
  const saChip = chip(labU, 'a large surface area for the reactions', { size: 30, fill: C.card2, stroke: C.energy });
  tr(saChip, 600, 622);

  /* ---------- C. more active -> more mitochondria ---------- */
  const Cg = G(root);
  const ACT = [[300, 1], [600, 4], [900, 9]];
  const actCells = ACT.map(([x, n], i) => {
    const g = G(Cg);
    const c = animalCell(g, 100, 88, { sw: 4, nucleus: false, seed: 40 + i, amp: 0.03 });
    const pos = n === 1 ? [[0, 0]] : n === 4 ? [[-30, -24], [30, -24], [-30, 24], [30, 24]]
      : [[-48, -36], [0, -38], [48, -36], [-50, 0], [0, 0], [50, 0], [-48, 36], [0, 38], [48, 36]];
    pos.forEach(([px, py], k) => { const mg = G(c.inner); tr(mg, px, py, 1, (k % 2 ? 1 : -1) * 15); mitochondrion(mg, 40, 19); });
    return { g, c, x };
  });
  const actArrow = arrow(Cg, 210, 520, 990, 520, { color: C.energy, width: 7 });
  const actLab = T(Cg, 600, 578, 'more active', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const actHead = T(Cg, 600, 228, 'more mitochondria', { size: 36, weight: 700, anchor: 'middle' });

  /* ---------- D. four cells ---------- */
  function muscleCell(parent) {
    const g = G(parent), body = G(g);
    E('rect', { x: -380, y: -90, width: 760, height: 180, rx: 80, fill: 'rgba(232,106,122,0.2)', stroke: '#EE7D8C', 'stroke-width': 6 }, body);
    for (let i = 0; i < 15; i++) E('line', { x1: -329 + i * 47, y1: -80, x2: -329 + i * 47, y2: 80, stroke: '#EE7D8C', 'stroke-width': 3, opacity: 0.3 }, body);
    [[-250, -64], [70, 66], [290, -64]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 30, ry: 11, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 3 }, body));
    const rr = rng(77);
    for (let i = 0; i < 14; i++) for (const yy of [-27, 27]) {
      const mg = G(body); tr(mg, -306 + i * 47 + (rr() - 0.5) * 6, yy + (rr() - 0.5) * 8, 1, (rr() - 0.5) * 24);
      mitochondrion(mg, 38, 19);
    }
    g.upd = (t, a) => { const w = wave(t, 1.3); body.setAttribute('transform', `scale(${(1 - 0.1 * a * w).toFixed(4)} ${(1 + 0.08 * a * w).toFixed(4)})`); };
    return g;
  }
  function spermCell(parent) {
    const g = G(parent), bob = G(g);
    const tail = E('path', { fill: 'none', stroke: C.cell, 'stroke-width': 7, 'stroke-linecap': 'round' }, bob);
    E('rect', { x: -195, y: -22, width: 160, height: 44, rx: 22, fill: 'rgba(255,148,102,0.18)', stroke: C.cell, 'stroke-width': 5 }, bob);
    for (let i = 0; i < 6; i++) { const mg = G(bob); tr(mg, -167 + i * 24, 0, 1, i % 2 ? 32 : -32); mitochondrion(mg, 30, 15); }
    E('ellipse', { cx: -265, cy: 0, rx: 78, ry: 52, fill: 'rgba(247,168,200,0.16)', stroke: C.cell, 'stroke-width': 5 }, bob);
    E('ellipse', { cx: -258, cy: 0, rx: 52, ry: 34, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 3 }, bob);
    E('path', { d: 'M-316,-36 Q-352,0 -316,36', fill: 'none', stroke: '#F9C7DA', 'stroke-width': 6, 'stroke-linecap': 'round' }, bob);
    g.upd = (t, a) => {
      const pts = [];
      for (let i = 0; i <= 36; i++) pts.push([-35 + i * 12.5, (4 + i * 1.1) * Math.max(a, 0.25) * Math.sin(i * 0.42 - t * 8)]);
      tail.setAttribute('d', openPath(pts));
      tr(bob, 0, 4 * a * Math.sin(t * 4));
    };
    return g;
  }
  function liverCell(parent) {
    const g = G(parent), pts = [];
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3, r = 150 * (i % 2 ? 0.94 : 1); pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + 'Z', fill: 'rgba(224,138,110,0.18)', stroke: '#E89A7E', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: -18, cy: -8, r: 38, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 3 }, g);
    const rr = rng(88), spots = [];
    for (let tries = 0; spots.length < 16 && tries < 600; tries++) {
      const a = rr() * TAU, r = 45 + rr() * 60, x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (Math.hypot(x + 18, y + 8) < 70 || spots.some(s => Math.hypot(s[0] - x, s[1] - y) < 40)) continue;
      spots.push([x, y]);
      const mg = G(g); tr(mg, x, y, 1, rr() * 180); mitochondrion(mg, 38, 19);
    }
    g.upd = () => {};
    return g;
  }
  function fatCell(parent) {
    const g = G(parent);
    E('circle', { r: 150, fill: 'rgba(247,168,200,0.12)', stroke: C.cell, 'stroke-width': 6 }, g);
    E('circle', { cx: 10, cy: 4, r: 124, fill: 'rgba(255,226,154,0.5)', stroke: '#F0CF7A', 'stroke-width': 3 }, g);
    E('ellipse', { cx: -128, cy: -30, rx: 12, ry: 36, fill: 'rgba(150,120,220,0.5)', stroke: '#B79CF0', 'stroke-width': 3, transform: 'rotate(12 -128 -30)' }, g);
    T(g, 10, 14, 'fat droplet', { size: 28, weight: 600, anchor: 'middle', fill: '#7A5B12' });
    [145, 235, 115].forEach(deg => { const a = deg * Math.PI / 180, mg = G(g); tr(mg, Math.cos(a) * 136, Math.sin(a) * 136, 1, deg + 90); mitochondrion(mg, 30, 14); });
    g.upd = () => {};
    return g;
  }
  const Dg = G(root);
  const FOCUS = [600, 420];
  const CELLS = [
    { id: 'muscle', make: muscleCell, fs: 0.95, dock: [180, 160, 0.26], fin: [165, 290, 0.33], name: 'muscle cell', why: 'packed with mitochondria: contracting needs lots of energy', demand: 0.95, lvl: 'high' },
    { id: 'sperm', make: spermCell, fs: 0.95, dock: [430, 160, 0.27], fin: [455, 290, 0.33], name: 'sperm cell', why: 'the mid-piece is full of them, to power the tail', demand: 0.85, lvl: 'high' },
    { id: 'liver', make: liverCell, fs: 1, dock: [660, 160, 0.42], fin: [745, 290, 0.74], name: 'liver cell', why: 'full of mitochondria: lots of energy-hungry reactions', demand: 0.9, lvl: 'high' },
    { id: 'fat', make: fatCell, fs: 1, dock: null, fin: [1035, 290, 0.74], name: 'fat-storage cell', why: 'only a few mitochondria: it needs little energy', demand: 0.15, lvl: 'low' },
  ].map(c => {
    c.g = G(Dg); c.cell = c.make(c.g);
    c.labs = G(Dg);
    const ch = chip(c.labs, c.name, { size: 32, fill: C.card2, stroke: C.line }); tr(ch, 600, 628);
    T(c.labs, 600, 688, c.why, { size: 27, weight: 500, anchor: 'middle', fill: C.muted, font: FB });
    return c;
  });
  const midLab = G(CELLS[1].labs);
  leader(midLab, 491, 520, 491, 446, C.mito);
  T(midLab, 491, 552, 'mid-piece', { size: 28, weight: 700, anchor: 'middle', fill: C.mito });
  const fin = G(Dg);
  T(fin, 600, 140, 'lots of mitochondria → high energy demand', { size: 36, weight: 700, anchor: 'middle' });
  const bars = CELLS.map(c => {
    const g = G(fin);
    T(g, c.fin[0], 440, c.id === 'fat' ? 'fat-storage' : c.id, { size: 28, weight: 600, anchor: 'middle' });
    const m = meter(g, { w: 220, h: 28, color: c.lvl === 'high' ? C.energy : C.muted }); tr(m, c.fin[0] - 110, 462);
    T(g, c.fin[0], 536, c.lvl === 'high' ? 'high demand' : 'low demand', { size: 27, weight: 700, anchor: 'middle', fill: c.lvl === 'high' ? C.energy : C.muted });
    return { g, m, c };
  });

  /* ---------- E. chloroplast vs mitochondrion ---------- */
  const Eg = G(root);
  const chlG = G(Eg); tr(chlG, 320, 340); chloroplast(chlG, 380, 210);
  const miG = G(Eg); tr(miG, 880, 340); const mi2 = mitochondrion(miG, 380, 170, { glow: true });
  const chlName = T(Eg, 320, 508, 'chloroplast', { size: 38, weight: 700, anchor: 'middle', fill: C.chloro });
  const miName = T(Eg, 880, 508, 'mitochondrion', { size: 38, weight: 700, anchor: 'middle', fill: C.mito });
  const neq = T(Eg, 600, 372, '≠', { size: 110, weight: 700, anchor: 'middle', fill: C.muted });
  const phChip = G(Eg); chip(phChip, 'photosynthesis happens here', { size: 28, fill: '#163F2A', stroke: C.chloro }); tr(phChip, 320, 585);
  const reChip = G(Eg); chip(reChip, 'respiration happens here', { size: 28, fill: '#4A2A1E', stroke: C.mito }); tr(reChip, 880, 585);

  /* ---------- F. bonus: once bacteria, with their own DNA ---------- */
  const Fg = G(root);
  const bonus = chip(Fg, 'bonus fact', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(bonus, 600, 140);
  const longAgo = T(Fg, 600, 196, 'long, long ago…', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const hostG = G(Fg); tr(hostG, 720, 450);
  const host = animalCell(hostG, 300, 210, { sw: 6, seed: 66, amp: 0.025 });
  const bacG = G(Fg);
  const bac = G(bacG);
  const flag = E('path', { fill: 'none', stroke: '#8FE3D2', 'stroke-width': 5, 'stroke-linecap': 'round' }, bac);
  E('rect', { x: -78, y: -32, width: 156, height: 64, rx: 32, fill: ball('#3FA997', '#1F6F62'), stroke: '#8FE3D2', 'stroke-width': 5 }, bac);
  const mito3 = G(bacG); mitochondrion(mito3, 170, 74);
  const dna = G(bacG); dnaLoop(dna, 19);
  const bacLab = T(Fg, 230, 388, 'free-living bacterium', { size: 28, weight: 600, anchor: 'middle', fill: '#8FE3D2' });
  const mitoLab = T(Fg, 705, 602, 'mitochondrion', { size: 28, weight: 600, anchor: 'middle', fill: C.mito });
  const dnaLab = G(Fg);
  leader(dnaLab, 905, 676, 812, 534, C.energy);
  T(dnaLab, 905, 700, 'its own DNA', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });

  return t => {
    /* A */
    const aA = Math.min(P(t, S.first - 0.6, 0.6, linear), 1 - P(t, at('folds') - 0.1, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      const zoom = P(t, at('folds') - 0.2, 0.9, easeIn);
      const ps = 0.85 + 0.15 * P(t, S.first - 0.4, 0.9, easeOut), zs = 1 + zoom * 1.6;
      const fx = CX + MP[1][0], fy = CY + MP[1][1];
      cellG.setAttribute('transform', `translate(${fx} ${fy}) scale(${zs.toFixed(4)}) translate(${-fx} ${-fy}) translate(${CX} ${CY}) scale(${ps.toFixed(4)})`);
      cell.upd(t);
      const pickOne = win(t, mid('where', 0.7), at('power') + 0.1, 0.35);
      const glowOn = P(t, at('power'), 0.8, linear);
      mitos.forEach((o, i) => {
        const p = P(t, mid('where', 0.25) + i * 0.08, 0.5, pop);
        tr(o.g, o.x, o.y, Math.max(0.01, p), o.r + (R ? 0 : 4 * Math.sin(t * 0.8 + i)));
        op(o.g, clamp(p * 2) * (i === ONE ? 1 : 1 - 0.55 * pickOne));
        op(o.m.halo, glowOn);
        o.m.upd(t + i * 0.4);
      });
      op(ringG, pickOne);
      ringG.firstChild.setAttribute('stroke-dashoffset', (-t * 30).toFixed(1));
      op(labMany, win(t, mid('where', 0.36), at('power') + 0.1, 0.4));
      op(labOne, pickOne);
      op(labPow, win(t, at('power') + 0.4, at('folds') + 0.1, 0.4));
      const sw = win(t, at('power') + 0.3, at('folds') + 0.3, 0.5);
      op(sparkG, sw);
      if (sw > 0) sparks.forEach(sp => {
        const u = ((t - at('power')) / 2.2 + sp.ph) % 1, o = MP[sp.k], d = 30 + easeOut(u) * sp.dist;
        tr(sp.el, o[0] + Math.cos(sp.ang) * d, o[1] + Math.sin(sp.ang) * d, 0.5 + 0.6 * Math.sin(u * Math.PI));
        op(sp.el, Math.sin(u * Math.PI)); sp.el.upd(t);
      });
    }

    /* B */
    const aB = Math.min(P(t, at('folds') + 0.05, 0.6, linear), 1 - P(t, at('active') - 0.2, 0.5, linear));
    op(B, aB);
    if (aB > 0) {
      const inP = P(t, at('folds') - 0.1, 0.9, easeOut);
      const sh = P(t, at('unfold') + 0.1, 1.0);                     // shrink to make room
      const mp = P(t, at('unfold') + 0.9, 2.6, linear);             // unfold
      const s = lerp(lerp(0.4, 1, inP), SEND, sh);
      const x = lerp(lerp(CX + MP[1][0], 600, inP), 600, sh), y = lerp(lerp(CY + MP[1][1], 400, inP), SMALL_Y, sh);
      tr(big, x, y, s);
      outer.setAttribute('stroke-width', (lerp(7, 4, sh) / s).toFixed(2));
      mem.setAttribute('stroke-width', (lerp(8, 6, sh) / s).toFixed(2));
      if (mp > 0 && mp < 1) {
        const pts = FP.map((p, i) => { const q = ease(clamp((mp - 0.45 * i / NP) / 0.55)); return [lerp(p[0], SP[i][0], q), lerp(p[1], SP[i][1], q)]; });
        mem.setAttribute('d', toD(pts));
      } else mem.setAttribute('d', mp >= 1 ? toD(SP) : D_FOLDED);
      const trc = win(t, mid('folds', 0.15), at('unfold') + 0.2, 0.3);
      op(tracer, trc);
      if (trc > 0) { tracer.setAttribute('stroke-width', (13 / s).toFixed(2)); tracer.setAttribute('stroke-dashoffset', (-((t - at('folds')) * 0.22) % 1).toFixed(4)); }
      op(labB, win(t, at('folds') + 0.3, at('unfold') + 0.15, 0.35));
      op(labU, P(t, at('unfold') + 1.0, 0.5, linear));
      op(labU.childNodes[0], P(t, at('unfold') + 1.0, 0.5, linear));
      op(labU.childNodes[1], P(t, at('unfold') + 3.0, 0.5, linear));
      const spOn = P(t, mid('unfold', 0.6), 0.4, linear);
      uSparks.forEach((s2, i) => { const ph = P(t, mid('unfold', 0.6) + i * 0.08, 0.4, pop); op(s2, spOn * clamp(ph * 2) * (0.6 + 0.4 * wave(t, 1.2, i * 0.13))); tr(s2, 120 + i * 120, LINE_Y - 2, 0.6 + 0.4 * ph); s2.upd(t); });
      op(saChip, P(t, mid('unfold', 0.62), 0.5, linear));
      tr(saChip, 600, 622 + (1 - P(t, mid('unfold', 0.62), 0.6, easeOut)) * 16);
    }

    /* C */
    const aC = Math.min(P(t, at('active') - 0.1, 0.5, linear), 1 - P(t, at('muscle') - 0.2, 0.45, linear));
    op(Cg, aC);
    if (aC > 0) {
      actCells.forEach((o, i) => { const p = P(t, mid('active', 0.05 + i * 0.22), 0.55, pop); tr(o.g, o.x, 372, Math.max(0.01, p)); op(o.g, clamp(p * 2)); o.c.upd(t + i); });
      actArrow.set(P(t, mid('active', 0.1), 1.6));
      op(actLab, P(t, mid('active', 0.35), 0.4, linear));
      op(actHead, P(t, mid('active', 0.6), 0.4, linear));
    }

    /* D */
    const aD = Math.min(P(t, at('muscle') - 0.2, 0.4, linear), 1 - P(t, at('chloro') - 0.15, 0.5, linear));
    op(Dg, aD);
    if (aD > 0) {
      const tFin = at('predict') - 0.1;
      const pFin = P(t, tFin, 1.0);
      CELLS.forEach((c, i) => {
        const tIn = at(c.id), tDock = i < 3 ? at(CELLS[i + 1].id) - 0.15 : null;
        const pin = P(t, tIn - 0.1, 0.6, pop);
        if (t < tIn - 0.1) { op(c.g, 0); op(c.labs, 0); return; }
        const pd = tDock !== null ? P(t, tDock, 0.8) : 0;
        let x = FOCUS[0], y = FOCUS[1], s = c.fs * Math.max(0.01, 0.6 + 0.4 * pin);
        if (c.dock) { x = lerp(x, c.dock[0], pd); y = lerp(y, c.dock[1], pd); s = lerp(s, c.dock[2], pd); }
        x = lerp(x, c.fin[0], pFin); y = lerp(y, c.fin[1], pFin); s = lerp(s, c.fin[2], pFin);
        tr(c.g, x, y, s);
        op(c.g, clamp(pin * 2));
        c.cell.upd(t, amp * (1 - 0.5 * Math.max(pd, pFin)));
        op(c.labs, Math.min(P(t, tIn + 0.2, 0.4, linear), 1 - P(t, tDock !== null ? tDock - 0.1 : tFin - 0.1, 0.35, linear)));
      });
      op(fin, P(t, tFin + 0.5, 0.5, linear));
      bars.forEach((b, i) => b.m.set(b.c.demand * P(t, tFin + 0.9 + i * 0.35, 0.9, easeOut)));
    }

    /* E */
    const aE = Math.min(P(t, at('chloro') - 0.1, 0.5, linear), 1 - P(t, at('bacteria') - 0.15, 0.5, linear));
    op(Eg, aE);
    if (aE > 0) {
      const pc = P(t, at('chloro'), 0.6, pop), pm = P(t, at('chloro') + 0.35, 0.6, pop);
      tr(chlG, 320, 340 + (R ? 0 : 5 * Math.sin(t * 1.1)), Math.max(0.01, pc)); op(chlG, clamp(pc * 2));
      tr(miG, 880, 340 + (R ? 0 : 5 * Math.sin(t * 1.1 + 1.5)), Math.max(0.01, pm)); op(miG, clamp(pm * 2));
      mi2.upd(t);
      op(chlName, P(t, at('chloro') + 0.3, 0.4, linear)); op(miName, P(t, at('chloro') + 0.6, 0.4, linear));
      op(neq, P(t, mid('chloro', 0.12), 0.4, linear));
      op(phChip, P(t, mid('chloro', 0.32), 0.4, linear)); tr(phChip, 320, 585 + (1 - P(t, mid('chloro', 0.32), 0.5, easeOut)) * 14);
      op(reChip, P(t, mid('chloro', 0.66), 0.4, linear)); tr(reChip, 880, 585 + (1 - P(t, mid('chloro', 0.66), 0.5, easeOut)) * 14);
    }

    /* F */
    const aF = P(t, at('bacteria') - 0.1, 0.5, linear);
    op(Fg, aF);
    if (aF > 0) {
      op(bonus, P(t, at('bacteria'), 0.4, linear));
      op(longAgo, P(t, mid('bacteria', 0.5), 0.5, linear));
      const ph = P(t, mid('bacteria', 0.06), 0.7, easeOut);
      tr(hostG, 720, 450, 0.85 + 0.15 * ph); op(hostG, ph); host.upd(t);
      const app = P(t, mid('bacteria', 0.12), 0.5, linear);
      const sw = P(t, mid('bacteria', 0.4), 2.0);
      const bx = lerp(230, 790, sw), by = lerp(450, 525, sw) + (1 - sw) * (R ? 0 : 10 * Math.sin(t * 3));
      tr(bacG, bx, by, 1, lerp(-6, 12, sw));
      op(bacG, app);
      const morph = P(t, mid('bacteria', 0.62), 0.8, linear);
      op(bac, 1 - morph); op(mito3, morph);
      const fp = []; for (let i = 0; i <= 14; i++) fp.push([-78 - i * 7, Math.sin(i * 0.8 - t * 9) * (2 + i * 0.6)]);
      flag.setAttribute('d', openPath(fp));
      const dn = P(t, mid('bacteria', 0.76), 0.6, pop);
      tr(dna, 22, 0, 1 + 0.35 * dn * (0.7 + 0.3 * wave(t, 1.1)));
      op(bacLab, Math.min(app, 1 - P(t, mid('bacteria', 0.42), 0.5, linear)));
      op(mitoLab, P(t, mid('bacteria', 0.68), 0.4, linear));
      op(dnaLab, P(t, mid('bacteria', 0.78), 0.4, linear));
    }
  };
});

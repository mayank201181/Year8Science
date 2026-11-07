/* Chapter: Which way does the current flow?
   Beats: the loop with a "?" and an arrow each way round -> conventional current: yellow arrows
   out of +, round the circuit and into - -> a zoom into the wire: fixed metal ions, drifting
   negative electrons -> showpiece: the electrons flow round the loop the opposite way, - to +
   -> an old book: the direction was picked long before electrons were known, and it stuck
   -> an exam answer drawn + to - gets a tick. */
scene('direction', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  // a polyline measured exactly like kit wire(), so the electrons share its spacing
  function track(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push([L, l, pts[i], pts[i + 1]]); L += l;
    }
    const pos = s => {
      s = ((s % L) + L) % L;
      for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; }
      return pts[pts.length - 1];
    };
    return { L, pos, n: Math.max(2, Math.round(L / 46)) };
  }
  const noLead = g => { g.firstChild.style.display = 'none'; return g; };      // the wire under it is its lead
  // text in coloured runs: [['+', C.bad], ' to ', ['−', C.water]]
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 32, 'font-weight': o.weight || 700, 'font-family': FD, 'text-anchor': o.anchor || 'middle', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1] }, t).textContent = s[0]; });
    return t;
  }
  const PLUS = ['+', C.bad], MINUS = ['−', C.water];                          // the cell's own sign colours
  // a circular arrow round (cx, cy); clockwise or not, as seen on screen
  function circArrow(parent, cx, cy, r, clockwise, color) {
    const g = G(parent);
    const a0 = clockwise ? -150 : -30, a1 = clockwise ? 130 : -310;
    const pt = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
    const p0 = pt(a0), p1 = pt(a1), rad = a1 * Math.PI / 180;
    E('path', { d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 1 ${clockwise ? 1 : 0} ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`, fill: 'none', stroke: color, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    const dir = clockwise ? [-Math.sin(rad), Math.cos(rad)] : [Math.sin(rad), -Math.cos(rad)];
    E('path', { d: 'M10,0 L-13,-13 L-7,0 L-13,13 Z', fill: color, 'stroke-linejoin': 'round', transform: `translate(${p1[0].toFixed(1)} ${p1[1].toFixed(1)}) rotate(${(Math.atan2(dir[1], dir[0]) * 180 / Math.PI).toFixed(1)})` }, g);
    return g;
  }
  function electron(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 1.5 }, g);
    E('line', { x1: -r * 0.48, x2: r * 0.48, y1: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': Math.max(2.4, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= the loop: 3 V battery and one bulb ================= */
  const LL = 300, LR = 900, LT = 250, LB = 530, CX = 600;
  const loop = G(root);
  const cw = [[CX - 25, LB], [LL, LB], [LL, LT], [LR, LT], [LR, LB], [CX + 25, LB]];     // + round to −
  const sigGlow = [E('circle', { cx: 571, cy: 482, r: 34, fill: glow(C.bad) }, loop), E('circle', { cx: 629, cy: 482, r: 34, fill: glow(C.water) }, loop)];
  const yW = wire(loop, cw);
  const eTrack = track(cw.slice().reverse()), eG = G(loop), elec = [];               // electrons: − round to +
  for (let k = 0; k < eTrack.n; k++) elec.push(electron(eG, 8.5));
  noLead(cellSym(loop, { cells: 2 })).setAttribute('transform', `translate(${CX} ${LB})`);
  const bulb = noLead(bulbSym(loop)); tr(bulb, CX, LT); bulb.set(1);
  // the question: which way round?
  const qG = G(loop);
  T(qG, 600, 440, '?', { size: 150, weight: 700, anchor: 'middle', fill: C.faint });
  circArrow(qG, 430, 392, 58, true, C.muted); circArrow(qG, 770, 392, 58, false, C.muted);
  const qNum = [T(qG, 430, 406, '1', { size: 40, weight: 700, anchor: 'middle', fill: C.muted }), T(qG, 770, 406, '2', { size: 40, weight: 700, anchor: 'middle', fill: C.muted })];
  // conventional current: big yellow arrows outside the loop, + round to −
  const yA = [[548, 584, 352, 584], [250, 500, 250, 300], [352, 172, 848, 172], [950, 300, 950, 500], [848, 584, 652, 584]]
    .map(a => arrow(loop, a[0], a[1], a[2], a[3], { color: C.energy, width: 9 }));
  // electron flow: blue arrows inside the loop, − round to +
  const bA = [[678, 482, 850, 482], [852, 474, 852, 304], [844, 298, 356, 298], [348, 304, 348, 474], [350, 482, 522, 482]]
    .map(a => arrow(loop, a[0], a[1], a[2], a[3], { color: C.water, width: 7 }));
  // labels
  const convIn = G(root);
  T(convIn, 600, 372, 'conventional current', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  const convSign = rich(convIn, 600, 438, [PLUS, ' to ', MINUS], { size: 56 });
  const convTop = rich(root, 600, 128, [['conventional current: ', C.energy], PLUS, ' to ', MINUS], { size: 32 });
  const elecIn = rich(root, 600, 412, [['electrons: ', C.water], MINUS, ' to ', PLUS], { size: 40 });

  /* ================= zoom into the wire ================= */
  const ZX = 640, ZY = 440, ZR = 175, SX = 390;
  const zoom = G(root);
  const zLines = G(zoom);
  {
    const dx = ZX - SX, dy = ZY - LT, d = Math.hypot(dx, dy), phi = Math.atan2(dy, dx), al = Math.acos((24 - ZR) / d);
    [phi + al, phi - al].forEach(a => E('line', { x1: SX + 24 * Math.cos(a), y1: LT + 24 * Math.sin(a), x2: ZX + ZR * Math.cos(a), y2: ZY + ZR * Math.sin(a), stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, zLines));
  }
  E('circle', { cx: SX, cy: LT, r: 24, fill: 'rgba(242,247,250,0.08)', stroke: C.ink, 'stroke-width': 3.5 }, zoom);
  const zWin = G(zoom);
  const zClip = E('clipPath', { id: 'meDirZoomClip' }, defs()); E('circle', { r: ZR }, zClip);
  const zIn = G(zWin, { 'clip-path': 'url(#meDirZoomClip)' });
  E('circle', { r: ZR, fill: '#3A2617' }, zIn);
  E('circle', { r: ZR, fill: glow('#7A4A26'), opacity: 0.7 }, zIn);
  for (let j = 0; j < 4; j++) for (let i = 0; i < 7; i++) {
    const x = -210 + i * 70 + (j % 2) * 35, y = -105 + j * 70;
    if (Math.hypot(x, y) > ZR + 12) continue;
    const g = G(zIn); tr(g, x, y);
    E('circle', { r: 22, fill: ball('#A7B3BF', '#5B6773'), stroke: '#C9D3DB', 'stroke-width': 1.5 }, g);
    T(g, 0, 10, '+', { size: 30, weight: 800, anchor: 'middle', fill: C.bad });
  }
  const zr = rng(29), zEl = [];
  [-140, -70, 0, 70, 140].forEach((y, row) => { for (let k = 0; k < 3; k++) zEl.push({ g: electron(zIn, 11), y, x0: k * 133 + row * 47 + zr() * 30, ph: zr() * TAU, sp: 38 + zr() * 12 }); });
  E('circle', { r: ZR, fill: 'none', stroke: C.ink, 'stroke-width': 5 }, zWin);
  const zKey = G(root);
  { const g = G(zKey); tr(g, 868, 374); E('circle', { r: 19, fill: ball('#A7B3BF', '#5B6773') }, g); T(g, 0, 9, '+', { size: 26, weight: 800, anchor: 'middle', fill: C.bad }); }
  T(zKey, 900, 384, 'metal ion: stays put', { size: 28, weight: 600 });
  tr(electron(zKey, 11), 868, 464);
  T(zKey, 900, 474, 'electron: drifts', { size: 28, weight: 600 });
  const zNeg = T(root, ZX, 676, 'electrons are **negative**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.water });

  /* ================= the old book ================= */
  const INK = '#5B4128', PAGE = '#EFE4C8';
  const book = G(root);
  const pageR = G(book);                                                  // right-hand page, under the cover
  E('rect', { x: 0, y: -190, width: 300, height: 380, rx: 6, fill: PAGE, stroke: '#CDBB92', 'stroke-width': 2 }, pageR);
  E('rect', { x: 0, y: -190, width: 26, height: 380, fill: 'rgba(120,90,50,0.16)' }, pageR);
  T(pageR, 150, -128, 'Current', { size: 34, weight: 600, anchor: 'middle', fill: INK });
  const bkPlus = T(pageR, 62, -34, '+', { size: 50, weight: 700, anchor: 'middle', fill: INK });
  const bkArrow = arrow(pageR, 92, -50, 206, -50, { color: INK, width: 6 });
  const bkMinus = T(pageR, 236, -34, '−', { size: 50, weight: 700, anchor: 'middle', fill: INK });
  for (let i = 0; i < 5; i++) E('line', { x1: 44, x2: i === 4 ? 180 : 256, y1: 20 + i * 30, y2: 20 + i * 30, stroke: '#B9A57C', 'stroke-width': 4, 'stroke-linecap': 'round' }, pageR);
  const stamp = G(book);                                                  // lands on the right-hand page
  { const tw = textWidth('ELECTRON', 32, FD, 700), w = 32 + 12 + tw + 40, x0 = -w / 2 + 20;
    E('rect', { x: -w / 2, y: -40, width: w, height: 80, rx: 14, fill: 'rgba(59,130,246,0.10)', stroke: '#3B82F6', 'stroke-width': 5 }, stamp);
    tr(electron(stamp, 16), x0 + 16, 0);
    T(stamp, x0 + 44, 11, 'ELECTRON', { size: 32, weight: 700, fill: '#5FA0FF' }); }
  const cover = G(book);                                                  // flips open about the spine (x = 0)
  const front = G(cover), inside = G(cover, { transform: 'scale(-1 1)' });   // pre-mirrored: it reads right once the cover is open
  E('rect', { x: 0, y: -196, width: 306, height: 392, rx: 10, fill: linGrad('#8C5733', '#5E351C', true), stroke: '#B07A45', 'stroke-width': 3 }, front);
  E('rect', { x: 26, y: -168, width: 254, height: 336, rx: 6, fill: 'none', stroke: '#D9B45A', 'stroke-width': 2.5, opacity: 0.8 }, front);
  T(front, 153, -86, 'ELECTRICITY', { size: 32, weight: 700, anchor: 'middle', fill: '#E7C66E', ls: 2 });
  const emblem = G(front);
  T(emblem, 96, 42, '+', { size: 56, weight: 700, anchor: 'middle', fill: '#E7C66E' });
  arrow(emblem, 124, 22, 184, 22, { color: '#E7C66E', width: 6 });
  T(emblem, 212, 42, '−', { size: 56, weight: 700, anchor: 'middle', fill: '#E7C66E' });
  E('rect', { x: -306, y: -196, width: 306, height: 392, rx: 10, fill: PAGE, stroke: '#CDBB92', 'stroke-width': 2 }, inside);
  T(inside, -153, -126, 'On Electricity', { size: 30, weight: 600, anchor: 'middle', fill: INK });
  for (let i = 0; i < 8; i++) E('line', { x1: -266, x2: i % 3 === 2 ? -116 : -40, y1: -70 + i * 30, y2: -70 + i * 30, stroke: '#B9A57C', 'stroke-width': 4, 'stroke-linecap': 'round' }, inside);
  const era1 = chip(root, 'early 1800s', { size: 30, fill: C.card2, stroke: C.line }); tr(era1, 600, 132);
  const era2 = chip(root, 'much later: 1897', { size: 30, fill: C.card2, stroke: '#3B82F6' }); tr(era2, 600, 132);
  const stuck = T(root, 600, 668, 'and it **stuck**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ================= the exam answer ================= */
  const PAPER = '#F4F1E8', PEN = '#24323D', BLUE = '#2A5DB0';
  const exam = G(root);
  E('rect', { x: -190, y: -205, width: 380, height: 410, rx: 14, fill: PAPER, stroke: '#CFC6B0', 'stroke-width': 3 }, exam);
  T(exam, 0, -158, 'Exam question', { size: 28, weight: 700, anchor: 'middle', fill: PEN });
  T(exam, 0, -122, 'Show the current direction.', { size: 25, weight: 600, anchor: 'middle', fill: '#4A5863', font: FB });
  E('path', { d: 'M-12,90 L-120,90 L-120,-44 L120,-44 L120,90 L12,90', fill: 'none', stroke: PEN, 'stroke-width': 4, 'stroke-linejoin': 'round' }, exam);
  E('line', { x1: -12, x2: -12, y1: 70, y2: 110, stroke: PEN, 'stroke-width': 4 }, exam);
  E('line', { x1: 12, x2: 12, y1: 80, y2: 100, stroke: PEN, 'stroke-width': 8 }, exam);
  T(exam, -26, 64, '+', { size: 26, weight: 700, anchor: 'middle', fill: PEN });
  T(exam, 28, 64, '−', { size: 26, weight: 700, anchor: 'middle', fill: PEN });
  E('circle', { cx: 0, cy: -44, r: 17, fill: PAPER, stroke: PEN, 'stroke-width': 4 }, exam);
  E('path', { d: 'M-12,-56 L12,-32 M12,-56 L-12,-32', stroke: PEN, 'stroke-width': 3 }, exam);
  const ans = [arrow(exam, -146, 70, -146, -20, { color: BLUE, width: 5 }), arrow(exam, -90, -84, 40, -84, { color: BLUE, width: 5 })];
  const ansTxt = rich(exam, -10, 162, [['+', BLUE], [' to ', BLUE], ['−', BLUE]], { size: 34 });
  const exTick = tick(exam, 30); tr(exTick, 128, 150);
  const sameChip = chip(root, 'the circuit works the same either way', { size: 30, fill: C.card2, stroke: C.line }); tr(sameChip, 600, 668);

  /* ================= timing ================= */
  const tY = mid('conv', 0.26), tE = mid('opposite', 0.12);
  const yAt = [0.28, 0.38, 0.48, 0.57, 0.65].map(f => mid('conv', f));
  const bAt = [0.2, 0.3, 0.39, 0.48, 0.56].map(f => mid('opposite', f));
  const tOpen = mid('why', 0.06), tShut = mid('why', 0.72);

  return t => {
    /* ----- the loop ----- */
    const lOp = Math.min(1, 1 - P(t, at('why') - 0.4, 0.4, linear) + P(t, at('works') - 0.1, 0.4, linear));
    const dim = 1 - 0.75 * win(t, at('electrons') - 0.1, at('opposite') + 0.1, 0.45);
    op(loop, lOp * dim);
    if (lOp > 0) {
      // the question
      op(qG, 1 - P(t, at('conv') + 0.1, 0.45, linear));
      qNum.forEach((n, i) => op(n, P(t, mid('which', 0.5 + i * 0.12), 0.4, linear)));
      // conventional current: dots start together, the yellow arrows run + round to −
      const yOn = t < at('opposite') ? P(t, tY, 0.25, linear) : t < at('works') - 0.3 ? 1 - P(t, at('opposite') + 0.05, 0.4, linear) : 1;
      yW.set(yOn); yW.upd(t > tY ? 60 * (t - tY) : 0, 1);
      yA.forEach((a, i) => { a.set(P(t, yAt[i], 0.5, linear)); op(a, t < yAt[i] ? 0 : 1); });
      op(sigGlow[0], t < at('works') ? win(t, mid('conv', 0.24), mid('conv', 0.24) + 1.3, 0.35) : 0);
      op(sigGlow[1], t < at('works') ? Math.max(win(t, mid('conv', 0.62), mid('conv', 0.62) + 1.3, 0.35), win(t, mid('opposite', 0.02), mid('opposite', 0.02) + 1.5, 0.35)) : 0);
      // electrons: out of −, round, and into +
      const eOn = t < at('works') - 0.3 ? P(t, tE, 0.3, linear) * (1 - P(t, at('why') - 0.4, 0.4, linear)) : 0;
      op(eG, eOn);
      if (eOn > 0) {
        const d = 60 * Math.max(0, t - tE);
        elec.forEach((g, k) => { const q = eTrack.pos(k * eTrack.L / eTrack.n + d); tr(g, q[0], q[1]); });
      }
      bA.forEach((a, i) => { a.set(P(t, bAt[i], 0.5, linear)); op(a, t < bAt[i] || t >= at('works') - 0.3 ? 0 : 1); });
      // finally: shrink to one side, beside the exam answer
      const sh = P(t, mid('works', 0.4), 0.9);
      if (sh > 0) loop.setAttribute('transform', `translate(${lerp(600, 380, sh).toFixed(1)} ${lerp(390, 400, sh).toFixed(1)}) scale(${lerp(1, 0.7, sh).toFixed(4)}) translate(-600 -390)`);
      else loop.removeAttribute('transform');
    }
    op(convIn, win(t, mid('conv', 0.04), at('electrons') - 0.2, 0.4));
    op(convSign, P(t, mid('conv', 0.68), 0.4, linear));
    op(elecIn, win(t, mid('opposite', 0.48), at('why') - 0.4, 0.4));
    op(convTop, win(t, mid('opposite', 0.62), at('why') - 0.4, 0.4));

    /* ----- zoom into the wire ----- */
    const zp = P(t, at('electrons') - 0.15, 0.7) * (1 - P(t, at('opposite') - 0.25, 0.55));
    op(zoom, clamp(zp * 4));
    if (zp > 0) {
      tr(zWin, lerp(SX, ZX, zp), lerp(LT, ZY, zp), Math.max(0.01, lerp(0.14, 1, zp)));
      op(zLines, zp);
      zEl.forEach(o => { const x = ((o.x0 - o.sp * t * calm) % 400 + 400) % 400 - 200; tr(o.g, x, o.y + 6 * Math.sin(t * 2.3 + o.ph) * calm); });
    }
    op(zKey, win(t, mid('electrons', 0.3), at('opposite') - 0.2, 0.4));
    op(zNeg, win(t, mid('electrons', 0.62), at('opposite') - 0.1, 0.4));

    /* ----- the old book ----- */
    const bOp = win(t, at('why') - 0.25, at('works') - 0.05, 0.4);
    op(book, bOp);
    if (bOp > 0) {
      const o = P(t, tOpen, 0.9) - P(t, tShut, 0.7), sx = 1 - 2 * o;              // cover: 1 shut, -1 open
      tr(book, lerp(450, 600, o), 400, 0.94 + 0.06 * P(t, at('why') - 0.25, 0.6, easeOut));
      cover.setAttribute('transform', `scale(${sx.toFixed(4)} 1)`);
      op(front, sx > 0 ? 1 : 0); op(inside, sx > 0 ? 0 : 1);
      const ap = P(t, mid('why', 0.24), 0.6, linear);
      op(bkPlus, clamp(ap * 3)); bkArrow.set(ap); op(bkMinus, P(t, mid('why', 0.24) + 0.5, 0.2, linear));
      const sp = P(t, mid('why', 0.56), 0.32, easeIn);
      op(stamp, t < mid('why', 0.56) || o < 0.5 ? 0 : clamp(sp * 1.5));
      stamp.setAttribute('transform', `translate(150 116) rotate(-9) scale(${(1.7 - 0.7 * sp).toFixed(3)})`);
      op(emblem, P(t, tShut + 0.5, 0.5, linear));
    }
    op(era1, win(t, mid('why', 0.14), mid('why', 0.5), 0.35));
    op(era2, win(t, mid('why', 0.5), tShut + 0.2, 0.35));
    op(stuck, win(t, tShut + 0.5, at('works') - 0.05, 0.4));

    /* ----- the exam answer ----- */
    op(sameChip, win(t, mid('works', 0.04), mid('works', 0.42), 0.4));
    const ep = P(t, mid('works', 0.44), 0.8, easeOut);
    op(exam, ep);
    if (ep > 0) {
      tr(exam, lerp(1180, 950, ep), 400);
      ans.forEach((a, i) => { const p = P(t, mid('works', 0.6 + i * 0.08), 0.5, linear); a.set(p); op(a, p > 0 ? 1 : 0); });
      op(ansTxt, P(t, mid('works', 0.72), 0.4, linear));
      const kp = P(t, mid('works', 0.82), 0.45, pop); op(exTick, clamp(kp * 2)); tr(exTick, 128, 150, Math.max(0.01, kp));
    }
  };
});

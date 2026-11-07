/* Chapter 1, Magnets and their poles.
   A magnet and its two poles, a paperclip clicks on -> like poles repel (N-N, then S-S)
   -> unlike poles attract -> the LROA card -> snap a magnet: two smaller magnets, then four,
   never a single pole (showpiece) -> iron, steel, nickel, cobalt -> I See No Cobwebs
   -> non-magnetic metals and materials -> a recycling conveyor pulls the steel cans out. */
scene('poles', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const RED = '#E8424F', REDK = '#A4232E', BLUE = '#3B82F6', BLUEK = '#1E4FA8';   // kit magnet() colours
  const NLT = '#FF8F98', SLT = '#8DB9FF';                                          // the same, as text on the dark stage
  const STEEL = '#CFD8DF';

  /* ---------- local art ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a steel paperclip about 76 x 24, long axis along x (or along y when upright) */
  function paperclip(parent, s, upright) {
    const g = G(parent), inner = G(g);
    inner.setAttribute('transform', `rotate(${upright ? 0 : 90}) scale(${s || 1})`);
    E('path', { d: 'M12,-26 L12,26 A12,12 0 0 1 -12,26 L-12,-30 A8,8 0 0 1 4,-30 L4,22 A4,4 0 0 1 -4,22 L-4,-14', fill: 'none', stroke: STEEL, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
    return g;
  }
  /* a magnet that can turn round: g.set(x, y, turns) where turns counts half-turns (1.5 = mid-way through the second) */
  function turnMag(parent, w, h, nRight) {
    const g = G(parent), body = G(g);
    const a = magnet(body, w, h, { flip: nRight }), b = magnet(body, w, h, { flip: !nRight });
    g.set = (x, y, turns) => {
      const k = Math.floor(turns + 1e-6), f = turns - k, show = f < 0.5 ? k : k + 1;
      const sx = Math.max(0.03, Math.abs(Math.cos(Math.PI * f)));
      op(a, show % 2 === 0 ? 1 : 0); op(b, show % 2 === 0 ? 0 : 1);
      tr(g, x, y - 26 * Math.sin(Math.PI * f));
      body.setAttribute('transform', `scale(${sx.toFixed(3)} 1)`);
    };
    g.set(0, 0, 0);
    return g;
  }
  /* one piece of a snapped magnet, w x h, all red (base 'N') or all blue (base 'S');
     g.set(r) recolours it into a whole N|S magnet: the old letter slides to its half, the new one appears */
  function piece(parent, w, h, base, size) {
    const g = G(parent), isN = base === 'N';
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: isN ? ball(RED, REDK) : ball(BLUE, BLUEK) }, g);
    const over = E('rect', { y: -h / 2, height: h, rx: 10, fill: isN ? ball(BLUE, BLUEK) : ball(RED, REDK) }, g);
    const flash = E('ellipse', { rx: w * 0.22, ry: h * 0.75, fill: glow('#FFFFFF') }, g);
    const old = T(g, 0, h * 0.2, base, { size, weight: 700, anchor: 'middle', fill: '#fff' });
    const neu = T(g, 0, h * 0.2, isN ? 'S' : 'N', { size, weight: 700, anchor: 'middle', fill: '#fff' });
    g.set = r => {
      r = clamp(r);
      const ow = (w / 2) * r;
      if (isN) { attr(over, 'x', w / 2 - ow); } else { attr(over, 'x', -w / 2); }
      attr(over, 'width', Math.max(0.01, ow)); op(over, r > 0.005 ? 1 : 0);
      attr(old, 'x', (isN ? -1 : 1) * (w / 4) * ease(r));
      attr(neu, 'x', (isN ? 1 : -1) * w / 4); op(neu, clamp((r - 0.45) / 0.4));
      op(flash, Math.sin(Math.PI * r) * 0.8); attr(flash, 'cx', (isN ? 1 : -1) * (w / 2 - ow));
    };
    g.set(0);
    return g;
  }
  /* rounded ghost chip with a dashed outline; g.frags are its shards for the shatter */
  function ghostChip(parent, text) {
    const g = G(parent), whole = G(g);
    const w = Math.ceil(textWidth(text, 30, FD, 700) + 44), h = 54;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: 'rgba(242,247,250,0.08)', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 7' }, whole);
    T(whole, 0, 11, text, { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
    const frags = [], fr = rng(text.length * 13 + 5);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU + fr() * 0.5, d = 70 + fr() * 70;
      const sh = E('path', { d: `M0,-9 L${(8 + fr() * 6).toFixed(1)},${(3 + fr() * 5).toFixed(1)} L${(-6 - fr() * 6).toFixed(1)},${(6 + fr() * 4).toFixed(1)} Z`, fill: C.muted }, g);
      frags.push({ el: sh, x0: (fr() - 0.5) * w * 0.8, y0: (fr() - 0.5) * h * 0.6, dx: Math.cos(a) * d, dy: Math.sin(a) * d * 0.7, rot: (fr() - 0.5) * 400 });
    }
    g.shatter = p => {
      op(whole, 1 - clamp(p * 4));
      frags.forEach(f => { op(f.el, p <= 0 || p >= 1 ? 0 : 1 - p); tr(f.el, f.x0 + f.dx * easeOut(p), f.y0 + f.dy * easeOut(p) + 40 * p * p, 1, f.rot * p); });
    };
    g.shatter(0);
    return g;
  }
  function ironBar(p) {
    const g = G(p);
    E('rect', { x: -62, y: -19, width: 124, height: 38, rx: 6, fill: linGrad('#A3AEB9', '#4B5661', true), stroke: '#C7D0D8', 'stroke-width': 2 }, g);
    E('rect', { x: -54, y: -13, width: 108, height: 5, rx: 2.5, fill: '#ffffff', opacity: 0.3 }, g);
    return g;
  }
  function nickelDisc(p) {
    const g = G(p);
    E('circle', { r: 36, fill: ball('#DAD8C9', '#8C897A'), stroke: '#EEEDE3', 'stroke-width': 3 }, g);
    E('circle', { r: 27, fill: 'none', stroke: '#A9A797', 'stroke-width': 2.5, opacity: 0.8 }, g);
    return g;
  }
  function cobaltLump(p) {
    const g = G(p);
    E('path', { d: closedPath(blobPts(44, 32, 9, 0, 0.2, 23)), fill: ball('#93A3C4', '#4A5878'), stroke: '#C3CFE6', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-22,-12 L-8,-20 L6,-14', fill: 'none', stroke: '#E5ECF8', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.6 }, g);
    return g;
  }
  function copperCoil(p) {
    const g = G(p);
    for (let i = 0; i < 6; i++) E('ellipse', { cx: -42 + i * 17, cy: 0, rx: 11, ry: 30, fill: 'none', stroke: i % 2 ? '#B86A2A' : '#D9893F', 'stroke-width': 5 }, g);
    E('path', { d: 'M-53,4 L-70,26 M43,-4 L62,-26', stroke: '#D9893F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function drinkCan(p, label) {
    const g = G(p);
    E('path', { d: 'M-22,-36 L-26,-28 L-26,36 Q-26,42 -20,42 L20,42 Q26,42 26,36 L26,-28 L22,-36 Z', fill: linGrad('#B9C4CD', '#F4F7F9'), stroke: '#E6ECF0', 'stroke-width': 2 }, g);
    E('rect', { x: -26, y: -10, width: 52, height: 22, fill: 'rgba(91,141,239,0.55)' }, g);
    E('ellipse', { cx: 0, cy: -36, rx: 22, ry: 4, fill: '#DCE3E8', stroke: '#9AA7B2', 'stroke-width': 1.5 }, g);
    if (label) T(g, 0, 8, label, { size: 22, weight: 700, anchor: 'middle', fill: '#fff' });
    return g;
  }
  function goldRing(p) {
    const g = G(p);
    E('path', { d: 'M-34,0 A34,30 0 1 0 34,0 A34,30 0 1 0 -34,0 Z M-23,0 A23,19 0 1 1 23,0 A23,19 0 1 1 -23,0 Z', 'fill-rule': 'evenodd', fill: linGrad('#FFE08A', '#B8860B', true), stroke: '#FFF0B8', 'stroke-width': 2 }, g);
    E('path', { d: 'M-8,-36 L0,-46 L8,-36 L0,-28 Z', fill: '#BFEFFF', stroke: '#E9FBFF', 'stroke-width': 2 }, g);
    return g;
  }
  function plasticBrick(p) {
    const g = G(p);
    E('rect', { x: -26, y: -40, width: 18, height: 12, rx: 3, fill: '#3FBF7F', stroke: '#8FE8BA', 'stroke-width': 2 }, g);
    E('rect', { x: 8, y: -40, width: 18, height: 12, rx: 3, fill: '#3FBF7F', stroke: '#8FE8BA', 'stroke-width': 2 }, g);
    E('rect', { x: -46, y: -30, width: 92, height: 56, rx: 6, fill: ball('#56D69B', '#23874F'), stroke: '#8FE8BA', 'stroke-width': 2 }, g);
    return g;
  }
  function woodBlock(p) {
    const g = G(p);
    E('rect', { x: -46, y: -30, width: 92, height: 60, rx: 5, fill: linGrad('#C68A4E', '#8E5A2B', true), stroke: '#E2B482', 'stroke-width': 2 }, g);
    E('path', { d: 'M-40,-14 Q-10,-22 18,-12 T44,-16 M-42,4 Q-6,-4 22,6 T44,2 M-38,20 Q0,12 30,22', fill: 'none', stroke: '#7A4A20', 'stroke-width': 2.5, opacity: 0.7 }, g);
    return g;
  }
  function glassBlock(p) {
    const g = G(p);
    E('rect', { x: -44, y: -32, width: 88, height: 64, rx: 6, fill: 'rgba(170,220,255,0.22)', stroke: '#CFE9FA', 'stroke-width': 3 }, g);
    E('path', { d: 'M-30,22 L-8,-22 M-14,22 L6,-18', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.45 }, g);
    return g;
  }
  function cobweb(parent, r) {
    const g = G(parent);
    let d = '';
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8; d += `M0,0 L${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} `; }
    [0.35, 0.62, 0.9].forEach(k => {
      for (let i = 0; i < 8; i++) {
        const a0 = i * TAU / 8, a1 = (i + 1) * TAU / 8, am = (a0 + a1) / 2, rr = r * k;
        d += `M${(Math.cos(a0) * rr).toFixed(1)},${(Math.sin(a0) * rr).toFixed(1)} Q${(Math.cos(am) * rr * 0.8).toFixed(1)},${(Math.sin(am) * rr * 0.8).toFixed(1)} ${(Math.cos(a1) * rr).toFixed(1)},${(Math.sin(a1) * rr).toFixed(1)} `;
      }
    });
    E('path', { d, fill: 'none', stroke: '#D8E2E8', 'stroke-width': 2.2, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    E('circle', { cx: r * 0.42, cy: r * 0.36, r: 5, fill: '#2B1D14', stroke: '#D8E2E8', 'stroke-width': 1.5 }, g);
    return g;
  }
  function steelCan(p) {
    const g = G(p);
    E('rect', { x: -28, y: -42, width: 56, height: 84, rx: 5, fill: linGrad('#6F7C88', '#B7C2CB'), stroke: '#D5DDE3', 'stroke-width': 2 }, g);
    for (let k = 0; k < 4; k++) E('line', { x1: -28, x2: 28, y1: -30 + k * 20, y2: -30 + k * 20, stroke: '#56626D', 'stroke-width': 2.5, opacity: 0.7 }, g);
    E('rect', { x: -28, y: -14, width: 56, height: 26, fill: '#2C3E4C', opacity: 0.85 }, g);
    T(g, 0, 7, 'steel', { size: 19, weight: 700, anchor: 'middle', fill: '#E3E9EE' });
    return g;
  }

  /* ======== A. a magnet, its poles, repel and attract ======== */
  const A = G(root);
  const MY = 380;
  const clipLbl = T(A, 404, 312, 'magnetic material', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const clip = paperclip(A, 1.2);
  const clickG = G(A);
  [[-0.25, -1], [-0.85, -0.7], [-0.25, 1], [-0.85, 0.7]].forEach(([dx, dy]) => E('line', { x1: dx * 22, y1: dy * 22, x2: dx * 38, y2: dy * 38, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, clickG));
  const M1 = turnMag(A, 300, 80, false);       // N on the left
  const M2 = turnMag(A, 300, 80, true);        // N on the right
  const lblN = labelLine(A, 392, 528, 482, 408, '**north pole** (N)', { size: 30, anchor: 'end' });
  const lblS = labelLine(A, 808, 528, 718, 408, '**south pole** (S)', { size: 30, anchor: 'start' });
  lblN.querySelector('tspan') && lblN.querySelector('tspan').setAttribute('fill', NLT);
  lblS.querySelector('tspan') && lblS.querySelector('tspan').setAttribute('fill', SLT);
  const arrY = MY - 78;
  const repA = [arrow(A, 572, arrY, 470, arrY, { color: C.bad, width: 7 }), arrow(A, 628, arrY, 730, arrY, { color: C.bad, width: 7 })];
  const repB = [arrow(A, 572, arrY, 470, arrY, { color: C.bad, width: 7 }), arrow(A, 628, arrY, 730, arrY, { color: C.bad, width: 7 })];
  const attA = [arrow(A, 456, arrY, 574, arrY, { color: C.good, width: 7 }), arrow(A, 744, arrY, 626, arrY, { color: C.good, width: 7 })];
  const chipRep = chip(A, 'like poles repel', { size: 32, fill: C.card2, stroke: C.bad }); tr(chipRep, 600, 548);
  const chipAtt = chip(A, 'unlike poles attract', { size: 32, fill: C.card2, stroke: C.good }); tr(chipAtt, 600, 548);
  const snap = G(A);
  [-1, 1].forEach(s => [[0, -1], [0.7, -0.7], [0.7, 0.7], [0, 1]].forEach(([dx, dy]) => E('line', { x1: s * dx * 14, y1: dy * 52, x2: s * dx * 30, y2: dy * 70, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, snap)));
  tr(snap, 600, MY);

  /* ======== B. Likes Repel, Opposites Attract ======== */
  const B = G(root);
  card(B, 120, 214, 960, 356, { fill: C.card, stroke: C.line });
  const lroaWords = G(B);
  const LW = [['**L**ikes', 0.22], ['**R**epel,', 0.36], ['**O**pposites', 0.58], ['**A**ttract', 0.74]];
  const lroaT = [];
  {
    const size = 58, sp = textWidth(' ', size, FD, 600);
    const ws = LW.map(([w]) => textWidth(w, size, FD, 700));
    let x = 600 - (ws.reduce((a, b) => a + b, 0) + sp * 3) / 2;
    LW.forEach(([w, f], i) => { lroaT.push({ el: T(lroaWords, x, 330, w, { size, weight: 600, boldFill: C.energy }), f }); x += ws[i] + sp; });
  }
  const iconRep = G(B), iconAtt = G(B);
  { const a = magnet(iconRep, 150, 50, { flip: true }); tr(a, -86, 0); const b = magnet(iconRep, 150, 50); tr(b, 86, 0);
    arrow(iconRep, -20, -58, -100, -58, { color: C.bad, width: 6 }); arrow(iconRep, 20, -58, 100, -58, { color: C.bad, width: 6 }); }
  { const a = magnet(iconAtt, 150, 50); tr(a, -75, 0); const b = magnet(iconAtt, 150, 50); tr(b, 75, 0);
    arrow(iconAtt, -120, -58, -30, -58, { color: C.good, width: 6 }); arrow(iconAtt, 120, -58, 30, -58, { color: C.good, width: 6 }); }
  tr(iconRep, 370, 472); tr(iconAtt, 830, 472);

  /* ======== C. snap a magnet: two magnets, then four ======== */
  const Cg = G(root);
  const CY = 410, PW = 400, PH = 90;
  const halves = [piece(Cg, PW / 2, PH, 'N', 48), piece(Cg, PW / 2, PH, 'S', 48)];
  const quarters = [piece(Cg, PW / 4, PH, 'N', 36), piece(Cg, PW / 4, PH, 'S', 36), piece(Cg, PW / 4, PH, 'N', 36), piece(Cg, PW / 4, PH, 'S', 36)];
  const cutLine = E('line', { x1: 600, y1: CY - PH / 2 - 26, x2: 600, y2: CY + PH / 2 + 26, stroke: C.ink, 'stroke-width': 4, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, Cg);
  const cutSpark = spark(Cg, 26, { seed: 3 }); tr(cutSpark, 600, CY);
  const qSparks = [spark(Cg, 18, { seed: 5 }), spark(Cg, 18, { seed: 8 })];
  const ghostN = ghostChip(Cg, 'only N?'), ghostS = ghostChip(Cg, 'only S?');
  const chipTwo = chip(Cg, 'two smaller magnets', { size: 30, fill: C.card2, stroke: C.line });
  const chipNever = chip(Cg, 'every piece has an N and an S', { size: 30, fill: C.card2, stroke: C.energy }); tr(chipNever, 600, 590);

  /* ======== D. magnetic and non-magnetic materials ======== */
  const D = G(root);
  const DM = G(D); magnet(DM, 300, 80);
  const noteAttr = G(D), noteBec = G(D);
  [[noteAttr, 'attracted to magnets', 252], [noteBec, 'can become magnets', 948]].forEach(([g, text, x]) => {
    const w = Math.ceil(textWidth(text, 28, FD, 700) + 84);
    const c = chip(g, text, { size: 28, fill: C.card2, stroke: C.good, w }); tr(c, x, 215);
    c.label.setAttribute('x', 17);
    const tk = tick(g, 11, C.good); tr(tk, x - w / 2 + 32, 216);
  });
  const SX = [270, 490, 710, 930], SY = 470;
  const samples = [
    { name: 'iron', draw: ironBar, tx: 535, ty: 262 },
    { name: 'steel', draw: g => paperclip(g, 1.35), tx: 578, ty: 266 },
    { name: 'nickel', draw: nickelDisc, tx: 622, ty: 266 },
    { name: 'cobalt', draw: cobaltLump, tx: 665, ty: 262 },
  ].map((s, i) => {
    const g = G(D); s.g = g; s.x = SX[i];
    s.art = G(g); s.draw(s.art);
    s.arrow = arrow(D, SX[i] + (s.tx - SX[i]) * 0.12, SY - 52, s.tx, s.ty + 16, { color: C.good, width: 6 });
    s.lbl = T(g, 0, 92, s.name, { size: 30, weight: 600, anchor: 'middle' });
    s.lblHi = T(g, 0, 92, '**' + s.name[0] + '**' + s.name.slice(1), { size: 30, weight: 600, anchor: 'middle', boldFill: C.energy });
    return s;
  });
  // I See No Cobwebs
  const Wb = G(D);
  card(Wb, 150, 132, 900, 168, { fill: C.card, stroke: C.line });
  const web = cobweb(Wb, 46); tr(web, 222, 216);
  const ISNC = [['**I**', 0.14], ['**S**ee', 0.2], ['**N**o', 0.26], ['**C**obwebs', 0.32]], isncT = [];
  {
    const size = 60, sp = textWidth(' ', size, FD, 600), ws = ISNC.map(([w]) => textWidth(w, size, FD, 700));
    let x = 640 - (ws.reduce((a, b) => a + b, 0) + sp * 3) / 2;
    ISNC.forEach(([w, f], i) => { isncT.push({ el: T(Wb, x, 238, w, { size, weight: 600, boldFill: C.energy }), f }); x += ws[i] + sp; });
  }
  const chipSteel = chip(D, 'steel is mostly iron', { size: 30, fill: C.card2, stroke: C.energy }); tr(chipSteel, 600, 664);
  const steelLink = E('path', { d: `M${SX[0]},${SY + 128} Q${(SX[0] + SX[1]) / 2},${SY + 168} ${SX[1]},${SY + 128}`, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' }, D);
  // not magnetic
  const notMag = rich(D, 600, 340, [['not', C.bad, 800], ' magnetic'], { size: 34, anchor: 'middle' });
  const NX = [150, 330, 510, 690, 870, 1050], NY = 486;
  const nonMag = [
    ['copper', copperCoil, 0.31], ['aluminium', g => drinkCan(g, 'Al'), 0.38], ['gold', goldRing, 0.47],
    ['plastic', plasticBrick, 0.65], ['wood', woodBlock, 0.77], ['glass', glassBlock, 0.88],
  ].map(([name, draw, f], i) => {
    const g = G(D); const art = G(g); draw(art);
    T(g, 0, 104, name, { size: 28, weight: 600, anchor: 'middle' });
    const x = cross(D, 17); return { g, x: NX[i], f, cr: x, cx: i === 0 ? 58 : 44, cy: i === 0 ? -58 : -46 };
  });
  // a paperclip is attracted, and becomes a magnet itself: it holds a second clip
  const chain = G(D);
  const chainGlow = E('ellipse', { cx: 0, cy: 0, rx: 40, ry: 62, fill: glow(C.energy) }, chain);
  const clipA = paperclip(chain, 1, true), clipB = paperclip(chain, 1, true);

  /* ======== E. recycling: the conveyor ======== */
  const Eg = G(root);
  const BELT_Y = 600, BX0 = 70, BX1 = 990;
  const bracket = G(Eg);
  E('rect', { x: 592, y: 116, width: 16, height: 84, fill: '#56636F', stroke: '#8395A3', 'stroke-width': 2 }, bracket);
  E('rect', { x: 524, y: 108, width: 152, height: 16, rx: 6, fill: '#56636F', stroke: '#8395A3', 'stroke-width': 2 }, bracket);
  const EM = G(Eg); magnet(EM, 360, 80); tr(EM, 600, 230);
  const belt = G(Eg);
  E('path', { d: `M${BX0 + 6},${BELT_Y + 40} L${BX0 + 30},${BELT_Y + 108} M${BX1 - 6},${BELT_Y + 40} L${BX1 - 30},${BELT_Y + 108} M520,${BELT_Y + 40} L520,${BELT_Y + 108}`, stroke: '#4A5763', 'stroke-width': 9, 'stroke-linecap': 'round' }, belt);
  E('rect', { x: BX0 - 18, y: BELT_Y, width: BX1 - BX0 + 36, height: 36, rx: 18, fill: '#26323C', stroke: '#6F808E', 'stroke-width': 3 }, belt);
  const beltMarks = E('line', { x1: BX0, y1: BELT_Y + 7, x2: BX1, y2: BELT_Y + 7, stroke: '#51606C', 'stroke-width': 4, 'stroke-dasharray': '16 22' }, belt);
  const rollers = [];
  for (let k = 0; k < 7; k++) { const rg = G(belt); E('circle', { r: 12, fill: '#3A4752', stroke: '#8395A3', 'stroke-width': 2.5 }, rg); E('line', { x1: -8, y1: 0, x2: 8, y2: 0, stroke: '#8395A3', 'stroke-width': 2.5 }, rg); rollers.push({ g: rg, x: BX0 + k * (BX1 - BX0) / 6 }); }
  const binBack = E('path', { d: 'M1012,628 L1148,628 L1140,712 L1020,712 Z', fill: '#1B2A35', stroke: '#6F808E', 'stroke-width': 3 }, Eg);
  const canG = G(Eg);
  const binFront = G(Eg);
  E('path', { d: 'M1006,648 L1154,648 L1142,714 L1018,714 Z', fill: ball('#3E6E8E', '#20435A'), stroke: '#9CC2D9', 'stroke-width': 3, 'stroke-linejoin': 'round' }, binFront);
  T(binFront, 1080, 688, 'Al', { size: 28, weight: 700, anchor: 'middle', fill: '#E3EEF5' });
  const recycle = chip(Eg, 'recycling centre', { size: 28, fill: C.card2, stroke: C.line }); tr(recycle, 990, 150);
  const lblSteel = rich(Eg, 392, 242, [['steel', C.good, 800], ': pulled up'], { size: 30, anchor: 'end' });
  const lblAl = rich(Eg, 1012, 470, [['aluminium', '#D7E0E7', 800], ': rolls on'], { size: 28, anchor: 'middle' });
  const T0 = at('cans'), V = 150, T1 = end('cans') - 0.1, DEC = 0.7;
  const beltDist = t => {
    if (t <= T0) return 0;
    if (t <= T1) return V * (t - T0);
    const d = Math.min(t - T1, DEC);
    return V * (T1 - T0) + V * (d - d * d / (2 * DEC));
  };
  const CANS = [
    { k: 'al', x0: 470 }, { k: 'steel', x0: 345, xs: 468 }, { k: 'al', x0: 215 }, { k: 'steel', x0: 90, xs: 732 }, { k: 'al', x0: -30 },
  ].map((c, i) => {
    c.g = G(canG); if (c.k === 'steel') steelCan(c.g); else drinkCan(c.g, 'Al');
    c.h = c.k === 'steel' ? 42 : 42;
    if (c.xs !== undefined) c.tj = T0 + (c.xs - c.x0) / V;      // when it reaches its spot under the magnet
    c.slot = [1040, 1082, 1124][Math.floor(i / 2)];
    return c;
  });

  return t => {
    /* ---------- A ---------- */
    const aA = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, at('lroa') - 0.3, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      const tR = at('repel'), tA = at('attract');
      // M1: in from the right, then the dance
      const m1in = P(t, at('magnet') - 0.1, 0.9, easeOut);
      let x1 = lerp(1380, 600, m1in) + 320 * P(t, tR - 0.1, 0.8);
      let x2 = lerp(-220, 280, P(t, tR - 0.1, 0.8));
      const ap1 = P(t, mid('repel', 0.22), mid('repel', 0.42) - mid('repel', 0.22)), sp1 = P(t, mid('repel', 0.44), 0.45, easeOut);
      const ap2 = P(t, mid('repel', 0.68), mid('repel', 0.83) - mid('repel', 0.68)), sp2 = P(t, mid('repel', 0.85), 0.45, easeOut);
      const pull = P(t, mid('attract', 0.22), mid('attract', 0.5) - mid('attract', 0.22), easeIn);
      x1 += -150 * ap1 + 130 * sp1 - 130 * ap2 + 130 * sp2 - 150 * pull;
      x2 += 150 * ap1 - 130 * sp1 + 130 * ap2 - 130 * sp2 + 150 * pull;
      const tClick = mid('attract', 0.5), bump = Math.sin(Math.PI * P(t, tClick, 0.22, linear)) * 5;
      const turnBoth = P(t, mid('repel', 0.59), 0.55), turn1 = P(t, tA - 0.05, 0.55);
      M1.set(x1 - bump, MY, turnBoth + turn1);
      M2.set(x2 + bump, MY, turnBoth);
      op(M2, P(t, tR - 0.1, 0.3, linear));
      // the paperclip slides across and clicks onto the N end
      const cIn = P(t, mid('magnet', 0.12), 0.4, linear), cp = P(t, mid('magnet', 0.16), 1.0, easeIn);
      const tStick = mid('magnet', 0.16) + 1.0, cb = Math.sin(Math.PI * P(t, tStick, 0.2, linear));
      const cOut = 1 - P(t, tR - 0.35, 0.4, linear);
      tr(clip, lerp(160, 404, cp) - 4 * cb, MY, 1, (1 - cp) * -8);
      op(clip, cIn * cOut);
      op(clickG, win(t, tStick, tStick + 0.45, 0.12) * cOut); tr(clickG, 451, MY, 0.8 + 0.4 * P(t, tStick, 0.3, easeOut));
      op(clipLbl, P(t, tStick + 0.15, 0.4, linear) * cOut);
      lblN.set(P(t, mid('magnet', 0.6), 0.45, linear) * cOut);
      lblS.set(P(t, mid('magnet', 0.8), 0.45, linear) * cOut);
      // repel arrows (N-N, then S-S), attract arrows
      const r1 = win(t, mid('repel', 0.44) - 0.05, mid('repel', 0.44) + 1.0, 0.18), r2 = win(t, mid('repel', 0.85) - 0.05, end('repel') + 0.45, 0.18);
      repA.forEach(a => { op(a, r1); a.set(P(t, mid('repel', 0.44) - 0.05, 0.35, easeOut)); });
      repB.forEach(a => { op(a, r2); a.set(P(t, mid('repel', 0.85) - 0.05, 0.35, easeOut)); });
      const aw = Math.min(P(t, mid('attract', 0.16), 0.3, linear), 1 - P(t, end('attract') + 0.3, 0.4, linear));
      attA.forEach(a => { op(a, aw); a.set(P(t, mid('attract', 0.16), 0.45)); });
      op(snap, win(t, tClick, tClick + 0.5, 0.12)); tr(snap, 600, MY, 0.85 + 0.3 * P(t, tClick, 0.35, easeOut));
      // chips
      const cr = P(t, mid('repel', 0.22), 0.5, pop), ca = P(t, mid('attract', 0.1), 0.5, pop);
      op(chipRep, clamp(cr * 2) * (1 - clamp(ca * 2))); tr(chipRep, 600, 548, Math.max(0.01, 0.85 + 0.15 * cr));
      op(chipAtt, clamp(ca * 2)); tr(chipAtt, 600, 548, Math.max(0.01, 0.85 + 0.15 * ca));
    }

    /* ---------- B ---------- */
    const aB = win(t, at('lroa') - 0.15, at('cut') - 0.05, 0.4);
    op(B, aB);
    if (aB > 0) {
      const cp = P(t, at('lroa') - 0.15, 0.6, easeOut);
      B.setAttribute('transform', `translate(600 392) scale(${(0.92 + 0.08 * cp).toFixed(3)}) translate(-600 -392)`);
      lroaT.forEach(w => { const p = P(t, mid('lroa', w.f) - 0.25, 0.35, easeOut); op(w.el, p); w.el.setAttribute('transform', `translate(0 ${((1 - p) * 14).toFixed(1)})`); });
      const pr = P(t, mid('lroa', 0.3), 0.5, pop), pa = P(t, mid('lroa', 0.62), 0.5, pop);
      op(iconRep, clamp(pr * 2)); tr(iconRep, 370, 472 + (1 - clamp(pr)) * 20);
      op(iconAtt, clamp(pa * 2)); tr(iconAtt, 830, 472 + (1 - clamp(pa)) * 20);
    }

    /* ---------- C ---------- */
    const aC = win(t, at('cut') - 0.1, at('materials') - 0.15, 0.4);
    op(Cg, aC);
    if (aC > 0) {
      const tSnap = mid('cut', 0.3), part = P(t, tSnap + 0.05, 0.7, easeOut);
      const rec = P(t, mid('two', 0.07), 0.9);
      const tQ = mid('two', 0.52), qsplit = P(t, tQ + 0.05, 0.6, easeOut), qrec = P(t, tQ + 0.45, 0.8);
      const nudge = P(t, mid('two', 0.82), 0.7);
      const useQ = t >= tQ;
      // halves: 500 / 700 when whole, apart to 440 / 760
      const hx = [lerp(500, 440, part), lerp(700, 760, part)];
      halves.forEach((h, i) => { op(h, useQ ? 0 : 1); tr(h, hx[i], CY); h.set(rec); });
      // quarters: start where the halves' own halves are, split apart, then nudge back together
      const q0 = [hx[0] - 50, hx[0] + 50, hx[1] - 50, hx[1] + 50];
      const qApart = [hx[0] - 75, hx[0] + 75, hx[1] - 75, hx[1] + 75], qNear = [414, 538, 662, 786];
      quarters.forEach((q, i) => {
        op(q, useQ ? 1 : 0);
        const x = lerp(lerp(q0[i], qApart[i], qsplit), qNear[i], nudge);
        tr(q, x, CY); q.set(qrec);
      });
      const cl = P(t, mid('cut', 0.08), 0.6, linear);
      op(cutLine, cl * (1 - P(t, tSnap, 0.2, linear)));
      cutLine.setAttribute('stroke-dashoffset', (-t * 20).toFixed(1));
      op(cutSpark, Math.sin(Math.PI * P(t, tSnap - 0.1, 0.7, linear))); cutSpark.upd(t); tr(cutSpark, 600, CY, 0.6 + 0.8 * P(t, tSnap - 0.1, 0.5, easeOut));
      qSparks.forEach((s, i) => { op(s, Math.sin(Math.PI * P(t, tQ - 0.1, 0.6, linear))); s.upd(t + i); tr(s, hx[i], CY, 0.6 + 0.6 * P(t, tQ - 0.1, 0.5, easeOut)); });
      // ghost chips appear, then shatter
      const gN = P(t, mid('cut', 0.66), 0.4, linear), gS = P(t, mid('cut', 0.84), 0.4, linear), sh = P(t, at('two') + 0.05, 0.75, linear);
      const bobN = calm * 5 * Math.sin(t * 2.2), bobS = calm * 5 * Math.sin(t * 2.2 + 1.4);
      op(ghostN, gN); tr(ghostN, hx[0], CY - 112 + bobN); ghostN.shatter(sh);
      op(ghostS, gS); tr(ghostS, hx[1], CY - 112 + bobS); ghostS.shatter(sh);
      const ct = win(t, mid('two', 0.2), tQ + 0.2, 0.35);
      op(chipTwo, ct); tr(chipTwo, 600, CY - 120 + (1 - P(t, mid('two', 0.2), 0.5, easeOut)) * 14);
      const cn = P(t, mid('two', 0.58), 0.5, pop);
      op(chipNever, clamp(cn * 2)); tr(chipNever, 600, 590, Math.max(0.01, 0.85 + 0.15 * cn));
    }

    /* ---------- D ---------- */
    const aD = win(t, at('materials') - 0.1, at('cans') - 0.15, 0.4);
    op(D, aD);
    if (aD > 0) {
      const tW = at('cobwebs'), tM = at('metals');
      const magIn = P(t, at('materials') - 0.1, 0.7, easeOut), magOff = win(t, tW - 0.3, tM - 0.2, 0.4);
      tr(DM, 600, lerp(150, 215, magIn)); op(DM, magIn * (1 - magOff));
      op(noteAttr, P(t, mid('materials', 0.27), 0.4, linear) * (1 - P(t, tW - 0.3, 0.4, linear)));
      op(noteBec, P(t, mid('materials', 0.44), 0.4, linear) * (1 - P(t, tW - 0.3, 0.4, linear)));
      // the big four: pulled towards the magnet, then they rise to sit under the mnemonic
      const up = P(t, tW - 0.1, 0.8), sOut = 1 - P(t, tM - 0.3, 0.4, linear);
      samples.forEach((s, i) => {
        const f = [0.7, 0.78, 0.86, 0.93][i], p = P(t, mid('materials', f) - 0.1, 0.5, pop);
        const pull = P(t, mid('materials', f) + 0.2, 0.5, easeOut) * (1 - up);
        const dx = s.tx - s.x, dy = s.ty - SY, L = Math.hypot(dx, dy);
        tr(s.g, s.x + dx / L * 14 * pull, lerp(SY, 430, up) + dy / L * 14 * pull + (1 - clamp(p)) * 24);
        op(s.g, clamp(p * 2) * sOut);
        tr(s.art, 0, 0, Math.max(0.01, 0.7 + 0.3 * p) * (1 + 0.1 * Math.sin(Math.PI * P(t, mid('cobwebs', 0.45 + i * 0.075), 0.4, linear))));
        op(s.arrow, P(t, mid('materials', f) + 0.1, 0.3, linear) * (1 - P(t, tW - 0.3, 0.3, linear)));
        s.arrow.set(P(t, mid('materials', f) + 0.1, 0.5));
        const hi = P(t, mid('cobwebs', 0.45 + i * 0.075), 0.3, linear);
        op(s.lbl, 1 - hi); op(s.lblHi, hi);
      });
      const wb = win(t, tW - 0.1, tM - 0.2, 0.4);
      op(Wb, wb);
      if (wb > 0) {
        isncT.forEach(w => { const p = P(t, mid('cobwebs', w.f), 0.35, easeOut); op(w.el, p); w.el.setAttribute('transform', `translate(0 ${((1 - p) * 14).toFixed(1)})`); });
        const wp = P(t, mid('cobwebs', 0.36), 0.6, pop); op(web, clamp(wp * 2)); tr(web, 222, 216, Math.max(0.01, wp), 20 * (1 - wp));
      }
      const cs = P(t, mid('cobwebs', 0.76), 0.5, pop);
      op(chipSteel, clamp(cs * 2) * sOut); tr(chipSteel, 600, 664, Math.max(0.01, 0.85 + 0.15 * cs));
      op(steelLink, P(t, mid('cobwebs', 0.8), 0.4, linear) * sOut);
      // not all metals: they slide up and stay put
      const nm = P(t, tM - 0.1, 0.4, linear);
      op(notMag, P(t, mid('metals', 0.1), 0.4, linear));
      nonMag.forEach(o => {
        const p = P(t, mid('metals', o.f) - 0.15, 0.55, easeOut);
        tr(o.g, o.x, lerp(NY + 90, NY, p)); op(o.g, clamp(p * 3) * nm);
        const c = P(t, mid('metals', o.f) + 0.35, 0.4, pop);
        op(o.cr, clamp(c * 2) * nm); tr(o.cr, o.x + o.cx, NY + o.cy, Math.max(0.01, c));
      });
      // the clip chain: attracted (first clip jumps up), then magnetised (it holds the second)
      const chA = P(t, mid('materials', 0.27), 0.32, easeIn), chB = P(t, mid('materials', 0.46), 0.32, easeIn);
      const chOn = P(t, mid('materials', 0.22), 0.3, linear) * (1 - P(t, mid('materials', 0.66), 0.3, linear));
      op(chain, chOn);
      if (chOn > 0) {
        const bA = Math.sin(Math.PI * P(t, mid('materials', 0.27) + 0.32, 0.2, linear)), bB = Math.sin(Math.PI * P(t, mid('materials', 0.46) + 0.32, 0.2, linear));
        tr(clipA, 0, lerp(250, 38, chA) + 3 * bA, 1, (1 - chA) * 25);
        tr(clipB, 0, lerp(285, 104, chB) + 3 * bB, 1, (1 - chB) * -25);
        op(chainGlow, P(t, mid('materials', 0.46) + 0.25, 0.4, linear) * (0.55 + 0.25 * wave(t, 1.2)));
        tr(chainGlow, 0, 40);
        tr(chain, 494, 255);
      }
    }

    /* ---------- E ---------- */
    const aE = P(t, at('cans') - 0.15, 0.45, linear);
    op(Eg, aE);
    if (aE > 0) {
      const dist = beltDist(t);
      beltMarks.setAttribute('stroke-dashoffset', (-dist).toFixed(1));
      rollers.forEach(r => tr(r.g, r.x, BELT_Y + 18, 1, (dist / 12 * 180 / Math.PI) % 360));
      CANS.forEach(c => {
        let x = c.x0 + dist, y = BELT_Y - c.h, rot = 0, show = clamp((x - (BX0 - 30)) / 40);
        if (c.k === 'steel' && t >= c.tj) {
          const j = P(t, c.tj, 0.36, easeIn), b = Math.sin(Math.PI * P(t, c.tj + 0.36, 0.2, linear));
          x = c.xs; y = lerp(BELT_Y - c.h, 270 + c.h, j) + 3 * b;
        } else if (c.k === 'al' && x > BX1) {
          const over = x - BX1, f = clamp(over / 70);
          x = lerp(BX1, c.slot, f); y = BELT_Y - c.h + 110 * f * f; rot = 12 * Math.sin(Math.PI * f);
        }
        tr(c.g, x, y, 1, rot); op(c.g, show);
      });
      op(recycle, P(t, mid('cans', 0.05), 0.4, linear));
      op(lblSteel, P(t, mid('cans', 0.3), 0.4, linear));
      op(lblAl, P(t, mid('cans', 0.6), 0.4, linear));
    }
  };
});

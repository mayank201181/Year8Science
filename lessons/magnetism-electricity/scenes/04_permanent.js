/* Permanent and temporary magnets.
   Two columns: a fridge magnet and a steel bar (permanent) | an iron nail that holds paperclips
   only while a magnet is near (temporary). Then one steel bar, zoomed in: its domains point every
   which way; a magnet strokes it three times and they turn, then all swing into line (showpiece)
   and the bar becomes N | S. Heat, a hammer and a slow pull out of an AC coil jumble them again.
   Last, an iron bar's domains snap into line and jumble at once, and a light switch turns it off. */
scene('permanent', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const RED = '#E8424F', BLUE = '#3B82F6', COPPER = '#D9893F', COPPER_DK = '#8A5426', CLIPC = '#C3CEDA';

  /* ---------- helpers ---------- */
  const lerpAng = (a, b, p) => a + ((((b - a) % 360) + 540) % 360 - 180) * p;
  const CLIP_D = 'M5,-18 L5,22 A5,5 0 0 1 -5,22 L-5,-26 A8,8 0 0 1 11,-26 L11,26 A11,11 0 0 1 -11,26 L-11,-10';
  function clip(parent) { const g = G(parent); E('path', { d: CLIP_D, fill: 'none', stroke: CLIPC, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
  // an iron nail, point on the right, centred, 420 x 26
  function nail(parent) {
    const g = G(parent), steel = linGrad('#DCE4EA', '#66737F', true);
    E('path', { d: 'M-200,-13 L168,-13 L212,0 L168,13 L-200,13 Z', fill: steel, stroke: '#EEF3F6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -214, y: -27, width: 16, height: 54, rx: 5, fill: steel, stroke: '#EEF3F6', 'stroke-width': 2 }, g);
    E('path', { d: 'M-194,-6 L160,-6', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* a coil of n turns along x (x0..x1) around y = 0, radius R. Back halves go in `backG`, front
     halves in `frontG` (draw the core between them). Current running from x0 to x1 goes down the
     front of each turn. Returns samples [[x, y, frontVisible]] for current dots. */
  function coil(backG, frontG, o) {
    const n = o.turns, R = o.R, yaw = o.yaw !== undefined ? o.yaw : 0.3, ww = o.wire || 5;
    const th0 = Math.PI, th1 = Math.PI + TAU * n;
    const X = th => o.x0 + (o.x1 - o.x0) * (th - th0) / (th1 - th0) + R * yaw * Math.sin(th), Y = th => -R * Math.cos(th);
    let db = '', df = '';
    for (let k = 0; k < 2 * n; k++) {
      const a = th0 + k * Math.PI; let d = '';
      for (let i = 0; i <= 10; i++) { const th = a + Math.PI * i / 10; d += (i ? 'L' : 'M') + X(th).toFixed(1) + ',' + Y(th).toFixed(1); }
      if (k % 2) df += d; else db += d;
    }
    E('path', { d: db, fill: 'none', stroke: o.dark || COPPER_DK, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, backG);
    E('path', { d: df, fill: 'none', stroke: o.color || COPPER, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, frontG);
    const out = [];
    for (let th = th0; th <= th1 + 1e-6; th += Math.PI / 12) out.push([X(th), Y(th), Math.sin(th) > 0.08 ? 1 : 0]);
    return out;
  }
  // dots riding a polyline [[x, y, vis]] by arc length
  function track(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, L: cum[cum.length - 1] };
  }
  const TQ = [0, 0, 0];                      // trackAt's result, reused (read it straight away)
  function trackAt(tk, s) {
    s = ((s % tk.L) + tk.L) % tk.L;
    let lo = 0, hi = tk.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tk.cum[m] <= s) lo = m; else hi = m; }
    const a = tk.pts[lo], b = tk.pts[hi], f = (s - tk.cum[lo]) / ((tk.cum[hi] - tk.cum[lo]) || 1);
    TQ[0] = a[0] + (b[0] - a[0]) * f; TQ[1] = a[1] + (b[1] - a[1]) * f; TQ[2] = Math.min(a[2], b[2]);
    return TQ;
  }
  function dots(parent, tk, spacing, r) {
    const n = Math.max(2, Math.round(tk.L / spacing)), els = [];
    for (let k = 0; k < n; k++) els.push(E('circle', { r: r || 5, fill: C.energy }, parent));
    return s0 => els.forEach((d, k) => { const q = trackAt(tk, k * tk.L / n + s0); attr(d, 'cx', q[0]); attr(d, 'cy', q[1]); op(d, q[2]); });
  }
  // kit magnet turned by `rot` degrees, with its N and S letters kept upright
  function turnedMagnet(parent, w, h, rot, o) {
    const g = magnet(parent, w, h, o);
    g.querySelectorAll('text').forEach(tx => { const x = +tx.getAttribute('x'), y = +tx.getAttribute('y') - h * 0.55 * 0.36; tx.setAttribute('transform', `rotate(${-rot} ${x} ${y.toFixed(1)})`); });
    g.rot = rot;
    return g;
  }
  /* domain grid: rows x cols arrows inside a w x h box with its top-left at (0,0). Each arrow is an
     ink shaft with a red head (its north end). g.place(i, angle) sets arrow i (degrees, 0 = right). */
  function domainGrid(parent, cols, rows, w, h, len, seed) {
    const g = G(parent), rr = rng(seed), A = [], cw = w / cols, ch = h / rows, hs = len * 0.3;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cw, y = (r + 0.5) * ch;
      const sh = E('line', { x1: -len / 2, y1: 0, x2: len / 2 - hs * 0.8, y2: 0, stroke: C.ink, 'stroke-width': Math.max(3, len * 0.1), 'stroke-linecap': 'round' }, g);
      const hd = E('path', { d: `M${len / 2},0 L${len / 2 - hs},${-hs * 0.64} L${len / 2 - hs},${hs * 0.64} Z`, fill: RED, 'stroke-linejoin': 'round' }, g);
      A.push({ sh, hd, c, r, x, y, a: [rr() * 360, rr() * 360, rr() * 360, rr() * 360], ph: rr() * TAU, d: rr() });
    }
    g.A = A; g.cw = cw; g.ch = ch;
    g.place = (i, ang) => { const o = A[i], v = `translate(${o.x.toFixed(1)} ${o.y.toFixed(1)}) rotate(${ang.toFixed(1)})`; o.sh.setAttribute('transform', v); o.hd.setAttribute('transform', v); };
    return g;
  }
  function barBody(parent, w, h, fill) {
    const g = G(parent);
    g.body = E('rect', { x: 0, y: 0, width: w, height: h, rx: Math.min(16, h * 0.18), fill, stroke: '#9AA8B5', 'stroke-width': 3 }, g);
    g.tintN = E('rect', { x: 0, y: 0, width: w * 0.16, height: h, rx: Math.min(16, h * 0.18), fill: RED, opacity: 0.38 }, g);
    g.tintS = E('rect', { x: w * 0.84, y: 0, width: w * 0.16, height: h, rx: Math.min(16, h * 0.18), fill: BLUE, opacity: 0.38 }, g);
    return g;
  }
  const STEELF = linGrad('#4F5C69', '#29323B', true), IRONF = linGrad('#6A7784', '#3A444F', true);

  /* ================= A. two columns ================= */
  const colL = G(root), colR = G(root), divider = G(root);
  E('line', { x1: 600, y1: 140, x2: 600, y2: 690, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '10 10' }, divider);
  const hL = T(colL, 300, 176, 'permanent', { size: 46, weight: 700, anchor: 'middle' });
  const hR = T(colR, 900, 176, 'temporary', { size: 46, weight: 700, anchor: 'middle' });

  // fridge door with a drawing held up by two fridge magnets
  const fridge = G(colL); tr(fridge, 300, 350);
  E('rect', { x: -128, y: -138, width: 256, height: 276, rx: 22, fill: linGrad('#F4F8FA', '#C5D2DC', true), stroke: '#9FB2C0', 'stroke-width': 3 }, fridge);
  E('rect', { x: 96, y: -92, width: 13, height: 156, rx: 6.5, fill: '#9FB2C0' }, fridge);
  const pic = G(fridge);
  E('rect', { x: -100, y: -104, width: 158, height: 124, fill: '#FFFFFF', stroke: '#D3DDE4', 'stroke-width': 2 }, pic);
  E('circle', { cx: 22, cy: -72, r: 14, fill: '#FFC247' }, pic);
  E('path', { d: 'M22,-96 L22,-90 M22,-54 L22,-48 M-2,-72 L4,-72 M40,-72 L46,-72', stroke: '#FFC247', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, pic);
  E('path', { d: 'M-78,-8 L-78,-44 L-54,-66 L-30,-44 L-30,-8 Z', fill: '#FF8A94', stroke: '#C2415A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, pic);
  E('rect', { x: -60, y: -30, width: 13, height: 22, fill: '#7A3B22' }, pic);
  E('path', { d: 'M-92,4 Q-40,-6 48,4', fill: 'none', stroke: '#3FB87A', 'stroke-width': 6, 'stroke-linecap': 'round' }, pic);
  const fm1 = G(fridge), fm2 = G(fridge);
  E('circle', { r: 16, fill: ball('#FF6B7D', '#B7283C') }, fm1);
  E('path', { d: 'M0,-17 L5,-6 L17,-5 L8,3 L11,15 L0,9 L-11,15 L-8,3 L-17,-5 L-5,-6 Z', fill: ball('#7CE0B0', '#2E9C68'), stroke: '#2E9C68', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, fm2);
  const clockG = G(colL); tr(clockG, 118, 534);
  E('circle', { r: 24, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, clockG);
  const clockHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -16, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, clockG);
  E('circle', { r: 3.5, fill: C.energy }, clockG);
  const keepChip = chip(colL, 'keeps its magnetism', { size: 30, fill: C.card2, stroke: C.line }); tr(keepChip, 318, 534);
  const steelBar = G(colL); tr(steelBar, 300, 622);
  E('rect', { x: -115, y: -22, width: 230, height: 44, rx: 8, fill: linGrad('#8C99A6', '#46525D', true), stroke: '#B4C0CB', 'stroke-width': 2 }, steelBar);
  T(steelBar, -92, 10, 'N', { size: 28, weight: 700, anchor: 'middle', fill: '#FF8A94' });
  T(steelBar, 92, 10, 'S', { size: 28, weight: 700, anchor: 'middle', fill: '#8AB6FF' });
  const steelLab = labelLine(colL, 470, 632, 418, 622, 'steel', { size: 32, weight: 700 });

  // right column: an iron nail holds clips only while a magnet is near
  const ironNail = nail(colR); tr(ironNail, 950, 300, 0.62);
  const tMag = magnet(colR, 140, 48, { flip: true });
  const NTIP = [950 + 212 * 0.62, 301];
  const rClips = [0, 1, 2].map(i => ({ g: clip(colR), hx: 1012 + i * 44, hy: 486 + (i % 2) * 8, hr: 84 + i * 14 + (i === 1 ? 180 : 0) }));
  const coilCard = G(colR);
  card(coilCard, 710, 528, 380, 96, { fill: C.card, stroke: C.line, rx: 18 });
  const ccIcon = G(coilCard); tr(ccIcon, 790, 576);
  const ccBack = G(ccIcon), ccCore = G(ccIcon), ccFront = G(ccIcon), ccDots = G(ccIcon);
  { const n = nail(ccCore); tr(n, 0, 0, 0.27); }
  const ccPts = coil(ccBack, ccFront, { turns: 5, x0: -34, x1: 26, R: 13, wire: 3.5 });
  const ccTrack = track(ccPts), ccRun = dots(ccDots, ccTrack, 14, 3);
  T(coilCard, 858, 568, 'or inside a coil', { size: 27, weight: 600 });
  T(coilCard, 858, 602, 'with a current', { size: 27, weight: 600 });
  const softChip = chip(colR, 'pure iron: temporary (soft)', { size: 30, fill: C.card2, stroke: C.line }); tr(softChip, 900, 670);

  /* ================= B. the big bar and its domains ================= */
  const BX0 = 120, BY0 = 290, BW = 960, BH = 260;
  const big = G(root);
  const bigBar = barBody(big, BW, BH, STEELF); tr(bigBar, BX0, BY0);
  // faint walls between the domains, as one path
  let wallD = '';
  for (let c = 1; c < 12; c++) wallD += `M${BX0 + c * BW / 12},${BY0 + 6} L${BX0 + c * BW / 12},${BY0 + BH - 6} `;
  for (let r = 1; r < 6; r++) wallD += `M${BX0 + 6},${BY0 + r * BH / 6} L${BX0 + BW - 6},${BY0 + r * BH / 6} `;
  const walls = E('path', { d: wallD, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 1.5, opacity: 0.08 }, big);
  const grid = domainGrid(big, 12, 6, BW, BH, 46, 31); tr(grid, BX0, BY0);
  const bigLab = T(root, BX0 + 4, BY0 - 18, 'steel', { size: 32, weight: 700, fill: C.muted });
  const oneCell = E('rect', { x: BX0 + 9 * BW / 12 + 3, y: BY0 + 3, width: BW / 12 - 6, height: BH / 6 - 6, rx: 10, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, root);
  const domLab = labelLine(root, 990, 238, BX0 + 9.5 * BW / 12, BY0 + 4, 'domains', { size: 34, weight: 700, fill: C.energy, line: C.energy, anchor: 'start' });
  const cancelChip = chip(root, 'cancel out: no overall magnet', { size: 30, fill: C.card2, stroke: C.line }); tr(cancelChip, 600, 628);
  // stroking magnet, N end down
  const sMag = turnedMagnet(root, 140, 50, -90);
  const sameChip = G(root);
  { const c = chip(sameChip, 'same direction', { size: 30, fill: C.card2, stroke: C.line }); tr(c, 300, 628); const a = arrow(sameChip, 300 + c.w / 2 + 18, 628, 300 + c.w / 2 + 88, 628, { color: C.energy, width: 6 }); a.set(1); }
  const orCoil = G(root);
  card(orCoil, 642, 590, 438, 76, { fill: C.card, stroke: C.line, rx: 38 });
  const ocB = G(orCoil), ocCore = G(orCoil), ocF = G(orCoil), ocD = G(orCoil);
  E('rect', { x: 672, y: 618, width: 84, height: 20, rx: 4, fill: '#7D8A97' }, ocCore);
  const ocPts = coil(ocB, ocF, { turns: 5, x0: 680, x1: 746, R: 17, wire: 3.5 }).map(p => [p[0], p[1] + 628, p[2]]);
  const ocRun = dots(ocD, track(ocPts), 14, 3);
  tr(ocB, 0, 628); tr(ocF, 0, 628);
  T(orCoil, 776, 638, 'or a coil with a current', { size: 28, weight: 600 });
  const alignChip = chip(root, 'all pointing the same way', { size: 30, fill: C.card2, stroke: C.line }); tr(alignChip, 600, 628);
  const magnetChip = chip(root, 'the steel is now a magnet', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(magnetChip, 600, 628);
  const bigN = T(root, BX0 - 40, BY0 + BH / 2 + 22, 'N', { size: 62, weight: 700, anchor: 'middle', fill: '#FF6B7D' });
  const bigS = T(root, BX0 + BW + 40, BY0 + BH / 2 + 22, 'S', { size: 62, weight: 700, anchor: 'middle', fill: '#6FA3FF' });

  /* ================= C. three ways to demagnetise ================= */
  const Dg = G(root);
  const demChip = chip(Dg, 'demagnetise: jumble the domains', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(demChip, 600, 150);
  const MW = 230, MH = 84, MY = 420;
  const PAN = [
    { x0: 30, w: 300, cx: 180, label: 'heat it' },
    { x0: 350, w: 300, cx: 500, label: 'hammer it' },
    { x0: 670, w: 500, cx: 807, label: 'slowly out of an AC coil', lx: 920 },
  ].map((p, i) => {
    p.g = G(Dg);
    card(p.g, p.x0, 205, p.w, 425, { fill: C.card, stroke: C.line });
    p.lab = T(p.g, p.lx || p.cx, 256, p.label, { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
    p.back = G(p.g); p.core = G(p.g); p.front = G(p.g); p.top = G(p.g);
    p.bar = barBody(p.core, MW, MH, STEELF);
    p.grid = domainGrid(p.core, 6, 3, MW, MH, 30, 50 + i * 7); tr(p.grid, 0, 0);
    tr(p.bar, p.cx - MW / 2, MY - MH / 2); tr(p.grid, p.cx - MW / 2, MY - MH / 2);
    return p;
  });
  // panel 1: a Bunsen flame under the bar
  const burner = bunsen(PAN[0].back, 0.62); tr(burner, 180, 608);
  // panel 2: a hammer pivoting at its handle's end
  const ham = G(PAN[1].top);
  E('rect', { x: -110, y: -7, width: 112, height: 14, rx: 6, fill: linGrad('#C98A52', '#8A5426', true) }, ham);
  E('rect', { x: -126, y: -27, width: 30, height: 56, rx: 6, fill: linGrad('#C9D3DC', '#66737F'), stroke: '#EEF3F6', 'stroke-width': 2 }, ham);
  const bang = G(PAN[1].top); tr(bang, 498, 376);
  E('path', { d: 'M-46,-8 L-70,-20 M-40,-26 L-56,-48 M46,-8 L70,-20 M40,-26 L56,-48 M0,-40 L0,-64', stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, bang);
  // panel 3: the bar inside a coil fed with alternating current
  const p3 = PAN[2];
  const acPts = coil(p3.back, p3.front, { turns: 7, x0: 690, x1: 925, R: 54, yaw: 0.22, wire: 5 }).map(p => [p[0], p[1] + MY, p[2]]);
  tr(p3.back, 0, MY); tr(p3.front, 0, MY);
  // p3.back/p3.front are shifted by MY; the core bar lives in p3.core at stage coordinates
  const acDots = G(p3.g), acRun = dots(acDots, track(acPts), 26, 4.5);
  const acBox = G(p3.g);
  E('path', { d: `M690,${MY + 54} L690,548 L747,548 M925,${MY + 54} L925,548 L867,548`, fill: 'none', stroke: COPPER, 'stroke-width': 5, 'stroke-linejoin': 'round' }, acBox);
  card(acBox, 747, 522, 120, 52, { fill: C.bg0, stroke: C.muted, rx: 12 });
  const acWave = sineWave(acBox, { w: 92, amp: 12, wl: 46, color: C.energy, width: 4 }); tr(acWave, 761, 548);
  T(acBox, 807, 606, 'alternating current', { size: 27, weight: 600, anchor: 'middle' });

  /* ================= D. iron: lines up easily, jumbles easily ================= */
  const iMag = magnet(root, 160, 52, { flip: true });
  const easyUp = T(root, 660, 282, 'lines up easily', { size: 32, weight: 700, anchor: 'middle', fill: C.good });
  const easyDown = T(root, 660, 576, 'jumbles easily', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA2' });
  const badChip = G(root);
  { const c = chip(badChip, 'bad at staying magnetic', { size: 28, fill: C.card2, stroke: C.line }); tr(c, 290, 640); const x = cross(badChip, 12); tr(x, 290 - c.w / 2 - 26, 640); }
  const goodChip = G(root);
  { const c = chip(goodChip, 'perfect to switch off', { size: 28, fill: C.card2, stroke: C.good }); tr(c, 724, 640); const k = tick(goodChip, 13); tr(k, 724 - c.w / 2 - 26, 642); }
  // a short coil around the iron bar's right end, wired to a light switch
  const ICX = [956, 1064], IAX = 414;
  const icB = G(root), icF = G(root), icD = G(root);
  root.insertBefore(icB, big);
  const icPts = coil(icB, icF, { turns: 4, x0: ICX[0], x1: ICX[1], R: 132, yaw: 0.16, wire: 6 }).map(p => [p[0], p[1] + IAX, p[2]]);
  tr(icB, 0, IAX); tr(icF, 0, IAX);
  const icRun = dots(icD, track(icPts), 34, 5.5);
  const sw = G(root);
  E('path', { d: `M${ICX[0]},${IAX + 132} L${ICX[0]},598 L986,598 M${ICX[1]},${IAX + 132} L${ICX[1]},598 L1034,598`, fill: 'none', stroke: COPPER, 'stroke-width': 5, 'stroke-linejoin': 'round' }, sw);
  E('rect', { x: 970, y: 584, width: 80, height: 108, rx: 14, fill: linGrad('#F4F8FA', '#C9D5DE', true), stroke: '#9FB2C0', 'stroke-width': 3 }, sw);
  E('rect', { x: 994, y: 606, width: 32, height: 64, rx: 8, fill: '#DDE6EC', stroke: '#9FB2C0', 'stroke-width': 2 }, sw);
  const lever = E('rect', { x: 997, y: 609, width: 26, height: 30, rx: 6, fill: '#FFFFFF', stroke: '#8FA3B2', 'stroke-width': 2 }, sw);
  const swOn = T(sw, 1066, 648, 'on', { size: 30, weight: 700, fill: C.good });
  const swOff = T(sw, 1066, 648, 'off', { size: 30, weight: 700, fill: '#FF9AA2' });

  return t => {
    /* ---------- A. columns ---------- */
    const aCols = 1 - P(t, at('domains') - 0.25, 0.5, linear);
    op(divider, P(t, S.first - 0.1, 0.5, linear) * aCols);
    op(colL, aCols); op(colR, aCols);
    if (aCols > 0) {
      op(hL, P(t, S.first, 0.4, linear));
      const fp = P(t, S.first + 0.1, 0.6, pop);
      op(fridge, clamp(fp * 2)); tr(fridge, 300, 350 + (1 - clamp(fp)) * 20, Math.max(0.01, 0.94 + 0.06 * fp));
      const snap = P(t, mid('perm', 0.13), 0.45, pop);
      op(pic, clamp(snap * 3)); tr(pic, 0, (1 - clamp(snap)) * -24, 1, -3);
      [[fm1, -96, -100], [fm2, 54, -102]].forEach(([m, x, y], i) => { const p = P(t, mid('perm', 0.13) + 0.1 + i * 0.12, 0.4, pop); op(m, clamp(p * 2)); tr(m, x, y, Math.max(0.01, 1.4 - 0.4 * p)); });
      const kp = P(t, mid('perm', 0.4), 0.5, pop);
      op(keepChip, clamp(kp * 2)); tr(keepChip, 318, 534 + (1 - clamp(kp)) * 14);
      op(clockG, clamp(kp * 2));
      clockHand.setAttribute('transform', `rotate(${((t - mid('perm', 0.4)) * 240 * Math.max(0, Math.sign(t - mid('perm', 0.4))) % 360).toFixed(1)})`);
      const sp = P(t, mid('perm', 0.64), 0.5, pop);
      op(steelBar, clamp(sp * 2)); tr(steelBar, 300, 622 + (1 - clamp(sp)) * 14);
      steelLab.set(P(t, mid('perm', 0.68), 0.4, linear));

      // temporary: the nail, a magnet that comes and goes, clips that follow it
      op(hR, P(t, at('temp'), 0.4, linear));
      const np = P(t, at('temp') + 0.1, 0.5, pop);
      op(ironNail, clamp(np * 2)); tr(ironNail, 950, 300 + (1 - clamp(np)) * 16, 0.62);
      op(softChip, P(t, mid('temp', 0.2), 0.4, linear)); tr(softChip, 900, 670 + (1 - P(t, mid('temp', 0.2), 0.5, easeOut)) * 14);
      const mIn = P(t, mid('temp', 0.3), 0.7), mOut = P(t, mid('temp', 0.74), 0.7);
      tr(tMag, lerp(lerp(678, 746, mIn), 678, mOut), 300);
      op(tMag, P(t, mid('temp', 0.28), 0.3, linear) * (1 - P(t, mid('temp', 0.74) + 0.35, 0.35, linear)));
      const clipOn = P(t, at('temp') + 0.2, 0.4, linear);
      let px = NTIP[0], py = NTIP[1];
      rClips.forEach((c, i) => {
        let x = c.hx, y = c.hy, r = c.hr;
        if (i < 2) {
          const ccx = px - 3, ccy = py + 32; px = ccx; py = ccy + 35;
          const u = P(t, mid('temp', 0.36) + i * 0.28, 0.4, linear), target = c.hr > 180 ? 360 : 0;
          if (u > 0) { const e = ease(u); x = lerp(c.hx, ccx, e); y = lerp(c.hy, ccy, e) - Math.sin(Math.PI * e) * 40; r = lerp(c.hr, target, e); }
          const f = clamp((t - mid('temp', 0.76) - (1 - i) * 0.04) / 0.55);
          if (f > 0 && u >= 1) { const yb = f < 0.72 ? Math.pow(f / 0.72, 2) : 1 - 0.14 * Math.sin(Math.PI * (f - 0.72) / 0.28); x = lerp(ccx, c.hx, ease(f)); y = lerp(ccy, c.hy, yb); r = lerp(target, c.hr, ease(f)); }
        }
        tr(c.g, x, y, 1, r); op(c.g, clipOn);
      });
      const cc = P(t, mid('temp', 0.5), 0.5, pop);
      op(coilCard, clamp(cc * 2)); tr(coilCard, 0, (1 - clamp(cc)) * 16);
      ccRun((t - mid('temp', 0.5)) * 30);
    }

    /* ---------- B. the big bar ---------- */
    const tZ = at('domains') - 0.15;
    const aBig = P(t, tZ, 0.3, linear) * (1 - P(t, at('demag') - 0.15, 0.4, linear)) + P(t, at('iron') - 0.2, 0.4, linear);
    op(big, aBig); op(bigLab, aBig);
    const isIron = t >= at('iron') - 0.25;
    if (aBig > 0) {
      // zoom from the small steel bar; iron later sits a little further right
      const z = P(t, tZ, 0.95);
      let tf;
      if (isIron) tf = `translate(240 300) scale(0.875) translate(${-BX0} ${-BY0})`;
      else tf = `translate(${lerp(185, BX0, z).toFixed(1)} ${lerp(600, BY0, z).toFixed(1)}) scale(${lerp(230 / BW, 1, z).toFixed(4)} ${lerp(44 / BH, 1, z).toFixed(4)}) translate(${-BX0} ${-BY0})`;
      big.setAttribute('transform', tf);
      if (bigLab._iron !== isIron) {
        bigLab._iron = isIron;
        bigBar.body.setAttribute('fill', isIron ? IRONF : STEELF);
        setText(bigLab, isIron ? 'iron' : 'steel');
        attr(bigLab, 'x', isIron ? 244 : BX0 + 4); attr(bigLab, 'y', isIron ? 284 : BY0 - 18);
      }
      const gridOn = isIron ? 1 : P(t, mid('domains', 0.1), 0.7, linear);
      op(grid, gridOn); op(walls, gridOn);

      // alignment of each arrow
      const tS0 = mid('stroke', 0.08), SL = 1.15, SB = 0.7, SX0 = 190, SX1 = 1010;
      const tL0 = mid('line', 0.04);
      const I0 = [mid('iron', 0.05), mid('iron', 0.25)], I1 = [mid('iron', 0.17), mid('iron', 0.36)];
      const tSwOn = mid('iron', 0.74), tSwOff = mid('iron', 0.9);
      grid.A.forEach((o, i) => {
        let ang;
        if (!isIron) {
          const xc = BX0 + o.x;
          let al = 0;
          for (let k = 0; k < 3; k++) { const tp = tS0 + k * (SL + SB) + SL * clamp((xc - SX0) / (SX1 - SX0)); al += 0.28 * P(t, tp - 0.05, 0.45); }
          al = Math.max(al, P(t, tL0 + o.c * 0.06 + o.d * 0.12, 0.7));
          ang = lerpAng(o.a[0], 180, al) + calm * 5 * Math.sin(t * 1.7 + o.ph) * (1 - al);
        } else {
          // snap to point right while a magnet (or the coil's current) is on; jumble at once after
          // (each jumble is a fresh random set; the set only changes while the arrows are lined up)
          let on = 0;
          for (let k = 0; k < 2; k++) on = Math.max(on, P(t, I0[k] - 0.12, 0.16, linear) * (1 - P(t, I1[k], 0.14, linear)));
          on = Math.max(on, P(t, tSwOn, 0.16, linear) * (1 - P(t, tSwOff, 0.14, linear)));
          const set = t > tSwOff ? 0 : t > I1[1] ? 3 : t > I1[0] ? 2 : 1;
          ang = lerpAng(o.a[set], 0, on) + calm * 4 * Math.sin(t * 1.9 + o.ph) * (1 - on);
        }
        grid.place(i, ang);
      });
      // magnetised ends
      const nsOn = isIron ? 0 : P(t, mid('line', 0.62), 0.6, linear);
      op(bigBar.tintN, nsOn); op(bigBar.tintS, nsOn);
      op(bigN, nsOn * aBig); op(bigS, nsOn * aBig);
      const pN = P(t, mid('line', 0.62), 0.6, pop);
      bigN.setAttribute('transform', `translate(${BX0 - 40} ${BY0 + BH / 2}) scale(${Math.max(0.01, pN).toFixed(3)}) translate(${-(BX0 - 40)} ${-(BY0 + BH / 2)})`);
      bigS.setAttribute('transform', `translate(${BX0 + BW + 40} ${BY0 + BH / 2}) scale(${Math.max(0.01, pN).toFixed(3)}) translate(${-(BX0 + BW + 40)} ${-(BY0 + BH / 2)})`);
    } else { op(bigN, 0); op(bigS, 0); }

    // domains: label one, then "cancel out"
    const lab = win(t, mid('domains', 0.36), at('stroke') - 0.1, 0.4);
    op(oneCell, lab); domLab.set(lab);
    const cp = win(t, mid('domains', 0.8), at('stroke') - 0.1, 0.4);
    op(cancelChip, cp); tr(cancelChip, 600, 628 + (1 - P(t, mid('domains', 0.8), 0.5, easeOut)) * 14);

    // stroking: three passes left to right, lifting and arcing back
    {
      const tS0 = mid('stroke', 0.08), SL = 1.15, SB = 0.7, SX0 = 190, SX1 = 1010, YT = BY0 - 70;
      const sa = win(t, tS0 - 0.4, tS0 + 3 * SL + 2 * SB + 0.45, 0.35);
      op(sMag, sa);
      if (sa > 0) {
        const u = t - tS0, cyc = SL + SB;
        let x = SX0, y = YT;
        if (u > 0) {
          const k = Math.min(2, Math.floor(u / cyc)), v = u - k * cyc;
          if (k === 2 && v > SL) { x = SX1; y = YT - 36 * P(v - SL, 0, 0.4); }
          else if (v <= SL) { x = lerp(SX0, SX1, v / SL); y = YT; }
          else { const w = (v - SL) / SB, e = ease(w); x = lerp(SX1, SX0, e); y = YT - 36 * Math.sin(Math.PI * Math.min(1, w * 1.05)); }
        } else y = YT - 36 * (1 - P(t, tS0 - 0.4, 0.4));
        tr(sMag, x, y, 1, -90);
      }
      op(sameChip, win(t, mid('stroke', 0.3), at('line') + 0.1, 0.4));
      const oc = win(t, mid('stroke', 0.72), at('line') + 0.1, 0.4);
      op(orCoil, oc); if (oc > 0) ocRun((t - mid('stroke', 0.72)) * 28);
    }
    op(alignChip, win(t, mid('line', 0.3), mid('line', 0.66), 0.35));
    op(magnetChip, win(t, mid('line', 0.68), at('demag') - 0.05, 0.4));

    /* ---------- C. demagnetise ---------- */
    const aD = win(t, at('demag') - 0.1, at('iron') - 0.05, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      const dc = P(t, at('demag') + 0.05, 0.5, pop); tr(demChip, 600, 150 + (1 - clamp(dc)) * 12);
      PAN.forEach((p, i) => { const pp = P(t, mid('demag', 0.06 + i * 0.07), 0.5, pop); op(p.g, clamp(pp * 2)); tr(p.g, 0, (1 - clamp(pp)) * 22); });
      const tH = mid('demag', 0.4), tK1 = mid('demag', 0.5), tK2 = mid('demag', 0.57), tA = mid('demag', 0.6), tPull = mid('demag', 0.66);
      [0, 1, 2].forEach(i => op(PAN[i].lab, P(t, [tH, tK1, tA][i] - 0.15, 0.4, linear)));
      // 1. heat: the flame lights, the arrows shiver and scatter
      burner.set(t > tH ? 'blue' : 'off'); burner.upd(t);
      const heat = P(t, tH, 0.8, linear);
      let s1 = 0;
      PAN[0].grid.A.forEach((o, i) => { const sc = P(t, tH + 0.5 + o.d * 0.9, 0.8); s1 += sc; PAN[0].grid.place(i, lerpAng(180, o.a[0], sc) + calm * 26 * heat * Math.sin(t * 19 + o.ph)); });
      s1 /= PAN[0].grid.A.length;
      // 2. hammer: two blows, each scatters the arrows more
      const blow = tk => { if (t < tk - 0.22) return 26; if (t < tk) return lerp(26, 0, easeIn(P(t, tk - 0.22, 0.22, linear))); return 26 * easeOut(P(t, tk + 0.05, 0.35, linear)); };
      const hamAng = t < tK2 - 0.22 ? blow(tK1) : blow(tK2);
      ham.setAttribute('transform', `translate(608 349) rotate(${hamAng.toFixed(1)})`);
      const bf = Math.max(win(t, tK1, tK1 + 0.3, 0.12), win(t, tK2, tK2 + 0.3, 0.12));
      op(bang, bf);
      let s2 = 0;
      PAN[1].grid.A.forEach((o, i) => {
        const sc = 0.55 * P(t, tK1, 0.3, easeOut) + 0.45 * P(t, tK2, 0.3, easeOut);
        const shake = (t > tK1 ? Math.exp(-(t - tK1) * 6) : 0) + (t > tK2 ? Math.exp(-(t - tK2) * 6) : 0);
        s2 += sc; PAN[1].grid.place(i, lerpAng(180, o.a[0], sc) + 24 * shake * Math.sin(t * 40 + o.ph));
      });
      s2 /= PAN[1].grid.A.length;
      // 3. alternating current: the arrows flip back and forth; pulled slowly out, they end jumbled
      const acOn = P(t, tA, 0.3, linear);
      acRun(acOn * 30 * Math.sin(TAU * 1.1 * (t - tA)));
      op(acDots, acOn);
      acWave.set({ phase: (t * 1.1) % 1 });
      const pull = P(t, tPull, 3.6, linear);
      const bx = lerp(807, 1045, pull);
      tr(p3.bar, bx - MW / 2, MY - MH / 2); tr(p3.grid, bx - MW / 2, MY - MH / 2);
      const flip = 90 + 90 * clamp(2.4 * Math.cos(TAU * 1.1 * (t - tA)), -1, 1);
      let s3 = 0;
      p3.grid.A.forEach((o, i) => {
        // the moment this arrow leaves the coil's right-hand end
        const tOut = tPull + 3.6 * clamp((925 + 6 - (807 - MW / 2 + o.x)) / (1045 - 807));
        const out = P(t, tOut, 0.5);
        s3 += out;
        p3.grid.place(i, lerpAng(lerpAng(180, flip, acOn), o.a[0], out));
      });
      s3 /= p3.grid.A.length;
      [[PAN[0], s1], [PAN[1], s2], [p3, s3]].forEach(([p, s]) => { op(p.bar.tintN, 1 - s); op(p.bar.tintS, 1 - s); });
    }

    /* ---------- D. iron ---------- */
    const ia = win(t, at('iron') - 0.2, 1e6, 0.4);
    if (ia > 0) {
      const I0 = [mid('iron', 0.05), mid('iron', 0.25)], I1 = [mid('iron', 0.17), mid('iron', 0.36)];
      let mx = -120;
      for (let k = 0; k < 2; k++) { if (t > I0[k] - 0.4) mx = lerp(-120, 158, P(t, I0[k] - 0.4, 0.36)); if (t > I1[k]) mx = lerp(158, -120, P(t, I1[k], 0.36)); }
      tr(iMag, mx, 414); op(iMag, mx > -100 ? 1 : 0);
      op(easyUp, win(t, I0[0] - 0.05, mid('iron', 0.46), 0.3));
      op(easyDown, win(t, I1[0] + 0.05, mid('iron', 0.46), 0.3));
      const bp = P(t, mid('iron', 0.48), 0.5, pop); op(badChip, clamp(bp * 2)); tr(badChip, 0, (1 - clamp(bp)) * 14);
      const gp = P(t, mid('iron', 0.72), 0.5, pop); op(goodChip, clamp(gp * 2)); tr(goodChip, 0, (1 - clamp(gp)) * 14);
      // the switch appears off, flips on (the domains snap into line), then off (they jumble)
      const tSwOn = mid('iron', 0.74), tSwOff = mid('iron', 0.9);
      const sa = P(t, tSwOn - 0.55, 0.35, linear);
      op(icB, sa); op(icF, sa); op(sw, sa);
      const cur = t > tSwOn && t < tSwOff ? 1 : 0;
      op(icD, sa * cur);
      if (cur) icRun((t - tSwOn) * 60);
      const lv = P(t, tSwOn - 0.12, 0.12, linear) * (1 - P(t, tSwOff, 0.15, linear));
      attr(lever, 'y', lerp(609, 637, lv));                    // British switches: down is on
      op(swOn, sa * lv); op(swOff, sa * (1 - lv));
    } else { op(iMag, 0); op(easyUp, 0); op(easyDown, 0); op(badChip, 0); op(goodChip, 0); op(icB, 0); op(icF, 0); op(icD, 0); op(sw, 0); }
  };
});

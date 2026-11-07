/* Chapter: Mixtures: mixed, not bonded.
   Blue and yellow particles pour into a beaker and stay unbonded -> each keeps its own properties
   -> any ratio (more and more yellow) vs water's locked 2 : 1 -> physical methods sort them into
   two piles -> air: a magnified sample feeds a 78 / 21 / 1 % bar (showpiece) -> sea water ->
   alloys: brass and steel -> an alloy looks like one metal, but its recipe can vary -> gold
   jewellery vs soft pure gold -> the compound vs mixture table. */
scene('mixtures', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.25 : 1;

  /* ---------- local helpers ---------- */
  const EL = { N: '#5B8CFF', Ar: '#C9B8FF', Cu: '#E08A4F', Zn: '#A9B8C8', Fe: '#C27A4A', Au: '#FFC94A' };
  const BLUE = EL.N, YEL = '#FFD84A', BLUE_T = '#9DB8FF', YEL_T = '#FFE27A';
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => Math.round(c * (1 - k)); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
  /* a plain shaded sphere (one element: cheap enough for big crowds of particles) */
  function sphere(parent, col, r, dark) { const dk = dark || shade(col, 0.42); return E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08).toFixed(1) }, parent); }
  /* lib's C / H / O atom look as a single circle (no symbol), for crowds */
  const atomS = (parent, kind, r) => sphere(parent, ATOM[kind][0], r, ATOM[kind][1]);
  /* an element lib.js has no atom for, at a size too small for its symbol */
  function elAtom(parent, sym, r) { const g = G(parent); sphere(g, EL[sym], r); return g; }
  /* a short bond line across the joint of two touching atoms */
  const BOND = '#F4FAFD';
  function bondLine(parent, ax, ay, ra, bx, by, rb, len) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const s = (d * d + ra * ra - rb * rb) / (2 * d), L = (len || 0.6) * Math.min(ra, rb);
    return E('line', { x1: (ax + ux * (s - L / 2)).toFixed(1), y1: (ay + uy * (s - L / 2)).toFixed(1), x2: (ax + ux * (s + L / 2)).toFixed(1), y2: (ay + uy * (s + L / 2)).toFixed(1), stroke: BOND, 'stroke-width': Math.max(2.2, 0.2 * Math.min(ra, rb)).toFixed(1), 'stroke-linecap': 'round', opacity: 0.9 }, parent);
  }
  /* molecules with lib's geometry (molO2 / molH2O / molCO2) plus bond lines */
  function diatomic(parent, sym, r) {
    const g = G(parent), k = 0.72 * r;
    [-k, k].forEach(x => attr(ATOM[sym] ? atomS(g, sym, r) : sphere(g, EL[sym], r), 'cx', x));
    bondLine(g, -k, 0, r, k, 0, r);
    return g;
  }
  function water(parent, r) {
    const g = G(parent), hr = r * 0.62, hx = r * 0.98, hy = r * 0.72;
    const h1 = atomS(g, 'H', hr), h2 = atomS(g, 'H', hr); atomS(g, 'O', r);
    attr(h1, 'cx', -hx); attr(h1, 'cy', hy); attr(h2, 'cx', hx); attr(h2, 'cy', hy);
    bondLine(g, 0, 0, r, -hx, hy, hr, 0.5); bondLine(g, 0, 0, r, hx, hy, hr, 0.5);
    return g;
  }
  function co2(parent, r) {
    const g = G(parent), d = r * 1.6, orr = r * 0.9;
    attr(atomS(g, 'O', orr), 'cx', -d); attr(atomS(g, 'O', orr), 'cx', d); atomS(g, 'C', r);
    bondLine(g, 0, 0, r, -d, 0, orr, 0.5); bondLine(g, 0, 0, r, d, 0, orr, 0.5);
    return g;
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* magnified view: dark disc, clipped contents, glass rim. Returns { g, inner } */
  function lens(parent, r, id) {
    const g = G(parent);
    E('circle', { r: r + 9, fill: '#10283A' }, g);
    const cp = E('clipPath', { id }, defs()); E('circle', { r: r - 3 }, cp);
    const clip = G(g, { 'clip-path': `url(#${id})` });
    E('circle', { r: r * 1.05, fill: glow('#2A6A8A'), opacity: 0.4 }, clip);
    const inner = G(clip);
    E('circle', { r, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 12 }, g);
    E('circle', { r: r - 8, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, g);
    return { g, inner };
  }
  /* the two outer tangent lines from a small magnifier ring (x1,y1,r1) to a lens (x2,y2,r2) */
  function connector(parent) {
    const g = G(parent);
    const ls = [0, 1].map(() => E('line', { stroke: 'rgba(228,237,242,0.45)', 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
    const ringC = E('circle', { r: 10, fill: 'rgba(159,216,255,0.12)', stroke: '#E4EDF2', 'stroke-width': 4 }, g);
    g.set = (x1, y1, r1, x2, y2, r2) => {
      const dx = x2 - x1, dy = y2 - y1, D = Math.hypot(dx, dy) || 1, th = Math.atan2(dy, dx), a = Math.acos(clamp((r1 - r2) / D, -1, 1));
      [th + a, th - a].forEach((p, i) => { attr(ls[i], 'x1', x1 + r1 * Math.cos(p)); attr(ls[i], 'y1', y1 + r1 * Math.sin(p)); attr(ls[i], 'x2', x2 + r2 * Math.cos(p)); attr(ls[i], 'y2', y2 + r2 * Math.sin(p)); });
      attr(ringC, 'cx', x1); attr(ringC, 'cy', y1); attr(ringC, 'r', r1);
    };
    return g;
  }
  /* atoms on a square grid that fills a lens of radius R (spacing s); pick(i, x, y) -> colour */
  function lattice(parent, R, s, r, pick) {
    const out = [], n = Math.ceil((R + r) / s);
    for (let iy = -n; iy <= n; iy++) for (let ix = -n; ix <= n; ix++) {
      const x = ix * s, y = iy * s;
      if (Math.hypot(x, y) > R + r * 0.3) continue;
      const col = pick(out.length, x, y);
      out.push({ el: sphere(parent, col, r), x, y, col, ph: out.length * 1.37 });
    }
    return out;
  }
  const vibrate = (list, t, a) => list.forEach(o => { attr(o.el, 'cx', o.x + Math.sin(t * 17 + o.ph) * a); attr(o.el, 'cy', o.y + Math.cos(t * 21 + o.ph) * a); });
  function padlock(parent) {
    const g = G(parent);
    E('path', { d: 'M-9,-3 L-9,-11 A9,9 0 0 1 9,-11 L9,-3', fill: 'none', stroke: '#DCE6EE', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -14, y: -5, width: 28, height: 22, rx: 5, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': 2 }, g);
    E('circle', { cx: 0, cy: 4, r: 3.4, fill: '#5A3B05' }, g);
    E('rect', { x: -1.5, y: 5, width: 3, height: 7, rx: 1.5, fill: '#5A3B05' }, g);
    return g;
  }
  /* a metal bar seen slightly from above, w x h, centred; engraved name */
  function ingot(parent, w, h, c0, c1, topC, edge, name, clipId) {
    const g = G(parent), d = h * 0.3;
    const front = `M${-w / 2},${-h / 2 + d} L${w / 2},${-h / 2 + d} L${w / 2 - 12},${h / 2} L${-w / 2 + 12},${h / 2} Z`;
    const top = `M${-w / 2},${-h / 2 + d} L${-w / 2 + 24},${-h / 2} L${w / 2 - 24},${-h / 2} L${w / 2},${-h / 2 + d} Z`;
    E('path', { d: front, fill: linGrad(c0, c1, true), stroke: edge, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: top, fill: topC, stroke: edge, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, h / 2 - 16, name, { size: h * 0.36, weight: 700, anchor: 'middle', fill: edge, ls: 4 });
    if (clipId) {
      const cp = E('clipPath', { id: clipId }, defs()); E('path', { d: front + ' ' + top }, cp);
      const sh = G(g, { 'clip-path': `url(#${clipId})` });
      g.shine = E('path', { d: `M-30,${-h} L10,${-h} L-30,${h} L-70,${h} Z`, fill: '#FFFFFF', opacity: 0.55 }, sh);
    }
    return g;
  }
  /* a gold ring seen at an angle */
  function goldRing(parent, rx, ry) {
    const g = G(parent), b = 20;
    const ell = (a, c, sweep) => `M${-a},0 A${a},${c} 0 1 ${sweep} ${a},0 A${a},${c} 0 1 ${sweep} ${-a},0 Z`;
    E('path', { d: ell(rx, ry, 1) + ' ' + ell(rx - b, ry - b * 0.62, 0), fill: linGrad('#FFE594', '#C08A12', true), stroke: '#8A6512', 'stroke-width': 3, 'fill-rule': 'evenodd' }, g);
    E('path', { d: `M${-rx + 9},-6 A${rx - 9},${ry - 6} 0 0 1 ${-rx * 0.15},${-ry + 5}`, fill: 'none', stroke: '#FFFBE6', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, g);
    return g;
  }
  const slideIn = (el, p, dx, dy) => { op(el, clamp(p * 1.5)); el.setAttribute('transform', `translate(${((1 - clamp(p)) * (dx || 0)).toFixed(1)} ${((1 - clamp(p)) * (dy || 0)).toFixed(1)})`); };

  /* ===================== A. a beaker of two substances ===================== */
  const A = G(root);
  const BK = [330, 472];
  const bigBk = beaker(A, 300, 330, { level: 0 }); tr(bigBk, BK[0], BK[1]);
  // two small beakers that pour in, one of each substance
  const pourers = [[238, 212, 38, BLUE], [422, 212, -38, YEL]].map(([x, y, rot, col]) => {
    const g = G(A); const b = beaker(g, 84, 96, { level: 0.62, liquid: col, marks: false });
    return { g, b, x, y, rot, col };
  });
  const mouthL = [292, 196], mouthR = [368, 196];
  // 30 places in the beaker: 12 blue particles, 6 yellow at first, 12 more yellow added later
  const sr = rng(9), sites = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) sites.push([BK[0] - 115 + c * 46 + (sr() - 0.5) * 8, BK[1] + 138 - r * 44 + (sr() - 0.5) * 8]);
  for (let i = sites.length - 1; i > 0; i--) { const j = Math.floor(sr() * (i + 1)); [sites[i], sites[j]] = [sites[j], sites[i]]; }
  const PR = 13, parts = [];
  for (let i = 0; i < 30; i++) {
    const blue = i < 12, extra = i >= 18;
    const k = blue ? i : i - 12;                         // order within its colour
    const ord = blue ? i * 1.5 : extra ? 0 : (i - 12) * 3 + 0.75;   // interleave the first pour
    const tIn = extra ? mid('ratio', 0.18) + (i - 18) * 0.2 : mid('def', 0.06) + ord * 0.1;
    parts.push({ el: sphere(A, blue ? BLUE : YEL, PR), blue, s: sites[i], tIn, from: blue ? mouthL : mouthR, ph: i * 2.1 });
  }
  // separate: everything flies out to two piles, in an alternating order
  const outOrder = parts.map((p, i) => i).sort((a, b) => ((a * 7) % 30) - ((b * 7) % 30));
  const pileSlots = (cx, rows) => { const out = []; rows.forEach((n, r) => { for (let i = 0; i < n; i++) out.push([cx + (i - (n - 1) / 2) * 28, 637 - r * 25]); }); return out; };
  const pileB = pileSlots(800, [5, 4, 3]), pileY = pileSlots(1010, [6, 5, 4, 3]);
  let nb = 0, ny = 0;
  outOrder.forEach((idx, j) => { const p = parts[idx]; p.tOut = mid('separate', 0.16) + j * 0.065; p.pile = p.blue ? pileB[nb++] : pileY[ny++]; });
  const FALL = 0.65, FLY = 1.25;
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };

  const mixT = T(A, 880, 196, 'mixture', { size: 62, weight: 700, anchor: 'middle' });
  // def: no bonds
  const noBond = G(A);
  sphere(noBond, BLUE, 26).setAttribute('cx', 810); noBond.lastChild.setAttribute('cy', 360);
  sphere(noBond, YEL, 26).setAttribute('cx', 950); noBond.lastChild.setAttribute('cy', 360);
  E('line', { x1: 842, y1: 360, x2: 918, y2: 360, stroke: C.muted, 'stroke-width': 5, 'stroke-dasharray': '8 8', 'stroke-linecap': 'round' }, noBond);
  tr(cross(noBond, 15), 880, 360);
  T(noBond, 880, 440, 'no chemical bonds', { size: 34, weight: 700, anchor: 'middle' });
  // own: each keeps its own properties
  const ownG = G(A);
  T(ownG, 880, 300, 'each keeps its own properties', { size: 31, weight: 600, anchor: 'middle', fill: C.muted });
  const tagB = G(ownG), tagY = G(ownG);
  const lineB = E('line', { stroke: BLUE_T, 'stroke-width': 3, 'stroke-linecap': 'round' }, tagB);
  T(tagB, 660, 392, 'blue stays blue', { size: 34, weight: 700, fill: BLUE_T });
  const lineY = E('line', { stroke: YEL_T, 'stroke-width': 3, 'stroke-linecap': 'round' }, tagY);
  T(tagY, 660, 482, 'yellow stays yellow', { size: 34, weight: 700, fill: YEL_T });
  // the tags point at a blue and a yellow particle on the right of the beaker (nearest the labels)
  const nearest = test => { let best = -1, bd = 1e9; parts.forEach((p, i) => { if (!test(p, i)) return; const d = Math.hypot(p.s[0] - 470, p.s[1] - 430); if (d < bd) { bd = d; best = i; } }); return best; };
  const tagBi = nearest(p => p.blue), tagYi = nearest((p, i) => !p.blue && i < 18);
  // ratio: a slider that adds more and more yellow; water stays locked at 2 : 1
  const ratG = G(A);
  const anyChip = chip(ratG, 'any ratio', { size: 32, fill: C.card2, stroke: C.energy }); tr(anyChip, 880, 296);
  const SL = [660, 1100, 372];
  E('rect', { x: SL[0], y: SL[2] - 7, width: SL[1] - SL[0], height: 14, rx: 7, fill: linGrad('#3A4C6E', '#7A6A2A'), stroke: C.line, 'stroke-width': 2 }, ratG);
  const knob = G(ratG);
  E('circle', { r: 19, fill: ball('#FFFFFF', '#A9B5C0'), stroke: '#DCE6EE', 'stroke-width': 2 }, knob);
  T(ratG, SL[0], SL[2] + 50, 'a little', { size: 28, weight: 600, fill: C.muted });
  T(ratG, SL[1], SL[2] + 50, 'a lot', { size: 28, weight: 600, fill: C.muted, anchor: 'end' });
  const readG = G(ratG);
  const readT = rich(readG, 880, 482, [['12', BLUE_T, 700], [' : ', C.muted], ['6', YEL_T, 700]], { size: 44, anchor: 'middle' });
  const readY = readT.lastChild;
  const lockG = G(ratG);
  card(lockG, 650, 528, 460, 118, { fill: C.card, stroke: C.line });
  const lockW = water(lockG, 25); tr(lockW, 712, 580);
  T(lockG, 768, 570, 'a compound’s ratio:', { size: 27, weight: 600, fill: C.muted });
  // spelled out, as in the compounds chapter (in Fredoka "1 O" reads as "10")
  rich(lockG, 768, 620, [['2 hydrogen', '#FFFFFF', 700], [' : ', C.muted, 600], ['1 oxygen', '#FF9A8F', 700]], { size: 28 });
  const lockP = padlock(lockG); tr(lockP, 1074, 600, 1.5);
  // separate: an arrow, two piles, no reaction
  const sepArrow = arrow(A, 440, 286, 905, 486, { color: C.energy, width: 6, bend: -290 });
  const sepLbl = T(A, 660, 206, 'physical methods', { size: 34, weight: 700, anchor: 'middle', fill: C.energy });
  const noRx = G(A);
  const nsp = spark(noRx, 16, { seed: 3 }); tr(nsp, 170, 690);
  tr(cross(noRx, 14), 170, 690);
  T(noRx, 202, 701, 'no chemical reaction needed', { size: 29, weight: 600 });

  /* ===================== B. air: a magnified sample and a percentage bar ===================== */
  const Bg = G(root);
  const AC = [300, 452], AR = 200;
  const airL = lens(Bg, AR, 'mixAirClip'); tr(airL.g, AC[0], AC[1]);
  const airT = T(Bg, AC[0], 176, 'air', { size: 56, weight: 700, anchor: 'middle' });
  const airS = T(Bg, AC[0], 218, 'a mixture of gases', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const gr = rng(77), gas = [];
  [['N2', 19], ['O2', 5], ['Ar', 1], ['CO2', 1]].forEach(([kind, n]) => {
    for (let i = 0; i < n; i++) {
      const g = kind === 'N2' ? diatomic(airL.inner, 'N', 10) : kind === 'O2' ? diatomic(airL.inner, 'O', 10) : kind === 'Ar' ? elAtom(airL.inner, 'Ar', 11) : co2(airL.inner, 8.5);
      const lim = kind === 'Ar' || kind === 'CO2' ? AR * 0.55 : AR - 12;
      const a = gr() * TAU, sp = 36 + gr() * 40;
      gas.push({ g, kind, lim, x0: (gr() * 2 - 1) * lim, y0: (gr() * 2 - 1) * lim, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r0: gr() * 360, w: (gr() - 0.5) * 80 });
    }
  });
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  const BAR = { x: 600, y: 372, w: 540, h: 72 };
  const barG = G(Bg);
  const bcp = E('clipPath', { id: 'mixBarClip' }, defs()); E('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 16 }, bcp);
  E('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 16, fill: '#0B2230' }, barG);
  const barIn = G(barG, { 'clip-path': 'url(#mixBarClip)' });
  let bx = BAR.x;
  const SEG = [['N2', 0.78, BLUE], ['O2', 0.21, C.oxygen], ['rest', 0.01, EL.Ar]].map(([kind, f, col]) => {
    const s = { kind, x: bx, w: BAR.w * f, col };
    s.el = E('rect', { x: bx, y: BAR.y, width: 0, height: BAR.h, fill: ball(col, shade(col, 0.4)) }, barIn);
    bx += s.w; return s;
  });
  E('rect', { x: BAR.x, y: BAR.y, width: BAR.w, height: BAR.h, rx: 16, fill: 'none', stroke: C.line, 'stroke-width': 3 }, barG);
  const pctN = G(Bg), pctO = G(Bg), pctR = G(Bg);
  T(pctN, SEG[0].x + SEG[0].w / 2, BAR.y + 136, '78%', { size: 58, weight: 700, anchor: 'middle', fill: BLUE_T });
  T(pctN, SEG[0].x + SEG[0].w / 2, BAR.y + 176, 'nitrogen', { size: 32, weight: 600, anchor: 'middle' });
  T(pctO, SEG[1].x + SEG[1].w / 2, BAR.y + 136, '21%', { size: 50, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  T(pctO, SEG[1].x + SEG[1].w / 2, BAR.y + 176, 'oxygen', { size: 32, weight: 600, anchor: 'middle' });
  E('line', { x1: SEG[2].x + 3, y1: BAR.y - 4, x2: SEG[2].x + 3, y2: BAR.y - 34, stroke: EL.Ar, 'stroke-width': 3, 'stroke-linecap': 'round' }, pctR);
  T(pctR, BAR.x + BAR.w, BAR.y - 44, 'about 1%: argon, carbon dioxide', { size: 27, weight: 600, anchor: 'end', fill: EL.Ar });
  // the stream of particles from the sample into the bar, one wave per gas
  const ghosts = [];
  const wave3 = [['N2', 4, mid('air', 0.3), 0.34, SEG[0]], ['O2', 2, mid('air', 0.56), 0.4, SEG[1]], ['Ar', 1, mid('air', 0.8), 0.3, SEG[2]], ['CO2', 1, mid('air', 0.86), 0.3, SEG[2]]];
  wave3.forEach(([kind, n, t0, dt, seg]) => {
    for (let j = 0; j < n; j++) {
      const g = kind === 'N2' ? diatomic(Bg, 'N', 11) : kind === 'O2' ? diatomic(Bg, 'O', 11) : kind === 'Ar' ? elAtom(Bg, 'Ar', 11) : co2(Bg, 9);
      const a = gr() * TAU, rr = Math.sqrt(gr()) * AR * 0.6;
      ghosts.push({ g, sx: AC[0] + Math.cos(a) * rr, sy: AC[1] + Math.sin(a) * rr, tx: seg.x + (j + 0.5) / n * seg.w, ty: BAR.y + BAR.h / 2, t0: t0 + j * dt, rot: gr() * 360 });
    }
  });
  const WAVES = { N2: [mid('air', 0.3), mid('air', 0.3) + 4 * 0.34 + 0.9], O2: [mid('air', 0.56), mid('air', 0.56) + 2 * 0.4 + 0.9], Ar: [mid('air', 0.8), mid('air', 0.8) + 1.0], CO2: [mid('air', 0.86), mid('air', 0.86) + 1.0] };

  /* ===================== C. sea water ===================== */
  const Cg = G(root);
  const SB = [290, 482];
  const seaT = T(Cg, SB[0], 238, 'sea water', { size: 52, weight: 700, anchor: 'middle' });
  const seaS = T(Cg, SB[0], 280, 'a mixture too', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const seaBk = beaker(Cg, 250, 290, { level: 0.82 }); tr(seaBk, SB[0], SB[1]);
  const specks = [], spr = rng(31);
  for (let i = 0; i < 10; i++) specks.push({ el: E('circle', { r: 3.4, fill: '#FFFFFF', opacity: 0.85 }, Cg), x: SB[0] - 100 + spr() * 200, y: 418 + spr() * 190, ph: spr() * TAU });
  const ZC = [842, 428], ZR = 188;
  const seaCon = connector(Cg); seaCon.set(SB[0] + 30, 540, 36, ZC[0], ZC[1], ZR + 8);
  const seaL = lens(Cg, ZR, 'mixSeaClip'); tr(seaL.g, ZC[0], ZC[1]);
  const seaParts = [], zr = rng(44), SP = 47;
  const saltIdx = new Set(), otherIdx = new Set();
  { const pts = [];
    for (let iy = -6; iy <= 6; iy++) for (let ix = -6; ix <= 6; ix++) { const x = ix * SP + (iy % 2 ? SP / 2 : 0) + (zr() - 0.5) * 8, y = iy * SP * 0.88 + (zr() - 0.5) * 8; if (Math.hypot(x, y) < ZR + 8) pts.push([x, y]); }
    const inner = pts.map((p, i) => i).filter(i => Math.hypot(pts[i][0], pts[i][1]) < ZR - 50);
    [5, 13, 21, 30, 38, 44].forEach(k => saltIdx.add(inner[(k * 7) % inner.length]));
    [9, 26].forEach(k => { let j = inner[(k * 5 + 3) % inner.length]; while (saltIdx.has(j)) j = inner[(inner.indexOf(j) + 1) % inner.length]; otherIdx.add(j); });
    pts.forEach(([x, y], i) => {
      const kind = saltIdx.has(i) ? 'salt' : otherIdx.has(i) ? 'other' : 'water';
      // dissolved salt: small white cubes, as in the purity, filtration and distillation chapters
      const el = kind === 'salt' ? E('rect', { x: -12, y: -12, width: 24, height: 24, rx: 4.8, fill: '#F4F7FA', stroke: '#9FB2C1', 'stroke-width': 2.4 }, seaL.inner) : kind === 'other' ? sphere(seaL.inner, '#9FE3B0', 15) : sphere(seaL.inner, C.water, 21);
      seaParts.push({ el, x, y, kind, ph: i * 1.9 });
    });
  }
  const seaKey = G(Cg);
  { let x = 600; [['water', C.water, 20], ['salt', '#F4F7FA', 15], ['other substances', '#9FE3B0', 15]].forEach(([w, col, r]) => { if (w === 'salt') E('rect', { x: x + 2, y: 682, width: 22, height: 22, rx: 4.4, fill: col, stroke: '#9FB2C1', 'stroke-width': 2.2 }, seaKey); else { const c = sphere(seaKey, col, 13); attr(c, 'cx', x + 13); attr(c, 'cy', 693); } T(seaKey, x + 36, 703, w, { size: 28, weight: 600 }); x += 36 + textWidth(w, 28, FD, 600) + 34; }); seaKey.setAttribute('transform', `translate(${((842 - (x - 34 + 600) / 2)).toFixed(1)} 0)`); }

  /* ===================== D. alloys: brass and steel ===================== */
  const Dg = G(root);
  const alT = T(Dg, 600, 158, 'alloys', { size: 58, weight: 700, anchor: 'middle' });
  const alS = T(Dg, 600, 204, 'mixtures of metals, or of a metal and carbon', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const ZA = 118;
  function alloySide(x, metal, name, cols, pick, legend, id) {
    const g = G(Dg);
    const bar = ingot(g, 250, 86, ...cols, name, id + 'Shine'); op(bar.shine, 0);
    const con = connector(g);
    const z = lens(g, ZA, id + 'Clip');
    const atoms = lattice(z.inner, ZA, 40, 19, pick);
    const key = G(g);
    let kx = 0; const items = legend.map(([w, col, r]) => { const c = sphere(key, col, r); attr(c, 'cx', kx + 13); attr(c, 'cy', -9); T(key, kx + 34, 0, w, { size: 28, weight: 600 }); kx += 34 + textWidth(w, 28, FD, 600) + 30; return c; });
    key.w = kx - 30;
    return { g, bar, con, z, atoms, key, x };
  }
  const brr = rng(61);
  const brassPick = () => (brr() < 0.7 ? EL.Cu : EL.Zn);
  const brass = alloySide(300, 'brass', 'BRASS', ['#F6D57A', '#B88A2A', '#FCEBB0', '#8C6418'], brassPick, [['copper', EL.Cu, 12], ['zinc', EL.Zn, 12]], 'mixBrass');
  const steel = alloySide(900, 'steel', 'STEEL', ['#DDE4EA', '#8796A5', '#F3F7FA', '#5D6B78'], () => EL.Fe, [['iron', EL.Fe, 12], ['carbon', C.carbon, 8]], 'mixSteel');
  // steel: a few small carbon atoms in the gaps between the iron atoms
  const carbons = [[-1, -2], [1, 0], [-2, 1], [0, 2], [2, -1]].map(([i, j]) => ({ el: atomS(steel.z.inner, 'C', 8), x: (i + 0.5) * 40, y: (j + 0.5) * 40 }));
  carbons.forEach(c => tr(c.el, c.x, c.y));
  // looks: the brass recipe changes from 70 : 30 to 60 : 40 (some copper atoms become zinc)
  const cuSites = brass.atoms.filter(o => o.col === EL.Cu && Math.hypot(o.x, o.y) < ZA - 20);
  const swaps = [0, 3, 6, 9, 12].map(k => cuSites[(k * 5) % cuSites.length]).filter(Boolean);
  swaps.forEach(o => { o.zn = sphere(brass.z.inner, EL.Zn, 19); op(o.zn, 0); });
  const looksG = G(Dg);
  const lk1 = T(looksG, 330, 462, 'looks like one metal', { size: 34, weight: 700, anchor: 'middle' });
  const lk2 = chip(looksG, 'but it’s a mixture', { size: 32, fill: C.card2, stroke: C.energy }); tr(lk2, 330, 532);
  const lk3 = rich(looksG, 330, 616, [['no fixed ratio', C.ink, 700]], { size: 32, anchor: 'middle' });
  const rec1 = rich(looksG, 850, 670, [['copper 70%', '#F2B184', 700], [' : ', C.muted], ['zinc 30%', '#CFD9E3', 700]], { size: 34, anchor: 'middle' });
  const rec2 = rich(looksG, 850, 670, [['copper 60%', '#F2B184', 700], [' : ', C.muted], ['zinc 40%', '#CFD9E3', 700]], { size: 34, anchor: 'middle' });
  const recLbl = T(looksG, 850, 616, 'another recipe', { size: 27, weight: 600, anchor: 'middle', fill: C.energy });

  /* ===================== F. gold jewellery vs pure gold ===================== */
  const Fg = G(root);
  const R1 = [300, 300], R2 = [880, 330];
  const jT = T(Fg, R1[0], 168, 'gold jewellery', { size: 42, weight: 700, anchor: 'middle' });
  const ring1 = goldRing(Fg, 96, 62); tr(ring1, R1[0], R1[1]);
  const gCon = connector(Fg);
  const GZ = [300, 522], GR = 112;
  const gz = lens(Fg, GR, 'mixGoldClip'); tr(gz.g, GZ[0], GZ[1]);
  const gor = rng(71);
  const gAtoms = lattice(gz.inner, GR, 40, 19, () => (gor() < 0.7 ? EL.Au : EL.Cu));
  const gKey = G(Fg);
  { let x = 0; [['gold', EL.Au], ['copper', EL.Cu]].forEach(([w, col]) => { const c = sphere(gKey, col, 12); attr(c, 'cx', x + 12); attr(c, 'cy', -9); T(gKey, x + 32, 0, w, { size: 28, weight: 600 }); x += 32 + textWidth(w, 28, FD, 600) + 30; }); tr(gKey, GZ[0] - (x - 30) / 2, 690); }
  const pT = T(Fg, R2[0], 168, 'pure gold', { size: 42, weight: 700, anchor: 'middle' });
  const pS = T(Fg, R2[0], 208, '24 carat', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const ring2 = goldRing(Fg, 96, 62);
  const push2 = [arrow(Fg, R2[0] - 210, R2[1], R2[0] - 122, R2[1], { color: C.ink, width: 7 }), arrow(Fg, R2[0] + 210, R2[1], R2[0] + 122, R2[1], { color: C.ink, width: 7 })];
  const softT = G(Fg);
  tr(cross(softT, 15), R2[0] - 128, 472);
  T(softT, R2[0] - 100, 483, 'so soft it bends', { size: 32, weight: 700 });
  const push1 = [arrow(Fg, R1[0] - 210, R1[1], R1[0] - 122, R1[1], { color: C.ink, width: 7 }), arrow(Fg, R1[0] + 210, R1[1], R1[0] + 122, R1[1], { color: C.ink, width: 7 })];
  const toughT = G(Fg);
  card(toughT, 640, 556, 480, 120, { fill: C.card, stroke: C.good, sw: 3 });
  tr(tick(toughT, 16), 690, 612);
  T(toughT, 724, 606, 'with other metals added:', { size: 27, weight: 600, fill: C.muted });
  T(toughT, 724, 648, 'tough enough to wear', { size: 33, weight: 700 });

  /* ===================== G. compound vs mixture ===================== */
  const Gg = G(root);
  const TCX = [320, 880];
  const cols = TCX.map((cx, i) => {
    const g = G(Gg);
    card(g, cx - 260, 112, 520, 566, { fill: C.card, stroke: C.line });
    const ch = chip(g, i ? 'mixture' : 'compound', { size: 40, fill: i ? '#3A3410' : '#173A2B', stroke: i ? YEL : C.good }); tr(ch, cx, 166);
    const pic = G(g);
    if (!i) [[-120, 0, 14], [0, -6, -10], [120, 2, 22]].forEach(([x, y, a]) => { const m = G(pic); tr(m, cx + x, 238 + y, 1, a); const k = 0.72 * 17; tr(sphere(m, BLUE, 17), -k, 0); tr(sphere(m, YEL, 17), k, 0); bondLine(m, -k, 0, 17, k, 0, 17); });
    else [[-150, -10, BLUE], [-90, 10, YEL], [-30, -10, BLUE], [30, 10, YEL], [90, -10, BLUE], [150, 10, YEL]].forEach(([x, y, col]) => { const s = sphere(pic, col, 17); attr(s, 'cx', cx + x); attr(s, 'cy', 236 + y); });
    E('line', { x1: cx - 230, x2: cx + 230, y1: 308, y2: 308, stroke: C.line, 'stroke-width': 2 }, g);
    return { g, pic, cx };
  });
  const neq = T(Gg, 600, 268, '≠', { size: 76, weight: 700, anchor: 'middle', fill: C.muted });
  const wellMixed = T(Gg, TCX[1], 292, 'even very well mixed', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  function row(col, y, icon, l1, l2) {
    const g = G(Gg), cx = TCX[col];
    const ic = G(g); tr(ic, cx - 178, y); icon(ic);
    if (l2) { T(g, cx - 118, y - 6, l1, { size: 32, weight: 700 }); T(g, cx - 118, y + 32, l2, { size: 28, weight: 600, fill: C.muted }); }
    else T(g, cx - 118, y + 12, l1, { size: 34, weight: 700 });
    return { g, ic };
  }
  const RY = [372, 482, 600];
  const rowsC = [
    row(0, RY[0], g => { const k = 0.72 * 18; tr(sphere(g, BLUE, 18), -k, 0); tr(sphere(g, YEL, 18), k, 0); bondLine(g, -k, 0, 18, k, 0, 18); }, 'bonded'),
    row(0, RY[1], g => { tr(padlock(g), 0, -4, 1.7); }, 'fixed ratio'),
    row(0, RY[2], g => { g.sp = spark(g, 24, { seed: 5 }); }, 'a chemical reaction', 'to make or break it'),
  ];
  const rowsM = [
    row(1, RY[0], g => { tr(sphere(g, BLUE, 16), -26, 0); tr(sphere(g, YEL, 16), 26, 0); }, 'not bonded'),
    row(1, RY[1], g => { E('rect', { x: -40, y: -6, width: 80, height: 12, rx: 6, fill: linGrad('#3A4C6E', '#7A6A2A'), stroke: C.line, 'stroke-width': 2 }, g); E('circle', { cx: 14, r: 13, fill: ball('#FFFFFF', '#A9B5C0'), stroke: '#DCE6EE', 'stroke-width': 2 }, g); }, 'any ratio'),
    row(1, RY[2], g => {
      const f = G(g); tr(f, 0, -2, 0.66);                     // 07_filter's funnel icon: glass cone, filter paper, sand
      E('path', { d: 'M-48,-44 L-6,10 L-6,46 L6,52 L6,10 L48,-44 Z', fill: 'rgba(200,230,250,0.14)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, f);
      E('path', { d: 'M-40,-40 L0,6 L40,-40 Z', fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, f);
      E('path', { d: 'M-16,-12 Q0,-22 16,-12 L0,6 Z', fill: '#D9B77E' }, f);
    }, 'physical methods', 'to separate it'),
  ];

  /* ===================== update ===================== */
  return t => {
    const tt = t * calm;
    const pulse = (t0, w) => Math.sin(Math.PI * P(t, t0, w || 0.5, linear));

    /* ---- A ---- */
    const aA = 1 - P(t, at('air') - 0.15, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      // the two small beakers tip in and pour, then leave; the yellow one comes back for "a lot"
      const pin = P(t, at('def') - 0.1, 0.6, easeOut), tipDef = P(t, mid('def', 0.0), 0.5), defOut = P(t, mid('def', 0.64), 0.5, linear);
      const again = win(t, mid('ratio', 0.06), mid('ratio', 0.18) + 12 * 0.2 + 0.5, 0.4), tipAgain = P(t, mid('ratio', 0.08), 0.5);
      pourers.forEach((o, i) => {
        const first = pin * (1 - defOut), ratioPhase = i === 1 && t > at('ratio') - 0.2;
        op(o.g, i === 0 ? first : Math.max(first, again));
        tr(o.g, o.x + (i ? 1 : -1) * (1 - pin) * 40, o.y, 1, o.rot * (ratioPhase ? tipAgain : tipDef));
        const lvl = ratioPhase ? lerp(0.62, 0.08, P(t, mid('ratio', 0.18), 2.6, linear)) : lerp(0.62, i ? 0.42 : 0.12, P(t, mid('def', 0.06), 1.9, linear));
        o.b.set(lvl, o.col);
      });
      // particles: fall in, jiggle (never touching), then fly out to their piles
      parts.forEach((p, i) => {
        let x, y, show = 1;
        if (t < p.tIn) { show = 0; x = p.from[0]; y = p.from[1]; }
        else if (t < p.tIn + FALL) { const u = (t - p.tIn) / FALL; x = lerp(p.from[0], p.s[0], ease(u)); y = lerp(p.from[1], p.s[1], easeIn(u)); }
        else if (t < p.tOut) { x = p.s[0] + Math.sin(tt * 1.7 + p.ph) * 2.5; y = p.s[1] + Math.cos(tt * 2.1 + p.ph) * 2.5; }
        else if (t < p.tOut + FLY) { const u = ease((t - p.tOut) / FLY); [x, y] = cubic(p.s, [p.s[0], 90], [p.pile[0], 200], p.pile, u); }
        else { x = p.pile[0]; y = p.pile[1]; }
        op(p.el, show * clamp((t - p.tIn) / 0.15));
        attr(p.el, 'cx', x); attr(p.el, 'cy', y);
        p.x = x; p.y = y;
      });
      op(mixT, P(t, mid('def', 0.06), 0.5, linear) * (1 - P(t, at('separate') - 0.1, 0.4, linear)));
      const nb = win(t, mid('def', 0.76), at('own') + 0.1, 0.4); op(noBond, nb);
      if (nb > 0) noBond.setAttribute('transform', `translate(0 ${((1 - P(t, mid('def', 0.76), 0.5, easeOut)) * 16).toFixed(1)})`);
      // own: tags with leaders that follow one blue and one yellow particle
      const ow = win(t, at('own') - 0.05, at('ratio') + 0.05, 0.4); op(ownG, ow);
      if (ow > 0) {
        slideIn(tagB, P(t, mid('own', 0.2), 0.5, easeOut), 24, 0); slideIn(tagY, P(t, mid('own', 0.45), 0.5, easeOut), 24, 0);
        const pb = parts[tagBi], py = parts[tagYi];
        attr(lineB, 'x1', 650); attr(lineB, 'y1', 381); attr(lineB, 'x2', pb.x + PR); attr(lineB, 'y2', pb.y);
        attr(lineY, 'x1', 650); attr(lineY, 'y1', 471); attr(lineY, 'x2', py.x + PR); attr(lineY, 'y2', py.y);
      }
      // ratio
      const ra = win(t, at('ratio') - 0.05, at('separate') + 0.05, 0.4); op(ratG, ra);
      if (ra > 0) {
        const nY = 6 + parts.filter((p, i) => i >= 18 && t >= p.tIn + FALL * 0.8).length;
        setText(readY, String(nY));
        tr(knob, lerp(SL[0] + 40, SL[1] - 20, (nY - 6) / 12), SL[2], 1 + 0.15 * pulse(mid('ratio', 0.18), 0.3));
        slideIn(readG, P(t, mid('ratio', 0.1), 0.4, linear), 0, 10);
        const lp = P(t, mid('ratio', 0.64), 0.5, pop); op(lockG, clamp(lp * 2)); lockG.setAttribute('transform', `translate(0 ${((1 - clamp(lp)) * 20).toFixed(1)})`);
        tr(lockW, 712, 580, 1, Math.sin(tt * 1.2) * 8);
        tr(lockP, 1074, 600, 1.5 * (1 + 0.18 * pulse(mid('ratio', 0.84), 0.45)));
      }
      // separate
      const sp = P(t, at('separate') - 0.05, 0.4, linear);
      sepArrow.set(P(t, mid('separate', 0.1), 0.9)); op(sepArrow, sp);
      op(sepLbl, P(t, mid('separate', 0.52), 0.4, linear));
      op(noRx, P(t, mid('separate', 0.68), 0.4, linear)); nsp.upd(tt);
    }

    /* ---- B: air ---- */
    const aB = win(t, at('air') - 0.1, at('sea') + 0.05, 0.45);
    op(Bg, aB);
    if (aB > 0) {
      const lp = P(t, at('air') - 0.1, 0.7, easeOut);
      tr(airL.g, AC[0], AC[1], 0.85 + 0.15 * lp);
      op(airT, P(t, mid('air', 0.02), 0.4, linear)); op(airS, P(t, mid('air', 0.14), 0.4, linear));
      const live = k => win(t, WAVES[k][0] - 0.15, WAVES[k][1] + 0.3, 0.3);
      const focus = Math.max(live('N2'), live('O2'), live('Ar'), live('CO2'));
      gas.forEach(o => {
        const x = bounce(o.x0 + o.vx * tt, -o.lim, o.lim), y = bounce(o.y0 + o.vy * tt, -o.lim, o.lim);
        const mine = live(o.kind);
        tr(o.g, x, y, 1 + 0.3 * mine, o.r0 + o.w * tt);
        op(o.g, 1 - 0.6 * Math.max(0, focus - mine));
      });
      ghosts.forEach(o => {
        const u = (t - o.t0) / 1.0;
        if (u <= 0 || u >= 1) { op(o.g, 0); return; }
        const p = ease(u), q = 1 - p, cx = (o.sx + o.tx) / 2, cy = Math.min(o.sy, o.ty) - 120;
        tr(o.g, q * q * o.sx + 2 * q * p * cx + p * p * o.tx, q * q * o.sy + 2 * q * p * cy + p * p * o.ty, 1.1, o.rot + u * 120);
        op(o.g, Math.min(1, u * 6, (1 - u) * 5));
      });
      SEG.forEach((s, i) => {
        const w0 = i === 2 ? WAVES.Ar[0] : WAVES[s.kind][0], w1 = i === 2 ? WAVES.CO2[1] : WAVES[s.kind][1];
        attr(s.el, 'width', s.w * P(t, w0 + 0.7, w1 - w0 - 0.8, linear));
      });
      op(barG, P(t, mid('air', 0.2), 0.5, linear));
      const pn = P(t, WAVES.N2[1] - 0.5, 0.5, pop), po = P(t, WAVES.O2[1] - 0.5, 0.5, pop);
      op(pctN, clamp(pn * 2)); pctN.setAttribute('transform', `translate(0 ${((1 - clamp(pn)) * 14).toFixed(1)})`);
      op(pctO, clamp(po * 2)); pctO.setAttribute('transform', `translate(0 ${((1 - clamp(po)) * 14).toFixed(1)})`);
      op(pctR, P(t, WAVES.CO2[1] - 0.5, 0.4, linear));
    }

    /* ---- C: sea water ---- */
    const aC = win(t, at('sea') - 0.1, at('alloys') + 0.05, 0.45);
    op(Cg, aC);
    if (aC > 0) {
      op(seaT, P(t, at('sea'), 0.4, linear)); op(seaS, P(t, mid('sea', 0.3), 0.4, linear));
      specks.forEach(s => { attr(s.el, 'cx', s.x + Math.sin(tt * 0.7 + s.ph) * 5); attr(s.el, 'cy', s.y + Math.cos(tt * 0.5 + s.ph) * 4); });
      const zp = P(t, mid('sea', 0.16), 0.7, easeOut);
      op(seaL.g, zp); tr(seaL.g, lerp(SB[0] + 30, ZC[0], zp), lerp(540, ZC[1], zp), Math.max(0.05, zp));
      op(seaCon, zp); seaCon.set(SB[0] + 30, 540, 36, lerp(SB[0] + 30, ZC[0], zp), lerp(540, ZC[1], zp), (ZR + 8) * Math.max(0.05, zp));
      const sg = pulse(mid('sea', 0.56), 1.2);
      seaParts.forEach(o => {
        const x = o.x + Math.sin(tt * 1.1 + o.ph) * 4 + Math.sin(tt * 0.3 + o.ph) * 6, y = o.y + Math.cos(tt * 1.3 + o.ph) * 4;
        if (o.kind === 'salt') { tr(o.el, x, y, 1 + 0.25 * sg, 18 + (o.ph * 40) % 30); return; }
        attr(o.el, 'cx', x); attr(o.el, 'cy', y);
        if (o.kind !== 'water') attr(o.el, 'r', (15 * (1 + 0.25 * sg)).toFixed(2));
      });
      op(seaKey, P(t, mid('sea', 0.5), 0.5, linear));
    }

    /* ---- D: alloys, then looks ---- */
    const aD = win(t, at('alloys') - 0.1, at('gold') + 0.05, 0.45);
    op(Dg, aD);
    if (aD > 0) {
      const lk = P(t, at('looks') - 0.1, 1.0);                       // brass takes the stage
      op(alT, 1 - P(t, at('looks') - 0.2, 0.4, linear)); op(alS, P(t, mid('alloys', 0.1), 0.5, linear) * (1 - P(t, at('looks') - 0.2, 0.4, linear)));
      op(steel.g, 1 - P(t, at('looks') - 0.2, 0.5, linear));
      [brass, steel].forEach((s, i) => {
        const bp = P(t, mid('alloys', i ? 0.32 : 0.12), 0.6, pop);
        const zp = P(t, mid('alloys', i ? 0.78 : 0.55), 0.6, easeOut);
        let bx = s.x, by = 316, bs = 1, zx = s.x, zy = 520, zs = 1;
        if (!i) { bx = lerp(bx, 330, lk); by = lerp(by, 340, lk); bs = lerp(1, 1.32, lk); zx = lerp(zx, 850, lk); zy = lerp(zy, 404, lk); zs = lerp(1, 1.45, lk); }
        op(s.bar, clamp(bp * 2)); tr(s.bar, bx, by + (1 - clamp(bp)) * 20, bs * (0.9 + 0.1 * bp));
        const zz = Math.max(0.05, zp) * zs, rx = bx + 100 * bs, ry = by + 12 * bs;   // magnifier ring on the bar
        const lx = lerp(rx, zx, zp), ly = lerp(ry, zy, zp);
        op(s.z.g, zp); tr(s.z.g, lx, ly, zz);
        op(s.con, zp); s.con.set(rx, ry, 17 * bs, lx, ly, (ZA + 8) * zz);
        vibrate(s.atoms, tt, 1.2);
        op(s.key, P(t, mid('alloys', i ? 0.86 : 0.62), 0.4, linear) * (i ? 1 : 1 - P(t, at('looks') - 0.2, 0.3, linear)));
        tr(s.key, s.x - s.key.w / 2, 690);
      });
      carbons.forEach((c, k) => tr(c.el, c.x + Math.sin(tt * 15 + k) * 1, c.y + Math.cos(tt * 19 + k) * 1));
      // looks: a shine sweeps over the bar; then the mixture inside, and a new recipe
      const lA = P(t, at('looks') - 0.1, 0.4, linear); op(looksG, lA);
      if (lA > 0) {
        const sw = P(t, mid('looks', 0.06), 1.3, linear);
        brass.bar.shine.setAttribute('transform', `translate(${lerp(-200, 220, sw).toFixed(1)} 0)`); op(brass.bar.shine, sw > 0 && sw < 1 ? 1 : 0);
        op(lk1, P(t, mid('looks', 0.06), 0.4, linear));
        const c2 = P(t, mid('looks', 0.36), 0.5, pop); op(lk2, clamp(c2 * 2)); tr(lk2, 330, 532, Math.max(0.01, 0.8 + 0.2 * c2));
        op(lk3, P(t, mid('looks', 0.6), 0.4, linear));
        const sw2 = P(t, mid('looks', 0.8), 0.9, linear);
        swaps.forEach((o, k) => { const q = clamp(sw2 * 1.6 - k * 0.15); op(o.zn, q); attr(o.zn, 'cx', o.x + Math.sin(tt * 17 + o.ph) * 1.2); attr(o.zn, 'cy', o.y + Math.cos(tt * 21 + o.ph) * 1.2); });
        op(rec1, P(t, mid('looks', 0.55), 0.4, linear) * (1 - sw2)); op(rec2, sw2);
        op(recLbl, P(t, mid('looks', 0.82), 0.4, linear));
      } else op(brass.bar.shine, 0);
    }

    /* ---- F: gold ---- */
    const aF = win(t, at('gold') - 0.1, at('compound') + 0.05, 0.45);
    op(Fg, aF);
    if (aF > 0) {
      const r1p = P(t, at('gold'), 0.6, pop);
      op(jT, P(t, at('gold'), 0.4, linear));
      const squeeze1 = Math.sin(Math.PI * P(t, mid('gold', 0.86), 0.9, linear));
      op(ring1, clamp(r1p * 2)); ring1.setAttribute('transform', `translate(${R1[0]} ${R1[1]}) scale(${(Math.max(0.01, r1p) * (1 - 0.03 * squeeze1)).toFixed(4)} ${(Math.max(0.01, r1p) * (1 + 0.02 * squeeze1)).toFixed(4)})`);
      const zp = P(t, mid('gold', 0.14), 0.6, easeOut);
      op(gz.g, zp); tr(gz.g, lerp(R1[0], GZ[0], zp), lerp(R1[1], GZ[1], zp), Math.max(0.05, zp));
      op(gCon, zp); gCon.set(R1[0] + 60, R1[1] + 30, 16, lerp(R1[0], GZ[0], zp), lerp(R1[1], GZ[1], zp), (GR + 8) * Math.max(0.05, zp));
      vibrate(gAtoms, tt, 1.2);
      const cuGlow = pulse(mid('gold', 0.6), 1.0);
      gAtoms.forEach(o => { if (o.col === EL.Cu) attr(o.el, 'r', (19 * (1 + 0.18 * cuGlow)).toFixed(2)); });
      op(gKey, P(t, mid('gold', 0.24), 0.4, linear));
      // pure gold: pressed from both sides, it bends and stays bent
      const r2p = P(t, mid('gold', 0.34), 0.6, pop);
      op(pT, P(t, mid('gold', 0.34), 0.4, linear)); op(pS, P(t, mid('gold', 0.4), 0.4, linear));
      const bend = P(t, mid('gold', 0.46), 0.8, easeOut);
      op(ring2, clamp(r2p * 2)); ring2.setAttribute('transform', `translate(${R2[0]} ${R2[1]}) scale(${(Math.max(0.01, r2p) * (1 - 0.42 * bend)).toFixed(4)} ${(Math.max(0.01, r2p) * (1 + 0.3 * bend)).toFixed(4)})`);
      const press2 = win(t, mid('gold', 0.42), mid('gold', 0.62), 0.25);
      push2.forEach((a, k) => { op(a, press2); a.setAttribute('transform', `translate(${((k ? -1 : 1) * 28 * bend).toFixed(1)} 0)`); });
      op(softT, P(t, mid('gold', 0.52), 0.4, linear));
      const press1 = win(t, mid('gold', 0.82), end('gold') + 0.25, 0.25);
      push1.forEach((a, k) => { op(a, press1); a.setAttribute('transform', `translate(${((k ? -1 : 1) * 6 * squeeze1).toFixed(1)} 0)`); });
      const tp = P(t, mid('gold', 0.88), 0.5, pop); op(toughT, clamp(tp * 2)); toughT.setAttribute('transform', `translate(0 ${((1 - clamp(tp)) * 16).toFixed(1)})`);
    }

    /* ---- G: compound vs mixture ---- */
    const aG = P(t, at('compound') - 0.1, 0.45, linear);
    op(Gg, aG);
    if (aG > 0) {
      const c0 = P(t, mid('compound', 0.03), 0.5, easeOut), c1 = P(t, mid('compound', 0.12), 0.5, easeOut);
      const mixOn = P(t, at('mixture') - 0.1, 0.5, linear);
      op(cols[0].g, c0); cols[0].g.setAttribute('transform', `translate(0 ${((1 - c0) * 30).toFixed(1)})`);
      op(cols[1].g, c1 * (0.4 + 0.6 * mixOn)); cols[1].g.setAttribute('transform', `translate(0 ${((1 - c1) * 30).toFixed(1)})`);
      op(neq, P(t, mid('compound', 0.26), 0.4, linear));
      op(wellMixed, P(t, mid('compound', 0.2), 0.4, linear) * (1 - mixOn));
      [0.42, 0.55, 0.7].forEach((f, k) => { const p = P(t, mid('compound', f), 0.5, easeOut); slideIn(rowsC[k].g, p, -24, 0); });
      rowsC[2].ic.sp.upd(tt);
      [0.18, 0.44, 0.68].forEach((f, k) => { const p = P(t, mid('mixture', f), 0.5, easeOut); slideIn(rowsM[k].g, p, -24, 0); });
      // the compound's bonded pairs hold together; the mixture's particles drift apart and back
      cols[1].pic.childNodes.forEach((s, k) => s.setAttribute('transform', `translate(${(Math.sin(tt * 0.9 + k * 1.7) * 6).toFixed(1)} ${(Math.cos(tt * 0.8 + k) * 5).toFixed(1)})`));
    }
  };
});

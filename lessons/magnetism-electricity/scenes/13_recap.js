/* Recap: a padlock with a horseshoe-magnet shackle clicks shut -> five memory-hook cards (Likes Repel,
   Opposites Attract; I See No Cobwebs; TIC; Ammeter Always in a line, Voltmeter Verily across; series shares,
   parallel splits) -> "5 exam traps": each trap's slot flips from a red cross to a green tick, while the focus
   card strikes out the wrong idea, ticks the right one and acts it out (showpiece: tangled field lines
   untangle into the nested N -> S pattern). */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, RED = '#E8424F', BLUE = '#3B82F6', COPPER = '#D9893F';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Likes Repel" with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], Y, 800], [w.slice(1), col || C.ink]] : [w]));
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  function electron(parent, r) {
    const f = v => (+v).toFixed(1);
    return E('path', { d: `M${f(-r)},0 a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0 Z M${f(-r * 0.48)},0 H${f(r * 0.48)}`, fill: ball(C.water, C.waterDk), stroke: '#F2FBFF', 'stroke-width': f(r * 0.27), 'stroke-linecap': 'round' }, parent);
  }
  function plusT(parent, s) {
    const w = s * 0.32, f = v => (+v).toFixed(1);
    return E('path', { d: `M${f(-s)},${f(-w)} H${f(-w)} V${f(-s)} H${f(w)} V${f(-w)} H${f(s)} V${f(w)} H${f(w)} V${f(s)} H${f(-w)} V${f(w)} H${f(-s)} Z`, fill: C.bad, stroke: C.bg0, 'stroke-width': f(s * 0.3), 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, parent);
  }
  /* a coil of n turns, w wide and h tall, centred; back strokes dim, front strokes bright; o.core adds an iron bar */
  function coil(parent, n, w, h, o) {
    o = o || {};
    const g = G(parent), p = w / n, r = h / 2;
    let back = '', front = '';
    for (let k = 0; k < n; k++) {
      const x = -w / 2 + k * p;
      front += `M${x.toFixed(1)},${-r} Q${(x + p * 0.1).toFixed(1)},0 ${(x + p * 0.5).toFixed(1)},${r} `;
      back += `M${(x + p * 0.5).toFixed(1)},${r} Q${(x + p * 0.9).toFixed(1)},0 ${(x + p).toFixed(1)},${-r} `;
    }
    E('path', { d: back, fill: 'none', stroke: '#8A5A2B', 'stroke-width': o.sw || 3.5, 'stroke-linecap': 'round' }, g);
    if (o.core) E('rect', { x: -w / 2 - 14, y: -r * 0.55, width: w + 28, height: r * 1.1, rx: 4, fill: linGrad('#B4C0CB', '#6E7C89', true), stroke: '#D5DEE5', 'stroke-width': 1.5 }, g);
    E('path', { d: front, fill: 'none', stroke: COPPER, 'stroke-width': o.sw || 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* a point along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const q = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  /* a steel paperclip about 40 x 16, centred */
  function clipArt(parent, color) {
    return E('path', { d: 'M-16,5 L12,5 A6,6 0 0 0 12,-7 L-14,-7 A4.5,4.5 0 0 0 -14,2 L8,2', fill: 'none', stroke: color || '#C9D6DE', 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }

  /* ---------- padlock: its shackle is a horseshoe magnet ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = G(lockG);
  E('path', { d: 'M-52,10 L-52,-50 A52,52 0 0 1 52,-50 L52,10', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 24, 'stroke-linecap': 'butt' }, shackle);
  E('path', { d: 'M-52,10 L-52,-24', stroke: RED, 'stroke-width': 24 }, shackle);
  E('path', { d: 'M52,10 L52,-24', stroke: BLUE, 'stroke-width': 24 }, shackle);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.energy, '#C9A800'), stroke: C.energyLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A3000' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A3000' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 3 cards on top, 2 wide cards below ---------- */
  const hooks = G(root);
  const SLOTS = { lroa: [40, 108, 400, 262], cobwebs: [460, 108, 340, 262], tic: [820, 108, 340, 262], meters: [40, 390, 548, 262], shares: [612, 390, 548, 262] };
  function hookCard(id) { const [x, y, w, h] = SLOTS[id]; const g = G(hooks); tr(g, x, y); card(g, 0, 0, w, h, { fill: C.card, stroke: C.line }); return g; }

  // 1. Likes Repel, Opposites Attract
  const h1 = hookCard('lroa');
  const l1 = initials('Likes Repel,'), l2 = initials('Opposites Attract');
  const h1s = fit(l2, 38, 344);
  rich(h1, 28, 60, l1, { size: h1s, weight: 700 });
  rich(h1, 28, 104, l2, { size: h1s, weight: 700 });
  const mags = G(h1); tr(mags, 152, 184);
  const magA = G(mags); magnet(magA, 80, 34);
  const magB1 = G(mags); magnet(magB1, 80, 34, { flip: true });   // S faces S: repel
  const magB2 = G(mags); magnet(magB2, 80, 34);                   // turned round: N faces S, attract
  const rep = [G(mags), G(mags)]; arrow(rep[0], 0, 0, -30, 0, { color: C.bad, width: 5 }); arrow(rep[1], 0, 0, 30, 0, { color: C.bad, width: 5 });
  const att = [G(mags), G(mags)]; arrow(att[0], 0, 0, 30, 0, { color: C.good, width: 5 }); arrow(att[1], 0, 0, -30, 0, { color: C.good, width: 5 });
  const chg = G(h1); tr(chg, 334, 184);
  const cE = electron(chg, 14), cP = plusT(chg, 13);
  const h1lab = [T(h1, 152, 244, 'poles', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' }), T(h1, 334, 244, 'charges', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' })];

  // 2. I See No Cobwebs
  const h2 = hookCard('cobwebs');
  const cw = initials('I See No Cobwebs'), cws = fit(cw, 36, 248);
  const cwT = rich(h2, 28, 60, cw, { size: cws, weight: 700 });
  const webX = 28 + textWidth(plain(cw), cws, FD, 700) + 38;
  const web = G(h2); tr(web, Math.min(webX, 304), 48);
  let wd = '';
  for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; wd += `M0,0 L${(Math.cos(a) * 26).toFixed(1)},${(Math.sin(a) * 26).toFixed(1)} `; }
  [10, 19, 26].forEach(r => { for (let k = 0; k <= 8; k++) { const a = k * Math.PI / 4; wd += (k ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1) + ' '; } });
  E('path', { d: wd, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 1.6, opacity: 0.8 }, web);
  const mats = [
    { x: 28, y: 136, name: 'iron', draw: g => E('rect', { x: -24, y: -9, width: 48, height: 18, rx: 3, fill: linGrad('#B4C0CB', '#6E7C89', true), stroke: '#D5DEE5', 'stroke-width': 1.5 }, g) },
    { x: 176, y: 136, name: 'steel', draw: g => clipArt(g) },
    { x: 28, y: 208, name: 'nickel', draw: g => E('circle', { r: 16, fill: ball('#E3E9ED', '#8E9BA6'), stroke: '#F4F7FA', 'stroke-width': 1.5 }, g) },
    { x: 176, y: 208, name: 'cobalt', draw: g => E('path', { d: 'M-18,4 C-20,-10 -6,-16 4,-14 C16,-12 20,-2 16,8 C12,16 -10,16 -18,4 Z', fill: ball('#7E95C2', '#3C4F80'), stroke: '#B9C8E6', 'stroke-width': 1.5 }, g) },
  ].map(m => {
    const g = G(h2); tr(g, m.x, m.y);
    const ic = G(g); tr(ic, 26, -9); m.draw(ic);
    rich(g, 60, 1, [[m.name[0], Y, 800], [m.name.slice(1), C.ink]], { size: 29, weight: 700 });
    return g;
  });

  // 3. TIC
  const h3 = hookCard('tic');
  let ticX = 30;
  const ticT = ['T', 'I', 'C'].map(ch => { const w = textWidth(ch, 58, FD, 700), x = ticX; ticX += w + 8; const el = T(h3, x, 72, ch, { size: 58, weight: 700, fill: Y }); el.cx = x + w / 2; return el; });
  T(h3, 156, 50, 'a stronger', { size: 26, weight: 600, fill: C.muted });
  T(h3, 156, 80, 'electromagnet', { size: 26, weight: 600, fill: C.muted });
  const ticP = [
    { x: 60, n: 10, core: false, lab: [['more', C.ink]], key: [['T', Y, 800], ['urns', C.ink]] },
    { x: 170, n: 5, core: false, lab: [['I', Y, 800], ['ncrease', C.ink]], key: [['current', C.ink]] },
    { x: 280, n: 5, core: true, lab: [['iron', C.ink]], key: [['C', Y, 800], ['ore', C.ink]] },
  ].map((d, k) => {
    const g = G(h3); tr(g, d.x, 152);
    E('path', { d: 'M-48,0 H48', stroke: '#8A5A2B', 'stroke-width': 3 }, g);
    coil(g, d.n, 76, 40, { core: d.core, sw: 3 });
    const dots = k === 1 ? [0, 1, 2].map(() => E('circle', { r: 4.5, fill: Y }, g)) : [];
    rich(g, 0, 60, d.lab, { size: 26, weight: 700, anchor: 'middle' });
    rich(g, 0, 90, d.key, { size: 26, weight: 700, anchor: 'middle' });
    return { g, dots, x: d.x };
  });

  // 4. Ammeter: Always in a line. Voltmeter: Verily across.
  const h4 = hookCard('meters');
  const m4a = G(h4), m4v = G(h4);
  rich(m4a, 28, 62, [['A', Y, 800], ['mmeter:', C.ink]], { size: 32, weight: 700 });
  rich(m4a, 28, 102, [['A', Y, 800], ['lways in a line', C.ink]], { size: 32, weight: 600 });
  rich(m4v, 28, 168, [['V', Y, 800], ['oltmeter:', C.ink]], { size: 32, weight: 700 });
  rich(m4v, 28, 208, [['V', Y, 800], ['erily across', C.ink]], { size: 32, weight: 600 });
  const ml = G(h4);
  const SC = 0.6;
  const mw = wire(ml, [[405, 216], [326, 216], [326, 120], [518, 120], [518, 216], [459, 216]], { spacing: 30, dot: 4 });
  const mCell = G(ml); tr(mCell, 432, 216, SC); cellSym(mCell, { signs: false });
  E('path', { d: 'M436,120 V62 H500 V120', fill: 'none', stroke: WIRE, 'stroke-width': 3 }, ml);
  E('circle', { cx: 436, cy: 120, r: 4.5, fill: WIRE }, ml); E('circle', { cx: 500, cy: 120, r: 4.5, fill: WIRE }, ml);
  const mAm = G(ml); tr(mAm, 368, 120, SC); meterSym(mAm, 'A');
  const mBulb = G(ml); tr(mBulb, 468, 120, SC); const mB = bulbSym(mBulb); mB.set(0.8);
  const mVm = G(ml); tr(mVm, 468, 62, SC); meterSym(mVm, 'V');
  const ringA = E('circle', { cx: 368, cy: 120, r: 26, fill: 'none', stroke: Y, 'stroke-width': 3.5 }, ml);
  const ringV = E('rect', { x: 426, y: 40, width: 84, height: 92, rx: 14, fill: 'none', stroke: Y, 'stroke-width': 3.5 }, ml);

  // 5. Series shares the voltage; parallel splits the current.
  const h5 = hookCard('shares');
  const s5a = rich(h5, 28, 60, [['Series', Y, 800], [' shares the voltage;', C.ink]], { size: 32, weight: 700 });
  const s5b = rich(h5, 28, 102, [['parallel', Y, 800], [' splits the current.', C.ink]], { size: 32, weight: 700 });
  const vb = G(h5);
  const vFull = G(vb); E('rect', { x: 34, y: 150, width: 200, height: 36, rx: 8, fill: Y }, vFull); T(vFull, 134, 177, '3 V', { size: 26, weight: 700, fill: C.bg0, anchor: 'middle' });
  const vHalf = [0, 1].map(k => { const g = G(vb); E('rect', { x: -48, y: -18, width: 96, height: 36, rx: 8, fill: Y }, g); T(g, 0, 9, '1.5 V', { size: 24, weight: 700, fill: C.bg0, anchor: 'middle' }); return g; });
  T(vb, 134, 236, 'series', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const ib = G(h5);
  const iMain = G(ib); arrow(iMain, 290, 186, 360, 186, { color: C.water, width: 12, head: 30 });
  const iUp = G(ib), iDn = G(ib);
  arrow(iUp, 372, 180, 470, 142, { color: C.water, width: 7 }); arrow(iDn, 372, 192, 470, 230, { color: C.water, width: 7 });
  const iLab = G(ib);
  T(iLab, 318, 166, '0.8 A', { size: 24, weight: 700, fill: C.water, anchor: 'middle' });
  T(iLab, 476, 134, '0.4 A', { size: 24, weight: 700, fill: C.water, anchor: 'start' });
  T(iLab, 476, 248, '0.4 A', { size: 24, weight: 700, fill: C.water, anchor: 'start' });
  T(ib, 318, 236, 'parallel', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const hookCards = [['lroa', h1], ['cobwebs', h2], ['tic', h3], ['meters', h4], ['shares', h5]];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['lines: N → S', 'S pole near North', 'off: no magnet', 'series: dimmer', 'amps and volts'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 246 + i * 84;
    const box = E('rect', { x: 40, y: y - 32, width: 296, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const discG = G(g); tr(discG, 76, y);
    const disc = E('circle', { r: 22, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, discG);
    const num = T(discG, 0, 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    const xx = cross(discG, 9, '#FFFFFF'), tk = tick(discG, 11, C.bg0);
    T(g, 110, y + 9, nm, { size: 24, weight: 600 });
    return { g, box, discG, disc, num, xx, tk, y };
  });
  const FX = 362, FY = 196, FW = 798, FH = 466;
  const focus = G(traps);
  card(focus, FX, FY, FW, FH, { fill: C.card, stroke: C.line });
  const hint = T(focus, FX + FW / 2, FY + FH / 2 + 10, 'Spot the mistake, then fix it', { size: 32, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, draw) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, FX + 42, FY + 58);
    const wt = T(g, FX + 76, FY + 70, wrong, { size: 30, weight: 600, fill: C.muted });
    const st = strike(g, FX + 70, FY + 59, FX + 84 + textWidth(wrong, 30, FD, 600), C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, FX + 42, FY + 120);
    rich(rg, FX + 76, FY + 132, right, { size: fit(right, 34, FW - 110), weight: 700 });
    const ill = G(g);
    const anim = draw(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const IX = FX + FW / 2, IY = FY + 324;      // illustration centre

  // trap 1 (showpiece): tangled S -> N lines untangle into nested N -> S lines
  function fieldLines(g) {
    const sc = 2.15, X = v => IX + (v - 120) * sc, Yv = v => IY + (v - 65) * sc;
    const right = [   // [x0,y0, c1x,c1y, c2x,c2y, mx,my, c3x,c3y, c4x,c4y, x1,y1] (two cubic halves), from the topic diagram
      [95, 56, 78, 52, 82, 40, 120, 40, 158, 40, 162, 52, 145, 56], [95, 58, 65, 54, 70, 24, 120, 24, 170, 24, 175, 54, 145, 58], [95, 61, 50, 58, 58, 8, 120, 8, 182, 8, 190, 58, 145, 61],
    ];
    const wrongTop = [
      [95, 56, 70, 52, 96, 26, 140, 28, 176, 30, 162, 52, 145, 56], [95, 58, 62, 54, 52, 30, 100, 30, 150, 30, 175, 54, 145, 58], [95, 61, 50, 58, 58, 8, 120, 8, 182, 8, 190, 58, 145, 61],
    ];
    const mirror = a => a.map((v, i) => (i % 2 ? 130 - v : v));
    const R = right.concat(right.map(mirror)), Wg = wrongTop.concat(wrongTop.map(mirror));
    const paths = R.map(() => E('path', { fill: 'none', stroke: '#B48CFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g));
    const straight = E('path', { d: `M${X(95)},${Yv(65)} L${X(22)},${Yv(65)} M${X(218)},${Yv(65)} L${X(145)},${Yv(65)}`, fill: 'none', stroke: '#B48CFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const heads = R.map(() => E('path', { d: 'M9,0 L-7,-7 L-3,0 L-7,7 Z', fill: '#D9C4FF' }, g)).concat([0, 1].map(() => E('path', { d: 'M9,0 L-7,-7 L-3,0 L-7,7 Z', fill: '#D9C4FF' }, g)));
    const mg = G(g); tr(mg, IX, IY); magnet(mg, 50 * sc, 20 * sc);
    const bad = cross(g, 22); const good = tick(g, 22);
    return (t, k) => {
      const u = P(t, mid(k, 0.4), 1.3);
      paths.forEach((p, i) => {
        const a = Wg[i], b = R[i], c = a.map((v, j) => lerp(v, b[j], u));
        p.setAttribute('d', `M${X(c[0]).toFixed(1)},${Yv(c[1]).toFixed(1)} C${X(c[2]).toFixed(1)},${Yv(c[3]).toFixed(1)} ${X(c[4]).toFixed(1)},${Yv(c[5]).toFixed(1)} ${X(c[6]).toFixed(1)},${Yv(c[7]).toFixed(1)} C${X(c[8]).toFixed(1)},${Yv(c[9]).toFixed(1)} ${X(c[10]).toFixed(1)},${Yv(c[11]).toFixed(1)} ${X(c[12]).toFixed(1)},${Yv(c[13]).toFixed(1)}`);
        tr(heads[i], X(c[6]), Yv(c[7]), 1, 180 * (1 - u));   // apex arrows: N -> S points right
      });
      tr(heads[6], X(46), Yv(65), 1, 180 * u); tr(heads[7], X(190), Yv(65), 1, 180 * u);
      const bp = popIn(t, mid(k, 0.16), 0.4); op(bad, clamp(bp * 2) * (1 - fade(t, mid(k, 0.4), 0.3))); tr(bad, IX + 250, IY - 105, Math.max(0.01, bp));
      const gp = popIn(t, mid(k, 0.8), 0.4); op(good, clamp(gp * 2)); tr(good, IX + 250, IY - 105, Math.max(0.01, gp));
      op(straight, 1);
    };
  }
  // trap 2: Earth with its inner magnet, S at the top
  function earthPic(g) {
    const EX = IX - 120, EYc = IY + 4, ER = 116;
    E('circle', { cx: EX, cy: EYc, r: ER, fill: ball('#3E8FD8', '#1B4F86'), stroke: '#9FD8FF', 'stroke-width': 3 }, g);
    E('path', { d: `M${EX - 70},${EYc - 60} C${EX - 30},${EYc - 90} ${EX + 10},${EYc - 70} ${EX + 4},${EYc - 34} C${EX - 4},${EYc - 4} ${EX - 60},${EYc + 4} ${EX - 86},${EYc - 20} Z M${EX + 30},${EYc + 20} C${EX + 70},${EYc + 4} ${EX + 96},${EYc + 40} ${EX + 70},${EYc + 76} C${EX + 44},${EYc + 96} ${EX + 16},${EYc + 70} ${EX + 30},${EYc + 20} Z`, fill: '#4FB878', opacity: 0.85 }, g);
    E('line', { x1: EX, y1: EYc - ER - 26, x2: EX, y2: EYc + ER + 16, stroke: '#E4ECF5', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
    const inner = G(g); tr(inner, EX, EYc);
    E('rect', { x: -19, y: -70, width: 38, height: 70, rx: 6, fill: ball(BLUE, '#1E4FA8') }, inner);
    E('rect', { x: -19, y: 0, width: 38, height: 70, rx: 6, fill: ball(RED, '#A4232E') }, inner);
    T(inner, 0, -26, 'S', { size: 30, weight: 700, fill: '#fff', anchor: 'middle' });
    T(inner, 0, 48, 'N', { size: 30, weight: 700, fill: '#fff', anchor: 'middle' });
    const sGlow = E('circle', { cx: EX, cy: EYc - 46, r: 46, fill: glow(BLUE) }, g);
    T(g, EX, EYc - ER - 36, 'geographic North', { size: 26, weight: 600, fill: C.ink, anchor: 'middle' });
    const cg = G(g); tr(cg, EX - 86, EYc - 84);
    E('circle', { r: 30, fill: C.card, stroke: '#9FB4C3', 'stroke-width': 3 }, cg);
    const needle = G(cg);
    E('path', { d: 'M0,-25 L7,0 L-7,0 Z', fill: RED }, needle); E('path', { d: 'M0,25 L7,0 L-7,0 Z', fill: C.ink }, needle);
    E('circle', { r: 3, fill: C.bg0 }, cg);
    const att2 = G(g); arrow(att2, EX - 50, EYc - 92, EX - 22, EYc - 58, { color: C.good, width: 5, head: 16 });
    const lab = G(g);
    rich(lab, IX + 60, IY - 20, ['magnetic ', ['S', BLUE, 800]], { size: 32, weight: 700 });
    rich(lab, IX + 60, IY + 22, ['near geographic ', ['N', Y, 800]], { size: 32, weight: 700 });
    return (t, k) => {
      const sw = P(t, mid(k, 0.45), 1.0, easeOut);
      const pa = Math.atan2(-84, -86), target = Math.atan2(Math.cos(pa), -Math.sin(pa)) * 180 / Math.PI + 90;   // along the surface, towards geographic North
      tr(needle, 0, 0, 1, lerp(-60, target, sw) + Math.sin(t * 6) * 8 * (1 - sw) * calm);
      op(att2, fade(t, mid(k, 0.6)));
      op(sGlow, fade(t, mid(k, 0.4)) * (0.6 + 0.4 * wave(t, 1.2)));
      op(lab, fade(t, mid(k, 0.62)));
    };
  }
  // trap 3: the electromagnet is switched off, and the clips fall
  function nailPic(g) {
    const NX0 = IX - 200, NX1 = IX + 110, NY = IY - 66, BY = IY + 62;
    E('path', { d: `M${NX0 + 50},${NY} V${BY} H${IX - 110}`, fill: 'none', stroke: COPPER, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M${NX1 - 30},${NY} V${BY} H${IX - 10}`, fill: 'none', stroke: COPPER, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    const swG = G(g); tr(swG, IX - 60, BY); const sw = switchSym(swG);
    const cell = G(g); tr(cell, IX + 40, BY);
    E('rect', { x: -40, y: -16, width: 80, height: 32, rx: 6, fill: ball('#3A4752', '#1C252C'), stroke: '#8DA2B3', 'stroke-width': 2 }, cell);
    E('rect', { x: 38, y: -8, width: 8, height: 16, rx: 2, fill: COPPER }, cell);
    T(cell, 26, 8, '+', { size: 22, weight: 700, fill: C.bad, anchor: 'middle' });
    const tipGlow = E('ellipse', { cx: NX1 + 34, cy: NY, rx: 46, ry: 38, fill: glow(C.energy) }, g);
    E('path', { d: `M${NX0},${NY - 11} L${NX1},${NY - 11} L${NX1 + 34},${NY} L${NX1},${NY + 11} L${NX0},${NY + 11} Z`, fill: linGrad('#B4C0CB', '#6E7C89', true), stroke: '#D5DEE5', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: NX0 - 8, y: NY - 22, width: 10, height: 44, rx: 3, fill: '#8F9CAB', stroke: '#D5DEE5', 'stroke-width': 2 }, g);
    const cl = G(g); tr(cl, (NX0 + NX1) / 2 + 10, NY); coil(cl, 9, 230, 40, { sw: 4 });
    const dots = [0, 1, 2, 3].map(() => E('circle', { r: 5, fill: C.energy }, g));
    const heap = G(g); [[NX1 + 66, BY + 30, 12], [NX1 + 100, BY + 34, -18], [NX1 + 82, BY + 22, 30]].forEach(([x, y, r]) => { const c = G(heap); tr(c, x, y, 1, r); clipArt(c); });
    const clips = [0, 1, 2].map(k => ({ g: G(g), k }));
    clips.forEach(c => clipArt(c.g));
    const offChip = chip(g, 'current off', { size: 26, fill: 'rgba(10,27,39,0.8)', stroke: C.line, sw: 2 }); tr(offChip, IX - 60, BY + 50);
    return (t, k) => {
      const tOff = mid(k, 0.42), off = t >= tOff;
      sw.set(1 - P(t, tOff, 0.25));
      op(tipGlow, off ? 1 - fade(t, tOff, 0.2) : 0.6 + 0.3 * wave(t, 0.9));
      const loop = [[NX0 + 50, NY], [NX0 + 50, BY], [NX1 - 30, BY], [NX1 - 30, NY]];
      dots.forEach((d, i) => {
        const p = along(loop, (Math.min(t, tOff) * 0.32 + i / 4) % 1);
        attr(d, 'cx', p[0]); attr(d, 'cy', p[1]); op(d, off ? 1 - fade(t, tOff, 0.2) : 1);
      });
      clips.forEach(c => {
        const y0 = NY + 22 + c.k * 30, x0 = NX1 + 30 + c.k * 3;
        const u = clamp((t - tOff - 0.12 - c.k * 0.06) / 0.5);
        const yb = BY + 24 - c.k * 4, y = u <= 0 ? y0 : lerp(y0, yb, u * u) - (u >= 1 ? 0 : 0);
        tr(c.g, x0 + u * (12 + c.k * 14) + Math.sin(t * 2 + c.k) * (u > 0 ? 0 : 1.5 * calm), y, 1, u > 0 ? lerp(90, 20 - c.k * 25, u) : 90);
      });
      op(offChip, popIn(t, tOff + 0.1, 0.4));
    };
  }
  // trap 4: a third bulb in series, and they all dim
  function seriesPic(g) {
    const L = IX - 210, Rr = IX + 210, Tp = IY - 70, Bt = IY + 90;
    const w = wire(g, [[IX - 59, Bt], [L, Bt], [L, Tp], [Rr, Tp], [Rr, Bt], [IX + 59, Bt]], { spacing: 44 });
    const bat = G(g); tr(bat, IX, Bt); cellSym(bat, { cells: 2 });
    const bulbs = [0, 1, 2].map(() => { const b = G(g); return { b, s: bulbSym(b) }; });
    const bright = G(g); tr(bright, Rr + 92, IY - 70);
    chip(bright, 'brighter', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
    const bx = cross(bright, 20);
    return (t, k) => {
      const add = P(t, mid(k, 0.35), 0.8);
      const xs2 = [IX - 70, IX + 70], xs3 = [IX - 120, IX, IX + 120];
      bulbs.forEach((o, i) => {
        if (i < 2) tr(o.b, lerp(xs2[i], xs3[i], add), Tp);
        else { tr(o.b, xs3[2], lerp(Tp - 60, Tp, add)); op(o.b, fade(t, mid(k, 0.35), 0.3)); }
        o.s.set(lerp(0.4, 0.2, P(t, mid(k, 0.35) + 0.6, 0.5)));
      });
      w.upd(t, 30 - 10 * P(t, mid(k, 0.35) + 0.6, 0.5));
      op(bright, fade(t, mid(k, 0.6)));
      const xp = popIn(t, mid(k, 0.68), 0.4); op(bx, clamp(xp * 2)); tr(bx, 0, 0, Math.max(0.01, xp));
    };
  }
  // trap 5: amps and volts
  function unitsPic(g) {
    const am = G(g); tr(am, IX - 170, IY - 30, 1.5); const A = meterSym(am, 'A'); A.set('0.4 A');
    const vm = G(g); tr(vm, IX + 170, IY - 30, 1.5); const V = meterSym(vm, 'V'); V.set('1.5 V');
    const ca = G(g); tr(ca, IX - 170, IY + 70); const caC = chip(ca, 'current: amps (A)', { size: 28, fill: 'rgba(86,214,155,0.12)', stroke: C.good, sw: 2.5 });
    const cv = G(g); tr(cv, IX + 170, IY + 70); const cvC = chip(cv, 'voltage: volts (V)', { size: 28, fill: 'rgba(86,214,155,0.12)', stroke: C.good, sw: 2.5 });
    const ta = tick(g, 14), tv = tick(g, 14);
    return (t, k) => {
      const pa = popIn(t, mid(k, 0.3), 0.45), pv = popIn(t, mid(k, 0.52), 0.45);
      op(am, clamp(pa * 2)); op(ca, clamp(pa * 2)); tr(ca, IX - 170, IY + 70 + (1 - clamp(pa)) * 12);
      op(vm, clamp(pv * 2)); op(cv, clamp(pv * 2)); tr(cv, IX + 170, IY + 70 + (1 - clamp(pv)) * 12);
      const qa = popIn(t, mid(k, 0.3) + 0.35, 0.4), qv = popIn(t, mid(k, 0.52) + 0.35, 0.4);
      op(ta, clamp(qa * 2)); tr(ta, IX - 170, IY + 122, Math.max(0.01, qa));
      op(tv, clamp(qv * 2)); tr(tv, IX + 170, IY + 122, Math.max(0.01, qv));
    };
  }
  const T5 = [
    trapGroup('Field lines go from S to N, and can cross', ['Field lines go ', ['N → S', Y, 800], ', and ', ['never cross', Y, 800]], fieldLines),
    trapGroup('A magnetic north pole sits near the North', ['A magnetic ', ['south', '#7FB2FF', 800], ' pole is near the geographic ', ['North', Y, 800]], earthPic),
    trapGroup('An electromagnet stays magnetic when off', ['Switch off, and the magnetism ', ['vanishes', Y, 800]], nailPic),
    trapGroup('More bulbs in series: brighter bulbs', ['More bulbs in series: ', ['dimmer', Y, 800], ' bulbs'], seriesPic),
    trapGroup('Current in volts, voltage in amps', ['Current in ', ['amps', Y, 800], ', voltage in ', ['volts', Y, 800]], unitsPic),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: the magnet shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('lroa') + 0.2, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.42), 0.35, easeIn);
      tr(shackle, 0, -34 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.42) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('lroa') - 0.3, 0.5));
    }

    // memory hooks build up, then slide away for the traps
    const tOut = at('traps') - 0.45;
    const hookOut = 1 - P(t, tOut + 0.42, 0.22, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([id, g], i) => {
        const [x, y] = SLOTS[id];
        const p = P(t, at(id) - 0.15, 0.55, pop), o = P(t, tOut + i * 0.04, 0.4, easeIn);
        op(g, clamp(p * 2) * (1 - o));
        tr(g, x + o * (i % 2 ? 60 : -60), y + (1 - clamp(p)) * 26 + o * 40);
      });
      // 1. magnets repel, one turns round and they attract; then − and + attract
      const r1 = P(t, at('lroa') + 0.15, 0.5, easeOut), flip = P(t, mid('lroa', 0.34), 0.4), a1 = P(t, mid('lroa', 0.34) + 0.4, 0.4, easeOut);
      const gapX = lerp(lerp(48, 60, r1), 40, a1);
      tr(magA, -gapX, 0);
      const fx = Math.abs(Math.cos(Math.PI * flip));
      op(magB1, flip < 0.5 ? 1 : 0); op(magB2, flip < 0.5 ? 0 : 1);
      magB1.setAttribute('transform', `translate(${gapX.toFixed(1)} 0) scale(${Math.max(0.02, fx).toFixed(3)} 1)`);
      magB2.setAttribute('transform', `translate(${gapX.toFixed(1)} 0) scale(${Math.max(0.02, fx).toFixed(3)} 1)`);
      const rv = r1 * (1 - fade(t, mid('lroa', 0.32), 0.2));
      op(rep[0], rv); op(rep[1], rv); tr(rep[0], -gapX + 6, -34); tr(rep[1], gapX - 6, -34);
      const av = fade(t, mid('lroa', 0.34) + 0.5, 0.3);
      op(att[0], av); op(att[1], av); tr(att[0], -gapX - 22, -34); tr(att[1], gapX + 22, -34);
      const cp = P(t, mid('lroa', 0.72), 0.6, easeOut);
      tr(cE, lerp(-40, -16, cp), 0); tr(cP, lerp(40, 16, cp), 0);
      op(chg, fade(t, mid('lroa', 0.66)));
      op(h1lab[0], fade(t, mid('lroa', 0.56))); op(h1lab[1], fade(t, mid('lroa', 0.72)));
      // 2. the four magnetic metals, as they are named
      mats.forEach((m, i) => { const p = popIn(t, mid('cobwebs', 0.44 + i * 0.13), 0.4); op(m, clamp(p * 2)); });
      // 3. TIC panels light in turn
      ticP.forEach((pn, i) => { const p = popIn(t, mid('tic', [0.18, 0.44, 0.74][i]), 0.45); op(pn.g, clamp(p * 2)); tr(pn.g, pn.x, 152 + (1 - clamp(p)) * 12); });
      ticT.forEach((tt, i) => { const f = Math.sin(Math.PI * P(t, mid('tic', [0.18, 0.44, 0.74][i]), 0.6, linear)); tt.setAttribute('transform', `translate(${tt.cx.toFixed(1)} 52) scale(${(1 + 0.25 * f).toFixed(3)}) translate(${(-tt.cx).toFixed(1)} -52)`); });
      ticP[1].dots.forEach((d, j) => { const u = ((t * 0.9 + j / 3) % 1); attr(d, 'cx', -38 + 76 * u); attr(d, 'cy', -20 + 40 * ((u * 5) % 1)); });
      // 4. the meters: in a line, then across
      op(m4a, fade(t, at('meters') - 0.1)); op(m4v, fade(t, mid('meters', 0.5)));
      mw.upd(t, 30);
      op(ringA, win(t, mid('meters', 0.12), mid('meters', 0.48), 0.25) * (0.6 + 0.4 * wave(t, 0.7)));
      op(ringV, win(t, mid('meters', 0.56), end('meters') + 0.6, 0.25) * (0.6 + 0.4 * wave(t, 0.7)));
      // 5. series splits the push; parallel splits the current
      const vs = P(t, mid('shares', 0.24), 0.6, easeOut);
      op(vFull, 1 - fade(t, mid('shares', 0.24), 0.2));
      vHalf.forEach((g, k) => { tr(g, lerp(134, k ? 186 : 82, vs), 168); op(g, fade(t, mid('shares', 0.24), 0.2)); });
      const ip = P(t, mid('shares', 0.66), 0.6, easeOut);
      iUp.firstChild.set(ip); iDn.firstChild.set(ip); op(iLab, fade(t, mid('shares', 0.7)));
      op(s5b, fade(t, mid('shares', 0.45)));
    }

    // traps
    const ta = P(t, at('traps') + 0.08, 0.45, linear);
    op(traps, ta);
    if (ta > 0) {
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.12 + i * 0.13), 0.45, pop);
        const active = t >= tk - 0.2 && t < nx - 0.2;
        const tFlip = mid('t' + k, 0.74), fl = P(t, tFlip, 0.35, linear), done = fl >= 0.5;
        op(s.g, clamp(appear * 2) * (t >= tk - 0.2 ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? Y : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        const sx = t < tk - 0.2 ? 1 : Math.max(0.02, Math.abs(Math.cos(Math.PI * fl)));
        s.discG.setAttribute('transform', `translate(76 ${s.y}) scale(${sx.toFixed(3)} 1)`);
        const trap = t >= tk - 0.2 && !done;
        s.disc.setAttribute('fill', done ? C.good : trap ? C.bad : C.card2);
        s.disc.setAttribute('stroke', done ? C.good : trap ? '#FF9AA5' : C.muted);
        op(s.num, trap || done ? 0 : 1); op(s.xx, trap ? 1 : 0); op(s.tk, done ? 1 : 0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.25, nx - 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.25, 0.4, linear));
        g.st.set(P(t, mid(k, 0.22), 0.5, easeOut));
        const rp = P(t, mid(k, 0.3), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = i === 0 ? fade(t, t0 - 0.25, 0.4) : P(t, mid(k, 0.12), 0.5, linear);
        op(g.ill, ip);
        g.anim(t, k);
      });
    }
  };
});

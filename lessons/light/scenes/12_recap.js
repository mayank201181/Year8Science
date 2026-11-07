/* Recap: an open padlock, "Lock it in" -> four memory-hook cards build a 2 x 2 board (ROYGBIV spectrum band, SloTo /
   FastAway rays, VUSL mirror and ghost candle, a selfish red filter) -> the board pulses and the padlock snaps shut on it
   -> the cards shrink into a top strip -> "5 exam traps": each shows the wrong idea struck out, the right one ticked, and a
   small diagram (angle from the normal, the virtual image, towards / away, the prism fan, the Moon reflecting sunlight). */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, NG = LT.nGlass;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  const DARK = '#10202B';
  const RAINBOW = SPECTRUM.map(s => s.color);
  /* a candle h tall standing on (0,0) with its flame tip at (0,-h); o.ghost draws the faint, dashed mirror image */
  function candle(parent, h, o) {
    o = o || {};
    const g = G(parent, o.ghost ? { opacity: 0.5 } : {}), bw = h * 0.3, bh = h * 0.6;
    E('rect', { x: -bw / 2, y: -bh, width: bw, height: bh, rx: bw * 0.2, fill: o.ghost ? 'rgba(246,235,210,0.12)' : ball('#F6EBD2', '#C9B98F'), stroke: '#EADCB8', 'stroke-width': 2.5, 'stroke-dasharray': o.ghost ? '6 5' : 'none' }, g);
    E('line', { x1: 0, y1: -bh, x2: 0, y2: -bh - h * 0.07, stroke: '#3A2A1A', 'stroke-width': 3 }, g);
    const fl = G(g); tr(fl, 0, -bh - h * 0.06);
    E('circle', { cx: 0, cy: -h * 0.15, r: h * 0.3, fill: glow('#FFB347') }, fl);
    E('path', { d: `M0,0 C${-h * 0.11},${-h * 0.07} ${-h * 0.1},${-h * 0.2} 0,${-h * 0.34} C${h * 0.1},${-h * 0.2} ${h * 0.11},${-h * 0.07} 0,0 Z`, fill: '#FFB13B', stroke: '#FFE07A', 'stroke-width': 1.5 }, fl);
    E('path', { d: `M0,-2 C${-h * 0.05},${-h * 0.05} ${-h * 0.05},${-h * 0.13} 0,${-h * 0.2} C${h * 0.05},${-h * 0.13} ${h * 0.05},${-h * 0.05} 0,-2 Z`, fill: '#FFF3B0' }, fl);
    g.flame = fl;
    return g;
  }
  /* an air / glass boundary at (x, y), glass below, w wide, rays L long. into: light goes down into the glass and bends
     towards the normal; otherwise it comes up out of the glass and bends away. g.ray.set(p) draws the ray. */
  function miniRefract(parent, x, y, w, L, into, o) {
    o = o || {};
    const g = G(parent), iA = 50, rA = snellAngle(iA, 1, NG);           // 50° in air, 30.7° in glass
    E('rect', { x: x - w / 2, y, width: w, height: L * 0.98, rx: 6, fill: LT.glassFill }, g);
    E('line', { x1: x - w / 2, y1: y, x2: x + w / 2, y2: y, stroke: LT.glassStroke, 'stroke-width': 3 }, g);
    normalLine(g, x, y, -90, L * 0.92, { back: L * 0.92, width: 2.5 });
    const air = ltPt(x, y, into ? -90 - iA : -90 + iA, L), gl = ltPt(x, y, into ? 90 - rA : 90 + rA, L);
    angleArc(g, x, y, -90, into ? -90 - iA : -90 + iA, o.arc || 26, { color: into ? LT.angI : LT.angR });
    angleArc(g, x, y, 90, into ? 90 - rA : 90 + rA, o.arc || 26, { color: into ? LT.angR : LT.angI });
    g.ray = rayPath(g, into ? [air, [x, y], gl] : [gl, [x, y], air], { width: o.width || 5, head: o.head || 14 });
    if (o.labels) { T(g, x - w / 2 + 14, y - 14, 'air', { size: 26, weight: 600, fill: C.muted }); T(g, x - w / 2 + 14, y + 36, 'glass', { size: 26, weight: 600, fill: C.muted }); }
    return g;
  }

  /* ---------- the padlock ---------- */
  const lockG = G(root);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 8 }, lockG);
  const lockTitle = G(root);
  T(lockTitle, 0, 0, 'Lock it in', { size: 58, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: a 2 x 2 board ---------- */
  const CW = 540, CH = 288;
  const SLOT = [[50, 116], [610, 116], [50, 424], [610, 424]];
  const hooks = SLOT.map(() => { const g = G(root); const box = card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); g.box = box; return g; });
  // 1. Richard Of York Gave Battle In Vain
  const h1 = hooks[0];
  const roy = 'Richard Of York Gave Battle In Vain'.split(' ').flatMap((w, k) => [[w[0], RAINBOW[k], 800], [w.slice(1) + (k < 6 ? ' ' : ''), C.ink, 700]]);
  rich(h1, 28, 58, roy, { size: fit(roy, 30, CW - 56), weight: 700 });
  const bandClip = (() => { const id = 'light-recap-band'; const cp = E('clipPath', { id }, defs()); E('rect', { x: 28, y: 92, width: CW - 56, height: 82, rx: 16 }, cp); return `url(#${id})`; })();
  const band = G(h1, { 'clip-path': bandClip }), sw = (CW - 56) / 7;
  const stripes = RAINBOW.map((c, k) => {
    const g = G(band);
    E('rect', { x: 28 + k * sw, y: 92, width: sw + 1, height: 82, fill: c }, g);
    T(g, 28 + (k + 0.5) * sw, 146, 'ROYGBIV'[k], { size: 38, weight: 700, anchor: 'middle', fill: k < 4 ? DARK : '#FFFFFF' });
    return g;
  });
  T(h1, CW / 2, 236, 'the spectrum in order, red to violet', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  // 2. SloTo, FastAway
  const h2 = hooks[1];
  rich(h2, 28, 58, [['SloTo', Y, 800], [', ', C.ink], ['FastAway', Y, 800]], { size: 36, weight: 700 });
  const ref2 = [miniRefract(h2, 140, 158, 220, 64, true), miniRefract(h2, 400, 158, 220, 64, false)];
  T(h2, 140, 262, 'slow down: towards', { size: 26, weight: 600, anchor: 'middle' });
  T(h2, 400, 262, 'speed up: away', { size: 26, weight: 600, anchor: 'middle' });
  // 3. VUSL
  const h3 = hooks[2];
  T(h3, 28, 58, 'VUSL', { size: 40, weight: 700, fill: Y, ls: 3 });
  const mir3 = planeMirror(h3, 176, { gap: 15 }); tr(mir3, 150, 172, 1, -90);
  const can3 = candle(h3, 112); tr(can3, 78, 252);
  const ghost3 = candle(h3, 112, { ghost: true }); tr(ghost3, 222, 252);
  E('line', { x1: 78, y1: 140, x2: 222, y2: 140, stroke: C.muted, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, h3);
  const vusl = [['V', 'virtual'], ['U', 'upright'], ['S', 'same size'], ['L', 'laterally inverted']].map(([l, w], k) => {
    const g = G(h3), y = 104 + k * 48;
    E('circle', { cx: 292, cy: y, r: 19, fill: Y }, g);
    T(g, 292, y + 9, l, { size: 26, weight: 700, anchor: 'middle', fill: DARK });
    T(g, 320, y + 9, w, { size: 26, weight: 600 });
    return g;
  });
  // 4. A filter is selfish
  const h4 = hooks[3];
  T(h4, 28, 58, 'A filter is selfish', { size: 34, weight: 700 });
  const thr = [0, 1, 2, 4, 5, 6].map((k, j) => ({ c: RAINBOW[k], y: 100 + j * 15 }));
  const thrIn = thr.map(o => { const l = E('line', { x1: 34, y1: o.y, x2: 266, y2: o.y, stroke: o.c, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, h4); return l; });
  E('rect', { x: 258, y: 80, width: 40, height: 116, rx: 6, fill: '#FF4D4D', opacity: 0.5, stroke: '#FF9A9A', 'stroke-width': 2.5 }, h4);
  const redOut = rayPath(h4, [[298, thr[0].y], [506, thr[0].y]], { color: RAINBOW[0], width: 5, head: 14 });
  T(h4, 150, 230, 'white light', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  T(h4, 410, 230, 'only red', { size: 26, weight: 700, fill: RAINBOW[0], anchor: 'middle' });
  T(h4, CW / 2, 268, 'it lets through only its own colour', { size: 26, weight: 600, anchor: 'middle' });
  const hookIds = ['richard', 'sloto', 'vusl', 'selfish'];

  /* ---------- the strip the cards shrink into ---------- */
  const stripG = G(root);
  const STRIP = [
    roy.filter((s, k) => k % 2 === 0).map(s => [s[0], s[1], 800]),
    [['SloTo', Y, 800], [', FastAway', C.ink, 700]],
    [['VUSL', Y, 800]],
    [['A filter is ', C.ink, 700], ['selfish', Y, 800]],
  ].map((segs, k) => {
    const g = G(stripG), x = 50 + k * 278 + 131;
    E('rect', { x: x - 131, y: 115, width: 262, height: 54, rx: 27, fill: C.card, stroke: C.line, 'stroke-width': 2 }, g);
    rich(g, x, 151, segs, { size: 26, anchor: 'middle', weight: 700, fill: C.ink });
    return { g, x };
  });

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-27 L29,24 L-29,24 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(78 228)' }, head);
  T(head, 78, 247, '!', { size: 34, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 118, 244, '5 exam traps', { size: 38, weight: 700 });
  const slotNames = ['from the normal', 'virtual', 'slow → towards', 'violet most', 'non-luminous'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 304 + i * 78;
    const box = E('rect', { x: 50, y: y - 30, width: 292, height: 60, rx: 30, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 84, cy: y, r: 20, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 84, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 116, y + 9, nm, { size: 26, weight: 600 });
    const tk = tick(g, 10, C.bg0); tr(tk, 84, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 204, 780, 508, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 468, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 414, 262);
    const wt = T(g, 450, 273, wrong, { size: 32, weight: 600, fill: C.muted });
    const st = strike(g, 444, 262, 458 + textWidth(wrong, 32, FD, 600), C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 414, 340);
    rich(rg, 450, 352, right, { size: fit(right, 34, 680), weight: 700 });
    const ill = G(g);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    // 1. measure from the normal
    trapGroup('Measure angles from the surface', ['Measure angles from the ', ['normal', Y, 800]], g => {
      const parts = [[575, false], [945, true]].map(([x, good]) => {
        const sg = G(g), y = 618;
        const m = planeMirror(sg, 250); tr(m, x, y);
        normalLine(sg, x, y, -90, 190, { back: 0 });
        const src = ltPt(x, y, -130, 210);
        const ray = rayPath(sg, [src, [x, y]], { width: 5, head: 14 });
        const arc = good ? arcFromNormal(sg, x, y, -90, -40, 62, { color: LT.angI, text: 'i = {deg}°' })
          : angleArc(sg, x, y, 180, 230, 62, { color: C.bad, text: '{deg}°' });
        const mark = good ? tick(sg, 16) : cross(sg, 14); tr(mark, x + 92, y - 150);
        return { sg, ray, arc, mark };
      });
      T(g, 760, 686, 'the normal is at 90° to the surface', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
      return t => parts.forEach((p, j) => { p.ray.set(P(t, at('t1') + 0.1 + j * 0.3, 0.6, linear)); p.arc.set(P(t, mid('t1', 0.2) + j * 0.35, 0.5)); op(p.mark, P(t, mid('t1', 0.38) + j * 0.3, 0.3, linear)); });
    }),
    // 2. a virtual image: two rays from the flame reflect; traced back, they meet behind the mirror
    trapGroup('A plane-mirror image is real', ['A plane-mirror image is ', ['virtual', Y, 800]], g => {
      const MXm = 760, P0 = [560, 450], P1 = [960, 450];
      const m = planeMirror(g, 280, { gap: 15 }); tr(m, MXm, 540, 1, -90);
      const c0 = candle(g, 150); tr(c0, P0[0], P0[1] + 150);
      const c1 = candle(g, 150, { ghost: true }); tr(c1, P1[0], P1[1] + 150);
      const hits = [[MXm, 420], [MXm, 560]];
      const rays = hits.map(h => { const out = [h[0] + (h[0] - P1[0]) * 0.9, h[1] + (h[1] - P1[1]) * 0.9]; return rayPath(g, [P0, h, out], { width: 4.5, head: 13 }); });
      const dashes = hits.map(h => E('line', { x1: h[0], y1: h[1], x2: P1[0], y2: P1[1], stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '8 7' }, g));
      const note = T(g, P1[0], 648, 'no light really gets here', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
      return t => { rays.forEach((r, j) => r.set(P(t, at('t2') + 0.1 + j * 0.25, 0.8, linear))); dashes.forEach(d => op(d, P(t, mid('t2', 0.35), 0.4, linear))); op(c1, 0.5 * P(t, mid('t2', 0.45), 0.4, linear)); op(note, P(t, mid('t2', 0.55), 0.4, linear)); c0.flame.setAttribute('transform', `translate(0 ${(-150 * 0.66).toFixed(1)}) scale(${(1 + 0.05 * calm * Math.sin(t * 9)).toFixed(3)} ${(1 + 0.08 * calm * Math.sin(t * 13)).toFixed(3)})`); };
    }),
    // 3. towards when slowing, away when speeding up
    trapGroup('Light always bends towards the normal', [['Towards', Y, 800], ' if it slows, ', ['away', Y, 800], ' if it speeds up'], g => {
      const a = miniRefract(g, 590, 520, 300, 112, true, { arc: 40, labels: true });
      const b = miniRefract(g, 930, 520, 300, 112, false, { arc: 40, labels: true });
      const ta = tick(g, 15); tr(ta, 700, 436); const tb = tick(g, 15); tr(tb, 1060, 436);
      T(g, 590, 686, 'into glass: slows', { size: 26, weight: 600, anchor: 'middle' });
      T(g, 930, 686, 'out of glass: speeds up', { size: 26, weight: 600, anchor: 'middle' });
      return t => { a.ray.set(P(t, mid('t3', 0.12), 1.0, linear)); b.ray.set(P(t, mid('t3', 0.62), 1.0, linear)); op(ta, P(t, mid('t3', 0.45), 0.3, linear)); op(tb, P(t, mid('t3', 0.9), 0.3, linear)); };
    }),
    // 4. violet bends the most
    trapGroup('Red bends the most', [['Violet', SPECTRUM[6].color, 800], ' bends most, ', ['red', SPECTRUM[0].color, 800], ' least'], g => {
      const pr = glassPrism(g, 200).at(700, 548);
      const start = [470, 610], dir = -18;
      const paths = SPECTRUM.map(s => pr.trace(start, dir, s.n, 230));
      const white = rayPath(g, [start, paths[0][1]], { color: LT.white, width: 7, head: 16 });
      const fan = paths.map((p, k) => rayPath(g, p.slice(1), { color: SPECTRUM[k].color, width: 3.5, glow: false, heads: false }));
      const eR = paths[0][paths[0].length - 1], eV = paths[6][paths[6].length - 1];
      const lr = T(g, eR[0] + 12, eR[1] + 8, 'red: least', { size: 26, weight: 700, fill: SPECTRUM[0].color });
      const lv = T(g, eV[0] + 12, eV[1] + 8, 'violet: most', { size: 26, weight: 700, fill: SPECTRUM[6].color });
      return t => { const t0 = at('t4') + 0.1; white.set(P(t, t0, 0.5, linear)); fan.forEach((f, k) => f.set(P(t, t0 + 0.45 + k * 0.05, 0.8, linear))); op(lr, P(t, mid('t4', 0.35), 0.4, linear)); op(lv, P(t, mid('t4', 0.25), 0.4, linear)); };
    }),
    // 5. the Moon only reflects sunlight
    trapGroup('The Moon is luminous', ['The Moon is ', ['non-luminous', Y, 800]], g => {
      const sn = sun(g, 34); tr(sn, 520, 480);
      const MO = [920, 500], MRd = 46;
      const moon = G(g); tr(moon, MO[0], MO[1]);
      E('circle', { r: MRd, fill: '#3A4652' }, moon);
      E('path', { d: `M0,${-MRd} A${MRd},${MRd} 0 0 0 0,${MRd} Z`, fill: ball('#E4ECF5', '#9AA8B6') }, moon);
      [[-18, -14, 7], [-26, 16, 5], [-8, 24, 4]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#B9C5D0' }, moon));
      const eye = eyeIcon(g, 1, { right: true }); tr(eye, 650, 650, 1, -24);
      const r1 = rayPath(g, [[560, 484], [MO[0] - MRd + 2, 496]], { width: 5, head: 14 });
      const r2 = rayPath(g, [[MO[0] - MRd + 4, 512], [688, 634]], { width: 5, head: 14 });
      const lab = T(g, MO[0] + 16, 590, 'reflects sunlight', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
      const lum = T(g, 520, 572, 'luminous', { size: 26, weight: 600, fill: Y, anchor: 'middle' });
      return t => { sn.upd(t * calm); r1.set(P(t, at('t5') + 0.1, 0.7, linear)); r2.set(P(t, at('t5') + 0.8, 0.6, linear)); op(lab, P(t, mid('t5', 0.55), 0.4, linear)); op(lum, P(t, at('t5') + 0.2, 0.4, linear)); };
    }),
  ];

  root.appendChild(lockG);                 // the padlock flies over the board, so it is drawn last

  /* ---------- update ---------- */
  return t => {
    // the padlock: big and open for "Lock it in", then docked at the top right; it flies onto the board and snaps shut
    const dock = P(t, at('richard') - 0.35, 0.7);
    const toBoard = P(t, mid('selfish', 0.42), 0.6), shut = P(t, mid('selfish', 0.72), 0.3, easeIn), back = P(t, at('traps') - 0.1, 0.6);
    const DK = [1120, 76, 0.28], BD = [590, 392, 0.52];
    let lx = lerp(600, DK[0], dock), ly = lerp(300, DK[1], dock), ls = lerp(1, DK[2], dock);
    lx = lerp(lx, BD[0], toBoard); ly = lerp(ly, BD[1], toBoard); ls = lerp(ls, BD[2], toBoard);
    lx = lerp(lx, DK[0], back); ly = lerp(ly, DK[1], back); ls = lerp(ls, DK[2], back);
    ls *= 1 + 0.12 * Math.sin(Math.PI * P(t, mid('selfish', 0.72) + 0.28, 0.4, linear));
    op(lockG, P(t, S.first - 0.5, 0.5, linear));
    tr(lockG, lx, ly - 12 * ls, ls);
    shackle.setAttribute('transform', `translate(0 ${(-38 * (1 - shut)).toFixed(2)}) rotate(${(-16 * (1 - shut)).toFixed(2)} -52 0)`);
    const rp = clamp((t - mid('selfish', 0.72) - 0.3) / 0.8);
    op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 90);
    // "Lock it in" title: centred, then small beside the docked padlock, gone for the traps
    op(lockTitle, P(t, S.first - 0.4, 0.5, linear) * (1 - P(t, at('traps') - 0.2, 0.4, linear)));
    tr(lockTitle, lerp(600, 994, dock), lerp(500, 82, dock), lerp(1, 0.62, dock));

    // memory hooks build the board, pulse once, then shrink into the strip
    const pulse = Math.sin(Math.PI * P(t, mid('selfish', 0.72) + 0.25, 0.6, linear));
    const shrink = P(t, at('traps') - 0.3, 0.6);
    hooks.forEach((g, i) => {
      const p = P(t, at(hookIds[i]) - 0.15, 0.55, pop);
      const [x0, y0] = SLOT[i], s = lerp(1, 0.485, shrink) * (1 + 0.025 * pulse);
      const sx = STRIP[i].x, x = lerp(x0 + CW / 2, sx, shrink) - CW / 2 * s, y = lerp(y0 + CH / 2, 142, shrink) - CH / 2 * s + (1 - clamp(p)) * 26;
      op(g, clamp(p * 2) * (1 - P(t, at('traps') + 0.05, 0.3, linear)));
      tr(g, x, y, s);
      g.box.setAttribute('stroke', pulse > 0.05 ? Y : C.line); g.box.setAttribute('stroke-width', (2 + 3 * pulse).toFixed(2));
    });
    // card 1: the band lights up colour by colour as the names are read
    stripes.forEach((s, k) => op(s, 0.25 + 0.75 * P(t, mid('richard', 0.5 + k * 0.065), 0.25, linear)));
    // card 2: the two rays travel
    ref2[0].ray.set(P(t, mid('sloto', 0.12), 0.9, linear)); ref2[1].ray.set(P(t, mid('sloto', 0.55), 0.9, linear));
    // card 3: V U S L as each word is said
    vusl.forEach((g, k) => op(g, P(t, mid('vusl', [0.48, 0.6, 0.7, 0.82][k]), 0.3, linear)));
    op(ghost3, 0.5 * P(t, mid('vusl', 0.25), 0.5, linear));
    can3.flame.setAttribute('transform', `translate(0 ${(-112 * 0.66).toFixed(1)}) scale(${(1 + 0.05 * calm * Math.sin(t * 9)).toFixed(3)} ${(1 + 0.08 * calm * Math.sin(t * 13)).toFixed(3)})`);
    // card 4: white light in, only red out
    thrIn.forEach((l, k) => l.setAttribute('stroke-dashoffset', (1 - P(t, at('selfish') + 0.1 + k * 0.04, 0.6, linear)).toFixed(4)));
    redOut.set(P(t, at('selfish') + 0.75, 0.6, linear));
    // the strip
    STRIP.forEach((c, i) => op(c.g, P(t, at('traps') + 0.15 + i * 0.06, 0.35, linear)));

    // traps
    const ta = P(t, at('traps') + 0.2, 0.4, linear);
    op(traps, ta);
    if (ta > 0) {
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : end('t5') + 0.35;
        const appear = P(t, mid('traps', 0.1 + i * 0.13), 0.45, pop);
        const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
        op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? Y : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? Y : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, 0.26), 0.45, easeOut));
        const rp2 = P(t, mid(k, 0.32), 0.5, pop); op(g.rg, clamp(rp2 * 2)); tr(g.rg, (1 - clamp(rp2)) * 20, 0);
        const ip = P(t, t0 + 0.05, 0.5, easeOut); op(g.ill, ip); tr(g.ill, 0, (1 - ip) * 14);
        g.anim(t);
      });
    }
  };
});

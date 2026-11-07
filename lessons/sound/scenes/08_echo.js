/* Chapter 8: Echoes and ultrasound.
   Beats: a shout bounces off a hard, flat cliff -> the reflected sound comes back a moment later: an
   echo (with a little timeline) -> an empty room bounces sound around, a furnished one soaks it up
   -> ultrasound on the shared frequency line: above 20,000 Hz -> a scan: pulses and echoes build a
   picture of a baby -> a cleaning bath shakes dirt off a ring and glasses -> sonar from a ship and a
   submarine -> one pulse, a stopwatch: back after 4 s -> 1,500 x 4 = 6,000 m there and back, cut in
   half: 3,000 m deep (showpiece) -> bats and dolphins: echolocation. */
scene('echo', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const ID = S.ch.id;

  /* ---------- local helpers ---------- */
  let gid = 0;
  function hgrad(color, stops) {
    const id = `${ID}-hg${++gid}`;
    const lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    stops.forEach(([o, a]) => E('stop', { offset: o, 'stop-color': color, 'stop-opacity': a }, lg));
    return `url(#${id})`;
  }
  function clipRect(x, y, w, h) { const id = `${ID}-cl${++gid}`; const cp = E('clipPath', { id }, defs()); const r = E('rect', { x, y, width: w, height: h }, cp); return { url: `url(#${id})`, rect: r }; }
  function clipPathD(d) { const id = `${ID}-cl${++gid}`; const cp = E('clipPath', { id }, defs()); const p = E('path', { d }, cp); return { url: `url(#${id})`, path: p }; }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  const arcD = (cx, cy, r, a0, a1) => `M${(cx + r * Math.cos(a0)).toFixed(1)},${(cy + r * Math.sin(a0)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)},${(cy + r * Math.sin(a1)).toFixed(1)}`;
  const popIn = (el, t, t0, x, y, s0) => { s0 = s0 === undefined ? 0.6 : s0; const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); return p; };
  const beat = (t, a, b) => Math.min(P(t, a, 0.45, linear), 1 - P(t, b - 0.1, 0.45, linear));
  const VIO = C.ethanol, VIOLT = '#E4D6FF';
  /* a packet of n arcs leaving (cx, cy) in direction ang (radians), front at radius r, spacing sp */
  function packet(els, cx, cy, ang, r, sp, half, alpha, rmax) {
    els.forEach((el, i) => {
      const rr = r - i * sp;
      if (rr < 6 || (rmax && rr > rmax) || alpha <= 0) { op(el, 0); return; }
      el.setAttribute('d', arcD(cx, cy, rr, ang - half, ang + half));
      op(el, alpha * Math.min(1, rr / 24));
    });
  }
  const arcSet = (parent, n, color, w) => { const a = []; for (let i = 0; i < n; i++) a.push(E('path', { fill: 'none', stroke: color, 'stroke-width': w || 4, 'stroke-linecap': 'round' }, parent)); return a; };

  /* ---------- the shared frequency line (same proportions in every chapter) ---------- */
  const FL = { x0: 135, D: 186, y: 590, h: 28 };
  const fx = f => FL.x0 + FL.D * Math.log10(f / 2);
  function freqLine(parent) {
    const g = G(parent), h = FL.h, top = FL.y - h / 2, xL = fx(2) - 60, xR = fx(200000) + 60;
    const wT = xR - xL, wI = fx(20) - xL, wU = xR - fx(20000);
    g.track = E('rect', { x: xL, y: top, width: wT, height: h, fill: hgrad('#24485A', [[0, 0], [60 / wT, 1], [1 - 60 / wT, 1], [1, 0]]) }, g);
    g.inf = E('rect', { x: xL, y: top, width: wI, height: h, fill: hgrad(C.heat, [[0, 0], [60 / wI, 1], [1, 1]]) }, g);
    g.hear = E('rect', { x: fx(20), y: top, width: fx(20000) - fx(20), height: h, fill: C.good }, g);
    g.ult = E('rect', { x: fx(20000), y: top, width: wU, height: h, fill: hgrad(C.ethanol, [[0, 1], [1 - 60 / wU, 1], [1, 0]]) }, g);
    g.ticks = G(g); g.tl = {};
    [[2, '2'], [20, '20'], [200, '200'], [2000, '2,000'], [20000, '20,000'], [200000, '200,000']].forEach(([f, s]) => {
      E('line', { x1: fx(f), x2: fx(f), y1: top + h + 2, y2: top + h + 14, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g.ticks);
      g.tl[f] = T(g.ticks, fx(f), top + h + 44, s, { size: 26, weight: 600, anchor: 'middle' });
    });
    g.axis = T(g, 600, top + h + 86, 'frequency (Hz)', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
    const ly = top - 14;
    g.lInf = T(g, (fx(2) + fx(20)) / 2, ly, 'infrasound', { size: 28, weight: 700, anchor: 'middle', fill: C.heat });
    g.lHear = T(g, (fx(20) + fx(20000)) / 2, ly, 'hearing range', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
    g.lUlt = T(g, (fx(20000) + fx(200000)) / 2, ly, 'ultrasound', { size: 28, weight: 700, anchor: 'middle', fill: C.ethanol });
    g.setHear = (f0, f1) => { attr(g.hear, 'x', fx(f0)); attr(g.hear, 'width', Math.max(0, fx(f1) - fx(f0))); };
    return g;
  }

  /* ---------- art ---------- */
  const SKIN = '#E8B48E', SKINDK = '#B9825A', SKINLT = '#F7D9C2';
  function speaker(parent, s) {
    const g = G(parent), k = s || 1;
    E('rect', { x: -40 * k, y: -60 * k, width: 52 * k, height: 120 * k, rx: 10 * k, fill: '#22313D', stroke: '#5E7A8C', 'stroke-width': 3 }, g);
    const cone = G(g);
    E('path', { d: `M${12 * k},${-22 * k} L${34 * k},${-50 * k} L${34 * k},${50 * k} L${12 * k},${22 * k} Z`, fill: '#8FA4B3', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cone);
    E('ellipse', { cx: 34 * k, cy: 0, rx: 6 * k, ry: 50 * k, fill: '#6E8494', stroke: '#C9D6DE', 'stroke-width': 2 }, cone);
    g.set = v => tr(cone, 5 * k * v, 0);
    return g;
  }
  /* an ear, side view, about 80 x 110 */
  function earIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-2,-54 C30,-58 48,-32 44,-4 C41,16 30,24 24,36 C18,50 6,60 -9,56 C-22,52 -24,38 -15,30 C-8,24 -7,16 -15,8 C-26,-3 -32,-16 -30,-30 C-28,-45 -16,-53 -2,-54 Z', fill: ball(SKIN, SKINDK), stroke: SKINLT, 'stroke-width': 3 }, g);
    E('path', { d: 'M-14,-30 C-8,-44 18,-44 26,-24 C31,-9 20,0 10,6 C4,10 4,18 8,24', fill: 'none', stroke: '#B07A58', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 4, cy: -2, rx: 7, ry: 9, fill: '#7A4A33' }, g);
    return g;
  }
  /* bat, about 220 wide, facing right; g.flap(t) */
  function bat(parent) {
    const g = G(parent), DK = '#3E3550', LT = '#9C8CC0';
    const wL = E('path', { d: 'M-8,-6 C-40,-40 -80,-44 -112,-30 C-100,-20 -96,-8 -98,4 C-84,-4 -70,-2 -62,8 C-52,0 -36,0 -26,10 C-20,2 -14,0 -8,4 Z', fill: DK, stroke: LT, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const wR = E('path', { d: 'M8,-6 C40,-40 80,-44 112,-30 C100,-20 96,-8 98,4 C84,-4 70,-2 62,8 C52,0 36,0 26,10 C20,2 14,0 8,4 Z', fill: DK, stroke: LT, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 4, rx: 20, ry: 26, fill: ball('#6A5C86', DK), stroke: LT, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M6,-26 L10,-42 L18,-24 Z M20,-22 L28,-36 L30,-16 Z', fill: DK, stroke: LT, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 18, cy: -14, r: 14, fill: ball('#6A5C86', DK), stroke: LT, 'stroke-width': 2.5 }, g);
    E('circle', { cx: 24, cy: -17, r: 2.6, fill: C.energy }, g);
    g.flap = t => { const k = Math.sin(t * TAU * 3.2); [wL, wR].forEach(w => w.setAttribute('transform', `translate(0 -4) scale(1 ${(0.45 + 0.55 * k).toFixed(3)}) translate(0 4)`)); };
    g.flap(0);
    return g;
  }
  function moth(parent) {
    const g = G(parent);
    const w = [-1, 1].map(s => E('path', { d: `M0,0 C${s * 10},-30 ${s * 40},-34 ${s * 38},-8 C${s * 36},6 ${s * 14},4 0,0 Z M0,2 C${s * 14},10 ${s * 30},16 ${s * 22},28 C${s * 14},34 ${s * 4},16 0,2 Z`, fill: '#D9C79C', stroke: '#F4EBD2', 'stroke-width': 2 }, g));
    E('ellipse', { cx: 0, cy: 4, rx: 5, ry: 16, fill: '#8C7A55' }, g);
    E('path', { d: 'M-2,-12 Q-8,-26 -14,-28 M2,-12 Q8,-26 14,-28', fill: 'none', stroke: '#F4EBD2', 'stroke-width': 2 }, g);
    g.flap = t => w.forEach(p => p.setAttribute('transform', `scale(${(0.55 + 0.45 * Math.abs(Math.sin(t * TAU * 4))).toFixed(3)} 1)`));
    return g;
  }
  function dolphin(parent) {
    const g = G(parent);
    E('path', { d: 'M10,-42 C0,-70 -30,-90 -62,-96 C-46,-80 -38,-62 -30,-42 Z', fill: '#6F93A9', stroke: '#C9DEEA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-128,6 C-146,-6 -166,-18 -186,-20 C-176,-4 -176,14 -184,30 C-164,26 -146,16 -128,6 Z', fill: '#6F93A9', stroke: '#C9DEEA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-130,6 C-100,-26 -30,-46 30,-44 C70,-42 100,-34 114,-20 C122,-12 126,-8 136,-6 L166,-3 C171,0 169,5 162,6 L134,9 C110,22 50,34 -20,30 C-70,26 -104,20 -130,6 Z', fill: ball('#9CC0D6', '#527A92'), stroke: '#D6E8F2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-110,16 C-50,28 40,30 130,9 C100,24 40,33 -20,30 C-60,27 -90,22 -110,16 Z', fill: '#D6E8F2', opacity: 0.85 }, g);
    E('path', { d: 'M20,18 C10,36 -4,48 -22,52 C-16,38 -12,30 -8,22 Z', fill: '#6F93A9', stroke: '#D6E8F2', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M134,5 Q120,8 104,2', fill: 'none', stroke: '#3E6378', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 98, cy: -17, r: 4.5, fill: '#14303D' }, g);
    return g;
  }
  function fish(parent) {
    const g = G(parent);
    E('path', { d: 'M-34,0 C-20,-20 18,-22 34,0 C18,22 -20,20 -34,0 Z M-30,0 L-52,-16 L-48,0 L-52,16 Z', fill: ball('#FFB347', '#C26A12'), stroke: '#FFE2B0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 20, cy: -4, r: 3.5, fill: '#2A1D14' }, g);
    return g;
  }

  /* ================= A. a shout, a cliff, an echo ================= */
  const A = G(root);
  E('rect', { x: -10, y: 560, width: 950, height: 200, fill: linGrad('#24493A', '#10261E', true) }, A);
  E('line', { x1: -10, x2: 934, y1: 560, y2: 560, stroke: '#4FAE6A', 'stroke-width': 5 }, A);
  const CLIFF = 930;
  E('path', { d: 'M930,566 L925,480 L933,400 L924,320 L934,240 L946,170 C1000,156 1100,150 1220,148 L1220,760 L930,760 Z', fill: linGrad('#7D6A59', '#45392F', true), stroke: '#A08B74', 'stroke-width': 3, 'stroke-linejoin': 'round' }, A);
  [226, 306, 386, 466, 546, 626].forEach((y, i) => E('path', { d: `M${934 + (i % 2) * 3},${y} C1010,${y - 10} 1110,${y + 8} 1220,${y - 4}`, fill: 'none', stroke: '#2E251F', 'stroke-width': 3, opacity: 0.45 }, A));
  E('path', { d: 'M944,168 C1000,156 1100,150 1220,148', fill: 'none', stroke: '#4FAE6A', 'stroke-width': 7, 'stroke-linecap': 'round' }, A);
  const hardChip = chip(A, 'hard and flat', { size: 28, fill: 'rgba(10,27,39,0.72)', stroke: '#C9B79C', color: C.ink });
  const tileChip = G(A);
  { const tw = textWidth('a tiled wall', 26, FD, 700), w = Math.ceil(tw + 92), ix = -w / 2 + 34;
    E('rect', { x: -w / 2, y: -23, width: w, height: 46, rx: 23, fill: 'rgba(10,27,39,0.72)', stroke: '#C9B79C', 'stroke-width': 3 }, tileChip);
    E('rect', { x: ix - 14, y: -14, width: 28, height: 28, rx: 4, fill: '#DDE7EE' }, tileChip);
    for (let k = 1; k < 3; k++) { E('line', { x1: ix - 14 + k * 9.3, x2: ix - 14 + k * 9.3, y1: -14, y2: 14, stroke: '#8FA4B3', 'stroke-width': 2 }, tileChip); E('line', { x1: ix - 14, x2: ix + 14, y1: -14 + k * 9.3, y2: -14 + k * 9.3, stroke: '#8FA4B3', 'stroke-width': 2 }, tileChip); }
    T(tileChip, ix + 26, 9, 'a tiled wall', { size: 26, weight: 700 }); }
  const MOUTH = [197, 352], IMG = [2 * CLIFF - MOUTH[0], MOUTH[1]];
  const earGlow = E('circle', { cx: 168, cy: 342, r: 54, fill: glow(C.energy) }, A);
  const shG = G(A); tr(shG, 170, 560, 1.25);
  const shouter = person(shG, { shirt: '#5B8DEF', shorts: '#3E4F66' });
  const mouth = E('ellipse', { cx: 14, cy: -166, rx: 4, ry: 5.5, fill: '#5A2A22' }, shouter);
  const clipA = clipRect(-20, 100, CLIFF + 20, 460);
  const arcsA = G(A, { 'clip-path': clipA.url });
  const OUT = arcSet(arcsA, 5, C.air, 5), BACK = arcSet(arcsA, 5, C.air, 5);
  const headA = T(A, 560, 158, 'sound can **reflect**: it bounces back', { size: 32, weight: 600, anchor: 'middle', boldFill: C.air });
  const echoChip = chip(A, 'echo!', { size: 32, fill: C.energy, color: C.bg0 });
  // timeline: the shout, then its echo a moment later
  const TLg = G(A);
  card(TLg, 230, 594, 740, 122, { fill: 'rgba(10,27,39,0.82)', stroke: C.line });
  arrow(TLg, 270, 676, 936, 676, { color: C.muted, width: 4 });
  T(TLg, 936, 706, 'time', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  const burst = (x, a, w) => { let d = ''; for (let k = 0; k <= 30; k++) { const u = k / 30, xx = x - w / 2 + u * w, e = Math.sin(u * Math.PI); d += (k ? 'L' : 'M') + xx.toFixed(1) + ',' + (676 - a * e * Math.sin(u * TAU * 5)).toFixed(1); } return d; };
  const blipS = G(TLg); E('path', { d: burst(360, 26, 70), fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linejoin': 'round' }, blipS); T(blipS, 360, 630, 'shout', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const blipE = G(TLg); E('path', { d: burst(730, 15, 70), fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linejoin': 'round' }, blipE); T(blipE, 730, 630, 'echo', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const gapG = G(TLg);
  E('path', { d: 'M408,648 L682,648', stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, gapG);
  E('path', { d: 'M408,640 L408,656 M682,640 L682,656', stroke: C.muted, 'stroke-width': 3 }, gapG);
  T(gapG, 545, 632, 'a moment later', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const T_SHOUT = mid('reflect', 0.07), V_A = 207, R_FACE = CLIFF - MOUTH[0], T_ECHO = T_SHOUT + 2 * R_FACE / V_A;

  /* ================= B. an empty room and a furnished room ================= */
  const B = G(root);
  const ROOMS = [{ x0: 80, soft: false }, { x0: 650, soft: true }].map(o => {
    const x0 = o.x0, g = G(B), W_ = 470, y0 = 180, y1 = 520;
    E('rect', { x: x0 - 12, y: y0 - 12, width: W_ + 24, height: y1 - y0 + 24, rx: 6, fill: '#8FA4B3' }, g);
    E('rect', { x: x0, y: y0, width: W_, height: y1 - y0, fill: '#15313E' }, g);
    let L = x0, R = x0 + W_, Tp = y0, Bt = y1 - 20;
    if (!o.soft) {
      E('rect', { x: x0, y: y1 - 20, width: W_, height: 20, fill: '#B98B5A' }, g);
      for (let k = 1; k < 8; k++) E('line', { x1: x0 + k * W_ / 8, x2: x0 + k * W_ / 8, y1: y1 - 20, y2: y1, stroke: '#8A6440', 'stroke-width': 2 }, g);
      E('rect', { x: x0 + 300, y: y0 + 40, width: 110, height: 90, rx: 4, fill: '#1E4457', stroke: '#8FA4B3', 'stroke-width': 4 }, g);
      E('line', { x1: x0 + 355, x2: x0 + 355, y1: y0 + 40, y2: y0 + 130, stroke: '#8FA4B3', 'stroke-width': 3 }, g);
    } else {
      Bt = y1 - 30; L = x0 + 44; R = x0 + W_ - 44;
      E('rect', { x: x0 + 190, y: y0 + 40, width: 110, height: 90, rx: 4, fill: '#1E4457', stroke: '#8FA4B3', 'stroke-width': 4 }, g);
    }
    const sx = x0 + 120, sy = 350;
    const ringsG = G(g, { 'clip-path': clipRect(L, Tp, R - L, Bt - Tp).url });
    const k = o.soft ? { L: 0.07, R: 0.07, T: 0.45, B: 0.07 } : { L: 0.85, R: 0.85, T: 0.85, B: 0.85 };
    const src = [[sx, sy, 1],
      [2 * L - sx, sy, k.L], [2 * R - sx, sy, k.R], [sx, 2 * Tp - sy, k.T], [sx, 2 * Bt - sy, k.B],
      [2 * L - sx, 2 * Tp - sy, k.L * k.T], [2 * R - sx, 2 * Tp - sy, k.R * k.T], [2 * L - sx, 2 * Bt - sy, k.L * k.B], [2 * R - sx, 2 * Bt - sy, k.R * k.B],
      [sx + 2 * (R - L), sy, k.L * k.R], [sx - 2 * (R - L), sy, k.L * k.R], [sx, sy + 2 * (Bt - Tp), k.T * k.B], [sx, sy - 2 * (Bt - Tp), k.T * k.B]];
    // four time slots: a ring set is reused by every fourth clap (each lives about 4 s, claps are 1.3 s apart)
    const rings = [];
    for (let slot = 0; slot < 4; slot++) src.forEach(([cx, cy, a]) => { if (a >= 0.05) rings.push({ el: E('circle', { cx, cy, r: 1, fill: 'none', stroke: C.air, 'stroke-width': 4 }, ringsG), slot, a }); });
    const spk = speaker(g, 0.55); tr(spk, sx - 20, sy);
    if (o.soft) {
      // curtains, carpet, sofa: soft surfaces
      [[x0, 1], [x0 + W_ - 44, -1]].forEach(([cx]) => {
        E('rect', { x: cx, y: y0, width: 44, height: y1 - y0 - 30, fill: ball('#B0418A', '#6E1F55') }, g);
        for (let q = 1; q < 4; q++) E('line', { x1: cx + q * 11, x2: cx + q * 11, y1: y0 + 6, y2: y1 - 36, stroke: '#5A1846', 'stroke-width': 3, opacity: 0.6 }, g);
      });
      E('rect', { x: x0 - 4, y: y0 - 10, width: W_ + 8, height: 12, rx: 6, fill: '#C9D6DE' }, g);
      E('rect', { x: x0, y: y1 - 30, width: W_, height: 30, fill: '#B23A48' }, g);
      for (let q = 0; q < 12; q++) E('circle', { cx: x0 + 20 + q * 39, cy: y1 - 15, r: 5, fill: '#E8B33F', opacity: 0.75 }, g);
      const sofa = G(g); tr(sofa, x0 + 330, y1 - 30);
      E('rect', { x: -90, y: -88, width: 180, height: 54, rx: 18, fill: ball('#4E7FD8', '#2B4FA8'), stroke: '#9DB9F0', 'stroke-width': 2.5 }, sofa);
      E('rect', { x: -96, y: -44, width: 192, height: 40, rx: 14, fill: ball('#5B8DEF', '#2B4FA8'), stroke: '#9DB9F0', 'stroke-width': 2.5 }, sofa);
      E('rect', { x: -108, y: -66, width: 26, height: 62, rx: 12, fill: '#3E68C4', stroke: '#9DB9F0', 'stroke-width': 2.5 }, sofa);
      E('rect', { x: 82, y: -66, width: 26, height: 62, rx: 12, fill: '#3E68C4', stroke: '#9DB9F0', 'stroke-width': 2.5 }, sofa);
    }
    const title = T(B, x0 + W_ / 2, 148, o.soft ? 'furnished room' : 'empty room', { size: 32, weight: 700, anchor: 'middle' });
    return { g, x0, rings, spk, title, soft: o.soft };
  });
  const labCurt = G(B);
  T(labCurt, 690, 584, 'curtains', { size: 26, weight: 700, fill: '#E58AC6' }); leader(labCurt, 700, 560, 672, 470, '#E58AC6');
  T(labCurt, 905, 584, 'carpet', { size: 26, weight: 700, fill: '#F08A96', anchor: 'middle' }); leader(labCurt, 905, 560, 905, 512, '#F08A96');
  const labSoft = T(B, 885, 640, '**soft** materials **absorb** the sound', { size: 30, weight: 600, anchor: 'middle', boldFill: C.good });
  const labHard = T(B, 315, 584, 'hard walls: the sound bounces around', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const labEchoey = T(B, 315, 640, 'so it sounds **echoey**', { size: 30, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ================= C. ultrasound on the frequency line ================= */
  const Cg = G(root);
  const fl = freqLine(Cg);
  op(fl.inf, 0); op(fl.lInf, 0);
  const uCard = G(Cg);
  card(uCard, 520, 150, 630, 320, { fill: C.card, stroke: VIO, sw: 3 });
  E('path', { d: `M${fx(60000) - 22},470 L${fx(60000)},516 L${fx(60000) + 22},470 Z`, fill: C.card, stroke: VIO, 'stroke-width': 3, 'stroke-linejoin': 'round' }, uCard);
  E('rect', { x: fx(60000) - 21, y: 464, width: 42, height: 8, fill: C.card }, uCard);
  T(uCard, 835, 236, 'ultrasound', { size: 58, weight: 700, anchor: 'middle', fill: VIO });
  const uAbove = T(uCard, 835, 294, 'sound **above 20,000 Hz**', { size: 34, weight: 600, anchor: 'middle', boldFill: VIOLT });
  const uRow = G(uCard);
  const uEar = earIcon(uRow); tr(uEar, 640, 392, 0.85);
  const uX = cross(uRow, 22); tr(uX, 662, 370);
  T(uRow, 712, 403, 'too high for humans to hear', { size: 30, weight: 600 });
  const uPk = G(uCard), UPK = arcSet(uPk, 5, VIO, 4);

  /* ================= D. a medical scan ================= */
  const Dg = G(root);
  const belly = 'M70,690 C70,440 180,300 330,300 C480,300 590,440 590,690 Z';
  E('path', { d: belly, fill: 'rgba(232,180,142,0.22)', stroke: SKIN, 'stroke-width': 14 }, Dg);
  E('ellipse', { cx: 330, cy: 530, rx: 196, ry: 146, fill: 'rgba(247,168,200,0.16)', stroke: '#F29BBF', 'stroke-width': 5 }, Dg);
  E('ellipse', { cx: 330, cy: 530, rx: 180, ry: 130, fill: '#173847' }, Dg);
  const babyB = G(Dg);
  const babyArt = (g, s, fill, stroke) => {
    E('path', { d: 'M-40,30 C-60,70 -20,110 40,104 C100,98 130,60 120,20 C110,-20 60,-40 20,-30 C-10,-24 -30,0 -40,30 Z', fill, stroke, 'stroke-width': 3 * s }, g);
    E('circle', { cx: -66, cy: -36, r: 54, fill, stroke, 'stroke-width': 3 * s }, g);
    E('path', { d: 'M-30,40 C-6,30 20,40 30,60', fill: 'none', stroke, 'stroke-width': 8 * s, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M70,96 C90,120 60,136 30,128', fill: 'none', stroke, 'stroke-width': 12 * s, 'stroke-linecap': 'round' }, g);
  };
  babyArt(babyB, 1, '#F2B6A0', '#C98E78'); tr(babyB, 345, 516);
  const boundary = E('circle', { cx: 345 - 66, cy: 516 - 36, r: 58, fill: 'none', stroke: VIO, 'stroke-width': 5, opacity: 0 }, Dg);
  const probe = G(Dg); tr(probe, 330, 292);
  E('path', { d: 'M40,-70 C90,-110 150,-90 200,-140', fill: 'none', stroke: '#5E6A76', 'stroke-width': 7, 'stroke-linecap': 'round' }, probe);
  E('path', { d: 'M-14,-24 L4,-92 L46,-82 L20,-18 Z', fill: ball('#EEF3F6', '#9DB0BF'), stroke: '#8FA4B3', 'stroke-width': 3, 'stroke-linejoin': 'round' }, probe);
  E('rect', { x: -36, y: -26, width: 72, height: 30, rx: 12, fill: ball('#EEF3F6', '#9DB0BF'), stroke: '#8FA4B3', 'stroke-width': 3 }, probe);
  E('rect', { x: -30, y: 0, width: 60, height: 6, rx: 3, fill: VIO }, probe);
  const lProbe = labelLine(Dg, 412, 264, 368, 276, 'probe', { size: 28, weight: 700 });
  const lBound = G(Dg); T(lBound, 40, 184, 'echoes from', { size: 28, weight: 700, fill: VIOLT }); T(lBound, 40, 218, 'boundaries', { size: 28, weight: 700, fill: VIOLT }); leader(lBound, 120, 232, 250, 430, VIOLT);
  T(Dg, 890, 124, 'an ultrasound scan', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const scanG = G(Dg), DOWN = arcSet(scanG, 4, VIO, 4.5), UP = arcSet(scanG, 4, VIOLT, 3.5);
  // monitor with the scan picture
  E('rect', { x: 640, y: 140, width: 500, height: 410, rx: 22, fill: '#22313D', stroke: '#5E7A8C', 'stroke-width': 3 }, Dg);
  E('rect', { x: 660, y: 160, width: 460, height: 370, rx: 12, fill: '#05090C' }, Dg);
  E('path', { d: 'M860,550 L920,550 L940,598 L840,598 Z', fill: '#22313D', stroke: '#5E7A8C', 'stroke-width': 3 }, Dg);
  const APX = [890, 174], FR = 348, FH = 36 * Math.PI / 180;
  const fanPt = (a, r) => [APX[0] + r * Math.cos(a), APX[1] + r * Math.sin(a)];
  const aL = Math.PI / 2 + FH, aR = Math.PI / 2 - FH;
  const fanD = a => { const p0 = fanPt(aL, FR), p1 = fanPt(a, FR); return `M${APX[0]},${APX[1]} L${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${FR},${FR} 0 0 0 ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`; };
  E('path', { d: fanD(aR), fill: '#111619', stroke: '#2A3A46', 'stroke-width': 2 }, Dg);
  const sweep = clipPathD(fanD(aL + 0.001));
  const img = G(Dg, { 'clip-path': sweep.url });
  E('path', { d: fanD(aR), fill: '#2A2F33' }, img);
  const sr = rng(77);
  for (let k = 0; k < 60; k++) { const a = aR + sr() * (aL - aR), r = 30 + sr() * (FR - 34), p = fanPt(a, r); E('circle', { cx: p[0].toFixed(1), cy: p[1].toFixed(1), r: (1.5 + sr() * 3).toFixed(1), fill: '#8C9296', opacity: (0.25 + sr() * 0.45).toFixed(2) }, img); }
  E('ellipse', { cx: 890, cy: 400, rx: 190, ry: 128, fill: '#060708' }, img);
  E('path', { d: 'M700,400 C720,300 800,262 890,262 C980,262 1060,300 1080,400', fill: 'none', stroke: '#D9D9D9', 'stroke-width': 8, opacity: 0.75 }, img);
  const babyS = G(img); babyArt(babyS, 1, 'rgba(205,205,205,0.75)', '#F2F2F2'); tr(babyS, 905, 400, 0.92);
  const beam = E('line', { x1: APX[0], y1: APX[1], stroke: VIOLT, 'stroke-width': 3, opacity: 0.8 }, Dg);
  const lPic = T(Dg, 890, 642, 'the echoes build a **picture**', { size: 30, weight: 600, anchor: 'middle', boldFill: VIOLT });
  const safe = G(Dg);
  { const c = chip(safe, 'no harmful radiation', { size: 28, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good }); const tk = tick(safe, 13); tr(tk, -c.w / 2 - 26, 0); }

  /* ================= E. an ultrasonic cleaning bath ================= */
  const Eg = G(root);
  E('rect', { x: 330, y: 290, width: 540, height: 316, rx: 18, fill: linGrad('#C9D6DE', '#7D8C99', true), stroke: '#EEF3F6', 'stroke-width': 3 }, Eg);
  E('rect', { x: 346, y: 306, width: 508, height: 284, rx: 10, fill: '#0F2C3A' }, Eg);
  E('rect', { x: 346, y: 332, width: 508, height: 258, fill: 'rgba(76,201,240,0.32)' }, Eg);
  E('line', { x1: 346, x2: 854, y1: 332, y2: 332, stroke: '#BFEFFF', 'stroke-width': 3, opacity: 0.8 }, Eg);
  const trans = E('rect', { x: 380, y: 580, width: 440, height: 10, rx: 5, fill: VIO }, Eg);
  const wavesE = []; for (let i = 0; i < 6; i++) wavesE.push(E('path', { fill: 'none', stroke: VIO, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, Eg));
  const ring = G(Eg); tr(ring, 480, 548);
  E('ellipse', { rx: 48, ry: 19, fill: 'none', stroke: '#B57B12', 'stroke-width': 13 }, ring);
  const ringShine = E('ellipse', { rx: 48, ry: 19, fill: 'none', stroke: C.glucose, 'stroke-width': 8 }, ring);
  E('path', { d: 'M0,-38 L12,-24 L0,-12 L-12,-24 Z', fill: '#BFEFFF', stroke: '#FFFFFF', 'stroke-width': 2 }, ring);
  const specs = G(Eg); tr(specs, 690, 520);
  E('path', { d: 'M46,-6 L120,-26', stroke: '#2B2B2B', 'stroke-width': 6, 'stroke-linecap': 'round' }, specs);
  [-50, 50].forEach(x => E('ellipse', { cx: x, cy: 0, rx: 42, ry: 30, fill: 'rgba(200,230,250,0.28)', stroke: '#2B2B2B', 'stroke-width': 6 }, specs));
  E('path', { d: 'M-10,-6 Q0,-16 10,-6', fill: 'none', stroke: '#2B2B2B', 'stroke-width': 6, 'stroke-linecap': 'round' }, specs);
  const dr = rng(19), DIRT = [];
  const spots = [[440, 552], [462, 532], [500, 534], [522, 552], [470, 566], [508, 564], [630, 508], [652, 528], [668, 496], [618, 528], [726, 506], [748, 530], [760, 498], [712, 528], [690, 508], [580, 590], [800, 590]];
  spots.forEach(([x, y], i) => DIRT.push({ el: E('circle', { r: 4 + dr() * 3, fill: '#8B6B47', stroke: '#5E4428', 'stroke-width': 1.5 }, Eg), x, y, t0: dr(), dx: (dr() - 0.5) * 60, ph: dr() * TAU }));
  const eTitle = chip(Eg, 'cleaning with ultrasound', { size: 30, fill: C.card2, stroke: VIO, color: VIOLT });
  const lJew = T(Eg, 480, 652, 'jewellery', { size: 28, weight: 700, anchor: 'middle', fill: C.glucoseLt });
  const lLens = T(Eg, 690, 652, 'lenses', { size: 28, weight: 700, anchor: 'middle', fill: '#BFEFFF' });
  const lDirt = G(Eg);
  T(lDirt, 900, 420, 'dirt is shaken', { size: 28, weight: 700, fill: '#D9B98C' });
  T(lDirt, 900, 456, 'off and lifts away', { size: 28, weight: 700, fill: '#D9B98C' });
  arrow(lDirt, 884, 470, 884, 380, { color: '#D9B98C', width: 4 });

  /* ================= F. sonar at sea ================= */
  const Fg = G(root);
  const SEA = 210, FLOOR = 650;
  E('rect', { x: -10, y: SEA, width: 1220, height: 560, fill: linGrad('#0F4C6B', '#061C2B', true) }, Fg);
  const surf = E('path', { fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.7 }, Fg);
  E('path', { d: 'M-10,650 C150,644 300,655 450,648 C600,642 700,655 850,649 C1000,643 1100,653 1210,647 L1210,760 L-10,760 Z', fill: linGrad('#6B5A3F', '#2E2619', true), stroke: '#A08B64', 'stroke-width': 3 }, Fg);
  const lFloor = T(Fg, 1150, 700, 'sea floor', { size: 26, weight: 600, anchor: 'end', fill: '#D9C79C' });
  const ship = G(Fg); tr(ship, 230, SEA);
  E('path', { d: 'M-122,-14 L124,-14 L102,30 L-100,30 Z', fill: ball('#D0533E', '#8E2A1E'), stroke: '#F3A08F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, ship);
  E('rect', { x: -122, y: -18, width: 246, height: 8, fill: '#F2F7FA' }, ship);
  E('rect', { x: -70, y: -56, width: 96, height: 40, rx: 5, fill: '#EEF3F6', stroke: '#9DB0BF', 'stroke-width': 2 }, ship);
  for (let k = 0; k < 4; k++) E('rect', { x: -60 + k * 22, y: -48, width: 14, height: 12, rx: 2, fill: '#4CC9F0' }, ship);
  E('rect', { x: 44, y: -78, width: 24, height: 62, rx: 4, fill: '#F2C14E', stroke: '#B57B12', 'stroke-width': 2 }, ship);
  E('rect', { x: 44, y: -78, width: 24, height: 12, fill: '#2B2B2B' }, ship);
  E('rect', { x: -10, y: 30, width: 20, height: 7, rx: 3, fill: VIO }, ship);
  const sub = G(Fg); tr(sub, 800, 430);
  E('path', { d: 'M-150,0 L-172,-22 L-172,22 Z', fill: '#4E5A66', stroke: '#8FA4B3', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, sub);
  E('ellipse', { rx: 140, ry: 32, fill: ball('#7D8C99', '#3E4A56'), stroke: '#AFC0CC', 'stroke-width': 2.5 }, sub);
  E('path', { d: 'M-30,-28 L-22,-66 L28,-66 L36,-28 Z', fill: ball('#7D8C99', '#3E4A56'), stroke: '#AFC0CC', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, sub);
  E('path', { d: 'M8,-66 L8,-92 L22,-92', fill: 'none', stroke: '#AFC0CC', 'stroke-width': 4, 'stroke-linecap': 'round' }, sub);
  [-60, 0, 60].forEach(x => E('circle', { cx: x, cy: -4, r: 7, fill: '#9FD8FF', stroke: '#3E4A56', 'stroke-width': 2 }, sub));
  E('rect', { x: -10, y: 30, width: 20, height: 7, rx: 3, fill: VIO }, sub);
  const sonG = G(Fg), SH_D = arcSet(sonG, 4, VIO, 4.5), SH_U = arcSet(sonG, 4, VIOLT, 3.5), SB_D = arcSet(sonG, 4, VIO, 4.5), SB_U = arcSet(sonG, 4, VIOLT, 3.5);
  const knowChip = chip(Fg, 'speed known → time gives distance', { size: 28, fill: C.card2, stroke: VIO });
  const SHIP_TX = [230, SEA + 37], SUB_TX = [800, 467];
  // one pulse, a stopwatch, and the sum
  const watch = G(Fg); tr(watch, 690, 300);
  E('rect', { x: -12, y: -88, width: 24, height: 16, rx: 4, fill: '#9DB0BF' }, watch);
  E('circle', { r: 68, fill: C.card, stroke: '#C9D6DE', 'stroke-width': 6 }, watch);
  const pie = E('path', { fill: VIO, opacity: 0.45 }, watch);
  [0, 1, 2, 3].forEach(k => { const a = -Math.PI / 2 + k * Math.PI / 2; E('line', { x1: Math.cos(a) * 54, y1: Math.sin(a) * 54, x2: Math.cos(a) * 64, y2: Math.sin(a) * 64, stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, watch); });
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -56, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, watch);
  E('circle', { r: 7, fill: C.energy }, watch);
  const readout = T(Fg, 690, 422, '0.0 s', { size: 40, weight: 700, anchor: 'middle' });
  const lBack = T(Fg, 690, 462, 'echo back after 4 s', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const speedChip = chip(Fg, 'in water: about 1,500 m/s', { size: 30, fill: 'rgba(76,201,240,0.16)', stroke: C.water, color: '#BFEFFF' });
  const askG = G(Fg);
  E('line', { x1: 312, x2: 312, y1: SEA + 8, y2: FLOOR - 8, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '8 7' }, askG);
  E('path', { d: `M302,${SEA + 22} L312,${SEA + 6} L322,${SEA + 22} M302,${FLOOR - 22} L312,${FLOOR - 6} L322,${FLOOR - 22}`, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, askG);
  const askChip = chip(Fg, 'depth = ?', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(askChip, 446, 430);
  // there and back: a down arrow and an up arrow, then cut in half
  const XD = 212, XU = 248, PY0 = SEA + 44, PY1 = FLOOR - 10;
  const downP = E('path', { d: `M${XD},${PY0} L${XD},${PY1}`, fill: 'none', stroke: VIO, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Fg);
  const downH = E('path', { d: `M${XD - 12},${PY1 - 18} L${XD},${PY1} L${XD + 12},${PY1 - 18}`, fill: 'none', stroke: VIO, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Fg);
  const upP = E('path', { d: `M${XD},${PY1} Q${XD},${PY1 + 8} ${(XD + XU) / 2},${PY1 + 8} Q${XU},${PY1 + 8} ${XU},${PY1 - 8} L${XU},${PY0}`, fill: 'none', stroke: VIOLT, 'stroke-width': 7, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, Fg);
  const upH = E('path', { d: `M${XU - 12},${PY0 + 18} L${XU},${PY0} L${XU + 12},${PY0 + 18}`, fill: 'none', stroke: VIOLT, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, Fg);
  const lThere = T(Fg, XD - 16, 430, 'there', { size: 28, weight: 700, anchor: 'end', fill: VIO });
  const lBackW = T(Fg, XU + 16, 470, 'back', { size: 28, weight: 700, fill: VIOLT });
  const l6000 = T(Fg, 230, FLOOR + 50, '6,000 m in all', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });
  const lDepth = T(Fg, XD + 18, 470, '3,000 m', { size: 34, weight: 700, fill: C.energy });
  const scale = G(Fg);
  E('line', { x1: 380, x2: 380, y1: SEA, y2: FLOOR, stroke: C.muted, 'stroke-width': 4 }, scale);
  ['0 m', '1,000 m', '2,000 m', '3,000 m'].forEach((s, k) => { const y = SEA + k * (FLOOR - SEA) / 3; E('line', { x1: 368, x2: 392, y1: y, y2: y, stroke: C.muted, 'stroke-width': 4 }, scale); T(scale, 404, y + 9, s, { size: 26, weight: 700, fill: k === 3 ? C.energy : C.muted }); });
  const sumG = G(Fg);
  card(sumG, 600, 498, 560, 222, { fill: C.card, stroke: C.line });
  const row1 = T(sumG, 880, 548, '1,500 m/s × 4 s = **6,000 m**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const row2 = T(sumG, 880, 600, 'that’s **there and back**: cut it in half', { size: 30, weight: 600, anchor: 'middle', boldFill: VIOLT });
  const row3 = T(sumG, 880, 652, '6,000 m ÷ 2 = **3,000 m**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const deep = G(sumG);
  { const c = chip(deep, 'the sea is 3,000 m deep', { size: 28, fill: C.good, color: C.bg0 }); const tk = tick(deep, 14); tr(tk, c.w / 2 + 28, 0); }
  const T_PING = mid('ship', 0.08), V_P = (PY1 - SHIP_TX[1]) / 2;

  /* ================= G. echolocation ================= */
  const Gg = G(root);
  E('rect', { x: -10, y: 410, width: 1220, height: 360, fill: linGrad('#165061', '#071B24', true) }, Gg);
  E('line', { x1: -10, x2: 1210, y1: 410, y2: 410, stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.6 }, Gg);
  const murk = rng(5); for (let k = 0; k < 18; k++) E('circle', { cx: murk() * 1200, cy: 430 + murk() * 300, r: 2 + murk() * 4, fill: '#7FB7A8', opacity: (0.1 + murk() * 0.2).toFixed(2) }, Gg);
  const stars = rng(9); for (let k = 0; k < 14; k++) E('circle', { cx: 600 + stars() * 560, cy: 120 + stars() * 250, r: 1.5 + stars() * 2, fill: '#F2F7FA', opacity: (0.4 + stars() * 0.5).toFixed(2) }, Gg);
  E('circle', { cx: 1060, cy: 190, r: 90, fill: glow('#FFF3C4') }, Gg);
  E('circle', { cx: 1060, cy: 190, r: 40, fill: ball('#FFF7D6', '#E3CF8E') }, Gg);
  const batG = G(Gg); const theBat = bat(batG);
  const mothG = G(Gg); const theMoth = moth(mothG);
  const dolG = G(Gg); dolphin(dolG); tr(dolG, 290, 575, 0.9);
  const fishG = G(Gg); fish(fishG);
  const bwG = G(Gg), BAT_O = arcSet(bwG, 5, VIO, 4), BAT_E = arcSet(bwG, 5, VIOLT, 3), DOL_O = arcSet(bwG, 5, VIO, 4), DOL_E = arcSet(bwG, 5, VIOLT, 3);
  const lBat = T(Gg, 300, 340, 'bat', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const lDol = T(Gg, 280, 690, 'dolphin', { size: 28, weight: 700, anchor: 'middle', fill: '#C9DEEA' });
  const ecl = chip(Gg, 'echolocation', { size: 40, fill: C.card, stroke: VIO, color: VIOLT });
  const eclSub = T(Gg, 990, 536, 'finding the way by echoes', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  return t => {
    const tB = at('absorb'), tC = at('ultra'), tD = at('scan'), tE = at('clean'), tF = at('sonar'), tG = at('bats');
    const aA = beat(t, S.first - 0.15, tB), aB = beat(t, tB - 0.1, tC), aC = beat(t, tC - 0.1, tD), aD = beat(t, tD - 0.1, tE), aE = beat(t, tE - 0.1, tF), aF = beat(t, tF - 0.1, tG), aG = P(t, tG - 0.1, 0.45, linear);
    op(A, aA); op(B, aB); op(Cg, aC); op(Dg, aD); op(Eg, aE); op(Fg, aF); op(Gg, aG);

    /* ---- A: reflect, echo ---- */
    if (aA > 0) {
      const shout = win(t, T_SHOUT - 0.1, T_SHOUT + 0.9, 0.2);
      shouter.pose({ armL: [lerp(8, 52, shout), lerp(10, 128, shout)], armR: [lerp(-8, 58, shout), lerp(10, 122, shout)], lean: 4 * shout });
      op(mouth, shout);
      OUT.forEach((el, i) => {
        const r = V_A * (t - T_SHOUT - i * 0.15);
        if (r < 8 || r > R_FACE + 4) { op(el, 0); return; }
        const al = Math.min(0.26, Math.asin(Math.min(1, 118 / r)));
        el.setAttribute('d', arcD(MOUTH[0], MOUTH[1], r, -al, al));
        op(el, 0.95 * (1 - 0.3 * r / R_FACE) * Math.min(1, r / 30));
      });
      BACK.forEach((el, i) => {
        const r = V_A * (t - T_SHOUT - i * 0.15), xl = IMG[0] - r;
        if (r < R_FACE - 4 || xl < 40) { op(el, 0); return; }
        const al = Math.min(0.26, Math.asin(Math.min(1, 118 / r)));
        el.setAttribute('d', arcD(IMG[0], IMG[1], r, Math.PI - al, Math.PI + al));
        op(el, 0.72 * (1 - 0.3 * (r - R_FACE) / R_FACE) * clamp((xl - 40) / 120));
      });
      op(headA, P(t, mid('reflect', 0.1), 0.5, linear) * (1 - P(t, at('echo') + 0.3, 0.5, linear)));
      popIn(hardChip, t, mid('reflect', 0.62), 1062, 250);
      popIn(tileChip, t, mid('reflect', 0.84), 1062, 318);
      const heard = P(t, T_ECHO - 0.05, 0.4, linear);
      op(earGlow, heard * (0.6 + 0.4 * wave(t, 0.7)) * (1 - P(t, end('echo') - 0.3, 0.5, linear) * 0.5));
      popIn(echoChip, t, T_ECHO, 232, 200);
      op(TLg, P(t, at('echo') + 0.05, 0.4, linear));
      op(blipS, P(t, at('echo') + 0.15, 0.3, linear));
      const be = P(t, T_ECHO + 0.1, 0.5, pop); op(blipE, clamp(be * 2));
      op(gapG, P(t, mid('echo', 0.45), 0.4, linear));
    }

    /* ---- B: absorb ---- */
    if (aB > 0) {
      const t0 = tB + 0.2;
      ROOMS.forEach(rm => {
        rm.spk.set(Math.sin(t * TAU * 6) * 0.6 * calm * P(t, t0, 0.3, linear));
        rm.rings.forEach(rg => {
          const k = rg.slot + 4 * Math.floor((t - t0 - rg.slot * 1.3) / 5.2), r = 240 * (t - t0 - k * 1.3);
          if (r < 6 || r > 980) { op(rg.el, 0); return; }
          attr(rg.el, 'r', r);
          op(rg.el, rg.a * 0.9 * clamp(1 - r / 980) * clamp(r / 30));
        });
      });
      op(labCurt, P(t, mid('absorb', 0.12), 0.4, linear));
      op(labSoft, P(t, mid('absorb', 0.3), 0.4, linear));
      op(labHard, P(t, mid('absorb', 0.55), 0.4, linear));
      op(labEchoey, P(t, mid('absorb', 0.62), 0.4, linear));
    }

    /* ---- C: ultrasound ---- */
    if (aC > 0) {
      tr(fl, 0, (1 - P(t, tC - 0.1, 0.7, easeOut)) * 36);
      const gu = P(t, mid('ultra', 0.1), 1.0, ease);
      attr(fl.ult, 'width', (fx(200000) + 60 - fx(20000)) * gu);
      op(fl.lUlt, P(t, mid('ultra', 0.18), 0.4, linear));
      op(fl.hear, 0.75); op(fl.lHear, 0.75);
      const hl = P(t, mid('ultra', 0.42), 0.4, linear);
      fl.tl[20000].setAttribute('fill', hl > 0.5 ? VIOLT : C.ink);
      const cp = P(t, mid('ultra', 0.06), 0.6, easeOut);
      op(uCard, cp); tr(uCard, 0, (1 - cp) * 20);
      op(uAbove, P(t, mid('ultra', 0.38), 0.4, linear));
      op(uRow, P(t, mid('ultra', 0.55), 0.4, linear));
      const xp = P(t, mid('ultra', 0.6), 0.4, pop); op(uX, clamp(xp * 2)); tr(uX, 662, 370, Math.max(0.01, xp));
      const u = ((t - tC) * 1.1) % 1;
      packet(UPK, 560, 236, 0, 20 + u * 70, 10, 0.5, 0.9 * Math.sin(u * Math.PI));
    }

    /* ---- D: a medical scan ---- */
    if (aD > 0) {
      const P0 = [330, 300], YB = 432, V = 300, period = 1.0;
      const live = P(t, mid('scan', 0.02), 0.3, linear) * (1 - P(t, mid('scan', 0.86), 0.4, linear));
      const tt = t - mid('scan', 0.02), k = Math.floor(tt / period), te = mid('scan', 0.02) + k * period;
      const r = V * (t - te), dB = YB - P0[1];
      packet(DOWN, P0[0], P0[1], Math.PI / 2, r, 11, 0.42, tt > 0 ? live : 0, dB);
      packet(UP, P0[0], 2 * YB - P0[1], -Math.PI / 2, r, 11, 0.36, tt > 0 ? live * 0.9 : 0, 2 * dB);
      UP.forEach((el, i) => { if (V * (t - te) - i * 11 < dB) op(el, 0); });
      const hit = tt > 0 ? Math.max(0, 1 - Math.abs(r - dB) / 40) : 0;
      op(boundary, 0.9 * hit * live);
      op(lProbe, P(t, mid('scan', 0.04), 0.4, linear));
      op(lBound, P(t, mid('scan', 0.14), 0.4, linear));
      const s0 = mid('scan', 0.3), s1 = mid('scan', 0.74), sw = P(t, s0, s1 - s0, linear);
      const a = lerp(aL, aR, sw);
      sweep.path.setAttribute('d', fanD(a + (sw <= 0 ? 0.0005 : 0)));
      const bp = fanPt(a, FR); attr(beam, 'x2', bp[0]); attr(beam, 'y2', bp[1]); op(beam, win(t, s0, s1 + 0.2, 0.2));
      op(lPic, P(t, mid('scan', 0.36), 0.4, linear));
      popIn(safe, t, mid('scan', 0.84), 890, 694);
    }

    /* ---- E: cleaning ---- */
    if (aE > 0) {
      const on = P(t, mid('clean', 0.12), 0.5, linear);
      op(trans, 0.4 + 0.6 * on * (0.7 + 0.3 * wave(t, 0.25)));
      wavesE.forEach((el, i) => {
        const u = ((t * 0.8) + i / wavesE.length) % 1, y = 576 - u * 236;
        let d = ''; for (let x = 352; x <= 848; x += 6) d += (x === 352 ? 'M' : 'L') + x + ',' + (y + 4 * Math.sin((x / 14) + t * 12 * calm)).toFixed(1);
        el.setAttribute('d', d); op(el, on * 0.75 * Math.sin(u * Math.PI));
      });
      const c0 = mid('clean', 0.25), c1 = mid('clean', 0.82);
      DIRT.forEach(dd => {
        const ts = lerp(c0, c1, dd.t0), u = clamp((t - ts) / 2.2);
        const jig = on * 2.2 * calm;
        const x = dd.x + (u > 0 ? dd.dx * easeOut(u) + Math.sin(u * 9 + dd.ph) * 6 : Math.sin(t * 40 + dd.ph) * jig);
        const y = dd.y - (u > 0 ? easeOut(u) * (dd.y - 350) : 0) + (u > 0 ? 0 : Math.cos(t * 37 + dd.ph) * jig);
        attr(dd.el, 'cx', x); attr(dd.el, 'cy', y);
        op(dd.el, u >= 1 ? 0 : 1 - P(u, 0.6, 0.4, linear));
      });
      op(ringShine, 0.35 + 0.65 * P(t, c0, c1 - c0, linear));
      tr(ring, 480 + Math.sin(t * 31) * 0.8 * on * calm, 548);
      tr(specs, 690 + Math.sin(t * 29) * 0.8 * on * calm, 520);
      popIn(eTitle, t, mid('clean', 0.02), 600, 214);
      op(lJew, P(t, mid('clean', 0.5), 0.4, linear)); op(lLens, P(t, mid('clean', 0.6), 0.4, linear));
      op(lDirt, P(t, mid('clean', 0.4), 0.4, linear));
    }

    /* ---- F: sonar, the ship, the sum ---- */
    if (aF > 0) {
      let sd = ''; for (let x = -10; x <= 1210; x += 10) sd += (x === -10 ? 'M' : 'L') + x + ',' + (SEA + 3 * Math.sin(x / 40 + t * 1.6 * calm)).toFixed(1);
      surf.setAttribute('d', sd);
      tr(ship, 230, SEA + 2 * Math.sin(t * 1.6 * calm), 1, 1.2 * Math.sin(t * 1.1 * calm));
      const tS = at('ship'), tH = at('halve');
      // sonar: repeated pings from both
      const sonOn = win(t, tF + 0.2, tS + 0.1, 0.3);
      const ping = (els, ups, src, per, off, alpha) => {
        const tt = t - tF - off, k = Math.floor(tt / per), te = tF + off + k * per, r = 300 * (t - te), dB = FLOOR - src[1];
        packet(els, src[0], src[1], Math.PI / 2, r, 10, 0.38, tt > 0 ? alpha : 0, dB);
        packet(ups, src[0], 2 * FLOOR - src[1], -Math.PI / 2, r, 10, 0.3, tt > 0 ? alpha * 0.9 : 0, 2 * dB);
        ups.forEach((el, i) => { if (r - i * 10 < dB) op(el, 0); });
      };
      if (sonOn > 0) { ping(SH_D, SH_U, SHIP_TX, 2.4, 0.3, sonOn); ping(SB_D, SB_U, SUB_TX, 1.7, 1.0, sonOn); }
      else {
        // the single pulse of the worked example
        const r = V_P * (t - T_PING), dB = PY1 - SHIP_TX[1];
        const pOn = (t > T_PING && t < T_PING + 4.3 ? 1 : 0) * (1 - P(t, tH - 0.3, 0.3, linear));
        packet(SH_D, SHIP_TX[0], SHIP_TX[1], Math.PI / 2, r, 10, 0.3, pOn, dB);
        packet(SH_U, SHIP_TX[0], 2 * PY1 - SHIP_TX[1], -Math.PI / 2, r, 10, 0.26, pOn, 2 * dB);
        SH_U.forEach((el, i) => { if (r - i * 10 < dB) op(el, 0); });
        [SB_D, SB_U].forEach(a => a.forEach(el => op(el, 0)));
      }
      op(sub, 1 - P(t, tS - 0.2, 0.5, linear));
      popIn(knowChip, t, mid('sonar', 0.68), 860, 140); op(knowChip, Math.min(clamp(P(t, mid('sonar', 0.68), 0.25, linear)), 1 - P(t, tS - 0.2, 0.4, linear)));
      // stopwatch and readout
      const wIn = P(t, tS - 0.1, 0.5, linear);
      op(watch, wIn); op(readout, wIn);
      const elapsed = clamp(t - T_PING, 0, 4), ang = elapsed / 4 * TAU;
      setText(readout, elapsed.toFixed(1) + ' s');
      hand.setAttribute('transform', `rotate(${(ang * 180 / Math.PI).toFixed(1)})`);
      if (elapsed > 0.01) { const e2 = -Math.PI / 2 + ang, large = ang > Math.PI ? 1 : 0; pie.setAttribute('d', elapsed >= 3.999 ? 'M0,-62 A62,62 0 1 1 -0.01,-62 Z' : `M0,0 L0,-62 A62,62 0 ${large} 1 ${(Math.cos(e2) * 62).toFixed(1)},${(Math.sin(e2) * 62).toFixed(1)} Z`); op(pie, 0.45); } else op(pie, 0);
      op(lBack, P(t, T_PING + 4.05, 0.4, linear));
      popIn(speedChip, t, mid('ship', 0.66), 950, 232);
      const ask = P(t, end('ship') - 0.25, 0.4, linear);
      op(askG, ask * (1 - P(t, mid('halve', 0.06), 0.4, linear)));
      op(askChip, ask * (1 - P(t, mid('halve', 0.66), 0.4, linear))); tr(askChip, 446, 430, 1 + 0.05 * Math.sin(t * 5) * calm);
      // the sum: there and back, cut in half
      op(sumG, P(t, tH - 0.1, 0.4, linear));
      const r1 = P(t, mid('halve', 0.06), 0.4, linear);
      op(row1, r1);
      const dn = P(t, mid('halve', 0.1), 1.3, linear), upn = P(t, mid('halve', 0.1) + 1.3, 1.3, linear);
      op(downP, dn > 0 ? 1 : 0); downP.setAttribute('stroke-dashoffset', (1 - dn).toFixed(4));
      const half = P(t, mid('halve', 0.62), 0.7, linear);
      op(upP, (upn > 0 ? 1 : 0) * (1 - half)); upP.setAttribute('stroke-dashoffset', (1 - upn).toFixed(4));
      op(upH, P(upn, 0.9, 0.1, linear) * (1 - half));
      op(downH, P(t, mid('halve', 0.66), 0.4, linear));
      op(l6000, P(t, mid('halve', 0.36), 0.4, linear) * (1 - half));
      op(lThere, P(t, mid('halve', 0.44), 0.4, linear) * (1 - P(t, mid('halve', 0.7), 0.3, linear)));
      op(lBackW, P(t, mid('halve', 0.5), 0.4, linear) * (1 - half));
      op(row2, P(t, mid('halve', 0.44), 0.4, linear));
      op(row3, P(t, mid('halve', 0.6), 0.4, linear));
      op(lDepth, P(t, mid('halve', 0.76), 0.4, linear));
      op(scale, P(t, mid('halve', 0.76), 0.5, linear));
      popIn(deep, t, mid('halve', 0.84), 860, 694); op(deep, P(t, mid('halve', 0.84), 0.3, linear));
      op(lFloor, 1 - P(t, mid('halve', 0.7), 0.4, linear));
    }

    /* ---- G: echolocation ---- */
    if (aG > 0) {
      const BAT = [300, 250 + 8 * Math.sin(t * 1.7 * calm)], MOTH = [760 + 10 * Math.sin(t * 1.3 * calm), 236 + 12 * Math.sin(t * 2.1 * calm)];
      tr(batG, BAT[0], BAT[1]); theBat.flap(t * calm);
      tr(mothG, MOTH[0], MOTH[1]); theMoth.flap(t * calm);
      const FISH = [770 + 6 * Math.sin(t * 1.4 * calm), 580];
      tr(fishG, FISH[0], FISH[1], 1.1);
      const echo = (outs, backs, src, dst, per, off) => {
        const tt = t - tG - off, k = Math.floor(tt / per), te = tG + off + k * per, r = 380 * (t - te);
        const d = Math.hypot(dst[0] - src[0], dst[1] - src[1]), ang = Math.atan2(dst[1] - src[1], dst[0] - src[0]);
        packet(outs, src[0], src[1], ang, r, 10, 0.22, tt > 0 ? 1 : 0, d - 20);
        packet(backs, dst[0], dst[1], ang + Math.PI, r - d, 10, 0.4, tt > 0 ? 0.8 : 0, d - 30);
      };
      echo(BAT_O, BAT_E, [BAT[0] + 34, BAT[1] - 14], MOTH, 1.25, 0.15);
      echo(DOL_O, DOL_E, [432, 572], FISH, 1.25, 0.75);
      op(lBat, P(t, tG + 0.2, 0.4, linear)); op(lDol, P(t, mid('bats', 0.18), 0.4, linear));
      popIn(ecl, t, mid('bats', 0.56), 990, 474);
      op(eclSub, P(t, mid('bats', 0.64), 0.4, linear));
    }
  };
});

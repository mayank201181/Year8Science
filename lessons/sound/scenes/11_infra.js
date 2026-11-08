/* Chapter 11: Infrasound: below our hearing.
   The shared frequency line runs along the bottom throughout; pictures of infrasound sit above it.
   Beats: from the ultrasound end to the infrasound end: below 20 Hz, too low to hear -> an elephant's
   rumble crosses kilometres of plain and runs through the ground into a distant herd's feet
   (showpiece) -> a whale's low call spreads across the ocean -> earthquakes, volcanoes and storms
   make it; a detector's trace jumps; a warning -> animals react before people notice (maybe), ahead
   of an earthquake -> the whole line: we hear just a slice. */
scene('infra', S => {
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
  function clipRect(x, y, w, h) { const id = `${ID}-cl${++gid}`; const cp = E('clipPath', { id }, defs()); E('rect', { x, y, width: w, height: h }, cp); return `url(#${id})`; }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  const arcD = (cx, cy, r, a0, a1) => `M${(cx + r * Math.cos(a0)).toFixed(1)},${(cy + r * Math.sin(a0)).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${(cx + r * Math.cos(a1)).toFixed(1)},${(cy + r * Math.sin(a1)).toFixed(1)}`;
  const popIn = (el, t, t0, x, y, s0) => { s0 = s0 === undefined ? 0.6 : s0; const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); return p; };
  const beat = (t, a, b) => Math.min(P(t, a, 0.45, linear), 1 - P(t, b - 0.1, 0.45, linear));
  const arcSet = (parent, n, color, w) => { const a = []; for (let i = 0; i < n; i++) a.push(E('path', { fill: 'none', stroke: color, 'stroke-width': w || 5, 'stroke-linecap': 'round' }, parent)); return a; };
  const ORA = C.heat, ORALT = '#FFC59A';
  /* a continuous train of slow, long arcs leaving (sx, sy) towards angle ang since t0, at speed v,
     spacing lam, out to rmax; half-height capped at hmax */
  function rumble(els, t, t0, sx, sy, ang, v, lam, rmax, hmax, alpha) {
    const reach = (t - t0) * v, j0 = Math.max(0, Math.ceil((reach - rmax) / lam));
    els.forEach((el, i) => {
      const r = reach - (j0 + i) * lam;
      if (t < t0 || alpha <= 0 || r < 10 || r > rmax) { op(el, 0); return; }
      const half = Math.min(0.62, Math.asin(Math.min(1, hmax / r)));
      el.setAttribute('d', arcD(sx, sy, r, ang - half, ang + half));
      op(el, alpha * Math.min(1, r / 40, (rmax - r) / 50) * (1 - 0.45 * r / rmax));
    });
  }

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
  /* an ear seen from the side, opening to the left: the lesson's shared ear (chapters 0-2) at 0.86x */
  function earIcon(parent) {
    const g = G(parent), k = G(g, { transform: 'scale(0.86)' });
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 5, 'stroke-linecap': 'round' }, k);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, k);
    return g;
  }
  /* elephant, side view facing right, feet at (0,0), about 340 wide and 230 tall; g.ear flaps */
  function elephant(parent) {
    const g = G(parent), GR = '#8D99A6', DK = '#5E6A76', LT = '#B9C4CE', RIM = '#C9D3DB';
    [-62, 64].forEach(x => E('rect', { x: x - 20, y: -112, width: 40, height: 112, rx: 14, fill: DK }, g));
    E('path', { d: 'M-130,-150 Q-148,-120 -142,-84', stroke: DK, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-132,-122 C-138,-190 -70,-228 10,-224 C80,-220 122,-198 130,-150 C134,-118 122,-96 102,-92 L-112,-92 C-128,-96 -132,-108 -132,-122 Z', fill: ball(LT, GR), stroke: RIM, 'stroke-width': 3 }, g);
    [-104, 30].forEach(x => E('rect', { x, y: -114, width: 46, height: 114, rx: 16, fill: GR, stroke: RIM, 'stroke-width': 2.5 }, g));
    const trunk = 'M176,-150 C198,-118 198,-72 188,-38 C184,-24 196,-14 208,-22';
    E('path', { d: trunk, fill: 'none', stroke: RIM, 'stroke-width': 31, 'stroke-linecap': 'round' }, g);
    E('path', { d: trunk, fill: 'none', stroke: GR, 'stroke-width': 25, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 134, cy: -168, rx: 58, ry: 52, fill: ball(LT, GR), stroke: RIM, 'stroke-width': 3 }, g);
    E('path', { d: 'M162,-130 C178,-110 198,-108 212,-118', fill: 'none', stroke: '#F4EBD2', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    g.ear = G(g);
    E('path', { d: 'M106,-212 C62,-216 50,-152 64,-118 C76,-94 110,-102 118,-130 C124,-152 124,-202 106,-212 Z', fill: ball('#9AA6B2', DK), stroke: RIM, 'stroke-width': 3 }, g.ear);
    E('circle', { cx: 152, cy: -182, r: 5.5, fill: '#2A1D14' }, g);
    g.flap = a => g.ear.setAttribute('transform', `rotate(${(-a).toFixed(1)} 114 -150)`);
    return g;
  }
  /* whale, side view facing right, about 380 wide */
  function whale(parent) {
    const g = G(parent);
    E('path', { d: 'M-176,-4 C-196,-30 -214,-40 -232,-38 C-222,-20 -222,6 -232,26 C-212,26 -194,18 -176,0 Z', fill: '#3E5F7A', stroke: '#9FC2DA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-180,0 C-140,-50 30,-74 140,-40 C182,-26 200,-2 186,16 C150,50 30,58 -60,40 C-110,30 -150,18 -180,0 Z', fill: ball('#6A8FAE', '#34536D'), stroke: '#9FC2DA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-120,20 C-40,44 80,50 170,18 C150,40 40,56 -50,42 C-90,36 -110,30 -120,20 Z', fill: '#B9D2E2', opacity: 0.85 }, g);
    for (let k = 0; k < 5; k++) E('path', { d: `M${40 + k * 22},${36 - k * 2} L${60 + k * 22},${30 - k * 2}`, stroke: '#7FA3BC', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M30,34 C20,58 0,74 -26,80 C-16,60 -8,48 0,34 Z', fill: '#4E7390', stroke: '#9FC2DA', 'stroke-width': 2.5 }, g);
    E('circle', { cx: 132, cy: -6, r: 5, fill: '#14303D' }, g);
    return g;
  }
  /* dog, side view facing right, feet at (0,0); g.setEars(0..1), g.wag(t, k) */
  function dog(parent) {
    const g = G(parent), FUR = '#C98E52', DK = '#8E5B2E', LT = '#E8B987';
    const tail = E('path', { fill: 'none', stroke: FUR, 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    [-50, 30].forEach(x => E('rect', { x: x - 7, y: -56, width: 14, height: 56, rx: 7, fill: DK }, g));
    E('ellipse', { cx: 0, cy: -76, rx: 66, ry: 31, fill: ball(LT, FUR), stroke: DK, 'stroke-width': 2.5 }, g);
    [-36, 46].forEach(x => E('rect', { x: x - 8, y: -60, width: 16, height: 60, rx: 8, fill: FUR, stroke: DK, 'stroke-width': 2 }, g));
    E('path', { d: 'M38,-96 L62,-128 L84,-112 L62,-78 Z', fill: FUR }, g);
    E('path', { d: 'M48,-92 L72,-104', stroke: C.bad, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    const head = G(g); tr(head, 76, -128);
    E('ellipse', { rx: 25, ry: 22, fill: ball(LT, FUR), stroke: DK, 'stroke-width': 2.5 }, head);
    E('path', { d: 'M12,-7 L44,-3 Q51,4 44,11 L12,15 Z', fill: LT, stroke: DK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, head);
    E('circle', { cx: 46, cy: 2, r: 5.5, fill: '#2A1D14' }, head);
    E('circle', { cx: 9, cy: -7, r: 3.8, fill: '#2A1D14' }, head);
    const ear = G(head);
    E('path', { d: 'M-8,0 Q-15,24 -3,36 Q8,25 8,0 Z', fill: DK, stroke: '#6A4220', 'stroke-width': 2 }, ear);
    g.setEars = p => ear.setAttribute('transform', `translate(-8 -14) rotate(${lerp(22, 160, clamp(p)).toFixed(1)})`);
    g.wag = (t, k) => { const a = (0.35 + 0.5 * k * Math.sin(t * TAU * 2.2)); tail.setAttribute('d', `M-62,-84 Q${(-84 - 8 * a).toFixed(1)},-98 ${(-80 - 30 * a).toFixed(1)},${(-122 + 12 * Math.abs(a)).toFixed(1)}`); };
    g.setEars(0); g.wag(0, 0);
    return g;
  }
  /* small bird; g.set(fly 0..1, t) */
  function bird(parent, color) {
    const g = G(parent);
    const wings = E('path', { fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('ellipse', { cx: 0, cy: 0, rx: 11, ry: 8, fill: color }, g);
    E('circle', { cx: 9, cy: -6, r: 6, fill: color }, g);
    E('path', { d: 'M14,-7 L21,-5 L14,-3 Z', fill: '#FFC247' }, g);
    g.set = (f, t) => { const k = f > 0 ? Math.sin(t * TAU * 5) : 0.2; wings.setAttribute('d', `M-16,${(-2 - 14 * k * f - 3).toFixed(1)} Q-6,-6 0,-2 Q6,-6 16,${(-2 - 14 * k * f - 3).toFixed(1)}`); op(wings, f > 0.02 ? 1 : 0); };
    g.set(0, 0);
    return g;
  }
  function warnSign(parent, s) {
    const g = G(parent);
    E('path', { d: `M0,${-s} L${s * 1.05},${s * 0.78} L${-s * 1.05},${s * 0.78} Z`, fill: C.energy, stroke: '#B59A12', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('line', { x1: 0, y1: -s * 0.42, x2: 0, y2: s * 0.22, stroke: C.bg0, 'stroke-width': s * 0.16, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: 0, cy: s * 0.5, r: s * 0.09, fill: C.bg0 }, g);
    return g;
  }
  function ground(parent, y, c0, c1) {
    E('rect', { x: -10, y, width: 1220, height: 92, fill: linGrad(c0, c1, true) }, parent);
    E('line', { x1: -10, x2: 1210, y1: y, y2: y, stroke: '#A08B64', 'stroke-width': 4 }, parent);
  }

  /* ================= the frequency line (always on) ================= */
  const L = G(root);
  const fl = freqLine(L);
  const xL = fx(2) - 60, xR = fx(200000) + 60;
  const extL = G(L), extR = G(L);
  E('rect', { x: 55, y: FL.y - FL.h / 2, width: fx(20) - 55, height: FL.h, fill: C.heat }, extL);
  E('path', { d: `M56,${FL.y - 24} L32,${FL.y} L56,${FL.y + 24} Z`, fill: C.heat }, extL);
  E('rect', { x: fx(20000), y: FL.y - FL.h / 2, width: 1145 - fx(20000), height: FL.h, fill: C.ethanol }, extR);
  E('path', { d: `M1144,${FL.y - 24} L1168,${FL.y} L1144,${FL.y + 24} Z`, fill: C.ethanol }, extR);
  const hearRim = E('rect', { x: fx(20) - 4, y: FL.y - FL.h / 2 - 4, width: fx(20000) - fx(20) + 8, height: FL.h + 8, rx: 6, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, L);
  const otherEnd = arrow(L, fx(20000) + 20, 532, fx(20) + 8, 532, { color: C.muted, width: 4, bend: 70 });
  const sliceG = G(L);
  E('path', { d: `M${fx(20)},532 L${fx(20)},518 L${fx(20000)},518 L${fx(20000)},532`, fill: 'none', stroke: C.good, 'stroke-width': 4, 'stroke-linejoin': 'round' }, sliceG);
  T(sliceG, 600, 500, 'the sound we hear: **just a slice**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.good });

  /* ================= A. below 20 Hz: too low to hear ================= */
  const A = G(root);
  card(A, 70, 150, 560, 290, { fill: C.card, stroke: ORA, sw: 3 });
  E('path', { d: `M${fx(6) - 22},440 L${fx(6)},492 L${fx(6) + 22},440 Z`, fill: C.card, stroke: ORA, 'stroke-width': 3, 'stroke-linejoin': 'round' }, A);
  E('rect', { x: fx(6) - 21, y: 434, width: 42, height: 8, fill: C.card }, A);
  T(A, 350, 228, 'infrasound', { size: 58, weight: 700, anchor: 'middle', fill: ORA });
  const aBelow = T(A, 350, 284, 'sound **below 20 Hz**', { size: 34, weight: 600, anchor: 'middle', boldFill: ORALT });
  const aRest = E('line', { x1: 120, x2: 580, y1: 330, y2: 330, stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, A);
  const aWave = sineWave(A, { w: 460, amp: 18, wl: 230, color: ORA, width: 5 }); tr(aWave, 120, 330);
  const aRow = G(A);
  const aEar = earIcon(aRow); tr(aEar, 150, 392, 0.62);
  const aX = cross(aRow, 18); tr(aX, 168, 376);
  T(aRow, 204, 404, 'too low for us to hear', { size: 32, weight: 600 });

  /* ================= B. elephants across the plain ================= */
  const B = G(root);
  ground(B, 430, '#6B5A3A', '#2A2318');
  [[120, 0], [430, 1], [790, 0], [880, 1]].forEach(([x, k]) => E('path', { d: `M${x},430 l6,-16 l4,16 l6,-20 l4,20 l6,-14 l4,14`, fill: 'none', stroke: '#8BB86A', 'stroke-width': 3, 'stroke-linejoin': 'round', opacity: 0.8 }, B));
  const near = G(B); const bull = elephant(near); tr(near, 205, 430, 0.9);
  const herd = [[935, 0.36], [1012, 0.27], [1096, 0.36]].map(([x, s]) => { const g = G(B); const e = elephant(g); tr(g, x, 426, `${-s} ${s}`); return { g, e, x, s }; });
  const feetGlow = herd.map(h => E('ellipse', { cx: h.x, cy: 428, rx: 70 * h.s / 0.36, ry: 16, fill: glow(ORA) }, B));
  const vibG = G(B), VIB = [0, 1, 2].map(k => E('path', { fill: 'none', stroke: ORA, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, vibG));
  const airG = G(B), AIR = arcSet(airG, 9, ORA, 6);
  const kmG = G(B);
  arrow(kmG, 600, 190, 412, 190, { color: C.ink, width: 4 }); arrow(kmG, 640, 190, 880, 190, { color: C.ink, width: 4 });
  E('line', { x1: 404, x2: 404, y1: 172, y2: 208, stroke: C.ink, 'stroke-width': 4 }, kmG); E('line', { x1: 888, x2: 888, y1: 172, y2: 208, stroke: C.ink, 'stroke-width': 4 }, kmG);
  T(kmG, 620, 166, 'kilometres', { size: 32, weight: 700, anchor: 'middle' });
  const lRumble = T(B, 590, 412, 'deep rumbles', { size: 30, weight: 700, anchor: 'middle', fill: ORA });
  const lFeet = G(B);
  T(lFeet, 1040, 252, 'felt through', { size: 28, weight: 700, anchor: 'middle', fill: ORALT });
  T(lFeet, 1040, 286, 'their feet', { size: 28, weight: 700, anchor: 'middle', fill: ORALT });
  const E_SRC = [380, 300];

  /* ================= C. a whale's call across the ocean ================= */
  const Cw = G(root);
  E('rect', { x: -10, y: 150, width: 1220, height: 380, fill: linGrad('#11506E', '#071D2B', true) }, Cw);
  const cSurf = E('path', { fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.7 }, Cw);
  const bigWhale = G(Cw); whale(bigWhale);
  const farWhale = G(Cw); whale(farWhale); tr(farWhale, 1060, 300, '-0.3 0.3');
  const wArcsG = G(Cw, { 'clip-path': clipRect(-10, 156, 1220, 372) }), WARC = arcSet(wArcsG, 9, ORA, 6);
  const wDist = G(Cw);
  arrow(wDist, 640, 506, 470, 506, { color: C.ink, width: 4 }); arrow(wDist, 660, 506, 980, 506, { color: C.ink, width: 4 });
  T(wDist, 650, 490, 'huge distances of ocean', { size: 30, weight: 700, anchor: 'middle' });
  const lCall = T(Cw, 300, 444, 'very low calls', { size: 30, weight: 700, anchor: 'middle', fill: ORA });

  /* ================= D. earthquakes, volcanoes, storms; detectors ================= */
  const Dq = G(root);
  ground(Dq, 430, '#5E5040', '#241D16');
  const volc = G(Dq); tr(volc, 210, 430);
  const ash = []; const ar = rng(13);
  for (let k = 0; k < 7; k++) ash.push({ el: E('circle', { r: 20 + ar() * 14, fill: '#6F7880', opacity: 0.85 }, volc), ph: k / 7, dx: (ar() - 0.4) * 50 });
  E('path', { d: 'M-160,0 L-36,-176 L36,-176 L160,0 Z', fill: linGrad('#7A6250', '#3E3128', true), stroke: '#A08B74', 'stroke-width': 3, 'stroke-linejoin': 'round' }, volc);
  E('path', { d: 'M-36,-176 L36,-176 L28,-164 L-28,-164 Z', fill: '#FF6A2A' }, volc);
  const lava = E('path', { d: 'M-10,-170 C-18,-140 -30,-120 -40,-90 M14,-168 C22,-130 34,-112 46,-70', fill: 'none', stroke: '#FF8A3D', 'stroke-width': 8, 'stroke-linecap': 'round' }, volc);
  const glowV = E('ellipse', { cx: 0, cy: -180, rx: 60, ry: 40, fill: glow('#FF8A3D') }, volc);
  const crackG = G(Dq);
  const crack = E('path', { d: 'M430,431 L452,452 L440,470 L466,492 L456,514', fill: 'none', stroke: '#140E0A', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, crackG);
  const quakeLines = [[-1, 0], [1, 0]].map(([s]) => E('path', { d: `M${448 + s * 40},404 l${s * 8},-8 l${s * 4},10 l${s * 8},-8`, fill: 'none', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, crackG));
  const stormG = G(Dq);
  [[-50, 6, 34], [-12, -16, 42], [34, -4, 38], [64, 12, 28], [8, 14, 36]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#7D8C99', '#3E4A56') }, stormG));
  const zap = G(stormG); tr(zap, 6, 70); bolt(zap, 0.62);
  const rain = E('path', { d: 'M-40,40 l-8,22 M-14,44 l-8,22 M34,42 l-8,22 M60,36 l-8,22', stroke: '#9FD8FF', 'stroke-width': 3, 'stroke-linecap': 'round' }, stormG);
  const qArcsG = G(Dq, { 'clip-path': clipRect(-10, 100, 1220, 428) });
  const QA = [arcSet(qArcsG, 3, ORA, 5), arcSet(qArcsG, 3, ORA, 5), arcSet(qArcsG, 3, ORA, 5)], QT = arcSet(qArcsG, 4, ORA, 6);
  const QSRC = [[230, 236, -0.5], [450, 426, -Math.PI / 2], [700, 210, 0.15]];
  const stn = G(Dq); tr(stn, 1000, 430);
  E('rect', { x: -96, y: -112, width: 192, height: 112, rx: 6, fill: '#C9D6DE', stroke: '#EEF3F6', 'stroke-width': 3 }, stn);
  E('path', { d: 'M-110,-110 L0,-160 L110,-110 Z', fill: '#5E7A8C', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, stn);
  E('line', { x1: 70, y1: -134, x2: 70, y2: -206, stroke: '#9DB0BF', 'stroke-width': 5 }, stn);
  E('path', { d: 'M48,-212 Q70,-190 92,-212', fill: '#DDE7EE', stroke: '#9DB0BF', 'stroke-width': 3 }, stn);
  E('rect', { x: -78, y: -94, width: 156, height: 70, rx: 8, fill: '#06140F', stroke: '#2C5468', 'stroke-width': 3 }, stn);
  for (let k = 1; k < 4; k++) E('line', { x1: -78 + k * 39, x2: -78 + k * 39, y1: -94, y2: -24, stroke: C.line, 'stroke-width': 1.5, opacity: 0.4 }, stn);
  E('line', { x1: -74, x2: 74, y1: -59, y2: -59, stroke: C.faint, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, stn);
  const trace = sineWave(stn, { w: 148, amp: 2, wl: 37, color: C.good, width: 3.5 }); tr(trace, -74, -59);
  const lDet = T(Dq, 1000, 476, 'detector', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
  const qWarn = G(Dq); warnSign(qWarn, 36);
  const lWarn = T(Dq, 1000, 128, 'early warning', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const qLabs = [['earthquakes', 560, 490], ['volcanoes', 210, 476], ['storms', 640, 128]].map(([s, x, y]) => T(Dq, x, y, s, { size: 28, weight: 700, anchor: 'middle', fill: ORALT }));

  /* ================= E. animals sense it first ================= */
  const Ea = G(root);
  ground(Ea, 430, '#4E6B3E', '#1E2A18');
  const tl = G(Ea);
  arrow(tl, 230, 150, 1010, 150, { color: C.muted, width: 4 });
  T(tl, 1010, 180, 'time', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  const mkA = G(tl); E('circle', { cx: 360, cy: 150, r: 9, fill: ORA }, mkA); T(mkA, 360, 130, 'animals act strangely', { size: 26, weight: 700, anchor: 'middle', fill: ORALT });
  const mkQ = G(tl); E('circle', { cx: 880, cy: 150, r: 9, fill: C.bad }, mkQ); T(mkQ, 880, 130, 'earthquake', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9AA2' });
  const tree = G(Ea);
  E('rect', { x: 626, y: 320, width: 28, height: 112, rx: 6, fill: '#6B4A33' }, tree);
  [[600, 300, 50], [680, 300, 50], [640, 270, 58], [640, 318, 46]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball(C.plant, C.plantDk) }, tree));
  const BIRDS = [[596, 216], [626, 208], [662, 212], [690, 222]].map(([x, y], i) => ({ g: bird(Ea, '#8FA3BC'), x, y, i }));
  const aDogG = G(Ea); const aDog = dog(aDogG); tr(aDogG, 310, 430, 1.1);
  const bark = [0, 1, 2].map(k => E('path', { d: `M${448 + k * 4},${300 + (k - 1) * 22} l16,${(k - 1) * 8}`, stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, Ea));
  const folkG = G(Ea); const folk = person(folkG, { shirt: '#5B8DEF', shorts: '#3E4F66' }); tr(folkG, 940, 430, '-1 1');
  const lFolk = T(Ea, 940, 470, 'people notice nothing', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const maybe = chip(Ea, 'maybe', { size: 28, fill: 'rgba(255,138,61,0.16)', stroke: ORA, color: ORALT });
  const eArcsG = G(Ea, { 'clip-path': clipRect(-10, 190, 1220, 330) }), EA = arcSet(eArcsG, 6, ORA, 4);

  /* ================= F. just a slice ================= */
  const Fs = G(root);
  const fAll = G(Fs);
  E('path', { d: 'M40,346 L40,330 L1160,330 L1160,346', fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, fAll);
  T(fAll, 600, 310, 'all sound', { size: 34, weight: 700, anchor: 'middle' });
  const fEle = G(Fs); elephant(fEle);
  const fBat = G(Fs);
  { const DKB = '#3E3550', LTB = '#9C8CC0';
    E('path', { d: 'M-8,-6 C-40,-40 -80,-44 -112,-30 C-100,-20 -96,-8 -98,4 C-84,-4 -70,-2 -62,8 C-52,0 -36,0 -26,10 C-20,2 -14,0 -8,4 Z', fill: DKB, stroke: LTB, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fBat);
    E('path', { d: 'M8,-6 C40,-40 80,-44 112,-30 C100,-20 96,-8 98,4 C84,-4 70,-2 62,8 C52,0 36,0 26,10 C20,2 14,0 8,4 Z', fill: DKB, stroke: LTB, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, fBat);
    E('ellipse', { cx: 0, cy: 4, rx: 20, ry: 26, fill: ball('#6A5C86', DKB), stroke: LTB, 'stroke-width': 2.5 }, fBat);
    E('path', { d: 'M6,-26 L10,-42 L18,-24 Z M20,-22 L28,-36 L30,-16 Z', fill: DKB, stroke: LTB, 'stroke-width': 2, 'stroke-linejoin': 'round' }, fBat);
    E('circle', { cx: 18, cy: -14, r: 14, fill: ball('#6A5C86', DKB), stroke: LTB, 'stroke-width': 2.5 }, fBat);
    E('circle', { cx: 24, cy: -17, r: 2.6, fill: C.energy }, fBat); }

  /* ================= update ================= */
  return t => {
    const tB = at('elephant'), tC = at('whale'), tD = at('quake'), tE = at('animals'), tF = at('slice');
    const aA = beat(t, S.first - 0.15, tB), aB = beat(t, tB - 0.1, tC), aC = beat(t, tC - 0.1, tD), aD = beat(t, tD - 0.1, tE), aE = beat(t, tE - 0.1, tF), aF = P(t, tF - 0.1, 0.45, linear);
    op(A, aA); op(B, aB); op(Cw, aC); op(Dq, aD); op(Ea, aE); op(Fs, aF);

    /* ---- the line ---- */
    const lIn = P(t, S.first - 0.15, 0.7, easeOut);
    op(L, lIn); tr(L, 0, (1 - lIn) * 30);
    const mid25 = 1 - P(t, tB, 0.5, linear) + P(t, tF, 0.6, linear);       // 1 in the first and last beats, 0 between
    const infOn = P(t, mid('below', 0.34), 0.7, ease);
    attr(fl.inf, 'x', lerp(fx(20), xL, infOn)); attr(fl.inf, 'width', Math.max(0, (fx(20) - xL) * infOn));
    op(fl.lInf, P(t, mid('below', 0.36), 0.4, linear));
    const ultPulse = win(t, mid('below', 0.02), mid('below', 0.36), 0.3);
    op(fl.ult, clamp(0.4 + 0.6 * Math.max(mid25 * 0.6, ultPulse * (0.7 + 0.3 * wave(t, 0.6)), P(t, tF, 0.6, linear))));
    op(fl.hear, clamp(0.4 + 0.6 * Math.max(mid25 * 0.6, P(t, tF, 0.6, linear))));
    op(fl.lUlt, Math.max(ultPulse, P(t, tF + 0.1, 0.5, linear)));
    op(fl.lHear, Math.max(0.8 * win(t, mid('below', 0.02), tB + 0.2, 0.4), P(t, tF + 0.1, 0.5, linear)));
    otherEnd.set(P(t, mid('below', 0.08), 1.0)); op(otherEnd, win(t, mid('below', 0.08), mid('below', 0.5), 0.3));
    const ext = P(t, mid('slice', 0.06), 0.9, ease);
    op(extL, ext); op(extR, ext);
    tr(extL, (1 - ext) * 40, 0); tr(extR, -(1 - ext) * 40, 0);
    fl.tl[20].setAttribute('fill', win(t, mid('slice', 0.14), mid('slice', 0.62), 0.3) > 0.5 ? ORALT : C.ink);
    fl.tl[20000].setAttribute('fill', win(t, mid('slice', 0.36), mid('slice', 0.62), 0.3) > 0.5 ? '#E4D6FF' : C.ink);
    const sl = P(t, mid('slice', 0.62), 0.5, linear);
    op(hearRim, sl * (0.6 + 0.4 * wave(t, 1.0))); op(sliceG, sl);

    /* ---- A ---- */
    if (aA > 0) {
      const cp = P(t, mid('below', 0.3), 0.6, easeOut);
      op(A, aA * cp); tr(A, 0, (1 - cp) * 16);
      op(aBelow, P(t, mid('below', 0.5), 0.4, linear));
      aWave.set({ phase: t * 0.45 * calm });
      op(aWave, P(t, mid('below', 0.5), 0.5, linear)); op(aRest, P(t, mid('below', 0.5), 0.5, linear));
      op(aRow, P(t, mid('below', 0.58), 0.4, linear));
      const xp = P(t, mid('below', 0.64), 0.4, pop); op(aX, clamp(xp * 2)); tr(aX, 168, 376, Math.max(0.01, xp));
    }

    /* ---- B: elephants ---- */
    if (aB > 0) {
      const t0 = mid('elephant', 0.04);
      rumble(AIR, t, t0, E_SRC[0], E_SRC[1], 0, 108, 78, 560, 86, 0.9);
      bull.flap(6 * Math.sin(t * 1.6 * calm));
      const v0 = mid('elephant', 0.4), front = lerp(250, 1130, P(t, v0, 1.5, linear));
      VIB.forEach((p, k) => {
        if (t < v0) { op(p, 0); return; }
        op(p, 0.9);
        const y0 = 452 + k * 18; let d = '';
        for (let x = 150; x <= front; x += 8) d += (x === 150 ? 'M' : 'L') + x + ',' + (y0 + 4.5 * Math.sin(TAU * (x / 64 - 1.3 * t * calm) + k)).toFixed(1);
        if (d) p.setAttribute('d', d);
      });
      const felt = P(t, v0 + 1.4, 0.5, linear);
      feetGlow.forEach(g => op(g, felt * (0.6 + 0.4 * wave(t, 0.8))));
      herd.forEach((h, i) => h.e.flap(felt * (14 + 6 * Math.sin(t * 3 + i)) * (0.4 + 0.6 * calm)));
      op(lFeet, P(t, v0 + 1.6, 0.4, linear));
      op(kmG, P(t, mid('elephant', 0.3), 0.5, linear));
      op(lRumble, P(t, mid('elephant', 0.08), 0.4, linear));
    }

    /* ---- C: whale ---- */
    if (aC > 0) {
      let sd = ''; for (let x = -10; x <= 1210; x += 10) sd += (x === -10 ? 'M' : 'L') + x + ',' + (152 + 3 * Math.sin(x / 40 + t * 1.6 * calm)).toFixed(1);
      cSurf.setAttribute('d', sd);
      tr(bigWhale, 290, 330 + 6 * Math.sin(t * 0.9 * calm), 0.95, 1.5 * Math.sin(t * 0.7 * calm));
      tr(farWhale, 1060, 300 + 4 * Math.sin(t * 0.8 * calm + 1), '-0.3 0.3');
      rumble(WARC, t, tC + 0.15, 470, 320, 0, 150, 92, 640, 118, 0.85);
      op(lCall, P(t, mid('whale', 0.08), 0.4, linear));
      op(wDist, P(t, mid('whale', 0.5), 0.4, linear));
    }

    /* ---- D: quakes, volcanoes, storms ---- */
    if (aD > 0) {
      const pq = P(t, mid('quake', 0.02), 0.5, linear), pv = P(t, mid('quake', 0.1), 0.6, pop), ps = P(t, mid('quake', 0.2), 0.6, pop);
      crack.setAttribute('stroke-width', (10 * pq).toFixed(1)); op(crack, pq > 0 ? 1 : 0);
      quakeLines.forEach((q, i) => op(q, pq * (Math.floor(t * 8 + i) % 2 ? 1 : 0.35)));
      tr(crackG, Math.sin(t * 43) * 2 * pq * calm, 0);
      op(volc, clamp(pv * 2)); tr(volc, 210, 430, Math.max(0.01, 0.7 + 0.3 * pv));
      ash.forEach(a => { const u = ((t * 0.18) + a.ph) % 1; attr(a.el, 'cx', a.dx * u); attr(a.el, 'cy', -190 - u * 86); a.el.setAttribute('r', (16 + 18 * u).toFixed(1)); op(a.el, 0.85 * Math.sin(u * Math.PI)); });
      op(glowV, 0.6 + 0.4 * wave(t, 0.7));
      op(stormG, clamp(ps * 2)); tr(stormG, 640, 196, Math.max(0.01, 0.7 + 0.3 * ps));
      op(zap, ps * (wave(t, 1.3) > 0.82 ? 1 : 0.15));
      qLabs.forEach((l, i) => op(l, P(t, mid('quake', [0.03, 0.11, 0.21][i]), 0.4, linear)));
      const starts = [mid('quake', 0.06), mid('quake', 0.14), mid('quake', 0.24)];
      QSRC.forEach((s, i) => rumble(QA[i], t, starts[i], s[0], s[1], s[2], 90, 46, 150, 44, 0.85));
      rumble(QT, t, mid('quake', 0.32), 560, 340, 0, 170, 78, 330, 96, 0.9);
      const arrive = P(t, mid('quake', 0.54), 0.5, linear);
      trace.set({ amp: lerp(2, 24, arrive), wl: lerp(37, 74, arrive), phase: t * 0.9 * calm });
      op(lDet, P(t, mid('quake', 0.46), 0.4, linear));
      popIn(qWarn, t, mid('quake', 0.72), 1000, 214);
      op(lWarn, P(t, mid('quake', 0.76), 0.4, linear));
    }

    /* ---- E: animals ---- */
    if (aE > 0) {
      const tt = t - tE, k = Math.floor(Math.max(0, tt) / 1.6), te = tE + k * 1.6;
      EA.forEach((el, i) => {
        const r = 120 * (t - te) - i * 60;
        if (tt < 0 || r < 10 || r > 540) { op(el, 0); return; }
        el.setAttribute('d', arcD(640, 540, r, Math.PI * 1.08, Math.PI * 1.92));
        op(el, 0.45 * Math.min(1, r / 60, (540 - r) / 80));
      });
      const alert = P(t, mid('animals', 0.1), 0.4, easeOut);
      aDog.setEars(alert); aDog.wag(t, alert * calm);
      bark.forEach((b, i) => op(b, alert * (1 - P(t, mid('animals', 0.7), 0.4, linear)) * ((Math.floor(t * 5) + i) % 3 ? 0.9 : 0.2)));
      BIRDS.forEach(b => {
        const u = P(t, mid('animals', 0.14 + b.i * 0.04), 3.6, linear);
        b.g.set(u > 0 ? 1 : 0, t + b.i * 0.13);
        tr(b.g, b.x + u * (70 + b.i * 22), b.y - 26 * Math.sin(Math.min(1, u * 2.2) * Math.PI / 2) + 5 * Math.sin(u * 9 + b.i));
        op(b.g, 1 - P(u, 0.85, 0.15, linear));
      });
      tr(folkG, 940, 430, '-1 1'); folk.pose({ armL: [8, 10], armR: [-8, 10] });
      op(lFolk, P(t, mid('animals', 0.36), 0.4, linear));
      op(mkA, P(t, mid('animals', 0.12), 0.4, linear));
      popIn(maybe, t, mid('animals', 0.56), 236, 236);
      op(mkQ, P(t, mid('animals', 0.75), 0.4, linear));
    }

    /* ---- F: just a slice ---- */
    if (aF > 0) {
      const pe = P(t, mid('slice', 0.12), 0.5, pop);
      op(fEle, clamp(pe * 2)); tr(fEle, fx(6) - 10, 476, Math.max(0.01, 0.42 * pe));
      const pb = P(t, mid('slice', 0.36), 0.5, pop);
      op(fBat, clamp(pb * 2)); tr(fBat, fx(60000), 430, Math.max(0.01, 0.72 * pb));
      const pa = P(t, mid('slice', 0.5), 0.5, linear);
      op(fAll, pa); tr(fAll, 0, (1 - pa) * 12);
    }
  };
});

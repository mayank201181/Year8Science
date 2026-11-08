/* Mass versus weight. "mass" = "weight" in everyday talk, not in physics -> a bag fills with matter and is
   stamped 2 kg, then hops Earth -> Moon -> deep space, still 2 kg -> back on Earth gravity pulls it (weight),
   and the pull shrinks on the Moon -> Mass is Matter, Weight is the Wrench -> W = m x g, We Most Go -> g on
   Earth -> the bag on a newtonmeter: 2 x 10 = 20 N -> g on the Moon, about 1/6 -> showpiece: the same bag on
   the Moon reads 3.2 N while an astronaut bounces -> the Space Station: still 2 kg, still pulled, falling
   around the Earth. Every force arrow: 1 N = 10 px. */
scene('mass', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SC = 10, WCOL = C.glucose, GCOL = C.air;     // weight amber (as its arrow), g sky blue, mass white

  /* ---------- helpers ---------- */
  let nClip = 0;
  const clipUrl = d => { const id = 'massclip' + (++nClip), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  const disc = (cx, cy, r) => `M${cx - r},${cy} A${r},${r} 0 1 0 ${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} Z`;
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'middle', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popIn = (el, p, x, y, fade) => { op(el, clamp(p * 2) * (fade === undefined ? 1 : fade)); tr(el, x, y, Math.max(0.01, p)); };
  function earthGlobe(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.13, fill: glow('#4CC9F0'), opacity: 0.45 }, g);
    E('circle', { r, fill: ball('#4C9BE8', '#1D4E8F') }, g);
    const land = G(g); land.setAttribute('clip-path', clipUrl(disc(0, 0, r)));
    [[-0.36, -0.46, 0.3, 0.17, 3], [0.32, -0.12, 0.26, 0.36, 5], [-0.42, 0.24, 0.28, 0.2, 8], [0.1, 0.66, 0.48, 0.14, 2], [-0.02, -0.86, 0.36, 0.1, 6]].forEach(([x, y, rx, ry, sd]) =>
      E('path', { d: closedPath(blobPts(rx * r, ry * r, 12, 0, 0.22, sd)), fill: '#5BD27A', opacity: 0.88, transform: `translate(${(x * r).toFixed(1)} ${(y * r).toFixed(1)})` }, land));
    return g;
  }
  function moonGlobe(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.14, fill: glow('#C9D0D6'), opacity: 0.3 }, g);
    E('circle', { r, fill: ball('#D2D8DD', '#6E767E') }, g);
    [[-0.32, -0.28, 0.2], [0.34, 0.12, 0.24], [-0.18, 0.48, 0.13], [0.44, -0.46, 0.11], [0.02, 0.04, 0.09]].forEach(([x, y, k]) => E('circle', { cx: x * r, cy: y * r, r: k * r, fill: '#8C949B', opacity: 0.8 }, g));
    return g;
  }
  /* the 2 kg bag of matter: a sack full of grains, hanging from its loop at (0,0); weight acts at (0, g.cy) */
  const SACK = 'M-16,32 L16,32 C54,52 64,124 52,154 Q0,172 -52,154 C-64,124 -54,52 -16,32 Z';
  function matterBag(parent, s) {
    const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
    E('path', { d: 'M-11,24 C-13,-7 13,-7 11,24', fill: 'none', stroke: '#8A6A3E', 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
    E('path', { d: SACK, fill: '#2E2010' }, inner);
    const pg = G(inner); pg.setAttribute('clip-path', clipUrl(SACK));
    g.grains = [];
    for (let row = 0; row < 7; row++) for (let col = 0; col < 6; col++) {
      const x = -55 + col * 21 + (row % 2) * 10.5, y = 158 - row * 19;
      g.grains.push({ el: E('circle', { cx: x, cy: y, r: 10, fill: ball('#F3DDAF', '#A67E46') }, pg), y, k: row * 6 + col });
    }
    E('path', { d: SACK, fill: 'rgba(221,187,130,0.16)', stroke: '#7A5A30', 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
    E('rect', { x: -19, y: 24, width: 38, height: 11, rx: 4, fill: '#7A5A30' }, inner);
    g.stamp = G(inner);
    E('rect', { x: -44, y: 50, width: 88, height: 40, rx: 9, fill: '#F6EAD0', stroke: '#7A5A30', 'stroke-width': 2.5 }, g.stamp);
    T(g.stamp, 0, 81, '2 kg', { size: 32, weight: 800, fill: '#3B2A14', anchor: 'middle' });
    g.cy = 100 * s;
    /* fill(p): the grains pour in, bottom row first; pulse(k): the stamp swells */
    g.fill = p => g.grains.forEach(q => { const u = clamp((p - q.k / 42 * 0.7) / 0.3); op(q.el, u); attr(q.el, 'cy', lerp(30, q.y, easeIn(u))); });
    g.pulse = k => g.stamp.setAttribute('transform', `translate(0 70) scale(${k.toFixed(3)}) translate(0 -70)`);
    return g;
  }
  /* a weight arrow with a dark outline, so it stays clear where it crosses the bag */
  function weightArrow(parent, n, o) {
    const g = G(parent);
    const halo = fmArrow(g, 'weight', 0, 0, n, 'down', { scale: SC, color: '#140C03', width: 15, label: '', value: false });
    halo.style.opacity = 0.7;
    const opts = Object.assign({ scale: SC }, o), a = fmArrow(g, 'weight', 0, 0, n, 'down', opts);
    const head = a.childNodes[1];
    head.setAttribute('stroke', '#140C03'); head.setAttribute('stroke-width', 4); head.setAttribute('paint-order', 'stroke');
    g.set = (p, nn) => { opts.nudge = [48 * clamp((14 - (nn === undefined ? n : nn)) / 10.8), 0]; halo.set(p, nn); a.set(p, nn); };
    g.move = (x, y) => { halo.move(x, y); a.move(x, y); };
    return g;
  }

  /* ===== DOM order, back to front ===== */
  const moonBack = G(root); fmMoon(moonBack, { ground: 700, earthX: 610, earthY: 176, earthR: 36, stars: 60, seed: 4 });

  /* ===== A. same in everyday talk, different in physics ===== */
  const A = G(root);
  const lblEvery = T(A, 600, 318, 'in everyday talk', { size: 36, weight: 600, anchor: 'middle', fill: C.muted });
  const lblPhys = T(A, 600, 318, 'in physics', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  const cMass = chip(A, 'mass', { size: 52, fill: C.ink, color: C.bg0 });
  const cWeight = chip(A, 'weight', { size: 52, fill: WCOL, color: '#3A2600' });
  const eqSign = G(A);
  E('rect', { x: -30, y: -21, width: 60, height: 12, rx: 6, fill: C.ink }, eqSign); E('rect', { x: -30, y: 9, width: 60, height: 12, rx: 6, fill: C.ink }, eqSign);
  const slash = E('line', { stroke: C.bad, 'stroke-width': 10, 'stroke-linecap': 'round' }, A);
  const bubble = G(A);
  E('path', { d: 'M-170,-44 Q-170,-60 -154,-60 L154,-60 Q170,-60 170,-44 L170,14 Q170,30 154,30 L-60,30 L-92,62 L-90,30 L-154,30 Q-170,30 -170,14 Z', fill: C.card2, stroke: C.line, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bubble);
  T(bubble, 0, -2, '“I weigh 50 kg!”', { size: 38, weight: 600, anchor: 'middle' });
  const EQ_GAP = 90, eqTot = cMass.w + EQ_GAP + cWeight.w, X0 = 600 - eqTot / 2;
  const XM_T = X0 + cMass.w / 2, XEQ_T = X0 + cMass.w + EQ_GAP / 2, XW_T = X0 + cMass.w + EQ_GAP + cWeight.w / 2;

  /* ===== B, C. the strip: Earth, Moon, deep space ===== */
  const B = G(root);
  const sr = rng(9);
  for (let i = 0; i < 34; i++) E('circle', { cx: (580 + sr() * 600).toFixed(1), cy: (110 + sr() * 470).toFixed(1), r: (0.8 + sr() * 1.6).toFixed(2), fill: '#FFFFFF', opacity: (0.25 + sr() * 0.5).toFixed(2) }, B);
  const bEarth = earthGlobe(B, 360); tr(bEarth, 230, 930);
  const bMoon = moonGlobe(B, 100); tr(bMoon, 680, 708);
  T(B, 96, 706, 'Earth', { size: 30, weight: 700, anchor: 'middle' });
  T(B, 680, 718, 'Moon', { size: 30, weight: 700, anchor: 'middle', fill: '#26303A' });
  const spaceLbl = T(B, 1010, 578, 'deep space', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const hMass = rich(B, 600, 160, [['Mass', C.ink, 800], ': the amount of ', ['matter', C.ink, 800]], { size: 46, weight: 500, fill: C.muted });
  const hWeight = rich(B, 600, 160, [['Weight', WCOL, 800], ': the force of ', ['gravity', WCOL, 800], ' on a mass'], { size: 46, weight: 500, fill: C.muted });
  const uKg = chip(B, 'kilograms (kg)', { size: 30, fill: C.ink, color: C.bg0 });
  const uN = chip(B, 'newtons (N)', { size: 30, fill: WCOL, color: '#3A2600' });
  const pSame = chip(B, '✓ never changes', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good, sw: 2.5 });
  const pChange = chip(B, 'changes with gravity', { size: 30, fill: 'rgba(255,194,71,0.14)', stroke: WCOL, color: WCOL, sw: 2.5 });
  const kgChips = [[360, 520], [806, 552], [1010, 506]].map(([x, y]) => { const c = chip(B, '2 kg', { size: 28, fill: '#F6EAD0', color: '#3B2A14' }); return { c, x, y }; });
  const PE = [230, 440], PM = [680, 478], PSP = [1010, 324];      // the bag's loop: on Earth, on the Moon, in deep space
  const HOPS = [[mid('mass', 0.62), 0.75, PE, PM, 150], [mid('mass', 0.79), 0.8, PM, PSP, 150], [at('weight') - 0.05, 1.0, PSP, PE, 230], [mid('weight', 0.76), 0.85, PE, PM, 150]];
  function stripAt(t) {
    let pos = PE, idx = -1, pp = 0;
    HOPS.forEach(([t0, d, a, b, h], i) => {
      if (t < t0) return;
      const p = clamp((t - t0) / d);
      pos = [lerp(a[0], b[0], ease(p)), lerp(a[1], b[1], p) - h * 4 * p * (1 - p)]; idx = i; pp = p;
    });
    return { pos, idx, pp };
  }

  /* ===== D. memory hooks ===== */
  const D = G(root);
  const cardL = G(D), cardR = G(D);
  card(cardL, 70, 140, 500, 446, { fill: C.card, stroke: C.line });
  T(cardL, 320, 212, '**M**ass is **M**atter', { size: 50, weight: 600, anchor: 'middle', boldFill: C.energy });
  T(cardL, 320, 258, 'in kilograms (kg)', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });
  card(cardR, 630, 140, 500, 446, { fill: C.card, stroke: C.line });
  T(cardR, 880, 212, '**W**eight is the **W**rench', { size: 50, weight: 600, anchor: 'middle', boldFill: C.energy });
  T(cardR, 880, 258, 'of gravity, in newtons (N)', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });
  const tug = G(cardR);                                   // a small bag gripped by an amber spanner that yanks it down
  const wrench = G(tug); tr(wrench, 0, -36);
  E('path', { d: 'M-12,30 L12,30 L12,118 L-12,118 Z', fill: WCOL, stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, wrench);
  E('path', { d: 'M-34,114 L34,114 L0,150 Z', fill: WCOL, stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, wrench);
  E('path', { d: 'M-18,-33 L-18,0 A18,18 0 0 0 18,0 L18,-33 A38,38 0 1 1 -18,-33 Z', fill: WCOL, stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, wrench);
  const tugBag = matterBag(tug, 0.62); tr(tugBag, 0, -150); op(tugBag.stamp, 0);
  const tugLbl = T(cardR, 1000, 500, 'gravity’s tug', { size: 28, weight: 700, anchor: 'middle', fill: WCOL });

  /* ===== E. the formula ===== */
  const F = G(root);
  const fWords = rich(F, 600, 236, [['weight', WCOL, 700], ' = ', ['mass', C.ink, 700], ' × ', ['gravitational field strength', GCOL, 700]], { size: 40, weight: 500, fill: C.muted });
  const fLet = G(root);                                    // W = m x g: later shrinks to the top left
  [['W', -180, WCOL], ['=', -90, C.muted], ['m', 0, C.ink], ['×', 90, C.muted], ['g', 180, GCOL]].forEach(([s, x, c]) => T(fLet, x, 0, s, { size: 104, weight: 700, anchor: 'middle', fill: c }));
  const fGo = G(F);
  [[-180, 'W', 'e', WCOL], [0, 'M', 'ost', C.ink], [180, 'G', 'o', GCOL]].forEach(([x, a, b, c]) => rich(fGo, x, 0, [[a, c, 800], [b, C.muted, 500]], { size: 56 }));

  /* ===== F-I. left panel (g, sums, globes) ===== */
  const LP = G(root);
  const lEarth = earthGlobe(LP, 125), lMoon = moonGlobe(LP, 54);
  const gE = chip(LP, 'g ≈ 10 N/kg', { size: 34, fill: GCOL, color: C.bg0 });
  const gM = chip(LP, 'g ≈ 1.6 N/kg', { size: 34, fill: GCOL, color: C.bg0 });
  const gNote = T(LP, 300, 664, 'more precisely, 9.8 N/kg', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const sixth = rich(LP, 300, 650, ['about ', ['1/6', GCOL, 800], ' of Earth’s: ', ['6 ×', GCOL, 800], ' weaker'], { size: 32, weight: 500 });
  function sum(parent, a, b) {          // "W = 2 x 10" then "= 20 N", built in two parts around x = 300
    const g = G(parent), o = { size: 42, weight: 500, anchor: 'start', fill: C.muted };
    const wa = textWidth(a.map(s => (typeof s === 'string' ? s : s[0])).join(''), 42, FD, 600), wb = textWidth(b.map(s => (typeof s === 'string' ? s : s[0])).join(''), 42, FD, 700);
    const x0 = 300 - (wa + wb + 12) / 2;
    g.a = rich(g, x0, 238, a, o); g.b = rich(g, x0 + wa + 12, 238, b, o);
    return g;
  }
  const sumE = sum(LP, [['W', WCOL, 700], ' = ', ['2', C.ink, 700], ' × ', ['10', GCOL, 700], ' '], ['= ', ['20 N', WCOL, 800]]);
  const sumM = sum(LP, [['W', WCOL, 700], ' = ', ['2', C.ink, 700], ' × ', ['1.6', GCOL, 700], ' '], ['= ', ['3.2 N', WCOL, 800]]);
  const ast = fmAstronaut(LP);

  /* ===== right panel: a newtonmeter on a stand ===== */
  const NM = G(root);
  const NMX = 870, NMY = 60, FLOORY = 700;
  const floor = fmFloor(NM, 630, 1170, FLOORY);
  E('rect', { x: 1062, y: FLOORY - 14, width: 116, height: 14, rx: 5, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, NM);
  E('rect', { x: 1113, y: 38, width: 14, height: FLOORY - 52, rx: 4, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, NM);
  E('rect', { x: NMX - 18, y: 36, width: 1127 - NMX + 18, height: 12, rx: 5, fill: linGrad('#B9C6D2', '#7D8C99', true), stroke: '#9DB0BF', 'stroke-width': 2 }, NM);
  E('line', { x1: NMX, y1: 48, x2: NMX, y2: NMY + 2, stroke: FM.metal[2], 'stroke-width': 5, 'stroke-linecap': 'round' }, NM);
  const nm = fmNewtonmeter(NM, { max: 20, len: 90, every: 10, minor: 2, readout: true }); tr(nm, NMX, NMY);
  const bar = fmScaleBar(NM, 650, 664, 10, { scale: SC });
  const still = chip(NM, 'still 2 kg', { size: 30, fill: '#F6EAD0', color: '#3B2A14' });

  /* ===== the 2 kg bag and its weight arrows (strip, cards, newtonmeter) ===== */
  const BG = G(root);
  const bag = matterBag(BG, 0.8);
  const wStrip = weightArrow(BG, 20, { label: 'weight', value: false });
  const wNM = weightArrow(BG, 20, { label: 'weight' });

  /* ===== J. orbit: the Space Station ===== */
  const O = G(root);
  const OE = [330, 446], OR = 226;
  const oEarth = earthGlobe(O, 166); tr(oEarth, OE[0], OE[1]);
  E('circle', { cx: OE[0], cy: OE[1], r: OR, fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '8 10', opacity: 0.55 }, O);
  const trail = E('path', { fill: 'none', stroke: C.energyLt, 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.55 }, O);
  const pull = E('line', { stroke: WCOL, 'stroke-width': 4, 'stroke-dasharray': '7 9', 'stroke-linecap': 'round' }, O);
  const pullLbl = chip(O, 'gravity', { size: 26, fill: 'rgba(10,27,39,0.82)', stroke: WCOL, color: WCOL, sw: 2 });
  const iss = G(O);
  E('rect', { x: -60, y: -3, width: 120, height: 6, fill: '#B9C6D2' }, iss);
  [[-64, -42], [-64, 6], [38, -42], [38, 6]].forEach(([x, y]) => { E('rect', { x, y, width: 26, height: 36, rx: 2, fill: '#2B5C9E', stroke: '#9FD8FF', 'stroke-width': 2 }, iss); E('line', { x1: x + 13, y1: y, x2: x + 13, y2: y + 36, stroke: '#9FD8FF', 'stroke-width': 1.5 }, iss); });
  E('rect', { x: -26, y: -11, width: 52, height: 22, rx: 9, fill: ball('#F2F7FA', '#9AA8B4'), stroke: '#DCE6EE', 'stroke-width': 2 }, iss);
  const fallLbl = rich(O, 330, 150, ['falling ', ['around', C.energy, 800], ' the Earth'], { size: 32, weight: 600 });
  const INS = [902, 372], IR = 206;
  const inset = G(O);
  T(inset, INS[0], 140, 'inside the Space Station', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  E('circle', { cx: INS[0], cy: INS[1], r: IR + 12, fill: '#8E9CA9', stroke: '#DCE6EE', 'stroke-width': 3 }, inset);
  const room = G(inset); room.setAttribute('clip-path', clipUrl(disc(INS[0], INS[1], IR)));
  E('rect', { x: INS[0] - IR, y: INS[1] - IR, width: 2 * IR, height: 2 * IR, fill: '#1F3646' }, room);
  for (let k = -2; k <= 2; k++) E('rect', { x: INS[0] - IR, y: INS[1] + k * 74 - 30, width: 2 * IR, height: 60, fill: '#24404F', stroke: '#2F5163', 'stroke-width': 2 }, room);
  E('line', { x1: INS[0] - IR, y1: INS[1] + 150, x2: INS[0] + IR, y2: INS[1] + 150, stroke: '#C9D6DF', 'stroke-width': 6, 'stroke-linecap': 'round' }, room);
  const flyer = fmAstronaut(room);
  flyer.pose({ armR: [80, 30], armL: [-60, 24], legL: [24, -30], legR: [-12, -18] });
  const oBag = matterBag(room, 0.8);
  const oW = weightArrow(room, 17.7, { label: 'weight', value: false });
  const cStill = chip(O, 'mass: still 2 kg', { size: 30, fill: '#F6EAD0', color: '#3B2A14' });
  const cGrav = chip(O, 'gravity: still about 90%', { size: 30, fill: 'rgba(255,194,71,0.14)', stroke: WCOL, color: WCOL, sw: 2.5 });

  /* ===== update ===== */
  return t => {
    /* --- A --- */
    const aA = win(t, S.first - 0.1, at('mass') - 0.15, 0.4);
    op(A, aA);
    if (aA > 0) {
      const pin = P(t, at('same') - 0.15, 0.5, pop), tog = P(t, mid('same', 0.12), 0.8), apart = P(t, mid('same', 0.58), 0.75, pop);
      const xm = lerp(lerp(380, XM_T, tog), 300, apart), xw = lerp(lerp(820, XW_T, tog), 900, apart), xe = lerp(XEQ_T, 600, apart);
      popIn(cMass, pin, xm, 440); popIn(cWeight, pin, xw, 440);
      op(eqSign, P(t, mid('same', 0.22), 0.4, linear)); tr(eqSign, xe, 440, 1 + 0.15 * Math.sin(Math.PI * P(t, mid('same', 0.6), 0.5, linear)));
      const sp = P(t, mid('same', 0.66), 0.4);
      op(slash, sp > 0.01 ? 1 : 0); attr(slash, 'x1', xe + 24); attr(slash, 'y1', 398); attr(slash, 'x2', lerp(xe + 24, xe - 24, sp)); attr(slash, 'y2', lerp(398, 482, sp));
      const bp = P(t, mid('same', 0.04), 0.5, pop);
      op(bubble, clamp(bp * 2) * (1 - P(t, mid('same', 0.58), 0.4, linear))); tr(bubble, 600, 200, Math.max(0.01, 0.8 + 0.2 * bp));
      op(lblEvery, win(t, mid('same', 0.14), mid('same', 0.56), 0.3)); op(lblPhys, P(t, mid('same', 0.62), 0.4, linear));
    }

    /* --- B, C: the strip --- */
    const aB = win(t, at('mass') - 0.25, at('matter') - 0.05, 0.45);
    op(B, aB);
    const st = stripAt(t), toW = P(t, at('weight') - 0.1, 0.5, linear);
    if (aB > 0) {
      op(hMass, P(t, mid('mass', 0.05), 0.5, linear) * (1 - toW)); op(hWeight, toW);
      popIn(uKg, P(t, mid('mass', 0.44), 0.5, pop), 470, 228, 1 - toW);
      popIn(pSame, P(t, mid('mass', 0.93), 0.5, pop), 760, 228, 1 - toW);
      popIn(uN, P(t, mid('weight', 0.5), 0.5, pop), 450, 228);
      popIn(pChange, P(t, mid('weight', 0.74), 0.5, pop), 740, 228);
      [mid('mass', 0.56), mid('mass', 0.73), mid('mass', 0.9)].forEach((t0, i) => { const k = kgChips[i]; popIn(k.c, P(t, t0, 0.5, pop), k.x, k.y); });
      op(spaceLbl, P(t, mid('mass', 0.88), 0.5, linear));
    }

    /* --- the bag: strip, then the memory-hook card, then the newtonmeter --- */
    const tFly = at('matter') - 0.1, inStrip = t < tFly, onCard = t >= tFly && t < at('formula');
    const aBag = Math.max(win(t, at('mass') - 0.1, at('formula') - 0.15, 0.4), win(t, at('bag') - 0.1, at('orbit') - 0.1, 0.4));
    op(BG, aBag);
    let reading = 0;
    if (t >= at('bag') - 0.15) {
      reading = 20 * P(t, at('bag') + 0.15, 1.0, easeOut);
      reading = lerp(reading, 3.2, P(t, mid('moonbag', 0.33), 1.4));
    }
    nm.set(reading);
    if (aBag > 0) {
      if (inStrip || onCard) {
        let [x, y] = st.pos, k = 1, rot = 0;
        const inSpace = (st.idx === 1 && st.pp >= 1) || (st.idx === 2 && st.pp <= 0);
        if (inSpace) { y += 7 * calm * Math.sin(t * 1.8); rot = 6 * calm * Math.sin(t * 1.1); }
        if (onCard || t > tFly - 1) { const f = P(t, tFly, 0.9); x = lerp(x, 320, f); y = lerp(y, 302, f); k = lerp(1, 1.22, f); }
        tr(bag, x, y, Math.max(0.01, lerp(0.6, 1, P(t, at('mass'), 0.5, pop)) * k), rot);
        bag.fill(P(t, mid('mass', 0.06), 1.6, linear));
        op(bag.stamp, P(t, mid('mass', 0.4), 0.4, linear));
        bag.pulse(1 + 0.18 * Math.sin(Math.PI * P(t, mid('mass', 0.4), 0.5, linear)) + 0.12 * [0.56, 0.73, 0.9].reduce((s, f) => s + Math.sin(Math.PI * P(t, mid('mass', f), 0.45, linear)), 0));
        /* weight: 20 N on Earth, shrinking to 3.2 N as it hops to the Moon */
        const n = st.idx === 3 ? lerp(20, 3.2, ease(st.pp)) : 20;
        wStrip.move(x, y + bag.cy * k); wStrip.set(P(t, mid('weight', 0.2), 0.7, easeOut), n);
        op(wStrip, 1 - P(t, tFly - 0.25, 0.3, linear)); op(wNM, 0);
      } else {
        const drop = 1 - P(t, at('bag') - 0.1, 0.4, easeOut);
        const hk = nm.hook(), x = NMX + hk[0], y = NMY + hk[1] - 40 * drop;
        tr(bag, x, y, 1); bag.fill(1); op(bag.stamp, 1);
        bag.pulse(1 + 0.2 * Math.sin(Math.PI * P(t, mid('moonbag', 0.05), 0.5, linear)) + 0.2 * Math.sin(Math.PI * P(t, mid('moonbag', 0.2), 0.5, linear)));
        op(wStrip, 0); op(wNM, P(t, at('bag') + 0.15, 0.3, linear));
        wNM.move(x, y + bag.cy); wNM.set(1, reading);
      }
    }

    /* --- D: memory hooks --- */
    const aD = win(t, at('matter') - 0.15, at('formula') - 0.1, 0.4);
    op(D, aD);
    if (aD > 0) {
      const pl = P(t, at('matter') - 0.1, 0.6, pop), pr = P(t, mid('matter', 0.5), 0.6, pop);
      op(cardL, clamp(pl * 2)); op(cardR, clamp(pr * 2));
      const yank = Math.pow(Math.max(0, Math.sin((t - mid('matter', 0.62)) * 3.2)), 3) * (t > mid('matter', 0.62) ? 1 : 0) * (calm > 0.5 ? 1 : 0.4);
      tr(tug, 880, 446 + 20 * yank);
      op(tugLbl, P(t, mid('matter', 0.72), 0.4, linear));
    }

    /* --- E: the formula; W = m x g then waits at the top left --- */
    const aF = win(t, at('formula') - 0.15, at('g') - 0.05, 0.4);
    op(F, aF);
    if (aF > 0) {
      op(fWords, P(t, mid('formula', 0.04), 0.5, linear));
      op(fGo, P(t, mid('formula', 0.78), 0.5, linear)); tr(fGo, 600, 520 + 12 * (1 - P(t, mid('formula', 0.78), 0.5, easeOut)));
    }
    const aLet = P(t, mid('formula', 0.44), 0.5, linear) * (1 - P(t, at('orbit') - 0.2, 0.4, linear));
    op(fLet, aLet);
    if (aLet > 0) { const mv = P(t, at('g') - 0.3, 0.9); tr(fLet, lerp(600, 300, mv), lerp(418, 174, mv), lerp(1, 0.48, mv)); }

    /* --- F-I: left panel --- */
    const aLP = P(t, at('g') - 0.2, 0.4, linear) * (1 - P(t, at('orbit') - 0.2, 0.4, linear));
    op(LP, aLP);
    if (aLP > 0) {
      const sh = P(t, at('moon') - 0.1, 0.9), goneG = P(t, at('moonbag') - 0.1, 0.5, linear);
      const pe = P(t, at('g'), 0.6, pop);
      popIn(lEarth, pe * lerp(1, 0.62, sh), lerp(300, 168, sh), lerp(432, 420, sh), 1 - goneG);
      popIn(gE, P(t, mid('g', 0.3), 0.5, pop) * lerp(1, 0.8, sh), lerp(300, 168, sh), lerp(606, 540, sh), 1 - goneG);
      op(gNote, P(t, mid('g', 0.62), 0.4, linear) * (1 - P(t, at('moon') - 0.2, 0.4, linear)));
      const pm = P(t, mid('moon', 0.06), 0.6, pop);
      popIn(lMoon, pm, 440, 420, 1 - goneG);
      popIn(gM, P(t, mid('moon', 0.18), 0.5, pop) * 0.8, 440, 540, 1 - goneG);
      op(sixth, P(t, mid('moon', 0.52), 0.5, linear) * (1 - goneG));
      const sE = 1 - P(t, mid('moonbag', 0.34), 0.4, linear);
      op(sumE.a, P(t, mid('bag', 0.3), 0.4, linear) * sE); op(sumE.b, P(t, mid('bag', 0.62), 0.4, linear) * sE);
      op(sumM.a, P(t, mid('moonbag', 0.38), 0.4, linear)); op(sumM.b, P(t, mid('moonbag', 0.5), 0.4, linear));
      /* the astronaut bounces in long, slow arcs */
      const aAst = P(t, at('moonbag') + 0.4, 0.6, linear);
      op(ast, aAst);
      if (aAst > 0) {
        const T0 = mid('moonbag', 0.4), HOP = 1.75, CYC = HOP + 0.3;
        let x = 130, b = 0;
        if (t > T0) {
          const n = (t - T0) / CYC, k = Math.floor(n), tt = (n - k) * CYC, air = Math.min(1, tt / HOP);
          if (k >= 3) x = 130 + 3 * 112;
          else { x = 130 + 112 * (k + ease(air)); b = tt < HOP ? Math.sin(Math.PI * air) : 0; }
        }
        tr(ast, x, FLOORY - 150 * b, 1);
        ast.pose({ lean: 6 * b, armR: [40 + 50 * b, 20], armL: [-30 - 40 * b, 20], legL: [8 + 30 * b, -8 - 46 * b], legR: [-6 + 14 * b, -8 - 30 * b] });
      }
    }

    /* --- right panel --- */
    const aNM = P(t, mid('g', 0.62), 0.5, linear) * (1 - P(t, at('orbit') - 0.2, 0.4, linear));
    op(NM, aNM);
    if (aNM > 0) {
      op(floor, 1 - P(t, at('moonbag') - 0.1, 0.5, linear));
      op(bar, P(t, mid('bag', 0.45), 0.4, linear));
      popIn(still, P(t, mid('moonbag', 0.08), 0.5, pop), 694, 384);
    }
    op(moonBack, P(t, at('moonbag') - 0.15, 0.6, linear) * (1 - P(t, at('orbit') - 0.2, 0.4, linear)));

    /* --- J: orbit --- */
    const aO = P(t, at('orbit') - 0.15, 0.5, linear);
    op(O, aO);
    if (aO > 0) {
      /* the station circles anticlockwise: always falling towards the Earth's centre, always missing it */
      const deg0 = -30, deg = deg0 - 9 * (t - at('orbit')), th = deg * Math.PI / 180;
      const sx = OE[0] + OR * Math.cos(th), sy = OE[1] + OR * Math.sin(th);
      tr(iss, sx, sy, 1, deg + 90);
      const a1 = th + 0.06, a0 = Math.min(deg0 * Math.PI / 180, a1 + 1.5);
      trail.setAttribute('d', `M${(OE[0] + OR * Math.cos(a0)).toFixed(1)},${(OE[1] + OR * Math.sin(a0)).toFixed(1)} A${OR},${OR} 0 0 0 ${(OE[0] + OR * Math.cos(a1)).toFixed(1)},${(OE[1] + OR * Math.sin(a1)).toFixed(1)}`);
      op(trail, P(t, mid('orbit', 0.6), 0.6, linear) * 0.7);
      const pp = P(t, mid('orbit', 0.42), 0.6);
      op(pull, pp); attr(pull, 'x1', sx); attr(pull, 'y1', sy); attr(pull, 'x2', lerp(sx, OE[0], pp)); attr(pull, 'y2', lerp(sy, OE[1], pp));
      op(pullLbl, P(t, mid('orbit', 0.48), 0.4, linear)); tr(pullLbl, lerp(sx, OE[0], 0.55), lerp(sy, OE[1], 0.55));
      op(fallLbl, P(t, mid('orbit', 0.66), 0.5, linear));
      const pi = P(t, mid('orbit', 0.04), 0.6, pop);
      op(inset, clamp(pi * 2)); inset.setAttribute('transform', `translate(${INS[0]} ${INS[1]}) scale(${Math.max(0.01, 0.8 + 0.2 * pi).toFixed(3)}) translate(${-INS[0]} ${-INS[1]})`);
      tr(flyer, INS[0] + 132 + 7 * calm * Math.sin(t * 0.7), INS[1] + 112 + 6 * calm * Math.sin(t * 0.9), 0.7, -26 + 8 * calm * Math.sin(t * 0.5));
      const bx = INS[0] - 104 + 6 * calm * Math.sin(t * 0.8 + 1), by = INS[1] - 158 + 5 * calm * Math.sin(t * 1.1), br = (-8 + 12 * calm * Math.sin(t * 0.6)) * Math.PI / 180;
      tr(oBag, bx, by, 1, br * 180 / Math.PI);
      oW.move(bx - oBag.cy * Math.sin(br), by + oBag.cy * Math.cos(br)); oW.set(P(t, mid('orbit', 0.42), 0.7, easeOut));
      popIn(cStill, P(t, mid('orbit', 0.3), 0.5, pop), INS[0], 632);
      popIn(cGrav, P(t, mid('orbit', 0.46), 0.5, pop), INS[0], 694);
    }
  };
});

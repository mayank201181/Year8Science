/* Chapter: Neutralisation.
   Beats: a red ACID chip and a blue BASE chip meet and cancel to green while a pointer on a mini pH bar moves
   to 7 -> the equation boxes ACID + BASE -> SALT + WATER -> A, B, S, W drop out of them -> the hydrochloric acid
   example, with a flask of acid and universal indicator -> showpiece: zoom into the flask, where H+ and OH- ions
   meet and snap into water while Na+ and Cl- drift on -> a little alkali leaves it acidic (orange, pH 4) -> too
   much makes it alkaline (blue, pH 11): check with an indicator -> diluting just spreads the acid out;
   neutralising makes new substances -> a farmer spreads lime on acidic soil -> an indigestion tablet in the
   stomach. */
scene('neutral', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  const RED = '#E8424F', ORANGE = '#FF8A3D', YELLOW = '#FFD84D', GREEN = '#56D69B', BLUE = '#3F8FE8', PURPLE = '#8E5CF0';
  const PH = [RED, RED, RED, ORANGE, ORANGE, YELLOW, YELLOW, GREEN, BLUE, BLUE, BLUE, BLUE, PURPLE, PURPLE, PURPLE];
  const RED_T = '#FF6B76', BLUE_T = '#6FB0FF', INK_DK = '#10202B', RED_DK = '#A4232E', CLEAR = '#CFE7F5';

  /* ---------- helpers ---------- */
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const x = hex(a), y = hex(b); p = clamp(p); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], p)).toString(16).padStart(2, '0')).join(''); };
  /* text in coloured runs: segs [text, fill, weight, {dy, size}] (dy/size give real superscripts and subscripts) */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; const a = s[3] || {}; E('tspan', { fill: s[1], 'font-weight': s[2], dy: a.dy, 'font-size': a.size }, t).textContent = s[0]; });
    return t;
  }
  const sup = (txt, fill, size) => [txt, fill, 800, { dy: -Math.round(size * 0.42), size: Math.round(size * 0.62) }];
  const sub = (txt, fill, size) => [txt, fill, 700, { dy: Math.round(size * 0.24), size: Math.round(size * 0.62) }];
  const back = (txt, fill, size, from) => [txt, fill, undefined, { dy: from === 'sup' ? Math.round(size * 0.42) : -Math.round(size * 0.24) }];
  const dropD = s => `M0,${-10 * s} C${6 * s},${-2 * s} ${8 * s},${3 * s} ${8 * s},${6 * s} A${8 * s},${8 * s} 0 0 1 ${-8 * s},${6 * s} C${-8 * s},${3 * s} ${-6 * s},${-2 * s} 0,${-10 * s} Z`;
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  function drifter(r, x0, y0, x1, y1, speed) {
    const gx = x0 + r() * (x1 - x0), gy = y0 + r() * (y1 - y0), a = r() * TAU, v = speed * (0.6 + 0.4 * r());
    const f = t => [bounce(gx + Math.cos(a) * v * t, x0, x1), bounce(gy + Math.sin(a) * v * t, y0, y1)];
    f.vx = Math.cos(a) * v; f.vy = Math.sin(a) * v;
    return f;
  }
  function keys(t, K) {
    if (t <= K[0][0]) return [K[0][1], K[0][2]];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const p = ease((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return [lerp(K[i - 1][1], K[i][1], p), lerp(K[i - 1][2], K[i][2], p)]; }
    const L = K[K.length - 1]; return [L[1], L[2]];
  }
  /* universal-indicator colour for any pH value, blending between the band colours */
  const STOPS = [[1, RED], [3.5, ORANGE], [5.5, YELLOW], [7, GREEN], [9.5, BLUE], [13, PURPLE]];
  function uiColour(ph) {
    if (ph <= STOPS[0][0]) return STOPS[0][1];
    for (let i = 1; i < STOPS.length; i++) if (ph <= STOPS[i][0]) return mix(STOPS[i - 1][1], STOPS[i][1], (ph - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0]));
    return PURPLE;
  }
  /* ion art (the lesson's shared spec): H+ is a white H with a red + badge; OH- a red O joined to a white H
     with a blue - badge */
  function badge(g, x, y, plus, r) {
    r = r || 7;
    E('circle', { cx: x, cy: y, r, fill: plus ? C.bad : BLUE, stroke: '#FFFFFF', 'stroke-width': r * 0.2 }, g);
    E('path', { d: plus ? `M${x - r * 0.5},${y} H${x + r * 0.5} M${x},${y - r * 0.5} V${y + r * 0.5}` : `M${x - r * 0.5},${y} H${x + r * 0.5}`, stroke: '#FFFFFF', 'stroke-width': r * 0.28, 'stroke-linecap': 'round' }, g);
  }
  function miniH(parent) { const g = G(parent); E('circle', { r: 14, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 1.5 }, g); badge(g, 11, -12, true); return g; }
  function miniOH(parent) { const g = G(parent); E('circle', { cx: 18, cy: 10, r: 10, fill: ball(C.hydrogen, C.hydrogenDk) }, g); E('circle', { r: 16, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g); badge(g, -13, -14, false); return g; }
  function hIon(parent) { const g = G(parent); atom(g, 'H', 14, { letter: true }); badge(g, 11, -12, true); return g; }
  function ohIon(parent) { const g = G(parent); tr(atom(g, 'H', 10, { letter: true }), 18, 10); atom(g, 'O', 16, { letter: true }); badge(g, -13, -14, false); return g; }
  /* glass dropper, tip at (0,0); g.squeeze(p) */
  function dropper(parent, liquid) {
    const g = G(parent);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104 Z', fill: 'rgba(200,230,250,0.16)' }, g);
    E('path', { d: 'M-6,-64 L-6,-30 L-1.5,-5 L1.5,-5 L6,-30 L6,-64 Z', fill: liquid }, g);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const bulb = G(g);
    E('path', { d: 'M-16,-100 C-20,-128 -14,-150 0,-150 C14,-150 20,-128 16,-100 Z', fill: ball('#E8663F', '#A33C1E'), stroke: '#F5A27F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, bulb);
    E('rect', { x: -18, y: -107, width: 36, height: 10, rx: 4, fill: '#B8461F' }, bulb);
    g.squeeze = p => bulb.setAttribute('transform', `translate(0 -102) scale(${(1 + 0.2 * p).toFixed(3)} ${(1 - 0.16 * p).toFixed(3)}) translate(0 102)`);
    g.squeeze(0);
    return g;
  }
  /* mini pH bar: 15 cells of 40 px from (0,0), numbers under; g.x(ph) is the middle of that cell */
  function miniBar(parent) {
    const CW = 40, g = G(parent), r = 10;
    // one shape per colour band (end cells rounded), one path for the cell dividers
    [[0, 2], [3, 4], [5, 6], [7, 7], [8, 11], [12, 14]].forEach(([a, b], k) => {
      const x0 = a * CW, x1 = (b + 1) * CW;
      let d = `M${x0},0 H${x1} V${CW} H${x0} Z`;
      if (k === 0) d = `M${r},0 H${x1} V${CW} H${r} Q0,${CW} 0,${CW - r} V${r} Q0,0 ${r},0 Z`;
      if (k === 5) d = `M${x0},0 H${x1 - r} Q${x1},0 ${x1},${r} V${CW - r} Q${x1},${CW} ${x1 - r},${CW} H${x0} Z`;
      E('path', { d, fill: PH[a], stroke: C.bg0, 'stroke-width': 2 }, g);
    });
    let dv = ''; for (let i = 1; i < 15; i++) dv += `M${i * CW},0 V${CW} `;
    E('path', { d: dv, stroke: C.bg0, 'stroke-width': 2 }, g);
    for (let i = 0; i < 15; i++) T(g, i * CW + CW / 2, CW + 30, String(i), { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    g.x = ph => (ph + 0.5) * CW;
    return g;
  }
  /* pH pointer: a readout chip over a little triangle, tip at (0,0); g.set(ph) */
  function pointer(parent) {
    const g = G(parent);
    E('path', { d: 'M-11,-16 L11,-16 L0,0 Z', fill: C.ink }, g);
    const box = E('rect', { x: -56, y: -64, width: 112, height: 46, rx: 23, fill: C.card2, stroke: C.ink, 'stroke-width': 2.5 }, g);
    const txt = T(g, 0, -31, 'pH 1', { size: 28, weight: 700, anchor: 'middle' });
    g.set = ph => { setText(txt, 'pH ' + Math.round(ph)); box.setAttribute('stroke', uiColour(ph)); };
    return g;
  }
  /* a simple water molecule for small sizes: red O, two white H */
  function water(parent, r) {
    const g = G(parent);
    E('circle', { cx: -r * 0.98, cy: r * 0.72, r: r * 0.62, fill: ball(C.hydrogen, C.hydrogenDk) }, g);
    E('circle', { cx: r * 0.98, cy: r * 0.72, r: r * 0.62, fill: ball(C.hydrogen, C.hydrogenDk) }, g);
    E('circle', { r, fill: ball(C.oxygen, C.oxygenDk) }, g);
    return g;
  }

  /* ================= A. acid meets base ================= */
  const A = G(root);
  const cAcid = chip(A, 'ACID', { size: 44, fill: RED, color: '#FFFFFF' }), cBase = chip(A, 'BASE', { size: 44, fill: BLUE, color: '#FFFFFF' });
  const meetX = [600 - cAcid.w / 2 - 6, 600 + cBase.w / 2 + 6];
  const flash = spark(A, 30, { seed: 4 });
  const cancel = T(A, 600, 404, 'they cancel out', { size: 36, weight: 700, anchor: 'middle', fill: GREEN });
  const barG = G(root), bar = miniBar(barG), ptr = pointer(barG);

  /* ================= B. the equation strip ================= */
  const B = G(root);
  const BY = 200, BW = 230, BH = 112, BX = [164, 448, 752, 1036];
  const SPEC = [
    { w: 'ACID', ex: ['hydrochloric', 'acid'], fill: '#4A1A22', stroke: RED, ink: '#FF97A0' },
    { w: 'BASE', ex: ['sodium', 'hydroxide'], fill: '#132F57', stroke: BLUE, ink: '#9CC8FF' },
    { w: 'SALT', ex: ['sodium', 'chloride'], fill: '#123F2C', stroke: GREEN, ink: '#86F0BE' },
    { w: 'WATER', ex: ['water'], fill: '#0E3A4C', stroke: C.water, ink: '#A5E6F8' },
  ];
  const boxes = SPEC.map((sp, k) => {
    const g = G(B), x = BX[k];
    const rect = E('rect', { x: x - BW / 2, y: BY - BH / 2, width: BW, height: BH, rx: 18, fill: sp.fill, stroke: sp.stroke, 'stroke-width': 4 }, g);
    const big = T(g, x, BY + 15, sp.w, { size: 44, weight: 700, anchor: 'middle', fill: sp.ink });
    const tag = T(g, x, BY - BH / 2 + 30, sp.w, { size: 26, weight: 700, anchor: 'middle', fill: sp.stroke });
    const ex = G(g);
    if (sp.ex.length === 2) { T(ex, x, BY + 16, sp.ex[0], { size: 30, weight: 700, anchor: 'middle', fill: C.ink }); T(ex, x, BY + 46, sp.ex[1], { size: 30, weight: 700, anchor: 'middle', fill: C.ink }); }
    else T(ex, x, BY + 30, sp.ex[0], { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    const letter = T(B, x, 0, sp.w[0], { size: 64, weight: 700, anchor: 'middle', fill: sp.ink });
    return { g, rect, big, tag, ex, letter, x, sp };
  });
  const ops = [T(B, 306, BY + 16, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted }), G(B), T(B, 894, BY + 16, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted })];
  arrow(ops[1], 568, BY, 632, BY, { color: C.ink, width: 6 });
  const baseNote = T(B, BX[1], BY + BH / 2 + 36, 'metal oxide or hydroxide', { size: 26, weight: 600, anchor: 'middle', fill: '#9CC8FF' });
  const LY = 360;
  const lOps = [T(B, 306, LY, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted }), G(B), T(B, 894, LY, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted })];
  arrow(lOps[1], 566, LY - 16, 634, LY - 16, { color: C.ink, width: 6 });
  const BOXT = [at('eq') + 0.05, at('eq') + 0.15, mid('eq', 0.34), mid('eq', 0.44)];
  const OPT = [mid('eq', 0.1), mid('eq', 0.32), mid('eq', 0.42)];
  const PULSE = [mid('eq', 0.6), mid('eq', 0.66), mid('eq', 0.71), mid('eq', 0.77), mid('eq', 0.84), mid('eq', 0.89), mid('eq', 0.94)];
  const DROPT = [mid('absw', 0.06), mid('absw', 0.14), mid('absw', 0.22), mid('absw', 0.3)];
  const LPULSE = [mid('absw', 0.5), mid('absw', 0.64), mid('absw', 0.76), mid('absw', 0.9)];
  const EXT = [mid('example', 0.16), mid('example', 0.42), mid('example', 0.66), mid('example', 0.88)];

  /* ================= the flask of acid with universal indicator ================= */
  const flG = G(root), fl = flask(flG, 1, { level: 0.62, liquid: RED, opacity: 0.88 });
  const flIons = G(flG), fr = rng(12);
  const flH = [0, 1, 2, 3].map(() => { const g = miniH(flIons); return { g, p: drifter(fr, -38, 32, 38, 76, 9) }; });
  const flOH = [0, 1].map(() => { const g = miniOH(flIons); return { g, p: drifter(fr, -36, 34, 36, 74, 9) }; });
  const flLab = T(root, 600, 662, 'hydrochloric acid + universal indicator', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // how acidic the flask is: pH 1, then a little alkali (to 4), then too much (to 11)
  const phNow = t => 1 + 3 * P(t, mid('little', 0.34), 1.5) + 7 * P(t, mid('much', 0.04), 2.4);
  const FLASK = { ex: [600, 505, 1.2], ions: [200, 560, 0.9], dish: [330, 452, 1.3] };

  /* ================= C. inside the flask (showpiece) ================= */
  const coneG = G(root), Cg = G(root), CgL = G(root);
  const LX = 730, LYc = 400, LR = 235;
  const cone = E('path', { fill: 'rgba(228,237,242,0.06)', stroke: '#9FB7C6', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, coneG);
  const lensCp = E('clipPath', { id: 'am5lens' }, defs()); E('circle', { cx: LX, cy: LYc, r: LR }, lensCp);
  E('circle', { cx: LX, cy: LYc, r: LR, fill: '#0F3445' }, Cg);
  const inside = G(Cg, { 'clip-path': 'url(#am5lens)' });
  E('circle', { cx: LX, cy: LYc, r: LR + 4, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 7 }, Cg);
  const ir = rng(33), BOXL = [LX - 150, LYc - 150, LX + 150, LYc + 150];
  const spect = [];
  for (let i = 0; i < 3; i++) { const g = G(inside); E('circle', { r: 15, fill: ball('#5FCF7A', '#2F8A4A') }, g); badge(g, 11, -11, false, 6); spect.push({ g, p: drifter(ir, ...BOXL, 8), na: false }); }
  for (let i = 0; i < 3; i++) { const g = G(inside); E('circle', { r: 13, fill: ball('#B8C2CC', '#6E7A86') }, g); badge(g, 10, -10, true, 6); spect.push({ g, p: drifter(ir, ...BOXL, 8), na: true, k: i }); }
  const NP = 5;
  const TIN = [], TM = [];
  for (let k = 0; k < NP; k++) { TIN.push(mid('ions', 0.4 + 0.03 * k)); TM.push(mid('ions', 0.62 + 0.075 * k)); }
  const pairs = [], flashes = [spark(inside, 16, { seed: 1 }), spark(inside, 16, { seed: 2 })];
  for (let k = 0; k < NP; k++) {
    const h = hIon(inside), o = ohIon(inside), w = molH2O(inside, 15, { letter: true }), sp = flashes[k % 2];
    const ph = drifter(ir, ...BOXL, 16), po = drifter(ir, ...BOXL, 16), pw = drifter(ir, ...BOXL, 10);
    const ta = TM[k] - 0.9;
    const oAt = t => { const [x, y] = po(t); return [x, y - 330 * (1 - P(t, TIN[k], 1.0, easeOut))]; };
    const [hx, hy] = ph(ta), [ox, oy] = oAt(ta), M = [(hx + ox) / 2, (hy + oy) / 2];
    pairs.push({ h, o, w, sp, ph, oAt, M, ta, tm: TM[k], pw });
  }
  const legend = G(CgL);
  const LG = [
    { y: 176, icon: g => hIon(g), segs: s => [['H', C.ink, 700], sup('+', C.bad, s), back(' from the acid', C.ink, s, 'sup')], t: mid('ions', 0.18) },
    { y: 236, icon: g => ohIon(g), segs: s => [['OH', C.ink, 700], sup('−', BLUE_T, s), back(' from the alkali', C.ink, s, 'sup')], t: mid('ions', 0.45) },
    { y: 296, icon: g => molH2O(g, 13, { letter: true }), segs: s => [['H', C.ink, 700], sub('2', C.ink, s), back('O: water', C.ink, s, 'sub')], t: mid('ions', 0.74) },
  ].map(o => { const g = G(legend); const ic = G(g); o.icon(ic); tr(ic, 96, o.y - 9); rich(g, 132, o.y, o.segs(30), { size: 30, weight: 600 }); return { g, t: o.t }; });
  const legNote = rich(legend, 72, 350, [['Na', C.muted, 600], sup('+', C.muted, 24), back(' and Cl', C.muted, 24, 'sup'), sup('−', C.muted, 24), back(' stay dissolved', C.muted, 24, 'sup')], { size: 24 });
  const eqL = G(CgL);
  const eqA = rich(eqL, 0, 0, [['H', C.ink, 700], sup('+', C.bad, 36), back(' + OH', C.ink, 36, 'sup'), sup('−', BLUE_T, 36)], { size: 36, weight: 700, anchor: 'end' });
  const eqB = rich(eqL, 0, 0, [['H', C.ink, 700], sub('2', C.ink, 36), back('O', C.ink, 36, 'sub')], { size: 36, weight: 700 });
  eqA.setAttribute('transform', `translate(${LX - 50} 694)`); eqB.setAttribute('transform', `translate(${LX + 50} 694)`);
  arrow(eqL, LX - 34, 682, LX + 34, 682, { color: C.ink, width: 5 });
  // the cone from the flask's liquid to the lens (outer tangents of two circles)
  function coneD(sx, sy, sr) {
    const dx = LX - sx, dy = LYc - sy, d = Math.hypot(dx, dy), th = Math.atan2(dy, dx), ph = Math.acos(clamp((sr - LR) / d, -1, 1));
    const p = (cx, cy, r, a) => (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    return `M${p(sx, sy, sr, th + ph)} L${p(LX, LYc, LR, th + ph)} L${p(LX, LYc, LR, th - ph)} L${p(sx, sy, sr, th - ph)} Z`;
  }

  /* ================= D. the amounts matter ================= */
  const Dg = G(root);
  const drp = dropper(Dg, '#DCEFFA');
  T(drp, 26, -112, 'alkali', { size: 28, weight: 700, fill: BLUE_T });
  const dDrops = []; for (let k = 0; k < 4; k++) dDrops.push(E('path', { d: dropD(1), fill: '#BFE3FA' }, Dg));
  const DT = [mid('little', 0.33), mid('little', 0.4), mid('little', 0.47)];
  for (let k = 0; k < 8; k++) DT.push(mid('much', 0.03 + 0.03 * k));
  const chAcidic = chip(Dg, 'still acidic', { size: 32, fill: ORANGE, color: INK_DK }); tr(chAcidic, 860, 300);
  const chAlk = chip(Dg, 'alkaline', { size: 32, fill: BLUE, color: '#FFFFFF' }); tr(chAlk, 860, 300);
  const chCheck = G(Dg);
  const ccb = chip(chCheck, 'check with an indicator', { size: 30, fill: '#163F2A', stroke: GREEN, color: GREEN });
  const ccTick = tick(chCheck, 15, GREEN); tr(ccTick, -ccb.w / 2 - 30, 0);
  const ghost = G(Dg);
  const ghostR = E('rect', { x: -26, y: -26, width: 52, height: 52, rx: 9, fill: 'none', stroke: GREEN, 'stroke-width': 4, 'stroke-dasharray': '8 6' }, ghost);
  T(ghost, 0, -44, 'pH 7?', { size: 28, weight: 700, anchor: 'middle', fill: GREEN });
  const BAR2 = [560, 540];

  /* ================= E. diluting is not neutralising ================= */
  const Eg = G(root);
  const RX = [320, 880], RY = 410, RW = 220, RH = 240;
  const rb = RX.map(x => { const b = beaker(Eg, RW, RH, { level: 0.42, liquid: C.water, opacity: 0.3 }); tr(b, x, RY); return b; });
  const pourer = G(Eg); const pb2 = beaker(pourer, 100, 110, { level: 0.7, liquid: C.water, opacity: 0.55, marks: false });
  const pourS = E('path', { fill: 'none', stroke: C.water, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.8 }, Eg);
  const er = rng(71);
  const dil = []; for (let i = 0; i < 8; i++) dil.push({ el: E('circle', { r: 10, fill: ball(RED, RED_DK), stroke: RED_DK, 'stroke-width': 1.5 }, Eg), u: [er(), er()] });
  const neu = []; for (let i = 0; i < 6; i++) {
    neu.push({
      a: E('circle', { r: 11, fill: ball(RED, RED_DK), stroke: RED_DK, 'stroke-width': 1.5 }, Eg),
      b: E('circle', { r: 11, fill: ball(BLUE, '#1E4FA8'), stroke: '#1E4FA8', 'stroke-width': 1.5 }, Eg),
      s: E('circle', { r: 12, fill: ball(GREEN, '#2B8F5E'), stroke: '#2B8F5E', 'stroke-width': 1.5 }, Eg),
      w: water(Eg, 10), u: [er(), er()], ub: [er(), er()], tin: mid('reaction', 0.52 + 0.02 * i), tm: mid('reaction', 0.64 + 0.03 * i),
    });
  }
  const rLab = [T(Eg, RX[0], 250, 'diluting', { size: 42, weight: 700, anchor: 'middle', fill: C.air }), T(Eg, RX[1], 250, 'neutralising', { size: 42, weight: 700, anchor: 'middle', fill: GREEN })];
  const rNote = [rich(Eg, RX[0], 596, [['same acid', C.ink, 700], [', just spread out', C.muted]], { size: 28, anchor: 'middle' }),
    rich(Eg, RX[1], 596, [['new substances: ', C.ink], ['salt', GREEN, 800], [' + ', C.ink], ['water', C.water, 800]], { size: 28, anchor: 'middle' })];
  const safeG = G(Eg);
  const safeC = chip(safeG, 'making it ‘safe’', { size: 30, fill: C.card2, stroke: C.line, sw: 2 }); tr(safeC, 600, 156);
  const safeS = strike(safeG, 600 - safeC.w / 2 + 6, 156, 600 + safeC.w / 2 - 6, C.bad);
  // the liquid box of each reaction beaker for a given level
  const liq = (k, lv) => { const top = RY + RH / 2 - (RH - 18) * lv; return [RX[k] - RW / 2 + 22, top + 12, RX[k] + RW / 2 - 22, RY + RH / 2 - 14]; };
  const inBox = (bx, u) => [lerp(bx[0], bx[2], u[0]), lerp(bx[1], bx[3], u[1])];
  const wander = (o, t, k) => [clamp(o[0] + 0.1 * Math.sin(t * 0.7 * calm + k), 0, 1), clamp(o[1] + 0.12 * Math.cos(t * 0.6 * calm + k * 1.3), 0, 1)];

  /* ================= F. lime on acidic soil ================= */
  const Fg = G(root);
  const GROUND = 560;
  E('rect', { x: 60, y: GROUND, width: 1080, height: 150, rx: 14, fill: C.soil, stroke: '#8A6446', 'stroke-width': 2.5 }, Fg);
  { const r = rng(5); let d = ''; for (let i = 0; i < 26; i++) { const x = 90 + r() * 1020, y = GROUND + 24 + r() * 110; d += `M${x.toFixed(1)},${y.toFixed(1)} h0.1 `; } E('path', { d, stroke: '#8E6A4C', 'stroke-width': 7, 'stroke-linecap': 'round' }, Fg); }
  const limeLayer = E('rect', { x: 0, y: GROUND - 4, width: 0, height: 8, rx: 4, fill: '#F4F7FA', opacity: 0.85 }, Fg);
  const SPX = [230, 370, 510, 650, 790, 930];
  const sprouts = SPX.map((x, i) => {
    const g = G(Fg); tr(g, x, GROUND);
    const stem = E('path', { d: 'M0,0 Q-4,-28 0,-56', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const lL = leaf(g, 0.3), lR = leaf(g, 0.3);
    return { g, stem, lL, lR, x, i };
  });
  const farmer = person(Fg, { shirt: '#D9824A', shorts: '#4E6E8E', skin: '#B9825A', hair: '#3A2A1E', shoes: '#2B3A44' });
  const scoop = G(farmer);
  E('path', { d: 'M-14,-8 L14,-8 L10,10 L-10,10 Z', fill: ball('#C9D3DC', '#7D8A96'), stroke: '#E3E9EE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, scoop);
  E('path', { d: 'M-12,-8 Q0,-18 12,-8 Z', fill: '#F4F7FA' }, scoop);
  const specks = []; { const r = rng(9); for (let k = 0; k < 10; k++) specks.push({ el: E('rect', { x: -3, y: -3, width: 6, height: 6, rx: 1.5, fill: '#F4F7FA' }, Fg), ph: k / 10, dx: (r() - 0.5) * 22 }); }
  const limeChip = chip(Fg, 'lime: a base', { size: 32, fill: '#F4F7FA', color: INK_DK }); tr(limeChip, 600, 176);
  const soil5 = chip(Fg, 'pH 5: acidic soil', { size: 28, fill: YELLOW, color: INK_DK }), soil7 = chip(Fg, 'pH 7: crops grow well', { size: 28, fill: GREEN, color: INK_DK });
  tr(soil5, 600, 650); tr(soil7, 600, 650);
  const WALK = [mid('soil', 0.0), mid('soil', 0.9)], WX = [70, 1000];
  // hand position of the front arm (pose armR [64, 20]) in person coordinates
  const HAND = (() => { const a = 64 * Math.PI / 180, b = 84 * Math.PI / 180; return [33 * Math.sin(a) + 33 * Math.sin(b), -146 + 33 * Math.cos(a) + 33 * Math.cos(b)]; })();

  /* ================= G. an indigestion tablet ================= */
  const Gg = G(root);
  const SC = [450, 430];
  const STOM = closedPath([[-8, -212], [-4, -150], [-52, -170], [-132, -122], [-172, -22], [-152, 88], [-72, 160], [48, 166], [136, 112], [186, 32], [226, -10], [256, -18], [256, -62], [206, -58], [152, -30], [92, 0], [46, -32], [32, -112], [32, -212]]);
  const stG = G(Gg); tr(stG, SC[0], SC[1]);
  const stCp = E('clipPath', { id: 'am5stom' }, defs()); E('path', { d: STOM, transform: `translate(${SC[0]} ${SC[1]})` }, stCp);
  E('path', { d: STOM, fill: 'rgba(247,168,200,0.16)' }, stG);
  const acidPool = E('rect', { x: SC[0] - 200, y: SC[1] + 52, width: 480, height: 200, fill: RED, opacity: 0.85, 'clip-path': 'url(#am5stom)' }, Gg);
  const wisps = []; for (let i = 0; i < 4; i++) wisps.push(E('circle', { r: 10, fill: '#F4F7FA', opacity: 0.5, 'clip-path': 'url(#am5stom)' }, Gg));
  const stOut = E('path', { d: STOM, fill: 'none', stroke: '#F28BA8', 'stroke-width': 9, 'stroke-linejoin': 'round', transform: `translate(${SC[0]} ${SC[1]})` }, Gg);
  const stLab = T(Gg, SC[0] - 120, SC[1] - 210, 'stomach', { size: 30, weight: 700, anchor: 'middle', fill: '#F7A8C8' });
  const acidLab = T(Gg, SC[0] - 20, SC[1] + 132, 'stomach acid', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const tablet = G(Gg);
  E('circle', { r: 34, fill: ball('#FFFFFF', '#C9D3DC'), stroke: '#E3E9EE', 'stroke-width': 2 }, tablet);
  E('path', { d: 'M-24,0 L24,0', stroke: '#B8C4CE', 'stroke-width': 4, 'stroke-linecap': 'round' }, tablet);
  const tabChip = chip(Gg, 'indigestion tablet', { size: 32, fill: C.card2, stroke: C.line, sw: 2 }); tr(tabChip, 900, 176);
  const tabLab = G(Gg);
  T(tabLab, 900, 352, 'magnesium hydroxide', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  T(tabLab, 900, 388, 'a base', { size: 28, weight: 700, anchor: 'middle', fill: BLUE_T });
  const tabNote = rich(Gg, 900, 520, [['neutralises', GREEN, 800], [' excess', C.ink]], { size: 30, anchor: 'middle' });
  const tabNote2 = T(Gg, 900, 556, 'stomach acid', { size: 30, weight: 600, anchor: 'middle' });
  const TAB = [900, 262];

  /* ================= update ================= */
  return t => {
    /* ===== A: acid meets base; the pH moves to 7 ===== */
    const aA = Math.min(P(t, S.first - 0.3, 0.3, linear), 1 - P(t, at('eq') - 0.3, 0.3, linear));
    op(A, aA);
    if (aA > 0) {
      const ma = P(t, at('what'), 2.2, easeOut), mb = P(t, at('what') + 0.3, 2.2, easeOut);
      tr(cAcid, lerp(-120, meetX[0], ma), 300); tr(cBase, lerp(1320, meetX[1], mb), 300);
      const g = P(t, mid('what', 0.48), 0.9, linear);
      cAcid.box.setAttribute('fill', mix(RED, GREEN, g)); cBase.box.setAttribute('fill', mix(BLUE, GREEN, g));
      cAcid.label.setAttribute('fill', mix('#FFFFFF', INK_DK, g)); cBase.label.setAttribute('fill', mix('#FFFFFF', INK_DK, g));
      const fp = win(t, mid('what', 0.4), mid('what', 0.4) + 0.9, 0.2); op(flash, fp); tr(flash, 600, 300, 1.2 * fp); flash.upd(t);
      const cp = P(t, mid('what', 0.55), 0.5, easeOut); op(cancel, cp); cancel.setAttribute('transform', `translate(0 ${((1 - cp) * 12).toFixed(1)})`);
    }

    /* ===== the mini pH bar: (what) 1 -> 7; (little, much) follows the flask ===== */
    const bWhat = win(t, mid('what', 0.62), at('eq') - 0.1, 0.35), bDish = win(t, at('little') + 0.3, at('reaction') - 0.15, 0.35);
    op(barG, Math.max(bWhat, bDish));
    if (bWhat > 0 || bDish > 0) {
      const ph = bWhat > 0 ? 1 + 6 * P(t, mid('what', 0.74), 1.5) : phNow(t);
      const [bx, by] = bWhat > 0 ? [300, 500] : BAR2;
      tr(bar, bx, by); tr(ptr, bx + bar.x(ph), by - 4); ptr.set(ph);
    }

    /* ===== B: the equation strip ===== */
    const aB = Math.min(P(t, at('eq') - 0.05, 0.3, linear), 1 - P(t, at('ions') - 0.15, 0.35, linear));
    op(B, aB);
    if (aB > 0) {
      const exOn = EXT.map(x => P(t, x + 0.15, 0.35, linear)), exOff = EXT.map(x => P(t, x, 0.2, linear));
      boxes.forEach((b, k) => {
        const p = P(t, BOXT[k], 0.5, pop);
        const pulse = Math.sin(Math.PI * P(t, PULSE[[0, 2, 4, 6][k]], 0.5, linear)) + Math.sin(Math.PI * P(t, LPULSE[k], 0.5, linear)) * 0.6 + Math.sin(Math.PI * P(t, EXT[k], 0.5, linear)) * 0.6;
        op(b.g, clamp(p * 2));
        b.g.setAttribute('transform', `translate(${b.x} ${BY}) scale(${Math.max(0.01, (0.8 + 0.2 * p) * (1 + 0.08 * pulse)).toFixed(4)}) translate(${-b.x} ${-BY})`);
        op(b.big, 1 - exOff[k]); op(b.tag, exOn[k]); op(b.ex, exOn[k]);
        // A, B, S, W drop out of the boxes
        const dp = P(t, DROPT[k], 0.55, easeIn), la = P(t, DROPT[k], 0.15, linear) * (1 - P(t, at('example') - 0.2, 0.35, linear));
        op(b.letter, la); attr(b.letter, 'y', lerp(BY + 15, LY + 22, dp) - Math.sin(Math.PI * P(t, DROPT[k] + 0.55, 0.3, linear)) * 10);
        const lp = Math.sin(Math.PI * P(t, LPULSE[k], 0.5, linear));
        b.letter.setAttribute('transform', `translate(${b.x} ${LY}) scale(${(1 + 0.18 * lp).toFixed(4)}) translate(${-b.x} ${-LY})`);
      });
      ops.forEach((o, i) => { const p = P(t, OPT[i], 0.4, linear); op(o, p); const pl = Math.sin(Math.PI * P(t, PULSE[[1, 3, 5][i]], 0.45, linear)); o.setAttribute('transform', `translate(${[306, 600, 894][i]} ${BY}) scale(${(1 + 0.2 * pl).toFixed(4)}) translate(${-[306, 600, 894][i]} ${-BY})`); });
      op(baseNote, win(t, mid('eq', 0.08), at('absw') + 0.1, 0.4));
      const lo = P(t, DROPT[3] + 0.3, 0.4, linear) * (1 - P(t, at('example') - 0.2, 0.35, linear));
      lOps.forEach(o => op(o, lo));
    }

    /* ===== the flask ===== */
    const aF = Math.min(P(t, mid('example', 0.1), 0.5, linear), 1 - P(t, at('reaction') - 0.3, 0.35, linear));
    op(flG, aF); op(flLab, aF * (1 - P(t, at('ions') - 0.1, 0.3, linear)));
    if (aF > 0) {
      const toIons = P(t, at('ions') - 0.1, 0.8), toDish = P(t, at('little') - 0.25, 0.8);
      const L3 = i => lerp(lerp(FLASK.ex[i], FLASK.ions[i], toIons), FLASK.dish[i], toDish);
      tr(flG, L3(0), L3(1), L3(2));
      const ph = phNow(t);
      fl.set(0.62, uiColour(ph));
      // ions in the liquid: four H+ at first; a little alkali leaves two (acid left over); too much leaves OH-
      flH.forEach((o, i) => {
        const gone = i < 2 ? P(t, DT[i] + 0.35, 0.3, linear) : P(t, DT[3 + i] + 0.3, 0.3, linear);
        op(o.g, 1 - gone); if (gone < 1) { const [x, y] = o.p(t * calm); tr(o.g, x, y, 0.5); }
      });
      flOH.forEach((o, i) => { const on = P(t, DT[8 + i] + 0.35, 0.35, linear); op(o.g, on); if (on > 0) { const [x, y] = o.p(t * calm); tr(o.g, x, y, 0.5); } });
    }

    /* ===== C: inside the flask ===== */
    const aC = Math.min(P(t, at('ions') + 0.05, 0.4, linear), 1 - P(t, at('little') - 0.25, 0.35, linear));
    op(Cg, aC); op(CgL, aC); op(coneG, aC);
    if (aC > 0) {
      const lensP = P(t, at('ions') + 0.05, 0.7, easeOut);
      Cg.setAttribute('transform', `translate(${LX} ${LYc}) scale(${(0.6 + 0.4 * lensP).toFixed(4)}) translate(${-LX} ${-LYc})`);
      const fx = lerp(FLASK.ex[0], FLASK.ions[0], P(t, at('ions') - 0.1, 0.8)), fy = lerp(FLASK.ex[1], FLASK.ions[1], P(t, at('ions') - 0.1, 0.8)), fs = lerp(FLASK.ex[2], FLASK.ions[2], P(t, at('ions') - 0.1, 0.8));
      cone.setAttribute('d', coneD(fx, fy + 52 * fs, 40 * fs));
      op(cone, P(t, at('ions') + 0.3, 0.4, linear));
      spect.forEach(o => {
        const [x, y] = o.p(t * calm), enter = o.na ? 1 - P(t, TIN[o.k] + 0.1, 1.0, easeOut) : 0;
        tr(o.g, x, y - 330 * enter); op(o.g, 0.5);
      });
      flashes.forEach(f => op(f, 0));
      pairs.forEach(o => {
        const done = t >= o.tm;
        const k = ease(P(t, o.ta, o.tm - o.ta, linear));
        const [hx, hy] = o.ph(t * calm), [ox, oy] = o.oAt(t);
        op(o.h, done ? 0 : 1); op(o.o, done ? 0 : (t > TIN[0] - 0.2 ? 1 : 0));
        if (!done) { tr(o.h, lerp(hx, o.M[0] - 14, k), lerp(hy, o.M[1], k)); tr(o.o, lerp(ox, o.M[0] + 14, k), lerp(oy, o.M[1], k)); }
        const wv = P(t, o.tm, 0.25, linear);
        op(o.w, wv);
        if (wv > 0) { const dtm = (t - o.tm) * calm; tr(o.w, bounce(o.M[0] + o.pw.vx * dtm, BOXL[0], BOXL[2]), bounce(o.M[1] + o.pw.vy * dtm, BOXL[1], BOXL[3]), 1 + 0.25 * Math.sin(Math.PI * P(t, o.tm, 0.4, linear))); }
        const sv = win(t, o.tm - 0.05, o.tm + 0.45, 0.12); if (sv > 0) { op(o.sp, sv); tr(o.sp, o.M[0], o.M[1], 1.1); o.sp.upd(t); }
      });
      LG.forEach(o => { const p = P(t, o.t, 0.45, easeOut); op(o.g, p); o.g.setAttribute('transform', `translate(${((1 - p) * -16).toFixed(1)} 0)`); });
      op(legNote, P(t, mid('ions', 0.9), 0.5, linear));
      op(eqL, P(t, mid('ions', 0.8), 0.5, linear));
    }

    /* ===== D: too little, too much ===== */
    const aD = Math.min(P(t, at('little') + 0.2, 0.35, linear), 1 - P(t, at('reaction') - 0.3, 0.35, linear));
    op(Dg, aD);
    if (aD > 0) {
      const fx = FLASK.dish[0], tipY = FLASK.dish[1] - 97 * FLASK.dish[2] - 22;
      const da = P(t, mid('little', 0.22), 0.4, linear) * (1 - P(t, mid('much', 0.36), 0.4, linear));
      op(drp, da);
      if (da > 0) { tr(drp, fx, tipY - (1 - P(t, mid('little', 0.22), 0.5, easeOut)) * 40); drp.squeeze(Math.max(...DT.map(d => win(t, d - 0.18, d + 0.08, 0.08)))); }
      const surf = FLASK.dish[1] + (92 - 130 * 0.62) * FLASK.dish[2];
      dDrops.forEach(d => op(d, 0));
      DT.forEach((d0, k) => { const u = (t - d0) / 0.32, d = dDrops[k % 4]; if (u > 0 && u < 1) { op(d, 1); tr(d, fx, lerp(tipY + 6, surf - 6, easeIn(u))); } });
      const ca = P(t, mid('little', 0.78), 0.45, pop) * (1 - P(t, mid('much', 0.3), 0.3, linear));
      op(chAcidic, clamp(ca * 2)); tr(chAcidic, 860, 300, Math.max(0.01, 0.8 + 0.2 * clamp(ca)));
      const al = P(t, mid('much', 0.33), 0.45, pop); op(chAlk, clamp(al * 2)); tr(chAlk, 860, 300, Math.max(0.01, 0.8 + 0.2 * al));
      const gh = P(t, mid('much', 0.5), 0.5, linear);
      op(ghost, gh * (0.75 + 0.25 * wave(t, 1.2))); tr(ghost, BAR2[0] + bar.x(7), BAR2[1] + 20); ghostR.setAttribute('stroke-dashoffset', (-t * 14).toFixed(1));
      const ck = P(t, mid('much', 0.8), 0.5, pop); op(chCheck, clamp(ck * 2)); tr(chCheck, 860 + 22, 392, Math.max(0.01, 0.8 + 0.2 * ck));
    }

    /* ===== E: diluting vs neutralising ===== */
    const aE = Math.min(P(t, at('reaction') - 0.05, 0.35, linear), 1 - P(t, at('soil') - 0.3, 0.35, linear));
    op(Eg, aE);
    if (aE > 0) {
      const lvL = 0.42 + 0.43 * P(t, mid('reaction', 0.08), 1.6);
      rb[0].set(lvL); rb[1].set(0.62);
      const pa = win(t, mid('reaction', 0.02), mid('reaction', 0.32), 0.25), tilt = 72 * P(t, mid('reaction', 0.04), 0.5) * (1 - P(t, mid('reaction', 0.27), 0.4));
      op(pourer, pa); tr(pourer, 172, 236, 1, tilt);
      const pon = win(t, mid('reaction', 0.08), mid('reaction', 0.27), 0.1);
      op(pourS, pon * pa);
      if (pon > 0) { const a = tilt * Math.PI / 180, sx = 172 + 54 * Math.cos(a) + 55 * Math.sin(a), sy = 236 + 54 * Math.sin(a) - 55 * Math.cos(a), top = RY + RH / 2 - (RH - 18) * lvL; pourS.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} Q${(sx + 14).toFixed(1)},${(sy + 30).toFixed(1)} ${(sx + 14).toFixed(1)},${top.toFixed(1)}`); }
      const bxL = liq(0, lvL);
      dil.forEach((o, i) => { const [x, y] = inBox(bxL, wander(o.u, t, i)); attr(o.el, 'cx', x); attr(o.el, 'cy', y); });
      const bxR = liq(1, 0.62);
      neu.forEach((o, i) => {
        const [ax, ay] = inBox(bxR, wander(o.u, t, i + 10));
        const fall = P(t, o.tin, 0.7, easeIn), [bx0, by0] = inBox(bxR, wander(o.ub, t, i + 20));
        const meet = P(t, o.tm - 0.45, 0.45), done = t >= o.tm;
        const bx = lerp(bx0, ax + 12, meet), by = lerp(lerp(200, by0, fall), ay, meet);
        attr(o.a, 'cx', ax - 6 * meet); attr(o.a, 'cy', ay);
        op(o.a, done ? 0 : 1); op(o.b, done || t < o.tin ? 0 : 1); attr(o.b, 'cx', bx); attr(o.b, 'cy', by);
        const nv = P(t, o.tm, 0.3, linear);
        op(o.s, nv); op(o.w, nv);
        if (nv > 0) { attr(o.s, 'cx', ax - 12); attr(o.s, 'cy', ay); tr(o.w, ax + 17, ay - 4); }
      });
      rLab.forEach((l, k) => op(l, P(t, k ? mid('reaction', 0.48) : at('reaction'), 0.4, linear)));
      op(rNote[0], P(t, mid('reaction', 0.2), 0.4, linear)); op(rNote[1], P(t, mid('reaction', 0.84), 0.4, linear));
      op(safeG, win(t, mid('reaction', 0.32), mid('reaction', 0.62), 0.25)); safeS.set(P(t, mid('reaction', 0.4), 0.4));
    }

    /* ===== F: lime on acidic soil ===== */
    const aFs = Math.min(P(t, at('soil') - 0.1, 0.35, linear), 1 - P(t, at('antacid') - 0.3, 0.35, linear));
    op(Fg, aFs);
    if (aFs > 0) {
      const wp = P(t, WALK[0], WALK[1] - WALK[0], linear), px = lerp(WX[0], WX[1], wp), walking = wp > 0 && wp < 1;
      tr(farmer, px, GROUND);
      const pose = walkPose(t * calm, 0.9); pose.armR = [64, 20];
      farmer.pose(walking ? pose : { armR: [64, 20] });
      tr(scoop, HAND[0] + 6, HAND[1] + 4, 1, 12);
      attr(limeLayer, 'x', WX[0] + HAND[0]); attr(limeLayer, 'width', Math.max(0, px - WX[0]));
      specks.forEach(s => {
        const u = ((t * 1.6) + s.ph) % 1, ts = t - u / 1.6, on = ts > WALK[0] && ts < WALK[1];
        op(s.el, on ? Math.min(1, u * 6, (1 - u) * 6) : 0);
        if (on) { const sx = lerp(WX[0], WX[1], P(ts, WALK[0], WALK[1] - WALK[0], linear)) + HAND[0] + 6; tr(s.el, sx + s.dx * u, lerp(GROUND + HAND[1] + 14, GROUND - 4, u * u)); }
      });
      const grow = P(t, mid('soil', 0.76), 0.8);
      sprouts.forEach(o => {
        const sway = Math.sin(t * 1.4 * calm + o.i) * 2;
        const droop = 1 - grow;
        tr(o.g, o.x, GROUND, 0.78 + 0.37 * grow, (o.i % 2 ? 1 : -1) * 22 * droop + sway);
        tr(o.lL, 0, -54, 1, lerp(196, 126, droop)); tr(o.lR, 0, -54, 1, lerp(-16, 54, droop));
        o.g.style.opacity = (0.62 + 0.38 * grow).toFixed(3);
      });
      const lc = P(t, mid('soil', 0.12), 0.45, pop); op(limeChip, clamp(lc * 2)); tr(limeChip, 600, 176, Math.max(0.01, 0.8 + 0.2 * lc));
      const s7 = P(t, mid('soil', 0.74), 0.5, linear);
      op(soil5, P(t, mid('soil', 0.5), 0.4, linear) * (1 - s7)); op(soil7, s7);
    }

    /* ===== G: an indigestion tablet ===== */
    const aG = P(t, at('antacid') - 0.1, 0.4, linear);
    op(Gg, aG);
    if (aG > 0) {
      const tc = P(t, mid('antacid', 0.03), 0.45, pop); op(tabChip, clamp(tc * 2)); tr(tabChip, 900, 176, Math.max(0.01, 0.8 + 0.2 * tc));
      op(stLab, P(t, at('antacid') + 0.2, 0.4, linear)); op(acidLab, P(t, at('antacid') + 0.4, 0.4, linear) * (1 - P(t, mid('antacid', 0.5), 0.3, linear)));
      const appear = P(t, mid('antacid', 0.08), 0.45, pop);
      const T0 = mid('antacid', 0.44), drop = P(t, T0, 0.9, easeIn), dis = P(t, T0 + 1.0, 1.6, linear);
      const tx = lerp(TAB[0], SC[0] + 10, drop), ty = lerp(TAB[1], SC[1] + 92, drop) - Math.sin(Math.PI * drop) * 60;
      op(tablet, clamp(appear * 2) * (1 - dis)); tr(tablet, tx, ty, Math.max(0.01, (0.7 + 0.3 * clamp(appear)) * (1 - 0.8 * dis)), drop * 200);
      op(tabLab, P(t, mid('antacid', 0.36), 0.4, linear));
      wisps.forEach((w, i) => { const u = P(t, T0 + 1.0 + i * 0.12, 1.6, easeOut); op(w, u > 0 ? 0.55 * Math.sin(Math.PI * u) : 0); attr(w, 'cx', SC[0] + 10 + Math.cos(i * 1.1) * 110 * u); attr(w, 'cy', SC[1] + 96 + Math.sin(i * 1.7) * 36 * u); attr(w, 'r', 8 + 18 * u); });
      acidPool.setAttribute('fill', mix(RED, ORANGE, P(t, T0 + 1.2, 1.8, linear)));
      op(tabNote, P(t, mid('antacid', 0.72), 0.45, linear)); op(tabNote2, P(t, mid('antacid', 0.76), 0.45, linear));
    }
  };
});

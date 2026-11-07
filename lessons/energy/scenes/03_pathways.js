/* Chapter 3, Four ways energy is transferred.
   Two jars joined by a "transfer pathway", and a four-row legend that builds on the right as each pathway
   gets a vignette: a kick (mechanically), a phone charger (electrically), a hob under a pan (by heating),
   the Sun and a speaker (by radiation) -> the rows reorder and light up M, E, R, H -> stores = where,
   pathways = how -> heat, light, sound and electricity bounce off the jars and settle on the arrows
   -> a kettle: mains to element electrically, then element to water by heating, coming to the boil (showpiece). */
scene('pathways', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a label chip in a pathway's colour */
  const tag = (parent, text, stroke, color) => chip(parent, text, { size: 26, fill: C.card, stroke, sw: 2.5, color: color || C.ink });
  /* pop a group in at (x, y): fades, rises and grows into place as p goes 0 -> 1 */
  const show = (el, p, x, y, s) => { op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, (s || 1) * (0.85 + 0.15 * p)); };
  /* the same for art drawn at its final stage position (no scaling) */
  const rise = (el, p) => { op(el, clamp(p * 2)); tr(el, 0, (1 - clamp(p)) * 14); };
  const leader = (parent, x1, y1, x2, y2, color) => {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 4.5, fill: color }, g);
    return g;
  };
  /* a UK wall socket with a plug in it, centred; the cable leaves the plug's boot at (0, 54) */
  function socket(parent) {
    const g = G(parent);
    E('rect', { x: -58, y: -58, width: 116, height: 116, rx: 16, fill: ball('#F4F7FA', '#B9C6D0'), stroke: '#8FA3B3', 'stroke-width': 3 }, g);
    E('rect', { x: 30, y: -48, width: 18, height: 26, rx: 4, fill: '#DCE3E8', stroke: '#8FA3B3', 'stroke-width': 2 }, g);
    E('rect', { x: 34, y: -44, width: 10, height: 9, rx: 2, fill: C.bad }, g);
    E('rect', { x: -28, y: -30, width: 56, height: 68, rx: 10, fill: ball('#FFFFFF', '#C9D3DC'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-16,-14 L16,-14', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -8, y: 37, width: 16, height: 18, rx: 4, fill: '#DCE6EC' }, g);
    return g;
  }
  /* a phone, about 116 x 212, centred; g.set(charge 0..1) fills its battery icon */
  function phone(parent) {
    const g = G(parent);
    E('rect', { x: -58, y: -106, width: 116, height: 212, rx: 20, fill: ball('#3A4A57', '#141E26'), stroke: '#9AA6B2', 'stroke-width': 3 }, g);
    E('rect', { x: -47, y: -88, width: 94, height: 172, rx: 10, fill: '#0B2230' }, g);
    E('circle', { cx: 0, cy: -97, r: 3.5, fill: '#5D6B78' }, g);
    E('rect', { x: -30, y: -10, width: 54, height: 28, rx: 5, fill: 'none', stroke: '#DCE6EC', 'stroke-width': 3.5 }, g);
    E('rect', { x: 24, y: -2, width: 6, height: 12, rx: 2, fill: '#DCE6EC' }, g);
    const bar = E('rect', { x: -26, y: -6, width: 46, height: 20, rx: 3, fill: C.good }, g);
    g.zap = bolt(g, 0.34); tr(g.zap, 0, -48, 0.34);
    const pct = T(g, 0, 56, '', { size: 24, weight: 700, anchor: 'middle', fill: C.muted });
    g.set = v => { v = clamp(v); attr(bar, 'width', Math.max(3, 46 * v)); bar.setAttribute('fill', v < 0.25 ? C.bad : v < 0.5 ? C.glucose : C.good); setText(pct, Math.round(v * 100) + '%'); };
    g.set(0.15);
    return g;
  }
  /* the loudspeaker and ear of the Sound lesson */
  function speaker(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, k);
    const cone = G(k);
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, cone);
    g.set = dx => tr(cone, dx, 0);
    return g;
  }
  function ear(parent) {
    const g = G(parent);
    g.halo = E('circle', { cx: -6, cy: 0, r: 92, fill: glow(C.energy) }, g);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, g);
    return g;
  }
  /* small rising orange arrows (heat flowing upwards); g.upd(t, on) */
  function heatRise(parent, xs, y0, len) {
    const g = G(parent);
    const as = xs.map(x => { const a = G(g); arrow(a, x, y0, x, y0 - len, { color: C.heat, width: 7, head: 20 }); return a; });
    g.upd = (t, on) => as.forEach((a, k) => { const q = ((t * 0.9 + k / 3) % 1); tr(a, 0, -14 * q * calm); op(a, on * (0.45 + 0.55 * Math.sin(q * Math.PI))); });
    return g;
  }
  const JX = 680, JY = 580;            // the receiving store's jar in every vignette

  /* ---------- shared art: each store's jar and the wall socket are on screen in one place at a time,
     so the beats share them (drawn first, under each beat's sparks, crosses and words) ---------- */
  const gJ = G(root);
  const J = {};
  ['kinetic', 'chemical', 'thermal', 'nuclear'].forEach(k => { J[k] = enJar(gJ, k, { w: 110, h: 150, level: 0.5 }); op(J[k], 0); });
  const sock = socket(gJ); op(sock, 0);
  /* segs: [{ a: beat opacity, p: pop 0..1, x, y, s, lv }]; the first visible one places it */
  const place = (el, segs) => {
    for (const q of segs) if (q.a > 0) {
      op(el, q.a * clamp(q.p * 2)); tr(el, q.x, q.y + (1 - clamp(q.p)) * 14, (q.s || 1) * (0.85 + 0.15 * q.p));
      if (el.set && q.lv !== undefined) el.set(q.lv);
      return;
    }
    op(el, 0);
  };

  /* ================= A. two stores and a transfer pathway ================= */
  const gI = G(root);
  const arcI = arrow(gI, 236, 344, 604, 344, { color: '#FFFFFF', width: 8, bend: -150 });
  const qb = (u, a, c, b) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * c + u * u * b;
  const arcPts = [[212, 410], [222, 356]];
  for (let i = 0; i <= 10; i++) { const u = i / 10; arcPts.push([qb(u, 236, 420, 604), qb(u, 344, 194, 344) - 14]); }
  arcPts.push([618, 356], [628, 470]);
  const flowI = enSparkFlow(gI, arcPts, { n: 5, r: 11, speed: 300, seed: 3 });
  const chipI = tag(gI, 'transfer pathway', '#FFFFFF'); tr(chipI, 420, 345);

  /* ================= the legend: four rows that build up ================= */
  const LEG = G(root);
  const LX = 830, LY = 150, LW = 340, LH = 440, LCX = LX + LW / 2, LCY = LY + LH / 2;
  card(LEG, LX, LY, LW, LH, { fill: C.card, stroke: C.line });
  const legHead = G(LEG);
  const headDisc = G(legHead); tr(headDisc, LX + 50, LY + 52);
  E('circle', { r: 25, fill: C.energy }, headDisc);
  T(headDisc, 0, 11, '4', { size: 32, weight: 700, anchor: 'middle', fill: C.bg0 });
  T(legHead, LX + 88, LY + 63, 'pathways', { size: 32, weight: 700 });
  const LINES = ['mech', 'elec', 'heating', 'rad'];
  const KINDS = ['mech', 'elec', 'heat', 'rad'], LETTERS = ['M', 'E', 'H', 'R'];
  const PCOL = { mech: '#FFFFFF', elec: C.energy, heat: C.heat, rad: C.energy };
  const Y0 = [280, 360, 440, 520], Y1 = [280, 360, 520, 440];      // build order, then M, E, R, H order
  const rows = KINDS.map((kind, k) => {
    const g = G(LEG);
    const bg = E('rect', { x: 12, y: -34, width: LW - 24, height: 68, rx: 16, fill: C.card2, stroke: PCOL[kind], 'stroke-width': 2.5 }, g);
    const disc = E('circle', { cx: 36, cy: 0, r: 22, fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, g);
    const dot = E('circle', { cx: 36, cy: 0, r: 6, fill: PCOL[kind] }, g);
    const letG = G(g); tr(letG, 36, 0);
    E('circle', { r: 22, fill: C.energy }, letG);
    T(letG, 0, 10, LETTERS[k], { size: 28, weight: 800, anchor: 'middle', fill: C.bg0 });
    const bar = E('rect', { x: 76, y: -9, width: 230, height: 18, rx: 9, fill: C.card2 }, g);
    const ic = G(g); tr(ic, 102, 0, 0.55);
    const pw = kind === 'mech' ? enPathway(ic, 'mech', 0, 0, 70, 0, { label: false, width: 7 })
      : enPathway(ic, kind, -60, 0, 60, 0, { label: false, wave: 'light', width: kind === 'heat' ? 8 : undefined });
    const lab = T(g, 150, 9, EN.pathLabel[kind], { size: 26, weight: 700 });
    return { g, bg, disc, dot, letG, bar, pw, lab, kind };
  });
  const MERH = [0, 1, 3, 2];          // rows in M, E, R, H order

  /* ================= B. mechanically ================= */
  const gM = G(root);
  // B1. a force moving something: pushing, pulling, stretching
  const gMA = G(gM);
  const mTitle = T(gMA, 425, 188, 'mechanically', { size: 50, weight: 700, anchor: 'middle' });
  const mSub = rich(gMA, 425, 240, [['by a ', C.muted], ['force', C.ink, 800], [' moving something', C.muted]], { size: 30, anchor: 'middle' });
  function crate(g, x) {
    E('rect', { x, y: -26, width: 52, height: 48, rx: 5, fill: ball('#C8955F', '#7A5230'), stroke: '#5A3B22', 'stroke-width': 3 }, g);
    E('path', { d: `M${x + 5},-21 L${x + 47},17 M${x + 47},-21 L${x + 5},17`, stroke: '#8A5E36', 'stroke-width': 3 }, g);
  }
  const pics = [
    { x: 175, text: 'pushing', draw: g => {
      const mv = G(g); crate(mv, 0); tr(_enHand(mv), -17, 0);
      arrow(g, -40, -50, 46, -50, { color: '#FFFFFF', width: 5 });
      return t => tr(mv, 10 * wave(t * calm, 1.4), 0);
    } },
    { x: 425, text: 'pulling', draw: g => {
      const mv = G(g); crate(mv, -64);
      E('line', { x1: -12, y1: -2, x2: 24, y2: -2, stroke: '#E2C99A', 'stroke-width': 4, 'stroke-linecap': 'round' }, mv);
      tr(_enHand(mv), 41, 0, '-1 1');
      arrow(g, -44, -50, 42, -50, { color: '#FFFFFF', width: 5 });
      return t => tr(mv, 10 * wave(t * calm, 1.4, 0.3), 0);
    } },
    { x: 675, text: 'stretching', draw: g => {
      const sp = E('path', { fill: 'none', stroke: C.lactic, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
      const ends = [-1, 1].map(s => { const e = G(g); E('circle', { r: 7, fill: '#FFFFFF' }, e); arrow(e, s * 10, 0, s * 42, 0, { color: '#FFFFFF', width: 5 }); return e; });
      return t => {
        const half = 32 + 12 * wave(t * calm, 1.6, 0.1);
        let d = ''; for (let i = 0; i <= 10; i++) d += (i ? 'L' : 'M') + (-half + i * half / 5).toFixed(1) + ',' + (i === 0 || i === 10 ? 0 : i % 2 ? -13 : 13);
        sp.setAttribute('d', d);
        tr(ends[0], -half, 0); tr(ends[1], half, 0);
      };
    } },
  ].map(p => {
    const g = G(gMA); tr(g, p.x, 410);
    card(g, -105, -95, 210, 190, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -12, 1.25);
    const anim = p.draw(art);
    T(g, 0, 72, p.text, { size: 28, weight: 700, anchor: 'middle' });
    return { g, x: p.x, anim };
  });
  // B2. kick a ball
  const gMB = G(gM);
  E('rect', { x: 60, y: 470, width: 740, height: 6, rx: 3, fill: '#2E6B4A' }, gMB);
  let grass = '';
  for (let x = 74; x < 800; x += 38) grass += `M${x},471 l-5,-11 M${x + 6},471 l2,-13 M${x + 12},471 l6,-9 `;
  E('path', { d: grass, stroke: '#3FA463', 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, gMB);
  const kid = person(gMB, { shirt: '#5B8DEF' }); tr(kid, 170, 470, 1.2);
  const forceA = arrow(gMB, 300, 436, 500, 318, { color: '#FFFFFF', width: 8 });
  const chipM = tag(gMB, 'mechanically', '#FFFFFF'); tr(chipM, 470, 432);
  const flowM = enSparkFlow(gMB, [[300, 436], [500, 318], [580, 346], [650, 430], [680, 500], [680, 560]], { n: 5, r: 10, speed: 300, seed: 7 });
  const speedG = G(gMB);
  [-11, 0, 11].forEach((y, i) => E('line', { x1: -34, y1: y, x2: -34 - [34, 52, 34][i], y2: y, stroke: '#DCE6EC', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, speedG));
  const ballG = G(gMB), spin = G(ballG);
  E('circle', { r: 24, fill: ball('#FFFFFF', '#AEBAC4'), stroke: '#6F8B9B', 'stroke-width': 2 }, spin);
  E('path', { d: 'M0,-8 L7.6,-2.5 L4.7,6.5 L-4.7,6.5 L-7.6,-2.5 Z', fill: '#22313B' }, spin);
  E('path', { d: 'M0,-8 L0,-17 M7.6,-2.5 L16,-6 M4.7,6.5 L10,14 M-4.7,6.5 L-10,14 M-7.6,-2.5 L-16,-6', stroke: '#22313B', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, spin);
  E('path', { d: 'M-6,-23 A24,24 0 0 1 6,-23 L0,-17 Z M23,-7 A24,24 0 0 1 20,10 L16,-6 Z M-20,10 A24,24 0 0 1 -23,-7 L-16,-6 Z', fill: '#22313B' }, spin);
  const BX = 280, BY = 446, FL = 1.25;
  const tK = mid('mech', 0.6);
  const STAND = { lean: 0, armL: [8, 10], armR: [-8, 10], legL: [3, -3], legR: [-3, -3] };
  const WIND = { lean: 4, armL: [-30, 20], armR: [30, 20], legL: [3, -3], legR: [-40, -75] };
  const HIT = { lean: -8, armL: [35, 20], armR: [-40, 25], legL: [-6, -4], legR: [40, -5] };
  const FOLLOW = { lean: -10, armL: [40, 20], armR: [-45, 25], legL: [-8, -4], legR: [72, 0] };
  const mixPose = (a, b, k) => {
    const L = (u, v) => [lerp(u[0], v[0], k), lerp(u[1], v[1], k)];
    return { lean: lerp(a.lean, b.lean, k), armL: L(a.armL, b.armL), armR: L(a.armR, b.armR), legL: L(a.legL, b.legL), legR: L(a.legR, b.legR) };
  };
  const kickPose = t => {
    let p = mixPose(STAND, WIND, P(t, tK - 0.75, 0.5));
    p = mixPose(p, HIT, P(t, tK - 0.16, 0.16, easeIn));
    p = mixPose(p, FOLLOW, P(t, tK, 0.22, easeOut));
    return mixPose(p, STAND, P(t, tK + 0.6, 0.6));
  };
  const ballAt = t => {
    const tau = t - tK;
    if (tau <= 0) return { x: BX, y: BY, rot: 0, ang: 0, a: 1, fly: 0 };
    const u = tau / FL, x = BX + 560 * u, y = BY - 120 * Math.sin(0.9 * Math.PI * u);
    return { x, y, rot: tau * 900, ang: Math.atan2(-120 * 0.9 * Math.PI * Math.cos(0.9 * Math.PI * u), 560) * 180 / Math.PI, a: 1 - clamp((u - 0.72) / 0.22), fly: 1 };
  };

  /* ================= C. electrically ================= */
  const gE = G(root);
  const mainsE = T(gE, 130, 208, 'mains', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cableE = wire(gE, [[130, 345], [130, 430], [680, 430], [680, 394]], { width: 7, color: '#DCE6EC', spacing: 44, dot: 6 });
  const cableLine = cableE.querySelector('path'); cableLine.setAttribute('pathLength', 1); cableLine.setAttribute('stroke-dasharray', '1 1');
  const phoneE = phone(gE); tr(phoneE, 680, 286);
  const chipE = tag(gE, 'electrically', C.energy); tr(chipE, 400, 476);

  /* ================= D. by heating ================= */
  const gH = G(root);
  const cooker = G(gH);
  E('rect', { x: 210, y: 500, width: 340, height: 66, rx: 8, fill: '#22303A', stroke: '#4B5865', 'stroke-width': 2 }, cooker);
  [270, 340, 410].forEach(x => { E('circle', { cx: x, cy: 533, r: 12, fill: ball('#C9D3DC', '#6F7D88') }, cooker); E('line', { x1: x, y1: 523, x2: x, y2: 531, stroke: '#3A444E', 'stroke-width': 3, 'stroke-linecap': 'round' }, cooker); });
  E('rect', { x: 470, y: 525, width: 56, height: 18, rx: 4, fill: '#0B2230', stroke: '#4B5865', 'stroke-width': 1.5 }, cooker);
  E('rect', { x: 200, y: 476, width: 360, height: 26, rx: 6, fill: '#33414C', stroke: '#6F8B9B', 'stroke-width': 2 }, cooker);
  const ringGlow = E('ellipse', { cx: 383, cy: 472, rx: 150, ry: 44, fill: glow('#FF6A2B') }, gH);
  E('rect', { x: 296, y: 467, width: 174, height: 11, rx: 5, fill: '#FF5A2A', stroke: '#FFB38A', 'stroke-width': 2 }, gH);
  const pan = G(gH);
  E('rect', { x: 168, y: 381, width: 134, height: 15, rx: 7, fill: '#3A444E', stroke: '#8A95A0', 'stroke-width': 2 }, pan);
  E('rect', { x: 304, y: 372, width: 158, height: 92, fill: 'rgba(150,170,185,0.16)' }, pan);
  const waterH = E('rect', { x: 305, y: 400, width: 156, height: 63, fill: C.water, opacity: 0.6 }, pan);
  const warmH = E('rect', { x: 305, y: 400, width: 156, height: 63, fill: C.heat }, pan); op(warmH, 0);
  E('rect', { x: 305, y: 398, width: 156, height: 4, fill: '#FFFFFF', opacity: 0.35 }, pan);
  const riseH = heatRise(pan, [338, 383, 428], 466, 54);
  E('path', { d: 'M300,372 L300,460 Q300,468 310,468 L456,468 Q466,468 466,460 L466,372', fill: 'none', stroke: '#B5C0CA', 'stroke-width': 8, 'stroke-linejoin': 'round' }, pan);
  E('path', { d: 'M291,372 L306,372 M460,372 L475,372', stroke: '#B5C0CA', 'stroke-width': 8, 'stroke-linecap': 'round' }, pan);
  const steamH = heatWaves(gH, { n: 3, h: 52, spacing: 34, color: C.heat, width: 4 }); tr(steamH, 383, 366);
  const hotT = G(gH); tag(hotT, 'hotter', '#FF5A2A', '#FF9B7A');
  const hotL = leader(gH, 178, 512, 294, 474, '#FF5A2A');
  const coldT = G(gH); tag(coldT, 'colder', C.water, C.water);
  const coldL = leader(gH, 166, 432, 300, 420, C.water);
  const chipH = tag(gH, 'by heating', C.heat); tr(chipH, 610, 372);
  const heatL = leader(gH, 530, 380, 446, 424, C.heat);

  /* ================= E. by radiation ================= */
  const gR = G(root);
  const sunR = sun(gR, 44); tr(sunR, 140, 262);
  const warmR = E('ellipse', { cx: 650, cy: 330, rx: 96, ry: 130, fill: glow(C.heat) }, gR); op(warmR, 0);
  const youR = person(gR, { shirt: '#56D69B' }); tr(youR, 650, 425, '-1 1');
  const lightR = enPathway(gR, 'rad', 205, 240, 586, 262, { wave: 'light', label: 'light', side: -1 });
  const irR = enPathway(gR, 'rad', 212, 292, 586, 318, { wave: 'ir', label: 'infrared', side: 1 });
  const warmChip = tag(gR, 'warms you', C.heat); tr(warmChip, 650, 460);
  const spkR = speaker(gR, 0.85); tr(spkR, 150, 584);
  const earR = ear(gR); tr(earR, 654, 584);
  const soundR = enPathway(gR, 'rad', 212, 584, 584, 584, { wave: 'sound', label: 'sound', side: -1 });

  /* ================= F. stores = where, pathways = how; heat, light, sound, electricity ================= */
  const gW = G(root);
  const divider = E('line', { x1: 600, y1: 150, x2: 600, y2: 680, stroke: C.line, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '2 14' }, gW);
  const hL = G(gW), hR = G(gW);
  T(hL, 320, 196, 'Stores', { size: 48, weight: 700, anchor: 'middle' });
  const subL = rich(hL, 320, 246, [['= ', C.muted], ['where', C.energy, 800], [' energy is held', C.muted]], { size: 30, anchor: 'middle' });
  T(hR, 880, 196, 'Pathways', { size: 48, weight: 700, anchor: 'middle' });
  const subR = rich(hR, 880, 246, [['= ', C.muted], ['how', C.energy, 800], [' it moves', C.muted]], { size: 30, anchor: 'middle' });
  const WJ = [['kinetic', 110, 0.55], ['chemical', 240, 0.75], ['thermal', 370, 0.45], ['nuclear', 512, 0.65]].map(([kind, x, lv]) => {
    const x_ = cross(gW, 26); op(x_, 0);
    return { kind, x, lv, x_ };
  });
  const WY = [315, 410, 505, 615];
  const WR = ['mech', 'elec', 'rad', 'heat'].map((kind, k) => {
    const g = G(gW);
    const pw = enPathway(g, kind, 690, WY[k], 900, WY[k], { label: false, wave: 'light' });
    const lab = T(g, 920, WY[k] + 9, EN.pathLabel[kind], { size: 26, weight: 700 });
    return { g, pw, lab };
  });
  // the four words: [text, jar they bounce off, row, landing x]
  const WORDS = [['heat', 2, 3, 720], ['light', 1, 2, 735], ['sound', 0, 2, 852], ['electricity', 3, 1, 780]].map(([text, jar, row, lx], k) => {
    const g = G(gW); const c = chip(g, text, { size: 26, fill: C.card2, stroke: C.line, sw: 2.5 });
    const tk = tick(g, 10, C.good); tr(tk, c.w / 2 - 6, -c.h / 2 + 2);
    const jx = WJ[jar].x;
    return { g, c, tk, jar, hx: jx, hy: k % 2 ? 300 : 294, lx, ly: WY[row] - 34 };
  });
  const NAMED = [0.03, 0.1, 0.18, 0.29];

  /* ================= G. the kettle (showpiece) ================= */
  const gK = G(root);
  E('rect', { x: 40, y: 602, width: 1120, height: 16, rx: 5, fill: '#2A4A5E' }, gK);
  E('rect', { x: 40, y: 602, width: 1120, height: 3, fill: '#4F7C94' }, gK);
  const mainsK = T(gK, 110, 294, 'mains', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cableK = wire(gK, [[110, 432], [110, 588], [346, 588]], { width: 7, color: '#DCE6EC', spacing: 40, dot: 6 });
  E('rect', { x: 330, y: 570, width: 300, height: 31, rx: 10, fill: ball('#3A4A57', '#1B2730'), stroke: '#6F8B9B', 'stroke-width': 2 }, gK);
  const lamp = E('circle', { cx: 604, cy: 586, r: 5, fill: '#33414C' }, gK);
  const BODY = 'M350,546 Q350,568 372,568 L588,568 Q610,568 610,546 L590,262 L370,262 Z';
  const kc = E('clipPath', { id: 'enPwKettle' }, defs()); E('path', { d: BODY }, kc);
  E('path', { d: 'M362,296 Q290,300 294,410 Q298,488 356,500', fill: 'none', stroke: '#5D6B78', 'stroke-width': 20, 'stroke-linecap': 'round' }, gK);
  E('path', { d: 'M362,296 Q290,300 294,410 Q298,488 356,500', fill: 'none', stroke: '#8FA3B3', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.5 }, gK);
  E('path', { d: BODY, fill: GLASS.fill }, gK);
  const waterK = E('rect', { x: 340, y: 330, width: 280, height: 240, fill: C.water, opacity: 0.5, 'clip-path': 'url(#enPwKettle)' }, gK);
  const warmK = E('rect', { x: 340, y: 330, width: 280, height: 240, fill: C.heat, 'clip-path': 'url(#enPwKettle)' }, gK); op(warmK, 0);
  E('rect', { x: 340, y: 328, width: 280, height: 4, fill: '#FFFFFF', opacity: 0.4, 'clip-path': 'url(#enPwKettle)' }, gK);
  const bubK = bubbles(gK, 386, 350, 188, 172, { n: 11, r: 7, seed: 13, speed: 0.55 });
  const coilHalo = E('ellipse', { cx: 480, cy: 540, rx: 140, ry: 52, fill: glow('#FF6A2B') }, gK); op(coilHalo, 0);
  const COIL = [[392, 568], [392, 540]];
  for (let i = 1; i <= 10; i++) COIL.push([392 + i * 17.6, i === 10 ? 540 : (i % 2 ? 526 : 552)]);
  COIL.push([568, 568]);
  const coil = E('path', { d: 'M' + COIL.map(p => p.join(',')).join(' L'), fill: 'none', stroke: '#8A95A0', 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gK);
  const coilDots = wire(gK, COIL, { color: 'rgba(0,0,0,0)', dot: 4.5, spacing: 30 });
  const riseK = heatRise(gK, [432, 480, 528], 512, 66);
  E('path', { d: BODY, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, gK);
  E('rect', { x: 572, y: 300, width: 7, height: 210, rx: 3.5, fill: GLASS.shine, transform: 'rotate(-4 575 400)' }, gK);
  E('path', { d: 'M586,292 L642,252 Q648,248 641,244 L580,268 Z', fill: GLASS.fill, stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, gK);
  E('path', { d: 'M368,264 Q480,222 592,264 Z', fill: ball('#B5C0CA', '#6B7884'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, gK);
  E('rect', { x: 466, y: 226, width: 28, height: 14, rx: 6, fill: '#3A444E' }, gK);
  const steam = [0, 1, 2, 3].map(() => E('circle', { r: 10, fill: '#F2F7FA' }, gK));
  const chipEK = tag(gK, 'electrically', C.energy); tr(chipEK, 225, 540);
  const elemL = G(gK);
  leader(elemL, 646, 541, 572, 543, C.muted);
  T(elemL, 656, 550, 'heating element', { size: 26, weight: 600 });
  const chipHK = tag(gK, 'by heating', C.heat); tr(chipHK, 728, 452);
  const heatLK = leader(gK, 647, 452, 548, 474, C.heat);
  const capK = T(gK, 965, 312, "the water's", { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  return t => {
    /* --- A: two stores, one pathway --- */
    const aI = win(t, S.first - 0.5, at('mech') - 0.05, 0.3);
    op(gI, aI);
    const flI = P(t, mid('pathway', 0.2), 1.6, linear);
    if (aI > 0) {
      arcI.set(P(t, mid('pathway', 0.12), 0.8));
      show(chipI, popIn(t, mid('pathway', 0.3)), 420, 345);
      flowI.set(t, P(t, mid('pathway', 0.18), 0.5, linear));
    }

    /* --- the legend --- */
    const aL = P(t, mid('pathway', 0.6), 0.45, linear) * (1 - P(t, at('where') - 0.3, 0.4, linear));
    op(LEG, aL);
    if (aL > 0) {
      const mv = P(t, at('merh') - 0.35, 0.9), s = lerp(1, 1.22, mv);
      LEG.setAttribute('transform', `translate(${lerp(LCX, 600, mv).toFixed(1)} ${lerp(LCY, 392, mv).toFixed(1)}) scale(${s.toFixed(4)}) translate(${-LCX} ${-LCY})`);
      const hp = popIn(t, mid('pathway', 0.66)); tr(headDisc, LX + 50, LY + 52, Math.max(0.01, hp));
      const sw = P(t, at('merh') + 0.05, 0.8);
      rows.forEach((r, k) => {
        const line = LINES[k], tf = at(line) + 0.1;
        const dx = k === 2 ? 40 * Math.sin(Math.PI * sw) : k === 3 ? -40 * Math.sin(Math.PI * sw) : 0;
        tr(r.g, LX + dx, lerp(Y0[k], Y1[k], sw));
        const next = k < 3 ? at(LINES[k + 1]) : at('merh');
        op(r.bg, win(t, at(line) - 0.1, next - 0.1, 0.3));
        const f = P(t, tf, 0.4, linear);
        op(r.bar, 1 - f); op(r.lab, P(t, tf + 0.25, 0.4, linear)); op(r.dot, f);
        r.pw.set(P(t, tf, 0.8)); op(r.pw, f > 0 ? 1 : 0); r.pw.upd(t * calm);
        const m = MERH.indexOf(k), lp = popIn(t, mid('merh', 0.2 + m * 0.06), 0.45);
        op(r.letG, clamp(lp * 2)); tr(r.letG, 36, 0, Math.max(0.01, lp));
        const pulse = Math.sin(Math.PI * P(t, mid('merh', 0.45 + m * 0.13), 0.5, linear));
        r.lab.setAttribute('fill', pulse > 0.05 ? C.energy : C.ink);
      });
    }

    /* --- B: mechanically --- */
    const aM = win(t, at('mech') - 0.15, at('elec') - 0.05, 0.3), mB = P(t, mid('mech', 0.48), 0.35, linear);
    op(gM, aM);
    if (aM > 0) {
      const aMA = 1 - P(t, mid('mech', 0.5), 0.35, linear);
      op(gMA, aMA);
      if (aMA > 0) {
        rise(mTitle, popIn(t, at('mech') - 0.05)); op(mSub, P(t, mid('mech', 0.12), 0.5, linear));
        pics.forEach((p, i) => { show(p.g, popIn(t, mid('mech', [0.3, 0.36, 0.44][i]) - 0.1), p.x, 410); p.anim(t); });
      }
      op(gMB, mB);
      if (mB > 0) {
        kid.pose(kickPose(t));
        const b = ballAt(t);
        tr(ballG, b.x, b.y); tr(spin, 0, 0, 1, b.rot); op(ballG, b.a);
        tr(speedG, b.x, b.y, 1, b.ang); op(speedG, b.fly * b.a * 0.9);
        forceA.set(P(t, tK - 0.04, 0.3)); op(forceA, P(t, tK - 0.04, 0.1, linear));
        show(chipM, popIn(t, tK + 0.3), 470, 432);
        flowM.set(t - tK, P(t, tK, 0.3, linear) * (1 - P(t, tK + 2.6, 0.6, linear)));
      }
    }

    /* --- C: electrically --- */
    const aE = win(t, at('elec') - 0.15, at('heating') - 0.05, 0.3);
    op(gE, aE);
    const chE = 0.15 + 0.72 * P(t, mid('elec', 0.5), 3.2, linear);
    if (aE > 0) {
      show(phoneE, popIn(t, at('elec') + 0.1), 680, 286);
      op(mainsE, P(t, at('elec') + 0.2, 0.4, linear));
      cableLine.setAttribute('stroke-dashoffset', (1 - P(t, at('elec') + 0.15, 0.8)).toFixed(4));
      cableE.set(P(t, mid('elec', 0.12), 0.4, linear)); cableE.upd(t * calm, 90);
      show(chipE, popIn(t, at('elec') + 0.35), 400, 476);
      phoneE.set(chE);
      op(phoneE.zap, P(t, mid('elec', 0.45), 0.3, linear) * (0.55 + 0.45 * wave(t, 0.9)));
    }

    /* --- D: by heating --- */
    const aH = win(t, at('heating') - 0.15, at('rad') - 0.05, 0.3);
    op(gH, aH);
    const hv = P(t, mid('heating', 0.42), 2.8, linear);
    if (aH > 0) {
      op(ringGlow, 0.7 + 0.3 * wave(t, 1.3));
      show(chipH, popIn(t, at('heating') + 0.25), 610, 372); op(heatL, P(t, at('heating') + 0.45, 0.4, linear));
      riseH.upd(t, P(t, mid('heating', 0.2), 0.5, linear));
      show(hotT, popIn(t, mid('heating', 0.38)), 120, 520); op(hotL, P(t, mid('heating', 0.38) + 0.2, 0.4, linear));
      show(coldT, popIn(t, mid('heating', 0.6)), 110, 440); op(coldL, P(t, mid('heating', 0.6) + 0.2, 0.4, linear));
      op(warmH, 0.4 * hv);
      steamH.upd(t * calm); op(steamH, P(t, mid('heating', 0.75), 0.6, linear) * 0.9);
    }

    /* --- E: by radiation --- */
    const aR = win(t, at('rad') - 0.15, at('merh') + 0.15, 0.3);
    op(gR, aR);
    if (aR > 0) {
      sunR.upd(t * calm); show(sunR, popIn(t, at('rad') - 0.05), 140, 262);
      op(youR, P(t, at('rad') + 0.1, 0.4, linear));
      lightR.set(P(t, mid('rad', 0.27), 0.7)); lightR.upd(t);
      irR.set(P(t, mid('rad', 0.34), 0.7)); irR.upd(t);
      const warm = P(t, mid('rad', 0.5), 1.2, linear);
      op(warmR, warm * (0.75 + 0.25 * wave(t, 1.6)));
      show(warmChip, popIn(t, mid('rad', 0.56)), 650, 460);
      const sp = popIn(t, mid('rad', 0.38));
      show(spkR, sp, 150, 584); show(earR, popIn(t, mid('rad', 0.41)), 654, 584);
      soundR.set(P(t, mid('rad', 0.43), 0.7)); soundR.upd(t);
      spkR.set(3.5 * Math.sin(t * 28) * P(t, mid('rad', 0.42), 0.3, linear) * calm);
      op(earR.halo, P(t, mid('rad', 0.78), 0.5, linear) * (0.7 + 0.3 * wave(t, 0.7)));
    }

    /* --- F: stores vs pathways, then the four words --- */
    const aW = win(t, at('where') - 0.2, at('kettle') - 0.1, 0.35);
    op(gW, aW);
    if (aW > 0) {
      attr(divider, 'y2', lerp(150, 680, P(t, at('where') + 0.05, 0.7)));
      rise(hL, popIn(t, mid('where', 0.2))); op(subL, P(t, mid('where', 0.32), 0.4, linear));
      rise(hR, popIn(t, mid('where', 0.56))); op(subR, P(t, mid('where', 0.69), 0.4, linear));
      WR.forEach((r, k) => {
        const p = P(t, mid('where', 0.6 + k * 0.07), 0.7);
        r.pw.set(p); op(r.pw, p > 0 ? 1 : 0); r.pw.upd(t * calm); op(r.lab, P(t, mid('where', 0.6 + k * 0.07) + 0.4, 0.4, linear));
      });
      // words: appear as named, drop into a jar, bounce off it (cross), hover, then fly to their pathway (tick)
      const pulse = Math.sin(Math.PI * P(t, mid('notstores', 0.47), 0.6, linear));
      WORDS.forEach((w, k) => {
        const t0 = mid('notstores', NAMED[k]), tb = t0 + 0.38, tf = mid('notstores', 0.6 + k * 0.07);
        const appear = popIn(t, t0 - 0.1, 0.4);
        let x = w.hx, y;
        if (t < tb) y = lerp(w.hy, 372, easeIn(P(t, t0, 0.38, linear)));
        else y = lerp(372, w.hy, P(t, tb, 0.45, easeOut));
        const fp = P(t, tf, 0.75);
        if (fp > 0) {
          const cx = (w.hx + w.lx) / 2, cy = Math.min(w.hy, w.ly) - 130, q = 1 - fp;
          x = q * q * w.hx + 2 * q * fp * cx + fp * fp * w.lx; y = q * q * w.hy + 2 * q * fp * cy + fp * fp * w.ly;
        }
        op(w.g, clamp(appear * 2)); tr(w.g, x, y, 0.8 + 0.2 * clamp(appear));
        const jx = WJ[w.jar];
        const xp = popIn(t, tb, 0.4);
        op(jx.x_, clamp(xp * 2)); tr(jx.x_, jx.x, 450, Math.max(0.01, xp) * (1 + 0.18 * pulse));
        const land = popIn(t, tf + 0.7, 0.4);
        op(w.tk, clamp(land * 2)); tr(w.tk, w.c.w / 2 - 6, -w.c.h / 2 + 2, Math.max(0.01, land));
        w.c.box.setAttribute('stroke', land > 0.5 ? C.good : C.line);
      });
    }

    /* --- G: the kettle --- */
    const aK = P(t, at('kettle') - 0.15, 0.4, linear);
    op(gK, aK);
    const fillK = P(t, mid('water', 0.4), 2.6, linear);
    if (aK > 0) {
      op(mainsK, P(t, mid('kettle', 0.66), 0.4, linear));
      const on = P(t, mid('kettle', 0.48), 0.4, linear);
      cableK.set(on); cableK.upd(t * calm, 95);
      op(lamp, 1); lamp.setAttribute('fill', on > 0.5 ? C.water : '#33414C');
      show(chipEK, popIn(t, mid('kettle', 0.52)), 225, 540);
      coilDots.set(P(t, mid('kettle', 0.72), 0.4, linear)); coilDots.upd(t * calm, 70);
      op(elemL, P(t, mid('kettle', 0.8), 0.4, linear));
      const hot = P(t, at('water') - 0.15, 1.0, linear);
      coil.setAttribute('stroke', _enMix('#8A95A0', '#FF6A2B', hot));
      op(coilHalo, hot * (0.8 + 0.2 * wave(t, 1.1)));
      riseK.upd(t, P(t, mid('water', 0.12), 0.5, linear));
      show(chipHK, popIn(t, mid('water', 0.3)), 728, 452); op(heatLK, P(t, mid('water', 0.3) + 0.2, 0.4, linear));
      op(capK, P(t, at('water') + 0.25, 0.4, linear));
      op(warmK, 0.26 * fillK);
      bubK.upd(t, clamp(fillK * 1.6 - 0.2));
      const st = P(t, mid('water', 0.8), 0.8, linear);
      steam.forEach((pf, i) => {
        const q = ((t * 0.5 + i / 4) % 1);
        attr(pf, 'cx', 646 + q * 46 + 6 * Math.sin(q * 7 + i)); attr(pf, 'cy', 236 - q * 96); attr(pf, 'r', 9 + q * 16);
        op(pf, st * 0.8 * Math.sin(q * Math.PI));
      });
    }

    /* --- the shared jars and socket, wherever the current beat wants them --- */
    place(J.chemical, [
      { a: aI, p: popIn(t, S.first - 0.1), x: 210, y: 450, s: 1.2, lv: 0.85 - 0.4 * flI },
      { a: aE, p: popIn(t, at('elec')), x: JX, y: JY, lv: chE },
      { a: aW, p: popIn(t, mid('where', 0.35)), x: WJ[1].x, y: 450, lv: WJ[1].lv },
    ]);
    place(J.kinetic, [
      { a: aI, p: popIn(t, S.first + 0.1), x: 630, y: 450, s: 1.2, lv: 0.08 + 0.4 * flI },
      { a: aM * mB, p: popIn(t, mid('mech', 0.5)), x: JX, y: JY, lv: 0.9 * P(t, tK + 0.35, 2.4, linear) },
      { a: aW, p: popIn(t, mid('where', 0.3)), x: WJ[0].x, y: 450, lv: WJ[0].lv },
    ]);
    place(J.thermal, [
      { a: aH, p: popIn(t, at('heating')), x: JX, y: JY, lv: 0.08 + 0.67 * hv },
      { a: aW, p: popIn(t, mid('where', 0.4)), x: WJ[2].x, y: 450, lv: WJ[2].lv },
      { a: aK, p: popIn(t, at('water') + 0.05), x: 965, y: 420, s: 1.15, lv: 0.05 + 0.85 * fillK },
    ]);
    place(J.nuclear, [{ a: aW, p: popIn(t, mid('where', 0.45)), x: WJ[3].x, y: 450, lv: WJ[3].lv }]);
    place(sock, [
      { a: aE, p: popIn(t, at('elec') - 0.1), x: 130, y: 290 },
      { a: aK, p: popIn(t, at('kettle') - 0.05), x: 110, y: 376 },
    ]);
  };
});

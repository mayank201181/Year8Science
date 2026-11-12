/* Scene 7: The firm saves you some marks.
   Shots: "6 EXAM TRAPS" over the office, the firm lined up with numbers -> six snappy confessionals, one trap card
   each (Constance, Pat with "I'M. NOT. A. STORE.", Theo, Effie with her needle stuck below 100%, Colin "Like me.",
   Jules crossing out W and °C) -> logo "EVERY JOULE COUNTS will return" -> stinger: Constance asks Gerald on the high
   shelf; 1.4 s of silence, he blinks twice and starts to tip -> "...Finally!": he slides off and falls while the board
   tracks gravitational -> kinetic -> THUD, FILED -> Theo collects the joules (thermal + sound) -> "Worth it." */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed traps) ---------- */
  function trapsPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  // for art drawn at absolute stage coordinates: scale about (cx, cy)
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); return p; }
  function trapsCam(cx, cy, k, dx, dy) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k - 60, 750 - 375 / k);   // the office has a ceiling strip above it
    attr(world, 'transform', `translate(${(600 + (dx || 0)).toFixed(1)} ${(375 + (dy || 0)).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  // blink exactly on the cues: shift the time the character sees so its blink lands there (Gerald: seed 21)
  const BLINK = 3.1 + (21 % 5) * 0.37, BOFF = 21 * 0.71;
  function trapsBlinkT(t, cues) {
    for (const b of cues) if (t < b + 0.2) { const s = ((0.065 - (b + BOFF)) % BLINK + BLINK) % BLINK; return t + s; }
    return t;
  }
  const CX = 880;
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 600, 140, 560, 450, { fill: C.card, stroke: C.line, opacity: 0.95 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 192);
    return g;
  }
  // a crossed-out chip: g.set(p) strikes it
  function trapsNo(parent, text, o) {
    const g = G(parent), c = chip(g, text, Object.assign({ size: 32, fill: 'rgba(255,96,112,0.16)', stroke: C.bad, sw: 3, color: '#FFB3BA' }, o || {}));
    const st = strike(g, -c.w / 2 - 6, 0, c.w / 2 + 6, C.bad);
    g.set = p => st.set(p); g.w = c.w;
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), castL = G(world), fgL = G(world), hudL = G(root);
  const shot = () => ({ bg: G(bgL), fg: G(fgL), hud: G(hudL) });

  /* ---------- sets ---------- */
  const setOff = G(bgL);
  E('rect', { x: -300, y: -300, width: 1800, height: 304, fill: '#14302F' }, setOff);
  const office = enOffice(setOff);
  const conf = enConf(bgL, 'con');
  const TINT = {}; for (const k in EN_TINT) TINT[k] = linGrad(EN_TINT[k][0], EN_TINT[k][1], true);
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A24', '#1D4F42', true) }, logoBg);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.07 }, logoBg);
  E('ellipse', { cx: 600, cy: 520, rx: 560, ry: 190, fill: glow('#E2B33C'), opacity: 0.3 }, logoBg);

  /* ===== intro: 6 EXAM TRAPS ===== */
  const sI = shot();
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#06110F', opacity: 0.55 }, sI.bg);
  const iHead = enOutlineText(T(sI.hud, 600, 215, '6 EXAM TRAPS', { size: 80, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 }), '#5A3A07', 10);
  const iSub = T(sI.hud, 600, 272, 'the firm saves you some marks', { size: 34, weight: 600, anchor: 'middle', fill: C.ink });
  const ROWX = [150, 330, 510, 690, 870, 1050];
  const badges = ROWX.map((x, k) => { const g = G(sI.hud); E('circle', { r: 28, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4 }, g); T(g, 0, 11, String(k + 1), { size: 32, weight: 800, anchor: 'middle', fill: SC_INK }); return g; });

  /* ===== trap cards ===== */
  // 1 Constance
  const s1 = shot(), c1 = trapsCard(s1.hud, 1);
  const c1a = T(c1, CX, 262, 'Energy is **never**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.bad });
  const c1b = T(c1, CX, 322, '**created** or **destroyed**', { size: 42, weight: 600, anchor: 'middle', boldFill: '#FF9AA4' });
  const c1c = trapsNo(c1, 'used up'), c1d = trapsNo(c1, 'lost');
  const c1e = T(c1, CX, 530, '**TRANSFERRED** ✓', { size: 50, weight: 800, anchor: 'middle', fill: C.good, boldFill: C.good });
  // 2 Pat
  const s2 = shot(), c2 = trapsCard(s2.hud, 2);
  const c2a = T(c2, CX, 262, 'heat · light · sound · electricity', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const c2b = T(c2, CX, 330, 'are **PATHWAYS** ✓', { size: 44, weight: 600, anchor: 'middle', boldFill: C.good });
  const c2c = T(c2, CX, 390, 'not stores ✗', { size: 34, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  const NOTW = ["I'M.", 'NOT.', 'A.', 'STORE.'];
  const c2w = NOTW.map(w => chip(c2, w, { size: 34, fill: '#E8751A', color: '#FFFFFF', stroke: SC_INK, sw: 4, weight: 800 }));
  const c2wX = (() => { const gap = 12, tot = c2w.reduce((s, c) => s + c.w, 0) + gap * 3; let x = CX - tot / 2; return c2w.map(c => { const cx = x + c.w / 2; x += c.w + gap; return cx; }); })();
  // 3 Theo
  const s3 = shot(), c3 = trapsCard(s3.hud, 3);
  const c3a = T(c3, CX, 262, 'Wasted energy', { size: 38, weight: 600, anchor: 'middle' });
  const c3b = T(c3, CX, 330, 'DISSIPATES', { size: 56, weight: 800, anchor: 'middle', fill: C.heat, ls: 2 });
  const c3c = T(c3, CX, 388, 'spreads out into the', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const c3d = G(c3);
  T(c3d, CX, 436, '**thermal store**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.heat });
  T(c3d, CX, 478, 'of the surroundings', { size: 32, weight: 600, anchor: 'middle' });
  const r3 = rng(14), c3dots = [];
  for (let k = 0; k < 14; k++) c3dots.push({ e: E('circle', { r: 7, fill: '#FFB27A' }, c3), a: r3() * TAU, d: 0.4 + r3() * 0.6 });
  // 4 Effie
  const s4 = shot(), c4 = trapsCard(s4.hud, 4);
  const c4a = T(c4, CX, 262, 'Efficiency is', { size: 38, weight: 600, anchor: 'middle' });
  const c4b = T(c4, CX, 336, '**never** more than **100%**', { size: 46, weight: 600, anchor: 'middle', boldFill: C.bad });
  const c4c = T(c4, CX, 410, 'useful energy out ≤ total energy in', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const c4d = chip(c4, 'CHECKED ✓', { size: 40, fill: 'rgba(86,214,155,0.16)', stroke: C.good, sw: 4, color: C.good, weight: 800 });
  // 5 Colin
  const s5 = shot(), c5 = trapsCard(s5.hud, 5);
  const c5a = G(c5); { const ic = enStoreIcon(c5a, 'nuclear', 0.8); tr(ic, CX - 120, 270); T(c5a, CX - 60, 288, 'Nuclear', { size: 50, weight: 800, fill: '#B48CFF' }); }
  const c5b = T(c5, CX, 362, 'is **NON-RENEWABLE**', { size: 42, weight: 600, anchor: 'middle', boldFill: C.bad });
  const c5c = T(c5, CX, 436, 'uranium runs out', { size: 36, weight: 700, anchor: 'middle' });
  const c5d = T(c5, CX, 522, '(so does coal)', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  // 6 Jules
  const s6 = shot(), c6 = trapsCard(s6.hud, 6);
  const c6a = T(c6, CX, 262, 'Energy is measured in', { size: 34, weight: 600, anchor: 'middle' });
  const c6b = enOutlineText(T(c6, CX, 346, 'JOULES (J)', { size: 62, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 }), '#5A3A07', 8);
  const c6c = trapsNo(c6, 'W  (watts)'), c6d = trapsNo(c6, '°C  (degrees)');
  const c6e = T(c6, CX, 532, "(that's Jules)", { size: 32, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== logo ===== */
  const sR = shot();
  const logo = G(sR.hud);
  const logoT = enOutlineText(T(logo, 0, 0, 'EVERY JOULE COUNTS', { size: 76, weight: 800, anchor: 'middle', fill: '#FFE45C' }), '#5A3A07', 12);
  const coins = [-1, 1].map(sd => { const c = G(logo); tr(c, sd * 480, -26); E('circle', { r: 36, fill: ball('#FFE45C', '#D49A12'), stroke: SC_INK, 'stroke-width': 4 }, c); T(c, 0, 12, 'J', { size: 36, weight: 800, anchor: 'middle', fill: '#8A6508' }); return c; });
  const rSub = T(sR.hud, 600, 420, 'will return', { size: 44, weight: 600, anchor: 'middle', fill: C.ink });

  /* ===== stinger: Gerald ===== */
  const sW = shot();
  // the board tracks Gerald's energy
  const bars = G(sW.fg);
  T(bars, 890, 214, "GERALD'S ENERGY", { size: 30, weight: 800, anchor: 'middle', fill: '#1C5C4A', ls: 1 });
  const BAR = [['gravitational', '#5B8DEF'], ['kinetic', '#FF6B5C'], ['thermal + sound', '#FF8A3D']].map(([n, col], k) => {
    const y = 268 + k * 68;
    T(bars, 660, y + 10, n, { size: 28, weight: 700, fill: '#2A3B44' });
    E('rect', { x: 880, y: y - 18, width: 240, height: 36, rx: 8, fill: '#DCE4EA', stroke: '#8C9AA6', 'stroke-width': 2 }, bars);
    return E('rect', { x: 880, y: y - 18, width: 0, height: 36, rx: 8, fill: col }, bars);
  });
  const dent = E('ellipse', { cx: 650, cy: 594, rx: 96, ry: 16, fill: '#120C08' }, sW.bg);
  const dust = []; for (let k = 0; k < 6; k++) dust.push(E('circle', { r: 20, fill: '#B8AFA2' }, sW.fg));
  const jDots = []; for (let k = 0; k < 8; k++) jDots.push(E('circle', { r: 7, fill: '#FFB27A' }, sW.fg));
  const thud = enOutlineText(T(sW.hud, 0, 0, 'THUD!', { size: 70, weight: 800, anchor: 'middle', fill: '#FFFFFF' }), SC_INK, 10);
  const ltGerald = scLowerThird(sW.hud, 'GERALD', 'Gravitational potential store. (finally)');
  const stFiled = enStamp(sW.hud, 'FILED'); tr(stFiled, 300, 640, 0.8, -8);
  const cThermal = chip(sW.hud, 'thermal + sound', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.heat, color: '#FFB27A' });
  const smallLogo = G(sW.hud);
  E('rect', { x: 680, y: 104, width: 440, height: 66, rx: 33, fill: '#0E2A24', stroke: '#E2B33C', 'stroke-width': 4 }, smallLogo);
  enOutlineText(T(smallLogo, 900, 150, 'EVERY JOULE COUNTS', { size: 38, weight: 800, anchor: 'middle', fill: '#FFE45C' }), '#5A3A07', 6);

  /* ---------- the cast: one of each, moved between shots ---------- */
  const ch = {};
  ['con', 'pat', 'theo', 'effie', 'colin', 'jules', 'gerald'].forEach(k => { ch[k] = cast(castL, k); });

  /* ---------- shots ---------- */
  const cut = id => at(id) - 0.06;
  const SHOTS = [['I', -9], ['1', cut('t1')], ['2', cut('t2')], ['3', cut('t3')], ['4', cut('t4')], ['5', cut('t5')], ['6', cut('t6')],
    ['R', cut('return')], ['W', cut('gerald')], ['E', cut('worth')]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const GR = { I: sI, 1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6, R: sR, W: sW, E: sW };
  const CONF = { 1: 'con', 2: 'pat', 3: 'theo', 4: 'effie', 5: 'colin', 6: 'jules' };
  const SCALE = { con: 1.3, pat: 1.15, theo: 1.3, effie: 1.25, colin: 1.3, jules: 1.25 };
  const ROW = [['con', 'deadpan'], ['pat', 'neutral'], ['theo', 'sad'], ['effie', 'smug'], ['colin', 'annoyed'], ['jules', 'happy']];
  // Gerald's fall: slide to the shelf edge, then fall to the floor beside Constance
  const tSlide = at('finally') + 0.05, tFall = mid('finally', 0.7), tLand = at('filed') - 0.05;
  const G0 = [170, 140], G1 = [650, 512];
  const WCUES = [end('gerald') + 0.35, end('gerald') + 0.85];

  return t => {
    const sh = shotAt(t);
    for (const k in GR) { const v = GR[k] === GR[sh] ? 1 : 0; op(GR[k].bg, v); op(GR[k].fg, v); op(GR[k].hud, v); }
    op(setOff, sh === 'I' || sh === 'W' || sh === 'E' ? 1 : 0);
    op(logoBg, sh === 'R' ? 1 : 0);
    const cw = CONF[sh];
    conf.set(cw ? 1 : 0, t); if (cw) conf.firstChild.setAttribute('fill', TINT[cw]);
    for (const k in ch) op(ch[k], 0);
    const show = (k, x, y, s, st) => { op(ch[k], 1); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t }, st)); };
    let cam = [600, 375, 1], shake = [0, 0];

    if (sh === 'I') {
      const hp = trapsPopAt(iHead, t, at('intro') + 0.05, 600, 190);
      op(iSub, P(t, mid('intro', 0.3), 0.4, linear));
      ROW.forEach(([k, mood], i) => {
        const p = P(t, mid('intro', 0.4) + i * 0.16, 0.45, pop);
        show(k, ROWX[i], 470 + 30 * (1 - clamp(p)), Math.max(0.01, (k === 'pat' ? 0.55 : 0.62) * p), { mood, arms: 1, look: 0 });
        op(ch[k], clamp(p * 3));
        trapsPop(badges[i], t, mid('intro', 0.45) + i * 0.16, ROWX[i], 345);
      });
      cam = [600, 375, 1 + 0.03 * P(t, at('intro'), 4, linear)];
    } else if (cw) {
      const line = 't' + sh;
      const st = { talk: talk(t, cw), look: 0 };
      if (cw === 'con') st.mood = 'deadpan';
      if (cw === 'pat') st.mood = t > mid('t2', 0.6) ? 'annoyed' : 'neutral';
      if (cw === 'theo') { st.mood = 'sad'; st.glow = t > mid('t3', 0.3) ? 1 : 0; }
      if (cw === 'effie') { st.mood = 'smug'; st.gauge = t > mid('t4', 0.2) ? 0.999 : 0.75; }
      if (cw === 'colin') { st.mood = t > mid('t5', 0.8) ? 'sad' : 'annoyed'; }
      if (cw === 'jules') { st.mood = 'happy'; st.arms = 1; }
      show(cw, cw === 'pat' ? 300 : 320, 400, SCALE[cw], st);
      cam = [600, 375, 1 + 0.03 * P(t, at(line), 5, linear)];
      if (sh === '1') {
        op(c1a, P(t, mid('t1', 0.1), 0.3, linear)); trapsPopAt(c1b, t, mid('t1', 0.2), CX, 310);
        trapsPop(c1c, t, mid('t1', 0.5), CX - 120, 420); c1c.set(P(t, mid('t1', 0.56), 0.3));
        trapsPop(c1d, t, mid('t1', 0.66), CX + 120, 420); c1d.set(P(t, mid('t1', 0.72), 0.3));
        trapsPopAt(c1e, t, mid('t1', 0.8), CX, 515);
      } else if (sh === '2') {
        op(c2a, P(t, mid('t2', 0.08), 0.3, linear)); trapsPopAt(c2b, t, mid('t2', 0.3), CX, 318);
        op(c2c, P(t, mid('t2', 0.48), 0.3, linear));
        const WT = [0.62, 0.71, 0.8, 0.89];
        c2w.forEach((c, k) => trapsPop(c, t, mid('t2', WT[k]), c2wX[k], 492, 1, k % 2 ? 3 : -3));
      } else if (sh === '3') {
        op(c3a, P(t, mid('t3', 0.08), 0.3, linear)); trapsPopAt(c3b, t, mid('t3', 0.26), CX, 312);
        op(c3c, P(t, mid('t3', 0.44), 0.3, linear)); op(c3d, P(t, mid('t3', 0.54), 0.3, linear));
        const sp = P(t, mid('t3', 0.28), 2.4, easeOut);
        c3dots.forEach(({ e, a, d }) => { attr(e, 'cx', CX + Math.cos(a) * d * 250 * sp); attr(e, 'cy', 545 + Math.sin(a) * d * 26 * sp); op(e, sp > 0 ? 1 - 0.75 * sp : 0); });
        if (t > mid('t3', 0.8)) ch.theo.set({ t, talk: talk(t, 'theo'), mood: 'sad', glow: 1, look: 0.2 * Math.sin(t * 3) });
      } else if (sh === '4') {
        op(c4a, P(t, mid('t4', 0.08), 0.3, linear)); trapsPopAt(c4b, t, mid('t4', 0.2), CX, 322);
        op(c4c, P(t, mid('t4', 0.55), 0.3, linear)); trapsPop(c4d, t, mid('t4', 0.8), CX, 505, 1, -4);
      } else if (sh === '5') {
        trapsPopAt(c5a, t, mid('t5', 0.1), CX, 270); trapsPopAt(c5b, t, mid('t5', 0.3), CX, 350);
        op(c5c, P(t, mid('t5', 0.56), 0.3, linear)); op(c5d, P(t, mid('t5', 0.82), 0.3, linear));
        const push = P(t, mid('t5', 0.8), end('t5') + 0.5 - mid('t5', 0.8), linear);
        cam = [lerp(600, 520, push), 375, 1 + 0.08 * push];
      } else if (sh === '6') {
        op(c6a, P(t, mid('t6', 0.1), 0.3, linear)); trapsPopAt(c6b, t, mid('t6', 0.28), CX, 330);
        trapsPop(c6c, t, mid('t6', 0.48), CX - 125, 438); c6c.set(P(t, mid('t6', 0.55), 0.3));
        trapsPop(c6d, t, mid('t6', 0.64), CX + 125, 438); c6d.set(P(t, mid('t6', 0.72), 0.3));
        op(c6e, P(t, mid('t6', 0.84), 0.3, linear));
      }
    } else if (sh === 'R') {
      tr(rayP, 600, 520, 1, (t * 6 * AMP) % 360);
      trapsPop(logo, t, at('return') + 0.05, 600, 330);
      coins.forEach((c, i) => tr(c, (i ? 1 : -1) * 480, -26, 1, (i ? 1 : -1) * Math.sin(t * 2) * 12 * AMP));
      op(rSub, P(t, mid('return', 0.5), 0.4, linear));
    } else {
      /* ---------- the stinger ---------- */
      // Gerald: on the shelf, slides, falls, lands
      let gx = G0[0], gy = G0[1], rot = 0, f = 0;
      if (t >= tSlide && t < tFall) { const u = P(t, tSlide, tFall - tSlide, easeIn); gx = lerp(170, 300, u); rot = 14 * u; }
      else if (t >= tFall) { const u = clamp((t - tFall) / (tLand - tFall)); f = u * u; gx = lerp(300, G1[0], u); gy = lerp(G0[1], G1[1], f); rot = 14 + (385 - 14) * u; }
      if (t < tSlide) rot = (t > at('finally') - 0.45 ? Math.sin((t - at('finally') + 0.45) * 30) * 4 * P(t, at('finally') - 0.45, 0.3, linear) + 3 : 0);
      const landed = t >= tLand;
      const gMood = t >= at('finally') - 0.05 ? 'happy' : 'deadpan';
      show('gerald', gx, gy, 0.8, { t: trapsBlinkT(t, WCUES), talk: talk(t, 'gerald'), mood: gMood, look: landed ? 0 : 0, still: t >= tSlide });
      tr(ch.gerald, gx, gy + (landed ? 16 : 0), 0.8, rot);
      // Constance below the shelf, looking at him
      let cLook = -0.85;
      if (t >= tFall) cLook = lerp(-0.85, 0.7, P(t, tFall, tLand - tFall, linear));
      show('con', 470, 450, 1.0, { talk: talk(t, 'con'), mood: 'deadpan', look: cLook });
      // the energy bars
      const kin = landed ? 1 - P(t, tLand, 0.35, linear) : f;
      attr(BAR[0], 'width', 240 * (t >= tFall ? 1 - f : 1) * (landed ? 0 : 1));
      attr(BAR[1], 'width', 240 * kin);
      attr(BAR[2], 'width', 240 * (landed ? P(t, tLand, 0.35, linear) : 0));
      // THUD, dust, dent, shake
      op(dent, landed ? 1 : 0);
      const dp = landed ? P(t, tLand, 0.9, easeOut) : 0;
      dust.forEach((d, k) => { const a = Math.PI + (k / 5) * Math.PI; attr(d, 'cx', G1[0] + Math.cos(a) * 140 * dp); attr(d, 'cy', 588 + Math.sin(a) * 50 * dp); attr(d, 'r', 14 + 22 * dp); op(d, landed ? 0.8 * (1 - dp) : 0); });
      const th = landed ? P(t, tLand, 0.3, pop) * (1 - P(t, tLand + 0.8, 0.25, linear)) : 0;
      op(thud, clamp(th * 2)); tr(thud, 650, 360, Math.max(0.01, 0.6 + 0.4 * th), -6);
      const sk = landed ? (1 - P(t, tLand, 0.5, linear)) * 12 * AMP : 0;
      shake = [Math.sin(t * 90) * sk, Math.cos(t * 77) * sk];
      ltGerald.set(win(t, at('finally') + 0.1, at('filed') + 1.8, 0.3));
      stFiled.set(P(t, mid('filed', 0.86), 0.35, linear)); if (t > at('mine') - 0.1) op(stFiled, 1 - P(t, at('mine') - 0.1, 0.25, linear));
      // mine: Theo pops up and collects the joules
      const tp = P(t, at('mine') - 0.1, 0.45, pop);
      if (tp > 0) { show('theo', 880, 560 + 120 * (1 - clamp(tp)), 0.62, { talk: talk(t, 'theo'), mood: 'sad', glow: 1, look: -0.7 }); op(ch.theo, clamp(tp * 3)); }
      jDots.forEach((d, k) => { const q = ((t - at('mine')) * 0.5 + k / 8) % 1; const on = t > at('mine') ? 1 : 0; attr(d, 'cx', lerp(680, 860, q)); attr(d, 'cy', 500 - Math.sin(q * Math.PI) * 60 + (k % 3) * 10); op(d, on * Math.sin(q * Math.PI) * 0.9); });
      const ct = win(t, mid('mine', 0.3), end('worth') + 9, 0.3);
      op(cThermal, ct); tr(cThermal, 760, 655);
      // camera: wide, slow push onto Gerald in the silence, back to wide for the fall, close on him for "Worth it."
      if (sh === 'E') {
        cam = [650, 470, 1.55 + 0.1 * P(t, at('worth'), 3, linear)];
        op(cThermal, 0); op(stFiled, 0); op(bars, 0);
        op(smallLogo, P(t, end('worth') + 0.4, 0.5, linear));
      } else {
        op(smallLogo, 0); op(bars, 1);
        if (t < at('finally') - 0.04) { const push = P(t, end('gerald'), at('finally') - end('gerald'), ease); cam = [lerp(600, 240, push), lerp(320, 250, push), 1 + 0.45 * push]; }
        else cam = [600, 320, 1];
      }
    }
    trapsCam(cam[0], cam[1], cam[2], shake[0], shake[1]);
  };
});

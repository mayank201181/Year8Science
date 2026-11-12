/* Scene 7: The cast saves you some marks.
   Shots: "6 EXAM TRAPS" + a mousetrap baited with MARKS -> six snappy confessionals, one trap card each
   (Mitch, Gloria, Fern, Larry, the twins, Carl; Carl's rain cloud on "Story of my life")
   -> logo "THE POWERHOUSE will return" -> stinger: Mitch asks Wally, long silence, blinks, "...Hi.",
   Mitch deadpan -> final frame: Wally waving under the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed traps) ---------- */
  // text that shrinks (down to 26 px) to fit maxW
  function trapsFit(parent, x, y, str, o, maxW) {
    let size = o.size;
    while (size > 26 && textWidth(str, size, o.font || FD, o.weight || 600) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  }
  function trapsCam(cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    attr(world, 'transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function trapsPop(el, t, t0, x, y) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, 0.7 + 0.3 * p)); }
  // the same for art drawn at absolute stage coordinates: scale about (cx, cy)
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), s = Math.max(0.01, 0.7 + 0.3 * p); op(el, clamp(p * 2)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`); }
  // a trap card on the right of the confessional
  const CX = 880;
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 600, 140, 560, 450, { fill: C.card, stroke: C.line, opacity: 0.94 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 190);
    return g;
  }
  // blink exactly when we want: shift the time passed to scChar so its blink lands on each cue
  const BLINK = 3.1 + (11 % 5) * 0.37, BOFF = 11 * 0.71;
  function trapsBlinkT(t, cues) {
    for (const b of cues) if (t < b + 0.2) { const s = ((0.065 - (b + BOFF)) % BLINK + BLINK) % BLINK; return t + s; }
    return t;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), charL = G(world), frontL = G(world), fx = G(root);

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#22101A', '#0A1B27', true) }, introBg);
  E('ellipse', { cx: 600, cy: 470, rx: 420, ry: 230, fill: glow('#FFE29A'), opacity: 0.35 }, introBg);
  const confs = {};
  ['mitch', 'gloria', 'fern', 'larry', 'twins', 'carl', 'wally'].forEach(k => { confs[k] = scConfessional(bgL, k); });
  const logoBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A1E', '#0A1B27', true) }, logoBg);
  E('ellipse', { cx: 600, cy: 360, rx: 520, ry: 280, fill: glow('#FFB27A'), opacity: 0.45 }, logoBg);

  /* ---------- characters: one of each, moved between shots ---------- */
  const wArm = G(charL), wArmIn = G(wArm);
  E('path', { d: 'M0,0 Q36,-6 52,-48', fill: 'none', stroke: C.waterDk, 'stroke-width': 18, 'stroke-linecap': 'round' }, wArmIn);
  E('path', { d: 'M0,0 Q36,-6 52,-48', fill: 'none', stroke: C.water, 'stroke-width': 11, 'stroke-linecap': 'round' }, wArmIn);
  E('circle', { cx: 54, cy: -56, r: 15, fill: C.water, stroke: C.waterDk, 'stroke-width': 4 }, wArmIn);
  const ch = {};
  ['mitch', 'gloria', 'fern', 'larry', 'twins', 'carl', 'wally'].forEach(k => { ch[k] = scChar(charL, k, { s: 1 }); op(ch[k], 0); });

  /* ===== intro: 6 EXAM TRAPS ===== */
  const shI = { fx: G(fx), front: G(frontL) };
  const iHead = T(shI.fx, 600, 215, '6 EXAM TRAPS', { size: 76, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  const iSub = T(shI.fx, 600, 272, 'the cast saves you some marks', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const mt = shI.front;
  E('rect', { x: 400, y: 512, width: 400, height: 44, rx: 8, fill: ball('#E3B272', '#A0702E'), stroke: '#6B4416', 'stroke-width': 4 }, mt);
  E('rect', { x: 640, y: 500, width: 110, height: 14, rx: 4, fill: '#C9D3DC', stroke: '#7D8C99', 'stroke-width': 2 }, mt);
  const cheese = G(mt), cheeseIn = G(cheese);
  E('path', { d: 'M-70,24 L70,24 L70,-14 L-50,-40 Q-70,-30 -70,-14 Z', fill: ball('#FFE066', '#E0A800'), stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cheeseIn);
  [[-40, 8, 7], [36, 12, 6], [50, -6, 4]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#E0A800' }, cheeseIn));
  T(cheeseIn, 0, 10, 'MARKS', { size: 26, weight: 800, anchor: 'middle', fill: '#5A3A00' });
  const bar = G(mt);
  E('path', { d: 'M0,0 L170,0 L170,-14', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bar);
  E('circle', { cx: 600, cy: 508, r: 14, fill: '#8E9CA9', stroke: '#C9D3DC', 'stroke-width': 4 }, mt);
  const snapT = T(shI.fx, 600, 420, 'SNAP!', { size: 64, weight: 800, anchor: 'middle', fill: C.bad });

  /* ===== trap cards ===== */
  // 1 Mitch
  const s1 = { fx: G(fx) }, c1 = trapsCard(s1.fx, 1);
  const c1a = T(c1, CX, 275, 'Respiration', { size: 50, weight: 800, anchor: 'middle', fill: C.glucose });
  const c1b = T(c1, CX, 335, 'is **NOT** breathing', { size: 40, weight: 600, anchor: 'middle', boldFill: C.bad });
  const c1c = G(c1); { const l = lungs(c1c, 0.2); tr(l, 655, 425); trapsFit(c1c, 700, 438, 'breathing: moves air', { size: 32, weight: 600 }, 430); }
  const c1d = G(c1); { const cl = animalCell(c1d, 34, 26, { sw: 3, seed: 4, nr: 8 }); tr(cl, 655, 520); const m = mitochondrion(cl.inner, 30, 14); tr(m, 10, 6); trapsFit(c1d, 700, 532, 'respiration: a reaction in cells', { size: 32, weight: 600, fill: C.glucoseLt }, 430); }
  // 2 Gloria
  const s2 = { fx: G(fx) }, c2 = trapsCard(s2.fx, 2);
  const c2a = T(c2, CX, 270, 'Energy is', { size: 40, weight: 600, anchor: 'middle' });
  const c2b = G(c2); T(c2b, -26, 22, 'RELEASED', { size: 62, weight: 800, anchor: 'middle', fill: C.good }); tr(tick(c2b, 20), 160, 0, 1);
  const c2c = G(c2); T(c2c, 0, 16, 'made', { size: 46, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); const c2s = strike(c2c, -70, 0, 70, C.bad); tr(cross(c2c, 16), 110, 0);
  const c2d = G(c2); { const gl = molGlucose(c2d, 26); tr(gl, 690, 520); const sp = spark(c2d, 10, { seed: 1 }); tr(sp, 690, 520); c2d.sp = sp; trapsFit(c2d, 735, 532, 'it was stored in glucose', { size: 32, weight: 600, fill: C.glucoseLt }, 400); }
  // 3 Fern
  const s3 = { fx: G(fx) }, c3 = trapsCard(s3.fx, 3);
  const c3a = T(c3, CX, 268, 'Plants respire', { size: 42, weight: 600, anchor: 'middle' });
  const c3b = T(c3, CX, 335, 'ALL the time', { size: 54, weight: 800, anchor: 'middle', fill: C.energy });
  const c3d = G(c3); { const su = sun(c3d, 22); tr(su, 700, 432); c3d.sun = su; T(c3d, 742, 444, 'day', { size: 32, weight: 700 }); tr(tick(c3d, 13), 828, 432); }
  const c3n = G(c3); { E('path', { d: 'M18,-24 A28,28 0 1 0 18,24 A22,22 0 1 1 18,-24 Z', fill: '#E9F2F7', stroke: '#A4BCCB', 'stroke-width': 2, transform: 'translate(930 432)' }, c3n); T(c3n, 966, 444, 'night', { size: 32, weight: 700 }); tr(tick(c3n, 13), 1078, 432); }
  const c3e = G(c3); { T(c3e, CX, 538, 'not just at night', { size: 32, weight: 600, anchor: 'middle', fill: '#FF9AA4' }); c3e.st = strike(c3e, CX - 135, 527, CX + 135, C.bad); }
  // 4 Larry
  const s4 = { fx: G(fx) }, c4 = trapsCard(s4.fx, 4);
  const c4a = trapsFit(c4, CX, 268, 'Anaerobic in muscles makes', { size: 36, weight: 600, anchor: 'middle' }, 500);
  const c4b = G(c4); { const c = chip(c4b, 'lactic acid', { size: 42, fill: C.lactic, color: '#3A0A20', weight: 800 }); tr(tick(c4b, 18), c.w / 2 + 40, 0); }
  const c4c = G(c4); { const c = chip(c4c, 'ethanol', { size: 36, fill: C.ethanol, color: '#22104A', weight: 800 }); c4c.st = strike(c4c, -c.w / 2 - 10, 0, c.w / 2 + 10, C.bad); tr(cross(c4c, 15), c.w / 2 + 40, 0); }
  const c4d = T(c4, CX, 535, "(ethanol is yeast's thing)", { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  // 5 the twins
  const s5 = { fx: G(fx) }, c5 = trapsCard(s5.fx, 5);
  const c5a = G(c5); T(c5a, 640, 270, 'aerobic', { size: 34, weight: 700, fill: C.good }); const m5a = meter(c5a, { w: 480, h: 34, color: C.energy }); tr(m5a, 640, 290);
  const c5b = G(c5); T(c5b, 640, 385, 'anaerobic', { size: 34, weight: 700, fill: C.lactic }); const m5b = meter(c5b, { w: 480, h: 34, color: C.energy }); tr(m5b, 640, 405);
  const c5c = T(c5, CX, 530, '**MUCH** more energy', { size: 46, weight: 600, anchor: 'middle', boldFill: C.energy });
  // 6 Carl
  const s6 = { fx: G(fx), front: G(frontL) }, c6 = trapsCard(s6.fx, 6);
  const c6a = T(c6, CX, 268, 'Anaerobic in muscles:', { size: 38, weight: 600, anchor: 'middle' });
  const c6b = G(c6); { const g1 = chip(c6b, 'glucose', { size: 30, fill: C.glucose, color: '#3A2600' }); const g2 = chip(c6b, 'lactic acid', { size: 30, fill: C.lactic, color: '#3A0A20' });
    const tot = g1.w + 70 + g2.w; tr(g1, CX - tot / 2 + g1.w / 2, 345); arrow(c6b, CX - tot / 2 + g1.w + 12, 345, CX - tot / 2 + g1.w + 58, 345, { color: C.ink, width: 5 }); tr(g2, CX + tot / 2 - g2.w / 2, 345); }
  const c6c = G(c6); { const m = molCO2(c6c, 18); tr(m, 680, 450); tr(cross(c6c, 26), 680, 450); trapsFit(c6c, 740, 463, '**NO** carbon dioxide', { size: 40, weight: 600, boldFill: C.bad }, 400); }
  const c6d = T(c6, CX, 540, '(at all)', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const cloud = G(s6.front), cloudIn = G(cloud);
  [[-40, 6, 34], [0, -10, 44], [44, 4, 34], [0, 16, 32]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#8F9CAB', stroke: '#57636F', 'stroke-width': 3 }, cloudIn));
  E('rect', { x: -70, y: 6, width: 140, height: 34, rx: 17, fill: '#8F9CAB' }, cloudIn);
  const rain = []; for (let i = 0; i < 6; i++) rain.push(E('line', { x1: 0, y1: 0, x2: -4, y2: 18, stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, cloudIn));

  /* lower thirds, the first confessional for each of these */
  const LT = {
    gloria: scLowerThird(s2.fx, 'GLORIA', 'Glucose. The fuel.'),
    fern: scLowerThird(s3.fx, 'FERN', 'Plant cell, windowsill'),
    larry: scLowerThird(s4.fx, 'LARRY', 'Lactic acid. Emergency cover.'),
    twins: scLowerThird(s5.fx, 'OTTO & OSCAR', 'Oxygen. Always a pair.'),
    carl: scLowerThird(s6.fx, 'CARL', 'Carbon dioxide. Waste product.'),
  };

  /* ===== logo ===== */
  const sR = { fx: G(fx) };
  const rBolt = bolt(sR.fx, 1.1); tr(rBolt, 600, 220, 1.1);
  const rLogo = T(sR.fx, 600, 380, 'THE POWERHOUSE', { size: 84, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  const rSub = T(sR.fx, 600, 450, 'will return', { size: 42, weight: 600, anchor: 'middle', fill: C.ink });

  /* ===== stinger ===== */
  const sW = { fx: G(fx) };
  const wLower = scLowerThird(sW.fx, 'WALLY', "Water. Doesn't talk.");
  const wBub = G(sW.fx);
  E('path', { d: 'M-70,-36 L70,-36 Q86,-36 86,-20 L86,20 Q86,36 70,36 L-30,36 L-56,62 L-48,36 L-70,36 Q-86,36 -86,20 L-86,-20 Q-86,-36 -70,-36 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, wBub);
  T(wBub, 0, 11, '...Hi.', { size: 30, weight: 700, anchor: 'middle', fill: SC_INK });
  const sE = { fx: G(fx) };
  T(sE.fx, 600, 175, 'THE POWERHOUSE', { size: 60, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  T(sE.fx, 600, 226, 'Episode 1: Sports Day', { size: 32, weight: 600, anchor: 'middle', fill: C.ink });

  /* ---------- shots ---------- */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.05], ['2', at('t2') - 0.05], ['3', at('t3') - 0.05], ['4', at('t4') - 0.05], ['5', at('t5a') - 0.05],
    ['6', at('t6') - 0.05], ['R', at('return') - 0.05], ['W1', at('wally') - 0.05], ['W2', end('wally') + 0.25], ['W3', at('saving') - 0.05], ['E', end('saving') + 0.45]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const groups = { I: shI, 1: s1, 2: s2, 3: s3, 4: s4, 5: s5, 6: s6, R: sR, W2: sW, E: sE };
  const CONF = { 1: 'mitch', 2: 'gloria', 3: 'fern', 4: 'larry', 5: 'twins', 6: 'carl', W1: 'wally', W2: 'wally', W3: 'wally', E: 'wally' };
  const SPEAK = { 1: 'mitch', 2: 'gloria', 3: 'fern', 4: 'larry', 6: 'carl' };
  const SCALE = { mitch: 1.2, gloria: 1.3, fern: 1.2, larry: 1.25, carl: 1.2 };
  const WCUES = [mid('wally', 0.98) + 0.45, end('wally') + 1.15, end('hi') + 0.55, end('saving') + 0.25, end('saving') + 1.9];

  return t => {
    const sh = shotAt(t);
    for (const k in groups) { const on = k === sh ? 1 : 0; for (const part in groups[k]) op(groups[k][part], on); }
    op(introBg, sh === 'I' ? 1 : 0); op(logoBg, sh === 'R' ? 1 : 0);
    for (const k in confs) confs[k].set(CONF[sh] === k ? 1 : 0, t);
    for (const k in ch) op(ch[k], 0);
    op(wArm, 0);
    let cam = [600, 375, 1];
    const show = (k, x, y, s, st) => { op(ch[k], 1); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      const hp = P(t, at('intro') + 0.05, 0.5, pop); op(iHead, clamp(hp * 2));
      iHead.setAttribute('transform', `translate(600 190) scale(${(0.7 + 0.3 * hp).toFixed(3)}) translate(-600 -190)`);
      op(iSub, P(t, mid('intro', 0.45), 0.4, linear));
      const snap = end('intro') - 0.35, sp = P(t, snap, 0.14, easeIn);
      const tremble = t < snap ? Math.sin(t * 40) * 1.5 * P(t, mid('intro', 0.5), 0.5, linear) * AMP : 0;
      tr(bar, 600, 508, 1, -180 + 180 * sp + tremble);
      const hop = P(t, snap - 0.12, 0.5, easeOut);
      tr(cheese, 700 + 230 * hop, 488 - 150 * Math.sin(Math.PI * Math.min(1, hop)) * (1 - 0.5 * hop) - 0 * hop, 1, 30 * hop);
      const sn = P(t, snap + 0.05, 0.3, pop); op(snapT, clamp(sn * 2) * (1 - P(t, snap + 0.9, 0.3, linear))); tr(snapT, 0, 0);
      cam = [600, 400, 1 + 0.04 * P(t, at('intro'), 4, linear)];
    } else if (SPEAK[sh]) {
      const k = SPEAK[sh], line = 't' + sh;
      let mood = { mitch: 'deadpan', gloria: 'happy', fern: 'happy', larry: 'happy', carl: 'neutral' }[k];
      if (k === 'larry' && t > mid('t4', 0.55)) mood = 'smug';
      if (k === 'carl' && t > mid('t6', 0.6)) mood = 'sad';
      const st = { talk: scTalk(S, t, k), mood, sweat: 0 };
      if (k === 'carl' && t >= at('story') - 0.1) { st.mood = 'sad'; st.look = 0; }
      show(k, 320, 400, SCALE[k], st);
      if (LT[k]) LT[k].set(win(t, at(line) + 0.1, at(line) + 2.7, 0.3));
      if (sh === '1') {
        trapsPopAt(c1a, t, mid('t1', 0.1), CX, 258); op(c1b, P(t, mid('t1', 0.22), 0.35, linear));
        op(c1c, P(t, mid('t1', 0.44), 0.35, linear)); op(c1d, P(t, mid('t1', 0.66), 0.35, linear));
      } else if (sh === '2') {
        op(c2a, P(t, mid('t2', 0.12), 0.3, linear)); trapsPop(c2b, t, mid('t2', 0.22), CX, 345);
        trapsPop(c2c, t, mid('t2', 0.42), CX, 432); c2s.set(P(t, mid('t2', 0.5), 0.35));
        op(c2d, P(t, mid('t2', 0.7), 0.35, linear)); c2d.sp.upd(t);
      } else if (sh === '3') {
        op(c3a, P(t, mid('t3', 0.1), 0.3, linear)); trapsPopAt(c3b, t, mid('t3', 0.3), CX, 318);
        op(c3d, P(t, mid('t3', 0.5), 0.3, linear)); c3d.sun.upd(t); op(c3n, P(t, mid('t3', 0.6), 0.3, linear));
        op(c3e, P(t, mid('t3', 0.76), 0.3, linear)); c3e.st.set(P(t, mid('t3', 0.86), 0.35));
      } else if (sh === '4') {
        op(c4a, P(t, mid('t4', 0.06), 0.3, linear)); trapsPop(c4b, t, mid('t4', 0.4), CX - 30, 352);
        trapsPop(c4c, t, mid('t4', 0.58), CX - 30, 448); c4c.st.set(P(t, mid('t4', 0.66), 0.35));
        op(c4d, P(t, mid('t4', 0.8), 0.3, linear));
      } else if (sh === '6') {
        op(c6a, P(t, mid('t6', 0.1), 0.3, linear)); op(c6b, P(t, mid('t6', 0.3), 0.35, linear));
        trapsPopAt(c6c, t, mid('t6', 0.62), 860, 450); op(c6d, P(t, mid('t6', 0.85), 0.3, linear));
        // "Story of my life.": a rain cloud and a slow push-in on Carl
        const cp = P(t, at('story') - 0.1, 0.5, easeOut); op(cloud, cp); tr(cloud, 320, 230 - 30 * (1 - cp));
        rain.forEach((r, i) => { const q = (t * 1.6 + i / 6) % 1; tr(r, -48 + i * 19, 40 + q * 60); op(r, cp * Math.sin(q * Math.PI)); });
        const push = P(t, at('story') - 0.1, end('story') + 0.8 - at('story'), linear);
        cam = [lerp(600, 330, push), lerp(375, 330, push), 1 + 0.35 * ease(push)];
        op(c6, 1 - P(t, at('story') - 0.1, 0.3, linear));
      }
      if (sh !== '6') cam = [600, 375, 1 + 0.03 * P(t, at(line), 4, linear)];
    } else if (sh === '5') {
      const o = scTalk(S, t, 'otto'), s = scTalk(S, t, 'oscar');
      show('twins', 320, 400, 1.05, { talk: o, talkB: s, mood: 'happy', look: t > at('t5b') - 0.2 ? 0.8 : 0, lookB: t < at('t5b') - 0.2 ? -0.8 : 0 });
      LT.twins.set(win(t, at('t5a') + 0.1, at('t5a') + 2.7, 0.3));
      op(c5a, P(t, mid('t5a', 0.3), 0.3, linear)); m5a.set(P(t, mid('t5a', 0.45), 1.4, easeOut));
      trapsPopAt(c5c, t, mid('t5b', 0.12), CX, 515);
      op(c5b, P(t, mid('t5b', 0.55), 0.3, linear)); m5b.set(0.16 * P(t, mid('t5b', 0.62), 0.6, easeOut));
      cam = [600, 375, 1 + 0.03 * P(t, at('t5a'), 4, linear)];
    } else if (sh === 'R') {
      const lp = P(t, at('return') + 0.05, 0.5, pop); op(rLogo, clamp(lp * 2));
      rLogo.setAttribute('transform', `translate(600 350) scale(${(0.7 + 0.3 * lp).toFixed(3)}) translate(-600 -350)`);
      const bp = P(t, at('return'), 0.5, pop); op(rBolt, clamp(bp * 2)); tr(rBolt, 600, 220, Math.max(0.01, 1.1 * bp), 8 * Math.sin(t * 2) * AMP);
      op(rSub, P(t, mid('return', 0.55), 0.4, linear));
    } else {
      // the stinger, in Wally's confessional
      const wt = trapsBlinkT(t, WCUES);
      const wTalk = scTalk(S, t, 'wally') * 0.35;
      const wave = sh === 'E' ? Math.sin(t * 7) * 22 * AMP : (sh === 'W2' && t > at('hi') + 0.2 ? Math.sin(t * 7) * 18 * AMP * P(t, at('hi') + 0.2, 0.3, linear) : 0);
      const armOn = sh === 'E' || (sh === 'W2' && t > at('hi') + 0.2);
      let wx = 420, wy = 420, ws = 1.3;
      if (sh === 'E') { wx = 600; wy = 470; ws = 1.35; }
      op(ch.wally, 1); tr(ch.wally, wx, wy, ws);
      ch.wally.set({ t: wt, still: true, talk: wTalk, mood: 'neutral', look: sh === 'W1' || sh === 'W3' ? 0.15 : 0 });
      op(wArm, armOn ? 1 : 0); tr(wArm, wx + 64 * ws, wy + 6 * ws, ws, wave - 10);
      if (sh === 'W1' || sh === 'W3') {
        const mm = sh === 'W3' ? 'deadpan' : 'neutral';
        show('mitch', 900, 430, 1.0, { talk: scTalk(S, t, 'mitch'), mood: mm, look: -1 });
        if (sh === 'W3') { const push = P(t, end('saving'), 0.6, linear); cam = [lerp(600, 760, push), 375, 1 + 0.15 * push]; }
      } else if (sh === 'W2') {
        const push = P(t, end('wally') + 0.25, at('saving') - end('wally') - 0.3, linear);
        cam = [430, 400, 1.35 + 0.2 * push];
        wLower.set(win(t, end('wally') + 0.4, at('saving') - 0.1, 0.3));
        const bb = P(t, at('hi') + 0.05, 0.3, pop); op(wBub, clamp(bb * 2)); tr(wBub, 960, 205, Math.max(0.01, bb));
      } else if (sh === 'E') {
        const ep = P(t, end('saving') + 0.45, 0.5, easeOut);
        op(sE.fx, ep); tr(sE.fx, 0, (1 - ep) * -16);
      }
    }
    trapsCam(cam[0], cam[1], cam[2]);
  };
});

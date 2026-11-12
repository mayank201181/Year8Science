/* Scene 0: Cold open (no chapter card).
   Bedroom, 7 a.m. Saturday: Kavya asleep, the sunbeam creeps up the bed onto her face -> she sits up, furious ->
   the documentary camera follows the beam back to the gap in the curtains -> the beam becomes Ray ->
   Ray's confessional (ray of light, deliveries) -> space: 8 minutes, 150 million km, in a straight line;
   the speed of light card -> confessional: no curves, no shortcuts, no scenic routes; the boss (the Sun,
   luminous); the empty tip jar and its moth -> title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r, f) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const xMark = (parent, s) => { const g = G(parent); E('circle', { r: s * 1.5, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 5 }, g); E('path', { d: `M${-s * 0.7},${-s * 0.7} L${s * 0.7},${s * 0.7} M${s * 0.7},${-s * 0.7} L${-s * 0.7},${s * 0.7}`, stroke: '#E8424F', 'stroke-width': s * 0.38, 'stroke-linecap': 'round' }, g); return g; };

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B/C: the bedroom (one group, so the camera can move it) ================= */
  const bedShot = G(Lbg);
  const bedBack = G(bedShot), beamL = G(bedShot), kavW = G(bedShot), rayBedW = G(bedShot), bedFront = G(bedShot);
  const room = lwBedroom(bedBack, bedFront);
  room.setBeam(0);
  const beam = E('path', { d: '', fill: '#FFF3B0', opacity: 0.5 }, beamL);
  const beamCore = E('path', { d: '', fill: '#FFFFFF', opacity: 0.35 }, beamL);
  const kav = cast(kavW, 'kavya', { outfit: 'pyjamas' });
  const rayBed = cast(rayBedW, 'ray', {});
  const zzz = G(bedFront);
  const zs = ['Z', 'z', 'z'].map((s, i) => T(zzz, 0, 0, s, { size: 46 - i * 8, weight: 800, fill: '#3F5BD9' }));
  // A chips
  const cKav = label(Lfg, 'Kavya, age 12', { size: 34 });
  const clock = G(Lfg);
  E('rect', { x: -96, y: -52, width: 192, height: 104, rx: 16, fill: '#1B2733', stroke: '#FFFFFF', 'stroke-width': 4 }, clock);
  T(clock, 0, 4, '7:00', { size: 52, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  T(clock, 0, 38, 'SATURDAY', { size: 22, weight: 800, anchor: 'middle', fill: '#FFB3B3', ls: 2 });
  const note = G(Lfg);
  E('rect', { x: -130, y: -70, width: 260, height: 140, fill: '#FFF176', stroke: '#D9C24A', 'stroke-width': 3 }, note);
  T(note, 0, -14, 'PLAN:', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  T(note, 0, 30, 'sleep until lunch', { size: 30, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  const ltKavya = lwLower(Lhud, 'kavya');
  // B: reticle + caption
  const reticle = G(Lfg);
  E('circle', { r: 62, fill: 'none', stroke: '#E8424F', 'stroke-width': 5, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round' }, reticle);
  const trace = E('line', { stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 10', opacity: 0.9 }, Lfg);
  const smallChip = label(Lfg, 'the thing that just hit her in the face', { size: 30, color: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const recDot = E('circle', { cx: 1000, cy: 80, r: 10, fill: '#FF3B3B' }, finder);
  T(finder, 1020, 90, 'REC', { size: 28, weight: 700, fill: '#FFFFFF' });
  // C: sparkles as the beam becomes Ray
  const sparks = G(Lfg); const spk = [0, 1, 2, 3, 4].map(() => spark(sparks, 14));

  /* ================= D/F: Ray's confessional ================= */
  const conf = lwConf(Lbg, 'ray');
  const ltRay = lwLower(Lhud, 'ray');
  const cRay = G(Lfg);
  chip(cRay, 'ray of light', { size: 50, fill: '#FFF3B0', color: '#3A2A06', stroke: '#FFFFFF', sw: 4 });
  arrow(cRay, -170, 74, 170, 74, { color: C.energy, width: 8 });
  const cJob = label(Lfg, 'job: delivering light', { size: 32, color: C.energy });
  // curves: the straight-line rule and three crossed-out signs
  const straightG = G(Lfg);
  arrow(straightG, -300, 0, 300, 0, { color: C.energy, width: 10 });
  const stLab = label(straightG, 'straight lines only', { size: 40, color: C.energy }); tr(stLab, 0, 66);
  const signs = [0, 1, 2].map(i => {
    const g = G(Lfg);
    E('rect', { x: -6, y: 30, width: 12, height: 120, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, g);
    if (i === 0) {        // winding road
      E('rect', { x: -56, y: -56, width: 112, height: 112, rx: 10, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 4, transform: 'rotate(45)' }, g);
      E('path', { d: 'M-8,40 C-40,20 30,10 0,-6 C-30,-20 34,-30 6,-44', fill: 'none', stroke: SC_INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    } else if (i === 1) { // shortcut
      E('rect', { x: -86, y: -40, width: 172, height: 76, rx: 10, fill: '#2E8B57', stroke: '#FFFFFF', 'stroke-width': 4 }, g);
      T(g, 0, 12, 'SHORTCUT', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    } else {              // scenic route
      E('rect', { x: -96, y: -60, width: 192, height: 100, rx: 10, fill: '#8A5A3A', stroke: '#FFFFFF', 'stroke-width': 4 }, g);
      T(g, 0, -20, 'SCENIC', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
      T(g, 0, 20, 'ROUTE', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    g.x = xMark(g, 22); tr(g.x, 56, -50);
    return g;
  });
  // the boss: a framed photo of the Sun in sunglasses
  const boss = G(Lfg);
  E('rect', { x: -150, y: -140, width: 300, height: 280, rx: 10, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, boss);
  E('rect', { x: -126, y: -116, width: 252, height: 200, fill: linGrad('#4A9FE0', '#BDE9FF', true) }, boss);
  const bossSun = sun(boss, 56); tr(bossSun, 0, -16);
  [-24, 24].forEach(x => E('rect', { x: x - 22, y: -34, width: 44, height: 22, rx: 8, fill: '#121418' }, boss));
  E('path', { d: 'M-2,-24 L2,-24', stroke: '#121418', 'stroke-width': 5 }, boss);
  E('path', { d: 'M-20,8 Q0,22 20,8', fill: 'none', stroke: '#8A4A00', 'stroke-width': 5, 'stroke-linecap': 'round' }, boss);
  T(boss, 0, 120, 'THE BOSS', { size: 30, weight: 800, anchor: 'middle', fill: '#3A2A06' });
  const lumG = G(Lfg);
  chip(lumG, 'LUMINOUS', { size: 46, fill: C.energy, color: '#3A2A06', stroke: '#FFFFFF', sw: 4 });
  const lumSub = T(lumG, 0, 76, 'makes its own light', { size: 32, weight: 700, anchor: 'middle', fill: C.energyLt });
  // tips
  const jarW = G(Lfg); lwTipJar(jarW, 1.6);
  const moth = G(Lfg);
  const wingL = E('path', { d: 'M0,0 Q-26,-22 -30,4 Q-18,14 0,0 Z', fill: '#B9A98E', stroke: SC_INK, 'stroke-width': 2.5 }, moth);
  const wingR = E('path', { d: 'M0,0 Q26,-22 30,4 Q18,14 0,0 Z', fill: '#B9A98E', stroke: SC_INK, 'stroke-width': 2.5 }, moth);
  E('ellipse', { rx: 5, ry: 13, fill: '#7A6A50', stroke: SC_INK, 'stroke-width': 2 }, moth);
  const tipChip = label(Lfg, 'tips received: 0', { size: 30, color: C.energy });

  /* ================= E: space ================= */
  const spaceShot = G(Lbg);
  const space = lwSpace(spaceShot);
  E('line', { x1: 270, y1: 380, x2: 1020, y2: 380, stroke: '#FFF3B0', 'stroke-width': 4, 'stroke-dasharray': '14 12', opacity: 0.6 }, spaceShot);
  const trail = E('line', { x1: 270, y1: 380, x2: 270, y2: 380, stroke: C.energy, 'stroke-width': 8, 'stroke-linecap': 'round' }, spaceShot);
  const rayTinyW = G(spaceShot); const rayTiny = cast(rayTinyW, 'ray', {});
  T(spaceShot, 150, 610, 'Sun', { size: 30, weight: 700, anchor: 'middle', fill: C.energyLt });
  T(spaceShot, 1070, 460, 'Earth', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const timer = G(Lfg);
  E('rect', { x: -130, y: -50, width: 260, height: 100, rx: 16, fill: 'rgba(10,27,39,0.88)', stroke: C.line, 'stroke-width': 2 }, timer);
  const timerT = T(timer, 0, 8, '0:00', { size: 54, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(timer, 0, 38, 'minutes', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const dist = G(Lfg);
  arrow(dist, 560, 0, 270, 0, { color: '#FFFFFF', width: 4 }); arrow(dist, 740, 0, 1010, 0, { color: '#FFFFFF', width: 4 });
  const distChip = label(dist, '150 000 000 km', { size: 34 }); tr(distChip, 650, 0);
  const speedCard = G(Lfg);
  E('rect', { x: -380, y: -96, width: 760, height: 192, rx: 22, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, speedCard);
  T(speedCard, 0, -40, 'speed of light ≈ 300 000 km/s', { size: 44, weight: 800, anchor: 'middle', fill: C.energy });
  const sci = E('text', { x: 0, y: 22, 'font-size': 40, 'font-weight': 700, fill: '#FFFFFF', 'text-anchor': 'middle', 'font-family': FD }, speedCard);
  E('tspan', {}, sci).textContent = '= 3 × 10';
  E('tspan', { dy: -16, 'font-size': 26 }, sci).textContent = '8';
  E('tspan', { dy: 16 }, sci).textContent = ' m/s';
  T(speedCard, 0, 74, 'nothing is faster', { size: 30, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ================= G: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1430', '#2A1F4A', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFE45C', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 590, rx: 580, ry: 170, fill: glow('#FFE9A8'), opacity: 0.28 }, titleShot);
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'LIGHT WORK', { size: 104, weight: 800, anchor: 'middle', fill: '#FFF3B0', ls: 4 });
  logoT.setAttribute('stroke', '#5A4A10'); logoT.setAttribute('stroke-width', 12); logoT.setAttribute('paint-order', 'stroke'); logoT.setAttribute('stroke-linejoin', 'round');
  const logoBeam = lwLightRay(Lfg, 260, 236, 940, 236, { width: 8, heads: true, at: 0.92 });
  const epi = T(Lfg, 600, 310, 'Episode 10: Return to Sender', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const rayC = cast(Lcast, 'ray', {});
  const kavT = cast(Lcast, 'kavya', { outfit: 'pyjamas' });
  const extras = [['norman', 'neutral'], ['mirabel', 'smug'], ['dennis', 'happy'], ['rosie', 'deadpan'], ['violet', 'happy'], ['indigo', 'sad']]
    .map(([k, mood]) => ({ c: cast(Lcast, k, {}), k, mood }));
  const ROW = { ray: 100, norman: 245, mirabel: 395, dennis: 545, rosie: 690, violet: 815, indigo: 935, kavya: 1090 };
  const ORDER = { ray: 0, norman: 1, mirabel: 2, dennis: 3, rosie: 4, violet: 5, indigo: 6, kavya: 7 };
  const SCL = { ray: 0.58, norman: 0.56, mirabel: 0.56, dennis: 0.58, rosie: 0.56, violet: 0.66, indigo: 0.66, kavya: 0.56 };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = at('small') - 0.06, cC = at('this') - 0.06, cD = at('hi') - 0.06, cE = at('commute') - 0.06, cF = at('curves') - 0.06, cG = at('title') - 0.06;
  const GAP = [920, 250];                        // the crack between the curtains
  const sitT = mid('sun', 0.08);

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG), sG = on(t, cG, 1e9);
    op(recDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.15);

    /* ---------- the bedroom (A, B, C) ---------- */
    const bedOn = sA || sB || sC;
    op(bedShot, bedOn); op(finder, sB || sC ? 1 : 0);
    if (bedOn) {
      room.curtains(sA ? 0.08 * P(t, at('sun') - 0.3, 0.4) : 0.08);
      // Kavya: asleep on the pillow, then she sits bolt upright
      const up = P(t, sitT, 0.45, easeOut);
      tr(kav, lerp(205, 330, up), lerp(500, 470, up), 0.88, lerp(-80, 0, up) + (up > 0 && up < 1 ? 6 * Math.sin(up * Math.PI) : 0));
      const asleep = up < 0.05;
      let kMood = asleep ? 'deadpan' : 'annoyed', kLook = 0;
      if (sA && !asleep) kLook = t < end('sun') ? 0.7 : 0.4;
      if (sB || sC) { kMood = 'annoyed'; kLook = 0.9; }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: kMood, look: kLook, still: asleep });
      // Zzz
      op(zzz, asleep ? 1 : 0);
      zs.forEach((z, i) => { const f = ((t * 0.45 + i * 0.33) % 1); attr(z, 'x', 230 + f * 70 + i * 6); attr(z, 'y', 430 - f * 120); op(z, asleep ? Math.sin(f * Math.PI) : 0); });
      // the sunbeam: creeps up the bed onto her face, then hits her square in the face
      const face = [lerp(205, 330, up), lerp(492, 440, up)];
      const creep = P(t, at('kavya') + 0.5, end('kavya') - at('kavya') - 0.4, linear);
      const tx = lerp(560, face[0] + 30, creep), ty = lerp(575, face[1], creep), bw = lerp(70, 46, creep);
      const beamOp = sC ? 0.5 * (1 - P(t, cC + 0.2, 0.5, linear)) : 0.5;
      attr(beam, 'd', `M${GAP[0] - 18},150 L${GAP[0] + 18},150 L${(tx + bw).toFixed(1)},${(ty + bw * 0.6).toFixed(1)} L${(tx - bw).toFixed(1)},${(ty - bw * 0.6).toFixed(1)} Z`);
      attr(beamCore, 'd', `M${GAP[0] - 6},150 L${GAP[0] + 6},150 L${(tx + bw * 0.35).toFixed(1)},${(ty + bw * 0.2).toFixed(1)} L${(tx - bw * 0.35).toFixed(1)},${(ty - bw * 0.2).toFixed(1)} Z`);
      op(beam, beamOp); op(beamCore, beamOp * 0.7);
      // camera
      if (sA) camBg(bedShot, 1 + 0.04 * P(t, 0, cB, linear), 500, 420);
      else if (sB) {
        const z = P(t, mid('small', 0.3), end('small') - mid('small', 0.3), ease);
        camBg(bedShot, lerp(1.06, 1.9, z), lerp(500, GAP[0], z), lerp(420, 300, z));
      } else camBg(bedShot, 1.1 + 0.05 * P(t, cC, cD - cC, linear), 760, 400);
      // Ray in the beam (C)
      const rp = sC ? P(t, at('this') + 0.05, 0.5, pop) : 0;
      op(rayBedW, clamp(rp * 2)); tr(rayBedW, 880, 470, Math.max(0.01, 0.95 * (0.5 + 0.5 * rp)));
      rayBed.set({ t, mood: 'deadpan', look: t < mid('this', 0.6) ? -0.6 : 0, still: rp < 1 });
      op(sparks, sC ? win(t, at('this'), at('this') + 1.0, 0.2) : 0);
      spk.forEach((s, i) => { const a = i / 5 * TAU + t; tr(s, 1000 + Math.cos(a) * 130, 420 + Math.sin(a) * 150, 0.6 + 0.4 * Math.sin(t * 7 + i)); });
    }
    // A chips
    if (sA) {
      const fade = 1 - P(t, at('sun') - 0.2, 0.25, linear);
      popIn(cKav, t, mid('kavya', 0.05), 260, 200, 1, 0, fade);
      popIn(clock, t, mid('kavya', 0.3), 740, 330, 1, 0, fade);
      popIn(note, t, mid('kavya', 0.62), 470, 330, 1, -5, fade);
    } else { op(cKav, 0); op(clock, 0); op(note, 0); }
    ltKavya.set(sA ? win(t, at('sun') + 0.4, at('sun') + 3.6, 0.3) : 0);
    // B: the camera traces the beam back to the gap
    if (sB) {
      const zc = P(t, mid('small', 0.3), end('small') - mid('small', 0.3), ease), k = lerp(1.06, 1.9, zc), cx = lerp(500, GAP[0], zc), cy = lerp(420, 300, zc);
      const sc = (x, y) => [cx + k * (x - cx), cy + k * (y - cy)];
      const [gx, gy] = sc(GAP[0], 255), [fx, fy] = sc(360, 440);
      const tp = P(t, at('small') + 0.1, 1.4, easeOut);
      attr(trace, 'x1', fx); attr(trace, 'y1', fy); attr(trace, 'x2', lerp(fx, gx, tp)); attr(trace, 'y2', lerp(fy, gy, tp));
      op(trace, 1 - P(t, mid('small', 0.7), 0.3, linear));
      const rp = P(t, mid('small', 0.35), 0.4, pop);
      op(reticle, clamp(rp * 2)); tr(reticle, gx, gy, Math.max(0.01, 0.6 + 0.4 * rp), t * 30 * AMP);
      op(smallChip, win(t, mid('small', 0.45), end('small') + 0.4, 0.3)); tr(smallChip, 600, 640);
    } else { op(trace, 0); op(reticle, 0); op(smallChip, 0); }

    /* ---------- D + F: confessional ---------- */
    const confOn = sD || sF;
    conf.set(confOn, t);
    let cam = { k: 1, cx: 430, cy: 400 };
    if (confOn) {
      if (sF && t >= at('notip') - 0.06) cam = { k: 1.45 + 0.1 * P(t, at('notip'), end('notip') - at('notip') + 0.9, linear), cx: 760, cy: 470 };
      else if (sD) cam = { k: 1 + 0.05 * P(t, cD, cE - cD, linear), cx: 430, cy: 400 };
      camBg(conf, cam.k, cam.cx, cam.cy);
      op(rayC, 1); place(rayC, cam, 430, 420, 1.4);
      let mood = 'deadpan', look = 0;
      if (sD) mood = t < mid('hi', 0.5) ? 'neutral' : 'deadpan';
      else if (t < at('thboss')) { mood = t < mid('curves', 0.35) ? 'neutral' : 'annoyed'; look = t > mid('curves', 0.35) ? 0.5 : 0; }
      else if (t < at('tips')) { mood = t > mid('thboss', 0.62) ? 'annoyed' : 'neutral'; look = t < mid('thboss', 0.3) ? 0.7 : 0; }
      else { mood = t < at('notip') ? 'deadpan' : 'sad'; look = t < at('notip') ? 0.6 : 0.3; if (t > end('notip') + 0.2) mood = 'deadpan'; }
      rayC.set({ t, talk: scTalk(S, t, 'ray'), mood, look });
    } else if (!sG) op(rayC, 0);
    ltRay.set(sD ? win(t, at('hi') + 0.15, at('hi') + 3.4, 0.3) : 0);
    // hi
    const hp = sD ? P(t, mid('hi', 0.3), 0.45, pop) : 0;
    op(cRay, clamp(hp * 2.5)); tr(cRay, 870, 280, Math.max(0.01, 0.7 + 0.3 * hp));
    op(cJob, sD ? win(t, mid('hi', 0.72), cE + 0.3, 0.25) : 0); tr(cJob, 870, 470);
    // curves
    const fC = sF && t < at('thboss') - 0.06;
    op(straightG, fC ? clamp(P(t, at('curves') + 0.05, 0.35, linear) * 2) : 0); if (fC) tr(straightG, 870, 580, 0.75);
    signs.forEach((g, i) => {
      if (!fC) { op(g, 0); return; }
      const t0 = mid('curves', 0.36 + i * 0.2);
      popIn(g, t, t0, 700 + i * 200, 290 + (i === 1 ? 10 : 0), 0.9);
      const xp = P(t, t0 + 0.35, 0.3, pop); op(g.x, clamp(xp * 3)); tr(g.x, 56, -50, Math.max(0.01, xp));
    });
    // the boss
    const fB = sF && t >= at('thboss') - 0.06 && t < at('tips') - 0.06;
    if (fB) { popIn(boss, t, at('thboss') + 0.1, 870, 290, 1, 3); bossSun.upd(t); popIn(lumG, t, mid('thboss', 0.32), 870, 560, 1); op(lumSub, P(t, mid('thboss', 0.5), 0.3, linear)); }
    else { op(boss, 0); op(lumG, 0); }
    // tips
    const fT = sF && t >= at('tips') - 0.06;
    if (fT) {
      const jp = P(t, at('tips') + 0.1, 0.5, easeOut);
      op(jarW, 1); place(jarW, cam, lerp(1300, 790, jp), 500, 1, lerp(-12, 0, jp));
      const mt = t - (at('notip') + 0.35);     // the moth
      if (mt > 0) {
        const mx = 790 + mt * 120 + Math.sin(mt * 5) * 30, my = 410 - mt * 130 + Math.sin(mt * 9) * 12;
        op(moth, mt < 3 ? 1 : 0); place(moth, cam, mx, my, 1.1, Math.sin(mt * 6) * 15);
        const fl = Math.abs(Math.sin(t * 22 * AMP)) * 0.7 + 0.3;
        wingL.setAttribute('transform', `scale(${fl.toFixed(2)} 1)`); wingR.setAttribute('transform', `scale(${fl.toFixed(2)} 1)`);
      } else op(moth, 0);
      op(tipChip, t < at('notip') - 0.06 ? win(t, mid('tips', 0.6), cG, 0.25) : 0); tr(tipChip, 860, 680);
    } else { op(jarW, 0); op(moth, 0); op(tipChip, 0); }

    /* ---------- E: space ---------- */
    op(spaceShot, sE);
    if (sE) {
      space.upd(t);
      const tp = P(t, at('commute') + 0.2, end('commute') - at('commute') - 0.2, linear);
      const x = lerp(270, 1020, tp);
      attr(trail, 'x2', x); tr(rayTinyW, x, 380, 0.26);
      rayTiny.set({ t, mood: 'deadpan', still: true });
      const sec = Math.round(tp * 500);
      setText(timerT, Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'));
      popIn(timer, t, at('commute') + 0.05, 600, 190, 1);
      op(dist, win(t, mid('commute', 0.45), at('speed') + 0.2, 0.3)); tr(dist, 0, 470);
      popIn(speedCard, t, at('speed') + 0.1, 600, 600, 1);
    } else { op(timer, 0); op(dist, 0); op(speedCard, 0); }

    /* ---------- G: title card ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0); op(logoBeam, 0);
    if (sG) {
      tr(rayP, 600, 600, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      op(logoBeam, 1); logoBeam.set(P(t, at('title') + 0.35, 0.6, easeOut));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = k => mid('title', 0.5) + ORDER[k] * 0.12;
      const pk = k => P(t, castT(k), 0.45, pop);
      extras.forEach(e => { const p = pk(e.k); op(e.c, clamp(p * 3)); tr(e.c, ROW[e.k], 560 + 30 * (1 - clamp(p)), Math.max(0.01, SCL[e.k] * p)); e.c.set({ t, mood: e.mood }); });
      let p = pk('ray'); op(rayC, clamp(p * 3)); tr(rayC, ROW.ray, 560 + 30 * (1 - clamp(p)), Math.max(0.01, SCL.ray * p)); rayC.set({ t, mood: 'deadpan' });
      p = pk('kavya'); op(kavT, clamp(p * 3)); tr(kavT, ROW.kavya, 575 + 30 * (1 - clamp(p)), Math.max(0.01, SCL.kavya * p)); kavT.set({ t, mood: 'annoyed' });
    } else { extras.forEach(e => op(e.c, 0)); op(kavT, 0); }
  };
});

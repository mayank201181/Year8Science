/* Scene 0: Cold open (no chapter card).
   Living room, 34 °C: Kavya melting ("Kavya, age 12", "34 °C") -> Mum's aircon note -> "basically soup"
   (2:00 PM) -> Block 34 from outside -> "Don't." -> the crew switches to a THERMAL CAMERA: thermal energy
   streams off Kavya into the room -> it gathers into a glowing ball -> Jules pops out (thermal energy, heat)
   -> "Jules / joules" card -> Cel's confessional (stuck on 34 °C), the sighing cutaway, the weather ticker
   -> title card: BLOCK 34, Episode 9: The Aircon Rule, the cast pops in. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const popAt = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * mul); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A / C / D: the living room ================= */
  const livShot = G(Lbg), livWrap = G(livShot);
  const liv = bkLiving(livWrap);
  // Mum's note, taped under the aircon
  const note = G(livWrap);
  E('rect', { x: -150, y: -62, width: 300, height: 124, rx: 6, fill: '#FFF8C4', stroke: '#D9C36A', 'stroke-width': 3 }, note);
  E('rect', { x: -30, y: -74, width: 60, height: 20, fill: '#FFFFFF', opacity: 0.7, transform: 'rotate(-4)' }, note);   // tape
  const nt1 = T(note, 0, -16, 'AIRCON ONLY', { size: 32, weight: 800, anchor: 'middle', fill: '#C62828' });
  const nt2 = T(note, 0, 22, 'AFTER 9 P.M.', { size: 32, weight: 800, anchor: 'middle', fill: '#C62828' });
  const nt3 = T(note, 60, 52, '— Mum ♥', { size: 24, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  [nt1, nt2, nt3].forEach(n => n.setAttribute('font-style', 'italic'));
  // the thermal camera overlay
  const thermal = G(livShot);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#140A3C', opacity: 0.86 }, thermal);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: glow('#3A1F8C'), opacity: 0.5 }, thermal);
  const tbar = G(thermal); tr(tbar, 900, 108);
  E('rect', { x: 0, y: -14, width: 200, height: 28, rx: 6, fill: linGrad('#2B1A8C', '#FFF2A0', false), stroke: '#FFFFFF', 'stroke-width': 2 }, tbar);
  T(tbar, -12, 9, 'cold', { size: 26, weight: 700, anchor: 'end', fill: '#B7A8FF' });
  T(tbar, 212, 9, 'hot', { size: 26, weight: 700, fill: '#FFE45C' });
  const tcamTxt = T(thermal, 1150, 62, 'THERMAL CAMERA', { size: 30, weight: 800, anchor: 'end', fill: '#FFE45C' });
  const tcamDot = E('circle', { cx: 860, cy: 52, r: 10, fill: '#FF3B3B' }, thermal);

  /* ================= B: Block 34 from outside ================= */
  const strShot = G(Lbg), strWrap = G(strShot);
  const street = bkStreet(strWrap);

  /* ================= F: Cel's confessional ================= */
  const conf = bkConfessional(Lbg, 'cel');

  /* ================= G: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0C06', '#6E2410', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 18; i++) { const a0 = i / 18 * TAU, a1 = a0 + TAU / 44; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFB45C', opacity: 0.09 }, titleShot);
  E('ellipse', { cx: 600, cy: 590, rx: 600, ry: 200, fill: glow('#FF8A3D'), opacity: 0.4 }, titleShot);

  /* ================= the cast ================= */
  const kHot = G(Lcast);                    // Kavya as the thermal camera sees her (same geometry as scKavya)
  E('circle', { cx: 0, cy: 0, r: 230, fill: glow('#FF8A3D'), opacity: 0.55 }, kHot);
  E('path', { d: 'M-100,140 Q-96,62 -40,52 L40,52 Q96,62 100,140 Z', fill: ball('#FF7A2E', '#B3262E') }, kHot);
  E('rect', { x: -18, y: 30, width: 36, height: 28, fill: '#FFB347' }, kHot);
  E('path', { d: 'M74,-40 Q132,-10 104,60 Q96,20 70,-6 Z', fill: '#C8401E' }, kHot);
  E('ellipse', { cx: 0, cy: -34, rx: 74, ry: 80, fill: ball('#FFF6B0', '#FF7A2E') }, kHot);
  E('path', { d: 'M-76,-34 Q-80,-120 0,-118 Q80,-120 76,-34 Q60,-84 8,-80 Q-30,-96 -76,-34 Z', fill: '#E0601E', opacity: 0.9 }, kHot);
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const jules = cast(Lcast, 'jules', { mood: 'happy' });
  const cel = cast(Lcast, 'cel', { mood: 'deadpan' });
  const ROW = [['cel', 170, 470, 'deadpan'], ['jules', 385, 470, 'happy'], ['gus', 600, 470, 'smug'], ['zip', 815, 470, 'happy'], ['ray', 1030, 470, 'smug'],
    ['woolly', 600, 632, 'sad'], ['vic', 820, 632, 'neutral']];
  const extras = ROW.map(([k, x, y, mood]) => ({ c: k === 'cel' || k === 'jules' ? null : cast(Lcast, k, { mood }), k, x, y, mood }));
  const ORDER = { kavya: 0, cel: 1, jules: 2, gus: 3, zip: 4, ray: 5, woolly: 6, vic: 8 };

  /* ================= props, labels ================= */
  // A: who / where / how hot
  const cKav = bkChip(Lfg, 'Kavya, age 12', { size: 34 });
  const cJune = bkChip(Lfg, 'June · Singapore', { size: 30 });
  const c34 = G(Lfg);
  const c34c = chip(c34, '34 °C', { size: 70, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const c34w = heatWaves(c34, { n: 3, h: 70, spacing: 40, color: '#FF8A3D', width: 6 }); tr(c34w, 0, -70);
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Lives in Block 34. Melting.');
  const clock = bkClock(Lfg);
  const soupChip = bkChip(Lfg, '≈ soup', { size: 30, color: C.heat });
  // B: the coincidence
  const cBlk = chip(Lfg, 'Block 34', { size: 46, fill: 'rgba(10,27,39,0.88)', stroke: C.energy, sw: 3, color: C.energy });
  const cTmp = chip(Lfg, '34 °C', { size: 46, fill: '#D32F2F', stroke: '#FFFFFF', sw: 3, color: '#FFFFFF' });
  const ring = E('ellipse', { rx: 92, ry: 40, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, Lfg);
  // D: thermal energy streaming off Kavya
  const KC = [910, 560];                                  // Kavya's chest on screen in D
  const GATHER = [500, 380];
  const WISP = [[160, 300], [360, 170], [640, 150], [660, 420], [420, 560], [200, 640], [1150, 300], [760, 300]];
  const wispG = G(Lfg), dots = [];
  WISP.forEach(([x, y], i) => {
    const cx = (KC[0] + x) / 2 + (i % 2 ? 80 : -80), cy = (KC[1] + y) / 2 - 90;
    for (let j = 0; j < 4; j++) {
      const d = G(wispG);
      E('circle', { r: 22, fill: glow('#FF8A3D') }, d); E('circle', { r: 7, fill: '#FFE45C' }, d);
      dots.push({ d, x, y, cx, cy, ph: j / 4 + i * 0.13 });
    }
  });
  const ball_ = G(Lfg);
  E('circle', { r: 120, fill: glow('#FF8A3D', '#FFE45C') }, ball_);
  E('circle', { r: 40, fill: ball('#FFF2A0', '#FF8A3D') }, ball_);
  const seeChip = bkChip(Lfg, 'something nobody can see', { size: 32, color: C.energy });
  const wayChip = bkChip(Lfg, 'it only travels one way', { size: 30, color: C.heat });
  // E: Jules
  const ltJules = scLowerThird(Lhud, 'JULES', 'Thermal energy. Hot to cold only.');
  const cTE = chip(Lfg, 'thermal energy', { size: 40, fill: 'rgba(10,27,39,0.88)', stroke: C.heat, sw: 3, color: C.heat });
  const cHeat = bkChip(Lfg, '= heat', { size: 36, color: '#FFFFFF' });
  const brand = G(Lfg);
  E('rect', { x: -230, y: -95, width: 460, height: 190, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.heat, 'stroke-width': 3 }, brand);
  T(brand, -200, -22, '**Jules**  = me', { size: 40, weight: 600, fill: '#FFFFFF', boldFill: C.heat });
  T(brand, -200, 50, '**joules, J**  = my unit', { size: 40, weight: 600, fill: '#FFFFFF', boldFill: C.energy });
  const brandStar = spark(Lfg, 18, { seed: 3 });
  // F: Cel
  const ltCel = scLowerThird(Lhud, 'CEL', 'Thermometer. Measures temperature. Not heat.');
  const readout = G(Lfg);
  E('rect', { x: -170, y: -70, width: 340, height: 140, rx: 18, fill: '#0B1118', stroke: '#FF4D4D', 'stroke-width': 4 }, readout);
  T(readout, 0, 34, '34 °C', { size: 92, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  T(readout, 0, 104, 'since 9 a.m.', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // F: the sighing cutaway (what Cel sees all day)
  const inset = G(Lfg);
  E('rect', { x: -200, y: -130, width: 400, height: 260, rx: 16, fill: '#D7E2CF', stroke: '#FFFFFF', 'stroke-width': 6 }, inset);
  const insClipId = 'bkcoldins';
  const icp = E('clipPath', { id: insClipId }, defs()); E('rect', { x: -200, y: -130, width: 400, height: 260, rx: 16 }, icp);
  const insIn = G(inset, { 'clip-path': `url(#${insClipId})` });
  E('rect', { x: -200, y: 40, width: 400, height: 90, fill: '#C98F5A' }, insIn);
  const miniKav = cast(insIn, 'kavya', { mood: 'sad' });
  const sigh = T(insIn, 0, -80, 'sigh…', { size: 34, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  sigh.setAttribute('font-style', 'italic');
  T(inset, -186, -100, 'CEL-CAM', { size: 22, weight: 800, fill: '#C62828' });
  const ticker = G(Lfg);
  E('rect', { x: 0, y: 0, width: 1200, height: 64, fill: '#0E1A24', opacity: 0.92 }, ticker);
  E('rect', { x: 0, y: 0, width: 200, height: 64, fill: '#D32F2F' }, ticker);
  T(ticker, 100, 44, 'WEATHER', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const tickClip = 'bkcoldtick'; const tcp = E('clipPath', { id: tickClip }, defs()); E('rect', { x: 204, y: 0, width: 996, height: 64 }, tcp);
  const tickIn = G(ticker, { 'clip-path': `url(#${tickClip})` });
  const tickTxt = T(tickIn, 0, 44, 'TODAY 34 °C   ·   TONIGHT 34 °C   ·   TOMORROW 34 °C   ·   FOREVER 34 °C   ·   TODAY 34 °C   ·   TONIGHT 34 °C', { size: 32, weight: 700, fill: '#FFE45C' });
  // G: logo
  const logo = G(Lfg); bkLogo(logo);
  const epi = T(Lfg, 600, 345, 'Episode 9: The Aircon Rule', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = at('block') - 0.06, cC = at('dont') - 0.06, cD = at('see') - 0.06, cF = at('thcel') - 0.06, cG = at('title') - 0.06;
  const cJ = at('jules') - 0.1;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cF), sF = on(t, cF, cG), sG = on(t, cG, 1e9);

    /* ---------- living room (A, C, D) ---------- */
    const livOn = Math.max(sA, sC, sD);
    op(livShot, livOn);
    let kavOn = 0, julesOn = 0, celOn = 0;
    if (livOn) {
      const acOn = 0;
      liv.upd(t, { fan: 0.35 * AMP, ac: acOn });
      // Mum's note
      const np = sA ? P(t, mid('rule', 0.35), 0.45, pop) : (t > cB ? 1 : 0);
      op(note, clamp(np * 2.5) * (sD ? 0 : 1)); tr(note, 980, 285, Math.max(0.01, 0.6 + 0.4 * np), -3 + Math.sin(t * 1.5) * 1.5 * AMP);
      let kx = 820, ky = 590, ks = 1.35, mood = 'annoyed', look = 0, sweat = 1;
      if (sA) {
        const push = P(t, 0, cB, linear);
        camBg(livWrap, 1 + 0.06 * push, 760, 420);
        if (t > mid('rule', 0.4) && t < end('rule')) look = 0.75;
        if (t >= at('soup')) { mood = 'sad'; ky += 28 * P(t, at('soup'), 0.8, ease); }
      } else if (sC) {
        camBg(livWrap, 1.35, 820, 470);
        kx = 800; ky = 600; ks = 1.95; mood = 'deadpan';
      } else {
        const drift = P(t, cD, cF - cD, linear);
        camBg(livWrap, 1.04, lerp(760, 560, drift), 400);
        kx = KC[0]; ky = 610; ks = 1.12; mood = t >= cJ ? 'deadpan' : 'sad';
      }
      kavOn = 1;
      tr(kav, kx, ky, ks);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look, sweat });
      tr(kHot, kx, ky, ks);
      // thermal camera: on from 'see' until Jules appears
      const th = sD ? Math.min(P(t, cD + 0.15, 0.5, linear), 1 - P(t, cJ, 0.3, linear)) : 0;
      op(thermal, th); op(kHot, th); op(kav, 1 - th);
      op(tcamDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2);
      // A chips
      const a1 = sA ? 1 - P(t, at('soup') - 0.3, 0.3, linear) : 0;
      popAt(cKav, t, mid('kavya', 0.12), 270, 200, 1, 0, a1);
      popAt(cJune, t, mid('kavya', 0.38), 270, 280, 1, 0, a1);
      popAt(c34, t, mid('kavya', 0.7), 270, 420, 1, -4 + Math.sin(t * 3) * 2 * AMP, a1);
      c34w.upd(t);
      ltKavya.set(sA ? win(t, at('rule') + 0.05, at('rule') + 3.3, 0.3) : 0);
      // soup: clock + "≈ soup"
      if (sA && t > at('soup') - 0.2) {
        clock.set('2:00'); popIn(clock, t, at('soup'), 280, 300, 1.1);
        popIn(soupChip, t, mid('soup', 0.75), 280, 420);
      } else { op(clock, 0); op(soupChip, 0); }
      // D: wisps of thermal energy, then they gather into a ball
      if (sD && t < at('jules') + 0.3) {
        const gp = P(t, mid('move', 0.35), end('move') - mid('move', 0.35) + 0.1, ease);
        op(wispG, th > 0 ? 1 : 1 - P(t, cJ, 0.2, linear));
        dots.forEach(o => {
          const u = ((t - cD) * 0.32 * AMP + o.ph) % 1;
          const x0 = KC[0] - 10, y0 = KC[1] - 60;
          let x = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * o.cx + u * u * o.x;
          let y = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * o.cy + u * u * o.y;
          x = lerp(x, GATHER[0] + 30 * Math.cos(o.ph * 40 + t * 3), gp); y = lerp(y, GATHER[1] + 30 * Math.sin(o.ph * 40 + t * 3), gp);
          tr(o.d, x, y, 0.7 + 0.5 * Math.sin(u * Math.PI));
          op(o.d, lerp(Math.sin(u * Math.PI), 1, gp));
        });
        const bp = P(t, mid('move', 0.6), 0.6, ease);
        op(ball_, bp * (1 - P(t, at('jules'), 0.15, linear))); tr(ball_, GATHER[0], GATHER[1], 0.5 + 0.6 * bp + 0.05 * Math.sin(t * 8));
        op(seeChip, win(t, mid('see', 0.45), at('move') + 0.4, 0.3)); tr(seeChip, 420, 660);
        op(wayChip, win(t, mid('move', 0.5), at('jules'), 0.3)); tr(wayChip, 420, 660);
      } else { op(wispG, 0); op(ball_, 0); op(seeChip, 0); op(wayChip, 0); }
      // E: Jules
      if (sD && t >= cJ) {
        julesOn = 1;
        const jp = P(t, at('jules'), 0.5, pop);
        op(jules, clamp(jp * 3)); tr(jules, GATHER[0], GATHER[1] + 10, Math.max(0.01, 1.3 * jp));
        const jm = t >= at('brand') && t < mid('brand', 0.85) ? 'smug' : 'happy';
        jules.set({ t, talk: scTalk(S, t, 'jules'), mood: jm, look: t >= at('brand') ? 0.3 : 0, glow: 0.8 });
        ltJules.set(win(t, at('jules') + 0.15, at('jules') + 3.4, 0.3));
        const e1 = 1 - P(t, at('brand') - 0.1, 0.25, linear);
        if (e1 > 0) { popIn(cTE, t, mid('jules', 0.3), 880, 300); popIn(cHeat, t, mid('jules', 0.55), 880, 380); }
        if (e1 < 1) { op(cTE, e1 * (t > mid('jules', 0.3) ? 1 : 0)); op(cHeat, e1 * (t > mid('jules', 0.55) ? 1 : 0)); }
        const bp = P(t, at('brand') + 0.05, 0.45, pop);
        op(brand, clamp(bp * 2.5)); tr(brand, 880, 330, Math.max(0.01, 0.7 + 0.3 * bp), 2);
        op(brandStar, P(t, mid('brand', 0.45), 0.3, linear)); tr(brandStar, GATHER[0] - 4, GATHER[1] - 62); brandStar.upd(t);
      } else { op(jules, 0); ltJules.set(0); op(cTE, 0); op(cHeat, 0); op(brand, 0); op(brandStar, 0); }
    } else {
      op(cKav, 0); op(cJune, 0); op(c34, 0); ltKavya.set(0); op(clock, 0); op(soupChip, 0); op(wispG, 0); op(ball_, 0);
      op(seeChip, 0); op(wayChip, 0); op(cTE, 0); op(cHeat, 0); op(brand, 0); op(brandStar, 0); ltJules.set(0); op(kHot, 0);
    }

    /* ---------- B: Block 34 from outside ---------- */
    op(strShot, sB);
    if (sB) {
      street.upd(t);
      const push = P(t, cB, cC - cB + 0.4, easeOut);
      camBg(strWrap, 1 + 0.45 * push, 320, 200);
      const k = 1 + 0.45 * push;
      popIn(cBlk, t, at('block') + 0.25, 360, 560);
      popIn(cTmp, t, mid('block', 0.8), 950, 380, 1, 3);
      op(ring, P(t, at('block') + 0.3, 0.3, linear)); tr(ring, 320, 200 - 40 * k, k);
    } else { op(cBlk, 0); op(cTmp, 0); op(ring, 0); }

    /* ---------- F: Cel's confessional ---------- */
    conf.set(sF, t);
    if (sF) {
      celOn = 1;
      const push = P(t, cF, cG - cF, linear);
      camBg(conf, 1 + 0.05 * push, 430, 380);
      tr(cel, 430, 395, 1.5 * (1 + 0.04 * push));
      let mood = 'deadpan', look = 0;
      if (t >= at('thsigh') && t < mid('thsigh', 0.5)) { mood = 'annoyed'; look = 0.7; }
      cel.set({ t, talk: scTalk(S, t, 'cel'), mood, look, temp: 34 });
      ltCel.set(win(t, at('thcel') + 0.1, at('thcel') + 3.4, 0.3));
      const rp = P(t, mid('thcel', 0.45), 0.45, pop);
      op(readout, clamp(rp * 2.5) * (1 - P(t, at('thsigh') - 0.1, 0.2, linear))); tr(readout, 870, 300, Math.max(0.01, 0.7 + 0.3 * rp));
      // the cutaway: Kavya walks past, looks at Cel, sighs, walks off
      const ip = P(t, at('thsigh'), 0.35, pop);
      const iOut = P(t, mid('thsigh', 0.55), 0.25, linear);
      op(inset, clamp(ip * 2.5) * (1 - iOut)); tr(inset, 870, 300, Math.max(0.01, 0.8 + 0.2 * ip), 2);
      const walk = clamp((t - at('thsigh')) / Math.max(0.1, mid('thsigh', 0.5) - at('thsigh')));
      const kx = walk < 0.35 ? lerp(-260, 0, walk / 0.35) : walk < 0.75 ? 0 : lerp(0, 260, (walk - 0.75) / 0.25);
      tr(miniKav, kx, 70, 0.75);
      const stopped = walk >= 0.35 && walk < 0.75;
      miniKav.set({ t, mood: stopped ? 'sad' : 'annoyed', look: stopped ? 0 : (walk < 0.35 ? 0.6 : -0.6), sweat: 1 });
      op(sigh, stopped ? P(t, at('thsigh') + 0.35 * (mid('thsigh', 0.5) - at('thsigh')), 0.3, linear) : 0);
      tr(sigh, 0, -80 - 20 * clamp(walk * 2 - 0.7));
      const tp = P(t, mid('thsigh', 0.55), 0.35, easeOut);
      op(ticker, tp); tr(ticker, 0, 612 + 70 * (1 - tp));
      tr(tickTxt, -((t - mid('thsigh', 0.55)) * 140 * AMP) % 760, 0);
    } else { ltCel.set(0); op(readout, 0); op(inset, 0); op(ticker, 0); }

    /* ---------- G: title card, the cast pops in ---------- */
    op(titleShot, sG); op(logo, 0); op(epi, 0);
    if (sG) {
      tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 215, Math.max(0.01, 0.78 * (0.5 + 0.5 * lp)));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = k => mid('title', 0.5) + ORDER[k] * 0.12;
      extras.forEach(e => {
        const c = e.c || (e.k === 'cel' ? cel : jules);
        const p = P(t, castT(e.k), 0.45, pop);
        op(c, clamp(p * 3)); tr(c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, (e.k === 'ray' || e.k === 'jules' ? 0.56 : 0.62) * p));
        c.set({ t, mood: e.mood, look: 0, temp: 34, phone: 0 });
      });
      celOn = 1; julesOn = 1;
      const pk = P(t, castT('kavya'), 0.45, pop);
      kavOn = 1;
      op(kav, clamp(pk * 3)); tr(kav, 380, 625 + 30 * (1 - clamp(pk)), Math.max(0.01, 0.56 * pk)); kav.set({ t, mood: 'annoyed' });
    } else extras.forEach(e => { if (e.c) op(e.c, 0); });

    if (!kavOn) op(kav, 0);
    if (!julesOn) op(jules, 0);
    if (!celOn) op(cel, 0); else if (sF) op(cel, 1);
  };
});

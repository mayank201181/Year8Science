/* Scene 0: Cold open (no chapter card).
   Living room: Kavya, 12, on the sofa doing nothing (SATURDAY, 34 °C, aircon on) -> a breath counter ticks 1..4 ->
   documentary zoom into her chest -> Lung International, the airport in her lungs (two terminals, 20 000 flights a
   day, travellers in and out, Nigel drifting through) -> Dennis's confessional (the diaphragm: a dome of muscle
   under the lungs; contract / relax; 12 years, no lunch break; the breath counter rolls 012 -> 013) ->
   title card "LUNG HAUL, Episode 3: Arrivals and Departures" with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const label = (parent, text, o) => { o = o || {}; return lhChip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 }); };

  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the living room ================= */
  const homeShot = G(Lbg), homeWrap = G(homeShot);
  const living = lhLiving(homeWrap);
  const kav = cast(homeWrap, 'kavya', { mood: 'deadpan' });
  const cSat = label(Lfg, 'SATURDAY', { size: 40, color: LH.signTx, stroke: LH.signTx });
  const cNone = label(Lfg, 'activity: none', { size: 30 });
  const cHot = label(Lfg, '34 °C outside', { size: 30, color: '#FFB27A', stroke: '#FFB27A' });
  const cAc = label(Lfg, 'aircon: ON', { size: 28, color: C.air, stroke: C.air });
  const ltKavya = scLowerThird(Lhud, ...LH_LOWER.kavya);
  const counter = G(Lfg);
  E('rect', { x: -170, y: -50, width: 340, height: 100, rx: 16, fill: 'rgba(10,27,39,0.9)', stroke: '#FFFFFF', 'stroke-width': 3 }, counter);
  T(counter, -140, 14, 'BREATHS:', { size: 36, weight: 800, fill: '#FFFFFF' });
  const countTx = T(counter, 130, 18, '0', { size: 58, weight: 800, anchor: 'end', fill: LH.signTx });

  /* ================= B: zoom into the chest ================= */
  const CHEST = [600, 562];
  const reticle = G(Lfg);
  E('circle', { r: 62, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const pinkOut = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#E86A8E' }, Lfg);
  const cBusy = label(Lfg, 'the busiest place in her body', { size: 34, color: LH.signTx });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });

  /* ================= C: Lung International ================= */
  const airShot = G(Lbg), airWrap = G(airShot);
  lhTerminal(airWrap);
  const plane = lhPlane(airWrap, 1.1, '#FFFFFF');
  const trav = G(airWrap), travs = [];
  for (let i = 0; i < 7; i++) travs.push({ el: lhMol(trav, 'O2', 17), y: 600 + (i % 2) * 22, ph: i / 7, dir: 1 });
  for (let i = 0; i < 4; i++) travs.push({ el: lhMol(trav, 'CO2', 15), y: 690 - (i % 2) * 18, ph: i / 4 + 0.1, dir: -1 });
  const nigelBg = cast(airWrap, 'nigel', { mood: 'neutral' });
  const sT1 = lhSign(Lfg, 'TERMINAL 1 · LEFT LUNG', { size: 30, icon: 'plane' });
  const sT2 = lhSign(Lfg, 'TERMINAL 2 · RIGHT LUNG', { size: 30, icon: 'plane' });
  const cFlights = label(Lfg, '≈ 20 000 flights a day (= breaths)', { size: 34, color: LH.signTx, stroke: LH.signTx });

  /* ================= D: Dennis's confessional ================= */
  const conf = lhConf(Lbg, 'dennis');
  const ltDennis = scLowerThird(Lhud, ...LH_LOWER.dennis);
  const kwDia = G(Lfg);
  lhChip(kwDia, 'diaphragm', { size: 54, fill: LH.muscle, color: '#FFFFFF', stroke: '#FFD0D8', sw: 4 });
  T(kwDia, 0, 82, 'a muscle', { size: 30, weight: 600, anchor: 'middle', fill: '#FFD0D8' });
  const inset = G(Lfg);
  E('rect', { x: -190, y: -200, width: 380, height: 420, rx: 18, fill: '#120A12', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.85 }, inset);
  const diaGlow = E('ellipse', { cx: 0, cy: 100, rx: 170, ry: 60, fill: glow(LH.signTx) }, inset);
  const chestG = G(inset); tr(chestG, 0, -10, 0.6);
  const chest = lhChest(chestG);
  const insetLbl = G(Lfg);
  T(insetLbl, 0, 0, 'diaphragm: a dome of', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(insetLbl, 0, 38, 'muscle under the lungs', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const insetArrow = arrow(Lfg, 1010, 470, 950, 432, { color: LH.signTx, width: 6, head: 20 });
  const cContract = lhChip(Lfg, 'CONTRACT', { size: 60, fill: LH.muscle, color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const cRelax = lhChip(Lfg, 'RELAX', { size: 60, fill: '#3F7FD9', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const cert = G(Lfg);
  E('rect', { x: -230, y: -150, width: 460, height: 300, rx: 10, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, cert);
  E('rect', { x: -206, y: -126, width: 412, height: 252, fill: '#FFF8E6', stroke: '#C9A24A', 'stroke-width': 3 }, cert);
  T(cert, 0, -70, 'LONG SERVICE AWARD', { size: 30, weight: 800, anchor: 'middle', fill: '#6B4E12' });
  T(cert, 0, -10, '12 YEARS', { size: 56, weight: 800, anchor: 'middle', fill: LH.muscleDk });
  T(cert, 0, 44, 'lunch breaks taken:', { size: 28, weight: 600, anchor: 'middle', fill: '#5A4A3A', font: FB });
  const zero = T(cert, 0, 100, '0', { size: 52, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  const cnt = G(Lfg);
  E('rect', { x: -250, y: -90, width: 500, height: 180, rx: 18, fill: '#11161C', stroke: '#3A4B5C', 'stroke-width': 6 }, cnt);
  T(cnt, 0, -46, 'BREATHS SINCE BIRTH', { size: 28, weight: 800, anchor: 'middle', fill: '#A4BCCB' });
  E('rect', { x: -230, y: -24, width: 460, height: 90, rx: 10, fill: '#1C242E' }, cnt);
  T(cnt, 0, 120, '(roughly)', { size: 26, weight: 600, anchor: 'middle', fill: '#A4BCCB', font: FB });
  T(cnt, 4, 44, '87,600,0', { size: 56, weight: 800, anchor: 'end', fill: LH.signTx });
  const cpId = 'lhcoldcnt';
  const cp = E('clipPath', { id: cpId }, defs()); E('rect', { x: 4, y: -22, width: 96, height: 86 }, cp);
  const digits = G(cnt, { 'clip-path': `url(#${cpId})` });
  const d12 = T(digits, 6, 44, '12', { size: 56, weight: 800, fill: LH.signTx });
  const d13 = T(digits, 6, 44, '13', { size: 56, weight: 800, fill: '#FFFFFF' });

  /* ================= E: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0E1C', '#5A1F33', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFD23F', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 560, rx: 580, ry: 200, fill: glow('#F48FA6'), opacity: 0.35 }, titleShot);
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'LUNG HAUL', { size: 118, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 4 });
  logoT.setAttribute('stroke', '#5A1F33'); logoT.setAttribute('stroke-width', 14); logoT.setAttribute('paint-order', 'stroke'); logoT.setAttribute('stroke-linejoin', 'round');
  const tPlane = lhPlane(Lfg, 1.3, '#FFFFFF');
  const epi = T(Lfg, 600, 296, 'Episode 3: Arrivals and Departures', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const ROW = [['dennis', 170, 485, 'deadpan', 0.55], ['iggy', 385, 485, 'happy', 0.5], ['alvi', 600, 495, 'happy', 0.55], ['ozzie', 800, 495, 'happy', 0.55],
    ['colin', 1020, 495, 'smug', 0.52], ['kavya', 420, 640, 'annoyed', 0.5], ['smokey', 640, 650, 'smug', 0.5], ['nigel', 870, 655, 'neutral', 0.5]];
  const crew = ROW.map(([k, x, y, mood, s], i) => ({ c: cast(Lcast, k, { mood }), k, x, y, mood, s, i }));

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = at('inside') - 0.08, cC = at('airport') - 0.06, cD = at('hi') - 0.06, cE = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, 1e9);
    living.upd(t);

    /* ---------- A + B: living room, then the zoom ---------- */
    op(homeShot, sA);
    if (sA) {
      const zoom = t >= cB;
      const zp = zoom ? P(t, cB + 0.2, end('inside') - cB - 0.5, easeIn) : 0;
      const k = zoom ? Math.pow(14, zp) : 1 + 0.04 * P(t, 0, cB, linear);
      camBg(homeWrap, k, CHEST[0], CHEST[1]);
      // Kavya breathes: a slow rise and fall of her chest (faster count beats during "count")
      const br = t >= at('count') && t < end('count') ? wave(t - at('count'), (end('count') - at('count')) / 4) : wave(t, 4);
      const sink = 12 * P(t, mid('resting', 0.72), 0.5, ease);
      tr(kav, 600, 430 + sink - 5 * br * AMP, 1.35 * (1 + 0.012 * br));
      let mood = 'deadpan', look = 0;
      if (t >= at('resting') && t < end('resting')) mood = t > mid('resting', 0.7) ? 'smug' : 'annoyed';
      if (t >= at('count') && t < end('count') + 0.3) { mood = 'annoyed'; look = 0.6; }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look });
      const chipsOff = 1 - P(t, at('count') - 0.2, 0.25, linear);
      op(cSat, 1); popIn(cSat, t, mid('kavya', 0.45), 990, 322); op(cSat, P(t, mid('kavya', 0.45), 0.2, linear) * chipsOff);
      popIn(cNone, t, mid('kavya', 0.8), 990, 396); op(cNone, P(t, mid('kavya', 0.8), 0.2, linear) * chipsOff);
      popIn(cHot, t, mid('resting', 0.2), 300, 470); op(cHot, P(t, mid('resting', 0.2), 0.2, linear) * chipsOff);
      popIn(cAc, t, mid('resting', 0.45), 1060, 244); op(cAc, P(t, mid('resting', 0.45), 0.2, linear) * chipsOff);
      ltKavya.set(zoom ? 0 : win(t, at('resting') + 0.1, at('resting') + 3.3, 0.3));
      // the breath counter
      const cOn = zoom ? 0 : P(t, at('count') - 0.1, 0.3, linear);
      op(counter, cOn); tr(counter, 980, 330);
      const n = Math.min(4, Math.floor(clamp((t - at('count')) / (end('count') - at('count'))) * 4 + (t >= at('count') ? 1 : 0)));
      setText(countTx, String(Math.max(0, n)));
      // zoom furniture
      op(finder, zoom ? 1 : 0);
      setText(zoomTxt, 'ZOOM ×' + Math.round(k));
      const rp = zoom ? P(t, cB, 0.4, pop) : 0;
      op(reticle, zoom ? clamp(rp * 2) * (1 - P(t, end('inside') - 0.7, 0.3, linear)) : 0);
      tr(reticle, CHEST[0], CHEST[1], Math.max(0.01, (0.6 + 0.4 * rp) * (1 + zp * 0.6)), t * 30 * AMP);
      op(pinkOut, zoom ? P(t, end('inside') - 0.7, 0.6, linear) : 0);
      op(cBusy, zoom ? win(t, mid('inside', 0.45), cC + 0.1, 0.25) : 0); tr(cBusy, 600, 640);
    } else { ltKavya.set(0); op(counter, 0); op(finder, 0); op(reticle, 0); op(pinkOut, 0); op(cBusy, 0); [cSat, cNone, cHot, cAc].forEach(c => op(c, 0)); }

    /* ---------- C: Lung International ---------- */
    op(airShot, sC);
    if (sC) {
      const lc = t - cC;
      camBg(airWrap, 1.08 - 0.08 * P(t, cC, 1.2, easeOut) + 0.03 * P(t, cC + 1.2, cD - cC, linear), 600, 400);
      const pp = clamp(lc / 4.5);
      tr(plane, lerp(160, 1060, pp), 250 - 60 * pp, 1.1, -8);
      op(plane, pp < 1 ? 1 : 0);
      travs.forEach(v => { const f = (lc * 0.12 + v.ph) % 1, x = v.dir > 0 ? lerp(-60, 1260, f) : lerp(1260, -60, f); tr(v.el, x, v.y + 4 * Math.abs(Math.sin(lc * 6 + v.ph * 9)) * -1); });
      tr(nigelBg, lerp(1000, 760, clamp(lc / 7)), 545, 0.5); nigelBg.set({ t, mood: 'neutral', look: -0.3 });
      popIn(sT1, t, mid('airport', 0.3), 330, 214); popIn(sT2, t, mid('airport', 0.4), 870, 214);
      popIn(cFlights, t, mid('airport', 0.62), 600, 410);
      op(finder, 0);
    } else { op(sT1, 0); op(sT2, 0); op(cFlights, 0); }

    /* ---------- D: Dennis's confessional ---------- */
    conf.set(sD, t);
    let dennisOn = 0;
    const dennis = crew[0].c;
    if (sD) {
      const pushNum = P(t, at('number'), end('thirteen') + 0.9 - at('number'), linear);
      const k = t >= at('number') ? 1 + 0.08 * pushNum : 1 + 0.03 * P(t, cD, at('number') - cD, linear);
      camBg(conf, k, 430, 400);
      dennisOn = 1; op(dennis, 1);
      tr(dennis, 600 + (430 - 600) * 1 + (k - 1) * (430 - 430), 420 + (k - 1) * 20, 1.5 * k);
      // breathing: quiet rhythm, explicit on "every", one breath on "thirteen"
      let flat = 0.55 * wave(t, 4) * AMP, mood = 'deadpan', look = 0;
      if (t >= at('every') && t < end('every') + 0.2) {
        const f = (t - at('every')) / (end('every') - at('every'));
        flat = f < 0.42 ? flat : f < 0.57 ? 1 : f < 0.71 ? 0 : f < 0.85 ? 1 : 0;
      }
      if (t >= at('thirteen') - 0.1) flat = Math.sin(Math.PI * clamp((t - at('thirteen') + 0.1) / 1.2));
      if (t < at('floor')) mood = t < mid('hi', 0.2) ? 'neutral' : 'deadpan';
      else if (t < end('floor')) { look = t < mid('floor', 0.55) ? 0.85 : 0; }
      else if (t < end('every')) mood = 'deadpan';
      else if (t < end('born')) { mood = t > mid('born', 0.6) ? 'sad' : 'deadpan'; }
      else if (t < at('thirteen')) { look = t < mid('number', 0.8) ? 0.75 : 0; }
      dennis.set({ t, talk: scTalk(S, t, 'dennis'), mood, look, flat });
      ltDennis.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      // hi: keyword
      const kw = win(t, mid('hi', 0.35), at('floor') + 0.2, 0.2);
      op(kwDia, kw); if (kw) tr(kwDia, 890, 320, 0.85 + 0.15 * P(t, mid('hi', 0.35), 0.4, pop));
      // floor: the anatomy inset
      const ip = t >= at('floor') - 0.1 && t < end('floor') + 0.3 ? P(t, at('floor') - 0.1, 0.4, pop) : 0;
      const iOut = 1 - P(t, end('floor') + 0.05, 0.25, linear);
      op(inset, clamp(ip * 2.5) * iOut); tr(inset, 900, 330, Math.max(0.01, 0.7 + 0.3 * ip));
      chest.set(0.5 * wave(t, 4), 0);
      op(diaGlow, 0.5 + 0.5 * wave(t, 1.2));
      op(insetLbl, ip > 0 ? P(t, mid('floor', 0.2), 0.3, linear) * iOut : 0); tr(insetLbl, 900, 600);
      op(insetArrow, ip > 0 ? P(t, mid('floor', 0.2), 0.3, linear) * iOut : 0);
      // every: CONTRACT / RELAX
      const ev = t >= at('every') && t < end('every') + 0.3;
      const f = ev ? (t - at('every')) / (end('every') - at('every')) : -1;
      const showC = ev && ((f >= 0.42 && f < 0.57) || (f >= 0.71 && f < 0.85)), showR = ev && ((f >= 0.57 && f < 0.71) || f >= 0.85);
      op(cContract, showC ? 1 : 0); tr(cContract, 890, 330, 1 + 0.05 * Math.sin(t * 12));
      op(cRelax, showR ? 1 : 0); tr(cRelax, 890, 330);
      // born: certificate
      const cpp = t >= at('born') - 0.1 && t < end('born') + 0.4 ? P(t, at('born') - 0.1, 0.45, pop) : 0;
      op(cert, clamp(cpp * 2.5) * (1 - P(t, end('born') + 0.15, 0.2, linear))); tr(cert, 880, 330, Math.max(0.01, 0.7 + 0.3 * cpp), 2);
      op(zero, P(t, mid('born', 0.65), 0.2, linear)); tr(zero, 0, 0, 1);
      // number / thirteen: the counter rolls 012 -> 013
      const np = t >= at('number') - 0.1 ? P(t, at('number') - 0.1, 0.45, pop) : 0;
      op(cnt, clamp(np * 2.5)); tr(cnt, 880, 340, Math.max(0.01, 0.7 + 0.3 * np));
      const roll = P(t, at('thirteen') + 0.15, 0.35, ease);
      tr(d12, 0, -86 * roll); tr(d13, 0, 86 * (1 - roll));
    } else { ltDennis.set(0); [kwDia, inset, insetLbl, insetArrow, cContract, cRelax, cert, cnt].forEach(e => op(e, 0)); }

    /* ---------- E: title card, the cast pops in ---------- */
    op(titleShot, sE); op(logo, 0); op(epi, 0); op(tPlane, 0);
    if (sE) {
      tr(rayP, 600, 560, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 205, Math.max(0.01, 0.5 + 0.5 * lp));
      const a = (t - at('title')) * 1.6 * AMP;
      op(tPlane, clamp(lp * 2)); tr(tPlane, 600 + Math.cos(a) * 380, 168 + Math.sin(a) * 70, 1.1 * (0.85 + 0.15 * Math.sin(a)), (Math.atan2(Math.cos(a) * 70, -Math.sin(a) * 380) * 180 / Math.PI));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      crew.forEach(e => {
        const t0 = mid('title', 0.5) + e.i * 0.13 + (e.k === 'nigel' ? 0.6 : 0);
        const p = P(t, t0, 0.45, pop);
        op(e.c, clamp(p * 3)); tr(e.c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, e.s * p));
        e.c.set({ t, mood: e.mood, look: e.k === 'nigel' ? 0 : 0, flat: e.k === 'dennis' ? 0.5 * wave(t, 4) : 0, lift: e.k === 'iggy' ? wave(t, 1.4) : 0 });
      });
      dennisOn = 1;
    } else crew.forEach((e, i) => { if (i > 0) op(e.c, 0); });
    if (!dennisOn) op(crew[0].c, 0);
  };
});

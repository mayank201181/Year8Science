/* Scene 0: Cold open (no chapter card).
   Hall: Kavya, 12, with her triangle -> the bar-47 sheet music -> wide hall, band, fans, 34 degrees ->
   documentary zoom into the air between the triangle and a listener -> a field of air particles ->
   zoom onto one: Nigel -> Nigel's confessional (nitrogen, the air pie chart, delivery tickets, "I pass it on"
   with a little particle row) -> Echo on the tiled back wall repeats him -> Nigel on Echo -> Echo again ->
   title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const cam = (el, k, fx, fy, tx, ty) => el.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  function label(parent, text, o) {           // dark pill label, readable over any background
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function echoText(parent, text) {           // a caption with a fading, offset "echo" copy behind it
    const g = G(parent);
    const ghost = T(g, 14, 10, text, { size: 46, weight: 800, anchor: 'middle', fill: '#C9C2E6', opacity: 0.35 });
    const main = T(g, 0, 0, text, { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    main.setAttribute('stroke', '#221C33'); main.setAttribute('stroke-width', 8); main.setAttribute('paint-order', 'stroke');
    g.set = (p, t) => { op(g, p); tr(ghost, 14 + 10 * Math.sin(t * 3), 10, 1); };
    return g;
  }

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B/C/F: the school hall ================= */
  const hallShot = G(Lbg), hallWrap = G(hallShot);
  const hall = pioHall(hallWrap);
  // the band on the stage (simple figures with instruments)
  const band = G(hallWrap);
  [[90, '#E8424F'], [215, '#2E7DD8'], [340, '#56D69B']].forEach(([x, shirt], i) => {
    const p = person(band, { shirt, shorts: '#1E2A44', skin: ['#C98E62', '#E0B48A', '#8C5A3C'][i], hair: '#1E1410' });
    tr(p, x, 426, 0.95); p.pose({ armL: [40, 50], armR: [-30, 60] });
  });
  const drum = G(band); tr(drum, 150, 392);
  E('ellipse', { cx: 0, cy: 0, rx: 34, ry: 10, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 3 }, drum);
  E('path', { d: 'M-34,0 L-34,34 Q0,46 34,34 L34,0', fill: '#C2453A', stroke: SC_INK, 'stroke-width': 3 }, drum);
  const trumpet = G(band); tr(trumpet, 240, 290);
  E('path', { d: 'M0,0 L46,-4 L62,-16 L62,12 L46,4 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, trumpet);
  // B and C: Kavya full body with the triangle, and a listener on the right
  const kBodyW = G(hallWrap); const kBody = scKavyaBody(kBodyW); tr(kBodyW, 640, 668, 1.25);
  const triSmall = pioTriangle(hallWrap, 0.32); tr(triSmall, 700, 466);
  const listenerW = G(hallWrap); const listener = person(listenerW, { shirt: '#9B6BD6', shorts: '#2A2A3A', skin: '#E0B48A', hair: '#3A2418' }); tr(listenerW, 1060, 668, 1.25);
  const EAR = [1054, 444];             // the listener's ear (hall coordinates)
  const AIRPT = [880, 450];            // the bit of air we zoom into
  // A: Kavya's bust, her triangle, chips, the sheet music
  const kav = cast(Lcast, 'kavya', { mood: 'deadpan' });
  const triBig = pioTriangle(Lcast, 1.0);
  const fist = E('ellipse', { rx: 22, ry: 18, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, Lcast);
  const aChips = G(Lfg);
  const cKav = label(aChips, 'Kavya, age 12', { size: 34 });
  const cBand = label(aChips, 'school band', { size: 30 });
  const cTri = chip(aChips, 'TRIANGLE', { size: 60, fill: '#2E7DD8', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const sheet = pioSheet(Lfg, 860);
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Triangle. Bar 47.');
  // B: labels
  const therm = G(Lfg);
  E('rect', { x: -14, y: -70, width: 28, height: 110, rx: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, therm);
  E('circle', { cx: 0, cy: 52, r: 24, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4 }, therm);
  E('rect', { x: -6, y: -50, width: 12, height: 90, fill: '#E8424F' }, therm);
  T(therm, 34, 20, '34 °C', { size: 48, weight: 800, fill: '#C62828' });
  const fanChip = label(Lfg, 'doing their best', { size: 28 });
  const fanArrow = arrow(Lfg, 860, 210, 860, 112, { color: '#FFFFFF', width: 4 });
  // C: reticle and caption
  const reticle = G(Lfg);
  E('circle', { r: 62, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const airChip = label(Lfg, 'the air in between', { size: 32, color: '#9FD8FF' });
  const pathDots = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '2 12', 'stroke-linecap': 'round', opacity: 0.85 }, Lfg);

  /* ================= D: the air, up close ================= */
  const airShot = G(Lbg);
  const air = pioAir(airShot);
  const field = G(airShot);
  const FOC = [600, 400], pr = rng(907), parts = [];
  for (let i = 0; i < 70; i++) {
    let x = 40 + pr() * 1120, y = 40 + pr() * 670;
    if (Math.hypot(x - FOC[0], y - FOC[1]) < 70) x += 160;
    parts.push({ el: E('circle', { r: 11, fill: ball('#8FB8FF', '#2F56C2') }, field), x, y, ph: pr() * TAU });
  }
  const focDot = E('circle', { cx: FOC[0], cy: FOC[1], r: 11, fill: ball('#8FB8FF', '#2F56C2') }, field);
  const partChip = label(Lfg, 'air particles', { size: 34, color: '#9FD8FF', stroke: '#9FD8FF' });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });

  /* ================= E/G: Nigel's confessional ================= */
  const conf = pioConf(Lbg, 'nigel');
  const nigel = cast(Lcast, 'nigel', { mood: 'deadpan' });
  const ltNigel = scLowerThird(Lhud, 'NIGEL', 'Nitrogen. Air particle. Doesn’t go anywhere.');
  const kwN = G(Lfg);
  chip(kwN, 'nitrogen molecule', { size: 44, fill: '#2F56C2', color: '#FFFFFF', stroke: '#BFD3FF', sw: 4 });
  const n2 = T(kwN, 0, 92, 'N', { size: 64, weight: 800, anchor: 'middle', fill: '#BFD3FF' });
  E('tspan', { dy: 14, 'font-size': 40 }, n2).textContent = '2';
  T(kwN, 0, 140, 'two nitrogen atoms', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // the air pie chart
  const pie = G(Lfg);
  const slice = (a0, a1, col) => { const r = 150, x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
    return E('path', { d: `M0,0 L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)} Z`, fill: col, stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, pie); };
  const A0 = -Math.PI / 2, aN = A0 + 0.78 * TAU, aO = aN + 0.21 * TAU;
  slice(A0, aN, '#5B8CFF');
  const oxSlice = slice(aN, aO, '#FF6B5C');
  slice(aO, A0 + TAU, '#3DD6C4');
  T(pie, -30, 30, '78%', { size: 52, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(pie, -30, 70, 'nitrogen', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const oxLab = G(pie); tr(oxLab, -150, -170);
  T(oxLab, 0, 0, '21% oxygen', { size: 30, weight: 800, anchor: 'middle', fill: '#FF9A8F' });
  const star = chip(oxLab, '★ FAMOUS', { size: 24, fill: '#FFE45C', color: SC_INK }); tr(star, 0, -46);
  T(pie, 140, -150, '1% argon', { size: 26, weight: 700, anchor: 'start', fill: '#7FF0E2' });
  T(pie, 140, -120, '+ others', { size: 24, weight: 600, anchor: 'start', fill: '#7FF0E2', font: FB });
  // delivery tickets
  const tickets = ['DRUM', 'DING!', '“Kavya, focus!”'].map((txt, i) => {
    const g = G(Lfg);
    E('rect', { x: -170, y: -46, width: 340, height: 92, rx: 12, fill: '#FFF8E1', stroke: '#C9A24A', 'stroke-width': 4 }, g);
    E('path', { d: 'M-130,-46 L-130,46', stroke: '#C9A24A', 'stroke-width': 3, 'stroke-dasharray': '6 6' }, g);
    T(g, -150, 8, '#' + (i + 1), { size: 22, weight: 800, anchor: 'middle', fill: '#8A6D35' });
    T(g, 20, 12, txt, { size: 36, weight: 800, anchor: 'middle', fill: SC_INK });
    T(g, 150, -22, 'SOUND', { size: 14, weight: 800, anchor: 'end', fill: '#8A6D35' });
    return g;
  });
  // "I pass it on": a small particle row and a home marker under Nigel
  const rowW = G(Lfg); const row = pioRow(rowW, { w: 420, h: 110, cols: 12, rows: 3, r: 9 }); tr(rowW, 670, 300);
  const rowLab = T(Lfg, 880, 460, 'the bump travels →', { size: 28, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const home = E('ellipse', { cx: 430, cy: 572, rx: 120, ry: 20, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '12 10', opacity: 0.6 }, Lbg);
  const passChip = chip(Lfg, 'PASS IT ON', { size: 56, fill: '#FFD23F', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  // G: a framed picture of Echo
  const frame = G(Lfg);
  E('rect', { x: -130, y: -150, width: 260, height: 300, rx: 10, fill: '#FFFFFF', stroke: '#C9C2E6', 'stroke-width': 4 }, frame);
  E('rect', { x: -110, y: -130, width: 220, height: 220, fill: '#463A64' }, frame);
  const echoPic = cast(frame, 'echo', { s: 0.8 }); tr(echoPic, 0, -20, 0.8);
  T(frame, 0, 128, 'the back wall', { size: 26, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });

  /* ================= F/H: Echo on the wall ================= */
  const wallShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#B4AAD3', '#9C91C2', true) }, wallShot);
  let wg = ''; for (let x = 0; x <= 1200; x += 75) wg += `M${x},0 L${x},640 `; for (let y = 25; y < 640; y += 75) wg += `M0,${y} L1200,${y} `;
  E('path', { d: wg, stroke: '#8B80B4', 'stroke-width': 6 }, wallShot);
  E('ellipse', { cx: 600, cy: 420, rx: 420, ry: 300, fill: glow('#FFFFFF'), opacity: 0.35 }, wallShot);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: linGrad('#C99A5E', '#9A6B38', true) }, wallShot);
  E('rect', { x: 0, y: 626, width: 1200, height: 18, fill: '#8C7F5A' }, wallShot);
  const echo = cast(Lcast, 'echo', { mood: 'deadpan' });
  const ltEcho = scLowerThird(Lhud, 'ECHO', 'The back wall. Hard. Flat. Repeats things.');
  const eT1 = echoText(Lfg, '…pass it on.'), eT2 = echoText(Lfg, '…repeats things.');

  /* ================= I: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#2B4C78', true) }, titleShot);
  const rings = [0, 1, 2, 3, 4].map(() => E('circle', { cx: 600, cy: 215, r: 100, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 6 }, titleShot));
  E('ellipse', { cx: 600, cy: 590, rx: 560, ry: 170, fill: glow('#7FB6FF'), opacity: 0.3 }, titleShot);
  const logo = G(Lfg);
  const logoT = T(logo, 0, 0, 'PASS IT ON', { size: 110, weight: 800, anchor: 'middle', fill: '#FFD23F' });
  logoT.setAttribute('stroke', '#1A2852'); logoT.setAttribute('stroke-width', 14); logoT.setAttribute('paint-order', 'stroke'); logoT.setAttribute('stroke-linejoin', 'round');
  const epi = T(Lfg, 600, 320, 'Episode 11: Bar Forty-Seven', { size: 44, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const ROW = [['nigel', 'deadpan'], ['archie', 'happy'], ['belle', 'sad'], ['freq', 'happy'], ['amp', 'smug'], ['coco', 'neutral'], ['echo', 'deadpan'], ['kavya', 'annoyed']];
  const line = ROW.map(([k, mood], i) => ({ c: cast(Lcast, k, { mood }), k, mood, x: 105 + i * 141, y: 540 }));

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cB = at('hall') - 0.06, cC = at('small') - 0.06, cD = at('this') - 0.06, cE = at('hi') - 0.06,
    cF = at('echo') - 0.06, cG = at('thecho') - 0.06, cH = at('echo2') - 0.06, cI = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF),
      sF = on(t, cF, cG), sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, 1e9);
    hall.upd(t);

    /* ---------- the hall: A (Kavya), B (wide), C (zoom into the air), F/H (Echo's wall) ---------- */
    op(hallShot, Math.max(sA, sB, sC)); op(wallShot, Math.max(sF, sH));
    if (sA) cam(hallWrap, 1.08 + 0.03 * P(t, 0, cB, linear), 700, 380, 700, 380);
    else if (sB) cam(hallWrap, 1 + 0.02 * P(t, cB, cC - cB, linear), 600, 375, 600, 375);
    else if (sC) {
      const zp = P(t, mid('small', 0.5), end('small') - mid('small', 0.5) + 0.25, easeIn);
      const k = Math.pow(14, zp);
      cam(hallWrap, k, AIRPT[0], AIRPT[1], lerp(AIRPT[0], 600, zp), lerp(AIRPT[1], 380, zp));
    }
    op(band, sA ? 0 : 1); op(kBodyW, sB || sC ? 1 : 0); op(triSmall, sB || sC ? 1 : 0); op(listenerW, sB || sC ? 1 : 0);
    if (sB || sC) {
      const fan = sB && t > mid('hall', 0.6);
      kBody.pose(fan ? { armL: [10, 14], armR: [150 + 20 * Math.sin(t * 14) * AMP, 30] } : { armL: [10, 14], armR: [60, 70] });
      listener.pose({ armL: [8, 10], armR: [-8, 10] });
      triSmall.set({ t, ring: 0.6, beater: false });
    }

    // A: Kavya bust and the triangle
    const kavA = sA;
    op(kav, kavA ? 1 : 0); op(triBig, kavA); op(fist, kavA);
    if (kavA) {
      tr(kav, 860, 540, 1.4);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < at('bars') ? 'deadpan' : (t > mid('bars', 0.8) ? 'deadpan' : 'annoyed'), look: t > end('bars') ? 0 : (t > mid('bars', 0.3) && t < mid('bars', 0.75) ? -0.6 : 0) });
      const lift = P(t, mid('kavya', 0.55), 0.5, pop);
      tr(triBig, 620, 520 - 40 * lift, 0.95, -6 + 3 * Math.sin(t * 1.3) * AMP); tr(fist, 620, 520 - 40 * lift - 108);
      triBig.set({ t, ring: 0, beater: false });
      const f1 = 1 - P(t, at('bars') + 0.2, 0.3, linear);
      op(aChips, f1);
      if (f1) { popIn(cKav, t, mid('kavya', 0.05), 250, 320); popIn(cBand, t, mid('kavya', 0.4), 250, 392); popIn(cTri, t, mid('kavya', 0.78), 270, 500, 1, -4); }
      const sp = P(t, at('bars') + 0.1, 0.45, pop);
      op(sheet, clamp(sp * 2.5)); tr(sheet, 170, 130 - 40 * (1 - sp));
      const cp = P(t, mid('bars', 0.5), 0.35, pop);
      op(sheet.circle, cp); attr(sheet.circle, 'stroke-width', 5 + 3 * Math.sin(t * 8) * cp);
      ltKavya.set(win(t, at('bars') + 0.3, end('bars') + 0.6, 0.3));
    } else { op(aChips, 0); op(sheet, 0); ltKavya.set(0); }

    // B: thermometer and fans
    const bOn = sB ? 1 : 0;
    op(therm, bOn ? P(t, mid('hall', 0.25), 0.3, linear) : 0); tr(therm, 470, 360);
    op(fanChip, bOn ? P(t, mid('hall', 0.55), 0.3, linear) : 0); tr(fanChip, 860, 236);
    op(fanArrow, bOn ? P(t, mid('hall', 0.55), 0.3, linear) : 0);

    // C: the dotted path from triangle to ear, the reticle, the air chip, the zoom counter
    if (sC) {
      const zp = P(t, mid('small', 0.5), end('small') - mid('small', 0.5) + 0.25, easeIn);
      const pp = P(t, at('small') + 0.2, 1.2, linear) * (1 - zp * 3);
      op(pathDots, clamp(pp)); attr(pathDots, 'd', `M720,${452} Q880,400 ${EAR[0] - 20},${EAR[1]}`);
      const rp = P(t, mid('small', 0.3), 0.4, pop);
      op(reticle, clamp(rp * 2) * (1 - P(t, end('small') - 0.4, 0.3, linear))); tr(reticle, lerp(AIRPT[0], 600, zp), lerp(AIRPT[1], 380, zp), Math.max(0.01, (0.6 + 0.4 * rp) * (1 + zp)), t * 30 * AMP);
      op(airChip, win(t, mid('small', 0.5), end('small') + 0.1, 0.25)); tr(airChip, 860, 250);
    } else { op(pathDots, 0); op(reticle, 0); op(airChip, 0); }

    /* ---------- D: the air particles, zoom onto Nigel ---------- */
    op(airShot, sD ? 1 : (sC ? P(t, end('small') - 0.35, 0.35, linear) : 0));
    op(finder, Math.max(sC, sD));
    if (sC || sD) {
      const zc = sC ? P(t, mid('small', 0.5), end('small') - mid('small', 0.5) + 0.25, easeIn) : 1;
      const zd = sD ? P(t, mid('this', 0.45), end('this') - mid('this', 0.45), ease) : 0;
      const mag = sD ? 1e6 * Math.pow(30, zd) : Math.pow(1e6, zc);
      setText(zoomTxt, 'ZOOM ×' + (mag >= 1e6 ? Math.round(mag / 1e6) + ' 000 000' : String(Math.round(mag)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')));
    }
    let nigShown = 0;
    if (sD || sC) {
      air.upd(t);
      const zd = sD ? P(t, mid('this', 0.45), end('this') - mid('this', 0.45), ease) : 0;
      const k = 1 + 13 * zd;
      parts.forEach(p => { attr(p.el, 'cx', FOC[0] + k * (p.x - FOC[0]) + Math.sin(t * 7 + p.ph) * 3 * AMP); attr(p.el, 'cy', FOC[1] + k * (p.y - FOC[1]) + Math.cos(t * 8 + p.ph) * 3 * AMP); attr(p.el, 'r', 11 * k); });
      attr(focDot, 'r', 11 * k); op(focDot, 1 - clamp((k - 6) / 3));
      op(partChip, sD ? win(t, at('this') + 0.1, mid('this', 0.5), 0.25) : 0); tr(partChip, 600, 300);
      const mOp = clamp((k - 6) / 3);
      if (mOp > 0) { nigShown = 1; op(nigel, mOp); tr(nigel, FOC[0], FOC[1], 0.06 * k); const up = t > end('this') - 0.1; nigel.set({ t, mood: up ? 'deadpan' : 'neutral', look: up ? 0 : -0.8, still: !up }); }
    } else op(partChip, 0);

    /* ---------- E and G: Nigel's confessional ---------- */
    const confOn = Math.max(sE, sG);
    conf.set(confOn, t);
    op(home, sE && t > at('go') ? win(t, at('go'), cF, 0.25) * 0.8 : 0);
    if (sE || sG) {
      nigShown = 1; op(nigel, 1);
      const push = sE ? P(t, at('go'), end('go') - at('go'), linear) : P(t, cG, cH - cG, linear);
      const k = 1 + 0.06 * push;
      tr(conf, 0, 0); conf.setAttribute('transform', `translate(430 400) scale(${k.toFixed(4)}) translate(-430 -400)`);
      let mood = 'deadpan', look = 0, rot = 0;
      if (sE) {
        if (t < mid('hi', 0.5)) mood = 'neutral';
        else if (t >= at('percent') && t < at('job')) { mood = t > mid('percent', 0.55) ? 'annoyed' : 'neutral'; look = t > mid('percent', 0.55) ? 0.8 : 0.3; }
        else if (t >= at('go')) {
          if (t < mid('go', 0.6)) { mood = 'annoyed'; rot = Math.sin(t * 14) * 5 * AMP * (t > mid('go', 0.2) && t < mid('go', 0.45) ? 1 : 0); }
          else mood = 'smug';
        }
      } else { mood = 'deadpan'; look = t > mid('thecho', 0.3) ? 0.9 : 0.4; }
      tr(nigel, 430 + (k - 1) * 0, 410 - (k - 1) * 20, 1.5 * k, rot);
      nigel.set({ t, talk: scTalk(S, t, 'nigel'), mood, look, still: sE && t >= at('go') && t < mid('go', 0.6) });
      ltNigel.set(sE ? win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3) : 0);
      // hi: keyword
      const kw = sE ? win(t, mid('hi', 0.3), at('percent') + 0.1, 0.2) : 0;
      op(kwN, kw); if (kw) tr(kwN, 880, 300, 0.85 + 0.15 * P(t, mid('hi', 0.3), 0.4, pop));
      // percent: pie chart
      const pp = sE ? P(t, at('percent') + 0.05, 0.45, pop) * (1 - P(t, at('job') - 0.1, 0.15, linear)) : 0;
      op(pie, clamp(pp * 2.5)); tr(pie, 880, 420, Math.max(0.01, 0.7 + 0.3 * pp));
      const fp = P(t, mid('percent', 0.55), 0.35, pop);
      op(star, fp); tr(star, 0, -46, Math.max(0.01, 0.6 + 0.4 * fp), 6 * Math.sin(t * 4) * AMP);
      attr(oxSlice, 'transform', t > mid('percent', 0.55) ? `translate(${(-6 - 3 * Math.sin(t * 5) * AMP).toFixed(1)} ${(-10).toFixed(1)})` : '');
      // job: three tickets
      tickets.forEach((tk, i) => {
        const tp = sE ? P(t, mid('job', 0.32 + i * 0.22), 0.4, pop) * (1 - P(t, at('go') - 0.1, 0.15, linear)) : 0;
        op(tk, clamp(tp * 2.5)); tr(tk, 880 + 300 * (1 - clamp(tp)), 220 + i * 130, 1, [-3, 2, -2][i]);
      });
      // go: the particle row passes the bump; Nigel stays on his marker
      const gp = sE ? win(t, at('go') + 0.1, cF + 0.1, 0.3) : 0;
      op(rowW, gp); op(rowLab, gp);
      if (gp) row.set({ t, amp: 12, wl: 160, f: 1.1, hi: 5 });
      const pc = sE ? P(t, mid('go', 0.72), 0.4, pop) : 0;
      op(passChip, clamp(pc * 2.5)); tr(passChip, 880, 560, Math.max(0.01, 0.6 + 0.4 * pc), -3);
      // G: Echo's framed picture
      const fr = sG ? P(t, mid('thecho', 0.15), 0.4, pop) : 0;
      op(frame, clamp(fr * 2.5)); tr(frame, 900, 350, Math.max(0.01, 0.7 + 0.3 * fr), 4);
      if (fr) echoPic.set({ t, mood: 'deadpan', ghost: 0.6 });
    } else { ltNigel.set(0); op(kwN, 0); op(pie, 0); tickets.forEach(tk => op(tk, 0)); op(rowW, 0); op(rowLab, 0); op(passChip, 0); op(frame, 0); }
    if (!nigShown && !sE && !sG) op(nigel, 0);

    /* ---------- F and H: Echo on the wall ---------- */
    const eOn = Math.max(sF, sH);
    op(echo, eOn);
    if (eOn) {
      const t0 = sF ? cF : cH;
      tr(echo, 640, 400, 1.6 * (1 + 0.04 * P(t, t0, 3, linear)));
      echo.set({ t, talk: scTalk(S, t, 'echo'), mood: 'deadpan', ghost: scWho(S, t) === 'echo' ? 1 : 0.25 });
      ltEcho.set(sF ? win(t, at('echo') + 0.05, at('echo') + 2.6, 0.25) : 0);
    } else ltEcho.set(0);
    eT1.set(sF ? P(t, mid('echo', 0.2), 0.3, linear) : 0, t); tr(eT1, 640, 150);
    eT2.set(sH ? P(t, mid('echo2', 0.2), 0.3, linear) : 0, t); tr(eT2, 640, 150);

    /* ---------- I: title card, the cast pops in ---------- */
    op(titleShot, sI); op(logo, 0); op(epi, 0);
    if (sI) {
      rings.forEach((r, i) => { const f = ((t - cI) * 0.45 + i / 5) % 1; attr(r, 'r', 90 + f * 620); op(r, (1 - f) * 0.5); });
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 245, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.5), 0.4, linear));
      line.forEach((e, i) => {
        const p = P(t, mid('title', 0.3) + i * 0.13, 0.45, pop);
        op(e.c, clamp(p * 3)); tr(e.c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, 0.55 * p));
        e.c.set({ t, mood: e.mood, look: 0, ghost: e.k === 'echo' ? 0.5 : 0 });
      });
    } else line.forEach(e => op(e.c, 0));
  };
});

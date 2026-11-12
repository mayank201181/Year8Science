/* Scene 0: Cold open (no chapter card).
   A: the school lab, 34 °C: Kavya, 12, staring at a test tube that does nothing (worksheet, stopwatch, one bubble)
   B: documentary zoom into the bottom of the test tube -> the TEST TUBE KITCHEN set lights up
   C/E/F: Arrow's confessional (hello; "turns into", not "="; the question-mark therapist)
   D: kitchen wide: ingredients -> Arrow -> a brand-new dish (C + O2 -> CO2)
   G: tonight's final: Olly, Madam Mass, Ferris in spotlights; H: Ferris close, rusting
   I: title card with the whole cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  // camera: world point (x, y) -> screen (sx + k (x - fx), sy + k (y - fy))
  const cam0 = { k: 1, fx: 600, fy: 375, sx: 600, sy: 375 };
  const camAbout = (k, cx, cy) => ({ k, fx: cx, fy: cy, sx: cx, sy: cy });
  const camSet = (el, c) => el.setAttribute('transform', `translate(${c.sx.toFixed(1)} ${c.sy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.fx).toFixed(1)} ${(-c.fy).toFixed(1)})`);
  const place = (el, c, x, y, s, r) => tr(el, c.sx + c.k * (x - c.fx), c.sy + c.k * (y - c.fy), s * c.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const fmtZoom = m => { const e = Math.floor(Math.log10(Math.max(1, m))), v = Math.round(m / Math.pow(10, Math.max(0, e - 1))) * Math.pow(10, Math.max(0, e - 1)); return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); };

  /* layers: sets, the cast, things in front of the cast (bench, counter), props and labels, the HUD */
  const Lbg = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B: the lab ================= */
  const labWall = tkLab(Lbg);
  const bench = tkBench(Lfront);
  // the test tube Kavya is staring at, in a clamp stand on the bench
  const TUBE = [820, 430], TB = [820, 528];
  const stand = G(Lfront);
  E('rect', { x: 860, y: 548, width: 110, height: 14, rx: 4, fill: '#5A6672', stroke: SC_INK, 'stroke-width': 3 }, stand);
  E('rect', { x: 902, y: 240, width: 12, height: 312, rx: 4, fill: '#9FB0BF', stroke: SC_INK, 'stroke-width': 3 }, stand);
  E('rect', { x: 838, y: 330, width: 70, height: 12, rx: 4, fill: '#9FB0BF', stroke: SC_INK, 'stroke-width': 3 }, stand);
  const bigTube = testTube(stand, 66, 250, { level: 0.42, liquid: '#9BE7C4' }); tr(bigTube, TUBE[0], TUBE[1]);
  E('rect', { x: 780, y: 322, width: 80, height: 28, rx: 8, fill: '#C9A227', stroke: SC_INK, 'stroke-width': 3 }, stand);   // the clamp
  const bub = G(stand), bubC = E('circle', { r: 7, fill: 'rgba(255,255,255,0.35)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, bub);
  const bubPop = E('circle', { r: 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, bub);
  // A1 chips
  const cKav = label(Lfg, 'Kavya, age 12', { size: 34 });
  const hot = G(Lfg);
  const th = thermometer(hot, 110, C.bad); tr(th, -78, 40); th.set(0.92);
  const hotChip = chip(hot, '34 °C', { size: 44, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 }); tr(hotChip, 30, 0);
  // A2 worksheet + stopwatch
  const sheet = G(Lfg);
  E('rect', { x: -160, y: -105, width: 320, height: 210, rx: 8, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, sheet);
  T(sheet, 0, -62, 'PRACTICAL 8.3', { size: 30, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  T(sheet, 0, -22, 'Observe a chemical reaction.', { size: 26, weight: 600, anchor: 'middle', fill: SC_INK, font: FB });
  T(sheet, -140, 34, 'Observations:', { size: 26, weight: 700, fill: SC_INK, font: FB });
  E('line', { x1: -140, y1: 74, x2: 140, y2: 74, stroke: '#BFD3E6', 'stroke-width': 3 }, sheet);
  E('line', { x1: 34, y1: 38, x2: 140, y2: 38, stroke: '#BFD3E6', 'stroke-width': 3 }, sheet);
  const watch = G(Lfg);
  E('rect', { x: -12, y: -74, width: 24, height: 16, rx: 4, fill: '#5A6672' }, watch);
  E('circle', { r: 60, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, watch);
  const watchHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -44, stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round' }, watch);
  const watchTxt = T(watch, 0, 30, '5:00', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const ltKavya = scLowerThird(Lhud, 'KAVYA, 12', 'Still waiting.');
  // B: the documentary zoom
  const reticle = G(Lhud);
  E('circle', { r: 62, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.85 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const liquidWash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#9BE7C4' }, Lfront);
  const sizeChip = label(Lfg, 'the size of atoms', { size: 32, color: C.energy });

  /* ================= kitchen (shrink end, D, G, H) ================= */
  const kitchen = tkKitchen(Lbg);
  const counter = tkCounter(Lfront);
  const finalChip = chip(Lfg, 'THE FINAL', { size: 40, fill: '#FF4FA0', color: '#FFFFFF', stroke: '#FFF1F8', sw: 4 });
  // D: ingredients plate, Arrow in the middle, the new dish
  const plateL = G(Lfg);
  E('ellipse', { cx: 0, cy: 6, rx: 118, ry: 26, fill: '#D5DCE3', stroke: SC_INK, 'stroke-width': 4 }, plateL);
  E('ellipse', { cx: 0, cy: 2, rx: 84, ry: 16, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, plateL);
  tr(atom(plateL, 'C', 22, { letter: true }), -56, -24); tr(atom(plateL, 'C', 22, { letter: true }), 56, -24);
  tr(molO2(plateL, 18, { letter: true }), -20, -66); tr(molO2(plateL, 18, { letter: true }), 30, -30);
  const dish = tkDish(Lfg, 1);
  tr(molCO2(dish.food, 17, { letter: true }), -40, -26); tr(molCO2(dish.food, 17, { letter: true }), 42, -60);
  const dishGlow = spark(dish.food, 14); tr(dishGlow, 76, -96);
  const lbIng = label(Lfg, 'ingredients', { size: 30 });
  const lbNew = label(Lfg, 'brand-new dish', { size: 30, color: C.good, stroke: C.good });
  const ruleChip = G(Lfg);
  chip(ruleChip, 'chemical reaction = a NEW substance is made', { size: 32, fill: 'rgba(10,27,39,0.9)', stroke: C.energy, sw: 3, color: C.energy });
  // G: spotlights for tonight's final
  const spotsG = G(Lfront);
  const spotCones = [0, 1, 2].map(() => E('path', { d: 'M-40,-460 L40,-460 L150,0 L-150,0 Z', fill: glow('#FFF4C2'), opacity: 0.0 }, spotsG));
  const tChips = [label(Lfg, 'celebrity guest chef', { size: 28, color: '#FFB3A8', stroke: C.oxygen }), label(Lfg, 'contestant', { size: 28, color: '#D5DCE3' }), label(Lfg, 'strict auditor', { size: 28, color: '#7CFF9E', stroke: '#7CFF9E' })];
  const ltFerris = scLowerThird(Lhud, 'FERRIS', 'Iron nail. Contestant.');

  /* ================= C/E/F: Arrow's confessional ================= */
  const conf = tkConf(Lbg, 'arrow');
  const ltArrow = scLowerThird(Lhud, 'ARROW', 'Head judge. Not an equals sign.');
  const cardTo = G(Lfg);
  E('rect', { x: -170, y: -110, width: 340, height: 220, rx: 22, fill: '#FFF6D6', stroke: '#E0C878', 'stroke-width': 5 }, cardTo);
  T(cardTo, 0, 18, '→', { size: 130, weight: 800, anchor: 'middle', fill: SC_INK });
  T(cardTo, 0, 84, 'turns into', { size: 36, weight: 800, anchor: 'middle', fill: '#B5372D' });
  const cardEq = G(Lfg);
  E('rect', { x: -110, y: -90, width: 220, height: 180, rx: 22, fill: '#E9EEF2', stroke: '#9FB0BF', 'stroke-width': 5 }, cardEq);
  T(cardEq, 0, 44, '=', { size: 150, weight: 800, anchor: 'middle', fill: '#5A6B7A' });
  const eqX = cross(cardEq, 64); tr(eqX, 0, 0);
  const eqNot = T(cardEq, 0, 128, 'NOT this', { size: 30, weight: 800, anchor: 'middle', fill: C.bad });
  // F: the therapist inset
  const ther = G(Lfg);
  E('path', { d: 'M-150,150 L-210,230 L-120,170 Z', fill: '#F4F1E8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, ther);
  E('circle', { r: 175, fill: '#F4F1E8', stroke: SC_INK, 'stroke-width': 5 }, ther);
  E('rect', { x: -120, y: 60, width: 150, height: 70, rx: 18, fill: '#7A5BA8', stroke: SC_INK, 'stroke-width': 4 }, ther);   // armchair
  E('rect', { x: -132, y: 30, width: 34, height: 100, rx: 12, fill: '#6A4C96', stroke: SC_INK, 'stroke-width': 4 }, ther);
  const qm = G(ther); tr(qm, -40, -20);
  const qmT = T(qm, 0, 70, '?', { size: 230, weight: 800, anchor: 'middle', fill: '#8E6CF0' });
  qmT.setAttribute('stroke', SC_INK); qmT.setAttribute('stroke-width', 7); qmT.setAttribute('paint-order', 'stroke'); qmT.setAttribute('stroke-linejoin', 'round');
  [-1, 1].forEach(sd => { E('circle', { cx: sd * 16 + 4, cy: -64, r: 13, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, qm); E('circle', { cx: sd * 16 + 6, cy: -62, r: 5, fill: SC_INK }, qm); });
  E('path', { d: 'M-12,-64 L-8,-64 M24,-64 L28,-64', stroke: SC_INK, 'stroke-width': 3 }, qm);
  const pad = G(ther); tr(pad, 80, 10, 1, 8);
  E('rect', { x: -40, y: -52, width: 80, height: 104, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, pad);
  for (let i = 0; i < 4; i++) E('line', { x1: -26, y1: -28 + i * 20, x2: 26, y2: -28 + i * 20, stroke: '#BFD3E6', 'stroke-width': 3 }, pad);
  const qmChip = label(ther, 'his therapist', { size: 28, color: '#CDB8FF', stroke: '#8E6CF0' }); tr(qmChip, 0, 210);

  /* ================= I: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#160D2E', '#4A1A45', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FF9BD2', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 600, rx: 600, ry: 190, fill: glow('#FF6FB5'), opacity: 0.3 }, titleShot);
  const logo = tkTitle(Lfg);
  const epi = T(Lfg, 600, 370, 'Episode 7: Nothing Is Lost', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const arrowC = cast(Lcast, 'arrow');
  const olly = cast(Lcast, 'olly');
  const mass = cast(Lcast, 'mass');
  const ferris = cast(Lcast, 'ferris');
  const kat = cast(Lcast, 'kat');
  const monty = cast(Lcast, 'monty');
  // the title line-up (kavya, arrow, olly, mass, ferris are reused)
  const ROW = [['olly', 130, 0.5, 'happy'], ['mass', 290, 0.45, 'deadpan'], ['arrow', 466, 0.5, 'deadpan'], ['ferris', 622, 0.5, 'sad'],
    ['monty', 772, 0.5, 'smug'], ['kat', 930, 0.45, 'deadpan'], ['kavya', 1078, 0.5, 'annoyed']];
  const BY_KIND = { kavya: kav, arrow: arrowC, olly, mass, ferris, kat, monty };

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('stare') - 0.1, cA3 = at('weekend') - 0.08, cB = at('small') - 0.1, cK = mid('shrink', 0.4),
    cC = at('hi') - 0.06, cD = at('rules') - 0.06, cE = at('noteq') - 0.06, cF = at('therapy') - 0.06,
    cG = at('tonight') - 0.06, cH = at('ferris') - 0.06, cI = at('title') - 0.06;
  const zS = mid('small', 0.62);                // the zoom into the test tube starts

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sLab = on(t, -1, cK), sKit = Math.max(on(t, cK, cC), on(t, cD, cE), on(t, cG, cI));
    const sConf = Math.max(on(t, cC, cD), on(t, cE, cG)), sI = on(t, cI, 1e9);
    const shown = {};
    const show = (c, x, y, s, st) => { shown[c === kav ? 'kavya' : c === arrowC ? 'arrow' : c === olly ? 'olly' : c === mass ? 'mass' : c === ferris ? 'ferris' : c === kat ? 'kat' : 'monty'] = 1; op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };

    /* ---------- A + B: the lab, and the zoom ---------- */
    op(labWall, sLab); op(bench, sLab); op(stand, sLab);
    let camL = camAbout(1 + 0.03 * P(t, 0, 7, linear), 600, 420);
    if (t >= cA2) camL = camAbout(1.2 + 0.03 * P(t, cA2, cA3 - cA2, linear), 560, 420);
    if (t >= cA3) camL = camAbout(1.5 + 0.12 * P(t, cA3, cB + 2 - cA3, linear), 640, 430);
    let zp = 0;
    if (t >= cB) {
      const base = 1.5 + 0.12 * P(t, cA3, cB + 2 - cA3, linear);
      const f = P(t, mid('small', 0.2), mid('small', 0.75) - mid('small', 0.2), ease);   // pan onto the tube's bottom
      zp = P(t, zS, cK - zS, easeIn);                                                      // then dive in
      camL = { k: base * (1 + 0.35 * f) * Math.pow(60, zp), fx: lerp(640, TB[0], f), fy: lerp(430, TB[1], f), sx: lerp(640, 600, f), sy: lerp(430, 400, f) };
    }
    if (sLab) {
      labWall.upd(t); camSet(labWall, camL); camSet(bench, camL); camSet(stand, camL);
      show(kav, 0, 0, 1, { mood: t < at('stare') ? 'annoyed' : t < end('stare') ? 'annoyed' : 'deadpan', talk: scTalk(S, t, 'kavya'), look: t > at('stare') && t < mid('stare', 0.55) ? -0.2 : 0.75, sweat: 0.6 });
      place(kav, camL, 430, 400, 1.32);
      // the single bubble, in the silence after "weekend"
      const bt = t - (end('weekend') + 0.05);
      const bp = clamp(bt / 0.55);
      op(bubC, bt > 0 && bp < 1 ? 1 : 0); tr(bubC, TUBE[0] + 4 * Math.sin(bt * 12), 548 - 70 * bp);
      const pp = clamp((bt - 0.55) / 0.25);
      op(bubPop, pp > 0 && pp < 1 ? 1 - pp : 0); tr(bubPop, TUBE[0] + 4 * Math.sin(0.55 * 12), 478, 0.6 + 1.2 * pp);
    }
    // A1 chips
    const a1 = sLab && t < cA2;
    op(cKav, 0); op(hot, 0);
    if (a1) { popIn(cKav, t, mid('kavya', 0.12), 430, 215); popIn(hot, t, mid('kavya', 0.55), 1040, 130); }
    // A2 worksheet + stopwatch
    const a2 = sLab && t >= cA2 && t < cA3;
    op(sheet, 0); op(watch, 0);
    if (a2) {
      popIn(sheet, t, mid('stare', 0.2), 765, 200, 1, -3);
      popIn(watch, t, mid('stare', 0.62), 1085, 210);
      const secs = 300 + Math.max(0, Math.floor(t - mid('stare', 0.62)));
      setText(watchTxt, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`);
      tr(watchHand, 0, 0, 1, (t - mid('stare', 0.62)) * 360 / 4 * AMP);
    }
    ltKavya.set(sLab ? win(t, at('stare') + 0.1, at('stare') + 3.4, 0.3) : 0);
    // B: reticle, viewfinder, zoom counter, the liquid wash
    const fB = sLab && t >= at('small') - 0.1 ? 1 : 0;
    op(finder, fB || on(t, cK, cK + 1.4) ? 1 : 0);
    op(reticle, sLab ? win(t, mid('small', 0.3), cK - 0.3, 0.25) : 0);
    if (sLab) tr(reticle, camL.sx + camL.k * (TB[0] - camL.fx), camL.sy + camL.k * (TB[1] - camL.fy), 1 + 0.5 * zp, t * 30 * AMP);
    const mag = t < zS ? 1 : Math.pow(10, 8 * P(t, zS, cK - zS, linear));
    setText(zoomTxt, 'ZOOM ×' + fmtZoom(mag));
    op(liquidWash, sLab ? clamp((zp - 0.82) / 0.12) : 0);
    op(sizeChip, win(t, mid('shrink', 0.05), cK + 0.4, 0.25)); tr(sizeChip, 600, 160);

    /* ---------- kitchen shots ---------- */
    op(kitchen, sKit); op(counter, sKit);
    let camK = cam0;
    if (t >= cK && t < cC) camK = camAbout(1.7 - 0.7 * P(t, cK, 1.6, easeOut), 600, 420);
    if (t >= cH && t < cI) camK = camAbout(1.8 + 0.08 * P(t, cH, cI - cH, linear), 600, 420);
    if (sKit) {
      kitchen.upd(t); camSet(kitchen, camK); camSet(counter, camK);
      op(kitchen.sign, t < cC ? (P(t, cK + 0.5, 0.05, linear) > 0.5 && !(t > cK + 0.7 && t < cK + 0.8) ? 1 : 0.15) : 1);
    }
    op(finalChip, sKit && t < cC ? win(t, cK + 1.1, cC - 0.1, 0.2) : 0);
    if (sKit && t < cC) tr(finalChip, 600, 300, 0.9 + 0.1 * P(t, cK + 1.1, 0.4, pop));
    // Kat asleep on the right end of the island in every kitchen shot
    if (sKit) { show(kat, 0, 0, 1, { mood: 'deadpan', still: true }); place(kat, camK, 1088, 548, 0.4); }

    /* D: rules */
    const sD = on(t, cD, cE);
    op(plateL, 0); op(dish, 0); op(lbIng, 0); op(lbNew, 0); op(ruleChip, 0);
    if (sD) {
      show(arrowC, 0, 0, 1, { mood: t < mid('rules', 0.62) ? 'deadpan' : 'neutral', talk: scTalk(S, t, 'arrow'), look: t < mid('rules', 0.35) ? -0.7 : t < mid('rules', 0.75) ? 0.7 : 0 });
      tr(arrowC, 600, 470, 1);
      popIn(plateL, t, mid('rules', 0.2), 285, 596);
      popIn(lbIng, t, mid('rules', 0.24), 285, 470);
      popIn(dish, t, mid('rules', 0.4), 915, 596);
      dish.set(P(t, mid('rules', 0.6), 0.6, ease)); dishGlow.upd(t);
      op(lbNew, P(t, mid('rules', 0.66), 0.3, linear)); tr(lbNew, 915, 410);
      popIn(ruleChip, t, mid('rules', 0.84), 600, 238);
    }

    /* G: tonight's final */
    const sG = on(t, cG, cH);
    spotCones.forEach(c => op(c, 0)); tChips.forEach(c => op(c, 0));
    if (sG) {
      const who = [[olly, 'olly', 260, 450, 0.85, mid('tonight', 0.2)], [ferris, 'ferris', 600, 452, 0.85, mid('tonight', 0.7)], [mass, 'mass', 900, 505, 0.8, mid('tonight', 0.45)]];
      who.forEach(([c, k, x, y, s, t0], i) => {
        const p = P(t, t0, 0.4, pop), lit = P(t, t0 - 0.1, 0.25, linear);
        const st = k === 'olly' ? { mood: 'happy', sparkle: 1, look: 0.3 } : k === 'mass' ? { mood: 'deadpan', reading: '0.00 g', look: -0.3 } : { mood: 'sad', rust: 0.25, look: 0 };
        show(c, 0, 0, 1, Object.assign(st, { op: clamp(p * 3) }));
        tr(c, x, y + 30 * (1 - clamp(p)), s * Math.max(0.01, 0.7 + 0.3 * p));
        op(spotCones[i], lit * 0.85); tr(spotCones[i], x, y + 140);
        popIn(tChips[i], t, t0 + 0.15, x, i === 2 ? 370 : 300);
      });
    }

    /* H: Ferris close-up */
    const sH = on(t, cH, cI);
    if (sH) {
      show(ferris, 0, 0, 1, { mood: t > end('ferris') - 0.1 ? 'deadpan' : 'sad', talk: scTalk(S, t, 'ferris'), rust: 0.25 + 0.15 * P(t, mid('ferris', 0.5), cI - mid('ferris', 0.5), linear), look: t > mid('ferris', 0.7) ? -0.4 : 0 });
      place(ferris, camK, 600, 452, 0.85);
      ltFerris.set(win(t, at('ferris') + 0.05, at('ferris') + 3.3, 0.3));
    } else ltFerris.set(0);

    /* ---------- C/E/F: Arrow's confessional ---------- */
    conf.set(sConf, t);
    op(cardTo, 0); op(cardEq, 0); op(ther, 0);
    if (sConf) {
      let camC = camAbout(1, 430, 400);
      if (t >= cE && t < cF) camC = camAbout(1 + 0.04 * P(t, cE, cF - cE, linear), 430, 400);
      if (t >= cF) camC = camAbout(1.3 + 0.1 * P(t, cF, cG - cF, linear), 420, 380);
      camSet(conf, camC);
      let mood = 'deadpan', look = 0;
      if (t < cD) mood = t < mid('hi', 0.4) ? 'neutral' : 'deadpan';
      else if (t < cF) { mood = t > mid('noteq', 0.6) ? 'annoyed' : 'deadpan'; look = t > mid('noteq', 0.25) && t < mid('noteq', 0.6) ? 0.7 : 0; }
      else { mood = t < mid('therapy', 0.3) ? 'annoyed' : 'deadpan'; look = t > mid('therapy', 0.62) && t < end('therapy') ? 0.8 : 0; }
      show(arrowC, 0, 0, 1, { mood, look, talk: scTalk(S, t, 'arrow') });
      place(arrowC, camC, t >= cF ? 400 : 420, 420, 1.35);
      ltArrow.set(win(t, at('hi') + 0.05, at('hi') + 3.2, 0.3));
      if (t >= cE && t < cF) {
        popIn(cardTo, t, mid('noteq', 0.22), 900, 250, 1, 2);
        popIn(cardEq, t, mid('noteq', 0.58), 900, 520, 1, -3);
        const xp = P(t, mid('noteq', 0.78), 0.3, pop);
        op(eqX, clamp(xp * 3)); tr(eqX, 0, 0, Math.max(0.01, 1.4 - 0.4 * xp));
        op(eqNot, P(t, mid('noteq', 0.82), 0.3, linear));
      }
      if (t >= cF) {
        popIn(ther, t, mid('therapy', 0.62), 900, 330);
        tr(qm, -40, -20, 1, Math.sin(t * 5) * 5 * AMP);
      }
    } else ltArrow.set(0);

    /* ---------- I: title card ---------- */
    op(titleShot, sI); op(logo, 0); op(epi, 0);
    if (sI) {
      tr(rayP, 600, 600, 1, (t * 6 * AMP) % 360);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 600, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      ROW.forEach(([k, x, s, mood], i) => {
        const p = P(t, mid('title', 0.5) + i * 0.12, 0.45, pop);
        const c = BY_KIND[k];
        show(c, 0, 0, 1, { mood, op: clamp(p * 3), rust: 0.4, sparkle: 1, reading: '0.00 g' });
        tr(c, x, 560 + 30 * (1 - clamp(p)), Math.max(0.01, s * p));
      });
    }

    Object.entries(BY_KIND).forEach(([k, c]) => { if (!shown[k]) op(c, 0); });
  };
});

/* Scene 0: Cold open (no chapter card).
   Kavya's kitchen: Kavya, 12, with Saturday homework (element, compound or mixture?) -> the sink of her
   brother's bowls -> documentary zoom into the steam above her noodles -> the air: billions of drifting
   atoms, some looking for a partner -> a tiny agency floating on a cloud -> Arthur's confessional (argon,
   matchmaker, a noble gas who never bonds, 'lazy' in Greek, single for four billion years, the mug) ->
   title card with the cast. */
scene('cold', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);          // hard sitcom cut
  const camBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.88)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 }); };

  /* layers: sets at the back, the cast, then props and labels, then the HUD */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the kitchen ================= */
  const kitShot = G(Lbg), kitWrap = G(kitShot);
  const kit = ecKitchen(kitWrap);
  // the brother's tower of dirty bowls, on the counter by the sink
  const tower = G(kitWrap), bowlCols = ['#F4F7FA', '#FFD6BF', '#BFE3F7', '#F7E3EE', '#FFE29A', '#BFE3F7', '#F4F7FA'];
  const towerParts = bowlCols.map((c, i) => {
    const b = G(tower);
    E('path', { d: 'M-58,-26 Q-54,4 0,6 Q54,4 58,-26 Z', fill: c, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, b);
    E('path', { d: 'M-40,-14 Q0,-4 40,-14', fill: 'none', stroke: '#C9A26A', 'stroke-width': 4, opacity: 0.7 }, b);   // a ring of old noodle sauce
    return b;
  });
  const chop = E('path', { d: 'M-10,0 L40,-120 M4,0 L58,-112', stroke: '#C9A26A', 'stroke-width': 6, 'stroke-linecap': 'round' }, tower);
  // Kavya behind the table, then the table edge, her noodles and the worksheet in front of her
  const kav1 = cast(kitWrap, 'kavya', { mood: 'annoyed' });
  E('rect', { x: -20, y: 600, width: 1240, height: 160, fill: '#8A5A3B' }, kitWrap);
  E('rect', { x: -20, y: 600, width: 1240, height: 18, fill: '#A8724D' }, kitWrap);
  const BOWL = [520, 596];
  const noodles = G(kitWrap); tr(noodles, BOWL[0], BOWL[1]);
  E('ellipse', { cx: 0, cy: 0, rx: 92, ry: 18, fill: '#F0C26A', stroke: SC_INK, 'stroke-width': 3 }, noodles);
  E('path', { d: 'M-70,-4 Q-50,10 -30,-4 Q-10,10 10,-4 Q30,10 50,-4 Q66,6 74,-2', fill: 'none', stroke: '#FFE29A', 'stroke-width': 5 }, noodles);
  E('path', { d: 'M-92,0 Q-86,62 0,66 Q86,62 92,0 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4 }, noodles);
  E('path', { d: 'M-60,26 Q0,40 60,26', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.7 }, noodles);
  E('path', { d: 'M40,-6 L130,-96 M54,-2 L146,-86', stroke: '#C9A26A', 'stroke-width': 6, 'stroke-linecap': 'round' }, noodles);
  const nSteam = [0, 1, 2].map(i => E('path', { d: 'M0,0 Q-14,-22 0,-44 Q14,-66 0,-88', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.6 }, noodles));
  const miniSheet = G(kitWrap); tr(miniSheet, 860, 640, 1, -6);
  E('rect', { x: -90, y: -26, width: 180, height: 60, rx: 4, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 2 }, miniSheet);
  E('path', { d: 'M-70,-8 L60,-8 M-70,8 L40,8', stroke: '#BFD3E6', 'stroke-width': 4 }, miniSheet);
  // A chips
  const cKav = label(Lfg, 'Kavya, age 12', { size: 34 });
  const cSat = label(Lfg, 'Saturday morning', { size: 30, color: C.energy });
  // A2: the homework sheet, big
  const sheet = G(Lfg);
  E('rect', { x: -250, y: -205, width: 500, height: 410, rx: 10, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, sheet);
  T(sheet, 0, -150, 'HOMEWORK', { size: 40, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  T(sheet, 0, -104, 'Find 20 things in your kitchen.', { size: 26, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  E('rect', { x: -230, y: -80, width: 460, height: 48, fill: '#E3ECF5' }, sheet);
  [['ELEMENT', -155], ['COMPOUND', 0], ['MIXTURE', 155]].forEach(([s, x]) => T(sheet, x, -46, s, { size: 26, weight: 800, anchor: 'middle', fill: SC_INK }));
  E('path', { d: 'M-78,-80 L-78,180 M78,-80 L78,180 M-230,-32 L230,-32', stroke: '#9AAABB', 'stroke-width': 3 }, sheet);
  let rows = ''; for (let i = 1; i < 5; i++) rows += `M-230,${-32 + i * 52} L230,${-32 + i * 52} `;
  E('path', { d: rows, stroke: '#D6E0EA', 'stroke-width': 2 }, sheet);
  const entry = G(sheet);
  const e1 = T(entry, 155, 4, "my brother's", { size: 26, weight: 700, anchor: 'middle', fill: '#D32F2F', font: FB });
  const e2 = T(entry, 155, 34, 'dirty bowls', { size: 26, weight: 700, anchor: 'middle', fill: '#D32F2F', font: FB });
  e1.setAttribute('font-style', 'italic'); e2.setAttribute('font-style', 'italic');
  const eTick = tick(entry, 16, '#D32F2F'); tr(eTick, 155, 82);
  const ltKavya = scLowerThird(Lhud, ...EC_LOWER.kavya);

  /* ================= B: the documentary zoom ================= */
  const reticle = G(Lfg);
  E('circle', { r: 62, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '14 10' }, reticle);
  E('path', { d: 'M-84,0 L-66,0 M66,0 L84,0 M0,-84 L0,-66 M0,66 L0,84', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, reticle);
  const smallChip = label(Lfg, 'something much, much smaller', { size: 32, color: C.energy });
  const finder = G(Lhud);
  E('path', { d: 'M40,140 L40,40 L140,40 M1060,40 L1160,40 L1160,140 M1160,610 L1160,710 L1060,710 M140,710 L40,710 L40,610', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.8 }, finder);
  const zoomTxt = T(finder, 1130, 690, 'ZOOM ×1', { size: 30, weight: 700, anchor: 'end', fill: '#FFFFFF' });
  const whiteout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#E9F7FF' }, Lhud);

  /* ================= C: the air, and the agency on its cloud ================= */
  const airShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5FB4EC', '#CDEEFF', true) }, airShot);
  const airWrap = G(airShot);
  const mols = [], ar = rng(321);
  for (let i = 0; i < 26; i++) {
    const k = i < 17 ? 'N' : i < 22 ? 'O' : 'Ar', m = G(airWrap);
    if (k === 'Ar') ecAtom(m, 'Ar', 17);
    else { tr(ecAtom(m, k, 16), -13, 0); tr(ecAtom(m, k, 16), 13, 0); }
    mols.push({ m, x: ar() * 1300, y: 60 + ar() * 640, v: 20 + ar() * 34, a: ar() * 360, ph: ar() * TAU });
  }
  // lonely single atoms with heart thought-bubbles
  const lonely = [['O', 330, 300], ['H', 600, 520], ['N', 180, 560]].map(([s, x, y], i) => {
    const g = G(airWrap); tr(g, x, y);
    ecAtom(g, s, 22);
    const th = G(g); tr(th, 34, -44);
    E('circle', { cx: -14, cy: 18, r: 5, fill: '#FFFFFF' }, th);
    E('ellipse', { rx: 30, ry: 24, fill: '#FFFFFF', stroke: '#BFE3F7', 'stroke-width': 3 }, th);
    E('path', { d: 'M0,10 C-22,-4 -16,-20 -6,-18 C-2,-17 0,-13 0,-10 C0,-13 2,-17 6,-18 C16,-20 22,-4 0,10 Z', fill: '#FF5FA2' }, th);
    return { g, th, x, y, ph: i * 1.7 };
  });
  const atomsChip = label(Lfg, 'billions of atoms', { size: 32 });
  const partnerChip = label(Lfg, 'single, looking for a partner', { size: 30, color: '#FF8FC8', stroke: '#FF8FC8' });
  // the tiny agency building on a cloud
  const BLD = [860, 420];
  const bld = G(airWrap); tr(bld, BLD[0], BLD[1]);
  [[0, 96, 170, 34], [-110, 84, 80, 30], [110, 86, 86, 30]].forEach(([x, y, rx, ry]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: '#FFFFFF', stroke: '#BFE3F7', 'stroke-width': 4 }, bld));
  E('rect', { x: -110, y: -60, width: 220, height: 150, fill: '#F7A8C8', stroke: SC_INK, 'stroke-width': 4 }, bld);
  E('path', { d: 'M-126,-60 L0,-118 L126,-60 Z', fill: '#B3326F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bld);
  E('rect', { x: -26, y: 20, width: 52, height: 70, rx: 4, fill: '#7A3E6E', stroke: SC_INK, 'stroke-width': 3 }, bld);
  E('circle', { cx: 16, cy: 58, r: 4, fill: '#FFE45C' }, bld);
  [-74, 74].forEach(x => { E('rect', { x: x - 22, y: 16, width: 44, height: 40, fill: '#FFF0B8', stroke: SC_INK, 'stroke-width': 3 }, bld); E('path', { d: `M${x},16 L${x},56 M${x - 22},36 L${x + 22},36`, stroke: SC_INK, 'stroke-width': 2 }, bld); });
  const bLogo = ecLogo(bld, 0.27); tr(bLogo, 6, -26);
  const OPEN = G(bld); tr(OPEN, 0, 10);
  E('rect', { x: -30, y: -8, width: 60, height: 20, rx: 4, fill: '#56D69B', stroke: SC_INK, 'stroke-width': 2 }, OPEN);
  T(OPEN, 0, 8, 'OPEN', { size: 15, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= D/E: the confessional ================= */
  const conf = ecConfessional(Lbg, 'arthur');
  const ltArthur = scLowerThird(Lhud, ...EC_LOWER.arthur);
  const arChip = G(Lfg);
  const arC = chip(arChip, 'argon', { size: 52, fill: '#CDB2FF', color: '#2A1650', stroke: '#FFFFFF', sw: 4 });
  T(arChip, 0, 78, 'symbol: Ar', { size: 32, weight: 700, anchor: 'middle', fill: '#E3D4FF' });
  // match: two atoms bond, a heart pops
  const bondCard = G(Lfg);
  card(bondCard, -210, -150, 420, 300, { fill: 'rgba(10,27,39,0.88)', stroke: '#FF8FC8', sw: 3 });
  const bA = G(bondCard), bB = G(bondCard);
  ecAtom(bA, 'Na', 40); ecAtom(bB, 'Cl', 44);
  const bLine = E('line', { x1: -20, y1: -10, x2: 20, y2: -10, stroke: '#FFE45C', 'stroke-width': 8, 'stroke-linecap': 'round' }, bondCard);
  const bHeart = E('path', { d: 'M0,22 C-46,-6 -34,-42 -12,-40 C-4,-39 0,-31 0,-25 C0,-31 4,-39 12,-40 C34,-42 46,-6 0,22 Z', fill: '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 3 }, bondCard);
  const bTxt = T(bondCard, 0, 118, 'bonded: happily ever after', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD6EA' });
  // me: noble gas card + two atoms that bounce off Arthur
  const nobleCard = G(Lfg);
  card(nobleCard, -230, -110, 460, 220, { fill: 'rgba(10,27,39,0.88)', stroke: '#CDB2FF', sw: 3 });
  T(nobleCard, 0, -40, 'NOBLE GAS', { size: 52, weight: 800, anchor: 'middle', fill: '#CDB2FF' });
  T(nobleCard, 0, 18, 'hardly reacts with', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  T(nobleCard, 0, 60, 'anything', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  const bouncers = ['O', 'H'].map(s => { const g = G(Lfg); ecAtom(g, s, 26); return g; });
  const nopeX = cross(Lfg, 22);
  // lazy: the dictionary card
  const dict = G(Lfg);
  E('rect', { x: -250, y: -130, width: 500, height: 260, rx: 10, fill: '#FFF6D6', stroke: '#E0C878', 'stroke-width': 4 }, dict);
  T(dict, -210, -58, 'argon', { size: 56, weight: 800, fill: SC_INK });
  T(dict, -40, -60, '(noun)', { size: 28, weight: 600, fill: '#7A6A3A', font: FB });
  E('line', { x1: -210, y1: -30, x2: 210, y2: -30, stroke: '#E0C878', 'stroke-width': 3 }, dict);
  T(dict, -210, 18, 'from Greek argos,', { size: 32, weight: 700, fill: SC_INK, font: FB });
  T(dict, -210, 66, 'meaning ‘lazy’', { size: 40, weight: 800, fill: '#B3326F' });
  // single: the counter and the mug
  const counter = G(Lfg);
  E('rect', { x: -250, y: -120, width: 500, height: 240, rx: 16, fill: '#1B2733', stroke: '#FFE45C', 'stroke-width': 5 }, counter);
  T(counter, 0, -54, 'DAYS WITHOUT A BOND', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const cNum = T(counter, 0, 26, '1 460 000 000 000', { size: 52, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(counter, 0, 82, '(about 4 billion years)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const mugW = G(Lfg), mug = ecMug(mugW, 1);

  /* ================= F: title card ================= */
  const titleShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1030', '#5A1F4A', true) }, titleShot);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FF8FC8', opacity: 0.07 }, titleShot);
  E('ellipse', { cx: 600, cy: 570, rx: 580, ry: 190, fill: glow('#FF8FC8'), opacity: 0.3 }, titleShot);
  const logo = ecLogo(Lfg, 0.95);
  const epi = T(Lfg, 600, 372, 'Episode 6: Just Flatmates', { size: 42, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ================= the cast ================= */
  const arthur = cast(Lcast, 'arthur');
  const ROW = [['nate', 150, 482, 'happy', 0], ['chloe', 375, 478, 'smug', 1], ['sal', 600, 484, 'happy', 2], ['nigels', 840, 486, 'neutral', 3], ['inky', 1065, 484, 'happy', 4],
    ['sandy', 300, 640, 'sad', 5], ['kavya', 900, 636, 'annoyed', 6]];
  const extras = ROW.map(([k, x, y, mood, o]) => ({ c: cast(Lcast, k, { mood }), k, x, y, mood, o }));

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* cut points */
  const cA2 = at('homework') - 0.08, cA3 = at('bowls') - 0.08, cB = at('small') - 0.08, cC = at('air') - 0.3,
    cD = at('hi') - 0.06, cE = at('single') - 0.06, cF = at('title') - 0.06;

  return t => {
    op(blackout, 1 - P(t, 0, 0.6, linear));
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, 1e9);

    /* ---------- A + B: the kitchen ---------- */
    op(kitShot, Math.max(sA, sB));
    if (sA || sB) {
      kit.upd(t);
      nSteam.forEach((s, i) => { const f = ((t * 0.45 + i / 3) % 1); tr(s, -30 + i * 30, -10 - f * 50); op(s, 0.65 * Math.sin(f * Math.PI)); });
      towerParts.forEach((b, i) => tr(b, Math.sin(t * 2.3 + i * 0.6) * i * 0.9 * AMP, -i * 30, 1, Math.sin(t * 2.3 + i * 0.6) * i * 0.35 * AMP));
      tr(tower, 390, 430);
      tr(chop, 0, -7 * 30 + 50);
      let mood = 'annoyed', look = 0;
      if (t >= cA2 && t < cA3) { look = t < mid('homework', 0.72) ? -0.8 : 0; mood = t > mid('homework', 0.72) ? 'deadpan' : 'annoyed'; }
      if (t >= cA3) mood = 'deadpan';
      kav1.set({ t, talk: scTalk(S, t, 'kavya'), mood, look });
      if (sA && t < cA2) {                              // A1: wide
        camBg(kitWrap, 1 + 0.04 * P(t, 0, cA2, linear), 760, 470);
        tr(kav1, 780, 505, 1.25);
      } else if (sA && t < cA3) {                       // A2: closer on Kavya and her homework
        camBg(kitWrap, 1.3 + 0.04 * P(t, cA2, cA3 - cA2, linear), 900, 520);
        tr(kav1, 780, 505, 1.25);
      } else if (sA) {                                  // A3: whip-pan to the sink
        const pp = P(t, cA3, 0.45, easeOut);
        camBg(kitWrap, lerp(1.3, 1.55, pp), lerp(900, 380, pp), lerp(520, 330, pp));
        tr(kav1, 780, 505, 1.25);
      } else {                                          // B: wide again, then push into the noodle steam
        const zp = P(t, mid('small', 0.35), cC - mid('small', 0.35), easeIn);
        const k = Math.pow(30, zp), sx = BOWL[0], sy = BOWL[1] - 120;
        kitWrap.setAttribute('transform', `translate(${sx} ${(sy + (380 - sy) * (1 - 1 / k)).toFixed(1)}) scale(${k.toFixed(4)}) translate(${-sx} ${-sy})`);
        tr(kav1, 780, 505, 1.25);
      }
      // chips (A1)
      const fA1 = t < cA2 ? 1 : 0;
      op(cKav, 0); op(cSat, 0);
      if (fA1) { popIn(cKav, t, mid("kavya", 0.12), 1040, 400); popIn(cSat, t, mid("kavya", 0.55), 1040, 470); }
      // sheet (A2 big, A3 smaller on the right with the bowls entry)
      if (t >= cA2 && t < cB) {
        const sp = P(t, cA2 + 0.12, 0.45, pop);
        if (t < cA3) { op(sheet, clamp(sp * 2.5)); tr(sheet, 330, 390, Math.max(0.01, 0.75 + 0.25 * sp), -2); }
        else { op(sheet, 1); tr(sheet, lerp(330, 900, P(t, cA3, 0.4, ease)), lerp(390, 300, P(t, cA3, 0.4, ease)), lerp(1, 0.78, P(t, cA3, 0.4, ease)), 3); }
        const ep = P(t, mid('bowls', 0.5), 0.5, linear);
        op(entry, t >= cA3 ? ep : 0); op(eTick, P(t, mid('bowls', 0.8), 0.25, linear));
      } else op(sheet, 0);
      ltKavya.set(t >= cA2 && t < cB ? win(t, at('homework') + 0.1, at('homework') + 3.4, 0.3) : 0);
      // B: reticle on the steam, zoom read-out
      if (sB) {
        const rp = P(t, mid('small', 0.2), 0.4, pop), zp = P(t, mid('small', 0.35), cC - mid('small', 0.35), easeIn);
        op(reticle, clamp(rp * 2) * (1 - P(t, cC - 0.5, 0.3, linear)));
        tr(reticle, BOWL[0], 380 + (BOWL[1] - 120 - 380) * Math.pow(30, -zp), Math.max(0.01, (0.6 + 0.4 * rp) * (1 + zp * 0.5)), t * 30 * AMP);
        op(smallChip, win(t, mid('small', 0.3), cC - 0.2, 0.3)); tr(smallChip, 860, 200);
      } else { op(reticle, 0); op(smallChip, 0); }
    } else { op(cKav, 0); op(cSat, 0); op(sheet, 0); ltKavya.set(0); op(reticle, 0); op(smallChip, 0); }

    /* ---------- the viewfinder over B and C ---------- */
    op(finder, Math.max(sB, sC * (t < at('agency') ? 1 : 1 - P(t, end('agency') - 0.2, 0.2, linear))));
    if (sB || sC) {
      const zB = P(t, mid('small', 0.35), cC - mid('small', 0.35), easeIn);
      const mag = sB ? Math.pow(1e6, zB) : 1e6 * (1 + 9 * P(t, at('agency'), end('agency') - at('agency'), easeIn));
      const r = mag < 10 ? 1 : mag < 100 ? 10 : mag < 1000 ? 100 : mag < 1e4 ? 1000 : mag < 1e5 ? 1e4 : mag < 1e6 ? 1e5 : 1e6;
      setText(zoomTxt, 'ZOOM ×' + (Math.round(mag / r) * r).toLocaleString('en-GB').replace(/,/g, ' '));
    }
    op(whiteout, sB ? P(t, cC - 0.45, 0.4, linear) : sC ? 1 - P(t, cC, 0.5, linear) : 0);

    /* ---------- C: the air ---------- */
    op(airShot, sC);
    if (sC) {
      mols.forEach(({ m, x, y, v, a, ph }) => tr(m, ((x + t * v * AMP) % 1300) - 50, y + 14 * Math.sin(t * 0.6 + ph), 1, a + t * 12 * AMP));
      lonely.forEach(({ g, th, x, y, ph }) => { tr(g, x + 10 * Math.sin(t * 0.5 + ph) * AMP, y + 8 * Math.sin(t * 0.8 + ph)); const hp = P(t, mid('air', 0.55) + ph * 0.12, 0.4, pop); op(th, clamp(hp * 2.5)); tr(th, 34, -44, Math.max(0.01, hp * (1 + 0.06 * Math.sin(t * 4 + ph)))); });
      bLogo.upd(t);
      // the building floats in, then the camera pushes in through its door
      const bin = P(t, at('agency') - 0.2, 1.0, easeOut);
      tr(bld, lerp(1400, BLD[0], bin), BLD[1] + 6 * Math.sin(t * 1.2));
      const push = P(t, mid('agency', 0.45), end('agency') + 0.45 - mid('agency', 0.45), easeIn);
      const k = 1 + 0.08 * P(t, cC, 6, linear) + 7 * push;
      const fx = BLD[0], fy = BLD[1] + 55;
      airWrap.setAttribute('transform', `translate(${lerp(fx, 600, push).toFixed(1)} ${lerp(fy, 420, push).toFixed(1)}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
      op(atomsChip, win(t, mid('air', 0.12), at('agency'), 0.3)); tr(atomsChip, 320, 170);
      op(partnerChip, win(t, mid('air', 0.55), at('agency') + 0.4, 0.3)); tr(partnerChip, 360, 650);
    } else { op(atomsChip, 0); op(partnerChip, 0); }

    /* ---------- D/E: Arthur's confessional ---------- */
    const confOn = Math.max(sD, sE);
    conf.set(confOn, t);
    let shownArthur = 0;
    if (confOn) {
      shownArthur = 1; op(arthur, 1);
      let cam;
      if (sD) {
        const lazy = t >= at('lazy') - 0.06;
        cam = lazy ? { k: 1.06 + 0.12 * P(t, at('lazy'), cE - at('lazy'), ease), cx: 430, cy: 400 } : { k: 1 + 0.03 * P(t, cD, at('lazy') - cD, linear), cx: 430, cy: 400 };
      } else cam = { k: 1.22 + 0.05 * P(t, cE, 6, linear), cx: 470, cy: 430 };
      camBg(conf, cam.k, cam.cx, cam.cy);
      place(arthur, cam, 430, 390, 1.5);
      let mood = 'deadpan', look = 0;
      if (t < mid('hi', 0.45)) mood = 'neutral';
      else if (t >= at('match') && t < end('match')) { mood = t > mid('match', 0.6) ? 'smug' : 'neutral'; look = t < mid('match', 0.5) ? 0.6 : 0; }
      else if (t >= at('me') && t < mid('me', 0.35)) mood = 'annoyed';
      else if (t >= at('me') && t < end('me')) look = t > mid('me', 0.4) && t < mid('me', 0.8) ? 0.7 : 0;
      arthur.set({ t, talk: scTalk(S, t, 'arthur'), mood, look });
      ltArthur.set(win(t, at('hi') + 0.1, at('hi') + 3.4, 0.3));
      // hi: argon chip
      const ap = sD ? P(t, mid('hi', 0.3), 0.45, pop) * (1 - P(t, at('match') - 0.1, 0.2, linear)) : 0;
      op(arChip, clamp(ap * 2.5)); tr(arChip, 880, 320, Math.max(0.01, 0.75 + 0.25 * ap));
      // match: two atoms bond, a heart pops
      const bOn = sD ? (t < at('me') - 0.05 ? win(t, at('match'), at('me') + 0.2, 0.2) : 0) : 0;
      op(bondCard, bOn);
      if (bOn) {
        tr(bondCard, 880, 330);
        const sl = P(t, mid('match', 0.15), 0.9, easeOut);
        tr(bA, lerp(-150, -46, sl), -10); tr(bB, lerp(150, 50, sl), -10);
        op(bLine, P(t, mid('match', 0.15) + 0.9, 0.15, linear));
        const hp = P(t, mid('match', 0.55), 0.45, pop);
        op(bHeart, clamp(hp * 2.5)); bHeart.setAttribute('transform', `translate(0 -84) scale(${Math.max(0.01, hp * (1 + 0.08 * Math.sin(t * 7))).toFixed(3)})`);
        op(bTxt, P(t, mid('match', 0.65), 0.3, linear));
      }
      // me: the noble gas card; two atoms try to bond with Arthur and bounce off
      const nOn = sD ? (t < at('lazy') - 0.05 ? win(t, at('me') - 0.05, at('lazy') + 0.2, 0.15) : 0) : 0;
      op(nobleCard, nOn); if (nOn) tr(nobleCard, 880, 250);
      bouncers.forEach((b, i) => {
        const t0 = mid('me', 0.3) + i * 0.35, f = clamp((t - t0) / 1.2);
        if (!nOn || t < t0 || f >= 1) { op(b, 0); return; }
        op(b, 1 - clamp((f - 0.75) / 0.25));
        // fly in towards Arthur's glow, bounce off at f = 0.45
        const hitX = 560, hitY = 450 + i * 80, x0 = 1150, x = f < 0.45 ? lerp(x0, hitX, f / 0.45) : lerp(hitX, 860, (f - 0.45) / 0.55);
        const y = f < 0.45 ? lerp(hitY - 40, hitY, f / 0.45) : hitY + 200 * Math.pow((f - 0.45) / 0.55, 2) + 30 * ((f - 0.45) / 0.55);
        tr(b, x, y, 1, f * 400);
      });
      const nx = sD && t > mid('me', 0.45) && t < end('me') + 0.3 ? P(t, mid('me', 0.45), 0.3, pop) : 0;
      op(nopeX, clamp(nx * 2.5)); tr(nopeX, 600, 250, Math.max(0.01, nx));
      // lazy: the dictionary card
      const dp = sD ? P(t, at('lazy') + 0.1, 0.45, pop) : 0;
      op(dict, clamp(dp * 2.5)); tr(dict, 880, 320, Math.max(0.01, 0.7 + 0.3 * dp), -2);
      // single: the counter and the mug
      const cp = sE ? P(t, at('single') + 0.15, 0.45, pop) : 0;
      op(counter, clamp(cp * 2.5)); tr(counter, 900, 260, Math.max(0.01, 0.7 + 0.3 * cp), 2);
      if (sE) {
        const tick2 = Math.floor(P(t, at('single') + 0.15, 4, linear) * 9);
        setText(cNum, '1 460 000 000 00' + tick2);   // the counter keeps ticking up
        op(mugW, 1);
        const sip = P(t, end('single') + 0.05, 0.35, ease) * (1 - P(t, end('single') + 0.75, 0.3, ease));
        place(mugW, { k: cam.k, cx: cam.cx, cy: cam.cy }, lerp(700, 482, sip), lerp(560, 512, sip) + Math.sin(t * 1.4) * 2 * AMP, 1.1, -32 * sip);
        op(mug.steam, 0.4 + 0.3 * Math.sin(t * 3));
      } else op(mugW, 0);
    } else { ltArthur.set(0); op(arChip, 0); op(bondCard, 0); op(nobleCard, 0); bouncers.forEach(b => op(b, 0)); op(nopeX, 0); op(dict, 0); op(counter, 0); op(mugW, 0); }

    /* ---------- F: title card, the cast pops in ---------- */
    op(titleShot, sF); op(logo, 0); op(epi, 0);
    if (sF) {
      tr(rayP, 600, 570, 1, (t * 6 * AMP) % 360);
      logo.upd(t);
      const lp = P(t, at('title') + 0.05, 0.6, pop);
      op(logo, clamp(lp * 2.5)); tr(logo, 590, 200, Math.max(0.01, 0.5 + 0.5 * lp));
      op(epi, P(t, mid('title', 0.45), 0.4, linear));
      const castT = o => mid('title', 0.5) + o * 0.12;
      extras.forEach(e => { const p = P(t, castT(e.o), 0.45, pop); op(e.c, clamp(p * 3)); tr(e.c, e.x, e.y + 30 * (1 - clamp(p)), Math.max(0.01, 0.6 * p)); e.c.set({ t, mood: e.mood }); });
      const pa = P(t, castT(7), 0.45, pop);
      shownArthur = 1; op(arthur, clamp(pa * 3)); tr(arthur, 600, 618 + 30 * (1 - clamp(pa)), Math.max(0.01, 0.62 * pa)); arthur.set({ t, mood: 'deadpan' });
    } else extras.forEach(e => op(e.c, 0));
    if (!shownArthur) op(arthur, 0);
  };
});

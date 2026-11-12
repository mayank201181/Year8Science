/* Scene 1: The singles (atoms, elements, chemical symbols).
   Shots (hard sitcom cuts): the agency opens at 9:00, singles on the sofa -> Arthur at the desk:
   ELEMENT = one type of atom (gold bar -> Au atoms) -> the catalogue slams down and opens into the
   periodic table (about 118) -> a gold atom shrugs off a hammer and a test tube (can't be broken down)
   -> Nate bursts in (sodium, Na lit) -> Arthur's confessional: NO SODIUM IN THE POOL -> the client
   form: Nate writes "NA", Arthur corrects it to "Na" -> the symbol rule -> Big then small: Na, Mg, C
   -> Co (cobalt) vs CO (carbon monoxide) -> the CO card gets a heart and rings: "It's a couple." */
scene('singles', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;
  const AMBER = '#FFC247', CYAN = '#7FE3FF', PINK = '#FF8FC8';

  /* ---------- local helpers (prefixed sg) ---------- */
  const sgCam = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const sgPlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const sgPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const sgChip = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(14,26,36,0.92)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: o.weight || 700 }); };
  const sgCard = (parent, w, h, stroke) => card(parent, -w / 2, -h / 2, w, h, { fill: 'rgba(14,26,36,0.94)', stroke: stroke || C.line, sw: 4, rx: 22 });
  const AU = ['#FFE07A', '#B8860B', '#5A3E00'];
  // an atom ball with a symbol (no face)
  function sgBall(parent, sym, r, cols) {
    const [c, dk, lc] = cols || EC_ATOM[sym] || EC_ATOM.C, g = G(parent);
    E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.09) }, g);
    T(g, 0, r * 0.36, sym, { size: Math.round(r * (sym.length > 1 ? 0.84 : 1)), weight: 800, fill: lc, anchor: 'middle' });
    return g;
  }
  // a single atom with eyes (a waiting client): g.set(t, look, shut 0..1, seed)
  function sgClient(parent, sym, r, cols) {
    const [c, dk, lc] = cols || EC_ATOM[sym] || EC_ATOM.C, g = G(parent), body = G(g);
    E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(2, r * 0.08) }, body);
    const eyes = [-1, 1].map(sd => {
      const w = E('ellipse', { cx: sd * r * 0.3, cy: -r * 0.26, rx: r * 0.19, ry: r * 0.23, fill: '#FFFFFF', stroke: INK, 'stroke-width': Math.max(2, r * 0.05) }, body);
      const p = E('circle', { cx: sd * r * 0.3, cy: -r * 0.24, r: r * 0.095, fill: INK }, body);
      return { w, p, sd };
    });
    T(body, 0, r * 0.66, sym, { size: Math.max(26, Math.round(r * 0.62)), weight: 800, fill: lc, anchor: 'middle' });
    g.body = body;
    g.set = (t, look, shut, seed) => {
      const bl = Math.max(scBlink(t, seed || 4), shut || 0);
      eyes.forEach(({ w, p, sd }) => {
        attr(w, 'ry', r * 0.23 * (1 - 0.85 * bl));
        attr(p, 'cx', sd * r * 0.3 + (look || 0) * r * 0.08); op(p, bl > 0.6 ? 0 : 1);
      });
    };
    g.set(0, 0, 0);
    return g;
  }

  /* layers */
  const Lset = G(root), LcastB = G(root), Lfront = G(root), LcastF = G(root), Lfg = G(root), Lhud = G(root);

  /* =================== the agency (camera-moved world) =================== */
  const AG = G(Lset);
  const agency = ecAgency(AG);
  // wall clock at 9:00
  const clock = G(AG); tr(clock, 590, 175);
  E('circle', { r: 42, fill: '#FFF6E8', stroke: INK, 'stroke-width': 5 }, clock);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.sin(a) * 32, y1: -Math.cos(a) * 32, x2: Math.sin(a) * 37, y2: -Math.cos(a) * 37, stroke: INK, 'stroke-width': 3 }, clock); }
  const hHand = E('line', { x1: 0, y1: 0, x2: -20, y2: 0, stroke: INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, clock);
  const mHand = E('line', { x1: 0, y1: 0, x2: 0, y2: -30, stroke: '#E8424F', 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  // the ticket machine's display, flips 07 -> 08
  const tkt = G(AG);
  E('rect', { x: 532, y: 430, width: 46, height: 36, rx: 4, fill: '#1B2733' }, tkt);
  const tktTxt = T(tkt, 555, 457, '07', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  // single clients waiting on the sofa
  const SOFA = [['O', 150, 478, 6], ['H', 245, 484, 9], ['C', 340, 478, 12], ['N', 432, 482, 15]];
  const clients = SOFA.map(([s, x, y, seed]) => ({ g: sgClient(AG, s, 38), x, y, seed }));
  // desk front (drawn over Arthur) + the mug
  const DF = G(Lfront);
  E('rect', { x: 640, y: 470, width: 520, height: 140, rx: 8, fill: '#7A3E6E', stroke: INK, 'stroke-width': 4 }, DF);
  E('rect', { x: 628, y: 458, width: 544, height: 22, rx: 6, fill: '#A05A90', stroke: INK, 'stroke-width': 4 }, DF);
  T(DF, 900, 560, 'RECEPTION', { size: 34, weight: 800, anchor: 'middle', fill: '#F7C8E4', ls: 4 });
  const mugW = G(DF); tr(mugW, 1080, 418); const mug = ecMug(mugW, 0.55);
  // the catalogue (lands on the desk)
  const book = G(DF);
  E('rect', { x: -112, y: -34, width: 224, height: 62, rx: 6, fill: '#F7F0E0', stroke: INK, 'stroke-width': 3 }, book);   // pages
  E('rect', { x: -116, y: -44, width: 232, height: 58, rx: 8, fill: '#E8424F', stroke: INK, 'stroke-width': 4 }, book);   // cover
  T(book, 0, -6, 'CATALOGUE', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  const thud = E('path', { d: 'M-150,10 L-190,0 M-150,24 L-196,30 M150,10 L190,0 M150,24 L196,30 M-60,-60 L-74,-92 M60,-60 L74,-92', stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, DF);

  /* dim veil for card shots */
  const veil = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#1A0C20' }, Lset);

  /* =================== the workbench (simpler) =================== */
  const BN = G(Lset);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2B2238', '#3E2F52', true) }, BN);
  for (let i = 0; i < 5; i++) E('rect', { x: 60 + i * 230, y: 120, width: 150, height: 14, rx: 7, fill: '#FFFFFF', opacity: 0.05 }, BN);
  E('rect', { x: 0, y: 520, width: 1200, height: 40, fill: '#B07A45', stroke: INK, 'stroke-width': 4 }, BN);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#7A5230' }, BN);
  E('path', { d: 'M0,610 L1200,610 M0,680 L1200,680', stroke: '#6A4628', 'stroke-width': 4 }, BN);
  const goldA = sgClient(BN, 'Au', 82, AU); const GOLD = [400, 438];
  const hammer = G(BN);
  E('rect', { x: -8, y: -178, width: 16, height: 178, rx: 7, fill: '#B07A45', stroke: INK, 'stroke-width': 3 }, hammer);
  E('rect', { x: -52, y: -214, width: 104, height: 50, rx: 8, fill: ball('#C9D3DC', '#6B7A88'), stroke: INK, 'stroke-width': 4 }, hammer);
  const bonk = G(BN); tr(bonk, 470, 300);
  E('path', { d: 'M0,-46 L12,-14 L46,-14 L18,6 L30,40 L0,18 L-30,40 L-18,6 L-46,-14 L-12,-14 Z', fill: '#FFE45C', stroke: INK, 'stroke-width': 3 }, bonk);
  T(bonk, 64, -30, 'BONK!', { size: 36, weight: 800, fill: '#FFE45C' });
  const tubeW = G(BN); const tube = testTube(tubeW, 44, 170, { level: 0.55, liquid: '#7CFFB0' });
  const tubeLbl = sgChip(BN, 'chemicals!', { size: 28, color: '#7CFFB0', stroke: '#7CFFB0' });
  const drops = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-10 Q8,2 0,8 Q-8,2 0,-10 Z', fill: '#7CFFB0' }, BN));
  const fizz = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 7, fill: 'none', stroke: '#7CFFB0', 'stroke-width': 3 }, BN));
  const stillChip = sgChip(BN, 'still ONE atom of gold', { size: 30, color: AMBER, stroke: AMBER });
  const simCard = G(BN); tr(simCard, 880, 280);
  sgCard(simCard, 520, 300, AMBER);
  T(simCard, 0, -84, 'An ELEMENT', { size: 44, weight: 800, anchor: 'middle', fill: AMBER });
  T(simCard, 0, -24, 'can’t be broken down', { size: 34, weight: 700, anchor: 'middle' });
  T(simCard, 0, 22, 'into anything simpler', { size: 34, weight: 700, anchor: 'middle' });
  T(simCard, 0, 86, 'by a **chemical reaction**', { size: 32, weight: 600, anchor: 'middle', boldFill: '#7CFFB0' });

  /* =================== Arthur's confessional =================== */
  const CF = ecConfessional(Lset, 'arthur');
  const pool = G(Lfg);
  E('rect', { x: -175, y: -170, width: 350, height: 360, rx: 18, fill: '#FFFFFF', stroke: INK, 'stroke-width': 5 }, pool);
  E('rect', { x: -175, y: -170, width: 350, height: 58, rx: 18, fill: '#2E7DD8' }, pool);
  E('rect', { x: -175, y: -132, width: 350, height: 20, fill: '#2E7DD8' }, pool);
  T(pool, 0, -130, 'POOL RULES', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  T(pool, 0, -66, 'NO SODIUM', { size: 40, weight: 800, anchor: 'middle', fill: '#D32F2F' });
  T(pool, 0, -26, 'IN THE POOL', { size: 30, weight: 800, anchor: 'middle', fill: INK });
  const wv = G(pool);
  E('path', { d: 'M-160,120 Q-140,108 -120,120 Q-100,132 -80,120 Q-60,108 -40,120 Q-20,132 0,120 Q20,108 40,120 Q60,132 80,120 Q100,108 120,120 Q140,132 160,120 L160,176 L-160,176 Z', fill: '#4CC9F0' }, wv);
  const ico = G(pool); tr(ico, 0, 66);
  let qd = '';
  for (let i = 0; i <= 8; i++) { const a = (-160 + i * 17.5) * Math.PI / 180, r = i % 2 ? 50 : 30; qd += (i ? ' L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r - 4).toFixed(1); }
  E('path', { d: qd + ' Z', fill: '#B4C2D0', stroke: INK, 'stroke-width': 3 }, ico);
  E('circle', { r: 32, fill: ball('#F3F6F9', '#8492A0'), stroke: '#56636F', 'stroke-width': 4 }, ico);
  T(ico, 0, 10, 'Na', { size: 28, weight: 800, anchor: 'middle', fill: INK });
  E('circle', { r: 54, fill: 'none', stroke: '#D32F2F', 'stroke-width': 10 }, ico);
  E('line', { x1: -38, y1: -38, x2: 38, y2: 38, stroke: '#D32F2F', 'stroke-width': 10 }, ico);
  const banned = G(Lfg);
  E('rect', { x: -130, y: -38, width: 260, height: 76, rx: 10, fill: 'none', stroke: '#FF4D5E', 'stroke-width': 7 }, banned);
  T(banned, 0, 18, 'BANNED', { size: 50, weight: 800, anchor: 'middle', fill: '#FF4D5E', ls: 4 });
  const reactChip = sgChip(Lfg, 'VERY reactive metal', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });

  /* =================== Nate's entrance =================== */
  const speed = E('path', { d: 'M-260,-40 L-120,-40 M-300,0 L-140,0 M-260,40 L-120,40', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.7 }, Lfg);
  const ptW = G(Lfg); const PT = ecPeriodic(ptW, 40);   // one periodic table, scaled per shot
  const ptRing = E('rect', { x: -24, y: -24, width: 48, height: 48, rx: 8, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5 }, ptW);
  const naChip = sgChip(Lfg, 'sodium = Na', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });
  const metalChip = sgChip(Lfg, 'a soft, shiny METAL', { size: 30 });
  const hearts = [0, 1, 2].map(() => E('path', { d: 'M0,14 C-26,-2 -20,-24 -7,-23 C-2,-22 0,-17 0,-13 C0,-17 2,-22 7,-23 C20,-24 26,-2 0,14 Z', fill: '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 2 }, Lfg));
  const ltNate = scLowerThird(Lhud, ...EC_LOWER.nate);

  /* =================== element card (gold) =================== */
  const elCard = G(Lfg);
  sgCard(elCard, 490, 440, '#FFD54A');
  T(elCard, 0, -150, 'ELEMENT', { size: 56, weight: 800, anchor: 'middle', fill: '#FFD54A', ls: 2 });
  T(elCard, 0, -98, 'only **ONE type** of atom', { size: 32, weight: 600, anchor: 'middle', boldFill: '#FFD54A' });
  const ingot = G(elCard); tr(ingot, -128, 30);
  E('path', { d: 'M-70,30 L-48,-22 L48,-22 L70,30 Z', fill: ball('#FFE07A', '#B8860B'), stroke: '#7A5A10', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ingot);
  E('path', { d: 'M-48,-22 L48,-22 L40,-30 L-40,-30 Z', fill: '#FFF0B0', stroke: '#7A5A10', 'stroke-width': 3 }, ingot);
  T(ingot, 0, 78, 'gold', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE07A' });
  const zoomLn = E('path', { d: 'M-80,10 L10,-62 M-80,40 L10,118', stroke: '#FFE07A', 'stroke-width': 3, 'stroke-dasharray': '8 6', fill: 'none' }, elCard);
  const mag = G(elCard); tr(mag, 92, 28);
  E('circle', { r: 104, fill: '#2A2210', stroke: '#FFE07A', 'stroke-width': 5 }, mag);
  const auAtoms = [[0, 0]].concat([0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * TAU / 6) * 64, Math.sin(i * TAU / 6) * 64])).map(([x, y]) => { const a = sgBall(mag, 'Au', 31, AU); tr(a, x, y); return a; });
  const auTxt = T(elCard, 0, 192, 'Au, Au, Au… only gold atoms', { size: 28, weight: 700, anchor: 'middle', fill: '#FFE07A' });

  const nineChip = sgChip(Lfg, '9:00 a.m.', { size: 30, color: '#FFE45C', stroke: '#FFE45C' });
  const clientChip = sgChip(Lfg, 'every client = an ELEMENT', { size: 38, color: '#FFD54A', stroke: '#FFD54A' });

  /* =================== catalogue chips =================== */
  const c118 = sgChip(Lfg, 'about 118 elements', { size: 36, color: AMBER, stroke: AMBER });
  const cPT = sgChip(Lfg, 'the PERIODIC TABLE', { size: 38, color: '#FFFFFF', stroke: CYAN });

  /* =================== the client form =================== */
  const FORM = G(Lfg); tr(FORM, 430, 400);
  E('rect', { x: -300, y: -220, width: 600, height: 440, rx: 14, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 5 }, FORM);
  E('rect', { x: -300, y: -220, width: 600, height: 70, rx: 14, fill: '#B3326F' }, FORM);
  E('rect', { x: -300, y: -170, width: 600, height: 20, fill: '#B3326F' }, FORM);
  T(FORM, 0, -172, 'CLIENT FORM', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  T(FORM, -260, -86, 'Name:', { size: 32, weight: 700, fill: '#6A6A6A' });
  E('line', { x1: -150, y1: -72, x2: 250, y2: -72, stroke: '#C9BFA6', 'stroke-width': 3 }, FORM);
  const fName = T(FORM, -140, -84, 'Nate', { size: 50, weight: 700, fill: '#2E5BD8' });
  const fTick = tick(FORM, 18, '#2E9E5B'); tr(fTick, 60, -100);
  T(FORM, -260, -12, 'Chemical symbol:', { size: 32, weight: 700, fill: '#6A6A6A' });
  E('line', { x1: -260, y1: 148, x2: 250, y2: 148, stroke: '#C9BFA6', 'stroke-width': 3 }, FORM);
  const fN = T(FORM, -170, 136, 'N', { size: 130, weight: 700, fill: '#2E5BD8', anchor: 'middle' });
  const fAg = G(FORM); const fA = T(fAg, 0, 0, 'A', { size: 130, weight: 700, fill: '#2E5BD8', anchor: 'middle' });
  const fAx = E('path', { d: 'M-46,-100 L46,0 M46,-100 L-46,0', stroke: '#E53935', 'stroke-width': 10, 'stroke-linecap': 'round', fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, fAg);
  const fa = T(FORM, -78, 136, 'a', { size: 130, weight: 700, fill: '#E53935', anchor: 'middle' });
  const fOk = G(FORM);
  E('ellipse', { cx: -126, cy: 88, rx: 112, ry: 84, fill: 'none', stroke: '#2E9E5B', 'stroke-width': 6 }, fOk);
  const fOkT = tick(fOk, 22, '#2E9E5B'); tr(fOkT, 30, 40);
  const penB = G(Lfg), penR = G(Lfg);
  [[penB, '#2E5BD8'], [penR, '#E53935']].forEach(([p, c]) => {
    E('path', { d: 'M0,0 L-10,-26 L10,-26 Z', fill: '#F2D9B8', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, p);
    E('rect', { x: -12, y: -130, width: 24, height: 106, rx: 6, fill: c, stroke: INK, 'stroke-width': 3 }, p);
    E('circle', { cy: 0, r: 4, fill: INK }, p);
  });

  /* =================== the rule card =================== */
  const RULE = G(Lfg); tr(RULE, 590, 380);
  sgCard(RULE, 840, 420, CYAN);
  T(RULE, 0, -146, 'CHEMICAL SYMBOL', { size: 46, weight: 800, anchor: 'middle', fill: CYAN, ls: 2 });
  const r1 = G(RULE), r2 = G(RULE);
  T(r1, -370, -50, '1st letter: always a', { size: 32, weight: 600, fill: C.muted });
  T(r1, -370, 4, 'CAPITAL', { size: 54, weight: 800, fill: AMBER });
  T(r2, -370, 86, '2nd letter: always', { size: 32, weight: 600, fill: C.muted });
  T(r2, -370, 140, 'lower case', { size: 54, weight: 800, fill: '#7CFFB0' });
  const rN = T(RULE, 190, 120, 'N', { size: 200, weight: 700, anchor: 'end', fill: AMBER });
  const ra = T(RULE, 194, 120, 'a', { size: 200, weight: 700, anchor: 'start', fill: '#7CFFB0' });
  const rArr1 = arrow(RULE, -60, -16, 110, -40, { color: AMBER, width: 5, bend: -30 });
  const rArr2 = arrow(RULE, 40, 120, 210, 90, { color: '#7CFFB0', width: 5, bend: 30 });

  /* =================== Big then small =================== */
  const bigT = T(Lfg, 600, 532, 'Big then small', { size: 50, weight: 800, anchor: 'middle', fill: AMBER });
  const BIGS = [['N', 'a', 'sodium', 'Na', 0.18, 0.39, 300], ['M', 'g', 'magnesium', 'Mg', 0.48, 0.73, 600], ['C', '', 'carbon', 'C', 0.82, 0.82, 900]].map(([A, b, name, sym, fa_, fb_, x]) => {
    const g = G(Lfg);
    card(g, -125, -78, 250, 156, { fill: 'rgba(14,26,36,0.94)', stroke: AMBER, sw: 4, rx: 18 });
    const big = T(g, b ? 4 : 0, 22, A, { size: 74, weight: 800, anchor: b ? 'end' : 'middle', fill: AMBER });
    const sm = b ? T(g, 8, 22, b, { size: 74, weight: 800, anchor: 'start', fill: '#7CFFB0' }) : null;
    T(g, 0, 62, name, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    return { g, big, sm, sym, fa: fa_, fb: fb_, x };
  });

  /* =================== Co vs CO =================== */
  function sgSymCard(x, big, name, lines, col) {
    const g = G(Lfg);
    sgCard(g, 450, 410, col);
    const t1 = T(g, 4, -92, big[0], { size: 110, weight: 800, anchor: 'end', fill: AMBER });
    const t2 = T(g, 8, -92, big[1], { size: 110, weight: 800, anchor: 'start', fill: big[1] === 'o' ? '#7CFFB0' : AMBER });
    T(g, 0, -40, name, { size: 36, weight: 800, anchor: 'middle', fill: C.ink });
    const tl = lines.map((s, i) => T(g, 0, 140 + i * 36, s, { size: 28, weight: 600, anchor: 'middle', fill: col, boldFill: col }));
    return { g, t1, t2, tl, x };
  }
  const coL = sgSymCard(330, ['C', 'o'], 'cobalt', ['a metal:', 'an **ELEMENT**'], CYAN);
  const coAtom = sgBall(coL.g, 'Co', 46, ['#B9C8E6', '#55688F', '#FFFFFF']); tr(coAtom, 0, 42);
  const coR = sgSymCard(870, ['C', 'O'], 'carbon monoxide', ['carbon + oxygen, bonded:', 'a **COMPOUND**'], PINK);
  const mol = G(coR.g); tr(mol, 0, 42);
  const molBond = E('path', { d: 'M-12,-8 L12,-8 M-12,8 L12,8', stroke: '#FFFFFF', 'stroke-width': 6 }, mol);
  const molC = sgBall(mol, 'C', 40), molO = sgBall(mol, 'O', 40);
  const flash = E('circle', { r: 30, fill: '#FFFFFF' }, mol);
  // couple: heart and rings
  const love = G(coR.g); tr(love, 0, -10);
  E('path', { d: 'M0,26 C-52,-6 -40,-48 -14,-46 C-5,-45 0,-36 0,-29 C0,-36 5,-45 14,-46 C40,-48 52,-6 0,26 Z', fill: '#FF5FA2', stroke: '#FFFFFF', 'stroke-width': 4 }, love);
  const rings = G(coR.g);
  E('circle', { cx: -14, r: 18, fill: 'none', stroke: '#FFD54A', 'stroke-width': 7 }, rings);
  E('circle', { cx: 14, r: 18, fill: 'none', stroke: '#FFD54A', 'stroke-width': 7 }, rings);
  E('path', { d: 'M-14,-26 L-8,-34 L-20,-34 Z M14,-26 L20,-34 L8,-34 Z', fill: '#BFEFFF', stroke: '#FFFFFF', 'stroke-width': 2 }, rings);
  const twoCap = sgChip(Lfg, '2 capitals = 2 elements', { size: 32, color: AMBER, stroke: AMBER });

  /* =================== the cast =================== */
  const arthur = cast(LcastB, 'arthur');
  const nate = cast(LcastF, 'nate');

  /* shots */
  const cut = id => at(id) - 0.06;
  const SH = [['open', -1e9], ['element', cut('element')], ['catalogue', cut('catalogue')], ['simpler', cut('simpler')], ['nate', cut('nate')],
    ['thnate', cut('thnate')], ['form', cut('na')], ['rule', cut('rule')], ['big', cut('big')], ['cobalt', cut('cobalt')], ['couple', cut('couple')]];
  const shotAt = t => { let s = SH[0]; for (const x of SH) if (t >= x[1]) s = x; return s; };
  const FG = [nineChip, clientChip, elCard, c118, cPT, ptW, naChip, metalChip, speed, pool, banned, reactChip, FORM, penB, penR, RULE, bigT, coL.g, coR.g, twoCap].concat(hearts, BIGS.map(b => b.g));
  const ARTHUR_HOME = [930, 398, 0.95];

  return t => {
    const sh = shotAt(t), sid = sh[0];
    const agencyOn = ['open', 'element', 'catalogue', 'nate', 'rule', 'big', 'cobalt', 'couple'].includes(sid);
    op(AG, agencyOn ? 1 : 0); op(DF, ['open', 'element', 'catalogue', 'nate'].includes(sid) ? 1 : 0);
    op(BN, sid === 'simpler' ? 1 : 0);
    CF.set(sid === 'thnate' ? 1 : 0, t);
    FG.forEach(g => op(g, 0));
    op(veil, 0); op(book, 0); op(thud, 0);
    let cam = { k: 1, cx: 600, cy: 400 };
    let A = null, N = null;                 // character poses (screen space unless .world)
    const talkA = scTalk(S, t, 'arthur'), talkN = scTalk(S, t, 'nate');
    if (agencyOn) {
      agency.upd(t);
      // clock and ticket
      attr(mHand, 'transform', `rotate(${(6 * P(t, 1.5, 4, linear)).toFixed(2)})`);
      attr(hHand, 'transform', `rotate(${(0.5 * P(t, 1.5, 4, linear)).toFixed(2)})`);
      const flip = P(t, mid('open', 0.22), 0.25, linear);
      setText(tktTxt, flip > 0.5 ? '08' : '07'); tr(tktTxt, 0, 0);
      tktTxt.setAttribute('transform', `translate(555 447) scale(1 ${Math.max(0.05, Math.abs(1 - 2 * flip)).toFixed(3)}) translate(-555 -447)`);
      mug.steam.style.opacity = (0.35 + 0.3 * Math.sin(t * 3)).toFixed(3);
    }

    /* ---------- open: the agency opens ---------- */
    if (sid === 'open') {
      cam = { k: 1 + 0.05 * P(t, 1.6, 6, linear), cx: 600, cy: 430 };
      A = { world: 1, x: ARTHUR_HOME[0], y: ARTHUR_HOME[1], s: ARTHUR_HOME[2], mood: 'deadpan', look: -0.7 };
      sgPlace(nineChip, cam, 590, 262, 1); op(nineChip, clamp(P(t, at('open') + 0.1, 0.45, pop) * 2.5));
      sgPop(clientChip, 600, 680, P(t, mid('open', 0.78), 0.45, pop));
    }
    /* ---------- element: Arthur at the desk, the gold card ---------- */
    if (sid === 'element') {
      cam = { k: 1.3, cx: 1010, cy: 430 };
      A = { world: 1, x: ARTHUR_HOME[0], y: ARTHUR_HOME[1], s: ARTHUR_HOME[2], mood: t > mid('element', 0.7) ? 'smug' : 'deadpan', look: t < mid('element', 0.6) ? -0.5 : -0.9 };
      const p = P(t, at('element') + 0.05, 0.45, pop);
      sgPop(elCard, 320, 392, p);
      const gi = P(t, mid('element', 0.62), 0.4, pop);
      op(ingot, clamp(gi * 2.5)); tr(ingot, -128, 30, Math.max(0.01, 0.6 + 0.4 * gi));
      const zm = P(t, mid('element', 0.74), 0.5, pop);
      op(mag, clamp(zm * 2.5)); tr(mag, 92, 28, Math.max(0.01, zm)); op(zoomLn, clamp(zm * 2));
      auAtoms.forEach((a, i) => op(a, P(t, mid('element', 0.76) + i * 0.06, 0.2, linear)));
      op(auTxt, P(t, mid('element', 0.86), 0.3, linear));
    }
    /* ---------- catalogue: the book slams, the periodic table ---------- */
    if (sid === 'catalogue') {
      const open_ = P(t, mid('catalogue', 0.5), 0.5, ease);
      cam = { k: lerp(1.15, 1, open_), cx: 880, cy: 430 };
      A = { world: 1, x: ARTHUR_HOME[0], y: ARTHUR_HOME[1], s: ARTHUR_HOME[2], mood: 'deadpan', look: t < at('catalogue') + 0.6 ? -0.2 : -0.6 };
      const fall = P(t, at('catalogue') - 0.05, 0.32, easeIn);
      op(book, 1 - open_); tr(book, 860, lerp(140, 432, fall), 1, lerp(-14, 0, fall));
      const th = P(t, at('catalogue') + 0.27, 0.35, linear);
      op(thud, th > 0 && th < 1 ? 1 - th : 0);
      op(veil, 0.82 * open_);
      if (open_ > 0) {
        A = { x: lerp(cam.cx + cam.k * (ARTHUR_HOME[0] - cam.cx), 1090, open_), y: lerp(cam.cy + cam.k * (ARTHUR_HOME[1] - cam.cy), 645, open_), s: lerp(ARTHUR_HOME[2] * cam.k, 0.48, open_), mood: 'deadpan', look: -0.8, front: 1 };
        op(ptW, open_); tr(ptW, lerp(860, 600, open_), lerp(432, 405, open_), lerp(0.2, 1, open_));
        ['Au', 'Na', 'Mg', 'C', 'Co'].forEach(s => PT.hi(s, 0)); PT.hi('Au', 0); op(ptRing, 0);
      }
      sgPop(c118, 870, 150, P(t, mid('catalogue', 0.12), 0.45, pop));
      if (open_ <= 0) op(c118, 0);
      sgPop(cPT, 600, 668, P(t, mid('catalogue', 0.78), 0.45, pop));
    }
    /* ---------- simpler: the unbreakable gold atom ---------- */
    if (sid === 'simpler') {
      const s1 = mid('simpler', 0.1), s2 = mid('simpler', 0.3);
      const strike = tt => { const u = (t - tt) / 0.5; return u < 0 || u > 1 ? 0 : (u < 0.35 ? u / 0.35 : 1 - (u - 0.35) / 0.65); };
      const hit = Math.max(strike(s1), strike(s2));
      const hamOn = win(t, at('simpler') + 0.05, mid('simpler', 0.5), 0.2);
      op(hammer, hamOn); tr(hammer, 560, 520, 1, lerp(14, -41, hit));
      const squash = Math.max(strike(s1 + 0.12), strike(s2 + 0.12)) * (hit > 0.8 ? 1 : 0);
      const bk = Math.max(win(t, s1 + 0.15, s1 + 0.55, 0.08), win(t, s2 + 0.15, s2 + 0.55, 0.08));
      op(bonk, bk); tr(bonk, 470, 300, 0.8 + 0.3 * bk);
      // the test tube pours
      const tp = win(t, mid('simpler', 0.48), end('simpler') + 0.1, 0.25);
      op(tubeW, tp); tr(tubeW, 300, 230, 1, lerp(30, 118, P(t, mid('simpler', 0.48), 0.5)));
      op(tubeLbl, tp); tr(tubeLbl, 190, 140);
      drops.forEach((d, i) => { const q = ((t - mid('simpler', 0.55)) * 1.4 + i / 4) % 1; const on = t > mid('simpler', 0.55) && t < end('simpler'); op(d, on ? 1 - q * 0.5 : 0); tr(d, 350 + i * 8, 290 + q * 70); });
      fizz.forEach((f, i) => { const q = ((t - mid('simpler', 0.62)) * 0.9 + i / 6) % 1, on = t > mid('simpler', 0.62) && t < end('simpler') + 0.4; op(f, on ? Math.sin(q * Math.PI) : 0); tr(f, GOLD[0] + Math.cos(i * 1.7) * 96, GOLD[1] - 20 - q * 80); });
      const shut = Math.max(hit > 0.7 ? 1 : 0, t > end('simpler') - 0.2 ? 0.45 : 0);
      goldA.set(t, t > mid('simpler', 0.5) ? -0.6 : 0.4, shut, 7);
      tr(goldA, GOLD[0], GOLD[1] + squash * 12);
      goldA.body.setAttribute('transform', `scale(${(1 + 0.16 * squash).toFixed(3)} ${(1 - 0.18 * squash).toFixed(3)})`);
      sgPop(simCard, 880, 280, P(t, at('simpler') + 0.1, 0.45, pop));
      sgPop(stillChip, 400, 640, P(t, end('simpler') - 0.3, 0.45, pop));
      A = { x: 1010, y: 610, s: 0.62, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- nate bursts in ---------- */
    if (sid === 'nate') {
      const e = P(t, at('nate') - 0.06, 0.55, easeOut);
      const hop = Math.abs(Math.sin((t - at('nate')) * 5.2)) * 22 * AMP;
      const nx = lerp(-200, 300, e), ny = 330 - 90 * Math.sin(Math.PI * e) - (e >= 1 ? hop : 0);
      const shake = (1 - P(t, at('nate') + 0.45, 0.4, linear)) * (e > 0.9 ? 1 : 0) * 6 * Math.sin(t * 60) * AMP;
      cam = { k: 1, cx: 600 + shake, cy: 400 };
      N = { x: nx, y: ny, s: 0.95, r: lerp(-30, 0, e) + 6 * Math.sin(t * 6) * AMP, mood: 'happy', look: 0.7 };
      op(speed, e < 1 ? 1 - e * 0.5 : 0); tr(speed, nx - 40, ny);
      A = { world: 1, x: ARTHUR_HOME[0], y: ARTHUR_HOME[1], s: ARTHUR_HOME[2], mood: 'deadpan', look: -1 };
      const pp = P(t, mid('nate', 0.18), 0.45, pop);
      op(ptW, clamp(pp * 2.5)); tr(ptW, 900, 212, Math.max(0.01, 0.5 * (0.6 + 0.4 * pp)));
      ['Au', 'Mg', 'C', 'Co'].forEach(s => PT.hi(s, 0));
      PT.hi('Na', P(t, mid('nate', 0.22), 0.3, linear));
      const [nx0, ny0] = PT.at('Na'); op(ptRing, P(t, mid('nate', 0.24), 0.3, linear)); tr(ptRing, nx0, ny0, 1.05 + 0.08 * Math.sin(t * 6));
      sgPop(naChip, 640, 380, P(t, mid('nate', 0.24), 0.45, pop));
      sgPop(metalChip, 640, 450, P(t, mid('nate', 0.36), 0.45, pop));
      hearts.forEach((h, i) => { const t0 = mid('nate', 0.64) + i * 0.15, q = ((t - t0) * 0.6) % 1; if (t < t0) { op(h, 0); return; } op(h, Math.sin(Math.min(1, q) * Math.PI)); tr(h, nx - 80 + i * 80 + 8 * Math.sin(q * 7 + i), ny - 130 - q * 90, 1 + 0.4 * q); });
    }
    ltNate.set(sid === 'nate' ? win(t, at('nate') + 0.45, at('nate') + 3.9, 0.3) : 0);
    /* ---------- thnate: Arthur's confessional ---------- */
    if (sid === 'thnate') {
      const k = 1 + 0.03 * P(t, at('thnate'), 4, linear) + 0.12 * P(t, end('thnate') - 0.1, 0.9);
      cam = { k, cx: 430, cy: 380 };
      sgCam(CF, k, 430, 380);
      A = { x: 430 + 0, y: 390, s: 1.5, mood: t > mid('thnate', 0.45) ? 'deadpan' : 'neutral', look: t > mid('thnate', 0.2) && t < mid('thnate', 0.5) ? 0.8 : 0, conf: 1 };
      sgPop(pool, 905, 300, P(t, at('thnate') + 0.1, 0.45, pop), 1, -3);
      op(wv, 1); tr(wv, 6 * Math.sin(t * 2), 0);
      sgPop(reactChip, 905, 548, P(t, mid('thnate', 0.24), 0.45, pop));
      const bp = P(t, mid('thnate', 0.5), 0.35, pop);
      op(banned, clamp(bp * 3)); tr(banned, 905, 452, Math.max(0.01, 1.8 - 0.8 * bp), -14);
    } else sgCam(CF, 1, 430, 380);
    /* ---------- the client form (na, lower) ---------- */
    if (sid === 'form') {
      const push = P(t, end('lower') - 0.15, 1.1, ease);
      const k = 1 + 0.12 * push, cx = 300, cy = 470;
      cam = { k, cx, cy };
      op(FORM, 1); FORM.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy}) translate(430 400)`);
      op(fName, 1); op(fTick, P(t, mid('na', 0.25), 0.3, linear));
      const nOn = P(t, mid('na', 0.82), 0.2, linear), aOn = P(t, mid('na', 0.93), 0.2, linear);
      op(fN, nOn); op(fAg, aOn);
      const cross_ = P(t, at('lower') + 0.15, 0.35, linear);
      fAx.setAttribute('stroke-dashoffset', (1 - cross_).toFixed(3)); op(fAx, cross_ > 0.01 ? 1 : 0);
      const mv = P(t, at('lower') + 0.55, 0.4, ease);
      fAg.setAttribute('transform', `translate(${lerp(-60, 210, mv).toFixed(1)} ${lerp(136, 40, mv).toFixed(1)}) scale(${lerp(1, 0.5, mv).toFixed(3)})`);
      op(fA, 1);
      const sa = P(t, at('lower') + 0.7, 0.35, pop);
      op(fa, clamp(sa * 2.5));
      const ok = P(t, end('lower') + 0.1, 0.4, pop);
      op(fOk, clamp(ok * 2.5));
      // pens
      const wN = mid('na', 0.82), wA = mid('na', 0.93);
      const bpx = t < wN - 0.2 ? 790 : t < wA ? 260 : t < end('na') + 0.3 ? 372 : 790;
      const bpy = t < wN - 0.2 || t >= end('na') + 0.3 ? 360 : 500 + 10 * Math.sin(t * 30);
      op(penB, sid === 'form' && t < at('lower') ? 1 : 0); sgPlace(penB, cam, bpx, bpy, 0.8, 24);
      const rpx = t < at('lower') ? 820 : t < at('lower') + 0.6 ? 372 + 40 * Math.sin((t - at('lower')) * 14) : t < end('lower') + 0.2 ? 352 : 820;
      const rpy = t < at('lower') ? 640 : t < end('lower') + 0.2 ? 500 : 640;
      op(penR, t >= at('lower') - 0.3 ? 1 : 0); sgPlace(penR, cam, rpx, rpy, 0.8, 24);
      const proud = t >= mid('na', 0.85) && t < at('lower') + 0.15;
      N = { world: 1, x: 950, y: 290, s: 0.78, mood: t >= at('lower') + 0.2 && t < at('lower') + 1.0 ? 'shock' : proud ? 'happy' : 'happy', look: t < at('lower') ? -0.8 : 0.6 };
      A = { world: 1, x: 990, y: 580, s: 0.74, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- rule ---------- */
    if (sid === 'rule') {
      op(veil, 0.8);
      sgPop(RULE, 590, 380, P(t, at('rule') + 0.02, 0.45, pop));
      op(r1, P(t, mid('rule', 0.05), 0.3, linear)); op(r2, P(t, mid('rule', 0.52), 0.3, linear));
      op(rN, P(t, mid('rule', 0.15), 0.3, linear)); op(ra, P(t, mid('rule', 0.62), 0.3, linear));
      rArr1.set(P(t, mid('rule', 0.2), 0.5)); rArr2.set(P(t, mid('rule', 0.68), 0.5));
      A = { x: 1100, y: 650, s: 0.46, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- big then small ---------- */
    if (sid === 'big') {
      op(veil, 0.82);
      const pp = P(t, at('big') - 0.02, 0.4, pop);
      op(ptW, clamp(pp * 2.5)); tr(ptW, 600, 300, Math.max(0.01, 0.74 * (0.7 + 0.3 * pp)));
      op(ptRing, 0); PT.hi('Au', 0); PT.hi('Co', 0);
      const bt = P(t, at('big') + 0.05, 0.4, pop);
      op(bigT, clamp(bt * 2.5)); tr(bigT, 0, 0); bigT.setAttribute('transform', `translate(600 517) scale(${Math.max(0.01, 0.6 + 0.4 * bt).toFixed(3)}) translate(-600 -517)`);
      BIGS.forEach(b => {
        const p = P(t, mid('big', b.fa), 0.4, pop);
        sgPop(b.g, b.x, 628, p);
        op(b.big, P(t, mid('big', b.fa), 0.2, linear));
        if (b.sm) op(b.sm, P(t, mid('big', b.fb), 0.25, linear));
        PT.hi(b.sym, P(t, mid('big', b.fa), 0.3, linear));
      });
      A = { x: 1112, y: 648, s: 0.42, mood: 'deadpan', look: -1, front: 1 };
    }
    /* ---------- cobalt vs carbon monoxide ---------- */
    if (sid === 'cobalt' || sid === 'couple') {
      op(veil, 0.82);
      const L = coL, R = coR;
      if (sid === 'cobalt') {
        sgPop(L.g, L.x, 360, P(t, mid('cobalt', 0.1), 0.45, pop));
        op(L.t1, P(t, mid('cobalt', 0.2), 0.2, linear)); op(L.t2, P(t, mid('cobalt', 0.36), 0.2, linear));
        op(coAtom, P(t, mid('cobalt', 0.14), 0.3, linear)); L.tl.forEach((x, i) => op(x, P(t, mid('cobalt', 0.24 + i * 0.06), 0.3, linear)));
        sgPop(R.g, R.x, 360, P(t, mid('cobalt', 0.42), 0.45, pop));
        op(R.t1, P(t, mid('cobalt', 0.44), 0.2, linear)); op(R.t2, P(t, mid('cobalt', 0.54), 0.2, linear));
        R.tl.forEach((x, i) => op(x, P(t, mid('cobalt', 0.8 + i * 0.1), 0.3, linear)));
        const mj = P(t, mid('cobalt', 0.78), 0.5, ease);
        op(mol, P(t, mid('cobalt', 0.6), 0.3, linear));
        tr(molC, lerp(-90, -36, mj), 0); tr(molO, lerp(90, 36, mj), 0); op(molBond, P(t, mid('cobalt', 0.93), 0.15, linear));
        const fl = P(t, mid('cobalt', 0.93), 0.4, linear); op(flash, fl > 0 && fl < 1 ? 1 - fl : 0); attr(flash, 'r', 20 + 70 * fl);
        op(love, 0); op(rings, 0);
        A = { x: 600, y: 652, s: 0.48, mood: 'deadpan', look: t < mid('cobalt', 0.42) ? -1 : 1, front: 1 };
      } else {
        // couple: closer on the CO card, Arthur big on the right
        const push = P(t, end('couple') - 0.2, 1.2, ease);
        const k = 1 + 0.16 * push, cx = 880, cy = 380;
        cam = { k, cx, cy };
        op(R.g, 1); R.g.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy}) translate(360 370) scale(1.08)`);
        [R.t1, R.t2, mol, molBond].forEach(x => op(x, 1)); R.tl.forEach(x => op(x, 1)); op(flash, 0);
        tr(molC, -36, 0); tr(molO, 36, 0);
        const lp = P(t, mid('couple', 0.66), 0.45, pop);
        op(love, clamp(lp * 2.5)); tr(love, 152, 52, Math.max(0.01, lp * (1 + 0.06 * Math.sin(t * 6) * AMP)));
        const rp = P(t, mid('couple', 0.8), 0.45, pop);
        op(rings, clamp(rp * 2.5)); tr(rings, -150, 52, Math.max(0.01, rp), 12);
        const cp = P(t, at('couple') + 0.1, 0.45, pop);
        op(twoCap, clamp(cp * 2.5)); sgPlace(twoCap, cam, 360, 646, 0.6 + 0.4 * cp);
        A = { world: 1, x: 900, y: 420, s: 1.3, mood: 'deadpan', look: t < end('couple') ? -0.6 : 0, front: 1 };
      }
    }

    /* ---------- camera + cast ---------- */
    if (agencyOn) { sgCam(AG, cam.k, cam.cx, cam.cy); sgCam(DF, cam.k, cam.cx, cam.cy); }
    clients.forEach(({ g, x, y, seed }, i) => {
      const lookN = sid === 'nate' ? 1 : sid === 'open' ? (t > mid('open', 0.2) && t < mid('open', 0.5) ? 1 : (i % 2 ? 0.6 : -0.4)) : 0.8;
      const hopC = i === 3 ? Math.abs(Math.sin(P(t, mid('open', 0.22), 0.6, linear) * Math.PI)) * 26 : 0;
      tr(g, x, y - hopC + Math.sin(t * 1.6 + i) * 2 * AMP);
      g.set(t, lookN, 0, seed);
    });
    // Arthur: behind the desk (LcastB) in agency shots, in front of the cards (LcastF) elsewhere
    const wantFront = A && A.front;
    if (wantFront && arthur.parentNode !== LcastF) LcastF.appendChild(arthur);
    if (!wantFront && arthur.parentNode !== LcastB) LcastB.appendChild(arthur);
    if (A) {
      op(arthur, 1);
      if (A.world) sgPlace(arthur, cam, A.x, A.y, A.s);
      else if (A.conf) sgPlace(arthur, cam, A.x, A.y, A.s);
      else tr(arthur, A.x, A.y, A.s);
      arthur.set({ t, talk: talkA, mood: A.mood, look: A.look });
    } else op(arthur, 0);
    if (N) {
      op(nate, 1);
      if (N.world) sgPlace(nate, cam, N.x, N.y, N.s, N.r); else tr(nate, N.x, N.y, N.s, N.r || 0);
      nate.set({ t, talk: talkN, mood: N.mood, look: N.look });
    } else op(nate, 0);
  };
});

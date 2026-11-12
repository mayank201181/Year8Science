/* Scene 2: "Ground operations" (the breathing mechanism).
   Shots (hard sitcom cuts): the control room under the lungs (breathing = ventilation, no chemistry; the chest
   breathing at rest) -> Dennis by the chest (lungs: NO MUSCLES; two pink sponges) -> Iggy bursts in -> Dennis
   confessional (Iggy's gym plan: RIB DAY) -> the pressure rule (high -> low) -> the showpiece chest: breathing IN
   (Dennis flattens, Iggy lifts the ribs, a sports-style replay; volume up, pressure down, air pushed in) -> Kavya:
   "So my lungs suck?" -> silence, Dennis -> "Nobody sucks anything" (the room gets bigger) -> breathing OUT
   (muscles relax; volume down, pressure up, air pushed out) -> Dennis confessional (passive; "I just... relax")
   -> both chains side by side -> Iggy's foam hand: IN = CONTRACT. Nigel drifts through the back of the room. */
scene('ground', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------- local helpers (prefixed gnd) ---------- */
  const gndCam = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy})`);
  const gndShow = (el, t, t0, t1, x, y, s, r) => {
    const p = P(t, t0, 0.45, pop), out = t1 === undefined ? 0 : P(t, t1, 0.2, linear);
    const v = t >= t0 ? clamp(p * 2.5) * (1 - out) : 0;
    op(el, v); if (v > 0) tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r);
    return p;
  };
  const gndFade = (el, t, t0, t1) => op(el, (t >= t0 ? P(t, t0, 0.25, linear) : 0) * (t1 === undefined ? 1 : 1 - P(t, t1, 0.2, linear)));
  const gndLbl = (parent, str, o) => { o = o || {}; return lhChip(parent, str, { size: o.size || 34, fill: o.fill || 'rgba(16,8,14,0.92)', stroke: o.stroke || '#6E3A4E', sw: 3, color: o.color || C.ink, weight: o.weight || 700, boldFill: o.boldFill }); };
  const RED = '#FF8A96', BLUE = '#8FC3FF', GREEN = C.good;
  // three lines of text, left-aligned at (0,0)
  const gndLines = (parent, rows, o) => {
    o = o || {};
    const g = G(parent);
    g.rows = rows.map((r, i) => lhRich(g, 0, i * (o.lh || 40), r, { size: o.size || 30, weight: 700, fill: '#FFFFFF', boldFill: o.boldFill || LH.signTx }));
    return g;
  };

  /* ---------- layers ---------- */
  const Lbg = G(root), Lmid = G(root), Lfg = G(root), Lhud = G(root);

  /* =================== THE CONTROL ROOM =================== */
  const ROOM = G(Lbg), RC = G(ROOM);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#26090F', '#4A1620', true) }, RC);
  let seams = '';
  for (let x = 150; x < 1200; x += 220) seams += `M${x},0 L${x},610 `;
  E('path', { d: seams + 'M0,360 L1200,360', stroke: '#5E2230', 'stroke-width': 4, opacity: 0.7 }, RC);
  // pipes along the wall
  E('path', { d: 'M0,120 L1200,120 M0,140 L1200,140', stroke: '#6E2A3A', 'stroke-width': 12 }, RC);
  const beacons = [[640, 160], [1120, 380]].map(([x, y]) => { E('rect', { x: x - 14, y: y + 10, width: 28, height: 14, fill: '#3A3F48' }, RC); return E('ellipse', { cx: x, cy: y, rx: 18, ry: 16, fill: '#FF9A3D', stroke: INK, 'stroke-width': 3 }, RC); });
  const beamG = E('ellipse', { cx: 640, cy: 160, rx: 70, ry: 40, fill: glow('#FFB060') }, RC);
  // floor with warning stripes
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#3A1018' }, RC);
  let stripes = '';
  for (let x = -40; x < 1240; x += 60) stripes += `M${x},612 L${x + 30},612 L${x + 10},642 L${x - 20},642 Z `;
  E('rect', { x: 0, y: 612, width: 1200, height: 30, fill: '#FFD23F' }, RC);
  E('path', { d: stripes, fill: '#1A1A1A' }, RC);
  const roomSign = lhSign(RC, 'GROUND OPERATIONS', { size: 26 }); tr(roomSign, 1000, 112);
  const insetFrames = G(RC);   // the insets (Dennis and Iggy at work) reuse the room's cast
  [300, 530].forEach(y => E('rect', { x: 50, y: y - 95, width: 200, height: 190, rx: 18, fill: '#1A070C', stroke: '#FFFFFF', 'stroke-width': 4 }, insetFrames));
  const nigelBg = cast(RC, 'nigel', { mood: 'neutral' });
  const dennis = cast(RC, 'dennis', { mood: 'deadpan' });
  const iggy = cast(RC, 'iggy', { mood: 'happy' });
  // the chest: the showpiece
  const CH = G(RC), CHin = G(CH);
  const chest = lhChest(CHin);
  const stamp = G(CHin);
  E('rect', { x: -170, y: -42, width: 340, height: 84, rx: 10, fill: 'rgba(255,255,255,0.15)', stroke: '#FF3B4E', 'stroke-width': 8 }, stamp);
  T(stamp, 0, 18, 'NO MUSCLES', { size: 50, weight: 800, anchor: 'middle', fill: '#FF3B4E', ls: 2 });
  const ARR = (x1, y1, x2, y2, col) => arrow(CHin, x1, y1, x2, y2, { color: col, width: 11, head: 30 });
  const diaDown = [ARR(-150, 140, -150, 232, LH.signTx), ARR(150, 140, 150, 232, LH.signTx)];
  const diaUp = [ARR(-150, 250, -150, 160, BLUE), ARR(150, 250, 150, 160, BLUE)];
  const ribOut = [ARR(-250, -30, -306, -96, LH.signTx), ARR(250, -30, 306, -96, LH.signTx)];
  const ribIn = [ARR(-306, -96, -250, -30, BLUE), ARR(306, -96, 250, -30, BLUE)];
  const airDots = [];
  for (let i = 0; i < 5; i++) airDots.push({ el: lhMol(CHin, i % 2 ? 'N2' : 'O2', 11), ph: i / 5 });
  const replay = gndLbl(Lfg, '↺ REPLAY', { size: 30, color: '#FFFFFF', fill: '#C2453A', stroke: '#FFFFFF' });

  /* =================== insets: Dennis and Iggy at work =================== */
  const dInIn = gndLines(Lfg, ['diaphragm', '**contracts**', 'and **flattens**']); tr(dInIn, 268, 270);
  const iInUp = gndLines(Lfg, ['intercostal muscles', '**contract**', 'ribs **up and out**']); tr(iInUp, 268, 500);
  const dInOut = gndLines(Lfg, ['diaphragm', '**relaxes**', 'domes **up**'], { boldFill: BLUE }); tr(dInOut, 268, 270);
  const iInOut = gndLines(Lfg, ['intercostal muscles', '**relax**', 'ribs **down and in**'], { boldFill: BLUE }); tr(iInOut, 268, 500);
  const headIn = gndLbl(Lfg, 'breathing **IN**', { size: 40, boldFill: RED, stroke: RED });
  const headOut = gndLbl(Lfg, 'breathing **OUT**: the reverse', { size: 36, boldFill: BLUE, stroke: BLUE });

  /* =================== vent: breathing = ventilation =================== */
  const vBreath = gndLbl(Lfg, '**breathing**', { size: 50, boldFill: '#FFFFFF', fill: LH.muscle, stroke: '#FFD0D8' });
  const vVent = lhRich(Lfg, 0, 0, '= **ventilation**', { size: 46, anchor: 'middle', fill: '#FFFFFF', boldFill: LH.signTx });
  const vMove = T(Lfg, 0, 0, 'moving air in and out', { size: 34, weight: 700, anchor: 'middle', fill: C.air });
  const vChem = G(Lfg);
  { const tt = testTube(vChem, 30, 92, { level: 0.5, liquid: '#7FD7A0' }); tr(tt, -120, 0, 1, 12); const x = cross(vChem, 30); tr(x, -120, 0); T(vChem, -80, 12, 'no chemistry', { size: 34, weight: 700, fill: '#FFFFFF' }); }
  const vMus = gndLbl(Lfg, 'only **muscles**', { size: 36, boldFill: RED, stroke: RED });
  /* sponges */
  const spChip = gndLbl(Lfg, 'two big pink **sponges**', { size: 34, boldFill: LH.lung, stroke: LH.lung });
  const spLov = G(Lfg); { T(spLov, 0, 12, 'Lovely.', { size: 34, weight: 700, anchor: 'middle' }); const k = tick(spLov, 14); tr(k, 82, 0); }
  const spUse = G(Lfg); { T(spUse, 0, 12, 'Useless.', { size: 34, weight: 700, anchor: 'middle' }); const k = cross(spUse, 12); tr(k, 90, 0); }
  /* iggy */
  const igChip = gndLbl(Lfg, '**intercostal muscles**', { size: 40, boldFill: RED, stroke: RED });
  const igNote = T(Lfg, 0, 0, 'they live between the ribs', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* =================== the pressure rule =================== */
  const RULE = G(Lmid);
  E('rect', { x: 50, y: 130, width: 1100, height: 590, rx: 24, fill: '#140A10', stroke: '#6E3A4E', 'stroke-width': 4 }, RULE);
  const ruleT = lhRich(RULE, 600, 206, 'gas moves from **high pressure** → **low pressure**', { size: 42, anchor: 'middle', fill: '#FFFFFF', boldFill: LH.signTx });
  const BOX = [[120, 270, 360, 300], [720, 270, 360, 300]];
  BOX.forEach(([x, y, w, h]) => E('rect', { x, y, width: w, height: h, rx: 18, fill: '#22303C', stroke: '#9FB4C6', 'stroke-width': 6 }, RULE));
  E('rect', { x: 474, y: 392, width: 252, height: 56, fill: '#22303C' }, RULE);
  E('path', { d: 'M474,392 L726,392 M474,448 L726,448', stroke: '#9FB4C6', 'stroke-width': 6 }, RULE);
  E('rect', { x: 476, y: 395, width: 8, height: 50, fill: '#22303C' }, RULE); E('rect', { x: 716, y: 395, width: 8, height: 50, fill: '#22303C' }, RULE);
  const ruleArr = arrow(RULE, 530, 350, 670, 350, { color: LH.signTx, width: 8 });
  const rr = rng(208), parts = [];
  for (let i = 0; i < 26; i++) parts.push({ box: 0, x: 0.06 + 0.88 * rr(), y: 0.06 + 0.88 * rr(), a: rr() * 9, b: rr() * 9 });
  for (let i = 0; i < 5; i++) parts.push({ box: 1, x: 0.1 + 0.8 * rr(), y: 0.1 + 0.8 * rr(), a: rr() * 9, b: rr() * 9 });
  const partPath = E('path', { d: '', fill: C.air, stroke: '#2C6A8E', 'stroke-width': 2 }, RULE);
  const flowDots = [];
  for (let i = 0; i < 4; i++) flowDots.push({ el: E('circle', { r: 10, fill: C.air, stroke: '#2C6A8E', 'stroke-width': 2 }, RULE), ph: i / 4 });
  const hiL = lhRich(RULE, 300, 628, '**HIGH** pressure', { size: 40, anchor: 'middle', fill: '#FFFFFF', boldFill: RED });
  const hiN = T(RULE, 300, 672, '(crowded)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const loL = lhRich(RULE, 900, 628, '**LOW** pressure', { size: 40, anchor: 'middle', fill: '#FFFFFF', boldFill: BLUE });
  const loN = T(RULE, 900, 672, '(spread out)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* =================== the chains (volume, pressure, air) =================== */
  const chainCol = (parent, rows, col) => {
    const g = G(parent), items = [];
    rows.forEach((r, i) => {
      const c = gndLbl(g, r, { size: 40, boldFill: col, stroke: col }); tr(c, 0, i * 120);
      items.push(c);
      if (i < rows.length - 1) { const a = arrow(g, 0, i * 120 + 34, 0, i * 120 + 86, { color: col, width: 6, head: 20 }); items.push(a); }
    });
    g.items = items; return g;
  };
  const chainIn = chainCol(Lfg, ['volume **↑**', 'pressure **↓**', 'air pushed **IN**'], RED);
  const chainOut = chainCol(Lfg, ['volume **↓**', 'pressure **↑**', 'air pushed **OUT**'], BLUE);
  const lowNote = T(Lfg, 0, 0, '(lower than the air outside)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const highNote = T(Lfg, 0, 0, '(higher than the air outside)', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  // the summary board
  const CHAIN = G(Lmid);
  E('rect', { x: 290, y: 120, width: 860, height: 600, rx: 24, fill: '#140A10', stroke: '#6E3A4E', 'stroke-width': 4 }, CHAIN);
  E('path', { d: 'M705,150 L705,690', stroke: '#6E3A4E', 'stroke-width': 4 }, CHAIN);
  const cHeadIn = gndLbl(CHAIN, 'breathing **IN**', { size: 40, boldFill: RED, stroke: RED }); tr(cHeadIn, 500, 180);
  const cHeadOut = gndLbl(CHAIN, 'breathing **OUT**', { size: 40, boldFill: BLUE, stroke: BLUE }); tr(cHeadOut, 915, 180);

  /* =================== the foam hand =================== */
  const hand = G(Lfg);
  E('path', { d: 'M-10,150 L-92,226', stroke: '#8A5A3A', 'stroke-width': 16, 'stroke-linecap': 'round' }, hand);
  E('path', { d: 'M-110,-40 L-110,-170 Q-110,-196 -86,-196 Q-62,-196 -62,-170 L-62,-60 L-50,-60 L-50,-206 Q-50,-232 -24,-232 Q2,-232 2,-206 L2,-60 L12,-60 L12,-196 Q12,-222 38,-222 Q64,-222 64,-196 L64,-60 L74,-60 L74,-168 Q74,-192 98,-192 Q122,-192 122,-168 L122,40 Q122,150 6,156 Q-90,154 -126,90 L-196,-24 Q-210,-48 -186,-60 Q-164,-70 -146,-46 L-110,0 Z', fill: '#FF6FB0', stroke: INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hand);
  E('rect', { x: -92, y: -30, width: 196, height: 150, rx: 18, fill: '#FFE9F3', opacity: 0.95 }, hand);
  const hIn = T(hand, 6, 30, 'IN =', { size: 46, weight: 800, anchor: 'middle', fill: '#1E3A8A' });
  const hCon = T(hand, 6, 92, 'CONTRACT', { size: 38, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const hUnder = E('path', { d: 'M-80,104 Q6,116 94,102', fill: 'none', stroke: '#C2453A', 'stroke-width': 5, 'stroke-linecap': 'round' }, hand);
  const notRelax = G(Lfg);
  { const c = gndLbl(notRelax, 'NOT relax', { size: 36, color: '#FFFFFF', stroke: C.bad }); const x = cross(notRelax, 14); tr(x, c.w / 2 + 30, 0); }

  /* =================== KAVYA (curious) =================== */
  const KAV = G(Lbg), KAVcam = G(KAV);
  const living = lhLiving(KAVcam);
  const kavG = G(KAVcam);
  const kav = cast(kavG, 'kavya', { mood: 'neutral' });
  const snackG = G(KAVcam);
  const snack = lhSnack(snackG, 0.7); tr(snack, 0, 0, 0.7, -14);
  E('circle', { cx: 4, cy: 30, r: 22, fill: '#B9784E', stroke: INK, 'stroke-width': 4 }, snackG);
  const qChip = gndLbl(KAV, 'lungs **suck**?', { size: 36, color: '#FFFFFF', boldFill: LH.signTx, stroke: LH.signTx });

  /* =================== CONFESSIONALS (Dennis) =================== */
  const CF = G(Lbg), CFcam = G(CF);
  const conf = lhConf(CFcam, 'dennis');
  const dC = cast(CFcam, 'dennis', { mood: 'deadpan' });
  const ahh = T(CFcam, 640, 330, 'ahh…', { size: 40, weight: 600, fill: '#FFD0D8', font: FB });
  const bliss = G(CFcam);   // eyes closed, blissful (over Dennis's eyes, at s 1.5)
  [376, 484].forEach(x => { E('circle', { cx: x, cy: 398, r: 37, fill: LH.muscle }, bliss); E('path', { d: `M${x - 24},394 Q${x},${414} ${x + 24},394`, fill: 'none', stroke: INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, bliss); });
  const CFfg = G(Lfg);
  // card 1: Iggy's gym plan
  const k1 = G(CFfg);
  card(k1, 700, 118, 440, 470, { fill: 'rgba(14,8,12,0.92)', stroke: '#7A3420', sw: 3 });
  T(k1, 920, 168, "IGGY'S GYM PLAN", { size: 32, weight: 800, anchor: 'middle', fill: LH.signTx, ls: 2 });
  const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const dayRows = DAYS.map((d, i) => {
    const g = G(k1), y = 222 + i * 52;
    E('rect', { x: 724, y: y - 22, width: 392, height: 44, rx: 8, fill: '#241018' }, g);
    T(g, 744, y + 10, d, { size: 28, weight: 700, fill: C.muted });
    const rd = T(g, 1096, y + 10, 'RIB DAY', { size: 30, weight: 800, anchor: 'end', fill: RED });
    return { g, rd };
  });
  const etym = gndLbl(CFfg, '**inter** = between · **costal** = ribs', { size: 30, boldFill: LH.signTx });
  // card 2: nobody sucks; the room gets bigger
  const k2 = G(CFfg);
  card(k2, 700, 140, 440, 470, { fill: 'rgba(14,8,12,0.92)', stroke: '#6E2630', sw: 3 });
  const nsChip = G(k2);
  { T(nsChip, 0, 12, 'nobody sucks', { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF' }); const x = cross(nsChip, 14); tr(x, 140, 0); }
  const roomOld = E('rect', { x: 0, y: 0, width: 0, height: 0, rx: 14, fill: 'none', stroke: '#9FB4C6', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, k2);
  const roomBox = E('rect', { x: 0, y: 0, width: 0, height: 0, rx: 14, fill: '#22303C', stroke: '#9FB4C6', 'stroke-width': 6 }, k2);
  const roomNeck = E('rect', { x: 896, y: 218, width: 48, height: 0, fill: '#22303C', stroke: '#9FB4C6', 'stroke-width': 6 }, k2);
  const neckGap = E('rect', { x: 899, y: 0, width: 42, height: 12, fill: '#22303C' }, k2);
  const sideArr = [arrow(k2, 0, 0, 0, 0, { color: LH.signTx, width: 6, head: 18 }), arrow(k2, 0, 0, 0, 0, { color: LH.signTx, width: 6, head: 18 })];
  const roomMols = [];
  for (let i = 0; i < 6; i++) roomMols.push({ el: E('circle', { r: 9, fill: C.air, stroke: '#2C6A8E', 'stroke-width': 2 }, k2), ph: i / 6 });
  const bigLbl = T(k2, 920, 538, 'make the room **bigger**', { size: 32, weight: 700, anchor: 'middle', boldFill: LH.signTx });
  const pushLbl = lhRich(k2, 920, 588, 'air outside **pushes in**', { size: 34, anchor: 'middle', fill: '#FFFFFF', boldFill: C.air });
  // card 3: passive
  const k3 = G(CFfg);
  card(k3, 700, 130, 440, 480, { fill: 'rgba(14,8,12,0.92)', stroke: '#2C6A4E', sw: 3 });
  const k3a = T(k3, 920, 186, 'breathing out, at rest:', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const k3b = T(k3, 920, 262, 'passive', { size: 66, weight: 800, anchor: 'middle', fill: GREEN });
  const k3c = T(k3, 920, 306, '(no muscle work needed)', { size: 28, weight: 600, anchor: 'middle', fill: '#FFFFFF' });
  const spring = E('path', { d: '', fill: 'none', stroke: LH.lung, 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, k3);
  const springEnds = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10, 'stroke-linecap': 'round' }, k3);
  const k3d = lhRich(k3, 920, 486, 'stretched lungs **spring back**', { size: 32, anchor: 'middle', fill: '#FFFFFF', boldFill: LH.lung });
  const k3e = gndLbl(k3, '★ his favourite part', { size: 30, color: LH.signTx, stroke: LH.signTx });

  /* ---------- HUD ---------- */
  const ltIggy = scLowerThird(Lhud, ...LH_LOWER.iggy);

  /* ---------- shot list ---------- */
  const SH = [
    ['vent', -1e9], ['room1', at('nomuscle') - 0.08], ['iggy', at('iggy') - 0.08], ['th1', at('thiggy') - 0.08], ['rule', at('rule') - 0.08],
    ['chest', at('in') - 0.08], ['kav', at('suck') - 0.08], ['th2', end('suck') + 0.12], ['chest2', at('out') - 0.08], ['th3', at('passive') - 0.08],
    ['chain', at('chain') - 0.08], ['hand', at('hand') - 0.08],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const ALL_FG = [replay, dInIn, iInUp, dInOut, iInOut, headIn, headOut, vBreath, vVent, vMove, vChem, vMus, spChip, spLov, spUse, igChip, igNote,
    chainIn, chainOut, lowNote, highNote, hand, notRelax, k1, k2, k3, etym, stamp, ...diaDown, ...diaUp, ...ribOut, ...ribIn, ...airDots.map(a => a.el)];

  return t => {
    const sid = shotAt(t)[0];
    const isConf = sid === 'th1' || sid === 'th2' || sid === 'th3';
    const roomOn = !isConf && sid !== 'kav';
    op(ROOM, roomOn ? 1 : 0); op(KAV, sid === 'kav' ? 1 : 0); op(CF, isConf ? 1 : 0);
    op(RULE, sid === 'rule' ? 1 : 0); op(CHAIN, sid === 'chain' ? 1 : 0);
    ALL_FG.forEach(e => op(e, 0));
    const rest = wave(t, 4);   // the resting rhythm: one breath every 4 s
    const restFlow = Math.sin(TAU * t / 4);

    /* ---------- the control room: who is where ---------- */
    if (roomOn) {
      gndCam(RC, 1, 600, 400);
      const beat = 0.5 + 0.5 * Math.sin(t * 5 * AMP);
      op(beamG, 0.25 + 0.5 * beat); beacons.forEach(b => attr(b, 'fill', beat > 0.5 ? '#FFB060' : '#C25516'));
      // Nigel drifts along the back of the room, every so often
      const nf = ((t + 6) % 30) / 30;
      tr(nigelBg, lerp(1260, -60, nf), 588, 0.4); nigelBg.set({ t, mood: 'neutral', look: 0 });
      op(nigelBg, sid === 'vent' || sid === 'room1' || sid === 'iggy' || sid === 'hand' ? 1 : 0);
      const chestOn = sid === 'vent' || sid === 'room1' || sid === 'chest' || sid === 'chest2';
      op(CH, chestOn ? 1 : 0);
      op(dennis, sid === 'room1' || sid === 'iggy' || sid === 'hand' || sid === 'chain' ? 1 : 0);
      op(iggy, sid === 'iggy' || sid === 'hand' ? 1 : 0);
      op(insetFrames, 0);
      const insets = () => { op(insetFrames, 1); op(dennis, 1); op(iggy, 1); tr(dennis, 150, 322, 0.56); tr(iggy, 150, 540, 0.48); };
      const dIn = { c: dennis }, iIn = { c: iggy };
      op(roomSign, sid === 'chain' || sid === 'rule' || sid === 'hand' ? 0 : 1);
      tr(CH, 820, 440, 0.85); CHin.setAttribute('transform', '');
      let b = 0.15 + 0.6 * rest * AMP, flow = restFlow;

      if (sid === 'vent') {
        const f = x => mid('vent', x);
        gndShow(vBreath, t, f(0.04), undefined, 300, 290);
        gndFade(vVent, t, f(0.18)); tr(vVent, 300, 384);
        gndFade(vMove, t, f(0.42)); tr(vMove, 300, 450);
        gndShow(vChem, t, f(0.66), undefined, 330, 548);
        gndShow(vMus, t, f(0.86), undefined, 300, 646);
      }
      if (sid === 'room1') {
        let k = 1;
        tr(dennis, 250, 510, 1);
        let look = t < mid('nomuscle', 0.75) ? 0.85 : 0, mood = 'deadpan';
        if (t >= at('sponges')) look = t < mid('sponges', 0.3) ? 0.8 : 0;
        dennis.set({ t, talk: scTalk(S, t, 'dennis'), mood, look, flat: 0.55 * rest * AMP });
        gndShow(stamp, t, mid('nomuscle', 0.3), undefined, 0, 10, 1, -10);
        if (t >= at('sponges') - 0.1) {
          // the lungs squish like sponges
          const sq = Math.sin((t - at('sponges')) * 10) * 0.07 * (1 - P(t, mid('sponges', 0.2), 1.2, linear)) * AMP;
          CHin.setAttribute('transform', `scale(${(1 + sq).toFixed(3)} ${(1 - sq).toFixed(3)})`);
          gndShow(spChip, t, mid('sponges', 0.15), undefined, 300, 300);
          gndShow(spLov, t, mid('sponges', 0.55), undefined, 190, 214);
          gndShow(spUse, t, mid('sponges', 0.8), undefined, 420, 214);
          k = 1 + 0.06 * P(t, end('sponges'), 0.7, ease);
        }
        gndCam(RC, k, 250, 470);
      }
      if (sid === 'iggy') {
        tr(dennis, 280, 470, 1);
        dennis.set({ t, talk: 0, mood: 'deadpan', look: 0.95, flat: 0.55 * rest * AMP });
        const t0 = at('iggy') - 0.15, p = P(t, t0, 0.5, easeOut);
        const hop = t - t0 < 0.8 ? Math.abs(Math.sin((t - t0) * 9)) * 40 * (1 - clamp((t - t0) / 0.8)) : 0;
        tr(iggy, lerp(1380, 860, p), 512 - hop, 1);
        iggy.set({ t, talk: scTalk(S, t, 'iggy'), mood: 'happy', look: -0.3, lift: 0.4 + 0.6 * wave(t, 0.8) * AMP });
        // the door bursts: a short camera shake
        const sh = t > t0 + 0.4 && t < t0 + 0.8 ? Math.sin(t * 70) * 8 * AMP * (1 - (t - t0 - 0.4) / 0.4) : 0;
        RC.setAttribute('transform', `translate(${sh.toFixed(1)} 0)`);
        gndShow(igChip, t, mid('iggy', 0.45), undefined, 860, 262);
        gndFade(igNote, t, mid('iggy', 0.78)); tr(igNote, 860, 334);
      }
      ltIggy.set(sid === 'iggy' ? win(t, at('iggy') + 0.4, at('iggy') + 3.7, 0.3) : 0);

      /* ---------- the showpiece: breathing in ---------- */
      if (sid === 'chest') {
        const inL = t < at('volume') - 0.08;
        if (inL) {
          gndShow(headIn, t, at('in') - 0.05, undefined, 300, 150);
          insets();
          const upL = t >= at('up') - 0.08;
          // in: one breath in, led by Dennis; up: a replay, led by Iggy
          if (!upL) b = P(t, mid('in', 0.15), (end('in') - at('in')) * 0.7, ease);
          else b = t < mid('up', 0.22) ? lerp(1, 0.1, P(t, at('up') - 0.08, 0.5, ease)) : lerp(0.1, 1, P(t, mid('up', 0.3), (end('up') - at('up')) * 0.55, ease));
          flow = !upL ? (b < 0.98 && t > mid('in', 0.15) ? 1 : 0) : (t > mid('up', 0.3) && b < 0.98 ? 1 : 0);
          const dFlat = !upL ? b : 1, iLift = !upL ? b * 0.3 : b;
          dIn.c.set({ t, talk: scTalk(S, t, 'dennis'), mood: 'deadpan', look: 0.4, flat: dFlat });
          iIn.c.set({ t, talk: scTalk(S, t, 'iggy'), mood: upL ? 'happy' : 'neutral', look: 0.4, lift: iLift });
          if (!upL) {
            gndFade(dInIn.rows[0], t, mid('in', 0.05)); gndFade(dInIn.rows[1], t, mid('in', 0.28)); gndFade(dInIn.rows[2], t, mid('in', 0.55));
            op(dInIn, 1);
            diaDown.forEach(a => gndFade(a, t, mid('in', 0.55)));
          } else {
            op(dInIn, 0.45); dInIn.rows.forEach(r => op(r, 1));
            gndFade(iInUp.rows[0], t, mid('up', 0.05)); gndFade(iInUp.rows[1], t, mid('up', 0.12)); gndFade(iInUp.rows[2], t, mid('up', 0.38));
            op(iInUp, 1);
            ribOut.forEach(a => gndFade(a, t, mid('up', 0.38)));
            gndShow(replay, t, at('up') - 0.05, mid('up', 0.3), 1060, 190);
          }
        } else {
          // volume, rush: the chain builds
          b = P(t, at('volume') - 0.08, 2.2, ease);
          flow = t >= mid('rush', 0.5) ? 1 : 0;
          op(chainIn, 1);
          const f = [mid('volume', 0.3), mid('volume', 0.55), mid('volume', 0.8), mid('rush', 0.62), mid('rush', 0.7)];
          chainIn.items.forEach((it, i) => gndFade(it, t, f[i]));
          tr(chainIn, 300, 260);
          gndFade(lowNote, t, mid('rush', 0.3)); tr(lowNote, 300, 600);
          if (flow) airDots.forEach(a => { const q = ((t * 0.7) + a.ph) % 1; op(a.el, q < 0.85 ? 1 : (1 - q) / 0.15); tr(a.el, 6 * Math.sin(q * 9 + a.ph * 5), lerp(-400, -150, q)); });
        }
      }

      /* ---------- breathing out ---------- */
      if (sid === 'chest2') {
        const outL = t < at('outvol') - 0.08;
        b = 1 - P(t, mid('out', 0.3), (end('out') - at('out')) * 0.6, ease);
        flow = b > 0.02 && t > mid('out', 0.3) ? -1 : 0;
        if (!outL) { b = 0; flow = t > mid('outvol', 0.7) ? -1 : 0; }
        if (outL) {
          gndShow(headOut, t, at('out') - 0.05, undefined, 300, 150);
          insets();
          dIn.c.set({ t, talk: 0, mood: t > mid('out', 0.55) ? 'happy' : 'deadpan', look: 0.4, flat: b });
          iIn.c.set({ t, talk: 0, mood: 'neutral', look: 0.4, lift: b });
          op(dInOut, 1); op(iInOut, 1);
          gndFade(iInOut.rows[0], t, mid('out', 0.3)); gndFade(iInOut.rows[1], t, mid('out', 0.3));
          gndFade(dInOut.rows[0], t, mid('out', 0.3)); gndFade(dInOut.rows[1], t, mid('out', 0.3));
          gndFade(dInOut.rows[2], t, mid('out', 0.55)); gndFade(iInOut.rows[2], t, mid('out', 0.8));
          diaUp.forEach(a => gndFade(a, t, mid('out', 0.55)));
          ribIn.forEach(a => gndFade(a, t, mid('out', 0.8)));
        } else {
          op(chainOut, 1);
          const f = [mid('outvol', 0.12), mid('outvol', 0.3), mid('outvol', 0.45), mid('outvol', 0.62), mid('outvol', 0.75)];
          chainOut.items.forEach((it, i) => gndFade(it, t, f[i]));
          tr(chainOut, 300, 260);
          gndFade(highNote, t, mid('outvol', 0.5)); tr(highNote, 300, 600);
        }
        if (flow < 0) airDots.forEach(a => { const q = ((t * 0.7) + a.ph) % 1; op(a.el, q < 0.85 ? 1 : (1 - q) / 0.15); tr(a.el, 6 * Math.sin(q * 9 + a.ph * 5), lerp(-150, -400, q)); });
      }
      if (sid === 'vent' || sid === 'room1') { /* resting rhythm, set above */ }
      chest.set(b, flow);

      /* ---------- the pressure rule ---------- */
      if (sid === 'rule') {
        const f = x => mid('rule', x);
        op(ruleT, P(t, f(0.2), 0.3, linear));
        op(hiL, P(t, f(0.5), 0.3, linear)); op(hiN, P(t, f(0.5), 0.3, linear));
        op(loL, P(t, f(0.78), 0.3, linear)); op(loN, P(t, f(0.78), 0.3, linear));
        const flowOn = P(t, f(0.62), 0.4, linear);
        op(ruleArr, flowOn); ruleArr.set(P(t, f(0.62), 0.6, ease));
        let pd = '';
        parts.forEach(p => {
          const [x, y, w, h] = BOX[p.box];
          const jx = 0.04 * Math.sin(t * 3.1 * AMP + p.a), jy = 0.04 * Math.sin(t * 2.7 * AMP + p.b);
          const cx = x + w * clamp(p.x + jx, 0.05, 0.95), cy = y + h * clamp(p.y + jy, 0.05, 0.95);
          pd += `M${(cx - 10).toFixed(1)},${cy.toFixed(1)} a10,10 0 1 0 20,0 a10,10 0 1 0 -20,0 `;
        });
        attr(partPath, 'd', pd);
        flowDots.forEach(d => {
          const q = ((t - f(0.62)) * 0.45 + d.ph) % 1;
          op(d.el, t > f(0.62) ? flowOn * (q < 0.85 ? 1 : (1 - q) / 0.15) : 0);
          attr(d.el, 'cx', lerp(440, 820, q)); attr(d.el, 'cy', 420 + 8 * Math.sin(q * 12));
        });
      }

      /* ---------- the chains, side by side ---------- */
      if (sid === 'chain') {
        tr(dennis, 150, 560, 0.75);
        dennis.set({ t, talk: scTalk(S, t, 'dennis'), mood: 'deadpan', look: 0.6, flat: 0.55 * rest * AMP });
        const fi = [0.1, 0.17, 0.22, 0.29, 0.35], fo = [0.55, 0.62, 0.68, 0.76, 0.82];
        op(chainIn, 1); op(chainOut, 1); tr(chainIn, 500, 300); tr(chainOut, 915, 300);
        chainIn.items.forEach((it, i) => gndFade(it, t, mid('chain', fi[i])));
        chainOut.items.forEach((it, i) => gndFade(it, t, mid('chain', fo[i])));
        gndFade(cHeadIn, t, mid('chain', 0.05)); gndFade(cHeadOut, t, mid('chain', 0.5));
      }

      /* ---------- Iggy's foam hand ---------- */
      if (sid === 'hand') {
        const nod = t > mid('hand', 0.9) ? 10 * Math.sin(clamp((t - mid('hand', 0.9)) / 0.5) * Math.PI) : 0;
        tr(dennis, 250, 510 + nod, 1);
        dennis.set({ t, talk: 0, mood: 'deadpan', look: 0.9, flat: 0.55 * rest * AMP });
        tr(iggy, 700, 512, 1);
        iggy.set({ t, talk: scTalk(S, t, 'iggy'), mood: 'happy', look: 0.5, lift: 0.5 + 0.5 * wave(t, 1.2) * AMP });
        const wig = t > mid('hand', 0.8) ? 5 * Math.sin((t - mid('hand', 0.8)) * 14) * (1 - P(t, mid('hand', 0.8), 1.2, linear)) * AMP : 0;
        gndShow(hand, t, at('hand') - 0.05, undefined, 930, 270, 0.8, wig);
        op(hIn, P(t, mid('hand', 0.1), 0.2, linear));
        op(hCon, P(t, mid('hand', 0.28), 0.25, linear)); op(hUnder, P(t, mid('hand', 0.5), 0.25, linear));
        gndShow(notRelax, t, mid('hand', 0.45), undefined, 520, 250);
      }
    } else ltIggy.set(0);

    /* ---------- Kavya: so my lungs suck the air in? ---------- */
    if (sid === 'kav') {
      living.upd(t);
      gndCam(KAVcam, 1 + 0.03 * P(t, at('suck'), 2, linear), 600, 420);
      tr(kav, 600, 430, 1.35);
      kavG.setAttribute('transform', `rotate(${(-6 * P(t, mid('suck', 0.5), 0.5, ease)).toFixed(2)} 600 520)`);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: 'neutral', look: 0.3 });
      tr(snackG, 720, 500, 1, -4);
      gndShow(qChip, t, mid('suck', 0.6), undefined, 960, 320);
    }

    /* ---------- confessionals ---------- */
    if (isConf) {
      conf.set(1, t);
      let k = 1, mood = 'deadpan', look = 0, flat = 0.55 * rest * AMP;
      op(ahh, 0); op(bliss, 0);
      if (sid === 'th1') {
        op(k1, 1);
        k = 1 + 0.06 * P(t, end('thiggy'), 0.9, ease);
        gndShow(etym, t, mid('thiggy', 0.18), undefined, 920, 650);
        dayRows.forEach((r, i) => { const t0 = mid('thiggy', 0.5 + i * 0.06); op(r.g, 1); op(r.rd, t >= t0 ? 1 : 0); r.rd.setAttribute('transform', t >= t0 ? `translate(1096 ${232 + i * 52}) scale(${(0.7 + 0.3 * P(t, t0, 0.3, pop)).toFixed(3)}) translate(-1096 ${-(232 + i * 52)})` : ''); });
        look = t > mid('thiggy', 0.45) && t < mid('thiggy', 0.9) ? 0.85 : 0;
      } else if (sid === 'th2') {
        // the silence after "suck": a slow push-in on Dennis, then he explains
        k = 1 + 0.07 * P(t, SH[7][1], at('nobody') - SH[7][1] + 0.5, ease);
        if (t >= at('nobody') - 0.05) {
          op(k2, 1);
          const f = x => mid('nobody', x);
          gndShow(nsChip, t, f(0.05), undefined, 900, 182);
          const e = P(t, f(0.32), 1.1, ease);
          const w = lerp(170, 290, e), h = lerp(150, 190, e), cx = 920, top = 300;
          attr(roomOld, 'x', cx - 85); attr(roomOld, 'y', top); attr(roomOld, 'width', 170); attr(roomOld, 'height', 150);
          op(roomOld, e > 0.05 ? 1 : 0);
          attr(roomBox, 'x', cx - w / 2); attr(roomBox, 'y', top); attr(roomBox, 'width', w); attr(roomBox, 'height', h);
          attr(roomNeck, 'y', 242); attr(roomNeck, 'height', 62); attr(neckGap, 'y', 296);
          [-1, 1].forEach((sd, i) => { const a = sideArr[i]; op(a, t > f(0.32) && t < f(0.75) ? 1 : 0); a.setAttribute('transform', `translate(${(cx + sd * (w / 2 + 6)).toFixed(1)} ${top + h / 2}) scale(${sd} 1)`); });
          gndFade(bigLbl, t, f(0.38));
          const mf = t > f(0.62);
          roomMols.forEach(m => {
            const q = ((t - f(0.62)) * 0.5 + m.ph) % 1;
            op(m.el, mf ? (q < 0.85 ? 1 : (1 - q) / 0.15) : 0);
            const [x, y] = q < 0.4 ? [lerp(820 + m.ph * 200, 920, q / 0.4), 228 + 10 * m.ph] : [920 + 30 * Math.sin(m.ph * 9), lerp(242, top + h - 30, (q - 0.4) / 0.6)];
            attr(m.el, 'cx', x); attr(m.el, 'cy', y);
          });
          gndFade(pushLbl, t, f(0.7));
          look = t < f(0.85) ? 0.7 : 0;
        }
      } else {
        const relax = t >= at('relax') - 0.05;
        if (!relax) {
          op(k3, 1);
          const f = x => mid('passive', x);
          gndFade(k3a, t, f(0.02)); gndFade(k3b, t, f(0.22)); gndFade(k3c, t, f(0.3));
          gndFade(k3d, t, f(0.55)); gndShow(k3e, t, f(0.82), undefined, 920, 564);
          // the spring: stretched, then it springs back on "spring back"
          const sp = t < f(0.55) ? 1 : Math.exp(-(t - f(0.55)) * 3) * Math.cos((t - f(0.55)) * 14);
          const len = 160 + 110 * sp, x0 = 920 - len / 2;
          let d = `M${x0},400`;
          for (let i = 0; i < 10; i++) d += ` L${(x0 + (i + 0.5) * len / 10).toFixed(1)},${i % 2 ? 424 : 376}`;
          d += ` L${(x0 + len).toFixed(1)},400`;
          attr(spring, 'd', d); attr(springEnds, 'd', `M${x0},372 L${x0},428 M${(x0 + len).toFixed(1)},372 L${(x0 + len).toFixed(1)},428`);
          look = t > f(0.2) && t < f(0.75) ? 0.8 : 0;
          mood = t > f(0.8) ? 'happy' : 'deadpan';
          flat = 0.55 * rest * AMP * (t > f(0.8) ? 0.3 : 1);
          k = 1 + 0.03 * P(t, end('passive'), 0.6, ease);
        } else {
          mood = 'happy'; flat = 0;
          k = 1.03 + 0.07 * P(t, at('relax'), end('relax') + 0.9 - at('relax'), ease);
          op(bliss, 1);
          op(ahh, P(t, mid('relax', 0.45), 0.4, linear)); tr(ahh, 0, -8 * P(t, mid('relax', 0.45), 1.6, linear));
        }
      }
      gndCam(CFcam, k, 430, 400);
      tr(dC, 430, 410, 1.5);
      dC.set({ t, talk: scTalk(S, t, 'dennis'), mood, look, flat, still: sid === 'th3' && t >= at('relax') });
    }
  };
});

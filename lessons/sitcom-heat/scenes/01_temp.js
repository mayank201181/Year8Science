/* Scene 1: Heat is not temperature.
   Shots (hard sitcom cuts): kitchen wide (2:15 PM, freezer open, ice cube on Kavya's neck)
   -> close on Kavya ("the cold going into me": dotted blue "cold?" arrow) -> Cel close ("Nope": the blue
   arrow cracks and falls) -> close on Kavya (Jules zooms out of her neck INTO the ice: fat orange arrow,
   HOT -> COLD ONLY sign) -> kitchen wide (cold isn't a thing; the ice eats Jules' sparks) -> close (the ice
   cube wears a burglar mask) -> Cel close ("Basically. Yes.") -> HEAT / TEMPERATURE chips shuffle, then
   dock with Cel and Jules on two definition cards -> Cel's confessional (two department doors, two
   silhouettes) -> the big liquid-in-glass thermometer (expands, climbs; 0 and 100 °C; stuck on 34)
   -> close on Kavya (thermal equilibrium) -> the puddle ("warm neck water") -> Jules' confessional (the contract). */
scene('temp', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed tmp) ---------- */
  const on = (t, a, b) => t >= a && t < b;
  // place a background so that its point (px, py) lands on the screen at (sx, sy), scaled by k
  const tmpCam = (el, k, px, py, sx, sy) => el.setAttribute('transform', k === 1 && px === sx && py === sy ? '' :
    `translate(${(sx - k * px).toFixed(1)} ${(sy - k * py).toFixed(1)}) scale(${k.toFixed(4)})`);
  const tmpPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.65 + 0.35 * p)), r); };
  // dark pill label
  const tmpChip = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 34, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 3, color: o.color || C.ink, weight: 700 }); };
  // a card of rows; rows: [text, size, fill, boldFill]; centred on its origin
  function tmpCard(parent, w, h, rows, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 20, fill: o.fill || 'rgba(10,27,39,0.93)', stroke: o.stroke || C.line, 'stroke-width': 4 }, g);
    g.rows = rows.map(([txt, size, fill, boldFill], i) => {
      const y = -h / 2 + (o.top || 52) + i * (o.gap || 50);
      return T(g, o.left !== undefined ? -w / 2 + o.left : 0, y, txt, { size, weight: 600, fill: fill || C.ink, boldFill, anchor: o.left !== undefined ? 'start' : 'middle' });
    });
    return g;
  }
  // Jules' road sign "HOT -> COLD ONLY"; origin at the hook (top centre), so a rotation swings it
  function tmpSign(parent) {
    const g = G(parent);
    E('line', { x1: 0, y1: -14, x2: 0, y2: 8, stroke: '#16806C', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -138, y: 6, width: 276, height: 64, rx: 10, fill: '#1F5FBF', stroke: '#FFFFFF', 'stroke-width': 5 }, g);
    T(g, 0, 50, 'HOT → COLD ONLY', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }
  // a dotted, curved arrow (for the misconception: dotted and questionable)
  function tmpDotArrow(parent, x1, y1, x2, y2, bend, col) {
    const g = G(parent);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const cx = mx - dy / L * bend, cy = my + dx / L * bend, ang = Math.atan2(y2 - cy, x2 - cx);
    E('path', { d: `M${x1},${y1} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2 - Math.cos(ang) * 20},${y2 - Math.sin(ang) * 20}`, fill: 'none', stroke: col, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-dasharray': '2 20' }, g);
    E('path', { d: 'M0,0 L-34,-21 L-25,0 L-34,21 Z', fill: col, transform: `translate(${x2} ${y2}) rotate(${(ang * 180 / Math.PI).toFixed(1)})` }, g);
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= KITCHEN (wide, close-ups, graphics) ================= */
  const kitShot = G(Lbg), kitWrap = G(kitShot);
  const kit = bkKitchen(kitWrap);
  const frost = [];
  for (let i = 0; i < 6; i++) frost.push(E('circle', { r: 16 + (i % 3) * 6, fill: '#FFFFFF', opacity: 0.55 }, kitWrap));
  const clock = bkClock(kitWrap); tr(clock, 180, 210); clock.set('2:15');
  const dimK = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#08131C', opacity: 0.8 }, kitShot);

  /* ================= CONFESSIONALS ================= */
  const confCel = bkConfessional(Lbg, 'cel');
  const doorsG = G(Lbg);
  function tmpDoor(cx, l1, l2, col) {
    const g = G(doorsG);
    E('rect', { x: cx - 108, y: 150, width: 216, height: 330, rx: 8, fill: '#1A2A30', stroke: '#C9B48E', 'stroke-width': 6 }, g);
    E('rect', { x: cx - 96, y: 160, width: 192, height: 320, fill: linGrad('#8A6A4A', '#6E5038', true), stroke: INK, 'stroke-width': 3 }, g);
    E('circle', { cx: cx + 70, cy: 340, r: 9, fill: '#FFD27A', stroke: INK, 'stroke-width': 3 }, g);
    E('rect', { x: cx - 104, y: 186, width: 208, height: 92, rx: 8, fill: '#F2F7FA', stroke: col, 'stroke-width': 5 }, g);
    T(g, cx, 224, l1, { size: 26, weight: 800, anchor: 'middle', fill: '#14243A' });
    g.unit = T(g, cx, 264, l2, { size: 30, weight: 800, anchor: 'middle', fill: col });
    return g;
  }
  const doorT = tmpDoor(780, 'TEMPERATURE', '(°C)', '#D32F2F');
  const doorH = tmpDoor(1040, 'HEAT', '(J)', C.heatDk);
  const confJul = bkConfessional(Lbg, 'jules');

  /* ================= THERMOMETER DIAGRAM ================= */
  const diaShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10202C', '#1B3646', true) }, diaShot);
  { let d = ''; for (let x = 0; x <= 1200; x += 60) d += `M${x},0 L${x},750 `; for (let y = 0; y <= 750; y += 60) d += `M0,${y} L1200,${y} `; E('path', { d, stroke: '#FFFFFF', 'stroke-width': 1, opacity: 0.05 }, diaShot); }
  const LV = T_ => 570 - 3.8 * T_;     // y of a temperature on the big thermometer
  const thermo = G(diaShot);
  const bulbGlow = E('circle', { cx: 500, cy: 650, r: 150, fill: glow(C.heat) }, thermo);
  E('rect', { x: 460, y: 120, width: 80, height: 540, rx: 40, fill: '#EAF4FA', stroke: INK, 'stroke-width': 5 }, thermo);
  E('rect', { x: 492, y: 140, width: 16, height: 510, rx: 8, fill: '#F7D9DA' }, thermo);
  const col = E('rect', { x: 492, y: 450, width: 16, height: 200, rx: 8, fill: BK_RED }, thermo);
  E('rect', { x: 472, y: 140, width: 10, height: 440, rx: 5, fill: '#FFFFFF', opacity: 0.8 }, thermo);
  E('circle', { cx: 500, cy: 650, r: 54, fill: ball('#FF7276', BK_REDDK), stroke: INK, 'stroke-width': 5 }, thermo);
  E('ellipse', { cx: 480, cy: 630, rx: 14, ry: 9, fill: '#FFFFFF', opacity: 0.5 }, thermo);
  { let d = ''; for (let k = 0; k <= 10; k++) d += `M540,${LV(k * 10)} L${k % 5 ? 556 : 568},${LV(k * 10)} `; E('path', { d, stroke: '#F2F7FA', 'stroke-width': 4 }, thermo); }
  const warmArr = G(diaShot);
  [600, 650, 700].forEach((y, i) => arrow(warmArr, 720, y + (i - 1) * 6, 590, y - (i - 1) * 10 - 8, { color: C.heat, width: 9 }));
  const warmLbl = T(warmArr, 740, 760 - 50, 'warm', { size: 30, weight: 700, fill: C.heat });
  const upArr = arrow(diaShot, 440, 520, 440, 420, { color: '#FF9A9A', width: 7 });
  const lCap = labelLine(diaShot, 420, 280, 492, 270, 'capillary', { size: 30, anchor: 'end', line: C.muted });
  const lBulb = labelLine(diaShot, 410, 700, 452, 668, 'bulb', { size: 30, anchor: 'end', line: C.muted });
  const cLiq = tmpChip(diaShot, 'liquid-in-glass thermometer', { size: 32 });
  const cExp = tmpCard(diaShot, 470, 140, [['liquid **expands**', 36, C.ink, '#FF8A8A'], ['→ rises up the tube', 36, C.ink]], { top: 56, gap: 54 });
  const fix0 = G(diaShot), fix100 = G(diaShot);
  T(fix0, 600, LV(0) + 12, '**0 °C**: pure water freezes', { size: 34, weight: 600, boldFill: '#9FD8FF' });
  { const ic = G(fix0); tr(ic, 1075, LV(0)); E('rect', { x: -26, y: -26, width: 52, height: 52, rx: 10, fill: '#D7F2FF', stroke: '#7FC7EE', 'stroke-width': 4 }, ic); E('path', { d: 'M-14,-14 L4,-14 M-14,-14 L-14,2', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, ic); }
  T(fix100, 600, LV(100) + 12, '**100 °C**: pure water boils', { size: 34, weight: 600, boldFill: '#FF9A8F' });
  const steam = heatWaves(fix100, { n: 3, h: 70, spacing: 22, color: '#FFFFFF', width: 5 }); tr(steam, 1090, LV(100) + 30);
  const stuck = G(diaShot);
  E('path', { d: 'M574,0 L610,-22 L610,22 Z', fill: '#FF4D4D' }, stuck);
  T(stuck, 622, 16, '34', { size: 46, weight: 800, fill: '#FF4D4D' });
  const note = G(stuck); tr(note, 790, 6, 1, -6);
  E('rect', { x: -78, y: -54, width: 156, height: 108, fill: '#FFE97A', stroke: '#C9A82A', 'stroke-width': 3 }, note);
  T(note, 0, -2, 'stuck', { size: 36, weight: 800, anchor: 'middle', fill: '#5A4A10' });
  E('path', { d: 'M-16,30 Q0,20 16,30', fill: 'none', stroke: '#5A4A10', 'stroke-width': 4, 'stroke-linecap': 'round' }, note);
  E('circle', { cx: -12, cy: 16, r: 3.5, fill: '#5A4A10' }, note); E('circle', { cx: 12, cy: 16, r: 3.5, fill: '#5A4A10' }, note);

  /* ================= THE CAST ================= */
  const cel = cast(Lcast, 'cel', { mood: 'deadpan' });
  const jules = cast(Lcast, 'jules', { mood: 'happy' });
  // Kavya with her hand holding the ice cube against her neck (Kavya-local coordinates)
  const kavG = G(Lcast);
  const kav = cast(kavG, 'kavya', { mood: 'happy' });
  const ICE = [-44, 58], NECK = [-14, 44];
  const hand = G(kavG);
  E('path', { d: 'M-104,230 L-50,100', stroke: INK, 'stroke-width': 30, 'stroke-linecap': 'round' }, hand);
  E('path', { d: 'M-104,230 L-50,100', stroke: SKIN, 'stroke-width': 23, 'stroke-linecap': 'round' }, hand);
  E('ellipse', { cx: -44, cy: 92, rx: 30, ry: 16, fill: SKIN, stroke: INK, 'stroke-width': 3 }, hand);
  const iceG = G(kavG); tr(iceG, ICE[0], ICE[1]);
  const ice = bkIceCube(iceG, 0.5);
  const maskG = G(iceG);   // burglar mask, follows the cube as it melts
  const mask = G(maskG); tr(mask, 0, 0, 0.5);
  E('rect', { x: -48, y: -24, width: 96, height: 30, rx: 12, fill: '#1C1C24' }, mask);
  E('path', { d: 'M-48,-12 L-66,-24 M-48,-6 L-68,2', stroke: '#1C1C24', 'stroke-width': 7, 'stroke-linecap': 'round' }, mask);
  [-20, 20].forEach(x => { E('ellipse', { cx: x, cy: -9, rx: 13, ry: 9, fill: '#FFFFFF' }, mask); E('circle', { cx: x - 6, cy: -9, r: 5, fill: INK }, mask); });
  const fingers = G(kavG);
  [[-68, 74], [-70, 60], [-68, 46]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 9, ry: 7.5, fill: SKIN, stroke: INK, 'stroke-width': 2.5 }, fingers));
  E('ellipse', { cx: -18, cy: 80, rx: 7, ry: 10, fill: SKIN, stroke: INK, 'stroke-width': 2.5 }, fingers);   // thumb
  const drips = [0, 1].map(() => E('path', { d: 'M0,-8 Q6,2 0,6 Q-6,2 0,-8 Z', fill: '#9FD8FF', stroke: '#5AB4E0', 'stroke-width': 1.5 }, kavG));
  // eyes shut in bliss (covers the eyes; bobs with Kavya's face)
  const bliss = G(kavG);
  [-25, 25].forEach(x => {
    E('ellipse', { cx: x, cy: -22, rx: 20, ry: 22, fill: SKIN }, bliss);
    E('path', { d: `M${x - 14},-24 Q${x},-12 ${x + 14},-24`, fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, bliss);
  });
  const KAV_BOB = t => Math.sin(t * TAU * 0.5 + 8) * 2;
  const kp = (k, l) => [k.x + k.s * l[0], k.y + k.s * l[1]];     // Kavya-local point -> screen

  /* ================= LABELS ================= */
  const KC = { x: 720, y: 520, s: 2.1 };           // close on Kavya
  const KW = { x: 800, y: 560, s: 1.35 };          // kitchen wide
  const nC = kp(KC, NECK), iC = kp(KC, ICE);
  // a magnifier inset at the ice/neck contact: where does the energy go?
  const lens = G(Lfg); tr(lens, 330, 400);
  const lensClip = E('clipPath', { id: 'tmplens' }, defs()); E('circle', { r: 150 }, lensClip);
  const lensIn = G(lens, { 'clip-path': 'url(#tmplens)' });
  E('rect', { x: -150, y: -150, width: 150, height: 300, fill: '#CFEFFF' }, lensIn);
  E('path', { d: 'M-120,-110 L-60,-110 M-120,-90 L-100,-90 M-110,80 L-60,80', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round' }, lensIn);
  E('rect', { x: 0, y: -150, width: 150, height: 300, fill: '#C98A5E' }, lensIn);
  E('line', { x1: 0, y1: -150, x2: 0, y2: 150, stroke: INK, 'stroke-width': 4 }, lensIn);
  T(lensIn, -75, -66, 'ice', { size: 30, weight: 800, anchor: 'middle', fill: '#1D84A6' });
  T(lensIn, 75, -66, 'neck', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const lensCold = tmpDotArrow(lensIn, -110, 30, 112, 30, 0, '#2E8BE0');
  const lensHot = arrow(lensIn, 112, 30, -112, 30, { color: C.heat, width: 18 });
  E('circle', { r: 150, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8 }, lens);
  const lensLead = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '8 8' }, Lfg);
  const coldArr = G(Lfg);
  const coldLbl = tmpChip(coldArr, 'cold?', { size: 40, color: '#9FD8FF', stroke: '#5AB4FF' }); tr(coldLbl, 330, 610);
  const coldQ = T(coldArr, 0, 40, '?', { size: 120, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  // the same arrow, cracking in Cel's close-up
  const crack = G(Lfg); tr(crack, 900, 330);
  const crA = G(crack), crB = G(crack);
  E('path', { d: 'M-190,40 Q-120,-30 -10,-40', fill: 'none', stroke: '#5AB4FF', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-dasharray': '2 22' }, crA);
  E('path', { d: 'M-10,-40 Q80,-46 150,0', fill: 'none', stroke: '#5AB4FF', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-dasharray': '2 22' }, crB);
  E('path', { d: 'M180,24 L134,10 L148,-2 L144,-38 Z', fill: '#5AB4FF' }, crB);
  { const c = tmpChip(crA, 'cold?', { size: 40, color: '#9FD8FF', stroke: '#5AB4FF' }); tr(c, -110, 100); }
  const crackLine = E('path', { d: 'M-22,-80 L-4,-56 L-18,-40 L2,-18 L-10,4', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linejoin': 'round' }, crack);
  // thermal energy: hot -> cold (fat, orange, neck -> ice)
  const outCard = tmpCard(Lfg, 420, 130, [['**thermal energy**', 36, C.ink, C.heat], ['hot → cold', 36, C.ink]], { top: 52, gap: 52 });
  const sign = tmpSign(Lfg);
  const sparks = [];
  for (let i = 0; i < 5; i++) { const s = G(Lfg); E('circle', { r: 16, fill: glow(C.heat) }, s); E('circle', { r: 6, fill: '#FFE45C' }, s); sparks.push(s); }
  const thingCard = tmpCard(Lfg, 520, 150, [['cold **≠** a thing', 38, C.ink, '#FF6070'], ['cold = **less thermal energy**', 34, C.ink, C.heat]], { top: 58, gap: 56 });
  const robChip = tmpChip(Lfg, 'suspect: ice cube', { size: 32, color: '#FFE45C' });
  // HEAT / TEMPERATURE
  const cHeat = chip(Lfg, 'HEAT', { size: 56, fill: C.heat, color: '#3A1600', stroke: '#FFFFFF', sw: 4 });
  const cTemp = chip(Lfg, 'TEMPERATURE', { size: 56, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const mixQ = T(Lfg, 600, 520, 'mixed up?', { size: 40, weight: 700, anchor: 'middle', fill: C.muted });
  const tCard = tmpCard(Lfg, 500, 180, [['how **hot** something is', 32, C.ink, '#FF8A8A'], ['measured by a **thermometer**', 32, C.ink, '#FF8A8A'], ['in degrees Celsius, **°C**', 32, C.ink, '#FF8A8A']], { top: 46, gap: 48, left: 26 });
  const hCard = tmpCard(Lfg, 500, 180, [['**thermal energy**', 32, C.ink, C.heat], ['a type of **energy**', 32, C.ink, C.heat], ['measured in joules, **J**', 32, C.ink, C.heat]], { top: 46, gap: 48, left: 26 });
  const neq = T(Lfg, 0, 30, '≠', { size: 96, weight: 800, anchor: 'middle', fill: '#FF6070' });
  // confessional: not even the same shape
  const shapes = G(Lfg); tr(shapes, 910, 600);
  E('rect', { x: -230, y: -80, width: 460, height: 160, rx: 20, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 3 }, shapes);
  { const a = G(shapes); tr(a, -130, 0); E('rect', { x: -14, y: -62, width: 28, height: 92, rx: 14, fill: '#F2F7FA' }, a); E('circle', { cx: 0, cy: 38, r: 26, fill: '#F2F7FA' }, a); }
  { const b = G(shapes); tr(b, 130, 6); E('path', { d: 'M-34,-24 Q-40,-52 -20,-62 Q-16,-44 -6,-42 Q-4,-70 12,-76 Q14,-50 24,-44 Q30,-56 38,-58 Q50,-36 40,-20 Q62,10 36,40 Q0,62 -36,40 Q-60,10 -34,-24 Z', fill: C.heat }, b); }
  T(shapes, 0, 26, '≠', { size: 76, weight: 800, anchor: 'middle', fill: '#FF6070' });
  // equilibrium
  const thL = thermometer(Lfg, 170, '#5AB4FF'), thR = thermometer(Lfg, 170, '#FF4D4D');
  const thLl = tmpChip(Lfg, 'ice water', { size: 30, color: '#9FD8FF' });
  const thRl = tmpChip(Lfg, 'neck', { size: 30, color: '#FFB0A0' });
  const eqArr = G(Lfg); const eqArrIn = arrow(eqArr, nC[0] + 4, nC[1] - 6, iC[0] - 22, iC[1] - 8, { color: C.heat, width: 16, bend: 120 });
  const eqCard = tmpCard(Lfg, 760, 96, [['same temperature = **thermal equilibrium**', 36, C.ink, C.good]], { top: 60 });
  const goneChip = tmpChip(Lfg, 'warm neck water', { size: 36, color: '#9FD8FF' });
  // Jules' contract
  const scroll = G(Lfg); tr(scroll, 880, 330);
  E('rect', { x: -190, y: -160, width: 380, height: 320, fill: '#FFF3D6', stroke: '#B08A4A', 'stroke-width': 4 }, scroll);
  [-160, 160].forEach(y => E('rect', { x: -206, y: y - 16, width: 412, height: 32, rx: 16, fill: '#E9CC92', stroke: '#B08A4A', 'stroke-width': 4 }, scroll));
  T(scroll, 0, -96, 'CONTRACT', { size: 46, weight: 800, anchor: 'middle', fill: '#5A2B07', ls: 3 });
  T(scroll, -140, -20, 'hot → cold', { size: 38, weight: 700, fill: '#5A2B07' });
  T(scroll, -140, 56, 'cold → hot', { size: 38, weight: 700, fill: '#5A2B07' });
  tr(tick(scroll, 22), 120, -32); tr(cross(scroll, 18), 120, 44);
  const sig = T(scroll, 40, 126, 'Jules', { size: 34, weight: 700, anchor: 'middle', fill: C.heatDk });
  sig.setAttribute('font-style', 'italic');
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* ---------- shot list ---------- */
  const SH = [
    ['wide', -1e9], ['close', at('cold') - 0.08], ['celC', at('no') - 0.08], ['close', at('out') - 0.1],
    ['wide', at('thing') - 0.08], ['close', at('rob') - 0.08], ['celC', at('yes') - 0.08], ['graph', at('mix') - 0.1],
    ['conf', at('thdept') - 0.08], ['dia', at('tube') - 0.1], ['close', at('equal') - 0.1], ['jconf', at('thjules') - 0.1],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return [SH[k][0], SH[k][1], k + 1 < SH.length ? SH[k + 1][1] : 1e9]; };
  const ALL_FG = [lens, lensLead, coldArr, crack, outCard, sign, thingCard, robChip, cHeat, cTemp, mixQ, tCard, hCard, neq, shapes, thL, thR, thLl, thRl, eqArr, eqCard, goneChip, scroll];
  const melt = t => t < at('thing') ? 0 : t < at('equal') ? 0.25 * P(t, mid('thing', 0.3), 5, linear) + 0.1 * P(t, at('yes'), 2, linear)
    : 0.35 + 0.5 * P(t, mid('equal', 0.1), end('equal') - mid('equal', 0.1), linear) + 0.15 * P(t, at('gone') - 0.3, 0.6, linear);

  return t => {
    op(blackout, 1 - P(t, at('ice') - 0.3, 0.4, linear));
    const [sid, s0] = shotAt(t);
    const shots = { kit: 0, conf: 0, jconf: 0, dia: 0 };
    ALL_FG.forEach(e => op(e, 0));
    sparks.forEach(s => op(s, 0));
    let celP = null, julP = null, kavP = null;
    const talk = who => scTalk(S, t, who);
    const m = melt(t);
    ice.set(m); tr(maskG, 0, 22.5 * m, Math.max(0.01, 1 - 0.92 * m));
    op(maskG, 0); op(bliss, 0); drips.forEach(d => op(d, 0));
    kit.freezer(P(t, at('ice') + 0.1, 0.6));
    frost.forEach((f, i) => {
      const u = ((t * 0.28 * AMP + i / 6) % 1);
      tr(f, 1000 - u * 260 + 20 * Math.sin(t + i), 240 + u * 150 + 16 * Math.sin(t * 1.3 + i * 2), 0.6 + u);
      op(f, Math.sin(u * Math.PI) * 0.7 * P(t, at('ice') + 0.3, 0.8, linear));
    });

    op(clock, sid === 'wide' ? 1 : 0);
    /* ---------- kitchen: wide ---------- */
    if (sid === 'wide') {
      shots.kit = 1; tmpCam(kitWrap, 1, 0, 0, 0, 0); op(dimK, 0);
      celP = { x: 380, y: 252, s: 1, mood: 'deadpan', look: 0.8 };
      const thinking = t >= at('thing');
      kavP = Object.assign({}, KW, { mood: thinking ? 'neutral' : 'happy', look: thinking ? -0.8 : 0, sweat: thinking ? 0 : 0.6 });
      if (thinking) {
        // the ice cube eats Jules' parcels
        const a = kp(KW, NECK), b = kp(KW, ICE);
        sparks.forEach((s, i) => {
          const u = ((t - at('thing')) * 0.55 + i / 5) % 1;
          const cx = a[0] - 90, cy = a[1] - 80;
          tr(s, (1 - u) * (1 - u) * a[0] + 2 * u * (1 - u) * cx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * u * (1 - u) * cy + u * u * b[1], 1.2 - 0.8 * u);
          op(s, Math.min(1, u * 6, (1 - u) * 4));
        });
        const cp = P(t, mid('thing', 0.08), 0.45, pop);
        tmpPop(thingCard, 320, 610, cp);
        op(thingCard.rows[1], P(t, mid('thing', 0.3), 0.4, linear));
        if (t > mid('thing', 0.62)) celP.look = 0.9;
      }
    }

    /* ---------- kitchen: close on Kavya ---------- */
    if (sid === 'close') {
      shots.kit = 1; op(dimK, 0);
      let k = 1.4;
      kavP = Object.assign({}, KC, { mood: 'happy', look: 0, sweat: 0 });
      attr(lensLead, 'x1', 450); attr(lensLead, 'y1', 480); attr(lensLead, 'x2', (nC[0] + iC[0]) / 2 - 8); attr(lensLead, 'y2', (nC[1] + iC[1]) / 2 - 10);
      if (t < at('no')) {                                  // cold: bliss, and a questionable blue arrow
        op(bliss, 1); tr(bliss, 0, KAV_BOB(t));
        const lp = P(t, at('cold') + 0.2, 0.45, pop);
        tmpPop(lens, 330, 400, lp); op(lensLead, clamp(lp * 2)); op(lensHot, 0); op(lensCold, P(t, mid('cold', 0.35), 0.4, linear));
        op(coldArr, 1);
        tmpPop(coldLbl, 330, 610, P(t, mid('cold', 0.45), 0.45, pop));
        const qp = P(t, mid('cold', 0.75), 0.45, pop);
        op(coldQ, clamp(qp * 2.5)); tr(coldQ, 520, 300 + 6 * Math.sin(t * 5) * AMP, 1, -8 * Math.sin(t * 3) * AMP);
        k = 1.4 + 0.05 * P(t, at('cold'), 3, linear);
      } else if (t < at('thing')) {                        // out: Jules leaves the neck, into the ice
        kavP.mood = t < mid('out', 0.2) ? 'shock' : 'neutral'; kavP.look = -0.8;
        const t0 = at('out'), u = P(t, t0, 1.2, linear);
        const a = nC, c = [iC[0], iC[1]], hover = [1010, 300];
        let jx, jy, js;
        if (u < 1) {
          const e = ease(u);
          jx = (1 - e) * (1 - e) * a[0] + 2 * e * (1 - e) * 560 + e * e * c[0];
          jy = (1 - e) * (1 - e) * a[1] + 2 * e * (1 - e) * 420 + e * e * c[1];
          js = 0.08 + 0.4 * Math.sin(Math.PI * clamp(u * 1.1));
        } else {   // pops back out of the ice and parks on the right
          const v = P(t, t0 + 1.2, 0.7);
          jx = lerp(c[0], hover[0], v); jy = lerp(c[1], hover[1], v) - 160 * Math.sin(Math.PI * v); js = lerp(0.1, 0.6, clamp(v * 1.6));
        }
        julP = { x: jx, y: jy + 6 * Math.sin(t * 3) * AMP, s: js, r: u < 1 ? 360 * ease(u) : 0, mood: 'happy', look: 0.6, glow: 0.9 };
        tmpPop(lens, 330, 400, 1); op(lensLead, 1); op(lensCold, 0); op(lensHot, 1);
        lensHot.set(P(t, mid('out', 0.25), 0.6, easeOut));
        tmpPop(outCard, 330, 640, P(t, mid('out', 0.38), 0.45, pop));
        const sp = P(t, mid('out', 0.68), 0.5, pop);
        op(sign, clamp(sp * 3)); tr(sign, hover[0], hover[1] + 80, 1, 50 * (1 - sp) + 8 * Math.sin(t * 2.4) * AMP * sp);
        sparks.forEach((s, i) => {
          const v = ((t - mid('out', 0.35)) * 0.7 + i / 5) % 1;
          if (t < mid('out', 0.35)) return;
          const b = [iC[0] - 10, iC[1]];
          tr(s, lerp(nC[0], b[0], v), lerp(nC[1], b[1], v) - 90 * Math.sin(Math.PI * v), 1.3 - 0.7 * v); op(s, Math.min(1, v * 6, (1 - v) * 4));
        });
      } else if (t < at('equal')) {                        // rob: the ice cube is a burglar
        kavP.mood = 'annoyed'; kavP.look = -0.9;
        op(maskG, P(t, mid('rob', 0.35), 0.25, linear));
        tmpPop(robChip, 330, 500, P(t, mid('rob', 0.5), 0.45, pop));
        k = 1.4 + 0.06 * P(t, at('rob'), 2.5, linear);
        kavP.s = KC.s * (1 + 0.05 * P(t, at('rob'), 2.5, linear));
      } else if (t < at('gone')) {                         // equal: thermal equilibrium
        kavP.mood = 'neutral'; kavP.look = -0.5;
        const ep = P(t, mid('equal', 0.1), end('equal') - mid('equal', 0.1) - 0.3, ease);
        op(thL, 1); op(thR, 1); op(thLl, 1); op(thRl, 1);
        tr(thL, 380, 470); tr(thR, 1040, 470); tr(thLl, 380, 560); tr(thRl, 1040, 560);
        thL.set(lerp(0.05, 0.55, ep)); thR.set(lerp(0.85, 0.55, ep));
        op(eqArr, 1 - P(t, mid('equal', 0.75), 0.4, linear));
        const shrink = 1 - 0.8 * ep, mx = (nC[0] + iC[0]) / 2 - 40, my = (nC[1] + iC[1]) / 2 - 40;
        eqArr.setAttribute('transform', `translate(${mx} ${my}) scale(${Math.max(0.05, shrink).toFixed(3)}) translate(${-mx} ${-my})`);
        sparks.slice(0, 3).forEach((s, i) => {
          if (ep > 0.85) return;
          const v = ((t - at('equal')) * 0.7 + i / 3) % 1;
          tr(s, lerp(nC[0], iC[0], v), lerp(nC[1], iC[1], v) - 90 * Math.sin(Math.PI * v), (1.2 - 0.6 * v) * shrink); op(s, Math.min(1, v * 6, (1 - v) * 4) * (1 - ep));
        });
        tmpPop(eqCard, 600, 160, P(t, mid('equal', 0.45), 0.45, pop));
      } else {                                             // gone: a puddle, deadpan to camera
        kavP.mood = 'deadpan'; kavP.look = 0;
        const push = P(t, at('gone'), end('gone') - at('gone') + 0.6, linear);
        kavP.s = KC.s * (1 + 0.08 * push); kavP.y = KC.y + 30 * push;
        k = 1.4 + 0.08 * push;
        tmpPop(goneChip, 300, 470, P(t, mid('gone', 0.55), 0.45, pop));
        drips.forEach((d, i) => { const u = ((t - at('gone')) * 0.9 + i * 0.5) % 1; op(d, Math.sin(u * Math.PI)); tr(d, -60 + i * 24, 108 + u * 120, 1.3); });
      }
      tmpCam(kitWrap, k, 800, 520, 720, 520);
    }

    /* ---------- kitchen: Cel close ---------- */
    if (sid === 'celC') {
      shots.kit = 1; op(dimK, 0);
      const tA = t < at('out') ? at('no') : at('yes'), tB = t < at('out') ? end('no') + 0.5 : end('yes') + 0.7;
      const push = P(t, tA, tB - tA + 0.2, linear), k = 2 + 0.22 * push;
      tmpCam(kitWrap, k, 380, 252, 560, 360 + 40 * push);
      celP = { x: 560, y: 360 + 40 * push, s: k, mood: 'deadpan', look: 0 };
      if (t < at('out')) {
        op(crack, 1);
        const cp = P(t, mid('no', 0.55), 0.2, linear), fall = clamp((t - mid('no', 0.75)) / 0.9);
        op(crackLine, cp);
        tr(crA, -40 * fall, 620 * fall * fall, 1, -40 * fall);
        tr(crB, 50 * fall, 680 * fall * fall, 1, 55 * fall);
        op(crack, 1 - P(t, mid('no', 0.75) + 0.7, 0.2, linear));
      }
    }

    /* ---------- graphics: HEAT vs TEMPERATURE ---------- */
    if (sid === 'graph') {
      shots.kit = 1; op(dimK, 1); tmpCam(kitWrap, 1.08, 600, 375, 600, 375);
      op(cHeat, 1); op(cTemp, 1);
      // shuffle: three swaps (HEAT starts left)
      let swaps = 0, ph = 0;
      [0.18, 0.42, 0.66].forEach(f => { const p = P(t, mid('mix', f), 0.5); swaps += Math.floor(p); if (p > 0 && p < 1) ph = p; });
      const L = 380, R = 820, heatLeft = swaps % 2 === 0;
      const hx0 = heatLeft ? L : R, hx1 = heatLeft ? R : L;
      let hx = hx0, tx = hx0 === L ? R : L, hy = 330, ty = 330;
      if (ph) { hx = lerp(hx0, hx1, ph); tx = lerp(hx1, hx0, ph); hy = 330 - 90 * Math.sin(Math.PI * ph); ty = 330 + 90 * Math.sin(Math.PI * ph); }
      // dock: TEMPERATURE -> Cel (left), HEAT -> Jules (right)
      const dT = P(t, at('temp') + 0.05, 0.6), dH = P(t, at('heat') + 0.05, 0.6);
      tr(cTemp, lerp(tx, 300, dT), lerp(ty, 450, dT), lerp(1, 0.72, dT), (1 - dT) * 4 * Math.sin(t * 2) * AMP);
      tr(cHeat, lerp(hx, 900, dH), lerp(hy, 450, dH), lerp(1, 0.72, dH), (1 - dH) * -4 * Math.sin(t * 2.3) * AMP);
      op(mixQ, win(t, mid('mix', 0.3), at('temp'), 0.3));
      if (t >= at('temp')) {
        const cp = P(t, at('temp') + 0.1, 0.45, pop);
        celP = { x: 300, y: 262, s: 0.85 * Math.max(0.01, cp), mood: t < at('heat') ? 'neutral' : 'deadpan', look: t >= at('heat') ? 1 : 0 };
        tmpPop(tCard, 300, 600, P(t, mid('temp', 0.15), 0.45, pop));
        op(tCard.rows[0], P(t, mid('temp', 0.25), 0.3, linear)); op(tCard.rows[1], P(t, mid('temp', 0.5), 0.3, linear)); op(tCard.rows[2], P(t, mid('temp', 0.72), 0.3, linear));
      }
      if (t >= at('heat')) {
        const jp = P(t, at('heat') + 0.05, 0.45, pop);
        julP = { x: 900, y: 266, s: 0.75 * Math.max(0.01, jp), mood: 'happy', look: 0, glow: 0.8 };
        tmpPop(hCard, 900, 600, P(t, mid('heat', 0.15), 0.45, pop));
        op(hCard.rows[0], P(t, mid('heat', 0.22), 0.3, linear)); op(hCard.rows[1], P(t, mid('heat', 0.6), 0.3, linear)); op(hCard.rows[2], P(t, mid('heat', 0.72), 0.3, linear));
        const np = P(t, mid('heat', 0.9), 0.45, pop);
        op(neq, clamp(np * 2.5)); tr(neq, 600, 630, Math.max(0.01, np));
      } else if (t >= at('temp')) julP = null;
    }

    /* ---------- Cel's confessional ---------- */
    if (sid === 'conf') {
      shots.conf = 1;
      const push = P(t, at('thdept'), end('thdept') + 0.6 - at('thdept'), linear);
      const ann = t < end('thdept');
      celP = { x: 400, y: 390, s: 1.5 * (1 + 0.06 * push), mood: ann ? 'annoyed' : 'deadpan', look: t > mid('thdept', 0.1) && t < mid('thdept', 0.5) ? 1 : 0 };
      // plates light up as he names them
      tr(doorT, 0, 0); tr(doorH, 0, 0);
      op(doorT.unit, t > mid('thdept', 0.45) ? 1 : 0.5); op(doorH.unit, t > mid('thdept', 0.5) ? 1 : 0.5);
      const hl = (d, f) => { const p = win(t, mid('thdept', f), mid('thdept', f + 0.2), 0.15); d.setAttribute('transform', `translate(${d === doorT ? 780 : 1040} 300) scale(${(1 + 0.04 * p).toFixed(3)}) translate(${d === doorT ? -780 : -1040} -300)`); };
      hl(doorT, 0.08); hl(doorH, 0.28);
      tmpPop(shapes, 910, 610, P(t, mid('thdept', 0.74), 0.45, pop));
    }

    /* ---------- the big thermometer ---------- */
    if (sid === 'dia') {
      shots.dia = 1;
      const isFixed = t >= at('fixed');
      const warm = P(t, mid('tube', 0.3), 1.0, linear);
      const T_ = isFixed ? 34 : lerp(22, 34, P(t, mid('tube', 0.42), 2.2, ease));
      attr(col, 'y', LV(T_)); attr(col, 'height', 660 - LV(T_));
      op(bulbGlow, (isFixed ? 0.35 : warm) * (0.85 + 0.15 * Math.sin(t * 4)));
      op(warmArr, isFixed ? 1 - P(t, at('fixed'), 0.3, linear) : warm);
      op(upArr, isFixed ? 0 : win(t, mid('tube', 0.42), mid('tube', 0.42) + 2.4, 0.3));
      upArr.set(P(t, mid('tube', 0.42), 0.6));
      lCap.set(P(t, mid('tube', 0.62), 0.4, linear)); lBulb.set(P(t, mid('tube', 0.3), 0.4, linear));
      const liqP = P(t, mid('tube', 0.05), 0.45, pop), hideR = P(t, at('fixed') - 0.1, 0.3, linear);
      tmpPop(cLiq, 860, 190, liqP); op(cLiq, clamp(liqP * 2.5) * (1 - hideR));
      tmpPop(cExp, 880, 380, P(t, mid('tube', 0.5), 0.45, pop)); op(cExp, clamp(P(t, mid('tube', 0.5), 0.45, pop) * 2.5) * (1 - hideR));
      op(fix0, P(t, mid('fixed', 0.05), 0.35, linear)); op(fix100, P(t, mid('fixed', 0.33), 0.35, linear));
      steam.upd(t);
      const sp = P(t, mid('fixed', 0.62), 0.45, pop);
      op(stuck, clamp(sp * 2.5)); tr(stuck, 0, LV(34));
      tr(note, 790, 6, Math.max(0.01, 0.6 + 0.4 * sp), -6 + (t > end('fixed') ? 4 * P(t, end('fixed'), 0.4) : 0));
      const sad = t > mid('fixed', 0.7);
      celP = { x: 220, y: 520, s: 0.95 * (1 + (sad ? 0.05 * P(t, end('fixed'), 0.6, linear) : 0)), mood: sad ? 'sad' : 'neutral', look: 1, temp: 34 };
    }

    /* ---------- Jules' confessional ---------- */
    if (sid === 'jconf') {
      shots.jconf = 1;
      const push = P(t, at('thjules'), end('thjules') + 0.6 - at('thjules'), linear);
      julP = { x: 420, y: 400, s: 1.45 * (1 + 0.05 * push), mood: t < mid('thjules', 0.2) ? 'annoyed' : 'happy', look: t > mid('thjules', 0.3) && t < mid('thjules', 0.6) ? 1 : 0, glow: 0.8, r: t < mid('thjules', 0.2) ? -4 : 3 * Math.sin(t * 3) * AMP };
      tmpPop(scroll, 880, 320, P(t, at('thjules') + 0.1, 0.45, pop), 1, -3);
      const sp = P(t, mid('thjules', 0.74), 0.5, pop);
      op(sign, clamp(sp * 3)); tr(sign, 880, 540, 1.2, 50 * (1 - sp) + 6 * Math.sin(t * 2.4) * AMP * sp);
    }

    /* ---------- sets ---------- */
    op(kitShot, shots.kit); confCel.set(shots.conf, t); op(doorsG, shots.conf); confJul.set(shots.jconf, t); op(diaShot, shots.dia);

    /* ---------- cast ---------- */
    if (celP) { op(cel, 1); tr(cel, celP.x, celP.y, celP.s, celP.r); cel.set({ t, talk: talk('cel'), mood: celP.mood, look: celP.look, temp: 34 }); } else op(cel, 0);
    if (julP) { op(jules, 1); tr(jules, julP.x, julP.y, julP.s, julP.r); jules.set({ t, talk: talk('jules'), mood: julP.mood, look: julP.look, glow: julP.glow }); } else op(jules, 0);
    if (kavP) { op(kavG, 1); tr(kavG, kavP.x, kavP.y, kavP.s); kav.set({ t, talk: talk('kavya'), mood: kavP.mood, look: kavP.look, sweat: kavP.sweat }); } else op(kavG, 0);
  };
});

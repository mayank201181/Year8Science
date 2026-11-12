/* Scene 3: Branches, and Auntie Rez (Wednesday).
   Lab worksheet: a parallel circuit, each lamp on its own branch -> Dimitri BRIGHT again ("Nobody touch
   anything!") -> bench: a voltmeter across each branch, 1.5 V each, a third branch, all still bright ->
   close-up junction: the Eddies split left and right -> ammeters 0.4 A + 0.4 A = 0.8 A, Amy ticks her
   clipboard -> Kavya's hand unscrews one lamp, the other branch stays lit (0 A / 0.4 A) -> Dimitri "still
   ON" -> the flat's wiring, each appliance on its own branch -> the brother's lamp pops, the aircon keeps
   blowing -> the drawer lift: DING, enter Auntie Rez (lower third, resistor pass) -> a resistor in the
   loop, everyone slows, 0.4 A -> 0.1 A -> Ω, like a little horseshoe -> longer / thinner wires resist more
   -> Cecil's confessional, side-eye (she protects components) -> her nephew the rheostat dims a lamp. */
scene('parallel', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed par) ---------- */
  const parPop = (el, x, y, p, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const parCam = (el, cx, cy, k) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const parChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: 800 });
  };
  const parPath = (parent, d, o) => E('path', Object.assign({ d, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o || {}), parent);
  // a meter on a circuit: circle with a coloured rim (A red like Amy, V blue like Vic)
  function parMeter(parent, x, y, letter) {
    const g = G(parent); tr(g, x, y);
    E('circle', { r: 25, fill: C.bg0, stroke: letter === 'A' ? DR_RED : DR_BLUE, 'stroke-width': 6 }, g);
    T(g, 0, 10, letter, { size: 28, weight: 800, anchor: 'middle', fill: WIRE });
    return g;
  }
  // a gold reading chip
  function parRead(parent, text) {
    const g = parChip(parent, text, { size: 28, fill: '#0E1A24', stroke: C.energy, color: C.energy, sw: 3 });
    g.txt = g.label;
    return g;
  }
  // a vertical cell (+ long plate on top) with + / − marks on the left
  function parCell(parent, x, y, label) {
    const g = G(parent); tr(g, x, y);
    const c = cellSym(g, { signs: false }); tr(c, 0, 0, 1, 90);
    T(g, -38, -2, '+', { size: 30, weight: 800, anchor: 'middle', fill: C.bad });
    T(g, -38, 34, '−', { size: 30, weight: 800, anchor: 'middle', fill: C.water });
    if (label) T(g, -66, 16, label, { size: 28, weight: 800, anchor: 'end', fill: DR_GOLD });
    return g;
  }
  const parDot = (parent, x, y) => E('circle', { cx: x, cy: y, r: 8, fill: WIRE }, parent);
  // dots-only current loop (the visible wire is drawn separately, so gaps can show)
  const parFlow = (parent, pts, o) => wire(parent, pts, Object.assign({ width: 0, spacing: 95, dot: 7 }, o || {}));
  const hand = (parent) => {    // Kavya's hand reaching down from the top, fingers at (0, 0)
    const g = G(parent);
    E('rect', { x: -34, y: -520, width: 68, height: 470, rx: 20, fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('rect', { x: -26, y: -70, width: 52, height: 40, fill: '#B9784E' }, g);
    E('path', { d: 'M-40,-40 Q-44,10 -26,22 L-26,6 L-14,26 L-12,6 L0,28 L2,6 L14,26 L16,4 L28,18 Q42,0 40,-40 Z', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  };

  /* ---------- layers ---------- */
  const cam = G(root);
  const Lset = G(cam), Lshot = G(cam), Lcast = G(cam), Lfront = G(cam);
  const Lov = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const setLab = G(Lset); drLab(setLab);
  const setDrawer = G(Lset); drDrawer(setDrawer);
  const setBench = G(Lset); drBench(setBench);
  const setFlat = G(Lset); const flat = drFlat(setFlat);
  const setConf = drConf(Lset, 'cecil');
  const SETS = { lab: setLab, drawer: setDrawer, bench: setBench, flat: setFlat, conf: setConf };

  /* ---------- the cast ---------- */
  const CAST = {};
  ['kavya', 'dimitri', 'cecil', 'eddie', 'amy', 'rez'].forEach(k => { const w = G(Lcast); CAST[k] = { w, c: cast(w, k) }; });

  /* =========== A: Lab, Wednesday worksheet =========== */
  const labFront = G(Lfront);
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, labFront);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, labFront);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, labFront);
  const wedChip = parChip(Lov, 'WEDNESDAY', { size: 40, fill: DR_NAVY, stroke: '#FFFFFF', color: DR_GOLD, sw: 3 });
  const sheet = G(Lov);
  E('rect', { x: -300, y: -210, width: 600, height: 420, rx: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, sheet);
  E('path', { d: 'M-286,-210 L286,-210 Q300,-210 300,-196 L300,-156 L-300,-156 L-300,-196 Q-300,-210 -286,-210 Z', fill: '#2E7DD8' }, sheet);
  T(sheet, 0, -170, 'PARALLEL CIRCUIT', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  {
    const ink = { stroke: SC_INK, 'stroke-width': 5 };
    parPath(sheet, 'M-200,-6 L-200,-110 L170,-110 L170,-22 M170,22 L170,120 L-200,120 L-200,10 M-20,-110 L-20,-22 M-20,22 L-20,120', ink);
    parPath(sheet, 'M-224,-6 L-176,-6', ink); parPath(sheet, 'M-212,10 L-188,10', { stroke: SC_INK, 'stroke-width': 10 });
    T(sheet, -246, 4, '+', { size: 28, weight: 800, anchor: 'middle', fill: DR_RED });
    [[-20, 0], [170, 0]].forEach(([x, y]) => {
      E('circle', { cx: x, cy: y, r: 22, fill: '#FFF3A8', stroke: SC_INK, 'stroke-width': 5 }, sheet);
      parPath(sheet, `M${x - 15},${y - 15} L${x + 15},${y + 15} M${x + 15},${y - 15} L${x - 15},${y + 15}`, { stroke: SC_INK, 'stroke-width': 4 });
    });
    [[-20, -110], [-20, 120]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 9, fill: SC_INK }, sheet));
  }
  const br1 = G(sheet), br2 = G(sheet);
  parPath(br1, 'M-20,-110 L-20,120', { stroke: DR_GOLD, 'stroke-width': 12, opacity: 0.55 });
  T(br1, -20, 168, 'branch 1', { size: 28, weight: 800, anchor: 'middle', fill: '#B57B12' });
  parPath(br2, 'M-20,-110 L170,-110 L170,120 L-20,120', { stroke: C.water, 'stroke-width': 12, opacity: 0.5 });
  T(br2, 170, 168, 'branch 2', { size: 28, weight: 800, anchor: 'middle', fill: C.waterDk });
  sheet.insertBefore(br1, sheet.children[3]); sheet.insertBefore(br2, sheet.children[3]);

  /* =========== B: drawer, Dimitri BRIGHT =========== */
  const brightG = G(Lshot);
  const sparks = [];
  const sparkG = G(Lshot);
  for (let i = 0; i < 6; i++) { const s = spark(sparkG, 20, { seed: i }); sparks.push(s); }
  const noTouch = G(Lov);
  E('rect', { x: -170, y: -40, width: 340, height: 80, rx: 10, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4 }, noTouch);
  T(noTouch, 0, 13, 'DO NOT TOUCH', { size: 38, weight: 800, anchor: 'middle', fill: DR_RED });

  /* =========== C: bench, three branches, a voltmeter across each =========== */
  const b3 = G(Lshot);
  const B3X = [420, 640, 860], B3T = 210, B3B = 610, CX = 190, CY = 410;
  const b3Branch = [];
  B3X.forEach((bx, i) => {
    const g = G(b3);
    const prev = i ? B3X[i - 1] : CX;
    parPath(g, `M${prev},${B3T} L${bx},${B3T} M${prev},${B3B} L${bx},${B3B} M${bx},${B3T} L${bx},364 M${bx},456 L${bx},${B3B}`);
    const vg = G(g);   // the voltmeter across this branch's lamp
    parPath(vg, `M${bx},300 L${bx + 100},300 L${bx + 100},385 M${bx + 100},435 L${bx + 100},520 L${bx},520`, { 'stroke-width': 4 });
    parDot(vg, bx, 300); parDot(vg, bx, 520);
    if (i) { parDot(g, prev, B3T); parDot(g, prev, B3B); }
    const flow = parFlow(g, [[CX, CY - 42], [CX, B3T], [bx, B3T], [bx, B3B], [CX, B3B], [CX, CY + 42]]);
    const lw = G(g); tr(lw, bx, 410);
    const lamp = bulbSym(lw); tr(lamp, 0, 0, 1, 90); lamp.set(1);
    parMeter(vg, bx + 100, 410, 'V');
    const rd = parRead(vg, '1.5 V'); tr(rd, bx + 100, 260);
    b3Branch.push({ g, vg, flow, rd, lw, lamp });
  });
  parPath(b3, `M${CX},${CY - 42} L${CX},${B3T} M${CX},${CY + 42} L${CX},${B3B}`);
  parCell(b3, CX, CY, '1.5 V');
  // ammeters (the add-up beat): one in the main wire, one in each of the first two branches
  const am = G(b3);
  parMeter(am, 305, B3T, 'A'); B3X.slice(0, 2).forEach(bx => parMeter(am, bx, 270, 'A'));
  const rdMain = parRead(am, '0.8 A'); tr(rdMain, 305, 158);
  const rdB = B3X.slice(0, 2).map(bx => { const r = parRead(am, '0.4 A'); tr(r, bx + 82, 270); return r; });
  const rdMain2 = parRead(am, '0.4 A'); tr(rdMain2, 305, 158);
  const rdB2 = parRead(am, '0 A'); tr(rdB2, 640 + 72, 270);
  const kHand = hand(b3);
  const gapRing = G(b3); tr(gapRing, 640, 410);
  E('circle', { r: 56, fill: 'none', stroke: C.bad, 'stroke-width': 6, 'stroke-dasharray': '12 8' }, gapRing);
  T(gapRing, 70, 10, 'gap', { size: 30, weight: 800, fill: C.bad });
  const fullChip = parChip(Lov, 'each branch gets the FULL voltage: 1.5 V', { size: 34, color: C.energy, stroke: C.energy });
  const moreChip = parChip(Lov, 'add a branch: they ALL stay bright ✓', { size: 34, color: C.good, stroke: C.good });

  /* =========== D: junction close-up, the Eddies split =========== */
  const jn = G(Lshot);
  parPath(jn, 'M600,780 L600,420 M90,420 L1110,420', { stroke: '#E9EEF2', 'stroke-width': 120, opacity: 0.18, 'stroke-linecap': 'butt' });
  parPath(jn, 'M600,780 L600,420 M90,420 L1110,420', { stroke: DR_COPPER, 'stroke-width': 84, 'stroke-linecap': 'butt' });
  parPath(jn, 'M600,780 L600,420 M90,420 L1110,420', { stroke: '#F2A65A', 'stroke-width': 20, opacity: 0.5, 'stroke-linecap': 'butt' });
  E('circle', { cx: 600, cy: 420, r: 22, fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 4 }, jn);
  const jElec = [];
  for (let i = 0; i < 10; i++) jElec.push(drElectron(jn, 20));
  const jLbl = parChip(Lov, 'JUNCTION: the current splits', { size: 32, color: DR_GOLD, stroke: DR_GOLD });
  const jL = parChip(Lov, '← some go left', { size: 30 }), jR = parChip(Lov, 'some go right →', { size: 30 });

  /* =========== E: add up, then unscrew (the same circuit, ammeters on) =========== */
  const clip = scClipboard(Lshot, 0.6);
  const ticks = [0, 1, 2].map(i => { const k = tick(clip, 10); tr(k, -30, -48 + i * 44); return k; });
  const sumStrip = G(Lov);
  E('rect', { x: -330, y: -44, width: 660, height: 88, rx: 18, fill: '#0E1A24', stroke: C.energy, 'stroke-width': 4 }, sumStrip);
  T(sumStrip, 0, 16, '0.4 A + 0.4 A = 0.8 A', { size: 46, weight: 800, anchor: 'middle', fill: C.energy });
  const sumLbl = parChip(Lov, 'branch currents ADD UP to the total', { size: 30 });
  const stillChip = parChip(Lov, 'the other branch: still a complete loop ✓', { size: 32, color: C.good, stroke: C.good });

  /* =========== F: Dimitri, still on =========== */
  const stillG = G(Lshot);
  const fallen = G(stillG); tr(fallen, 900, 590, 1, 78);
  E('circle', { cx: 0, cy: -40, r: 44, fill: '#C9D3DC', stroke: '#7E93A6', 'stroke-width': 4 }, fallen);
  E('rect', { x: -22, y: 0, width: 44, height: 34, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, fallen);
  E('path', { d: 'M-12,-50 L-4,-60 L4,-50 L12,-60', fill: 'none', stroke: '#6B7783', 'stroke-width': 3 }, fallen);

  /* =========== G: the flat's wiring =========== */
  const flatDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27', opacity: 0.35 }, Lshot);
  const wiring = G(Lov);
  E('rect', { x: 130, y: 470, width: 940, height: 250, rx: 20, fill: 'rgba(10,27,39,0.94)', stroke: C.line, 'stroke-width': 3 }, wiring);
  const WX = [390, 570, 750, 930], WT = 520, WB = 680;
  parPath(wiring, `M200,570 L200,${WT} L930,${WT} M200,620 L200,${WB} L930,${WB}`);
  const wBr = WX.map(x => parPath(wiring, `M${x},${WT} L${x},${WB}`, { stroke: C.energy, 'stroke-width': 7 }));
  WX.slice(0, 3).forEach(x => { parDot(wiring, x, WT); parDot(wiring, x, WB); });
  E('circle', { cx: 200, cy: 595, r: 28, fill: C.bg0, stroke: DR_GOLD, 'stroke-width': 5 }, wiring);
  T(wiring, 200, 607, '~', { size: 40, weight: 800, anchor: 'middle', fill: DR_GOLD });
  T(wiring, 150, 506, 'mains', { size: 26, weight: 800, fill: DR_GOLD });
  const icons = WX.map((x, i) => {
    const g = G(wiring); tr(g, x, 600);
    E('circle', { r: 32, fill: '#16303E', stroke: WIRE, 'stroke-width': 3 }, g);
    if (i === 0) { E('circle', { cy: -4, r: 14, fill: '#FFE45C' }, g); E('rect', { x: -7, y: 10, width: 14, height: 10, fill: '#9AA6B2' }, g); }
    if (i === 1) { E('rect', { x: -22, y: -12, width: 44, height: 22, rx: 6, fill: '#FAFBFC' }, g); E('path', { d: 'M-14,16 q4,6 0,12 M0,16 q4,6 0,12 M14,16 q4,6 0,12', fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3 }, g); }
    if (i === 2) { E('rect', { x: -18, y: -18, width: 36, height: 36, rx: 6, fill: '#FAFBFC' }, g); E('path', { d: 'M-7,-6 L-7,4 M7,-6 L7,4', stroke: SC_INK, 'stroke-width': 4 }, g); }
    if (i === 3) { E('path', { d: 'M-16,-4 L-10,-22 L10,-22 L16,-4 Z', fill: '#F7E7B8' }, g); E('rect', { x: -3, y: -4, width: 6, height: 18, fill: '#9AA6B2' }, g); E('rect', { x: -12, y: 14, width: 24, height: 6, fill: '#8A5A3A' }, g); }
    T(wiring, x + 40, 646, ['lights', 'aircon', 'socket', 'lamp'][i], { size: 26, weight: 700, fill: C.ink, font: FB });
    return g;
  });
  const sockX = G(wiring); tr(sockX, 750, 560); cross(sockX, 16);
  const keepChip = parChip(Lov, 'one branch breaks: the others KEEP WORKING', { size: 32, color: C.good, stroke: C.good });
  const homeChip = parChip(Lov, 'homes are wired in PARALLEL', { size: 40, fill: DR_NAVY, stroke: DR_GOLD, color: DR_GOLD, sw: 3 });
  // aircon gag
  const cushion = G(Lfront);
  E('rect', { x: 540, y: 520, width: 410, height: 84, rx: 20, fill: '#5E92C6', stroke: SC_INK, 'stroke-width': 4 }, cushion);
  const pop1 = G(Lshot); tr(pop1, 1060, 400);
  const popSp = spark(pop1, 40, { color: '#FFFFFF' });
  T(pop1, 0, -70, 'POP!', { size: 44, weight: 800, anchor: 'middle', fill: DR_RED });
  const lampX = parChip(Lov, "brother's lamp ✗", { size: 30, color: C.bad, stroke: C.bad });
  const acTick = parChip(Lov, 'aircon: still on ✓', { size: 30, color: C.good, stroke: C.good });

  /* =========== H: the lift, enter Auntie Rez =========== */
  const lift = G(Lshot);
  const LX = 420;
  E('rect', { x: LX - 160, y: 230, width: 320, height: 345, rx: 10, fill: '#AEBBC4', stroke: SC_INK, 'stroke-width': 4 }, lift);
  E('rect', { x: LX - 130, y: 260, width: 260, height: 315, fill: linGrad('#3A2A1C', '#1E140C', true) }, lift);
  E('ellipse', { cx: LX, cy: 300, rx: 120, ry: 50, fill: glow('#FFF3B0'), opacity: 0.5 }, lift);
  const liftSlot = G(lift);
  const doorL = E('rect', { x: LX - 130, y: 260, width: 130, height: 315, fill: ball('#D3DBE3', '#8E9BA8'), stroke: SC_INK, 'stroke-width': 3 }, lift);
  const doorR = E('rect', { x: LX, y: 260, width: 130, height: 315, fill: ball('#D3DBE3', '#8E9BA8'), stroke: SC_INK, 'stroke-width': 3 }, lift);
  E('rect', { x: LX - 42, y: 186, width: 84, height: 36, rx: 8, fill: '#1B2733', stroke: SC_INK, 'stroke-width': 3 }, lift);
  const liftLamp = T(lift, LX, 214, '▼ 8B', { size: 26, weight: 800, anchor: 'middle', fill: '#FFB03A' });
  const ding = parChip(Lov, 'DING!', { size: 34, fill: '#FFE45C', color: SC_INK, stroke: SC_INK, sw: 3 });
  const rezChip = G(Lov);
  E('rect', { x: -150, y: -70, width: 300, height: 140, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: DR_GOLD, 'stroke-width': 3 }, rezChip);
  tr(drSym(rezChip, 'resistor', { color: '#FFFFFF', w: 6 }), 0, -18);
  T(rezChip, 0, 46, 'resistor', { size: 34, weight: 800, anchor: 'middle', fill: DR_GOLD });
  const ltRez = scLowerThird(Lhud, ...DR_LOWER.rez);
  const badge = drBadge(Lov, 'resistor', 'REZ');
  const harder = G(Lov);
  E('rect', { x: -190, y: -58, width: 380, height: 116, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, harder);
  T(harder, 0, -10, 'makes it HARDER', { size: 34, weight: 800, anchor: 'middle', fill: C.energy });
  T(harder, 0, 34, 'for current to flow', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });

  /* =========== I: bench, a resistor in the loop =========== */
  const loopG = G(Lshot);
  parPath(loopG, 'M200,368 L200,220 L900,220 L900,354 M900,446 L900,600 L200,600 L200,452');
  const rlFlow = parFlow(loopG, [[200, 368], [200, 220], [900, 220], [900, 600], [200, 600], [200, 452]]);
  parCell(loopG, 200, 410, '1.5 V');
  const rlLamp = bulbSym(loopG); tr(rlLamp, 900, 400, 1, 90);
  const rl = G(Lshot);
  parMeter(rl, 550, 600, 'A');
  const rlRd1 = parRead(rl, '0.4 A'), rlRd2 = parRead(rl, '0.1 A'); tr(rlRd1, 550, 548); tr(rlRd2, 550, 548);
  const rlRes = G(rl);
  { const r = resistorSym(rlRes); E('circle', { cx: 0, cy: -30, r: 14, fill: '#9AA0A8', stroke: SC_INK, 'stroke-width': 3 }, r);
    E('circle', { cx: -9, cy: 0, r: 3.5, fill: WIRE }, r); E('circle', { cx: 9, cy: 0, r: 3.5, fill: WIRE }, r); }
  const lessChip = parChip(Lov, 'more resistance → smaller current', { size: 36, color: C.energy, stroke: C.energy });

  /* =========== J: ohms =========== */
  const ohmCard = G(Lov);
  E('rect', { x: -250, y: -190, width: 500, height: 380, rx: 22, fill: '#FBF7EC', stroke: SC_INK, 'stroke-width': 5 }, ohmCard);
  const ohmSym = T(ohmCard, -80, 70, 'Ω', { size: 230, weight: 700, anchor: 'middle', fill: SC_INK });
  const shoe = G(ohmCard); tr(shoe, 140, 10);
  const shoeP = E('path', { d: 'M-46,70 L-46,10 C-46,-80 46,-80 46,10 L46,70', fill: 'none', stroke: '#8E9BA8', 'stroke-width': 26, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, shoe);
  [[-46, 50], [-46, 10], [-30, -40], [30, -40], [46, 10], [46, 50]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 4, fill: SC_INK }, shoe));
  const shoeLbl = T(ohmCard, 140, 140, 'horseshoe', { size: 28, weight: 700, anchor: 'middle', fill: '#5A6B7A', font: FB });
  const ohmTitle = T(ohmCard, 0, -128, 'ohms', { size: 44, weight: 800, anchor: 'middle', fill: SC_INK });
  const ohmChip = parChip(Lov, 'resistance is measured in ohms (Ω)', { size: 34, color: C.energy, stroke: C.energy });

  /* =========== K: wires resist =========== */
  const wr = G(Lshot);
  T(wr, 320, 230, 'LENGTH', { size: 30, weight: 800, anchor: 'middle', fill: C.muted });
  T(wr, 880, 230, 'THICKNESS', { size: 30, weight: 800, anchor: 'middle', fill: C.muted });
  E('line', { x1: 600, y1: 200, x2: 600, y2: 500, stroke: C.line, 'stroke-width': 3 }, wr);
  const wrL = G(wr), wrR = G(wr);
  const WROWS = [
    [wrL, 120, 220, 300, 10, '0.4 A', 80], [wrL, 120, 420, 400, 10, '0.2 A', 40],
    [wrR, 660, 960, 300, 22, '0.4 A', 80], [wrR, 660, 960, 400, 4, '0.2 A', 40],
  ];
  const wrFlows = WROWS.map(([g, x1, x2, y, w, rd, sp]) => {
    parPath(g, `M${x1},${y} L${x2},${y}`, { stroke: DR_COPPER, 'stroke-width': w });
    [x1, x2].forEach(x => E('circle', { cx: x, cy: y, r: 9, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2 }, g));
    const f = parFlow(g, [[x1, y], [x2, y]], { spacing: 60, dot: 5 });
    const r = parRead(g, rd); tr(r, g === wrL ? 510 : 1070, y);
    return [f, sp];
  });
  const wrLC = parChip(wrL, 'longer → MORE resistance', { size: 28, color: C.energy, stroke: C.energy }); tr(wrLC, 320, 480);
  const wrRC = parChip(wrR, 'thinner → MORE resistance', { size: 28, color: C.energy, stroke: C.energy }); tr(wrRC, 880, 480);
  const wrHead = parChip(Lov, 'even wires resist', { size: 34 });
  const most = G(Lov);
  E('rect', { x: -330, y: -56, width: 660, height: 112, rx: 18, fill: '#0E1A24', stroke: C.bad, 'stroke-width': 4 }, most);
  parPath(most, 'M-300,22 L300,22', { stroke: DR_COPPER, 'stroke-width': 4 });
  T(most, 0, -8, 'long + thin = MOST resistance', { size: 36, weight: 800, anchor: 'middle', fill: '#FF9AA4' });

  /* =========== L: Cecil's confessional, the bodyguard inset =========== */
  const inset = G(Lshot);
  E('rect', { x: 700, y: 160, width: 420, height: 300, rx: 18, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 4 }, inset);
  parPath(inset, 'M720,380 L1100,380', { 'stroke-width': 4 });
  const inFlow = parFlow(inset, [[720, 380], [1100, 380]], { spacing: 40, dot: 5 });
  const inLamp = bulbSym(inset); tr(inLamp, 1030, 380); inLamp.set(0.7);
  const inShield = E('path', { d: 'M960,250 Q990,262 1010,250 L1010,300 Q1000,330 985,338 Q970,330 960,300 Z', fill: C.good, stroke: SC_INK, 'stroke-width': 3, opacity: 0.85 }, inset);
  const protCard = G(Lov);
  E('rect', { x: -230, y: -64, width: 460, height: 128, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.good, 'stroke-width': 3 }, protCard);
  T(protCard, 0, -12, 'limits the current', { size: 34, weight: 800, anchor: 'middle', fill: C.ink });
  T(protCard, 0, 34, 'protects components', { size: 34, weight: 800, anchor: 'middle', fill: C.good });

  /* =========== M: the nephew, a rheostat =========== */
  const vr = G(Lshot);
  const neph = G(vr); tr(neph, 470, 220);
  E('rect', { x: -72, y: -30, width: 144, height: 60, rx: 28, fill: ball('#F0DDB4', '#C9A76E'), stroke: '#6B4E22', 'stroke-width': 4 }, neph);
  [[-50, '#7A4A22'], [-34, '#26211F'], [38, '#D23B3B'], [54, '#D4AF37']].forEach(([x, c]) => E('rect', { x: x - 5, y: -27, width: 10, height: 54, fill: c }, neph));
  [-12, 12].forEach(x => { E('circle', { cx: x, cy: -4, r: 7, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, neph); E('circle', { cx: x, cy: -3, r: 3.5, fill: SC_INK }, neph); });
  E('path', { d: 'M-8,12 Q0,18 8,12', fill: 'none', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, neph);
  E('path', { d: 'M-70,-46 L70,-46', stroke: '#9AA6B2', 'stroke-width': 6, 'stroke-linecap': 'round' }, neph);   // slider track
  const knob = G(neph);
  E('path', { d: 'M-14,-66 L14,-66 L0,-36 Z', fill: DR_GOLD, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, knob);
  const symCard = G(vr); tr(symCard, 350, 400);
  E('rect', { x: -110, y: -70, width: 220, height: 140, rx: 16, fill: 'rgba(10,27,39,0.9)', stroke: C.line, 'stroke-width': 2 }, symCard);
  tr(drSym(symCard, 'variable', { color: '#FFFFFF', w: 6 }), 0, -12);
  T(symCard, 0, 52, 'symbol', { size: 26, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
  const varChip = parChip(Lov, 'variable resistor (rheostat)', { size: 36, color: DR_GOLD, stroke: DR_GOLD });
  const dimmer = G(Lov);
  E('rect', { x: -50, y: -70, width: 100, height: 140, rx: 12, fill: '#FAFBFC', stroke: SC_INK, 'stroke-width': 4 }, dimmer);
  E('circle', { r: 30, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, dimmer);
  const dimTick = E('path', { d: 'M0,-4 L0,-26', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, dimmer);
  T(dimmer, 0, 110, 'dimmer switch', { size: 26, weight: 700, anchor: 'middle', fill: C.ink, font: FB });
  const volume = G(Lov);
  E('circle', { r: 62, fill: '#2A2F36', stroke: '#9AA6B2', 'stroke-width': 4 }, volume);
  { let d = ''; for (let i = 0; i <= 10; i++) { const a = (135 + i * 27) * Math.PI / 180; d += `M${(Math.cos(a) * 50).toFixed(1)},${(Math.sin(a) * 50).toFixed(1)} L${(Math.cos(a) * 58).toFixed(1)},${(Math.sin(a) * 58).toFixed(1)} `; }
    E('path', { d, stroke: '#FFFFFF', 'stroke-width': 3 }, volume); }
  E('circle', { r: 40, fill: '#5A6470', stroke: SC_INK, 'stroke-width': 3 }, volume);
  const volTick = E('path', { d: 'M0,0 L0,-32', stroke: DR_GOLD, 'stroke-width': 6, 'stroke-linecap': 'round' }, volume);
  T(volume, 0, 104, 'volume control', { size: 26, weight: 700, anchor: 'middle', fill: C.ink, font: FB });

  /* ---------- cut list: [start, shot, set, cam] ---------- */
  const CUTS = [
    [-1, 'lab', 'lab'],
    [at('bright') - 0.08, 'bright', 'drawer'],
    [at('full') - 0.08, 'b3', 'bench'],
    [at('split') - 0.08, 'jn', 'bench'],
    [at('addup') - 0.08, 'b2', 'bench'],
    [at('still') - 0.08, 'still', 'drawer'],
    [at('keep') - 0.08, 'flat', 'flat'],
    [at('aircon') - 0.08, 'flatK', 'flat'],
    [at('rez') - 0.08, 'lift', 'drawer'],
    [at('hi') - 0.08, 'hi', 'drawer'],
    [at('less') - 0.08, 'rl', 'bench'],
    [at('ohms') - 0.08, 'ohm', 'drawer'],
    [at('wire') - 0.08, 'wr', 'bench'],
    [at('threz') - 0.08, 'conf', 'conf'],
    [at('nephew') - 0.08, 'vr', 'bench'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const ALL = [sheet, wedChip, labFront, brightG, sparkG, noTouch, loopG, b3, fullChip, moreChip, jn, jLbl, jL, jR, clip, sumStrip, sumLbl, stillChip,
    stillG, flatDim, wiring, keepChip, homeChip, cushion, pop1, lampX, acTick, lift, ding, rezChip, badge, harder, rl, lessChip,
    ohmCard, ohmChip, wr, wrHead, most, inset, protCard, vr, varChip, dimmer, volume];

  return t => {
    const [, shot, set] = cutAt(t);
    Object.keys(SETS).forEach(k => op(SETS[k], k === set ? 1 : 0));
    ALL.forEach(g => op(g, 0));
    ltRez.set(0);
    let cx = 600, cy = 375, k = 1;
    const pose = {};
    const L = (id, f) => mid(id, f);

    /* ----- A: lab ----- */
    if (shot === 'lab') {
      op(labFront, 1);
      k = 1 + 0.03 * P(t, at('wednesday'), 4, linear); cx = 600; cy = 420;
      pose.kavya = { x: 300, y: 450, s: 1.15, mood: t > L('wednesday', 0.7) ? 'deadpan' : 'neutral', look: t > L('wednesday', 0.25) ? 0.7 : 0 };
      parPop(wedChip, 820, 150, P(t, at('wednesday') - 0.1, 0.45, pop));
      parPop(sheet, 840, 430, P(t, L('wednesday', 0.18), 0.45, pop), 1, 2);
      op(br1, P(t, L('wednesday', 0.6), 0.3, linear)); op(br2, P(t, L('wednesday', 0.75), 0.3, linear));
    }

    /* ----- B: Dimitri BRIGHT ----- */
    if (shot === 'bright') {
      op(brightG, 1); op(sparkG, 1);
      k = 1 + 0.05 * P(t, end('bright'), 0.6, ease); cx = 600; cy = 400;
      const shocked = t > L('bright', 0.5);
      pose.dimitri = { x: 600, y: 390, s: 1.15, mood: shocked ? 'shock' : 'happy', glow: 1 };
      pose.cecil = { x: 220, y: 470, s: 0.7, mood: 'deadpan', look: 0.8 };
      pose.eddie = { x: 990, y: 470, s: 0.6, mood: 'happy', look: -0.8 };
      const b0 = at('bright');
      sparks.forEach((s, i) => {
        const q = clamp((t - b0) / 1.1), a = i / 6 * TAU - Math.PI / 2, d = 120 + 160 * easeOut(q);
        tr(s, 600 + Math.cos(a) * d, 350 + Math.sin(a) * d * 0.8, 1.2 - 0.6 * q); op(s, 1 - q); s.upd(t);
      });
      parPop(noTouch, 900, 320, P(t, L('bright', 0.55), 0.4, pop), 1, 4);
    }

    /* ----- C: three branches ----- */
    if (shot === 'b3') {
      op(b3, 1); op(am, 0); op(kHand, 0); op(gapRing, 0);
      const p3 = P(t, L('full', 0.62), 0.6, ease);
      b3Branch.forEach((b, i) => {
        op(b.vg, 1); op(b.g, 1); tr(b.g, 0, 0); tr(b.lw, B3X[i], 410, 1, 0); b.lamp.set(1); b.flow.set(1);
        if (i === 2) { op(b.g, clamp(p3 * 2)); tr(b.g, 320 * (1 - p3), 0); }
        b.flow.upd(t, 70); op(b.rd, i === 2 ? P(t, L('full', 0.75), 0.3, linear) : P(t, L('full', 0.22 + i * 0.1), 0.3, linear));
      });
      parPop(fullChip, 600, 690, P(t, L('full', 0.2), 0.45, pop) * (1 - P(t, L('full', 0.62), 0.2, linear)));
      parPop(moreChip, 600, 690, P(t, L('full', 0.8), 0.45, pop));
    }

    /* ----- D: junction ----- */
    if (shot === 'jn') {
      op(jn, 1);
      const t0 = at('split') - 0.6;
      jElec.forEach((e, i) => {
        const q = ((t - t0) * 0.32 * (0.6 + 0.4 * AMP) + i / 10) % 1, side = i % 2 ? 1 : -1;
        let x, y;
        if (q < 0.42) { x = 600 + Math.sin(i * 2.1 + t * 3) * 14 * AMP; y = 780 - 360 * (q / 0.42); }
        else { const d = (q - 0.42) / 0.58 * 560; x = 600 + side * d; y = 420 + Math.sin(i * 1.7 + t * 3) * 14 * AMP; }
        tr(e, x, y); op(e, Math.min(1, (1 - q) * 8));
      });
      pose.eddie = { x: 600, y: 210, s: 0.82, mood: 'happy', look: t > L('split', 0.55) ? (t > L('split', 0.8) ? 1 : -1) : 0 };
      parPop(jLbl, 880, 560, P(t, L('split', 0.15), 0.45, pop));
      parPop(jL, 250, 330, P(t, L('split', 0.55), 0.4, pop));
      parPop(jR, 950, 330, P(t, L('split', 0.78), 0.4, pop));
    }

    /* ----- E: add up, then unscrew ----- */
    if (shot === 'b2') {
      op(b3, 1); op(am, 1); op(clip, 1); tr(clip, 1105, 520, 0.6, 8);
      b3Branch.forEach((b, i) => { op(b.vg, 0); op(b.g, i < 2 ? 1 : 0); tr(b.g, 0, 0); });
      const uns = t >= at('unscrew') - 0.08;
      const g0 = L('unscrew', 0.12), tw0 = L('unscrew', 0.3), lift0 = L('unscrew', 0.62);
      const hy = uns ? lerp(-140, 365, P(t, g0 - 0.5, 0.5, ease)) - 360 * P(t, lift0, 0.6, easeIn) : -200;
      const twist = uns && t > tw0 && t < lift0 ? 28 * Math.sin((t - tw0) * 12) : 0;
      op(kHand, uns ? 1 : 0); tr(kHand, 640, hy, 1, twist * 0.3);
      const lifted = uns && t > lift0;
      const B2 = b3Branch[1];
      tr(b3Branch[0].lw, 420, 410, 1, 0); b3Branch[0].lamp.set(1);
      tr(B2.lw, 640, lifted ? hy + 45 : 410, 1, twist);
      B2.lamp.set(lifted ? 0 : 1);
      b3Branch[0].flow.upd(t, 70); b3Branch[0].flow.set(1); B2.flow.upd(t, 70); B2.flow.set(lifted ? 0 : 1);
      const after = uns && t > L('unscrew', 0.78);
      op(gapRing, uns ? P(t, lift0 + 0.3, 0.3, linear) : 0);
      // readings
      op(rdB[0], P(t, L('addup', 0.08), 0.3, linear)); op(rdB[1], after ? 0 : P(t, L('addup', 0.18), 0.3, linear));
      op(rdMain, after ? 0 : P(t, L('addup', 0.4), 0.3, linear));
      op(rdMain2, after ? 1 : 0); op(rdB2, after ? 1 : 0);
      ticks.forEach((tk, i) => op(tk, P(t, L('addup', [0.2, 0.45, 0.8][i]), 0.2, linear)));
      if (!uns) {
        parPop(sumStrip, 520, 692, P(t, L('addup', 0.62), 0.45, pop));
        op(sumLbl, 0);
      } else parPop(stillChip, 560, 692, P(t, L('unscrew', 0.85), 0.4, pop));
      const amyMood = uns ? (lifted ? (after ? 'neutral' : 'shock') : 'neutral') : (t > L('addup', 0.6) ? 'smug' : 'neutral');
      pose.amy = { x: 1000, y: 410, s: 0.78, mood: amyMood, look: -0.8, needle: after ? 0.2 : 0.4 };
    }

    /* ----- F: still on ----- */
    if (shot === 'still') {
      op(stillG, 1);
      const yes = t > L('still', 0.5);
      k = 1 + 0.04 * P(t, at('still'), 2.6, linear); cx = 560; cy = 380;
      pose.dimitri = { x: 560, y: 380, s: 1.2, mood: yes ? 'happy' : 'shock', look: t < L('still', 0.3) ? 0.9 : 0, glow: 1 };
      const b0 = L('still', 0.52);
      op(sparkG, t > b0 ? 1 : 0);
      sparks.forEach((s, i) => {
        const q = clamp((t - b0) / 1.0), a = i / 6 * TAU - Math.PI / 2, d = 110 + 160 * easeOut(q);
        tr(s, 560 + Math.cos(a) * d, 340 + Math.sin(a) * d * 0.8, 1.2 - 0.6 * q); op(s, t < b0 ? 0 : 1 - q); s.upd(t);
      });
    }

    /* ----- G: flat wiring; H: the aircon ----- */
    if (set === 'flat') {
      flat.upd(t);
      flat.lights.forEach(l => l.set(1));
    }
    if (shot === 'flat') {
      flat.lamp.set(1);
      op(flatDim, 1);
      op(wiring, P(t, at('keep') - 0.1, 0.3, linear));
      const brk = t > L('keep', 0.28);
      wBr.forEach((b, i) => { const off = i === 2 && brk; attr(b, 'stroke', off ? '#5A6B7A' : C.energy); attr(b, 'stroke-dasharray', off ? '10 10' : 'none'); op(b, off ? 1 : 0.75 + 0.25 * Math.sin(t * 5 + i)); });
      icons.forEach((g, i) => op(g, i === 2 && brk ? 0.35 : 1));
      op(sockX, brk ? P(t, L('keep', 0.28), 0.2, linear) : 0);
      parPop(keepChip, 600, 290, P(t, L('keep', 0.35), 0.45, pop) * (1 - P(t, L('keep', 0.68), 0.2, linear)));
      parPop(homeChip, 600, 290, P(t, L('keep', 0.72), 0.45, pop));
    }
    if (shot === 'flatK') {
      op(cushion, 1);
      const p0 = L('aircon', 0.36);
      const blown = t > p0;
      flat.lamp.set(blown ? 0 : 1);
      const pp = clamp((t - p0) / 0.7);
      op(pop1, blown && pp < 1 ? 1 : 0); tr(pop1, 1060, 400, 0.6 + 0.6 * easeOut(pp)); popSp.upd(t);
      k = 1 + 0.08 * P(t, L('aircon', 0.75), end('aircon') - L('aircon', 0.75) + 0.6, linear); cx = 745; cy = 400;
      const smug = t > L('aircon', 0.72);
      pose.kavya = { x: 745, y: 425, s: 0.95, mood: smug ? 'smug' : blown ? 'deadpan' : 'neutral', look: blown && !smug ? 0.9 : 0 };
      parPop(lampX, 1030, 300, P(t, p0 + 0.2, 0.4, pop));
      parPop(acTick, 640, 170, P(t, L('aircon', 0.5), 0.4, pop));
    }

    /* ----- H: the lift; I: hi ----- */
    if (shot === 'lift' || shot === 'hi') {
      op(lift, 1);
      const dp = shot === 'hi' ? 1 : P(t, L('rez', 0.3), 0.7, ease);
      attr(doorL, 'width', 130 * (1 - dp) + 0.1); attr(doorR, 'x', LX + 130 * dp); attr(doorR, 'width', 130 * (1 - dp) + 0.1);
      op(liftLamp, 0.6 + 0.4 * (Math.sin(t * 8) > 0 ? 1 : 0));
    }
    if (shot === 'lift') {
      parPop(ding, LX, 150, P(t, L('rez', 0.28), 0.3, pop) * (1 - P(t, L('rez', 0.6), 0.2, linear)));
      parPop(rezChip, 790, 330, P(t, L('rez', 0.2), 0.45, pop));
      const doorsOpen = t > L('rez', 0.3) + 0.7;
      const wk = P(t, L('rez', 0.62), 0.9, ease);
      pose.rez = { x: lerp(LX, 470, wk), y: lerp(470, 480, wk), s: lerp(0.72, 0.88, wk), mood: 'annoyed', look: 0, slot: doorsOpen && wk > 0 ? null : liftSlot, hide: t < L('rez', 0.3) + 0.15 };
      pose.dimitri = { x: 1010, y: 470, s: 0.55, mood: t > L('rez', 0.5) ? 'shock' : 'neutral', look: -1, glow: 0.8 };
      pose.amy = { x: 760, y: 500, s: 0.55, mood: t > L('rez', 0.55) ? 'shock' : 'neutral', look: -1 };
    }
    if (shot === 'hi') {
      k = 1.04 + 0.05 * P(t, at('hi'), end('hi') - at('hi') + 0.4, linear); cx = 640; cy = 390;
      pose.rez = { x: 640, y: 390, s: 1.1, mood: t > L('hi', 0.78) ? 'smug' : 'annoyed', look: 0 };
      ltRez.set(win(t, at('hi') + 0.1, at('hi') + 3.3, 0.3));
      parPop(badge, 1000, 420, P(t, L('hi', 0.22), 0.45, pop), 1, 5);
      parPop(harder, 960, 640, P(t, L('hi', 0.45), 0.45, pop));
    }

    /* ----- J: resistor in the loop ----- */
    if (shot === 'rl') {
      op(rl, 1); op(loopG, 1);
      const r0 = L('less', 0.1), rIn = P(t, r0, 0.5, easeOut);
      tr(rlRes, 550, lerp(80, 220, rIn)); op(rlRes, clamp(rIn * 3));
      const s0 = r0 + 0.4, v1 = 75, v2 = 20, ramp = 0.6;
      const ph = t < s0 ? v1 * t : t < s0 + ramp ? v1 * s0 + v1 * (t - s0) - (v1 - v2) * (t - s0) * (t - s0) / (2 * ramp) : v1 * s0 + (v1 + v2) / 2 * ramp + v2 * (t - s0 - ramp);
      rlFlow.upd(ph, 1);
      const dim = P(t, s0, ramp, linear);
      rlLamp.set(1 - 0.7 * dim);
      op(rlRd1, 1 - dim); op(rlRd2, dim);
      parPop(lessChip, 560, 692, P(t, L('less', 0.45), 0.45, pop));
      pose.amy = { x: 1065, y: 560, s: 0.7, mood: t > L('less', 0.85) ? 'smug' : 'neutral', look: -0.9, needle: 0.4 - 0.3 * dim };
    }

    /* ----- K: ohms ----- */
    if (shot === 'ohm') {
      k = 1 + 0.03 * P(t, at('ohms'), 4, linear); cx = 600; cy = 400;
      pose.rez = { x: 300, y: 440, s: 0.95, mood: t > L('ohms', 0.78) ? 'smug' : 'annoyed', look: t > L('ohms', 0.3) && t < L('ohms', 0.78) ? 0.8 : 0 };
      parPop(ohmCard, 820, 446, P(t, L('ohms', 0.25), 0.45, pop), 1, 2);
      op(ohmTitle, P(t, L('ohms', 0.05), 0.3, linear));
      shoeP.setAttribute('stroke-dashoffset', (1 - P(t, L('ohms', 0.58), 0.6, ease)).toFixed(3));
      op(shoe, P(t, L('ohms', 0.56), 0.1, linear)); op(shoeLbl, P(t, L('ohms', 0.68), 0.3, linear));
      parPop(ohmChip, 600, 692, P(t, at('ohms') + 0.1, 0.45, pop));
    }

    /* ----- L: wires resist ----- */
    if (shot === 'wr') {
      op(wr, 1);
      parPop(wrHead, 640, 140, P(t, at('wire'), 0.4, pop));
      op(wrL, P(t, L('wire', 0.2), 0.3, linear)); op(wrR, P(t, L('wire', 0.58), 0.3, linear));
      op(wrLC, P(t, L('wire', 0.4), 0.3, linear)); op(wrRC, P(t, L('wire', 0.8), 0.3, linear));
      wrFlows.forEach(([f, sp]) => f.upd(t, sp));
      parPop(most, 520, 640, P(t, L('wire', 0.88), 0.4, pop));
      pose.rez = { x: 1070, y: 640, s: 0.48, mood: t > end('wire') ? 'smug' : 'annoyed', look: -0.8 };
    }

    /* ----- M: Cecil's confessional ----- */
    if (shot === 'conf') {
      setConf.set(1, t);
      const pk = P(t, end('threz') - 0.1, 0.9, ease);
      k = 1 + 0.12 * pk; cx = 430; cy = 380;
      const still = t > L('threz', 0.72);
      pose.cecil = { x: 400, y: 410, s: 1.4, mood: still && t < end('threz') ? 'annoyed' : t > end('threz') ? 'deadpan' : 'neutral', look: t > L('threz', 0.08) && t < end('threz') ? 0.85 : 0 };
      op(inset, P(t, L('threz', 0.1), 0.25, linear)); inFlow.upd(t, 22);
      op(inShield, P(t, L('threz', 0.4), 0.3, linear));
      pose.rez = { x: 880, y: 330, s: 0.45, mood: 'smug', look: -0.6 };
      parPop(protCard, 910, 570, P(t, L('threz', 0.2), 0.45, pop));
    }

    /* ----- N: the nephew ----- */
    if (shot === 'vr') {
      op(vr, 1); op(loopG, 1);
      const s0 = L('nephew', 0.36), w = TAU / 3.2;
      const u = t < s0 ? 0 : 0.5 - 0.5 * Math.cos(w * (t - s0));
      tr(knob, -52 + 104 * u, 0);
      rlLamp.set(1 - 0.85 * u);
      const v = 70, d = Math.max(0, t - s0);
      const ph = v * (t - 0.8 * (0.5 * d - 0.5 * Math.sin(w * d) / w));
      rlFlow.upd(ph, 1);
      op(symCard, P(t, L('nephew', 0.22), 0.3, linear));
      parPop(varChip, 780, 140, P(t, L('nephew', 0.08), 0.45, pop));
      parPop(dimmer, 570, 400, P(t, L('nephew', 0.66), 0.45, pop));
      parPop(volume, 770, 400, P(t, L('nephew', 0.8), 0.45, pop));
      tr(dimTick, 0, 0, 1, -130 + 260 * (1 - u)); tr(volTick, 0, 0, 1, -135 + 270 * (1 - u));
      pose.rez = { x: 1060, y: 330, s: 0.62, mood: t > L('nephew', 0.3) ? 'smug' : 'annoyed', look: t > s0 && t < L('nephew', 0.62) ? -0.9 : 0 };
    }

    parCam(cam, cx, cy, k);

    /* ----- the cast ----- */
    Object.keys(CAST).forEach(kind => {
      const { w, c } = CAST[kind], p = pose[kind];
      if (!p || p.hide) { op(w, 0); return; }
      const slot = p.slot || Lcast;
      if (w.parentNode !== slot) slot.appendChild(w);
      op(w, 1); tr(w, p.x, p.y, p.s);
      c.set({ t, talk: scTalk(S, t, kind), mood: p.mood, look: p.look || 0, glow: p.glow, needle: p.needle, still: S.reduce });
    });
  };
});

/* DRAWER 8B, scene 2: "Two lamps, one loop" (Tuesday).
   Shots (hard sitcom cuts): Lab Three, the worksheet (two lamps in series) -> the drawer: Dimitri meets his
   understudy -> Cecil: "You do now." -> the STAFF corkboard of circuit-symbol passes -> Cecil's pass (long thin
   +, short thick -) -> Dimitri's pass (circle with a cross) + quick-fire symbols -> Amy stands IN the wire
   -> bench: two ammeters, 0.2 A before and after -> Cecil confessional, Amy alone in a queue -> Vic stands
   ACROSS the lamp -> Vic's sign: "Hi." ... "1.5 V" -> bench: 0.75 V + 0.75 V = 1.5 V -> Dimitri, half lit
   -> Cecil: DIM-itri -> four lamps, all dimmer -> Kavya unscrews one -> every lamp goes out -> betrayal, in the dark. */
scene('series', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed sr) ---------- */
  const srCam = (g, k, fx, fy, sx, sy) => g.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const srPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.72 + 0.28 * p)), r); };
  const srChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 800 });
  };
  function srCard(parent, w, h, lines, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: o.fill || 'rgba(10,27,39,0.94)', stroke: o.stroke || C.energy, 'stroke-width': 4 }, g);
    g.rows = lines.map(([txt, size, col, y]) => T(g, 0, y, txt, { size, weight: 800, anchor: 'middle', fill: col || C.ink }));
    return g;
  }
  function srPaper(parent, w, h, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: '#FFFFFF', stroke: INK, 'stroke-width': 4 }, g);
    if (o.head) {
      E('path', { d: `M${-w / 2 + 12},${-h / 2} L${w / 2 - 12},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 12} L${w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 12} Q${-w / 2},${-h / 2} ${-w / 2 + 12},${-h / 2} Z`, fill: o.headCol || DR_RED }, g);
      T(g, 0, -h / 2 + 33, o.head, { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    return g;
  }
  function srPoly(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push([L, l, pts[i], pts[i + 1]]); L += l; }
    return { L, at: s => { s = ((s % L) + L) % L; for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; } return pts[pts.length - 1]; } };
  }
  function srDist(t, plan) {
    let d = 0;
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i][0], b = i + 1 < plan.length ? plan[i + 1][0] : 1e9;
      if (t <= a) break;
      d += plan[i][1] * (Math.min(t, b) - a);
    }
    return d;
  }

  /* ---------- layers ---------- */
  const cam = G(root);
  const Lsets = G(cam), Lprops = G(cam), Lcast = G(cam), Lfg = G(cam);
  const HUD = G(root);

  /* =================== LAB THREE (Tuesday) =================== */
  const setLab = G(Lsets); drLab(setLab);
  const labFront = G(Lfg);
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, labFront);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, labFront);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, labFront);
  const sheet = srPaper(HUD, 460, 340, { head: 'WORKSHEET · TASK 2', headCol: '#2E7DD8' });
  T(sheet, 0, -98, 'Two lamps IN SERIES', { size: 30, weight: 800, anchor: 'middle', fill: INK });
  const sheetDia = G(sheet);
  E('path', { d: 'M-60,-30 L-150,-30 L-150,110 L-130,110 M-10,110 L10,110 M130,110 L150,110 L150,-30 L60,-30', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, sheetDia);
  tr(drSym(sheetDia, 'cell', { w: 5 }), 0, -30);
  tr(drSym(sheetDia, 'lamp', { w: 5 }), -70, 110);
  tr(drSym(sheetDia, 'lamp', { w: 5 }), 70, 110);
  const cTue = srChip(HUD, 'TUESDAY', { size: 52, fill: DR_RED, stroke: '#FFFFFF', sw: 4 });
  const cOneLoop = srChip(HUD, 'one single loop, one after another', { size: 30, color: C.energy });

  /* =================== THE DRAWER =================== */
  const setDrawer = G(Lsets); drDrawer(setDrawer);
  const cLamp2 = srChip(HUD, 'LAMP 2 (understudy)', { size: 28, color: C.muted });
  const cHalf = srChip(HUD, 'half the voltage → DIM', { size: 34, color: C.energy });
  const nameCard = G(HUD);
  E('rect', { x: -230, y: -80, width: 460, height: 160, rx: 20, fill: 'rgba(10,27,39,0.94)', stroke: '#FFFFFF', 'stroke-width': 4 }, nameCard);
  E('rect', { x: -190, y: -48, width: 186, height: 96, rx: 12, fill: C.energy }, nameCard);
  T(nameCard, -97, 30, 'DIM', { size: 80, weight: 800, anchor: 'middle', fill: INK });
  T(nameCard, 8, 30, '-itri', { size: 80, weight: 800, fill: '#FFFFFF' });

  /* =================== CONFESSIONAL + inset: Amy queues alone =================== */
  const confC = drConf(Lsets, 'cecil');
  const insetQ = G(Lsets);
  E('rect', { x: 720, y: 150, width: 360, height: 320, rx: 16, fill: '#2F3338', stroke: '#FFFFFF', 'stroke-width': 6 }, insetQ);
  E('rect', { x: 726, y: 380, width: 348, height: 84, fill: '#4A5058' }, insetQ);
  [790, 1010].forEach(x => { E('rect', { x: x - 5, y: 300, width: 10, height: 120, fill: '#C9D3DC' }, insetQ); E('ellipse', { cx: x, cy: 420, rx: 22, ry: 6, fill: '#8E9BA8' }, insetQ); });
  E('path', { d: 'M790,312 Q900,336 1010,312', fill: 'none', stroke: DR_RED, 'stroke-width': 8 }, insetQ);
  const qSign = srChip(insetQ, 'QUEUE HERE', { size: 26, fill: '#FFE45C', color: INK, stroke: INK, sw: 2 }); tr(qSign, 900, 205);
  const cNobody = srChip(HUD, 'queue length: 1', { size: 28, color: C.muted });

  /* =================== CORKBOARD of staff passes =================== */
  const setCork = G(Lsets);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6E4A2C', '#4A3020', true) }, setCork);
  E('rect', { x: 60, y: 120, width: 1080, height: 590, rx: 14, fill: '#C9965A', stroke: '#7A4E25', 'stroke-width': 14 }, setCork);
  { const r = rng(88); let d = ''; for (let i = 0; i < 90; i++) d += `M${(80 + r() * 1040).toFixed(0)},${(140 + r() * 550).toFixed(0)} h4 v3 h-4 Z `; E('path', { d, fill: '#9E6E3A', opacity: 0.7 }, setCork); }
  const corkHead = G(setCork); tr(corkHead, 600, 182, 1, -1);
  E('rect', { x: -230, y: -34, width: 460, height: 64, rx: 6, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, corkHead);
  T(corkHead, 0, 12, 'DRAWER 8B · STAFF', { size: 36, weight: 800, anchor: 'middle', fill: INK });
  const corkDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A0F14' }, setCork);
  const BADGES = [['cell', 'CECIL'], ['lamp', 'DIMITRI'], ['ammeter', 'AMY'], ['voltmeter', 'VIC'], ['resistor', 'REZ'], ['switch', 'VACANT']]
    .map(([sym, nm]) => drBadge(Lprops, sym, nm));
  const cSymbols = srChip(HUD, 'circuit symbols', { size: 38, color: C.energy, stroke: C.energy });
  // Cecil's pass, labelled
  const cPlus = srCard(HUD, 250, 110, [['long, thin line', 28, C.ink, -12], ['+ positive', 32, '#FF6B6B', 30]], { stroke: '#FF6B6B' });
  const cMinus = srCard(HUD, 250, 110, [['short, thick line', 28, C.ink, -12], ['− negative', 32, '#6FA8FF', 30]], { stroke: '#6FA8FF' });
  const ldPlus = E('path', { d: 'M560,280 L700,330', stroke: '#FF6B6B', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, HUD);
  const ldMinus = E('path', { d: 'M880,540 L742,420', stroke: '#6FA8FF', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, HUD);
  // Dimitri's pass: circle with a cross, then a quick-fire row of other symbols
  const cIconic = srChip(HUD, 'lamp: circle with a cross', { size: 32, color: C.energy });
  const lampSparks = [0, 1].map(i => spark(HUD, 16, { seed: i + 4 }));
  const tiles = ['switch', 'motor', 'buzzer', 'fuse', 'diode', 'led'].map(sym => {
    const g = G(HUD);
    tr(drSym(g, sym, { color: '#FFFFFF', w: 5 }), 0, -14, 0.68);
    T(g, 0, 38, sym === 'led' ? 'LED' : sym, { size: 26, weight: 800, anchor: 'middle', fill: C.ink });
    return g;
  });
  const tileStrip = E('rect', { x: 46, y: 600, width: 1108, height: 110, rx: 16, fill: 'rgba(10,27,39,0.94)', stroke: C.line, 'stroke-width': 2 }, HUD);
  HUD.insertBefore(tileStrip, tiles[0]);
  const cWires = srCard(HUD, 320, 110, [['wires: straight lines,', 28, C.ink, -12], ['neat corners', 28, C.ink, 26]], { stroke: C.line });

  /* =================== THE BENCH (slate) =================== */
  const setSlate = G(Lsets); drBench(setSlate);
  const subAmy = G(setSlate), subVic = G(setSlate), subLoop = G(setSlate);
  // Amy stands IN the wire (in the drawer, but on her own strip of slate is too dark: keep the drawer)
  // the series loop: one wire, dots move + to - (conventional current)
  const LOOP = srPoly([[550, 200], [190, 200], [190, 470], [1010, 470], [1010, 200], [650, 200]]);
  const loopWire = E('path', { d: '', fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, subLoop);
  const DOTS = []; for (let i = 0; i < 18; i++) DOTS.push(E('circle', { r: 6.5, fill: C.energy }, subLoop));
  const sCell = cellSym(subLoop); tr(sCell, 600, 200, 1.2);
  const branches = [0, 1].map(() => {
    const g = G(subLoop);
    const p = E('path', { d: '', fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    const j1 = E('circle', { r: 8, fill: WIRE }, g), j2 = E('circle', { r: 8, fill: WIRE }, g);
    const m = meterSym(g, 'V');
    return { g, p, j1, j2, m };
  });
  const ammeters = [0, 1].map(() => meterSym(subLoop, 'A'));
  const lamps = [0, 1, 2, 3].map(() => bulbSym(subLoop));
  const barTrack = E('path', { d: '', stroke: '#0B2230', 'stroke-width': 18, 'stroke-linecap': 'round' }, subLoop);
  const barFill = E('path', { d: '', stroke: C.energy, 'stroke-width': 14, 'stroke-linecap': 'round' }, subLoop);
  const cBefore = srChip(HUD, 'before: 0.2 A', { size: 32, color: C.energy });
  const cAfter = srChip(HUD, 'after: 0.2 A', { size: 32, color: C.energy });
  const cSameEv = srChip(HUD, 'same EVERYWHERE in series', { size: 34, color: C.good });
  const cV1 = srChip(HUD, '0.75 V', { size: 32, color: '#6FA8FF' }), cV2 = srChip(HUD, '0.75 V', { size: 32, color: '#6FA8FF' });
  const sumStrip = srChip(HUD, '0.75 V + 0.75 V = 1.5 V', { size: 38, color: C.ink, stroke: '#6FA8FF', sw: 3 });
  const cShared = srChip(HUD, 'the voltage is SHARED: half each', { size: 32, color: '#6FA8FF' });
  const cDimmer = srChip(HUD, 'more lamps in series = dimmer', { size: 34, color: C.energy });
  const cBright = srChip(HUD, 'brightness', { size: 26, color: C.muted, weight: 700 });
  const cAllOut = srCard(HUD, 520, 120, [['SERIES:', 34, C.ink, -12], ['one goes, ALL go out', 38, '#FF9A9E', 34]], { stroke: '#FF9A9E' });
  const darkOv = E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: '#000000' }, Lfg);
  const vicSign = drSign(Lfg, '');

  // Vic stands ACROSS the lamp: a main wire through Dimitri, a branch through Vic
  const vicMain = wire(subVic, [[60, 300], [1140, 300]], { spacing: 90, dot: 6.5 });
  E('path', { d: 'M611,565 L611,590 L490,590 L490,300 M669,565 L669,590 L790,590 L790,300', fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, subVic);
  const vicGlow = E('path', { d: 'M611,565 L611,590 L490,590 L490,300 M669,565 L669,590 L790,590 L790,300', fill: 'none', stroke: '#6FA8FF', 'stroke-width': 14, 'stroke-linejoin': 'round', opacity: 0.5 }, subVic);
  E('circle', { cx: 490, cy: 300, r: 9, fill: WIRE }, subVic); E('circle', { cx: 790, cy: 300, r: 9, fill: WIRE }, subVic);
  const ltVic = scLowerThird(HUD, ...DR_LOWER.vic);
  const vicCard = srCard(HUD, 340, 300, [['VOLTMETER', 38, '#6FA8FF', -96], ['measures voltage', 28, C.ink, -48], ['= potential difference', 28, C.ink, -10], ['in volts (V)', 30, C.energy, 34], ['ACROSS: in parallel', 30, C.good, 98]], { stroke: '#6FA8FF' });

  // Amy stands IN the wire
  const amyWire = wire(subAmy, [[70, 520], [1130, 520]], { spacing: 90, dot: 6.5 });
  const ltAmy = scLowerThird(HUD, ...DR_LOWER.amy);
  const amyCard = srCard(HUD, 380, 300, [['AMMETER', 40, C.energy, -96], ['measures current', 30, C.ink, -44], ['in amps (A)', 32, C.energy, 4], ['stands IN the line:', 28, C.ink, 60], ['in SERIES', 32, C.good, 100]], { stroke: DR_RED });

  /* =================== DARK (betrayal) =================== */
  const setBlack = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lsets);
  const eyes = G(Lfg);
  const eyeEls = [-1, 1].map(sd => {
    const g = G(eyes);
    E('ellipse', { rx: 24, ry: 28, fill: '#FFFFFF' }, g);
    const pu = E('circle', { r: 11, fill: '#000000' }, g);
    return { g, pu, sd };
  });

  /* =================== HAND (Kavya unscrews a lamp) =================== */
  const hand = G(Lfg);
  const handSleeve = E('path', { d: '', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 46 }, hand);
  const handArm = E('path', { d: '', fill: 'none', stroke: SKIN, 'stroke-width': 28, 'stroke-linecap': 'round' }, hand);
  const handPalm = G(hand);
  E('ellipse', { rx: 30, ry: 24, fill: SKIN, stroke: INK, 'stroke-width': 3 }, handPalm);
  E('path', { d: 'M-20,-12 Q-34,-30 -18,-36 Q-6,-30 -4,-16 M6,-18 Q8,-36 22,-32 Q28,-24 20,-12', fill: SKIN, stroke: INK, 'stroke-width': 3 }, handPalm);
  const srHand = (x, y, v, rot) => {
    op(hand, v); if (v <= 0) return;
    const ox = x + 60, oy = 800;
    attr(handArm, 'd', `M${ox.toFixed(1)},${oy} L${x.toFixed(1)},${y.toFixed(1)}`);
    attr(handSleeve, 'd', `M${ox.toFixed(1)},${oy} L${lerp(ox, x, 0.35).toFixed(1)},${lerp(oy, y, 0.35).toFixed(1)}`);
    tr(handPalm, x, y, 1, rot || 0);
  };

  /* =================== THE CAST =================== */
  const dim2 = cast(Lcast, 'dimitri', { mood: 'neutral' });
  const dimitri = cast(Lcast, 'dimitri');
  const cecil = cast(Lcast, 'cecil');
  const amy = cast(Lcast, 'amy');
  const vic = cast(Lcast, 'vic');
  const kav = cast(Lcast, 'kavya');
  Lcast.appendChild(eyes);   // eyes sit just above Dimitri in the dark
  Lfg.insertBefore(darkOv, Lfg.firstChild);

  /* cut points */
  const SH = [
    ['tue', -1e9], ['share', at('share') - 0.1], ['now', at('now') - 0.08], ['sym', at('symbols') - 0.1],
    ['cell', at('cell') - 0.1], ['lamp', at('lamp') - 0.1], ['amy', at('amy') - 0.1], ['same', at('same') - 0.1],
    ['thamy', at('thamy') - 0.1], ['vic', at('vic') - 0.1], ['signs', at('signs') - 0.1], ['shared', at('shared') - 0.1],
    ['dim', at('dim') - 0.1], ['name', at('name') - 0.1], ['dimmer', at('dimmer') - 0.1], ['betray', at('betrayal') - 0.1],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const LOOPSHOTS = ['same', 'shared', 'dimmer'];
  const t3 = mid('dimmer', 0.3), t4 = mid('dimmer', 0.5), liftT = end('unscrew') - 0.15, outT = end('unscrew') + 0.12;
  const dotPlan = [[at('same') - 0.1, 60], [t3, 42], [t4, 32], [outT, 0]];

  const ALL_HUD = [sheet, cTue, cOneLoop, cLamp2, cHalf, nameCard, cNobody, cSymbols, cPlus, cMinus, ldPlus, ldMinus, cIconic, cWires, tileStrip, ...lampSparks, ...tiles,
    cBefore, cAfter, cSameEv, cV1, cV2, sumStrip, cShared, cDimmer, cBright, cAllOut, vicCard, amyCard];

  return t => {
    const sid = shotAt(t);
    const pose = {};
    let k = 1, fx = 600, fy = 375, sx = 600, sy = 375;
    ALL_HUD.forEach(h => op(h, 0));
    ltVic.set(0); ltAmy.set(0);
    BADGES.forEach(b => op(b, 0));
    op(hand, 0); op(vicSign, 0); op(darkOv, 0); op(eyes, 0);

    const isLoop = LOOPSHOTS.includes(sid);
    op(setLab, sid === 'tue' ? 1 : 0); op(labFront, sid === 'tue' ? 1 : 0);
    op(setDrawer, ['share', 'now', 'amy', 'vic', 'signs', 'dim', 'name'].includes(sid) ? 1 : 0);
    confC.set(sid === 'thamy' ? 1 : 0, t); op(insetQ, sid === 'thamy' ? 1 : 0);
    op(setCork, ['sym', 'cell', 'lamp'].includes(sid) ? 1 : 0);
    op(setSlate, isLoop || sid === 'amy' || sid === 'vic' ? 1 : 0);
    op(subAmy, sid === 'amy' ? 1 : 0); op(subVic, sid === 'vic' ? 1 : 0); op(subLoop, isLoop ? 1 : 0);
    op(setBlack, sid === 'betray' ? 1 : 0);

    /* ---------- TUESDAY: the worksheet ---------- */
    if (sid === 'tue') {
      k = 1 + 0.04 * P(t, at('tuesday'), 5, linear); fx = 600; fy = 470; sx = 600; sy = 470;
      pose.kav = { x: 290, y: 445, s: 1.2, mood: t > mid('tuesday', 0.75) ? 'deadpan' : 'neutral', look: t > mid('tuesday', 0.2) ? 0.9 : 0 };
      srPop(cTue, 860, 140, P(t, at('tuesday') - 0.05, 0.45, pop), 1, -2);
      srPop(sheet, 850, 390, P(t, mid('tuesday', 0.2), 0.45, pop), 1, 2);
      srPop(cOneLoop, 790, 640, P(t, mid('tuesday', 0.6), 0.4, pop));
    }

    /* ---------- Dimitri meets the understudy ---------- */
    if (sid === 'share') {
      const pu = P(t, at('share') - 0.1, 0.4, pop);
      pose.dimitri = { x: 420, y: 395, s: 1.15, mood: t < mid('share', 0.4) ? 'shock' : 'annoyed', look: t < mid('share', 0.4) ? 1 : 0, glow: 1 };
      pose.dim2 = { x: 830, y: 430, s: 0.85 * Math.max(0.01, pu), mood: 'neutral', look: 0, glow: 1 };
      srPop(cLamp2, 830, 615, P(t, at('share') + 0.2, 0.4, pop));
    }
    if (sid === 'now') {
      k = 1 + 0.12 * P(t, end('now') - 0.1, 0.9); fx = 600; fy = 360; sx = 600; sy = 360;
      pose.cecil = { x: 600, y: 420, s: 1.45, mood: 'deadpan', look: 0 };
    }

    /* ---------- the STAFF corkboard ---------- */
    if (sid === 'sym' || sid === 'cell' || sid === 'lamp') {
      op(corkDim, sid === 'sym' ? 0 : 0.55); op(corkHead, sid === 'sym' ? 1 : 0);
      if (sid === 'sym') {
        srPop(cSymbols, 600, 650, P(t, mid('symbols', 0.12), 0.45, pop));
        BADGES.forEach((b, i) => srPop(b, 175 + i * 170, 440, P(t, mid('symbols', 0.48 + i * 0.07), 0.4, pop), 0.85, (i % 2 ? 3 : -3)));
      }
      if (sid === 'cell') {
        const z = P(t, at('cell') - 0.1, 0.45);
        op(BADGES[0], 1); tr(BADGES[0], lerp(175, 720, z), lerp(440, 400, z), lerp(0.85, 2.0, z), lerp(-3, 0, z));
        pose.cecil = { x: 230, y: 450, s: 1.0, mood: 'deadpan', look: 1 };
        const pp = P(t, mid('cell', 0.2), 0.4, pop);
        srPop(cPlus, 440, 270, pp); op(ldPlus, clamp(pp * 2));
        op(cPlus.rows[1], P(t, mid('cell', 0.45), 0.3, linear));
        const pm = P(t, mid('cell', 0.72), 0.4, pop);
        srPop(cMinus, 1010, 560, pm); op(ldMinus, clamp(pm * 2));
      }
      if (sid === 'lamp') {
        const z = P(t, at('lamp') - 0.1, 0.45);
        op(BADGES[1], 1); tr(BADGES[1], lerp(345, 720, z), lerp(440, 380, z), lerp(0.85, 1.8, z), lerp(3, 0, z));
        pose.dimitri = { x: 230, y: 420, s: 1.0, mood: 'smug', look: t > mid('lamp', 0.5) ? 1 : 0, glow: 1 };
        srPop(cIconic, 720, 640, P(t, mid('lamp', 0.12), 0.4, pop) * (1 - P(t, mid('lamp', 0.6), 0.2, linear)));
        lampSparks.forEach((s, i) => { const q = P(t, mid('lamp', 0.45) + i * 0.12, 0.4, pop); op(s, clamp(q * 2)); tr(s, [870, 860][i], [250, 500][i], Math.max(0.01, q)); s.upd(t); });
        op(tileStrip, P(t, mid('lamp', 0.58), 0.2, linear));
        tiles.forEach((g, i) => { const q = P(t, mid('lamp', 0.6) + i * 0.08, 0.35, easeOut); op(g, clamp(q * 3)); tr(g, lerp(1300, 140 + i * 184, q), 655); });
        srPop(cWires, 1000, 250, P(t, mid('lamp', 0.95), 0.4, pop));
      }
    }

    /* ---------- AMY stands IN the wire ---------- */
    if (sid === 'amy') {
      amyWire.upd(t, 60);
      pose.amy = { x: 380, y: 400, s: 1.2, mood: t > mid('amy', 0.7) ? 'smug' : 'neutral', look: 0, needle: 0.35 + 0.05 * Math.sin(t * 2) };
      ltAmy.set(win(t, at('amy') + 0.1, at('amy') + 3.3, 0.25));
      srPop(amyCard, 900, 280, P(t, mid('amy', 0.06), 0.4, pop));
      amyCard.rows.forEach((r, i) => op(r, P(t, mid('amy', [0.06, 0.3, 0.48, 0.66, 0.84][i]), 0.3, linear)));
    }

    /* ---------- the series loop on the bench ---------- */
    if (isLoop) {
      const dist = srDist(t, dotPlan);
      // where the components sit on the bottom wire
      let LX = [480, 720, -1, -1], AX = [300, 900], ly = [470, 470, 470, 470], glows = [0.5, 0.5, 0, 0], rot = [0, 0, 0, 0], showV = false, showA = false;
      if (sid === 'same') { showA = true; }
      if (sid === 'shared') { LX = [450, 750, -1, -1]; showV = true; }
      let gap = null;
      if (sid === 'dimmer') {
        const m = P(t, at('dimmer') - 0.1, 0.5);
        const p3 = P(t, t3 - 0.45, 0.45, easeOut), p4 = P(t, t4 - 0.45, 0.45, easeOut);
        LX = [lerp(450, 330, m), lerp(750, 510, m), 690, 870];
        ly = [470, 470, lerp(300, 470, p3), lerp(300, 470, p4)];
        const n = 2 + (t >= t3 ? 1 : 0) + (t >= t4 ? 1 : 0), g = n === 2 ? 0.5 : n === 3 ? 0.34 : 0.24;
        glows = [g, g, t >= t3 ? g : 0, t >= t4 ? g : 0];
        if (p3 <= 0) LX[2] = -1; if (p4 <= 0) LX[3] = -1;
        // Kavya unscrews lamp 2
        if (t >= at('unscrew') - 0.3) {
          const tw = P(t, at('unscrew') - 0.2, liftT - at('unscrew') + 0.2, linear);
          rot[1] = tw < 1 ? 22 * Math.sin(tw * TAU * 2.5) * AMP : 0;
          const lift = P(t, liftT, 0.35, easeOut);
          ly[1] = 470 - 120 * lift;
          if (lift > 0.3) gap = [LX[1] - 50, LX[1] + 50];
          const hv = P(t, at('unscrew') - 0.3, 0.25, linear) * (1 - P(t, outT + 0.5, 0.3, linear));
          srHand(LX[1], ly[1] + 40, hv, rot[1]);
        }
        if (t >= outT) glows = [0, 0, 0, 0];
        const kp = P(t, at('unscrew') - 0.3, 0.35, easeOut);
        if (t >= at('unscrew') - 0.3) pose.kav = { x: 1092, y: lerp(820, 704, kp), s: 0.86, mood: t >= outT ? 'shock' : 'neutral', look: -1 };
        if (t >= at('dark') - 0.1) pose.kav = { x: 1092, y: 704, s: 0.86, mood: t > mid('dark', 0.5) ? 'deadpan' : 'shock', look: 0 };
      }
      // the loop wire, with a gap where a lamp was removed
      const bx = gap ? `L${gap[0].toFixed(1)},470 M${gap[1].toFixed(1)},470 ` : '';
      attr(loopWire, 'd', `M550,200 L190,200 L190,470 ${bx}L1010,470 L1010,200 L650,200`);
      DOTS.forEach((d, i) => {
        const s = (i * LOOP.L / DOTS.length + dist) % LOOP.L, [x, y] = LOOP.at(s);
        if (gap && y > 465 && x > gap[0] - 4 && x < gap[1] + 4) { op(d, 0); return; }
        op(d, 1); attr(d, 'cx', x); attr(d, 'cy', y);
      });
      lamps.forEach((l, i) => {
        if (LX[i] < 0) { op(l, 0); return; }
        op(l, 1); tr(l, LX[i], ly[i], 1.1, rot[i]);
        l.set(glows[i] * (0.9 + 0.1 * Math.sin(t * 6 + i)));
      });
      ammeters.forEach((a, i) => { op(a, showA ? 1 : 0); tr(a, AX[i], 470, 1.1); });
      branches.forEach((b, i) => {
        op(b.g, showV ? 1 : 0);
        if (!showV) return;
        const x = LX[i];
        attr(b.p, 'd', `M${x - 82},470 L${x - 82},590 L${x - 50},590 M${x + 50},590 L${x + 82},590 L${x + 82},470`);
        attr(b.j1, 'cx', x - 82); attr(b.j1, 'cy', 470); attr(b.j2, 'cx', x + 82); attr(b.j2, 'cy', 470);
        tr(b.m, x, 590, 1.1);
      });
      const showBars = sid === 'dimmer';
      let bt = '', bf = '';
      if (showBars) LX.forEach((x, i) => { if (x < 0 || ly[i] < 460) return; bt += `M${x - 45},548 L${x + 45},548 `; if (glows[i] > 0.02) bf += `M${x - 45},548 L${(x - 45 + 90 * glows[i] * 1.9).toFixed(1)},548 `; });
      attr(barTrack, 'd', bt); attr(barFill, 'd', bf);
      if (showBars) srPop(cBright, 110, 557, P(t, t3, 0.4, pop));

      if (sid === 'same') {
        pose.amy = { x: 1110, y: 640, s: 0.55, mood: t > mid('same', 0.6) ? 'smug' : 'neutral', look: -1, needle: 0.3 };
        srPop(cBefore, 300, 392, P(t, mid('same', 0.1), 0.4, pop));
        srPop(cAfter, 900, 392, P(t, mid('same', 0.33), 0.4, pop));
        srPop(cSameEv, 600, 300, P(t, mid('same', 0.6), 0.45, pop));
      }
      if (sid === 'shared') {
        pose.vic = { x: 1110, y: 618, s: 0.55, mood: 'deadpan', look: -1 };
        op(vicSign, P(t, mid('shared', 0.5), 0.3, linear)); vicSign.set('0.75 V'); tr(vicSign, 1104, 462, 0.75);
        srPop(cShared, 600, 290, P(t, mid('shared', 0.12), 0.4, pop));
        srPop(cV1, 450, 664, P(t, mid('shared', 0.4), 0.4, pop));
        srPop(cV2, 750, 664, P(t, mid('shared', 0.5), 0.4, pop));
        srPop(sumStrip, 600, 372, P(t, mid('shared', 0.68), 0.45, pop));
      }
      if (sid === 'dimmer' && t < at('unscrew') - 0.3) srPop(cDimmer, 600, 320, P(t, mid('dimmer', 0.55), 0.45, pop));
      if (sid === 'dimmer') {
        const dk = P(t, outT, 0.25, linear) * 0.35 + 0.3 * P(t, at('dark'), 1.2, linear);
        op(darkOv, dk);
        srPop(cAllOut, 600, 320, P(t, mid('dark', 0.45), 0.45, pop));
      }
    }

    /* ---------- Cecil's confessional: Amy queues alone ---------- */
    if (sid === 'thamy') {
      k = 1 + 0.13 * P(t, end('thamy') - 0.1, 1.0); fx = 400; fy = 360; sx = 400; sy = 360;
      pose.cecil = { x: 380, y: 410, s: 1.45, mood: 'deadpan', look: t > mid('thamy', 0.3) && t < mid('thamy', 0.7) ? 0.8 : 0 };
      const ip = P(t, mid('thamy', 0.15), 0.35, pop);
      op(insetQ, clamp(ip * 2.5));
      pose.amy = { x: 900, y: 372, s: 0.5, mood: 'smug', look: 0, v: clamp(ip * 2.5) };
      srPop(cNobody, 900, 512, P(t, mid('thamy', 0.6), 0.4, pop));
    }

    /* ---------- VIC stands ACROSS the lamp ---------- */
    if (sid === 'vic') {
      vicMain.upd(t, 60);
      pose.dimitri = { x: 640, y: 222, s: 0.85, mood: 'neutral', look: 0.4, glow: 1 };
      const vp = P(t, at('vic') - 0.05, 0.45, pop);
      pose.vic = { x: 640, y: 480, s: 0.85 * Math.max(0.01, 0.6 + 0.4 * vp), mood: 'deadpan', look: 0, needle: 0.6 };
      ltVic.set(win(t, at('vic') + 0.1, at('vic') + 3.3, 0.25));
      op(vicGlow, P(t, mid('vic', 0.74), 0.3, linear) * (0.5 + 0.3 * Math.sin(t * 6)));
      srPop(vicCard, 1000, 470, P(t, mid('vic', 0.06), 0.4, pop));
      vicCard.rows.forEach((r, i) => op(r, P(t, mid('vic', [0.06, 0.24, 0.38, 0.54, 0.74][i]), 0.3, linear)));
    }

    /* ---------- Vic's signs ---------- */
    if (sid === 'signs') {
      k = 1 + 0.1 * P(t, end('signs') - 0.2, 1.2); fx = 600; fy = 400; sx = 600; sy = 400;
      const stare = t > mid('signs', 0.55);
      pose.cecil = { x: 210, y: 450, s: 0.85, mood: 'deadpan', look: stare ? 1 : 0 };
      pose.vic = { x: 560, y: 440, s: 1.05, mood: 'deadpan', look: 0 };
      pose.dimitri = { x: 960, y: 430, s: 0.72, mood: stare ? 'shock' : 'neutral', look: -1, glow: 1 };
      pose.amy = { x: 1095, y: 495, s: 0.55, mood: stare ? 'neutral' : 'happy', look: -1 };
      const up = P(t, mid('signs', 0.55), end('signs') - mid('signs', 0.55) + 0.2, easeOut);
      op(vicSign, clamp(up * 4)); tr(vicSign, 560 + 175, lerp(560, 400, up));
      vicSign.set(t < end('signs') + 0.6 ? 'Hi.' : '1.5 V');
    }

    /* ---------- Dimitri, half lit ---------- */
    if (sid === 'dim') {
      pose.dimitri = { x: 420, y: 400, s: 1.2, mood: t < mid('dim', 0.25) ? 'shock' : t < mid('dim', 0.6) ? 'annoyed' : 'sad', look: 0, glow: 0.5, sweat: P(t, mid('dim', 0.6), 0.4, linear) };
      pose.dim2 = { x: 860, y: 440, s: 0.85, mood: 'neutral', look: 0, glow: 0.5 };
      srPop(cHalf, 640, 655, P(t, mid('dim', 0.08), 0.4, pop));
    }
    if (sid === 'name') {
      k = 1 + 0.14 * P(t, end('name') - 0.1, 1.2); fx = 400; fy = 380; sx = 400; sy = 380;
      pose.cecil = { x: 370, y: 420, s: 1.4, mood: 'deadpan', look: t < mid('name', 0.3) ? 0.8 : 0 };
      srPop(nameCard, 850, 420, P(t, mid('name', 0.45), 0.4, pop), 1, -2);
    }

    /* ---------- betrayal, in the dark ---------- */
    if (sid === 'betray') {
      k = 1 + 0.1 * P(t, at('betrayal'), end('betrayal') + 0.8 - at('betrayal'), linear); fx = 600; fy = 360; sx = 600; sy = 360;
      pose.dimitri = { x: 600, y: 400, s: 1.3, mood: 'sad', look: 0, glow: 0, v: 0.2, still: true };
      op(eyes, 1);
      const lookX = t > end('betrayal') + 0.15 ? 1 : 0;
      const bl = [end('betrayal') + 0.05, end('betrayal') + 0.6].some(b => t > b && t < b + 0.14) ? 0.08 : 1;
      eyeEls.forEach(({ g, pu, sd }) => {
        tr(g, 600 + sd * 29 * 1.3, 400 - 30 * 1.3);
        g.setAttribute('transform', `translate(${(600 + sd * 37.7).toFixed(1)} ${(361).toFixed(1)}) scale(1 ${bl})`);
        attr(pu, 'cx', 9 * lookX); attr(pu, 'cy', 3);
      });
    }

    srCam(cam, k, fx, fy, sx, sy);

    /* ---------- the cast ---------- */
    const apply = (ch, who, p) => {
      if (!p) { op(ch, 0); return; }
      op(ch, p.v === undefined ? 1 : p.v); tr(ch, p.x, p.y, p.s);
      ch.set({ t, talk: scTalk(S, t, who), mood: p.mood, look: p.look, glow: p.glow, needle: p.needle, sweat: p.sweat, still: p.still });
    };
    apply(dimitri, 'dimitri', pose.dimitri); apply(dim2, 'dimitri-understudy', pose.dim2);
    apply(cecil, 'cecil', pose.cecil); apply(amy, 'amy', pose.amy); apply(vic, 'vic', pose.vic); apply(kav, 'kavya', pose.kav);
  };
});

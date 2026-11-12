/* DRAWER 8B, scene 1: "No loop, no glow" (Monday).
   Shots (hard sitcom cuts): Lab Three, the practice kit -> inside the drawer, Dimitri rises into a spotlight
   -> Cecil confessional (inset: Dimitri, smug) -> cut-away of the copper wire packed with electrons -> Eddie
   (and Eddie, and Eddie... ten Eddies wave) -> Cecil, deadpan -> the bench: a loop of Eddies (current) ->
   Cecil the pump (steps out: the Eddies were in the wire already) -> Kavya clips ONE wire -> Dimitri: nothing
   -> the GAP; it stops everywhere -> click: the loop closes, Dimitri blazes -> one Eddie all the way round
   (not used up) -> energy sparks cell -> lamp -> light -> the wire again: conductor / insulator -> Cecil,
   the rubber band photo -> circuit diagram: conventional current + -> - vs electrons - -> + -> 1750s book
   vs 1897 newspaper -> Eddie confessional -> exam paper: arrows + -> -, be consistent. */
scene('loop', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed lp) ---------- */
  const lpCam = (g, k, fx, fy, sx, sy) => g.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const lpPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.72 + 0.28 * p)), r); };
  const lpChip = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 800 });
  };
  // dark card with centred lines: [[text, size, colour, y], ...]
  function lpCard(parent, w, h, lines, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: o.fill || 'rgba(10,27,39,0.94)', stroke: o.stroke || C.energy, 'stroke-width': 4 }, g);
    g.rows = lines.map(([txt, size, col, y]) => T(g, 0, y, txt, { size, weight: 800, anchor: 'middle', fill: col || C.ink }));
    return g;
  }
  // white paper card with an optional coloured header strip (house style from the cold open)
  function lpPaper(parent, w, h, o) {
    o = o || {};
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.fill || '#FFFFFF', stroke: INK, 'stroke-width': 4 }, g);
    if (o.head) {
      E('path', { d: `M${-w / 2 + 12},${-h / 2} L${w / 2 - 12},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 12} L${w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 46} L${-w / 2},${-h / 2 + 12} Q${-w / 2},${-h / 2} ${-w / 2 + 12},${-h / 2} Z`, fill: o.headCol || DR_RED }, g);
      T(g, 0, -h / 2 + 33, o.head, { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    }
    return g;
  }
  // a polyline you can walk along: .at(s) -> [x, y], .L total length, .d path data
  function lpPoly(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); segs.push([L, l, pts[i], pts[i + 1]]); L += l; }
    const atS = s => { s = ((s % L) + L) % L; for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; } return pts[pts.length - 1]; };
    return { L, at: atS, d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') };
  }
  // distance travelled by time t for a piecewise-constant speed plan [[tStart, speed], ...]
  function lpDist(t, plan) {
    let d = 0;
    for (let i = 0; i < plan.length; i++) {
      const a = plan[i][0], b = i + 1 < plan.length ? plan[i + 1][0] : 1e9;
      if (t <= a) break;
      d += plan[i][1] * (Math.min(t, b) - a);
    }
    return d;
  }
  // a crowd Eddie: drElectron + Eddie's backwards cap, an arm for waving, and a red "paused" mark
  const CAPD = 'M-70,-46 Q-66,-96 0,-98 Q66,-96 70,-46 Q0,-66 -70,-46 Z M40,-88 Q80,-104 100,-84 Q86,-74 58,-76 Z';
  function lpMini(parent, r, withArm) {
    const g = G(parent);
    const arm = withArm ? E('path', { d: `M${r * 0.75},${r * 0.1} Q${r * 1.5},${-r * 0.2} ${r * 1.55},${-r * 1.15}`, fill: 'none', stroke: '#1F6FB8', 'stroke-width': r * 0.32, 'stroke-linecap': 'round' }, g) : null;
    drElectron(g, r);
    E('path', { d: CAPD, fill: '#FFC247', stroke: INK, 'stroke-width': 9, 'stroke-linejoin': 'round', transform: `scale(${(r / 84).toFixed(3)})` }, g);
    g.arm = arm; g.r = r;
    return g;
  }
  const lpMiniSet = (m, x, y, s, o) => {
    o = o || {};
    op(m, o.v === undefined ? 1 : o.v); tr(m, x, y, s, o.rot || 0);
    if (!m.arm) return;
    op(m.arm, o.arm === undefined ? 0 : 1);
    if (o.arm !== undefined) attr(m.arm, 'transform', `rotate(${o.arm.toFixed(1)} ${(m.r * 0.75).toFixed(1)} ${(m.r * 0.1).toFixed(1)})`);
  };
  // one chip whose text changes (several beats share a slot): g.set(text, colour, stroke)
  function lpDyn(parent, size) {
    const g = G(parent), h = Math.round(size * 1.75);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 2 }, g);
    const tx = T(g, 0, size * 0.35, '', { size, weight: 800, anchor: 'middle' });
    let cur = null;
    g.set = (text, col, st) => {
      if (text !== cur) { cur = text; setText(tx, text); const w = textWidth(text, size, FD, 800) + size * 1.4; attr(box, 'x', -w / 2); attr(box, 'width', w); }
      attr(tx, 'fill', col || C.ink); attr(box, 'stroke', st || C.line);
    };
    return g;
  }
  // one card with up to three rows whose text changes: g.set([[text, size, colour, y], ...], stroke)
  function lpDynCard(parent, w, h) {
    const g = G(parent);
    const box = E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 18, fill: 'rgba(10,27,39,0.94)', stroke: C.energy, 'stroke-width': 4 }, g);
    const rows = [0, 1, 2].map(() => T(g, 0, 0, '', { size: 30, weight: 800, anchor: 'middle' }));
    g.set = (lines, st) => {
      rows.forEach((r, i) => {
        const L = lines[i];
        if (!L) { setText(r, ''); return; }
        if (r.textContent !== L[0]) setText(r, L[0]);
        attr(r, 'font-size', L[1]); attr(r, 'fill', L[2] || C.ink); attr(r, 'y', L[3]);
      });
      attr(box, 'stroke', st || C.energy);
    };
    return g;
  }
  // a crocodile clip, tip at (0, 0) pointing +x
  function lpClip(parent, col) {
    const g = G(parent);
    E('rect', { x: -42, y: -10, width: 36, height: 20, rx: 5, fill: col, stroke: '#C9D3DC', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-6,-9 L12,-3 M-6,9 L12,3', stroke: '#C9D3DC', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // an EDDIE name tag
  function lpTag(parent) {
    const g = G(parent);
    E('rect', { x: -70, y: -30, width: 140, height: 60, rx: 8, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, g);
    E('rect', { x: -70, y: -30, width: 140, height: 14, rx: 6, fill: DR_RED }, g);
    T(g, 0, 22, 'EDDIE', { size: 30, weight: 800, anchor: 'middle', fill: INK });
    return g;
  }

  /* ---------- layers ---------- */
  const cam = G(root);
  const Lsets = G(cam), Lpool = G(cam), Lcast = G(cam), Lfg = G(cam);
  const HUD = G(root);

  /* =================== LAB THREE (Monday) =================== */
  const setLab = G(Lsets); drLab(setLab);
  const labFront = G(Lfg);
  E('rect', { x: 0, y: 560, width: 1200, height: 26, fill: '#2A2F36' }, labFront);
  E('rect', { x: 0, y: 586, width: 1200, height: 164, fill: '#C9B48E' }, labFront);
  E('path', { d: 'M300,586 L300,750 M600,586 L600,750 M900,586 L900,750', stroke: '#A6926C', 'stroke-width': 4 }, labFront);
  // the practice kit: a cell, a bulb in a holder, a red lead and a black lead with crocodile clips
  const kitCell = G(labFront); tr(kitCell, 640, 530);
  E('rect', { x: -94, y: -11, width: 16, height: 22, rx: 4, fill: '#C9D3DC', stroke: INK, 'stroke-width': 3 }, kitCell);
  E('rect', { x: -80, y: -28, width: 160, height: 56, rx: 12, fill: DR_NAVY, stroke: INK, 'stroke-width': 4 }, kitCell);
  E('rect', { x: -80, y: -28, width: 46, height: 56, rx: 10, fill: DR_GOLD, stroke: INK, 'stroke-width': 4 }, kitCell);
  T(kitCell, 24, 10, '1.5 V', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const kitLamp = G(labFront); tr(kitLamp, 940, 544);
  E('rect', { x: -56, y: -14, width: 112, height: 30, rx: 6, fill: '#5A6B7A', stroke: INK, 'stroke-width': 3 }, kitLamp);
  E('rect', { x: -18, y: -40, width: 36, height: 28, rx: 4, fill: '#C9D3DC', stroke: INK, 'stroke-width': 3 }, kitLamp);
  E('circle', { cx: 0, cy: -74, r: 36, fill: '#E6EEF2', stroke: '#7E93A6', 'stroke-width': 4 }, kitLamp);
  E('path', { d: 'M-10,-50 L-10,-74 L-5,-82 L0,-74 L5,-82 L10,-74 L10,-50', fill: 'none', stroke: '#8E9BA8', 'stroke-width': 3 }, kitLamp);
  E('path', { d: 'M-44,0 L-44,0.1 M44,0 L44,0.1', stroke: '#D4AF37', 'stroke-width': 12, 'stroke-linecap': 'round' }, kitLamp);
  [['M740,556 C764,606 700,616 722,650', DR_RED, 722, 650], ['M820,556 C846,612 884,602 862,650', '#2A2F36', 862, 650]].forEach(([d, col, cx, cy]) => {
    E('path', { d, fill: 'none', stroke: col, 'stroke-width': 10, 'stroke-linecap': 'round' }, labFront);
    const c = lpClip(labFront, col); tr(c, cx, cy + 40, 1, 90);
  });
  const cMon = lpChip(HUD, 'MONDAY', { size: 52, fill: DR_RED, stroke: '#FFFFFF', sw: 4 });
  const cRun = lpChip(HUD, 'Practice run 1', { size: 32 });
  const cKCell = lpChip(HUD, 'cell', { size: 32, color: DR_GOLD });
  const cKLamp = lpChip(HUD, 'lamp', { size: 32, color: C.energy });
  const cKWires = lpChip(HUD, 'two wires', { size: 32 });

  /* =================== INSIDE DRAWER 8B =================== */
  const setDrawer = G(Lsets); drDrawer(setDrawer);
  const spot = G(setDrawer);
  E('path', { d: 'M540,-10 L660,-10 L850,610 L350,610 Z', fill: '#FFF3C2', opacity: 0.16 }, spot);
  E('ellipse', { cx: 600, cy: 600, rx: 260, ry: 38, fill: '#FFF3C2', opacity: 0.3 }, spot);
  const ltDim = scLowerThird(HUD, ...DR_LOWER.dimitri);
  const cLampBig = lpChip(HUD, 'lamp', { size: 54, fill: C.energy, color: INK, stroke: '#FFF7C2', sw: 4 });
  const cStar = lpChip(HUD, '★ the star (he says)', { size: 30, color: C.energy });
  const dimSparks = [0, 1].map(i => spark(Lfg, 16, { seed: i }));

  /* =================== CONFESSIONALS =================== */
  const confC = drConf(Lsets, 'cecil');
  const insetD = G(Lsets);
  E('rect', { x: 750, y: 150, width: 330, height: 300, rx: 16, fill: '#4A3020', stroke: '#FFFFFF', 'stroke-width': 6 }, insetD);
  E('ellipse', { cx: 915, cy: 300, rx: 150, ry: 130, fill: glow('#FFE6B0'), opacity: 0.6 }, insetD);
  const insetLbl = lpChip(insetD, 'Dimitri, right now', { size: 26, color: C.muted, weight: 700 }); tr(insetLbl, 915, 490);

  /* =================== THE BENCH (slate) =================== */
  const setSlate = G(Lsets); drBench(setSlate);
  const subWire = G(setSlate), subBench = G(setSlate), subDiag = G(setSlate), subExam = G(setSlate);

  /* --- cut-away of a copper wire in its plastic coat --- */
  E('rect', { x: -40, y: 290, width: 1280, height: 220, rx: 30, fill: '#C8343A', stroke: INK, 'stroke-width': 5 }, subWire);
  E('rect', { x: -40, y: 302, width: 1280, height: 26, fill: '#F07C80', opacity: 0.55 }, subWire);
  E('rect', { x: -40, y: 345, width: 1280, height: 110, fill: linGrad('#F6B26B', '#B5651D', true), stroke: '#7A3E12', 'stroke-width': 4 }, subWire);
  E('path', { d: 'M-40,366 L1240,366 M-40,400 L1240,400 M-40,434 L1240,434', stroke: '#FFD29A', 'stroke-width': 3, opacity: 0.45 }, subWire);
  const coreGlow = E('rect', { x: -40, y: 345, width: 1280, height: 110, fill: '#FFE45C' }, subWire);
  const coatHi = E('rect', { x: -40, y: 288, width: 1280, height: 224, rx: 30, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 10 }, subWire);
  const cCopper = lpChip(HUD, 'copper wire', { size: 32, color: '#F6B26B' });
  const cCoat = lpChip(HUD, 'plastic coat', { size: 30, color: '#FF9A9E' });
  const cElec = lpChip(HUD, 'ELECTRONS', { size: 54, fill: '#1F6FB8', stroke: '#9FD8FF', sw: 4 });
  const cTiny = lpChip(HUD, 'tiny particles · negative charge  −', { size: 32, color: '#9FD8FF' });
  const ltEd = scLowerThird(HUD, ...DR_LOWER.eddie);
  const tags = [lpTag(HUD), lpTag(HUD)];
  const cSame = lpChip(HUD, 'every electron is identical', { size: 32, color: '#9FD8FF' });
  // conductor / insulator
  const cCond = lpCard(HUD, 520, 120, [['CONDUCTOR', 50, C.energy, -2], ['lets current flow ✓', 30, C.good, 40]]);
  const metals = ['copper ✓', 'gold ✓', 'aluminium ✓', 'carbon (graphite) ✓'].map(s => lpChip(HUD, s, { size: 30, color: s.startsWith('carbon') ? C.good : '#F6B26B' }));
  const cIns = lpCard(HUD, 520, 120, [['INSULATOR', 50, '#9FD8FF', -2], ['no current through it ✗', 30, C.bad, 40]]);
  const cKeep = lpChip(HUD, 'the coat keeps the current IN', { size: 30, color: '#9FD8FF' });
  const icons = G(HUD);
  const iconG = [];
  [['plastic', g => { E('path', { d: 'M-14,-48 L14,-48 L14,-36 Q30,-26 30,-6 L30,36 Q30,44 22,44 L-22,44 Q-30,44 -30,36 L-30,-6 Q-30,-26 -14,-36 Z', fill: '#9FD8FF', stroke: INK, 'stroke-width': 3 }, g); }],
   ['rubber', g => { E('rect', { x: -40, y: -22, width: 80, height: 44, rx: 10, fill: '#FF8FB0', stroke: INK, 'stroke-width': 3 }, g); E('rect', { x: -40, y: -22, width: 30, height: 44, rx: 8, fill: '#5EA0E8', stroke: INK, 'stroke-width': 3 }, g); }],
   ['glass', g => { E('path', { d: 'M-30,-44 L30,-44 L22,44 L-22,44 Z', fill: 'rgba(200,230,250,0.35)', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g); }],
   ['wood', g => { E('rect', { x: -46, y: -20, width: 92, height: 40, rx: 4, fill: '#B07A45', stroke: INK, 'stroke-width': 3 }, g); E('path', { d: 'M-38,-6 Q0,-14 38,-4 M-38,8 Q0,2 38,10', fill: 'none', stroke: '#7A4E25', 'stroke-width': 3 }, g); }],
  ].forEach(([name, draw], i) => {
    const g = G(icons); draw(g);
    T(g, 0, 86, name, { size: 28, weight: 800, anchor: 'middle', fill: C.ink });
    E('path', { d: 'M28,-52 L52,-28 M52,-52 L28,-28', stroke: C.bad, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    iconG.push(g);
  });
  const finger = G(Lfg);
  E('path', { d: 'M930,-20 L890,232', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 44 }, finger);
  E('path', { d: 'M888,230 L880,282', fill: 'none', stroke: SKIN, 'stroke-width': 26, 'stroke-linecap': 'round' }, finger);
  E('ellipse', { cx: 890, cy: 232, rx: 30, ry: 22, fill: SKIN, stroke: INK, 'stroke-width': 3 }, finger);
  const cSafe = lpChip(HUD, 'Kavya: safe ✓', { size: 32, color: C.good });

  /* --- the bench circuit: Cecil, Dimitri, a red lead and a black lead --- */
  const CEC = [330, 440], DIM = [870, 410], KS = 0.62;
  const RED_PTS = [[330, 354], [330, 230], [1040, 230], [1040, 470], [896, 470]];
  const BLK_ON = [[870, 496], [870, 620], [330, 620], [330, 515]], BLK_OFF = [[870, 496], [870, 620], [430, 620], [392, 646]];
  const E_PATH = lpPoly([[330, 515], [330, 620], [870, 620], [870, 496], [896, 470], [1040, 470], [1040, 230], [330, 230], [330, 354], [330, 515]]);
  const RED_PATH = lpPoly(RED_PTS);
  const cecOutline = E('rect', { x: 290, y: 352, width: 80, height: 164, rx: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-dasharray': '10 8', opacity: 0.7 }, subBench);
  const leadRedO = E('path', { d: '', fill: 'none', stroke: '#0B1218', 'stroke-width': 15, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, subBench);
  const leadRed = E('path', { d: '', fill: 'none', stroke: DR_RED, 'stroke-width': 9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, subBench);
  const leadBlkO = E('path', { d: '', fill: 'none', stroke: '#8E9BA8', 'stroke-width': 14, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, subBench);
  const leadBlk = E('path', { d: '', fill: 'none', stroke: '#14191E', 'stroke-width': 8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, subBench);
  const clipRed = lpClip(subBench, DR_RED), clipBlk = lpClip(subBench, '#14191E');
  const pump = G(subBench), pumpRod = G(pump);
  E('line', { x1: 0, y1: -40, x2: 0, y2: -96, stroke: '#C9D3DC', 'stroke-width': 7 }, pumpRod);
  E('rect', { x: -36, y: -106, width: 72, height: 18, rx: 9, fill: '#2A2F36', stroke: '#C9D3DC', 'stroke-width': 3 }, pumpRod);
  E('rect', { x: -15, y: -44, width: 30, height: 108, rx: 7, fill: '#3F7BE0', stroke: INK, 'stroke-width': 3 }, pump);
  E('rect', { x: -38, y: 60, width: 76, height: 14, rx: 5, fill: '#5A6B7A', stroke: INK, 'stroke-width': 3 }, pump);
  const gapRing = E('ellipse', { cx: 356, cy: 578, rx: 76, ry: 92, fill: 'none', stroke: DR_RED, 'stroke-width': 7 }, subBench);
  const gapLbl = lpChip(subBench, 'GAP', { size: 40, fill: DR_RED, stroke: '#FFFFFF', sw: 3 }); tr(gapLbl, 500, 692);
  const rays = E('path', { d: (() => { let d = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + 0.3; d += `M${(Math.cos(a) * 82).toFixed(1)},${(Math.sin(a) * 82).toFixed(1)} L${(Math.cos(a) * 140).toFixed(1)},${(Math.sin(a) * 140).toFixed(1)} `; } return d; })(), stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round' }, subBench);
  const eSparks = [0, 1, 2].map(i => spark(subBench, 15, { seed: i + 3 }));
  const topChip = lpDyn(HUD, 32), midCard = lpDynCard(HUD, 404, 170);
  const frzMarks = E('path', { d: '', stroke: DR_RED, 'stroke-width': 6, 'stroke-linecap': 'round' }, Lpool);
  const cNotUsed = lpChip(HUD, 'current is NOT used up', { size: 34, color: C.good });
  const hand = G(Lfg);
  const handSleeve = E('path', { d: '', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 46 }, hand);
  const handArm = E('path', { d: '', fill: 'none', stroke: SKIN, 'stroke-width': 28, 'stroke-linecap': 'round' }, hand);
  const handPalm = G(hand);
  E('ellipse', { rx: 26, ry: 22, fill: SKIN, stroke: INK, 'stroke-width': 3 }, handPalm);
  E('path', { d: 'M-16,-12 Q-30,-30 -14,-34 Q-4,-28 -2,-16', fill: SKIN, stroke: INK, 'stroke-width': 3 }, handPalm);
  const lpHand = (x, y, v, bx) => {
    op(hand, v); if (v <= 0) return;
    const ox = bx === undefined ? x + 80 : bx, oy = 800;
    attr(handArm, 'd', `M${ox.toFixed(1)},${oy} L${x.toFixed(1)},${y.toFixed(1)}`);
    attr(handSleeve, 'd', `M${ox.toFixed(1)},${oy} L${lerp(ox, x, 0.35).toFixed(1)},${lerp(oy, y, 0.35).toFixed(1)}`);
    tr(handPalm, x, y);
  };

  /* --- circuit diagram: conventional current vs electrons --- */
  const dCell = cellSym(subDiag); tr(dCell, 600, 250, 1.2);
  const dLamp = bulbSym(subDiag); tr(dLamp, 600, 560, 1.2); dLamp.set(1);
  const wA = wire(subDiag, [[550, 250], [300, 250], [300, 560], [545, 560]], { spacing: 88, dot: 7 });
  const wB = wire(subDiag, [[655, 560], [900, 560], [900, 250], [650, 250]], { spacing: 88, dot: 7 });
  subDiag.insertBefore(wA, dCell); subDiag.insertBefore(wB, dCell);
  const goldArr = G(subDiag), blueArr = G(subDiag);
  [[480, 192, 180], [244, 340, 90], [380, 618, 0], [956, 470, -90]].forEach(([x, y, r]) => { const a = drArrowCurrent(goldArr, 110, { color: DR_GOLD }); tr(a, x, y, 1, r); });
  [[690, 304, 0], [846, 340, 90], [510, 506, 180], [354, 470, -90]].forEach(([x, y, r]) => { const a = drArrowCurrent(blueArr, 100, { color: '#5EC8FF' }); tr(a, x, y, 0.9, r); });
  const D_PATH = lpPoly([[650, 250], [900, 250], [900, 560], [655, 560], [545, 560], [300, 560], [300, 250], [550, 250], [650, 250]]);
  const cConv = lpChip(HUD, 'conventional current: + → −', { size: 34, color: DR_GOLD, stroke: DR_GOLD });
  const cElDir = lpChip(HUD, 'electrons really go: − → +', { size: 34, color: '#5EC8FF', stroke: '#5EC8FF' });

  /* --- exam paper --- */
  const paper = G(subExam); tr(paper, 470, 405, 1, -2);
  E('rect', { x: -275, y: -225, width: 550, height: 450, rx: 10, fill: '#FFFFFF', stroke: INK, 'stroke-width': 4 }, paper);
  E('rect', { x: -275, y: -225, width: 550, height: 54, rx: 10, fill: '#3A4752' }, paper);
  T(paper, -250, -188, 'EXAM · Question 3', { size: 28, weight: 800, fill: '#FFFFFF' });
  T(paper, -250, -132, 'Show the direction of the current.', { size: 26, weight: 700, fill: INK, font: FB });
  E('path', { d: 'M-60,-50 L-150,-50 L-150,150 L-60,150 M60,150 L150,150 L150,-50 L60,-50', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, paper);
  tr(drSym(paper, 'cell', { w: 5 }), 0, -50);
  tr(drSym(paper, 'lamp', { w: 5 }), 0, 150);
  const exA1 = arrow(paper, -186, -20, -186, 110, { color: DR_GOLD, width: 9, head: 26 });
  const exA2 = arrow(paper, 186, 110, 186, -20, { color: DR_GOLD, width: 9, head: 26 });
  const exTick = tick(paper, 46); tr(exTick, 215, 172);
  const cExam = lpChip(HUD, 'arrows: + → −', { size: 36, color: DR_GOLD, stroke: DR_GOLD });
  const cConsist = lpChip(HUD, 'just be consistent', { size: 34, color: C.good });

  /* --- the rubber band photo (callback to the cold open) --- */
  const photo = G(HUD);
  E('rect', { x: -210, y: -150, width: 420, height: 300, rx: 8, fill: '#C9A24A', stroke: '#6B4E12', 'stroke-width': 6 }, photo);
  E('rect', { x: -186, y: -126, width: 372, height: 214, fill: '#22303A' }, photo);
  tr(drSym(photo, 'cell', { color: '#FFFFFF', w: 5 }), -90, -60, 0.9);
  tr(drSym(photo, 'lamp', { color: '#FFFFFF', w: 5 }), 90, -60, 0.9);
  E('path', { d: 'M-144,-60 Q-176,40 0,44 Q176,40 144,-60', fill: 'none', stroke: '#FF8FB0', 'stroke-width': 9, 'stroke-linecap': 'round' }, photo);
  T(photo, 0, 26, 'rubber band', { size: 26, weight: 700, anchor: 'middle', fill: '#FF8FB0', font: FB });
  const pX = cross(photo, 70); tr(pX, 0, -20);
  T(photo, 0, 128, 'LAST YEAR', { size: 30, weight: 800, anchor: 'middle', fill: '#3A2A10' });
  const cIns2 = lpChip(HUD, 'rubber = insulator', { size: 30, color: '#9FD8FF' });

  /* --- 1750s book, 1897 newspaper, sticky note --- */
  const book = G(HUD);
  E('rect', { x: -150, y: -110, width: 300, height: 220, rx: 10, fill: '#6B3A1E', stroke: '#3A1E0E', 'stroke-width': 5 }, book);
  E('rect', { x: -150, y: -110, width: 30, height: 220, rx: 6, fill: '#4E2A14' }, book);
  E('rect', { x: -100, y: -86, width: 226, height: 120, rx: 6, fill: 'none', stroke: DR_GOLD, 'stroke-width': 3 }, book);
  T(book, 13, -38, 'ELECTRICITY', { size: 32, weight: 800, anchor: 'middle', fill: DR_GOLD });
  T(book, 13, 6, 'the 1750s', { size: 28, weight: 700, anchor: 'middle', fill: '#F2D7A0' });
  T(book, 13, 82, '+ → −', { size: 40, weight: 800, anchor: 'middle', fill: DR_GOLD });
  { const r = rng(1750); let d = ''; for (let i = 0; i < 22; i++) d += `M${(-130 + r() * 270).toFixed(0)},${(-100 + r() * 200).toFixed(0)} h3 v3 h-3 Z `; E('path', { d, fill: '#C9BFA6', opacity: 0.7 }, book); }
  const news = G(HUD);
  E('rect', { x: -190, y: -110, width: 380, height: 220, rx: 4, fill: '#F4EEDC', stroke: '#8A7A5A', 'stroke-width': 4 }, news);
  T(news, 0, -70, 'THE DAILY SPARK · 1897', { size: 26, weight: 800, anchor: 'middle', fill: '#3A2A10', font: FB });
  E('path', { d: 'M-170,-56 L170,-56', stroke: '#3A2A10', 'stroke-width': 3 }, news);
  T(news, 0, -12, 'ELECTRON', { size: 46, weight: 800, anchor: 'middle', fill: INK });
  T(news, 0, 38, 'DISCOVERED!', { size: 46, weight: 800, anchor: 'middle', fill: INK });
  E('path', { d: 'M-170,64 L-10,64 M10,64 L170,64 M-170,82 L-10,82 M10,82 L170,82', stroke: '#B8AC90', 'stroke-width': 5 }, news);
  const sticky = G(HUD);
  E('rect', { x: -110, y: -58, width: 220, height: 116, fill: '#FFE45C', stroke: '#C9A92A', 'stroke-width': 3 }, sticky);
  T(sticky, 0, -8, 'too late', { size: 32, weight: 800, anchor: 'middle', fill: INK });
  T(sticky, 0, 34, 'to change', { size: 32, weight: 800, anchor: 'middle', fill: DR_RED });

  /* --- Eddie's textbooks, arrows all the other way --- */
  const books = G(HUD);
  [['#2E7DD8', -10], ['#56A86B', 6], ['#C2453A', -4]].forEach(([col, dx], i) => {
    const b = G(books); tr(b, dx, -i * 64);
    E('rect', { x: -150, y: -30, width: 300, height: 58, rx: 6, fill: col, stroke: INK, 'stroke-width': 4 }, b);
    E('path', { d: 'M-60,0 L70,0 M70,0 L50,-14 M70,0 L50,14', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, b);
    T(b, -106, 10, '+', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(b, 112, 10, '−', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  });
  const cBooks = lpChip(HUD, 'every textbook: + → −', { size: 30, color: DR_GOLD });

  /* =================== THE CROWD OF EDDIES (shared by every shot) =================== */
  const POOL = []; for (let i = 0; i < 14; i++) POOL.push(lpMini(Lpool, 16, i < 10));
  const cr = rng(812);
  const CORE = POOL.map((m, i) => [80 + i * 94 + (cr() - 0.5) * 22, 400 + (i % 2 ? -24 : 24) + (cr() - 0.5) * 12, cr() * TAU]);

  /* =================== THE CAST =================== */
  const ringE = E('circle', { r: 46, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, Lcast);
  const eddie = cast(Lcast, 'eddie');
  const cecil = cast(Lcast, 'cecil');
  const dimitri = cast(Lcast, 'dimitri');
  const kav = cast(Lcast, 'kavya');

  /* cut points */
  const clickT = at('shine') - 0.25;
  const SH = [
    ['mon', -1e9], ['dim', at('dimitri') - 0.1], ['thd', at('thdimitri') - 0.1],
    ['wire', at('eddies') - 0.1], ['cecP', end('eddie') + 0.06], ['cur', at('current') - 0.1],
    ['one', at('oneway') - 0.1], ['noth', at('nothing') - 0.1], ['gap', at('gap') - 0.1],
    ['back', end('shine') + 0.25], ['copper', at('copper') - 0.1], ['hence', at('hence') - 0.1],
    ['arrows', at('arrows') - 0.1], ['why', at('why') - 0.1], ['thed', at('theddie') - 0.1], ['exam', at('exam') - 0.1],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][0 + 1]) k = i; return SH[k][0]; };
  const BENCH = ['cur', 'one', 'noth', 'gap', 'back'], WIRE = ['wire', 'copper'];
  // electron drift round the bench loop: moving (demo), stopped when Cecil steps out, moving again after the click
  const stepT = mid('pump', 0.6);
  const benchPlan = [[at('current') - 0.1, 85], [stepT, 0], [clickT, 110]];

  const ALL_HUD = [cMon, cRun, cKCell, cKLamp, cKWires, cLampBig, cStar, cCopper, cCoat, cElec, cTiny, cSame, cCond, cIns, cKeep, icons, cSafe,
    topChip, midCard, cNotUsed, cConv, cElDir, cExam, cConsist, photo, cIns2, book, news, sticky, books, cBooks, ...tags, ...metals];

  return t => {
    const sid = shotAt(t);
    const pose = {};
    let k = 1, fx = 600, fy = 375, sx = 600, sy = 375;
    ALL_HUD.forEach(h => op(h, 0));
    ltDim.set(0); ltEd.set(0);
    POOL.forEach(m => op(m, 0));
    dimSparks.forEach(s => op(s, 0));
    op(finger, 0); op(hand, 0); op(frzMarks, 0);

    const isBench = BENCH.includes(sid), isWire = WIRE.includes(sid);
    op(setLab, sid === 'mon' ? 1 : 0); op(labFront, sid === 'mon' ? 1 : 0);
    op(setDrawer, sid === 'dim' || sid === 'cecP' ? 1 : 0); op(spot, sid === 'dim' ? 1 : 0);
    confC.set(sid === 'thd' || sid === 'hence' || sid === 'why' || sid === 'thed' ? 1 : 0, t); attr(confC.firstChild, 'fill', linGrad(...(sid === 'thed' ? DR_TINT.eddie : DR_TINT.cecil), true)); op(insetD, sid === 'thd' ? 1 : 0);
    
    op(setSlate, isBench || isWire || sid === 'arrows' || sid === 'exam' ? 1 : 0);
    op(subWire, isWire ? 1 : 0); op(subBench, isBench ? 1 : 0); op(subDiag, sid === 'arrows' ? 1 : 0); op(subExam, sid === 'exam' ? 1 : 0);

    /* ---------- MONDAY: the lab and the kit ---------- */
    if (sid === 'mon') {
      k = 1 + 0.04 * P(t, at('monday'), 4.5, linear); fx = 640; fy = 470; sx = 640; sy = 470;
      pose.kav = { x: 300, y: 445, s: 1.2, mood: t > mid('monday', 0.8) ? 'smug' : 'neutral', look: t > mid('monday', 0.3) ? 0.8 : 0 };
      lpPop(cMon, 880, 168, P(t, at('monday') - 0.05, 0.45, pop), 1, -2);
      lpPop(cRun, 880, 250, P(t, mid('monday', 0.22), 0.4, pop));
      lpPop(cKCell, 640, 452, P(t, mid('monday', 0.5), 0.4, pop));
      lpPop(cKLamp, 940, 398, P(t, mid('monday', 0.66), 0.4, pop));
      lpPop(cKWires, 560, 668, P(t, mid('monday', 0.82), 0.4, pop));
    }

    /* ---------- DIMITRI rises into the spotlight ---------- */
    if (sid === 'dim') {
      const rise = P(t, at('dimitri') - 0.1, 0.6, easeOut);
      pose.dimitri = { x: 600, y: lerp(560, 395, rise), s: 1.2, mood: 'smug', look: 0, glow: P(t, at('dimitri') + 0.1, 0.4, linear) };
      pose.cecil = { x: 1030, y: 470, s: 0.72, mood: 'deadpan', look: -1 };
      ltDim.set(win(t, at('dimitri') + 0.15, at('dimitri') + 3.3, 0.25));
      lpPop(cLampBig, 330, 220, P(t, mid('dimitri', 0.3), 0.4, pop), 1, 3);
      lpPop(cStar, 330, 300, P(t, mid('dimitri', 0.62), 0.4, pop));
      dimSparks.forEach((s, i) => { const q = P(t, mid('dimitri', 0.55) + i * 0.15, 0.4, pop); op(s, clamp(q * 2)); tr(s, [735, 480][i], [235, 470][i], Math.max(0.01, q)); s.upd(t); });
    }

    /* ---------- Cecil's confessional: Dimitri thinks the circuit exists for him ---------- */
    if (sid === 'thd') {
      k = 1 + 0.12 * P(t, end('thdimitri') - 0.1, 0.9); fx = 430; fy = 360; sx = 430; sy = 360;
      pose.cecil = { x: 430, y: 410, s: 1.45, mood: t > mid('thdimitri', 0.55) && t < mid('thdimitri', 0.7) ? 'neutral' : 'deadpan', look: t > mid('thdimitri', 0.3) && t < mid('thdimitri', 0.55) ? 0.8 : 0 };
      const ip = P(t, mid('thdimitri', 0.25), 0.35, pop);
      op(insetD, clamp(ip * 2.5));
      pose.dimitri = { x: 915, y: 315, s: 0.62 * Math.max(0.01, 0.7 + 0.3 * ip), mood: 'smug', look: 0, glow: 1, v: clamp(ip * 2.5) };
    }

    /* ---------- the wire: electrons, Eddie, conductors, insulators ---------- */
    if (isWire) {
      const flow = sid === 'copper' ? (t < at('plastic') - 0.1 ? 90 * Math.max(0, t - mid('copper', 0.5)) : 90 * Math.max(0, at('plastic') - 0.1 - mid('copper', 0.5)) + 70 * (t - at('plastic') + 0.1)) : 0;
      const hop = sid === 'wire' && t > mid('eddie', 0.66) && t < mid('eddie', 0.86);
      CORE.forEach(([x0, y0, ph], i) => {
        if (i >= 12) return;
        let x = x0 + 3 * Math.sin(t * 5 + ph) * AMP, y = y0 + 3 * Math.cos(t * 4.3 + ph) * AMP;
        if (flow) { x = ((x0 + flow) % 1300 + 1300) % 1300 - 50; y = y0 + 2 * Math.sin(t * 3 + ph) * AMP; }
        if (hop) y -= Math.abs(Math.sin(t * 9 + i)) * 16 * AMP;
        let s = 1, arm;
        if (sid === 'wire' && i < 10) {          // "It saves time": ten Eddies line up and wave
          const q = P(t, mid('eddie', 0.84) + i * 0.03, 0.45, easeOut);
          if (q > 0) { x = lerp(x, 150 + i * 100, q); y = lerp(y, 618, q); s = lerp(1, 1.8, q); arm = q > 0.5 ? -30 + 30 * Math.sin(t * 10 + i * 0.4) * AMP : undefined; }
        }
        lpMiniSet(POOL[i], x, y, s, { arm });
      });
      if (sid === 'wire') {
        // the narrator: electrons in the copper wire
        lpPop(cCopper, 260, 228, P(t, mid('eddies', 0.08), 0.4, pop) * (1 - P(t, at('eddie') - 0.1, 0.2, linear)));
        lpPop(cCoat, 1000, 560, P(t, mid('eddies', 0.18), 0.4, pop) * (1 - P(t, at('eddie') - 0.1, 0.2, linear)));
        lpPop(cElec, 760, 214, P(t, mid('eddies', 0.4), 0.45, pop) * (1 - P(t, at('eddie') - 0.1, 0.2, linear)), 1, -2);
        lpPop(cTiny, 560, 608, P(t, mid('eddies', 0.6), 0.4, pop) * (1 - P(t, at('eddie') - 0.1, 0.2, linear)));
        // Eddie pops up in the wire
        if (t >= at('eddie') - 0.08) {
          const pe = P(t, at('eddie') - 0.08, 0.45, pop);
          pose.eddie = { x: 600, y: 400 - 30 * (1 - clamp(pe)), s: 1.15 * Math.max(0.01, 0.6 + 0.4 * pe), mood: 'happy', look: t > mid('eddie', 0.3) && t < mid('eddie', 0.62) ? (t < mid('eddie', 0.48) ? -1 : 1) : 0 };
          ltEd.set(win(t, at('eddie') + 0.1, at('eddie') + 3.0, 0.25));
          [[12, 300, 0.36], [13, 900, 0.54]].forEach(([i, x, f], j) => {
            const q = P(t, mid('eddie', f), 0.4, pop);
            if (q <= 0) return;
            const y = 400 + 4 * Math.sin(t * 3 + j) * AMP;
            lpMiniSet(POOL[i], x, y, 2.9 * Math.max(0.01, q), { v: clamp(q * 2.5) });
            lpPop(tags[j], x, 296, q);
          });
          lpPop(cSame, 600, 200, P(t, mid('eddie', 0.68), 0.4, pop));
        }
      }
      if (sid === 'copper' && t < at('plastic') - 0.1) {
        op(coreGlow, 0.15 + 0.25 * P(t, mid('copper', 0.35), 0.4, linear) * (0.7 + 0.3 * Math.sin(t * 6))); op(coatHi, 0);
        const pc = P(t, mid('copper', 0.34), 0.45, pop); lpPop(cCond, 600, 196, pc);
        [0.18, 0.46, 0.6, 0.86].forEach((f, i) => lpPop(metals[i], [175, 410, 660, 960][i], 610, P(t, mid('copper', f), 0.4, pop)));
      } else if (sid === 'copper') {
        // insulators
        op(coreGlow, 0);
        op(coatHi, P(t, mid('plastic', 0.08), 0.4, linear) * (0.65 + 0.35 * Math.sin(t * 5)));
        lpPop(cIns, 600, 196, P(t, mid('plastic', 0.1), 0.45, pop) * (1 - P(t, mid('plastic', 0.56), 0.2, linear)));
        lpPop(cKeep, 560, 196, P(t, mid('plastic', 0.58), 0.4, pop));
        op(icons, 1);
        iconG.forEach((g, i) => lpPop(g, [210, 420, 630, 840][i], 600, P(t, mid('plastic', [0.04, 0.27, 0.34, 0.41][i]), 0.4, pop)));
        const fp = P(t, mid('plastic', 0.78), 0.5, easeOut);
        op(finger, fp > 0 ? 1 : 0); tr(finger, 0, -300 * (1 - fp));
        lpPop(cSafe, 1040, 196, P(t, mid('plastic', 0.86), 0.4, pop));
      } else { op(coreGlow, 0); op(coatHi, 0); }
    }

    /* ---------- Cecil, deadpan (after "It saves time") ---------- */
    if (sid === 'cecP') {
      k = 1 + 0.12 * P(t, end('eddie') + 0.06, 0.8); fx = 600; fy = 360; sx = 600; sy = 360;
      pose.cecil = { x: 600, y: 420, s: 1.45, mood: 'deadpan', look: 0 };
    }

    /* ---------- THE BENCH CIRCUIT ---------- */
    if (isBench) {
      // where is Cecil? (he steps out of the circuit during "They're in the wire already")
      const out = sid === 'cur' ? P(t, stepT, 0.5) : 0;
      const cx = lerp(CEC[0], 175, out), cy = CEC[1] + 8 * Math.sin(Math.PI * out);
      op(cecOutline, out);
      // the leads
      const redP = sid === 'one' ? P(t, mid('oneway', 0.12), 0.4, easeIn) : 1;
      const redPts = RED_PTS.map((p, i) => i === RED_PTS.length - 1 ? [lerp(960, p[0], redP), lerp(540, p[1], redP)] : p);
      if (sid === 'one' && redP < 1) redPts[3] = [lerp(1040, 1010, 1 - redP), lerp(470, 520, 1 - redP)];
      const blkC = sid === 'cur' ? 1 : sid === 'back' ? 1 : P(t, clickT - 0.4, 0.4, easeIn);
      const blkPts = BLK_ON.map((p, i) => [lerp(BLK_OFF[i][0], p[0], blkC), lerp(BLK_OFF[i][1], p[1], blkC)]);
      const dR = lpPoly(redPts).d, dB = lpPoly(blkPts).d;
      attr(leadRedO, 'd', dR); attr(leadRed, 'd', dR); attr(leadBlkO, 'd', dB); attr(leadBlk, 'd', dB);
      const angOf = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      const rN = redPts.length; tr(clipRed, redPts[rN - 1][0], redPts[rN - 1][1], 1, angOf(redPts[rN - 2], redPts[rN - 1]));
      tr(clipBlk, blkPts[3][0], blkPts[3][1], 1, angOf(blkPts[2], blkPts[3]));
      // is the loop complete? (current flows only then)
      const closed = (sid === 'cur' && t < stepT) || t >= clickT;
      // Eddies round the loop
      const dist = lpDist(t, benchPlan);
      const frz = sid === 'gap' && t < clickT ? P(t, mid('gap', 0.74), 0.2, linear) : 0;
      let fd = '';
      POOL.forEach((m, i) => {
        const s = ((i * E_PATH.L / POOL.length + dist) % E_PATH.L + E_PATH.L) % E_PATH.L;
        if (s > E_PATH.L - 165) return;                                  // inside Cecil
        if (blkC < 1 && s < 205) return;                                  // that part of the black lead is not there
        const [x, y] = E_PATH.at(s);
        const jig = closed ? 0 : 1.8 * Math.sin(t * 7 + i * 1.7) * AMP;
        lpMiniSet(m, x + jig, y, 1.2);
        if (frz > 0) fd += `M${(x - 7).toFixed(1)},${(y - 46).toFixed(1)} l0,15 M${(x + 7).toFixed(1)},${(y - 46).toFixed(1)} l0,15 `;
      });
      attr(frzMarks, 'd', fd); op(frzMarks, frz);
      // the pump
      const pumpOn = sid === 'cur' && t >= at('pump') - 0.1 ? 1 : 0;
      op(pump, pumpOn); tr(pump, cx - 98, cy + 12, 0.85);
      tr(pumpRod, 0, pumpOn && t < stepT ? 30 * Math.abs(Math.sin(t * TAU * 0.9)) * AMP : 0);
      // gap marker
      const gv = sid === 'noth' ? P(t, mid('nothing', 0.45), 0.3, linear) : sid === 'gap' ? 1 - P(t, clickT, 0.25, linear) : 0;
      const flash = sid === 'gap' && t > mid('gap', 0.6) && t < clickT ? 0.55 + 0.45 * Math.sin(t * 14) : 1;
      op(gapRing, gv * flash); op(gapLbl, gv);
      // click
      const cq = (t - clickT) / 0.5, clickFx = eSparks[0];
      // hand: clips the red lead (oneway) or the black lead (the click)
      if (sid === 'one') { const hv = 1 - P(t, mid('oneway', 0.45), 0.35, linear); const rp = redPts[rN - 1]; lpHand(rp[0] + 50, rp[1] + 8, hv, rp[0] + 150); }
      if (sid === 'gap') { const hv = P(t, clickT - 0.75, 0.25, linear) * (1 - P(t, clickT + 0.45, 0.35, linear)); lpHand(blkPts[3][0], blkPts[3][1] + 50, hv, blkPts[3][0] + 90); }
      // energy sparks: cell -> lamp along the red lead, then light rays
      const eOn = sid === 'back' && t >= at('energy') - 0.1;
      eSparks.forEach((sp, i) => {
        if (i === 0 && cq > 0 && cq < 1) { op(clickFx, 1 - cq); tr(clickFx, 330, 520, 1.2 + 2.4 * cq); clickFx.upd(t); return; }
        if (!eOn) { op(sp, 0); return; }
        const q = ((t - mid('energy', 0.12)) * 0.6 + i / 3);
        if (q < 0 || t < mid('energy', 0.12)) { op(sp, 0); return; }
        const [x, y] = RED_PATH.at((q % 1) * RED_PATH.L);
        op(sp, Math.sin(Math.PI * (q % 1))); tr(sp, x, y); sp.upd(t);
      });
      const rv = eOn ? P(t, mid('energy', 0.5), 0.4, linear) : 0;
      op(rays, rv); if (rv > 0) tr(rays, DIM[0], DIM[1] - 21, 1 + 0.12 * wave(t, 0.8) * AMP);

      // characters in the circuit
      const lit = closed ? 1 : 0;
      pose.cecil = { x: cx, y: cy, s: KS, mood: 'deadpan', look: out > 0.5 ? 1 : 0.6 };
      pose.dimitri = { x: DIM[0], y: DIM[1], s: KS, mood: lit ? (t >= clickT ? 'happy' : 'smug') : 'deadpan', look: -0.6, glow: sid === 'cur' ? 1 - P(t, stepT, 0.3, linear) : P(t, clickT, 0.2, linear) };
      if (sid === 'noth') {
        k = lerp(1.1, 1.3, P(t, at('nothing') - 0.1, end('nothing') + 0.6 - at('nothing'), linear)); fx = 870; fy = 430; sx = 820; sy = 390;
        pose.dimitri.mood = 'deadpan'; pose.dimitri.look = 0;
      }
      if (sid === 'cur' && t >= stepT) pose.dimitri.mood = 'sad';
      if (sid === 'gap' && t < clickT) { pose.dimitri.mood = 'deadpan'; pose.dimitri.look = -1; pose.cecil.look = 0.3; }
      if (sid === 'gap' && t >= clickT) { pose.dimitri.mood = t < at('shine') + 0.1 ? 'shock' : 'happy'; pose.dimitri.look = 0; k = 1 + 0.025 * Math.max(0, 1 - (t - clickT) * 3); }
      if (sid === 'back' && t >= at('energy') - 0.1) { pose.dimitri.mood = 'smug'; pose.cecil.look = 0.5; }
      // Kavya peeks in from the bottom right while she builds it
      if (sid === 'one' || sid === 'gap') {
        const kp = sid === 'one' ? P(t, at('oneway') - 0.1, 0.35, easeOut) : 1;
        const kMood = sid === 'one' ? (t > mid('oneway', 0.62) ? 'happy' : 'neutral') : t >= clickT ? 'smug' : 'deadpan';
        pose.kav = { x: 1092, y: lerp(820, 704, kp), s: 0.86, mood: kMood, look: sid === 'one' && t > mid('oneway', 0.62) ? 0 : -1 };
      }
      // the tracked Eddie: all the way round and back into Cecil
      if (sid === 'back' && t < at('energy') - 0.1) {
        const u = P(t, at('back') - 0.05, end('back') - 0.2 - at('back'), linear);
        const [ex, ey] = E_PATH.at(u * E_PATH.L);
        if (u < 0.985) pose.eddie = { x: ex, y: ey - 4, s: 0.3, mood: 'happy', look: 0, ring: 1 };
      }

      // overlays
      const top = (text, col, st, t0) => { topChip.set(text, col, st); lpPop(topChip, 690, 150, P(t, t0, 0.4, pop)); };
      const card = (lines, st, t0) => { midCard.set(lines, st); lpPop(midCard, 610, 420, P(t, t0, 0.45, pop)); };
      if (sid === 'cur') {
        if (t < at('pump') - 0.1) card([['ELECTRIC CURRENT', 36, C.energy, -32], ['= the flow of charge', 30, C.ink, 12], ['around a circuit', 30, C.ink, 52]], C.energy, mid('current', 0.1));
        else {
          top('the cell PUSHES the charge round', DR_GOLD, C.line, mid('pump', 0.22));
          if (t >= mid('pump', 0.62)) card([['no cell? the Eddies', 30, C.ink, -24], ['are STILL in the wire', 30, '#9FD8FF', 16], ['(just not moving)', 26, C.muted, 56]], '#9FD8FF', mid('pump', 0.66));
        }
      }
      if (sid === 'one') top('one wire: cell → lamp', C.ink, C.line, mid('oneway', 0.3));
      if (sid === 'gap' && t < clickT) {
        card([['Current only flows', 32, C.ink, -28], ['round a', 32, C.ink, 12], ['COMPLETE LOOP', 36, C.energy, 54]], C.energy, mid('gap', 0.18));
        if (t >= mid('gap', 0.68)) top('any gap: it stops EVERYWHERE', '#FF9A9E', '#FF9A9E', mid('gap', 0.7));
      }
      if (sid === 'gap' && t >= clickT) top('loop complete ✓', C.good, C.good, clickT + 0.05);
      if (sid === 'back' && t < at('energy') - 0.1) {
        const c1 = Math.round(100 * P(t, mid('back', 0.05), 0.9, linear)), c2 = Math.round(100 * P(t, mid('back', 0.42), 0.9, linear));
        card([[`OUT of Cecil: ${c1} Eddies`, 32, C.ink, -14], [`BACK to Cecil: ${c2} Eddies`, 32, c2 === 100 ? C.good : C.ink, 34]], '#9FD8FF', mid('back', 0.02));
        lpPop(cNotUsed, 600, 686, P(t, mid('back', 0.62), 0.4, pop));
      }
      if (eOn) top('energy: cell → lamp → light', C.energy, C.energy, mid('energy', 0.1));
    }

    /* ---------- hence, the rubber band incident ---------- */
    if (sid === 'hence') {
      k = 1 + 0.14 * P(t, end('hence') - 0.1, 1.0); fx = 400; fy = 360; sx = 400; sy = 360;
      pose.cecil = { x: 380, y: 410, s: 1.45, mood: 'deadpan', look: t < mid('hence', 0.5) ? 0.8 : 0 };
      lpPop(photo, 860, 320, P(t, at('hence') + 0.05, 0.45, pop), 1, -3);
      lpPop(cIns2, 860, 545, P(t, mid('hence', 0.6), 0.4, pop));
    }

    /* ---------- the diagram: conventional current vs electrons ---------- */
    if (sid === 'arrows') {
      const isMinus = t >= at('minus') - 0.1;
      wA.set(isMinus ? 0 : 1); wB.set(isMinus ? 0 : 1);
      wA.upd(t, 55); wB.upd(t, 55);
      op(goldArr, P(t, mid('arrows', 0.12), 0.4, linear));
      lpPop(cConv, 600, 136, P(t, mid('arrows', 0.62), 0.45, pop));
      op(blueArr, isMinus ? P(t, mid('minus', 0.3), 0.4, linear) : 0);
      if (isMinus) {
        const pe = P(t, at('minus') - 0.1, 0.4, pop);
        pose.eddie = { x: 1080, y: 612, s: 0.56 * Math.max(0.01, 0.6 + 0.4 * pe), mood: 'happy', look: -1 };
        lpPop(cElDir, 600, 690, P(t, mid('minus', 0.3), 0.45, pop));
        const d = 70 * Math.max(0, t - at('minus') + 0.1);
        POOL.forEach((m, i) => {
          if (i >= 12) return;
          const s = ((i * D_PATH.L / 12 + d) % D_PATH.L);
          const [x, y] = D_PATH.at(s);
          if (s > D_PATH.L - 105) return;                       // through the cell
          if (Math.abs(x - 600) < 32 && Math.abs(y - 560) < 6) return;   // through the lamp
          lpMiniSet(m, x, y, 1.05, { v: P(t, at('minus'), 0.3, linear) });
        });
      }
    }

    /* ---------- why: the 1750s book and the 1897 newspaper ---------- */
    if (sid === 'why') {
      pose.cecil = { x: 290, y: 420, s: 1.3, mood: 'deadpan', look: t > mid('why', 0.1) ? 1 : 0 };
      lpPop(book, 790, 270, P(t, mid('why', 0.06), 0.45, pop), 1, -4);
      lpPop(news, 850, 535, P(t, mid('why', 0.42), 0.45, pop), 1, 4);
      lpPop(sticky, 930, 170, P(t, mid('why', 0.86), 0.35, pop), 1, 8);
    }

    /* ---------- Eddie's confessional ---------- */
    if (sid === 'thed') {
      k = 1 + 0.12 * P(t, end('theddie') - 0.1, 1.0); fx = 400; fy = 380; sx = 400; sy = 380;
      const back = t > end('theddie') + 0.15;
      pose.eddie = { x: 390, y: 410 - (back ? Math.abs(Math.sin((t - end('theddie')) * 9)) * 18 * AMP : 0), s: 1.4, mood: back ? 'happy' : t > mid('theddie', 0.7) ? 'annoyed' : 'sad', look: !back && t > mid('theddie', 0.15) && t < mid('theddie', 0.6) ? 1 : 0 };
      lpPop(books, 880, 560, P(t, mid('theddie', 0.12), 0.45, pop));
      lpPop(cBooks, 880, 330, P(t, mid('theddie', 0.3), 0.4, pop));
    }

    /* ---------- the exam ---------- */
    if (sid === 'exam') {
      k = 1 + 0.05 * P(t, at('exam'), 6, linear);
      pose.cecil = { x: 1015, y: 470, s: 0.95, mood: 'deadpan', look: t < mid('exam', 0.7) ? -1 : 0 };
      lpPop(paper, 470, 405, P(t, at('exam') - 0.1, 0.45, pop), 1, -2);
      exA1.set(P(t, mid('exam', 0.3), 0.5)); exA2.set(P(t, mid('exam', 0.42), 0.5));
      op(exA1, P(t, mid('exam', 0.3), 0.1, linear)); op(exA2, P(t, mid('exam', 0.42), 0.1, linear));
      lpPop(exTick, 215, 172, P(t, mid('exam', 0.62), 0.35, pop));
      lpPop(cExam, 1000, 220, P(t, mid('exam', 0.5), 0.4, pop));
      lpPop(cConsist, 980, 660, P(t, mid('exam', 0.8), 0.4, pop));
    }

    lpCam(cam, k, fx, fy, sx, sy);

    /* ---------- the cast ---------- */
    const apply = (ch, who, p) => {
      if (!p) { op(ch, 0); return; }
      op(ch, p.v === undefined ? 1 : p.v); tr(ch, p.x, p.y, p.s);
      ch.set({ t, talk: scTalk(S, t, who), mood: p.mood, look: p.look, glow: p.glow });
    };
    apply(cecil, 'cecil', pose.cecil); apply(dimitri, 'dimitri', pose.dimitri); apply(eddie, 'eddie', pose.eddie); apply(kav, 'kavya', pose.kav);
    op(ringE, pose.eddie && pose.eddie.ring ? 1 : 0);
    if (pose.eddie && pose.eddie.ring) tr(ringE, pose.eddie.x, pose.eddie.y, 1 + 0.08 * Math.sin(t * 10));
  };
});

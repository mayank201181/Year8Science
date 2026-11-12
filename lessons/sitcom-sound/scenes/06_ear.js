/* Scene 6: Out of range.
   Shots: the ding flies into Kavya's ear, zoom in -> Coco at the INNER EAR front desk (lower third) ->
   the ear tour on pioEar (pinna, canal, ear drum, three bones, cochlea "It's a look", nerve to the brain) ->
   the hearing-range ruler (20 Hz to 20,000 Hz, "20 to 20k", the top end shrinks with age) -> Freq points both
   ways: ultrasound / infrasound, an elephant rumbles -> a dog whistle at 25,000 Hz: dog's ears up, Kavya "?" ->
   Coco vs Amp's giant speaker, warning card -> Amp shrinks: "SORRY." (ear defenders, volume down) ->
   the hall: arcs reflect off Echo's tiled wall -> Echo: "...an echo." -> curtains close, carpet unrolls ->
   Echo peeks over the curtain: "...mmf." -> Freq: ultrasound scans and jewellery cleaner -> sonar: the pulse
   goes down, the echo comes back after 4 s, thinking timer -> Archie's whiteboard 1,500 x 4 = 6,000 m ->
   there and back, cut it in half: 3,000 m -> Archie: "I knew that." -> Echo: "...knew that." Archie stares. */
scene('ear', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed ear) ---------- */
  const earOn = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const earPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  // the same for art drawn at absolute stage coordinates: scale about (cx, cy)
  function earPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); }
  function earLabel(parent, text, o) {            // dark pill label, readable over anything
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function earEchoText(parent, text, size, col) { // a caption with a fading, offset "echo" copy behind it
    const g = G(parent);
    const ghost = T(g, 14, 10, text, { size: size || 46, weight: 800, anchor: 'middle', fill: '#C9C2E6', opacity: 0.35 });
    const main = T(g, 0, 0, text, { size: size || 46, weight: 800, anchor: 'middle', fill: col || '#FFFFFF' });
    main.setAttribute('stroke', '#221C33'); main.setAttribute('stroke-width', 8); main.setAttribute('paint-order', 'stroke');
    g.set = (p, t) => { op(g, p); tr(ghost, 14 + 10 * Math.sin(t * 3), 10, 1); };
    return g;
  }
  function earCam(k, fx, fy, tx, ty) {           // scale k about (fx, fy), put that point at (tx, ty)
    world.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  }
  function earArc(parent, h, col, flip) {         // one ")" sound-wave arc
    return E('path', { d: `M0,${-h / 2} Q${flip ? -h * 0.28 : h * 0.28},0 0,${h / 2}`, fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round' }, parent);
  }

  /* ---------- layers ---------- */
  const world = G(root), Lbg = G(world), Lcast = G(world), Lfg = G(world), Lhud = G(root);

  /* ================= sets ================= */
  // the hall (A arrive, H reflect)
  const hallG = G(Lbg); const hall = pioHall(hallG);
  // Coco's front desk (B coco, F loud)
  const deskBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FBE3EA', '#EDBCCB', true) }, deskBg);
  E('rect', { x: 0, y: 430, width: 1200, height: 320, fill: '#D99AAE' }, deskBg);
  E('rect', { x: 0, y: 422, width: 1200, height: 14, fill: '#B8577A' }, deskBg);
  { let sp = '', n = 60; for (let i = 0; i <= n; i++) { const a = i / n * TAU * 2.4, rr = 40 * (1 - i / n * 0.85); sp += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    [[90, 220], [1110, 160], [1120, 360]].forEach(([x, y]) => E('path', { d: sp, fill: 'none', stroke: '#E9A9BD', 'stroke-width': 7, 'stroke-linecap': 'round', transform: `translate(${x} ${y})` }, deskBg)); }
  const deskSigns = G(deskBg);
  E('rect', { x: 290, y: 118, width: 620, height: 84, rx: 14, fill: '#6B2E4A', stroke: '#3A1828', 'stroke-width': 4 }, deskSigns);
  T(deskSigns, 600, 174, 'INNER EAR · FRONT DESK', { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('rect', { x: 820, y: 250, width: 280, height: 110, rx: 10, fill: '#1A1014', stroke: '#3A1828', 'stroke-width': 4 }, deskSigns);
  T(deskSigns, 960, 290, 'NOW SERVING', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  T(deskSigns, 960, 338, 'DING', { size: 42, weight: 800, anchor: 'middle', fill: '#FF4D5E', ls: 4 });
  // the inside of the ear (C)
  const earBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1622', '#41213A', true) }, earBg);
  // the ruler (D)
  const rulerBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#10233A', '#1F3D62', true) }, rulerBg);
  // the dog park (E)
  const parkBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#8FCBEF', '#DDF1FA', true) }, parkBg);
  E('path', { d: 'M0,560 Q300,530 600,556 T1200,548 L1200,750 L0,750 Z', fill: '#7CC46A', stroke: '#4E9A3E', 'stroke-width': 4 }, parkBg);
  // Echo's wall, close up (I, J, K, P)
  const wallBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#B4AAD3', '#9C91C2', true) }, wallBg);
  { let wg = ''; for (let x = 0; x <= 1200; x += 75) wg += `M${x},0 L${x},640 `; for (let y = 25; y < 640; y += 75) wg += `M0,${y} L1200,${y} `;
    E('path', { d: wg, stroke: '#8B80B4', 'stroke-width': 6 }, wallBg); }
  E('ellipse', { cx: 600, cy: 420, rx: 420, ry: 300, fill: glow('#FFFFFF'), opacity: 0.35 }, wallBg);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: linGrad('#C99A5E', '#9A6B38', true) }, wallBg);
  E('rect', { x: 0, y: 626, width: 1200, height: 18, fill: '#8C7F5A' }, wallBg);
  // confessionals
  const confAmp = pioConf(Lbg, 'amp'), confFreq = pioConf(Lbg, 'freq'), confArchie = pioConf(Lbg, 'archie');
  // the sea (M)
  const seaG = G(Lbg); const sea = pioSea(seaG);
  // the whiteboard (N)
  const boardBg = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#CFE8DA', '#A9D2BC', true) }, boardBg);
  E('rect', { x: 60, y: 130, width: 740, height: 440, rx: 12, fill: '#FFFFFF', stroke: '#8A949C', 'stroke-width': 10 }, boardBg);
  E('rect', { x: 90, y: 574, width: 680, height: 18, rx: 6, fill: '#8A949C' }, boardBg);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#3D4A52' }, boardBg);

  /* ================= the cast (one of each, moved between shots) ================= */
  const echo = cast(Lcast, 'echo', { mood: 'deadpan' });
  const kavBodyW = G(Lcast); const kavBody = scKavyaBody(kavBodyW);
  const triH = pioTriangle(Lcast, 0.36);
  const kav = cast(Lcast, 'kavya', { mood: 'deadpan' });
  { // give Kavya an ear on the screen-left side, tucked behind her face
    const inner = kav.firstChild, faceEl = inner.querySelector('ellipse[rx="74"]');
    const e = G(inner); inner.insertBefore(e, faceEl);
    E('ellipse', { cx: -78, cy: -26, rx: 15, ry: 24, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3.5 }, e);
    E('path', { d: 'M-80,-40 Q-90,-26 -80,-12', fill: 'none', stroke: '#8A5434', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, e);
  }
  const coco = cast(Lcast, 'coco', { mood: 'neutral' });
  const freq = cast(Lcast, 'freq', { mood: 'happy' });
  const amp = cast(Lcast, 'amp', { mood: 'neutral' });
  const archie = cast(Lcast, 'archie', { mood: 'happy' });
  const ALL = [echo, kavBodyW, triH, kav, coco, freq, amp, archie];

  /* ================= A: the ding arrives ================= */
  const shA = G(Lfg);
  const triA = pioTriangle(shA, 0.9);
  const fistA = E('ellipse', { rx: 20, ry: 16, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, shA);
  const EARPT = [680, 432];                      // Kavya's ear (stage) when she is at (800, 470) s 1.5
  const arcsA = [0, 1, 2].map(() => earArc(shA, 90, C.energy));
  const dingA = chip(shA, 'DING!', { size: 40, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 3 });
  const hudA = G(Lhud);
  const earChip = chip(hudA, 'Kavya’s EAR', { size: 52, fill: '#2E7DD8', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });

  /* ================= B / F: the front desk ================= */
  const desk = G(Lfg);
  E('path', { d: 'M-360,0 L360,0 L360,190 L-360,190 Z', fill: ball('#F7F2EA', '#CDBFAE'), stroke: SC_INK, 'stroke-width': 5 }, desk);
  E('rect', { x: -380, y: -16, width: 760, height: 22, rx: 6, fill: '#8C5A6E', stroke: SC_INK, 'stroke-width': 4 }, desk);
  E('rect', { x: -110, y: 40, width: 220, height: 56, rx: 8, fill: '#FFFFFF', stroke: '#B8577A', 'stroke-width': 3 }, desk);
  T(desk, 0, 79, 'RECEPTION', { size: 28, weight: 800, anchor: 'middle', fill: '#B8577A' });
  const bell = G(desk); tr(bell, 260, -16);
  E('rect', { x: -34, y: -8, width: 68, height: 10, rx: 3, fill: '#5A5F6A', stroke: SC_INK, 'stroke-width': 2.5 }, bell);
  E('path', { d: 'M-28,-8 Q-28,-40 0,-40 Q28,-40 28,-8 Z', fill: ball('#F2E2A8', '#B8962E'), stroke: SC_INK, 'stroke-width': 3 }, bell);
  E('rect', { x: -4, y: -50, width: 8, height: 12, rx: 3, fill: '#5A5F6A', stroke: SC_INK, 'stroke-width': 2 }, bell);
  const bellDing = T(desk, 300, -84, 'ding!', { size: 34, weight: 800, anchor: 'middle', fill: '#B8577A' });
  const hudB = G(Lhud);
  const ltCoco = scLowerThird(hudB, 'COCO', 'Cochlea. Front desk, inner ear.');
  const cochChip = chip(hudB, 'COCHLEA', { size: 52, fill: '#B8577A', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  // F: Amp's giant speaker, the warning card
  const shF = G(Lfg);
  const spk = G(shF); tr(spk, 1070, 420);
  E('rect', { x: -86, y: -170, width: 172, height: 340, rx: 16, fill: '#2B2F38', stroke: SC_INK, 'stroke-width': 5 }, spk);
  const cones = [[-90, 52], [70, 66]].map(([y, r]) => { const c = G(spk); tr(c, 0, y); E('circle', { r, fill: '#4A4F5A', stroke: '#15171C', 'stroke-width': 4 }, c); E('circle', { r: r * 0.36, fill: '#1A1C22' }, c); return c; });
  const blast = [0, 1, 2, 3].map(() => earArc(shF, 170, '#FF8A3D', true));
  const warn = G(shF);
  card(warn, 230, 112, 740, 160, { fill: '#2A0E12', stroke: '#FF6070', sw: 5, opacity: 0.95 });
  const wTri = G(warn); tr(wTri, 290, 170);
  E('path', { d: 'M0,-34 L34,28 L-34,28 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, wTri);
  T(wTri, 0, 20, '!', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK });
  const w1 = T(warn, 345, 165, '**Very loud** sounds carry lots of energy', { size: 32, weight: 600, boldFill: '#FF9AA4' });
  const w2 = T(warn, 345, 212, 'they can damage the cochlea’s cells', { size: 32, weight: 600 });
  const permChip = chip(warn, 'PERMANENTLY', { size: 40, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });

  /* ================= C: the ear tour ================= */
  const shC = G(Lfg);
  const earArt = G(shC); tr(earArt, 80, 150);
  const ear = pioEar(earArt);
  ear.querySelectorAll('text').forEach(x => op(x, 0));   // we draw our own brain and label
  const vib = G(earArt);                          // vibrations handed on: drum -> bones -> cochlea
  const vibArcs = [[470, 236], [590, 228]].map(([x, y]) => { const g = G(vib); tr(g, x, y); [0, 1].forEach(i => E('path', { d: `M${i * 10},-16 Q${i * 10 + 8},0 ${i * 10},16`, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g)); return g; });
  const sigPath = 'M712,214 Q800,150 960,170';
  const signals = E('path', { d: sigPath, fill: 'none', stroke: C.energy, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-dasharray': '18 40' }, earArt);
  const brain = G(shC); tr(brain, 1112, 330);
  const brainGlow = E('circle', { r: 86, fill: glow('#FFE45C'), opacity: 0 }, brain);
  E('path', { d: 'M-46,20 Q-62,-6 -44,-28 Q-40,-52 -12,-50 Q6,-66 28,-52 Q56,-50 54,-22 Q66,4 46,24 Q30,40 0,34 Q-30,40 -46,20 Z', fill: '#F7A8C8', stroke: SC_INK, 'stroke-width': 4 }, brain);
  E('path', { d: 'M-30,-20 Q-14,-30 -4,-14 Q8,0 24,-12 M-26,12 Q-8,2 6,16 M20,-36 Q30,-24 22,-12', fill: 'none', stroke: '#C25A88', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, brain);
  T(brain, 0, 82, 'brain', { size: 28, weight: 700, anchor: 'middle', fill: '#F7A8C8' });
  const lab = (text, x, y, lx, ly, o) => {     // a pill with a leader line to (lx, ly)
    const g = G(shC);
    E('line', { x1: x, y1: y, x2: lx, y2: ly, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.85 }, g);
    E('circle', { cx: lx, cy: ly, r: 6, fill: '#FFFFFF' }, g);
    const c = earLabel(g, text, o); tr(c, x, y);
    return g;
  };
  const Lpinna = lab('pinna', 190, 158, 190, 222, { size: 32 });
  const Lcanal = lab('ear canal', 370, 512, 380, 420, { size: 30 });
  const Ldrum = lab('ear drum', 500, 572, 508, 436, { size: 32, color: '#FF9AA4' });
  const LdrumS = T(shC, 500, 632, 'thin, tight membrane', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const Lbones = lab('3 tiny bones', 590, 236, 584, 352, { size: 30 });
  const Lcoch = lab('cochlea', 820, 560, 760, 462, { size: 32, color: '#F9C3D1' });
  const LcochS = T(shC, 820, 618, 'coiled tube, full of fluid', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const Lnerve = lab('nerve signals → brain', 900, 218, 900, 318, { size: 30, color: C.energy });
  const sparkles = [[-90, -120], [96, -96], [110, 40]].map(([x, y]) => { const g = G(shC); tr(g, x, y); E('path', { d: 'M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4 Z', fill: '#FFE45C', stroke: '#FFF7C2', 'stroke-width': 2 }, g); return g; });

  /* ================= D: the hearing range ruler ================= */
  const shD = G(Lfg);
  const FX = f => 100 + 200 * (Math.log10(f) - Math.log10(2));      // 2 Hz .. 200,000 Hz on x 100 .. 1100
  const RY = 400;
  const dTitle = T(shD, 700, 178, 'HUMAN HEARING RANGE', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const shadeL = E('rect', { x: 100, y: RY - 40, width: 200, height: 80, fill: '#FF8A3D', opacity: 0.45 }, shD);
  const shadeR = E('rect', { x: 900, y: RY - 40, width: 200, height: 80, fill: '#B48CFF', opacity: 0.45 }, shD);
  const band = E('rect', { x: 300, y: RY - 40, width: 600, height: 80, fill: C.good, stroke: '#1E7A4E', 'stroke-width': 4 }, shD);
  const bandT = T(shD, 600, RY + 12, 'HEARING RANGE', { size: 34, weight: 800, anchor: 'middle', fill: '#0B2A1A' });
  E('line', { x1: 90, y1: RY + 40, x2: 1110, y2: RY + 40, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, shD);
  { let tk = ''; [2, 20, 200, 2000, 20000, 200000].forEach(f => { tk += `M${FX(f).toFixed(1)},${RY + 40} L${FX(f).toFixed(1)},${RY + 58} `; });
    for (let d = 0; d < 5; d++) for (const m of [5]) tk += `M${FX(2 * Math.pow(10, d) * m / 2 * 2).toFixed(1)},${RY + 40} L${FX(2 * Math.pow(10, d) * m / 2 * 2).toFixed(1)},${RY + 50} `;
    E('path', { d: tk, stroke: '#FFFFFF', 'stroke-width': 4 }, shD); }
  const l20 = T(shD, 300, RY + 102, '20 Hz', { size: 40, weight: 800, anchor: 'middle', fill: '#9AF0C8' });
  const l20k = T(shD, 900, RY + 102, '20,000 Hz', { size: 40, weight: 800, anchor: 'middle', fill: '#9AF0C8' });
  const lmin = G(shD);
  T(lmin, 500, RY + 90, '200', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(lmin, 700, RY + 90, '2,000', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(lmin, 1100, RY + 90, 'Hz', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  const mnem = chip(shD, '20 to 20k', { size: 44, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  const older = G(shD);
  arrow(older, 900, 314, 846, 314, { color: '#FFB27A', width: 5 });
  T(older, 830, 324, 'older ears', { size: 30, weight: 700, anchor: 'end', fill: '#FFB27A' });
  const ultraL = G(shD);
  T(ultraL, 1000, 262, 'ULTRASOUND', { size: 38, weight: 800, anchor: 'middle', fill: '#CDB2FF' });
  T(ultraL, 1000, 302, 'above 20,000 Hz', { size: 28, weight: 600, anchor: 'middle', fill: '#CDB2FF' });
  const infraL = G(shD);
  T(infraL, 200, 262, 'INFRASOUND', { size: 38, weight: 800, anchor: 'middle', fill: '#FFB27A' });
  T(infraL, 200, 302, 'below 20 Hz', { size: 28, weight: 600, anchor: 'middle', fill: '#FFB27A' });
  const arR = arrow(shD, 690, 590, 840, 590, { color: '#CDB2FF', width: 7 });
  const arL = arrow(shD, 510, 590, 360, 590, { color: '#FFB27A', width: 7 });
  const eleph = G(shD);
  { const e = G(eleph);
    E('ellipse', { cx: 30, cy: 0, rx: 78, ry: 52, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, e);
    [[-22, 40], [10, 44], [56, 44], [86, 40]].forEach(([x, y]) => E('rect', { x: x - 12, y, width: 24, height: 40, rx: 8, fill: '#8A96A2', stroke: SC_INK, 'stroke-width': 3 }, e));
    E('path', { d: 'M-70,-10 Q-104,30 -92,74 Q-88,84 -80,74 Q-84,34 -50,10 Z', fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, e);
    E('circle', { cx: -54, cy: -22, r: 40, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, e);
    E('path', { d: 'M-40,-50 Q4,-58 0,-10 Q-6,14 -34,4 Z', fill: '#B3BEC8', stroke: SC_INK, 'stroke-width': 3.5 }, e);
    E('circle', { cx: -68, cy: -28, r: 5, fill: SC_INK }, e);
    eleph.body = e; }
  const rumble = sineWave(eleph, { w: 120, amp: 9, wl: 120, color: '#FFB27A', width: 5 }); tr(rumble, 112, -14);
  const rumble2 = sineWave(eleph, { w: 120, amp: 9, wl: 120, color: '#FFB27A', width: 4 }); tr(rumble2, 112, 18);
  T(eleph, 20, 132, 'elephants', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB27A' });

  /* ================= E: the dog whistle ================= */
  const shE = G(Lfg);
  const RX0 = 200, RX1 = 1000, rx = f => RX0 + (f - 15000) / 15000 * (RX1 - RX0);   // a zoomed-in, linear ruler: 15,000 .. 30,000 Hz
  const zRuler = G(shE);
  card(zRuler, 150, 104, 900, 186, { fill: 'rgba(10,27,39,0.88)', stroke: C.line });
  E('rect', { x: RX0, y: 132, width: rx(20000) - RX0, height: 26, rx: 6, fill: C.good }, zRuler);
  T(zRuler, rx(20000) + 12, 154, 'you (stop at 20,000)', { size: 26, weight: 700, fill: '#9AF0C8' });
  E('rect', { x: RX0, y: 170, width: RX1 - RX0, height: 26, rx: 6, fill: '#FFB03A' }, zRuler);
  T(zRuler, RX1 - 10, 191, 'dog', { size: 26, weight: 800, anchor: 'end', fill: '#3A2400' });
  E('line', { x1: RX0, y1: 214, x2: RX1, y2: 214, stroke: '#FFFFFF', 'stroke-width': 4 }, zRuler);
  [15000, 20000, 25000, 30000].forEach(f => { E('line', { x1: rx(f), y1: 214, x2: rx(f), y2: 228, stroke: '#FFFFFF', 'stroke-width': 4 }, zRuler); T(zRuler, rx(f), 262, f.toLocaleString('en-GB'), { size: 26, weight: 700, anchor: 'middle', fill: f === 25000 ? '#FF9AA4' : C.muted }); });
  const wMark = E('line', { x1: rx(25000), y1: 120, x2: rx(25000), y2: 232, stroke: '#FF4D5E', 'stroke-width': 6, 'stroke-dasharray': '10 7' }, shE);
  const realChip = earLabel(shE, 'still REAL sound', { size: 34, color: '#FFE45C', stroke: '#FFE45C' });
  const hzChip = chip(shE, '25,000 Hz', { size: 46, fill: '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const whistle = G(shE); tr(whistle, 610, 470);
  E('rect', { x: -60, y: -16, width: 110, height: 32, rx: 10, fill: ball('#E8EEF3', '#8A97A3'), stroke: SC_INK, 'stroke-width': 4 }, whistle);
  E('rect', { x: 44, y: -10, width: 22, height: 20, rx: 4, fill: '#B9C4CE', stroke: SC_INK, 'stroke-width': 3 }, whistle);
  E('circle', { cx: -66, cy: 0, r: 9, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, whistle);
  T(whistle, 0, 66, 'dog whistle', { size: 28, weight: 700, anchor: 'middle', fill: SC_INK });
  const wArcsR = [0, 1, 2].map(() => E('path', { d: 'M0,-40 Q16,0 0,40', fill: 'none', stroke: '#B48CFF', 'stroke-width': 6, 'stroke-dasharray': '6 8', 'stroke-linecap': 'round' }, shE));
  const wArcsL = [0, 1, 2].map(() => E('path', { d: 'M0,-40 Q-16,0 0,40', fill: 'none', stroke: '#B48CFF', 'stroke-width': 6, 'stroke-dasharray': '6 8', 'stroke-linecap': 'round' }, shE));
  const dog = G(shE); tr(dog, 940, 560);
  const dogIn = G(dog);
  E('ellipse', { cx: 30, cy: 90, rx: 100, ry: 56, fill: '#C98A4E', stroke: SC_INK, 'stroke-width': 4 }, dogIn);
  E('path', { d: 'M120,70 Q170,40 168,10', fill: 'none', stroke: '#C98A4E', 'stroke-width': 14, 'stroke-linecap': 'round' }, dogIn);
  const tail = dogIn.lastChild;
  const ears = [-1, 1].map(sd => { const g = G(dogIn); E('ellipse', { cx: 0, cy: 34, rx: 20, ry: 40, fill: '#7A4A22', stroke: SC_INK, 'stroke-width': 4 }, g); return { g, sd }; });
  E('circle', { cx: 0, cy: 0, r: 66, fill: '#D99A5C', stroke: SC_INK, 'stroke-width': 4 }, dogIn);
  E('ellipse', { cx: 0, cy: 26, rx: 36, ry: 26, fill: '#F2D2AE', stroke: SC_INK, 'stroke-width': 3 }, dogIn);
  E('ellipse', { cx: 0, cy: 12, rx: 12, ry: 9, fill: SC_INK }, dogIn);
  [-24, 24].forEach(x => { E('circle', { cx: x, cy: -16, r: 9, fill: SC_INK }, dogIn); E('circle', { cx: x + 3, cy: -19, r: 3, fill: '#FFFFFF' }, dogIn); });
  E('rect', { x: -48, y: 60, width: 96, height: 14, rx: 7, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, dogIn);
  const dogBang = T(shE, 1010, 420, '!', { size: 72, weight: 800, anchor: 'middle', fill: '#E8424F' });
  const kavQ = T(shE, 400, 380, '?', { size: 80, weight: 800, anchor: 'middle', fill: '#2E7DD8' });
  const nothing = earLabel(shE, 'hears NOTHING', { size: 32 });

  /* ================= G: sorry ================= */
  const shG = G(Lfg);
  const sorryT = T(shG, 0, 0, 'SORRY.', { size: 96, weight: 800, anchor: 'middle', fill: '#FF9A6C' });
  sorryT.setAttribute('stroke', '#3A1C10'); sorryT.setAttribute('stroke-width', 10); sorryT.setAttribute('paint-order', 'stroke');
  const defenders = G(shG);
  E('path', { d: 'M-56,10 Q-56,-62 0,-62 Q56,-62 56,10', fill: 'none', stroke: '#3B3F48', 'stroke-width': 12, 'stroke-linecap': 'round' }, defenders);
  [-1, 1].forEach(sd => E('rect', { x: sd * 56 - 22, y: -6, width: 44, height: 62, rx: 18, fill: ball('#FFB03A', '#C27A10'), stroke: SC_INK, 'stroke-width': 4 }, defenders));
  T(defenders, 0, 102, 'ear defenders', { size: 28, weight: 700, anchor: 'middle', fill: '#FFE1CF' });
  const vol = G(shG);
  E('rect', { x: -120, y: -8, width: 240, height: 16, rx: 8, fill: '#3B2A22', stroke: '#FFE1CF', 'stroke-width': 3 }, vol);
  const volFill = E('rect', { x: -120, y: -8, width: 240, height: 16, rx: 8, fill: C.good }, vol);
  const volKnob = E('circle', { cx: 120, cy: 0, r: 20, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, vol);
  T(vol, -150, 10, '−', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE1CF' });
  T(vol, 150, 12, '+', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE1CF' });
  T(vol, 0, 62, 'volume down', { size: 28, weight: 700, anchor: 'middle', fill: '#FFE1CF' });

  /* ================= H: reflection in the hall ================= */
  const shH = G(Lfg);
  const outArcs = [0, 1, 2].map(() => earArc(shH, 120, C.energy));
  const backArcs = [0, 1, 2].map(() => earArc(shH, 120, '#7FF0C2', true));
  const refChip = chip(shH, 'hard, flat surfaces REFLECT sound', { size: 34, fill: 'rgba(10,27,39,0.9)', color: '#FFFFFF', stroke: C.energy, sw: 3 });
  const echoCard = G(shH);
  card(echoCard, 650, 492, 500, 196, { fill: 'rgba(10,27,39,0.92)', stroke: '#7FF0C2', sw: 3 });
  T(echoCard, 900, 552, 'ECHO =', { size: 46, weight: 800, anchor: 'middle', fill: '#7FF0C2' });
  T(echoCard, 900, 604, 'a reflected sound,', { size: 32, weight: 600, anchor: 'middle' });
  T(echoCard, 900, 648, 'heard a moment later', { size: 32, weight: 600, anchor: 'middle' });

  /* ================= I / J / K: Echo's wall, curtains ================= */
  const shI = G(Lfg);
  const eT1 = earEchoText(shI, '…an echo.');
  const shJ = G(Lfg);
  const carpet = E('rect', { x: 0, y: 664, width: 1200, height: 70, rx: 8, fill: '#3E7C8C', stroke: '#24505C', 'stroke-width': 4 }, shJ);
  const absArcs = [0, 1, 2].map(() => earArc(shJ, 150, C.energy));
  const curtG = G(shJ); const curt = pioCurtains(curtG, 780, 480); tr(curtG, 640, 450);
  E('rect', { x: 230, y: 198, width: 820, height: 16, rx: 8, fill: '#C9A24A', stroke: '#6B4416', 'stroke-width': 3 }, shJ);
  const absChip = chip(shJ, 'soft materials ABSORB sound', { size: 38, fill: 'rgba(10,27,39,0.92)', color: '#FFFFFF', stroke: '#FF9AA4', sw: 3 });
  const curtLab = earLabel(shJ, 'curtains', { size: 30 });
  const carpLab = earLabel(shJ, 'carpet', { size: 30 });
  const eT2 = earEchoText(shJ, '…mmf.', 40, '#D9D2EE');

  /* ================= L: ultrasound at work ================= */
  const shL = G(Lfg);
  const usChip = chip(shL, 'ULTRASOUND', { size: 44, fill: '#7550C4', color: '#FFFFFF', stroke: '#CDB2FF', sw: 3 });
  const scanG = G(shL);
  E('rect', { x: 600, y: 170, width: 480, height: 310, rx: 16, fill: '#0B0F14', stroke: '#8A97A3', 'stroke-width': 6 }, scanG);
  E('path', { d: 'M840,190 L976,436 A280,280 0 0 1 704,436 Z', fill: '#1E2A33' }, scanG);
  { const r = rng(61); let sp = ''; for (let i = 0; i < 70; i++) { const a = (60 + r() * 60) * Math.PI / 180, d = 40 + r() * 230; sp += `M${(840 + Math.cos(a) * d).toFixed(0)},${(190 + Math.sin(a) * d).toFixed(0)} l4,0 `; }
    E('path', { d: sp, stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.5 }, scanG); }
  const baby = G(scanG);
  E('path', { d: 'M800,360 Q770,320 800,290 Q840,262 880,292 Q904,316 892,346 Q930,350 942,384 Q946,414 912,420 L800,418 Q770,400 800,360 Z', fill: '#C9D6E0', opacity: 0.55, stroke: '#F2F7FA', 'stroke-width': 4 }, baby);
  E('circle', { cx: 846, cy: 318, r: 5, fill: '#F2F7FA' }, baby);
  const scanSweep = E('line', { x1: 840, y1: 190, x2: 840, y2: 460, stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.6 }, scanG);
  const scanChip = earLabel(scanG, 'medical scans', { size: 34, color: '#9FD8FF', stroke: '#9FD8FF' }); tr(scanChip, 840, 540);
  const cleanG = G(shL);
  E('rect', { x: 680, y: 230, width: 320, height: 230, rx: 14, fill: '#8FD3F0', opacity: 0.35, stroke: '#CFE7F5', 'stroke-width': 6 }, cleanG);
  E('rect', { x: 686, y: 290, width: 308, height: 164, rx: 10, fill: '#4CC9F0', opacity: 0.55 }, cleanG);
  E('rect', { x: 660, y: 456, width: 360, height: 30, rx: 8, fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 4 }, cleanG);
  const ringJ = G(cleanG); tr(ringJ, 840, 390);
  E('ellipse', { rx: 40, ry: 22, fill: 'none', stroke: '#FFC247', 'stroke-width': 10 }, ringJ);
  E('path', { d: 'M-10,-22 L0,-40 L10,-22 Z', fill: '#BFE6FA', stroke: '#FFFFFF', 'stroke-width': 3 }, ringJ);
  const fizz = [0, 1, 2, 3].map(() => E('path', { d: 'M0,0 l-8,-12 l8,-12 l-8,-12 l8,-12', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cleanG));
  const cleanChip = earLabel(cleanG, 'cleans jewellery', { size: 34, color: '#FFC247', stroke: '#FFC247' }); tr(cleanChip, 840, 540);
  const bubTea = pioBubbleTea(shL, 0.9);

  /* ================= M: sonar ================= */
  const shM = G(Lfg);
  const sonarChip = chip(shM, 'SONAR', { size: 60, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  const pulseLab = T(shM, 380, 470, 'ultrasound pulse', { size: 30, weight: 700, fill: '#FFE45C' });
  const watch = G(shM); tr(watch, 640, 168);
  E('rect', { x: -12, y: -66, width: 24, height: 16, rx: 4, fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 3 }, watch);
  E('circle', { r: 52, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, watch);
  const watchT = T(watch, 0, 12, '0.0 s', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
  const sumG = G(shM);
  const sumA = earLabel(sumG, 'echo back after 4 s', { size: 32, color: '#9AF0C8', stroke: '#9AF0C8' });
  const sumB = earLabel(sumG, 'sound in water: 1,500 m/s', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });
  const sumC = chip(sumG, 'How deep is the sea?', { size: 36, fill: '#2E7DD8', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const think = ring(sumG, 34, C.energy);
  const depthR = G(shM);
  E('line', { x1: 150, y1: 262, x2: 150, y2: 688, stroke: '#FFFFFF', 'stroke-width': 5 }, depthR);
  { let tk = ''; for (let y = 262; y <= 688; y += 42.6) tk += `M140,${y.toFixed(0)} L160,${y.toFixed(0)} `; E('path', { d: tk, stroke: '#FFFFFF', 'stroke-width': 4 }, depthR); }
  const depthQ = chip(depthR, '?', { size: 50, fill: '#2E7DD8', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(depthQ, 150, 470);
  const depthA = chip(depthR, '3,000 m', { size: 36, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 3 }); tr(depthA, 150, 470);
  const halfG = G(shM);
  const arDown = arrow(halfG, 270, 290, 270, 676, { color: C.energy, width: 7 });
  const arUp = arrow(halfG, 330, 676, 330, 290, { color: '#9AF0C8', width: 7 });
  const hA = earLabel(halfG, 'there + back = 6,000 m', { size: 32 });
  const hB = T(halfG, 660, 450, '÷ 2', { size: 90, weight: 800, anchor: 'middle', fill: C.energy });
  const hC = chip(halfG, 'depth = 3,000 m', { size: 44, fill: '#FFE45C', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  const callN = scVideoCall(shM, 230, 176, 'Nigel'); tr(callN, 1036, 170);
  const nigel = cast(callN.screen, 'nigel', { s: 0.6, mood: 'deadpan' }); tr(nigel, 0, 30, 0.6);
  const callA = scVideoCall(shM, 230, 176, 'Archie'); tr(callA, 1036, 470);
  const archieC = cast(callA.screen, 'archie', { s: 0.6, mood: 'happy' }); tr(archieC, 0, 40, 0.6);

  /* ================= N: whiteboard ================= */
  const shN = G(Lfg);
  const bd1 = T(shN, 430, 310, '1,500 × 4', { size: 92, weight: 800, anchor: 'middle', fill: '#1F4FBF' });
  const bd2 = T(shN, 430, 450, '= 6,000 m', { size: 92, weight: 800, anchor: 'middle', fill: '#1F4FBF' });
  const bdU = T(shN, 430, 530, '(m/s × s = metres)', { size: 30, weight: 600, anchor: 'middle', fill: '#6B7780', font: FB });

  /* ================= P: "...knew that." ================= */
  const shP = G(Lfg);
  const eT3 = earEchoText(shP, '…knew that.');

  /* ================= cut list ================= */
  const SHOTS = [['A', -9], ['B', at('coco') - 0.06], ['C', at('pinna') - 0.06], ['D', at('range') - 0.06], ['E', at('dog') - 0.06],
    ['F', at('loud') - 0.06], ['G', at('sorry') - 0.06], ['H', at('reflect') - 0.06], ['I', at('echo') - 0.06], ['J', at('absorb') - 0.06],
    ['L', at('scans') - 0.06], ['M', at('sonar') - 0.06], ['N', at('times') - 0.06], ['M2', at('half') - 0.06], ['O', at('knew') - 0.06], ['P', at('echo2') - 0.06]];
  const shotAt = t => { let s = 'A'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const BG = { A: hallG, H: hallG, B: deskBg, F: deskBg, C: earBg, D: rulerBg, E: parkBg, I: wallBg, J: wallBg, P: wallBg, M: seaG, M2: seaG, N: boardBg };
  const FG = { A: [shA, hudA], B: [desk, hudB], F: [desk, shF], C: [shC], D: [shD], E: [shE], G: [shG], H: [shH], I: [shI], J: [shJ], L: [shL], M: [shM], M2: [shM], N: [shN], P: [shP] };
  const bgs = [hallG, deskBg, earBg, rulerBg, parkBg, wallBg, seaG, boardBg], fgs = [shA, hudA, desk, hudB, shF, shC, shD, shE, shG, shH, shI, shJ, shL, shM, shN, shP];

  return t => {
    const sh = shotAt(t);
    bgs.forEach(g => op(g, BG[sh] === g ? 1 : 0));
    fgs.forEach(g => op(g, (FG[sh] || []).includes(g) ? 1 : 0));
    confAmp.set(sh === 'G' ? 1 : 0, t); confFreq.set(sh === 'L' ? 1 : 0, t); confArchie.set(sh === 'O' ? 1 : 0, t);
    ALL.forEach(c => op(c, 0));
    ltCoco.set(0);
    let cam = [1, 600, 375, 600, 375];
    const show = (c, x, y, s, st) => { op(c, 1); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };
    const cocoT = scTalk(S, t, 'coco');

    /* ---------- A: the ding arrives at Kavya's ear ---------- */
    if (sh === 'A') {
      hall.upd(t);
      show(kav, 800, 470, 1.5, { mood: t > mid('arrive', 0.7) ? 'neutral' : 'deadpan', look: -0.7 });
      tr(triA, 430, 400, 0.9, -4 + 3 * Math.sin(t * 1.3) * AMP); triA.set({ t, ring: 1, beater: false }); tr(fistA, 430, 400 - 100);
      arcsA.forEach((a, i) => {
        const f = ((t * 0.8) + i / 3) % 1;
        tr(a, lerp(500, EARPT[0] - 6, f), lerp(400, EARPT[1], f), 1 - 0.6 * f); op(a, Math.sin(f * Math.PI) * P(t, at('arrive'), 0.4, linear));
      });
      earPop(dingA, t, at('arrive') + 0.1, 430, 250, 1, -6);
      const zp = P(t, mid('arrive', 0.72), end('arrive') + 0.45 - mid('arrive', 0.72), easeIn);
      cam = [1 + 5 * zp, EARPT[0], EARPT[1], lerp(EARPT[0], 600, zp), lerp(EARPT[1], 375, zp)];
      const ep = P(t, mid('arrive', 0.55), 0.45, pop);
      op(earChip, clamp(ep * 2.5) * (1 - P(t, end('arrive') + 0.15, 0.2, linear))); tr(earChip, 900, 200, Math.max(0.01, 0.6 + 0.4 * ep), -3);
    }

    /* ---------- B: Coco at the front desk ---------- */
    if (sh === 'B') {
      op(deskSigns, 1);
      tr(desk, 600, 486);
      show(coco, 560, 352, 1.25, { talk: cocoT, mood: t < mid('coco', 0.5) ? 'happy' : 'neutral', look: t > mid('coco', 0.75) ? 0.5 : 0 });
      const bp = P(t, at('coco') - 0.05, 0.5, linear); op(bellDing, Math.sin(bp * Math.PI)); attr(bellDing, 'y', -84 - 20 * bp);
      ltCoco.set(win(t, at('coco') + 0.2, at('coco') + 3.3, 0.3));
      const cp = P(t, mid('coco', 0.55), 0.45, pop);
      op(cochChip, clamp(cp * 2.5)); tr(cochChip, 950, 418, Math.max(0.01, 0.6 + 0.4 * cp), -3);
      cam = [1 + 0.03 * P(t, at('coco'), 4, linear), 600, 375, 600, 375];
    }

    /* ---------- C: the ear tour ---------- */
    if (sh === 'C') {
      const tNerve = at('nerve') - 0.06;
      // glows
      ear.hi('pinna', win(t, at('pinna'), mid('pinna', 0.55), 0.25));
      ear.hi('canal', win(t, mid('pinna', 0.5), at('drum'), 0.25));
      ear.hi('drum', win(t, at('drum') - 0.1, at('bones') + 0.2, 0.25));
      ear.hi('bones', win(t, at('bones'), mid('bones', 0.45), 0.25));
      ear.hi('cochlea', win(t, mid('bones', 0.42), tNerve + 0.4, 0.25));
      ear.hi('nerve', P(t, at('nerve'), 0.3, linear));
      // the wave comes in along the canal, then the ear drum keeps shivering
      let wp = 0;
      if (t < at('drum') - 0.06) wp = 0.94 * P(t, mid('pinna', 0.3), end('pinna') - mid('pinna', 0.3) + 0.2, linear);
      else if (t < at('bones') + 1) wp = 0.9 + 0.06 * Math.sin(t * 5);
      ear.wave(t, wp);
      // vibrations handed on to the bones and the cochlea
      const vb = win(t, at('bones') + 0.2, tNerve + 0.3, 0.3);
      op(vib, vb);
      vibArcs.forEach((g, i) => tr(g, [470, 590][i] + 6 * Math.sin(t * 9 + i) * AMP, [236, 228][i]));
      // nerve signals racing to the brain
      const sg = P(t, at('nerve') + 0.2, 0.3, linear);
      op(signals, sg); attr(signals, 'stroke-dashoffset', (-t * 160) % 58);
      op(brainGlow, sg * (0.5 + 0.5 * Math.abs(Math.sin(t * 4))));
      // labels: full while their line is on, dimmer afterwards
      const L = (el, t0, t1) => op(el, P(t, t0, 0.3, linear) * (t > t1 ? 0.5 : 1));
      L(Lpinna, mid('pinna', 0.1), mid('pinna', 0.6)); L(Lcanal, mid('pinna', 0.5), at('drum'));
      L(Ldrum, mid('drum', 0.18), at('bones')); L(LdrumS, mid('drum', 0.55), at('bones'));
      L(Lbones, mid('bones', 0.08), mid('bones', 0.45)); L(Lcoch, mid('bones', 0.4), at('nerve')); L(LcochS, mid('bones', 0.58), at('nerve'));
      L(Lnerve, mid('nerve', 0.25), 1e9);
      // Coco, the tour guide (bottom right); "It's a look": a smug pose with sparkles
      const look = P(t, mid('bones', 0.78), 0.3, ease) * (1 - P(t, at('nerve') - 0.1, 0.2, linear));
      show(coco, 1075, 604, 0.58 + 0.08 * look, { talk: cocoT, mood: look > 0.3 ? 'smug' : 'neutral', look: look > 0.3 ? 0 : -0.7 });
      tr(coco, 1075, 604 - 10 * look, 0.58 + 0.08 * look, -8 * look);
      sparkles.forEach((s, i) => { op(s, look * (0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i)))); tr(s, 1075 + [-80, 82, 92][i] * 0.7, 604 + [-104, -84, 30][i] * 0.7, 0.8 + 0.3 * Math.sin(t * 4 + i * 2)); });
    }

    /* ---------- D: the hearing range, ultrasound / infrasound ---------- */
    if (sh === 'D') {
      const isU = t >= at('ultra') - 0.06;
      op(dTitle, P(t, at('range'), 0.3, linear));
      const bpp = P(t, mid('range', 0.12), 0.6, ease);
      const age = P(t, mid('range', 0.82), 0.9, ease) * (isU ? 0 : 1);
      const right = 900 - 54 * age;
      op(band, bpp); attr(band, 'x', 300); attr(band, 'width', Math.max(1, (right - 300) * bpp));
      op(bandT, P(t, mid('range', 0.42), 0.3, linear));
      earPopAt(l20, t, mid('range', 0.12), 300, RY + 90); earPopAt(l20k, t, mid('range', 0.26), 900, RY + 90);
      op(lmin, P(t, mid('range', 0.12), 0.3, linear));
      const mp = P(t, mid('range', 0.6), 0.45, pop); op(mnem, clamp(mp * 2.5) * (isU ? 0 : 1)); tr(mnem, 600, 548, Math.max(0.01, 0.6 + 0.4 * mp), -3);
      op(older, P(t, mid('range', 0.84), 0.3, linear) * (isU ? 0 : 1));
      if (!isU) show(coco, 160, 612, 0.68, { talk: cocoT, mood: t > mid('range', 0.82) ? 'sad' : 'neutral', look: 0.6 });
      // ultra
      const ur = isU ? P(t, mid('ultra', 0.05), 0.35, linear) : 0, ir = isU ? P(t, mid('ultra', 0.42), 0.35, linear) : 0;
      op(shadeR, ur * 0.6); op(ultraL, ur); op(arR, ur); arR.set(P(t, mid('ultra', 0.05), 0.4));
      op(shadeL, ir * 0.6); op(infraL, ir); op(arL, ir); arL.set(P(t, mid('ultra', 0.42), 0.4));
      const ep = isU ? P(t, mid('ultra', 0.72), 0.45, pop) : 0;
      op(eleph, clamp(ep * 2.5)); tr(eleph, 170, 600, Math.max(0.01, 0.75 * (0.6 + 0.4 * ep)));
      tr(eleph.body, 0, Math.sin(t * 22) * 1.5 * AMP);
      rumble.set({ phase: t * 0.6 }); rumble2.set({ phase: t * 0.6 + 0.3 });
      if (isU) {
        const fl = t < mid('ultra', 0.42) ? 1 : (t < mid('ultra', 0.72) ? -1 : -0.6);
        show(freq, 600, 588, 0.78, { talk: scTalk(S, t, 'freq'), mood: 'happy', buzz: 1, look: fl });
      }
      cam = [1 + 0.02 * P(t, at('range'), 9, linear), 600, 375, 600, 375];
    }

    /* ---------- E: the dog whistle ---------- */
    if (sh === 'E') {
      const zr = P(t, at('dog'), 0.3, linear);
      op(zRuler, zr); op(wMark, P(t, mid('dog', 0.45), 0.3, linear));
      const rp = P(t, mid('dog', 0.06), 0.45, pop); op(realChip, clamp(rp * 2.5) * (1 - P(t, mid('dog', 0.4), 0.25, linear))); tr(realChip, 600, 340, Math.max(0.01, 0.6 + 0.4 * rp));
      earPop(hzChip, t, mid('dog', 0.55), rx(25000), 330, 1, -3);
      const blow = P(t, mid('dog', 0.35), 0.3, linear);
      tr(whistle, 610, 470 + 3 * Math.sin(t * 30) * blow * AMP, 1, -8);
      const arc = (a, i, dir) => { const f = (t * 0.9 + i / 3) % 1; tr(a, 610 + dir * (80 + f * 200), 470, 1 + f * 0.8); op(a, blow * Math.sin(f * Math.PI)); };
      wArcsR.forEach((a, i) => arc(a, i, 1)); wArcsL.forEach((a, i) => arc(a, i, -1));
      const up = P(t, mid('dog', 0.58), 0.3, pop);
      ears.forEach(({ g, sd }) => { tr(g, sd * 44, -44, 1, lerp(-sd * 25, 180 + sd * 20, clamp(up))); });
      tr(dogIn, 0, -10 * up * Math.abs(Math.sin(t * 8)) * AMP);
      tail.setAttribute('transform', `rotate(${(Math.sin(t * 14) * 14 * up * AMP).toFixed(1)} 120 70)`);
      earPopAt(dogBang, t, mid('dog', 0.6), 1010, 400);
      const nq = P(t, mid('dog', 0.86), 0.4, pop);
      op(kavQ, clamp(nq * 2.5)); tr(kavQ, 0, -12 * Math.abs(Math.sin(t * 3)) * AMP);
      op(nothing, clamp(nq * 2.5)); tr(nothing, 270, 712 - 22, Math.max(0.01, 0.6 + 0.4 * nq));
      show(kav, 270, 520, 1.12, { mood: t > mid('dog', 0.86) ? 'deadpan' : 'neutral', look: t > mid('dog', 0.6) && t < mid('dog', 0.86) ? 1 : 0 });
    }

    /* ---------- F: Coco vs the giant speaker ---------- */
    if (sh === 'F') {
      op(deskSigns, 0);
      tr(desk, 330, 486);
      const shake = (t < end('loud') ? 1 : 0) * AMP;
      show(coco, 300, 392, 1.15, { talk: cocoT, mood: 'annoyed', look: t > end('loud') - 0.3 ? 1 : 0.4, sweat: 0 });
      show(amp, 810, 470, 0.92, { mood: t > end('loud') ? 'sad' : 'smug', big: t > end('loud') ? 0.6 : 1, look: t > end('loud') ? -1 : 0 });
      cones.forEach((c, i) => tr(c, 0, [-90, 70][i], 1 + 0.06 * Math.sin(t * 40 + i) * shake));
      blast.forEach((a, i) => { const f = (t * 1.2 + i / 4) % 1; tr(a, 960 - f * 420, 400 + (i % 2 ? 30 : -30), 1 + f * 0.5); op(a, Math.sin(f * Math.PI) * 0.9 * (t < end('loud') + 0.1 ? 1 : 0)); });
      op(warn, P(t, at('loud'), 0.25, linear));
      op(w1, P(t, mid('loud', 0.05), 0.3, linear)); op(w2, P(t, mid('loud', 0.45), 0.3, linear));
      const pp = P(t, mid('loud', 0.82), 0.4, pop); op(permChip, clamp(pp * 2.5)); tr(permChip, 800, 272, Math.max(0.01, 0.6 + 0.4 * pp), -4);
      cam = [1.02, 600 + Math.sin(t * 47) * 4 * shake, 375 + Math.cos(t * 53) * 3 * shake, 600, 375];
    }

    /* ---------- G: SORRY. ---------- */
    if (sh === 'G') {
      const sp = P(t, at('sorry') + 0.05, 0.7, ease);
      show(amp, 420, 440, 1.45, { talk: scTalk(S, t, 'amp'), mood: 'sad', big: 1 - sp, look: 0 });
      op(sorryT, 1); tr(sorryT, 870, 230, Math.max(0.01, 1 - 0.55 * sp));
      const dp = P(t, end('sorry') - 0.1, 0.4, pop); op(defenders, clamp(dp * 2.5)); tr(defenders, 870, 420, Math.max(0.01, 0.6 + 0.4 * dp));
      const vp = P(t, end('sorry') + 0.1, 0.4, pop); op(vol, clamp(vp * 2.5)); tr(vol, 870, 600, Math.max(0.01, 0.6 + 0.4 * vp));
      const k = P(t, end('sorry') + 0.25, 0.45, ease); attr(volKnob, 'cx', lerp(120, -60, k)); attr(volFill, 'width', lerp(240, 60, k));
      cam = [1 + 0.05 * P(t, at('sorry'), 1.6, linear), 420, 440, 420, 440];
    }

    /* ---------- H: the hall: sound reflects off the tiled wall ---------- */
    if (sh === 'H') {
      hall.upd(t);
      op(kavBodyW, 1); tr(kavBodyW, 470, 700, 1.05); kavBody.pose({ armL: [10, 14], armR: [100, 40] });
      op(triH, 1); tr(triH, 545, 578); triH.set({ t, ring: 1, beater: false });
      show(echo, 1080, 280, 0.95, { mood: 'deadpan', look: -0.8, ghost: t > mid('reflect', 0.6) ? 0.4 : 0 });
      const on = P(t, at('reflect'), 0.3, linear);
      outArcs.forEach((a, i) => { const f = ((t - at('reflect')) * 0.45 + i / 3 + 3) % 1;
        const out = f < 0.5; const x = out ? lerp(600, 950, f / 0.5) : lerp(950, 520, (f - 0.5) / 0.5);
        op(a, out ? on * 0.95 : 0); op(backArcs[i], out ? 0 : on * 0.95 * (1 - 0.6 * (f - 0.5) / 0.5));
        tr(a, x, 530 - 60 * (out ? f / 0.5 : 1), 1); tr(backArcs[i], x, 470 + 30 * (f - 0.5) / 0.5, 1); });
      const rp = P(t, mid('reflect', 0.08), 0.45, pop); op(refChip, clamp(rp * 2.5)); tr(refChip, 700, 150, Math.max(0.01, 0.6 + 0.4 * rp));
      const ep = P(t, mid('reflect', 0.55), 0.45, pop); op(echoCard, clamp(ep * 2.5)); echoCard.setAttribute('transform', `translate(900 590) scale(${Math.max(0.01, 0.7 + 0.3 * ep).toFixed(3)}) translate(-900 -590)`);
      cam = [1 + 0.02 * P(t, at('reflect'), 8, linear), 700, 400, 700, 400];
    }

    /* ---------- I / J: Echo on the wall, then the curtains ---------- */
    if (sh === 'I' || sh === 'J') {
      const peek = sh === 'J' ? P(t, at('mmf') - 0.15, 0.35, easeOut) : 0;
      const eTalk = scTalk(S, t, 'echo');
      show(echo, 640, lerp(400, 172, peek), 1.6, { talk: eTalk, mood: 'deadpan', ghost: scWho(S, t) === 'echo' ? 1 : 0.2, look: sh === 'J' && t < at('mmf') ? -0.6 : 0 });
      if (sh === 'I') {
        eT1.set(P(t, mid('echo', 0.15), 0.25, linear), t); tr(eT1, 640, 150);
        cam = [1 + 0.05 * P(t, at('echo'), 1.8, linear), 640, 400, 640, 400];
      } else {
        const cp = P(t, at('absorb') + 0.1, 1.6, ease);
        curt.set(cp);
        const ac = P(t, mid('absorb', 0.12), 0.45, pop); op(absChip, clamp(ac * 2.5) * (1 - P(t, at('mmf') - 0.2, 0.2, linear))); tr(absChip, 700, 140, Math.max(0.01, 0.6 + 0.4 * ac));
        op(curtLab, win(t, mid('absorb', 0.3), at('mmf') - 0.1, 0.25)); tr(curtLab, 380, 300, 1, -4);
        const cw = P(t, mid('absorb', 0.4), 0.9, ease); attr(carpet, 'width', Math.max(1, 1200 * cw)); op(carpet, cw > 0 ? 1 : 0);
        op(carpLab, win(t, mid('absorb', 0.5), at('mmf') - 0.1, 0.25)); tr(carpLab, 1050, 640);
        absArcs.forEach((a, i) => { const f = ((t - at('absorb')) * 0.7 + i / 3 + 3) % 1; const xe = lerp(560, 270, cp);
          tr(a, lerp(40, xe, f), 420 + (i - 1) * 50, 1 - 0.7 * Math.max(0, f - 0.75) / 0.25); op(a, (t < end('absorb') + 0.2 ? 1 : 0) * Math.min(1, f * 4) * (f > 0.8 ? (1 - f) / 0.2 : 1)); });
        eT2.set(P(t, mid('mmf', 0.2), 0.25, linear), t); tr(eT2, 960, 150);
        cam = [1 + 0.08 * P(t, at('mmf'), 2.2, linear), 640, 230, 640, 230];
      }
    }

    /* ---------- L: ultrasound scans and cleaning ---------- */
    if (sh === 'L') {
      const sw = t < mid('scans', 0.6);
      show(freq, 300, 430, 1.2, { talk: scTalk(S, t, 'freq'), mood: 'happy', buzz: 1, look: 0.7 });
      tr(bubTea, 160, 560, 0.9, -10);
      earPop(usChip, t, at('scans') + 0.1, 840, 112, 1, -2);
      op(scanG, sw ? P(t, mid('scans', 0.12), 0.25, linear) : 0);
      op(baby, P(t, mid('scans', 0.3), 0.5, linear));
      const sa = Math.sin(t * 2) * 28; scanSweep.setAttribute('transform', `rotate(${sa.toFixed(1)} 840 190)`);
      op(cleanG, sw ? 0 : 1);
      fizz.forEach((f, i) => { const q = (t * 1.4 + i / 4) % 1; tr(f, 760 + i * 50 + 4 * Math.sin(t * 30 + i), 440 - q * 120); op(f, Math.sin(q * Math.PI)); });
      tr(ringJ, 840, 390 + 2 * Math.sin(t * 40) * AMP);
      cam = [1 + 0.03 * P(t, at('scans'), 7, linear), 600, 375, 600, 375];
    }

    /* ---------- M / M2: sonar ---------- */
    if (sh === 'M' || sh === 'M2') {
      const isHalf = sh === 'M2';
      let p = 0;
      if (!isHalf) p = t < at('sum') - 0.06 ? P(t, at('sonar') + 0.3, end('sonar') - at('sonar') - 0.3, linear) : 1 + P(t, at('sum'), mid('sum', 0.4) - at('sum'), linear);
      sea.set({ p: isHalf ? 0 : (p >= 2 ? 0 : p) });
      const secs = isHalf ? 4 : 2 * clamp(p, 0, 2);
      setText(watchT, secs.toFixed(1) + ' s');
      op(watch, isHalf ? 0 : P(t, at('sonar') + 0.2, 0.3, linear));
      const sc = P(t, mid('sonar', 0.02), 0.45, pop);
      op(sonarChip, isHalf ? 0 : clamp(sc * 2.5) * (1 - P(t, at('sum') - 0.1, 0.2, linear))); tr(sonarChip, 660, 340, Math.max(0.01, 0.6 + 0.4 * sc), -3);
      op(pulseLab, isHalf ? 0 : win(t, mid('sonar', 0.3), at('sum'), 0.25));
      // the sum
      op(sumG, isHalf ? 0 : 1);
      if (!isHalf) {
        earPop(sumA, t, mid('sum', 0.12), 660, 330); earPop(sumB, t, mid('sum', 0.42), 660, 410); earPop(sumC, t, mid('sum', 0.75), 660, 492);
        op(think, P(t, end('sum'), 0.2, linear)); tr(think, 660, 590); think.set(P(t, end('sum'), at('times') - end('sum'), linear));
      }
      op(depthR, P(t, mid('sum', 0.75), 0.3, linear)); op(depthQ, isHalf ? 0 : 1); op(depthA, isHalf ? P(t, mid('half', 0.72), 0.3, linear) : 0);
      // the half
      op(halfG, isHalf ? 1 : 0);
      if (isHalf) {
        arDown.set(P(t, at('half') + 0.05, 0.6)); arUp.set(P(t, at('half') + 0.55, 0.6));
        earPop(hA, t, mid('half', 0.08), 660, 330);
        earPopAt(hB, t, mid('half', 0.42), 660, 420);
        earPop(hC, t, mid('half', 0.7), 660, 540, 1, -2);
      }
      // Nigel and Archie on video calls
      const nMood = isHalf ? 'deadpan' : 'neutral';
      nigel.set({ t, talk: scTalk(S, t, 'nigel'), mood: nMood, look: isHalf ? -0.6 : -0.3 });
      const aOn = isHalf ? 1 : P(t, end('sum') - 0.4, 0.3, linear);
      op(callA, aOn);
      archieC.set({ t, talk: 0, mood: isHalf ? (t > mid('half', 0.15) ? 'shock' : 'happy') : 'neutral', look: isHalf ? -0.5 : 0, sweat: isHalf ? 0 : 1 });
      cam = [1, 600, 375, 600, 375];
    }

    /* ---------- N: Archie's whiteboard ---------- */
    if (sh === 'N') {
      show(archie, 1000, 440, 1.2, { talk: scTalk(S, t, 'archie'), mood: 'happy', bounce: 1, look: -0.8 });
      op(bd1, P(t, mid('times', 0.05), 0.3, linear)); op(bd2, P(t, mid('times', 0.5), 0.3, linear)); op(bdU, P(t, mid('times', 0.8), 0.3, linear));
      cam = [1 + 0.03 * P(t, at('times'), 3, linear), 600, 375, 600, 375];
    }

    /* ---------- O: "I knew that." ---------- */
    if (sh === 'O') {
      show(archie, 430, 410, 1.5, { talk: scTalk(S, t, 'archie'), mood: 'smug', look: 0, sweat: P(t, mid('knew', 0.6), 0.3, linear) });
      cam = [1 + 0.05 * P(t, at('knew'), 1.2, linear), 430, 400, 430, 400];
    }

    /* ---------- P: Echo: "...knew that." Archie stares at the wall ---------- */
    if (sh === 'P') {
      show(echo, 800, 380, 1.5, { talk: scTalk(S, t, 'echo'), mood: 'deadpan', ghost: scWho(S, t) === 'echo' ? 1 : 0.2, look: t > end('echo2') + 0.3 ? -0.5 : 0 });
      const turn = P(t, mid('echo2', 0.3), 0.3, ease);
      show(archie, 250, 560, 1.15, { mood: t > end('echo2') + 0.2 ? 'deadpan' : (turn > 0.5 ? 'shock' : 'smug'), look: turn, sweat: 0.5 * (1 - turn) });
      eT3.set(P(t, mid('echo2', 0.15), 0.25, linear), t); tr(eT3, 800, 130);
      const push = P(t, at('echo2'), S.D - at('echo2'), linear);
      cam = [1 + 0.08 * push, 520, 420, 520, 420];
    }

    earCam(cam[0], cam[1], cam[2], cam[3], cam[4]);
  };
});

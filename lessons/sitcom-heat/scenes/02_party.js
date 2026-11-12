/* Scene 2: The particle party.
   Shots (hard sitcom cuts): Kavya's glass of iced water, documentary zoom x1 000 000 into one ice cube
   -> inside the ice: a lattice of water particles; Gus turns to camera (H2O) -> solid: vibrate in place
   (the chicken-rice queue) -> Jules delivers thermal energy, the particles vibrate faster -> kinetic energy,
   the lattice breaks into a sliding liquid -> speed bars stack into THERMAL ENERGY (total), Jules is
   offended -> the bars line up: TEMPERATURE = average -> quiz: tea 80 °C or pool 30 °C? -> few fast vs many
   slow, thermal energy bars -> Kavya's answer card, Cel's gold star -> a drop of sweat on Kavya's arm
   (Gus inside, "don't ask how") -> evaporation: the fastest escape, the rest cool -> Gus' confessional, a gas. */
scene('party', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK, SKIN = '#B9784E';

  /* ---------- local helpers (prefixed pty) ---------- */
  const ptyPop = (el, x, y, p, s0, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s0 || 1) * (0.65 + 0.35 * p)), r); };
  const ptyCam = (el, k, px, py, sx, sy) => el.setAttribute('transform', `translate(${(sx - k * px).toFixed(1)} ${(sy - k * py).toFixed(1)}) scale(${k.toFixed(4)})`);
  const ptyBounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  // text with real subscripts: 'H_2O' -> H₂O ; '**bold**' segments use o.boldFill
  function ptyRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.26);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
    let low = false;
    const push = (txt, isSub, bold) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (bold) { ts.setAttribute('font-weight', 800); if (o.boldFill) ts.setAttribute('fill', o.boldFill); }
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
      inner.split(/(_\d+)/).forEach(p => { if (!p) return; if (p[0] === '_') push(p.slice(1), true, bold); else push(p, false, bold); });
    });
    return t;
  }
  // dark pill with rich text, centred on its origin
  function ptyChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.7);
    const plain = str.replace(/\*\*/g, '').replace(/_(\d)/g, '$1');
    const w = textWidth(plain, size, FD, 800) + size * 1.4;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    ptyRich(g, 0, size * 0.35, str, { size, color: o.color, fill: o.color || C.ink, boldFill: o.boldFill });
    g.w = w;
    return g;
  }
  // a small framed "on his nail" inset of Cel (the frame only; Cel himself is drawn by the cast layer)
  function ptyCelFrame(parent) {
    const g = G(parent);
    E('rect', { x: -110, y: -140, width: 220, height: 280, rx: 16, fill: linGrad('#EAF0E4', '#D7E2CF', true), stroke: '#FFFFFF', 'stroke-width': 6 }, g);
    T(g, -96, -112, 'CEL-CAM', { size: 22, weight: 800, fill: '#C62828' });
    return g;
  }

  /* layers */
  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the glass, and the zoom ================= */
  const zoomShot = G(Lbg), zoomWrap = G(zoomShot);
  const kit = bkKitchen(zoomWrap);
  const glass = bkGlass(zoomWrap, 1.8); tr(glass, 560, 347);
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#DDF6FF' }, zoomShot);
  const reticle = G(Lfg);
  { let d = ''; [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { d += `M${sx * 150},${sy * 110} L${sx * 150},${sy * 150} L${sx * 110},${sy * 150} `; }); E('path', { d, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, reticle); }
  E('path', { d: 'M-30,0 L30,0 M0,-30 L0,30', stroke: '#FFFFFF', 'stroke-width': 4 }, reticle);
  E('circle', { r: 50, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '6 8' }, reticle);
  const zoomChip = chip(Lfg, 'ZOOM ×1 000 000', { size: 40, fill: 'rgba(10,27,39,0.9)', stroke: '#FF3B3B', sw: 3, color: '#FFFFFF' });
  const zoomRec = E('circle', { cx: 0, cy: 0, r: 10, fill: '#FF3B3B' }, Lfg);

  /* ================= B: inside the ice: the lattice ================= */
  const latShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E4F7FF', '#9AD8F5', true) }, latShot);
  const latLiq = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5CC6F0', '#1D6E9A', true) }, latShot);
  const latPart = G(Lmid);
  const COLS = [330, 470, 610, 750, 890, 1030], ROWS = [200, 320, 440, 560], GUS = [680, 380];
  const r1 = rng(34), mols = [];
  ROWS.forEach(ly => COLS.forEach(lx => {
    if (Math.abs(lx - GUS[0]) < 100 && Math.abs(ly - GUS[1]) < 100) return;
    const g = G(latPart); [-1, 1].forEach(sd => E('circle', { cx: sd * 23.5, cy: 17.3, r: 14.9, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 1.5 }, g)); E('circle', { r: 24, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 2 }, g);
    mols.push({ g, lx, ly, jx: lx + (r1() - 0.5) * 70, jy: ly + 20 + (r1() - 0.5) * 60, ph: r1() * TAU, rot: r1() * 360, sp: 0.25 + 0.75 * r1() });
  }));
  // the speed bars (one per particle)
  const barsG = G(Lfg);
  const bars = mols.map(m => E('rect', { x: -13, y: 0, width: 26, height: 10, rx: 5, fill: C.heat, stroke: '#FFFFFF', 'stroke-width': 2 }, barsG));
  const H1 = m => 18 + 34 * m.sp, HC = m => 40 + 180 * m.sp;
  const sumH = mols.reduce((a, m) => a + H1(m), 0), KST = 430 / sumH;
  const meanHC = mols.reduce((a, m) => a + HC(m), 0) / mols.length;
  const avgLine = G(Lfg);
  E('line', { x1: 300, y1: 0, x2: 1060, y2: 0, stroke: '#FFE45C', 'stroke-width': 6, 'stroke-dasharray': '18 10' }, avgLine);
  T(avgLine, 1070, 10, 'average', { size: 30, weight: 800, fill: '#FFE45C' });
  // the chicken-rice queue (inset)
  const queue = G(Lfg); tr(queue, 960, 150);
  E('rect', { x: -190, y: -100, width: 380, height: 210, rx: 16, fill: '#FFF3DE', stroke: '#FFFFFF', 'stroke-width': 6 }, queue);
  E('rect', { x: 100, y: -78, width: 76, height: 150, fill: '#C2453A', stroke: INK, 'stroke-width': 3 }, queue);
  T(queue, 138, -40, 'CHICKEN', { size: 15, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(queue, 138, -20, 'RICE', { size: 15, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('rect', { x: -190, y: 72, width: 380, height: 38, fill: '#C9B48E' }, queue);
  const people = [];
  ['#2E7DD8', '#E8424F', '#56D69B', '#B48CFF', '#FFC247'].forEach((c, i) => {
    const p = G(queue);
    E('rect', { x: -13, y: -10, width: 26, height: 46, rx: 10, fill: c, stroke: INK, 'stroke-width': 2.5 }, p);
    E('circle', { cx: 0, cy: -24, r: 14, fill: '#E8B48E', stroke: INK, 'stroke-width': 2.5 }, p);
    people.push({ p, x: 60 - i * 52 });
  });
  const queueLbl = T(Lfg, 960, 300, 'the queue for chicken rice', { size: 26, weight: 700, anchor: 'middle', fill: '#14243A' });
  // Jules' sparks
  const sparks = [];
  for (let i = 0; i < 10; i++) { const s = G(Lfg); E('circle', { r: 18, fill: glow(C.heat) }, s); E('circle', { r: 7, fill: '#FFE45C' }, s); sparks.push(s); }
  const speedM = meter(Lfg, { w: 300, h: 30, color: C.heat, label: 'particle speed', labelSize: 28, labelFill: '#14243A' });
  const celFrameL = ptyCelFrame(Lmid);

  /* ================= C: the quiz, tea vs pool ================= */
  const quizShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 600, height: 750, fill: linGrad('#4A1E0E', '#8A4420', true) }, quizShot);
  E('rect', { x: 600, y: 0, width: 600, height: 750, fill: linGrad('#0E3A5A', '#1D84A6', true) }, quizShot);
  E('line', { x1: 600, y1: 0, x2: 600, y2: 750, stroke: '#FFFFFF', 'stroke-width': 6 }, quizShot);
  const tea = bkTea(Lmid, 1.6), pool = bkPool(Lmid, 1.2);
  const teaBox = G(Lmid), poolBox = G(Lmid);
  E('rect', { x: 200, y: 260, width: 200, height: 200, rx: 18, fill: '#6E3A1A', stroke: '#FFFFFF', 'stroke-width': 5 }, teaBox);
  E('rect', { x: 660, y: 240, width: 480, height: 220, rx: 18, fill: '#1D6E9A', stroke: '#FFFFFF', 'stroke-width': 5 }, poolBox);
  const r2 = rng(80);
  const teaP = [], poolP = [];
  for (let i = 0; i < 6; i++) teaP.push({ ln: E('line', { stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, teaBox), c: E('circle', { r: 13, fill: ball(C.oxygen, C.oxygenDk) }, teaBox), x: r2(), y: r2(), a: r2() * TAU });
  for (let i = 0; i < 30; i++) poolP.push({ c: E('circle', { r: 10, fill: ball(C.oxygen, C.oxygenDk) }, poolBox), x: r2(), y: r2(), a: r2() * TAU });
  const c80 = chip(Lfg, '80 °C', { size: 50, fill: '#D32F2F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const c30 = chip(Lfg, '30 °C', { size: 50, fill: '#1F5FBF', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const bigQ = T(Lfg, 0, 60, '?', { size: 180, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const quizQ = ptyChip(Lfg, 'Which has more **thermal energy**?', { size: 34, boldFill: C.heat });
  const descT = T(Lfg, 300, 500, 'few, fast', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE45C' });
  const descP = T(Lfg, 900, 500, 'many, slower', { size: 30, weight: 700, anchor: 'middle', fill: '#BFEAFF' });
  const teBars = G(Lfg);
  T(teBars, 200, 545, 'thermal energy', { size: 26, weight: 700, fill: C.ink });
  T(teBars, 660, 545, 'thermal energy', { size: 26, weight: 700, fill: C.ink });
  const teaBar = E('rect', { x: 200, y: 560, width: 10, height: 30, rx: 8, fill: C.heat }, teBars);
  const poolBar = E('rect', { x: 660, y: 560, width: 10, height: 30, rx: 8, fill: C.heat }, teBars);
  const hotter = chip(Lfg, 'hotter', { size: 34, fill: '#D32F2F', color: '#FFFFFF' });
  const more = chip(Lfg, 'more thermal energy', { size: 34, fill: C.heat, color: '#3A1600' });

  /* ================= D: Kavya's answer, Cel's star (kitchen) ================= */
  const kitShot2 = zoomShot, kitWrap2 = zoomWrap;   // the same kitchen, without the glass
  const ansCard = G(Lfg);
  E('rect', { x: -250, y: -95, width: 500, height: 190, rx: 20, fill: 'rgba(10,27,39,0.94)', stroke: C.line, 'stroke-width': 4 }, ansCard);
  const ans1 = T(ansCard, -220, -18, 'tea: **hotter** (temperature)', { size: 36, weight: 600, boldFill: '#FF8A8A' });
  const ans2 = T(ansCard, -220, 50, 'pool: **more heat**', { size: 36, weight: 600, boldFill: C.heat });
  const star = G(ansCard);
  { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 50; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: ball('#FFE45C', '#E0A800'), stroke: '#8A6500', 'stroke-width': 4, 'stroke-linejoin': 'round' }, star); }
  const thinkDots = [0, 1, 2].map(i => E('circle', { r: 10 + i * 4, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, Lfg));

  /* ================= E: a drop of sweat on Kavya's arm ================= */
  const armShot = G(Lbg), armWrap = G(armShot);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F4E6C8', '#D9BE8E', true) }, armWrap);
  E('rect', { x: -60, y: 392, width: 1320, height: 420, rx: 200, fill: SKIN, stroke: INK, 'stroke-width': 6 }, armWrap);
  E('path', { d: 'M40,470 Q600,440 1160,470', fill: 'none', stroke: '#A0663F', 'stroke-width': 6, opacity: 0.6 }, armWrap);
  E('path', { d: 'M180,430 l14,-10 M300,424 l12,-12 M860,424 l14,-10 M980,430 l12,-12', stroke: '#6E4428', 'stroke-width': 3, 'stroke-linecap': 'round' }, armWrap);
  E('path', { d: 'M470,396 Q468,232 600,226 Q732,232 730,396 Z', fill: '#BFEAFF', opacity: 0.78, stroke: '#5AB4E0', 'stroke-width': 5 }, armWrap);
  E('path', { d: 'M512,330 Q520,268 566,252', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.85 }, armWrap);
  const armQ = T(Lfg, 0, 50, '?', { size: 150, weight: 800, anchor: 'middle', fill: '#2A5A9A' });
  const askChip = chip(Lfg, "Don't ask how.", { size: 38, fill: 'rgba(10,27,39,0.9)', color: '#FFFFFF' });
  const sweatChip = chip(Lfg, 'a drop of sweat', { size: 34, fill: 'rgba(10,27,39,0.9)', color: '#9FD8FF' });

  /* ================= F: inside the drop: evaporation ================= */
  const dropShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2FAFF', '#CFEAF8', true) }, dropShot);
  const SURF = x => 300 + Math.pow((x - 560) / 560, 2) * 70;
  { let d = 'M-10,750 L-10,' + SURF(-10).toFixed(0); for (let x = 0; x <= 1210; x += 30) d += ` L${x},${SURF(x).toFixed(1)}`; d += ' L1210,750 Z';
    E('path', { d, fill: linGrad('#6FD3F7', '#1D84A6', true), stroke: '#FFFFFF', 'stroke-width': 6 }, dropShot); }
  E('rect', { x: 0, y: 680, width: 1200, height: 70, fill: SKIN }, dropShot);
  T(dropShot, 1170, 728, 'skin', { size: 28, weight: 700, anchor: 'end', fill: '#FFE9D6' });
  T(dropShot, 60, 220, 'air', { size: 34, weight: 700, anchor: 'start', fill: '#5A8AA8' });
  const dropP = G(Lmid), r3 = rng(51), drops = [];
  for (let i = 0; i < 18; i++) {
    const g = dropP;
    const ln = E('line', { stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.75 }, g);
    const c = E('circle', { r: 15, fill: ball(C.oxygen, C.oxygenDk), stroke: '#FFFFFF', 'stroke-width': 2 }, g);
    drops.push({ g, ln, c, x: r3(), y: r3(), a: r3() * TAU, v: 0.2 + 0.5 * r3(), esc: -1 });
  }
  [3, 8, 12, 16].forEach((k, j) => { drops[k].v = 0.95 + 0.05 * j; drops[k].esc = j; });
  const ESC_T = j => mid('escape', 0.32 + 0.11 * j);
  const evapChip = ptyChip(Lfg, '**EVAPORATION**: the fastest particles escape', { size: 32, boldFill: '#9FD8FF' });
  const later = chip(Lfg, 'Later!', { size: 36, fill: '#FFFFFF', color: '#14243A', stroke: INK, sw: 3 });
  const avgM = meter(Lfg, { w: 300, h: 30, color: C.heat, label: 'average speed', labelSize: 28, labelFill: '#14243A' });
  const dropTh = thermometer(Lfg, 220, '#FF4D4D');
  const coolCard = ptyChip(Lfg, 'evaporation **cools**: sweating cools you', { size: 34, boldFill: '#9FD8FF' });
  const celFrameR = ptyCelFrame(Lmid);

  /* ================= G: Gus' confessional ================= */
  const conf = bkConfessional(Lbg, 'gus');
  const gas = particleBox(Lmid, 470, 400, { n: 9, r: 18, state: 'gas', box: false, color: C.oxygen, dark: C.oxygenDk, seed: 9 });
  tr(gas, 680, 130);
  const gasChip = ptyChip(Lfg, '**GAS**: far apart, moving freely', { size: 34, boldFill: '#FFB45C' });
  const shades = G(Lfg);
  [-1, 1].forEach(sd => E('rect', { x: sd * 26 - 23, y: -12, width: 46, height: 28, rx: 10, fill: '#1C2430', stroke: INK, 'stroke-width': 3 }, shades));
  E('path', { d: 'M-4,-2 Q0,-6 4,-2', fill: 'none', stroke: INK, 'stroke-width': 3 }, shades);

  /* ================= the cast ================= */
  const gus = cast(Lcast, 'gus', { mood: 'smug' });
  const jules = cast(Lcast, 'jules', { mood: 'happy' });
  const cel = cast(Lcast, 'cel', { mood: 'deadpan' });
  const kav = cast(Lcast, 'kavya', { mood: 'neutral' });

  /* ================= labels ================= */
  const cEvery = ptyChip(Lfg, '**particles**: always moving', { size: 36, boldFill: '#FFE45C' });
  const cH2O = ptyChip(Lfg, 'H_2O', { size: 50, color: '#FFFFFF' });
  const cSolid = ptyChip(Lfg, '**SOLID**: vibrate in fixed places', { size: 34, boldFill: '#9FD8FF' });
  const cKE = ptyChip(Lfg, '**kinetic energy** = energy of movement', { size: 34, boldFill: C.heat });
  const cMelt = ptyChip(Lfg, 'faster → the ice **melts**', { size: 34, boldFill: '#9FD8FF' });
  const cLiq = ptyChip(Lfg, '**LIQUID**: close together, slide past each other', { size: 32, boldFill: '#9FD8FF' });
  const cTE = ptyChip(Lfg, '**THERMAL ENERGY**', { size: 32, boldFill: C.heat });
  const cTot = ptyChip(Lfg, '= **total** kinetic energy of **ALL** the particles', { size: 32, boldFill: C.heat });
  const cAvg = ptyChip(Lfg, '**TEMPERATURE** = **average** kinetic energy', { size: 34, boldFill: '#FF8A8A' });
  const ltGus = scLowerThird(Lhud, 'GUS', 'Water particle. H2O. Very chill.');
  { // give the lower third's H2O a real subscript
    const role = ltGus.querySelectorAll('text')[1];
    role.textContent = '';
    [['Water particle. H', 0], ['2', 1], ['O. Very chill.', -1]].forEach(([s, d]) => { const ts = E('tspan', {}, role); ts.textContent = s; if (d > 0) { ts.setAttribute('font-size', 17); ts.setAttribute('dy', 7); } else if (d < 0) ts.setAttribute('dy', -7); });
  }
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lhud);

  /* ---------- shot list ---------- */
  const SH = [['zoom', -1e9], ['lat', at('every') - 0.1], ['quiz', at('quiz') - 0.1], ['kav', at('got') - 0.1],
    ['celC', at('correct') - 0.08], ['arm', at('sweat') - 0.1], ['drop', at('escape') - 0.1], ['gconf', at('thgus') - 0.1]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const FG = [reticle, zoomChip, zoomRec, barsG, avgLine, queue, queueLbl, speedM, c80, c30, bigQ, quizQ, descT, descP, teBars, hotter, more,
    ansCard, armQ, askChip, sweatChip, evapChip, later, avgM, dropTh, coolCard, gasChip, shades,
    cEvery, cH2O, cSolid, cKE, cMelt, cLiq, cTE, cTot, cAvg, ...thinkDots, ...sparks];
  const MID = [latPart, celFrameL, tea, pool, teaBox, poolBox, dropP, celFrameR, gas];

  return t => {
    op(blackout, 1 - P(t, at('zoom') - 0.3, 0.4, linear));
    const sid = shotAt(t), talk = who => scTalk(S, t, who);
    FG.forEach(e => op(e, 0)); MID.forEach(e => op(e, 0));
    op(zoomShot, sid === 'zoom' || sid === 'kav' || sid === 'celC' ? 1 : 0); op(glass, sid === 'zoom' ? 1 : 0); op(flash, 0); op(latShot, sid === 'lat' ? 1 : 0); op(quizShot, sid === 'quiz' ? 1 : 0);
    op(armShot, sid === 'arm' ? 1 : 0); op(dropShot, sid === 'drop' ? 1 : 0);
    conf.set(sid === 'gconf' ? 1 : 0, t);
    ltGus.set(win(t, at('gus') + 0.2, at('gus') + 3.4, 0.3));
    let gusP = null, julP = null, celP = null, kavP = null;

    /* ---------- A: the zoom ---------- */
    if (sid === 'zoom') {
      const z = P(t, mid('zoom', 0.3), end('zoom') - mid('zoom', 0.3) + 0.15, easeIn);
      const k = Math.exp(Math.log(14) * z);
      ptyCam(zoomWrap, k, 560, 340, 600, 375);
      op(flash, P(t, end('zoom') - 0.2, 0.35, linear));
      kavP = { x: 600 + k * (900 - 560), y: 375 + k * (560 - 340), s: 1.3 * k, mood: 'neutral', look: -0.8, sweat: 1 };
      op(reticle, P(t, at('zoom') + 0.2, 0.3, linear)); tr(reticle, 600, 375, 1 + 0.06 * Math.sin(t * 4) * AMP);
      const steps = ['×1', '×10', '×100', '×1 000', '×10 000', '×100 000', '×1 000 000'];
      setText(zoomChip.label, 'ZOOM ' + steps[Math.min(6, Math.floor(P(t, mid('zoom', 0.3), end('zoom') - mid('zoom', 0.3), linear) * 7))]);
      op(zoomChip, P(t, at('zoom') + 0.3, 0.3, linear)); tr(zoomChip, 420, 660);
      op(zoomRec, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); attr(zoomRec, 'cx', 420 - zoomChip.w / 2 - 26); attr(zoomRec, 'cy', 660);
    }

    /* ---------- B: inside the ice ---------- */
    if (sid === 'lat') {
      op(latPart, 1);
      // energy: rises as Jules' parcels land
      const e = 0.12 + 0.88 * P(t, at('here') + 1.0, end('faster') - at('here') - 0.6, ease);
      const lp = P(t, mid('ke', 0.45), 2.4, ease);               // solid -> liquid
      op(latLiq, lp);
      // Gus
      const gx = GUS[0] + lp * 80 * Math.sin((t - mid('ke', 0.45)) * 0.8) * AMP, gy = GUS[1] + lp * 30 * Math.sin((t - mid('ke', 0.45)) * 1.3) * AMP;
      let gMood = 'smug';
      if (t >= at('solid') && t < at('here')) gMood = 'deadpan';
      if (t >= at('here') - 0.2 && t < at('faster')) gMood = 'neutral';
      if (t >= at('faster')) gMood = t < mid('faster', 0.45) ? 'shock' : 'happy';
      if (t >= at('total')) gMood = t >= at('rude') && t < at('average') ? 'neutral' : 'happy';
      const avgOn = t >= at('average') - 0.1, totOn = t >= at('total') && !avgOn;
      const dimP = avgOn ? 0.18 : 1;
      const gusIn = P(t, at('gus') + 0.05, 0.45, pop);
      gusP = { x: gx, y: gy, s: (t < at('gus') ? 0.32 : 0.32 + 0.48 * gusIn), r: lp * 12 * Math.sin(t * 0.9) * AMP, mood: t < at('gus') ? 'neutral' : gMood, look: t >= at('here') && t < at('ke') ? -0.8 : 0, ice: 1 - lp, vib: (t < at('gus') ? 0.3 : 0.3) + 0.7 * (e - 0.12) * (1 - lp), op: dimP };
      // the particles
      mols.forEach((m, i) => {
        const amp = (1 + 7 * e) * AMP;
        const sx = m.lx + Math.sin(t * 19 + m.ph) * amp, sy = m.ly + Math.cos(t * 23 + m.ph) * amp;
        const ts = t - mid('ke', 0.45);
        const qx = m.jx + Math.sin(ts * 0.6 + m.ph) * 34 * AMP + Math.sin(t * 9 + m.ph) * 3, qy = m.jy + Math.cos(ts * 0.8 + m.ph) * 12 * AMP;
        const x = lerp(sx, qx, lp), y = lerp(sy, qy, lp);
        m.x = x; m.y = y;
        let o = 1;
        if (lp > 0) { const d = Math.hypot(x - gx, y - gy); o = clamp((d - 100) / 40); }
        op(m.g, o * dimP);
        tr(m.g, x, y, 1, m.rot * lp + Math.sin(t * 17 + m.ph) * 6 * e + (1 - lp) * 0);
      });
      // labels
      op(cEvery, win(t, mid('every', 0.4), at('gus') + 0.1, 0.3)); tr(cEvery, 600, 690);
      const hp = P(t, mid('gus', 0.5), 0.45, pop);
      if (t < at('here')) ptyPop(cH2O, 1000, 690, hp);
      ptyPop(cSolid, 600, 690, P(t, mid('solid', 0.12), 0.45, pop)); op(cSolid, t < at('solid') ? 0 : clamp(P(t, mid('solid', 0.12), 0.45, pop) * 2.5) * (1 - P(t, at('ke'), 0.3, linear)));
      // the queue inset
      const qp = P(t, mid('solid', 0.5), 0.45, pop);
      if (t >= mid('solid', 0.5) && t < at('here') + 0.3) {
        ptyPop(queue, 960, 150, qp); op(queueLbl, P(t, mid('solid', 0.6), 0.3, linear));
        people.forEach(({ p, x }, i) => tr(p, x + Math.sin(t * 21 + i * 2) * 2.5 * AMP, 20 + Math.cos(t * 17 + i) * 2 * AMP));
      }
      // Jules: delivery
      if (t >= at('here') - 0.2) {
        const jin = P(t, at('here') - 0.2, 0.55, easeOut);
        const late = t >= at('total');
        let jx = lerp(-220, 170, jin), jy = 420 + 10 * Math.sin(t * 3) * AMP, js = 0.7;
        if (late) { const mv = P(t, at('total'), 0.5); jx = lerp(170, 170, mv); jy = lerp(420, 590, mv); js = lerp(0.7, 0.55, mv); }
        let jm = 'happy';
        if (t >= mid('total', 0.05) && t < at('rude')) jm = t < mid('total', 0.3) ? 'shock' : 'annoyed';
        if (t >= at('rude')) jm = t < mid('rude', 0.55) ? 'annoyed' : t < at('average') ? 'smug' : 'neutral';
        julP = { x: jx, y: jy, s: js, r: jin < 1 ? -14 : (t >= at('rude') && t < mid('rude', 0.55) ? -6 : 0), mood: jm, look: late ? 0.6 : 0.8, glow: 0.9 };
        // the parcels: sprayed from her bag into the lattice
        sparks.forEach((s, i) => {
          const t0 = at('here') + 0.45 + i * 0.32, u = clamp((t - t0) / 0.6);
          if (u <= 0 || u >= 1 || t > end('faster') + 0.5) return;
          const m = mols[(i * 7) % mols.length];
          const bx = jx + 70 * js, by = jy;
          tr(s, lerp(bx, m.lx, u), lerp(by, m.ly, u) - 120 * Math.sin(Math.PI * u), 1.1 - 0.4 * u); op(s, Math.min(1, u * 5, (1 - u) * 5));
        });
      }
      // kinetic energy
      if (t >= at('ke') - 0.1 && t < at('total')) {
        op(speedM, P(t, at('ke'), 0.3, linear)); tr(speedM, 760, 130); speedM.set(0.25 + 0.6 * e + 0.15 * lp);
      } else if (t >= at('faster') && t < at('ke')) { op(speedM, 1); tr(speedM, 760, 130); speedM.set(0.25 + 0.6 * e); }
      ptyPop(cKE, 600, 690, P(t, mid('ke', 0.08), 0.45, pop)); op(cKE, t < at('ke') ? 0 : clamp(P(t, mid('ke', 0.08), 0.45, pop) * 2.5) * (1 - P(t, mid('ke', 0.62), 0.25, linear)));
      if (t >= mid('ke', 0.62) && t < at('liquid')) ptyPop(cMelt, 600, 690, P(t, mid('ke', 0.66), 0.45, pop));
      if (t >= at('liquid') && t < at('total')) ptyPop(cLiq, 600, 690, P(t, mid('liquid', 0.2), 0.45, pop));
      // total / average: the speed bars
      if (t >= mid('total', 0.12)) {
        op(barsG, 1);
        const b1 = P(t, mid('total', 0.12), 0.5, linear);           // bars appear over their particles
        const st = P(t, mid('total', 0.5), 1.0, ease);              // ... and stack into one tall bar
        const ch = P(t, at('average') + 0.1, 0.9, ease);            // ... then line up as a bar chart
        let acc = 0;
        mols.forEach((m, i) => {
          const h1 = H1(m), hs = h1 * KST, hc = HC(m);
          const ax = m.x, ay = m.y - 46 - h1;
          const sxx = 1112, syy = 640 - acc - hs; acc += hs;
          const cx = 330 + i * (700 / (mols.length - 1)), cy = 640 - hc;
          let x, y, h;
          if (ch > 0) { x = lerp(sxx, cx, ch); y = lerp(syy, cy, ch); h = lerp(hs, hc, ch); }
          else { x = lerp(ax, sxx, st); y = lerp(ay, syy, st); h = lerp(h1, hs, st); }
          attr(bars[i], 'x', x - 13); attr(bars[i], 'y', y); attr(bars[i], 'height', Math.max(4, h));
          attr(bars[i], 'width', ch > 0 ? 26 : lerp(26, 44, st)); if (ch <= 0) attr(bars[i], 'x', x - lerp(13, 22, st));
          op(bars[i], b1);
        });
        if (totOn) {
          ptyPop(cTE, 990, 160, P(t, mid('total', 0.55), 0.45, pop));
          ptyPop(cTot, 620, 695, P(t, mid('total', 0.7), 0.45, pop));
          celP = { x: 150, y: 270, s: 0.75, mood: 'deadpan', look: 1, frame: celFrameL };
        }
        if (avgOn) {
          op(avgLine, P(t, mid('average', 0.55), 0.3, linear)); tr(avgLine, 0, 640 - meanHC);
          ptyPop(cAvg, 700, 160, P(t, mid('average', 0.2), 0.45, pop));
          celP = { x: 150, y: 270, s: 0.75, mood: 'deadpan', look: 1, frame: celFrameL };
        }
      }
    }

    /* ---------- C: the quiz ---------- */
    if (sid === 'quiz') {
      const pq = t >= at('pool');
      const sw = P(t, at('pool') + 0.1, 0.5);
      op(tea, 1 - sw); op(pool, 1 - sw); tea.upd(t); pool.upd(t);
      tr(tea, 300, 400, 1.6 * (1 - 0.4 * sw)); tr(pool, 900, 400, 1.2 * (1 - 0.4 * sw));
      op(teaBox, sw); op(poolBox, sw);
      ptyPop(c80, 300, 170, P(t, mid('quiz', 0.35), 0.45, pop));
      ptyPop(c30, 900, 170, P(t, mid('quiz', 0.6), 0.45, pop));
      const qp = P(t, end('quiz') - 0.2, 0.45, pop);
      if (!pq) { op(bigQ, clamp(qp * 2.5)); tr(bigQ, 600, 440, Math.max(0.01, qp), 8 * Math.sin(t * 3) * AMP); ptyPop(quizQ, 600, 650, P(t, mid('quiz', 0.1), 0.45, pop)); }
      if (pq) {
        const tt = t - at('pool');
        teaP.forEach(p => {
          const vx = Math.cos(p.a) * 300 * AMP, vy = Math.sin(p.a) * 300 * AMP;
          const x = ptyBounce(214 + p.x * 172 + vx * tt, 214, 386), y = ptyBounce(274 + p.y * 172 + vy * tt, 274, 446);
          attr(p.c, 'cx', x); attr(p.c, 'cy', y);
          const dx = x - ptyBounce(214 + p.x * 172 + vx * (tt - 0.08), 214, 386), dy = y - ptyBounce(274 + p.y * 172 + vy * (tt - 0.08), 274, 446);
          attr(p.ln, 'x1', x); attr(p.ln, 'y1', y); attr(p.ln, 'x2', x - dx * 1.6); attr(p.ln, 'y2', y - dy * 1.6);
        });
        poolP.forEach(p => {
          const vx = Math.cos(p.a) * 40 * AMP, vy = Math.sin(p.a) * 40 * AMP;
          attr(p.c, 'cx', ptyBounce(672 + p.x * 456 + vx * tt, 672, 1128)); attr(p.c, 'cy', ptyBounce(252 + p.y * 196 + vy * tt, 252, 448));
        });
        op(descT, P(t, mid('pool', 0.3), 0.3, linear)); op(descP, P(t, mid('pool', 0.42), 0.3, linear));
        const bp = P(t, mid('pool', 0.62), 1.0, easeOut);
        op(teBars, P(t, mid('pool', 0.6), 0.3, linear));
        attr(teaBar, 'width', 20 + 50 * bp); attr(poolBar, 'width', 20 + 460 * bp);
        ptyPop(hotter, 300, 650, P(t, mid('pool', 0.12), 0.45, pop));
        ptyPop(more, 900, 650, P(t, mid('pool', 0.85), 0.45, pop));
        celP = { x: 530, y: 360, s: 0.6 * P(t, at('pool'), 0.4, pop), mood: 'neutral', look: t < mid('pool', 0.5) ? -1 : 1 };
      }
    }

    /* ---------- D: Kavya's answer, the star ---------- */
    if (sid === 'kav') {
      ptyCam(kitWrap2, 1.25, 800, 500, 760, 480);
      kavP = { x: 860, y: 540, s: 1.6, mood: 'neutral', look: -0.7, sweat: 0.4 };
      ptyPop(ansCard, 330, 380, P(t, at('got') + 0.15, 0.45, pop));
      op(ans1, P(t, mid('got', 0.1), 0.3, linear)); op(ans2, P(t, mid('got', 0.55), 0.3, linear)); op(star, 0);
      thinkDots.forEach((d, i) => { const p = P(t, at('got') - 0.1 + i * 0.15, 0.3, pop); op(d, clamp(p * 2.5) * (1 - P(t, mid('got', 0.4), 0.3, linear))); tr(d, 700 - i * 40, 330 - i * 50, Math.max(0.01, p)); });
    }
    if (sid === 'celC') {
      const push = P(t, at('correct'), end('correct') + 0.6 - at('correct'), linear), k = 2 + 0.2 * push;
      ptyCam(kitWrap2, k, 380, 252, 400, 380 + 30 * push);
      celP = { x: 400, y: 380 + 30 * push, s: k, mood: t < mid('correct', 0.75) ? 'deadpan' : 'smug', look: t < mid('correct', 0.3) ? 1 : 0 };
      op(ansCard, 1); op(ans1, 1); op(ans2, 1); tr(ansCard, 880, 330, 0.95, -2);
      const sp = P(t, mid('correct', 0.35), 0.35, easeOut);
      op(star, sp > 0 ? 1 : 0); tr(star, 200, -80, Math.max(0.01, 2.4 - 1.4 * sp), -40 + 40 * sp + 12);
    }

    /* ---------- E: the arm ---------- */
    if (sid === 'arm') {
      const z = P(t, mid('sweat', 0.35), 1.6, ease), k = 1 + 0.9 * z;
      ptyCam(armWrap, k, 600, 310, 600, lerp(375, 380, z));
      ptyPop(sweatChip, 600, 150, P(t, mid('sweat', 0.1), 0.45, pop)); op(sweatChip, clamp(P(t, mid('sweat', 0.1), 0.45, pop) * 2.5) * (1 - P(t, mid('sweat', 0.4), 0.3, linear)));
      const gin = P(t, mid('sweat', 0.45), 0.5, pop);
      gusP = { x: 600, y: lerp(375, 380, z) + 18 * k, s: 0.3 * k * Math.max(0.01, gin), r: 14 * Math.sin(t * 6) * AMP, mood: 'happy', look: 0, ice: 0, vib: 0 };
      ptyPop(armQ, 870, 240, P(t, mid('sweat', 0.55), 0.45, pop), 1, 10 * Math.sin(t * 2) * AMP);
      ptyPop(askChip, 600, 680, P(t, mid('sweat', 0.78), 0.45, pop));
    }

    /* ---------- F: inside the drop ---------- */
    if (sid === 'drop') {
      op(dropP, 1);
      const cool = t >= at('cooler') - 0.1;
      const cp = P(t, at('cooler') + 0.4, 2.5, ease);
      drops.forEach(d => {
        const sp = (40 + 300 * d.v) * AMP * (cool && d.esc < 0 ? 1 - 0.25 * cp : 1);
        const vx = Math.cos(d.a) * sp, vy = Math.sin(d.a) * sp;
        const tt = t - at('escape');
        const yLo = d.esc >= 0 ? 360 : 380, yHi = d.esc >= 0 ? 430 : 640;
        let te = d.esc >= 0 ? ESC_T(d.esc) : 1e9, tq = Math.min(t, te) - at('escape');
        let x = ptyBounce(200 + d.x * 680 + vx * tq, 200, 880), y = ptyBounce(yLo + d.y * (yHi - yLo) + vy * tq, yLo, yHi);
        let px = ptyBounce(200 + d.x * 680 + vx * (tq - 0.07), 200, 880), py = ptyBounce(yLo + d.y * (yHi - yLo) + vy * (tq - 0.07), yLo, yHi);
        if (t > te) { const f = t - te; px = x; py = y - 1; y = y - 520 * f * (0.6 + f); x = x + 60 * f; py = y + 40; }
        attr(d.c, 'cx', x); attr(d.c, 'cy', y);
        attr(d.ln, 'x1', x); attr(d.ln, 'y1', y); attr(d.ln, 'x2', x - (x - px) * 1.6); attr(d.ln, 'y2', y - (y - py) * 1.6);
        op(d.c, y < -40 ? 0 : 1); op(d.ln, y < -40 ? 0 : 1);
        if (d.esc < 0) attr(d.c, 'fill', cp > 0.5 ? ball('#7FB8FF', '#2E6FC0') : ball(C.oxygen, C.oxygenDk));
      });
      // Gus: near the surface, then out ("Later!")
      const gt = mid('escape', 0.78), gf = Math.max(0, t - gt);
      const gy = 440 + 10 * Math.sin(t * 3) * AMP - 600 * gf * (0.5 + gf);
      if (gy > -150) gusP = { x: 560 + 70 * gf, y: gy, s: 0.42, r: 8 * Math.sin(t * 4) * AMP, mood: 'happy', look: 0, ice: 0, vib: 0.2 };
      if (t > gt - 0.2 && t < gt + 1.2) { ptyPop(later, 760, Math.max(150, gy - 60), P(t, gt - 0.2, 0.35, pop)); op(later, clamp(P(t, gt - 0.2, 0.35, pop) * 2.5) * (1 - P(t, gt + 0.9, 0.3, linear))); }
      if (!cool) ptyPop(evapChip, 560, 712, P(t, mid('escape', 0.62), 0.45, pop));
      else {
        op(avgM, 1); tr(avgM, 820, 130); avgM.set(0.72 - 0.26 * cp);
        op(dropTh, P(t, at('cooler'), 0.3, linear)); tr(dropTh, 100, 600); dropTh.set(0.62 - 0.2 * cp);
        ptyPop(coolCard, 560, 712, P(t, mid('cooler', 0.62), 0.45, pop));
        op(celFrameR, P(t, at('cooler') - 0.1, 0.2, linear)); tr(celFrameR, 1050, 470);
        celP = { x: 1050, y: 486, s: 0.78, mood: 'neutral', look: -1 };
      }
    }

    /* ---------- G: Gus' confessional ---------- */
    if (sid === 'gconf') {
      op(gas, 1); gas.set('gas', t - at('thgus'), 0.9 * AMP);
      const push = P(t, at('thgus'), end('thgus') + 0.6 - at('thgus'), linear), s = 1.5 * (1 + 0.05 * push);
      gusP = { x: 400, y: 400, s, mood: 'happy', look: 0, ice: 0, vib: 0 };
      ptyPop(gasChip, 880, 650, P(t, mid('thgus', 0.15), 0.45, pop));
      const sh = win(t, mid('thgus', 0.5), mid('thgus', 0.82), 0.12);
      op(shades, sh); tr(shades, 400, 400 + (4 - 30 * (1 - sh)) * s + Math.sin(t * TAU * 0.5 + 6) * 3 * s, s);
    }

    /* ---------- cast ---------- */
    if (gusP) { op(gus, gusP.op === undefined ? 1 : gusP.op); tr(gus, gusP.x, gusP.y, gusP.s, gusP.r); gus.set({ t, talk: talk('gus'), mood: gusP.mood, look: gusP.look, ice: gusP.ice, vib: gusP.vib }); } else op(gus, 0);
    if (julP) { op(jules, 1); tr(jules, julP.x, julP.y, julP.s, julP.r); jules.set({ t, talk: talk('jules'), mood: julP.mood, look: julP.look, glow: julP.glow }); } else op(jules, 0);
    if (celP) {
      if (celP.frame) { op(celP.frame, 1); tr(celP.frame, celP.x, celP.y + 6); }
      op(cel, 1); tr(cel, celP.x, celP.y, celP.s); cel.set({ t, talk: talk('cel'), mood: celP.mood, look: celP.look, temp: 34 });
    } else op(cel, 0);
    if (kavP) { op(kav, 1); tr(kav, kavP.x, kavP.y, kavP.s); kav.set({ t, talk: talk('kavya'), mood: kavP.mood, look: kavP.look, sweat: kavP.sweat }); } else op(kav, 0);
  };
});

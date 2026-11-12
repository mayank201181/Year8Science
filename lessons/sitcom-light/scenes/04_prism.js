/* Scene 4: Seven colours in a trench coat (dispersion).
   4 p.m. thunderstorm ("very Singapore") -> lightning: the light arrives first, the BOOM is still crawling ->
   light vs sound speed bars (a million times faster) -> Grandma's living room: a sunbeam hits the hanging prism
   -> Ray's confessional: "I'm not one colour"; the coat swings open: WHITE LIGHT = a mixture -> Kavya, jaw
   dropped -> big prism diagram: seven colours ride their own rays -> Violet (bends the most) -> Red (the least)
   -> the spectrum band, DISPERSION -> Richard Of York Gave Battle In Vain -> Indigo's confessional (blue |
   indigo | violet) and his rain cloud -> "so the prism made the rainbow?" (hold on Ray) -> two prisms: the
   colours recombine into white, the coat closes -> outdoors: a rainbow, the Sun behind you. */
scene('prism', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const camAt = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const place = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r, f) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const label = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  function prismCard(parent, rows, o) {
    o = o || {};
    const g = G(parent), pad = o.pad || 26;
    let w = 0, h = 0;
    rows.forEach(([s, size]) => { w = Math.max(w, textWidth(s, size, FD, 700)); h += size * 1.32; });
    w += pad * 2; h += pad * 1.4;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 20, fill: o.fill || 'rgba(10,27,39,0.93)', stroke: o.stroke || C.energy, 'stroke-width': 3 }, g);
    let y = -h / 2 + pad * 0.7;
    rows.forEach(([s, size, col]) => { y += size * 1.32; T(g, 0, y - size * 0.32, s, { size, weight: 700, anchor: 'middle', fill: col || C.ink, boldFill: o.bold || C.energy }); });
    return g;
  }
  // Kavya seen from behind (towel round her shoulders), about 260 wide, origin at the back of her neck
  function prismBack(parent) {
    const g = G(parent), K = SC_INK;
    E('path', { d: 'M-130,140 Q-126,40 -50,24 L50,24 Q126,40 130,140 Z', fill: '#1E3A8A', stroke: K, 'stroke-width': 4 }, g);
    E('path', { d: 'M-128,96 Q-120,10 -40,0 Q0,14 40,0 Q120,10 128,96 L100,104 Q96,46 40,30 Q0,44 -40,30 Q-96,46 -100,104 Z', fill: '#FF9BC4', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-112,70 Q-90,30 -46,22 M112,70 Q90,30 46,22', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, opacity: 0.8 }, g);
    E('rect', { x: -22, y: -10, width: 44, height: 30, fill: '#B9784E' }, g);
    E('ellipse', { cx: -76, cy: -62, rx: 12, ry: 18, fill: '#B9784E', stroke: K, 'stroke-width': 3 }, g);
    E('ellipse', { cx: 76, cy: -62, rx: 12, ry: 18, fill: '#B9784E', stroke: K, 'stroke-width': 3 }, g);
    E('ellipse', { cx: 0, cy: -70, rx: 76, ry: 82, fill: '#1E1410', stroke: K, 'stroke-width': 4 }, g);
    E('path', { d: 'M-74,-80 L74,-80', stroke: '#E8424F', 'stroke-width': 8 }, g);   // goggle strap
    E('path', { d: 'M-14,-40 Q-26,20 -6,70 Q8,30 14,-40 Z', fill: '#1E1410', stroke: K, 'stroke-width': 3 }, g);   // ponytail
    E('circle', { cx: 0, cy: -38, r: 10, fill: '#FF5FA2', stroke: K, 'stroke-width': 2.5 }, g);
    return g;
  }

  // a plain polyline that draws on with .set(p) (one element; no arrowheads)
  function prismLine(parent, pts, o) {
    const e = E('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L'), fill: 'none', stroke: o.color, 'stroke-width': o.width || 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1, opacity: o.opacity }, parent);
    e.set = p => attr(e, 'stroke-dashoffset', 1 - clamp(p));
    return e;
  }

  /* layers */
  const Lstorm = G(root), Lroom = G(root), Ldiag = G(root), Lconf = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A/B/C: the storm ================= */
  const stormShot = G(Lstorm);
  const storm = lwStorm(stormShot);
  const BOLT = [620, 330];
  const boomG = G(stormShot);
  const boomRing = E('circle', { cx: BOLT[0], cy: BOLT[1], r: 10, fill: 'none', stroke: '#FFB37A', 'stroke-width': 7, 'stroke-dasharray': '18 12' }, boomG);
  const boomTxt = T(boomG, 0, 0, 'BOOM', { size: 40, weight: 800, anchor: 'middle', fill: '#FFB37A' });
  const streak = lwLightRay(stormShot, BOLT[0], BOLT[1] - 20, 930, 470, { width: 8, color: '#FFF7C2', at: 0.7 });
  const dimStorm = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05101A', opacity: 0.7 }, stormShot);
  const cTime = label(Lfg, '4:00 PM', { size: 36 });
  const cSg = label(Lfg, 'very Singapore', { size: 28, color: C.muted });
  const cLight = label(Lfg, 'light: here already ✓', { size: 30, color: C.energy });
  const cSound = label(Lfg, 'thunder (sound): still on its way…', { size: 30, color: '#FFB37A' });
  // speed card
  const sCard = G(Lmid);
  E('rect', { x: -460, y: -190, width: 920, height: 380, rx: 26, fill: 'rgba(10,27,39,0.95)', stroke: C.line, 'stroke-width': 3 }, sCard);
  T(sCard, -420, -112, 'light ≈ 300 000 km/s', { size: 36, weight: 800, fill: C.energy });
  const lBar = E('rect', { x: -420, y: -90, width: 10, height: 34, rx: 6, fill: C.energy }, sCard);
  const lArrow = E('path', { d: 'M0,-22 L26,0 L0,22 Z', fill: C.energy }, sCard);
  T(sCard, -420, 0, 'sound ≈ 0.34 km/s', { size: 36, weight: 800, fill: '#FFB37A' });
  E('rect', { x: -420, y: 22, width: 4, height: 34, fill: '#FFB37A' }, sCard);
  const sTiny = T(sCard, -400, 50, '← this tiny', { size: 28, weight: 700, fill: C.muted });
  const sBig = T(sCard, 0, 142, 'light is about a **MILLION** times faster', { size: 40, weight: 700, anchor: 'middle', boldFill: C.energy });

  /* ================= D/F/K: Grandma's living room (camera group) ================= */
  const roomShot = G(Lroom);
  const room = lwLivingRoom(roomShot);
  const PZ = room.prismAt;   // [840, 300]
  const hidden = G(roomShot); op(hidden, 0);
  const tp = lwPrism(hidden, 92).at(PZ[0], PZ[1]);
  const BEAM_IN = 210, beamStart = lwPt(863, 300, BEAM_IN + 180, 330);
  const fanG = G(roomShot);
  const WALLX = 440;
  const fanEnds = LW_SPECTRUM.map(h => {
    const pts = tp.trace(beamStart, BEAM_IN, h.n, 600), a = pts[pts.length - 2], b = pts[pts.length - 1];
    const f = (WALLX - a[0]) / (b[0] - a[0]);
    pts[pts.length - 1] = [WALLX, a[1] + (b[1] - a[1]) * f];
    return pts;
  });
  const fanRays = fanEnds.map((pts, i) => prismLine(fanG, pts.slice(2), { color: LW_SPECTRUM[i].color, width: 3.5 }));
  const patch = G(fanG);
  fanEnds.forEach((pts, i) => { const y = pts[pts.length - 1][1]; E('rect', { x: WALLX - 22, y: y - 8, width: 44, height: 16, rx: 6, fill: LW_SPECTRUM[i].color, opacity: 0.85 }, patch); });
  E('ellipse', { cx: WALLX, cy: (fanEnds[0][fanEnds[0].length - 1][1] + fanEnds[6][fanEnds[6].length - 1][1]) / 2, rx: 60, ry: 80, fill: glow('#FFFFFF'), opacity: 0.5 }, patch);
  const beam = lwLightRay(fanG, beamStart[0], beamStart[1], fanEnds[0][1][0], fanEnds[0][1][1], { color: LW_OPT.white, width: 7, at: 0.45 });
  const prismLab = G(roomShot);
  E('line', { x1: PZ[0] - 50, y1: PZ[1] + 30, x2: PZ[0] - 120, y2: PZ[1] + 120, stroke: '#3A4B5C', 'stroke-width': 3 }, prismLab);
  const plc = chip(prismLab, 'prism: a triangular block of glass', { size: 28, fill: 'rgba(255,255,255,0.92)', color: SC_INK, stroke: '#3A4B5C', sw: 2 });
  tr(plc, PZ[0] - 130, PZ[1] + 148);
  const kav = cast(roomShot, 'kavya', { outfit: 'swim' });
  const KX = 262, KY = 428, KS = 0.8;
  { // towel round her shoulders, and an arm for pointing
    const kg = kav.firstChild;
    const towel = E('path', { d: 'M-104,120 Q-100,56 -36,48 Q0,64 36,48 Q100,56 104,120 L80,128 Q78,80 30,70 Q0,84 -30,70 Q-78,80 -80,128 Z', fill: '#FF9BC4', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' });
    kg.insertBefore(towel, kg.children[3]);
  }
  const arm = G(kav.firstChild);
  E('path', { d: 'M74,96 Q120,60 150,-6', fill: 'none', stroke: SC_INK, 'stroke-width': 24, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M74,96 Q120,60 150,-6', fill: 'none', stroke: '#B9784E', 'stroke-width': 17, 'stroke-linecap': 'round' }, arm);
  E('circle', { cx: 152, cy: -10, r: 14, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, arm);
  E('path', { d: 'M156,-20 L166,-44', stroke: '#B9784E', 'stroke-width': 9, 'stroke-linecap': 'round' }, arm);

  /* ================= diagrams ================= */
  const dark = G(Ldiag);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad(C.bg0, C.bg1, true) }, dark);
  // G: the big prism
  const dSpread = G(Ldiag);
  const bigP = lwPrism(dSpread, 300).at(520, 420);
  const SP0 = lwPt(450, 400, 158, 420);
  const traces = LW_SPECTRUM.map(h => bigP.trace(SP0, -22, h.n, 500));
  const glowV = E('path', { d: 'M' + traces[6].slice(2).map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L'), fill: 'none', stroke: LW_HUE.violet, 'stroke-width': 34, 'stroke-linecap': 'round', opacity: 0.3 }, dSpread);
  const glowR = E('path', { d: 'M' + traces[0].slice(2).map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L'), fill: 'none', stroke: LW_HUE.red, 'stroke-width': 34, 'stroke-linecap': 'round', opacity: 0.3 }, dSpread);
  const spRays = traces.map((pts, i) => lwRayPath(dSpread, pts.slice(1), { color: LW_SPECTRUM[i].color, width: 4.5, glow: false, heads: [1], at: 0.5 }));
  const spWhite = lwLightRay(dSpread, SP0[0], SP0[1], traces[0][1][0], traces[0][1][1], { color: LW_OPT.white, width: 7, at: 0.5 });
  const cEach = label(Lfg, 'each colour refracts by a different amount', { size: 30 });
  const cMost = label(Lfg, 'bends the MOST', { size: 34, color: LW_HUE.violet, stroke: LW_HUE.violet, sw: 3 });
  const cLeast = label(Lfg, 'bends the LEAST', { size: 34, color: LW_HUE.red, stroke: LW_HUE.red, sw: 3 });
  // H: the spectrum band
  const dBand = G(Ldiag);
  const BX0 = 145, BW = 130;
  LW_SPECTRUM.forEach((h, i) => E('rect', { x: BX0 + i * BW, y: 280, width: BW + 0.5, height: 130, fill: h.color }, dBand));
  E('rect', { x: BX0, y: 280, width: BW * 7, height: 130, rx: 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, dBand);
  const names = LW_SPECTRUM.map((h, i) => T(dBand, BX0 + i * BW + BW / 2, 456, h.name, { size: 30, weight: 800, anchor: 'middle', fill: h.color }));
  const cVis = label(Lfg, 'the visible spectrum', { size: 40, color: '#FFFFFF' });
  const dispCard = prismCard(Lfg, [['DISPERSION', 52, C.energy], ['splitting white light into the visible spectrum', 30]]);
  // I: Richard Of York
  const dRich = G(Ldiag);
  const WORDS = ['Richard', 'Of', 'York', 'Gave', 'Battle', 'In', 'Vain'];
  const wordG = WORDS.map((w, i) => {
    const g = G(dRich), size = 62;
    const tx = E('text', { x: 0, y: 0, 'font-size': size, 'font-weight': 700, 'font-family': FD, fill: C.ink, 'text-anchor': 'middle' }, g);
    const a = E('tspan', { fill: LW_SPECTRUM[i].color, 'font-weight': 800, 'font-size': size + 14 }, tx); a.textContent = w[0];
    const b = E('tspan', {}, tx); b.textContent = w.slice(1);
    g.w = textWidth(w, size, FD, 700) + 14;
    return g;
  });
  const row1 = [0, 1, 2, 3], row2 = [4, 5, 6], GAPW = 26;
  [[row1, 290], [row2, 400]].forEach(([row, y]) => {
    const tot = row.reduce((s, i) => s + wordG[i].w, 0) + GAPW * (row.length - 1);
    let x = 600 - tot / 2;
    row.forEach(i => { wordG[i].x = x + wordG[i].w / 2; wordG[i].y = y; x += wordG[i].w + GAPW; });
  });
  const roy = G(dRich);
  LW_SPECTRUM.forEach((h, i) => { const g = G(roy); tr(g, 600 + (i - 3) * 90, 540); E('circle', { r: 34, fill: h.color, stroke: '#FFFFFF', 'stroke-width': 3 }, g); T(g, 0, 12, 'ROYGBIV'[i], { size: 34, weight: 800, anchor: 'middle', fill: i === 5 || i === 4 ? '#FFFFFF' : SC_INK }); });
  const cMnem = label(Lfg, 'to remember the order', { size: 32, color: C.muted });
  // L: two prisms
  const dTwo = G(Ldiag);
  const p1 = lwPrism(dTwo, 200).at(360, 300);
  const H2 = 100 * Math.sqrt(3);
  const p2g = G(dTwo);
  E('path', { d: `M0,${H2 / 2} L100,${-H2 / 2} L-100,${-H2 / 2} Z`, fill: LW_OPT.glassFill, stroke: LW_OPT.glassStroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, p2g);
  const p2 = lwGlassShape(p2g, [[0, H2 / 2], [100, -H2 / 2], [-100, -H2 / 2]]).at(520, 300);
  const TS = lwPt(310, 300, 158, 260);
  const two = LW_SPECTRUM.map(h => {
    const a = p1.trace(TS, -22, h.n, 300), ex = a[2], d = lwAng([a[3][0] - ex[0], a[3][1] - ex[1]]);
    const b = p2.trace(ex, d, h.n, 300);
    return [a[1], a[2]].concat(b.slice(1));
  });
  const twoRays = two.map((pts, i) => prismLine(dTwo, pts, { color: LW_SPECTRUM[i].color, width: 3.5 }));
  const twoIn = lwLightRay(dTwo, TS[0], TS[1], two[0][0][0], two[0][0][1], { color: LW_OPT.white, width: 7, at: 0.5 });
  const outA = two[0][two[0].length - 2], outB = two[6][two[6].length - 2], oEnd = lwDir(-22);
  const outMid = [(outA[0] + outB[0]) / 2, (outA[1] + outB[1]) / 2];
  const twoOut = lwLightRay(dTwo, outMid[0], outMid[1], outMid[0] + oEnd[0] * 300, outMid[1] + oEnd[1] * 300, { color: LW_OPT.white, width: 16, at: 0.6, head: 34 });
  const cWhite = label(Lfg, 'white again!', { size: 32, color: '#FFFFFF' });
  const noCard = prismCard(Lfg, [['a prism does **NOT** add colour:', 32], ['it **SEPARATES** the colours', 32], ['already in white light', 32]]);
  // M: the rainbow, outdoors
  const outShot = G(Ldiag);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7FA6C9', '#E3EEF6', true) }, outShot);
  [[60, 330, 170, 300], [280, 280, 150, 350], [760, 300, 170, 330], [980, 350, 160, 280]].forEach(([x, y, w, h]) => {
    E('rect', { x, y, width: w, height: h, fill: '#D8D2C2', stroke: '#A9A08C', 'stroke-width': 3 }, outShot);
    let wd = ''; for (let yy = y + 16; yy < y + h - 20; yy += 28) for (let xx = x + 14; xx < x + w - 20; xx += 30) wd += `M${xx},${yy} h18 v12 h-18 Z `;
    E('path', { d: wd, fill: '#8CAFC7' }, outShot);
  });
  const bow = lwRainbow(outShot, 450, 90); tr(bow, 600, 650);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: linGrad('#6DBF6A', '#3F8F44', true) }, outShot);
  const glints = G(outShot), glintPts = [];
  { const r = rng(9), dd = ['', '', '']; for (let i = 0; i < 27; i++) { const x = 160 + r() * 880, y = 150 + r() * 380; dd[i % 3] += `M${x.toFixed(0)},${(y - 9).toFixed(0)} l2,7 l7,2 l-7,2 l-2,7 l-2,-7 l-7,-2 l7,-2 Z `; } dd.forEach(d => glintPts.push(E('path', { d, fill: '#FFFFFF' }, glints))); }
  const backW = G(outShot); const kBack = prismBack(backW);
  const inset = G(outShot);
  E('rect', { x: -190, y: -96, width: 380, height: 192, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, inset);
  const isun = sun(inset, 22); tr(isun, -130, -20);
  E('circle', { cx: 0, cy: 6, r: 22, fill: '#1E1410', stroke: '#FFFFFF', 'stroke-width': 2 }, inset);
  E('path', { d: 'M-24,44 Q0,24 24,44', fill: '#1E3A8A', stroke: '#FFFFFF', 'stroke-width': 2 }, inset);
  let rd = ''; for (let i = 0; i < 9; i++) { const x = 104 + (i % 3) * 22, y = -46 + Math.floor(i / 3) * 30; rd += `M${x},${y} q6,10 0,14 q-6,-4 0,-14 Z `; }
  E('path', { d: rd, fill: '#9FD8FF' }, inset);
  arrow(inset, -100, -40, 96, -40, { color: C.energy, width: 4, bend: -26 });
  arrow(inset, 100, 30, 30, 8, { color: '#FFFFFF', width: 4 });
  T(inset, -130, 74, 'Sun', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  T(inset, 0, 80, 'you', { size: 26, weight: 700, anchor: 'middle' });
  T(inset, 126, 74, 'rain', { size: 26, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const cDrops = label(Lfg, 'raindrops = millions of tiny prisms', { size: 30 });
  const cBow = label(Lfg, 'RAINBOW', { size: 52, color: C.energy, stroke: C.energy, sw: 3 });
  const cBehind = label(Lfg, 'Sun BEHIND you, rain in front', { size: 34, color: '#FFFFFF', stroke: C.energy, sw: 3 });

  /* ================= confessionals ================= */
  const confR = lwConf(Lconf, 'ray');
  const confI = lwConf(Lconf, 'indigo');
  const coatCard = prismCard(Lmid, [['WHITE LIGHT', 50, C.energy], ['= a mixture', 36], ['of colours', 36]]);
  const swatch = G(Lmid);
  [['blue', LW_HUE.blue], ['indigo', LW_HUE.indigo], ['violet', LW_HUE.violet]].forEach(([n, c], i) => {
    const g = G(swatch); tr(g, (i - 1) * 140, 0);
    E('rect', { x: -60, y: -60, width: 120, height: 120, rx: 12, fill: c, stroke: i === 1 ? '#FFFFFF' : 'none', 'stroke-width': 6 }, g);
    T(g, 0, 100, n, { size: 30, weight: 800, anchor: 'middle', fill: i === 1 ? '#FFFFFF' : C.muted });
  });
  const meArrow = G(swatch); arrow(meArrow, 0, -150, 0, -76, { color: '#FFFFFF', width: 6 }); T(meArrow, 0, -162, 'me', { size: 30, weight: 800, anchor: 'middle' });
  const cloud = G(Lmid);
  E('path', { d: 'M-70,10 Q-80,-30 -40,-34 Q-30,-66 6,-58 Q30,-80 56,-52 Q86,-50 80,-14 Q90,14 60,16 L-56,16 Q-80,16 -70,10 Z', fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 4 }, cloud);
  const cDrop = [0, 1, 2, 3].map(i => E('path', { d: 'M0,-10 Q7,2 0,7 Q-7,2 0,-10 Z', fill: '#7FB6FF' }, cloud));

  /* ================= cast that moves between shots ================= */
  const ray = cast(Lcast, 'ray', {});
  const riders = LW_SPECTRUM.map(h => (h.name === 'violet' || h.name === 'indigo' || h.name === 'red') ? cast(Lcast, h.name, {}) : cast(Lcast, 'hue', { hue: h.name }));
  const ltViolet = lwLower(Lhud, 'violet');
  const ltIndigo = lwLower(Lhud, 'indigo');

  /* cut points */
  const cut = id => at(id) - 0.06;
  const cB = cut('flash'), cC = cut('sound'), cD = cut('crystal'), cE = cut('secret'), cF = end('coat') + 0.05, cG = cut('spread'),
    cH = cut('order'), cI = cut('richard'), cJ = cut('indigo'), cK = cut('made'), cL = cut('nomade'), cM = cut('rainbow');
  const FL = at('flash') + 0.25;

  return t => {
    const sA = on(t, -1, cB), sB = on(t, cB, cC), sC = on(t, cC, cD), sD = on(t, cD, cE), sE = on(t, cE, cF), sF = on(t, cF, cG),
      sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sJ = on(t, cJ, cK), sK = on(t, cK, cL), sL = on(t, cL, cM), sM = on(t, cM, 1e9);
    const talkR = scTalk(S, t, 'ray');

    /* ---------- A/B/C: storm ---------- */
    const stOn = sA || sB || sC;
    op(stormShot, stOn);
    if (stOn) {
      const u = t - FL;
      let fl = 0;
      if (u > 0) fl = Math.max(0, 1 - u / 0.45) + Math.max(0, 0.7 - Math.abs(u - 0.6) / 0.12) * (u > 0.45 ? 1 : 0);
      storm.upd(t, 1, sB ? clamp(fl) : 0);
      const boomOn = sB && u > 0;
      op(boomG, boomOn);
      if (boomOn) { const r = 20 + u * 34; attr(boomRing, 'r', r); attr(boomTxt, 'x', BOLT[0] + r * 0.75); attr(boomTxt, 'y', BOLT[1] + r * 0.75 + 14); op(boomRing, 0.9); }
      op(streak, sB && u > 0 ? 1 - P(t, FL + 1.6, 0.4, linear) : 0); streak.set(P(t, FL, 0.12, linear));
      op(dimStorm, sC ? P(t, cC, 0.2, linear) * 0.75 : 0);
    }
    if (sA) {
      popIn(cTime, t, at('storm') + 0.15, 900, 140, 1);
      popIn(cSg, t, mid('storm', 0.62), 900, 212, 1, -3);
    } else { op(cTime, 0); op(cSg, 0); }
    if (sB) { popIn(cLight, t, FL + 0.3, 900, 340, 1); popIn(cSound, t, mid('flash', 0.62), 620, 640, 1); } else { op(cLight, 0); op(cSound, 0); }
    if (sC) {
      popIn(sCard, t, at('sound') + 0.05, 600, 400, 1);
      const lp = P(t, at('sound') + 0.3, 0.25, easeOut);
      attr(lBar, 'width', lerp(10, 1020, lp)); tr(lArrow, -420 + lerp(10, 1020, lp) - 4, -73); op(lArrow, lp > 0.9 ? 1 : 0);
      op(sTiny, P(t, mid('sound', 0.4), 0.3, linear)); op(sBig, P(t, mid('sound', 0.55), 0.3, linear));
    } else op(sCard, 0);

    /* ---------- D/F/K: the living room ---------- */
    const rmOn = sD || sF || sK;
    op(roomShot, rmOn);
    let cam = { k: 1.4, cx: 640, cy: 420 };
    if (rmOn) {
      if (sD) cam = { k: 1.4 + 0.06 * P(t, cD, cE - cD, linear), cx: 640, cy: 420 };
      else if (sF) cam = { k: 2.1 + 0.25 * P(t, cF, cG - cF, linear), cx: 262, cy: 400 };
      else if (t < end('made') + 0.05) cam = { k: 1.4, cx: 640, cy: 420 };
      else cam = { k: 2.0 + 0.25 * P(t, end('made'), cL - end('made'), linear), cx: 990, cy: 470 };
      camAt(roomShot, cam.k, cam.cx, cam.cy);
      // the sunbeam and the colours on the wall
      const bp = sD ? P(t, at('crystal') + 0.3, 0.8, linear) : 1;
      beam.set(bp);
      const fp = sD ? P(t, at('crystal') + 1.1, 0.8, linear) : 1;
      fanRays.forEach(r => r.set(fp)); op(patch, sD ? P(t, at('crystal') + 1.8, 0.4, linear) : 1);
      op(prismLab, sD ? P(t, mid('crystal', 0.5), 0.3, linear) : 0);
      tr(kav, KX, KY, KS);
      let mood = 'neutral', look = 0.8;
      if (sF) { mood = 'shock'; look = 0; }
      if (sK) { mood = t < end('made') + 0.05 ? 'happy' : 'neutral'; look = t < end('made') + 0.05 ? 0.5 : 0.9; }
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood, look });
      op(arm, sK ? 1 : 0);
    }

    /* ---------- E: Ray's confessional (secret, coat) ---------- */
    confR.set(sE, t);
    if (sE) {
      const lean = P(t, at('secret') + 0.2, 0.6);
      const k = 1 + 0.12 * lean + 0.05 * P(t, at('coat'), end('coat') - at('coat'), linear);
      camAt(confR, k, 430, 330);
      if (t > at('coat')) popIn(coatCard, t, mid('coat', 0.12), 880, 300, 1); else op(coatCard, 0);
    } else op(coatCard, 0);

    /* ---------- G: the big prism ---------- */
    op(dark, sG || sH || sI || sL);
    op(dSpread, sG);
    if (sG) {
      spWhite.set(P(t, at('spread') + 0.1, 0.5, linear));
      spRays.forEach(r => r.set(P(t, at('spread') + 0.6, 1.0, linear)));
      op(glowV, t > at('violet') - 0.06 ? 0.3 + 0.15 * Math.sin(t * 6) : 0);
      op(glowR, t > at('red') - 0.06 ? 0.3 : 0);
      if (t < at('violet') - 0.06) popIn(cEach, t, mid('spread', 0.3), 760, 170, 1); else op(cEach, 0);
      if (t > at('violet') - 0.06) popIn(cMost, t, mid('violet', 0.55), 860, 670, 1); else op(cMost, 0);
      if (t > at('red') - 0.06) popIn(cLeast, t, mid('red', 0.35), 960, 370, 1); else op(cLeast, 0);
    } else { op(cEach, 0); op(cMost, 0); op(cLeast, 0); }
    ltViolet.set(sG ? win(t, at('violet') + 0.1, at('violet') + 3.2, 0.3) : 0);

    /* ---------- riders (G) and Indigo (J) ---------- */
    riders.forEach((c, i) => {
      if (sG) {
        const pts = traces[i], a = pts[2], b = pts[3];
        let q = 0.08 + (0.84 - i * 0.1) * P(t, mid('spread', 0.45) + i * 0.08, 1.4, easeOut), s = 0.26, rot = 0, mood, look = 0;
        const appear = P(t, mid('spread', 0.4) + i * 0.08, 0.3, linear);
        if (i === 6 && t > at('violet') - 0.06) { q = lerp(0.2, 0.86, P(t, at('violet'), 1.0, easeIn)); s = 0.5; }
        if (i === 0 && t > at('red') - 0.06) { s = lerp(0.26, 0.5, P(t, at('red'), 0.4, ease)); rot = -14; mood = 'smug'; }
        const y0 = lerp(a[1], b[1], q), x0 = lerp(a[0], b[0], q);
        const hop = (i === 6 && t > at('violet') + 1.0) ? -Math.abs(Math.sin((t - at('violet')) * 7 * AMP)) * 24 : 0;
        op(c, appear); tr(c, x0, y0 - 64 * s + hop, s, rot);
        if (i === 6 && t > at('violet') - 0.06) mood = 'happy';
        c.set({ t, talk: scTalk(S, t, i === 6 ? 'violet' : '__'), mood, look: i === 6 ? 0.5 : -0.4 });
      } else if (sJ && i === 5) {
        const k = 1 + 0.04 * P(t, cJ, end('feelings') - cJ, linear) + 0.28 * P(t, end('feelings'), 0.9, ease);
        op(c, 1); tr(c, 430, 330 + k * 90, 1.6 * k);
        c.set({ t, talk: scTalk(S, t, 'indigo'), mood: 'sad', look: t < at('feelings') - 0.06 ? 0 : (t < end('feelings') ? 0.3 : 0) });
      } else op(c, 0);
    });

    /* ---------- H: spectrum band ---------- */
    op(dBand, sH);
    if (sH) {
      names.forEach((n, i) => op(n, P(t, mid('order', 0.14 + i * 0.085), 0.2, linear)));
      popIn(cVis, t, at('order') + 0.15, 600, 180, 1);
      popIn(dispCard, t, mid('order', 0.84), 600, 590, 1);
    } else { op(cVis, 0); op(dispCard, 0); }

    /* ---------- I: Richard Of York ---------- */
    op(dRich, sI);
    if (sI) {
      wordG.forEach((g, i) => popIn(g, t, mid('richard', 0.3 + i * 0.09), g.x, g.y, 1));
      op(roy, P(t, mid('richard', 0.88), 0.3, linear));
      popIn(cMnem, t, at('richard') + 0.1, 600, 170, 1);
    } else op(cMnem, 0);

    /* ---------- J: Indigo's confessional ---------- */
    confI.set(sJ, t);
    ltIndigo.set(sJ ? win(t, at('indigo') + 0.2, at('indigo') + 3.4, 0.3) : 0);
    if (sJ) {
      const k = 1 + 0.04 * P(t, cJ, end('feelings') - cJ, linear) + 0.28 * P(t, end('feelings'), 0.9, ease);
      camAt(confI, k, 430, 330);
      if (t < at('feelings') - 0.06) { popIn(swatch, t, mid('indigo', 0.28), 880, 330, 1); op(meArrow, P(t, mid('indigo', 0.5), 0.3, linear)); } else op(swatch, 0);
      if (t > at('feelings') - 0.06) {
        popIn(cloud, t, mid('feelings', 0.3), 430, 330 + k * (150 - 330), k);
        cDrop.forEach((d, i) => { const f = ((t * 1.3 * AMP) + i * 0.25) % 1; tr(d, -48 + i * 32, 30 + f * 46); op(d, 1 - f); });
      } else op(cloud, 0);
    } else { op(swatch, 0); op(cloud, 0); }

    /* ---------- L: two prisms ---------- */
    op(dTwo, sL);
    if (sL) {
      twoIn.set(P(t, at('nomade') + 0.1, 0.4, linear));
      twoRays.forEach(r => r.set(P(t, at('nomade') + 0.5, 1.2, linear)));
      twoOut.set(P(t, mid('nomade', 0.42), 0.6, linear)); op(twoOut, t > mid('nomade', 0.42) ? 1 : 0);
      popIn(cWhite, t, mid('nomade', 0.52), 760, 120 + 40, 1);
      popIn(noCard, t, mid('nomade', 0.6), 420, 600, 1);
    } else { op(cWhite, 0); op(noCard, 0); }

    /* ---------- M: the rainbow ---------- */
    op(outShot, sM);
    if (sM) {
      tr(backW, 600, 690 + Math.sin(t * 2) * 2 * AMP, 1.1);
      glintPts.forEach((g, i) => op(g, 0.2 + 0.8 * Math.abs(Math.sin(t * (2.2 + i * 0.9) * AMP + i * 2.1))));
      popIn(inset, t, mid('rainbow', 0.62), 990, 160, 1);
      popIn(cDrops, t, mid('rainbow', 0.08), 330, 140, 1);
      popIn(cBow, t, mid('rainbow', 0.4), 600, 340, 1);
      popIn(cBehind, t, mid('rainbow', 0.68), 600, 450, 1);
    } else { op(cDrops, 0); op(cBow, 0); op(cBehind, 0); }

    /* ---------- Ray (B window, E confessional, K room, L corner) ---------- */
    if (sB) {
      op(ray, 1); tr(ray, 1010, 545, 0.75);
      ray.set({ t, talk: talkR, mood: t < FL + 0.6 ? 'shock' : 'smug', look: -0.9 });
    } else if (sE) {
      op(ray, 1);
      const lean = P(t, at('secret') + 0.2, 0.6), k = 1 + 0.12 * lean + 0.05 * P(t, at('coat'), end('coat') - at('coat'), linear);
      tr(ray, 430, 330 + k * (430 - 330), 1.4 * k);
      const coat = P(t, mid('coat', 0.45), 0.7, ease);
      ray.set({ t, talk: talkR, mood: t < at('coat') ? 'neutral' : (coat > 0.5 ? 'smug' : 'deadpan'), look: 0, coat });
    } else if (sK) {
      op(ray, t < end('made') + 0.05 ? 0 : 1); place(ray, cam, 1000, 545, 0.75);
      ray.set({ t, talk: talkR, mood: 'deadpan', look: t < end('made') ? -0.8 : 0, coat: 1 });
    } else if (sL) {
      op(ray, 1); tr(ray, 1010, 545, 0.75);
      const close = P(t, mid('nomade', 0.82), 0.6, ease);
      ray.set({ t, talk: talkR, mood: close > 0.5 ? 'smug' : 'deadpan', look: t < mid('nomade', 0.5) ? -0.8 : 0, coat: 1 - close });
    } else op(ray, 0);
  };
});

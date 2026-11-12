/* Scene 5: Eviction night (filtration, evaporation, crystallisation, distillation).
   A reality-show night in the lab: spotlights and an "EVICTION NIGHT" banner.
   Beats: a beaker of muddy, salty water (Sandy and Sal inside) -> filtration: pour through filter paper
   -> Sandy stuck in the paper -> magnified paper: sand too big for the holes; RESIDUE and FILTRATE ->
   "They even gave me a sad name" -> Sal's particles slip through, waving -> Arthur: you can't filter salt
   out of salt water -> evaporation leaves the salt -> crystallisation in three steps -> Sal is a cube
   again -> Kavya's clipboard: get the water back -> simple distillation: boil, condense, pure water ->
   evaporation keeps the solid, distillation keeps the liquid -> fractional distillation of crude oil ->
   Arthur's flat cooled to a liquid and boiled off -> the Nigels came off first, with a trophy. */
scene('evict', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed ev) ---------- */
  function evCam(el, k, cx, cy, px, py) {
    el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function evPop(el, p, x, y, s, r) { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); }
  function evChip(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 });
  }
  function evPanel(parent, w, h, stroke) {
    const g = G(parent);
    card(g, -w / 2, -h / 2, w, h, { fill: 'rgba(10,27,39,0.93)', stroke: stroke || C.line, sw: 4, rx: 18 });
    return g;
  }
  // many dots or squares as ONE path (keeps the element count down)
  const evCircles = pts => pts.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `).join('');
  const evSquares = pts => pts.map(([x, y, q]) => `M${(x - q / 2).toFixed(1)},${(y - q / 2).toFixed(1)} h${q} v${q} h${-q} Z `).join('');
  function evSeat(ch, slot) { if (ch.parentNode !== slot) slot.appendChild(ch); op(ch, 1); }
  // text with real subscripts: 'N_2' -> N₂
  function evRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 800, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // the lab for the show: like ecLab but with the safety sign taken down (the spotlights need the wall)
  function evLab(parent) {
    const g = G(parent);
    E('rect', { x: -40, y: -40, width: 1280, height: 640, fill: linGrad('#23404F', '#2F5468', true) }, g);
    let d = '';
    for (let y = 330; y < 560; y += 46) d += `M-40,${y} L1240,${y} `;
    for (let x = 0; x < 1240; x += 92) d += `M${x},330 L${x},560 `;
    E('path', { d, stroke: '#3B6278', 'stroke-width': 2 }, g);
    E('rect', { x: 620, y: 250, width: 520, height: 14, fill: '#8A6A50' }, g);
    const bc = ['#5BD27A', '#FF6B5C', '#4CC9F0', '#FFC247', '#B48CFF', '#F2F7FA', '#FF5FA2'];
    let bo = '';
    for (let i = 0; i < 7; i++) {
      const x = 650 + i * 70, h = 60 + (i % 3) * 18;
      bo += `M${x},250 L${x},${250 - h} L${x + 44},${250 - h} L${x + 44},250 Z `;
      E('rect', { x: x + 4, y: 250 - h * 0.55, width: 36, height: h * 0.55 - 4, rx: 5, fill: bc[i], opacity: 0.8 }, g);
    }
    E('path', { d: bo, fill: 'rgba(200,230,250,0.18)', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -40, y: 560, width: 1280, height: 28, fill: '#1A2933' }, g);
    E('rect', { x: -40, y: 588, width: 1280, height: 200, fill: '#3A5A6A' }, g);
    return g;
  }
  // an evaporating basin, about 220 wide, rim at y 0; g.set(level 0..1, salt 0..1)
  function evBasin(parent, s) {
    const g = G(parent); tr(g, 0, 0, s || 1);
    const liq = E('ellipse', { cx: 0, cy: 14, rx: 90, ry: 14, fill: '#9FD8FF', opacity: 0.9 }, g);
    const r = rng(8), sp = [];
    for (let i = 0; i < 12; i++) sp.push([(r() * 2 - 1) * 66, 38 + r() * 12, 12]);
    const salt = E('path', { d: evSquares(sp), fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 1.5 }, g);
    E('path', { d: 'M-110,0 Q-104,62 0,64 Q104,62 110,0', fill: 'none', stroke: '#F2F7FA', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-110,0 L110,0', stroke: '#F2F7FA', 'stroke-width': 3, opacity: 0.5 }, g);
    g.set = (lv, sl) => { lv = clamp(lv); attr(liq, 'cy', lerp(52, 14, lv)); attr(liq, 'rx', lerp(40, 98, lv)); attr(liq, 'ry', lerp(6, 14, lv)); op(liq, lv > 0.03 ? 0.9 : 0); op(salt, clamp(sl)); };
    g.set(1, 0);
    return g;
  }

  /* ---------- the cast: one of each, re-seated in whichever shot is on screen ---------- */
  const hold = G(root); op(hold, 0);
  const ARTHUR = cast(hold, 'arthur'), SAL = cast(hold, 'sal'), SANDY = cast(hold, 'sandy'), NIGELS = cast(hold, 'nigels'), KAVYA = cast(hold, 'kavya');
  const CAST = [ARTHUR, SAL, SANDY, NIGELS, KAVYA];
  // Sal with a waving arm, in a wrapper that can be squashed
  const salWrap = G(hold);
  const salArm = G(salWrap);
  E('path', { d: 'M0,0 L0,-70', stroke: '#647A90', 'stroke-width': 9, 'stroke-linecap': 'round' }, salArm);
  E('circle', { cx: 0, cy: -76, r: 13, fill: '#FFFFFF', stroke: '#647A90', 'stroke-width': 4 }, salArm);
  const salBody = G(salWrap);
  // Sal's arms, for "Ta-da!"
  const tada = G(hold);
  [-1, 1].forEach(sd => {
    const a = G(tada); a.sd = sd;
    E('path', { d: `M0,0 L${sd * 40},-60`, stroke: '#647A90', 'stroke-width': 11, 'stroke-linecap': 'round' }, a);
    E('circle', { cx: sd * 42, cy: -66, r: 15, fill: '#FFFFFF', stroke: '#647A90', 'stroke-width': 4 }, a);
  });
  // Arthur's host microphone
  const mic = G(hold);
  E('path', { d: 'M0,0 L-14,70', stroke: '#2A2F36', 'stroke-width': 9, 'stroke-linecap': 'round' }, mic);
  E('circle', { cx: 0, cy: 0, r: 17, fill: ball('#B9C6D2', '#56636F'), stroke: SC_INK, 'stroke-width': 3 }, mic);

  /* =====================================================================
     THE LAB (one camera for every lab shot)
     ===================================================================== */
  const gL = G(root), lCam = G(gL);
  evLab(lCam);
  const dim = E('rect', { x: -40, y: -40, width: 1280, height: 830, fill: '#05101A', opacity: 0.38 }, lCam);
  const spots = [0, 1].map(i => E('path', { d: '', fill: '#FFF7C2', opacity: 0.1 }, lCam));
  const lKav = G(lCam);

  /* ---- E: the muddy, salty beaker ---- */
  const xE = G(lCam);
  const eBeak = beaker(xE, 300, 300, { level: 0.75, liquid: '#A97C4A', opacity: 0.82 }); tr(eBeak, 650, 405);
  const eSandy = G(xE), eSal = G(xE);
  const eC1 = evChip(xE, 'SANDY: sand (insoluble)', { size: 28, color: '#EED39A', stroke: '#EED39A' });
  const eC2 = evChip(xE, 'SAL: salt (dissolved)', { size: 28, color: '#FFFFFF', stroke: '#FFFFFF' });
  const eA1 = arrow(xE, 900, 476, 712, 498, { color: '#EED39A', width: 4 });
  const eA2 = arrow(xE, 900, 356, 760, 400, { color: '#FFFFFF', width: 4 });
  const eMix = evChip(xE, 'a MIXTURE: separate it!', { size: 30, color: '#FF8FC8', stroke: '#FF8FC8' });

  /* ---- F: the filter funnel (also the close-ups) ---- */
  const FX = 430, FY = 304, FS = 1.1;
  const xF = G(lCam);
  const filt = ecFilter(xF); tr(filt, FX, FY, FS);
  const fPour = G(xF);
  const fPourB = beaker(fPour, 120, 140, { level: 0.6, liquid: '#A97C4A', opacity: 0.85 });
  const fStream = E('path', { d: '', fill: 'none', stroke: '#A97C4A', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.85 }, xF);
  const fPaperL = labelLine(xF, 190, 160, 360, 170, 'filter paper', { size: 28, fill: '#FBF7EC', anchor: 'middle' });
  const fCard = evPanel(xF, 480, 210, '#FFE45C');
  T(fCard, 0, -40, 'FILTRATION', { size: 50, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(fCard, 0, 12, 'separates an INSOLUBLE SOLID', { size: 30, weight: 700, anchor: 'middle' });
  T(fCard, 0, 56, 'from a LIQUID', { size: 30, weight: 700, anchor: 'middle' });
  const fArth = G(xF);
  // residue / filtrate labels (holes)
  const fRes = G(xF);
  T(fRes, 170, 230, 'RESIDUE', { size: 38, weight: 800, anchor: 'middle', fill: '#EED39A' });
  T(fRes, 170, 268, 'stays on the paper', { size: 26, weight: 600, anchor: 'middle', fill: '#FFFFFF', font: FB });
  E('line', { x1: 260, y1: 222, x2: 400, y2: 196, stroke: '#EED39A', 'stroke-width': 4 }, fRes);
  const fFil = G(xF);
  T(fFil, 170, 470, 'FILTRATE', { size: 38, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  T(fFil, 170, 508, 'passes through', { size: 26, weight: 600, anchor: 'middle', fill: '#FFFFFF', font: FB });
  E('line', { x1: 265, y1: 466, x2: 410, y2: 510, stroke: '#9FD8FF', 'stroke-width': 4 }, fFil);
  // magnified paper
  const MG = [880, 360], MR = 196;
  const fMag = G(xF);
  E('path', { d: `M470,168 L${MG[0] - 150},${MG[1] - 128} M470,232 L${MG[0] - 168},${MG[1] + 96}`, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '8 8', opacity: 0.6 }, fMag);
  const mClip = E('clipPath', { id: 'evMagClip' }, defs()); E('circle', { cx: MG[0], cy: MG[1], r: MR }, mClip);
  E('circle', { cx: MG[0], cy: MG[1], r: MR, fill: '#DDEFF8' }, fMag);
  const mIn = G(fMag, { 'clip-path': 'url(#evMagClip)' });
  const HOLES = [];
  for (let i = 0; i < 7; i++) HOLES.push(MG[0] - 180 + 30 + i * 55);
  let band = '';
  for (let i = 0; i < 8; i++) { const x0 = i === 0 ? MG[0] - 220 : HOLES[i - 1] + 11, x1 = i < 7 ? HOLES[i] - 11 : MG[0] + 220; band += `M${x0},${MG[1] - 18} L${x1},${MG[1] - 18} L${x1},${MG[1] + 18} L${x0},${MG[1] + 18} Z `; }
  E('path', { d: band, fill: '#F2E8CF', stroke: '#C9BFA6', 'stroke-width': 3 }, mIn);
  const GRAIN = [[-30, -8], [-14, -28], [16, -26], [32, -4], [22, 24], [-12, 28], [-30, 12]];
  E('path', { d: [[-120, -64], [-30, -66], [62, -62], [146, -60], [-80, -128], [10, -126], [100, -124]].map(([dx, dy], i) => {
    const a = i * 47 * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
    return closedPath(GRAIN.map(([x, y]) => [MG[0] + dx + x * c - y * sn, MG[1] + dy + x * sn + y * c]));
  }).join(' '), fill: '#E2C383', stroke: '#8A6A30', 'stroke-width': 3 }, mIn);
  const mSmall = [], mSmallP = [[C.water, '#1D84A6'], ['#E3E9EF', '#6B7A88'], ['#B8E86A', '#5E8A22']].map(([f, st]) => E('path', { d: '', fill: f, stroke: st, 'stroke-width': 2 }, mIn));
  for (let i = 0; i < 14; i++) mSmall.push({ k: i % 3, r: [8, 6, 7][i % 3], x: HOLES[i % 7], ph: (i * 0.37) % 1 });
  E('circle', { cx: MG[0], cy: MG[1], r: MR, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8 }, fMag);
  T(fMag, MG[0], 610, 'sand: too big for the holes', { size: 28, weight: 700, anchor: 'middle', fill: '#EED39A' });
  T(fMag, MG[0], 650, 'water and salt particles: small enough', { size: 26, weight: 600, anchor: 'middle', fill: '#FFFFFF', font: FB });
  const fSandy = G(xF), fSal = G(xF);
  const fDots = E('path', { d: '', fill: '#E3F5C8' }, xF);
  const fTag = evChip(gL, 'RESIDUE', { size: 34, color: '#EED39A', stroke: '#EED39A' });

  /* ---- EV: evaporation ---- */
  const xV = G(lCam);
  const vBun = bunsen(xV, 0.9); tr(vBun, 520, 542);
  E('path', { d: 'M420,376 L620,376 M436,376 L414,560 M604,376 L626,560', stroke: '#6B7A88', 'stroke-width': 7, 'stroke-linecap': 'round' }, xV);
  const vBasin = evBasin(xV, 1); tr(vBasin, 520, 312);
  const vSteam = [0, 1, 2, 3].map(() => E('path', { d: 'M0,0 Q-14,-24 0,-48 Q14,-72 0,-96', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, xV));
  const vCard = G(xV);
  evChip(vCard, 'EVAPORATION', { size: 46, color: '#FFE45C', stroke: '#FFE45C' });
  T(vCard, 0, 70, 'the water evaporates', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  T(vCard, 0, 112, 'the salt is left behind', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const vSaltL = labelLine(xV, 300, 470, 470, 350, 'salt', { size: 32, fill: '#FFFFFF', anchor: 'middle' });

  /* ---- CR: crystallisation, three steps ---- */
  const xR = G(lCam);
  const rTitle = evChip(xR, 'CRYSTALLISATION: for neater crystals', { size: 36, color: '#FFE45C', stroke: '#FFE45C' });
  const rPanels = [215, 600, 985].map((x, i) => {
    const g = G(xR); tr(g, x, 400);
    card(g, -175, -175, 350, 340, { fill: 'rgba(10,27,39,0.9)', stroke: C.line, sw: 3, rx: 18 });
    const b = G(g); tr(b, -140, -140);
    E('circle', { r: 24, fill: '#FFE45C' }, b); T(b, 0, 10, String(i + 1), { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });
    return g;
  });
  // 1: heat until saturated (a drop on a glass rod grows crystals)
  const r1 = rPanels[0];
  const r1Flame = G(r1); tr(r1Flame, 0, 70);
  E('path', { d: 'M0,0 C-16,-16 -14,-50 0,-80 C14,-50 16,-16 0,0 Z', fill: '#5AA8FF' }, r1Flame);
  const r1B = evBasin(r1, 0.9); tr(r1B, 0, -40);
  const r1Rod = G(r1);
  E('path', { d: 'M40,-150 L100,-40', stroke: '#CFE7F5', 'stroke-width': 7, 'stroke-linecap': 'round' }, r1Rod);
  const r1X = [0, 1, 2].map(i => E('rect', { x: 92 + i * 7 - 4, y: -38 + (i % 2) * 6, width: 8, height: 8, fill: '#FFFFFF' }, r1Rod));
  T(r1, 0, 140, 'heat until SATURATED', { size: 28, weight: 800, anchor: 'middle', fill: '#FF8A3D' });
  // 2: cool slowly (cubic crystals grow)
  const r2 = rPanels[1];
  const r2B = evBasin(r2, 0.9); tr(r2B, 0, -10); r2B.set(0.7, 0);
  const r2X = [[-50, 30, 18], [-6, 38, 26], [42, 28, 20], [10, 10, 14]].map(([x, y, s]) => {
    const c = E('rect', { x: -s / 2, y: -s / 2, width: s, height: s, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2.5 }, r2); return { c, x, y };
  });
  const r2Snow = G(r2); tr(r2Snow, 110, -110);
  E('path', { d: 'M-20,0 L20,0 M-10,-17 L10,17 M10,-17 L-10,17', stroke: '#9FD8FF', 'stroke-width': 5, 'stroke-linecap': 'round' }, r2Snow);
  T(r2, 0, 140, 'COOL slowly', { size: 30, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  // 3: filter off the crystals and dry them
  const r3 = rPanels[2];
  E('path', { d: 'M-90,-80 L90,-80 L0,30 Z', fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3, 'stroke-linejoin': 'round' }, r3);
  const r3X = [[-30, -54], [0, -60], [28, -52], [-12, -32], [16, -30]].map(([x, y]) => E('rect', { x: x - 8, y: y - 8, width: 16, height: 16, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, r3));
  const r3Dry = [0, 1, 2].map(i => E('path', { d: 'M0,0 Q-8,-12 0,-24 Q8,-36 0,-48', fill: 'none', stroke: '#FFB347', 'stroke-width': 4, 'stroke-linecap': 'round' }, r3));
  T(r3, 0, 140, 'FILTER, then DRY', { size: 30, weight: 800, anchor: 'middle', fill: '#56D69B' });

  /* ---- CU: Sal is a cube again ---- */
  const xU = G(lCam);
  const uPile = [], uPileP = E('path', { d: '', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, xU);
  for (let i = 0; i < 10; i++) uPile.push({ x: 380 + (i % 5) * 110, y: 540 - Math.floor(i / 5) * 18 });
  const uSlot = G(xU);
  const uSpark = E('path', { d: '', fill: '#FFF7C2' }, xU);
  const evStar = (x, y, k) => `M${x},${y - 22 * k} L${x + 5 * k},${y - 5 * k} L${x + 22 * k},${y} L${x + 5 * k},${y + 5 * k} L${x},${y + 22 * k} L${x - 5 * k},${y + 5 * k} L${x - 22 * k},${y} L${x - 5 * k},${y - 5 * k} Z `;
  const uChip = evChip(xU, 'salt CRYSTALS: a solid again', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' });

  /* ---- DI: distillation ---- */
  const DX = 300, DY = 345;
  const xD = G(lCam);
  const dKav = G(xD);
  const dClip = scClipboard(xD, 1.15);
  const dTodo = evChip(xD, 'TO DO: get the WATER back', { size: 32, color: '#9FD8FF', stroke: '#9FD8FF' });
  const dApp = G(xD);
  const dist = ecDistil(dApp); tr(dist, DX, DY);
  const dBub = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5 }, dApp);
  const dSalt = E('path', { d: `M${DX - 44},${DY + 34} Q${DX},${DY + 18} ${DX + 44},${DY + 34} Z`, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, dApp);
  const dTitle = evChip(dApp, 'SIMPLE DISTILLATION', { size: 38, color: '#FFE45C', stroke: '#FFE45C' });
  const dBoil = evChip(dApp, 'the water BOILS', { size: 28, color: '#FF8A3D', stroke: '#FF8A3D' });
  const dCond = G(dApp); T(dCond, 570, 330, 'CONDENSER', { size: 32, weight: 800, anchor: 'middle', fill: '#4CC9F0' });
  T(dCond, 570, 366, 'vapour cools → liquid', { size: 26, weight: 600, anchor: 'middle', fill: '#FFFFFF', font: FB });
  const dIn = T(dApp, 712, 412, 'cold water in', { size: 26, weight: 700, anchor: 'middle', fill: '#4CC9F0' });
  const dOut = T(dApp, 720, 92, 'water out', { size: 26, weight: 700, anchor: 'middle', fill: '#4CC9F0' });
  const dPure = labelLine(dApp, 1050, 480, 940, 440, 'pure water', { size: 30, fill: '#9FD8FF', anchor: 'middle' });
  const dSaltL = labelLine(dApp, 130, 300, 262, 352, 'salt stays', { size: 28, fill: '#FFFFFF', anchor: 'middle' });
  const dArth = G(xD);

  /* ---- FR: the fractionating column (crude oil; then liquid air) ---- */
  const xC = G(lCam);
  E('rect', { x: 240, y: 548, width: 180, height: 14, rx: 5, fill: '#FF6A2A', stroke: '#FFB03A', 'stroke-width': 3 }, xC);
  const cFlask = flask(xC, 1, { level: 0.55, liquid: '#5A3A1E' }); tr(cFlask, 330, 455);
  E('rect', { x: 312, y: 150, width: 36, height: 212, fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 4 }, xC);
  let beads = '';
  for (let i = 0; i < 9; i++) for (let j = 0; j < 2; j++) beads += `M${322 + j * 16 + (i % 2) * 4},${190 + i * 19} a5,5 0 1,0 0.1,0 `;
  E('path', { d: beads, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 2, opacity: 0.6 }, xC);
  E('path', { d: 'M348,172 L470,212', stroke: GLASS.stroke, 'stroke-width': 10, 'stroke-linecap': 'round' }, xC);
  const cTemp = G(xC);
  E('rect', { x: 262, y: 160, width: 18, height: 380, rx: 9, fill: linGrad('#4CC9F0', '#FF6A2A', true) }, cTemp);
  T(cTemp, 248, 186, 'cooler', { size: 26, weight: 700, anchor: 'end', fill: '#4CC9F0' });
  T(cTemp, 248, 530, 'hotter', { size: 26, weight: 700, anchor: 'end', fill: '#FF8A3D' });
  const cVap = [], cVapP = [0, 1, 2].map(() => E('path', { d: '', stroke: SC_INK, 'stroke-width': 1.5 }, xC));
  for (let i = 0; i < 9; i++) cVap.push({ k: i % 3, ph: i / 9 });
  const cOil = G(xC);
  const cTitle = evChip(cOil, 'FRACTIONAL DISTILLATION', { size: 38, color: '#FFE45C', stroke: '#FFE45C' }); tr(cTitle, 860, 160);
  const cSub = T(cOil, 860, 228, 'separates liquids with different boiling points', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const cBarrel = G(cOil); tr(cBarrel, 960, 430);
  E('rect', { x: -60, y: -80, width: 120, height: 160, rx: 14, fill: '#2A2F36', stroke: '#9AA6B2', 'stroke-width': 4 }, cBarrel);
  E('path', { d: 'M-60,-36 L60,-36 M-60,36 L60,36', stroke: '#9AA6B2', 'stroke-width': 4 }, cBarrel);
  E('path', { d: 'M0,-14 Q16,8 0,20 Q-16,8 0,-14 Z', fill: '#FFC247' }, cBarrel);
  T(cBarrel, 0, 124, 'crude oil', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const cFirst = evChip(cOil, 'lowest boiling point: off FIRST, at the TOP', { size: 28, color: '#FFF27A', stroke: '#FFF27A' });
  const cFirstA = arrow(cOil, 600, 268, 486, 214, { color: '#FFF27A', width: 5 });
  // liquid air version
  const cAir = G(xC);
  T(cAir, 422, 524, 'liquid air', { size: 30, weight: 800, anchor: 'start', fill: '#9FD8FF' });
  const cNig = G(cAir);
  const cTrophy = G(cAir);
  E('path', { d: 'M-26,-40 L26,-40 L20,-8 Q0,6 -20,-8 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, cTrophy);
  E('path', { d: 'M-26,-34 Q-42,-30 -30,-14 M26,-34 Q42,-30 30,-14', fill: 'none', stroke: '#FFC247', 'stroke-width': 5 }, cTrophy);
  E('rect', { x: -6, y: 0, width: 12, height: 14, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 2 }, cTrophy);
  E('rect', { x: -20, y: 14, width: 40, height: 10, rx: 3, fill: '#B57B12', stroke: SC_INK, 'stroke-width': 2 }, cTrophy);
  const cLow = evChip(cAir, 'LOWEST BOILING POINT', { size: 28, color: '#FFC247', stroke: '#FFC247' });
  const RANK = [['1st', 'N_2', '−196 °C', '#86A2FF'], ['2nd', 'Ar', '−186 °C', '#CDB2FF'], ['3rd', 'O_2', '−183 °C', '#FF6B5C']].map(([n, f, bp, col], i) => {
    const g = G(cAir); tr(g, 960, 420 + i * 72);
    card(g, -170, -30, 340, 60, { fill: 'rgba(10,27,39,0.92)', stroke: col, sw: 3, rx: 30 });
    T(g, -120, 11, n, { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    evRich(g, -30, 11, f, { size: 32, fill: col });
    T(g, 90, 11, bp, { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  });

  /* ---- the show banner (bottom left) ---- */
  const banner = G(gL), bInner = G(banner);
  E('rect', { x: -215, y: -34, width: 430, height: 68, rx: 12, fill: '#1A0A14', stroke: '#FF3B6B', 'stroke-width': 4 }, bInner);
  E('circle', { cx: -188, cy: 0, r: 9, fill: '#FF3B3B' }, bInner);
  const bTxt = T(bInner, 12, 12, 'EVICTION NIGHT', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 1 });

  /* =====================================================================
     ARTHUR'S CONFESSIONAL
     ===================================================================== */
  const gC = G(root), qCam = G(gC);
  const qBg = ecConfessional(qCam, 'arthur');
  const qSlot = G(qCam);
  const qFg = G(gC);
  // can't
  const qCant = evPanel(qFg, 500, 360, C.bad);
  T(qCant, 0, -110, "You CAN'T filter", { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(qCant, 0, -64, 'salt out of salt water', { size: 36, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const qMini = G(qCant); tr(qMini, -70, 40);
  E('path', { d: 'M-60,-50 L60,-50 L10,10 L10,40 L-10,40 L-10,10 Z', fill: 'rgba(200,230,250,0.15)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, qMini);
  E('path', { d: 'M-52,-46 L52,-46 L0,6 Z', fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, qMini);
  E('path', { d: 'M-44,-42 L44,-42 L0,0 Z', fill: '#9FD8FF', opacity: 0.8 }, qMini);
  E('path', { d: 'M0,48 Q6,58 0,64 Q-6,58 0,48 Z', fill: '#9FD8FF' }, qMini);
  T(qCant, 70, 30, 'filtrate:', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  T(qCant, 70, 66, 'still salty', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const qX = cross(qCant, 40); tr(qX, 175, 110);
  // keep: two panels
  const qKeep = [['EVAPORATION', 'keeps the SOLID', '#FFE45C', 'salt'], ['DISTILLATION', 'keeps the LIQUID', '#9FD8FF', 'water']].map(([a, b, col, k], i) => {
    const g = evPanel(qFg, 520, 220, col);
    T(g, 70, -22, a, { size: 40, weight: 800, anchor: 'middle', fill: col });
    T(g, 70, 30, b, { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    const ic = G(g); tr(ic, -170, 10);
    if (k === 'salt') { const bs = evBasin(ic, 0.6); tr(bs, 0, -10); bs.set(0, 1); }
    else { const bk = beaker(ic, 90, 110, { level: 0.7, liquid: '#9FD8FF' }); tr(bk, 0, 0); }
    return g;
  });
  // the flat, frozen and boiled off: an inset window
  const qAir = G(qFg);
  card(qAir, -230, -200, 460, 400, { fill: linGrad('#1B3A5A', '#2E5E88', true), stroke: '#FFFFFF', sw: 6, rx: 18 });
  const qFlask = flask(qAir, 0.8, { level: 0, liquid: '#7FD8F7' }); tr(qFlask, 0, 120);
  const qMols = [['N', 0], ['N', 1], ['N', 2], ['N', 3], ['O', 0], ['O', 1], ['Ar', 0]].map(([k], i) => {
    const m = G(qAir);
    if (k === 'Ar') ecAtom(m, 'Ar', 16);
    else { tr(ecAtom(m, k, 14), -12, 0); tr(ecAtom(m, k, 14), 12, 0); }
    const order = k === 'N' ? 0 : k === 'Ar' ? 1 : 2;
    return { m, x: -170 + (i * 61) % 340, y: -150 + (i * 37) % 110, ph: i * 1.3, order, i };
  });
  const qAir1 = evChip(qFg, 'cooled to a LIQUID (about −200 °C)', { size: 26, color: '#9FD8FF', stroke: '#9FD8FF' });
  const qAir2 = evChip(qFg, 'then boiled off, one at a time', { size: 26, color: '#FF8A3D', stroke: '#FF8A3D' });

  /* =====================================================================
     cut list
     ===================================================================== */
  const CUTS = [
    [-1, 'L', 'E'],
    [at('filter') - 0.08, 'L', 'F'],
    [at('stuck') - 0.08, 'L', 'ST'],
    [at('holes') - 0.08, 'L', 'H'],
    [at('residue') - 0.08, 'L', 'RS'],
    [at('through') - 0.08, 'L', 'TH'],
    [at('cant') - 0.08, 'C', 'cant'],
    [at('evap') - 0.08, 'L', 'EV'],
    [at('cryst') - 0.08, 'L', 'CR'],
    [at('cube') - 0.08, 'L', 'CU'],
    [at('distil') - 0.08, 'L', 'DK'],
    [mid('distil', 0.3), 'L', 'DI'],
    [at('keep') - 0.08, 'C', 'keep'],
    [at('fraction') - 0.08, 'L', 'FR'],
    [at('thair') - 0.08, 'C', 'air'],
    [at('first') - 0.08, 'L', 'FI'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const LSHOT = { E: xE, F: xF, ST: xF, H: xF, RS: xF, TH: xF, EV: xV, CR: xR, CU: xU, DK: xD, DI: xD, FR: xC, FI: xC };

  return t => {
    const [c0, shot, setup] = cutAt(t);
    op(gL, shot === 'L' ? 1 : 0); op(gC, shot === 'C' ? 1 : 0);
    CAST.forEach(ch => op(ch, 0)); op(salWrap, 0); op(tada, 0); op(mic, 0);

    /* ---------------- LAB ---------------- */
    op(fTag, 0);
    if (shot === 'L') {
      for (const k in LSHOT) if (LSHOT[k] !== LSHOT[setup]) op(LSHOT[k], 0);
      op(LSHOT[setup], 1);
      evCam(lCam, 1, 600, 375);
      // spotlights sweep (reality-show lighting)
      const aim = { E: 650, F: 430, ST: 430, H: 430, RS: 430, TH: 430, EV: 520, CR: 600, CU: 600, DK: 330, DI: 400, FR: 330, FI: 520 }[setup];
      spots.forEach((s, i) => {
        const x0 = i ? 980 : 220, sw = Math.sin(t * 0.7 + i * 2) * 40 * AMP, cx = aim + sw + (i ? 60 : -60);
        attr(s, 'd', `M${x0 - 30},-40 L${x0 + 30},-40 L${cx + 170},560 L${cx - 170},560 Z`);
      });
      // the banner: big title at the start of the night, then a corner strap
      const bp = P(t, at('evict') + 0.1, 0.5, pop), bm = P(t, mid('evict', 0.45), 0.6, ease);
      op(banner, clamp(bp * 2.5));
      tr(banner, lerp(600, 262, bm), lerp(170, 682, bm), Math.max(0.01, lerp(1.6, 1, bm) * (0.6 + 0.4 * bp)));
      setText(bTxt, t >= mid('distil', 0.3) ? 'NOW: DISTILLATION' : t >= end('residue') ? 'EVICTED: SANDY' : 'EVICTION NIGHT');

      if (setup === 'E') {
        evSeat(SANDY, eSandy); tr(SANDY, 610, 498 + Math.sin(t * 1.5) * 3 * AMP, 0.42);
        SANDY.set({ t, mood: 'sad', look: 0.4 });
        evSeat(SAL, eSal); tr(SAL, 712, 400 + Math.sin(t * 1.2) * 4 * AMP, 0.38); op(SAL, 0.6);
        SAL.set({ t, mood: t < mid('evict', 0.5) ? 'shock' : 'neutral', look: -0.4 });
        evPop(eC2, P(t, mid('evict', 0.55), 0.4, pop), 1015, 356); eA2.set(P(t, mid('evict', 0.6), 0.35)); op(eA2, P(t, mid('evict', 0.6), 0.1, linear));
        evPop(eC1, P(t, mid('evict', 0.68), 0.4, pop), 1015, 476); eA1.set(P(t, mid('evict', 0.72), 0.35)); op(eA1, P(t, mid('evict', 0.72), 0.1, linear));
        evPop(eMix, P(t, mid('evict', 0.85), 0.4, pop), 900, 640);
        evCam(lCam, 1 + 0.04 * P(t, at('evict'), 6, linear), 650, 400);
      }

      if (['F', 'ST', 'H', 'RS', 'TH'].includes(setup)) {
        filt.upd(t);
        [fPour, fStream, fPaperL, fCard, fRes, fFil, fMag, fArth].forEach(e => op(e, 0));
        op(fDots, 0);
        const pour = P(t, mid('filter', 0.3), mid('filter', 0.75) - mid('filter', 0.3), linear);
        const after = setup !== 'F';
        filt.set({ cloudy: after ? 0.35 : 0.9 * pour, residue: after ? 1 : pour, filtrate: after ? (setup === 'TH' ? 0.6 + 0.2 * P(t, c0, 1.8, linear) : 0.6) : 0.6 * P(t, mid('filter', 0.4), 1.8, linear) });
        if (setup === 'F') {
          op(fPour, 1);
          const tilt = P(t, mid('filter', 0.22), 0.5, ease) * (1 - P(t, mid('filter', 0.8), 0.5, ease));
          tr(fPour, lerp(700, 610, tilt), lerp(230, 150, tilt), 1, -75 * tilt);
          fPourB.set(lerp(0.6, 0.15, pour));
          if (pour > 0 && pour < 1) { op(fStream, 1); attr(fStream, 'd', `M572,120 Q520,128 ${FX + 20},${FY - 150}`); } else op(fStream, 0);
          op(fPaperL, P(t, mid('filter', 0.62), 0.3, linear));
          evPop(fCard, P(t, at('filter') + 0.15, 0.45, pop), 920, 360);
          op(fArth, 1); evSeat(ARTHUR, fArth); tr(ARTHUR, 990, 590, 0.52);
          ARTHUR.set({ t, talk: talk(t, 'arthur'), mood: 'deadpan', look: -0.8 });
          op(mic, 1); fArth.appendChild(mic); tr(mic, 952, 610, 0.6, -20);
        } else if (setup === 'ST' || setup === 'RS') {
          const rs = setup === 'RS';
          const k = rs ? 2.4 + 0.35 * P(t, c0, at('through') - c0, easeOut) : 2.4;
          evCam(lCam, k, FX, 200, 600, 380);
          op(fSandy, 1); evSeat(SANDY, fSandy);
          // Sandy in the paper cone (drawn in the camera's world: she zooms with it)
          const fl = rs ? 0 : Math.sin(t * 9) * AMP;
          tr(SANDY, FX + fl * 6, 196 + Math.abs(fl) * 2, 0.32, fl * 12);
          const fs = (t - at(rs ? 'residue' : 'stuck')) / (end(rs ? 'residue' : 'stuck') - at(rs ? 'residue' : 'stuck'));
          SANDY.set({ t, talk: talk(t, 'sandy'), mood: rs ? (fs < 0.4 ? 'sad' : 'deadpan') : 'shock', look: 0, sweat: rs ? 0 : 1 });
          if (rs) { evPop(fTag, P(t, at('residue') + 0.1, 0.4, pop), 600, 560, 1, 5 * Math.sin(t * 5) * AMP); }
        } else if (setup === 'H') {
          op(fMag, P(t, c0, 0.25, linear));
          op(fRes, P(t, mid('holes', 0.55), 0.3, linear)); op(fFil, P(t, mid('holes', 0.8), 0.3, linear));
          const sm = [[], [], []];
          mSmall.forEach((m, i) => { const f = (t * 0.32 + m.ph) % 1; sm[m.k].push([m.x + Math.sin(t * 3 + i) * 3 * AMP, MG[1] - 180 + f * 380, m.r]); });
          mSmallP.forEach((pth, k) => attr(pth, 'd', evCircles(sm[k])));
        } else {   // TH: Sal's particles slip through the paper, waving
          evCam(lCam, 1.3, FX, 330, 600, 400);
          op(fSandy, 1); evSeat(SANDY, fSandy);
          tr(SANDY, FX, 198, 0.32);
          SANDY.set({ t, mood: 'sad', look: 0, still: true });
          // a stream of salt particles down the stem
          const fd = [];
          for (let i = 0; i < 10; i++) { const f = (t * 0.9 + i / 10) % 1; fd.push([FX + Math.sin(f * 12 + i) * 3, lerp(240, 470, f), 4]); }
          op(fDots, 0.9); attr(fDots, 'd', evCircles(fd));
          op(salWrap, 1); evSeat(SAL, salBody); fSal.appendChild(salWrap); op(fSal, 1);
          const sp = P(t, at('through') - 0.05, end('through') - at('through') + 0.1, ease);
          const y = lerp(150, 470, sp), squash = y > 250 && y < 360 ? 0.4 : 1;
          salWrap.setAttribute('transform', `translate(${FX} ${y.toFixed(1)}) scale(${(0.3 * squash).toFixed(3)} 0.3)`);
          tr(SAL, 0, 0); op(SAL, 0.75);
          SAL.set({ t, talk: talk(t, 'sal'), mood: 'happy', look: 0 });
          tr(salArm, 110, -20, 1, 25 * Math.sin(t * 10) * AMP);
        }
      }

      if (setup === 'EV') {
        vBun.upd(t);
        const ep = P(t, mid('evap', 0.25), mid('evap', 0.85) - mid('evap', 0.25), linear);
        vBasin.set(1 - ep, P(t, mid('evap', 0.55), 1.4, linear));
        vSteam.forEach((s, i) => { const f = ((t * 0.55 + i / 4) % 1); tr(s, 450 + i * 45, 300 - f * 70); op(s, 0.55 * Math.sin(f * Math.PI) * (1 - ep * 0.6) * P(t, at('evap'), 0.8, linear)); });
        evPop(vCard, P(t, mid('evap', 0.2), 0.45, pop), 900, 230);
        op(vSaltL, P(t, mid('evap', 0.75), 0.3, linear));
        evCam(lCam, 1 + 0.05 * P(t, at('evap'), 6, linear), 520, 380);
      }

      if (setup === 'CR') {
        evPop(rTitle, P(t, at('cryst') + 0.05, 0.4, pop), 600, 160);
        const s1 = mid('cryst', 0.12), s2 = mid('cryst', 0.42), s3 = mid('cryst', 0.66);
        [s1, s2, s3].forEach((ts, i) => evPop(rPanels[i], P(t, ts, 0.45, pop), [215, 600, 985][i], 400));
        r1B.set(lerp(1, 0.55, P(t, s1, 2, linear)), 0);
        tr(r1Flame, 0, 70, 1 + 0.08 * Math.sin(t * 11) * AMP);
        r1X.forEach((x, i) => op(x, P(t, s1 + 1.2 + i * 0.25, 0.3, linear)));
        r2X.forEach(({ c, x, y }, i) => tr(c, x, y, Math.max(0.01, P(t, s2 + 0.3 + i * 0.35, 1.0, easeOut)), 10 * i));
        tr(r2Snow, 110, -110, 1, t * 20 * AMP);
        r3Dry.forEach((d, i) => { const f = ((t * 0.6 + i / 3) % 1); tr(d, -50 + i * 50, -90 - f * 30); op(d, P(t, s3 + 1.2, 0.4, linear) * Math.sin(f * Math.PI)); });
        r3X.forEach((x, i) => op(x, P(t, s3 + 0.3 + i * 0.12, 0.25, linear)));
      }

      if (setup === 'CU') {
        // the crystals zip together and Sal pops out of them
        const zp = P(t, c0 + 0.1, 0.5, easeIn), sp = P(t, c0 + 0.55, 0.5, pop);
        op(uPileP, 1 - P(t, c0 + 0.5, 0.15, linear));
        attr(uPileP, 'd', evSquares(uPile.map(u => [lerp(u.x, 600, zp), lerp(u.y, 400, zp), 16])));
        evSeat(SAL, uSlot); op(SAL, clamp(sp * 3));
        const up = P(t, at('cube') + 0.2, 0.3, easeOut);
        tr(SAL, 600, 390 - 14 * Math.abs(Math.sin(t * 4)) * AMP * up, Math.max(0.01, 1.25 * sp));
        SAL.set({ t, talk: talk(t, 'sal'), mood: 'happy', look: 0 });
        op(tada, clamp(sp * 3)); uSlot.insertBefore(tada, SAL);
        tr(tada, 600, 390 - 14 * Math.abs(Math.sin(t * 4)) * AMP * up, Math.max(0.01, 1.25 * sp));
        [...tada.children].forEach(a => tr(a, a.sd * 92, 6, 1, a.sd * lerp(-60, 0, up)));
        let sd = '';
        for (let i = 0; i < 7; i++) {
          const a = i / 7 * TAU + t * 0.6 * AMP, r = 250 + 20 * Math.sin(t * 3 + i);
          const tw = 0.5 + 0.5 * Math.sin(t * 6 + i * 1.7);
          sd += evStar(600 + Math.cos(a) * r, 380 + Math.sin(a) * r * 0.62, 0.4 + 0.8 * tw);
        }
        attr(uSpark, 'd', sd); op(uSpark, sp > 0.5 ? 1 : 0);
        evPop(uChip, P(t, mid('cube', 0.6), 0.4, pop), 790, 655);
        evCam(lCam, 1 + 0.05 * P(t, end('cube'), 0.6, easeOut), 600, 400);
      }

      if (setup === 'DK' || setup === 'DI') {
        const dk = setup === 'DK';
        op(dKav, dk ? 1 : 0); op(dClip, dk ? 1 : 0); op(dTodo, 0); op(dApp, dk ? 0 : 1); op(dArth, 0);
        if (dk) {
          evSeat(KAVYA, dKav); tr(KAVYA, 380, 470, 1.15);
          KAVYA.set({ t, mood: 'deadpan', look: 0.5 });
          tr(dClip, 580, 560, 1.15, 10 + 2 * Math.sin(t * 2) * AMP);
          evPop(dTodo, P(t, at('distil') + 0.15, 0.4, pop), 860, 300);
          evCam(lCam, 1.03, 600, 400);
        } else {
          dist.upd(t);
          const heat = P(t, c0 + 0.1, 0.4, linear);
          const col = P(t, mid('condense', 0.4), end('condense') - mid('condense', 0.4) + 2.5, linear);
          dist.set({ heat, flask: lerp(0.6, 0.38, col), collect: col });
          op(dSalt, P(t, mid('condense', 0.6), 0.8, linear));
          const bb = [];
          for (let i = 0; i < 6; i++) { const f = ((t * 1.3 + i / 6) % 1); bb.push([DX - 30 + (i * 13) % 60 + Math.sin(t * 5 + i) * 3, lerp(DY + 74, DY + 22, f), 3 + 3 * f]); }
          attr(dBub, 'd', evCircles(bb)); op(dBub, heat * 0.85);
          evPop(dTitle, P(t, c0 + 0.15, 0.45, pop), 730, 655);
          evPop(dBoil, P(t, mid('distil', 0.55), 0.4, pop), 490, 470);
          op(dCond, P(t, at('condense') + 0.1, 0.3, linear));
          op(dIn, P(t, mid('condense', 0.3), 0.3, linear)); op(dOut, P(t, mid('condense', 0.3), 0.3, linear));
          op(dPure, P(t, mid('condense', 0.7), 0.3, linear));
          op(dSaltL, P(t, mid('distil', 0.8), 0.3, linear));
          op(dArth, 1); evSeat(ARTHUR, dArth); tr(ARTHUR, 1095, 590, 0.48);
          ARTHUR.set({ t, talk: talk(t, 'arthur'), mood: 'deadpan', look: -0.8 });
          op(mic, 1); dArth.appendChild(mic); tr(mic, 1058, 608, 0.55, -20);
          if (t < at('condense')) op(dPure, 0);
        }
      }

      if (setup === 'FR' || setup === 'FI') {
        const fi = setup === 'FI';
        op(cOil, fi ? 0 : 1); op(cAir, fi ? 1 : 0);
        cFlask.set(0.55, fi ? '#BFE3F7' : '#5A3A1E');
        const vp = [[], [], []];
        cVap.forEach((v, i) => {
          const f = (t * 0.45 + v.ph) % 1, top = [1, 0.62, 0.32][v.k];
          let y = lerp(380, 380 - 210 * top, Math.min(1, f / 0.7)), x = 330 + Math.sin(t * 3 + i) * 7;
          if (f > 0.7) { if (v.k === 0) { x = lerp(352, 470, (f - 0.7) / 0.3); y = lerp(172, 212, (f - 0.7) / 0.3); } else y = lerp(380 - 210 * top, 380, (f - 0.7) / 0.3); }
          vp[v.k].push([x, y, 7]);
        });
        cVapP.forEach((pth, k) => { attr(pth, 'd', evCircles(vp[k])); attr(pth, 'fill', fi ? ['#86A2FF', '#CDB2FF', '#FF6B5C'][k] : ['#FFF27A', '#FFB347', '#B5651D'][k]); });
        if (!fi) {
          evPop(cTitle, P(t, at('fraction') + 0.1, 0.45, pop), 860, 160);
          op(cSub, P(t, mid('fraction', 0.25), 0.3, linear));
          evPop(cBarrel, P(t, mid('fraction', 0.42), 0.45, pop), 960, 430);
          evPop(cFirst, P(t, mid('fraction', 0.68), 0.45, pop), 830, 300);
          op(cFirstA, P(t, mid('fraction', 0.72), 0.1, linear)); cFirstA.set(P(t, mid('fraction', 0.72), 0.4));
          evCam(lCam, 1, 600, 375);
        } else {
          // the Nigels pop out of the top with a trophy
          evSeat(NIGELS, cNig);
          const np = P(t, at('first') - 0.05, 0.5, pop);
          const nx = lerp(480, 680, clamp(np)), ny = lerp(212, 330, clamp(np));
          op(NIGELS, clamp(np * 3)); tr(NIGELS, nx, ny, Math.max(0.01, 0.78 * np));
          const pause = t > end('first');
          NIGELS.set({ t, talk: talk(t, 'nigels'), talkB: talk(t, 'nigels'), mood: pause ? 'happy' : 'smug', moodB: pause ? 'happy' : 'smug', look: 0, lookB: 0 });
          const tp = P(t, mid('first', 0.35), 0.4, pop);
          evPop(cTrophy, tp, nx, ny - 112 - 6 * Math.abs(Math.sin(t * 3)) * AMP, 1.4);
          evPop(cLow, P(t, mid('first', 0.45), 0.4, pop), 680, 455);
          RANK.forEach((g, i) => evPop(g, P(t, mid('first', 0.5) + i * 0.45, 0.4, pop), 970, 200 + i * 76));
          evCam(lCam, 1 + 0.04 * P(t, end('first'), 1.4, easeOut), 760, 380);
        }
      }
    }

    /* ---------------- CONFESSIONAL ---------------- */
    if (shot === 'C') {
      qBg.set(1, t);
      op(qCant, 0); qKeep.forEach(g => op(g, 0)); op(qAir, 0); op(qAir1, 0); op(qAir2, 0);
      evSeat(ARTHUR, qSlot);
      let mood = 'deadpan', look = 0, k = 1, ax = 420;
      if (setup === 'cant') {
        look = t < mid('cant', 0.5) ? 0.6 : 0;
        evPop(qCant, P(t, mid('cant', 0.25), 0.45, pop), 870, 360);
        tr(qX, 175, 110, Math.max(0.01, P(t, mid('cant', 0.7), 0.4, pop)));
        k = 1 + 0.12 * P(t, end('cant'), at('evap') - end('cant'), easeOut);
      } else if (setup === 'keep') {
        look = 0.6; ax = 360;
        evPop(qKeep[0], P(t, mid('keep', 0.1), 0.45, pop), 880, 230);
        evPop(qKeep[1], P(t, mid('keep', 0.55), 0.45, pop), 880, 500);
        k = 1 + 0.03 * P(t, at('keep'), 4, linear);
      } else {
        const f = (t - at('thair')) / (end('thair') - at('thair'));
        mood = f < 0.15 ? 'annoyed' : 'deadpan'; look = f > 0.2 && f < 0.85 ? 0.6 : 0; ax = 340;
        op(qAir, P(t, at('thair') + 0.1, 0.3, linear)); tr(qAir, 870, 380);
        const cool = P(t, mid('thair', 0.25), 1.2, ease);
        qFlask.set(0.55 * cool * (1 - 0.8 * P(t, mid('thair', 0.6), 2.2, linear)));
        qMols.forEach(m => {
          const tb = mid('thair', 0.58) + m.order * 0.7 + m.i * 0.06;   // N2 first, then Ar, then O2
          let x = m.x + Math.sin(t * 0.8 + m.ph) * 14 * AMP, y = m.y + Math.cos(t * 0.6 + m.ph) * 10 * AMP, o = 1;
          if (cool > 0) { x = lerp(x, (m.i - 3) * 9, cool); y = lerp(y, 150, cool); o = 1 - P(t, mid('thair', 0.25) + 0.9, 0.3, linear); }
          const b = P(t, tb, 1.1, easeOut);
          if (b > 0) { x = lerp(0, (m.i - 3) * 50, b); y = lerp(40, -165, b); o = 1 - P(t, tb + 1.0, 0.5, linear); }
          tr(m.m, x, y, 1, t * 20 * AMP + m.ph * 50); op(m.m, clamp(o));
        });
        evPop(qAir1, P(t, mid('thair', 0.3), 0.4, pop), 870, 630);
        if (t > mid('thair', 0.58)) { op(qAir1, 0); evPop(qAir2, P(t, mid('thair', 0.58), 0.4, pop), 870, 630); }
        k = 1 + 0.04 * P(t, at('thair'), 6, linear);
      }
      evCam(qCam, k, ax, 400);
      tr(ARTHUR, ax, 400, 1.4);
      ARTHUR.set({ t, talk: talk(t, 'arthur'), mood, look });
    }
  };
});

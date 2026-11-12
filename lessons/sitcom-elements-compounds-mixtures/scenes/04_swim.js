/* Scene 4: Sal goes for a swim (purity, melting points, solutions).
   Beats: Kavya's "100% pure" juice carton -> Arthur: pure = one element or one compound; the juice explodes
   into a mixture -> melting-point graph: pure ice melts sharply at 0 °C -> Sal jumps in: impurity, melting
   point down, boiling point up, over a range -> gritting truck on icy roads -> Kavya: it's 34 °C (Sal's
   wistful snow postcard) -> Sal cannonballs into a beaker and vanishes -> Arthur: dissolved; the lattice
   breaks up among water particles; solute, solvent, solution -> 10 g + 100 g = 110 g -> Sandy sinks:
   insoluble -> saturated -> solubility rises with temperature -> sugar at the bottom of iced teh-O ->
   "Also, stir it." -> dilute vs concentrated -> teh-O siew dai is more dilute; Arthur's tiny proud smile. */
scene('swim', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed swim) ---------- */
  function swimCam(el, k, cx, cy, px, py) {
    el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function swimPop(el, p, x, y, s, r) { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); }
  function swimChip(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 });
  }
  function swimPanel(parent, w, h, stroke) {
    const g = G(parent);
    card(g, -w / 2, -h / 2, w, h, { fill: 'rgba(10,27,39,0.93)', stroke: stroke || C.line, sw: 4, rx: 18 });
    return g;
  }
  // many dots or squares as ONE path (keeps the element count down)
  const swimCircles = pts => pts.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `).join('');
  const swimSquares = pts => pts.map(([x, y, q]) => `M${(x - q / 2).toFixed(1)},${(y - q / 2).toFixed(1)} h${q} v${q} h${-q} Z `).join('');
  function swimSeat(ch, slot) { if (ch.parentNode !== slot) slot.appendChild(ch); op(ch, 1); }
  // a juice carton, about 170 x 270, origin at its centre
  function swimCarton(parent) {
    const g = G(parent);
    E('rect', { x: -14, y: -150, width: 28, height: 26, rx: 4, fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-85,-70 L-60,-128 L60,-128 L85,-70 Z', fill: '#FFF4D6', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -85, y: -70, width: 170, height: 200, rx: 6, fill: '#FF9A2E', stroke: SC_INK, 'stroke-width': 4 }, g);
    T(g, 0, -28, '100%', { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, 0, 16, 'PURE', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('circle', { cx: 0, cy: 78, r: 32, fill: ball('#FFC56B', '#E07A1E'), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M2,48 Q16,34 30,40 Q18,52 2,48 Z', fill: '#5BD27A', stroke: SC_INK, 'stroke-width': 2 }, g);
    return g;
  }
  // a tall glass of teh-O with n sugar particles; g.upd(t) jiggles them. About 180 x 250.
  function swimGlass(parent, n, seed) {
    const g = G(parent), r = rng(seed), dots = [];
    const hw = y => lerp(72, 86, (125 - y) / 250);   // half-width of the glass at height y
    E('path', { d: 'M-86,-125 L86,-125 L72,125 L-72,125 Z', fill: 'rgba(200,230,250,0.12)' }, g);
    E('path', { d: `M${-hw(-80)},-80 L${hw(-80)},-80 L72,122 L-72,122 Z`, fill: '#B5651D', opacity: 0.88 }, g);
    const dp = E('path', { d: '', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, g);
    for (let i = 0; i < n; i++) {
      const y = -60 + r() * 170, x = (r() * 2 - 1) * (hw(y) - 18);
      dots.push({ x, y, ph: r() * TAU });
    }
    E('path', { d: 'M-86,-125 L-72,125 L72,125 L86,-125', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: 52, y: -110, width: 7, height: 200, rx: 3, fill: GLASS.shine }, g);
    g.upd = t => attr(dp, 'd', swimCircles(dots.map(d => [d.x + Math.sin(t * 1.3 + d.ph) * 5 * AMP, d.y + Math.cos(t * 1.1 + d.ph) * 4 * AMP, 9])));
    g.upd(0);
    return g;
  }
  // three ice cubes floating at the top of a teh-O (drawn in its local coordinates)
  function swimIce(parent) {
    [[-30, -54, -12], [8, -50, 10], [36, -58, 24]].forEach(([x, y, a]) => {
      const c = G(parent); tr(c, x, y, 1, a);
      E('rect', { x: -15, y: -15, width: 30, height: 30, rx: 6, fill: '#E6F7FF', opacity: 0.8, stroke: '#FFFFFF', 'stroke-width': 2 }, c);
    });
  }

  /* ---------- the cast: one of each, re-seated in whichever shot is on screen ---------- */
  const hold = G(root); op(hold, 0);
  const ARTHUR = cast(hold, 'arthur'), SAL = cast(hold, 'sal'), SANDY = cast(hold, 'sandy'), KAVYA = cast(hold, 'kavya');
  const CAST = [ARTHUR, SAL, SANDY, KAVYA];

  /* =====================================================================
     KITCHEN: the carton, the heat, the teh-O, the order slip
     ===================================================================== */
  const gK = G(root), kCam = G(gK);
  const kit = ecKitchen(kCam);
  const kSun = G(kCam); tr(kSun, 1010, 160);
  E('circle', { r: 110, fill: glow('#FFE45C') }, kSun);
  E('circle', { r: 46, fill: '#FFE45C', stroke: '#FFB13B', 'stroke-width': 5 }, kSun);
  const kSlot = G(kCam);
  E('rect', { x: -20, y: 600, width: 1240, height: 160, fill: '#8A5A3B' }, kCam);
  E('rect', { x: -20, y: 600, width: 1240, height: 18, fill: '#A8724D' }, kCam);
  // carton, held up (a hand under it)
  const kCarton = G(kCam);
  swimCarton(kCarton);
  E('ellipse', { cx: 46, cy: 126, rx: 38, ry: 22, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, kCarton);
  // the fan (her worksheet) for the heat
  const kFan = G(kCam);
  E('rect', { x: -48, y: -140, width: 96, height: 130, rx: 4, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, kFan);
  E('path', { d: 'M-34,-116 L30,-116 M-34,-96 L20,-96 M-34,-76 L26,-76', stroke: '#BFD3E6', 'stroke-width': 4 }, kFan);
  E('ellipse', { cx: 0, cy: 0, rx: 26, ry: 18, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, kFan);
  const kHot = swimChip(kCam, '34 °C', { size: 44, color: '#FFB13B', stroke: '#FFB13B' });
  // teh-O with ice and sugar at the bottom
  const kTeh = G(kCam), kTehO = ecTehO(kTeh, 1); swimIce(kTeh); kTehO.set(1);
  const kSugar = swimChip(kCam, 'sugar at the bottom', { size: 28, color: '#FFFFFF', stroke: '#FFFFFF' });
  const kSugarA = arrow(kCam, 300, 652, 380, 582, { color: '#FFFFFF', width: 5 });
  // the order slip and a dilute glass
  const kSlip = G(kCam);
  E('rect', { x: -170, y: -110, width: 340, height: 220, rx: 6, fill: '#FFFDF4', stroke: '#C9BFA6', 'stroke-width': 4 }, kSlip);
  E('rect', { x: -170, y: -110, width: 340, height: 46, rx: 6, fill: '#E8424F' }, kSlip);
  T(kSlip, 0, -76, 'KOPITIAM ORDER', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(kSlip, 0, -6, 'TEH-O SIEW DAI', { size: 36, weight: 800, anchor: 'middle', fill: SC_INK });
  T(kSlip, 0, 58, '= less sugar', { size: 32, weight: 700, anchor: 'middle', fill: '#C2453A' });
  const kGlassW = G(kCam);
  const kGlow = E('ellipse', { rx: 120, ry: 160, fill: glow('#9FD8FF') }, kGlassW);
  const kGlass = swimGlass(kGlassW, 4, 71);
  const kDil = swimChip(kCam, 'more DILUTE ✓', { size: 32, color: '#9FD8FF', stroke: '#9FD8FF' });

  /* =====================================================================
     ARTHUR'S CONFESSIONAL
     ===================================================================== */
  const gC = G(root), cCam = G(gC);
  const cBg = ecConfessional(cCam, 'arthur');
  const cSlot = G(cCam);
  const cFg = G(gC);
  // pure: the definition card
  const cPure = swimPanel(cFg, 540, 210, '#FFE45C');
  T(cPure, 0, -42, 'PURE', { size: 54, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(cPure, 0, 10, 'ONE element or ONE compound', { size: 31, weight: 700, anchor: 'middle' });
  T(cPure, 0, 58, 'and nothing else mixed in', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // the juice explodes into a mixture
  const cJuice = G(cFg), cCarton = G(cJuice); swimCarton(cCarton);
  const ICON = [['water', 718, 440], ['sugar', 1090, 440], ['acids', 718, 590], ['bits', 1090, 590]].map(([k, x, y]) => {
    const g = G(cJuice);
    if (k === 'water') E('path', { d: 'M0,-34 Q24,-4 24,10 Q24,32 0,32 Q-24,32 -24,10 Q-24,-4 0,-34 Z', fill: C.water, stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    else if (k === 'sugar') { E('path', { d: 'M-22,-12 L-8,-26 L26,-26 L12,-12 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, g); E('path', { d: 'M12,-12 L26,-26 L26,8 L12,22 Z', fill: '#C9D3DC', stroke: '#9AA6B2', 'stroke-width': 3 }, g); E('rect', { x: -22, y: -12, width: 34, height: 34, fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 3 }, g); }
    else if (k === 'acids') { E('ellipse', { rx: 30, ry: 22, fill: ball('#FFF27A', '#D4B21E'), stroke: SC_INK, 'stroke-width': 3 }, g); E('path', { d: 'M-30,0 L30,0 M0,-22 L0,22', stroke: '#FFFFFF', 'stroke-width': 3 }, g); }
    else [[-14, -6, 14], [10, -10, 12], [2, 12, 13]].forEach(([dx, dy, r]) => E('ellipse', { cx: dx, cy: dy, rx: r, ry: r * 0.7, fill: '#FFB347', stroke: '#E07A1E', 'stroke-width': 3 }, g));
    T(g, 0, 70, k, { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    return { g, x, y };
  });
  const cMix = swimChip(cJuice, 'a delicious MIXTURE', { size: 32, color: '#FF8FC8', stroke: '#FF8FC8' });
  // dissolved: "disappeared" crossed out
  const cGoneW = G(cFg);
  const cGoneC = swimChip(cGoneW, 'DISAPPEARED', { size: 42, color: '#FFFFFF', stroke: C.bad });
  const cGoneS = strike(cGoneW, -cGoneC.w / 2 + 14, 0, cGoneC.w / 2 - 14, C.bad);
  // solubility card
  const cSol = swimPanel(cFg, 560, 230, '#FFE45C');
  T(cSol, 0, -50, 'SOLUBILITY', { size: 52, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(cSol, 0, 4, 'the MOST that can dissolve', { size: 32, weight: 700, anchor: 'middle' });
  T(cSol, 0, 52, 'in a fixed amount of solvent', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // stir: a teh-O with a spoon
  const cStirW = G(cFg), cTehO = ecTehO(cStirW, 1); swimIce(cStirW);
  const cSpoon = G(cStirW);
  E('path', { d: 'M0,0 L0,-190', stroke: '#B9C6D2', 'stroke-width': 9, 'stroke-linecap': 'round' }, cSpoon);
  E('ellipse', { cx: 0, cy: 6, rx: 14, ry: 9, fill: '#B9C6D2', stroke: '#6B7A88', 'stroke-width': 2 }, cSpoon);
  const cSwirl = E('path', { d: 'M-40,30 Q0,58 40,30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, cStirW);
  const cStirC = swimChip(cFg, 'stirring: it dissolves faster', { size: 28, color: '#FFFFFF' });

  /* =====================================================================
     SAL'S CONFESSIONAL: the postcard he dreams about
     ===================================================================== */
  const gCS = G(root), sCam = G(gCS);
  const sBg = ecConfessional(sCam, 'sal');
  const sSlot = G(sCam);
  const sCard = G(sCam);
  E('rect', { x: -110, y: -75, width: 220, height: 150, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, sCard);
  E('rect', { x: -98, y: -63, width: 196, height: 126, fill: linGrad('#5FB4EC', '#CDEEFF', true) }, sCard);
  E('path', { d: 'M-98,63 L-40,-30 L-8,10 L30,-46 L98,63 Z', fill: '#8FA3B8' }, sCard);
  E('path', { d: 'M-52,-10 L-40,-30 L-28,-12 Z M18,-28 L30,-46 L44,-24 Z', fill: '#FFFFFF' }, sCard);
  E('rect', { x: -98, y: 40, width: 196, height: 23, fill: '#FFFFFF' }, sCard);

  /* =====================================================================
     LAB: the big beaker (Sal vanishes; Sandy sinks)
     ===================================================================== */
  const gL = G(root), lCam = G(gL);
  ecLab(lCam);
  const lKav = G(lCam);
  E('rect', { x: -20, y: 560, width: 1240, height: 28, fill: '#1A2933' }, lCam);
  E('rect', { x: -20, y: 588, width: 1240, height: 170, fill: '#3A5A6A' }, lCam);
  const BK = [720, 390], SURF = 328;
  const lBeaker = beaker(lCam, 340, 340, { level: 0.72, liquid: '#9FD8FF', opacity: 0.7 }); tr(lBeaker, BK[0], BK[1]);
  const lIn = G(lCam);                       // things inside the water (Sandy, Sal's particles)
  const lNa = E('path', { d: '', fill: '#C9D3DC', stroke: '#6B7A88', 'stroke-width': 2 }, lIn);
  const lCl = E('path', { d: '', fill: '#B8E86A', stroke: '#5E8A22', 'stroke-width': 2 }, lIn);
  const lSandy = G(lIn);
  const lFly = G(lCam);                      // Sal in flight
  const splash = G(lCam);
  const ring = E('ellipse', { rx: 60, ry: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, splash);
  const drops = E('path', { d: '', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, splash);
  const splashSet = (t, t0) => {
    const f = (t - t0) / 0.8;
    if (f <= 0 || f >= 1) { op(splash, 0); return; }
    op(splash, 1);
    attr(ring, 'cx', BK[0]); attr(ring, 'cy', SURF); attr(ring, 'rx', 40 + 120 * f); attr(ring, 'ry', 8 + 20 * f); op(ring, 1 - f);
    const pts = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i / 9 - 0.5) * 2.2, v = 260 + (i % 3) * 70; pts.push([BK[0] + Math.cos(a) * v * f, SURF + Math.sin(a) * v * f + 520 * f * f, 8]); }
    attr(drops, 'd', swimCircles(pts)); op(drops, 1 - f);
  };
  const lQ = T(lCam, 480, 330, '?', { size: 96, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const lInsol = G(gL);   // outside the camera: stays put during the push-in
  swimChip(lInsol, 'INSOLUBLE', { size: 44, color: '#EED39A', stroke: '#EED39A' });
  T(lInsol, 0, 66, "doesn't dissolve", { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const ltSandy = scLowerThird(gL, ...EC_LOWER.sandy);

  /* =====================================================================
     CUTAWAYS: a plain "science" set with a bench, for graphs and glassware
     ===================================================================== */
  const gX = G(root), xCam = G(gX);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14324A', '#21506B', true) }, xCam);
  let gd = '';
  for (let x = 0; x <= 1200; x += 60) gd += `M${x},0 L${x},560 `;
  for (let y = 0; y <= 560; y += 60) gd += `M0,${y} L1200,${y} `;
  E('path', { d: gd, stroke: '#FFFFFF', 'stroke-width': 1.5, opacity: 0.05 }, xCam);
  E('rect', { x: -20, y: 560, width: 1240, height: 28, fill: '#1A2933' }, xCam);
  E('rect', { x: -20, y: 588, width: 1240, height: 170, fill: '#3A5A6A' }, xCam);

  /* ---- X1: the melting-point graph (melt, impurity) ---- */
  const xG = G(xCam);
  const gBeak = beaker(xG, 240, 230, { level: 0.55, liquid: '#BFE3F7', opacity: 0.6 }); tr(gBeak, 320, 445);
  const gIce = [[-60, 40, -8], [-6, 52, 6], [50, 38, 14], [-34, -4, 18], [28, -6, -10]].map(([x, y, a]) => {
    const c = G(xG); E('rect', { x: -24, y: -24, width: 48, height: 48, rx: 8, fill: '#E6F7FF', opacity: 0.85, stroke: '#FFFFFF', 'stroke-width': 3 }, c);
    return { c, x: 320 + x, y: 445 + y, a };
  });
  const gSal = G(xG);
  const gTherm = G(xG); tr(gTherm, 420, 0);
  E('rect', { x: -9, y: 270, width: 18, height: 270, rx: 9, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, gTherm);
  E('circle', { cx: 0, cy: 540, r: 17, fill: '#E8424F', stroke: '#9AA6B2', 'stroke-width': 3 }, gTherm);
  const gMerc = E('rect', { x: -4, y: 420, width: 8, height: 120, fill: '#E8424F' }, gTherm);
  const gRead = G(xG); tr(gRead, 470, 250);
  E('rect', { x: -78, y: -32, width: 156, height: 64, rx: 12, fill: '#0E1A24', stroke: '#FFFFFF', 'stroke-width': 3 }, gRead);
  const gReadT = T(gRead, 0, 14, '0 °C', { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  // the graph
  const GY = c => 380 - c * 11;
  const gPanel = G(xG);
  card(gPanel, 612, 130, 556, 425, { fill: 'rgba(10,27,39,0.9)', stroke: C.line, sw: 3, rx: 16 });
  T(gPanel, 905, 176, 'heating ice', { size: 32, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('path', { d: `M690,200 L690,512 L1135,512`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, gPanel);
  T(gPanel, 1130, 545, 'time →', { size: 26, weight: 700, anchor: 'end', fill: C.muted });
  T(gPanel, 676, 222, '°C', { size: 26, weight: 700, anchor: 'end', fill: C.muted });
  E('line', { x1: 690, y1: GY(0), x2: 1130, y2: GY(0), stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-dasharray': '8 8', opacity: 0.45 }, gPanel);
  T(gPanel, 680, GY(0) + 9, '0', { size: 28, weight: 800, anchor: 'end', fill: '#FFFFFF' });
  const PURE = [[700, GY(-10)], [820, GY(0)], [1000, GY(0)], [1110, GY(10)]];
  const IMP = [[700, GY(-11)], [790, GY(-5)], [1000, GY(-1)], [1110, GY(9)]];
  const pathOf = pts => 'M' + pts.map(p => p.join(',')).join(' L');
  const gPure = E('path', { d: pathOf(PURE), fill: 'none', stroke: '#9FD8FF', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, xG);
  const gFlat = E('line', { x1: 820, y1: GY(0), x2: 1000, y2: GY(0), stroke: '#FFE45C', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0.6 }, xG);
  const gSharp = swimChip(xG, 'sharp: exactly 0 °C', { size: 26, color: '#FFE45C', stroke: '#FFE45C' });
  const gImp = E('path', { d: pathOf(IMP), fill: 'none', stroke: '#FF8A3D', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, xG);
  const gBrk = G(xG);
  E('path', { d: `M1032,${GY(-1)} L1044,${GY(-1)} L1044,${GY(-5)} L1032,${GY(-5)}`, fill: 'none', stroke: '#FF8A3D', 'stroke-width': 4 }, gBrk);
  T(gBrk, 1052, GY(-3) + 10, 'RANGE', { size: 28, weight: 800, fill: '#FF8A3D' });
  const gMP = swimChip(xG, 'test purity: MELTING POINT', { size: 28, color: '#FFFFFF' });
  const gPureC = swimChip(xG, 'PURE: one sharp melting point', { size: 30, color: '#9FD8FF', stroke: '#9FD8FF' });
  const gImpC = swimChip(xG, 'IMPURITY', { size: 36, color: '#FF8A3D', stroke: '#FF8A3D' });
  const gDown = swimChip(xG, 'melting point ↓', { size: 28, color: '#9FD8FF', stroke: '#9FD8FF' });
  const gUp = swimChip(xG, 'boiling point ↑', { size: 28, color: '#FF8A3D', stroke: '#FF8A3D' });
  const gRange = swimChip(xG, 'both spread over a RANGE', { size: 28, color: '#FFFFFF' });
  const pAt = (pts, f) => {          // point and temperature a fraction f along a 4-point curve (by x)
    const x = lerp(pts[0][0], pts[3][0], clamp(f));
    for (let i = 0; i < 3; i++) if (x <= pts[i + 1][0]) { const q = (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0]); return [x, lerp(pts[i][1], pts[i + 1][1], q)]; }
    return pts[3];
  };

  /* ---- X2: the balance (mass) ---- */
  const xM = G(xCam);
  const mBeak = beaker(xM, 170, 190, { level: 0.6, liquid: '#9FD8FF', opacity: 0.75 }); tr(mBeak, 430, 395);
  const mBal = G(xM);
  E('rect', { x: 280, y: 490, width: 300, height: 70, rx: 12, fill: '#D6DEE6', stroke: '#6B7A88', 'stroke-width': 4 }, mBal);
  E('rect', { x: 310, y: 482, width: 240, height: 12, rx: 4, fill: '#9AA6B2' }, mBal);
  E('rect', { x: 360, y: 506, width: 140, height: 44, rx: 6, fill: '#0E2A1A', stroke: '#2C4856', 'stroke-width': 3 }, mBal);
  const mRead = T(mBal, 430, 541, '100 g', { size: 34, weight: 800, anchor: 'middle', fill: '#56D69B' });
  const mDish = G(xM);
  E('path', { d: 'M-50,0 Q-46,30 0,32 Q46,30 50,0 Z', fill: '#E3ECF5', stroke: '#6B7A88', 'stroke-width': 4 }, mDish);
  E('path', { d: 'M-34,0 Q0,-26 34,0 Z', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, mDish);
  const mGrains = E('path', { d: '', fill: '#FFFFFF' }, xM);
  const EQ = [['10 g', 700, 'salt', '#FFFFFF'], ['100 g', 890, 'water', '#9FD8FF'], ['110 g', 1085, 'solution', '#CDB2FF']].map(([s, x, lb, col]) => {
    const g = G(xM); tr(g, x, 205);
    swimChip(g, s, { size: 40, color: col, stroke: col });
    T(g, 0, 70, lb, { size: 28, weight: 700, anchor: 'middle', fill: col });
    return g;
  });
  const mPlus = T(xM, 793, 220, '+', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const mEq = T(xM, 988, 220, '=', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const mCons = swimChip(xM, 'Nothing destroyed: MASS IS CONSERVED', { size: 30, color: '#56D69B', stroke: '#56D69B' });
  const mSlot = G(xM);

  /* ---- X3: saturated ---- */
  const xT = G(xCam);
  const tBeak = beaker(xT, 260, 280, { level: 0.62, liquid: '#9FD8FF', opacity: 0.7 }); tr(tBeak, 560, 420);
  const tPile = E('path', { d: '', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, xT);
  const tDots = [], tr3 = rng(57), tDotP = E('path', { d: '', fill: '#FFFFFF', opacity: 0.85 }, xT);
  for (let i = 0; i < 18; i++) tDots.push({ x: 560 + (tr3() * 2 - 1) * 105, y: 400 + tr3() * 130, ph: tr3() * TAU, n: i % 3 });
  const tSpoon = G(xT);
  E('path', { d: 'M0,0 L150,-70', stroke: '#B9C6D2', 'stroke-width': 10, 'stroke-linecap': 'round' }, tSpoon);
  E('ellipse', { cx: 0, cy: 0, rx: 34, ry: 18, fill: '#B9C6D2', stroke: '#6B7A88', 'stroke-width': 3 }, tSpoon);
  const tLoad = E('path', { d: 'M-24,-6 Q0,-26 24,-6 Z', fill: '#FFFFFF' }, tSpoon);
  const tFall = [];
  for (let i = 0; i < 4; i++) tFall.push(E('rect', { x: -6, y: -6, width: 12, height: 12, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 1.5 }, xT));
  const tCount = swimChip(xT, 'spoonful 1', { size: 30, color: '#FFFFFF' });
  const tCard = swimPanel(xT, 400, 190, '#FFE45C');
  T(tCard, 0, -18, 'SATURATED', { size: 50, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(tCard, 0, 40, 'no more will dissolve', { size: 30, weight: 700, anchor: 'middle' });
  const tArrow = arrow(xT, 800, 380, 640, 520, { color: '#FFE45C', width: 6 });
  const SPOONS = [0.04, 0.19, 0.34, 0.5, 0.64];

  /* ---- X4: hot and cold (solubility rises with temperature) ---- */
  const xH = G(xCam);
  const hPlate = E('rect', { x: 720, y: 546, width: 240, height: 16, rx: 6, fill: '#FF6A2A', stroke: '#FFB03A', 'stroke-width': 3 }, xH);
  const hCold = beaker(xH, 220, 240, { level: 0.7, liquid: '#9FD8FF', opacity: 0.75 }); tr(hCold, 360, 428);
  const hHot = beaker(xH, 220, 240, { level: 0.7, liquid: '#FFB79A', opacity: 0.75 }); tr(hHot, 840, 426);
  const hPile = E('path', { d: 'M300,546 Q360,512 420,546 Z', fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 2 }, xH);
  const hDots = [], hr = rng(64), hDotP = E('path', { d: '', fill: '#FFFFFF', opacity: 0.9 }, xH);
  for (let i = 0; i < 26; i++) {
    const hot = i >= 6, cx = hot ? 840 : 360;
    hDots.push({ x: cx + (hr() * 2 - 1) * 80, y: 380 + hr() * 150, ph: hr() * TAU });
  }
  const hSteam = [0, 1, 2].map(i => E('path', { d: 'M0,0 Q-12,-20 0,-40 Q12,-60 0,-80', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round' }, xH));
  const hT1 = swimChip(xH, '20 °C', { size: 36, color: '#9FD8FF', stroke: '#9FD8FF' });
  const hT2 = swimChip(xH, '80 °C', { size: 36, color: '#FF8A3D', stroke: '#FF8A3D' });
  const hTop = swimChip(xH, 'SOLUBILITY usually RISES with temperature', { size: 30, color: '#FFE45C', stroke: '#FFE45C' });
  const hL1 = T(xH, 360, 650, 'less dissolves', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  const hL2 = T(xH, 840, 650, 'MORE dissolves', { size: 30, weight: 800, anchor: 'middle', fill: '#FF8A3D' });

  /* ---- X5: concentration ---- */
  const xC = G(xCam);
  const ccCard = swimPanel(xC, 640, 130, '#FFE45C'); tr(ccCard, 600, 186);
  T(ccCard, 0, -10, 'CONCENTRATION', { size: 46, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  T(ccCard, 0, 40, 'how much solute is in a given volume', { size: 28, weight: 700, anchor: 'middle' });
  const ccA = swimGlass(xC, 4, 21); tr(ccA, 360, 432);
  const ccB = swimGlass(xC, 22, 33); tr(ccB, 840, 432);
  const ccVol = G(xC);
  E('path', { d: 'M440,352 L760,352', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, ccVol);
  T(ccVol, 600, 336, 'same volume', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const ccL1 = T(xC, 360, 650, 'few: DILUTE', { size: 34, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  const ccL2 = T(xC, 840, 650, 'many: CONCENTRATED', { size: 34, weight: 800, anchor: 'middle', fill: '#FF8A3D' });

  /* =====================================================================
     ROADS: a gritting truck in a cold country
     ===================================================================== */
  const gR = G(root), rCam = G(gR);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2B4A78', '#9CC0E6', true) }, rCam);
  E('path', { d: 'M-20,470 L220,250 L420,470 Z M300,470 L560,200 L820,470 Z M700,470 L960,260 L1220,470 Z', fill: '#8FA3B8' }, rCam);
  E('path', { d: 'M180,287 L220,250 L262,288 Q220,300 180,287 Z M508,254 L560,200 L612,254 Q560,268 508,254 Z M914,298 L960,260 L1006,298 Q960,310 914,298 Z', fill: '#FFFFFF' }, rCam);
  E('rect', { x: -20, y: 460, width: 1240, height: 300, fill: '#F2F7FA' }, rCam);
  E('rect', { x: -20, y: 530, width: 1240, height: 120, fill: '#5D6B78' }, rCam);
  const rIce = [];
  for (let i = 0; i < 7; i++) rIce.push(E('ellipse', { cx: 90 + i * 170, cy: 590 + (i % 2) * 18, rx: 70, ry: 16, fill: '#D6F1FF', opacity: 0.9 }, rCam));
  const rSnow = [], rs = rng(5), rSnowP = E('path', { d: '', fill: '#FFFFFF', opacity: 0.85 }, rCam);
  for (let i = 0; i < 20; i++) rSnow.push({ r: Math.round(3 + rs() * 3), x: rs() * 1200, v: 30 + rs() * 40, ph: rs() * TAU });
  const rTruck = G(rCam);
  E('rect', { x: -130, y: -70, width: 150, height: 80, rx: 6, fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 4 }, rTruck);   // hopper
  E('path', { d: 'M20,-90 L80,-90 L104,-46 L104,10 L20,10 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, rTruck);   // cab
  E('path', { d: 'M34,-80 L74,-80 L92,-48 L34,-48 Z', fill: '#9FD8FF', stroke: SC_INK, 'stroke-width': 3 }, rTruck);
  [-90, 60].forEach(x => E('circle', { cx: x, cy: 14, r: 22, fill: '#2A2F36', stroke: '#9AA6B2', 'stroke-width': 5 }, rTruck));
  E('rect', { x: -146, y: -4, width: 22, height: 14, fill: '#6B7A88' }, rTruck);   // spinner
  const rSalSlot = G(rTruck);
  const rGrit = E('path', { d: '', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 1 }, rCam);
  const rChip = G(rCam); tr(rChip, 850, 190);
  swimChip(rChip, 'salt melts the ice', { size: 36, color: '#FFFFFF', stroke: '#FFFFFF' });
  T(rChip, 0, 66, '(it lowers the melting point)', { size: 28, weight: 700, anchor: 'middle', fill: '#0E2230' });

  /* =====================================================================
     ZOOM: inside the water
     ===================================================================== */
  const gZ = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1E2C', '#163A50', true) }, gZ);
  const ZC = [600, 400], ZR = 232;
  const zClip = E('clipPath', { id: 'swimZoomClip' }, defs()); E('circle', { cx: ZC[0], cy: ZC[1], r: ZR }, zClip);
  E('circle', { cx: ZC[0], cy: ZC[1], r: ZR, fill: '#D6F1FF' }, gZ);
  const zIn = G(gZ, { 'clip-path': 'url(#swimZoomClip)' });
  const zWater = [], zWaterP = E('path', { d: '', fill: '#7FD8F7', stroke: '#1D84A6', 'stroke-width': 2.5 }, zIn);
  for (let i = 0; i < 46; i++) {
    const rr = 218 * Math.sqrt((i + 0.5) / 46), a = i * 2.39996 + 1.1;
    zWater.push({ x: ZC[0] + Math.cos(a) * rr, y: ZC[1] + Math.sin(a) * rr, ph: i * 0.77 });
  }
  const zIons = [];
  const zIonG = G(zIn);
  const zNaP = E('path', { d: '', fill: '#E3E9EF', stroke: '#56636F', 'stroke-width': 2.5 }, zIonG);
  const zClP = E('path', { d: '', fill: '#C9EE73', stroke: '#5E8A22', 'stroke-width': 2.5 }, zIonG);
  for (let i = 0; i < 16; i++) {
    const r0 = Math.floor(i / 4), c0 = i % 4, na = (r0 + c0) % 2 === 0;
    const rr = 196 * Math.sqrt((i + 0.5) / 16), a = i * 2.39996 + 2.4;
    zIons.push({ na, lx: ZC[0] + (c0 - 1.5) * 30, ly: ZC[1] + (r0 - 1.5) * 30, x: ZC[0] + Math.cos(a) * rr, y: ZC[1] + Math.sin(a) * rr, ph: i * 1.31, d: ((i * 7) % 16) * 0.06 });
  }
  const zSalSlot = G(zIn);
  const zRing = E('circle', { cx: ZC[0], cy: ZC[1], r: ZR, fill: 'none', stroke: '#E9F7FF', 'stroke-width': 10 }, gZ);
  const zGlow = E('circle', { cx: ZC[0], cy: ZC[1], r: ZR + 12, fill: 'none', stroke: '#CDB2FF', 'stroke-width': 10 }, gZ);
  const zDis = swimChip(gZ, 'DISSOLVED', { size: 46, color: '#FFE45C', stroke: '#FFE45C' });
  const zSolute = G(gZ);
  T(zSolute, 190, 300, 'SOLUTE', { size: 44, weight: 800, anchor: 'middle', fill: '#DDF68E' });
  T(zSolute, 190, 344, 'what dissolves', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(zSolute, 190, 382, '(the salt)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const zSoluteL = E('line', { x1: 270, y1: 320, x2: 400, y2: 400, stroke: '#DDF68E', 'stroke-width': 4 }, zSolute);
  const zSoluteD = E('circle', { r: 7, fill: '#DDF68E' }, zSolute);
  const zSolvent = G(gZ);
  T(zSolvent, 1010, 380, 'SOLVENT', { size: 44, weight: 800, anchor: 'middle', fill: '#7FD8F7' });
  T(zSolvent, 1010, 424, "the liquid it's in", { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(zSolvent, 1010, 462, '(the water)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const zSolventL = E('line', { x1: 920, y1: 400, x2: 800, y2: 400, stroke: '#7FD8F7', 'stroke-width': 4 }, zSolvent);
  const zSolventD = E('circle', { r: 7, fill: '#7FD8F7' }, zSolvent);
  const zSolution = G(gZ);
  T(zSolution, 600, 696, 'together: a SOLUTION', { size: 40, weight: 800, anchor: 'middle', fill: '#CDB2FF' });

  /* =====================================================================
     cut list: [start, shot, setup]
     ===================================================================== */
  const CUTS = [
    [-1, 'K', 'carton'],
    [at('pure') - 0.08, 'C', 'pure'],
    [at('melt') - 0.08, 'X', 'graph'],
    [at('roads') - 0.08, 'R', ''],
    [at('hot') - 0.08, 'K', 'hot'],
    [end('hot') + 0.05, 'CS', ''],
    [at('gone') - 0.36, 'L', 'gone'],
    [at('dissolved') - 0.08, 'C', 'gone'],
    [mid('dissolved', 0.5), 'Z', ''],
    [at('mass') - 0.08, 'X', 'mass'],
    [at('sandy') - 0.3, 'L', 'sandy'],
    [at('saturated') - 0.08, 'X', 'sat'],
    [at('solubility') - 0.08, 'C', 'sol'],
    [mid('solubility', 0.52), 'X', 'hot'],
    [at('peng') - 0.08, 'K', 'peng'],
    [at('stir') - 0.08, 'C', 'stir'],
    [at('conc') - 0.08, 'X', 'conc'],
    [at('siewdai') - 0.08, 'K', 'siew'],
    [end('siewdai') + 0.05, 'C', 'proud'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const SHOTS = { K: gK, C: gC, CS: gCS, L: gL, X: gX, R: gR, Z: gZ };

  return t => {
    const [c0, shot, setup] = cutAt(t);
    for (const k in SHOTS) op(SHOTS[k], k === shot ? 1 : 0);
    CAST.forEach(ch => op(ch, 0));

    /* ---------------- KITCHEN ---------------- */
    if (shot === 'K') {
      kit.upd(t);
      [kSun, kCarton, kFan, kHot, kTeh, kSugar, kSugarA, kSlip, kGlassW, kDil].forEach(e => op(e, 0));
      swimSeat(KAVYA, kSlot);
      let mood = 'neutral', look = 0, sweat = 0, kx = 800;
      if (setup === 'carton') {
        const f = (t - at('carton')) / (end('carton') - at('carton'));
        mood = f < 0.6 ? 'happy' : 'smug'; look = f < 0.55 ? -0.7 : 0;
        op(kCarton, 1);
        tr(kCarton, 560, 400 - 10 * P(t, at('carton'), 0.5, pop) + Math.sin(t * 2) * 3 * AMP, 1, -8 + 4 * Math.sin(t * 1.3) * AMP);
        swimCam(kCam, 1 + 0.05 * P(t, 0, at('pure'), linear), 680, 420);
      } else if (setup === 'hot') {
        const f = (t - at('hot')) / (end('hot') - at('hot'));
        mood = f < 0.45 ? 'annoyed' : 'deadpan'; look = f < 0.5 ? 0 : 0.6; sweat = 1; kx = 760;
        op(kSun, 1); tr(kSun, 1010, 160, 1 + 0.06 * Math.sin(t * 3) * AMP);
        swimPop(kHot, P(t, mid('hot', 0.55), 0.4, pop), 1030, 300);
        op(kFan, 1); tr(kFan, 600, 520, 1, -10 + 22 * Math.sin(t * 9) * AMP);
        swimCam(kCam, 1.04, 760, 400);
      } else if (setup === 'peng') {
        mood = t < mid('peng', 0.25) ? 'shock' : 'happy'; look = -0.7;
        op(kTeh, 1); tr(kTeh, 430, 470, 1.25);
        swimPop(kSugar, P(t, mid('peng', 0.55), 0.4, pop), 200, 680);
        op(kSugarA, P(t, mid('peng', 0.6), 0.2, linear)); kSugarA.set(P(t, mid('peng', 0.6), 0.4));
        swimCam(kCam, 1, 600, 375);
      } else {   // siew
        mood = t < mid('siewdai', 0.6) ? 'neutral' : 'smug'; look = t < mid('siewdai', 0.7) ? -0.6 : 0;
        swimPop(kSlip, P(t, at('siewdai') + 0.1, 0.45, pop), 300, 300, 1, -4);
        op(kGlassW, 1); tr(kGlassW, 540, 470, 0.72); kGlass.upd(t);
        op(kGlow, P(t, mid('siewdai', 0.6), 0.3, linear) * (0.75 + 0.25 * Math.sin(t * 5)));
        swimPop(kDil, P(t, mid('siewdai', 0.65), 0.4, pop), 540, 672);
        swimCam(kCam, 1 + 0.04 * P(t, at('siewdai'), 3.5, linear), 600, 420);
      }
      tr(KAVYA, kx, 505, 1.25);
      KAVYA.set({ t, talk: talk(t, 'kavya'), mood, look, sweat });
    }

    /* ---------------- ARTHUR'S CONFESSIONAL ---------------- */
    if (shot === 'C') {
      cBg.set(1, t);
      [cPure, cJuice, cGoneW, cSol, cStirW, cStirC].forEach(e => op(e, 0));
      swimSeat(ARTHUR, cSlot);
      let mood = 'deadpan', look = 0, k = 1;
      if (setup === 'pure') {
        const f = (t - at('pure')) / (end('pure') - at('pure'));
        look = f < 0.45 ? 0.6 : 0;
        if (f > 0.62 && f < 0.82) mood = 'smug';
        const pp = P(t, mid('pure', 0.05), 0.45, pop) * (1 - P(t, mid('pure', 0.55), 0.25, linear));
        swimPop(cPure, pp, 900, 300);
        if (t > mid('pure', 0.5)) {
          op(cJuice, 1);
          const ep = P(t, mid('pure', 0.62), 0.6, easeOut);
          op(cCarton, 1); tr(cCarton, 900, 470 + 20 * ep, 0.62 * (1 - 0.15 * ep), 6 * Math.sin(ep * 20) * (1 - ep));
          ICON.forEach((ic, i) => {
            const q = P(t, mid('pure', 0.62) + i * 0.08, 0.5, easeOut);
            op(ic.g, clamp(q * 3)); tr(ic.g, lerp(900, ic.x, q), lerp(460, ic.y, q), Math.max(0.01, 0.4 + 0.6 * q), (1 - q) * 120);
          });
          swimPop(cMix, P(t, mid('pure', 0.82), 0.45, pop), 0, 0);
          tr(cMix, 900, 300, Math.max(0.01, 0.6 + 0.4 * P(t, mid('pure', 0.82), 0.45, pop)), -4);
        }
        k = 1 + 0.12 * P(t, end('pure'), at('melt') - end('pure'), easeOut);
      } else if (setup === 'gone') {
        look = 0;
        const gp = P(t, at('dissolved') + 0.15, 0.4, pop);
        swimPop(cGoneW, gp, 860, 300);
        cGoneS.set(P(t, mid('dissolved', 0.3), 0.3));
        k = 1.05;
      } else if (setup === 'sol') {
        look = 0.6;
        swimPop(cSol, P(t, at('solubility') + 0.2, 0.45, pop), 880, 330);
        k = 1 + 0.03 * P(t, at('solubility'), 4, linear);
      } else if (setup === 'stir') {
        const f = (t - at('stir')) / (end('stir') - at('stir'));
        look = f < 0.4 ? 0.6 : 0;
        op(cStirW, 1); tr(cStirW, 900, 440, 1.25);
        const sp = P(t, mid('stir', 0.45), 2.2, linear);
        const ang = (t - mid('stir', 0.45)) * 9 * (sp > 0 ? 1 : 0);
        tr(cSpoon, 34 * Math.sin(ang), 58 + 6 * Math.cos(ang), 1, 8 * Math.sin(ang));
        cTehO.set(lerp(1, 0.3, sp));
        op(cSwirl, sp > 0 ? 0.7 : 0); tr(cSwirl, 0, 0, 1, Math.sin(ang * 0.5) * 6);
        swimPop(cStirC, P(t, mid('stir', 0.55), 0.4, pop), 900, 180);
        k = 1 + 0.16 * P(t, end('stir'), at('conc') - end('stir') + 0.2, easeOut);
      } else {   // proud: a tiny smile, then back to deadpan
        mood = t < c0 + 0.65 ? 'happy' : 'deadpan';
        k = 1.08 + 0.14 * P(t, c0 + 0.6, 1.5, easeOut);
      }
      swimCam(cCam, k, 420, 400);
      tr(ARTHUR, 420, 400, 1.45);
      ARTHUR.set({ t, talk: talk(t, 'arthur'), mood, look });
    }

    /* ---------------- SAL'S CONFESSIONAL ---------------- */
    if (shot === 'CS') {
      sBg.set(1, t);
      swimSeat(SAL, sSlot);
      tr(SAL, 400, 400, 1.45);
      SAL.set({ t, mood: 'sad', look: 0.8 });
      tr(sCard, 720, 470 + Math.sin(t * 2) * 3 * AMP, 1, -7);
      swimCam(sCam, 1.04 + 0.08 * P(t, c0, 0.7, linear), 500, 420);
    }

    /* ---------------- LAB ---------------- */
    if (shot === 'L') {
      op(lQ, 0); op(lInsol, 0); op(lSandy, 0); op(lFly, 0); op(lIn, 0);
      if (setup === 'gone') {
        swimSeat(KAVYA, lKav);
        const hit = at('gone') - 0.06;
        // Sal cannonballs in from the top right
        if (t < hit) {
          op(lFly, 1); swimSeat(SAL, lFly);
          const f = clamp((t - c0) / (hit - c0));
          tr(SAL, lerp(1080, BK[0], f), lerp(130, SURF + 10, f) - 120 * Math.sin(f * Math.PI), 0.42, 300 * f);
          SAL.set({ t, mood: 'happy' });
        }
        splashSet(t, hit);
        const qp = P(t, hit + 0.5, 0.4, pop);
        op(lQ, clamp(qp * 2)); tr(lQ, 0, Math.sin(t * 3) * 6 * AMP);
        tr(KAVYA, 290, 480, 1.2);
        KAVYA.set({ t, talk: talk(t, 'kavya'), mood: t < hit ? 'neutral' : 'shock', look: 0.8 });
        swimCam(lCam, 1 + 0.06 * P(t, hit, 1.8, easeOut), 600, 400);
      } else {   // sandy
        op(lIn, 1); op(lSandy, 1);
        swimSeat(SANDY, lSandy);
        const tp = at('sandy') - 0.25;
        splashSet(t, tp + 0.18);
        const sk = P(t, tp + 0.18, 1.8, easeOut);
        const sy = t < tp + 0.18 ? lerp(-80, SURF - 20, clamp((t - c0) / (tp + 0.18 - c0))) : lerp(SURF + 10, 505, sk);
        tr(SANDY, BK[0] + Math.sin(t * 2) * 4 * AMP * sk, sy, 0.5, 8 * Math.sin(t * 1.5) * (1 - sk));
        const fs = (t - at('sandy')) / (end('sandy') - at('sandy'));
        SANDY.set({ t, talk: talk(t, 'sandy'), mood: 'sad', look: fs > 0.55 && fs < 0.85 ? -0.6 : 0, still: sk >= 1 });
        // Sal's particles go for a swim around her
        const na = [], cl = [];
        for (let i = 0; i < 14; i++) {
          const a = t * (0.6 + (i % 4) * 0.12) * (S.reduce ? 0.4 : 1) + i * 0.9, rx = 70 + (i % 5) * 22, ry = 30 + (i % 3) * 30;
          (i % 2 ? cl : na).push([BK[0] + Math.cos(a) * rx, 430 + Math.sin(a * 1.3) * ry * 0.8 - (i % 2) * 30, i % 2 ? 9 : 7]);
        }
        attr(lNa, 'd', swimCircles(na)); attr(lCl, 'd', swimCircles(cl));
        swimPop(lInsol, P(t, mid('sandy', 0.3), 0.45, pop), 1035, 250);
        ltSandy.set(win(t, at('sandy') + 0.2, at('sandy') + 3.6, 0.3));
        const pi = P(t, mid('sandy', 0.7), at('saturated') - mid('sandy', 0.7), easeOut);
        swimCam(lCam, 1 + 0.14 * pi, BK[0], 480);
      }
      if (setup === 'gone') ltSandy.set(0);
    }

    /* ---------------- CUTAWAYS ---------------- */
    if (shot === 'X') {
      [xG, xM, xT, xH, xC].forEach(e => op(e, 0));
      swimCam(xCam, 1, 600, 375);
      if (setup === 'graph') {
        op(xG, 1);
        const imp = t >= at('impurity') - 0.1;
        // the pure curve draws during "melt"; the impure one during "impurity"
        const pp = P(t, mid('melt', 0.12), (mid('melt', 0.9) - mid('melt', 0.12)), linear);
        const ip = P(t, mid('impurity', 0.22), (mid('impurity', 0.8) - mid('impurity', 0.22)), linear);
        attr(gPure, 'stroke-dashoffset', (1 - pp).toFixed(4)); op(gPure, imp ? 0.35 : 1);
        attr(gImp, 'stroke-dashoffset', (1 - ip).toFixed(4)); op(gImp, ip > 0 ? 1 : 0);
        op(gFlat, P(t, mid('melt', 0.7), 0.3, linear) * (imp ? 0.2 : 0.55 + 0.25 * Math.sin(t * 4)));
        swimPop(gSharp, P(t, mid('melt', 0.75), 0.4, pop) * (imp ? 0 : 1), 910, 330);
        op(gBrk, P(t, mid('impurity', 0.82), 0.4, linear));
        // the thermometer follows whichever curve is drawing
        const MELT = 300 / 410;   // the reading stops where melting ends: it shows the melting temperature
        const [, yy] = imp ? pAt(IMP, Math.min(ip, MELT)) : pAt(PURE, Math.min(pp, MELT));
        const temp = Math.round((380 - yy) / 11);
        setText(gReadT, (temp < 0 ? '−' : '') + Math.abs(temp) + ' °C');
        attr(gMerc, 'y', 440 - temp * 6); attr(gMerc, 'height', 100 + temp * 6);
        const icS = imp ? lerp(1, 0.78, P(t, mid('impurity', 0.3), 3, linear)) : 1;
        gIce.forEach(({ c, x, y, a }, i) => tr(c, x + Math.sin(t * 1.2 + i) * 2 * AMP, y + Math.cos(t + i) * 2 * AMP, icS, a));
        // Sal jumps in
        if (imp) {
          swimSeat(SAL, gSal);
          const jp = P(t, at('impurity') - 0.1, 0.7, easeOut);
          tr(SAL, lerp(580, 320, jp), lerp(240, 452, jp) - 110 * Math.sin(jp * Math.PI), 0.5);
          SAL.set({ t, talk: talk(t, 'sal'), mood: t < mid('impurity', 0.6) ? 'happy' : 'smug', look: -0.2 });
        }
        swimPop(gMP, P(t, mid('melt', 0.08), 0.4, pop) * (imp ? 0 : 1), 330, 650);
        swimPop(gPureC, P(t, mid('melt', 0.5), 0.4, pop) * (imp ? 0 : 1), 890, 630);
        swimPop(gImpC, P(t, at('impurity') + 0.5, 0.4, pop), 330, 650);
        swimPop(gDown, P(t, mid('impurity', 0.35), 0.4, pop), 755, 606);
        swimPop(gUp, P(t, mid('impurity', 0.55), 0.4, pop), 1035, 606);
        swimPop(gRange, P(t, mid('impurity', 0.8), 0.4, pop), 895, 672);
        swimCam(xCam, 1 + 0.03 * P(t, c0, 17, linear), 600, 400);
      } else if (setup === 'mass') {
        op(xM, 1);
        const ep = [mid('mass', 0.04), mid('mass', 0.22), mid('mass', 0.5)];
        EQ.forEach((g, i) => swimPop(g, P(t, ep[i], 0.4, pop), [700, 890, 1085][i], 205));
        op(mPlus, P(t, ep[1] - 0.1, 0.3, linear)); op(mEq, P(t, ep[2] - 0.1, 0.3, linear));
        // the salt is tipped in; the reading climbs to 110 g
        const tip = P(t, mid('mass', 0.1), 0.5, ease) * (1 - P(t, mid('mass', 0.55), 0.5, ease));
        tr(mDish, 570, 290, 1, -55 * tip);
        const pourP = P(t, mid('mass', 0.18), mid('mass', 0.5) - mid('mass', 0.18), linear);
        const gp = [];
        for (let i = 0; i < 8; i++) { const f = ((t * 1.6 + i / 8) % 1); gp.push([498 - 50 * f + (i % 3) * 6, 290 + 50 * f + 80 * f * f, 8]); }
        attr(mGrains, 'd', swimSquares(gp)); op(mGrains, pourP > 0 && pourP < 1 ? 1 : 0);
        setText(mRead, Math.round(100 + 10 * pourP) + ' g');
        swimPop(mCons, P(t, mid('mass', 0.8), 0.45, pop), 760, 652);
        swimSeat(ARTHUR, mSlot); tr(ARTHUR, 1070, 470, 0.6);
        ARTHUR.set({ t, talk: talk(t, 'arthur'), mood: 'deadpan', look: -0.6 });
      } else if (setup === 'sat') {
        op(xT, 1);
        let n = 0, pile = 0;
        SPOONS.forEach((f, i) => { const tt = mid('saturated', f); if (t >= tt) n = i + 1; if (i >= 3) pile += P(t, tt + 0.9, 0.5, easeOut); });
        // the spoon tips at each spoonful
        let tip = 0, cur = -1;
        SPOONS.forEach((f, i) => { const tt = mid('saturated', f); const q = P(t, tt - 0.2, 0.25, ease) * (1 - P(t, tt + 0.35, 0.25, ease)); if (q > tip) { tip = q; cur = i; } });
        tr(tSpoon, 640, 220 + 10 * tip, 1, 50 * tip);
        op(tLoad, tip > 0.5 ? 0 : 1);
        // falling crystals for the latest spoonful
        const last = n - 1, tt = last >= 0 ? mid('saturated', SPOONS[last]) : 1e9;
        tFall.forEach((el, i) => {
          const q = (t - tt - i * 0.06) / 0.9;
          if (q <= 0 || q >= 1.3) { op(el, 0); return; }
          const y = q < 0.45 ? lerp(232, 384, q / 0.45) : lerp(384, 538, (q - 0.45) / 0.55);
          const dissolve = last < 3;
          op(el, dissolve ? clamp(1.6 - q * 1.6) : (q < 1 ? 1 : 0));
          tr(el, 600 + (i - 1.5) * 14, Math.min(y, 538), 1, q * 200);
        });
        const ph = 26 * pile / 2;
        attr(tPile, 'd', pile > 0.02 ? `M${520 - 30 * pile},556 Q560,${556 - ph * 2} ${600 + 30 * pile},556 Z` : '');
        attr(tDotP, 'd', swimCircles(tDots.filter(d => n > d.n).map(d => [d.x + Math.sin(t + d.ph) * 4 * AMP, d.y + Math.cos(t * 0.8 + d.ph) * 4 * AMP, 5])));
        setText(tCount.label, 'spoonful ' + Math.max(1, n));
        op(tCount, n > 0 ? 1 : 0); tr(tCount, 250, 430);
        swimPop(tCard, P(t, mid('saturated', 0.78), 0.45, pop), 950, 290);
        op(tArrow, P(t, mid('saturated', 0.82), 0.2, linear)); tArrow.set(P(t, mid('saturated', 0.82), 0.4));
      } else if (setup === 'hot') {
        op(xH, 1);
        op(hPlate, 0.8 + 0.2 * Math.sin(t * 4));
        hSteam.forEach((s, i) => { const f = ((t * 0.5 + i / 3) % 1); tr(s, 800 + i * 40, 300 - f * 50); op(s, 0.6 * Math.sin(f * Math.PI)); });
        attr(hDotP, 'd', swimCircles(hDots.map(d => [d.x + Math.sin(t * 1.4 + d.ph) * 5 * AMP, d.y + Math.cos(t * 1.2 + d.ph) * 5 * AMP, 6])));
        swimPop(hT1, P(t, c0 + 0.1, 0.4, pop), 360, 255);
        swimPop(hT2, P(t, c0 + 0.25, 0.4, pop), 840, 255);
        swimPop(hTop, P(t, mid('solubility', 0.75), 0.45, pop), 600, 160);
        op(hL1, P(t, c0 + 0.6, 0.3, linear)); op(hL2, P(t, c0 + 0.8, 0.3, linear));
      } else {   // conc
        op(xC, 1);
        ccA.upd(t); ccB.upd(t);
        swimPop(ccCard, P(t, at('conc') + 0.1, 0.45, pop), 600, 186);
        op(ccVol, P(t, mid('conc', 0.35), 0.3, linear));
        op(ccL1, P(t, mid('conc', 0.62), 0.3, linear)); op(ccL2, P(t, mid('conc', 0.8), 0.3, linear));
        swimPop(ccA, P(t, mid('conc', 0.3), 0.45, pop), 360, 432);
        swimPop(ccB, P(t, mid('conc', 0.36), 0.45, pop), 840, 432);
      }
    }

    /* ---------------- ROADS ---------------- */
    if (shot === 'R') {
      const f = clamp((t - c0) / (at('hot') - 0.08 - c0));
      const tx = lerp(-60, 860, f);
      tr(rTruck, tx, 560 + Math.abs(Math.sin(t * 9)) * 2 * AMP);
      rIce.forEach((el, i) => { const x = 90 + i * 170; op(el, x < tx - 160 ? 0.9 * (1 - clamp((tx - 160 - x) / 160)) + 0.15 : 0.9); attr(el, 'fill', x < tx - 160 ? '#7B8996' : '#D6F1FF'); });
      const gr = [];
      for (let i = 0; i < 12; i++) { const q = ((t * 2.2 + i / 12) % 1); gr.push([tx - 140 - q * 140, 566 + q * 50 + Math.sin(i * 2.1) * 12, 8 * (1 - q * 0.5)]); }
      attr(rGrit, 'd', swimSquares(gr));
      attr(rSnowP, 'd', swimCircles(rSnow.map(s => [(s.x + Math.sin(t + s.ph) * 20) % 1200, ((t * s.v + s.ph * 100) % 760) - 10, s.r])));
      swimSeat(SAL, rSalSlot); tr(SAL, -56, -110, 0.42);
      SAL.set({ t, talk: talk(t, 'sal'), mood: 'happy', look: 0.4 });
      swimPop(rChip, P(t, mid('roads', 0.35), 0.45, pop), 850, 190);
    }

    /* ---------------- ZOOM ---------------- */
    if (shot === 'Z') {
      const tb = c0 + 0.35;
      // Sal fades into his own lattice, which then breaks up among the water particles
      const salF = 1 - P(t, c0 + 0.05, 0.35, linear);
      if (salF > 0) { swimSeat(SAL, zSalSlot); op(SAL, salF); tr(SAL, ZC[0] - 12, ZC[1], 0.62); SAL.set({ t, mood: 'happy' }); }
      const wPos = zWater.map(w => [w.x + Math.sin(t * 1.7 + w.ph) * 6 * AMP, w.y + Math.cos(t * 1.4 + w.ph) * 6 * AMP, 15]);
      attr(zWaterP, 'd', swimCircles(wPos));
      const iPos = zIons.map(io => {
        const q = P(t, tb + io.d, 1.5, easeOut);
        return [lerp(io.lx, io.x, q) + Math.sin(t * 1.9 + io.ph) * 6 * q * AMP, lerp(io.ly, io.y, q) + Math.cos(t * 1.6 + io.ph) * 6 * q * AMP, io.na ? 10 : 14];
      });
      attr(zNaP, 'd', swimCircles(iPos.filter((p, i) => zIons[i].na))); attr(zClP, 'd', swimCircles(iPos.filter((p, i) => !zIons[i].na)));
      op(zIonG, P(t, c0, 0.3, linear));
      swimPop(zDis, P(t, c0 + 0.1, 0.45, pop), 1015, 190);
      // words: solute, solvent, solution
      const s1 = P(t, mid('words', 0.05), 0.4, linear), s2 = P(t, mid('words', 0.42), 0.4, linear), s3 = P(t, mid('words', 0.78), 0.4, linear);
      op(zSolute, s1); op(zSolvent, s2); op(zSolution, s3);
      const [ix, iy] = iPos[11], [wx, wy] = wPos[44];
      attr(zSoluteL, 'x2', ix); attr(zSoluteL, 'y2', iy); attr(zSoluteD, 'cx', ix); attr(zSoluteD, 'cy', iy);
      attr(zSolventL, 'x2', wx); attr(zSolventL, 'y2', wy); attr(zSolventD, 'cx', wx); attr(zSolventD, 'cy', wy);
      op(zGlow, s3 * (0.6 + 0.4 * Math.sin(t * 4)));
      op(zRing, 1);
    }
  };
});

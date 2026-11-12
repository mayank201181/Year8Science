/* Scene 5: Not on the list.
   Shots: the school hall, 6 p.m., Kavya as Tree Number Three (no lines) -> the red prop apple: seven colours in,
   only red bounces out to your eye, the rest absorbed -> Ray: it doesn't glow, it doesn't turn light red ->
   white ball reflects all, black ball absorbs all -> Rosie slides into the left lantern's gel holder (the cone
   turns red, the cardboard tree under it goes black), drops to camera height, checks the list -> the club line:
   Red walks through, Green and Blue bump into her and vanish -> FILTER: transmits its own colour, absorbs the
   others, "a filter is selfish" -> Rosie's confessional: "exclusive", velvet rope -> Rosie's lantern swings
   onto Kavya: her leaves go black -> Kavya annoyed -> Rosie: "Green? Not on the list." (hold) -> red, green and
   blue spotlights -> additive mixing, one sum at a time -> Ray in the white centre: "Hi again." ->
   phone pixels: yellow is red + green -> paints absorb: blue + yellow paint goes muddy. */
scene('filter', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed filter) ---------- */
  function filterChip(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  // a line of text in several colours: parts = [[text, colour, weight?], ...]
  function filterRich(parent, x, y, parts, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 40, 'font-weight': 700, fill: C.ink, 'text-anchor': o.anchor || 'start', 'font-family': FD }, parent);
    parts.forEach(([s, c, w]) => { const sp = E('tspan', { fill: c || C.ink }, t); if (w) sp.setAttribute('font-weight', w); sp.textContent = s; });
    return t;
  }
  // camera on the world group: scale k about (cx, cy), kept inside the stage
  function filterCam(el, cx, cy, k) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    el.setAttribute('transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  // a small dark "absorbed" puff: g.set(p) (0 hidden .. 1 gone)
  function filterPuff(parent, col) {
    const g = G(parent);
    const ring = E('circle', { r: 10, fill: 'none', stroke: col || '#FFFFFF', 'stroke-width': 4 }, g);
    const dot = E('circle', { r: 7, fill: '#141018', stroke: col || '#FFFFFF', 'stroke-width': 2.5 }, g);
    g.set = p => { op(g, p > 0.001 ? 1 : 0); attr(ring, 'r', 8 + 20 * p); op(ring, 1 - p); op(dot, p > 0 ? 1 : 0); };
    g.set(0);
    return g;
  }
  // a rubber stamp
  function filterStamp(parent, text, col) {
    const g = G(parent), size = 46, w = textWidth(text, size, FD, 800) + 60, h = 82;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(24,8,12,0.9)', stroke: col, 'stroke-width': 6 }, g);
    E('rect', { x: -w / 2 + 9, y: -h / 2 + 9, width: w - 18, height: h - 18, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, 16, text, { size, weight: 800, anchor: 'middle', fill: col });
    g.set = (p, x, y, r) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), r); };
    return g;
  }
  // a stool for props
  function filterStool(parent, x, y) {
    E('rect', { x: x - 60, y, width: 120, height: 14, rx: 5, fill: '#8A5A3A', stroke: '#5E3B22', 'stroke-width': 3 }, parent);
    E('path', { d: `M${x - 48},${y + 14} L${x - 58},${y + 96} M${x + 48},${y + 14} L${x + 58},${y + 96}`, stroke: '#6B4423', 'stroke-width': 9, 'stroke-linecap': 'round' }, parent);
  }

  /* ---------- layers ---------- */
  const world = G(root);
  const hallL = G(world), dimR = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#07050A', opacity: 0 }, world);
  const spotL = G(world), kavL = G(world), washL = G(world), diagL = G(world), castL = G(world);
  const hud = G(root);

  /* ---------- the hall ---------- */
  const hall = lwHall(hallL);
  // the cardboard tree under the left lantern goes black in red light
  const treeShade = E('path', { d: 'M230,320 C320,330 320,470 230,480 C140,470 140,330 230,320 Z', fill: '#121014', stroke: '#050405', 'stroke-width': 4 }, hallL);
  const SP = hall.spots;
  const spots = SP.map(([x, y]) => { const w = G(spotL); tr(w, x, y); const s = lwSpot(w, '#FFF7C2'); s.w = w; return s; });
  // Rosie, small, in the left lantern's gel holder (rotates with the lantern)

  // Kavya, Tree Number Three, in a cardboard box costume base
  const kavW = G(kavL);
  const kav = cast(kavW, 'kavya', { outfit: 'tree' });
  lwTint(kav.leaves, '#1A1A1A', 0); lwTint([kav.shirt], '#1A1A1A', 0);
  const box = G(kavL);
  E('path', { d: 'M486,566 L714,566 L726,690 L474,690 Z', fill: '#C79A62', stroke: '#7A5A30', 'stroke-width': 4, 'stroke-linejoin': 'round' }, box);
  E('path', { d: 'M486,566 L520,590 L680,590 L714,566', fill: 'none', stroke: '#9C7444', 'stroke-width': 3 }, box);
  T(box, 600, 650, 'TREE 3', { size: 40, weight: 800, anchor: 'middle', fill: '#3A2A14' });
  const redWash = E('ellipse', { cx: 600, cy: 450, rx: 200, ry: 230, fill: glow('#FF2E4D'), opacity: 0 }, washL);

  /* ---------- hall chips ---------- */
  const cTime = G(hud);
  { const c = filterChip(cTime, '6:00 PM', { size: 40, color: C.energy }); tr(c, 0, 0); T(cTime, 0, 66, 'drama club rehearsal', { size: 28, weight: 600, anchor: 'middle', fill: C.ink, font: FB }); }
  const page = G(hud);
  E('rect', { x: -170, y: -110, width: 340, height: 220, rx: 6, fill: '#FBFAF4', stroke: '#C9C2AE', 'stroke-width': 3 }, page);
  T(page, 0, -60, 'THE PLAY · Scene 1', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  E('line', { x1: -140, y1: -40, x2: 140, y2: -40, stroke: '#C9C2AE', 'stroke-width': 2 }, page);
  T(page, -140, 4, 'TREE 3:', { size: 34, weight: 800, fill: '#22844A' });
  T(page, -140, 50, '(no lines)', { size: 32, weight: 600, fill: SC_INK, font: FB });
  T(page, -140, 88, 'stand still. be a tree.', { size: 26, weight: 600, fill: '#7A7468', font: FB });

  /* ---------- A: the red apple ---------- */
  const shA = G(diagL);
  filterStool(shA, 620, 548);
  const apple = lwApple(shA, 1.45); tr(apple, 620, 476, 1.45);
  const L0 = [320, 170];                         // the left lantern's lens
  const AC = [620, 476], AR = 76;                // apple centre and radius
  // routes for the shared pool of thin coloured rays (built after the props, so they draw on top)
  const aRoute = LW_SPECTRUM.map((h, i) => {
    const a = (-95 - i * 11) * Math.PI / 180, e = [AC[0] + Math.cos(a) * AR, AC[1] + Math.sin(a) * AR];
    return { pts: [[L0[0] + (i - 3) * 3, L0[1]], e], end: e };
  });
  const EYE = [1050, 300];
  const aOut = lwRayPath(shA, [aRoute[0].end, [EYE[0] - 50, EYE[1] + 8]], { color: '#FF4D4D', width: 6, head: 18 });
  const eyeA = lwEyeIcon(shA, 1.6); tr(eyeA, EYE[0], EYE[1]);
  const eyeGlow = E('circle', { cx: EYE[0] - 20, cy: EYE[1], r: 46, fill: glow('#FF4D4D'), opacity: 0 }, shA);
  T(shA, EYE[0], EYE[1] + 74, 'your eye', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const aWhite = filterChip(shA, 'white light', { size: 28, color: '#FFFFFF' }); tr(aWhite, 300, 300);
  const aRefl = filterChip(hud, 'REFLECTS red', { size: 36, color: '#FF6B6B', stroke: '#FF4D4D' });
  const aAbs = filterChip(hud, 'ABSORBS the rest', { size: 36, color: C.ink, stroke: C.muted });
  // noglow card: crossed-out glowing apple and "turns light red"
  const ngCard = G(hud);
  card(ngCard, -220, -110, 440, 220, { fill: 'rgba(10,27,39,0.92)', stroke: C.line });
  const ngA = G(ngCard); tr(ngA, -150, -46);
  E('circle', { r: 50, fill: glow('#FFE45C'), opacity: 0.9 }, ngA);
  { const ap = lwApple(ngA, 0.48); tr(ap, 0, 0, 0.48); }
  let gr = ''; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; gr += `M${(Math.cos(a) * 36).toFixed(1)},${(Math.sin(a) * 36).toFixed(1)} L${(Math.cos(a) * 50).toFixed(1)},${(Math.sin(a) * 50).toFixed(1)} `; }
  E('path', { d: gr, stroke: '#FFE45C', 'stroke-width': 4, 'stroke-linecap': 'round' }, ngA);
  T(ngCard, -80, -36, 'glows', { size: 34, weight: 700, fill: C.ink });
  const ngX1 = cross(ngCard, 16, C.bad); tr(ngX1, 170, -46);
  const ngB = G(ngCard);
  T(ngB, -200, 62, 'turns the light red', { size: 32, weight: 700, fill: C.ink });
  const ngS = strike(ngB, -206, 52, 104, C.bad);
  const ngX2 = cross(ngB, 16, C.bad); tr(ngX2, 170, 52);

  /* ---------- WB: white ball, black ball ---------- */
  const shWB = G(diagL);
  const BW = [400, 486], BB = [800, 486], BR = 58;
  filterStool(shWB, BW[0], 548); filterStool(shWB, BB[0], 548);
  E('circle', { cx: BW[0], cy: BW[1], r: BR, fill: ball('#FFFFFF', '#B9C4CE'), stroke: SC_INK, 'stroke-width': 4 }, shWB);
  E('circle', { cx: BB[0], cy: BB[1], r: BR, fill: ball('#3A3A44', '#050507'), stroke: '#5A5A66', 'stroke-width': 4 }, shWB);
  const wbRoute = [];
  [[BW, SP[0]], [BB, SP[2]]].forEach(([B, L], k) => {
    const lens = [L[0], L[1] + 30], base = Math.atan2(lens[1] - B[1], lens[0] - B[0]) * 180 / Math.PI;
    LW_SPECTRUM.forEach((h, i) => {
      const a = (base + (i - 3) * 7) * Math.PI / 180, e = [B[0] + Math.cos(a) * BR, B[1] + Math.sin(a) * BR];
      wbRoute.push({ pts: [[lens[0] + (i - 3) * 3, lens[1]], e], k, e });
    });
  });
  const wbOut = [-178, -155, -132, -62, -38, -14, 8].map((deg, i) => {
    const a = deg * Math.PI / 180, s = [BW[0] + Math.cos(a) * BR, BW[1] + Math.sin(a) * BR];
    return lwRayPath(shWB, [s, [s[0] + Math.cos(a) * 130, s[1] + Math.sin(a) * 130]], { color: LW_SPECTRUM[i].color, width: 4, glow: false, head: 13, at: 0.6 });
  });
  const wbW = G(hud); { const c = filterChip(wbW, 'WHITE reflects ALL', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' }); tr(c, 0, 0); }
  const wbB = G(hud); { const c = filterChip(wbB, 'BLACK absorbs ALL', { size: 32, color: C.ink, stroke: C.muted }); tr(c, 0, 0); }

  /* ---------- L: the club line ---------- */
  const shL = G(castL);
  // the queue: light versions of the colour characters (a ball, eyes looking right, a mouth); g.set({ mood })
  function filterBall(parent, name) {
    const g = G(parent), col = LW_HUE[name], dk = LW_HUE_DK[name];
    E('circle', { r: 64, fill: ball(col, dk), stroke: dk, 'stroke-width': 5 }, g);
    E('path', { d: 'M-24,-20 a14,16 0 1,0 0.1,0 Z M24,-20 a14,16 0 1,0 0.1,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-18,-6 a7,7 0 1,0 0.1,0 Z M30,-6 a7,7 0 1,0 0.1,0 Z', fill: SC_INK }, g);
    if (name === 'red') E('path', { d: 'M-46,-60 h44 v20 h-44 Z M2,-60 h44 v20 h-44 Z', fill: '#121418', stroke: SC_INK, 'stroke-width': 3 }, g);
    const m = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    g.set = st => {
      if (st.mood === 'shock') { attr(m, 'd', 'M-10,30 a10,13 0 1,0 0.1,0 Z'); attr(m, 'fill', '#5A1E2A'); }
      else { attr(m, 'd', st.mood === 'smug' ? 'M-18,26 Q4,40 22,20' : 'M-20,22 Q0,42 20,22'); attr(m, 'fill', 'none'); }
    };
    return g;
  }
  const qRed = filterBall(shL, 'red'), qGreen = filterBall(shL, 'green'), qBlue = filterBall(shL, 'blue');
  const rosieBigW = G(castL); const rosie = cast(rosieBigW, 'rosie', {});
  const qRay = lwRayPath(castL, [[694, 440], [1110, 440]], { color: '#FF4D4D', width: 6, head: 18 });
  const qPuffG = filterPuff(castL, '#4CD964'), qPuffB = filterPuff(castL, '#3B82F6');
  const qOk = G(hud); { const c = filterChip(qOk, 'ON THE LIST', { size: 32, color: '#FF6B6B', stroke: '#FF4D4D' }); tr(c, 0, 0); const tk = tick(qOk, 14, C.good); tr(tk, c.w / 2 + 30, 0); }
  const qNo = G(hud); { const c = filterChip(qNo, 'absorbed', { size: 32, color: C.ink, stroke: C.muted }); tr(c, 0, 0); }
  const list = lwList(castL);

  /* ---------- F: the filter diagram ---------- */
  const shF = G(diagL);
  const fBox = lwRayBox(shF); tr(fBox, 120, 330);
  const fRoute = LW_SPECTRUM.map((h, i) => { const y = 294 + i * 12; return { pts: [[176, y], [532, y]], y }; });
  const fOut = lwRayPath(shF, [[668, 294], [1100, 294]], { color: '#FF4D4D', width: 6, head: 18 });
  // the shared pool: 14 thin coloured rays and 7 "absorbed" puffs, re-routed for each diagram shot
  const poolL = G(diagL);
  const pool = Array.from({ length: 14 }, (_, j) => lwRayPath(poolL, [[0, 0], [1, 0]], { color: LW_SPECTRUM[j % 7].color, width: 4, glow: false, head: 13, at: 0.5 }));
  const puffs = LW_SPECTRUM.map(h => filterPuff(poolL, h.color));
  const usePool = (j, pts, p) => { op(pool[j], 1); pool[j].pts(pts); pool[j].set(p); };
  const usePuff = (i, x, y, p) => { tr(puffs[i], x, y); puffs[i].set(p); };
  const fWhite = filterChip(shF, 'white light', { size: 28 }); tr(fWhite, 350, 250);
  const fRed = filterChip(shF, 'red filter', { size: 28, color: '#FF6B6B', stroke: '#FF4D4D' }); tr(fRed, 600, 452);
  const fTitle = G(hud); { const c = filterChip(fTitle, 'FILTER', { size: 56, fill: '#FF2E4D', color: '#FFFFFF', stroke: '#FFFFFF', sw: 4, weight: 800 }); tr(c, 0, 0); }
  const fTrans = G(hud); filterRich(fTrans, 0, 0, [['TRANSMITS', '#FF6B6B', 800], [' its own colour', C.ink]], { size: 36, anchor: 'middle' });
  const fAbs = G(hud); filterRich(fAbs, 0, 0, [['ABSORBS', C.muted, 800], [' the others', C.ink]], { size: 36, anchor: 'middle' });
  const fStamp = filterStamp(hud, 'A FILTER IS SELFISH', '#FF6B6B');
  const npStamp = filterStamp(hud, 'NOT ON THE LIST', '#FF6B6B');

  /* ---------- TR: Rosie's confessional ---------- */
  const conf = lwConf(hallL, 'rosie');
  const rope = G(castL);
  [780, 1050].forEach(x => {
    E('rect', { x: x - 9, y: 430, width: 18, height: 170, rx: 6, fill: ball('#F2D06B', '#A07818'), stroke: '#6B4E12', 'stroke-width': 3 }, rope);
    E('circle', { cx: x, cy: 424, r: 16, fill: ball('#FFE29A', '#A07818'), stroke: '#6B4E12', 'stroke-width': 3 }, rope);
    E('rect', { x: x - 34, y: 594, width: 68, height: 16, rx: 6, fill: '#A07818', stroke: '#6B4E12', 'stroke-width': 3 }, rope);
  });
  E('path', { d: 'M790,440 Q915,520 1040,440', fill: 'none', stroke: '#B3123A', 'stroke-width': 14, 'stroke-linecap': 'round' }, rope);
  const trSelf = G(castL); { T(trSelf, 0, 14, 'selfish', { size: 44, weight: 700, anchor: 'middle', fill: '#FF9AA4' }); trSelf.st = strike(trSelf, -90, 0, 90, C.bad); }
  const trExcl = G(castL);
  E('rect', { x: -170, y: -42, width: 340, height: 84, rx: 12, fill: '#1A1014', stroke: '#F2D06B', 'stroke-width': 5 }, trExcl);
  T(trExcl, 0, 16, 'EXCLUSIVE', { size: 48, weight: 800, anchor: 'middle', fill: '#F2D06B', ls: 3 });

  /* ---------- GR: the lantern swings onto Kavya ---------- */
  const grRay = lwRayPath(diagL, [[350, 196], [560, 330]], { color: '#FF4D4D', width: 6, head: 18 });
  const grPuff = filterPuff(diagL, '#FF4D4D'); tr(grPuff, 560, 330);
  const grC1 = G(hud); { const c = filterChip(grC1, 'only RED light', { size: 32, color: '#FF6B6B', stroke: '#FF4D4D' }); tr(c, 0, 0); }
  const grC2 = G(hud); filterRich(grC2, 0, 0, [['no ', C.ink], ['GREEN', '#4CD964', 800], [' light to reflect', C.ink]], { size: 32, anchor: 'middle' });
  const grC3 = G(hud); { const c = filterChip(grC3, 'leaves look BLACK', { size: 34, fill: '#121014', color: '#FFFFFF', stroke: '#FFFFFF' }); tr(c, 0, 0); }

  /* ---------- PR / MX: primary colours, mixing ---------- */
  const prTitle = G(hud); { const c = filterChip(prTitle, 'PRIMARY COLOURS OF LIGHT', { size: 40, color: C.energy, stroke: C.energy }); tr(c, 0, 0); }
  const prLab = ['RED', 'GREEN', 'BLUE'].map((n, i) => { const c = filterChip(hud, n, { size: 30, fill: ['#B32626', '#22844A', '#1D4FB0'][i], color: '#FFFFFF', stroke: '#FFFFFF' }); return c; });
  const shM = G(diagL);
  const RGB = [380, 420], RS = 1.1;
  const rgb = lwRGB(shM, RS); tr(rgb, RGB[0], RGB[1], RS);
  const mixAt = [[-55, -20], [0, 75], [55, -20], [0, 14]].map(([x, y]) => [RGB[0] + x * RS, RGB[1] + y * RS]);
  const mixRing = E('circle', { r: 34, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-dasharray': '10 7' }, shM);
  const EQ = [
    [['red', '#FF5A5A'], [' + ', C.ink], ['green', '#4CD964'], [' = ', C.ink], ['yellow', '#FFE45C', 800]],
    [['green', '#4CD964'], [' + ', C.ink], ['blue', '#5B9BFF'], [' = ', C.ink], ['cyan', '#4CF0F0', 800]],
    [['red', '#FF5A5A'], [' + ', C.ink], ['blue', '#5B9BFF'], [' = ', C.ink], ['magenta', '#FF5AE0', 800]],
  ];
  const eqBox = G(hud); card(eqBox, 0, 0, 470, 400, { fill: 'rgba(10,27,39,0.85)', stroke: C.line });
  const eqs = EQ.map(parts => { const g = G(hud); filterRich(g, 0, 0, parts, { size: 36 }); return g; });
  const eqAll = G(hud); filterRich(eqAll, 0, 0, [['all three', C.ink], [' = ', C.ink], ['WHITE', '#FFFFFF', 800]], { size: 40 });
  const rayW = G(castL); const ray = cast(rayW, 'ray', {});
  const hiChip = G(hud); { const c = filterChip(hiChip, 'white light = red + green + blue', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' }); tr(c, 0, 0); }

  /* ---------- SC: phone pixels ---------- */
  const shS = G(hud);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#141018', '#24203A', true) }, shS);
  const phone = G(shS); tr(phone, 290, 420);
  E('rect', { x: -120, y: -210, width: 240, height: 420, rx: 34, fill: '#1B1F26', stroke: '#5A6676', 'stroke-width': 5 }, phone);
  E('rect', { x: -102, y: -180, width: 204, height: 360, rx: 14, fill: '#2B3A55' }, phone);
  E('circle', { cy: -10, r: 72, fill: '#FFE45C', stroke: '#C9A11E', 'stroke-width': 4 }, phone);
  E('ellipse', { cx: -24, cy: -30, rx: 9, ry: 13, fill: SC_INK }, phone); E('ellipse', { cx: 24, cy: -30, rx: 9, ry: 13, fill: SC_INK }, phone);
  E('path', { d: 'M-36,10 Q0,48 36,10', fill: 'none', stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, phone);
  const mag = G(shS);
  const MG = [340, 380];
  E('line', { x1: MG[0] + 52, y1: MG[1] - 52, x2: 640, y2: 236, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.7 }, mag);
  E('line', { x1: MG[0] + 52, y1: MG[1] + 52, x2: 640, y2: 544, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.7 }, mag);
  E('circle', { cx: MG[0], cy: MG[1], r: 56, fill: 'rgba(255,255,255,0.12)', stroke: '#E9EEF5', 'stroke-width': 8 }, mag);
  E('line', { x1: MG[0] - 40, y1: MG[1] + 40, x2: MG[0] - 92, y2: MG[1] + 92, stroke: '#8A6D35', 'stroke-width': 16, 'stroke-linecap': 'round' }, mag);
  const pix = lwPixels(shS, 1.25); tr(pix, 860, 390, 1.25); pix.set('yellow');
  const scC1 = G(shS); filterRich(scC1, 0, 0, [['tiny ', C.ink], ['RED', '#FF5A5A', 800], [', ', C.ink], ['GREEN', '#4CD964', 800], [' and ', C.ink], ['BLUE', '#5B9BFF', 800], [' dots', C.ink]], { size: 36, anchor: 'middle' });
  const scC2 = G(shS); { const c = filterChip(scC2, 'no yellow dots: red + green', { size: 36, color: '#FFE45C', stroke: '#FFE45C' }); tr(c, 0, 0); }

  /* ---------- PT: paint ---------- */
  const shP = G(hud);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1E1A16', '#3A2E22', true) }, shP);
  const pal = G(shP); tr(pal, 600, 430);
  E('path', { d: 'M-250,-40 C-250,-170 -60,-190 90,-160 C230,-132 280,-40 250,60 C222,150 120,170 30,150 C-30,138 -10,90 -70,96 C-140,104 -150,170 -220,140 C-262,120 -250,40 -250,-40 Z', fill: ball('#E3B272', '#A0702E'), stroke: '#6B4416', 'stroke-width': 5 }, pal);
  E('ellipse', { cx: -160, cy: 60, rx: 34, ry: 26, fill: '#3A2E22', stroke: '#6B4416', 'stroke-width': 4 }, pal);
  [[-120, -110, '#E8282F'], [200, 10, '#FFFFFF']].forEach(([x, y, c]) => E('path', { d: `M${x - 26},${y} q4,-24 26,-22 q24,4 22,24 q-4,22 -26,20 q-22,-4 -22,-22 Z`, fill: c, stroke: '#00000033', 'stroke-width': 2 }, pal));
  const blobD = 'M-44,0 C-44,-30 -18,-42 6,-38 C34,-34 46,-12 42,10 C38,34 14,44 -10,40 C-34,36 -44,22 -44,0 Z';
  const pBlue = E('path', { d: blobD, fill: '#2557D6', stroke: '#14327E', 'stroke-width': 3 }, pal);
  const pYel = E('path', { d: blobD, fill: '#FFD21F', stroke: '#B58F00', 'stroke-width': 3 }, pal);
  const pMud = E('path', { d: 'M-70,0 C-70,-46 -26,-62 10,-58 C54,-52 72,-18 66,14 C60,52 22,66 -14,62 C-52,56 -70,34 -70,0 Z', fill: '#4E5A2A', stroke: '#2E3818', 'stroke-width': 3 }, pal);
  const swirl = E('path', { d: 'M0,0 C10,-14 30,-6 26,12 C20,34 -16,34 -26,10 C-38,-20 -6,-46 22,-40', fill: 'none', stroke: '#6E7C3A', 'stroke-width': 6, 'stroke-linecap': 'round' }, pal);
  const brush = G(pal);
  E('rect', { x: -6, y: -170, width: 12, height: 130, rx: 5, fill: '#B3123A', stroke: SC_INK, 'stroke-width': 2.5 }, brush);
  E('rect', { x: -8, y: -48, width: 16, height: 16, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 2.5 }, brush);
  E('path', { d: 'M-8,-32 Q-10,-6 0,4 Q10,-6 8,-32 Z', fill: '#4E5A2A', stroke: SC_INK, 'stroke-width': 2.5 }, brush);
  const ptC1 = G(shP); filterRich(ptC1, 0, 0, [['PAINTS', '#FFE29A', 800], [' ABSORB light', C.ink, 800]], { size: 48, anchor: 'middle' });
  const ptEq = G(shP); filterRich(ptEq, 0, 0, [['blue paint', '#5B9BFF'], [' + ', C.ink], ['yellow paint', '#FFD21F'], [' = ', C.ink], ['muddy green', '#9DB05A', 800]], { size: 34, anchor: 'middle' });
  const ptC2 = G(shP); { const c = filterChip(ptC2, 'mixing paints makes DARKER colours', { size: 32, color: C.ink, stroke: C.muted }); tr(c, 0, 0); }

  /* ---------- lower third ---------- */
  const ltRosie = lwLower(hud, 'rosie');

  /* ---------- shots ---------- */
  const SHOTS = [['H', -9], ['A', at('apple') - 0.05], ['WB', at('whiteblack') - 0.05], ['R1', end('whiteblack') + 0.12], ['R2', mid('rosie', 0.3)],
    ['L', at('list') - 0.05], ['F', at('filter') - 0.05], ['TR', at('throsie') - 0.05], ['GR', at('green') - 0.05], ['BL', at('black') - 0.05],
    ['NL', at('notlist') - 0.05], ['PR', at('primary') - 0.05], ['MX', at('mix') - 0.05], ['SC', at('screen') - 0.05], ['PT', at('paint') - 0.05]];
  const shotAt = t => { let s = 'H'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const shotStart = k => SHOTS.find(s => s[0] === k)[1];
  const HALL = { H: 1, R1: 1, GR: 1, BL: 1, PR: 1 };
  const DIM = { A: 0.55, WB: 0.55, R2: 0.62, L: 0.62, F: 0.8, NL: 0.62, MX: 0.82, GR: 0.5, BL: 0.5, PR: 0.35 };
  const rosieSlideT = end('whiteblack') + 0.25, redOnT = rosieSlideT + 0.75;
  const swingT = at('green') + 0.15;

  return t => {
    const sh = shotAt(t), t0 = shotStart(sh);
    const hallOn = sh !== 'TR' && sh !== 'SC' && sh !== 'PT';
    op(hallL, 1); op(hall, hallOn ? 1 : 0); op(treeShade, 0);
    conf.set(sh === 'TR' ? 1 : 0, t);
    attr(dimR, 'opacity', hallOn ? (DIM[sh] || 0) : 0);
    op(shS, sh === 'SC' ? 1 : 0); op(shP, sh === 'PT' ? 1 : 0);
    // reset everything that belongs to a single shot
    [shA, shWB, shL, shF, shM, rope, grRay, grPuff, rayW, rosieBigW, list, qRay, qPuffG, qPuffB].forEach(e => op(e, 0));
    [cTime, page, aRefl, aAbs, ngCard, wbW, wbB, qOk, qNo, fTitle, fTrans, fAbs, fStamp, npStamp, trSelf, trExcl, grC1, grC2, grC3, prTitle, ...prLab, ...eqs, eqAll, eqBox, hiChip].forEach(e => op(e, 0));
    let cam = [600, 375, 1];

    /* lanterns: default all white and on in the hall shots */
    const spotState = [[0, '#FFF7C2'], [0, '#FFF7C2'], [0, '#FFF7C2']];
    let spot0Rot = 0, spot0S = 1;
    op(spotL, hallOn ? 1 : 0);
    pool.forEach(r => op(r, 0)); puffs.forEach(q => q.set(0));
    let ro = null;   // Rosie this frame: { x, y, s, r, mood, look }
    const kavOn = sh === 'H' || sh === 'R1' || sh === 'GR' || sh === 'BL';
    op(kavL, kavOn ? 1 : 0);
    let kMood = 'deadpan', kLook = 0, kRot = 0, leafP = 0;
    attr(redWash, 'opacity', 0);

    if (sh === 'H' || sh === 'R1') {
      spotState[0][0] = 1; spotState[1][0] = 1; spotState[2][0] = 1;
      if (sh === 'H') {
        popIn2(cTime, t, at('hall') + 0.15, 980, 210, 1 - P(t, at('tree') - 0.2, 0.25, linear));
        const pg = P(t, mid('tree', 0.42), 0.45, pop);
        op(page, clamp(pg * 2.5)); tr(page, 910, 330, Math.max(0.01, 0.6 + 0.4 * pg), 4);
        const push = P(t, at('tree') - 0.1, end('tree') + 0.6 - at('tree'), linear);
        cam = [lerp(600, 610, push), lerp(375, 420, push), 1 + 0.32 * ease(push)];
        kMood = t < at('tree') ? 'neutral' : 'deadpan';
        kLook = t > mid('tree', 0.42) && t < mid('tree', 0.8) ? 0.7 : 0;
      } else {
        // Rosie slides along the lighting bar into the left lantern; its cone turns red
        const sp = P(t, rosieSlideT, 0.7, easeOut);
        if (t >= rosieSlideT) ro = { x: SP[0][0] + lerp(900, 0, sp), y: SP[0][1] + 34 - Math.sin(sp * Math.PI) * 30, s: 0.3, r: 0, mood: 'deadpan', look: 0 };
        const red = P(t, redOnT, 0.25, linear);
        spotState[0][1] = lwMix('#FFF7C2', '#FF2E4D', red);
        op(treeShade, red);
        kLook = -0.6; kMood = 'neutral';
        cam = [600, 375, 1];
      }
    }
    if (sh === 'GR' || sh === 'BL') {
      // every white light off; Rosie's lantern swings onto Kavya
      const sw = P(t, swingT, 0.8, ease);
      spotState[0] = [1, '#FF2E4D']; spot0Rot = lerp(0, -39, sh === 'BL' ? 1 : sw); spot0S = lerp(1, 1.2, sh === 'BL' ? 1 : sw);
      op(treeShade, 1);
      leafP = sh === 'BL' ? 1 : P(t, mid('green', 0.3), 1.4, linear);
      attr(redWash, 'opacity', 0.45 * (sh === 'BL' ? 1 : sw));
      if (sh === 'GR') {
        op(grRay, 1); grRay.set(P(t, swingT + 0.7, 0.5, linear)); op(grPuff, 1); grPuff.set(P(t, swingT + 1.2, 0.5, linear));
        popIn2(grC1, t, mid('green', 0.15), 900, 210);
        popIn2(grC2, t, mid('green', 0.45), 900, 300);
        popIn2(grC3, t, mid('green', 0.75), 900, 380);
        cam = [600, 400, 1 + 0.12 * P(t, at('green'), 5, linear)];
        kMood = t > mid('green', 0.6) ? 'shock' : 'neutral'; kLook = t > mid('green', 0.6) ? 0 : -0.5;
      } else {
        const push = P(t, at('black'), end('black') + 0.4 - at('black'), linear);
        cam = [600, 410, 1.75 + 0.2 * push];
        kMood = 'annoyed'; kLook = t < mid('black', 0.45) ? -0.4 : 0;
        kRot = t < mid('black', 0.45) ? -7 * P(t, at('black'), 0.4) : -7 + 7 * P(t, mid('black', 0.45), 0.3);
      }
    }
    if (sh === 'PR') {
      spotState[0] = [P(t, mid('primary', 0.15), 0.3, linear), '#FF2E4D'];
      spotState[1] = [P(t, mid('primary', 0.32), 0.3, linear), '#20E040'];
      spotState[2] = [P(t, mid('primary', 0.5), 0.3, linear), '#2060FF'];
      op(treeShade, 0);
      prLab.forEach((c, i) => popIn2(c, t, mid('primary', 0.15 + 0.17 * i), SP[i][0], 600));
      popIn2(prTitle, t, mid('primary', 0.68), 600, 685);
      cam = [600, 375, 1];
    }
    if (sh === 'A' || sh === 'WB') {
      spotState[0] = [1, '#FFF7C2'];
      if (sh === 'WB') spotState[2] = [1, '#FFF7C2'];
    }
    const lit = (sh === 'H' || sh === 'R1' || sh === 'GR' || sh === 'BL' || sh === 'PR' || sh === 'A' || sh === 'WB');
    spots.forEach((s, i) => { s.set(lit ? spotState[i][0] : 0, spotState[i][1]); });
    tr(spots[0].w, SP[0][0], SP[0][1], spot0S, spot0Rot);
    if (sh === 'GR' || sh === 'BL' || sh === 'PR') {   // Rosie rides in the left lantern's gel holder
      const a = spot0Rot * Math.PI / 180, d = 34 * spot0S;
      ro = { x: SP[0][0] - d * Math.sin(a), y: SP[0][1] + d * Math.cos(a), s: 0.3 * spot0S, r: spot0Rot, mood: 'deadpan', look: sh === 'GR' ? 0.6 : 0 };
    }

    // Kavya
    if (kavOn) {
      tr(kavW, 600, 450, 0.95, kRot);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: kMood, look: kLook });
      lwTint(kav.leaves, '#1A1A1A', leafP); lwTint([kav.shirt], '#1E1A1A', leafP);
    }

    /* ---------- A: the apple; noglow ---------- */
    if (sh === 'A') {
      op(shA, 1);
      const t1 = at('apple') + 0.2;
      aRoute.forEach((r, i) => { usePool(i, r.pts, P(t, t1 + i * 0.06, 0.9, linear)); if (i) usePuff(i, r.end[0], r.end[1], P(t, mid('apple', 0.62) + i * 0.05, 0.5, linear)); });
      op(aWhite, P(t, t1 + 0.3, 0.3, linear));
      aOut.set(P(t, mid('apple', 0.35), 0.7, linear));
      attr(eyeGlow, 'opacity', 0.8 * P(t, mid('apple', 0.35) + 0.6, 0.3, linear) * (0.75 + 0.25 * Math.sin(t * 6)));
      popIn2(aRefl, t, mid('apple', 0.42), 850, 215);
      popIn2(aAbs, t, mid('apple', 0.66), 400, 640);
      // noglow: Ray at the side
      if (t >= at('noglow') - 0.3) {
        const rp = P(t, at('noglow') - 0.3, 0.4, pop);
        op(rayW, clamp(rp * 2)); tr(rayW, 160, lerp(800, 560, clamp(rp)), 0.72);
        ray.set({ t, talk: scTalk(S, t, 'ray'), mood: 'deadpan', look: t < mid('noglow', 0.25) ? 1 : 0.2 });
        const cp = P(t, mid('noglow', 0.3), 0.45, pop); op(ngCard, clamp(cp * 2.5)); tr(ngCard, 935, 575, Math.max(0.01, 0.7 + 0.3 * cp));
        op(ngX1, P(t, mid('noglow', 0.45), 0.2, linear)); op(ngB, P(t, mid('noglow', 0.62), 0.3, linear)); ngS.set(P(t, mid('noglow', 0.78), 0.35));
        op(ngX2, P(t, mid('noglow', 0.88), 0.2, linear));
        cam = [600, 375, 1];
      }
    }

    /* ---------- WB ---------- */
    if (sh === 'WB') {
      op(shWB, 1);
      wbRoute.forEach((r, j) => {
        const i = j % 7, s0 = r.k ? mid('whiteblack', 0.55) : at('whiteblack') + 0.15;
        usePool(j, r.pts, P(t, s0 + i * 0.05, 0.8, linear));
        if (r.k) usePuff(i, r.e[0], r.e[1], P(t, s0 + 0.8 + i * 0.05, 0.5, linear));
      });
      wbOut.forEach((r, i) => r.set(P(t, at('whiteblack') + 0.95 + i * 0.05, 0.7, linear)));
      popIn2(wbW, t, mid('whiteblack', 0.25), 400, 660);
      popIn2(wbB, t, mid('whiteblack', 0.72), 800, 660);
    }

    /* ---------- R2: Rosie drops to camera height ---------- */
    if (sh === 'R2' || sh === 'NL') {
      attr(redWash, 'opacity', 0);
      if (sh === 'R2') {
        const dp = P(t, t0, 0.45, easeOut), bounce = Math.sin(P(t, t0 + 0.45, 0.35, linear) * Math.PI) * 10;
        ro = { x: 430, y: lerp(-240, 400, dp) + bounce, s: 1.3, r: 0, mood: 'deadpan', look: t > mid('rosie', 0.72) ? 0.7 : 0 };
        ltRosie.set(win(t, t0 + 0.2, t0 + 3.3, 0.3));
        const lp = P(t, mid('rosie', 0.72), 0.45, pop); op(list, clamp(lp * 2.5)); tr(list, 830, 410, Math.max(0.01, 1.1 * (0.6 + 0.4 * lp)), -6);
        cam = [600, 375, 1];
      } else {
        const push = P(t, at('notlist'), end('notlist') + 0.8 - at('notlist'), linear);
        ro = { x: 470, y: 410, s: 1.4, r: 0, mood: 'deadpan', look: 0 };
        op(list, 1); tr(list, 900, 420, 1.15, -5);
        cam = [lerp(600, 540, push), lerp(375, 370, push), 1 + 0.18 * ease(push)];
        npStamp.set(P(t, mid('notlist', 0.75), 0.35), 880, 650, -4);
      }
    } else ltRosie.set(0);

    /* ---------- L: the club line ---------- */
    if (sh === 'L') {
      op(shL, 1);
      const look = t < mid('list', 0.35) ? -0.5 : t < end('list') ? -0.8 : 0;
      ro = { x: 600, y: 420, s: 1.0, r: 0, mood: 'deadpan', look };
      const QY = 520;
      // Red strolls through (behind Rosie)
      const rp = P(t, at('list') + 0.2, 1.1, ease);
      tr(qRed, lerp(400, 900, rp), QY + (rp > 0 && rp < 1 ? -Math.abs(Math.sin(rp * 9)) * 10 : 0), 0.62);
      qRed.set({ t, mood: 'smug', look: 0.6 });
      op(qRay, 1); qRay.set(P(t, at('list') + 0.75, 0.6, linear));
      popIn2(qOk, t, at('list') + 0.9, 900, 380);
      // Green and Blue walk up, bump, vanish
      const bump = (c, puff, tStart, x0, hue) => {
        const w = P(t, tStart, 0.4, easeIn), gone = P(t, tStart + 0.4, 0.25, linear);
        const x = lerp(x0, 470, w);
        op(c, 1 - gone); tr(c, x, QY, 0.62 * (1 + 0.25 * gone), 0);
        c.set({ t, mood: w < 1 ? 'happy' : 'shock', look: 0.6 });
        op(puff, 1); tr(puff, 470, QY); puff.set(P(t, tStart + 0.4, 0.5, linear) * (t > tStart + 0.4 ? 1 : 0));
      };
      bump(qGreen, qPuffG, mid('list', 0.5), 280, 'green');
      bump(qBlue, qPuffB, mid('list', 0.72), 160, 'blue');
      popIn2(qNo, t, mid('list', 0.72) + 0.45, 330, 400);
      cam = [600, 375, 1 + 0.05 * P(t, end('list'), 0.6, linear)];
    }

    /* ---------- F: the filter diagram ---------- */
    if (sh === 'F') {
      op(shF, 1);
      ro = { x: 600, y: 330, s: 0.8, r: 0, mood: t > mid('filter', 0.74) ? 'smug' : 'deadpan', look: -0.4 };
      fRoute.forEach((r, i) => { usePool(i, r.pts, P(t, at('filter') + 0.1 + i * 0.05, 0.8, linear)); if (i) usePuff(i, 532, r.y, P(t, mid('filter', 0.42) + i * 0.05, 0.5, linear)); });
      fOut.set(P(t, mid('filter', 0.2), 0.7, linear));
      popIn2(fTitle, t, at('filter') + 0.1, 840, 170);
      popIn2(fTrans, t, mid('filter', 0.22), 910, 380);
      popIn2(fAbs, t, mid('filter', 0.45), 330, 520);
      fStamp.set(P(t, mid('filter', 0.74), 0.35), 600, 630, -3);
    }

    /* ---------- TR: Rosie's confessional ---------- */
    if (sh === 'TR') {
      ro = { x: 430, y: 400, s: 1.4, r: 0, mood: t < mid('throsie', 0.45) ? 'annoyed' : 'smug', look: 0 };
      op(rope, 1);
      popIn2(trSelf, t, at('throsie') + 0.05, 915, 250); trSelf.st.set(P(t, mid('throsie', 0.4), 0.3));
      const ep = P(t, mid('throsie', 0.55), 0.45, pop); op(trExcl, clamp(ep * 2.5)); tr(trExcl, 915, 520, Math.max(0.01, 0.6 + 0.4 * ep), -3);
      const push = P(t, end('throsie') - 0.2, 0.9, linear);
      cam = [lerp(600, 470, push), lerp(375, 330, push), 1 + 0.22 * ease(push)];
    }

    /* ---------- MX: mixing ---------- */
    if (sh === 'MX') {
      op(shM, 1);
      rgb.set(P(t, at('mix') - 0.45, 0.9, linear));
      op(eqBox, 1); tr(eqBox, 690, 175);
      const EQT = [mid('mix', 0.02), mid('mix', 0.27), mid('mix', 0.52), mid('mix', 0.79)];
      eqs.forEach((e, i) => { const p = P(t, EQT[i], 0.4, pop); op(e, clamp(p * 2.5)); tr(e, 720, 250 + i * 90, Math.max(0.01, 0.8 + 0.2 * p)); });
      { const p = P(t, EQT[3], 0.4, pop); op(eqAll, clamp(p * 2.5)); tr(eqAll, 720, 520, Math.max(0.01, 0.8 + 0.2 * p)); }
      let k = 0; for (let i = 0; i < 4; i++) if (t >= EQT[i]) k = i;
      const ringOn = t >= EQT[0] && t < at('hiagain') - 0.1;
      op(mixRing, ringOn ? 1 : 0); attr(mixRing, 'cx', mixAt[k][0]); attr(mixRing, 'cy', mixAt[k][1]); attr(mixRing, 'r', (k === 3 ? 26 : 30) + 3 * Math.sin(t * 6));
      if (t >= at('hiagain') - 0.2) {
        const rp = P(t, at('hiagain') - 0.2, 0.45, pop);
        op(rayW, clamp(rp * 2.5)); tr(rayW, mixAt[3][0], mixAt[3][1] + 44, Math.max(0.01, 0.55 * rp), 6 * Math.sin(t * 5) * P(t, mid('hiagain', 0.75), 0.2, linear) * (1 - P(t, end('hiagain'), 0.2, linear)) * AMP);
        ray.set({ t, talk: scTalk(S, t, 'ray'), mood: t < mid('hiagain', 0.7) ? 'deadpan' : 'neutral', look: 0 });
        popIn2(hiChip, t, mid('hiagain', 0.35), 600, 692);
      }
    }

    /* ---------- SC: pixels ---------- */
    if (sh === 'SC') {
      const ph = P(t, at('screen') + 0.05, 0.4, pop); tr(phone, 290, 420, Math.max(0.01, 0.7 + 0.3 * ph)); op(phone, clamp(ph * 2.5));
      op(mag, P(t, mid('screen', 0.18), 0.3, linear));
      const pp = P(t, mid('screen', 0.25), 0.45, pop); op(pix, clamp(pp * 2.5)); tr(pix, 860, 390, Math.max(0.01, 1.25 * (0.7 + 0.3 * pp)));
      popIn2(scC1, t, mid('screen', 0.3), 860, 610);
      const c2 = P(t, mid('screen', 0.62), 0.45, pop); op(scC2, clamp(c2 * 2.5)); tr(scC2, 600, 690, Math.max(0.01, 0.7 + 0.3 * c2));
      if (t > mid('screen', 0.62)) op(scC1, 1 - P(t, mid('screen', 0.62), 0.2, linear));
      cam = [600, 375, 1];
    }

    /* ---------- PT: paint ---------- */
    if (sh === 'PT') {
      const mv = P(t, mid('paint', 0.25), 1.2, ease), mix = P(t, mid('paint', 0.25) + 0.9, 0.8, linear);
      tr(pBlue, lerp(-120, -14, mv), lerp(10, 4, mv)); tr(pYel, lerp(120, 14, mv), lerp(10, 4, mv));
      op(pBlue, 1 - mix); op(pYel, 1 - mix); op(pMud, mix); tr(pMud, 0, 6, lerp(0.7, 1, mix));
      op(swirl, mix); tr(swirl, 0, 6, 1, (t * 90 * AMP) % 360 * (1 - P(t, mid('paint', 0.8), 0.6, linear)));
      const bp = P(t, mid('paint', 0.2), 1.6, linear);
      op(brush, bp > 0 && bp < 1 ? 1 : 0); tr(brush, Math.sin(bp * TAU * 2) * 40, -10 + Math.cos(bp * TAU * 2) * 16, 1, 18);
      popIn2(ptC1, t, at('paint') + 0.1, 600, 165);
      popIn2(ptEq, t, mid('paint', 0.45), 600, 650);
      popIn2(ptC2, t, mid('paint', 0.7), 600, 688);
      if (t > mid('paint', 0.7)) tr(ptEq, 600, 625);
    }

    op(rosieBigW, ro ? 1 : 0);
    if (ro) { tr(rosieBigW, ro.x, ro.y, ro.s, ro.r); rosie.set({ t, talk: scTalk(S, t, 'rosie'), mood: ro.mood, look: ro.look }); }
    filterCam(world, cam[0], cam[1], cam[2]);
    function popIn2(el, tt, ts, x, y, f) { const p = P(tt, ts, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, 0.6 + 0.4 * p)); }
  };
});

/* Scene 1: Your eyes are not lasers (how we see, materials, luminous, shadows).
   Shots (hard sitcom cuts): bedroom wide, Ray comes in through the window; a "material test" card shows
   transparent glass, translucent curtains and the opaque blanket (Kavya hides under it) -> Ray leaves the
   parcel "with the neighbour" (push-in) -> the delivery route Sun -> poster -> eye -> Kavya's laser thought
   bubble -> hard cut: Ray close-up, deadpan, "No." pops it -> eyes only RECEIVE (letterbox) -> the wall is
   non-luminous -> the Moon in the window -> cutaway to space: the Moon reflects sunlight (and takes the credit)
   -> bedroom again: phone torch, dinosaur shadow, the shadow ray diagram, hand closer = bigger shadow,
   "Big dinosaur. Roar." -> the desk lamp: umbra and penumbra. */
scene('seeing', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed see) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const seeCam = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const popIn = (el, t, t0, x, y, s, r, f) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const seeLabel = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const seeX = (parent, s) => { const g = G(parent); E('circle', { r: s * 1.5, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 4 }, g); E('path', { d: `M${-s * 0.7},${-s * 0.7} L${s * 0.7},${s * 0.7} M${s * 0.7},${-s * 0.7} L${-s * 0.7},${s * 0.7}`, stroke: '#E8424F', 'stroke-width': s * 0.4, 'stroke-linecap': 'round' }, g); return g; };
  const seeScaleAbout = (el, cx, cy, sx, sy) => el.setAttribute('transform', `translate(${cx} ${cy}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-cx} ${-cy})`);

  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the bedroom ================= */
  const KX = 320, KUP = 482, KDOWN = 640, KS = 0.9;
  const EYE = [KX + 22, KUP - 20];
  const bedShot = G(Lbg);
  const bedBack = G(bedShot), wallFx = G(bedShot);
  const cp = E('clipPath', { id: 'seeKavClip' }, defs()); E('rect', { x: 0, y: 0, width: 1200, height: 612 }, cp);
  const kavClip = G(bedShot, { 'clip-path': 'url(#seeKavClip)' });
  const armL = G(bedShot), bedFront = G(bedShot), roomFx = G(bedShot), roomTop = G(bedShot), rayW = G(Lcast);
  const room = lwBedroom(bedBack, bedFront);
  room.setBeam(0);
  // the sky in the window (behind the curtains): the Sun and a pale daytime Moon
  const winG = room.curtL.parentNode;
  const skyG = G(winG); winG.insertBefore(skyG, room.curtL);
  const sunW = sun(skyG, 22); tr(sunW, 50, -104);
  const moonW = G(skyG); tr(moonW, -52, -98); lwMoon(moonW, 19);
  // Kavya in bed; the blanket lump when she hides
  const kav = cast(kavClip, 'kavya', { outfit: 'pyjamas' });
  const lumpG = G(bedFront); bedFront.insertBefore(lumpG, bedFront.firstChild);
  E('path', { d: 'M232,548 Q232,466 320,464 Q408,466 410,548 Z', fill: '#2E5FB8', stroke: '#1E3E7A', 'stroke-width': 4 }, lumpG);
  E('path', { d: 'M300,498 l3,6 l7,2 l-7,2 l-3,6 l-3,-6 l-7,-2 l7,-2 Z M352,520 l3,6 l7,2 l-7,2 l-3,6 l-3,-6 l-7,-2 l7,-2 Z', fill: '#FFE45C', opacity: 0.85 }, lumpG);
  // Ray
  const ray = cast(rayW, 'ray', {});
  ray.firstChild.children[2].remove();        // the seven colours in his coat: never opened in this scene
  // curtain glow + scattered light (translucent)
  const curtGlow = E('ellipse', { cx: 920, cy: 270, rx: 230, ry: 210, fill: glow('#FFF3B0'), opacity: 0 }, roomFx);
  const seeFan = (parent, list, col, w, hs) => {      // many short rays as one path of lines + one path of arrowheads
    let dl = '', dh = '';
    list.forEach(([x, y, a, L]) => {
      const u = lwDir(a), ex = x + u[0] * L, ey = y + u[1] * L, hx = x + u[0] * L * 0.62, hy = y + u[1] * L * 0.62, n = [-u[1], u[0]];
      dl += `M${x.toFixed(1)},${y.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)} `;
      dh += `M${(hx + u[0] * hs * 0.5).toFixed(1)},${(hy + u[1] * hs * 0.5).toFixed(1)} L${(hx - u[0] * hs * 0.5 + n[0] * hs * 0.6).toFixed(1)},${(hy - u[1] * hs * 0.5 + n[1] * hs * 0.6).toFixed(1)} L${(hx - u[0] * hs * 0.5 - n[0] * hs * 0.6).toFixed(1)},${(hy - u[1] * hs * 0.5 - n[1] * hs * 0.6).toFixed(1)} Z `;
    });
    const g = G(parent);
    E('path', { d: dl, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    E('path', { d: dh, fill: col }, g);
    return g;
  };
  const scatG = seeFan(roomFx, [[860, 250, 200, 70], [880, 330, 160, 70], [975, 230, 330, 70], [990, 320, 20, 70], [850, 180, 220, 70], [995, 170, 300, 70]], LW_OPT.ray, 4, 14);
  // the parcel left "with the neighbour"
  const parcel = G(roomTop);
  E('rect', { x: -30, y: -24, width: 60, height: 48, rx: 4, fill: '#C99A5B', stroke: SC_INK, 'stroke-width': 3 }, parcel);
  E('rect', { x: -6, y: -24, width: 12, height: 48, fill: '#E8D3A8' }, parcel);
  E('circle', { cx: 18, cy: 12, r: 7, fill: '#2F6FD6' }, parcel);
  const sorry = G(roomTop);
  E('rect', { x: -150, y: -34, width: 300, height: 68, rx: 8, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 4 }, sorry);
  T(sorry, 0, 10, 'Sorry we missed you', { size: 28, weight: 700, anchor: 'middle', fill: '#C2262F' });
  // the delivery route: Sun -> poster -> Kavya's eye
  const posterGlow = E('ellipse', { cx: 655, cy: 195, rx: 90, ry: 110, fill: glow('#FFF3B0'), opacity: 0 }, roomFx);
  const route = lwRayPath(roomFx, [[968, 168], [690, 214], EYE], { width: 6 });
  const eyeRing = E('circle', { cx: EYE[0], cy: EYE[1], r: 20, fill: 'none', stroke: C.glucose, 'stroke-width': 4 }, roomFx);
  // receive: everything comes INTO the eye
  const rcv = [[[690, 214], EYE], [[800, 452], [EYE[0] + 8, EYE[1]]], [[560, 590], [EYE[0] + 4, EYE[1] + 6]]].map(p => lwRayPath(roomFx, p, { width: 6, at: 0.62 }));
  // the wall: non-luminous, it only reflects
  const wallGlow = E('ellipse', { cx: 500, cy: 360, rx: 100, ry: 85, fill: glow('#FFE45C'), opacity: 0 }, wallFx);
  const wallRay = lwRayPath(roomFx, [[968, 168], [500, 360], EYE], { width: 6 });

  /* ---- torch shot: the shadow puppet ---- */
  const Dc = [345, 245];                                   // centre of the shadow on the wall
  const patchCool = glow('#FFFBE0'), patchWarm = glow('#FFE9A8');
  const wallPatch = E('ellipse', { cx: Dc[0], cy: Dc[1], rx: 215, ry: 140, fill: patchCool }, wallFx);
  const cone = E('path', { d: 'M481,540 L160,322 L470,118 Z', fill: '#FFFBE0', opacity: 0 }, wallFx);
  const penG = G(wallFx); lwHandDino(penG); penG.firstChild.firstChild.setAttribute('fill', '#5A4E5E');
  const shadowG = G(wallFx); lwHandDino(shadowG);
  const arm = G(armL);
  const armOut = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 26, 'stroke-linecap': 'round' }, arm);
  const armIn = E('path', { d: '', fill: 'none', stroke: '#B79BE8', 'stroke-width': 19, 'stroke-linecap': 'round' }, arm);
  const handG = G(arm); lwHandDino(handG);
  const handP = handG.firstChild.firstChild; handP.setAttribute('fill', '#B9784E'); handP.setAttribute('stroke', SC_INK); handP.setAttribute('stroke-width', 9);
  const phoneW = G(bedFront); const phone = lwTorch(phoneW); tr(phoneW, 481, 562, 0.5, -27);
  const LED = [482, 545];
  const lampGlow = E('circle', { cx: 1092, cy: 372, r: 90, fill: glow('#FFE9A8'), opacity: 0 }, roomTop);
  // umbra / penumbra labels on the wall
  const umbLab = G(roomTop);
  T(umbLab, 226, 162, 'umbra', { size: 32, weight: 800, anchor: 'end', fill: SC_INK });
  T(umbLab, 226, 192, 'no light', { size: 26, weight: 600, anchor: 'end', fill: SC_INK, font: FB });
  E('path', { d: 'M232,170 L318,240', stroke: SC_INK, 'stroke-width': 3 }, umbLab); E('circle', { cx: 318, cy: 240, r: 6, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, umbLab);
  const penLab = G(roomTop);
  T(penLab, 226, 318, 'penumbra', { size: 32, weight: 800, anchor: 'end', fill: SC_INK });
  T(penLab, 226, 348, 'partly lit', { size: 26, weight: 600, anchor: 'end', fill: SC_INK, font: FB });
  E('path', { d: 'M232,316 L248,278', stroke: SC_INK, 'stroke-width': 3 }, penLab); E('circle', { cx: 248, cy: 278, r: 6, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, penLab);

  /* ================= the material test card ================= */
  const matCard = G(Lfg);
  E('rect', { x: -230, y: -132, width: 460, height: 268, rx: 22, fill: 'rgba(10,27,39,0.93)', stroke: C.line, 'stroke-width': 3 }, matCard);
  const ROWS = [0, 36, 72];
  const mk = (title, sub, col) => { const g = G(matCard); T(g, 0, -86, title, { size: 40, weight: 800, anchor: 'middle', fill: col }); T(g, 0, -48, sub, { size: 28, weight: 600, anchor: 'middle', fill: C.ink }); return g; };
  const glassG = mk('TRANSPARENT', 'light passes straight through', '#9FD8FF');
  E('rect', { x: -15, y: -18, width: 30, height: 108, rx: 3, fill: 'rgba(170,220,255,0.35)', stroke: '#CFE7F5', 'stroke-width': 3 }, glassG);
  T(glassG, -120, 122, 'glass', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const glassRays = ROWS.map(y => lwRayPath(glassG, [[-205, y], [-15, y], [205, y]], { width: 5, head: 14, glow: false }));
  const curtG = mk('TRANSLUCENT', 'lets light through, scattered', '#FFE9A8');
  E('path', { d: 'M-14,-18 Q-4,0 -14,18 Q-4,36 -14,54 Q-4,72 -14,90 L14,90 Q24,72 14,54 Q24,36 14,18 Q24,0 14,-18 Z', fill: '#FFE9A8', opacity: 0.8, stroke: '#E8C76A', 'stroke-width': 3 }, curtG);
  T(curtG, -120, 122, 'curtain', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const curtIn = ROWS.map(y => lwRayPath(curtG, [[-205, y], [-14, y]], { width: 5, head: 14, glow: false }));
  const curtOut = ROWS.map((y, k) => { const g = seeFan(curtG, [-48, -22, 0, 22, 48].map((a, j) => [0, 0, a + (k - 1) * 6 + (j % 2 ? 5 : -4), 56 + ((j + k) % 3) * 12]), LW_OPT.ray, 3.5, 13); g.y = y; return g; });
  const blankG = mk('OPAQUE', 'no light gets through', '#FF8A8A');
  E('rect', { x: -26, y: -20, width: 52, height: 112, rx: 8, fill: '#2E5FB8', stroke: '#1E3E7A', 'stroke-width': 4 }, blankG);
  E('path', { d: 'M-6,10 l3,6 l7,2 l-7,2 l-3,6 l-3,-6 l-7,-2 l7,-2 Z M8,52 l3,6 l7,2 l-7,2 l-3,6 l-3,-6 l-7,-2 l7,-2 Z', fill: '#FFE45C' }, blankG);
  T(blankG, -120, 122, 'blanket', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const blankIn = ROWS.map(y => lwRayPath(blankG, [[-205, y], [-27, y]], { width: 5, head: 14, glow: false }));
  const blankX = ROWS.map(y => { const x = seeX(blankG, 9); tr(x, -42, y); return x; });

  /* ================= chips (room) ================= */
  const jobCard = G(Lfg);
  E('rect', { x: -330, y: -52, width: 660, height: 104, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, 'stroke-width': 3 }, jobCard);
  T(jobCard, 0, -10, 'we see things when light reflects off them', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  T(jobCard, 0, 32, 'and goes INTO our eye', { size: 34, weight: 800, anchor: 'middle', fill: C.energy });
  const sunLab = seeLabel(roomTop, 'Sun', { size: 26, color: C.energy }); tr(sunLab, 968, 236);
  const recvChip = G(Lfg); chip(recvChip, 'eyes only RECEIVE light', { size: 42, fill: C.energy, color: '#3A2A06', stroke: '#FFFFFF', sw: 4 });
  const letterbox = G(Lfg);
  E('rect', { x: -56, y: -38, width: 112, height: 76, rx: 10, fill: '#D93A3A', stroke: SC_INK, 'stroke-width': 4 }, letterbox);
  E('rect', { x: -36, y: -8, width: 72, height: 14, rx: 4, fill: '#2A1A22' }, letterbox);
  const env = E('rect', { x: -22, y: -40, width: 44, height: 30, rx: 3, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2.5 }, letterbox);
  const lbChip = seeLabel(letterbox, 'letterbox', { size: 26 }); tr(lbChip, 0, -72);
  const nonLum = G(Lfg);
  chip(nonLum, 'NON-LUMINOUS', { size: 40, fill: '#3B4A57', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const nlSub = seeLabel(nonLum, 'makes no light of its own', { size: 28 }); tr(nlSub, 0, 64);
  const lumCard = seeLabel(Lfg, 'luminous: Sun, lamp, flame, screen', { size: 28, color: C.energy });
  // the thought bubble
  const bub = G(Lfg), bubIn = G(bub);
  const bubTrail = G(bub);
  E('circle', { cx: 76, cy: 136, r: 9, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubTrail);
  E('circle', { cx: 56, cy: 112, r: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubTrail);
  [[-130, -40], [-70, -82], [10, -92], [90, -78], [140, -30], [128, 40], [50, 80], [-40, 84], [-120, 48]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 46, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, bubIn));
  E('ellipse', { rx: 158, ry: 96, fill: '#FFFFFF' }, bubIn);
  const laserG = G(bubIn);
  const miniKav = cast(laserG, 'kavya', { outfit: 'pyjamas', s: 0.42 }); tr(miniKav, -70, 14, 0.42);
  const lasers = [[-80, 6], [-59, 6]].map(([x, y], i) => {
    const g = G(laserG);
    const gl = E('line', { x1: x, y1: y, x2: x, y2: y, stroke: '#FF3030', 'stroke-width': 14, opacity: 0.3, 'stroke-linecap': 'round' }, g);
    const ln = E('line', { x1: x, y1: y, x2: x, y2: y, stroke: '#FF2020', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    g.set = p => { const ex = lerp(x, 150, p), ey = lerp(y, -44 + i * 30, p); [gl, ln].forEach(l => { attr(l, 'x2', ex); attr(l, 'y2', ey); }); op(g, p > 0.01 ? 1 : 0); };
    return g;
  });
  const pew = T(laserG, 92, 64, 'pew pew!', { size: 28, weight: 800, anchor: 'middle', fill: '#E8282F' });
  const moonThink = G(bubIn);
  const mtm = G(moonThink); tr(mtm, -66, 0); lwMoon(mtm, 40);
  T(moonThink, 62, -6, 'makes', { size: 32, weight: 800, anchor: 'middle', fill: SC_INK });
  T(moonThink, 62, 32, 'light?', { size: 32, weight: 800, anchor: 'middle', fill: SC_INK });
  const burst = E('path', { d: (() => { let d = ''; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; d += `M${(Math.cos(a) * 170).toFixed(0)},${(Math.sin(a) * 110).toFixed(0)} L${(Math.cos(a) * 215).toFixed(0)},${(Math.sin(a) * 140).toFixed(0)} `; } return d; })(), stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, bub);

  /* ================= space: the Moon reflects sunlight ================= */
  const spaceShot = G(Lbg);
  const space = lwSpace(spaceShot);
  const moonS = G(spaceShot); tr(moonS, 640, 205); lwMoon(moonS, 44);
  const shades = G(moonS);
  [-16, 16].forEach(x => E('rect', { x: x - 15, y: -16, width: 30, height: 16, rx: 6, fill: '#121418', stroke: '#FFFFFF', 'stroke-width': 1.5 }, shades));
  E('path', { d: 'M-2,-9 L2,-9', stroke: '#121418', 'stroke-width': 4 }, shades);
  const moonSpk = [spark(spaceShot, 14), spark(spaceShot, 10)];
  const moonRay = lwRayPath(spaceShot, [[253, 342], [601, 220], [1034, 366]], { width: 7 });
  T(spaceShot, 150, 610, 'Sun', { size: 30, weight: 700, anchor: 'middle', fill: C.energyLt });
  T(spaceShot, 1070, 460, 'Earth', { size: 30, weight: 700, anchor: 'middle', fill: '#9FD8FF' });
  T(spaceShot, 640, 132, 'Moon', { size: 30, weight: 700, anchor: 'middle', fill: '#E9EEF5' });
  const moonCard = G(Lfg);
  E('rect', { x: -290, y: -62, width: 580, height: 124, rx: 20, fill: 'rgba(10,27,39,0.92)', stroke: '#E9EEF5', 'stroke-width': 3 }, moonCard);
  T(moonCard, 0, -10, 'the Moon is NON-LUMINOUS', { size: 38, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(moonCard, 0, 38, 'it only reflects sunlight', { size: 30, weight: 600, anchor: 'middle', fill: C.energy });

  /* ================= the shadow diagram card ================= */
  const DX0 = 600, DY = 255, WX = 840, WH = 125, HH = 30;
  const diag = G(Lfg);
  E('rect', { x: 565, y: 112, width: 440, height: 385, rx: 22, fill: 'rgba(10,27,39,0.94)', stroke: C.line, 'stroke-width': 3 }, diag);
  E('line', { x1: WX + 5, y1: DY - WH, x2: WX + 5, y2: DY + WH, stroke: '#E9DCC4', 'stroke-width': 10 }, diag);
  T(diag, WX + 5, DY + WH + 32, 'wall', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // torch version
  const dTorch = G(diag);
  E('path', { d: `M${DX0},${DY} L${WX},${DY - WH + 1} L${WX},${DY + WH - 1} Z`, fill: '#FFF3B0', opacity: 0.2 }, dTorch);
  E('rect', { x: WX, y: DY - WH + 1, width: 12, height: 2 * WH - 2, fill: '#FFE45C' }, dTorch);
  const dWedge = E('path', { d: '', fill: '#000000', opacity: 0.55 }, dTorch);
  const dMark = E('rect', { x: WX, y: 0, width: 12, height: 0, fill: '#141018' }, dTorch);
  const dDash = [0, 1, 2].map(() => E('line', { stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7', opacity: 0.7 }, dTorch));
  const dRays = [0, 1, 2, 3, 4, 5, 6].map(() => lwRayPath(dTorch, [[DX0, DY], [WX, DY]], { width: 4, head: 13, glow: false }));
  E('rect', { x: DX0 - 28, y: DY - 22, width: 24, height: 44, rx: 5, fill: '#2B2F36', stroke: '#8F9CAB', 'stroke-width': 2 }, dTorch);
  E('circle', { cx: DX0, cy: DY, r: 12, fill: glow('#FFFBE0') }, dTorch); E('circle', { cx: DX0, cy: DY, r: 5, fill: '#FFFBE0' }, dTorch);
  T(dTorch, 578, DY + 58, 'torch', { size: 26, weight: 600, fill: C.muted });
  const dShadowLab = T(dTorch, WX + 22, DY + 9, 'shadow', { size: 26, weight: 700, fill: C.ink });
  const dTitle = G(dTorch);
  T(dTitle, 785, 450, 'SHADOW: light is blocked', { size: 32, weight: 800, anchor: 'middle', fill: C.ink });
  T(dTitle, 785, 482, 'light travels in straight lines', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  // lamp version
  const dLamp = G(diag);
  const S1 = [DX0, DY - 20], S2 = [DX0, DY + 20], HX = 720;
  E('path', { d: `M${S1[0]},${S1[1]} L${WX},${DY - WH + 1} L${WX},${DY + WH - 1} L${S2[0]},${S2[1]} Z`, fill: '#FFF3B0', opacity: 0.2 }, dLamp);
  E('rect', { x: WX, y: DY - WH + 1, width: 12, height: 2 * WH - 2, fill: '#FFE45C' }, dLamp);
  const wy = (s, h) => s[1] + (h - s[1]) * (WX - s[0]) / (HX - s[0]);      // where the ray from s past hand point y=h meets the wall
  const uTop = wy(S1, DY - HH), uBot = wy(S2, DY + HH), pTop = wy(S2, DY - HH), pBot = wy(S1, DY + HH);
  E('path', { d: `M${HX},${DY - HH} L${WX},${pTop} L${WX},${uTop} Z M${HX},${DY + HH} L${WX},${uBot} L${WX},${pBot} Z`, fill: '#000000', opacity: 0.28 }, dLamp);
  E('path', { d: `M${HX},${DY - HH} L${WX},${uTop} L${WX},${uBot} L${HX},${DY + HH} Z`, fill: '#000000', opacity: 0.6 }, dLamp);
  E('rect', { x: WX, y: pTop, width: 12, height: uTop - pTop, fill: '#7A6E80' }, dLamp);
  E('rect', { x: WX, y: uBot, width: 12, height: pBot - uBot, fill: '#7A6E80' }, dLamp);
  E('rect', { x: WX, y: uTop, width: 12, height: uBot - uTop, fill: '#141018' }, dLamp);
  const lRays = [[S1, [WX, DY - WH + 1]], [S2, [WX, pTop]], [S1, [WX, uTop]], [S2, [WX, uBot]], [S1, [WX, pBot]], [S2, [WX, DY + WH - 1]]]
    .map(([a, b], i) => lwRayPath(dLamp, [a, b], { width: 3.5, head: 12, glow: false, color: i % 2 ? '#FFD24A' : C.energy }));
  E('ellipse', { cx: DX0, cy: DY, rx: 30, ry: 44, fill: glow('#FFE9A8') }, dLamp);
  E('ellipse', { cx: DX0, cy: DY, rx: 12, ry: 24, fill: '#FFE9A8', stroke: '#FFFFFF', 'stroke-width': 2 }, dLamp);
  T(dLamp, 578, DY + 58, 'lamp', { size: 26, weight: 600, fill: C.muted });
  T(dLamp, WX + 22, (pTop + uTop) / 2 + 9, 'penumbra', { size: 26, weight: 700, fill: '#C9BFD0' });
  T(dLamp, WX + 22, (uTop + uBot) / 2 + 9, 'umbra', { size: 26, weight: 700, fill: C.ink });
  T(dLamp, WX + 22, (uBot + pBot) / 2 + 9, 'penumbra', { size: 26, weight: 700, fill: '#C9BFD0' });
  T(dLamp, 785, 450, 'BIG source: fuzzy shadow', { size: 32, weight: 800, anchor: 'middle', fill: C.ink });
  T(dLamp, 785, 482, 'dark umbra, lighter penumbra', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  // the hand (both versions)
  const dHand = E('rect', { x: -9, y: -HH, width: 18, height: 2 * HH, rx: 8, fill: '#B9784E', stroke: '#FFFFFF', 'stroke-width': 2 }, diag);
  const closerChip = seeLabel(Lfg, 'closer to the source → bigger shadow', { size: 30, color: C.energy });

  /* cut points */
  const cClose0 = end('lasers') + 0.05, cClose1 = at('receive') - 0.06;
  const cSpace0 = at('moonno') - 0.06, cTorch = at('torch') - 0.06;
  const camF = [800, 470];

  return t => {
    const sClose = on(t, cClose0, cClose1), sSpace = on(t, cSpace0, cTorch), sTorch = t >= cTorch ? 1 : 0;
    const roomOn = sSpace ? 0 : 1;
    op(bedShot, roomOn); op(spaceShot, sSpace);
    sunW.upd(t);

    /* ---------- camera ---------- */
    let cm = [1, 0, 0, 0, 0];      // k, fx, fy, sx, sy: the point (fx, fy) of the room lands on (sx, sy) at zoom k
    if (sClose) cm = [2.05 + 0.35 * P(t, cClose0, cClose1 - cClose0, linear), 850, 451, 760, 340];
    else if (!sTorch && t >= mid('neighbour', 0.15) && t < at('job') - 0.06) cm = [1 + 0.32 * P(t, mid('neighbour', 0.15), end('neighbour') + 0.7 - mid('neighbour', 0.15), ease), camF[0], camF[1], camF[0], camF[1]];
    else if (sTorch && t >= at('big') - 0.06 && t < at('lamp') - 0.06) cm = [1 + 0.06 * P(t, at('big'), end('big') + 0.6 - at('big'), linear), 340, 330, 340, 330];
    if (cm[0] !== 1) seeCam(bedShot, cm[0], cm[1], cm[2], cm[3], cm[4]); else bedShot.removeAttribute('transform');

    /* ---------- curtains ---------- */
    room.curtains(lerp(0.08, 0.45, P(t, at('job') + 0.05, 0.5, ease)));
    op(moonW, sTorch ? 1 : P(t, at('moon') - 0.2, 0.5, linear));

    /* ---------- Kavya ---------- */
    const down = P(t, mid('blanket', 0.25), 0.7, ease), out = P(t, at('job') + 0.05, 0.4, easeOut);
    const hidden = down * (1 - out);
    const ky = lerp(KUP, KDOWN, hidden);
    tr(kav, KX, ky, KS);
    seeScaleAbout(lumpG, 320, 548, 1, Math.max(0.001, hidden));
    op(lumpG, hidden > 0.02 ? 1 : 0);
    let km = 'annoyed', kl = 0.6;
    if (sTorch) {
      kl = -0.35;
      if (t < at('roar')) km = 'annoyed';
      else if (t < at('closer')) km = 'deadpan';
      else if (t < at('big')) { km = t < mid('closer', 0.6) ? 'neutral' : 'happy'; kl = -0.3; }
      else if (t < at('lamp')) km = 'deadpan';
      else km = 'neutral';
    } else if (t >= at('job') && t < at('lasers')) { km = t < mid('job', 0.45) ? 'annoyed' : 'neutral'; kl = t < mid('job', 0.45) ? 0.6 : 0.3; }
    else if (t >= at('lasers') && t < at('receive')) { km = 'neutral'; kl = 0.4; }
    else if (t >= at('receive') && t < at('wall')) { km = 'annoyed'; kl = 0.7; }
    else if (t >= at('wall') && t < at('moon')) { km = 'neutral'; kl = -0.5; }
    else if (t >= at('moon')) { km = 'happy'; kl = 0.85; }
    kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: km, look: kl, still: hidden > 0.5 });

    /* ---------- Ray ---------- */
    let rx = 850, ry = 515, rs = 0.8, rr = 0, ro = 1, rm = 'deadpan', rl = 0;
    if (sTorch) {
      rx = 1085; ry = 548; rs = 0.78;
      if (t < at('shadow')) rl = -0.8;
      else if (t < at('closer')) { rm = 'neutral'; rl = t < mid('shadow', 0.5) ? 0 : -0.5; }
      else if (t < at('lamp')) rl = -0.8;
      else { rm = 'neutral'; rl = -0.6; }
    } else {
      const ent = P(t, at('window') + 0.1, 0.9, easeOut);
      rx = lerp(925, 850, ent); ry = lerp(255, 515, ent); rs = lerp(0.25, 0.8, ent); ro = clamp(P(t, at('window') + 0.05, 0.3, linear));
      if (t < at('curtain')) { rm = t < at('window') + 1.4 ? 'shock' : 'deadpan'; rl = -0.3; }
      else if (t < at('blanket')) { rm = 'annoyed'; rl = 0; rr = t > mid('curtain', 0.72) ? 4 * Math.sin((t - mid('curtain', 0.72)) * 14) * (1 - P(t, mid('curtain', 0.72) + 0.5, 0.4, linear)) : 0; }
      else if (t < at('neighbour')) { rm = 'deadpan'; rl = -0.8; }
      else if (t < at('job') - 0.06) { rl = t < mid('neighbour', 0.35) ? -0.8 : 0; rr = -8 * win(t, mid('neighbour', 0.3), end('neighbour') + 0.1, 0.25); }
      else if (t < at('lasers')) { rm = 'neutral'; rl = -0.5; }
      else if (t < cClose0) { rm = 'deadpan'; rl = -0.8; }
      else if (t < cClose1) { rm = 'deadpan'; rl = 0; }
      else if (t < at('wall')) { rm = t > mid('receive', 0.75) ? 'smug' : 'deadpan'; rl = -0.7; }
      else if (t < at('moon')) { rm = 'neutral'; rl = -0.6; }
      else { rm = 'deadpan'; rl = -0.8; }
    }
    if (sSpace) { rx = 1010; ry = 632; rs = 0.55; rr = 0; ro = 1; rm = t > mid('moonno', 0.6) ? 'smug' : 'neutral'; rl = -0.7; }
    else { rx = cm[3] + cm[0] * (rx - cm[1]); ry = cm[4] + cm[0] * (ry - cm[2]); rs *= cm[0]; }
    op(rayW, ro); tr(rayW, rx, ry, rs, rr);
    ray.set({ t, talk: scTalk(S, t, 'ray'), mood: rm, look: rl, still: S.reduce });

    /* ---------- the material test card ---------- */
    const matOn = !sTorch && t < at('neighbour') - 0.06;
    if (matOn) {
      const bump = t < at('curtain') ? 0 : t < at('blanket') ? at('curtain') : at('blanket');
      const p = P(t, mid('window', 0.42), 0.45, pop), b = bump ? 1 + 0.06 * Math.sin(P(t, bump, 0.3, linear) * Math.PI) : 1;
      op(matCard, clamp(p * 2.5)); tr(matCard, 560, 238, Math.max(0.01, (0.6 + 0.4 * p) * b));
      const kG = t < at('curtain') - 0.06 ? 0 : t < at('blanket') - 0.06 ? 1 : 2;
      op(glassG, kG === 0 ? 1 : 0); op(curtG, kG === 1 ? 1 : 0); op(blankG, kG === 2 ? 1 : 0);
      glassRays.forEach((r, i) => r.set(P(t, mid('window', 0.55) + i * 0.12, 0.9, linear)));
      curtIn.forEach((r, i) => r.set(P(t, at('curtain') + 0.15 + i * 0.1, 0.5, linear)));
      curtOut.forEach((g, i) => { const q = P(t, at('curtain') + 0.6 + i * 0.1, 0.45, easeOut); op(g, q > 0.02 ? 1 : 0); tr(g, 20, g.y, Math.max(0.01, q)); });
      blankIn.forEach((r, i) => r.set(P(t, mid('blanket', 0.5) + i * 0.1, 0.5, linear)));
      blankX.forEach((x, i) => { const q = P(t, mid('blanket', 0.5) + 0.5 + i * 0.1, 0.35, pop); op(x, clamp(q * 3)); tr(x, -42, ROWS[i], Math.max(0.01, q)); });
    } else op(matCard, 0);
    // translucent curtains glow, light scatters off them
    const cg = !sTorch ? win(t, at('curtain') + 0.1, at('blanket') - 0.1, 0.3) : 0;
    attr(curtGlow, 'opacity', cg * (0.5 + 0.12 * Math.sin(t * 5)));
    op(curtGlow, cg);
    const sp = P(t, at('curtain') + 0.5, 0.5, easeOut); op(scatG, cg * sp);

    /* ---------- neighbour: the parcel ---------- */
    const nOn = !sTorch && t >= at('neighbour') - 0.06 && t < at('job') - 0.06;
    if (nOn) {
      const pp = P(t, mid('neighbour', 0.35), 0.45, easeOut);
      op(parcel, clamp(pp * 4)); tr(parcel, lerp(800, 688, pp), lerp(560, 576, pp) - 40 * Math.sin(pp * Math.PI));
      popIn(sorry, t, end('neighbour') + 0.05, 600, 486, 1, -4);
    } else { op(parcel, 0); op(sorry, 0); }

    /* ---------- job: the delivery route ---------- */
    const jOn = !sTorch && t >= at('job') - 0.06 && t < at('lasers') + 0.6;
    const jFade = jOn ? 1 - P(t, at('lasers') + 0.1, 0.4, linear) : 0;
    op(route, jFade); route.set(P(t, mid('job', 0.12), 1.6, linear));
    op(posterGlow, jFade * P(t, mid('job', 0.12) + 0.8, 0.3, linear));
    op(sunLab, (jOn ? jFade * P(t, mid('job', 0.1), 0.3, linear) : 0));
    if (jOn && t < at('lasers')) popIn(jobCard, t, mid('job', 0.5), 640, 680, 1); else op(jobCard, 0);

    /* ---------- receive ---------- */
    const rOn = !sTorch && t >= cClose1 && t < at('wall') - 0.06;
    rcv.forEach((r, i) => { op(r, rOn); r.set(P(t, at('receive') + 0.1 + i * 0.35, 0.7, linear)); });
    if (rOn) {
      popIn(recvChip, t, mid('receive', 0.25), 840, 138, 1);
      const lp = P(t, mid('receive', 0.74), 0.45, pop); op(letterbox, clamp(lp * 2.5)); tr(letterbox, 165, 440, Math.max(0.01, 0.6 + 0.4 * lp));
      const ep = P(t, mid('receive', 0.82), 0.6, ease); attr(env, 'y', lerp(-70, -12, ep)); op(env, 1 - P(t, mid('receive', 0.82) + 0.55, 0.15, linear));
    } else { op(recvChip, 0); op(letterbox, 0); }
    const ringOn = (jOn && t > mid('job', 0.5)) || rOn;
    op(eyeRing, ringOn ? (jOn ? jFade : 1) * (0.6 + 0.4 * Math.sin(t * 6)) : 0);

    /* ---------- wall: non-luminous ---------- */
    const wOn = !sTorch && t >= at('wall') - 0.06 && t < at('moon') - 0.06;
    op(wallRay, wOn); wallRay.set(P(t, at('wall') + 0.1, 1.4, linear));
    op(wallGlow, wOn ? P(t, at('wall') + 0.7, 0.3, linear) * (0.75 + 0.25 * Math.sin(t * 5)) : 0);
    if (wOn) { popIn(nonLum, t, mid('wall', 0.45), 350, 160, 1); popIn(lumCard, t, mid('wall', 0.72), 790, 690, 1); } else { op(nonLum, 0); op(lumCard, 0); }

    /* ---------- thought bubble: lasers, then the Moon ---------- */
    const bLas = t >= at('lasers') && t < cClose1, bMoon = !sTorch && !sSpace && t >= mid('moon', 0.3);
    if (bLas || bMoon) {
      const t0 = bLas ? at('lasers') + 0.15 : mid('moon', 0.3);
      const popT = mid('no', 0.55);
      const gone = bLas ? P(t, popT, 0.18, linear) : 0;
      const p = P(t, t0, 0.4, pop);
      op(bub, clamp(p * 2.5) * (1 - gone)); tr(bub, 300, 247, Math.max(0.01, 0.92 * (0.6 + 0.4 * p) * (1 + 0.3 * gone)));
      op(bubTrail, sClose ? 0 : 1);
      op(laserG, bLas ? 1 : 0); op(moonThink, bMoon ? 1 : 0);
      if (bLas) {
        miniKav.set({ t, mood: 'happy', look: 0.5 });
        lasers.forEach((l, i) => l.set(P(t, mid('lasers', 0.55) + i * 0.08, 0.35, easeOut)));
        op(pew, P(t, mid('lasers', 0.7), 0.2, linear));
      }
      op(burst, bLas ? win(t, popT, popT + 0.35, 0.08) : 0);
    } else op(bub, 0);

    /* ---------- space: the Moon only reflects ---------- */
    if (sSpace) {
      space.upd(t);
      moonRay.set(P(t, at('moonno') + 0.2, 1.6, linear));
      const cr = P(t, mid('moonno', 0.62), 0.35, pop);
      op(shades, clamp(cr * 3)); tr(shades, 0, lerp(-50, 0, clamp(cr)));
      moonSpk.forEach((s, i) => { op(s, cr > 0.5 ? 1 : 0); s.upd(t); tr(s, 640 + (i ? -58 : 60), 205 + (i ? 30 : -40), 1); });
      popIn(moonCard, t, mid('moonno', 0.3), 560, 636, 1);
    } else op(moonCard, 0);

    /* ---------- torch shot: shadows ---------- */
    op(phoneW, sTorch); op(arm, 0); op(shadowG, 0); op(penG, 0); op(cone, 0); op(wallPatch, 0); op(lampGlow, 0); op(umbLab, 0); op(penLab, 0);
    if (sTorch) {
      const lampP = P(t, at('lamp') + 0.2, 0.6, ease);
      phone.set(1 - lampP); op(phone.firstChild, 0);
      const torchOn = P(t, mid('torch', 0.35), 0.25, linear) * (1 - lampP);
      attr(cone, 'opacity', 0.26 * torchOn); op(cone, torchOn);
      const wp = Math.max(torchOn, lampP);
      op(wallPatch, wp); wallPatch.setAttribute('fill', lampP > 0.5 ? patchWarm : patchCool);
      attr(lampGlow, 'opacity', 0.9 * lampP); op(lampGlow, lampP);
      // the hand: rises into the beam, moves closer to the torch, back again for the lamp
      const rise = P(t, mid('torch', 0.5), 0.6, easeOut);
      const cl = P(t, mid('closer', 0.15), 1.4, ease) * (1 - P(t, at('lamp') + 0.1, 0.8, ease));
      const f = lerp(0.5, 0.25, cl);
      const hx = lerp(LED[0], Dc[0], f), hy = lerp(LED[1], Dc[1], f) + (1 - rise) * 160;
      const roar = t >= at('roar') && t < at('shadow') ? Math.max(0, Math.sin((t - at('roar')) * 16)) * win(t, at('roar'), end('roar') + 0.2, 0.1)
        : t >= at('big') && t < at('lamp') ? Math.max(0, Math.sin((t - at('big')) * 14)) * win(t, at('big'), end('big') + 0.3, 0.1) : 0;
      const jaw = -10 * roar * AMP;
      op(arm, rise > 0.01 ? 1 : 0);
      tr(handG, hx, hy, 0.26, jaw);
      const sx = 372, sy = 560, wx = hx - 8, wy2 = hy + 16;
      const ad = `M${sx},${sy} Q${((sx + wx) / 2 + 22).toFixed(1)},${((sy + wy2) / 2 + 10).toFixed(1)} ${wx.toFixed(1)},${wy2.toFixed(1)}`;
      attr(armOut, 'd', ad); attr(armIn, 'd', ad);
      // the shadow: scale 0.4 / f (half the distance -> twice the size)
      const shS = 0.4 / f, shOn = rise * (wp > 0.05 ? 1 : 0);
      op(shadowG, shOn); tr(shadowG, Dc[0], Dc[1], shS, jaw);
      op(penG, shOn * lampP * 0.55); tr(penG, Dc[0], Dc[1], shS * 1.18, jaw);
      op(umbLab, P(t, mid('lamp', 0.45), 0.35, linear)); op(penLab, P(t, mid('lamp', 0.62), 0.35, linear));
    }

    /* ---------- the shadow diagram ---------- */
    const dOn = sTorch && t >= at('shadow') - 0.06;
    if (dOn) {
      const dp = P(t, at('shadow') + 0.1, 0.45, pop);
      op(diag, clamp(dp * 2.5)); const ds = Math.max(0.01, 0.6 + 0.4 * dp); seeScaleAbout(diag, 785, 304, ds, ds);
      const lampP = P(t, at('lamp') + 0.3, 0.3, linear);
      op(dTorch, 1 - lampP); op(dLamp, lampP);
      const cl = P(t, mid('closer', 0.15), 1.4, ease) * (1 - P(t, at('lamp') + 0.1, 0.5, ease));
      const hx = lerp(720, 660, cl), dxh = hx - DX0, edge = HH * (WX - DX0) / dxh;
      tr(dHand, hx, DY);
      const targets = [-124, -edge, -edge / 2, 0, edge / 2, edge, 124];
      const draw = P(t, at('shadow') + 0.4, 1.0, linear);
      let k = 0;
      targets.forEach((yt, i) => {
        const yAtHand = yt * (dxh - 9) / (WX - DX0);
        const blocked = Math.abs(yt * dxh / (WX - DX0)) < HH - 0.5;
        const endP = blocked ? [hx - 9, DY + yAtHand] : [WX, DY + yt];
        dRays[i].pts([[DX0, DY], endP]); dRays[i].set(draw);
        if (blocked && k < 3) { const d = dDash[k++]; attr(d, 'x1', hx + 9); attr(d, 'y1', DY + yt * (dxh + 9) / (WX - DX0)); attr(d, 'x2', WX); attr(d, 'y2', DY + yt); op(d, P(t, mid('shadow', 0.45), 0.4, linear)); }
      });
      const sh = P(t, mid('shadow', 0.4), 0.4, linear);
      attr(dWedge, 'd', `M${hx + 9},${DY - HH} L${WX},${(DY - edge).toFixed(1)} L${WX},${(DY + edge).toFixed(1)} L${hx + 9},${DY + HH} Z`); op(dWedge, sh);
      attr(dMark, 'y', DY - edge); attr(dMark, 'height', 2 * edge); op(dMark, sh);
      op(dShadowLab, sh);
      op(dTitle, P(t, mid('shadow', 0.55), 0.35, linear));
      lRays.forEach((r, i) => r.set(P(t, at('lamp') + 0.4 + i * 0.12, 0.6, linear)));
    } else op(diag, 0);
    if (sTorch && t >= at('closer') - 0.06) popIn(closerChip, t, mid('closer', 0.5), 300, 690, 1, 0, 1 - P(t, at('lamp'), 0.3, linear)); else op(closerChip, 0);
  };
});

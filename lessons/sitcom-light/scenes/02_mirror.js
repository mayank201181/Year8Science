/* Scene 2: Mirabel, the plane mirror (reflection).
   Shots (hard sitcom cuts): bathroom, 7:15, Kavya brushing her teeth, Mirabel wakes up (lower third) ->
   Ray's confessional (Mirabel kisses herself, the kiss reflects straight back) -> bathroom: Norman pops up on
   the counter at 90° (lower third, "the normal") -> confessional: Norman turns up at a window, a floor tile and
   a mug, always at 90°, and waves -> the big ray diagram on a mirror with Norman as the normal: an angle measured
   from the mirror gets the buzzer, Norman stamps the right one -> 30° in, 30° out (Mirabel) -> the law of
   reflection, i = r, with the incident ray sweeping 20°..50° -> rough towel (diffuse) vs Mirabel (regular) ->
   top-down: image as far behind as Kavya is in front; dashed lines back to the image; a screen stays blank:
   VIRTUAL -> Mirabel, outraged (push-in) -> Norman: "It's virtual, Mirabel." -> hold on Mirabel -> VUSL card ->
   lateral inversion, right hand / left hand -> Mirabel: not a roller coaster (no upside-down image). */
scene('mirror', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed mir) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const mirCamBg = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const mirPlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const popIn = (el, t, t0, x, y, s, r, f) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const mirLabel = (parent, text, o) => {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  };
  const mirX = (parent, s) => { const g = G(parent); E('circle', { r: s * 1.5, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 5 }, g); E('path', { d: `M${-s * 0.7},${-s * 0.7} L${s * 0.7},${s * 0.7} M${s * 0.7},${-s * 0.7} L${-s * 0.7},${s * 0.7}`, stroke: '#E8424F', 'stroke-width': s * 0.38, 'stroke-linecap': 'round' }, g); return g; };
  // stand a Norman (foot at local (0, 112)) on point p of a surface whose outward normal points normalDeg
  const mirStand = (el, p, normalDeg, s) => { const r = normalDeg + 90, a = 112 * s, rad = r * Math.PI / 180; tr(el, p[0] + a * Math.sin(rad), p[1] - a * Math.cos(rad), s, r); };
  const mirBoard = parent => E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2433', '#173B4E', true) }, parent);
  const mirCard = (parent, w, h, stroke) => E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 20, fill: 'rgba(10,27,39,0.93)', stroke: stroke || C.line, 'stroke-width': 3 }, parent);

  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= A: the bathroom ================= */
  const bathShot = G(Lbg);
  const bath = lwBathroom(bathShot);
  const sunbeam = E('path', { d: 'M1200,0 L1200,140 L700,470 L560,380 Z', fill: '#FFF3B0', opacity: 0.22 }, bathShot);
  const clockChip = mirLabel(Lfg, '7:15 AM', { size: 40, color: '#FF8A8A' });
  const planeChip = G(Lfg);
  chip(planeChip, 'PLANE MIRROR', { size: 40, fill: '#DCE6EE', color: '#2A1A22', stroke: '#FFFFFF', sw: 3 });
  const pcSub = mirLabel(planeChip, '= a flat mirror', { size: 30 }); tr(pcSub, 0, 64);
  const normCard = G(Lfg);
  mirCard(normCard, 330, 156, C.glucose);
  T(normCard, 0, -34, 'THE NORMAL', { size: 40, weight: 800, anchor: 'middle', fill: C.glucose });
  T(normCard, 0, 6, 'an imaginary line', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  T(normCard, 0, 44, 'at 90° to the surface', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const boxFlash = E('path', { d: 'M0,-34 L34,-34 L34,0', fill: 'none', stroke: C.glucose, 'stroke-width': 7, 'stroke-linejoin': 'round' }, Lfg);
  const sparks = G(Lfg); const spk = [0, 1, 2, 3].map(i => spark(sparks, 13, { seed: i }));
  // updown: roller coaster doodle
  const coaster = G(Lfg);
  E('path', { d: 'M-110,60 L-60,60 Q-10,60 -10,0 Q-10,-56 30,-56 Q70,-56 70,-10 Q70,30 30,30 Q-6,30 0,60 L110,60', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14, 'stroke-linecap': 'round' }, coaster);
  E('path', { d: 'M-110,60 L-60,60 Q-10,60 -10,0 Q-10,-56 30,-56 Q70,-56 70,-10 Q70,30 30,30 Q-6,30 0,60 L110,60', fill: 'none', stroke: '#E8424F', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '14 8' }, coaster);
  const cart = G(coaster); E('rect', { x: -18, y: -14, width: 36, height: 20, rx: 6, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 3 }, cart);
  E('circle', { cx: -9, cy: 8, r: 5, fill: SC_INK }, cart); E('circle', { cx: 9, cy: 8, r: 5, fill: SC_INK }, cart);
  const coastX = mirX(coaster, 18); tr(coastX, 100, -40);
  const flipX = mirX(Lfg, 22);
  const notFlip = mirLabel(Lfg, 'a plane mirror does NOT flip you upside down', { size: 30, color: C.energy });

  /* ================= B: Ray's confessional ================= */
  const conf = lwConf(Lbg, 'ray');
  const inset = G(conf);
  E('rect', { x: 690, y: 180, width: 380, height: 300, rx: 18, fill: '#DDEFF2', stroke: '#FFFFFF', 'stroke-width': 6 }, inset);
  let tl = ''; for (let x = 690; x <= 1070; x += 60) tl += `M${x},180 L${x},480 `; for (let y = 240; y < 480; y += 60) tl += `M690,${y} L1070,${y} `;
  E('path', { d: tl, stroke: '#B9D6DC', 'stroke-width': 2 }, inset);
  const heart = G(Lfg);
  E('path', { d: 'M0,14 C-26,-4 -18,-26 0,-14 C18,-26 26,-4 0,14 Z', fill: '#FF3E9A', stroke: SC_INK, 'stroke-width': 2.5 }, heart);
  // thnorm: three surfaces, each with Norman at 90°
  const surfG = G(conf);
  const pane = G(surfG); tr(pane, 800, 250, 1, -30);
  E('rect', { x: -90, y: 0, width: 180, height: 18, rx: 3, fill: 'rgba(170,220,255,0.6)', stroke: '#CFE7F5', 'stroke-width': 3 }, pane);
  const paneL = T(surfG, 900, 318, 'window', { size: 26, weight: 700, anchor: 'middle', fill: '#CFE7F5' });
  const tile = G(surfG); tr(tile, 1020, 420);
  for (let i = 0; i < 4; i++) E('rect', { x: -88 + i * 44, y: 0, width: 44, height: 18, fill: i % 2 ? '#E9E4DA' : '#9AA6B2', stroke: '#5E7487', 'stroke-width': 2 }, tile);
  const tileL = T(surfG, 1020, 470, 'floor tile', { size: 26, weight: 700, anchor: 'middle', fill: '#E9E4DA' });
  const mug = G(surfG); tr(mug, 860, 560);
  E('path', { d: 'M44,-30 Q84,-30 84,4 Q84,36 44,36', fill: 'none', stroke: '#E8E1D2', 'stroke-width': 12 }, mug);
  E('rect', { x: -48, y: -56, width: 96, height: 116, rx: 12, fill: '#FF9466', stroke: SC_INK, 'stroke-width': 4 }, mug);
  E('rect', { x: -48, y: -56, width: 96, height: 14, rx: 6, fill: '#C2453A' }, mug);
  const mugL = T(surfG, 860, 650, 'mug', { size: 26, weight: 700, anchor: 'middle', fill: '#FFC2A8' });
  const surfs = [pane, tile, mug], surfLabs = [paneL, tileL, mugL];
  const STAND = [[[800 + 9 * Math.cos(-120 * Math.PI / 180) + 0, 250 + 9 * Math.sin(-120 * Math.PI / 180)], -120], [[1020, 420], -90], [[812, 540], 180]];

  /* ================= C: the ray diagram (law of reflection) ================= */
  const diagShot = G(Lbg);
  mirBoard(diagShot);
  const pip = E('rect', { x: 36, y: 412, width: 228, height: 228, rx: 20, fill: '#DDEFF2', stroke: '#FFFFFF', 'stroke-width': 5 }, diagShot);
  const O = [600, 600], LEN = 360;
  const pm = lwPlaneMirror(diagShot, 620, { gap: 30 }); tr(pm, O[0], O[1]);
  T(diagShot, 600, 662, 'mirror', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const arcWrong = lwArc(diagShot, O[0], O[1], 180, 240, 110, { color: '#FF6070', text: '{deg}°', size: 30 });
  const arcI = lwArc(diagShot, O[0], O[1], -90, -120, 150, { color: LW_OPT.angI, text: 'i = {deg}°', size: 28, lr: 262 });
  const arcR = lwArc(diagShot, O[0], O[1], -90, -60, 150, { color: LW_OPT.angR, text: 'r = {deg}°', size: 28, lr: 262 });
  const incRay = lwRayPath(diagShot, [lwPt(O[0], O[1], -120, LEN), O], { width: 6 });
  const refRay = lwRayPath(diagShot, [O, lwPt(O[0], O[1], -60, LEN)], { width: 6 });
  const incLab = T(diagShot, 0, 0, 'incident ray', { size: 28, weight: 700, anchor: 'end', fill: C.energyLt });
  const refLab = T(diagShot, 0, 0, 'reflected ray', { size: 28, weight: 700, anchor: 'start', fill: C.energyLt });
  const wrongX = mirX(Lfg, 20);
  const bzzt = T(Lfg, 0, 0, 'BZZT!', { size: 48, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const okTick = G(Lfg); E('circle', { r: 24, fill: '#FFFFFF', stroke: C.good, 'stroke-width': 4 }, okTick); tick(okTick, 13, '#22A06B');
  const lawCard = G(Lfg);
  mirCard(lawCard, 780, 128, C.energy);
  T(lawCard, 0, -16, 'THE LAW OF REFLECTION', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  const lawSub = E('text', { x: 0, y: 34, 'font-size': 30, 'font-weight': 700, fill: C.ink, 'text-anchor': 'middle', 'font-family': FD }, lawCard);
  E('tspan', { fill: LW_OPT.angI }, lawSub).textContent = 'angle of incidence';
  E('tspan', {}, lawSub).textContent = ' = ';
  E('tspan', { fill: LW_OPT.angR }, lawSub).textContent = 'angle of reflection';
  const iEqR = G(Lfg);
  const ier = E('text', { x: 0, y: 0, 'font-size': 92, 'font-weight': 800, 'text-anchor': 'middle', 'font-family': FD, fill: '#FFFFFF' }, iEqR);
  E('tspan', { fill: LW_OPT.angI }, ier).textContent = 'i';
  E('tspan', {}, ier).textContent = ' = ';
  E('tspan', { fill: LW_OPT.angR }, ier).textContent = 'r';

  /* ================= D: towel (diffuse) vs Mirabel (regular) ================= */
  const towelShot = G(Lbg);
  mirBoard(towelShot);
  const RY = 520, LX = 300, RX = 860, DIR = 60, INL = 250, OUTL = 190, XS = [-140, -70, 0, 70, 140];
  const rough = lwRough(towelShot, 400, { n: 9, amp: 20, seed: 11, fill: '#FF9F80', color: '#FFD3C2' }); tr(rough, LX, RY);
  const smoothM = lwPlaneMirror(towelShot, 400, { gap: 30 }); tr(smoothM, RX, RY);
  const din = lwDir(DIR);
  const roughRays = XS.map(x => { const h = rough.reflect(x, DIR, OUTL), p = [LX + h.p[0], RY + h.p[1]]; return lwRayPath(towelShot, [[p[0] - din[0] * INL, p[1] - din[1] * INL], p, [LX + h.b[0], RY + h.b[1]]], { width: 5, head: 14, glow: false }); });
  const midHit = rough.reflect(0, DIR, OUTL);
  const facetN = lwNormal(towelShot, LX + midHit.p[0], RY + midHit.p[1], midHit.normalDeg, 80, { back: 0, square: 12, width: 3 });
  const facetChip = mirLabel(towelShot, 'i = r', { size: 26, color: C.glucose });
  { const q = lwPt(LX + midHit.p[0], RY + midHit.p[1], midHit.normalDeg, 120); tr(facetChip, q[0] + 4, q[1] - 8); }
  const smoothRays = XS.map(x => { const p = [RX + x, RY]; return lwRayPath(towelShot, [[p[0] - din[0] * INL, p[1] - din[1] * INL], p, lwPt(p[0], p[1], -DIR, OUTL)], { width: 5, head: 14, glow: false }); });
  T(towelShot, LX, RY + 76, 'rough towel', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD3C2' });
  T(towelShot, RX, RY + 76, 'smooth mirror', { size: 28, weight: 700, anchor: 'middle', fill: '#DCE6EE' });
  const diffT = G(Lfg); chip(diffT, 'DIFFUSE REFLECTION', { size: 36, fill: '#FF9F80', color: '#2A1A22', stroke: '#FFFFFF', sw: 3 });
  const diffS = mirLabel(Lfg, 'rough surface: rays scatter', { size: 28 });
  const regT = G(Lfg); chip(regT, 'REGULAR REFLECTION', { size: 36, fill: '#DCE6EE', color: '#2A1A22', stroke: '#FFFFFF', sw: 3 });
  const regS = mirLabel(Lfg, 'parallel rays stay parallel', { size: 28 });
  const regS2 = mirLabel(Lfg, '→ a clear image', { size: 28, color: C.energy });

  /* ================= E: top-down: the image behind the mirror ================= */
  const behShot = G(Lbg);
  mirBoard(behShot);
  const MX = 620, OB = [330, 318], OI = [2 * MX - OB[0], OB[1]];
  const vm = lwPlaneMirror(behShot, 480, { gap: 30 }); tr(vm, MX, 400, 1, -90);
  T(behShot, MX, 146, 'mirror', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // the eye that looks into the mirror
  const EK = 2.4, EC = [318, 576], ER = -32;
  const eyeG = G(behShot); lwEyeIcon(eyeG, EK, { right: true }); tr(eyeG, EC[0], EC[1], 1, ER);
  const rot = (v, deg) => { const a = deg * Math.PI / 180; return [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)]; };
  const pupil = rot([20 * EK, 0], ER), E1 = rot([20 * EK, -9 * EK], ER), E2 = rot([20 * EK, 9 * EK], ER);
  const EP1 = [EC[0] + E1[0], EC[1] + E1[1]], EP2 = [EC[0] + E2[0], EC[1] + E2[1]];
  const hitM = e => { const tt = (OI[0] - MX) / (OI[0] - e[0]); return [MX, OI[1] + tt * (e[1] - OI[1])]; };
  const M1 = hitM(EP1), M2 = hitM(EP2);
  const dash1 = E('line', { x1: M1[0], y1: M1[1], x2: OI[0], y2: OI[1], stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '12 9' }, behShot);
  const dash2 = E('line', { x1: M2[0], y1: M2[1], x2: OI[0], y2: OI[1], stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '12 9' }, behShot);
  const dashGlow = E('path', { d: `M${M1[0]},${M1[1]} L${OI[0]},${OI[1]} L${M2[0]},${M2[1]}`, fill: 'none', stroke: C.energy, 'stroke-width': 16, opacity: 0, 'stroke-linejoin': 'round' }, behShot);
  const bRays = [[OB, M1, EP1], [OB, M2, EP2]].map(p => lwRayPath(behShot, p, { width: 4, head: 13 }));
  T(behShot, 160, 596, 'eye', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const dArrows = G(behShot);
  arrow(dArrows, OB[0], 196, MX - 6, 196, { color: '#FFFFFF', width: 4 }); arrow(dArrows, MX - 6, 196, OB[0], 196, { color: '#FFFFFF', width: 4 });
  arrow(dArrows, MX + 6, 196, OI[0], 196, { color: '#FFFFFF', width: 4 }); arrow(dArrows, OI[0], 196, MX + 6, 196, { color: '#FFFFFF', width: 4 });
  T(dArrows, (OB[0] + MX) / 2, 180, 'd', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(dArrows, (OI[0] + MX) / 2, 180, 'd', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const kavLab = T(behShot, OB[0], 440, 'Kavya', { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const imgLab = T(behShot, OI[0], 440, 'image', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const behChip = mirLabel(Lfg, 'as far BEHIND the mirror as she is in FRONT', { size: 30 });
  const screen = G(Lfg);
  E('rect', { x: -6, y: 70, width: 12, height: 110, fill: '#5E7487' }, screen);
  E('rect', { x: -70, y: 172, width: 140, height: 12, rx: 6, fill: '#5E7487' }, screen);
  E('rect', { x: -120, y: -90, width: 240, height: 170, rx: 8, fill: '#F7F9FB', stroke: '#9AA6B2', 'stroke-width': 5 }, screen);
  T(screen, 0, 2, 'blank', { size: 32, weight: 800, anchor: 'middle', fill: '#9AA6B2' });
  T(screen, 0, 40, '(no light here)', { size: 26, weight: 600, anchor: 'middle', fill: '#9AA6B2', font: FB });
  const virtCard = G(Lfg);
  mirCard(virtCard, 760, 112, C.energy);
  T(virtCard, 0, -12, 'VIRTUAL IMAGE', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  T(virtCard, 0, 32, 'no light really gets there: you can\'t catch it on a screen', { size: 26, weight: 600, anchor: 'middle', fill: C.ink });

  /* ================= G: VUSL ================= */
  const vuslShot = G(Lbg);
  mirBoard(vuslShot);
  T(vuslShot, 600, 160, 'A PLANE MIRROR IMAGE IS...', { size: 44, weight: 800, anchor: 'middle', fill: '#DCE6EE' });
  const VROWS = [['V', 'irtual', '#FFE45C'], ['U', 'pright', '#56D69B'], ['S', 'ame size', '#4CC9F0'], ['L', 'aterally inverted', '#FF9466']];
  const vr = VROWS.map(([a, b, col], i) => {
    const row = G(vuslShot), ini = G(Lfg);
    T(ini, 0, 0, a, { size: 64, weight: 800, anchor: 'middle', fill: col });
    T(row, -8, 0, b, { size: 44, weight: 700, fill: '#FFFFFF' });
    return { row, ini, y: 270 + i * 92 };
  });
  const vuslGlow = E('ellipse', { cx: 960, cy: 400, rx: 230, ry: 120, fill: glow('#FFE45C'), opacity: 0 }, vuslShot);

  /* ================= H: lateral inversion ================= */
  const waveShot = G(Lbg);
  mirBoard(waveShot);
  const wm = lwPlaneMirror(waveShot, 520, { gap: 30 }); tr(wm, 600, 420, 1, -90);
  T(waveShot, 600, 712, 'mirror', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const latChip = mirLabel(Lfg, 'laterally inverted: left and right swap', { size: 30, color: C.energy });
  const rLab = G(Lfg); chip(rLab, 'R', { size: 44, fill: '#56D69B', color: '#0A1B27', stroke: '#FFFFFF', sw: 3 });
  const rLabT = mirLabel(rLab, 'her right hand', { size: 26 }); tr(rLabT, 0, 60);
  const lLab = G(Lfg); chip(lLab, 'L', { size: 44, fill: '#FF9466', color: '#0A1B27', stroke: '#FFFFFF', sw: 3 });
  const lLabT = mirLabel(lLab, "the image's left", { size: 26 }); tr(lLabT, 0, 60);

  /* ================= the cast (shared across shots) ================= */
  const mira = cast(Lcast, 'mirabel', {});
  const kavImg = cast(Lcast, 'kavya', { outfit: 'pe' });
  const kav = cast(Lcast, 'kavya', { outfit: 'pe' });
  const brush = G(Lcast);
  E('line', { x1: 0, y1: 0, x2: -66, y2: 14, stroke: '#FF6FB5', 'stroke-width': 9, 'stroke-linecap': 'round' }, brush);
  E('rect', { x: -8, y: -12, width: 20, height: 12, rx: 3, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 2 }, brush);
  const foam = G(Lcast); [[0, 0, 7], [10, 6, 5], [-6, 8, 5]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#FFFFFF', stroke: '#C9D6DF', 'stroke-width': 1.5 }, foam));
  const mkArm = () => {
    const g = G(Lcast);
    const o = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    const i = E('path', { d: '', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
    const hand = G(g);
    E('path', { d: 'M-14,10 L-16,-14 M-5,6 L-5,-22 M5,6 L6,-22 M14,10 L16,-12', stroke: SC_INK, 'stroke-width': 11, 'stroke-linecap': 'round' }, hand);
    E('path', { d: 'M-14,10 L-16,-14 M-5,6 L-5,-22 M5,6 L6,-22 M14,10 L16,-12', stroke: '#B9784E', 'stroke-width': 6, 'stroke-linecap': 'round' }, hand);
    E('circle', { cx: 0, cy: 12, r: 18, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3 }, hand);
    g.set = (sx, sy, hx, hy, wob) => { const d = `M${sx},${sy} Q${((sx + hx) / 2 + (hx < sx ? -16 : 16)).toFixed(1)},${((sy + hy) / 2).toFixed(1)} ${hx.toFixed(1)},${(hy + 14).toFixed(1)}`; attr(o, 'd', d); attr(i, 'd', d); tr(hand, hx, hy, 1, wob); };
    return g;
  };
  const armR = mkArm(), armI = mkArm();
  const norm = cast(Lcast, 'norman', {});
  const mini = norm;          // the same Norman, small, hops between the surfaces in the confessional
  const waveArm = G(mini.firstChild);
  E('line', { x1: 0, y1: 0, x2: 44, y2: -50, stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, waveArm);
  E('circle', { cx: 46, cy: -54, r: 10, fill: '#F2F6FA', stroke: SC_INK, 'stroke-width': 3 }, waveArm);
  const ray = cast(Lcast, 'ray', {});
  ray.firstChild.children[2].remove();        // the seven colours in his coat: never opened in this scene
  const ltMira = lwLower(Lhud, 'mirabel'), ltNorm = lwLower(Lhud, 'norman');

  /* cut points */
  const c = id => at(id) - 0.06;
  const SH = [['A', -1e9], ['B', c('thmira')], ['A', c('norman')], ['B', c('thnorm')], ['C', c('fromme')], ['D', c('towel')], ['E', c('behind')],
    ['A', c('real')], ['G', c('vusl')], ['H', c('wave')], ['A', c('updown')]];
  const shotAt = t => { let s = 'A'; for (const [k, t0] of SH) if (t >= t0) s = k; return s; };
  const theta = t => {     // the incident angle in the law beat: 30 -> 20 -> 50 -> 30
    const t0 = mid('law', 0.5), d = end('law') + 0.25 - t0, u = clamp((t - t0) / d);
    if (u < 0.2) return lerp(30, 20, ease(u / 0.2));
    if (u < 0.65) return lerp(20, 50, ease((u - 0.2) / 0.45));
    return lerp(50, 30, ease((u - 0.65) / 0.35));
  };

  return t => {
    const sh = shotAt(t);
    const sA = sh === 'A', sB = sh === 'B', sC = sh === 'C', sD = sh === 'D', sE = sh === 'E', sG = sh === 'G', sH = sh === 'H';
    op(bathShot, sA); conf.set(sB ? 1 : 0, t); op(diagShot, sC); op(towelShot, sD); op(behShot, sE); op(vuslShot, sG); op(waveShot, sH);
    const hide = [mira, kav, kavImg, brush, foam, armR, armI, norm, ray];
    hide.forEach(e => op(e, 0)); op(waveArm, 0);
    [clockChip, planeChip, normCard, boxFlash, sparks, coaster, flipX, notFlip, heart, wrongX, bzzt, okTick, lawCard, iEqR, diffT, diffS, regT, regS, regS2, behChip, screen, virtCard, latChip, rLab, lLab].forEach(e => op(e, 0));
    vr.forEach(v => op(v.ini, 0));

    /* ---------- A: the bathroom ---------- */
    if (sA) {
      let cam = { k: 1, cx: 600, cy: 375 };
      if (t >= c('real') && t < c('still')) cam = { k: 1 + 0.55 * P(t, at('real') + 0.1, 0.9, easeOut) + 0.08 * P(t, at('real') + 1, end('real') - at('real'), linear), cx: 600, cy: 290 };
      else if (t >= c('still') && t < end('still') + 0.05) cam = { k: 1.55, cx: 380, cy: 420 };
      else if (t >= end('still') + 0.05 && t < c('vusl')) cam = { k: 1.75 + 0.2 * P(t, end('still'), c('vusl') - end('still'), linear), cx: 600, cy: 290 };
      mirCamBg(bathShot, cam.k, cam.cx, cam.cy);
      // Mirabel
      let mm = 'smug', ml = 0, still = false;
      if (t < at('hello')) { mm = 'deadpan'; still = true; }
      else if (t < at('thmira')) { mm = t < at('hello') + 0.5 ? 'shock' : t < mid('hello', 0.55) ? 'happy' : 'smug'; ml = t > mid('hello', 0.6) ? 0.4 : 0; }
      else if (t < at('thnorm')) { mm = t < mid('norman', 0.35) ? 'annoyed' : 'neutral'; ml = -0.9; }
      else if (t < at('vusl')) {
        if (t < mid('real', 0.3)) mm = 'shock';
        else if (t < at('still')) mm = 'annoyed';
        else mm = t < end('still') ? 'annoyed' : 'sad';
        ml = t >= at('still') && t < end('still') + 0.05 ? -0.8 : 0;
        if (t >= end('still') + 0.05) { mm = 'annoyed'; ml = -0.15 * Math.sin(t * 3); }
      } else { mm = 'smug'; ml = t < mid('updown', 0.5) ? 0.5 : 0; }
      op(mira, 1); mirPlace(mira, cam, 600, 300, 1.2);
      mira.set({ t, talk: scTalk(S, t, 'mirabel'), mood: mm, look: ml, still });
      // Kavya, brushing her teeth
      op(kav, 1); mirPlace(kav, cam, 930, 600, 1.05);
      let km = t < at('hello') ? 'annoyed' : 'deadpan', kl = -0.6;
      if (t >= at('norman') - 0.06 && t < at('thnorm')) kl = -1;
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: km, look: kl });
      const brushing = t < at('thmira') || t >= c('updown');
      if (brushing) {
        const wig = Math.sin(t * 18) * 5 * AMP;
        op(brush, 1); mirPlace(brush, cam, 912 + wig, 616, 1, -8);
        op(foam, 1); mirPlace(foam, cam, 914, 612, 1);
      }
      // Norman on the counter
      const nOn = t >= at('norman') - 0.06 && t < at('thnorm') || t >= c('real');
      if (nOn) {
        const np = P(t, at('norman') + 0.05, 0.45, pop);
        op(norm, clamp(np * 2.5));
        const s = 0.9 * (t < at('thnorm') ? Math.max(0.01, np) : 1);
        mirPlace(norm, cam, 380, 560 - 112 * s, s);
        let nm = 'neutral', nl = 0.4;
        if (t < at('thnorm')) { nm = t < mid('norman', 0.5) ? 'neutral' : 'smug'; nl = t < mid('norman', 0.2) ? 0.6 : 0; }
        else if (t < at('still')) { nm = 'deadpan'; nl = 1; }
        else if (t < at('vusl')) { nm = 'deadpan'; nl = t < end('still') ? 0 : 1; }
        else { nm = 'deadpan'; nl = 1; }
        norm.set({ t, talk: scTalk(S, t, 'norman'), mood: nm, look: nl });
      }
      // chips
      if (t < at('hello') - 0.06) popIn(clockChip, t, at('bathroom') + 0.3, 300, 200, 1);
      if (t >= at('hello') - 0.06 && t < c('thmira')) {
        popIn(planeChip, t, mid('hello', 0.45), 300, 190, 1);
        op(sparks, win(t, at('hello') + 0.2, mid('hello', 0.8), 0.2));
        spk.forEach((s, i) => { s.upd(t); const a = i / 4 * TAU + t * 1.5; tr(s, 600 + Math.cos(a) * 170, 300 + Math.sin(a) * 190, 1); });
      }
      if (t >= at('norman') - 0.06 && t < c('thnorm')) {
        popIn(normCard, t, mid('norman', 0.4), 270, 212, 1);
        op(boxFlash, P(t, mid('norman', 0.55), 0.2, linear) * (0.5 + 0.5 * Math.sin(t * 9))); tr(boxFlash, 380, 560);
      }
      if (t >= c('updown')) {
        popIn(coaster, t, mid('updown', 0.45), 240, 200, 1);
        { const u = ((t - mid('updown', 0.45)) * 0.5 * AMP) % 1, a = u * TAU; tr(cart, 30 + 40 * Math.sin(a), -12 - 40 * Math.cos(a) + 2, 1, (a * 180 / Math.PI)); }
        op(kavImg, P(t, mid('updown', 0.6), 0.3, linear)); tr(kavImg, 845, 330, 0.45, 180);
        kavImg.set({ t, mood: 'shock', still: true });
        const xp = P(t, mid('updown', 0.75), 0.35, pop); op(flipX, clamp(xp * 3)); tr(flipX, 900, 372, Math.max(0.01, xp * 0.85));
        popIn(notFlip, t, mid('updown', 0.8), 500, 690, 1);
      }
    }
    ltMira.set(t >= at('hello') && t < c('thmira') ? win(t, at('hello') + 0.3, at('hello') + 3.5, 0.3) : 0);
    ltNorm.set(t >= at('norman') && t < c('thnorm') ? win(t, at('norman') + 0.3, at('norman') + 3.5, 0.3) : 0);

    /* ---------- B: confessionals ---------- */
    if (sB) {
      const isM = t < c('norman');
      let cam = { k: 1, cx: 430, cy: 400 };
      if (isM) cam.k = 1 + 0.08 * P(t, end('thmira'), 0.6, linear);
      else cam.k = 1 + 0.06 * P(t, end('thnorm'), 0.5, linear);
      mirCamBg(conf, cam.k, cam.cx, cam.cy);
      op(ray, 1); mirPlace(ray, cam, 430, 410, 1.4);
      let rl = 0, rm = 'deadpan';
      if (isM) rl = t > mid('thmira', 0.55) && t < end('thmira') + 0.15 ? 0.7 : 0;
      else rl = t > mid('thnorm', 0.8) && t < end('thnorm') ? 0.7 : 0;
      ray.set({ t, talk: scTalk(S, t, 'ray'), mood: rm, look: rl });
      op(inset, isM ? 1 : 0); op(surfG, isM ? 0 : 1);
      if (isM) {
        op(mira, 1); mirPlace(mira, cam, 850, 342, 0.62);
        const kp = P(t, mid('thmira', 0.4), 1.4, linear);
        const back = kp > 0.5;
        mira.set({ t, mood: kp >= 1 ? 'happy' : 'smug', look: kp > 0 && kp < 1 ? 0.9 : 0.2 });
        if (kp > 0) {
          const u = back ? (1 - kp) * 2 : kp * 2, hx = lerp(886, 1036, u), hy = 362 - 34 * Math.sin(u * Math.PI);
          const hs = kp >= 1 ? 1.5 + 0.15 * Math.sin(t * 9) : 1.5;
          op(heart, 1); tr(heart, cam.cx + cam.k * (hx - cam.cx), cam.cy + cam.k * (hy - cam.cy), cam.k * hs);
        }
      } else {
        // Norman hops from surface to surface, always at 90°
        const T3 = [mid('thnorm', 0.1), mid('thnorm', 0.3), mid('thnorm', 0.5)];
        surfs.forEach((s, i) => { op(s, P(t, T3[i] - 0.15, 0.2, linear)); op(surfLabs[i], P(t, T3[i] - 0.15, 0.2, linear)); });
        const k = t < T3[1] ? 0 : t < T3[2] ? 1 : 2;
        const p = P(t, T3[k], 0.35, pop), sc = 0.4 * Math.max(0.01, p);
        op(mini, t >= T3[0] ? clamp(p * 3) : 0);
        mirStand(mini, STAND[k][0], STAND[k][1], sc);
        const waving = t > mid('thnorm', 0.78);
        op(waveArm, waving ? 1 : 0); waveArm.setAttribute('transform', `translate(18 -10) rotate(${(-25 * Math.sin((t - mid('thnorm', 0.78)) * 10)).toFixed(1)})`);
        mini.set({ t, mood: waving ? 'happy' : 'neutral', look: 0 });
      }
    }

    /* ---------- C: the law of reflection ---------- */
    if (sC) {
      const th = t < mid('law', 0.5) ? 30 : theta(t);
      const A = lwPt(O[0], O[1], -90 - th, LEN), B = lwPt(O[0], O[1], -90 + th, LEN);
      incRay.pts([A, O]); refRay.pts([O, B]);
      incRay.set(P(t, at('fromme') + 0.05, 0.5, linear)); refRay.set(P(t, at('fromme') + 0.45, 0.5, linear));
      arcI.to(O[0], O[1], -90, -90 - th); arcR.to(O[0], O[1], -90, -90 + th);
      // wrong: measured from the mirror
      const wOn = t < at('inout');
      op(arcWrong, wOn ? 1 - P(t, mid('fromme', 0.85), 0.3, linear) : 0); arcWrong.set(P(t, mid('fromme', 0.2), 0.5, ease));
      const xp = P(t, mid('fromme', 0.45), 0.3, pop);
      if (wOn) { op(wrongX, clamp(xp * 3) * (1 - P(t, mid('fromme', 0.85), 0.3, linear))); tr(wrongX, 405, 572, Math.max(0.01, xp)); op(bzzt, win(t, mid('fromme', 0.45), mid('fromme', 0.8), 0.1)); tr(bzzt, 370, 480 + 4 * Math.sin(t * 60) * AMP, 1, -8); }
      // right: from the normal (Norman stamps it)
      arcI.set(P(t, mid('fromme', 0.75), 0.35, pop)); op(arcI, t > mid('fromme', 0.75) ? 1 : 0);
      arcR.set(P(t, mid('inout', 0.4), 0.45, ease)); op(arcR, t > mid('inout', 0.4) ? 1 : 0);
      const tp = P(t, mid('fromme', 0.85), 0.35, pop); op(okTick, t < at('law') ? clamp(tp * 3) : 0); tr(okTick, 450, 330, Math.max(0.01, tp));
      // labels follow the rays
      const lp = P(t, mid('law', 0.25), 0.4, linear);
      op(incLab, lp); attr(incLab, 'x', A[0] - 18); attr(incLab, 'y', A[1] + 10);
      op(refLab, P(t, mid('law', 0.4), 0.4, linear)); attr(refLab, 'x', B[0] + 18); attr(refLab, 'y', B[1] + 10);
      if (t >= at('law') - 0.06) { popIn(lawCard, t, at('law') + 0.1, 600, 178, 1); popIn(iEqR, t, mid('law', 0.8), 1060, 470, 1); }
      // Norman, the normal, standing on the mirror
      op(norm, 1); mirStand(norm, O, -90, 0.8);
      let nm = 'neutral', nl = 0;
      if (t < at('inout')) { nm = t < mid('fromme', 0.25) ? 'neutral' : t < mid('fromme', 0.72) ? 'annoyed' : 'smug'; nl = t > mid('fromme', 0.25) && t < mid('fromme', 0.72) ? -0.8 : 0; }
      else if (t < at('law')) { nm = 'neutral'; nl = -1; }
      else nm = 'happy';
      norm.set({ t, talk: scTalk(S, t, 'norman'), mood: nm, look: nl });
      // Mirabel in the corner window
      op(mira, 1); tr(mira, 150, 534, 0.62);
      mira.set({ t, talk: scTalk(S, t, 'mirabel'), mood: t < at('inout') ? 'deadpan' : t < at('law') ? 'smug' : 'happy', look: 0.6 });
    }

    /* ---------- D: towel vs mirror ---------- */
    if (sD) {
      roughRays.forEach((r, i) => r.set(P(t, at('towel') + 0.2 + i * 0.12, 1.3, linear)));
      const fn = P(t, mid('towel', 0.5), 0.4, linear); facetN.set(fn); op(facetN, fn); op(facetChip, P(t, mid('towel', 0.6), 0.3, linear));
      popIn(diffS, t, mid('towel', 0.35), LX, 680, 1);
      popIn(diffT, t, mid('towel', 0.78), LX, 190, 1);
      const sOn = t >= at('smooth') - 0.06;
      smoothRays.forEach((r, i) => { op(r, sOn ? 1 : 0); r.set(P(t, at('smooth') + 0.1 + i * 0.1, 1.2, linear)); });
      if (sOn) { popIn(regT, t, mid('smooth', 0.15), RX, 190, 1); popIn(regS, t, mid('smooth', 0.4), RX, 668, 1); popIn(regS2, t, mid('smooth', 0.62), RX, 724 - 8, 1); }
      op(mira, 1); tr(mira, 1110, 330, 0.42);
      mira.set({ t, talk: scTalk(S, t, 'mirabel'), mood: sOn ? 'smug' : 'annoyed', look: sOn ? 0 : -1 });
    }

    /* ---------- E: behind the mirror, virtual ---------- */
    if (sE) {
      const bp = P(t, at('behind') + 0.1, 0.5, linear);
      op(kav, 1); tr(kav, OB[0], OB[1] + 18, 0.55);
      kav.set({ t, mood: 'neutral', look: 0.8 });
      op(kavImg, 0.45 * P(t, mid('behind', 0.2), 0.5, linear)); tr(kavImg, OI[0], OI[1] + 18, '-0.55 0.55');
      kavImg.set({ t, mood: 'neutral', look: 0.8 });
      bRays.forEach((r, i) => r.set(P(t, mid('behind', 0.1) + i * 0.25, 1.1, linear)));
      const dp = P(t, mid('behind', 0.55), 0.6, linear);
      [dash1, dash2].forEach(d => { attr(d, 'x2', lerp(MX, OI[0], dp)); op(d, dp > 0.01 ? 1 : 0); });
      attr(dash1, 'y2', lerp(M1[1], OI[1], dp)); attr(dash2, 'y2', lerp(M2[1], OI[1], dp));
      op(dArrows, P(t, mid('behind', 0.45), 0.4, linear)); op(kavLab, bp); op(imgLab, P(t, mid('behind', 0.3), 0.4, linear) * (1 - P(t, mid('virtual', 0.45), 0.2, linear)));
      const vOn = t >= at('virtual') - 0.06;
      attr(dashGlow, 'opacity', vOn ? 0.25 * P(t, at('virtual') + 0.2, 0.3, linear) * (0.6 + 0.4 * Math.sin(t * 6)) : 0);
      if (!vOn) popIn(behChip, t, mid('behind', 0.6), 600, 700, 1);
      else {
        const sp = P(t, mid('virtual', 0.45), 0.6, easeOut);
        op(screen, clamp(sp * 3)); tr(screen, OI[0], lerp(-200, OI[1] + 6, sp));
        popIn(virtCard, t, mid('virtual', 0.25), 600, 690, 1);
        op(norm, 1); tr(norm, 1112, 486, 0.5);
        norm.set({ t, talk: scTalk(S, t, 'norman'), mood: 'deadpan', look: -0.8 });
      }
    }

    /* ---------- G: VUSL ---------- */
    if (sG) {
      const big = P(t, mid('vusl', 0.84), 0.7, ease);
      vr.forEach((v, i) => {
        const t0 = mid('vusl', [0.3, 0.44, 0.54, 0.66][i]), p = P(t, t0, 0.45, pop);
        op(v.row, clamp(p * 2.5) * (1 - 0.45 * big)); tr(v.row, 300, v.y, 1);
        const bx = 790 + i * 112, x = lerp(262, bx, big), y = lerp(v.y, 450, big), s = lerp(1, 2.1, big);
        op(v.ini, clamp(p * 2.5)); tr(v.ini, x, y, Math.max(0.01, s * (0.6 + 0.4 * p)));
      });
      op(vuslGlow, big);
    }

    /* ---------- H: lateral inversion ---------- */
    if (sH) {
      const raise = P(t, at('wave') + 0.3, 0.5, easeOut);
      op(kav, 1); tr(kav, 320, 500, 0.9);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < mid('wave', 0.55) ? 'happy' : 'neutral', look: 0.6 });
      op(kavImg, P(t, at('wave') + 0.1, 0.3, linear) * 0.9); tr(kavImg, 880, 500, '-0.9 0.9');
      kavImg.set({ t, mood: t < mid('wave', 0.55) ? 'happy' : 'neutral', look: 0.6 });
      const wob = 14 * Math.sin(t * 8) * AMP;
      const hy = lerp(560, 330, raise);
      op(armR, raise > 0.01 ? 1 : 0); armR.set(268, 562, 205, hy, wob);
      op(armI, raise > 0.01 ? clamp(P(t, at('wave') + 0.1, 0.3, linear)) : 0); armI.set(932, 562, 995, hy, -wob);
      popIn(rLab, t, mid('wave', 0.3), 150, 250, 1);
      popIn(lLab, t, mid('wave', 0.62), 1060, 250, 1);
      popIn(latChip, t, mid('wave', 0.85), 600, 140, 1);
    }
  };
});

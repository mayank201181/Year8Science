/* Chapter 2: Sound travels as a wave.
   A loudspeaker, a field of air particles (5 x 25) and an ear. The cone knocks once and the nudge is
   passed column to column -> the cone keeps vibrating: a train of compressions, the sound wave
   -> the medium (solid, liquid, gas panels; a cup-and-string telephone) -> one yellow particle only
   jiggles about its rest mark and ends where it started (showpiece) -> singer to listener: energy
   travels, no air flows -> longitudinal: vibration and travel are parallel -> the field pauses:
   compressions and rarefactions, which then ride outward -> a line of people passes a lean along
   -> try it at home: a baking tray makes rice jump on cling film.
   One cone-displacement history drives every air particle: u(x, t) = cone(W(t) - (x - XS) / V),
   with W(t) the wave clock (it pauses during "comp"). */
scene('wave', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.35 : 1;
  const f1 = v => (+v).toFixed(1);
  const SKIN = '#E8B48E', SKIN_DK = '#B9825A', SKIN_LT = '#F7D9C2';

  /* ---------- local art ---------- */
  // the shared loudspeaker look: dark box, grey cone facing right; g.set(dx) moves the cone in and out
  function speaker(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, k);
    const cone = G(k);
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, cone);
    g.set = dx => tr(cone, dx, 0);
    return g;
  }
  // an ear seen from the side, opening to the left; about 90 x 130, centred; g.halo glows
  function ear(parent) {
    const g = G(parent);
    g.halo = E('circle', { cx: -6, cy: 0, r: 92, fill: glow(C.energy) }, g);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, g);
    return g;
  }
  const airBall = () => ball(C.air, '#4E8FB8');
  // a bracket over [x - w/2, x + w/2]; opening down (dir 1, above the field) or up (dir -1, below it)
  function bracket(parent, w, color, dir) {
    return E('path', { d: `M${-w / 2},${dir * 12} L${-w / 2},0 L${w / 2},0 L${w / 2},${dir * 12}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }

  /* ---------- the wave model ---------- */
  const SPX = 118, FY = 400, SPS = 1.5;
  const XS = SPX + 44 * SPS;                       // the cone's face at rest: the source
  const COLS = 25, ROWS = 5, SP = 34, X0 = 214, A = 10, CA = 12, V = 150, WL = 8 * SP, OM = TAU * V / WL, PER = WL / V;
  const XEAR = 1110;
  const tK = mid('knock', 0.62);                   // the single knock
  const tOn = mid('pass', 0.48);                   // the cone keeps vibrating
  const YC = 12, YR = 4, XY = X0 + YC * SP;        // the yellow particle: column 12, bottom row
  const tOff = mid('one', 0.84) - (XY - XS) / V;   // the train's tail passes it as "it ends up where it started"
  const P0 = mid('comp', 0.06), P1 = mid('comp', 0.8), PR = 0.5;                          // the pause
  const WP = P0 + PR / 2;                          // the wave clock while paused
  const XC = 400;                                  // where a compression sits during the pause
  const n2 = Math.floor(((WP - (at('energy') - 0.1)) * V - (XC - XS)) / WL);
  const tOn2 = WP - (XC - XS + n2 * WL) / V;       // the restart (while the field is hidden)
  function W(t) {
    if (t <= P0) return t;
    if (t <= P0 + PR) return t - (t - P0) * (t - P0) / (2 * PR);
    if (t <= P1) return WP;
    if (t <= P1 + PR) { const q = t - P1; return WP + q * q / (2 * PR); }
    return t - (P1 - P0);
  }
  // cone displacement history (px, + = forward) and how strongly it is vibrating (0..1)
  function cone(tau) {
    let c = 0;
    if (tau > tK && tau < tK + 0.6) c += CA * Math.pow(Math.sin(Math.PI * (tau - tK) / 0.6), 2);
    if (tau > tOn && tau < tOff) c += CA * Math.sin(OM * (tau - tOn)) * clamp((tau - tOn) / 0.4) * clamp((tOff - tau) / 0.3);
    if (tau > tOn2) c += CA * Math.sin(OM * (tau - tOn2)) * clamp((tau - tOn2) / 0.4);
    return c;
  }
  const active = tau => (tau > tK && tau < tK + 0.6) || (tau > tOn && tau < tOff) || tau > tOn2 ? 1 : 0;
  const disp = (x, w) => (A / CA) * cone(w - (x - XS) / V);

  /* ---------- the field ---------- */
  const field = G(root);
  const band = E('ellipse', { cx: 0, cy: FY, rx: 34, ry: 112, fill: glow(C.energy) }, field);
  const fBands = G(field);
  const cBands = [0, 1].map(() => E('rect', { x: -46, y: FY - 92, width: 92, height: 184, rx: 18, fill: C.energy, opacity: 0.12 }, fBands));
  const dots = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const yel = r === YR && c === YC;
    dots.push({ el: E('circle', { cx: X0 + c * SP, cy: FY - 68 + r * 34, r: 9, fill: airBall() }, field), x: X0 + c * SP, yel });
  }
  const yHalo = E('circle', { cx: XY, cy: FY + 68, r: 26, fill: glow(C.energy) }, field);
  field.insertBefore(yHalo, dots[0].el);
  const yTop = E('circle', { cx: XY, cy: FY + 68, r: 9.5, fill: ball(C.energy, '#B59A1C') }, field);
  // the yellow particle's rest mark, its path and its labels
  const yG = G(field);
  const yTrail = E('line', { x1: XY - A, y1: FY + 68, x2: XY + A, y2: FY + 68, stroke: C.energy, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.45 }, yG);
  const yTick = E('line', { x1: XY, y1: FY + 84, x2: XY, y2: FY + 102, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, yG);
  field.insertBefore(yTrail, dots[0].el);
  const yLbl = T(yG, XY, FY + 136, 'rest position', { size: 26, weight: 600, anchor: 'middle', fill: C.energy });
  const yHome = G(yG);
  const yCheck = tick(yHome, 14, C.good); tr(yCheck, XY - 128, FY + 142);
  T(yHome, XY - 106, FY + 152, 'back where it started', { size: 28, weight: 700, fill: C.good });
  const spk = speaker(field, SPS); tr(spk, SPX, FY);
  const earG = ear(field); tr(earG, XEAR, FY);

  /* labels over the field */
  const qG = G(field);
  const qArc = E('path', { d: `M${XS + 30},${FY - 110} Q600,${FY - 250} ${XEAR - 40},${FY - 110}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-dasharray': '12 10', 'stroke-linecap': 'round' }, qG);
  const qMark = T(qG, 600, FY - 196, '?', { size: 76, weight: 700, anchor: 'middle', fill: C.energy });
  const pLbl = labelLine(field, 320, 240, X0 + 2 * SP, FY - 68 - 10, 'particles', { size: 34, fill: C.air });
  const swLbl = T(field, 600, 170, 'sound wave', { size: 52, weight: 700, anchor: 'middle', fill: C.ink });
  const swArrow = G(field);
  const swA = arrow(swArrow, 640, 256, 900, 256, { color: C.energy, width: 7 });
  T(swArrow, 620, 266, 'wave travels', { size: 30, weight: 700, anchor: 'end', fill: C.energy });
  // medium
  const mG = G(field);
  T(mG, 600, 170, 'medium', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  T(mG, 600, 222, 'the material the wave travels through', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const mBr = bracket(mG, COLS * SP + 6, C.energy, 1); tr(mBr, X0 + (COLS - 1) * SP / 2, FY - 92);
  const panels = [['solid', 'solid', 300], ['liquid', 'liquid', 600], ['gas', 'gas', 900]].map(([lbl, st, x], i) => {
    const g = G(field);
    const pb = particleBox(g, 190, 92, { n: st === 'gas' ? 10 : 20, r: 8, color: C.air, dark: '#4E8FB8', seed: 30 + i });
    tr(pb, -95, -46);
    T(g, 0, 92, lbl, { size: 30, weight: 700, anchor: 'middle' });
    return { g, pb, st, x };
  });
  // cup-and-string telephone
  const telG = G(field);
  const TY = 600, CUPL = 250, CUPR = 950;
  const cupD = 'M0,-34 L52,-46 L52,46 L0,34 Z';
  const cupL = G(telG); tr(cupL, CUPL, TY); E('path', { d: cupD, fill: linGrad('#FF8A94', '#C2577A'), stroke: '#FFD0D5', 'stroke-width': 3, 'stroke-linejoin': 'round', transform: 'scale(-1 1)' }, cupL);
  const cupR = G(telG); tr(cupR, CUPR, TY); E('path', { d: cupD, fill: linGrad('#C2577A', '#FF8A94'), stroke: '#FFD0D5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cupR);
  E('line', { x1: CUPL, y1: TY, x2: CUPR, y2: TY, stroke: '#E9DFC4', 'stroke-width': 3 }, telG);
  const beads = [];
  for (let i = 1; i < 24; i++) beads.push({ el: E('circle', { cx: CUPL + i * (CUPR - CUPL) / 24, cy: TY, r: 4.5, fill: '#F4ECD8' }, telG), x: CUPL + i * (CUPR - CUPL) / 24 });
  const telGlow = E('ellipse', { cx: CUPL, cy: TY, rx: 40, ry: 22, fill: glow(C.energy) }, telG);
  const telVoice = G(telG);
  [0, 1, 2].forEach(i => E('path', { d: `M${CUPL - 66 - i * 16},${TY - 18 - i * 6} Q${CUPL - 56 - i * 16},${TY} ${CUPL - 66 - i * 16},${TY + 18 + i * 6}`, fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.9 - i * 0.25 }, telVoice));
  const telEar = ear(telG); tr(telEar, CUPR + 96, TY, 0.55);
  const telLbl = T(telG, 600, TY + 72, 'the tight string is the medium', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  // one particle
  const oChip = chip(field, "doesn't travel with the wave", { size: 30, fill: C.card2, stroke: C.energy });
  tr(oChip, 600, 650);
  const oWave = G(field);
  const oWaveArrow = arrow(oWave, -70, 0, 70, 0, { color: C.ink, width: 6 });
  T(oWave, 0, -22, 'the wave moves on', { size: 28, weight: 700, anchor: 'middle' });
  // longitudinal
  const lG = G(field);
  T(lG, 600, 170, 'longitudinal', { size: 52, weight: 700, anchor: 'middle', fill: C.energy });
  const lVib = G(lG), lV1 = arrow(lVib, XY + 6, FY + 108, XY + 60, FY + 108, { color: C.energy, width: 6 }), lV2 = arrow(lVib, XY - 6, FY + 108, XY - 60, FY + 108, { color: C.energy, width: 6 });
  T(lVib, XY, FY + 152, 'particles vibrate', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const lTrav = G(lG), lT = arrow(lTrav, 300, 256, 900, 256, { color: C.ink, width: 7 });
  T(lTrav, 600, 236, 'wave travels', { size: 30, weight: 700, anchor: 'middle' });
  const lSame = chip(lG, 'same direction', { size: 30, fill: C.card2, stroke: C.energy });
  tr(lSame, 600, 650);
  // compressions and rarefactions
  const cG = G(field);
  const cBr = [0, 1].map(() => bracket(cG, 96, C.energy, 1));
  const rBr = [0, 1].map(() => bracket(cG, 96, C.ink, -1));
  const cLbl = G(cG);
  T(cLbl, 0, -54, 'compression', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  T(cLbl, 0, -20, 'squeezed together', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const rLbl = G(cG);
  T(rLbl, 0, 42, 'rarefaction', { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
  T(rLbl, 0, 76, 'spread out', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cOut = G(cG);
  arrow(cOut, 700, 650, 960, 650, { color: C.muted, width: 6 });
  T(cOut, 680, 660, 'moving out from the source', { size: 28, weight: 600, anchor: 'end', fill: C.muted });

  /* ---------- energy: a singer and a listener ---------- */
  const eG = G(root);
  const EYR = [358, 392, 426], EX0 = 268, ECOLS = 20, EXS = 222;
  const eDots = [];
  EYR.forEach(y => { for (let c = 0; c < ECOLS; c++) eDots.push({ el: E('circle', { cx: EX0 + c * SP, cy: y, r: 9, fill: airBall() }, eG), x: EX0 + c * SP, y }); });
  const eGlow = E('ellipse', { cx: 0, cy: 392, rx: 54, ry: 82, fill: glow(C.energy) }, eG);
  eG.insertBefore(eGlow, eDots[0].el);
  const lisGlow = E('circle', { cx: 1064, cy: 664 - 174 * 1.6, r: 78, fill: glow(C.energy) }, eG);
  const eWrong = G(eG);
  const eWrongChip = chip(eWrong, 'air flows to your ear', { size: 30, fill: C.card2, stroke: C.bad });
  const eStrike = strike(eWrong, -eWrongChip.w / 2 + 10, 0, eWrongChip.w / 2 - 10);
  const eCross = cross(eWrong, 14); tr(eCross, -eWrongChip.w / 2 - 30, 0);
  tr(eWrong, 360, 196);
  const eRight = G(eG);
  const eRightChip = chip(eRight, 'energy travels', { size: 30, fill: C.card2, stroke: C.good });
  const eTick = tick(eRight, 15); tr(eTick, -eRightChip.w / 2 - 30, 0);
  tr(eRight, 860, 196);
  const eNote = T(eG, 600, 540, 'each particle just vibrates in place', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const E_T0 = at('energy') + 0.3;

  /* ---------- a line of eight people; two of them are also the singer and the listener above ---------- */
  const pBack = G(root), crowd = G(root), eTop = G(root), pG = G(root);
  const NPPL = 8, PX0 = 316, PDX = 80, PFY = 622, PS = 1.36;
  const pr = rng(91), shirts = ['#5B8DEF', '#FF8A3D', '#56D69B', '#B48CFF', '#FF5FA2', '#4CC9F0', '#FFC247', '#E8424F'];
  const skins = ['#C98E62', '#E8B48E', '#8D5A3B', '#F2C29C', '#B98256', '#D9A27A', '#7A4A2E', '#E8B48E'];
  const hairs = ['#2B1D14', '#6B4A33', '#1A1210', '#C9A24A', '#3B2A1E', '#2B1D14', '#8A5A2E', '#1A1210'];
  const people = [];
  const prints = E('path', { d: Array.from({ length: NPPL }, (_, i) => { const x = PX0 + i * PDX + 9; return `M${x - 36},${PFY + 9} a36,9 0 1,0 72,0 a36,9 0 1,0 -72,0`; }).join(' '), fill: '#071520', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, pBack);
  const bumpGlow = E('ellipse', { cx: 0, cy: PFY - 150 * PS, rx: 58, ry: 120, fill: glow(C.energy) }, pBack);
  for (let i = 0; i < NPPL; i++) {
    const p = person(crowd, { shirt: shirts[i], skin: skins[i], hair: hairs[i], shorts: pr() < 0.5 ? '#2F4A63' : '#A9BCD4' });
    tr(p, PX0 + i * PDX, PFY, PS);
    people.push(p);
  }
  const singer = people[3], listener = people[2];
  const sMouth = E('ellipse', { cx: 140 + 14 * 1.6, cy: 664 - 168 * 1.6, rx: 5.5, ry: 8, fill: '#5A2A22' }, eTop);
  const notes = [0, 1, 2].map(i => T(eTop, 0, 0, i % 2 ? '♫' : '♪', { size: 34, weight: 700, anchor: 'middle', fill: C.ethanol }));
  const pTitle = T(pG, 600, 170, 'a line of people, shoulder to shoulder', { size: 36, weight: 700, anchor: 'middle' });
  const pShove = G(pG);
  const pShoveA = arrow(pShove, PX0 - 190, PFY - 112 * PS, PX0 - 30, PFY - 112 * PS, { color: C.energy, width: 8 });
  T(pShove, PX0 - 110, PFY - 112 * PS - 30, 'shove!', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const pBump = T(pG, 0, PFY - 252 * PS, 'bump', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const pStay = G(pG);
  T(pStay, 600, PFY + 78, 'everyone stays put', { size: 32, weight: 700, anchor: 'middle', fill: C.good });
  E('path', { d: Array.from({ length: NPPL }, (_, i) => { const x = PX0 + i * PDX + 4, y = PFY + 34; return `M${x - 9},${y} L${x - 2.7},${y + 6.3} L${x + 9},${y - 7.2}`; }).join(' '), fill: 'none', stroke: C.good, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pStay);

  /* ---------- rice on cling film ---------- */
  const rG = G(root);
  const BWX = 830, BWY = 560, TBX = 380, TBY = 424;
  E('rect', { x: 110, y: BWY + 4, width: 980, height: 26, rx: 6, fill: linGrad('#B57B4A', '#7A4E2C', true), stroke: '#D9A06C', 'stroke-width': 2 }, rG);
  // the bowl, its cling film and the rice
  const bowl = G(rG); tr(bowl, BWX, BWY);
  E('path', { d: 'M-150,-126 C-150,-44 -92,0 0,0 C92,0 150,-44 150,-126 Z', fill: linGrad('#E9F2F7', '#7FA6BC', true), stroke: '#FFFFFF', 'stroke-width': 3 }, bowl);
  E('ellipse', { cx: 0, cy: -126, rx: 152, ry: 12, fill: '#1B4457', stroke: '#FFFFFF', 'stroke-width': 3 }, bowl);
  E('rect', { x: -50, y: -6, width: 100, height: 10, rx: 4, fill: '#9DB7C6' }, bowl);
  const film = E('path', { fill: 'rgba(220,240,255,0.28)', stroke: '#EAF6FF', 'stroke-width': 3.5 }, bowl);
  E('path', { d: 'M-156,-128 Q-162,-112 -150,-96 M156,-128 Q162,-112 150,-96', fill: 'none', stroke: '#EAF6FF', 'stroke-width': 3, opacity: 0.8 }, bowl);
  const rr = rng(66), grains = [];
  for (let i = 0; i < 14; i++) grains.push({ el: E('ellipse', { rx: 8.5, ry: 4.5, fill: '#FBF7EC', stroke: '#D9CFB0', 'stroke-width': 1.2 }, bowl), x: -118 + i * 18 + (rr() - 0.5) * 8, rot: (rr() - 0.5) * 120, h: 22 + rr() * 40, per: 0.42 + rr() * 0.22, ph: rr(), fall: rr() * 0.6, spin: (rr() - 0.5) * 900 });
  const filmY = (x, k, t) => -126 - 2 + k * 9 * Math.sin(Math.PI * (x + 150) / 300) * Math.sin(t * 44) + k * 2.5 * Math.sin(x * 0.09 - t * 30);
  // the baking tray, held upright near the bowl (not touching), and a wooden spoon
  const tray = G(rG); tr(tray, TBX, TBY);
  E('path', { d: 'M22,-104 L30,-108 L30,112 L22,116 Z', fill: '#57636F' }, tray);
  E('path', { d: 'M-44,-124 L22,-104 L22,116 L-44,136 Z', fill: linGrad('#DCE6EC', '#7D8C99'), stroke: '#F2F7FA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, tray);
  E('path', { d: 'M-34,-106 L12,-92 L12,104 L-34,118 Z', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, tray);
  E('path', { d: 'M-26,-80 L4,-71 M-26,-40 L4,-32', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, tray);
  E('rect', { x: -24, y: -150, width: 44, height: 42, rx: 14, fill: ball(SKIN, SKIN_DK), stroke: SKIN_LT, 'stroke-width': 3 }, tray);
  E('rect', { x: -20, y: -214, width: 36, height: 70, rx: 10, fill: ball('#5B8DEF', '#2F5DB8') }, tray);
  const SPV = [136, 300];                           // the hand holding the spoon
  const HIT = [TBX - 30, TBY + 4], DH = Math.hypot(HIT[0] - SPV[0], HIT[1] - SPV[1]);
  const spoon = G(rG);
  E('rect', { x: -110, y: -19, width: 80, height: 38, rx: 10, fill: ball('#FF8A3D', '#C25516') }, spoon);
  E('line', { x1: 0, y1: 0, x2: DH - 56, y2: 0, stroke: '#C98A3E', 'stroke-width': 10, 'stroke-linecap': 'round' }, spoon);
  E('ellipse', { cx: DH - 28, cy: 0, rx: 28, ry: 16, fill: '#D9A05A', stroke: '#F0C88A', 'stroke-width': 3 }, spoon);
  E('rect', { x: -40, y: -21, width: 48, height: 42, rx: 14, fill: ball(SKIN, SKIN_DK), stroke: SKIN_LT, 'stroke-width': 3 }, spoon);
  const bangG = G(rG);
  for (let i = 0; i < 5; i++) { const a = -1.1 + i * 0.55; E('line', { x1: HIT[0] - Math.cos(a) * 22, y1: HIT[1] + Math.sin(a) * 22, x2: HIT[0] - Math.cos(a) * 44, y2: HIT[1] + Math.sin(a) * 44, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, bangG); }
  const arcs = [];
  for (let i = 0; i < 10; i++) arcs.push(E('path', { fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round' }, rG));
  const rHome = chip(rG, 'Try it at home!', { size: 32, fill: C.energy, color: C.bg0 });
  tr(rHome, 600, 140);
  const rLbls = [
    labelLine(rG, 1010, 290, BWX + 90, BWY - 132, 'cling film', { size: 30 }),
    labelLine(rG, 690, 250, BWX - 40, BWY - 140, 'rice', { size: 30 }),
    labelLine(rG, 230, 650, TBX, TBY + 100, 'baking tray', { size: 30 }),
  ];
  const gap = G(rG);
  E('line', { x1: TBX + 34, y1: BWY - 30, x2: BWX - 156, y2: BWY - 30, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, gap);
  T(gap, (TBX + 34 + BWX - 156) / 2, BWY - 6, 'not touching', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const rJump = T(rG, 800, 330, 'the rice jumps!', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= update ================= */
  const beat = (t, a, b) => Math.min(P(t, a - 0.15, 0.35, linear), 1 - P(t, b - 0.35, 0.3, linear));
  return t => {
    t = Math.min(t, S.D);
    const w = W(t);
    const Ak = at('knock'), Ap = at('pass'), Am = at('medium'), Ao = at('one'), Ae = at('energy'), Al = at('long'), Ac = at('comp'), Ali = at('line'), Ar = at('rice');

    /* --- the field: visible from knock to energy, and from long to line --- */
    const aF = Math.max(beat(t, Ak, Ae), beat(t, Al, Ali));
    op(field, aF);
    if (aF > 0) {
      spk.set(cone(w));
      dots.forEach(d => attr(d.el, 'cx', d.x + disp(d.x, w)));
      // the ear lights up while the wave reaches it
      const te = w - (XEAR - 50 - XS) / V;
      op(earG.halo, active(te) * (0.45 + 0.4 * Math.abs(Math.sin(OM * (te - tOn) / 2))));
      // the single knock: a glow rides the pulse column to column
      const xp = XS + V * (w - tK - 0.3);
      op(band, t > tK && xp < X0 + COLS * SP ? 0.85 * Math.min(1, (t - tK) * 3) : 0);
      attr(band, 'cx', xp);
      // knock: "how does a vibration reach your ear?", then "particles"
      op(qG, win(t, Ak + 0.1, mid('knock', 0.55), 0.4));
      qArc.setAttribute('stroke-dashoffset', f1(-t * 30));
      pLbl.set(win(t, mid('knock', 0.76), mid('pass', 0.62), 0.4));
      // pass: "sound wave", "wave travels"
      const sw = win(t, mid('pass', 0.74), Am + 0.1, 0.4);
      op(swLbl, sw); op(swArrow, sw); swA.set(P(t, mid('pass', 0.8), 0.8));
      // medium: label, bracket, three panels, then the telephone
      op(mG, win(t, mid('medium', 0.24), Ao + 0.1, 0.4));
      panels.forEach((p, i) => {
        const pp = P(t, mid('medium', [0.38, 0.47, 0.57][i]), 0.5, pop), out = 1 - P(t, mid('medium', 0.7), 0.4, linear);
        op(p.g, clamp(pp * 2) * out); tr(p.g, p.x, 575 + (1 - clamp(pp)) * 20, Math.max(0.01, 0.85 + 0.15 * pp));
        if (pp > 0 && out > 0) p.pb.set(p.st, t, 0.5);
      });
      const tel = win(t, mid('medium', 0.72), Ao + 0.05, 0.4);
      op(telG, tel);
      if (tel > 0) {
        const t0 = mid('medium', 0.76), vS = 330, wl = 120;
        beads.forEach(b => { const tau = t - t0 - (b.x - CUPL) / vS; attr(b.el, 'cx', b.x + (tau > 0 ? 5 * Math.sin(TAU * vS / wl * tau) : 0)); });
        const gx = CUPL + vS * ((t - t0) % 2.4);
        attr(telGlow, 'cx', Math.min(gx, CUPR)); op(telGlow, t > t0 ? 0.9 * (gx < CUPR ? 1 : 0) : 0);
        op(telVoice, 0.5 + 0.5 * wave(t, 0.6));
        op(telEar.halo, t > t0 + (CUPR - CUPL) / vS ? 0.6 : 0);
        op(telLbl, P(t, mid('medium', 0.88), 0.4, linear));
      }
      // one: the yellow particle, its rest mark and path; the wave moves on
      const oOn = win(t, Ao - 0.1, Ae - 0.2, 0.4), lOn = win(t, Al - 0.1, Ac + 0.2, 0.4);
      const yOn = Math.max(oOn, lOn);
      const xYel = XY + disp(XY, w);
      op(yG, yOn); op(yHalo, yOn * 0.9); attr(yHalo, 'cx', xYel); op(yTop, yOn); attr(yTop, 'cx', xYel); if (yOn <= 0) op(yTrail, 0);
      if (yOn > 0) {
        const tauY = w - (XY - XS) / V;
        const seen = oOn > 0 ? P(t, mid('one', 0.18), PER, linear) : 1;
        attr(yTrail, 'x1', XY - A * seen); attr(yTrail, 'x2', XY + A * seen);
        op(yTrail, yOn * (oOn > 0 ? P(t, mid('one', 0.16), 0.3, linear) : 0.8));
        op(yTick, P(t, Ao + 0.3, 0.4, linear)); op(yLbl, oOn * P(t, Ao + 0.5, 0.4, linear) * (1 - P(t, mid('one', 0.82), 0.3, linear)));
        op(yHome, oOn * P(t, mid('one', 0.88), 0.4, linear));
        tr(yCheck, XY - 128, FY + 142, 1); void tauY;
      }
      const ow = win(t, mid('one', 0.5), mid('one', 0.84), 0.3);
      op(oWave, ow);
      if (ow > 0) { const xw = lerp(XY + 60, 960, P(t, mid('one', 0.5), mid('one', 0.84) - mid('one', 0.5), linear)); tr(oWave, xw, FY - 120); }
      const oc = win(t, mid('one', 0.56), Ae - 0.2, 0.4); op(oChip, oc); tr(oChip, 600, 650 + (1 - P(t, mid('one', 0.56), 0.5, easeOut)) * 14);
      // long: "longitudinal", particles vibrate <->, wave travels ->, same direction
      op(lG, win(t, Al + 0.1, Ac, 0.4));
      const pv = P(t, mid('long', 0.4), 0.5); lV1.set(pv); lV2.set(pv); op(lVib, P(t, mid('long', 0.4), 0.3, linear));
      lT.set(P(t, mid('long', 0.82), 0.8)); op(lTrav, P(t, mid('long', 0.8), 0.3, linear));
      const ps = P(t, mid('long', 0.62), 0.5, easeOut); op(lSame, ps);
      // comp: the field pauses; brackets and labels; then they ride outward
      const cOn = win(t, Ac + 0.1, Ali, 0.4);
      op(cG, cOn); op(fBands, cOn);
      if (cOn > 0) {
        const xc = XS + V * (w - tOn2) - n2 * WL;
        const fadeR = x => clamp((1020 - x) / 60) * clamp((x - X0 + 20) / 40);
        const cb = P(t, mid('comp', 0.22), 0.4, linear), rb = P(t, mid('comp', 0.58), 0.4, linear);
        cBr.forEach((b, i) => { const x = xc + i * WL; tr(b, x, FY - 94); op(b, cb * fadeR(x)); });
        cBands.forEach((b, i) => { const x = xc + i * WL; tr(b, x, 0); op(b, cb * fadeR(x) * 0.12); });
        rBr.forEach((b, i) => { const x = xc + WL / 2 + i * WL; tr(b, x, FY + 94); op(b, rb * fadeR(x)); });
        tr(cLbl, xc, FY - 100); op(cLbl, P(t, mid('comp', 0.28), 0.4, linear) * fadeR(xc));
        tr(rLbl, xc + WL / 2, FY + 100); op(rLbl, P(t, mid('comp', 0.64), 0.4, linear) * fadeR(xc + WL / 2));
        op(cOut, P(t, mid('comp', 0.84), 0.4, linear));
      }
    }

    /* --- energy: singer to listener --- */
    const aE = beat(t, Ae, Al), aP = beat(t, Ali, Ar);
    op(eG, aE); op(eTop, aE); op(crowd, Math.max(aE, aP));
    if (aE > 0) {
      people.forEach(p => op(p, p === singer || p === listener ? 1 : 0));
      tr(singer, 140, 664, 1.6); tr(listener, 1064, 664, '-1.6 1.6');
      const sing = t * TAU * 2.2;
      singer.pose({ lean: -3, armL: [30, 60], armR: [48 + 6 * Math.sin(sing) * AMP, 70], legL: [4, -2], legR: [-4, -2] });
      listener.pose({ lean: 2, armL: [6, 10], armR: [-6, 10] });
      attr(sMouth, 'ry', 5 + 3 * Math.abs(Math.sin(sing)) * AMP);
      notes.forEach((n, i) => { const q = ((t - Ae) * 0.45 + i / 3) % 1; tr(n, 196 + q * 40 + 8 * Math.sin(q * 9), 372 - q * 120); op(n, Math.sin(q * Math.PI) * 0.9); });
      const OM2 = TAU * V / WL, front = EXS + V * (t - E_T0);
      eDots.forEach(d => { const tau = t - E_T0 - (d.x - EXS) / V; attr(d.el, 'cx', d.x + (tau > 0 ? A * Math.sin(OM2 * tau) : 0)); });
      attr(eGlow, 'cx', front); op(eGlow, t > E_T0 && front < 1000 ? 0.95 : 0);
      op(lisGlow, P(t, E_T0 + (1000 - EXS) / V, 0.5, linear) * (0.6 + 0.3 * wave(t, PER)));
      const pw = P(t, mid('energy', 0.06), 0.5, easeOut); op(eWrong, pw); tr(eWrong, 360, 196 + (1 - pw) * 14);
      eStrike.set(P(t, mid('energy', 0.36), 0.5)); op(eCross, P(t, mid('energy', 0.4), 0.3, linear));
      op(eNote, P(t, mid('energy', 0.56), 0.4, linear));
      const pr2 = P(t, mid('energy', 0.82), 0.5, pop); op(eRight, clamp(pr2 * 2)); tr(eRight, 860, 196, Math.max(0.01, 0.85 + 0.15 * pr2));
      op(eTick, P(t, mid('energy', 0.9), 0.3, linear));
    }

    /* --- a line of people --- */
    op(pG, aP); op(pBack, aP);
    if (aP > 0) {
      const tS = mid('line', 0.47), DT = 0.24;
      people.forEach((p, i) => {
        op(p, 1); tr(p, PX0 + i * PDX, PFY, PS);
        const u = (t - tS - i * DT) / 0.75;
        const k = u <= 0 || u >= 1 ? 0 : u < 0.3 ? Math.sin(Math.PI / 2 * u / 0.3) : Math.cos(Math.PI / 2 * (u - 0.3) / 0.7);
        const L = 22 * k;
        p.pose({ lean: L, armL: [8 + L * 1.2, 14 + L], armR: [-8 + L * 1.4, 16 + L], legL: [L + 3, -3], legR: [L - 3, -3] });
      });
      op(pTitle, P(t, Ali + 0.1, 0.5, linear));
      const ph = P(t, mid('line', 0.4), 0.4, linear) * (1 - P(t, tS + 0.4, 0.4, linear));
      op(pShove, ph); pShoveA.set(P(t, mid('line', 0.4), tS - mid('line', 0.4)));
      const fi = (t - tS - 0.1) / DT, onB = t > tS && fi < NPPL - 0.4 ? 1 : 0;
      const bx = PX0 + clamp(fi, 0, NPPL - 1) * PDX + 26;
      attr(bumpGlow, 'cx', bx); op(bumpGlow, onB * 0.8);
      attr(pBump, 'x', bx); op(pBump, onB * P(t, tS + 0.2, 0.3, linear));
      const st = P(t, mid('line', 0.86), 0.5, linear);
      op(pStay, st); tr(pStay, 0, (1 - st) * 10);
      prints.setAttribute('stroke', st > 0.5 ? C.good : C.muted);
    }

    /* --- rice on cling film --- */
    const aR = P(t, Ar - 0.15, 0.35, linear);
    op(rG, aR);
    if (aR > 0) {
      op(rHome, P(t, Ar + 0.05, 0.4, linear));
      const pb = P(t, mid('rice', 0.1), 0.6, easeOut); op(bowl, pb); tr(bowl, BWX, BWY + (1 - pb) * 20);
      // bangs: the spoon swings against the tray; each sends arcs to the bowl
      const bangs = [0.5, 0.61, 0.72, 0.83, 0.94].map(f => mid('rice', f));
      const pt = P(t, mid('rice', 0.47), 0.5, easeOut); op(tray, pt); op(spoon, pt);
      let swing = 0, hitK = 0, act = 0;
      bangs.forEach(b => {
        const u = t - b;
        swing = Math.max(swing, u < 0 ? (u > -0.25 ? 1 - Math.pow(-u / 0.25, 2) : 0) : Math.max(0, 1 - u / 0.28));
        if (u > 0) hitK = Math.max(hitK, 1 - u / 0.3);
        const ua = u - 0.85;                                     // when that bang's sound reaches the bowl
        if (ua > 0) act = Math.max(act, Math.exp(-ua / 1.4));
      });
      const angHit = Math.atan2(HIT[1] - SPV[1], HIT[0] - SPV[0]) * 180 / Math.PI;
      tr(spoon, SPV[0], SPV[1], 1, angHit - 28 * (1 - swing));
      op(bangG, clamp(hitK));
      arcs.forEach((a, i) => {
        const b = bangs[i >> 1] + (i % 2) * 0.16, u = (t - b) / 1.25;
        if (u <= 0 || u >= 1) { op(a, 0); return; }
        const r = 30 + u * 400, x0 = TBX + 26, y0 = TBY + 6;
        a.setAttribute('d', `M${f1(x0 + r * Math.cos(-0.42))},${f1(y0 + r * Math.sin(-0.42))} A${f1(r)},${f1(r)} 0 0 1 ${f1(x0 + r * Math.cos(0.42))},${f1(y0 + r * Math.sin(0.42))}`);
        op(a, Math.sin(u * Math.PI) * 0.9);
      });
      // the film vibrates; the rice falls on, then jumps
      const k = act * AMP;
      let d = '';
      for (let i = 0; i <= 24; i++) { const x = -150 + i * 12.5; d += (i ? 'L' : 'M') + f1(x) + ',' + f1(filmY(x, k, t)); }
      film.setAttribute('d', d + ' L150,-118 L-150,-118 Z');
      op(film, P(t, mid('rice', 0.22), 0.5, linear));
      grains.forEach(g => {
        const tf = mid('rice', 0.24) + g.fall, fallP = P(t, tf, 0.45, easeIn);
        const rest = filmY(g.x, k, t) - 4;
        let y = lerp(-300, rest, fallP), rot = g.rot;
        if (k > 0.02) { const q = ((t / g.per) + g.ph) % 1; y = rest - k * g.h * 4 * q * (1 - q); rot = g.rot + g.spin * q * k; }
        tr(g.el, g.x, y, 1, rot); op(g.el, P(t, tf - 0.05, 0.1, linear));
      });
      const lblOut = 1 - P(t, mid('rice', 0.86), 0.35, linear);
      rLbls[0].set(P(t, mid('rice', 0.3), 0.4, linear) * lblOut);
      rLbls[1].set(P(t, mid('rice', 0.2), 0.4, linear) * lblOut);
      rLbls[2].set(P(t, mid('rice', 0.52), 0.4, linear));
      op(gap, P(t, mid('rice', 0.6), 0.4, linear));
      const pj = P(t, mid('rice', 0.9), 0.5, pop); op(rJump, clamp(pj * 2)); rJump.setAttribute('transform', `translate(800 318) scale(${Math.max(0.01, 0.8 + 0.2 * pj).toFixed(3)}) translate(-800 -318)`);
    }
  };
});

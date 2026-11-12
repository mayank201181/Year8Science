/* Scene 3: The squeeze and the acid spa.
   OESOPHAGUS sign drops over the tunnel (Percy's favourite stretch: he literally stretches) -> side view:
   peristalsis, the ring squeezes behind the bolus ("Me.") -> Kavya: gravity? -> cartoon Kavya hanging
   upside down, the bolus still goes UP her oesophagus; DON'T stamp -> STOMACH sign over the acid spa
   (muscular bag, churns, acid) -> Priya rises from the pool (lower third) -> Priya docks a protein chain
   in her square active site: amino acids, "Mine." -> Percy confessional, the ACID SPA neon loses its SPA
   -> Kavya: acid digests? -> microbes drop into the acid and pop; acidic conditions; protease digests
   -> Kavya: digest itself? -> the mucus layer, acid splashes bounce off; new lining every few days
   -> enzymes = biological catalysts: Priya on a conveyor, counter up, Priya unchanged -> Priya
   confessional: not alive, a million proteins, no lunch -> lock and key: protein clicks, starch bounces
   -> Amy tries the chicken... didn't fit -> line map bracket MOUTH (starts) to SMALL INTESTINE
   (finishes) -> Phoebe floating in the acid on a rubber ring. */
scene('stomach', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed stomach) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const stomachCam = (el, k, cx, cy) => el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const stomachPlace = (el, cam, x, y, s, r) => tr(el, cam.cx + cam.k * (x - cam.cx), cam.cy + cam.k * (y - cam.cy), s * cam.k, r);
  const stomachPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const stomachLabel = (parent, text, o) => { o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700 }); };
  function stomachStamp(parent, text, o) {
    o = o || {};
    const size = o.size || 52, col = o.color || C.bad, g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(30,8,12,0.88)', stroke: col, 'stroke-width': 7 }, g);
    E('rect', { x: -w / 2 + 10, y: -h / 2 + 10, width: w - 20, height: h - 20, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 3 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // a wrapper that hides whatever is below a waterline (screen y): g.line(y)
  function stomachWater(parent, id) {
    const cp = E('clipPath', { id }, defs());
    const r = E('rect', { x: -200, y: -1000, width: 1600, height: 3000 }, cp);
    const g = G(parent, { 'clip-path': `url(#${id})` });
    g.line = y => attr(r, 'height', (y === undefined ? 3000 : y + 1000));
    return g;
  }
  function stomachMicrobe(parent) {
    const g = G(parent);
    let sp = '';
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; sp += `M${(Math.cos(a) * 26).toFixed(1)},${(Math.sin(a) * 26).toFixed(1)} L${(Math.cos(a) * 40).toFixed(1)},${(Math.sin(a) * 40).toFixed(1)} `; }
    E('path', { d: sp, stroke: '#2E7A2A', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 30, fill: ball('#9BE36A', '#3E8E2A'), stroke: '#2E6B24', 'stroke-width': 4 }, g);
    E('path', { d: 'M-14,-8 l0,6 M10,-8 l0,6 M-12,12 Q0,4 12,12', fill: 'none', stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function stomachBead(parent, c, dk, s) {   // one protein bead (an amino acid), as in mgChain('protein')
    const g = G(parent); s = s || 1;
    E('rect', { x: -18 * s, y: -18 * s, width: 36 * s, height: 36 * s, rx: 8 * s, fill: ball(c, dk), stroke: dk, 'stroke-width': 3 }, g);
    return g;
  }
  const PCOL = [['#FF8A7A', '#B5372D'], ['#7FD6F7', '#2386B5'], ['#C2EDA2', '#4E9A3A'], ['#C892F0', '#7A3DB0'], ['#FFD27A', '#B57B12']];

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const tunShot = G(Lbg), tunnel = mgTunnel(tunShot);
  const sqShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1A0A12', '#2E1220', true) }, sqShot);
  // a tight shot of Kavya's table at the hawker centre: the CHICKEN RICE stall behind her
  const hawkShot = G(Lbg), hawkWrap = G(hawkShot);
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: '#F2E6CC' }, hawkWrap);
  E('rect', { x: -100, y: -100, width: 1400, height: 190, fill: linGrad('#4A5852', '#647269', true) }, hawkWrap);
  E('rect', { x: 120, y: 110, width: 960, height: 90, rx: 8, fill: '#D7263D', stroke: '#3A2A20', 'stroke-width': 4 }, hawkWrap);
  T(hawkWrap, 600, 172, 'CHICKEN RICE', { size: 54, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  E('rect', { x: 120, y: 200, width: 960, height: 260, fill: '#5A4636' }, hawkWrap);
  E('rect', { x: 150, y: 220, width: 900, height: 170, fill: '#3E2F24' }, hawkWrap);
  E('rect', { x: 120, y: 440, width: 960, height: 90, fill: linGrad('#C9D2D8', '#9AA6AE', true), stroke: '#7D8992', 'stroke-width': 4 }, hawkWrap);
  E('rect', { x: -100, y: 530, width: 1400, height: 320, fill: '#E3D3B0' }, hawkWrap);
  const parkShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6EC1EE', '#D2EEFB', true) }, parkShot);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#6BBF59' }, parkShot);
  E('path', { d: 'M0,600 L1200,600', stroke: '#4E9A3A', 'stroke-width': 6 }, parkShot);
  E('path', { d: 'M230,150 L230,600 M610,150 L610,600', stroke: '#3A4B5C', 'stroke-width': 16, 'stroke-linecap': 'round' }, parkShot);
  E('path', { d: 'M210,150 L630,150', stroke: '#D7263D', 'stroke-width': 14, 'stroke-linecap': 'round' }, parkShot);
  const spaShot = G(Lbg), spaWrap = G(spaShot), spa = mgSpa(spaWrap);
  const spaDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#12040A', opacity: 0.55 }, spaShot);
  const confP = mgConf(Lbg, 'percy');
  const confFillP = confP.firstChild.getAttribute('fill'), confFillQ = linGrad(MG_TINT.priya[0], MG_TINT.priya[1], true);   // one confessional, recoloured for Priya
  const boardShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C1A26', '#14283A', true) }, boardShot);
  let gridD = '';
  for (let x = 0; x <= 1200; x += 60) gridD += `M${x},0 L${x},750 `;
  for (let y = 0; y <= 750; y += 60) gridD += `M0,${y} L1200,${y} `;
  E('path', { d: gridD, stroke: '#1E3A50', 'stroke-width': 1.5 }, boardShot);

  /* ================= cast (one of each, moved between shots) ================= */
  const percy = cast(Lcast, 'percy');
  const kav = cast(Lcast, 'kavya');
  const tableW = G(Lcast); mgTable(tableW, 760);
  const kavBody = scKavyaBody(Lcast);
  const bowl = G(Lcast);
  E('path', { d: 'M-30,-14 Q0,-34 30,-14 Z', fill: '#FBF3DE', stroke: '#D9C79C', 'stroke-width': 3 }, bowl);
  E('path', { d: 'M-34,-14 L34,-14 Q30,18 0,20 Q-30,18 -34,-14 Z', fill: '#FFFFFF', stroke: '#3F5BD9', 'stroke-width': 4 }, bowl);
  const waterQ = stomachWater(Lcast, 'stomachClipQ');
  const priya = cast(waterQ, 'priya');
  const amy = cast(Lcast, 'amy');
  const waterF = stomachWater(Lcast, 'stomachClipF');
  const phoebe = cast(waterF, 'phoebe');
  // things in front of the waterline: ripples round Priya, Phoebe's rubber ring
  const ripQ = G(Lcast);
  E('ellipse', { rx: 150, ry: 24, fill: '#B5E05A', stroke: '#F0FFB8', 'stroke-width': 5 }, ripQ);
  const ringF = G(Lcast);
  E('ellipse', { cx: 0, cy: 0, rx: 150, ry: 30, fill: '#9FCF48', stroke: '#F0FFB8', 'stroke-width': 4 }, ringF);
  E('path', { d: 'M-92,-8 A92,26 0 0 0 92,-8', fill: 'none', stroke: SC_INK, 'stroke-width': 34, 'stroke-linecap': 'round' }, ringF);
  E('path', { d: 'M-92,-8 A92,26 0 0 0 92,-8', fill: 'none', stroke: '#FF5F7E', 'stroke-width': 26, 'stroke-linecap': 'round' }, ringF);
  E('path', { d: 'M-92,-8 A92,26 0 0 0 92,-8', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 26, 'stroke-dasharray': '26 30', 'stroke-dashoffset': 12 }, ringF);
  E('path', { d: 'M-70,6 A80,20 0 0 0 40,14', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.6, 'stroke-linecap': 'round' }, ringF);

  /* ================= A/B: oesophagus platform and tunnel ================= */
  const signW = G(Lfg);
  E('path', { d: 'M-200,-160 L-200,-40 M200,-160 L200,-40', stroke: '#2B3138', 'stroke-width': 6 }, signW);
  const sign = mgSign(signW, 'OESOPHAGUS', 'AL2', 520);
  const bFg = G(Lfg);
  const bolB = mgBolus(bFg, 50);
  const cOes = stomachLabel(bFg, 'oesophagus', { size: 54, fill: MG_LINE, color: '#FFFFFF', stroke: '#FFD0DC', sw: 4 });
  const cOesSub = stomachLabel(bFg, 'the tube down to the stomach', { size: 32, color: '#FFD0DC', stroke: '#FF7FA6' });
  const cFave = stomachLabel(bFg, 'favourite stretch', { size: 30, color: C.energy, stroke: C.energy });

  /* ================= C: peristalsis, side view ================= */
  const cFg = G(Lfg);
  const tubeW = G(cFg); const peri = mgPeriTube(tubeW, 1040); tr(tubeW, 600, 300);
  const sqArrow = G(cFg);
  const sqA = arrow(sqArrow, 0, -158, 0, -104, { color: C.energy, width: 6 });
  const sqLbl = stomachLabel(sqArrow, 'muscle squeezes behind', { size: 30, color: C.energy, stroke: C.energy }); tr(sqLbl, 0, -192);
  const pushA = G(cFg);
  arrow(pushA, 0, 0, 110, 0, { color: '#FFFFFF', width: 7 });
  const cPeri = stomachLabel(cFg, 'peristalsis', { size: 56, fill: MG_LINE, color: '#FFFFFF', stroke: '#FFD0DC', sw: 4 });
  const cPeriSub = stomachLabel(cFg, 'waves of muscle push food along', { size: 30 });
  const cMe = stomachLabel(cFg, '= Percy', { size: 34, color: C.energy, stroke: C.energy });

  /* ================= D: Kavya at the hawker centre ================= */
  const dFg = G(Lfg);
  const qGrav = G(dFg);
  stomachLabel(qGrav, 'gravity?', { size: 48, color: '#FFFFFF', stroke: '#9FD8FF' });
  const gravA = arrow(qGrav, 0, 46, 0, 150, { color: '#9FD8FF', width: 8 });
  const qAcid = G(dFg);
  stomachLabel(qAcid, 'acid digests food?', { size: 40, color: '#D8F7A0', stroke: '#9FCF48' });
  const qSelf = G(dFg);
  stomachLabel(qSelf, 'the stomach digests', { size: 38, color: '#FFD0D6', stroke: C.bad });
  const qSelf2 = stomachLabel(qSelf, 'ITSELF?!', { size: 50, fill: 'rgba(90,20,30,0.92)', color: '#FFD0D6', stroke: C.bad, sw: 4 }); tr(qSelf2, 0, 86);

  /* ================= E: upside down ================= */
  const eFg = G(Lfg);
  const inset = G(eFg); tr(inset, 850, 320);
  E('circle', { r: 180, fill: '#2A0A14', stroke: '#FFFFFF', 'stroke-width': 6 }, inset);
  const insLumen = E('path', { d: '', fill: '#5A1A28' }, inset);
  const insWallL = E('path', { d: '', fill: 'none', stroke: '#F59AAA', 'stroke-width': 14, 'stroke-linecap': 'round' }, inset);
  const insWallR = E('path', { d: '', fill: 'none', stroke: '#F59AAA', 'stroke-width': 14, 'stroke-linecap': 'round' }, inset);
  const insBol = mgBolus(inset, 22);
  T(inset, 0, -128, 'stomach', { size: 28, weight: 800, anchor: 'middle', fill: '#FFD0DC' });
  T(inset, 0, 150, 'mouth', { size: 28, weight: 800, anchor: 'middle', fill: '#FFD0DC' });
  const insUp = arrow(inset, 82, 90, 82, -90, { color: C.energy, width: 7 });
  const cGrav = stomachLabel(eFg, 'works against gravity', { size: 32, color: C.energy, stroke: C.energy });
  const dont = stomachStamp(eFg, "DON'T", { size: 64 });

  /* ================= F/G: the stomach, the acid spa ================= */
  const gFg = G(Lfg);
  const bolG = mgBolus(gFg, 40);
  const splash = G(gFg);
  E('path', { d: 'M-60,0 Q-50,-40 -30,-10 M-20,-4 Q0,-60 20,-4 M30,-10 Q50,-40 60,0', fill: 'none', stroke: '#F0FFB8', 'stroke-width': 6, 'stroke-linecap': 'round' }, splash);
  const gChips = ['muscular bag', 'churns', 'adds acid'].map((s, i) => stomachLabel(gFg, s, { size: 38, color: ['#FFD0DC', '#FFFFFF', '#D8F7A0'][i], stroke: ['#FF7FA6', '#FFFFFF', '#9FCF48'][i] }));
  const ltPriya = scLowerThird(Lhud, ...MG_NAME.priya);
  const cProt = G(gFg);
  stomachLabel(cProt, 'protease', { size: 54, fill: '#5A2A84', color: '#FFFFFF', stroke: '#C892F0', sw: 4 });
  const cProtSub = stomachLabel(cProt, 'an enzyme', { size: 30, color: '#E9D2FF', stroke: '#C892F0' }); tr(cProtSub, 0, 76);

  /* ================= H: protein -> amino acids ================= */
  const hFg = G(Lfg);
  const chainW = G(hFg); const chain = mgChain(chainW, 'protein', 6);
  const tProtein = T(hFg, 430, 300, 'PROTEIN', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  const tAmino = T(hFg, 420, 545, 'amino acids', { size: 40, weight: 800, anchor: 'middle', fill: '#FFD27A' });
  const cJob = stomachLabel(hFg, 'protein → amino acids', { size: 44, fill: '#2A1440', color: '#FFFFFF', stroke: '#C892F0', sw: 4 });
  const mine = G(hFg);
  stomachLabel(mine, 'Mine.', { size: 46, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 4 });
  E('path', { d: 'M-20,30 L-44,62 L6,32 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, mine);
  E('rect', { x: -60, y: 26, width: 80, height: 10, fill: '#FFFFFF' }, mine);

  /* ================= I: Percy confessional, the neon ================= */
  const iFg = G(Lfg);
  const neon = G(iFg);
  E('rect', { x: -220, y: -64, width: 440, height: 128, rx: 24, fill: '#1A0A14', stroke: '#FF6FB5', 'stroke-width': 6 }, neon);
  const nAcid = T(neon, -80, 24, 'ACID', { size: 66, weight: 800, anchor: 'middle', fill: '#FFB3DA' });
  const nSpa = T(neon, 100, 24, 'SPA', { size: 66, weight: 800, anchor: 'middle', fill: '#FFB3DA' });
  const nStrike = strike(neon, 36, 2, 166, C.bad);
  const cItsAcid = stomachLabel(iFg, "it's acid", { size: 40, color: '#D8F7A0', stroke: '#9FCF48' });

  /* ================= G2: acid kills microbes ================= */
  const kFg = G(Lfg);
  const microbes = [0, 1, 2].map(() => { const m = G(kFg); m.body = stomachMicrobe(m); m.x = cross(m, 22); return m; });
  const MIC = [[720, 0.06], [900, 0.2], [800, 0.36]];
  const cKill = stomachLabel(kFg, 'acid kills harmful microbes', { size: 34, color: '#D8F7A0', stroke: '#9FCF48' });
  const cCond = stomachLabel(kFg, 'acidic conditions for protease', { size: 32, color: '#E9D2FF', stroke: '#C892F0' });
  const cDig = G(kFg);
  stomachLabel(cDig, 'protease digests', { size: 38, fill: '#5A2A84', color: '#FFFFFF', stroke: '#C892F0', sw: 4 });
  const digTick = tick(cDig, 18); tr(digTick, 186, 0);

  /* ================= G3: the mucus layer ================= */
  const mFg = G(Lfg);
  const mucGlow = E('path', { d: 'M0,470 Q300,440 600,452 Q900,464 1200,440', fill: 'none', stroke: '#FFF6E0', 'stroke-width': 26, opacity: 0.5, 'stroke-linecap': 'round' }, mFg);
  const drops = [0, 1, 2, 3].map(i => { const d = E('path', { d: 'M0,-14 Q11,2 0,10 Q-11,2 0,-14 Z', fill: '#C8F06A', stroke: '#5E8A1E', 'stroke-width': 2.5 }, mFg); return { d, x: 220 + i * 200, ph: i * 0.29 }; });
  const pings = drops.map(() => E('path', { d: 'M-22,-6 L-34,-16 M0,-10 L0,-26 M22,-6 L34,-16', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, mFg));
  const mucLbl = G(mFg);
  const mucLine = labelLine(mucLbl, 300, 330, 400, 452, '', { line: '#FFF6E0' });
  const cMucus = stomachLabel(mucLbl, 'mucus layer', { size: 44, fill: '#5A4A2A', color: '#FFF6E0', stroke: '#FFF6E0', sw: 4 }); tr(cMucus, 280, 318);
  const cal = G(mFg);
  E('rect', { x: -70, y: -62, width: 140, height: 124, rx: 12, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, cal);
  E('rect', { x: -70, y: -62, width: 140, height: 34, rx: 12, fill: '#D7263D' }, cal);
  E('rect', { x: -70, y: -40, width: 140, height: 12, fill: '#D7263D' }, cal);
  E('path', { d: 'M-40,-72 L-40,-52 M40,-72 L40,-52', stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, cal);
  let cg = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cg += `M${-54 + c * 30},${-14 + r * 24} l20,0 l0,16 l-20,0 Z `;
  E('path', { d: cg, fill: '#EEF2F5', stroke: '#B8C4CE', 'stroke-width': 2 }, cal);
  const calRing = E('circle', { cx: 6, cy: 20, r: 17, fill: 'none', stroke: C.bad, 'stroke-width': 4 }, cal);
  const cLining = stomachLabel(mFg, 'new lining every few days', { size: 30, color: '#FFF6E0', stroke: '#FFF6E0' });

  /* ================= J: enzymes are catalysts (conveyor) ================= */
  const jFg = G(Lfg);
  const jTitle = G(jFg);
  T(jTitle, 0, 0, 'ENZYMES', { size: 60, weight: 800, anchor: 'middle', fill: C.energy, ls: 3 });
  T(jTitle, 0, 56, '= biological catalysts', { size: 40, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const cSpeed = G(jFg); stomachLabel(cSpeed, 'speed up reactions', { size: 34, color: C.good, stroke: C.good }); tr(tick(cSpeed, 14), 186, 0);
  const cUsed = G(jFg); stomachLabel(cUsed, 'NOT used up', { size: 34, color: C.good, stroke: C.good }); tr(tick(cUsed, 14), 130, 0);
  const belt = G(jFg);
  E('rect', { x: 230, y: 522, width: 480, height: 26, rx: 13, fill: '#3A4652', stroke: '#8A9AA6', 'stroke-width': 4 }, belt);
  const beltMarks = E('path', { d: '', stroke: '#8A9AA6', 'stroke-width': 3 }, belt);
  E('path', { d: 'M260,548 L250,600 M680,548 L690,600', stroke: '#5A6B7A', 'stroke-width': 8 }, belt);
  const jProts = [0, 1, 2].map(k => {
    const g = G(jFg), bonds = [E('line', { stroke: '#DCE3E8', 'stroke-width': 6 }, g), E('line', { stroke: '#DCE3E8', 'stroke-width': 6 }, g)];
    const beads = [0, 1, 2].map(i => stomachBead(g, ...PCOL[(k * 2 + i) % 5]));
    return { g, bonds, beads };
  });
  const counter = G(jFg); tr(counter, 1035, 370);
  E('rect', { x: -110, y: -62, width: 220, height: 124, rx: 14, fill: '#0B0C0E', stroke: '#2B3138', 'stroke-width': 6 }, counter);
  T(counter, 0, -24, 'proteins', { size: 26, weight: 700, anchor: 'middle', fill: '#FFD66B' });
  const cntT = T(counter, 0, 40, '0', { size: 54, weight: 800, anchor: 'middle', fill: '#FFB000' });
  const cSame = stomachLabel(jFg, 'same Priya', { size: 30, color: '#E9D2FF', stroke: '#C892F0' });

  /* ================= K: Priya confessional ================= */
  const kqFg = G(Lfg);
  const cAlive = G(kqFg);
  stomachLabel(cAlive, 'NOT alive', { size: 50, fill: 'rgba(90,20,30,0.92)', color: '#FFD0D6', stroke: C.bad, sw: 4 });
  const cAliveSub = stomachLabel(cAlive, 'just molecules', { size: 32, color: '#E9D2FF', stroke: '#C892F0' }); tr(cAliveSub, 0, 78);
  const bigCount = G(kqFg);
  E('rect', { x: -200, y: -60, width: 400, height: 120, rx: 14, fill: '#0B0C0E', stroke: '#2B3138', 'stroke-width': 8 }, bigCount);
  const bigN = T(bigCount, 0, 8, '1 000 000', { size: 56, weight: 800, anchor: 'middle', fill: '#FFB000' });
  T(bigCount, 0, 46, 'proteins today', { size: 28, weight: 700, anchor: 'middle', fill: '#FFD66B' });
  const lunch = G(kqFg);
  E('path', { d: 'M-30,-52 Q0,-82 30,-52', fill: 'none', stroke: SC_INK, 'stroke-width': 8 }, lunch);
  E('rect', { x: -78, y: -54, width: 156, height: 100, rx: 16, fill: '#3F9BE0', stroke: SC_INK, 'stroke-width': 5 }, lunch);
  E('rect', { x: -78, y: -54, width: 156, height: 30, rx: 12, fill: '#2F6FD6', stroke: SC_INK, 'stroke-width': 5 }, lunch);
  const lunchX = cross(lunch, 50); tr(lunchX, 0, -4);
  const cNoLunch = stomachLabel(kqFg, 'no breaks. no lunch.', { size: 30 });

  /* ================= L: lock and key ================= */
  const lFg = G(Lfg);
  const keyBead = stomachBead(lFg, ...PCOL[0], 1.6);
  const keyHex = molGlucose(lFg, 32);
  const keyTick = tick(lFg, 26); const keyX = cross(lFg, 26);
  const actLbl = labelLine(lFg, 470, 250, 668, 410, 'active site', { size: 36, weight: 800, fill: '#E9D2FF', line: '#E9D2FF' });
  const cSpecific = G(lFg);
  stomachLabel(cSpecific, 'specific', { size: 50, fill: '#5A2A84', color: '#FFFFFF', stroke: '#C892F0', sw: 4 });
  const cSpecSub = stomachLabel(cSpecific, 'one enzyme, one kind of molecule', { size: 32 }); tr(cSpecSub, 0, 74);
  const cLock = stomachLabel(lFg, 'like a key in a lock', { size: 32, color: C.energy, stroke: C.energy });

  /* ================= M: Amy tried ================= */
  const nFg = G(Lfg);
  const chickBead = G(nFg);
  stomachBead(chickBead, ...PCOL[3], 1.4);
  const cChick = T(chickBead, 0, -46, 'chicken protein', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const fitX = cross(nFg, 30);
  const cWrong = stomachLabel(nFg, 'wrong shape: no fit', { size: 34, color: '#FFD0D6', stroke: C.bad });

  /* ================= N: not just the stomach ================= */
  const oFg = G(Lfg);
  const map = mgLineMap(oFg); tr(map, 600, 400); map.off.remove(); map.set(2, 0);
  const brk = E('path', { d: 'M120,505 L120,530 L600,530 L600,505', fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, oFg);
  const cStarts = stomachLabel(oFg, 'starts', { size: 34, color: C.good, stroke: C.good });
  const cFin = stomachLabel(oFg, 'finishes', { size: 34, color: C.good, stroke: C.good });
  const cNotJust = stomachLabel(oFg, 'digestion: not just the stomach', { size: 40, fill: '#5A2030', color: '#FFFFFF', stroke: MG_LINE, sw: 4 });
  const notHere = cross(oFg, 18);

  /* ================= G4: Phoebe floats ================= */
  const pFg = G(Lfg);
  const cStill = stomachLabel(pFg, 'fibre: still not digested', { size: 32, color: '#D8F7A0', stroke: '#9FCF48' });

  /* cut points */
  const k6 = id => at(id) - 0.06;
  const cB = -1, cC = k6('waves'), cD = k6('gravity'), cE = k6('upside'), cF = k6('stomach'), cG = cF,
    cH = k6('job'), cI = k6('thpriya'), cJ = k6('acid'), cK = k6('kills'), cL = k6('itself'), cM = k6('mucus'), cN = k6('catalyst'),
    cO = k6('alive'), cP = k6('specific'), cQ = k6('tried'), cR = k6('notjust'), cS = k6('still');

  return t => {
    const sB = on(t, cB, cC), sC = on(t, cC, cD), sD1 = on(t, cD, cE), sE = on(t, cE, cF),
      sG = on(t, cG, cH), sH = on(t, cH, cI), sI = on(t, cI, cJ), sD2 = on(t, cJ, cK), sK = on(t, cK, cL), sD3 = on(t, cL, cM),
      sM = on(t, cM, cN), sJ = on(t, cN, cO), sKq = on(t, cO, cP), sL = on(t, cP, cQ), sN = on(t, cQ, cR), sO = on(t, cR, cS), sP = on(t, cS, 1e9);
    const sD = sD1 || sD2 || sD3;
    [percy, kav, tableW, kavBody, bowl, priya, amy, phoebe, ripQ, ringF].forEach(c => op(c, 0));
    waterQ.line(); waterF.line();
    ltPriya.set(0);

    /* ---------- the station sign ---------- */
    // the station sign drops in: OESOPHAGUS over the tunnel, then STOMACH over the spa
    const signOn = sB ? 1 : sG && t < at('priya') - 0.1 ? 1 : 0;
    op(signW, signOn);
    if (signOn) {
      sign.setName(sB ? 'OESOPHAGUS' : 'STOMACH', sB ? 'AL2' : 'AL3');
      const dp = P(t, sB ? at('tube') : cG, 0.5, pop);
      tr(signW, sB ? 600 : 400, lerp(-80, 160, dp), 1, 2 * Math.sin(t * 2) * AMP);
    }

    /* ---------- B: down the tube ---------- */
    op(tunShot, sB); op(bFg, sB);
    if (sB) {
      tunnel.upd(t, 0.4 + 0.6 * AMP);
      const p = P(t, at('tube'), end('tube') + 0.4 - at('tube'), linear);
      tr(bolB, 600, 380 - 20 * p, Math.max(0.05, 1.5 - 1.3 * p));
      stomachPop(cOes, t, mid('tube', 0.05), 600, 560);
      stomachPop(cOesSub, t, mid('tube', 0.3), 600, 640);
      // Percy's favourite stretch: he stretches
      op(percy, 1);
      const sp = P(t, mid('tube', 0.68), 0.5, pop) * (1 - P(t, end('tube') + 0.1, 0.3, ease));
      percy.setAttribute('transform', `translate(1020 ${(500 - 30 * sp).toFixed(1)}) scale(${(0.8 * (1 - 0.15 * sp)).toFixed(3)} ${(0.8 * (1 + 0.32 * sp)).toFixed(3)})`);
      percy.set({ t, mood: sp > 0.3 ? 'happy' : 'deadpan', look: -0.5 });
      const fp = P(t, mid('tube', 0.7), 0.4, pop);
      op(cFave, clamp(fp * 2.5)); tr(cFave, 1010, 300, Math.max(0.01, 0.6 + 0.4 * fp), -4);
    }

    /* ---------- C: peristalsis ---------- */
    op(sqShot, sC); op(cFg, sC);
    if (sC) {
      const p = P(t, at('waves'), end('waves') + 0.25 - at('waves'), linear);
      peri.set(p);
      const xs = lerp(-560, 400, p) + 600;
      tr(sqArrow, xs, 300); tr(sqLbl, clamp(xs, 210, 990) - xs, -192); sqA.set(P(t, at('waves') + 0.1, 0.35, linear));
      op(sqArrow, P(t, at('waves'), 0.25, linear));
      tr(pushA, Math.min(1080, xs + 142), 300); op(pushA, P(t, mid('waves', 0.25), 0.3, linear) * (1 - P(t, mid('waves', 0.8), 0.3, linear)));
      stomachPop(cPeri, t, mid('waves', 0.5), 470, 500);
      op(cPeriSub, P(t, mid('waves', 0.6), 0.3, linear)); tr(cPeriSub, 470, 580);
      op(percy, 1);
      tr(percy, 1040, 540, 0.72);
      const me = t > mid('waves', 0.86);
      percy.set({ t, talk: talk(t, 'percy'), mood: me ? 'smug' : 'deadpan', look: -0.6, squeeze: 0.5 + 0.5 * Math.sin((t - at('waves')) * TAU * 0.9 * (0.5 + 0.5 * AMP)) });
      stomachPop(cMe, t, mid('waves', 0.86), 1040, 390, 1, -4);
    }

    /* ---------- D: Kavya asks ---------- */
    op(hawkShot, sD); op(dFg, sD);
    if (sD) {
      const t0 = sD1 ? cD : sD2 ? cJ : cL;
      const k = 1.08 + 0.04 * P(t, t0, 3, linear);
      const cam = { k, cx: 420, cy: 420 };
      stomachCam(hawkWrap, k, 420, 420);
      op(kav, 1); op(tableW, 1); op(bowl, 1);
      stomachPlace(kav, cam, 420, 470, 1.5);
      stomachPlace(tableW, cam, 420, 662, 1);
      stomachPlace(bowl, cam, 560, 640, 1.6);
      let mood = 'neutral', look = 0.5;
      if (sD3) mood = t < mid('itself', 0.45) ? 'shock' : 'sad';
      kav.set({ t, talk: talk(t, 'kavya'), mood, look, sweat: sD3 ? 1 : 0 });
      op(qGrav, sD1); op(qAcid, sD2); op(qSelf, sD3);
      if (sD1) { stomachPop(qGrav, t, mid('gravity', 0.45), 890, 260); gravA.set(P(t, mid('gravity', 0.6), 0.4, ease)); }
      if (sD2) stomachPop(qAcid, t, mid('acid', 0.4), 870, 300, 1, -3);
      if (sD3) stomachPop(qSelf, t, mid('itself', 0.45), 880, 280, 1, 3);
    }

    /* ---------- E: upside down ---------- */
    op(parkShot, sE); op(eFg, sE);
    if (sE) {
      op(kavBody, 1); op(bowl, 1);
      const sw = 5 * Math.sin(t * 2.2) * AMP;
      tr(kavBody, 420, 156, 1.5, 180 + sw);
      kavBody.pose({ lean: 0, armL: [160, 20], armR: [-150, -30], legL: [6, -4], legR: [-6, 4] });
      const a = (sw) * Math.PI / 180;
      tr(bowl, 420 - Math.sin(a) * 300 + 34, 156 + Math.cos(a) * 300, 1.2, sw);
      // inset: the bolus goes UP towards the stomach
      const f = ((t - at('upside')) / 1.9) % 1, yb = lerp(118, -82, f < 0 ? 0 : f);
      tr(insBol, 0, yb); op(insBol, Math.min(1, Math.sin(clamp(f) * Math.PI) * 3));
      const pinch = y => 15 * Math.exp(-Math.pow((y - (yb + 36)) / 16, 2));
      let L = '', R = '';
      for (let y = -108; y <= 128; y += 8) { L += `${L ? ' L' : 'M'}${(-30 + pinch(y)).toFixed(1)},${y}`; R += `${R ? ' L' : 'M'}${(30 - pinch(y)).toFixed(1)},${y}`; }
      attr(insWallL, 'd', L); attr(insWallR, 'd', R);
      let lum = 'M-30,-108'; for (let y = -108; y <= 128; y += 8) lum += ` L${(-30 + pinch(y)).toFixed(1)},${y}`;
      for (let y = 128; y >= -108; y -= 8) lum += ` L${(30 - pinch(y)).toFixed(1)},${y}`;
      attr(insLumen, 'd', lum + ' Z');
      const ip = P(t, at('upside') + 0.1, 0.45, pop);
      op(inset, clamp(ip * 2.5)); tr(inset, 850, 320, Math.max(0.01, 0.7 + 0.3 * ip));
      insUp.set(P(t, mid('upside', 0.3), 0.5, ease));
      stomachPop(cGrav, t, mid('upside', 0.35), 850, 548);
      dont.set(P(t, mid('upside', 0.8), 0.3, easeOut), 420, 560, -8);
      op(percy, 1); tr(percy, 1090, 590, 0.6);
      percy.set({ t, talk: talk(t, 'percy'), mood: 'deadpan', look: -0.7 });
    }

    /* ---------- spa shots: G (stomach, Priya), H (job, dimmed), G2 (kills), G3 (mucus), M (tried/fit), P (Phoebe) ---------- */
    const spaOn = sG || sH || sK || sM || sN || sP;
    op(spaShot, spaOn);
    op(gFg, sG); op(hFg, sH); op(kFg, sK); op(mFg, sM); op(pFg, sP); op(nFg, sN);
    if (spaOn) {
      spa.upd(t);
      let cam = { k: 1, cx: 600, cy: 400 };
      if (sG) cam = { k: 1.02 + 0.015 * Math.sin(t * 3.1) * AMP, cx: 600, cy: 420 };
      if (sN) cam = { k: 1 + 0.12 * P(t, at('fit'), end('fit') + 0.7 - at('fit'), ease), cx: 960, cy: 420 };
      if (sP) cam = { k: 1 + 0.08 * P(t, at('still'), end('still') + 0.8 - at('still'), linear), cx: 640, cy: 520 };
      stomachCam(spaWrap, cam.k, cam.cx, cam.cy);
      if (sG) spaWrap.setAttribute('transform', spaWrap.getAttribute('transform') + ` rotate(${(0.6 * Math.sin(t * 2.3) * AMP).toFixed(2)} 600 400)`);
      op(spaDim, sH || sN ? 1 : 0);
      attr(spaDim, 'opacity', sN ? 0.35 : 0.55);

      if (sG) {
        // the bolus drops into the pool and the walls churn
        const bp = P(t, cG + 0.05, 0.7, easeIn);
        op(bolG, t < at('priya') ? 1 : 0); tr(bolG, 760, lerp(-60, 640, bp) + (bp >= 1 ? 6 * Math.sin(t * 3) : 0), 1, bp * 200);
        op(splash, win(t, cG + 0.72, cG + 1.3, 0.12)); tr(splash, 760, 620, 1 + 0.6 * P(t, cG + 0.72, 0.5, easeOut));
        const ks = [0.42, 0.62, 0.86];
        gChips.forEach((c, i) => { const p = P(t, mid('stomach', ks[i]), 0.45, pop); op(c, clamp(p * 2.5) * (t < at('priya') - 0.1 ? 1 : 0)); tr(c, 300, 250 + i * 86, Math.max(0.01, 0.6 + 0.4 * p)); });
        // Priya rises from the pool
        if (t >= at('priya') - 0.1) {
          op(priya, 1); op(ripQ, 1);
          const rp = P(t, at('priya') - 0.1, 0.6, easeOut);
          tr(priya, 600, lerp(720, 500, rp), 1.25);
          waterQ.line(612);
          tr(ripQ, 600, 612, 1 + 0.03 * Math.sin(t * 4));
          priya.set({ t, talk: talk(t, 'priya'), mood: 'smug', look: 0 });
          ltPriya.set(win(t, at('priya') + 0.2, at('priya') + 3.4, 0.3));
          op(cProt, 1); stomachPop(cProt, t, mid('priya', 0.62), 850, 330);
        } else op(cProt, 0);
      }

      if (sH) {
        // Priya docks the chain in her square active site
        const dock = P(t, mid('job', 0.08), 0.5, ease), back = P(t, mid('job', 0.42), 0.4, ease);
        const s = 1.3, px = lerp(980, 698, dock) + 130 * back;
        op(priya, 1); tr(priya, px, 430, s);
        priya.set({ t, talk: talk(t, 'priya'), mood: t > mid('job', 0.72) ? 'smug' : 'neutral', look: -0.7 });
        const cp = P(t, mid('job', 0.45), 0.6, ease);
        chain.set(cp); tr(chainW, 430, 433, 1.2);
        op(tProtein, P(t, cH, 0.3, linear) * (1 - P(t, mid('job', 0.45), 0.3, linear)));
        op(tAmino, P(t, mid('job', 0.62), 0.3, linear));
        stomachPop(cJob, t, mid('job', 0.5), 470, 628);
        const mp = P(t, mid('job', 0.84), 0.35, pop);
        op(mine, clamp(mp * 2.5)); tr(mine, 960, 250, Math.max(0.01, 0.6 + 0.4 * mp));
      }

      if (sK) {
        op(priya, 1); op(ripQ, 1);
        tr(priya, 300, 500, 1.15); waterQ.line(606); tr(ripQ, 300, 606, 0.85 + 0.03 * Math.sin(t * 4));
        const dig = t > mid('kills', 0.78);
        priya.set({ t, talk: talk(t, 'priya'), mood: dig ? 'smug' : t < mid('kills', 0.15) ? 'deadpan' : 'neutral', look: dig ? 0 : 0.8 });
        microbes.forEach((m, i) => {
          const [x, f] = MIC[i], t0 = mid('kills', f), fall = P(t, t0, 0.55, easeIn), pp = P(t, t0 + 0.55, 0.3, easeOut);
          op(m, t >= t0 ? 1 - pp * 0.15 : 0);
          tr(m, x, lerp(-60, 600, fall), 1, 20 * Math.sin(t * 5 + i));
          tr(m.body, 0, 0, Math.max(0.01, 1 + 0.5 * pp)); op(m.body, 1 - pp);
          op(m.x, pp); tr(m.x, 0, 0, 0.5 + 0.5 * pp);
        });
        stomachPop(cKill, t, mid('kills', 0.22), 790, 290);
        stomachPop(cCond, t, mid('kills', 0.55), 790, 372);
        stomachPop(cDig, t, mid('kills', 0.8), 330, 300, 1, -3);
      }

      if (sM) {
        const gl = 0.35 + 0.35 * wave(t, 1.2);
        attr(mucGlow, 'opacity', (gl * P(t, at('mucus') + 0.1, 0.4, linear)).toFixed(3));
        drops.forEach((o, i) => {
          const f = ((t - at('mucus')) * 0.7 + o.ph) % 1, up = f < 0.5;
          const yTop = 462 + 0.02 * (o.x - 600);
          const y = up ? lerp(610, yTop + 14, easeOut(f * 2)) : lerp(yTop + 14, 610, easeIn((f - 0.5) * 2));
          tr(o.d, o.x + (f - 0.5) * 40, y, 1, up ? 0 : 180);
          op(o.d, t > at('mucus') ? 1 : 0);
          op(pings[i], t > at('mucus') ? 1 - clamp(Math.abs(f - 0.5) * 8) : 0); tr(pings[i], o.x, yTop - 10);
        });
        const lp = P(t, mid('mucus', 0.25), 0.45, pop);
        op(mucLbl, clamp(lp * 2.5)); mucLine.set(1);
        stomachPop(cal, t, mid('mucus', 0.62), 720, 300, 1, -4);
        op(calRing, P(t, mid('mucus', 0.8), 0.3, linear));
        stomachPop(cLining, t, mid('mucus', 0.7), 720, 410);
        op(percy, 1); tr(percy, 1050, 540, 0.78);
        percy.set({ t, talk: talk(t, 'percy'), mood: 'deadpan', look: -0.6 });
      }

      if (sN) {
        // Amy tries the chicken; it does not fit
        const s = 1.4, ax = 470, ay = 440;
        stomachPlace(amy, cam, ax, ay, s); op(amy, 1);
        const fitT = at('fit') + 0.05;
        const tryP = P(t, mid('tried', 0.35), 0.8, ease), bounce = P(t, fitT, 0.5, easeOut);
        const notch = [ax + 40 * s, ay - 68 * s];
        const bx = lerp(lerp(660, notch[0] + 30, tryP), 690, bounce), by = lerp(lerp(250, notch[1] - 34, tryP), 250, bounce) - 60 * Math.sin(bounce * Math.PI);
        stomachPlace(chickBead, cam, bx, by, 1, bounce * 160 + 8 * Math.sin(t * 3) * (1 - tryP));
        op(chickBead, 1); op(cChick, 1 - P(t, mid('tried', 0.5), 0.3, linear));
        const amyMood = t < fitT ? 'happy' : t < fitT + 0.5 ? 'shock' : 'sad';
        amy.set({ t, talk: talk(t, 'amy'), mood: amyMood, look: t < fitT ? 0.6 : 0.9, sparkle: t < fitT ? 1 : 0 });
        op(fitX, P(t, fitT + 0.05, 0.2, linear)); stomachPlace(fitX, cam, notch[0] + 30, notch[1] - 40, 1);
        stomachPop(cWrong, t, fitT + 0.4, 600, 625);
        op(priya, 1); stomachPlace(priya, cam, 960, 450, 1.2);
        priya.set({ t, talk: talk(t, 'priya'), mood: t < fitT ? 'smug' : 'deadpan', look: t < fitT ? -0.8 : 0 });
      } else { op(chickBead, 0); op(fitX, 0); op(cWrong, 0); }

      if (sP) {
        op(phoebe, 1); op(ringF, 1);
        const bob = 8 * Math.sin(t * 2.2) * AMP;
        stomachPlace(phoebe, cam, 640, 540 + bob, 1.1);
        const wl = cam.cy + cam.k * (600 + bob - cam.cy);
        waterF.line(wl + 6);
        stomachPlace(ringF, cam, 640, 600 + bob, 1, 2 * Math.sin(t * 1.7) * AMP);
        phoebe.set({ t, talk: talk(t, 'phoebe'), mood: 'sad', look: 0 });
        stomachPop(cStill, t, mid('still', 0.4), 830, 300, 1, 3);
        // Priya at the edge, unimpressed
        op(priya, 1); op(ripQ, 1);
        stomachPlace(priya, cam, 200, 520, 0.95); waterQ.line(cam.cy + cam.k * (606 - cam.cy));
        stomachPlace(ripQ, cam, 200, 606, 0.7);
        priya.set({ t, mood: 'deadpan', look: 0.8 });
      }
    }

    /* ---------- I + Kq: confessionals ---------- */
    confP.set(sI || sKq, t); attr(confP.firstChild, 'fill', sKq ? confFillQ : confFillP);
    op(iFg, sI); op(kqFg, sKq);
    if (sI) {
      const k = 1.02 + 0.14 * P(t, mid('thpriya', 0.55), end('thpriya') + 0.6 - mid('thpriya', 0.55), linear);
      const cam = { k, cx: 430, cy: 380 };
      stomachCam(confP, k, 430, 380);
      op(percy, 1); stomachPlace(percy, cam, 430, 410, 1.5);
      percy.set({ t, talk: talk(t, 'percy'), mood: 'deadpan', look: 0 });
      stomachPop(neon, t, cI + 0.1, 880, 250);
      const flick = t > mid('thpriya', 0.38) ? (Math.sin(t * 40) > 0.3 && t < mid('thpriya', 0.5) ? 0.8 : 0.18) : 0.85 + 0.15 * Math.sin(t * 7);
      op(nSpa, flick); op(nAcid, 0.85 + 0.15 * Math.sin(t * 7 + 1));
      nStrike.set(P(t, mid('thpriya', 0.5), 0.25, ease));
      stomachPop(cItsAcid, t, mid('thpriya', 0.42), 880, 400);
    }
    if (sKq) {
      const k = 1.02 + 0.1 * P(t, mid('alive', 0.75), end('alive') + 0.5 - mid('alive', 0.75), linear);
      const cam = { k, cx: 430, cy: 380 };
      stomachCam(confP, k, 430, 380);
      op(priya, 1); stomachPlace(priya, cam, 430, 410, 1.5);
      priya.set({ t, talk: talk(t, 'priya'), mood: 'deadpan', look: 0 });
      const ap = stomachPop(cAlive, t, at('alive') + 0.1, 890, 200);
      op(cAlive, clamp(ap * 2.5));
      stomachPop(bigCount, t, mid('alive', 0.4), 890, 380);
      const n = Math.round(1000000 * P(t, mid('alive', 0.4), 0.9, easeOut));
      setText(bigN, String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
      stomachPop(lunch, t, mid('alive', 0.74), 890, 540);
      op(lunchX, P(t, mid('alive', 0.84), 0.2, linear));
      stomachPop(cNoLunch, t, mid('alive', 0.72), 890, 650);
    }

    /* ---------- J + L: the enzyme board ---------- */
    op(boardShot, sJ || sL || sO);
    op(jFg, sJ); op(lFg, sL);
    if (sJ) {
      stomachPop(jTitle, t, at('catalyst') + 0.05, 600, 160);
      stomachPop(cSpeed, t, mid('catalyst', 0.55), 380, 290);
      stomachPop(cUsed, t, mid('catalyst', 0.78), 840, 290);
      op(amy, 1); tr(amy, 140, 470, 0.85); amy.set({ t, mood: 'happy', look: 0.8, sparkle: 1 });
      op(priya, 1); tr(priya, 790, 500, 1.0); priya.set({ t, mood: 'smug', look: -0.6 });
      // the conveyor: proteins arrive at Priya's active site one after another and split into amino acids
      const T0 = at('catalyst') + 0.4, PER = 1.25, V = 260, NOTCH = 714;
      let bm = ''; const off = ((t - T0) * V) % 40;
      for (let x = 240 + (off < 0 ? off + 40 : off); x < 700; x += 40) bm += `M${x.toFixed(1)},527 l0,16 `;
      attr(beltMarks, 'd', bm);
      const nDone = t < T0 ? 0 : Math.floor((t - T0) / PER) + 1;
      const jMax = Math.floor((t - T0 + 2.0) / PER);
      jProts.forEach((pr, k) => {
        const j = jMax - (((jMax - k) % 3) + 3) % 3;          // the protein using slot k right now
        if (j < 0) { op(pr.g, 0); return; }
        const dt = t - (T0 + j * PER);                       // > 0: it has reached Priya's active site
        op(pr.g, dt < 0.9 ? 1 : 1 - P(dt, 0.9, 0.3, linear));
        const xs = pr.beads.map((b, i) => NOTCH - i * 52 + Math.min(0, dt) * V);
        pr.beads.forEach((b, i) => {
          let x = xs[i], y = 502;
          if (dt > 0) { const f = clamp(dt / 0.9); x = lerp(xs[i], 960 + i * 46, easeOut(f)); y = 502 - 150 * Math.sin(f * Math.PI) + 90 * f; }
          tr(b, x, y, 1, dt > 0 ? dt * 200 * (i - 1) : 0);
          op(b, dt > 0 ? 1 : clamp((x - 236) / 20));
        });
        pr.bonds.forEach((l, i) => { attr(l, 'x1', xs[i]); attr(l, 'y1', 502); attr(l, 'x2', xs[i + 1]); attr(l, 'y2', 502); op(l, dt > 0 ? 0 : clamp((xs[i + 1] - 236) / 20)); });
      });
      setText(cntT, String(Math.max(0, nDone)));
      stomachPop(counter, t, at('catalyst') + 0.5, 1035, 400);
      stomachPop(cSame, t, mid('catalyst', 0.85), 790, 640);
    }
    if (sL) {
      op(priya, 1); tr(priya, 800, 430, 1.6);
      const bounceT = mid('specific', 0.62);
      priya.set({ t, talk: talk(t, 'priya'), mood: t > bounceT ? 'deadpan' : 'smug', look: -0.7 });
      const NX = 800 - 76 * 1.6, NY = 430 + 2 * 1.6;
      const kp = P(t, mid('specific', 0.12), 0.5, ease), kout = P(t, mid('specific', 0.45), 0.3, linear);
      tr(keyBead, lerp(160, NX, kp), NY); op(keyBead, kp > 0 ? 1 - kout : 0);
      op(keyTick, P(t, mid('specific', 0.12) + 0.5, 0.2, linear) * (1 - kout)); tr(keyTick, NX, NY - 90);
      const hp = P(t, mid('specific', 0.5), 0.35, easeIn), hb = P(t, bounceT, 0.5, easeOut);
      const hx = lerp(lerp(160, NX - 34, hp), 260, hb), hy = NY - 70 * Math.sin(hb * Math.PI);
      tr(keyHex, hx, hy, 1.0, hb * -120); op(keyHex, t > mid('specific', 0.48) ? 1 : 0);
      op(keyX, P(t, bounceT + 0.02, 0.2, linear)); tr(keyX, NX - 30, NY - 90);
      actLbl.set(P(t, mid('specific', 0.3), 0.35, linear));
      stomachPop(cSpecific, t, mid('specific', 0.05), 420, 590);
      stomachPop(cLock, t, mid('specific', 0.72), 900, 190);
    }

    /* ---------- N(o): not just the stomach ---------- */
    op(oFg, sO);
    if (sO) {
      const mp = P(t, cR, 0.4, pop);
      tr(map, 600, 400, Math.max(0.01, 0.9 + 0.1 * mp));
      const act = t < mid('notjust', 0.36) ? 2 : t < mid('notjust', 0.66) ? 0 : 3;
      map.set(act, 0);
      op(notHere, win(t, mid('notjust', 0.06), mid('notjust', 0.36), 0.15)); tr(notHere, map.x(2) + 600 + 30, 370);
      attr(brk, 'stroke-dashoffset', (1 - P(t, mid('notjust', 0.4), 0.9, ease)).toFixed(3));
      stomachPop(cStarts, t, mid('notjust', 0.42), 150, 585);
      stomachPop(cFin, t, mid('notjust', 0.7), 600, 585);
      stomachPop(cNotJust, t, mid('notjust', 0.06), 600, 205);
      op(percy, 1); tr(percy, 1060, 590, 0.62);
      percy.set({ t, talk: talk(t, 'percy'), mood: 'deadpan', look: -0.7 });
    }
  };
});

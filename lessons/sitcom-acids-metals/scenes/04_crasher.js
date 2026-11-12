/* Scene 4: The wedding crasher (acid + metal).
   Lab: the teacher hands out magnesium ribbon; it drops into a fresh tube of acid -> the venue (pH 1): Maggie
   cannonballs in through the meniscus (lower third), everyone shocked -> she fizzes: the bubbles are hydrogen ->
   Henry, the best man, "the H in HCl" (lower third) -> Maggie barges in, Henry is shoved up in a bubble and
   floats away (Mg + 2HCl diagram) -> acid + metal -> salt + hydrogen -> the HCl + Mg example -> Maggie's
   confessional ("I REACTED with it"; cake) -> the lit splint at the mouth of the tube -> Henry, inside, terrified
   -> POP! ...Ouch (singed) -> squeaky pop = hydrogen -> the salt's name card -> chlorides, sulfates, nitrates
   -> zinc + sulfuric acid -> zinc sulfATE (not sulfIDE). */
scene('crasher', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed crs) ---------- */
  const crsCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const crsPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const crsChip = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 }); };
  const crsPanel = (parent, x, y, w, h, col) => card(parent, x, y, w, h, { fill: 'rgba(10,22,32,0.93)', stroke: col || C.line, sw: 4 });
  const crsSeat = (el, parent) => { if (el.parentNode !== parent) parent.appendChild(el); };
  const lookAt = (from, to) => clamp((to - from) / 220, -1, 1);
  // a flame (outer orange, inner yellow) about 120 tall at s = 1, base at (0,0)
  function crsFlame(parent) {
    const g = G(parent);
    const o = E('path', { d: 'M0,0 Q-60,-30 -20,-80 Q-6,-100 4,-130 Q18,-96 40,-70 Q70,-30 0,0 Z', fill: '#FF8A1F', stroke: '#E8642A', 'stroke-width': 4 }, g);
    E('path', { d: 'M0,-6 Q-30,-24 -10,-56 Q0,-70 4,-86 Q14,-62 24,-48 Q38,-22 0,-6 Z', fill: '#FFE45C' }, g);
    g.upd = (t, k) => tr(g, 0, 0, k * (1 + 0.08 * Math.sin(t * 14)), 5 * Math.sin(t * 9));
    return g;
  }

  const Lbg = G(root), Lfg = G(root), Lhud = G(root);

  /* =====================================================================
     LAB: the ribbon goes into a fresh tube of acid; later, the splint test
     ===================================================================== */
  const labShot = G(Lbg), labW = G(labShot);
  const lab = ngLab(labW);
  const kavW = G(labW), kav = cast(kavW, 'kavya', { goggles: 'on' }); tr(kavW, 300, 400, 1.55);
  ngBench(labW, 560);
  const TB = [780, 450], TSURF = 444;
  const tube = testTube(labW, 56, 220, { level: 0.55, liquid: ngPH(1) }); tr(tube, TB[0], TB[1]);
  E('path', { d: 'M752,340 L752,532 A28,28 0 0 0 808,532 L808,340', fill: 'none', stroke: '#6F8DA2', 'stroke-width': 2.5 }, labW);
  const tubeBub = [0, 1, 2, 3, 4, 5, 6, 7].map(i => E('circle', { r: 2.5 + (i % 3), fill: 'rgba(255,255,255,0.3)', stroke: '#FFFFFF', 'stroke-width': 1.5 }, labW));
  const ribW = G(labW), rib = ngRibbon(ribW, 1);
  const rack = G(labW);
  E('rect', { x: 690, y: 516, width: 180, height: 40, rx: 6, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, rack);
  E('rect', { x: 700, y: 556, width: 18, height: 6, fill: '#7A5230' }, rack); E('rect', { x: 842, y: 556, width: 18, height: 6, fill: '#7A5230' }, rack);
  // the teacher's hand (lab-coat sleeve) from the right
  const tHand = G(labW);
  E('path', { d: 'M40,-40 L520,-70 L520,60 L40,40 Z', fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 4, 'stroke-linejoin': 'round' }, tHand);
  E('path', { d: 'M-40,-26 Q-56,-6 -40,18 L-10,22 L44,30 L50,-34 L-10,-34 Z', fill: '#E2B08A', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, tHand);
  E('path', { d: 'M-40,-6 L-62,-10 M-36,8 L-58,8', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, tHand);
  // the splint for the test
  const splW = G(labW), spl = ngSplint(splW, 0.45);
  const ribChip = crsChip(Lfg, 'magnesium ribbon', { size: 32, color: '#DDE4EA', stroke: '#9AA6B2' });
  const acidChip = crsChip(Lfg, 'fresh dilute acid: pH 1', { size: 28, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF' });
  const testG = G(Lfg);
  crsPanel(testG, -240, -88, 480, 176, '#FFFFFF');
  T(testG, 0, -26, 'TEST for **HYDROGEN**', { size: 34, weight: 600, anchor: 'middle', boldFill: '#FFFFFF' });
  T(testG, 0, 40, 'a **lit splint** at the mouth', { size: 30, weight: 600, anchor: 'middle', fill: C.muted, boldFill: '#FFB03A' });

  /* =====================================================================
     VENUE (world coordinates; the camera moves venW)
     ===================================================================== */
  const venShot = G(Lbg), venW = G(venShot);
  const venue = ngVenue(venW); venue.set(1, 0);
  const IP = [960, 505], HP = [320, 525], YP = [490, 590], MG0 = [720, 500], MG1 = [500, 548];
  const indiW = G(venW), indi = cast(indiW, 'indi', { ph: 1 }); tr(indiW, IP[0], IP[1], 0.9);
  const halW = G(venW), hal = cast(halW, 'hal', {}); tr(halW, HP[0], HP[1]);
  const henW = G(venW), henry = cast(henW, 'henry', {});
  const henBub = E('circle', { r: 112, fill: 'rgba(255,255,255,0.08)', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.8 }, henW);
  const henBubShine = E('path', { d: 'M-70,-62 A94,94 0 0 1 -20,-96', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.6 }, henW);
  const soot = G(henW);
  [-1, 1].forEach(sd => E('circle', { cx: sd * 40, r: 58, fill: 'none', stroke: '#3A3A3A', 'stroke-width': 12, 'stroke-dasharray': '22 12', opacity: 0.7 }, soot));
  E('path', { d: 'M-80,30 q10,-8 20,0 M70,-30 q10,-8 20,0 M-30,48 q8,-6 16,0', fill: 'none', stroke: '#2A2A2A', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.6 }, soot);
  const smoke = E('path', { d: '', fill: 'none', stroke: '#C9CED4', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, henW);
  const magW = G(venW), maggie = cast(magW, 'maggie', {});
  const magSparks = [0, 1, 2].map(i => { const s = spark(magW, 14, { seed: i }); return s; });
  venW.appendChild(henW);   // Henry in front of Maggie, so he is seen being shoved out
  const stream = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => E('circle', { r: 6 + (i % 3) * 3, fill: 'rgba(255,255,255,0.2)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, venW));
  const splashRing = E('ellipse', { cx: MG0[0], cy: 62, rx: 20, ry: 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, venW);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#05080C', opacity: 0.6 }, venShot);

  /* =====================================================================
     TUBE INTERIOR: Henry and the splint (close-up)
     ===================================================================== */
  const cuShot = G(Lbg), cuW = G(cuShot);
  E('rect', { x: -60, y: -60, width: 1320, height: 870, fill: linGrad('#2B4152', '#47657A', true) }, cuW);
  E('path', { d: 'M-60,560 Q600,610 1260,560 L1260,810 L-60,810 Z', fill: ngMix(ngPH(1), '#141C28', 0.35) }, cuW);
  E('path', { d: 'M-60,560 Q600,610 1260,560', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.6 }, cuW);
  E('rect', { x: 70, y: -60, width: 40, height: 870, fill: '#DDF3FF', opacity: 0.18 }, cuW);
  E('rect', { x: 1090, y: -60, width: 40, height: 870, fill: '#DDF3FF', opacity: 0.18 }, cuW);
  E('path', { d: 'M96,40 L96,700 M1104,40 L1104,700', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.35, 'stroke-linecap': 'round' }, cuW);
  const cuBub = [0, 1, 2, 3, 4, 5].map(i => E('circle', { r: 8 + (i % 3) * 4, fill: 'rgba(255,255,255,0.15)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, cuW));
  const henCU = G(cuW);   // Henry sits in here for the close-up
  const fgSplint = G(cuShot);
  E('rect', { x: 0, y: -16, width: 520, height: 32, rx: 8, fill: '#D9A86C', stroke: '#8A5A2B', 'stroke-width': 5 }, fgSplint);
  E('rect', { x: 0, y: -16, width: 50, height: 32, rx: 8, fill: '#2A1A12' }, fgSplint);
  const bigFlame = crsFlame(fgSplint);
  const fgSmoke = E('path', { d: '', fill: 'none', stroke: '#C9CED4', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.6 }, fgSplint);
  const popG = G(Lfg), popB = ngPop(popG, 'POP!'); tr(popG, 650, 270, 1.5);
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFFFF' }, Lfg);
  const ouch = crsChip(Lfg, '...ouch', { size: 34, color: C.muted });

  /* =====================================================================
     MAGGIE'S CONFESSIONAL
     ===================================================================== */
  const confG = ngConf(Lbg, 'maggie');
  const confSeat = G(confG);
  const crashG = G(Lfg);
  T(crashG, 0, 14, 'crashed?', { size: 44, weight: 800, anchor: 'middle', fill: C.muted });
  const crashX = strike(crashG, -110, 0, 110, C.bad);
  const reactG = G(Lfg);
  crsChip(reactG, 'REACTED', { size: 50, fill: '#DDE4EA', color: '#22303A', stroke: '#FFFFFF', sw: 4 });
  const rTick = tick(reactG, 24); tr(rTick, 170, -4);
  const cake = G(Lfg);
  E('ellipse', { cx: 0, cy: 54, rx: 120, ry: 22, fill: '#F7F4EE', stroke: '#BFB4A2', 'stroke-width': 4 }, cake);
  E('path', { d: 'M-100,48 L100,48 L100,-6 L-100,-48 Z', fill: '#FFE6A8', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cake);
  E('path', { d: 'M-100,18 L100,18 M-100,-16 L100,8', stroke: '#FFFFFF', 'stroke-width': 9 }, cake);
  E('path', { d: 'M-106,-52 L106,-8 L106,4 Q84,16 70,0 Q50,12 30,-6 Q10,6 -10,-14 Q-30,-2 -50,-22 Q-70,-10 -90,-32 L-106,-40 Z', fill: '#FF9FCB', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cake);
  E('circle', { cx: -40, cy: -54, r: 14, fill: '#E8242F', stroke: SC_INK, 'stroke-width': 3 }, cake);
  const cakeChip = crsChip(Lfg, 'Is there cake?', { size: 30, color: '#FF9FCB' });

  /* =====================================================================
     overlays
     ===================================================================== */
  const ltMaggie = scLowerThird(Lhud, 'MAGGIE', 'Magnesium. A metal. Not invited.');
  const ltHenry = scLowerThird(Lhud, 'HENRY', 'Hydrogen. The best man.');
  const mgChip = crsChip(Lfg, 'MAGNESIUM', { size: 44, fill: '#DDE4EA', color: '#22303A', stroke: '#FFFFFF', sw: 4 });
  const metalChip = crsChip(Lfg, 'a METAL', { size: 36, color: '#DDE4EA', stroke: '#9AA6B2' });
  const fizzChip = crsChip(Lfg, 'FIZZ!', { size: 50, fill: '#FFFFFF', color: '#22303A', stroke: '#9FD8FF', sw: 4 });
  const h2G = G(Lfg);
  crsPanel(h2G, -250, -58, 500, 116, '#FFFFFF');
  T(h2G, -40, 14, 'bubbles = **HYDROGEN**', { size: 34, weight: 600, anchor: 'middle', boldFill: '#FFFFFF' });
  ngFormula(h2G, 180, 18, 'H_2', { size: 48, fill: '#9FD8FF' });
  // the H in HCl
  const hclG = G(Lfg);
  crsPanel(hclG, 400, 112, 400, 168, '#FFFFFF');
  const hGlow = E('circle', { cx: 545, cy: 178, r: 64, fill: glow('#FFE45C') }, hclG);
  const hTxt = T(hclG, 545, 210, 'H', { size: 96, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(hclG, 660, 210, 'Cl', { size: 96, weight: 800, anchor: 'middle', fill: '#9BE36A' });
  T(hclG, 600, 260, 'hydrochloric acid', { size: 28, weight: 700, anchor: 'middle', fill: '#FF8A7A' });
  const hArrow = arrow(Lfg, 560, 290, 668, 438, { color: C.energy, width: 6 });
  // Mg + 2HCl diagram
  const dgG = G(Lfg);
  crsPanel(dgG, 640, 112, 510, 266, '#DDE4EA');
  const dgF = ngFormula(dgG, 895, 164, 'Mg + 2HCl → MgCl_2 + H_2', { size: 36, fill: C.ink });
  const atomBall = (col, dk, r, lbl, fc) => { const g = G(dgG); E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': 3 }, g); T(g, 0, 10, lbl, { size: 26, weight: 800, anchor: 'middle', fill: fc || SC_INK }); return g; };
  const dCl = [0, 1].map(() => atomBall('#9BE36A', '#3E8F2A', 26, 'Cl'));
  const dMg = atomBall('#E4EAF0', '#7E8A97', 32, 'Mg');
  const dH = [0, 1].map(() => atomBall('#F4F7FA', '#A9B5C0', 20, 'H'));
  // equations
  const eqG = G(Lfg);
  crsPanel(eqG, 110, 112, 980, 236, C.energy);
  const eq = ngEq(eqG, ['acid', '+', 'metal', '→', 'salt', '+', 'hydrogen'], { size: 56, colors: { acid: '#FF8A7A', metal: '#DDE4EA', salt: '#FFFFFF', hydrogen: '#9FD8FF' } });
  tr(eq, 600, 188);
  const eqBubs = [0, 1, 2].map(i => E('circle', { r: 7 + i * 2, fill: 'rgba(255,255,255,0.2)', stroke: '#9FD8FF', 'stroke-width': 3 }, eqG));
  const placeChip = crsChip(eqG, 'the metal takes hydrogen’s place', { size: 30, color: C.energy }); tr(placeChip, 600, 296);
  const exG = G(Lfg);
  crsPanel(exG, 110, 112, 980, 236, C.energy);
  const exEq = ngEq(exG, ['hydrochloric acid', '+', 'magnesium', '→', '\n', 'magnesium chloride', '+', 'hydrogen'], { size: 46, colors: { 'hydrochloric acid': '#FF8A7A', magnesium: '#DDE4EA', 'magnesium chloride': '#FFFFFF', hydrogen: '#9FD8FF' } });
  tr(exEq, 600, 230);
  // squeaky pop card
  const sqG = G(Lfg);
  crsPanel(sqG, 60, 150, 540, 450, '#FFB03A');
  T(sqG, 330, 250, '**lit splint** →', { size: 38, weight: 600, anchor: 'middle', boldFill: '#FFB03A' });
  T(sqG, 330, 380, 'squeaky **POP**', { size: 46, weight: 600, anchor: 'middle', boldFill: '#FFE45C' });
  T(sqG, 330, 510, '= **HYDROGEN**', { size: 50, weight: 600, anchor: 'middle', boldFill: '#9FD8FF' });
  const sqL2 = sqG.children[2], sqL3 = sqG.children[3];
  // name card
  const nameG = G(Lfg);
  E('path', { d: 'M-470,-110 L470,-110 L490,120 L-490,120 Z', fill: '#FBF6EC', stroke: '#C9A24A', 'stroke-width': 6, 'stroke-linejoin': 'round' }, nameG);
  E('path', { d: 'M-450,-92 L450,-92 L466,102 L-466,102 Z', fill: 'none', stroke: '#E6D3A0', 'stroke-width': 2 }, nameG);
  T(nameG, 0, -50, 'TABLE 1', { size: 28, weight: 700, anchor: 'middle', fill: '#9A7A2A', ls: 4 });
  const nm1 = T(nameG, -210, 46, 'MAGNESIUM', { size: 66, weight: 800, anchor: 'middle', fill: '#6E7C8A' });
  const nm2 = T(nameG, 250, 46, 'CHLORIDE', { size: 66, weight: 800, anchor: 'middle', fill: '#D2362B' });
  const nl1 = G(Lfg), nl2 = G(Lfg);
  crsChip(nl1, 'first name: from the METAL', { size: 30, fill: '#DDE4EA', color: '#22303A', stroke: '#FFFFFF' });
  crsChip(nl2, 'second name: from the ACID', { size: 30, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF' });
  const na1 = arrow(Lfg, 390, 560, 390, 486, { color: '#DDE4EA', width: 6 });
  const na2 = arrow(Lfg, 850, 560, 850, 486, { color: '#FF8A7A', width: 6 });
  // acids -> salts
  const acG = G(Lfg);
  crsPanel(acG, 60, 130, 760, 470, '#FF8A7A');
  T(acG, 440, 190, 'ACID  →  SALT', { size: 30, weight: 800, anchor: 'middle', fill: C.muted, ls: 3 });
  const acRows = [['hydrochloric acid', 'chlorides'], ['sulfuric acid', 'sulfates'], ['nitric acid', 'nitrates']].map(([a, b], i) => {
    const r = G(acG), y = 290 + i * 110;
    T(r, 430, y, a, { size: 40, weight: 800, anchor: 'end', fill: '#FF8A7A' });
    T(r, 470, y, '→', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
    T(r, 510, y, b, { size: 44, weight: 800, anchor: 'start', fill: '#FFFFFF' });
    return r;
  });
  const znG = G(Lfg);
  crsPanel(znG, 60, 130, 760, 470, '#DDE4EA');
  const znEq = ngEq(znG, ['zinc', '+', 'sulfuric acid', '→', '\n', 'zinc sulfate', '+', 'hydrogen'], { size: 46, colors: { zinc: '#DDE4EA', 'sulfuric acid': '#FF8A7A', 'zinc sulfate': '#FFFFFF', hydrogen: '#9FD8FF' } });
  tr(znEq, 440, 250);
  const ateG = G(znG); tr(ateG, 270, 446);
  T(ateG, 0, 18, 'sulf**ATE**', { size: 52, weight: 600, anchor: 'middle', boldFill: C.good });
  const ateT = tick(ateG, 22); tr(ateT, 130, 0);
  const ideG = G(znG); tr(ideG, 610, 446);
  T(ideG, 0, 18, 'sulf**IDE**', { size: 52, weight: 600, anchor: 'middle', boldFill: C.bad });
  const ideS = strike(ideG, -110, 2, 110, C.bad);
  const ideX = cross(ideG, 18); tr(ideX, 140, 0);
  const diffChip = crsChip(znG, 'different wedding', { size: 30, color: C.muted }); tr(diffChip, 610, 540);

  /* =====================================================================
     timing
     ===================================================================== */
  const DROP = mid('ribbon', 0.66), LAND = DROP + 0.45;
  const MAG_IN = at('maggie') - 0.05, MAG_LAND = MAG_IN + 0.5;
  const PUSH = at('pushed') + 0.05;
  const POP_T = at('pop') + 0.02;
  const CUTS = [
    [-1, 'lab', 'ribbon'],
    [at('maggie') - 0.1, 'ven', 'wide'],
    [at('fizz') - 0.08, 'ven', 'fizz'],
    [at('henry') - 0.08, 'ven', 'henry'],
    [at('pushed') - 0.08, 'ven', 'pushed'],
    [at('eq') - 0.08, 'ven', 'eq'],
    [at('example') - 0.08, 'ven', 'example'],
    [at('thmaggie') - 0.08, 'conf', ''],
    [at('test') - 0.08, 'lab', 'test'],
    [at('splint') - 0.08, 'cu', ''],
    [at('squeaky') - 0.08, 'ven', 'squeaky'],
    [at('naming') - 0.08, 'ven', 'naming'],
    [at('acids') - 0.08, 'ven', 'acids'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };

  return t => {
    const [c0, shot, sub] = cutAt(t);
    op(labShot, shot === 'lab' ? 1 : 0); op(venShot, shot === 'ven' ? 1 : 0); op(cuShot, shot === 'cu' ? 1 : 0); confG.set(shot === 'conf' ? 1 : 0, t);

    /* ---------------- LAB ---------------- */
    if (shot === 'lab') {
      lab.upd(t * AMP);
      tube.set(0.55, ngPH(1));
      // the ribbon: held by the teacher, dropped, sinks to the bottom of the tube
      const hIn = P(t, mid('ribbon', 0.05), mid('ribbon', 0.5) - mid('ribbon', 0.05), easeOut);
      const hOut = P(t, DROP + 0.2, 0.7, ease);
      const hx = lerp(1340, 900, hIn) + 500 * hOut, hy = 232;
      op(tHand, sub === 'ribbon' ? 1 : 0); tr(tHand, hx, hy);
      const fall = P(t, DROP, LAND - DROP, easeIn);
      if (t < DROP) { tr(ribW, hx - 110, hy + 30, 0.85, -10); }
      else tr(ribW, lerp(790, TB[0], fall), lerp(262, 512, fall), lerp(0.85, 0.2, fall), lerp(-10, 80, fall));
      // bubbles once the ribbon is in
      const bOn = t >= LAND ? 1 : 0;
      tubeBub.forEach((b, i) => { const f = ((t - LAND) * (0.8 + (i % 4) * 0.15) + i / 8) % 1; op(b, bOn * (1 - f) * 0.9); tr(b, TB[0] - 12 + (i * 7) % 24 + 3 * Math.sin(f * 9), 506 - f * 60); });
      // camera and Kavya
      let look = 0.8, mood = 'neutral';
      if (sub === 'ribbon') {
        crsCam(labW, 640, 400, 1.3 + 0.04 * P(t, 0, 5, linear), 600, 400);
        look = t < DROP ? 1 : 0.8; mood = t > LAND ? 'smug' : 'neutral';
      } else {
        crsCam(labW, 780, 400, 2.4 + 0.15 * P(t, at('test'), 4.2, linear), 600, 420);
      }
      kav.set({ t, mood, look });
      // the splint approaches the mouth of the tube
      const sp = sub === 'test' ? P(t, mid('test', 0.35), mid('test', 0.95) - mid('test', 0.35), ease) : 0;
      op(splW, sub === 'test' ? 1 : 0); tr(splW, lerp(600, 683, sp), 334); spl.set('lit', t);
      if (sub === 'ribbon') { crsPop(ribChip, t, mid('ribbon', 0.3), 960, 350); crsPop(acidChip, t, mid('ribbon', 0.15), 760, 668); }
      else { op(ribChip, 0); op(acidChip, 0); }
      if (sub === 'test') crsPop(testG, t, mid('test', 0.08), 900, 180); else op(testG, 0);
    } else { op(ribChip, 0); op(acidChip, 0); op(testG, 0); }

    /* ---------------- VENUE ---------------- */
    const ven = shot === 'ven';
    if (ven) {
      venue.set(1, t * AMP);
      let k = 1, cx = 600, cy = 375, px = 600, py = 375;
      if (sub === 'fizz') { k = 1.45; cx = 680; cy = 470; px = 520; py = 430; }
      else if (sub === 'henry') { k = 1.4 + 0.05 * P(t, mid('henry', 0.7), 1.6, linear); cx = 420; cy = 520; px = 600; py = 440; }
      else if (sub === 'squeaky') { k = 1.5; cx = 960; cy = 505; px = 840; py = 450; }
      else if (sub === 'acids') { k = 1.25 + 0.08 * P(t, mid('zinc', 0.8), 2, linear); cx = 960; cy = 505; px = 980; py = 480; }
      else if (sub === 'wide' && t < MAG_LAND + 0.25) { const sh = Math.max(0, 1 - (t - MAG_LAND) / 0.25) * (t >= MAG_LAND ? 1 : 0); px += 10 * sh * Math.sin(t * 90) * AMP; }
      crsCam(venW, cx, cy, k, px, py);
      op(dim, sub === 'naming' ? 0.62 : 0);

      const w = scWho(S, t);
      const mPos = t < PUSH ? MG0 : [lerp(MG0[0], MG1[0], P(t, PUSH, 0.45, easeOut)), lerp(MG0[1], MG1[1], P(t, PUSH, 0.45, easeOut))];
      const spX = { indi: IP[0], hal: HP[0], henry: YP[0], maggie: mPos[0] }[w];
      const look = (from, dflt) => (spX !== undefined && spX !== from ? lookAt(from, spX) : (dflt || 0));

      // Maggie: the cannonball entrance, then fizzing
      crsSeat(magW, venW);
      const mIn = P(t, MAG_IN, MAG_LAND - MAG_IN, easeIn);
      const my = t < MAG_LAND ? lerp(-220, mPos[1], mIn) : mPos[1] - 26 * Math.max(0, Math.sin((t - MAG_LAND) * 9)) * Math.exp(-(t - MAG_LAND) * 4);
      tr(magW, mPos[0], my, 1, t < MAG_LAND ? mIn * 360 : 0);
      op(magW, t >= MAG_IN ? 1 : 0);
      maggie.set({ t, talk: talk(t, 'maggie'), mood: 'happy', look: look(mPos[0], 0), fizz: 1 });
      magSparks.forEach((s, i) => { const on = t >= MAG_LAND && t < MAG_LAND + 1.8 ? 1 - (t - MAG_LAND) / 1.8 : 0; op(s, on); tr(s, [-110, 120, 20][i], [-90, -60, -150][i]); s.upd(t + i); });
      const sr = t >= MAG_IN + 0.12 && t < MAG_IN + 0.9 ? (t - MAG_IN - 0.12) / 0.78 : -1;
      op(splashRing, sr >= 0 ? 1 - sr : 0); attr(splashRing, 'rx', 20 + 160 * Math.max(0, sr)); attr(splashRing, 'ry', 6 + 20 * Math.max(0, sr));
      // the stream of hydrogen bubbles from Maggie to the surface
      const sOn = (sub === 'fizz' || sub === 'henry' || sub === 'pushed' || sub === 'eq' || sub === 'example' || sub === 'squeaky' || sub === 'acids') ? 1 : 0;
      stream.forEach((b, i) => { const f = (t * (0.35 + (i % 4) * 0.06) + i / 10) % 1; op(b, sOn * Math.min(1, (1 - f) * 3) * 0.9); tr(b, mPos[0] + ((i * 37) % 90) - 45 + 10 * Math.sin(f * 8 + i), mPos[1] - 120 - f * (mPos[1] - 160)); });

      // Hal
      let hMood = 'happy', hSweat = 0;
      if (t < at('fizz')) { hMood = t >= MAG_LAND ? 'shock' : 'happy'; }
      hal.set({ t, talk: 0, mood: hMood, look: look(HP[0], 0.6), sweat: hSweat });
      // Indi
      let iMood = 'neutral';
      if (sub === 'wide') iMood = t >= MAG_LAND && t < mid('maggie', 0.55) ? 'shock' : 'deadpan';
      if (sub === 'pushed' || sub === 'squeaky' || sub === 'naming') iMood = 'deadpan';
      if (sub === 'acids' && t >= mid('zinc', 0.7)) iMood = 'deadpan';
      let iLook = look(IP[0], -0.4);
      if (sub === 'acids' || sub === 'eq' || sub === 'example') iLook = sub === 'acids' ? -0.7 : 0;
      indi.set({ t, talk: talk(t, 'indi'), mood: iMood, look: iLook, ph: 1 });

      // Henry: next to Hal, then shoved up in a bubble and away
      if (sub !== 'squeaky' && sub !== 'naming' && sub !== 'acids') {
        crsSeat(henW, venW);
        const up = P(t, PUSH + 0.15, end('pushed') - PUSH - 0.15, ease), out = P(t, end('pushed'), 0.7, easeIn);
        const hx = lerp(YP[0], 420, up) + 14 * Math.sin(t * 3) * up, hy = lerp(lerp(YP[1], 200, up), -200, out);
        tr(henW, hx, hy, 1.1);
        op(henW, hy > -190 ? 1 : 0);
        const bub = P(t, PUSH + 0.1, 0.3, pop);
        op(henBub, t >= PUSH ? clamp(bub * 2) * 0.8 : 0); op(henBubShine, t >= PUSH ? clamp(bub * 2) : 0);
        let yMood = 'shock', ySweat = 1;
        if (sub === 'henry') { yMood = t > mid('henry', 0.72) ? 'sad' : 'neutral'; ySweat = 0.4; }
        if (sub === 'pushed') { yMood = t < PUSH + 0.4 ? 'shock' : 'sad'; ySweat = 0.3; }
        henry.set({ t, talk: talk(t, 'henry'), mood: yMood, look: look(YP[0], 0.8), sweat: ySweat });
        op(soot, 0); op(smoke, 0);
      }
      // overlays in the venue
      ltMaggie.set(sub === 'wide' ? win(t, MAG_LAND + 0.2, MAG_LAND + 3.4, 0.3) : 0);
      if (sub === 'wide') { crsPop(mgChip, t, mid('maggie', 0.4), 900, 190); crsPop(metalChip, t, mid('maggie', 0.62), 900, 272); }
      else { op(mgChip, 0); op(metalChip, 0); }
      if (sub === 'fizz') { crsPop(fizzChip, t, mid('fizz', 0.12), 930, 190, 1, -6); crsPop(h2G, t, mid('fizz', 0.5), 900, 300); }
      else { op(fizzChip, 0); op(h2G, 0); }
      ltHenry.set(sub === 'henry' ? win(t, at('henry') + 0.3, at('henry') + 3.4, 0.3) : 0);
      if (sub === 'henry') {
        op(hclG, P(t, mid('henry', 0.4), 0.25, linear));
        const hl = win(t, mid('henry', 0.48), end('henry') + 0.3, 0.2);
        op(hGlow, hl); attr(hTxt, 'fill', hl > 0.5 ? '#FFE45C' : '#FFFFFF');
        op(hArrow, hl); hArrow.set(P(t, mid('henry', 0.5), 0.4, linear));
      } else { op(hclG, 0); op(hArrow, 0); }
      // the Mg + 2HCl diagram
      const dOn = sub === 'pushed';
      op(dgG, dOn ? P(t, at('pushed') + 0.15, 0.25, linear) : 0);
      if (dOn) {
        const q = P(t, mid('pushed', 0.25), 1.5, ease), rise = P(t, mid('pushed', 0.25) + 1.3, 1.0, ease);
        tr(dMg, 790, 280);
        dCl.forEach((c, i) => tr(c, lerp(1050, 790 + (i ? 62 : -62), q), lerp(i ? 330 : 240, 280, q)));
        dH.forEach((h, i) => tr(h, lerp(1004, 1000 + (i ? 19 : -19), q), lerp(i ? 330 : 240, 290, q) - 70 * rise));
        op(dgF, P(t, mid('pushed', 0.1), 0.3, linear));
      }
      // acid + metal -> salt + hydrogen
      const eOn = sub === 'eq';
      op(eqG, eOn ? 1 : 0);
      if (eOn) {
        eq.set(P(t, at('eq'), mid('eq', 0.55) - at('eq'), linear));
        const hx2 = +eq.terms[6].getAttribute('x') + 600 + textWidth('hydrogen', 56, FD, 800) / 2 + 26;
        eqBubs.forEach((b, i) => { const f = (t * 0.6 + i / 3) % 1; op(b, P(t, mid('eq', 0.5), 0.3, linear) * (1 - f)); tr(b, hx2 + 6 * Math.sin(f * 7 + i), 200 - f * 60); });
        op(placeChip, P(t, mid('eq', 0.62), 0.3, linear));
      }
      const xOn = sub === 'example';
      op(exG, xOn ? 1 : 0);
      if (xOn) exEq.set(P(t, at('example'), mid('example', 0.92) - at('example'), linear));
      // squeaky pop
      if (sub === 'squeaky') {
        op(sqG, P(t, at('squeaky') - 0.08, 0.2, linear));
        op(sqL2, P(t, mid('squeaky', 0.1), 0.3, linear)); op(sqL3, P(t, mid('squeaky', 0.35), 0.3, linear));
      } else op(sqG, 0);
      // the name card
      if (sub === 'naming') {
        crsPop(nameG, t, at('naming'), 600, 340);
        op(nm1, 1); op(nm2, 1);
        attr(nm1, 'fill', t > mid('naming', 0.2) && t < mid('naming', 0.55) ? '#9AA8B6' : '#6E7C8A');
        crsPop(nl1, t, mid('naming', 0.25), 390, 610); na1.set(P(t, mid('naming', 0.25), 0.4, linear)); op(na1, 1);
        crsPop(nl2, t, mid('naming', 0.68), 850, 610); na2.set(P(t, mid('naming', 0.68), 0.4, linear)); op(na2, t > mid('naming', 0.68) ? 1 : 0);
      } else { op(nameG, 0); op(nl1, 0); op(nl2, 0); op(na1, 0); op(na2, 0); }
      // acids -> salts, then zinc
      const aOn = sub === 'acids' && t < at('zinc') - 0.08, zOn = sub === 'acids' && !aOn;
      op(acG, aOn ? P(t, at('acids') - 0.08, 0.2, linear) : 0);
      if (aOn) acRows.forEach((r, i) => { const q = P(t, mid('acids', 0.04 + i * 0.32), 0.35, easeOut); op(r, q); tr(r, -30 * (1 - q), 0); });
      op(znG, zOn ? 1 : 0);
      if (zOn) {
        znEq.set(P(t, at('zinc'), mid('zinc', 0.5) - at('zinc'), linear));
        op(ateG, P(t, mid('zinc', 0.56), 0.25, linear));
        op(ideG, P(t, mid('zinc', 0.66), 0.25, linear)); ideS.set(P(t, mid('zinc', 0.72), 0.3, linear)); op(ideX, P(t, mid('zinc', 0.74), 0.2, linear));
        op(diffChip, P(t, mid('zinc', 0.86), 0.3, linear));
      }
    } else {
      ltMaggie.set(0); ltHenry.set(0);
      [mgChip, metalChip, fizzChip, h2G, hclG, hArrow, dgG, eqG, exG, sqG, nameG, nl1, nl2, na1, na2, acG, znG].forEach(e => op(e, 0));
    }

    /* ---------------- MAGGIE'S CONFESSIONAL ---------------- */
    if (shot === 'conf') {
      crsSeat(magW, confSeat);
      op(magW, 1); tr(magW, 430, 420, 1.5);
      const cakeIn = P(t, mid('thmaggie', 0.72), 0.9, easeOut);
      maggie.set({ t, talk: talk(t, 'maggie'), mood: 'happy', look: cakeIn > 0.3 ? 1 : 0, fizz: 0.45 });
      magSparks.forEach(s => op(s, 0));
      crsPop(crashG, t, mid('thmaggie', 0.08), 900, 220); crashX.set(P(t, mid('thmaggie', 0.22), 0.3, linear));
      crsPop(reactG, t, mid('thmaggie', 0.3), 880, 330);
      op(cake, cakeIn > 0 ? 1 : 0); tr(cake, lerp(1380, 900, cakeIn), 520 + 10 * Math.sin(t * 2), 1, 4 * Math.sin(t * 1.5));
      crsPop(cakeChip, t, mid('thmaggie', 0.78), 900, 650);
    } else { [crashG, reactG, cake, cakeChip].forEach(e => op(e, 0)); }

    /* ---------------- TUBE CLOSE-UP: splint, POP, ouch ---------------- */
    if (shot === 'cu') {
      crsSeat(henW, henCU);
      const popped = t >= POP_T;
      const sh = popped ? Math.max(0, 1 - (t - POP_T) / 0.22) : 0;
      tr(cuShot, 14 * sh * Math.sin(t * 95) * AMP, 9 * sh * Math.cos(t * 83) * AMP);
      const tremble = popped ? 0 : 3 * Math.sin(t * 40) * AMP;
      tr(henW, 560 + tremble, 440, 2.0);
      op(henW, 1); op(henBub, 0); op(henBubShine, 0);
      const singe = popped && t > mid('pop', 0.45) ? 1 : 0;
      op(soot, singe ? P(t, mid('pop', 0.45), 0.15, linear) : 0);
      op(smoke, singe);
      if (singe) { let d = 'M8,-82'; for (let i = 1; i <= 6; i++) d += ` L${(8 + 9 * Math.sin(i * 1.3 + t * 3)).toFixed(1)},${-82 - i * 12}`; attr(smoke, 'd', d); }
      const hMood = !popped ? 'shock' : singe ? 'sad' : 'shock';
      henry.set({ t, talk: talk(t, 'henry'), mood: hMood, look: popped ? 0 : 0.8, sweat: popped ? 0 : 1, still: true });
      cuBub.forEach((b, i) => { const f = (t * (0.3 + i * 0.05) + i / 6) % 1; tr(b, 180 + i * 160, 740 - f * 160); op(b, (1 - f) * 0.8); });
      // the flame grows in the foreground, then the pop puts it out
      const grow = P(t, at('splint') - 0.1, POP_T - at('splint'), ease);
      tr(fgSplint, lerp(1120, 840, grow), lerp(110, 230, grow), 1, -20);
      op(bigFlame, popped ? 0 : 1); tr(bigFlame, 0, 0);
      // flame sits at the splint's tip (left end), pointing up
      bigFlame.setAttribute('transform', `translate(-6 -10) scale(${lerp(1.2, 2.5, grow).toFixed(3)}) rotate(${(20 + 5 * Math.sin(t * 9)).toFixed(1)})`);
      op(fgSmoke, popped ? 0.6 : 0);
      if (popped) { let d = 'M0,-10'; for (let i = 1; i <= 6; i++) d += ` L${(12 * Math.sin(i * 1.4 + t * 3)).toFixed(1)},${-10 - i * 22}`; attr(fgSmoke, 'd', d); }
      popB.set(popped ? clamp((t - POP_T) / 0.5) : 0);
      op(popG, popped ? 1 - P(t, mid('pop', 0.55), 0.25, linear) : 0);
      op(flash, popped ? 1 - P(t, POP_T, 0.3, linear) : 0);
      if (singe) crsPop(ouch, t, mid('pop', 0.5), 560, 680); else op(ouch, 0);
    } else { op(popG, 0); op(flash, 0); op(ouch, 0); tr(cuShot, 0, 0); }
  };
});

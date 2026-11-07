/* Chapter 6: yeast and fermentation.
   Yeast under a microscope -> glucose -> ethanol + carbon dioxide (+ a little energy) ->
   Lazy Athletes, Energetic Yeast -> bread rises and bakes -> fizzy drinks -> products matter
   -> the balloon-on-a-bottle experiment. */
scene('yeast', S => {
  const { at, end, mid } = S, root = S.root, D = S.D;

  /* ---------- local helpers ---------- */
  const SUB = {
    glucose: { fill: '#3A2C0E', stroke: C.glucose, color: C.glucoseLt },
    ethanol: { fill: '#2A1C48', stroke: C.ethanol, color: '#DCCBFF' },
    co2: { fill: '#22303B', stroke: C.co2, color: C.co2 },
    lactic: { fill: '#3D1630', stroke: C.lactic, color: '#FFC6DF' },
  };
  const sub = (parent, text, kind, w, size) => {
    const st = SUB[kind];
    return chip(parent, text, { size: size || 34, w, fill: st.fill, stroke: st.stroke, color: st.color, sw: 3 });
  };
  function boldChip(parent, text, kind, w, size) {
    const st = SUB[kind], h = Math.round(size * 1.75), g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: st.fill, stroke: st.stroke, 'stroke-width': 3 }, g);
    T(g, 0, size * 0.35, text, { size, weight: 700, fill: st.color, anchor: 'middle', boldFill: st.stroke });
    return g;
  }
  const vis = (t, t0, t1, f) => { f = f || 0.4; return Math.min(P(t, t0, f, linear), 1 - P(t, t1, f, linear)); };
  function popAt(el, x, y, t, t0, k) {
    const p = clamp((t - t0) / 0.5), a = clamp(p * 2.5);
    op(el, a);
    if (a > 0) tr(el, x, y, (k || 1) * Math.max(0.01, pop(p)));
  }
  function riseAt(el, x, y, t, t0, k) {
    const p = P(t, t0, 0.55, easeOut);
    op(el, p);
    if (p > 0) tr(el, x, y + (1 - p) * 20, k || 1);
  }
  /* budding yeast cell, about 70 x 54 at s=1 */
  function yeastCell(parent, s, bud) {
    const g = G(parent);
    if (bud) E('ellipse', { cx: 36 * s, cy: -16 * s, rx: 14 * s, ry: 12 * s, fill: ball('#F1DEB0', '#B99A5E'), stroke: '#FFF1CF', 'stroke-width': 2 }, g);
    E('ellipse', { rx: 34 * s, ry: 27 * s, fill: ball('#F1DEB0', '#B99A5E'), stroke: '#FFF1CF', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 7 * s, cy: -4 * s, rx: 12 * s, ry: 9 * s, fill: 'rgba(150,110,50,0.32)' }, g);
    E('circle', { cx: -13 * s, cy: 7 * s, r: 4.5 * s, fill: 'rgba(120,85,35,0.5)' }, g);
    return g;
  }
  function loaf(parent, s) {
    const g = G(parent); if (s && s !== 1) tr(g, 0, 0, s);
    const in_ = G(g);
    E('path', { d: 'M-110,30 C-112,-48 -60,-82 0,-82 C60,-82 112,-48 110,30 Q110,42 98,42 L-98,42 Q-110,42 -110,30 Z', fill: ball('#E3A75A', '#9C5F22'), stroke: '#7A4A1C', 'stroke-width': 4 }, in_);
    E('path', { d: 'M-62,-46 Q-46,-30 -40,-8 M-14,-64 Q2,-44 6,-20 M36,-56 Q52,-38 54,-14', fill: 'none', stroke: '#F6D39A', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 }, in_);
    return g;
  }
  function wineBottle(parent) {
    const g = G(parent);
    E('path', { d: 'M-14,-120 L14,-120 L14,-70 C14,-50 40,-40 40,-10 L40,110 Q40,122 28,122 L-28,122 Q-40,122 -40,110 L-40,-10 C-40,-40 -14,-50 -14,-70 Z', fill: ball('#7A5BC0', '#3B2770'), stroke: '#CDB8FF', 'stroke-width': 3.5 }, g);
    E('rect', { x: -15, y: -128, width: 30, height: 16, rx: 4, fill: '#8C6A4F' }, g);
    E('rect', { x: -32, y: 10, width: 64, height: 56, rx: 8, fill: '#F2E8D8' }, g);
    E('path', { d: 'M-18,30 L18,30 M-18,46 L10,46', stroke: '#B79F85', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-28,-14 L-28,96', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.25, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function drinkGlass(parent, id, n) {
    const g = G(parent);
    const d = 'M-62,-150 L62,-150 L50,124 Q48,138 34,138 L-34,138 Q-48,138 -50,124 Z';
    const cp = E('clipPath', { id }, defs()); E('path', { d }, cp);
    const inG = G(g, { 'clip-path': `url(#${id})` });
    E('rect', { x: -70, y: -98, width: 140, height: 250, fill: linGrad('#FFD36B', '#E39A2C', true) }, inG);
    E('rect', { x: -70, y: -100, width: 140, height: 9, fill: '#FFF0C4', opacity: 0.75 }, inG);
    g.bub = bubbles(inG, -46, -94, 92, 226, { n: n || 18, r: 4.5, speed: 0.45, seed: 31, fill: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.92)' });
    E('path', { d, fill: 'rgba(255,255,255,0.06)', stroke: '#DDEEF6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-44,-130 L-36,110', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.22, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ---------- beat 1: yeast under the microscope ---------- */
  const mic = G(root), MR = 230;
  E('circle', { r: MR + 10, fill: '#0B1820' }, mic);
  const micClip = E('clipPath', { id: 'yeMicClip' }, defs()); E('circle', { r: MR - 4 }, micClip);
  const inMic = G(mic, { 'clip-path': 'url(#yeMicClip)' });
  E('circle', { r: MR, fill: '#183A3A' }, inMic);
  E('circle', { r: MR * 1.1, fill: glow('#BFE6CF'), opacity: 0.35 }, inMic);
  const rr = rng(77), cells = [];
  [[-118, -112], [-10, -150], [96, -104], [-160, 6], [-52, -30], [62, -6], [158, 50], [-112, 112], [4, 84], [112, 146], [-24, 186], [176, -54]].forEach(([x, y], i) => {
    const c = yeastCell(inMic, 0.95 + rr() * 0.3, i % 3 === 0);
    cells.push({ c, x, y, r: rr() * 360, ph: rr() * TAU });
  });
  const micBub = bubbles(inMic, -MR, -MR + 40, 2 * MR, 2 * MR - 40, { n: 16, r: 7, speed: 0.22, seed: 5 });
  E('circle', { r: MR, fill: 'none', stroke: '#9FB3C2', 'stroke-width': 14 }, mic);
  E('circle', { r: MR - 9, fill: 'none', stroke: '#5E7484', 'stroke-width': 3 }, mic);
  const micLbl = T(mic, 0, MR + 50, 'yeast cells, magnified', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  const y1 = G(root);
  const yT = T(y1, 0, 0, 'Yeast', { size: 66, weight: 700 });
  const yS = T(y1, 0, 0, 'a single-celled fungus', { size: 34, weight: 600, fill: C.muted });
  const yNo = G(y1);
  tr(molO2(yNo, 15), 0, -10);
  const yNoX = cross(yNo, 20); tr(yNoX, 0, -10);
  T(yNo, 36, 1, 'without oxygen', { size: 32, weight: 600 });
  const yF = T(y1, 0, 0, 'fermentation', { size: 60, weight: 700, fill: C.ethanol });

  /* ---------- beats 2-3: the equation; ethanol is the alcohol ---------- */
  const eqG = G(root);
  const ethGlow = E('ellipse', { cx: 730, cy: 300, rx: 160, ry: 74, fill: glow(C.ethanol) }, eqG);
  const ours = T(eqG, 700, 176, 'ours, in muscles: glucose → **lactic acid**', { size: 28, weight: 600, fill: C.muted, anchor: 'middle', boldFill: C.lactic });
  const eGlu = sub(eqG, 'glucose', 'glucose', 200);
  const eArr = arrow(eqG, 530, 300, 618, 300, { color: C.ink, width: 6 });
  const eEth = sub(eqG, 'ethanol', 'ethanol', 190);
  const ePlus = T(eqG, 0, 0, '+', { size: 46, weight: 700, anchor: 'middle' });
  const eCO2 = sub(eqG, 'carbon dioxide', 'co2', 290);
  const eEn = G(eqG);
  const eSp = spark(eEn, 14); tr(eSp, 902, 380);
  T(eEn, 926, 392, '+ a little energy', { size: 30, weight: 600, fill: C.energyLt });
  const ethG = G(root);
  const ethArr = arrow(ethG, 730, 344, 730, 446, { color: C.ethanol, width: 5 });
  const bottleE = G(ethG); wineBottle(bottleE);
  const ethTxt = T(ethG, 800, 548, 'the alcohol in\nalcoholic drinks', { size: 32, weight: 600, lh: 42 });

  /* ---------- beat 4: Lazy Athletes, Energetic Yeast ---------- */
  const lazyG = G(root);
  const cardL = G(lazyG), cardR = G(lazyG);
  card(cardL, 130, 160, 440, 470, { fill: C.card, stroke: C.line });
  T(cardL, 350, 238, '**L**azy **A**thletes', { size: 44, weight: 700, anchor: 'middle', boldFill: C.lactic });
  const runIcon = G(cardL);
  const ln = (par, d, col, w) => E('path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, par);
  ln(runIcon, 'M0,10 L-30,45 L-60,38', '#B98462', 15);
  ln(runIcon, 'M8,-44 L-20,-26 L-38,-40', '#B98462', 12);
  ln(runIcon, 'M0,10 L10,-46', '#6C8CFF', 36);
  ln(runIcon, 'M0,10 L28,42 L20,80', '#E7B38C', 15);
  ln(runIcon, 'M8,-44 L36,-24 L54,-44', '#E7B38C', 12);
  E('circle', { cx: 18, cy: -78, r: 18, fill: '#E7B38C' }, runIcon);
  const arL = arrow(cardL, 350, 470, 350, 512, { color: C.faint, width: 5 });
  const pL = boldChip(cardL, '**L**actic acid', 'lactic', 250, 34);
  card(cardR, 630, 160, 440, 470, { fill: C.card, stroke: C.line });
  T(cardR, 850, 238, '**E**nergetic **Y**east', { size: 44, weight: 700, anchor: 'middle', boldFill: C.ethanol });
  const yIcon = G(cardR), yIc1 = yeastCell(yIcon, 1.25, true), yIc2 = yeastCell(yIcon, 1.0, false);
  const arR = arrow(cardR, 850, 470, 850, 512, { color: C.faint, width: 5 });
  const pR = boldChip(cardR, '**E**thanol + CO₂', 'ethanol', 290, 34);

  /* ---------- beat 5: thousands of years ---------- */
  const histG = G(root);
  T(histG, 600, 218, 'for **thousands** of years', { size: 52, weight: 700, anchor: 'middle', boldFill: C.energy });
  const hLoaf = G(histG); loaf(hLoaf, 1.15);
  const hJar = G(histG);
  E('path', { d: 'M-26,-124 L26,-124 L22,-98 C70,-82 84,-20 72,40 C62,92 32,120 0,122 C-32,120 -62,92 -72,40 C-84,-20 -70,-82 -22,-98 Z', fill: ball('#D9774A', '#8E3E20'), stroke: '#6E2E16', 'stroke-width': 4 }, hJar);
  E('path', { d: 'M-22,-104 C-62,-108 -66,-66 -46,-54 M22,-104 C62,-108 66,-66 46,-54', fill: 'none', stroke: '#8E3E20', 'stroke-width': 9, 'stroke-linecap': 'round' }, hJar);
  E('path', { d: 'M-76,4 Q0,22 76,4 M-70,40 Q0,58 70,40', fill: 'none', stroke: '#F2C29A', 'stroke-width': 5, opacity: 0.6 }, hJar);
  const hLine = arrow(histG, 290, 640, 930, 640, { color: C.faint, width: 5 });
  T(histG, 290, 682, 'long ago', { size: 26, weight: 600, fill: C.muted });
  T(histG, 930, 682, 'today', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });

  /* ---------- beat 6: dough rises ---------- */
  const breadG = G(root);
  const bTitle = T(breadG, 430, 214, 'bread-making', { size: 42, weight: 700, anchor: 'middle' });
  const bowl = G(breadG); tr(bowl, 430, 540);
  E('ellipse', { rx: 200, ry: 34, fill: '#163E48', stroke: '#7FB8C5', 'stroke-width': 4 }, bowl);
  const dough = E('path', { fill: ball('#F4DDAE', '#C9A066'), stroke: '#FFF0CF', 'stroke-width': 3 }, bowl);
  const dClip = E('clipPath', { id: 'yeDoughClip' }, defs()), dClipPath = E('path', {}, dClip);
  const inDough = G(bowl, { 'clip-path': 'url(#yeDoughClip)' });
  const dr = rng(13), holes = [], specks = [];
  for (let i = 0; i < 16; i++) holes.push({ el: E('circle', { fill: 'rgba(150,108,48,0.28)', stroke: 'rgba(255,244,214,0.7)', 'stroke-width': 2 }, inDough), u: dr() * 2 - 1, v: 0.12 + dr() * 0.72, r0: 7 + dr() * 10, d: dr() * 0.5 });
  for (let i = 0; i < 12; i++) specks.push({ el: E('circle', { r: 3.5, fill: '#B48A4A' }, inDough), u: dr() * 2 - 1, v: 0.1 + dr() * 0.7 });
  E('path', { d: 'M-200,0 C-200,24 -110,34 0,34 C110,34 200,24 200,0 C200,110 120,165 0,165 C-120,165 -200,110 -200,0 Z', fill: ball('#3E8FA0', '#1F5563'), stroke: '#7FB8C5', 'stroke-width': 4 }, bowl);
  const bTxt1 = T(breadG, 0, 0, 'yeast makes\n**carbon dioxide** gas', { size: 32, weight: 600, lh: 44, boldFill: C.co2 });
  const bUp = arrow(breadG, 672, 560, 672, 410, { color: C.energy, width: 6 });
  const bTxt2 = T(breadG, 0, 0, 'the bubbles make\nthe dough **rise**', { size: 32, weight: 600, lh: 44, boldFill: C.energy });

  /* ---------- beat 7: baking ---------- */
  const bakeG = G(root);
  const oven = G(bakeG); tr(oven, 360, 448);
  E('rect', { x: -200, y: -190, width: 400, height: 380, rx: 26, fill: '#2E3B47', stroke: '#5D7183', 'stroke-width': 4 }, oven);
  E('rect', { x: -200, y: -190, width: 400, height: 58, rx: 26, fill: '#25303A' }, oven);
  [-140, -92].forEach(x => { E('circle', { cx: x, cy: -161, r: 14, fill: '#8FA3B5' }, oven); E('line', { x1: x, y1: -161, x2: x + 8, y2: -170, stroke: '#2E3B47', 'stroke-width': 4 }, oven); });
  E('circle', { cx: 150, cy: -161, r: 8, fill: C.heat }, oven);
  E('rect', { x: -120, y: -122, width: 240, height: 12, rx: 6, fill: '#8FA3B5' }, oven);
  E('rect', { x: -160, y: -94, width: 320, height: 250, rx: 18, fill: '#160F0B', stroke: '#5D7183', 'stroke-width': 4 }, oven);
  const ovGlow = E('ellipse', { cx: 0, cy: 50, rx: 190, ry: 150, fill: glow('#FF8A3D') }, oven);
  const ovLoaf = G(oven); tr(ovLoaf, 0, 100); loaf(ovLoaf, 0.9);
  const wisps = [-60, 0, 60].map((x, i) => { const w = heatWaves(bakeG, { n: 2, h: 110, spacing: 18, color: C.ethanol, width: 5, speed: 0.5 + i * 0.07 }); tr(w, 360 + x, 250); return w; });
  const wLbl = T(bakeG, 470, 196, '**ethanol** evaporates', { size: 30, weight: 600, boldFill: C.ethanol });
  const slice = G(bakeG); tr(slice, 880, 420, 1.15);
  const sliceD = 'M-95,95 L-95,-20 C-132,-40 -126,-112 -60,-112 C-30,-138 30,-138 60,-112 C126,-112 132,-40 95,-20 L95,95 Q95,107 83,107 L-83,107 Q-95,107 -95,95 Z';
  E('path', { d: sliceD, fill: '#C8833A', stroke: '#8A5221', 'stroke-width': 6, 'stroke-linejoin': 'round' }, slice);
  E('path', { d: sliceD, fill: '#F6E3B4', transform: 'translate(0 6) scale(0.82)' }, slice);
  const sr = rng(41);
  for (let i = 0; i < 14; i++) E('ellipse', { cx: -62 + sr() * 124, cy: -84 + sr() * 150, rx: 5 + sr() * 9, ry: 4 + sr() * 7, fill: '#D6B474', stroke: '#B8924F', 'stroke-width': 1.5 }, slice);
  const sTxt1 = T(bakeG, 880, 612, 'the holes stay behind', { size: 30, weight: 600, anchor: 'middle' });
  const sTxt2 = T(bakeG, 880, 666, 'light and airy', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- beat 8: brewing ---------- */
  const brewG = G(root);
  T(brewG, 390, 196, 'brewing and wine-making', { size: 40, weight: 700, anchor: 'middle' });
  const bwBottle = G(brewG); tr(bwBottle, 250, 480); wineBottle(bwBottle);
  const glassB = drinkGlass(brewG, 'yeGlassClipA', 20); tr(glassB, 470, 470);
  const bwEth = sub(brewG, 'ethanol', 'ethanol', 190), bwEthT = T(brewG, 0, 0, 'makes the alcoholic drink', { size: 28, weight: 600, anchor: 'middle' });
  const bwCO2 = sub(brewG, 'carbon dioxide', 'co2', 290), bwCO2T = T(brewG, 0, 0, 'can make it **fizzy**', { size: 28, weight: 600, anchor: 'middle', boldFill: C.water });
  const bwA1 = arrow(brewG, 722, 336, 556, 400, { color: C.ethanol, width: 4, bend: -18 });
  const bwA2 = arrow(brewG, 672, 492, 552, 520, { color: C.co2, width: 4 });

  /* ---------- beat 9: the products matter ---------- */
  const prodG = G(root);
  const enRow = G(prodG);
  const enSp = spark(enRow, 12); tr(enSp, 160, 222);
  T(enRow, 186, 234, 'energy released', { size: 32, weight: 600 });
  const enBar = meter(enRow, { w: 460, h: 30, color: C.energy }); tr(enBar, 450, 211);
  const enLit = T(enRow, 0, 0, 'only a little', { size: 28, weight: 700, fill: C.energy });
  const pBak = G(prodG), pBrw = G(prodG);
  tr(sub(pBak, 'carbon dioxide', 'co2', 300, 36), 0, 0);
  const pLoaf = G(pBak); tr(pLoaf, 0, 135); loaf(pLoaf, 0.72);
  T(pBak, 0, 230, 'bakers', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  tr(sub(pBrw, 'ethanol', 'ethanol', 210, 36), 0, 0);
  const pGlass = drinkGlass(pBrw, 'yeGlassClipB', 10); tr(pGlass, 0, 128, 0.5);
  T(pBrw, 0, 230, 'brewers', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  const pHead = T(prodG, 600, 356, 'the **products** are what matter', { size: 44, weight: 700, anchor: 'middle', boldFill: C.energy });

  /* ---------- beat 10: try it at home ---------- */
  const balG = G(root);
  const hdr = T(balG, 640, 250, 'Try it at home', { size: 44, weight: 700, fill: C.energy });
  const ingr = [];
  {
    const g1 = G(balG); E('path', { d: 'M0,-22 C10,-8 16,0 16,8 C16,18 8,24 0,24 C-8,24 -16,18 -16,8 C-16,0 -10,-8 0,-22 Z', fill: C.water }, g1);
    const hw = heatWaves(g1, { n: 2, h: 26, spacing: 10, width: 3 }); tr(hw, 26, 4);
    T(g1, 52, 12, 'warm water', { size: 32, weight: 600 });
    const g2 = G(balG); E('rect', { x: -14, y: -14, width: 28, height: 28, rx: 4, fill: '#F4F7FA', stroke: '#AEB9C6', 'stroke-width': 2 }, g2);
    T(g2, 52, 12, 'sugar', { size: 32, weight: 600 });
    const g3 = G(balG); yeastCell(g3, 0.5, true);
    T(g3, 52, 12, 'yeast', { size: 32, weight: 600 });
    ingr.push({ g: g1, hw }, { g: g2 }, { g: g3 });
  }
  const BX = 470, BY = 660;
  const bottle = G(balG); tr(bottle, BX, BY);
  const bD = 'M-25,-330 L25,-330 L25,-290 C25,-262 75,-252 75,-215 L75,-20 Q75,0 55,0 L-55,0 Q-75,0 -75,-20 L-75,-215 C-75,-252 -25,-262 -25,-290 Z';
  const bcp = E('clipPath', { id: 'yeBottleClip' }, defs()); E('path', { d: bD }, bcp);
  const inBot = G(bottle, { 'clip-path': 'url(#yeBottleClip)' });
  const liquid = E('rect', { x: -80, y: 0, width: 160, height: 0, fill: linGrad('#FFDDAA', '#E7A453', true), opacity: 0.85 }, inBot);
  const botBub = bubbles(inBot, -60, -104, 120, 98, { n: 14, r: 5, speed: 0.4, seed: 8, fill: 'rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.9)' });
  const drops = [];
  const pr = rng(19);
  for (let i = 0; i < 12; i++) {
    const sugar = i < 6;
    const el = sugar ? E('rect', { x: -5, y: -5, width: 10, height: 10, rx: 2, fill: '#F4F7FA' }, inBot) : E('circle', { r: 5.5, fill: '#E3C88E', stroke: '#B48A4A', 'stroke-width': 1.5 }, inBot);
    drops.push({ el, sugar, k: sugar ? i : i - 6, x: (pr() - 0.5) * 30, xe: (pr() - 0.5) * 100 });
  }
  E('path', { d: bD, fill: 'rgba(200,230,245,0.1)', stroke: '#BFE3F2', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bottle);
  E('path', { d: 'M-58,-200 L-58,-30', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.2, 'stroke-linecap': 'round' }, bottle);
  const balloon = G(balG);
  const bBody = E('ellipse', { fill: ball('#FF7B54', '#C2412A'), stroke: '#FFB49E', 'stroke-width': 3 }, balloon);
  const bShine = E('ellipse', { fill: '#FFFFFF', opacity: 0.3 }, balloon);
  const bBand = E('rect', { x: BX - 30, y: 318, width: 60, height: 22, rx: 8, fill: '#E05A3A', stroke: '#FFB49E', 'stroke-width': 2 }, balG);
  const clockG = G(balG); tr(clockG, 930, 560);
  E('circle', { r: 72, fill: '#F4F7FA', stroke: '#8FB0C2', 'stroke-width': 6 }, clockG);
  const wedge = E('path', { fill: 'rgba(255,196,60,0.55)' }, clockG);
  for (let i = 0; i < 12; i++) { const a = i * TAU / 12; E('line', { x1: Math.sin(a) * 56, y1: -Math.cos(a) * 56, x2: Math.sin(a) * 64, y2: -Math.cos(a) * 64, stroke: '#5E7484', 'stroke-width': i % 3 ? 3 : 5, 'stroke-linecap': 'round' }, clockG); }
  const hand = E('line', { x1: 0, y1: 6, x2: 0, y2: -54, stroke: '#2B3A55', 'stroke-width': 6, 'stroke-linecap': 'round' }, clockG);
  E('circle', { r: 7, fill: '#2B3A55' }, clockG);
  const clkTxt = T(clockG, 0, 116, '0 min', { size: 32, weight: 700, anchor: 'middle' });
  const co2Lbl = G(balG);
  T(co2Lbl, 352, 186, 'carbon dioxide', { size: 30, weight: 700, fill: C.co2, anchor: 'end' });
  const co2Arr = arrow(co2Lbl, 362, 180, 394, 204, { color: C.co2, width: 4 });

  return t => {
    /* beat 1 + 2: the microscope, then it shrinks to the corner */
    const micA = vis(t, -1, end('ethanol') + 0.05);
    op(mic, micA);
    if (micA > 0) {
      const mv = P(t, at('eq') - 0.1, 0.9);
      tr(mic, lerp(360, 200, mv), lerp(410, 580, mv), lerp(1, 0.5, mv));
      op(micLbl, 1 - mv);
      cells.forEach((o, i) => {
        const j = S.reduce ? 0 : 1;
        tr(o.c, o.x + j * 5 * Math.sin(t * 0.7 + o.ph), o.y + j * 4 * Math.cos(t * 0.6 + o.ph * 1.3), 1, o.r + j * 6 * Math.sin(t * 0.4 + o.ph));
      });
      micBub.upd(t, P(t, mid('eq', 0.6), 1.2, linear));
    }
    const y1A = vis(t, -1, end('yeast') + 0.05);
    op(y1, y1A);
    if (y1A > 0) {
      riseAt(yT, 660, 262, t, at('yeast') + 0.05);
      riseAt(yS, 660, 318, t, mid('yeast', 0.2));
      riseAt(yNo, 682, 420, t, mid('yeast', 0.5));
      const xp = P(t, mid('yeast', 0.5) + 0.35, 0.35, pop); op(yNoX, clamp(xp * 2)); tr(yNoX, 0, -10, Math.max(0.01, xp));
      riseAt(yF, 660, 534, t, mid('yeast', 0.8));
    }

    /* beat 2: glucose -> ethanol + carbon dioxide (+ a little energy) */
    const eqA = vis(t, at('eq'), end('ethanol') + 0.05);
    op(eqG, eqA);
    if (eqA > 0) {
      riseAt(ours, 0, 0, t, at('eq') + 0.15);
      op(ours, P(t, at('eq') + 0.15, 0.5, linear) * (1 - 0.45 * P(t, mid('eq', 0.4), 0.6, linear)));
      popAt(eGlu, 420, 300, t, mid('eq', 0.36));
      eArr.set(P(t, mid('eq', 0.44), 0.5)); op(eArr, P(t, mid('eq', 0.44), 0.15, linear));
      popAt(eEth, 730, 300, t, mid('eq', 0.5));
      popAt(ePlus, 848, 314, t, mid('eq', 0.58));
      popAt(eCO2, 1010, 300, t, mid('eq', 0.6));
      riseAt(eEn, 0, 0, t, mid('eq', 0.8));
      eSp.upd(t);
      const gl = P(t, at('ethanol'), 0.5, linear);
      op(ethGlow, gl * (0.7 + 0.3 * wave(t, 1.2)));
    }
    /* beat 3: ethanol is the alcohol in alcoholic drinks */
    const ethA = vis(t, at('ethanol'), end('ethanol') + 0.05);
    op(ethG, ethA);
    if (ethA > 0) {
      ethArr.set(P(t, at('ethanol') + 0.1, 0.5)); op(ethArr, P(t, at('ethanol') + 0.1, 0.15, linear));
      popAt(bottleE, 730, 560, t, mid('ethanol', 0.3), 0.8);
      riseAt(ethTxt, 0, 0, t, mid('ethanol', 0.4));
    }

    /* beat 4: Lazy Athletes, Energetic Yeast */
    const lzA = vis(t, at('lazy'), end('lazy') + 0.05);
    op(lazyG, lzA);
    if (lzA > 0) {
      riseAt(cardL, 0, 0, t, mid('lazy', 0.2));
      riseAt(cardR, 0, 0, t, mid('lazy', 0.36));
      tr(runIcon, 350, 384 + (S.reduce ? 0 : 3 * Math.sin(t * 3)), 1.15);
      const b = S.reduce ? 0 : Math.abs(Math.sin(t * 4.2)) * 14;
      tr(yIc1, -22, -b, 1, -10);
      tr(yIcon, 838, 396, 1.35);
      tr(yIc2, 46, 34 - Math.abs(Math.sin(t * 4.2 + 1.3)) * (S.reduce ? 0 : 12), 1, 20);
      arL.set(P(t, mid('lazy', 0.56), 0.4)); op(arL, P(t, mid('lazy', 0.56), 0.1, linear));
      popAt(pL, 350, 566, t, mid('lazy', 0.6));
      arR.set(P(t, mid('lazy', 0.8), 0.4)); op(arR, P(t, mid('lazy', 0.8), 0.1, linear));
      popAt(pR, 850, 566, t, mid('lazy', 0.84));
    }

    /* beat 5: thousands of years */
    const hA = vis(t, at('history'), end('history') + 0.05);
    op(histG, hA);
    if (hA > 0) {
      popAt(hLoaf, 430, 470, t, at('history') + 0.2);
      popAt(hJar, 770, 452, t, mid('history', 0.35));
      hLine.set(P(t, at('history') + 0.3, 1.6));
    }

    /* beat 6: yeast makes CO2 bubbles, the dough rises */
    const brA = vis(t, at('bread'), end('bread') + 0.3);
    op(breadG, brA);
    if (brA > 0) {
      const rp = P(t, mid('bread', 0.3), end('bread') - mid('bread', 0.3) + 0.6);
      const h = lerp(46, 150, rp);
      const d = `M-186,14 C-186,${(-h * 0.6).toFixed(1)} -118,${(-h).toFixed(1)} 0,${(-h).toFixed(1)} C118,${(-h).toFixed(1)} 186,${(-h * 0.6).toFixed(1)} 186,14 Z`;
      dough.setAttribute('d', d); dClipPath.setAttribute('d', d);
      holes.forEach(o => {
        const g = P(t, mid('bread', 0.25) + o.d, 1.2, easeOut);
        attr(o.el, 'cx', o.u * 150 * (1 - 0.35 * o.v)); attr(o.el, 'cy', -o.v * h * 0.86 + 8);
        attr(o.el, 'r', o.r0 * (0.25 + 0.75 * g) * (0.75 + 0.35 * rp));
        op(o.el, g);
      });
      specks.forEach(o => { attr(o.el, 'cx', o.u * 150 * (1 - 0.35 * o.v)); attr(o.el, 'cy', -o.v * h * 0.86 + 8); });
      riseAt(bTxt1, 712, 320, t, mid('bread', 0.25));
      bUp.set(P(t, mid('bread', 0.62), 0.6)); op(bUp, P(t, mid('bread', 0.62), 0.15, linear));
      riseAt(bTxt2, 712, 470, t, mid('bread', 0.64));
    }

    /* beat 7: in the oven, ethanol evaporates, the holes stay */
    const bkA = vis(t, at('bake'), end('bake') + 0.05);
    op(bakeG, bkA);
    if (bkA > 0) {
      op(ovGlow, 0.55 + 0.25 * wave(t, 1.6));
      const wa = P(t, mid('bake', 0.16), 0.5, linear);
      wisps.forEach(w => { op(w, wa); w.upd(t); });
      riseAt(wLbl, 0, 0, t, mid('bake', 0.2));
      popAt(slice, 880, 420, t, mid('bake', 0.44), 1.15);
      riseAt(sTxt1, 0, 0, t, mid('bake', 0.5));
      riseAt(sTxt2, 0, 0, t, mid('bake', 0.72));
    }

    /* beat 8: brewing: ethanol makes the drink, CO2 the fizz */
    const bwA = vis(t, at('brew'), end('brew') + 0.05);
    op(brewG, bwA);
    if (bwA > 0) {
      glassB.bub.upd(t, 0.35 + 0.65 * P(t, mid('brew', 0.62), 0.8, linear));
      popAt(bwEth, 820, 326, t, mid('brew', 0.32));
      riseAt(bwEthT, 820, 388, t, mid('brew', 0.36));
      bwA1.set(P(t, mid('brew', 0.4), 0.5)); op(bwA1, P(t, mid('brew', 0.4), 0.1, linear));
      popAt(bwCO2, 820, 488, t, mid('brew', 0.62));
      riseAt(bwCO2T, 820, 550, t, mid('brew', 0.66));
      bwA2.set(P(t, mid('brew', 0.7), 0.5)); op(bwA2, P(t, mid('brew', 0.7), 0.1, linear));
    }

    /* beat 9: little energy, but the products matter */
    const pA = vis(t, at('products'), end('products') + 0.05);
    op(prodG, pA);
    if (pA > 0) {
      riseAt(enRow, 0, 0, t, at('products') + 0.1);
      enBar.set(0.07 * P(t, mid('products', 0.15), 0.8, easeOut));
      riseAt(enLit, 450 + 0.07 * 460 + 18, 236, t, mid('products', 0.25));
      enSp.upd(t);
      popAt(pBak, 400, 452, t, mid('products', 0.45));
      popAt(pBrw, 800, 452, t, mid('products', 0.56));
      pGlass.bub.upd(t, 1);
      riseAt(pHead, 0, 0, t, mid('products', 0.72));
    }

    /* beat 10: the balloon experiment */
    const bA = vis(t, at('balloon'), D + 10);
    op(balG, bA);
    if (bA > 0) {
      riseAt(hdr, 0, 0, t, at('balloon'));
      const ingAt = [mid('balloon', 0.12), mid('balloon', 0.2), mid('balloon', 0.26)];
      ingr.forEach((o, i) => { riseAt(o.g, 650, 330 + i * 62, t, ingAt[i]); if (o.hw) o.hw.upd(t); });
      const lq = P(t, ingAt[0], 0.9);
      attr(liquid, 'y', -112 * lq); attr(liquid, 'height', 112 * lq + 4);
      drops.forEach(o => {
        const t0 = (o.sugar ? ingAt[1] : ingAt[2]) + 0.1 + o.k * 0.09, u = (t - t0) / 0.9;
        if (u <= 0 || u >= 1.6) { op(o.el, 0); return; }
        const fall = clamp(u), y = lerp(-340, -24 - (o.sugar ? 0 : 6), easeIn(fall));
        tr(o.el, lerp(o.x, o.xe, fall), y, 1, u * 200);
        op(o.el, o.sugar ? 1 - P(u, 1.0, 0.6, linear) : 1 - 0.3 * P(u, 1, 0.6, linear));
      });
      const fz = P(t, mid('balloon', 0.6), 1.2, linear);
      botBub.upd(t, fz);
      const showB = P(t, mid('balloon', 0.4), 0.4, linear);
      op(balloon, showB); op(bBand, showB);
      const f = P(t, mid('balloon', 0.62), end('balloon') - mid('balloon', 0.62) + 0.6);
      const rx = lerp(30, 90, f), ry = lerp(34, 106, f), rot = lerp(64, 0, f) + (S.reduce ? 0 : 2 * Math.sin(t * 1.3) * f);
      balloon.setAttribute('transform', `translate(${BX} 326) rotate(${rot.toFixed(2)})`);
      attr(bBody, 'cx', 0); attr(bBody, 'cy', -ry * 0.9); attr(bBody, 'rx', rx); attr(bBody, 'ry', ry);
      attr(bShine, 'cx', -rx * 0.38); attr(bShine, 'cy', -ry * 1.25); attr(bShine, 'rx', rx * 0.18); attr(bShine, 'ry', ry * 0.22);
      popAt(clockG, 930, 560, t, mid('balloon', 0.56));
      const cl = P(t, mid('balloon', 0.6), end('balloon') - mid('balloon', 0.6) + 0.4, linear), a = cl * Math.PI;
      hand.setAttribute('transform', `rotate(${(a * 180 / Math.PI).toFixed(1)})`);
      wedge.setAttribute('d', cl > 0.001 ? `M0,0 L0,-52 A52,52 0 0,1 ${(Math.sin(a) * 52).toFixed(1)},${(-Math.cos(a) * 52).toFixed(1)} Z` : '');
      setText(clkTxt, Math.round(cl * 30) + ' min');
      op(co2Lbl, P(t, mid('balloon', 0.8), 0.5, linear));
      co2Arr.set(P(t, mid('balloon', 0.82), 0.5));
    }
  };
});

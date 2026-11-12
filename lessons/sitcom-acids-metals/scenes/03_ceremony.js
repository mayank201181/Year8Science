/* Scene 3: The ceremony (neutralisation).
   Lab close-up: Kavya squeezes the dropper over the red beaker -> the venue at pH 1: Indi officiates, Hal and
   Natalie at the arch, Henry the best man -> NEUTRALISATION card, pH pointer slides towards 7 -> acid + base ->
   salt + water (A, B, S, W) -> the vows: Hal's ring box holds an H+, Natalie's an OH- (wiped first) -> the ions
   snap into one water molecule -> the full word equation, Na+ and Cl- pair up -> a salt shaker; "you're table salt
   now" and a tiny veil lands on it -> split screen: drops step the beaker, Indi and the venue red -> orange ->
   yellow -> GREEN (pH 7), everyone freezes -> Kavya's big purple blob -> blue -> purple (pH 12) -> not just
   diluting: a reaction, new substances -> uses: antacid tablets, lime on soil -> "my dad after chilli crab". */
scene('ceremony', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed cer) ---------- */
  // camera: world point (cx, cy) shown at screen (px, py), zoom k
  const cerCam = (el, cx, cy, k, px, py) => el.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const cerPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const cerChip = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.92)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 }); };
  const cerPanel = (parent, x, y, w, h, col) => card(parent, x, y, w, h, { fill: 'rgba(10,22,32,0.93)', stroke: col || C.line, sw: 4 });
  const cerClip = (el, id) => { if (id) el.setAttribute('clip-path', `url(#${id})`); else el.removeAttribute('clip-path'); };
  const lookAt = (from, to) => clamp((to - from) / 220, -1, 1);
  function cerClipRect(id, x, w) { const cp = E('clipPath', { id }, defs()); E('rect', { x, y: 0, width: w, height: 750 }, cp); }
  cerClipRect('cerClipL', 0, 597); cerClipRect('cerClipR', 603, 597);

  // Kavya's arm and hand gripping the dropper bulb (hand origin = bulb centre); g.set(squeeze)
  function cerHand(parent) {
    const g = G(parent), skin = '#B9784E';
    const thumb = G(g), fingers = G(g);
    E('path', { d: 'M-40,-18 Q-46,0 -38,16 L-18,14 Q-14,0 -18,-16 Z', fill: skin, stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, thumb);
    [-20, -2, 16].forEach(y => E('rect', { x: 14, y: y - 8, width: 34, height: 17, rx: 8, fill: skin, stroke: SC_INK, 'stroke-width': 3 }, fingers));
    E('path', { d: 'M40,-34 Q74,-34 78,-4 Q80,26 46,30 L34,30 L34,-34 Z', fill: skin, stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, fingers);
    g.set = sq => { tr(thumb, 6 * sq, 0); tr(fingers, -6 * sq, 0); };
    g.set(0);
    return g;
  }
  // a salt shaker; the label sits on a tag below it
  function cerShaker(parent) {
    const g = G(parent);
    E('path', { d: 'M-50,-58 L50,-58 L60,78 Q60,90 48,90 L-48,90 Q-60,90 -60,78 Z', fill: 'rgba(225,240,250,0.85)', stroke: '#9FB3C2', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-55,6 L55,6 L60,78 Q60,90 48,90 L-48,90 Q-60,90 -60,78 Z', fill: '#FFFFFF' }, g);
    let d = ''; const r = rng(55);
    for (let i = 0; i < 16; i++) d += `M${(-44 + r() * 86).toFixed(1)},${(16 + r() * 64).toFixed(1)} h3 `;
    E('path', { d, stroke: '#B9C9D6', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-54,-58 L-54,-80 Q-54,-106 0,-108 Q54,-106 54,-80 L54,-58 Z', fill: ball('#E4EAF0', '#8D9AA8'), stroke: '#5F6B78', 'stroke-width': 4 }, g);
    E('path', { d: 'M-22,-90 h1 M0,-95 h1 M22,-90 h1 M-11,-76 h1 M11,-76 h1', stroke: '#3A4652', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    // the tiny veil + tiara that lands on it
    g.veil = G(g);
    E('path', { d: 'M-40,-96 C-74,-60 -78,-10 -70,30 L-46,24 C-54,-6 -46,-50 -20,-88 Z M40,-96 C74,-60 78,-10 70,30 L46,24 C54,-6 46,-50 20,-88 Z', fill: '#FBF8FF', opacity: 0.9, stroke: '#CFC6EA', 'stroke-width': 3 }, g.veil);
    E('path', { d: 'M-26,-104 L-16,-122 L-6,-108 L0,-128 L6,-108 L16,-122 L26,-104 Z', fill: '#E8EEF5', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g.veil);
    return g;
  }
  // ring box with an open lid; the ion sits at (0, -36)
  function cerBox(parent) {
    const g = G(parent);
    E('path', { d: 'M-46,-8 L-40,-68 L40,-68 L46,-8 Z', fill: '#B0264A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-36,-14 L-32,-60 L32,-60 L36,-14 Z', fill: '#FFE3EC', opacity: 0.9 }, g);
    E('rect', { x: -52, y: -12, width: 104, height: 50, rx: 10, fill: ball('#D8436A', '#7E1A36'), stroke: SC_INK, 'stroke-width': 4 }, g);
    E('ellipse', { cx: 0, cy: -10, rx: 40, ry: 9, fill: '#FFF1F5', stroke: SC_INK, 'stroke-width': 3 }, g);
    return g;
  }
  const cerHeart = 'M0,26 C-52,-6 -44,-50 0,-26 C44,-50 52,-6 0,26 Z';

  const Lbg = G(root), Lfg = G(root), Lhud = G(root);

  /* =====================================================================
     LAB: Kavya, the bench, the beaker, the dropper
     ===================================================================== */
  const labShot = G(Lbg), labW = G(labShot);
  const lab = ngLab(labW);
  const kavAW = G(labW), kavA = cast(kavAW, 'kavya', { goggles: 'on', mood: 'annoyed' }); tr(kavAW, 300, 400, 1.55);
  const kavBW = G(labW), kavB = cast(kavBW, 'kavya', { goggles: 'up', mood: 'deadpan' }); tr(kavBW, 300, 400, 1.55);
  const arm = G(labW);
  const ARM = 'M432,512 Q560,330 728,166';
  E('path', { d: ARM, fill: 'none', stroke: SC_INK, 'stroke-width': 40, 'stroke-linecap': 'round' }, arm);
  E('path', { d: ARM, fill: 'none', stroke: '#B9784E', 'stroke-width': 32, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M420,530 L476,452', stroke: '#2E7DD8', 'stroke-width': 54, 'stroke-linecap': 'round' }, arm);
  ngBench(labW, 560);
  const BK = [760, 445], TIP = [760, 318], SURF = 429;
  const bk = beaker(labW, 200, 230, { level: 0.62, liquid: ngPH(1) }); tr(bk, BK[0], BK[1]);
  const swirl = G(labW); tr(swirl, BK[0], 478);
  const sw1 = E('ellipse', { rx: 60, ry: 34, fill: ngPH(13), opacity: 0.85 }, swirl);
  const sw2 = E('path', { d: 'M-40,0 Q-20,-26 10,-12 Q34,0 20,18 Q4,30 -14,14', fill: 'none', stroke: '#B9A0FF', 'stroke-width': 7, 'stroke-linecap': 'round' }, swirl);
  const ripple = E('ellipse', { cx: BK[0], cy: SURF + 2, rx: 10, ry: 4, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, labW);
  const splash = G(labW);
  const splDrops = [-1, -0.4, 0.4, 1].map(() => E('circle', { r: 7, fill: ngPH(13), stroke: '#FFFFFF', 'stroke-width': 2 }, splash));
  const drpW = G(labW); tr(drpW, TIP[0], TIP[1]);
  const drp = ngDropper(drpW, 0.75); drp.set(0, ngPH(13));
  const hand = cerHand(drpW); tr(hand, 0, -187);
  // lab labels
  const acidTag = cerChip(Lfg, 'acid + indicator: pH 1', { size: 28, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF' });
  const alkTag = cerChip(Lfg, 'ALKALI', { size: 28, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF' });
  const begins = cerChip(Lfg, 'the ceremony begins', { size: 32, color: C.energy });
  // dad: the chilli crab inset
  const crab = G(Lfg); tr(crab, 920, 232);
  cerPanel(crab, -190, -126, 380, 252, '#FFB03A');
  E('ellipse', { cx: -30, cy: 18, rx: 120, ry: 50, fill: '#F7F4EE', stroke: '#BFB4A2', 'stroke-width': 4 }, crab);
  E('path', { d: 'M-110,30 L-140,50 M-100,40 L-124,66 M50,30 L80,50 M40,40 L64,66', stroke: '#C2361F', 'stroke-width': 7, 'stroke-linecap': 'round' }, crab);
  E('path', { d: 'M-104,-14 Q-130,-44 -100,-56 Q-96,-38 -84,-30 M44,-14 Q70,-44 40,-56 Q36,-38 24,-30', fill: '#E4472A', stroke: '#8E2412', 'stroke-width': 4, 'stroke-linejoin': 'round' }, crab);
  E('ellipse', { cx: -30, cy: 8, rx: 70, ry: 38, fill: ball('#FF6A3D', '#B22A12'), stroke: '#8E2412', 'stroke-width': 4 }, crab);
  E('path', { d: 'M-20,-6 Q-8,-24 6,-10 M-40,22 q-6,-10 6,-14', fill: 'none', stroke: '#7A1E0E', 'stroke-width': 4 }, crab);
  E('path', { d: 'M70,30 Q90,10 104,24', fill: 'none', stroke: '#2E8B3A', 'stroke-width': 9, 'stroke-linecap': 'round' }, crab);
  const tab = G(crab); tr(tab, 130, -10);
  E('circle', { r: 30, fill: '#FFFFFF', stroke: '#9FB3C2', 'stroke-width': 4 }, tab);
  E('path', { d: 'M-18,0 L18,0', stroke: '#9FB3C2', 'stroke-width': 4 }, tab);
  T(crab, -30, 106, 'chilli crab', { size: 30, weight: 700, anchor: 'middle', fill: '#FFB03A' });
  T(crab, 130, 58, '+ antacid', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });

  /* =====================================================================
     VENUE: inside the beaker (world coordinates; the camera moves venW)
     ===================================================================== */
  const venShot = G(Lbg), venW = G(venShot);
  const venue = ngVenue(venW);
  const POS = { indi: [600, 526], hal: [330, 545], natalie: [875, 545], henry: [165, 615] };
  const mk = (kind, s, o) => { const w = G(venW); tr(w, POS[kind][0], POS[kind][1], s); return cast(w, kind, o || {}); };
  const spaGlow = E('ellipse', { cx: 600, cy: 500, rx: 230, ry: 200, fill: glow('#7CE38F') }, venW);
  const indi = mk('indi', 0.95, { ph: 1 });
  const hal = mk('hal', 0.95), nat = mk('natalie', 0.95), henry = mk('henry', 0.75);
  const BOXH = [462, 525], BOXN = [738, 525];
  const boxH = cerBox(venW), boxN = cerBox(venW);
  const ionH = ngIon(venW, 'H+', 28), ionOH = ngIon(venW, 'OH-', 28);
  const suds = G(venW);
  [[-30, 18, 9], [26, 20, 7], [34, -22, 6], [-36, -18, 6]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: 'rgba(255,255,255,0.25)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, suds));
  const cloth = G(venW);
  E('rect', { x: -34, y: -22, width: 68, height: 44, rx: 10, fill: '#8FD3FF', stroke: SC_INK, 'stroke-width': 3 }, cloth);
  E('path', { d: 'M-24,-6 L24,-6 M-24,8 L24,8', stroke: '#5AB4E0', 'stroke-width': 3 }, cloth);
  const shine = spark(venW, 14);
  const water = G(venW); tr(water, 600, 300);
  E('circle', { r: 64, fill: glow('#FFFFFF') }, water);
  molH2O(water, 36);
  const heart = E('path', { d: cerHeart, fill: '#FF6FB5', stroke: '#FFFFFF', 'stroke-width': 3 }, venW);
  const SHK = [1060, 505];
  const shaker = cerShaker(venW); tr(shaker, SHK[0], SHK[1], 0.85);

  /* overlays for the venue */
  // what: card with the subtitle and a small pH scale
  const whatG = G(Lfg);
  cerPanel(whatG, 150, 112, 900, 292, ngPH(7));
  T(whatG, 600, 242, '**acid + base** react and cancel out', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const phsG = G(whatG); tr(phsG, 600, 322);
  const phs = ngPhScale(phsG, 600);
  const neut = cerChip(Lfg, 'NEUTRALISATION', { size: 50, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  // eq: acid + base -> salt + water, then A B S W
  const eqG = G(Lfg);
  cerPanel(eqG, 120, 112, 960, 250, C.energy);
  const eq = ngEq(eqG, ['acid', '+', 'base', '→', 'salt', '+', 'water'], { size: 56, colors: { acid: '#FF8A7A', base: '#C9B0FF', salt: '#FFFFFF', water: C.water } });
  tr(eq, 600, 196);
  const abswG = G(eqG), absw = [];
  ['A', 'B', 'S', 'W'].forEach((L, i) => {
    const b = G(abswG);
    E('circle', { r: 30, fill: C.energy, stroke: '#FFFFFF', 'stroke-width': 3 }, b);
    T(b, 0, 13, L, { size: 38, weight: 800, anchor: 'middle', fill: '#3A3000' });
    absw.push(b);
  });
  // vows
  const vowH = G(Lfg);
  cerPanel(vowH, -210, -62, 420, 124, '#FFFFFF');
  T(vowH, -20, 14, 'hydrogen ions', { size: 34, weight: 700, anchor: 'middle' });
  ngFormula(vowH, 140, 18, 'H^+', { size: 52, fill: '#FFFFFF' });
  const vowN = G(Lfg);
  cerPanel(vowN, -230, -62, 460, 124, ngPH(13));
  T(vowN, -40, 14, 'hydroxide ions', { size: 34, weight: 700, anchor: 'middle' });
  ngFormula(vowN, 136, 18, 'OH^-', { size: 52, fill: '#C9B0FF' });
  const washed = cerChip(Lfg, 'freshly washed', { size: 30, color: '#9FF3FF' });
  // ions: the formula
  const ionsG = G(Lfg);
  cerPanel(ionsG, 250, 108, 700, 112, '#FFFFFF');
  const fL = ngFormula(ionsG, 662, 186, 'H^+ + OH^- →', { size: 56, anchor: 'end', fill: '#FFFFFF' });
  const fR = ngFormula(ionsG, 688, 186, 'H_2O', { size: 56, anchor: 'start', fill: C.water });
  const waterChip = cerChip(Lfg, 'water', { size: 32, color: C.water });
  // example: the full word equation + Na+ Cl- pairing up
  const exG = G(Lfg);
  cerPanel(exG, 70, 112, 1060, 250, C.energy);
  const exEq = ngEq(exG, ['hydrochloric acid', '+', 'sodium hydroxide', '→', '\n', 'sodium chloride', '+', 'water'], { size: 42, colors: { 'hydrochloric acid': '#FF8A7A', 'sodium hydroxide': '#C9B0FF', 'sodium chloride': '#FFFFFF', water: C.water } });
  tr(exEq, 560, 237);
  const naIon = ngIon(Lfg, 'Na+', 30), clIon = ngIon(Lfg, 'Cl-', 30);
  const saltTag = T(Lfg, 990, 336, 'salt', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  // table
  const qMark = T(Lfg, 0, 0, '?', { size: 96, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const shkTag = cerChip(Lfg, 'sodium chloride', { size: 30, fill: '#FFFFFF', color: SC_INK, stroke: '#9FB3C2' });
  const tableChip = cerChip(Lfg, '= table salt', { size: 40, color: C.energy });
  // confetti
  const confG = G(Lfg), conf = [], cr = rng(808), CONF = ['#FF6FB5', '#FFE45C', '#9FD8FF', '#FFFFFF', '#7CE38F'];
  for (let i = 0; i < 26; i++) conf.push({ el: E('rect', { x: -7, y: -4, width: 14, height: 8, rx: 2, fill: CONF[i % 5] }, confG), x: 30 + cr() * 1140, v: 110 + cr() * 90, d: cr() * 1.6, s: cr() * 6, w: 1.5 + cr() * 2 });
  // little / green / much
  const divider = E('rect', { x: 596, y: 0, width: 8, height: 750, fill: '#FFFFFF' }, Lfg);
  const phRead = G(Lfg); tr(phRead, 300, 664);
  const phReadBox = E('rect', { x: -110, y: -36, width: 220, height: 72, rx: 36, fill: ngPH(1), stroke: '#FFFFFF', 'stroke-width': 4 }, phRead);
  const phReadTxt = T(phRead, 0, 14, 'pH 1', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const littleChip = G(Lfg);
  cerPanel(littleChip, -270, -74, 540, 148, ngPH(4));
  T(littleChip, 0, -16, 'too **little** alkali:', { size: 34, weight: 600, anchor: 'middle', boldFill: '#FFB070' });
  T(littleChip, 0, 40, 'still ACIDIC', { size: 40, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  const keepGo = cerChip(Lfg, '← keep going, Giant!', { size: 32, color: C.energy });
  const greenChip = cerChip(Lfg, 'pH 7: NEUTRAL', { size: 56, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF', sw: 5 });
  const freeze = cerChip(Lfg, 'nobody touch anything', { size: 30, color: '#FFFFFF' });
  const muchChip = cerChip(Lfg, 'too MUCH alkali: ALKALINE', { size: 44, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 4 });
  const mixG = G(Lfg);
  cerPanel(mixG, -290, -40, 580, 80, '#FFFFFF');
  T(mixG, 0, 13, 'mixing ≠ automatically pH 7', { size: 34, weight: 700, anchor: 'middle' });
  const needMe = cerChip(Lfg, 'use an INDICATOR', { size: 32, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF' });
  // notjust card
  const njG = G(Lfg);
  cerPanel(njG, 600, 118, 540, 520, C.energy);
  const can = G(njG); tr(can, 730, 250);
  E('path', { d: 'M-50,-30 L40,-30 L46,50 L-56,50 Z', fill: '#5FA8D9', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M40,6 L104,-50 L114,-40 L46,26 Z', fill: '#5FA8D9', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M-50,-14 Q-96,-20 -86,20 Q-80,40 -54,34', fill: 'none', stroke: SC_INK, 'stroke-width': 8 }, can);
  const canX = cross(njG, 46); tr(canX, 730, 250);
  T(njG, 940, 236, 'just watering', { size: 32, weight: 700, anchor: 'middle', fill: C.muted });
  T(njG, 940, 276, 'it down?', { size: 32, weight: 700, anchor: 'middle', fill: C.muted });
  const njNo = T(njG, 940, 330, 'NO', { size: 40, weight: 800, anchor: 'middle', fill: C.bad });
  const njR1 = T(njG, 870, 430, 'a **CHEMICAL REACTION**', { size: 34, weight: 600, anchor: 'middle', boldFill: C.energy });
  const njR2 = T(njG, 870, 488, '→ **NEW** substances:', { size: 34, weight: 600, anchor: 'middle', boldFill: C.good });
  const njR3 = G(njG);
  T(njR3, 840, 566, 'a salt + water', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const njTick = tick(njR3, 22); tr(njTick, 1040, 552);
  const njLine = E('line', { x1: 640, y1: 372, x2: 1100, y2: 372, stroke: C.line, 'stroke-width': 3 }, njG);

  /* =====================================================================
     USES: antacid tablets and lime on soil
     ===================================================================== */
  const usesShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E1E2C', '#183650', true) }, usesShot);
  const uL = G(usesShot), uR = G(usesShot);
  cerPanel(uL, 50, 120, 530, 560, '#9FD8FF');
  T(uL, 315, 176, 'INDIGESTION TABLETS', { size: 34, weight: 800, anchor: 'middle', fill: '#9FD8FF' });
  const box = G(uL); tr(box, 175, 330);
  E('rect', { x: -84, y: -60, width: 168, height: 120, rx: 10, fill: '#FFFFFF', stroke: '#5F6B78', 'stroke-width': 4 }, box);
  E('rect', { x: -84, y: -60, width: 168, height: 40, rx: 10, fill: '#2E7DD8' }, box);
  T(box, 0, -30, 'ANTACID', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('circle', { cx: -30, cy: 22, r: 22, fill: '#F2F7FA', stroke: '#9FB3C2', 'stroke-width': 3 }, box);
  E('circle', { cx: 30, cy: 22, r: 22, fill: '#F2F7FA', stroke: '#9FB3C2', 'stroke-width': 3 }, box);
  T(uL, 175, 434, 'contains a', { size: 28, weight: 600, anchor: 'middle', fill: C.ink });
  T(uL, 175, 470, '**BASE**', { size: 34, weight: 600, anchor: 'middle', boldFill: '#C9B0FF' });
  const uArrow = arrow(uL, 270, 330, 340, 330, { color: C.energy, width: 6 });
  const stomach = E('path', { d: 'M-22,-110 C2,-122 28,-108 22,-74 C16,-40 70,-46 86,0 C102,56 50,104 -6,96 C-70,88 -86,34 -50,6 C-24,-14 -46,-56 -22,-110 Z', fill: ngPH(1), stroke: '#FFD0D5', 'stroke-width': 5 }, uL);
  tr(stomach, 450, 340);
  const stTxt = T(uL, 400, 520, 'excess stomach **ACID**', { size: 30, weight: 600, anchor: 'middle', boldFill: '#FF8A7A' });
  const stOk = cerChip(uL, 'neutralised', { size: 32, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF' }); tr(stOk, 315, 600);
  cerPanel(uR, 620, 120, 530, 560, '#FFE45C');
  T(uR, 885, 176, 'FARMERS: LIME', { size: 34, weight: 800, anchor: 'middle', fill: C.energy });
  const soil = E('rect', { x: 650, y: 470, width: 470, height: 120, rx: 12, fill: ngPH(4), stroke: SC_INK, 'stroke-width': 4 }, uR);
  E('path', { d: 'M700,470 q6,-30 -6,-46 M700,452 q14,-12 24,-8 M820,470 q6,-30 -6,-46 M820,452 q14,-12 24,-8 M940,470 q6,-30 -6,-46 M940,452 q14,-12 24,-8 M1060,470 q6,-30 -6,-46 M1060,452 q14,-12 24,-8', fill: 'none', stroke: '#3E8F3E', 'stroke-width': 6, 'stroke-linecap': 'round' }, uR);
  const farmerW = G(uR); tr(farmerW, 760, 470, 1.15);
  const farmer = person(farmerW, { shirt: '#5E8C3A', skin: '#C98E62', shorts: '#4A3A2A', hair: '#2B1D14', shoes: '#3A2A1A' });
  farmer.pose({ lean: 6, armL: [70, 30], armR: [60, 40] });
  E('path', { d: 'M-34,-196 Q0,-224 34,-196 L52,-188 Q0,-178 -52,-188 Z', fill: '#E8C25A', stroke: '#8A6A1E', 'stroke-width': 3 }, farmerW);   // straw hat
  const sack = G(uR); tr(sack, 880, 300, 1, -28);
  E('path', { d: 'M-50,-50 Q-58,40 -44,62 L44,62 Q58,40 50,-50 Q0,-36 -50,-50 Z', fill: '#E9DFC6', stroke: '#8A7A5A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, sack);
  T(sack, 0, 22, 'LIME', { size: 30, weight: 800, anchor: 'middle', fill: '#5A4A2A' });
  const dust = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('circle', { r: 5, fill: '#FFFFFF' }, uR));
  const soilTxt = T(uR, 885, 640, '**acidic** soil', { size: 30, weight: 600, anchor: 'middle', boldFill: '#FFB070' });
  const soilOk = cerChip(uR, 'neutral soil', { size: 32, fill: ngPH(7), color: '#FFFFFF', stroke: '#FFFFFF' }); tr(soilOk, 885, 632);

  /* =====================================================================
     timing
     ===================================================================== */
  const D0 = mid('dropper', 0.74), D1 = mid('little', 0.24), D2 = mid('little', 0.54), D3 = at('green') + 0.3;
  const DROPS = [D0, D1, D2, D3];
  const BLOB = at('oops') + 0.05;
  const MUCH0 = at('much') + 0.25;
  const phAt = t => {
    let ph = 1;
    [[D1, 3.5], [D2, 5.5], [D3, 7]].forEach(([td, v]) => { ph = lerp(ph, v, P(t, td, 0.45)); });
    return lerp(ph, 12, P(t, MUCH0, 2.6));
  };
  const phLabel = ph => (ph < 2.5 ? 'pH 1' : ph < 4.5 ? 'pH 3–4' : ph < 6.5 ? 'pH 5–6' : ph < 7.5 ? 'pH 7' : 'pH ' + Math.round(ph));
  const CONG = mid('congrats', 0.6);

  const CUTS = [
    [-1, 'lab', 'dropper'],
    [at('dearly') - 0.08, 'ven', 'wide'],
    [at('vow1') - 0.08, 'ven', 'hal'],
    [at('vow2') - 0.08, 'ven', 'nat'],
    [at('ions') - 0.08, 'ven', 'ions'],
    [at('example') - 0.08, 'ven', 'example'],
    [at('table') - 0.08, 'ven', 'table'],
    [at('congrats') - 0.08, 'ven', 'indi'],
    [CONG, 'ven', 'shaker'],
    [at('little') - 0.08, 'split', ''],
    [mid('green', 0.3), 'ven', 'green'],
    [at('oops') - 0.75, 'lab', 'oops'],
    [at('much') - 0.08, 'ven', 'much'],
    [at('notjust') - 0.08, 'ven', 'notjust'],
    [at('uses') - 0.08, 'uses', ''],
    [at('dad') - 0.08, 'lab', 'dad'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };

  return t => {
    const [c0, shot, sub] = cutAt(t);
    const ph = phAt(t), phCol = ngPH(ph);
    const isLab = shot === 'lab', isVen = shot === 'ven', isSplit = shot === 'split', isUses = shot === 'uses';
    op(labShot, isLab || isSplit ? 1 : 0); op(venShot, isVen || isSplit ? 1 : 0); op(usesShot, isUses ? 1 : 0);
    cerClip(labShot, isSplit ? 'cerClipL' : ''); cerClip(venShot, isSplit ? 'cerClipR' : '');
    op(divider, isSplit ? 1 : 0);

    /* ---------------- LAB ---------------- */
    // the dropper: squeeze and drops (the drop that is falling now)
    let sq = 0, dropY = -1, dropS = 1;
    DROPS.forEach(td => {
      sq = Math.max(sq, P(t, td - 0.5, 0.15, linear) * (1 - P(t, td - 0.12, 0.2, linear)));
      if (t >= td - 0.32 && t < td) { dropY = P(t, td - 0.32, 0.32, easeIn) * 147; dropS = 1; }
    });
    sq = Math.max(sq, P(t, BLOB - 0.7, 0.15, linear) * (1 - P(t, BLOB - 0.1, 0.3, linear)));
    if (t >= BLOB - 0.42 && t < BLOB) { dropY = P(t, BLOB - 0.42, 0.42, easeIn) * 150; dropS = 2.6; }
    if (isLab || isSplit) {
      lab.upd(t * AMP);
      const dad = sub === 'dad';
      op(kavAW, dad ? 0 : 1); op(kavBW, dad ? 1 : 0);
      op(arm, dad ? 0 : 1); op(drpW, dad ? 0 : 1);
      drp.set(sq, ngPH(13)); hand.set(sq);
      op(drp.drop, dropY >= 0 ? 1 : 0); if (dropY >= 0) tr(drp.drop, 0, dropY, dropS);
      bk.set(0.62, phCol);
      // ripple after each landing
      let rp = 0; [...DROPS, BLOB].forEach(td => { if (t >= td && t < td + 0.6) rp = (t - td) / 0.6; });
      op(ripple, rp > 0 ? 1 - rp : 0); attr(ripple, 'rx', 10 + rp * 70); attr(ripple, 'ry', 4 + rp * 12);
      // the blob: splash and a purple swirl that has not mixed in yet
      const sp = t >= BLOB && t < BLOB + 0.6 ? (t - BLOB) / 0.6 : -1;
      op(splash, sp >= 0 ? 1 - sp : 0);
      if (sp >= 0) splDrops.forEach((d, i) => { const vx = [-1, -0.4, 0.4, 1][i]; tr(d, BK[0] + vx * 70 * sp, SURF - 90 * sp + 160 * sp * sp); });
      const swOn = sub === 'oops' && t >= BLOB ? P(t, BLOB, 0.9, easeOut) : 0;
      op(swirl, swOn); if (swOn) { tr(swirl, BK[0], 478, Math.max(0.01, swOn), (t - BLOB) * 70 * AMP); attr(sw1, 'fill', ngPH(13)); }
      // camera and Kavya
      let mood = 'annoyed', kl = 0.8, kt = 0, sweat = 0;
      if (sub === 'dropper') {
        cerCam(labW, 720, 300, 1.3 + 0.06 * P(t, 0, 5, linear), 600, 375);
      } else if (sub === 'oops') {
        const push = P(t, end('oops'), 1.1, linear);
        cerCam(labW, 560, 380, 1.1 + 0.08 * push, 600, 375);
        kt = talk(t, 'kavya');
        if (t < BLOB) { mood = 'annoyed'; kl = 0.8; }
        else if (t < mid('oops', 0.45)) { mood = 'shock'; kl = 0.8; }
        else { mood = 'happy'; kl = 0.1; sweat = 1; }
      } else if (sub === 'dad') {
        cerCam(labW, 430, 360, 1.15 + 0.06 * P(t, at('dad'), 3.4, linear), 430, 400);
      } else if (isSplit) {
        cerCam(labW, 760, 400, 1.25, 300, 420);
      }
      if (!dad) kavA.set({ t, talk: kt, mood, look: kl, sweat });
      else kavB.set({ t, talk: talk(t, 'kavya'), mood: 'deadpan', look: 0 });
      op(acidTag, sub === 'dropper' ? P(t, mid('dropper', 0.15), 0.3, linear) : 0); tr(acidTag, 660, 660);
      op(alkTag, sub === 'dropper' ? P(t, mid('dropper', 0.3), 0.3, linear) : 0); tr(alkTag, 820, 250);
      if (sub === 'dropper') cerPop(begins, t, mid('dropper', 0.5), 330, 170); else op(begins, 0);
      if (sub === 'dad') cerPop(crab, t, mid('dad', 0.35), 920, 232); else op(crab, 0);
    } else { op(acidTag, 0); op(alkTag, 0); op(begins, 0); op(crab, 0); }

    /* ---------------- VENUE ---------------- */
    const venOn = isVen || isSplit;
    if (venOn) {
      venue.set(ph, t * AMP);
      // camera
      if (isSplit) cerCam(venW, 600, 500, 1.15, 900, 470);
      else if (sub === 'hal') cerCam(venW, 420, 480, 1.55, 560, 430);
      else if (sub === 'nat') cerCam(venW, 780, 480, 1.55, 640, 430);
      else if (sub === 'ions') cerCam(venW, 600, 430, 1.1, 600, 440);
      else if (sub === 'table') cerCam(venW, 786, 470, 1.45, 600, 420);
      else if (sub === 'indi') cerCam(venW, 600, 470, 1.7 + 0.1 * P(t, at('congrats'), 2, linear), 600, 400);
      else if (sub === 'shaker') { const k = 1.7 + 0.08 * P(t, CONG, 2, linear); cerCam(venW, 1200 - 560 / k, 470, k, 640, 400); }
      else if (sub === 'green') cerCam(venW, 600, 450, 1 + 0.08 * P(t, mid('green', 0.6), 2.6, linear), 600, 450);
      else if (sub === 'notjust') cerCam(venW, 600, 470, 1.35, 300, 470);
      else cerCam(venW, 600, 375, 1, 600, 375);

      // who is speaking where
      const w = scWho(S, t);
      const spX = { indi: 600, hal: 330, natalie: 875, henry: 165 }[w];
      const look = (from, dflt) => (spX !== undefined && spX !== from ? lookAt(from, spX) : (dflt || 0));
      const frozen = t >= mid('green', 0.62) && t < at('oops') - 0.75;
      // Indi
      let iMood = 'neutral', iLook = look(600);
      if (t >= at('vow1') && t < at('example')) iMood = 'deadpan';
      if (t >= at('table')) iMood = 'deadpan';
      if (t >= at('little')) iMood = 'neutral';
      if (t >= mid('green', 0.15)) iMood = 'happy';
      if (frozen) iLook = Math.sin(t * 5) > 0 ? -0.8 : 0.8;
      if (t >= MUCH0) iMood = t < mid('much', 0.75) ? 'annoyed' : 'smug';
      if (t >= at('notjust')) iMood = 'neutral';
      if (sub === 'ions' && t < mid('ions', 0.6)) iLook = 0;
      indi.set({ t, talk: talk(t, 'indi'), mood: iMood, look: iLook, ph, still: frozen });
      op(spaGlow, sub === 'green' ? 0.7 * P(t, mid('green', 0.35), 0.6, linear) : 0);
      // Hal
      let hMood = 'happy', hLook = look(330, 0.5), hSweat = 0;
      if (t >= MUCH0) { hMood = 'shock'; hSweat = 0.6; }
      if (sub === 'ions' || sub === 'example') hLook = 0.3;
      hal.set({ t, talk: talk(t, 'hal'), mood: hMood, look: hLook, sweat: hSweat, still: frozen });
      // Natalie
      let nMood = 'smug', nLook = look(875, -0.5);
      if (sub === 'ions' && t > mid('ions', 0.55)) nMood = 'happy';
      if (sub === 'table' || sub === 'shaker') { nMood = 'shock'; nLook = 0.9; }
      if (t >= at('little')) nMood = 'neutral';
      if (t >= mid('green', 0.15)) nMood = 'happy';
      if (t >= MUCH0) nMood = 'happy';
      nat.set({ t, talk: talk(t, 'natalie'), mood: nMood, look: nLook, still: frozen });
      // Henry: nervous best man
      let yMood = 'neutral', ySweat = 0.25;
      if (sub === 'ions' && t > mid('ions', 0.55)) yMood = 'happy';
      if (frozen) { yMood = 'shock'; ySweat = 1; }
      if (t >= MUCH0) { yMood = 'shock'; ySweat = 1; }
      henry.set({ t, talk: 0, mood: yMood, look: look(165, 0.6), sweat: ySweat, still: frozen });

      // ring boxes and ions
      const bxH = t >= at('vow1') && t < at('example') ? P(t, mid('vow1', 0.35), 0.4, pop) : 0;
      const bxN = t >= at('vow2') && t < at('example') ? P(t, mid('vow2', 0.05), 0.4, pop) : 0;
      op(boxH, clamp(bxH * 3)); tr(boxH, BOXH[0], BOXH[1] + 40 * (1 - clamp(bxH)), Math.max(0.01, bxH));
      op(boxN, clamp(bxN * 3)); tr(boxN, BOXN[0], BOXN[1] + 40 * (1 - clamp(bxN)), Math.max(0.01, bxN));
      const fly = P(t, mid('ions', 0.18), mid('ions', 0.5) - mid('ions', 0.18), ease);
      const snap = t >= mid('ions', 0.5);
      const ionVis = (b) => (t >= at('example') || snap ? 0 : b);
      op(ionH, ionVis(clamp(bxH * 3))); op(ionOH, ionVis(clamp(bxN * 3)));
      const hov = Math.sin(t * 4) * 4 * AMP;
      tr(ionH, lerp(BOXH[0], 568, fly), lerp(BOXH[1] - 36 + 40 * (1 - clamp(bxH)), 300, fly) + hov, Math.max(0.01, bxH));
      tr(ionOH, lerp(BOXN[0], 632, fly), lerp(BOXN[1] - 36 + 40 * (1 - clamp(bxN)), 300, fly) - hov, Math.max(0.01, bxN));
      // Natalie wipes her ion first
      const wp = sub === 'nat' ? win(t, mid('vow2', 0.2), mid('vow2', 0.62), 0.12) : 0;
      op(cloth, wp); if (wp) tr(cloth, BOXN[0] + 34 * Math.sin((t - mid('vow2', 0.2)) * 14), BOXN[1] - 44, 1, 10 * Math.sin(t * 9));
      op(suds, sub === 'nat' || sub === 'ions' ? ionVis(P(t, mid('vow2', 0.3), 0.4, linear)) : 0);
      tr(suds, lerp(BOXN[0], 632, fly), lerp(BOXN[1] - 36, 300, fly) - hov);
      op(shine, sub === 'nat' ? win(t, mid('vow2', 0.66), end('vow2') + 0.3, 0.15) : 0);
      tr(shine, BOXN[0] + 26, BOXN[1] - 66); shine.upd(t);
      // the water molecule
      const wpop = snap && t < at('example') ? P(t, mid('ions', 0.5), 0.5, pop) : 0;
      op(water, clamp(wpop * 3)); tr(water, 600, 300, Math.max(0.01, wpop));
      const hp = snap && t < at('example') ? P(t, mid('ions', 0.58), 0.5, pop) : 0;
      op(heart, clamp(hp * 3)); tr(heart, 600, 232 - 10 * wave(t, 1.2), Math.max(0.01, hp * 0.8));
      // shaker (stays at the reception from 'table' on) and its veil
      const shp = t >= at('table') ? P(t, mid('table', 0.42), 0.45, pop) : 0;
      op(shaker, clamp(shp * 3)); tr(shaker, SHK[0], SHK[1], Math.max(0.01, 0.85 * shp));
      const vp = P(t, CONG + 0.12, 0.55, easeOut);
      op(shaker.veil, t >= CONG ? 1 : 0); tr(shaker.veil, 0, -260 * (1 - vp), 1, 14 * (1 - vp) * Math.sin(t * 8));
    }

    /* ---------------- venue overlays ---------------- */
    // NEUTRALISATION (dearly) stays as the title of the 'what' card
    const nOn = t >= mid('dearly', 0.66) && t < at('eq') - 0.08;
    if (nOn) cerPop(neut, t, mid('dearly', 0.66), 600, 160, 1); else op(neut, 0);
    const wOn = t >= at('what') - 0.08 && t < at('eq') - 0.08;
    op(whatG, wOn ? P(t, at('what') - 0.08, 0.2, linear) : 0);
    if (wOn) phs.set(lerp(1, 7, P(t, mid('what', 0.55), 1.4, ease)), 1);
    const eOn = t >= at('eq') - 0.08 && t < at('vow1') - 0.08;
    op(eqG, eOn ? 1 : 0);
    if (eOn) {
      eq.set(P(t, at('eq'), mid('eq', 0.6) - at('eq'), linear));
      absw.forEach((b, i) => { const x = +eq.terms[i * 2].getAttribute('x'); cerPop(b, t, mid('eq', 0.66 + i * 0.08), x + 600, 296, 1); });
    }
    if (sub === 'hal' && isVen) cerPop(vowH, t, mid('vow1', 0.55), 870, 190); else op(vowH, 0);
    if (sub === 'nat' && isVen) cerPop(vowN, t, mid('vow2', 0.3), 330, 190); else op(vowN, 0);
    if (sub === 'nat' && isVen) cerPop(washed, t, mid('vow2', 0.68), 640, 640); else op(washed, 0);
    const iOn = sub === 'ions' && isVen;
    op(ionsG, iOn ? P(t, mid('ions', 0.08), 0.3, linear) : 0);
    op(fL, iOn ? P(t, mid('ions', 0.08), 0.3, linear) : 0); op(fR, iOn ? P(t, mid('ions', 0.52), 0.3, linear) : 0);
    if (iOn) cerPop(waterChip, t, mid('ions', 0.62), 600, 386); else op(waterChip, 0);
    const xOn = sub === 'example' && isVen;
    op(exG, xOn ? 1 : 0);
    if (xOn) exEq.set(P(t, mid('example', 0.3), mid('example', 0.92) - mid('example', 0.3), linear));
    const pr = xOn ? P(t, mid('example', 0.02), mid('example', 0.26) - mid('example', 0.02), ease) : 0;
    op(naIon, xOn ? 1 : 0); op(clIon, xOn ? 1 : 0); op(saltTag, xOn ? P(t, mid('example', 0.26), 0.3, linear) : 0);
    tr(clIon, lerp(330, 960, pr), lerp(470, 288, pr) - 60 * Math.sin(pr * Math.PI));
    tr(naIon, lerp(875, 1022, pr), lerp(470, 288, pr) - 60 * Math.sin(pr * Math.PI));
    const tOn = (sub === 'table' || sub === 'shaker') && isVen;
    if (sub === 'table' && isVen) { cerPop(qMark, t, at('table') + 0.1, 729, 250, 1, 8 * Math.sin(t * 3)); } else op(qMark, 0);
    if (tOn) { cerPop(shkTag, t, mid('table', 0.5), sub === 'table' ? 997 : 975, sub === 'table' ? 630 : 680); cerPop(tableChip, t, mid('table', 0.7), sub === 'table' ? 780 : 360, 170); }
    else { op(shkTag, 0); op(tableChip, 0); }
    // confetti
    const cOn = (sub === 'indi' || sub === 'shaker') && isVen;
    op(confG, cOn ? 1 : 0);
    if (cOn) conf.forEach(c => { const tt = t - at('congrats') - c.d; tr(c.el, c.x + 30 * Math.sin(tt * c.w + c.s), -20 + c.v * Math.max(0, tt), 1.6, (tt * 200 * c.w) % 360); op(c.el, tt > 0 ? 1 : 0); });
    // little / green
    op(phRead, isSplit ? 1 : 0);
    if (isSplit) { setText(phReadTxt, phLabel(ph)); attr(phReadBox, 'fill', phCol); }
    if (isSplit && t < at('green')) cerPop(littleChip, t, mid('little', 0.2), 900, 168); else op(littleChip, 0);
    if (isSplit && t < at('green')) cerPop(keepGo, t, mid('little', 0.8), 900, 664); else op(keepGo, 0);
    if (sub === 'green' && isVen) { cerPop(greenChip, t, mid('green', 0.32), 600, 175); cerPop(freeze, t, mid('green', 0.72), 600, 262); }
    else { op(greenChip, 0); op(freeze, 0); }
    if (sub === 'much' && isVen) {
      cerPop(muchChip, t, MUCH0 + 0.9, 600, 168);
      cerPop(mixG, t, mid('much', 0.48), 600, 262);
      cerPop(needMe, t, mid('much', 0.82), 600, 340);
    } else { op(muchChip, 0); op(mixG, 0); op(needMe, 0); }
    const njOn = sub === 'notjust' && isVen;
    op(njG, njOn ? P(t, at('notjust') - 0.08, 0.2, linear) : 0);
    if (njOn) {
      cerPop(can, t, mid('notjust', 0.04), 730, 250);
      cerPop(canX, t, mid('notjust', 0.3), 730, 250);
      op(njNo, P(t, mid('notjust', 0.32), 0.2, linear));
      op(njLine, P(t, mid('notjust', 0.45), 0.3, linear));
      op(njR1, P(t, mid('notjust', 0.5), 0.3, linear));
      op(njR2, P(t, mid('notjust', 0.74), 0.3, linear));
      op(njR3, P(t, mid('notjust', 0.86), 0.3, linear));
    }

    /* ---------------- USES ---------------- */
    if (isUses) {
      op(uL, P(t, at('uses') - 0.08, 0.2, linear));
      uArrow.set(P(t, mid('uses', 0.22), 0.5, linear));
      const sN = P(t, mid('uses', 0.32), 1.6, ease);
      attr(stomach, 'fill', ngPH(lerp(1.5, 7, sN)));
      op(stTxt, 1 - P(t, mid('uses', 0.42), 0.3, linear)); op(stOk, P(t, mid('uses', 0.44), 0.3, linear));
      tr(stomach, 450, 340, 1 + 0.03 * Math.sin(t * 3 * AMP));
      const rp = P(t, mid('uses', 0.52), 0.45, pop);
      op(uR, clamp(rp * 3));
      const sP = P(t, mid('uses', 0.74), 1.4, ease);
      attr(soil, 'fill', ngPH(lerp(4, 7, sP)));
      op(soilTxt, 1 - P(t, mid('uses', 0.86), 0.3, linear)); op(soilOk, P(t, mid('uses', 0.88), 0.3, linear));
      tr(sack, 880, 300, 1, -28 - 8 * Math.sin(t * 3 * AMP));
      const pour = rp > 0.9 ? 1 : 0;
      dust.forEach((d, i) => { const f = (t * 0.9 + i / 8) % 1; op(d, pour * (1 - f)); tr(d, 910 + i * 7 + 20 * f, 330 + 140 * f); });
    }
  };
});

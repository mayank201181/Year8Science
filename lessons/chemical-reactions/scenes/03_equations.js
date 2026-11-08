/* Chapter 3: Reactants, products and equations.
   Beats: a reactants card and a products card -> an arrow joins them ("turns into"); an equals sign
   is crossed out -> the word equation for magnesium burning, with a ribbon that burns white and leaves
   white powder -> carbon + oxygen, with glowing charcoal -> the words morph into C + O2 -> CO2, with
   atoms and tallies C 1|1, O 2|2 -> H2O: which atoms and how many -> the subscript counts only the H
   -> showpiece: a big amber 2 slides in and the molecule copies itself -> four H and two O counted. */
scene('equations', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));
  const len = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w; };
  /* a row of tokens (words, '+', formulae) centred on cx at baseline y: returns [{ el, x }] */
  function row(parent, cx, y, toks, size) {
    const els = toks.map(k => k.f ? rxFormula(parent, 0, y, k.s, { size, weight: 600 })
      : T(parent, 0, y, k.s, { size, weight: k.op ? 600 : 700, anchor: 'middle', fill: k.op ? C.muted : C.ink }));
    const ws = els.map((e, i) => len(e) || toks[i].s.length * size * 0.55);
    const gap = size * 0.3, total = ws.reduce((a, b) => a + b, 0) + gap * (els.length - 1);
    let x = cx - total / 2;
    return els.map((e, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; attr(e, 'x', c); return { el: e, x: c, y }; });
  }
  /* a word turning into its formula: a slides and fades out while b grows in, both travelling a.x -> b.x */
  function morph(a, b, p) {
    const e = ease(clamp(p)), x = lerp(a.x, b.x, e);
    op(a.el, 1 - clamp(p * 2.6));
    a.el.setAttribute('transform', `translate(${(x - a.x).toFixed(1)} 0) translate(${a.x} ${a.y}) scale(${lerp(1, 0.6, e).toFixed(3)}) translate(${-a.x} ${-a.y})`);
    op(b.el, clamp((p - 0.34) / 0.5));
    b.el.setAttribute('transform', `translate(${(x - b.x).toFixed(1)} 0) translate(${b.x} ${b.y}) scale(${lerp(1.5, 1, e).toFixed(3)}) translate(${-b.x} ${-b.y})`);
  }
  const showTok = (k, t, t0, fade) => { const p = P(t, t0, 0.45, pop); op(k.el, clamp(p * 2) * (fade === undefined ? 1 : fade)); scaleAt(k.el, k.x, k.y - 14, 0.7 + 0.3 * p); };

  /* ================= the equation band: two cards and an arrow ================= */
  const XL = 280, XR = 920, CY0 = 200, CW = 460, CH = 220, AY = 310;
  const band = G(root);
  const cardL = G(band), cardR = G(band);
  card(cardL, XL - CW / 2, CY0, CW, CH, { fill: 'rgba(76,201,240,0.08)', stroke: C.water, sw: 3, rx: 26 });
  card(cardR, XR - CW / 2, CY0, CW, CH, { fill: 'rgba(86,214,155,0.08)', stroke: C.good, sw: 3, rx: 26 });
  tr(chip(cardL, 'reactants', { size: 30, fill: C.water, color: C.bg0 }), XL, CY0);
  tr(chip(cardR, 'products', { size: 30, fill: C.good, color: C.bg0 }), XR, CY0);

  // what's in the cards at first: magnesium atoms and an oxygen molecule; magnesium oxide
  const artL = G(cardL), artR = G(cardR);
  const ARTL = [['Mg', 175, 300], ['Mg', 268, 326], ['O2', 386, 298]].map(([k, x, y], i) => ({ g: k === 'O2' ? rxMol(artL, 'O2', { r: 24 }) : rxAtom(artL, 'Mg', 29), x, y, ph: i * 1.9 }));
  const ARTR = [[846, 302], [1000, 326]].map(([x, y], i) => ({ g: rxMol(artR, 'MgO', { r: 24 }), x, y, ph: i * 2.3 + 0.7 }));
  const subL = T(artL, XL, 396, 'what you start with', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const subR = T(artR, XR, 396, 'the new substances made', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });

  const arw = arrow(band, 528, AY, 672, AY, { color: C.ink, width: 7 });
  const turns = T(band, 600, AY - 30, 'turns into', { size: 28, weight: 600, anchor: 'middle', fill: C.energy });
  const eqG = G(band);
  E('rect', { x: -30, y: -17, width: 60, height: 11, rx: 5.5, fill: C.muted }, eqG);
  E('rect', { x: -30, y: 6, width: 60, height: 11, rx: 5.5, fill: C.muted }, eqG);
  const eqX = cross(eqG, 30);

  // headings
  const headW = T(band, 600, 142, 'Word equation', { size: 38, weight: 700, anchor: 'middle', fill: C.energy });
  const headS = T(band, 600, 142, 'Symbol equation', { size: 38, weight: 700, anchor: 'middle', fill: C.energy });

  // word equations and the symbol equation, as tokens so the words can morph into formulae
  const WY = 336;
  const wMg = { L: row(band, XL, WY, [{ s: 'magnesium' }, { s: '+', op: 1 }, { s: 'oxygen' }], 40), R: row(band, XR, WY, [{ s: 'magnesium oxide' }], 40) };
  const wC = { L: row(band, XL, WY, [{ s: 'carbon' }, { s: '+', op: 1 }, { s: 'oxygen' }], 40), R: row(band, XR, WY, [{ s: 'carbon dioxide' }], 40) };
  const fC = { L: row(band, XL, WY + 6, [{ s: 'C', f: 1 }, { s: '+', op: 1 }, { s: 'O2', f: 1 }], 60), R: row(band, XR, WY + 6, [{ s: 'CO2', f: 1 }], 60) };
  [wMg, wC, fC].forEach(w => w.L.concat(w.R).forEach(k => op(k.el, 0)));

  /* ---------- the magnesium ribbon burns ---------- */
  const mat = G(band);
  E('rect', { x: 430, y: 668, width: 420, height: 20, rx: 6, fill: '#33424E', stroke: '#5D7486', 'stroke-width': 2 }, mat);
  const mgDemo = G(band);
  const RIB0 = 470, RIB1 = 792, RIBY = 560, BURN_END = 610;
  E('path', { d: `M300,640 L${RIB0 + 8},${RIBY - 5} M306,652 L${RIB0 + 8},${RIBY + 5}`, stroke: '#7E8B97', 'stroke-width': 7, 'stroke-linecap': 'round' }, mgDemo);
  E('circle', { cx: 318, cy: 642, r: 9, fill: '#5E6A75', stroke: '#9DB0BF', 'stroke-width': 2 }, mgDemo);
  const pile = E('ellipse', { cx: 702, cy: 668, rx: 0, ry: 0, fill: RX.mgOxide }, mgDemo);
  const dust = []; const dr = rng(15);
  for (let i = 0; i < 12; i++) dust.push({ el: E('circle', { r: 2.5 + dr() * 2.5, fill: RX.mgOxide }, mgDemo), off: 14 + dr() * 150, ph: dr(), sp: 0.8 + dr() * 0.5 });
  const ash = E('path', { fill: 'none', stroke: RX.mgOxide, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '9 4' }, mgDemo);
  const ribbon = E('path', { fill: 'none', stroke: '#B9C4CE', 'stroke-width': 10, 'stroke-linejoin': 'round' }, mgDemo);
  const ribHi = E('path', { fill: 'none', stroke: '#F4F8FB', 'stroke-width': 2.5, opacity: 0.75 }, mgDemo);
  const mgGlow = E('circle', { r: 128, fill: glow('#FFFFFF') }, mgDemo);
  const rays = G(mgDemo);
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; E('line', { x1: Math.cos(a) * 44, y1: Math.sin(a) * 44, x2: Math.cos(a) * (i % 2 ? 78 : 104), y2: Math.sin(a) * (i % 2 ? 78 : 104), stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.75 }, rays); }
  const mgFlame = rxFlame(mgDemo, 0.6);
  const lbMg = labelLine(mgDemo, 446, 512, 498, 556, 'magnesium', { anchor: 'end' });
  const lbMgO = labelLine(mgDemo, 880, 628, 770, 664, 'magnesium oxide', { anchor: 'start' });
  const crinkle = x => Math.sin(x * 0.11) * 3;
  const pathD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');

  /* ---------- glowing charcoal ---------- */
  const coal = G(band);
  E('ellipse', { cx: 640, cy: 640, rx: 170, ry: 80, fill: glow('#FF7A2E') }, coal);
  const lump = G(coal); tr(lump, 640, 614);
  E('path', { d: closedPath(blobPts(92, 56, 12, 0, 0.2, 9)), fill: ball('#5A6168', '#141618'), stroke: '#6A727A', 'stroke-width': 3 }, lump);
  E('path', { d: 'M-70,-14 L-26,-30 L22,-34 L64,-12 M-26,-30 L-12,8 L36,22 M22,-34 L36,22 L70,12', fill: 'none', stroke: '#2A2E32', 'stroke-width': 3, 'stroke-linejoin': 'round' }, lump);
  const CRK = 'M-64,4 L-36,14 L-12,8 L10,24 L40,20 M-12,8 L-4,-14 L22,-20 M36,22 L52,4 L70,8';
  const cracksGlow = E('path', { d: CRK, fill: 'none', stroke: '#FF5A12', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.45 }, lump);
  const cracks = E('path', { d: CRK, fill: 'none', stroke: '#FFC27A', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lump);
  const coalHW = heatWaves(coal, { n: 3, h: 70, spacing: 34 }); tr(coalHW, 640, 566);
  labelLine(coal, 850, 596, 728, 606, 'charcoal (carbon)', { anchor: 'start' });

  /* ---------- the symbol equation's atoms and tallies ---------- */
  const symG = G(band);
  const aC = G(symG); atom(aC, 'C', 27, { letter: true });
  const aPlus = T(symG, 0, 0, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
  const aO2 = G(symG); molO2(aO2, 24, { letter: true });
  const aCO2 = G(symG); molCO2(aCO2, 24, { letter: true });
  const SYMY = 516;
  const tlL = rxTally(symG, ['C', 'O']), tlR = rxTally(symG, ['C', 'O']);
  tr(tlL, XL, 640); tr(tlR, XR, 640);
  const symArrow = arrow(symG, 560, SYMY, 640, SYMY, { color: C.muted, width: 5 });

  /* ================= reading a formula: H2O ================= */
  const fp = G(root);
  const FY = 300, FS = 120, MY = 488, MR = 46;
  const bodyG = G(fp);
  const hlG = G(bodyG);                                       // glows behind single characters
  const body = rxFormula(bodyG, 0, FY, 'H2O', { size: FS, anchor: 'start' });
  const bw = body.w || len(body) || FS * 1.8;
  const ch = [0, 1, 2].map(k => { try { const b = body.getExtentOfChar(k); return { x: b.x + b.width / 2, y: b.y + b.height / 2, top: b.y, bot: b.y + b.height, w: b.width }; } catch (e) { return { x: [0.3, 0.75, 1.3][k] * FS, y: FY - FS * 0.35, top: FY - FS * 0.8, bot: FY, w: FS * 0.6 }; } });
  const haloH = E('circle', { cx: ch[0].x, cy: ch[0].y + 6, r: FS * 0.62, fill: glow('#FFFFFF') }, hlG);
  const haloO = E('circle', { cx: ch[2].x, cy: ch[2].y + 6, r: FS * 0.62, fill: glow(C.oxygen) }, hlG);
  const halo2 = E('circle', { cx: ch[1].x, cy: ch[1].y, r: FS * 0.5, fill: glow(C.energy) }, hlG);
  const coef = T(fp, 0, FY, '2', { size: FS, weight: 600, fill: RX.coef });
  const cw = len(coef) || FS * 0.55, CG = FS * 0.06;
  const BX0 = 600 - bw / 2, CX1 = 600 - (cw + CG + bw) / 2, BX1 = CX1 + cw + CG;
  // the subscript curls back to the H only
  const SUBBOT = FY + Math.round(FS * 0.24) + 12;
  const curl = arrow(bodyG, ch[1].x + 6, SUBBOT, ch[0].x + 2, FY + 16, { color: C.energy, width: 6, bend: -84, head: 20 });
  const curlLab = T(fp, BX0 - 18, 392, 'counts the H only', { size: 30, weight: 700, anchor: 'end', fill: C.energy });
  // the coefficient covers the whole formula
  const box = E('rect', { x: -16, y: FY - FS * 0.86, width: bw + 32, height: FS * 1.16, rx: 18, fill: 'rgba(255,228,92,0.06)', stroke: RX.coef, 'stroke-width': 4, 'stroke-dasharray': '12 9' }, bodyG);
  const boxLab = T(fp, BX1 + bw / 2, FY + 72, 'the whole formula', { size: 28, weight: 600, anchor: 'middle', fill: RX.coef });
  const coefLab = T(fp, CX1 - 22, FY - 36, 'coefficient', { size: 30, weight: 700, anchor: 'end', fill: RX.coef });
  // molecules: one, then two
  const mols = [0, 1].map(() => {
    const g = G(fp), halos = G(g);
    const hh = [-1, 1].map(s => E('circle', { cx: s * MR * 0.98, cy: MR * 0.72, r: MR * 1.05, fill: glow('#FFFFFF') }, halos));
    const ho = E('circle', { r: MR * 1.5, fill: glow(C.oxygen) }, halos);
    molH2O(g, MR, { letter: true });
    // count badges: H left, H right, O
    const badges = [[-MR * 1.68, MR * 1.56], [MR * 1.68, MR * 1.56], [0, -MR * 1.56]].map(([x, y], i) => {
      const b = G(g); tr(b, x, y);
      E('circle', { r: 19, fill: C.card2, stroke: i < 2 ? C.hydrogen : C.oxygen, 'stroke-width': 3.5 }, b);
      const n = T(b, 0, 9, '1', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });
      return { b, n };
    });
    return { g, hh, ho, badges };
  });
  // dashed links from the formula's letters to the atoms
  const links = G(fp);
  const HLX = BX0 + ch[0].x, OLX = BX0 + ch[2].x, LY0 = FY + 34;
  const lkH = [-1, 1].map(s => E('path', { d: `M${HLX.toFixed(1)},${LY0} L${(600 + s * MR * 0.98).toFixed(1)},${(MY + MR * 0.72 - MR * 0.62 - 6).toFixed(1)}`, stroke: '#DDE6EC', 'stroke-width': 3, 'stroke-dasharray': '6 7', fill: 'none', 'stroke-linecap': 'round' }, links));
  const lkO = E('path', { d: `M${OLX.toFixed(1)},${LY0} L600,${MY - MR - 6}`, stroke: '#FF9A8F', 'stroke-width': 3, 'stroke-dasharray': '6 7', fill: 'none', 'stroke-linecap': 'round' }, links);
  const twoLab = T(fp, 600, 626, 'two water molecules', { size: 30, weight: 600, anchor: 'middle', fill: C.water });
  const tlF = rxTally(fp, ['H', 'O']); tr(tlF, 600, 688);

  /* ================= update ================= */
  return t => {
    /* ---- the equation band: cards, arrow, word and symbol equations ---- */
    const aBand = 1 - P(t, at('formula') - 0.4, 0.45, linear);
    op(band, aBand);
    if (aBand > 0) {
      const pL = P(t, mid('rp', 0.02), 0.6, pop), pR = P(t, mid('rp', 0.5), 0.6, pop);
      op(cardL, clamp(pL * 2)); scaleAt(cardL, XL, CY0 + CH / 2, 0.86 + 0.14 * pL);
      op(cardR, clamp(pR * 2)); scaleAt(cardR, XR, CY0 + CH / 2, 0.86 + 0.14 * pR);
      const artA = 1 - P(t, at('word') - 0.1, 0.4, linear);
      op(artL, artA); op(artR, artA);
      if (artA > 0) {
        ARTL.forEach((a, i) => { const p = P(t, mid('rp', 0.1 + i * 0.07), 0.5, pop); tr(a.g, a.x + Math.sin(t * 1.3 + a.ph) * 3 * AMP, a.y + Math.cos(t * 1.1 + a.ph) * 3 * AMP, Math.max(0.01, p)); });
        ARTR.forEach((a, i) => { const p = P(t, mid('rp', 0.6 + i * 0.08), 0.5, pop); tr(a.g, a.x + Math.sin(t * 1.2 + a.ph) * 3 * AMP, a.y + Math.cos(t * 1.0 + a.ph) * 3 * AMP, Math.max(0.01, p)); });
        op(subL, P(t, mid('rp', 0.24), 0.4, linear)); op(subR, P(t, mid('rp', 0.68), 0.4, linear));
      }
      // the arrow, "turns into", and the crossed-out equals sign
      arw.set(P(t, mid('arrow', 0.05), 0.8));
      op(turns, P(t, mid('arrow', 0.3), 0.4, linear));
      const pe = P(t, mid('arrow', 0.55), 0.45, pop), fe = 1 - P(t, at('word') - 0.2, 0.4, linear);
      op(eqG, clamp(pe * 2) * fe);
      if (pe > 0 && fe > 0) {
        const px = P(t, mid('arrow', 0.67), 0.35, pop);
        const shake = px >= 1 ? (1 - P(t, mid('arrow', 0.67) + 0.35, 0.5, linear)) * Math.sin(t * 46) * 5 : 0;
        tr(eqG, 600 + shake, 400 + (1 - clamp(pe)) * 36);
        op(eqX, clamp(px * 2)); tr(eqX, 0, 0, Math.max(0.01, 0.6 + 0.4 * px));
      }

      // headings
      op(headW, win(t, at('word') - 0.05, at('symbol') + 0.1, 0.4));
      op(headS, P(t, at('symbol') + 0.1, 0.4, linear));

      // word equation 1: magnesium + oxygen -> magnesium oxide
      const fMg = 1 - P(t, at('carbon') - 0.15, 0.35, linear);
      [0.3, 0.42, 0.5].forEach((f, i) => showTok(wMg.L[i], t, mid('word', f), fMg));
      showTok(wMg.R[0], t, mid('word', 0.62), fMg);
      // word equation 2: carbon + oxygen -> carbon dioxide, which then morphs into C + O2 -> CO2
      if (t < mid('symbol', 0.24)) {
        [0.08, 0.2, 0.28].forEach((f, i) => showTok(wC.L[i], t, mid('carbon', f)));
        showTok(wC.R[0], t, mid('carbon', 0.55));
        fC.L.concat(fC.R).forEach(k => op(k.el, 0));
      } else {
        [0.27, 0.31, 0.35].forEach((f, i) => morph(wC.L[i], fC.L[i], P(t, mid('symbol', f), 0.7, linear)));
        morph(wC.R[0], fC.R[0], P(t, mid('symbol', 0.42), 0.7, linear));
      }

      // the burning magnesium ribbon
      const aMg = P(t, mid('word', 0.04), 0.4, linear) * (1 - P(t, at('carbon') - 0.15, 0.4, linear));
      op(mgDemo, aMg);
      const aMat = P(t, mid('word', 0.04), 0.4, linear) * (1 - P(t, mid('symbol', 0.18), 0.4, linear));
      op(mat, aMat);
      if (aMg > 0) {
        const burn = P(t, mid('word', 0.3), end('word') - mid('word', 0.3) + 0.4, linear);
        const lit = P(t, mid('word', 0.28), 0.25, linear);
        const bf = lerp(RIB1, BURN_END, burn);
        const rib = []; for (let x = RIB0; x <= bf; x += 14) rib.push([x, RIBY + crinkle(x)]); rib.push([bf, RIBY + crinkle(bf)]);
        ribbon.setAttribute('d', pathD(rib));
        ribHi.setAttribute('d', pathD(rib.map(p => [p[0], p[1] - 2.5])));
        const ashPts = []; for (let x = bf; x <= RIB1; x += 12) { const u = (x - bf) / Math.max(1, RIB1 - BURN_END); ashPts.push([x, RIBY + crinkle(x) + Math.pow(u, 1.6) * 34]); }
        ash.setAttribute('d', ashPts.length > 1 ? pathD(ashPts) : 'M0,0'); op(ash, burn > 0.01 ? 1 : 0);
        const fl = lit * (1 - P(t, end('word') + 0.25, 0.3, linear));
        mgFlame.set('white', fl * (1 + 0.08 * Math.sin(t * 17))); mgFlame.upd(t);
        tr(mgFlame, bf, RIBY + 4);
        op(mgGlow, fl * (0.8 + 0.2 * Math.sin(t * 23))); tr(mgGlow, bf, RIBY - 20, 0.9 + 0.12 * Math.sin(t * 11));
        op(rays, fl * 0.9); tr(rays, bf, RIBY - 20, 0.85 + 0.2 * wave(t, 0.35), (t * 30) % 360);
        dust.forEach(d => {
          const u = (t * d.sp + d.ph) % 1, x = Math.min(RIB1, bf + d.off);
          attr(d.el, 'cx', x + Math.sin(u * 5 + d.ph * 9) * 3); attr(d.el, 'cy', lerp(RIBY + 14, 664, u));
          op(d.el, burn > 0.02 && x < RIB1 ? Math.min(1, u * 5, (1 - u) * 6) * 0.9 : 0);
        });
        attr(pile, 'rx', 86 * Math.sqrt(burn)); attr(pile, 'ry', 12 * Math.sqrt(burn)); attr(pile, 'cx', (bf + RIB1) / 2 + 6);
        lbMg.set(P(t, mid('word', 0.12), 0.4, linear));
        lbMgO.set(P(t, mid('word', 0.64), 0.4, linear));
      }

      // glowing charcoal
      const aCoal = P(t, at('carbon') + 0.05, 0.4, linear) * (1 - P(t, mid('symbol', 0.18), 0.4, linear));
      op(coal, aCoal);
      if (aCoal > 0) {
        coalHW.upd(t);
        op(cracks, 0.7 + 0.3 * wave(t, 1.4)); op(cracksGlow, 0.3 + 0.3 * wave(t, 1.4));
        tr(lump, 640, 614, 0.85 + 0.15 * P(t, at('carbon') + 0.05, 0.5, pop));
      }

      // the symbol equation's atoms and tallies
      const aSym = P(t, mid('symbol', 0.26), 0.4, linear);
      op(symG, aSym);
      if (aSym > 0) {
        const pC = P(t, mid('symbol', 0.29), 0.5, pop), pO = P(t, mid('symbol', 0.34), 0.5, pop), pP = P(t, mid('symbol', 0.43), 0.5, pop);
        tr(aC, 196, SYMY + Math.sin(t * 1.4) * 2 * AMP, Math.max(0.01, pC)); op(aC, clamp(pC * 2));
        tr(aPlus, 268, SYMY + 14); op(aPlus, clamp(pO * 2));
        tr(aO2, 360, SYMY + Math.cos(t * 1.2) * 2 * AMP, Math.max(0.01, pO)); op(aO2, clamp(pO * 2));
        tr(aCO2, XR, SYMY + Math.sin(t * 1.1 + 1) * 2 * AMP, Math.max(0.01, pP)); op(aCO2, clamp(pP * 2));
        symArrow.set(P(t, mid('symbol', 0.4), 0.5)); op(symArrow, clamp(pP * 2));
        const tA = P(t, mid('symbol', 0.6), 0.4, linear);
        op(tlL, tA); op(tlR, tA);
        // count atom by atom: the C, then each O
        const kL = Math.floor(3.999 * P(t, mid('symbol', 0.64), 0.75, linear)), kR = Math.floor(3.999 * P(t, mid('symbol', 0.74), 0.75, linear)), ok = t >= mid('symbol', 0.88) ? 1 : 0;
        tlL.set({ C: kL >= 1 ? 1 : 0, O: Math.max(0, kL - 1) }, ok ? { C: 1, O: 1 } : {});
        tlR.set({ C: kR >= 1 ? 1 : 0, O: Math.max(0, kR - 1) }, ok ? { C: 1, O: 1 } : {});
        const bump = 1 + 0.08 * pulse(t, mid('symbol', 0.88), 0.4);
        tr(tlL, XL, 640, bump); tr(tlR, XR, 640, bump);
      }
    }

    /* ---- reading a formula: H2O, the subscript, the coefficient, counting ---- */
    const aF = P(t, at('formula') - 0.1, 0.5, linear);
    op(fp, aF);
    if (aF > 0) {
      const pf = P(t, mid('formula', 0.02), 0.6, pop);
      const slide = P(t, mid('big', 0.04), 0.8, easeOut);
      const bx = lerp(BX0, BX1, slide);
      bodyG.setAttribute('transform', `translate(${bx.toFixed(1)} 0) translate(${bw / 2} ${FY - 40}) scale(${Math.max(0.01, 0.8 + 0.2 * pf).toFixed(3)}) translate(${-bw / 2} ${-(FY - 40)})`);
      op(body, clamp(pf * 2));
      // which atoms (H, O) and how many (the 2)
      const hH = Math.max(win(t, mid('formula', 0.24), mid('formula', 0.4), 0.3), win(t, mid('formula', 0.6), mid('formula', 0.8), 0.3));
      const hO = Math.max(win(t, mid('formula', 0.3), mid('formula', 0.44), 0.3), win(t, mid('formula', 0.82), end('formula') + 0.2, 0.3));
      const h2 = Math.max(win(t, mid('formula', 0.42), mid('formula', 0.58), 0.3), win(t, at('sub'), end('sub') + 0.1, 0.35));
      op(haloH, hH * 0.8); op(haloO, hO * 0.8); op(halo2, h2 * 0.95);
      const aLinks = P(t, mid('formula', 0.24), 0.5, linear) * (1 - P(t, at('sub') - 0.1, 0.4, linear));
      op(links, aLinks);
      op(lkH[0], P(t, mid('formula', 0.24), 0.4, linear)); op(lkH[1], P(t, mid('formula', 0.26), 0.4, linear)); op(lkO, P(t, mid('formula', 0.31), 0.4, linear));
      // the subscript counts only the H before it
      curl.set(P(t, mid('sub', 0.18), 0.7));
      op(curl, 1 - P(t, at('big') - 0.1, 0.4, linear));
      op(curlLab, P(t, mid('sub', 0.34), 0.4, linear) * (1 - P(t, at('big') - 0.1, 0.4, linear)));
      // the coefficient
      const pc = P(t, mid('big', 0.04), 0.8, easeOut);
      op(coef, clamp(pc * 1.6)); attr(coef, 'x', (lerp(CX1 - 150, CX1, pc)).toFixed(1));
      scaleAt(coef, CX1 + cw / 2, FY - 40, 1 + 0.15 * pulse(t, mid('big', 0.2), 0.5) + 0.12 * pulse(t, mid('atoms', 0.05), 0.5));
      op(coefLab, P(t, mid('big', 0.2), 0.4, linear));
      const pb = P(t, mid('big', 0.42), 0.5, linear);
      op(box, pb); op(boxLab, pb * (1 - P(t, at('atoms') - 0.1, 0.4, linear)));
      // one molecule, then two
      const pm = P(t, mid('formula', 0.14), 0.6, pop), cp = P(t, mid('big', 0.63), 0.9, easeOut), cpop = P(t, mid('big', 0.63), 0.6, pop);
      mols.forEach((m, i) => {
        const x = i === 0 ? lerp(600, 470, cp) : lerp(600, 730, cp);
        const bob = Math.sin(t * 1.3 + i * 2) * 3 * AMP;
        tr(m.g, x, MY + bob, Math.max(0.01, i === 0 ? pm : 0.6 + 0.4 * cpop));
        op(m.g, i === 0 ? clamp(pm * 2) : clamp(cp * 3));
        const subH = win(t, mid('sub', 0.45), end('sub') + 0.1, 0.3);
        m.hh.forEach(h => op(h, Math.max(hH, subH) * 0.85 * (i === 0 ? 1 : 0)));
        op(m.ho, hO * 0.8 * (i === 0 ? 1 : 0));
        m.badges.forEach((b, k) => {
          const t0 = k < 2 ? mid('atoms', 0.08 + (i * 2 + k) * 0.085) : mid('atoms', 0.56 + i * 0.1);
          const p = P(t, t0, 0.4, pop);
          op(b.b, clamp(p * 2)); tr(b.b, k === 0 ? -MR * 1.68 : k === 1 ? MR * 1.68 : 0, k < 2 ? MR * 1.56 : -MR * 1.56, Math.max(0.01, p));
          setText(b.n, String(k < 2 ? i * 2 + k + 1 : i + 1));
        });
      });
      op(twoLab, P(t, mid('big', 0.76), 0.4, linear));
      // tallies: H 2, O 1 for one molecule; then H 4, O 2 for two
      const aT1 = P(t, mid('formula', 0.58), 0.4, linear) * (1 - P(t, at('big'), 0.4, linear));
      const aT2 = P(t, at('atoms') - 0.1, 0.4, linear);
      op(tlF, Math.max(aT1, aT2));
      if (aT2 > 0) {
        const nH = [0, 1, 2, 3].filter(k => t >= mid('atoms', 0.08 + k * 0.085)).length;
        const nO = [0, 1].filter(k => t >= mid('atoms', 0.56 + k * 0.1)).length;
        tlF.set({ H: nH, O: nO });
        tr(tlF, 600, 688, 1 + 0.08 * pulse(t, mid('atoms', 0.84), 0.45));
      } else {
        tlF.set({ H: t >= mid('formula', 0.66) ? 2 : 0, O: t >= mid('formula', 0.86) ? 1 : 0 });
        tr(tlF, 600, 688, 1 + 0.08 * pulse(t, mid('formula', 0.66), 0.4) + 0.08 * pulse(t, mid('formula', 0.86), 0.4));
      }
    }
  };
});

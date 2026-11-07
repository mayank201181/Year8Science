/* Equations: the word equation (Cars Won't Go On Grass) -> reactants and products -> light and chlorophyll
   over the arrow; never sunlight as a reactant -> the balanced symbol equation, its coefficients and small
   numbers -> count the atoms, watch all 36 rearrange (a generic swirl), count again -> the sixes -> the
   oxygen given off comes from splitting water. */
scene('equations', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  // formula with real subscripts; a leading coefficient is its own <text> so it can glow and pulse.
  // g.halo glows behind the coefficient, g.hl behind the whole formula; g.ext[k] is the centre of body character k.
  function formulaG(parent, str, size) {
    const g = G(parent), sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const m = str.match(/^(\d*)(.*)$/);
    g.hl = E('ellipse', { rx: 10, ry: size * 0.85, fill: glow(C.energy) }, g);
    g.halo = E('circle', { r: size * 0.85, fill: glow(C.energy) }, g);
    const mk = () => E('text', { x: 0, y: 0, 'font-size': size, 'font-weight': 600, fill: C.ink, 'font-family': FD }, g);
    const coef = m[1] ? mk() : null;
    if (coef) coef.textContent = m[1];
    const body = mk();
    let low = false;
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => {
      const ts = E('tspan', {}, body); ts.textContent = letters || digits;
      if (digits) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
      return '';
    });
    let cw = 0, bw = 0;
    try { cw = coef ? coef.getComputedTextLength() : 0; bw = body.getComputedTextLength(); } catch (e) { bw = 0; }
    if (!bw) { cw = coef ? size * 0.55 : 0; bw = m[2].length * size * 0.55; }
    const gap = coef ? size * 0.05 : 0, w = cw + gap + bw, x0 = -w / 2;
    if (coef) attr(coef, 'x', x0);
    attr(body, 'x', x0 + cw + gap);
    attr(g.halo, 'cx', x0 + cw / 2); attr(g.halo, 'cy', -size * 0.34);
    attr(g.hl, 'cy', -size * 0.34); attr(g.hl, 'rx', w * 0.62);
    g.ext = [];
    for (let k = 0; k < m[2].length; k++) { try { const b = body.getExtentOfChar(k); g.ext.push([b.x + b.width / 2, b.y + b.height / 2]); } catch (e) { g.ext.push([x0 + cw + gap + (k + 0.5) * bw / m[2].length, 0]); } }
    op(g.halo, 0); op(g.hl, 0);
    Object.assign(g, { w, coef, body, cw, x0, size });
    return g;
  }
  function brace(parent, xl, xr, y, color) {
    const xm = (xl + xr) / 2, d = `M${xl},${y} Q${xl},${y + 16} ${xl + 16},${y + 16} L${xm - 14},${y + 16} Q${xm},${y + 16} ${xm},${y + 30} Q${xm},${y + 16} ${xm + 14},${y + 16} L${xr - 16},${y + 16} Q${xr},${y + 16} ${xr},${y}`;
    const pth = E('path', { d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    pth.set = p => pth.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
    pth.set(0);
    return pth;
  }
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x} ${y}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));

  /* ================= the equation band ================= */
  const EQY = 300, FS = 52;
  const eqG = G(root);
  const heading = T(root, 600, 164, 'word equation', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const heading2 = T(root, 600, 164, 'balanced symbol equation', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const haloL = G(eqG), slotL = G(eqG);
  const SPEC = [
    { key: 'co2', text: '**c**arbon dioxide', fill: C.co2, color: '#10202B', icon: g => molCO2(g, 15), sym: '6CO2' },
    { op: '+' },
    { key: 'wat', text: '**w**ater', fill: C.water, color: '#06283A', icon: g => molH2O(g, 17), sym: '6H2O' },
    { op: '→' },
    { key: 'glu', text: '**g**lucose', fill: C.glucose, color: '#3A2600', icon: g => molGlucose(g, 27), sym: 'C6H12O6' },
    { op: '+' },
    { key: 'oxy', text: '**o**xygen', fill: C.oxygen, color: '#FFFFFF', icon: g => molO2(g, 16), sym: '6O2' },
  ];
  const ARW = 200;
  const parts = SPEC.map(sp => {
    const p = Object.assign({}, sp);
    p.g = G(slotL);
    if (sp.op === '+') { T(p.g, 0, 15, '+', { size: 46, weight: 600, anchor: 'middle', fill: C.muted }); p.w = 40; }
    else if (sp.op) { p.arr = arrow(p.g, -ARW / 2 + 10, 0, ARW / 2 - 10, 0, { color: C.ink, width: 6 }); p.w = ARW; }
    else {
      p.chip = chip(p.g, sp.text, { size: 29, fill: sp.fill, color: sp.color, weight: 700 });
      p.form = formulaG(p.g, sp.sym, FS); tr(p.form, 0, 17);
      p.icon = G(eqG); sp.icon(p.icon);
      p.glow = E('circle', { r: 46, fill: glow(C.energy) }, haloL);
      p.w = p.chip.w;
    }
    p.w0 = p.w; p.w1 = p.key ? p.form.w + 10 : p.w;                  // slot width as a word, then as a formula
    return p;
  });
  // slots narrow or widen as each word becomes its formula, and the whole equation stays centred
  const layout = (mps, gap) => { const ws = parts.map((p, i) => lerp(p.w0, p.w1, mps[i])); let total = 0; ws.forEach((w, i) => { total += w + (i ? gap : 0); }); let x = 600 - total / 2; return ws.map((w, i) => { if (i) x += gap; const c = x + w / 2; x += w; return c; }); };
  const X0 = layout(parts.map(() => 0), 12), X1 = layout(parts.map(() => 1), 22);
  parts.forEach((p, i) => { p.x = X0[i]; p.xf = X1[i]; });
  const PK = {}; parts.forEach(p => { if (p.key) PK[p.key] = p; });
  const ARR = parts[3], XL = X0[0] - parts[0].w0 / 2, XR = X0[6] + parts[6].w0 / 2;
  parts.forEach(p => {
    tr(p.g, p.x, EQY);
    if (p.icon) tr(p.icon, p.x, EQY - 88);
    if (p.chip) {
      const tw = textWidth(p.text, 29, FD, 700), fw = textWidth(p.text.slice(2, 3), 29, FD, 800);
      p.ix = p.x - tw / 2 + fw / 2;                                     // the chip's first letter
      attr(p.glow, 'cx', p.ix); attr(p.glow, 'cy', EQY);
    }
  });
  // light and chlorophyll on the arrow
  const onArr = G(eqG);
  const sunG = G(onArr); const sunA = sun(sunG, 20);
  const lightT = T(onArr, ARR.x + 40, EQY - 40, 'light', { size: 30, weight: 700, fill: C.energy });
  const chl = chip(onArr, 'chlorophyll', { size: 27, fill: C.plantDk, stroke: '#9EF0B4', color: '#FFFFFF' });
  const enSrc = chip(onArr, 'energy source', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy });
  tr(enSrc, ARR.x, EQY - 140);
  const enLine = E('line', { x1: ARR.x, y1: EQY - 116, x2: ARR.x, y2: EQY - 84, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 5' }, onArr);
  // reactants / products braces
  const brG = G(eqG);
  const rL = PK.co2.x - PK.co2.chip.w / 2, rR = PK.wat.x + PK.wat.chip.w / 2, pL = PK.glu.x - PK.glu.chip.w / 2, pR = PK.oxy.x + PK.oxy.chip.w / 2;
  const brR = brace(brG, rL, rR, EQY + 40, C.glucoseLt), brP = brace(brG, pL, pR, EQY + 40, C.water);
  const lbR = T(brG, (rL + rR) / 2, EQY + 112, '**reactants**: the raw materials', { size: 30, weight: 500, anchor: 'middle', boldFill: C.glucoseLt });
  const lbP = T(brG, (pL + pR) / 2, EQY + 112, '**products**: what is made', { size: 30, weight: 500, anchor: 'middle', boldFill: C.water });

  /* ================= Cars Won't Go On Grass ================= */
  const carG = G(root);
  E('rect', { x: 70, y: 652, width: 740, height: 22, rx: 11, fill: '#22384A' }, carG);
  for (let i = 0; i < 10; i++) E('rect', { x: 100 + i * 70, y: 661, width: 34, height: 4, rx: 2, fill: '#5F7487' }, carG);
  const grass = G(carG);
  E('rect', { x: 804, y: 648, width: 316, height: 28, rx: 12, fill: linGrad(C.plant, C.plantDk, true) }, grass);
  let bl = ''; for (let x = 812; x < 1112; x += 12) bl += `M${x},650 L${x + 5},${636 - ((x * 7) % 9)} L${x + 10},650 `;
  E('path', { d: bl, fill: C.plant, stroke: C.plantDk, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, grass);
  const sprout = G(carG); tr(sprout, 1030, 644);
  E('path', { d: 'M0,0 C-2,-20 3,-38 0,-58', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, sprout);
  tr(leaf(sprout, 0.24), 0, -30, 1, 200); tr(leaf(sprout, 0.24), 0, -44, 1, -30); tr(leaf(sprout, 0.17), 0, -58, 1, -100);
  const car = G(carG), carBody = G(car);
  E('path', { d: 'M-106,-24 Q-110,-58 -82,-60 L-54,-62 Q-38,-98 -6,-100 L38,-100 Q64,-98 80,-64 L98,-60 Q112,-56 110,-30 L106,-22 Z', fill: ball('#5B8DEF', '#2A55B5'), stroke: '#B5CEFF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, carBody);
  E('path', { d: 'M-40,-64 Q-28,-90 -6,-92 L12,-92 L12,-64 Z M22,-92 L36,-92 Q56,-90 68,-64 L22,-64 Z', fill: '#CFE6FF', opacity: 0.9 }, carBody);
  E('circle', { cx: 104, cy: -44, r: 6, fill: C.energy }, carBody);
  E('rect', { x: -110, y: -42, width: 12, height: 8, rx: 3, fill: C.bad }, carBody);
  const wheels = [-62, 62].map(x => {
    const w = G(car); tr(w, x, -22);
    E('circle', { r: 23, fill: '#1B2733', stroke: '#0B1219', 'stroke-width': 3 }, w);
    E('circle', { r: 11, fill: '#C9D6DE' }, w);
    const sp = E('path', { d: 'M-11,0 L11,0 M0,-11 L0,11', stroke: '#6E8091', 'stroke-width': 3 }, w);
    return { w, sp, x };
  });
  const CAR_STOP = 690;
  // the lettering, word by word, with bold initials; dotted links from each initial to its word
  const lettG = G(root);
  const WORDS = ['Cars', "Won't", 'Go', 'On', 'Grass'], LS = 46, LY = 512;
  const wEls = WORDS.map(w => T(lettG, 0, LY, `**${w[0]}**${w.slice(1)}`, { size: LS, weight: 700, boldFill: C.energy }));
  const spW = textWidth('n n', LS, FD, 700) - textWidth('nn', LS, FD, 700) + 4;
  const wW = wEls.map((e, i) => { let w = 0; try { w = e.getComputedTextLength(); } catch (x) { w = 0; } return w || textWidth(WORDS[i], LS, FD, 700); });
  const totW = wW.reduce((a, b) => a + b, 0) + spW * (WORDS.length - 1);
  let lx = 610 - totW / 2;
  const initX = wEls.map((e, i) => { attr(e, 'x', lx); let c = lx + LS * 0.3; try { const b = e.getExtentOfChar(0); c = b.x + b.width / 2; } catch (x) { c = lx + LS * 0.3; } lx += wW[i] + spW; return c; });
  const links = initX.map((x, i) => {
    if (i < 4) { const tx = PK[['co2', 'wat', 'glu', 'oxy'][i]].ix, ty = EQY + 28, y0 = LY - 40; return E('path', { d: `M${x.toFixed(1)},${y0} Q${x.toFixed(1)},${((y0 + ty) / 2).toFixed(1)} ${tx.toFixed(1)},${ty}`, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 7', 'stroke-linecap': 'round' }, lettG); }
    return E('path', { d: `M${(x + 8).toFixed(1)},${LY - 40} Q${(x + 160).toFixed(1)},${LY - 110} 1030,580`, fill: 'none', stroke: C.plant, 'stroke-width': 3, 'stroke-dasharray': '6 7', 'stroke-linecap': 'round' }, lettG);
  });

  /* ================= never sunlight as a reactant ================= */
  const SHRINK = 0.8;
  const gLeft = XR - (XR - XL) * SHRINK;
  const ghostG = G(root);
  const ghostChip = chip(ghostG, 'sunlight', { size: 29, fill: 'rgba(255,228,92,0.12)', stroke: C.energy, color: C.energyLt });
  ghostChip.box.setAttribute('stroke-dasharray', '8 6');
  const gPX = gLeft - 26, gX = gPX - 32 - ghostChip.w / 2;
  const ghostPlus = T(ghostG, 0, 15, '+', { size: 46, weight: 600, anchor: 'middle', fill: C.muted });
  const ghostStrike = strike(ghostG, gX - ghostChip.w / 2 - 8, EQY, gPX + 16);
  const ghostX = cross(ghostG, 20);
  const ghostNote = T(ghostG, gX, EQY + 72, 'not a reactant', { size: 28, weight: 700, anchor: 'middle', fill: C.bad });

  /* ================= coefficient and small numbers ================= */
  const fCO2 = PK.co2.form;
  const six = [PK.co2.xf + fCO2.x0 + fCO2.cw / 2, EQY];
  const sub2 = [PK.co2.xf + fCO2.ext[2][0], EQY + 17 + fCO2.ext[2][1]];
  const coG = G(root);
  const coefLine = E('path', { d: `M${six[0].toFixed(1)},${EQY + 30} L${six[0].toFixed(1)},${EQY + 84}`, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 6', 'stroke-linecap': 'round' }, coG);
  const minis = [0, 1, 2, 3, 4, 5].map(k => { const g = G(coG); molCO2(g, 10); return { g, x: 86 + k * 56, y: 422 }; });
  const coefLab = T(coG, 56, 492, '**coefficient**: how many molecules', { size: 30, weight: 500, boldFill: C.energy });
  const subG = G(root);
  const subHalo = E('circle', { cx: sub2[0], cy: sub2[1], r: 28, fill: glow(C.energy) }, subG);
  E('path', { d: `M${sub2[0].toFixed(1)},${(sub2[1] + 18).toFixed(1)} L${sub2[0].toFixed(1)},${(sub2[1] + 70).toFixed(1)}`, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '5 6', 'stroke-linecap': 'round' }, subG);
  const bigCO2 = G(subG);
  const oHalos = [-1, 1].map(s => E('circle', { cx: s * 32, cy: 0, r: 44, fill: glow('#FFF3A0') }, bigCO2));
  molCO2(bigCO2, 20, { letter: true });
  const BIGX = sub2[0], BIGY = sub2[1] + 116;
  const subLab = T(subG, 56, BIGY + 88, '**small numbers**: atoms in one molecule', { size: 30, weight: 500, boldFill: C.energy });
  const subLab2 = T(subG, 56, BIGY + 126, 'CO₂ has 1 carbon and 2 oxygen atoms', { size: 28, weight: 500, fill: C.muted });

  /* ================= atoms: count, rearrange, count again ================= */
  const atG = G(root);
  const UPY = 162, UPS = 0.8;                                   // where the equation waits meanwhile
  const ROWS = [305, 385, 465], CX = [112, 232], WX = [366, 466];
  const GX = 800, GY = 385, R = 58, sc = R / 70, OX = [1012, 1094];
  const pol = (r, deg) => [Math.cos(deg * Math.PI / 180) * r, Math.sin(deg * Math.PI / 180) * r];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const A = {};
  const put = (name, kind, rel) => { A[name] = { kind, x: GX + rel[0], y: GY + rel[1] }; };
  const RING = { O5: -30, C1: 30, C2: 90, C3: 150, C4: 210, C5: 270 };
  for (const k in RING) put(k, k[0], pol(R, RING[k]));
  [1, 2, 3, 4].forEach(i => { const a = RING['C' + i]; put('O' + i, 'O', pol(1.8 * R, a + 15)); put('H' + i + 'o', 'H', pol(2.4 * R, a + 15)); put('H' + i, 'H', pol(1.6 * R, a - 25)); });
  put('H5', 'H', pol(1.55 * R, 250));
  const c6 = pol(1.9 * R, 300); put('C6', 'C', c6);
  put('H6a', 'H', add(c6, pol(42 * sc, 210))); put('H6b', 'H', add(c6, pol(42 * sc, 30)));
  const o6 = add(c6, pol(50 * sc, 300)); put('O6', 'O', o6); put('H6o', 'H', add(o6, pol(36 * sc, 340)));
  const BONDS = [['O5', 'C1'], ['C1', 'C2'], ['C2', 'C3'], ['C3', 'C4'], ['C4', 'C5'], ['C5', 'O5'], ['C1', 'O1'], ['O1', 'H1o'], ['C1', 'H1'], ['C2', 'O2'], ['O2', 'H2o'], ['C2', 'H2'], ['C3', 'O3'], ['O3', 'H3o'], ['C3', 'H3'], ['C4', 'O4'], ['O4', 'H4o'], ['C4', 'H4'], ['C5', 'H5'], ['C5', 'C6'], ['C6', 'H6a'], ['C6', 'H6b'], ['C6', 'O6'], ['O6', 'H6o']];
  const SWX = 600, SWY = 385;
  const swirlGlow = E('ellipse', { cx: SWX, cy: SWY, rx: 230, ry: 190, fill: glow(C.energy) }, atG);
  const ghostAG = G(atG), bondG = G(atG), haloG = G(atG), atomG = G(atG);
  BONDS.forEach(([a, b]) => E('line', { x1: A[a].x, y1: A[a].y, x2: A[b].x, y2: A[b].y, stroke: '#7F96A8', 'stroke-width': 6, 'stroke-linecap': 'round' }, bondG));
  const hexBack = E('path', { d: 'M' + [-90, -30, 30, 90, 150, 210].map(a => pol(R * 1.02, a).map((v, i) => (v + (i ? GY : GX)).toFixed(1)).join(',')).join(' L') + 'Z', fill: 'rgba(255,194,71,0.12)', stroke: 'rgba(255,194,71,0.35)', 'stroke-width': 3 }, bondG);
  bondG.insertBefore(hexBack, bondG.firstChild);
  const recs = [];
  const mk = (kind, x0, y0, s0) => { const r = { kind, x0, y0, s0, r0: kind === 'H' ? 10 : 15 }; recs.push(r); return r; };
  const CO2A = [], H2OA = [];
  for (let j = 0; j < 6; j++) {
    const cx = CX[j % 2], wx = WX[j % 2], cy = ROWS[Math.floor(j / 2)];
    CO2A.push({ c: mk('C', cx, cy, 1), o1: mk('O', cx - 24, cy, 0.9), o2: mk('O', cx + 24, cy, 0.9) });
    H2OA.push({ o: mk('O', wx, cy, 1), h1: mk('H', wx - 14.7, cy + 10.8, 0.93), h2: mk('H', wx + 14.7, cy + 10.8, 0.93) });
  }
  // destinations: carbons into the ring, hydrogens onto glucose, oxygens shared out at random (the swirl
  // hides who goes where: the last line says the O2 really comes from water)
  const gluC = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'], gluO = ['O1', 'O2', 'O3', 'O4', 'O5', 'O6'];
  const gluH = ['H1', 'H1o', 'H2', 'H2o', 'H3', 'H3o', 'H4', 'H4o', 'H5', 'H6a', 'H6b', 'H6o'];
  const O2D = []; for (let j = 0; j < 6; j++) { const x = OX[j % 2], y = ROWS[Math.floor(j / 2)]; O2D.push([x - 10.8, y], [x + 10.8, y]); }
  const setDest = (r, p, prod) => { r.x1 = p[0]; r.y1 = p[1]; r.prod = prod; };
  CO2A.forEach((m, j) => setDest(m.c, [A[gluC[j]].x, A[gluC[j]].y], 'glu'));
  H2OA.forEach((m, j) => { setDest(m.h1, [A[gluH[2 * j]].x, A[gluH[2 * j]].y], 'glu'); setDest(m.h2, [A[gluH[2 * j + 1]].x, A[gluH[2 * j + 1]].y], 'glu'); });
  const oxS = []; CO2A.forEach(m => oxS.push(m.o1, m.o2)); H2OA.forEach(m => oxS.push(m.o));
  const oDest = gluO.map(n => [[A[n].x, A[n].y], 'glu']).concat(O2D.map(p => [p, 'o2']));
  const orr = rng(77), order = oxS.map(r => ({ r, k: orr() })).sort((a, b) => a.k - b.k);
  order.forEach((o, i) => setDest(o.r, oDest[i][0], oDest[i][1]));
  const T0 = mid('watch', 0.25), sw = rng(31);
  recs.forEach((r, i) => {
    r.i = i;
    r.ts = T0 + (r.x0 / 500) * 0.45 + sw() * 0.12;              // lift off, left to right
    r.orb = 55 + sw() * 125; r.w = 2.1 + sw() * 0.8;
    r.ph = Math.atan2(r.y0 - SWY, r.x0 - SWX) + (sw() - 0.5) * 1.2;
    r.te = T0 + 1.75 + ((r.x1 - 640) / 470) * 0.7 + sw() * 0.25;  // settle, nearer products first
    r.d = (Math.hypot(r.x0 - 280, r.y0 - 385) / 300) * 0.45;
  });
  ['H', 'O', 'C'].forEach(kind => recs.filter(r => r.kind === kind).forEach(r => {
    r.ghost = E('circle', { cx: r.x0, cy: r.y0, r: r.r0 * r.s0 - 1, fill: 'none', stroke: ATOM[kind][0], 'stroke-width': 2, 'stroke-dasharray': '4 4', opacity: 0.35 }, ghostAG);
    r.halo = E('circle', { r: r.r0 * 2.3, fill: glow('#FFF3A0') }, haloG);
    r.el = atom(atomG, kind, r.r0, { letter: kind !== 'H' });
  }));
  const rxArrow = arrow(atG, 520, 385, 616, 385, { color: C.ink, width: 9 });
  const lbCO2 = T(atG, 172, 548, '6 carbon dioxide', { size: 28, weight: 600, anchor: 'middle', fill: C.co2 });
  const lbH2O = T(atG, 416, 548, '6 water', { size: 28, weight: 600, anchor: 'middle', fill: C.water });
  const lbGlu = T(atG, GX, 562, '1 glucose', { size: 28, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  const lbO2 = T(atG, 1053, 562, '6 O₂ molecules', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  function tally(parent, xs, withTicks) {
    return ['C', 'H', 'O'].map((k, i) => {
      const g = G(parent); tr(g, xs[i], 602);
      atom(g, k, 17, { letter: true });
      const n = T(g, 28, 13, '0', { size: 38, weight: 700 });
      T(g, 14, 50, ['carbon', 'hydrogen', 'oxygen'][i], { size: 24, weight: 500, anchor: 'middle', fill: C.muted });
      const tk = withTicks ? tick(g, 10) : null; if (tk) tr(tk, 92, -6);
      return { g, n, tk, total: [6, 12, 18][i] };
    });
  }
  const tL = tally(atG, [92, 222, 352], false), tR = tally(atG, [722, 862, 1002], true);
  const oNoteL = T(atG, 438, 615, '(12 + 6)', { size: 24, weight: 600, fill: C.muted });
  const eqSign = T(atG, 600, 624, '=', { size: 64, weight: 700, anchor: 'middle', fill: C.good });
  const ban = G(atG);
  E('rect', { x: 330, y: 664, width: 540, height: 54, rx: 27, fill: 'rgba(86,214,155,0.14)', stroke: C.good, 'stroke-width': 2.5 }, ban);
  T(ban, 600, 701, '**No atoms lost or made**', { size: 31, weight: 500, anchor: 'middle', boldFill: C.good });

  /* ================= the sixes ================= */
  const sixChip = chip(root, '6 CO₂ + 6 H₂O → 1 glucose', { size: 32, fill: C.card2, stroke: C.energy });
  tr(sixChip, 600, 470);

  /* ================= the oxygen comes from water ================= */
  const wG = G(root);
  const WY0 = 572, WXs = [470, 620], OXY = 470;
  const splitFlash = E('circle', { cx: 545, cy: WY0, r: 150, fill: glow('#FFF3A0') }, wG);
  const hG = G(wG);
  const wat = WXs.map(x => ({ h1: atom(hG, 'H', 14), h2: atom(hG, 'H', 14), o: atom(wG, 'O', 22, { letter: true }), x }));
  const fromWater = T(wG, 545, 420, 'oxygen comes from **water**', { size: 32, weight: 500, anchor: 'middle', boldFill: C.water });
  const notCO2 = G(wG); tr(notCO2, 880, WY0);
  molCO2(notCO2, 20, { letter: true });
  const notX = cross(notCO2, 17); tr(notX, 62, -38);
  const notLab = T(wG, 880, 642, 'not from carbon dioxide', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  return t => {
    /* --- the equation's own moves: shrink for the ghost, up for the atoms --- */
    const shrink = P(t, at('notreactant') - 0.25, 0.5) * (1 - P(t, at('symbol') - 0.1, 0.6));
    const up = P(t, at('count') - 0.25, 0.9) * (1 - P(t, at('sixes') - 0.05, 0.9));
    {
      let s = 1, tx = 0, ty = 0;
      if (shrink > 0) { s = 1 - (1 - SHRINK) * shrink; tx = XR * (1 - s); ty = EQY * (1 - s); }
      else if (up > 0) { s = 1 - (1 - UPS) * up; tx = 600 * (1 - s); ty = lerp(EQY, UPY, up) - s * EQY; }
      eqG.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})`);
    }
    op(eqG, P(t, at('word') + 0.2, 0.3, linear));
    op(heading, win(t, at('word') + 0.1, at('cars') + 0.1, 0.4));
    op(heading2, win(t, mid('symbol', 0.04), at('coeff') + 0.1, 0.4));

    /* --- chips pop in, initials glow, morph to formulas --- */
    const chipAt = [0.38, 0.47, 0.51, 0.6, 0.64, 0.79, 0.83];
    const KEYS = ['co2', 'wat', 'glu', 'oxy'];
    const glowAt = { co2: 0.13, wat: 0.185, glu: 0.24, oxy: 0.295 };
    const linkAt = { co2: 0.46, wat: 0.56, glu: 0.65, oxy: 0.74 };
    const morphAt = { co2: 0.32, wat: 0.46, glu: 0.61, oxy: 0.86 };
    const mps = parts.map(p => (p.key ? P(t, mid('symbol', morphAt[p.key]), 0.45, ease) : 0));
    const XS = layout(mps, lerp(12, 22, (mps[0] + mps[2] + mps[4] + mps[6]) / 4)), AX = XS[3];
    parts.forEach((p, i) => {
      const a = P(t, mid('word', chipAt[i]), 0.5, pop);
      let s = 0.7 + 0.3 * a;
      if (p.key) {
        s += 0.1 * pulse(t, mid('cars', glowAt[p.key]), 0.5) + 0.08 * pulse(t, mid('cars', linkAt[p.key]), 0.5);
        op(p.glow, win(t, mid('cars', glowAt[p.key]), mid('cars', 0.96), 0.35) * (0.75 + 0.25 * wave(t, 1.4)));
        const mp = mps[i];
        op(p.chip, 1 - mp); scaleAt(p.chip, 0, 0, Math.min(1 - 0.35 * mp, lerp(p.w0, p.w1, mp) / p.w0));
        op(p.form, mp); tr(p.form, 0, 17, 0.7 + 0.3 * mp);
        op(p.icon, clamp(a * 2) * (1 - P(t, at('symbol'), 0.5, linear)));
        tr(p.icon, p.x, EQY - 88 + (1 - clamp(a)) * 16);
      }
      op(p.g, clamp(a * 2)); tr(p.g, XS[i], EQY, s);
    });
    /* glows on the formulas: coefficients (coeff, sixes) and whole formulas (sixes, water) */
    const cHalo = win(t, mid('coeff', 0.02), mid('coeff', 0.56), 0.3);
    const g6 = { co2: Math.max(cHalo, win(t, mid('sixes', 0.1), mid('sixes', 0.97), 0.3)), wat: win(t, mid('sixes', 0.3), mid('sixes', 0.97), 0.3), oxy: win(t, mid('sixes', 0.72), mid('sixes', 0.97), 0.3) };
    const pAll = pulse(t, mid('sixes', 0.74), 0.6);
    const p6 = {
      co2: 0.25 * pulse(t, mid('coeff', 0.04), 0.6) + 0.18 * pulse(t, mid('coeff', 0.3), 0.6) + 0.25 * pulse(t, mid('sixes', 0.1), 0.6) + 0.2 * pAll,
      wat: 0.25 * pulse(t, mid('sixes', 0.3), 0.6) + 0.2 * pAll,
      oxy: 0.25 * pulse(t, mid('sixes', 0.72), 0.6) + 0.2 * pAll,
    };
    const hl = { co2: 0, wat: win(t, mid('water', 0.42), mid('water', 0.76), 0.3) * 0.8, glu: win(t, mid('sixes', 0.44), mid('sixes', 0.68), 0.3) * 0.8, oxy: win(t, mid('water', 0.22), mid('water', 0.5), 0.3) * 0.8 };
    KEYS.forEach(k => {
      const f = PK[k].form;
      op(f.hl, hl[k]);
      if (f.coef) { op(f.halo, g6[k]); f.coef.setAttribute('fill', g6[k] > 0.5 ? C.energy : C.ink); scaleAt(f.coef, f.x0 + f.cw / 2, -FS * 0.34, 1 + p6[k]); }
    });
    // braces
    op(brG, 1 - P(t, at('symbol') - 0.1, 0.5, linear));
    brR.set(P(t, mid('reactants', 0.04), 0.7)); brP.set(P(t, mid('reactants', 0.55), 0.7));
    op(lbR, P(t, mid('reactants', 0.14), 0.5, linear)); op(lbP, P(t, mid('reactants', 0.66), 0.5, linear));
    // light and chlorophyll over the arrow
    const sp = P(t, mid('arrow', 0.03), 0.6, easeOut), cp = P(t, mid('arrow', 0.15), 0.6, easeOut);
    op(sunG, clamp(sp * 3)); tr(sunG, AX, lerp(EQY - 190, EQY - 52, sp), 1 + 0.12 * pulse(t, mid('arrow', 0.36), 0.6) + 0.12 * pulse(t, mid('arrow', 0.74), 0.6)); sunA.upd(t * AMP);
    op(lightT, P(t, mid('arrow', 0.1), 0.4, linear)); attr(lightT, 'x', AX + 40);
    op(chl, clamp(cp * 3)); tr(chl, AX, lerp(EQY + 160, EQY + 54, cp), 1 + 0.08 * pulse(t, mid('arrow', 0.44), 0.6));
    const es = win(t, mid('arrow', 0.72), at('notreactant') + 0.2, 0.4);
    op(enSrc, es); op(enLine, es);

    /* --- the car and the lettering --- */
    const carA = win(t, at('cars') - 0.1, at('reactants') + 0.2, 0.4);
    op(carG, carA); op(lettG, carA);
    if (carA > 0) {
      const roll = P(t, mid('cars', 0.03), 1.9, easeOut), x = lerp(-170, CAR_STOP, roll);
      const stopB = pulse(t, mid('cars', 0.03) + 1.75, 0.5);
      tr(car, x, 652); carBody.setAttribute('transform', `translate(0 ${(-3 * stopB).toFixed(2)}) rotate(${(-2.5 * stopB).toFixed(2)} 40 0)`);
      wheels.forEach(w => w.sp.setAttribute('transform', `rotate(${((x + 170) / 23 * 57.3).toFixed(1)})`));
      wEls.forEach((e, i) => { const p = P(t, mid('cars', 0.12 + i * 0.055), 0.35, easeOut); op(e, p); e.setAttribute('transform', `translate(0 ${((1 - p) * 14).toFixed(1)})`); });
      links.forEach((l, i) => op(l, P(t, mid('cars', i < 4 ? linkAt[KEYS[i]] : 0.86), 0.45, linear) * 0.9));
      const sg = P(t, mid('cars', 0.86), 0.6, pop); tr(sprout, 1030, 644, Math.max(0.01, sg)); op(sprout, clamp(sg * 3));
    }

    /* --- never sunlight as a reactant --- */
    const gA = win(t, at('notreactant') - 0.05, at('symbol') + 0.25, 0.35);
    op(ghostG, gA);
    if (gA > 0) {
      const gs = P(t, at('notreactant') + 0.05, 0.6, easeOut), dx = (1 - gs) * -260;
      tr(ghostChip, gX + dx, EQY); tr(ghostPlus, gPX + dx, EQY);
      op(ghostChip, 0.9); op(ghostPlus, 0.75);
      ghostStrike.set(P(t, mid('notreactant', 0.45), 0.4, linear));
      const xp = P(t, mid('notreactant', 0.62), 0.35, pop); op(ghostX, clamp(xp * 2)); tr(ghostX, gX, EQY - 54, Math.max(0.01, xp));
      op(ghostNote, P(t, mid('notreactant', 0.7), 0.35, linear));
    }

    /* --- coefficient, then small numbers --- */
    const cA = win(t, at('coeff') - 0.1, mid('coeff', 0.6), 0.4);
    op(coG, cA);
    if (cA > 0) {
      coefLine.style.opacity = P(t, mid('coeff', 0.08), 0.3, linear).toFixed(3);
      minis.forEach((m, k) => { const p = P(t, mid('coeff', 0.3 + k * 0.035), 0.4, pop); tr(m.g, m.x, m.y, Math.max(0.01, p)); op(m.g, clamp(p * 2)); });
      op(coefLab, P(t, mid('coeff', 0.14), 0.4, linear));
    }
    const sA = win(t, mid('coeff', 0.58), at('count') - 0.05, 0.35);
    op(subG, sA);
    if (sA > 0) {
      op(subHalo, 0.7 + 0.3 * wave(t, 1.2));
      const bp = P(t, mid('coeff', 0.62), 0.5, pop); tr(bigCO2, BIGX, BIGY, Math.max(0.01, bp));
      oHalos.forEach(h => op(h, P(t, mid('coeff', 0.8), 0.4, linear) * (0.6 + 0.4 * wave(t, 1.1))));
      op(subLab, P(t, mid('coeff', 0.64), 0.4, linear)); op(subLab2, P(t, mid('coeff', 0.8), 0.4, linear));
    }

    /* --- atoms --- */
    const fT = win(t, at('count') + 0.1, at('sixes') + 0.1, 0.5);
    op(atG, fT);
    if (fT > 0) {
      const hC = win(t, mid('count', 0.36), mid('count', 0.55), 0.3), hH = win(t, mid('count', 0.55), mid('count', 0.75), 0.3), hO = win(t, mid('count', 0.75), end('count') + 0.4, 0.3);
      const rC = win(t, mid('right', 0.12), mid('right', 0.25), 0.3), rH = win(t, mid('right', 0.23), mid('right', 0.35), 0.3), rO = win(t, mid('right', 0.33), mid('right', 0.47), 0.3);
      const rG = win(t, mid('right', 0.5), mid('right', 0.64), 0.3), rO2 = win(t, mid('right', 0.64), mid('right', 0.79), 0.3);
      op(bondG, P(t, T0 + 3.6, 0.6, linear));
      op(swirlGlow, win(t, T0 + 0.3, T0 + 3.2, 0.7) * 0.5);
      recs.forEach(r => {
        const ua = P(t, r.ts, 0.8, ease), ub = P(t, r.te, 1.15, ease);
        let x = r.x0, y = r.y0, s = r.s0;
        if (ua > 0) {
          const ang = r.ph + r.w * (t - r.ts) * (S.reduce ? 0.5 : 1);
          const ox = SWX + Math.cos(ang) * r.orb, oy = SWY + Math.sin(ang) * r.orb * 0.78;
          x = lerp(lerp(r.x0, ox, ua), r.x1, ub); y = lerp(lerp(r.y0, oy, ua), r.y1, ub); s = lerp(lerp(r.s0, 0.9, ua), 1, ub);
        }
        const moving = ua > 0 && ub < 1;
        const settle = ub >= 1 ? 1 + 0.12 * pulse(t, r.te + 1.15, 0.35) : 1;
        const jig = !moving ? Math.sin(t * 2.1 + r.i * 1.7) * 1.3 * AMP : 0;
        const appear = P(t, at('count') + 0.15 + r.d, 0.45, pop);
        op(r.ghost, P(t, r.ts + 0.3, 0.5, linear) * 0.9 * (1 - P(t, at('right'), 0.6, linear)));
        tr(r.el, x + jig, y, Math.max(0.01, s * settle * appear));
        let h = 0;
        if (ua <= 0) h = r.kind === 'C' ? hC : r.kind === 'H' ? hH : hO;
        else if (ub >= 1) h = Math.max(r.kind === 'C' ? rC : r.kind === 'H' ? rH : rO, r.prod === 'glu' ? rG : rO2);
        op(r.halo, h * 0.95);
        if (h > 0) tr(r.halo, x, y, s);
      });
      rxArrow.set(P(t, at('count') + 0.4, 0.6)); op(rxArrow, 1 - 0.85 * win(t, T0 + 0.1, T0 + 3.4, 0.4));
      op(lbCO2, P(t, at('count') + 0.6, 0.5, linear) * (1 - P(t, T0, 0.4, linear)));
      op(lbH2O, P(t, at('count') + 0.75, 0.5, linear) * (1 - P(t, T0, 0.4, linear)));
      op(lbGlu, P(t, T0 + 3.7, 0.5, linear)); op(lbO2, P(t, T0 + 3.9, 0.5, linear));
      [0.38, 0.57, 0.77].forEach((f, i) => { const o = tL[i]; op(o.g, P(t, mid('count', f) - 0.1, 0.4, linear)); setText(o.n, String(Math.round(o.total * P(t, mid('count', f), 0.7, linear)))); });
      op(oNoteL, P(t, mid('count', 0.86), 0.4, linear));
      [0.13, 0.24, 0.34].forEach((f, i) => { const o = tR[i]; op(o.g, P(t, mid('right', f) - 0.1, 0.4, linear)); setText(o.n, String(Math.round(o.total * P(t, mid('right', f), 0.6, linear)))); op(o.tk, P(t, mid('right', f) + 0.7, 0.3, linear)); });
      const eqp = P(t, mid('right', 0.44), 0.5, pop); op(eqSign, clamp(eqp * 2));
      const bp = P(t, mid('right', 0.82), 0.6, easeOut); op(ban, bp); tr(ban, 0, (1 - bp) * 16);
    }

    /* --- the sixes --- */
    const sp6 = P(t, mid('sixes', 0.5), 0.5, pop);
    op(sixChip, win(t, mid('sixes', 0.5), at('water') + 0.15, 0.4)); tr(sixChip, 600, 470, Math.max(0.01, 0.75 + 0.25 * sp6));

    /* --- the oxygen comes from water --- */
    const wA = P(t, at('water') + 0.1, 0.4, linear);
    op(wG, wA);
    if (wA > 0) {
      const appear = P(t, mid('water', 0.3), 0.5, pop), split = P(t, mid('water', 0.5), 0.9, ease), rise = P(t, mid('water', 0.6), 1.1, ease);
      wat.forEach((w, k) => {
        const s = Math.max(0.01, appear), side = k ? 1 : -1;
        tr(w.o, lerp(w.x, 545 + side * 15.8, split), lerp(WY0, OXY, rise), s);
        const hy = WY0 + 16 + 50 * split;
        tr(w.h1, lerp(w.x - 21, w.x - 21 + side * 30 - 30, split), hy, s); tr(w.h2, lerp(w.x + 21, w.x + 21 + side * 30 + 30, split), hy, s);
        const hf = 1 - P(split, 0.45, 0.55, linear); op(w.h1, hf); op(w.h2, hf);
      });
      const fl = P(t, mid('water', 0.47), 0.8, linear);
      op(splitFlash, fl > 0 && fl < 1 ? Math.sin(fl * Math.PI) : 0); scaleAt(splitFlash, 545, WY0, 0.6 + 0.5 * fl);
      op(fromWater, P(t, mid('water', 0.68), 0.5, linear));
      const cp2 = P(t, mid('water', 0.76), 0.5, pop); op(notCO2, clamp(cp2 * 2)); tr(notCO2, 880, WY0, Math.max(0.01, cp2));
      const xp = P(t, mid('water', 0.84), 0.35, pop); op(notX, clamp(xp * 2)); tr(notX, 62, -38, Math.max(0.01, xp));
      op(notLab, P(t, mid('water', 0.86), 0.4, linear));
    }
  };
});

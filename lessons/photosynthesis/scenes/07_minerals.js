/* Minerals, and mass from thin air.
   First half: three potted plants under the sun. Ions rise into the roots -> a nitrate ion climbs the
   stem and becomes protein, the plant grows -> a plant short of nitrate: stunted, yellow older leaves
   -> magnesium greens a chloroplast -> chlorosis: leaves yellow, less light caught, the rate drops.
   Second half: where does new mass come from? -> showpiece: van Helmont's willow grows for five years
   (+70 kg) -> the soil lost only 60 g -> he guessed water: partly right -> dry mass is mostly carbon
   dioxide -> showpiece: CO2 streams in and its carbon builds the trunk: wood from thin air. */
scene('minerals', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const lineD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  const quadPt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  const cubicPt = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  const popAt = (el, x, y, t, t0, s1) => { const k = P(t, t0, 0.5, pop); op(el, clamp(k * 2)); tr(el, x, y, Math.max(0.01, (s1 || 1) * (0.6 + 0.4 * k))); return k; };
  const beat = (t, a, b) => Math.min(P(t, a - 0.3, 0.3, linear), 1 - P(t, b - 0.55, 0.3, linear));
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a light CO2 for the inflowing stream: lib's molCO2 geometry, one circle per atom */
  const atomC = (parent, kind, r, x, y) => { const [c, dk] = ATOM[kind]; return E('circle', { cx: x, cy: y, r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08) }, parent); };
  function h2o(parent, r) { const g = G(parent); atomC(g, 'H', r * 0.62, -r * 0.98, r * 0.72); atomC(g, 'H', r * 0.62, r * 0.98, r * 0.72); atomC(g, 'O', r, 0, 0); return g; }
  function co2(parent, r) { const g = G(parent); atomC(g, 'O', r * 0.9, -r * 1.6, 0); atomC(g, 'O', r * 0.9, r * 1.6, 0); atomC(g, 'C', r, 0, 0); return g; }
  const NIT = '#6FA8FF', NIT_DK = '#2F5FBF', MAG = '#DCE4EA', MAG_DK = '#7B8C99', PROT = '#E6A8FF', WOOD = '#C9A46A';
  const YEL = ball('#F2D45C', '#B08A1E');
  /* kit leaf with its four side-vein strokes merged into one path: same look, fewer elements */
  function leafL(parent, s, o) {
    const lf = leaf(parent, s, o), inner = lf.firstChild, veins = Array.from(inner.children).slice(2);
    if (veins.length > 1) { veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' ')); veins.slice(1).forEach(v => v.remove()); }
    return lf;
  }
  /* the lesson's potted plant (as in the uses-of-glucose chapter): a stem with kit leaves in a terracotta
     pot, origin at the middle of the soil surface. o.cut cuts the pot away to show soil and roots.
     g.yellow(i, v) yellows leaf i; g.grow(k) stretches the stem. */
  function pottedPlant(parent, o) {
    o = o || {};
    const g = G(parent), h = o.h || 260, pw = o.pw || 64, ph = o.ph || 100;
    E('ellipse', { cx: 0, cy: ph + 9, rx: pw + 10, ry: 9, fill: 'rgba(0,0,0,0.28)' }, g);
    const top = G(g);
    const stem = E('path', { fill: 'none', stroke: C.stem, 'stroke-width': o.sw || 9, 'stroke-linecap': 'round' }, top);
    const LV = o.leaves || [[0.3, -1, 22, 0.5], [0.5, 1, 22, 0.5], [0.72, -1, 34, 0.44], [0.93, 1, 52, 0.38]];
    g.leaves = LV.map(([f, side, ang, s]) => {
      const lf = leafL(top, s), inner = lf.firstChild, blade = inner.firstChild;
      const yb = blade.cloneNode(false);
      yb.setAttribute('fill', YEL); yb.setAttribute('stroke', '#A8841A');
      inner.insertBefore(yb, blade.nextSibling); op(yb, 0);
      return { g: lf, yb, f, side, ang, s };
    });
    const bw = pw * 0.78;
    const body = `M${-pw},12 L${pw},12 L${bw.toFixed(1)},${ph} Q${bw.toFixed(1)},${ph + 6} ${(bw - 8).toFixed(1)},${ph + 6} L${(-bw + 8).toFixed(1)},${ph + 6} Q${(-bw).toFixed(1)},${ph + 6} ${(-bw).toFixed(1)},${ph} Z`;
    if (o.cut) {
      E('path', { d: body, fill: '#5E2C14' }, g);
      const iw = pw - 10, ibw = bw - 9;
      E('path', { d: `M${-iw},14 L${iw},14 L${ibw.toFixed(1)},${ph - 3} L${(-ibw).toFixed(1)},${ph - 3} Z`, fill: linGrad('#6B4A33', '#45301F', true) }, g);
      const RD = o.roots || `M0,6 C-4,30 -18,50 -32,${ph - 16} M0,6 C4,34 16,56 28,${ph - 14} M0,8 C0,40 -2,64 4,${ph - 8} M-6,38 C-20,44 -32,48 -44,46 M6,46 C20,52 30,60 42,58`;
      g.roots = E('path', { d: RD, fill: 'none', stroke: '#EAD7B7', 'stroke-width': o.rootW || 4, 'stroke-linecap': 'round' }, g);
      g.rootGlow = E('path', { d: RD, fill: 'none', stroke: '#FFF3C4', 'stroke-width': (o.rootW || 4) + 4, 'stroke-linecap': 'round', opacity: 0 }, g);
      g.ionG = G(g);
      E('path', { d: body, fill: 'none', stroke: '#C8693A', 'stroke-width': 10, 'stroke-linejoin': 'round' }, g);
    } else {
      E('path', { d: body, fill: ball('#D2743F', '#8E4220'), stroke: '#E89A6A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    }
    E('path', { d: `M${-pw + 4},4 Q0,-16 ${pw - 4},4 Z`, fill: C.soil, stroke: '#4E3524', 'stroke-width': 2 }, g);
    E('rect', { x: -pw - 8, y: -2, width: 2 * pw + 16, height: 22, rx: 6, fill: ball('#DD8A52', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 2.5 }, g);
    let kNow = 1;
    g.grow = k => {
      kNow = k; const hh = h * k;
      stem.setAttribute('d', `M0,6 C6,${(-hh * 0.35).toFixed(1)} -6,${(-hh * 0.7).toFixed(1)} 0,${(-hh).toFixed(1)}`);
      g.leaves.forEach(L => L.g.setAttribute('transform', `translate(${L.side * 3} ${(-L.f * hh).toFixed(1)}) rotate(${L.side > 0 ? -L.ang : 180 + L.ang})`));
    };
    g.grow(1);
    g.yellow = (i, v) => op(g.leaves[i].yb, v);
    g.leafPt = (i, along) => { const L = g.leaves[i], a = (L.side > 0 ? -L.ang : 180 + L.ang) * Math.PI / 180, d = 205 * L.s * along; return [L.side * 3 + Math.cos(a) * d, -L.f * h * kNow + Math.sin(a) * d]; };
    g.topY = () => -h * kNow;
    return g;
  }
  /* van Helmont's willow: trunk, five branches, a canopy and drooping leafy strands. Origin: the trunk
     base. g.grow(k 0..1) takes it from a sapling to a tree; g.slots are carbon positions in its wood. */
  function willowTree(parent) {
    const g = G(parent), body = G(g);
    const wood = G(body);
    E('path', { d: 'M-21,4 C-18,-70 -15,-140 -10,-206 L10,-206 C15,-140 18,-70 21,4 Z', fill: ball('#9A7050', '#5A3E2A'), stroke: '#6B4A33', 'stroke-width': 2 }, wood);
    const BR = [[[-6, -196], [-40, -250], [-100, -288], [-166, -290]], [[-4, -204], [-24, -270], [-46, -318], [-80, -342]], [[0, -205], [4, -280], [8, -330], [16, -366]], [[4, -204], [30, -268], [58, -312], [96, -338]], [[6, -196], [46, -246], [104, -282], [168, -284]]];
    BR.forEach(b => E('path', { d: `M${b[0]} C${b[1]} ${b[2]} ${b[3]}`, fill: 'none', stroke: '#7A563A', 'stroke-width': 11, 'stroke-linecap': 'round' }, wood));
    const canopy = G(body);
    [[0, -292, 186, 76], [-112, -268, 96, 70], [112, -270, 96, 68], [0, -338, 128, 52]]
      .forEach(([x, y, rx, ry]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: linGrad('#79C95C', '#2A6B33', true), opacity: 0.95 }, canopy));
    const strandG = G(body), strands = [], NSTR = 21, NB = 5;
    const bands = []; for (let b = 0; b < NB; b++) bands.push({ stem: '', leaves: ['', ''], th: -0.1 + 0.72 * (b / (NB - 1)) * 0.96 });
    for (let i = 0; i < NSTR; i++) {
      const x = -200 + i * (400 / (NSTR - 1)), q = x / 204;
      const yTop = -246 - 96 * (1 - q * q), L = 168 + 62 * Math.abs(q), dx = q * 24;
      const pt = u => [x + dx * u * u, yTop + L * u];
      const pts = []; for (let k = 0; k <= 6; k++) pts.push(pt(k / 6));
      let ld = '';
      for (let k = 1; k <= 8; k++) {
        const [px, py] = pt(k / 8.6), side = k % 2 ? 1 : -1;
        const a = Math.PI / 2 - side * 0.7, ca = Math.cos(a), sa = Math.sin(a);
        const tx = px + ca * 19, ty = py + sa * 19, mx = px + ca * 9.5, my = py + sa * 9.5, nx = -sa * 4.5, ny = ca * 4.5;
        ld += `M${px.toFixed(1)},${py.toFixed(1)} Q${(mx + nx).toFixed(1)},${(my + ny).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)} Q${(mx - nx).toFixed(1)},${(my - ny).toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}Z`;
      }
      const B = bands[Math.min(NB - 1, Math.round(Math.abs(q) * (NB - 1)))];
      B.stem += openPath(pts) + ' '; B.leaves[i % 2] += ld;
    }
    bands.forEach(B => {
      const sg = G(strandG);
      E('path', { d: B.stem, fill: 'none', stroke: '#4F9440', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, sg);
      B.leaves.forEach((d, k) => { if (d) E('path', { d, fill: k ? '#A2DE74' : '#8CCF62', stroke: '#3F7F33', 'stroke-width': 1 }, sg); });
      strands.push({ g: sg, th: B.th });
    });
    // carbon atom slots: up the trunk, then out along each branch
    const slots = [];
    for (let y = -10; y > -200; y -= 13) {
      const hw = lerp(20, 10, -y / 206) - 7, n = Math.max(1, Math.round(2 * hw / 12) + 1);
      for (let j = 0; j < n; j++) slots.push([n === 1 ? 0 : -hw + j * (2 * hw / (n - 1)), y]);
    }
    BR.forEach(b => { for (let u = 0.1; u <= 1.0001; u += 0.085) slots.push(cubicPt(b[0], b[1], b[2], b[3], u)); });
    g.atomsG = G(body);
    g.slots = slots; g.canopy = canopy; g.strandG = strandG; g.strands = strands;
    g.grow = k => {
      tr(body, 0, 0, lerp(0.28, 1, k));
      op(canopy, clamp((k - 0.3) / 0.45));
      strands.forEach(s => op(s.g, clamp((k - s.th) / 0.12)));
    };
    g.grow(1);
    return g;
  }
  /* pie slice from angle a0 to a1 (radians, clockwise from +x) */
  const sliceD = (cx, cy, r, a0, a1) => {
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    return `M${cx},${cy} L${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`;
  };

  /* ================= first half: three potted plants under the sun ================= */
  const H1 = G(root);
  const sunG = sun(H1, 38); tr(sunG, 1090, 140);
  const GY = 540, AX = 230, BX = 545, CXp = 860;
  const AG = G(H1);
  const plantA = pottedPlant(AG, { h: 290, pw: 66, ph: 104, cut: true, leaves: [[0.3, -1, 22, 0.52], [0.5, 1, 22, 0.52], [0.72, -1, 32, 0.46], [0.93, 1, 50, 0.4]] });
  const plantB = pottedPlant(H1, { h: 170, pw: 66, ph: 104, leaves: [[0.3, -1, 22, 0.42], [0.52, 1, 22, 0.42], [0.74, -1, 32, 0.38], [0.94, 1, 50, 0.34]] });
  tr(plantB, BX, GY);
  const plantC = pottedPlant(H1, { h: 275, pw: 66, ph: 104, leaves: [[0.3, -1, 22, 0.52], [0.5, 1, 22, 0.52], [0.72, -1, 32, 0.46], [0.93, 1, 50, 0.4]] });
  tr(plantC, CXp, GY);
  // ions in A's soil: blue nitrate, silver magnesium
  const ions = [], ir = rng(12);
  const IONP = [[-40, 30], [-14, 22], [22, 30], [44, 40], [-46, 62], [-20, 76], [8, 58], [36, 76], [-4, 90], [18, 92]];
  IONP.forEach(([x, y], k) => {
    const nit = k % 2 === 0;
    const el = E('circle', { r: 6.5, fill: nit ? ball(NIT, NIT_DK) : ball(MAG, MAG_DK), stroke: '#ffffff', 'stroke-width': 1.2 }, plantA.ionG);
    const tips = [[-32, 88], [28, 90], [4, 96], [-44, 46], [42, 58]];
    const tip = tips[k % 5];
    ions.push({ el, x, y, tip, nit, absorb: k < 6, ph: ir() * TAU, k });
  });
  const legend = G(AG);
  const chN = chip(legend, 'nitrate', { size: 26, fill: NIT, color: '#08203F' }); tr(chN, 160, 54);
  const chM = chip(legend, 'magnesium', { size: 26, fill: MAG, color: '#1C2A33' }); tr(chM, 172, 108);
  E('line', { x1: 160 - chN.w / 2 - 4, y1: 54, x2: 46, y2: 42, stroke: NIT, 'stroke-width': 2.5 }, legend);
  E('line', { x1: 172 - chM.w / 2 - 4, y1: 108, x2: 36, y2: 76, stroke: MAG, 'stroke-width': 2.5 }, legend);
  // header: glucose + minerals
  const hdr = G(H1);
  const hdrHex = G(hdr); molGlucose(hdrHex, 22); tr(hdrHex, 560, 172);
  const hdrGlu = T(hdr, 596, 186, 'glucose', { size: 38, weight: 700, fill: C.glucoseLt });
  const hdrPlus = T(hdr, 772, 186, '+', { size: 44, weight: 700, anchor: 'middle', fill: C.muted });
  const hdrMin = T(hdr, 806, 186, 'minerals', { size: 38, weight: 700, fill: MAG });
  const hdrSub = T(hdr, 780, 226, 'small amounts, from the soil', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  // nitrate -> nitrogen -> proteins
  const flow = G(H1), FY = 176;
  const fN = chip(flow, 'nitrate', { size: 28, fill: NIT, color: '#08203F' });
  const fNg = chip(flow, 'nitrogen', { size: 28, fill: C.card2, stroke: NIT, color: C.ink });
  const fP = chip(flow, 'proteins', { size: 28, fill: '#3A2346', stroke: PROT, color: PROT });
  const fGap = 64, fTot = fN.w + fNg.w + fP.w + 2 * fGap, fX0 = 735 - fTot / 2;
  const fXs = [fX0 + fN.w / 2, fX0 + fN.w + fGap + fNg.w / 2, fX0 + fN.w + fGap + fNg.w + fGap + fP.w / 2];
  [fN, fNg, fP].forEach((c, i) => tr(c, fXs[i], FY));
  const fA1 = arrow(flow, fX0 + fN.w + 10, FY, fX0 + fN.w + fGap - 10, FY, { color: C.muted, width: 5 });
  const fA2 = arrow(flow, fX0 + fN.w + fGap + fNg.w + 10, FY, fX0 + fN.w + fGap + fNg.w + fGap - 10, FY, { color: C.muted, width: 5 });
  const forGrowth = rich(flow, fXs[2], FY + 62, [['for ', C.muted, 600], ['growth', C.good, 700]], { size: 28, anchor: 'middle' });
  const climbers = [0, 1, 2].map(() => E('circle', { r: 8, fill: ball(NIT, NIT_DK), stroke: '#ffffff', 'stroke-width': 1.5 }, AG));
  const beadsA = G(AG);
  const BPA = [[-30, 6], [-12, -8], [6, 6], [24, -8]], BCA = ['#FF8FB1', '#7AD3FF', '#FFD166', '#9BE38A'];
  E('path', { d: lineD(BPA), fill: 'none', stroke: '#E9EEF2', 'stroke-width': 3, opacity: 0.7 }, beadsA);
  const beadEls = BPA.map((p, k) => E('circle', { cx: p[0], cy: p[1], r: 9, fill: ball(BCA[k], '#55606B'), stroke: '#fff', 'stroke-width': 1.2 }, beadsA));
  // labels under the pots
  const lblA = T(H1, AX, 694, 'healthy', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  const lblB = chip(H1, 'short of nitrate', { size: 26, fill: C.card2, stroke: NIT, color: C.ink }); tr(lblB, BX, 688);
  const lblC = chip(H1, 'short of magnesium', { size: 26, fill: C.card2, stroke: MAG, color: C.ink }); tr(lblC, CXp, 688);
  // B: stunted, older leaves yellow
  const bNotes = G(H1);
  const ATOP = GY - 290 * 1.12;
  E('line', { x1: AX + 60, y1: ATOP, x2: BX + 96, y2: ATOP, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 8' }, bNotes);
  const stArrow = G(bNotes);
  E('path', { d: `M${BX + 82},${GY - 176} L${BX + 82},${ATOP + 8}`, stroke: C.energy, 'stroke-width': 4 }, stArrow);
  E('path', { d: `M${BX + 72},${GY - 186} L${BX + 82},${GY - 172} L${BX + 92},${GY - 186} M${BX + 72},${ATOP + 18} L${BX + 82},${ATOP + 4} L${BX + 92},${ATOP + 18}`, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, stArrow);
  const stLbl = T(bNotes, BX + 102, (ATOP + GY - 176) / 2 + 10, 'stunted growth', { size: 28, weight: 700, fill: C.energy });
  const yLbl = G(bNotes);
  const bl1 = plantB.leafPt(1, 0.55);
  labelLine(yLbl, BX + 140, GY - 34, BX + bl1[0], GY + bl1[1], 'yellow older leaves', { size: 28, fill: '#F2D45C', anchor: 'start', weight: 700, line: '#F2D45C' });
  // magnesium -> chlorophyll
  const MGG = G(H1);
  const CHL = [CXp, 352], INS = [660, 230];
  const chlPale = G(MGG), chlGreen = G(MGG);
  chloroplast(chlPale, 270, 146); chloroplast(chlGreen, 270, 146);
  chlPale.setAttribute('opacity', 1);
  chlPale.querySelectorAll('ellipse, rect').forEach(e => { if (e.tagName === 'ellipse') { e.setAttribute('fill', ball('#D6D3A4', '#8E8A5E')); e.setAttribute('stroke', '#8E8A5E'); } else e.setAttribute('fill', '#A9A57A'); });
  const mgChip = chip(MGG, 'magnesium', { size: 28, fill: MAG, color: '#1C2A33' });
  const mgLbl = rich(MGG, CXp, 470, [['needed for ', C.ink, 600], ['chlorophyll', C.chloro, 800]], { size: 32, anchor: 'middle' });
  const mgGlow = E('circle', { r: 150, fill: glow(C.chloro) }, MGG);
  MGG.insertBefore(mgGlow, MGG.firstChild);
  const insLbl = T(MGG, INS[0], INS[1] + 64, 'less chlorophyll', { size: 26, weight: 700, anchor: 'middle', fill: '#F2D45C' });
  // chlorosis: light caught, rate falls
  const CLG = G(H1);
  const chlChip = chip(CLG, 'chlorosis', { size: 36, fill: '#3A3410', stroke: '#F2D45C', color: '#F2D45C', padX: 30 });
  const LIGHT = [[1040, 178, 900, 258], [1052, 200, 925, 372], [1066, 216, 958, 360]];
  const rays = LIGHT.map(([x1, y1, x2, y2]) => arrow(CLG, x1, y1, x2, y2, { color: C.energy, width: 5 }));
  const caught = LIGHT.map(([, , x2, y2], k) => { const s = spark(CLG, 13, { seed: k + 2 }); tr(s, x2, y2); return s; });
  const lessLbl = T(CLG, 1078, 304, 'less light', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const lessLbl2 = T(CLG, 1078, 334, 'absorbed', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const rateG = G(CLG);
  T(rateG, 966, 548, 'rate of', { size: 24, weight: 600, fill: C.muted });
  T(rateG, 966, 576, 'photosynthesis', { size: 24, weight: 600, fill: C.muted });
  const rateM = meter(rateG, { w: 176, h: 26, color: C.good }); tr(rateM, 966, 594);

  /* ================= second half: van Helmont's willow ================= */
  const H2 = G(root);
  const TX = 330, TY = 505;
  const tree = willowTree(H2); tr(tree, TX, TY);
  const bigPot = pottedPlant(H2, { h: 1, pw: 112, ph: 132, cut: true, leaves: [], rootW: 6, roots: 'M0,6 C-8,40 -40,70 -66,112 M0,6 C8,44 38,74 62,114 M0,8 C2,50 -4,84 6,120 M-14,48 C-40,56 -66,58 -88,52 M14,56 C40,64 64,70 86,66 M-30,80 C-44,92 -56,100 -70,98 M28,86 C42,98 56,104 72,100' });
  tr(bigPot, TX, TY);
  const soilTag = T(H2, TX, TY + 92, 'soil', { size: 26, weight: 700, anchor: 'middle', fill: '#E8D2B0' });
  // question: where from?
  const QG = G(H2);
  const bigQ = T(QG, TX, 330, '?', { size: 150, weight: 700, anchor: 'middle', fill: C.energy });
  const SRC = [
    { label: 'soil?', x: 150, y: 690, ax: [208, 674, 262, 612], col: '#E8D2B0', icon: g => E('path', { d: 'M-16,8 Q-14,-10 0,-12 Q14,-10 16,8 Z', fill: C.soil, stroke: '#8A6446', 'stroke-width': 2 }, g) },
    { label: 'water?', x: 132, y: 410, ax: [228, 420, 296, 452], col: C.water, icon: g => E('path', { d: 'M0,-15 C8,-4 11,2 11,7 A11,11 0 0 1 -11,7 C-11,2 -8,-4 0,-15 Z', fill: C.water, stroke: '#BDEBFA', 'stroke-width': 2 }, g) },
    { label: 'air?', x: 560, y: 360, ax: [482, 372, 366, 436], col: C.air, icon: g => molCO2(g, 8) },
  ].map(s => {
    const g = G(QG);
    const c = chip(g, s.label, { size: 30, fill: C.card2, stroke: s.col, color: s.col, padX: 44 });
    c.label.setAttribute('x', 14);
    const ic = G(g); tr(ic, -c.w / 2 + 28, 0); s.icon(ic);
    tr(g, s.x, s.y);
    s.arr = arrow(QG, s.ax[0], s.ax[1], s.ax[2], s.ax[3], { color: s.col, width: 4 });
    s.g = g;
    return s;
  });
  // the record card: van Helmont, years, mass
  const RC = G(H2);
  const vhChip = chip(RC, 'van Helmont, 1600s', { size: 30, fill: C.card2, stroke: C.line, color: C.ink }); tr(vhChip, 880, 146);
  const yrG = G(RC);
  const yrTxt = T(yrG, 790, 236, 'Year 1', { size: 34, weight: 700, fill: C.energy });
  const pips = [0, 1, 2, 3, 4].map(k => E('rect', { x: 910 + k * 44, y: 216, width: 36, height: 24, rx: 7, fill: C.energy, stroke: C.line, 'stroke-width': 2 }, yrG));
  const pipsOff = [0, 1, 2, 3, 4].map(k => E('rect', { x: 910 + k * 44, y: 216, width: 36, height: 24, rx: 7, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, yrG));
  pips.forEach((p, k) => yrG.insertBefore(pipsOff[k], p));
  const COLT = 770, COLS = 1010;
  const treeHd = T(RC, COLT, 318, 'tree gained', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const treeNum = T(RC, COLT, 388, '0 kg', { size: 62, weight: 700, anchor: 'middle', fill: C.good });
  const soilHd = T(RC, COLS, 318, 'soil lost', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const soilNum = T(RC, COLS, 388, '60 g', { size: 62, weight: 700, anchor: 'middle', fill: '#E8B98A' });
  const block = G(RC); tr(block, COLT, 520);
  E('path', { d: 'M-62,52 L-48,-30 Q-46,-40 -36,-40 L36,-40 Q46,-40 48,-30 L62,52 Q64,62 54,62 L-54,62 Q-64,62 -62,52 Z', fill: ball('#7D8C99', '#3B4650'), stroke: '#B9C6D2', 'stroke-width': 3 }, block);
  E('path', { d: 'M-22,-40 L-22,-62 Q-22,-74 -10,-74 L10,-74 Q22,-74 22,-62 L22,-40', fill: 'none', stroke: '#B9C6D2', 'stroke-width': 8 }, block);
  T(block, 0, 24, '70 kg', { size: 34, weight: 700, anchor: 'middle', fill: '#F2F7FA' });
  const crumbG = G(RC); tr(crumbG, COLS, 568);
  E('circle', { r: 6, fill: ball('#8A6446', '#4A3122') }, crumbG);
  E('circle', { r: 24, fill: 'none', stroke: '#E8B98A', 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, crumbG);
  T(crumbG, 0, 62, 'a crumb!', { size: 26, weight: 600, anchor: 'middle', fill: '#E8B98A' });
  const notSoil = G(RC); tr(notSoil, 890, 676);
  const nsChip = chip(notSoil, 'not from the soil', { size: 32, fill: '#3A1C22', stroke: C.bad, color: '#FF9AA4', padX: 40 });
  nsChip.label.setAttribute('x', 16);
  const nsX = cross(notSoil, 11); tr(nsX, -nsChip.w / 2 + 30, 0);
  // van Helmont with his watering can
  const VG = G(H2);
  const vh = person(VG, { shirt: '#9A6440', shorts: '#4A4458', skin: '#E2B48E', hair: '#5A4632', shoes: '#2A2018' });
  vh.pose({ armL: [-6, 10], armR: [100, 10], legL: [3, -3], legR: [-3, -3] });
  E('ellipse', { cx: 0, cy: -153, rx: 24, ry: 7, fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2 }, vh);
  E('rect', { x: -15, y: -222, width: 30, height: 30, rx: 5, fill: '#1E1A1A' }, vh);
  E('ellipse', { cx: 0, cy: -192, rx: 32, ry: 6, fill: '#1E1A1A' }, vh);
  const can = G(VG); VG.insertBefore(can, vh);
  E('path', { d: 'M-30,8 L-138,-64', stroke: '#8FB3A8', 'stroke-width': 8, 'stroke-linecap': 'round' }, can);
  E('ellipse', { cx: -142, cy: -67, rx: 9, ry: 13, fill: '#A9CBC0', stroke: '#E2F2EC', 'stroke-width': 2, transform: 'rotate(-34 -142 -67)' }, can);
  E('rect', { x: -36, y: 0, width: 66, height: 54, rx: 10, fill: ball('#8FB3A8', '#4E7468'), stroke: '#E2F2EC', 'stroke-width': 2.5 }, can);
  E('path', { d: 'M-16,2 Q0,-30 16,2', fill: 'none', stroke: '#E2F2EC', 'stroke-width': 5 }, can);
  const VX = 652, VY = 652;
  const canPos = [VX - 64, VY - 165], SPOUT = [-146, -66];
  const drops = [0, 1, 2, 3, 4].map(() => E('path', { d: 'M0,-7 C4,-2 5,1 5,4 A5,5 0 0 1 -5,4 C-5,1 -4,-2 0,-7 Z', fill: C.water }, VG));
  const bub = G(VG);
  E('circle', { cx: VX + 30, cy: VY - 222, r: 8, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, bub);
  E('circle', { cx: VX + 56, cy: VY - 254, r: 13, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, bub);
  E('path', { d: closedPath([[0, -52], [60, -46], [100, -16], [92, 26], [40, 50], [-30, 52], [-92, 30], [-100, -12], [-60, -46]].map(([x, y]) => [VX + 156 + x, VY - 330 + y])), fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, bub);
  T(bub, VX + 156, VY - 318, 'water!', { size: 40, weight: 700, anchor: 'middle', fill: C.water });
  const partly = G(VG); tr(partly, 900, 470);
  const ptChip = chip(partly, 'only partly right', { size: 30, fill: '#3A3410', stroke: C.glucose, color: C.glucoseLt, padX: 40 });
  ptChip.label.setAttribute('x', 16);
  const ptTick = tick(partly, 11, C.glucose); tr(ptTick, -ptChip.w / 2 + 30, 0);
  // dry mass: water out, a dry block, the pie
  const DG = G(H2);
  const steam = [0, 1, 2, 3, 4, 5].map(k => ({ el: h2o(DG, 10), x: TX - 140 + k * 56, y: 290 + (k % 3) * 44, ph: k / 6 }));
  const steamLbl = T(DG, 580, 236, 'water evaporates', { size: 28, weight: 700, fill: C.water });
  const dryB = G(DG);
  E('path', { d: 'M-58,-30 L-34,-54 L66,-54 L42,-30 Z', fill: '#E2C48C', stroke: '#F2DDB0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, dryB);
  E('path', { d: 'M42,-30 L66,-54 L66,32 L42,56 Z', fill: '#9C7A44', stroke: '#F2DDB0', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, dryB);
  E('rect', { x: -58, y: -30, width: 100, height: 86, fill: ball(WOOD, '#8C6A32'), stroke: '#F2DDB0', 'stroke-width': 2.5 }, dryB);
  E('path', { d: 'M-48,-8 Q-8,-14 32,-6 M-50,16 Q-10,10 34,18 M-48,38 Q-6,32 30,40', fill: 'none', stroke: '#8C6A32', 'stroke-width': 2.5, opacity: 0.7 }, dryB);
  const dryLbl = T(DG, 690, 548, 'dry mass', { size: 30, weight: 700, anchor: 'middle', fill: '#E2C48C' });
  const dryArrow = arrow(DG, 752, 450, 790, 450, { color: C.ink, width: 5 });
  const PCX = 905, PCY = 440, PR = 104;
  const A_CO2 = [20 * Math.PI / 180, 340 * Math.PI / 180], A_W = [340 * Math.PI / 180, 362 * Math.PI / 180], A_M = [2 * Math.PI / 180, 20 * Math.PI / 180];
  const pieBg = E('circle', { cx: PCX, cy: PCY, r: PR, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, DG);
  const sCO2 = E('path', { fill: C.co2, stroke: '#0B2230', 'stroke-width': 2 }, DG);
  const sW = E('path', { d: sliceD(PCX, PCY, PR, A_W[0], A_W[1]), fill: C.water, stroke: '#0B2230', 'stroke-width': 2 }, DG);
  const sM = E('path', { d: sliceD(PCX, PCY, PR, A_M[0], A_M[1]), fill: '#B98A5E', stroke: '#0B2230', 'stroke-width': 2 }, DG);
  const pieCO2 = G(DG); molCO2(pieCO2, 15, { letter: true }); tr(pieCO2, PCX - 22, PCY + 6);
  const pieLbl = T(DG, PCX, PCY + 160, 'carbon dioxide', { size: 32, weight: 700, anchor: 'middle', fill: C.co2 });
  const pieLbl2 = T(DG, PCX, PCY + 194, 'from the air', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const wLbl = G(DG);
  E('line', { x1: PCX + PR * 0.92, y1: PCY - 18, x2: 1036, y2: 420, stroke: C.water, 'stroke-width': 2.5 }, wLbl);
  T(wLbl, 1042, 428, 'water', { size: 26, weight: 700, fill: C.water });
  const mLbl = G(DG);
  E('line', { x1: PCX + PR * 0.94, y1: PCY + 18, x2: 1036, y2: 476, stroke: '#D8B48A', 'stroke-width': 2.5 }, mLbl);
  T(mLbl, 1042, 484, 'minerals', { size: 26, weight: 700, fill: '#D8B48A' });
  // wood: carbon from the air builds the tree
  const WG = G(H2);
  const atomEls = tree.slots.map(([x, y], j) => ({ el: E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: 7, fill: ball(C.carbon, C.carbonDk), stroke: '#C6D0D9', 'stroke-width': 1.2 }, tree.atomsG), j }));
  const NAT = atomEls.length;
  const inCO2 = [0, 1, 2, 3, 4, 5].map(k => ({ el: co2(WG, 12), k, to: [TX + [120, 60, -20, 150, 30, -110][k], TY + [-300, -340, -350, -250, -270, -300][k]] }));
  const cFly = [0, 1, 2, 3].map(k => ({ el: E('circle', { r: 8, fill: ball(C.carbon, C.carbonDk), stroke: '#C6D0D9', 'stroke-width': 1.2 }, WG), k }));
  const fl2 = G(WG);
  const airLbl = G(WG);
  T(airLbl, 1062, 214, 'carbon dioxide', { size: 26, weight: 700, anchor: 'middle', fill: C.co2 });
  T(airLbl, 1062, 244, 'from the air', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const fC = G(fl2); atom(fC, 'C', 16, { letter: true }); tr(fC, 800, 240);
  const fCl = T(fl2, 828, 252, 'carbon', { size: 30, weight: 700, fill: C.carbon });
  const chain = [['glucose', C.glucoseLt, 330], ['cellulose', '#A8E6A0', 410], ['every part of the plant', C.ink, 490]].map(([s, col, y], i) => {
    const c = chip(fl2, s, { size: 28, fill: C.card2, stroke: col, color: col }); tr(c, 880, y);
    const a = arrow(fl2, 880, y - 58, 880, y - 30, { color: C.muted, width: 4 });
    return { c, a, y };
  });
  const woodChip = G(WG); tr(woodChip, 880, 640);
  chip(woodChip, 'wood from thin air!', { size: 40, fill: '#3A3410', stroke: C.energy, color: C.energy, padX: 30 });

  /* ================= update ================= */
  return t => {
    /* ---------- first half ---------- */
    const h1 = P(t, at('alone') - 0.1, 0.4, linear) * (1 - P(t, at('question') - 0.5, 0.3, linear));
    op(H1, h1);
    if (h1 > 0) {
      sunG.upd(t);
      // A: in from the start, grows when the nitrate arrives
      const aIn = P(t, at('alone'), 0.7, easeOut), mvA = P(t, at('short') - 0.5, 0.9, ease);
      tr(AG, lerp(340, AX, mvA), GY + (1 - aIn) * 24, lerp(1.12, 1, mvA));
      const grow = P(t, mid('nitrate', 0.78), 0.9, easeOut);
      plantA.grow(1 + 0.12 * grow);
      // ions drift into the roots and the roots light up
      const tAbs = mid('alone', 0.6), glowR = win(t, tAbs, mid('nitrate', 0.3), 0.4);
      op(plantA.rootGlow, glowR * (0.45 + 0.35 * wave(t, 1.1)));
      ions.forEach(o => {
        let x = o.x + Math.sin(t * 1.2 + o.ph) * 2 * AMP, y = o.y + Math.cos(t * 1.1 + o.ph) * 2 * AMP, a = 1;
        if (o.absorb) { const u = P(t, tAbs + o.k * 0.18, 1.0, ease); x = lerp(x, o.tip[0], u); y = lerp(y, o.tip[1], u); a = 1 - P(t, tAbs + o.k * 0.18 + 0.8, 0.3, linear); }
        attr(o.el, 'cx', x); attr(o.el, 'cy', y); op(o.el, a);
      });
      op(legend, P(t, mid('alone', 0.62), 0.4, linear) * (1 - P(t, at('short') - 0.3, 0.4, linear)));
      // header: glucose + minerals
      const hA = 1 - P(t, at('nitrate') - 0.4, 0.4, linear);
      op(hdr, hA);
      if (hA > 0) {
        popAt(hdrHex, 560, 172, t, mid('alone', 0.06));
        op(hdrGlu, P(t, mid('alone', 0.1), 0.4, linear));
        op(hdrPlus, P(t, mid('alone', 0.5), 0.3, linear));
        op(hdrMin, P(t, mid('alone', 0.55), 0.4, linear));
        op(hdrSub, P(t, mid('alone', 0.7), 0.4, linear));
      }
      // nitrate -> nitrogen -> proteins, for growth
      const fA = P(t, at('nitrate') - 0.1, 0.4, linear) * (1 - P(t, at('magnesium') - 0.4, 0.4, linear));
      op(flow, fA);
      if (fA > 0) {
        popAt(fN, fXs[0], FY, t, mid('nitrate', 0.04));
        fA1.set(P(t, mid('nitrate', 0.22), 0.4)); op(fA1, t > mid('nitrate', 0.22) ? 1 : 0);
        popAt(fNg, fXs[1], FY, t, mid('nitrate', 0.3));
        fA2.set(P(t, mid('nitrate', 0.5), 0.4)); op(fA2, t > mid('nitrate', 0.5) ? 1 : 0);
        popAt(fP, fXs[2], FY, t, mid('nitrate', 0.58));
        op(forGrowth, P(t, mid('nitrate', 0.82), 0.4, linear));
      }
      // nitrate ions climb the stem and become protein at the tip
      const topY = plantA.topY();
      climbers.forEach((c, k) => {
        const t0 = mid('nitrate', 0.06 + k * 0.12), u = P(t, t0, 1.6, ease);
        const y = lerp(40, topY + 26, u), x = Math.sin(u * 7) * 3;
        attr(c, 'cx', x); attr(c, 'cy', y);
        op(c, P(t, t0, 0.2, linear) * (1 - P(t, t0 + 1.5, 0.3, linear)) * (1 - P(t, at('short') - 0.3, 0.3, linear)));
      });
      const bp = P(t, mid('nitrate', 0.55), 0.5, pop);
      op(beadsA, clamp(bp * 2) * (1 - P(t, at('magnesium') - 0.3, 0.4, linear)));
      tr(beadsA, 52, topY + 22, Math.max(0.01, bp));
      beadEls.forEach((b, k) => op(b, P(t, mid('nitrate', 0.55) + k * 0.1, 0.25, linear)));
      // B: short of nitrate
      const bIn = P(t, at('short') - 0.1, 0.6, easeOut);
      op(plantB, bIn); tr(plantB, BX, GY + (1 - bIn) * 24);
      plantB.yellow(0, 1); plantB.yellow(1, 0.85);
      op(lblA, P(t, mid('short', 0.1), 0.4, linear));
      popAt(lblB, BX, 688, t, mid('short', 0.08));
      op(bNotes, P(t, mid('short', 0.3), 0.4, linear) * (1 - P(t, at('magnesium') - 0.4, 0.4, linear)));
      op(stArrow, P(t, mid('short', 0.3), 0.4, linear)); op(stLbl, P(t, mid('short', 0.36), 0.4, linear));
      op(yLbl, P(t, mid('short', 0.62), 0.4, linear));
      // magnesium: the chloroplast greens; then it waits in a corner and pales as plant C yellows
      const yel = P(t, mid('chlorosis', 0.14), 2.2, ease);
      const mA = P(t, at('magnesium') - 0.2, 0.4, linear);
      const toC = P(t, end('magnesium') + 0.05, 0.7, ease);
      op(MGG, mA);
      if (mA > 0) {
        const x = lerp(CHL[0], INS[0], toC), y = lerp(CHL[1], INS[1], toC), s = lerp(1, 0.4, toC);
        const cp = P(t, at('magnesium'), 0.5, pop);
        tr(chlPale, x, y, Math.max(0.01, s * (0.7 + 0.3 * cp))); tr(chlGreen, x, y, Math.max(0.01, s * (0.7 + 0.3 * cp)));
        const green = P(t, mid('magnesium', 0.5), 0.7, linear) * (1 - 0.9 * yel);
        op(insLbl, P(t, mid('chlorosis', 0.46), 0.4, linear));
        op(chlGreen, green); op(chlPale, clamp(cp * 2));
        op(mgGlow, green * (0.5 + 0.3 * wave(t, 1.3)) * (1 - toC)); tr(mgGlow, x, y, s);
        const mu = P(t, mid('magnesium', 0.12), 0.9, ease);
        tr(mgChip, lerp(CXp + 210, CHL[0] + 70, mu), lerp(GY + 30, CHL[1] + 10, mu), 1 - 0.55 * mu);
        op(mgChip, P(t, mid('magnesium', 0.1), 0.3, linear) * (1 - P(t, mid('magnesium', 0.5), 0.3, linear)));
        op(mgLbl, P(t, mid('magnesium', 0.55), 0.4, linear) * (1 - P(t, end('magnesium'), 0.25, linear)));
      }
      // C: short of magnesium -> chlorosis
      const cIn = P(t, at('chlorosis') + 0.2, 0.7, easeOut);
      op(plantC, cIn); tr(plantC, CXp, GY + (1 - cIn) * 24);
      [0, 1, 2, 3].forEach(i => plantC.yellow(i, clamp(yel * 1.25 - (3 - i) * 0.08)));
      popAt(lblC, CXp, 688, t, at('chlorosis') + 0.3);
      const cl = P(t, mid('chlorosis', 0.3), 0.5, pop);
      op(chlChip, clamp(cl * 2)); tr(chlChip, 790, 172, Math.max(0.01, 0.6 + 0.4 * cl));
      const lightOn = P(t, mid('chlorosis', 0.46), 0.5, linear);
      rays.forEach((r, k) => { r.set(P(t, mid('chlorosis', 0.46) + k * 0.12, 0.5)); op(r, lightOn * (1 - 0.45 * yel)); });
      caught.forEach((s, k) => { const v = P(t, mid('chlorosis', 0.5) + k * 0.12, 0.3, linear) * (1 - 0.8 * P(t, mid('chlorosis', 0.56), 1.2, linear)); op(s, v); s.upd(t); tr(s, LIGHT[k][2], LIGHT[k][3], 0.8 + 0.25 * wave(t, 0.8, k * 0.3)); });
      op(lessLbl, P(t, mid('chlorosis', 0.6), 0.4, linear)); op(lessLbl2, P(t, mid('chlorosis', 0.62), 0.4, linear));
      const rA = P(t, mid('chlorosis', 0.66), 0.4, linear);
      op(rateG, rA);
      rateM.set(lerp(0.9, 0.28, P(t, mid('chlorosis', 0.74), 1.4, ease)));
    }

    /* ---------- second half ---------- */
    const h2 = P(t, at('question') - 0.2, 0.4, linear);
    op(H2, h2);
    if (h2 <= 0) return;
    // the tree: a sapling until the time-lapse, then five years of growth
    const g0 = mid('willow', 0.3), g1 = mid('willow', 0.86), growU = P(t, g0, g1 - g0, linear);
    const growK = lerp(growU, ease(growU), 0.35);
    tree.grow(growK);
    const potIn = P(t, at('question') - 0.1, 0.6, easeOut);
    tr(bigPot, TX, TY + (1 - potIn) * 20); tr(tree, TX, TY + (1 - potIn) * 20);
    op(soilTag, P(t, at('question') + 0.4, 0.4, linear) * (1 - P(t, at('water') - 0.3, 0.4, linear)));
    // question
    const qA = beat(t, at('question'), at('willow'));
    op(QG, qA);
    if (qA > 0) {
      const qp = P(t, mid('question', 0.1), 0.6, pop);
      op(bigQ, clamp(qp * 2)); bigQ.setAttribute('transform', `translate(${TX} 290) scale(${Math.max(0.01, 0.6 + 0.4 * qp).toFixed(3)}) translate(${-TX} -290)`);
      SRC.forEach((s, k) => {
        const tk = mid('question', 0.28 + k * 0.12);
        popAt(s.g, s.x, s.y, t, tk);
        s.arr.set(P(t, tk + 0.15, 0.4)); op(s.arr, t > tk + 0.15 ? 1 : 0);
      });
    }
    // record card
    const rcA = P(t, at('willow') - 0.1, 0.4, linear) * (1 - P(t, at('water') - 0.45, 0.4, linear));
    op(RC, rcA);
    if (rcA > 0) {
      popAt(vhChip, 880, 146, t, mid('willow', 0.04));
      op(yrG, P(t, mid('willow', 0.28), 0.4, linear) * (1 - P(t, at('soillost') - 0.3, 0.4, linear)));
      const yr = Math.min(5, 1 + Math.floor(growU * 5));
      setText(yrTxt, 'Year ' + yr);
      pips.forEach((p, k) => op(p, t < g0 ? (k === 0 ? 1 : 0) : clamp(growU * 5 - k + 1)));
      op(treeHd, P(t, g0, 0.4, linear)); op(treeNum, P(t, g0, 0.4, linear));
      setText(treeNum, growU >= 1 ? '70+ kg' : Math.round(70 * growK) + ' kg');
      const fin = Math.sin(Math.PI * P(t, g1 + 0.3, 0.5, linear));
      treeNum.setAttribute('transform', `translate(${COLT} 370) scale(${(1 + 0.1 * fin).toFixed(3)}) translate(${-COLT} -370)`);
      op(soilHd, P(t, mid('soillost', 0.08), 0.4, linear)); op(soilNum, P(t, mid('soillost', 0.12), 0.4, linear));
      popAt(block, COLT, 520, t, mid('soillost', 0.3));
      popAt(crumbG, COLS, 568, t, mid('soillost', 0.4));
      popAt(notSoil, 890, 676, t, mid('soillost', 0.66));
    }
    // van Helmont waters the tree
    const vA = beat(t, at('water'), at('dry'));
    op(VG, vA);
    if (vA > 0) {
      const vin = P(t, at('water') - 0.1, 0.6, easeOut);
      vh.setAttribute('transform', `translate(${(VX + (1 - vin) * 40).toFixed(1)} ${VY}) scale(-1 1)`);
      const tilt = P(t, mid('water', 0.12), 0.5, ease), ang = -12 * tilt * Math.PI / 180;
      tr(can, canPos[0] + (1 - vin) * 40, canPos[1], 1, -12 * tilt);
      const tipX = canPos[0] + SPOUT[0] * Math.cos(ang) - SPOUT[1] * Math.sin(ang), tipY = canPos[1] + SPOUT[0] * Math.sin(ang) + SPOUT[1] * Math.cos(ang);
      const pour = P(t, mid('water', 0.2), 0.3, linear);
      drops.forEach((d, k) => {
        const u = ((t - mid('water', 0.2)) / 0.7 + k / 5) % 1, uu = u < 0 ? u + 1 : u;
        tr(d, tipX - 4 - 10 * uu + (k % 2) * 6, tipY + 10 + uu * (TY + 4 - tipY - 10));
        op(d, pour * Math.min(1, uu * 6, (1 - uu) * 4));
      });
      const bb = P(t, mid('water', 0.3), 0.5, pop);
      op(bub, clamp(bb * 2));
      bub.setAttribute('transform', `translate(${VX + 156} ${VY - 330}) scale(${Math.max(0.01, 0.6 + 0.4 * bb).toFixed(3)}) translate(${-(VX + 156)} ${-(VY - 330)})`);
      popAt(partly, 900, 470, t, mid('water', 0.7));
    }
    // dry mass and the pie
    const dA = beat(t, at('dry'), at('wood'));
    op(DG, dA);
    if (dA > 0) {
      const sOn = win(t, at('dry') + 0.1, mid('dry', 0.62), 0.4);
      steam.forEach(o => {
        const u = ((t - at('dry')) / 2.0 + o.ph) % 1, uu = u < 0 ? u + 1 : u;
        tr(o.el, o.x + Math.sin(uu * 6 + o.ph * 9) * 8, o.y - uu * 130, 1 - 0.25 * uu, Math.sin(uu * 5 + o.ph * 4) * 25);
        op(o.el, sOn * Math.min(1, uu * 6, (1 - uu) * 3));
      });
      op(steamLbl, sOn);
      const bm = P(t, mid('dry', 0.3), 0.8, ease);
      op(dryB, P(t, mid('dry', 0.3), 0.3, linear)); tr(dryB, lerp(TX + 40, 690, bm), lerp(420, 450, bm), lerp(0.4, 1, bm));
      op(dryLbl, P(t, mid('dry', 0.4), 0.4, linear));
      dryArrow.set(P(t, mid('dry', 0.52), 0.4)); op(dryArrow, t > mid('dry', 0.52) ? 1 : 0);
      const pieA = P(t, mid('dry', 0.55), 0.4, linear);
      op(pieBg, pieA);
      const sw = P(t, mid('dry', 0.6), 1.2, ease);
      sCO2.setAttribute('d', sliceD(PCX, PCY, PR, A_CO2[0], lerp(A_CO2[0] + 0.01, A_CO2[1], sw)));
      op(sCO2, pieA); op(pieCO2, P(t, mid('dry', 0.75), 0.4, linear));
      op(pieLbl, P(t, mid('dry', 0.68), 0.4, linear)); op(pieLbl2, P(t, mid('dry', 0.74), 0.4, linear));
      const thin = P(t, mid('dry', 0.86), 0.4, linear);
      op(sW, thin); op(sM, thin); op(wLbl, thin); op(mLbl, P(t, mid('dry', 0.9), 0.4, linear));
    }
    // wood from thin air
    const wA = P(t, at('wood') - 0.3, 0.4, linear);
    op(WG, wA);
    op(tree.atomsG, wA);
    if (wA > 0) {
      const tA = mid('wood', 0.05), dimF = P(t, at('wood'), 0.6, linear);
      op(tree.canopy, clamp((1 - 0.45 * dimF)));
      op(tree.strandG, 1 - 0.4 * dimF);
      inCO2.forEach(o => {
        const u = ((t - tA) / 2.6 + o.k / 6) % 1, uu = u < 0 ? u + 1 : u;
        const a = [1150, 110 + o.k * 14], c = [800, 90 + o.k * 10];
        const q = quadPt(a, c, o.to, ease(uu));
        tr(o.el, q[0], q[1], 1 - 0.5 * uu, uu * 160);
        op(o.el, P(t, tA, 0.3, linear) * Math.min(1, uu * 8, (1 - uu) * 5));
      });
      const T0 = mid('wood', 0.12), T1 = mid('wood', 0.82);
      atomEls.forEach(o => {
        const tj = T0 + (o.j / NAT) * (T1 - T0), ap = P(t, tj, 0.35, pop);
        op(o.el, clamp(ap * 2)); o.el.setAttribute('r', (7 * Math.max(0.01, ap)).toFixed(2));
      });
      cFly.forEach(o => {
        // each trip lands on the slot that fills as it arrives
        const cyc = (t - T0) / 1.4 + o.k / 4, n = Math.floor(cyc), uu = cyc - n;
        const arrive = T0 + (n + 1 - o.k / 4) * 1.4;
        const j = Math.min(NAT - 1, Math.max(0, Math.floor(clamp((arrive - T0) / (T1 - T0)) * NAT)));
        const sl = tree.slots[j], from = [TX + [100, -60, 40, -120][o.k], TY - 330];
        const to = [TX + sl[0], TY + sl[1]];
        const q = quadPt(from, [(from[0] + to[0]) / 2 + 40, Math.min(from[1], to[1]) - 30], to, ease(uu));
        attr(o.el, 'cx', q[0]); attr(o.el, 'cy', q[1]);
        op(o.el, (t > T0 && t < T1 + 0.4 ? 1 : 0) * Math.min(1, uu * 6, (1 - uu) * 6));
      });
      op(airLbl, P(t, mid('wood', 0.04), 0.4, linear));
      popAt(fC, 800, 240, t, mid('wood', 0.02));
      op(fCl, P(t, mid('wood', 0.06), 0.4, linear));
      chain.forEach((o, i) => {
        const tc = mid('wood', 0.16 + i * 0.13);
        o.a.set(P(t, tc - 0.2, 0.3)); op(o.a, t > tc - 0.2 ? 1 : 0);
        popAt(o.c, 880, o.y, t, tc);
      });
      const wc = P(t, mid('wood', 0.66), 0.6, pop);
      op(woodChip, clamp(wc * 2)); tr(woodChip, 880, 640, Math.max(0.01, (0.6 + 0.4 * wc) * (1 + 0.03 * Math.sin(t * 3) * AMP)));
    }
  };
});

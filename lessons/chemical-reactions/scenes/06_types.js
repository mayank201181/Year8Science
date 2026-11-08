/* Chapter 6, Families of reactions: a family album of six reactions, each with its pattern and a demo.
   Beats: six empty frames, "spot the family, predict the products" -> the frames drop into a strip
   along the bottom, and each family lights its frame in turn:
   1 combustion: a gas hob burns; methane + oxygen rearrange into carbon dioxide + water, with energy
   2 oxidation: two iron atoms gain oxygen -> a nail rusts with oxygen AND water as the word equation
     builds -> showpiece: the three-tube experiment -> paint, oil and zinc keep oxygen and water away
   3 reduction: hot iron oxide with carbon: the oxygen hops to the carbon and iron is left behind
     -> carbon gains oxygen (oxidised), iron oxide loses it (reduced)
   4 thermal decomposition: copper carbonate breaks up; green powder in a heated tube turns black
   5 neutralisation: acid + base -> salt + water; hydrochloric acid into sodium hydroxide; A B S W
   6 displacement: iron pushes copper out of copper sulfate; a nail gets coated in copper.
   Each finished demo shrinks into its frame in the strip. */
scene('types', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hexRgb(a), B = hexRgb(b); p = clamp(p); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',') + ')'; };
  /* point on a curve from a to b that bows up by lift px */
  const arcPt = (a, b, u, lift) => { const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - (lift || 0), v = 1 - u; return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]]; };
  /* an atom that flies from a to b: fly(m, t, t0, dur) places it and returns the progress */
  function mover(parent, sym, r, a, b, o) { o = o || {}; return { g: rxAtom(parent, sym, r, { letter: o.letter }), a, b, s1: o.s1 || 1, lift: o.lift === undefined ? 50 : o.lift }; }
  function fly(m, t, t0, dur, dx, dy) {
    const u = P(t, t0, dur || 1);
    const p = u <= 0 ? m.a : u >= 1 ? m.b : arcPt(m.a, m.b, u, m.lift);
    tr(m.g, p[0] + (dx || 0), p[1] + (dy || 0), lerp(1, m.s1, u));
    return u;
  }
  const flameD = (h, w) => `M0,0 C${-w},${-h * 0.3} ${-w * 0.7},${-h * 0.7} 0,${-h} C${w * 0.7},${-h * 0.7} ${w},${-h * 0.3} 0,0 Z`;
  const DROP = 'M0,-13 C6,-5 9,1 9,5 A9,9 0 0 1 -9,5 C-9,1 -6,-5 0,-13 Z';
  const drop = parent => E('path', { d: DROP, fill: ball('#8FE0F7', C.waterDk), stroke: '#CFF1FC', 'stroke-width': 1.5 }, parent);
  /* a row of equation chips centred on cx: items {text, fill, color} or {op: '+' | '→'} */
  function eqRow(parent, items, cx, y, o) {
    o = o || {};
    const size = o.size || 30, gap = o.gap || 12;
    const parts = items.map(it => {
      const p = Object.assign({}, it);
      if (it.op === '+') { p.g = T(parent, 0, size * 0.42, '+', { size: size * 1.3, weight: 600, anchor: 'middle', fill: C.muted }); p.w = size; }
      else if (it.op) { p.g = arrow(parent, -size * 0.75, 0, size * 0.75, 0, { color: C.ink, width: 5 }); p.w = size * 1.7; }
      else { p.g = chip(parent, it.text, { size, fill: it.fill, color: it.color || '#FFFFFF', weight: 700 }); p.w = p.g.w; }
      return p;
    });
    let total = 0; parts.forEach((p, i) => { total += p.w + (i ? gap : 0); });
    let x = cx - total / 2;
    parts.forEach((p, i) => { if (i) x += gap; p.x = x + p.w / 2; p.y = y; x += p.w; tr(p.g, p.x, y); op(p.g, 0); });
    return parts;
  }
  function showParts(parts, t, times) { parts.forEach((p, i) => { const a = P(t, times[i], 0.45, pop); op(p.g, clamp(a * 2)); tr(p.g, p.x, p.y, Math.max(0.01, 0.7 + 0.3 * a)); }); }
  /* a plain, shiny iron nail (rxNail is the one that rusts or gets copper-plated) */
  function plainNail(parent, len) {
    const g = G(parent), w = Math.max(9, len * 0.085), top = -len / 2, bot = len / 2, tip = len * 0.13;
    E('path', { d: `M${-w / 2},${top + w * 0.3} L${w / 2},${top + w * 0.3} L${w / 2},${bot - tip} L0,${bot} L${-w / 2},${bot - tip} Z`, fill: linGrad(RX.iron, RX.ironDk), stroke: '#47525C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -w * 0.22, y: top + w * 0.7, width: w * 0.18, height: len * 0.6, rx: w * 0.09, fill: '#FFFFFF', opacity: 0.5 }, g);
    E('rect', { x: -w * 1.35, y: top - w * 0.25, width: w * 2.7, height: w * 0.55, rx: w * 0.2, fill: linGrad('#C7D0D8', RX.ironDk, true), stroke: '#47525C', 'stroke-width': 2 }, g);
    return g;
  }
  /* an O2 molecule in three elements (lib molO2 uses five) */
  function o2(parent, r) { const g = G(parent); [-1, 1].forEach(s => E('circle', { cx: s * r * 0.72, r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g)); return g; }
  /* many circles as one path: [[x, y, r], ...] */
  const dots = list => list.map(([x, y, r]) => `M${(x - r).toFixed(1)},${(+y).toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0`).join(' ');
  /* the outline of a nail's shaft below y0 (for rust or copper drawn over a plainNail) */
  function shaftBelow(len, y0) { const w = Math.max(9, len * 0.085), bot = len / 2, tip = len * 0.13; return `M${-w / 2},${y0} L${w / 2},${y0} L${w / 2},${bot - tip} L0,${bot} L${-w / 2},${bot - tip} Z`; }
  /* a four-point twinkle, for "still shiny" */
  const twinkle = (parent, s) => E('path', { d: `M0,${-s} L${s * 0.25},${-s * 0.25} L${s},0 L${s * 0.25},${s * 0.25} L0,${s} L${-s * 0.25},${s * 0.25} L${-s},0 L${-s * 0.25},${-s * 0.25} Z`, fill: '#FFFFFF' }, parent);
  /* family title with its number badge (y 150) and a tag line (y 196) */
  function header(parent, i, title, segs) {
    const g = G(parent), tw = textWidth(title, 50, FD, 700), x0 = 600 - (tw + 58) / 2;
    E('circle', { cx: x0 + 22, cy: 133, r: 22, fill: C.energy }, g);
    T(g, x0 + 22, 142, String(i + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    T(g, x0 + 58, 150, title, { size: 50, weight: 700 });
    g.tag = segs ? rich(g, 600, 196, segs, { size: 28, anchor: 'middle', fill: C.muted }) : null;
    return g;
  }

  /* ================= the album and the strip ================= */
  const FAM = [
    { key: 'combust', name: 'combustion' },
    { key: 'oxid', name: 'oxidation' },
    { key: 'reduce', name: 'reduction' },
    { key: 'decomp', name: 'thermal\ndecomposition' },
    { key: 'neutral', name: 'neutralisation' },
    { key: 'displace', name: 'displacement' },
  ];
  FAM.forEach(f => { f.t0 = at(f.key); });
  FAM.forEach((f, i) => { f.t1 = i < 5 ? FAM[i + 1].t0 : 1e6; });
  const SW = 172, SH = 70, SY = 618, sx = i => 135 + 186 * i;
  const AW = 226, AH = 138, AX = [356, 600, 844], AY = [276, 438];

  const album = G(root);
  card(album, 196, 178, 808, 356, { fill: C.card, stroke: C.line, rx: 24 });
  E('path', { d: [0, 1, 2, 3].map(k => `M187,${229 + k * 80} L205,${229 + k * 80}`).join(' '), stroke: '#8FA6B5', 'stroke-width': 14, 'stroke-linecap': 'round' }, album);
  const hint = rich(root, 600, 610, [['spot the family', C.energy, 700], ['   →   ', C.muted], ['predict the products', C.ink, 700]], { size: 34, anchor: 'middle' });

  const ICONS = [
    g => { // combustion: a hob burner with blue flames
      E('ellipse', { cx: 0, cy: -4, rx: 52, ry: 30, fill: glow('#5AA8FF'), opacity: 0.7 }, g);
      E('ellipse', { cx: 0, cy: 18, rx: 40, ry: 8, fill: '#56636E', stroke: '#9DB0BF', 'stroke-width': 2 }, g);
      [-24, -8, 8, 24].forEach((x, k) => { const f = E('path', { d: flameD(k === 1 || k === 2 ? 34 : 26, 8), fill: '#5AA8FF', stroke: '#CFEAFF', 'stroke-width': 1.5 }, g); tr(f, x, 14); });
    },
    g => { // oxidation: a rusty nail
      E('rect', { x: -44, y: -6, width: 82, height: 12, rx: 3, fill: RX.rust }, g);
      E('path', { d: 'M38,-6 L56,0 L38,6 Z', fill: RX.rust }, g);
      E('rect', { x: -54, y: -16, width: 11, height: 32, rx: 3, fill: '#8C4A2A' }, g);
      [[-22, 0], [8, -1], [28, 1]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 8, ry: 5, fill: RX.rustLt }, g));
    },
    g => { // reduction: rusty lump -> shiny iron
      E('ellipse', { cx: -42, cy: 2, rx: 26, ry: 17, fill: ball(RX.rustLt, RX.rust) }, g);
      arrow(g, -10, 2, 18, 2, { color: C.muted, width: 4, head: 11 });
      E('rect', { x: 26, y: -12, width: 46, height: 28, rx: 6, fill: linGrad('#EEF2F5', '#7D8C99', true), stroke: '#D5DEE6', 'stroke-width': 2 }, g);
    },
    g => { // thermal decomposition: a heated tube of black powder
      const f = E('path', { d: flameD(26, 9), fill: '#5AA8FF', stroke: '#CFEAFF', 'stroke-width': 1.5 }, g); tr(f, 24, 30);
      const tt = G(g); tr(tt, 0, -4, 1, -55);
      E('path', { d: 'M-7,8 L-7,18 A7,7 0 0 0 7,18 L7,8 Z', fill: RX.cuOxide, stroke: '#7D8C99', 'stroke-width': 1 }, tt);
      E('path', { d: 'M-9,-30 L-9,18 A9,9 0 0 0 9,18 L9,-30', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linecap': 'round' }, tt);
    },
    g => { // neutralisation: a beaker of neutral (green) solution
      E('path', { d: 'M-22,0 L22,0 L22,20 Q22,24 18,24 L-18,24 Q-22,24 -22,20 Z', fill: C.plant, opacity: 0.85 }, g);
      E('path', { d: 'M-27,-24 L-24,-20 L-24,20 Q-24,27 -17,27 L17,27 Q24,27 24,20 L24,-20 L27,-24', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      E('path', { d: DROP, fill: '#E8424F', transform: 'translate(-38 -14) scale(0.8)' }, g);
      E('path', { d: DROP, fill: '#7B8CFF', transform: 'translate(38 -14) scale(0.8)' }, g);
    },
    g => { // displacement: a copper-coated nail in pale green solution
      E('path', { d: 'M-22,-6 L22,-6 L22,20 Q22,24 18,24 L-18,24 Q-22,24 -22,20 Z', fill: RX.feSulfate, opacity: 0.8 }, g);
      E('rect', { x: -4, y: -32, width: 8, height: 44, fill: RX.iron }, g);
      E('path', { d: 'M-4,-4 L4,-4 L4,14 L0,22 L-4,14 Z', fill: RX.copper }, g);
      E('rect', { x: -11, y: -36, width: 22, height: 6, rx: 2, fill: '#C7D0D8' }, g);
      E('path', { d: 'M-27,-24 L-24,-20 L-24,20 Q-24,27 -17,27 L17,27 Q24,27 24,20 L24,-20 L27,-24', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    },
  ];
  const stripG = G(root);
  const slots = FAM.map((f, i) => {
    const s = { f, i, g: G(stripG), k: -1 };
    s.box = E('rect', { rx: 14, fill: '#0E2836', stroke: C.line, 'stroke-width': 3 }, s.g);
    s.q = T(s.g, 0, 18, '?', { size: 50, weight: 700, anchor: 'middle', fill: C.faint });
    s.icon = G(s.g); ICONS[i](s.icon);
    s.badge = G(s.g);
    E('circle', { r: 15, fill: C.energy, stroke: C.bg0, 'stroke-width': 3 }, s.badge);
    T(s.badge, 0, 7, String(i + 1), { size: 20, weight: 700, anchor: 'middle', fill: C.bg0 });
    s.label = T(s.g, 0, SH / 2 + 32, f.name, { size: 26, weight: 600, anchor: 'middle', lh: 28 });
    return s;
  });

  /* each family's demo lives in its own group; when finished it shrinks into its frame */
  const demos = FAM.map(() => G(root));
  const dState = demos.map(() => ({ k: -1 }));
  function demoVis(i, t) {
    const f = FAM[i], g = demos[i];
    const a = P(t, f.t0 + (i ? 0.12 : 0.6), 0.45, linear);
    const k = i < 5 ? P(t, f.t1 - 0.45, 0.6, easeIn) : 0;
    op(g, a * (1 - P(k, 0.3, 0.6, linear)));
    if (dState[i].k !== k) {
      dState[i].k = k;
      if (k <= 0) g.removeAttribute('transform');
      else { const s = lerp(1, 0.16, k), x = lerp(600, sx(i), k), y = lerp(390, SY, k); g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)}) translate(-600 -390)`); }
    }
    return a > 0 && k < 1;
  }

  /* ================= 1. combustion ================= */
  const D1 = demos[0];
  header(D1, 0, 'Combustion', [['burning', C.heat, 700], [': a fuel reacts with '], ['oxygen', '#FF9A8F', 700], [', releasing '], ['energy', C.energy, 700]]);
  const hob = G(D1); tr(hob, 250, 470);
  E('rect', { x: -150, y: 24, width: 300, height: 26, rx: 9, fill: '#33414C', stroke: '#5E6E7B', 'stroke-width': 3 }, hob);
  E('ellipse', { cx: 0, cy: 24, rx: 84, ry: 15, fill: '#1B242B', stroke: '#6B7A88', 'stroke-width': 3 }, hob);
  E('ellipse', { cx: 0, cy: 15, rx: 56, ry: 11, fill: linGrad('#A9B6C2', '#5B6873', true), stroke: '#C5D0D9', 'stroke-width': 2 }, hob);
  const hobHalo = E('ellipse', { cx: 0, cy: -10, rx: 120, ry: 60, fill: glow('#5AA8FF') }, hob);
  const hobFl = [];
  for (let k = 0; k < 5; k++) {
    const h = 36 + 16 * Math.sin(Math.PI * k / 4), f = G(hob);
    E('path', { d: flameD(h, 9), fill: '#4D9BFF', opacity: 0.92 }, f);
    E('path', { d: flameD(h * 0.55, 4.5), fill: '#CFEAFF' }, f);
    hobFl.push({ f, x: -44 + k * 22, k });
  }
  T(D1, 250, 552, 'gas cooker', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const hobWaves = heatWaves(D1, { n: 3, h: 70, spacing: 30 }); tr(hobWaves, 250, 410);
  const hobSpark = spark(D1, 22, { seed: 2 }); tr(hobSpark, 250, 300);
  const hobEn = T(D1, 250, 262, 'energy', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  // methane + oxygen -> carbon dioxide + water, atom by atom
  const cmb = G(D1);
  const CH4 = [490, 390], R1 = 20;
  const cmO = [
    mover(cmb, 'O', R1, [610.6, 345], [818, 390], { s1: 0.9, lift: 40 }), mover(cmb, 'O', R1, [639.4, 345], [882, 390], { s1: 0.9, lift: 40 }),
    mover(cmb, 'O', R1, [610.6, 435], [985, 345], { lift: 70 }), mover(cmb, 'O', R1, [639.4, 435], [985, 435], { lift: 50 }),
  ];
  const cmH = [[-1, -1, 965.4, 359.4], [1, -1, 1004.6, 359.4], [-1, 1, 965.4, 449.4], [1, 1, 1004.6, 449.4]].map(([dx, dy, x1, y1]) =>
    mover(cmb, 'H', R1 * 0.62, [CH4[0] + dx * R1, CH4[1] + dy * R1], [x1, y1], { letter: false, lift: 80 }));
  const cmC = mover(cmb, 'C', R1, CH4, [850, 390], { lift: 30 });
  // dashed outlines where the reactant atoms were, so the finished frame still reads as an equation
  const cmGh = G(cmb); cmb.insertBefore(cmGh, cmb.firstChild);
  const cmGhost = [[[cmC], 'C', R1, 1], [cmO.slice(0, 2), 'O', R1, 1], [cmH, 'H', R1 * 0.62, 2], [cmO.slice(2), 'O', R1, 2]].map(([ms, sym, r, k]) =>
    ({ el: E('path', { d: dots(ms.map(m => [m.a[0], m.a[1], r - 1])), fill: 'none', stroke: ATOM[sym][0], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, cmGh), k }));
  const cmPlus1 = T(cmb, 557, 402, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
  const cmPlus2 = T(cmb, 920, 402, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
  const cmArrow = arrow(cmb, 692, 390, 770, 390, { color: C.ink, width: 6 });
  const cmSpark = spark(cmb, 20, { seed: 5 }); tr(cmSpark, 731, 336);
  const cmLab = [['methane', 490, C.ink], ['oxygen', 625, '#FF9A8F'], ['carbon dioxide', 850, C.co2], ['water', 985, C.water]].map(([s, x, c]) => T(cmb, x, 506, s, { size: 26, weight: 600, anchor: 'middle', fill: c }));

  /* ================= 2. oxidation ================= */
  const D2 = demos[1];
  const H2 = header(D2, 1, 'Oxidation', [['a substance '], ['gains oxygen', '#FF9A8F', 700]]);
  const tagNails = rich(D2, 600, 196, [['Does the nail rust?', C.energy, 700]], { size: 30, anchor: 'middle' });
  const tagKeep = rich(D2, 600, 196, [['a coating keeps '], ['oxygen', '#FF9A8F', 700], [' and '], ['water', C.water, 700], [' away']], { size: 28, anchor: 'middle', fill: C.muted });
  // 2a: two iron atoms gain three oxygen atoms -> iron oxide
  const oxA = G(D2);
  const FEC = [420, 380];
  const oxO = [[-70, 16.4, 190, 262], [0, 16.4, 330, 236], [70, 16.4, 560, 250]].map(([x, y, x0, y0]) => mover(oxA, 'O', 26.6, [x0, y0], [FEC[0] + x, FEC[1] + y], { lift: 40 }));
  [[-35, -11.6], [35, -11.6]].forEach(([x, y]) => tr(rxAtom(oxA, 'Fe', 31.4), FEC[0] + x, FEC[1] + y));
  const oxLabIron = T(oxA, 420, 462, 'iron', { size: 28, weight: 700, anchor: 'middle', fill: '#E3B08F' });
  const oxLabOx = T(oxA, 420, 462, 'iron oxide', { size: 28, weight: 700, anchor: 'middle', fill: '#E3B08F' });
  const oxLabO = T(oxA, 380, 238, 'oxygen', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const oxRustLab = G(D2);
  T(oxRustLab, 832, 350, 'rusting', { size: 36, weight: 700, fill: RX.rustLt });
  T(oxRustLab, 832, 392, 'the slow oxidation', { size: 26, weight: 600 });
  T(oxRustLab, 832, 424, 'of iron', { size: 26, weight: 600 });
  // the nail (shared by 2a and 2b)
  const nailG = G(D2);
  const nail = rxNail(nailG, 260, { seed: 31 });
  // 2b: oxygen and water both reach the nail; the word equation builds as rust spreads
  const rsB = G(D2);
  const rsO2 = [0, 1, 2].map(k => ({ g: o2(rsB, 14), y: 300 + k * 85, ph: k / 3 }));
  const rsDrops = [0, 1, 2].map(k => ({ g: drop(rsB), y: 318 + k * 80, ph: k / 3 + 0.15 }));
  const rsLabO = rich(rsB, 148, 252, [['oxygen', '#FF9A8F', 700]], { size: 28, anchor: 'middle' });
  const rsLabW = rich(rsB, 452, 252, [['water', C.water, 700]], { size: 28, anchor: 'middle' });
  const rsTickO = tick(rsB, 12); tr(rsTickO, 218, 243);
  const rsTickW = tick(rsB, 12); tr(rsTickW, 506, 243);
  const rsRow1 = eqRow(rsB, [{ text: 'iron', fill: '#6E7B87' }, { op: '+' }, { text: 'oxygen', fill: C.oxygen }, { op: '+' }, { text: 'water', fill: C.water, color: '#06283A' }], 860, 318);
  const rsRow2 = eqRow(rsB, [{ op: '→' }, { text: 'hydrated iron oxide', fill: RX.rust }], 860, 404);
  const rsRust = rich(rsB, 860, 482, [['= ', C.muted], ['rust', RX.rustLt, 700]], { size: 40, anchor: 'middle' });
  // 2c (showpiece): air + water / dry air / boiled water under oil
  const tbC = G(D2);
  const TX = [300, 600, 900], TY = 362, TW = 64, TH = 228;
  const tubes = TX.map((x, j) => {
    const g = G(tbC); tr(g, x, TY);
    const tube = testTube(g, TW, TH, { level: j === 0 ? 0.42 : j === 2 ? 0.8 : 0, liquid: C.water, opacity: 0.4 });
    return { g, tube, x };
  });
  // A: open, nail half in water, rusting
  const nA = plainNail(tubes[0].g, 150); tr(nA, 0, 20);
  E('path', { d: shaftBelow(150, -60), fill: RX.rust, opacity: 0.85 }, nA);
  E('path', { d: dots([[2, -38, 5], [-1, -12, 6], [3, 14, 5], [-2, 38, 6]]), fill: RX.rustLt }, nA);
  // B: sealed, drying agent under cotton wool, nail stays shiny
  const gB = G(tubes[1].g), gr = rng(8);
  const gran = []; for (let k = 0; k < 11; k++) { const a = gr() * Math.PI, rr = 6 + gr() * 18; gran.push([Math.cos(a) * rr * 0.9, TH / 2 - TW / 2 + Math.sin(a) * rr * 0.75 - 2, 5 + gr() * 3]); }
  E('path', { d: dots(gran), fill: '#E9EEF2', stroke: '#9DB0BF', 'stroke-width': 1 }, gB);
  E('path', { d: closedPath(blobPts(26, 11, 10, 0, 0.18, 4)), fill: '#F4F7FA', opacity: 0.92, transform: `translate(0 ${TH / 2 - 56})` }, gB);
  const nB = plainNail(tubes[1].g, 128); tr(nB, 0, -10);
  rxBung(tubes[1].g, 1, { neck: TW - 6, y: -TH / 2 });
  // C: sealed, boiled water under a layer of oil, nail stays shiny
  const nC = plainNail(tubes[2].g, 128); tr(nC, 0, 34);
  const oilY = TH / 2 - (TH - 10) * 0.8;
  E('rect', { x: -TW / 2 + 3, y: oilY - 12, width: TW - 6, height: 14, fill: '#F3CF5E', opacity: 0.9 }, tubes[2].g);
  rxBung(tubes[2].g, 1, { neck: TW - 6, y: -TH / 2 });
  const shine = [twinkle(tubes[1].g, 9), twinkle(tubes[2].g, 9)];
  tr(shine[0], 9, -40); tr(shine[1], 9, 8);
  const tLab = [['air + water', 300], ['dry air', 600], ['boiled water, no air', 900]].map(([s, x]) => T(tbC, x, 518, s, { size: 26, weight: 600, anchor: 'middle' }));
  const dryLab = labelLine(tbC, 652, 452, 614, 444, 'drying agent', { size: 26, fill: C.muted });
  const oilLab = labelLine(tbC, 956, 300, 926, oilY + TY - 5, 'oil layer', { size: 26, fill: '#F3CF5E' });
  const results = [[true, 300], [false, 600], [false, 900]].map(([yes, x]) => {
    const g = G(tbC); tr(g, x, 556);
    const tw = textWidth(yes ? 'rusts' : 'no rust', 30, FD, 700), x0 = -(tw + 38) / 2;
    const mk = yes ? tick(g, 12) : cross(g, 11); tr(mk, x0 + 12, -10);
    T(g, x0 + 38, 0, yes ? 'rusts' : 'no rust', { size: 30, weight: 700, fill: yes ? RX.rustLt : C.ink });
    return g;
  });
  // 2d: paint, oil and zinc keep oxygen and water off the iron
  const pvD = G(D2);
  const PX = [300, 600, 900], PY = 372;
  const pvObj = PX.map(x => { const g = G(pvD); tr(g, x, PY); return g; });
  // paint: a steel girder getting a coat of paint
  const gd = pvObj[0];
  E('rect', { x: -110, y: -40, width: 220, height: 80, rx: 4, fill: '#7D8995', stroke: '#A9B5C0', 'stroke-width': 2 }, gd);
  E('rect', { x: -116, y: -48, width: 232, height: 14, rx: 3, fill: '#66727D', stroke: '#A9B5C0', 'stroke-width': 2 }, gd);
  E('rect', { x: -116, y: 34, width: 232, height: 14, rx: 3, fill: '#66727D', stroke: '#A9B5C0', 'stroke-width': 2 }, gd);
  const paint = E('rect', { x: -116, y: -48, width: 0, height: 96, rx: 3, fill: '#3FA98E' }, gd);
  E('path', { d: dots([0, 1, 2, 3, 4].flatMap(k => [[-88 + k * 44, -41, 3.5], [-88 + k * 44, 41, 3.5]])), fill: '#C9D3DB', opacity: 0.8 }, gd);
  const brush = G(gd);
  E('rect', { x: -6, y: -110, width: 12, height: 62, rx: 5, fill: '#B5763A', stroke: '#E0A86A', 'stroke-width': 2 }, brush);
  E('rect', { x: -14, y: -52, width: 28, height: 14, rx: 3, fill: '#C9D3DB' }, brush);
  E('path', { d: 'M-14,-38 L14,-38 L12,-14 L-12,-14 Z', fill: '#3FA98E' }, brush);
  // oil: an oil can dripping onto a chain
  const oc = pvObj[1];
  const can = G(oc); tr(can, -80, -80, 1, 45);
  E('path', { d: 'M-34,0 Q-64,12 -38,28', fill: 'none', stroke: '#C9D3DB', 'stroke-width': 6, 'stroke-linecap': 'round' }, can);
  E('path', { d: 'M-40,30 L40,30 L32,-4 Q0,-36 -32,-4 Z', fill: ball('#E8424F', '#9C2230'), stroke: '#FF9AA5', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M4,-26 L98,-72', stroke: '#C9D3DB', 'stroke-width': 6, 'stroke-linecap': 'round' }, can);
  const oilDrops = [0, 1].map(() => E('path', { d: DROP, fill: '#F3CF5E', transform: 'scale(0.7)' }, oc));
  const chainG = G(oc);
  for (let k = 0; k < 4; k++) E('rect', { x: -96 + k * 48, y: 22, width: 60, height: 30, rx: 15, fill: 'none', stroke: k % 2 ? '#8E9CA9' : '#AEB9C4', 'stroke-width': 9 }, chainG);
  const sheen = E('rect', { x: -102, y: 16, width: 204, height: 42, rx: 21, fill: 'rgba(243,207,94,0.28)', stroke: '#F3CF5E', 'stroke-width': 2 }, oc);
  // galvanise: a zinc-coated bucket
  const bk = pvObj[2];
  E('path', { d: 'M-66,-40 Q0,-110 66,-40', fill: 'none', stroke: '#C9D3DB', 'stroke-width': 5 }, bk);
  E('path', { d: 'M-70,-40 L70,-40 L54,56 L-54,56 Z', fill: linGrad('#C7D0D8', '#7F8C98'), stroke: '#E3E9EE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bk);
  const sp = rng(19);
  let spd = ''; for (let k = 0; k < 7; k++) { const x = -44 + sp() * 88, y = -22 + sp() * 62, s = 9 + sp() * 8; spd += `M${x.toFixed(1)},${(y - s).toFixed(1)} L${(x + s * 0.9).toFixed(1)},${y.toFixed(1)} L${x.toFixed(1)},${(y + s * 0.8).toFixed(1)} L${(x - s).toFixed(1)},${(y + 2).toFixed(1)} Z `; }
  E('path', { d: spd, fill: '#E3E9EE', opacity: 0.45 }, bk);
  E('ellipse', { cx: 0, cy: -40, rx: 70, ry: 10, fill: '#5E6A75', stroke: '#E3E9EE', 'stroke-width': 3 }, bk);
  const pvLab = [['paint', 300], ['oil', 600], ['galvanise', 900]].map(([s, x]) => T(pvD, x, 506, s, { size: 30, weight: 700, anchor: 'middle' }));
  const zincLab = T(pvD, 900, 540, '(a coat of zinc)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // shields and bouncing oxygen and water
  const shields = PX.map(x => E('ellipse', { cx: x, cy: PY - 8, rx: 136, ry: 100, fill: 'none', stroke: C.good, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, pvD));
  const bouncers = [];
  PX.forEach((x, j) => [[-2.4, -2.9, 1], [-0.6, -0.1, 0]].forEach(([ang, out, kind], k) => {
    bouncers.push({ j, ang, out, g: kind ? o2(pvD, 11) : drop(pvD), ph: (k * 0.5 + j * 0.17) % 1 });
  }));

  /* ================= 3. reduction ================= */
  const D3 = demos[2];
  const H3 = header(D3, 2, 'Reduction', [['the opposite: a substance '], ['loses oxygen', C.water, 700]]);
  const rdA = G(D3);
  const rdGlow = E('ellipse', { cx: 460, cy: 365, rx: 320, ry: 170, fill: glow(C.heat) }, rdA);
  const UNIT = [[330, 300], [330, 410]], CS = [[600, 285], [600, 360], [600, 435]], RR = 22;
  const rdO = [], rdFe = [];
  // O atoms: [unit, slot] -> [carbon, side]
  const HOP = [[0, 0, 0, -1], [0, 1, 0, 1], [0, 2, 1, 1], [1, 0, 1, -1], [1, 1, 2, -1], [1, 2, 2, 1]];
  HOP.forEach(([u, s, c, side], k) => {
    const a = [UNIT[u][0] + (s - 1) * 55, UNIT[u][1] + 12.9], b = [CS[c][0] + side * 34, CS[c][1]];
    rdO.push(Object.assign(mover(rdA, 'O', RR * 0.95, a, b, { s1: 0.9, lift: 70 }), { c, k }));
  });
  const FEEND = [[305, 330], [355, 330], [305, 380], [355, 380]];
  UNIT.forEach(([x, y], u) => [-1, 1].forEach((sd, j) => rdFe.push(mover(rdA, 'Fe', RR * 1.12, [x + sd * 27.5, y - 9.1], FEEND[u * 2 + j], { lift: 10 }))));
  const rdC = CS.map(p => rxAtom(rdA, 'C', RR));
  const CDRIFT = [[280, 0], [350, 5], [280, 10]];
  const ironShine = E('ellipse', { cx: 330, cy: 352, rx: 92, ry: 74, fill: glow('#FFFFFF') }, rdA);
  rdA.insertBefore(ironShine, rdFe[0].g);
  const rdLab = [['iron oxide', 330, '#E3B08F'], ['carbon', 600, '#C9D1D8'], ['iron', 330, '#E9EEF2'], ['carbon dioxide', 905, C.co2]].map(([s, x, c]) => T(rdA, x, 520, s, { size: 28, weight: 700, anchor: 'middle', fill: c }));
  const heatChip = chip(rdA, 'heat', { size: 26, fill: '#4A2A1E', stroke: C.heat, color: C.heat }); tr(heatChip, 160, 365);
  // 3b: who gains, who loses
  const rdB = G(D3);
  const pairChips = [chip(rdB, 'oxidation', { size: 30, fill: '#4A2A1E', stroke: C.heat, color: '#FFC9A3' }), chip(rdB, 'reduction', { size: 30, fill: '#123A52', stroke: C.water, color: '#BFEFFF' })];
  const pairAmp = T(rdB, 600, 262, '+', { size: 44, weight: 700, anchor: 'middle', fill: C.muted });
  const EQ = [['iron oxide', '#E3B08F'], ['+', C.muted], ['carbon', '#C9D1D8'], ['→', C.ink], ['iron', '#E9EEF2'], ['+', C.muted], ['carbon dioxide', C.co2]];
  const EQS = 36, EQY = 432;
  const eqW = EQ.map(([s]) => textWidth(s, EQS, FD, 700));
  const eqTot = eqW.reduce((a, b) => a + b, 0) + 22 * (EQ.length - 1);
  let ex = 600 - eqTot / 2;
  const eqX = eqW.map(w => { const c = ex + w / 2; ex += w + 22; return c; });
  EQ.forEach(([s, c], i) => T(rdB, eqX[i], EQY, s, { size: EQS, weight: 700, anchor: 'middle', fill: c }));
  const arcTop = arrow(rdB, eqX[2], EQY - 42, eqX[6], EQY - 42, { color: C.heat, width: 5, bend: -100 });
  const arcBot = arrow(rdB, eqX[0], EQY + 18, eqX[4], EQY + 18, { color: C.water, width: 5, bend: 100 });
  const labTop = rich(rdB, (eqX[2] + eqX[6]) / 2, EQY - 110, [['gains oxygen: ', '#FFC9A3'], ['oxidised', C.heat, 800]], { size: 30, anchor: 'middle' });
  const labBot = rich(rdB, (eqX[0] + eqX[4]) / 2, EQY + 102, [['loses oxygen: ', '#BFEFFF'], ['reduced', C.water, 800]], { size: 30, anchor: 'middle' });
  const hopO = rxAtom(rdB, 'O', 17);

  /* ================= 4. thermal decomposition ================= */
  const D4 = demos[3];
  header(D4, 3, 'Thermal decomposition', [['heat', C.heat, 700], [' breaks one compound into '], ['simpler', C.energy, 700], [' ones']]);
  const bun = bunsen(D4, 1); tr(bun, 330, 548);
  // clamp stand holding the tube at an angle
  E('rect', { x: 420, y: 552, width: 110, height: 14, rx: 4, fill: '#5E6E7B' }, D4);
  E('rect', { x: 464, y: 236, width: 12, height: 318, rx: 4, fill: '#8E9CA9' }, D4);
  E('path', { d: 'M470,262 L238,268', stroke: '#8E9CA9', 'stroke-width': 9, 'stroke-linecap': 'round' }, D4);
  const tubeG = G(D4); tr(tubeG, 257.6, 288.4, 1, -50);
  const dTube = testTube(tubeG, 44, 176, { level: 0.3, liquid: RX.cuCarbonate, opacity: 0.95 });
  E('rect', { x: -30, y: -40, width: 60, height: 14, rx: 4, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, tubeG);
  const escCO2 = [0, 1].map(() => molCO2(D4, 9));
  const colChips = [chip(D4, 'green', { size: 28, fill: RX.cuCarbonate, color: '#06281A' }), chip(D4, 'black', { size: 28, fill: RX.cuOxide, color: '#FFFFFF', stroke: '#8E9CA9', sw: 2 })];
  colChips.forEach(c => tr(c, 112, 318));
  const colLead = E('path', { d: 'M158,322 L296,336', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, D4);
  // the molecule: copper carbonate -> copper oxide + carbon dioxide, written out as an equation
  const mol = G(D4), MC = [690, 340], MR = 26;
  const molGlow = E('circle', { cx: MC[0], cy: MC[1], r: 140, fill: glow(C.heat) }, mol);
  const molGh = G(mol);
  const dc = [
    ['Cu', -1.865, 0, 1.12, [862, 340]], ['O', -0.215, 0, 0.95, [908, 340]],
    ['O', 2.035, -1.3, 0.95, [1025, 340]], ['O', 2.035, 1.3, 0.95, [1105, 340]], ['C', 1.285, 0, 1, [1065, 340]],
  ].map(([sym, x, y, k, b]) => {
    const a = [MC[0] + x * MR, MC[1] + y * MR];
    E('circle', { cx: a[0], cy: a[1], r: MR * k - 1, fill: 'none', stroke: ATOM[sym] ? ATOM[sym][0] : RX.atom[sym], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, molGh);
    return mover(mol, sym, MR * k, a, b, { s1: 0.92, lift: 60 });
  });
  const molArrow = arrow(mol, 782, 340, 834, 340, { color: C.ink, width: 5 });
  const molPlus = T(mol, 968, 354, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
  const molLab = [['copper carbonate', 690, '#7FD9B0'], ['copper oxide', 885, '#C9D1D8'], ['carbon dioxide', 1065, C.co2]].map(([s, x, c]) => T(mol, x, 418, s, { size: 26, weight: 700, anchor: 'middle', fill: c }));

  /* ================= 5. neutralisation ================= */
  const D5 = demos[4];
  header(D5, 4, 'Neutralisation');
  const nRow = eqRow(D5, [{ text: 'acid', fill: '#E8424F' }, { op: '+' }, { text: 'base', fill: '#5B6CFF' }, { op: '→' }, { text: 'salt', fill: '#E9EEF2', color: C.bg0 }, { op: '+' }, { text: 'water', fill: C.water, color: '#06283A' }], 0, 238, { size: 32 });
  // spread the four chips over their examples below
  [[0, 290], [1, 405], [2, 520], [3, 655], [4, 790], [5, 895], [6, 1000]].forEach(([i, x]) => { nRow[i].x = x; tr(nRow[i].g, x, 238); });
  const tiles = ['A', 'B', 'S', 'W'].map((L, i) => {
    const g = G(D5);
    E('rect', { x: -27, y: -27, width: 54, height: 54, rx: 11, fill: C.energy, stroke: '#FFF3B0', 'stroke-width': 3 }, g);
    T(g, 0, 13, L, { size: 38, weight: 700, anchor: 'middle', fill: C.bg0 });
    return { g, x: [290, 520, 790, 1000][i] };
  });
  const acidG = G(D5), acidB = beaker(acidG, 110, 120, { level: 0.6, liquid: '#FF7A70', opacity: 0.8 });
  const alkG = G(D5), alkB = beaker(alkG, 130, 140, { level: 0.5, liquid: '#7B8CFF', opacity: 0.8 }); tr(alkG, 520, 430);
  const stream = E('path', { fill: 'none', stroke: '#FF7A70', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.85 }, D5);
  D5.insertBefore(stream, alkG);
  const nLab = [['hydrochloric acid', 290], ['sodium hydroxide', 520], ['sodium chloride', 790], ['water', 1000]].map(([s, x]) => T(D5, x, 524, s, { size: 26, weight: 600, anchor: 'middle' }));
  const salt = G(D5); rxMol(salt, 'NaCl', { r: 24 });
  const wat = [G(D5), G(D5)]; wat.forEach(g => rxMol(g, 'H2O', { r: 20, letter: false }));
  const prod = [[salt, 790, 418], [wat[0], 962, 418], [wat[1], 1038, 418]];

  /* ================= 6. displacement ================= */
  const D6 = demos[5];
  header(D6, 5, 'Displacement', [['the '], ['more reactive', C.good, 700], [' metal wins']]);
  const swap = G(D6), SC = [430, 380];
  const sulf = G(swap);
  E('circle', { cx: SC[0], cy: SC[1], r: 52, fill: 'rgba(61,139,255,0.10)', stroke: '#6FA8FF', 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, sulf);
  [[-30, -30], [30, -30], [-30, 30], [30, 30]].forEach(([x, y]) => tr(rxAtom(sulf, 'O', 15), SC[0] + x, SC[1] + y));
  tr(rxAtom(sulf, 'S', 24), SC[0], SC[1]);
  const cu = rxAtom(swap, 'Cu', 30), fe = rxAtom(swap, 'Fe', 30);
  const CU0 = [352, 380], CU1 = [232, 492], FE0 = [170, 270], FE1 = [352, 380];
  const swLab = [['copper sulfate', 430, 476, '#7FB2FF'], ['iron sulfate', 430, 476, '#A9D9B2']].map(([s, x, y, c]) => T(swap, x, y, s, { size: 28, weight: 700, anchor: 'middle', fill: c }));
  const feTag = T(swap, 0, 0, 'more reactive', { size: 26, weight: 700, anchor: 'middle', fill: C.good });
  const cuTag = T(swap, 0, 0, 'less reactive', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const push = arrow(swap, 205, 300, 290, 352, { color: C.good, width: 5 });
  // the nail in copper sulfate
  const bkG = G(D6); tr(bkG, 920, 425);
  const dBk = beaker(bkG, 210, 200, { level: 0.7, liquid: RX.cuSulfate, opacity: 0.72 });
  const dNailG = G(bkG);
  plainNail(dNailG, 200);
  const dCopper = E('path', { d: shaftBelow(200, 100 - 200 * 0.62), fill: RX.copper }, dNailG);
  const surf = E('rect', { x: -18, y: -29.4, width: 36, height: 4, rx: 2, fill: '#FFFFFF', opacity: 0.5 }, bkG);
  const solLab = [['copper sulfate', '#7FB2FF'], ['iron sulfate', '#A9D9B2']].map(([s, c]) => T(D6, 920, 560, s, { size: 28, weight: 700, anchor: 'middle', fill: c }));
  const cuLab = labelLine(D6, 790, 300, 912, 420, 'copper coating', { size: 28, fill: RX.copper, weight: 700 });

  /* ================= update ================= */
  return t => {
    /* album -> strip */
    const k = P(t, at('combust') - 0.25, 1.0, ease);
    op(album, (1 - P(t, at('combust') - 0.3, 0.6, linear)) * P(t, S.first - 0.1, 0.4, linear));
    op(hint, win(t, mid('families', 0.55), at('combust') + 0.1, 0.4));
    tr(hint, 0, (1 - P(t, mid('families', 0.55), 0.5, easeOut)) * 14);
    slots.forEach(s => {
      const i = s.i, f = s.f;
      const pin = P(t, mid('families', 0.05 + i * 0.06), 0.45, pop);
      const x = lerp(AX[i % 3], sx(i), k), y = lerp(AY[Math.floor(i / 3)], SY, k);
      tr(s.g, x, y, Math.max(0.01, 0.6 + 0.4 * pin));
      op(s.g, clamp(pin * 2));
      if (s.k !== k) {
        s.k = k;
        const w = lerp(AW, SW, k), h = lerp(AH, SH, k);
        attr(s.box, 'x', -w / 2); attr(s.box, 'y', -h / 2); attr(s.box, 'width', w); attr(s.box, 'height', h);
        tr(s.badge, -w / 2 + 6, -h / 2 + 6);
        tr(s.q, 0, 0, lerp(1.2, 0.8, k));
      }
      const fill = P(t, f.t0 + 0.4, 0.5, linear);
      op(s.q, 1 - fill); op(s.icon, fill); op(s.label, fill);
      tr(s.icon, 0, 0, Math.max(0.01, 0.6 + 0.4 * P(t, f.t0 + 0.4, 0.5, pop)));
      const lv = Math.round(20 * (i < 5 ? win(t, f.t0 + 0.3, f.t1 + 0.2, 0.4) : P(t, f.t0 + 0.3, 0.4, linear))) / 20;
      if (s.lv !== lv) { s.lv = lv; s.box.setAttribute('stroke', mix(C.line, C.energy, lv)); attr(s.box, 'stroke-width', lerp(3, 4.5, lv)); s.box.setAttribute('fill', mix('#0E2836', '#213739', lv)); }
    });

    /* 1. combustion */
    if (demoVis(0, t)) {
      const lit = P(t, mid('combust', 0.1), 0.5, linear);
      hobFl.forEach(o => { const fl = 1 + 0.1 * AMP * Math.sin(t * 13 + o.k * 1.7); o.f.setAttribute('transform', `translate(${o.x} 8) scale(${(lit * (1 + 0.04 * Math.sin(t * 9 + o.k))).toFixed(3)} ${(lit * fl).toFixed(3)})`); });
      op(hobHalo, lit * 0.7);
      const en = P(t, mid('combust', 0.3), 0.5, linear);
      op(hobWaves, en * 0.9); hobWaves.upd(t);
      op(hobSpark, en); hobSpark.upd(t); tr(hobSpark, 250, 300, Math.max(0.01, P(t, mid('combust', 0.3), 0.5, pop)));
      op(hobEn, P(t, mid('combust', 0.34), 0.4, linear));
      // molecules: methane floats up from the burner, oxygen arrives, then they swap partners
      const mIn = P(t, mid('combust', 0.45), 0.9);
      op(cmb, P(t, mid('combust', 0.45), 0.3, linear));
      const dm = [lerp(250 - CH4[0], 0, mIn), lerp(470 - CH4[1], 0, mIn)], ms = lerp(0.4, 1, mIn);
      const oIn = P(t, mid('combust', 0.52), 0.8, easeOut);
      const T1 = mid('combust', 0.7), T2 = mid('combust', 0.8);
      const pc = fly(cmC, t, T1, 1.0);
      if (pc <= 0) tr(cmC.g, CH4[0] + dm[0], CH4[1] + dm[1], ms);
      cmH.forEach((m, j) => { const u = fly(m, t, T2 + j * 0.06, 1.0); if (u <= 0) tr(m.g, CH4[0] + (m.a[0] - CH4[0]) * ms + dm[0], CH4[1] + (m.a[1] - CH4[1]) * ms + dm[1]); });
      cmO.forEach((m, j) => { const u = fly(m, t, j < 2 ? T1 + j * 0.05 : T2 + (j - 2) * 0.08, 1.0, 0, -(1 - oIn) * 120); op(m.g, oIn); });
      op(cmPlus1, P(t, mid('combust', 0.56), 0.3, linear) * (1 - 0.4 * P(t, T1, 0.5, linear)));
      cmGhost.forEach(o => op(o.el, 0.5 * P(t, (o.k === 1 ? T1 : T2) + 0.4, 0.5, linear)));
      op(cmPlus2, P(t, T2 + 0.8, 0.4, linear));
      cmArrow.set(P(t, T1 - 0.4, 0.6));
      const sp = P(t, T1 + 0.6, 0.6, pop); op(cmSpark, clamp(sp * 2)); tr(cmSpark, 731, 336, Math.max(0.01, sp)); cmSpark.upd(t);
      op(cmLab[0], P(t, mid('combust', 0.5), 0.4, linear) * (1 - 0.35 * P(t, T1, 0.5, linear)));
      op(cmLab[1], P(t, mid('combust', 0.56), 0.4, linear) * (1 - 0.35 * P(t, T2, 0.5, linear)));
      op(cmLab[2], P(t, T1 + 0.8, 0.4, linear)); op(cmLab[3], P(t, T2 + 0.9, 0.4, linear));
    }

    /* 2. oxidation */
    if (demoVis(1, t)) {
      op(H2.tag, 1 - P(t, at('nails') - 0.2, 0.4, linear));
      op(tagNails, win(t, at('nails'), at('prevent') + 0.1, 0.4));
      op(tagKeep, P(t, at('prevent') + 0.1, 0.4, linear));
      // 2a
      const aA = 1 - P(t, at('rust') - 0.1, 0.5, linear);
      op(oxA, aA);
      if (aA > 0) {
        oxO.forEach((m, j) => { const u = fly(m, t, mid('oxid', 0.16 + j * 0.07), 0.9); op(m.g, P(t, mid('oxid', 0.08), 0.4, linear)); });
        op(oxLabO, win(t, mid('oxid', 0.1), mid('oxid', 0.42), 0.3));
        op(oxLabIron, P(t, mid('oxid', 0.02), 0.4, linear) * (1 - P(t, mid('oxid', 0.42), 0.2, linear))); op(oxLabOx, P(t, mid('oxid', 0.42) + 0.2, 0.3, linear));
      }
      op(oxRustLab, win(t, mid('oxid', 0.66), at('rust') + 0.1, 0.4));
      // the nail: appears beside the oxide, then moves into place for the rusting beat
      const nIn = P(t, mid('oxid', 0.58), 0.5, pop), mv = P(t, at('rust') - 0.1, 0.9);
      op(nailG, clamp(nIn * 2) * (1 - P(t, at('nails') - 0.25, 0.4, linear)));
      tr(nailG, lerp(770, 300, mv), lerp(390, 388, mv), Math.max(0.01, lerp(0.6 + 0.4 * nIn, 1.12, mv)));
      nail.set({ rust: lerp(0.07, 0.96, P(t, mid('rust', 0.3), end('rust') - mid('rust', 0.3) + 0.4, linear)) });
      // 2b
      const aB = win(t, at('rust') + 0.1, at('nails') - 0.05, 0.45);
      op(rsB, aB);
      if (aB > 0) {
        const oOn = P(t, mid('rust', 0.06), 0.5, linear), wOn = P(t, mid('rust', 0.16), 0.5, linear);
        rsO2.forEach(o => { const u = ((t - at('rust')) / 2.6 + o.ph) % 1; tr(o.g, lerp(110, 268, easeIn(u)), o.y + Math.sin(t * 2 + o.y) * 6 * AMP, 1, (t * 30 + o.y) % 360); op(o.g, oOn * Math.min(1, u * 5, (1 - u) * 6)); });
        rsDrops.forEach(o => { const u = ((t - at('rust')) / 2.4 + o.ph) % 1; tr(o.g, lerp(492, 330, easeIn(u)), o.y + Math.sin(t * 2.3 + o.y) * 5 * AMP); op(o.g, wOn * Math.min(1, u * 5, (1 - u) * 6)); });
        op(rsLabO, oOn); op(rsLabW, wOn);
        const tk = P(t, mid('rust', 0.3), 0.4, pop); [rsTickO, rsTickW].forEach((g, j) => { const q = j ? P(t, mid('rust', 0.34), 0.4, pop) : tk; op(g, clamp(q * 2)); tr(g, j ? 506 : 218, 243, Math.max(0.01, q)); });
        showParts(rsRow1, t, [mid('rust', 0.44), mid('rust', 0.5), mid('rust', 0.52), mid('rust', 0.58), mid('rust', 0.6)]);
        showParts(rsRow2, t, [mid('rust', 0.7), mid('rust', 0.73)]);
        const rp = P(t, mid('rust', 0.86), 0.5, pop); op(rsRust, clamp(rp * 2)); tr(rsRust, 0, (1 - clamp(rp)) * 12);
      }
      // 2c: the three tubes
      const aC = win(t, at('nails') - 0.15, at('prevent') + 0.05, 0.45);
      op(tbC, aC);
      if (aC > 0) {
        const tin = [at('nails'), mid('nails', 0.07), mid('nails', 0.5)];
        tubes.forEach((o, j) => { const p = P(t, tin[j], 0.55, pop); op(o.g, clamp(p * 2)); tr(o.g, o.x, TY + (1 - clamp(p)) * 26); op(tLab[j], P(t, tin[j] + 0.25, 0.4, linear)); });
        dryLab.set(P(t, mid('nails', 0.2), 0.4, linear)); oilLab.set(P(t, mid('nails', 0.64), 0.4, linear));
        [mid('nails', 0.2), mid('nails', 0.4), mid('nails', 0.88)].forEach((t0, j) => { const p = P(t, t0, 0.45, pop); op(results[j], clamp(p * 2)); tr(results[j], TX[j], 556, Math.max(0.01, 0.6 + 0.4 * p)); });
        shine.forEach((s, j) => { const p = P(t, j ? mid('nails', 0.9) : mid('nails', 0.42), 0.4, linear); op(s, p * (0.4 + 0.6 * wave(t, 1.3, j * 0.4))); });
      }
      // 2d: coatings
      const aD = P(t, at('prevent') - 0.05, 0.45, linear);
      op(pvD, aD);
      if (aD > 0) {
        const pin = [mid('prevent', 0.02), mid('prevent', 0.2), mid('prevent', 0.36)];
        pvObj.forEach((g, j) => { const p = P(t, pin[j], 0.5, pop); op(g, clamp(p * 2)); tr(g, PX[j], PY, Math.max(0.01, 0.7 + 0.3 * p)); op(pvLab[j], P(t, pin[j] + 0.2, 0.4, linear)); });
        op(zincLab, P(t, pin[2] + 0.4, 0.4, linear));
        const pp = P(t, pin[0] + 0.2, 1.4, linear);
        attr(paint, 'width', 232 * pp);
        tr(brush, lerp(-110, 112, pp), 0); op(brush, 1 - P(t, pin[0] + 1.7, 0.3, linear));
        oilDrops.forEach((d, j) => { const u = ((t - pin[1]) / 0.9 + j * 0.5) % 1; d.setAttribute('transform', `translate(40 ${(-54 + u * 74).toFixed(1)}) scale(0.7)`); op(d, t > pin[1] ? Math.min(1, u * 5, (1 - u) * 5) : 0); });
        op(sheen, P(t, pin[1] + 0.6, 0.5, linear));
        const bOn = P(t, mid('prevent', 0.48), 0.5, linear), flash = [0, 0, 0];
        bouncers.forEach(b => {
          const u = ((t - mid('prevent', 0.48)) / 1.7 + b.ph) % 1, cx = PX[b.j], cy = PY - 8;
          const inb = u < 0.5, q = inb ? easeIn(u / 0.5) : easeOut((u - 0.5) / 0.5), r = inb ? lerp(1.5, 1, q) : lerp(1, 1.5, q);
          const a = inb ? b.ang : b.out;
          tr(b.g, cx + Math.cos(a) * 136 * r, cy + Math.sin(a) * 100 * r);
          op(b.g, bOn * Math.sin(u * Math.PI));
          flash[b.j] = Math.max(flash[b.j], bOn * clamp(1 - Math.abs(u - 0.5) * 7));
        });
        shields.forEach((s, j) => op(s, bOn * (0.3 + 0.7 * flash[j])));
      }
    }

    /* 3. reduction */
    if (demoVis(2, t)) {
      const aA = 1 - P(t, at('pair') - 0.15, 0.5, linear);
      op(rdA, aA);
      if (aA > 0) {
        const heat = P(t, mid('reduce', 0.44), 0.8, linear);
        op(rdGlow, heat * (0.45 + 0.15 * wave(t, 1.1))); op(heatChip, heat);
        const TH0 = mid('reduce', 0.6), drift = P(t, TH0 + 1.75, 1.1), jig = heat * 2.6 * AMP;
        const jx = j => Math.sin(t * 17 + j * 2.3) * jig, jy = j => Math.cos(t * 19 + j * 1.7) * jig;
        rdO.forEach((m, j) => { const u = fly(m, t, TH0 + m.k * 0.13, 0.85, CDRIFT[m.c][0] * drift, CDRIFT[m.c][1] * drift); if (u <= 0) tr(m.g, m.a[0] + jx(j), m.a[1] + jy(j)); });
        rdC.forEach((g, c) => tr(g, CS[c][0] + CDRIFT[c][0] * drift + jx(c + 9) * (1 - drift), CS[c][1] + CDRIFT[c][1] * drift + jy(c + 9) * (1 - drift) + Math.sin(t * 1.6 + c) * 3 * AMP * drift));
        rdFe.forEach((m, j) => { const u = fly(m, t, TH0 + 1.3, 0.9); if (u <= 0) tr(m.g, m.a[0] + jx(j + 6), m.a[1] + jy(j + 6)); });
        op(ironShine, P(t, TH0 + 2.0, 0.6, linear) * (0.55 + 0.25 * wave(t, 1.6)));
        op(rdLab[0], P(t, mid('reduce', 0.5), 0.4, linear) * (1 - P(t, TH0 + 1.4, 0.4, linear)));
        op(rdLab[1], P(t, mid('reduce', 0.58), 0.4, linear) * (1 - P(t, TH0 + 1.7, 0.4, linear)));
        op(rdLab[2], P(t, TH0 + 1.8, 0.4, linear)); op(rdLab[3], P(t, TH0 + 2.3, 0.4, linear));
      }
      const aB = P(t, at('pair') - 0.05, 0.45, linear);
      op(rdB, aB);
      if (aB > 0) {
        const pc = P(t, at('pair') + 0.1, 0.8, easeOut);
        tr(pairChips[0], lerp(330, 486, pc), 256); tr(pairChips[1], lerp(870, 714, pc), 256);
        op(pairAmp, P(t, at('pair') + 0.7, 0.3, linear));
        arcTop.set(P(t, mid('pair', 0.5), 0.8)); op(labTop, P(t, mid('pair', 0.56), 0.4, linear));
        arcBot.set(P(t, mid('pair', 0.76), 0.8)); op(labBot, P(t, mid('pair', 0.8), 0.4, linear));
        const hu = P(t, mid('pair', 0.62), 1.0);
        const hp = arcPt([eqX[0], EQY - 52], [eqX[2] - 4, EQY - 52], hu, 70);
        tr(hopO, hp[0], hp[1], Math.max(0.01, 1 - 0.3 * hu));
        op(hopO, win(t, mid('pair', 0.58), mid('pair', 0.62) + 1.25, 0.25));
      }
    }

    /* 4. thermal decomposition */
    if (demoVis(3, t)) {
      bun.upd(t * AMP + (1 - AMP) * 0.4);
      const blk = P(t, mid('decomp', 0.5), mid('decomp', 0.78) - mid('decomp', 0.5), linear);
      dTube.set(0.3, mix(RX.cuCarbonate, RX.cuOxide, blk));
      op(colChips[0], P(t, mid('decomp', 0.44), 0.4, linear) * (1 - P(t, mid('decomp', 0.66), 0.4, linear)));
      op(colChips[1], P(t, mid('decomp', 0.68), 0.4, linear));
      op(colLead, P(t, mid('decomp', 0.44), 0.4, linear));
      const gas = P(t, mid('decomp', 0.72), 0.5, linear);
      escCO2.forEach((g, j) => { const u = ((t - mid('decomp', 0.72)) / 2.4 + j / 2) % 1; tr(g, lerp(186, 100, u) + Math.sin(t * 2 + j) * 6, lerp(226, 136, u), 1, -30 + u * 40); op(g, gas * Math.min(1, u * 5, (1 - u) * 5)); });
      // the molecule breaks up
      const brk = mid('decomp', 0.22);
      op(molGlow, win(t, mid('decomp', 0.04), brk + 0.9, 0.4) * (0.5 + 0.2 * wave(t, 0.8)));
      dc.forEach((m, j) => { fly(m, t, brk + (j >= 2 ? 0.15 : 0), 1.1); if (t > brk + 1.3) tr(m.g, m.b[0] + (j >= 2 ? Math.sin(t * 1.5) * 3 * AMP : 0), m.b[1] + (j >= 2 ? Math.cos(t * 1.2) * 4 * AMP : 0), m.s1); });
      op(mol, P(t, at('decomp') + 0.1, 0.5, linear));
      op(molGh, P(t, brk + 0.3, 0.5, linear) * 0.5);
      molArrow.set(P(t, brk + 0.2, 0.6)); op(molArrow, P(t, brk + 0.2, 0.2, linear));
      op(molPlus, P(t, brk + 1.1, 0.4, linear));
      op(molLab[0], P(t, at('decomp') + 0.3, 0.4, linear) * (1 - 0.35 * P(t, brk + 0.4, 0.5, linear)));
      op(molLab[1], P(t, brk + 1.0, 0.4, linear)); op(molLab[2], P(t, brk + 1.2, 0.4, linear));
    }

    /* 5. neutralisation */
    if (demoVis(4, t)) {
      showParts(nRow, t, [0.08, 0.14, 0.19, 0.25, 0.3, 0.36, 0.4].map(f => mid('neutral', f)));
      tiles.forEach((o, j) => { const t0 = mid('absw', 0.22 + j * 0.15), p = P(t, t0, 0.5, easeOut), bounce = Math.sin(Math.PI * P(t, t0 + 0.4, 0.3, linear)) * 8; op(o.g, P(t, t0, 0.2, linear)); tr(o.g, o.x, lerp(250, 306, p) - bounce); });
      const aIn = P(t, mid('neutral', 0.47), 0.5, pop), bIn = P(t, mid('neutral', 0.58), 0.5, pop);
      op(alkG, clamp(bIn * 2)); op(nLab[0], P(t, mid('neutral', 0.5), 0.4, linear)); op(nLab[1], P(t, mid('neutral', 0.61), 0.4, linear));
      const T0 = mid('neutral', 0.66), lift = P(t, T0, 0.6) * (1 - P(t, T0 + 1.9, 0.6)), pour = P(t, T0 + 0.5, 1.2, linear);
      const ax = lerp(290, 385, lift), ay = lerp(425, 342, lift), ar = 64 * lift;
      tr(acidG, ax, ay - (1 - clamp(aIn)) * 20, Math.max(0.01, 0.8 + 0.2 * aIn), ar); op(acidG, clamp(aIn * 2));
      acidB.set(lerp(0.6, 0.12, pour));
      alkB.set(lerp(0.5, 0.72, pour), mix('#7B8CFF', C.plant, P(t, T0 + 0.7, 1.2, linear)));
      const on = pour > 0 && pour < 1 && lift > 0.9;
      if (on) { const rad = ar * Math.PI / 180, lx = ax + Math.cos(rad) * 55 - Math.sin(rad) * -60, ly = ay + Math.sin(rad) * 55 + Math.cos(rad) * -60; stream.setAttribute('d', `M${lx.toFixed(1)},${ly.toFixed(1)} Q${(lx + 14).toFixed(1)},${(ly + 12).toFixed(1)} ${(lx + 16).toFixed(1)},432`); }
      op(stream, on ? 0.85 : 0);
      const pr = mid('neutral', 0.82);
      prod.forEach(([g, x, y], j) => { const u = P(t, pr + j * 0.18, 0.9); const p = arcPt([520, 410], [x, y], u, 90); tr(g, p[0], p[1], Math.max(0.01, lerp(0.4, 1, u))); op(g, P(t, pr + j * 0.18, 0.25, linear)); });
      op(nLab[2], P(t, pr + 0.6, 0.4, linear)); op(nLab[3], P(t, pr + 0.9, 0.4, linear));
    }

    /* 6. displacement */
    if (demoVis(5, t)) {
      const fIn = P(t, mid('displace', 0.14), 1.4), hit = mid('displace', 0.14) + 1.2, out = P(t, hit, 1.0, easeOut);
      const fp = arcPt(FE0, FE1, fIn, 40);
      tr(fe, fp[0] + (fIn >= 1 ? Math.sin(t * 2) * 1.5 * AMP : 0), fp[1]);
      const cp = arcPt(CU0, CU1, out, -10);
      tr(cu, cp[0] - Math.sin(Math.PI * P(t, hit - 0.15, 0.3, linear)) * 6, cp[1]);
      tr(feTag, fp[0], fp[1] - 61); tr(cuTag, cp[0], cp[1] + 62);
      op(feTag, P(t, mid('displace', 0.12), 0.4, linear));
      op(cuTag, P(t, mid('displace', 0.3), 0.4, linear));
      push.set(P(t, mid('displace', 0.16), 0.8)); op(push, win(t, mid('displace', 0.16), hit + 0.2, 0.3));
      op(swLab[0], P(t, at('displace') + 0.2, 0.4, linear) * (1 - P(t, hit + 0.3, 0.25, linear))); op(swLab[1], P(t, hit + 0.55, 0.3, linear));
      // the nail dips into copper sulfate and turns copper-coloured; the blue fades to pale green
      const dip = P(t, mid('displace', 0.6), 1.0);
      tr(dNailG, 0, lerp(-150, -3.4, dip)); op(dNailG, P(t, mid('displace', 0.56), 0.4, linear)); op(surf, dip >= 1 ? 1 : 0);
      const cuP = P(t, mid('displace', 0.72), end('displace') - mid('displace', 0.72), linear);
      op(dCopper, cuP);
      dBk.set(0.7, mix(RX.cuSulfate, RX.feSulfate, P(t, mid('displace', 0.74), end('displace') - mid('displace', 0.74) + 0.5, linear)));
      const sw = mid('displace', 0.9);
      op(solLab[0], P(t, at('displace') + 0.3, 0.4, linear) * (1 - P(t, sw, 0.25, linear))); op(solLab[1], P(t, sw + 0.25, 0.3, linear));
      cuLab.set(P(t, mid('displace', 0.86), 0.4, linear));
    }
  };
});

/* A balanced diet: an empty plate splits into seven sectors -> "Crazy People Find Very Many Fish Wet" drops
   each nutrient onto its sector (showpiece: the plate completes as water lands) -> one card per nutrient,
   its sector lifted out: job, then foods -> fat isn't bad, energy in vs out -> fibre and water give no energy
   but are essential; one food can't fill the plate -> a food label lists the same nutrients. */
scene('diet', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const wedge = (r, a0, a1) => `M0,0 L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)} Z`;
  const popIn = (el, t, t0, x, y, s) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p))); return p; };
  const fadeIn = (el, t, t0, dur) => op(el, P(t, t0, dur || 0.4, linear));

  // food and body icons, about 90 px across at s = 1, centred on (0,0)
  function icon(parent, name, s) {
    const g = G(parent), k = g; if (s && s !== 1) tr(g, 0, 0, s);
    const pth = (d, f, st, sw, o) => E('path', Object.assign({ d, fill: f, stroke: st || 'none', 'stroke-width': sw || 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, o || {}), k);
    switch (name) {
      case 'bread': { const i = G(k); tr(i, 0, 12, 0.4); const d = 'M-95,95 L-95,-20 C-132,-40 -126,-112 -60,-112 C-30,-138 30,-138 60,-112 C126,-112 132,-40 95,-20 L95,95 Q95,107 83,107 L-83,107 Q-95,107 -95,95 Z'; E('path', { d, fill: '#C8833A', stroke: '#8A5221', 'stroke-width': 8, 'stroke-linejoin': 'round' }, i); E('path', { d, fill: '#F2C46E', transform: 'translate(0 6) scale(0.8)' }, i); break; }
      case 'rice': pth('M-40,-4 Q-34,-30 -10,-32 Q0,-42 12,-32 Q36,-30 40,-4 Z', '#F6F4EC', '#C9C4B0'); pth('M-46,-6 L46,-6 Q42,34 0,36 Q-42,34 -46,-6 Z', '#4C8DD6', '#2D5E9A'); pth('M-22,-16 l7,-3 M-4,-24 l7,-2 M14,-16 l7,-3 M-12,-10 l7,-2 M4,-12 l7,-2', 'none', '#B8B09A', 3); break;
      case 'pasta': pth('M-42,-24 L-6,-7 Q0,-11 6,-7 L42,-24 L40,24 L6,7 Q0,11 -6,7 L-40,24 Z', '#F4CF6A', '#B8902E', 3.5); pth('M-28,-14 L-26,14 M-16,-9 L-15,9 M28,-14 L26,14 M16,-9 L15,9', 'none', '#D9AE3E', 3); E('circle', { r: 7, fill: '#E8B846', stroke: '#B8902E', 'stroke-width': 3 }, k); break;
      case 'potato': pth('M-40,-6 C-40,-26 -18,-32 2,-30 C26,-30 42,-18 40,2 C38,22 20,32 -2,30 C-24,30 -40,14 -40,-6 Z', '#C9945A', '#8A5E30', 3.5); pth('M-18,-10 a3,3 0 1 0 0.1,0 M10,-16 a3,3 0 1 0 0.1,0 M14,12 a3,3 0 1 0 0.1,0 M-10,14 a2.5,2.5 0 1 0 0.1,0', 'none', '#7A4E26', 4); break;
      case 'sugar': pth('M-34,-4 L-6,-4 L-6,24 L-34,24 Z', '#FFFFFF', '#AFC1CC', 3); pth('M-34,-4 L-24,-14 L4,-14 L-6,-4 Z M-6,-4 L4,-14 L4,14 L-6,24 Z', '#E4ECF1', '#AFC1CC', 3); pth('M8,6 L32,6 L32,30 L8,30 Z', '#FFFFFF', '#AFC1CC', 3); pth('M8,6 L18,-4 L42,-4 L32,6 Z M32,6 L42,-4 L42,20 L32,30 Z', '#E4ECF1', '#AFC1CC', 3); break;
      case 'meat': pth('M-44,-8 C-44,-34 -10,-40 14,-34 C40,-28 48,-6 40,14 C32,34 0,40 -20,32 C-40,24 -44,10 -44,-8 Z', '#C2414B', '#F7DCCF', 6); pth('M-16,-14 C0,-20 16,-14 18,0', 'none', '#E7909A', 4); E('circle', { cx: 18, cy: 8, r: 7, fill: '#F7EBDD', stroke: '#C9B79F', 'stroke-width': 2 }, k); break;
      case 'fish': pth('M-26,0 L-46,-18 L-42,0 L-46,18 Z', '#5E9CC4', '#2F6E96'); pth('M-30,0 C-14,-26 26,-26 42,0 C26,26 -14,26 -30,0 Z', '#7FB6D9', '#2F6E96'); pth('M-4,-14 C2,-6 2,6 -4,14', 'none', '#2F6E96', 3); E('circle', { cx: 26, cy: -5, r: 4, fill: '#10202B' }, k); break;
      case 'egg': E('ellipse', { cx: 0, cy: 2, rx: 27, ry: 35, fill: ball('#FFF6E6', '#D9C4A0'), stroke: '#C9B48A', 'stroke-width': 3 }, k); break;
      case 'beans': [[-18, 6, -30], [4, -10, 20], [16, 14, -10]].forEach(([x, y, r]) => pth('M-15,-4 C-15,-14 -2,-15 2,-8 C5,-14 15,-12 15,-2 C15,10 4,13 0,12 C-6,12 -15,8 -15,-4 Z', '#A63D2F', '#6E2219', 3, { transform: `translate(${x} ${y}) rotate(${r})` })); break;
      case 'nuts': pth('M0,-34 C17,-34 19,-17 11,-6 C19,6 19,34 0,34 C-19,34 -19,6 -11,-6 C-19,-17 -17,-34 0,-34 Z', '#D9A866', '#9A6B30', 3.5, { transform: 'rotate(-30)' }); pth('M-6,-20 l10,4 M-12,0 l12,4 M-6,18 l10,4', 'none', '#B5853F', 3, { transform: 'rotate(-30)' }); break;
      case 'butter': E('ellipse', { cx: 0, cy: 18, rx: 46, ry: 13, fill: '#C9D6DE', stroke: '#8FA6B4', 'stroke-width': 3 }, k); pth('M-32,-6 L-18,-20 L36,-20 L22,-6 Z', '#FFF0B0', '#C9A93E', 3); pth('M-32,-6 L22,-6 L22,16 L-32,16 Z M22,-6 L36,-20 L36,2 L22,16 Z', '#FFE27A', '#C9A93E', 3); break;
      case 'oil': pth('M0,-38 C16,-14 28,0 28,14 A28,28 0 0 1 -28,14 C-28,0 -16,-14 0,-38 Z', ball('#FFD54A', '#C99A1A'), '#A87C10', 3); pth('M-12,8 C-12,0 -8,-8 -4,-12', 'none', '#FFF4C2', 4); break;
      case 'cheese': pth('M-42,22 L-42,-4 L38,-28 L42,22 Z', '#FFD24D', '#C9981E', 3.5); pth('M-42,-4 L38,-28 L42,-20 L-38,4 Z', '#FFE58A', 'none'); [[-20, 8, 7], [8, -2, 5], [20, 12, 6]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#E5AE2A' }, k)); break;
      case 'orange': E('circle', { cx: 0, cy: 4, r: 32, fill: ball('#FFA64D', '#D9701A'), stroke: '#C25E10', 'stroke-width': 3 }, k); pth('M2,-28 C14,-42 30,-38 30,-30 C22,-24 10,-24 2,-28 Z', '#5BBF4A', '#2F7F26', 2.5); E('circle', { cx: 0, cy: -27, r: 3, fill: '#8A4A10' }, k); break;
      case 'broccoli': pth('M-8,40 L-4,4 L4,4 L8,40 Z', '#9BD66B', '#4F8F2E', 3); [[-18, -6, 18], [18, -6, 18], [0, -20, 20], [-4, 2, 14]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#4FB34A', '#24702A'), stroke: '#1F5E22', 'stroke-width': 2.5 }, k)); break;
      case 'milk': pth('M-24,-12 L0,-34 L24,-12 L24,38 L-24,38 Z', '#F7FAFC', '#A9BCD4', 3); pth('M-24,4 L24,4 L24,24 L-24,24 Z', '#5B8DEF', 'none'); pth('M-24,-12 L24,-12 M0,-34 L0,-24', 'none', '#A9BCD4', 3); break;
      case 'rbc': E('circle', { r: 26, fill: ball('#F05A66', '#9A1E2A'), stroke: '#FFB3BA', 'stroke-width': 2.5 }, k); E('ellipse', { rx: 12, ry: 11, fill: 'rgba(110,10,25,0.35)' }, k); break;
      case 'bone': pth('M-28,-7 C-34,-21 -52,-14 -45,-2 C-52,10 -36,20 -28,7 L28,7 C34,21 52,14 45,2 C52,-10 36,-20 28,-7 Z', '#F5EEDC', '#BFB39A', 3); break;
      case 'tooth': pth('M-22,-26 C-10,-34 10,-34 22,-26 C30,-18 28,-2 22,8 C18,20 16,34 8,34 C2,34 2,18 0,14 C-2,18 -2,34 -8,34 C-16,34 -18,20 -22,8 C-28,-2 -30,-18 -22,-26 Z', '#F5EEDC', '#BFB39A', 3); pth('M-12,-18 C-6,-22 2,-22 6,-20', 'none', '#FFFFFF', 3); break;
      case 'grain': pth('M2,44 C0,20 0,-10 2,-40', 'none', '#B8913F', 4); { let d = ''; for (let i = 0; i < 4; i++) { const y = -30 + i * 14; d += `M1,${y + 8} C-12,${y + 4} -16,${y - 8} -10,${y - 12} C-2,${y - 10} 1,${y - 2} 1,${y + 8} Z M3,${y + 8} C16,${y + 4} 20,${y - 8} 14,${y - 12} C6,${y - 10} 3,${y - 2} 3,${y + 8} Z `; } d += 'M2,-36 C-4,-46 0,-54 2,-56 C4,-54 8,-46 2,-36 Z'; pth(d, '#E3BE6A', '#A8812F', 2.5); } break;
      case 'apple': pth('M0,-20 C-10,-30 -40,-28 -40,2 C-40,28 -18,40 0,32 C18,40 40,28 40,2 C40,-28 10,-30 0,-20 Z', ball('#EE5A4F', '#A82A22'), '#8E2019', 3); pth('M0,-20 C0,-28 2,-34 6,-38', 'none', '#6B4A2A', 4); pth('M6,-30 C14,-40 26,-38 28,-32 C20,-26 12,-26 6,-30 Z', '#5BBF4A', '#2F7F26', 2.5); break;
      case 'carrot': pth('M-10,-22 L10,-22 L3,40 Q0,44 -3,40 Z', '#FF8C2E', '#C25E10', 3, { transform: 'rotate(20)' }); pth('M0,-22 C-6,-36 -14,-40 -18,-38 M0,-22 C0,-38 4,-44 8,-46 M0,-22 C8,-34 16,-36 20,-34', 'none', '#4FB34A', 5, { transform: 'rotate(20)' }); pth('M-6,-6 l6,0 M-4,10 l6,0', 'none', '#C25E10', 3, { transform: 'rotate(20)' }); break;
      case 'drop': pth('M0,-38 C16,-14 28,2 28,16 A28,28 0 0 1 -28,16 C-28,2 -16,-14 0,-38 Z', ball('#8FE0F8', '#1D84A6'), '#1D84A6', 3); pth('M-12,10 C-12,2 -8,-6 -4,-10', 'none', '#E6F8FF', 4); break;
    }
    return g;
  }
  // a balance scale: pivot at (0,0); g.set(tilt degrees, + tips right down); g.panL / g.panR hold the loads
  function balance(parent, half) {
    const g = G(parent), H = half || 150;
    E('path', { d: 'M-60,190 L60,190 L44,172 L-44,172 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -7, y: -8, width: 14, height: 182, rx: 5, fill: '#AFC1CC' }, g);
    const beam = G(g);
    E('rect', { x: -H - 8, y: -7, width: 2 * H + 16, height: 14, rx: 7, fill: '#C9D6DE', stroke: '#8FA6B4', 'stroke-width': 2 }, beam);
    E('circle', { r: 13, fill: C.energy, stroke: '#B59B12', 'stroke-width': 3 }, g);
    const pan = () => {
      const p = G(g);
      E('path', { d: 'M0,0 L-52,86 M0,0 L52,86', stroke: '#C9D6DE', 'stroke-width': 3 }, p);
      E('path', { d: 'M-66,86 L66,86 Q60,108 0,110 Q-60,108 -66,86 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, p);
      p.load = G(p); tr(p.load, 0, 84);
      return p;
    };
    g.panL = pan(); g.panR = pan();
    g.set = a => {
      beam.setAttribute('transform', `rotate(${a.toFixed(2)})`);
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      tr(g.panL, -H * c, -H * s); tr(g.panR, H * c, H * s);
    };
    g.set(0);
    return g;
  }
  function gear(parent, r, teeth, color) {
    const pts = [], n = teeth * 4;
    for (let i = 0; i < n; i++) { const a = i / n * TAU, rr = (i % 4 < 2) ? r : r * 0.78; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    const g = G(parent);
    E('path', { d: 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z', fill: color, stroke: '#C25E10', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: r * 0.3, fill: C.card, stroke: '#C25E10', 'stroke-width': 3 }, g);
    return g;
  }

  /* ---------- the seven nutrient groups ---------- */
  const NUT = [
    { id: 'carbs', name: 'carbohydrates', mn: 'Crazy', col: '#F5B041', icon: 'bread' },
    { id: 'protein', name: 'proteins', mn: 'People', col: '#FF8A80', icon: 'meat' },
    { id: 'fats', name: 'fats', mn: 'Find', col: '#FFE27A', icon: 'butter' },
    { id: 'vitamins', name: 'vitamins', mn: 'Very', col: '#FF9F43', icon: 'orange' },
    { id: 'minerals', name: 'minerals', mn: 'Many', col: '#B48CFF', icon: 'milk' },
    { id: 'fibre', name: 'fibre', mn: 'Fish', col: '#4FC37A', icon: 'grain' },
    { id: 'water', name: 'water', mn: 'Wet', col: '#4CC9F0', icon: 'drop' },
  ];

  /* ================= the plate ================= */
  const PX = 330, PY = 432, RIM = 214, FACE = 190, SR = 178, IR = 108;
  const plate = G(root);
  E('circle', { cx: 10, cy: 16, r: RIM, fill: 'rgba(0,0,0,0.28)' }, plate);
  E('circle', { r: RIM, fill: '#E7EEF2', stroke: '#AFC1CC', 'stroke-width': 3 }, plate);
  E('circle', { r: FACE, fill: '#F3F7F9', stroke: '#C9D6DE', 'stroke-width': 2 }, plate);
  const ring = E('circle', { r: RIM, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8 }, plate);
  const secs = NUT.map((n, i) => {
    const am = -Math.PI / 2 + i * TAU / 7, a0 = am - TAU / 14, a1 = am + TAU / 14;
    const g = G(plate);
    const fillP = E('path', { d: wedge(SR, a0, a1), fill: n.col, stroke: 'none' }, g);
    const line = E('path', { d: wedge(SR, a0, a1), fill: 'none', stroke: '#9FB3C1', 'stroke-width': 3, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const ic = icon(g, n.icon, 0.66);
    return { g, fillP, line, ic, am, ix: Math.cos(am) * IR, iy: Math.sin(am) * IR };
  });

  /* ================= balanced: a diet with everything, in the right amounts ================= */
  const bal = G(root);
  T(bal, 885, 236, 'A balanced diet', { size: 54, weight: 700, anchor: 'middle' });
  const balRows = [
    { y: 322, segs: ['all the ', ['nutrients', C.ink, 800], ' you need'] },
    { y: 392, segs: ['in the ', ['right amounts', C.ink, 800]] },
  ].map(r => { const g = G(bal); const tk = tick(g, 15); tr(tk, 676, r.y - 10); rich(g, 708, r.y, r.segs, { size: 32, weight: 500 }); return g; });
  const seven = G(bal);
  T(seven, -48, 40, '7', { size: 150, weight: 700, anchor: 'middle', fill: C.energy });
  T(seven, 22, -28, 'nutrient', { size: 46, weight: 700 });
  T(seven, 22, 26, 'groups', { size: 46, weight: 700 });

  /* ================= crazy: the mnemonic list ================= */
  const MN_AT = [0.11, 0.15, 0.19, 0.225, 0.26, 0.29, 0.32], NAME_AT = [0.408, 0.54, 0.643, 0.708, 0.798, 0.88, 0.945];
  const list = G(root);
  const rows = NUT.map((n, i) => {
    const y = 184 + i * 74;
    const g = G(list);
    const w = rich(g, 640, y + 15, [[n.mn[0], C.energy, 800], [n.mn.slice(1), C.ink, 700]], { size: 44 });
    const nm = G(g);
    E('path', { d: `M806,${y} L840,${y} M830,${y - 8} L842,${y} L830,${y + 8}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, nm);
    T(nm, 856, y + 12, n.name, { size: 34, weight: 700, fill: n.col });
    const nw = textWidth(n.name, 34, FD, 700);
    return { g, w, nm, y, sx: 856 + nw + 46 };
  });

  /* ================= nutrient cards ================= */
  const cardBg = card(root, 600, 142, 570, 556, { fill: C.card, stroke: C.line });
  const CX0 = 636, CXM = 885;
  function cardHead(parent, n, title, fnSegs) {
    T(parent, CX0, 214, title, { size: 52, weight: 700, fill: n.col });
    return fnSegs ? rich(parent, CX0, 266, fnSegs, { size: 30, weight: 500 }) : null;
  }
  function foodRow(parent, names, labels, y, xs, s) {
    return names.map((nm, i) => {
      const g = G(parent); tr(g, xs[i], y);
      icon(g, nm, s || 0.68);
      if (labels[i]) T(g, 0, 70, labels[i], { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
      return { g, x: xs[i], y };
    });
  }
  const X5 = [673, 779, 885, 991, 1097], X4 = [686, 818, 950, 1082];

  // carbohydrates
  const cCarb = G(root);
  cardHead(cCarb, NUT[0], 'Carbohydrates', ['your ', ['main source of energy', C.ink, 800]]);
  const cSpark = spark(cCarb, 48, { seed: 2 }); tr(cSpark, CXM, 395);
  const orbit = [0, 1, 2, 3, 4].map(k => spark(cCarb, 13, { seed: k + 4 }));
  const carbFoods = foodRow(cCarb, ['bread', 'rice', 'pasta', 'potato', 'sugar'], ['bread', 'rice', 'pasta', 'potatoes', 'sugar'], 560, X5);
  const carbAt = [0.53, 0.612, 0.713, 0.816, 0.92];

  // proteins
  const cProt = G(root);
  cardHead(cProt, NUT[1], 'Proteins', ['for ', ['growth and repair', C.ink, 800]]);
  T(cProt, CX0, 302, 'of cells and tissues', { size: 26, weight: 500, fill: C.muted });
  const tissue = G(cProt);
  const cells = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const x = 774 + c * 74, y = 458 - r * 50, grow = r === 2, gap = r === 1 && (c === 1 || c === 2);
    const g = grow || gap ? G(tissue) : tissue, ox = grow || gap ? 0 : x, oy = grow || gap ? 0 : y;
    E('rect', { x: ox - 33, y: oy - 21, width: 66, height: 42, rx: 13, fill: gap ? 'rgba(86,214,155,0.25)' : 'rgba(247,168,200,0.22)', stroke: gap ? C.good : C.cell, 'stroke-width': 3 }, g);
    E('circle', { cx: ox + (c % 2 ? 8 : -8), cy: oy, r: 7, fill: '#B79CF0' }, g);
    if (grow || gap) cells.push({ g, r, c, x, y, grow, gap });
  }
  const growArrow = arrow(cProt, 1078, 458, 1078, 348, { color: NUT[1].col, width: 5 });
  const growLab = T(cProt, 1078, 330, 'growth', { size: 26, weight: 700, anchor: 'middle', fill: NUT[1].col });
  const repLab = rich(cProt, 885, 516, [['repair', C.good, 700]], { size: 26, anchor: 'middle' });
  const repSpark = spark(cProt, 14, { seed: 6 }); tr(repSpark, 885, 408);
  const protFoods = foodRow(cProt, ['meat', 'fish', 'egg', 'beans', 'nuts'], ['meat', 'fish', 'eggs', 'beans', 'nuts'], 572, X5);
  const protAt = [0.58, 0.664, 0.755, 0.83, 0.91];

  // fats (head stays for "fat isn't bad")
  const cFatH = G(root);
  T(cFatH, CX0, 214, 'Fats', { size: 52, weight: 700, fill: NUT[2].col });
  T(cFatH, CX0 + textWidth('Fats', 52, FD, 700) + 18, 214, 'or lipids', { size: 32, weight: 500, fill: C.muted });
  rich(cFatH, CX0, 266, [['store energy', C.ink, 800], ', ', ['insulate', C.ink, 800], ' and ', ['protect', C.ink, 800]], { size: 30, weight: 500 });
  const cFat = G(root);
  const badges = [['energy store', 712], ['insulation', 885], ['protection', 1058]].map(([lab, x], i) => {
    const g = G(cFat); tr(g, x, 382);
    E('circle', { r: 54, fill: C.card2, stroke: NUT[2].col, 'stroke-width': 3 }, g);
    const art = G(g);
    if (i === 0) {
      E('rect', { x: -32, y: -17, width: 58, height: 34, rx: 7, fill: 'none', stroke: NUT[2].col, 'stroke-width': 4 }, art);
      E('rect', { x: 27, y: -7, width: 7, height: 14, rx: 2, fill: NUT[2].col }, art);
      g.lvl = E('rect', { x: -27, y: -12, width: 0, height: 24, rx: 4, fill: NUT[2].col }, art);
    } else if (i === 1) {
      // a striped scarf: the loop round the neck and two fringed ends
      E('path', { d: 'M-30,-22 C-30,-2 30,-2 30,-22', fill: 'none', stroke: '#E8584A', 'stroke-width': 15, 'stroke-linecap': 'round' }, art);
      E('path', { d: 'M4,-8 L-2,26 M18,-8 L22,26', fill: 'none', stroke: '#D9443A', 'stroke-width': 13, 'stroke-linecap': 'round' }, art);
      E('path', { d: 'M-18,-14 L-15,-5 M0,-10 L0,-2 M18,-14 L15,-5 M-5,6 L7,8 M-3,16 L9,18 M15,6 L27,6 M16,16 L28,16', fill: 'none', stroke: '#FFE0D6', 'stroke-width': 3, 'stroke-linecap': 'round' }, art);
      E('path', { d: 'M-8,33 l0,7 M-2,34 l0,7 M4,33 l0,7 M16,33 l0,7 M22,34 l0,7 M28,33 l0,7', fill: 'none', stroke: '#E8584A', 'stroke-width': 3, 'stroke-linecap': 'round' }, art);
    } else {
      E('path', { d: 'M0,-34 L28,-23 L27,6 C24,22 12,31 0,35 C-12,31 -24,22 -27,6 L-28,-23 Z', fill: 'rgba(255,226,122,0.18)', stroke: NUT[2].col, 'stroke-width': 4, 'stroke-linejoin': 'round' }, art);
      E('path', { d: 'M0,16 C-18,4 -17,-11 -8,-12 C-3,-12 0,-8 0,-6 C0,-8 3,-12 8,-12 C17,-11 18,4 0,16 Z', fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 2 }, art);
    }
    T(g, 0, 92, lab, { size: 26, weight: 600, anchor: 'middle' });
    return g;
  });
  const badgeAt = [0.2, 0.42, 0.56];
  const fatFoods = foodRow(cFat, ['butter', 'oil', 'cheese', 'nuts'], ['butter', 'oils', 'cheese', 'nuts'], 572, X4);
  const fatAt = [0.74, 0.796, 0.869, 0.935];

  // fat isn't bad: energy in vs energy out
  const cOk = G(root);
  const sign = G(cOk); tr(sign, CXM, 338);
  E('rect', { x: -130, y: -36, width: 260, height: 72, rx: 14, fill: '#F4F7FA', stroke: '#AFC1CC', 'stroke-width': 3 }, sign);
  T(sign, 0, 13, 'Fat = bad', { size: 38, weight: 700, anchor: 'middle', fill: '#1B2A35' });
  const signStrike = strike(sign, -112, 0, 112, C.bad);
  const scl = balance(cOk, 150); tr(scl, CXM, 452, 0.86);
  const inLoad = G(scl.panL.load); [['bread', -26, -18, -8], ['cheese', 22, -14, 6], ['butter', -2, -44, 0], ['nuts', 34, -42, 0]].forEach(([nm, x, y, r]) => { const g = G(inLoad); tr(g, x, y, 1, r); icon(g, nm, 0.42); });
  const outLoad = G(scl.panR.load);
  { const sp = spark(outLoad, 16, { seed: 3 }); tr(sp, 0, -26); outLoad.sp = sp; }
  const lblIn = T(cOk, 0, 0, 'energy in', { size: 26, weight: 600, anchor: 'middle' });
  const lblOut = T(cOk, 0, 0, 'energy out', { size: 26, weight: 600, anchor: 'middle' });

  // vitamins
  const cVit = G(root);
  cardHead(cVit, NUT[3], 'Vitamins', ['needed in ', ['tiny amounts', C.ink, 800]]);
  // a teaspoon holding just a few grains
  const pinch = G(cVit); tr(pinch, 760, 392);
  E('path', { d: 'M-74,22 L-18,4', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 12, 'stroke-linecap': 'round' }, pinch);
  E('ellipse', { cx: 20, cy: -4, rx: 42, ry: 24, fill: ball('#E4ECF1', '#8FA6B4'), stroke: '#F4F8FA', 'stroke-width': 3, transform: 'rotate(-12 20 -4)' }, pinch);
  E('ellipse', { cx: 22, cy: -6, rx: 30, ry: 14, fill: '#7E95A3', transform: 'rotate(-12 22 -6)' }, pinch);
  const grains = [[14, -6], [24, -9], [30, -3]].map(([x, y]) => E('circle', { cx: x, cy: y, r: 4, fill: NUT[3].col }, pinch));
  T(pinch, 0, 84, 'a pinch is plenty', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const gears = G(cVit); tr(gears, 1010, 392);
  const g1 = gear(gears, 40, 9, '#FFB866'), g2 = gear(gears, 28, 7, '#FF9F43');
  T(gears, 0, 84, 'keeps you working', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const vitC = chip(cVit, 'vitamin C', { size: 30, fill: 'rgba(255,159,67,0.18)', stroke: NUT[3].col, color: NUT[3].col }); tr(vitC, 724, 582);
  const vitFoods = foodRow(cVit, ['orange', 'broccoli'], ['fruit', 'vegetables'], 566, [900, 1056], 0.7);

  // minerals
  const cMin = G(root);
  cardHead(cMin, NUT[4], 'Minerals', ['needed in ', ['tiny amounts', C.ink, 800], ' too']);
  const mRow = (y, chipText, srcIcon, targets, label) => {
    const g = G(cMin);
    const ch = chip(g, chipText, { size: 30, fill: 'rgba(180,140,255,0.18)', stroke: NUT[4].col, color: '#D9C6FF' }); tr(ch, 642 + ch.w / 2, y);
    const src = G(g); tr(src, 662 + ch.w + 44, y); icon(src, srcIcon, 0.62);
    const ax = 662 + ch.w + 92;
    const ar = arrow(g, ax, y, ax + 50, y, { color: C.muted, width: 5 });
    const tg = G(g);
    targets.forEach(([nm, dx, dy, s]) => { const e = G(tg); tr(e, ax + 98 + dx, y + dy); icon(e, nm, s); });
    const lb = T(g, ax + 98 + (targets.length > 1 ? 52 : 0), y + 72, label, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    return { ch, src, ar, tg, lb };
  };
  const mIron = mRow(372, 'iron', 'meat', [['rbc', -12, -6, 0.7], ['rbc', 22, 10, 0.62]], 'red blood cells');
  const mCal = mRow(560, 'calcium', 'milk', [['bone', 0, -6, 0.78], ['tooth', 104, -4, 0.7]], 'bones and teeth');

  // fibre
  const cFib = G(root);
  cardHead(cFib, NUT[5], 'Fibre', null);
  const fibFn = rich(cFib, CX0, 266, [['can’t be digested', C.ink, 800]], { size: 30, weight: 500 });
  const fibFoods = foodRow(cFib, ['grain', 'apple', 'carrot'], ['wholegrains', 'fruit', 'vegetables'], 352, [716, 885, 1054], 0.66);
  const fibAt = [0.098, 0.194, 0.26];
  // a stretch of gut: a ring of muscle squeezes behind a bulky, fibre-filled lump and pushes it along
  const gut = G(cFib); tr(gut, 0, 548);
  const lumen = E('path', { fill: '#3A1424' }, gut);
  const bolus = G(gut);
  E('ellipse', { rx: 46, ry: 25, fill: ball('#B98A4E', '#7A5A2A'), stroke: '#5E4420', 'stroke-width': 2 }, bolus);
  E('path', { d: 'M-30,-6 L-6,-14 M-24,8 L4,2 M2,-10 L28,-2 M8,12 L30,6', fill: 'none', stroke: '#6FD08F', 'stroke-width': 4, 'stroke-linecap': 'round' }, bolus);
  const wallT = E('path', { fill: 'none', stroke: '#F4A6B8', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gut);
  const wallB = E('path', { fill: 'none', stroke: '#F4A6B8', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gut);
  const GX0 = 640, GX1 = 1130;
  function gutWalls(sq, bx, k) {
    const top = [], bot = [];
    for (let x = GX0; x <= GX1 + 0.1; x += 14) {
      const pinchA = 22 * k * Math.exp(-Math.pow((x - sq) / 30, 2)), bulge = 7 * Math.exp(-Math.pow((x - bx) / 46, 2));
      top.push([x, -38 + pinchA - bulge]); bot.push([x, 38 - pinchA + bulge]);
    }
    const f = pts => pts.map(p => p[0] + ',' + p[1].toFixed(1)).join('L');
    wallT.setAttribute('d', 'M' + f(top)); wallB.setAttribute('d', 'M' + f(bot));
    lumen.setAttribute('d', 'M' + f(top) + 'L' + f(bot.slice().reverse()) + 'Z');
  }
  gutWalls(GX0 - 100, 712, 0);
  const fibNote = rich(cFib, CXM, 652, ['it adds ', ['bulk', NUT[5].col, 800], ', so food keeps moving'], { size: 26, weight: 600, anchor: 'middle' });

  // water
  const cWat = G(root);
  cardHead(cWat, NUT[6], 'Water', ['about ', ['two-thirds', C.ink, 800], ' of your body']);
  const BODY = 'M-14,-96 L14,-96 C40,-94 62,-86 70,-70 L92,30 Q96,44 84,46 L72,44 L52,-30 L50,20 L46,160 Q44,168 32,168 L14,168 Q6,168 6,158 L4,60 L-4,60 L-6,158 Q-6,168 -14,168 L-32,168 Q-44,168 -46,160 L-50,20 L-52,-30 L-72,44 L-84,46 Q-96,44 -92,30 L-70,-70 C-62,-86 -40,-94 -14,-96 Z';
  const HEAD = 'M0,-162 a32,32 0 1 0 0.1,0 Z';
  const wb = G(cWat); tr(wb, 738, 476, 0.95);
  const wClipId = 'dgDietBody';
  { const cp = E('clipPath', { id: wClipId }, defs()); E('path', { d: BODY }, cp); E('path', { d: HEAD }, cp); }
  E('path', { d: BODY + ' ' + HEAD, fill: 'rgba(76,201,240,0.06)' }, wb);
  const wIn = G(wb, { 'clip-path': `url(#${wClipId})` });
  const wLevel = E('path', { fill: C.water, opacity: 0.75 }, wIn);
  E('path', { d: BODY, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, wb);
  E('path', { d: HEAD, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 4 }, wb);
  const twoThird = G(wb);
  E('line', { x1: 100, y1: -51, x2: 124, y2: -51, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, twoThird);
  E('line', { x1: 112, y1: -51, x2: 112, y2: 168, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, twoThird);
  const solv = G(cWat); tr(solv, 1010, 382);
  E('circle', { r: 50, fill: 'rgba(76,201,240,0.35)', stroke: '#9FD8FF', 'stroke-width': 3 }, solv);
  const sugarCube = G(solv); molGlucose(sugarCube, 22);
  const sr = rng(23), solDots = [];
  for (let k = 0; k < 9; k++) { const a = sr() * TAU, d = 14 + sr() * 26; solDots.push({ el: E('circle', { r: 4, fill: C.glucose }, solv), x: Math.cos(a) * d, y: Math.sin(a) * d, ph: sr() * TAU }); }
  rich(solv, 0, 84, [['solvent', NUT[6].col, 800], ' for reactions'], { size: 26, weight: 600, anchor: 'middle' });
  const stream = G(cWat); tr(stream, 0, 572);
  E('path', { d: 'M890,0 C930,-22 970,22 1010,0 C1050,-22 1090,22 1130,0', fill: 'none', stroke: 'rgba(76,201,240,0.55)', 'stroke-width': 30, 'stroke-linecap': 'round' }, stream);
  const riders = [0, 1, 2].map(k => { const g = G(stream); if (k === 1) molGlucose(g, 11); else E('circle', { r: 8, fill: ball(k ? '#B48CFF' : '#FF8A80', k ? '#7550C4' : '#C0574F') }, g); return g; });
  rich(stream, 1010, 68, [['carries', NUT[6].col, 800], ' substances'], { size: 26, weight: 600, anchor: 'middle' });

  // variety: fibre and water are essential; one food can't fill the plate
  const cVar = G(root);
  const tiles = [[5, 747, 'fibre'], [6, 1023, 'water']].map(([ni, x, nm]) => {
    const g = G(cVar); tr(g, x, 282);
    card(g, -126, -112, 252, 224, { fill: C.card2, stroke: C.line });
    T(g, 0, -72, nm, { size: 32, weight: 700, anchor: 'middle', fill: NUT[ni].col });
    const ic = G(g); tr(ic, -62, -4); icon(ic, NUT[ni].icon, 0.62);
    const zero = G(g);
    const z0 = spark(zero, 12, { seed: ni }); tr(z0, 6, -6); const zx = cross(zero, 11); tr(zx, 6, -6);
    T(zero, 28, 4, '0 energy', { size: 26, weight: 600, fill: C.muted });
    tr(zero, -20, 0);
    const ess = G(g);
    const tk = tick(ess, 13); tr(tk, -54, 58);
    T(ess, -30, 68, 'essential', { size: 28, weight: 700, fill: C.good });
    return { g, zero, ess, z0 };
  });
  const miniPlate = (x, foods) => {
    const g = G(cVar); tr(g, x, 552);
    E('circle', { r: 82, fill: '#E7EEF2', stroke: '#AFC1CC', 'stroke-width': 3 }, g);
    E('circle', { r: 68, fill: '#F3F7F9', stroke: '#C9D6DE', 'stroke-width': 2 }, g);
    foods.forEach(([nm, fx, fy, s]) => { const e = G(g); tr(e, fx, fy); icon(e, nm, s); });
    return g;
  };
  const plA = miniPlate(747, [['apple', 0, 0, 0.62]]);
  const plB = miniPlate(1023, [['bread', -30, -26, 0.4], ['meat', 28, -24, 0.38], ['broccoli', -32, 22, 0.36], ['orange', 2, 34, 0.36], ['milk', 34, 18, 0.34], ['egg', -2, -2, 0.3]]);
  const xA = cross(cVar, 22); tr(xA, 820, 486);
  const tB = tick(cVar, 22); tr(tB, 1096, 486);
  const lblA = T(cVar, 747, 672, 'one food', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const lblB = T(cVar, 1023, 672, 'variety', { size: 26, weight: 700, anchor: 'middle', fill: C.good });

  /* ================= label: food labels list the same nutrients ================= */
  const lab = G(root);
  E('rect', { x: 640, y: 156, width: 490, height: 528, rx: 14, fill: '#FAFAF7', stroke: '#1B1B1B', 'stroke-width': 3 }, lab);
  T(lab, 668, 214, 'Nutrition', { size: 40, weight: 700, fill: '#111111' });
  T(lab, 668, 250, 'wholemeal bread, per 100 g', { size: 24, weight: 500, fill: '#444444', font: FB });
  E('rect', { x: 662, y: 266, width: 446, height: 8, fill: '#111111' }, lab);
  const LROWS = [['Energy', '1000 kJ', null], ['Fat', '2.5 g', 2], ['Carbohydrate', '40 g', 0], ['Fibre', '7.0 g', 5], ['Protein', '10 g', 1], ['Salt', '1.0 g', 4]];
  const lrows = LROWS.map(([nm, val, ni], i) => {
    const y = 318 + i * 62, g = G(lab);
    const hl = E('rect', { x: 656, y: y - 36, width: 458, height: 56, rx: 10, fill: ni === null ? 'rgba(255,228,92,0.3)' : NUT[ni].col, opacity: 0.32 }, g);
    if (ni === null) { const sp = spark(g, 11, { seed: 9 }); tr(sp, 680, y - 9); g.sp = sp; } else E('circle', { cx: 680, cy: y - 9, r: 11, fill: NUT[ni].col, stroke: '#333333', 'stroke-width': 1.5 }, g);
    T(g, 704, y, nm, { size: 30, weight: 700, fill: '#111111' });
    T(g, 1094, y, val, { size: 30, weight: 600, fill: '#111111', anchor: 'end' });
    if (i < LROWS.length - 1) E('line', { x1: 662, x2: 1108, y1: y + 24, y2: y + 24, stroke: '#BBBBBB', 'stroke-width': 2 }, lab);
    return { g, hl, ni };
  });

  /* ================= timing ================= */
  const tBal = at('balanced'), tCrazy = at('crazy');
  const DET = ['carbs', 'protein', 'fats', 'vitamins', 'minerals', 'fibre', 'water'];
  const tIn = id => at(id) - 0.05;
  const nameT = NAME_AT.map(f => mid('crazy', f));
  const landT = nameT.map(x => x + 0.47);
  const tLabel = at('label');
  const LAB_AT = LROWS.map((r, i) => mid('label', 0.26 + i * 0.055));
  // which sector is lifted out of the plate, 0..1
  function lift(i, t) {
    let v = 0;
    if (i < 7) { const a = at(DET[i]) - 0.15, b = i < 6 ? at(DET[i + 1]) - 0.15 : at('variety') - 0.1; v = Math.max(v, win(t, a, i === 2 ? at('vitamins') - 0.15 : b, 0.35)); }
    if (i === 5 || i === 6) v = Math.max(v, win(t, at('variety') - 0.1, mid('variety', 0.5), 0.35));
    lrows.forEach((r, k) => { if (r.ni === i) v = Math.max(v, win(t, LAB_AT[k], LAB_AT[k] + 0.9, 0.25)); });
    return v;
  }

  return t => {
    /* --- the plate --- */
    const pp = P(t, tBal - 0.05, 0.7, pop);
    op(plate, clamp(pp * 2));
    tr(plate, PX, PY, Math.max(0.01, 0.7 + 0.3 * pp));
    const lifts = secs.map((s, i) => lift(i, t)), anyL = Math.max.apply(null, lifts);
    secs.forEach((s, i) => {
      s.line.setAttribute('stroke-dashoffset', (1 - P(t, mid('balanced', 0.66) + i * 0.1, 0.45, linear)).toFixed(4));
      const f = P(t, landT[i], 0.3, linear);
      op(s.fillP, f * 0.92);
      s.line.setAttribute('stroke', f > 0.5 ? '#FFFFFF' : '#9FB3C1');
      const L = lifts[i];
      s.g.setAttribute('transform', `translate(${(Math.cos(s.am) * 26 * L).toFixed(1)} ${(Math.sin(s.am) * 26 * L).toFixed(1)}) scale(${(1 + 0.06 * L).toFixed(3)})`);
      op(s.g, 1 - 0.55 * clamp(anyL - L));
      // the icon flies from its list row to its sector
      const fl = P(t, nameT[i] + 0.02, 0.45);
      if (fl <= 0) op(s.ic, 0);
      else {
        const sx = rows[i].sx - PX, sy = rows[i].y - PY, q = 1 - fl;
        const cx = (sx + s.ix) / 2, cy = Math.min(sy, s.iy) - 120;
        const x = q * q * sx + 2 * q * fl * cx + fl * fl * s.ix, y = q * q * sy + 2 * q * fl * cy + fl * fl * s.iy;
        const land = P(t, landT[i] - 0.05, 0.4, linear);
        tr(s.ic, x, y, 0.8 + 0.2 * fl + 0.2 * Math.sin(Math.PI * land));
        op(s.ic, clamp(fl * 5));
      }
    });
    // showpiece: the plate is complete as water lands
    const rp = P(t, landT[6], 1.0, easeOut);
    op(ring, rp > 0 && rp < 1 ? 1 - rp : 0); attr(ring, 'r', RIM + 40 * rp);

    /* --- balanced --- */
    const aBal = Math.min(P(t, tBal, 0.4, linear), 1 - P(t, tCrazy - 0.3, 0.35, linear));
    op(bal, aBal);
    if (aBal > 0) {
      op(bal.firstChild, P(t, mid('balanced', 0.03), 0.4, linear));
      balRows.forEach((g, i) => { const p = P(t, mid('balanced', [0.2, 0.49][i]), 0.45, easeOut); op(g, p); tr(g, (1 - p) * 20, 0); });
      popIn(seven, t, mid('balanced', 0.86), 800, 540);
    }

    /* --- crazy: the list --- */
    const aList = Math.min(P(t, tCrazy, 0.3, linear), 1 - P(t, at('carbs') - 0.35, 0.35, linear));
    op(list, aList);
    if (aList > 0) {
      rows.forEach((r, i) => {
        const p = P(t, mid('crazy', MN_AT[i]), 0.4, pop);
        op(r.w, clamp(p * 2)); r.w.setAttribute('transform', `translate(${((1 - clamp(p)) * 24).toFixed(1)} 0)`);
        const q = P(t, nameT[i] - 0.05, 0.35, easeOut);
        op(r.nm, q); tr(r.nm, (1 - q) * 18, 0);
      });
    }

    /* --- cards --- */
    op(cardBg, Math.min(P(t, at('carbs') - 0.25, 0.4, linear), 1 - P(t, tLabel - 0.3, 0.4, linear)));
    const show = (el, a, b) => { const v = win(t, a, b, 0.32); op(el, v); if (v > 0) tr(el, 0, (1 - P(t, a, 0.45, easeOut)) * 16); return v; };

    if (show(cCarb, tIn('carbs'), at('protein') - 0.1) > 0) {
      cSpark.upd(t); tr(cSpark, CXM, 395, 0.9 + 0.12 * wave(t, 1.4) * AMP);
      const sp = P(t, mid('carbs', 0.12), 0.5, linear);
      op(cSpark, sp);
      orbit.forEach((o, k) => { const a = k / 5 * TAU + t * 0.9 * AMP, d = 92 + 8 * Math.sin(t * 2 + k); tr(o, CXM + Math.cos(a) * d, 395 + Math.sin(a) * d * 0.62, 0.8 + 0.3 * wave(t, 1.1, k / 5)); op(o, sp * P(t, mid('carbs', 0.2) + k * 0.06, 0.3, linear)); o.upd(t + k); });
      carbFoods.forEach((f, i) => popIn(f.g, t, mid('carbs', carbAt[i]), f.x, f.y));
    }
    if (show(cProt, tIn('protein'), at('fats') - 0.1) > 0) {
      cells.forEach(c => {
        let p = 1;
        if (c.grow) p = P(t, mid('protein', 0.13) + c.c * 0.1, 0.45, pop);
        if (c.gap) p = P(t, mid('protein', 0.25) + (c.c - 1) * 0.18, 0.5, pop);
        op(c.g, clamp(p * 2)); tr(c.g, c.x, c.y, Math.max(0.01, 0.5 + 0.5 * p));
      });
      growArrow.set(P(t, mid('protein', 0.12), 0.8)); op(growArrow, P(t, mid('protein', 0.12), 0.2, linear));
      op(growLab, P(t, mid('protein', 0.16), 0.4, linear));
      op(repLab, P(t, mid('protein', 0.3), 0.4, linear));
      const rs = P(t, mid('protein', 0.36), 0.9, linear); op(repSpark, Math.sin(rs * Math.PI)); tr(repSpark, 885, 408, 0.6 + 0.8 * rs); repSpark.upd(t);
      protFoods.forEach((f, i) => popIn(f.g, t, mid('protein', protAt[i]), f.x, f.y));
    }
    show(cFatH, tIn('fats'), at('vitamins') - 0.1);
    if (show(cFat, tIn('fats'), at('fatok') - 0.05) > 0) {
      badges.forEach((b, i) => popIn(b, t, mid('fats', badgeAt[i]), [712, 885, 1058][i], 382));
      attr(badges[0].lvl, 'width', 48 * P(t, mid('fats', badgeAt[0]) + 0.3, 1.2));
      fatFoods.forEach((f, i) => popIn(f.g, t, mid('fats', fatAt[i]), f.x, f.y));
    }
    if (show(cOk, at('fatok') - 0.05, at('vitamins') - 0.1) > 0) {
      popIn(sign, t, at('fatok'), CXM, 338);
      signStrike.set(P(t, mid('fatok', 0.16), 0.5));
      const sa = P(t, mid('fatok', 0.4), 0.45, linear);
      op(scl, sa);
      const tilt = -15 * P(t, mid('fatok', 0.6), 0.9, easeOut) + (R ? 0 : 1.2 * Math.sin(t * 3) * P(t, mid('fatok', 0.6) + 0.9, 0.3, linear));
      scl.set(tilt);
      outLoad.sp.upd(t);
      const c = Math.cos(tilt * Math.PI / 180), s = Math.sin(tilt * Math.PI / 180);
      tr(lblIn, CXM - 150 * c * 0.86, 452 - 150 * s * 0.86 + 128); tr(lblOut, CXM + 150 * c * 0.86, 452 + 150 * s * 0.86 + 128);
      op(lblIn, sa); op(lblOut, sa);
    }
    if (show(cVit, tIn('vitamins'), at('minerals') - 0.1) > 0) {
      popIn(pinch, t, mid('vitamins', 0.18), 760, 392);
      grains.forEach((e, k) => op(e, 0.5 + 0.5 * wave(t, 0.9, k / 3)));
      const gp = popIn(gears, t, mid('vitamins', 0.36), 1010, 392);
      const rot = (t - mid('vitamins', 0.36)) * 60 * AMP * clamp(gp);
      tr(g1, -14, 6, 1, rot); tr(g2, 44, -34, 1, -rot * 40 / 28 + 20);
      popIn(vitC, t, mid('vitamins', 0.62), 724, 582);
      vitFoods.forEach((f, i) => popIn(f.g, t, mid('vitamins', [0.76, 0.87][i]), f.x, f.y));
    }
    if (show(cMin, tIn('minerals'), at('fibre') - 0.1) > 0) {
      [[mIron, 0.36, 0.447, 0.51, 0.53], [mCal, 0.726, 0.815, 0.876, 0.9]].forEach(([m, a, b, c, d]) => {
        op(m.ch, P(t, mid('minerals', a), 0.35, linear));
        op(m.src, P(t, mid('minerals', b), 0.35, linear));
        m.ar.set(P(t, mid('minerals', c), 0.4)); op(m.ar, P(t, mid('minerals', c), 0.15, linear));
        const tp = P(t, mid('minerals', c) + 0.2, 0.5, pop); op(m.tg, clamp(tp * 2));
        op(m.lb, P(t, mid('minerals', d), 0.4, linear));
      });
    }
    if (show(cFib, tIn('fibre'), at('water') - 0.1) > 0) {
      fibFoods.forEach((f, i) => popIn(f.g, t, mid('fibre', fibAt[i]), f.x, f.y));
      op(fibFn, P(t, mid('fibre', 0.4), 0.4, linear));
      const ga = P(t, mid('fibre', 0.6), 0.4, linear);
      op(gut, ga);
      if (ga > 0) {
        const u = P(t, mid('fibre', 0.68), (at('water') - mid('fibre', 0.68)) * 0.85, linear);
        const bx = lerp(712, 1062, ease(u));
        tr(bolus, bx, 0, 1, Math.sin(t * 3) * 3 * AMP);
        gutWalls(bx - 70, bx, P(t, mid('fibre', 0.66), 0.4, linear));
      }
      op(fibNote, P(t, mid('fibre', 0.72), 0.4, linear));
    }
    if (show(cWat, tIn('water'), at('variety') - 0.1) > 0) {
      const lv = P(t, mid('water', 0.1), 1.6, easeOut) * 0.667;
      const top = 168 - 328 * lv, wv = [];
      for (let x = -100; x <= 100; x += 20) wv.push([x, top + Math.sin(x * 0.06 + t * 3) * 4 * AMP]);
      wLevel.setAttribute('d', 'M' + wv.map(p => p[0] + ',' + p[1].toFixed(1)).join('L') + 'L100,180 L-100,180 Z');
      op(twoThird, P(t, mid('water', 0.28), 0.4, linear));
      const sv = P(t, mid('water', 0.4), 0.4, linear); op(solv, sv);
      const dis = P(t, mid('water', 0.46), 1.6, linear);
      tr(sugarCube, 0, 0, Math.max(0.01, 1 - dis), t * 20);
      op(sugarCube, 1 - dis);
      solDots.forEach(d => { tr(d.el, d.x * dis + Math.sin(t * 2 + d.ph) * 3, d.y * dis + Math.cos(t * 2 + d.ph) * 3); op(d.el, clamp(dis * 3)); });
      const st = P(t, mid('water', 0.72), 0.4, linear); op(stream, st);
      riders.forEach((g, k) => { const u = ((t * 0.32 + k / 3) % 1); tr(g, 900 + u * 220, Math.sin((900 + u * 220) * 0.0785 + 1.3) * -11); op(g, Math.min(1, u * 8, (1 - u) * 8)); });
    }
    if (show(cVar, at('variety') - 0.05, tLabel - 0.2) > 0) {
      tiles.forEach((tl, i) => {
        popIn(tl.g, t, mid('variety', 0.02 + i * 0.08), [747, 1023][i], 282);
        op(tl.zero, P(t, mid('variety', 0.18 + i * 0.03), 0.35, linear)); tl.z0.upd(t);
        const e = P(t, mid('variety', 0.36 + i * 0.04), 0.45, pop); op(tl.ess, clamp(e * 2));
      });
      popIn(plA, t, mid('variety', 0.53), 747, 552);
      const xa = P(t, mid('variety', 0.7), 0.4, pop); op(xA, clamp(xa * 2)); tr(xA, 820, 486, Math.max(0.01, xa));
      op(lblA, P(t, mid('variety', 0.56), 0.4, linear));
      popIn(plB, t, mid('variety', 0.8), 1023, 552);
      const tb = P(t, mid('variety', 0.88), 0.4, pop); op(tB, clamp(tb * 2)); tr(tB, 1096, 486, Math.max(0.01, tb));
      op(lblB, P(t, mid('variety', 0.84), 0.4, linear));
    }
    const la = P(t, tLabel - 0.15, 0.5, easeOut);
    op(lab, clamp(la * 1.5));
    if (la > 0) {
      tr(lab, (1 - la) * 80, 0);
      lrows.forEach((r, i) => { op(r.hl, 0.32 * P(t, LAB_AT[i], 0.3, linear) + 0.4 * win(t, LAB_AT[i], LAB_AT[i] + 0.7, 0.2)); if (r.g.sp) r.g.sp.upd(t); });
    }
  };
});

/* Recap: a padlock snaps shut -> four tall memory-hook cards slide in one at a time: the mini
   ladder with Please Stop Calling Me A Zebra..., the pH tower with Red Bottoms / Blue Roofs, the POP
   burst and a milky tube (Pop = Hydrogen, Milky = CO2), and the ACID + BASE -> SALT + WATER boxes
   -> the cards stack away for "5 exam traps": metals give hydrogen (carbonates give CO2),
   neutralisation always makes water, not all bases are alkalis (copper oxide outside the circle),
   concentration is not strength, and copper, silver and gold sit below the hydrogen line. */
scene('recap', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join(''); };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);
  /* fade a group in at t0 while it rises 14 px into place */
  const rise = (el, t, t0) => { op(el, fade(t, t0, 0.35)); tr(el, 0, (1 - P(t, t0, 0.45, easeOut)) * 14); };
  const popAt = (el, t, t0, x, y, s0, k) => {
    s0 = s0 === undefined ? 0.8 : s0; const p = P(t, t0, 0.45, pop);
    op(el, clamp(p * 2) * (k === undefined ? 1 : k)); if (p > 0) tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p));
    return p;
  };
  const INK_DARK = '#13232E', H_FILL = '#123544';
  const RED = '#E8424F', REDT = '#FF6B76', BLUE = '#3F8FE8', BLUET = '#6FA8FF', GREEN = C.good;
  const PHC = i => (i <= 2 ? '#E8424F' : i <= 4 ? '#FF8A3D' : i <= 6 ? '#FFD84D' : i === 7 ? '#56D69B' : i <= 11 ? '#3F8FE8' : '#8E5CF0');
  const MET = [
    { s: 'K', c: '#D8DEE6', w: 'Please' }, { s: 'Na', c: '#D8DEE6', w: 'Stop' }, { s: 'Ca', c: '#E4E0D4', w: 'Calling' }, { s: 'Mg', c: '#E3E8EE', w: 'Me' },
    { s: 'Al', c: '#C7D0DA', w: 'A' }, { s: 'Zn', c: '#A9B6C4', w: 'Zebra' }, { s: 'Fe', c: '#7A8590', w: 'Instead' }, { s: 'H', c: C.air, hyd: true },
    { s: 'Cu', c: '#D9824B', w: 'Call' }, { s: 'Ag', c: '#E8ECF0', w: 'Some' }, { s: 'Au', c: '#F5C542', w: 'Gold' },
  ];
  /* a mini-ladder rung (symbol only), w x h; halo: whether it can glow */
  function rung(parent, m, w, h, halo) {
    const g = G(parent);
    g.halo = halo ? E('ellipse', { rx: w * 0.82, ry: h * 0.85, fill: glow(C.energy) }, g) : null;
    if (m.hyd) {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: H_FILL, stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' }, g);
      T(g, 0, 9, 'H', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
    } else {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: ball(m.c, mix(m.c, '#000000', 0.42)), stroke: mix(m.c, '#FFFFFF', 0.45), 'stroke-width': 2 }, g);
      T(g, 0, 9, m.s, { size: 26, weight: 700, anchor: 'middle', fill: INK_DARK });
    }
    if (g.halo) op(g.halo, 0);
    return g;
  }
  /* the POP burst: an 8-point star with radial lines */
  function popBurst(parent, r) {
    const g = G(parent);
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; E('line', { x1: Math.cos(a) * r * 1.08, y1: Math.sin(a) * r * 1.08, x2: Math.cos(a) * r * 1.32, y2: Math.sin(a) * r * 1.32, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
    let d = ''; for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? r * 0.64 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.heat, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    T(g, 0, r * 0.24, 'POP!', { size: Math.round(r * 0.66), weight: 700, anchor: 'middle', fill: '#7A2E00' });
    return g;
  }
  /* a lit splint pointing down-left to its burning tip at (0,0) */
  function splint(parent, len) {
    const g = G(parent);
    E('rect', { x: -5, y: -len, width: 10, height: len, rx: 4, fill: '#C8A165', stroke: '#E2C48F', 'stroke-width': 1.5 }, g);
    E('circle', { cy: -6, r: 26, fill: glow('#FFB347') }, g);
    g.flame = E('path', { d: 'M0,4 C-12,-4 -10,-22 0,-38 C10,-22 12,-4 0,4 Z', fill: '#FF9A3D' }, g);
    E('path', { d: 'M0,2 C-5,-4 -5,-14 0,-24 C5,-14 5,-4 0,2 Z', fill: '#FFE07A' }, g);
    return g;
  }
  function ionH(parent) {
    const g = G(parent);
    tr(atom(g, 'H', 15, { letter: true }), 0, 0);
    const b = G(g); tr(b, 13, -13); E('circle', { r: 8, fill: RED, stroke: '#FFC2C7', 'stroke-width': 1.5 }, b);
    E('path', { d: 'M-4,0 L4,0 M0,-4 L0,4', stroke: '#FFFFFF', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, b);
    return g;
  }
  function ionOH(parent) {
    const g = G(parent);
    tr(atom(g, 'H', 10), 15, -9);
    tr(atom(g, 'O', 16, { letter: true }), 0, 0);
    const b = G(g); tr(b, -14, -14); E('circle', { r: 8, fill: BLUE, stroke: '#BFDBFE', 'stroke-width': 1.5 }, b);
    E('line', { x1: -4, x2: 4, y1: 0, y2: 0, stroke: '#FFFFFF', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, b);
    return g;
  }

  /* ================= padlock ================= */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 226, 'Memory hooks', { size: 56, weight: 700, anchor: 'middle' });
  const header = G(root);
  const miniLock = G(header); tr(miniLock, 1142, 58, 0.24);
  E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, miniLock);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, miniLock);
  T(header, 1108, 82, 'Memory hooks', { size: 32, weight: 700, anchor: 'end', fill: C.muted });

  /* ================= memory-hook cards: four tall cards in a row ================= */
  const hooks = G(root);
  const CW = 262, CHT = 580, CY = 118, CX = [40, 326, 612, 898];
  const cards = CX.map(x => { const g = G(hooks); tr(g, x, CY); g.box = card(g, 0, 0, CW, CHT, { fill: C.card, stroke: C.line }); return g; });
  const HOOKS = ['zebra', 'roofs', 'pop', 'absw'];

  // 1. the reactivity series: mini ladder + mnemonic
  const c1 = cards[0];
  const c1Title = T(c1, CW / 2, 52, 'Reactivity series', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const ladder1 = MET.map((m, j) => {
    const g = rung(c1, m, 60, 30, j === 0 || j === 10); tr(g, 52, 96 + 38 * j);
    const w = m.w ? rich(c1, 94, 96 + 38 * j + 10, [[m.w[0], C.energy, 800], [m.w.slice(1), C.ink, 700]], { size: 28 }) : null;
    return { g, w, m, j };
  });
  const c1Arrow = arrow(c1, 234, 90, 234, 486, { color: C.energy, width: 5 });
  const WT = [0.005, 0.047, 0.106, 0.167, 0.197, 0.226, 0.285, 0.315, 0.345, 0.383, 0.42];
  T(c1, CW / 2, 540, 'most → least reactive', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  // 2. Red Bottoms, Blue Roofs: the pH tower with litmus strips
  const c2 = cards[1];
  const c2t1 = rich(c2, CW / 2, 52, [['Red', REDT, 800], [' Bottoms,', C.ink, 700]], { size: 32, anchor: 'middle' });
  const c2t2 = rich(c2, CW / 2, 92, [['Blue', BLUET, 800], [' Roofs', C.ink, 700]], { size: 32, anchor: 'middle' });
  const TX0 = 66, TB = 476, TCH = 22;                    // tower left, bottom, cell height
  const tower = G(c2);
  const cells = []; for (let i = 0; i < 15; i++) cells.push(E('rect', { x: TX0, y: TB - (i + 1) * TCH, width: 52, height: TCH - 2, rx: 4, fill: PHC(i) }, tower));
  E('path', { d: `M${TX0 - 8},${TB - 15 * TCH} L${TX0 + 26},${TB - 15 * TCH - 30} L${TX0 + 60},${TB - 15 * TCH} Z`, fill: '#8E5CF0', stroke: '#C9B3FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, tower);
  [[0, '0'], [7, '7'], [14, '14']].forEach(([i, s]) => T(tower, TX0 - 10, TB - (i + 0.5) * TCH + 8, s, { size: 24, weight: 700, anchor: 'end', fill: C.muted }));
  const glowBot = E('rect', { x: TX0 - 6, y: TB - 3 * TCH - 4, width: 64, height: 3 * TCH + 8, rx: 8, fill: 'none', stroke: REDT, 'stroke-width': 4 }, tower);
  const glowTop = E('rect', { x: TX0 - 6, y: TB - 15 * TCH - 4, width: 64, height: 3 * TCH + 8, rx: 8, fill: 'none', stroke: BLUET, 'stroke-width': 4 }, tower);
  function litmus(parent, color) {
    const g = G(parent);
    E('rect', { x: -11, y: -40, width: 22, height: 80, rx: 3, fill: color }, g);
    E('rect', { x: -11, y: -40, width: 22, height: 18, rx: 3, fill: mix(color, '#FFFFFF', 0.45) }, g);
    return g;
  }
  const stripR = litmus(c2, RED), stripB = litmus(c2, BLUE);
  const labAcid = T(c2, 182, TB - 1.5 * TCH + 9, 'acid', { size: 26, weight: 700, fill: REDT });
  const labAlk = T(c2, 182, TB - 13.5 * TCH + 9, 'alkali', { size: 26, weight: 700, fill: BLUET });
  T(c2, CW / 2, 540, 'litmus paper', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  // 3. Pop = Hydrogen, Milky = CO2
  const c3 = cards[2];
  const burst = popBurst(c3, 50);
  const tubeH = testTube(c3, 46, 130, { level: 0.45, liquid: '#CFE7F5' }); tr(tubeH, 104, 232); tubeH.liquid.setAttribute('opacity', 0.3);
  const spl = splint(c3, 110); tr(spl, 112, 170, 1, 70);
  const bubH = bubbles(c3, 90, 238, 28, 50, { n: 5, r: 4, seed: 3, speed: 0.9 });
  const c3a = rich(c3, CW / 2, 352, [['Pop', C.energy, 800], [' = ', C.muted], ['Hydrogen', C.ink, 800]], { size: 32, anchor: 'middle' });
  const tubeL = testTube(c3, 46, 130, { level: 0.6, liquid: '#CFE7F5' }); tr(tubeL, CW / 2, 452);
  const bubL = bubbles(c3, CW / 2 - 14, 450, 28, 66, { n: 6, r: 4.5, seed: 8, speed: 0.6 });
  const c3b = rich(c3, CW / 2, 556, [['Milky', '#F4F7FA', 800], [' = ', C.muted], ['CO₂', C.co2, 800]], { size: 32, anchor: 'middle' });

  // 4. A-B-S-W: acid + base -> salt + water
  const c4 = cards[3];
  T(c4, CW / 2, 52, 'Neutralisation', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const BOX = [['A', 'CID', RED, REDT], ['B', 'ASE', BLUE, BLUET], ['S', 'ALT', GREEN, GREEN], ['W', 'ATER', C.water, C.water]];
  const BY = [134, 246, 358, 470];
  const boxes = BOX.map(([L, rest, col, tcol], k) => {
    const g = G(c4); tr(g, CW / 2, BY[k]);
    g.rect = E('rect', { x: -98, y: -34, width: 196, height: 68, rx: 16, fill: mix(col, C.card, 0.78), stroke: col, 'stroke-width': 3 }, g);
    g.halo = E('rect', { x: -110, y: -46, width: 220, height: 92, rx: 24, fill: glow(col) }, g); g.insertBefore(g.halo, g.firstChild); op(g.halo, 0);
    const tx = E('text', { x: 0, y: 14, 'text-anchor': 'middle', 'font-family': FD, 'font-weight': 800, fill: tcol }, g);
    const a = E('tspan', { 'font-size': 46 }, tx); a.textContent = L;
    g.rest = E('tspan', { 'font-size': 32, 'font-weight': 700 }, tx); g.rest.textContent = rest;
    return g;
  });
  const OPS = [['+', 190], ['↓', 302], ['+', 414]].map(([s, y]) => {
    const g = G(c4);
    if (s === '↓') arrow(g, CW / 2, y - 18, CW / 2, y + 18, { color: C.ink, width: 5, head: 15 });
    else T(g, CW / 2, y + 14, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
    return g;
  });

  /* ================= five exam traps ================= */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-28 L30,24 L-30,24 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(78 160)' }, head);
  T(head, 78, 180, '!', { size: 36, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 120, 176, '5 exam traps', { size: 36, weight: 700 });
  const SLOT = ['metal + acid', 'always water', 'bases ≠ alkalis', 'concentration', 'Cu, Ag, Au'];
  const slots = SLOT.map((nm, i) => {
    const g = G(traps), y = 256 + 88 * i;
    const box = E('rect', { x: 46, y: y - 32, width: 292, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 82, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 82, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 116, y + 9, nm, { size: 25, weight: 600 });
    const tk = tick(g, 11); tr(tk, 82, y + 1); tk.firstChild.setAttribute('stroke', C.bg0);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 118, 790, 584, { fill: C.card, stroke: C.line });
  const FX = 765;                                    // focus card centre x
  const hint = T(focus, FX, 420, 'Spot the trap, then fix it', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const TG = [0, 1, 2, 3, 4].map(() => G(focus));

  // trap 1: metals give hydrogen; only carbonates give carbon dioxide
  const g1 = TG[0];
  const t1ok = G(g1); tr(tick(t1ok, 16), 414, 190);
  rich(t1ok, 446, 202, [['acid + metal → ', C.ink, 700], ['hydrogen', '#FFFFFF', 800]], { size: 36 });
  const t1no = G(g1); tr(cross(t1no, 12), 414, 258);
  T(t1no, 446, 268, 'acid + metal → carbon dioxide', { size: 30, weight: 600, fill: C.muted });
  const t1sx = 446 + textWidth('acid + metal → ', 30, FD, 600);
  const t1strike = strike(t1no, t1sx - 4, 258, t1sx + textWidth('carbon dioxide', 30, FD, 600) + 4, C.bad);
  function fizzTube(parent, x, y, lump) {
    const g = G(parent);
    const tb = testTube(g, 60, 190, { level: 0.55, liquid: '#CFE7F5' }); tr(tb, x, y); tb.liquid.setAttribute('opacity', 0.32);
    if (lump === 'mg') { const pts = []; for (let i = 0; i <= 40; i++) { const th = i / 40 * 3.2 * Math.PI; pts.push([x - 20 + 4.2 * th - 9 * Math.sin(th), y + 70 - 8 * Math.cos(th)]); } const d = openPath(pts); E('path', { d, fill: 'none', stroke: '#7D8894', 'stroke-width': 8, 'stroke-linecap': 'round' }, g); E('path', { d, fill: 'none', stroke: '#E8EDF2', 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
    else E('path', { d: closedPath(blobPts(17, 12, 8, 0, 0.18, 6)), fill: ball('#F2F0EA', '#A8A396'), stroke: '#FFFFFF', 'stroke-width': 1.5, transform: `translate(${x} ${y + 72})` }, g);
    g.bub = bubbles(g, x - 18, y - 10, 36, 76, { n: 7, r: 4.5, seed: lump === 'mg' ? 4 : 9, speed: 0.9 });
    return g;
  }
  const t1L = fizzTube(g1, 560, 500, 'mg'), t1R = fizzTube(g1, 970, 500, 'co3');
  const t1pop = popBurst(g1, 40);
  const t1co2 = [0, 1, 2].map(() => molCO2(g1, 9));
  const t1labL = rich(g1, 560, 650, [['metal', C.ink, 700], [' → ', C.muted], ['hydrogen', '#FFFFFF', 800]], { size: 28, anchor: 'middle' });
  const t1labR = rich(g1, 970, 650, [['carbonate', C.ink, 700], [' → ', C.muted], ['CO₂', C.co2, 800]], { size: 28, anchor: 'middle' });
  const t1chip = chip(g1, 'only carbonates', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(t1chip, 970, 330);

  // trap 2: neutralisation always makes water
  const g2 = TG[1];
  rich(g2, FX, 202, [['neutralisation ', C.ink, 700], ['always', C.energy, 800], [' makes ', C.ink, 700], ['water', C.water, 800]], { size: 38, anchor: 'middle' });
  const EQ2 = [['ACID', RED, '#FFFFFF'], '+', ['BASE', BLUE, '#FFFFFF'], '>', ['SALT', GREEN, INK_DARK], '+', ['WATER', C.water, INK_DARK]];
  const eq2 = []; { let tot = 0; const parts = EQ2.map(it => { const g = G(g2); let w; if (it === '+') { T(g, 0, 14, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted }); w = 34; } else if (it === '>') { arrow(g, -26, 0, 26, 0, { color: C.ink, width: 6 }); w = 62; } else { const c = chip(g, it[0], { size: 32, fill: it[1], color: it[2], rx: 14 }); w = c.w; g.halo = E('ellipse', { rx: c.w * 0.75, ry: 52, fill: glow(it[1]) }, g); g.insertBefore(g.halo, g.firstChild); op(g.halo, 0); } return { g, w, it }; }); parts.forEach((p, i) => { tot += p.w + (i ? 14 : 0); }); let x = FX - tot / 2; parts.forEach((p, i) => { if (i) x += 14; p.x = x + p.w / 2; x += p.w; tr(p.g, p.x, 316); eq2.push(p); }); }
  const h2 = ionH(g2), oh2 = ionOH(g2), w2 = molH2O(g2, 28);
  tr(h2, 560, 508); tr(oh2, 740, 508);
  const w2flash = E('circle', { r: 60, fill: glow(C.energyLt) }, g2);
  const t2labs = G(g2);
  T(t2labs, 560, 590, 'H⁺', { size: 30, weight: 700, anchor: 'middle', fill: REDT });
  T(t2labs, 650, 520, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted });
  T(t2labs, 740, 590, 'OH⁻', { size: 30, weight: 700, anchor: 'middle', fill: BLUET });
  arrow(t2labs, 820, 508, 890, 508, { color: C.ink, width: 6 });
  T(t2labs, 990, 590, 'H₂O', { size: 30, weight: 700, anchor: 'middle', fill: C.water });
  T(t2labs, 765, 650, 'from the acid  +  from the base  →  water', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  // trap 3: not all bases are alkalis (Venn)
  const g3 = TG[2];
  rich(g3, FX, 196, [['not all ', C.ink, 700], ['bases', BLUET, 800], [' are ', C.ink, 700], ['alkalis', '#A9CCFF', 800]], { size: 36, anchor: 'middle' });
  const t3b = rich(g3, FX, 244, [['only ', C.ink, 700], ['soluble', C.energy, 800], [' bases are', C.ink, 700]], { size: 32, anchor: 'middle' });
  const VX = 750, VY = 480, VR = 212, IX = VX + 76, IY = VY + 26, IR = 108;
  const vBig = E('circle', { cx: VX, cy: VY, r: VR, fill: 'rgba(63,143,232,0.12)', stroke: BLUE, 'stroke-width': 5 }, g3);
  const vBigLab = T(g3, VX - 60, VY - 158, 'BASES', { size: 32, weight: 700, anchor: 'middle', fill: BLUET });
  const vIn = G(g3);
  E('circle', { cx: IX, cy: IY, r: IR, fill: 'rgba(169,204,255,0.18)', stroke: '#A9CCFF', 'stroke-width': 4 }, vIn);
  T(vIn, IX, IY - 52, 'ALKALIS', { size: 28, weight: 700, anchor: 'middle', fill: '#CFE1FF' });
  T(vIn, IX, IY - 24, '(soluble bases)', { size: 24, weight: 600, anchor: 'middle', fill: '#CFE1FF', font: FB });
  const naoh = G(vIn); tr(naoh, IX, IY + 8);
  [[-22, 4], [-6, -6], [10, 4], [24, -4], [-12, 12], [6, 12]].forEach(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 9, ry: 6, fill: ball('#FFFFFF', '#B9C4CE') }, naoh));
  T(vIn, IX, IY + 44, 'sodium\nhydroxide', { size: 24, weight: 600, anchor: 'middle', fill: C.ink, font: FB, lh: 26 });
  const cuo = G(g3);
  E('path', { d: 'M-52,18 Q-30,-22 0,-24 Q30,-22 52,18 Z', fill: '#1E2328', stroke: '#4A525A', 'stroke-width': 2 }, cuo);
  const cr = rng(13); for (let k = 0; k < 4; k++) E('circle', { cx: (-38 + cr() * 76).toFixed(1), cy: (14 - cr() * 26).toFixed(1), r: (1.5 + cr() * 2).toFixed(1), fill: '#3A4148' }, cuo);
  T(cuo, 0, 50, 'copper oxide', { size: 24, weight: 600, anchor: 'middle', fill: C.ink, font: FB });
  const cuoX = T(cuo, 0, 78, 'insoluble', { size: 24, weight: 700, anchor: 'middle', fill: REDT, font: FB });

  // trap 4: concentration is not strength
  const g4 = TG[3];
  rich(g4, FX, 202, [['concentration', C.energy, 800], ['  ≠  ', C.muted, 700], ['strength', C.energy, 800]], { size: 40, anchor: 'middle' });
  function acidBeaker(parent, x, y, nJoined, nSplit, seed) {
    const g = G(parent);
    const bk = beaker(g, 230, 240, { level: 0.82, liquid: C.water, opacity: 0.22, marks: false }); tr(bk, x, y);
    const r = rng(seed), ps = [];
    const box = [x - 92, y - 54, 184, 158];             // the liquid inside
    const bnc = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
    const drift = (q, t) => [bnc(q.x0 + q.vx * t * 9 * calm, box[0] + 12, box[0] + box[2] - 12), bnc(q.y0 + q.vy * t * 9 * calm, box[1] + 12, box[1] + box[3] - 12)];
    const seedPt = () => ({ x0: box[0] + 12 + r() * (box[2] - 24), y0: box[1] + 12 + r() * (box[3] - 24), vx: (r() - 0.5) * 2, vy: (r() - 0.5) * 2 });
    for (let k = 0; k < nJoined + nSplit; k++) {
      const split = k >= nJoined, pg = G(g);
      E('circle', { r: 9, fill: ball('#FF6B6B', '#B5372D') }, pg);
      const h = atom(split ? g : pg, 'H', 6.5);         // a split-off H+ drifts on its own
      ps.push({ pg, h, split, a: seedPt(), b: seedPt() });
    }
    g.upd = t => ps.forEach(p => {
      const [x, y] = drift(p.a, t); tr(p.pg, x, y);
      if (p.split) { const [hx, hy] = drift(p.b, t); tr(p.h, hx, hy); } else tr(p.h, 9, -6);
    });
    return g;
  }
  const bDS = acidBeaker(g4, 585, 470, 0, 5, 31), bCW = acidBeaker(g4, 945, 470, 14, 2, 37);
  const t4labL = T(g4, 585, 632, 'dilute strong', { size: 30, weight: 700, anchor: 'middle' });
  const t4labR = T(g4, 945, 632, 'concentrated weak', { size: 30, weight: 700, anchor: 'middle' });
  const t4noteL = T(g4, 585, 668, 'few particles, all split', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const t4noteR = T(g4, 945, 668, 'crowded, few split', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const safeChip = chip(g4, 'can be safer', { size: 30, fill: GREEN, color: INK_DARK });

  // trap 5: copper, silver and gold sit below hydrogen
  const g5 = TG[4];
  rich(g5, FX, 196, [['Cu, Ag, Au ', C.ink, 800], ['don’t fizz', C.energy, 800], [' with dilute acids', C.ink, 700]], { size: 34, anchor: 'middle' });
  const L5X = 470, L5Y = j => 240 + 40 * j;
  const ladder5 = MET.map((m, j) => { const g = rung(g5, m, 72, 34, j >= 8); tr(g, L5X, L5Y(j)); return g; });
  const hLine = E('line', { x1: L5X + 40, y1: L5Y(7), x2: L5X + 40, y2: L5Y(7), stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, g5);
  const hLab = T(g5, 1130, L5Y(7) + 42, 'below\nhydrogen', { size: 30, weight: 700, anchor: 'end', fill: C.air, lh: 34 });
  const TUX = [640, 760, 880];
  const still = TUX.map((x, k) => {
    const g = G(g5);
    const tb = testTube(g, 50, 120, { level: 0.6, liquid: '#CFE7F5' }); tr(tb, x, 600); tb.liquid.setAttribute('opacity', 0.32);
    if (k === 0) E('rect', { x: x - 6, y: 600, width: 12, height: 46, rx: 3, fill: ball('#E89B63', '#9C4F22') }, g);
    if (k === 1) E('rect', { x: x - 14, y: 628, width: 28, height: 14, rx: 4, fill: ball('#F2F5F8', '#9AA6B2') }, g);
    if (k === 2) E('path', { d: closedPath(blobPts(13, 9, 8, 0, 0.2, 3)), fill: ball('#FFE07A', '#B8860B'), stroke: '#FFF0B0', 'stroke-width': 1.5, transform: `translate(${x} 634)` }, g);
    T(g, x, 686, ['Cu', 'Ag', 'Au'][k], { size: 28, weight: 700, anchor: 'middle', fill: ['#F0A070', '#E8ECF0', '#F5C542'][k] });
    const x_ = cross(g, 12); tr(x_, x + 44, 556);
    return { g, x_ };
  });

  /* ================= update ================= */
  const TRAPAT = ['t1', 't2', 't3', 't4', 't5'];
  return t => {
    t = Math.min(t, S.D);
    /* padlock: the shackle drops shut, a ring pulses, then it shrinks into the header */
    const la = win(t, S.first - 0.5, at('zebra') + 0.15, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.42), 0.3, easeIn);
      tr(shackle, 0, -30 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.42) - 0.3) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.1 * P(t, at('zebra') - 0.3, 0.45));
    }
    op(header, fade(t, at('zebra') - 0.05, 0.4) * (1 - P(t, at('traps') - 0.2, 0.4, linear)));

    /* memory hooks */
    const out = P(t, at('traps') - 0.25, 0.6);
    op(hooks, 1 - out);
    if (out < 1) {
      hooks.setAttribute('transform', `translate(600 410) scale(${(1 - 0.2 * out).toFixed(3)}) translate(-600 -410)`);
      cards.forEach((g, k) => {
        const p = P(t, at(HOOKS[k]) - 0.12, 0.55, pop);
        op(g, clamp(p * 2)); tr(g, CX[k], CY + (1 - clamp(p)) * 30);
        const active = t >= at(HOOKS[k]) - 0.1 && (k === 3 || t < at(HOOKS[k + 1]) - 0.1) && t < at('traps') - 0.1;
        g.box.setAttribute('stroke', active ? C.energy : C.line); g.box.setAttribute('stroke-width', active ? 3.5 : 2);
      });
      // 1: rungs and words arrive as the mnemonic is spoken
      ladder1.forEach(r => {
        const p = P(t, mid('zebra', WT[r.j]) - 0.06, 0.4, pop);
        op(r.g, clamp(p * 2)); tr(r.g, 52, 96 + 38 * r.j, Math.max(0.01, 0.7 + 0.3 * p));
        if (r.w) { op(r.w, fade(t, mid('zebra', WT[r.j]) - 0.06, 0.3)); tr(r.w, (1 - P(t, mid('zebra', WT[r.j]) - 0.06, 0.4, easeOut)) * 16, 0); }
        const h = r.j === 0 ? win(t, mid('zebra', 0.76), at('roofs'), 0.3) : r.j === 10 ? win(t, mid('zebra', 0.89), at('roofs'), 0.3) : 0;
        if (r.g.halo) op(r.g.halo, h);
      });
      op(c1Title, fade(t, mid('zebra', 0.55)));
      c1Arrow.set(P(t, mid('zebra', 0.76), 1.2)); op(c1Arrow, fade(t, mid('zebra', 0.76), 0.2));
      // 2: the tower builds; the red strip slides to the bottom, the blue strip to the roof
      op(c2t1, fade(t, at('roofs') - 0.05)); op(c2t2, fade(t, mid('roofs', 0.19)));
      cells.forEach((c, i) => op(c, fade(t, at('roofs') - 0.1 + i * 0.03, 0.25)));
      const sr = P(t, mid('roofs', 0.03), 0.7, easeOut), sb = P(t, mid('roofs', 0.21), 0.7, easeOut);
      op(stripR, fade(t, mid('roofs', 0.03), 0.3)); tr(stripR, 160, lerp(TB - 9 * TCH, TB - 40, sr));
      op(stripB, fade(t, mid('roofs', 0.21), 0.3)); tr(stripB, 160, lerp(TB - 6 * TCH, TB - 15 * TCH + 40, sb));
      op(labAcid, fade(t, mid('roofs', 0.55))); op(labAlk, fade(t, mid('roofs', 0.77)));
      op(glowBot, win(t, mid('roofs', 0.55), at('pop'), 0.3) * (0.6 + 0.4 * wave(t, 1))); op(glowTop, win(t, mid('roofs', 0.77), at('pop'), 0.3) * (0.6 + 0.4 * wave(t, 1)));
      // 3: POP, then the limewater turns milky
      const bp = P(t, mid('pop', 0.08), 0.5, pop);
      op(burst, clamp(bp * 2)); tr(burst, CW / 2 + 6, 90, Math.max(0.01, 0.4 + 0.6 * bp), (1 - clamp(bp)) * -20);
      bubH.upd(t * calm, 0.8);
      op(spl.flame, 0.85 + 0.15 * wave(t, 0.3));
      op(c3a, fade(t, mid('pop', 0.12)));
      const mk = P(t, mid('pop', 0.5), 1.1);
      bubL.upd(t * calm, fade(t, mid('pop', 0.42), 0.3));
      tubeL.set(0.6, mix('#CFE7F5', '#EEF3F6', mk)); tubeL.liquid.setAttribute('opacity', lerp(0.28, 0.9, mk).toFixed(3));
      op(c3b, fade(t, mid('pop', 0.46)));
      // 4: A, B, S, W, then the words
      const LT = [0.02, 0.2, 0.29, 0.4], RT = [0.5, 0.6, 0.72, 0.86];
      boxes.forEach((g, k) => {
        popAt(g, t, mid('absw', LT[k]), CW / 2, BY[k], 0.7);
        g.rest.setAttribute('fill-opacity', fade(t, mid('absw', RT[k]), 0.35).toFixed(3));
        op(g.halo, Math.sin(Math.PI * P(t, mid('absw', RT[k]), 0.8, linear)) * 0.8);
      });
      OPS.forEach((g, k) => op(g, fade(t, mid('absw', [0.56, 0.67, 0.81][k]), 0.3)));
    }

    /* traps */
    const ta = fade(t, at('traps') - 0.1, 0.5);
    op(traps, ta);
    if (ta <= 0) return;
    slots.forEach((s, i) => {
      const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : S.end('t5') + 0.05;   // the last one ticks as it ends
      const appear = P(t, mid('traps', 0.15 + i * 0.12), 0.45, pop);
      const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
      op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
      tr(s.g, (1 - clamp(appear)) * -30, 0);
      s.box.setAttribute('stroke', active ? C.energy : C.line);
      s.box.setAttribute('fill', active ? C.card2 : C.card);
      s.disc.setAttribute('fill', done ? C.good : active ? C.energy : C.card2);
      s.num.setAttribute('fill', active ? C.bg0 : C.ink);
      op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
    });
    op(focus, fade(t, mid('traps', 0.2), 0.4));
    op(hint, win(t, mid('traps', 0.3), at('t1') - 0.1, 0.3));
    TG.forEach((g, i) => op(g, win(t, at(TRAPAT[i]) - 0.15, i < 4 ? at(TRAPAT[i + 1]) - 0.05 : S.D + 1, 0.3)));

    // 1
    if (t > at('t1') - 0.3 && t < at('t2') + 0.1) {
      rise(t1ok, t, mid('t1', 0.08));
      rise(t1L, t, mid('t1', 0.1));
      t1L.bub.upd(t * calm, fade(t, mid('t1', 0.12), 0.3));
      popAt(t1pop, t, mid('t1', 0.33), 560, 354, 0.4);
      op(t1labL, fade(t, mid('t1', 0.36)));
      op(t1no, fade(t, mid('t1', 0.5)));
      t1strike.set(P(t, mid('t1', 0.56), 0.5, easeOut));
      rise(t1R, t, mid('t1', 0.58));
      t1R.bub.upd(t * calm, fade(t, mid('t1', 0.6), 0.3));
      t1co2.forEach((m, k) => { const u = ((t - mid('t1', 0.6)) / 1.8 * calm + k / 3) % 1; if (t < mid('t1', 0.6)) { op(m, 0); return; } tr(m, 970 + Math.sin(u * 6 + k) * 10, 400 - u * 60, 1, u * 120); op(m, Math.sin(u * Math.PI)); });
      op(t1labR, fade(t, mid('t1', 0.76)));
      popAt(t1chip, t, mid('t1', 0.62), 970, 330, 0.9);
    }
    // 2
    if (t > at('t2') - 0.3 && t < at('t3') + 0.1) {
      eq2.forEach((p, i) => {
        op(p.g, fade(t, mid('t2', 0.05) + i * 0.06, 0.3));
        if (p.g.halo) { const w = p.it[0] === 'WATER' ? win(t, mid('t2', 0.5), S.D, 0.3) * (0.7 + 0.3 * wave(t, 1)) : p.it[0] === 'SALT' ? win(t, mid('t2', 0.86), S.D, 0.3) * 0.6 : 0; op(p.g.halo, w); }
      });
      op(h2, fade(t, mid('t2', 0.18))); op(oh2, fade(t, mid('t2', 0.26)));
      tr(h2, 560 + Math.sin(t * 2 * calm) * 3, 508); tr(oh2, 740 - Math.sin(t * 2 * calm) * 3, 508);
      const wt = mid('t2', 0.5), wp = P(t, wt, 0.5, pop); op(w2, clamp(wp * 2)); tr(w2, 990, 508, Math.max(0.01, wp));
      const fl = clamp((t - wt) / 0.6); op(w2flash, fl > 0 && fl < 1 ? 1 - fl : 0); tr(w2flash, 990, 508, 0.6 + fl);
      op(t2labs, fade(t, mid('t2', 0.2)));
    }
    // 3
    if (t > at('t3') - 0.3 && t < at('t4') + 0.1) {
      const vb = P(t, mid('t3', 0.12), 0.6, pop); op(vBig, clamp(vb * 2)); vBig.setAttribute('r', (VR * Math.max(0.01, vb)).toFixed(1)); op(vBigLab, fade(t, mid('t3', 0.2)));
      const vi = P(t, mid('t3', 0.36), 0.6, pop); op(vIn, clamp(vi * 2)); vIn.setAttribute('transform', `translate(${IX} ${IY}) scale(${Math.max(0.01, vi).toFixed(3)}) translate(${-IX} ${-IY})`);
      popAt(cuo, t, mid('t3', 0.44), VX - 122, VY - 14, 0.7);
      op(cuoX, fade(t, mid('t3', 0.62))); op(t3b, fade(t, mid('t3', 0.58)));
    }
    // 4
    if (t > at('t4') - 0.3 && t < at('t5') + 0.1) {
      rise(bDS, t, mid('t4', 0.38)); rise(bCW, t, mid('t4', 0.72));
      bDS.upd(t); bCW.upd(t);
      op(t4labL, fade(t, mid('t4', 0.4))); op(t4labR, fade(t, mid('t4', 0.74)));
      op(t4noteL, fade(t, mid('t4', 0.46))); op(t4noteR, fade(t, mid('t4', 0.8)));
      const sp = P(t, mid('t4', 0.58), 0.5, pop); op(safeChip, clamp(sp * 2)); tr(safeChip, 585, lerp(300, 326, clamp(sp)), Math.max(0.01, 0.6 + 0.4 * sp));
    }
    // 5
    if (t > at('t5') - 0.3) {
      ladder5.forEach((g, j) => { op(g, fade(t, at('t5') - 0.1 + j * 0.03, 0.3)); if (g.halo) op(g.halo, win(t, mid('t5', [0.12, 0.21, 0.32][j - 8]), S.D + 1, 0.3) * 0.9); });
      still.forEach((s, k) => { rise(s.g, t, mid('t5', [0.12, 0.21, 0.32][k])); popAt(s.x_, t, mid('t5', 0.4 + k * 0.06), TUX[k] + 44, 556, 0.6); });
      const lp = P(t, mid('t5', 0.78), 0.8);
      attr(hLine, 'x2', lerp(L5X + 40, 1130, lp)); op(hLine, lp > 0 ? 1 : 0);
      op(hLab, fade(t, mid('t5', 0.82)));
    }
  };
});

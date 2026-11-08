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
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: H_FILL, stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, g);
      T(g, 0, 9, 'H', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
    } else {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: ball(m.c, mix(m.c, '#000000', 0.42)), stroke: mix(m.c, '#FFFFFF', 0.45), 'stroke-width': 2 }, g);
      T(g, 0, 9, m.s, { size: 26, weight: 700, anchor: 'middle', fill: INK_DARK });
    }
    if (g.halo) op(g.halo, 0);
    return g;
  }
  /* POP: the metals and carbonates chapters' 8-point burst (energy yellow, heat-orange edge) with "POP!" and short
     radial lines; built sprung (g.set(1)) for these static cards */
  function popBurst(parent, R) {
    R = R || 84;
    const g = G(parent), star = G(g), rays = G(g);
    let d = '';
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? R * 0.64 : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('circle', { r: R * 1.45, fill: glow(C.energy) }, star);
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.heat, 'stroke-width': Math.max(3, R * 0.06), 'stroke-linejoin': 'round' }, star);
    T(star, 0, R * 0.19, 'POP!', { size: Math.round(R * 0.52), weight: 700, anchor: 'middle', fill: '#6B2A00' });
    const rl = [];
    for (let i = 0; i < 8; i++) rl.push({ el: E('line', { stroke: C.energy, 'stroke-width': Math.max(3, R * 0.07), 'stroke-linecap': 'round' }, rays), a: -Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4 });
    g.set = p => {
      p = clamp(p);
      tr(star, 0, 0, Math.max(0.01, pop(p))); op(star, clamp(p * 4));
      rl.forEach(o => {
        const r1 = R * (1.08 + 0.22 * p), r2 = R * (1.2 + 0.42 * p), c = Math.cos(o.a), s = Math.sin(o.a);
        attr(o.el, 'x1', c * r1); attr(o.el, 'y1', s * r1); attr(o.el, 'x2', c * r2); attr(o.el, 'y2', s * r2);
      });
      op(rays, clamp(p * 4) * (1 - 0.55 * clamp((p - 0.5) / 0.5)));
    };
    g.set(1);
    return g;
  }
  /* the gas-test chapters' wooden splint, 16 x 220 at k = 1, its tip at the origin and the stick down local +y.
     g.place(x, y, deg): tip at (x, y), stick turned by deg (0 = tip up); g.set(flame, ember, char, smoke); g.upd(t) */
  function splint(parent, k) {
    k = k || 1;
    const g = G(parent), stick = G(g), fx = G(g), body = G(stick);
    if (k !== 1) tr(body, 0, 0, k);
    E('rect', { x: -8, y: 0, width: 16, height: 220, rx: 5, fill: '#C8A165', stroke: '#8E6B3A', 'stroke-width': 2 }, body);
    E('line', { x1: -2, y1: 44, x2: -2, y2: 204, stroke: '#A8834D', 'stroke-width': 2 }, body);
    const charC = E('rect', { x: -8, y: 0, width: 16, height: 26, rx: 5, fill: '#2E241C' }, body);
    const emb = E('rect', { x: -8, y: 0, width: 16, height: 15, rx: 5, fill: '#FF6A2A' }, body);
    const eHalo = E('circle', { r: 30 * k, fill: glow('#FF6A2A') }, fx);
    const smoke = E('path', { fill: 'none', stroke: '#9AA6B0', 'stroke-width': 5 * k, 'stroke-linecap': 'round' }, fx);
    const fl = G(fx);
    E('ellipse', { cx: 0, cy: -36, rx: 50, ry: 68, fill: glow('#FFB347') }, fl);
    E('path', { d: 'M0,6 C-19,-6 -21,-42 0,-86 C21,-42 19,-6 0,6 Z', fill: '#FF9A3C' }, fl);
    E('path', { d: 'M0,3 C-9,-5 -10,-26 0,-52 C10,-26 9,-5 0,3 Z', fill: '#FFE07A' }, fl);
    let F = 0, Em = 0, Sm = 0;
    g.place = (x, y, deg) => {
      stick.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
      fx.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    g.set = (flame, ember, ch, sm) => { F = flame; Em = ember; Sm = sm; op(charC, ch); op(emb, ember); op(eHalo, ember * 0.95); op(fl, clamp(flame * 3)); op(smoke, sm * 0.8); };
    g.upd = t => {
      if (F > 0) { const a = 0.06 * calm, b = 0.11 * calm; fl.setAttribute('transform', `scale(${(k * F * (1 + a * Math.sin(t * 9))).toFixed(3)} ${(k * F * (1 + b * Math.sin(t * 13 + 1))).toFixed(3)})`); }
      if (Em > 0) tr(eHalo, 0, 0, 0.75 + 0.35 * Em + 0.12 * wave(t, 0.8) * calm);
      if (Sm > 0) { const pts = []; for (let i = 0; i <= 8; i++) pts.push([Math.sin(i * 0.8 - t * 2.4) * (2 + i * 2.2) * k, (-12 - i * 15) * k]); smoke.setAttribute('d', openPath(pts)); }
    };
    g.set(0, 0, 0, 0); g.place(0, 0, 0);
    return g;
  }
  /* the lesson's ion art (acids, pH and neutralisation chapters): a charge badge, + red or - blue */
  function ionBadge(parent, r, sign) {
    const g = G(parent);
    E('circle', { r, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, g);
    E('path', { d: sign > 0 ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* H+: a white H with a red + badge; OH-: a red O joined to a white H, with a blue - badge */
  function ionH(parent) { const g = G(parent); atom(g, 'H', 14); tr(ionBadge(g, 7.5, 1), 11, -11); return g; }
  function ionOH(parent) { const g = G(parent); tr(atom(g, 'H', 10), 18, 10); atom(g, 'O', 16); tr(ionBadge(g, 7.5, -1), -13, -14); return g; }
  /* the acids chapter's cleaning-spray bottle (ammonia), about 140 x 230, centred */
  function sprayBottle(parent) {
    const g = G(parent);
    const body = 'M-46,-58 L46,-58 Q58,-58 58,-46 L58,112 Q58,126 44,126 L-44,126 Q-58,126 -58,112 L-58,-46 Q-58,-58 -46,-58 Z';
    E('path', { d: body, fill: 'rgba(200,230,250,0.14)' }, g);
    E('path', { d: 'M-53,-14 L53,-14 L53,110 Q53,121 42,121 L-42,121 Q-53,121 -53,110 Z', fill: '#8FDCCB', opacity: 0.72 }, g);
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -42, y: 18, width: 84, height: 62, rx: 8, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2 }, g);
    E('path', { d: 'M-26,36 H26 M-26,50 H18 M-26,64 H10', stroke: '#2FB5A0', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -18, y: -82, width: 36, height: 26, rx: 4, fill: '#E9EEF2', stroke: '#9AA6B1', 'stroke-width': 2 }, g);
    E('path', { d: 'M14,-98 Q34,-86 28,-60', fill: 'none', stroke: '#1C7E70', 'stroke-width': 11, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-30,-82 L-30,-112 Q-30,-128 -14,-128 L62,-128 Q72,-128 72,-118 L72,-106 L32,-102 L20,-82 Z', fill: ball('#3CC7B0', '#1C7E70'), stroke: '#1C7E70', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: 70, y: -124, width: 14, height: 12, rx: 3, fill: '#1C7E70' }, g);
    E('rect', { x: 40, y: -40, width: 7, height: 140, rx: 3.5, fill: '#ffffff', opacity: 0.22 }, g);
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
    const g = rung(c1, m, 72, 34, j === 0 || j === 10); tr(g, 56, 96 + 38 * j);
    const w = m.w ? rich(c1, 102, 96 + 38 * j + 10, [[m.w[0], C.energy, 800], [m.w.slice(1), C.ink, 700]], { size: 28 }) : null;
    return { g, w, m, j };
  });
  const c1Arrow = arrow(c1, 234, 90, 234, 486, { color: C.energy, width: 5 });
  const WT = [0.005, 0.047, 0.106, 0.167, 0.197, 0.226, 0.285, 0.315, 0.345, 0.383, 0.42];
  T(c1, CW / 2, 540, 'most → least reactive', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  // 2. Red Bottoms, Blue Roofs: the pH tower with litmus strips
  const c2 = cards[1];
  const c2t1 = rich(c2, CW / 2, 52, [['Red', REDT, 800], [' Bottoms,', C.ink, 700]], { size: 32, anchor: 'middle' });
  const c2t2 = rich(c2, CW / 2, 92, [['Blue', BLUET, 800], [' Roofs', C.ink, 700]], { size: 32, anchor: 'middle' });
  const TX0 = 66, TB = 476, TCH = 22, TW = 52;           // tower left, bottom, floor height, width
  const tower = G(c2);
  // the indicators chapter's tower: the pH bar stood on end (pH 0 on the ground floor) under its grey roof and chimney
  const roofT = G(tower); tr(roofT, TX0 + TW / 2, TB - 15 * TCH, TW / 112);   // that roof is sized for a 112-wide tower
  E('rect', { x: 30, y: -58, width: 18, height: 30, fill: '#4A5E6C', stroke: '#9DB0BF', 'stroke-width': 3 }, roofT);
  E('path', { d: 'M-76,0 L0,-62 L76,0 Z', fill: '#4A5E6C', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, roofT);
  const cells = [];
  for (let i = 0; i < 15; i++) {
    const y0 = TB - (i + 1) * TCH, y1 = y0 + TCH, x0 = TX0, x1 = TX0 + TW, r = 7;
    let d = `M${x0},${y0} H${x1} V${y1} H${x0} Z`;
    if (i === 0) d = `M${x0},${y0} H${x1} V${y1 - r} Q${x1},${y1} ${x1 - r},${y1} H${x0 + r} Q${x0},${y1} ${x0},${y1 - r} Z`;
    if (i === 14) d = `M${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} H${x1 - r} Q${x1},${y0} ${x1},${y0 + r} V${y1} H${x0} Z`;
    cells.push(E('path', { d, fill: PHC(i), stroke: C.bg0, 'stroke-width': 2, 'stroke-linejoin': 'round' }, tower));
  }
  [[0, '0'], [7, '7'], [14, '14']].forEach(([i, s]) => T(tower, TX0 - 10, TB - (i + 0.5) * TCH + 8, s, { size: 24, weight: 700, anchor: 'end', fill: C.muted }));
  const glowBot = E('rect', { x: TX0 - 6, y: TB - 3 * TCH - 4, width: 64, height: 3 * TCH + 8, rx: 8, fill: 'none', stroke: REDT, 'stroke-width': 4 }, tower);
  const glowTop = E('rect', { x: TX0 - 6, y: TB - 15 * TCH - 4, width: 64, height: 3 * TCH + 8, rx: 8, fill: 'none', stroke: BLUET, 'stroke-width': 4 }, tower);
  /* litmus paper: the indicators chapter's 40 x 150 strip at 0.55, centred on its origin */
  function litmus(parent, color) {
    const g = G(parent), s = G(g); s.setAttribute('transform', 'translate(0 -41.25) scale(0.55)');
    E('rect', { x: -20, y: 0, width: 40, height: 150, rx: 5, fill: color }, s);
    E('rect', { x: -20, y: 0, width: 40, height: 30, rx: 5, fill: '#FFFFFF', opacity: 0.42 }, s);
    E('rect', { x: -20, y: 0, width: 40, height: 150, rx: 5, fill: 'none', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }, s);
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
  const spl = splint(c3, 0.5); spl.set(1, 0, 0, 0); spl.place(112, 170, -110);
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
    if (lump === 'mg') { const pts = []; for (let i = 0; i <= 40; i++) { const th = i / 40 * 3.2 * Math.PI; pts.push([x - 20 + 4.2 * th - 9 * Math.sin(th), y + 70 - 8 * Math.cos(th)]); } const d = openPath(pts); E('path', { d, fill: 'none', stroke: '#8D98A5', 'stroke-width': 10, 'stroke-linecap': 'round' }, g); E('path', { d, fill: 'none', stroke: '#E3E8EE', 'stroke-width': 6, 'stroke-linecap': 'round' }, g); }
    else E('path', { d: closedPath(blobPts(17, 12, 8, 0, 0.18, 6)), fill: ball('#E6E1D6', '#A79F90'), stroke: '#A79F90', 'stroke-width': 1.5, transform: `translate(${x} ${y + 72})` }, g);
    g.bub = bubbles(g, x - 18, y - 10, 36, 76, { n: 7, r: 4.5, seed: lump === 'mg' ? 4 : 9, speed: 0.9 });
    return g;
  }
  const t1L = fizzTube(g1, 560, 500, 'mg'), t1R = fizzTube(g1, 970, 500, 'co3');
  const t1pop = popBurst(g1, 46);
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
  // the acids chapter's Venn diagram scaled to this card: ALKALIS low and left inside BASES, copper oxide outside it
  const VX = 750, VY = 480, VR = 212, IX = VX - 43, IY = VY + 59, IR = 130;
  const vBig = E('circle', { cx: VX, cy: VY, r: VR, fill: 'rgba(63,143,232,0.10)', stroke: BLUE, 'stroke-width': 5 }, g3);
  const vBigLab = T(g3, VX, VY - 169, 'BASES', { size: 34, weight: 700, anchor: 'middle', fill: '#6FB2FF' });
  const vIn = G(g3);
  E('circle', { cx: IX, cy: IY, r: IR, fill: 'rgba(160,205,255,0.16)', stroke: '#A9D0FF', 'stroke-width': 4 }, vIn);
  T(vIn, IX, IY - 82, 'ALKALIS', { size: 28, weight: 700, anchor: 'middle', fill: '#CFE4FF' });
  T(vIn, IX, IY - 56, '(soluble bases)', { size: 24, weight: 500, anchor: 'middle', fill: '#A9C6E8' });
  { const nb = G(vIn); tr(nb, IX - 44, IY - 2, 0.22); beaker(nb, 240, 280, { level: 0.7, liquid: '#CFE7F5', opacity: 0.28, marks: false }); }
  { const sp = G(vIn); tr(sp, IX + 56, IY - 4, 0.27); sprayBottle(sp); }
  T(vIn, IX - 44, IY + 52, 'sodium\nhydroxide', { size: 24, weight: 600, anchor: 'middle', lh: 26 });
  T(vIn, IX + 56, IY + 52, 'ammonia', { size: 24, weight: 600, anchor: 'middle' });
  const cuo = G(g3);
  E('path', { d: 'M-30,8 Q-18,-16.5 0,-18.6 Q18,-16.5 30,8 Z', fill: linGrad('#3A4148', '#121518', true), stroke: '#121518', 'stroke-width': 2 }, cuo);
  T(cuo, 0, 48, 'copper oxide', { size: 24, weight: 600, anchor: 'middle', fill: C.ink });
  const cuoX = T(cuo, 0, 76, 'insoluble', { size: 24, weight: 700, anchor: 'middle', fill: REDT });

  // trap 4: concentration is not strength
  const g4 = TG[3];
  rich(g4, FX, 202, [['concentration', C.energy, 800], ['  ≠  ', C.muted, 700], ['strength', C.energy, 800]], { size: 40, anchor: 'middle' });
  /* a beaker of acid in the shared particle art at 0.6 (as in the hazards chapter): red partners joined to white H;
     split ones show their charges and the H+ drifts on its own */
  function acidBeaker(parent, x, y, nJoined, nSplit, seed) {
    const g = G(parent);
    const bk = beaker(g, 230, 240, { level: 0.82, liquid: '#CFE7F5', opacity: 0.28, marks: false }); tr(bk, x, y);
    const r = rng(seed), ps = [];
    const box = [x - 92, y - 54, 184, 158];             // the liquid inside
    const bnc = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
    const drift = (q, t) => [bnc(q.x0 + q.vx * t * 9 * calm, box[0] + 12, box[0] + box[2] - 12), bnc(q.y0 + q.vy * t * 9 * calm, box[1] + 12, box[1] + box[3] - 12)];
    const seedPt = () => ({ x0: box[0] + 12 + r() * (box[2] - 24), y0: box[1] + 12 + r() * (box[3] - 24), vx: (r() - 0.5) * 2, vy: (r() - 0.5) * 2 });
    for (let k = 0; k < nJoined + nSplit; k++) {
      // drawn lean (no wrapper groups; badges only on split particles) to keep the element count low
      const split = k >= nJoined, pg = G(g), RB = 4.5;
      const badge = (par, x, y, sign) => {
        E('circle', { cx: x, cy: y, r: RB, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, par);
        E('path', { d: sign > 0 ? `M${x - RB * 0.5},${y} H${x + RB * 0.5} M${x},${y - RB * 0.5} V${y + RB * 0.5}` : `M${x - RB * 0.5},${y} H${x + RB * 0.5}`, stroke: '#ffffff', 'stroke-width': 1.8, 'stroke-linecap': 'round' }, par);
      };
      E('circle', { r: 10.2, fill: ball(RED, '#9E1F2B'), stroke: '#9E1F2B', 'stroke-width': 1.5 }, pg);
      if (split) badge(pg, 7.8, -7.8, -1);
      const h = split ? G(g) : null;                     // a split-off H+ drifts on its own
      E('circle', { cx: split ? 0 : 14.3, cy: split ? 0 : -10, r: 8.4, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 1.5 }, split ? h : pg);
      if (split) badge(h, 6.6, -6.6, 1);
      ps.push({ pg, h, split, a: seedPt(), b: seedPt() });
    }
    g.upd = t => ps.forEach(p => {
      const [x, y] = drift(p.a, t); tr(p.pg, x, y);
      if (p.split) { const [hx, hy] = drift(p.b, t); tr(p.h, hx, hy); }
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
        op(r.g, clamp(p * 2)); tr(r.g, 56, 96 + 38 * r.j, Math.max(0.01, 0.7 + 0.3 * p));
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
      spl.upd(t);
      op(c3a, fade(t, mid('pop', 0.12)));
      const mk = P(t, mid('pop', 0.5), 1.1);
      bubL.upd(t * calm, fade(t, mid('pop', 0.42), 0.3));
      tubeL.set(0.6, mix('#CFE7F5', '#EEF3F6', mk)); tubeL.liquid.setAttribute('opacity', lerp(0.25, 0.9, mk).toFixed(3));
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
      popAt(cuo, t, mid('t3', 0.44), 860, 352, 0.7);
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

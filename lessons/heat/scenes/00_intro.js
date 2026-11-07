/* Intro: a bare foot on tiles feels freezing, on wood feels cosy -> two thermometers climb in step to
   20 °C = 20 °C -> heat is energy flowing from a hotter block to a colder one -> the title and a
   three-card roadmap (heat vs temperature, three ways it travels, how to trap it). */
scene('intro', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const f1 = v => (+v).toFixed(1);
  const quad = (a, b, c, d) => `M${f1(a[0])},${f1(a[1])} L${f1(b[0])},${f1(b[1])} L${f1(c[0])},${f1(c[1])} L${f1(d[0])},${f1(d[1])} Z`;
  // a vertical gradient that fades from transparent (top) to a colour
  function fadeGrad(id, color, from) {
    const lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs());
    E('stop', { offset: 0, 'stop-color': color, 'stop-opacity': 0 }, lg);
    E('stop', { offset: from, 'stop-color': color, 'stop-opacity': 1 }, lg);
    E('stop', { offset: 1, 'stop-color': color, 'stop-opacity': 1 }, lg);
    return `url(#${id})`;
  }
  // a block drawn as a little cube around (0,0); g.paint(front, top, side)
  function block(parent, s) {
    const g = G(parent), h = s / 2, dx = s * 0.3, dy = -s * 0.24;
    const top = E('path', { d: quad([-h, -h], [h, -h], [h + dx, -h + dy], [-h + dx, -h + dy]), 'stroke-linejoin': 'round', 'stroke-width': 3 }, g);
    const side = E('path', { d: quad([h, -h], [h + dx, -h + dy], [h + dx, h + dy], [h, h]), 'stroke-linejoin': 'round', 'stroke-width': 3 }, g);
    const front = E('rect', { x: -h, y: -h, width: s, height: s, rx: 6, 'stroke-width': 3 }, g);
    E('path', { d: `M${-h + 14},${-h + 16} L${-h + 14},${h - 30}`, stroke: '#ffffff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.25 }, g);
    g.paint = (fr, tp, sd, edge) => {
      front.setAttribute('fill', fr); top.setAttribute('fill', tp); side.setAttribute('fill', sd);
      [front, top, side].forEach(e => e.setAttribute('stroke', edge));
    };
    return g;
  }
  // an orange heat-flow arrow with heat shimmer riding along it; g.set(p) draws it, g.upd(t, on)
  function flowArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent);
    const a = arrow(g, x1, y1, x2, y2, { color: o.color || C.heat, width: o.width || 10 });
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, off = o.off || 9;
    const ws = [];
    for (let k = 0; k < (o.n || 3); k++) ws.push(heatWaves(g, { n: 3, h: o.h || 40, spacing: 10, width: 5, color: o.wave || '#FFB067', speed: 0.9 }));
    g.set = p => a.set(p);
    g.upd = (t, on) => {
      ws.forEach((w, k) => {
        const u = ((t * (o.speed || 0.32)) + k / ws.length) % 1, s = lerp(0.06, 0.74, u) * L;
        tr(w, x1 + ux * s + uy * off, y1 + uy * s - ux * off);
        w.upd(t + k * 0.37);
        op(w, (on === undefined ? 1 : on) * Math.min(1, 1.8 * Math.sin(u * Math.PI)));
      });
    };
    g.upd(0, 0);
    return g;
  }
  // six-armed frost crystal
  function crystal(parent, r) {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3, x = Math.cos(a) * r, y = Math.sin(a) * r;
      d += `M0,0 L${f1(x)},${f1(y)} `;
      const bx = Math.cos(a) * r * 0.55, by = Math.sin(a) * r * 0.55;
      d += `M${f1(bx)},${f1(by)} L${f1(bx + Math.cos(a + 0.8) * r * 0.32)},${f1(by + Math.sin(a + 0.8) * r * 0.32)} M${f1(bx)},${f1(by)} L${f1(bx + Math.cos(a - 0.8) * r * 0.32)},${f1(by + Math.sin(a - 0.8) * r * 0.32)} `;
    }
    return E('path', { d, fill: 'none', stroke: '#DFF4FF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, parent);
  }

  /* ---------- the floor slab: tiles on the left, wooden planks on the right ---------- */
  const YH = 70, Y1 = 640, Y0 = 500, XL = 110, XR = 1090, CXF = 600, TH = 30;
  const xAt = (xn, y) => CXF + (xn - CXF) * (y - YH) / (Y1 - YH);    // perspective: near-edge x -> x at depth y
  const Q = (Y1 - YH) / (Y0 - YH) - 1, rowY = k => YH + (Y1 - YH) / (1 + Q * k / 5);
  const floorG = G(root);
  E('ellipse', { cx: CXF, cy: Y1 + TH + 14, rx: 540, ry: 22, fill: 'rgba(0,0,0,0.35)' }, floorG);
  // tiles
  E('path', { d: quad([XL, Y1], [CXF, Y1], [CXF, Y0], [xAt(XL, Y0), Y0]), fill: linGrad('#7E93A6', '#AFC2D1', true) }, floorG);
  {
    let d = '';
    for (let k = 1; k < 6; k++) { const xn = XL + k * (CXF - XL) / 6; d += `M${f1(xn)},${Y1} L${f1(xAt(xn, Y0))},${Y0} `; }
    for (let k = 1; k < 5; k++) { const y = rowY(k); d += `M${f1(xAt(XL, y))},${f1(y)} L${CXF},${f1(y)} `; }
    E('path', { d, fill: 'none', stroke: '#DCE7EF', 'stroke-width': 2.5, opacity: 0.85 }, floorG);
    let gl = '';
    [[1, 0.6], [3, 2.5], [4, 1.4]].forEach(([c, r]) => {
      const xa = XL + (c + 0.25) * (CXF - XL) / 6, xb = XL + (c + 0.6) * (CXF - XL) / 6, y = rowY(r);
      gl += `M${f1(xAt(xa, y))},${f1(y)} L${f1(xAt(xb, y - 6))},${f1(y - 6)} `;
    });
    E('path', { d: gl, fill: 'none', stroke: '#ffffff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.35 }, floorG);
  }
  // wooden planks
  {
    const shades = ['#C88843', '#D69A52', '#BD7D3B', '#CF9149'];
    for (let k = 0; k < 8; k++) {
      const a = CXF + k * (XR - CXF) / 8, b = CXF + (k + 1) * (XR - CXF) / 8;
      E('path', { d: quad([a, Y1], [b, Y1], [xAt(b, Y0), Y0], [xAt(a, Y0), Y0]), fill: shades[k % 4] }, floorG);
    }
    let seams = '', joints = '', grain = '';
    const JR = [1.6, 3.3, 0.9, 2.6, 4.1, 1.3, 3.7, 2.2];
    for (let k = 0; k < 8; k++) {
      const a = CXF + k * (XR - CXF) / 8, b = CXF + (k + 1) * (XR - CXF) / 8;
      if (k) seams += `M${f1(a)},${Y1} L${f1(xAt(a, Y0))},${Y0} `;
      const y = rowY(JR[k]);
      joints += `M${f1(xAt(a, y))},${f1(y)} L${f1(xAt(b, y))},${f1(y)} `;
      [0.32, 0.7].forEach((fr, i) => {
        const xn = lerp(a, b, fr), w = (i ? -1 : 1) * 3;
        const ym = rowY(2.4);
        grain += `M${f1(xn)},${Y1 - 3} Q${f1(xAt(xn, ym) + w)},${f1(ym)} ${f1(xAt(xn, Y0 + 2))},${Y0 + 2} `;
      });
    }
    E('path', { d: grain, fill: 'none', stroke: '#9C6128', 'stroke-width': 1.8, opacity: 0.55 }, floorG);
    E('path', { d: seams, fill: 'none', stroke: '#7E4A1D', 'stroke-width': 2.5 }, floorG);
    E('path', { d: joints, fill: 'none', stroke: '#7E4A1D', 'stroke-width': 2 }, floorG);
  }
  // front faces and the near edge
  E('path', { d: quad([XL, Y1], [CXF, Y1], [CXF, Y1 + TH], [XL, Y1 + TH]), fill: '#5B7083' }, floorG);
  E('path', { d: quad([CXF, Y1], [XR, Y1], [XR, Y1 + TH], [CXF, Y1 + TH]), fill: '#8A5524' }, floorG);
  {
    let d = '';
    for (let k = 1; k < 6; k++) { const x = XL + k * (CXF - XL) / 6; d += `M${f1(x)},${Y1} L${f1(x)},${Y1 + TH} `; }
    E('path', { d, stroke: '#C6D4DF', 'stroke-width': 2.5, opacity: 0.7 }, floorG);
    let w = '';
    for (let k = 1; k < 8; k++) { const x = CXF + k * (XR - CXF) / 8; w += `M${f1(x)},${Y1} L${f1(x)},${Y1 + TH} `; }
    E('path', { d: w, stroke: '#5E3612', 'stroke-width': 2.5 }, floorG);
    E('path', { d: `M${XL},${Y1} L${XR},${Y1}`, stroke: '#ffffff', 'stroke-width': 2.5, opacity: 0.35 }, floorG);
    E('path', { d: `M${CXF},${Y0} L${CXF},${Y1 + TH}`, stroke: '#3C4C59', 'stroke-width': 4 }, floorG);
  }
  const labTiles = labelLine(floorG, 228, 716, 300, 662, 'tiles', { size: 30, fill: '#C9D8E4' });
  const labWood = labelLine(floorG, 972, 716, 900, 662, 'wood', { size: 30, fill: '#F0C48C' });

  /* ---------- the bare foot (side view, facing right; sole at y = 0) ---------- */
  const FOOT_Y = 578;                                  // where the foot stands on the floor
  const TILE_X = 312, WOOD_X = 842;
  const footG = G(root);
  const footShadow = E('ellipse', { rx: 92, ry: 11, fill: 'rgba(0,0,0,0.4)' }, footG);
  const footBody = G(footG);
  const frost = G(footBody);                           // frosty glow under the foot
  E('ellipse', { cx: 20, cy: 0, rx: 150, ry: 46, fill: glow(C.air) }, frost);
  const warm = E('ellipse', { cx: 14, cy: -40, rx: 170, ry: 120, fill: glow(C.heat) }, footBody);
  E('path', { d: 'M-70,-128 L-6,-128 L-4,-330 L-72,-330 Z', fill: fadeGrad('heatIntroPj', '#6F86D6', 0.55) }, footBody);
  E('rect', { x: -74, y: -148, width: 72, height: 30, rx: 8, fill: '#5A70C2', stroke: '#93A6EA', 'stroke-width': 2 }, footBody);
  const FOOT = 'M-48,0 C-20,2 30,2 58,0 C72,-1 88,0 94,-5 C100,-10 99,-20 90,-23 C78,-26 64,-22 50,-28 C24,-38 2,-52 -14,-70 L-16,-122 L-58,-122 L-57,-72 C-57,-52 -66,-36 -70,-20 C-74,-6 -64,0 -48,0 Z';
  E('path', { d: FOOT, fill: ball('#EDBB93', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, footBody);
  const blueTint = E('path', { d: FOOT, fill: C.air, opacity: 0 }, footBody);
  E('path', { d: 'M66,-24 C72,-30 84,-30 90,-22', fill: 'none', stroke: '#C98D64', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, footBody);
  E('ellipse', { cx: 84, cy: -19, rx: 6, ry: 3.5, fill: '#FBE3D2', transform: 'rotate(-14 84 -19)' }, footBody);
  E('path', { d: 'M-40,-62 Q-32,-56 -26,-62', fill: 'none', stroke: '#C98D64', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, footBody);
  // shiver lines and frost crystals (tiles)
  const shiver = G(footG), shivers = [];
  [[-112, -70, 1], [-120, -30, 1], [-104, -110, 1], [134, -64, -1], [140, -24, -1], [124, -104, -1]].forEach(([x, y, s]) => {
    shivers.push({ el: E('path', { d: `M0,-16 L${8 * s},-8 L${-2 * s},0 L${8 * s},8 L0,16`, fill: 'none', stroke: C.air, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, shiver), x, y });
  });
  const crystals = [[-70, 8, 14], [48, 12, 11], [120, 6, 13], [-20, 16, 9], [90, -2, 8]].map(([x, y, r]) => { const g = G(shiver); crystal(g, r); return { g, x, y }; });
  const wordFreeze = T(root, 150, 414, 'freezing!', { size: 38, weight: 700, anchor: 'middle', fill: C.air });
  const wordCosy = T(root, 1030, 414, 'cosy', { size: 38, weight: 700, anchor: 'middle', fill: '#FFB070' });

  /* ---------- two thermometers on the floor ---------- */
  const thermG = G(floorG);
  const TH_Y = 556;
  const thL = G(thermG), thR = G(thermG);
  const thermL = thermometer(thL, 230, C.bad), thermR = thermometer(thR, 230, C.bad);
  const chipL = chip(thermG, '20 °C', { size: 34, fill: C.card2, stroke: C.bad }), chipR = chip(thermG, '20 °C', { size: 34, fill: C.card2, stroke: C.bad });
  tr(chipL, 355, 262); tr(chipR, 845, 262);
  const eqSign = T(thermG, 600, 288, '=', { size: 96, weight: 700, anchor: 'middle', fill: C.energy });
  const qMark = T(thermG, 600, 470, '?', { size: 120, weight: 700, anchor: 'middle', fill: C.energy });

  /* ---------- heat: energy flowing from hotter to colder ---------- */
  const defG = G(root);
  const hotG = G(defG), coldG = G(defG);
  const hotGlow = E('circle', { r: 170, fill: glow(C.heat) }, hotG);
  const hotB = block(hotG, 150); hotB.paint('#EE4E3A', '#FF8A5C', '#B3341F', '#FFB08A');
  const coldB = block(coldG, 150); coldB.paint('#3FA4DC', '#9FDCFF', '#216E9C', '#C9EEFF');
  const specks = G(coldG), sr = rng(23);
  for (let i = 0; i < 9; i++) E('circle', { cx: f1(-60 + sr() * 120), cy: f1(-60 + sr() * 120), r: f1(2 + sr() * 3), fill: '#ffffff', opacity: 0.6 }, specks);
  tr(hotG, 300, 470); tr(coldG, 900, 470);
  const defFlow = flowArrow(defG, 420, 476, 760, 476, { width: 12, n: 3, h: 44 });
  const lbHot = T(defG, 300, 622, 'hotter', { size: 34, weight: 700, anchor: 'middle', fill: '#FF9A7A' });
  const lbCold = T(defG, 900, 622, 'colder', { size: 34, weight: 700, anchor: 'middle', fill: C.air });

  /* ---------- the title: "Heat", which becomes "Heat & Temperature" ---------- */
  const titleG = G(root);
  const TS = 116, wHeat = textWidth('Heat', TS, FD, 700), wRest = textWidth('\u00A0& Temperature', TS, FD, 700);
  const tHeat = T(titleG, 0, 0, 'Heat', { size: TS, weight: 700, fill: C.heat });
  const tRest = T(titleG, 0, 0, '\u00A0& Temperature', { size: TS, weight: 700, fill: C.ink });
  tRest.setAttribute('x', f1(-(wHeat + wRest) / 2 + wHeat));
  const sub = T(root, 600, 300, 'energy that flows from hotter to colder', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });

  /* ---------- roadmap: three cards ---------- */
  const road = G(root);
  const CARD_Y = 462, CARD_X = [230, 600, 970];
  /* a vacuum flask in cross-section: outer case, vacuum gap, silvered wall, hot drink, stopper and cup lid */
  function miniFlask(g) {
    E('rect', { x: -42, y: -70, width: 84, height: 170, rx: 16, fill: linGrad('#C9D6DF', '#7D93A2'), stroke: '#EEF4F7', 'stroke-width': 2.5 }, g);
    E('rect', { x: -34, y: -62, width: 68, height: 154, rx: 11, fill: '#0B1C27' }, g);
    E('rect', { x: -27, y: -55, width: 54, height: 140, rx: 8, fill: '#E9F0F5' }, g);
    E('rect', { x: -21, y: -30, width: 42, height: 109, rx: 6, fill: ball('#FF6B5C', '#B5372D') }, g);
    E('rect', { x: -15, y: -64, width: 30, height: 30, rx: 5, fill: ball('#B08A62', '#6E5034'), stroke: '#D9BC98', 'stroke-width': 2 }, g);
    E('path', { d: 'M-46,-72 L-46,-90 Q-46,-102 -34,-102 L34,-102 Q46,-102 46,-90 L46,-72 Z', fill: ball('#7C93A6', '#4C6070'), stroke: '#C9D6DF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    const hw = heatWaves(g, { n: 2, h: 34, spacing: 14, width: 3.5, color: '#FFE0C4', speed: 0.5 }); tr(hw, 0, 52);
    return hw;
  }
  const stops = [
    { text: 'heat vs temperature', draw: g => {
      const th = G(g); tr(th, -62, 46, 0.62); const tm = thermometer(th, 170, C.bad); tm.set(0.55);
      T(g, 2, 6, '≠', { size: 64, weight: 700, anchor: 'middle', fill: C.muted });
      const sp = spark(g, 30, { seed: 4 }); tr(sp, 66, -18);
      return { sp };
    } },
    { text: 'three ways it travels', draw: g => {
      const rows = [['conduction', -90], ['convection', -32], ['radiation', 26]].map(([txt, y], i) => {
        const r = G(g); tr(r, 0, y);
        const ic = G(r); tr(ic, -116, 0, 1.15);
        if (i === 0) {
          E('rect', { x: -22, y: -9, width: 44, height: 18, rx: 6, fill: '#8F9CAB', stroke: '#C4CED8', 'stroke-width': 2 }, ic);
          [-12, 0, 12].forEach((x, k) => E('circle', { cx: x, cy: 0, r: 4.5, fill: ['#FF8A3D', '#FFB27A', '#9FD8FF'][k] }, ic));
        } else if (i === 1) {
          E('path', { d: 'M-4,16 A16,16 0 1 1 14,-6', fill: 'none', stroke: C.heat, 'stroke-width': 5, 'stroke-linecap': 'round' }, ic);
          E('path', { d: 'M8,-14 L18,-4 L5,0 Z', fill: C.heat }, ic);
          E('path', { d: 'M-4,16 A16,16 0 0 1 -16,-2', fill: 'none', stroke: C.water, 'stroke-width': 5, 'stroke-linecap': 'round' }, ic);
        } else {
          const sw = sineWave(ic, { w: 40, amp: 7, wl: 16, color: C.heat, width: 4 }); tr(sw, -20, 0);
        }
        const c = chip(r, txt, { size: 28, fill: C.card2, stroke: C.line });
        tr(c, -82 + c.w / 2, 0);
        return r;
      });
      return { rows };
    } },
    { text: 'how to trap it', draw: g => { const fg = G(g); tr(fg, 0, 0, 0.8); return { hw: miniFlask(fg) }; } },
  ].map((st, i) => {
    const g = G(road);
    card(g, -170, -150, 340, 300, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -22);
    const parts = st.draw(art);
    T(g, 0, 118, st.text, { size: 29, weight: 600, anchor: 'middle' });
    return { g, parts, x: CARD_X[i] };
  });
  const roadArrows = [arrow(road, 404, CARD_Y, 426, CARD_Y, { color: C.faint, width: 5 }), arrow(road, 774, CARD_Y, 796, CARD_Y, { color: C.faint, width: 5 })];

  /* ---------- update ---------- */
  return t => {
    /* floor: fades in, slides away as "heat" arrives */
    const fIn = P(t, 0.05, 0.7, easeOut), fOut = P(t, at('def') - 0.15, 0.9, easeIn);
    op(floorG, fIn * (1 - P(t, at('def') + 0.4, 0.4, linear)));
    tr(floorG, 0, (1 - fIn) * 30 + fOut * 360);
    labTiles.set(P(t, mid('hook', 0.12), 0.5, linear));
    labWood.set(P(t, mid('hook', 0.58), 0.5, linear));

    /* the foot: down onto the tiles, across to the wood, then away */
    const tDown = mid('hook', 0.02), tLand = tDown + 1.05;
    const tLift = mid('hook', 0.5), tLand2 = mid('hook', 0.69), tGone = at('same');
    let fx = TILE_X, lift = 0;
    if (t < tLand) { const p = P(t, tDown, 1.05, easeIn); lift = (1 - p) * 300; }
    else if (t < tLift) lift = 0;
    else if (t < tLand2) { const p = P(t, tLift, tLand2 - tLift, ease); fx = lerp(TILE_X, WOOD_X, p); lift = Math.sin(p * Math.PI) * 120; }
    else { fx = WOOD_X; lift = P(t, tGone, 0.8, easeIn) * 380; }
    const squash = (t > tLand && t < tLand + 0.3) || (t > tLand2 && t < tLand2 + 0.3) ? 1 - 0.05 * Math.sin(Math.PI * clamp(((t > tLand2 ? t - tLand2 : t - tLand)) / 0.3)) : 1;
    const footOn = P(t, tDown - 0.1, 0.4, linear) * (1 - P(t, tGone + 0.4, 0.4, linear));
    op(footG, footOn * fIn);
    footBody.setAttribute('transform', `translate(${f1(fx)} ${f1(FOOT_Y - lift)}) scale(1 ${squash.toFixed(3)})`);
    const near = clamp(1 - lift / 200);
    tr(footShadow, fx + 10, FOOT_Y + 2, 0.4 + 0.6 * near); op(footShadow, near * 0.9);
    // freezing on the tiles
    const cold = Math.min(P(t, mid('hook', 0.22), 0.7, linear), 1 - P(t, tLift - 0.1, 0.4, linear));
    op(frost, cold); op(blueTint, cold * 0.3);
    op(shiver, cold);
    if (cold > 0) {
      const jit = R ? 0 : 1;
      shivers.forEach((s, i) => tr(s.el, TILE_X + s.x + jit * 2.5 * Math.sin(t * 47 + i * 1.7), FOOT_Y + s.y + jit * 1.5 * Math.cos(t * 39 + i)));
      crystals.forEach((c, i) => { const p = P(t, mid('hook', 0.24) + i * 0.12, 0.5, pop); tr(c.g, TILE_X + c.x, FOOT_Y + c.y, Math.max(0.01, p), (t * 12 + i * 20) % 360); });
    }
    const pf = P(t, mid('hook', 0.34), 0.5, pop);
    op(wordFreeze, clamp(pf * 2) * (1 - 0.35 * P(t, tGone, 0.5, linear)) * (1 - P(t, at('def') - 0.2, 0.4, linear)));
    tr(wordFreeze, 0, (1 - clamp(pf)) * 14);
    // cosy on the wood
    const cosy = P(t, mid('hook', 0.74), 0.9, linear) * (1 - P(t, tGone, 0.4, linear));
    op(warm, cosy * 0.5); tr(warm, 0, 0, 0.92 + 0.08 * wave(t, 2.2) * AMP);
    const pc = P(t, mid('hook', 0.84), 0.5, pop);
    op(wordCosy, clamp(pc * 2) * (1 - 0.35 * P(t, tGone, 0.5, linear)) * (1 - P(t, at('def') - 0.2, 0.4, linear)));
    tr(wordCosy, 0, (1 - clamp(pc)) * 14);

    /* thermometers climb in step to the same reading */
    const pL = P(t, at('same') + 0.25, 0.5, pop), pR = P(t, at('same') + 0.4, 0.5, pop);
    tr(thL, 355, TH_Y + (1 - clamp(pL)) * 24, Math.max(0.01, 0.8 + 0.2 * pL)); op(thL, clamp(pL * 2));
    tr(thR, 845, TH_Y + (1 - clamp(pR)) * 24, Math.max(0.01, 0.8 + 0.2 * pR)); op(thR, clamp(pR * 2));
    const lvl = lerp(0.04, 0.44, P(t, mid('same', 0.2), 1.7, ease));
    thermL.set(lvl); thermR.set(lvl);
    const cL = P(t, mid('same', 0.5), 0.45, pop), cR = P(t, mid('same', 0.56), 0.45, pop);
    op(chipL, clamp(cL * 2)); tr(chipL, 355, 262, Math.max(0.01, 0.7 + 0.3 * cL));
    op(chipR, clamp(cR * 2)); tr(chipR, 845, 262, Math.max(0.01, 0.7 + 0.3 * cR));
    const pe = P(t, mid('same', 0.62), 0.45, pop); op(eqSign, clamp(pe * 2));
    eqSign.setAttribute('transform', `translate(600 262) scale(${Math.max(0.01, 0.6 + 0.4 * pe).toFixed(3)}) translate(-600 -262)`);
    const pq = P(t, mid('same', 0.76), 0.5, pop); op(qMark, clamp(pq * 2));
    qMark.setAttribute('transform', `translate(600 430) scale(${Math.max(0.01, 0.6 + 0.4 * pq).toFixed(3)}) rotate(${(6 * Math.sin(t * 2.4) * AMP).toFixed(2)}) translate(-600 -430)`);

    /* heat: hot block -> cold block */
    const dOn = P(t, at('def') + 0.2, 0.4, linear) * (1 - P(t, at('plan') - 0.1, 0.5, linear));
    op(defG, dOn);
    if (dOn > 0) {
      const ph = P(t, mid('def', 0.3), 0.55, pop), pcB = P(t, mid('def', 0.38), 0.55, pop);
      tr(hotG, 300, 470 + (1 - clamp(ph)) * 30, Math.max(0.01, 0.75 + 0.25 * ph)); op(hotG, clamp(ph * 2));
      tr(coldG, 900, 470 + (1 - clamp(pcB)) * 30, Math.max(0.01, 0.75 + 0.25 * pcB)); op(coldG, clamp(pcB * 2));
      tr(hotGlow, 0, 0, 0.9 + 0.12 * wave(t, 1.5) * AMP);
      defFlow.set(P(t, mid('def', 0.48), 0.7));
      defFlow.upd(t, P(t, mid('def', 0.6), 0.5, linear));
      op(lbHot, P(t, mid('def', 0.66), 0.4, linear)); op(lbCold, P(t, mid('def', 0.82), 0.4, linear));
    }

    /* title: "Heat", then "Heat & Temperature" at the top */
    const pT = P(t, mid('def', 0.08), 0.7, pop), pM = P(t, at('plan') - 0.1, 1.0);
    op(titleG, clamp(pT * 2));
    const wAll = wHeat + wRest;
    tHeat.setAttribute('x', f1(lerp(-wHeat / 2, -wAll / 2, pM)));
    op(tRest, P(t, at('plan') + 0.3, 0.6, linear));
    titleG.setAttribute('transform', `translate(600 ${f1(lerp(238, 168, pM))}) scale(${(Math.max(0.01, 0.8 + 0.2 * clamp(pT)) * lerp(1, 0.6, pM)).toFixed(4)})`);
    op(sub, P(t, mid('def', 0.36), 0.5, linear) * (1 - P(t, at('plan') - 0.1, 0.4, linear)));

    /* roadmap */
    op(road, P(t, at('plan') + 0.05, 0.4, linear));
    const showAt = [mid('plan', 0.04), mid('plan', 0.36), mid('plan', 0.79)];
    stops.forEach((st, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, st.x, CARD_Y + (1 - clamp(p)) * 30, Math.max(0.01, 0.9 + 0.1 * p));
    });
    stops[0].parts.sp.upd(t); stops[2].parts.hw.upd(t);
    stops[1].parts.rows.forEach((r, i) => { const p = P(t, mid('plan', 0.42 + i * 0.1), 0.45, pop); op(r, clamp(p * 2)); tr(r, (1 - clamp(p)) * 20, [-90, -32, 26][i]); });
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
  };
});

/* Chapter: Indicators, colour clues.
   Beats: three look-alike tubes; a dropper of indicator turns them red, green and blue -> litmus strips dip in and
   change colour from the wet end up -> showpiece: the pH bar swings upright into a tower; the red strip slides to
   the bottom floors, the blue strip to the roof: Red Bottoms, Blue Roofs -> the tower lies down grey and universal
   indicator floods it with colour -> the acid bands, green 7, the alkali bands, with a tube taking on each colour
   -> the printed chart: a sample is matched to its cell -> red cabbage juice in six cups along a pH line -> the
   kitchen: lemon juice turns one cup pink, bicarbonate of soda turns the other blue. */
scene('indicators', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- the lesson's colour code: acids red, neutral green, alkalis blue to purple ---------- */
  const RED = '#E8424F', ORANGE = '#FF8A3D', YELLOW = '#FFD84D', GREEN = '#56D69B', BLUE = '#3F8FE8', PURPLE = '#8E5CF0';
  const PH = [RED, RED, RED, ORANGE, ORANGE, YELLOW, YELLOW, GREEN, BLUE, BLUE, BLUE, BLUE, PURPLE, PURPLE, PURPLE];
  const RED_T = '#FF6B76', BLUE_T = '#6FB0FF', PURPLE_T = '#B592FF';      // brighter versions for text on the dark stage
  const CLEAR = '#CFE7F5', GREY = '#3A4B57', DIM = '#183140', INK_DK = '#10202B';
  const CAB = ['#D6304E', '#F0508C', '#8B4FB8', '#3F8FE8', '#4CC26E', '#E6D34A'];   // red cabbage juice: red, pink, purple, blue, green, yellow

  /* ---------- helpers ---------- */
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const x = hex(a), y = hex(b); p = clamp(p); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], p)).toString(16).padStart(2, '0')).join(''); };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const dropD = s => `M0,${-10 * s} C${6 * s},${-2 * s} ${8 * s},${3 * s} ${8 * s},${6 * s} A${8 * s},${8 * s} 0 0 1 ${-8 * s},${6 * s} C${-8 * s},${3 * s} ${-6 * s},${-2 * s} 0,${-10 * s} Z`;
  /* piecewise eased motion through keyframes [[t, x, y], ...] */
  function keys(t, K) {
    if (t <= K[0][0]) return [K[0][1], K[0][2]];
    for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const p = ease((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0])); return [lerp(K[i - 1][1], K[i][1], p), lerp(K[i - 1][2], K[i][2], p)]; }
    const L = K[K.length - 1]; return [L[1], L[2]];
  }
  /* litmus paper, origin at the middle of its held (top) end, hanging down 150 px; g.set(p) the new colour
     creeps up from the wet (bottom) end */
  function litmus(parent, from, to) {
    const w = 40, h = 150, g = G(parent);
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 5, fill: from }, g);
    const wet = E('rect', { x: -w / 2, y: h, width: w, height: 0, rx: 5, fill: to }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: 30, rx: 5, fill: '#FFFFFF', opacity: 0.42 }, g);      // the paler end you hold
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 5, fill: 'none', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }, g);
    g.set = p => { const hh = h * clamp(p); attr(wet, 'y', h - hh); attr(wet, 'height', hh); };
    g.set(0);
    return g;
  }
  /* the front of a kit testTube's (clear) liquid and rim, drawn over a dipped strip so it sits inside the tube */
  function tubeFront(parent, w, h, level) {
    const g = G(parent), y0 = -h / 2, y1 = h / 2, r = w / 2, q = r - 3, ly = y1 - (y1 - (y0 + 10)) * level;
    E('path', { d: `M${-q},${ly} L${-q},${y1 - r} A${q},${q} 0 0 0 ${q},${y1 - r} L${q},${ly} Z`, fill: CLEAR, opacity: 0.24 }, g);
    E('rect', { x: -q, y: ly, width: 2 * q, height: 3, fill: '#FFFFFF', opacity: 0.5 }, g);
    E('path', { d: `M${-r - 4},${y0} A${r + 4},5 0 0 0 ${r + 4},${y0}`, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5 }, g);
    return g;
  }
  /* glass dropper, tip at (0,0), rubber bulb on top; g.squeeze(p) */
  function dropper(parent, liquid) {
    const g = G(parent);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104 Z', fill: 'rgba(200,230,250,0.16)' }, g);
    E('path', { d: 'M-6,-64 L-6,-30 L-1.5,-5 L1.5,-5 L6,-30 L6,-64 Z', fill: liquid }, g);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const bulb = G(g);
    E('path', { d: 'M-16,-100 C-20,-128 -14,-150 0,-150 C14,-150 20,-128 16,-100 Z', fill: ball('#E8663F', '#A33C1E'), stroke: '#F5A27F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, bulb);
    E('rect', { x: -18, y: -107, width: 36, height: 10, rx: 4, fill: '#B8461F' }, bulb);
    g.squeeze = p => bulb.setAttribute('transform', `translate(0 -102) scale(${(1 + 0.2 * p).toFixed(3)} ${(1 - 0.16 * p).toFixed(3)}) translate(0 102)`);
    g.squeeze(0);
    return g;
  }
  /* the shared pH bar: 15 cells of 56 px, pH 0 on the left, numbers 0-14 under the cells. Drawn around the
     bar's middle; g.place(cx, cy, angle, sx, sy, ndx, ndy) moves, turns and stretches the cells, and keeps
     the numbers upright and full size, offset (ndx, ndy) from each cell's lower edge */
  function phBar(parent) {
    const CW = 56, L = 15 * CW, g = G(parent), cg = G(g), ng = G(g), cells = [], nums = [];
    for (let i = 0; i < 15; i++) {
      const x0 = -L / 2 + i * CW, x1 = x0 + CW, y0 = -CW / 2, y1 = CW / 2, r = 14;
      let d = `M${x0},${y0} L${x1},${y0} L${x1},${y1} L${x0},${y1} Z`;
      if (i === 0) d = `M${x0 + r},${y0} L${x1},${y0} L${x1},${y1} L${x0 + r},${y1} Q${x0},${y1} ${x0},${y1 - r} L${x0},${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`;
      if (i === 14) d = `M${x0},${y0} L${x1 - r},${y0} Q${x1},${y0} ${x1},${y0 + r} L${x1},${y1 - r} Q${x1},${y1} ${x1 - r},${y1} L${x0},${y1} Z`;
      cells.push(E('path', { d, fill: PH[i], stroke: C.bg0, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cg));
      nums.push(T(ng, 0, 0, String(i), { size: 26, weight: 600, anchor: 'middle' }));
    }
    g.cells = cells; g.nums = nums;
    g.place = (cx, cy, a, sx, sy, ndx, ndy) => {
      cg.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${a.toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`);
      const ca = Math.cos(a * Math.PI / 180), sa = Math.sin(a * Math.PI / 180);
      for (let i = 0; i < 15; i++) {
        const px = (-L / 2 + (i + 0.5) * CW) * sx, py = CW / 2 * sy;
        attr(nums[i], 'x', cx + px * ca - py * sa + ndx); attr(nums[i], 'y', cy + px * sa + py * ca + ndy);
      }
    };
    return g;
  }
  /* bracket under [x1, x2] with its ends turned up, drawn on with b.set(p) */
  function bracket(parent, x1, x2, y, color) {
    const p = E('path', { d: `M${x1},${y - 12} L${x1},${y} L${x2},${y} L${x2},${y - 12}`, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    p.set = v => p.setAttribute('stroke-dashoffset', (1 - clamp(v)).toFixed(4));
    p.set(0);
    return p;
  }
  /* bottle of universal indicator, centred; mouth at (0,-92) */
  function uiBottle(parent) {
    const g = G(parent);
    const body = 'M-40,-52 Q-40,-66 -26,-66 L-14,-66 L-14,-90 L14,-90 L14,-66 L26,-66 Q40,-66 40,-52 L40,60 Q40,72 28,72 L-28,72 Q-40,72 -40,60 Z';
    E('path', { d: body, fill: 'rgba(200,230,250,0.14)' }, g);
    E('path', { d: 'M-35,-34 L35,-34 L35,58 Q35,67 26,67 L-26,67 Q-35,67 -35,58 Z', fill: '#2F8A57' }, g);
    E('rect', { x: -40, y: -8, width: 80, height: 42, fill: '#F4F7FA' }, g);
    T(g, 0, 22, 'UI', { size: 26, weight: 700, anchor: 'middle', fill: INK_DK });
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -18, y: -97, width: 36, height: 9, rx: 4, fill: '#1B3442', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    return g;
  }
  /* red cabbage: a purple head with a tight curl on top and two outer leaves wrapping round it,
     each with a pale midrib and side veins */
  function cabbage(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#A04AA3', '#5B1E60'), stroke: '#CF8AD1', 'stroke-width': 3 }, g);
    E('path', { d: `M${-r * 0.34},${-r * 0.5} Q0,${-r * 0.98} ${r * 0.32},${-r * 0.56} M${-r * 0.16},${-r * 0.56} Q${r * 0.04},${-r * 0.74} ${r * 0.16},${-r * 0.5}`, fill: 'none', stroke: '#E6B5E8', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    [1, -1].forEach(s => {
      const lf = G(g); if (s < 0) lf.setAttribute('transform', 'scale(-1 1)');
      E('path', { d: `M0,${r * 0.99} C${-r * 0.92},${r * 0.96} ${-r * 1.14},${-r * 0.12} ${-r * 0.72},${-r * 0.74} C${-r * 0.48},${-r * 0.2} ${-r * 0.32},${r * 0.42} 0,${r * 0.99} Z`, fill: ball('#B45FB7', '#6A2A6E'), stroke: '#DDA2DF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, lf);
      E('path', { d: `M${-r * 0.08},${r * 0.9} Q${-r * 0.64},${r * 0.46} ${-r * 0.72},${-r * 0.56} M${-r * 0.4},${r * 0.62} L${-r * 0.8},${r * 0.44} M${-r * 0.58},${r * 0.26} L${-r * 0.92},${r * 0.04} M${-r * 0.67},${-r * 0.1} L${-r * 0.88},${-r * 0.34}`, fill: 'none', stroke: '#F3DAF4', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.85 }, lf);
    });
    return g;
  }
  function lemonHalf(parent) {
    const g = G(parent);
    E('circle', { r: 38, fill: ball('#FFE45C', '#D9A400'), stroke: '#FFF3A6', 'stroke-width': 2.5 }, g);
    E('circle', { r: 30, fill: '#FFF2A8' }, g);
    let d = '';
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.2; d += `M0,0 L${(Math.cos(a) * 28).toFixed(1)},${(Math.sin(a) * 28).toFixed(1)} `; }
    E('path', { d, stroke: '#EBCB4E', 'stroke-width': 2.5 }, g);
    E('circle', { r: 4, fill: '#FFFBE0' }, g);
    return g;
  }
  /* a teaspoon, bowl at (0,0), handle up and to the right, with a heap of powder */
  function spoon(parent, heap) {
    const g = G(parent);
    E('path', { d: 'M24,-8 L132,-76', stroke: linGrad('#E1E8EE', '#8A9BA8'), 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('ellipse', { rx: 30, ry: 14, fill: ball('#E9EEF2', '#8A9BA8'), stroke: '#F4F7FA', 'stroke-width': 2 }, g);
    g.heap = E('path', { d: 'M-24,-4 Q-14,-22 0,-22 Q14,-22 24,-4 Z', fill: heap, stroke: '#FFFFFF', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a glass jug of juice, spout tip at (58,-70); g.set(level, tilt) keeps the juice's surface level as it tips */
  function jug(parent, liquid) {
    const g = G(parent);
    const body = 'M-44,-56 L40,-56 L58,-70 L54,-50 L44,-38 L44,54 Q44,64 34,64 L-34,64 Q-44,64 -44,54 Z';
    const cp = E('clipPath', { id: 'am3jug' }, defs()); E('path', { d: body }, cp);
    E('path', { d: body, fill: 'rgba(200,230,250,0.12)' }, g);
    const lg = G(g, { 'clip-path': 'url(#am3jug)' });
    const liq = E('rect', { x: -160, y: 0, width: 320, height: 220, fill: liquid }, lg);
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-44,-36 C-82,-36 -82,30 -44,30', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    g.set = (lv, tilt) => { const y = 64 - 112 * clamp(lv); attr(liq, 'y', y); liq.setAttribute('transform', `rotate(${(-(tilt || 0)).toFixed(1)} 0 ${y.toFixed(1)})`); };
    g.set(0.7, 0);
    return g;
  }

  /* ================= A. three look-alike tubes in a rack ================= */
  const TX = [380, 600, 820], TW = 78, TH = 280, TY = 430, LV = 0.62;
  const LY = TY + TH / 2 - (TH - 10) * LV;              // liquid surface, y about 403
  const TIP = 272;                                     // the dropper tip, just above the tube mouths
  const COL = [RED, GREEN, BLUE];
  const Aback = G(root);
  const rackB = G(Aback);
  E('rect', { x: 284, y: 586, width: 632, height: 18, rx: 6, fill: '#9A6E45', stroke: '#C99A6A', 'stroke-width': 2 }, rackB);
  [300, 882].forEach(x => E('rect', { x, y: 338, width: 18, height: 252, rx: 4, fill: '#8A6038', stroke: '#B48450', 'stroke-width': 1.5 }, rackB));
  const tubes = TX.map(x => { const tb = testTube(Aback, TW, TH, { level: LV, liquid: CLEAR, opacity: 0.25 }); tr(tb, x, TY); return tb; });
  const fallG = G(Aback);
  const drops = TX.map(() => E('path', { d: dropD(1), fill: '#3F9A62' }, fallG));
  const ripples = TX.map(x => E('ellipse', { cx: x, cy: LY + 1, rx: 6, ry: 2, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5 }, fallG));
  // the litmus strips live above the rack (they leave it for the tower)
  const stripsG = G(root);
  const stripB = litmus(stripsG, BLUE, RED), stripR = litmus(stripsG, RED, BLUE);
  const Afront = G(root);
  const fronts = [0, 2].map(k => { const f = tubeFront(Afront, TW, TH, LV); tr(f, TX[k], TY); return f; });
  const shelf = E('rect', { x: 288, y: 328, width: 624, height: 20, rx: 6, fill: '#B48450', stroke: '#D9AE7C', 'stroke-width': 2 }, Afront);
  const qChips = TX.map(x => { const c = chip(Afront, '?', { size: 36, fill: 'rgba(10,27,39,0.6)', stroke: C.line, sw: 2, w: 54, h: 54 }); tr(c, x, 492); return c; });
  const LBL = [['acidic', RED_T], ['neutral', GREEN], ['alkaline', BLUE_T]].map(([s, c], k) => { const e = T(Afront, TX[k], 656, s, { size: 34, weight: 700, anchor: 'middle', fill: c }); return e; });
  const drp = dropper(Afront, '#3F9A62');
  T(drp, 26, -112, 'indicator', { size: 26, weight: 600, fill: GREEN });
  const noNum = G(Afront);
  const nnChip = chip(noNum, 'a pH number?', { size: 30, fill: C.card2, stroke: C.line, sw: 2 }); tr(nnChip, 588, 200);
  const nnX = cross(noNum, 17); tr(nnX, 588 + nnChip.w / 2 + 34, 200);

  // drop k leaves the dropper at DT[k]
  const DT = [mid('what', 0.24), mid('what', 0.37), mid('what', 0.5)];
  const DK = [[DT[0] - 1.0, 1010, TIP], [DT[0] - 0.42, TX[0], TIP], [DT[0] + 0.15, TX[0], TIP], [DT[1] - 0.3, TX[1], TIP], [DT[1] + 0.15, TX[1], TIP], [DT[2] - 0.3, TX[2], TIP], [DT[2] + 0.2, TX[2], TIP], [DT[2] + 0.85, 1010, 230]];
  // strips: [t, x, y of the held end]; the blue one tests the acid, the red one the alkali; then both wait at
  // the left and slide to the tower's bottom floors (red) and roof (blue)
  const HOLD = 128, DIP = 300;
  const SB = [[at('litmus') - 0.3, TX[0], 110], [mid('litmus', 0.1), TX[0], DIP], [mid('litmus', 0.56), TX[0], DIP], [mid('litmus', 0.66), TX[0], HOLD], [at('roofs') - 0.45, TX[0], HOLD], [at('roofs') + 0.35, 82, 290], [mid('roofs', 0.56), 82, 290], [mid('roofs', 0.67), 220, 540]];
  const SR = [[mid('litmus', 0.17), TX[2], 110], [mid('litmus', 0.33), TX[2], DIP], [mid('litmus', 0.56), TX[2], DIP], [mid('litmus', 0.66), TX[2], HOLD], [at('roofs') - 0.45, TX[2], HOLD], [at('roofs') + 0.35, 138, 290], [mid('roofs', 0.8), 138, 290], [mid('roofs', 0.91), 220, 170]];

  /* ================= B. the pH bar: tower, flood, bands, chart ================= */
  const B = G(root);
  const ground = E('rect', { x: 170, y: 690, width: 320, height: 8, rx: 4, fill: '#5B6E7A' }, B);
  const roof = G(B);
  E('path', { d: 'M-76,0 L0,-62 L76,0 Z', fill: '#4A5E6C', stroke: '#9DB0BF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, roof);
  E('rect', { x: 30, y: -58, width: 18, height: 30, fill: '#4A5E6C', stroke: '#9DB0BF', 'stroke-width': 3 }, roof);
  roof.insertBefore(roof.lastChild, roof.firstChild);                  // chimney behind the roof
  const card2 = G(B);                                                  // the printed colour chart, behind the bar
  E('rect', { x: 150, y: 288, width: 900, height: 160, rx: 18, fill: '#F4F7FA', stroke: '#FFFFFF', 'stroke-width': 2 }, card2);
  T(card2, 172, 318, 'colour chart', { size: 26, weight: 700, fill: '#4A5E6C' });
  const bar = phBar(B);
  const line1 = rich(B, 600, 205, [['Red', RED_T, 800], [' Bottoms, ', C.ink], ['Blue', BLUE_T, 800], [' Roofs', C.ink]], { size: 50, weight: 700, anchor: 'middle' });
  const wBlue = G(B);
  rich(wBlue, 470, 262, [['Blue', BLUE_T, 800], [' Roofs', C.ink]], { size: 48, weight: 700 });
  T(wBlue, 472, 302, 'alkalis: high pH', { size: 26, weight: 600, fill: C.muted });
  const wRed = G(B);
  rich(wRed, 470, 622, [['Red', RED_T, 800], [' Bottoms', C.ink]], { size: 48, weight: 700 });
  T(wRed, 472, 662, 'acids: low pH', { size: 26, weight: 600, fill: C.muted });
  // universal indicator
  const BOT = [120, 262];
  const bottleG = G(B), bottle = uiBottle(bottleG);
  const stream = E('path', { fill: 'none', stroke: '#2F8A57', 'stroke-width': 7, 'stroke-linecap': 'round' }, B);
  const dyeCols = [RED, YELLOW, BLUE];
  const dyes = dyeCols.map(c => E('path', { d: dropD(0.9), fill: c, stroke: '#FFFFFF', 'stroke-width': 1.5 }, B));
  const uiLab = G(B);
  T(uiLab, 230, 188, 'universal indicator', { size: 32, weight: 700, fill: GREEN });
  T(uiLab, 232, 224, 'a mixture of dyes', { size: 26, weight: 600, fill: C.muted });
  // the bands, with a tube above the bar that takes on each colour
  const BANDS = [[0, 1, 2], [3, 4], [5, 6], [7], [8, 9, 10, 11], [12, 13, 14]];
  const BC = [RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE];
  const BX = BANDS.map(b => 180 + 56 * (b[0] + b.length / 2));
  const BT = [at('acids') - 0.15, mid('acids', 0.38), mid('acids', 0.64), mid('green', 0.04), mid('alkalis', 0.06), mid('alkalis', 0.48)];
  const bandOf = []; BANDS.forEach((b, k) => b.forEach(i => { bandOf[i] = k; }));
  const uiTube = testTube(B, 50, 170, { level: 0.6, liquid: RED });
  const CHIPS = ['red 0–2', 'orange 3–4', 'yellow 5–6', 'green 7', 'blue 8–11', 'purple 12–14'].map((s, k) => {
    const c = chip(B, s, { size: 26, fill: BC[k], color: k === 0 || k >= 4 ? '#FFFFFF' : INK_DK, weight: 700 });
    return { c, x: BX[k], y: k % 2 ? 514 : 462 };
  });
  const BR = [
    { b: bracket(B, 184, 566, 552, RED_T), l: T(B, 375, 594, 'acidic', { size: 32, weight: 700, anchor: 'middle', fill: RED_T }), t: () => mid('acids', 0.84) },
    { b: bracket(B, 578, 622, 552, GREEN), l: T(B, 600, 594, 'neutral', { size: 32, weight: 700, anchor: 'middle', fill: GREEN }), t: () => mid('green', 0.5) },
    { b: bracket(B, 634, 1016, 552, PURPLE_T), l: T(B, 825, 594, 'alkaline', { size: 32, weight: 700, anchor: 'middle', fill: PURPLE_T }), t: () => mid('alkalis', 0.84) },
  ];
  // the chart: a sample matched to its cell
  const SAMPLE = '#FF9440';
  const sTube = testTube(B, 50, 170, { level: 0.6, liquid: SAMPLE });
  const match = G(B);
  E('rect', { x: 400, y: 326, width: 64, height: 64, rx: 8, fill: 'none', stroke: INK_DK, 'stroke-width': 5 }, match);
  const mArrow = arrow(match, 432, 290, 432, 322, { color: INK_DK, width: 5, head: 15 });
  const mChip = chip(match, 'about pH 4', { size: 30, fill: ORANGE, color: INK_DK }); tr(mChip, 585, 200);
  const note = rich(B, 600, 548, [['a colour estimates ', C.ink], ['pH', GREEN, 800], [', not acid strength', C.ink]], { size: 34, anchor: 'middle' });

  /* ================= C. red cabbage juice in six cups ================= */
  const Cg = G(root);
  const cab = G(Cg); cabbage(cab, 72);
  const cabT = G(Cg);
  T(cabT, 332, 226, 'red cabbage juice', { size: 40, weight: 700, fill: '#D58BD8' });
  T(cabT, 334, 268, 'a natural indicator', { size: 28, weight: 600, fill: C.muted });
  const MW = 52, MX0 = 210, MY = 540;
  const mini = G(Cg);
  for (let i = 0; i < 15; i++) {
    E('rect', { x: MX0 + i * MW, y: MY, width: MW, height: MW, rx: i === 0 || i === 14 ? 10 : 2, fill: '#24404F', stroke: '#3E6175', 'stroke-width': 2 }, mini);
    T(mini, MX0 + (i + 0.5) * MW, MY + MW + 30, String(i), { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  }
  T(mini, 194, MY + 36, 'pH', { size: 28, weight: 700, anchor: 'end', fill: C.muted });
  const CUP_PH = [2, 4, 7, 9, 11, 13], CUP_NAME = ['red', 'pink', 'purple', 'blue', 'green', 'yellow'];
  const CUP_T = [mid('cabbage', 0.31), mid('cabbage', 0.4), mid('cabbage', 0.52), mid('cabbage', 0.67), mid('cabbage', 0.73), mid('cabbage', 0.8)];
  const cups = CUP_PH.map((ph, k) => {
    const x = MX0 + (ph + 0.5) * MW, g = G(Cg);
    E('line', { x1: x, y1: 508, x2: x, y2: MY - 4, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '5 6' }, g);
    const b = beaker(g, 84, 100, { level: 0, liquid: CAB[2], marks: false }); tr(b, x, 452);
    const w = T(g, x, 384, CUP_NAME[k], { size: 28, weight: 700, anchor: 'middle', fill: k === 2 ? '#B98BE0' : CAB[k] });
    return { g, b, w, x };
  });
  const climb = G(Cg);
  arrow(climb, 360, 666, 880, 666, { color: C.muted, width: 5 });
  T(climb, 896, 676, 'pH climbs', { size: 28, weight: 700, fill: C.muted });

  /* ================= D. try it at home ================= */
  const D = G(root);
  const tilesG = G(D, { opacity: 0.08 });
  let td = '';
  for (let x = 120; x <= 1080; x += 80) td += `M${x},128 L${x},560 `;
  for (let y = 128; y <= 560; y += 72) td += `M120,${y} L1080,${y} `;
  E('path', { d: td, stroke: '#9FD8FF', 'stroke-width': 2 }, tilesG);
  E('rect', { x: 120, y: 586, width: 960, height: 134, fill: '#26343E', stroke: '#3C4E5B', 'stroke-width': 2 }, D);
  E('path', { d: 'M360,596 L360,710 M600,596 L600,710 M840,596 L840,710', stroke: '#3C4E5B', 'stroke-width': 3 }, D);
  E('rect', { x: 100, y: 560, width: 1000, height: 26, rx: 6, fill: '#B88A5A', stroke: '#D9AE7C', 'stroke-width': 2 }, D);
  const HX = [430, 770], HY = 475;
  const homeCups = HX.map(x => { const b = beaker(D, 150, 170, { level: 0, liquid: CAB[2], marks: false }); tr(b, x, HY); return b; });
  const homeChip = chip(D, 'try it at home', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(homeChip, 600, 168);
  const jugG = G(D), jg = jug(jugG, CAB[2]);
  const pourL = E('path', { fill: 'none', stroke: CAB[2], 'stroke-width': 8, 'stroke-linecap': 'round' }, D);
  const lemonG = G(D), lemonIn = G(lemonG); lemonHalf(lemonIn);
  const lDrops = [0, 1, 2].map(() => E('path', { d: dropD(0.8), fill: '#FFF0A0' }, D));
  const spoonG = G(D), sp = spoon(spoonG, '#F4F7FA');
  const grains = [];
  { const r = rng(23); for (let k = 0; k < 9; k++) grains.push({ el: E('rect', { x: -3.5, y: -3.5, width: 7, height: 7, rx: 2, fill: '#F4F7FA' }, D), dx: (r() - 0.5) * 30, ph: k / 9 }); }
  const hLab = [
    [T(D, HX[0], 636, 'lemon juice', { size: 30, weight: 700, anchor: 'middle', fill: '#FFE680' }), rich(D, HX[0], 676, [['pink', CAB[1], 800], [': acidic', C.ink]], { size: 28, anchor: 'middle' })],
    [T(D, HX[1], 636, 'bicarbonate of soda', { size: 30, weight: 700, anchor: 'middle', fill: '#F4F7FA' }), rich(D, HX[1], 676, [['blue', BLUE_T, 800], [': alkaline', C.ink]], { size: 28, anchor: 'middle' })],
  ];

  /* ================= update ================= */
  return t => {
    /* ===== A: what, litmus ===== */
    const aA = Math.min(P(t, S.first - 0.3, 0.3, linear), 1 - P(t, at('roofs') - 0.15, 0.45, linear));
    op(Aback, aA); op(Afront, aA);
    if (aA > 0) {
      op(rackB, P(t, at('what') - 0.1, 0.4, linear)); op(shelf, P(t, at('what') - 0.1, 0.4, linear));
      const reset = P(t, at('litmus') - 0.45, 0.5, linear), side = win(t, at('litmus') - 0.2, at('roofs') + 0.2, 0.3);
      tubes.forEach((tb, k) => {
        const p = P(t, at('what') + 0.08 * k, 0.5, pop);
        tr(tb, TX[k], TY + (1 - clamp(p)) * 26);
        op(tb, clamp(p * 2) * (k === 1 ? 1 - 0.55 * side : 1));
        const b = P(t, DT[k] + 0.28, 0.6, easeOut) * (1 - reset);
        tb.liquid.setAttribute('fill', mix(CLEAR, COL[k], b)); attr(tb.liquid, 'opacity', lerp(0.25, 0.85, b));
        const u = (t - DT[k]) / 0.3;
        op(drops[k], u > 0 && u < 1 ? 1 : 0);
        if (u > 0 && u < 1) tr(drops[k], TX[k], lerp(TIP + 6, LY - 6, easeIn(u)));
        const v = (t - DT[k] - 0.3) / 0.6;
        op(ripples[k], v > 0 && v < 1 ? 0.8 * (1 - v) : 0);
        if (v > 0 && v < 1) { attr(ripples[k], 'rx', 6 + 22 * v); attr(ripples[k], 'ry', 2 + 4 * v); }
        op(qChips[k], P(t, at('what') + 0.3 + 0.08 * k, 0.4, linear) * (1 - P(t, DT[k] + 0.2, 0.3, linear)));
        const lp = P(t, mid('what', [0.6, 0.68, 0.77][k]), 0.5, pop);
        op(LBL[k], clamp(lp * 2)); LBL[k].setAttribute('transform', `translate(0 ${((1 - clamp(lp)) * 14).toFixed(1)})`);
      });
      // the dropper
      const da = P(t, DK[0][0], 0.3, linear) * (1 - P(t, DT[2] + 0.55, 0.3, linear));
      op(drp, da);
      if (da > 0) {
        const [x, y] = keys(t, DK); tr(drp, x, y);
        drp.squeeze(Math.max(...DT.map(d => win(t, d - 0.22, d + 0.12, 0.1))));
      }
      // litmus: tube fronts while the strips are dipped, then the "pH number?" chip gets a cross
      fronts.forEach(f => op(f, win(t, at('litmus') - 0.1, mid('litmus', 0.64), 0.2)));
      op(noNum, P(t, mid('litmus', 0.66), 0.4, linear) * (1 - P(t, at('roofs') - 0.6, 0.3, linear)));
      const xp = P(t, mid('litmus', 0.84), 0.35, pop); op(nnX, clamp(xp * 2)); tr(nnX, 588 + nnChip.w / 2 + 34, 200, Math.max(0.01, xp));
    }

    /* ===== the litmus strips (litmus -> roofs) ===== */
    const aS = P(t, at('litmus') - 0.3, 0.3, linear) * (1 - P(t, at('ui') - 0.15, 0.35, linear));
    op(stripsG, aS);
    if (aS > 0) {
      const [bx, by] = keys(t, SB), [rx, ry] = keys(t, SR);
      tr(stripB, bx, by); tr(stripR, rx, ry);
      op(stripR, P(t, mid('litmus', 0.17), 0.3, linear));
      stripB.set(P(t, mid('litmus', 0.11), 1.0, easeOut)); stripR.set(P(t, mid('litmus', 0.34), 1.0, easeOut));
    }

    /* ===== B: the bar ===== */
    const aB = Math.min(P(t, mid('roofs', 0.06), 0.3, linear), 1 - P(t, at('cabbage') - 0.12, 0.4, linear));
    op(B, aB);
    if (aB > 0) {
      // flat -> tower (roofs) -> flat again (ui)
      const up = P(t, mid('roofs', 0.31), 1.25) * (1 - P(t, at('ui') - 0.1, 1.0));
      bar.place(lerp(600, 330, up), lerp(358, 430, up), -90 * up, lerp(1, 0.62, up), lerp(1, 2, up), lerp(0, 25, up), lerp(30, 9, up));
      op(line1, win(t, mid('roofs', 0.04), mid('roofs', 0.33), 0.3));
      const rp = P(t, mid('roofs', 0.45), 0.5, pop) * (1 - P(t, at('ui') - 0.2, 0.3, linear));
      op(roof, clamp(rp * 2)); tr(roof, 330, 172, Math.max(0.01, 0.6 + 0.4 * rp)); op(ground, clamp(rp * 2));
      const wr = P(t, mid('roofs', 0.57), 0.5, easeOut) * (1 - P(t, at('ui') - 0.2, 0.3, linear));
      op(wRed, wr); tr(wRed, (1 - wr) * 24, 0);
      const wb = P(t, mid('roofs', 0.81), 0.5, easeOut) * (1 - P(t, at('ui') - 0.2, 0.3, linear));
      op(wBlue, wb); tr(wBlue, (1 - wb) * 24, 0);
      // colours: full; grey as the tower lies down; universal indicator floods it from the left;
      // the bands dim, then light up as each is named
      const grey = P(t, at('ui') - 0.1, 0.9, linear), front = 15.6 * P(t, mid('ui', 0.56), 1.9, linear);
      const dimOn = P(t, at('acids') - 0.15, 0.4, linear) * (1 - P(t, at('chart') - 0.1, 0.5, linear));
      const lowF = Math.sin(Math.PI * P(t, mid('roofs', 0.58), 0.9, linear)), topF = Math.sin(Math.PI * P(t, mid('roofs', 0.83), 0.9, linear));
      const numDark = P(t, at('chart') - 0.05, 0.4, linear);
      for (let i = 0; i < 15; i++) {
        const k = bandOf[i], on = P(t, BT[k], 0.35, linear), pulse = Math.sin(Math.PI * P(t, BT[k] + 0.05, 0.7, linear));
        let c = mix(PH[i], GREY, grey * (1 - clamp(front - i)));
        c = mix(c, DIM, 0.72 * dimOn * (1 - on));
        c = mix(c, '#FFFFFF', 0.32 * Math.max(i <= 3 ? lowF : 0, i >= 11 ? topF : 0, dimOn > 0 ? pulse : 0));
        bar.cells[i].setAttribute('fill', c);
        const app = P(t, mid('roofs', 0.08) + i * 0.09, 0.3, linear);
        op(bar.cells[i], app); op(bar.nums[i], app);
        bar.nums[i].setAttribute('fill', mix(C.ink, INK_DK, numDark));
      }
      // universal indicator: dyes drop in, the bottle pours, colour floods the cells
      const ba = win(t, mid('ui', 0.1), at('acids') + 0.15, 0.35);
      op(bottleG, ba); op(uiLab, win(t, mid('ui', 0.16), at('acids') - 0.15, 0.3));
      if (ba > 0) {
        const tilt = 100 * P(t, mid('ui', 0.5), 0.55) * (1 - P(t, mid('ui', 0.96), 0.5));
        tr(bottleG, BOT[0], BOT[1]); bottle.setAttribute('transform', `rotate(${tilt.toFixed(1)})`);
        dyes.forEach((d, k) => {
          const u = (t - mid('ui', 0.2 + 0.08 * k)) / 0.45;
          op(d, u > 0 && u < 1 ? Math.min(1, u * 6, (1 - u) * 6) : 0);
          if (u > 0 && u < 1) tr(d, BOT[0], lerp(110, BOT[1] - 86, easeIn(u)));
        });
        const pourOn = win(t, mid('ui', 0.58), mid('ui', 0.98), 0.12);
        op(stream, pourOn);
        if (pourOn > 0) {
          const a = tilt * Math.PI / 180, mx = BOT[0] + 92 * Math.sin(a), my = BOT[1] - 92 * Math.cos(a);
          stream.setAttribute('d', `M${mx.toFixed(1)},${my.toFixed(1)} Q${(mx + 6).toFixed(1)},${(my + 30).toFixed(1)} 210,330`);
        }
      } else { op(stream, 0); dyes.forEach(d => op(d, 0)); }
      // the tube above the bar takes on each band's colour
      const ta = Math.min(P(t, at('acids') - 0.1, 0.45, pop), 1 - P(t, at('chart') - 0.15, 0.35, linear));
      op(uiTube, clamp(ta * 2));
      if (ta > 0) {
        let k = 0; for (let j = 1; j < 6; j++) if (t >= BT[j] - 0.1) k = j;
        const x = k === 0 ? BX[0] : lerp(BX[k - 1], BX[k], P(t, BT[k] - 0.1, 0.45));
        const c = k === 0 ? mix(CLEAR, BC[0], P(t, BT[0] + 0.2, 0.4)) : mix(BC[k - 1], BC[k], P(t, BT[k] + 0.12, 0.4));
        tr(uiTube, x, 231 + (1 - clamp(ta)) * 20); uiTube.set(0.6, c);
        attr(uiTube.liquid, 'opacity', k === 0 ? lerp(0.25, 0.9, P(t, BT[0] + 0.2, 0.4)) : 0.9);
      }
      const chOut = 1 - P(t, at('chart') - 0.1, 0.4, linear);
      CHIPS.forEach((o, k) => { const p = P(t, BT[k] + 0.14, 0.5, pop); op(o.c, clamp(p * 2) * chOut); tr(o.c, o.x, o.y + (1 - clamp(p)) * 12, Math.max(0.01, 0.8 + 0.2 * p)); });
      BR.forEach(o => { o.b.set(P(t, o.t(), 0.5)); op(o.b, chOut); op(o.l, P(t, o.t() + 0.1, 0.4, linear) * chOut); });
      // the chart: a white card, a sample slides along and stops at its colour
      const cp = P(t, at('chart') - 0.05, 0.45, easeOut);
      op(card2, cp); card2.setAttribute('transform', `translate(600 368) scale(${(0.96 + 0.04 * cp).toFixed(4)}) translate(-600 -368)`);
      const sp2 = P(t, mid('chart', 0.1), 0.3, linear);
      op(sTube, sp2);
      if (sp2 > 0) { tr(sTube, lerp(1110, 432, P(t, mid('chart', 0.1), mid('chart', 0.42) - mid('chart', 0.1))), 200); sTube.set(0.6, SAMPLE); }
      const mp = P(t, mid('chart', 0.44), 0.4, linear);
      op(match, mp); mArrow.set(P(t, mid('chart', 0.44), 0.4));
      const mc = P(t, mid('chart', 0.5), 0.5, pop); op(mChip, clamp(mc * 2)); tr(mChip, 585, 200, Math.max(0.01, 0.8 + 0.2 * mc));
      const np = P(t, mid('chart', 0.6), 0.5, easeOut); op(note, np); note.setAttribute('transform', `translate(0 ${((1 - np) * 14).toFixed(1)})`);
    }

    /* ===== C: red cabbage ===== */
    const aC = win(t, at('cabbage') - 0.1, at('home') + 0.2, 0.4);
    op(Cg, aC);
    if (aC > 0) {
      const cpp = P(t, at('cabbage'), 0.6, pop);
      tr(cab, 230, 235, Math.max(0.01, 0.7 + 0.3 * cpp), 6 * Math.sin(t * 0.8 * calm)); op(cab, clamp(cpp * 2));
      op(cabT, P(t, mid('cabbage', 0.06), 0.5, linear));
      op(mini, P(t, at('cabbage') + 0.1, 0.5, linear));
      cups.forEach((o, k) => {
        const p = P(t, mid('cabbage', 0.06 + 0.035 * k), 0.5, pop);
        op(o.g, clamp(p * 2)); tr(o.g, 0, (1 - clamp(p)) * 16);
        const fill = P(t, mid('cabbage', 0.1 + 0.03 * k), 0.8);
        const shift = k === 2 ? 0 : P(t, CUP_T[k], 0.55, linear);
        o.b.set(0.62 * fill, mix(CAB[2], CAB[k], shift));
        const pulse = k === 2 ? Math.sin(Math.PI * P(t, CUP_T[k], 0.7, linear)) : 0;
        tr(o.b, o.x, 452, 1 + 0.06 * pulse);
        op(o.w, P(t, CUP_T[k] + 0.1, 0.4, linear));
      });
      op(climb, P(t, mid('cabbage', 0.86), 0.5, linear));
    }

    /* ===== D: try it at home ===== */
    const aD = P(t, at('home') - 0.1, 0.45, linear);
    op(D, aD);
    if (aD > 0) {
      const hc = P(t, mid('home', 0.02), 0.5, pop); op(homeChip, clamp(hc * 2)); tr(homeChip, 600, 168, Math.max(0.01, 0.8 + 0.2 * hc));
      // the jug fills both cups with purple juice
      const T1 = mid('home', 0.12), T2 = mid('home', 0.3);
      const jk = [[mid('home', 0.04), 980, 250], [T1 - 0.05, HX[0] - 66, 262], [T1 + 0.75, HX[0] - 66, 262], [T2 - 0.05, HX[1] - 66, 262], [T2 + 0.75, HX[1] - 66, 262], [T2 + 1.3, 1000, 230]];
      const ja = P(t, mid('home', 0.04), 0.3, linear) * (1 - P(t, T2 + 1.0, 0.3, linear));
      op(jugG, ja);
      const tilt = 52 * Math.max(win(t, T1, T1 + 0.8, 0.22), win(t, T2, T2 + 0.8, 0.22));
      if (ja > 0) { const [x, y] = keys(t, jk); tr(jugG, x, y, 1, tilt); jg.set(0.7 - 0.22 * P(t, T1, 0.8, linear) - 0.22 * P(t, T2, 0.8, linear), tilt); }
      const lv = [0.6 * P(t, T1 + 0.1, 0.7), 0.6 * P(t, T2 + 0.1, 0.7)];
      const pours = [win(t, T1 + 0.1, T1 + 0.75, 0.1), win(t, T2 + 0.1, T2 + 0.75, 0.1)];
      const pk = pours[0] > 0 ? 0 : 1;
      op(pourL, Math.max(pours[0], pours[1]));
      if (Math.max(pours[0], pours[1]) > 0) {
        const a = tilt * Math.PI / 180, [jx, jy] = keys(t, jk);
        const sx = jx + 58 * Math.cos(a) + 70 * Math.sin(a), sy = jy + 58 * Math.sin(a) - 70 * Math.cos(a);
        const surf = HY + 85 - (170 - 18) * lv[pk];
        pourL.setAttribute('d', `M${sx.toFixed(1)},${sy.toFixed(1)} Q${(sx + 8).toFixed(1)},${(sy + 30).toFixed(1)} ${(sx + 6).toFixed(1)},${surf.toFixed(1)}`);
      }
      // lemon juice turns the left cup pink; bicarbonate of soda turns the right cup blue
      const TL = mid('home', 0.5), TB = mid('home', 0.72);
      const la = win(t, TL - 0.35, TL + 1.4, 0.3);
      op(lemonG, la);
      if (la > 0) { const sq = win(t, TL, TL + 0.7, 0.15); tr(lemonG, HX[0] + 10, 318 - (1 - P(t, TL - 0.35, 0.4)) * 30, 1, -18); lemonIn.setAttribute('transform', `scale(${(1 - 0.12 * sq).toFixed(3)} 1)`); }
      lDrops.forEach((d, k) => { const u = (t - TL - 0.05 - k * 0.22) / 0.4; op(d, u > 0 && u < 1 ? 1 : 0); if (u > 0 && u < 1) tr(d, HX[0] + 8 + (k - 1) * 6, lerp(356, HY + 85 - 152 * 0.6, easeIn(u))); });
      const pink = P(t, TL + 0.3, 0.7);
      const sa = win(t, TB - 0.35, TB + 1.4, 0.3);
      op(spoonG, sa);
      const tip = P(t, TB, 0.4);
      if (sa > 0) { tr(spoonG, HX[1] - 6, 336 - (1 - P(t, TB - 0.35, 0.4)) * 30, 1, -32 * tip); op(sp.heap, 1 - P(t, TB + 0.3, 0.5, linear)); }
      grains.forEach(gr => {
        const u = ((t - TB - 0.1) / 0.5 + gr.ph) % 1, te = t - u * 0.5, on = t > TB + 0.1 && te >= TB + 0.1 && te <= TB + 0.75;
        op(gr.el, on ? Math.min(1, u * 8, (1 - u) * 6) : 0);
        if (on) tr(gr.el, HX[1] - 22 + gr.dx * (0.3 + u), lerp(342, HY + 85 - 152 * 0.6, u * u), 1, u * 200);
      });
      const blue = P(t, TB + 0.35, 0.7);
      homeCups[0].set(lv[0], mix(CAB[2], CAB[1], pink)); homeCups[1].set(lv[1], mix(CAB[2], CAB[3], blue));
      op(hLab[0][0], P(t, TL - 0.1, 0.4, linear)); op(hLab[0][1], P(t, TL + 0.8, 0.4, linear));
      op(hLab[1][0], P(t, TB - 0.1, 0.4, linear)); op(hLab[1][1], P(t, TB + 0.85, 0.4, linear));
    }
  };
});

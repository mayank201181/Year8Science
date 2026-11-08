/* Five signs of a reaction.
   A beaker reacts (new colour, fizz, warmth, a hiss) above an eye, a hand and an ear: see, feel, hear
   -> the five sign tiles drop in along the top and light one by one, each with a demo below:
      a grey nail rusts orange-brown; a tube fizzes while the Bunsen beside it stays off; one thermometer
      climbs, another falls; two clear solutions pour together and a cloudy yellow solid appears, then
      settles: "precipitate = insoluble solid"; a flame, a glow, a BANG and a pop; a glow stick snaps and
      glows in the dark while its thermometer barely moves
   -> Cool Guys Take Pretty Lasses types out under the tiles, with their initials
   -> one sign is only a clue; three signs make it almost certain
   -> careful: a boiling kettle and a drop of food dye are physical: not a reaction
   -> showpiece: baking soda tips from a balloon into vinegar, it fizzes, and CO2 blows up the balloon. */
scene('signs', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const PHY = C.water;

  /* ---------- local helpers and art ---------- */
  const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // an open eye, front view, about 120 x 74
  function eyeIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-60,0 Q0,-46 60,0 Q0,46 -60,0 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: 21, fill: ball('#4C9BE8', '#1E5FA8') }, g);
    E('circle', { r: 9, fill: '#0A1B27' }, g);
    E('circle', { cx: -7, cy: -7, r: 4.5, fill: '#FFFFFF', opacity: 0.9 }, g);
    return g;
  }
  // an open hand, palm towards us, about 110 x 110
  function handIcon(parent) {
    const g = G(parent), sk = ball('#E8B48E', '#B9825A');
    [[-30, -44, 50], [-10, -58, 64], [10, -56, 62], [30, -44, 50]].forEach(([x, y, h]) => E('rect', { x: x - 9, y, width: 18, height: h, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, g));
    E('path', { d: 'M-40,-6 Q-40,44 0,48 Q40,44 40,-6 Z', fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, g);
    E('rect', { x: -66, y: -8, width: 18, height: 46, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2, transform: 'rotate(-38 -57 15)' }, g);
    return g;
  }
  // an ear seen from the side, about 75 x 120
  function earIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-30,-34 C-28,-66 2,-78 26,-70 C52,-61 60,-30 50,-6 C42,14 26,20 22,38 C18,56 4,70 -14,64 C-28,59 -30,46 -24,36 C-18,26 -10,22 -12,6 C-14,-8 -32,-12 -30,-34 Z', fill: ball('#F2C29C', '#C98E62'), stroke: '#FFE2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-12,-42 C0,-56 26,-52 32,-30 C37,-12 24,-2 14,6', fill: 'none', stroke: '#B97A52', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -6, cy: 4, rx: 9, ry: 12, fill: '#6E3A26' }, g);
    return g;
  }
  // a magnifying glass, lens radius r, handle to the bottom-right
  function magnifier(parent, r) {
    const g = G(parent);
    E('line', { x1: r * 0.7, y1: r * 0.7, x2: r * 1.6, y2: r * 1.6, stroke: '#C9D6DE', 'stroke-width': r * 0.28, 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: 'rgba(159,216,255,0.10)', stroke: '#E4EDF2', 'stroke-width': r * 0.15 }, g);
    E('path', { d: `M${-r * 0.62},${-r * 0.3} A${r * 0.7},${r * 0.7} 0 0 1 ${-r * 0.2},${-r * 0.66}`, stroke: '#ffffff', 'stroke-width': r * 0.08, fill: 'none', opacity: 0.55, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // sound arcs ")))" opening to the right; g.set(t) pulses them outward
  function soundArcs(parent, n, color) {
    const g = G(parent), arcs = [];
    for (let k = 0; k < n; k++) arcs.push(E('path', { fill: 'none', stroke: color || C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g));
    g.set = t => arcs.forEach((a, k) => {
      const u = (t * 0.9 + k / n) % 1, r = 14 + u * 40;
      a.setAttribute('d', `M${(r * 0.35).toFixed(1)},${(-r).toFixed(1)} Q${(r * 1.15).toFixed(1)},0 ${(r * 0.35).toFixed(1)},${r.toFixed(1)}`);
      a.style.opacity = (Math.sin(u * Math.PI) * 0.9).toFixed(3);
    });
    g.set(0);
    return g;
  }
  // carbon dioxide drawn like lib molCO2 (O=C=O), but as three plain circles: cheaper for crowds
  function miniCO2(parent, r) {
    const g = G(parent);
    [-1.6, 1.6].forEach(x => E('circle', { cx: x * r, r: r * 0.9, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g));
    E('circle', { r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  // a little frost sparkle (four-point star)
  function frost(parent, x, y, s) {
    return E('path', { d: `M${x},${y - s} L${x + s * 0.25},${y - s * 0.25} L${x + s},${y} L${x + s * 0.25},${y + s * 0.25} L${x},${y + s} L${x - s * 0.25},${y + s * 0.25} L${x - s},${y} L${x - s * 0.25},${y - s * 0.25} Z`, fill: '#EAF8FF' }, parent);
  }
  // a candle standing on y = 0 with an rxFlame on its wick (g.flame)
  function candle(parent) {
    const g = G(parent);
    E('rect', { x: -20, y: -96, width: 40, height: 96, rx: 6, fill: linGrad('#FFF4DE', '#D8C7A6'), stroke: '#EADCC0', 'stroke-width': 2 }, g);
    E('path', { d: 'M-20,-92 Q-10,-84 -6,-92 Q2,-82 8,-92 Q14,-86 20,-92', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.7 }, g);
    E('line', { x1: 0, y1: -96, x2: 0, y2: -108, stroke: '#2A2420', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.flame = rxFlame(g, 0.62); tr(g.flame, 0, -104);
    return g;
  }
  // a jagged burst for "BANG!"
  function burst(parent, r) {
    let d = '';
    for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + i * Math.PI / 12, rr = i % 2 ? r * 0.62 : r * (i % 4 ? 0.9 : 1); d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    const g = G(parent);
    E('circle', { r: r * 1.5, fill: glow(C.heat) }, g);
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.heat, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 12, 'BANG!', { size: 34, weight: 700, anchor: 'middle', fill: C.bg0 });
    return g;
  }
  // a glass kettle on its base (base bottom at y = 70), water inside with bubbles (g.bub)
  function kettle(parent) {
    const g = G(parent);
    E('rect', { x: -104, y: 52, width: 208, height: 20, rx: 8, fill: '#3C4650', stroke: '#6F7D89', 'stroke-width': 2 }, g);
    const body = 'M-74,48 L-86,-58 Q-84,-82 -56,-86 L56,-86 Q84,-82 86,-58 L74,48 Z';
    E('path', { d: body, fill: 'rgba(200,230,250,0.10)' }, g);
    const clip = 'cr-signs-kettle', cp = E('clipPath', { id: clip }, defs()); E('path', { d: body }, cp);
    E('rect', { x: -100, y: -36, width: 200, height: 90, fill: C.water, opacity: 0.75, 'clip-path': `url(#${clip})` }, g);
    g.bub = bubbles(g, -66, -30, 132, 72, { n: 8, r: 6, seed: 21, speed: 0.95 });
    E('path', { d: body, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-84,-44 L-134,-82 L-128,-92 L-82,-64', fill: 'rgba(200,230,250,0.12)', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M84,-64 C132,-64 132,28 78,26', fill: 'none', stroke: '#3C4650', 'stroke-width': 14, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -44, y: -98, width: 88, height: 14, rx: 6, fill: '#3C4650' }, g);
    E('rect', { x: -12, y: -110, width: 24, height: 14, rx: 5, fill: '#56636F' }, g);
    g.steam = heatWaves(g, { n: 3, h: 60, spacing: 16, color: '#DCEBF4', width: 4 }); tr(g.steam, -136, -96);
    return g;
  }
  // a clear plastic bottle, neck top at (0,-180), bottom at y = 120; g.set(level) fills it with vinegar
  const BOT = 'M-26,-180 L-26,-150 C-26,-126 -92,-118 -92,-76 L-92,100 Q-92,120 -72,120 L72,120 Q92,120 92,100 L92,-76 C92,-118 26,-126 26,-150 L26,-180 Z';
  function bottle(parent) {
    const g = G(parent);
    E('path', { d: BOT, fill: 'rgba(200,230,250,0.08)' }, g);
    const clip = 'cr-signs-bottle', cp = E('clipPath', { id: clip }, defs()); E('path', { d: BOT }, cp);
    g.inside = G(g, { 'clip-path': `url(#${clip})` });
    g.liq = E('rect', { x: -100, y: 0, width: 200, height: 140, fill: '#F3EBC2', opacity: 0.6 }, g.inside);
    E('path', { d: BOT, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: 62, y: -60, width: 9, height: 150, rx: 4.5, fill: '#FFFFFF', opacity: 0.22 }, g);
    return g;
  }

  /* ===== A. evidence: see, feel, hear ===== */
  const evG = G(root);
  const evBk = beaker(evG, 170, 196, { level: 0.55, liquid: '#5AA8FF' }); tr(evBk, 600, 352);
  const evBub = bubbles(evG, 535, 372, 130, 76, { n: 7, r: 7, seed: 3, speed: 0.6 });
  const evDrop = E('path', { d: 'M0,-16 C9,-5 12,2 12,7 A12,12 0 0 1 -12,7 C-12,2 -9,-5 0,-16 Z', fill: C.energy }, evG);
  const evHeat = heatWaves(evG, { n: 2, h: 64, spacing: 34 }); tr(evHeat, 600, 240);
  const evSnd = soundArcs(evG, 3, C.ink); tr(evSnd, 700, 330);
  const senses = [[eyeIcon, 'see', 300, 590], [handIcon, 'feel', 600, 590], [earIcon, 'hear', 900, 590]].map(([fn, label, x, y]) => {
    const g = G(evG); tr(g, x, y);
    fn(g);
    T(g, 0, 104, label, { size: 36, weight: 700, anchor: 'middle', fill: C.energy });
    return { g, x, y };
  });

  /* ===== the five tiles ===== */
  const TX = [192, 396, 600, 804, 1008], TY = 220, KINDS = ['colour', 'gas', 'temp', 'precip', 'light'];
  const tilesG = G(root);
  const tiles = KINDS.map((k, i) => {
    const g = G(tilesG); tr(g, TX[i], TY);
    const tile = rxSignTile(g, k);
    let tk = null;
    if (i <= 2) { tk = G(g); tr(tk, 30, -90); E('circle', { r: 20, fill: C.good, stroke: C.bg0, 'stroke-width': 4 }, tk); tick(tk, 9, C.bg0); }
    return { g, tile, tk };
  });
  const tileMag = magnifier(tilesG, 46);

  /* ===== B. colour: a nail rusts ===== */
  const colG = G(root);
  const nailBig = rxNail(colG, 400, { seed: 7 }); tr(nailBig, 600, 476, 1, 90);
  const greyT = T(colG, 372, 616, 'shiny grey iron', { size: 32, weight: 700, anchor: 'middle', fill: '#C9D3DB' });
  const colArrow = arrow(colG, 516, 605, 664, 605, { color: C.muted, width: 6 });
  const rustT = T(colG, 838, 616, 'orange-brown rust', { size: 32, weight: 700, anchor: 'middle', fill: RX.rustLt });

  /* ===== C. gas: fizzing, but nothing is boiling ===== */
  const gasG = G(root);
  const gTube = testTube(gasG, 84, 250, { level: 0.6, liquid: '#8FD3F0', opacity: 0.45 }); tr(gTube, 500, 530);
  E('path', { d: 'M-22,6 C-20,-8 -4,-14 10,-10 C24,-6 26,8 14,14 C2,20 -20,18 -22,6 Z', fill: ball('#F2F4F5', '#A9B4BC'), stroke: '#C9D3DB', 'stroke-width': 2, transform: 'translate(500 630)' }, gasG);
  const gBub = bubbles(gasG, 468, 512, 64, 108, { n: 10, r: 6, seed: 9, speed: 0.75 });
  const fz = rng(13), fizz = [];
  for (let k = 0; k < 5; k++) fizz.push({ el: E('circle', { r: 2.5 + fz() * 2, fill: '#DDF3FC' }, gasG), dx: (fz() - 0.5) * 60, h: 26 + fz() * 40, ph: fz() });
  const gLbl = labelLine(gasG, 270, 480, 470, 548, 'bubbles of gas', { size: 30, line: C.ink });
  const burner = bunsen(gasG, 1); tr(burner, 760, 648); burner.set('off');
  const offX = cross(gasG, 22); tr(offX, 760, 494);
  const offT = T(gasG, 760, 444, 'burner off', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const offT2 = T(gasG, 940, 600, 'nothing\nis boiling', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, lh: 34 });

  /* ===== D. temperature: hotter or colder ===== */
  const tmpG = G(root);
  const hotBk = beaker(tmpG, 150, 170, { level: 0.6, liquid: '#FF9E5E', opacity: 0.55 }); tr(hotBk, 420, 570);
  const coldBk = beaker(tmpG, 150, 170, { level: 0.6, liquid: '#7FC8F8', opacity: 0.6 }); tr(coldBk, 780, 570);
  const hotWaves = heatWaves(tmpG, { n: 3, h: 70, spacing: 24 }); tr(hotWaves, 386, 470);
  const frostG = G(tmpG);
  [[712, 520, 9], [846, 548, 8], [726, 610, 7], [834, 626, 6]].forEach(([x, y, s]) => frost(frostG, x, y, s));
  // as in Energy changes: orange heat arrows leave the hot beaker, blue arrows go into the cold one
  const outArrows = G(tmpG);
  arrow(outArrows, 334, 556, 302, 540, { color: C.heat, width: 5, head: 15 });
  arrow(outArrows, 506, 556, 538, 540, { color: C.heat, width: 5, head: 15 });
  const inArrows = G(tmpG);
  arrow(inArrows, 662, 540, 694, 556, { color: C.water, width: 5, head: 15 });
  arrow(inArrows, 898, 540, 866, 556, { color: C.water, width: 5, head: 15 });
  const thHot = thermometer(tmpG, 190, C.bad); tr(thHot, 452, 626);
  const thCold = thermometer(tmpG, 190, C.bad); tr(thCold, 812, 626);
  const rdHot = T(tmpG, 452, 412, '20 °C', { size: 30, weight: 700, anchor: 'middle' });
  const rdCold = T(tmpG, 812, 412, '20 °C', { size: 30, weight: 700, anchor: 'middle' });
  const lbHot = T(tmpG, 420, 694, 'hotter', { size: 32, weight: 700, anchor: 'middle', fill: C.heat });
  const lbCold = T(tmpG, 780, 694, 'colder', { size: 32, weight: 700, anchor: 'middle', fill: C.water });

  /* ===== E. precipitate: two clear solutions make a cloudy solid ===== */
  const prG = G(root);
  const CLEAR = '#DDEFF8';
  const mainT = testTube(prG, 92, 250, { level: 0, liquid: CLEAR, opacity: 0.42 }); tr(mainT, 600, 580);
  const pr = rng(29), specks = [];
  const pclip = 'cr-signs-tube', pcp = E('clipPath', { id: pclip }, defs());
  E('path', { d: 'M-42,-115 L-42,79 A42,42 0 0 0 42,79 L42,-115 Z', transform: 'translate(600 580)' }, pcp);
  const speckG = G(prG, { 'clip-path': `url(#${pclip})` });
  for (let k = 0; k < 30; k++) {
    const x = (pr() - 0.5) * 72, y0 = 470 + pr() * 200;
    const row = Math.floor(k / 11), col = k % 11;
    const sx = (col - 5) * 6.4 + (pr() - 0.5) * 3, sy = 696 - row * 7 - (1 - Math.pow(Math.abs(sx) / 40, 2)) * 6 - pr() * 3;
    specks.push({ el: E('circle', { r: 3 + pr() * 2.4, fill: RX.precip }, speckG), x: 600 + x, y0, sx: 600 + sx * (1 - row * 0.06), sy: Math.min(sy, 700 - Math.pow(Math.abs(sx) / 42, 2) * 26 - row * 7), ph: pr() * TAU });
  }
  const pourL = testTube(prG, 54, 170, { level: 0.55, liquid: CLEAR, opacity: 0.45 });
  const pourR = testTube(prG, 54, 170, { level: 0.55, liquid: CLEAR, opacity: 0.45 });
  const streamL = E('path', { fill: 'none', stroke: CLEAR, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.7 }, prG);
  const streamR = E('path', { fill: 'none', stroke: CLEAR, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.7 }, prG);
  const clearL = T(prG, 420, 496, 'clear', { size: 28, weight: 700, anchor: 'middle', fill: CLEAR });
  const clearR = T(prG, 780, 496, 'clear', { size: 28, weight: 700, anchor: 'middle', fill: CLEAR });
  const cloudLbl = labelLine(prG, 700, 572, 626, 580, 'a cloudy solid', { size: 30, anchor: 'start', line: C.ink });
  const defLbl = labelLine(prG, 700, 668, 618, 690, 'precipitate = insoluble solid', { size: 30, anchor: 'start', line: C.ink, fill: RX.precip });
  const defLbl2 = labelLine(prG, 700, 548, 626, 556, 'formed by two solutions reacting', { size: 28, anchor: 'start', line: C.muted, fill: C.muted });

  /* ===== F. light or sound ===== */
  const ltG = G(root);
  const LX = [240, 480, 720, 960];
  const slots = ['a flame', 'a glow', 'a bang', 'a pop'].map((label, i) => {
    const g = G(ltG);
    T(g, LX[i], 662, label, { size: 30, weight: 700, anchor: 'middle' });
    return g;
  });
  const cand = candle(slots[0]); tr(cand, 240, 610);
  const emberHalo = E('circle', { cx: 480, cy: 556, r: 90, fill: glow('#FF6A3D') }, slots[1]);
  E('path', { d: 'M-46,18 C-52,-6 -30,-30 -4,-28 C22,-34 50,-14 46,10 C44,30 16,38 -8,36 C-30,36 -42,32 -46,18 Z', fill: ball('#4A3A33', '#1C1512'), stroke: '#2A211C', 'stroke-width': 2, transform: 'translate(480 560)' }, slots[1]);
  const emberCracks = E('path', { d: 'M-30,4 l16,-8 l10,10 M2,-14 l12,6 l14,-4 M-10,20 l18,-6 l14,8', fill: 'none', stroke: '#FF8A3D', 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(480 560)' }, slots[1]);
  const bang = burst(slots[2], 66); tr(bang, 720, 520);
  const ripL = sineWave(slots[2], { w: 70, amp: 9, wl: 28, color: C.ink, width: 4 }); tr(ripL, 640, 606, 1, 180);
  const ripR = sineWave(slots[2], { w: 70, amp: 9, wl: 28, color: C.ink, width: 4 }); tr(ripR, 800, 606);
  const popTube = testTube(slots[3], 50, 150, { level: 0, liquid: CLEAR }); tr(popTube, 960, 566, 1, 180);
  E('line', { x1: 900, y1: 668, x2: 950, y2: 650, stroke: '#C59C61', 'stroke-width': 7, 'stroke-linecap': 'round' }, slots[3]);
  const popFlame = rxFlame(slots[3], 0.3); tr(popFlame, 952, 652);
  const popStar = G(slots[3]); tr(popStar, 960, 660);
  E('circle', { r: 46, fill: glow(C.energy) }, popStar);
  T(popStar, 40, -24, 'pop!', { size: 32, weight: 700, fill: C.energy });

  /* ===== G. the glow stick ===== */
  const darkG = E('rect', { x: 0, y: 0, width: W, height: H, fill: '#02070B' }, root);
  const gwG = G(root);
  const stickHalo = E('ellipse', { cx: 470, cy: 520, rx: 260, ry: 110, fill: glow('#7CFF6B') }, gwG);
  const halves = [-1, 1].map(side => {
    const h = G(gwG);
    E('rect', { x: side < 0 ? -150 : 0, y: -17, width: 150, height: 34, rx: side < 0 ? 17 : 0, fill: '#1E3A24', stroke: '#9FE3B0', 'stroke-width': 3 }, h);
    if (side > 0) E('rect', { x: 120, y: -17, width: 30, height: 34, rx: 17, fill: '#1E3A24', stroke: '#9FE3B0', 'stroke-width': 3 }, h);
    const lit = E('rect', { x: side < 0 ? -146 : 0, y: -13, width: 146, height: 26, rx: 13, fill: '#B6FF8A' }, h);
    return { h, side, lit };
  });
  const snapFx = spark(gwG, 18, { seed: 5, color: '#DFFFD0' });
  const thGw = thermometer(gwG, 200, C.bad); tr(thGw, 840, 640);
  const rdGw = T(gwG, 840, 412, '20 °C', { size: 30, weight: 700, anchor: 'middle' });
  const gwLight = T(gwG, 470, 642, 'gives out light', { size: 30, weight: 700, anchor: 'middle', fill: '#B6FF8A' });
  const gwHeat = T(gwG, 840, 704, 'hardly any heat', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });

  /* ===== H. Cool Guys Take Pretty Lasses ===== */
  const mnG = G(root);
  const MN = ['Cool', 'Guys', 'Take', 'Pretty', 'Lasses'], NAMES = ['Colour', 'Gas', 'Temperature', 'Precipitate', 'Light'];
  const words = MN.map((w, i) => {
    const t1 = T(mnG, TX[i], 452, `**${w[0]}**${w.slice(1)}`, { size: 54, weight: 600, anchor: 'middle', boldFill: C.energy });
    const t2 = T(mnG, TX[i], 512, NAMES[i], { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
    return { t1, t2 };
  });

  /* ===== I. one sign is a clue; several make it almost certain ===== */
  const clG = G(root);
  const c1 = G(clG), c3 = G(clG);
  T(c1, 330, 372, 'one sign', { size: 32, weight: 700, anchor: 'middle' });
  const tub1 = testTube(c1, 64, 200, { level: 0.6, liquid: '#8FD3F0', opacity: 0.45 }); tr(tub1, 330, 545);
  const clBub1 = bubbles(c1, 308, 555, 44, 78, { n: 5, r: 5, seed: 31, speed: 0.7 });
  const clMag = magnifier(c1, 50);
  const clue = chip(c1, 'only a clue', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy }); tr(clue, 330, 682);
  T(c3, 870, 372, 'several signs', { size: 32, weight: 700, anchor: 'middle' });
  const tub3 = testTube(c3, 64, 200, { level: 0.6, liquid: '#7FD1AE', opacity: 0.8 }); tr(tub3, 850, 545);
  const clBub3 = bubbles(c3, 828, 555, 44, 78, { n: 6, r: 5, seed: 33, speed: 0.8 });
  const clHeat = heatWaves(c3, { n: 2, h: 34, spacing: 22 }); tr(clHeat, 850, 438);
  const clTh = thermometer(c3, 150, C.bad); tr(clTh, 930, 627); clTh.set(0.75);
  const bigTick = tick(c3, 30, C.good); tr(bigTick, 1010, 515);
  const sure = chip(c3, 'almost certain', { size: 30, fill: 'rgba(86,214,155,0.16)', stroke: C.good, color: C.good }); tr(sure, 870, 680);

  /* ===== J. careful: physical changes that look like signs ===== */
  const cfG = G(root);
  const ket = kettle(cfG); tr(ket, 360, 560);
  const dyeBk = beaker(cfG, 170, 180, { level: 0.66, liquid: C.water, opacity: 0.6 }); tr(dyeBk, 850, 560);
  const dclip = 'cr-signs-dye', dcp = E('clipPath', { id: dclip }, defs());
  E('rect', { x: 770, y: 495, width: 160, height: 150 }, dcp);
  const dyeG = G(cfG, { 'clip-path': `url(#${dclip})` });
  const dyeCloud = E('ellipse', { cx: 850, cy: 560, rx: 30, ry: 24, fill: glow('#FF4F8B') }, dyeG);
  const swirls = [0, 1, 2].map(k => E('path', { fill: 'none', stroke: '#FF5F9E', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, dyeG));
  const dropper = G(cfG);
  E('rect', { x: -9, y: -86, width: 18, height: 70, rx: 4, fill: 'rgba(220,240,250,0.3)', stroke: '#CFE7F5', 'stroke-width': 3 }, dropper);
  E('path', { d: 'M-9,-16 L0,0 L9,-16 Z', fill: 'rgba(220,240,250,0.3)', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, dropper);
  E('rect', { x: -12, y: -116, width: 24, height: 34, rx: 10, fill: '#E8424F' }, dropper);
  tr(dropper, 850, 432);
  const dyeDrop = E('path', { d: 'M0,-12 C7,-4 9,1 9,5 A9,9 0 0 1 -9,5 C-9,1 -7,-4 0,-12 Z', fill: '#FF3F84' }, cfG);
  const tagK = chip(cfG, 'physical', { size: 30, fill: '#0F3747', stroke: PHY, color: PHY }); tr(tagK, 360, 684);
  const tagD = chip(cfG, 'physical', { size: 30, fill: '#0F3747', stroke: PHY, color: PHY }); tr(tagD, 850, 684);
  const warnG = G(cfG); tr(warnG, 600, 420);
  E('path', { d: 'M0,-46 L48,36 L-48,36 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, warnG);
  T(warnG, 0, 26, '!', { size: 56, weight: 700, anchor: 'middle', fill: C.bg0 });
  const notRx = G(cfG); tr(notRx, 600, 430);
  T(notRx, 0, 13, 'reaction', { size: 40, weight: 700, anchor: 'middle', fill: C.muted });
  const notX = cross(notRx, 40);
  const noNew = T(cfG, 600, 500, 'no new substance', { size: 28, weight: 700, anchor: 'middle', fill: '#BFE9FA' });

  /* ===== K. showpiece: the balloon ===== */
  const blG = G(root);
  const home = chip(blG, 'Try it at home', { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy }); tr(home, 1160 - home.w / 2, 60);
  const BX = 600, BY = 590;                         // bottle centre; its neck top is at (BX, BY - 180)
  const bot = bottle(blG); tr(bot, BX, BY);
  const foamG = G(bot.inside), foam = [], fr = rng(41);
  for (let k = 0; k < 11; k++) foam.push({ el: E('circle', { r: 11 + fr() * 9, fill: '#FBF6E4', stroke: '#E9DDB0', 'stroke-width': 1.5 }, foamG), x: (fr() - 0.5) * 160, dy: fr() * 26, ph: fr() });
  const blBub = bubbles(bot.inside, -80, 0, 160, 110, { n: 10, r: 6, seed: 43, speed: 0.95, color: '#FFF7D6' });
  const soda = [], sdr = rng(47);
  for (let k = 0; k < 8; k++) soda.push({ el: E('circle', { r: 3 + sdr() * 2.5, fill: '#FFFFFF' }, blG), dx: (sdr() - 0.5) * 16, dl: sdr() * 0.5 });
  const balloon = G(blG);
  const blBody = E('ellipse', { fill: ball('#FF6B8E', '#B8325A'), stroke: '#FFB3C6', 'stroke-width': 3 }, balloon);
  const blShine = E('ellipse', { fill: '#FFFFFF', opacity: 0.35 }, balloon);
  const sodaIn = G(balloon), sodaDots = [], sdi = rng(59);
  for (let k = 0; k < 6; k++) sodaDots.push({ el: E('circle', { r: 4 + sdi() * 3, fill: '#FFFFFF' }, sodaIn), u: (sdi() - 0.5) * 1.1, v: sdi() * 0.7 });
  const blWrinkle = E('path', { fill: 'none', stroke: '#B8325A', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, balloon);
  E('rect', { x: -14, y: -16, width: 28, height: 20, rx: 6, fill: '#E2507A', stroke: '#FFB3C6', 'stroke-width': 2 }, balloon);
  E('rect', { x: -18, y: -4, width: 36, height: 10, rx: 5, fill: '#C23F67' }, balloon);
  const co2s = [], cr = rng(53);
  for (let k = 0; k < 6; k++) co2s.push({ m: miniCO2(blG, 9), ux: (cr() - 0.5) * 1.3, uy: (cr() - 0.5) * 1.3, ph: cr() * TAU, dl: k * 0.16 });
  const lbVin = labelLine(blG, 330, 652, 520, 650, 'vinegar', { size: 30, anchor: 'end', line: C.ink, fill: '#EFE3A8' });
  const lbSoda = labelLine(blG, 330, 380, 520, 440, 'baking soda', { size: 30, anchor: 'end', line: C.ink });
  const lbSoda2 = labelLine(blG, 330, 380, 588, 470, 'baking soda', { size: 30, anchor: 'end', line: C.ink });
  const lbFizz = T(blG, 760, 560, 'fizz!', { size: 40, weight: 700, fill: C.energy });
  const lbCO2 = G(blG);
  T(lbCO2, 764, 250, 'carbon', { size: 34, weight: 700, fill: C.co2 });
  T(lbCO2, 764, 292, 'dioxide', { size: 34, weight: 700, fill: C.co2 });
  const tagGas = chip(blG, 'a new gas', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(tagGas, 844, 344);

  return t => {
    const tCol = at('colour'), tGas = at('gas'), tTmp = at('temp'), tPre = at('precip'), tDef = at('define'), tLt = at('light');
    const tGlow = at('glow'), tMn = at('mnem'), tClue = at('clue'), tCare = at('careful'), tBal = at('balloon');

    /* --- A. evidence --- */
    const aA = 1 - P(t, tCol - 0.35, 0.4, linear);
    op(evG, aA);
    if (aA > 0) {
      const bp = P(t, at('evidence') - 0.1, 0.6, pop);
      tr(evBk, 600, 352 + (1 - clamp(bp)) * 20); op(evBk, clamp(bp * 2));
      const dropU = P(t, mid('evidence', 0.08), 0.55, easeIn);
      op(evDrop, dropU > 0 && dropU < 1 ? 1 : 0); tr(evDrop, 600, lerp(170, 336, dropU));
      const rx_ = P(t, mid('evidence', 0.14), 1.6, ease);
      evBk.set(0.55, mix('#5AA8FF', '#56D69B', rx_));
      evBub.upd(t, rx_);
      evHeat.upd(t); op(evHeat, P(t, mid('evidence', 0.3), 0.6, linear) * 0.9);
      evSnd.set(t); op(evSnd, P(t, mid('evidence', 0.36), 0.6, linear));
      senses.forEach((s, i) => {
        const p = P(t, mid('evidence', 0.5 + i * 0.15), 0.5, pop);
        op(s.g, clamp(p * 2)); tr(s.g, s.x, s.y + (1 - clamp(p)) * 20, 0.8 + 0.2 * p);
      });
    }

    /* --- the tiles --- */
    const rowA = P(t, tCol - 0.35, 0.5, linear) * (1 - P(t, tBal - 0.2, 0.4, linear));
    op(tilesG, rowA);
    if (rowA > 0) {
      const ACT = [[tCol, tGas], [tGas, tTmp], [tTmp, tPre], [tPre, tLt], [tLt, tMn + 0.6]];
      const mnLit = win(t, tMn - 0.3, tClue + 0.2, 0.4);
      const two = P(t, mid('clue', 0.46), 0.4, linear), inClue = win(t, tClue - 0.1, tCare - 0.1, 0.3);
      tiles.forEach((o, i) => {
        const [a, b] = ACT[i];
        const lineLit = win(t, a - 0.1, b, 0.3);
        const clueLit = inClue * lerp(i === 1 ? 1 : 0, i <= 2 ? 1 : 0, two);
        const lit = Math.max(lineLit, mnLit, clueLit);
        const dim = Math.max(1 - P(t, a - 0.2, 0.4, linear), inClue * (1 - clueLit), 0.75 * P(t, tCare - 0.2, 0.4, linear));
        const letter = P(t, mid('mnem', 0.27 + i * 0.065), 0.35, pop);
        o.tile.set({ lit, dim, letter: clamp(letter * 1.5) });
        const pulse = Math.sin(Math.PI * P(t, a - 0.1, 0.6, linear)) + Math.sin(Math.PI * P(t, mid('mnem', 0.6 + i * 0.075), 0.5, linear)) * 0.8;
        tr(o.g, TX[i], TY + (1 - P(t, tCol - 0.35 + i * 0.06, 0.6, pop)) * -30, 1 + 0.06 * pulse);
        if (o.tk) {
          const tk = P(t, mid('clue', 0.5 + i * 0.07), 0.4, pop) * (1 - P(t, tCare - 0.2, 0.4, linear));
          op(o.tk, clamp(tk * 2)); tr(o.tk, 30, -90, Math.max(0.01, tk));
        }
      });
      const mg = win(t, tClue + 0.1, mid('clue', 0.46), 0.35);
      op(tileMag, mg); tr(tileMag, TX[1] + 34 + 6 * Math.sin(t * 1.5 * calm), TY + 6 + 4 * Math.cos(t * 1.2 * calm));
    }

    /* --- B. colour --- */
    const aB = win(t, tCol - 0.1, tGas + 0.1, 0.4);
    op(colG, aB);
    if (aB > 0) {
      const np = P(t, tCol + 0.05, 0.6, easeOut);
      tr(nailBig, 600, 476 + (1 - np) * 20, 1, 90); op(nailBig, np);
      nailBig.set({ rust: P(t, mid('colour', 0.4), 2.0, linear) });
      op(greyT, P(t, mid('colour', 0.36), 0.4, linear));
      colArrow.set(P(t, mid('colour', 0.5), 0.6)); op(colArrow, P(t, mid('colour', 0.5), 0.2, linear));
      op(rustT, P(t, mid('colour', 0.6), 0.4, linear));
    }

    /* --- C. gas --- */
    const aC = win(t, tGas - 0.1, tTmp + 0.1, 0.4);
    op(gasG, aC);
    if (aC > 0) {
      const on = P(t, tGas + 0.2, 0.6, linear);
      gBub.upd(t, on);
      fizz.forEach(f => {
        const u = (t * 1.1 + f.ph) % 1;
        attr(f.el, 'cx', 500 + f.dx * u); attr(f.el, 'cy', 404 - f.h * Math.sin(u * Math.PI * 0.9));
        op(f.el, on * (1 - u));
      });
      gLbl.set(P(t, mid('gas', 0.36), 0.4, linear));
      const bo = P(t, mid('gas', 0.48), 0.5, linear);
      op(burner, 0.35 + 0.65 * bo); op(offT, bo); op(offT2, P(t, mid('gas', 0.6), 0.4, linear));
      const xp = P(t, mid('gas', 0.54), 0.4, pop); op(offX, clamp(xp * 2)); tr(offX, 760, 494, Math.max(0.01, 0.4 + 0.6 * xp));
    }

    /* --- D. temperature --- */
    const aD = win(t, tTmp - 0.1, tPre + 0.1, 0.4);
    op(tmpG, aD);
    if (aD > 0) {
      const hp = P(t, mid('temp', 0.42), 1.4, ease), cp = P(t, mid('temp', 0.62), 1.4, ease);
      thHot.set(0.35 + 0.45 * hp); thCold.set(0.35 - 0.28 * cp);
      setText(rdHot, Math.round(20 + 16 * hp) + ' °C'); setText(rdCold, Math.round(20 - 12 * cp) + ' °C');
      hotWaves.upd(t); op(hotWaves, hp * 0.95); op(outArrows, hp * (0.6 + 0.4 * wave(t * calm, 1.2)));
      op(frostG, cp); op(inArrows, cp * (0.6 + 0.4 * wave(t * calm, 1.2)));
      op(lbHot, P(t, mid('temp', 0.5), 0.4, linear)); op(lbCold, P(t, mid('temp', 0.7), 0.4, linear));
    }

    /* --- E. precipitate + definition --- */
    const aE = win(t, tPre - 0.1, tLt + 0.1, 0.4);
    op(prG, aE);
    if (aE > 0) {
      const m0 = mid('precip', 0.3), m1 = mid('precip', 0.37);
      // each small tube slides over the big one, tips and pours, then fades
      [[pourL, streamL, 420, 497, 115, m0], [pourR, streamR, 780, 703, -115, m1]].forEach(([tb, st, x0, x1, ang, s0]) => {
        const mv = P(t, s0, 0.6, ease), pour = P(t, s0 + 0.55, 0.9, linear), gone = P(t, s0 + 1.6, 0.4, linear);
        const x = lerp(x0, x1, mv), y = lerp(600, 409, mv), a = ang * mv;
        tr(tb, x, y, 1, a); op(tb, P(t, tPre + 0.05, 0.4, linear) * (1 - gone));
        tb.set(0.55 * (1 - pour));
        const rad = a * Math.PI / 180, mx = x + 85 * Math.sin(rad), my = y - 85 * Math.cos(rad);
        const flow = pour > 0 && pour < 1;
        op(st, flow ? 0.75 : 0);
        if (flow) st.setAttribute('d', `M${mx.toFixed(1)},${my.toFixed(1)} Q600,${(my - 6).toFixed(1)} 600,${lerp(690, 600, pour).toFixed(1)}`);
      });
      op(clearL, P(t, tPre + 0.3, 0.4, linear) * (1 - P(t, m0, 0.3, linear)));
      op(clearR, P(t, tPre + 0.4, 0.4, linear) * (1 - P(t, m1, 0.3, linear)));
      const lvl = 0.28 * P(t, m0 + 0.55, 0.9, linear) + 0.28 * P(t, m1 + 0.55, 0.9, linear);
      const cloud = P(t, m0 + 0.9, 1.4, linear), settle = P(t, tDef - 0.4, 2.8, ease);
      mainT.set(lvl, mix(CLEAR, '#F3E27A', cloud * (1 - 0.8 * settle)));
      op(mainT, P(t, tPre - 0.05, 0.4, linear));
      const surf = 695 - 240 * lvl;
      specks.forEach((s, k) => {
        const yy = Math.max(surf + 8, s.y0);
        const x = lerp(s.x + Math.sin(t * 0.8 + s.ph) * 5 * calm, s.sx, settle), y = lerp(yy + Math.cos(t * 0.6 + s.ph) * 4 * calm, s.sy, settle);
        attr(s.el, 'cx', x); attr(s.el, 'cy', y);
        op(s.el, clamp(cloud * 2.4 - k * 0.03));
      });
      cloudLbl.set(P(t, mid('precip', 0.72), 0.4, linear) * (1 - P(t, tDef + 0.1, 0.4, linear)));
      defLbl.set(P(t, mid('define', 0.12), 0.5, linear));
      defLbl2.set(P(t, mid('define', 0.56), 0.5, linear));
    }

    /* --- F. light or sound --- */
    const aF = win(t, tLt - 0.1, tGlow + 0.1, 0.4);
    op(ltG, aF);
    if (aF > 0) {
      const on = [0.48, 0.6, 0.73, 0.86].map(f => P(t, mid('light', f) - 0.15, 0.45, pop));
      slots.forEach((g, i) => { op(g, clamp(on[i] * 2)); });
      cand.flame.set('yellow', Math.max(0.01, clamp(on[0]))); cand.flame.upd(t);
      op(emberHalo, clamp(on[1]) * (0.55 + 0.35 * wave(t * calm, 1.3))); op(emberCracks, 0.6 + 0.4 * wave(t * calm, 1.3, 0.3));
      const bg = P(t, mid('light', 0.73) - 0.15, 0.35, pop);
      tr(bang, 720, 520, Math.max(0.01, 0.4 + 0.6 * bg + 0.04 * Math.sin(t * 9) * calm));
      const amp = 10 * Math.exp(-Math.max(0, t - mid('light', 0.73)) * 0.6);
      ripL.set({ amp, phase: t * 1.6 }); ripR.set({ amp, phase: t * 1.6 });
      popFlame.set('yellow', 1); popFlame.upd(t);
      const pp = P(t, mid('light', 0.86) - 0.1, 0.4, pop);
      tr(popStar, 960, 660, Math.max(0.01, pp)); op(popStar, clamp(pp * 2));
    }

    /* --- G. glow stick in the dark --- */
    const aG = win(t, tGlow - 0.15, tMn + 0.1, 0.45);
    op(darkG, aG * 0.72);
    op(gwG, aG);
    if (aG > 0) {
      const bend = Math.sin(Math.PI * P(t, tGlow + 0.2, 1.1, linear)), snap = P(t, tGlow + 0.75, 0.5, linear);
      const lit = P(t, tGlow + 0.85, 1.2, easeOut);
      halves.forEach(o => {
        tr(o.h, 470, 520 - 26 * bend, 1, o.side * 16 * bend);
        op(o.lit, lit * (0.85 + 0.15 * wave(t * calm, 2.2)));
      });
      op(snapFx, Math.sin(Math.PI * snap)); tr(snapFx, 470, 500, 0.5 + Math.sin(Math.PI * snap)); snapFx.upd(t);
      op(stickHalo, lit * (0.75 + 0.15 * wave(t * calm, 2.2)));
      thGw.set(0.3 + 0.03 * P(t, mid('glow', 0.6), 2, linear));
      setText(rdGw, P(t, mid('glow', 0.6), 2, linear) > 0.6 ? '21 °C' : '20 °C');
      op(gwLight, P(t, mid('glow', 0.56), 0.4, linear));
      op(gwHeat, P(t, mid('glow', 0.78), 0.4, linear));
    }

    /* --- H. mnemonic --- */
    const aH = win(t, tMn - 0.1, tClue + 0.1, 0.4);
    op(mnG, aH);
    if (aH > 0) words.forEach((w, i) => {
      const p = P(t, mid('mnem', 0.27 + i * 0.065), 0.4, pop);
      op(w.t1, clamp(p * 2)); w.t1.setAttribute('transform', `translate(0 ${((1 - clamp(p)) * 16).toFixed(1)})`);
      op(w.t2, P(t, mid('mnem', 0.6 + i * 0.075), 0.4, linear));
    });

    /* --- I. clue --- */
    const aI = win(t, tClue - 0.1, tCare + 0.1, 0.4);
    op(clG, aI);
    if (aI > 0) {
      const p1 = P(t, tClue + 0.05, 0.5, pop), p3 = P(t, mid('clue', 0.46), 0.5, pop);
      op(c1, clamp(p1 * 2)); op(c3, clamp(p3 * 2)); tr(c3, (1 - clamp(p3)) * 30, 0);
      clBub1.upd(t, 1); clBub3.upd(t, 1); clHeat.upd(t);
      tr(clMag, 352 + 8 * Math.sin(t * 1.3 * calm), 567 + 6 * Math.cos(t * 1.1 * calm));
      const bt = P(t, mid('clue', 0.56), 0.45, pop); op(bigTick, clamp(bt * 2)); tr(bigTick, 1010, 515, Math.max(0.01, bt));
      op(clue, P(t, mid('clue', 0.2), 0.4, linear)); op(sure, P(t, mid('clue', 0.6), 0.4, linear));
    }

    /* --- J. careful --- */
    const aJ = win(t, tCare - 0.1, tBal + 0.1, 0.4);
    op(cfG, aJ);
    if (aJ > 0) {
      op(warnG, win(t, tCare, mid('careful', 0.74), 0.3));
      tr(warnG, 600, 420, 0.9 + 0.1 * Math.sin(Math.PI * P(t, tCare, 0.5, linear)));
      const kp = P(t, mid('careful', 0.1), 0.5, pop); op(ket, clamp(kp * 2)); tr(ket, 360, 560 + (1 - clamp(kp)) * 20);
      ket.bub.upd(t, 1); ket.steam.upd(t);
      const dp = P(t, mid('careful', 0.34), 0.5, pop); op(dyeBk, clamp(dp * 2)); op(dropper, clamp(dp * 2));
      const fall = P(t, mid('careful', 0.42), 0.45, easeIn), spread = P(t, mid('careful', 0.42) + 0.45, 3.2, easeOut);
      op(dyeDrop, fall > 0 && fall < 1 ? 1 : 0); tr(dyeDrop, 850, lerp(440, 520, fall));
      dyeBk.set(0.66, mix(C.water, '#D86AB4', spread * 0.8));
      op(dyeCloud, spread > 0 ? 0.9 * (1 - 0.5 * spread) : 0); dyeCloud.setAttribute('rx', (20 + 70 * spread).toFixed(1)); dyeCloud.setAttribute('ry', (16 + 54 * spread).toFixed(1));
      dyeCloud.setAttribute('cy', (528 + 40 * spread).toFixed(1));
      swirls.forEach((sw, k) => {
        const pts = [];
        for (let j = 0; j <= 10; j++) { const a = j * 0.62 + k * 2.1 + t * 0.5 * calm, r = (6 + j * 5.5) * (0.3 + 0.9 * spread); pts.push([850 + Math.cos(a) * r, 536 + 26 * spread + Math.sin(a) * r * 0.7]); }
        sw.setAttribute('d', openPath(pts)); op(sw, spread > 0 ? 0.85 * (1 - 0.6 * spread) : 0);
      });
      const tk1 = P(t, mid('careful', 0.6), 0.45, pop), tk2 = P(t, mid('careful', 0.66), 0.45, pop);
      op(tagK, clamp(tk1 * 2)); tr(tagK, 360, 684, 0.85 + 0.15 * tk1);
      op(tagD, clamp(tk2 * 2)); tr(tagD, 850, 684, 0.85 + 0.15 * tk2);
      const nr = P(t, mid('careful', 0.76), 0.45, pop); op(notRx, clamp(nr * 2));
      const nx = P(t, mid('careful', 0.76) + 0.3, 0.4, pop); op(notX, clamp(nx * 2)); tr(notX, 0, 0, Math.max(0.01, 0.4 + 0.6 * nx));
      op(noNew, P(t, mid('careful', 0.84), 0.4, linear));
    }

    /* --- K. the balloon --- */
    const aK = P(t, tBal - 0.15, 0.45, linear);
    op(blG, aK);
    if (aK > 0) {
      op(home, P(t, tBal, 0.4, linear));
      const tip = P(t, mid('balloon', 0.3), 0.9, ease);          // balloon swings upright
      const pourS = P(t, mid('balloon', 0.36), 1.0, linear);     // soda falls in
      const fz2 = P(t, mid('balloon', 0.44), 0.8, linear);       // fizzing starts
      const inf = P(t, mid('balloon', 0.72), 2.2, easeOut);      // balloon inflates
      bot.liq.setAttribute('y', 30);
      blBub.upd(t, fz2);
      foam.forEach(f => {
        const u = (t * 0.6 + f.ph) % 1, top = 24 - fz2 * (46 + 20 * inf);
        attr(f.el, 'cx', f.x + Math.sin(t * 2 + f.ph * 9) * 3); attr(f.el, 'cy', top + f.dy * (1 - fz2 * 0.4) + Math.sin(u * TAU) * 3);
        op(f.el, fz2);
      });
      // balloon: floppy and drooping to the left -> upright -> round
      const rx = lerp(34, 112, inf), ry = lerp(48, 128, inf), rot = lerp(-128, 0, tip);
      const cy = -(ry + 12);
      attr(blBody, 'cx', 0); attr(blBody, 'cy', cy); attr(blBody, 'rx', rx); attr(blBody, 'ry', ry);
      attr(blShine, 'cx', -rx * 0.38); attr(blShine, 'cy', cy - ry * 0.4); attr(blShine, 'rx', rx * 0.18); attr(blShine, 'ry', ry * 0.24);
      // the powder lies at the low end of the drooping balloon, then at its top end once tipped up
      const dir = 1 - 2 * tip, low = cy - dir * ry * 0.62;
      sodaDots.forEach(d => { attr(d.el, 'cx', d.u * rx * 0.8); attr(d.el, 'cy', low + dir * d.v * ry * 0.4); });
      op(sodaIn, 1 - pourS);
      blWrinkle.setAttribute('d', `M${-rx * 0.5},${cy - ry * 0.1} q${rx * 0.25},${-ry * 0.2} ${rx * 0.5},0 M${-rx * 0.3},${cy + ry * 0.35} q${rx * 0.3},${-ry * 0.12} ${rx * 0.6},0`);
      op(blWrinkle, 0.7 * (1 - inf));
      tr(balloon, BX, BY - 180, 1, rot + (1 - tip) * 4 * Math.sin(t * 1.4 * calm));
      soda.forEach(s => {
        const u = clamp((pourS - s.dl * 0.5) / 0.5);
        attr(s.el, 'cx', BX + s.dx * (1 - u * 0.5)); attr(s.el, 'cy', lerp(BY - 186, BY + 20, easeIn(u)));
        op(s.el, u > 0 && u < 1 ? 1 : 0);
      });
      co2s.forEach((o, k) => {
        const u = clamp((inf - o.dl * 0.4) / 0.6);
        const tx = BX + o.ux * rx * 0.7 + Math.sin(t * 0.9 + o.ph) * 6 * calm, ty = BY - 180 + cy + o.uy * ry * 0.7 + Math.cos(t * 0.8 + o.ph) * 6 * calm;
        tr(o.m, lerp(BX, tx, u), lerp(BY - 120, ty, u), 1, (t * 30 + k * 40) * calm % 360);
        op(o.m, P(t, mid('balloon', 0.6) + k * 0.08, 0.3, linear) * clamp(u * 5));
      });
      lbVin.set(P(t, mid('balloon', 0.16), 0.4, linear));
      lbSoda.set(P(t, mid('balloon', 0.2), 0.4, linear) * (1 - P(t, mid('balloon', 0.31), 0.3, linear)));
      lbSoda2.set(P(t, mid('balloon', 0.36), 0.3, linear) * (1 - P(t, mid('balloon', 0.5), 0.4, linear)));
      op(lbFizz, P(t, mid('balloon', 0.48), 0.3, linear) * (0.7 + 0.3 * wave(t, 0.5)));
      op(lbCO2, P(t, mid('balloon', 0.64), 0.4, linear));
      const gp = P(t, mid('balloon', 0.7), 0.45, pop); op(tagGas, clamp(gp * 2)); tr(tagGas, 844, 344, Math.max(0.01, 0.8 + 0.2 * gp));
    }
  };
});

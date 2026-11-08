/* Chapter 7, Exothermic and endothermic.
   Beats: a reaction trades energy with its surroundings -> EXOTHERMIC (warm, left): heat streams out
   of the beaker and its thermometer climbs -> combustion, neutralisation, oxidation, and a hand warmer
   whose iron rusts fast -> the EXO = EXIT sign -> ENDOTHERMIC (cold, right): energy flows in, frost
   forms, the thermometer falls -> thermal decomposition, dissolving salts, a cold pack on an ankle
   -> the ENDO = ENTER sign -> showpiece: two fresh beakers, one thermometer rising and one falling;
   the "temperature change" sign lights -> the trap: a cold tube in your hand, heat flows from the
   hand into it -> bonds as springs: breaking them takes energy in, making new ones gives more out. */
scene('energy', S => {
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
  const star4 = (x, y, s) => `M${x.toFixed(1)},${(y - s).toFixed(1)} L${(x + s * 0.28).toFixed(1)},${(y - s * 0.28).toFixed(1)} L${(x + s).toFixed(1)},${y.toFixed(1)} L${(x + s * 0.28).toFixed(1)},${(y + s * 0.28).toFixed(1)} L${x.toFixed(1)},${(y + s).toFixed(1)} L${(x - s * 0.28).toFixed(1)},${(y + s * 0.28).toFixed(1)} L${(x - s).toFixed(1)},${y.toFixed(1)} L${(x - s * 0.28).toFixed(1)},${(y - s * 0.28).toFixed(1)} Z`;
  const starsD = list => list.map(([x, y, s]) => star4(x, y, s)).join(' ');
  const dots = list => list.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`).join(' ');
  const DROP = 'M0,-13 C6,-5 9,1 9,5 A9,9 0 0 1 -9,5 C-9,1 -6,-5 0,-13 Z';
  const flameD = (h, w) => `M0,0 C${-w},${-h * 0.3} ${-w * 0.7},${-h * 0.7} 0,${-h} C${w * 0.7},${-h * 0.7} ${w},${-h * 0.3} 0,0 Z`;
  /* frost sparkles scattered over a w x h box centred on (cx, cy) */
  function frostList(seed, n, cx, cy, w, h, s0) { const r = rng(seed), out = []; for (let i = 0; i < n; i++) out.push([cx + (r() - 0.5) * w, cy + (r() - 0.5) * h, (s0 || 4) + r() * 5]); return out; }
  /* arrows that stream out from (or in to) a centre */
  function rays(parent, cx, cy, angles, r0, len, color, inward, width) {
    const w = width || 6;
    return angles.map((deg, k) => {
      const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), g = G(parent);
      const p1 = inward ? r0 + len : r0, p2 = inward ? r0 : r0 + len;
      arrow(g, cx + c * p1, cy + s * p1, cx + c * p2, cy + s * p2, { color, width: w, head: w * 3 });
      return { g, c, s, k, n: angles.length, dir: inward ? -1 : 1 };
    });
  }
  function streamRays(list, t, on, speed) {
    list.forEach(r => {
      const u = (t * (speed || 0.55) + r.k / r.n) % 1, d = (u - 0.4) * 34 * r.dir * (0.4 + 0.6 * AMP);
      tr(r.g, r.c * d, r.s * d);
      op(r.g, on * Math.sin(u * Math.PI));
    });
  }
  /* a reaction beaker with a thermometer and a readout; side +1 puts the thermometer on the right */
  function rig(parent, liquid, side) {
    const g = G(parent);
    const bk = beaker(g, 170, 180, { level: 0.62, liquid, opacity: 0.72 });
    const bub = bubbles(g, -62, -4, 124, 86, { n: 6, r: 6, seed: side > 0 ? 3 : 9, speed: 0.4 });
    const frost = E('path', { d: '', fill: '#EAF8FF' }, g);
    const thG = G(g);
    const th = thermometer(thG, 250, C.bad); tr(th, side * 40, 56);
    const rx = side > 0 ? 66 : -178;
    E('rect', { x: rx, y: -206, width: 112, height: 46, rx: 12, fill: C.card, stroke: C.line, 'stroke-width': 2.5 }, thG);
    const read = T(thG, rx + 56, -172, '20 °C', { size: 30, weight: 700, anchor: 'middle' });
    return { g, bk, bub, frost, thG, th, read, last: '' };
  }
  function setTemp(r, deg) { r.th.set(clamp(deg / 45)); const s = Math.round(deg) + ' °C'; if (r.last !== s) { r.last = s; setText(r.read, s); } }
  /* a bond drawn as a spring between two atom edges */
  function springD(a, b, ra, rb, off) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const x0 = a[0] + ux * ra + nx * off, y0 = a[1] + uy * ra + ny * off, len = L - ra - rb;
    if (len < 3) return '';
    const n = 6, amp = Math.max(1.5, 7 - len * 0.05);
    let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`;
    for (let i = 1; i <= n; i++) { const f = i / (n + 1), z = (i % 2 ? 1 : -1) * amp; d += ` L${(x0 + ux * len * f + nx * z).toFixed(1)},${(y0 + uy * len * f + ny * z).toFixed(1)}`; }
    return d + ` L${(x0 + ux * len).toFixed(1)},${(y0 + uy * len).toFixed(1)}`;
  }

  /* ================= backgrounds: warm left, cold right ================= */
  const warm = E('ellipse', { cx: 300, cy: 440, rx: 420, ry: 350, fill: glow(C.heat) }, root);
  const cold = E('ellipse', { cx: 900, cy: 440, rx: 420, ry: 350, fill: glow(C.water) }, root);

  /* ================= A. energy crosses between a reaction and its surroundings ================= */
  const A = G(root);
  const aPaths = [[505, 405, 350, 335, C.heat], [505, 500, 350, 570, C.heat], [850, 335, 695, 405, C.water], [850, 570, 695, 500, C.water]];
  const aArrows = aPaths.map(([x1, y1, x2, y2, c]) => arrow(A, x1, y1, x2, y2, { color: c, width: 7 }));
  const aSparks = aPaths.map((p, k) => spark(A, 11, { seed: k }));
  const aLab = [
    T(A, 230, 288, 'surroundings', { size: 28, weight: 600, anchor: 'middle', fill: C.muted }),
    T(A, 970, 288, 'surroundings', { size: 28, weight: 600, anchor: 'middle', fill: C.muted }),
    T(A, 600, 598, 'the reaction', { size: 28, weight: 700, anchor: 'middle' }),
    T(A, 330, 466, 'energy out', { size: 28, weight: 700, anchor: 'middle', fill: C.heat }),
    T(A, 880, 466, 'energy in', { size: 28, weight: 700, anchor: 'middle', fill: C.water }),
  ];

  /* ================= the two reaction beakers ================= */
  const EX = rig(root, '#C9E4A6', 1), EN = rig(root, '#8FD8F7', -1);
  EN.frost.setAttribute('d', starsD(frostList(12, 16, 0, 10, 160, 170, 4)));

  /* ================= B. exothermic ================= */
  const exHead = G(root);
  T(exHead, 300, 172, 'exothermic', { size: 56, weight: 700, anchor: 'middle', fill: C.heat });
  T(exHead, 300, 216, 'gives out energy', { size: 30, weight: 600, anchor: 'middle' });
  const exRayG = G(root);
  const exRays = rays(exRayG, 300, 450, [180, -150, -30, 0, 30, 150], 112, 52, C.heat, false);
  const exWaves = heatWaves(root, { n: 3, h: 84, spacing: 26 }); tr(exWaves, 268, 344);
  const hotter = G(root);
  T(hotter, 830, 414, 'the surroundings', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  rich(hotter, 830, 474, [['get '], ['hotter', C.heat, 700]], { size: 50, anchor: 'middle' });
  // examples: combustion, neutralisation, oxidation, and a hand warmer
  const exEg = G(root);
  const exCards = [[702, 'combustion'], [887, 'neutralisation'], [1072, 'oxidation']].map(([x, label]) => {
    const g = G(exEg); tr(g, x, 300);
    card(g, -88, -76, 176, 152, { fill: C.card, stroke: C.line, rx: 18 });
    const halo = E('ellipse', { cx: 0, cy: -16, rx: 74, ry: 52, fill: glow(C.heat) }, g);
    const icon = G(g); tr(icon, 0, -16);
    T(g, 0, 58, label, { size: 26, weight: 600, anchor: 'middle' });
    return { g, halo, icon, x };
  });
  const egFlame = rxFlame(exCards[0].icon, 0.5); tr(egFlame, 0, 32);
  const nIcon = exCards[1].icon;
  E('path', { d: 'M-27,2 L27,2 L27,24 Q27,30 21,30 L-21,30 Q-27,30 -27,24 Z', fill: C.plant, opacity: 0.85 }, nIcon);
  E('path', { d: 'M-31,-24 L-27,-20 L-27,24 Q-27,31 -20,31 L20,31 Q27,31 27,24 L27,-20 L31,-24', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, nIcon);
  const nDrops = [['#FF6B6B', -12], ['#7B8CFF', 12]].map(([c, x]) => { const d = E('path', { d: DROP, fill: c }, nIcon); return { d, x }; });
  const oIcon = G(exCards[2].icon); tr(oIcon, 0, 4, 1, 35);
  E('path', { d: 'M-5,-38 L5,-38 L5,26 L0,40 L-5,26 Z', fill: RX.rust, stroke: '#7A3A1C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, oIcon);
  E('rect', { x: -15, y: -44, width: 30, height: 8, rx: 3, fill: '#8C4A2A' }, oIcon);
  E('path', { d: dots([[1, -20, 4], [-1, -2, 5], [1, 16, 4]]), fill: RX.rustLt }, oIcon);
  const hw = G(exEg); tr(hw, 887, 500);
  card(hw, -273, -76, 546, 152, { fill: C.card, stroke: C.line, rx: 18 });
  const hwHalo = E('ellipse', { cx: -168, cy: 4, rx: 140, ry: 92, fill: glow(C.heat) }, hw);
  const pouch = G(hw); tr(pouch, -168, 10);
  E('rect', { x: -80, y: -48, width: 160, height: 96, rx: 24, fill: ball('#F06A5E', '#B3392F'), stroke: '#FFB3A8', 'stroke-width': 3 }, pouch);
  E('rect', { x: -62, y: -32, width: 124, height: 64, rx: 14, fill: '#3A2A28', opacity: 0.75 }, pouch);
  const powderList = []; { const r = rng(4); for (let i = 0; i < 26; i++) powderList.push([-54 + r() * 108, -24 + r() * 48, 3.2 + r() * 2.2]); }
  const powder = E('path', { d: dots(powderList), fill: '#9AA5AE' }, pouch);
  const hwWaves = heatWaves(hw, { n: 3, h: 56, spacing: 36 }); tr(hwWaves, -168, -44);
  T(hw, -54, -6, 'hand warmer', { size: 34, weight: 700 });
  rich(hw, -54, 38, [['iron rusts '], ['very fast', RX.rustLt, 700]], { size: 28 });
  // EXO = EXIT
  const exitG = G(root);
  const exitSign = rxSignBoard(exitG, 'EXO = EXIT', { size: 52 });
  const exitTxt = rich(exitG, 800, 462, [['energy '], ['exits', C.heat, 700], [', so it gets '], ['warmer', C.heat, 700]], { size: 32, anchor: 'middle' });

  /* ================= C. endothermic ================= */
  const enHead = G(root);
  T(enHead, 900, 172, 'endothermic', { size: 56, weight: 700, anchor: 'middle', fill: C.water });
  T(enHead, 900, 216, 'takes energy in', { size: 30, weight: 600, anchor: 'middle' });
  const enRayG = G(root);
  const enRays = rays(enRayG, 900, 450, [0, -30, -150, 180, 150, 30], 112, 52, C.water, true);
  const colder = G(root);
  T(colder, 370, 414, 'the surroundings', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  rich(colder, 370, 474, [['get '], ['colder', C.water, 700]], { size: 50, anchor: 'middle' });
  // examples: thermal decomposition, dissolving some salts, an instant cold pack
  const enEg = G(root);
  const enCards = [[168, ['thermal', 'decomposition']], [418, ['dissolving', 'certain salts']]].map(([x, lines]) => {
    const g = G(enEg); tr(g, x, 300);
    card(g, -115, -76, 230, 152, { fill: C.card, stroke: C.line, rx: 18 });
    const icon = G(g); tr(icon, 0, -26);
    T(g, 0, 36, lines[0], { size: 26, weight: 600, anchor: 'middle' });
    T(g, 0, 64, lines[1], { size: 26, weight: 600, anchor: 'middle' });
    return { g, icon, x };
  });
  const tdI = enCards[0].icon;
  const tdFl = E('path', { d: flameD(34, 10), fill: '#5AA8FF', stroke: '#CFEAFF', 'stroke-width': 1.5, transform: 'translate(-24 40)' }, tdI);
  const tdTube = G(tdI); tr(tdTube, -10, -6, 1, -40);
  E('path', { d: 'M-7,14 L-7,22 A7,7 0 0 0 7,22 L7,14 Z', fill: RX.cuOxide }, tdTube);
  E('path', { d: 'M-9,-34 L-9,22 A9,9 0 0 0 9,22 L9,-34', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linecap': 'round' }, tdTube);
  const tdIn = arrow(tdI, 70, 26, 22, 22, { color: C.water, width: 5 });
  const dsI = enCards[1].icon;
  E('path', { d: 'M-30,0 L30,0 L30,26 Q30,32 24,32 L-24,32 Q-30,32 -30,26 Z', fill: '#8FD8F7', opacity: 0.7 }, dsI);
  E('path', { d: 'M-34,-26 L-30,-22 L-30,26 Q-30,33 -23,33 L23,33 Q30,33 30,26 L30,-22 L34,-26', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, dsI);
  const xtals = [[-14, 0], [6, 0.35], [20, 0.7]].map(([x, ph]) => ({ el: E('rect', { x: -6, y: -6, width: 12, height: 12, rx: 2, fill: '#F4F8FB', stroke: '#B9C9D6', 'stroke-width': 1.5 }, dsI), x, ph }));
  const dsFrost = E('path', { d: starsD([[-42, -8, 6], [44, 4, 7], [-40, 26, 5], [40, -22, 5]]), fill: '#EAF8FF' }, dsI);
  const cp = G(enEg); tr(cp, 313, 500);
  card(cp, -273, -76, 546, 152, { fill: C.card, stroke: C.line, rx: 18 });
  const cpHalo = E('ellipse', { cx: -160, cy: 6, rx: 130, ry: 86, fill: glow(C.water) }, cp);
  const leg = G(cp); tr(leg, -160, 6);
  E('path', { d: 'M-66,-74 L-18,-74 C-16,-40 -14,-10 -10,12 C-6,26 6,34 30,38 L70,46 C84,49 86,66 72,68 L-50,68 C-66,68 -70,56 -68,40 C-66,0 -68,-40 -66,-74 Z', fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, leg);
  const pack = G(leg); tr(pack, -36, 18, 1, -12);
  E('rect', { x: -40, y: -30, width: 80, height: 60, rx: 14, fill: ball('#7FD3F7', '#2B87B8'), stroke: '#D5F2FF', 'stroke-width': 3 }, pack);
  E('path', { d: 'M0,-17 L0,17 M-15,-8.5 L15,8.5 M-15,8.5 L15,-8.5', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, pack);
  const cpFrost = E('path', { d: starsD([[-86, -40, 7], [30, -30, 6], [-90, 30, 6], [40, 10, 5], [-70, -66, 5]]), fill: '#EAF8FF' }, leg);
  T(cp, -54, -6, 'instant cold pack', { size: 32, weight: 700 });
  T(cp, -54, 38, 'for sports injuries', { size: 28, weight: 600, fill: '#BFEFFF' });
  // ENDO = ENTER
  const enterG = G(root);
  const enterSign = rxSignBoard(enterG, 'ENDO = ENTER', { size: 52, kind: 'enter' });
  const enterTxt = rich(enterG, 400, 462, [['energy '], ['enters', C.water, 700], [', so it gets '], ['colder', C.water, 700]], { size: 32, anchor: 'middle' });

  /* ================= D. the thermometer tells you which ================= */
  const thmG = G(root);
  const tile = rxSignTile(thmG, 'temp', { size: 170 }); tr(tile, 600, 372);
  const tileLab = T(thmG, 600, 494, 'a sign of a reaction', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  function verdict(x, up, word, col) {
    const g = G(thmG), tw = textWidth(word, 34, FD, 700) + textWidth(up ? 'rise = ' : 'fall = ', 34, FD, 600), x0 = x - (tw + 40) / 2;
    arrow(g, x0 + 10, up ? 624 : 588, x0 + 10, up ? 584 : 628, { color: col, width: 7, head: 20 });
    rich(g, x0 + 40, 618, [[up ? 'rise = ' : 'fall = '], [word, col, 700]], { size: 34 });
    return g;
  }
  const vExo = verdict(300, true, 'exothermic', C.heat), vEndo = verdict(900, false, 'endothermic', C.water);

  /* ================= E. the trap: it feels cold because heat leaves your hand ================= */
  const trapG = G(root);
  const tubeG = G(trapG); tr(tubeG, 480, 392);
  const tTube = testTube(tubeG, 66, 262, { level: 0.8, liquid: '#8FD8F7', opacity: 0.75 });
  E('path', { d: starsD(frostList(21, 9, 0, 40, 60, 200, 3.5)), fill: '#EAF8FF', opacity: 0.85 }, tubeG);
  const hand = G(tubeG); tr(hand, 0, 30);
  const SKIN = ball('#EDB48C', '#B9774F'), SK = '#9C5F3C';
  E('path', { d: 'M-104,64 C-132,130 -150,210 -160,330 L-54,330 C-46,240 -40,170 -32,112 Z', fill: ball('#E3A67E', '#A8673F'), stroke: SK, 'stroke-width': 2.5 }, hand);
  E('path', { d: 'M-24,10 C-76,6 -106,32 -106,70 C-106,108 -80,132 -30,134 Z', fill: SKIN, stroke: SK, 'stroke-width': 2.5 }, hand);
  [[16, 86], [44, 88], [72, 84], [100, 74]].forEach(([y, w]) => E('rect', { x: -42, y, width: w, height: 27, rx: 13.5, fill: SKIN, stroke: SK, 'stroke-width': 2.5 }, hand));
  E('rect', { x: -48, y: -14, width: 80, height: 26, rx: 13, fill: SKIN, stroke: SK, 'stroke-width': 2.5, transform: 'rotate(-14 -48 -1)' }, hand);
  const handGlow = E('ellipse', { cx: -20, cy: 70, rx: 120, ry: 110, fill: glow(C.heat) }, tubeG);
  tubeG.insertBefore(handGlow, hand);
  const handRays = [[-112, 40, -16, -40], [-112, 92, -18, 0], [84, 46, 16, -34], [10, 40, 6, -56]].map(([x1, y1, x2, y2], k) => {
    const g = G(tubeG); arrow(g, x1, y1, x2, y2, { color: '#FF9A4D', width: 8, head: 24 });
    const L = Math.hypot(x2 - x1, y2 - y1); return { g, c: (x2 - x1) / L, s: (y2 - y1) / L, k, n: 4, dir: 1 };
  });
  const trapTxt = G(trapG);
  rich(trapTxt, 690, 318, [['feels '], ['cold', C.water, 700], [', not hot']], { size: 46 });
  const trapA = rich(trapG, 690, 402, [['heat flows '], ['out of your hand', C.heat, 700]], { size: 30 });
  const trapB = rich(trapG, 690, 446, [['and '], ['into', C.heat, 700], [' the reaction']], { size: 30 });

  /* ================= F. bonds: breaking takes energy in, making gives energy out ================= */
  const bnG = G(root);
  const bnTitle = rich(bnG, 600, 168, [['the energy is in the '], ['bonds', C.energy, 700]], { size: 42, anchor: 'middle' });
  const bnEq = rxFormula(bnG, 440, 238, '2H2 + O2 → 2H2O', { size: 40 });
  const springG = G(bnG);
  const springs = [0, 1, 2, 3, 4, 5, 6, 7].map(() => E('path', { d: '', fill: 'none', stroke: '#D5E0E7', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, springG));
  const snaps = [0, 1, 2].map(() => E('circle', { r: 16, fill: glow('#FFFFFF') }, bnG));
  const AT = [
    ['H', 18, [150, 330], [125, 312], [640, 373]], ['H', 18, [220, 330], [245, 312], [740, 373]],
    ['H', 18, [150, 470], [125, 488], [640, 513]], ['H', 18, [220, 470], [245, 488], [740, 513]],
    ['O', 24, [345, 400], [322, 392], [690, 335]], ['O', 24, [435, 400], [458, 408], [690, 475]],
  ].map(([sym, r, a, b, c]) => ({ g: rxAtom(bnG, sym, r), r, a, b, c }));
  const inArrows = [[185, 266, 185, 310], [185, 534, 185, 490], [390, 330, 390, 380]].map(([x1, y1, x2, y2]) => arrow(bnG, x1, y1, x2, y2, { color: C.water, width: 5, head: 15 }));
  const bnGhost = G(bnG); bnG.insertBefore(bnGhost, springG);
  [['H', 17], ['O', 23]].forEach(([sym, r]) => E('path', { d: AT.filter(o => o.r === r + 1).map(o => `M${o.a[0] - r},${o.a[1]} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`).join(' '), fill: 'none', stroke: ATOM[sym][0], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, bnGhost));
  const outRayG = G(bnG);
  const outRays = rays(outRayG, 690, 335, [-150, -90, -30], 66, 48, C.heat, false, 7).concat(rays(outRayG, 690, 475, [180, 90, 0], 66, 44, C.heat, false, 7));
  const barIn = meter(bnG, { w: 56, h: 230, vertical: true, color: C.water, label: 'energy in', labelSize: 26, labelFill: C.water }); tr(barIn, 872, 272);
  const barOut = meter(bnG, { w: 56, h: 230, vertical: true, color: C.heat, label: 'energy out', labelSize: 26, labelFill: C.heat }); tr(barOut, 1012, 272);
  const brkLab = rich(bnG, 285, 640, [['breaking bonds: energy '], ['in', C.water, 700]], { size: 28, anchor: 'middle' });
  const mkLab = rich(bnG, 690, 640, [['making bonds: energy '], ['out', C.heat, 700]], { size: 28, anchor: 'middle' });
  const bnSum = rich(bnG, 600, 702, [['more out than in = '], ['exothermic', C.heat, 700]], { size: 38, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    const tExo = at('exo'), tEndo = at('endo'), tThermo = at('thermo'), tTrap = at('trap'), tBonds = at('bonds');

    /* backgrounds */
    op(warm, 0.38 * Math.max(win(t, mid('exo', 0.08), tEndo + 0.2, 0.7), win(t, tThermo + 0.1, tTrap + 0.1, 0.6)));
    op(cold, 0.38 * Math.max(win(t, mid('endo', 0.08), tThermo - 0.1, 0.7), win(t, tThermo + 0.1, tTrap + 0.1, 0.6)));

    /* A */
    const aA = win(t, S.first - 0.1, tExo + 0.2, 0.4);
    op(A, aA);
    if (aA > 0) {
      aArrows.forEach((a, k) => { const t0 = mid('energy', k < 2 ? 0.25 : 0.45); a.set(P(t, t0, 0.6)); op(a, P(t, t0, 0.2, linear)); });
      aSparks.forEach((s, k) => {
        const [x1, y1, x2, y2] = aPaths[k], t0 = mid('energy', k < 2 ? 0.35 : 0.55), u = ((t - t0) / 1.4 + (k % 2) * 0.5) % 1;
        tr(s, lerp(x1, x2, u), lerp(y1, y2, u), 0.8); op(s, t > t0 ? Math.sin(u * Math.PI) : 0); s.upd(t);
      });
      [0.05, 0.12, 0.15, 0.3, 0.5].forEach((f, k) => op(aLab[k], P(t, mid('energy', f), 0.4, linear)));
    }

    /* the exothermic beaker: centre stage, then the left side; it comes back fresh for the thermometers */
    const exA = Math.max(win(t, S.first - 0.1, tEndo + 0.25, 0.4), win(t, tThermo + 0.05, tTrap + 0.15, 0.4));
    op(EX.g, exA);
    if (exA > 0) {
      const mv = P(t, tExo - 0.1, 0.9);
      tr(EX.g, lerp(600, 300, mv), 450);
      EX.bk.set(0.62, mix('#C9E4A6', '#FFB37A', P(t, mid('exo', 0.1), 1.0, linear)));
      EX.bub.upd(t, 1);
      op(EX.thG, t < tThermo ? P(t, mid('exo', 0.12), 0.5, linear) : 1);
      setTemp(EX, t < tThermo ? lerp(20, 38, P(t, mid('exo', 0.3), 3.0, ease)) : lerp(20, 38, P(t, mid('thermo', 0.22), 2.2, ease)));
    }
    const exOn = win(t, mid('exo', 0.08), tEndo + 0.1, 0.4);
    op(exHead, exOn); tr(exHead, 0, (1 - P(t, mid('exo', 0.08), 0.6, easeOut)) * 12);
    op(exRayG, exOn); if (exOn > 0) streamRays(exRays, t, P(t, mid('exo', 0.18), 0.6, linear), 0.6);
    op(exWaves, exOn * P(t, mid('exo', 0.2), 0.6, linear) * 0.9); exWaves.upd(t);
    op(hotter, win(t, mid('exo', 0.62), at('exoegs') + 0.1, 0.4));
    const egOn = win(t, at('exoegs') - 0.05, at('exit') + 0.1, 0.4);
    op(exEg, egOn);
    if (egOn > 0) {
      const hot = P(t, mid('exoegs', 0.36), 0.6, linear);
      exCards.forEach((c, k) => { const p = P(t, mid('exoegs', [0.02, 0.12, 0.25][k]), 0.5, pop); op(c.g, clamp(p * 2)); tr(c.g, c.x, 300 + (1 - clamp(p)) * 20, Math.max(0.01, 0.8 + 0.2 * p)); op(c.halo, hot * (0.55 + 0.25 * wave(t, 1.2, k * 0.3))); });
      egFlame.set('yellow', 1); egFlame.upd(t);
      nDrops.forEach((o, k) => { const u = ((t - at('exoegs')) / 1.2 + k * 0.5) % 1; tr(o.d, o.x, lerp(-46, 6, easeIn(u)), 0.75); op(o.d, Math.min(1, u * 5, (1 - u) * 4)); });
      const hp = P(t, mid('exoegs', 0.55), 0.5, pop); op(hw, clamp(hp * 2)); tr(hw, 887, 500 + (1 - clamp(hp)) * 20);
      const rusting = P(t, mid('exoegs', 0.68), 2.0, linear);
      powder.setAttribute('fill', mix('#9AA5AE', '#C2622F', rusting));
      op(hwHalo, rusting * (0.6 + 0.3 * wave(t, 1.1))); op(hwWaves, rusting); hwWaves.upd(t);
    }
    const exitOn = win(t, at('exit') - 0.05, tEndo + 0.1, 0.4);
    op(exitG, exitOn);
    if (exitOn > 0) { const sp = P(t, at('exit'), 0.6, pop); tr(exitSign, 800, 332, Math.max(0.01, 0.7 + 0.3 * sp)); op(exitTxt, P(t, mid('exit', 0.42), 0.4, linear)); }

    /* the endothermic beaker on the right */
    const enA = Math.max(win(t, tEndo - 0.05, tThermo - 0.05, 0.35), win(t, tThermo + 0.05, tTrap + 0.15, 0.4));
    op(EN.g, enA);
    if (enA > 0) {
      tr(EN.g, 900, 450);
      EN.bub.upd(t, 1);
      op(EN.thG, t < tThermo ? P(t, mid('endo', 0.1), 0.5, linear) : 1);
      setTemp(EN, t < tThermo ? lerp(20, 4, P(t, mid('endo', 0.32), 2.5, ease)) : lerp(20, 4, P(t, mid('thermo', 0.46), 2.2, ease)));
      const fr = t < tThermo ? P(t, mid('endo', 0.4), 2.0, linear) : P(t, mid('thermo', 0.5), 2.0, linear);
      op(EN.frost, fr * (0.55 + 0.35 * wave(t, 1.7)));
    }
    const enOn = win(t, mid('endo', 0.06), tThermo, 0.4);
    op(enHead, enOn); tr(enHead, 0, (1 - P(t, mid('endo', 0.06), 0.6, easeOut)) * 12);
    op(enRayG, enOn); if (enOn > 0) streamRays(enRays, t, P(t, mid('endo', 0.16), 0.6, linear), 0.6);
    op(colder, win(t, mid('endo', 0.62), at('endoegs') + 0.1, 0.4));
    const eeOn = win(t, at('endoegs') - 0.05, at('enter') + 0.1, 0.4);
    op(enEg, eeOn);
    if (eeOn > 0) {
      enCards.forEach((c, k) => { const p = P(t, mid('endoegs', [0.02, 0.34][k]), 0.5, pop); op(c.g, clamp(p * 2)); tr(c.g, c.x, 300 + (1 - clamp(p)) * 20, Math.max(0.01, 0.8 + 0.2 * p)); });
      tdFl.setAttribute('transform', `translate(-24 40) scale(1 ${(1 + 0.08 * AMP * Math.sin(t * 13)).toFixed(3)})`);
      tdIn.set(P(t, mid('endoegs', 0.1), 0.6)); op(tdIn, 0.6 + 0.4 * wave(t, 1.1));
      xtals.forEach(o => { const u = ((t - at('endoegs')) / 2.2 + o.ph) % 1, k = 1 - P(u, 0.55, 0.45, linear); tr(o.el, o.x, lerp(-40, 18, easeOut(Math.min(1, u * 1.8))), Math.max(0.01, k), u * 90); op(o.el, Math.min(1, u * 8) * k); });
      op(dsFrost, P(t, mid('endoegs', 0.42), 0.6, linear) * (0.5 + 0.4 * wave(t, 1.5)));
      const cpp = P(t, mid('endoegs', 0.6), 0.5, pop); op(cp, clamp(cpp * 2)); tr(cp, 313, 500 + (1 - clamp(cpp)) * 20);
      const chill = P(t, mid('endoegs', 0.72), 1.2, linear);
      op(cpHalo, chill * (0.55 + 0.25 * wave(t, 1.3))); op(cpFrost, chill * (0.5 + 0.4 * wave(t, 1.6, 0.3)));
      tr(pack, -36, 18 + Math.sin(Math.PI * P(t, mid('endoegs', 0.66), 0.5, linear)) * 6, 1, -12);
    }
    const enterOn = win(t, at('enter') - 0.05, tThermo + 0.1, 0.4);
    op(enterG, enterOn);
    if (enterOn > 0) { const sp = P(t, at('enter'), 0.6, pop); tr(enterSign, 400, 332, Math.max(0.01, 0.7 + 0.3 * sp)); op(enterTxt, P(t, mid('enter', 0.42), 0.4, linear)); }

    /* D: two thermometers and the temperature-change sign */
    const thOn = win(t, tThermo, tTrap + 0.1, 0.4);
    op(thmG, thOn);
    if (thOn > 0) {
      op(vExo, P(t, mid('thermo', 0.26), 0.4, linear)); op(vEndo, P(t, mid('thermo', 0.5), 0.4, linear));
      const tp = P(t, mid('thermo', 0.68), 0.5, pop);
      op(tile, clamp(tp * 2)); tr(tile, 600, 372, Math.max(0.01, 0.7 + 0.3 * tp));
      tile.set({ lit: P(t, mid('thermo', 0.74), 0.4, linear), letter: P(t, mid('thermo', 0.8), 0.4, linear) });
      op(tileLab, P(t, mid('thermo', 0.82), 0.4, linear));
    }

    /* E: the trap */
    const trOn = win(t, tTrap, tBonds + 0.1, 0.4);
    op(trapG, trOn);
    if (trOn > 0) {
      const hp = P(t, tTrap + 0.1, 0.6, easeOut);
      tr(tubeG, 480, 392 + (1 - hp) * 30);
      op(trapTxt, P(t, mid('trap', 0.18), 0.4, linear));
      const flow = P(t, mid('trap', 0.5), 0.5, linear);
      handRays.forEach(r => { const u = (t * 0.6 + r.k / r.n) % 1, d = (u - 0.35) * 30 * (0.4 + 0.6 * AMP); tr(r.g, r.c * d, r.s * d); op(r.g, flow * (0.35 + 0.65 * Math.sin(u * Math.PI))); });
      op(handGlow, flow * (0.45 + 0.2 * wave(t, 1.2)));
      op(trapA, P(t, mid('trap', 0.52), 0.4, linear)); op(trapB, P(t, mid('trap', 0.72), 0.4, linear));
    }

    /* F: bonds */
    const bnOn = P(t, tBonds - 0.05, 0.5, linear);
    op(bnG, bnOn);
    if (bnOn > 0) {
      op(bnTitle, P(t, mid('bonds', 0.08), 0.5, linear)); op(bnEq, P(t, mid('bonds', 0.12), 0.5, linear));
      const B0 = mid('bonds', 0.17), SNAP = B0 + 1.3, M0 = mid('bonds', 0.47), MADE = M0 + 1.1;
      const appear = P(t, tBonds + 0.1, 0.5, pop);
      const stretch = P(t, B0 + 0.3, 1.0, easeIn), apart = P(t, SNAP, 0.6, easeOut), go = P(t, M0, 1.1);
      const pos = AT.map(o => {
        let p;
        if (go > 0) p = arcPt(o.b, o.c, go, 70);
        else if (apart > 0) p = [lerp(lerp(o.a[0], o.b[0], 0.45), o.b[0], apart), lerp(lerp(o.a[1], o.b[1], 0.45), o.b[1], apart)];
        else p = [lerp(o.a[0], o.b[0], 0.45 * stretch), lerp(o.a[1], o.b[1], 0.45 * stretch)];
        tr(o.g, p[0], p[1], Math.max(0.01, appear));
        return p;
      });
      // old bonds stretch, then snap
      const oldOn = t < SNAP ? 1 : 0;
      springs[0].setAttribute('d', oldOn ? springD(pos[0], pos[1], 18, 18, 0) : '');
      springs[1].setAttribute('d', oldOn ? springD(pos[2], pos[3], 18, 18, 0) : '');
      springs[2].setAttribute('d', oldOn ? springD(pos[4], pos[5], 24, 24, -7) : '');
      springs[3].setAttribute('d', oldOn ? springD(pos[4], pos[5], 24, 24, 7) : '');
      [[0, 1], [2, 3], [4, 5]].forEach(([i, j], k) => { const f = P(t, SNAP - 0.05, 0.5, linear); tr(snaps[k], (pos[i][0] + pos[j][0]) / 2, (pos[i][1] + pos[j][1]) / 2, 0.5 + 2 * f); op(snaps[k], f > 0 && f < 1 ? 1 - f : 0); });
      inArrows.forEach((a, k) => { const p = P(t, B0 + k * 0.12, 0.5); a.set(p); op(a, p > 0 ? 1 - 0.45 * P(t, SNAP + 0.1, 0.4, linear) : 0); });
      op(bnGhost, 0.5 * P(t, M0 + 0.4, 0.5, linear));
      // new bonds snap together
      const made = P(t, MADE - 0.1, 0.35, pop);
      [[4, 0], [4, 1], [5, 2], [5, 3]].forEach(([i, j], k) => { springs[4 + k].setAttribute('d', t >= MADE - 0.1 ? springD(pos[i], pos[j], 24, 18, 0) : ''); op(springs[4 + k], clamp(made * 2)); });
      op(springG, 1);
      op(outRayG, P(t, MADE, 0.4, linear)); if (t > MADE) streamRays(outRays, t, 1, 0.7);
      // roughly to scale for 2H2 + O2 -> 2H2O: about 1370 kJ to break the bonds, 1850 kJ given out making new ones
      barIn.set(0.66 * P(t, B0 + 0.3, 1.2, easeOut)); barOut.set(0.9 * P(t, MADE - 0.1, 1.3, easeOut));
      op(barIn, P(t, B0, 0.4, linear)); op(barOut, P(t, B0, 0.4, linear));
      op(brkLab, P(t, B0 + 0.2, 0.4, linear)); op(mkLab, P(t, MADE, 0.4, linear));
      const sp = P(t, mid('bonds', 0.76), 0.5, pop); op(bnSum, clamp(sp * 2)); tr(bnSum, 0, (1 - clamp(sp)) * 14);
    }
  };
  /* point on a curve from a to b that bows up by lift px */
  function arcPt(a, b, u, lift) { const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - lift, v = 1 - u; return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]]; }
});

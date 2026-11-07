/* Chapter 1, Acids, bases and alkalis.
   Beats: acid particles drop into water and split, releasing H⁺ ions (sour) -> citric acid in lemons,
   ethanoic acid in vinegar -> stomach acid and its mucus lining -> ACID and BASE chips meet and cancel
   -> bases: copper oxide and magnesium hydroxide -> an alkali dissolves (a soluble base) -> sodium
   hydroxide, ammonia, soapy cleaners -> the Venn diagram: alkalis inside bases -> copper oxide stays
   undissolved: a base, but not an alkali. */
scene('acids', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hx(a), B = hx(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
  let clipN = 0;
  const clipTo = d => { const id = 'am-acids-c' + (++clipN); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popAt = (el, x, y, p, s0) => { s0 = s0 === undefined ? 0.6 : s0; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* a leader line whose ends can move: g.to(x1, y1, x2, y2) */
  function leader(parent, color) {
    const g = G(parent);
    const l = E('line', { stroke: color || C.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    const d = E('circle', { r: 4.5, fill: color || C.muted }, g);
    g.to = (x1, y1, x2, y2) => { attr(l, 'x1', x1); attr(l, 'y1', y1); attr(l, 'x2', x2); attr(l, 'y2', y2); attr(d, 'cx', x2); attr(d, 'cy', y2); };
    return g;
  }
  const scaleAbout = (el, cx, cy, x, y, s) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${Math.max(0.01, s).toFixed(4)}) translate(${-cx} ${-cy})`);

  const RED = '#E8424F', REDDK = '#9E1F2B', ACIDTXT = '#FF7A86', BLUE = '#3F8FE8', BLUETXT = '#6FB2FF', CLEAR = '#CFE7F5';

  /* ---------- shared art: ions ---------- */
  function badge(parent, r, sign) {
    const g = G(parent);
    E('circle', { r, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, g);
    E('path', { d: sign > 0 ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* an acid particle: a red partner joined to a white H; when it splits, the H becomes H⁺ */
  function acidParticle(parent) {
    const p = { g: G(parent) };
    p.part = G(p.g);
    E('circle', { r: 17, fill: ball(RED, REDDK), stroke: REDDK, 'stroke-width': 1.5 }, p.part);
    p.mb = badge(p.part, 7.5, -1); tr(p.mb, 13, -13);
    p.h = G(p.g);
    atom(p.h, 'H', 14);
    p.pb = badge(p.h, 7.5, 1); tr(p.pb, 11, -11);
    return p;
  }

  /* ---------- other art ---------- */
  function lemonSlice(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#FFD84D', '#D9A21A'), stroke: '#C48F12', 'stroke-width': 4 }, g);
    E('circle', { r: r * 0.88, fill: '#FFF4C4' }, g);
    for (let i = 0; i < 10; i++) {
      const a0 = i / 10 * TAU + 0.06, a1 = (i + 1) / 10 * TAU - 0.06, ro = r * 0.8, ri = r * 0.13;
      E('path', { d: `M${(Math.cos(a0) * ri).toFixed(1)},${(Math.sin(a0) * ri).toFixed(1)} L${(Math.cos(a0) * ro).toFixed(1)},${(Math.sin(a0) * ro).toFixed(1)} A${ro},${ro} 0 0 1 ${(Math.cos(a1) * ro).toFixed(1)},${(Math.sin(a1) * ro).toFixed(1)} L${(Math.cos(a1) * ri).toFixed(1)},${(Math.sin(a1) * ri).toFixed(1)} Z`, fill: '#FFE04D', stroke: '#F5C82E', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    }
    E('circle', { r: r * 0.12, fill: '#FFF8DA' }, g);
    E('path', { d: `M${-r * 0.55},${-r * 0.5} A${r * 0.74},${r * 0.74} 0 0 1 ${r * 0.2},${-r * 0.72}`, fill: 'none', stroke: '#ffffff', 'stroke-width': 4, opacity: 0.45, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function vinegarBottle(parent) {
    const g = G(parent);
    E('rect', { x: -22, y: -152, width: 44, height: 32, rx: 6, fill: '#C0392B', stroke: '#8E2A20', 'stroke-width': 2 }, g);
    const body = 'M-20,-122 L-20,-92 Q-66,-70 -66,-26 L-66,112 Q-66,130 -48,130 L48,130 Q66,130 66,112 L66,-26 Q66,-70 20,-92 L20,-122 Z';
    E('path', { d: body, fill: 'rgba(200,230,250,0.12)' }, g);
    E('path', { d: 'M-62,-36 L62,-36 L62,110 Q62,126 46,126 L-46,126 Q-62,126 -62,110 Z', fill: '#D9B26A', opacity: 0.82 }, g);
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -56, y: 8, width: 112, height: 70, rx: 8, fill: '#F4F7FA', stroke: '#C9D3DC', 'stroke-width': 2 }, g);
    T(g, 0, 52, 'vinegar', { size: 27, weight: 700, anchor: 'middle', fill: '#8E2A20' });
    E('rect', { x: 42, y: -20, width: 8, height: 120, rx: 4, fill: '#ffffff', opacity: 0.22 }, g);
    return g;
  }
  /* stomach: a J-shaped pouch; returns { g, inner path d } */
  const SOUT = [[-58, -150], [-120, -168], [-180, -118], [-200, -20], [-172, 82], [-92, 150], [18, 166], [122, 128], [190, 58], [214, -8], [206, -58], [150, -40], [84, 6], [12, 18], [-38, -22], [-46, -104]];
  const SIN = SOUT.map(([x, y]) => [8 + (x - 8) * 0.86, 22 + (y - 22) * 0.86]);
  function stomach(parent) {
    const g = G(parent);
    E('path', { d: 'M-52,-232 L-52,-128', stroke: '#B8466A', 'stroke-width': 52, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-52,-232 L-52,-128', stroke: '#F48FB0', 'stroke-width': 42, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M200,-34 L262,-70', stroke: '#B8466A', 'stroke-width': 46, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M200,-34 L262,-70', stroke: '#F48FB0', 'stroke-width': 36, 'stroke-linecap': 'round' }, g);
    E('path', { d: closedPath(SOUT), fill: ball('#F7A3BF', '#B8466A'), stroke: '#FFD0DC', 'stroke-width': 4 }, g);
    const inD = closedPath(SIN);
    E('path', { d: inD, fill: '#5A1E33', stroke: '#8E3456', 'stroke-width': 3 }, g);
    return { g, inD };
  }
  function dish(parent, fillTop, fillBot, speck, seed) {
    const g = G(parent), q = rng(seed);
    E('ellipse', { cx: 0, cy: 40, rx: 150, ry: 14, fill: '#000000', opacity: 0.25 }, g);
    E('path', { d: 'M-140,0 A140,16 0 0 1 140,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3, opacity: 0.7 }, g);
    E('path', { d: 'M-140,0 Q-132,36 0,38 Q132,36 140,0 A140,16 0 0 1 -140,0 Z', fill: 'rgba(200,230,250,0.12)' }, g);
    const pts = [[-108, 10]];
    for (let i = 1; i < 12; i++) { const x = -108 + i * 216 / 12, h = Math.sin(i / 12 * Math.PI) * 64 * (0.86 + q() * 0.28); pts.push([x, 10 - h]); }
    pts.push([108, 10]);
    E('path', { d: openPath(pts) + ' Z', fill: linGrad(fillTop, fillBot, true), stroke: fillBot, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    for (let i = 0; i < 22; i++) { const x = (q() - 0.5) * 170, top = 10 - Math.sin((x + 108) / 216 * Math.PI) * 56; E('circle', { cx: x.toFixed(1), cy: (lerp(top + 6, 8, q())).toFixed(1), r: (1.5 + q() * 2).toFixed(1), fill: speck }, g); }
    E('path', { d: 'M-140,0 Q-132,36 0,38 Q132,36 140,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5 }, g);
    E('path', { d: 'M-140,0 A140,16 0 0 0 140,0', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
    return g;
  }
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
  function soapBubble(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: 'rgba(170,215,255,0.12)', stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 2.5 }, g);
    E('path', { d: `M${-r * 0.55},${-r * 0.2} A${r * 0.6},${r * 0.6} 0 0 1 ${-r * 0.1},${-r * 0.62}`, fill: 'none', stroke: '#ffffff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    E('path', { d: `M${r * 0.3},${r * 0.55} A${r * 0.7},${r * 0.7} 0 0 0 ${r * 0.62},${r * 0.18}`, fill: 'none', stroke: '#F5A3FF', 'stroke-width': 2, opacity: 0.6 }, g);
    return g;
  }
  /* a small heap of powder, for icons */
  function heap(parent, fillTop, fillBot, w) {
    const g = G(parent); w = w || 60;
    E('path', { d: `M${-w},8 Q${-w * 0.6},${-w * 0.55} 0,${-w * 0.62} Q${w * 0.6},${-w * 0.55} ${w},8 Z`, fill: linGrad(fillTop, fillBot, true), stroke: fillBot, 'stroke-width': 2 }, g);
    return g;
  }

  /* ================= acid: particles split and release H⁺ ================= */
  const A = G(root);
  const BKX = 360, BKY = 450;
  const bkG = G(A);
  const bkA = beaker(bkG, 300, 300, { level: 0.72, liquid: CLEAR, opacity: 0.28 }); tr(bkA, BKX, BKY);
  const SURF = BKY + 150 - 282 * 0.72;
  const PP = [[260, 455], [380, 440], [470, 470], [300, 545], [430, 560]];
  const HP = [[320, 490], [430, 505], [480, 540], [240, 520], [365, 520]];
  const JA = [20, -150, 160, -40, 200];                       // angle of the joined H
  const pr = rng(12);
  const particles = PP.map(([px, py], i) => {
    const p = acidParticle(bkG);
    Object.assign(p, { px, py, hx: HP[i][0], hy: HP[i][1], ja: JA[i] * Math.PI / 180, td: 1.95 + i * 0.3, ts: 3.45 + i * 0.22, ph: pr() * TAU, ph2: pr() * TAU });
    p.flash = E('circle', { r: 34, fill: glow('#FFFFFF') }, bkG);
    return p;
  });
  const hLead = leader(A, C.ink);
  const hLbl = rich(A, 566, 478, [['H⁺', '#FFFFFF', 800], ' hydrogen ions'], { size: 30, weight: 600 });
  const defA = G(A);
  T(defA, 620, 232, 'acid', { size: 76, weight: 700, fill: ACIDTXT });
  const defA2 = rich(defA, 620, 296, ['releases ', ['hydrogen ions', '#FFFFFF', 800], ', ', ['H⁺', '#FFFFFF', 800]], { size: 34, weight: 500 });
  const defA3 = T(defA, 620, 342, 'when it dissolves in water', { size: 30, weight: 500, fill: C.muted });
  const sour = G(A);
  const sourChip = chip(sour, 'tastes **sour**', { size: 32, fill: '#3A3210', stroke: '#FFD84D', color: '#FFF4C4' }); tr(sourChip, 40, 0);
  const sourLemon = G(sour); tr(sourLemon, -sourChip.w / 2 - 4, 0); lemonSlice(sourLemon, 26);

  /* ================= everyday acids ================= */
  const B = G(root);
  const dayChip = chip(B, 'acids every day', { size: 32, fill: '#3A1820', stroke: RED, color: ACIDTXT });
  const lemonG = G(B); lemonSlice(lemonG, 100);
  const vinG = G(B); vinegarBottle(vinG);
  const LX = 430, VX = 830;
  const lemName = T(B, LX, 566, 'citric acid', { size: 36, weight: 700, anchor: 'middle', fill: ACIDTXT });
  const lemNote = T(B, LX, 604, 'in lemons', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const vinName = T(B, VX, 566, 'ethanoic acid', { size: 36, weight: 700, anchor: 'middle', fill: ACIDTXT });
  const vinNote = T(B, VX, 604, '(also called acetic acid)', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= stomach acid and mucus ================= */
  const Cs = G(root);
  const STX = 470, STY = 430;
  const stG = G(Cs); tr(stG, STX, STY);
  const st = stomach(stG);
  const stClip = clipTo(st.inD);
  const poolG = G(stG, { 'clip-path': stClip });
  const pool = E('rect', { x: -260, y: 60, width: 520, height: 220, fill: '#FF5A36', opacity: 0.9 }, poolG);
  const poolTop = E('rect', { x: -260, y: 60, width: 520, height: 6, fill: '#FFB08A', opacity: 0.8 }, poolG);
  const foods = [[-70, '#C99A5B'], [-30, '#7FBF5A'], [10, '#D9B26A'], [-50, '#B07A4F']].map(([x, c]) => ({ x, el: E('rect', { x: -9, y: -9, width: 18, height: 18, rx: 4, fill: c, stroke: '#5A3A20', 'stroke-width': 1.5 }, poolG) }));
  const bubSt = [0, 1, 2, 3, 4].map(k => E('circle', { r: 3 + (k % 2) * 2, fill: 'none', stroke: '#FFD2B8', 'stroke-width': 1.5 }, poolG));
  const mucG = G(stG, { 'clip-path': clipTo(closedPath(SOUT)) });
  const mucusGlow = E('path', { d: st.inD, fill: 'none', stroke: '#FFE6F4', 'stroke-width': 30, opacity: 0, 'stroke-linejoin': 'round' }, mucG);
  const mucus = E('path', { d: st.inD, fill: 'none', stroke: '#FBE3F0', 'stroke-width': 16, opacity: 0.45, 'stroke-linejoin': 'round' }, mucG);
  const stName = T(Cs, 230, 196, 'stomach', { size: 32, weight: 700, anchor: 'middle', fill: '#F7A8C8' });
  const hclLbl = labelLine(Cs, 760, 586, 560, 536, 'hydrochloric acid', { size: 32, weight: 700, fill: ACIDTXT, line: ACIDTXT });
  const hclNote = T(Cs, 760, 624, 'helps digest food', { size: 26, weight: 500, fill: C.muted });
  const mucLbl = labelLine(Cs, 760, 300, 600, 400, 'mucus', { size: 32, weight: 700, fill: '#FBD3E6', line: '#FBD3E6' });
  const mucNote = T(Cs, 760, 338, 'protects the lining', { size: 26, weight: 500, fill: C.muted });

  /* ================= base: the chemical opposite ================= */
  const D = G(root);
  const neutGlow = E('ellipse', { cx: 600, cy: 370, rx: 330, ry: 170, fill: glow(C.good) }, D);
  const acidChip = chip(D, 'ACID', { size: 50, fill: RED, color: '#FFFFFF', w: 200, h: 92 });
  const baseChip = chip(D, 'BASE', { size: 50, fill: BLUE, color: '#FFFFFF', w: 200, h: 92 });
  const acidGreen = chip(acidChip, 'ACID', { size: 50, fill: C.good, color: '#0A2A1C', w: 200, h: 92 });
  const baseGreen = chip(baseChip, 'BASE', { size: 50, fill: C.good, color: '#0A2A1C', w: 200, h: 92 });
  const meetFlash = E('ellipse', { rx: 170, ry: 110, fill: glow('#FFFFFF') }, D);
  const oppArrow = G(D);
  arrow(oppArrow, 540, 370, 660, 370, { color: C.muted, width: 5 }); arrow(oppArrow, 660, 370, 540, 370, { color: C.muted, width: 5 });
  const oppTxt = T(D, 600, 470, 'chemical opposites', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const cancelTxt = T(D, 600, 515, 'they cancel out', { size: 44, weight: 700, anchor: 'middle', fill: C.good });
  const neutTxt = rich(D, 600, 566, ['a base can ', ['neutralise', C.good, 800], ' an acid'], { size: 30, weight: 500, anchor: 'middle' });

  /* ================= bases: metal oxides and hydroxides ================= */
  const Ox = G(root);
  const basesChip = chip(Ox, 'BASES', { size: 40, fill: '#173A5C', stroke: BLUE, color: BLUETXT });
  const dishL = G(Ox); dish(dishL, '#3A4148', '#121518', '#5A646E', 5);
  const dishR = G(Ox); dish(dishR, '#FFFFFF', '#C3CCD5', '#AEB8C2', 9);
  const catL = T(Ox, 360, 336, 'metal oxide', { size: 36, weight: 700, anchor: 'middle', fill: BLUETXT });
  const catR = T(Ox, 840, 336, 'metal hydroxide', { size: 36, weight: 700, anchor: 'middle', fill: BLUETXT });
  const nmL = T(Ox, 360, 550, 'copper oxide', { size: 32, weight: 600, anchor: 'middle' });
  const nmR = T(Ox, 840, 550, 'magnesium hydroxide', { size: 32, weight: 600, anchor: 'middle' });
  const nmL2 = T(Ox, 360, 588, 'black powder', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });
  const nmR2 = T(Ox, 840, 588, 'white powder', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= alkali: a base that dissolves ================= */
  const AKX = 240, AKY = 440;
  const akG = G(root);
  const akB = beaker(akG, 240, 280, { level: 0.7, liquid: CLEAR, opacity: 0.28 }); tr(akB, AKX, AKY);
  const AKSURF = AKY + 140 - 262 * 0.7;
  const pellets = [[-60, 0], [-22, 1], [18, 2], [54, 3], [-40, 4], [34, 5]].map(([x, k]) => ({ x: AKX + x, k, el: E('rect', { x: -11, y: -6, width: 22, height: 12, rx: 6, fill: '#F7F9FA', stroke: '#C9D3DC', 'stroke-width': 1.5 }, akG), cloud: E('circle', { r: 26, fill: glow('#BFE0FF') }, akG) }));
  const defK = G(root);
  T(defK, 520, 248, 'alkali', { size: 76, weight: 700, fill: BLUETXT });
  const defK2 = rich(defK, 520, 316, ['a base that ', ['dissolves', '#FFFFFF', 800], ' in water'], { size: 36, weight: 500 });
  const solChip = chip(defK, 'a **soluble** base', { size: 34, fill: '#173A5C', stroke: BLUE, color: '#DCEBFF' });
  const akName = T(root, AKX, 640, 'sodium hydroxide', { size: 32, weight: 700, anchor: 'middle', fill: BLUETXT });
  const alkHead = chip(root, 'ALKALIS', { size: 34, fill: '#173A5C', stroke: BLUE, color: BLUETXT });

  /* ================= examples: ammonia sprays, soapy cleaners ================= */
  const SPX = 500, SPY = 440;
  const spG = G(root); sprayBottle(spG);
  const spName = T(root, SPX, 640, 'ammonia', { size: 32, weight: 700, anchor: 'middle', fill: BLUETXT });
  const spNote = T(root, SPX, 676, 'in cleaning sprays', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });
  const mist = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 5, fill: '#CFF3EA' }, root));
  const Ex = G(root);
  const soaps = [[20, 0.0, 0], [14, 0.27, 1], [26, 0.5, 2], [12, 0.68, 3], [18, 0.84, 4], [10, 0.12, 5], [16, 0.4, 6]].map(([r, ph, k]) => ({ g: soapBubble(Ex, r), ph, k, x: 820 + (k * 47) % 150 }));
  const soapTxt = rich(Ex, 890, 300, ['feels ', ['soapy', '#FFFFFF', 800]], { size: 40, weight: 500, anchor: 'middle' });
  const cleanChip = G(Ex);
  const clc = chip(cleanChip, 'many are cleaners', { size: 32, fill: '#123F3A', stroke: '#3CC7B0', color: '#CFF3EA' });
  const sparkle = spark(cleanChip, 14, { color: '#CFF3EA', seed: 2 }); tr(sparkle, clc.w / 2 + 6, -clc.h / 2 + 4);

  /* ================= venn: all alkalis are bases ================= */
  const Vn = G(root);
  const VB = [870, 425, 270], VA = [815, 500, 165];
  const bigFill = E('circle', { cx: VB[0], cy: VB[1], r: VB[2], fill: 'rgba(63,143,232,0.10)' }, Vn);
  const bigC = E('circle', { cx: VB[0], cy: VB[1], r: VB[2], fill: 'none', stroke: BLUE, 'stroke-width': 5, pathLength: 1, 'stroke-dasharray': '1 1', transform: `rotate(-90 ${VB[0]} ${VB[1]})` }, Vn);
  const bigLbl = T(Vn, VB[0], 210, 'BASES', { size: 42, weight: 700, anchor: 'middle', fill: BLUETXT });
  const inG = G(Vn);
  E('circle', { cx: 0, cy: 0, r: VA[2], fill: 'rgba(160,205,255,0.16)', stroke: '#A9D0FF', 'stroke-width': 4 }, inG);
  T(inG, 0, -102, 'ALKALIS', { size: 34, weight: 700, anchor: 'middle', fill: '#CFE4FF' });
  T(inG, 0, -70, '(soluble bases)', { size: 26, weight: 500, anchor: 'middle', fill: '#A9C6E8' });
  const inNa = T(Vn, 765, 590, 'sodium\nhydroxide', { size: 26, weight: 600, anchor: 'middle', lh: 30 });
  const inAm = T(Vn, 885, 590, 'ammonia', { size: 26, weight: 600, anchor: 'middle' });
  const st1 = rich(Vn, 70, 196, [['All', '#FFFFFF', 800], ' alkalis are bases'], { size: 38, weight: 500 });
  const st2 = rich(Vn, 70, 252, ['but ', ['not all', '#FFFFFF', 800], ' bases are alkalis'], { size: 38, weight: 500 });

  /* ================= cuo: copper oxide does not dissolve ================= */
  const Cu = G(root);
  const CUX = 290, CUY = 460;
  const cuB = beaker(Cu, 240, 280, { level: 0.7, liquid: CLEAR, opacity: 0.28 }); tr(cuB, CUX, CUY);
  const CUSURF = CUY + 140 - 262 * 0.7;
  const cuName = T(Cu, CUX, 270, 'copper oxide', { size: 34, weight: 700, anchor: 'middle' });
  const cuHeap = G(Cu); heap(cuHeap, '#3A4148', '#121518', 62);
  const cr = rng(31), cuGrains = [];
  for (let k = 0; k < 16; k++) cuGrains.push({ el: E('circle', { r: 3 + cr() * 2.5, fill: '#1E2328', stroke: '#4A535B', 'stroke-width': 1 }, Cu), x: CUX + (cr() - 0.5) * 70, t0: 0.12 + k * 0.035, sink: 0.7 + cr() * 0.5, ex: CUX + (cr() - 0.5) * 100 });
  const cuLbl = labelLine(Cu, 448, 606, 352, 578, "doesn't dissolve", { size: 28, weight: 600, fill: C.ink });
  const okRow = G(Cu);
  T(okRow, 170, 694, 'base', { size: 34, weight: 700, fill: BLUETXT });
  const okTick = tick(okRow, 16); tr(okTick, 268, 682);
  const noRow = G(Cu);
  T(noRow, 320, 694, 'alkali', { size: 34, weight: 700, fill: '#A9C6E8' });
  const noCross = cross(noRow, 14); tr(noCross, 432, 682);
  const cuIcon = G(root); heap(cuIcon, '#3A4148', '#121518', 34);
  const cuIconLbl = T(root, 1020, 364, 'copper oxide', { size: 26, weight: 600, anchor: 'middle' });

  return t => {
    const tB = at('everyday'), tC = at('stomach'), tD = at('base'), tO = at('oxides'), tK = at('alkali'), tX = at('examples'), tV = at('venn'), tU = at('cuo');

    /* ---------- acid ---------- */
    const aA = P(t, S.first - 0.3, 0.5, linear) * (1 - P(t, tC - 0.3, 0.5, linear));
    op(A, aA);
    if (aA > 0) {
      const shrink = P(t, tB - 0.1, 0.9);
      scaleAbout(bkG, BKX, BKY, lerp(BKX, 150, shrink), lerp(BKY, 628, shrink), lerp(1, 0.36, shrink));
      particles.forEach((p, i) => {
        const fall = P(t, p.td, 0.55, easeIn), sink = P(t, p.td + 0.55, 0.7, easeOut);
        const dx = (Math.sin(t * 0.7 + p.ph) * 7 + Math.sin(t * 0.31 + p.ph2) * 5) * AMP, dy = (Math.cos(t * 0.6 + p.ph2) * 6) * AMP;
        const x = p.px + dx * sink, y = lerp(140, SURF + 14, fall) + (p.py - SURF - 14) * sink + dy * sink;
        op(p.g, P(t, p.td - 0.15, 0.2, linear));
        tr(p.part, x, y);
        const sp = P(t, p.ts, 0.8, easeOut);
        const jx = x + Math.cos(p.ja) * 30, jy = y + Math.sin(p.ja) * 30;
        const hdx = (Math.sin(t * 0.9 + p.ph2) * 7 + Math.cos(t * 0.37 + p.ph) * 5) * AMP, hdy = Math.sin(t * 0.75 + p.ph) * 6 * AMP;
        tr(p.h, lerp(jx, p.hx + hdx, sp), lerp(jy, p.hy + hdy, sp));
        op(p.pb, sp); op(p.mb, sp);
        const fl = P(t, p.ts - 0.05, 0.6, linear); op(p.flash, fl <= 0 || fl >= 1 ? 0 : Math.sin(fl * Math.PI) * 0.8); tr(p.flash, jx, jy);
        p.hpos = [lerp(jx, p.hx + hdx, sp), lerp(jy, p.hy + hdy, sp)];
      });
      const lA = P(t, mid('acid', 0.4), 0.5, linear) * (1 - P(t, tB - 0.2, 0.3, linear));
      op(hLead, lA); op(hLbl, lA);
      const hp = particles[2].hpos; hLead.to(558, 468, hp[0] + 8, hp[1] - 6);
      const dA = 1 - P(t, tB - 0.2, 0.4, linear);
      op(defA, dA);
      op(defA.firstChild, P(t, S.first, 0.5, linear));
      op(defA2, P(t, mid('acid', 0.18), 0.5, linear)); op(defA3, P(t, mid('acid', 0.47), 0.5, linear));
      const ps = P(t, mid('acid', 0.72), 0.5, pop); popAt(sour, 778, 606, ps * dA, 0.6);
    }

    /* ---------- everyday ---------- */
    const aB = win(t, tB - 0.1, tC + 0.1, 0.4);
    op(B, aB);
    if (aB > 0) {
      popAt(dayChip, 630, 176, P(t, tB + 0.15, 0.5, pop), 0.6);
      const pl = P(t, mid('everyday', 0.12), 0.7, easeOut), pv = P(t, mid('everyday', 0.42), 0.7, easeOut);
      tr(lemonG, LX + (1 - pl) * 120, 380, 1, (R ? 0 : 6 * Math.sin(t * 0.8)) - (1 - pl) * 60); op(lemonG, pl);
      tr(vinG, VX + (1 - pv) * 160, 384); op(vinG, pv);
      op(lemName, P(t, mid('everyday', 0.25), 0.4, linear)); op(lemNote, P(t, mid('everyday', 0.33), 0.4, linear));
      op(vinName, P(t, mid('everyday', 0.48), 0.4, linear)); op(vinNote, P(t, mid('everyday', 0.66), 0.4, linear));
    }

    /* ---------- stomach ---------- */
    const aC = win(t, tC - 0.15, tD + 0.05, 0.4);
    op(Cs, aC);
    if (aC > 0) {
      const ps = P(t, tC - 0.15, 0.7, easeOut);
      tr(stG, STX, STY + (1 - ps) * 30, 0.92 + 0.08 * ps);
      const wob = R ? 0 : Math.sin(t * 1.4) * 4;
      attr(pool, 'y', 62 + wob); attr(poolTop, 'y', 62 + wob);
      foods.forEach((f, k) => {
        const t0 = mid('stomach', 0.34) + k * 0.16, u = clamp((t - t0) / 0.6);
        const dig = P(t, t0 + 0.7, 1.6, linear);
        op(f.el, u > 0 ? 1 - dig : 0);
        f.el.setAttribute('transform', `translate(${(-52 + k * 22 + (u >= 1 ? Math.sin(t * 2 + k) * 4 : 0)).toFixed(1)} ${lerp(-150, 96 + (k % 2) * 16, easeIn(u)).toFixed(1)}) rotate(${(u * 180 + k * 30).toFixed(0)}) scale(${(1 - 0.6 * dig).toFixed(3)})`);
      });
      bubSt.forEach((b, k) => { const u = ((t * 0.5 + k / 5) % 1); attr(b, 'cx', -90 + k * 42 + Math.sin(t * 3 + k) * 3); attr(b, 'cy', 150 - u * 80 + wob); b.style.opacity = (Math.sin(u * Math.PI) * 0.8).toFixed(3); });
      op(stName, P(t, mid('stomach', 0.05), 0.4, linear));
      hclLbl.set(P(t, mid('stomach', 0.2), 0.4, linear)); op(hclNote, P(t, mid('stomach', 0.4), 0.4, linear));
      const mg = P(t, mid('stomach', 0.6), 0.5, linear);
      mucLbl.set(mg); op(mucNote, P(t, mid('stomach', 0.74), 0.4, linear));
      mucusGlow.setAttribute('opacity', (mg * (0.25 + 0.2 * wave(t, 1.2))).toFixed(3));
      mucus.setAttribute('opacity', (0.45 + 0.4 * mg).toFixed(3));
    }

    /* ---------- base ---------- */
    const aD = win(t, tD - 0.1, tO + 0.1, 0.4);
    op(D, aD);
    if (aD > 0) {
      const tMeet = mid('base', 0.46) + 0.8;                         // the moment the chips touch
      const meet = P(t, mid('base', 0.46), 0.8, easeIn), merge = P(t, tMeet - 0.05, 0.25, linear);
      const pb = P(t, mid('base', 0.02), 0.5, pop), pa = P(t, mid('base', 0.25), 0.5, pop);
      const bump = Math.sin(Math.PI * P(t, tMeet, 0.3, linear)) * 0.08;
      popAt(baseChip, lerp(860, 706, meet), 370, pb, 0.5); popAt(acidChip, lerp(340, 494, meet), 370, pa, 0.5);
      if (merge > 0) { tr(baseChip, 706, 370, 1 + bump); tr(acidChip, 494, 370, 1 + bump); }
      op(acidGreen, merge); op(baseGreen, merge);
      const fl = P(t, tMeet - 0.1, 0.6, linear); op(meetFlash, fl <= 0 || fl >= 1 ? 0 : 0.7 * Math.sin(fl * Math.PI)); tr(meetFlash, 600, 370, 0.6 + 0.8 * fl);
      op(oppArrow, P(t, mid('base', 0.28), 0.4, linear) * (1 - P(t, mid('base', 0.46), 0.3, linear)));
      op(oppTxt, P(t, mid('base', 0.3), 0.4, linear) * (1 - P(t, mid('base', 0.46), 0.3, linear)));
      op(neutGlow, merge * (0.55 + 0.15 * wave(t, 1.6)));
      op(cancelTxt, P(t, tMeet + 0.15, 0.4, linear));
      op(neutTxt, P(t, tMeet + 0.5, 0.4, linear));
    }

    /* ---------- oxides ---------- */
    const aO = win(t, tO - 0.1, tK - 0.1, 0.35);
    op(Ox, aO);
    if (aO > 0) {
      popAt(basesChip, 600, 190, P(t, mid('oxides', 0.02), 0.5, pop), 0.6);
      const pL = P(t, mid('oxides', 0.14), 0.6, pop), pR = P(t, mid('oxides', 0.3), 0.6, pop);
      op(dishL, clamp(pL * 2)); tr(dishL, 360, 450, 1.15 * (0.7 + 0.3 * pL));
      op(dishR, clamp(pR * 2)); tr(dishR, 840, 450, 1.15 * (0.7 + 0.3 * pR));
      op(catL, P(t, mid('oxides', 0.17), 0.4, linear)); op(catR, P(t, mid('oxides', 0.33), 0.4, linear));
      op(nmL, P(t, mid('oxides', 0.54), 0.4, linear)); op(nmL2, P(t, mid('oxides', 0.6), 0.4, linear));
      op(nmR, P(t, mid('oxides', 0.71), 0.4, linear)); op(nmR2, P(t, mid('oxides', 0.78), 0.4, linear));
    }

    /* ---------- alkali: pellets dissolve; the beaker stays for the examples and flies into the Venn ---------- */
    const aK = P(t, tK - 0.1, 0.4, linear);
    const fly = P(t, mid('venn', 0.22), 1.0), dip = Math.sin(Math.PI * fly) * 60;
    op(akG, aK);
    if (aK > 0) {
      scaleAbout(akG, AKX, AKY, lerp(AKX, 765, fly), lerp(AKY, 520, fly) + dip, lerp(1, 0.3, fly));
      const dis = P(t, mid('alkali', 0.32), 1.6, linear);
      pellets.forEach((pl, k) => {
        const u = clamp((t - (tK + 0.05 + k * 0.09)) / 0.5), sink = P(t, tK + 0.55 + k * 0.09, 0.6, easeOut);
        const y = lerp(AKY - 230, AKSURF + 12, easeIn(u)) + sink * (AKY + 118 - (k % 2) * 10 - AKSURF - 12);
        op(pl.el, (u > 0 ? 1 : 0) * (1 - dis)); pl.el.setAttribute('transform', `translate(${pl.x} ${y.toFixed(1)}) rotate(${(k * 35 + u * 90).toFixed(0)}) scale(${Math.max(0.01, 1 - dis).toFixed(3)})`);
        op(pl.cloud, Math.sin(Math.PI * dis) * 0.7); tr(pl.cloud, pl.x, y, 0.6 + dis);
      });
      akB.set(0.7, mix(CLEAR, '#A3CBF5', dis)); akB.liquid.setAttribute('opacity', lerp(0.28, 0.42, dis).toFixed(3));
    }
    const dK = win(t, tK - 0.05, tX + 0.05, 0.4);
    op(defK, dK);
    if (dK > 0) {
      op(defK.firstChild, P(t, tK, 0.4, linear)); op(defK2, P(t, mid('alkali', 0.3), 0.4, linear));
      popAt(solChip, 520 + solChip.w / 2, 392, P(t, mid('alkali', 0.66), 0.5, pop), 0.7);
    }
    op(akName, P(t, tX, 0.4, linear) * (1 - P(t, mid('venn', 0.16), 0.3, linear)));
    popAt(alkHead, 370, 200, P(t, mid('examples', 0.14), 0.5, pop) * (1 - P(t, tV - 0.4, 0.35, linear)), 0.7);

    /* ---------- examples ---------- */
    const aS = P(t, mid('examples', 0.26), 0.6, easeOut);
    op(spG, aS);
    if (aS > 0) scaleAbout(spG, 0, 0, lerp(SPX + (1 - aS) * 80, 885, fly), lerp(SPY, 516, fly) + dip, lerp(1, 0.36, fly));
    op(spName, P(t, mid('examples', 0.33), 0.4, linear) * (1 - P(t, mid('venn', 0.16), 0.3, linear)));
    op(spNote, P(t, mid('examples', 0.42), 0.4, linear) * (1 - P(t, mid('venn', 0.16), 0.3, linear)));
    const mt = (t - mid('examples', 0.4)) / 1.3;
    mist.forEach((m, k) => { const u = mt - k * 0.08; if (u <= 0 || u >= 1 || t > tV) op(m, 0); else { op(m, Math.sin(u * Math.PI) * 0.8); attr(m, 'cx', SPX + 86 + u * 120 + k * 4); attr(m, 'cy', SPY - 118 + (k - 2.5) * 9 * u); attr(m, 'r', 3 + 5 * u); } });
    const aX = win(t, mid('examples', 0.6), tV - 0.15, 0.35);
    op(Ex, aX);
    if (aX > 0) {
      soaps.forEach(sb => { const u = ((t - mid('examples', 0.6)) * 0.16 + sb.ph) % 1; tr(sb.g, sb.x + Math.sin(t * 1.3 + sb.k) * 12 * AMP, 640 - u * 290, 0.6 + 0.5 * Math.sin(u * Math.PI)); op(sb.g, Math.min(1, Math.sin(u * Math.PI) * 2)); });
      op(soapTxt, P(t, mid('examples', 0.64), 0.4, linear));
      popAt(cleanChip, 890, 690, P(t, mid('examples', 0.85), 0.5, pop), 0.6); sparkle.upd(t);
    }

    /* ---------- venn ---------- */
    const aV = P(t, tV - 0.2, 0.2, linear);
    op(Vn, aV);
    if (aV > 0) {
      bigC.setAttribute('stroke-dashoffset', (1 - P(t, tV - 0.16, 1.0)).toFixed(4));
      op(bigFill, P(t, tV + 0.4, 0.6, linear));
      op(bigLbl, P(t, tV + 0.15, 0.4, linear));
      const pi = P(t, mid('venn', 0.12), 0.8, pop); popAt(inG, VA[0], VA[1], pi, 0.2);
      op(inNa, P(t, mid('venn', 0.22) + 0.9, 0.4, linear)); op(inAm, P(t, mid('venn', 0.22) + 0.9, 0.4, linear));
      const sOut = 1 - P(t, tU - 0.3, 0.4, linear);
      op(st1, P(t, mid('venn', 0.04), 0.4, linear) * sOut); op(st2, P(t, mid('venn', 0.46), 0.4, linear) * sOut);
    }

    /* ---------- cuo ---------- */
    const aU = P(t, tU - 0.2, 0.5, linear);
    op(Cu, aU);
    op(cuIcon, P(t, mid('cuo', 0.46), 0.2, linear)); op(cuIconLbl, P(t, mid('cuo', 0.48) + 0.7, 0.35, linear));
    if (aU > 0) {
      tr(cuB, CUX, CUY + (1 - P(t, tU - 0.2, 0.6, easeOut)) * 30);
      op(cuName, P(t, tU, 0.4, linear));
      const heapP = P(t, mid('cuo', 0.2), 1.4, easeOut);
      cuGrains.forEach(gr => {
        const t0 = mid('cuo', gr.t0), u = clamp((t - t0) / 0.35), v = clamp((t - t0 - 0.35) / gr.sink);
        const y = u < 1 ? lerp(CUY - 250, CUSURF, easeIn(u)) : lerp(CUSURF, CUY + 128, easeOut(v));
        const x = u < 1 ? gr.x : lerp(gr.x, gr.ex, easeOut(v) * 0.5);
        op(gr.el, u > 0 ? 1 - P(t, t0 + 0.35 + gr.sink - 0.1, 0.3, linear) : 0);
        attr(gr.el, 'cx', x); attr(gr.el, 'cy', y);
      });
      cuHeap.setAttribute('transform', `translate(${CUX} ${CUY + 130}) scale(${(0.3 + 0.7 * heapP).toFixed(3)} ${Math.max(0.01, heapP).toFixed(3)})`);
      op(cuHeap, P(t, mid('cuo', 0.25), 0.3, linear));
      cuLbl.set(P(t, mid('cuo', 0.2), 0.4, linear));
      const fi = P(t, mid('cuo', 0.48), 0.8);
      const ix = lerp(CUX, 1020, fi), iy = lerp(CUY + 128, 318, fi) - Math.sin(fi * Math.PI) * 90;
      tr(cuIcon, ix, iy, lerp(1.6, 1, fi));
      const pk = P(t, mid('cuo', 0.58), 0.4, pop); op(okRow, clamp(pk * 2)); tr(okTick, 268, 682, Math.max(0.01, pk));
      const pn = P(t, mid('cuo', 0.78), 0.4, pop); op(noRow, clamp(pn * 2)); tr(noCross, 432, 682, Math.max(0.01, pn));
    }
  };
});

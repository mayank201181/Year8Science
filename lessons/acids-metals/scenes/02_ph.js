/* Chapter 2, The pH scale.
   Beats: the 15-cell bar draws on, 0 to 14 -> below 7 is acidic (cells pulse, "more acidic") -> pure water
   sits on 7 (neutral, at room temperature) -> above 7 is alkaline ("more acidic" struck out) -> tiles of
   H⁺ dots: 1, 10, 100 for pH 5, 4, 3 -> the tiles become tomato juice (pH 4) and lemon juice (pH 2): x100
   -> the bar shrinks to the top: a strong acid splits fully, a weak acid only partly -> a dilute strong acid
   and a concentrated weak acid both read pH 3 -> find pH with indicator paper or a pH meter; never taste
   or touch. */
scene('ph', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popAt = (el, x, y, p, s0) => { s0 = s0 === undefined ? 0.6 : s0; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, s0 + (1 - s0) * p)); };
  const scaleAbout = (el, cx0, cy0, x, y, s) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${Math.max(0.01, s).toFixed(4)}) translate(${-cx0} ${-cy0})`);
  /* curly brace under [xl, xr] at y, tip down; .set(p) draws it */
  function brace(parent, xl, xr, y, color) {
    const xm = (xl + xr) / 2, d = `M${xl},${y} Q${xl},${y + 16} ${xl + 16},${y + 16} L${xm - 14},${y + 16} Q${xm},${y + 16} ${xm},${y + 30} Q${xm},${y + 16} ${xm + 14},${y + 16} L${xr - 16},${y + 16} Q${xr},${y + 16} ${xr},${y}`;
    const pth = E('path', { d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    pth.set = p => pth.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4));
    pth.set(0);
    return pth;
  }
  function line(parent, color, w, dash) { return E('line', { stroke: color, 'stroke-width': w || 2.5, 'stroke-linecap': 'round', 'stroke-dasharray': dash }, parent); }
  function setLine(l, x1, y1, x2, y2) { attr(l, 'x1', x1); attr(l, 'y1', y1); attr(l, 'x2', x2); attr(l, 'y2', y2); }

  const RED = '#E8424F', REDDK = '#9E1F2B', CLEAR = '#CFE7F5';
  const PHC = ['#E8424F', '#E8424F', '#E8424F', '#FF8A3D', '#FF8A3D', '#FFD84D', '#FFD84D', '#56D69B', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#8E5CF0', '#8E5CF0', '#8E5CF0'];
  const ACT = '#FF5A66', ALK = '#7C83F2';

  /* ---------- shared art: ions ---------- */
  function badge(parent, r, sign) {
    const g = G(parent);
    E('circle', { r, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, g);
    E('path', { d: sign > 0 ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* an acid particle (red partner + white H) at scale s; when it splits, the H becomes H⁺ */
  function acidParticle(parent, s) {
    const p = { g: G(parent) };
    p.halo = E('circle', { r: 30 * s, fill: glow('#FFFFFF') }, p.g);
    p.part = G(p.g);
    E('circle', { r: 17 * s, fill: ball(RED, REDDK), stroke: REDDK, 'stroke-width': 1.5 }, p.part);
    p.mb = badge(p.part, 7.5 * s, -1); tr(p.mb, 13 * s, -13 * s);
    p.h = G(p.g);
    atom(p.h, 'H', 14 * s);
    p.pb = badge(p.h, 7.5 * s, 1); tr(p.pb, 11 * s, -11 * s);
    return p;
  }

  /* ---------- the pH bar ---------- */
  const BX0 = 180, CW = 56, BT = 302, BCY = 330;
  const cx = i => BX0 + CW / 2 + CW * i;
  const barG = G(root);
  const haloG = G(barG);
  const halos = PHC.map(c => E('circle', { r: 58, fill: glow(c) }, haloG));
  const cells = PHC.map((c, i) => {
    const g = G(barG), h = CW / 2, r = 14;
    const d = i === 0 ? `M${-h + r},${-h} H${h} V${h} H${-h + r} Q${-h},${h} ${-h},${h - r} V${-h + r} Q${-h},${-h} ${-h + r},${-h} Z`
      : i === 14 ? `M${-h},${-h} H${h - r} Q${h},${-h} ${h},${-h + r} V${h - r} Q${h},${h} ${h - r},${h} H${-h} Z`
      : `M${-h},${-h} H${h} V${h} H${-h} Z`;
    E('path', { d, fill: c, stroke: C.bg0, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -h + 6, y: -h + 6, width: CW - 12, height: 7, rx: 3.5, fill: '#ffffff', opacity: 0.25 }, g);
    return g;
  });
  const nums = PHC.map((c, i) => T(barG, cx(i), 391, String(i), { size: 26, weight: 600, anchor: 'middle' }));
  const pHLbl = T(barG, 160, 342, 'pH', { size: 34, weight: 700, anchor: 'end' });
  const marker = E('path', { d: `M${cx(3)},298 L${cx(3) - 14},274 L${cx(3) + 14},274 Z`, fill: '#FF8A3D', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, barG);
  const title = T(root, 600, 196, 'pH scale', { size: 64, weight: 700, anchor: 'middle' });
  const sub = T(root, 600, 248, 'how acidic or alkaline a solution is', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });

  /* ---------- acidic ---------- */
  const acG = G(root);
  const brA = brace(acG, BX0 + 6, BX0 + 7 * CW - 6, 410, ACT);
  const acLbl = T(acG, cx(3), 486, 'ACIDIC', { size: 42, weight: 700, anchor: 'middle', fill: ACT });
  const acArrow = arrow(acG, BX0 + 7 * CW - 14, 532, BX0 + 12, 532, { color: ACT, width: 7 });
  const acMore = T(acG, cx(3), 578, 'more acidic', { size: 32, weight: 600, anchor: 'middle' });

  /* ---------- neutral: pure water on 7 ---------- */
  const nuG = G(root);
  const water = beaker(nuG, 92, 112, { level: 0.66, liquid: '#BFE3F7', opacity: 0.42, marks: false });
  const waterLbl = T(nuG, 534, 252, 'pure water', { size: 30, weight: 600, anchor: 'end' });
  const nuChip = chip(nuG, 'pH 7: neutral', { size: 32, fill: C.good, color: '#0A2A1C' });
  const thG = G(nuG); const th = thermometer(thG, 100, C.good); th.set(0.42);
  const thNote = T(nuG, 730, 224, 'at room\ntemperature', { size: 28, weight: 600, fill: C.muted, lh: 33 });

  /* ---------- alkaline ---------- */
  const alG = G(root);
  const brK = brace(alG, BX0 + 8 * CW + 6, BX0 + 15 * CW - 6, 410, ALK);
  const alLbl = T(alG, cx(11), 486, 'ALKALINE', { size: 42, weight: 700, anchor: 'middle', fill: linGrad('#4F9BF0', '#A274F5') });
  const alArrow = arrow(alG, BX0 + 8 * CW + 14, 532, BX0 + 15 * CW - 12, 532, { color: ALK, width: 7 });
  const alMore = T(alG, cx(11), 578, 'more alkaline', { size: 32, weight: 600, anchor: 'middle' });
  const ghost = G(alG);
  const ghChip = chip(ghost, 'more acidic', { size: 28, fill: 'rgba(20,54,70,0.7)', stroke: C.faint, color: C.muted, sw: 2.5 });
  ghChip.box.setAttribute('stroke-dasharray', '9 7');
  const ghStrike = strike(ghost, -ghChip.w / 2 + 8, 0, ghChip.w / 2 - 8);
  const ghCross = cross(ghost, 13); tr(ghCross, ghChip.w / 2 + 26, 0);

  /* ---------- ions: tiles of H⁺ dots at pH 5, 4 and 3 ---------- */
  const ioG = G(root);
  const TS = 104, TYC = 212, TX = { 3: 236, 4: 432, 5: 628 };
  const tiles = {};
  [3, 4, 5].forEach(k => {
    const g = G(ioG);
    E('rect', { x: -TS / 2, y: -TS / 2, width: TS, height: TS, rx: 14, fill: 'rgba(10,27,39,0.65)', stroke: PHC[k], 'stroke-width': 3.5 }, g);
    const lb = T(ioG, TX[k], 146, 'pH ' + k, { size: 30, weight: 700, anchor: 'middle', fill: PHC[k] });
    tiles[k] = { g, lb };
  });
  const leads = { 3: line(root, C.muted, 2.5), 4: line(ioG, C.muted, 2.5), 5: line(root, C.muted, 2.5) };
  const grid = (n, cols, sx, sy) => { const pts = []; const rows = Math.ceil(n / cols); for (let i = 0; i < n; i++) { const c = i % cols, r = Math.floor(i / cols); pts.push([(c - (Math.min(cols, n) - 1) / 2) * sx, (r - (rows - 1) / 2) * sy]); } return pts; };
  const G3 = grid(100, 10, 9.2, 9.2), G4 = grid(10, 5, 14, 16), dot = r => E('circle', { r, fill: '#F4F7FA', stroke: '#0A1B27', 'stroke-width': 1.2 }, root);
  const dots3 = G3.map(() => dot(3.3)), dots4 = G4.map(() => dot(3.6)), dot5 = dot(4.2);
  const x10 = [334, 530].map(x => { const g = G(ioG); chip(g, '×10', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); arrow(g, 26, 40, -26, 40, { color: C.energy, width: 4 }); tr(g, x, TYC - 8); return g; });
  const legend = G(ioG);
  E('circle', { cx: 0, cy: -9, r: 6, fill: '#F4F7FA' }, legend);
  rich(legend, 18, 0, ['= ', ['H⁺', '#FFFFFF', 800], ' ions'], { size: 30, weight: 600 });
  const stepTxt = rich(ioG, 600, 566, ['one step ', ['down', C.energy, 800], ' the scale = ', ['10 ×', C.energy, 800], ' more H⁺'], { size: 34, weight: 500, anchor: 'middle' });

  /* ---------- lemon juice vs tomato juice ---------- */
  const leG = G(root);
  function glass(parent, col, opa) {
    const g = G(parent);
    const body = 'M-56,-68 L-46,62 Q-45,70 -36,70 L36,70 Q45,70 46,62 L56,-68';
    E('path', { d: body + ' Z', fill: 'rgba(200,230,250,0.08)' }, g);
    E('path', { d: 'M-53.5,-38 L-46.6,60 Q-45.6,67 -36,67 L36,67 Q45.6,67 46.6,60 L53.5,-38 Z', fill: col, opacity: opa }, g);
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('rect', { x: 34, y: -52, width: 6, height: 96, rx: 3, fill: '#ffffff', opacity: 0.22, transform: 'rotate(4)' }, g);
    return g;
  }
  const GL = { lemon: 236, tomato: 628 }, GY = 208;
  const lemonGl = glass(leG, '#E0BD2E', 0.55), tomGl = glass(leG, '#D9412B', 0.78);
  tr(lemonGl, GL.lemon, GY); tr(tomGl, GL.tomato, GY);
  const lemonBit = G(leG); tr(lemonBit, GL.lemon - 84, GY + 46);
  E('circle', { r: 22, fill: '#F5C542', stroke: '#C48F12', 'stroke-width': 2.5 }, lemonBit);
  E('circle', { r: 17, fill: '#FFF2B8' }, lemonBit);
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; E('line', { x1: 0, y1: 0, x2: Math.cos(a) * 15, y2: Math.sin(a) * 15, stroke: '#F2C21F', 'stroke-width': 2.5 }, lemonBit); }
  const steps = [[4, 3], [3, 2]].map(([a, b]) => { const g = G(leG); arrow(g, cx(a) - 4, 424, cx(b) + 4, 424, { color: C.energy, width: 4, bend: -24, head: 12 }); T(g, (cx(a) + cx(b)) / 2, 488, '×10', { size: 24, weight: 700, anchor: 'middle', fill: C.energy }); return g; });
  const stepsTxt = rich(leG, 600, 566, ['two steps down:  ', ['10 × 10 = 100', C.energy, 800], ' times more H⁺'], { size: 34, weight: 500, anchor: 'middle' });
  const tomBit = G(leG); tr(tomBit, GL.tomato + 84, GY + 46);
  E('circle', { r: 22, fill: ball('#F0553B', '#A82A18'), stroke: '#A82A18', 'stroke-width': 2 }, tomBit);
  E('path', { d: 'M0,-20 L-9,-28 M0,-20 L9,-28 M0,-20 L0,-30 M0,-20 L-12,-19 M0,-20 L12,-19', stroke: '#4CA83A', 'stroke-width': 4, 'stroke-linecap': 'round' }, tomBit);
  const lemonLbl = rich(leG, GL.lemon, 126, ['lemon juice, ', ['pH 2', PHC[2], 800]], { size: 30, weight: 700, anchor: 'middle' });
  const tomLbl = rich(leG, GL.tomato, 126, ['tomato juice, ', ['pH 4', PHC[4], 800]], { size: 30, weight: 700, anchor: 'middle' });
  const x100 = G(leG);
  chip(x100, '× 100', { size: 46, fill: C.card2, stroke: C.energy, color: C.energy, sw: 3.5 });
  arrow(x100, 70, 54, -70, 54, { color: C.energy, width: 5 });
  const lemonJig = rng(5), LJ = G3.map(() => [(lemonJig() - 0.5) * 3, (lemonJig() - 0.5) * 3]);
  const LEMONPTS = grid(100, 10, 8.6, 9.6).map(([x, y], i) => [GL.lemon + x * 0.98 + LJ[i][0], GY + 16 + y + LJ[i][1]]);

  /* ---------- strength, concentration, measuring ---------- */
  const stG = G(root);
  const BKS = [290, 790], BKY = 470, SURF = BKY + 130 - 242 * 0.75;
  const bks = BKS.map(x => { const b = beaker(stG, 260, 260, { level: 0.75, liquid: CLEAR, opacity: 0.25 }); tr(b, x, BKY); return b; });
  const COLS = [-84, -28, 28, 84], ROWS = [440, 495, 550];
  const slot = (bx, c, r) => [bx + lerp(COLS[0], COLS[3], c / 3), lerp(ROWS[0], ROWS[2], r / 2)];
  const PS = 0.85, ATT = 24;
  const partsG = G(stG), particles = [];
  const mk = (bx, c, r, dir, o) => {
    const p = acidParticle(partsG, PS);
    const [x, y] = slot(bx, c, r);
    Object.assign(p, { x, y, hx0: x + dir * ATT, hy0: y, hx1: x + dir * ATT, hy1: y, ph: (c * 7 + r * 3 + bx) % 6.28 }, o);
    particles.push(p);
    return p;
  };
  // strong acid: six particles on a checkerboard; each H⁺ moves to the empty slot beside it
  const SL = [[0, 0, 1], [2, 0, 1], [1, 1, -1], [3, 1, -1], [0, 2, 1], [2, 2, 1]];
  SL.forEach(([c, r, d], i) => { const tgt = slot(BKS[0], c + d, r); mk(BKS[0], c, r, d, { side: 0, split: i * 0.1, hx1: tgt[0], hy1: tgt[1], keep: i === 0 || i === 2 || i === 5 }); });
  // weak acid: two of six split; when it is made concentrated, three more particles join and a third one splits
  const WL = [[0, 0, 1, 0], [2, 0, 1, null], [1, 1, -1, null], [3, 1, -1, 0.12], [0, 2, 1, null], [2, 2, 1, 'late']];
  WL.forEach(([c, r, d, sp]) => {
    const o = { side: 1, split: sp, keep: true };
    if (sp !== null) { const tgt = slot(BKS[1], c + d, r); o.hx1 = tgt[0]; o.hy1 = tgt[1]; }
    mk(BKS[1], c, r, d, o);
  });
  [[3, 0, 1], [0, 1, -1], [1, 2, 1]].forEach(([c, r, d], i) => mk(BKS[1], c, r, d, { side: 1, split: null, added: i * 0.12, keep: true }));
  const names = [['strong acid', 'dilute strong acid'], ['weak acid', 'concentrated weak acid']].map(([a, b], i) => ({ a: T(stG, BKS[i], 302, a, { size: 36, weight: 700, anchor: 'middle' }), b: T(stG, BKS[i], 302, b, { size: 34, weight: 700, anchor: 'middle' }) }));
  const underL = [T(stG, BKS[0], 644, 'ionises fully', { size: 32, weight: 700, anchor: 'middle', fill: C.energy }), T(stG, BKS[1], 644, 'only partly', { size: 32, weight: 700, anchor: 'middle', fill: C.energy })];
  const header = rich(stG, 600, 252, ["pH doesn't show an acid's ", ['strength', '#FFFFFF', 800]], { size: 32, weight: 500, anchor: 'middle' });
  const concChip = chip(stG, "pH alone can't tell strong from weak", { size: 30, h: 48, fill: '#3A2A10', stroke: C.energy, color: '#FFF4C4' });
  function phMeter(parent) {
    const g = G(parent);
    E('rect', { x: -66, y: -86, width: 132, height: 172, rx: 20, fill: linGrad('#3A4E5E', '#1E2C37', true), stroke: '#7D93A2', 'stroke-width': 3 }, g);
    E('rect', { x: -54, y: -70, width: 108, height: 64, rx: 9, fill: '#0E2A1D', stroke: '#5E7A8C', 'stroke-width': 2 }, g);
    g.read = T(g, 0, -26, '', { size: 32, weight: 700, anchor: 'middle', fill: '#9CF0B0' });
    E('circle', { cx: -24, cy: 34, r: 12, fill: '#56707F', stroke: '#8FA6B4', 'stroke-width': 2 }, g);
    E('circle', { cx: 24, cy: 34, r: 12, fill: '#56707F', stroke: '#8FA6B4', 'stroke-width': 2 }, g);
    g.set = s => setText(g.read, s);
    return g;
  }
  function probe(parent) {
    const g = G(parent);                  // origin: the tip; the cable leaves the cap at (0, -140)
    E('rect', { x: -7, y: -116, width: 14, height: 108, rx: 7, fill: 'rgba(220,235,245,0.55)', stroke: '#B5CCD9', 'stroke-width': 2 }, g);
    E('circle', { cx: 0, cy: -10, r: 11, fill: 'rgba(220,235,245,0.7)', stroke: '#B5CCD9', 'stroke-width': 2 }, g);
    E('rect', { x: -11, y: -140, width: 22, height: 30, rx: 5, fill: '#2A3B48', stroke: '#7D93A2', 'stroke-width': 2 }, g);
    return g;
  }
  const MX = [500, 1000], MY = 470;
  const meterHalo = E('ellipse', { rx: 110, ry: 80, fill: glow('#9CF0B0') }, stG);
  const meters = MX.map((x, i) => {
    const cable = E('path', { fill: 'none', stroke: '#2A3B48', 'stroke-width': 6, 'stroke-linecap': 'round' }, stG);
    const m = phMeter(stG); tr(m, x, MY);
    const pb = probe(stG);
    return { m, pb, cable, x, bx: BKS[i] };
  });
  // the indicator paper: dry beige, wet end turns orange
  const paper = G(stG);
  E('rect', { x: -20, y: -130, width: 40, height: 130, rx: 4, fill: '#E6D79A', stroke: '#BFAE6A', 'stroke-width': 2 }, paper);
  E('rect', { x: -20, y: -130, width: 40, height: 30, rx: 4, fill: '#F6F0D2' }, paper);
  const wet = E('rect', { x: -18, y: 0, width: 36, height: 0, fill: '#FF8A3D' }, paper);
  const paperLbl = T(stG, 150, 424, 'indicator\npaper', { size: 26, weight: 600, anchor: 'end', fill: C.muted, lh: 30 });
  const warn = G(stG);
  /* an open mouth with the tongue poking out */
  function tongue(parent) {
    const g = G(parent);
    E('path', { d: 'M-62,-14 Q0,-44 62,-14 Q46,30 0,32 Q-46,30 -62,-14 Z', fill: '#4A0F1C', stroke: '#E86A86', 'stroke-width': 7, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-40,-16 Q0,-34 40,-16 L36,-6 Q0,-20 -36,-6 Z', fill: '#F4F7FA' }, g);
    E('path', { d: 'M-28,6 Q0,-6 28,6 L28,40 Q28,66 0,66 Q-28,66 -28,40 Z', fill: ball('#FF8FAF', '#C2456A'), stroke: '#FFC2D4', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M0,10 L0,46', stroke: '#C2456A', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function hand(parent) {
    const g = G(parent), sk = ball('#E8B48E', '#B9825A');
    [[-30, -44, 50], [-10, -58, 64], [10, -56, 62], [30, -44, 50]].forEach(([x, y, h]) => E('rect', { x: x - 9, y, width: 18, height: h, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, g));
    E('path', { d: 'M-40,-6 Q-40,44 0,48 Q40,44 40,-6 Z', fill: sk, stroke: '#F7D9C2', 'stroke-width': 2 }, g);
    E('rect', { x: -66, y: -8, width: 18, height: 46, rx: 9, fill: sk, stroke: '#F7D9C2', 'stroke-width': 2, transform: 'rotate(-38 -57 15)' }, g);
    return g;
  }
  const ICX = [820, 1010], ICY = 420;
  const tgG = G(warn); tongue(tgG); tr(tgG, ICX[0], ICY);
  const hg = G(warn); hand(hg); tr(hg, ICX[1], ICY + 6);
  const crosses = ICX.map(x => { const c = cross(warn, 46); tr(c, x, ICY); return c; });
  const warnTxt = T(warn, 915, 560, 'never taste or touch!', { size: 38, weight: 700, anchor: 'middle', fill: '#FF7A86' });

  return t => {
    const tA = at('acidic'), tN = at('neutral'), tK = at('alkaline'), tI = at('ions'), tL = at('lemon'), tS = at('strength'), tC = at('conc'), tM = at('meter');

    /* ---------- the bar: draws on, later shrinks to the top ---------- */
    const shrink = P(t, tS - 0.2, 0.9);
    scaleAbout(barG, 600, BCY, 600, lerp(BCY, 150, shrink), lerp(1, 0.62, shrink));
    const pulse = (i, t0) => Math.sin(Math.PI * P(t, t0, 0.45, linear));
    cells.forEach((g, i) => {
      const t0 = S.first + 0.4 + i * 0.2, p = P(t, t0, 0.45, pop);
      let k = 0;
      if (i <= 6) k = Math.max(k, pulse(i, mid('acidic', 0.36) + (6 - i) * 0.1));
      if (i >= 8) k = Math.max(k, pulse(i, mid('alkaline', 0.34) + (i - 8) * 0.1));
      if (i === 0 || i === 14) k = Math.max(k, pulse(i, mid('scale', 0.8) + (i ? 0.4 : 0)));
      if (i === 7) k = Math.max(k, pulse(i, mid('neutral', 0.42)), 0.6 * pulse(i, mid('neutral', 0.6)));
      if (i === 2) k = Math.max(k, pulse(i, mid('lemon', 0.2)));
      if (i === 4) k = Math.max(k, pulse(i, mid('lemon', 0.78)));
      if (i === 3) k = Math.max(k, pulse(i, mid('meter', 0.26)));
      op(g, clamp(p * 2)); tr(g, cx(i), BCY, Math.max(0.01, (0.3 + 0.7 * p) * (1 + 0.16 * k)));
      op(halos[i], k * 0.9); tr(halos[i], cx(i), BCY, 0.6 + 0.5 * k);
      const np = P(t, t0 + 0.15, 0.35, linear);
      const big = i === 0 || i === 14 ? pulse(i, mid('scale', 0.8) + (i ? 0.4 : 0)) : 0;
      op(nums[i], np);
      const fs = lerp(26, 42, shrink);
      nums[i].setAttribute('font-size', fs.toFixed(1)); attr(nums[i], 'y', 366 + fs * 0.96);
      nums[i].setAttribute('transform', `translate(${cx(i)} ${391}) scale(${(1 + 0.45 * big).toFixed(3)}) translate(${-cx(i)} ${-391})`);
      nums[i].setAttribute('fill', big > 0.05 ? C.energy : C.ink);
    });
    op(pHLbl, P(t, S.first + 0.2, 0.4, linear));
    const mk3 = P(t, mid('meter', 0.24), 0.5, pop); op(marker, clamp(mk3 * 2)); marker.setAttribute('transform', `translate(0 ${((1 - clamp(mk3)) * -16).toFixed(1)})`);
    op(title, P(t, S.first, 0.5, linear) * (1 - P(t, tN - 0.35, 0.35, linear)));
    tr(title, 0, (1 - P(t, S.first, 0.7, easeOut)) * 16);
    op(sub, P(t, mid('scale', 0.12), 0.5, linear) * (1 - P(t, tA - 0.3, 0.35, linear)));

    /* ---------- acidic / alkaline brackets (dimmed during the ions, gone before the bar shrinks) ---------- */
    const dimIons = 1 - 0.7 * P(t, tI - 0.3, 0.4, linear), goneS = 1 - P(t, tL - 0.3, 0.4, linear);
    op(acG, P(t, tA - 0.1, 0.3, linear) * dimIons * goneS);
    brA.set(P(t, tA, 0.6)); op(acLbl, P(t, mid('acidic', 0.1), 0.4, linear));
    acArrow.set(P(t, mid('acidic', 0.36), 1.6, linear)); op(acArrow, P(t, mid('acidic', 0.34), 0.2, linear) * (1 - P(t, tI - 0.3, 0.3, linear)));
    op(acMore, P(t, mid('acidic', 0.62), 0.4, linear) * (1 - P(t, tI - 0.3, 0.3, linear)));
    op(alG, P(t, tK - 0.1, 0.3, linear) * dimIons * goneS);
    brK.set(P(t, tK, 0.6)); op(alLbl, P(t, mid('alkaline', 0.08), 0.4, linear));
    alArrow.set(P(t, mid('alkaline', 0.34), 1.6, linear)); op(alArrow, P(t, mid('alkaline', 0.32), 0.2, linear) * (1 - P(t, tI - 0.3, 0.3, linear)));
    op(alMore, P(t, mid('alkaline', 0.52), 0.4, linear) * (1 - P(t, tI - 0.3, 0.3, linear)));
    const gIn = P(t, mid('alkaline', 0.7), 0.6, easeOut), gHit = P(t, mid('alkaline', 0.82), 0.35);
    op(ghost, clamp(gIn * 2) * (1 - P(t, tI - 0.3, 0.3, linear)));
    tr(ghost, lerp(1080, 924, gIn) + Math.sin(Math.PI * gHit) * 10, 642);
    ghStrike.set(gHit); op(ghCross, gHit); tr(ghCross, ghChip.w / 2 + 26, 0, Math.max(0.01, gHit));

    /* ---------- neutral ---------- */
    const nA = P(t, tN - 0.1, 0.3, linear) * (1 - P(t, tI - 0.3, 0.4, linear));
    op(nuG, nA);
    if (nA > 0) {
      const dropP = P(t, mid('neutral', 0.2), 0.55, easeIn), bounce = Math.sin(Math.PI * P(t, mid('neutral', 0.2) + 0.55, 0.3, linear)) * 6;
      tr(water, cx(7), lerp(-90, BT - 56, dropP) - bounce);
      op(water, P(t, mid('neutral', 0.2), 0.15, linear));
      op(waterLbl, P(t, mid('neutral', 0.26), 0.4, linear));
      popAt(nuChip, cx(7), 150, P(t, mid('neutral', 0.42), 0.5, pop), 0.6);
      const thA = P(t, tN, 0.4, linear) * (1 - P(t, tK - 0.25, 0.35, linear));
      op(thG, thA); op(thNote, thA); tr(thG, 698, 266, 0.82);
      th.set(0.25 + 0.17 * P(t, tN, 1.2, easeOut));
    }

    /* ---------- ions: 1, 10, 100 ---------- */
    const iA = P(t, tI - 0.1, 0.4, linear);
    const toL = P(t, tL - 0.1, 0.9);                                // tiles become glasses
    op(ioG, iA * (1 - P(t, tL - 0.1, 0.4, linear)));
    [5, 4, 3].forEach((k, j) => { const p = P(t, mid('ions', 0.1 + j * 0.06), 0.5, pop); popAt(tiles[k].g, TX[k], TYC, p, 0.5); op(tiles[k].lb, P(t, mid('ions', 0.12 + j * 0.06), 0.4, linear)); });
    x10.forEach((g, j) => popAt(g, [530, 334][j], TYC - 8, P(t, mid('ions', [0.56, 0.74][j]), 0.45, pop), 0.5));
    op(legend, P(t, mid('ions', 0.34), 0.4, linear)); tr(legend, 760, TYC + 10);
    op(stepTxt, P(t, mid('ions', 0.6), 0.5, linear));
    // leaders: 3 -> cell 3 (then cell 2), 4 -> cell 4, 5 -> cell 5 (then cell 4)
    const lA = iA * (1 - P(t, tS - 0.4, 0.35, linear));
    const leadSlide = P(t, mid('lemon', 0.1), 0.8), leadSlide2 = P(t, mid('lemon', 0.1), 0.8);
    op(leads[3], lA * P(t, mid('ions', 0.22), 0.3, linear)); setLine(leads[3], TX[3], TYC + TS / 2 + lerp(0, 14, toL), lerp(cx(3), cx(2), leadSlide), BT - 2);
    op(leads[4], P(t, mid('ions', 0.16), 0.3, linear)); setLine(leads[4], TX[4], TYC + TS / 2, cx(4), BT - 2);
    op(leads[5], lA * P(t, mid('ions', 0.1), 0.3, linear)); setLine(leads[5], TX[5], TYC + TS / 2 + lerp(0, 14, toL), lerp(cx(5), cx(4), leadSlide2), BT - 2);
    // dots: 100 in the pH 3 tile (they move into the lemon juice), 10 in the pH 4 tile, 1 in the pH 5 tile
    const dGone = 1 - P(t, tS - 0.4, 0.35, linear), dotsOn = iA * dGone > 0;   // hidden dots need no update
    const tw = P(t, mid('lemon', 0.44), 1.4, linear);
    dots3.forEach((d, i) => {
      if (!dotsOn) { op(d, 0); return; }
      const a = P(t, mid('ions', 0.64) + i * 0.007, 0.25, linear);
      const x = lerp(TX[3] + G3[i][0], LEMONPTS[i][0], toL), y = lerp(TYC + G3[i][1], LEMONPTS[i][1], toL);
      op(d, a * dGone * (tw > 0 && tw < 1 ? 0.75 + 0.25 * Math.sin(tw * 18 + i) : 1));
      if (a > 0) { attr(d, 'cx', x); attr(d, 'cy', y); }
    });
    const d4 = 1 - P(t, tL - 0.1, 0.4, linear);
    dots4.forEach((d, i) => { const a = dotsOn ? P(t, mid('ions', 0.48) + i * 0.04, 0.2, linear) * d4 : 0; op(d, a); if (a > 0) { attr(d, 'cx', TX[4] + G4[i][0]); attr(d, 'cy', TYC + G4[i][1]); } });
    op(dot5, dotsOn ? P(t, mid('ions', 0.3), 0.3, linear) * dGone : 0);
    if (dotsOn) { attr(dot5, 'cx', TX[5]); attr(dot5, 'cy', lerp(TYC, GY + 16, toL)); }

    /* ---------- lemon vs tomato ---------- */
    const lE = P(t, tL - 0.05, 0.6, linear) * (1 - P(t, tS - 0.4, 0.35, linear));
    op(leG, lE);
    if (lE > 0) {
      popAt(lemonGl, GL.lemon, GY, toL, 0.85); popAt(tomGl, GL.tomato, GY, toL, 0.85);
      popAt(lemonBit, GL.lemon - 84, GY + 46, P(t, mid('lemon', 0.08), 0.5, pop), 0.4);
      steps.forEach((g, j) => { const p = P(t, mid('lemon', 0.42 + j * 0.08), 0.5, easeOut); op(g, p); g.firstChild.set(p); });
      op(stepsTxt, P(t, mid('lemon', 0.58), 0.5, linear));
      popAt(tomBit, GL.tomato + 84, GY + 46, P(t, mid('lemon', 0.72), 0.5, pop), 0.4);
      op(lemonLbl, P(t, mid('lemon', 0.06), 0.4, linear)); op(tomLbl, P(t, mid('lemon', 0.72), 0.4, linear));
      popAt(x100, 432, TYC - 16, P(t, mid('lemon', 0.36), 0.6, pop), 0.4);
    }

    /* ---------- strength / concentration / measuring ---------- */
    const sA = P(t, tS - 0.1, 0.5, linear);
    op(stG, sA);
    if (sA > 0) {
      const toC = P(t, tC - 0.1, 0.9);                              // to concentration
      const toM = P(t, tM - 0.2, 0.6, linear);                      // to measuring: the right side clears
      op(bks[1], 1 - toM);
      op(header, P(t, mid('strength', 0.03), 0.4, linear) * (1 - P(t, tC - 0.3, 0.3, linear)));
      names.forEach((n, i) => { op(n.a, P(t, mid('strength', 0.34 + i * 0.44), 0.4, linear) * (1 - toC)); op(n.b, toC * (i ? 1 - toM : 1)); });
      op(underL[0], P(t, mid('strength', 0.62), 0.4, linear) * (1 - toC)); op(underL[1], P(t, mid('strength', 0.86), 0.4, linear) * (1 - toC));
      popAt(concChip, 600, 694, P(t, mid('conc', 0.55), 0.5, pop) * (1 - toM), 0.7);
      const tSplitS = mid('strength', 0.44), tSplitW = mid('strength', 0.86), tLate = mid('conc', 0.16);
      const glowH = Math.sin(Math.PI * P(t, mid('conc', 0.38), 1.8, linear));
      particles.forEach(p => {
        let vis = 1;
        if (p.added !== undefined) vis = P(t, tC + 0.1 + p.added, 0.4, linear);
        if (p.side === 0 && !p.keep) vis *= 1 - P(t, tC + 0.05, 0.5, linear);
        if (p.side === 1) vis *= 1 - toM;
        op(p.g, vis);
        if (vis <= 0) return;
        const jx = Math.sin(t * 0.8 + p.ph) * 2.5 * AMP, jy = Math.cos(t * 0.7 + p.ph * 1.3) * 2.5 * AMP;
        tr(p.part, p.x + jx, p.y + jy);
        let s = 0, ts = 0;
        if (p.split === 'late') ts = tLate;
        else if (p.split !== null) ts = (p.side ? tSplitW : tSplitS) + p.split;
        if (p.split !== null) s = P(t, ts, 0.7, easeOut);
        const hx = lerp(p.hx0 + jx, p.hx1 + jy, s), hy = lerp(p.hy0 + jy, p.hy1 - jx, s);
        tr(p.h, hx, hy);
        op(p.pb, s); op(p.mb, s);
        op(p.halo, s * Math.max(glowH * 0.85, 0.7 * Math.sin(Math.PI * P(t, ts, 0.8, linear))));
        tr(p.halo, hx, hy);
      });
      // pH meters: read the same pH 3 (and the right one clears for the measuring beat)
      meters.forEach((mt, i) => {
        const t0 = mid('conc', 0.2) + i * 0.14, mIn = P(t, t0, 0.5, easeOut);
        const fade = i ? 1 - toM : 1;
        op(mt.m, mIn * fade); op(mt.pb, mIn * fade); op(mt.cable, mIn * fade);
        const px = mt.bx + 104, py = SURF + 58 + (1 - mIn) * -24;
        tr(mt.pb, px, py); tr(mt.m, mt.x, MY + (1 - mIn) * 24);
        mt.cable.setAttribute('d', `M${px},${(py - 140).toFixed(1)} C${px},${(py - 168).toFixed(1)} ${mt.x},${MY - 130} ${mt.x},${MY - 86}`);
        // reads up to pH 3.0; in the measuring beat the left meter blanks and reads again
        const again = i === 0 && t > mid('meter', 0.25);
        const rd = again ? P(t, mid('meter', 0.36), 0.7, linear) : P(t, t0 + 0.45, 0.8, linear);
        mt.m.set(rd <= 0 ? 'pH --' : 'pH ' + (7 - 4 * easeOut(rd)).toFixed(1));
      });
      const mGlow = Math.sin(Math.PI * P(t, mid('meter', 0.33), 1.2, linear));
      op(meterHalo, mGlow * 0.8); tr(meterHalo, MX[0], MY - 40, 1 + 0.1 * mGlow);
      // indicator paper and the warning
      const pIn = P(t, mid('meter', 0.08), 0.5, easeOut), wetP = P(t, mid('meter', 0.18), 1.0, easeOut);
      op(paper, clamp(pIn * 2)); tr(paper, BKS[0] - 108, lerp(SURF + 22, SURF + 64, pIn));
      attr(wet, 'y', 0 - wetP * 84); attr(wet, 'height', wetP * 84);
      op(paperLbl, P(t, mid('meter', 0.16), 0.4, linear));
      op(warn, P(t, mid('meter', 0.5), 0.3, linear));
      popAt(tgG, ICX[0], ICY, P(t, mid('meter', 0.56), 0.5, pop), 0.6); popAt(hg, ICX[1], ICY + 6, P(t, mid('meter', 0.65), 0.5, pop), 0.6);
      crosses.forEach((c, i) => { const p = P(t, mid('meter', [0.62, 0.7][i]), 0.4, pop); op(c, clamp(p * 2)); tr(c, ICX[i], ICY, Math.max(0.01, p)); });
      op(warnTxt, P(t, mid('meter', 0.6), 0.4, linear));
    }
  };
});

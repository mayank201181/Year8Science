/* Chapter 4, Conduction: passing energy along.
   The three ways, Conduction lit -> a metal bar of particles slides in -> a Bunsen heats one end
   -> the vibration is passed particle to particle (showpiece) -> the cold end warms, the bar stays put
   -> free electrons drift, then race ahead with the energy -> conductors vs insulators
   -> the tiles-and-wood mystery solved -> metal vs wooden spoon -> ice on metal, wood and plastic. */
scene('conduction', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.45 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const smooth = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const gauss = (x, w) => Math.exp(-(x / w) * (x / w));
  const BLUE = ball(C.water, C.waterDk), ORANGE = ball(C.heat, C.heatDk), RED = ball(C.bad, '#B8323F');
  /* a particle tinted blue (slow) -> orange -> red (fast): g.set(h 0..1) */
  function heatBall(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: BLUE }, g);
    const o = E('circle', { r, fill: ORANGE }, g), rd = E('circle', { r, fill: RED }, g);
    g.set = h => { op(o, clamp(h / 0.55)); op(rd, 0.85 * clamp((h - 0.72) / 0.28)); };
    g.set(0);
    return g;
  }
  /* a flow of thermal energy, hot -> cold: an orange arrow with heat shimmer riding along it. g.draw(t, p) */
  function flowArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), w = o.width || 9, col = o.color || C.heat, hs = o.head || w * 3.4;
    const L = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(ang), sa = Math.sin(ang);
    const line = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col, 'stroke-linejoin': 'round' }, g);
    const a = { set: p => {                         // the head travels with the tip as the arrow grows
      p = clamp(p);
      const d = Math.max(hs * 0.9, L * p), ex = x1 + ca * d, ey = y1 + sa * d;
      line.setAttribute('d', `M${x1},${y1} L${(ex - ca * hs * 0.7).toFixed(1)},${(ey - sa * hs * 0.7).toFixed(1)}`);
      head.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(2)})`);
      op(line, p > 0.01 ? 1 : 0); op(head, clamp(p * 12));
    } };
    const off = (o.side || 1) * (w / 2 + 13), nx = Math.sin(ang), ny = -Math.cos(ang);
    const n = o.waves === false ? 0 : Math.max(1, Math.round(L / 210)), seg = L / n, hh = Math.min(seg * 0.5, 80), ws = [];
    for (let k = 0; k < n; k++) {
      const f = (k * seg + seg * 0.18) / L;
      const hw = heatWaves(g, { n: 2, h: hh, spacing: 11, width: 4.5, color: '#FFB47A', speed: 0.75 });
      hw.setAttribute('transform', `translate(${(x1 + Math.cos(ang) * L * f + nx * off).toFixed(1)} ${(y1 + Math.sin(ang) * L * f + ny * off).toFixed(1)}) rotate(${(ang * 180 / Math.PI + 90).toFixed(1)})`);
      ws.push({ hw, f: f + hh * 1.2 / L });          // shown once the arrow has been drawn past it
    }
    g.draw = (t, p) => { a.set(p); ws.forEach((q, k) => { const v = clamp((p - q.f) / 0.12); op(q.hw, v); if (v > 0) q.hw.upd(t + k * 0.37); }); };
    g.draw(0, 1);
    return g;
  }
  /* a dotted arrow for a trickle of energy. g.set(p) */
  function dotArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), col = o.color || C.heat, w = o.width || 6, hs = o.head || w * 3.2;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const line = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-dasharray': `0.1 ${(w * 2.1).toFixed(1)}` }, g);
    const head = E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col }, g);
    g.set = p => {
      p = clamp(p);
      const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p);
      line.setAttribute('d', `M${x1},${y1} L${(ex - Math.cos(ang) * hs).toFixed(1)},${(ey - Math.sin(ang) * hs).toFixed(1)}`);
      head.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(1)})`);
      op(g, p > 0.04 ? 1 : 0);
    };
    g.set(1);
    return g;
  }

  /* ================= title: the three ways, Conduction lit ================= */
  const top = G(root);
  const WAYS = ['Conduction', 'Convection', 'Radiation'], WX = [330, 600, 870], WY = 190, ME = 0;
  const ways = WAYS.map(w => {
    const g = G(top);
    const dim = chip(g, w, { size: 30, fill: C.card, stroke: C.line, color: C.muted });
    const lit = chip(g, w, { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
    return { g, dim, lit, w: lit.w };
  });

  /* ================= A. the metal bar ================= */
  const A = G(root);
  const BX = 250, BW = 700, BY = 360, BH = 70, NP = 12, SP = BW / NP, PR = 18;
  const px = i => BX + SP * (i + 0.5);
  const solidsChip = chip(A, 'the main way through **solids**', { size: 30, fill: C.card2, stroke: C.line });
  tr(solidsChip, 600, 482);
  solidsChip.label.querySelectorAll('tspan[font-weight="800"]').forEach(s => s.setAttribute('fill', C.energy));
  const bun = bunsen(A, 0.8); tr(bun, 300, 596);
  const outline = E('rect', { x: BX - 10, y: BY - BH / 2 - 10, width: BW + 20, height: BH + 20, rx: 18, fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '10 9' }, A);
  const barG = G(A);
  E('rect', { x: BX, y: BY - BH / 2, width: BW, height: BH, rx: 12, fill: linGrad('#B3BEC8', '#5A6672', true), stroke: '#D3DBE2', 'stroke-width': 3 }, barG);
  E('rect', { x: BX + 12, y: BY - BH / 2 + 5, width: BW - 24, height: 5, rx: 2.5, fill: '#FFFFFF', opacity: 0.3 }, barG);
  const pr = rng(404);
  const parts = [];
  for (let i = 0; i < NP; i++) {
    const g = G(barG);
    const vib = E('path', { d: `M${-PR - 5},-9 Q${-PR - 10},0 ${-PR - 5},9 M${PR + 5},-9 Q${PR + 10},0 ${PR + 5},9`, fill: 'none', stroke: '#FFE2B8', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const b = heatBall(g, PR);
    parts.push({ g, b, vib, w1: 17 + pr() * 5, w2: 19 + pr() * 6, ph1: pr() * TAU, ph2: pr() * TAU, prof: lerp(1, 0.5, i / (NP - 1)) });
  }
  const flashes = [];
  for (let k = 0; k < NP - 1; k++) {
    const f = G(barG); tr(f, BX + SP * (k + 1), BY);
    E('path', { d: 'M0,-15 L4,-4 L15,0 L4,4 L0,15 L-4,4 L-15,0 L-4,-4 Z', fill: '#FFF3B0', stroke: C.energy, 'stroke-width': 2, 'stroke-linejoin': 'round' }, f);
    flashes.push(f);
  }
  // free electrons: two channels, above and below the row of particles
  const er = rng(77), elecs = [];
  for (let e = 0; e < 14; e++) {
    const sp = spark(barG, 13, { seed: e });
    const dot = E('circle', { r: 5.5, fill: C.air, stroke: '#0A1B27', 'stroke-width': 1.5 }, barG);
    elecs.push({ dot, sp, x0: BX + 30 + (e + er() * 0.6) * (BW - 60) / 14, y: e % 2 ? BY + 26 : BY - 26, ph: er() * TAU, ph2: er() * TAU, off: er() * BW });
  }
  const PIN = 7;                          // the electron the label points at
  elecs[PIN].x0 = 566; elecs[PIN].y = BY + 26;
  const th = thermometer(A, 150, C.bad); tr(th, 905, 297);
  const vibLbl = labelLine(A, 430, 262, px(1), BY - PR - 1, 'vibrate faster', { size: 30, fill: C.heat, line: C.heat });
  const passArrow = flowArrow(A, 290, 284, 850, 284, { width: 8 });
  const passLbl = T(A, 570, 230, 'energy passed along', { size: 30, anchor: 'middle', fill: C.heat });
  const coldLbl = T(A, 905, 442, 'cold end', { size: 28, anchor: 'middle', fill: C.water });
  const alongLbl = rich(A, 620, 526, [['energy', C.heat, 800], ' moves, the ', ['bar', C.ink, 800], ' doesn’t'], { size: 32, anchor: 'middle' });
  const metChip = chip(A, 'metals: the best conductors', { size: 28, fill: C.card2, stroke: C.line });
  tr(metChip, 560, 236);
  const eLbl = labelLine(A, 640, 474, 566, BY + 32, 'free electrons', { size: 30, fill: C.air, line: C.air });
  const eNote = T(A, 652, 512, 'tiny charged particles, free to move', { size: 26, fill: C.muted, font: FB });
  const fastChip = chip(A, 'much faster', { size: 30, fill: C.energy, color: C.bg0 });
  tr(fastChip, 745, 236);
  const vibMark = G(A);
  E('path', { d: 'M-10,-8 L10,-8 L0,6 Z', fill: C.heat }, vibMark);
  T(vibMark, 0, -18, 'vibrations', { size: 26, anchor: 'middle', fill: C.heat });

  /* ================= B. conductors and insulators ================= */
  const B = G(root);
  const hdrC = rich(B, 600, 168, [['Conductors', C.good, 800], ' let energy pass easily'], { size: 36, anchor: 'middle' });
  const CON = [['copper', '#F0A46B', '#9A5226'], ['aluminium', '#F0F3F6', '#98A6B2'], ['iron', '#8A949E', '#3A4249']].map(([name, c0, c1], i) => {
    const x = 300 + i * 300, y = 255, g = G(B);
    E('rect', { x: x - 115, y: y - 48, width: 230, height: 96, rx: 12, fill: linGrad(c0, c1, true), stroke: '#DDE4EA', 'stroke-width': 2.5 }, g);
    E('rect', { x: x - 101, y: y - 40, width: 202, height: 7, rx: 3.5, fill: '#FFFFFF', opacity: 0.35 }, g);
    const warm = E('rect', { x: x - 115, y: y - 48, width: 230, height: 96, rx: 12, fill: C.heat }, g);
    const fa = flowArrow(g, x - 142, y, x + 142, y, { width: 11 });
    const lb = T(B, x, y + 90, name, { size: 30, anchor: 'middle' });
    return { g, warm, fa, lb };
  });
  const hdrI = rich(B, 600, 430, [['Insulators', C.air, 800], ' slow it down'], { size: 36, anchor: 'middle' });
  const IY = 515;
  function sample(name, g, x, y) {
    const w = 150, h = 86, x0 = x - w / 2, y0 = y - h / 2;
    if (name === 'wood') {
      E('rect', { x: x0, y: y0, width: w, height: h, rx: 10, fill: linGrad('#D59A5E', '#9C632F', true), stroke: '#EBC08F', 'stroke-width': 2.5 }, g);
      E('path', { d: `M${x0 + 10},${y0 + 22} q35,-8 70,0 t60,-2 M${x0 + 8},${y0 + 46} q40,7 80,0 t55,3 M${x0 + 14},${y0 + 68} q30,-6 64,0 t58,-1`, fill: 'none', stroke: '#7E4A20', 'stroke-width': 2.5, opacity: 0.7 }, g);
    } else if (name === 'plastic') {
      E('rect', { x: x0, y: y0, width: w, height: h, rx: 22, fill: linGrad('#D493EC', '#7C3A99', true), stroke: '#EBC4F7', 'stroke-width': 2.5 }, g);
      E('rect', { x: x0 + 14, y: y0 + 10, width: w - 50, height: 10, rx: 5, fill: '#FFFFFF', opacity: 0.4 }, g);
    } else if (name === 'glass') {
      E('rect', { x: x0, y: y0, width: w, height: h, rx: 8, fill: 'rgba(200,230,250,0.16)', stroke: GLASS.stroke, 'stroke-width': 3 }, g);
      E('path', { d: `M${x0 + 26},${y0 + 70} L${x0 + 58},${y0 + 14} M${x0 + 48},${y0 + 74} L${x0 + 72},${y0 + 32}`, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.45 }, g);
    } else if (name === 'wool') {
      E('path', { d: closedPath(blobPts(w / 2, h / 2, 18, 0.3, 0.1, 6)), fill: '#EFE3C8', stroke: '#FFF6E3', 'stroke-width': 3, transform: `translate(${x} ${y})` }, g);
      const pk = G(g); g.pockets = pk;
      [[-44, -14, 8], [-16, 12, 9], [12, -16, 7], [38, 10, 8], [-30, 22, 6], [24, 26, 6], [50, -18, 6]].forEach(([dx, dy, r]) => E('circle', { cx: x + dx, cy: y + dy, r, fill: '#17394A', stroke: '#B7A57E', 'stroke-width': 2.5 }, pk));
    } else {
      E('rect', { x: x0, y: y0, width: w, height: h, rx: 10, fill: 'rgba(159,216,255,0.06)', stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '9 8' }, g);
      g.gas = [[-40, -18], [28, -20], [-8, 14], [44, 20], [-46, 24]].map(([dx, dy], k) => ({ el: E('circle', { r: 7, fill: ball(C.air, '#4C94C8') }, g), x: x + dx, y: y + dy, k }));
    }
  }
  const INS = ['wood', 'plastic', 'glass', 'wool', 'air'].map((name, i) => {
    const x = 168 + i * 216, g = G(B);
    const warm = E('ellipse', { cx: x - 66, cy: IY, rx: 36, ry: 40, fill: glow(C.heat) }, g);
    sample(name, g, x, IY);
    const da = dotArrow(g, x - 120, IY, x - 36, IY, { width: 7 });
    const lb = T(B, x, IY + 90, name, { size: 30, anchor: 'middle' });
    return { g, warm, da, lb, x };
  });
  const trapLine = rich(B, 600, 684, ['Many insulators work by ', ['trapping air', C.air, 800]], { size: 32, anchor: 'middle' });
  const trapGlows = [INS[3], INS[4]].map(o => { const e = E('ellipse', { cx: o.x, cy: IY, rx: 112, ry: 74, fill: glow(C.air) }, o.g); o.g.insertBefore(e, o.g.firstChild); return e; });

  /* ================= C. the mystery: tiles vs wood ================= */
  const Cf = G(root);
  const BK = 470, FR = 600, FF = 640;
  function floorSlab(parent) {
    const g = G(parent), q = y => (y - BK) / (FR - BK);
    const lx = y => lerp(120, 60, q(y));
    E('path', { d: `M120,${BK} L600,${BK} L600,${FR} L60,${FR} Z`, fill: linGrad('#AFC2D0', '#8199AB', true) }, g);
    E('path', { d: `M600,${BK} L1080,${BK} L1140,${FR} L600,${FR} Z`, fill: linGrad('#D9A062', '#B97B40', true) }, g);
    E('path', { d: `M60,${FR} L600,${FR} L600,${FF} L60,${FF} Z`, fill: '#5E7586' }, g);
    E('path', { d: `M600,${FR} L1140,${FR} L1140,${FF} L600,${FF} Z`, fill: '#8A5629' }, g);
    let d = '';
    [0.25, 0.5, 0.75].forEach(f => { d += `M${lerp(120, 600, f).toFixed(1)},${BK} L${lerp(60, 600, f).toFixed(1)},${FR} M${lerp(60, 600, f).toFixed(1)},${FR} L${lerp(60, 600, f).toFixed(1)},${FF} `; });
    [506, 549].forEach(y => { d += `M${lx(y).toFixed(1)},${y} L600,${y} `; });
    E('path', { d, stroke: '#DCE6EC', 'stroke-width': 3, fill: 'none', opacity: 0.9 }, g);
    const rr = rng(23);
    let p = '', gr = '';
    const pxAt = (f, y) => lerp(lerp(600, 1080, f), lerp(600, 1140, f), q(y));
    for (let k = 1; k < 6; k++) p += `M${pxAt(k / 6, BK).toFixed(1)},${BK} L${pxAt(k / 6, FR).toFixed(1)},${FR} M${pxAt(k / 6, FR).toFixed(1)},${FR} L${pxAt(k / 6, FR).toFixed(1)},${FF} `;
    for (let k = 0; k < 6; k++) {
      const yj = BK + 18 + rr() * 90;
      p += `M${pxAt(k / 6, yj).toFixed(1)},${yj.toFixed(1)} L${pxAt((k + 1) / 6, yj).toFixed(1)},${yj.toFixed(1)} `;
      [0.33, 0.68].forEach(f => {
        const y0 = BK + 8 + rr() * 40, y1 = y0 + 50 + rr() * 30, pts = [];
        for (let s = 0; s <= 4; s++) { const y = lerp(y0, y1, s / 4); pts.push([pxAt((k + f) / 6, y) + Math.sin(s * 1.7 + k) * 3, y]); }
        gr += openPath(pts) + ' ';
      });
    }
    E('path', { d: gr, stroke: '#A0682F', 'stroke-width': 2, fill: 'none', opacity: 0.85 }, g);
    E('path', { d: p, stroke: '#77461D', 'stroke-width': 3, fill: 'none' }, g);
    E('path', { d: `M120,${BK} L1080,${BK} L1140,${FR} L1140,${FF} L60,${FF} L60,${FR} Z`, fill: 'none', stroke: '#21384A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('line', { x1: 60, y1: FR, x2: 1140, y2: FR, stroke: '#21384A', 'stroke-width': 2.5 }, g);
    E('line', { x1: 600, y1: BK, x2: 600, y2: FF, stroke: '#21384A', 'stroke-width': 4 }, g);
    return g;
  }
  /* a bare foot (side view, toes to the right) under a pyjama leg; sole on y=0, heel at x=0, ~160 long */
  function foot(parent) {
    const g = G(parent);
    E('ellipse', { cx: 82, cy: 2, rx: 92, ry: 9, fill: '#000000', opacity: 0.25 }, g);
    E('path', { d: 'M6,-186 L46,-186 L46,-96 C50,-68 66,-52 92,-42 C120,-32 152,-30 161,-17 C167,-7 160,0 148,0 L14,0 C1,0 -7,-9 -7,-24 C-7,-44 3,-64 6,-96 Z', fill: linGrad('#F4CBA6', '#D29A6E', true), stroke: '#B57E55', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M150,-27 Q157,-33 163,-24 M136,-31 Q143,-37 149,-30 M122,-34 Q129,-40 135,-34 M26,-74 q8,-7 15,1', fill: 'none', stroke: '#B57E55', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -10, y: -258, width: 70, height: 82, rx: 8, fill: '#7FA6F2' }, g);
    E('path', { d: 'M-10,-240 L60,-240 M-10,-214 L60,-214 M-10,-188 L60,-188', stroke: '#E8EFFD', 'stroke-width': 6, opacity: 0.8 }, g);
    return g;
  }
  const slab = floorSlab(Cf);
  const mystery = chip(Cf, 'the mystery from the start', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy });
  tr(mystery, 600, 165);
  const thG = G(Cf);
  const thT = thermometer(thG, 180, C.bad); tr(thT, 200, 512); thT.set(0.38);
  const thW = thermometer(thG, 180, C.bad); tr(thW, 1000, 512); thW.set(0.38);
  const rdT = chip(thG, '20 °C', { size: 30, fill: C.card2, stroke: C.line }); tr(rdT, 200, 290);
  const rdW = chip(thG, '20 °C', { size: 30, fill: C.card2, stroke: C.line }); tr(rdW, 1000, 290);
  const eqG = G(Cf);
  T(eqG, 600, 312, '=', { size: 72, weight: 700, anchor: 'middle', fill: C.good });
  T(eqG, 600, 372, 'same temperature', { size: 32, weight: 700, anchor: 'middle' });
  const betterLbl = rich(Cf, 330, 692, ['much ', ['better conductor', C.energy, 800]], { size: 30, anchor: 'middle' });
  const footT = foot(Cf), footW = foot(Cf);
  const shiver = E('path', { d: 'M222,452 q-7,9 0,18 t0,18 M206,466 q-7,9 0,18 t0,18 M438,440 q7,9 0,18 t0,18 M454,454 q7,9 0,18 t0,18', fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round' }, Cf);
  const tileArrows = [290, 333, 376].map(x => flowArrow(Cf, x, 554, x, 636, { width: 11, side: x === 333 ? 1 : -1 }));
  const woodArrow = dotArrow(Cf, 870, 554, 870, 604, { width: 6 });
  const fastLbl = rich(Cf, 330, 692, ['heat escapes ', ['fast', C.heat, 800]], { size: 30, anchor: 'middle' });
  const slowLbl = rich(Cf, 870, 692, ['only a ', ['trickle', C.muted, 800]], { size: 30, anchor: 'middle' });
  const chillLbl = rich(Cf, 600, 248, ['the chill is ', ['your own heat escaping', C.heat, 800]], { size: 32, anchor: 'middle' });

  /* ================= D. metal spoon vs wooden spoon ================= */
  const Ds = G(root);
  function fist(parent) {
    const g = G(parent);
    E('path', { d: 'M-152,-27 L-34,-30 L-34,30 L-152,33 Z', fill: linGrad('#F0C29C', '#C98E62', true), stroke: '#B57E55', 'stroke-width': 2 }, g);
    E('rect', { x: -186, y: -40, width: 56, height: 82, rx: 12, fill: '#5B8DEF' }, g);
    E('rect', { x: -46, y: -40, width: 92, height: 80, rx: 30, fill: linGrad('#F6CEAA', '#CF9468', true), stroke: '#B57E55', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M12,-22 Q40,-20 40,-8 M12,-2 Q43,0 42,12 M12,18 Q38,20 37,30', fill: 'none', stroke: '#B57E55', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-34,-38 C-22,-58 28,-58 38,-40 C30,-33 -20,-30 -34,-38 Z', fill: '#EDB98F', stroke: '#B57E55', 'stroke-width': 2.5 }, g);
    return g;
  }
  function spoon(parent, metal) {
    const g = G(parent);
    if (metal) {
      E('rect', { x: -20, y: -11, width: 440, height: 22, rx: 11, fill: linGrad('#F3F6F9', '#8996A2', true), stroke: '#D9E0E6', 'stroke-width': 2 }, g);
      E('ellipse', { cx: 480, cy: 0, rx: 82, ry: 46, fill: linGrad('#F5F8FA', '#8392A0', true), stroke: '#E1E7EC', 'stroke-width': 3 }, g);
      E('ellipse', { cx: 462, cy: -14, rx: 38, ry: 11, fill: '#FFFFFF', opacity: 0.5 }, g);
    } else {
      E('rect', { x: -20, y: -15, width: 440, height: 30, rx: 15, fill: linGrad('#DCA368', '#9A6131', true), stroke: '#EBC08F', 'stroke-width': 2 }, g);
      E('ellipse', { cx: 480, cy: 0, rx: 82, ry: 46, fill: linGrad('#DCA368', '#93592A', true), stroke: '#EBC08F', 'stroke-width': 3 }, g);
      E('path', { d: 'M60,-5 q60,-6 120,-1 t140,-2 M90,6 q70,-4 140,1 t100,0 M440,-18 q30,-6 60,4', fill: 'none', stroke: '#7E4A20', 'stroke-width': 2, opacity: 0.7 }, g);
    }
    return g;
  }
  const tag = chip(Ds, 'both at 20 °C: the same temperature', { size: 28, fill: C.card2, stroke: C.line });
  tr(tag, 600, 138);
  const spM = G(Ds); tr(spM, 300, 320); spoon(spM, true); fist(spM);
  const spW = G(Ds); tr(spW, 300, 560); spoon(spW, false); fist(spW);
  const nmM = T(Ds, 890, 330, 'metal', { size: 32, weight: 700 });
  const nmW = T(Ds, 890, 570, 'wood', { size: 32, weight: 700 });
  const coldM = T(Ds, 290, 228, 'feels cold', { size: 30, anchor: 'middle', fill: C.air });
  const shivM = E('path', { d: 'M226,240 q-7,9 0,18 t0,18 M210,250 q-7,9 0,18 t0,18', fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round' }, Ds);
  const faM = flowArrow(Ds, 392, 264, 700, 264, { width: 15 });
  const faW = flowArrow(Ds, 392, 502, 520, 502, { width: 4, waves: false });
  const fastM = rich(Ds, 560, 214, ['out of your hand ', ['faster', C.heat, 800]], { size: 30, anchor: 'middle' });
  const slowW = T(Ds, 458, 470, 'slower', { size: 28, anchor: 'middle', fill: C.muted });

  /* ================= E. try it at home: ice cubes ================= */
  const Ei = G(root);
  function stopwatch(parent) {
    const g = G(parent);
    E('rect', { x: -9, y: -66, width: 18, height: 16, rx: 3, fill: C.muted }, g);
    E('rect', { x: -17, y: -74, width: 34, height: 11, rx: 4, fill: C.muted }, g);
    E('circle', { r: 50, fill: C.card, stroke: C.muted, 'stroke-width': 6 }, g);
    let d = ''; for (let k = 0; k < 12; k++) { const a = k * TAU / 12; d += `M${(Math.cos(a) * 36).toFixed(1)},${(Math.sin(a) * 36).toFixed(1)} L${(Math.cos(a) * 43).toFixed(1)},${(Math.sin(a) * 43).toFixed(1)} `; }
    E('path', { d, stroke: C.faint, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const hand = E('line', { x1: 0, y1: 6, x2: 0, y2: -34, stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 6, fill: C.energy }, g);
    g.set = turns => hand.setAttribute('transform', `rotate(${(turns * 360).toFixed(1)})`);
    return g;
  }
  /* ice cube of size s, base centre at (0,0); g.set(melt 0..1) shrinks it into a puddle */
  function iceCube(parent, s) {
    const g = G(parent), d = s * 0.3;
    const puddle = E('ellipse', { cx: 6, cy: -1, rx: s * 0.5, ry: 5, fill: 'rgba(76,201,240,0.5)', stroke: '#A8E6F8', 'stroke-width': 2 }, g);
    const cube = G(g);
    E('path', { d: `M${-s / 2},${-s} L${-s / 2 + d},${-s - d * 0.75} L${s / 2 + d},${-s - d * 0.75} L${s / 2 + d},${-d * 0.75} L${s / 2},0 L${-s / 2},0 Z`, fill: 'rgba(160,220,245,0.55)' }, cube);
    E('path', { d: `M${s / 2},${-s} L${s / 2 + d},${-s - d * 0.75} L${s / 2 + d},${-d * 0.75} L${s / 2},0 Z`, fill: 'rgba(120,195,232,0.85)', stroke: '#E9F9FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cube);
    E('path', { d: `M${-s / 2},${-s} L${-s / 2 + d},${-s - d * 0.75} L${s / 2 + d},${-s - d * 0.75} L${s / 2},${-s} Z`, fill: 'rgba(232,249,255,0.95)', stroke: '#E9F9FF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cube);
    E('rect', { x: -s / 2, y: -s, width: s, height: s, rx: 5, fill: 'rgba(196,236,252,0.88)', stroke: '#E9F9FF', 'stroke-width': 2.5 }, cube);
    E('path', { d: `M${-s / 2 + 11},${-s + 12} L${-s / 2 + 11},${-s * 0.42}`, stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, cube);
    g.set = m => {
      m = clamp(m);
      tr(cube, 0, 0, Math.max(0.04, 1 - 0.84 * m));
      op(cube, m > 0.97 ? 0 : 1);
      attr(puddle, 'rx', s * (0.5 + 0.85 * m)); attr(puddle, 'ry', 5 + 8 * m);
      op(puddle, clamp(m * 5));
    };
    g.set(0);
    return g;
  }
  function tray(g) {
    E('path', { d: 'M-150,0 L150,0 L136,28 L-136,28 Z', fill: linGrad('#EEF2F5', '#8592A0', true), stroke: '#DDE4EA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -158, y: -8, width: 316, height: 11, rx: 5.5, fill: '#CBD4DC', stroke: '#F1F5F8', 'stroke-width': 2 }, g);
  }
  function board(g) {
    E('rect', { x: -150, y: -4, width: 300, height: 36, rx: 8, fill: linGrad('#DCA368', '#9A6131', true), stroke: '#EBC08F', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-130,8 q60,-5 120,0 t120,-1 M-120,20 q70,4 140,0 t90,2', fill: 'none', stroke: '#7E4A20', 'stroke-width': 2, opacity: 0.7 }, g);
    E('circle', { cx: 122, cy: 14, r: 6, fill: '#3A2410' }, g);
  }
  function plate(g) {
    E('ellipse', { cx: 0, cy: 6, rx: 150, ry: 24, fill: linGrad('#D493EC', '#7C3A99', true), stroke: '#EBC4F7', 'stroke-width': 2.5 }, g);
    E('ellipse', { cx: 0, cy: 3, rx: 100, ry: 13, fill: 'none', stroke: '#EBC4F7', 'stroke-width': 2, opacity: 0.7 }, g);
  }
  const home = chip(Ei, 'Try it at home', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy });
  tr(home, 600, 160);
  const watch = stopwatch(Ei); tr(watch, 1084, 232);
  const spedUp = T(Ei, 1084, 322, 'speeded up', { size: 24, anchor: 'middle', fill: C.muted, font: FB });
  const SURF = [
    { x: 250, name: 'metal tray', make: tray, melt: 0.9, thick: true },
    { x: 600, name: 'wooden board', make: board, melt: 0.14 },
    { x: 950, name: 'plastic plate', make: plate, melt: 0.18 },
  ].map(sf => {
    const g = G(Ei); tr(g, sf.x, 470);
    sf.make(g);
    sf.cubeG = G(g);
    sf.cube = iceCube(sf.cubeG, 76);
    sf.arrows = sf.thick ? [-26, 0, 26].map(dx => arrow(g, dx, 30, dx, -16, { color: C.heat, width: 8 })) : [dotArrow(g, 0, 30, 0, -10, { width: 5 })];
    sf.lb = T(Ei, sf.x, 568, sf.name, { size: 30, anchor: 'middle' });
    sf.g = g;
    return sf;
  });
  const firstG = G(Ei);
  const firstTick = tick(firstG, 16); tr(firstTick, 168, 642);
  rich(firstG, 196, 654, ['melts ', ['first', C.good, 800]], { size: 32 });

  /* ================= update ================= */
  return t => {
    /* ---- title chips ---- */
    ways.forEach((o, i) => {
      const p = P(t, mid('first', 0.02 + i * 0.07), 0.45, pop);
      if (i !== ME) {
        op(o.lit, 0);
        op(o.g, clamp(p * 2) * (1 - P(t, mid('first', 0.38), 0.5, linear)));
        tr(o.g, WX[i], WY, 0.85 + 0.15 * clamp(p));
        return;
      }
      const lit = P(t, mid('first', 0.2), 0.4, linear);
      op(o.g, clamp(p * 2)); op(o.lit, lit); op(o.dim, 1 - lit);
      const c = P(t, mid('first', 0.36), 0.8), h = P(t, at('end') - 0.7, 0.8);
      const x = lerp(lerp(WX[i], 600, c), 1160 - o.w * 0.45, h), y = lerp(WY, 60, h);
      const s = lerp(lerp(1, 1.5, c), 0.9, h) * (0.85 + 0.15 * clamp(p));
      tr(o.g, x, y, s);
    });

    /* ---- A. the bar ---- */
    const aA = win(t, S.first - 0.5, at('conductors') - 0.05, 0.45);
    op(A, aA);
    if (aA > 0) {
      tr(barG, lerp(-950, 0, P(t, mid('first', 0.5), 1.1, easeOut)), 0);
      op(solidsChip, win(t, mid('first', 0.66), at('end') - 0.1, 0.4));
      op(bun, P(t, at('end') - 0.3, 0.5, linear));
      const flameOn = (t >= mid('end', 0.12) && t < at('metals') + 0.25) || t >= at('zip') + 0.05;
      bun.set(flameOn ? 'blue' : 'off'); bun.upd(t);

      // the vibration front F (in particle steps): heating, bumping along, reaching the cold end
      const F = 2.2 * P(t, mid('end', 0.3), end('end') - mid('end', 0.3), linear)
        + 7.3 * P(t, at('bump') + 0.1, end('bump') - at('bump') + 0.3, linear)
        + 3.0 * P(t, at('along'), mid('along', 0.55) - at('along'), easeOut);
      const cool = 1 - P(t, at('metals') + 0.25, 2.2, ease);
      // second run: a slow vibration front F2, while free electrons spread energy fast (E2)
      const F2 = 4.6 * P(t, at('zip') + 0.2, end('zip') + 0.3 - at('zip'), linear);
      const E2 = 0.5 * P(t, mid('zip', 0.22), 2.4, easeOut);
      let hEnd = 0;
      parts.forEach((o, i) => {
        const h1 = o.prof * smooth((F - i) / 1.2) * cool;
        const h2 = t >= at('zip') ? Math.max(o.prof * smooth((F2 - i) / 1.2), E2 * lerp(1, 0.8, i / (NP - 1))) : 0;
        const h = Math.max(h1, h2);
        if (i === NP - 1) hEnd = h;
        const knockOut = gauss(F - (i + 0.8), 0.3) + gauss(F2 - (i + 0.8), 0.3);       // lurches into the next one
        const knockIn = gauss(F - (i - 0.1), 0.3) + gauss(F2 - (i - 0.1), 0.3);        // is shoved by the last one
        const amp = (1.2 + 7.5 * h) * calm;
        const dx = amp * Math.sin(t * o.w1 + o.ph1) + (14 * knockOut + 6 * knockIn) * calm, dy = amp * 0.45 * Math.cos(t * o.w2 + o.ph2);
        tr(o.g, px(i) + dx, BY + dy);
        o.b.set(h);
        op(o.vib, clamp((h - 0.15) * 1.6));
      });
      flashes.forEach((f, k) => {
        const v = Math.max(gauss(F - (k + 0.8), 0.28), gauss(F2 - (k + 0.8), 0.28));
        op(f, v > 0.05 ? v : 0);
        if (v > 0.05) tr(f, BX + SP * (k + 1), BY, 0.5 + 0.7 * v, t * 90);
      });

      // labels for the first run
      vibLbl.set(win(t, mid('end', 0.45), at('bump') - 0.05, 0.35));
      const pa = win(t, at('bump') + 0.1, at('metals') + 0.1, 0.4);
      op(passArrow, pa);
      if (pa > 0) passArrow.draw(t, clamp((F - 2.2) / 9.5));
      op(passLbl, win(t, mid('bump', 0.25), at('metals') + 0.1, 0.4));
      th.set(0.12 + 0.85 * clamp(hEnd / 0.5));
      op(th, P(t, at('along') - 0.3, 0.5, linear));
      op(coldLbl, P(t, at('along') + 0.2, 0.5, linear));
      op(outline, win(t, mid('along', 0.45), at('metals') + 0.2, 0.4));
      op(alongLbl, win(t, mid('along', 0.4), at('metals') + 0.1, 0.4));

      // free electrons: drift at random, then race to the cold end carrying energy
      const eOn = P(t, mid('metals', 0.3), 0.6, linear), z = P(t, at('zip') + 0.1, 0.7);
      elecs.forEach((e, k) => {
        if (eOn <= 0) { op(e.dot, 0); op(e.sp, 0); return; }
        const wob = k === PIN ? 0.35 : 1;
        const xd = e.x0 + wob * (30 * Math.sin(t * 0.9 * calm + e.ph) + 18 * Math.sin(t * 2.1 * calm + e.ph2));
        const u = ((t - at('zip')) * 330 + e.off) % (BW - 30), xz = BX + 15 + (u < 0 ? u + BW - 30 : u);
        const x = lerp(xd, xz, z), y = e.y + 3 * Math.sin(t * 3 + e.ph);
        attr(e.dot, 'cx', x); attr(e.dot, 'cy', y);
        const edge = Math.min(1, (x - BX) / 40, (BX + BW - x) / 40);
        op(e.dot, eOn * (z > 0 ? lerp(1, Math.max(0.15, edge), z) : 1));
        const sv = z * clamp(edge) * clamp((xz - BX - 20) / 30) * (1 - clamp((xz - (BX + BW - 70)) / 50));
        op(e.sp, sv);
        if (sv > 0) { tr(e.sp, x, y - 1); e.sp.upd(t); }
      });
      op(metChip, win(t, mid('metals', 0.1), at('zip') + 0.1, 0.4));
      eLbl.set(P(t, mid('metals', 0.42), 0.5, linear));
      op(eNote, P(t, mid('metals', 0.6), 0.5, linear));
      const fp = P(t, mid('zip', 0.42), 0.5, pop);
      op(fastChip, clamp(fp * 2)); tr(fastChip, 745, 236, 0.8 + 0.2 * clamp(fp));
      const vm = win(t, at('zip') + 0.3, at('conductors') + 0.5, 0.4);
      op(vibMark, vm);
      if (vm > 0) tr(vibMark, BX + SP * clamp(F2 - 0.1, 0.4, NP), BY - BH / 2 - 14);
    }

    /* ---- B. conductors and insulators ---- */
    const aB = win(t, at('conductors') - 0.2, at('floor') - 0.05, 0.45);
    op(B, aB);
    if (aB > 0) {
      op(hdrC, P(t, at('conductors') - 0.1, 0.5, linear));
      CON.forEach((o, i) => {
        const p = P(t, mid('conductors', 0.08 + i * 0.13), 0.5, pop);
        op(o.g, clamp(p * 2)); tr(o.g, 0, (1 - clamp(p)) * 20);
        const ap = P(t, mid('conductors', 0.1 + i * 0.13) + 0.3, 0.9, easeOut);
        o.fa.draw(t, ap);
        attr(o.warm, 'opacity', 0.32 * ap);
        op(o.lb, P(t, mid('conductors', [0.63, 0.73, 0.88][i]), 0.4, linear));
      });
      op(hdrI, P(t, at('insulators') - 0.1, 0.5, linear));
      const trap = P(t, mid('insulators', 0.6), 0.5, linear);
      INS.forEach((o, i) => {
        const t0 = mid('insulators', 0.22 + i * 0.07), p = P(t, t0, 0.5, pop);
        op(o.g, clamp(p * 2)); tr(o.g, 0, (1 - clamp(p)) * 20);
        o.da.set(P(t, t0 + 0.25, 0.7, easeOut));
        attr(o.warm, 'opacity', 0.75 * P(t, t0 + 0.5, 0.6, linear));
        op(o.lb, clamp(p * 2));
      });
      // trapped air: the wool's pockets swell and glow, the air sample's particles drift
      op(trapLine, trap);
      const wool = INS[3], air = INS[4], pulse = 1 + 0.18 * trap * wave(t, 1.1);
      wool.g.pockets.setAttribute('transform', `translate(${wool.x} ${IY}) scale(${pulse.toFixed(3)}) translate(${-wool.x} ${-IY})`);
      wool.g.pockets.childNodes.forEach(c => c.setAttribute('stroke', trap > 0.5 ? C.air : '#B7A57E'));
      air.g.gas.forEach(q => { attr(q.el, 'cx', q.x + 7 * Math.sin(t * 1.7 * calm + q.k * 1.3)); attr(q.el, 'cy', q.y + 5 * Math.cos(t * 1.3 * calm + q.k * 2.1)); });
      trapGlows.forEach(r => op(r, trap * (0.35 + 0.2 * wave(t, 1.1))));
    }

    /* ---- C. tiles vs wood ---- */
    const aC = win(t, at('floor') - 0.2, at('spoon') - 0.05, 0.45);
    op(Cf, aC);
    if (aC > 0) {
      op(slab, P(t, at('floor') - 0.2, 0.5, linear)); tr(slab, 0, (1 - P(t, at('floor') - 0.2, 0.7, easeOut)) * 40);
      op(mystery, win(t, at('floor') - 0.1, at('feet') - 0.1, 0.4));
      const thIn = P(t, mid('floor', 0.3), 0.5, linear), thOut = 1 - P(t, at('feet') - 0.2, 0.5, linear);
      op(thG, thIn * thOut);
      const rise = P(t, mid('floor', 0.3), 1.2, easeOut);
      thT.set(0.38 * rise + 0.05); thW.set(0.38 * rise + 0.05);
      op(rdT, P(t, mid('floor', 0.42), 0.4, linear)); op(rdW, P(t, mid('floor', 0.42), 0.4, linear));
      op(eqG, P(t, mid('floor', 0.5), 0.4, linear) * thOut);
      op(betterLbl, win(t, mid('floor', 0.72), at('feet') + 0.4, 0.4));
      [footT, footW].forEach((f, i) => {
        const p = P(t, at('feet') - 0.1 + i * 0.25, 0.6, easeOut);
        op(f, clamp(p * 3)); tr(f, i ? 790 : 250, 554 - (1 - p) * 70);
      });
      const on = P(t, mid('feet', 0.12), 0.4, linear);
      tileArrows.forEach((a, i) => { a.draw(t, P(t, mid('feet', 0.12 + i * 0.05), 0.6, easeOut)); op(a, on); });
      woodArrow.set(P(t, mid('feet', 0.35), 0.8, easeOut));
      op(fastLbl, P(t, mid('feet', 0.3), 0.4, linear)); op(slowLbl, P(t, mid('feet', 0.42), 0.4, linear));
      op(chillLbl, P(t, mid('feet', 0.6), 0.5, linear));
      const sh = P(t, mid('feet', 0.62), 0.5, linear);
      op(shiver, sh); tr(shiver, Math.sin(t * 40) * 1.6 * calm, 0);
    }

    /* ---- D. spoons ---- */
    const aD = win(t, at('spoon') - 0.2, at('ice') - 0.05, 0.45);
    op(Ds, aD);
    if (aD > 0) {
      const pm = P(t, at('spoon') - 0.1, 0.6, easeOut), pw = P(t, at('spoon') + 0.15, 0.6, easeOut);
      op(spM, pm); tr(spM, 300 - (1 - pm) * 60, 320);
      op(spW, pw); tr(spW, 300 - (1 - pw) * 60, 560);
      op(nmM, pm); op(nmW, pw);
      op(coldM, P(t, mid('spoon', 0.1), 0.4, linear));
      op(shivM, P(t, mid('spoon', 0.1), 0.4, linear)); tr(shivM, Math.sin(t * 40) * 1.6 * calm, 0);
      op(tag, P(t, mid('spoon', 0.32), 0.45, linear));
      faM.draw(t, P(t, mid('spoon', 0.55), 0.9, easeOut)); op(faM, P(t, mid('spoon', 0.55), 0.2, linear));
      faW.draw(t, P(t, mid('spoon', 0.6), 0.8, easeOut)); op(faW, P(t, mid('spoon', 0.6), 0.2, linear));
      op(fastM, P(t, mid('spoon', 0.72), 0.4, linear)); op(slowW, P(t, mid('spoon', 0.8), 0.4, linear));
    }

    /* ---- E. ice cubes ---- */
    const aE = P(t, at('ice') - 0.2, 0.45, linear);
    op(Ei, aE);
    if (aE > 0) {
      op(home, P(t, at('ice') - 0.1, 0.4, linear));
      const drop = mid('ice', 0.8);
      SURF.forEach((sf, i) => {
        const p = P(t, mid('ice', 0.3 + i * 0.15), 0.5, pop);
        op(sf.g, clamp(p * 2)); tr(sf.g, sf.x, 470 + (1 - clamp(p)) * 24);
        op(sf.lb, clamp(p * 2));
        // each cube waits above its surface, then all three drop at the same moment
        const fall = P(t, drop, 0.45, easeIn), hold = P(t, mid('ice', 0.38 + i * 0.15), 0.4, linear);
        op(sf.cubeG, hold);
        const bounce = t > drop + 0.45 ? -6 * Math.sin(Math.PI * clamp((t - drop - 0.45) / 0.25)) : 0;
        const bob = (1 - fall) * 4 * calm * Math.sin(t * 2.2 + i);
        tr(sf.cubeG, 0, -10 - (1 - fall) * 110 + bob + bounce);
        const m = sf.melt * P(t, mid('melts', 0.05), end('melts') - mid('melts', 0.05) + 0.3, sf.thick ? ease : linear);
        sf.cube.set(m);
        const ap = P(t, at('melts') + (sf.thick ? 0 : 0.6), 0.7, easeOut);
        sf.arrows.forEach(a => { a.set(ap); op(a, ap > 0.02 ? 1 : 0); });
      });
      op(watch, P(t, mid('ice', 0.7), 0.4, linear)); op(spedUp, P(t, mid('ice', 0.85), 0.4, linear));
      watch.set(Math.max(0, t - mid('ice', 0.86)) / 3);
      const fp = P(t, mid('melts', 0.55), 0.5, pop);
      op(firstG, clamp(fp * 2)); tr(firstG, 0, (1 - clamp(fp)) * 12);
    }
  };
});

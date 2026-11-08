/* Chapter: Chloroplasts: why leaves are green.
   A leaf -> the camera dives into one leaf cell full of chloroplasts -> into one chloroplast: chlorophyll held
   in stacks of tiny discs that catch the light -> back out: white sunlight fans into its colours and red and blue
   sink into the leaf as energy -> green bounces off into your eye, so the leaf looks green (showpiece) -> the
   trap: it reflects green, the colour it uses least -> chlorophyll (the pigment) vs chloroplast (the structure)
   -> palisade cells near the top of the leaf, crammed with chloroplasts, under the light. */
scene('chloro', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ================= shared art: the leaf cross-section =================
     Identical code in 03_chloro.js, 04_leaf.js and 05_supply.js, so the section looks the same in all three.
     About 700 x 380 around (0,0). Top to bottom: waxy cuticle, upper epidermis (clear brick cells), palisade
     mesophyll (tall columns lined with chloroplasts), spongy mesophyll (round, loosely packed cells; the pale
     blue between them is air space), one vein (xylem vessels blue, phloem amber), and the lower epidermis with
     one stoma between two guard cells. g.set(open 0..1) opens the stoma; g.air(v) sets how blue the air spaces
     look; g.L.* are the layer groups (for dimming); g.pal / g.spo are the cells; g.P holds anchor points.
     o.x0 / o.x1 skip cells wholly outside that x range (fewer elements when only part of it shows). */
  function leafSection(parent, o) {
    o = o || {};
    const g = G(parent), rr = rng(4242), L = {};
    const xa = o.x0 === undefined ? -999 : o.x0, xb = o.x1 === undefined ? 999 : o.x1;
    const vis = (l, r) => r >= xa && l <= xb;
    const SX = 190, VX = 40, VY = 18, VR = 50, SG = 48;
    const Y = { c0: -196, e0: -185, e1: -153, p0: -149, p1: -42, s0: -40, s1: 145, l0: 146, l1: 177 };
    const WALL = '#6FD08C', CELL = '#1D5239', CLEAR = 'rgba(205,240,225,0.10)', EDGE = '#A9DCC2', WAX = '#E6F6C6';
    const f1 = v => +v.toFixed(1);
    const chl = (p, x, y, deg) => E('ellipse', { cx: f1(x), cy: f1(y), rx: 4.6, ry: 7.6, fill: ball(C.chloro, C.chloroDk), transform: deg ? `rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})` : undefined }, p);
    // the many small chloroplasts of a layer are drawn as one path (green, with a glint) to keep elements down
    const chlSet = () => { const d = [], gl = []; return { add(x, y, deg) { deg = deg || 0; const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), A = `A4.6,7.6 ${deg.toFixed(1)} 1 0 `;
      d.push(`M${f1(x - 4.6 * ca)},${f1(y - 4.6 * sa)} ${A}${f1(x + 4.6 * ca)},${f1(y + 4.6 * sa)} ${A}${f1(x - 4.6 * ca)},${f1(y - 4.6 * sa)}Z`);
      gl.push(`M${f1(x - 1.6 * ca + 3 * sa)},${f1(y - 1.6 * sa - 3 * ca)} l0.01,0`); },
      draw(p) { if (!d.length) return; E('path', { d: d.join(''), fill: '#4CC56F', stroke: C.chloroDk, 'stroke-width': 1.4 }, p); E('path', { d: gl.join(''), fill: 'none', stroke: '#EFFFF3', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, p); } }; };
    const brick = (grp, x0, x1, y0, y1, n) => {
      const ws = []; for (let i = 0; i < n; i++) ws.push(0.82 + rr() * 0.36);
      const sum = ws.reduce((a, b) => a + b, 0); let x = x0;
      ws.forEach(w => { const ww = w / sum * (x1 - x0); if (vis(x, x + ww)) E('rect', { x: f1(x + 1.5), y: y0, width: f1(ww - 3), height: y1 - y0, rx: 9, fill: CLEAR, stroke: EDGE, 'stroke-width': 2.5 }, grp); x += ww; });
    };
    // air spaces: pale blue behind the mesophyll, showing between the loose spongy cells
    L.air = G(g);
    const airR = E('rect', { x: -350, y: Y.p1 - 6, width: 700, height: Y.l0 - Y.p1 + 12, fill: C.air, 'fill-opacity': 0.13 }, L.air);
    // spongy mesophyll: round cells with gaps between them, clear of the vein and of the chamber above the stoma
    L.spo = G(g); g.spo = []; const spoChl = chlSet();
    for (let k = 0; k < 1500 && g.spo.length < 26; k++) {
      const rx = 24 + rr() * 9, ry = rx * (0.8 + rr() * 0.28), r = Math.max(rx, ry);
      const x = -347 + rx + rr() * (694 - 2 * rx), y = Y.s0 + ry + 1 + rr() * (Y.s1 - Y.s0 - 2 * ry - 2);
      if (Math.hypot(x - VX, y - VY) < VR + r + 9) continue;
      if (Math.abs(x - SX) < SG + rx && y + ry > 90) continue;
      if (g.spo.some(c => Math.hypot(c.x - x, c.y - y) < c.r + r + 11)) continue;
      g.spo.push({ x, y, rx, ry, r, seed: k });
    }
    g.spo.forEach(c => {
      const a0 = rr() * TAU, j = [rr(), rr(), rr()];
      c.chlAt = j.map((v, i) => { const a = a0 + i * TAU / 3 + (v - 0.5) * 0.6; return [c.x + Math.cos(a) * c.rx * 0.6, c.y + Math.sin(a) * c.ry * 0.6, a * 180 / Math.PI]; });
      if (!vis(c.x - c.r, c.x + c.r)) return;
      c.vis = true;
      c.el = E('path', { d: closedPath(blobPts(c.rx, c.ry, 10, 0, 0.09, c.seed + 5).map(p => [p[0] + c.x, p[1] + c.y])), fill: CELL, stroke: WALL, 'stroke-width': 2.5 }, L.spo);
      c.chlAt.forEach(q => spoChl.add(q[0], q[1], q[2]));
    });
    spoChl.draw(L.spo);
    // one vein: bundle sheath, xylem vessels (blue, hollow) above, phloem (amber) below
    L.vein = G(g);
    if (vis(VX - VR, VX + VR)) {
      E('circle', { cx: VX, cy: VY, r: VR, fill: '#215A43', stroke: '#8EE3A4', 'stroke-width': 3 }, L.vein);
      g.xyl = [[-19, -21, 11], [5, -27, 12], [25, -14, 10], [-32, -4, 8], [7, -3, 8.5]].map(([dx, dy, r]) => E('circle', { cx: VX + dx, cy: VY + dy, r, fill: '#0D3346', stroke: C.water, 'stroke-width': 4 }, L.vein));
      g.phl = [[-22, 19, 7], [-7, 27, 7], [11, 28, 7], [25, 15, 6.5], [-8, 14, 5.5], [9, 14, 5.5]].map(([dx, dy, r]) => E('circle', { cx: VX + dx, cy: VY + dy, r, fill: '#4D3B12', stroke: C.glucose, 'stroke-width': 3 }, L.vein));
    }
    // palisade mesophyll: tall columns lined with chloroplasts
    L.pal = G(g); g.pal = []; const palChl = chlSet();
    const NP = 16, PG = 4, PW = (700 - (NP - 1) * PG) / NP;
    for (let i = 0; i < NP; i++) {
      const x = -350 + i * (PW + PG), top = Y.p0 + rr() * 3, bot = Y.p1 - rr() * 5, h = bot - top, jit = [];
      for (let k = 0; k < 20; k++) jit.push(rr() - 0.5);
      const c = { x, w: PW, top, bot, cx: x + PW / 2, cy: (top + bot) / 2 };
      g.pal.push(c);
      if (!vis(x, x + PW)) continue;
      c.vis = true;
      c.el = E('rect', { x: f1(x), y: f1(top), width: f1(PW), height: f1(h), rx: 15, fill: CELL, stroke: WALL, 'stroke-width': 2.5 }, L.pal);
      for (let k = 0; k < 5; k++) {
        const yy = top + 14 + k * (h - 30) / 4;
        palChl.add(x + 9 + jit[4 * k] * 2, yy + jit[4 * k + 1] * 4);
        palChl.add(x + PW - 9 + jit[4 * k + 2] * 2, yy + 5 + jit[4 * k + 3] * 4);
      }
    }
    palChl.draw(L.pal);
    // upper epidermis (clear brick cells) and the waxy cuticle on top
    L.epi = G(g);
    brick(L.epi, -350, 350, Y.e0, Y.e1, 13);
    L.cut = G(g);
    E('rect', { x: -350, y: Y.c0, width: 700, height: Y.e0 - Y.c0 + 1, fill: WAX, opacity: 0.5 }, L.cut);
    E('line', { x1: -350, y1: Y.c0, x2: 350, y2: Y.c0, stroke: '#F6FFE6', 'stroke-width': 2.5 }, L.cut);
    // lower epidermis with a gap for the stoma, and its thin cuticle
    L.low = G(g);
    brick(L.low, -350, SX - SG, Y.l0, Y.l1, 10);
    brick(L.low, SX + SG, 350, Y.l0, Y.l1, 2);
    E('rect', { x: -350, y: Y.l1, width: SX - SG + 350, height: 4, fill: WAX, opacity: 0.5 }, L.low);
    E('rect', { x: SX + SG, y: Y.l1, width: 350 - SX - SG, height: 4, fill: WAX, opacity: 0.5 }, L.low);
    // the two guard cells either side of the pore: open, they swell and bow apart
    L.gua = G(g);
    const gc = [-1, 1].map(s => { const cg = G(L.gua); const el = E('ellipse', { rx: 20, ry: 16, fill: '#2E7D50', stroke: '#9BEAB2', 'stroke-width': 3 }, cg); chl(cg, -3 * s, -5); chl(cg, 5 * s, 6); return { s, cg, el }; });
    g.set = v => {
      v = clamp(v);
      const rx = lerp(23.2, 17, v), ry = lerp(14.5, 19.5, v);
      gc.forEach(c => { tr(c.cg, SX + c.s * (SG - rx), 161.5); attr(c.el, 'rx', rx); attr(c.el, 'ry', ry); });
      g.open = v; g.pore = SG - 2 * rx;     // half-width of the pore
    };
    g.set(o.open === undefined ? 0.6 : o.open);
    g.P = { cut: [0, Y.c0 + 5], pal: [0, (Y.p0 + Y.p1) / 2], sto: [SX, 162], cham: [SX, 112], vein: [VX, VY], xyl: [VX + 5, VY - 27], phl: [VX - 7, VY + 27] };
    Object.assign(g, { SX, VX, VY, VR, SG, Y, L });
    g.air = v => attr(airR, 'fill-opacity', v);
    return g;
  }

  /* ================= local helpers ================= */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a label with a leader line to (tx, ty) */
  function pointer(parent, x, y, segs, o) {
    o = o || {};
    const g = G(parent), size = o.size || 30, col = o.line || C.muted;
    const from = o.from || [x - 10, y - size * 0.33];
    const ln = E('line', { x1: from[0], y1: from[1], x2: from[0], y2: from[1], stroke: col, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    const dot = E('circle', { r: 5, fill: col }, g);
    g.text = rich(g, x, y, segs, { size, weight: o.weight || 700, anchor: o.anchor || 'start' });
    g.aim = (tx, ty) => { attr(ln, 'x2', tx); attr(ln, 'y2', ty); attr(dot, 'cx', tx); attr(dot, 'cy', ty); };
    if (o.to) g.aim(o.to[0], o.to[1]);
    return g;
  }
  /* a soft light ray: g.set(x1, y1, x2, y2, p0, p1) shows the part of the segment between fractions p0 and p1 */
  function ray(parent, color, w) {
    const g = G(parent); w = w || 7;
    const ls = [E('line', { stroke: color, 'stroke-width': w * 3, 'stroke-linecap': 'round', opacity: 0.18 }, g), E('line', { stroke: color, 'stroke-width': w, 'stroke-linecap': 'round' }, g)];
    g.set = (x1, y1, x2, y2, p0, p1) => { ls.forEach(l => { attr(l, 'x1', lerp(x1, x2, p0)); attr(l, 'y1', lerp(y1, y2, p0)); attr(l, 'x2', lerp(x1, x2, p1)); attr(l, 'y2', lerp(y1, y2, p1)); }); };
    return g;
  }
  /* a small chloroplast in 2 elements, the same look as lib chloroplast() (which uses 13) */
  function miniChloro(parent, w, h) {
    const g = G(parent);
    E('ellipse', { rx: w / 2, ry: h / 2, fill: ball(C.chloro, C.chloroDk), stroke: C.chloroDk, 'stroke-width': Math.max(2, h * 0.06) }, g);
    const stacks = Math.max(3, Math.round(w / h * 2)), r = h * 0.055; let d = '';
    for (let i = 0; i < stacks; i++) {
      const x = -w * 0.34 + i * (w * 0.68) / (stacks - 1), sy = (i % 2 ? -1 : 1) * h * 0.08;
      for (let k = 0; k < 3; k++) { const y = sy - h * 0.22 + k * h * 0.15 + r; d += `M${(x - w * 0.06 + r).toFixed(1)},${y.toFixed(1)} L${(x + w * 0.06 - r).toFixed(1)},${y.toFixed(1)} `; }
    }
    E('path', { d, fill: 'none', stroke: C.chloroDk, 'stroke-width': +(2 * r).toFixed(2), 'stroke-linecap': 'round', opacity: 0.9 }, g);
    return g;
  }
  /* an eye seen from the front, about 3.9 r wide */
  function eyeFront(parent, r) {
    const g = G(parent);
    E('path', { d: `M${-r * 1.9},0 Q0,${-r * 1.55} ${r * 1.9},0 Q0,${r * 1.55} ${-r * 1.9},0 Z`, fill: '#F4F7F9', stroke: '#C9D6DF', 'stroke-width': 3 }, g);
    E('circle', { r, fill: ball('#B07A45', '#6B4423'), stroke: '#4A2F18', 'stroke-width': 2 }, g);
    g.tint = E('circle', { r: r * 0.98, fill: glow('#4CD964') }, g);
    g.pupil = E('circle', { r: r * 0.42, fill: '#0B0B0D' }, g);
    E('circle', { cx: -r * 0.32, cy: -r * 0.34, r: r * 0.14, fill: '#FFFFFF', opacity: 0.85 }, g);
    E('path', { d: `M${-r * 1.98},${-r * 0.06} Q0,${-r * 1.74} ${r * 1.98},${-r * 0.06}`, fill: 'none', stroke: '#C98E62', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  const SPEC = [['red', '#FF4D4D'], ['orange', '#FF9A3C'], ['yellow', '#FFE45C'], ['green', '#4CD964'], ['blue', '#3B82F6'], ['violet', '#A066FF']];
  const GREEN = '#4CD964';
  const LEAFD = 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z';
  const scaleAt = (el, x, y, s) => el.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-x} ${-y})`);

  /* ================= A. a leaf, then one of its cells ================= */
  const A = G(root);
  const LF = { x: 354, y: 405, s: 2.4 };
  const leafA = G(A); tr(leafA, LF.x, LF.y, LF.s);
  E('path', { d: 'M-54,22 Q-26,14 -2,0', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, leafA);
  leaf(leafA, 1);
  const leafWrap = G(A); leafWrap.appendChild(leafA);
  const Q = [640, 392];
  const ringA = E('circle', { cx: Q[0], cy: Q[1], r: 40, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '10 8' }, A);
  const CELL = [520, 420];
  const cellWrap = G(A), cellG = G(cellWrap);
  E('rect', { x: -300, y: -195, width: 600, height: 390, rx: 44, fill: 'rgba(91,210,122,0.08)', stroke: '#3FA463', 'stroke-width': 14 }, cellG);
  E('rect', { x: -287, y: -182, width: 574, height: 364, rx: 34, fill: 'none', stroke: '#9BEAB2', 'stroke-width': 2.5, opacity: 0.8 }, cellG);
  E('rect', { x: -150, y: -108, width: 330, height: 216, rx: 80, fill: 'rgba(159,216,255,0.12)', stroke: '#9FD8FF', 'stroke-width': 3, opacity: 0.85 }, cellG);
  E('circle', { cx: -218, cy: 18, r: 54, fill: 'rgba(150,120,220,0.35)', stroke: '#B79CF0', 'stroke-width': 3 }, cellG);
  E('circle', { cx: -208, cy: 10, r: 17, fill: '#B79CF0', opacity: 0.6 }, cellG);
  const CP = [[-190, -150, -8], [-88, -146, 6], [12, -151, -4], [112, -147, 8], [215, -142, -14], [-120, 150, 5], [-12, 147, -6], [96, 151, 4], [205, 143, 12], [246, 2, 88]];
  const cps = CP.map(([x, y, r], i) => { const g = G(cellG); miniChloro(g, 72, 38); return { g, x, y, r, i }; });
  const PICK = 3, PK = [CELL[0] + CP[PICK][0], CELL[1] + CP[PICK][1]];
  const labCh = pointer(A, 870, 420, [['chloroplasts', C.chloro]], { size: 40, to: [CELL[0] + CP[9][0], CELL[1] + CP[9][1]] });
  const extraLn = [4, 8].map(k => { const g = G(labCh); E('line', { x1: 860, y1: 407, x2: CELL[0] + CP[k][0], y2: CELL[1] + CP[k][1], stroke: C.muted, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g); E('circle', { cx: CELL[0] + CP[k][0], cy: CELL[1] + CP[k][1], r: 5, fill: C.muted }, g); return g; });
  const labCh2 = rich(A, 870, 462, [['mainly in ', C.muted, 500], ['leaf cells', C.ink, 700]], { size: 28 });

  /* ================= B. inside one chloroplast ================= */
  const B = G(root);
  const BIG = [590, 430];
  const bigG = G(B);
  E('ellipse', { rx: 312, ry: 152, fill: ball(C.chloro, C.chloroDk), stroke: C.chloroDk, 'stroke-width': 6 }, bigG);
  E('ellipse', { rx: 297, ry: 138, fill: 'none', stroke: '#C6F7D3', 'stroke-width': 2.5, opacity: 0.7 }, bigG);
  const GR = [[-216, -20], [-130, 18], [-44, -14], [42, 20], [128, -16], [212, 12]];
  { let d = ''; for (let i = 0; i < GR.length - 1; i++) { const a = GR[i], b = GR[i + 1]; d += `M${a[0] + 30},${a[1] + 20} L${b[0] - 30},${b[1] - 16} M${a[0] + 30},${a[1] - 28} L${b[0] - 30},${b[1] + 28} `; }
    E('path', { d, fill: 'none', stroke: '#1F7A44', 'stroke-width': 4, 'stroke-linecap': 'round' }, bigG); }
  const grana = GR.map(([x, y]) => {
    const g = G(bigG); tr(g, x, y);
    const halo = E('ellipse', { rx: 66, ry: 78, fill: glow(C.energyLt) }, g);
    for (let k = 0; k < 6; k++) E('rect', { x: -32, y: -44 + k * 15, width: 64, height: 12, rx: 6, fill: '#1F7A44', stroke: '#A8F0BC', 'stroke-width': 1.5 }, g);
    const lit = E('rect', { x: -34, y: -46, width: 68, height: 91, rx: 10, fill: '#EFFFD9' }, g);
    return { halo, lit, x, y };
  });
  const bRays = GR.map(([x, y], i) => ({ r: ray(B, C.energy, 5), sp: spark(B, 11, { seed: i + 1 }), x: BIG[0] + x, y: BIG[1] + y - 46 }));
  const oneLab = T(B, 300, 246, 'one chloroplast', { size: 28, weight: 600, fill: C.muted });
  const bLab = pointer(B, 590, 664, [['chlorophyll', GREEN, 800], [', in stacks of tiny discs', C.ink, 700]], { size: 34, anchor: 'middle', from: [600, 630], to: [BIG[0] + GR[3][0], BIG[1] + GR[3][1] + 48] });

  /* ================= C. white light: red and blue absorbed, green reflected ================= */
  const Cg = G(root);
  const SUNP = [150, 205], SP = [330, 318];
  const sunC = sun(Cg, 46); tr(sunC, SUNP[0], SUNP[1]);
  const white = ray(Cg, '#FFFFFF', 11);
  const LFC = { x: 352, y: 548, s: 2.35 };
  const leafC = G(Cg); tr(leafC, LFC.x, LFC.y, LFC.s);
  const leafGlow = E('ellipse', { cx: 102, cy: 0, rx: 150, ry: 90, fill: glow(GREEN) }, leafC);
  E('path', { d: 'M-54,22 Q-26,14 -2,0', fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, leafC);
  leaf(leafC, 1);
  const dull = E('path', { d: LEAFD, fill: '#0A1B27', opacity: 0.4 }, leafC);
  const bright = E('path', { d: LEAFD, fill: '#C6FFD2', opacity: 0 }, leafC);
  const fan = SPEC.map(([nm, col], i) => {
    const L = [470 + i * 62, 532 - (i % 2) * 6];
    const absorbed = nm !== 'green', big = nm === 'red' || nm === 'blue';
    const sp = absorbed && nm !== 'yellow' ? spark(Cg, big ? 15 : 9, { seed: i + 3, color: big ? C.energy : C.energyLt }) : null;
    return { nm, col, L, r: ray(Cg, col, big || nm === 'green' ? 6.5 : 4.5), sp, absorbed, big };
  });
  const whiteLab = rich(Cg, 112, 332, [['white light', '#F2F7FA', 700]], { size: 27 });
  const headC = rich(Cg, 720, 168, [['chlorophyll ', GREEN, 700], ['absorbs light energy', C.ink, 700]], { size: 36, anchor: 'middle' });
  const rbLab = rich(Cg, 593, 716, [['red', '#FF6B6B', 800], [' and ', C.ink, 600], ['blue', '#6FA6FF', 800], [': absorbed strongly', C.ink, 600]], { size: 32, anchor: 'middle' });
  const EYE = [1010, 300];
  const eye = eyeFront(Cg, 46); tr(eye, EYE[0], EYE[1]);
  const GL = fan[3].L, GE = [950, 311];
  const bounce = ray(Cg, GREEN, 7);
  const bHead = E('path', { d: 'M0,0 L-22,-13 L-16,0 L-22,13 Z', fill: GREEN, transform: `translate(${GE[0]} ${GE[1]}) rotate(${(Math.atan2(GE[1] - GL[1], GE[0] - GL[0]) * 180 / Math.PI).toFixed(1)})` }, Cg);
  const pulse = E('circle', { r: 22, fill: glow('#C9FFD5') }, Cg);
  const gLab = rich(Cg, 1010, 414, [['green', GREEN, 800], [' is reflected', C.ink, 700]], { size: 32, anchor: 'middle' });
  const gLab2 = T(Cg, 1010, 454, 'so the leaf looks green', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= D. the trap ================= */
  const Dg = G(root);
  card(Dg, 140, 128, 920, 292, { fill: C.card, stroke: C.line });
  const trapHead = G(Dg);
  E('path', { d: 'M0,-30 L32,26 L-32,26 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(200 184)' }, trapHead);
  T(trapHead, 200, 206, '!', { size: 38, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(trapHead, 250, 200, 'Exam trap', { size: 38, weight: 700 });
  const wrongG = G(Dg);
  const wX = cross(wrongG, 15); tr(wX, 214, 268);
  rich(wrongG, 254, 280, [['chlorophyll absorbs green light', C.muted, 600]], { size: 36 });
  const wStrike = strike(wrongG, 248, 268, 262 + textWidth('chlorophyll absorbs green light', 36, FD, 600), C.bad);
  const rightG = G(Dg);
  const rTick = tick(rightG, 16); tr(rTick, 214, 352);
  rich(rightG, 254, 366, [['chlorophyll ', C.ink, 700], ['reflects', GREEN, 800], [' green light', C.ink, 700]], { size: 40 });
  const barsG = G(Dg);
  T(barsG, 600, 470, 'how much of each colour chlorophyll absorbs', { size: 27, weight: 600, anchor: 'middle', fill: C.muted });
  const BY = 664, BW = 64, BH = 140, ABS = [0.9, 0.55, 0.28, 0.12, 1.0, 0.82];
  E('line', { x1: 270, y1: BY, x2: 930, y2: BY, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, barsG);
  const bars = SPEC.map(([nm, col], i) => ({ el: E('rect', { x: 315 + i * 114 - BW / 2, y: BY, width: BW, height: 0, rx: 8, fill: col }, barsG), v: ABS[i] }));
  const leastG = G(barsG);
  rich(leastG, 657, 566, [['uses least', GREEN, 800]], { size: 28, anchor: 'middle' });
  const leastArr = arrow(leastG, 657, 578, 657, 636, { color: GREEN, width: 4 });

  /* ================= E. two words ================= */
  const Eg = G(root);
  const wL = rich(Eg, 310, 214, [['chloro', C.chloro, 700], ['phyll', C.energy, 700]], { size: 60, anchor: 'middle' });
  const wR = rich(Eg, 890, 214, [['chloro', C.chloro, 700], ['plast', C.energy, 700]], { size: 60, anchor: 'middle' });
  const neq = T(Eg, 600, 220, '≠', { size: 76, weight: 700, anchor: 'middle', fill: C.muted });
  const flG = G(Eg);
  const fl = flask(flG, 1.25, { level: 0.62, liquid: '#2FB35A' });
  const chG = G(Eg);
  chloroplast(chG, 330, 170);
  const lpL = G(Eg);
  rich(lpL, 310, 604, [['the green ', C.ink, 600], ['pigment', C.energy, 800]], { size: 38, anchor: 'middle' });
  T(lpL, 310, 646, 'the coloured chemical', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const lpR = G(Eg);
  rich(lpR, 890, 604, [['the ', C.ink, 600], ['structure', C.energy, 800]], { size: 38, anchor: 'middle' });
  T(lpR, 890, 646, 'that contains it', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const inside = pointer(Eg, 890, 304, [['chlorophyll in here', GREEN, 700]], { size: 28, anchor: 'middle', from: [904, 316], to: [927, 400] });

  /* ================= F. palisade cells, near the top ================= */
  const Fg = G(root);
  const SECF = [470, 458];
  const secG = G(Fg); tr(secG, SECF[0], SECF[1]);
  const sec = leafSection(secG, { open: 0.5 });
  const fxF = G(secG);
  const palGlow = sec.pal.map(c => E('rect', { x: c.x, y: c.top, width: c.w, height: c.bot - c.top, rx: 15, fill: '#D6FFE0' }, fxF));
  const fRays = [-260, -135, -10, 115, 240].map((x, i) => { const c = sec.pal[Math.round((x + 350) / 43.75)]; return { x: c.cx, r: ray(fxF, C.energy, 6), sp: spark(fxF, 12, { seed: i + 4 }) }; });
  const lightLab = rich(Fg, 126, 214, [['light', C.energy, 700]], { size: 30 });
  const subP1 = rich(Fg, 850, 300, [['near the ', C.muted, 500], ['top', C.energy, 700], [' of the leaf', C.muted, 500]], { size: 27 });
  const labP = pointer(Fg, 850, 352, [['palisade cells', C.ink]], { size: 38, to: [SECF[0] + sec.pal[15].cx, SECF[1] - 96] });
  const subP2 = rich(Fg, 850, 394, [['full of ', C.muted, 500], ['chloroplasts', C.chloro, 700]], { size: 27 });

  /* ================= update ================= */
  return t => {
    const tt = S.reduce ? 0 : t;
    const tWh = at('where'), tPk = at('packed'), tAb = at('absorb'), tRe = at('reflect'), tTr = at('trap'), tWo = at('words'), tPa = at('palisade');

    /* ---------- A: leaf -> cell ---------- */
    const aA = 1 - P(t, tPk + 0.25, 0.4, linear);
    op(A, aA);
    if (aA > 0) {
      // dive into the leaf
      const z1 = P(t, mid('where', 0.14), 1.2, easeIn);
      scaleAt(leafWrap, Q[0], Q[1], 1 + 8 * z1);
      op(leafWrap, 1 - P(t, mid('where', 0.14) + 0.55, 0.5, linear));
      const rp = P(t, mid('where', 0.03), 0.5, pop);
      op(ringA, clamp(rp * 2) * (1 - P(t, mid('where', 0.14) + 0.2, 0.3, linear)));
      scaleAt(ringA, Q[0], Q[1], Math.max(0.01, (0.6 + 0.4 * rp) * (1 + 3 * z1)));
      // the cell grows out of that spot, then the camera dives again, into one chloroplast
      const c1 = P(t, mid('where', 0.14) + 0.45, 1.0, easeOut), dv = P(t, tPk - 0.3, 1.15, ease);
      const cx = lerp(Q[0], CELL[0], c1), cy = lerp(Q[1], CELL[1], c1), cs = lerp(0.06, 1, c1);
      cellG.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${cs.toFixed(4)})`);
      scaleAt(cellWrap, PK[0], PK[1], 1 + (624 / 72 - 1) * dv);
      op(cellWrap, P(t, mid('where', 0.14) + 0.45, 0.4, linear) * (1 - P(dv, 0.3, 0.4, linear)));
      cps.forEach(o => {
        const p = P(t, mid('where', 0.36 + o.i * 0.025), 0.45, pop);
        tr(o.g, o.x, o.y + (S.reduce ? 0 : 3 * Math.sin(t * 1.1 + o.i)), Math.max(0.01, p), o.r);
        op(o.g, clamp(p * 2));
      });
      op(labCh, win(t, mid('where', 0.6), tPk - 0.15, 0.35));
      op(labCh2, win(t, mid('where', 0.8), tPk - 0.15, 0.35));
    }

    /* ---------- B: one chloroplast ---------- */
    const aB = (t > tPk - 0.3 ? 1 : 0) * (1 - P(t, tAb - 0.2, 0.35, linear));
    op(B, aB);
    if (aB > 0) {
      // it is the chosen chloroplast, grown: same size and place as it swells, then it settles at BIG
      const dv = P(t, tPk - 0.3, 1.15, ease), back = P(t, tAb - 0.5, 0.65, ease);
      const bx = lerp(lerp(PK[0], BIG[0], dv), 600, back), by = lerp(lerp(PK[1], BIG[1], dv), 520, back);
      const bs = lerp(72 / 624 * (1 + (624 / 72 - 1) * dv), 0.08, back), br = lerp(CP[PICK][2], 0, dv);
      tr(bigG, bx, by, bs, br);
      op(bigG, P(dv, 0.22, 0.35, linear));
      grana.forEach((o, i) => {
        const w0 = mid('packed', 0.42 + i * 0.055), glowNow = win(t, w0, w0 + 0.7, 0.3), lit = P(t, mid('packed', 0.76 + i * 0.03), 0.5, linear);
        op(o.halo, Math.max(glowNow, 0.55 * lit)); op(o.lit, 0.32 * Math.max(glowNow, 0.6 * lit));
      });
      const fo = 1 - P(t, tAb - 0.62, 0.25, linear);     // labels and rays go first, then it shrinks away
      bRays.forEach((o, i) => {
        const t0 = mid('packed', 0.72 + i * 0.03), u = clamp((t - t0) / 0.6), a = (t > t0 ? 1 : 0) * fo;
        op(o.r, a); op(o.sp, a * P(u, 0.8, 0.2, linear));
        if (a > 0) { o.r.set(o.x + 150, o.y - 190, o.x, o.y, 0, ease(u)); tr(o.sp, o.x, o.y, 0.9 + 0.2 * wave(tt, 0.8, i * 0.2)); o.sp.upd(tt + i); }
      });
      op(oneLab, P(t, tPk + 0.7, 0.4, linear) * fo);
      op(bLab, P(t, mid('packed', 0.28), 0.45, linear) * fo);
    }

    /* ---------- C: the colours of light ---------- */
    const aC = P(t, tAb - 0.35, 0.5, linear) * (1 - P(t, tTr - 0.15, 0.45, linear));
    op(Cg, aC);
    if (aC > 0) {
      sunC.upd(tt);
      const zi = P(t, tAb - 0.35, 0.8, easeOut);
      tr(leafC, LFC.x, LFC.y, LFC.s * lerp(1.12, 1, zi));
      const wp = P(t, mid('absorb', 0.03), 0.45, linear);
      op(white, wp > 0 ? 1 : 0); white.set(SUNP[0] + 38, SUNP[1] + 24, SP[0], SP[1], 0, wp);
      fan.forEach((o, i) => {
        const fp = P(t, mid('absorb', 0.1) + i * 0.06, 0.55, linear);
        op(o.r, fp > 0 ? 1 : 0);
        o.r.set(SP[0], SP[1], o.L[0], o.L[1], 0, fp);
        if (o.absorbed) {
          const tS = mid('absorb', { red: 0.58, orange: 0.64, yellow: 0.68, blue: 0.72, violet: 0.78 }[o.nm]);
          const k = P(t, tS, 0.5, linear);
          op(o.r, (fp > 0 ? 1 : 0) * (1 - (o.big ? 0.62 : 0.72) * k));
          if (o.sp) {
            const u = clamp((t - tS) / 1.3);
            op(o.sp, u > 0 ? Math.sin(Math.PI * Math.min(1, u * 1.4)) : 0);
            tr(o.sp, o.L[0], o.L[1] + 26 * easeOut(u), 0.6 + 0.7 * Math.sin(Math.PI * Math.min(1, u * 1.2)));
            o.sp.upd(tt + i);
          }
        }
      });
      op(headC, P(t, mid('absorb', 0.14), 0.5, linear));
      op(whiteLab, P(t, mid('absorb', 0.06), 0.4, linear) * (1 - P(t, tRe, 0.5, linear)));
      op(rbLab, P(t, mid('absorb', 0.62), 0.5, linear));
      // reflect: green bounces off the leaf into the eye
      const bp = P(t, mid('reflect', 0.06), 2.1, ease);
      op(bounce, bp > 0 ? 1 : 0); bounce.set(GL[0], GL[1], GE[0], GE[1], 0, bp);
      op(bHead, P(bp, 0.9, 0.1, linear));
      const pu = clamp((t - mid('reflect', 0.06)) / 2.1);
      op(pulse, pu > 0 && pu < 1 ? Math.sin(Math.PI * pu) : 0);
      tr(pulse, lerp(GL[0], GE[0], ease(pu)), lerp(GL[1], GE[1], ease(pu)));
      const seen = P(t, mid('reflect', 0.5), 0.7, linear);
      op(eye.tint, seen * (0.55 + 0.25 * wave(tt, 1.4)));
      attr(eye.pupil, 'r', (46 * lerp(0.42, 0.34, seen)).toFixed(2));
      const lg = P(t, mid('reflect', 0.62), 1.0, ease);
      attr(dull, 'opacity', (0.4 * (1 - lg)).toFixed(3)); attr(bright, 'opacity', (0.16 * lg).toFixed(3));
      op(leafGlow, lg * (0.7 + 0.3 * wave(tt, 2.2)));
      op(gLab, P(t, mid('reflect', 0.14), 0.45, linear));
      op(gLab2, P(t, mid('reflect', 0.74), 0.45, linear));
      op(eye, P(t, tRe - 0.25, 0.5, linear));
    }

    /* ---------- D: the trap ---------- */
    const aD = P(t, tTr - 0.1, 0.45, linear) * (1 - P(t, tWo - 0.2, 0.4, linear));
    op(Dg, aD);
    if (aD > 0) {
      const hp = P(t, tTr, 0.5, pop); op(trapHead, clamp(hp * 2));
      op(wrongG, P(t, mid('trap', 0.08), 0.4, linear));
      wStrike.set(P(t, mid('trap', 0.38), 0.5, ease));
      const xp = P(t, mid('trap', 0.45), 0.4, pop); op(wX, clamp(xp * 2)); tr(wX, 214, 268, Math.max(0.01, xp));
      const rp = P(t, mid('trap', 0.55), 0.45, linear); op(rightG, rp); tr(rightG, (1 - rp) * 24, 0);
      const tp = P(t, mid('trap', 0.6), 0.4, pop); op(rTick, clamp(tp * 2)); tr(rTick, 214, 352, Math.max(0.01, tp));
      op(barsG, P(t, mid('trap', 0.66), 0.4, linear));
      bars.forEach((b, i) => { const h = BH * b.v * P(t, mid('trap', 0.68) + i * 0.07, 0.6, easeOut); attr(b.el, 'y', BY - h); attr(b.el, 'height', h); });
      op(leastG, P(t, mid('trap', 0.82), 0.4, linear)); leastArr.set(P(t, mid('trap', 0.84), 0.5));
    }

    /* ---------- E: two words ---------- */
    const aE = P(t, tWo - 0.1, 0.45, linear) * (1 - P(t, tPa - 0.35, 0.4, linear));
    op(Eg, aE);
    if (aE > 0) {
      const p1 = P(t, tWo, 0.5, pop), p2 = P(t, mid('words', 0.08), 0.5, pop);
      op(wL, clamp(p1 * 2)); op(wR, clamp(p2 * 2)); op(neq, P(t, mid('words', 0.14), 0.4, linear));
      const pf = P(t, mid('words', 0.25), 0.55, pop); op(flG, clamp(pf * 2)); tr(flG, 310, 420 + (1 - clamp(pf)) * 30);
      op(lpL, P(t, mid('words', 0.34), 0.45, linear));
      const pc = P(t, mid('words', 0.57), 0.55, pop); op(chG, clamp(pc * 2)); tr(chG, 890, 420 + (S.reduce ? 0 : 4 * Math.sin(t * 1.2)), Math.max(0.01, 0.6 + 0.4 * pc));
      op(lpR, P(t, mid('words', 0.66), 0.45, linear));
      op(inside, P(t, mid('words', 0.84), 0.45, linear));
    }

    /* ---------- F: palisade cells under the light ---------- */
    const aF = P(t, tPa - 0.3, 0.5, linear);
    op(Fg, aF);
    if (aF > 0) {
      const low = 1 - 0.72 * P(t, mid('palisade', 0.3), 0.8, linear);
      [sec.L.spo, sec.L.air, sec.L.vein, sec.L.low, sec.L.gua].forEach(l => op(l, low));
      fRays.forEach((o, i) => {
        const t0 = tPa + i * 0.22, u = clamp((t - t0) / 0.8);
        op(o.r, t > t0 ? 1 : 0); op(o.sp, P(u, 0.85, 0.15, linear));
        if (t > t0) { o.r.set(o.x + 14, -330, o.x, -92, 0, ease(u)); tr(o.sp, o.x, -92, 0.9 + 0.2 * wave(tt, 0.8, i * 0.2)); o.sp.upd(tt + i); }
      });
      op(lightLab, P(t, tPa + 0.3, 0.4, linear));
      const tw = P(t, mid('palisade', 0.66), 0.6, linear);
      palGlow.forEach((e, i) => op(e, tw * (0.1 + 0.22 * wave(tt * 0.9 - i * 0.09, 1.8))));
      op(labP, P(t, mid('palisade', 0.62), 0.45, linear));
      op(subP1, P(t, mid('palisade', 0.34), 0.45, linear));
      op(subP2, P(t, mid('palisade', 0.8), 0.45, linear));
    }
  };
});

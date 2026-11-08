/* Chapter 7, Circuit symbols and diagrams.
   A real circuit, and a globe: symbols are a universal language -> a gallery of big symbols: cell, battery,
   lamp and buzzer, switch, the meters and the motor, resistor and variable resistor, a fuse that melts,
   a diode in a loop, the LED -> neat diagrams: wobbly lines straighten, a solid dot marks a junction
   -> the real circuit morphs, piece by piece, into its diagram and lights up (showpiece).

   The six extra symbols for this lesson are drawn here in kit style (stroke WIRE, width 5, leads out to
   x = ±54 like resistorSym, centred on the origin): varResistorSym, fuseSym, diodeSym, ledSym, buzzerSym
   and junctionDot. Other chapters copy them from this file unchanged. */
scene('symbols', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;

  /* ================= the six extra circuit symbols ================= */
  const SYM = { fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const sym = (o, extra) => Object.assign({}, SYM, o, extra || {});
  function leadsTo(g, a, b) { E('path', sym({ d: `M-54,0 L${-a},0 M${b === undefined ? a : b},0 L54,0` }), g); }
  /* variable resistor: the resistor box with an arrow through it, from lower left to upper right */
  function varResistorSym(parent) {
    const g = resistorSym(parent);
    g.arrow = G(g);
    E('line', sym({ x1: -36, y1: 27, x2: 25, y2: -19 }, { 'stroke-width': 4 }), g.arrow);
    E('path', { d: 'M38,-28.5 L30,-12.5 L20.4,-25.3 Z', fill: WIRE, stroke: WIRE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g.arrow);
    return g;
  }
  /* fuse: the resistor box with the wire running straight through its middle. g.set(heat 0..1, melt 0..1) */
  function fuseSym(parent) {
    const g = G(parent);
    leadsTo(g, 30);
    const halo = E('circle', { r: 58, fill: glow(C.heat) }, g);
    E('rect', { x: -30, y: -13, width: 60, height: 26, rx: 3, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g);
    const mk = (x1, x2, col) => E('line', { x1, x2, y1: 0, y2: 0, stroke: col, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const wl = mk(-30, 0, WIRE), wr = mk(0, 30, WIRE), hl = mk(-30, 0, C.heat), hr = mk(0, 30, C.heat);
    g.set = (heat, melt) => {
      heat = clamp(heat); const gap = 13 * clamp(melt);
      attr(wl, 'x2', -gap); attr(hl, 'x2', -gap); attr(wr, 'x1', gap); attr(hr, 'x1', gap);
      op(hl, heat); op(hr, heat); op(halo, 0.85 * heat);
    };
    g.set(0, 0);
    return g;
  }
  /* diode: a filled triangle pointing along the wire at a bar; current can flow only the way it points */
  function diodeSym(parent) {
    const g = G(parent);
    leadsTo(g, 16);
    E('path', { d: 'M-16,-18 L16,0 L-16,18 Z', fill: WIRE, stroke: WIRE, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('line', sym({ x1: 16, y1: -19, x2: 16, y2: 19 }), g);
    return g;
  }
  /* LED: the diode inside a circle, with two small arrows pointing up and outwards. g.set(glow 0..1); g.ring, g.arrows */
  function ledSym(parent) {
    const g = G(parent);
    g.halo = E('circle', { r: 80, fill: glow(C.energy) }, g);
    leadsTo(g, 30);
    g.ring = E('circle', { r: 30, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g);
    E('path', sym({ d: 'M-30,0 L-12,0 M12,0 L30,0' }), g);
    E('path', { d: 'M-12,-14 L12,0 L-12,14 Z', fill: WIRE, stroke: WIRE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('line', sym({ x1: 12, y1: -15, x2: 12, y2: 15 }, { 'stroke-width': 4.5 }), g);
    g.arrows = G(g);
    [[8, -36], [24, -28]].forEach(([x, y]) => {
      const a = G(g.arrows);
      E('line', sym({ x1: x, y1: y, x2: x + 11, y2: y - 16 }, { 'stroke-width': 3.5 }), a);
      E('path', { d: `M${x + 17},${y - 25} L${x + 15.5},${y - 13.9} L${x + 7.3},${y - 19.5} Z`, fill: WIRE, stroke: WIRE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, a);
    });
    g.set = v => op(g.halo, clamp(v));
    g.set(0);
    return g;
  }
  /* buzzer: a dome (a semicircle, flat side down) sitting on the wire; its two leads leave the flat base */
  function buzzerSym(parent) {
    const g = G(parent);
    E('path', sym({ d: 'M-54,0 L-12,0 L-12,-12 M54,0 L12,0 L12,-12' }), g);
    E('path', { d: 'M-28,-12 A28,28 0 0 1 28,-12 Z', fill: C.bg0, stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* junction: a solid dot where three wires meet */
  function junctionDot(parent, x, y) { return E('circle', { cx: x || 0, cy: y || 0, r: 7, fill: C.ink }, parent); }

  /* ================= local helpers ================= */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const TITLE = { size: 56, weight: 700, anchor: 'middle' };
  const NAME = { size: 38, weight: 700, anchor: 'middle' };
  /* distance flowed by time t when the speed is piecewise linear in time: keys [[t, v], ...] */
  function flow(t, keys) {
    let d = 0;
    for (let i = 0; i < keys.length; i++) {
      const [t0, v0] = keys[i], nx = keys[i + 1];
      if (t <= t0) break;
      const t1 = nx ? Math.min(t, nx[0]) : t;
      const v1 = nx && nx[0] > t0 ? lerp(v0, nx[1], (t1 - t0) / (nx[0] - t0)) : v0;
      d += (v0 + v1) / 2 * (t1 - t0);
    }
    return d;
  }
  const polyLen = p => { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; };
  function resample(p, n) {
    const cum = [0]; for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
    const tot = cum[cum.length - 1], out = []; let j = 1;
    for (let k = 0; k < n; k++) {
      const s = tot * k / (n - 1);
      while (j < p.length - 1 && cum[j] < s) j++;
      const f = (s - cum[j - 1]) / ((cum[j] - cum[j - 1]) || 1);
      out.push([lerp(p[j - 1][0], p[j][0], f), lerp(p[j - 1][1], p[j][1], f)]);
    }
    return out;
  }
  function spline(c, per) {
    const out = [];
    for (let i = 0; i < c.length - 1; i++) {
      const p0 = c[Math.max(0, i - 1)], p1 = c[i], p2 = c[i + 1], p3 = c[Math.min(c.length - 1, i + 2)];
      for (let k = 0; k < per; k++) {
        const u = k / per, u2 = u * u, u3 = u2 * u;
        out.push([0, 1].map(j => 0.5 * (2 * p1[j] + (p2[j] - p0[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (3 * p1[j] - p0[j] - 3 * p2[j] + p3[j]) * u3)));
      }
    }
    out.push(c[c.length - 1]);
    return out;
  }
  const toD = pts => 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L');
  /* a big kit cell or battery (n cells) at scale s, with its + and − signs drawn at a readable size */
  function bigCells(parent, n, s) {
    const g = G(parent);
    tr(cellSym(g, { cells: n, signs: false }), 0, 0, s);
    const wTot = (n - 1) * 34 + 16;
    g.plus = T(g, (-wTot / 2 - 4) * s, -36 * s, '+', { size: 54, weight: 700, anchor: 'middle', fill: C.bad });
    g.minus = T(g, (wTot / 2 + 4) * s, -36 * s, '−', { size: 54, weight: 700, anchor: 'middle', fill: C.water });
    return g;
  }

  /* ---------- real components, in diagram coordinates: each terminal sits where its diagram wire ends ---------- */
  function realHolder(parent) {                     // AA cell in a holder; terminals at (±110, 0); + on the left
    const g = G(parent);
    E('rect', { x: -110, y: -34, width: 220, height: 68, rx: 14, fill: '#262C33', stroke: '#5C6874', 'stroke-width': 3 }, g);
    E('rect', { x: -98, y: -25, width: 196, height: 50, rx: 8, fill: '#161B20' }, g);
    E('path', { d: 'M95,-15 L85,-10 L95,-5 L85,0 L95,5 L85,10 L95,15', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -98, y: -12, width: 5, height: 24, rx: 2, fill: '#C9D3DC' }, g);
    E('rect', { x: -86, y: -21, width: 170, height: 42, rx: 8, fill: linGrad('#525B66', '#1C2126', true) }, g);
    E('path', { d: 'M-78,-21 L-38,-21 L-38,21 L-78,21 Q-86,21 -86,13 L-86,-13 Q-86,-21 -78,-21 Z', fill: linGrad('#F5B983', '#A4521F', true) }, g);
    E('rect', { x: -94, y: -8, width: 10, height: 16, rx: 3, fill: '#E7A86A' }, g);
    T(g, -62, 11, '+', { size: 32, weight: 700, anchor: 'middle', fill: '#3A1E08' });
    E('rect', { x: -32, y: -15, width: 110, height: 5, rx: 2.5, fill: '#FFFFFF', opacity: 0.16 }, g);
    E('rect', { x: -118, y: -6, width: 12, height: 12, rx: 3, fill: '#C9D3DC' }, g);
    E('rect', { x: 106, y: -6, width: 12, height: 12, rx: 3, fill: '#C9D3DC' }, g);
    return g;
  }
  function realToggle(parent) {                     // toggle switch, upright; screw terminals at (0, ±48); g.set(on 0..1)
    const g = G(parent);
    E('rect', { x: -32, y: -60, width: 64, height: 120, rx: 14, fill: '#34404B', stroke: '#7F93A3', 'stroke-width': 3 }, g);
    [-48, 48].forEach(y => { E('circle', { cx: 0, cy: y, r: 9, fill: ball('#E3E8EC', '#8E9BA7') }, g); E('line', { x1: -5, y1: y - 5, x2: 5, y2: y + 5, stroke: '#5C6874', 'stroke-width': 2.5 }, g); });
    E('circle', { r: 15, fill: ball('#C9D3DC', '#6F7E8B'), stroke: '#E3E8EC', 'stroke-width': 2 }, g);
    const lever = G(g);
    E('line', { x1: 0, y1: 0, x2: 0, y2: -40, stroke: '#D7DEE4', 'stroke-width': 10, 'stroke-linecap': 'round' }, lever);
    E('circle', { cx: 0, cy: -42, r: 8.5, fill: ball('#F4F7FA', '#9AA6B0') }, lever);
    g.set = on => lever.setAttribute('transform', `rotate(${lerp(-125, -55, clamp(on)).toFixed(1)})`);
    g.set(1);
    return g;
  }
  function realBulb(parent) {                       // torch bulb in a holder; terminals at (±50, 0); g.set(glow 0..1)
    const g = G(parent);
    const halo = E('circle', { cx: 0, cy: -64, r: 118, fill: glow('#FFE45C') }, g);
    E('rect', { x: -56, y: -12, width: 112, height: 28, rx: 10, fill: '#E9E3D6', stroke: '#B9B0A0', 'stroke-width': 2.5 }, g);
    [-44, 44].forEach(x => E('circle', { cx: x, cy: 2, r: 8, fill: ball('#E3E8EC', '#8E9BA7') }, g));
    E('rect', { x: -15, y: -34, width: 30, height: 24, rx: 3, fill: linGrad('#E3E8EC', '#8E9BA7') }, g);
    for (let k = 0; k < 3; k++) E('line', { x1: -15, x2: 15, y1: -30 + k * 7, y2: -27 + k * 7, stroke: '#6F7E8B', 'stroke-width': 2 }, g);
    const env = E('path', { d: 'M-12,-34 C-30,-44 -34,-74 -22,-88 C-12,-100 12,-100 22,-88 C34,-74 30,-44 12,-34 Z', fill: 'rgba(220,240,255,0.16)', stroke: '#CFE7F5', 'stroke-width': 3 }, g);
    E('path', { d: 'M-6,-36 L-9,-62 M6,-36 L9,-62', stroke: '#9AA6B0', 'stroke-width': 2 }, g);
    const fil = E('path', { d: 'M-9,-62 l3,-7 l3,7 l3,-7 l3,7 l3,-7', fill: 'none', stroke: '#8E7A55', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    g.set = v => { v = clamp(v); op(halo, 0.8 * v); fil.setAttribute('stroke', v > 0.05 ? '#FFF3A0' : '#8E7A55'); env.setAttribute('fill', v > 0.05 ? 'rgba(255,240,170,0.28)' : 'rgba(220,240,255,0.16)'); };
    g.set(0);
    return g;
  }
  /* a loose, curly insulated wire between fixed ends that straightens into a diagram wire. g.set(straight 0..1, white 0..1) */
  function curlyWire(parent, route, loose) {
    const n = Math.max(60, Math.round(polyLen(route) / 2.6));
    const S0 = resample(route, n), L0 = resample(spline(loose, 16), n), len = polyLen(L0);
    const OFF = L0.map((q, k) => {
      const a = L0[Math.max(0, k - 1)], b = L0[Math.min(n - 1, k + 1)];
      const tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1, ux = tx / tl, uy = ty / tl;
      const s = len * k / (n - 1), ph = TAU * s / 40, taper = Math.min(1, s / 24, (len - s) / 24);
      const w = 8 * Math.sin(ph) * taper, back = 7 * (Math.cos(ph) - 1) * taper;
      return [q[0] - S0[k][0] - uy * w + ux * back, q[1] - S0[k][1] + ux * w + uy * back];
    });
    const g = G(parent);
    const pOut = E('path', { fill: 'none', stroke: '#17603F', 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const pIn = E('path', { fill: 'none', stroke: C.good, 'stroke-width': 6.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const pW = E('path', { fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    g.set = (straight, white) => {
      const k = 1 - clamp(straight);
      const d = toD(S0.map((q, i) => [q[0] + OFF[i][0] * k, q[1] + OFF[i][1] * k]));
      pOut.setAttribute('d', d); pIn.setAttribute('d', d); pW.setAttribute('d', d);
      op(pOut, 1 - white); op(pIn, 1 - white); op(pW, white);
    };
    g.set(0, 0);
    return g;
  }

  /* ================= A. the real circuit (why, and the build at the end) ================= */
  const realG = G(root);
  const kitW = G(realG);
  const KW = [
    wire(kitW, [[558, 520], [330, 520], [330, 425]]),
    wire(kitW, [[330, 325], [330, 230], [554, 230]]),
    wire(kitW, [[646, 230], [870, 230], [870, 520], [642, 520]]),
  ];
  const ext = G(realG);
  [[490, 520, 558, 520], [642, 520, 710, 520], [550, 230, 554, 230], [646, 230, 650, 230], [330, 423, 330, 425], [330, 325, 330, 327]].forEach(([x1, y1, x2, y2]) => E('line', sym({ x1, y1, x2, y2 }), ext));
  const rHolder = realHolder(realG); tr(rHolder, 600, 520);
  const rToggle = realToggle(realG); tr(rToggle, 330, 375);
  const rBulb = realBulb(realG); tr(rBulb, 600, 230);
  const CW = [
    curlyWire(realG, [[490, 520], [330, 520], [330, 423]], [[490, 520], [452, 562], [390, 578], [334, 558], [304, 502], [310, 452], [330, 423]]),
    curlyWire(realG, [[330, 327], [330, 230], [550, 230]], [[330, 327], [302, 282], [316, 232], [370, 200], [440, 192], [508, 206], [550, 230]]),
    curlyWire(realG, [[650, 230], [870, 230], [870, 520], [710, 520]], [[650, 230], [708, 202], [792, 194], [874, 236], [904, 330], [892, 432], [848, 522], [782, 568], [722, 550], [710, 520]]),
  ];
  const dCell = cellSym(realG); tr(dCell, 600, 520);
  const dSw = switchSym(realG); tr(dSw, 330, 375, 1, -90);
  const dBulb = bulbSym(realG); tr(dBulb, 600, 230);
  const realLbl = T(root, 330, 612, 'a real circuit', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  // the build's labels and its complete loop
  const bdG = G(root);
  const bdTrace = E('path', { d: 'M600,520 L330,520 L330,230 L870,230 L870,520 Z', fill: 'none', stroke: C.energyLt, 'stroke-width': 12, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.12 0.88' }, bdG);
  const bdGlow = E('path', { d: 'M600,520 L330,520 L330,230 L870,230 L870,520 Z', fill: 'none', stroke: C.energy, 'stroke-width': 22, 'stroke-linejoin': 'round', opacity: 0.22 }, bdG);
  bdG.insertBefore(bdGlow, bdTrace);
  root.insertBefore(bdG, realG);
  const bdLbl = [T(root, 600, 604, 'cell', { size: 32, weight: 600, anchor: 'middle' }), T(root, 284, 386, 'switch', { size: 32, weight: 600, anchor: 'end' }), T(root, 600, 168, 'lamp', { size: 32, weight: 600, anchor: 'middle' })];
  const bdChip = chip(root, 'one complete loop', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(bdChip, 600, 380);

  /* the globe: a universal language */
  const globeG = G(root);
  const GLX = 880, GLY = 390, GLR = 106;
  E('circle', { cx: GLX, cy: GLY, r: GLR * 1.55, fill: glow('#2E86C1'), opacity: 0.7 }, globeG);
  const gl = G(globeG); tr(gl, GLX, GLY);
  E('circle', { r: GLR, fill: ball('#55C2F0', '#1A5A86'), stroke: '#A9DDF7', 'stroke-width': 3 }, gl);
  const clipG = E('clipPath', { id: 'me7globe' }, defs()); E('circle', { r: GLR - 2 }, clipG);
  const land = G(gl, { 'clip-path': 'url(#me7globe)' });
  const landStrip = G(land);
  const BLOBS = [[-72, -40, 36, 28, 3], [16, -58, 30, 20, 5], [-22, 28, 44, 32, 8], [70, 34, 26, 32, 11], [-104, 60, 26, 22, 13]];
  [0, 2 * GLR].forEach(dx => BLOBS.forEach(([x, y, rx, ry, seed]) => E('path', { d: closedPath(blobPts(rx, ry, 9, 0, 0.22, seed)), fill: C.plant, opacity: 0.92, transform: `translate(${x + dx} ${y})` }, landStrip)));
  E('ellipse', { rx: GLR, ry: GLR * 0.3, fill: 'none', stroke: '#D6F1FF', 'stroke-width': 2, opacity: 0.35 }, gl);
  E('ellipse', { rx: GLR * 0.45, ry: GLR, fill: 'none', stroke: '#D6F1FF', 'stroke-width': 2, opacity: 0.35 }, gl);
  E('ellipse', { cx: -38, cy: -48, rx: 32, ry: 18, fill: '#FFFFFF', opacity: 0.18, transform: 'rotate(-32 -38 -48)' }, gl);
  const orbit = [g => cellSym(g), g => { const b = bulbSym(g); b.set(1); return b; }, g => switchSym(g), g => resistorSym(g), g => meterSym(g, 'A')].map(mk => { const g = G(globeG); mk(g); return g; });
  const glHead = T(globeG, GLX, 196, 'circuit symbols', { size: 44, weight: 700, anchor: 'middle', fill: C.energy });
  const glChip = chip(globeG, 'a universal language', { size: 30, fill: C.card2, stroke: C.line }); tr(glChip, GLX, 612);
  const glSub = T(globeG, GLX, 664, 'anyone, anywhere can read them', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });

  /* ================= B. the gallery ================= */
  const CX = 600, CY = 420;
  // cell
  const gCell = G(root);
  T(gCell, CX, 196, 'cell', TITLE);
  const hiLong = E('line', { x1: CX - 19.2, x2: CX - 19.2, y1: CY - 74, y2: CY + 74, stroke: C.bad, 'stroke-width': 30, 'stroke-linecap': 'round', opacity: 0.3 }, gCell);
  const hiShort = E('line', { x1: CX + 19.2, x2: CX + 19.2, y1: CY - 38, y2: CY + 38, stroke: C.water, 'stroke-width': 44, 'stroke-linecap': 'round', opacity: 0.3 }, gCell);
  const cell1 = bigCells(gCell, 1, 2.4); tr(cell1, CX, CY);
  const lbLong = labelLine(gCell, 494, 318, CX - 26, CY - 40, 'long thin line', { size: 32, fill: C.bad, line: C.bad });
  const lbPos = rich(gCell, 494, 362, [['+ ', C.bad, 700], ['positive', C.bad, 700]], { size: 32, anchor: 'end' });
  const lbShort = labelLine(gCell, 706, 540, CX + 30, CY + 26, 'short thick line', { size: 32, fill: C.water, line: C.water });
  const lbNeg = rich(gCell, 706, 584, [['− ', C.water, 700], ['negative', C.water, 700]], { size: 32 });
  // battery
  const gBat = G(root);
  T(gBat, CX, 196, 'battery', TITLE);
  const batSub = T(gBat, CX, 610, 'two or more cells, joined', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const cell2 = bigCells(gBat, 2, 2.2); tr(cell2, CX, CY);
  const cell3 = bigCells(gBat, 3, 2.2); tr(cell3, CX, CY);
  // lamp and buzzer
  const gLamp = G(root);
  const lamp = bulbSym(gLamp); tr(lamp, 380, CY, 2.4);
  const lampN = T(gLamp, 380, 600, 'lamp', NAME);
  const buzzG = G(gLamp); tr(buzzG, 830, CY + 20);
  buzzerSym(buzzG).setAttribute('transform', 'scale(2.4)');
  const arcs = [92, 114, 136].map(r => E('path', { d: `M${(r * Math.cos(-1.25)).toFixed(1)},${(-29 + r * Math.sin(-1.25)).toFixed(1)} A${r},${r} 0 0 1 ${(r * Math.cos(-0.45)).toFixed(1)},${(-29 + r * Math.sin(-0.45)).toFixed(1)}`, fill: 'none', stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, buzzG));
  const buzzN = T(gLamp, 830, 600, 'buzzer', NAME);
  // switch
  const gSw = G(root);
  T(gSw, CX, 196, 'switch', TITLE);
  const bigSw = switchSym(gSw); tr(bigSw, CX, CY + 20, 2.6);
  const swOpen = rich(gSw, CX, 590, [['open: ', C.ink], ['a gap', C.bad, 700]], { size: 36, anchor: 'middle' });
  const swShut = rich(gSw, CX, 590, [['closed: ', C.ink], ['no gap', C.good, 700]], { size: 36, anchor: 'middle' });
  const gapMark = E('line', { x1: CX + 62, y1: CY + 20, x2: CX + 62, y2: CY - 46, stroke: C.bad, 'stroke-width': 5, 'stroke-dasharray': '8 7', 'stroke-linecap': 'round' }, gSw);
  // meters and the motor
  const gMet = G(root);
  const METERS = [['A', 'ammeter', 300], ['V', 'voltmeter', 600], ['M', 'motor', 900]].map(([L, name, x]) => {
    const g = G(gMet); tr(g, x, CY);
    const halo = E('circle', { r: 96, fill: glow(C.energy) }, g);
    const m = meterSym(g, L); m.setAttribute('transform', 'scale(1.9)');
    const hot = T(g, 0, 19, L, { size: 53, weight: 700, anchor: 'middle', fill: C.energy });
    const n = T(gMet, x, 540, name, NAME);
    return { g, halo, hot, n, x };
  });
  // resistor and variable resistor
  const gRes = G(root);
  const res1 = resistorSym(gRes); tr(res1, 360, CY, 2.2);
  const resN = T(gRes, 360, 560, 'resistor', NAME);
  const res2 = varResistorSym(gRes); tr(res2, 840, CY, 2.2);
  const res2N = T(gRes, 840, 560, 'variable resistor', NAME);
  // fuse, in a short wire carrying a current
  const gFuse = G(root);
  T(gFuse, CX, 196, 'fuse', TITLE);
  const fuW = G(gFuse); tr(fuW, CX, CY + 10, 1.5);
  const FW = [wire(fuW, [[-330, 0], [-54, 0]]), wire(fuW, [[54, 0], [330, 0]])];
  const fuse = fuseSym(fuW);
  const fuHeat = heatWaves(fuW, { n: 3, h: 40, spacing: 16, width: 4 }); tr(fuHeat, 0, -24);
  const fuSpark = spark(fuW, 15, { seed: 9 });
  const fuHigh = chip(gFuse, 'current too high!', { size: 30, fill: 'rgba(255,138,61,0.18)', stroke: C.heat, color: C.heat }); tr(fuHigh, CX, 262);
  const fuNote = rich(gFuse, CX, 560, [['it ', C.ink], ['melts', C.heat, 700], [' and breaks the circuit', C.ink]], { size: 34, anchor: 'middle' });
  // diode, in a loop with a lamp
  const gDio = G(root);
  T(gDio, CX, 182, 'diode', TITLE);
  const dl = G(gDio); tr(dl, CX, 440, 1.25);
  const QL = -250, QR = 250, QT = -120, QB = 120, DX = -110, BX2 = 120;
  const DW = [
    wire(dl, [[-59, QB], [QL, QB], [QL, QT], [DX - 54, QT]]),
    wire(dl, [[DX + 54, QT], [BX2 - 46, QT]]),
    wire(dl, [[BX2 + 46, QT], [QR, QT], [QR, QB], [59, QB]]),
  ];
  tr(cellSym(dl, { cells: 2 }), 0, QB);
  const dLamp = bulbSym(dl); tr(dLamp, BX2, QT);
  const diode = diodeSym(dl); tr(diode, DX, QT);
  const okArrow = arrow(dl, DX - 34, QT - 42, DX + 36, QT - 42, { color: C.good, width: 6 });
  const noX = cross(dl, 20); tr(noX, DX, QT - 44);
  const oneWay = chip(gDio, 'one way only', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(oneWay, CX, 446);
  // LED
  const gLed = G(root);
  T(gLed, CX, 196, 'LED', TITLE);
  const led = ledSym(gLed); tr(led, CX, CY, 2.4);
  const ledN = T(gLed, CX, 600, 'light-emitting diode', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  // neat diagrams: straight lines, right-angle corners, junction dots
  const gDraw = G(root);
  T(gDraw, CX, 182, 'drawing a circuit diagram', { size: 48, weight: 700, anchor: 'middle' });
  const NL = 360, NR = 840, NT = 250, NB = 520, NM = 385;
  tr(cellSym(gDraw), CX, NB);
  tr(bulbSym(gDraw), CX, NT);
  function wobbly(route, seed) {
    const n = Math.round(polyLen(route) / 4), st = resample(route, n), w = 9;
    const sm = st.map((q, k) => { let x = 0, y = 0, c = 0; const r = Math.min(w, k, n - 1 - k); for (let j = -r; j <= r; j++) { x += st[k + j][0]; y += st[k + j][1]; c++; } return [x / c, y / c]; });
    const rr = rng(seed), p1 = rr() * TAU, p2 = rr() * TAU;
    const wob = sm.map((q, k) => {
      const a = sm[Math.max(0, k - 1)], b = sm[Math.min(n - 1, k + 1)], tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1;
      const off = Math.min(1, k / 6, (n - 1 - k) / 6) * (7 * Math.sin(k * 0.085 + p1) + 3 * Math.sin(k * 0.33 + p2));
      return [q[0] - ty / tl * off, q[1] + tx / tl * off];
    });
    const path = E('path', { fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gDraw);
    return { st, wob, n, path };
  }
  const WOB = [wobbly([[558, NB], [NL, NB], [NL, NT], [554, NT]], 21), wobbly([[646, NT], [NR, NT], [NR, NB], [642, NB]], 34)];
  const corners = G(gDraw);
  [[NL, NB, 1, -1], [NL, NT, 1, 1], [NR, NT, -1, 1], [NR, NB, -1, -1]].forEach(([x, y, sx, sy]) => E('path', { d: `M${x + 18 * sx},${y} L${x + 18 * sx},${y + 18 * sy} L${x},${y + 18 * sy}`, fill: 'none', stroke: C.good, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, corners));
  const branch = G(gDraw);
  const brL = E('path', { d: `M${NL},${NM} L${CX - 46},${NM}`, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, branch);
  const brR = E('path', { d: `M${CX + 46},${NM} L${NR},${NM}`, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, branch);
  const lamp2 = bulbSym(branch); tr(lamp2, CX, NM);
  const jL = junctionDot(branch, NL, NM), jR = junctionDot(branch, NR, NM);
  const jHalo = [E('circle', { cx: NL, cy: NM, r: 26, fill: glow(C.energy) }, branch), E('circle', { cx: NR, cy: NM, r: 26, fill: glow(C.energy) }, branch)];
  const jLbl = labelLine(gDraw, 318, 372, NL - 10, NM - 4, 'junction', { size: 34, fill: C.energy, line: C.energy });
  const jSub = T(gDraw, 318, 410, 'wires join', { size: 28, weight: 500, anchor: 'end', fill: C.muted });
  const chStraight = chip(gDraw, 'straight lines', { size: 30, fill: C.card2, stroke: C.good }); tr(chStraight, 470, 640);
  const chCorner = chip(gDraw, 'right-angle corners', { size: 30, fill: C.card2, stroke: C.good }); tr(chCorner, 770, 640);
  const pencil = G(gDraw), pin = G(pencil);
  pin.setAttribute('transform', 'rotate(32)');
  E('path', { d: 'M0,0 L-7,-17 L7,-17 Z', fill: '#E9C79C' }, pin);
  E('path', { d: 'M0,0 L-2.6,-6.3 L2.6,-6.3 Z', fill: '#3E444B' }, pin);
  E('rect', { x: -7, y: -88, width: 14, height: 71, fill: '#F2C230', stroke: '#B8901C', 'stroke-width': 1.5 }, pin);
  E('rect', { x: -7, y: -96, width: 14, height: 9, fill: '#C9D3DC' }, pin);
  E('rect', { x: -7, y: -108, width: 14, height: 13, rx: 4, fill: '#FF9DB3' }, pin);

  /* ================= timings ================= */
  const tW1 = mid('build', 0.1), tW2 = mid('build', 0.28), tW3 = mid('build', 0.46);        // cell, switch, lamp morph
  const tWs = mid('build', 0.56), WSD = 0.7;                                                 // curly wires straighten
  const tClose = mid('build', 0.78), tOn = tClose + 0.25;                                   // switch closes; contact
  const tTurn = mid('diode', 0.56);                                                         // the diode turns round
  const tRamp0 = mid('fuse', 0.36), tRamp1 = mid('fuse', 0.6), tBreak = mid('fuse', 0.62);
  const FKEYS = [[at('fuse') - 0.3, 60], [tRamp0, 60], [tRamp1, 250], [tBreak, 250], [tBreak, 0]];
  const DKEYS = [[at('diode') - 0.3, 60], [tTurn, 60], [tTurn, 0]];
  const BKEYS = [[tOn, 30]];                                                                 // one cell: half the push
  const beat = (t, a, b) => win(t, a, b + 0.35, 0.4);

  /* ================= update ================= */
  return t => {
    /* --- A: the real circuit, then the globe; it comes back for the build --- */
    const tB0 = at('build') - 0.55;
    const aWhy = win(t, S.first - 0.4, at('cell') + 0.1, 0.4), aBuild = P(t, tB0, 0.4, linear);
    op(realG, Math.max(aWhy, aBuild));
    if (aWhy > 0 || aBuild > 0) {
      const mv = P(t, tB0, 0.65, ease);
      const x = lerp(330, 600, mv), y = lerp(415, 375, mv), s = lerp(0.6, 1, mv);
      realG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)}) translate(-600 -375)`);
      const building = t > tB0;
      const pC = P(t, tW1, 0.4), pS = P(t, tW2, 0.4), pB = P(t, tW3, 0.4), pW = P(t, tWs, WSD);
      const morph = (real, symb, p, x0, y0, rot) => {
        op(real, 1 - p); tr(real, x0, y0, 1 - 0.25 * p);
        op(symb, p); tr(symb, x0, y0, 1.3 - 0.3 * p, rot);
      };
      morph(rHolder, dCell, pC, 600, 520, 0);
      morph(rToggle, dSw, pS, 330, 375, -90);
      morph(rBulb, dBulb, pB, 600, 230, 0);
      op(ext, pC);
      rToggle.set(building ? 0 : 1);
      rBulb.set(building ? 0 : 0.55 + 0.05 * wave(t, 1.3));
      dSw.set(P(t, tClose, 0.25, easeIn));
      const swapped = pW >= 1;
      CW.forEach(w => { op(w, swapped ? 0 : 1); if (!swapped) w.set(pW, clamp(pW * 1.4)); });
      op(kitW, swapped ? 1 : 0);
      const dd = flow(t, BKEYS), on = t >= tOn;
      KW.forEach(w => { w.upd(dd, 1); w.set(on ? P(t, tOn, 0.12, linear) : 0); });
      dBulb.set(on ? 0.4 : 0);
    }
    op(realLbl, win(t, mid('why', 0.12), at('cell') + 0.1, 0.4));
    bdLbl.forEach((l, i) => op(l, P(t, [tW1, tW2, tW3][i] + 0.3, 0.4, linear)));
    const trU = P(t, tOn, 1.1, linear);
    op(bdTrace, win(t, tOn, tOn + 1.15, 0.12)); bdTrace.setAttribute('stroke-dashoffset', (-trU).toFixed(4));
    op(bdGlow, win(t, tOn + 0.2, tOn + 1.6, 0.4));
    const bcp = P(t, tOn + 0.15, 0.5, pop); op(bdChip, clamp(bcp * 2)); tr(bdChip, 600, 380, 0.85 + 0.15 * bcp);

    const aG = win(t, mid('why', 0.22), at('cell') + 0.1, 0.4);
    op(globeG, aG);
    if (aG > 0) {
      const gp = P(t, mid('why', 0.22), 0.7, pop);
      tr(gl, GLX, GLY, 0.6 + 0.4 * gp);
      tr(landStrip, -((t * 14 * calm) % (2 * GLR)), 0);
      orbit.forEach((g, i) => {
        const a = -Math.PI / 2 + i * TAU / orbit.length + t * 0.16 * calm, p = P(t, mid('why', 0.32 + i * 0.06), 0.5, pop);
        tr(g, GLX + Math.cos(a) * 182, GLY + Math.sin(a) * 140, 0.62 * Math.max(0.01, p)); op(g, clamp(p * 2));
      });
      op(glHead, P(t, mid('why', 0.26), 0.4, linear));
      op(glChip, P(t, mid('why', 0.58), 0.45, linear));
      op(glSub, P(t, mid('why', 0.78), 0.45, linear));
    }

    /* --- B: the gallery --- */
    const aCell = beat(t, at('cell') - 0.15, at('battery') + 0.05);
    op(gCell, aCell);
    if (aCell > 0) {
      const p = P(t, at('cell'), 0.6, pop);
      tr(cell1, CX, CY, 0.7 + 0.3 * p); op(cell1, clamp(p * 2) * (1 - P(t, at('battery') + 0.1, 0.2, linear)));
      op(hiLong, win(t, mid('cell', 0.15), mid('cell', 0.4), 0.3) * 0.9 + win(t, mid('cell', 0.58), mid('cell', 0.75), 0.3) * 0.9);
      op(hiShort, win(t, mid('cell', 0.33), mid('cell', 0.56), 0.3) * 0.9 + win(t, mid('cell', 0.78), mid('cell', 0.97), 0.3) * 0.9);
      op(cell1.plus, P(t, mid('cell', 0.6), 0.35, linear)); op(cell1.minus, P(t, mid('cell', 0.8), 0.35, linear));
      op(lbLong, P(t, mid('cell', 0.16), 0.4, linear)); op(lbShort, P(t, mid('cell', 0.34), 0.4, linear));
      op(lbPos, P(t, mid('cell', 0.6), 0.4, linear)); op(lbNeg, P(t, mid('cell', 0.8), 0.4, linear));
    }
    const aBat = beat(t, at('battery') - 0.1, at('lamp') - 0.15);
    op(gBat, aBat);
    if (aBat > 0) {
      const t2 = at('battery') + 0.1, t3 = mid('battery', 0.5);
      op(cell2, P(t, t2, 0.2, linear) * (1 - P(t, t3, 0.2, linear))); tr(cell2, CX, CY, 1.08 - 0.08 * P(t, t2, 0.35, easeOut));
      op(cell3, P(t, t3, 0.2, linear)); tr(cell3, CX, CY, 1.08 - 0.08 * P(t, t3, 0.35, easeOut));
      op(batSub, P(t, mid('battery', 0.3), 0.4, linear));
    }
    const aLamp = beat(t, at('lamp') - 0.15, at('switch') - 0.15);
    op(gLamp, aLamp);
    if (aLamp > 0) {
      const p = P(t, at('lamp'), 0.6, pop);
      tr(lamp, 380, CY, 2.4 * (0.75 + 0.25 * p)); op(lamp, clamp(p * 2));
      lamp.set(P(t, mid('lamp', 0.2), 0.35, linear));
      op(lampN, P(t, mid('lamp', 0.1), 0.4, linear));
      const pb = P(t, mid('lamp', 0.55), 0.6, pop);
      tr(buzzG, 830, CY + 20, 0.75 + 0.25 * pb); op(buzzG, clamp(pb * 2)); op(buzzN, P(t, mid('lamp', 0.6), 0.4, linear));
      arcs.forEach((a, i) => { const q = ((t - mid('lamp', 0.68)) * 1.3 - i * 0.22) % 1; op(a, t > mid('lamp', 0.68) ? Math.sin(clamp(q) * Math.PI) : 0); });
    }
    const aSw = beat(t, at('switch') - 0.15, at('meters') - 0.15);
    op(gSw, aSw);
    if (aSw > 0) {
      const o1 = mid('switch', 0.25), c1 = mid('switch', 0.58), o2 = mid('switch', 0.76), c2 = mid('switch', 0.94);
      const closed = t < o1 ? 1 : t < c1 ? 1 - P(t, o1, 0.3) : t < o2 ? P(t, c1, 0.3) : t < c2 ? 1 - P(t, o2, 0.3) : P(t, c2, 0.3);
      bigSw.set(closed);
      const isOpen = closed < 0.5;
      op(swOpen, isOpen ? 1 : 0); op(swShut, !isOpen && t > c1 ? 1 : 0);
      op(gapMark, clamp((0.4 - closed) / 0.4));
    }
    const aMet = beat(t, at('meters') - 0.15, at('resistor') - 0.15);
    op(gMet, aMet);
    if (aMet > 0) {
      const flashAt = [mid('meters', 0.42), mid('meters', 0.62), mid('meters', 0.82)];
      METERS.forEach((m, i) => {
        const p = P(t, at('meters') + i * 0.3, 0.5, pop);
        tr(m.g, m.x, CY, 0.7 + 0.3 * p); op(m.g, clamp(p * 2));
        const f = win(t, flashAt[i] - 0.1, flashAt[i] + 0.9, 0.25);
        op(m.hot, f); op(m.halo, f * 0.8);
        op(m.n, P(t, flashAt[i], 0.35, linear));
      });
    }
    const aRes = beat(t, at('resistor') - 0.15, at('fuse') - 0.15);
    op(gRes, aRes);
    if (aRes > 0) {
      const p1 = P(t, at('resistor'), 0.6, pop), p2 = P(t, mid('resistor', 0.5), 0.6, pop), pa = P(t, mid('resistor', 0.62), 0.6, easeOut);
      tr(res1, 360, CY, 2.2 * (0.75 + 0.25 * p1)); op(res1, clamp(p1 * 2)); op(resN, P(t, mid('resistor', 0.12), 0.4, linear));
      tr(res2, 840, CY, 2.2 * (0.75 + 0.25 * p2)); op(res2, clamp(p2 * 2));
      tr(res2.arrow, -34 * (1 - pa), 26 * (1 - pa)); op(res2.arrow, pa);
      op(res2N, P(t, mid('resistor', 0.66), 0.4, linear));
    }
    const aFu = beat(t, at('fuse') - 0.15, at('diode') - 0.15);
    op(gFuse, aFu);
    if (aFu > 0) {
      const dd = flow(t, FKEYS);
      const dop = t < tBreak ? 1 : 1 - 0.7 * P(t, tBreak, 0.4, linear);
      FW.forEach(w => { w.upd(dd, 1); w.set(dop); });
      const heat = P(t, tRamp0 + 0.3, tBreak - tRamp0 - 0.3, linear) * (1 - P(t, tBreak + 0.1, 1.0, linear));
      fuse.set(heat, P(t, tBreak, 0.22, easeOut));
      op(fuHeat, heat); fuHeat.upd(t);
      const sp = (t - tBreak) / 0.6;
      if (sp > 0 && sp < 1) { op(fuSpark, Math.sin(sp * Math.PI)); tr(fuSpark, 0, 0, 0.5 + 0.9 * Math.sin(sp * Math.PI)); fuSpark.upd(t); } else op(fuSpark, 0);
      op(fuHigh, win(t, tRamp0 + 0.2, tBreak + 0.45, 0.25));
      op(fuNote, P(t, tBreak + 0.12, 0.35, linear));
    }
    const aDi = beat(t, at('diode') - 0.15, at('led') - 0.2);
    op(gDio, aDi);
    if (aDi > 0) {
      const dd = flow(t, DKEYS), flowing = t < tTurn;
      DW.forEach(w => { w.upd(dd, 1); w.set(flowing ? 1 : 1 - 0.7 * P(t, tTurn, 0.4, linear)); });
      dLamp.set(flowing ? 1 : 0);
      tr(diode, DX, QT, 1, 180 * P(t, tTurn, 0.45));
      okArrow.set(P(t, mid('diode', 0.18), 0.5)); op(okArrow, win(t, mid('diode', 0.18), tTurn, 0.2));
      const xp = P(t, tTurn + 0.5, 0.4, pop); op(noX, clamp(xp * 2)); tr(noX, DX, QT - 44, Math.max(0.01, xp));
      op(oneWay, P(t, mid('diode', 0.7), 0.4, linear));
    }
    const aLed = beat(t, at('led') - 0.15, at('draw') - 0.15);
    op(gLed, aLed);
    if (aLed > 0) {
      const pr = P(t, mid('led', 0.1), 0.45, easeOut), pa = P(t, mid('led', 0.24), 0.5, easeOut);
      op(led.ring, pr);
      op(led.arrows, pa);
      const glowOn = P(t, mid('led', 0.48), 0.5, linear);
      led.set(glowOn * (0.75 + 0.25 * wave(t, 1.1)));
      const push = glowOn * 7 * calm * wave(t, 0.9);
      tr(led.arrows, (1 - pa) * -10 + push * 0.57, (1 - pa) * 14 - push * 0.82);
      op(ledN, P(t, mid('led', 0.55), 0.45, linear));
    }
    const aDr = beat(t, at('draw') - 0.15, at('build') - 0.55);
    op(gDraw, aDr);
    if (aDr > 0) {
      const sp = P(t, mid('draw', 0.36), 0.9);                     // wobbly -> straight
      let tipX = null, tipY = null;
      WOB.forEach((w, i) => {
        const u = P(t, mid('draw', [0.03, 0.18][i]), 1.05, linear);
        w.path.setAttribute('stroke-dashoffset', (1 - u).toFixed(4));
        w.path.setAttribute('d', toD(w.wob.map((q, k) => [lerp(q[0], w.st[k][0], sp), lerp(q[1], w.st[k][1], sp)])));
        if (u > 0 && u < 1) { const q = w.wob[Math.round(u * (w.n - 1))]; tipX = q[0]; tipY = q[1]; }
      });
      op(pencil, tipX === null ? 0 : 1);
      if (tipX !== null) tr(pencil, tipX, tipY);
      op(corners, win(t, mid('draw', 0.42), mid('draw', 0.64), 0.3));
      op(chStraight, P(t, mid('draw', 0.38), 0.4, linear)); op(chCorner, P(t, mid('draw', 0.46), 0.4, linear));
      const pl = P(t, mid('draw', 0.58), 0.5, pop);
      op(lamp2, clamp(pl * 2)); tr(lamp2, CX, NM, Math.max(0.01, 0.6 + 0.4 * pl));
      brL.setAttribute('stroke-dashoffset', (1 - P(t, mid('draw', 0.6), 0.5)).toFixed(4));
      brR.setAttribute('stroke-dashoffset', (1 - P(t, mid('draw', 0.66), 0.5)).toFixed(4));
      op(brL, t > mid('draw', 0.6) ? 1 : 0); op(brR, t > mid('draw', 0.66) ? 1 : 0);
      [jL, jR].forEach((j, i) => { const jp = P(t, mid('draw', [0.62, 0.72][i]), 0.4, pop); op(j, clamp(jp * 2)); attr(j, 'r', 7 * Math.max(0.01, jp)); op(jHalo[i], win(t, mid('draw', [0.62, 0.72][i]), mid('draw', 0.98), 0.3) * (0.6 + 0.4 * wave(t, 1.2))); });
      op(jLbl, P(t, mid('draw', 0.7), 0.4, linear)); op(jSub, P(t, mid('draw', 0.84), 0.4, linear));
    }
  };
});

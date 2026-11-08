/* Chapter 8, Moments: the turning effect.
   Beats: a door swings on its hinge, a seesaw tips -> moment = force × distance from the pivot
   -> a spanner: the distance runs from the pivot at right angles to the force; newton metres
   -> a bigger force, or the same force further out, gives a bigger moment -> a long spanner turns a tight bolt,
   a short one doesn't; door handles sit far from the hinges -> pushing near the hinges vs near the handle
   -> levers: crowbar, seesaw, wheelbarrow -> a seesaw balances when force × distance matches
   -> 300 N at 2 m balances 600 N at 1 m, to scale (showpiece) -> a small force far out beats a big one close in.
   One force scale for the whole scene: 100 N = 40 px. */
scene('moments', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const FS = 0.4;                                    // px per newton, every arrow in this scene
  const AMP = R ? 0.35 : 1;

  /* ---------- local helpers and art ---------- */
  const f1 = v => (+v).toFixed(1);
  const num = v => String(Math.round(v * 100) / 100);
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.8 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* "200 N × 0.2 m = 40 N m": force, distance and moment in their colours; t.set(F, d) */
  function readout(parent, x, y, size, fcol) {
    const t = E('text', { x, y, 'font-size': size || 36, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, parent);
    const a = E('tspan', { fill: fcol || C.good }, t), b = E('tspan', {}, t), c = E('tspan', { fill: C.energy }, t);
    t.set = (F, d) => { const f = Math.round(F), dd = Math.round(d * 100) / 100; a.textContent = f + ' N'; b.textContent = ' × ' + num(dd) + ' m = '; c.textContent = num(f * dd) + ' N m'; };
    return t;
  }
  /* a curved arrow round (0,0) at radius r; g.set(fromDeg, sweepDeg) (positive sweep = clockwise on screen) */
  function turnArrow(parent, r, color, w) {
    const g = G(parent), col = color || C.energy;
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': w || 6, 'stroke-linecap': 'round' }, g);
    const head = E('path', { d: 'M4,0 L-14,-10 L-10,0 L-14,10 Z', fill: col }, g);
    g.set = (a0, sw) => {
      const rad = v => v * Math.PI / 180, a1 = a0 + sw;
      const p0 = [Math.cos(rad(a0)) * r, Math.sin(rad(a0)) * r], p1 = [Math.cos(rad(a1)) * r, Math.sin(rad(a1)) * r];
      path.setAttribute('d', `M${f1(p0[0])},${f1(p0[1])} A${r},${r} 0 ${Math.abs(sw) > 180 ? 1 : 0} ${sw > 0 ? 1 : 0} ${f1(p1[0])},${f1(p1[1])}`);
      head.setAttribute('transform', `translate(${f1(p1[0])} ${f1(p1[1])}) rotate(${f1(a1 + (sw > 0 ? 90 : -90))})`);
      op(path, Math.abs(sw) > 3 ? 1 : 0); op(head, Math.abs(sw) > 3 ? 1 : 0);
    };
    g.set(0, 0);
    return g;
  }
  /* a pulsing ring that marks a pivot, in its own group at (x, y) */
  function pivotRing(parent, x, y, r) {
    const g = G(parent), ring = G(g);
    E('circle', { r: r || 16, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, ring);
    tr(g, x, y);
    g.upd = t => tr(ring, 0, 0, 1 + 0.18 * AMP * wave(t, 1.1));
    return g;
  }
  /* a ring spanner on a bolt: the bolt's centre (the pivot) at (0,0), handle along +x for len px;
     g.set(deg) turns it (and the bolt) */
  function spanner(parent, len) {
    const g = G(parent), body = G(g), metal = linGrad('#E8EEF3', '#8597A6', true);
    E('rect', { x: 20, y: -15, width: len - 20, height: 30, rx: 15, fill: metal, stroke: '#5F6E7B', 'stroke-width': 2.5 }, body);
    E('circle', { r: 46, fill: metal, stroke: '#5F6E7B', 'stroke-width': 2.5 }, body);
    const hex = []; for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + Math.PI / 6; hex.push(f1(Math.cos(a) * 28) + ',' + f1(Math.sin(a) * 28)); }
    E('polygon', { points: hex.join(' '), fill: '#56636E', stroke: '#2C3640', 'stroke-width': 3, 'stroke-linejoin': 'round' }, body);
    E('circle', { r: 7, fill: C.energy, stroke: C.bg0, 'stroke-width': 2 }, g);
    g.set = deg => body.setAttribute('transform', `rotate(${f1(deg)})`);
    return g;
  }
  /* a door seen from above: hinge at (0,0), the door along +x for len px, opening upwards; g.set(openDeg) */
  function doorTop(parent, len) {
    const g = G(parent);
    E('path', { d: `M${len},0 A${len},${len} 0 0 0 0,${-len}`, fill: 'none', stroke: C.faint, 'stroke-width': 2.5, 'stroke-dasharray': '8 8' }, g);
    E('path', { d: `M-78,0 L-8,0 M${len + 8},0 L${len + 78},0`, stroke: '#7D8E9A', 'stroke-width': 16 }, g);
    const slab = G(g);
    E('rect', { x: 0, y: -9, width: len, height: 18, rx: 4, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 2.5 }, slab);
    E('rect', { x: len - 40, y: 9, width: 22, height: 8, rx: 3, fill: '#DCE6EE', stroke: '#5F6E7B', 'stroke-width': 1.5 }, slab);
    E('circle', { r: 10, fill: '#8597A6', stroke: '#DCE6EE', 'stroke-width': 2.5 }, g);
    g.set = deg => slab.setAttribute('transform', `rotate(${f1(-deg)})`);
    return g;
  }
  /* where a push meets the door's near face, s px from the hinge, when it is open deg; and the push direction */
  function doorPush(hx, hy, s, deg) {
    const a = deg * Math.PI / 180, u = [Math.cos(a), -Math.sin(a)], n = [-Math.sin(a), -Math.cos(a)];
    return [hx + s * u[0] - 9 * n[0], hy + s * u[1] - 9 * n[1], Math.atan2(n[1], n[0]) * 180 / Math.PI];
  }
  /* a child sitting on a seesaw, hips at (0,0), facing right (s < 0 faces left) */
  function sitter(parent, s, shirt) {
    const g = G(parent), p = person(g, { shirt });
    p.pose({ lean: 6, armL: [44, 34], armR: [34, 44], legL: [88, -92], legR: [80, -84] });
    p.setAttribute('transform', `scale(${s} ${Math.abs(s)}) translate(0 92)`);
    return g;
  }

  /* ================= A. a door on its hinges, a seesaw ================= */
  const A = G(root);
  const DHX = 150, DHY = 470, DL = 280;
  const doorA = doorTop(A, DL); tr(doorA, DHX, DHY);
  const pushA = fmArrow(A, 'push', 0, 0, 150, 'up', { scale: FS, tip: true, value: false });
  const turnA = turnArrow(A, 120); tr(turnA, DHX, DHY);
  const ringA = pivotRing(A, DHX, DHY, 18);
  T(A, DHX - 22, DHY + 58, 'hinge', { size: 28, weight: 700, fill: C.energy, anchor: 'middle' });
  T(A, DHX + DL / 2, DHY + 126, 'a door, seen from above', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const seeA = G(A);
  const ssA = G(seeA), seesawA = fmSeesaw(ssA, { len: 440, pxPerM: 100, thick: 16, pivotH: 80 }); tr(ssA, 880, 430);
  E('line', { x1: 800, x2: 960, y1: 512, y2: 512, stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round' }, seeA);
  const ringB = pivotRing(seeA, 880, 422, 16);
  const turnB = turnArrow(seeA, 74); tr(turnB, 880, 422);
  T(seeA, 880, 572, 'pivot', { size: 28, weight: 700, fill: C.energy, anchor: 'middle' });
  T(seeA, 880, 626, 'a seesaw', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });

  /* ================= B. the formula ================= */
  const B = G(root);
  const bTitle = T(B, 600, 196, 'This turning effect is called a **moment**', { size: 40, weight: 600, anchor: 'middle', boldFill: C.energy });
  const fCardG = G(B);
  card(fCardG, 140, 252, 920, 104, { fill: C.card, stroke: C.energy, sw: 3 });
  const fText = E('text', { x: 600, y: 318, 'font-size': 40, 'font-weight': 700, 'font-family': FD, 'text-anchor': 'middle', fill: C.ink }, fCardG);
  [['moment', C.energy], [' = ', C.muted], ['force', C.good], [' × ', C.muted], ['distance from the pivot', C.ink]].forEach(([s, c]) => { E('tspan', { fill: c }, fText).textContent = s; });
  // a little lever to go with it
  const lev = G(B);
  E('path', { d: 'M480,600 L452,650 L508,650 Z', fill: linGrad('#9DB0BF', '#5F6E7B', true), stroke: FM.metal[2], 'stroke-width': 3, 'stroke-linejoin': 'round' }, lev);
  E('rect', { x: 330, y: 586, width: 520, height: 14, rx: 7, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 2.5 }, lev);
  E('circle', { cx: 480, cy: 593, r: 5, fill: FM.metal[2] }, lev);
  const levF = fmArrow(lev, 'push', 800, 586, 150, 'down', { scale: FS, tip: true, label: 'force', value: false });
  E('line', { x1: 480, y1: 586, x2: 480, y2: 548, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' }, lev);
  const levD = fmDim(lev, 480, 556, 800, 556, 'distance from the pivot', { side: 'above' });
  T(lev, 410, 646, 'pivot', { size: 26, weight: 700, fill: C.energy, anchor: 'middle' });

  /* ================= C, D. the spanner ================= */
  const Cg = G(root);
  const SPX = 270, SPY = 430, SPM = 1500;            // the bolt; spanner close-up: 1500 px per metre
  const spn = spanner(Cg, 0.4 * SPM + 40); tr(spn, SPX, SPY);
  const ringS = pivotRing(Cg, SPX, SPY, 12);
  T(Cg, SPX - 62, SPY + 10, 'pivot', { size: 28, weight: 700, fill: C.energy, anchor: 'end' });
  const pushS = fmArrow(Cg, 'push', SPX + 0.2 * SPM, SPY - 15, 200, 'down', { scale: FS, tip: true, label: 'force' });
  const lineS = E('line', { stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, Cg);
  const dimS = fmDim(Cg, SPX, SPY + 74, SPX + 0.2 * SPM, SPY + 74, '0.2 m', { side: 'below' });
  const sqS = E('path', { fill: 'none', stroke: C.ink, 'stroke-width': 2.5 }, Cg);
  const raS = T(Cg, 0, 0, 'measured at right angles to the force', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
  const turnS = turnArrow(Cg, 84); tr(turnS, SPX, SPY);
  const roS = readout(Cg, 500, 672, 40);
  const nmChip = chip(Cg, 'newton metres (N m)', { size: 30, fill: '#33300F', stroke: C.energy, color: C.energy });
  const scaleS = fmScaleBar(Cg, 1040, 236, 100, { scale: FS });
  const bigChip = chip(Cg, 'bigger force', { size: 28, fill: C.card2, stroke: C.good, color: C.good });
  const farChip = chip(Cg, 'further from the pivot', { size: 28, fill: C.card2, stroke: C.good, color: C.good });

  /* ================= E. short and long spanners, door handles ================= */
  const Eg = G(root);
  const ROWS = [{ y: 262, d: 0.1, name: 'short spanner' }, { y: 492, d: 0.3, name: 'long spanner' }].map(r => {
    const g = G(Eg);
    r.sp = spanner(g, r.d * SPM + 30); tr(r.sp, 230, r.y);
    r.push = fmArrow(g, 'push', 0, 0, 200, 'down', { scale: FS, tip: true, value: false, label: '' });
    T(g, 230, r.y + 84, r.name, { size: 28, weight: 700, anchor: 'middle' });
    r.ro = readout(g, 920, r.y + 12, 34); r.ro.set(200, r.d);
    r.mark = r.d > 0.2 ? tick(g, 18) : cross(g, 15);
    r.note = T(g, 920, r.y + 56, r.d > 0.2 ? 'the bolt turns' : 'too small: the bolt stays stuck', { size: 26, weight: 600, anchor: 'middle', fill: r.d > 0.2 ? C.good : '#FF9AA4' });
    r.turn = turnArrow(g, 72); tr(r.turn, 230, r.y);
    r.g = g;
    return r;
  });
  const tightLab = T(Eg, 600, 150, 'the same force on a **tight** bolt', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const scaleE = fmScaleBar(Eg, 1060, 640, 100, { scale: FS });
  // a door from the front: the handle far from the hinges
  const fd = G(Eg);
  const FDX = 450, FDY = 170, FDW = 300, FDH = 470;
  E('rect', { x: FDX - 14, y: FDY - 14, width: FDW + 28, height: FDH + 14, rx: 6, fill: '#3A4651' }, fd);
  E('rect', { x: FDX, y: FDY, width: FDW, height: FDH, rx: 4, fill: linGrad(FM.wood[2], FM.wood[0]), stroke: FM.wood[1], 'stroke-width': 3 }, fd);
  [[FDX + 30, FDY + 30, FDW - 60, 170], [FDX + 30, FDY + 250, FDW - 60, 190]].forEach(([x, y, w, h]) => E('rect', { x, y, width: w, height: h, rx: 6, fill: 'none', stroke: FM.wood[1], 'stroke-width': 3, opacity: 0.6 }, fd));
  [FDY + 50, FDY + FDH - 86].forEach(y => E('rect', { x: FDX - 6, y, width: 12, height: 36, rx: 3, fill: '#8597A6', stroke: '#DCE6EE', 'stroke-width': 1.5 }, fd));
  E('rect', { x: FDX + FDW - 60, y: FDY + 228, width: 44, height: 12, rx: 6, fill: '#DCE6EE', stroke: '#5F6E7B', 'stroke-width': 2 }, fd);
  E('circle', { cx: FDX + FDW - 30, cy: FDY + 234, r: 9, fill: '#C9D6DF', stroke: '#5F6E7B', 'stroke-width': 2 }, fd);
  T(fd, FDX - 40, FDY + 76, 'hinges', { size: 28, weight: 700, anchor: 'end', fill: C.energy });
  E('line', { x1: FDX - 34, y1: FDY + 68, x2: FDX - 10, y2: FDY + 68, stroke: C.energy, 'stroke-width': 3 }, fd);
  T(fd, FDX + FDW + 34, FDY + 244, 'handle', { size: 28, weight: 700 });
  E('path', { d: `M${FDX},${FDY + FDH + 4} L${FDX},${FDY + FDH + 34} M${FDX + FDW - 30},${FDY + FDH + 4} L${FDX + FDW - 30},${FDY + FDH + 34}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, fd);
  const fdDim = fmDim(fd, FDX, FDY + FDH + 26, FDX + FDW - 30, FDY + FDH + 26, 'far from the hinges', { side: 'below', textColor: C.ink });

  /* ================= F. push near the hinges, then near the handle ================= */
  const Fg = G(root);
  const DOORS = [{ hx: 110, s: 40, open: 4, name: 'near the hinges', res: 'barely moves' }, { hx: 690, s: 290, open: 62, name: 'near the handle', res: 'swings open' }].map(o => {
    o.g = G(Fg); o.d = doorTop(o.g, 330); tr(o.d, o.hx, 480);
    o.push = fmArrow(o.g, 'push', 0, 0, 150, 'up', { scale: FS, tip: true, value: false, label: '' });
    T(o.g, o.hx + 165, 560, o.name, { size: 30, weight: 700, anchor: 'middle' });
    o.resT = T(o.g, o.hx + 165, 604, o.res, { size: 28, weight: 600, anchor: 'middle', fill: o.open > 20 ? C.good : C.muted });
    o.turn = turnArrow(o.g, 110); tr(o.turn, o.hx, 480);
    return o;
  });
  const samePush = T(Fg, 600, 150, 'the same push, in two places', { size: 32, weight: 600, anchor: 'middle' });
  const hardChip = chip(Fg, 'much harder near the hinges!', { size: 30, fill: '#3A1F24', stroke: C.bad, color: '#FFB0B8' });

  /* ================= G. levers ================= */
  const Gg = G(root);
  const LV = [230, 600, 970].map((x, i) => { const g = G(Gg); card(g, -165, -190, 330, 380, { fill: C.card, stroke: C.line }); return { g, x, i }; });
  ['crowbar', 'seesaw', 'wheelbarrow'].forEach((n, i) => T(LV[i].g, 0, 158, n, { size: 30, weight: 700, anchor: 'middle' }));
  // a crowbar prising a lid off a crate; its pivot is the crate's top corner
  const cr = G(LV[0].g); tr(cr, 26, 0);
  const crate = fmCrate(cr, 130, 100); crate.at(30, 90);
  const lid = E('rect', { x: -35, y: -24, width: 130, height: 14, rx: 3, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 2.5 }, cr);
  const bar = G(cr);
  E('path', { d: 'M-118,0 L36,0 Q46,0 48,-7', fill: 'none', stroke: '#3A4651', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bar);
  const crPush = fmArrow(cr, 'push', 0, 0, 150, 'down', { scale: FS, tip: true, value: false, label: '' });
  const crRing = pivotRing(cr, -35, -10, 11);
  // a seesaw
  const sw = LV[1].g;
  const swS = G(sw), swSee = fmSeesaw(swS, { len: 280, pxPerM: 60, thick: 12, pivotH: 54 }); tr(swS, 0, 20);
  E('line', { x1: -60, x2: 60, y1: 75, y2: 75, stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round' }, sw);
  const swRing = pivotRing(sw, 0, 14, 11);
  // a wheelbarrow: the wheel's axle is the pivot; lifting the handles raises the load
  const wb = LV[2].g;
  const wbBody = G(wb);
  E('path', { d: 'M-150,-34 L-14,0 L64,30 M-8,0 L-22,60', fill: 'none', stroke: '#5F6E7B', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, wbBody);
  E('path', { d: 'M-34,-60 L84,-60 L62,0 L-16,0 Z', fill: linGrad('#5BD27A', '#2C8C4C', true), stroke: '#22844A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, wbBody);
  E('path', { d: 'M-24,-60 Q6,-86 38,-62 Q60,-82 78,-60 Z', fill: '#8A6A4A', stroke: '#5E4630', 'stroke-width': 2 }, wbBody);
  E('circle', { cx: 64, cy: 30, r: 30, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 4 }, wb);
  E('circle', { cx: 64, cy: 30, r: 9, fill: '#9AA8B4' }, wb);
  E('line', { x1: -150, x2: 140, y1: 61, y2: 61, stroke: '#8FA3B3', 'stroke-width': 4, 'stroke-linecap': 'round' }, wb);
  const wbPull = fmArrow(wb, 'pull', 0, 0, 150, 'up', { scale: FS, value: false, label: '' });
  const wbRing = pivotRing(wb, 64, 30, 14);
  const lvHead = T(Gg, 600, 168, 'Levers make jobs easier', { size: 36, weight: 700, anchor: 'middle' });
  const lvKey = G(Gg);
  E('circle', { cx: 482, cy: 652, r: 11, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, lvKey);
  T(lvKey, 504, 661, 'marks each pivot', { size: 26, weight: 600, fill: C.energy });

  /* ================= H, I, J. the seesaw: balance, the children, the myth ================= */
  const H = G(root);
  const SSX = 600, SSY = 440, BTOP = SSY - 16;
  E('line', { x1: SSX - 90, x2: SSX + 90, y1: SSY + 90, y2: SSY + 90, stroke: '#8FA3B3', 'stroke-width': 5, 'stroke-linecap': 'round' }, H);
  const ssG = G(H), see = fmSeesaw(ssG, { len: 760, pxPerM: 150, thick: 16, pivotH: 90 }); tr(ssG, SSX, SSY);
  const ringH = pivotRing(H, SSX, SSY - 8, 14);
  const atS = d => { const p = see.at(d); return [SSX + p[0], SSY + p[1]]; };
  // balance: two equal crates
  const crates = [-1.5, 1.5].map(d => { const g = G(H); fmCrate(g, 86, 70); return { g, d }; });
  const crW = crates.map(() => fmArrow(H, 'weight', 0, 0, 300, 'down', { scale: FS, value: false, labelAt: 'tip' }));
  const fdL = T(H, 330, 236, 'force × distance', { size: 34, weight: 700, anchor: 'middle' });
  const fdR = T(H, 870, 236, 'force × distance', { size: 34, weight: 700, anchor: 'middle' });
  const eqBal = T(H, SSX, 242, '=', { size: 56, weight: 700, anchor: 'middle', fill: C.good });
  const turnL = turnArrow(H, 64), turnR = turnArrow(H, 64);
  const balChip = chip(H, 'balanced: the beam sits level', { size: 30, fill: '#173A2A', stroke: C.good, color: C.good });
  // the children, to scale
  const kidL = sitter(H, 0.72, '#F28C38'), kidR = sitter(H, -0.88, '#5B8DEF');
  const wL = fmArrow(H, 'weight', 0, 0, 300, 'down', { scale: FS, labelAt: 'tip' });
  const wR = fmArrow(H, 'weight', 0, 0, 600, 'down', { scale: FS, labelAt: 'tip' });
  const dL = fmDim(H, SSX - 300, BTOP + 56, SSX, BTOP + 56, '2 m', { side: 'below' });
  const dR = fmDim(H, SSX, BTOP + 56, SSX + 150, BTOP + 56, '1 m', { side: 'below' });
  const kLabL = T(H, 0, 300, 'lighter, further out', { size: 28, weight: 700, anchor: 'middle', fill: '#FFB37A' });
  const kLabR = T(H, 0, 300, 'heavier, near the middle', { size: 28, weight: 700, anchor: 'middle', fill: '#9DBDF7' });
  const roL = readout(H, 320, 170, 34, C.glucose), roR = readout(H, 880, 170, 34, C.glucose);
  roL.set(300, 2); roR.set(600, 1);
  const eqKids = T(H, SSX, 178, '=', { size: 56, weight: 700, anchor: 'middle', fill: C.good });
  const kidsChip = chip(H, 'level: the moments balance', { size: 30, fill: '#173A2A', stroke: C.good, color: C.good });
  const scaleH = fmScaleBar(H, 1060, 640, 100, { scale: FS });
  // the myth: a small force far out against a big force close in
  const pL = fmArrow(H, 'push', 0, 0, 100, 'down', { scale: FS, tip: true, label: '', side: 'left' });
  const pR = fmArrow(H, 'push', 0, 0, 300, 'down', { scale: FS, tip: true, label: '', side: 'right' });
  const mdL = fmDim(H, SSX - 300, BTOP + 56, SSX, BTOP + 56, '2 m', { side: 'below' });
  const mdR = fmDim(H, SSX, BTOP + 56, SSX + 75, BTOP + 56, '', { side: 'below' });
  const mdRL = T(H, 0, BTOP + 66, '0.5 m', { size: 26, weight: 700 });
  const moL = readout(H, 320, 170, 34), moR = readout(H, 880, 170, 34);
  moL.set(100, 2); moR.set(300, 0.5);
  const gtM = T(H, SSX, 178, '>', { size: 56, weight: 700, anchor: 'middle', fill: C.energy });
  const turnM = turnArrow(H, 84); tr(turnM, SSX, SSY - 8);
  const mythChip = chip(H, 'bigger force ≠ bigger turning effect', { size: 32, fill: '#33300F', stroke: C.energy, color: C.energy });

  return t => {
    /* ================= A ================= */
    const aA = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('moment') - 0.3, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      const open = 62 * P(t, S.first + 0.6, 1.6);
      doorA.set(open);
      const pp = doorPush(DHX, DHY, 250, open);
      pushA.move(pp[0], pp[1], pp[2]); pushA.set(P(t, S.first + 0.15, 0.4));
      op(pushA, 1 - P(t, S.first + 2.4, 0.4, linear));
      turnA.set(-8, -Math.min(open, 56)); op(turnA, P(t, S.first + 0.7, 0.3, linear));
      ringA.upd(t);
      const sp = P(t, mid('turn', 0.6), 0.5, linear);
      op(seeA, sp);
      const tilt = (R ? 5 : 9) * Math.sin(TAU * (t - mid('turn', 0.6)) / 2.4) * clamp((t - mid('turn', 0.6)) / 0.6);
      seesawA.set(tilt); ringB.upd(t);
      const tw = Math.cos(TAU * (t - mid('turn', 0.6)) / 2.4);        // which way it is turning now
      turnB.set(tw > 0 ? -125 : -55, tw > 0 ? 70 : -70); op(turnB, sp * clamp(Math.abs(tw) * 2 - 0.4));
    }

    /* ================= B ================= */
    const aB = Math.min(P(t, at('moment') - 0.1, 0.45, linear), 1 - P(t, at('right') - 0.3, 0.4, linear));
    op(B, aB);
    if (aB > 0) {
      const p1 = P(t, at('moment') + 0.05, 0.6, easeOut); op(bTitle, p1); tr(bTitle, 0, (1 - p1) * 14);
      const p2 = P(t, mid('moment', 0.42), 0.6, pop);
      op(fCardG, clamp(p2 * 2)); fCardG.setAttribute('transform', `translate(600 304) scale(${Math.max(0.01, 0.85 + 0.15 * p2).toFixed(3)}) translate(-600 -304)`);
      op(lev, P(t, mid('moment', 0.42), 0.5, linear));
      levF.set(P(t, mid('moment', 0.5), 0.5)); op(levD, P(t, mid('moment', 0.6), 0.4, linear));
    }

    /* ================= C, D ================= */
    const aC = Math.min(P(t, at('right') - 0.1, 0.45, linear), 1 - P(t, at('spanner') - 0.3, 0.4, linear));
    op(Cg, aC);
    if (aC > 0) {
      // (bigger) the force grows 200 -> 400 N and back, then slides from 0.2 m out to 0.4 m
      const grow = P(t, at('bigger') + 0.1, 0.9) - P(t, mid('bigger', 0.48), 0.35);
      const F = Math.round(200 + 200 * grow), d = 0.2 + 0.2 * P(t, mid('bigger', 0.56), 1.3);
      const fx = SPX + d * SPM;
      pushS.move(fx, SPY - 15); pushS.set(P(t, at('right') + 0.1, 0.5), F);
      attr(lineS, 'x1', fx); attr(lineS, 'y1', SPY - 15); attr(lineS, 'x2', fx); attr(lineS, 'y2', SPY + 86);
      op(lineS, P(t, mid('right', 0.2), 0.4, linear));
      dimS.to(SPX, SPY + 74, fx, SPY + 74, num(Math.round(d * 100) / 100) + ' m'); op(dimS, P(t, mid('right', 0.24), 0.4, linear));
      sqS.setAttribute('d', `M${f1(fx - 16)},${SPY + 74} L${f1(fx - 16)},${SPY + 58} L${f1(fx)},${SPY + 58}`); op(sqS, P(t, mid('right', 0.36), 0.4, linear));
      attr(raS, 'x', (SPX + fx) / 2); attr(raS, 'y', SPY + 150); op(raS, P(t, mid('right', 0.36), 0.4, linear) * (1 - P(t, at('bigger') - 0.1, 0.3, linear)));
      ringS.upd(t);
      turnS.set(-80, 1.1 * F * d); op(turnS, P(t, mid('right', 0.6), 0.4, linear));
      roS.set(F, d); op(roS, P(t, mid('right', 0.62), 0.4, linear));
      popIn(nmChip, P(t, mid('right', 0.68), 0.5, pop), 950, 672, 0.75);
      op(scaleS, P(t, mid('right', 0.62), 0.4, linear));
      const bc = P(t, at('bigger') + 0.2, 0.5, pop); popIn(bigChip, bc, 720, 230, 0.75); op(bigChip, clamp(bc * 2) * (1 - P(t, mid('bigger', 0.48), 0.3, linear)));
      popIn(farChip, P(t, mid('bigger', 0.58), 0.5, pop), 760, 272, 0.75);
    }

    /* ================= E ================= */
    const aE = Math.min(P(t, at('spanner') - 0.1, 0.45, linear), 1 - P(t, at('door') - 0.3, 0.4, linear));
    op(Eg, aE);
    if (aE > 0) {
      const sOut = 1 - P(t, mid('spanner', 0.56), 0.4, linear);
      ROWS.forEach((r, i) => {
        const pin = P(t, at('spanner') + 0.1 + i * 0.3, 0.5, pop);
        op(r.g, clamp(pin * 2) * sOut);
        const rot = r.d > 0.2 ? 16 * P(t, mid('spanner', 0.22), 1.2) : 1.6 * Math.sin(t * 40) * win(t, mid('spanner', 0.22), mid('spanner', 0.4), 0.15);
        r.sp.set(rot);
        const a = rot * Math.PI / 180, L = r.d * SPM;
        r.push.move(230 + L * Math.cos(a) + 15 * Math.sin(a), r.y + L * Math.sin(a) - 15 * Math.cos(a), 90 + rot); r.push.set(P(t, at('spanner') + 0.5 + i * 0.3, 0.4));
        op(r.ro, P(t, mid('spanner', 0.1) + i * 0.4, 0.4, linear));
        const mk = P(t, mid('spanner', 0.3) + i * 0.3, 0.4, pop); op(r.mark, clamp(mk * 2)); tr(r.mark, 1138, r.y, Math.max(0.01, mk));
        op(r.note, P(t, mid('spanner', 0.32) + i * 0.3, 0.4, linear));
        r.turn.set(-70, r.d > 0.2 ? 72 : 24); op(r.turn, P(t, mid('spanner', 0.1) + i * 0.4, 0.4, linear));
      });
      op(tightLab, P(t, at('spanner') + 0.3, 0.4, linear) * sOut); op(scaleE, P(t, mid('spanner', 0.1), 0.4, linear) * sOut);
      const dp = P(t, mid('spanner', 0.6), 0.5, linear);
      op(fd, dp); tr(fd, 0, (1 - dp) * 16);
      op(fdDim, P(t, mid('spanner', 0.66), 0.4, linear));
    }

    /* ================= F ================= */
    const aF = Math.min(P(t, at('door') - 0.1, 0.45, linear), 1 - P(t, at('levers') - 0.3, 0.4, linear));
    op(Fg, aF);
    if (aF > 0) {
      op(samePush, P(t, at('door') + 0.1, 0.4, linear));
      DOORS.forEach((o, i) => {
        const t0 = mid('door', i ? 0.44 : 0.16);
        const shake = i ? 0 : 0.8 * Math.sin(t * 30) * win(t, t0 + 0.3, t0 + 1.4, 0.2);
        const deg = o.open * P(t, t0 + 0.3, i ? 1.3 : 0.9) + shake;
        o.d.set(deg);
        const pp = doorPush(o.hx, 480, o.s, deg);
        o.push.move(pp[0], pp[1], pp[2]); o.push.set(P(t, t0, 0.35));
        op(o.resT, P(t, t0 + 1.0, 0.4, linear));
        o.turn.set(-6, -Math.max(0, deg - 1)); op(o.turn, P(t, t0 + 0.4, 0.3, linear));
      });
      popIn(hardChip, P(t, mid('door', 0.74), 0.5, pop), 275, 668, 0.75);
    }

    /* ================= G ================= */
    const aG = Math.min(P(t, at('levers') - 0.1, 0.45, linear), 1 - P(t, at('balance') - 0.3, 0.4, linear));
    op(Gg, aG);
    if (aG > 0) {
      op(lvHead, P(t, at('levers') + 0.1, 0.4, linear));
      LV.forEach(o => { const p = P(t, mid('levers', [0.12, 0.36, 0.58][o.i]), 0.5, pop); op(o.g, clamp(p * 2)); tr(o.g, o.x, 400 + (1 - clamp(p)) * 20, Math.max(0.01, 0.9 + 0.1 * p)); });
      const k = clamp(wave(t - mid('levers', 0.12), 2.4, 0.5) * 1.3 - 0.15) * (R ? 0.6 : 1);
      // crowbar: push the long end down about the crate's corner, and the lid lifts
      const ca = -14 * k, cR = ca * Math.PI / 180;
      bar.setAttribute('transform', `translate(-35 -10) rotate(${f1(ca)})`);
      crPush.move(-35 - 118 * Math.cos(cR), -10 - 118 * Math.sin(cR) - 5, 'down'); crPush.set(1);
      lid.setAttribute('transform', `rotate(${f1(-6 * k)} 95 -17)`);
      crRing.upd(t);
      swSee.set(10 * Math.sin(TAU * (t - mid('levers', 0.36)) / 2.4)); swRing.upd(t);
      const wa = 9 * k, wr = wa * Math.PI / 180;
      wbBody.setAttribute('transform', `rotate(${f1(wa)} 64 30)`);
      wbPull.move(64 - 214 * Math.cos(wr) + 64 * Math.sin(wr), 30 - 214 * Math.sin(wr) - 64 * Math.cos(wr), 'up'); wbPull.set(1);
      wbRing.upd(t);
      op(lvKey, P(t, mid('levers', 0.74), 0.4, linear));
    }

    /* ================= H, I, J ================= */
    const aH = P(t, at('balance') - 0.1, 0.45, linear);
    op(H, aH);
    if (aH > 0) {
      ringH.upd(t);
      const tK = at('kids'), tM = at('myth');
      // the beam: tips when one crate lands, levels when the other arrives; in the myth it turns the other way
      const c1 = at('balance') + 0.35, c2 = mid('balance', 0.36);
      let tilt = 0;
      if (t < tK) { const u = t - c2 - 1.05; tilt = -12 * P(t, c1 + 0.2, 0.8) + 12 * P(t, c2 + 0.15, 0.9, easeOut) + (u > 0 ? 1.4 * Math.exp(-4 * u) * Math.sin(u * 12) : 0); }
      else if (t >= tM) tilt = -11 * P(t, mid('myth', 0.36), 1.1);
      see.set(tilt);
      // balance
      const crOut = 1 - P(t, tK - 0.1, 0.4, linear);
      crates.forEach((c, i) => {
        const t0 = i ? c2 : c1, drop = (1 - P(t, t0 - 0.35, 0.35, easeIn)) * 60, q = atS(c.d), ca = tilt * Math.PI / 180;
        tr(c.g, q[0], q[1] - drop, 1, tilt); op(c.g, P(t, t0 - 0.35, 0.2, linear) * crOut);
        crW[i].move(q[0] + 35 * Math.sin(ca), q[1] - drop - 35 * Math.cos(ca), 'down'); crW[i].set(P(t, t0 + 0.1, 0.4)); op(crW[i], P(t, t0, 0.2, linear) * crOut);
      });
      op(fdL, P(t, mid('balance', 0.5), 0.4, linear) * crOut); op(fdR, P(t, mid('balance', 0.66), 0.4, linear) * crOut);
      op(eqBal, P(t, mid('balance', 0.8), 0.4, linear) * crOut);
      turnL.set(-150, -60); tr(turnL, SSX - 225, BTOP - 78); op(turnL, P(t, mid('balance', 0.5), 0.4, linear) * crOut);
      turnR.set(-30, 60); tr(turnR, SSX + 225, BTOP - 78); op(turnR, P(t, mid('balance', 0.66), 0.4, linear) * crOut);
      const bp = P(t, mid('balance', 0.86), 0.5, pop); popIn(balChip, bp, SSX, 652, 0.8); op(balChip, clamp(bp * 2) * crOut);
      // the children
      const kidsOut = 1 - P(t, tM - 0.1, 0.4, linear);
      const kIn = P(t, tK, 0.5, linear) * kidsOut;
      [[kidL, -2, 0.72, wL, 0.47], [kidR, 1, 0.88, wR, 0.72]].forEach(([k, d, s, w, f]) => {
        const q = atS(d); tr(k, q[0], q[1] - 3); op(k, kIn);
        w.move(q[0], q[1] - 3 - 34 * s, 'down'); w.set(P(t, mid('kids', f), 0.5)); op(w, kidsOut);
      });
      [[kLabL, -2, 0.12], [kLabR, 1, 0.28]].forEach(([l, d, f]) => { attr(l, 'x', atS(d)[0]); op(l, P(t, mid('kids', f), 0.4, linear) * kidsOut); });
      op(dL, P(t, mid('kids', 0.55), 0.4, linear) * kidsOut); op(dR, P(t, mid('kids', 0.8), 0.4, linear) * kidsOut);
      op(roL, P(t, mid('kids', 0.6), 0.5, linear) * kidsOut); op(roR, P(t, mid('kids', 0.85), 0.5, linear) * kidsOut);
      op(eqKids, P(t, mid('kids', 0.92), 0.4, linear) * kidsOut);
      const kp = P(t, mid('kids', 0.94), 0.5, pop); popIn(kidsChip, kp, SSX, 236, 0.8); op(kidsChip, clamp(kp * 2) * kidsOut);
      op(scaleH, P(t, mid('kids', 0.45), 0.4, linear));
      // the myth
      const mIn = P(t, tM, 0.4, linear), qL = atS(-2), qR = atS(0.5);
      pL.move(qL[0], qL[1], 'down'); pL.set(P(t, mid('myth', 0.06), 0.4)); op(pL, mIn);
      pR.move(qR[0], qR[1], 'down'); pR.set(P(t, mid('myth', 0.14), 0.4)); op(pR, mIn);
      mdL.to(qL[0], BTOP + 56, SSX, BTOP + 56); op(mdL, P(t, mid('myth', 0.2), 0.4, linear));
      mdR.to(SSX, BTOP + 56, qR[0], BTOP + 56); op(mdR, P(t, mid('myth', 0.24), 0.4, linear));
      attr(mdRL, 'x', qR[0] + 22); op(mdRL, P(t, mid('myth', 0.24), 0.4, linear));
      op(moL, P(t, mid('myth', 0.48), 0.4, linear)); op(moR, P(t, mid('myth', 0.56), 0.4, linear));
      op(gtM, P(t, mid('myth', 0.64), 0.4, linear));
      turnM.set(-55, -70); op(turnM, P(t, mid('myth', 0.4), 0.4, linear));
      popIn(mythChip, P(t, mid('myth', 0.72), 0.5, pop), SSX, 652, 0.8);
    }
  };
});

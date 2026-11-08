/* Chapter 10: Pressure.
   Beats: a narrow and a wide presser under equal pushes (small arrows share each push out over its contact)
   -> "pressure = force ÷ area" -> units: N, m², N/m² = pascals, a 1 m by 1 m square
   -> 100 N on a 2 m² face = 50 N/m² (the block x-rays to show the face it rests on)
   -> the same block tipped onto its 0.5 m² end: 200 N/m², and it sinks deeper
   -> a sharp knife slices a tomato (zoom on its tiny edge; the pressure gauge maxes out; pins and nails)
   -> sharp and blunt knives, same push ("push harder?" struck out) -> boot sinks in snow, snowshoe stays on top
   -> camel on sand vs stiletto on a lawn (showpiece) -> balloon pops on one pin, survives a bed of pins
   -> "Moments multiply, Pressure pares down". */
scene('pressure', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const AREA = C.air, PRES = C.energy, Y = C.energy;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const popIn = (g, t, t0, x, y) => { const p = P(t, t0, 0.5, pop); op(g, clamp(p * 2)); tr(g, x, y, Math.max(0.01, 0.7 + 0.3 * p)); return p; };
  const fadeUp = (g, t, t0, x, y) => { const p = P(t, t0, 0.5, easeOut); op(g, p); tr(g, x, y + (1 - p) * 16); return p; };

  /* A soft ground in cross-section from x1 to x2, its surface at y; o.base(x) gives a curved top, o.under(x) a
     curved bottom (a tomato), o.xs the x positions to sample. o.kind: 'sand' | 'snow' | 'lawn' | 'tomato'.
     g.set(dents): dents [[xa, xb, depth, soft], ...] push the surface down between xa and xb, with soft edges
     (soft x depth wide; 1.3 unless given: small for a narrow hole) and a little raised rim, so things sink in. */
  function ground(parent, x1, x2, y, o) {
    o = o || {};
    const kind = o.kind || 'sand', depth = o.depth || 150, y2 = y + depth, base = o.base || (() => y);
    const K = {
      sand: { top: '#8F7048', bot: '#4F3C25', crust: '#E2C48A', cw: 4, dot: '#BE9A62', dw: 4, dop: 0.55 },
      snow: { top: '#EEF6FB', bot: '#A9C2D4', crust: '#FFFFFF', cw: 5, dot: '#FFFFFF', dw: 3, dop: 0.9 },
      lawn: { top: '#6E4C31', bot: '#3C2918', crust: '#4FA85A', cw: 11, dot: '#93694A', dw: 4, dop: 0.6 },
      tomato: { top: '#FF6A55', bot: '#B3241B', crust: '#8A1A12', cw: 3, dot: '#FF9A8A', dw: 5, dop: 0 },
    }[kind];
    const g = G(parent);
    const body = E('path', { fill: linGrad(K.top, K.bot, true), stroke: kind === 'tomato' ? K.crust : 'none', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    if (K.dop > 0) {
      const rr = rng(o.seed || 7); let dd = '';
      for (let i = 0; i < (o.dots || 36); i++) { const x = x1 + 12 + rr() * (x2 - x1 - 24), y0 = y + (o.clear || 44); dd += `M${x.toFixed(1)},${(y0 + rr() * Math.max(8, y2 - y0 - 12)).toFixed(1)} l0.1,0 `; }
      E('path', { d: dd, stroke: K.dot, 'stroke-width': K.dw, 'stroke-linecap': 'round', opacity: K.dop }, g);
    }
    const crust = E('path', { fill: 'none', stroke: K.crust, 'stroke-width': K.cw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    let blades = null; const bladeX = [];
    if (kind === 'lawn') {
      blades = E('path', { fill: 'none', stroke: '#86D884', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      const br = rng(13); for (let x = x1 + 6; x < x2 - 6; x += 8 + br() * 6) bladeX.push([x, 7 + br() * 8, (br() - 0.5) * 7]);
    }
    const XS = o.xs || (() => { const a = []; for (let x = x1; x < x2; x += 6) a.push(x); a.push(x2); return a; })();
    g.set = dents => {
      dents = (dents || []).filter(q => q[2] > 0.05);
      const f = x => {
        let v = base(x);
        dents.forEach(([a, b, d, sf]) => {
          const w = Math.max(4, d * (sf === undefined ? 1.3 : sf)), dist = x < a ? a - x : x > b ? x - b : 0;
          if (dist === 0) { v += d; return; }
          const u = dist / w; if (u < 1) v += d * (1 - u * u * (3 - 2 * u));
          const r = (u - 0.5) / 1.6; if (r > 0 && r < 1) v -= d * 0.2 * Math.sin(Math.PI * r);
        });
        return v;
      };
      const xs = XS.slice();
      dents.forEach(([a, b, d, sf]) => { const w = Math.max(4, d * (sf === undefined ? 1.3 : sf)); [a - w * 2, a - w * 1.5, a - w, a - w * 0.5, a, (a + b) / 2, b, b + w * 0.5, b + w, b + w * 1.5, b + w * 2].forEach(x => { if (x > x1 && x < x2) xs.push(x); }); });
      xs.sort((p, q) => p - q);
      let top = ''; xs.forEach((x, i) => { top += (i ? 'L' : 'M') + x.toFixed(1) + ',' + f(x).toFixed(1); });
      crust.setAttribute('d', top);
      let bot = '';
      if (o.under) for (let i = XS.length - 1; i >= 0; i--) bot += 'L' + XS[i].toFixed(1) + ',' + o.under(XS[i]).toFixed(1);
      else bot = `L${x2},${y2} L${x1},${y2}`;
      body.setAttribute('d', top + bot + ' Z');
      if (blades) { let bd = ''; bladeX.forEach(([x, h, lean]) => { bd += `M${x.toFixed(1)},${(f(x) - 2).toFixed(1)} l${lean.toFixed(1)},${(-h).toFixed(1)} `; }); blades.setAttribute('d', bd); }
    };
    g.set([]);
    return g;
  }

  /* A stone block whose front face is w x h, in oblique 3D (its depth recedes up and to the right by D).
     g.set(px, py, deg, xray): the front face's bottom-right corner sits at (px, py), the block turned deg degrees
     clockwise about that corner (tipping it onto its right end); xray (0..1) fades the faces to show, in the area
     colour, the face it rests on. Afterwards g.c is the front face's centre (where its weight is drawn from). */
  function cuboid(parent, w, h, o) {
    o = o || {};
    const g = G(parent), D = o.D || [46, -38];
    const K = { front: '#73879C', top: '#AFC0D0', side: '#56697E', edge: '#24323D' };
    const base = E('path', { fill: 'rgba(159,216,255,0.8)', stroke: '#E4F4FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const quads = [0, 1, 2, 3].map(() => E('path', { stroke: K.edge, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g));
    const fg = G(g);
    const front = E('rect', { x: -w, y: -h, width: w, height: h, fill: K.front, stroke: K.edge, 'stroke-width': 3, 'stroke-linejoin': 'round' }, fg);
    const ins = Math.min(10, Math.min(w, h) * 0.2);
    const deco = E('rect', { x: -w + ins, y: -h + ins, width: w - 2 * ins, height: h - 2 * ins, rx: 3, fill: 'none', stroke: '#93A7BA', 'stroke-width': 2 }, fg);
    const P0 = [[-w, 0], [0, 0], [0, -h], [-w, -h]];
    const pd = (A, B) => `M${A[0].toFixed(1)},${A[1].toFixed(1)} L${B[0].toFixed(1)},${B[1].toFixed(1)} L${(B[0] + D[0]).toFixed(1)},${(B[1] + D[1]).toFixed(1)} L${(A[0] + D[0]).toFixed(1)},${(A[1] + D[1]).toFixed(1)} Z`;
    g.set = (px, py, deg, xray) => {
      xray = clamp(xray || 0); deg = deg || 0;
      const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      const q = P0.map(([x, y]) => [px + x * c - y * s, py + x * s + y * c]);
      const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
      let low = 0, lowY = -1e9;
      for (let i = 0; i < 4; i++) {
        const A = q[i], B = q[(i + 1) % 4], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, nx = mx - cx, ny = my - cy;
        quads[i].setAttribute('d', pd(A, B));
        op(quads[i], nx * D[0] + ny * D[1] > 0 ? 1 : 0);
        quads[i].setAttribute('fill', -ny / (Math.hypot(nx, ny) || 1) > 0.5 ? K.top : K.side);
        quads[i].style.fillOpacity = (1 - 0.75 * xray).toFixed(3);
        if (my > lowY + 0.01) { lowY = my; low = i; }
      }
      base.setAttribute('d', pd(q[low], q[(low + 1) % 4]));
      op(base, xray);
      fg.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${deg.toFixed(2)})`);
      front.style.fillOpacity = (1 - 0.75 * xray).toFixed(3);
      op(deco, 1 - xray);
      g.c = [cx, cy];
    };
    g.set(0, 0, 0, 0);
    return g;
  }

  /* pressure gauge: "pressure" then a lib meter bar (its left end at bx) then a word; g.set(v, word) */
  function gauge(parent, bx, y, w) {
    const g = G(parent);
    T(g, bx - 14, y + 22, 'pressure', { size: 26, weight: 600, fill: C.ink, anchor: 'end' });
    const m = meter(g, { w, h: 26, color: PRES }); tr(m, bx, y);
    const val = T(g, bx + w + 16, y + 23, ' ', { size: 30, weight: 700, fill: PRES });
    g.set = (v, word) => { m.set(v); setText(val, word || ' '); };
    return g;
  }
  /* a zoom bubble at (x, y) radius r with a leader to (tx, ty); returns { g, inner } (inner is clipped) */
  let _zc = 0;
  function bubble(parent, x, y, r, tx, ty) {
    const g = G(parent), id = 'pzoom' + (++_zc);
    const a = Math.atan2(ty - y, tx - x);
    E('line', { x1: x + Math.cos(a) * r, y1: y + Math.sin(a) * r, x2: tx, y2: ty, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
    E('circle', { cx: tx, cy: ty, r: 5, fill: C.muted }, g);
    const cp = E('clipPath', { id }, defs()); E('circle', { cx: x, cy: y, r }, cp);
    E('circle', { cx: x, cy: y, r, fill: '#0B2230' }, g);
    const inner = G(g, { 'clip-path': `url(#${id})` });
    const rim = E('circle', { cx: x, cy: y, r, fill: 'none', stroke: '#E4EDF2', 'stroke-width': 8 }, g);
    return { g, inner, rim };
  }
  /* a drawing pin standing on its head, point up; its tip at (0, -40) */
  function drawingPin(parent) {
    const g = G(parent);
    E('path', { d: 'M-2.6,-10 L0,-40 L2.6,-10 Z', fill: '#E6EEF4', stroke: '#7F909E', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -4, y: -13, width: 8, height: 6, rx: 2, fill: '#9DAEBB' }, g);
    E('ellipse', { cx: 0, cy: -4, rx: 17, ry: 5, fill: ball('#E3E9EE', '#7D8C99'), stroke: '#5F6E7B', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a nail, point down; its tip at (0, 0) */
  function nail(parent) {
    const g = G(parent);
    E('path', { d: 'M-4,-74 L4,-74 L4,-12 L0,0 L-4,-12 Z', fill: linGrad('#E3E9EE', '#8597A6'), stroke: '#5F6E7B', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -14, y: -82, width: 28, height: 8, rx: 3, fill: '#B9C6D2', stroke: '#5F6E7B', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a kitchen knife side-on, edge down: the edge's straight part runs along y = 0 from x = -40 to 130 */
  function knife(parent) {
    const g = G(parent);
    E('path', { d: 'M-175,-30 C-128,-4 -70,0 -20,0 L132,0 L132,-60 L-112,-60 C-142,-58 -164,-48 -175,-30 Z', fill: linGrad('#EEF3F7', '#98A8B6', true), stroke: '#66788A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-164,-27 C-122,-8 -70,-6 -20,-6 L130,-6', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.85 }, g);
    E('rect', { x: 130, y: -62, width: 18, height: 64, rx: 4, fill: '#8E9CA9', stroke: '#66788A', 'stroke-width': 2 }, g);
    E('rect', { x: 146, y: -55, width: 150, height: 50, rx: 18, fill: linGrad('#4E3628', '#2A1C14', true), stroke: '#1A110B', 'stroke-width': 2 }, g);
    [184, 232, 272].forEach(x => E('circle', { cx: x, cy: -30, r: 5, fill: '#C9D6DE' }, g));
    return g;
  }
  /* a knife blade seen end-on (its cross-section): a steel wedge, tip at (0, 0). sharp: a fine point;
     blunt: a flat, rounded edge 28 px wide. */
  function wedge(parent, sharp, hgt) {
    const g = G(parent), H2 = hgt || 170;
    const d = sharp ? `M-22,${-H2} L22,${-H2} L1.5,-1 Q0,0 -1.5,-1 Z` : `M-22,${-H2} L22,${-H2} L18,-12 Q16,0 4,0 L-4,0 Q-16,0 -18,-12 Z`;
    E('path', { d, fill: linGrad('#EEF3F7', '#8E9EAC'), stroke: '#66788A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('line', { x1: -8, y1: -H2 + 10, x2: sharp ? -1 : -6, y2: -18, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.6, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* a tomato side-on, sitting on (0, 0); radius r */
  function tomato(parent, r) {
    const g = G(parent);
    E('ellipse', { cx: 0, cy: -r, rx: r * 1.06, ry: r, fill: ball('#FF6A55', '#B3241B'), stroke: '#8A1A12', 'stroke-width': 3 }, g);
    const cal = 'M0,-12 L6,-4 L18,-6 L9,2 L14,12 L0,6 L-14,12 L-9,2 L-18,-6 L-6,-4 Z';
    E('path', { d: cal, fill: '#3E9B4F', stroke: '#2A6E37', 'stroke-width': 2, 'stroke-linejoin': 'round', transform: `translate(0 ${(-2 * r + 6).toFixed(1)})` }, g);
    E('path', { d: `M0,${-2 * r + 2} L2,${-2 * r - 14}`, stroke: '#2A6E37', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -r * 0.42, cy: -r * 1.45, rx: r * 0.22, ry: r * 0.12, fill: '#FFFFFF', opacity: 0.35, transform: `rotate(-30 ${-r * 0.42} ${-r * 1.45})` }, g);
    return g;
  }
  /* a chopping board, top surface at y, from x1 to x2 */
  function board(parent, x1, x2, y) {
    const g = G(parent);
    E('rect', { x: x1, y, width: x2 - x1, height: 26, rx: 8, fill: linGrad(FM.wood[2], FM.wood[0], true), stroke: FM.wood[1], 'stroke-width': 3 }, g);
    E('line', { x1: x1 + 14, x2: x2 - 14, y1: y + 12, y2: y + 12, stroke: FM.wood[1], 'stroke-width': 2, opacity: 0.4 }, g);
    return g;
  }
  /* a balloon held by its knot from above: knot at (0, -ry - 10), round end down at (0, ry) */
  function balloon(parent, rx, ry) {
    const g = G(parent), body = G(g);
    const col = '#FF6F91', dk = '#B8355A';
    E('path', { d: `M0,${-ry} C${rx * 0.55},${-ry} ${rx},${-ry * 0.45} ${rx},${ry * 0.12} C${rx},${ry * 0.7} ${rx * 0.55},${ry} 0,${ry} C${-rx * 0.55},${ry} ${-rx},${ry * 0.7} ${-rx},${ry * 0.12} C${-rx},${-ry * 0.45} ${-rx * 0.55},${-ry} 0,${-ry} Z`, fill: ball(col, dk), stroke: '#FFC2D2', 'stroke-width': 3 }, body);
    E('path', { d: `M-7,${-ry - 10} L7,${-ry - 10} L3,${-ry + 1} L-3,${-ry + 1} Z`, fill: dk, stroke: '#FFC2D2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, body);
    E('ellipse', { cx: -rx * 0.38, cy: -ry * 0.35, rx: rx * 0.16, ry: ry * 0.24, fill: '#FFFFFF', opacity: 0.45, transform: `rotate(28 ${-rx * 0.38} ${-ry * 0.35})` }, body);
    g.body = body;
    return g;
  }
  /* a camel side-on, facing right, feet on (0, 0); g.walk(phase, amount) swings its legs */
  function camel(parent) {
    const g = G(parent), skin = linGrad('#DDB277', '#A8763F', true), line = '#76522D';
    const legs = [];
    const leg = (hx, col) => {
      const lg = G(g); tr(lg, hx, -136);
      E('line', { x1: 0, y1: 0, x2: 3, y2: 64, stroke: col, 'stroke-width': 20, 'stroke-linecap': 'round' }, lg);
      E('line', { x1: 3, y1: 64, x2: 0, y2: 128, stroke: col, 'stroke-width': 13.5, 'stroke-linecap': 'round' }, lg);
      E('circle', { cx: 3, cy: 64, r: 9.5, fill: col }, lg);
      E('ellipse', { cx: 5, cy: 131, rx: 21, ry: 6.5, fill: col, stroke: line, 'stroke-width': 2 }, lg);
      legs.push({ lg, hx });
    };
    leg(-56, '#9B7043'); leg(64, '#9B7043');
    E('path', { d: 'M-120,-160 C-136,-140 -138,-116 -131,-94', fill: 'none', stroke: '#8A6238', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-122,-150 C-126,-190 -100,-210 -70,-212 C-55,-268 30,-272 46,-214 C70,-212 96,-204 108,-186 C116,-170 112,-146 96,-136 C60,-126 -60,-124 -96,-130 C-114,-134 -122,-140 -122,-150 Z', fill: skin, stroke: line, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M92,-196 C118,-206 132,-232 140,-266 L166,-262 C160,-224 142,-182 108,-150 Z', fill: skin, stroke: line, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M134,-270 C136,-292 168,-298 194,-284 C210,-276 216,-262 206,-255 C192,-248 168,-250 154,-252 C142,-254 133,-258 134,-270 Z', fill: skin, stroke: line, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M146,-286 L142,-300 L154,-290 Z', fill: '#B98A52', stroke: line, 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 170, cy: -278, r: 4, fill: '#2B1D14' }, g);
    E('path', { d: 'M200,-262 L206,-262', stroke: line, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    leg(-76, '#C08C52'); leg(84, '#C08C52');
    g.walk = (ph, amt) => legs.forEach((L, i) => { const s = (i % 2 === 0 ? 1 : -1) * (i < 2 ? 1 : -1); L.lg.setAttribute('transform', `translate(${L.hx} -136) rotate(${(s * 20 * amt * Math.sin(ph)).toFixed(1)})`); });
    g.walk(0, 0);
    return g;
  }
  /* a pop: radiating lines, a starburst saying POP!, flying shreds; g.set(u 0..1) */
  function popBurst(parent, col) {
    const g = G(parent), shreds = [];
    const rays = [Y, '#FFFFFF'].map(col => E('path', { fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g));
    let d = ''; for (let i = 0; i < 20; i++) { const a = i / 20 * TAU - Math.PI / 2, r = i % 2 ? 46 : 72; d += (i ? 'L' : 'M') + (Math.cos(a) * r * 1.25).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    const star = G(g);
    E('path', { d: d + 'Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, star);
    T(star, 0, 15, 'POP!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
    const sr = rng(23);
    for (let i = 0; i < 7; i++) shreds.push({ el: E('path', { d: 'M-9,-3 Q0,-9 9,-3 Q2,4 -9,-3 Z', fill: col }, g), a: -Math.PI * 0.9 + sr() * Math.PI * 0.8 + (i % 2 ? Math.PI : 0), v: 90 + sr() * 80, spin: (sr() - 0.5) * 720 });
    g.set = u => {
      u = clamp(u);
      op(g, u > 0 && u < 1 ? 1 : 0);
      const r0 = 40 + 90 * easeOut(u), r1 = r0 + 40 * (1 - u);
      rays.forEach((el, j) => { let d = ''; for (let i = j; i < 12; i += 2) { const a = i / 12 * TAU + 0.13; d += `M${(Math.cos(a) * r0).toFixed(1)},${(Math.sin(a) * r0).toFixed(1)} L${(Math.cos(a) * r1).toFixed(1)},${(Math.sin(a) * r1).toFixed(1)} `; } el.setAttribute('d', d); el.style.opacity = (1 - u).toFixed(3); });
      tr(star, 0, 0, Math.max(0.01, pop(clamp(u * 3)) * (1 - 0.25 * u)));
      star.style.opacity = (1 - P(u, 0.6, 0.4, linear)).toFixed(3);
      shreds.forEach(s => { tr(s.el, Math.cos(s.a) * s.v * u, Math.sin(s.a) * s.v * u + 160 * u * u, 1, s.spin * u); s.el.style.opacity = (1 - u).toFixed(3); });
    };
    g.set(0);
    return g;
  }
  /* a stiletto shoe over a kit person's foot: heel raised h px, the spike down to the ground; origin on the ground.
     g.spike is the spike's path, so it can reach down into a hole. */
  function stiletto(parent, h) {
    const g = G(parent);
    E('path', { d: `M-7,${-h - 4} L6,${-h - 4} L24,-5 Q26,0 20,0 L10,0 Q6,-3 2,${-h + 3} L-7,${-h + 3} Z`, fill: '#C2185B', stroke: '#7A0E39', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    g.spike = E('path', { d: `M-7,${-h + 2} L-2,${-h + 2} L-4.5,0 Z`, fill: '#7A0E39' }, g);
    return g;
  }

  /* ================= the formula row (stays up through the block beats, then becomes a header chip) ================= */
  const FY = 176, FS = 60;
  const formula = G(root);
  const fBox = E('rect', { rx: 42, fill: 'rgba(10,27,39,0.8)', stroke: C.line, 'stroke-width': 3 }, formula);
  const TERMS = [
    { k: 'p', s: 'pressure', fill: PRES }, { k: 'eq', s: '=', fill: C.muted }, { k: 'f', s: 'force', fill: C.ink },
    { k: 'div', s: '÷', fill: PRES }, { k: 'a', s: 'area', fill: AREA },
  ];
  const FGAP = 28;
  TERMS.forEach(m => { m.wd = textWidth(m.s, FS, FD, 700); });
  const FTOT = TERMS.reduce((s, m) => s + m.wd, 0) + FGAP * (TERMS.length - 1);
  { let x = 600 - FTOT / 2; TERMS.forEach(m => { m.x = x + m.wd / 2; x += m.wd + FGAP; m.g = G(formula); tr(m.g, m.x, FY); T(m.g, 0, 0, m.s, { size: FS, weight: 700, fill: m.fill, anchor: 'middle' }); }); }
  const TK = {}; TERMS.forEach(m => { TK[m.k] = m; });
  attr(fBox, 'x', 600 - FTOT / 2 - 36); attr(fBox, 'y', FY - 60); attr(fBox, 'width', FTOT + 72); attr(fBox, 'height', 84);
  const sub = T(root, 600, FY + 56, 'how concentrated a force is on a surface', { size: 32, weight: 600, fill: C.muted, anchor: 'middle' });
  const HS = 0.46, HX = 1166 - (FTOT + 72) * HS / 2, HY = 60;          // the header chip: top right, clear of the tag

  /* ================= what: a narrow and a wide presser, the same push ================= */
  const bW = G(root);
  const sandW = ground(bW, 90, 1110, 560, { kind: 'sand', depth: 150, seed: 3 });
  const PEG = { x: 360, w: 46, h: 126 }, PLK = { x: 800, w: 300, h: 44 };
  const peg = cuboid(bW, PEG.w, PEG.h), plank = cuboid(bW, PLK.w, PLK.h);
  const BIG = 130, NPEG = 2, NPLK = 6, DPEG = 26, DPLK = 4;
  const pushes = [0, 1].map(() => fmArrow(bW, 'push', 0, 0, BIG, 'down', { scale: 1, tip: true, value: false }));
  const strips = [0, 1].map(() => E('line', { stroke: AREA, 'stroke-width': 8, 'stroke-linecap': 'round' }, bW));
  const smallPeg = [], smallPlk = [];
  for (let i = 0; i < NPEG; i++) smallPeg.push(fmArrow(bW, 'push', 0, 0, BIG / NPEG, 'down', { scale: 1, width: 6, label: '', value: false }));
  for (let i = 0; i < NPLK; i++) smallPlk.push(fmArrow(bW, 'push', 0, 0, BIG / NPLK, 'down', { scale: 1, width: 6, label: '', value: false }));
  const labPeg = T(bW, PEG.x, 690, 'concentrated', { size: 30, weight: 700, anchor: 'middle' });
  const labPlk = T(bW, PLK.x, 650, 'spread out', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= units ================= */
  const bU = G(root);
  const unitChips = [['p', 'N/m²', PRES], ['f', 'N', C.ink], ['a', 'm²', AREA]].map(([k, s, col]) => ({ c: chip(bU, s, { size: 30, fill: C.card2, stroke: col, sw: 2.5, color: col }), x: TK[k].x }));
  const sq = G(bU);
  E('rect', { x: 200, y: 330, width: 210, height: 210, rx: 4, fill: 'rgba(159,216,255,0.16)', stroke: AREA, 'stroke-width': 4 }, sq);
  T(sq, 305, 450, '1 m²', { size: 46, weight: 700, fill: AREA, anchor: 'middle' });
  fmDim(sq, 200, 568, 410, 568, '1 m');
  fmDim(sq, 172, 330, 172, 540, '1 m', { side: 'left' });
  T(sq, 305, 660, 'one square metre', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
  const uR1 = G(bU), uR2 = G(bU);
  T(uR1, 0, 0, 'newtons per square metre', { size: 38, weight: 700, anchor: 'middle' });
  T(uR1, 0, 70, 'N/m²', { size: 66, weight: 700, fill: PRES, anchor: 'middle' });
  chip(uR2, 'also called pascals (Pa)', { size: 34, fill: C.card2, stroke: PRES, sw: 3, color: PRES });

  /* ================= example and same: a 100 N block on a 2 m² face, then on its 0.5 m² end ================= */
  const bE = G(root);
  const SY = 520, BX = 500;                      // sand surface; the lying block's bottom-right corner
  const sandE = ground(bE, 70, 720, SY, { kind: 'sand', depth: 192, seed: 5 });
  const block = cuboid(bE, 240, 60);
  const SC = 1.6;                                // px per newton for the block's weight
  const wArrow = fmArrow(bE, 'weight', 0, 0, 100, 'down', { scale: SC, labelAt: 'tip' });
  const sbar = fmScaleBar(bE, 770, 692, 50, { scale: SC });
  const nums = G(bE), NY = FY + 76;
  const nP = T(nums, TK.p.x, NY, ' ', { size: 46, weight: 700, fill: PRES, anchor: 'middle' });
  const nEq = T(nums, TK.eq.x, NY, '=', { size: 46, weight: 600, fill: C.muted, anchor: 'middle' });
  const nF = T(nums, TK.f.x, NY, '100 N', { size: 46, weight: 700, fill: C.glucose, anchor: 'middle' });
  const nDiv = T(nums, TK.div.x, NY, '÷', { size: 46, weight: 700, fill: PRES, anchor: 'middle' });
  const nA = T(nums, TK.a.x, NY, ' ', { size: 46, weight: 700, fill: AREA, anchor: 'middle' });
  const cards = [[['smaller area', AREA, 800]], [['→ bigger pressure', PRES, 800]], [['larger area', AREA, 800]], [['→ smaller pressure', PRES, 800]]];
  const cmp = [0, 1].map(i => {
    const g = G(bE);
    card(g, 0, 0, 380, 112, { fill: C.card, stroke: C.line });
    rich(g, 28, 46, cards[i * 2], { size: 32 });
    rich(g, 28, 90, cards[i * 2 + 1], { size: 32 });
    return g;
  });

  /* ================= sharp: a knife slices a tomato ================= */
  const bS = G(root);
  const BRD = 590, TOMR = 84, TOMX = 360, TTOP = BRD - 2 * TOMR;
  board(bS, 130, 640, BRD);
  tomato(bS, TOMR); tr(bS.lastChild, TOMX, BRD);
  const kcp = E('clipPath', { id: 'pknife' }, defs());          // the blade vanishes into the tomato as it cuts
  E('path', { d: `M0,0 H1200 V750 H0 Z M${TOMX - TOMR * 1.06},${BRD - TOMR} a${TOMR * 1.06},${TOMR} 0 1 0 ${2 * TOMR * 1.06},0 a${TOMR * 1.06},${TOMR} 0 1 0 ${-2 * TOMR * 1.06},0 Z`, 'clip-rule': 'evenodd' }, kcp);
  const kWrap = G(bS, { 'clip-path': 'url(#pknife)' });
  const kn = knife(kWrap);
  const kPush = fmArrow(bS, 'push', 0, 0, 110, 'down', { scale: 1, tip: true, value: false });
  const juice = [0, 1, 2].map(() => E('path', { d: 'M0,-8 C4,-2 6,2 6,5 A6,6 0 0 1 -6,5 C-6,2 -4,-2 0,-8 Z', fill: '#FF5A4E' }, bS));
  const ZX = 840, ZY = 270, ZR = 104;
  const zb = bubble(bS, ZX, ZY, ZR, TOMX, TTOP);
  E('circle', { cx: ZX, cy: ZY + ZR + 560, r: 600, fill: ball('#FF6A55', '#B3241B') }, zb.inner);
  tr(wedge(zb.inner, true, 200), ZX, ZY + 40);
  const zDot = E('circle', { cx: ZX, cy: ZY + 40, r: 7, fill: AREA, stroke: '#FFFFFF', 'stroke-width': 2 }, zb.inner);
  const zLab = T(bS, ZX, ZY + ZR + 46, 'tiny area', { size: 32, weight: 700, fill: AREA, anchor: 'middle' });
  const gS = gauge(bS, 830, 476, 190);
  const icons = [0, 1].map(i => {
    const g = G(bS), art = G(g); tr(art, 0, 0, 1.45);
    if (i === 0) { drawingPin(art); E('circle', { cx: 0, cy: -40, r: 6, fill: glow(AREA) }, art); }
    else { tr(nail(art), 0, 0); E('circle', { cx: 0, cy: 0, r: 7, fill: glow(AREA) }, art); }
    T(g, 0, 44, i ? 'nails' : 'pins', { size: 28, weight: 600, fill: C.ink, anchor: 'middle' });
    return g;
  });
  const ICX = [880, 1020], ICY = 640;

  /* ================= myth: sharp and blunt, the same push ================= */
  const bM = G(root);
  const harder = G(bM);
  const hc = chip(harder, 'push harder?', { size: 34, fill: C.card2, stroke: C.line, sw: 2 });
  const hx = cross(harder, 13); tr(hx, -hc.w / 2 - 30, 0);
  const hs = strike(harder, -hc.w / 2 + 14, 0, hc.w / 2 - 14, C.bad);
  const mNote = rich(bM, 600, 160, [['same force', C.good, 800], ' on a ', ['smaller area', AREA, 800], ' → ', ['much higher pressure', PRES, 800]], { size: 32, anchor: 'middle' });
  const MX = [300, 860], MR = 92, MTB = 668, MCY = MTB - MR, MTOP = MCY - MR, WH = 120, MPL = 80;
  board(bM, 110, 1090, MTB);
  const circXs = cx => { const a = []; for (let i = 0; i <= 48; i++) a.push(cx - MR * Math.cos(i / 48 * Math.PI)); return a; };
  const toms = MX.map((x, i) => ground(bM, x - MR, x + MR, MCY, {
    kind: 'tomato', depth: MR, xs: circXs(x),
    base: xx => MCY - Math.sqrt(Math.max(0, MR * MR - (xx - x) * (xx - x))), under: xx => MCY + Math.sqrt(Math.max(0, MR * MR - (xx - x) * (xx - x))),
  }));
  MX.forEach(x => {
    E('ellipse', { cx: x + MR * 0.36, cy: MCY - MR * 0.1, rx: MR * 0.2, ry: MR * 0.12, fill: '#FFFFFF', opacity: 0.3, transform: `rotate(-60 ${x + MR * 0.36} ${MCY - MR * 0.1})` }, bM);
    E('path', { d: 'M0,-12 L6,-4 L18,-6 L9,2 L14,12 L0,6 L-14,12 L-9,2 L-18,-6 L-6,-4 Z', fill: '#3E9B4F', stroke: '#2A6E37', 'stroke-width': 2, 'stroke-linejoin': 'round', transform: `translate(${x - MR * 0.5} ${MCY - MR * 0.62}) rotate(-35) scale(1.1)` }, bM);
    E('path', { d: `M${x - MR * 0.5},${MCY - MR * 0.62} l-9,-12`, stroke: '#2A6E37', 'stroke-width': 5, 'stroke-linecap': 'round' }, bM);
  });
  const wcp = E('clipPath', { id: 'pwedge' }, defs());          // the sharp blade vanishes into the tomato it cuts
  E('path', { d: `M0,0 H1200 V${MTOP + 1} H0 Z` }, wcp);
  const slit = E('line', { stroke: '#6E140E', 'stroke-width': 3, 'stroke-linecap': 'round' }, bM);
  const wedges = MX.map((x, i) => wedge(i === 0 ? G(bM, { 'clip-path': 'url(#pwedge)' }) : bM, i === 0, WH));
  const mPush = MX.map(() => fmArrow(bM, 'push', 0, 0, MPL, 'down', { scale: 1, tip: true, value: false }));
  const mTitle = MX.map((x, i) => T(bM, x, 226, i ? 'blunt knife' : 'sharp knife', { size: 34, weight: 700, anchor: 'middle' }));
  const mGauge = MX.map(x => gauge(bM, x - 86, 250, 170));
  const mArea = E('line', { stroke: AREA, 'stroke-width': 8, 'stroke-linecap': 'round' }, bM);
  const sameF = G(bM);
  T(sameF, 580, 356, 'same', { size: 30, weight: 700, fill: C.good, anchor: 'middle' });
  T(sameF, 580, 390, 'push', { size: 30, weight: 700, fill: C.good, anchor: 'middle' });

  /* ================= wide: boot vs snowshoe ================= */
  const bD = G(root);
  const SNOW = 600, PS = 1.15;
  const snow = ground(bD, 60, 1140, SNOW, { kind: 'snow', depth: 112, seed: 41, dots: 30 });
  const WX = [260, 650];
  const walkers = WX.map((x, i) => {
    const g = G(bD), inner = G(g); tr(inner, 0, 0, PS);
    if (i === 1) {
      E('ellipse', { cx: 7, cy: 3, rx: 68, ry: 8, fill: '#2C4A5E', stroke: '#9FD8FF', 'stroke-width': 3 }, inner);
      E('path', { d: [-3, -2, -1, 0, 1, 2, 3].map(k => `M${7 + k * 16},-3 L${7 + k * 16},9`).join(' '), stroke: '#9FD8FF', 'stroke-width': 2, opacity: 0.7 }, inner);
    }
    const p = person(inner, { shirt: '#E8424F', shorts: '#2C3E57', shoes: '#5A3A22', hair: '#3B2416', skin: '#D9A47A' });
    tr(p, 0, i === 1 ? -5 : 0);
    E('path', { d: 'M-21,-180 Q-20,-206 2,-207 Q22,-206 21,-180 Z', fill: '#5B8DEF', stroke: '#3A62B8', 'stroke-width': 2 }, p);   // woolly hat
    E('circle', { cx: 1, cy: -210, r: 7, fill: '#FFFFFF' }, p);
    return g;
  });
  const wArrows = WX.map(() => fmArrow(bD, 'weight', 0, 0, 100, 'down', { scale: 1, value: false, side: 'left', nudge: [-6, -22] }));
  const wTitle = WX.map((x, i) => T(bD, x, 262, i ? 'snowshoes' : 'boots', { size: 34, weight: 700, anchor: 'middle' }));
  const wGauge = WX.map(x => gauge(bD, x - 46, 290, 130));
  const wIcons = [0, 1].map(i => {
    const g = G(bD);
    card(g, -110, -70, 220, 150, { fill: C.card, stroke: C.line });
    if (i === 0) {
      E('path', { d: 'M-88,4 L70,4 Q92,4 92,-12 Q88,-4 70,-4 L-88,-4 Z', fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 2 }, g);
      E('path', { d: 'M-88,24 L70,24 Q92,24 92,8 Q88,16 70,16 L-88,16 Z', fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 2 }, g);
      E('rect', { x: -16, y: -20, width: 32, height: 16, rx: 4, fill: '#3A4651' }, g);
    } else {
      E('circle', { cx: 0, cy: -6, r: 46, fill: '#1C2329', stroke: '#3A4651', 'stroke-width': 3 }, g);
      let td = ''; for (let k = 0; k < 14; k++) { const a = k / 14 * TAU, c = Math.cos(a), sn = Math.sin(a), q = (u, v) => `${(u * c - v * sn).toFixed(1)},${(-6 + u * sn + v * c).toFixed(1)}`; td += `M${q(-6, -48)} L${q(6, -48)} L${q(6, -36)} L${q(-6, -36)} Z `; }
      E('path', { d: td, fill: '#2A333B' }, g);
      E('circle', { cx: 0, cy: -6, r: 21, fill: '#E3B43C', stroke: '#9C7A1E', 'stroke-width': 3 }, g);
    }
    T(g, 0, 64, i ? 'tractor tyres' : 'skis', { size: 28, weight: 600, fill: C.ink, anchor: 'middle' });
    return g;
  });
  const WIX = 1000, WIY = [252, 446];
  const wNote = rich(bD, 520, 160, [['large area', AREA, 800], ' spreads the force → ', ['small pressure', PRES, 800]], { size: 32, anchor: 'middle' });

  /* ================= camel vs stiletto (showpiece) ================= */
  const bC = G(root);
  const GY = 610;
  const sandC = ground(bC, 60, 580, GY, { kind: 'sand', depth: 102, seed: 51, dots: 24, clear: 30 });
  const lawn = ground(bC, 620, 1140, GY, { kind: 'lawn', depth: 102, seed: 52, dots: 18, clear: 34 });
  const CAMX = 270, cam = camel(bC);
  const HEEL = 12, LADX = 850, LS = 1.15;
  const lady = G(bC), ladyIn = G(lady); tr(ladyIn, 0, 0, LS);
  const lp = person(ladyIn, { shirt: '#B44FD6', shorts: '#B44FD6', shoes: '#C2185B', hair: '#2B1D14', skin: '#C98E62' });
  tr(lp, 0, -HEEL - 4);
  E('path', { d: 'M-19,-182 Q-34,-150 -26,-128 Q-20,-140 -18,-160 Z', fill: '#2B1D14' }, lp);   // long hair
  const sh = stiletto(ladyIn, HEEL);
  const camArrow = fmArrow(bC, 'weight', 0, 0, 216, 'down', { scale: 1, value: false, labelAt: 'tip' });
  const ladArrow = fmArrow(bC, 'weight', 0, 0, 27, 'down', { scale: 1, value: false, side: 'left' });
  const cGauge = [gauge(bC, 236, 262, 170), gauge(bC, 796, 262, 170)];
  const cTitle = [T(bC, 300, 214, 'camel', { size: 34, weight: 700, anchor: 'middle' }), T(bC, 860, 214, 'stiletto heel', { size: 34, weight: 700, anchor: 'middle' })];
  const feetLab = labelLine(bC, 396, 548, CAMX + 89, GY - 3, 'wide, flat feet', { size: 26, anchor: 'start', fill: AREA, line: AREA });
  // zoom on the heel
  const HZX = 1030, HZY = 440, HZR = 86, HM = 2.6;
  const hz = bubble(bC, HZX, HZY, HZR, LADX - 4 * LS, GY - 2);
  const HZS = HZY - 4;                                          // the lawn's surface inside the bubble
  const hzSoil = ground(hz.inner, HZX - HZR, HZX + HZR, HZS, { kind: 'lawn', depth: HZR + 10, seed: 57, dots: 8, clear: 30 });
  const hzHeel = G(hz.inner);
  E('path', { d: `M-60,${-HM * (HEEL + 4)} L${HM * 6},${-HM * (HEEL + 4)} L${HM * 24},-2 L${HM * 10},-2 Q${HM * 6},-8 ${HM * 2},${-HM * (HEEL - 3)} L-60,${-HM * (HEEL - 3)} Z`, fill: '#C2185B', stroke: '#7A0E39', 'stroke-width': 3, 'stroke-linejoin': 'round' }, hzHeel);
  const hzSpike = E('path', { fill: '#7A0E39' }, hzHeel);
  const hzLab = T(bC, HZX, HZY + HZR + 40, 'tiny heel', { size: 28, weight: 700, fill: AREA, anchor: 'middle' });

  /* ================= pin: one pin vs a bed of pins ================= */
  const bP = G(root);
  const adult = chip(bP, 'Try it, with an adult’s help', { size: 30, fill: C.card2, stroke: Y, sw: 2.5, color: Y });
  const PX = [330, 840], BOARD = 640, TIPY = BOARD - 40;
  board(bP, 190, 470, BOARD); board(bP, 620, 1060, BOARD);
  tr(drawingPin(bP), PX[0], BOARD);
  { let nd = '', cd = '', hd = '';                               // the bed of pins, drawn as three paths
    for (let k = 0; k < 14; k++) { const x = 658 + k * 28; nd += `M${x - 2.6},${BOARD - 10} L${x},${BOARD - 40} L${x + 2.6},${BOARD - 10} Z `; cd += `M${x - 4},${BOARD - 13} h8 v6 h-8 Z `; hd += `M${x - 17},${BOARD - 4} a17,5 0 1 0 34,0 a17,5 0 1 0 -34,0 Z `; }
    E('path', { d: hd, fill: '#C3CED8', stroke: '#5F6E7B', 'stroke-width': 1.5 }, bP);
    E('path', { d: cd, fill: '#9DAEBB' }, bP);
    E('path', { d: nd, fill: '#E6EEF4', stroke: '#7F909E', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, bP); }
  const BRX = 76, BRY = 92;
  const scraps = G(bP);
  E('path', { d: [[-70, -3, 0.3], [-40, -2, -0.5], [52, -3, 0.7], [84, -2, -0.2]].map(([dx, dy, r]) => { const x = PX[0] + dx, y = BOARD + dy, c = Math.cos(r), sn = Math.sin(r), q = (u, v) => `${(x + u * c - v * sn).toFixed(1)},${(y + u * sn + v * c).toFixed(1)}`; return `M${q(-10, -2)} Q${q(0, -8)} ${q(10, -2)} Q${q(2, 3)} ${q(-10, -2)} Z`; }).join(' '), fill: '#FF6F91' }, scraps);
  const balls = PX.map(() => balloon(bP, BRX, BRY));
  const bPush = PX.map(() => fmArrow(bP, 'push', 0, 0, 100, 'down', { scale: 1, tip: true, value: false, label: 'gentle push', side: 'right' }));
  const burst = popBurst(bP, '#FF6F91'); tr(burst, PX[0], TIPY - 40);
  const pLab = [T(bP, PX[0], 706, 'one pin', { size: 30, weight: 700, anchor: 'middle' }), T(bP, PX[1], 706, 'lots of pins', { size: 30, weight: 700, anchor: 'middle' })];
  const badG = G(bP); tr(cross(badG, 14), -54, -10); T(badG, -28, 2, 'pops!', { size: 34, weight: 700, fill: C.bad });
  const okG = G(bP); tr(tick(okG, 15), -56, -10); T(okG, -28, 2, 'survives', { size: 34, weight: 700, fill: C.good });

  /* ================= pares: the mnemonic card ================= */
  const bF = G(root);
  card(bF, 90, 140, 1020, 520, { fill: C.card, stroke: C.line });
  E('line', { x1: 600, y1: 176, x2: 600, y2: 624, stroke: C.line, 'stroke-width': 3 }, bF);
  const fL = G(bF), fR = G(bF);
  rich(fL, 345, 228, [['M', Y, 800], 'oments ', ['m', Y, 800], 'ultiply'], { size: 46, weight: 700, anchor: 'middle' });
  rich(fR, 855, 228, [['P', Y, 800], 'ressure ', ['p', Y, 800], 'ares down'], { size: 46, weight: 700, anchor: 'middle' });
  const lArt = G(fL);
  const ssw = fmSeesaw(lArt, { len: 380, pxPerM: 60, pivotH: 60, thick: 14 }); tr(ssw, 345, 470);
  const ssEnd = 345 + 180;
  fmArrow(lArt, 'push', ssEnd, 470 - 14, 80, 'down', { scale: 1, tip: true, value: false, label: 'force', side: 'left' });
  fmDim(lArt, 345, 470 + 24, ssEnd, 470 + 24, '');
  T(lArt, 470, 470 + 66, 'distance', { size: 28, weight: 700, anchor: 'middle' });
  const rArt = G(fR);
  const sandF = ground(rArt, 700, 1010, 476, { kind: 'sand', depth: 100, seed: 61, dots: 14, clear: 34 });
  sandF.set([[735, 975, 3]]);
  cuboid(rArt, 240, 34, { D: [30, -24] }).set(975, 479, 0, 0);
  fmArrow(rArt, 'push', 855 + 15, 479 - 34 - 12, 90, 'down', { scale: 1, tip: true, value: false, label: 'force', side: 'right' });
  E('line', { x1: 739, x2: 971, y1: 480, y2: 480, stroke: AREA, 'stroke-width': 7, 'stroke-linecap': 'round' }, rArt);
  for (let k = 0; k < 5; k++) fmArrow(rArt, 'push', 759 + k * 48, 484, 18, 'down', { scale: 1, width: 5, label: '', value: false });
  T(rArt, 855, 560, 'area', { size: 28, weight: 700, fill: AREA, anchor: 'middle' });
  const fLF = rich(fL, 345, 612, [['force ', C.ink], ['×', Y, 800], [' distance', C.ink]], { size: 40, weight: 700, anchor: 'middle' });
  const fRF = rich(fR, 855, 612, [['force ', C.ink], ['÷', Y, 800], [' area', AREA]], { size: 40, weight: 700, anchor: 'middle' });

  /* ================= update ================= */
  const beat = (t, a, b) => win(t, a, b, 0.4);
  return t => {
    const tU = at('units') - 0.1, tE = at('example') - 0.15, tS = at('sharp') - 0.15, tM = at('myth') - 0.15;
    const tD = at('wide') - 0.15, tC = at('camel') - 0.15, tP = at('pin') - 0.15, tF = at('pares') - 0.15;

    /* --- the formula row: a heading, then the formula, then a header chip --- */
    const fOut = 1 - P(t, tF, 0.4, linear);
    op(formula, fOut);
    if (fOut > 0) {
      const mv = P(t, at('formula') - 0.1, 0.7), hd = P(t, tS - 0.1, 0.8), hp = P(t, at('what') + 0.05, 0.6, pop);
      const pf = Math.sin(Math.PI * P(t, mid('formula', 0.34), 0.6, linear)), pa = Math.sin(Math.PI * P(t, mid('formula', 0.72), 0.6, linear));
      TERMS.forEach(m => {
        if (m.k === 'p') { op(m.g, clamp(hp * 2)); tr(m.g, lerp(600, m.x, mv), FY, Math.max(0.01, lerp(1.12, 1, mv) * (0.75 + 0.25 * hp))); return; }
        const p = P(t, mid('formula', { eq: 0.08, f: 0.28, div: 0.5, a: 0.66 }[m.k]), 0.45, pop);
        const pulse = m.k === 'f' ? 0.14 * pf : m.k === 'a' ? 0.14 * pa : 0;
        op(m.g, clamp(p * 2)); tr(m.g, m.x, FY + (1 - clamp(p)) * 14, Math.max(0.01, 0.7 + 0.3 * p + pulse));
      });
      op(fBox, hd);
      const s = lerp(1, HS, hd), x = lerp(600, HX, hd), y = lerp(FY - 18, HY, hd);
      formula.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(4)}) translate(-600 ${-(FY - 18)})`);
    }
    op(sub, P(t, mid('what', 0.3), 0.5, linear) * (1 - P(t, at('formula') - 0.2, 0.35, linear)));

    /* --- what --- */
    const aW = 1 - P(t, tU, 0.4, linear);
    op(bW, aW);
    if (aW > 0) {
      const t0 = at('what'), sk = P(t, t0 + 0.7, 1.0), dPeg = DPEG * sk, dPlk = DPLK * sk;
      sandW.set([[PEG.x - PEG.w / 2, PEG.x + PEG.w / 2, dPeg], [PLK.x - PLK.w / 2, PLK.x + PLK.w / 2, dPlk]]);
      peg.set(PEG.x + PEG.w / 2, 560 + dPeg, 0, 0); plank.set(PLK.x + PLK.w / 2, 560 + dPlk, 0, 0);
      const ap = P(t, t0 + 0.2, 0.6);
      pushes[0].move(PEG.x + 23, 560 + dPeg - PEG.h - 19); pushes[1].move(PLK.x + 23, 560 + dPlk - PLK.h - 19);
      pushes.forEach(a => a.set(ap));
      const sp = P(t, t0 + 0.8, 0.4, linear), pa = Math.sin(Math.PI * P(t, mid('formula', 0.72), 0.6, linear));
      [[PEG, dPeg], [PLK, dPlk]].forEach(([B, d], i) => {
        const s = strips[i];
        attr(s, 'x1', B.x - B.w / 2 + 4); attr(s, 'x2', B.x + B.w / 2 - 4); attr(s, 'y1', 560 + d); attr(s, 'y2', 560 + d);
        op(s, sp); s.setAttribute('stroke-width', (8 + 6 * pa).toFixed(1));
      });
      smallPeg.forEach((a, i) => { a.move(PEG.x - 11 + i * 22, 562 + dPeg); a.set(P(t, t0 + 1.1, 0.6)); });
      smallPlk.forEach((a, i) => { a.move(PLK.x - 125 + i * 50, 562 + dPlk); a.set(P(t, t0 + 1.4, 0.6)); });
      op(labPeg, P(t, mid('what', 0.5), 0.4, linear)); op(labPlk, P(t, mid('what', 0.68), 0.4, linear));
    }

    /* --- units --- */
    const aU = beat(t, tU, tE);
    op(bU, aU);
    if (aU > 0) {
      unitChips.forEach((u, i) => popIn(u.c, t, mid('units', [0.56, 0.06, 0.26][i]), u.x, FY + 70));
      fadeUp(sq, t, mid('units', 0.24), 0, 0);
      fadeUp(uR1, t, mid('units', 0.55), 830, 390);
      popIn(uR2, t, mid('units', 0.82), 830, 560);
    }

    /* --- example and same --- */
    const aE = beat(t, tE, tS);
    op(bE, aE);
    if (aE > 0) {
      const drop = P(t, tE, 0.6, easeIn), tip = P(t, at('same') - 0.2, 1.4);
      const s1 = 6 * P(t, tE + 0.6, 0.8), s2 = 24 * P(t, at('same') + 1.3, 1.0);
      const sink = tip >= 1 ? Math.max(s1, s2) : s1 * (1 - tip);
      const xray = Math.max(win(t, mid('example', 0.28), mid('example', 0.72), 0.3), win(t, mid('same', 0.42), mid('same', 0.66), 0.3));
      block.set(BX, SY + sink - (1 - drop) * 60, 90 * tip, xray);
      op(block, clamp(drop * 3));
      sandE.set(tip > 0 && tip < 1 ? [] : [tip < 0.5 ? [BX - 240, BX, sink] : [BX, BX + 60, sink]]);
      wArrow.move(block.c[0], block.c[1]); wArrow.set(P(t, mid('example', 0.08), 0.6));
      op(sbar, P(t, mid('example', 0.1), 0.5, linear));
      // the number row under the formula
      const pF = P(t, mid('example', 0.12), 0.45, pop), pA = P(t, mid('example', 0.3), 0.45, pop), pO = P(t, mid('example', 0.5), 0.4, linear), pP = P(t, mid('example', 0.78), 0.5, pop);
      op(nF, clamp(pF * 2)); tr(nF, 0, (1 - clamp(pF)) * 12);
      op(nEq, pO); op(nDiv, pO);
      const isA = t >= at('same') + 1.1, isP = t >= at('same') + 1.5;
      setText(nA, isA ? '0.5 m²' : '2 m²'); setText(nP, isP ? '200 N/m²' : '50 N/m²');
      const swA = P(t, at('same') + 1.1, 0.45, pop), swP = P(t, at('same') + 1.5, 0.5, pop);
      op(nA, clamp(pA * 2));
      nA.setAttribute('transform', `translate(${TK.a.x} ${NY}) scale(${(isA ? 0.75 + 0.25 * swA : 1).toFixed(3)}) translate(${-TK.a.x} ${-NY})`);
      op(nP, clamp(pP * 2));
      const sP = isP ? 0.7 + 0.3 * swP + 0.12 * Math.sin(Math.PI * P(t, at('same') + 1.5, 0.7, linear)) : 0.7 + 0.3 * pP;
      nP.setAttribute('transform', `translate(${TK.p.x} ${NY}) scale(${Math.max(0.01, sP).toFixed(3)}) translate(${-TK.p.x} ${-NY})`);
      cmp.forEach((g, i) => fadeUp(g, t, mid('same', i ? 0.66 : 0.4), 770, i ? 470 : 330));
    }

    /* --- sharp --- */
    const aS = beat(t, tS, tM);
    op(bS, aS);
    if (aS > 0) {
      const down = P(t, tS + 0.1, 0.9, easeOut), cut = P(t, mid('sharp', 0.42), 1.6);
      const ey = lerp(TTOP - 70, TTOP, down) + 70 * cut;
      tr(kn, TOMX - 30, ey);
      kPush.move(TOMX - 10, ey - 62); kPush.set(P(t, tS + 0.1, 0.6));
      juice.forEach((j, k) => { const u = ((t - mid('sharp', 0.55)) / 1.4 + k / 3) % 1, on = t > mid('sharp', 0.55) ? 1 : 0; tr(j, TOMX - 70 + k * 60, TTOP + 40 + u * 110); op(j, on * Math.min(1, u * 6, (1 - u) * 4)); });
      op(zb.g, P(t, mid('sharp', 0.12), 0.5, linear));
      op(zLab, P(t, mid('sharp', 0.5), 0.4, linear));
      zDot.setAttribute('r', (6 + 3 * wave(t, 1.1)).toFixed(2));
      gS.set(P(t, mid('sharp', 0.6), 1.0, easeOut), t > mid('sharp', 0.72) ? 'huge!' : ' ');
      op(gS, P(t, mid('sharp', 0.5), 0.4, linear));
      icons.forEach((g, i) => popIn(g, t, mid('sharp', 0.26 + i * 0.08), ICX[i], ICY));
    }

    /* --- myth --- */
    const aM = beat(t, tM, tD);
    op(bM, aM);
    if (aM > 0) {
      const off = P(t, mid('myth', 0.52), 0.4, linear);
      popIn(harder, t, mid('myth', 0.02), 600, 160); op(harder, Math.min(clamp(P(t, mid('myth', 0.02), 0.5, pop) * 2), 1 - off));
      hs.set(P(t, mid('myth', 0.3), 0.5, easeOut)); op(hx, P(t, mid('myth', 0.3), 0.3, linear));
      op(mNote, P(t, mid('myth', 0.6), 0.5, linear));
      const press = P(t, mid('myth', 0.45), 1.6);
      MX.forEach((x, i) => {
        const pen = i === 0 ? 40 * press : 8 * press, y = MTOP + pen;
        tr(wedges[i], x, y);
        toms[i].set(i === 0 ? [[x - 2, x + 2, Math.min(pen, 6)]] : [[x - 14, x + 14, pen]]);
        mPush[i].move(x, y - WH); mPush[i].set(P(t, tM + 0.15, 0.6));
        op(mTitle[i], P(t, tM + 0.1, 0.4, linear));
        mGauge[i].set((i === 0 ? 0.97 : 0.22) * press, press > 0.95 ? (i === 0 ? 'very high' : 'low') : ' ');
        op(mGauge[i], P(t, mid('myth', 0.45), 0.4, linear));
      });
      attr(slit, 'x1', MX[0]); attr(slit, 'x2', MX[0]); attr(slit, 'y1', MTOP + 2); attr(slit, 'y2', MTOP + 40 * press + 8); op(slit, press > 0.05 ? 1 : 0);
      attr(mArea, 'x1', MX[1] - 12); attr(mArea, 'x2', MX[1] + 12); attr(mArea, 'y1', MTOP + 8 * press + 1); attr(mArea, 'y2', MTOP + 8 * press + 1);
      op(mArea, P(t, mid('myth', 0.66), 0.4, linear));
      op(sameF, P(t, mid('myth', 0.52), 0.4, linear));
    }

    /* --- wide --- */
    const aD = beat(t, tD, tC);
    op(bD, aD);
    if (aD > 0) {
      const sinkB = 40 * P(t, mid('wide', 0.08), 1.8), sinkS = 4 * P(t, mid('wide', 0.08), 1.0);
      snow.set([[WX[0] - 6 * PS, WX[0] + 20 * PS, sinkB], [WX[1] + (7 - 68) * PS, WX[1] + (7 + 68) * PS, sinkS]]);
      walkers.forEach((g, i) => tr(g, WX[i], SNOW + (i ? sinkS : sinkB)));
      wArrows.forEach((a, i) => { a.move(WX[i], SNOW + (i ? sinkS : sinkB) - 96 * PS); a.set(P(t, tD + 0.2, 0.6)); });
      wTitle.forEach(tt => op(tt, P(t, tD + 0.1, 0.4, linear)));
      wGauge.forEach((g, i) => { g.set((i ? 0.12 : 0.85) * P(t, mid('wide', 0.6), 1.0, easeOut), t > mid('wide', 0.7) ? (i ? 'low' : 'high') : ' '); op(g, P(t, mid('wide', 0.56), 0.4, linear)); });
      wIcons.forEach((g, i) => popIn(g, t, mid('wide', 0.22 + i * 0.12), WIX, WIY[i]));
      op(wNote, P(t, mid('wide', 0.7), 0.5, linear));
    }

    /* --- camel vs stiletto --- */
    const aC = beat(t, tC, tP);
    op(bC, aC);
    if (aC > 0) {
      const walk = P(t, tC, 2.6, easeOut), cx = lerp(-160, CAMX, walk), stepping = walk < 0.999 ? 1 : 0;
      cam.walk((t - tC) * 5.5 * calm, stepping * (1 - walk * 0.6));
      const fs = 3 * P(t, tC + 2.4, 0.6);
      tr(cam, cx, GY + fs - (stepping ? 3 * Math.abs(Math.sin((t - tC) * 5.5)) * calm : 0));
      sandC.set(walk > 0.999 ? [-76, -56, 64, 84].map(hx => [CAMX + hx + 5 - 21, CAMX + hx + 5 + 21, fs]) : []);
      camArrow.move(cx, GY + fs - 170); camArrow.set(P(t, tC + 2.5, 0.6));
      const la = P(t, mid('camel', 0.3), 0.6, easeOut);
      op(lady, la);
      const sinkP = P(t, mid('camel', 0.68), 1.2), hole = 26 * sinkP, dropL = 4 * sinkP;
      tr(lady, LADX, GY + dropL - (1 - la) * 20);
      sh.spike.setAttribute('d', `M-7,${-HEEL + 2} L-2,${-HEEL + 2} L-4.5,${((hole - dropL) / LS).toFixed(1)} Z`);
      lawn.set([[LADX - 7 * LS, LADX - 2 * LS, hole, 0.22], [LADX + 10 * LS, LADX + 24 * LS, dropL * 0.6]]);
      ladArrow.move(LADX, GY + dropL - 100 * LS); ladArrow.set(P(t, mid('camel', 0.34), 0.5));
      cTitle.forEach((tt, i) => op(tt, P(t, i ? mid('camel', 0.3) : tC + 0.2, 0.4, linear)));
      const g1 = P(t, mid('camel', 0.42), 1.0, easeOut), g2 = P(t, mid('camel', 0.76), 1.0, easeOut);
      cGauge[0].set(0.14 * g1, g1 > 0.9 ? 'low' : ' '); op(cGauge[0], P(t, mid('camel', 0.4), 0.4, linear));
      cGauge[1].set(0.95 * g2, g2 > 0.9 ? 'high' : ' '); op(cGauge[1], P(t, mid('camel', 0.74), 0.4, linear));
      feetLab.set(P(t, mid('camel', 0.45), 0.4, linear));
      const hzA = P(t, mid('camel', 0.66), 0.5, linear);
      op(hz.g, hzA); op(hzLab, P(t, mid('camel', 0.8), 0.4, linear));
      if (hzA > 0) {
        const zh = HM * 26 * sinkP;
        hzSoil.set([[HZX - HM * 2.5, HZX + HM * 2.5, zh, 0.16]]);
        tr(hzHeel, HZX + HM * 4.5, HZS + HM * dropL * 0.5);
        hzSpike.setAttribute('d', `M${-HM * 7},${-HM * (HEEL - 2)} L${-HM * 2},${-HM * (HEEL - 2)} L${-HM * 4.5},${(zh - HM * dropL * 0.5).toFixed(1)} Z`);
      }
    }

    /* --- pin --- */
    const aP = beat(t, tP, tF);
    op(bP, aP);
    if (aP > 0) {
      popIn(adult, t, tP + 0.1, 600, 150);
      // left: down onto one pin, then pop
      const d1 = P(t, mid('pin', 0.16), 1.3, easeIn), popU = (t - mid('pin', 0.16) - 1.3) / 0.9;
      const by1 = lerp(TIPY - BRY - 130, TIPY - BRY + 2, d1);
      tr(balls[0], PX[0], by1); op(balls[0], popU > 0 ? 0 : 1);
      bPush[0].move(PX[0], by1 - BRY - 10); bPush[0].set(P(t, tP + 0.2, 0.5)); op(bPush[0], 1 - P(popU, 0.1, 0.3, linear));
      burst.set(popU);
      op(scraps, P(popU, 0.5, 0.4, linear));
      const bad = P(t, mid('pin', 0.16) + 1.3 + 0.5, 0.5, pop); op(badG, clamp(bad * 2)); tr(badG, PX[0], 480, Math.max(0.01, 0.6 + 0.4 * bad));
      // right: down onto the bed, a little squash, survives
      const d2 = P(t, mid('pin', 0.56), 1.4, easeIn), sq2 = P(t, mid('pin', 0.56) + 1.3, 0.6, easeOut);
      const by2 = lerp(TIPY - BRY - 130, TIPY - BRY + 2, d2) + 8 * sq2;
      tr(balls[1], PX[1], by2);
      balls[1].body.setAttribute('transform', `translate(0 ${BRY}) scale(${(1 + 0.08 * sq2).toFixed(3)} ${(1 - 0.09 * sq2).toFixed(3)}) translate(0 ${-BRY})`);
      bPush[1].move(PX[1], by2 - BRY - 10 + 17 * sq2); bPush[1].set(P(t, mid('pin', 0.5), 0.5));
      op(balls[1], P(t, mid('pin', 0.48), 0.4, linear)); op(bPush[1], P(t, mid('pin', 0.48), 0.4, linear));
      pLab.forEach((l, i) => op(l, P(t, i ? mid('pin', 0.5) : tP + 0.3, 0.4, linear)));
      const ok = P(t, mid('pin', 0.88), 0.5, pop); op(okG, clamp(ok * 2)); tr(okG, PX[1] + 160, 490, Math.max(0.01, 0.6 + 0.4 * ok));
    }

    /* --- pares --- */
    const aF = P(t, tF, 0.45, linear);
    op(bF, aF);
    if (aF > 0) {
      fadeUp(fL, t, mid('pares', 0.08), 0, 0);
      fadeUp(fR, t, mid('pares', 0.38), 0, 0);
      op(fLF, P(t, mid('pares', 0.62), 0.4, linear)); op(fRF, P(t, mid('pares', 0.82), 0.4, linear));
    }
  };
});

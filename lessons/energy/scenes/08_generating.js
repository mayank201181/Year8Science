/* Generating electricity and saving energy.
   Beats: a power-station cutaway (furnace, boiler, steam pipe, turbine, generator, pylon, home): the
   turbine turns the generator -> fuel heats water into steam that spins the turbine -> follow the
   energy: a store token rides the cutaway, chemical or nuclear -> thermal -> kinetic (showpiece)
   -> current along the wires to a home -> a wind turbine (no steam) -> a dam (gravitational)
   -> solar cells (no turbine) -> waste heat and smoke: saving energy matters -> what saving means
   -> insulate the home -> efficient appliances -> switch off standby -> three benefits. */
scene('generating', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const f1 = v => (+v).toFixed(1);
  const frac = v => ((v % 1) + 1) % 1;
  let nClip = 0;
  function clipUrl(d) { const id = 'genClip' + (++nClip); E('path', { d }, E('clipPath', { id }, defs())); return `url(#${id})`; }
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  function popAt(el, p, x, y, s0, s1) { s1 = s1 === undefined ? 1 : s1; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, lerp(s0 === undefined ? 0.6 : s0, s1, p))); }
  const sagPts = (a, b, sag, n) => { const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * 4 * u * (1 - u)]); } return pts; };
  /* position along a polyline: along(pts)(u 0..1) -> [x, y] */
  function along(pts) {
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push([L, l]); L += l; }
    return u => { const d = clamp(u) * L; for (let i = 0; i < seg.length; i++) if (d <= seg[i][0] + seg[i][1] || i === seg.length - 1) { const f = seg[i][1] ? (d - seg[i][0]) / seg[i][1] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } return pts[pts.length - 1]; };
  }
  /* angle (deg) of something whose speed ramps from 0 at t0 up to w deg/s over d seconds */
  const ramp = (t, t0, d, w) => t < t0 ? 0 : t < t0 + d ? w * (t - t0) * (t - t0) / (2 * d) : w * (d / 2 + t - t0 - d);
  /* hollow pipe through points */
  function pipe(parent, pts, w, o) {
    o = o || {};
    const d = 'M' + pts.map(p => p.join(',')).join(' L'), g = G(parent);
    E('path', { d, fill: 'none', stroke: o.outer || '#8D9BA7', 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: o.inner || '#1D3442', 'stroke-width': w - 9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  function flame(parent) {
    const g = G(parent);
    E('path', { d: 'M0,0 C-17,-9 -21,-32 -7,-58 C-5,-44 3,-40 5,-30 C11,-40 13,-50 9,-62 C26,-40 25,-11 0,0 Z', fill: '#FF8A3D' }, g);
    E('path', { d: 'M0,-2 C-9,-8 -11,-22 -2,-36 C0,-28 6,-24 6,-18 C10,-12 8,-4 0,-2 Z', fill: '#FFE07A' }, g);
    return g;
  }
  /* turbine wheel of radius r with n curved blades; g.set(deg) */
  function rotor(parent, r, n) {
    const g = G(parent), spin = G(g);
    const B = [[-0.1, -0.22], [-0.22, -0.5], [-0.16, -0.8], [0.04, -1], [0.18, -0.96], [0.03, -0.76], [-0.02, -0.5], [0.1, -0.22]];
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = i * TAU / n, q = B.map(([x, y]) => `${f1((x * Math.cos(a) - y * Math.sin(a)) * r)},${f1((x * Math.sin(a) + y * Math.cos(a)) * r)}`);
      d += `M${q[0]} C${q[1]} ${q[2]} ${q[3]} L${q[4]} C${q[5]} ${q[6]} ${q[7]} Z `;
    }
    E('path', { d, fill: '#C9D6DE', stroke: '#6F7F8C', 'stroke-width': 2, 'stroke-linejoin': 'round' }, spin);
    E('circle', { r: r * 0.25, fill: '#E9EEF2', stroke: '#6F7F8C', 'stroke-width': 2.5 }, spin);
    E('circle', { r: r * 0.08, fill: '#6F7F8C' }, spin);
    g.set = deg => spin.setAttribute('transform', `rotate(${f1(deg % 360)})`);
    return g;
  }
  /* electricity pylon h tall, feet at (0,0); g.tip(side) -> the upper insulator's lower end */
  function pylon(parent, h) {
    const g = G(parent), bw = h * 0.3, tw = h * 0.07, top = -h * 0.92;
    const xAt = (side, y) => side * lerp(bw / 2, tw / 2, y / top);
    let d = `M${f1(-bw / 2)},0 L${f1(-tw / 2)},${f1(top)} L0,${f1(-h)} L${f1(tw / 2)},${f1(top)} L${f1(bw / 2)},0`;
    const ys = [0, -0.2, -0.37, -0.52, -0.64, -0.76].map(k => k * h);
    for (let i = 0; i < ys.length - 1; i++) {
      const y0 = ys[i], y1 = ys[i + 1];
      d += ` M${f1(xAt(-1, y0))},${f1(y0)} L${f1(xAt(1, y1))},${f1(y1)} M${f1(xAt(1, y0))},${f1(y0)} L${f1(xAt(-1, y1))},${f1(y1)} M${f1(xAt(-1, y1))},${f1(y1)} L${f1(xAt(1, y1))},${f1(y1)}`;
    }
    const arm = (y, hw) => ` M${f1(-hw)},${f1(y)} L${f1(hw)},${f1(y)} M${f1(-hw)},${f1(y)} L${f1(xAt(-1, y + h * 0.07))},${f1(y + h * 0.07)} M${f1(hw)},${f1(y)} L${f1(xAt(1, y + h * 0.07))},${f1(y + h * 0.07)}`;
    d += arm(-h * 0.84, h * 0.24) + arm(-h * 0.66, h * 0.19);
    E('path', { d, fill: 'none', stroke: '#AFC0CC', 'stroke-width': Math.max(2.5, h * 0.013), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    [[-0.24, -0.84], [0.24, -0.84], [-0.19, -0.66], [0.19, -0.66]].forEach(([x, y]) => E('line', { x1: f1(x * h), y1: f1(y * h), x2: f1(x * h), y2: f1(y * h + h * 0.05), stroke: '#7FD0F0', 'stroke-width': Math.max(3, h * 0.02), 'stroke-linecap': 'round' }, g));
    g.tip = side => [side * h * 0.24, -h * 0.84 + h * 0.05];
    return g;
  }
  /* a chip that gets struck out with a cross on its left; g.set(p) */
  function strikeChip(parent, text, size) {
    const g = G(parent);
    const c = chip(g, text, { size: size || 30, fill: C.card2, stroke: C.line, color: C.muted, sw: 2.5 });
    const st = strike(g, -c.w / 2 + 16, 0, c.w / 2 - 16, C.bad);
    const x = cross(g, 15); tr(x, -c.w / 2 - 34, 0);
    g.set = p => { st.set(p); op(x, clamp(p * 3 - 1.5)); };
    g.set(0); g.w = c.w;
    return g;
  }
  /* a chip with a tick on its left; g.set(p) pops the tick */
  function tickChip(parent, text, size) {
    const g = G(parent);
    const c = chip(g, text, { size: size || 30, fill: 'rgba(86,214,155,0.14)', stroke: C.good, sw: 2.5 });
    const tk = tick(g, 16);
    g.set = p => { op(tk, clamp(p * 2)); tr(tk, -c.w / 2 - 34, 2, Math.max(0.01, p)); };
    g.set(0); g.w = c.w;
    return g;
  }
  /* a car-style fuel gauge, pivot at (0,0); g.set(level 0..1) */
  function fuelGauge(parent, r) {
    const g = G(parent);
    const pt = (a, rr) => [Math.sin(a * Math.PI / 180) * rr, -Math.cos(a * Math.PI / 180) * rr];
    const arcD = (a0, a1, rr) => { const p = pt(a0, rr), q = pt(a1, rr); return `M${f1(p[0])},${f1(p[1])} A${rr},${rr} 0 0 1 ${f1(q[0])},${f1(q[1])}`; };
    E('circle', { r: r * 1.16, fill: '#0B1A24', stroke: '#8D9BA7', 'stroke-width': 5 }, g);
    E('path', { d: arcD(-62, 62, r * 0.84), fill: 'none', stroke: '#33505F', 'stroke-width': r * 0.13, 'stroke-linecap': 'round' }, g);
    E('path', { d: arcD(-62, -38, r * 0.84), fill: 'none', stroke: C.bad, 'stroke-width': r * 0.13, 'stroke-linecap': 'round' }, g);
    for (let i = 0; i <= 4; i++) { const a = -62 + i * 31, p = pt(a, r * 0.66), q = pt(a, r * 0.54); E('line', { x1: f1(p[0]), y1: f1(p[1]), x2: f1(q[0]), y2: f1(q[1]), stroke: '#C9D6DE', 'stroke-width': r * 0.045, 'stroke-linecap': 'round' }, g); }
    T(g, -r * 0.6, -r * 0.02, 'E', { size: Math.round(r * 0.36), weight: 800, anchor: 'middle', fill: '#FF9AA4' });
    T(g, r * 0.6, -r * 0.02, 'F', { size: Math.round(r * 0.36), weight: 800, anchor: 'middle', fill: C.ink });
    const pump = G(g); tr(pump, 0, r * 0.55, r / 100);
    E('rect', { x: -18, y: -24, width: 28, height: 44, rx: 5, fill: '#C9D6DE' }, pump);
    E('rect', { x: -12, y: -17, width: 16, height: 12, rx: 2, fill: '#0B1A24' }, pump);
    E('path', { d: 'M10,-16 L22,-9 L22,12 Q22,19 29,16', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pump);
    const needle = G(g);
    E('path', { d: `M${f1(-r * 0.05)},0 L0,${f1(-r * 0.8)} L${f1(r * 0.05)},0 Z`, fill: '#FF8A3D' }, needle);
    E('circle', { r: r * 0.1, fill: '#C9D6DE' }, g);
    g.set = lv => needle.setAttribute('transform', `rotate(${f1(lerp(-58, 58, clamp(lv)))})`);
    g.set(1);
    return g;
  }
  /* a thermal-energy arrow whose ends and width change every frame (the Heat lesson's style) */
  function flow(parent, waves) {
    const g = G(parent), col = C.heat;
    const line = E('path', { fill: 'none', stroke: col, 'stroke-linecap': 'round' }, g);
    const head = E('path', { fill: col }, g);
    const hw = waves === false ? null : heatWaves(g, { n: 2, h: 40, spacing: 30, width: 4, color: '#FFB067', speed: 0.7 });
    g.set = (x1, y1, x2, y2, w, t) => {
      const ang = Math.atan2(y2 - y1, x2 - x1), hs = w * 2.5;
      line.setAttribute('d', `M${f1(x1)},${f1(y1)} L${f1(x2 - Math.cos(ang) * hs * 0.7)},${f1(y2 - Math.sin(ang) * hs * 0.7)}`); line.setAttribute('stroke-width', f1(w));
      head.setAttribute('d', `M0,0 L${f1(-hs)},${f1(-hs * 0.62)} L${f1(-hs * 0.72)},0 L${f1(-hs)},${f1(hs * 0.62)} Z`);
      head.setAttribute('transform', `translate(${f1(x2)} ${f1(y2)}) rotate(${f1(ang * 180 / Math.PI)})`);
      if (hw) { hw.upd(t); tr(hw, x1 + (x2 - x1) * 0.45, y1 + (y2 - y1) * 0.45, Math.min(1, w / 9), ang * 180 / Math.PI + 90); }
    };
    return g;
  }
  function bigBolt(parent, s) { const g = G(parent); g.halo = E('circle', { r: 60, fill: glow(C.energy) }, g); bolt(g, 1); tr(g, 0, 0, s); return g; }

  /* ================= A. the power station ================= */
  const gSt = G(root);
  E('rect', { x: 40, y: 640, width: 730, height: 14, rx: 4, fill: '#1F3A2E' }, gSt);
  // chimney with smoke
  E('rect', { x: 52, y: 205, width: 36, height: 436, fill: '#7A4A3A', stroke: '#A0685A', 'stroke-width': 3 }, gSt);
  E('rect', { x: 48, y: 198, width: 44, height: 12, rx: 3, fill: '#A0685A' }, gSt);
  const CHT = [70, 196];
  const smoke = [0, 1, 2, 3, 4].map(() => E('circle', { r: 12, fill: '#6B7580' }, gSt));
  // furnace
  E('rect', { x: 84, y: 548, width: 20, height: 26, fill: '#6A3A2E' }, gSt);
  E('rect', { x: 100, y: 520, width: 190, height: 122, rx: 8, fill: '#5A2E24', stroke: '#8A4A3A', 'stroke-width': 4 }, gSt);
  E('rect', { x: 116, y: 536, width: 158, height: 92, rx: 6, fill: '#1A0D0A' }, gSt);
  const fireGlow = E('ellipse', { cx: 195, cy: 600, rx: 100, ry: 56, fill: glow('#FF8A3D') }, gSt);
  const flames = [[134, 0.8], [164, 1.05], [195, 1.2], [226, 1.0], [256, 0.85]].map(([x, s], i) => ({ g: flame(gSt), x, s, ph: i * 1.3 }));
  const coal = G(gSt);
  { const lump = ([x, y]) => `M${x - 11},${y + 6} L${x - 7},${y - 5} L${x + 3},${y - 8} L${x + 11},${y + 1} L${x + 7},${y + 6} Z `;
    E('path', { d: [[128, 616], [172, 614], [220, 615], [264, 616]].map(lump).join(''), fill: '#3A4047', stroke: '#5C6670', 'stroke-width': 1.5 }, coal);
    E('path', { d: [[150, 620], [196, 620], [244, 620]].map(lump).join(''), fill: '#2B3035', stroke: '#5C6670', 'stroke-width': 1.5 }, coal); }
  E('line', { x1: 118, y1: 626, x2: 272, y2: 626, stroke: '#5C6670', 'stroke-width': 4 }, gSt);
  // boiler: water that boils into steam
  const BOIL = 'M146,392 L244,392 Q278,392 278,426 L278,486 Q278,520 244,520 L146,520 Q112,520 112,486 L112,426 Q112,392 146,392 Z';
  E('path', { d: BOIL, fill: '#132C3A' }, gSt);
  const boilIn = G(gSt, { 'clip-path': clipUrl(BOIL) });
  E('rect', { x: 112, y: 470, width: 166, height: 50, fill: C.water, opacity: 0.85 }, boilIn);
  const bub = bubbles(boilIn, 122, 472, 146, 46, { n: 9, r: 5, seed: 4, speed: 0.6 });
  const boilSteam = heatWaves(boilIn, { n: 4, h: 54, spacing: 34, width: 5, color: '#E8F4FA', speed: 0.8 }); tr(boilSteam, 195, 468);
  E('path', { d: BOIL, fill: 'none', stroke: '#9AA8B4', 'stroke-width': 5 }, gSt);
  // steam pipe and turbine
  const TX = 430, TY = 440, TR = 86;
  const PIPE = [[195, 394], [195, 330], [372, 330], [372, 384]];
  pipe(gSt, PIPE, 24);
  pipe(gSt, [[491, 500], [491, 642]], 22);
  E('circle', { cx: TX, cy: TY, r: TR, fill: '#10283A', stroke: '#9AA8B4', 'stroke-width': 8 }, gSt);
  const turb = rotor(gSt, 72, 11); tr(turb, TX, TY);
  const turbGlow = E('circle', { cx: TX, cy: TY, r: 120, fill: glow('#9FD8FF') }, gSt); op(turbGlow, 0);
  // steam puffs: along the pipe, round the turbine, out of the exhaust
  const SPATH = PIPE.slice();
  for (let i = 0; i <= 10; i++) { const a = (-135 + i * 18) * Math.PI / 180; SPATH.push([TX + Math.cos(a) * 58, TY + Math.sin(a) * 58]); }
  SPATH.push([491, 520], [491, 630]);
  const steamAt = along(SPATH);
  const puffs = []; for (let i = 0; i < 13; i++) puffs.push(E('circle', { r: 7, fill: '#F2F7FA' }, gSt));
  // shaft and generator
  E('rect', { x: 514, y: 433, width: 60, height: 14, rx: 3, fill: '#B9C6D2' }, gSt);
  E('rect', { x: 536, y: 425, width: 16, height: 30, rx: 3, fill: '#8D9BA7' }, gSt);
  const GX = 640, GY = 440, GR = 68;
  const genGlow = E('circle', { cx: GX, cy: GY, r: 115, fill: glow(C.energy) }, gSt); op(genGlow, 0);
  E('circle', { cx: GX, cy: GY, r: GR, fill: '#22303B', stroke: '#8D9BA7', 'stroke-width': 6 }, gSt);
  { let d = ''; for (let i = 0; i < 10; i++) { const a = i * TAU / 10, c = Math.cos(a), sn = Math.sin(a); const q = [[-9, -GR * 0.86], [9, -GR * 0.86], [9, -GR * 0.6], [-9, -GR * 0.6]].map(([x, y]) => `${f1(GX + x * c - y * sn)},${f1(GY + x * sn + y * c)}`); d += `M${q.join(' L')} Z `; }
    E('path', { d, fill: '#C87F3A', stroke: '#8A5221', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, gSt); }
  const mag = G(gSt);
  E('rect', { x: -36, y: -12, width: 36, height: 24, rx: 5, fill: ball('#E8424F', '#A4232E') }, mag);
  E('rect', { x: 0, y: -12, width: 36, height: 24, rx: 5, fill: ball('#3B82F6', '#1E4FA8') }, mag);
  const genBolt = bigBolt(gSt, 0.42); tr(genBolt, 712, 314, 0.42);
  // labels
  const lbl = {};
  [['furnace', 195], ['turbine', TX], ['generator', GX], ['pylon', 860], ['home', 1080]].forEach(([s, x]) => { lbl[s] = T(root, x, 688, s, { size: 28, weight: 700, anchor: 'middle', fill: C.muted }); });
  const lbBoiler = labelLine(gSt, 150, 300, 170, 392, 'boiler', { size: 28, anchor: 'middle' });
  const lbSteam = T(gSt, 284, 314, 'steam', { size: 28, weight: 700, anchor: 'middle', fill: '#E8F4FA' });
  const title = T(root, 600, 200, 'Inside a power station', { size: 46, weight: 700, anchor: 'middle' });
  // the fuels
  const fuels = G(root);
  const FUEL = [['coal', 'coal', 470], ['biomass', 'biomass', 600], ['uranium', 'nuclear', 730]].map(([k, name, x]) => {
    const g = G(fuels); const ic = enResource(g, k, { label: false }); tr(ic, 0, 0, 0.62);
    T(g, 0, 64, name, { size: 28, weight: 700, anchor: 'middle' });
    return { g, x };
  });

  /* ---------- the grid: a pylon and a home ---------- */
  const gGrid = G(root);
  E('rect', { x: 770, y: 640, width: 390, height: 14, rx: 4, fill: '#1F3A2E' }, gGrid);
  const pyl = pylon(gGrid, 320); tr(pyl, 860, 640);
  const tl = pyl.tip(-1), trr = pyl.tip(1), TL = [860 + tl[0], 640 + tl[1]], TRR = [860 + trr[0], 640 + trr[1]];
  const home = G(gGrid);
  E('rect', { x: 1030, y: 562, width: 100, height: 78, fill: '#2F4A5C', stroke: '#5E7A8C', 'stroke-width': 3 }, home);
  E('path', { d: 'M1018,564 L1080,508 L1142,564 Z', fill: '#6E3A30', stroke: '#9A5A45', 'stroke-width': 3, 'stroke-linejoin': 'round' }, home);
  E('rect', { x: 1072, y: 602, width: 18, height: 38, fill: '#8A5A3A' }, home);
  const wins = [[1040, 578], [1098, 578]].map(([x, y]) => E('rect', { x, y, width: 24, height: 20, rx: 3, fill: '#16303E', stroke: '#5E7A8C', 'stroke-width': 2 }, gGrid));
  const winGlow = E('ellipse', { cx: 1080, cy: 590, rx: 90, ry: 60, fill: glow('#FFD27A') }, gGrid); op(winGlow, 0);
  const WIRE = [[652, 372], [652, 344]].concat(sagPts([652, 344], TL, 16, 6).slice(1), [TRR], sagPts(TRR, [1048, 532], 34, 8).slice(1));
  const grid = wire(gGrid, WIRE, { width: 4, spacing: 38 }); grid.set(0);
  const elecChip = chip(gGrid, 'electrically', { size: 28, fill: C.card, stroke: C.energy, sw: 2.5 }); tr(elecChip, 1010, 312);

  /* ---------- the showpiece: follow the energy ---------- */
  const gChain = G(root);
  const fc = enFlowChain(gChain, [{ kind: 'chemical', text: 'chemical or nuclear' }, { kind: 'thermal', text: 'thermal: steam' }, { kind: 'kinetic', text: 'kinetic: turbine' }], { size: 28, h: 64, gap: 66 });
  tr(fc, 600, 160);
  fc.boxes[0].g.firstChild.setAttribute('stroke', linGrad(C.glucose, C.ethanol));
  const tokPath = [[195, 470], [195, 330], [372, 330], [372, 396]], tokAt = along(tokPath);
  const flowSparks = enSparkFlow(gChain, [[195, 590], [195, 330], [372, 330], [372, 384], [TX, TY]], { n: 7, r: 9, speed: 150 });
  const tChem = enBadge(gChain, 'chemical', { r: 30, label: false });
  const tNuc = enBadge(gChain, 'nuclear', { r: 30, label: false });
  const orTxt = T(gChain, 195, 594, 'or', { size: 28, weight: 800, anchor: 'middle', fill: C.ink });
  orTxt.setAttribute('stroke', '#1A0D0A'); orTxt.setAttribute('stroke-width', 7); orTxt.setAttribute('paint-order', 'stroke'); orTxt.setAttribute('stroke-linejoin', 'round');
  const tTherm = enBadge(gChain, 'thermal', { r: 32, label: false });
  const tKin = enBadge(gChain, 'kinetic', { r: 32, label: false });

  /* ================= B. a wind turbine ================= */
  const gWind = G(root);
  E('rect', { x: 40, y: 640, width: 1120, height: 14, rx: 4, fill: '#1F3A2E' }, gWind);
  const wStreaks = []; { const r = rng(21); for (let i = 0; i < 9; i++) wStreaks.push({ el: E('path', { fill: 'none', stroke: '#CFEAF7', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, gWind), y: 236 + i * 34 + r() * 12, ph: r(), len: 70 + r() * 50 }); }
  E('path', { d: 'M543,641 L553,300 L567,300 L577,641 Z', fill: '#E8EEF2', stroke: '#AEBAC4', 'stroke-width': 2 }, gWind);
  E('circle', { cx: 560, cy: 290, r: 22, fill: '#DDE5EC', stroke: '#AEBAC4', 'stroke-width': 2 }, gWind);
  const wBlades = G(gWind), wSpin = G(wBlades); tr(wBlades, 560, 290);
  for (let i = 0; i < 3; i++) E('path', { d: 'M-10,-16 C-14,-60 -9,-120 -3,-170 C-1,-175 4,-175 6,-170 C10,-120 13,-60 10,-16 Z', fill: '#F4F7FA', stroke: '#AEBAC4', 'stroke-width': 2, transform: `rotate(${i * 120})` }, wSpin);
  E('circle', { r: 15, fill: '#C9D3DC', stroke: '#8FA3B3', 'stroke-width': 2 }, wSpin);
  const wBadge = enBadge(gWind, 'kinetic', { r: 44 });
  const wAir = T(gWind, 210, 200, 'moving air', { size: 32, weight: 700, anchor: 'middle', fill: C.air });
  const wSparks = enSparkFlow(gWind, [[262, 330], [400, 304], [520, 292]], { n: 4, r: 10, speed: 140 });
  const wNoSteam = strikeChip(gWind, 'steam', 32); tr(wNoSteam, 930, 250);
  const wNeed = T(gWind, 930, 320, 'not needed', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const wBolt = bigBolt(gWind, 0.5); tr(wBolt, 624, 592, 0.5);
  const wDirect = chip(gWind, 'turns the blades directly', { size: 28, fill: C.card, stroke: C.water, sw: 2.5 }); tr(wDirect, 930, 560);

  /* ================= C. a hydroelectric dam ================= */
  const gHyd = G(root);
  E('rect', { x: 60, y: 262, width: 462, height: 380, fill: C.water, opacity: 0.85 }, gHyd);
  E('path', { d: 'M60,262 L522,262', stroke: '#BDEBFA', 'stroke-width': 4 }, gHyd);
  E('path', { d: 'M40,236 L186,262 L424,641 L40,641 Z', fill: '#2C6B45' }, gHyd);
  E('path', { d: 'M520,232 L580,232 L716,641 L520,641 Z', fill: ball('#B5C0CA', '#6B7884'), stroke: '#4B5865', 'stroke-width': 3, 'stroke-linejoin': 'round' }, gHyd);
  E('rect', { x: 880, y: 612, width: 280, height: 30, fill: C.water, opacity: 0.8 }, gHyd);
  E('rect', { x: 40, y: 640, width: 1120, height: 14, rx: 4, fill: '#1F3A2E' }, gHyd);
  const PEN = [[524, 300], [614, 300], [708, 588], [760, 602]];
  pipe(gHyd, PEN, 26, { outer: '#7D8C99', inner: '#123447' });
  const penWater = E('path', { d: 'M' + PEN.map(p => p.join(',')).join(' L'), fill: 'none', stroke: '#7FD8F7', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': '16 12' }, gHyd);
  E('rect', { x: 730, y: 536, width: 150, height: 106, rx: 8, fill: '#18303F', stroke: '#8D9BA7', 'stroke-width': 4 }, gHyd);
  E('path', { d: 'M722,540 L888,540 L874,516 L736,516 Z', fill: '#5E6C78' }, gHyd);
  const hTurb = rotor(gHyd, 40, 9); tr(hTurb, 805, 596);
  const outWater = E('path', { d: 'M848,624 Q880,624 900,626 L1150,626', fill: 'none', stroke: '#7FD8F7', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-dasharray': '22 14' }, gHyd);
  const hBadge = enBadge(gHyd, 'gravitational', { r: 44 });
  const hRes = T(gHyd, 350, 236, 'high reservoir', { size: 32, weight: 700, anchor: 'middle' });
  const hDam = T(gHyd, 550, 214, 'dam', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const hFallLab = T(gHyd, 690, 440, 'falls', { size: 30, weight: 700, fill: '#BDEBFA' });
  const hBolt = bigBolt(gHyd, 0.5); tr(hBolt, 905, 470, 0.5);
  const hTurbLab = T(gHyd, 805, 688, 'turbine', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });

  /* ================= D. solar cells ================= */
  const gSol = G(root);
  const sSun = sun(gSol, 58); tr(sSun, 220, 230);
  const sPanel = enResource(gSol, 'solar', { label: false }); tr(sPanel, 600, 470, 3);
  const sRays = [[300, 262, 548, 418], [318, 222, 640, 410], [282, 306, 520, 470]].map(([a, b, c, d]) => enPathway(gSol, 'rad', a, b, c, d, { label: false, wave: 'light', width: 5, amp: 12 }));
  const sLight = T(gSol, 352, 410, 'light', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const sWire = wire(gSol, [[752, 470], [900, 470], [900, 560], [948, 560]], { width: 5, spacing: 34 });
  const sBulb = enBulb(gSol, 'led', { s: 1.1 }); tr(sBulb, 948, 480);
  const sElec = T(gSol, 822, 506, 'electricity', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const sCells = T(gSol, 600, 660, 'solar cells', { size: 30, weight: 700, anchor: 'middle' });
  const sNo = G(gSol);
  const sMini = rotor(sNo, 34, 9); tr(sMini, 830, 232);
  { const x = cross(sNo, 30); tr(x, 830, 232); }
  { const c = chip(sNo, 'no turbine', { size: 30, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, sw: 2.5 }); tr(c, 990, 232); }

  /* ================= E. saving energy matters ================= */
  const gSave = G(root);
  // wasted energy spreading out looks the same in every chapter: orange sparks thinning out, a warm #FF7A30 tint
  const wasteGlow = E('ellipse', { cx: 330, cy: 420, rx: 430, ry: 300, fill: glow('#FF7A30') }, gSave);
  const waste = enDissipate(gSave, 700, 430, { n: 15, r: 11, from: [30, 30], tint: 0, seed: 9, end: 0.52, fade: 0.45 }); tr(waste, 40, 170);
  const sCO2 = [0, 1, 2].map(() => molCO2(gSave, 9));
  const saveHead = G(gSave);
  T(saveHead, 960, 330, 'saving energy', { size: 54, weight: 700, anchor: 'middle', fill: C.energy });
  T(saveHead, 960, 386, 'matters', { size: 40, weight: 700, anchor: 'middle' });

  /* ================= F. what saving energy means ================= */
  const gMean = G(root);
  const mWrong = strikeChip(gMean, 'stop energy vanishing', 34); tr(mWrong, 600, 214);
  const mNote = T(gMean, 600, 282, 'energy never vanishes anyway', { size: 28, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const mRight = tickChip(gMean, 'waste less fuel and electricity', 34); tr(mRight, 600, 382);
  const can = G(gMean);
  E('path', { d: 'M-46,-56 L26,-56 L46,-36 L46,58 Q46,68 36,68 L-36,68 Q-46,68 -46,58 Z', fill: ball('#E8424F', '#A4232E'), stroke: '#FF9AA4', 'stroke-width': 3, 'stroke-linejoin': 'round' }, can);
  E('rect', { x: -32, y: -74, width: 36, height: 16, rx: 6, fill: 'none', stroke: '#C9D6DE', 'stroke-width': 6 }, can);
  E('path', { d: 'M26,-56 L40,-80 L54,-74 L42,-50', fill: '#C9D6DE', stroke: '#8D9BA7', 'stroke-width': 2, 'stroke-linejoin': 'round' }, can);
  E('path', { d: 'M0,-26 C14,-8 22,4 22,16 C22,30 12,40 0,40 C-12,40 -22,30 -22,16 C-22,4 -14,-8 0,-26 Z', fill: '#FFE0E4', stroke: '#B3324A', 'stroke-width': 3 }, can);
  const canLab = T(gMean, 440, 660, 'fuel', { size: 30, weight: 700, anchor: 'middle' });
  const bill = G(gMean);
  E('path', { d: 'M-58,-76 L42,-76 L58,-60 L58,76 L-58,76 Z', fill: '#F4F7FA', stroke: '#AEBAC4', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bill);
  [-40, -20, 0].forEach(y => E('line', { x1: -40, y1: y, x2: 40, y2: y, stroke: '#AEBAC4', 'stroke-width': 5, 'stroke-linecap': 'round' }, bill));
  { const b = bolt(bill, 0.36); tr(b, -30, -56, 0.36); }
  T(bill, 0, 54, '£ 85', { size: 34, weight: 800, anchor: 'middle', fill: '#B3324A' });
  const billLab = T(gMean, 760, 660, 'electricity bill', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= G. insulate the home ================= */
  const gIns = G(root);
  const HX = 600, HY = 664;
  const hs = G(gIns); tr(hs, HX, HY);
  E('rect', { x: -360, y: 0, width: 720, height: 14, rx: 6, fill: '#1F3A2E' }, hs);
  E('rect', { x: -206, y: -270, width: 412, height: 270, fill: '#1B3443' }, hs);
  const roomWarm = E('rect', { x: -206, y: -270, width: 412, height: 270, fill: '#FF9A50' }, hs);
  E('rect', { x: -206, y: -12, width: 412, height: 12, fill: '#6B4A33' }, hs);
  E('rect', { x: -150, y: -104, width: 140, height: 44, rx: 14, fill: '#C9566B' }, hs);
  E('rect', { x: -156, y: -66, width: 152, height: 54, rx: 12, fill: '#B5455A' }, hs);
  E('path', { d: 'M150,-14 L150,-150 M120,-14 L180,-14', stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round' }, hs);
  E('circle', { cx: 150, cy: -168, r: 46, fill: glow('#FFE29A') }, hs);
  E('path', { d: 'M126,-150 L174,-150 L162,-190 L138,-190 Z', fill: '#FFE29A' }, hs);
  E('rect', { x: -40, y: -222, width: 84, height: 60, rx: 4, fill: '#2F5872', stroke: '#B78358', 'stroke-width': 5 }, hs);
  // walls: brick outer leaf, cavity, block inner leaf; a door in the left wall, a window in the right
  [[-250, -270, 270], [234, -270, 270]].forEach(([x, y, h]) => E('rect', { x, y, width: 16, height: h, fill: '#A0523D' }, hs));
  [[-234], [222]].forEach(([x]) => E('rect', { x, y: -270, width: 12, height: 270, fill: '#0E2230' }, hs));
  [[-222], [206]].forEach(([x]) => E('rect', { x, y: -270, width: 16, height: 270, fill: '#8F9CAB' }, hs));
  E('rect', { x: -252, y: -158, width: 48, height: 158, fill: '#1B3443' }, hs);
  E('rect', { x: -252, y: -164, width: 48, height: 8, fill: '#6B4A33' }, hs);
  const doorP = E('rect', { x: -240, y: -146, width: 24, height: 136, rx: 3, fill: '#9A6A44', stroke: '#C9935F', 'stroke-width': 2 }, hs);
  const gapGlow = [E('rect', { x: -252, y: -156, width: 48, height: 10, fill: '#FFB067' }, hs), E('rect', { x: -252, y: -10, width: 48, height: 10, fill: '#FFB067' }, hs)];
  const strips = [E('rect', { x: -252, y: -156, width: 48, height: 10, rx: 2, fill: '#3A444E' }, hs), E('rect', { x: -252, y: -10, width: 48, height: 10, rx: 2, fill: '#3A444E' }, hs)];
  const stripTeeth = G(hs); { let d = ''; for (let i = 0; i < 9; i++) { const x = -250 + i * 5.5; d += `M${f1(x)},-156 L${f1(x)},-146 M${f1(x)},-10 L${f1(x)},0 `; } E('path', { d, stroke: '#7D8C99', 'stroke-width': 1.5 }, stripTeeth); }
  E('rect', { x: 204, y: -208, width: 48, height: 96, fill: '#16303E' }, hs);
  E('rect', { x: 206, y: -205, width: 44, height: 90, fill: 'rgba(159,216,255,0.2)' }, hs);
  E('rect', { x: 200, y: -116, width: 58, height: 8, rx: 3, fill: '#E8EEF2' }, hs);
  E('rect', { x: 202, y: -212, width: 54, height: 8, rx: 3, fill: '#E8EEF2' }, hs);
  E('rect', { x: 209, y: -205, width: 5, height: 90, fill: '#CFE7F5' }, hs);
  const pane2 = E('rect', { x: 241, y: -205, width: 5, height: 90, fill: '#CFE7F5' }, hs);
  E('rect', { x: -256, y: -284, width: 512, height: 14, fill: '#8A5A3A' }, hs);
  E('path', { d: 'M-262,-284 L0,-430 L262,-284 Z', fill: '#10232F' }, hs);
  const wool = G(hs, { 'clip-path': clipUrl('M-262,-284 L0,-430 L262,-284 Z') });
  const woolIn = G(wool);
  { const pts = [[-270, 0]]; for (let i = 0; i <= 24; i++) pts.push([-270 + i * 22.5, -50 - 6 * Math.sin(i * 1.7) - 4 * Math.cos(i * 2.9)]); pts.push([270, 0]);
    E('path', { d: 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join(' L') + ' Z', fill: '#F2C14E', stroke: '#FFE29A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, woolIn);
    let d = ''; const r = rng(4); for (let i = 0; i < 40; i++) { const x = -250 + r() * 500, y = -8 - r() * 36; d += `M${f1(x)},${f1(y)} q${f1(6 + r() * 6)},${f1(-6 - r() * 4)} ${f1(14 + r() * 6)},0 `; }
    E('path', { d, fill: 'none', stroke: '#C9922E', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, woolIn); }
  E('path', { d: 'M-292,-284 L0,-455 L292,-284 L262,-284 L0,-430 L-262,-284 Z', fill: '#6E3A30', stroke: '#9A5A45', 'stroke-width': 3, 'stroke-linejoin': 'round' }, hs);
  const lkRoofL = flow(gIns), lkRoofR = flow(gIns), lkWin = flow(gIns), lkDoorT = flow(gIns, false), lkDoorB = flow(gIns, false);
  const lbLoft = labelLine(gIns, 884, 318, 770, 352, 'loft insulation', { size: 30, anchor: 'start', weight: 700, fill: '#FFD98A' });
  const lbGlaze = labelLine(gIns, 884, 432, 846, 470, 'double glazing', { size: 30, anchor: 'start', weight: 700, fill: '#CFE7F5' });
  const lbDraught = labelLine(gIns, 318, 456, 366, 506, 'draught-proofing', { size: 30, anchor: 'end', weight: 700, fill: '#C9D6DE' });

  /* ================= H. efficient appliances ================= */
  const gApp = G(root);
  const appHead = T(gApp, 600, 172, 'efficient appliances', { size: 46, weight: 700, anchor: 'middle' });
  const aLed = enBulb(gApp, 'led', { s: 1.55 }); tr(aLed, 400, 450);
  const aLedLab = T(gApp, 400, 650, 'LED bulbs', { size: 30, weight: 700, anchor: 'middle' });
  const fridge = G(gApp);
  E('rect', { x: -95, y: -160, width: 190, height: 320, rx: 16, fill: '#E9EEF2', stroke: '#AEBAC4', 'stroke-width': 4 }, fridge);
  E('line', { x1: -95, y1: -74, x2: 95, y2: -74, stroke: '#AEBAC4', 'stroke-width': 4 }, fridge);
  E('rect', { x: 68, y: -146, width: 10, height: 54, rx: 5, fill: '#9AA8B4' }, fridge);
  E('rect', { x: 68, y: -56, width: 10, height: 84, rx: 5, fill: '#9AA8B4' }, fridge);
  const sticker = G(fridge); tr(sticker, -18, 52);
  E('rect', { x: -58, y: -66, width: 116, height: 136, rx: 8, fill: '#FFFFFF', stroke: '#8FA3B3', 'stroke-width': 2 }, sticker);
  ['#1FA84F', '#7DC242', '#F4D30A', '#F59A1E', '#E2231A'].forEach((c, i) => { const y = -52 + i * 23, x1 = -16 + i * 11; E('path', { d: `M-46,${y} L${x1},${y} L${x1 + 9},${y + 9} L${x1},${y + 18} L-46,${y + 18} Z`, fill: c }, sticker); });
  const aTag = G(sticker);
  E('path', { d: 'M20,-55 L56,-55 L56,-29 L20,-29 L11,-42 Z', fill: '#1B1B1B' }, aTag);
  T(aTag, 37, -33, 'A', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  tr(fridge, 790, 440);
  const aFrLab = T(gApp, 790, 650, 'efficient fridges', { size: 30, weight: 700, anchor: 'middle' });
  const aTicks = [[505, 292], [918, 268]].map(([x, y]) => { const g = G(gApp); tick(g, 26); tr(g, x, y); return g; });

  /* ================= I. switch off at the wall ================= */
  const gSw = G(root);
  const tv = G(gSw); tr(tv, 430, 400);
  E('rect', { x: -180, y: -120, width: 360, height: 224, rx: 14, fill: '#1A1F24', stroke: '#5C6670', 'stroke-width': 4 }, tv);
  E('rect', { x: -164, y: -104, width: 328, height: 184, rx: 6, fill: '#0B1218' }, tv);
  E('path', { d: 'M-130,-86 L-60,-86', stroke: '#2A3440', 'stroke-width': 8, 'stroke-linecap': 'round' }, tv);
  E('path', { d: 'M-42,104 L42,104 L58,146 L-58,146 Z', fill: '#3A444E' }, tv);
  E('rect', { x: -96, y: 142, width: 192, height: 10, rx: 5, fill: '#5C6670' }, tv);
  const ledHalo = E('circle', { cx: 150, cy: 92, r: 26, fill: glow('#FF3B3B') }, tv);
  const ledDot = E('circle', { cx: 150, cy: 92, r: 6.5, fill: '#FF3B3B' }, tv);
  E('path', { d: 'M610,384 C700,384 720,400 812,400', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, gSw);
  const sock = G(gSw); tr(sock, 880, 400);
  E('rect', { x: -78, y: -62, width: 156, height: 124, rx: 16, fill: '#E9EEF2', stroke: '#AEBAC4', 'stroke-width': 3 }, sock);
  E('rect', { x: -64, y: -40, width: 66, height: 80, rx: 8, fill: '#2B3035', stroke: '#5C6670', 'stroke-width': 2 }, sock);
  E('rect', { x: 20, y: -36, width: 40, height: 72, rx: 6, fill: '#C9D3DC', stroke: '#8FA3B3', 'stroke-width': 2 }, sock);
  const rocker = E('rect', { x: 25, y: -32, width: 30, height: 34, rx: 4, fill: '#FFFFFF', stroke: '#8FA3B3', 'stroke-width': 2 }, sock);
  const onDot = E('circle', { cx: 40, cy: -48, r: 5.5, fill: '#FF3B3B' }, sock);
  const hand = G(gSw);
  E('rect', { x: 56, y: -26, width: 40, height: 64, rx: 8, fill: C.air, stroke: '#5E9CC4', 'stroke-width': 2.5 }, hand);
  E('path', { d: 'M0,-24 L44,-24 Q58,-24 58,-8 L58,20 Q58,36 42,36 L6,36 Q-6,36 -6,24 L-6,10 L-48,10 Q-60,10 -60,0 Q-60,-10 -48,-10 L-6,-10 Q-6,-24 0,-24 Z', fill: ball('#F0C4A0', '#C98E62'), stroke: '#B5774C', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, hand);
  const lbStandby = labelLine(gSw, 640, 600, 582, 500, 'standby light', { size: 30, anchor: 'start', weight: 700, fill: '#FF9A9A' });
  const swLab = T(gSw, 880, 520, 'off at the wall', { size: 30, weight: 700, anchor: 'middle' });
  const swTick = G(gSw); tick(swTick, 26); tr(swTick, 880, 270);

  /* ================= J. why it matters ================= */
  const gBen = G(root);
  const benHead = T(gBen, 600, 168, 'Using less energy:', { size: 44, weight: 700, anchor: 'middle' });
  const cards = [225, 600, 975].map(x => { const g = G(gBen); card(g, x - 175, 210, 350, 400, { fill: C.card, stroke: C.line }); return g; });
  const bCoin = G(cards[0]); tr(bCoin, 225, 370);
  const coinFace = G(bCoin);
  E('circle', { r: 74, fill: ball('#FFD24A', '#C99500'), stroke: '#8A6A00', 'stroke-width': 4 }, coinFace);
  E('circle', { r: 58, fill: 'none', stroke: '#B58600', 'stroke-width': 3 }, coinFace);
  T(coinFace, 0, 26, '£', { size: 74, weight: 800, anchor: 'middle', fill: '#6A4E00' });
  const bGauge = fuelGauge(cards[1], 80); tr(bGauge, 600, 384);
  const bCO2 = G(cards[2]); tr(bCO2, 945, 370);
  const bMol = molCO2(bCO2, 26);
  const bDown = G(cards[2]); { const a = arrow(bDown, 0, -46, 0, 46, { color: C.good, width: 9 }); a.set(1); } tr(bDown, 1080, 372);
  const benChips = [['saves money', 225], ['resources last longer', 600], ['less CO₂', 975]].map(([txt, x], i) => { const c = chip(cards[i], txt, { size: 28, fill: 'rgba(86,214,155,0.14)', stroke: C.good, sw: 2.5 }); tr(c, x, 540); return c; });

  /* ================= update ================= */
  return t0 => {
    const t = Math.min(t0, S.D), tc = t * calm;
    const tSteam = at('steam'), tChain = at('chain'), tGen = at('generator'), tWind = at('wind'), tHyd = at('hydro'), tSol = at('solar');
    const tSave = at('save'), tMean = at('mean'), tIns = at('insulate'), tApp = at('appliances'), tSw = at('switch'), tBen = at('benefits');

    /* --- the power station: up to the wind line, and back for 'save' --- */
    const aSt = Math.max(win(t, S.first - 0.4, tWind - 0.1, 0.45), win(t, tSave - 0.2, tMean + 0.1, 0.45));
    op(gSt, aSt);
    const aGrid = win(t, S.first - 0.4, tWind - 0.1, 0.45);
    op(gGrid, aGrid);
    const labA = win(t, mid('turbine', 0.5), tWind - 0.1, 0.4);
    op(lbl.turbine, labA); op(lbl.generator, win(t, mid('turbine', 0.8), tWind - 0.1, 0.4));
    op(lbl.furnace, win(t, mid('steam', 0.4), tWind - 0.1, 0.4));
    op(lbl.pylon, win(t, mid('generator', 0.5), tWind - 0.1, 0.4)); op(lbl.home, win(t, mid('generator', 0.7), tWind - 0.1, 0.4));
    op(title, win(t, S.first - 0.2, tSteam, 0.4));
    if (aSt > 0) {
      const fire = Math.max(win(t, mid('steam', 0.36), tWind + 0.4, 0.5), P(t, tSave - 0.3, 0.4, linear));
      op(fireGlow, fire * (0.75 + 0.25 * wave(t, 0.7)));
      flames.forEach(f => {
        const k = fire * (0.85 + 0.15 * Math.sin(tc * 11 + f.ph)), w = 1 + 0.08 * Math.sin(tc * 7 + f.ph * 2);
        op(f.g, clamp(fire * 2)); f.g.setAttribute('transform', `translate(${f.x} 614) scale(${f1(f.s * w)} ${f1(Math.max(0.01, f.s * k))})`);
      });
      const boil = clamp(fire * 1.3 - 0.2) * P(t, mid('steam', 0.4), 1.2, linear) + (t > tSave - 0.3 ? 1 : 0);
      bub.upd(t, clamp(boil)); boilSteam.upd(tc); op(boilSteam, P(t, mid('steam', 0.5), 0.8, linear) + (t > tSave - 0.3 ? 1 : 0));
      // the turbine and generator spin together; steam makes them spin faster
      const ang = ramp(t, mid('turbine', 0.5), 1.0, 90 * calm) + ramp(t, mid('steam', 0.68), 1.6, 220 * calm);
      turb.set(ang); mag.setAttribute('transform', `translate(${GX} ${GY}) rotate(${f1(ang % 360)})`);
      op(turbGlow, win(t, mid('turbine', 0.48), mid('turbine', 0.8), 0.3) * 0.8 + win(t, mid('steam', 0.68), end('steam'), 0.4) * 0.6);
      op(genGlow, win(t, mid('turbine', 0.78), end('turbine') + 0.4, 0.3) * 0.7 + win(t, tGen, mid('generator', 0.6), 0.3) * 0.7);
      const bOn = P(t, mid('turbine', 0.84), 0.4, linear);
      op(genBolt, bOn); op(genBolt.halo, bOn * (0.6 + 0.4 * wave(t, 0.9)));
      const stOn = Math.max(P(t, mid('steam', 0.56), 0.6, linear), P(t, tSave - 0.3, 0.3, linear));
      puffs.forEach((p, i) => {
        const u = frac(tc * 0.3 + ramp(t, mid('steam', 0.68), 1.2, 0.14 * calm) + i / puffs.length), q = steamAt(u);
        attr(p, 'cx', q[0]); attr(p, 'cy', q[1]); attr(p, 'r', 6 + 7 * u);
        op(p, stOn * 0.85 * Math.min(1, u * 12, (1 - u) * 5));
      });
      lbBoiler.set(win(t, mid('steam', 0.46), tChain + 0.1, 0.4)); op(lbSteam, win(t, mid('steam', 0.56), tChain + 0.1, 0.4));
      // smoke from the chimney while the fire burns
      const sm = fire * (1 + 0.6 * P(t, mid('save', 0.42), 0.5, linear));
      smoke.forEach((c, i) => { const u = frac(tc * 0.28 + i / 5); attr(c, 'cx', CHT[0] - u * 12 + Math.sin(u * 5 + i) * 5); attr(c, 'cy', CHT[1] - 6 - u * 62); attr(c, 'r', 9 + u * 12); op(c, Math.min(1, sm) * 0.75 * (1 - u)); });
    }
    // the three kinds of fuel
    const aF = win(t, mid('steam', 0.04), mid('steam', 0.42), 0.4);
    op(fuels, aF);
    if (aF > 0) FUEL.forEach((f, i) => { const p = popIn(t, mid('steam', [0.06, 0.14, 0.25][i])); popAt(f.g, p, f.x, 182, 0.6); });

    /* --- the grid: current flows along the wires to the home --- */
    if (aGrid > 0) {
      const cur = P(t, tGen + 0.1, 0.5, linear);
      grid.set(cur); grid.upd(t, 90);
      const ec = popIn(t, mid('generator', 0.3)); popAt(elecChip, ec, 1010, 312, 0.7);
      const lit = P(t, mid('generator', 0.72), 0.5, linear);
      wins.forEach(w => w.setAttribute('fill', lit > 0.5 ? '#FFD27A' : '#16303E')); op(winGlow, lit * 0.9);
    }

    /* --- showpiece: follow the energy --- */
    const aCh = win(t, tChain - 0.1, tWind - 0.1, 0.4);
    op(gChain, aCh);
    if (aCh > 0) {
      const m0 = mid('chain', 0.2), m1 = mid('chain', 0.46), m2 = mid('chain', 0.73);
      fc.set(P(t, m0, 0.5, linear) + P(t, m1, 0.5, linear) + P(t, m2, 0.5, linear));
      flowSparks.set(tc, P(t, mid('chain', 0.16), 0.8, linear) * (1 - P(t, tGen + 0.4, 0.6, linear)));
      const merge = P(t, mid('chain', 0.42), 0.6);
      popAt(tChem, popIn(t, m0 - 0.1), lerp(150, 195, merge), lerp(584, 480, merge), 0.5); op(tChem, clamp(popIn(t, m0 - 0.1) * 2) * (1 - merge));
      popAt(tNuc, popIn(t, mid('chain', 0.3)), lerp(240, 195, merge), lerp(584, 480, merge), 0.5); op(tNuc, clamp(popIn(t, mid('chain', 0.3)) * 2) * (1 - merge));
      op(orTxt, P(t, mid('chain', 0.3), 0.3, linear) * (1 - merge));
      // the thermal token rides the steam pipe, then turns over into the turbine's kinetic token
      const ride = P(t, mid('chain', 0.52), 1.4, ease), flip = P(t, mid('chain', 0.71), 0.5, linear);
      const q = tokAt(ride), th = popIn(t, mid('chain', 0.44));
      op(tTherm, clamp(th * 2) * (flip < 0.5 ? 1 : 0));
      tTherm.setAttribute('transform', `translate(${f1(q[0])} ${f1(q[1])}) scale(${f1(Math.max(0.01, lerp(0.5, 1, th) * Math.abs(Math.cos(flip * Math.PI))))} ${f1(Math.max(0.01, lerp(0.5, 1, th)))})`);
      const go = P(t, mid('chain', 0.76), 0.6, ease), kin = flip >= 0.5 ? Math.abs(Math.cos(flip * Math.PI)) : 0;
      const kx = lerp(372, TX, go), ky = lerp(396, TY, go);
      op(tKin, (flip >= 0.5 ? 1 : 0) * (1 - P(t, mid('generator', 0.3), 0.4, linear)));
      tKin.setAttribute('transform', `translate(${f1(kx)} ${f1(ky)}) scale(${f1(Math.max(0.01, flip >= 1 ? 1 : kin))} 1)`);
    }

    /* --- wind --- */
    const aW = win(t, tWind - 0.2, tHyd + 0.1, 0.45);
    op(gWind, aW);
    if (aW > 0) {
      const air = P(t, mid('wind', 0.38), 0.6, linear);
      wStreaks.forEach(s => { const q = frac(tc * 0.5 + s.ph), x = 190 + q * 320; s.el.setAttribute('d', `M${f1(x - s.len)},${f1(s.y)} Q${f1(x - s.len / 2)},${f1(s.y - 9)} ${f1(x)},${f1(s.y)}`); op(s.el, air * 0.85 * Math.sin(q * Math.PI)); });
      const bp = popIn(t, mid('wind', 0.45)); popAt(wBadge, bp, 210 + 6 * Math.sin(tc * 2), 330, 0.5); wBadge.set({ glow: 0.4 * bp });
      op(wAir, P(t, mid('wind', 0.42), 0.4, linear));
      const wang = ramp(t, mid('wind', 0.5), 1.4, 160 * calm);
      wSpin.setAttribute('transform', `rotate(${f1(wang % 360)})`);
      wSparks.set(tc, P(t, mid('wind', 0.62), 0.5, linear));
      const ns = popIn(t, mid('wind', 0.06)); popAt(wNoSteam, ns, 930, 250, 0.7); wNoSteam.set(P(t, mid('wind', 0.2), 0.5));
      op(wNeed, P(t, mid('wind', 0.3), 0.4, linear));
      const wb = P(t, mid('wind', 0.66), 0.4, linear); op(wBolt, wb); op(wBolt.halo, wb * (0.6 + 0.4 * wave(t, 0.9)));
      const dc = popIn(t, mid('wind', 0.74)); popAt(wDirect, dc, 930, 560, 0.7);
    }

    /* --- hydroelectric --- */
    const aH = win(t, tHyd - 0.2, tSol + 0.1, 0.45);
    op(gHyd, aH);
    if (aH > 0) {
      const flowOn = P(t, mid('hydro', 0.2), 0.6, linear);
      op(penWater, flowOn); penWater.setAttribute('stroke-dashoffset', f1(-(tc * 90) % 28));
      op(outWater, flowOn); outWater.setAttribute('stroke-dashoffset', f1(-(tc * 60) % 36));
      op(hRes, P(t, mid('hydro', 0.1), 0.4, linear)); op(hDam, P(t, mid('hydro', 0.1), 0.4, linear));
      op(hFallLab, P(t, mid('hydro', 0.36), 0.4, linear));
      const bp = popIn(t, mid('hydro', 0.6)); popAt(hBadge, bp, 390, 368, 0.5); hBadge.set({ glow: 0.4 * bp });
      hTurb.set(ramp(t, mid('hydro', 0.28), 1.2, 140 * calm) + ramp(t, mid('hydro', 0.8), 1.0, 160 * calm));
      op(hTurbLab, P(t, mid('hydro', 0.82), 0.4, linear));
      const hb = P(t, mid('hydro', 0.86), 0.4, linear); op(hBolt, hb); op(hBolt.halo, hb * (0.6 + 0.4 * wave(t, 0.9)));
    }

    /* --- solar cells --- */
    const aS = win(t, tSol - 0.2, tSave + 0.1, 0.45);
    op(gSol, aS);
    if (aS > 0) {
      sSun.upd(tc);
      sRays.forEach((r, i) => { r.set(P(t, mid('solar', 0.36) + i * 0.15, 0.8)); r.upd(tc); });
      op(sLight, P(t, mid('solar', 0.44), 0.4, linear));
      const on = P(t, mid('solar', 0.56), 0.4, linear);
      sWire.set(on); sWire.upd(t, 70); sBulb.set(on); op(sElec, P(t, mid('solar', 0.6), 0.4, linear));
      op(sCells, P(t, mid('solar', 0.12), 0.4, linear));
      const np = popIn(t, mid('solar', 0.76)); popAt(sNo, np, 0, 0, 0.8);
    }

    /* --- saving energy matters --- */
    const aSv = win(t, tSave - 0.1, tMean + 0.1, 0.45);
    op(gSave, aSv);
    if (aSv > 0) {
      waste.set(P(t, mid('save', 0.06), 2.8, linear), tc); op(wasteGlow, 0.34 * P(t, mid('save', 0.1), 2.2, linear));
      const pol = P(t, mid('save', 0.42), 0.4, linear);
      sCO2.forEach((m, i) => { const u = frac(tc * 0.3 + i / 3); tr(m, CHT[0] + 14 + u * 70, CHT[1] - 10 - u * 70, 1, u * 120); op(m, pol * Math.min(1, u * 6, (1 - u) * 4)); });
      const hp = P(t, mid('save', 0.7), 0.6, easeOut); op(saveHead, hp); tr(saveHead, 0, (1 - hp) * 18);
    }

    /* --- what saving energy means --- */
    const aM = win(t, tMean - 0.1, tIns + 0.1, 0.45);
    op(gMean, aM);
    if (aM > 0) {
      popAt(mWrong, popIn(t, tMean - 0.05), 600, 214, 0.7); mWrong.set(P(t, mid('mean', 0.3), 0.6));
      op(mNote, P(t, mid('mean', 0.36), 0.4, linear));
      popAt(mRight, popIn(t, mid('mean', 0.5)), 600, 382, 0.7); mRight.set(popIn(t, mid('mean', 0.58)));
      popAt(can, popIn(t, mid('mean', 0.72)), 440, 540, 0.6); op(canLab, P(t, mid('mean', 0.74), 0.4, linear));
      popAt(bill, popIn(t, mid('mean', 0.86)), 760, 540, 0.6); op(billLab, P(t, mid('mean', 0.88), 0.4, linear));
    }

    /* --- insulate the home --- */
    const aI = win(t, tIns - 0.1, tApp + 0.1, 0.45);
    op(gIns, aI);
    if (aI > 0) {
      const lk = P(t, tIns + 0.1, 0.6, linear);
      const loft = P(t, mid('insulate', 0.26), 1.2, easeOut), roofS = P(t, mid('insulate', 0.3), 1.2, ease);
      const glaze = P(t, mid('insulate', 0.46), 0.7, easeOut), winS = P(t, mid('insulate', 0.48), 1.0, ease);
      const strip = P(t, mid('insulate', 0.62), 0.6, linear), doorS = P(t, mid('insulate', 0.64), 1.0, ease);
      woolIn.setAttribute('transform', `translate(0 -284) scale(1 ${Math.max(0.01, loft).toFixed(3)})`);
      attr(pane2, 'x', lerp(262, 241, glaze)); op(pane2, glaze);
      strips.forEach(s => op(s, strip)); op(stripTeeth, strip); gapGlow.forEach(g => op(g, (1 - strip) * (0.7 + 0.3 * wave(t, 1.2))));
      op(roomWarm, 0.14 + 0.1 * P(t, mid('insulate', 0.8), 0.8, linear));
      const ln = (a, b, p) => lerp(a, b, p);
      [lkRoofL, lkRoofR, lkWin, lkDoorT, lkDoorB].forEach(a => op(a, lk));
      lkRoofL.set(HX - 110, HY - 236, HX - 110, ln(HY - 236, ln(HY - 490, HY - 340, roofS), lk), ln(11, 4, roofS), tc);
      lkRoofR.set(HX + 110, HY - 236, HX + 110, ln(HY - 236, ln(HY - 490, HY - 340, roofS), lk), ln(11, 4, roofS), tc + 0.3);
      lkWin.set(HX + 150, HY - 160, ln(HX + 150, ln(HX + 390, HX + 310, winS), lk), HY - 160, ln(11, 4, winS), tc + 0.6);
      lkDoorT.set(HX - 190, HY - 151, ln(HX - 190, ln(HX - 400, HX - 300, doorS), lk), HY - 151, ln(8, 3, doorS), tc + 0.9);
      lkDoorB.set(HX - 190, HY - 5, ln(HX - 190, ln(HX - 400, HX - 300, doorS), lk), HY - 5, ln(8, 3, doorS), tc + 1.2);
      lbLoft.set(P(t, mid('insulate', 0.27), 0.4, linear)); lbGlaze.set(P(t, mid('insulate', 0.47), 0.4, linear)); lbDraught.set(P(t, mid('insulate', 0.63), 0.4, linear));
    }

    /* --- efficient appliances --- */
    const aA = win(t, tApp - 0.1, tSw + 0.1, 0.45);
    op(gApp, aA);
    if (aA > 0) {
      op(appHead, P(t, tApp, 0.4, linear));
      const lp = popIn(t, mid('appliances', 0.1)); popAt(aLed, lp, 400, 450, 0.6); aLed.set(P(t, mid('appliances', 0.46), 0.4, linear)); op(aLedLab, P(t, mid('appliances', 0.46), 0.4, linear));
      const fp = popIn(t, mid('appliances', 0.22)); popAt(fridge, fp, 790, 440, 0.6); op(aFrLab, P(t, mid('appliances', 0.72), 0.4, linear));
      const tg = P(t, mid('appliances', 0.82), 0.6, linear); op(aTag, 0.4 + 0.6 * (0.5 + 0.5 * Math.cos(tg * TAU * 2)));   // blinks twice, ends bright
      aTicks.forEach((g, i) => { const p = popIn(t, mid('appliances', [0.58, 0.86][i])); op(g, clamp(p * 2)); tr(g, [505, 918][i], [292, 268][i], Math.max(0.01, p)); });
    }

    /* --- switch off at the wall --- */
    const aW2 = win(t, tSw - 0.1, tBen + 0.1, 0.45);
    op(gSw, aW2);
    if (aW2 > 0) {
      const ap = P(t, tSw, 0.6, easeOut), pr = P(t, mid('switch', 0.34), 0.25, easeOut), bk = P(t, mid('switch', 0.5), 0.5, ease), off = t >= mid('switch', 0.42);
      tr(hand, lerp(1130, 1002, ap) - 20 * pr * (1 - bk) + 46 * bk, lerp(430, 384, ap) + 14 * bk);
      attr(rocker, 'y', off ? 0 : -32); op(onDot, off ? 0 : 1);
      op(ledDot, off ? 0.15 : 1); op(ledHalo, off ? 0 : 0.8 + 0.2 * wave(t, 1.1));
      lbStandby.set(P(t, tSw + 0.1, 0.4, linear) * (off ? 0.55 : 1));
      op(swLab, P(t, mid('switch', 0.3), 0.4, linear));
      const tk = popIn(t, mid('switch', 0.62)); op(swTick, clamp(tk * 2)); tr(swTick, 880, 270, Math.max(0.01, tk));
    }

    /* --- why it matters --- */
    const aB = P(t, tBen - 0.1, 0.45, linear);
    op(gBen, aB);
    if (aB > 0) {
      op(benHead, P(t, tBen, 0.4, linear));
      cards.forEach((g, i) => { const p = popIn(t, mid('benefits', [0.04, 0.38, 0.68][i])); op(g, clamp(p * 2)); tr(g, 0, (1 - clamp(p)) * 24); });
      coinFace.setAttribute('transform', `scale(${(0.82 + 0.18 * Math.cos(tc * 1.6)).toFixed(3)} 1)`);
      bGauge.set(0.78 - 0.08 * P(t, mid('benefits', 0.42), 5, linear));
      const sh = P(t, mid('benefits', 0.74), 1.4, ease); tr(bMol, 0, 0, lerp(1.25, 0.6, sh));
      op(bDown, P(t, mid('benefits', 0.78), 0.4, linear));
    }
  };
});

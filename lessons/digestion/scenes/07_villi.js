/* Chapter 8, Absorption, villi and peristalsis.
   Beats: small molecules cross the gut wall into the blood, in the small intestine -> the wall rises into
   a forest of villi; one villus -> zoom into it: four empty slots -> 1 large surface area: the folded
   lining unfolds into a flat sheet that covers half a badminton court (showpiece) -> 2 thin wall, a
   one-cell hop -> 3 blood supply carries glucose and amino acids away (steep gradient) -> 4 lacteal
   takes the fats -> Big, Thin, Bloody Lacteal -> back to the gut: the large intestine takes the water
   -> bacteria feeding on fibre (science today) -> peristalsis, like toothpaste -> it works upside down
   -> stomach acid kills microbes and suits protease. */
scene('villi', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- the lesson's gut palette ---------- */
  const PINK = '#F4A6B8', PINKDK = '#B8466A', PINKLT = '#FFE4EC', HALO = '#FF8FB6';
  const COLON = '#D79C8E', COLONDK = '#8C4A43';
  const CELL = '#F2A3BA', CORE = '#6E2A3E', LUMEN = '#2B2416';
  const AMBER = ball('#F5BE62', '#B97A24'), CHYME = ball('#F3D9A4', '#B8955A'), WASTE = ball('#9A6844', '#5A3820');
  const BEADS = ['#FF8A80', '#4DD0C8', '#B5E655', C.ethanol];

  /* ---------- local helpers ---------- */
  function sample(parent, d, step) {
    const p = E('path', { d }, parent);
    const L = p.getTotalLength(), n = Math.max(2, Math.ceil(L / (step || 4))), pts = [];
    for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(L * i / n); pts.push([q.x, q.y]); }
    p.remove();
    return { pts, L, n, at: f => { const x = clamp(f) * n, i = Math.min(n - 1, Math.floor(x)), r = x - i; return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]; } };
  }
  const dash = (el, p) => { el.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4)); op(el, p > 0.002 ? 1 : 0); };
  const dropD = r => `M0,${-r * 1.35} C${r * 0.7},${-r * 0.35} ${r},${r * 0.2} ${r},${r * 0.45} A${r},${r} 0 0 1 ${-r},${r * 0.45} C${-r},${r * 0.2} ${-r * 0.7},${-r * 0.35} 0,${-r * 1.35} Z`;
  function enzyme(parent, r, color, dark) {
    const g = G(parent), a = 0.373 * r, b = 0.928 * r;
    E('path', { d: `M${-a},${-b} A${r},${r} 0 1 0 ${a},${-b} A${0.38 * r},${0.38 * r} 0 0 1 ${-a},${-b} Z`, fill: ball(color, dark), stroke: '#ffffff', 'stroke-opacity': 0.6, 'stroke-width': Math.max(1.5, r * 0.09), 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function bead(parent, r, i) { return E('circle', { r, fill: ball(BEADS[i % 4], '#3A3A55'), stroke: '#ffffff', 'stroke-opacity': 0.5, 'stroke-width': 1.5 }, parent); }
  function fattyAcid(parent) { const g = G(parent); E('path', { d: 'M-15,2 L-10,-4 L-5,2 L0,-4 L5,2 L10,-4 L15,1', fill: 'none', stroke: '#FFB347', 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
  function glycerol(parent) { const g = G(parent); E('rect', { x: -5, y: -13, width: 10, height: 26, rx: 4, fill: '#FFF0B8', stroke: '#D8B860', 'stroke-width': 2 }, g); return g; }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 2.5 }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  function noteChip(parent, text, o) { o = o || {}; return chip(parent, text, Object.assign({ size: 26, fill: 'rgba(20,54,70,0.92)', stroke: C.line, sw: 2, weight: 600 }, o)); }
  function germ(parent, r) {
    const g = G(parent); let d = '';
    for (let i = 0; i < 18; i++) { const a = i / 18 * TAU, rr = i % 2 ? r * 0.78 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('path', { d: d + 'Z', fill: ball('#8EDB5A', '#3C7A22'), stroke: '#D4F7B0', 'stroke-width': 2 }, g);
    E('circle', { cx: -r * 0.25, cy: -r * 0.15, r: r * 0.14, fill: '#1E3A12' }, g); E('circle', { cx: r * 0.25, cy: -r * 0.15, r: r * 0.14, fill: '#1E3A12' }, g);
    return g;
  }

  /* ---------- the gut (same art as the canal chapter); local origin = the lips ---------- */
  function gutArt(parent) {
    const g = G(parent), U = {};
    U.body = G(g);
    E('path', { d: 'M-22,10 C-22,40 -24,62 -40,72 C-70,82 -130,84 -156,104 C-170,116 -170,150 -166,190 L-160,330 C-158,380 -170,440 -166,480 C-162,500 -130,506 -70,506 L70,506 C130,506 162,500 166,480 C170,440 158,380 160,330 L166,190 C170,150 170,116 156,104 C130,84 70,82 40,72 C24,62 22,40 22,10 Z', fill: '#11303F', stroke: '#2E5568', 'stroke-width': 3 }, U.body);
    E('ellipse', { cx: 0, cy: -34, rx: 50, ry: 58, fill: '#11303F', stroke: '#2E5568', 'stroke-width': 3 }, U.body);
    const si = [[-20, 199], [-36, 205], [-46, 222], [-45, 242], [-34, 258], [-16, 268], [10, 284], [44, 298], [66, 306]];
    const ROWS = [310, 332, 354, 376, 398], XL = -72, XR = 72;
    ROWS.forEach((y, r) => {
      const dir = r % 2 === 0 ? -1 : 1, x0 = dir < 0 ? XR : XL, x1 = dir < 0 ? XL : XR;
      for (let k = r === 0 ? 1 : 0; k <= 9; k++) { const x = lerp(x0, x1, k / 9); si.push([x, y + 3 * Math.sin(x * 0.08 + r * 1.7)]); }
      if (r < ROWS.length - 1) for (let k = 1; k < 6; k++) { const a = -Math.PI / 2 + k / 6 * Math.PI; si.push([x1 + dir * 11 * Math.cos(a), y + 11 + 11 * Math.sin(a)]); }
    });
    si.push([-86, 402], [-98, 406]);
    const SEC = [
      { id: 'oes', d: 'M0,8 C0,40 3,84 14,118', w: 13, fill: PINK, stroke: PINKDK },
      { id: 'stomach', d: 'M14,118 C44,108 84,122 86,160 C88,198 60,216 30,214 C12,212 -4,205 -20,199' },
      { id: 'small', d: openPath(si), w: 11, fill: PINK, stroke: PINKDK },
      { id: 'large', d: openPath([[-104, 420], [-110, 402], [-112, 370], [-113, 330], [-111, 300], [-102, 283], [-84, 275], [-50, 276], [-10, 279], [30, 278], [70, 274], [96, 277], [110, 291], [116, 316], [117, 356], [114, 394], [104, 418], [80, 432], [46, 438], [18, 442], [4, 452]]), w: 24, fill: COLON, stroke: COLONDK },
      { id: 'rectum', d: 'M4,452 C2,462 0,472 0,484', w: 20, fill: COLON, stroke: COLONDK },
      { id: 'anus', d: 'M0,484 L0,495', w: 11, fill: '#C07B70', stroke: COLONDK },
    ];
    U.haloG = G(g); U.tube = G(g); U.sec = {};
    let s0 = 0;
    SEC.forEach(sc => {
      const smp = sample(g, sc.d, 3);
      sc.s0 = s0; sc.L = smp.L; sc.smp = smp; s0 += smp.L; U.sec[sc.id] = sc;
      if (sc.id === 'stomach') return;
      sc.halo = G(U.haloG);
      E('path', { d: sc.d, fill: 'none', stroke: HALO, 'stroke-width': sc.w + 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.35 }, sc.halo);
      E('path', { d: sc.d, fill: 'none', stroke: '#FFB8D0', 'stroke-width': sc.w + 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.6 }, sc.halo);
      sc.els = [
        E('path', { d: sc.d, fill: 'none', stroke: sc.stroke, 'stroke-width': sc.w + 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, U.tube),
        E('path', { d: sc.d, fill: 'none', stroke: sc.fill, 'stroke-width': sc.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, U.tube),
      ];
      sc.lit = E('path', { d: sc.d, fill: 'none', stroke: PINKLT, 'stroke-width': Math.max(4, sc.w * 0.5), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, U.tube);
    });
    const st = U.sec.stomach;
    const stD = closedPath([[14, 114], [30, 96], [58, 88], [88, 98], [106, 124], [112, 160], [106, 196], [86, 222], [54, 234], [22, 230], [-2, 218], [-17, 205], [-19, 193], [-4, 195], [16, 196], [30, 184], [35, 160], [29, 134]]);
    U.stD = stD;
    st.halo = G(U.haloG);
    E('path', { d: stD, fill: 'none', stroke: HALO, 'stroke-width': 34, opacity: 0.35 }, st.halo);
    E('path', { d: stD, fill: 'none', stroke: '#FFB8D0', 'stroke-width': 16, opacity: 0.6 }, st.halo);
    st.bag = G(U.tube);
    E('path', { d: stD, fill: PINK }, st.bag);
    E('path', { d: 'M40,112 C60,104 82,112 92,132 M44,150 C60,140 78,150 90,170 M40,190 C56,178 74,190 80,206 M14,206 C26,200 40,206 46,214', fill: 'none', stroke: '#E07F9A', 'stroke-width': 3, 'stroke-linecap': 'round' }, st.bag);
    st.lit = E('path', { d: stD, fill: PINKLT }, st.bag);
    E('path', { d: stD, fill: 'none', stroke: PINKDK, 'stroke-width': 5 }, st.bag);
    [U.sec.large, U.sec.rectum, U.sec.anus].forEach(sc => { sc.els.forEach(e => U.tube.appendChild(e)); U.tube.appendChild(sc.lit); });
    U.tube.appendChild(st.bag);
    E('ellipse', { cx: 0, cy: 497, rx: 9, ry: 4, fill: '#5A2A2A', stroke: COLONDK, 'stroke-width': 2 }, U.tube);
    U.mouth = G(g);
    E('path', { d: 'M-19,-1 C-12,-8 -5,-7 0,-4 C5,-7 12,-8 19,-1 C10,2 -10,2 -19,-1 Z', fill: '#E57D95', stroke: PINKDK, 'stroke-width': 2 }, U.mouth);
    E('path', { d: 'M-18,0 C-10,3 10,3 18,0 C12,11 -12,11 -18,0 Z', fill: '#F096AA', stroke: PINKDK, 'stroke-width': 2 }, U.mouth);
    U.total = s0;
    U.order = ['oes', 'stomach', 'small', 'large', 'rectum', 'anus'];
    U.pos = s => { s = clamp(s, 0, U.total); for (const id of U.order) { const sc = U.sec[id]; if (s <= sc.s0 + sc.L || id === 'anus') return sc.smp.at((s - sc.s0) / sc.L); } return [0, 495]; };
    U.sAt = (id, f) => U.sec[id].s0 + U.sec[id].L * f;
    U.g = g;
    return U;
  }

  /* ================= the gut diagram: mini (absorb), full (water, microbes), flipped (upside down) ================= */
  const gutG = G(root);
  const U = gutArt(gutG);
  // legs hooked over a bar, only for the upside-down beat (drawn behind the body)
  const legs = G(U.g); U.g.insertBefore(legs, U.g.firstChild);
  E('path', { d: 'M-104,612 L-126,536 M104,612 L126,536', stroke: '#C98E62', 'stroke-width': 26, 'stroke-linecap': 'round' }, legs);
  E('path', { d: 'M-128,530 l-10,-12 l16,-6 Z M128,530 l10,-12 l-16,-6 Z', fill: '#F2F7FA', stroke: '#F2F7FA', 'stroke-width': 10, 'stroke-linejoin': 'round' }, legs);
  E('path', { d: 'M-100,470 L-102,612 M100,470 L102,612', stroke: '#3A4F66', 'stroke-width': 54, 'stroke-linecap': 'round' }, legs);
  const bar = G(legs);
  E('line', { x1: -190, y1: 622, x2: 190, y2: 622, stroke: '#9DB0BF', 'stroke-width': 14, 'stroke-linecap': 'round' }, bar);
  const bol = G(U.g);
  const bolB = E('circle', { r: 9, fill: CHYME, stroke: '#FFF0CC', 'stroke-width': 1.5 }, bol);
  const bolC = E('circle', { r: 9, fill: WASTE, stroke: '#C79A72', 'stroke-width': 1.5 }, bol);
  const bolA = E('circle', { r: 9, fill: AMBER, stroke: '#FFE2A8', 'stroke-width': 1.5 }, bol);
  const wDrops = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92].map(f => {
    const el = E('path', { d: dropD(6), fill: ball(C.water, C.waterDk) }, U.g);
    const p = U.sec.large.smp.at(f), q = U.sec.large.smp.at(Math.min(1, f + 0.01));
    let nx = -(q[1] - p[1]), ny = q[0] - p[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
    if (nx * p[0] + ny * (p[1] - 350) < 0) { nx = -nx; ny = -ny; }
    return { el, f, p, nx, ny };
  });
  // bacteria specks inside the large intestine
  const specks = G(U.g), spk = [], sr0 = rng(41);
  for (let i = 0; i < 26; i++) { const f = (i + sr0()) / 26; spk.push({ el: E('circle', { r: 2.6, fill: BEADS[i % 4], opacity: 0.9 }, specks), p: U.sec.large.smp.at(f), ph: sr0() * TAU }); }
  const miniLab = T(root, 175, 612, 'small intestine', { size: 27, weight: 700, anchor: 'middle', fill: '#FFC2D4' });

  /* ================= A. the gut wall, cut away ================= */
  const PX0 = 380, PX1 = 1160, PY0 = 140, PY1 = 660, WY = 430, CAPY = 584;
  const aG = G(root);
  const call = G(aG);
  const callC = E('circle', { cx: 175, cy: 449, r: 36, fill: 'none', stroke: C.energy, 'stroke-width': 3.5, 'stroke-dasharray': '8 6' }, call);
  E('line', { x1: 196, y1: 420, x2: PX0, y2: PY0 + 24, stroke: C.energy, 'stroke-width': 2.5, opacity: 0.55 }, call);
  E('line', { x1: 196, y1: 478, x2: PX0, y2: PY1 - 24, stroke: C.energy, 'stroke-width': 2.5, opacity: 0.55 }, call);
  const panel = G(aG);
  const pid = 'dgVilliPanel';
  { const cp = E('clipPath', { id: pid }, defs()); E('rect', { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0, rx: 26 }, cp); }
  const pIn = G(panel, { 'clip-path': `url(#${pid})` });
  const pZ = G(pIn);
  E('rect', { x: -400, y: -400, width: 2000, height: 1600, fill: LUMEN }, pZ);
  const wallFill = E('path', { fill: CORE }, pZ);
  E('rect', { x: -400, y: CAPY - 28, width: 2000, height: 56, fill: '#5E1A26' }, pZ);
  E('rect', { x: -400, y: CAPY - 19, width: 2000, height: 38, fill: '#C93242' }, pZ);
  const rbcA = []; for (let i = 0; i < 12; i++) rbcA.push(E('ellipse', { rx: 13, ry: 7, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.5 }, pZ));
  const loops = E('path', { fill: 'none', stroke: '#E8424F', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pZ);
  const wallEdge = E('path', { fill: 'none', stroke: CELL, 'stroke-width': 15, 'stroke-linejoin': 'round' }, pZ);
  const wallLine = E('path', { fill: 'none', stroke: PINKDK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, pZ);
  const hiLine = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-dasharray': '10 7', 'stroke-linejoin': 'round' }, pZ);
  const NV = 11, VR = 24, VHT = 160, HI = 5, VXS = [];
  for (let i = 0; i < NV; i++) VXS.push(420 + i * 70);
  const molsA = [];
  for (let k = 0; k < 9; k++) {
    const g = G(pZ);
    if (k % 2 === 0) molGlucose(g, 13); else bead(g, 11, k);
    const lane = VXS[(k * 4 + 1) % NV];
    molsA.push({ g, lane, x0: lane + ((k * 37) % 70) - 35, y0: 262 + ((k * 53) % 120), ph: k / 9 });
  }
  E('rect', { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0, rx: 26, fill: 'none', stroke: '#3E6A80', 'stroke-width': 3 }, panel);
  const labGut = T(aG, PX0 + 28, PY0 + 46, 'inside the gut', { size: 27, weight: 600, fill: C.muted });
  const labWall = T(aG, PX0 + 28, WY + 62, 'gut wall', { size: 27, weight: 600, fill: '#FFC2D4' });
  const labBlood = T(aG, PX0 + 28, CAPY + 58, 'blood', { size: 27, weight: 700, fill: '#FF9AA4' });
  const absArrow = arrow(aG, 1100, 300, 1100, 560, { color: C.energy, width: 6 });
  const absLab = T(aG, 1084, 306, 'absorbed', { size: 28, weight: 700, anchor: 'end', fill: C.energy });
  const labVilli = G(aG);
  T(labVilli, 1130, 198, 'villi', { size: 40, weight: 700, anchor: 'end' });
  T(labVilli, 1130, 232, 'millions of them', { size: 26, weight: 600, anchor: 'end', fill: C.muted, font: FB });
  [8, 9, 10].forEach(i => leader(labVilli, 1070, 244, VXS[i], WY - VHT + 6));
  const labOne = G(aG);
  T(labOne, VXS[HI], 196, 'villus', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });
  T(labOne, VXS[HI], 230, 'just one', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  function comb(rise) {
    const pts = [[PX0 - 60, WY]];
    VXS.forEach((xc, i) => {
      const h = VHT * rise[i], r = Math.min(VR, h);
      pts.push([xc - VR, WY]); pts.push([xc - VR, WY - h + r]);
      for (let k = 1; k < 8; k++) { const a = Math.PI + k / 8 * Math.PI; pts.push([xc + VR * Math.cos(a), WY - h + r + r * Math.sin(a)]); }
      pts.push([xc + VR, WY - h + r]); pts.push([xc + VR, WY]);
    });
    pts.push([PX1 + 60, WY]);
    return pts;
  }
  const toD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');

  /* ================= B. one villus, close up ================= */
  const VB = [390, 640];
  const vB = G(root);
  E('rect', { x: -360, y: 0, width: 720, height: 170, fill: CORE }, vB);
  E('rect', { x: -360, y: -22, width: 720, height: 22, fill: CELL }, vB);
  E('line', { x1: -360, y1: -22, x2: 360, y2: -22, stroke: PINKDK, 'stroke-width': 3 }, vB);
  const vOuter = 'M-100,-11 L-100,-380 A100,100 0 0 1 100,-380 L100,-11';
  E('path', { d: vOuter + ' Z', fill: CELL }, vB);
  E('path', { d: 'M-76,170 L-76,-380 A76,76 0 0 1 76,-380 L76,170 Z', fill: CORE }, vB);
  E('path', { d: vOuter, fill: 'none', stroke: PINKDK, 'stroke-width': 3 }, vB);
  E('path', { d: 'M-76,-22 L-76,-380 A76,76 0 0 1 76,-380 L76,-22', fill: 'none', stroke: PINKDK, 'stroke-width': 2 }, vB);
  const lactHalo = E('path', { d: 'M0,170 L0,-300', stroke: '#FFE9A8', 'stroke-width': 64, 'stroke-linecap': 'round', opacity: 0.3 }, vB);
  const lacteal = E('path', { d: 'M-17,170 L-17,-300 A17,17 0 0 1 17,-300 L17,170 Z', fill: '#FFF0C8', stroke: '#E0C27A', 'stroke-width': 2.5 }, vB);
  const loopD = 'M-48,170 L-48,-380 A48,48 0 0 1 48,-380 L48,170';
  const bloodHalo = E('path', { d: loopD, fill: 'none', stroke: '#FF5A68', 'stroke-width': 30, opacity: 0.3 }, vB);
  E('path', { d: 'M-48,-330 C-16,-346 16,-314 48,-330 M-48,-250 C-16,-266 16,-234 48,-250 M-48,-170 C-16,-186 16,-154 48,-170 M-48,-90 C-16,-106 16,-74 48,-90', fill: 'none', stroke: '#D2384A', 'stroke-width': 5 }, vB);
  E('path', { d: 'M-48,170 L-48,-380 A48,48 0 0 1 0,-428', fill: 'none', stroke: C.blood, 'stroke-width': 10 }, vB);
  E('path', { d: 'M0,-428 A48,48 0 0 1 48,-380 L48,170', fill: 'none', stroke: '#B03048', 'stroke-width': 10 }, vB);
  const loopS = sample(vB, loopD, 4);
  const rbcB = []; for (let i = 0; i < 9; i++) rbcB.push(E('ellipse', { rx: 4.5, ry: 7, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.2 }, vB));
  { // cell borders and nuclei along the one-cell-thick wall
    let dv = '', dn = '';
    for (let y = -40; y > -380; y -= 32) { dv += `M-100,${y} L-76,${y} M76,${y} L100,${y} `; dn += `M-92,${y + 16} a4.5,4.5 0 1,0 9,0 a4.5,4.5 0 1,0 -9,0 M83,${y + 16} a4.5,4.5 0 1,0 9,0 a4.5,4.5 0 1,0 -9,0 `; }
    for (let k = 1; k < 9; k++) { const a = Math.PI + k / 9 * Math.PI, c = Math.cos(a), s = Math.sin(a); dv += `M${(c * 76).toFixed(1)},${(-380 + s * 76).toFixed(1)} L${(c * 100).toFixed(1)},${(-380 + s * 100).toFixed(1)} `; const b = a + Math.PI / 18; dn += `M${(Math.cos(b) * 88 - 4.5).toFixed(1)},${(-380 + Math.sin(b) * 88).toFixed(1)} a4.5,4.5 0 1,0 9,0 a4.5,4.5 0 1,0 -9,0 `; }
    for (let x = -340; x < 360; x += 32) if (Math.abs(x) > 100) { dv += `M${x},-22 L${x},0 `; dn += `M${x + 11.5},-11 a4.5,4.5 0 1,0 9,0 a4.5,4.5 0 1,0 -9,0 `; }
    E('path', { d: dv, fill: 'none', stroke: PINKDK, 'stroke-width': 2, opacity: 0.8 }, vB);
    E('path', { d: dn, fill: '#9B7AD8', opacity: 0.85 }, vB);
  }
  const wallGlow = E('path', { d: 'M-88,-22 L-88,-380 A88,88 0 0 1 88,-380 L88,-22', fill: 'none', stroke: '#FFF3F7', 'stroke-width': 20, opacity: 0.55 }, vB);
  const surfGlow = E('path', { d: vOuter, fill: 'none', stroke: C.energy, 'stroke-width': 6, opacity: 0.9 }, vB);
  // glucose and amino acids into the blood (from the right); fats into the lacteal (from the left)
  const molsB = [];
  for (let k = 0; k < 8; k++) { const g = G(vB); if (k % 2 === 0) molGlucose(g, 12); else bead(g, 10, k); molsB.push({ g, y: -330 + k * 38, x0: 150 + (k % 3) * 34, d: k * 0.62 }); }
  const fats = [];
  for (let k = 0; k < 6; k++) { const g = k % 2 === 0 ? fattyAcid(vB) : glycerol(vB); fats.push({ g, y: -280 + k * 34, x0: -150 - (k % 3) * 30, d: k * 0.42 }); }
  // the four slots
  const SL = [
    { text: 'large surface area', word: 'Big', col: C.energy, tx: 484, ty: 262 },
    { text: 'thin wall, 1 cell thick', word: 'Thin', col: '#FFB8D0', tx: 480, ty: 400 },
    { text: 'good blood supply', word: 'Bloody', col: '#FF7A86', tx: 438, ty: 470 },
    { text: 'a lacteal for fats', word: 'Lacteal', col: '#FFE9A8', tx: 405, ty: 452 },
  ];
  const SLX = 640, SLW = 520, SLY = [232, 340, 448, 556];
  const slotG = G(root);
  SL.forEach((s, i) => {
    const y = SLY[i];
    s.g = G(slotG);
    s.empty = E('rect', { x: SLX, y: y - 42, width: SLW, height: 84, rx: 20, fill: 'rgba(20,54,70,0.35)', stroke: C.faint, 'stroke-width': 2.5, 'stroke-dasharray': '10 8' }, s.g);
    s.full = E('rect', { x: SLX, y: y - 42, width: SLW, height: 84, rx: 20, fill: C.card, stroke: s.col, 'stroke-width': 3 }, s.g);
    s.disc = E('circle', { cx: SLX + 44, cy: y, r: 24, fill: C.faint }, s.g);
    s.discOn = E('circle', { cx: SLX + 44, cy: y, r: 24, fill: s.col }, s.g);
    T(s.g, SLX + 44, y + 10, String(i + 1), { size: 28, weight: 700, anchor: 'middle', fill: C.bg0 });
    s.lab = T(s.g, SLX + 88, y + 10, s.text, { size: 30, weight: 600 });
    s.wordEl = E('text', { x: SLX + 88, y: y + 13, 'font-size': 38, 'font-weight': 700, 'font-family': FD, fill: C.ink }, s.g);
    E('tspan', { fill: C.energy }, s.wordEl).textContent = s.word[0];
    E('tspan', {}, s.wordEl).textContent = s.word.slice(1);
    s.lead = leader(slotG, SLX - 6, y, s.tx, s.ty, s.col);
  });
  // thin-wall inset
  const inset = G(root);
  const IC = [150, 420], IR = 100;
  { const cp = E('clipPath', { id: 'dgVilliInset' }, defs()); E('circle', { r: IR }, cp); }
  const insG = G(inset); tr(insG, IC[0], IC[1]);
  E('circle', { r: IR + 7, fill: '#08161F' }, insG);
  const insIn = G(insG, { 'clip-path': 'url(#dgVilliInset)' });
  E('rect', { x: -120, y: -120, width: 240, height: 240, fill: LUMEN }, insIn);
  E('rect', { x: 22, y: -120, width: 100, height: 240, fill: CORE }, insIn);
  E('rect', { x: 46, y: -120, width: 40, height: 240, fill: '#C93242' }, insIn);
  const insRbc = [0, 1, 2, 3].map(() => E('ellipse', { rx: 8, ry: 12, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.5 }, insIn));
  [-92, -30, 32].forEach(y => { E('rect', { x: -30, y, width: 52, height: 58, rx: 10, fill: CELL, stroke: PINKDK, 'stroke-width': 2.5 }, insIn); E('circle', { cx: -4, cy: y + 29, r: 8, fill: '#9B7AD8', opacity: 0.85 }, insIn); });
  const hop = G(insIn); molGlucose(hop, 14);
  const hopArrow = G(insIn);
  E('path', { d: 'M-28,64 L20,64', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round' }, hopArrow);
  E('path', { d: 'M-30,64 L-20,57 L-20,71 Z M22,64 L12,57 L12,71 Z', fill: '#ffffff' }, hopArrow);
  E('circle', { r: IR, fill: 'none', stroke: '#FFB8D0', 'stroke-width': 6 }, insG);
  const insLink = G(inset);
  E('circle', { cx: VB[0] - 100, cy: VB[1] - 220, r: 22, fill: 'none', stroke: '#FFB8D0', 'stroke-width': 3 }, insLink);
  E('line', { x1: IC[0] + 84, y1: IC[1] - 54, x2: VB[0] - 112, y2: VB[1] - 238, stroke: '#FFB8D0', 'stroke-width': 2.5, opacity: 0.7 }, insLink);
  E('line', { x1: IC[0] + 84, y1: IC[1] + 54, x2: VB[0] - 112, y2: VB[1] - 202, stroke: '#FFB8D0', 'stroke-width': 2.5, opacity: 0.7 }, insLink);
  const insTop = T(inset, IC[0], IC[1] - IR - 22, 'one cell', { size: 27, weight: 700, anchor: 'middle', fill: '#FFC2D4' });
  const insBot = T(inset, IC[0], IC[1] + IR + 40, 'short distance', { size: 27, weight: 700, anchor: 'middle', fill: '#FFC2D4' });
  // concentration gradient card
  const grad = G(root);
  card(grad, 36, 300, 232, 268, { fill: C.card, stroke: C.line });
  T(grad, 152, 338, 'concentration', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const gGut = E('rect', { x: 70, y: 380, width: 52, height: 140, rx: 8, fill: C.glucose }, grad);
  const gBlood = E('rect', { x: 184, y: 488, width: 52, height: 32, rx: 8, fill: C.blood }, grad);
  T(grad, 96, 553, 'gut', { size: 26, weight: 600, anchor: 'middle' });
  T(grad, 210, 553, 'blood', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9AA4' });
  const gArrow = arrow(grad, 126, 388, 182, 480, { color: C.ink, width: 4 });
  const gSteep = T(grad, 156, 404, 'steep', { size: 26, weight: 700, fill: C.energy });

  /* ================= C. showpiece: spread flat, half a badminton court ================= */
  const Cg = G(root);
  const hdr = G(Cg); tr(hdr, 600, 150);
  { const c = noteChip(hdr, 'large surface area', { size: 30, color: C.energy, stroke: C.energy, padX: 60 }); c.label.setAttribute('x', 19); E('circle', { cx: -c.w / 2 + 31, cy: 0, r: 19, fill: C.energy }, hdr); T(hdr, -c.w / 2 + 31, 9, '1', { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 }); }
  const foldG = G(Cg);
  const fold = E('path', { fill: 'none', stroke: CELL, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, foldG);
  const raw = []; const NF = 7, FR = 23, FH = 150, PITCH = 70, X0 = -(NF * PITCH) / 2;
  raw.push([X0 - 6, 0]);
  for (let i = 0; i < NF; i++) {
    const xc = X0 + PITCH / 2 + i * PITCH;
    raw.push([xc - FR, 0]); raw.push([xc - FR, -(FH - FR)]);
    for (let k = 1; k < 12; k++) { const a = Math.PI + k / 12 * Math.PI; raw.push([xc + FR * Math.cos(a), -(FH - FR) + FR * Math.sin(a)]); }
    raw.push([xc + FR, -(FH - FR)]); raw.push([xc + FR, 0]);
  }
  raw.push([-X0 + 6, 0]);
  const STEP = 8, FP = [raw[0]];
  { let carry = 0; for (let i = 1; i < raw.length; i++) { const [x0, y0] = raw[i - 1], [x1, y1] = raw[i], seg = Math.hypot(x1 - x0, y1 - y0); let pos = STEP - carry; while (pos <= seg) { const f = pos / seg; FP.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]); pos += STEP; } carry = seg - (pos - STEP); } }
  const NP = FP.length, SPAN = (NP - 1) * STEP, SEND = 1080 / SPAN;
  const SP = FP.map((p, i) => [-SPAN / 2 + i * STEP, 0]);
  const LINEY = 318;
  const sheet = E('rect', { fill: '#F7B6C8', rx: 4 }, Cg);
  const court = G(Cg);
  const CX0 = 265, CY0 = 318, CW = 670, CH = 305, M = 50;   // 50 px per metre
  const cl = (x1, y1, x2, y2, w) => E('line', { x1, y1, x2, y2, stroke: '#F2F7FA', 'stroke-width': w || 4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, court);
  const cx = CX0 + CW / 2, cyy = CY0 + CH / 2;
  const courtLines = [
    cl(CX0, CY0, CX0 + CW, CY0), cl(CX0 + CW, CY0, CX0 + CW, CY0 + CH), cl(CX0 + CW, CY0 + CH, CX0, CY0 + CH), cl(CX0, CY0 + CH, CX0, CY0),
    cl(CX0, CY0 + 0.46 * M, CX0 + CW, CY0 + 0.46 * M, 3), cl(CX0, CY0 + CH - 0.46 * M, CX0 + CW, CY0 + CH - 0.46 * M, 3),
    cl(cx - 1.98 * M, CY0, cx - 1.98 * M, CY0 + CH, 3), cl(cx + 1.98 * M, CY0, cx + 1.98 * M, CY0 + CH, 3),
    cl(CX0 + 0.76 * M, CY0, CX0 + 0.76 * M, CY0 + CH, 3), cl(CX0 + CW - 0.76 * M, CY0, CX0 + CW - 0.76 * M, CY0 + CH, 3),
    cl(CX0, cyy, cx - 1.98 * M, cyy, 3), cl(cx + 1.98 * M, cyy, CX0 + CW, cyy, 3),
  ];
  const net = E('line', { x1: cx, y1: CY0 - 14, x2: cx, y2: CY0 + CH + 14, stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round' }, court);
  const area = T(Cg, (CX0 + cx) / 2, cyy + 20, '≈ 30 m²', { size: 58, weight: 700, anchor: 'middle', fill: '#3A0C1C' });
  const halfLab = T(Cg, cx, CY0 + CH + 58, 'about half a badminton court', { size: 32, weight: 700, anchor: 'middle' });
  const youG = G(Cg); tr(youG, 212, CY0 + CH);
  const you = person(youG, { shirt: '#5B8DEF', shorts: '#3A4F66' }); tr(you, 0, 0, 0.45); you.pose();
  const youLab = T(Cg, 212, CY0 + CH + 40, 'you', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D. the large intestine: labels, lens of bacteria ================= */
  const Dg = G(root);
  const lgLab = G(Dg);
  E('line', { x1: 588, y1: 589, x2: 450, y2: 590, stroke: C.muted, 'stroke-width': 2.5 }, lgLab);
  E('circle', { cx: 450, cy: 590, r: 5, fill: C.muted }, lgLab);
  T(lgLab, 600, 598, 'large intestine', { size: 29, weight: 600 });
  const smLab = G(Dg);
  E('line', { x1: 588, y1: 511, x2: 414, y2: 521, stroke: C.muted, 'stroke-width': 2.5 }, smLab);
  E('circle', { cx: 414, cy: 521, r: 5, fill: C.muted }, smLab);
  T(smLab, 600, 520, 'small intestine', { size: 29, weight: 600, fill: C.muted });
  const wChip = G(Dg); tr(wChip, 1000, 589);
  { const c = noteChip(wChip, 'most of the water absorbed', { size: 25, color: '#9FE3F8', padX: 48 }); c.label.setAttribute('x', 13); const d = E('path', { d: dropD(8.5), fill: ball(C.water, C.waterDk) }, wChip); tr(d, -c.w / 2 + 26, 3); }
  const fChip = noteChip(Dg, 'solid faeces', { color: '#E3C2A6' }); tr(fChip, 985, 655);
  const LX = 990, LY = 392, LR = 160;
  const lens = G(Dg);
  { const cp = E('clipPath', { id: 'dgVilliLens' }, defs()); E('circle', { r: LR }, cp); }
  E('circle', { r: LR + 9, fill: '#08161F' }, lens);
  const lensIn = G(lens, { 'clip-path': 'url(#dgVilliLens)' });
  E('circle', { r: LR, fill: '#2A2014' }, lensIn);
  const fibres = [[-150, -80, 1.2], [-160, 30, -0.6], [-130, 110, 0.4], [-40, -140, 2.2]].map(([x, y, a], i) => {
    const pts = []; for (let k = 0; k <= 12; k++) pts.push([k * 26, Math.sin(k * 0.9 + i) * 8]);
    const g = G(lensIn); tr(g, x, y, 1, a * 20);
    const p = E('path', { d: openPath(pts), fill: 'none', stroke: '#7FBF4D', 'stroke-width': 9, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    E('path', { d: openPath(pts), fill: 'none', stroke: '#C4EE9C', 'stroke-width': 2.5, 'stroke-linecap': 'round', opacity: 0.7 }, g);
    return p;
  });
  const bugs = [], br = rng(77);
  for (let i = 0; i < 17; i++) {
    const g = G(lensIn), col = BEADS[i % 4], kind = i % 3;
    if (kind === 0) E('rect', { x: -14, y: -6, width: 28, height: 12, rx: 6, fill: ball(col, '#334'), stroke: '#ffffff', 'stroke-opacity': 0.5, 'stroke-width': 1.5 }, g);
    else if (kind === 1) { E('circle', { cx: -6, r: 6.5, fill: ball(col, '#334') }, g); E('circle', { cx: 6, r: 6.5, fill: ball(col, '#334') }, g); }
    else E('path', { d: 'M-12,4 C-8,-8 6,-8 12,2', fill: 'none', stroke: col, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    const a = br() * TAU, r = 30 + br() * 112;
    bugs.push({ g, x: Math.cos(a) * r, y: Math.sin(a) * r * 0.9, ph: br() * TAU, rot: br() * 360, d: i * 0.06 });
  }
  E('circle', { r: LR, fill: 'none', stroke: '#B5D6E6', 'stroke-width': 7 }, lens);
  E('circle', { r: LR + 6, fill: 'none', stroke: '#2C5468', 'stroke-width': 3 }, lens);
  tr(lens, LX, LY);
  const lensT = noteChip(Dg, 'large intestine', { size: 28, color: C.energy, fill: 'rgba(10,27,39,0.85)' }); tr(lensT, LX, 190);
  const bugLeg = G(Dg);
  { const ic = G(bugLeg); E('rect', { x: -14, y: -6, width: 28, height: 12, rx: 6, fill: ball('#4DD0C8', '#334') }, ic); tr(ic, LX - 140, 604); T(bugLeg, LX - 116, 613, 'trillions of bacteria', { size: 27, weight: 600, fill: '#9EEDE6' }); }
  const fibLeg = G(Dg);
  { const ic = G(fibLeg); E('path', { d: 'M-14,2 C-7,-8 0,8 7,-2 C10,-6 13,-4 15,-2', fill: 'none', stroke: '#7FBF4D', 'stroke-width': 7, 'stroke-linecap': 'round' }, ic); tr(ic, LX - 140, 655); T(fibLeg, LX - 116, 664, 'feeding on fibre', { size: 27, weight: 600, fill: '#C4EE9C' }); }
  const sci = G(Dg); tr(sci, 1086, 252, 1, 8);
  noteChip(sci, 'science today', { size: 26, color: C.bg0, fill: C.energy, stroke: 'none' });
  const sciQ = G(Dg);
  T(sciQ, LX, 618, 'how do they affect', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  T(sciQ, LX, 656, 'your health?', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= E. peristalsis ================= */
  const Eg = G(root);
  const pTitle = noteChip(Eg, 'peristalsis', { size: 34, color: C.energy, stroke: C.energy, weight: 700 }); tr(pTitle, 600, 140);
  const TY = 330, TX0 = 110, TX1 = 1090;
  const pOuter = E('path', { fill: PINK, stroke: PINKDK, 'stroke-width': 4 }, Eg);
  const pLumen = E('path', { fill: '#5E2038' }, Eg);
  const pBol = G(Eg); E('circle', { r: 30, fill: AMBER, stroke: '#FFE2A8', 'stroke-width': 2 }, pBol); E('ellipse', { cx: -9, cy: -12, rx: 10, ry: 6, fill: '#ffffff', opacity: 0.55 }, pBol);
  const pRings = E('path', { fill: 'none', stroke: '#C9577A', 'stroke-width': 5, 'stroke-linecap': 'round' }, Eg);
  const pHot = E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, Eg);
  const pQ = T(Eg, 0, 0, '?', { size: 80, weight: 700, anchor: 'middle', fill: C.energy });
  const pSq = G(Eg); { const c = noteChip(pSq, 'muscles squeeze', { color: '#FFC2D4' }); tr(c, 0, 0); }
  const pPush = arrow(Eg, 0, 0, 90, 0, { color: C.energy, width: 7 });
  const pPushL = T(Eg, 0, 0, 'pushed forward', { size: 27, weight: 700, fill: C.energy });
  const paste = G(Eg), PCY = 580;
  E('path', { d: `M314,${PCY - 40} L334,${PCY - 40} L334,${PCY + 40} L314,${PCY + 40} Z`, fill: '#DDE6EC', stroke: '#8FB0C2', 'stroke-width': 3 }, paste);
  E('path', { d: [-28, -14, 0, 14, 28].map(y => `M317,${PCY + y} L331,${PCY + y}`).join(' '), stroke: '#8FB0C2', 'stroke-width': 2.5 }, paste);
  const pTube = E('path', { fill: ball('#F7FAFC', '#AEBBC6'), stroke: '#8FB0C2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, paste);
  const pBand = E('path', { fill: '#4CC9F0', opacity: 0.9 }, paste);
  E('rect', { x: 712, y: PCY - 15, width: 34, height: 30, rx: 5, fill: '#E9EFF3', stroke: '#8FB0C2', 'stroke-width': 3 }, paste);
  E('path', { d: `M720,${PCY - 15} L720,${PCY + 15} M729,${PCY - 15} L729,${PCY + 15} M738,${PCY - 15} L738,${PCY + 15}`, stroke: '#A9BCC9', 'stroke-width': 2 }, paste);
  const ribbon = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 24, 'stroke-linecap': 'round' }, paste);
  const ribbonS = E('path', { fill: 'none', stroke: '#5FD0F2', 'stroke-width': 8, 'stroke-linecap': 'round' }, paste);
  const thumbs = G(paste);
  const thumbT = E('ellipse', { rx: 18, ry: 23, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2.5 }, thumbs);
  const thumbB = E('ellipse', { rx: 18, ry: 23, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2.5 }, thumbs);
  const pasteLab = T(Eg, 530, 692, 'like toothpaste in a tube', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= F. upside down ================= */
  const Fg = G(root);
  const upA = arrow(Fg, 780, 600, 780, 430, { color: C.energy, width: 8 });
  const upL = T(Fg, 805, 520, 'food still goes up', { size: 28, weight: 700, fill: C.energy });
  const gvA = arrow(Fg, 1010, 250, 1010, 400, { color: C.muted, width: 7 });
  const gvL = T(Fg, 1040, 336, 'gravity', { size: 28, weight: 600, fill: C.muted });
  const upChip = noteChip(Fg, 'peristalsis, not gravity', { size: 28, color: C.ink, stroke: C.energy }); tr(upChip, 900, 160);

  /* ================= G. stomach acid ================= */
  const Gg = G(root);
  const SS = 2.5, SOX = 360 - 46 * SS, SOY = 440 - 160 * SS;   // stomach local -> stage
  const stomG = G(Gg); tr(stomG, SOX, SOY, SS);
  E('path', { d: 'M4,70 C4,90 7,104 14,118', fill: 'none', stroke: PINKDK, 'stroke-width': 20, 'stroke-linecap': 'round' }, stomG);
  E('path', { d: 'M4,70 C4,90 7,104 14,118', fill: 'none', stroke: PINK, 'stroke-width': 13, 'stroke-linecap': 'round' }, stomG);
  E('path', { d: 'M-20,199 C-30,203 -38,210 -42,222', fill: 'none', stroke: PINKDK, 'stroke-width': 17, 'stroke-linecap': 'round' }, stomG);
  E('path', { d: 'M-20,199 C-30,203 -38,210 -42,222', fill: 'none', stroke: PINK, 'stroke-width': 11, 'stroke-linecap': 'round' }, stomG);
  E('path', { d: U.stD, fill: PINK, stroke: PINKDK, 'stroke-width': 2.2 }, stomG);
  { const cp = E('clipPath', { id: 'dgVilliStomach' }, defs()); E('path', { d: U.stD, transform: 'translate(46 162) scale(0.86) translate(-46 -162)' }, cp); }
  const stIn = G(stomG, { 'clip-path': 'url(#dgVilliStomach)' });
  E('rect', { x: -40, y: 60, width: 200, height: 200, fill: '#3A3A16' }, stIn);
  E('rect', { x: -40, y: 60, width: 200, height: 200, fill: 'rgba(200,232,90,0.22)' }, stIn);
  const acidBub = bubbles(stIn, -10, 100, 120, 130, { n: 14, r: 3, seed: 7, speed: 0.28, color: 'rgba(216,240,122,0.9)', fill: 'rgba(216,240,122,0.15)' });
  const stFront = G(Gg);
  const food = G(stFront); tr(food, 372, 430);
  E('path', { d: closedPath([[-46, -30], [-10, -40], [34, -32], [48, -4], [40, 24], [0, 32], [-40, 24], [-52, -6]]), fill: ball('#F0C274', '#A8742E'), stroke: '#FFE2A8', 'stroke-width': 3 }, food);
  const chain = G(stFront);
  const chainB = [0, 1, 2, 3, 4].map(i => { const b = bead(chain, 11, i); return b; });
  const germs = [], gr0 = rng(5);
  for (let k = 0; k < 5; k++) { const g = germ(stFront, 16); const x = cross(stFront, 14); germs.push({ g, x, tx: [372, 456, 486, 352, 262][k] + gr0() * 8, ty: [308, 326, 412, 490, 548][k] + gr0() * 8, d: k * 0.45 }); }
  const prots = [0, 1, 2].map(i => { const g = G(stFront); const h = E('circle', { r: 34, fill: glow(C.lactic) }, g); enzyme(g, 18, C.lactic, C.lacticDk); return { g, h, x: [306, 430, 462][i], y: [524, 540, 470][i] }; });
  const hcl = G(Gg);
  E('line', { x1: 360, y1: 640, x2: 360, y2: 596, stroke: '#D8F07A', 'stroke-width': 2.5 }, hcl);
  E('circle', { cx: 360, cy: 596, r: 5, fill: '#D8F07A' }, hcl);
  T(hcl, 360, 678, 'hydrochloric acid', { size: 30, weight: 700, anchor: 'middle', fill: '#E4F59A' });
  const AC = [
    { y: 262, text: 'digests the food itself?', col: C.muted },
    { y: 392, text: 'kills harmful microbes', col: C.ink },
    { y: 522, text: 'acid conditions for protease', col: C.ink },
  ].map((a, i) => {
    const g = G(Gg); tr(g, 900, a.y);
    const c = noteChip(g, a.text, { size: 28, color: a.col });
    const mk = i === 0 ? cross(g, 13) : tick(g, 14); tr(mk, c.w / 2 + 32, 0);
    a.g = g; a.mk = mk; a.w = c.w;
    if (i === 0) a.st = strike(g, -c.w / 2 + 10, 0, c.w / 2 - 10, C.bad);
    return a;
  });

  /* ================= update ================= */
  // beat windows
  const tZ = at('zoom'), tArea = at('area'), tThin = at('thin'), tWater = at('water'), tPer = at('peristalsis'), tUp = at('upside'), tAcid = at('acid');
  return t => {
    /* --- gut diagram placement --- */
    const miniA = win(t, S.first - 0.4, tZ + 0.4, 0.4);
    const fullA = win(t, tWater + 0.3, tPer + 0.2, 0.45);
    const flipA = win(t, tUp - 0.2, tAcid + 0.1, 0.4);
    op(gutG, Math.max(miniA, fullA, flipA));
    op(legs, flipA > 0 ? 1 : 0);
    op(U.mouth, 1);
    if (flipA > 0) {
      const f = P(t, tUp + 0.15, 1.0, ease);
      U.g.setAttribute('transform', `translate(600 410) rotate(${(180 * f).toFixed(2)}) scale(0.74) translate(0 -230)`);
      tr(gutG, 0, 0);
    } else if (fullA > 0) { U.g.setAttribute('transform', ''); tr(gutG, 330, 200, 1); }
    else { U.g.setAttribute('transform', ''); tr(gutG, 175, 236, 0.6); }
    // lights on the gut
    const lit = { small: miniA * P(t, mid('absorb', 0.66), 0.5, linear), large: win(t, tWater + 0.6, tPer, 0.4), rectum: win(t, mid('water', 0.78), tPer, 0.4), oes: flipA * win(t, tUp + 1.0, tAcid + 1, 0.3) };
    ['oes', 'small', 'large', 'rectum'].forEach(id => { const v = lit[id] || 0, sc = U.sec[id]; op(sc.halo, v * 0.45 * (0.8 + 0.2 * wave(t, 1.1))); op(sc.lit, v * 0.9); });
    op(U.sec.anus.halo, 0); op(U.sec.anus.lit, 0); op(U.sec.stomach.halo, 0); op(U.sec.stomach.lit, 0);
    op(miniLab, miniA * P(t, mid('absorb', 0.7), 0.4, linear));
    // the leftovers: small intestine -> large intestine -> rectum (water), then up the oesophagus (upside down)
    let B = null;
    if (fullA > 0) {
      const s0 = U.sAt('small', 0.9), s1 = U.sAt('rectum', 0.55);
      const u = P(t, mid('water', 0.08), mid('water', 0.8) - mid('water', 0.08), ease);
      B = { s: lerp(s0, s1, u), k: 1 + P(t, mid('water', 0.3), 2.6, linear), r: 8 + 2 * u };
    } else if (flipA > 0) B = { s: lerp(0, U.sAt('stomach', 0.35), P(t, tUp + 1.2, end('upside') - tUp - 1.4, ease)), k: 0, r: 9 };
    if (!B) op(bol, 0);
    else { const p = U.pos(B.s); tr(bol, p[0], p[1], B.r / 9); op(bol, 1); op(bolA, B.k <= 0 ? 1 : 0); op(bolB, B.k > 0 ? 1 : 0); op(bolC, clamp(B.k - 1)); }
    wDrops.forEach(w => {
      const t0 = lerp(mid('water', 0.12), mid('water', 0.8), w.f), u = clamp((t - t0) / 1.2);
      op(w.el, fullA * (u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0));
      if (u > 0 && u < 1) tr(w.el, w.p[0] + w.nx * (8 + 36 * easeOut(u)), w.p[1] + w.ny * (8 + 36 * easeOut(u)));
    });
    const spA = fullA * P(t, at('microbes') + 0.2, 1.2, linear);
    op(specks, spA);
    if (spA > 0) spk.forEach((s, i) => tr(s.el, s.p[0] + Math.sin(t * 2.2 + s.ph) * 4 * calm, s.p[1] + Math.cos(t * 1.9 + s.ph) * 4 * calm));

    /* --- A. the wall --- */
    const aA = Math.min(P(t, S.first - 0.4, 0.5, linear), 1 - P(t, tZ + 0.5, 0.6, linear));
    op(aG, aA);
    if (aA > 0) {
      const rise = VXS.map((x, i) => P(t, mid('villi', 0.04) + Math.abs(i - HI) * 0.08, 1.0, easeOut));
      const pts = comb(rise);
      const d = toD(pts);
      wallFill.setAttribute('d', d + ` L${PX1 + 60},${PY1 + 400} L${PX0 - 60},${PY1 + 400} Z`);
      wallEdge.setAttribute('d', d); wallLine.setAttribute('d', d);
      let ld = '';
      VXS.forEach((xc, i) => { const h = VHT * rise[i]; if (h > 40) ld += `M${xc - 11},${CAPY - 16} L${xc - 11},${WY - h + 24} A11,11 0 0 1 ${xc + 11},${WY - h + 24} L${xc + 11},${CAPY - 16} `; });
      loops.setAttribute('d', ld || 'M0,0'); op(loops, ld ? 1 : 0);
      const hp = P(t, mid('villi', 0.72), 0.5, linear);
      if (hp > 0) { const xc = VXS[HI], h = VHT * rise[HI]; hiLine.setAttribute('d', `M${xc - VR - 3},${WY} L${xc - VR - 3},${WY - h + VR} A${VR + 3},${VR + 3} 0 0 1 ${xc + VR + 3},${WY - h + VR} L${xc + VR + 3},${WY}`); hiLine.setAttribute('stroke-dashoffset', (-t * 30).toFixed(1)); }
      op(hiLine, hp);
      // zoom into the highlighted villus
      const z = P(t, tZ - 0.05, 1.3, easeIn), zx = VXS[HI], zy = WY - 70;
      pZ.setAttribute('transform', `translate(${zx} ${zy}) scale(${(1 + 3.2 * z).toFixed(4)}) translate(${-zx} ${-zy})`);
      const flow = t * 80;
      rbcA.forEach((e, i) => { attr(e, 'cx', PX0 - 40 + ((i * 76 + flow) % 912)); attr(e, 'cy', CAPY + (i % 2 ? 5 : -5)); });
      molsA.forEach((m, k) => {
        const u = (((t - S.first) / 3.6) + m.ph) % 1;
        let x, y;
        if (u < 0.42) { const q = ease(u / 0.42); x = lerp(m.x0, m.lane, q); y = lerp(m.y0, WY - 16, q); }
        else if (u < 0.56) { const q = (u - 0.42) / 0.14; x = m.lane; y = lerp(WY - 16, WY + 40, q); }
        else if (u < 0.68) { const q = (u - 0.56) / 0.12; x = m.lane; y = lerp(WY + 40, CAPY, q); }
        else { const q = (u - 0.68) / 0.32; x = m.lane + q * 280; y = CAPY; }
        tr(m.g, x + (u < 0.42 ? Math.sin(t * 1.3 + k) * 4 * calm : 0), y, u > 0.6 ? 0.85 : 1);
        op(m.g, (t > S.first ? 1 : 0) * Math.min(1, u * 14, (1 - u) * 8));
      });
      op(labGut, win(t, S.first, mid('villi', 0.3), 0.4));
      op(labWall, win(t, mid('absorb', 0.08), mid('villi', 0.15), 0.4));
      op(labBlood, P(t, mid('absorb', 0.12), 0.4, linear));
      absArrow.set(P(t, mid('absorb', 0.28), 0.8)); op(absArrow, win(t, mid('absorb', 0.26), mid('villi', 0.2), 0.3)); op(absLab, win(t, mid('absorb', 0.32), mid('villi', 0.2), 0.3));
      op(labVilli, win(t, mid('villi', 0.42), tZ, 0.4) * (1 - 0.6 * P(t, mid('villi', 0.72), 0.4, linear)));
      op(labOne, win(t, mid('villi', 0.74), tZ + 0.2, 0.35));
      op(call, win(t, S.first, tZ, 0.4));
    }

    /* --- B. the villus and its four slots --- */
    const bA = Math.min(win(t, tZ + 0.25, mid('area', 0.13), 0.5), 1) + win(t, tThin - 0.15, tWater + 0.4, 0.45);
    op(vB, clamp(bA));
    if (bA > 0) {
      const g = P(t, tZ + 0.2, 1.3, easeOut), ret = P(t, tWater, 1.2, ease);
      let x = lerp(VXS[HI], VB[0], g), y = lerp(WY, VB[1], g), s = lerp(0.28, 1, g);
      if (ret > 0) { x = lerp(VB[0], 330, ret); y = lerp(VB[1], 560, ret); s = lerp(1, 0.08, ret); }
      tr(vB, x, y, s);
      op(surfGlow, win(t, mid('area', 0.0), mid('area', 0.16), 0.3) + win(t, mid('bloody', 0.48), mid('bloody', 0.62), 0.3));
      op(wallGlow, (win(t, mid('thin', 0.1), end('thin'), 0.4) + win(t, mid('bloody', 0.62), mid('bloody', 0.75), 0.3)) * (0.55 + 0.25 * wave(t, 1.2)));
      const bl = win(t, mid('blood', 0.05), end('blood'), 0.4) + win(t, mid('bloody', 0.75), mid('bloody', 0.88), 0.3);
      op(bloodHalo, bl * (0.25 + 0.2 * wave(t, 0.9)));
      const la = win(t, mid('lacteal', 0.05), end('lacteal') + 0.3, 0.4) + win(t, mid('bloody', 0.88), end('bloody') + 0.3, 0.3);
      op(lactHalo, la * (0.3 + 0.25 * wave(t, 1.0)));
      lacteal.setAttribute('fill', la > 0.3 ? '#FFF7DC' : '#FFF0C8');
      const fl = (t * (0.18 + 0.2 * bl)) % 1;
      rbcB.forEach((e, i) => { const p = loopS.at((fl + i / 9) % 1); attr(e, 'cx', p[0]); attr(e, 'cy', p[1]); });
      molsB.forEach((m, k) => {
        const t0 = mid('blood', 0.14) + m.d, u = clamp((t - t0) / 2.6);
        let x, y;
        if (u < 0.3) { const q = ease(u / 0.3); x = lerp(m.x0, 102, q); y = m.y; }
        else if (u < 0.45) { const q = (u - 0.3) / 0.15; x = lerp(102, 48, q); y = m.y; }
        else { const q = easeIn((u - 0.45) / 0.55); x = 48; y = lerp(m.y, 130, q); }
        tr(m.g, x, y);
        op(m.g, (t > t0 && t < tWater + 0.2 ? 1 : 0) * Math.min(1, u * 10, (1 - u) * 6));
      });
      fats.forEach((m, k) => {
        const t0 = mid('lacteal', 0.08) + m.d, u = clamp((t - t0) / 2.4);
        let x, y;
        if (u < 0.3) { const q = ease(u / 0.3); x = lerp(m.x0, -102, q); y = m.y; }
        else if (u < 0.55) { const q = (u - 0.3) / 0.25; x = lerp(-102, 0, q); y = m.y; }
        else { const q = easeIn((u - 0.55) / 0.45); x = 0; y = lerp(m.y, 130, q); }
        tr(m.g, x, y, 1, u > 0.3 && u < 0.55 ? 0 : (k % 2 ? 0 : 90 * clamp((u - 0.55) * 4)));
        op(m.g, (t > t0 && t < tWater + 0.2 ? 1 : 0) * Math.min(1, u * 10, (1 - u) * 6));
      });
    }
    const sA = clamp(win(t, mid('zoom', 0.35), mid('area', 0.13), 0.4) + win(t, tThin - 0.15, tWater + 0.1, 0.4));
    op(slotG, sA);
    if (sA > 0) {
      const fillAt = [mid('area', 0.02), mid('thin', 0.05), mid('blood', 0.04), mid('lacteal', 0.05)];
      const mn = P(t, at('bloody') + 0.1, 0.6, ease);
      SL.forEach((s, i) => {
        const appear = P(t, mid('zoom', 0.35) + i * 0.12, 0.5, pop);
        tr(s.g, (1 - clamp(appear)) * 30, 0);
        const f = P(t, fillAt[i], 0.45, linear);
        op(s.empty, 1 - f); op(s.full, f); op(s.discOn, f);
        op(s.lab, f);
        s.lab.setAttribute('x', SLX + lerp(88, 250, mn)); s.lab.setAttribute('font-size', lerp(30, 26, mn).toFixed(1));
        s.lab.setAttribute('fill', mn > 0.5 ? C.muted : C.ink);
        const w = P(t, mid('bloody', 0.1 + i * 0.09), 0.4, pop);
        op(s.wordEl, clamp(w * 2)); s.wordEl.setAttribute('transform', `translate(${SLX + 88} ${SLY[i]}) scale(${Math.max(0.01, 0.7 + 0.3 * w).toFixed(3)}) translate(${-SLX - 88} ${-SLY[i]})`);
        const active = [win(t, fillAt[0], mid('area', 0.14), 0.3) + win(t, tThin - 0.1, mid('thin', 0.1), 0.3), win(t, fillAt[1], end('thin'), 0.3), win(t, fillAt[2], end('blood'), 0.3), win(t, fillAt[3], end('lacteal') + 0.2, 0.3)][i];
        const named = [0.5, 0.64, 0.77, 0.9].map(q => win(t, mid('bloody', q), mid('bloody', q + 0.12), 0.25))[i];
        op(s.lead, Math.max(active, named));
        s.full.setAttribute('stroke-width', named > 0.5 ? 5 : 3);
      });
    }
    // inset and gradient card
    const iA = win(t, mid('thin', 0.18), end('thin') + 0.2, 0.4);
    op(inset, iA);
    if (iA > 0) {
      insRbc.forEach((e, i) => { attr(e, 'cx', 66); attr(e, 'cy', ((t * 60 + i * 60) % 240) - 120); });
      const u = ((t - mid('thin', 0.25)) / 1.8) % 1, q = ease(clamp(u / 0.6));
      tr(hop, lerp(-72, 64, q), -61 - Math.sin(q * Math.PI) * 26 + (u > 0.6 ? (u - 0.6) * 160 : 0));
      op(hop, t > mid('thin', 0.25) ? Math.min(1, u * 10, (1 - u) * 6) : 0);
      op(hopArrow, P(t, mid('thin', 0.55), 0.4, linear));
      op(insTop, P(t, mid('thin', 0.3), 0.4, linear)); op(insBot, P(t, mid('thin', 0.6), 0.4, linear));
    }
    const gA = win(t, mid('blood', 0.55), end('blood') + 0.2, 0.4);
    op(grad, gA);
    if (gA > 0) { gArrow.set(P(t, mid('blood', 0.66), 0.6)); attr(gBlood, 'height', 32 + 6 * wave(t, 0.8)); attr(gBlood, 'y', 520 - 32 - 6 * wave(t, 0.8)); op(gSteep, P(t, mid('blood', 0.74), 0.4, linear)); }

    /* --- C. the showpiece --- */
    const cA = win(t, mid('area', 0.1), tThin, 0.4);
    op(Cg, cA);
    if (cA > 0) {
      op(hdr, P(t, mid('area', 0.1), 0.4, linear));
      const appear = P(t, mid('area', 0.12), 0.6, pop);
      const sh = P(t, mid('area', 0.2), 0.8);
      const mp = P(t, mid('area', 0.27), 2.0, linear);
      const s = lerp(1, SEND, sh) * Math.max(0.01, appear);
      tr(foldG, 600, lerp(420, LINEY, sh), s);
      fold.setAttribute('stroke-width', (lerp(14, 7, sh) / s).toFixed(2));
      if (mp <= 0) fold.setAttribute('d', toD(FP));
      else if (mp >= 1) fold.setAttribute('d', toD(SP));
      else fold.setAttribute('d', toD(FP.map((p, i) => { const q = ease(clamp((mp - 0.45 * i / NP) / 0.55)); return [lerp(p[0], SP[i][0], q), lerp(p[1], SP[i][1], q)]; })));
      const sp = P(t, mid('area', 0.5), 0.9, ease);
      op(foldG, clamp(appear * 2) * (1 - P(t, mid('area', 0.505), 0.3, linear)));
      attr(sheet, 'x', lerp(60, CX0, sp)); attr(sheet, 'width', lerp(1080, cx - CX0, sp));
      attr(sheet, 'y', lerp(LINEY - 3, CY0, sp)); attr(sheet, 'height', lerp(7, CH, sp));
      op(sheet, P(t, mid('area', 0.5), 0.15, linear));
      courtLines.forEach((l, i) => dash(l, i < 4 ? P(t, mid('area', 0.72), 0.5) : P(t, mid('area', 0.72) + 0.45, 0.5)));
      op(net, P(t, mid('area', 0.76), 0.3, linear));
      op(area, P(t, mid('area', 0.58), 0.5, linear));
      const yp = P(t, mid('area', 0.82), 0.5, pop); op(youG, clamp(yp * 2)); tr(youG, 212, CY0 + CH, Math.max(0.01, yp)); op(youLab, P(t, mid('area', 0.85), 0.4, linear));
      op(halfLab, P(t, mid('area', 0.8), 0.5, linear));
    }

    /* --- D. large intestine and bacteria --- */
    const dA = win(t, tWater + 0.4, tPer + 0.1, 0.4);
    op(Dg, dA);
    if (dA > 0) {
      op(lgLab, P(t, mid('water', 0.12), 0.4, linear)); op(smLab, P(t, tWater + 0.6, 0.4, linear) * (1 - P(t, mid('water', 0.3), 0.6, linear)));
      const wc = win(t, mid('water', 0.42), at('microbes') + 0.2, 0.4); op(wChip, wc); tr(wChip, 1000 + (1 - P(t, mid('water', 0.42), 0.5, easeOut)) * 20, 589);
      const fc = win(t, mid('water', 0.8), at('microbes') + 0.2, 0.4); op(fChip, fc); tr(fChip, 985 + (1 - P(t, mid('water', 0.8), 0.5, easeOut)) * 20, 655);
      const lA = P(t, at('microbes') + 0.1, 0.5, linear);
      op(lens, lA); op(lensT, lA);
      tr(lens, LX, LY, Math.max(0.01, 0.6 + 0.4 * P(t, at('microbes') + 0.1, 0.6, pop)));
      bugs.forEach((b, i) => {
        const a = P(t, at('microbes') + 0.3 + b.d, 0.4, pop);
        tr(b.g, b.x + Math.sin(t * 1.3 + b.ph) * 7 * calm, b.y + Math.cos(t * 1.1 + b.ph) * 6 * calm, Math.max(0.01, a), b.rot + Math.sin(t * 2 + b.ph) * 25 * calm);
        op(b.g, clamp(a * 2));
      });
      fibres.forEach((f, i) => f.setAttribute('stroke-dashoffset', (0.45 * P(t, mid('microbes', 0.2) + i * 0.3, 3.4, linear)).toFixed(4)));
      op(bugLeg, win(t, mid('microbes', 0.08), mid('microbes', 0.6), 0.4)); op(fibLeg, win(t, mid('microbes', 0.3), mid('microbes', 0.6), 0.4));
      const sp = P(t, mid('microbes', 0.55), 0.5, pop); op(sci, clamp(sp * 2)); tr(sci, 1086, 252, Math.max(0.01, sp), 8);
      op(sciQ, P(t, mid('microbes', 0.64), 0.5, linear));
    }

    /* --- E. peristalsis --- */
    const eA = win(t, tPer - 0.1, tUp + 0.1, 0.4);
    op(Eg, eA);
    if (eA > 0) {
      const runT = P(t, mid('peristalsis', 0.2), tUp - 0.2 - mid('peristalsis', 0.2), linear);
      const bx = lerp(250, 990, runT), sq = bx - 82, on = P(t, mid('peristalsis', 0.2), 0.6, linear);
      const H = x => { const d = (x - sq) / 40, b = (x - bx) / 46; return 70 - 34 * on * Math.exp(-d * d) + 8 * on * Math.exp(-b * b); };
      const top = [], bot = [], ltop = [], lbot = [];
      for (let x = TX0; x <= TX1; x += 14) { const h = H(x); top.push([x, TY - h]); bot.push([x, TY + h]); const hl = Math.max(3, h - 30); ltop.push([x, TY - hl]); lbot.push([x, TY + hl]); }
      pOuter.setAttribute('d', openPath(top) + ' L' + [...bot].reverse().map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ' Z');
      pLumen.setAttribute('d', openPath(ltop) + ' L' + [...lbot].reverse().map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ' Z');
      let rd = '', hd = '';
      for (let x = TX0 + 20; x < TX1; x += 38) { const h = H(x), hl = Math.max(3, h - 30), d = (x - sq) / 40, hot = on * Math.exp(-d * d) > 0.35; const seg = `M${x},${(TY - h + 3).toFixed(1)} L${x},${(TY - hl - 2).toFixed(1)} M${x},${(TY + hl + 2).toFixed(1)} L${x},${(TY + h - 3).toFixed(1)} `; if (hot) hd += seg; else rd += seg; }
      pRings.setAttribute('d', rd || 'M0,0'); pHot.setAttribute('d', hd || 'M0,0'); op(pHot, hd ? 1 : 0);
      tr(pBol, bx, TY);
      tr(pQ, bx, TY - 100); op(pQ, win(t, tPer, mid('peristalsis', 0.2), 0.3));
      op(pTitle, P(t, mid('peristalsis', 0.15), 0.4, linear));
      tr(pSq, sq, TY - 120); op(pSq, P(t, mid('peristalsis', 0.32), 0.4, linear));
      pPush.setAttribute('transform', `translate(${(bx + 44).toFixed(1)} ${TY})`); op(pPush, P(t, mid('peristalsis', 0.58), 0.4, linear));
      attr(pPushL, 'x', bx - 60); attr(pPushL, 'y', TY + 116); op(pPushL, P(t, mid('peristalsis', 0.6), 0.4, linear));
      // toothpaste
      const tp = P(t, mid('peristalsis', 0.64), 0.4, linear), pinch = lerp(352, 650, P(t, mid('peristalsis', 0.7), tUp - mid('peristalsis', 0.7), linear));
      op(paste, tp); op(pasteLab, tp);
      const th = x => { const k = clamp((x - pinch + 14) / 28); return lerp(4, lerp(36, 28, (x - 334) / 340), k); };
      const tt = [], tb = [];
      for (let x = 334; x <= 674; x += 10) { const h = th(x); tt.push([x, PCY - h]); tb.push([x, PCY + h]); }
      const pp = p => p[0] + ',' + p[1].toFixed(1);
      pTube.setAttribute('d', 'M' + tt.map(pp).join(' L') + ` L694,${PCY - 21} L712,${PCY - 15} L712,${PCY + 15} L694,${PCY + 21} L` + [...tb].reverse().map(pp).join(' L') + ' Z');
      const bx0 = Math.max(350, pinch + 16);
      pBand.setAttribute('d', bx0 < 668 ? `M${bx0},${PCY - 8} L668,${PCY - 8} L668,${PCY + 8} L${bx0},${PCY + 8} Z` : 'M0,0'); op(pBand, bx0 < 668 ? 1 : 0);
      const len = Math.max(0, (pinch - 352) / 298 * 230);
      ribbon.setAttribute('d', `M748,${PCY} Q${748 + len * 0.55},${PCY - 6} ${748 + len},${PCY + len * 0.14}`); op(ribbon, len > 2 ? 1 : 0);
      ribbonS.setAttribute('d', `M752,${PCY} Q${748 + len * 0.55},${PCY - 6} ${748 + len - 4},${PCY + len * 0.14}`); op(ribbonS, len > 14 ? 1 : 0);
      tr(thumbT, pinch, PCY - 27); tr(thumbB, pinch, PCY + 27);
    }

    /* --- F. upside down --- */
    const fA = win(t, tUp + 0.6, tAcid + 0.1, 0.4);
    op(Fg, fA);
    if (fA > 0) {
      upA.set(P(t, tUp + 1.2, 0.8)); op(upL, P(t, tUp + 1.5, 0.4, linear));
      gvA.set(P(t, tUp + 0.8, 0.6)); op(gvL, P(t, tUp + 0.9, 0.4, linear));
      op(upChip, P(t, mid('upside', 0.55), 0.4, linear));
    }

    /* --- G. stomach acid --- */
    const gA2 = P(t, tAcid - 0.1, 0.5, linear);
    op(Gg, gA2);
    if (gA2 > 0) {
      acidBub.upd(t, 1);
      tr(food, 372 + Math.sin(t * 0.9) * 6 * calm, 420 + Math.cos(t * 0.7) * 5 * calm, 1, Math.sin(t * 0.6) * 6 * calm);
      chainB.forEach((b, i) => { const snip = P(t, mid('acid', 0.8) + i * 0.1, 0.6, ease); attr(b, 'cx', 330 + i * 22 + snip * (i - 2) * 12); attr(b, 'cy', 572 + Math.sin(t * 1.5 + i) * 3 * calm + snip * (i % 2 ? 6 : -6)); });
      op(chain, P(t, tAcid, 0.5, linear));
      germs.forEach((g, k) => {
        const t0 = mid('acid', 0.36) + g.d, u = clamp((t - t0) / 1.1), popT = P(t, t0 + 1.1, 0.35, linear);
        const q = ease(u), ex = SOX + 8 * SS, ey = SOY + 72 * SS, kx = SOX + 22 * SS, ky = SOY + 128 * SS;
        const x = q < 0.4 ? lerp(ex, kx, q / 0.4) : lerp(kx, g.tx, (q - 0.4) / 0.6), y = q < 0.4 ? lerp(ey, ky, q / 0.4) : lerp(ky, g.ty, (q - 0.4) / 0.6);
        tr(g.g, x, y, (1 + 0.5 * popT), u * 120);
        op(g.g, (t > t0 ? 1 : 0) * (1 - popT));
        const xp = P(t, t0 + 1.15, 0.35, pop); op(g.x, clamp(xp * 2)); tr(g.x, x, y, Math.max(0.01, xp));
      });
      prots.forEach((p, i) => {
        const a = P(t, mid('acid', 0.68) + i * 0.12, 0.5, pop);
        tr(p.g, p.x + Math.sin(t * 1.2 + i) * 6 * calm, p.y + Math.cos(t + i) * 5 * calm, Math.max(0.01, a), Math.sin(t * 2 + i) * 15 * calm);
        op(p.g, clamp(a * 2)); op(p.h, 0.6 + 0.4 * wave(t, 1.1, i * 0.3));
      });
      op(hcl, P(t, mid('acid', 0.06), 0.4, linear));
      AC.forEach((a, i) => {
        const p = P(t, mid('acid', [0.12, 0.42, 0.7][i]), 0.45, linear);
        op(a.g, p); tr(a.g, 900 + (1 - p) * 24, a.y);
        const m = P(t, mid('acid', [0.28, 0.56, 0.86][i]), 0.4, pop); op(a.mk, clamp(m * 2)); tr(a.mk, a.w / 2 + 32, 0, Math.max(0.01, m));
        if (a.st) { a.st.set(P(t, mid('acid', 0.24), 0.4)); }
      });
    }
  };
});

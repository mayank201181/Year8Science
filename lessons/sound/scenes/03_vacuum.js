/* Chapter 3, Sound can't cross a vacuum.
   Beats: a wave runs along air particles and dies at a gap with none -> a vacuum, empty and starry
   -> the bell-jar experiment: the bell rings, the meter reads high -> the pump removes the air: the arcs
   and the meter fade while the hammer keeps striking (showpiece) -> light still reaches the eye
   -> air back in, the sound returns -> sound needs a medium, light doesn't -> a film's space "BOOM!"
   struck out -> astronauts talk by radio -> No air, no aware. */
scene('vacuum', S => {
  const { at, end, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.35 : 1;
  const AIRF = ball(C.air, '#4E8FB8');

  /* ---------- local art ---------- */
  const f1 = v => (+v).toFixed(1);
  const arcD = (cx, cy, r, a0, a1) => `M${f1(cx + r * Math.cos(a0))},${f1(cy + r * Math.sin(a0))} A${f1(r)},${f1(r)} 0 0 1 ${f1(cx + r * Math.cos(a1))},${f1(cy + r * Math.sin(a1))}`;
  const popIn = (el, p, x, y, s0) => { s0 = s0 === undefined ? 0.8 : s0; op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 16, Math.max(0.01, s0 + (1 - s0) * p)); };
  /* position along a polyline at distance d from its start */
  function along(pts, d) {
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d <= l || i === pts.length - 1) { const f = l ? clamp(d / l) : 0; return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; }
      d -= l;
    }
    return pts[pts.length - 1];
  }
  const polyLen = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };

  /* side-view loudspeaker facing right: dark cabinet, grey cone that moves in and out; g.set(dx, ghostAmp) */
  function speaker(parent) {
    const g = G(parent);
    E('rect', { x: -66, y: -80, width: 66, height: 160, rx: 12, fill: '#16232C', stroke: '#3A5666', 'stroke-width': 3 }, g);
    E('circle', { cx: -33, cy: -50, r: 9, fill: '#0B151B', stroke: '#3A5666', 'stroke-width': 2 }, g);
    const coneD = 'M-4,-24 L22,-62 L22,62 L-4,24 Z';
    const ghosts = [G(g), G(g)];
    ghosts.forEach(h => E('path', { d: coneD, fill: 'none', stroke: '#C9D3DB', 'stroke-width': 2, opacity: 0.35 }, h));
    const cone = G(g);
    E('path', { d: coneD, fill: linGrad('#6F7D89', '#B7C3CD'), stroke: '#D3DCE3', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cone);
    E('line', { x1: 22, y1: -62, x2: 22, y2: 62, stroke: '#E9EEF2', 'stroke-width': 5, 'stroke-linecap': 'round' }, cone);
    g.set = (dx, amp) => { tr(cone, dx, 0); tr(ghosts[0], -amp, 0); tr(ghosts[1], amp, 0); op(ghosts[0], amp > 0.5 ? 1 : 0); op(ghosts[1], amp > 0.5 ? 1 : 0); };
    g.set(0, 0);
    return g;
  }
  /* an ear seen from the side, listening to the left (opening on the left), about 70 x 120 */
  function earIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-14,-40 C0,-62 42,-60 46,-22 C49,4 36,18 30,30 C24,44 22,60 4,60 C-8,60 -13,50 -12,40 L-10,30 C-2,29 6,22 10,12 C15,-2 13,-24 -1,-26 C-10,-27 -15,-21 -17,-15 Z', fill: ball('#F2C29C', '#B9825A'), stroke: '#FBE3CF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M2,-40 C24,-40 33,-20 28,-2', fill: 'none', stroke: '#B9825A', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: -3, cy: 3, rx: 7, ry: 9, fill: '#5A2E1E' }, g);
    return g;
  }
  /* an open eye, front view, about 96 x 60 */
  function eyeIcon(parent) {
    const g = G(parent);
    E('path', { d: 'M-48,0 Q0,-38 48,0 Q0,38 -48,0 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: 17, fill: ball('#6CC4F2', '#1D6FA6') }, g);
    E('circle', { r: 7.5, fill: '#0A1620' }, g);
    E('circle', { cx: -5, cy: -6, r: 3.5, fill: '#fff', opacity: 0.9 }, g);
    return g;
  }
  /* twinkling stars inside box [x, y, w, h], skipping the rectangles in `avoid`; returns an update fn */
  function stars(parent, n, box, seed, avoid) {
    const r = rng(seed), list = [];
    for (let tries = 0; list.length < n && tries < n * 30; tries++) {
      const x = box[0] + r() * box[2], y = box[1] + r() * box[3], sz = 0.9 + r() * 1.9, ph = r(), base = 0.35 + r() * 0.6;
      if ((avoid || []).some(a => x > a[0] && x < a[0] + a[2] && y > a[1] && y < a[1] + a[3])) continue;
      list.push({ el: E('circle', { cx: f1(x), cy: f1(y), r: sz.toFixed(2), fill: '#EAF4FF' }, parent), x, y, ph, base });
    }
    const upd = (t, clip) => list.forEach(s => {
      const inside = !clip || (s.x > clip[0] + 6 && s.x < clip[0] + clip[2] - 6 && s.y > clip[1] + 6 && s.y < clip[1] + clip[3] - 6);
      s.el.style.opacity = inside ? (s.base * (0.65 + 0.35 * wave(t * AMP, 2.2 + s.ph * 2, s.ph))).toFixed(3) : '0';
    });
    return upd;
  }
  /* an exploding star: swells, flashes, throws off a glowing shell; g.set(p 0..1). hold = glow left at the end */
  function starBurst(parent, R0, hold) {
    const g = G(parent), rr = rng(5);
    const halo = E('circle', { r: R0, fill: glow('#FFB347') }, g);
    const bits = [];
    for (let i = 0; i < 20; i++) { const a = i / 20 * TAU + rr() * 0.22; bits.push({ el: E('circle', { r: f1(2.2 + rr() * 3.2), fill: i % 3 ? C.heat : C.energy }, g), a, k: 0.72 + rr() * 0.38 }); }
    const core = E('circle', { r: 12, fill: ball('#FFF7C2', '#FF9B3D') }, g);
    g.set = p => {
      const sw = P(p, 0, 0.22), bp = P(p, 0.2, 0.8, easeOut);
      attr(core, 'r', p < 0.2 ? 8 + 10 * sw : Math.max(0.1, 18 * (1 - P(p, 0.2, 0.35, linear)) + 3));
      halo.style.opacity = (p < 0.2 ? 0.3 + 0.5 * sw : 0.9 - (0.9 - hold) * bp).toFixed(3);
      tr(halo, 0, 0, p < 0.2 ? 0.35 + 0.25 * sw : 0.6 + 0.6 * bp);
      bits.forEach(b => { const d = R0 * b.k * bp; attr(b.el, 'cx', Math.cos(b.a) * d); attr(b.el, 'cy', Math.sin(b.a) * d); b.el.style.opacity = (p < 0.2 ? 0 : 1 - (1 - hold) * P(p, 0.55, 0.45, linear)).toFixed(3); });
    };
    g.set(0);
    return g;
  }
  /* the electric bell: housing, gong and a hammer that strikes the gong's right edge.
     g.set(away 0..1, ring 0..1): away 0 = touching the gong; ring shows the ghost hammers and buzz marks */
  function electricBell(parent) {
    const g = G(parent);
    E('rect', { x: -32, y: 0, width: 64, height: 36, rx: 7, fill: '#46545F', stroke: '#8FA2B0', 'stroke-width': 3 }, g);
    E('rect', { x: -22, y: 8, width: 14, height: 20, rx: 3, fill: '#C9853F' }, g);
    E('rect', { x: 8, y: 8, width: 14, height: 20, rx: 3, fill: '#C9853F' }, g);
    E('line', { x1: 0, y1: 36, x2: 0, y2: 46, stroke: '#8FA2B0', 'stroke-width': 7 }, g);
    const buzz = G(g);
    [52, 62].forEach(r => { E('path', { d: arcD(0, 82, r, Math.PI * 0.78, Math.PI * 1.22), fill: 'none', stroke: '#FFE8A3', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, buzz); });
    E('path', { d: arcD(0, 82, 52, Math.PI * 0.32, Math.PI * 0.6), fill: 'none', stroke: '#FFE8A3', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, buzz);
    const gong = G(g); tr(gong, 0, 82);
    E('circle', { r: 38, fill: ball('#F6D77A', '#A87A16'), stroke: '#FFE8A3', 'stroke-width': 2.5 }, gong);
    E('circle', { r: 29, fill: 'none', stroke: '#C99A2E', 'stroke-width': 2, opacity: 0.6 }, gong);
    E('circle', { r: 6, fill: '#8C6410' }, gong);
    const hamArt = h => { E('line', { x1: 0, y1: 0, x2: 0, y2: 46, stroke: '#C9D6DE', 'stroke-width': 5, 'stroke-linecap': 'round' }, h); E('circle', { cx: 0, cy: 52, r: 9, fill: ball('#E3EAEF', '#7D8C99') }, h); };
    const ghG = G(g), gh = [G(ghG), G(ghG)]; ghG.setAttribute('opacity', 0.22); gh.forEach(h => hamArt(h));
    tr(gh[0], 30, 32, 1, -20); tr(gh[1], 30, 32, 1, -44);
    const ham = G(g); hamArt(ham);
    E('circle', { cx: 30, cy: 32, r: 4.5, fill: '#1B2B36' }, g);
    g.set = (away, ring) => {
      tr(ham, 30, 32, 1, -20 - 24 * clamp(away));
      gh.forEach(h => op(h, ring));   // the 0.22 sits on their parent, so op() can't override it
      op(buzz, ring * (0.45 + 0.55 * (1 - clamp(away))));
      tr(gong, 0, 82, 1 + 0.025 * ring * (1 - clamp(away)));
    };
    g.set(1, 0);
    return g;
  }

  /* ================= A. need: a wave dies where the particles stop ================= */
  const A = G(root);
  const ROWS = [302, 336, 370, 404, 438];
  const XS = 130, LAM = 340, KW = TAU / LAM, FQ = 1.2, CW = LAM * FQ, AW = 9;
  const GAP = [586, 270, 232, 200];                       // the vacuum gap: x, y, w, h
  const gapG = G(A);
  const gapBox = E('rect', { x: GAP[0], y: GAP[1], width: GAP[2], height: GAP[3], rx: 18, fill: '#03080D', stroke: C.line, 'stroke-width': 2.5, 'stroke-dasharray': '10 8' }, gapG);
  const gapStarsG = G(gapG);
  const BIG = [170, 140, 860, 470];
  const updStars = stars(gapStarsG, 36, BIG, 31, [[300, 270, 600, 150], [GAP[0] + 66, GAP[1] + 50, 100, 100]]);
  const planet = G(gapG);
  E('ellipse', { cx: 0, cy: 0, rx: 62, ry: 14, fill: 'none', stroke: '#E9C27A', 'stroke-width': 4, opacity: 0.85, transform: 'rotate(-14)' }, planet);
  E('circle', { r: 30, fill: ball('#F2B16B', '#9C5A22') }, planet);
  E('path', { d: 'M-60,-2 A62,14 0 0 0 60,2', fill: 'none', stroke: '#E9C27A', 'stroke-width': 4, opacity: 0.85, transform: 'rotate(-14)' }, planet);
  tr(planet, 905, 528);
  const updGapStars = stars(gapStarsG, 10, [GAP[0] + 10, GAP[1] + 10, GAP[2] - 20, GAP[3] - 20], 47);
  const burst = starBurst(gapG, 92, 0.25); tr(burst, GAP[0] + GAP[2] / 2, GAP[1] + GAP[3] / 2);
  const spk = speaker(A); tr(spk, 108, 370);
  const bands = [0, 1, 2].map(() => E('ellipse', { cx: 0, cy: 370, rx: 34, ry: 96, fill: glow(C.air) }, A));
  const near = [], far = [];
  ROWS.forEach(y => {
    for (let i = 0; i < 13; i++) near.push({ el: E('circle', { r: 9, fill: AIRF }, A), x0: 158 + i * 34, y });
    for (let j = 0; j < 5; j++) far.push(E('circle', { cx: 856 + j * 34, cy: y, r: 9, fill: AIRF }, A));
  });
  const earA = G(A); earIcon(earA); tr(earA, 1094, 370);
  const earX = cross(A, 18); tr(earX, 1094, 470);
  const lblAir1 = T(A, 362, 262, 'air', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
  const lblAir2 = T(A, 924, 262, 'air', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
  const lblNone = T(A, GAP[0] + GAP[2] / 2, 256, 'no particles', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const stopBar = E('line', { x1: 580, y1: 288, x2: 580, y2: 452, stroke: C.bad, 'stroke-width': 6, 'stroke-linecap': 'round' }, A);
  const chipNeed = chip(A, 'no particles, no sound', { size: 30, fill: C.card2, stroke: C.bad, sw: 2.5 }); tr(chipNeed, 600, 560);
  const lblVac = T(gapG, 600, 336, 'vacuum', { size: 68, weight: 700, anchor: 'middle' });
  const lblVac2 = T(gapG, 600, 394, 'no particles at all, like outer space', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= B. the bell-jar experiment ================= */
  const B = G(root);
  const JX = 520, JW = 170, JB = 600;                      // jar centre x, half width, base y
  const GX = JX, GY = 382;                                // gong centre
  const hdr = chip(root, 'The bell-jar experiment', { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy });
  tr(hdr, 1160 - hdr.w / 2, 60);
  // pipe, valve and pump (behind the base plate)
  const pipeG = G(B);
  const PIPE = [[700, 613], [884, 613]];
  E('path', { d: 'M700,613 L884,613', stroke: '#9DB7C6', 'stroke-width': 28, 'stroke-linecap': 'round' }, pipeG);
  E('path', { d: 'M700,613 L884,613', stroke: '#0E2530', 'stroke-width': 21, 'stroke-linecap': 'round' }, pipeG);
  E('path', { d: 'M800,613 L800,566', stroke: '#9DB7C6', 'stroke-width': 26, 'stroke-linecap': 'round' }, pipeG);
  E('path', { d: 'M800,613 L800,566', stroke: '#0E2530', 'stroke-width': 19, 'stroke-linecap': 'round' }, pipeG);
  const flowG = G(B);                                     // particles travelling in the pipe
  const valveG = G(B); tr(valveG, 800, 580);
  const valveH = G(valveG);
  E('rect', { x: -26, y: -7, width: 52, height: 14, rx: 7, fill: '#E8424F', stroke: '#FFB3BA', 'stroke-width': 2 }, valveH);
  E('circle', { r: 7, fill: '#F4F7FA' }, valveG);
  const pump = G(B); tr(pump, 950, 596);
  E('rect', { x: -70, y: -58, width: 140, height: 112, rx: 16, fill: linGrad('#4E606E', '#2E3C47', true), stroke: '#8FA2B0', 'stroke-width': 3 }, pump);
  E('circle', { cx: 0, cy: -4, r: 32, fill: '#0D2330', stroke: '#8FA2B0', 'stroke-width': 3 }, pump);
  const rotor = G(pump); tr(rotor, 0, -4);
  for (let k = 0; k < 3; k++) E('path', { d: 'M0,0 C8,-10 6,-24 0,-27 C-6,-24 -8,-10 0,0 Z', fill: '#B7C3CD', transform: `rotate(${k * 120})` }, rotor);
  E('circle', { r: 6, fill: '#E9EEF2' }, rotor);
  const pumpLight = E('circle', { cx: 50, cy: -38, r: 7, fill: '#2B3A44', stroke: '#8FA2B0', 'stroke-width': 2 }, pump);
  const pumpLbl = T(B, 958, 690, 'vacuum pump', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const valveLbl = T(B, 800, 528, 'valve open', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9AA3' });
  const outArr = G(B); arrow(outArr, 740, 650, 866, 650, { color: C.air, width: 5 }); T(outArr, 790, 690, 'air out', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const inArr = G(B); arrow(inArr, 866, 650, 740, 650, { color: C.air, width: 5 }); T(inArr, 790, 690, 'air in', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  // base plate and outlet
  E('rect', { x: 310, y: JB, width: 420, height: 26, rx: 6, fill: '#5E6E7B', stroke: '#8FA2B0', 'stroke-width': 2.5 }, B);
  E('ellipse', { cx: 660, cy: JB + 1, rx: 13, ry: 4, fill: '#0E2530' }, B);
  // power for the bell: a battery box above the jar, wires down through the bung
  const powerG = G(B);
  E('path', { d: `M514,${JB - 300} L514,162 M526,${JB - 300} L526,162`, stroke: '#E9EEF2', 'stroke-width': 3 }, powerG);
  E('rect', { x: 472, y: 122, width: 96, height: 40, rx: 8, fill: '#2E3D48', stroke: '#6E8496', 'stroke-width': 2.5 }, powerG);
  const pBolt = bolt(powerG); tr(pBolt, 520, 142, 0.27);
  // particles in the jar (behind the glass)
  const partG = G(B);
  // the bell on its wire
  const bellG = G(B);
  const bellArt = electricBell(bellG);
  // glass jar with a bung
  const yA = 360 - 138 * Math.sqrt(1 - (16 / JW) * (16 / JW));
  const jarD = `M${JX - JW},${JB} L${JX - JW},360 A${JW},138 0 0 1 ${JX - 16},${f1(yA)} L${JX - 16},204 L${JX + 16},204 L${JX + 16},${f1(yA)} A${JW},138 0 0 1 ${JX + JW},360 L${JX + JW},${JB}`;
  const jarFill = E('path', { d: jarD + 'Z', fill: GLASS.fill }, B);
  const jarLine = E('path', { d: jarD, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4.5, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, B);
  const jarShine = E('path', { d: `M${JX - JW + 16},560 L${JX - JW + 16},372 Q${JX - JW + 24},300 ${JX - 70},258`, fill: 'none', stroke: GLASS.shine, 'stroke-width': 7, 'stroke-linecap': 'round' }, B);
  const bung = E('path', { d: `M${JX - 22},186 L${JX + 22},186 L${JX + 17},212 L${JX - 17},212 Z`, fill: '#8C4A3C', stroke: '#C27A6A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, B);
  // sound arcs toward the ear, light rays toward the eye
  const EAR = [176, 482], EYE = [176, 292];
  const A0 = (163 - 22) * Math.PI / 180, A1 = (163 + 22) * Math.PI / 180;
  const arcsG = G(B), arcs = [];
  for (let k = 0; k < 5; k++) arcs.push(E('path', { fill: 'none', stroke: C.air, 'stroke-width': 5.5, 'stroke-linecap': 'round' }, arcsG));
  const raysG = G(B), rays = [];
  [[-6, -10, -8], [0, 0, 0], [6, 10, 8]].forEach(([dy0, dy1]) => rays.push(E('path', { d: `M${GX - 30},${GY + dy0} L${EYE[0] + 58},${EYE[1] + dy1 * 0.6}`, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '16 12', opacity: 0.95 }, raysG)));
  const gongGlow = E('circle', { cx: GX, cy: GY, r: 70, fill: glow(C.energy) }, raysG);
  // ear, eye, meter
  const earG = G(B), earHalo = E('circle', { r: 70, fill: glow(C.air) }, earG); earIcon(earG); tr(earG, EAR[0], EAR[1]);
  const earTick = tick(B, 16); tr(earTick, EAR[0] + 2, EAR[1] + 92);
  const eyeG = G(B); eyeIcon(eyeG); tr(eyeG, EYE[0], EYE[1]);
  const eyeTick = tick(B, 16); tr(eyeTick, EYE[0], EYE[1] + 66);
  const meterG = G(B);
  const loud = meter(meterG, { w: 36, h: 230, vertical: true, color: C.air, label: 'loudness', labelSize: 26, labelFill: C.ink }); tr(loud, 1094, 196);
  // labels
  const lab = (x, y, tx, ty, text, o) => labelLine(B, x, y, tx, ty, text, Object.assign({ size: 28, anchor: 'start' }, o || {}));
  const lbBell = lab(716, 280, GX + 36, 318, 'electric bell');
  const lbJar = lab(716, 214, JX + 120, 263, 'sealed glass jar');
  const lbSides = lab(716, 352, 646, 392, 'not touching the sides', { fill: C.energy });
  const sidesArr = G(B);
  [[JX - JW + 6, GX - 46], [GX + 82, JX + JW - 6]].forEach(([x1, x2]) => {
    E('path', { d: `M${x1},${GY + 10} L${x2},${GY + 10}`, stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, sidesArr);
    E('path', { d: `M${x1 + 10},${GY + 3} L${x1},${GY + 10} L${x1 + 10},${GY + 17} M${x2 - 10},${GY + 3} L${x2},${GY + 10} L${x2 - 10},${GY + 17}`, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, sidesArr);
  });
  const lbSee = T(B, EYE[0], EYE[1] + 106, 'can still see it', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
  const lbHear = T(B, EAR[0], EAR[1] + 104, 'can hardly hear it', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  const lbAir = T(B, JX - JW + 22, JB - 16, 'air', { size: 28, weight: 700, fill: C.air });
  const lbNoAir = T(B, JX - JW + 22, JB - 16, 'almost a vacuum', { size: 28, weight: 700, fill: C.muted });

  // air particles in the jar: rest positions, leave times (pump) and return times (valve)
  const pr = rng(808), parts = [];
  for (let tries = 0; parts.length < 26 && tries < 4000; tries++) {
    const x = JX - JW + 26 + pr() * (2 * JW - 52), y = 246 + pr() * (JB - 30 - 246);
    if (y < 360 && Math.pow((x - JX) / (JW - 24), 2) + Math.pow((y - 360) / 116, 2) > 1) continue;
    if (x > GX - 62 && x < GX + 92 && y > 286 && y < GY + 54) continue;     // the bell
    if (Math.abs(x - JX) < 26 && y < 300) continue;                          // the wire
    if (x < JX - JW + 250 && y > JB - 52) continue;                          // the 'air' label
    if (parts.some(p => Math.hypot(p.rx - x, p.ry - y) < 46)) continue;
    parts.push({ rx: x, ry: y, a1: pr() * TAU, a2: pr() * TAU, a3: pr() * TAU, s: 0.8 + pr() * 0.5 });
  }
  const HOLE = [660, JB - 4];
  const order = parts.map((p, i) => i).sort((a, b) => parts[a].a1 - parts[b].a1);
  const STAY = [order[3], order[11], order[19]];
  const tL0 = at('pump') + 0.35, tL1 = at('see') + 0.35;
  const tE0 = at('back') + 0.28;
  let kLeave = 0;
  const leavers = order.filter(i => STAY.indexOf(i) < 0);
  parts.forEach((p, i) => { p.el = E('circle', { r: 9, fill: AIRF }, partG); p.pipe = E('circle', { r: 8, fill: AIRF }, flowG); p.stay = STAY.indexOf(i) >= 0; });
  leavers.forEach((i, k) => { const p = parts[i]; p.tL = tL0 + (tL1 - tL0) * Math.pow(k / (leavers.length - 1), 0.9); p.tE = tE0 + k * 0.045; });
  const jig = (p, t) => [p.rx + AMP * (9 * Math.sin(t * 1.6 * p.s + p.a1) + 5 * Math.sin(t * 0.7 + p.a2)), p.ry + AMP * (8 * Math.cos(t * 1.3 * p.s + p.a3) + 4 * Math.sin(t * 0.9 + p.a1))];
  const VJ = 300, VP = 300, VIN = 460;
  /* where particle p is at time t: { x, y, a (in the jar), px, py, pa (in the pipe), inside 0..1 } */
  function partAt(p, t) {
    const o = { a: 1, pa: 0, inside: 1 };
    if (p.stay || t < p.tL) { [o.x, o.y] = jig(p, t); return o; }
    const start = jig(p, p.tL), legA = [start, HOLE], dA = polyLen(legA) / VJ;
    if (t < p.tE) {
      const u = t - p.tL;
      o.inside = 1 - clamp(u / dA);
      if (u < dA) { [o.x, o.y] = along(legA, u * VJ); o.a = u > dA - 0.12 ? (dA - u) / 0.12 : 1; return o; }
      o.a = 0;
      const v = u - dA - 0.1, dP = (PIPE[1][0] - 730) / VP;
      if (v > 0 && v < dP) { o.px = 730 + v * VP; o.py = 613; o.pa = Math.min(1, v * 10, (dP - v) / 0.18); }
      return o;
    }
    // coming back in through the valve
    const u = t - p.tE, legP = [[800, 566], [800, 613], [726, 613]], dP = polyLen(legP) / VIN;
    const legJ = [HOLE, [p.rx, p.ry]], dJ = polyLen(legJ) / VIN;
    o.a = 0; o.inside = 0;
    if (u < dP) { [o.px, o.py] = along(legP, u * VIN); o.pa = Math.min(1, u * 12, (dP - u) / 0.08); return o; }
    const w = u - dP - 0.06;
    if (w < 0) return o;
    if (w < dJ) { [o.x, o.y] = along(legJ, w * VIN); o.a = Math.min(1, w * 12); o.inside = clamp(w / dJ); return o; }
    const settle = P(t, p.tE + dP + 0.06 + dJ, 0.6, linear), j = jig(p, t);
    o.x = lerp(p.rx, j[0], settle); o.y = lerp(p.ry, j[1], settle); o.inside = 1;
    return o;
  }

  /* ================= C. proves: two cards ================= */
  const Cc = G(root);
  const cardA = G(Cc), cardB = G(Cc);
  card(cardA, -210, -150, 420, 300, { fill: C.card, stroke: C.line });
  const caEar = G(cardA); earIcon(caEar); tr(caEar, 52, -58, 0.9);
  const caArcs = [0, 1, 2].map(k => E('path', { d: arcD(52, -58, 60 + k * 26, Math.PI * 0.82, Math.PI * 1.18), fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round' }, cardA));
  T(cardA, 0, 66, 'sound **needs** a medium', { size: 32, weight: 600, anchor: 'middle', boldFill: C.air });
  const caTick = tick(cardA, 18); tr(caTick, 0, 112);
  card(cardB, -210, -150, 420, 300, { fill: C.card, stroke: C.line });
  const cbBell = G(cardB); tr(cbBell, -100, -58);
  E('circle', { r: 34, fill: ball('#F6D77A', '#A87A16'), stroke: '#FFE8A3', 'stroke-width': 2.5 }, cbBell);
  E('circle', { r: 6, fill: '#8C6410' }, cbBell);
  const cbRays = [-12, 0, 12].map(dy => E('path', { d: `M-58,${-58 + dy} L42,${-58 + dy * 0.4}`, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '14 10' }, cardB));
  const cbEye = G(cardB); eyeIcon(cbEye); tr(cbEye, 100, -58, 0.85);
  T(cardB, 0, 66, 'light **doesn’t**', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const cbTick = tick(cardB, 18); tr(cbTick, 0, 112);

  /* ================= D. space: a film's explosion, struck out ================= */
  const Dg = G(root);
  const FR = [180, 140, 840, 400];
  E('rect', { x: FR[0], y: FR[1], width: FR[2], height: FR[3], rx: 10, fill: '#090C10', stroke: '#2C3842', 'stroke-width': 3 }, Dg);
  const holes = E('pattern', { id: 'vacHoles', width: 48.5, height: FR[3] - 40, patternUnits: 'userSpaceOnUse', x: FR[0] + 22, y: FR[1] + 12 }, defs());
  E('rect', { x: 0, y: 0, width: 26, height: 16, rx: 4, fill: '#C9D3DB', opacity: 0.5 }, holes);
  for (const y of [FR[1] + 12, FR[1] + FR[3] - 28]) E('rect', { x: FR[0] + 22, y, width: 16 * 48.5 + 26, height: 16, fill: 'url(#vacHoles)' }, Dg);
  const PIC = [FR[0] + 14, FR[1] + 42, FR[2] - 28, FR[3] - 84];
  const picClip = 'vacPic';
  E('rect', { x: PIC[0], y: PIC[1], width: PIC[2], height: PIC[3], rx: 6 }, E('clipPath', { id: picClip }, defs()));
  const pic = G(Dg, { 'clip-path': `url(#${picClip})` });
  E('rect', { x: PIC[0], y: PIC[1], width: PIC[2], height: PIC[3], fill: '#02060A' }, pic);
  const updPicStars = stars(pic, 28, PIC, 77, [[380, 196, 320, 96]]);
  const ship = G(pic); tr(ship, 330, 400);
  E('path', { d: 'M-64,0 C-40,-20 20,-22 58,0 C20,22 -40,20 -64,0 Z', fill: ball('#D9E2E8', '#6F7D89'), stroke: '#F2F7FA', 'stroke-width': 2.5 }, ship);
  E('path', { d: 'M-44,-12 L-66,-32 L-28,-14 Z M-44,12 L-66,32 L-28,14 Z', fill: '#E8424F' }, ship);
  E('ellipse', { cx: 16, cy: -4, rx: 16, ry: 8, fill: '#4CC9F0', opacity: 0.85 }, ship);
  const flame = E('path', { d: 'M-64,-7 L-96,0 L-64,7 Z', fill: C.heat }, ship);
  const laser = E('path', { d: 'M394,394 L700,348', stroke: '#FF6B5C', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '30 22' }, pic);
  const EXP = [790, 340];
  const enemy = G(pic); tr(enemy, EXP[0], EXP[1]);
  E('path', { d: 'M40,0 C24,-18 -24,-20 -46,0 C-24,20 24,18 40,0 Z', fill: ball('#B9C6D2', '#57636F'), stroke: '#DDE6EE', 'stroke-width': 2.5 }, enemy);
  E('path', { d: 'M20,-10 L44,-28 L8,-12 Z M20,10 L44,28 L8,12 Z', fill: '#7550C4' }, enemy);
  const boom = starBurst(pic, 120, 0.72); tr(boom, EXP[0], EXP[1]);
  const boomTxt = G(Dg); tr(boomTxt, 520, 262, 1, -8);
  T(boomTxt, 0, 0, 'BOOM!', { size: 92, weight: 700, anchor: 'middle', fill: C.energy });
  const boomStrike = strike(boomTxt, -150, -30, 150, C.bad);
  boomStrike.setAttribute('stroke-width', 10);
  const viewer = G(Dg); eyeIcon(viewer); tr(viewer, 1100, 340, 0.9);
  const spRays = [-16, 0, 16].map(dy => E('path', { d: `M${EXP[0] + 60},${EXP[1] + dy} L1046,${340 + dy * 0.4}`, stroke: C.energy, 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-dasharray': '18 12' }, Dg));
  const viewTick = tick(Dg, 15); tr(viewTick, 1100, 404);
  const filmLbl = T(Dg, 600, 126, 'what the films show…', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const chipSpace = chip(Dg, 'silent, but light gets through', { size: 30, fill: C.card2, stroke: C.energy, sw: 2.5 }); tr(chipSpace, 600, 616);

  /* ================= E. radio: astronauts on a spacewalk ================= */
  const Eg = G(root);
  E('rect', { x: 0, y: 0, width: W, height: H, fill: '#03070C', opacity: 0.88 }, Eg);
  const updSky = stars(Eg, 42, [40, 110, 1120, 600], 99, [[330, 160, 260, 110], [500, 350, 200, 50]]);
  function astronaut(parent, facing) {
    const g = G(parent), inner = G(g); if (facing < 0) inner.setAttribute('transform', 'scale(-1 1)');
    const p = person(inner, { shirt: '#E9EEF3', shorts: '#D3DCE4', skin: '#E9EEF3', hair: '#E9EEF3', shoes: '#9FB0BE' });
    const body = p.firstChild;
    body.insertBefore(E('rect', { x: -34, y: -156, width: 22, height: 66, rx: 6, fill: '#C3CED8', stroke: '#8FA2B0', 'stroke-width': 2 }), body.firstChild);
    E('line', { x1: -4, y1: -202, x2: -14, y2: -238, stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, body);
    E('circle', { cx: -14, cy: -240, r: 6, fill: C.energy }, body);
    E('circle', { cx: 0, cy: -174, r: 31, fill: 'rgba(150,205,255,0.18)', stroke: '#F2F7FA', 'stroke-width': 5 }, body);
    E('path', { d: 'M-6,-192 Q22,-190 24,-170 Q22,-152 -6,-156 Z', fill: 'rgba(255,196,90,0.75)', stroke: '#FFE29A', 'stroke-width': 2 }, body);
    p.pose({ lean: 0, armL: [38, 34], armR: [62, 30], legL: [12, -22], legR: [-8, -14] });
    g.ant = [-14 * facing, -240];
    return g;
  }
  const astroL = astronaut(Eg, 1), astroR = astronaut(Eg, -1);
  const AL = [330, 612], AR = [870, 612], AS = 1.2, BUB = [462, 212];
  const bubble = G(Eg); tr(bubble, BUB[0], BUB[1]);
  E('path', { d: 'M-96,-44 L96,-44 Q112,-44 112,-28 L112,22 Q112,38 96,38 L-44,38 L-98,82 L-72,38 L-96,38 Q-112,38 -112,22 L-112,-28 Q-112,-44 -96,-44 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, bubble);
  T(bubble, 0, 8, 'Hello!', { size: 40, weight: 700, anchor: 'middle', fill: C.bg0 });
  const bubX = cross(Eg, 34); tr(bubX, BUB[0], BUB[1]);
  const radioG = G(Eg), radio = [];
  for (let k = 0; k < 6; k++) radio.push(E('path', { fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, radioG));
  const radioLbl = T(Eg, 600, 386, 'radio waves', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const chipRadio = chip(Eg, 'radio waves, like light, can cross a vacuum', { size: 30, fill: C.card2, stroke: C.energy, sw: 2.5 }); tr(chipRadio, 600, 682);

  /* ================= F. No air, no aware ================= */
  const Fg = G(root);
  card(Fg, 230, 176, 740, 420, { fill: C.card, stroke: C.line });
  const fTitle = T(Fg, 600, 290, 'No **air**, no **aware**', { size: 66, weight: 600, anchor: 'middle', boldFill: C.energy });
  const fParts = G(Fg); tr(fParts, 450, 414);
  [[-30, -20], [8, -32], [34, -2], [-22, 18], [14, 28], [-4, -2]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 13, fill: AIRF }, fParts));
  const fX = G(Fg); tr(fX, 450, 414);
  E('circle', { r: 62, fill: 'none', stroke: C.bad, 'stroke-width': 9 }, fX);
  E('line', { x1: -44, y1: -44, x2: 44, y2: 44, stroke: C.bad, 'stroke-width': 9, 'stroke-linecap': 'round' }, fX);
  const fArrow = arrow(Fg, 545, 414, 640, 414, { color: C.muted, width: 6 });
  const fEar = G(Fg); earIcon(fEar); tr(fEar, 712, 412);
  const fEarX = cross(Fg, 22); tr(fEarX, 800, 400);
  const fSub = T(Fg, 600, 540, 'no medium, no sound', { size: 38, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  const tRing = mid('jar', 0.63);
  return t => {
    /* --- A: the wave dies at the gap; the gap grows into a vacuum --- */
    const aA = 1 - P(t, at('jar') - 0.1, 0.5, linear);
    op(A, aA);
    if (aA > 0) {
      const fld = (1 - P(t, at('vacuum') - 0.25, 0.45, linear));
      const fIn = P(t, S.first + 0.3, 0.6, linear);
      const t0 = mid('need', 0.34), tau = t - t0;
      const coneA = tau > 0 ? AW * 0.9 : 0;
      spk.set(tau > 0 ? coneA * Math.sin(TAU * FQ * tau) * AMP : 0, coneA * AMP);
      op(spk, fIn * fld);
      near.forEach(n => {
        const d = n.x0 - XS;
        const u = tau > d / CW ? AW * AMP * Math.sin(TAU * FQ * tau - KW * d) : 0;
        attr(n.el, 'cx', n.x0 + u); attr(n.el, 'cy', n.y);
        op(n.el, fIn * fld);
      });
      far.forEach(e => op(e, fIn * fld));
      // each compression glows as it travels, and dies where the particles stop
      const front = CW * Math.max(0, tau), base = front % LAM;
      bands.forEach((b, m) => {
        const d = base + m * LAM, x = XS + d;
        attr(b, 'cx', x);
        op(b, tau > 0 && d <= front ? 0.5 * fld * clamp((574 - x) / 34) * clamp(d / 40) : 0);
      });
      op(earA, fIn * fld);
      op(lblAir1, P(t, mid('need', 0.3), 0.5, linear) * fld); op(lblAir2, P(t, mid('need', 0.36), 0.5, linear) * fld);
      op(lblNone, P(t, mid('need', 0.46), 0.5, linear) * fld);
      op(stopBar, P(t, mid('need', 0.55), 0.3, linear) * fld);
      const cp = P(t, mid('need', 0.6), 0.5, pop); popIn(chipNeed, cp, 600, 560); op(chipNeed, clamp(cp * 2) * fld);
      const xp = P(t, mid('need', 0.67), 0.45, pop); op(earX, clamp(xp * 2) * fld); tr(earX, 1094, 470, Math.max(0.01, xp));
      // the gap: the silent star, then it grows into a big vacuum
      const gp = P(t, at('vacuum') - 0.1, 1.0);
      const bx = lerp(GAP[0], BIG[0], gp), by = lerp(GAP[1], BIG[1], gp), bw = lerp(GAP[2], BIG[2], gp), bh = lerp(GAP[3], BIG[3], gp);
      attr(gapBox, 'x', bx); attr(gapBox, 'y', by); attr(gapBox, 'width', bw); attr(gapBox, 'height', bh);
      op(gapBox, P(t, S.first - 0.2, 0.5, linear));
      updStars(t, [bx, by, bw, bh]); updGapStars(t);
      const bp = clamp((t - mid('need', 0.02)) / 2.6);
      burst.set(bp); op(burst, bp > 0 ? 1 - P(t, mid('need', 0.3), 0.6, linear) : 0);
      op(planet, P(t, at('vacuum') + 0.7, 0.6, linear));
      op(lblVac, P(t, mid('vacuum', 0.12), 0.5, linear)); op(lblVac2, P(t, mid('vacuum', 0.36), 0.5, linear));
    }

    /* --- B: the bell jar --- */
    const aB = Math.min(P(t, at('jar') - 0.1, 0.5, linear), 1 - P(t, at('proves') - 0.25, 0.5, linear));
    op(B, aB); op(hdr, aB);
    if (aB > 0) {
      const T0 = at('jar');
      jarLine.setAttribute('stroke-dashoffset', (1 - P(t, T0 + 0.15, 1.1)).toFixed(4));
      op(jarFill, P(t, T0 + 0.6, 0.6, linear)); op(jarShine, P(t, T0 + 0.9, 0.6, linear)); op(bung, P(t, T0 + 0.9, 0.4, linear));
      op(powerG, P(t, T0 + 1.0, 0.5, linear));
      const bd = P(t, mid('jar', 0.2), 0.9, easeOut);
      tr(bellG, JX, lerp(212, 300, bd)); op(bellG, P(t, mid('jar', 0.2), 0.3, linear));
      op(pipeG, P(t, T0 + 0.5, 0.5, linear)); op(pump, P(t, T0 + 0.6, 0.5, linear)); op(valveG, P(t, T0 + 0.7, 0.5, linear));
      op(pumpLbl, P(t, T0 + 0.8, 0.5, linear));
      op(eyeG, P(t, mid('jar', 0.28), 0.5, linear)); op(earG, P(t, mid('jar', 0.32), 0.5, linear));
      op(meterG, P(t, mid('jar', 0.5), 0.5, linear));
      lbBell.set(win(t, mid('jar', 0.3), at('pump') + 0.1, 0.4));
      lbJar.set(win(t, mid('jar', 0.42), at('pump') + 0.1, 0.4));
      lbSides.set(win(t, mid('jar', 0.55), at('pump') + 0.1, 0.4));
      op(sidesArr, win(t, mid('jar', 0.55), at('pump') + 0.1, 0.4));
      // particles: in the jar, out through the pipe, back in through the valve
      const pin = P(t, mid('jar', 0.12), 0.8, linear);
      let inside = 0;
      parts.forEach((p, i) => {
        const o = partAt(p, t);
        inside += o.inside;
        attr(p.el, 'cx', o.x || p.rx); attr(p.el, 'cy', o.y || p.ry);
        op(p.el, o.a * pin * P(t, mid('jar', 0.12) + i * 0.03, 0.3, linear));
        if (o.pa > 0) { attr(p.pipe, 'cx', o.px); attr(p.pipe, 'cy', o.py); }
        op(p.pipe, o.pa);
      });
      const frac = inside / parts.length;
      op(lbAir, P(t, mid('jar', 0.2), 0.5, linear) * (1 - P(t, mid('pump', 0.3), 0.5, linear)) + P(t, at('back') + 0.9, 0.5, linear));
      op(lbNoAir, win(t, mid('see', 0.5), at('back') + 0.3, 0.4));
      // the pump and the valve
      const pumpOn = win(t, at('pump') + 0.1, at('back') + 0.15, 0.25);
      const spin = clamp(t, at('pump') + 0.1, at('back')) - (at('pump') + 0.1);
      tr(rotor, 0, -4, 1, (spin * 540) % 360);
      pumpLight.setAttribute('fill', pumpOn > 0.5 ? C.good : '#2B3A44');
      tr(pump, 950 + (pumpOn > 0.5 && !R ? Math.sin(t * 60) * 1.2 : 0), 596);
      op(pumpLbl, P(t, T0 + 0.8, 0.5, linear) * (0.6 + 0.4 * pumpOn));
      pumpLbl.setAttribute('fill', pumpOn > 0.5 ? C.ink : C.muted);
      const vo = P(t, at('back') - 0.05, 0.35);
      tr(valveH, 0, 0, 1, -90 * vo);
      op(valveLbl, win(t, at('back'), at('proves'), 0.3));
      op(outArr, win(t, at('pump') + 0.4, at('see') + 1.2, 0.4)); op(inArr, win(t, at('back') + 0.2, at('proves'), 0.3));
      // the bell rings from tRing; loudness follows the air left inside
      const ring = P(t, tRing - 0.2, 0.3, linear);
      const away = Math.pow(Math.abs(Math.sin(Math.PI * 4.5 * (t - tRing))), 0.7);
      bellArt.set(ring > 0 ? away : 1, ring);
      const L = 0.92 * P(t, tRing, 0.6, linear) * Math.pow(frac, 1.25);
      loud.set(L);
      op(earHalo, L * 0.55);
      op(earTick, clamp((L - 0.8) / 0.08) * P(t, mid('jar', 0.72), 0.3, linear));
      arcs.forEach((a, k) => {
        const u = (((t - tRing) / 1.3 + k / arcs.length) % 1 + 1) % 1;
        const rmax = 70 + 300 * L, r = 50 + (rmax - 50) * u;
        a.setAttribute('d', arcD(GX, GY, r, A0, A1));
        op(a, t < tRing ? 0 : Math.min(1, L * 1.5) * Math.min(1, u * 6) * (1 - u));
        a.setAttribute('stroke-width', (2.5 + 4 * L).toFixed(2));
      });
      // light still reaches the eye
      const li = win(t, mid('see', 0.06), at('back') + 0.3, 0.4);
      op(raysG, li);
      rays.forEach(r => r.setAttribute('stroke-dashoffset', (-t * 90).toFixed(1)));
      op(eyeTick, P(t, mid('see', 0.26), 0.4, linear) * (1 - P(t, at('back') + 0.1, 0.4, linear)));
      tr(eyeTick, EYE[0], EYE[1] + 66, 0.4 + 0.6 * P(t, mid('see', 0.26), 0.4, pop));
      op(lbSee, win(t, mid('see', 0.3), at('back') + 0.2, 0.4));
      op(lbHear, win(t, mid('see', 0.56), at('back') + 0.2, 0.4));
    }

    /* --- C: sound needs a medium, light doesn't --- */
    const aC = Math.min(P(t, at('proves') - 0.1, 0.5, linear), 1 - P(t, at('space') - 0.25, 0.5, linear));
    op(Cc, aC);
    if (aC > 0) {
      popIn(cardA, P(t, mid('proves', 0.03), 0.6, pop), 360, 380);
      popIn(cardB, P(t, mid('proves', 0.4), 0.6, pop), 840, 380);
      caArcs.forEach((a, k) => op(a, 0.35 + 0.65 * wave(t * AMP, 1.1, -k * 0.22)));
      cbRays.forEach(r => r.setAttribute('stroke-dashoffset', (-t * 80).toFixed(1)));
      const k1 = P(t, mid('proves', 0.24), 0.45, pop), k2 = P(t, mid('proves', 0.66), 0.45, pop);
      op(caTick, clamp(k1 * 2)); tr(caTick, 0, 112, Math.max(0.01, k1));
      op(cbTick, clamp(k2 * 2)); tr(cbTick, 0, 112, Math.max(0.01, k2));
    }

    /* --- D: a space battle on film, BOOM! struck out --- */
    const aD = Math.min(P(t, at('space') - 0.1, 0.5, linear), 1 - P(t, at('radio') - 0.25, 0.5, linear));
    op(Dg, aD);
    if (aD > 0) {
      updPicStars(t);
      const T0 = at('space');
      tr(ship, 330 + (R ? 0 : 6 * Math.sin(t * 1.3)), 400 + (R ? 0 : 4 * Math.sin(t * 0.9)));
      flame.setAttribute('transform', `scale(${(1 + 0.25 * Math.sin(t * 17) * AMP).toFixed(3)} 1)`);
      const fire = win(t, T0 + 0.1, T0 + 0.9, 0.15);
      op(laser, fire); laser.setAttribute('stroke-dashoffset', (-t * 400).toFixed(1));
      const bp = clamp((t - (T0 + 0.75)) / 5.5);
      boom.set(bp); op(boom, bp > 0 ? 1 : 0);
      op(enemy, 1 - P(t, T0 + 1.25, 0.25, linear));
      const bt = P(t, T0 + 1.1, 0.45, pop); op(boomTxt, clamp(bt * 2)); tr(boomTxt, 520, 262, Math.max(0.01, 0.6 + 0.4 * bt), -8);
      boomStrike.set(P(t, mid('space', 0.22), 0.45));
      const lr = P(t, mid('space', 0.34), 0.5, linear);
      spRays.forEach((r, k) => { op(r, lr); r.setAttribute('stroke-dashoffset', (-t * 110 - k * 7).toFixed(1)); });
      op(viewer, P(t, T0, 0.5, linear));
      const vt = P(t, mid('space', 0.44), 0.45, pop); op(viewTick, clamp(vt * 2)); tr(viewTick, 1100, 404, Math.max(0.01, vt));
      op(filmLbl, P(t, T0 + 0.3, 0.5, linear));
      popIn(chipSpace, P(t, mid('space', 0.56), 0.6, pop), 600, 616);
    }

    /* --- E: astronauts talk by radio --- */
    const aE = Math.min(P(t, at('radio') - 0.1, 0.5, linear), 1 - P(t, at('aware') - 0.25, 0.5, linear));
    op(Eg, aE);
    if (aE > 0) {
      updSky(t);
      const fl = R ? 0 : 1;
      tr(astroL, AL[0], AL[1] + fl * 7 * Math.sin(t * 0.8), AS, fl * 2.5 * Math.sin(t * 0.6) - 3);
      tr(astroR, AR[0], AR[1] + fl * 7 * Math.sin(t * 0.8 + 1.7), AS, fl * 2.5 * Math.sin(t * 0.6 + 2) + 3);
      const bb = P(t, mid('radio', 0.06), 0.5, pop); popIn(bubble, bb, BUB[0], BUB[1]);
      const bx = P(t, mid('radio', 0.22), 0.45, pop); op(bubX, clamp(bx * 2)); tr(bubX, BUB[0], BUB[1], Math.max(0.01, bx));
      // radio arcs from the left antenna to the right one
      const ra = P(t, mid('radio', 0.32), 0.5, linear);
      const ax0 = AL[0] + astroL.ant[0] * AS + 18, ax1 = AR[0] + astroR.ant[0] * AS - 18, ay = AL[1] + astroL.ant[1] * AS;
      radio.forEach((a, k) => {
        const u = (((t - mid('radio', 0.32)) / 1.6 + k / radio.length) % 1 + 1) % 1, x = lerp(ax0, ax1, u);
        a.setAttribute('d', arcD(x - 40, ay, 40 + 6 * Math.sin(u * Math.PI), -0.55, 0.55));
        op(a, ra * Math.min(1, u * 8, (1 - u) * 8));
      });
      op(radioLbl, P(t, mid('radio', 0.42), 0.5, linear));
      popIn(chipRadio, P(t, mid('radio', 0.58), 0.6, pop), 600, 682);
    }

    /* --- F: No air, no aware --- */
    const aF = P(t, at('aware') - 0.1, 0.5, linear);
    op(Fg, aF);
    if (aF > 0) {
      op(fTitle, P(t, at('aware') + 0.05, 0.5, linear));
      const pp = P(t, mid('aware', 0.2), 0.5, pop); popIn(fParts, pp, 450, 414);
      const xp = P(t, mid('aware', 0.32), 0.4, pop); op(fX, clamp(xp * 2)); tr(fX, 450, 414, Math.max(0.01, 0.6 + 0.4 * xp));
      fArrow.set(P(t, mid('aware', 0.42), 0.4)); op(fArrow, P(t, mid('aware', 0.42), 0.1, linear));
      op(fEar, P(t, mid('aware', 0.5), 0.4, linear));
      const ex = P(t, mid('aware', 0.58), 0.4, pop); op(fEarX, clamp(ex * 2)); tr(fEarX, 800, 400, Math.max(0.01, ex));
      op(fSub, P(t, mid('aware', 0.6), 0.5, linear));
    }
  };
});

/* Intro: the coiled gut glows inside you, then unspools into one straight tube as long as two parked cars
   -> it springs back; zoom into the stomach, where a sandwich bobs in bubbling acid and crumbles into
   molecules (the same acid fizzes a nail away) and a big "?" asks why the stomach doesn't digest itself
   -> "Digestion": small molecules slip through the gut wall into the blood -> a three-stop roadmap. */
scene('intro', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const PINK = '#F4A6B8', PINKDK = '#B8466A', COLON = '#D9998A', COLONDK = '#8C4A3C';
  const ACID = '#B9BE3C', ACIDLT = '#E6EA86';

  /* ---------- local helpers ---------- */
  // dense polyline through control points (the same curve lib openPath draws)
  function crPts(pts, n) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let k = 1; k <= n; k++) {
        const u = k / n, v = 1 - u;
        out.push([v * v * v * p1[0] + 3 * v * v * u * c1[0] + 3 * v * u * u * c2[0] + u * u * u * p2[0],
          v * v * v * p1[1] + 3 * v * v * u * c1[1] + 3 * v * u * u * c2[1] + u * u * u * p2[1]]);
      }
    }
    return out;
  }
  // the same polyline resampled every `step` px of arc length
  function resample(pts, step) {
    const out = [pts[0]];
    let carry = 0;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], seg = Math.hypot(x1 - x0, y1 - y0);
      let pos = step - carry;
      while (pos <= seg) { const f = pos / seg; out.push([x0 + (x1 - x0) * f, y0 + (y1 - y0) * f]); pos += step; }
      carry = seg - (pos - step);
    }
    return out;
  }
  const poly = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  let clipN = 0;
  function clipUrl(d) { const id = 'dgIntroClip' + (++clipN); const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; }
  // a cartoon sandwich about 170 x 96 around (0,0)
  function sandwich(parent, s) {
    const g = G(parent), inner = G(g); if (s && s !== 1) tr(inner, 0, 0, s);
    E('rect', { x: -84, y: 20, width: 168, height: 26, rx: 11, fill: '#E9B872', stroke: '#A86B2A', 'stroke-width': 4 }, inner);
    E('path', { d: 'M-88,14 Q-74,2 -60,14 Q-46,2 -32,14 Q-18,2 -4,14 Q10,2 24,14 Q38,2 52,14 Q66,2 80,14 Q88,8 92,18 L-92,22 Z', fill: '#7CC46A', stroke: '#3F8F2F', 'stroke-width': 3, 'stroke-linejoin': 'round' }, inner);
    E('rect', { x: -78, y: -4, width: 156, height: 14, rx: 4, fill: '#F6CF4A', stroke: '#C29A1E', 'stroke-width': 2.5 }, inner);
    E('ellipse', { cx: -40, cy: -10, rx: 30, ry: 9, fill: '#E8584A', stroke: '#A8322A', 'stroke-width': 2.5 }, inner);
    E('ellipse', { cx: 30, cy: -10, rx: 30, ry: 9, fill: '#E8584A', stroke: '#A8322A', 'stroke-width': 2.5 }, inner);
    E('path', { d: 'M-84,-14 L-84,-34 Q-84,-50 -64,-50 L64,-50 Q84,-50 84,-34 L84,-14 Q84,-10 78,-10 L-78,-10 Q-84,-10 -84,-14 Z', fill: '#E9B872', stroke: '#A86B2A', 'stroke-width': 4 }, inner);
    E('path', { d: 'M-60,-36 l10,4 M-20,-40 l10,4 M22,-36 l10,4 M56,-40 l8,3', stroke: '#C98A3E', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, inner);
    return g;
  }
  // a small plate with the seven nutrient sectors (roadmap card)
  function miniPlate(parent, r) {
    const g = G(parent);
    E('circle', { r: r + 10, fill: '#E4ECF1', stroke: '#9FB3C1', 'stroke-width': 3 }, g);
    const cols = ['#FFC247', '#FF8A80', '#FFF0B8', '#B5E655', '#B48CFF', '#5BD27A', '#4CC9F0'];
    g.secs = cols.map((c, i) => {
      const a0 = -Math.PI / 2 + i * TAU / 7, a1 = a0 + TAU / 7;
      return E('path', { d: `M0,0 L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)} Z`, fill: c, stroke: '#F4F8FA', 'stroke-width': 2.5 }, g);
    });
    return g;
  }

  /* ---------- shapes shared by the body and the close-up ---------- */
  // the stomach, drawn at close-up size around (560, 390); inside the body it is the same path scaled by K
  const BAG = closedPath([[470, 200], [530, 150], [615, 138], [700, 168], [766, 246], [794, 352], [780, 468], [722, 562], [622, 618], [508, 626], [414, 596], [350, 542], [326, 494],
    [356, 452], [424, 446], [500, 428], [556, 388], [582, 326], [576, 270], [548, 238], [506, 240]]);
  const K = 0.24, BAGC = [560, 390], BAGL = [52, -18];
  // close-up oesophagus and duodenum: the canal's own control points, mapped into close-up coordinates
  const toBag = p => [(p[0] - BAGL[0]) / K + BAGC[0], (p[1] - BAGL[1]) / K + BAGC[1]];
  const TUBES = openPath([[2, -200], [8, -150], [18, -112], [26, -86], [33, -66]].map(toBag)) + ' ' +
    openPath([[-1, 3], [-12, 14], [-24, 30], [-32, 50], [-44, 72]].map(toBag)).replace(/^M/, 'M');
  const BAGT = `translate(${(BAGL[0] - BAGC[0] * K).toFixed(2)} ${(BAGL[1] - BAGC[1] * K).toFixed(2)}) scale(${K})`;
  function stomachWall(parent, dark, noFill) {
    if (!noFill) E('path', { d: BAG, fill: dark || '#5A1830' }, parent);
    const w = G(parent);
    E('path', { d: BAG, fill: 'none', stroke: PINKDK, 'stroke-width': 40, 'stroke-linejoin': 'round' }, w);
    E('path', { d: BAG, fill: 'none', stroke: PINK, 'stroke-width': 28, 'stroke-linejoin': 'round' }, w);
    E('path', { d: BAG, fill: 'none', stroke: '#E58AA2', 'stroke-width': 3, 'stroke-dasharray': '3 16', 'stroke-linejoin': 'round' }, w);
    return w;
  }
  const TORSO = 'M-30,-246 L-30,-228 C-84,-224 -140,-216 -160,-186 C-176,-160 -170,-90 -158,-30 C-150,20 -156,110 -164,190 C-170,240 -146,282 -100,286 L100,286 C146,282 170,240 164,190 C156,110 150,20 158,-30 C170,-90 176,-160 160,-186 C140,-216 84,-224 30,-228 L30,-246 Z';
  const ARM = 'M-170,-178 C-200,-160 -210,-96 -210,-26 C-210,44 -206,114 -200,176 C-198,198 -176,200 -174,178 C-170,116 -172,44 -170,-26 C-170,-80 -168,-130 -170,-178 Z';
  function silhouette(parent, sw) {
    const g = G(parent), o = { fill: 'rgba(130,180,210,0.10)', stroke: '#6E9AB1', 'stroke-width': sw || 4, 'stroke-linejoin': 'round' };
    E('path', Object.assign({ d: ARM }, o), g);
    E('path', Object.assign({ d: ARM, transform: 'scale(-1 1)' }, o), g);
    E('path', Object.assign({ d: TORSO }, o), g);
    E('circle', Object.assign({ cx: 0, cy: -302, r: 56 }, o), g);
    return g;
  }

  /* ================= A. the body and its coiled canal ================= */
  const body = G(root);
  const skin = silhouette(body);
  // mouth -> oesophagus -> stomach -> duodenum -> coiled small intestine -> large intestine -> anus
  const ctrl = [[0, -276], [0, -250], [2, -200], [8, -150], [18, -112], [26, -86], [33, -66],
    [44, -58], [66, -60], [86, -47], [93, -23], [86, 4], [66, 20], [38, 23], [14, 13], [-1, 3],
    [-12, 14], [-24, 30], [-32, 50], [-44, 72], [-62, 94], [-80, 104]];
  const ROW0 = 104, RS = 22, RX = 80;
  for (let r = 0; r < 6; r++) {
    const y = ROW0 + r * RS, ltr = r % 2 === 0;
    for (let k = 1; k <= 5; k++) ctrl.push([ltr ? -RX + k * 32 : RX - k * 32, y]);
    if (r < 5) for (let k = 1; k < 6; k++) { const a = -Math.PI / 2 + (ltr ? 1 : -1) * k * Math.PI / 6; ctrl.push([(ltr ? RX : -RX) + Math.cos(a) * RS / 2, y + RS / 2 + Math.sin(a) * RS / 2]); }
  }
  const nSmallCtrl = ctrl.length;
  ctrl.push([-96, 222], [-114, 222], [-126, 206], [-129, 170], [-129, 130], [-127, 96], [-114, 76], [-90, 70], [-40, 70], [0, 72], [40, 70], [90, 70], [114, 76], [127, 96], [129, 130],
    [129, 170], [126, 206], [114, 232], [88, 248], [56, 250], [32, 256], [18, 270], [14, 288]);
  const STEP = 7;
  const FP = resample(crPts(ctrl, 8), STEP), NP = FP.length, SPAN = (NP - 1) * STEP;
  const nearest = (pt, from, to) => { let best = from, bd = 1e9; for (let i = from; i < to; i++) { const d = Math.hypot(FP[i][0] - pt[0], FP[i][1] - pt[1]); if (d < bd) { bd = d; best = i; } } return best; };
  const iS0 = nearest([33, -66], 0, NP >> 2), iS1 = nearest([-1, 3], iS0, NP >> 1), iL = nearest(ctrl[nSmallCtrl + 1], NP >> 1, NP);

  // where it lies when unspooled: one straight tube under two parked cars
  const X0 = 90, X1 = 1110, LY = 652;
  const sF = (X1 - X0) / SPAN, BXF = 150, BYF = 262;
  const SP = FP.map((p, i) => [(X0 + i * STEP * sF - BXF) / sF, (LY - BYF) / sF]);

  const canal = G(body);
  const glowP = E('path', { fill: 'none', stroke: '#FF8FB1', 'stroke-width': 38, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.2, pathLength: 1, 'stroke-dasharray': '1 1' }, canal);
  const SEGS = [
    { a: iL - 1, b: NP, col: COLON, dk: COLONDK, w: 19, wEnd: 12.5 },
    { a: 0, b: iL, col: PINK, dk: PINKDK, w: 13, wEnd: 11 },
  ].map(s => {
    s.o = E('path', { fill: 'none', stroke: s.dk, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, canal);
    s.f = E('path', { fill: 'none', stroke: s.col, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, canal);
    return s;
  });
  const bagG = G(body, { transform: BAGT });
  stomachWall(bagG, '#7A2444');
  let lastM = -1;
  function drawCanal(m) {
    if (m === lastM) return;
    lastM = m;
    // each point lifts out of the body in turn, mouth end first, and is laid down along the line
    const WIN = 0.28, LIFT = 110 / sF;
    const pts = m <= 0 ? FP : FP.map((p, i) => { const q = ease(clamp((m - (1 - WIN) * i / NP) / WIN)); return q <= 0 ? p : [lerp(p[0], SP[i][0], q), lerp(p[1], SP[i][1], q) - Math.sin(Math.PI * q) * LIFT]; });
    glowP.setAttribute('d', poly(pts));
    SEGS.forEach(s => {
      const d = poly(pts.slice(s.a, s.b));
      s.o.setAttribute('d', d); s.f.setAttribute('d', d);
      const w = lerp(s.w, s.wEnd / sF, clamp(m * 1.6));
      attr(s.o, 'stroke-width', w + 6); attr(s.f, 'stroke-width', w);
    });
  }
  drawCanal(0);

  // two cars parked end to end, the same length as the unspooled tube
  const CAR = 'M0,-30 L0,-70 Q2,-88 22,-92 L118,-98 L174,-142 Q184,-150 200,-150 L330,-150 Q348,-150 360,-140 L410,-100 L470,-90 Q496,-86 498,-66 L500,-30 Q500,-22 492,-22 L440,-22 A40,40 0 0 0 360,-22 L140,-22 A40,40 0 0 0 60,-22 L8,-22 Q0,-22 0,-30 Z';
  const CW = (X1 - X0 - 20) / 2;
  const cars = [0, 1].map(k => {
    const g = G(root), inner = G(g); tr(inner, 0, 0, CW / 500);
    E('path', { d: CAR, fill: 'rgba(164,188,203,0.08)', stroke: '#A4BCCB', 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
    E('path', { d: 'M188,-138 L262,-138 L262,-106 L144,-106 Z M274,-138 L334,-138 Q344,-138 352,-131 L384,-106 L274,-106 Z', fill: 'rgba(159,216,255,0.16)', stroke: '#A4BCCB', 'stroke-width': 3, 'stroke-linejoin': 'round' }, inner);
    [100, 400].forEach(x => { E('circle', { cx: x, cy: -22, r: 34, fill: '#1A2A35', stroke: '#A4BCCB', 'stroke-width': 4 }, inner); E('circle', { cx: x, cy: -22, r: 13, fill: '#A4BCCB' }, inner); });
    return { g, x: X0 + k * (CW + 20) };
  });
  const CARY = LY - 24;
  const lblMouth = T(root, X0, LY + 50, 'mouth', { size: 26, weight: 600, fill: C.muted });
  const lblAnus = T(root, X1, LY + 50, 'anus', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });

  /* ================= B. inside the stomach ================= */
  const stom = G(root);
  const wallGlow = G(stom);
  E('path', { d: BAG, fill: 'none', stroke: '#FF7FA6', 'stroke-width': 110, 'stroke-linejoin': 'round', opacity: 0.16 }, wallGlow);
  E('path', { d: BAG, fill: 'none', stroke: '#FF7FA6', 'stroke-width': 70, 'stroke-linejoin': 'round', opacity: 0.3 }, wallGlow);
  E('path', { d: TUBES, fill: 'none', stroke: PINKDK, 'stroke-width': 19 / K, 'stroke-linecap': 'round' }, stom);
  E('path', { d: TUBES, fill: 'none', stroke: PINK, 'stroke-width': 13 / K, 'stroke-linecap': 'round' }, stom);
  E('path', { d: TUBES, fill: 'none', stroke: '#7A2140', 'stroke-width': 22, 'stroke-linecap': 'round', opacity: 0.5 }, stom);
  E('path', { d: BAG, fill: '#5A1830' }, stom);
  const inside = G(stom, { 'clip-path': clipUrl(BAG) });
  const SURF = 392, SX = 672;
  const sand = sandwich(inside, 0.95);
  const acidFill = E('path', { fill: ACID, opacity: 0.55 }, inside);
  const surf = E('path', { fill: 'none', stroke: ACIDLT, 'stroke-width': 4, opacity: 0.8 }, inside);
  const bub = bubbles(inside, 380, 400, 400, 230, { n: 16, r: 7, seed: 5, speed: 0.38, color: 'rgba(240,248,190,0.85)', fill: 'rgba(240,248,190,0.15)' });
  // crumbs, then molecules
  const cr = rng(17), crumbs = [];
  const CRC = ['#E9B872', '#C98A3E', '#7CC46A', '#E8584A', '#F6CF4A', '#E9B872', '#7CC46A', '#C98A3E'];
  for (let k = 0; k < 8; k++) {
    const pts = []; for (let j = 0; j < 5; j++) { const a = j / 5 * TAU + cr() * 0.6, rr = 10 + cr() * 7; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    const el = E('path', { d: closedPath(pts), fill: CRC[k], stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 2 }, inside);
    const ang = -Math.PI * 0.95 + k / 7 * Math.PI * 0.9 + (cr() - 0.5) * 0.2;
    crumbs.push({ el, dx: Math.cos(ang) * (50 + cr() * 60) - 20, dy: 70 + cr() * 80, rot: (cr() - 0.5) * 300 });
  }
  const BEADC = [['#FF8A80', '#C0574F'], ['#4DD0C8', '#22877F'], ['#B5E655', '#6E9A22'], ['#B48CFF', '#7550C4']];
  const beads = [];
  for (let k = 0; k < 16; k++) {
    const g = G(inside);
    if (k % 2 === 0) molGlucose(g, 15);
    else { const c = BEADC[(k >> 1) % 4]; E('circle', { r: 12, fill: ball(c[0], c[1]), stroke: c[1], 'stroke-width': 1.5 }, g); }
    const a = (k / 16) * TAU + cr() * 0.4, rr = 0.45 + 0.55 * Math.sqrt(cr());
    beads.push({ g, from: k >> 1, bx: 612 + Math.cos(a) * 145 * rr, by: 522 + Math.sin(a) * 52 * rr, ph: cr() * TAU, f1: 0.25 + cr() * 0.3, f2: 0.2 + cr() * 0.3, st: (k % 2) * 0.085 });
  }
  stomachWall(stom, null, true);                  // the muscular wall, drawn over the acid's edge
  const lbStom = labelLine(stom, 870, 214, 772, 262, 'stomach', { size: 30, anchor: 'start' });
  const lbAcid = labelLine(stom, 870, 664, 726, 586, 'acid', { size: 30, anchor: 'start', fill: ACIDLT });
  // the same acid fizzes a nail away
  const inset = G(stom); tr(inset, 1010, 410);
  beaker(inset, 170, 210, { level: 0.7, liquid: ACID, opacity: 0.6 });
  const nail = G(inset);
  E('rect', { x: -9, y: -70, width: 18, height: 112, rx: 4, fill: ball('#C9D3DA', '#7E8B95'), stroke: '#6B7780', 'stroke-width': 2.5 }, nail);
  E('rect', { x: -26, y: -80, width: 52, height: 13, rx: 5, fill: '#AEB9C2', stroke: '#6B7780', 'stroke-width': 2.5 }, nail);
  E('path', { d: 'M-9,41 L0,64 L9,41 Z', fill: '#AEB9C2', stroke: '#6B7780', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, nail);
  const nBub = bubbles(inset, -36, -20, 72, 112, { n: 10, r: 6, seed: 8, speed: 0.9, color: 'rgba(240,248,190,0.95)' });
  T(inset, 0, 156, 'can dissolve metal', { size: 28, weight: 600, anchor: 'middle', fill: ACIDLT });
  const qMark = T(stom, 930, 480, '?', { size: 250, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= C. digestion: small molecules into the blood ================= */
  const cut = G(root);
  const PORES = [240, 420, 600, 780, 960], WY0 = 456, WY1 = 490;
  const wallXs = [60].concat(PORES.flatMap(x => [x - 15, x + 15]), [1140]);
  for (let k = 0; k < wallXs.length; k += 2) E('rect', { x: wallXs[k], y: WY0, width: wallXs[k + 1] - wallXs[k], height: WY1 - WY0, rx: 12, fill: PINK, stroke: PINKDK, 'stroke-width': 3 }, cut);
  E('rect', { x: 40, y: 540, width: 1120, height: 84, rx: 42, fill: '#5E1A26' }, cut);
  E('rect', { x: 48, y: 550, width: 1104, height: 64, rx: 32, fill: '#B8323F' }, cut);
  const rbc = [];
  for (let k = 0; k < 11; k++) rbc.push(E('ellipse', { rx: 17, ry: 9, fill: '#FF6B75', stroke: '#FFC2C7', 'stroke-width': 2 }, cut));
  T(cut, 64, 438, 'gut', { size: 28, weight: 600, fill: C.muted });
  T(cut, 64, 666, 'blood', { size: 28, weight: 600, fill: '#FF8A94' });
  const bonds = G(cut);
  const units = [];
  for (let k = 0; k < 6; k++) units.push({ x: 190 + k * 50, y: 372 + (k % 2 ? -14 : 14), hex: true });
  for (let k = 0; k < 6; k++) units.push({ x: 690 + k * 42, y: 352 + (k % 2 ? 12 : -12), hex: false, c: BEADC[k % 4] });
  units.forEach((u, i) => {
    if (i % 6) { const p = units[i - 1]; E('line', { x1: p.x, y1: p.y, x2: u.x, y2: u.y, stroke: u.hex ? C.glucoseDk : '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, bonds); }
  });
  units.forEach((u, i) => {
    u.g = G(cut);
    if (u.hex) molGlucose(u.g, 20); else E('circle', { r: 16, fill: ball(u.c[0], u.c[1]), stroke: u.c[1], 'stroke-width': 2 }, u.g);
    u.pore = PORES.reduce((b, x) => (Math.abs(x - u.x) < Math.abs(b - u.x) ? x : b), PORES[0]);
    u.ord = [0, 6, 2, 8, 4, 10, 1, 7, 3, 9, 5, 11].indexOf(i);
  });

  /* ================= D. title and roadmap ================= */
  const title = G(root);
  T(title, 0, 0, 'Digestion', { size: 104, weight: 700, anchor: 'middle' });
  const sub = T(title, 0, 58, 'breaking food into small molecules', { size: 32, weight: 500, anchor: 'middle', fill: C.muted });
  const road = G(root);
  const stops = [
    { x: 240, text: 'Balanced diet', draw: g => { const p = miniPlate(g, 64); tr(p, 0, -30); return p; } },
    { x: 600, text: 'Food tests', draw: g => { const tt = testTube(g, 40, 150, { level: 0.55, liquid: '#3D7BE0' }); tr(tt, 0, -30); return tt; } },
    { x: 960, text: 'The journey', draw: g => {
      const mb = G(g); tr(mb, 0, -28, 0.27);
      silhouette(mb, 12);
      E('path', { d: poly(FP.slice(iL - 1)), fill: 'none', stroke: COLON, 'stroke-width': 16, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mb);
      E('path', { d: poly(FP.slice(0, iL)), fill: 'none', stroke: PINK, 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mb);
      const bg = G(mb, { transform: BAGT }); stomachWall(bg, '#7A2444');
      const sw = sandwich(mb, 0.62);
      return sw;
    } },
  ].map(st => {
    const g = G(road); tr(g, st.x, 445);
    card(g, -160, -135, 320, 270, { fill: C.card, stroke: C.line });
    const hi = card(g, -160, -135, 320, 270, { fill: 'none', stroke: C.energy, sw: 4 });
    const art = G(g);
    const part = st.draw(art);
    T(g, 0, 102, st.text, { size: 30, weight: 600, anchor: 'middle' });
    return { g, hi, part, x: st.x };
  });
  const roadArrows = [arrow(road, 404, 445, 436, 445, { color: C.faint, width: 5 }), arrow(road, 764, 445, 796, 445, { color: C.faint, width: 5 })];
  const BEN = ['#3D7BE0', '#5BB55B', '#E8D24A', '#F08A2E', '#B33A2A'];
  const lerpHex = (a, b, p) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], p)).toString(16).padStart(2, '0')).join(''); };
  const alongFP = u => { const f = clamp(u) * (NP - 1), i = Math.min(NP - 2, Math.floor(f)), q = f - i; return [lerp(FP[i][0], FP[i + 1][0], q), lerp(FP[i][1], FP[i + 1][1], q)]; };

  /* ================= timing ================= */
  const tDraw0 = at('hook') + 0.05, tDraw1 = mid('hook', 0.34);
  const tShr0 = mid('hook', 0.3), tShr1 = mid('hook', 0.5);
  const tUn0 = mid('hook', 0.38), tUn1 = mid('hook', 0.76);
  const tCar = mid('hook', 0.6);
  const tBack0 = at('acid') - 0.1, tBack1 = at('acid') + 0.7;
  const tZ0 = at('acid') + 0.25, tZ1 = at('acid') + 1.45;
  const tCrumb = mid('acid', 0.17), tMol = mid('acid', 0.27);
  const tAcid = mid('acid', 0.44), tMetal = mid('acid', 0.52), tQ = mid('acid', 0.78);
  const tDef = at('def'), tBreak = mid('def', 0.25);
  const tPlan = at('plan');
  const showAt = [mid('plan', 0.1), mid('plan', 0.34), mid('plan', 0.58)];
  const sEnd = 1 / K;

  return t => {
    /* --- A. body, canal, cars; then the zoom into its stomach --- */
    const sh = P(t, tShr0, tShr1 - tShr0), z = P(t, tZ0, tZ1 - tZ0);
    const s0 = lerp(0.92, sF, sh), fx0 = lerp(600, BXF, sh), fy0 = lerp(395, BYF, sh);
    const s = s0 * Math.pow(sEnd / s0, z);
    const Tx = lerp(fx0, BAGC[0], z) - s * BAGL[0] * z, Ty = lerp(fy0, BAGC[1], z) - s * BAGL[1] * z;
    const bodyT = `translate(${Tx.toFixed(2)} ${Ty.toFixed(2)}) scale(${s.toFixed(4)})`;
    const aBody = P(t, 0.25, 0.6, linear) * (1 - P(t, tZ0 + 0.85, 0.35, linear));
    op(body, aBody);
    if (aBody > 0) {
      body.setAttribute('transform', bodyT);
      op(skin, 1 - 0.4 * P(t, tUn1 - 0.4, 0.6, linear) + 0.4 * P(t, tBack0, 0.6, linear));
      const g = P(t, tDraw0, tDraw1 - tDraw0, linear);
      const m = Math.min(P(t, tUn0, tUn1 - tUn0, linear), 1 - P(t, tBack0, tBack1 - tBack0, linear));
      drawCanal(m);
      const reveal = (a, b) => clamp((g * NP - a) / (b - a));
      glowP.setAttribute('stroke-dashoffset', (1 - reveal(0, NP)).toFixed(4));
      SEGS.forEach(sg => { const v = (1 - reveal(sg.a, sg.b)).toFixed(4); sg.o.setAttribute('stroke-dashoffset', v); sg.f.setAttribute('stroke-dashoffset', v); });
      op(glowP, (0.55 + 0.45 * wave(t, 1.6) * AMP) * (1 - clamp(m * 2)) * (1 - clamp(z * 3)));
      op(bagG, reveal(iS0 - 6, iS1) * (1 - clamp((m - 0.02) / 0.08)));
    }
    cars.forEach((c, k) => {
      const p = P(t, tCar + k * 0.22, 0.8, easeOut), a = clamp(p * 1.5) * (1 - P(t, tBack0 - 0.1, 0.4, linear));
      op(c.g, a);
      if (a > 0) tr(c.g, c.x + (1 - p) * 160, CARY);
    });
    const aEnds = P(t, tUn1 - 0.1, 0.5, linear) * (1 - P(t, tBack0 - 0.1, 0.3, linear));
    op(lblMouth, aEnds); op(lblAnus, aEnds);

    /* --- B. the stomach close-up (rides the zoom, then stands still) --- */
    const aSt = P(t, tZ0 + 0.65, 0.45, linear) * (1 - P(t, tDef - 0.25, 0.5, linear));
    op(stom, aSt);
    if (aSt > 0) {
      if (z < 1) stom.setAttribute('transform', bodyT + ' ' + BAGT); else stom.removeAttribute('transform');
      const sp = []; for (let x = 300; x <= 820; x += 20) sp.push([x, SURF + Math.sin(x * 0.03 + t * 2.2) * 6 * AMP + Math.sin(x * 0.011 - t * 1.3) * 4 * AMP]);
      const sd = poly(sp);
      surf.setAttribute('d', sd); acidFill.setAttribute('d', sd + 'L820,720 L300,720 Z');
      // bubbles: steady, then a boil once the acid is named
      bub.upd(t + 1.6 * clamp(t - tAcid, 0, tQ - tAcid), 0.55 + 0.45 * P(t, tAcid, 0.6, linear));
      // the sandwich bobs, shakes, then breaks apart into crumbs, and the crumbs into molecules
      const brk = P(t, tCrumb, 0.9, easeIn);
      const shake = brk > 0 && brk < 1 ? Math.sin(t * 40) * 5 * (1 - brk) : 0;
      tr(sand, SX + shake, SURF + 4 + Math.sin(t * 1.7) * 6 * AMP, Math.max(0.01, 0.95 * (1 - brk)), Math.sin(t * 1.3) * 5 * AMP);
      op(sand, 1 - P(t, tCrumb + 0.55, 0.35, linear));
      crumbs.forEach((c, k) => {
        const u = P(t, tCrumb + 0.45 + k * 0.03, 1.2, easeOut);
        const gone = P(t, tMol + k * 0.17, 0.5, linear);
        if (u <= 0 || gone >= 1) { op(c.el, 0); return; }
        tr(c.el, SX + c.dx * u, SURF + c.dy * u + Math.sin(t * 2 + k) * 3 * AMP, 1 - 0.6 * gone, c.rot * u);
        op(c.el, clamp(u * 4) * (1 - gone));
      });
      beads.forEach(b => {
        const c = crumbs[b.from], u = P(t, tMol + b.from * 0.17 + b.st, 1.3, easeOut);
        if (u <= 0) { op(b.g, 0); return; }
        const wx = Math.sin(t * b.f1 + b.ph) * 24 * AMP, wy = Math.cos(t * b.f2 + b.ph) * 14 * AMP;
        tr(b.g, lerp(SX + c.dx, b.bx + wx, u), lerp(SURF + c.dy, b.by + wy, u), 0.4 + 0.6 * pop(clamp(u * 1.6)), (t * 30 + b.ph * 60) % 360);
        op(b.g, clamp(u * 3));
      });
      lbStom.set(win(t, tZ1 - 0.1, tMetal + 0.2, 0.4));
      lbAcid.set(win(t, tAcid, tQ, 0.4));
      // the nail fizzes away
      const aIn = win(t, tMetal, tQ - 0.1, 0.45);
      op(inset, aIn);
      if (aIn > 0) {
        const dis = P(t, tMetal + 0.35, 1.9, linear);
        nail.setAttribute('transform', `translate(0 ${(44 * dis).toFixed(1)}) rotate(16) scale(${(1 - 0.45 * dis).toFixed(3)} ${(1 - 0.72 * dis).toFixed(3)})`);
        op(nail, 1 - 0.3 * dis);
        nBub.upd(t, 1 - 0.4 * dis);
        tr(inset, 1010 + (1 - P(t, tMetal, 0.5, easeOut)) * 40, 410);
      }
      // why doesn't it digest itself?
      const qp = P(t, tQ, 0.6, pop);
      op(qMark, clamp(qp * 2)); qMark.setAttribute('transform', `translate(930 400) scale(${Math.max(0.01, 0.6 + 0.4 * qp + 0.04 * wave(t, 1.2) * AMP).toFixed(3)}) translate(-930 -400)`);
      op(wallGlow, P(t, tQ, 0.5, linear) * (0.5 + 0.5 * wave(t, 1.2)));
    }

    /* --- C. the definition: into the blood --- */
    const aCut = P(t, tDef - 0.1, 0.5, linear) * (1 - P(t, tPlan, 0.4, linear));
    op(cut, aCut);
    if (aCut > 0) {
      const flow = t * 120 * (R ? 0.5 : 1);
      rbc.forEach((e, k) => { const x = 40 + ((k * 104 + flow) % 1144); attr(e, 'cx', x); attr(e, 'cy', 582 + ((k % 3) - 1) * 9); op(e, Math.min(1, (x - 40) / 40, (1184 - x) / 40)); });
      op(bonds, 1 - P(t, tBreak, 0.4, linear));
      units.forEach((u, i) => {
        const t0 = tBreak + 0.1 + u.ord * 0.2;
        const fall = P(t, t0, 1.0), pass = P(t, t0 + 1.0, 0.7), fl = Math.max(0, t - (t0 + 1.7));
        let x = u.x + (fall <= 0 ? Math.sin(t * 2 + i) * 2 * AMP : 0), y = u.y;
        if (fall > 0) { x = lerp(u.x, u.pore, fall); y = lerp(u.y, 436, fall) - Math.sin(fall * Math.PI) * 24; }
        if (pass > 0) y = lerp(436, 582, pass);
        if (fl > 0) { x = u.pore + fl * 120 * (R ? 0.5 : 1); y = 582 + Math.sin(fl * 3 + i) * 6 * AMP; }
        tr(u.g, x, y, lerp(1, u.hex ? 0.62 : 0.7, pass), fall > 0 ? fall * 60 + fl * 40 : 0);
        op(u.g, Math.min(1, (1160 - x) / 50));
      });
    }

    /* --- D. title, then the roadmap --- */
    const tp = P(t, tDef + 0.15, 0.9, easeOut), tq = P(t, tPlan + 0.1, 0.9);
    op(title, tp);
    tr(title, 600, lerp(lerp(212, 192, tp), 150, tq), lerp(1, 0.72, tq));
    op(sub, P(t, mid('def', 0.3), 0.6, linear) * (1 - P(t, tPlan, 0.4, linear)));
    op(road, P(t, showAt[0] - 0.1, 0.3, linear));
    if (t > showAt[0] - 0.1) {
      stops.forEach((st, i) => {
        const p = P(t, showAt[i], 0.6, pop);
        op(st.g, clamp(p * 2));
        tr(st.g, st.x, 445 + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
        op(st.hi, win(t, showAt[i] + 0.1, showAt[i] + 1.9, 0.35));
      });
      // plate sectors pop in turn; the tube runs through Benedict's colours; a sandwich travels mouth to anus
      stops[0].part.secs.forEach((e, k) => op(e, P(t, showAt[0] + 0.25 + k * 0.12, 0.3, linear)));
      const bp = P(t, showAt[1] + 0.5, 2.4, linear) * 4, bi = Math.min(3, Math.floor(bp));
      stops[1].part.set(0.55, lerpHex(BEN[bi], BEN[bi + 1], clamp(bp - bi)));
      const u = ((Math.max(0, t - showAt[2] - 0.3)) / 3.4) % 1, q = alongFP(u);
      tr(stops[2].part, q[0], q[1], 1, Math.sin(t * 6) * 6 * AMP);
      op(stops[2].part, Math.min(1, u * 12, (1 - u) * 12));
      roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, P(t, showAt[i + 1] - 0.2, 0.2, linear)); });
    }
  };
});

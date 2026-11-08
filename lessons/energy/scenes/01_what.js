/* What energy is.
   happen: a big spark splits into five, one for each thing that moves, heats up, makes a sound, glows or grows
   -> joules: "J = joule" and James Joule's name card -> apple: 1 J lifts a small apple 1 m up a metre rule
   -> kilo: a "1 kJ" block breaks into 1000 dots -> banana: a food label, about 400 kJ
   -> law: the law of conservation of energy over a level balance -> cannot: "created" and "destroyed" struck
   out, "transferred" lights up as sparks pour from one jar into another, then travel from here to there
   -> total (showpiece): the jars swap sparks back and forth while "total = 100 J" never changes
   -> useup: a phone's battery empties into light and sound (useful) and heat (wasted); the total bar holds
   -> machine: a perpetual-motion wheel slows to a stop: impossible. */
scene('what', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const vis = (t, a, b) => win(t, a, b, 0.45);
  const bez = (a, c, b, u) => { const q = 1 - u; return [q * q * a[0] + 2 * q * u * c[0] + u * u * b[0], q * q * a[1] + 2 * q * u * c[1] + u * u * b[1]]; };
  const f1 = v => (+v).toFixed(1);

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* a point along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const q = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  const arcPts = (a, c, b, n) => { const o = []; for (let i = 0; i <= n; i++) o.push(bez(a, c, b, i / n)); return o; };

  /* ================= A. energy makes things happen ================= */
  const A = G(root);
  const headA = rich(A, 600, 178, [['Energy', C.energy, 800], ' makes things ', ['happen', C.ink, 800]], { size: 52, anchor: 'middle' });
  const headSpans = Array.from(headA.childNodes);
  const BIG = [600, 268];
  const bigSp = spark(A, 30, { seed: 3 });
  function ballArt(g) {
    E('path', { d: 'M-88,62 L88,62', stroke: '#6F8495', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const lines = [0, 1, 2].map(() => E('path', { stroke: '#BDEBFA', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, g));
    const b = G(g);
    E('circle', { r: 30, fill: ball(C.water, C.waterDk), stroke: '#BDEBFA', 'stroke-width': 2.5 }, b);
    E('path', { d: 'M-29,-4 Q0,-16 29,-4 M-24,16 Q0,6 24,16', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.85 }, b);
    return (t, t0) => {
      const w = 1.6, s = Math.sin((t - t0) * w), c = Math.cos((t - t0) * w), x = 46 * s * AMP, v = 46 * w * c * AMP;
      tr(b, x, 30, 1, (x / 30) * 180 / Math.PI);
      const k = Math.abs(v) / (46 * w), dir = v >= 0 ? -1 : 1;
      lines.forEach((l, i) => {
        const y = 18 + i * 12, x0 = x + dir * 36;
        l.setAttribute('d', `M${f1(x0)},${y} L${f1(x0 + dir * (10 + 22 * k))},${y}`);
        l.style.opacity = (k * 0.8).toFixed(3);
      });
    };
  }
  function kettleArt(g) {
    const hot = E('ellipse', { cx: 0, cy: 50, rx: 64, ry: 20, fill: glow(C.heat) }, g);
    E('rect', { x: -54, y: 44, width: 108, height: 16, rx: 6, fill: '#3A4855', stroke: '#6F8495', 'stroke-width': 2 }, g);
    E('path', { d: 'M-40,6 C-56,-4 -66,-20 -76,-34 L-66,-40 C-58,-28 -48,-18 -36,-12 Z', fill: ball('#D3DEE5', '#7D93A2'), stroke: '#EEF4F7', 'stroke-width': 2 }, g);
    E('path', { d: 'M38,-22 C68,-26 72,24 42,26', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-46,44 L-38,-24 Q-36,-40 -18,-42 L18,-42 Q36,-40 38,-24 L46,44 Z', fill: ball('#D3DEE5', '#7D93A2'), stroke: '#EEF4F7', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -7, y: -56, width: 14, height: 12, rx: 4, fill: '#5D6B78' }, g);
    const steam = heatWaves(g, { n: 3, h: 60, spacing: 13, color: '#EAF2F7', width: 4.5, speed: 0.7 }); tr(steam, -78, -44);
    return (t, t0) => { steam.upd(t); op(steam, fade(t, t0, 0.6)); op(hot, fade(t, t0, 0.6) * (0.55 + 0.3 * wave(t, 1.1))); };
  }
  function speakerArt(g) {
    const arcs = [0, 1, 2].map(() => E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g));
    E('rect', { x: -44, y: -64, width: 88, height: 128, rx: 12, fill: '#26323C', stroke: '#9AA6B2', 'stroke-width': 3 }, g);
    E('circle', { cx: 0, cy: -34, r: 11, fill: '#0E1920', stroke: '#C9D6DE', 'stroke-width': 2.5 }, g);
    E('circle', { cx: 0, cy: 20, r: 30, fill: '#0E1920', stroke: '#C9D6DE', 'stroke-width': 3 }, g);
    const cone = E('circle', { cx: 0, cy: 20, r: 13, fill: '#6F8495' }, g);
    return (t, t0) => {
      const on = fade(t, t0, 0.3);
      attr(cone, 'r', 13 * (1 + 0.2 * AMP * on * Math.max(0, Math.sin(t * 18))));
      arcs.forEach((a, k) => {
        const q = ((t * 0.9 + k / 3) % 1 + 1) % 1, r = 16 + q * 44, ang = 0.75, cx = 46, cy = 0;
        a.setAttribute('d', `M${f1(cx + r * Math.cos(-ang))},${f1(cy + r * Math.sin(-ang))} A${f1(r)},${f1(r)} 0 0 1 ${f1(cx + r * Math.cos(ang))},${f1(cy + r * Math.sin(ang))}`);
        a.style.opacity = (on * (1 - q) * 0.9).toFixed(3);
      });
    };
  }
  function lampArt(g) {
    const b = enBulb(g, 'filament', { s: 0.95 }); tr(b, 0, 14);
    return (t, t0) => b.set(fade(t, t0 + 0.05, 0.5) * (0.92 + 0.08 * wave(t, 0.7)));
  }
  function seedArt(g) {
    const stem = E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    const lL = G(g), lR = G(g); leaf(lL, 0.25); leaf(lR, 0.25);
    E('path', { d: 'M-38,18 L38,18 L30,64 L-30,64 Z', fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -42, y: 8, width: 84, height: 14, rx: 4, fill: '#C46E36', stroke: '#F0B48A', 'stroke-width': 2 }, g);
    E('ellipse', { cx: 0, cy: 9, rx: 33, ry: 4, fill: C.soil }, g);
    return (t, t0) => {
      const gr = P(t, t0 + 0.05, 2.4, easeOut), h = 10 + 66 * gr, sway = (R ? 0 : 3) * Math.sin(t * 1.3) * gr;
      const tx = sway, ty = 10 - h;
      stem.setAttribute('d', `M0,10 Q${f1(sway * 0.4)},${f1(10 - h * 0.5)} ${f1(tx)},${f1(ty)}`);
      const ls = Math.max(0.01, P(t, t0 + 0.35, 1.8, easeOut));
      tr(lL, tx, ty + 6, ls, 205); tr(lR, tx, ty + 6, ls, -25);
    };
  }
  const IX = [140, 370, 600, 830, 1060], IY = 490, HY = 376;
  const ITEMS = [['moves', ballArt, 0.41], ['heats up', kettleArt, 0.49], ['makes a sound', speakerArt, 0.61], ['glows', lampArt, 0.75], ['grows', seedArt, 0.81]].map(([label, make, f], i) => {
    const g = G(A); tr(g, IX[i], IY);
    const art = G(g), upd = make(art);
    const lab = T(g, 0, 140, label, { size: 30, weight: 600, anchor: 'middle' });
    const sp = spark(A, 13, { seed: 10 + i });
    const tArr = mid('happen', f);
    return { g, upd, lab, sp, tArr, tDep: tArr - 0.75, x: IX[i] };
  });

  /* ================= B. joules ================= */
  const B = G(root);
  const unit = G(B);
  card(unit, -220, -130, 440, 260, { fill: C.card, stroke: C.line });
  const jDisc = G(unit);
  E('circle', { r: 78, fill: ball(C.energy, '#C9A800'), stroke: C.energyLt, 'stroke-width': 4 }, jDisc);
  T(jDisc, 0, 42, 'J', { size: 120, weight: 700, anchor: 'middle', fill: '#3A3000' });
  T(unit, 2, 4, '= joule', { size: 54, weight: 700 });
  const unitNote = T(unit, 0, 108, 'the unit of energy', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const nameC = G(B);
  card(nameC, -165, -205, 330, 410, { fill: C.card, stroke: C.line });
  const portrait = G(nameC); tr(portrait, 0, -78);
  {
    const cid = 'whatJouleClip';
    const cp = E('clipPath', { id: cid }, defs()); E('circle', { r: 92 }, cp);
    E('circle', { r: 92, fill: linGrad('#2B5C75', '#173646', true) }, portrait);
    const inner = G(portrait, { 'clip-path': `url(#${cid})` });
    E('path', { d: 'M-96,100 C-92,46 -52,28 0,26 C52,28 92,46 96,100 Z', fill: '#2A2F3A', stroke: '#454D5C', 'stroke-width': 2 }, inner);
    E('path', { d: 'M-20,27 L0,64 L20,27 Z', fill: '#F4F7FA' }, inner);
    E('path', { d: 'M-16,34 L0,41 L16,34 L16,48 L0,41 L-16,48 Z', fill: '#1B1F27' }, inner);
    E('rect', { x: -12, y: 4, width: 24, height: 26, fill: '#D9A47E' }, inner);
    E('circle', { cx: 0, cy: -20, r: 34, fill: ball('#F0C4A0', '#C98E62') }, inner);
    E('path', { d: 'M-35,-24 C-38,-52 -14,-62 4,-58 C24,-56 38,-44 35,-24 C31,-38 18,-46 0,-44 C-16,-44 -29,-38 -35,-24 Z', fill: '#6B4A33' }, inner);
    E('path', { d: 'M-35,-18 C-35,12 -18,30 0,30 C18,30 35,12 35,-18 C31,0 19,12 0,12 C-19,12 -31,0 -35,-18 Z', fill: '#8A6A4E' }, inner);
    E('circle', { cx: -12, cy: -22, r: 3.6, fill: '#2A1D14' }, inner);
    E('circle', { cx: 12, cy: -22, r: 3.6, fill: '#2A1D14' }, inner);
    E('path', { d: 'M-7,3 Q0,6 7,3', fill: 'none', stroke: '#8A5A3E', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, inner);
    E('circle', { r: 92, fill: 'none', stroke: C.energyLt, 'stroke-width': 4 }, portrait);
  }
  T(nameC, 0, 72, 'James Joule', { size: 38, weight: 700, anchor: 'middle' });
  T(nameC, 0, 116, '1818–1889', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(nameC, 0, 156, 'English scientist', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= C. 1 J lifts a small apple by 1 m ================= */
  const Cg = G(root);
  const RX = 520, Y0 = 662, Y1 = 284;            // metre rule: x, the 0 m line and the 1 m line
  const headC = rich(Cg, 790, 170, [['1 joule', C.energy, 800], ' is quite small'], { size: 44, anchor: 'middle' });
  E('path', { d: `M${RX - 24},${Y0} L840,${Y0}`, stroke: '#6F8495', 'stroke-width': 5, 'stroke-linecap': 'round' }, Cg);
  const ruler = G(Cg);
  E('rect', { x: RX - 24, y: Y1 - 12, width: 48, height: Y0 - Y1 + 12, rx: 5, fill: '#E9DFC4', stroke: '#B9A57A', 'stroke-width': 2 }, ruler);
  { let d = ''; for (let k = 0; k <= 10; k++) { const y = Y0 - k * (Y0 - Y1) / 10; d += `M${RX + 24},${y} L${RX + 24 - (k % 5 ? 12 : 26)},${y} `; } E('path', { d, stroke: '#5A4A2A', 'stroke-width': 3 }, ruler); }
  T(ruler, RX - 38, Y0 + 10, '0', { size: 28, weight: 700, anchor: 'end' });
  T(ruler, RX - 38, (Y0 + Y1) / 2 + 10, '0.5 m', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  T(ruler, RX - 38, Y1 + 10, '1 m', { size: 28, weight: 700, anchor: 'end' });
  const AX = 642;
  const hand = G(Cg); _enHand(hand);
  const apple = G(Cg);
  E('path', { d: 'M0,-26 C-14,-38 -40,-34 -40,-6 C-40,20 -18,34 0,26 C18,34 40,20 40,-6 C40,-34 14,-38 0,-26 Z', fill: ball('#FF6B5C', '#B02A2A'), stroke: '#FFB0A6', 'stroke-width': 2.5 }, apple);
  E('path', { d: 'M0,-26 Q2,-38 7,-46', fill: 'none', stroke: '#6B4A33', 'stroke-width': 5, 'stroke-linecap': 'round' }, apple);
  E('path', { d: 'M5,-40 C14,-52 30,-50 34,-44 C26,-36 14,-36 5,-40 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 1.5 }, apple);
  const lift = arrow(Cg, 735, Y0 - 6, 735, Y1 + 6, { color: C.energy, width: 6 });
  const liftLab = T(Cg, 756, (Y0 + Y1) / 2 + 12, '1 m', { size: 36, weight: 700, fill: C.energy });
  const jSp = spark(Cg, 15, { seed: 7 });
  const jLab = T(Cg, 945, 500, '1 J', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const SP0 = [945, 440];
  const aboutJ = chip(Cg, 'about 1 J', { size: 34, fill: '#3A3000', stroke: C.energy, color: C.energy, sw: 3 });

  /* ================= D. 1 kJ = 1000 J ================= */
  const Dg = G(root);
  const headD = rich(Dg, 600, 178, [['kilo', C.energy, 800], 'joules:  ', ['1 kJ = 1000 J', C.ink, 800]], { size: 46, anchor: 'middle' });
  const BLK = [290, 438];
  const block = G(Dg); tr(block, BLK[0], BLK[1]);
  const blkFill = E('rect', { x: -105, y: -105, width: 210, height: 210, rx: 20, fill: C.energy, stroke: '#C9A800', 'stroke-width': 4 }, block);
  const blkGhost = E('rect', { x: -105, y: -105, width: 210, height: 210, rx: 20, fill: 'none', stroke: C.energy, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, block);
  const blkTxt = T(block, 0, 22, '1 kJ', { size: 66, weight: 700, anchor: 'middle', fill: '#3A3000' });
  const blkTxt2 = T(block, 0, 22, '1 kJ', { size: 66, weight: 700, anchor: 'middle', fill: C.energy });
  const eqD = T(Dg, 470, 466, '=', { size: 84, weight: 700, anchor: 'middle', fill: C.ink });
  const TILE = 98, TP = 9.8, TR = 3.5;
  let dotsD = '';
  for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) { const x = c * TP + TP / 2 - TILE / 2, y = r * TP + TP / 2 - TILE / 2; dotsD += `M${f1(x - TR)},${f1(y)}a${TR},${TR} 0 1,0 ${2 * TR},0a${TR},${TR} 0 1,0 ${-2 * TR},0`; }
  const tiles = [];
  for (let k = 0; k < 10; k++) {
    const g = G(Dg);
    E('path', { d: dotsD, fill: C.energy }, g);
    tiles.push({ g, x: 615 + (k % 5) * 110, y: 380 + Math.floor(k / 5) * 110 });
  }
  const lab1000 = T(Dg, 835, 548 + 70, '1000 J', { size: 50, weight: 700, anchor: 'middle', fill: C.energy });
  const noteD = T(Dg, 835, 664, 'each dot is 1 joule', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= E. a banana: about 400 kJ ================= */
  const Eg = G(root);
  const ban = G(Eg);
  {
    const P0 = [-150, -28], Cc = [-10, 112], P2 = [146, -62], out = [], inn = [];
    for (let i = 0; i <= 16; i++) {
      const u = i / 16, q = 1 - u;
      const x = q * q * P0[0] + 2 * q * u * Cc[0] + u * u * P2[0], y = q * q * P0[1] + 2 * q * u * Cc[1] + u * u * P2[1];
      const dx = 2 * q * (Cc[0] - P0[0]) + 2 * u * (P2[0] - Cc[0]), dy = 2 * q * (Cc[1] - P0[1]) + 2 * u * (P2[1] - Cc[1]);
      const L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, w = 8 + 50 * Math.pow(Math.sin(Math.PI * u), 0.7);
      out.push([x + nx * w / 2, y + ny * w / 2]); inn.push([x - nx * w / 2, y - ny * w / 2]);
    }
    E('path', { d: closedPath(out.concat(inn.reverse())), fill: ball('#FFE066', '#D9A400'), stroke: '#B88A00', 'stroke-width': 3, 'stroke-linejoin': 'round' }, ban);
    E('path', { d: openPath(inn.slice(4, 13).map(p => [p[0], p[1] + 9])), fill: 'none', stroke: '#FFF3B0', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, ban);
    E('path', { d: 'M140,-58 L156,-82 L166,-76 L152,-52 Z', fill: '#6B5A2A', stroke: '#4A3B18', 'stroke-width': 2, 'stroke-linejoin': 'round' }, ban);
    E('ellipse', { cx: -151, cy: -29, rx: 7, ry: 5, fill: '#4A3B18' }, ban);
  }
  const lbl = G(Eg); tr(lbl, 840, 432);
  E('rect', { x: -195, y: -150, width: 390, height: 300, rx: 16, fill: '#F7F4EC', stroke: '#C9D3DC', 'stroke-width': 3 }, lbl);
  T(lbl, -165, -92, 'Nutrition', { size: 44, weight: 800, fill: '#10202B' });
  E('rect', { x: -165, y: -76, width: 330, height: 8, fill: '#10202B' }, lbl);
  T(lbl, -165, -32, 'per banana', { size: 28, weight: 600, fill: '#3B4A57' });
  E('rect', { x: -165, y: -12, width: 330, height: 3, fill: '#10202B' }, lbl);
  const hiE = E('rect', { x: -177, y: 14, width: 354, height: 64, rx: 10, fill: C.energy }, lbl);
  T(lbl, -165, 58, 'Energy', { size: 32, weight: 700, fill: '#10202B' });
  T(lbl, 165, 58, 'about 400 kJ', { size: 34, weight: 800, fill: '#10202B', anchor: 'end' });
  E('rect', { x: -165, y: 96, width: 330, height: 3, fill: '#10202B' }, lbl);
  T(lbl, -165, 132, 'Carbohydrate', { size: 26, weight: 600, fill: '#3B4A57' });
  T(lbl, 165, 132, '27 g', { size: 26, weight: 600, fill: '#3B4A57', anchor: 'end' });
  const in400 = T(Eg, 840, 640, '= 400 000 J', { size: 40, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= F. the law of conservation of energy ================= */
  const Fg = G(root);
  const lawChip = chip(Fg, 'the most important rule in physics', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy, sw: 2.5 }); tr(lawChip, 600, 148);
  const plaque = G(Fg);
  E('rect', { x: -410, y: -58, width: 820, height: 116, rx: 26, fill: C.card, stroke: C.energyLt, 'stroke-width': 4 }, plaque);
  rich(plaque, 0, 16, ['the law of ', ['conservation', C.energy, 800], ' of energy'], { size: 46, anchor: 'middle' });
  const BAL = [600, 410];                       // pivot
  const balG = G(Fg);
  E('path', { d: 'M560,660 L640,660 L620,630 L580,630 Z', fill: '#6F8495', stroke: '#9DB0BF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, balG);
  E('rect', { x: 591, y: 410, width: 18, height: 222, rx: 4, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, balG);
  const beam = E('rect', { x: -300, y: -8, width: 600, height: 16, rx: 8, fill: linGrad('#D3DEE5', '#8DA2B3', true), stroke: '#EEF4F7', 'stroke-width': 2 }, balG);
  E('circle', { cx: BAL[0], cy: BAL[1], r: 13, fill: '#5D6B78', stroke: '#C9D6DE', 'stroke-width': 3 }, balG);
  const pans = [-1, 1].map(side => {
    const g = G(balG);
    const str = E('path', { d: 'M0,0 L-62,104 M0,0 L62,104', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 3 }, g);
    E('path', { d: 'M-90,104 Q0,150 90,104 Z', fill: ball('#C9D6DE', '#6F8495'), stroke: '#EEF4F7', 'stroke-width': 2 }, g);
    const sps = [[-34, 94], [0, 84], [34, 94]].map(([x, y], k) => { const s = spark(g, 14, { seed: k + (side > 0 ? 4 : 1) }); tr(s, x, y); return s; });
    return { g, side, str, sps };
  });

  /* ================= G. cannot be created or destroyed; total; jars ================= */
  const Gw = G(root);                                   // the three words
  const W1 = chip(Gw, 'created', { size: 40, fill: C.card2, stroke: C.line, sw: 2 }); tr(W1, 270, 190);
  const W2 = chip(Gw, 'destroyed', { size: 40, fill: C.card2, stroke: C.line, sw: 2 }); tr(W2, 600, 190);
  const W3 = chip(Gw, 'transferred', { size: 40, fill: '#3A3000', stroke: C.energy, color: C.energy, sw: 3 }); tr(W3, 930, 190);
  const st1 = strike(Gw, 270 - W1.w / 2 + 6, 190, 270 + W1.w / 2 - 6);
  const st2 = strike(Gw, 600 - W2.w / 2 + 6, 190, 600 + W2.w / 2 - 6);
  const okW = tick(Gw, 17); tr(okW, 930 + W3.w / 2 + 34, 192);
  const glowW = E('ellipse', { cx: 930, cy: 190, rx: W3.w * 0.7, ry: 60, fill: glow(C.energy) }, Gw);
  Gw.insertBefore(glowW, Gw.firstChild);

  const Gj = G(root);                                   // the two jars
  const JA = [420, 450], JB = [780, 450];
  const jarA = enJar(Gj, 'gravitational', { w: 130, h: 170, level: 0.8 }); tr(jarA, JA[0], JA[1]);
  const jarB = enJar(Gj, 'kinetic', { w: 130, h: 170, level: 0.2 }); tr(jarB, JB[0], JB[1]);
  const MA = [JA[0], JA[1] - 88], MB = [JB[0], JB[1] - 88];
  const flowAB = enSparkFlow(Gj, arcPts(MA, [600, 172], MB, 24), { n: 5, r: 12, seed: 3 });
  const flowBA = enSparkFlow(Gj, arcPts(MB, [600, 196], MA, 24), { n: 5, r: 12, seed: 8 });
  const rdA = T(Gj, JA[0], 622, '80 J', { size: 32, weight: 700, anchor: 'middle', fill: C.good });
  const rdB = T(Gj, JB[0], 622, '20 J', { size: 32, weight: 700, anchor: 'middle', fill: C.water });

  const Gp = G(root);                                   // from place to place
  function pin(parent, x, y) {
    const g = G(parent); tr(g, x, y);
    E('path', { d: 'M0,0 C-6,-14 -22,-26 -22,-42 A22,22 0 1 1 22,-42 C22,-26 6,-14 0,0 Z', fill: ball('#FF7B6B', '#B5372D'), stroke: '#FFC2BA', 'stroke-width': 2.5 }, g);
    E('circle', { cx: 0, cy: -42, r: 8, fill: '#FFFFFF' }, g);
    return g;
  }
  pin(Gp, 250, 690); pin(Gp, 950, 690);
  E('path', { d: 'M286,668 L914,668', stroke: C.faint, 'stroke-width': 4, 'stroke-dasharray': '4 12', 'stroke-linecap': 'round' }, Gp);
  T(Gp, 214, 668, 'here', { size: 28, weight: 700, anchor: 'end' });
  T(Gp, 986, 668, 'there', { size: 28, weight: 700 });
  const flowP = enSparkFlow(Gp, [[290, 668], [910, 668]], { n: 6, r: 11, speed: 240, seed: 12 });

  const Gc = G(root);                                   // the total counter (stays into "use up")
  E('rect', { x: -280, y: -60, width: 560, height: 120, rx: 28, fill: C.card, stroke: C.energy, 'stroke-width': 3 }, Gc);
  const cTot = rich(Gc, -24, 19, ['total = ', ['100 J', C.energy, 800]], { size: 54, anchor: 'middle' });
  const cBar = G(Gc);
  T(cBar, -252, 2, 'total', { size: 32, weight: 700 });
  E('rect', { x: -146, y: -38, width: 342, height: 38, rx: 10, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, cBar);
  const segBat = E('rect', { y: -35, height: 32, rx: 7, fill: EN.store.chemical.color }, cBar);
  const segUse = E('rect', { y: -35, height: 32, rx: 7, fill: EN.useful }, cBar);
  const segWas = E('rect', { y: -35, height: 32, rx: 7, fill: EN.wasted }, cBar);
  [['battery', EN.store.chemical.color, -146], ['useful', EN.useful, -12], ['wasted', EN.wasted, 102]].forEach(([w, c, x]) => {
    E('rect', { x, y: 18, width: 16, height: 16, rx: 4, fill: c }, cBar);
    T(cBar, x + 24, 34, w, { size: 24, weight: 600, fill: C.muted });
  });
  const cTick = tick(Gc, 16); tr(cTick, 236, 0);
  const CX0 = -143, CW = 336;

  /* ================= H. "use up": a phone battery -> light and sound + heat ================= */
  const H = G(root);
  const roomTint = E('ellipse', { cx: 790, cy: 500, rx: 400, ry: 230, fill: glow('#FF7A30') }, H);   // the warm tint of the other rooms
  const jarP = enJar(H, 'chemical', { label: 'battery', level: 1 }); tr(jarP, 130, 505);
  const phone = G(H); tr(phone, 322, 470);
  E('rect', { x: -84, y: -150, width: 168, height: 300, rx: 26, fill: '#16222B', stroke: '#9AA6B2', 'stroke-width': 4 }, phone);
  const pScreen = E('rect', { x: -70, y: -122, width: 140, height: 240, rx: 12, fill: linGrad('#3C8FC9', '#173F5E', true) }, phone);
  E('rect', { x: -22, y: -139, width: 44, height: 7, rx: 3.5, fill: '#3A4855' }, phone);
  E('path', { d: 'M-14,-40 L-14,20 M-14,-40 L22,-50 L22,8', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, phone);
  E('ellipse', { cx: -24, cy: 22, rx: 12, ry: 9, fill: '#FFFFFF' }, phone);
  E('ellipse', { cx: 12, cy: 10, rx: 12, ry: 9, fill: '#FFFFFF' }, phone);
  const viewer = G(H);
  const pv = person(viewer, { shirt: '#5B8DEF' });
  viewer.setAttribute('transform', 'translate(965 676) scale(-1.25 1.25)');
  const FACE = [940, 454];
  const YP = [[130, 414], [190, 330], [300, 362], [520, 378], [740, 410], FACE];
  const yel = [], ora = [], yr = rng(23);
  for (let k = 0; k < 7; k++) yel.push({ s: spark(H, 12, { seed: k + 1 }), td: 0 });
  for (let k = 0; k < 15; k++) ora.push({ s: spark(H, 11, { color: EN.wasted, seed: k + 9 }), td: 0, e: [480 + yr() * 640, 300 + yr() * 380], bend: -40 - yr() * 110, ph: yr() * TAU });
  const useC = chip(H, 'useful', { size: 30, fill: '#3A3000', stroke: EN.useful, color: EN.useful, sw: 3 }); tr(useC, 640, 312);
  const useT = T(H, 640, 366, 'light and sound', { size: 26, weight: 600, anchor: 'middle', fill: EN.useful });
  const wasC = chip(H, 'wasted', { size: 30, fill: '#3A1E0A', stroke: EN.wasted, color: EN.wasted, sw: 3 }); tr(wasC, 700, 610);
  const wasT = T(H, 700, 664, 'mostly as heat', { size: 26, weight: 600, anchor: 'middle', fill: EN.wasted });

  /* ================= I. the perpetual motion machine ================= */
  const Ig = G(root);
  const INK = '#E8D3A6', PAPER = '#2E2619';
  E('rect', { x: 140, y: 214, width: 580, height: 476, rx: 18, fill: PAPER, stroke: '#8A7350', 'stroke-width': 3 }, Ig);
  E('rect', { x: 156, y: 230, width: 548, height: 444, rx: 10, fill: 'none', stroke: '#5E4E33', 'stroke-width': 2 }, Ig);
  T(Ig, 430, 272, 'perpetual motion machine', { size: 32, weight: 700, anchor: 'middle', fill: '#F2E3C2' });
  const WC = [430, 478], WR = 142;
  E('path', { d: `M${WC[0]},${WC[1]} L${WC[0] - 78},648 M${WC[0]},${WC[1]} L${WC[0] + 78},648 M${WC[0] - 120},648 L${WC[0] + 120},648`, fill: 'none', stroke: INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, Ig);
  const wheel = G(Ig);
  E('circle', { r: WR, fill: 'none', stroke: INK, 'stroke-width': 6 }, wheel);
  { let d = ''; for (let i = 0; i < 8; i++) { const a = i * TAU / 8; d += `M0,0 L${f1(Math.cos(a) * WR)},${f1(Math.sin(a) * WR)} `; } E('path', { d, stroke: INK, 'stroke-width': 3.5, opacity: 0.8 }, wheel); }
  const arms = [];
  for (let i = 0; i < 8; i++) arms.push({ l: E('line', { stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, Ig), w: E('circle', { r: 16, fill: ball('#D9B77A', '#7A5A2E'), stroke: INK, 'stroke-width': 2 }, Ig) });
  E('circle', { cx: WC[0], cy: WC[1], r: 13, fill: '#5E4E33', stroke: INK, 'stroke-width': 4 }, Ig);
  const fric = [0, 1, 2, 3].map(k => spark(Ig, 9, { color: EN.wasted, seed: k + 20 }));
  const noW = cross(Ig, 120); tr(noW, WC[0], WC[1]);
  const free = T(Ig, 945, 300, 'runs forever,\nfor free?', { size: 38, weight: 600, anchor: 'middle', fill: C.muted, lh: 48 });
  const imp = T(Ig, 945, 460, 'impossible', { size: 60, weight: 800, anchor: 'middle', fill: C.bad });
  const brk = T(Ig, 945, 548, 'it would break the', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const law2 = G(Ig); tr(law2, 945, 614);
  E('rect', { x: -195, y: -40, width: 390, height: 80, rx: 20, fill: C.card, stroke: C.energyLt, 'stroke-width': 3 }, law2);
  rich(law2, 0, 10, ['law of ', ['conservation', C.energy, 800], ' of energy'], { size: 27, anchor: 'middle' });

  /* ================= timing ================= */
  // the jars' energy (J): A starts with 80, B with 20; each batch moves sparks one way, and each spark's
  // joules are booked out of one jar and into the other as it lands, so A + B is always 100
  const POUR = { t0: mid('cannot', 0.56), d: 1.6, dE: -60 };
  const SWAPS = [{ t0: at('total') + 0.05, d: 1.2, dE: 50 }, { t0: at('total') + 1.35, d: 1.2, dE: -40 }, { t0: at('total') + 2.65, d: 1.2, dE: 30 }];
  const landed = (b, t) => { let s = 0; for (let k = 0; k < 5; k++) s += P(t, b.t0 + b.d * (0.5 + 0.1 * k), 0.12, linear); return s / 5; };
  const energyA = t => 80 + POUR.dE * landed(POUR, t) + SWAPS.reduce((s, b) => s + b.dE * landed(b, t), 0);
  // "use up": spark departures from the battery jar (7 useful, 15 wasted, interleaved)
  const U0 = mid('useup', 0.52), U1 = mid('useup', 0.95);
  yel.forEach((y, k) => { y.td = lerp(U0, mid('useup', 0.8), k / 6); });
  ora.forEach((o, k) => { o.td = lerp(mid('useup', 0.58), U1, k / 14); });
  const NSP = yel.length + ora.length, FLY = 1.5;
  const tStop = mid('machine', 0.68), tW0 = at('machine') + 0.1, TS = tStop - tW0, W0 = 80;   // the wheel: deg/s at the start
  const wheelAngle = t => {
    if (t <= tW0) return 0;
    const tau = Math.min(1, (t - tW0) / TS), base = W0 * TS / 2.5 * (1 - Math.pow(1 - tau, 2.5));
    const after = Math.max(0, t - tStop);
    return base - (R ? 0 : 5 * Math.sin(after * 4.5) * Math.exp(-after * 2.2)) * (after > 0 ? 1 : 0);
  };

  return t => {
    /* ---- A ---- */
    const aA = vis(t, at('happen') - 0.3, at('joules') - 0.05);
    op(A, aA);
    if (aA > 0) {
      [at('happen') + 0.05, mid('happen', 0.12), mid('happen', 0.2)].forEach((t0, i) => headSpans[i].setAttribute('fill-opacity', fade(t, t0, 0.45).toFixed(3)));
      let gone = 0; ITEMS.forEach(it => { gone += P(t, it.tDep, 0.25, linear); });
      const bp = popIn(t, at('happen') + 0.1, 0.6), left = 1 - gone / 5;
      op(bigSp, clamp(bp * 2) * clamp(left * 5));
      tr(bigSp, BIG[0], BIG[1], Math.max(0.01, bp * (0.35 + 0.65 * left))); bigSp.upd(t);
      ITEMS.forEach((it, i) => {
        const u = clamp((t - it.tDep) / 0.75);
        if (u <= 0) { op(it.sp, 0); op(it.g, 0); return; }
        let x, y;
        if (u < 1) { const q = bez(BIG, [(BIG[0] + it.x) / 2, 190], [it.x, HY], ease(u)); x = q[0]; y = q[1]; }
        else { x = it.x; y = HY + (R ? 0 : 4 * Math.sin(t * 2 + i)); }
        const land = Math.sin(Math.PI * P(t, it.tArr, 0.35, linear)), need = Math.sin(Math.PI * P(t, mid('happen', 0.9) + i * 0.07, 0.5, linear));
        tr(it.sp, x, y, 0.7 + 0.3 * Math.min(1, u * 1.5) + 0.6 * land + 0.45 * need); op(it.sp, 1); it.sp.upd(t);
        const p = popIn(t, it.tArr - 0.05, 0.5);
        op(it.g, clamp(p * 2)); tr(it.g, it.x, IY + (1 - clamp(p)) * 20, Math.max(0.01, 0.82 + 0.28 * p));
        if (p > 0) it.upd(t, it.tArr);
        op(it.lab, fade(t, it.tArr + 0.1, 0.4));
      });
    }

    /* ---- B ---- */
    const aB = vis(t, at('joules') - 0.25, at('apple') - 0.05);
    op(B, aB);
    if (aB > 0) {
      const pu = popIn(t, at('joules') + 0.05, 0.6);
      op(unit, clamp(pu * 2)); tr(unit, 340, 420 + (1 - clamp(pu)) * 24, 0.92 + 0.08 * clamp(pu));
      tr(jDisc, -112, -6, 1 + 0.16 * Math.sin(Math.PI * P(t, mid('joules', 0.36), 0.6, linear)));
      op(unitNote, fade(t, mid('joules', 0.2)));
      const pn = P(t, mid('joules', 0.55), 0.7, easeOut);
      op(nameC, pn); tr(nameC, 875 + (1 - pn) * 60, 430);
    }

    /* ---- C ---- */
    const aC = vis(t, at('apple') - 0.25, at('kilo') - 0.05);
    op(Cg, aC);
    if (aC > 0) {
      op(headC, fade(t, at('apple') + 0.05));
      const lp = P(t, mid('apple', 0.6), 1.7);
      const bot = lerp(Y0, Y1, lp);                       // the apple's bottom
      tr(apple, AX, bot - 30, 1);
      const hp = fade(t, mid('apple', 0.54), 0.3);
      op(hand, hp); tr(hand, AX, bot + 22, 1.5, -90);
      lift.set(lp); op(lift, lp > 0.01 ? 1 : 0);
      op(liftLab, fade(t, mid('apple', 0.85), 0.4));
      const sf = P(t, mid('apple', 0.42), 0.8);
      const sp = sf < 1 ? bez(SP0, [800, 330], [AX + 30, bot - 58], ease(sf)) : [AX + 30, bot - 58];
      tr(jSp, sp[0], sp[1], 1 - 0.25 * sf); jSp.upd(t); op(jSp, fade(t, at('apple') + 0.15, 0.4));
      op(jLab, fade(t, at('apple') + 0.3, 0.4) * (1 - fade(t, mid('apple', 0.42), 0.3)));
      const cp = popIn(t, mid('apple', 0.9), 0.5);
      op(aboutJ, clamp(cp * 2)); tr(aboutJ, 930, Y1 + 6, Math.max(0.01, 0.8 + 0.2 * cp));
    }

    /* ---- D ---- */
    const aD = vis(t, at('kilo') - 0.25, at('banana') - 0.05);
    op(Dg, aD);
    if (aD > 0) {
      op(headD, fade(t, at('kilo') + 0.05));
      const bp = popIn(t, mid('kilo', 0.3), 0.55);
      const tb = mid('kilo', 0.72), brk = P(t, tb, 0.5, linear);
      op(block, clamp(bp * 2)); tr(block, BLK[0], BLK[1], Math.max(0.01, 0.85 + 0.15 * bp - 0.06 * Math.sin(Math.PI * brk)));
      op(blkFill, 1 - brk); op(blkTxt, 1 - brk); op(blkGhost, brk); op(blkTxt2, brk);
      tiles.forEach((tl, k) => {
        const u = P(t, tb + k * 0.04, 0.45);
        op(tl.g, u <= 0 ? 0 : clamp(u * 4));
        if (u > 0) tr(tl.g, lerp(BLK[0], tl.x, u), lerp(BLK[1], tl.y, u) - Math.sin(Math.PI * u) * 40, lerp(0.3, 1, u));
      });
      op(eqD, fade(t, mid('kilo', 0.78)));
      op(lab1000, fade(t, mid('kilo', 0.86))); op(noteD, fade(t, mid('kilo', 0.92)));
    }

    /* ---- E ---- */
    const aE = vis(t, at('banana') - 0.25, at('law') - 0.05);
    op(Eg, aE);
    if (aE > 0) {
      const lp = P(t, at('banana') + 0.05, 0.6, easeOut);
      op(lbl, lp); tr(lbl, 840 + (1 - lp) * 50, 432);
      const bp = popIn(t, mid('banana', 0.36), 0.6);
      op(ban, clamp(bp * 2)); tr(ban, 350, 450, Math.max(0.01, 0.8 + 0.2 * bp), R ? -8 : -8 + 3 * Math.sin(t * 1.4));
      op(hiE, 0.25 + 0.75 * fade(t, mid('banana', 0.7), 0.3) * (0.85 + 0.15 * wave(t, 1.2)));
      op(in400, fade(t, mid('banana', 0.86)));
    }

    /* ---- F ---- */
    const aF = vis(t, at('law') - 0.25, at('cannot') - 0.05);
    op(Fg, aF);
    if (aF > 0) {
      op(lawChip, fade(t, mid('law', 0.12)));
      const bp = P(t, mid('law', 0.22), 0.8, easeOut);
      op(balG, bp);
      const tt = t - mid('law', 0.22), tilt = tt > 0 ? 7 * Math.exp(-tt * 1.8) * Math.cos(tt * 5) * (R ? 0.3 : 1) : 7;
      const a = tilt * Math.PI / 180;
      beam.setAttribute('transform', `translate(${BAL[0]} ${BAL[1]}) rotate(${tilt.toFixed(2)})`);
      pans.forEach(pn => {
        const ex = BAL[0] + pn.side * 280 * Math.cos(a), ey = BAL[1] + pn.side * 280 * Math.sin(a);
        tr(pn.g, ex, ey);
        pn.sps.forEach(s => s.upd(t));
      });
      const pp = popIn(t, mid('law', 0.6), 0.6);
      op(plaque, clamp(pp * 2)); tr(plaque, 600, 252, Math.max(0.01, 0.85 + 0.15 * pp));
    }

    /* ---- G: words, jars, place to place, counter ---- */
    const aW = vis(t, at('cannot') - 0.25, at('total') - 0.05);
    op(Gw, aW);
    if (aW > 0) {
      const p1 = popIn(t, mid('cannot', 0.1), 0.45), p2 = popIn(t, mid('cannot', 0.22), 0.45), p3 = popIn(t, mid('cannot', 0.46), 0.5);
      op(W1, clamp(p1 * 2) * (1 - 0.45 * fade(t, mid('cannot', 0.2), 0.3))); tr(W1, 270, 190, Math.max(0.01, 0.8 + 0.2 * p1));
      op(W2, clamp(p2 * 2) * (1 - 0.45 * fade(t, mid('cannot', 0.31), 0.3))); tr(W2, 600, 190, Math.max(0.01, 0.8 + 0.2 * p2));
      op(W3, clamp(p3 * 2)); tr(W3, 930, 190, Math.max(0.01, 0.8 + 0.2 * p3 + 0.06 * Math.sin(Math.PI * P(t, mid('cannot', 0.53), 0.5, linear))));
      st1.set(P(t, mid('cannot', 0.19), 0.35)); st2.set(P(t, mid('cannot', 0.3), 0.35));
      const ok = popIn(t, mid('cannot', 0.54), 0.45); op(okW, clamp(ok * 2)); tr(okW, 930 + W3.w / 2 + 34, 192, Math.max(0.01, ok));
      op(glowW, fade(t, mid('cannot', 0.5), 0.4) * (0.55 + 0.25 * wave(t, 1.4)));
    }
    const aJ = vis(t, at('cannot') - 0.1, at('useup') - 0.05);
    op(Gj, aJ);
    if (aJ > 0) {
      const ea = energyA(t), ra = Math.round(ea);
      jarA.set(ea / 100); jarB.set(1 - ea / 100);
      const jp = P(t, at('cannot') + 0.1, 0.6, easeOut);
      tr(jarA, JA[0] - (1 - jp) * 40, JA[1]); tr(jarB, JB[0] + (1 - jp) * 40, JB[1]);
      op(jarA, jp); op(jarB, jp);
      const pAB = t < SWAPS[1].t0 ? P(t, POUR.t0, POUR.d, linear) : P(t, SWAPS[1].t0, SWAPS[1].d, linear);
      const pBA = t < SWAPS[2].t0 ? P(t, SWAPS[0].t0, SWAPS[0].d, linear) : P(t, SWAPS[2].t0, SWAPS[2].d, linear);
      flowAB.batch(pAB); flowBA.batch(pBA);
      const rd = fade(t, at('total') + 0.05, 0.4);
      op(rdA, rd); op(rdB, rd);
      setText(rdA, ra + ' J'); setText(rdB, (100 - ra) + ' J');
    }
    const aP = vis(t, mid('cannot', 0.78), at('total') - 0.05);
    op(Gp, aP);
    if (aP > 0) flowP.set(t - mid('cannot', 0.78), 1);
    const aCt = vis(t, at('total') - 0.05, at('machine') - 0.05);
    op(Gc, aCt);
    if (aCt > 0) {
      const cp = popIn(t, at('total') + 0.05, 0.55);
      const toBar = fade(t, at('useup') - 0.1, 0.5);
      tr(Gc, 600, 205, Math.max(0.01, 0.85 + 0.15 * cp) * (1 + 0.05 * Math.sin(Math.PI * P(t, mid('useup', 0.38), 0.6, linear))));
      op(cTot, 1 - toBar); op(cBar, toBar);
      // the bar: what's left in the battery, then what has gone out as useful and as wasted (booked as sparks leave)
      let dy = 0, dO = 0;
      yel.forEach(y => { dy += P(t, y.td, 0.15, linear); }); ora.forEach(o => { dO += P(t, o.td, 0.15, linear); });
      const wU = CW * dy / NSP, wW = CW * dO / NSP, wB = CW - wU - wW;
      attr(segUse, 'x', CX0); attr(segUse, 'width', Math.max(0, wU - 2)); op(segUse, wU > 3 ? 1 : 0);
      attr(segWas, 'x', CX0 + wU); attr(segWas, 'width', Math.max(0, wW - 2)); op(segWas, wW > 3 ? 1 : 0);
      attr(segBat, 'x', CX0 + wU + wW); attr(segBat, 'width', Math.max(0, wB)); op(segBat, wB > 1 ? 1 : 0);
      const tk = popIn(t, mid('total', 0.72), 0.45), tk2 = Math.sin(Math.PI * P(t, mid('useup', 0.38), 0.5, linear));
      op(cTick, clamp(tk * 2)); tr(cTick, 236, toBar > 0.5 ? -18 : 0, Math.max(0.01, tk + 0.3 * tk2));
    }

    /* ---- H: use up ---- */
    const aH = vis(t, at('useup') - 0.25, at('machine') - 0.05);
    op(H, aH);
    if (aH > 0) {
      let gone = 0;
      yel.forEach(y => { gone += P(t, y.td, 0.15, linear); }); ora.forEach(o => { gone += P(t, o.td, 0.15, linear); });
      const lv = 1 - gone / NSP;
      jarP.set(lv * 0.92);
      op(pScreen, 0.5 + 0.5 * Math.max(lv, 0.25));
      pv.pose({ lean: R ? 0 : 1.5 * Math.sin(t * 0.8), armL: [10, 12], armR: [-6, 10] });
      yel.forEach(y => {
        const u = clamp((t - y.td) / FLY);
        if (u <= 0 || u >= 1) { op(y.s, 0); return; }
        const q = along(YP, ease(u));
        tr(y.s, q[0], q[1]); y.s.upd(t); op(y.s, Math.min(1, u * 8, (1 - u) * 6));
      });
      const PH = [322, 420];
      ora.forEach(o => {
        const u = clamp((t - o.td) / FLY);
        if (u <= 0) { op(o.s, 0); return; }
        const e = ease(u), c = [(PH[0] + o.e[0]) / 2, Math.min(PH[1], o.e[1]) + o.bend];
        const q = u < 0.18 ? along([[130, 414], [190, 340], PH], u / 0.18) : bez(PH, c, o.e, ease((u - 0.18) / 0.82));
        const wob = clamp((u - 0.18) / 0.82);
        tr(o.s, q[0] + Math.sin(t * 0.9 + o.ph) * 6 * wob * AMP, q[1] + Math.cos(t * 0.8 + o.ph) * 5 * wob * AMP, lerp(1, 0.52, e));
        o.s.upd(t); op(o.s, Math.min(1, u * 10) * lerp(1, 0.45, e));
      });
      op(roomTint, 0.34 * fade(t, mid('useup', 0.62), 3.0));
      const uc = popIn(t, mid('useup', 0.72), 0.5); op(useC, clamp(uc * 2)); tr(useC, 640, 312, Math.max(0.01, 0.8 + 0.2 * uc)); op(useT, fade(t, mid('useup', 0.76)));
      const wc = popIn(t, mid('useup', 0.88), 0.5); op(wasC, clamp(wc * 2)); tr(wasC, 700, 610, Math.max(0.01, 0.8 + 0.2 * wc)); op(wasT, fade(t, mid('useup', 0.92)));
    }

    /* ---- I: perpetual motion ---- */
    const aI = P(t, at('machine') - 0.25, 0.45, linear);
    op(Ig, aI);
    if (aI > 0) {
      const th = wheelAngle(t);
      tr(wheel, WC[0], WC[1], 1, th);
      arms.forEach((a, i) => {
        const phi = (th + i * 45) * Math.PI / 180, hx = WC[0] + Math.cos(phi) * WR, hy = WC[1] + Math.sin(phi) * WR;
        const w = clamp((Math.cos(phi) + 0.3) / 0.6), sw = w * w * (3 - 2 * w);
        const ang = phi + (1 - sw) * 2.5;          // right side: flung outwards; left side: folded back against the rim
        const ex = hx + Math.cos(ang) * 50, ey = hy + Math.sin(ang) * 50;
        attr(a.l, 'x1', hx); attr(a.l, 'y1', hy); attr(a.l, 'x2', ex); attr(a.l, 'y2', ey);
        attr(a.w, 'cx', ex); attr(a.w, 'cy', ey);
      });
      const fr = fade(t, at('machine') + 0.8, 0.5) * (1 - fade(t, tStop + 0.6, 0.6));
      fric.forEach((s, k) => {
        const q = ((t * 0.55 + k / 4) % 1 + 1) % 1;
        tr(s, WC[0] + Math.sin(q * 5 + k * 2) * 14, WC[1] - 16 - q * 70, 0.9 - 0.4 * q); s.upd(t); op(s, fr * Math.sin(q * Math.PI));
      });
      op(free, fade(t, mid('machine', 0.46), 0.45));
      const xp = popIn(t, mid('machine', 0.72), 0.45); op(noW, clamp(xp * 2)); tr(noW, WC[0], WC[1], Math.max(0.01, xp));
      const ip = popIn(t, mid('machine', 0.76), 0.5); op(imp, clamp(ip * 2));
      imp.setAttribute('transform', `translate(945 440) scale(${Math.max(0.01, 0.8 + 0.2 * ip).toFixed(3)}) translate(-945 -440)`);
      op(brk, fade(t, mid('machine', 0.86), 0.4));
      const lp = P(t, mid('machine', 0.88), 0.6, easeOut); op(law2, lp); tr(law2, 945, 614 + (1 - lp) * 16);
    }
  };
});

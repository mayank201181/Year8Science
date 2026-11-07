/* Intro: the carbon atoms in your body were once carbon dioxide in the night air -> as the sun comes up,
   a leaf grabs one (no mouth, no muscles, no machinery) -> "photosynthesis" over the potted plant with
   its three inputs -> a three-stop roadmap: inside a leaf, using the sugar, proving it. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- shared art: the potted plant (soil surface centre at the origin, about 230 x 520) ---------- */
  const LEAVES = [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56]];
  function pottedPlant(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-6 C-9,-90 10,-180 0,-268 C-4,-298 0,-318 0,-330', fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
    LEAVES.forEach(([x, y, r, s]) => tr(leaf(g, s), x, y, 1, r));
    const tip = G(g); tr(tip, 0, -328);
    tr(leaf(tip, 0.2), 0, 0, 1, -64); tr(leaf(tip, 0.2), 0, 0, 1, -116);
    E('path', { d: 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z', fill: ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: ball('#E3955E', '#A9592A'), stroke: '#F0B48A', 'stroke-width': 3 }, g);
    E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, g);
    E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, g);
    return g;
  }
  // a point along leaf i of a plant placed at (px, py) with scale ps; f = 0 at the base, 1 at the tip
  const leafPt = (i, f, px, py, ps) => { const [x, y, r, s] = LEAVES[i], a = r * Math.PI / 180, l = 205 * s * f; return [px + ps * (x + Math.cos(a) * l), py + ps * (y + Math.sin(a) * l)]; };
  const qpt = (a, c, b, u) => [(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];

  /* ---------- night sky: a deep-blue tint, stars, and the dawn glow that replaces them ---------- */
  const nightTint = E('rect', { width: W, height: H, fill: '#030A16', opacity: 0.55 }, root);
  const dawn = E('ellipse', { cx: 1075, cy: 170, rx: 620, ry: 430, fill: glow('#FF9F43') }, root);
  const starG = G(root), stars = [], sr = rng(14);
  for (let i = 0; i < 22; i++) {
    const x = 50 + sr() * 1100, y = 30 + sr() * 300, s = 2 + sr() * 3;
    stars.push({ el: E('path', { d: `M${x.toFixed(1)},${(y - s * 2).toFixed(1)} L${(x + s * 0.45).toFixed(1)},${(y - s * 0.45).toFixed(1)} L${(x + s * 2).toFixed(1)},${y.toFixed(1)} L${(x + s * 0.45).toFixed(1)},${(y + s * 0.45).toFixed(1)} L${x.toFixed(1)},${(y + s * 2).toFixed(1)} L${(x - s * 0.45).toFixed(1)},${(y + s * 0.45).toFixed(1)} L${(x - s * 2).toFixed(1)},${y.toFixed(1)} L${(x - s * 0.45).toFixed(1)},${(y - s * 0.45).toFixed(1)} Z`, fill: '#EAF2FF' }, starG), ph: sr() });
  }

  /* ---------- the air: carbon dioxide drifting slowly ---------- */
  const airG = G(root), air = [], ar = rng(8);
  for (let i = 0; i < 9; i++) air.push({ g: molCO2(airG, 10), x: (i / 9 + ar() * 0.06) * 1300 - 50, y: 132 + ar() * 160, v: 7 + ar() * 7, ph: ar() * TAU, rot: (ar() - 0.5) * 50 });

  /* ---------- the sun (rises in the grab line) and its beam ---------- */
  const SUN = [1075, 128];
  const sunG = sun(root, 46);
  const beamG = G(root);
  const beamWide = E('path', { fill: C.energy, opacity: 0.16 }, beamG);
  const beamCore = E('path', { fill: C.energyLt, opacity: 0.22 }, beamG);
  const beamDash = [0, 1, 2, 3].map(() => E('line', { stroke: C.energyLt, 'stroke-width': 4, 'stroke-linecap': 'round' }, beamG));

  /* ---------- the potted plant (right, then centre) ---------- */
  const plantG = G(root);
  pottedPlant(plantG);
  const leafGlow = E('ellipse', { rx: 80, ry: 50, fill: glow(C.chloro) }, root);
  const PA = [845, 470, 0.9], PB = [600, 522, 0.74];     // plant x, y, scale: hook/grab, then def

  /* ---------- you: a person whose carbon atoms came from the air ---------- */
  const FEET = [250, 650], PS = 1.6;
  const youG = G(root);
  const you = person(youG); tr(you, FEET[0], FEET[1], PS);
  const youLbl = T(youG, FEET[0], 704, 'you', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const BODY = [[2, -172], [-2, -134], [5, -106], [-1, -62]].map(([x, y]) => [FEET[0] + x * PS, FEET[1] + y * PS]);
  const LINKED = [[420, 238], [520, 158], [650, 262], [722, 166]];
  const trailG = G(root), linkG = G(root);
  const links = BODY.map((b, i) => {
    const trail = E('path', { fill: 'none', stroke: '#FFF3A0', 'stroke-width': 4, 'stroke-dasharray': '0.5 11', 'stroke-linecap': 'round', opacity: 0.75 }, trailG);
    const mg = G(linkG);
    const halo = E('circle', { r: 34, fill: glow('#FFF3A0') }, mg);
    const mol = molCO2(mg, 13, { letter: true });
    const bHalo = E('circle', { cx: b[0], cy: b[1], r: 36, fill: glow('#FFF3A0') }, youG);
    const bAtom = atom(youG, 'C', 12, { letter: true }); tr(bAtom, b[0], b[1]);
    return { b, trail, mg, halo, mol, bHalo, bAtom, tgt: LINKED[i], ph: i * 1.7 };
  });
  const co2Lbl = T(root, 590, 112, '**carbon dioxide**: an invisible gas', { size: 32, weight: 500, anchor: 'middle', fill: C.muted, boldFill: C.co2 });
  const GRAB = 3;                                              // the one the leaf takes
  const pop1 = spark(root, 30, { seed: 3 });

  /* ---------- no mouth, no muscles, no machinery ---------- */
  const noG = G(root);
  const NO = [
    { text: 'no mouth', draw: g => {
      E('path', { d: 'M-31,-12 Q0,-18 31,-12 Q28,24 0,26 Q-28,24 -31,-12 Z', fill: '#6E1C2C', stroke: '#F29AA8', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-26,-11 Q0,-16 26,-11 L24,-3 Q0,-8 -24,-3 Z', fill: '#FFFFFF' }, g);
      E('path', { d: 'M-15,17 Q0,4 15,17 Q0,25 -15,17 Z', fill: '#F2738E' }, g);
    } },
    { text: 'no muscles', draw: g => {
      E('rect', { x: -26, y: -5, width: 52, height: 10, rx: 4, fill: '#C9D6DE' }, g);
      [-1, 1].forEach(k => { E('rect', { x: k > 0 ? 16 : -28, y: -22, width: 12, height: 44, rx: 4, fill: ball('#9FB2C2', '#5E7385') }, g); E('rect', { x: k > 0 ? 29 : -37, y: -14, width: 8, height: 28, rx: 3, fill: ball('#9FB2C2', '#5E7385') }, g); });
    } },
    { text: 'no machinery', draw: g => {
      let d = '';
      for (let i = 0; i < 16; i++) { const a0 = i * TAU / 16, a1 = (i + 1) * TAU / 16, r = i % 2 ? 22 : 30; d += (i ? 'L' : 'M') + (Math.cos(a0) * r).toFixed(1) + ',' + (Math.sin(a0) * r).toFixed(1) + ' L' + (Math.cos(a1) * r).toFixed(1) + ',' + (Math.sin(a1) * r).toFixed(1) + ' '; }
      E('path', { d: d + 'Z', fill: ball('#B7C4CF', '#6B7E8E'), stroke: '#DCE6ED', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
      E('circle', { r: 9, fill: C.bg0, stroke: '#DCE6ED', 'stroke-width': 2 }, g);
    } },
  ].map((n, i) => {
    const g = G(noG), y = 318 + i * 108;
    const icon = G(g); tr(icon, 150, y); n.draw(icon);
    const c = chip(g, n.text, { size: 32, fill: C.card2, stroke: C.line }); tr(c, 206 + c.w / 2, y);
    const x = cross(g, 24); tr(x, 150, y);
    return { g, x, y };
  });

  /* ---------- the name, and the three inputs ---------- */
  const WORD = 'photosynthesis', TS = 64;
  const titleG = G(root);
  const tW = textWidth(WORD, TS, FD, 700), tX = 600 - tW / 2;
  const pre = []; for (let i = 0; i <= WORD.length; i++) pre.push(textWidth(WORD.slice(0, i), TS, FD, 700));
  const title = T(titleG, tX, 158, '', { size: TS, weight: 700, fill: C.ink });
  const caret = E('rect', { x: 0, y: 106, width: 5, height: 62, rx: 2.5, fill: C.plant }, titleG);
  const sub = T(titleG, 600, 210, 'how green plants make their own food', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });
  const inG = G(root);
  const lp = leafPt(2, 0.5, PB[0], PB[1], PB[2]), rp = leafPt(3, 0.62, PB[0], PB[1], PB[2]);
  const INPUTS = [
    { text: 'carbon dioxide', fill: C.co2, color: '#10202B', at: [250, 330], a: [376, 334, lp[0] - 40, lp[1] + 4], icon: g => molCO2(g, 13) },
    { text: 'water', fill: C.water, color: '#06283A', at: [300, 590], a: [372, 584, 512, 520], icon: g => molH2O(g, 15) },
    { text: 'light', fill: C.energy, color: '#3A3000', at: [880, 312], a: [1012, 196, rp[0] + 24, rp[1] - 6], icon: null },
  ].map(o => {
    const g = G(inG);
    const c = chip(g, o.text, { size: 30, fill: o.fill, color: o.color }); tr(c, o.at[0], o.at[1]);
    if (o.icon) { const ic = G(g); tr(ic, o.at[0], o.at[1] - 56); o.icon(ic); }
    const arr = arrow(inG, o.a[0], o.a[1], o.a[2], o.a[3], { color: o.fill, width: 6, bend: o.text === 'light' ? 18 : -14 });
    return { g, c, arr, o };
  });

  /* ---------- roadmap ---------- */
  function miniSection(g) {
    E('rect', { x: -104, y: -64, width: 208, height: 9, rx: 4.5, fill: '#DFF6E6', opacity: 0.9 }, g);
    for (let i = 0; i < 8; i++) E('rect', { x: -104 + i * 26, y: -55, width: 26, height: 14, fill: 'rgba(230,250,236,0.12)', stroke: '#A6DDB8', 'stroke-width': 1.5 }, g);
    for (let i = 0; i < 7; i++) {
      const x = -102 + i * 29.4;
      E('rect', { x, y: -39, width: 26, height: 48, rx: 11, fill: 'rgba(91,210,122,0.22)', stroke: C.chloro, 'stroke-width': 2 }, g);
      for (let k = 0; k < 3; k++) E('circle', { cx: x + 13 + (k % 2 ? 4 : -4), cy: -28 + k * 13, r: 4, fill: C.chloroDk }, g);
    }
    [[-84, 28], [-50, 36], [-16, 26], [18, 37], [52, 27], [86, 36]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 14, fill: 'rgba(91,210,122,0.18)', stroke: C.chloro, 'stroke-width': 2 }, g));
    E('path', { d: 'M-104,58 L-22,58 M22,58 L104,58', stroke: '#A6DDB8', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    [-11, 11].forEach(x => E('ellipse', { cx: x, cy: 58, rx: 10, ry: 7, fill: ball(C.plant, C.plantDk) }, g));
  }
  function starchLeaf(g) {
    const lf = G(g); tr(lf, -84, 34, 0.8, -8);
    E('path', { d: 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z', fill: ball('#34467F', '#121A38'), stroke: '#7385C9', 'stroke-width': 3 }, lf);
    E('path', { d: 'M-10,0 L200,0', stroke: '#8E9EDB', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }, lf);
    const dr = G(g); tr(dr, 50, -22, 1, 18);
    E('rect', { x: -7, y: -44, width: 14, height: 40, rx: 5, fill: 'rgba(200,230,250,0.2)', stroke: '#CFE7F5', 'stroke-width': 2.5 }, dr);
    E('path', { d: 'M-2,-4 L2,-4 L1,6 L-1,6 Z', fill: '#CFE7F5' }, dr);
    E('rect', { x: -10, y: -66, width: 20, height: 24, rx: 9, fill: ball('#E8424F', '#9E1F2B') }, dr);
    const drop = E('path', { d: 'M0,-9 C5,-2 7,3 7,6 A7,7 0 0 1 -7,6 C-7,3 -5,-2 0,-9 Z', fill: '#C9772E', stroke: '#F0B070', 'stroke-width': 1.5 }, dr);
    return drop;
  }
  const road = G(root);
  const RX = [240, 600, 960];
  const stops = [
    { lines: 'How a leaf\nbuilds sugar', draw: g => { miniSection(g); return null; } },
    { lines: 'What it does\nwith the sugar', draw: g => { const m = molGlucose(g, 46); const s1 = spark(g, 12, { seed: 1 }); tr(s1, 62, -44); const s2 = spark(g, 9, { seed: 2 }); tr(s2, -60, 40); return { m, sp: [s1, s2] }; } },
    { lines: 'How to prove\nit happened', draw: g => ({ drop: starchLeaf(g) }) },
  ].map((st, i) => {
    const g = G(road); tr(g, RX[i], 445);
    card(g, -162, -140, 324, 290, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -42);
    const parts = st.draw(art);
    T(g, 0, 78, st.lines, { size: 29, weight: 600, anchor: 'middle', lh: 37 });
    return { g, parts };
  });
  const roadArrows = [arrow(road, 406, 445, 436, 445, { color: C.faint, width: 5 }), arrow(road, 766, 445, 796, 445, { color: C.faint, width: 5 })];

  return t => {
    const tt = t * calm;
    const dawnP = P(t, at('grab') - 0.4, 2.2, ease);           // sunrise
    const tDef = at('def'), tPlan = at('plan');

    /* sky */
    op(nightTint, 0.55 * (1 - 0.8 * dawnP));
    op(dawn, 0.42 * dawnP * (1 - 0.45 * P(t, tPlan, 0.8, linear)));
    op(starG, 1 - dawnP);
    if (dawnP < 1) stars.forEach(s => op(s.el, 0.35 + 0.5 * wave(t * calm, 2.6, s.ph)));

    /* drifting air */
    const airA = P(t, 0.0, 0.6, linear) * (1 - 0.3 * P(t, at('grab'), 0.6, linear)) * (1 - P(t, tDef - 0.1, 0.8, linear));
    op(airG, airA * 0.42);
    if (airA > 0) air.forEach(a => {
      const x = ((a.x + a.v * tt) % 1300 + 1300) % 1300 - 50;
      tr(a.g, x, a.y + 7 * Math.sin(tt * 0.6 + a.ph), 1, a.rot + 10 * Math.sin(tt * 0.4 + a.ph));
    });

    /* sun and beam */
    const sy = lerp(330, SUN[1], dawnP);
    op(sunG, P(t, at('grab') - 0.4, 0.8, linear) * (1 - P(t, tPlan + 0.2, 0.5, linear)));
    tr(sunG, SUN[0], sy); sunG.upd(tt);
    const plantMove = P(t, tDef - 0.1, 1.0);
    const px = lerp(PA[0], PB[0], plantMove), py = lerp(PA[1], PB[1], plantMove), ps = lerp(PA[2], PB[2], plantMove);
    const tgt = leafPt(3, 0.55, px, py, ps);
    const beamA = P(t, mid('grab', 0.14), 0.6, linear) * (1 - P(t, tDef + 0.2, 0.6, linear));
    op(beamG, beamA);
    if (beamA > 0) {
      const dx = tgt[0] - SUN[0], dy = tgt[1] - sy, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      const quad = (w0, w1) => `M${(SUN[0] + nx * w0).toFixed(1)},${(sy + ny * w0).toFixed(1)} L${(tgt[0] + nx * w1).toFixed(1)},${(tgt[1] + ny * w1).toFixed(1)} L${(tgt[0] - nx * w1).toFixed(1)},${(tgt[1] - ny * w1).toFixed(1)} L${(SUN[0] - nx * w0).toFixed(1)},${(sy - ny * w0).toFixed(1)} Z`;
      beamWide.setAttribute('d', quad(40, 62)); beamCore.setAttribute('d', quad(16, 30));
      beamDash.forEach((l, k) => {
        const u = ((tt * 0.55 + k / 4) % 1), a = 0.22 + 0.7 * u, b = Math.min(1, a + 0.14), off = (k % 2 ? 1 : -1) * 12;
        attr(l, 'x1', SUN[0] + dx * a + nx * off); attr(l, 'y1', sy + dy * a + ny * off); attr(l, 'x2', SUN[0] + dx * b + nx * off); attr(l, 'y2', sy + dy * b + ny * off);
        l.style.opacity = Math.sin(u * Math.PI).toFixed(3);
      });
    }

    /* plant */
    op(plantG, P(t, 0.0, 0.8, linear) * (1 - P(t, tPlan + 0.2, 0.5, linear)));
    tr(plantG, px, py, ps);
    const gl = win(t, mid('grab', 0.36), mid('grab', 0.8), 0.4);
    op(leafGlow, gl); tr(leafGlow, tgt[0], tgt[1], 1, -30);

    /* you, your carbon atoms and their trails */
    const youA = P(t, 0.1, 0.6, linear) * (1 - P(t, at('grab') - 0.1, 0.7, linear));
    op(youG, youA); op(trailG, youA);
    tr(you, FEET[0], FEET[1], PS);
    you.pose({ lean: S.reduce ? 0 : 1.2 * Math.sin(t * 1.1), armL: [8, 10], armR: [-8, 10] });
    op(youLbl, P(t, at('hook') + 0.2, 0.5, linear));
    op(co2Lbl, P(t, mid('hook', 0.62), 0.5, linear) * (1 - P(t, at('grab') + 0.2, 0.5, linear)));
    const grabU = P(t, mid('grab', 0.06), Math.max(0.8, mid('grab', 0.4) - mid('grab', 0.06)), linear);
    links.forEach((L, i) => {
      const glowB = P(t, mid('hook', 0.06 + i * 0.07), 0.5, linear);
      op(L.bHalo, glowB * (0.6 + 0.4 * wave(t, 1.6, i * 0.2)));
      const ap = P(t, mid('hook', 0.04 + i * 0.07), 0.45, pop);
      tr(L.bAtom, L.b[0], L.b[1], Math.max(0.01, ap)); op(L.bAtom, clamp(ap * 2));
      const tx = L.tgt[0] + 10 * Math.sin(tt * 0.7 + L.ph) * calm, ty = L.tgt[1] + 8 * Math.cos(tt * 0.55 + L.ph) * calm;
      const c = [(L.b[0] + tx) / 2 - 30, Math.min(L.b[1], ty) - 70];
      const dp = P(t, mid('hook', 0.18 + i * 0.08), 1.2, ease);
      if (dp > 0) {
        const q1 = [lerp(L.b[0], c[0], dp), lerp(L.b[1], c[1], dp)], q2 = qpt(L.b, c, [tx, ty], dp);
        L.trail.setAttribute('d', `M${L.b[0].toFixed(1)},${L.b[1].toFixed(1)} Q${q1[0].toFixed(1)},${q1[1].toFixed(1)} ${q2[0].toFixed(1)},${q2[1].toFixed(1)}`);
      } else L.trail.setAttribute('d', 'M0,0');
      const mp = P(t, mid('hook', 0.18 + i * 0.08) + 0.9, 0.5, pop);
      let mx = tx, my = ty, msc = Math.max(0.01, mp), ma = clamp(mp * 2);
      if (i === GRAB) {
        // drawn into the leaf, then gone
        if (grabU > 0) {
          const p = ease(grabU), cc = [(tx + tgt[0]) / 2, Math.min(ty, tgt[1]) - 90], q = qpt([tx, ty], cc, tgt, p);
          mx = q[0]; my = q[1]; msc *= 1 - 0.55 * p; ma *= 1 - P(grabU, 0.82, 0.18, linear);
        }
      } else ma *= 1 - P(t, at('grab') - 0.1, 0.7, linear);
      tr(L.mg, mx, my, msc, (i === GRAB ? grabU * 160 : 0) + 8 * Math.sin(tt * 0.5 + L.ph));
      op(L.mg, ma);
      op(L.halo, 0.85 * (0.7 + 0.3 * wave(t, 1.6, i * 0.2)));
    });
    const sp = P(t, mid('grab', 0.38), 1.9, linear);
    op(pop1, sp > 0 && sp < 1 ? Math.min(1, sp * 8) * (1 - P(sp, 0.55, 0.45, linear)) : 0);
    if (sp > 0 && sp < 1) { tr(pop1, tgt[0], tgt[1], Math.max(0.01, 1.25 * pop(Math.min(1, sp * 3.5)) - 0.25 * P(sp, 0.3, 0.7, linear))); pop1.upd(t); }

    /* no mouth / no muscles / no machinery */
    op(noG, 1 - P(t, tDef - 0.15, 0.5, linear));
    NO.forEach((n, i) => {
      const t0 = mid('grab', [0.55, 0.69, 0.83][i]), p = P(t, t0, 0.5, pop);
      op(n.g, clamp(p * 2)); tr(n.g, (1 - clamp(p)) * -30, 0);
      const xp = P(t, t0 + 0.4, 0.35, pop);
      op(n.x, clamp(xp * 2)); tr(n.x, 150, n.y, Math.max(0.01, xp));
    });

    /* the name, typed over the plant */
    const ty0 = tDef + 0.15, typ = P(t, ty0, 1.3, linear), nCh = Math.round(typ * WORD.length);
    op(titleG, P(t, ty0 - 0.05, 0.2, linear));
    setText(title, WORD.slice(0, nCh));
    attr(caret, 'x', tX + pre[nCh] + 4);
    op(caret, typ < 1 ? 1 : (1 - P(t, ty0 + 1.6, 0.3, linear)) * (wave(t, 0.8) > 0.5 ? 1 : 0.2));
    op(sub, P(t, ty0 + 1.4, 0.5, linear));

    /* the three inputs */
    op(inG, 1 - P(t, tPlan + 0.2, 0.5, linear));
    INPUTS.forEach((inp, i) => {
      const t0 = mid('def', [0.6, 0.76, 0.86][i]), p = P(t, t0, 0.5, pop);
      op(inp.g, clamp(p * 2)); tr(inp.g, (1 - clamp(p)) * (i === 2 ? 40 : -40), 0);
      inp.arr.set(P(t, t0 + 0.15, 0.5)); op(inp.arr, P(t, t0 + 0.15, 0.1, linear));
    });

    /* roadmap */
    op(road, P(t, tPlan + 0.4, 0.3, linear));
    const showAt = [mid('plan', 0.09), mid('plan', 0.44), mid('plan', 0.72)];
    stops.forEach((st, i) => {
      const p = P(t, showAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, RX[i], 445 + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
    });
    stops[1].parts.sp.forEach((s, k) => { s.upd(t + k); op(s, 0.5 + 0.5 * wave(t, 1.4, k * 0.5)); });
    { const u = ((t - showAt[2]) / 1.4) % 1, d = stops[2].parts.drop; if (t > showAt[2]) { tr(d, 0, easeIn(Math.max(0, u)) * 40); op(d, Math.min(1, u * 6, (1 - u) * 4)); } else op(d, 0); }
    roadArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.25, 0.5)); op(a, P(t, showAt[i + 1] - 0.25, 0.2, linear)); });
  };
});

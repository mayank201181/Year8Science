/* Quick-fire quiz: five question cards. After each question a countdown ring runs through the
   silent thinking time, then the answer appears with a small picture and a progress dot fills.
   Pictures: the airway lighting trachea, bronchi, bronchioles, alveoli; the diaphragm flattening
   as it contracts; oxygen diffusing from an alveolus into the blood; limewater turning cloudy;
   carbon monoxide grabbing a red blood cell's spots. Outro: "Brilliant work!" with a burst of sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const Y = C.energy, OUT = '#E9C7D2', LUM = '#4A2233', STEEL = '#C9D6DE';
  const circD = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${(2 * r).toFixed(1)},0 a${r},${r} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  const LOBE = 'M-30,-70 C-70,-90 -128,-40 -132,40 C-136,110 -112,150 -70,152 C-40,154 -22,130 -20,90 C-18,40 -10,-20 -30,-70 Z';
  const LUNGS_D = LOBE + ' M30,-70 C70,-90 128,-40 132,40 C136,110 112,150 70,152 C40,154 22,130 20,90 C18,40 10,-20 30,-70 Z M-9,-150 L9,-150 L9,-64 L-9,-64 Z';
  function molCO(parent, r) { const g = G(parent); tr(atom(g, 'C', r), -r * 0.74, 0); tr(atom(g, 'O', r * 0.94), r * 0.74, 0); return g; }

  /* ---------- progress dots (top right) ---------- */
  const dotsG = G(root);
  const dots = [0, 1, 2, 3, 4].map(k => {
    const g = G(dotsG); tr(g, 984 + k * 42, 58);
    const ring_ = E('circle', { r: 14, fill: 'rgba(10,27,39,0.6)', stroke: C.muted, 'stroke-width': 3 }, g);
    const fill = E('circle', { r: 14, fill: Y }, g);
    const tk = tick(g, 7, C.bg0);
    return { g, ring_, fill, tk };
  });

  /* ---------- intro ---------- */
  const intro = G(root);
  const bub = G(intro); tr(bub, 600, 190);
  E('path', { d: 'M-70,-52 H70 Q92,-52 92,-30 V22 Q92,44 70,44 H-6 L-34,72 L-30,44 H-70 Q-92,44 -92,22 V-30 Q-92,-52 -70,-52 Z', fill: Y, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bub);
  T(bub, 0, 22, '?', { size: 76, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(intro, 600, 350, 'Quick-fire quiz!', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });

  /* ---------- pictures for the answers (drawn around (0,0), placed at (300,556)) ---------- */
  // 1. the airway: trachea, bronchi, bronchioles, alveoli light up in order
  function picAirway(g) {
    const GEN = [[0, 0], [50, 62], [30, 46], [26, 34]], WID = [16, 12, 8, 5];
    const br = [{ gen: 0, a: 0, x1: 0, y1: -30, d: 'M0,-124 L0,-30' }];
    (function grow(pi) {
      const p = br[pi], gen = p.gen + 1;
      if (gen > 3) return;
      [-1, 1].forEach(sg => {
        const a = p.a + sg * GEN[gen][0], L = GEN[gen][1], r = a * Math.PI / 180, pr = p.a * Math.PI / 180;
        const x1 = p.x1 + Math.sin(r) * L, y1 = p.y1 + Math.cos(r) * L, cx = p.x1 + Math.sin(pr) * L * 0.4, cy = p.y1 + Math.cos(pr) * L * 0.4;
        br.push({ gen, a, x1, y1, d: `M${p.x1.toFixed(1)},${p.y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}` });
        grow(br.length - 1);
      });
    })(0);
    let cd = '';
    br.filter(b => b.gen === 3).forEach(b => {
      const r = b.a * Math.PI / 180, dx = Math.sin(r), dy = Math.cos(r);
      [[6, 0, 8], [1, 8.5, 7], [1, -8.5, 7], [13, 6, 6.5], [13, -6, 6.5]].forEach(([al, pe, rr]) => { cd += circD(b.x1 + dx * al + dy * pe, b.y1 + dy * al - dx * pe, rr); });
    });
    const byGen = k => br.filter(b => b.gen === k).map(b => b.d).join(' ');
    const glows = [0, 1, 2].map(k => E('path', { d: byGen(k), fill: 'none', stroke: Y, 'stroke-width': WID[k] + 12, 'stroke-linecap': 'round' }, g));
    glows.push(E('path', { d: cd, fill: 'none', stroke: Y, 'stroke-width': 9 }, g));
    // as "The parts of the respiratory system" draws it: pink tubes with a darker edge, white C-rings, pale blue alveoli
    for (let k = 0; k <= 3; k++) E('path', { d: byGen(k), fill: 'none', stroke: '#C99AAA', 'stroke-width': WID[k] + 5, 'stroke-linecap': 'round' }, g);
    for (let k = 0; k <= 3; k++) E('path', { d: byGen(k), fill: 'none', stroke: OUT, 'stroke-width': WID[k], 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-8,-104 Q0,-100 8,-104 M-8,-86 Q0,-82 8,-86 M-8,-68 Q0,-64 8,-68 M-8,-50 Q0,-46 8,-50', fill: 'none', stroke: '#EEF4F8', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    E('path', { d: cd, fill: '#BFE6FF', stroke: '#5FA8D8', 'stroke-width': 1.5 }, g);
    const tags = [[-16, -72, 'T'], [-40, -20, 'B'], [-68, 42, 'B'], [-100, 124, 'A']].map(([x, y, L]) => T(g, x, y, L, { size: 30, weight: 800, fill: Y, anchor: 'end' }));
    const F = [0.02, 0.3, 0.52, 0.8];
    return t => {
      const lit = F.map(f => P(t, mid('a1', f) - 0.05, 0.3, linear));
      lit.forEach((p, k) => { const now = p * (1 - (k < 3 ? lit[k + 1] : 0)); op(glows[k], p * (0.16 + 0.34 * now * (0.7 + 0.3 * wave(t, 1.2)))); op(tags[k], p); });
    };
  }
  /* The chest, front view, drawn exactly as "How you breathe in and out" (03_mechanism) draws it, in lib lungs
     units centred on the chest: six ribs a side with intercostal muscles between them (behind the lungs), the
     lungs, and the diaphragm in front of the lung bases. g.set(d, r, gd, gi): d diaphragm flattening 0..1
     (domed -> flat and lower), r ribs up and out 0..1 (defaults to d), gd / gi how hard the diaphragm /
     intercostals are contracting (brighter red). Parts: g.cav, g.bands, g.ribs, g.lw (lungs), g.dia. */
  function mechChest(parent) {
    const BONE_ = '#EFE7D4', BONE_DK = '#8F8370', MUS = '#9C3449', MUS_ON = '#FF6A84', MUS_LT = '#F6A0B0';
    const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
    const mus = p => { const A = hx(MUS), B = hx(MUS_ON); p = clamp(p); return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * p)).join(',') + ')'; };
    const q2 = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
    const fx = v => v.toFixed(1);
    const RIBS = [[[40, -122], [104, -142], [128, -92]], [[46, -74], [130, -100], [160, -38]], [[52, -24], [146, -50], [176, 18]],
      [[58, 26], [154, 0], [182, 72]], [[64, 76], [158, 52], [182, 124]], [[70, 124], [154, 104], [172, 170]]];
    const ribPts = (i, r, side) => {
      const [A, Q, B] = RIBS[i], ang = -(10 - i * 1.2) * r * Math.PI / 180, ca = Math.cos(ang), sa = Math.sin(ang), dx = 16 * r, dy = -(6 - i * 0.6) * r;
      const f = p => { const x = p[0] - A[0], y = p[1] - A[1]; return [A[0] + x * ca - y * sa + dx, A[1] + x * sa + y * ca + dy]; };
      const a = [A[0] + dx, A[1] + dy], q = f(Q), b = f(B);
      return side > 0 ? [a, q, b] : [[-a[0], a[1]], [-q[0], q[1]], [-b[0], b[1]]];
    };
    const DU = [-1, -0.85, -0.62, -0.34, 0, 0.34, 0.62, 0.85, 1], DRISE = [0, 22, 44, 60, 66, 60, 44, 22, 0], DFLAT = [0, 186, 187, 188, 188, 188, 187, 186, 0];
    const DTH = [14, 18, 22, 25, 26, 25, 22, 18, 14];
    const diaTop = (d, r) => { const b5 = ribPts(5, r, 1)[2], ex = b5[0] + 4, ey = b5[1] + 24; return DU.map((u, k) => [u * ex, k === 0 || k === 8 ? ey : lerp(ey - DRISE[k], DFLAT[k], d)]); };
    const bandPath = (top, th) => { const bot = top.map((p, k) => [p[0], p[1] + th[k]]).reverse(); return openPath(top) + ' L' + fx(bot[0][0]) + ',' + fx(bot[0][1]) + openPath(bot).replace(/^M[^C]*/, '') + 'Z'; };
    const cavPts = (d, r) => {
      const R = [];
      for (let i = 0; i < 6; i++) { const [a, q, b] = ribPts(i, r, 1), p = q2(a, q, b, 0.9); R.push([p[0] - 12, p[1] + 4]); }
      const top = diaTop(d, r);
      const floor = [[top[8][0] - 10, top[8][1] - 4]].concat(top.slice(1, 8).reverse().map(p => [p[0], p[1] - 2]), [[top[0][0] + 10, top[0][1] - 4]]);
      return [[-46, -138], [46, -138]].concat(R, floor, R.slice().reverse().map(p => [-p[0], p[1]]));
    };
    const g = G(parent);
    g.cav = E('path', { fill: C.air, 'fill-opacity': 0.06, stroke: C.air, 'stroke-opacity': 0.3, 'stroke-width': 2 }, g);
    g.bands = G(g); g.ribs = G(g); g.lw = G(g); g.lungs = lungs(g.lw, 1); g.dia = G(g);
    const ribEls = [], bandEls = [];
    [1, -1].forEach(side => {
      for (let i = 0; i < 5; i++) bandEls.push({ side, i, el: E('path', { stroke: '#6E2232', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g.bands), fib: E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.55, 'stroke-linecap': 'round' }, g.bands) });
      for (let i = 0; i < 6; i++) { const rg = G(g.ribs); ribEls.push({ side, i, g: rg, base: E('path', { fill: 'none', stroke: BONE_DK, 'stroke-width': 13, 'stroke-linecap': 'round' }, rg), core: E('path', { fill: 'none', stroke: BONE_, 'stroke-width': 8, 'stroke-linecap': 'round' }, rg) }); }
    });
    const dia = E('path', { stroke: '#5E1A2A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g.dia);
    const diaFib = E('path', { fill: 'none', stroke: '#5A1A28', 'stroke-width': 2, opacity: 0.5, 'stroke-linecap': 'round' }, g.dia);
    const diaHi = E('path', { fill: 'none', stroke: MUS_LT, 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }, g.dia);
    g.ribEls = ribEls; g.bandEls = bandEls;
    g.domeD = d => openPath(diaTop(d, 0));             // the top edge of the diaphragm, 0 domed .. 1 flat
    g.set = (d, r, gd, gi) => {
      d = clamp(d); r = r === undefined ? d : clamp(r);
      const ribs = {};
      ribEls.forEach(o => { const p = ribPts(o.i, r, o.side), dd = `M${fx(p[0][0])},${fx(p[0][1])} Q${fx(p[1][0])},${fx(p[1][1])} ${fx(p[2][0])},${fx(p[2][1])}`; ribs[o.side + ':' + o.i] = p; o.base.setAttribute('d', dd); o.core.setAttribute('d', dd); });
      const bf = mus(gi || 0);
      bandEls.forEach(o => {
        const A = ribs[o.side + ':' + o.i], B = ribs[o.side + ':' + (o.i + 1)], pa = [], pb = [];
        for (let s = 0; s <= 6; s++) { const u = 0.3 + 0.7 * s / 6; pa.push(q2(A[0], A[1], A[2], u)); pb.push(q2(B[0], B[1], B[2], u)); }
        o.el.setAttribute('d', 'M' + pa.concat(pb.reverse()).map(p => fx(p[0]) + ',' + fx(p[1])).join(' L') + 'Z'); o.el.setAttribute('fill', bf);
        let fd = ''; [0.48, 0.64, 0.8].forEach(u => { const p = q2(A[0], A[1], A[2], u + 0.03), s2 = q2(B[0], B[1], B[2], u - 0.05); fd += `M${fx(p[0])},${fx(p[1] + 5)} L${fx(s2[0])},${fx(s2[1] - 5)} `; });
        o.fib.setAttribute('d', fd);
      });
      const top = diaTop(d, r);
      dia.setAttribute('d', bandPath(top, DTH)); dia.setAttribute('fill', mus(gd || 0));
      diaHi.setAttribute('d', openPath(top.slice(1, 8).map(p => [p[0], p[1] + 4])));
      diaFib.setAttribute('d', [0.4, 0.7].map(f => openPath(top.slice(1, 8).map((p, k) => [p[0], p[1] + DTH[k + 1] * f]))).join(' '));
      g.cav.setAttribute('d', closedPath(cavPts(d, r)));
      const b = clamp(0.5 * d + 0.5 * r), kx = 1 + 0.09 * b, ky = 1 + 0.05 * b;
      g.lungs.set(b);
      const sx = (132 + 18 * r) / (20 + 112 * kx), sy = (lerp(142, 187, d) + 4 + 150) / (152 * ky + 150);
      g.lw.setAttribute('transform', `translate(0 -150) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(0 150)`);
    };
    g.set(0);
    return g;
  }
  // 2. the diaphragm contracts and flattens (the chest from "How you breathe in and out")
  function picDiaphragm(g) {
    const chS = G(g); tr(chS, 0, -20, 0.4);
    const mc = mechChest(chS);
    const dn = arrow(g, 0, 72, 0, 100, { color: Y, width: 6 });
    const lb = chip(g, 'contracts', { size: 30, fill: C.card2, stroke: Y, color: Y }); tr(lb, 0, 132);
    return t => {
      const f = P(t, at('a2') - 0.05, 0.8, ease);
      mc.set(f, f, f, f);
      dn.set(P(t, at('a2') + 0.1, 0.5)); op(dn, P(t, at('a2') + 0.1, 0.2, linear));
      op(lb, P(t, at('a2') + 0.2, 0.3, linear));
    };
  }
  // 3. oxygen diffuses from the alveolus into the blood, onto the red blood cells flowing past
  //    (the alveolus close-up from "Gas exchange": blood arrives bluish at the bottom and leaves red at the top)
  const SAC = '#1E4256', SAC_WALL = '#BFE6FA', TISSUE = '#E9BDC9';
  const rgbMix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(p)))).join(',')})`;
  function picDiffusion(g) {
    const CX = -44, RS = 84, RC = 106, A0 = 72 * Math.PI / 180, VQ = 0.2, NQ = 4, FQ = 0.6 * VQ, QS = [0.3, 0.52];
    const capAt = q => { const ph = lerp(A0, -A0, q); return [CX + RC * Math.cos(ph), RC * Math.sin(ph), ph - Math.PI / 2]; };
    const p0 = capAt(0), p1 = capAt(1);
    const capD = `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${RC},${RC} 0 0 0 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    E('path', { d: `M${CX - 150},-64 L${CX - 70},-30`, stroke: SAC_WALL, 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: capD, fill: 'none', stroke: TISSUE, 'stroke-width': 40, 'stroke-linecap': 'round' }, g);
    E('path', { d: capD, fill: 'none', stroke: linGrad('#A3303E', '#584D9C', true), 'stroke-width': 34, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: CX, cy: 0, r: RS, fill: SAC, stroke: SAC_WALL, 'stroke-width': 4 }, g);
    E('path', { d: `M${CX - 150},-64 L${CX - 64},-27`, stroke: SAC, 'stroke-width': 22, 'stroke-linecap': 'round' }, g);
    T(g, CX - 38, 128, 'alveolus', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
    T(g, 96, 134, 'blood', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9AA3' });
    const dr = rng(23), air = [];
    for (let k = 0; k < 9; k++) { const a = dr() * TAU, rr = Math.sqrt(dr()) * 56; air.push({ el: E('circle', { r: 7, fill: ball(C.oxygen, C.oxygenDk) }, g), x: CX + Math.cos(a) * rr, y: Math.sin(a) * rr * 0.9, ph: dr() * TAU }); }
    const SP = [[-5.5, -2.5], [5.5, 2.5]];
    const spotAt = (q, j) => { const [x, y, a] = capAt(q), c = Math.cos(a), si = Math.sin(a); return [x + c * SP[j][0] - si * SP[j][1], y + si * SP[j][0] + c * SP[j][1]]; };
    const cells = [];
    for (let k = 0; k < NQ; k++) {
      const c = G(g);
      const disc = E('ellipse', { rx: 13, ry: 8, stroke: '#FFD0D5', 'stroke-width': 1.5 }, c);
      E('ellipse', { rx: 6, ry: 3, fill: 'rgba(60,8,36,0.3)' }, c);
      cells.push({ c, disc, k, o2: QS.map(() => E('circle', { r: 5, fill: ball(C.oxygen, C.oxygenDk) }, g)) });
    }
    return t => {
      air.forEach(d => { attr(d.el, 'cx', d.x + Math.sin(t * 1.6 + d.ph) * 5 * calm); attr(d.el, 'cy', d.y + Math.cos(t * 1.3 + d.ph) * 5 * calm); });
      cells.forEach(o => {
        const q = ((t * VQ) + o.k / NQ) % 1, [x, y, a] = capAt(q), fade = Math.min(1, q * 12, (1 - q) * 12);
        tr(o.c, x, y, 1, a * 180 / Math.PI); op(o.c, fade);
        let loaded = 0;
        o.o2.forEach((e, j) => {
          const qj = QS[j];
          if (q < qj - FQ) { op(e, 0); return; }
          if (q < qj) {
            const p = ease((q - qj + FQ) / FQ), st = capAt(qj), tg = spotAt(q, j);
            attr(e, 'cx', lerp(CX + (st[0] - CX) * 0.55, tg[0], p)); attr(e, 'cy', lerp(st[1] * 0.55, tg[1], p)); attr(e, 'r', lerp(7, 5, p)); op(e, Math.min(1, p * 4) * fade);
            return;
          }
          loaded++;
          const tg = spotAt(q, j); attr(e, 'cx', tg[0]); attr(e, 'cy', tg[1]); attr(e, 'r', 5); op(e, fade);
        });
        o.disc.setAttribute('fill', rgbMix([146, 108, 220], [240, 74, 87], loaded / 2));
      });
    };
  }
  // 4. limewater turns cloudy (the tube from "Inhaled vs exhaled air")
  function picLime(g) {
    const limeCol = m => `rgba(${Math.round(lerp(165, 241, m))},${Math.round(lerp(218, 245, m))},${Math.round(lerp(240, 248, m))},${lerp(0.3, 0.97, m).toFixed(3)})`;
    const tube = testTube(g, 64, 200, { level: 0.6, liquid: limeCol(0) }); tr(tube, 0, 20);
    const d = 'M-110,-112 L-12,-112 L-12,94';
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': 12, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    T(g, -112, -130, 'breathed-out air', { size: 26, weight: 600, fill: C.air });
    const bs = bubbles(g, -22, 12, 18, 80, { n: 6, r: 5, seed: 9, speed: 0.55, fill: 'rgba(255,255,255,0.12)', color: 'rgba(150,196,224,0.95)' });
    return t => { bs.upd(t * calm); tube.set(0.6, limeCol(P(t, at('a4') + 0.2, 1.3, ease))); };
  }
  // 5. carbon monoxide takes one of haemoglobin's spots on a red blood cell (as in "Smoking")
  function picCO(g) {
    E('ellipse', { rx: 98, ry: 60, fill: ball('#FF6B74', '#B8283A'), stroke: '#FFD0D5', 'stroke-width': 3 }, g);
    E('ellipse', { rx: 46, ry: 22, fill: 'rgba(90,10,30,0.3)' }, g);
    const SP = [[-52, -27], [52, -27], [-52, 27], [52, 27]];
    SP.forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 20, fill: 'rgba(80,6,18,0.4)', stroke: '#FFC2C8', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, g));
    const lock = E('circle', { cx: SP[0][0], cy: SP[0][1], r: 22, fill: 'none', stroke: STEEL, 'stroke-width': 4 }, g);
    const co = molCO(g, 10);
    [1, 2, 3].forEach(k => tr(molO2(g, 10), SP[k][0], SP[k][1]));
    T(g, 0, 98, 'red blood cell', { size: 26, weight: 600, anchor: 'middle', fill: '#FF9AA3' });
    return t => {
      const p = P(t, at('a5') - 0.1, 0.55, easeOut);
      tr(co, lerp(-190, SP[0][0], p), lerp(-60, SP[0][1], p), 1, (1 - p) * 140);
      op(co, Math.min(1, p * 5)); op(lock, P(t, at('a5') + 0.45, 0.2, linear));
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What’s the order of the airway, from\nthe trachea down to the air sacs?', pic: picAirway, words: true },
    { q: 'When you breathe in, does your\ndiaphragm contract or relax?', a: [[['It ', C.ink], ['contracts', Y, 800], [',', C.ink]], [['and flattens.', C.ink]]], pic: picDiaphragm },
    { q: 'How does oxygen get from the\nalveoli into your blood?', a: [[['By ', C.ink], ['diffusion', Y, 800], [', from a high', C.ink]], [['to a low concentration.', C.ink]]], pic: picDiffusion },
    { q: 'What happens to limewater when\nyou breathe out through it?', a: [[['It turns from clear', C.ink]], [['to ', C.ink], ['cloudy', Y, 800], [', because of', C.ink]], [['the carbon dioxide.', C.ink]]], pic: picLime, small: true },
    { q: 'Which gas from cigarette smoke cuts\nthe oxygen your blood can carry?', a: [[['Carbon monoxide.', Y, 800]]], pic: picCO },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 126, 960, 262, { fill: C.card, stroke: C.line });
    T(qc, 600, 178, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    T(qc, 600, 250, d.q, { size: 42, weight: 700, anchor: 'middle', lh: 54 });
    const think = G(g); tr(think, 600, 528);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const pic = G(ans); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 34 : 40, lh = d.small ? 44 : 52, y0 = d.small ? 512 : 526;
    let words = null;
    if (d.words) {
      const l1 = rich(ans, 464, 526, [['Trachea', Y, 800], [', ', C.ink], ['bronchi', Y, 800], [',', C.ink]], { size: 40, weight: 700 });
      const l2 = rich(ans, 464, 578, [['bronchioles', Y, 800], [', ', C.ink], ['alveoli', Y, 800], ['.', C.ink]], { size: 40, weight: 700 });
      words = [l1.childNodes[0], l1.childNodes[2], l2.childNodes[0], l2.childNodes[2]];
    } else d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    return { g, qc, think, rg, num, ans, anim, words, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Breathing quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Breathing quiz  →  Science Lab', { size: 30, fill: Y, color: C.bg0 });
  tr(labChip, 600, 496);

  /* ---------- update ---------- */
  return t => {
    // progress dots
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.05, 0.3);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
    }

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.15, nx - 0.02, 0.25);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.12;
      const tv = win(t, a - 0.25, b, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      if (q.words) [0.02, 0.3, 0.52, 0.8].forEach((f, j) => q.words[j].setAttribute('fill', P(t, mid('a1', f) - 0.05, 0.3, linear) > 0.5 ? Y : C.muted));
      if (ap > 0) q.anim(t);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4);
        const d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI));
        op(o.s, u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      const lp = P(t, mid('outro', 0.45), 0.5, pop); op(labChip, clamp(lp * 2)); tr(labChip, 600, 496, Math.max(0.01, 0.85 + 0.15 * lp));
    }
  };
});

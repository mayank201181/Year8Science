/* Intro: a fast montage (a heartbeat, a lightning bolt, a rocket launch, the Sun) with energy sparks
   streaming from each into the next -> the title -> showpiece: the four shrink into the corners, the
   sparks keep circling them, and "joules created: 0" and "joules destroyed: 0" stay frozen at zero
   -> a phone's battery jar drains, its sparks drifting off into the room: "?" -> a four-card roadmap. */
scene('intro', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const lerpP = (a, b, p) => [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
  const bez = (a, c, b, u) => { const q = 1 - u; return [q * q * a[0] + 2 * q * u * c[0] + u * u * b[0], q * q * a[1] + 2 * q * u * c[1] + u * u * b[1]]; };

  /* ---------- vignette art, each drawn round its disc's centre ---------- */
  function heartArt(g) {
    const beat = G(g);
    E('path', { d: 'M0,42 C-30,20 -62,-2 -62,-28 C-62,-50 -44,-62 -28,-62 C-14,-62 -4,-54 0,-44 C4,-54 14,-62 28,-62 C44,-62 62,-50 62,-28 C62,-2 30,20 0,42 Z', fill: ball('#FF6B78', '#B3202F'), stroke: '#FFC2C8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, beat);
    const ECG = 'M-62,70 L-30,70 L-22,60 L-14,70 L-6,70 L0,48 L8,90 L14,70 L28,70 L34,62 L40,70 L62,70';
    E('path', { d: ECG, fill: 'none', stroke: '#FF8A94', 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: 0.3 }, g);
    const ecg = E('path', { d: ECG, fill: 'none', stroke: '#FFB3BA', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '0.4 0.6' }, g);
    return t => {
      const u = ((t % 0.86) + 0.86) % 0.86;
      const k = 0.13 * Math.exp(-Math.pow(u / 0.06, 2)) + 0.08 * Math.exp(-Math.pow((u - 0.2) / 0.06, 2));
      tr(beat, 0, -16, 1 + k * AMP);
      ecg.setAttribute('stroke-dashoffset', (-(t / 0.86) % 1).toFixed(3));
    };
  }
  const CLOUD = [[-74, -22], [-66, -48], [-40, -58], [-22, -78], [6, -84], [30, -72], [52, -66], [74, -48], [80, -26], [60, -10], [24, -8], [-14, -6], [-50, -8]];
  function lightningArt(g) {
    const halo = E('ellipse', { cx: 6, cy: 22, rx: 82, ry: 94, fill: glow(C.energyLt) }, g);
    const zap = G(g); bolt(zap, 0.8, '#FFF7C2'); tr(zap, 8, 30);
    E('path', { d: closedPath(CLOUD), fill: linGrad('#8798A7', '#3A4855', true), stroke: '#A9B8C5', 'stroke-width': 3 }, g);
    return t => {
      const s = ((t + 0.12) % 1.5 + 1.5) % 1.5;            // flashes as the disc appears, then every 1.5 s
      const on = R ? 0.9 : (s < 0.09 ? 1 : s < 0.15 ? 0.45 : s < 0.5 ? 1 - 0.3 * (s - 0.15) / 0.35 : 0.55);
      op(zap, on); op(halo, (on - 0.4) * 1.4);
    };
  }
  function rocketArt(g) {
    const puffs = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 10, fill: '#C9D3DC' }, g));
    const rk = G(g);
    const fl = G(rk);
    E('path', { d: 'M-12,0 C-12,16 -6,30 0,48 C6,30 12,16 12,0 Z', fill: '#FF8A3D' }, fl);
    E('path', { d: 'M-6,0 C-6,9 -3,17 0,28 C3,17 6,9 6,0 Z', fill: '#FFE45C' }, fl);
    E('rect', { x: -11, y: 24, width: 22, height: 9, rx: 2, fill: '#5D6B78' }, rk);
    E('path', { d: 'M-20,2 L-38,28 L-38,40 L-20,26 Z', fill: '#E8424F', stroke: '#FF9AA2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, rk);
    E('path', { d: 'M20,2 L38,28 L38,40 L20,26 Z', fill: '#E8424F', stroke: '#FF9AA2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, rk);
    E('path', { d: 'M-20,26 L-20,-38 C-20,-60 -10,-76 0,-90 C10,-76 20,-60 20,-38 L20,26 Z', fill: ball('#F4F7FA', '#A9B5C0'), stroke: '#FFFFFF', 'stroke-width': 2 }, rk);
    E('path', { d: 'M-15,-58 C-11,-70 -6,-80 0,-90 C6,-80 11,-70 15,-58 Z', fill: '#E8424F' }, rk);
    E('circle', { cx: 0, cy: -28, r: 9, fill: ball(C.water, C.waterDk), stroke: '#8FA3B3', 'stroke-width': 3 }, rk);
    return (t, t0) => {
      const lift = P(t, t0 + 0.2, 1.9, easeIn);
      const y = lerp(30, -12, lift) + (R ? 0 : Math.sin(t * 41) * 0.8 * lift);
      tr(rk, 0, y, 0.8);
      const k = 1 + (0.18 * Math.sin(t * 31) + 0.1 * Math.sin(t * 17)) * AMP;
      fl.setAttribute('transform', `translate(0 32) scale(${(1 - 0.05 * (k - 1)).toFixed(3)} ${(k * (0.75 + 0.45 * lift)).toFixed(3)})`);
      const on = clamp(0.35 + lift * 2);
      puffs.forEach((pf, i) => {
        const q = ((t * 0.7 + i / puffs.length) % 1 + 1) % 1, side = i % 2 ? 1 : -1;
        attr(pf, 'cx', side * (8 + q * 58)); attr(pf, 'cy', 80 - q * 8 - (i % 3) * 3); attr(pf, 'r', 7 + q * 13);
        pf.style.opacity = (on * 0.75 * (1 - q)).toFixed(3);
      });
    };
  }
  function sunArt(g) { const s = sun(g, 44); return t => s.upd(t); }

  /* ---------- 1. hook: the four vignettes in a row ---------- */
  const VIG = [
    { label: 'heartbeat', color: '#FF6B78', make: heartArt },
    { label: 'lightning', color: '#FFF3A0', make: lightningArt },
    { label: 'rocket launch', color: C.heat, make: rocketArt },
    { label: 'the Sun', color: '#FFD24A', make: sunArt },
  ];
  const ROW = [[210, 400], [470, 400], [730, 400], [990, 400]];
  // showpiece: the corners of a loop (heart top-left, lightning bottom-left, rocket bottom-right, Sun top-right)
  const CORNER = [[205, 262], [205, 598], [995, 598], [995, 262]];
  const DR = 105, CS = 0.6;
  const vigs = VIG.map(v => {
    const g = G(root);
    const halo = E('circle', { r: DR * 1.5, fill: glow(v.color) }, g);
    E('circle', { r: DR, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const art = G(g), upd = v.make(art);
    const lab = T(g, 0, DR + 50, v.label, { size: 30, weight: 600, anchor: 'middle' });
    return { g, halo, upd, lab };
  });

  // sparks streaming from each vignette into the next (and, in the loop, from the Sun back to the heart)
  const linkG = G(root);
  const NS = 4;
  const links = [0, 1, 2, 3].map(k => { const sp = []; for (let j = 0; j < NS; j++) sp.push(spark(linkG, 10, { seed: 1 + k * NS + j })); return sp; });
  const BOW = [[-34, 0], [0, 30], [34, 0], [0, 16]];      // loop sides bow outwards (the top one inwards, clear of the title)
  const RA0 = -0.96, RA2 = -2.18;                          // row arcs leave a disc at its top right, land at the next one's top left
  function linkGeom(k, a, b, sa, sb, mv) {
    const r0 = [a[0] + Math.cos(RA0) * DR * 0.86 * sa, a[1] + Math.sin(RA0) * DR * 0.86 * sa];
    const r2 = [b[0] + Math.cos(RA2) * DR * 0.86 * sb, b[1] + Math.sin(RA2) * DR * 0.86 * sb];
    const rc = [(r0[0] + r2[0]) / 2, Math.min(r0[1], r2[1]) - 74];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
    const l0 = [a[0] + ux * DR * 0.8 * sa, a[1] + uy * DR * 0.8 * sa], l2 = [b[0] - ux * DR * 0.8 * sb, b[1] - uy * DR * 0.8 * sb];
    const lc = [(l0[0] + l2[0]) / 2 + 2 * BOW[k][0], (l0[1] + l2[1]) / 2 + 2 * BOW[k][1]];
    return [lerpP(r0, l0, mv), lerpP(rc, lc, mv), lerpP(r2, l2, mv)];
  }
  // spark phase along each link: the integral of (speed / path length), tabulated so the sparks glide
  // smoothly while the discs move from the row to the corners (and the paths stretch)
  const tMove = at('never') - 0.3, MOVE = 1.2;
  const moveAt = tt => P(tt, tMove, MOVE);
  const lenAt = (k, mv) => {
    const a = lerpP(ROW[k], CORNER[k], mv), b = lerpP(ROW[(k + 1) % 4], CORNER[(k + 1) % 4], mv), s = lerp(1, CS, mv);
    const [p0, pc, p2] = linkGeom(k, a, b, s, s, mv);
    return Math.hypot(pc[0] - p0[0], pc[1] - p0[1]) + Math.hypot(p2[0] - pc[0], p2[1] - pc[1]);
  };
  const DT = 0.05, NT = Math.ceil((S.D + 2) / DT) + 1;
  const PHI = [0, 1, 2, 3].map(k => {
    const a = new Float64Array(NT);
    for (let i = 1; i < NT; i++) { const tt = (i - 0.5) * DT, mv = moveAt(tt); a[i] = a[i - 1] + lerp(190, 250, mv) / lenAt(k, mv) * DT; }
    return a;
  });
  const phi = (k, tt) => { const x = clamp(tt, 0, (NT - 1) * DT) / DT, i = Math.floor(x); return i >= NT - 1 ? PHI[k][NT - 1] : lerp(PHI[k][i], PHI[k][i + 1], x - i); };

  /* ---------- the title ---------- */
  const titleG = G(root);
  T(titleG, 0, 34, 'Energy', { size: 100, weight: 700, anchor: 'middle', fill: C.energy });
  const sub = T(root, 600, 642, 'moving from one store to another', { size: 32, weight: 500, anchor: 'middle', fill: C.muted });

  /* ---------- 2. never (showpiece): two counters frozen at zero ---------- */
  const cnt = [['created', 432], ['destroyed', 768]].map(([w, x]) => {
    const g = G(root);
    const ring = E('rect', { x: -153, y: -103, width: 306, height: 206, rx: 28, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, g);
    card(g, -145, -95, 290, 190, { fill: C.card, stroke: C.line });
    T(g, 0, -46, `joules **${w}**`, { size: 32, weight: 600, anchor: 'middle', boldFill: C.ink });
    E('rect', { x: -100, y: -22, width: 200, height: 94, rx: 16, fill: '#06131B', stroke: C.line, 'stroke-width': 2 }, g);
    const zg = G(g); tr(zg, 0, 25);
    T(zg, 0, 30, '0', { size: 84, weight: 700, anchor: 'middle', fill: C.energy });
    tr(g, x, 430);
    return { g, ring, zg, x };
  });

  /* ---------- 3. where: a phone's battery jar drains into the room ---------- */
  const W3 = G(root);
  const phone = G(W3); tr(phone, 300, 470);
  E('rect', { x: -84, y: -150, width: 168, height: 300, rx: 26, fill: '#16222B', stroke: '#9AA6B2', 'stroke-width': 4 }, phone);
  const screen = E('rect', { x: -70, y: -122, width: 140, height: 240, rx: 12, fill: linGrad('#3C8FC9', '#173F5E', true) }, phone);
  E('rect', { x: -22, y: -139, width: 44, height: 7, rx: 3.5, fill: '#3A4855' }, phone);
  E('rect', { x: -36, y: -46, width: 66, height: 34, rx: 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, phone);
  E('rect', { x: 30, y: -36, width: 7, height: 14, rx: 2, fill: '#FFFFFF' }, phone);
  const batLvl = E('rect', { x: -31, y: -41, width: 56, height: 24, rx: 3, fill: C.good }, phone);
  const pct = T(phone, 0, 36, '90%', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const jar = enJar(W3, 'chemical', { label: 'battery', level: 0.9 }); tr(jar, 485, 493);
  const MOUTH = [485, 407];
  const driftG = G(W3), dr = rng(17), DRIFT = [];
  for (let k = 0; k < 14; k++) {
    const y = spark(driftG, 11, { seed: k + 2 }), o = spark(driftG, 11, { color: C.heat, seed: k + 2 });
    DRIFT.push({ y, o, t0: k * 0.19, e: [640 + dr() * 480, 262 + dr() * 390], bend: -70 - dr() * 120, ph: dr() * TAU });
  }
  const qG = G(W3);
  T(qG, 0, 82, '?', { size: 240, weight: 700, anchor: 'middle', fill: C.ink });
  const QX = 880, QY = 485;

  /* ---------- 4. plan: the roadmap ---------- */
  const PLAN = G(root);
  const CX = [171, 457, 743, 1029], CY = 470;
  const cards = ['8 stores', '4 pathways', 'efficiency', 'saving'].map((txt, i) => {
    const g = G(PLAN); tr(g, CX[i], CY);
    card(g, -125, -150, 250, 300, { fill: C.card, stroke: C.line });
    const art = G(g);
    T(g, 0, 118, txt, { size: 32, weight: 700, anchor: 'middle' });
    return { g, art };
  });
  const MB = j => [-84 + (j % 4) * 56, -52 + Math.floor(j / 4) * 60];
  const miniB = EN.order.map((k, j) => { const b = enBadge(cards[0].art, k, { r: 24, label: false }); tr(b, MB(j)[0], MB(j)[1]); return b; });
  // heat on the top row, so its rising waves have room above it
  const pwG = G(cards[1].art); tr(pwG, 6, -16, 0.62);
  const pws = ['heat', 'mech', 'elec', 'rad'].map((k, j) => enPathway(pwG, k, -118, -116 + j * 82, 118, -116 + j * 82, { label: false }));
  const sk = enSankey(cards[2].art, { width: 62, useful: 0.62, len: 190, split: 70, drop: 52, r: 16, labels: { in: '', useful: '', wasted: '' } });
  tr(sk, -95, -62);
  const pwr = G(cards[3].art); tr(pwr, -14, -38);
  E('path', { d: 'M-27,-38.7 A47,47 0 1 0 27,-38.7', fill: 'none', stroke: C.good, 'stroke-width': 12, 'stroke-linecap': 'round' }, pwr);
  E('path', { d: 'M0,-58 L0,-10', stroke: C.good, 'stroke-width': 12, 'stroke-linecap': 'round' }, pwr);
  const lf = leaf(cards[3].art, 0.3); tr(lf, 34, 30, 1, -40);
  const planArrows = [0, 1, 2].map(i => arrow(PLAN, CX[i] + 129, CY, CX[i + 1] - 129, CY, { color: C.faint, width: 5 }));

  /* ---------- update ---------- */
  const popT = [at('hook'), mid('hook', 0.13), mid('hook', 0.27), mid('hook', 0.43)];
  const tOut = at('where') - 0.45;            // the vignettes and counters leave
  const tW = at('where'), tPlan = at('plan');
  const showAt = [mid('plan', 0.02), mid('plan', 0.24), mid('plan', 0.66), mid('plan', 0.88)];
  return t => {
    const mv = moveAt(t), out1 = 1 - fade(t, tOut, 0.4);

    /* vignettes and the sparks between them */
    const pos = [], scl = [];
    vigs.forEach((v, i) => {
      const a = popIn(t, popT[i], 0.55);
      const x = lerp(ROW[i][0], CORNER[i][0], mv), y = lerp(ROW[i][1], CORNER[i][1], mv);
      const s = lerp(1, CS, mv);
      pos.push([x, y]); scl.push(s);
      const vis = clamp(a * 2) * out1;
      op(v.g, vis);
      if (vis <= 0) return;
      tr(v.g, x, y, Math.max(0.01, s * (0.6 + 0.4 * a)));
      v.upd(t, popT[i]);
      const sweep = Math.sin(Math.PI * P(t, mid('hook', 0.61 + i * 0.045), 0.8, linear));
      op(v.halo, 0.22 + 0.12 * wave(t, 2.4, i * 0.25) + 0.55 * sweep);
      op(v.lab, 1 - fade(t, tMove, 0.5));
    });
    links.forEach((sp, k) => {
      let amt = k < 3 ? fade(t, popT[k + 1] + 0.2, 0.5) : clamp((mv - 0.55) / 0.4);
      amt *= out1;
      if (amt <= 0) { sp.forEach(s => op(s, 0)); return; }
      const [p0, pc, p2] = linkGeom(k, pos[k], pos[(k + 1) % 4], scl[k], scl[(k + 1) % 4], mv);
      const ph = phi(k, t);
      sp.forEach((s, j) => {
        const u = ((ph + j / NS) % 1 + 1) % 1, q = bez(p0, pc, p2, u);
        tr(s, q[0], q[1], 0.9); s.upd(t); op(s, amt * Math.min(1, u * 6, (1 - u) * 6));
      });
    });

    /* title (stays to the end) and the hook's subtitle */
    const tp = popIn(t, mid('hook', 0.72), 0.6);
    op(titleG, clamp(tp * 2));
    tr(titleG, 600, 146, Math.max(0.01, 0.8 + 0.2 * tp));
    op(sub, fade(t, mid('hook', 0.84), 0.5) * (1 - fade(t, tMove, 0.4)));

    /* counters */
    cnt.forEach((c, i) => {
      const p = popIn(t, mid('never', 0.08 + i * 0.08), 0.55);
      op(c.g, clamp(p * 2) * out1);
      if (p <= 0) return;
      tr(c.g, c.x, 430 + (1 - clamp(p)) * 24, 0.9 + 0.1 * p);
      const pulse = Math.sin(Math.PI * P(t, mid('never', 0.42) + i * 0.12, 0.6, linear));
      tr(c.zg, 0, 25, 1 + 0.12 * pulse);
      op(c.ring, fade(t, mid('never', i ? 0.86 : 0.68), 0.35) * (0.75 + 0.25 * wave(t, 1.3)));
    });

    /* where: the phone's battery drains and its sparks drift off into the room */
    const a3 = fade(t, tW - 0.2, 0.4) * (1 - fade(t, tPlan - 0.35, 0.4));
    op(W3, a3);
    if (a3 > 0) {
      const lv = lerp(0.9, 0.12, P(t, tW + 0.1, 2.9, linear));
      jar.set(lv);
      attr(batLvl, 'width', 56 * lv);
      batLvl.setAttribute('fill', lv > 0.5 ? C.good : lv > 0.25 ? C.glucose : C.bad);
      setText(pct, Math.round(lv * 100) + '%');
      op(screen, 0.55 + 0.45 * lv);
      DRIFT.forEach(d => {
        const u = clamp((t - tW - 0.1 - d.t0) / 1.6);
        if (u <= 0) { op(d.y, 0); op(d.o, 0); return; }
        const e = ease(u), c = [(MOUTH[0] + d.e[0]) / 2, Math.min(MOUTH[1], d.e[1]) + d.bend];
        const q = bez(MOUTH, c, d.e, e), wob = u >= 1 ? 1 : e;
        const x = q[0] + Math.sin(t * 0.9 + d.ph) * 7 * wob * AMP, y = q[1] + Math.cos(t * 0.8 + d.ph) * 6 * wob * AMP;
        const s = lerp(1, 0.6, e), a = lerp(1, 0.5, e), w = clamp(u * 1.4);
        tr(d.y, x, y, s); tr(d.o, x, y, s); d.y.upd(t); d.o.upd(t);
        op(d.y, a * (1 - w)); op(d.o, a * w);
      });
      const qp = popIn(t, mid('where', 0.45), 0.6);
      op(qG, clamp(qp * 2));
      tr(qG, QX, QY + (R ? 0 : 6 * Math.sin(t * 1.6)) * clamp(qp), Math.max(0.01, 0.6 + 0.4 * qp));
    }

    /* plan: the roadmap */
    const a4 = fade(t, tPlan - 0.1, 0.4);
    op(PLAN, a4);
    if (a4 > 0) {
      cards.forEach((c, i) => {
        const p = popIn(t, showAt[i], 0.6);
        op(c.g, clamp(p * 2));
        tr(c.g, CX[i], CY + (1 - clamp(p)) * 30, 0.9 + 0.1 * clamp(p));
      });
      planArrows.forEach((a, i) => { a.set(P(t, showAt[i + 1] - 0.2, 0.5)); op(a, fade(t, showAt[i + 1] - 0.2, 0.2)); });
      miniB.forEach((b, j) => { const p = popIn(t, showAt[0] + 0.3 + j * 0.09, 0.45); op(b, clamp(p * 2)); tr(b, MB(j)[0], MB(j)[1], Math.max(0.01, p)); });
      pws.forEach((w, j) => { w.set(P(t, showAt[1] + 0.3 + j * 0.2, 0.6)); w.upd(t); });
      sk.set({ grow: P(t, showAt[2] + 0.25, 0.5, easeOut), split: P(t, showAt[2] + 0.7, 0.7) });
      const pp = popIn(t, showAt[3] + 0.15, 0.5);
      tr(pwr, -14, -38, Math.max(0.01, pp)); op(pwr, clamp(pp * 2));
      op(lf, fade(t, showAt[3] + 0.45, 0.4));
    }
  };
});

/* Intro: the pencil that seems to snap.
   Beats: a straight pencil dips into a glass of water and looks snapped at the waterline (showpiece) -> pulled out
   it is whole again; dipped once more, a ray of light runs from its real tip, bending at the surface, up to an
   eye, with a "?" -> the glass shrinks away for the title "Light & Optics" and four icon cards (travels, bounces,
   bends, splits) -> a three-card roadmap: ray diagrams, a red apple, your eye.
   Optics: the underwater part is drawn where an eye looking in at 55° from the vertical sees it. Each point is seen
   straight above where it really is, at k = tan 38.0° / tan 55° = 0.55 of its real depth (water n = 1.33), so the
   pencil seems to bend up towards the surface. */
scene('intro', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const RAD = Math.PI / 180;

  /* ---------- geometry ---------- */
  const BX = 800, BY = 440, BW = 320, BH = 400;      // beaker: walls x 640..960, rim y 240, base y 640
  const YS = 290;                                     // water surface
  const THA = 55, THW = Math.asin(Math.sin(THA * RAD) / LT.nWater) / RAD;   // eye's line in air, and in the water
  const K = Math.tan(THW * RAD) / Math.tan(THA * RAD);                      // apparent depth / real depth
  const PL = 500, PW = 30;                            // pencil length and width
  const UD = 240, U = ltDir(UD);                      // pencil axis, tip -> rubber: up-left, 60° above horizontal
  const TIP = [920, 520];                             // the real tip when it is fully dipped
  const D1 = (TIP[1] - YS) / -U[1];                   // the tip's distance below the surface, along the axis
  const SX = TIP[0] + U[0] * D1;                      // where the axis crosses the surface
  const D0 = -42;                                     // start: the tip just above the water
  const tipAt = d => [SX - U[0] * d, YS - U[1] * d];
  const RP = [TIP[0] - (TIP[1] - YS) * Math.tan(THW * RAD), YS];   // the tip's light leaves the water here...
  const EYE = ltPt(RP[0], RP[1], -90 - THA, 292);                  // ...and travels on to this eye
  const PE = ltPt(RP[0], RP[1], -90 - THA, 246);                   // the dotted path ends just short of it

  /* ---------- local helpers ---------- */
  // draw a ray to p (0..1); hidden at 0 (a zero-length ray would still show its round end cap as a dot)
  const rset = (r, p) => { r.set(p); op(r, p > 0.002 ? 1 : 0); };
  const clip = (id, d) => { const cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  // a hexagonal yellow pencil along +x: graphite tip at the origin, pink rubber at x = PL
  function pencilArt(parent) {
    const g = G(parent), h = PW / 2, cone = 66, fer = 30, rub = 42, b1 = PL - fer - rub;
    E('path', { d: `M0,0 L${cone},${-h} L${cone},${h} Z`, fill: '#EDCBA2', stroke: '#B7895A', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    E('path', { d: `M0,0 L${cone * 0.32},${-h * 0.32} L${cone * 0.32},${h * 0.32} Z`, fill: '#3B4149' }, g);
    ['#FFE58A', '#FFC93C', '#DD9A17'].forEach((c, k) => {
      const y0 = -h + k * PW / 3, y1 = y0 + PW / 3, ym = (y0 + y1) / 2;
      E('path', { d: `M${cone},${y0} Q${cone - 13},${ym} ${cone},${y1} L${b1},${y1} L${b1},${y0} Z`, fill: c }, g);
    });
    E('rect', { x: b1, y: -h - 1.5, width: fer, height: PW + 3, rx: 3, fill: linGrad('#F1F5F8', '#8D99A5', true) }, g);
    [8, 16, 24].forEach(x => E('line', { x1: b1 + x, y1: -h, x2: b1 + x, y2: h, stroke: '#7D8994', 'stroke-width': 2 }, g));
    E('path', { d: `M${b1 + fer},${-h} L${PL - 9},${-h} Q${PL},${-h} ${PL},${-h + 9} L${PL},${h - 9} Q${PL},${h} ${PL - 9},${h} L${b1 + fer},${h} Z`, fill: '#FF93B5', stroke: '#D8648C', 'stroke-width': 2 }, g);
    E('path', { d: `M0,0 L${cone},${-h} L${b1},${-h} M0,0 L${cone},${h} L${b1},${h}`, fill: 'none', stroke: '#8A6212', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  // a red apple about 2r across, centred; o.grey draws it unlit
  function appleArt(parent, r) {
    const g = G(parent);
    E('path', { d: `M0,${-r * 0.62} C${r * 0.5},${-r * 1.05} ${r * 1.12},${-r * 0.72} ${r * 1.02},${r * 0.05} C${r * 0.95},${r * 0.75} ${r * 0.45},${r * 1.05} 0,${r * 0.88} C${-r * 0.45},${r * 1.05} ${-r * 0.95},${r * 0.75} ${-r * 1.02},${r * 0.05} C${-r * 1.12},${-r * 0.72} ${-r * 0.5},${-r * 1.05} 0,${-r * 0.62} Z`, fill: ball('#FF5A5F', '#9E1C2A'), stroke: '#FFB3B5', 'stroke-width': 2.5 }, g);
    E('path', { d: `M${-r * 0.55},${-r * 0.35} Q${-r * 0.7},${-r * 0.05} ${-r * 0.58},${r * 0.2}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': r * 0.09, 'stroke-linecap': 'round', opacity: 0.55 }, g);
    E('path', { d: `M0,${-r * 0.6} Q${r * 0.04},${-r * 0.85} ${-r * 0.1},${-r * 1.05}`, fill: 'none', stroke: '#6B4423', 'stroke-width': r * 0.11, 'stroke-linecap': 'round' }, g);
    E('path', { d: `M${-r * 0.02},${-r * 0.86} C${r * 0.2},${-r * 1.12} ${r * 0.52},${-r * 1.08} ${r * 0.62},${-r * 0.94} C${r * 0.4},${-r * 0.78} ${r * 0.14},${-r * 0.76} ${-r * 0.02},${-r * 0.86} Z`, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 1.5 }, g);
    return g;
  }

  /* ---------- the glass of water on a table ---------- */
  const world = G(root);
  const table = G(world);
  E('rect', { x: -20, y: 640, width: 1240, height: 130, fill: '#4E3524' }, table);
  E('rect', { x: -20, y: 640, width: 1240, height: 22, fill: '#7A5638' }, table);
  E('line', { x1: -20, y1: 641, x2: 1220, y2: 641, stroke: '#A27A55', 'stroke-width': 3 }, table);
  E('ellipse', { cx: BX, cy: 646, rx: 190, ry: 9, fill: '#000000', opacity: 0.25 }, table);
  const bk = beaker(world, BW, BH, { level: (BH / 2 - (YS - BY)) / (BH - 18), opacity: 0.3 });
  tr(bk, BX, BY);

  const below = clip('light-intro-below', `M-200,${YS} L1400,${YS} L1400,1000 L-200,1000 Z`);
  const above = clip('light-intro-above', `M-200,-1000 L1400,-1000 L1400,${YS} L-200,${YS} Z`);
  // underwater part: clipped to below the surface, then raised to k of its depth (where the eye sees it)
  const under = G(world, { transform: `matrix(1 0 0 ${K.toFixed(4)} 0 ${(YS * (1 - K)).toFixed(2)})` });
  const pB = pencilArt(G(under, { 'clip-path': below }));
  const x0 = BX - BW / 2 + 3, x1 = BX + BW / 2 - 3, yb = BY + BH / 2 - 2;
  E('path', { d: `M${x0},${YS} L${x1},${YS} L${x1},${yb - 12} Q${x1},${yb} ${x1 - 12},${yb} L${x0 + 12},${yb} Q${x0},${yb} ${x0},${yb - 12} Z`, fill: C.water, opacity: 0.17 }, world);
  E('line', { x1: x0, y1: YS, x2: x1, y2: YS, stroke: '#C4F1FF', 'stroke-width': 3, opacity: 0.85 }, world);
  const pA = pencilArt(G(world, { 'clip-path': above }));

  // "looks snapped!" and "whole again"
  const kink = G(world);
  E('circle', { r: 34, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, kink);
  const lbSnap = G(world);
  { const e = ltPt(SX, YS, -24, 38);
    E('line', { x1: 1004, y1: 194, x2: e[0], y2: e[1], stroke: C.muted, 'stroke-width': 2.5 }, lbSnap);
    E('circle', { cx: e[0], cy: e[1], r: 4.5, fill: C.muted }, lbSnap); }
  T(lbSnap, 1070, 168, 'looks\nsnapped!', { size: 32, weight: 700, anchor: 'middle', fill: C.energy, lh: 36 });
  const lbWhole = G(world);
  const tkW = tick(lbWhole, 16); tr(tkW, 1070, 142);
  T(lbWhole, 1070, 200, 'whole', { size: 32, weight: 700, anchor: 'middle', fill: C.good });

  // where the underwater part really is: a faint outline (solid: dashed lines mean virtual in this lesson)
  const ghost = E('path', { d: `M${D1.toFixed(1)},${-PW / 2} L66,${-PW / 2} L0,0 L66,${PW / 2} L${D1.toFixed(1)},${PW / 2}`, fill: 'rgba(255,233,168,0.08)', stroke: '#FFE9A8', 'stroke-width': 2.5, 'stroke-linejoin': 'round', opacity: 0.5, transform: `translate(${TIP[0]} ${TIP[1]}) rotate(${UD})` }, world);
  // the light's path from the real tip, bending at the surface, to the eye: a ray like every other in the lesson
  const pathG = G(world);
  const pathRay = rayPath(pathG, [TIP, RP, PE], { width: 5, head: 16 });
  const srcDot = G(pathG); tr(srcDot, TIP[0], TIP[1]);
  E('circle', { r: 20, fill: glow(C.energy) }, srcDot); E('circle', { r: 5, fill: C.energyLt }, srcDot);
  const qG = G(world);
  E('line', { x1: RP[0], y1: RP[1], x2: 612, y2: 342, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '6 6' }, qG);
  E('circle', { cx: RP[0], cy: RP[1], r: 9, fill: 'none', stroke: C.energy, 'stroke-width': 3 }, qG);
  const qChip = chip(qG, '?', { size: 40, w: 64, h: 64, fill: C.card2, stroke: C.energy, color: C.energy }); tr(qChip, 584, 364);
  const eyeG = G(world);
  const eye = eyeIcon(eyeG, 1.35, { right: true }); tr(eye, EYE[0], EYE[1], 1, -90 - THA + 180);
  T(eyeG, EYE[0] - 28, EYE[1] - 52, 'your eye', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ---------- title ---------- */
  const titleG = G(root);
  const TS = 104, wL = textWidth('Light', TS, FD, 700), wR = textWidth(' & Optics', TS, FD, 700);
  T(titleG, -(wL + wR) / 2, 0, 'Light', { size: TS, weight: 700, fill: C.energy });
  T(titleG, -(wL + wR) / 2 + wL, 0, ' & Optics', { size: TS, weight: 700, fill: C.ink });
  const titleHalo = E('ellipse', { cx: -(wR) / 2, cy: -36, rx: wL * 0.85, ry: 70, fill: glow(C.energy), opacity: 0.32 }, titleG);
  titleG.insertBefore(titleHalo, titleG.firstChild);

  /* ---------- def: four icon cards ---------- */
  const iconsG = G(root);
  const ICX = [192, 464, 736, 1008], ICY = 470;
  const icons = [
    { word: 'travels', draw: g => {
      const src = G(g); tr(src, -82, -28);
      E('circle', { r: 34, fill: glow(C.energy) }, src); E('circle', { r: 11, fill: C.energyLt }, src);
      return { rays: [lightRay(g, -66, -28, 96, -28, { width: 5, head: 16 })] };
    } },
    { word: 'bounces', draw: g => {
      const m = planeMirror(g, 176); tr(m, 0, 32);
      normalLine(g, 0, 32, -90, 104, { back: 0, width: 2.5 });
      const b = bounceRay(0, 32, -90, -42, 122);
      return { rays: [rayPath(g, [b.a, b.o, b.b], { width: 5, head: 15 })] };
    } },
    { word: 'bends', draw: g => {
      const blk = glassBlock(g, 150, 70).at(10, 2);
      const p = blk.trace([-92, -80], 50, LT.nGlass, 34);
      return { rays: [rayPath(g, p, { width: 5, head: 15, heads: [0, 2] })], blk };
    } },
    { word: 'splits', draw: g => {
      const pr = glassPrism(g, 140).at(-36, -6);
      const start = [-114, 3], paths = SPECTRUM.map(s => pr.trace(start, -10, s.n, 110));
      const white = rayPath(g, [start, paths[0][1]], { color: LT.white, width: 6, head: 15 });
      const fan = paths.map((p, k) => rayPath(g, p.slice(1), { color: SPECTRUM[k].color, width: 3.5, glow: false, heads: false }));
      return { rays: [white], fan };
    } },
  ].map((ic, i) => {
    const g = G(iconsG);
    card(g, -128, -128, 256, 256, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -30);
    const parts = ic.draw(art);
    T(g, 0, 98, ic.word, { size: 38, weight: 700, anchor: 'middle' });
    return { g, parts, x: ICX[i] };
  });

  /* ---------- plan: a three-card roadmap ---------- */
  const road = G(root);
  const RX = [240, 600, 960], RY = 462;
  const stops = [
    { text: 'Ray diagrams', draw: g => {
      const m = planeMirror(g, 220); tr(m, 0, 40);
      normalLine(g, 0, 40, -90, 128, { back: 0, width: 2.5 });
      const b = bounceRay(0, 40, -90, -40, 130);
      arcFromNormal(g, 0, 40, -90, -40, 42, { color: LT.angI });
      arcFromNormal(g, 0, 40, -90, 40, 42, { color: LT.angR });
      return rayPath(g, [b.a, b.o, b.b], { width: 5, head: 15 });
    } },
    { text: 'Seeing colour', draw: g => { const a = appleArt(g, 54); tr(a, 0, 6); return a; } },
    { text: 'Your eye', draw: g => { const e = irisFront(g, 36); tr(e, 0, 0); return e; } },
  ].map((st, i) => {
    const g = G(road);
    card(g, -160, -135, 320, 270, { fill: C.card, stroke: C.line });
    const art = G(g); tr(art, 0, -24);
    const part = st.draw(art);
    T(g, 0, 104, st.text, { size: 30, weight: 600, anchor: 'middle' });
    return { g, part, x: RX[i] };
  });
  const roadArrows = [arrow(road, 405, RY, 435, RY, { color: C.faint, width: 5 }), arrow(road, 765, RY, 795, RY, { color: C.faint, width: 5 })];

  /* ---------- update ---------- */
  return t => {
    /* the glass of water: in from the start, shrinks away as "def" begins */
    const gone = P(t, at('def') - 0.15, 0.75, easeIn);
    op(world, P(t, 0, 0.5, linear) * (1 - gone));
    if (gone < 1) {
      const s = 1 - 0.45 * gone;
      world.setAttribute('transform', `translate(${BX} 470) scale(${s.toFixed(4)}) translate(${-BX} -470)`);
      // dip in (hook), lift out (whole), dip again
      const dIn = P(t, mid('hook', 0.1), 1.7), dOut = P(t, mid('whole', 0.02), 1.15), dIn2 = P(t, mid('whole', 0.44), 0.85);
      const d = lerp(D0, D1, dIn - dOut + dIn2);
      const tip = tipAt(d), tf = `translate(${tip[0].toFixed(2)} ${tip[1].toFixed(2)}) rotate(${UD})`;
      pA.setAttribute('transform', tf); pB.setAttribute('transform', tf);
      // "looks snapped!", then "whole"
      const snap = win(t, mid('hook', 0.6), mid('whole', 0.12), 0.35);
      op(lbSnap, snap);
      const kp = P(t, mid('hook', 0.6), 0.7, linear);
      op(kink, Math.sin(Math.PI * kp) * 0.9);
      tr(kink, SX, YS, 1 + 0.5 * kp);
      op(lbWhole, win(t, mid('whole', 0.24), mid('whole', 0.46), 0.25));
      // the light's path, the eye and the question mark
      op(eyeG, P(t, mid('whole', 0.48), 0.45, linear));
      const pp = P(t, mid('whole', 0.62), 1.15, linear);
      op(pathG, P(t, mid('whole', 0.6), 0.2, linear));
      rset(pathRay, pp);
      op(srcDot, P(t, mid('whole', 0.6), 0.3, linear) * (0.75 + 0.25 * wave(t, 0.9) * calm));
      op(ghost, P(t, mid('whole', 0.58), 0.4, linear));
      const qp = P(t, mid('whole', 0.8), 0.5, pop);
      op(qG, clamp(qp * 2));
      tr(qChip, 584, 364, Math.max(0.01, 0.6 + 0.4 * qp));
    }

    /* title: pops in with "light", then moves up for the roadmap */
    const pT = P(t, mid('def', 0.08), 0.7, pop), pM = P(t, at('plan') - 0.15, 0.9);
    op(titleG, clamp(pT * 2));
    titleG.setAttribute('transform', `translate(600 ${lerp(212, 168, pM).toFixed(1)}) scale(${(Math.max(0.01, 0.8 + 0.2 * pT) * lerp(1, 0.7, pM)).toFixed(4)})`);

    /* the four icon cards, one per verb */
    const iOut = P(t, at('plan') - 0.15, 0.5, linear);
    op(iconsG, 1 - iOut);
    if (iOut < 1) {
      const showAt = [0.37, 0.51, 0.63, 0.74].map(f => mid('def', f));
      icons.forEach((ic, i) => {
        const p = P(t, showAt[i], 0.55, pop);
        op(ic.g, clamp(p * 2));
        tr(ic.g, ic.x, ICY + (1 - clamp(p)) * 34 + iOut * 30, Math.max(0.01, 0.86 + 0.14 * p));
        const dr = P(t, showAt[i] + 0.15, 0.7, linear);
        ic.parts.rays.forEach(r => rset(r, dr));
        if (ic.parts.fan) ic.parts.fan.forEach((f, k) => rset(f, P(t, showAt[i] + 0.55 + k * 0.04, 0.6, linear)));
      });
    }

    /* roadmap */
    op(road, P(t, at('plan'), 0.4, linear));
    const sAt = [mid('plan', 0.04), mid('plan', 0.33), mid('plan', 0.65)];
    stops.forEach((st, i) => {
      const p = P(t, sAt[i], 0.6, pop);
      op(st.g, clamp(p * 2));
      tr(st.g, st.x, RY + (1 - clamp(p)) * 30, Math.max(0.01, 0.9 + 0.1 * p));
    });
    rset(stops[0].part, P(t, sAt[0] + 0.3, 0.8, linear));
    stops[2].part.pupil(0.5 + 0.2 * Math.sin(t * 1.4) * calm);
    roadArrows.forEach((a, i) => { a.set(P(t, sAt[i + 1] - 0.2, 0.5)); op(a, P(t, sAt[i + 1] - 0.2, 0.2, linear)); });
  };
});

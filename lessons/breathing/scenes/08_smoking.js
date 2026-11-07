/* Smoking and other harm to the lungs.
   The airway tree breathes softly as a cigarette's smoke drifts towards it -> sticky brown tar coats
   the airways -> a carcinogen: a tumour grows in a bronchus wall -> the lining inset: the cilia stop
   and lie flat, the mucus escalator stops, smoker's cough, germs multiply -> a red blood cell: carbon
   monoxide grabs haemoglobin's spots before oxygen can -> the heart strains and a baby gets less
   oxygen -> nicotine: chained and padlocked, heart-rate and blood-pressure gauges rise -> Cigarettes
   Cause Trouble -> showpiece: emphysema, the walls between alveoli crumble and they merge into a few
   big sacs -> less surface area, breathless at rest -> lung cancer and bronchitis -> asbestos, dust,
   air pollution and asthma -> science today: vaping. */
scene('smoking', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy;
  const TAR = '#8A5626', TARLT = '#D9A066', GERM = '#8EDB5A', GERMDK = '#3E8F2A', STEEL = '#C9D6DE';
  const OUT = '#E9C7D2', LUM = '#4A2233', RINGC = '#C99AAA';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function leader(parent, x1, y1, x2, y2, color) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: x2, cy: y2, r: 5, fill: color || C.muted }, g);
    return g;
  }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mixCol = (a, b, p) => { const x = hex(a), y = hex(b); return 'rgb(' + x.map((v, i) => Math.round(lerp(v, y[i], clamp(p)))).join(',') + ')'; };
  const quad = (a, b, c, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * b[0] + u * u * c[0], v * v * a[1] + 2 * v * u * b[1] + u * u * c[1]]; };
  const cubic = (a, b, c, d, u) => { const v = 1 - u; return [v * v * v * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u * u * u * d[0], v * v * v * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u * u * u * d[1]]; };
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  const circD = (x, y, r) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${(2 * r).toFixed(1)},0 a${r},${r} 0 1,0 ${(-2 * r).toFixed(1)},0 `;
  /* warning triangle with "!", centred, about 2.2s wide */
  function warnSign(parent, s) {
    const g = G(parent);
    E('path', { d: `M0,${-s} L${s * 1.1},${s * 0.85} L${-s * 1.1},${s * 0.85} Z`, fill: Y, stroke: '#FFF3A6', 'stroke-width': Math.max(2, s * 0.12), 'stroke-linejoin': 'round' }, g);
    T(g, 0, s * 0.68, '!', { size: s * 1.25, weight: 700, fill: C.bg0, anchor: 'middle' });
    return g;
  }
  /* a pill chip with a small icon before its text (SVG collapses leading spaces, so lay it out here) */
  function iconChip(parent, text, o, drawIcon) {
    const size = o.size || 28, h = Math.round(size * 1.75), pad = size * 0.62, iw = o.iw || size * 1.15, gap = size * 0.4;
    const tw = textWidth(text, size, FD, 700), w = Math.ceil(pad * 2 + iw + gap + tw);
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || C.card2, stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
    const ic = G(g); tr(ic, -w / 2 + pad + iw / 2, 0); drawIcon(ic);
    T(g, -w / 2 + pad + iw + gap, size * 0.35, text, { size, weight: 700, fill: o.color || C.ink });
    g.w = w; g.h = h;
    return g;
  }
  /* carbon monoxide, CO: one grey carbon atom bonded to one red oxygen atom */
  function molCO(parent, r, o) { r = r || 15; const g = G(parent); tr(atom(g, 'C', r, o), -r * 0.74, 0); tr(atom(g, 'O', r * 0.94, o), r * 0.74, 0); return g; }
  function tarDrop(parent, s) {
    const g = G(parent);
    E('path', { d: 'M0,-26 C10,-12 17,-2 17,8 A17,17 0 0 1 -17,8 C-17,-2 -10,-12 0,-26 Z', fill: ball('#A8703A', '#5A3410'), stroke: TARLT, 'stroke-width': 2.5, transform: `scale(${s || 1})` }, g);
    return g;
  }
  /* a germ: one path (body + little spikes); place it with tr() */
  function germ(parent, r) {
    let d = circD(0, 0, r);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + 0.3; d += `M${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)} L${(Math.cos(a) * r * 1.5).toFixed(1)},${(Math.sin(a) * r * 1.5).toFixed(1)} `; }
    return E('path', { d, fill: GERM, stroke: GERMDK, 'stroke-width': Math.max(2, r * 0.3), 'stroke-linecap': 'round' }, parent);
  }
  /* a cigarette with its glowing tip at (0,0), pointing right; g.upd(t) */
  function cigarette(parent) {
    const g = G(parent);
    E('rect', { x: -238, y: -15, width: 78, height: 30, rx: 6, fill: ball('#E29A4C', '#A9611F'), stroke: '#F3C48C', 'stroke-width': 2 }, g);
    E('path', { d: 'M-224,-5 l1,0 M-208,6 l1,0 M-193,-6 l1,0 M-178,5 l1,0', stroke: '#8E4E17', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -164, y: -15, width: 150, height: 30, rx: 3, fill: linGrad('#FFFFFF', '#C3CCD4', true) }, g);
    E('rect', { x: -16, y: -15, width: 12, height: 30, fill: '#8F99A3' }, g);
    const halo = E('circle', { r: 34, fill: glow('#FF7A2E') }, g);
    E('path', { d: 'M-6,-15 L1,-15 Q12,-12 12,0 Q12,12 1,15 L-6,15 Z', fill: ball('#FFB067', '#C2361A') }, g);
    g.upd = t => tr(halo, 2, 0, 0.8 + 0.3 * wave(t, 1.3));
    return g;
  }
  const HEART_D = 'M0,46 C-8,36 -52,10 -52,-18 C-52,-38 -38,-50 -23,-50 C-12,-50 -4,-43 0,-34 C4,-43 12,-50 23,-50 C38,-50 52,-38 52,-18 C52,10 8,36 0,46 Z';
  function heartIcon(parent, s) {
    const g = G(parent), art = G(g);
    E('path', { d: HEART_D, fill: ball('#F05A66', '#9E1C2B'), stroke: '#FF9AA3', 'stroke-width': 3 }, art);
    E('path', { d: 'M-30,-30 Q-38,-14 -30,4', fill: 'none', stroke: '#FFD0D5', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, art);
    tr(art, 0, 0, s);
    g.art = art; g.s = s;
    return g;
  }
  /* steel padlock, origin at the centre of its body */
  function padlock(parent, s) {
    const g = G(parent), k = s || 1;
    const sh = E('path', { d: `M${-26 * k},${-14 * k} L${-26 * k},${-40 * k} A${26 * k},${26 * k} 0 0 1 ${26 * k},${-40 * k} L${26 * k},${-14 * k}`, fill: 'none', stroke: '#DDE6EC', 'stroke-width': 11 * k, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -42 * k, y: -20 * k, width: 84 * k, height: 66 * k, rx: 12 * k, fill: ball('#B9C6D2', '#5E6F7E'), stroke: '#E4ECF1', 'stroke-width': 2.5 }, g);
    E('path', { d: `M${-6 * k},${4 * k} a${8 * k},${8 * k} 0 1,1 ${12 * k},0 L${4 * k},${26 * k} L${-4 * k},${26 * k} Z`, fill: '#26323C' }, g);
    g.shackle = sh;
    return g;
  }
  /* a row of chain links from (x0,y0) to (x1,y1) */
  function chainLinks(parent, x0, y0, x1, y1, n) {
    const g = G(parent), ang = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
    for (let i = 0; i < n; i++) {
      const u = (i + 0.5) / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u);
      const flat = i % 2 === 0;
      E('rect', { x: -15, y: flat ? -9 : -3, width: 30, height: flat ? 18 : 6, rx: flat ? 9 : 3, fill: flat ? 'none' : STEEL, stroke: STEEL, 'stroke-width': flat ? 5 : 2, transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})` }, g);
    }
    return g;
  }
  /* dial gauge, r 84, needle g.set(v 0..1) */
  function gauge(parent, label) {
    const g = G(parent), R = 84;
    const arcD = (a0, a1) => { const p0 = [Math.cos(a0) * R, Math.sin(a0) * R], p1 = [Math.cos(a1) * R, Math.sin(a1) * R]; return `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${R},${R} 0 0 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`; };
    E('path', { d: `M${-R - 16},8 A${R + 16},${R + 16} 0 0 1 ${R + 16},8 Z`, fill: C.card, stroke: C.line, 'stroke-width': 2 }, g);
    [[C.good, 182, 240], [Y, 240, 300], [C.bad, 300, 358]].forEach(([c, a0, a1]) => E('path', { d: arcD(a0 * Math.PI / 180, a1 * Math.PI / 180), fill: 'none', stroke: c, 'stroke-width': 14 }, g));
    const needle = E('path', { d: 'M-6,0 L0,-70 L6,0 Z', fill: C.ink }, g);
    E('circle', { r: 11, fill: C.card2, stroke: C.ink, 'stroke-width': 3 }, g);
    T(g, 0, 50, label, { size: 28, weight: 700, anchor: 'middle' });
    g.set = v => needle.setAttribute('transform', `rotate(${lerp(-80, 80, clamp(v)).toFixed(1)})`);
    g.set(0.2);
    return g;
  }

  /* ---------- the airway tree (the system chapter's look) ----------
     origin = top of the trachea; head above; bronchi and three more generations of bronchioles;
     grape-like alveolus clusters at the 16 tips */
  function airwayTree(parent) {
    const g = G(parent);
    const GEN = [[0, 0], [52, 115], [32, 82], [26, 58], [30, 44]], WID = [26, 20, 14, 9, 6];
    const br = [{ gen: 0, a: 0, x0: 0, y0: -78, x1: 0, y1: 160, d: 'M0,-78 L0,160', parent: -1 }];
    (function grow(pi) {
      const p = br[pi], gen = p.gen + 1;
      if (gen > 4) return;
      [-1, 1].forEach(sg => {
        const a = p.a + sg * GEN[gen][0], L = GEN[gen][1], r = a * Math.PI / 180, pr = p.a * Math.PI / 180;
        const x1 = p.x1 + Math.sin(r) * L, y1 = p.y1 + Math.cos(r) * L;
        const cx = p.x1 + Math.sin(pr) * L * 0.4, cy = p.y1 + Math.cos(pr) * L * 0.4;
        br.push({ gen, a, x0: p.x1, y0: p.y1, x1, y1, parent: pi, d: `M${p.x1.toFixed(1)},${p.y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}` });
        grow(br.length - 1);
      });
    })(0);
    // head, neck and shoulders, faint
    const head = G(g);
    E('path', { d: 'M-22,-68 L-22,-44 Q-22,-24 -58,-15 Q-94,-6 -108,18 M22,-68 L22,-44 Q22,-24 58,-15 Q94,-6 108,18', fill: 'none', stroke: '#C98E62', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.55 }, head);
    E('circle', { cx: 0, cy: -112, r: 46, fill: 'rgba(201,142,98,0.2)', stroke: '#C98E62', 'stroke-width': 4 }, head);
    E('path', { d: 'M-46,-122 Q-39,-170 5,-165 Q44,-163 46,-127 Q19,-146 -46,-122 Z', fill: '#2B1D14' }, head);
    E('path', { d: circD(-16, -116, 4.5) + circD(16, -116, 4.5), fill: '#2A1D14' }, head);
    E('path', { d: 'M1,-110 L-5,-99 L4,-99', fill: 'none', stroke: '#8A5A3A', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, head);
    const byGen = k => br.filter(b => b.gen === k).map(b => b.d).join(' ');
    for (let k = 0; k <= 4; k++) E('path', { d: byGen(k), fill: 'none', stroke: OUT, 'stroke-width': WID[k], 'stroke-linecap': 'round' }, g);
    for (let k = 0; k <= 4; k++) E('path', { d: byGen(k), fill: 'none', stroke: LUM, 'stroke-width': WID[k] * 0.56, 'stroke-linecap': 'round' }, g);
    const tarG = G(g);
    const tars = [0, 1, 2, 3, 4].map(k => { const L = k === 0 ? 238 : GEN[k][1] * 1.08; return { el: E('path', { d: byGen(k), fill: 'none', stroke: TAR, 'stroke-width': WID[k] * 0.6, 'stroke-linecap': 'round' }, tarG), L, gen: k }; });
    for (let k = 0; k <= 4; k++) E('path', { d: byGen(k), fill: 'none', stroke: LUM, 'stroke-width': WID[k] * 0.22, 'stroke-linecap': 'round' }, g);
    let rd = ''; for (let k = 0; k < 6; k++) { const y = 4 + k * 26; rd += `M-13,${y} Q0,${y + 7} 13,${y} `; }
    E('path', { d: rd, fill: 'none', stroke: RINGC, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    const mouth = E('ellipse', { cx: 0, cy: -86, rx: 12, ry: 5, fill: '#5A2A22' }, g);
    const tips = br.filter(b => b.gen === 4);
    const clusters = tips.map(b => {
      const r = b.a * Math.PI / 180, dx = Math.sin(r), dy = Math.cos(r);
      let d = '';
      [[8, 0, 10.5], [2, 11, 9], [2, -11, 9], [17, 8.5, 9], [17, -8.5, 9]].forEach(([al, pe, rr]) => { d += circD(dx * al + dy * pe, dy * al - dx * pe, rr); });
      const cg = E('path', { d, fill: ball('#F7A1B5', '#C25A7A'), stroke: '#FFD0DC', 'stroke-width': 2 }, g);
      tr(cg, b.x1, b.y1);
      cg.tip = b;
      return cg;
    });
    // the route from the mouth to each tip, for smoke particles
    tips.forEach(b => { const pts = []; let q = b; while (q) { pts.unshift([q.x1, q.y1]); q = q.parent >= 0 ? br[q.parent] : null; } pts.unshift([0, -78]); b.route = pts; });
    return { g, br, tips, clusters, mouth, tarG, tars };
  }

  /* =================== A. airway tree, cigarette, tar, cancer, cilia =================== */
  const A = G(root);
  const TX = 760, TY = 200, CIGX = 300, CIGY = 250;
  const glowA = E('ellipse', { cx: TX, cy: TY + 210, rx: 360, ry: 290, fill: glow('#6FB7E8') }, A);
  const tree = airwayTree(A); tr(tree.g, TX, TY);
  const delLbl = rich(A, TX, 704, ['your gas-exchange system is ', ['delicate', C.air, 800]], { size: 30, anchor: 'middle' });
  // the cigarette and its smoke
  const cig = cigarette(A);
  const smokeG = G(A), puffs = [];
  for (let k = 0; k < 13; k++) puffs.push({ el: E('circle', { r: 32, fill: glow('#AEB8C2') }, smokeG), ph: k / 13, wob: k * 1.7 });
  const SM = [[CIGX + 10, CIGY - 4], [400, 150], [600, 70], [TX - 12, TY - 92]];
  // smoke particles travelling down the airways
  const sdotsG = G(A), sdots = [];
  tree.tips.forEach((b, i) => { if (i % 2 === 0) sdots.push({ el: E('circle', { r: 5, fill: '#B39A7A' }, sdotsG), route: b.route.map(p => [TX + p[0], TY + p[1]]), ph: sdots.length / 8 }); });
  // tar label
  const tarLbl = G(A);
  tr(tarDrop(tarLbl, 1.3), 96, 446);
  T(tarLbl, 136, 462, 'tar', { size: 54, weight: 700, fill: TARLT });
  T(tarLbl, 70, 512, 'a sticky brown substance', { size: 28, weight: 600 });
  T(tarLbl, 70, 550, 'that coats the airways', { size: 28, weight: 600, fill: C.muted });
  // cancer: a lumpy tumour bulging from the left bronchus, and the warning chip
  const lumpG = G(A); tr(lumpG, TX - 46, TY + 230);
  const LUMP = [[0, 0, 10], [13, -3, 9], [-11, 6, 9], [5, 13, 10], [-5, -10, 8], [19, 9, 8], [-17, -5, 7], [-4, 22, 8]];
  const lumps = LUMP.map(([x, y, r]) => { const c = E('circle', { cx: x, cy: y, r, fill: ball('#7A4466', '#2E1426'), stroke: '#A8678E', 'stroke-width': 2 }, lumpG); return c; });
  const canG = G(A);
  leader(canG, TX - 46, 672, TX - 46, TY + 256, C.bad);
  const canChip = G(canG); tr(canChip, TX, 694);
  iconChip(canChip, 'carcinogen: causes cancer', { size: 28, fill: '#3A1820', stroke: C.bad, sw: 3 }, g => tr(warnSign(g, 14), 0, -1));
  // cilia inset: the lining of the trachea, cells on the left, mucus sliding up to the throat
  const INS = { x: 40, y: 290, w: 404, h: 350 };
  const insG = G(A);
  const zoomRing = E('circle', { cx: TX, cy: TY + 96, r: 22, fill: 'none', stroke: C.air, 'stroke-width': 3 }, insG);
  E('line', { x1: TX - 21, y1: TY + 90, x2: INS.x + INS.w - 14, y2: INS.y + 2, stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0.8 }, insG);
  card(insG, INS.x, INS.y, INS.w, INS.h, { fill: '#0E2534', stroke: C.air, sw: 3 });
  const cp = E('clipPath', { id: 'smkInsetClip' }, defs());
  E('rect', { x: INS.x + 2, y: INS.y + 2, width: INS.w - 4, height: INS.h - 4, rx: 20 }, cp);
  const insIn = G(insG, { 'clip-path': 'url(#smkInsetClip)' });
  const CELLX = 50, CELLW = 86, CILX = CELLX + CELLW, MUX = 170;
  let celD = '', nucD = '';
  for (let k = 0; k < 5; k++) {
    const y = INS.y + k * 70 + 4, r = 12;
    celD += `M${CELLX + r},${y} H${CELLX + CELLW - r} Q${CELLX + CELLW},${y} ${CELLX + CELLW},${y + r} V${y + 62 - r} Q${CELLX + CELLW},${y + 62} ${CELLX + CELLW - r},${y + 62} H${CELLX + r} Q${CELLX},${y + 62} ${CELLX},${y + 62 - r} V${y + r} Q${CELLX},${y} ${CELLX + r},${y} Z `;
    nucD += `M${CELLX + 19},${y + 31} a15,11 0 1,0 30,0 a15,11 0 1,0 -30,0 `;
  }
  E('path', { d: celD, fill: 'rgba(247,168,200,0.2)', stroke: C.cell, 'stroke-width': 3 }, insIn);
  E('path', { d: nucD, fill: 'rgba(150,120,220,0.45)', stroke: '#B79CF0', 'stroke-width': 2.5 }, insIn);
  const mucus = E('path', { fill: 'rgba(214,224,120,0.30)', stroke: 'rgba(222,232,140,0.8)', 'stroke-width': 3 }, insIn);
  const tarCoat = E('path', { fill: 'rgba(138,86,38,0.92)', stroke: '#B57A3E', 'stroke-width': 2 }, insIn);
  const cil = E('path', { fill: 'none', stroke: '#FFD6E4', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, insIn);
  const CILY = []; for (let k = 0; k < 5; k++) for (let j = 0; j < 6; j++) CILY.push(INS.y + k * 70 + 12 + j * 9.4);
  const dead = CILY.map((_, i) => (i * 5) % 3 === 0);
  const tarBlobs = [0, 1, 2, 3, 4, 5].map(k => E('ellipse', { cx: CILX + 9 + (k % 2) * 7, cy: INS.y + 34 + k * 56, rx: 9, ry: 7, fill: ball('#A8703A', '#5A3410') }, insIn));
  const dr = rng(83), dirt = [];
  for (let k = 0; k < 10; k++) {
    const isGerm = k % 3 === 0;
    const el = isGerm ? germ(insIn, 6) : E('circle', { r: 4.5, fill: '#9AA6B2' }, insIn);
    dirt.push({ el, x0: MUX + 10 + dr() * 46, y0: INS.y + dr() * (INS.h + 40) });
  }
  const escArrow = arrow(insIn, MUX + 33, INS.y + INS.h - 40, MUX + 33, INS.y + 50, { color: C.air, width: 6 });
  const escCross = cross(insIn, 20); tr(escCross, MUX + 33, INS.y + INS.h / 2);
  const newGerms = [];
  for (let k = 0; k < 7; k++) newGerms.push({ el: germ(insIn, 6), x: MUX + 14 + dr() * 90, y: INS.y + 30 + dr() * (INS.h - 60), t: 0.8 + k * 0.03 + dr() * 0.12 });
  const insLbl = G(insG);
  const LX = 300;
  const thr = T(insLbl, LX, INS.y + 46, '↑ to throat', { size: 26, weight: 700, fill: C.air });
  leader(insLbl, LX - 8, INS.y + 112, CILX + 14, INS.y + 104); T(insLbl, LX, INS.y + 122, 'cilia', { size: 28, weight: 700 });
  leader(insLbl, LX - 8, INS.y + 192, MUX + 52, INS.y + 186); T(insLbl, LX, INS.y + 202, 'mucus', { size: 28, weight: 700, fill: '#DDE88C' });
  const tarLb2 = G(insLbl); leader(tarLb2, LX - 8, INS.y + 272, CILX + 8, INS.y + 266, TARLT); T(tarLb2, LX, INS.y + 282, 'tar', { size: 28, weight: 700, fill: TARLT });
  const stopLbl = G(A);
  tr(cross(stopLbl, 11), 70, 680);
  T(stopLbl, 92, 690, 'the mucus escalator stops', { size: 28, weight: 600 });
  // smoker's cough at the mouth, and chest infections in the alveoli
  const coughG = G(A);
  const burst = E('path', { d: 'M20,-6 L44,-14 M22,2 L48,2 M20,10 L44,18', fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }, coughG);
  tr(coughG, TX, TY - 86);
  const coughChip = chip(A, "smoker's cough", { size: 28, fill: C.card2, stroke: C.line });
  const infChip = G(A); tr(infChip, 1000, 694);
  iconChip(infChip, 'more chest infections', { size: 28, fill: '#1F3A22', stroke: GERMDK, sw: 3 }, g => germ(g, 9));
  const treeGerms = [1, 4, 6, 9, 12, 14].map(i => { const b = tree.tips[i], r = b.a * Math.PI / 180; const el = germ(A, 6.5); return { el, x: TX + b.x1 + Math.sin(r) * 12, y: TY + b.y1 + Math.cos(r) * 12 }; });

  /* =================== B1. carbon monoxide on a red blood cell =================== */
  const B1 = G(root);
  const coTitle = G(B1);
  tr(molCO(coTitle, 26, { letter: true }), 140, 262);
  T(coTitle, 202, 278, 'carbon monoxide', { size: 44, weight: 700 });
  const poison = G(B1);
  tr(warnSign(poison, 18), 222, 330);
  T(poison, 256, 342, 'a poisonous gas', { size: 30, weight: 600, fill: C.muted });
  const RB = [800, 452], RR = 160;
  const rbcG = G(B1); tr(rbcG, RB[0], RB[1]);
  E('circle', { r: RR, fill: ball('#F05A66', '#9E1C2B'), stroke: '#FF9AA3', 'stroke-width': 4 }, rbcG);
  E('circle', { r: RR * 0.5, fill: 'rgba(110,10,25,0.28)', stroke: 'rgba(255,154,163,0.35)', 'stroke-width': 3 }, rbcG);
  const SPOTS = [-135, -45, 45, 135].map(a => [Math.cos(a * Math.PI / 180) * RR * 0.56, Math.sin(a * Math.PI / 180) * RR * 0.56]);
  const sockets = SPOTS.map(([x, y]) => E('circle', { cx: x, cy: y, r: 32, fill: 'rgba(80,6,18,0.4)', stroke: '#FFC2C8', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, rbcG));
  const locks = SPOTS.map(([x, y]) => E('circle', { cx: x, cy: y, r: 34, fill: 'none', stroke: STEEL, 'stroke-width': 6 }, rbcG));
  const rbcLbl = T(B1, RB[0], RB[1] + RR + 46, 'red blood cell', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9AA3' });
  const hbLbl = G(B1);
  leader(hbLbl, 986, 318, RB[0] + SPOTS[1][0] + 22, RB[1] + SPOTS[1][1] - 22, C.ink);
  T(hbLbl, 1166, 306, 'haemoglobin', { size: 30, weight: 700, anchor: 'end' });
  const strongChip = chip(B1, 'binds more strongly than oxygen', { size: 28, fill: C.card2, stroke: C.line });
  tr(strongChip, 800, 214);
  const molG = G(B1);
  const tA = mid('co', 0.3);
  const FL = [
    { kind: 'co', from: [150, 470], spot: 0, t0: tA, dur: 1.0, bend: -60 },
    { kind: 'o2', from: [210, 590], spot: 3, t0: tA + 0.15, dur: 1.6, bend: 50 },
    { kind: 'o2', from: [330, 410], spot: 0, t0: tA + 0.3, dur: 1.25, bounce: true, bend: -40 },
    { kind: 'co', from: [120, 400], spot: 1, t0: tA + 0.45, dur: 1.4, bend: -120 },
    { kind: 'o2', from: [180, 540], spot: 2, t0: tA + 0.8, dur: 1.5, bend: 90 },
    { kind: 'o2', from: [260, 470], spot: 1, t0: mid('co', 0.56), dur: 1.2, bounce: true, bend: -90 },
  ].map(f => {
    f.g = f.kind === 'co' ? molCO(molG, 15) : molO2(molG, 15);
    const sx = RB[0] + SPOTS[f.spot][0], sy = RB[1] + SPOTS[f.spot][1];
    const dx = sx - f.from[0], dy = sy - f.from[1], L = Math.hypot(dx, dy);
    f.to = f.bounce ? [sx - dx / L * 56, sy - dy / L * 56] : [sx, sy];
    f.ctrl = [(f.from[0] + f.to[0]) / 2 - dy / L * f.bend, (f.from[1] + f.to[1]) / 2 + dx / L * f.bend];
    f.away = [f.to[0] - dx / L * 120 + dy / L * 90, f.to[1] - dy / L * 120 - dx / L * 90];
    return f;
  });
  const meterLbl = T(B1, 110, 628, 'oxygen carried by the blood', { size: 28, weight: 600 });
  const oxMeter = meter(B1, { w: 380, h: 28, color: C.oxygen }); tr(oxMeter, 110, 648);
  const lessLbl = T(B1, 110, 712, 'less oxygen', { size: 30, weight: 700, fill: C.bad });

  /* =================== B2. strain on the heart; less oxygen for a baby =================== */
  const B2 = G(root);
  const heart = heartIcon(B2, 2.3); tr(heart, 330, 380);
  const strainLines = E('path', { d: 'M-150,-60 L-176,-74 M-160,0 L-190,0 M-150,60 L-176,74 M150,-60 L176,-74 M160,0 L190,0 M150,60 L176,74', fill: 'none', stroke: Y, 'stroke-width': 5, 'stroke-linecap': 'round' }, B2);
  tr(strainLines, 330, 380);
  T(B2, 330, 560, 'the heart has to', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  T(B2, 330, 600, 'work harder', { size: 34, weight: 700, anchor: 'middle' });
  const womb = G(B2); tr(womb, 820, 380);
  E('circle', { r: 132, fill: 'rgba(247,168,200,0.10)', stroke: C.cell, 'stroke-width': 4 }, womb);
  E('ellipse', { cx: 112, cy: -46, rx: 16, ry: 40, fill: ball('#C2455C', '#7A1F33'), transform: 'rotate(-24 112 -46)' }, womb);
  const CORD = [[100, -44], [76, -8], [50, -30], [34, 10], [8, 30]];
  E('path', { d: openPath(CORD), fill: 'none', stroke: '#E8A0B4', 'stroke-width': 7, 'stroke-linecap': 'round' }, womb);
  const babyG = G(womb); tr(babyG, -20, 4);
  const SKIN = ball('#F2B9A0', '#C97F66');
  E('path', { d: 'M10,-24 C46,-12 60,30 44,60 C30,86 -10,94 -38,80 C-60,68 -64,42 -48,30 C-34,20 -16,28 -6,18 C2,10 0,-10 10,-24 Z', fill: SKIN, stroke: '#FFD8C8', 'stroke-width': 2.5 }, babyG);
  E('circle', { cx: -22, cy: -40, r: 40, fill: SKIN, stroke: '#FFD8C8', 'stroke-width': 2.5 }, babyG);
  E('path', { d: 'M-46,56 C-30,42 -8,46 6,60 M-8,10 C-18,20 -32,18 -40,6', fill: 'none', stroke: '#C97F66', 'stroke-width': 5, 'stroke-linecap': 'round' }, babyG);
  E('path', { d: 'M-46,-40 Q-40,-35 -34,-40 M-2,-44 a6,7 0 1,1 0,12', fill: 'none', stroke: '#7A4A3A', 'stroke-width': 3, 'stroke-linecap': 'round' }, babyG);
  const cordO2 = [0, 1, 2, 3].map(() => molO2(womb, 7));
  const bmG = G(B2);
  const babyMeter = meter(bmG, { w: 30, h: 200, vertical: true, color: C.oxygen }); tr(babyMeter, 1040, 280);
  T(bmG, 1055, 524, 'oxygen', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  T(bmG, 1055, 554, 'to baby', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const babyTop = T(B2, 820, 222, 'in pregnancy', { size: 30, weight: 700, anchor: 'middle', fill: C.cell });
  const babyLbl = rich(B2, 820, 600, [['less oxygen', C.bad, 800], ' reaches the baby'], { size: 30, anchor: 'middle' });

  /* =================== B3. nicotine =================== */
  const B3 = G(root);
  T(B3, 330, 196, 'nicotine', { size: 60, weight: 700, anchor: 'middle' });
  const nicArt = G(B3);
  const cig2 = cigarette(nicArt); tr(cig2, 450, 300);
  chainLinks(nicArt, 262, 312, 322, 440, 5); chainLinks(nicArt, 398, 312, 338, 440, 5);
  const lock = padlock(nicArt, 1.15); tr(lock, 330, 482);
  const addChip = chip(B3, 'addictive', { size: 34, fill: '#3A1820', stroke: C.bad, color: '#FFB3BA' }); tr(addChip, 330, 600);
  const hardLbl = T(B3, 330, 660, 'so it’s hard to give up', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const raises = T(B3, 900, 226, 'it also raises', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const gHR = gauge(B3, 'heart rate'); tr(gHR, 780, 400);
  const gBP = gauge(B3, 'blood pressure'); tr(gBP, 1020, 400);
  const upHR = arrow(B3, 780, 560, 780, 500, { color: C.bad, width: 6 }), upBP = arrow(B3, 1020, 560, 1020, 500, { color: C.bad, width: 6 });

  /* =================== B4. Cigarettes Cause Trouble =================== */
  const B4 = G(root);
  const CCT = [
    { x: 270, L: 'C', word: 'igarettes', item: [['c', Y, 800], ['arbon monoxide', C.ink]], icon: g => { tr(molCO(g, 22, { letter: true }), 0, 0); } },
    { x: 600, L: 'C', word: 'ause', item: [['c', Y, 800], ['ancer-causing tar', C.ink]], icon: g => { tr(tarDrop(g, 1.5), 0, 6); } },
    { x: 930, L: 'T', word: 'rouble', item: [['t', Y, 800], ['obacco’s nicotine', C.ink]], icon: g => { chainLinks(g, -70, -16, -26, -16, 3); chainLinks(g, 26, -16, 70, -16, 3); tr(padlock(g, 0.6), 0, 0); } },
  ].map(c => {
    const g = G(B4); tr(g, c.x, 0);
    card(g, -150, 150, 300, 470, { fill: C.card, stroke: C.line });
    const hl = E('rect', { x: -150, y: 150, width: 300, height: 470, rx: 22, fill: 'none', stroke: Y, 'stroke-width': 4 }, g);
    const top = G(g);
    T(top, 0, 292, c.L, { size: 130, weight: 700, anchor: 'middle', fill: Y });
    rich(top, 0, 356, [[c.L, Y, 800], [c.word, C.ink, 700]], { size: 36, anchor: 'middle' });
    const low = G(g);
    const ic = G(low); tr(ic, 0, 452); c.icon(ic);
    rich(low, 0, 548, c.item, { size: c.x === 270 ? 27 : 26, weight: 700, anchor: 'middle' });
    return { g, hl, top, low, x: c.x };
  });

  /* =================== C. emphysema (showpiece) and surface area =================== */
  const WALLC = '#F4A3B8', AIRC = '#1D4A60', WALL = 5;
  /* a cluster of alveoli at the end of a bronchiole. Healthy: grape-like sacs, each wall drawn once
     (only the parts of each outline not hidden by the sacs drawn after it). With `merges`, each future
     big sac is also drawn underneath as the union of its small sacs, so when the walls crumble only the
     outer walls stay; then the small sacs slide together and grow into a few big ones.
     g.set(crumble 0..1, merge 0..1, highlight 0..1) */
  function sacCluster(parent, seed, merges) {
    const g = G(parent), rr = rng(seed);
    E('path', { d: 'M-250,-205 Q-170,-170 -96,-96', fill: 'none', stroke: OUT, 'stroke-width': 30, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-250,-205 Q-170,-170 -96,-96', fill: 'none', stroke: LUM, 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
    const pos = [[0, 0]];
    for (let k = 0; k < 6; k++) { const a = (30 + 60 * k) * Math.PI / 180; pos.push([Math.cos(a) * 58, Math.sin(a) * 58]); }
    for (let k = 0; k < 6; k++) { const a = (30 + 60 * k) * Math.PI / 180; pos.push([Math.cos(a) * 112, Math.sin(a) * 112]); }
    for (let k = 0; k < 6; k++) { const a = (60 * k) * Math.PI / 180; pos.push([Math.cos(a) * 100, Math.sin(a) * 100]); }
    const SACS = [[0, 74, 80], [-70, -40, 78], [70, -40, 78]].map(([x, y, R]) => ({ x, y, R }));
    const alv = pos.map(([x, y]) => {
      const a = { x: x + (rr() - 0.5) * 16, y: y + (rr() - 0.5) * 16, r: 31 + rr() * 7 };
      let best = 0, bd = 1e9; SACS.forEach((s, k) => { const d = Math.hypot(a.x - s.x, a.y - s.y); if (d < bd) { bd = d; best = k; } });
      a.k = best; return a;
    });
    const uni = merges ? SACS.map(() => ({ o: E('path', { fill: WALLC }, g), f: E('path', { fill: AIRC }, g) })) : null;
    const grapes = G(g);
    let fd = '', wd = '';
    alv.forEach((a, i) => {
      fd += circD(a.x, a.y, a.r - WALL / 2);
      const N = 90; let run = [];
      const flush = () => { if (run.length > 1) wd += 'M' + run.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' '; run = []; };
      for (let k = 0; k <= N; k++) {
        const ang = k / N * TAU, x = a.x + Math.cos(ang) * a.r, y = a.y + Math.sin(ang) * a.r;
        if (alv.some((b, j) => j > i && Math.hypot(x - b.x, y - b.y) < b.r - WALL / 2)) flush(); else run.push([x, y]);
      }
      flush();
    });
    E('path', { d: fd, fill: AIRC }, grapes);
    const walls = E('path', { d: wd, fill: 'none', stroke: WALLC, 'stroke-width': WALL, 'stroke-linejoin': 'round' }, grapes);
    let lastC = -1, lastQ = -1, lastH = -1;
    g.set = (c, q, h) => {
      if (c !== lastC) {
        lastC = c;
        const k = clamp(c / 0.8);
        if (k <= 0) walls.removeAttribute('stroke-dasharray'); else walls.setAttribute('stroke-dasharray', `${(14 * (1 - k)).toFixed(2)} ${(14 * k).toFixed(2)}`);
        op(grapes, 1 - P(c, 0.72, 0.28, linear));
      }
      if (merges && q !== lastQ) {
        lastQ = q;
        const od = ['', '', ''], fdd = ['', '', ''];
        alv.forEach(a => { const s = SACS[a.k], x = lerp(a.x, s.x, q), y = lerp(a.y, s.y, q), r = lerp(a.r, s.R, q); od[a.k] += circD(x, y, r + WALL / 2); fdd[a.k] += circD(x, y, r - WALL / 2); });
        uni.forEach((u, k) => { u.o.setAttribute('d', od[k]); u.f.setAttribute('d', fdd[k]); });
      }
      if (h !== lastH) {
        lastH = h;
        const col = mixCol(WALLC, Y, h);
        walls.setAttribute('stroke', col);
        if (uni) uni.forEach(u => u.o.setAttribute('fill', col));
      }
    };
    g.set(0, 0, 0);
    return g;
  }
  const Cg = G(root);
  const emTitle = G(Cg);
  T(emTitle, 600, 160, 'emphysema', { size: 56, weight: 700, anchor: 'middle' });
  const saTitle = T(Cg, 600, 160, 'surface area for gas exchange', { size: 44, weight: 700, anchor: 'middle' });
  const healthy = sacCluster(Cg, 41, false), sick = sacCluster(Cg, 41, true);
  const emLbls = G(Cg);
  const lbHealthy = T(emLbls, 600, 664, 'healthy alveoli: many small sacs', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const lbWalls = G(emLbls); leader(lbWalls, 880, 372, 640, 448, C.bad); T(lbWalls, 888, 368, 'walls break down', { size: 30, weight: 700, fill: C.bad });
  const lbFewer = rich(emLbls, 600, 664, [['fewer, bigger', Y, 800], ' sacs'], { size: 34, anchor: 'middle' });
  const areaLbls = G(Cg);
  T(areaLbls, 330, 560, 'healthy', { size: 30, weight: 700, anchor: 'middle' });
  T(areaLbls, 330, 596, 'big surface area', { size: 28, weight: 700, anchor: 'middle', fill: Y });
  T(areaLbls, 760, 560, 'emphysema', { size: 30, weight: 700, anchor: 'middle' });
  T(areaLbls, 760, 596, 'small surface area', { size: 28, weight: 700, anchor: 'middle', fill: C.bad });
  const mH = meter(areaLbls, { w: 220, h: 24, color: Y }); tr(mH, 220, 620);
  const mS = meter(areaLbls, { w: 220, h: 24, color: Y }); tr(mS, 650, 620);
  const pers = person(Cg, { shirt: '#8A9BAA' }); tr(pers, 1050, 560);
  pers.pose({ lean: 3, armL: [6, 8], armR: [-28, 118] });
  const puffG = G(Cg);
  const pf = [0, 1, 2].map(k => E('path', { d: 'M0,-8 Q8,0 0,8', fill: 'none', stroke: C.air, 'stroke-width': 4, 'stroke-linecap': 'round' }, puffG));
  const persLbl = G(Cg);
  T(persLbl, 1050, 624, 'breathless,', { size: 28, weight: 700, anchor: 'middle' });
  T(persLbl, 1050, 660, 'even at rest', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });

  /* =================== D1. lung cancer and bronchitis =================== */
  const D1 = G(root);
  const lg = lungs(D1, 1.15); tr(lg, 600, 430);
  const tumour = G(D1); tr(tumour, 508, 520);
  [[0, 0, 15], [17, -6, 12], [-14, 9, 12], [6, 17, 13], [-6, -15, 11], [22, 12, 9], [-20, -6, 9]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#7A4466', '#2E1426'), stroke: '#A8678E', 'stroke-width': 2 }, tumour));
  const inflam = G(D1); tr(inflam, 600, 430, 1.15);
  E('path', { d: 'M0,-60 Q18,-40 46,-22 M46,-22 Q70,10 84,48 M60,8 Q88,20 104,30 M70,40 Q74,80 66,112', fill: 'none', stroke: 'rgba(255,74,90,0.35)', 'stroke-width': 24, 'stroke-linecap': 'round' }, inflam);
  E('path', { d: 'M0,-60 Q18,-40 46,-22 M46,-22 Q70,10 84,48 M60,8 Q88,20 104,30 M70,40 Q74,80 66,112', fill: 'none', stroke: C.bad, 'stroke-width': 8, 'stroke-linecap': 'round' }, inflam);
  const lcChip = G(D1); leader(lcChip, 300, 560, 490, 528, C.ink); const lc = chip(lcChip, 'lung cancer', { size: 32, fill: '#3A1820', stroke: C.bad }); tr(lc, 230, 560);
  const bcChip = G(D1); leader(bcChip, 900, 330, 712, 396, C.ink); const bc = chip(bcChip, 'bronchitis', { size: 32, fill: '#3A1820', stroke: C.bad }); tr(bc, 980, 330);
  const bcSub = T(D1, 980, 392, 'inflamed airways', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* =================== D2. other harm: asbestos, dust, air pollution, asthma =================== */
  const D2 = G(root);
  T(D2, 600, 140, 'Other things harm the lungs too', { size: 40, weight: 700, anchor: 'middle' });
  function iconCard(x, w, label) { const g = G(D2); tr(g, x, 0); card(g, -w / 2, 178, w, 200, { fill: C.card, stroke: C.line }); T(g, 0, 352, label, { size: 28, weight: 700, anchor: 'middle' }); return g; }
  const cAsb = iconCard(200, 230, 'asbestos');
  let fd = ''; const fr = rng(12);
  for (let k = 0; k < 11; k++) { const a = -0.32 + fr() * 0.22, len = 40 + fr() * 36, cx = (fr() - 0.5) * 40, cy = 232 + k * 6 + (fr() - 0.5) * 4; fd += `M${(cx - Math.cos(a) * len).toFixed(1)},${(cy - Math.sin(a) * len).toFixed(1)} L${(cx + Math.cos(a) * len).toFixed(1)},${(cy + Math.sin(a) * len).toFixed(1)} `; }
  E('path', { d: fd, fill: 'none', stroke: '#E4ECF5', 'stroke-width': 3, 'stroke-linecap': 'round' }, cAsb);
  const cDust = iconCard(460, 230, 'fine dust');
  let dd = ''; const dsr = rng(19);
  for (let k = 0; k < 34; k++) { const a = dsr() * TAU, r = Math.sqrt(dsr()) * 62; dd += circD(Math.cos(a) * r * 1.3, 262 + Math.sin(a) * r * 0.8, 2 + dsr() * 3.5); }
  const dustArt = E('path', { d: dd, fill: '#B09A82' }, cDust);
  const cSmog = iconCard(900, 380, 'air pollution');
  E('ellipse', { cx: 0, cy: 268, rx: 175, ry: 70, fill: glow('#9A7A55'), opacity: 0.85 }, cSmog);
  E('path', { d: 'M-160,310 L-160,262 L-128,262 L-128,236 L-96,236 L-96,282 L-70,282 L-70,226 L-36,226 L-36,270 L-6,270 L-6,248 L30,248 L30,288 L56,288 L56,212 L74,212 L74,288 L100,288 L100,250 L132,250 L132,276 L160,276 L160,310 Z', fill: '#3C4E5C', stroke: '#6E8394', 'stroke-width': 2 }, cSmog);
  const smogPuffs = [0, 1, 2].map(k => E('circle', { r: 16, fill: glow('#8F8A80') }, cSmog));
  const scarG = G(D2);
  const lgS = lungs(scarG, 0.5); tr(lgS, 330, 548);
  E('path', { d: 'M282,530 l14,10 l-8,12 l16,8 M368,524 l-12,12 l10,10 l-14,12 M300,580 l18,-4 M352,586 l-16,-6', fill: 'none', stroke: '#CFD8DE', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, scarG);
  const scarChip = chip(D2, 'scar the lungs', { size: 28, fill: C.card2, stroke: C.line }); tr(scarChip, 330, 676);
  const airwayX = G(D2); tr(airwayX, 780, 548);
  E('circle', { r: 66, fill: OUT, stroke: '#FFD0DC', 'stroke-width': 3 }, airwayX);
  const lining = E('circle', { r: 46, fill: '#F2A0B4' }, airwayX);
  const lumen = E('circle', { r: 34, fill: '#10283A' }, airwayX);
  const airwayLbl = T(D2, 780, 676, 'inflamed airway', { size: 28, weight: 700, anchor: 'middle', fill: C.bad });
  const inhaler = G(D2); tr(inhaler, 1020, 560);
  E('rect', { x: -20, y: -112, width: 40, height: 96, rx: 12, fill: ball('#7FB0FF', '#2F63C4'), stroke: '#CFE0FF', 'stroke-width': 2.5 }, inhaler);
  E('rect', { x: -20, y: -88, width: 40, height: 14, fill: '#F2F7FA', opacity: 0.8 }, inhaler);
  E('path', { d: 'M-30,-40 L30,-40 L30,22 L70,22 Q82,22 82,34 L82,56 Q82,68 70,68 L-18,68 Q-30,68 -30,56 Z', fill: ball('#D9E2EA', '#8C9BA8'), stroke: '#F2F7FA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, inhaler);
  E('ellipse', { cx: 82, cy: 45, rx: 6, ry: 17, fill: '#2B3A46' }, inhaler);
  const mist = [0, 1, 2, 3].map(() => E('circle', { r: 12, fill: glow('#CFE8FF') }, inhaler));
  const asthLbl = T(D2, 1020, 676, 'asthma worse', { size: 28, weight: 700, anchor: 'middle' });

  /* =================== D3. science today: vaping =================== */
  const D3 = G(root);
  const todayChip = chip(D3, 'science today', { size: 28, fill: C.card2, stroke: Y, color: Y }); tr(todayChip, 300, 170);
  const vapeG = G(D3); tr(vapeG, 300, 440, 1, 24);
  E('rect', { x: -26, y: -40, width: 52, height: 250, rx: 16, fill: linGrad('#6A7A88', '#2E3A45'), stroke: '#9DB0BF', 'stroke-width': 2.5 }, vapeG);
  E('rect', { x: -15, y: -96, width: 30, height: 62, rx: 10, fill: '#1E262E', stroke: '#6E8394', 'stroke-width': 2.5 }, vapeG);
  E('rect', { x: -26, y: 30, width: 52, height: 10, fill: '#8FB0C2', opacity: 0.6 }, vapeG);
  const led = E('circle', { cx: 0, cy: 170, r: 7, fill: '#7FE3FF' }, vapeG);
  const vapour = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 30, fill: glow('#E8F2F8') }, D3));
  const VTIP = [300 + Math.sin(24 * Math.PI / 180) * 96, 440 - Math.cos(24 * Math.PI / 180) * 96];
  const rows = [
    { y: 270, icon: g => tick(g, 18), segs: [['no tar', C.ink, 800]], size: 36 },
    { y: 368, icon: g => { E('path', { d: 'M-22,12 L-22,-4 M-8,12 L-8,-16 M6,12 L6,4', stroke: C.muted, 'stroke-width': 9, 'stroke-linecap': 'round' }, g); }, segs: ['seen as ', ['less harmful', Y, 800], ' than smoking'], size: 30 },
    { y: 466, icon: g => warnSign(g, 18), segs: ['still delivers ', ['addictive nicotine', '#FFB3BA', 800]], size: 30 },
    { y: 564, icon: g => { E('circle', { r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 3 }, g); T(g, 0, 11, '?', { size: 32, weight: 700, anchor: 'middle', fill: Y }); }, segs: ['long-term effects: ', ['not known yet', Y, 800]], size: 30 },
  ].map(r => { const g = G(D3); const ic = G(g); tr(ic, 596, r.y - 10); r.icon(ic); rich(g, 636, r.y, r.segs, { size: r.size }); return { g, y: r.y }; });

  /* =================== update =================== */
  return t => {
    const tCO = at('co'), tST = at('strain'), tNI = at('nicotine'), tCC = at('cct'), tEM = at('emphysema'), tDI = at('diseases'), tOT = at('other'), tVA = at('vaping');
    // each beat clears (fading out over the gap before the next line) as the next one fades in
    const SEQ = [S.first - 0.45, tCO, tST, tNI, tCC, tEM, tDI, tOT, tVA];
    const vis = k => win(t, k ? SEQ[k] - 0.15 : SEQ[0], k < 8 ? SEQ[k + 1] + 0.05 : 1e6, 0.4);
    const aA = vis(0), a1 = vis(1), a2 = vis(2), a3 = vis(3), a4 = vis(4), aC = vis(5), d1 = vis(6), d2 = vis(7), d3 = vis(8);
    op(A, aA); op(B1, a1); op(B2, a2); op(B3, a3); op(B4, a4); op(Cg, aC); op(D1, d1); op(D2, d2); op(D3, d3);

    /* ----- A ----- */
    if (aA > 0) {
      const breath = calm * wave(t, 3.6);
      op(glowA, (0.3 + 0.25 * wave(t, 3.6)) * (1 - 0.6 * P(t, at('tar'), 1.2, linear)));
      tree.clusters.forEach(c => tr(c, c.tip.x1, c.tip.y1, 1 + 0.07 * breath));
      op(delLbl, win(t, mid('delicate', 0.12), at('tar') + 0.1, 0.4));
      // cigarette slides in, smoke drifts towards the mouth
      const cp_ = P(t, mid('delicate', 0.42), 1.0, easeOut);
      tr(cig, lerp(-140, CIGX, cp_), CIGY); cig.upd(t);
      const sOn = P(t, mid('delicate', 0.6), 0.8, linear);
      puffs.forEach(p => {
        const u = ((t - mid('delicate', 0.6)) * 0.26 * (0.6 + 0.4 * calm) + p.ph) % 1;
        if (sOn <= 0 || u < 0) { op(p.el, 0); return; }
        const q = cubic(SM[0], SM[1], SM[2], SM[3], u);
        tr(p.el, q[0] + Math.sin(t * 1.3 + p.wob) * 12 * calm, q[1] + Math.cos(t * 1.1 + p.wob) * 10 * calm, 0.55 + 0.95 * u);
        op(p.el, sOn * Math.min(1, u * 5) * (1 - P(u, 0.82, 0.18, linear)) * 0.8);
      });
      // smoke particles flow down the airways during tar and cancer
      const dOn = win(t, mid('delicate', 0.85), end('cancer') + 0.4, 0.4);
      op(sdotsG, dOn);
      if (dOn > 0) sdots.forEach(s => { const u = ((t - mid('delicate', 0.85)) / 2.6 + s.ph) % 1; const q = along(s.route, ease(u)); attr(s.el, 'cx', q[0]); attr(s.el, 'cy', q[1]); op(s.el, Math.min(1, u * 6, (1 - u) * 6)); });
      // tar coats the airways, generation by generation from the top
      const T0 = mid('tar', 0.22);
      op(tree.tarG, t > T0 ? 1 : 0);
      if (t > T0) tree.tars.forEach(o => {
        const p = P(t, T0 + o.gen * 0.45, 0.6, linear);
        op(o.el, p > 0.001 ? 1 : 0);
        if (p >= 1) o.el.removeAttribute('stroke-dasharray'); else o.el.setAttribute('stroke-dasharray', `${(p * o.L).toFixed(1)} ${(o.L + 400).toFixed(0)}`);
      });
      const tl = P(t, mid('tar', 0.12), 0.5, pop);
      op(tarLbl, clamp(tl * 2) * (1 - P(t, at('cilia') - 0.45, 0.3, linear))); tr(tarLbl, (1 - clamp(tl)) * -30, 0);
      // cancer
      lumps.forEach((c, i) => { const p = P(t, mid('cancer', 0.32) + i * 0.16, 0.45, pop); op(c, clamp(p * 2)); c.setAttribute('transform', `translate(${LUMP[i][0]} ${LUMP[i][1]}) scale(${Math.max(0.01, p).toFixed(3)}) translate(${-LUMP[i][0]} ${-LUMP[i][1]})`); });
      const ccp = P(t, mid('cancer', 0.08), 0.5, pop);
      op(canG, clamp(ccp * 2) * (1 - P(t, at('cilia') - 0.45, 0.3, linear))); tr(canChip, TX, 694 + (1 - clamp(ccp)) * 16);
      // the lining inset
      const iA = P(t, at('cilia') - 0.15, 0.45, linear);
      op(insG, iA);
      if (iA > 0) {
        const tP = mid('cilia', 0.12), par = P(t, tP, 1.0), des = P(t, mid('cilia', 0.24), 1.0);
        const tS0 = mid('cilia', 0.12), dS = mid('cilia', 0.36) - tS0;
        const te = t < tS0 ? t : t < tS0 + dS ? tS0 + (t - tS0) - (t - tS0) * (t - tS0) / (2 * dS) : tS0 + dS / 2;
        const thick = P(t, mid('cilia', 0.4), 2.2);
        const wM = lerp(64, 116, thick);
        // cilia: a Mexican wave of beats, then they lie flat; some are destroyed
        let d = '';
        CILY.forEach((y, i) => {
          const ph = (((te * 1.5 * (0.5 + 0.5 * calm) - (y - INS.y) / 150) % 1) + 1) % 1;
          const beatA = lerp(32, -46, ph < 0.35 ? ease(ph / 0.35) : 1 - ease((ph - 0.35) / 0.65));
          const ang = lerp(beatA, 74, par) * Math.PI / 180;
          const L = dead[i] ? lerp(30, 7, des) : 30;
          d += `M${CILX},${y.toFixed(1)} L${(CILX + Math.cos(ang) * L).toFixed(1)},${(y + Math.sin(ang) * L).toFixed(1)} `;
        });
        cil.setAttribute('d', d);
        // mucus band with a wavy edge, sliding up until it stops, then piling up
        let md = `M${MUX},${INS.y - 10}`;
        for (let k = 0; k <= 19; k++) { const y = INS.y - 10 + k * 20; md += ` L${(MUX + wM + 6 * Math.sin(y / 26 + te * 3.2)).toFixed(1)},${y}`; }
        md += ` L${MUX},${INS.y + INS.h + 10} Z`;
        mucus.setAttribute('d', md);
        mucus.setAttribute('fill', `rgba(214,224,120,${(0.3 + 0.18 * thick).toFixed(3)})`);
        dirt.forEach(o => {
          const span = INS.h + 40;
          const y = INS.y - 20 + ((((o.y0 - INS.y + 20) - 34 * te) % span) + span) % span;
          tr(o.el, MUX + (o.x0 - MUX) * wM / 64, y);
        });
        const tc = P(t, mid('cilia', 0.02), 1.4, easeOut);
        op(tarCoat, tc > 0.01 ? 1 : 0);
        if (tc > 0.01) { let td = `M${CILX - 2},${INS.y - 10}`; for (let k = 0; k <= 19; k++) { const y = INS.y - 10 + k * 20; td += ` L${(CILX + 20 * tc + 4 * tc * Math.sin(y / 17 + 1.3)).toFixed(1)},${y}`; } tarCoat.setAttribute('d', td + ` L${CILX - 2},${INS.y + INS.h + 10} Z`); }
        tarBlobs.forEach((b, k) => { const p = P(t, mid('cilia', 0.06) + k * 0.1, 0.45, pop); op(b, clamp(p * 2)); b.setAttribute('transform', `translate(${attrNum(b, 'cx')} ${attrNum(b, 'cy')}) scale(${Math.max(0.01, p).toFixed(3)}) translate(${-attrNum(b, 'cx')} ${-attrNum(b, 'cy')})`); });
        escArrow.set(1); op(escArrow, 1 - 0.7 * P(t, mid('cilia', 0.3), 0.6, linear));
        const xp = P(t, mid('cilia', 0.38), 0.45, pop); op(escCross, clamp(xp * 2)); tr(escCross, MUX + 33, INS.y + INS.h / 2, Math.max(0.01, xp));
        op(thr, 1 - 0.6 * P(t, mid('cilia', 0.36), 0.5, linear));
        op(tarLb2, P(t, mid('cilia', 0.08), 0.4, linear));
        newGerms.forEach(gm => { const p = P(t, mid('cilia', gm.t), 0.4, pop); op(gm.el, clamp(p * 2)); tr(gm.el, gm.x, gm.y, Math.max(0.01, p)); });
        op(stopLbl, P(t, mid('cilia', 0.4), 0.4, linear));
      } else op(stopLbl, 0);
      // smoker's cough and chest infections
      const c1 = P(t, mid('cilia', 0.6), 0.25, easeOut) * (1 - P(t, mid('cilia', 0.6) + 0.35, 0.25, linear));
      const c2 = P(t, mid('cilia', 0.68), 0.25, easeOut) * (1 - P(t, mid('cilia', 0.68) + 0.35, 0.25, linear));
      const cough = Math.max(c1, c2);
      attr(tree.mouth, 'ry', 5 + 7 * cough);
      op(burst, cough); tr(burst, 0, 0, 0.6 + 0.6 * cough);
      const chp = P(t, mid('cilia', 0.62), 0.5, pop); op(coughChip, clamp(chp * 2)); tr(coughChip, 980, 116, Math.max(0.01, 0.8 + 0.2 * chp));
      const inf = P(t, mid('cilia', 0.82), 0.5, pop); op(infChip, clamp(inf * 2)); tr(infChip, 1000, 694 + (1 - clamp(inf)) * 14);
      treeGerms.forEach((gm, i) => { const p = P(t, mid('cilia', 0.8) + i * 0.1, 0.4, pop); op(gm.el, clamp(p * 2)); tr(gm.el, gm.x, gm.y, Math.max(0.01, p)); });
    }

    /* ----- B1: carbon monoxide ----- */
    if (a1 > 0) {
      const tp = P(t, tCO, 0.5, pop); op(coTitle, clamp(tp * 2)); tr(coTitle, (1 - clamp(tp)) * -24, 0);
      op(poison, P(t, mid('co', 0.14), 0.4, linear));
      const rp = P(t, mid('co', 0.06), 0.6, pop); tr(rbcG, RB[0], RB[1], Math.max(0.01, 0.7 + 0.3 * rp)); op(rbcG, clamp(rp * 2));
      op(rbcLbl, P(t, mid('co', 0.12), 0.4, linear));
      op(hbLbl, P(t, mid('co', 0.3), 0.4, linear));
      const docked = [0, 0, 0, 0];
      FL.forEach(f => {
        const u = (t - f.t0) / f.dur;
        if (u <= 0) { op(f.g, 0); return; }
        if (!f.bounce) {
          const p = ease(clamp(u)), q = quad(f.from, f.ctrl, f.to, p);
          tr(f.g, q[0], q[1], 1, (1 - p) * 160 * (f.kind === 'co' ? 1 : -1));
          op(f.g, Math.min(1, u * 5));
          if (u >= 1) docked[f.spot] = f.kind === 'co' ? Math.max(docked[f.spot], 1) : 0.5;
        } else {
          if (u < 1) { const p = easeIn(u) * 0.6 + u * 0.4, q = quad(f.from, f.ctrl, f.to, p); tr(f.g, q[0], q[1], 1, (1 - p) * -140); op(f.g, Math.min(1, u * 5)); }
          else { const v = clamp((u - 1) * f.dur / 0.8), q = [lerp(f.to[0], f.away[0], easeOut(v)), lerp(f.to[1], f.away[1], easeOut(v))]; tr(f.g, q[0], q[1], 1, v * 220); op(f.g, 1 - v); }
        }
      });
      FL.forEach(f => {
        if (f.bounce || f.kind !== 'co') return;
        const td = f.t0 + f.dur, k = f.spot;
        const cr = clamp((t - td) / 0.5);
        op(locks[k], P(t, td, 0.15, linear) * (0.75 + 0.25 * wave(t, 1.1, k * 0.2)));
        attr(locks[k], 'r', 34 + 16 * Math.sin(cr * Math.PI)); locks[k].setAttribute('stroke', cr < 1 ? '#FFFFFF' : STEEL);
      });
      op(locks[2], 0); op(locks[3], 0);
      sockets.forEach(s => s.setAttribute('stroke-dashoffset', (-t * 12 * calm).toFixed(1)));
      const sc = P(t, mid('co', 0.5), 0.5, pop); op(strongChip, clamp(sc * 2)); tr(strongChip, 800, 214 + (1 - clamp(sc)) * 14);
      const mp = P(t, mid('co', 0.7), 0.35, linear);
      op(meterLbl, mp); op(oxMeter, mp);
      oxMeter.set(lerp(1, 0.5, P(t, mid('co', 0.74), 1.3, ease)));
      op(lessLbl, P(t, mid('co', 0.86), 0.4, linear));
    }

    /* ----- B2: strain ----- */
    if (a2 > 0) {
      const hp = P(t, tST - 0.1, 0.5, pop);
      const rate = lerp(0.9, 0.42, P(t, tST + 0.4, 1.2, linear));
      const ph = ((t - tST) / rate) % 1, thump = Math.max(0, Math.sin(Math.max(0, ph) * TAU)) * (ph < 0.5 ? 1 : 0);
      tr(heart, 330, 380, Math.max(0.01, hp) * (1 + 0.12 * thump * (0.4 + 0.6 * calm)));
      op(heart, clamp(hp * 2));
      op(strainLines, P(t, tST + 0.5, 0.4, linear) * (0.35 + 0.65 * thump));
      const bp = P(t, mid('strain', 0.42), 0.5, pop);
      op(womb, clamp(bp * 2)); tr(womb, 820, 380 + (1 - clamp(bp)) * 20);
      op(babyTop, P(t, mid('strain', 0.45), 0.4, linear));
      const drop = P(t, mid('strain', 0.62), 1.3, ease);
      babyMeter.set(lerp(0.9, 0.35, drop)); op(bmG, P(t, mid('strain', 0.5), 0.4, linear));
      op(babyLbl, P(t, mid('strain', 0.7), 0.4, linear));
      cordO2.forEach((m, k) => { const u = ((t * 0.45) + k / 4) % 1, q = along(CORD, u); tr(m, q[0], q[1]); op(m, Math.min(1, u * 6, (1 - u) * 6) * (k < 1 ? 1 : 1 - drop * (k >= 2 ? 1 : 0.6))); });
      tr(babyG, -20, 4 + Math.sin(t * 1.2) * 2 * calm);
    }

    /* ----- B3: nicotine ----- */
    if (a3 > 0) {
      const np = P(t, tNI, 0.6, pop);
      op(nicArt, clamp(np * 2)); tr(nicArt, 0, (1 - clamp(np)) * 20);
      cig2.upd(t);
      const lockShut = P(t, mid('nicotine', 0.2), 0.35, easeIn);
      tr(lock.shackle, 0, -14 * (1 - lockShut));
      const ap = P(t, mid('nicotine', 0.22), 0.5, pop); op(addChip, clamp(ap * 2)); tr(addChip, 330, 600, Math.max(0.01, 0.8 + 0.2 * ap));
      op(hardLbl, P(t, mid('nicotine', 0.35), 0.4, linear));
      op(raises, P(t, mid('nicotine', 0.58), 0.4, linear));
      const g1 = P(t, mid('nicotine', 0.6), 0.5, pop), g2 = P(t, mid('nicotine', 0.68), 0.5, pop);
      op(gHR, clamp(g1 * 2)); op(gBP, clamp(g2 * 2));
      gHR.set(lerp(0.22, 0.84, P(t, mid('nicotine', 0.7), 1.2, ease)) + 0.02 * Math.sin(t * 9) * calm);
      gBP.set(lerp(0.22, 0.8, P(t, mid('nicotine', 0.78), 1.2, ease)));
      upHR.set(P(t, mid('nicotine', 0.74), 0.5)); op(upHR, P(t, mid('nicotine', 0.74), 0.2, linear));
      upBP.set(P(t, mid('nicotine', 0.82), 0.5)); op(upBP, P(t, mid('nicotine', 0.82), 0.2, linear));
    }

    /* ----- B4: Cigarettes Cause Trouble ----- */
    if (a4 > 0) {
      CCT.forEach((c, i) => {
        const pc = P(t, tCC - 0.1 + i * 0.12, 0.5, easeOut);
        op(c.g, pc); tr(c.g, c.x, (1 - pc) * 26);
        const p = P(t, mid('cct', 0.1 + i * 0.1), 0.45, pop);
        op(c.top, clamp(p * 2)); c.top.setAttribute('transform', `translate(0 300) scale(${Math.max(0.01, 0.7 + 0.3 * p).toFixed(3)}) translate(0 -300)`);
        const li = P(t, mid('cct', [0.5, 0.66, 0.84][i]), 0.4, linear);
        op(c.low, 0.25 + 0.75 * li);
        const nx = i < 2 ? mid('cct', [0.66, 0.84][i]) : 1e6;
        op(c.hl, win(t, mid('cct', [0.5, 0.66, 0.84][i]), nx, 0.25));
      });
    }

    /* ----- C: emphysema, then surface area ----- */
    if (aC > 0) {
      const tA_ = at('area');
      const showE = P(t, tEM - 0.1, 0.6, pop);
      const crumble = P(t, mid('emphysema', 0.4), 1.8, linear), merge = P(t, mid('emphysema', 0.6), 2.6, ease);
      const mv = P(t, tA_ - 0.1, 1.0);
      op(emTitle, 1 - P(t, tA_ - 0.1, 0.4, linear)); op(saTitle, P(t, tA_ + 0.1, 0.5, linear));
      sick.set(crumble, merge, P(t, mid('area', 0.25), 0.8, linear));
      tr(sick, lerp(600, 760, mv), lerp(430, 410, mv), Math.max(0.01, lerp(0.92 * (0.7 + 0.3 * showE), 0.62, mv)));
      op(sick, clamp(showE * 2));
      healthy.set(0, 0, P(t, mid('area', 0.12), 0.8, linear));
      tr(healthy, 330, 410, 0.62); op(healthy, P(t, tA_ + 0.1, 0.5, linear));
      op(lbHealthy, win(t, mid('emphysema', 0.08), mid('emphysema', 0.6), 0.4));
      op(lbWalls, win(t, mid('emphysema', 0.38), tA_, 0.4));
      op(lbFewer, win(t, mid('emphysema', 0.68), tA_, 0.4));
      op(areaLbls, P(t, mid('area', 0.12), 0.5, linear));
      mH.set(P(t, mid('area', 0.2), 0.9, easeOut)); mS.set(0.34 * P(t, mid('area', 0.32), 0.9, easeOut));
      const pp = P(t, mid('area', 0.58), 0.5, pop);
      op(pers, clamp(pp * 2)); op(persLbl, P(t, mid('area', 0.66), 0.4, linear));
      const pant = wave(t, 0.7);
      pers.pose({ lean: 3 + 2 * pant * calm, armL: [6, 8], armR: [-28, 118] });
      tr(pers, 1050, 560 + (1 - clamp(pp)) * 20);
      op(puffG, clamp(pp * 2));
      pf.forEach((e, k) => { const u = ((t * 1.6) + k / 3) % 1; tr(e, 1084 + u * 34, 386 + k * 9 - u * 6, 0.6 + 0.6 * u); op(e, Math.sin(u * Math.PI)); });
    }

    /* ----- D1: lung cancer and bronchitis ----- */
    if (d1 > 0) {
      lg.set(0.5 * calm * wave(t, 3.6));
      const tp = P(t, mid('diseases', 0.14), 0.5, pop); op(tumour, clamp(tp * 2)); tr(tumour, 508, 520, Math.max(0.01, tp));
      op(lcChip, P(t, mid('diseases', 0.2), 0.4, linear));
      op(inflam, P(t, mid('diseases', 0.55), 0.5, linear) * (0.75 + 0.25 * wave(t, 1.2)));
      op(bcChip, P(t, mid('diseases', 0.58), 0.4, linear)); op(bcSub, P(t, mid('diseases', 0.7), 0.4, linear));
    }

    /* ----- D2: other harm ----- */
    if (d2 > 0) {
      [[cAsb, 0.18], [cDust, 0.3], [cSmog, 0.52]].forEach(([g, f]) => { const p = P(t, mid('other', f), 0.5, pop); op(g, clamp(p * 2)); tr(g, g === cAsb ? 200 : g === cDust ? 460 : 900, (1 - clamp(p)) * 20); });
      tr(dustArt, Math.sin(t * 0.8) * 4 * calm, Math.cos(t * 0.6) * 3 * calm);
      smogPuffs.forEach((e, k) => { const u = ((t * 0.3) + k / 3) % 1; tr(e, 66 + u * 44, 206 - u * 10, 0.5 + 0.7 * u); op(e, Math.sin(u * Math.PI) * 0.9); });
      const sp = P(t, mid('other', 0.4), 0.5, pop); op(scarG, clamp(sp * 2)); op(scarChip, P(t, mid('other', 0.44), 0.4, linear));
      lgS.set(0.4 * calm * wave(t, 3.6));
      const ap = P(t, mid('other', 0.62), 0.5, linear); op(airwayX, ap);
      const inflamed = P(t, mid('other', 0.68), 1.2, ease);
      lining.setAttribute('fill', mixCol('#F2A0B4', '#E8424F', inflamed)); attr(lining, 'r', lerp(46, 54, inflamed)); attr(lumen, 'r', lerp(34, 20, inflamed));
      op(airwayLbl, P(t, mid('other', 0.7), 0.4, linear));
      const ih = P(t, mid('other', 0.82), 0.5, pop); op(inhaler, clamp(ih * 2)); tr(inhaler, 1020, 560 + (1 - clamp(ih)) * 18);
      mist.forEach((e, k) => { const u = ((t * 0.9) + k / 4) % 1; tr(e, 92 + u * 40, 45 - u * 6, 0.5 + 1.1 * u); op(e, Math.sin(u * Math.PI) * 0.9 * ih); });
      op(asthLbl, P(t, mid('other', 0.86), 0.4, linear));
    }

    /* ----- D3: vaping ----- */
    if (d3 > 0) {
      op(todayChip, P(t, tVA - 0.1, 0.4, linear));
      const vp = P(t, tVA, 0.6, pop); op(vapeG, clamp(vp * 2)); tr(vapeG, 300, 440 + (1 - clamp(vp)) * 24, 1, 24);
      op(led, 0.5 + 0.5 * wave(t, 1.6));
      vapour.forEach((e, k) => { const u = ((t * 0.28) + k / 6) % 1; tr(e, VTIP[0] + 30 * u + Math.sin(t + k) * 8 * calm, VTIP[1] - 150 * u, 0.6 + 1.1 * u); op(e, Math.sin(u * Math.PI) * 0.75 * clamp(vp * 2)); });
      rows.forEach((r, i) => { const p = P(t, mid('vaping', [0.1, 0.24, 0.5, 0.74][i]), 0.5, pop); op(r.g, clamp(p * 2)); tr(r.g, (1 - clamp(p)) * 30, 0); });
    }
  };
  function attrNum(el, k) { return +el.getAttribute(k); }
});

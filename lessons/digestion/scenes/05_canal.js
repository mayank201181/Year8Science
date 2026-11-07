/* Chapter 6, The alimentary canal: mouth to anus.
   Beats: the canal draws itself, mouth to anus -> a bolus travels it and each organ lights and gets its
   label as it is named, with a magnifying lens beside it: the mouth (teeth chew, saliva brings amylase,
   a slippery bolus), the oesophagus, the stomach (a churning muscular bag with acid and protease), the
   stomach wall (a thick mucus layer, lining cells replaced) and the small intestine (digestion finished,
   small molecules into the blood) -> not just a stomach job -> water leaves the large intestine ->
   rectum and anus -> My Old Stomach Sometimes Loves Roast Anchovies while the canal lights up end to end
   (showpiece) -> zoom: the liver, gall bladder and pancreas help -> they are not part of the canal. */
scene('canal', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- the lesson's gut palette ---------- */
  const PINK = '#F4A6B8', PINKDK = '#B8466A', PINKLT = '#FFE4EC', HALO = '#FF8FB6';
  const COLON = '#D79C8E', COLONDK = '#8C4A43';
  const BILE = '#7FBF4D', PANC = '#F2C14E';
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
  /* an enzyme as drawn in the enzymes chapter: a rounded blob whose active site (the notch on top) is
     shaped for its molecule; the kind follows the colour (amylase blue, protease magenta, lipase orange) */
  function enzyme(parent, r, color) {
    const kind = color === C.lactic ? 'pro' : color === C.heat ? 'lip' : 'amy', dk = { pro: C.lacticDk, lip: C.heatDk, amy: C.waterDk }[kind];
    const R = 1.1 * r, g = G(parent), top = -0.55 * R, bot = 0.75 * R, n = 0.34 * R;
    let notch;
    if (kind === 'pro') notch = `A${n.toFixed(1)},${n.toFixed(1)} 0 0 0 ${n.toFixed(1)},${top.toFixed(1)}`;
    else if (kind === 'amy') { const s = n / 0.866; notch = `L${-n},${top + 0.5 * s} L0,${top + s} L${n},${top + 0.5 * s} L${n},${top}`; }
    else notch = `L${-n},${top + 0.9 * n} L${n},${top + 0.9 * n} L${n},${top}`;
    E('path', { d: `M${-n},${top} ${notch} C${0.62 * R},${top} ${R},${top + 0.1 * R} ${R},${0.1 * R} C${R},${0.55 * R} ${0.6 * R},${bot} 0,${bot} C${-0.6 * R},${bot} ${-R},${0.55 * R} ${-R},${0.1 * R} C${-R},${top + 0.1 * R} ${-0.62 * R},${top} ${-n},${top} Z`, fill: ball(color, dk), stroke: dk, 'stroke-width': Math.max(1.5, R * 0.07), 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const BEADK = ['#C2534C', '#1E8C85', '#6E9A26', C.ethanolDk];
  function bead(parent, r, i) { return E('circle', { r, fill: ball(BEADS[i % 4], BEADK[i % 4]), stroke: BEADK[i % 4], 'stroke-width': Math.max(1.2, r * 0.12) }, parent); }
  function gloss(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: AMBER, stroke: '#FFE2A8', 'stroke-width': Math.max(1.5, r * 0.06) }, g);
    E('ellipse', { cx: -r * 0.32, cy: -r * 0.42, rx: r * 0.36, ry: r * 0.2, fill: '#ffffff', opacity: 0.6, transform: `rotate(-25 ${-r * 0.32} ${-r * 0.42})` }, g);
    return g;
  }
  /* label with a leader line; its first letter can light up (for the mnemonic) */
  function organLabel(parent, x, y, tx, ty, text) {
    const g = G(parent);
    E('line', { x1: x - 12, y1: y - 9, x2: tx, y2: ty, stroke: C.muted, 'stroke-width': 2.5 }, g);
    E('circle', { cx: tx, cy: ty, r: 5, fill: C.muted }, g);
    const te = E('text', { x, y, 'font-size': 29, 'font-weight': 600, fill: C.ink, 'font-family': FD }, g);
    g.first = E('tspan', {}, te); g.first.textContent = text[0];
    E('tspan', {}, te).textContent = text.slice(1);
    return g;
  }
  function noteChip(parent, text, o) { o = o || {}; return chip(parent, text, Object.assign({ size: 26, fill: 'rgba(20,54,70,0.92)', stroke: C.line, sw: 2, weight: 600 }, o)); }

  /* ---------- the gut: local origin = the lips; anus at y = 495 ---------- */
  function gutArt(parent) {
    const g = G(parent), U = {};
    U.body = G(g);
    E('path', { d: 'M-22,10 C-22,40 -24,62 -40,72 C-70,82 -130,84 -156,104 C-170,116 -170,150 -166,190 L-160,330 C-158,380 -170,440 -166,480 C-162,500 -130,506 -70,506 L70,506 C130,506 162,500 166,480 C170,440 158,380 160,330 L166,190 C170,150 170,116 156,104 C130,84 70,82 40,72 C24,62 22,40 22,10 Z', fill: '#11303F', stroke: '#2E5568', 'stroke-width': 3 }, U.body);
    E('ellipse', { cx: 0, cy: -34, rx: 50, ry: 58, fill: '#11303F', stroke: '#2E5568', 'stroke-width': 3 }, U.body);
    // helper organs sit behind the canal
    U.help = G(g);
    const HD = {
      liver: closedPath([[-152, 132], [-142, 104], [-112, 89], [-70, 85], [-30, 89], [-7, 97], [-5, 105], [-24, 115], [-48, 127], [-60, 140], [-76, 146], [-96, 152], [-116, 164], [-138, 170], [-152, 156]]),
      panc: closedPath([[-38, 240], [-26, 233], [0, 235], [40, 232], [80, 228], [106, 224], [113, 231], [100, 241], [60, 247], [20, 251], [-14, 255], [-34, 252]]),
    };
    U.gall = G(U.help); tr(U.gall, -70, 160, 1, 28);
    U.gallFill = E('ellipse', { rx: 10, ry: 16, fill: ball('#A6DC78', '#4E8A2A') }, U.gall);
    U.gallLine = E('ellipse', { rx: 10, ry: 16, fill: 'none', stroke: '#CDEFAF', 'stroke-width': 2.5 }, U.gall);
    U.liver = G(U.help); U.liverFill = E('path', { d: HD.liver, fill: ball('#C8444F', '#7A1F2A') }, U.liver);
    U.liverLine = E('path', { d: HD.liver, fill: 'none', stroke: '#E37C86', 'stroke-width': 3 }, U.liver);
    U.panc = G(U.help); U.pancFill = E('path', { d: HD.panc, fill: ball('#F7D06A', '#B8892A') }, U.panc);
    U.pancLine = E('path', { d: HD.panc, fill: 'none', stroke: '#FBE3A0', 'stroke-width': 2.5 }, U.panc);
    U.bileDuct = E('path', { d: 'M-61,172 C-56,196 -50,214 -44,228', fill: 'none', stroke: BILE, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, U.help);
    U.pancDuct = E('path', { d: 'M-12,244 C-22,242 -32,238 -42,236', fill: 'none', stroke: '#FBE3A0', 'stroke-width': 4, 'stroke-linecap': 'round' }, U.help);
    U.bileDuctS = sample(g, 'M-64,166 C-56,196 -50,214 -44,228', 3);
    U.liverToGall = sample(g, 'M-110,120 C-94,134 -82,146 -70,160', 3);
    U.pancDuctS = sample(g, 'M30,240 C10,242 -20,242 -44,236', 3);

    // canal geometry
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
    U.haloG = G(g); U.tube = G(g);
    U.sec = {};
    let s0 = 0; const all = [], allA = [], allB = [];
    SEC.forEach(sc => {
      const smp = sample(g, sc.d, 3);
      sc.s0 = s0; sc.L = smp.L; sc.smp = smp; s0 += smp.L;
      smp.pts.forEach(p => { all.push(p); (sc.id === 'oes' || sc.id === 'stomach' || sc.id === 'small' ? allA : allB).push(p); });
      U.sec[sc.id] = sc;
      if (sc.id === 'stomach') return;
      sc.halo = G(U.haloG);
      E('path', { d: sc.d, fill: 'none', stroke: HALO, 'stroke-width': sc.w + 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.35 }, sc.halo);
      E('path', { d: sc.d, fill: 'none', stroke: '#FFB8D0', 'stroke-width': sc.w + 14, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.6 }, sc.halo);
      sc.els = [
        E('path', { d: sc.d, fill: 'none', stroke: sc.stroke, 'stroke-width': sc.w + 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, U.tube),
        E('path', { d: sc.d, fill: 'none', stroke: sc.fill, 'stroke-width': sc.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, U.tube),
      ];
      sc.lit = E('path', { d: sc.d, fill: 'none', stroke: PINKLT, 'stroke-width': Math.max(4, sc.w * 0.5), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, U.tube);
    });
    // the stomach, a J-shaped muscular bag, drawn over the start of the small intestine
    const st = U.sec.stomach;
    const stD = closedPath([[14, 114], [30, 96], [58, 88], [88, 98], [106, 124], [112, 160], [106, 196], [86, 222], [54, 234], [22, 230], [-2, 218], [-17, 205], [-19, 193], [-4, 195], [16, 196], [30, 184], [35, 160], [29, 134]]);
    st.halo = G(U.haloG);
    E('path', { d: stD, fill: 'none', stroke: HALO, 'stroke-width': 34, opacity: 0.35 }, st.halo);
    E('path', { d: stD, fill: 'none', stroke: '#FFB8D0', 'stroke-width': 16, opacity: 0.6 }, st.halo);
    st.bag = G(U.tube);
    st.fillEl = E('path', { d: stD, fill: PINK }, st.bag);
    st.rugae = E('path', { d: 'M40,112 C60,104 82,112 92,132 M44,150 C60,140 78,150 90,170 M40,190 C56,178 74,190 80,206 M14,206 C26,200 40,206 46,214', fill: 'none', stroke: '#E07F9A', 'stroke-width': 3, 'stroke-linecap': 'round' }, st.bag);
    st.lit = E('path', { d: stD, fill: PINKLT }, st.bag);
    st.outline = E('path', { d: stD, fill: 'none', stroke: PINKDK, 'stroke-width': 5, pathLength: 1, 'stroke-dasharray': '1 1' }, U.tube);
    st.els = [st.outline];
    // draw order: the large intestine passes in front of the duodenum, the stomach in front of both
    [U.sec.large, U.sec.rectum, U.sec.anus].forEach(sc => { sc.els.forEach(e => U.tube.appendChild(e)); U.tube.appendChild(sc.lit); });
    U.tube.appendChild(st.bag); U.tube.appendChild(st.outline);
    U.ring = E('ellipse', { cx: 0, cy: 497, rx: 9, ry: 4, fill: '#5A2A2A', stroke: COLONDK, 'stroke-width': 2 }, U.tube);
    U.mouth = G(g);
    E('path', { d: 'M-19,-1 C-12,-8 -5,-7 0,-4 C5,-7 12,-8 19,-1 C10,2 -10,2 -19,-1 Z', fill: '#E57D95', stroke: PINKDK, 'stroke-width': 2 }, U.mouth);
    E('path', { d: 'M-18,0 C-10,3 10,3 18,0 C12,11 -12,11 -18,0 Z', fill: '#F096AA', stroke: PINKDK, 'stroke-width': 2 }, U.mouth);
    U.mouthHalo = E('ellipse', { cx: 0, cy: 2, rx: 46, ry: 32, fill: glow(HALO) }, U.haloG);
    // one path along the whole canal, for the end-to-end glow
    const toD = pts => 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    const allD = toD(all);
    U.traceA = E('path', { d: toD(allA), fill: 'none', stroke: '#FFF0F5', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, U.tube);
    U.tube.insertBefore(U.traceA, U.sec.large.els[0]);
    U.traceB = E('path', { d: toD(allB), fill: 'none', stroke: '#FFF0F5', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, U.tube);
    U.tube.insertBefore(U.traceB, st.bag);
    U.sA = U.sec.large.s0;
    U.traceHalo = E('path', { d: allD, fill: 'none', stroke: '#FFB8D0', 'stroke-width': 26, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, U.haloG);
    U.total = s0;
    U.order = ['oes', 'stomach', 'small', 'large', 'rectum', 'anus'];
    U.pos = s => {
      s = clamp(s, 0, U.total);
      for (const id of U.order) { const sc = U.sec[id]; if (s <= sc.s0 + sc.L || id === 'anus') return sc.smp.at((s - sc.s0) / sc.L); }
      return [0, 495];
    };
    U.sAt = (id, f) => U.sec[id].s0 + U.sec[id].L * f;
    U.g = g;
    { const sc = U.sec.small; let a = null, b = null; sc.smp.pts.forEach((p, i) => { if (i / sc.smp.n < 0.3 && p[1] > 259 && p[1] < 295) { if (a === null) a = i; b = i; } }); U.under = [sc.s0 + sc.L * a / sc.smp.n, sc.s0 + sc.L * b / sc.smp.n]; }
    U.vis = s => clamp(Math.max(U.under[0] - s, s - U.under[1]) / 8);
    return U;
  }

  /* ================= the diagram ================= */
  const GX = 330, GY = 200;
  const gutG = G(root);
  const U = gutArt(gutG);
  // the bolus travels inside the gut group, so it zooms with it
  const bol = G(gutG);
  const bolA = E('circle', { r: 9, fill: AMBER, stroke: '#FFE2A8', 'stroke-width': 1.5 }, bol);
  const bolB = E('circle', { r: 9, fill: CHYME, stroke: '#FFF0CC', 'stroke-width': 1.5 }, bol);
  const bolC = E('circle', { r: 9, fill: WASTE, stroke: '#C79A72', 'stroke-width': 1.5 }, bol);
  const bolShine = E('ellipse', { cx: -3, cy: -4, rx: 3.6, ry: 2.2, fill: '#ffffff', opacity: 0.7 }, bol);
  const tipGlow = E('circle', { r: 22, fill: glow('#FFF3F7') }, gutG);
  // water leaving the large intestine
  const wDrops = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85].map((f, k) => {
    const el = E('path', { d: dropD(6), fill: ball(C.water, C.waterDk) }, gutG);
    const p = U.sec.large.smp.at(f), q = U.sec.large.smp.at(Math.min(1, f + 0.01));
    let nx = -(q[1] - p[1]), ny = q[0] - p[0]; const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
    if (nx * (p[0] - 0) + ny * (p[1] - 350) < 0) { nx = -nx; ny = -ny; }   // point away from the middle
    return { el, f, p, nx, ny };
  });
  // food dots that show the route stays inside the tube (helper beats)
  const route = [0, 1, 2, 3, 4, 5].map(() => E('circle', { r: 5.5, fill: AMBER, stroke: '#FFE2A8', 'stroke-width': 1.2 }, gutG));
  // bile drops and enzyme blobs (helper beats)
  const bileDrops = [0, 1, 2, 3].map(() => E('path', { d: dropD(4.5), fill: ball('#A6DC78', '#4E8A2A') }, gutG));
  const pancBlobs = [C.water, C.lactic, C.heat, C.water].map(c => { const e = enzyme(gutG, 5.5, c, '#334'); return e; });
  [...bileDrops, ...pancBlobs].forEach(e => U.g.insertBefore(e, U.haloG));   // above the helpers, below the canal

  // soft edges for the zoomed view
  const vig = G(root);
  { const mk = (id, c, a0, a1) => { const lg = E('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs()); E('stop', { offset: 0, 'stop-color': c, 'stop-opacity': a0 }, lg); E('stop', { offset: 1, 'stop-color': c, 'stop-opacity': a1 }, lg); return `url(#${id})`; };
    E('rect', { x: 0, y: 600, width: W, height: 150, fill: mk('dgCanalVigB', '#0A1B27', 0, 1) }, vig); }

  /* ================= labels for the seven parts ================= */
  const LBX = 600;
  const PARTS = [
    { id: 'mouth', text: 'mouth', y: 209, tx: 352, ty: 200, word: 'My' },
    { id: 'oes', text: 'oesophagus', y: 272, tx: 338, ty: 262, word: 'Old' },
    { id: 'stomach', text: 'stomach', y: 360, tx: 442, ty: 351, word: 'Stomach' },
    { id: 'small', text: 'small intestine', y: 520, tx: 414, ty: 521, word: 'Sometimes' },
    { id: 'large', text: 'large intestine', y: 598, tx: 450, ty: 590, word: 'Loves' },
    { id: 'rectum', text: 'rectum', y: 660, tx: 344, ty: 662, word: 'Roast' },
    { id: 'anus', text: 'anus', y: 705, tx: 340, ty: 697, word: 'Anchovies' },
  ];
  const labG = G(root);
  PARTS.forEach(p => { p.lab = organLabel(labG, LBX, p.y, p.tx, p.ty, p.text); });
  // mnemonic words
  const mnG = G(root);
  PARTS.forEach(p => {
    const te = E('text', { x: 840, y: p.y + 2, 'font-size': 36, 'font-weight': 700, fill: C.ink, 'font-family': FD }, mnG);
    E('tspan', { fill: C.energy }, te).textContent = p.word[0];
    E('tspan', {}, te).textContent = p.word.slice(1);
    p.mn = te;
  });

  /* ================= title for the first line ================= */
  const ttl = G(root);
  T(ttl, 885, 318, 'alimentary canal', { size: 60, weight: 700, anchor: 'middle' });
  T(ttl, 885, 372, 'one long, muscular tube', { size: 30, weight: 500, anchor: 'middle', fill: C.muted });
  const ttlChip = G(ttl); tr(ttlChip, 885, 446);
  chip(ttlChip, 'mouth → anus', { size: 30, fill: C.card2, stroke: C.line });

  /* ================= the lens ================= */
  const LX = 990, LY = 400, LR = 160;
  const lens = G(root);
  const cid = 'dgCanalLens';
  { const cp = E('clipPath', { id: cid }, defs()); E('circle', { r: LR }, cp); }
  E('circle', { r: LR + 9, fill: '#08161F' }, lens);
  const lensIn = G(lens, { 'clip-path': `url(#${cid})` });
  E('circle', { r: LR, fill: 'none', stroke: '#B5D6E6', 'stroke-width': 7 }, lens);
  E('circle', { r: LR + 6, fill: 'none', stroke: '#2C5468', 'stroke-width': 3 }, lens);
  const lensTxt = G(root);
  const title = (text) => { const c = chip(lensTxt, text, { size: 28, fill: 'rgba(10,27,39,0.85)', stroke: C.line, sw: 2, color: C.energy }); tr(c, LX, 196); return c; };
  /* legend row: [icon, text] items centred at (LX, y) */
  function legend(items, y, cx) {
    const g = G(lensTxt), parts = [];
    let w = 0;
    items.forEach(([draw, text, col]) => { const tw = textWidth(text, 27, FD, 600); parts.push({ draw, text, col, tw }); w += 34 + tw; });
    w += (items.length - 1) * 30;
    let x = (cx || LX) - w / 2;
    parts.forEach(p => { const ic = G(g); tr(ic, x + 13, y - 9); p.draw(ic); T(g, x + 34, y, p.text, { size: 27, weight: 600, fill: p.col || C.ink }); x += 34 + p.tw + 30; });
    return g;
  }
  const icDrop = g => E('path', { d: dropD(9), fill: 'rgba(160,220,250,0.9)', stroke: '#E6F7FF', 'stroke-width': 1.5 }, g);
  const icAmy = g => enzyme(g, 12, C.water, C.waterDk);
  const icPro = g => enzyme(g, 12, C.lactic, C.lacticDk);
  const icBub = g => E('circle', { r: 9, fill: 'rgba(216,240,122,0.2)', stroke: '#D8F07A', 'stroke-width': 2.5 }, g);

  // --- A. the mouth ---
  const mL = G(lensIn);
  E('circle', { r: LR, fill: '#3B1222' }, mL);
  const mTongue = E('ellipse', { cx: 0, cy: 44, rx: 118, ry: 48, fill: ball('#E7819B', '#A83A60') }, mL);
  const mFood = G(mL);
  const chunk = E('path', { d: closedPath([[-38, -30], [-8, -36], [30, -30], [40, -6], [34, 18], [0, 24], [-34, 18], [-42, -4]]), fill: ball('#F0C274', '#A8742E'), stroke: '#FFE2A8', 'stroke-width': 2.5 }, mFood);
  const crumbs = [], cr = rng(17);
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + cr() * 0.5, rr = 22 + cr() * 30;
    crumbs.push({ el: E('path', { d: closedPath(blobPts(9 + cr() * 6, 8 + cr() * 5, 7, 0, 0.18, 30 + i)), fill: ball('#F0C274', '#A8742E'), stroke: '#FFE2A8', 'stroke-width': 1.5 }, mFood), x: Math.cos(a) * rr * 1.25, y: -2 + Math.sin(a) * rr * 0.6, rot: cr() * 360 });
  }
  const mDrops = [], mAmy = [];
  for (let k = 0; k < 6; k++) {
    const side = k % 2 ? 1 : -1, c = crumbs[[0, 4, 3, 8, 6, 1][k]];
    mDrops.push({ el: E('path', { d: dropD(13), fill: 'rgba(170,228,255,0.92)', stroke: '#FFFFFF', 'stroke-width': 2 }, mL), side, c, y0: 4 + (k % 3) * 20 });
    if (k % 2 === 0) mAmy.push({ el: enzyme(mL, 13, C.water, C.waterDk), k, c, side });
  }
  const mBolus = gloss(mL, 46);
  const mSpark = [0, 1, 2].map(i => { const s = spark(mL, 9, { seed: i, color: '#FFFFFF' }); return s; });
  const mUpper = G(mL), mLower = G(mL);
  E('path', { d: 'M-175,-175 L175,-175 L175,-96 C90,-66 -90,-66 -175,-96 Z', fill: '#C2577A' }, mUpper);
  for (let i = 0; i < 6; i++) { const x = -100 + i * 40, y = -70 - Math.pow(x / 100, 2) * 14; E('rect', { x: x - 17, y: y - 22, width: 34, height: 44, rx: 10, fill: '#F5EEDC', stroke: '#CDBF9F', 'stroke-width': 2 }, mUpper); }
  for (let i = 0; i < 6; i++) { const x = -100 + i * 40, y = 64 + Math.pow(x / 100, 2) * 14; E('rect', { x: x - 17, y: y - 22, width: 34, height: 44, rx: 10, fill: '#F5EEDC', stroke: '#CDBF9F', 'stroke-width': 2 }, mLower); }
  E('path', { d: 'M-175,175 L175,175 L175,100 C90,70 -90,70 -175,100 Z', fill: '#C2577A' }, mLower);
  const mT = title('inside the mouth');
  const mLeg1 = legend([[icDrop, 'saliva'], [icAmy, 'amylase', '#9FE3F8']], 620);
  const mLeg2 = noteChip(lensTxt, 'slippery: easy to swallow', { color: C.ink }); tr(mLeg2, LX, 668);

  // --- B. the oesophagus ---
  const oL = G(lensIn);
  E('circle', { r: LR, fill: '#2A1220' }, oL);
  E('rect', { x: -44, y: -180, width: 88, height: 360, fill: '#6E2440' }, oL);
  const oBol = gloss(oL, 36);
  const oWallL = E('path', { fill: PINK, stroke: PINKDK, 'stroke-width': 3 }, oL), oWallR = E('path', { fill: PINK, stroke: PINKDK, 'stroke-width': 3 }, oL);
  const oRings = E('path', { fill: 'none', stroke: '#D9708C', 'stroke-width': 3, 'stroke-linecap': 'round' }, oL);
  { let d = ''; for (let y = -168; y <= 168; y += 24) d += `M58,${y} L80,${y} M-58,${y} L-80,${y} `; oRings.setAttribute('d', d); }
  const oT = title('the oesophagus');
  const oLeg = G(lensTxt);
  { const c = noteChip(oLeg, 'carries food down to the stomach', { color: C.ink }); tr(c, LX, 620); }
  const oArrow = arrow(lens, 120, -60, 120, 60, { color: C.energy, width: 6 });

  // --- C. the stomach ---
  const sL = G(lensIn);
  E('circle', { r: LR, fill: '#24301C' }, sL);
  const sBub = bubbles(sL, -110, -105, 220, 210, { n: 13, r: 7, seed: 23, speed: 0.32, color: 'rgba(216,240,122,0.85)', fill: 'rgba(216,240,122,0.14)' });
  const sPieces = [], sr = rng(29);
  for (let i = 0; i < 9; i++) sPieces.push({ el: E('path', { d: closedPath(blobPts(13 + sr() * 7, 10 + sr() * 5, 7, 0, 0.2, 60 + i)), fill: i % 3 ? CHYME : AMBER, stroke: '#FFF0CC', 'stroke-width': 1.5 }, sL), r: 30 + sr() * 62, a: sr() * TAU, sp: 0.35 + sr() * 0.3, ph: sr() * TAU });
  const sPro = [0, 1, 2].map(i => ({ el: enzyme(sL, 15, C.lactic, C.lacticDk), a: i * TAU / 3 + 0.4, r: 48 + i * 18 }));
  const sWall = E('path', { fill: PINK, stroke: PINKDK, 'stroke-width': 4, 'fill-rule': 'evenodd' }, sL);
  const sStripes = E('path', { fill: 'none', stroke: '#D9708C', 'stroke-width': 3, 'stroke-linecap': 'round' }, sL);
  const sT = title('inside the stomach');
  const sLeg1 = noteChip(lensTxt, 'muscle wall churns the food', { color: C.ink }); tr(sLeg1, LX, 620);
  const sLeg2 = legend([[icBub, 'acid', '#E4F59A']], 674, LX - 92);
  const sLeg3 = legend([[icPro, 'protease', '#FF9CC7']], 674, LX + 72);

  // --- D. the stomach wall ---
  const uL = G(lensIn);
  E('circle', { r: LR, fill: '#24301C' }, uL);
  const uBub = bubbles(uL, -120, -150, 240, 100, { n: 8, r: 7, seed: 31, speed: 0.3, color: 'rgba(216,240,122,0.85)', fill: 'rgba(216,240,122,0.14)' });
  const uPro = enzyme(uL, 18, C.lactic, C.lacticDk);
  const uMucus = E('path', { fill: 'rgba(214,244,204,0.88)', stroke: '#F2FFF0', 'stroke-width': 3 }, uL);
  const uShine = E('path', { fill: 'none', stroke: '#ffffff', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }, uL);
  E('rect', { x: -175, y: 64, width: 350, height: 120, fill: '#B84A6C' }, uL);
  { let d = ''; for (let y = 82; y < 175; y += 18) d += `M-175,${y} L175,${y} `; E('path', { d, stroke: '#D9708C', 'stroke-width': 3, opacity: 0.6 }, uL); }
  const CELLW = 44, cells = [];
  for (let i = 0; i < 8; i++) {
    const x = -176 + i * CELLW, g = G(uL);
    const body = E('rect', { x: x + 2, y: 6, width: CELLW - 4, height: 56, rx: 10, fill: '#F2A3BA', stroke: PINKDK, 'stroke-width': 2.5 }, g);
    E('circle', { cx: x + CELLW / 2, cy: 40, r: 8, fill: '#9B7AD8', opacity: 0.85 }, g);
    cells.push({ g, body, x });
  }
  const REPL = [3, 6, 1];
  const fresh = REPL.map(i => { const x = cells[i].x, g = G(uL); E('rect', { x: x + 2, y: 6, width: CELLW - 4, height: 56, rx: 10, fill: '#FFC2D4', stroke: '#E86A92', 'stroke-width': 2.5 }, g); E('circle', { cx: x + CELLW / 2, cy: 40, r: 8, fill: '#B79CF0' }, g); return { g, x }; });
  const uQ = T(uL, 0, -40, '?', { size: 110, weight: 700, anchor: 'middle', fill: C.energy });
  const uT = title('the stomach wall');
  const uLeg1 = legend([[g => E('rect', { x: -12, y: -9, width: 24, height: 18, rx: 6, fill: 'rgba(214,244,204,0.9)' }, g), 'thick, slimy mucus', '#E2F7DA']], 620);
  const uLeg2 = legend([[g => E('rect', { x: -9, y: -12, width: 18, height: 24, rx: 5, fill: '#FFC2D4', stroke: '#E86A92', 'stroke-width': 2 }, g), 'new lining cells', '#FFC2D4']], 672);
  const uDays = noteChip(uL, 'every few days', { size: 26, color: C.ink, fill: 'rgba(10,27,39,0.8)' }); tr(uDays, 0, 118);

  // --- E. the small intestine ---
  const iL = G(lensIn);
  E('circle', { r: LR, fill: '#2C2514' }, iL);
  E('rect', { x: -175, y: 64, width: 350, height: 120, fill: '#3A1A22' }, iL);
  const iCap = G(iL);
  E('rect', { x: -175, y: 74, width: 350, height: 62, fill: '#5E1A26' }, iCap);
  E('rect', { x: -175, y: 82, width: 350, height: 46, fill: '#C93242' }, iCap);
  const iRbc = []; for (let i = 0; i < 8; i++) iRbc.push(E('ellipse', { rx: 12, ry: 7, fill: '#FF8A94', stroke: '#FFD0D5', 'stroke-width': 1.5 }, iCap));
  for (let i = 0; i < 8; i++) { const x = -176 + i * CELLW; E('rect', { x: x + 2, y: -2, width: CELLW - 4, height: 52, rx: 10, fill: '#F2A3BA', stroke: PINKDK, 'stroke-width': 2.5 }, iL); E('circle', { cx: x + CELLW / 2, cy: 30, r: 7, fill: '#9B7AD8', opacity: 0.85 }, iL); }
  // bond colours as in the molecule chapters: amber in starch, lilac-grey in protein
  const iBonds = E('path', { fill: 'none', stroke: '#C98F22', 'stroke-width': 4, 'stroke-linecap': 'round' }, iL);
  const iBondsP = E('path', { fill: 'none', stroke: '#C8B6CF', 'stroke-width': 4, 'stroke-linecap': 'round' }, iL);
  const iUnits = [];
  for (let i = 0; i < 4; i++) iUnits.push({ el: molGlucose(iL, 14), x0: -112 + i * 34, y0: -98, kind: 'g', i });
  for (let i = 0; i < 4; i++) { const g = G(iL); bead(g, 12, i); iUnits.push({ el: g, x0: 22 + i * 28, y0: -60, kind: 'b', i }); }
  iUnits.forEach((u, k) => { u.x1 = -140 + ((k * 3) % 8) * 38 + (k % 2) * 6; u.d = [0, 0.6, 1.2, 1.8, 0.3, 0.9, 1.5, 2.1][k]; });
  const iAmy = enzyme(iL, 15, C.water, C.waterDk), iProt = enzyme(iL, 15, C.lactic, C.lacticDk);
  const iT = title('the small intestine');
  const iLeg1 = noteChip(lensTxt, 'digestion finished', { color: C.ink }); tr(iLeg1, LX, 620);
  const iLeg2 = noteChip(lensTxt, 'small molecules into the blood', { color: '#FF9AA4' }); tr(iLeg2, LX, 672);
  const LENS = [
    { g: mL, ttl: mT, txt: [mLeg1, mLeg2], a: () => at('mouth') - 0.15, b: () => at('oesophagus') + 0.1 },
    { g: oL, ttl: oT, txt: [oLeg, oArrow], a: () => at('oesophagus') - 0.05, b: () => at('stomach') + 0.1 },
    { g: sL, ttl: sT, txt: [sLeg1, sLeg2, sLeg3], a: () => at('stomach') - 0.05, b: () => at('mucus') + 0.1 },
    { g: uL, ttl: uT, txt: [uLeg1, uLeg2], a: () => at('mucus') - 0.05, b: () => at('small') + 0.1 },
    { g: iL, ttl: iT, txt: [iLeg1, iLeg2], a: () => at('small') - 0.05, b: () => at('notjust') + 0.3 },
  ];

  /* ================= right-hand notes, aligned with the label rows ================= */
  const notes = G(root);
  const NX = 985;
  const nOnly = G(notes); { const c = noteChip(nOnly, 'only the stomach?', { color: C.muted }); tr(c, 0, 0); nOnly.w = c.w; } tr(nOnly, NX, 351);
  const nStrike = strike(notes, NX - nOnly.w / 2 + 8, 351, NX + nOnly.w / 2 - 8, C.bad);
  const nCross = cross(notes, 13); tr(nCross, NX + nOnly.w / 2 + 28, 351);
  const nStart = noteChip(notes, 'starts here', { color: '#0A1B27', fill: C.good, stroke: 'none' }); tr(nStart, NX, 200);
  const nFinish = noteChip(notes, 'finishes here', { color: '#0A1B27', fill: C.good, stroke: 'none' }); tr(nFinish, NX, 511);
  const nSpan = arrow(notes, 1130, 226, 1130, 484, { color: C.good, width: 4 });
  const nWater = G(notes); tr(nWater, NX, 589);
  { const c = noteChip(nWater, 'water absorbed', { color: '#9FE3F8', padX: 52 }); c.label.setAttribute('x', 14); const d = E('path', { d: dropD(9), fill: ball(C.water, C.waterDk) }, nWater); tr(d, -c.w / 2 + 28, 3); }
  const nStore = noteChip(notes, 'stores faeces', { color: '#E3C2A6' }); tr(nStore, NX, 651);
  const nLeave = noteChip(notes, 'faeces leave', { color: '#E3C2A6' }); tr(nLeave, NX, 697);

  /* ================= helper organs (zoomed) ================= */
  const helpG = G(root);
  function helperLabel(x, y, tx, ty, text, note, anchor) {
    const g = G(helpG);
    const right = anchor === 'end';
    E('line', { x1: right ? x + 12 : x - 12, y1: y - 9, x2: tx, y2: ty, stroke: C.muted, 'stroke-width': 2.5 }, g);
    E('circle', { cx: tx, cy: ty, r: 5, fill: C.muted }, g);
    T(g, x, y, text, { size: 32, weight: 700, anchor: right ? 'end' : 'start' });
    g.note = T(g, x, y + 36, note, { size: 26, weight: 600, anchor: right ? 'end' : 'start', fill: C.muted, font: FB });
    g.cross = cross(g, 13); g.cx = right ? x - textWidth(text, 32, FD, 700) - 30 : x + textWidth(text, 32, FD, 700) + 30; g.cy = y - 11;
    tr(g.cross, g.cx, g.cy);
    return g;
  }
  // zoomed view: local (lx, ly) -> (ZX + ZS*lx, ZY + ZS*ly)
  const ZS = 1.5, ZX = 590, ZY = 112;
  const zp = (lx, ly) => [ZX + ZS * lx, ZY + ZS * ly];
  const hLiver = helperLabel(300, 268, ...zp(-128, 120), 'liver', 'makes bile', 'end');
  const hGall = helperLabel(300, 438, ...zp(-66, 172), 'gall bladder', 'stores bile', 'end');
  const hPanc = helperLabel(850, 506, ...zp(84, 236), 'pancreas', 'makes enzymes', 'start');
  const hTop = G(helpG); tr(hTop, 985, 172);
  const hHelp = noteChip(hTop, '3 helper organs', { size: 30, color: C.energy });
  const hNot = G(hTop);
  card(hNot, -170, -56, 340, 128, { fill: 'rgba(40,14,22,0.9)', stroke: C.bad, sw: 3 });
  T(hNot, 0, -10, '**not** part of the', { size: 32, weight: 600, anchor: 'middle', boldFill: '#FF8F9A' });
  T(hNot, 0, 38, 'alimentary canal', { size: 32, weight: 700, anchor: 'middle' });

  /* ================= update ================= */
  const tubeS = [mid('tube', 0.1), mid('tube', 0.78)];
  // bolus position (arc length) and colour stage, as a pure function of t
  function bolusAt(t) {
    const sMid = U.sAt('stomach', 0.42), sEndSmall = U.sAt('small', 1), L = U.sec;
    if (t < mid('mouth', 0.8) || t > end('rectum') + 0.2) return null;
    if (t < at('oesophagus')) return { s: 0, k: 0, r: 9 };
    if (t < at('stomach') + 0.3) return { s: lerp(0, sMid, P(t, at('oesophagus') + 0.05, at('stomach') + 0.3 - at('oesophagus') - 0.05, ease)), k: 0, r: 9 };
    if (t < mid('small', 0.08)) return { s: sMid, k: P(t, mid('stomach', 0.5), 2.5, linear), r: 9 + 2 * P(t, mid('stomach', 0.4), 2, linear), jig: 1 };
    if (t < at('large')) return { s: lerp(sMid, sEndSmall, P(t, mid('small', 0.08), mid('small', 0.85) - mid('small', 0.08), ease)), k: 1, r: lerp(11, 7, P(t, mid('small', 0.2), 3.5, linear)) };
    if (t < at('rectum')) return { s: lerp(L.large.s0, L.large.s0 + L.large.L, P(t, at('large') + 0.1, end('large') - at('large') - 0.1, ease)), k: 1 + P(t, at('large') + 0.3, 2.4, linear), r: lerp(7, 9, P(t, at('large'), 2, linear)) };
    const sR = lerp(L.rectum.s0, L.rectum.s0 + L.rectum.L * 0.55, P(t, at('rectum'), 0.8, easeOut));
    const out = P(t, mid('rectum', 0.68), 1.2, easeIn);
    return { s: sR + out * (U.total - sR + 40), k: 2, r: 9.5, out };
  }
  const SPANS = { mouth: ['mouth', 0, 'oesophagus', 0], oes: ['oesophagus', 0, 'stomach', 0], stomach: ['stomach', 0, 'small', 0], small: ['small', 0, 'notjust', 0], large: ['large', 0, 'rectum', 0], rectum: ['rectum', 0, 'rectum', 0.7], anus: ['rectum', 0.62, 'anchovies', 0] };
  const LIGHT_AT = [0.53, 0.585, 0.65, 0.71, 0.79, 0.865, 0.925];

  return t => {
    /* --- diagram: fade in, draw the canal, zoom for the helpers --- */
    const zoom = P(t, at('helpers') + 0.15, 1.3);
    tr(gutG, lerp(GX, ZX, zoom), lerp(GY, ZY, zoom), lerp(1, ZS, zoom));
    op(gutG, P(t, S.first - 0.3, 0.5, linear));
    const bodyOut = P(t, at('helpers') + 0.1, 0.45, linear);
    op(U.body, 1 - bodyOut);
    op(U.mouth, P(t, tubeS[0] - 0.2, 0.4, linear) * (1 - bodyOut));
    const draw = P(t, tubeS[0], tubeS[1] - tubeS[0], linear), sDraw = draw * U.total;
    U.order.forEach(id => { const sc = U.sec[id], q = clamp((sDraw - sc.s0) / sc.L); sc.els.forEach(e => dash(e, q)); });
    op(U.sec.stomach.bag, clamp((sDraw - U.sec.stomach.s0) / U.sec.stomach.L));
    op(U.ring, P(t, tubeS[1] - 0.1, 0.3, linear));
    const tp = U.pos(sDraw);
    tr(tipGlow, tp[0], tp[1], 0.8 + 0.3 * wave(t, 0.6));
    op(tipGlow, draw > 0 && draw < 1 ? 1 : 0);

    /* --- how lit each part is --- */
    const lightOf = id => {
      const sp = SPANS[id];
      let v = win(t, mid(sp[0], sp[1]), mid(sp[2], sp[3]) + 0.2, 0.35);
      if (id === 'mouth') v = Math.max(v, win(t, mid('notjust', 0.45), at('large'), 0.35));
      if (id === 'small') v = Math.max(v, win(t, mid('notjust', 0.72), at('large'), 0.35));
      const k = ['mouth', 'oes', 'stomach', 'small', 'large', 'rectum', 'anus'].indexOf(id);
      v = Math.max(v, win(t, mid('anchovies', LIGHT_AT[k]), at('helpers') + 0.3, 0.3));
      if (id === 'oes' || id === 'stomach' || id === 'small') v = Math.max(v, 0.85 * win(t, mid('notcanal', 0.3), S.D + 10, 0.5));
      return v;
    };
    const pulse = 0.8 + 0.2 * wave(t, 1.1);
    ['oes', 'small', 'large', 'rectum', 'anus'].forEach(id => { const v = lightOf(id), sc = U.sec[id]; op(sc.halo, v * 0.45 * pulse); op(sc.lit, v * 0.9); });
    { const v = lightOf('stomach'), st = U.sec.stomach; op(st.halo, v * 0.45 * pulse); op(st.lit, v * 0.55); }
    { const v = lightOf('mouth'); op(U.mouthHalo, v * pulse); }
    // the end-to-end glow while the order is named
    const tk = LIGHT_AT.map(f => mid('anchovies', f));
    let sT = -1;
    if (t >= tk[1]) {
      const segs = [[tk[1], tk[2], 0, U.sAt('stomach', 0)], [tk[2], tk[3], U.sAt('stomach', 0), U.sAt('small', 0)], [tk[3], tk[4], U.sAt('small', 0), U.sAt('large', 0)], [tk[4], tk[5], U.sAt('large', 0), U.sAt('rectum', 0)], [tk[5], tk[6], U.sAt('rectum', 0), U.sAt('anus', 0)], [tk[6], tk[6] + 0.4, U.sAt('anus', 0), U.total]];
      sT = U.total;
      for (const [a, b, s0, s1] of segs) if (t < b) { sT = lerp(s0, s1, clamp((t - a) / (b - a))); break; }
    }
    const trOn = win(t, tk[1] - 0.05, at('helpers') + 0.2, 0.3);
    dash(U.traceHalo, sT / U.total); op(U.traceHalo, trOn * (sT > 0 ? 0.3 * pulse : 0));
    dash(U.traceA, sT / U.sA); op(U.traceA, trOn * (sT > 0 ? 0.85 : 0));
    dash(U.traceB, (sT - U.sA) / (U.total - U.sA)); op(U.traceB, trOn * (sT > U.sA ? 0.85 : 0));

    /* --- the bolus --- */
    const B = bolusAt(t);
    if (!B) op(bol, 0);
    else {
      const p = U.pos(B.s);
      const j = B.jig ? calm * 5 * Math.sin(t * 3.1) : 0, j2 = B.jig ? calm * 4 * Math.sin(t * 2.3 + 1) : 0;
      tr(bol, p[0] + j, p[1] + j2 + (B.out ? B.out * 30 : 0), B.r / 9);
      op(bol, P(t, mid('mouth', 0.8), 0.3, linear) * (1 - (B.out ? P(B.out, 0.55, 0.45, linear) : 0)) * U.vis(B.s));
      op(bolB, clamp(B.k)); op(bolC, clamp(B.k - 1)); op(bolShine, 0.7 * (1 - clamp(B.k - 1)));
    }
    // water drops leave the large intestine as the waste passes
    wDrops.forEach((w, k) => {
      const t0 = lerp(at('large') + 0.1, end('large'), w.f * 0.92), u = clamp((t - t0) / 1.1);
      op(w.el, u > 0 && u < 1 ? Math.sin(u * Math.PI) : 0);
      if (u > 0 && u < 1) tr(w.el, w.p[0] + w.nx * (8 + 34 * easeOut(u)), w.p[1] + w.ny * (8 + 34 * easeOut(u)), 1, 0);
    });

    op(vig, zoom);

    /* --- labels and mnemonic --- */
    const labOut = 1 - P(t, at('helpers') - 0.1, 0.45, linear);
    const labIn = [mid('mouth', 0.02), at('oesophagus') + 0.05, at('stomach') + 0.05, at('small') + 0.05, at('large') + 0.05, at('rectum') + 0.1, mid('rectum', 0.72)];
    PARTS.forEach((p, k) => {
      const a = P(t, labIn[k], 0.4, linear) * labOut;
      op(p.lab, a); if (a > 0) tr(p.lab, (1 - P(t, labIn[k], 0.5, easeOut)) * 16, 0);
      const lit = P(t, mid('anchovies', LIGHT_AT[k]), 0.25, linear);
      p.lab.first.setAttribute('fill', lit > 0.5 ? C.energy : C.ink);
      p.lab.first.setAttribute('font-weight', lit > 0.5 ? 800 : 600);
      const w = P(t, mid('anchovies', 0.17 + k * 0.047), 0.35, linear) * labOut;
      op(p.mn, w); if (w > 0) tr(p.mn, (1 - P(t, mid('anchovies', 0.17 + k * 0.047), 0.4, easeOut)) * 24, 0);
    });
    op(mnG, labOut);

    /* --- first line: the name --- */
    const tt = win(t, mid('tube', 0.55), at('mouth') + 0.15, 0.4);
    op(ttl, tt); if (tt > 0) tr(ttl, 0, (1 - P(t, mid('tube', 0.55), 0.6, easeOut)) * 14);

    /* --- the lens --- */
    const lensA = win(t, at('mouth') - 0.15, at('notjust') + 0.3, 0.35);
    op(lens, lensA); op(lensTxt, lensA);
    if (lensA > 0) {
      const lp = P(t, at('mouth') - 0.15, 0.55, pop), lq = 1 - P(t, at('notjust') + 0.0, 0.3, easeIn);
      tr(lens, LX, LY, Math.max(0.01, (0.6 + 0.4 * lp) * (0.7 + 0.3 * lq)));
      LENS.forEach(L => { const a = win(t, L.a(), L.b(), 0.3); op(L.g, a); op(L.ttl, a); L.txt.forEach(e => op(e, a)); L.on = a > 0; });
    }
    // A. mouth
    if (lensA > 0 && LENS[0].on) {
      const c0 = mid('mouth', 0.04), cy = (t - c0) / 0.7;
      const jaw = cy > 0 && cy < 3 ? 0.5 - 0.5 * Math.cos(cy * TAU) : 0;
      tr(mLower, 0, -84 * jaw * (S.reduce ? 0.6 : 1)); tr(mTongue, 0, -30 * jaw);
      const bites = clamp(Math.floor(cy + 0.5), 0, 3);
      tr(chunk, 0, 0, [1, 0.62, 0.34, 0.001][bites]); op(chunk, bites < 3 ? 1 : 0);
      const gather = P(t, mid('mouth', 0.7), 0.7, easeIn);
      crumbs.forEach((c, i) => {
        const shown = i < [0, 3, 6, 9][bites];
        op(c.el, shown ? 1 - P(gather, 0.75, 0.25, linear) : 0);
        tr(c.el, lerp(c.x, 0, gather) + Math.sin(t * 1.7 + i) * 2 * calm, lerp(c.y, -6, gather), 1, c.rot);
      });
      mDrops.forEach((d, k) => {
        const u = clamp((t - (mid('mouth', 0.36) + k * 0.2)) / 0.9);
        const x = lerp(d.side * 185, d.c.x, ease(u)), y = lerp(d.y0, d.c.y - 4, ease(u));
        op(d.el, u > 0 && u < 1 ? Math.min(1, u * 5, (1 - u) * 4) : 0);
        tr(d.el, x, y, 1, d.side * -70);
      });
      mAmy.forEach((a, i) => {
        const u = clamp((t - (mid('mouth', 0.36) + a.k * 0.2)) / 0.9);
        const x = lerp(a.side * 185, a.c.x + a.side * 10, ease(u)), y = lerp(a.c.y + 30, a.c.y - 14, ease(u));
        const fade = 1 - P(gather, 0.7, 0.3, linear);
        op(a.el, (u > 0 ? Math.min(1, u * 4) : 0) * fade);
        tr(a.el, lerp(x, 0, gather * 0.6), lerp(y, -6, gather * 0.6), 1, Math.sin(t * 2 + i) * 15 * calm);
      });
      const bp = P(t, mid('mouth', 0.8), 0.5, pop);
      op(mBolus, clamp(bp * 2)); tr(mBolus, 0, -6 + Math.sin(t * 2.2) * 2 * calm, Math.max(0.01, bp));
      mSpark.forEach((s, i) => { const q = P(t, mid('mouth', 0.86) + i * 0.15, 0.6, linear); op(s, Math.sin(q * Math.PI)); tr(s, [-30, 26, 8][i], [-36, -26, 22][i], 0.6 + 0.6 * Math.sin(q * Math.PI)); s.upd(t); });
      op(mLeg1, P(t, mid('mouth', 0.4), 0.4, linear) * LENS[0].on);
      op(mLeg2, P(t, mid('mouth', 0.82), 0.4, linear));
    }
    // B. oesophagus
    if (lensA > 0 && LENS[1].on) {
      const by = lerp(-215, 215, P(t, at('oesophagus') - 0.05, end('oesophagus') - at('oesophagus') + 0.4, linear));
      tr(oBol, 0, by);
      const edge = side => { const pts = []; for (let y = -180; y <= 180; y += 15) { const d = y - (by - 66), sq = Math.exp(-d * d / 1100); pts.push([side * (44 - 20 * sq), y]); } return pts; };
      const wall = side => { const pts = edge(side); return 'M' + side * 90 + ',-180 ' + pts.map(p => 'L' + p[0].toFixed(1) + ',' + p[1]).join(' ') + ' L' + side * 90 + ',180 Z'; };
      oWallL.setAttribute('d', wall(-1)); oWallR.setAttribute('d', wall(1));
      oArrow.set(P(t, at('oesophagus') + 0.2, 0.6));
    }
    // C. stomach
    if (lensA > 0 && LENS[2].on) {
      const ch = calm * (0.5 + 0.5 * wave(t, 1.6));
      const inner = blobPts(126 - 10 * ch, 126 - 10 * ch, 14, t * 1.4, 0.05 + 0.03 * ch, 11).map(p => [p[0], p[1]]);
      sWall.setAttribute('d', `M-180,-180 L180,-180 L180,180 L-180,180 Z ${closedPath(inner)}`);
      let d = ''; for (let i = 0; i < 28; i++) { const a = i / 28 * TAU, r0 = 134 - 10 * ch; d += `M${(Math.cos(a) * r0).toFixed(1)},${(Math.sin(a) * r0).toFixed(1)} L${(Math.cos(a) * 158).toFixed(1)},${(Math.sin(a) * 158).toFixed(1)} `; }
      sStripes.setAttribute('d', d);
      sBub.upd(t, P(t, mid('stomach', 0.5), 0.6, linear));
      sPieces.forEach((pc, i) => { const a = pc.a + t * pc.sp * calm, r = pc.r * (1 - 0.12 * ch); tr(pc.el, Math.cos(a) * r, Math.sin(a) * r * 0.9, 1, (a * 60) % 360); });
      sPro.forEach((p, i) => { const q = P(t, mid('stomach', 0.74) + i * 0.15, 0.5, pop); const a = p.a - t * 0.5 * calm; op(p.el, clamp(q * 2)); tr(p.el, Math.cos(a) * p.r, Math.sin(a) * p.r * 0.8, Math.max(0.01, q), (a * 50) % 360); });
      op(sLeg1, P(t, mid('stomach', 0.2), 0.4, linear) * LENS[2].on);
      op(sLeg2, P(t, mid('stomach', 0.55), 0.4, linear) * LENS[2].on);
      op(sLeg3, P(t, mid('stomach', 0.74), 0.4, linear) * LENS[2].on);
    }
    // D. stomach wall
    if (lensA > 0 && LENS[3].on) {
      uBub.upd(t, 1);
      const th = P(t, mid('mucus', 0.28), 1.4, easeOut);
      const top = lerp(4, -46, th);
      const pts = []; for (let x = -180; x <= 180; x += 20) pts.push([x, top + 5 * th * Math.sin(x * 0.04 + t * 1.2 * calm)]);
      uMucus.setAttribute('d', 'M' + pts.map(p => p[0] + ',' + p[1].toFixed(1)).join(' L') + ' L180,8 L-180,8 Z');
      uShine.setAttribute('d', 'M' + pts.filter((p, i) => i > 2 && i < 8).map(p => p[0] + ',' + (p[1] + 9).toFixed(1)).join(' L'));
      op(uMucus, th > 0.01 ? 1 : 0); op(uShine, th * 0.7);
      // a protease blob drifts down; the mucus pushes it back
      const dive = P(t, at('mucus'), 1.8, easeOut), back = P(t, mid('mucus', 0.3), 1.0, ease);
      tr(uPro, -40 + 20 * Math.sin(t * 0.8), lerp(-120, -24, dive) - back * 64, 1, Math.sin(t * 2) * 12 * calm);
      op(uQ, win(t, at('mucus') + 0.2, mid('mucus', 0.3), 0.3) * (0.75 + 0.25 * wave(t, 0.8)));
      REPL.forEach((ci, j) => {
        const tc = mid('mucus', 0.62 + j * 0.11), c = cells[ci], f = fresh[j];
        const dark = P(t, tc - 0.5, 0.4, linear), lift = P(t, tc, 0.7, easeIn);
        c.body.setAttribute('fill', dark > 0 ? '#C98A9E' : '#F2A3BA');
        op(c.g, 1 - lift); tr(c.g, 0, -70 * lift);
        const gr = P(t, tc + 0.35, 0.6, easeOut);
        op(f.g, gr > 0 ? 1 : 0);
        f.g.setAttribute('transform', `translate(0 62) scale(1 ${Math.max(0.01, gr).toFixed(3)}) translate(0 -62)`);
      });
      op(uLeg1, P(t, mid('mucus', 0.32), 0.4, linear) * LENS[3].on);
      op(uLeg2, P(t, mid('mucus', 0.62), 0.4, linear) * LENS[3].on);
      op(uDays, P(t, mid('mucus', 0.72), 0.4, linear));
    }
    // E. small intestine
    if (lensA > 0 && LENS[4].on) {
      const flow = t * 70;
      iRbc.forEach((e, i) => { attr(e, 'cx', ((i * 50 + flow) % 400) - 200); attr(e, 'cy', 105 + (i % 2 ? 6 : -6)); });
      const snip = P(t, mid('small', 0.1), 1.0, linear);
      let d = '', dp = '';
      for (let i = 0; i < 3; i++) { if (snip < (i + 1) / 3) { const a = iUnits[i], b = iUnits[i + 1]; d += `M${a.x0 + 12},${a.y0} L${b.x0 - 12},${b.y0} `; } }
      for (let i = 4; i < 7; i++) { if (snip < (i - 3) / 3) { const a = iUnits[i], b = iUnits[i + 1]; dp += `M${a.x0 + 10},${a.y0} L${b.x0 - 10},${b.y0} `; } }
      iBonds.setAttribute('d', d || 'M0,0'); op(iBonds, d ? 1 : 0);
      iBondsP.setAttribute('d', dp || 'M0,0'); op(iBondsP, dp ? 1 : 0);
      tr(iAmy, lerp(-15, -130, snip), -112, 1, -20); tr(iProt, lerp(124, 10, snip), -82, 1, 15);
      op(iAmy, 1 - P(t, mid('small', 0.4), 0.4, linear)); op(iProt, 1 - P(t, mid('small', 0.4), 0.4, linear));
      iUnits.forEach((u, k) => {
        const a = P(t, mid('small', 0.42) + u.d, 1.2, ease), fl = P(t, mid('small', 0.42) + u.d + 1.2, 2.2, easeIn);
        let x = lerp(u.x0, u.x1, a), y = lerp(u.y0, 104, a);
        if (a > 0.3 && a < 1) y = lerp(u.y0, 104, a);
        x += fl * 260;
        tr(u.el, x + (a < 0.01 ? Math.sin(t * 1.5 + k) * 3 * calm : 0), y, a > 0.6 ? 0.85 : 1);
        op(u.el, 1 - P(fl, 0.7, 0.3, linear));
      });
      op(iLeg1, P(t, mid('small', 0.25), 0.4, linear) * LENS[4].on);
      op(iLeg2, P(t, mid('small', 0.62), 0.4, linear) * LENS[4].on);
    }

    /* --- right-hand notes --- */
    const nOut = 1 - P(t, at('anchovies') - 0.1, 0.45, linear);
    op(notes, nOut);
    if (nOut > 0) {
      const o1 = P(t, mid('notjust', 0.06), 0.4, linear); op(nOnly, o1);
      nStrike.set(P(t, mid('notjust', 0.2), 0.4)); op(nStrike, P(t, mid('notjust', 0.2), 0.1, linear));
      const xp = P(t, mid('notjust', 0.25), 0.4, pop); op(nCross, clamp(xp * 2)); tr(nCross, NX + nOnly.w / 2 + 28, 351, Math.max(0.01, xp));
      const sp = P(t, mid('notjust', 0.45), 0.5, pop); op(nStart, clamp(sp * 2)); tr(nStart, NX, 200, Math.max(0.01, 0.8 + 0.2 * sp));
      const fp = P(t, mid('notjust', 0.73), 0.5, pop); op(nFinish, clamp(fp * 2)); tr(nFinish, NX, 511, Math.max(0.01, 0.8 + 0.2 * fp));
      nSpan.set(P(t, mid('notjust', 0.52), 1.4)); op(nSpan, P(t, mid('notjust', 0.52), 0.2, linear));
      const wp = P(t, mid('large', 0.15), 0.5, linear); op(nWater, wp); tr(nWater, NX + (1 - wp) * 20, 589);
      const rp = P(t, mid('rectum', 0.32), 0.5, linear); op(nStore, rp); tr(nStore, NX + (1 - rp) * 20, 651);
      const ap = P(t, mid('rectum', 0.75), 0.5, linear); op(nLeave, ap); tr(nLeave, NX + (1 - ap) * 20, 697);
    }

    /* --- helpers --- */
    const hA = P(t, at('helpers') + 0.4, 0.5, linear);
    op(helpG, hA);
    const showL = P(t, mid('helpers', 0.1), 0.5, pop), showG = P(t, mid('helpers', 0.16), 0.5, pop), showP = P(t, mid('helpers', 0.22), 0.5, pop);
    const helpOn = P(t, mid('helpers', 0.05), 0.4, linear);
    op(U.help, helpOn);
    op(U.liver, clamp(showL * 2)); op(U.gall, clamp(showG * 2)); op(U.panc, clamp(showP * 2));
    op(U.bileDuct, showG); op(U.pancDuct, showP);
    const notA = P(t, at('notcanal') + 0.1, 0.5, linear);
    const pl = (tA, tB) => 1 + 0.06 * Math.sin(Math.PI * P(t, tA, tB, linear));
    tr(U.liver, 0, 0); tr(U.panc, 0, 0);
    U.liver.setAttribute('transform', `translate(-80 130) scale(${(0.6 + 0.4 * showL) * pl(mid('helpers', 0.36), 1.2)}) translate(80 -130)`);
    U.panc.setAttribute('transform', `translate(40 240) scale(${(0.6 + 0.4 * showP) * pl(mid('helpers', 0.74), 1.2)}) translate(-40 -240)`);
    const gallFull = P(t, mid('helpers', 0.5), 1.4, ease);
    U.gall.setAttribute('transform', `translate(-70 160) rotate(28) scale(${((0.6 + 0.4 * showG) * (1 + 0.15 * gallFull)).toFixed(3)})`);
    [U.liverLine, U.gallLine, U.pancLine].forEach(e => e.setAttribute('stroke-dasharray', notA > 0.5 ? '7 6' : 'none'));
    [U.liverFill, U.gallFill, U.pancFill].forEach(e => op(e, 1 - 0.55 * notA));
    op(hLiver, P(t, mid('helpers', 0.36), 0.4, linear)); op(hGall, P(t, mid('helpers', 0.54), 0.4, linear)); op(hPanc, P(t, mid('helpers', 0.73), 0.4, linear));
    op(hLiver.note, P(t, mid('helpers', 0.42), 0.4, linear)); op(hGall.note, P(t, mid('helpers', 0.6), 0.4, linear)); op(hPanc.note, P(t, mid('helpers', 0.82), 0.4, linear));
    [hLiver, hGall, hPanc].forEach((h, i) => { const q = P(t, mid('notcanal', 0.12 + i * 0.09), 0.4, pop); op(h.cross, clamp(q * 2)); tr(h.cross, h.cx, h.cy, Math.max(0.01, q)); });
    op(hHelp, win(t, mid('helpers', 0.08), at('notcanal') + 0.1, 0.35));
    const np = P(t, mid('notcanal', 0.1), 0.5, pop); op(hNot, clamp(np * 2)); tr(hNot, 0, 0, Math.max(0.01, 0.85 + 0.15 * np));
    // bile: liver -> gall bladder -> duct -> small intestine; enzymes: pancreas -> duct
    bileDrops.forEach((b, k) => {
      const u1 = clamp((t - (mid('helpers', 0.42) + k * 0.3)) / 0.9), u2 = clamp((t - (mid('helpers', 0.66) + k * 0.3)) / 1.0);
      let p = null;
      if (u1 > 0 && u1 < 1) p = U.liverToGall.at(u1);
      else if (u2 > 0 && u2 < 1) p = U.bileDuctS.at(u2);
      op(b, p ? 1 : 0); if (p) tr(b, p[0], p[1], 1);
    });
    pancBlobs.forEach((b, k) => {
      const u = ((t - mid('helpers', 0.82)) / 1.6 + k / 4) % 1;
      const on = t > mid('helpers', 0.82) && t < at('notcanal') + 0.2;
      const p = U.pancDuctS.at(u);
      op(b, on ? Math.min(1, u * 6, (1 - u) * 6) : 0); tr(b, p[0], p[1], 1, (t * 90) % 360);
    });
    // food dots run along the canal, past the helpers
    const rOn = win(t, mid('helpers', 0.15), mid('helpers', 0.34), 0.3) + P(t, mid('notcanal', 0.25), 0.4, linear);
    route.forEach((r, k) => {
      const u = ((t * 0.16) + k / 6) % 1, s = lerp(U.sAt('oes', 0.4), U.sAt('small', 0.35), u);
      const p = U.pos(s);
      op(r, clamp(rOn) * Math.min(1, u * 8, (1 - u) * 8) * U.vis(s)); tr(r, p[0], p[1]);
    });
  };
});

/* Chapter 7, Acids and carbonates: milky limewater.
   Calcium carbonate (chalk, limestone) fizzes in acid -> acid + metal carbonate -> salt + water + carbon
   dioxide, filled in for hydrochloric acid + calcium carbonate -> three products; the gas is carbon dioxide,
   so a lit splint just goes out -> showpiece: the gas bubbles through limewater, which turns milky -> zoom:
   a fine white precipitate of calcium carbonate -> two fizzing powders told apart by their gases
   -> Pop = Hydrogen, Milky = CO₂. */
scene('carbonates', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette (storyboard) ---------- */
  const ACID = '#E8424F', SALT = C.good, INK = '#13222D', CLEAR = '#CFE7F5', MILKY = '#EEF3F6', WOOD = '#C8A165', EMBER = '#FF6A2A';
  const CHALK = '#E6E1D6';

  /* ---------- shared gas-test art (drawn the same way in the metals and oxygen chapters) ---------- */
  /* wooden splint, 16 x 220 at k = 1. Its tip is the origin and the stick runs down local +y.
     g.place(x, y, deg): tip at (x, y), stick turned by deg (0 = tip up, 180 = tip down); flame and smoke stay upright.
     g.set(flame, ember, char, smoke): flame size (1 = lit, more = flaring), glowing ember, charred tip, smoke wisp.
     g.upd(t) flickers; call it after g.set. */
  function splint(parent, k) {
    k = k || 1;
    const g = G(parent), stick = G(g), fx = G(g), body = G(stick);
    if (k !== 1) tr(body, 0, 0, k);
    E('rect', { x: -8, y: 0, width: 16, height: 220, rx: 5, fill: WOOD, stroke: '#8E6B3A', 'stroke-width': 2 }, body);
    E('line', { x1: -2, y1: 44, x2: -2, y2: 204, stroke: '#A8834D', 'stroke-width': 2 }, body);
    const charC = E('rect', { x: -8, y: 0, width: 16, height: 26, rx: 5, fill: '#2E241C' }, body);
    const emb = E('rect', { x: -8, y: 0, width: 16, height: 15, rx: 5, fill: EMBER }, body);
    const eHalo = E('circle', { r: 30 * k, fill: glow(EMBER) }, fx);
    const smoke = E('path', { fill: 'none', stroke: '#9AA6B0', 'stroke-width': 5 * k, 'stroke-linecap': 'round' }, fx);
    const fl = G(fx);
    E('ellipse', { cx: 0, cy: -36, rx: 50, ry: 68, fill: glow('#FFB347') }, fl);
    E('path', { d: 'M0,6 C-19,-6 -21,-42 0,-86 C21,-42 19,-6 0,6 Z', fill: '#FF9A3C' }, fl);
    E('path', { d: 'M0,3 C-9,-5 -10,-26 0,-52 C10,-26 9,-5 0,3 Z', fill: '#FFE07A' }, fl);
    let F = 0, Em = 0, Sm = 0;
    g.place = (x, y, deg) => {
      stick.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
      fx.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    g.set = (flame, ember, ch, sm) => { F = flame; Em = ember; Sm = sm; op(charC, ch); op(emb, ember); op(eHalo, ember * 0.95); op(fl, clamp(flame * 3)); op(smoke, sm * 0.8); };
    g.upd = t => {
      if (F > 0) { const a = 0.06 * calm, b = 0.11 * calm; fl.setAttribute('transform', `scale(${(k * F * (1 + a * Math.sin(t * 9))).toFixed(3)} ${(k * F * (1 + b * Math.sin(t * 13 + 1))).toFixed(3)})`); }
      if (Em > 0) tr(eHalo, 0, 0, 0.75 + 0.35 * Em + 0.12 * wave(t, 0.8) * calm);
      if (Sm > 0) { const pts = []; for (let i = 0; i <= 8; i++) pts.push([Math.sin(i * 0.8 - t * 2.4) * (2 + i * 2.2) * k, (-12 - i * 15) * k]); smoke.setAttribute('d', openPath(pts)); }
    };
    g.set(0, 0, 0, 0); g.place(0, 0, 0);
    return g;
  }
  /* POP: an 8-point burst (energy yellow, heat-orange edge) with "POP!" and short radial lines. g.set(p) springs it in */
  function popBurst(parent, R) {
    R = R || 84;
    const g = G(parent), star = G(g), rays = G(g);
    let d = '';
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? R * 0.64 : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('circle', { r: R * 1.45, fill: glow(C.energy) }, star);
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.heat, 'stroke-width': Math.max(3, R * 0.06), 'stroke-linejoin': 'round' }, star);
    T(star, 0, R * 0.19, 'POP!', { size: Math.round(R * 0.52), weight: 700, anchor: 'middle', fill: '#6B2A00' });
    const rl = [];
    for (let i = 0; i < 8; i++) rl.push({ el: E('line', { stroke: C.energy, 'stroke-width': Math.max(3, R * 0.07), 'stroke-linecap': 'round' }, rays), a: -Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4 });
    g.set = p => {
      p = clamp(p);
      tr(star, 0, 0, Math.max(0.01, pop(p))); op(star, clamp(p * 4));
      rl.forEach(o => {
        const r1 = R * (1.08 + 0.22 * p), r2 = R * (1.2 + 0.42 * p), c = Math.cos(o.a), s = Math.sin(o.a);
        attr(o.el, 'x1', c * r1); attr(o.el, 'y1', s * r1); attr(o.el, 'x2', c * r2); attr(o.el, 'y2', s * r2);
      });
      op(rays, clamp(p * 4) * (1 - 0.55 * clamp((p - 0.5) / 0.5)));
    };
    g.set(0);
    return g;
  }
  /* limewater: a kit test tube whose clear liquid turns milky; g.milk(m 0..1) */
  function limeTube(parent, w, h, level) {
    const g = testTube(parent, w, h, { level, liquid: CLEAR, opacity: 0.25 });
    const c0 = [0xCF, 0xE7, 0xF5], c1 = [0xEE, 0xF3, 0xF6];
    g.milk = m => {
      m = clamp(m);
      g.liquid.setAttribute('fill', '#' + c0.map((v, i) => Math.round(lerp(v, c1[i], m)).toString(16).padStart(2, '0')).join(''));
      g.liquid.setAttribute('opacity', lerp(0.25, 0.9, m).toFixed(3));
    };
    g.milk(0);
    return g;
  }

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => {
      if (typeof s === 'string') s = [s];
      const ts = E('tspan', { fill: s[1], 'font-weight': s[2] }, t); ts.textContent = s[0];
      if (s[3]) { ts.setAttribute('font-size', Math.round((o.size || 30) * 0.66)); ts.setAttribute('dy', Math.round((o.size || 30) * 0.24)); }
    });
    return t;
  }
  /* chemical formula with real subscripts: 'CO2' -> CO₂ */
  function chem(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 30, sub = Math.round(size * 0.66), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    let low = false;
    str.replace(/(\d+)|([^\d]+)/g, (m, dig, txt, idx) => {
      const isSub = !!dig && idx > 0 && /[A-Za-z)]/.test(str[idx - 1]);
      const ts = E('tspan', {}, t); ts.textContent = m;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
      return m;
    });
    return t;
  }
  /* wooden test-tube rack: the back (posts, shelf) goes behind the tubes, the front (top rail) in front */
  function rackBack(parent, x0, x1, yTop, yBot) {
    const g = G(parent);
    E('rect', { x: x0, y: yTop - 6, width: 16, height: yBot - yTop + 6, rx: 4, fill: '#7A5236' }, g);
    E('rect', { x: x1 - 16, y: yTop - 6, width: 16, height: yBot - yTop + 6, rx: 4, fill: '#7A5236' }, g);
    E('rect', { x: x0 - 12, y: yBot, width: x1 - x0 + 24, height: 18, rx: 5, fill: '#A87449', stroke: '#6E4A2E', 'stroke-width': 2 }, g);
    return g;
  }
  function rackFront(parent, x0, x1, yTop) {
    const g = G(parent);
    E('rect', { x: x0 - 12, y: yTop, width: x1 - x0 + 24, height: 18, rx: 5, fill: '#B98252', stroke: '#6E4A2E', 'stroke-width': 2 }, g);
    return g;
  }
  /* a layer inside a kit test tube: in front of the liquid, behind the glass */
  function inside(tb) { const g = E('g', {}); tb.insertBefore(g, tb.childNodes[3]); return g; }
  /* rubber bung with a glass delivery tube through points (bung at pts[0]) */
  function deliveryTube(parent, pts) {
    const g = G(parent), d = 'M' + pts.map(p => p.join(',')).join(' L');
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': 12, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const [bx, by] = pts[0];
    E('path', { d: `M${bx - 50},${by - 26} L${bx + 50},${by - 26} L${bx + 40},${by + 12} L${bx - 40},${by + 12} Z`, fill: ball('#A9483A', '#6E2A21'), stroke: '#C86A58', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: bx - 4, y: by - 26, width: 8, height: 38, fill: '#11303D', opacity: 0.55 }, g);
    return g;
  }
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  /* lumps of chalky calcium carbonate, or a powder heap */
  function lumps(parent, col, dk, seed) {
    const g = G(parent);
    [[-16, 4, 11], [3, -3, 12], [18, 6, 9.5], [0, 10, 8]].forEach(([x, y, r], i) => E('path', { d: closedPath(blobPts(r, r * 0.8, 8, 0, 0.22, seed + i)), transform: `translate(${x} ${y})`, fill: ball(col, dk), stroke: dk, 'stroke-width': 1.5 }, g));
    return g;
  }
  function heap(parent, col, dk) {
    const g = G(parent);
    E('path', { d: 'M-30,14 Q-22,-8 0,-12 Q22,-8 30,14 Z', fill: ball(col, dk), stroke: dk, 'stroke-width': 1.5 }, g);
    return g;
  }
  /* equation slot: a chip with a general word that fills in with a specific one.
     g.set(p, labA): p 0 = the general word; 1 = the specific word in a wider chip, the general word a small label above */
  function slot(parent, gen, spec, fill, ink, o) {
    o = o || {};
    const g = G(parent), H = 52, same = gen === spec;
    const wG = Math.ceil(textWidth(gen, 30, FD, 700) + 42), wS = same ? wG : Math.ceil(textWidth(spec, 28, FD, 700) + 38);
    g.halo = E('rect', { x: -wS / 2 - 14, y: -H / 2 - 14, width: wS + 28, height: H + 28, rx: H / 2 + 14, fill: 'none', stroke: o.haloC || C.energy, 'stroke-width': 4 }, g);
    const box = E('rect', { y: -H / 2, height: H, rx: H / 2, fill, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 2 }, g);
    const tG = T(g, 0, 10.5, gen, { size: 30, weight: 700, anchor: 'middle', fill: ink });
    let tS = null, lab = null;
    if (!same) {
      lab = T(g, 0, -H / 2 - 14, gen, { size: 26, weight: 600, anchor: 'middle', fill: o.labFill || fill });
      tS = T(g, 0, 10, spec, { size: 28, weight: 700, anchor: 'middle', fill: ink });
    }
    g.wG = wG; g.wS = wS;
    g.width = p => lerp(wG, wS, clamp(p));
    g.set = (p, labA) => {
      p = clamp(p); const w = g.width(p);
      attr(box, 'x', -w / 2); attr(box, 'width', w);
      if (same) return;
      op(tG, 1 - clamp(p * 2.5)); op(tS, clamp((p - 0.3) / 0.5));
      op(lab, clamp((p - 0.35) / 0.5) * (labA === undefined ? 1 : labA)); tr(lab, 0, (1 - p) * 30);
    };
    op(g.halo, 0); g.set(0);
    return g;
  }
  function opPlus(parent) { const g = G(parent); T(g, 0, 13, '+', { size: 38, weight: 600, anchor: 'middle', fill: C.muted }); g.w = 24; return g; }
  function opArrow(parent) { const g = G(parent); arrow(g, -25, 0, 25, 0, { color: C.ink, width: 6 }); g.w = 54; return g; }
  function rowX(ws, cx, gap) { let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2; return ws.map(w => { const c = x + w / 2; x += w + gap; return c; }); }
  /* magnifier: dashed callout lines from (sx, sy) to a circle at (cx, cy); content goes in .inner (stage coords, clipped) */
  function zoomBubble(parent, cx, cy, r, sx, sy, id, fill) {
    const g = G(parent);
    const a = Math.atan2(cy - sy, cx - sx), b = Math.acos(r / Math.hypot(cx - sx, cy - sy)), back = a + Math.PI;
    const p1 = [cx + r * Math.cos(back + b), cy + r * Math.sin(back + b)], p2 = [cx + r * Math.cos(back - b), cy + r * Math.sin(back - b)];
    E('path', { d: `M${sx},${sy} L${p1[0].toFixed(1)},${p1[1].toFixed(1)} M${sx},${sy} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 7', fill: 'none' }, g);
    E('circle', { cx: sx, cy: sy, r: 24, fill: 'none', stroke: C.muted, 'stroke-width': 3 }, g);
    E('circle', { cx, cy, r, fill: fill || '#0B2230', stroke: '#CFE7F5', 'stroke-width': 5 }, g);
    const cp = E('clipPath', { id }, defs()); E('circle', { cx, cy, r: r - 3 }, cp);
    return { g, inner: G(g, { 'clip-path': `url(#${id})` }) };
  }

  /* ================= A. the apparatus: acid + calcium carbonate, later limewater ================= */
  const App = G(root);
  const AX = 250, AY = 555, AW = 84, AH = 270, AM = AY - AH / 2;        // acid tube; mouth at (250, 420)
  const BX = 560, BLEV = 0.55;                                        // limewater tube
  const DT = [[AX, AM + 12], [AX, 340], [BX, 340], [BX, AY + 86]];   // delivery tube (bung first)
  const rkB = rackBack(App, 170, 650, AM + 32, AY + AH / 2);
  const tA = G(App); tr(tA, AX, AY);
  const tbA = testTube(tA, AW, AH, { level: 0.45, liquid: CLEAR, opacity: 0.3 });
  const inA = inside(tbA);
  const bubA = bubbles(inA, -30, 22, 60, 88, { n: 14, r: 6, speed: 0.7, seed: 21 });
  const lumpA = G(inA); lumps(lumpA, CHALK, '#A79F90', 40);
  const tB = G(App); tr(tB, BX, AY);
  const tbB = limeTube(tB, AW, AH, BLEV);
  const inB = inside(tbB);
  const bubB = bubbles(inB, -20, -2, 40, 84, { n: 12, r: 5.5, speed: 0.6, seed: 23 });
  const rkF = rackFront(App, 170, 650, AM + 32);
  // labels
  const lbAcid = labelLine(App, 360, 584, AX + 30, 588, 'dilute acid', { size: 30, anchor: 'start' });
  const lbCarb = labelLine(App, 360, 662, AX + 30, 664, 'calcium carbonate', { size: 30, anchor: 'start', fill: CHALK });
  const lbLime = G(App);
  labelLine(lbLime, 680, 600, BX + 34, 604, 'limewater', { size: 32, anchor: 'start' });
  T(lbLime, 680, 640, '(calcium hydroxide solution)', { size: 26, weight: 500, fill: C.muted });
  lbAcid.set(0); lbCarb.set(0); op(lbLime, 0);
  // gas: carbon dioxide rising from the acid tube, then through the delivery tube
  const co2Up = [0, 1, 2, 3].map(k => ({ m: molCO2(App, 9), ph: k / 4, sw: (k % 2 ? 1 : -1) * (5 + k * 3) }));
  const tagCO2 = G(App);
  chem(tagCO2, 172, 352, 'CO2', { size: 30, fill: C.co2 });
  E('line', { x1: 196, y1: 344, x2: 230, y2: 360, stroke: C.muted, 'stroke-width': 2.5 }, tagCO2);
  const dtG = G(App); deliveryTube(dtG, DT);
  const co2Path = [0, 1, 2].map(() => molCO2(App, 8));
  const whichGas = chip(App, 'which gas?', { size: 28, fill: C.card2, stroke: C.muted, sw: 2 }); tr(whichGas, 390, 360);
  // the lit splint that just goes out
  const spA = splint(App);
  const noPop = G(root);
  { const c = chip(noPop, 'no pop', { size: 30, fill: '#3A1820', stroke: C.bad, color: '#FFB3BB', sw: 3 }); const x = cross(noPop, 14); tr(x, c.w / 2 + 30, 0); }
  // chalk and limestone
  const src = G(root);
  T(src, 925, 300, 'calcium carbonate is found in', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const chalkG = G(src); tr(chalkG, 815, 420, 1, -16);
  E('rect', { x: -80, y: -18, width: 160, height: 36, rx: 12, fill: ball('#FFFFFF', '#CFC8B8'), stroke: '#BDB5A4', 'stroke-width': 2.5 }, chalkG);
  E('rect', { x: 52, y: -18, width: 28, height: 36, rx: 10, fill: '#D9D2C2' }, chalkG);
  const stoneG = G(src); tr(stoneG, 1035, 418);
  E('path', { d: closedPath(blobPts(84, 56, 12, 0, 0.14, 9)), fill: ball('#DCD3BF', '#A0977F'), stroke: '#8E8571', 'stroke-width': 3 }, stoneG);
  [[-40, -12, 5], [22, -24, 4], [38, 18, 5], [-14, 24, 4], [-52, 22, 3.5]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#9C927C' }, stoneG));
  E('path', { d: 'M8,4 a6,6 0 1,1 6,6 a10,10 0 1,1 -10,-10 a14,14 0 0,1 14,14', fill: 'none', stroke: '#8E8571', 'stroke-width': 3, 'stroke-linecap': 'round' }, stoneG);
  const chalkN = T(src, 815, 515, 'chalk', { size: 30, weight: 600, anchor: 'middle' });
  const stoneN = T(src, 1035, 515, 'limestone', { size: 30, weight: 600, anchor: 'middle' });
  // the test header and the clear -> milky card
  const hdr = chip(root, 'Test for carbon dioxide', { size: 28, fill: 'rgba(10,27,39,0.78)', stroke: C.line, sw: 2, color: C.energy }); tr(hdr, 1160 - hdr.w / 2, 60);
  const card2 = G(root);
  card(card2, 680, 300, 300, 74, { fill: C.card, stroke: C.line });
  rich(card2, 830, 349, [['clear', '#8CCDF0', 700], [' → ', C.muted], ['milky', '#FFFFFF', 800]], { size: 36, anchor: 'middle' });

  /* ================= the equation: pattern in one row, the example in two ================= */
  const eqG = G(root);
  const R1 = 170, R2 = 284;
  const s0 = slot(eqG, 'acid', 'hydrochloric acid', ACID, '#FFFFFF', { labFill: '#FF7A86' });
  const s1 = slot(eqG, 'metal carbonate', 'calcium carbonate', CHALK, INK);
  const s2 = slot(eqG, 'salt', 'calcium chloride', SALT, INK);
  const s3 = slot(eqG, 'water', 'water', C.water, '#06283A');
  const s4 = slot(eqG, 'carbon dioxide', 'carbon dioxide', C.co2, INK);
  const EQI = [
    { g: s0, s: s0, at: 0.02 }, { g: opPlus(eqG), at: 0.12 }, { g: s1, s: s1, at: 0.2 }, { g: opArrow(eqG), at: 0.37 },
    { g: s2, s: s2, at: 0.44 }, { g: opPlus(eqG), at: 0.56 }, { g: s3, s: s3, at: 0.62 }, { g: opPlus(eqG), at: 0.71 }, { g: s4, s: s4, at: 0.77 },
  ];
  const wOf = (it, spec) => (it.s ? (spec ? it.s.wS : it.s.wG) : it.g.w);
  const pat = rowX(EQI.map(it => wOf(it, false)), 600, 14).map(x => [x, R1]);
  const ex1 = rowX(EQI.slice(0, 4).map(it => wOf(it, true)), 600, 14).map(x => [x, R1]);
  const ex2 = rowX(EQI.slice(4).map(it => wOf(it, true)), 600, 14).map(x => [x, R2]);
  const exl = ex1.concat(ex2);
  const badges = [4, 6, 8].map((k, n) => {
    const g = G(eqG); const s = EQI[k].s;
    E('circle', { r: 19, fill: C.energy, stroke: C.bg0, 'stroke-width': 3 }, g);
    T(g, 0, 9, String(n + 1), { size: 26, weight: 700, anchor: 'middle', fill: C.bg0 });
    tr(g, exl[k][0] + s.wS / 2 - 8, R2 - 30);
    return g;
  });

  /* ================= why: a fine white precipitate ================= */
  const ZX = 880, ZY = 372, ZR = 180;
  const zoom = zoomBubble(root, ZX, ZY, ZR, BX, 470, 'am-carb-zoom', '#22404F');
  const sr = rng(77), specks = [];
  for (let k = 0; k < 46; k++) {
    const a = sr() * TAU, rad = Math.sqrt(sr()) * (ZR - 20);
    specks.push({ el: E('circle', { r: (2.2 + sr() * 2.6).toFixed(1), fill: '#FFFFFF', opacity: 0.92 }, zoom.inner), x: ZX + Math.cos(a) * rad, y: ZY + Math.sin(a) * rad * 0.9, sw: 10 + sr() * 26, ph: sr() * TAU, sp: 0.5 + sr() * 0.8, k: 0.55 + sr() * 0.45, bx: ZX + (sr() - 0.5) * 160 });
  }
  const zLab = G(zoom.g);
  T(zLab, ZX, 600, 'calcium carbonate', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  rich(zLab, ZX, 640, [['(a white ', C.muted], ['precipitate', C.energy, 700], [')', C.muted]], { size: 28, anchor: 'middle' });
  op(zoom.g, 0);

  /* ================= apart: two powders, two gases ================= */
  const Ap = G(root);
  const PX = 230, QX = 640, RX = 930, PY = 460, PH = 260, PM = PY - PH / 2;   // mouths at y = 330
  const DQ = [[QX, PM + 12], [QX, 236], [RX, 236], [RX, PY + 84]];
  const apRk = rackBack(Ap, 150, 1010, PM + 30, PY + PH / 2);
  const mkTube = (x, lime) => { const g = G(Ap); tr(g, x, PY); const tb = lime ? limeTube(g, 80, PH, 0.55) : testTube(g, 80, PH, { level: 0.45, liquid: CLEAR, opacity: 0.3 }); return { g, tb, inn: inside(tb) }; };
  const tP = mkTube(PX), tQ = mkTube(QX), tR = mkTube(RX, true);
  const bubP = bubbles(tP.inn, -28, 22, 56, 82, { n: 12, r: 5.5, speed: 0.75, seed: 31 });
  const bubQ = bubbles(tQ.inn, -28, 22, 56, 82, { n: 12, r: 5.5, speed: 0.75, seed: 33 });
  const bubR = bubbles(tR.inn, -20, -2, 40, 80, { n: 10, r: 5, speed: 0.6, seed: 35 });
  tr(heap(tP.inn, '#D5DADF', '#8E979F'), 0, PH / 2 - 30); tr(heap(tQ.inn, '#F1EEE6', '#A79F90'), 0, PH / 2 - 30);
  rackFront(Ap, 150, 1010, PM + 30);
  const dq = G(Ap); deliveryTube(dq, DQ);
  const co2Q = [0, 1, 2].map(() => molCO2(Ap, 8));
  const spP = splint(Ap);
  const popP = popBurst(Ap, 74); tr(popP, PX - 6, PM - 40);
  const flashP = E('circle', { cx: PX, cy: PM - 30, r: 140, fill: glow('#FFF6C8') }, Ap);
  Ap.insertBefore(flashP, popP);
  const chA = chip(Ap, 'powder A', { size: 28, fill: C.card2, stroke: C.line, sw: 2 }); tr(chA, PX, 642);
  const chB = chip(Ap, 'powder B', { size: 28, fill: C.card2, stroke: C.line, sw: 2 }); tr(chB, QX, 642);
  const resA = rich(Ap, PX, 652, [['metal', '#E3E8EE', 700], [': hydrogen', '#FFFFFF']], { size: 32, anchor: 'middle' });
  const resB = rich(Ap, (QX + RX) / 2, 652, [['carbonate', CHALK, 700], [': carbon dioxide', C.co2]], { size: 32, anchor: 'middle' });
  const bothFizz = chip(Ap, 'both fizz', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy, sw: 2.5 }); tr(bothFizz, 435, 470);

  /* ================= hook: Pop = Hydrogen, Milky = CO₂ ================= */
  const Hk = G(root);
  const remember = chip(Hk, 'Remember', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy, sw: 3 }); tr(remember, 600, 150);
  const hkPop = popBurst(Hk, 108); tr(hkPop, 360, 382);
  const hkTubeG = G(Hk); tr(hkTubeG, 840, 392);
  const hkTube = limeTube(hkTubeG, 104, 300, 0.62); hkTube.milk(1);
  { const inn = inside(hkTube), hr = rng(5); for (let k = 0; k < 16; k++) E('circle', { cx: ((hr() - 0.5) * 70).toFixed(1), cy: (-30 + hr() * 150).toFixed(1), r: (2 + hr() * 2).toFixed(1), fill: '#FFFFFF' }, inn); }
  const hkL = rich(Hk, 360, 630, [['Pop', C.energy, 700], [' = ', C.muted], ['Hydrogen', '#FFFFFF', 700]], { size: 44, anchor: 'middle' });
  const hkR = rich(Hk, 840, 630, [['Milky', '#FFFFFF', 700], [' = ', C.muted], ['CO', C.co2, 700], ['2', C.co2, 700, true]], { size: 44, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    const tUp = mid('three', 0.45);
    const up = P(t, tUp, 0.9);
    /* ---------- A: the apparatus ---------- */
    const aA = Math.min(P(t, S.first - 0.1, 0.3, linear), 1 - P(t, at('apart') - 0.55, 0.4, linear));
    op(App, aA);
    if (aA > 0) {
      tr(App, 0, -150 * up);
      // lumps drop in and fizz
      const fall = P(t, mid('carb', 0.1), 0.8, easeIn), land = mid('carb', 0.1) + 0.8;
      tr(lumpA, 0, lerp(-AH / 2 - 84, AH / 2 - 26, fall), lerp(1.2, 1, fall), lerp(-16, 0, fall));
      op(lumpA, P(t, at('carb'), 0.3, linear));
      bubA.upd(t, P(t, land, 0.8, linear));
      const lOff = 1 - P(t, at('lime') - 0.1, 0.4, linear);
      lbAcid.set(P(t, mid('carb', 0.04), 0.4, linear) * lOff);
      lbCarb.set(P(t, mid('carb', 0.2), 0.4, linear) * lOff);
      op(whichGas, win(t, mid('carb', 0.8), at('eq') + 0.2, 0.35));
      // carbon dioxide rises from the open tube (until the bung goes in)
      const cT = mid('three', 0.22), cOn = P(t, cT, 0.5, linear) * (1 - P(t, at('lime') + 0.1, 0.4, linear));
      co2Up.forEach((o, k) => {
        if (cOn <= 0) { op(o.m, 0); return; }
        const u = (((t - cT) / 2.8 + o.ph) % 1 + 1) % 1;
        tr(o.m, AX + Math.sin(u * 4 + k) * 6 * calm + o.sw * u, lerp(AY + 4, AM - 70, u), 1, (u * 120 + k * 50) % 360);
        op(o.m, cOn * Math.min(1, u * 8, (1 - u) * 5));
      });
      op(tagCO2, P(t, mid('three', 0.3), 0.4, linear) * (1 - P(t, at('lime') - 0.1, 0.4, linear)));
      // the lit splint goes out
      const sIn = P(t, mid('three', 0.52), 1.2, ease), sA = P(t, mid('three', 0.5), 0.3, linear) * (1 - P(t, at('lime') + 0.1, 0.4, linear));
      op(spA, sA);
      if (sA > 0) {
        const tOut = mid('three', 0.8);
        const flame = 1 - P(t, tOut, 0.6, easeIn), ember = 0.6 * Math.sin(Math.PI * P(t, tOut + 0.3, 1.2, linear));
        spA.place(lerp(600, AX + 20, sIn), lerp(372, AM - 8, sIn), lerp(-96, -100, sIn));
        spA.set(flame, ember, 1, P(t, tOut + 0.4, 0.6, linear) * (1 - P(t, tOut + 3.0, 1.5, linear)));
        spA.upd(t);
      }
      const np = P(t, mid('three', 0.7), 0.45, pop);
      op(noPop, clamp(np * 2) * (1 - P(t, at('lime'), 0.4, linear))); tr(noPop, 640, 250, 0.7 + 0.3 * np);
      // limewater: the bung and delivery tube connect, the gas bubbles through, the limewater turns milky
      const bA = P(t, at('lime') + 0.1, 0.5, linear);
      op(tB, bA);
      const dIn = P(t, mid('lime', 0.08), 0.6, easeOut);
      op(dtG, dIn); tr(dtG, 0, -50 * (1 - dIn));
      const gas = P(t, mid('lime', 0.16) + 0.4, 0.4, linear) * (1 - P(t, at('apart') - 0.6, 0.3, linear));
      co2Path.forEach((m, k) => {
        if (gas <= 0) { op(m, 0); return; }
        const u = (((t - mid('lime', 0.16)) / 2.4 + k / 3) % 1 + 1) % 1, p = along(DT, u);
        tr(m, p[0], p[1]); op(m, gas * Math.min(1, u * 8, (1 - u) * 8));
      });
      bubB.upd(t, gas);
      tbB.milk(P(t, mid('lime', 0.42), end('lime') - mid('lime', 0.42) + 0.6, ease));
      op(lbLime, P(t, mid('lime', 0.28), 0.4, linear) * (1 - P(t, at('why') - 0.25, 0.35, linear)));
    }
    op(src, win(t, mid('carb', 0.36), at('eq') - 0.05, 0.4));
    if (t < at('eq') + 0.5) {
      const pc = P(t, mid('carb', 0.4), 0.5, pop), ps = P(t, mid('carb', 0.48), 0.5, pop);
      tr(chalkG, 815, 420, Math.max(0.01, pc), -16); op(chalkN, P(t, mid('carb', 0.42), 0.4, linear));
      tr(stoneG, 1035, 418, Math.max(0.01, ps)); op(stoneN, P(t, mid('carb', 0.5), 0.4, linear));
    }
    op(hdr, win(t, at('lime') - 0.1, at('apart') - 0.2, 0.4));
    const cp = P(t, mid('lime', 0.76), 0.5, easeOut);
    op(card2, cp * (1 - P(t, at('why') - 0.25, 0.35, linear))); tr(card2, (1 - cp) * 24, 0);

    /* ---------- the equation ---------- */
    const eA = win(t, at('eq') - 0.05, mid('three', 0.48), 0.45);
    op(eqG, eA);
    if (eA > 0) {
      const pl = P(t, mid('example', 0.02), 0.9);
      const ps = [P(t, mid('example', 0.12), 0.6), 0, P(t, mid('example', 0.32), 0.6), 0, P(t, mid('example', 0.53), 0.6), 0, 0, 0, 0];
      const pulseAt = { 4: 0.03, 6: 0.09, 8: 0.15 };
      EQI.forEach((it, i) => {
        const a = P(t, mid('eq', it.at), 0.45, pop);
        let s = 0.6 + 0.4 * a;
        if (it.s === s3) s += 0.1 * Math.sin(Math.PI * P(t, mid('example', 0.74), 0.5, linear));
        if (it.s === s4) s += 0.1 * Math.sin(Math.PI * P(t, mid('example', 0.86), 0.5, linear));
        if (pulseAt[i] !== undefined) s += 0.12 * Math.sin(Math.PI * P(t, mid('three', pulseAt[i]), 0.5, linear));
        tr(it.g, lerp(pat[i][0], exl[i][0], pl), lerp(pat[i][1], exl[i][1], pl), s); op(it.g, clamp(a * 2));
        if (it.s) it.s.set(ps[i], 1);
      });
      badges.forEach((b, n) => { const p = P(t, mid('three', [0.03, 0.09, 0.15][n]), 0.4, pop); op(b, clamp(p * 2)); tr(b, exl[[4, 6, 8][n]][0] + EQI[[4, 6, 8][n]].s.wS / 2 - 8, R2 - 30, Math.max(0.01, p)); });
      op(s4.halo, P(t, mid('three', 0.22), 0.4, linear) * (0.7 + 0.3 * wave(t, 1.2) * calm));
    }

    /* ---------- why: specks swirl and settle ---------- */
    const zA = win(t, at('why') - 0.3, at('apart') - 0.15, 0.4);
    op(zoom.g, zA);
    if (zA > 0) {
      // they swirl, then sink: some settle on the bottom while others still hang in the liquid, cloudy
      const settle = P(t, at('why') - 0.3, 5.4, ease);
      specks.forEach((s, k) => {
        const q = clamp(settle * lerp(0.3, 1.1, (s.k - 0.55) / 0.45)), sw = s.sw * (1 - q) * calm;
        const x = lerp(s.x, s.bx, q) + Math.cos(t * s.sp + s.ph) * sw, y = lerp(s.y, ZY + ZR - 26 - (k % 6) * 5, q) + Math.sin(t * s.sp * 1.3 + s.ph) * sw * 0.6;
        attr(s.el, 'cx', x); attr(s.el, 'cy', y);
      });
    }

    /* ---------- apart ---------- */
    const aP = win(t, at('apart') - 0.15, at('hook') - 0.1, 0.4);
    op(Ap, aP);
    if (aP > 0) {
      const f0 = at('apart') - 0.2;
      bubP.upd(t, P(t, f0, 0.6, linear)); bubQ.upd(t, P(t, f0, 0.6, linear));
      op(bothFizz, win(t, mid('apart', 0.08), mid('apart', 0.45), 0.35));
      // powder A: the lit splint pops
      const sIn = P(t, mid('apart', 0.4), 1.1, ease), tPop = mid('apart', 0.56);
      op(spP, P(t, mid('apart', 0.38), 0.3, linear));
      spP.place(lerp(560, PX + 24, sIn), lerp(150, PM - 8, sIn), lerp(-112, -126, sIn));
      spP.set(1, 0, 1, 0); spP.upd(t);
      popP.set(P(t, tPop, 0.5, linear));
      op(flashP, Math.sin(Math.PI * P(t, tPop - 0.05, 0.4, linear)) * 0.9);
      // powder B: its gas goes through limewater, which turns milky
      const gas = P(t, f0 + 0.4, 0.4, linear);
      co2Q.forEach((m, k) => { const u = (((t - f0) / 2.4 + k / 3) % 1 + 1) % 1, p = along(DQ, u); tr(m, p[0], p[1]); op(m, gas * Math.min(1, u * 8, (1 - u) * 8)); });
      bubR.upd(t, gas);
      tR.tb.milk(P(t, mid('apart', 0.66), 2.2, ease));
      // the reveal
      const ra = P(t, mid('apart', 0.6), 0.4, linear), rb = P(t, mid('apart', 0.8), 0.4, linear);
      op(chA, 1 - ra); op(resA, ra); op(chB, 1 - rb); op(resB, rb);
    }

    /* ---------- hook ---------- */
    const aH = P(t, at('hook') - 0.15, 0.4, linear);
    op(Hk, aH);
    if (aH > 0) {
      op(remember, P(t, at('hook') - 0.1, 0.4, linear));
      hkPop.set(P(t, mid('hook', 0.16), 0.55, linear));
      const tp = P(t, mid('hook', 0.46), 0.55, pop); op(hkTubeG, clamp(tp * 2)); tr(hkTubeG, 840, 392, 0.8 + 0.2 * tp);
      op(hkL, P(t, mid('hook', 0.2), 0.4, linear)); op(hkR, P(t, mid('hook', 0.5), 0.4, linear));
    }
  };
});

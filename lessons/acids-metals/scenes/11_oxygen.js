/* Chapter 11, Testing for oxygen.
   The POP and milky-tube tests tuck into the corner; a big tube of gas: oxygen? -> a splint is lit, then blown
   out so it only glows -> showpiece: pushed into the tube, the ember brightens and bursts back into flame
   -> oxygen supports burning: air is only a fifth oxygen, the tube is full of it -> all three tests in three
   columns: hydrogen pops a lit splint, oxygen relights a glowing one, carbon dioxide turns limewater milky
   -> don't mix up the splints: LIT for hydrogen, GLOWING for oxygen. */
scene('oxygen', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette (storyboard) ---------- */
  const CLEAR = '#CFE7F5', WOOD = '#C8A165', EMBER = '#FF6A2A', OXY = '#FF9A8F';

  /* ---------- shared gas-test art (drawn the same way in the metals and carbonates chapters) ---------- */
  /* hydrogen gas: two white H atoms touching */
  function molH2(parent, r, o) {
    r = r || 12; const g = G(parent);
    tr(atom(g, 'H', r, o), -r * 0.72, 0); tr(atom(g, 'H', r, o), r * 0.72, 0);
    return g;
  }
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
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
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
  /* a layer inside a kit test tube: in front of the liquid, behind the glass */
  function inside(tb) { const g = E('g', {}); tb.insertBefore(g, tb.childNodes[3]); return g; }
  function glassTube(parent, pts) {
    const g = G(parent), d = 'M' + pts.map(p => p.join(',')).join(' L');
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': 11, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* a pie slice from angle a0 to a1 (radians, 0 = 12 o'clock, clockwise) */
  function slice(r, a0, a1) {
    const p = a => [(Math.sin(a) * r).toFixed(1), (-Math.cos(a) * r).toFixed(1)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M0,0 L${x0},${y0} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1},${y1} Z`;
  }
  const pulse = (t, t0, d) => Math.sin(Math.PI * P(t, t0, d || 0.5, linear));

  /* ================= A. one big tube of gas ================= */
  const A = G(root);
  const TX = 600, TY = 440, TW = 110, TH = 400, TM = TY - TH / 2;      // mouth at (600, 240)
  // clamp stand (appears with the tube)
  const stand = G(A);
  E('rect', { x: 330, y: 690, width: 210, height: 18, rx: 6, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, stand);
  E('rect', { x: 423, y: 430, width: 14, height: 262, rx: 4, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 1.5 }, stand);
  E('rect', { x: 418, y: 506, width: 24, height: 26, rx: 4, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 2 }, stand);
  E('rect', { x: 440, y: 514, width: 104, height: 10, rx: 3, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 1.5 }, stand);
  const tubeG = G(A); tr(tubeG, TX, TY);
  const tb = testTube(tubeG, TW, TH, { level: 0, liquid: CLEAR, opacity: 0.1 });
  const inn = inside(tb);
  const o2r = rng(51), o2s = [];
  for (let k = 0; k < 12; k++) o2s.push({ m: molO2(inn, 11), x: (o2r() - 0.5) * 70, y: -150 + (k / 12) * 320 + (o2r() - 0.5) * 20, ph: o2r() * TAU, sp: 0.5 + o2r() * 0.6 });
  E('path', { d: 'M-62,68 L-62,92 M62,68 L62,92 M-62,80 L-56,80 M56,80 L62,80', stroke: '#B9C6D2', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, tubeG);
  E('rect', { x: -64, y: 70, width: 128, height: 20, rx: 6, fill: 'none', stroke: '#8E9CA9', 'stroke-width': 4 }, tubeG);
  const qChip = G(A);
  const qQ = chip(qChip, 'oxygen?', { size: 32, fill: C.card2, stroke: OXY, color: OXY, sw: 2.5 });
  E('line', { x1: qQ.w / 2 + 4, y1: 10, x2: qQ.w / 2 + 60, y2: 34, stroke: C.muted, 'stroke-width': 2.5 }, qChip); E('circle', { cx: qQ.w / 2 + 62, cy: 35, r: 4.5, fill: C.muted }, qChip);
  const qYes = G(qChip); chip(qYes, 'oxygen', { size: 32, fill: C.card2, stroke: OXY, color: OXY, sw: 2.5, w: qQ.w }); { const tk = tick(qYes, 13); tr(tk, -qQ.w / 2 - 26, 2); }
  tr(qChip, 430, 300);
  // the corner icons: the two tests you already know
  const icPop = G(A), icPopArt = popBurst(icPop, 80); icPopArt.set(1);
  const icLime = G(A), icLimeArt = limeTube(icLime, 64, 190, 0.6); icLimeArt.milk(1);
  const icPopL = chem(A, 0, 0, 'H2', { size: 28, fill: '#FFFFFF' }), icLimeL = chem(A, 0, 0, 'CO2', { size: 28, fill: C.co2 });
  // the splint, large
  const SK = 1.25, spl = splint(A, SK);
  const puffs = [0, 1, 2].map(i => E('path', { d: `M0,${-12 + i * 12} q-24,${-8 + i * 4} -48,0`, fill: 'none', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linecap': 'round' }, A));
  const relFlash = E('circle', { r: 160, fill: glow('#FFE7A0') }, A);
  const relSparks = [0, 1, 2, 3].map(i => spark(A, 14, { seed: i + 2 }));
  const stLit = chip(A, 'lit', { size: 32, fill: C.card2, stroke: '#FFB347', color: '#FFD27A', sw: 2.5 });
  const stGlow = chip(A, 'glowing', { size: 32, fill: C.card2, stroke: EMBER, color: '#FF9A6A', sw: 2.5 });
  const stRel = chip(A, 'relights!', { size: 34, fill: '#3A2A0E', stroke: C.energy, color: C.energy, sw: 3 });
  const stSup = chip(A, 'oxygen supports burning', { size: 30, fill: C.card2, stroke: OXY, color: '#FFFFFF', sw: 2.5 });
  tr(stLit, 760, 330); tr(stGlow, 760, 330); tr(stRel, 850, 360); tr(stSup, 878, 330);
  // air: a fifth oxygen
  const pieG = G(A); tr(pieG, 215, 420);
  E('circle', { r: 100, fill: '#5E7584', stroke: '#9DB0BF', 'stroke-width': 3 }, pieG);
  const pieO = E('path', { fill: ball('#FF6B5C', '#B5372D'), stroke: '#FFD0CA', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pieG);
  const pieT = T(A, 215, 288, 'air', { size: 36, weight: 700, anchor: 'middle' });
  const pieL1 = rich(A, 215, 566, [['oxygen', OXY, 700], [': about a fifth', C.ink]], { size: 28, anchor: 'middle' });
  const pieL2 = T(A, 215, 602, 'the rest: mostly nitrogen', { size: 26, weight: 500, anchor: 'middle', fill: C.muted });
  const fullL = labelLine(A, 720, 560, TX + 44, 548, 'a tube full of oxygen', { size: 30, anchor: 'start', fill: OXY });
  fullL.set(0);

  /* ================= B. all three tests ================= */
  const B = G(root);
  const CX = [220, 600, 980], CT = 445, CH = 230, CM = CT - CH / 2;   // tube mouths at y = 330
  const cols = CX.map((cx, i) => {
    const g = G(B);
    card(g, cx - 170, 130, 340, 560, { fill: 'rgba(20,54,70,0.9)', stroke: C.line });
    T(g, cx, 182, ['Hydrogen', 'Oxygen', 'Carbon dioxide'][i], { size: 38, weight: 700, anchor: 'middle', fill: ['#FFFFFF', OXY, C.co2][i] });
    return { g, cx, art: G(g), txt: G(g) };
  });
  // column 1: hydrogen, a lit splint, POP
  const c1 = cols[0], t1X = c1.cx - 34;
  const t1 = G(c1.art); tr(t1, t1X, CT); const tb1 = testTube(t1, 66, CH, { level: 0, liquid: CLEAR }); const in1 = inside(tb1);
  [[-10, -60], [12, -10], [-8, 40]].forEach(([x, y]) => tr(molH2(in1, 9), x, y));
  const sp1 = splint(c1.art, 0.6);
  const pop1 = popBurst(c1.art, 54); tr(pop1, t1X - 6, CM - 34);
  const fl1 = E('circle', { cx: t1X, cy: CM - 24, r: 110, fill: glow('#FFF6C8') }, c1.art); c1.art.insertBefore(fl1, pop1);
  // column 2: oxygen, a glowing splint relights
  const c2 = cols[1], t2X = c2.cx - 10;
  const t2 = G(c2.art); tr(t2, t2X, CT); const tb2 = testTube(t2, 66, CH, { level: 0, liquid: CLEAR }); const in2 = inside(tb2);
  [[-14, -70], [10, -30], [-12, 10], [12, 50], [-6, 82]].forEach(([x, y], k) => tr(molO2(in2, 8), x, y, 1, k * 37));
  const sp2 = splint(c2.art, 0.6);
  // column 3: carbon dioxide turns limewater milky
  const c3 = cols[2];
  const t3 = G(c3.art); tr(t3, c3.cx, CT); const tb3 = limeTube(t3, 66, CH, 0.55); const in3 = inside(tb3);
  const bub3 = bubbles(in3, -16, -2, 32, 74, { n: 9, r: 4.5, speed: 0.6, seed: 9 });
  glassTube(c3.art, [[c3.cx + 120, CM - 40], [c3.cx + 8, CM - 40], [c3.cx + 8, CT + 80]]);
  const co3 = [0, 1].map(() => molCO2(c3.art, 7));
  // bottom texts: the test, then the result
  const TXT = [['lit splint', 'squeaky pop', C.energy], ['glowing splint', 'relights', '#FFB27A'], ['limewater', 'turns milky', '#FFFFFF']].map(([a, b, col], i) => {
    const g = G(cols[i].txt), cx = CX[i];
    const l1 = T(g, cx, 610, a, { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    const l2 = T(g, cx, 652, b, { size: 32, weight: 700, anchor: 'middle', fill: col });
    return { l1, l2 };
  });
  // the big labels, each with a small splint in that state: lit (a flame) or glowing (an ember)
  const big = [['LIT', 'for hydrogen', C.energy], ['GLOWING', 'for oxygen', '#FF9A6A']].map(([a, b, col], i) => {
    const g = G(cols[i].g), cx = CX[i];
    E('rect', { x: cx - 150, y: 574, width: 300, height: 104, rx: 22, fill: i ? 'rgba(255,106,42,0.12)' : 'rgba(255,228,92,0.12)', stroke: col, 'stroke-width': 3 }, g);
    T(g, cx + 34, 622, a, { size: 42, weight: 700, anchor: 'middle', fill: col });
    T(g, cx + 34, 660, b, { size: 28, weight: 600, anchor: 'middle' });
    g.mini = splint(g, 0.36); g.mini.place(cx - 95, 614, 37);
    return g;
  });
  const rings = [0, 1].map(() => E('circle', { r: 40, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-dasharray': '9 7' }, B));

  /* ================= update ================= */
  const icPos = (t, i) => {
    const mv = P(t, mid('third', 0.42), 0.8);
    const from = i ? [760, 370] : [470, 360], to = i ? [1104, 170] : [986, 170];
    return [lerp(from[0], to[0], mv), lerp(from[1], to[1], mv), lerp(1, i ? 0.5 : 0.42, mv), lerp(528, 256, mv)];
  };
  return t => {
    /* ---------- A ---------- */
    const aA = Math.min(P(t, S.first - 0.1, 0.3, linear), 1 - P(t, at('h') - 0.4, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      // the two tests you know, then off to the corner
      [[icPop, icPopL, 0.02], [icLime, icLimeL, 0.12]].forEach(([g, lab, f], i) => {
        const a = P(t, mid('third', f), 0.45, pop), [x, y, s, ly] = icPos(t, i);
        tr(g, x, y, Math.max(0.01, s * (0.6 + 0.4 * a))); op(g, clamp(a * 2));
        tr(lab, x, ly); op(lab, clamp(a * 2));
      });
      // the tube: oxygen?
      const tp = P(t, mid('third', 0.55), 0.6, easeOut);
      op(tubeG, tp); tr(tubeG, TX, TY + (1 - tp) * 30); op(stand, tp);
      const qp = P(t, mid('third', 0.74), 0.45, pop), qy = P(t, mid('relight', 0.64), 0.4, linear);
      op(qChip, clamp(qp * 2)); tr(qChip, 430, 300, 0.7 + 0.3 * qp);
      op(qQ, 1 - qy); op(qYes, qy);

      // the splint: lit, blown out to a glow, pushed into the tube, relit, flaring
      const sIn = P(t, at('glow') - 0.1, 0.6, easeOut);
      const m1 = P(t, at('relight') + 0.05, 1.1, ease), m2 = P(t, at('relight') + 1.15, 0.8, ease);
      let x = lerp(1010, 880, sIn), y = 330, ang = -50;
      if (m1 > 0) { x = lerp(880, 612, m1); y = lerp(330, 150, m1) - Math.sin(Math.PI * m1) * 40; ang = lerp(-50, -170, m1); }
      if (m2 > 0) { x = lerp(612, 606, m2); y = lerp(150, 372, m2); }
      const tLit = mid('glow', 0.06), tBlow = mid('glow', 0.5), tOut = mid('glow', 0.56);
      const tBright = mid('relight', 0.32), tRel = mid('relight', 0.5);
      let flame = P(t, tLit, 0.45, pop) * (1 - P(t, tOut, 0.4, easeIn));
      flame += P(t, tRel, 0.6, pop) * 1.3 + P(t, mid('why', 0.66), 1.2, ease) * 0.3;
      const ember = P(t, tOut, 0.3, linear) * (1 + 0.7 * P(t, tBright, 0.8, linear)) * (1 - P(t, tRel + 0.2, 0.5, linear));
      const smoke = P(t, tOut + 0.25, 0.5, linear) * (1 - P(t, at('relight') + 0.2, 0.6, linear));
      op(spl, P(t, at('glow') - 0.1, 0.35, linear));
      spl.place(x, y, ang); spl.set(flame, clamp(ember, 0, 1.7), P(t, tLit, 0.6, linear), smoke); spl.upd(t);
      puffs.forEach((p, i) => { const u = P(t, tBlow - 0.15 + i * 0.07, 0.55, linear); p.setAttribute('transform', `translate(${(lerp(1000, 912, u)).toFixed(1)} ${(286 + i * 4).toFixed(1)})`); op(p, Math.sin(Math.PI * u) * 0.9); });
      // the relight burst
      const rb = pulse(t, tRel - 0.05, 0.7);
      op(relFlash, rb); tr(relFlash, x, y - 60, 0.6 + 0.6 * rb);
      relSparks.forEach((s, i) => { const u = P(t, tRel + i * 0.08, 0.9, linear), a = -Math.PI / 2 + (i - 1.5) * 0.4; tr(s, x + Math.cos(a) * 85 * easeOut(u), y - 70 + Math.sin(a) * 85 * easeOut(u), 0.5 + 0.5 * (1 - u)); op(s, Math.sin(Math.PI * u)); s.upd(t); });
      // state chips
      op(stLit, win(t, mid('glow', 0.16), tBlow + 0.1, 0.3));
      op(stGlow, win(t, mid('glow', 0.63), at('relight') + 0.5, 0.3));
      const rp = P(t, mid('relight', 0.62), 0.45, pop);
      op(stRel, clamp(rp * 2) * (1 - P(t, at('why') - 0.1, 0.35, linear))); tr(stRel, 850, 360, 0.7 + 0.3 * rp);
      const sp = P(t, mid('why', 0.03), 0.45, pop);
      op(stSup, clamp(sp * 2)); tr(stSup, 878, 330, 0.7 + 0.3 * sp);
      // air pie
      const pp = P(t, mid('why', 0.24), 0.5, pop);
      op(pieG, clamp(pp * 2)); tr(pieG, 215, 420, Math.max(0.01, pp));
      const sw = P(t, mid('why', 0.3), 0.9, ease);
      pieO.setAttribute('d', slice(100, 0, Math.max(0.001, sw * TAU / 5)));
      op(pieO, sw > 0 ? 1 : 0);
      op(pieT, P(t, mid('why', 0.24), 0.4, linear));
      op(pieL1, P(t, mid('why', 0.36), 0.4, linear)); op(pieL2, P(t, mid('why', 0.46), 0.4, linear));
      // a tube full of oxygen
      const fo = mid('why', 0.58);
      o2s.forEach((o, k) => {
        op(o.m, P(t, fo + (o2s.length - k) * 0.06, 0.5, linear));
        tr(o.m, o.x + Math.sin(t * o.sp + o.ph) * 8 * calm, o.y + Math.cos(t * o.sp * 0.8 + o.ph) * 6 * calm, 1, (t * 30 * o.sp * calm + k * 40) % 360);
      });
      fullL.set(P(t, mid('why', 0.66), 0.4, linear));
    }

    /* ---------- B: three columns ---------- */
    const aB = P(t, at('h') - 0.2, 0.45, linear);
    op(B, aB);
    if (aB > 0) {
      cols.forEach((c, i) => { const p = P(t, at('h') - 0.2 + i * 0.12, 0.5, easeOut); op(c.g, p * (i === 2 ? 1 - 0.62 * P(t, mid('splints', 0.06), 0.5, linear) : 1)); tr(c.g, 0, (1 - p) * 24); });
      // 1: hydrogen
      op(c1.art, P(t, mid('h', 0.3), 0.4, linear));
      const s1 = P(t, mid('h', 0.34), 1.0, ease), pop1t = mid('h', 0.8);
      sp1.place(lerp(t1X + 52, t1X + 16, s1), lerp(CM - 22, CM - 6, s1), -110);
      sp1.set(1, 0, 1, 0); sp1.upd(t);
      pop1.set(P(t, pop1t, 0.5, linear)); op(pop1, 1 - 0.8 * P(t, mid('splints', 0.08), 0.5, linear));
      op(fl1, pulse(t, pop1t - 0.05, 0.4) * 0.9);
      // 2: oxygen
      op(c2.art, P(t, at('o') - 0.15, 0.35, linear));
      const s2 = P(t, mid('o', 0.06), 0.8, ease), rel2 = mid('o', 0.42);
      sp2.place(t2X + 4, lerp(CM - 12, CM + 70, s2), -164);
      sp2.set(P(t, rel2, 0.5, pop) * 1.3, (1 - P(t, rel2 + 0.15, 0.4, linear)) * (0.9 + 0.5 * P(t, rel2 - 0.4, 0.4, linear)), 1, 0); sp2.upd(t);
      // 3: carbon dioxide
      op(c3.art, P(t, at('co') - 0.15, 0.35, linear));
      const gas = P(t, at('co'), 0.4, linear);
      bub3.upd(t, gas);
      co3.forEach((m, k) => { const u = (((t - at('co')) / 1.6 + k / 2) % 1 + 1) % 1; tr(m, lerp(c3.cx + 116, c3.cx + 10, u), CM - 40); op(m, gas * Math.min(1, u * 6, (1 - u) * 6)); });
      tb3.milk(P(t, mid('co', 0.3), end('co') - mid('co', 0.3) + 0.6, ease));
      // bottom texts, then the big splint labels
      const tAt = [[mid('h', 0.44), mid('h', 0.82)], [mid('o', 0.62), mid('o', 0.4)], [mid('co', 0.34), mid('co', 0.62)]];
      const bigA = [P(t, mid('splints', 0.4), 0.45, pop), P(t, mid('splints', 0.65), 0.45, pop)];
      TXT.forEach((x2, i) => {
        const off = i < 2 ? 1 - clamp(bigA[i] * 2) : 1;
        op(x2.l1, P(t, tAt[i][0], 0.4, linear) * off); op(x2.l2, P(t, tAt[i][1], 0.4, linear) * off);
      });
      big.forEach((g, i) => {
        op(g, clamp(bigA[i] * 2)); tr(g, 0, (1 - clamp(bigA[i])) * 16);
        if (bigA[i] > 0) { if (i) g.mini.set(0, 1, 1, 0); else g.mini.set(1, 0, 1, 0); g.mini.upd(t); }
      });
      // highlight the splints: the lit one at the mouth, the one in the oxygen
      const tips = [[t1X + 16, CM - 30], [t2X + 4, CM + 50]];
      rings.forEach((r, i) => { const a = P(t, mid('splints', 0.1 + i * 0.06), 0.4, linear); op(r, a); attr(r, 'cx', tips[i][0]); attr(r, 'cy', tips[i][1]); r.setAttribute('stroke-dashoffset', (-t * 20 * calm).toFixed(1)); });
    }
  };
});

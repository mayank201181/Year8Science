/* Chapter: The reactivity series.
   An empty league table, MOST REACTIVE at the top and LEAST REACTIVE at the bottom, with a fading
   arrow -> the rungs drop in as each metal is named, then the dashed hydrogen rung, copper, silver
   and a glinting gold -> "Please Stop Calling Me A Zebra, Instead Call Some Gold" flies in beside
   the rungs -> hydrogen is only a marker: tubes fizz above it, crosses below -> the ladder folds
   into the mini ladder; potassium and sodium skate across cold water (showpiece) -> metal + water
   -> metal hydroxide + hydrogen -> hydroxide ions spread and indicator turns the water purple
   -> magnesium: one slow bubble in cold water, a white glow in steam -> copper, silver and gold
   sit still -> the ladder returns: a mystery metal finds its place, so predict before you test. */
scene('series', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- helpers ---------- */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = rgb(a), B = rgb(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * p).toString(16).padStart(2, '0')).join(''); };
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const fade = (t, t0, d) => P(t, t0, d === undefined ? 0.4 : d, linear);
  const outBy = (t, next) => 1 - P(t, at(next) - 0.48, 0.45, linear);   // gone just as the next line starts
  function molH2(parent, r) { r = r || 9; const g = G(parent); tr(atom(g, 'H', r), -r * 0.75, 0); tr(atom(g, 'H', r), r * 0.75, 0); return g; }
  /* a tiny tube of acid, origin at the middle of the rim; g.upd(t, rate) runs its bubbles */
  function tinyTube(parent, seed) {
    const g = G(parent), d = 'M-11,-20 L-11,12 A11,11 0 0 0 11,12 L11,-20';
    E('path', { d: d + ' Z', fill: 'rgba(200,230,250,0.10)' }, g);
    E('path', { d: 'M-8,-5 L-8,12 A8,8 0 0 0 8,12 L8,-5 Z', fill: '#CFE7F5', opacity: 0.35 }, g);
    const bs = [0, 1].map(() => E('circle', { r: 2.8, fill: 'rgba(255,255,255,0.25)', stroke: '#FFFFFF', 'stroke-width': 1.3 }, g));
    E('path', { d, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    E('line', { x1: -14, x2: 14, y1: -20, y2: -20, stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.upd = (t, rate) => bs.forEach((b, k) => {
      const u = ((t * rate + k / 2 + seed * 0.13) % 1 + 1) % 1;
      attr(b, 'cx', -3 + 6 * ((k * 0.37 + seed * 0.21) % 1) + Math.sin(t * 5 + k) * 1.2);
      attr(b, 'cy', 17 - u * 24);
      b.style.opacity = rate > 0 ? Math.min(1, u * 5, (1 - u) * 4).toFixed(3) : '0';
    });
    return g;
  }
  /* a vertical brace from y0 to y1 at x, pointing right; .set(p) draws it */
  function brace(parent, x, y0, y1, color) {
    const ym = (y0 + y1) / 2, k = 14;
    const d = `M${x},${y0} Q${x + k},${y0} ${x + k},${y0 + k} L${x + k},${ym - k} Q${x + k},${ym} ${x + 2 * k},${ym} Q${x + k},${ym} ${x + k},${ym + k} L${x + k},${y1 - k} Q${x + k},${y1} ${x},${y1}`;
    const p = E('path', { d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
    p.set = v => p.setAttribute('stroke-dashoffset', (1 - clamp(v)).toFixed(4));
    p.set(0);
    return p;
  }
  /* a four-point glint */
  function glint(parent, r) {
    const g = G(parent);
    E('circle', { r: r * 1.7, fill: glow('#FFF4C2') }, g);
    E('path', { d: `M0,${-r} Q${r * 0.16},${-r * 0.16} ${r},0 Q${r * 0.16},${r * 0.16} 0,${r} Q${-r * 0.16},${r * 0.16} ${-r},0 Q${-r * 0.16},${-r * 0.16} 0,${-r} Z`, fill: '#FFFFFF' }, g);
    return g;
  }

  /* ---------- the ladder: full rungs (300 x 44) that fold into mini rungs (72 x 34) ---------- */
  const MET = [
    { s: 'K', n: 'potassium', c: '#D8DEE6', w: 'Please' },
    { s: 'Na', n: 'sodium', c: '#D8DEE6', w: 'Stop' },
    { s: 'Ca', n: 'calcium', c: '#E4E0D4', w: 'Calling' },
    { s: 'Mg', n: 'magnesium', c: '#E3E8EE', w: 'Me' },
    { s: 'Al', n: 'aluminium', c: '#C7D0DA', w: 'A' },
    { s: 'Zn', n: 'zinc', c: '#A9B6C4', w: 'Zebra' },
    { s: 'Fe', n: 'iron', c: '#7A8590', w: 'Instead' },
    { s: 'H', n: 'hydrogen', c: C.air, hyd: true },
    { s: 'Cu', n: 'copper', c: '#D9824B', w: 'Call' },
    { s: 'Ag', n: 'silver', c: '#E8ECF0', w: 'Some' },
    { s: 'Au', n: 'gold', c: '#F5C542', w: 'Gold' },
  ];
  const HI = 7, AU = 10;
  const FX = 260, FY = i => 172 + 48 * i;          // full ladder, left half
  const MX = 96, MY = i => 196 + 40 * i;           // mini ladder, left edge
  const INK_DARK = '#13232E', H_FILL = '#123544', CLEAR = '#CFE7F5';     // CLEAR: colourless water and solutions
  function buildFull(g, m) {
    const w = 300, h = 44;
    if (m.hyd) {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: H_FILL, stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '11 7' }, g);
      T(g, 0, 10, '(H) hydrogen', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
      return;
    }
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: mix(m.c, C.bg0, 0.6), stroke: m.c, 'stroke-width': 2.5 }, g);
    E('rect', { x: -w / 2 + 5, y: -h / 2 + 5, width: 66, height: h - 10, rx: (h - 10) / 2, fill: ball(m.c, mix(m.c, '#000000', 0.42)) }, g);
    T(g, -w / 2 + 38, 10, m.s, { size: 28, weight: 700, anchor: 'middle', fill: INK_DARK });
    const nm = E('text', { x: -w / 2 + 88, y: 10, 'font-size': 28, 'font-weight': 600, 'font-family': FD, fill: C.ink }, g);
    m.ini = E('tspan', { 'font-weight': 800 }, nm); m.ini.textContent = m.n[0];
    E('tspan', {}, nm).textContent = m.n.slice(1);
  }
  function buildMini(g, m) {
    const w = 72, h = 34;
    if (m.hyd) {
      E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: H_FILL, stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' }, g);
      T(g, 0, 9, 'H', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
      return;
    }
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: ball(m.c, mix(m.c, '#000000', 0.42)), stroke: mix(m.c, '#FFFFFF', 0.45), 'stroke-width': 2 }, g);
    T(g, 0, 9, m.s, { size: 26, weight: 700, anchor: 'middle', fill: INK_DARK });
  }
  const slotsG = G(root);
  const slots = MET.map((m, i) => E('rect', { x: FX - 150, y: FY(i) - 22, width: 300, height: 44, rx: 22, fill: 'rgba(255,255,255,0.02)', stroke: C.line, 'stroke-width': 2.5, 'stroke-dasharray': m.hyd ? '11 7' : undefined }, slotsG));
  const ladG = G(root);
  MET.forEach(m => {
    m.g = G(ladG);
    m.halo = E('ellipse', { rx: 175, ry: 38, fill: glow(m.hyd ? C.air : C.energy) }, m.g);
    m.full = G(m.g); buildFull(m.full, m);
    m.mini = G(m.g); buildMini(m.mini, m);
  });
  const auGlint = glint(ladG, 11);

  /* ---------- opening words and the reactivity axis ---------- */
  const intro = G(root);
  T(intro, 880, 372, 'reactivity series', { size: 50, weight: 700, anchor: 'middle', fill: C.energy });
  T(intro, 880, 424, '= a league table of metals', { size: 32, weight: 600, anchor: 'middle' });
  const axis = G(root);
  const most = T(axis, 640, 184, 'MOST REACTIVE', { size: 30, weight: 700, fill: C.energy, ls: 1 });
  const least = T(axis, 640, 662, 'LEAST REACTIVE', { size: 30, weight: 700, fill: C.muted, ls: 1 });
  most.style.fontKerning = 'none'; least.style.fontKerning = 'none';     // Fredoka kerns "IV" until the letters touch
  const AXX = 664, AY0 = 214, AY1 = 626, AXEND = '#4F6B7A';
  const agrad = E('linearGradient', { id: 'srsAxisGrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: AY0, x2: 0, y2: AY1 }, defs());
  E('stop', { offset: 0, 'stop-color': C.energy }, agrad); E('stop', { offset: 1, 'stop-color': AXEND }, agrad);
  const axLine = E('path', { d: `M${AXX},${AY0} L${AXX},${AY1 - 18}`, stroke: 'url(#srsAxisGrad)', 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none', pathLength: 1, 'stroke-dasharray': '1 1' }, axis);
  const axHead = E('path', { d: `M${AXX - 16},${AY1 - 24} L${AXX + 16},${AY1 - 24} L${AXX},${AY1 + 4} Z`, fill: AXEND, 'stroke-linejoin': 'round' }, axis);
  const axLab = T(axis, 694, 404, 'decreasing\nreactivity', { size: 30, weight: 600, fill: C.muted, lh: 38 });

  /* ---------- mnemonic words ---------- */
  const words = [];
  MET.forEach((m, i) => { if (!m.w) return; const g = G(root); rich(g, 0, 12, [[m.w[0], C.energy, 800], [m.w.slice(1), C.ink, 700]], { size: 34 }); words.push({ g, i, m }); });
  // when each word is spoken (fraction of the 'zebra' line)
  const WT = { 0: 0.268, 1: 0.365, 2: 0.427, 3: 0.5, 4: 0.528, 5: 0.558, 6: 0.7, 8: 0.79, 9: 0.843, 10: 0.894 };

  /* ---------- hydrogen: a marker line; above it react with acids, below it don't ---------- */
  const hyd = G(root);
  const notMetal = T(hyd, 432, FY(HI) + 9, 'not a metal', { size: 26, weight: 600, fill: C.air });
  const markLine = E('line', { x1: 586, y1: FY(HI), x2: 586, y2: FY(HI), stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, hyd);
  const markLab = T(hyd, 1150, FY(HI) - 16, 'a marker', { size: 30, weight: 700, fill: C.air, anchor: 'end' });
  const tubes = MET.slice(0, HI).map((m, i) => { const tt = tinyTube(hyd, i); tr(tt, 612, FY(i)); return tt; });
  const RATE = [2.2, 1.9, 1.6, 1.3, 1.0, 0.75, 0.5];
  const crosses = [8, 9, 10].map(i => { const c = cross(hyd, 11); tr(c, 612, FY(i)); return c; });
  const brTop = brace(hyd, 640, FY(0) - 20, FY(HI - 1) + 20, C.good);
  const brBot = brace(hyd, 640, FY(8) - 20, FY(10) + 20, C.bad);
  const labTop = rich(hyd, 684, FY(3) + 10, [['react with ', C.ink], ['acids', '#FF6B76', 800]], { size: 32, weight: 700 });
  const labBot = T(hyd, 684, FY(9) + 10, 'don’t react', { size: 32, weight: 700, fill: C.ink });

  /* ---------- troughs of cold water: potassium (left) and sodium (right) ---------- */
  const TW = 420, TH = 190, SURF = TH / 2 - (TH - 18) * 0.62;   // trough size; local y of its water surface
  function trough(parent, o) {
    const g = G(parent);
    g.bk = beaker(g, TW, TH, { level: 0.62, liquid: CLEAR, opacity: 0.28, marks: false });
    g.ions = G(g);
    const R = { o, g };
    R.trail = []; for (let k = 0; k < 5; k++) R.trail.push(E('circle', { r: 6.5 - k * 0.9, fill: '#FFFFFF' }, g));
    R.splash = E('ellipse', { cx: 0, cy: SURF, rx: 10, ry: 3, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    R.h2 = []; for (let k = 0; k < 5; k++) R.h2.push(molH2(g, 9));
    R.lump = G(g);
    if (o.flame) {
      R.fl = G(R.lump);
      R.flGlow = E('circle', { cy: -46, r: 84, fill: glow('#C8A2F0') }, R.fl);
      R.flOuter = E('path', { d: 'M0,-4 C-34,-18 -34,-66 -6,-104 C-4,-82 6,-76 8,-90 C26,-64 34,-22 0,-4 Z', fill: '#C8A2F0', opacity: 0.92 }, R.fl);
      R.flCore = E('path', { d: 'M0,-8 C-14,-18 -14,-42 0,-66 C14,-42 14,-18 0,-8 Z', fill: '#F6EEFF' }, R.fl);
      R.sparks = [0, 1].map(k => spark(R.lump, 8, { color: '#D9C2FF', seed: k + 4 }));
    }
    R.fizz = bubbles(R.lump, -28, -44, 56, 38, { n: 9, r: 5, seed: o.seed, speed: 1.5 });
    R.body = E('ellipse', { rx: 23, ry: 15, fill: ball('#E9EEF2', '#8E9AA6'), stroke: '#F6F9FB', 'stroke-width': 2 }, R.lump);
    g.R = R;
    return g;
  }
  const pathX = (o, tau) => o.amp * calm * P(tau, 0, 0.6) * (0.85 * Math.sin(o.w1 * tau) + 0.15 * Math.sin(o.w2 * tau + 0.7));
  /* one lump reacting: drops = [{ t0 landing time, dur seconds until it is used up }] */
  function react(R, t, drops) {
    let d = null; for (const q of drops) if (t >= q.t0 - 0.5) d = q;
    const hideAll = () => { op(R.lump, 0); R.trail.forEach(c => op(c, 0)); R.h2.forEach(m => op(m, 0)); op(R.splash, 0); };
    if (!d) { hideAll(); return; }
    const tau = t - d.t0, fall = P(t, d.t0 - 0.42, 0.42, easeIn);
    const life = 1 - P(tau, 0.3, d.dur, linear), r = Math.pow(life, 0.55), alive = r > 0.03;
    const x = tau > 0 ? pathX(R.o, tau) : 0, y = lerp(SURF - 190, SURF - 8, fall);
    op(R.lump, alive ? clamp((t - d.t0 + 0.5) / 0.15) : 0);
    if (alive) {
      tr(R.lump, x, y);
      const melt = P(tau, 0.1, 0.8);
      R.body.setAttribute('transform', `scale(${(r * lerp(1, 0.8, melt)).toFixed(3)} ${(r * lerp(1, 1.12, melt)).toFixed(3)})`);
      R.fizz.upd(t * calm, tau > 0 ? r : 0);
      if (R.fl) {
        const fl = P(tau, 0.3, 0.3) * Math.min(1, r * 1.6), fk = 1 + 0.12 * Math.sin(t * 23) + 0.08 * Math.sin(t * 37);
        op(R.fl, fl);
        if (fl > 0) { R.fl.setAttribute('transform', `scale(${(1.25 * Math.max(r, 0.45)).toFixed(3)})`); R.flOuter.setAttribute('transform', `scale(${(1 + 0.06 * Math.sin(t * 29)).toFixed(3)} ${fk.toFixed(3)})`); R.flCore.setAttribute('transform', `scale(1 ${(2 - fk).toFixed(3)})`); }
        R.sparks.forEach((s, k) => { const q = ((tau * 1.4 + k / 2) % 1 + 1) % 1; op(s, fl * Math.sin(q * Math.PI)); if (fl > 0) { tr(s, (k - 0.5) * 52 * q + (k - 0.5) * 12, -60 - 70 * q, 0.6 + 0.6 * (1 - q)); s.upd(t); } });
      }
    }
    R.trail.forEach((c, k) => {
      const tt = tau - (k + 1) * 0.07;
      if (tt <= 0 || !alive) { op(c, 0); return; }
      attr(c, 'cx', pathX(R.o, tt)); attr(c, 'cy', SURF - 2); op(c, 0.65 * (1 - k / 5) * r);
    });
    const sp = clamp(tau / 0.55); op(R.splash, tau > 0 && sp < 1 ? 1 - sp : 0);
    if (tau > 0 && sp < 1) { attr(R.splash, 'rx', 12 + 70 * sp); attr(R.splash, 'ry', 3 + 8 * sp); }
    R.h2.forEach((m, k) => {
      const Tp = 1.6, u = tau > 0 ? ((tau / Tp) + k / R.h2.length) % 1 : 0, ts = tau - u * Tp;
      if (tau <= 0 || ts < 0.2 || ts > d.dur * 0.95) { op(m, 0); return; }
      tr(m, pathX(R.o, ts) + Math.sin(u * 5 + k) * 8, SURF - 24 - u * 118, 1, (u * 160 + k * 40) % 360);
      op(m, Math.min(1, u * 6, (1 - u) * 3));
    });
  }
  const water = G(root);
  const trK = trough(water, { amp: 150, w1: 2.9, w2: 7.3, seed: 5, flame: true }), trNa = trough(water, { amp: 140, w1: 2.1, w2: 5.1, seed: 9 });
  const KX = 452, NAX = 904, TRY = 488;
  const labK = T(water, KX, 636, 'potassium', { size: 34, weight: 700, anchor: 'middle' });
  const labNa = T(water, NAX, 636, 'sodium', { size: 34, weight: 700, anchor: 'middle' });
  const coldChip = chip(water, 'cold water', { size: 28, fill: 'rgba(76,201,240,0.18)', stroke: C.water, sw: 2.5 }); tr(coldChip, 678, 196);
  const h2Lab = G(water);
  T(h2Lab, 678, 266, 'hydrogen gas', { size: 30, weight: 700, anchor: 'middle' });
  arrow(h2Lab, 590, 282, 536, 322, { color: C.muted, width: 4, head: 12 });
  arrow(h2Lab, 766, 282, 820, 322, { color: C.muted, width: 4, head: 12 });
  // "the higher the metal, the more vigorously it reacts": an arrow up the mini ladder
  const vig = G(root);
  const vigArrow = arrow(vig, 158, MY(10), 158, MY(0) + 6, { color: C.energy, width: 6 });
  T(vig, 190, 214, 'higher up =', { size: 30, weight: 600, fill: C.ink });
  T(vig, 190, 256, 'more vigorous', { size: 36, weight: 700, fill: C.energy });

  /* ---------- the equation: metal + water -> metal hydroxide + hydrogen ---------- */
  const eqG = G(root);
  function eqRow(y, items) {
    const parts = items.map(it => {
      const g = G(eqG);
      if (it === '+') { T(g, 0, 14, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted }); return { g, w: 34 }; }
      if (it === '>') { arrow(g, -26, 0, 26, 0, { color: C.ink, width: 6 }); return { g, w: 62 }; }
      const c = chip(g, it[0], { size: 30, fill: it[1], color: it[2] });
      return { g, w: c.w, c };
    });
    const GAP = 12; let tot = 0; parts.forEach((p, i) => { tot += p.w + (i ? GAP : 0); });
    let x = 685 - tot / 2; parts.forEach((p, i) => { if (i) x += GAP; p.x = x + p.w / 2; p.y = y; x += p.w; tr(p.g, p.x, y); });
    return parts;
  }
  const GREY = '#AAB6C2', NAOH = '#3F8FE8', HCOL = '#F4F7FA';
  const row1 = eqRow(186, [['metal', GREY, INK_DARK], '+', ['water', C.water, '#06283A'], '>', ['metal hydroxide', NAOH, '#FFFFFF'], '+', ['hydrogen', HCOL, INK_DARK]]);
  const row2 = eqRow(276, [['sodium', '#D8DEE6', INK_DARK], '+', ['water', C.water, '#06283A'], '>', ['sodium hydroxide', NAOH, '#FFFFFF'], '+', ['hydrogen', HCOL, INK_DARK]]);
  const R1AT = [0.005, 0.07, 0.08, 0.165, 0.2, 0.34, 0.355], R2AT = [0.5, 0.61, 0.62, 0.715, 0.757, 0.893, 0.905];
  const naohHalo = E('ellipse', { rx: 150, ry: 44, fill: glow(NAOH) }, eqG); eqG.insertBefore(naohHalo, eqG.firstChild);

  /* ---------- alkaline: hydroxide ions spread, indicator turns the water purple ---------- */
  /* the lesson's ion art (as in the acids, pH and neutralisation chapters): a charge badge, + red or - blue */
  function ionBadge(parent, r, sign) {
    const g = G(parent);
    E('circle', { r, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, g);
    E('path', { d: sign > 0 ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* OH-: a red O joined to a white H, with a blue - badge */
  function ionOH(parent) {
    const g = G(parent);
    tr(atom(g, 'H', 10), 18, 10);
    atom(g, 'O', 16);
    tr(ionBadge(g, 7.5, -1), -13, -14);
    return g;
  }
  const ir = rng(83), OHS = [], NAS = [];
  for (let k = 0; k < 5; k++) OHS.push({ g: ionOH(trNa.ions), x0: (ir() - 0.5) * 60, x1: -140 + k * 70 + (ir() - 0.5) * 20, y1: SURF + 24 + ir() * 46, ph: ir() * TAU });
  for (let k = 0; k < 3; k++) {
    const g = G(trNa.ions);                       // Na+: a grey ball with a red + badge
    E('circle', { r: 13, fill: ball('#B8C2CC', '#6E7A86') }, g);
    tr(ionBadge(g, 6, 1), 10, -10);
    NAS.push({ g, x0: (ir() - 0.5) * 60, x1: -120 + k * 80 + (ir() - 0.5) * 30, y1: SURF + 30 + ir() * 40, ph: ir() * TAU });
  }
  // a dropper of universal indicator (the indicators chapter's glass dropper, at 0.7): tip at its origin, 105 tall
  const dropper = G(water), DROPX = 100;
  { const d = G(dropper); tr(d, 0, 0, 0.7);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104 Z', fill: 'rgba(200,230,250,0.16)' }, d);
    E('path', { d: 'M-6,-64 L-6,-30 L-1.5,-5 L1.5,-5 L6,-30 L6,-64 Z', fill: '#3F9A62' }, d);
    E('path', { d: 'M-9,-104 L-9,-30 L-2.5,0 L2.5,0 L9,-30 L9,-104', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, d);
    E('path', { d: 'M-16,-100 C-20,-128 -14,-150 0,-150 C14,-150 20,-128 16,-100 Z', fill: ball('#E8663F', '#A33C1E'), stroke: '#F5A27F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, d);
    E('rect', { x: -18, y: -107, width: 36, height: 10, rx: 4, fill: '#B8461F' }, d); }
  const uiLab = T(water, 0, 0, 'universal indicator', { size: 26, weight: 600, fill: C.muted, anchor: 'start' });
  const uiDrops = [0, 1, 2].map(() => E('path', { d: 'M0,-8 C5,-2 6,2 6,5 A6,6 0 0 1 -6,5 C-6,2 -5,-2 0,-8 Z', fill: '#3F9A62' }, water));
  const swirl = [0, 1].map(() => E('ellipse', { rx: 10, ry: 6, fill: '#8E5CF0', opacity: 0 }, trNa));
  const alkChip = chip(water, 'alkaline: sodium hydroxide', { size: 30, fill: NAOH, color: '#FFFFFF' });
  const PURPLE = '#8E5CF0';     // universal indicator purple (pH 12-14), as on the pH bar

  /* ---------- magnesium: cold water vs steam ---------- */
  const mgG = G(root);
  /* magnesium ribbon: a coil (a looped curve) or a straight strip, about 90 wide */
  function mgRibbon(parent, coil) {
    const g = G(parent), pts = [];
    if (coil) for (let i = 0; i <= 60; i++) { const th = i / 60 * 4.4 * Math.PI; pts.push([-42 + 6.2 * th - 15 * Math.sin(th), -13 * Math.cos(th)]); }
    else for (let i = 0; i <= 12; i++) pts.push([-48 + i * 8, Math.sin(i * 1.1) * 1.5]);
    const d = openPath(pts);
    E('path', { d, fill: 'none', stroke: '#8D98A5', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);   // the metals chapter's ribbon colours
    E('path', { d, fill: 'none', stroke: '#E3E8EE', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  card(mgG, 222, 136, 444, 530, { fill: C.card, stroke: C.line });
  card(mgG, 716, 136, 444, 530, { fill: C.card, stroke: C.line });
  T(mgG, 444, 194, 'cold water', { size: 36, weight: 700, anchor: 'middle', fill: C.water });
  T(mgG, 938, 194, 'steam', { size: 36, weight: 700, anchor: 'middle', fill: '#E8EEF2' });
  const mgL = G(mgG);
  const bkMg = beaker(mgL, 210, 250, { level: 0.8, liquid: CLEAR, opacity: 0.28, marks: false }); tr(bkMg, 444, 396);
  const ribL = mgRibbon(mgL, true); tr(ribL, 444, 486);
  const slowB = E('circle', { r: 8, fill: 'rgba(255,255,255,0.2)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, mgL);
  T(mgL, 444, 566, 'magnesium ribbon', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const chipSlow = chip(mgG, 'slow', { size: 32, fill: C.card2, stroke: C.muted, color: C.ink }); tr(chipSlow, 444, 618);
  const mgR = G(mgG);
  const pipe = G(mgR);
  E('rect', { x: 744, y: 376, width: 92, height: 40, rx: 8, fill: linGrad('#B9C6D2', '#7D8C99', true), stroke: '#9DB0BF', 'stroke-width': 2 }, pipe);
  E('rect', { x: 830, y: 370, width: 14, height: 52, rx: 4, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 2 }, pipe);
  const puffs = []; for (let k = 0; k < 7; k++) puffs.push(E('circle', { r: 16, fill: '#EEF3F6' }, mgR));
  const mgHalo = E('ellipse', { cx: 1010, cy: 396, rx: 130, ry: 110, fill: glow('#FFFFFF') }, mgR);
  const ribR = mgRibbon(mgR, false); tr(ribR, 1010, 396, 1.1);
  E('path', { d: 'M1064,392 L1136,370 M1064,400 L1136,422', stroke: '#9DB0BF', 'stroke-width': 6, 'stroke-linecap': 'round', fill: 'none' }, mgR);
  const ribCore = E('rect', { x: 956, y: 392, width: 108, height: 8, rx: 4, fill: '#FFFFFF' }, mgR);
  const mgSparks = [0, 1, 2].map(k => spark(mgR, 10, { color: '#FFFFFF', seed: k + 2 }));
  T(mgR, 938, 566, 'magnesium glows white', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const chipFast = chip(mgG, 'fast', { size: 32, fill: C.energy, color: C.bg0 }); tr(chipFast, 938, 618);

  /* ---------- copper, silver and gold in water: nothing ---------- */
  const cuG = G(root);
  const CUX = [410, 690, 970];
  const cuParts = CUX.map((x, i) => {
    const g = G(cuG);
    const bk = beaker(g, 200, 250, { level: 0.72, liquid: CLEAR, opacity: 0.28, marks: false }); tr(bk, x, 380);
    const piece = G(g); tr(piece, x, 458, 1.3);
    if (i === 0) E('rect', { x: -12, y: -62, width: 24, height: 92, rx: 4, fill: ball('#E89B63', '#9C4F22'), stroke: '#F4BC8E', 'stroke-width': 2, transform: 'rotate(14)' }, piece);
    if (i === 1) E('rect', { x: -40, y: 8, width: 80, height: 24, rx: 6, fill: ball('#F2F5F8', '#9AA6B2'), stroke: '#FFFFFF', 'stroke-width': 2 }, piece);
    if (i === 2) E('path', { d: closedPath(blobPts(30, 19, 9, 0, 0.18, 4)), fill: ball('#FFE07A', '#B8860B'), stroke: '#FFF0B0', 'stroke-width': 2, transform: 'translate(0 14)' }, piece);
    const gl = glint(piece, 8); tr(gl, i === 0 ? 4 : i === 1 ? 16 : -10, i === 0 ? -30 : i === 1 ? 14 : 6);
    const name = T(g, x, 560, ['copper', 'silver', 'gold'][i], { size: 34, weight: 700, anchor: 'middle', fill: ['#F0A070', '#E8ECF0', '#F5C542'][i] });
    const cx_ = cross(g, 15); tr(cx_, x, 606);
    return { g, gl, name, cx: cx_ };
  });
  const noChip = chip(cuG, 'no reaction with water', { size: 30, fill: C.card2, stroke: C.bad, color: C.ink }); tr(noChip, 690, 676);

  /* ---------- predict: a mystery metal finds its place ---------- */
  const prG = G(root);
  const markPr = E('line', { x1: 412, y1: FY(HI), x2: 600, y2: FY(HI), stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, prG);
  const mys = G(prG);
  E('path', { d: 'M-78,0 L-64,-12 L-64,12 Z', fill: C.energy }, mys);
  E('rect', { x: -64, y: -24, width: 150, height: 48, rx: 24, fill: '#2B4A5C', stroke: C.energy, 'stroke-width': 3 }, mys);
  E('circle', { cx: -38, cy: 0, r: 17, fill: ball('#B8C4CF', '#5E6B77') }, mys);
  T(mys, -38, 10, '?', { size: 28, weight: 700, anchor: 'middle', fill: INK_DARK });
  T(mys, 22, 10, 'metal', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });     // not "metal X": the X read as a cross
  const prCard = G(prG);
  card(prCard, 650, 268, 500, 236, { fill: C.card, stroke: C.line });
  const prTube = testTube(prCard, 56, 170, { level: 0.55, liquid: '#CFE7F5' }); tr(prTube, 724, 388);
  prTube.liquid.setAttribute('opacity', 0.35);
  const prBub = bubbles(prCard, 708, 400, 32, 66, { n: 6, r: 4.5, seed: 21, speed: 0.6 });
  T(prCard, 790, 344, 'above hydrogen, so…', { size: 28, weight: 600, fill: C.air });
  rich(prCard, 790, 396, [['it ', C.ink], ['will fizz', C.energy, 800]], { size: 36, weight: 700 });
  T(prCard, 790, 440, 'with dilute acid', { size: 30, weight: 600, fill: C.ink });
  const prTick = tick(prCard, 16); tr(prTick, 1108, 470);
  const prChip = chip(prG, 'predict before you test', { size: 32, fill: C.card2, stroke: C.energy, color: C.energy }); tr(prChip, 900, 590);

  /* ---------- timings ---------- */
  const TOPF = [0.18, 0.32, 0.43, 0.57, 0.69, 0.82, 0.905], BOTF = [0.08, 0.41, 0.54, 0.88];
  const tIn = MET.map((m, i) => (i < HI ? mid('top', TOPF[i]) : mid('bottom', BOTF[i - HI])) - 0.12);
  const NA1 = mid('water', 0.51), K1 = mid('water', 0.39), NA2 = mid('eq', 0.49);

  return t => {
    t = Math.min(t, S.D);
    /* ladder mode: 0 = full, 1 = mini */
    const kMini = P(t, at('water') - 0.05, 1.0) * (1 - P(t, at('predict') - 0.1, 1.0));
    const kFull = 1 - kMini;

    // empty slots of the league table
    const slotA = fade(t, S.first - 0.3, 0.5) * (1 - P(t, at('water') - 0.1, 0.5, linear));
    op(slotsG, slotA);
    if (slotA > 0) slots.forEach((s, i) => {
      const hiTop = i === 0 ? win(t, mid('league', 0.48), mid('league', 0.78), 0.3) : 0;
      const hiBot = i === AU ? win(t, mid('league', 0.76), at('top') + 0.2, 0.3) : 0;
      s.setAttribute('stroke', hiTop > 0 ? mix(C.line, C.energy, hiTop) : hiBot > 0 ? mix(C.line, C.ink, hiBot) : C.line);
      op(s, fade(t, S.first - 0.2 + i * 0.05, 0.3) * (0.75 + 0.25 * Math.max(hiTop, hiBot)));
    });

    // rungs: each one pops into its own slot as it is named (the hydrogen rung slides in)
    MET.forEach((m, i) => {
      const a = P(t, tIn[i], 0.2, linear);
      op(m.g, a);
      if (a <= 0) return;
      const p = P(t, tIn[i], 0.45, pop), s = m.hyd ? 1 : Math.max(0.01, 0.55 + 0.45 * p);
      const x = lerp(FX - (m.hyd ? 80 * (1 - P(t, tIn[i], 0.5, easeOut)) : 0), MX, kMini);
      const y = lerp(FY(i) - (m.hyd ? 0 : 10 * (1 - P(t, tIn[i], 0.3, easeOut))), MY(i), kMini);
      tr(m.g, x, y);
      op(m.full, kFull); op(m.mini, kMini);
      if (kFull > 0) tr(m.full, 0, 0, lerp(1, 0.45, kMini) * s);
      if (kMini > 0) tr(m.mini, 0, 0, lerp(1.7, 1, kMini));
      if (m.ini) m.ini.setAttribute('fill', mix(C.ink, C.energy, P(t, mid('zebra', WT[i] || 0) + 0.2, 0.3, linear)));
      // highlights
      let h = 0;
      if (m.hyd) h = win(t, at('hydrogen'), at('water'), 0.4) * (0.75 + 0.25 * wave(t, 1.2));
      if (i <= 1) h = Math.max(h, win(t, mid('water', 0.14), at('mg'), 0.4) * (i === 0 ? 1 : 0.85));
      if (i === 1) h = Math.max(h, win(t, at('eq') + 0.4, at('mg') + 0.2, 0.4));
      if (i === 0) h *= 1 - P(t, at('eq'), 0.5, linear);
      if (i === 3) h = Math.max(h, win(t, mid('mg', 0.04), at('cu'), 0.4));
      if (i >= 8) h = Math.max(h, win(t, mid('cu', [0.02, 0.245, 0.41][i - 8]), at('predict'), 0.3));
      h = Math.max(h, Math.sin(Math.PI * P(t, mid('predict', 0.14) + i * 0.09, 0.45, linear)) * 0.9);
      // "the more vigorously": a glow that is brightest at the top
      h = Math.max(h, win(t, mid('water', 0.14), mid('water', 0.36), 0.4) * (1 - i / 10) * (m.hyd ? 0 : 1));
      op(m.halo, h);
      if (h > 0) { attr(m.halo, 'rx', lerp(205, 58, kMini)); attr(m.halo, 'ry', lerp(54, 30, kMini)); }
    });
    // gold glints
    const gp = Math.max(Math.sin(Math.PI * P(t, mid('bottom', 0.9), 0.8, linear)), Math.sin(Math.PI * P(t, mid('cu', 0.45), 0.8, linear)));
    op(auGlint, gp);
    if (gp > 0) tr(auGlint, lerp(FX - 112, MX + 22, kMini), lerp(FY(AU) - 9, MY(AU) - 8, kMini), 0.6 + 0.5 * gp, t * 40);

    // opening words, then the axis
    const ia = win(t, mid('league', 0.08), mid('league', 0.47), 0.4);
    op(intro, ia);
    if (ia > 0) tr(intro, 0, (1 - P(t, mid('league', 0.08), 0.6, easeOut)) * 14);
    const ax = fade(t, mid('league', 0.48), 0.3) * (1 - P(t, at('hydrogen') - 0.2, 0.5, linear));
    op(axis, ax);
    if (ax > 0) {
      op(most, fade(t, mid('league', 0.48))); op(least, fade(t, mid('league', 0.76)));
      const ap = P(t, mid('league', 0.52), mid('league', 0.86) - mid('league', 0.52), linear);
      axLine.setAttribute('stroke-dashoffset', (1 - ap).toFixed(4)); op(axHead, clamp((ap - 0.9) / 0.1));
      op(axLab, fade(t, mid('league', 0.66), 0.5));
    }

    // mnemonic words slide in beside their rungs as they are spoken
    const wOut = 1 - P(t, at('water') - 0.2, 0.5, linear);
    words.forEach(w => {
      const t0 = mid('zebra', WT[w.i]) - 0.1, p = P(t, t0, 0.38, easeOut);
      op(w.g, clamp(p * 2.5) * wOut);
      if (p > 0 && wOut > 0) tr(w.g, lerp(520, 432, p), FY(w.i));
    });

    // hydrogen is a marker
    const ha = fade(t, at('hydrogen') - 0.1) * (1 - P(t, at('water') - 0.15, 0.45, linear));
    op(hyd, ha);
    if (ha > 0) {
      op(notMetal, fade(t, mid('hydrogen', 0.12), 0.5));
      const mp = P(t, mid('hydrogen', 0.29), 0.8);
      attr(markLine, 'x2', lerp(586, 1150, mp)); op(markLine, mp > 0 ? 1 : 0);
      op(markLab, fade(t, mid('hydrogen', 0.34)));
      tubes.forEach((tt, i) => {
        const p = P(t, mid('hydrogen', 0.46) + i * 0.11, 0.4, pop);
        op(tt, clamp(p * 2)); if (p > 0) { tr(tt, 612, FY(i), Math.max(0.01, p)); tt.upd(t * calm, RATE[i]); }
      });
      brTop.set(P(t, mid('hydrogen', 0.6), 0.6)); op(labTop, fade(t, mid('hydrogen', 0.63)));
      crosses.forEach((c, k) => { const p = P(t, mid('hydrogen', 0.84) + k * 0.12, 0.35, pop); op(c, clamp(p * 2)); tr(c, 612, FY(8 + k), Math.max(0.01, p)); });
      brBot.set(P(t, mid('hydrogen', 0.86), 0.5)); op(labBot, fade(t, mid('hydrogen', 0.9)));
    }

    /* ---- potassium and sodium on cold water ---- */
    const va = win(t, mid('water', 0.1), mid('water', 0.42), 0.4);
    op(vig, va);
    if (va > 0) vigArrow.set(P(t, mid('water', 0.12), 0.8));
    const wa = fade(t, mid('water', 0.04), 0.5) * outBy(t, 'mg');
    op(water, wa);
    if (wa > 0) {
      const kOut = 1 - P(t, at('eq') - 0.25, 0.5, linear);
      const mv = P(t, at('eq') - 0.1, 1.0);
      op(trK, Math.min(fade(t, mid('water', 0.04), 0.5), kOut));
      tr(trK, KX, TRY + (1 - P(t, mid('water', 0.04), 0.6, easeOut)) * 24);
      const nx = lerp(NAX, 685, mv), ny = lerp(TRY, 530, mv);
      tr(trNa, nx, ny + (1 - P(t, mid('water', 0.08), 0.6, easeOut)) * 24);
      op(trNa, fade(t, mid('water', 0.08), 0.5));
      if (kOut > 0) react(trK.R, t, [{ t0: K1, dur: 4.6 }]);
      react(trNa.R, t, [{ t0: NA1, dur: 4.9 }, { t0: NA2, dur: 4.2 }]);
      op(labK, fade(t, K1 - 0.2) * kOut);
      op(labNa, fade(t, NA1 - 0.2) * (1 - P(t, at('eq') - 0.25, 0.4, linear)));
      op(coldChip, win(t, mid('water', 0.65), at('eq') - 0.1, 0.4));
      op(h2Lab, win(t, mid('water', 0.87), at('eq') - 0.1, 0.4));
      // alkaline: ions spread through the sodium trough, indicator turns it purple
      const ionA = fade(t, at('alkaline'), 0.6) * (1 - P(t, at('mg') - 0.3, 0.4, linear));
      op(trNa.ions, ionA);
      if (ionA > 0) {
        const spread = P(t, at('alkaline'), 2.6, easeOut);
        OHS.concat(NAS).forEach((q, k) => { tr(q.g, lerp(q.x0, q.x1, spread) + Math.sin(t * 0.9 * calm + q.ph) * 6, lerp(SURF + 14, q.y1, spread) + Math.cos(t * 0.7 * calm + q.ph) * 4); op(q.g, fade(t, at('alkaline') + k * 0.08, 0.4)); });
      }
      const dp = win(t, mid('alkaline', 0.36), at('mg') - 0.2, 0.4);
      op(dropper, dp); op(uiLab, dp);
      if (dp > 0) { tr(dropper, nx + DROPX, 426 - (1 - P(t, mid('alkaline', 0.36), 0.5, easeOut)) * 30); attr(uiLab, 'x', nx + DROPX + 28); attr(uiLab, 'y', 380); }
      const dropT0 = mid('alkaline', 0.42);
      uiDrops.forEach((d, k) => {
        const u = (t - dropT0 - k * 0.3) / 0.35;
        if (u <= 0 || u >= 1) { op(d, 0); return; }
        tr(d, nx + DROPX, lerp(442, ny + SURF, easeIn(u))); op(d, 1);
      });
      const col = P(t, dropT0 + 0.3, 1.3);
      if (t > at('eq')) { trNa.bk.set(0.62, mix(CLEAR, PURPLE, col)); trNa.bk.liquid.setAttribute('opacity', lerp(0.28, 0.78, col).toFixed(3)); }
      else { trNa.bk.set(0.62, CLEAR); trNa.bk.liquid.setAttribute('opacity', '0.28'); }
      swirl.forEach((s, k) => { const u = clamp((t - dropT0 - 0.3 - k * 0.35) / 1.4); op(s, u > 0 && u < 1 ? 0.8 * (1 - u) : 0); attr(s, 'cx', DROPX - u * 70 * (k ? 0.4 : 1)); attr(s, 'cy', SURF + 20 + u * 30); attr(s, 'rx', 10 + u * 80); attr(s, 'ry', 6 + u * 24); });
      const ap = P(t, mid('alkaline', 0.82), 0.5, pop);
      op(alkChip, clamp(ap * 2)); tr(alkChip, 685, 678 + (1 - clamp(ap)) * 14, Math.max(0.01, 0.9 + 0.1 * ap));
    }

    // the equation rows
    const ea = fade(t, at('eq') - 0.1, 0.4) * outBy(t, 'mg');
    op(eqG, ea);
    if (ea > 0) {
      const dim = P(t, at('alkaline') - 0.1, 0.5, linear);
      [[row1, R1AT], [row2, R2AT]].forEach(([row, ats], r) => row.forEach((p, i) => {
        const a = P(t, mid('eq', ats[i]), 0.45, pop);
        const keep = r === 1 && i === 4;
        op(p.g, clamp(a * 2) * (keep ? 1 : 1 - 0.55 * dim));
        tr(p.g, p.x, p.y, Math.max(0.01, 0.75 + 0.25 * a) * (keep ? 1 + 0.08 * Math.sin(Math.PI * P(t, at('alkaline') + 0.1, 0.7, linear)) : 1));
      }));
      const nh = fade(t, at('alkaline'), 0.5);
      op(naohHalo, nh * (0.7 + 0.3 * wave(t, 1.4))); tr(naohHalo, row2[4].x, row2[4].y);
    }

    /* ---- magnesium ---- */
    const ma = fade(t, at('mg') - 0.05, 0.4) * outBy(t, 'cu');
    op(mgG, ma);
    if (ma > 0) {
      const pl = P(t, mid('mg', 0.16), 0.5, pop), pr = P(t, mid('mg', 0.58), 0.5, pop);
      op(mgL, clamp(pl * 2)); op(mgR, clamp(pr * 2));
      op(chipSlow, fade(t, mid('mg', 0.42))); op(chipFast, fade(t, mid('mg', 0.84)));
      // one slow bubble at a time
      const bu = ((t - mid('mg', 0.2)) / 2.4) % 1;
      if (t > mid('mg', 0.2)) { attr(slowB, 'cx', 452 + Math.sin(t * 2) * 3); attr(slowB, 'cy', 474 - bu * 136); op(slowB, Math.min(1, bu * 6, (1 - bu) * 5)); } else op(slowB, 0);
      // steam puffs onto glowing magnesium
      const gl = P(t, mid('mg', 0.62), 0.7, linear);
      puffs.forEach((pf, k) => {
        const u = ((t * calm * 0.7 + k / puffs.length) % 1);
        attr(pf, 'cx', 852 + u * 150); attr(pf, 'cy', 396 + Math.sin(u * 6 + k) * 10 - u * 14); attr(pf, 'r', 10 + u * 22);
        op(pf, pr > 0 ? 0.55 * Math.sin(u * Math.PI) : 0);
      });
      op(mgHalo, gl * (0.8 + 0.2 * wave(t, 0.5))); op(ribCore, gl * (0.85 + 0.15 * wave(t, 0.33)));
      mgSparks.forEach((s, k) => { const q = ((t * 1.3 * calm + k / 3) % 1); tr(s, 1010 + (k - 1) * 40 + q * 10, 396 - 20 - q * 70, 0.5 + 0.5 * (1 - q)); op(s, gl * Math.sin(q * Math.PI)); s.upd(t); });
    }

    /* ---- copper, silver, gold ---- */
    const ca = fade(t, at('cu') - 0.05, 0.4) * outBy(t, 'predict');
    op(cuG, ca);
    if (ca > 0) {
      cuParts.forEach((c, i) => {
        const p = P(t, mid('cu', [0.0, 0.23, 0.39][i]), 0.45, pop);
        op(c.g, clamp(p * 2)); tr(c.g, 0, (1 - clamp(p)) * 20);
        const xp = P(t, mid('cu', 0.58 + i * 0.07), 0.35, pop); op(c.cx, clamp(xp * 2)); tr(c.cx, CUX[i], 606, Math.max(0.01, xp));
        op(c.gl, 0.35 + 0.65 * wave(t, 1.6, i * 0.3));
      });
      const np = P(t, mid('cu', 0.78), 0.45, pop); op(noChip, clamp(np * 2)); tr(noChip, 690, 676, Math.max(0.01, 0.9 + 0.1 * np));
    }

    /* ---- predict ---- */
    const pa = fade(t, mid('predict', 0.12), 0.5);
    op(prG, pa);
    if (pa > 0) {
      const sp = P(t, mid('predict', 0.38), mid('predict', 0.62) - mid('predict', 0.38));
      const yy = lerp(FY(0), (FY(5) + FY(6)) / 2, sp) + Math.sin(Math.PI * sp) * 0;
      tr(mys, 508, yy); op(mys, fade(t, mid('predict', 0.33), 0.3));
      op(markPr, fade(t, mid('predict', 0.3), 0.4));
      const cp = P(t, mid('predict', 0.6), 0.5, pop); op(prCard, clamp(cp * 2)); tr(prCard, (1 - clamp(cp)) * 30, 0);
      prBub.upd(t * calm, cp > 0 ? 0.8 : 0);
      const tk = P(t, mid('predict', 0.72), 0.35, pop); op(prTick, clamp(tk * 2)); tr(prTick, 1108, 470, Math.max(0.01, tk));
      const pc = P(t, mid('predict', 0.82), 0.45, pop); op(prChip, clamp(pc * 2)); tr(prChip, 900, 590, Math.max(0.01, 0.9 + 0.1 * pc));
    }
  };
});

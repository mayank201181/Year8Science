/* Quick-fire quiz: five question cards, as in the Respiration quiz. Each question shows a small clue
   picture beside a countdown ring that runs through the thinking time; then the answer appears, the
   picture shows why, and a progress dot fills. Pictures: blue litmus over an acid (turns red) -> a pH
   meter reading 12 (the pH bar, alkaline) -> a carbonate fizzing (limewater turns milky) -> an iron nail
   over copper sulfate (the blue fades, copper coats the nail) -> zinc + sulfuric acid -> zinc sulfate.
   Outro: "Brilliant work!", all five dots full, sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy;
  const PH = ['#E8424F', '#E8424F', '#E8424F', '#FF8A3D', '#FF8A3D', '#FFD84D', '#FFD84D', '#56D69B', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#3F8FE8', '#8E5CF0', '#8E5CF0', '#8E5CF0'];
  const RED = '#E8424F', BLUE = '#3F8FE8', ALK = '#A98BFF', CUSO4 = '#1FA2D6', FESO4 = '#B8DDB0', CLEAR = '#CFE7F5';

  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const A = hx(a), B = hx(b); p = clamp(p); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], p)).toString(16).padStart(2, '0')).join(''); };
  let nid = 0;
  const clipD = d => { const id = 'amQuiz' + (++nid), cp = E('clipPath', { id }, defs()); E('path', { d }, cp); return `url(#${id})`; };
  /* position along a polyline, u in 0..1 */
  function along(pts, u) {
    const segs = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < segs.length; i++) { if (d <= segs[i] || i === segs.length - 1) { const f = segs[i] ? d / segs[i] : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } d -= segs[i]; }
    return pts[pts.length - 1];
  }
  /* hollow glass delivery tube through points */
  function glassTube(parent, pts) {
    const d = 'M' + pts.map(p => p.join(',')).join(' L'), g = G(parent);
    E('path', { d, fill: 'none', stroke: '#9DB7C6', 'stroke-width': 11, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('path', { d, fill: 'none', stroke: '#11303D', 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    return g;
  }
  function stopwatch(parent, r) {
    const g = G(parent);
    E('rect', { x: -6, y: -r - 13, width: 12, height: 10, rx: 3, fill: C.muted }, g);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, g);
    const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.7, stroke: Y, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4, fill: Y }, g);
    g.set = turns => hand.setAttribute('transform', `rotate(${(turns * 360).toFixed(1)})`);
    return g;
  }

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
  T(intro, 600, 350, 'Quick-fire quiz', { size: 76, weight: 700, anchor: 'middle' });
  rich(intro, 600, 414, ['Say each answer ', ['out loud', Y, 800], ' before it appears'], { size: 32, anchor: 'middle', fill: C.muted });
  const introBar = G(intro);
  const cells = PH.map((c, i) => E('rect', { x: -255 + i * 34, y: -17, width: 34, height: 34, rx: i === 0 || i === 14 ? 8 : 0, fill: c, stroke: C.bg0, 'stroke-width': 2 }, introBar));
  [[0, '0'], [7, '7'], [14, '14']].forEach(([i, s]) => T(introBar, -238 + i * 34, 48, s, { size: 24, weight: 600, anchor: 'middle', fill: C.muted }));

  /* ---------- the clue pictures (they become the answers' pictures); origin at (300, 556) ---------- */
  // 1. a blue litmus strip over a tube of acid; it dips in and turns red from the wet end up
  function picLitmus(g) {
    const tb = testTube(g, 62, 150, { level: 0.55, liquid: CLEAR, opacity: 0.3 }); tr(tb, -20, 64);
    const strip = G(g);
    const sd = 'M-15,-60 L15,-60 L15,60 L-15,60 Z';
    E('path', { d: sd, fill: BLUE, stroke: '#9CC4F0', 'stroke-width': 2 }, strip);
    const red = E('rect', { x: -15, y: 60, width: 30, height: 0, fill: RED, 'clip-path': clipD(sd) }, strip);
    E('rect', { x: -15, y: -60, width: 30, height: 26, fill: '#A9CBF2' }, strip);
    E('path', { d: sd, fill: 'none', stroke: '#CFE2F8', 'stroke-width': 2 }, strip);
    const lbl = labelLine(g, -78, -78, -34, -60, 'blue litmus', { size: 26, weight: 700, fill: '#8FC0F5', line: '#8FC0F5' });
    const lblA = labelLine(g, -78, 106, -40, 96, 'acid', { size: 28, weight: 700, fill: '#FF7A86', line: '#FF7A86' });
    return t => {
      const dip = P(t, at('a1') - 0.2, 0.55, ease);
      const bob = (1 - dip) * Math.sin(t * 2.2 * calm) * 5 * calm;
      tr(strip, -20, lerp(-86, 30, dip) + bob);
      const wet = P(t, at('a1') + 0.3, 0.9, easeOut);
      attr(red, 'y', 60 - 92 * wet); attr(red, 'height', 92 * wet);
      lbl.set(1 - P(t, at('a1') - 0.3, 0.3, linear)); lblA.set(1);
    };
  }
  // 2. a pH meter reads 12; then the pH bar with a pointer at 12, in the alkaline zone
  function picMeter(g) {
    const m = G(g);
    const bk = beaker(m, 120, 120, { level: 0.6, liquid: CLEAR, opacity: 0.3, marks: false }); tr(bk, -78, 74);
    const probe = G(m);
    E('rect', { x: -5, y: -64, width: 10, height: 112, rx: 5, fill: '#D5DEE6', stroke: '#8C99A6', 'stroke-width': 1.5 }, probe);
    E('circle', { cx: 0, cy: 50, r: 9, fill: ball('#E9F2F7', '#8C99A6') }, probe);
    tr(probe, -78, 64);
    E('path', { d: 'M-78,0 C-78,-60 12,-60 30,-20', fill: 'none', stroke: '#2B3A45', 'stroke-width': 6, 'stroke-linecap': 'round' }, m);
    const box = G(m); tr(box, 86, -10);
    E('rect', { x: -56, y: -78, width: 112, height: 156, rx: 16, fill: ball('#3E4E5A', '#1F2A33'), stroke: '#6E8292', 'stroke-width': 2.5 }, box);
    E('rect', { x: -44, y: -64, width: 88, height: 56, rx: 7, fill: '#C9EBD2', stroke: '#8FB89A', 'stroke-width': 2 }, box);
    T(box, 0, -25, 'pH 12', { size: 28, weight: 700, anchor: 'middle', fill: '#14301E' });
    [[-20, 22], [20, 22], [0, 52]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 10, fill: '#56687A', stroke: '#8296A8', 'stroke-width': 2 }, box));
    // the answer: a full-width pH bar under the answer text (stage x 210-990), the pointer sliding from 7 to 12
    const bar = G(g), CW = 52, BX = -90, BY = 64;
    PH.forEach((c, i) => E('rect', { x: BX + i * CW, y: BY, width: CW, height: 40, rx: i === 0 || i === 14 ? 9 : 0, fill: c, stroke: C.bg0, 'stroke-width': 2 }, bar));
    [[0, '0', C.muted], [7, '7', '#56D69B'], [14, '14', C.muted]].forEach(([i, s2, c]) => T(bar, BX + i * CW + CW / 2, BY + 72, s2, { size: 26, weight: 700, anchor: 'middle', fill: c }));
    const zone = E('rect', { x: BX + 8 * CW - 4, y: BY - 5, width: 7 * CW + 8, height: 50, rx: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4 }, bar);
    const ptr = G(bar);
    E('path', { d: 'M0,0 L-14,-22 L14,-22 Z', fill: '#FFFFFF', stroke: C.bg0, 'stroke-width': 2, 'stroke-linejoin': 'round' }, ptr);
    const n12 = T(bar, BX + 12 * CW + CW / 2, BY + 72, '12', { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    return t => {
      const sw = P(t, at('a2') - 0.1, 0.55);
      m.setAttribute('transform', `translate(${(-40 * sw).toFixed(1)} ${(-50 * sw).toFixed(1)}) scale(${(1 - 0.28 * sw).toFixed(4)})`);
      op(bar, P(t, at('a2') + 0.1, 0.4, linear)); tr(bar, 0, (1 - P(t, at('a2') + 0.1, 0.5, easeOut)) * 16);
      const pp = P(t, at('a2') + 0.45, 0.8, ease);
      tr(ptr, BX + lerp(7, 12, pp) * CW + CW / 2, BY - 4);
      op(n12, P(t, at('a2') + 1.1, 0.3, linear));
      op(zone, P(t, mid('a2', 0.62), 0.4, linear) * (0.7 + 0.3 * wave(t, 1.2)));
    };
  }
  // 3. a carbonate fizzing in acid; the gas bubbles through limewater, which turns milky
  function picLime(g) {
    const A = testTube(g, 58, 160, { level: 0.55, liquid: CLEAR, opacity: 0.3 }); tr(A, -92, 52);
    const lump = G(g); tr(lump, -92, 110);
    E('path', { d: closedPath(blobPts(18, 11, 9, 0, 0.25, 3)), fill: ball('#F2F2EC', '#A9AEA6'), stroke: '#8E948C', 'stroke-width': 1.5 }, lump);
    const fizz = bubbles(g, -110, 36, 36, 70, { n: 9, r: 4.5, seed: 21, speed: 0.9 });
    const lbl = labelLine(g, -130, 122, -106, 112, 'carbonate', { size: 26, weight: 700, fill: '#E6E8E2', line: '#C9CCC4' });
    const B = G(g);
    glassTube(B, [[-92, -28], [-92, -64], [56, -64], [56, 104]]);
    const tB = testTube(B, 58, 150, { level: 0.6, liquid: CLEAR, opacity: 0.25 }); tr(tB, 56, 58);
    const lb = bubbles(B, 44, 70, 24, 52, { n: 6, r: 4, seed: 9, speed: 0.7 });
    const co2s = [0, 1, 2].map(() => molCO2(B, 6));
    const path = [[-92, -28], [-92, -64], [56, -64], [56, 96]];
    return t => {
      fizz.upd(t * calm);
      lbl.set(1 - P(t, at('a3') - 0.2, 0.3, linear));
      const on = P(t, at('a3') - 0.1, 0.45, linear);
      op(B, on);
      if (on > 0) {
        lb.upd(t * calm, P(t, at('a3') + 0.3, 0.4, linear));
        co2s.forEach((m, k) => { const u = ((t - at('a3')) / 1.4 + k / 3) % 1; const p = along(path, u); tr(m, p[0], p[1]); op(m, P(t, at('a3'), 0.3, linear) * Math.min(1, u * 8, (1 - u) * 8)); });
        const mk = P(t, at('a3') + 0.6, 1.6, ease);
        tB.set(0.6, mix(CLEAR, '#EEF3F6', mk)); tB.liquid.setAttribute('opacity', lerp(0.25, 0.9, mk).toFixed(3));
      }
    };
  }
  // 4. an iron nail over blue copper sulfate; time-lapse: the blue fades and copper coats the nail
  function picNail(g) {
    const bk = beaker(g, 150, 150, { level: 0.72, liquid: CUSO4, opacity: 0.85 }); tr(bk, -14, 76);
    const nailG = G(g);
    const L = 140, th = 16;
    const shank = `M${-th / 2},0 L${th / 2},0 L${th / 2},${L - 26} L0,${L} L${-th / 2},${L - 26} Z`;
    E('path', { d: shank, fill: linGrad('#AEB8C2', '#7A8590'), stroke: '#4E5862', 'stroke-width': 2, 'stroke-linejoin': 'round' }, nailG);
    E('rect', { x: -th * 1.3, y: -10, width: th * 2.6, height: 11, rx: 4, fill: linGrad('#AEB8C2', '#7A8590', true), stroke: '#4E5862', 'stroke-width': 2 }, nailG);
    const coat = G(nailG, { 'clip-path': clipD(shank) });
    const coatRect = E('rect', { x: -12, y: L, width: 24, height: 0, fill: '#C8693A' }, coat);
    const bumps = E('path', { d: (() => { const q = rng(7); let d = ''; for (let k = 0; k < 14; k++) { const y = 2 + q() * 56, x = (q() - 0.5) * 14, r = 2.5 + q() * 3; d += `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(2 * r).toFixed(1)},0 a${r.toFixed(1)},${r.toFixed(1)} 0 1,0 ${(-2 * r).toFixed(1)},0 `; } return d; })(), fill: '#E0894E' }, coat);
    const clock = stopwatch(g, 26); tr(clock, 116, -54);
    const surf = 76 + 75 - (150 - 18) * 0.72;                     // liquid surface (pic coordinates)
    return t => {
      const dn = P(t, at('a4') - 0.2, 0.6, ease);
      const ny = lerp(20 - L, 110 - L, dn);
      tr(nailG, -14, ny + (1 - dn) * Math.sin(t * 2 * calm) * 4 * calm);
      const tl = P(t, at('a4') + 0.4, 2.6, linear);
      bk.set(0.72, mix(CUSO4, FESO4, tl)); bk.liquid.setAttribute('opacity', lerp(0.85, 0.75, tl).toFixed(3));
      const dipTop = surf - ny;                                    // nail-frame y of the liquid surface
      const cp = P(t, at('a4') + 0.5, 2.2, easeOut);
      attr(coatRect, 'y', Math.max(dipTop, L - (L - dipTop) * cp)); attr(coatRect, 'height', (L - dipTop) * cp + 2);
      op(bumps, cp * (dipTop < L ? 1 : 0));
      bumps.setAttribute('transform', `translate(0 ${dipTop.toFixed(1)}) scale(1 ${clamp((L - dipTop) / 60).toFixed(3)})`);
      const ck = P(t, at('a4') + 0.2, 0.4, linear); op(clock, ck); clock.set(3 * tl);
    };
  }
  // 5. zinc + sulfuric acid -> ? -> zinc sulfate (+ hydrogen)
  function picZinc(g) {
    const parts = [];
    const add = (el, y) => { tr(el, 0, y); parts.push(el); return el; };
    add(chip(g, 'zinc', { size: 28, fill: '#A9B6C4', color: '#1E2328' }), -132);
    add(T(g, 0, 14, '+', { size: 40, weight: 600, anchor: 'middle', fill: C.muted }), -94);
    add(chip(g, 'sulfuric acid', { size: 28, fill: RED, color: '#FFFFFF' }), -48);
    arrow(g, 0, -16, 0, 22, { color: C.ink, width: 6 });
    const q = chip(g, '?', { size: 34, fill: C.card2, stroke: Y, color: Y }); tr(q, 0, 62);
    const salt = chip(g, 'zinc sulfate', { size: 28, fill: C.good, color: '#0B2A1C' }); tr(salt, 0, 62);
    const hyd = G(g); tr(hyd, 0, 116);
    const hc = chip(hyd, '+ hydrogen', { size: 26, fill: C.card2, stroke: '#E4EBF0', color: '#FFFFFF' });
    const h2 = G(hyd); tr(atom(h2, 'H', 10), -9, 0); tr(atom(h2, 'H', 10), 9, 0); tr(h2, hc.w / 2 + 26, 0);
    return t => {
      const a = P(t, at('a5') - 0.1, 0.5, pop);
      op(q, 1 - clamp(a * 2)); op(salt, clamp(a * 2)); tr(salt, 0, 62, Math.max(0.01, 0.7 + 0.3 * a));
      const hp = P(t, mid('a5', 0.6), 0.5, pop); op(hyd, clamp(hp * 2)); tr(hyd, 0, 116 + (1 - clamp(hp)) * 10);
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: 'What colour does litmus paper\nturn in an acid?', a: [[['It turns ', C.ink], ['red', '#FF5A67', 800], ['.', C.ink]]], pic: picLitmus },
    { q: 'A solution has a pH of 12. Is it\nacidic, neutral or alkaline?', a: [[['Alkaline.', ALK, 800]], [['It’s well above 7.', C.ink]]], pic: picMeter },
    { q: 'Which gas fizzes off when an acid\nreacts with a carbonate?', a: [[['Carbon dioxide', C.co2, 800], [',', C.ink]], [['which turns limewater', C.ink]], [['milky', '#FFFFFF', 800], ['.', C.ink]]], pic: picLime, small: true },
    { q: 'An iron nail goes into blue copper\nsulfate solution. What happens?', a: [[['The iron ', C.ink], ['displaces', Y, 800], [' the copper:', C.ink]], [['the blue fades, and', C.ink]], [['copper', '#E8955A', 800], [' coats the nail.', C.ink]]], pic: picNail, small: true },
    { q: 'Which salt do zinc and\nsulfuric acid make?', a: [[['Zinc sulfate', C.good, 800]], [['not ', C.ink], ['zinc sulfide', C.muted]], [['Plus ', C.ink], ['hydrogen', '#FFFFFF', 800], [' gas.', C.ink]]], pic: picZinc, small: true, five: true },
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
    const pic = G(g); tr(pic, 300, 556);
    const anim = d.pic(pic) || (() => {});
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 470, 450);
    T(ans, 492, 461, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = d.small ? 34 : 40, lh = d.small ? 44 : 52, y0 = d.small ? 512 : 526;
    d.a.forEach((line, k) => rich(ans, 464, y0 + k * lh, line, { size, weight: 700 }));
    let extra = null;
    if (d.five) {
      // a tick after "Zinc sulfate", a strike through "zinc sulfide"
      const w1 = textWidth('Zinc sulfate', size, FD, 800), tk2 = tick(ans, 13, C.good); tr(tk2, 464 + w1 + 30, y0 - 12);
      const x1 = 464 + textWidth('not ', size, FD, 700), x2 = x1 + textWidth('zinc sulfide', size, FD, 700);
      extra = strike(ans, x1 - 4, y0 + lh - 11, x2 + 4, C.bad);
    }
    return { g, qc, think, rg, num, ans, pic, anim, extra, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  // the sparks whose resting place (with its glow) is clear of all the text stay, twinkling
  const TEXT_BOX = [[300, 240, 900, 350], [130, 362, 1070, 420], [270, 458, 930, 522], [500, 538, 700, 590]];
  for (let k = 0; k < 14; k++) {
    const s = spark(burst, 12 + br() * 10, { seed: k }), a = (k / 14) * TAU + br() * 0.3, d = 200 + br() * 120;
    const x = 600 + Math.cos(a) * d * 1.5, y = 300 + Math.sin(a) * d * 0.85, m = 40;
    const clear = x > 60 && x < 1140 && y > 110 && y < 690 && TEXT_BOX.every(([x0, y0, x1, y1]) => x + m < x0 || x - m > x1 || y + m < y0 || y - m > y1);
    sparks.push({ s, a, d, dl: br() * 0.4, k, stay: clear });
  }
  T(outro, 600, 330, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  rich(outro, 600, 404, ['Now try the ', ['Acids, Bases & Metals quiz', Y, 800], ' in your Science Lab'], { size: 32, anchor: 'middle', fill: C.muted });
  const labChip = chip(outro, 'Science Lab  ›  Acids, Bases & Metals  ›  Quiz', { size: 26, fill: C.card2, stroke: C.line, sw: 2 });
  tr(labChip, 600, 490);
  const lockT = rich(outro, 600, 572, [['to ', C.muted], ['lock it in', Y, 800]], { size: 30, anchor: 'middle' });

  /* ---------- update ---------- */
  return t => {
    // progress dots: the current question's dot grows; each fills as its answer arrives; all five
    // pulse in turn at the outro
    op(dotsG, P(t, S.first - 0.4, 0.5, linear));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      const cheer = Math.sin(Math.PI * P(t, at('outro') + i * 0.12, 0.45, linear));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1 + 0.35 * cheer);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      const pi = P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop);
      op(d.g, clamp(pi * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.15, 0.3);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
      const bp = P(t, mid('intro', 0.3), 0.6, easeOut); op(introBar, bp); tr(introBar, 600, 528 + (1 - bp) * 18);
      cells.forEach((c, i) => tr(c, 0, -4 * Math.sin(Math.PI * P(t, mid('intro', 0.45) + i * 0.05, 0.35, linear))));
    }

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.15, nx - 0.15, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const pp = P(t, tq + 0.2, 0.5, pop);
      op(q.pic, clamp(pp * 2)); tr(q.pic, 300, 556 + (1 - clamp(pp)) * 20);
      q.anim(t);
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
      if (q.extra) q.extra.set(P(t, mid('a5', 0.3), 0.4, easeOut));
    });

    // outro: a burst of sparks, and some stay twinkling
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4), d = easeOut(u) * o.d, stay = o.stay;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI) + (stay ? 0.35 * u : 0));
        op(o.s, u <= 0 ? 0 : stay ? Math.max(Math.sin(Math.min(1, u) * Math.PI), u > 0.5 ? 0.7 * (0.6 + 0.4 * wave(t, 1.6, o.k * 0.13)) : 0) : Math.sin(Math.min(1, u) * Math.PI) * 0.95);
        o.s.upd(t);
      });
      op(labChip, P(t, mid('outro', 0.5), 0.5, linear));
      op(lockT, P(t, mid('outro', 0.82), 0.5, linear));
    }
  };
});

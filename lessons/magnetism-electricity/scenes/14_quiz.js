/* Quick-fire quiz: five question cards, each with a picture. A countdown ring runs through the silent
   thinking time, then the answer appears, the picture acts it out, and a progress dot fills.
   Showpiece: electrons hop from the cloth onto the rubbed plastic rod. Outro: "Brilliant work!" with sparks. */
scene('quiz', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const Y = C.energy, RED = '#E8424F', BLUE = '#3B82F6', COPPER = '#D9893F';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  const fade = (t, t0, d) => P(t, t0, d || 0.4, linear);
  function electron(parent, r) {
    const f = v => (+v).toFixed(1);
    return E('path', { d: `M${f(-r)},0 a${f(r)},${f(r)} 0 1,0 ${f(2 * r)},0 a${f(r)},${f(r)} 0 1,0 ${f(-2 * r)},0 Z M${f(-r * 0.48)},0 H${f(r * 0.48)}`, fill: ball(C.water, C.waterDk), stroke: '#F2FBFF', 'stroke-width': f(r * 0.27), 'stroke-linecap': 'round' }, parent);
  }
  function plusT(parent, s) {
    const w = s * 0.32, f = v => (+v).toFixed(1);
    return E('path', { d: `M${f(-s)},${f(-w)} H${f(-w)} V${f(-s)} H${f(w)} V${f(-w)} H${f(s)} V${f(w)} H${f(w)} V${f(s)} H${f(-w)} V${f(w)} H${f(-s)} Z`, fill: C.bad, stroke: C.bg0, 'stroke-width': f(s * 0.3), 'stroke-linejoin': 'round', 'paint-order': 'stroke' }, parent);
  }
  const noLead = el => { el.firstChild.style.display = 'none'; return el; };      // the wire under it is its lead
  /* the compass (the same as 02_fields and 03_earth): g.set(deg) points the red end */
  function compass(parent, r, o) {
    o = o || {};
    const g = G(parent);
    E('circle', { r, fill: C.card, stroke: o.rim || C.line, 'stroke-width': Math.max(3, r * 0.09) }, g);
    const nd = G(g), L = r * 0.78, w = Math.max(5, r * 0.2);
    E('path', { d: `M${L},0 L0,${-w} L0,${w} Z`, fill: RED, stroke: '#FFB3B9', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('path', { d: `M${-L},0 L0,${-w} L0,${w} Z`, fill: C.ink, stroke: '#ffffff', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('circle', { r: Math.max(3, r * 0.11), fill: C.bg0, stroke: C.ink, 'stroke-width': 2 }, g);
    E('path', { d: `M${(-r * 0.62).toFixed(1)},${(-r * 0.5).toFixed(1)} A${(r * 0.8).toFixed(1)},${(r * 0.8).toFixed(1)} 0 0 1 ${(r * 0.1).toFixed(1)},${(-r * 0.8).toFixed(1)}`, fill: 'none', stroke: '#ffffff', 'stroke-width': Math.max(2, r * 0.06), opacity: 0.22, 'stroke-linecap': 'round' }, g);
    g.L = L;
    g.set = deg => nd.setAttribute('transform', `rotate(${deg.toFixed(2)})`);
    g.set(0);
    return g;
  }
  /* the nail electromagnet, paperclip, clip chain and current track: copied from 05_electro */
  const COPPER_DK = '#8A5426', CLIPC = '#C3CEDA';
  function track(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { pts, cum, L: cum[cum.length - 1] };
  }
  const TQ = [0, 0, 0];                      // trackAt's result, reused (read it straight away)
  function trackAt(tk, s) {
    s = ((s % tk.L) + tk.L) % tk.L;
    let lo = 0, hi = tk.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tk.cum[m] <= s) lo = m; else hi = m; }
    const a = tk.pts[lo], b = tk.pts[hi], f = (s - tk.cum[lo]) / ((tk.cum[hi] - tk.cum[lo]) || 1);
    TQ[0] = a[0] + (b[0] - a[0]) * f; TQ[1] = a[1] + (b[1] - a[1]) * f; TQ[2] = Math.min(a[2], b[2]);
    return TQ;
  }
  const shift = (pts, dx, dy, s) => pts.map(p => [dx + (s || 1) * p[0], dy + (s || 1) * p[1], p[2]]);
  // steel paperclip, upright: top hook about (3,-32), bottom hook (0,35)
  const CLIP_D = 'M5,-18 L5,22 A5,5 0 0 1 -5,22 L-5,-26 A8,8 0 0 1 11,-26 L11,26 A11,11 0 0 1 -11,26 L-11,-10';
  function clip(parent) { const g = G(parent); E('path', { d: CLIP_D, fill: 'none', stroke: CLIPC, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g); return g; }
  // poses of a chain of n clips hanging from (px, py); s = clip scale
  function chain(px, py, n, sway, s) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const r = -sway * (1 + 0.35 * i), rad = r * Math.PI / 180, co = Math.cos(rad), si = Math.sin(rad);
      const cx = px - s * (3 * co + 32 * si), cy = py - s * (3 * si - 32 * co);
      px = cx - s * 35 * si; py = cy + s * 35 * co;
      out.push([cx, cy, r]);
    }
    return out;
  }
  // AA cell on its side, 150 x 52: the copper-coloured + end (with the nub) on the left (copied from 05_electro)
  function aaCell(parent) {
    const g = G(parent), w = 150, h = 52, x0 = -w / 2, y0 = -h / 2;
    E('rect', { x: x0, y: y0, width: w, height: h, rx: 9, fill: linGrad('#3E4D59', '#1A232B', true), stroke: '#7D8C99', 'stroke-width': 2 }, g);
    E('path', { d: `M${x0 + 9},${y0} L${x0 + 54},${y0} L${x0 + 54},${y0 + h} L${x0 + 9},${y0 + h} Q${x0},${y0 + h} ${x0},${y0 + h - 9} L${x0},${y0 + 9} Q${x0},${y0} ${x0 + 9},${y0} Z`, fill: linGrad('#F0B06A', '#9A5A22', true) }, g);
    E('rect', { x: x0 - 9, y: -10, width: 11, height: 20, rx: 3, fill: '#C9D3DC', stroke: '#EEF3F6', 'stroke-width': 1.5 }, g);
    E('rect', { x: x0 + 8, y: y0 + 6, width: w - 16, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.18 }, g);
    T(g, x0 + 27, 11, '+', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2000' });
    T(g, x0 + w - 24, 10, '−', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }
  /* the nail electromagnet: an iron nail (point on the right) centred on (0,0), 420 x 26, wrapped in
     n turns between x = c0 and c1 (back halves dimmer, behind the nail). Current entering at the
     left end runs down the front of each turn, so the point is a north pole. */
  function nailRig(parent, o) {
    o = o || {};
    const n = o.turns || 10, c0 = o.c0 !== undefined ? o.c0 : -120, c1 = o.c1 !== undefined ? o.c1 : 110;
    const R = o.R || 21, yaw = o.yaw !== undefined ? o.yaw : 0.32, ww = o.wire || 5.5;
    const g = G(parent);
    const back = E('path', { fill: 'none', stroke: o.dark || COPPER_DK, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const nail = G(g), steel = linGrad('#DCE4EA', '#66737F', true);
    E('path', { d: 'M-200,-13 L168,-13 L212,0 L168,13 L-200,13 Z', fill: steel, stroke: '#EEF3F6', 'stroke-width': 2, 'stroke-linejoin': 'round' }, nail);
    E('rect', { x: -214, y: -27, width: 16, height: 54, rx: 5, fill: steel, stroke: '#EEF3F6', 'stroke-width': 2 }, nail);
    E('path', { d: 'M-194,-6 L160,-6', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.4, 'stroke-linecap': 'round' }, nail);
    const front = E('path', { fill: 'none', stroke: o.color || COPPER, 'stroke-width': ww, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const th0 = Math.PI, th1 = Math.PI + TAU * n;
    const X = th => c0 + (c1 - c0) * (th - th0) / (th1 - th0) + R * yaw * Math.sin(th), Y = th => -R * Math.cos(th);
    let db = '', df = '';
    for (let k = 0; k < 2 * n; k++) {
      const a = th0 + k * Math.PI; let d = '';
      for (let i = 0; i <= 8; i++) { const th = a + Math.PI * i / 8; d += (i ? 'L' : 'M') + X(th).toFixed(1) + ',' + Y(th).toFixed(1); }
      if (k % 2) df += d; else db += d;
    }
    back.setAttribute('d', db); front.setAttribute('d', df);
    g.th0 = th0; g.th1 = th1; g.n = n;
    g.start = [X(th0), Y(th0)]; g.end = [X(th1), Y(th1)];
    g.samples = () => { const out = []; for (let th = th0; th <= th1 + 1e-6; th += Math.PI / 10) out.push([X(th), Y(th), Math.sin(th) > 0.08 ? 1 : 0]); return out; };
    return g;
  }
  const qMark = (parent, x, y, s) => T(parent, x, y, '?', { size: s || 64, weight: 700, fill: Y, anchor: 'middle' });

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
  const introDots = [0, 1, 2, 3, 4].map(k => { const g = G(intro); tr(g, 600 + (k - 2) * 70, 500); E('circle', { r: 22, fill: C.card2, stroke: C.muted, 'stroke-width': 3 }, g); T(g, 0, 9, String(k + 1), { size: 26, weight: 700, anchor: 'middle' }); return g; });

  /* ---------- pictures: each draws around (0,0) and returns (t, tAnswer) => update ---------- */
  // 1. the Earth: which pole is near geographic North?
  function picEarth(g) {
    const ER = 104, EYc = 26;
    E('circle', { cx: 0, cy: EYc, r: ER, fill: ball('#3E8FD8', '#1B4F86'), stroke: '#9FD8FF', 'stroke-width': 3 }, g);
    E('path', { d: `M-66,${EYc - 54} C-28,${EYc - 84} 8,${EYc - 64} 2,${EYc - 30} C-4,${EYc - 2} -56,${EYc + 4} -80,${EYc - 18} Z M28,${EYc + 18} C64,${EYc + 4} 88,${EYc + 36} 64,${EYc + 70} C40,${EYc + 88} 14,${EYc + 64} 28,${EYc + 18} Z`, fill: '#4FB878', opacity: 0.85 }, g);
    E('line', { x1: 0, y1: EYc - ER - 14, x2: 0, y2: EYc + ER + 14, stroke: '#E4ECF5', 'stroke-width': 3, 'stroke-dasharray': '7 6' }, g);
    T(g, 0, EYc - ER - 24, 'geographic North', { size: 26, weight: 600, anchor: 'middle' });
    const mag = G(g); tr(mag, 0, EYc);
    E('rect', { x: -17, y: -64, width: 34, height: 64, rx: 6, fill: ball(BLUE, '#1E4FA8') }, mag);
    E('rect', { x: -17, y: 0, width: 34, height: 64, rx: 6, fill: ball(RED, '#A4232E') }, mag);
    T(mag, 0, -22, 'S', { size: 28, weight: 700, fill: '#fff', anchor: 'middle' });
    T(mag, 0, 44, 'N', { size: 28, weight: 700, fill: '#fff', anchor: 'middle' });
    const sGlow = E('circle', { cx: 0, cy: EYc - 40, r: 44, fill: glow(BLUE) }, g);
    const q = qMark(g, 0, EYc - 18, 70);
    const cg = compass(g, 32); tr(cg, -138, EYc - 86);
    const toS = Math.atan2(EYc - 40 - (EYc - 86), 0 - (-138)) * 180 / Math.PI + 90;   // red end towards the magnetic S
    return (t, ta) => {
      const rv = P(t, ta - 0.05, 0.6, linear), sw = P(t, ta + 0.25, 0.9, easeOut);
      op(mag, rv); op(sGlow, rv * (0.55 + 0.45 * wave(t, 1.2))); op(q, (1 - rv) * (0.75 + 0.25 * wave(t, 1.1)));
      const wob = (1 - sw) * (Math.sin(t * 2.3) * 30 + Math.sin(t * 5.1) * 8) * calm;
      cg.set(lerp(-40, toS, sw) + wob - 90);                     // angles above are measured from straight up
    };
  }
  // 2. the nail electromagnet (drawn as in 05_electro): three ways to make it stronger
  function picNail(g) {
    const ES = 0.8, CS = 0.75, N0 = [-30, -56], BY = 62;
    const cL = N0[0] + ES * -120, cR = N0[0] + ES * 110, cY = N0[1] + ES * 21;          // the coil's two ends
    const CB = (cL + cR) / 2, pE = CB - 84 * CS, nE = CB + 77 * CS;                    // the AA cell on the bottom wire: its + nub and - end
    E('path', { d: `M${pE},${BY} L${cL},${BY} L${cL},${cY} M${cR},${cY} L${cR},${BY} L${nE},${BY}`, fill: 'none', stroke: COPPER, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    const tip = [N0[0] + 212 * ES, N0[1] + 1];
    const tipGlow = E('ellipse', { cx: tip[0], cy: tip[1], rx: 56, ry: 46, fill: glow(C.energy) }, g);
    const coreGlow = E('rect', { x: N0[0] - 206 * ES, y: N0[1] - 17, width: 422 * ES, height: 34, rx: 14, fill: 'none', stroke: Y, 'stroke-width': 4 }, g);
    // one nail with a 6-turn coil; the 12-turn coil's halves join it, behind and in front of the nail
    const rig = nailRig(g, { turns: 6 }), r12 = nailRig(g, { turns: 12 });
    tr(rig, N0[0], N0[1], ES);
    const b6 = rig.childNodes[0], f6 = rig.childNodes[2], b12 = r12.childNodes[0], f12 = r12.childNodes[2];
    rig.insertBefore(b12, rig.childNodes[1]); rig.appendChild(f12); r12.remove();
    tr(aaCell(g), CB, BY, CS);
    // the current: out of +, round through the coil (down the front of each turn), into -
    const mk = r => track([[pE, BY, 1], [cL, BY, 1], [cL, cY, 1], ...shift(r.samples(), N0[0], N0[1], ES), [cR, cY, 1], [cR, BY, 1], [nE, BY, 1]]);
    const t6 = mk(rig), t12 = mk(r12);
    const dotsG = G(g), dts = []; for (let k = 0; k < Math.round(t12.L / 30); k++) dts.push(E('circle', { r: 5, fill: Y }, dotsG));
    const clips = [0, 1, 2, 3].map(() => clip(g));
    const q = qMark(g, N0[0], N0[1] - 52, 60);
    const CHX = [-138, -6, 142];
    const chips = ['turns', 'current', 'iron core'].map((txt, k) => { const c = G(g); tr(c, CHX[k], 156); chip(c, txt, { size: 26, fill: C.card2, stroke: Y, sw: 2 }); return c; });
    return (t, ta) => {
      const s1 = ta - 0.05, s2 = mid('a2', 0.3), s3 = mid('a2', 0.62);
      const k1 = popIn(t, s1, 0.4), k2 = popIn(t, s2, 0.4), k3 = popIn(t, s3, 0.4);
      [k1, k2, k3].forEach((k, i) => { op(chips[i], clamp(k * 2)); tr(chips[i], CHX[i], 156 + (1 - clamp(k)) * 10); });
      // more turns: 6 -> 12; more current: the dots go twice as fast; the iron core glows
      const more = fade(t, s1, 0.3); op(b6, 1 - more); op(f6, 1 - more); op(b12, more); op(f12, more);
      const ex = t < s2 ? 0 : t < s2 + 0.3 ? (t - s2) * (t - s2) / 0.6 : t - s2 - 0.15;
      const tk = more < 0.5 ? t6 : t12, n = Math.round(tk.L / 30), d = 60 * (t + ex);
      dts.forEach((c, i) => { if (i >= n) { op(c, 0); return; } const p = trackAt(tk, i * tk.L / n + d); attr(c, 'cx', p[0]); attr(c, 'cy', p[1]); op(c, p[2]); });
      op(coreGlow, win(t, s3, s3 + 1.2, 0.25));
      const nOn = 1 + (t >= s1 + 0.2 ? 1 : 0) + (t >= s2 + 0.2 ? 1 : 0) + (t >= s3 + 0.2 ? 1 : 0);
      const poses = chain(tip[0], tip[1], 4, calm * 2.4 * Math.sin(t * 2.2), ES);
      clips.forEach((c, i) => { tr(c, poses[i][0], poses[i][1], ES, poses[i][2]); op(c, i < nOn ? 1 : 0); });
      op(tipGlow, 0.4 + 0.15 * nOn + 0.1 * wave(t, 0.9));
      op(q, (1 - fade(t, ta - 0.1, 0.3)) * (0.75 + 0.25 * wave(t, 1.1)));
    };
  }
  // 3. a bulb and a loose voltmeter
  function picVolt(g) {
    const L = -150, R = 150, Tp = -20, Bt = 110;
    const w = wire(g, [[-59, Bt], [L, Bt], [L, Tp], [R, Tp], [R, Bt], [59, Bt]], { spacing: 44 });
    const bat = G(g); tr(bat, 0, Bt); cellSym(bat, { cells: 2 });
    const bl = G(g); tr(bl, 0, Tp); noLead(bulbSym(bl)).set(1);
    const branch = E('path', { d: `M-78,${Tp} V${Tp - 84} H78 V${Tp}`, fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
    const jn = [E('circle', { cx: -78, cy: Tp, r: 7, fill: C.ink }, g), E('circle', { cx: 78, cy: Tp, r: 7, fill: C.ink }, g)];
    const vm = G(g); const V = meterSym(vm, 'V');
    const q = qMark(g, 150, -150, 56);
    const lab = T(g, 0, 172, 'in parallel', { size: 30, weight: 700, fill: Y, anchor: 'middle' });
    return (t, ta) => {
      w.upd(t, 60);
      const m = P(t, ta - 0.05, 0.8);
      const x = lerp(96, 0, m), y = lerp(-160, Tp - 84, m), r = lerp(-14, 0, m) + (1 - m) * Math.sin(t * 2.2) * 6 * calm;
      tr(vm, x, y + (1 - m) * Math.sin(t * 1.6) * 4 * calm, 1, r);
      branch.setAttribute('stroke-dashoffset', (1 - P(t, ta + 0.5, 0.6)).toFixed(3));
      const jp = fade(t, ta + 1.0, 0.2); jn.forEach(j => op(j, jp));
      V.set(t > ta + 1.1 ? '3 V' : '');
      op(q, (1 - fade(t, ta - 0.1, 0.3)) * (0.75 + 0.25 * wave(t, 1.1)));
      op(lab, fade(t, ta + 0.9, 0.4));
    };
  }
  // 4. two bulbs in series; one breaks
  function picSeries(g) {
    const L = -170, R = 170, Tp = -30, Bt = 100, BX = [-74, 74];
    const segs = [
      wire(g, [[-59, Bt], [L, Bt], [L, Tp], [BX[0] - 46, Tp]], { spacing: 40 }),
      wire(g, [[BX[0] + 46, Tp], [BX[1] - 46, Tp]], { spacing: 40 }),
      wire(g, [[BX[1] + 46, Tp], [R, Tp], [R, Bt], [59, Bt]], { spacing: 40 }),
    ];
    const bat = G(g); tr(bat, 0, Bt); cellSym(bat, { cells: 2 });
    const bulbs = BX.map(x => { const b = G(g); tr(b, x, Tp); return { b, s: bulbSym(b), x }; });
    const crack = E('path', { d: 'M-8,-22 L-2,-8 L-9,2 L-1,14', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, bulbs[1].b);
    const gapMark = E('path', { d: `M${BX[1] - 46},${Tp - 20} V${Tp + 20} M${BX[1] + 46},${Tp - 20} V${Tp + 20}`, stroke: C.bad, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-dasharray': '6 6' }, g);
    const lab = T(g, 0, 168, 'one loop, broken', { size: 30, weight: 700, fill: Y, anchor: 'middle' });
    return (t, ta) => {
      const brk = ta - 0.05, broken = t >= brk;
      const flick = t > at('q4') + 0.6 && !broken ? 0.4 * (0.55 + 0.45 * Math.abs(Math.sin(t * 7.3) * Math.sin(t * 3.1))) : 0.4;
      bulbs[0].s.set(broken ? 0 : 0.4); bulbs[1].s.set(broken ? 0 : flick);
      op(crack, fade(t, at('q4') + 0.6, 0.3));
      const fall = P(t, brk, 0.6, easeIn);
      tr(bulbs[1].b, BX[1] + fall * 30, Tp + fall * 150, 1, fall * 70); op(bulbs[1].b, 1 - P(t, brk + 0.35, 0.3, linear));
      const tf = Math.min(t, brk);
      segs.forEach(s => { s.upd(tf, 30); s.set(broken ? 1 - fade(t, brk + 0.3, 0.5) : 1); });
      op(gapMark, fade(t, brk + 0.4, 0.3));
      op(lab, fade(t, ta + 0.5, 0.4));
    };
  }
  // 5. a plastic rod rubbed with a cloth (showpiece: electrons hop across)
  function picRod(g) {
    const rod = G(g);
    E('rect', { x: -170, y: -66, width: 330, height: 34, rx: 17, fill: linGrad('#F1ECDF', '#B9B19C', true), stroke: '#FFFFFF', 'stroke-width': 2 }, rod);
    E('rect', { x: -150, y: -60, width: 290, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.6 }, rod);
    const rodLab = T(g, -5, -88, 'plastic rod', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    const cloth = G(g);
    E('path', { d: 'M-70,-18 C-40,-30 20,-6 70,-20 C78,4 74,34 66,54 C20,40 -30,62 -72,50 C-80,26 -78,4 -70,-18 Z', fill: ball('#E0A85A', '#9C6A2A'), stroke: '#F5D3A0', 'stroke-width': 2.5 }, cloth);
    E('path', { d: 'M-56,6 C-20,-2 20,14 58,2 M-58,30 C-20,22 22,38 60,26', fill: 'none', stroke: '#B57E3A', 'stroke-width': 2.5, opacity: 0.8 }, cloth);
    const clothLab = T(g, 0, 136, 'cloth', { size: 26, weight: 600, fill: C.muted, anchor: 'middle' });
    const HOP = [[-44, 6], [-14, 18], [16, 4], [44, 20], [-28, 38], [30, 40]];      // on the cloth (cloth coords)
    const LAND = [-130, -84, -38, 8, 54, 100];                                       // along the rod
    const es = HOP.map(() => electron(g, 12)), ps = HOP.map(() => plusT(g, 11));
    const q = qMark(g, 150, -110, 56);
    const lbRod = rich(g, -5, -88, [['rod: ', C.ink], ['negative', C.water, 800]], { size: 26, anchor: 'middle' });
    const lbCloth = rich(g, 0, 136, [['cloth: ', C.ink], ['positive', C.bad, 800]], { size: 26, anchor: 'middle' });
    return (t, ta) => {
      const rubOn = clamp((t - (at('q5') + 0.2)) / 0.3) * (1 - P(t, end('q5') + 0.6, 0.4, linear));
      const cx = Math.sin((t - at('q5')) * TAU / 0.7) * 90 * rubOn * (S.reduce ? 0.4 : 1);
      const lift = 1 - P(t, end('q5') + 0.6, 0.8);     // the cloth wraps the rod while rubbing, then drops below it
      const cy = lerp(56, -30, lift * clamp((t - at('q5') + 0.2) / 0.4));
      tr(cloth, cx, cy, 1, cx * 0.04);
      HOP.forEach(([hx, hy], k) => {
        const t0 = ta - 0.15 + k * 0.17, u = clamp((t - t0) / 0.42);
        const src = [cx + hx, cy + hy], dst = [LAND[k], -49];
        if (t < t0) { op(es[k], 0); op(ps[k], 0); return; }
        const p = ease(u), arc = Math.sin(p * Math.PI) * 36;
        tr(es[k], lerp(src[0], dst[0], p), lerp(src[1], dst[1], p) - arc); op(es[k], Math.min(1, (t - t0) / 0.1));
        tr(ps[k], src[0], src[1], Math.max(0.01, popIn(t, t0 + 0.1, 0.35))); op(ps[k], clamp(popIn(t, t0 + 0.1, 0.35) * 2));
      });
      op(q, (1 - fade(t, ta - 0.1, 0.3)) * (0.75 + 0.25 * wave(t, 1.1)));
      const lb = fade(t, ta + 0.9, 0.3);
      op(lbRod, lb); op(lbCloth, lb); op(clothLab, 1 - lb); op(rodLab, 1 - lb);
    };
  }

  /* ---------- the five questions ---------- */
  const QS = [
    { q: ['Which magnetic pole of the Earth', 'is near the geographic North?'], pic: picEarth,
      a: [[['Its magnetic ', C.ink], ['south', '#7FB2FF', 800], [' pole.', C.ink]], [['It attracts the ', C.ink], ['north', '#FF8A94', 800], [' end', C.ink]], [['of a compass.', C.ink]]] },
    { q: ['Give three ways to make', 'an electromagnet stronger.'], pic: picNail,
      a: [[['More ', C.ink], ['turns', Y, 800], [',', C.ink]], [['more ', C.ink], ['current', Y, 800], [',', C.ink]], [['and an ', C.ink], ['iron core', Y, 800], ['.', C.ink]]] },
    { q: ['How should a voltmeter be', 'connected to a bulb?'], pic: picVolt,
      a: [[['In ', C.ink], ['parallel', Y, 800], [':', C.ink]], [['across', Y, 800], [' the bulb.', C.ink]]] },
    { q: ['Two bulbs are in series, and one breaks.', 'What happens to the other?'], pic: picSeries,
      a: [[['It ', C.ink], ['goes out', Y, 800], [':', C.ink]], [['the single loop', C.ink]], [['is broken.', C.ink]]] },
    { q: ['A rubbed plastic rod becomes negatively', 'charged. What has it gained?'], pic: picRod,
      a: [[['Electrons', C.water, 800], [',', C.ink]], [['from the cloth.', C.ink]]] },
  ].map((d, i) => {
    const g = G(root);
    const qc = G(g);
    card(qc, 120, 118, 960, 226, { fill: C.card, stroke: C.line });
    T(qc, 600, 166, `QUESTION ${i + 1} OF 5`, { size: 24, weight: 700, fill: C.muted, anchor: 'middle', font: FB, ls: 2 });
    const qs = Math.min(40, ...d.q.map(l => Math.floor(40 * 890 / Math.max(890, textWidth(l, 40, FD, 700)))));
    d.q.forEach((l, k) => T(qc, 600, (d.q.length > 1 ? 232 : 256) + k * 54, l, { size: qs, weight: 700, anchor: 'middle' }));
    const picG = G(g); tr(picG, 300, 530);
    const anim = d.pic(picG);
    const think = G(g); tr(think, 850, 520);
    const rg = ring(think, 54, Y);
    const num = T(think, 0, 16, '4', { size: 46, weight: 700, anchor: 'middle' });
    T(think, 0, 102, 'think…', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    const ans = G(g);
    const tk = tick(ans, 12, C.good); tr(tk, 596, 428);
    T(ans, 618, 439, 'Answer', { size: 26, weight: 700, fill: C.good });
    const size = Math.min(40, ...d.a.map(l => Math.floor(40 * 520 / Math.max(520, textWidth(plain(l), 40, FD, 700)))));
    d.a.forEach((line, k) => rich(ans, 584, 500 + k * 54, line, { size, weight: 700 }));
    return { g, qc, picG, anim, think, rg, num, ans, k: i + 1 };
  });

  /* ---------- outro ---------- */
  const outro = G(root);
  const burst = G(outro);
  const sparks = [];
  const br = rng(17);
  for (let k = 0; k < 14; k++) { const s = spark(burst, 12 + br() * 10, { seed: k }); sparks.push({ s, a: (k / 14) * TAU + br() * 0.3, d: 200 + br() * 120, dl: br() * 0.4 }); }
  T(outro, 600, 318, 'Brilliant work!', { size: 80, weight: 700, anchor: 'middle' });
  const labChip = chip(outro, 'Try the Magnetism & Electricity quiz', { size: 32, fill: Y, color: C.bg0 });
  tr(labChip, 600, 412);
  const sub = T(outro, 600, 486, 'in your Science Lab, to lock it in', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const mini = G(outro); tr(mini, 600, 600);
  const mm = magnet(mini, 150, 44); tr(mm, -150, 0);
  const mb = G(mini); tr(mb, 0, 0); const mbs = bulbSym(mb);
  const me = G(mini); tr(me, 150, 0); bolt(me, 0.5, C.energyLt);

  /* ---------- update ---------- */
  return t => {
    // progress dots
    op(dotsG, P(t, S.first - 0.4, 0.5, linear) * (1 - fade(t, at('outro') + 0.4, 0.5)));
    dots.forEach((d, i) => {
      const k = i + 1, ans = at('a' + k), cur = t >= at('q' + k) - 0.15 && t < ans;
      const pf = P(t, ans - 0.05, 0.4, pop);
      op(d.fill, clamp(pf * 2)); op(d.tk, clamp(pf * 2));
      tr(d.g, 984 + i * 42, 58, cur ? 1.18 + 0.06 * wave(t, 1) : 1);
      d.ring_.setAttribute('stroke', cur ? Y : C.muted);
      op(d.g, clamp(P(t, mid('intro', 0.45 + i * 0.08), 0.4, pop) * 2));
    });

    // intro
    const ia = win(t, S.first - 0.6, at('q1') - 0.05, 0.35);
    op(intro, ia);
    if (ia > 0) {
      tr(bub, 600, 190 - 8 * wave(t * calm, 1.4), 0.6 + 0.4 * P(t, S.first - 0.5, 0.6, pop), -4 + 8 * wave(t * calm, 2.8));
      introDots.forEach((g, k) => { const p = popIn(t, mid('intro', 0.45 + k * 0.08), 0.4); op(g, clamp(p * 2)); tr(g, 600 + (k - 2) * 70, 500, Math.max(0.01, p)); });
    }

    // questions
    QS.forEach(q => {
      const k = q.k, tq = at('q' + k), ta = at('a' + k), nx = k < 5 ? at('q' + (k + 1)) : at('outro');
      const v = win(t, tq - 0.2, nx + 0.05, 0.3);
      op(q.g, v);
      if (v <= 0) return;
      const cp = P(t, tq - 0.2, 0.5, pop);
      tr(q.qc, 0, (1 - clamp(cp)) * 24);
      const pp = P(t, tq + 0.1, 0.5, pop);
      op(q.picG, clamp(pp * 2)); tr(q.picG, 300, 530 + (1 - clamp(pp)) * 20);
      q.anim(t, ta);
      const a = end('q' + k) + 0.1, b = ta - 0.05;
      const tv = win(t, a - 0.25, b + 0.05, 0.2);
      op(q.think, tv);
      if (tv > 0) { q.rg.set((t - a) / (b - a)); setText(q.num, String(clamp(Math.ceil((b - t) / ((b - a) / 4)), 1, 4))); }
      const ap = P(t, ta - 0.1, 0.5, pop);
      op(q.ans, clamp(ap * 2)); tr(q.ans, 0, (1 - clamp(ap)) * 22);
    });

    // outro
    const oa = P(t, at('outro') - 0.15, 0.5, linear);
    op(outro, oa);
    if (oa > 0) {
      const t0 = at('outro');
      sparks.forEach(o => {
        const u = clamp((t - t0 - o.dl) / 2.4), d = easeOut(u) * o.d;
        tr(o.s, 600 + Math.cos(o.a) * d * 1.5, 300 + Math.sin(o.a) * d * 0.85, 0.4 + 0.8 * Math.sin(Math.min(1, u * 1.2) * Math.PI));
        op(o.s, u > 0 && u < 1 ? Math.sin(u * Math.PI) * 0.95 : 0);
        o.s.upd(t);
      });
      const cp = popIn(t, mid('outro', 0.35), 0.5); op(labChip, clamp(cp * 2)); tr(labChip, 600, 412, Math.max(0.01, 0.8 + 0.2 * cp));
      op(sub, fade(t, mid('outro', 0.62)));
      const mp = fade(t, mid('outro', 0.75), 0.5); op(mini, mp * 0.9); mbs.set(0.6 + 0.4 * wave(t, 1.6));
    }
  };
});

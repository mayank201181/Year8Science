/* Chapter 5, Pitch and loudness.
   Beats: two features, each with a dial -> pitch depends on frequency: count the complete waves in one
   second -> hertz (4 Hz, then a dot vibrating once a second) -> high frequency (whistle, small bird)
   -> low frequency (bass drum, big dog) -> amplitude, rest line to crest -> loud and quiet traces
   -> "Fast Pitch, Big Bang" -> a 2x2 grid: the two are independent (showpiece) -> a guitar string:
   tighten, shorten, thinner -> pluck harder. Every trace is kit sineWave in the same fixed window:
   more waves in the same width = higher frequency; taller = bigger amplitude. */
scene('pitch', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  function richChip(parent, segs, o) {
    o = o || {};
    const g = G(parent), size = o.size || 30, h = Math.round(size * 1.75);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || C.card2, stroke: o.stroke || 'none', 'stroke-width': o.sw || 3 }, g);
    const txt = rich(g, 0, size * 0.35, segs, { size, weight: o.weight || 700, anchor: 'middle', fill: o.color || C.ink });
    let w = 0; try { w = txt.getComputedTextLength(); } catch (e) { w = 0; }
    if (!w) w = segs.map(s => (typeof s === 'string' ? s : s[0])).join('').length * size * 0.56;
    w += size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w;
    return g;
  }
  const sinePath = (x0, y0, w, amp, wl) => { let d = ''; for (let x = 0; x <= w + 0.01; x += 3) d += (x ? 'L' : 'M') + (x0 + x).toFixed(1) + ',' + (y0 - amp * Math.sin(TAU * x / wl)).toFixed(1); return d; };
  const restLine = (parent, x1, x2, y) => E('line', { x1, x2, y1: y, y2: y, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '10 9', opacity: 0.75 }, parent);
  function popAt(el, t, t0, x, y, s) { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, (s || 1) * (0.86 + 0.14 * p)); return p; }
  /* a vibration whose rate follows keys [[t, f], ...] (linear between keys): phase in cycles, and the rate */
  function integral(keys) {
    const cum = [0];
    for (let i = 1; i < keys.length; i++) cum.push(cum[i - 1] + (keys[i][0] - keys[i - 1][0]) * (keys[i][1] + keys[i - 1][1]) / 2);
    return t => {
      if (t <= keys[0][0]) return keys[0][1] * (t - keys[0][0]);
      for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
        const [t0, f0] = keys[i - 1], [t1, f1] = keys[i], u = t - t0, k = (f1 - f0) / ((t1 - t0) || 1);
        return cum[i - 1] + f0 * u + 0.5 * k * u * u;
      }
      const n = keys.length - 1; return cum[n] + keys[n][1] * (t - keys[n][0]);
    };
  }
  function rateAt(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], (t - keys[i - 1][0]) / ((keys[i][0] - keys[i - 1][0]) || 1));
    return keys[keys.length - 1][1];
  }

  /* loudspeaker: dark box with a grey cone facing right; origin = box centre, cone mouth at x = 58.
     g.upd(t, f, a): the cone moves a px in and out (horizontally), f times a second (drawn slowed down) */
  function speaker(parent) {
    const g = G(parent);
    E('rect', { x: -62, y: -76, width: 84, height: 152, rx: 14, fill: '#162531', stroke: '#47667C', 'stroke-width': 3 }, g);
    E('circle', { cx: -20, cy: -44, r: 9, fill: '#24394A', stroke: '#47667C', 'stroke-width': 2 }, g);
    E('circle', { cx: -20, cy: 46, r: 5, fill: '#24394A' }, g);
    const cone = G(g);
    E('path', { d: 'M16,-24 L54,-66 L54,66 L16,24 Z', fill: linGrad('#DCE4EA', '#7D8C98', true), stroke: '#EEF3F6', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, cone);
    E('ellipse', { cx: 54, cy: 0, rx: 5, ry: 66, fill: 'none', stroke: '#566875', 'stroke-width': 5 }, cone);
    E('ellipse', { cx: 18, cy: 0, rx: 7, ry: 22, fill: '#8594A0', stroke: '#E1E8ED', 'stroke-width': 2 }, cone);
    g.upd = (t, f, a) => tr(cone, a * Math.sin(TAU * f * t), 0);
    return g;
  }
  /* sound arcs travelling right from (0,0): spacing = v / f, so a higher frequency packs them closer.
     g.upd(t, f, loud 0..1): louder arcs are longer, thicker and brighter */
  function soundArcs(parent, o) {
    o = o || {};
    const g = G(parent), n = o.n || 8, v = o.v || 120, r0 = o.r0 || 8, range = o.range || 130, els = [];
    for (let i = 0; i < n; i++) els.push(E('path', { fill: 'none', stroke: o.color || C.air, 'stroke-linecap': 'round' }, g));
    g.upd = (t, f, loud) => {
      const sp = v / f, ph = ((t * f) % 1 + 1) % 1, half = (o.spread || 40) * (0.55 + 0.45 * loud) * Math.PI / 180;
      els.forEach((el, i) => {
        const r = r0 + (i + ph) * sp, u = (r - r0) / range;
        if (u >= 1) { op(el, 0); return; }
        const cx = r * Math.cos(half), cy = r * Math.sin(half);
        el.setAttribute('d', `M${cx.toFixed(1)},${(-cy).toFixed(1)} A${r.toFixed(1)},${r.toFixed(1)} 0 0 1 ${cx.toFixed(1)},${cy.toFixed(1)}`);
        el.setAttribute('stroke-width', ((o.width || 4.5) * (0.5 + 0.7 * loud)).toFixed(2));
        op(el, Math.min(1, u * 5) * (1 - u) * (0.35 + 0.65 * loud));
      });
    };
    g.upd(0, 4, 0.6);
    return g;
  }
  /* semicircular dial with a needle; g.set(v 0..1) */
  function dial(parent, lo, hi, color) {
    const g = G(parent), R = 80, arc = `M${-R},0 A${R},${R} 0 0 1 ${R},0`;
    E('path', { d: arc, fill: 'none', stroke: '#0B2230', 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
    E('path', { d: arc, fill: 'none', stroke: color, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.85 }, g);
    for (let i = 0; i <= 6; i++) { const a = Math.PI + i * Math.PI / 6; E('line', { x1: Math.cos(a) * (R - 26), y1: Math.sin(a) * (R - 26), x2: Math.cos(a) * (R - 15), y2: Math.sin(a) * (R - 15), stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g); }
    const needle = E('line', { x1: 0, y1: 0, x2: 0, y2: -(R - 20), stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 10, fill: C.ink }, g);
    T(g, -R, 44, lo, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    T(g, R, 44, hi, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    g.set = v => needle.setAttribute('transform', `rotate(${(-80 + 160 * clamp(v)).toFixed(1)})`);
    g.set(0.5);
    return g;
  }
  /* ----- sources: each about 120 wide, sound leaving to the right from g.mouth ----- */
  function whistle(parent) {
    const g = G(parent), metal = ball('#E6ECF0', '#8796A1');
    E('circle', { cx: -70, cy: -16, r: 10, fill: 'none', stroke: '#C9D3DB', 'stroke-width': 4 }, g);
    E('rect', { x: -62, y: -26, width: 38, height: 20, rx: 5, fill: metal, stroke: '#F4F7FA', 'stroke-width': 2 }, g);
    E('path', { d: 'M-28,-28 L14,-28 A32,32 0 1 1 -18,4 L-28,4 Z', fill: metal, stroke: '#F4F7FA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -4, y: -33, width: 18, height: 9, rx: 2, fill: '#33414C' }, g);
    E('circle', { cx: 14, cy: 4, r: 12, fill: 'none', stroke: '#B9C6D0', 'stroke-width': 2.5, opacity: 0.7 }, g);
    g.mouth = [50, -14];
    return g;
  }
  function bird(parent) {
    const g = G(parent), feather = ball('#7CCDF8', '#2C7DB5');
    E('path', { d: 'M-30,8 L-64,-6 L-58,22 Z', fill: '#2C7DB5' }, g);
    E('ellipse', { cx: -4, cy: 8, rx: 34, ry: 25, fill: feather }, g);
    E('ellipse', { cx: 6, cy: 18, rx: 19, ry: 12, fill: '#FFE6A8', opacity: 0.92 }, g);
    E('path', { d: 'M-26,2 Q-6,-14 12,4 Q-4,22 -26,2 Z', fill: '#2C7DB5', stroke: '#BDE6FF', 'stroke-width': 1.5 }, g);
    E('circle', { cx: 24, cy: -16, r: 17, fill: feather }, g);
    E('circle', { cx: 29, cy: -20, r: 3.6, fill: '#0A1B27' }, g);
    E('path', { d: 'M38,-21 L57,-27 L40,-14 Z', fill: C.glucose }, g);
    E('path', { d: 'M39,-12 L54,-6 L38,-8 Z', fill: C.glucoseDk }, g);
    E('path', { d: 'M-10,31 L-13,46 M5,31 L7,46', stroke: '#E0A040', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    g.mouth = [60, -17];
    return g;
  }
  function bassDrum(parent) {
    const g = G(parent);
    E('path', { d: 'M-30,42 L-50,66 M30,42 L50,66', stroke: '#9DB0BF', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 54, fill: '#9A3346', stroke: '#C9D3DB', 'stroke-width': 6 }, g);
    g.head = E('circle', { r: 43, fill: ball('#F5F0E6', '#C8BEAC'), stroke: '#E2D9C8', 'stroke-width': 2 }, g);
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + 0.39; E('rect', { x: Math.cos(a) * 49 - 4, y: Math.sin(a) * 49 - 4, width: 8, height: 8, rx: 2, fill: '#DCE4EA' }, g); }
    E('circle', { r: 14, fill: 'none', stroke: '#B9AE98', 'stroke-width': 3 }, g);
    g.mouth = [60, 0];
    return g;
  }
  function dog(parent) {
    const g = G(parent), fur = ball('#C08A58', '#6E4526');
    E('path', { d: 'M-48,-4 Q-66,-22 -62,-36', fill: 'none', stroke: '#8A5A33', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    [-36, -20, 12, 26].forEach(x => E('rect', { x: x - 6, y: 6, width: 12, height: 36, rx: 5, fill: '#8A5A33' }, g));
    E('ellipse', { cx: -6, cy: 0, rx: 46, ry: 22, fill: fur }, g);
    E('circle', { cx: 40, cy: -22, r: 20, fill: fur }, g);
    E('rect', { x: 48, y: -26, width: 28, height: 19, rx: 7, fill: fur }, g);
    E('circle', { cx: 75, cy: -24, r: 4.5, fill: '#1C120C' }, g);
    E('path', { d: 'M27,-38 Q18,-18 31,-12 Q38,-27 27,-38 Z', fill: '#6E4526' }, g);
    E('circle', { cx: 47, cy: -29, r: 3.2, fill: '#1C120C' }, g);
    E('path', { d: 'M54,-9 L58,-4 L62,-9 L66,-4 L70,-9', fill: 'none', stroke: '#F4F7FA', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    g.mouth = [82, -16];
    return g;
  }
  /* fingertip, origin at the tip; up = true when the finger reaches down from above */
  function finger(parent, up, len) {
    const g = G(parent), inner = G(g); len = len || 96;
    E('rect', { x: -17, y: 0, width: 34, height: len, rx: 17, fill: ball('#F2C6A0', '#C98E62'), stroke: '#FFE0C8', 'stroke-width': 2 }, inner);
    E('ellipse', { cx: 0, cy: 17, rx: 10, ry: 12, fill: '#FBE3D2', opacity: 0.85 }, inner);
    if (up) inner.setAttribute('transform', 'scale(1 -1)');
    return g;
  }
  /* comic "BANG!" burst */
  function burst(parent, r, text) {
    const g = G(parent); let d = '';
    for (let i = 0; i < 24; i++) { const a = -Math.PI / 2 + i * Math.PI / 12, rr = i % 2 ? r * 0.74 : r; d += (i ? 'L' : 'M') + (Math.cos(a) * rr * 1.3).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('path', { d: d + 'Z', fill: C.heat, stroke: C.energy, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 10, text, { size: 28, weight: 700, anchor: 'middle', fill: '#3A1600' });
    return g;
  }

  /* ================= A. two ways sounds differ ================= */
  const A = G(root);
  const dials = [[220, 'pitch', 'low', 'high', C.air], [980, 'loudness', 'quiet', 'loud', C.energy]].map(([x, name, lo, hi, col], i) => {
    const g = G(A);
    const c = chip(g, name, { size: 36, fill: C.card2, stroke: col }); tr(c, 0, -132);
    const d = dial(g, lo, hi, col);
    const q = chip(g, 'depends on: ?', { size: 26, fill: 'rgba(10,27,39,0.6)', stroke: C.faint, color: C.muted, sw: 2 }); tr(q, 0, 112);
    q.box.setAttribute('stroke-dasharray', '7 6');
    return { g, d, q, x, i };
  });

  /* the speaker: centre stage for `two`, then the source at the left of the trace panel */
  const spk = speaker(root);
  const spkArcs = soundArcs(spk, { v: 120, r0: 6, range: 128, n: 8 }); tr(spkArcs, 58, 0);

  /* ================= B. the trace panel (fixed time window) ================= */
  const PX = 380, PY = 190, PW = 760, PH = 360, TX = 410, TW = 700, TY = 370, AMP = 100;
  const B = G(root);
  card(B, PX, PY, PW, PH, { fill: '#0D2533', stroke: C.line });
  const restB = restLine(B, TX - 12, TX + TW + 12, TY);
  const guides = G(B);
  [-1, 1].forEach(s => E('line', { x1: TX, x2: TX + TW, y1: TY + s * AMP, y2: TY + s * AMP, stroke: C.faint, 'stroke-width': 2.5, 'stroke-dasharray': '5 8' }, guides));
  const sameH = T(B, TX + TW, TY - AMP - 16, 'same height', { size: 24, weight: 600, anchor: 'end', fill: C.muted });
  const trace = sineWave(B, { w: TW, amp: AMP, wl: 175, color: C.air, width: 6 }); tr(trace, TX, TY);
  const tPath = trace.firstChild; tPath.setAttribute('pathLength', 1); tPath.setAttribute('stroke-dasharray', '1 1');
  // counting: each complete wave lights up, with its number underneath
  const hl = [0, 1, 2, 3].map(k => {
    const g = G(B);
    E('path', { d: sinePath(TX + k * 175, TY, 175, AMP, 175), fill: 'none', stroke: C.energy, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.8 }, g);
    T(g, TX + k * 175 + 87.5, TY + AMP + 44, String(k + 1), { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
    return g;
  });
  // a one-second bracket over the window
  const brk = G(B);
  E('path', { d: `M${TX},${PY + 60} L${TX},${PY + 48} L${600},${PY + 48} M${920},${PY + 48} L${TX + TW},${PY + 48} L${TX + TW},${PY + 60}`, fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, brk);
  T(brk, 760, PY + 58, '1 second', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  // amplitude: rest line to the top of a crest
  const ampG = G(B), CRX = TX + 87.5;
  const ampArrow = arrow(ampG, CRX, TY - 3, CRX, TY - AMP + 6, { color: C.energy, width: 5, head: 17 });
  const ampTop = E('circle', { cx: CRX, cy: TY - AMP, r: 7, fill: C.energy }, ampG);
  const ampLab = T(ampG, CRX, TY - AMP - 22, 'amplitude', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const restLab = T(ampG, TX + 8, TY + 40, 'rest position', { size: 26, weight: 600, fill: C.ink });

  // count chip, then "4 waves a second = 4 Hz"
  const cnt = G(root);
  E('rect', { x: -112, y: -28, width: 224, height: 56, rx: 28, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, cnt);
  const cntTxt = T(cnt, 0, 11, '1 wave', { size: 31, weight: 700, anchor: 'middle', fill: C.energy });
  const hzChip = richChip(root, ['4 waves a second = ', ['4 Hz', C.energy, 800]], { size: 31, stroke: C.energy });
  // left column: a dot that vibrates once a second
  const dotG = G(root);
  E('line', { x1: 190, x2: 190, y1: 300, y2: 420, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, dotG);
  [140, 240].forEach(x => E('circle', { cx: x, cy: 360, r: 17, fill: 'none', stroke: C.energy, 'stroke-width': 2.5, 'stroke-dasharray': '4 5', opacity: 0.5 }, dotG));
  const dot = E('circle', { cx: 190, cy: 360, r: 17, fill: ball(C.energy, '#C9A21E') }, dotG);
  T(dotG, 190, 476, '1 Hz', { size: 46, weight: 700, anchor: 'middle', fill: C.energy });
  T(dotG, 190, 518, 'one vibration', { size: 27, weight: 600, anchor: 'middle' });
  T(dotG, 190, 552, 'per second', { size: 27, weight: 600, anchor: 'middle' });
  // left column: high and low sources
  function source(parent, make, y, label, f, ly) {
    const g = G(parent), art = make(g); tr(art, 140, y);
    const arcs = soundArcs(g, { v: 110, r0: 4, range: 120, n: Math.ceil(120 * f / 110) + 2, spread: 34, width: 4 });
    tr(arcs, 140 + art.mouth[0], y + art.mouth[1]);
    T(g, 140, y + (ly || 78), label, { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
    return { g, art, arcs, f };
  }
  const hiG = G(root), loG = G(root);
  const hiSrc = [source(hiG, whistle, 282, 'whistle', 9), source(hiG, bird, 468, 'small bird', 9)];
  const loSrc = [source(loG, bassDrum, 262, 'bass drum', 2.6, 100), source(loG, dog, 474, 'big dog', 2.6)];

  /* headers and labels */
  const H1 = G(root); rich(H1, 760, 150, [['Pitch', C.energy, 800], ': how high or low a sound seems'], { size: 36, anchor: 'middle' });
  const H2 = G(root); rich(H2, 760, 150, [['Loudness', C.energy, 800], ' depends on ', ['amplitude', C.energy, 800]], { size: 36, anchor: 'middle' });
  const lab = (y, segs) => { const g = G(root); rich(g, 760, y, segs, { size: 32, anchor: 'middle' }); return g; };
  const L1 = lab(688, [['frequency', C.energy, 800], ': complete waves each second']);
  const L2 = lab(688, ['unit: ', ['hertz (Hz)', C.energy, 800]]);
  const L3 = lab(624, [['high', C.energy, 800], ' frequency → ', ['high', C.energy, 800], ' pitch']);
  const L4 = lab(624, [['low', C.energy, 800], ' frequency → ', ['low', C.energy, 800], ' pitch']);
  const L5 = lab(624, [['amplitude', C.energy, 800], ': rest position → furthest point']);

  /* ================= C. loud and quiet: same spacing ================= */
  const Cg = G(root);
  const ROWY = [275, 495], RAMP = [75, 26], RWL = TW / 3;
  const rows = ROWY.map((y, i) => {
    const g = G(Cg);
    card(g, PX, y - 95, PW, 190, { fill: '#0D2533', stroke: C.line });
    restLine(g, TX - 12, TX + TW + 12, y);
    const w = sineWave(g, { w: TW, amp: RAMP[i], wl: RWL, color: C.air, width: 6 }); tr(w, TX, y);
    const bar = G(g);
    E('line', { x1: TX + RWL / 4, x2: TX + RWL / 4, y1: y, y2: y - RAMP[i], stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, bar);
    E('line', { x1: TX + RWL / 4 - 12, x2: TX + RWL / 4 + 12, y1: y - RAMP[i], y2: y - RAMP[i], stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, bar);
    const sp = speaker(g); tr(sp, 128, y, 0.68);
    const arcs = soundArcs(sp, { v: 120, r0: 6, range: 150, n: 8 }); tr(arcs, 58, 0);
    T(g, 128, y + 90, i ? 'quiet' : 'loud', { size: 32, weight: 700, anchor: 'middle', fill: i ? C.muted : C.energy });
    return { g, sp, arcs, bar };
  });
  const sameSp = G(Cg);
  for (let k = 0; k < 3; k++) E('line', { x1: TX + RWL / 4 + k * RWL, x2: TX + RWL / 4 + k * RWL, y1: 184, y2: 586, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '3 7', opacity: 0.55 }, sameSp);
  T(sameSp, TX + RWL * 1.25, 628, 'same spacing', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const bigLab = G(Cg); rich(bigLab, 760, 690, [['big', C.energy, 800], ' amplitude = ', ['loud', C.energy, 800], '   ·   ', ['small', C.muted, 800], ' amplitude = ', ['quiet', C.muted, 800]], { size: 30, anchor: 'middle' });

  /* ================= D. Fast Pitch, Big Bang ================= */
  const Dg = G(root);
  const fTitle = G(Dg);
  rich(fTitle, 600, 200, [['F', C.energy, 800], 'ast ', ['P', C.energy, 800], 'itch, ', ['B', C.energy, 800], 'ig ', ['B', C.energy, 800], 'ang'], { size: 64, weight: 700, anchor: 'middle' });
  const fCards = [0, 1].map(i => {
    const g = G(Dg), x = i ? 860 : 340;
    card(g, x - 230, 262, 460, 380, { fill: C.card, stroke: i ? C.energy : C.air, sw: 3 });
    rich(g, x, 318, [[i ? 'B' : 'F', C.energy, 800], i ? 'ig vibrations' : 'ast vibrations'], { size: 34, weight: 700, anchor: 'middle' });
    restLine(g, x - 190, x + 190, 428);
    E('path', { d: i ? sinePath(x - 180, 428, 360, 68, 144) : sinePath(x - 180, 428, 360, 32, 51.43), fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    if (i) rich(g, x, 545, ['big ', ['amplitude', C.energy, 800]], { size: 30, anchor: 'middle' });
    else rich(g, x, 545, ['high ', ['f', C.energy, 800], 'requency'], { size: 30, anchor: 'middle' });
    if (i) rich(g, x, 600, ['= loud: a big ', ['b', C.energy, 800], 'ang'], { size: 34, weight: 700, anchor: 'middle' });
    else rich(g, x, 600, ['= high ', ['p', C.energy, 800], 'itch'], { size: 34, weight: 700, anchor: 'middle' });
    return g;
  });
  const bang = burst(Dg, 50, 'BANG!');

  /* ================= E. independent: the 2x2 grid (showpiece) ================= */
  const Eg = G(root);
  const CW = 300, CHh = 170, GXc = [480, 820], GYc = [290, 490];
  const WL = [130, 52], GAMP = [58, 22];
  const colHd = G(Eg), rowHd = G(Eg);
  T(colHd, GXc[0], 186, 'low pitch', { size: 32, weight: 700, anchor: 'middle', fill: C.air });
  T(colHd, GXc[1], 186, 'high pitch', { size: 32, weight: 700, anchor: 'middle', fill: C.air });
  T(rowHd, 312, GYc[0] + 11, 'loud', { size: 32, weight: 700, anchor: 'end', fill: C.energy });
  T(rowHd, 312, GYc[1] + 11, 'quiet', { size: 32, weight: 700, anchor: 'end', fill: C.muted });
  const cells = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const g = G(Eg);
    const box = card(g, -CW / 2, -CHh / 2, CW, CHh, { fill: '#0B2230', stroke: C.line, rx: 18, sw: 3 });
    restLine(g, -CW / 2 + 16, CW / 2 - 16, 0);
    const w = sineWave(g, { w: 260, amp: GAMP[1], wl: WL[0], color: C.air, width: 5 }); tr(w, -130, 0);
    cells.push({ g, box, w, r, c, k: r * 2 + c });
  }
  const neq = richChip(Eg, ['higher ', ['≠', C.bad, 800], ' louder'], { size: 34, stroke: C.energy });

  /* ================= F. the guitar ================= */
  const Fg = G(root);
  const SY = 290, NUT = 170, BR = 1075, POST = 96, XP = 1000;
  const fretX = n => NUT + (BR - NUT) * (1 - Math.pow(2, -n / 12));
  const FRET = fretX(7);
  const gtr = G(Fg);
  const BODY = [[782, 0], [790, -42], [818, -74], [860, -88], [905, -84], [940, -68], [962, -64], [990, -78], [1030, -96], [1080, -98], [1128, -80], [1154, -42], [1162, 0],
    [1154, 42], [1128, 80], [1080, 98], [1030, 96], [990, 78], [962, 64], [940, 68], [905, 84], [860, 88], [818, 74], [790, 42]].map(([x, y]) => [x, SY + y]);
  E('path', { d: closedPath(BODY), fill: ball('#E0A35E', '#94582A'), stroke: '#F0C48C', 'stroke-width': 4 }, gtr);
  E('circle', { cx: 880, cy: SY, r: 42, fill: '#2A1A10', stroke: '#F0C48C', 'stroke-width': 5 }, gtr);
  E('rect', { x: BR - 8, y: SY - 40, width: 26, height: 80, rx: 6, fill: '#3B2416', stroke: '#6E4A30', 'stroke-width': 2 }, gtr);
  E('rect', { x: NUT, y: SY - 32, width: 668, height: 64, fill: '#3B2A20', stroke: '#5C4433', 'stroke-width': 2 }, gtr);
  for (let n = 1; n <= 22; n++) E('line', { x1: fretX(n), x2: fretX(n), y1: SY - 31, y2: SY + 31, stroke: '#C9D3DB', 'stroke-width': 3 }, gtr);
  [3, 5, 7, 9, 15, 17].forEach(n => E('circle', { cx: (fretX(n) + fretX(n - 1)) / 2, cy: SY - 18, r: 5, fill: '#E9E2D0', opacity: 0.8 }, gtr));
  E('path', { d: `M${NUT},${SY - 32} L${NUT - 112},${SY - 46} Q${NUT - 136},${SY} ${NUT - 112},${SY + 46} L${NUT},${SY + 32} Z`, fill: '#4A3428', stroke: '#6E4A30', 'stroke-width': 3, 'stroke-linejoin': 'round' }, gtr);
  E('rect', { x: NUT - 6, y: SY - 32, width: 9, height: 64, fill: '#EDE6D6' }, gtr);
  E('circle', { cx: POST, cy: SY, r: 9, fill: '#C9D3DB', stroke: '#8796A1', 'stroke-width': 2 }, gtr);
  E('line', { x1: POST, x2: POST, y1: SY - 40, y2: SY - 66, stroke: '#C9D3DB', 'stroke-width': 7 }, gtr);
  const keyG = G(gtr); tr(keyG, POST, SY - 82);
  const keyHead = E('rect', { x: -19, y: -15, width: 38, height: 30, rx: 10, fill: ball('#E6ECF0', '#8796A1'), stroke: '#F4F7FA', 'stroke-width': 2 }, keyG);
  const turn = G(Fg);
  E('path', { d: 'M-34,-14 A36,36 0 1 1 -12,30', fill: 'none', stroke: C.energy, 'stroke-width': 5, 'stroke-linecap': 'round' }, turn);
  E('path', { d: 'M-24,34 L-6,34 L-14,18 Z', fill: C.energy }, turn);
  tr(turn, POST, SY - 82);
  const strG = G(Fg);
  const ghostA = E('path', { fill: 'none', stroke: '#F0DCA8', 'stroke-width': 3, opacity: 0.3 }, strG);
  const ghostB = E('path', { fill: 'none', stroke: '#F0DCA8', 'stroke-width': 3, opacity: 0.3 }, strG);
  const strDead = E('path', { fill: 'none', stroke: '#B79F72', 'stroke-width': 7, 'stroke-linecap': 'round' }, strG);
  const strLive = E('path', { fill: 'none', stroke: '#F4E2B0', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, strG);
  const fretFinger = finger(Fg, true, 92);
  const pluckFinger = finger(Fg, false, 120);
  // the guitar's trace
  const GTY = 540;
  const Fp = G(Fg);
  card(Fp, PX, 430, PW, 220, { fill: '#0D2533', stroke: C.line });
  restLine(Fp, TX - 12, TX + TW + 12, GTY);
  const gTrace = sineWave(Fp, { w: TW, amp: 0, wl: TW / 2, color: C.air, width: 6 }); tr(gTrace, TX, GTY);
  const crestG = G(Fp), crestDots = [];
  for (let k = 0; k < 7; k++) {
    const x = TX + TW / 6.5 * (k + 0.25);
    E('line', { x1: x, x2: x, y1: 438, y2: 642, stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '3 7', opacity: 0.5 }, crestG);
    crestDots.push(E('circle', { cx: x, cy: GTY, r: 7, fill: C.energy }, crestG));
  }
  const gHdr = G(Fg); rich(gHdr, 600, 140, [['higher note', C.energy, 800], ' → raise the ', ['frequency', C.energy, 800]], { size: 34, anchor: 'middle' });
  const steps = ['tighten it', 'shorten it', 'thinner string'].map((s, i) => {
    const g = G(Fg);
    const c = chip(g, s, { size: 28, w: 290, fill: C.card2, stroke: C.line }); c.label.setAttribute('x', -16);
    const tk = tick(g, 13); tr(tk, 108, 0);
    tr(g, 190, 470 + i * 82);
    return { g, c, tk };
  });
  const hard = G(Fg);
  const hardChip = chip(hard, 'pluck harder', { size: 28, w: 290, fill: C.card2, stroke: C.energy }); tr(hardChip, 190, 470);
  const hardArrow = arrow(hard, 190, 502, 190, 536, { color: C.muted, width: 4, head: 14 });
  const hardAmp = rich(hard, 190, 574, ['bigger ', ['amplitude', C.energy, 800]], { size: 30, anchor: 'middle' });
  const samePitch = G(hard); rich(samePitch, 172, 640, ['same pitch'], { size: 30, weight: 700, anchor: 'middle' });
  const spTick = tick(samePitch, 13); tr(spTick, 278, 630);

  /* guitar timing: the rate follows the steps; two plucks */
  const tP1 = mid('guitar', 0.03), tR1 = tP1 + 0.55;
  const tTight = mid('guitar', 0.56), tFret = mid('guitar', 0.71), tThin = mid('guitar', 0.88);
  const tP2 = mid('harder', 0.06), tR2 = tP2 + 0.75;
  const fretDown = tFret + 0.45;
  const GF = [[tTight, 3], [tTight + 0.5, 4.5], [fretDown, 4.5], [fretDown + 0.15, 6.75], [tThin, 6.75], [tThin + 0.4, 9.75]];
  const gPhase = integral(GF);

  /* ================= update ================= */
  return t => {
    const aA = win(t, S.first - 0.3, at('pitch') + 0.4, 0.45);
    const aB = win(t, at('pitch') + 0.3, at('big') + 0.05, 0.45);
    const aC = win(t, at('big') - 0.1, at('fast') + 0.05, 0.45);
    const aD = win(t, at('fast') - 0.1, at('indep') + 0.05, 0.45);
    const aE = win(t, at('indep') - 0.1, at('guitar') + 0.05, 0.45);
    const aF = P(t, at('guitar') - 0.1, 0.5, linear);
    op(A, aA); op(B, aB); op(Cg, aC); op(Dg, aD); op(Eg, aE); op(Fg, aF);

    /* --- A: the two dials --- */
    if (aA > 0) dials.forEach((o, i) => {
      popAt(o.g, t, S.first + 0.15 + i * 0.35, o.x, 410);
      o.d.set(0.5 + 0.28 * Math.sin(t * (i ? 1.15 : 1.7) + i * 2) * calm);
      op(o.q, P(t, mid('two', 0.58 + i * 0.1), 0.45, linear));
    });

    /* --- the speaker: centre, then the panel's source at the left --- */
    const sOn = Math.min(P(t, S.first, 0.4, linear), 1 - P(t, mid('hertz', 0.38), 0.4, linear)) + win(t, at('loud') - 0.1, at('big') + 0.05, 0.45);
    op(spk, sOn);
    if (sOn > 0) {
      const mv = P(t, at('pitch') - 0.1, 1.0);
      const sp = P(t, S.first, 0.55, pop);
      tr(spk, lerp(520, 150, mv), 410, Math.max(0.01, lerp(1.1, 0.85, mv) * (0.7 + 0.3 * sp)));
      const loud = t > at('loud') - 0.2 ? 0.9 : 0.6, f = t > at('loud') - 0.2 ? 4 : 5;
      spk.upd(t, f, 4 * loud); spkArcs.upd(t, f, loud);
    }

    /* --- B: the trace panel --- */
    if (aB > 0) {
      const drawIn = P(t, mid('pitch', 0.12), 1.7, linear);
      tPath.setAttribute('stroke-dashoffset', (1 - drawIn).toFixed(4));
      const toHigh = P(t, at('high'), 0.8), toLow = P(t, at('low'), 0.9);
      const wl = toLow > 0 ? lerp(70, 350, toLow) : lerp(175, 70, toHigh);
      trace.set({ amp: AMP, wl });
      // counting
      const cAt = [0, 1, 2, 3].map(k => mid('pitch', 0.55 + k * 0.09));
      const n = cAt.filter(c => t >= c).length, hlOff = 1 - P(t, at('high') - 0.25, 0.3, linear);
      hl.forEach((g, k) => op(g, P(t, cAt[k], 0.25, linear) * hlOff));
      op(brk, P(t, mid('pitch', 0.47), 0.4, linear) * hlOff);
      setText(cntTxt, n <= 1 ? '1 wave' : n + ' waves');
      op(cnt, P(t, cAt[0], 0.3, linear) * (1 - P(t, mid('hertz', 0.1), 0.3, linear)));
      tr(cnt, 760, 612);
      const hzp = P(t, mid('hertz', 0.1), 0.5, pop);
      op(hzChip, clamp(hzp * 2) * hlOff); tr(hzChip, 760, 612, 0.9 + 0.1 * hzp);
      // same-height guides while the spacing changes
      op(guides, win(t, at('high') + 0.2, at('loud') + 0.1, 0.4));
      op(sameH, win(t, mid('low', 0.35), at('loud') + 0.1, 0.4));
      // amplitude
      const aOn = P(t, at('loud') + 0.2, 0.4, linear);
      op(ampG, aOn);
      op(ampLab, P(t, mid('loud', 0.33), 0.4, linear));
      op(restLab, P(t, mid('loud', 0.5), 0.4, linear));
      ampArrow.set(P(t, mid('loud', 0.56), 0.7));
      op(ampTop, P(t, mid('loud', 0.33), 0.4, linear));
      attr(ampTop, 'r', 7 + 3 * wave(t, 0.9) * calm);
      restB.setAttribute('stroke', t > mid('loud', 0.5) ? C.ink : C.muted);
      restB.setAttribute('stroke-width', t > mid('loud', 0.5) ? 4 : 3);
    } else { op(cnt, 0); op(hzChip, 0); }

    /* left column: the 1 Hz dot, high and low sources */
    const aDot = win(t, mid('hertz', 0.42), at('high') + 0.05, 0.4);
    op(dotG, aDot);
    if (aDot > 0) attr(dot, 'cx', 190 + 50 * Math.sin(TAU * (t - mid('hertz', 0.42))));
    const aHi = win(t, at('high') - 0.1, at('low') + 0.05, 0.4), aLo = win(t, at('low') - 0.1, at('loud') + 0.05, 0.4);
    op(hiG, aHi); op(loG, aLo);
    if (aHi > 0) hiSrc.forEach((s, i) => { s.arcs.upd(t, s.f, 0.55); tr(s.art, 140, [282, 468][i] + (i ? Math.sin(t * 9) * 1.5 * calm : 0)); });
    if (aLo > 0) loSrc.forEach((s, i) => { s.arcs.upd(t, s.f, 0.85); if (s.art.head) tr(s.art.head, 0, 0, 1 + 0.035 * Math.sin(TAU * s.f * t)); else tr(s.art, 140, 474 + Math.sin(TAU * s.f * t) * 1.2); });

    /* headers and labels */
    op(H1, win(t, at('pitch') + 0.2, at('loud') + 0.05, 0.4));
    op(H2, win(t, at('loud') - 0.1, at('fast') + 0.05, 0.4));
    op(L1, win(t, mid('pitch', 0.4), at('hertz') + 0.1, 0.4));
    op(L2, win(t, at('hertz') + 0.1, at('high') + 0.05, 0.4));
    op(L3, win(t, mid('high', 0.25), at('low') + 0.05, 0.35));
    op(L4, win(t, mid('low', 0.22), at('loud') + 0.05, 0.35));
    op(L5, win(t, mid('loud', 0.74), at('big') + 0.05, 0.4));

    /* --- C: loud and quiet, same spacing --- */
    if (aC > 0) {
      rows.forEach((r, i) => {
        const p = P(t, i ? mid('big', 0.5) : at('big') + 0.1, 0.5, pop);
        op(r.g, clamp(p * 2)); tr(r.g, 0, (1 - clamp(p)) * 14);
        r.sp.upd(t, 4, i ? 1 : 4.5); r.arcs.upd(t, 4, i ? 0.2 : 1);
      });
      op(sameSp, P(t, mid('big', 0.78), 0.5, linear));
      op(bigLab, P(t, mid('big', 0.62), 0.5, linear));
    }

    /* --- D: Fast Pitch, Big Bang --- */
    if (aD > 0) {
      popAt(fTitle, t, at('fast') + 0.1, 0, 0);
      fCards.forEach((g, i) => { const p = P(t, mid('fast', i ? 0.69 : 0.45), 0.5, easeOut); op(g, p); tr(g, 0, (1 - p) * 20); });
      const bp = P(t, mid('fast', 0.84), 0.45, pop);
      op(bang, clamp(bp * 2)); tr(bang, 1040, 300, Math.max(0.01, bp) * (1 + 0.05 * Math.sin(t * 7) * calm), -8);
    }

    /* --- E: the grid --- */
    if (aE > 0) {
      // quiet-low first; each copy then slides one step and changes one thing: right = higher frequency, up = bigger amplitude
      const BUILD = { 2: [at('indep') + 0.05, 2], 3: [mid('indep', 0.06), 2], 0: [mid('indep', 0.12), 2], 1: [mid('indep', 0.22), 0] };
      const hq = win(t, mid('indep', 0.36), mid('indep', 0.52), 0.25), ll = win(t, mid('indep', 0.53), mid('indep', 0.67), 0.25);
      cells.forEach(cl => {
        const [t0, from] = BUILD[cl.k], first = cl.k === 2;
        const fr = cells[from], sx = GXc[fr.c], sy = GYc[fr.r], ex = GXc[cl.c], ey = GYc[cl.r];
        const mv = first ? 1 : P(t, t0, 0.75);
        const appear = first ? P(t, t0, 0.5, pop) : 1;
        op(cl.g, (first ? clamp(appear * 2) : P(t, t0, 0.15, linear)) * (1 - 0.62 * Math.max(cl.k === 3 ? 0 : hq, cl.k === 0 ? 0 : ll)));
        tr(cl.g, lerp(sx, ex, mv), lerp(sy, ey, mv), first ? 0.85 + 0.15 * appear : 1);
        const wlFrom = WL[fr.c], ampFrom = GAMP[fr.r];
        cl.w.set({ wl: lerp(wlFrom, WL[cl.c], mv), amp: lerp(ampFrom, GAMP[cl.r], mv) });
        const lit = cl.k === 3 ? hq : cl.k === 0 ? ll : 0;
        cl.box.setAttribute('stroke', lit > 0.5 ? C.energy : C.line);
        cl.box.setAttribute('stroke-width', lit > 0.5 ? 6 : 3);
      });
      op(colHd, P(t, mid('indep', 0.1), 0.4, linear)); op(rowHd, P(t, mid('indep', 0.16), 0.4, linear));
      const np = P(t, mid('indep', 0.69), 0.5, pop); op(neq, clamp(np * 2)); tr(neq, 650, 655, 0.9 + 0.1 * np);
    }

    /* --- F: the guitar --- */
    if (aF > 0) {
      const tight = P(t, tTight, 0.9), fretP = P(t, tFret, 0.45, easeOut), thin = P(t, tThin, 0.45);
      // the peg turns
      op(turn, win(t, tTight - 0.1, tTight + 1.3, 0.25));
      tr(turn, POST, SY - 82, 1, -tight * 140);
      keyHead.setAttribute('transform', `scale(${(0.35 + 0.65 * Math.abs(Math.cos(tight * Math.PI * 2))).toFixed(3)} 1)`);
      // fingers
      op(fretFinger, P(t, tFret, 0.25, linear)); tr(fretFinger, FRET - 17, lerp(SY - 40, SY - 3, fretP));
      const fretted = t >= fretDown;
      const push1 = P(t, tP1, 0.45), push2 = P(t, tP2, 0.6);
      let h = 0, A = 0, tRel = tR1;
      if (t < tP1) h = 0;
      else if (t < tR1) h = 26 * push1;
      else if (t < tP2) { A = 15; tRel = tR1; }
      else if (t < tR2) h = 48 * push2;
      else { A = 31; tRel = tR2; }
      const away = t >= tR2 ? P(t, tR2, 0.25) : t >= tR1 && t < tP2 ? P(t, tR1, 0.25) : 0;
      const fy = h > 0 ? SY - h + 5 : lerp(SY + 5, SY + 14, away);
      op(pluckFinger, P(t, tP1 - 0.2, 0.25, linear)); tr(pluckFinger, XP, fy);
      // the string
      const xa = fretted ? FRET : NUT, L = BR - xa, ph = gPhase(t) - gPhase(tRel), c = Math.cos(TAU * ph);
      const live = [], gA = [], gB = [];
      for (let i = 0; i <= 44; i++) {
        const x = xa + L * i / 44, s = Math.sin(Math.PI * i / 44);
        let y = SY;
        if (h > 0) y = SY - h * (x < XP ? (x - xa) / (XP - xa) : (BR - x) / (BR - XP));
        else y = SY - A * s * c;
        live.push(x.toFixed(1) + ',' + y.toFixed(1));
        gA.push(x.toFixed(1) + ',' + (SY - A * s).toFixed(1)); gB.push(x.toFixed(1) + ',' + (SY + A * s).toFixed(1));
      }
      strLive.setAttribute('d', 'M' + live.join(' L'));
      strDead.setAttribute('d', `M${POST},${SY} L${xa.toFixed(1)},${SY}`);
      ghostA.setAttribute('d', 'M' + gA.join(' L')); ghostB.setAttribute('d', 'M' + gB.join(' L'));
      op(ghostA, A > 0 ? 1 : 0); op(ghostB, A > 0 ? 1 : 0);
      const sw = lerp(7, 3.5, thin);
      strLive.setAttribute('stroke-width', sw.toFixed(2)); strDead.setAttribute('stroke-width', sw.toFixed(2));
      // the trace: more waves at each step, same height; taller when plucked harder
      const f = rateAt(GF, t), amp = 54 * P(t, tR1, 0.35) + 32 * P(t, tR2, 0.5);
      gTrace.set({ amp, wl: TW * 1.5 / f });
      // labels
      op(gHdr, P(t, mid('guitar', 0.3), 0.4, linear) * (1 - P(t, at('harder') - 0.1, 0.4, linear)));
      steps.forEach((s, i) => {
        const t0 = [tTight, tFret, tThin][i], p = P(t, t0 - 0.1, 0.45, pop);
        op(s.g, clamp(p * 2) * (1 - P(t, at('harder') - 0.1, 0.35, linear))); tr(s.g, 190 + (1 - clamp(p)) * -20, 470 + i * 82);
        op(s.tk, P(t, t0 + 0.4, 0.3, linear));
      });
      op(hard, P(t, at('harder') + 0.1, 0.4, linear));
      hardArrow.set(P(t, mid('harder', 0.38), 0.5));
      op(hardAmp, P(t, mid('harder', 0.45), 0.4, linear));
      op(samePitch, P(t, mid('harder', 0.74), 0.4, linear));
      op(crestG, P(t, mid('harder', 0.32), 0.4, linear));
      crestDots.forEach(d => attr(d, 'cy', GTY - amp));
    }
  };
});

/* Renewable and non-renewable resources.
   Beats: an energy resource feeds the mains -> two columns -> non-renewables run out (fuel gauge)
   -> coal, oil, gas and uranium -> pros (ticks) -> cons: CO2 blankets a warming globe (crosses)
   -> nuclear is non-renewable: the rod tries to leave and is pinned in its column
   -> renewables are replaced -> the seven pop in -> Six Wild Horses Took Wet Grass Back while a
   horse gallops past (showpiece) -> unreliable at night and on a calm day -> space, cost and
   wildlife -> an energy mix balancing three weights -> the nuclear debate on a balance. */
scene('resources', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SAND = '#E2C9A6', BROWN = '#8C7660', GRN = C.good, GRNDK = '#3FA06E';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const f1 = v => (+v).toFixed(1);
  const frac = v => ((v % 1) + 1) % 1;
  let nClip = 0;
  function clipUrl(d) { const id = 'resClip' + (++nClip); E('path', { d }, E('clipPath', { id }, defs())); return `url(#${id})`; }
  const circD = r => `M${-r},0 A${r},${r} 0 1 0 ${r},0 A${r},${r} 0 1 0 ${-r},0 Z`;
  const popIn = (t, t0, d) => P(t, t0, d || 0.5, pop);
  /* pop an element in at (x, y): opacity and a scale from s0 that overshoots a little */
  function popAt(el, p, x, y, s0, s1) { s1 = s1 === undefined ? 1 : s1; op(el, clamp(p * 2)); tr(el, x, y, Math.max(0.01, lerp(s0 === undefined ? 0.6 : s0, s1, p))); }
  const sagPts = (a, b, sag, n) => { const pts = []; for (let i = 0; i <= n; i++) { const u = i / n; pts.push([lerp(a[0], b[0], u), lerp(a[1], b[1], u) + sag * 4 * u * (1 - u)]); } return pts; };
  /* a kit wire whose line can be drawn in: w.draw(p) */
  function drawWire(parent, pts, o) {
    const w = wire(parent, pts, o), line = w.querySelector('path');
    line.setAttribute('pathLength', 1); line.setAttribute('stroke-dasharray', '1 1');
    w.draw = p => { line.setAttribute('stroke-dashoffset', (1 - clamp(p)).toFixed(4)); w.set(clamp((p - 0.85) / 0.15)); };
    w.draw(0);
    return w;
  }
  /* a tick (good) or cross chip; origin = the chip's left edge, the mark sits to its left */
  function markRow(parent, text, good) {
    const g = G(parent);
    const c = chip(g, text, { size: 28, fill: good ? 'rgba(86,214,155,0.14)' : 'rgba(255,96,112,0.14)', stroke: good ? C.good : C.bad, sw: 2.5 });
    tr(c, c.w / 2, 0);
    g.mark = good ? tick(g, 14) : cross(g, 12); tr(g.mark, -28, good ? 2 : 0);
    g.w = c.w;
    return g;
  }
  /* a car-style fuel gauge, pivot at (0,0); g.set(level 0..1), g.letters (hide them when small) */
  function fuelGauge(parent, r) {
    const g = G(parent);
    const pt = (a, rr) => [Math.sin(a * Math.PI / 180) * rr, -Math.cos(a * Math.PI / 180) * rr];
    const arcD = (a0, a1, rr) => { const p = pt(a0, rr), q = pt(a1, rr); return `M${f1(p[0])},${f1(p[1])} A${rr},${rr} 0 0 1 ${f1(q[0])},${f1(q[1])}`; };
    g.face = E('circle', { r: r * 1.16, fill: '#0B1A24', stroke: BROWN, 'stroke-width': 5 }, g);
    E('path', { d: arcD(-62, 62, r * 0.84), fill: 'none', stroke: '#33505F', 'stroke-width': r * 0.13, 'stroke-linecap': 'round' }, g);
    E('path', { d: arcD(-62, -38, r * 0.84), fill: 'none', stroke: C.bad, 'stroke-width': r * 0.13, 'stroke-linecap': 'round' }, g);
    for (let i = 0; i <= 4; i++) { const a = -62 + i * 31, p = pt(a, r * 0.66), q = pt(a, r * 0.54); E('line', { x1: f1(p[0]), y1: f1(p[1]), x2: f1(q[0]), y2: f1(q[1]), stroke: '#C9D6DE', 'stroke-width': r * 0.045, 'stroke-linecap': 'round' }, g); }
    g.letters = G(g);
    T(g.letters, -r * 0.6, -r * 0.02, 'E', { size: Math.round(r * 0.3), weight: 800, anchor: 'middle', fill: '#FF9AA4' });
    T(g.letters, r * 0.6, -r * 0.02, 'F', { size: Math.round(r * 0.3), weight: 800, anchor: 'middle', fill: C.ink });
    const pump = G(g); tr(pump, 0, r * 0.55, r / 100);
    E('rect', { x: -18, y: -24, width: 28, height: 44, rx: 5, fill: '#C9D6DE' }, pump);
    E('rect', { x: -12, y: -17, width: 16, height: 12, rx: 2, fill: '#0B1A24' }, pump);
    E('path', { d: 'M10,-16 L22,-9 L22,12 Q22,19 29,16', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 4.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, pump);
    const needle = G(g);
    E('path', { d: `M${f1(-r * 0.05)},0 L0,${f1(-r * 0.8)} L${f1(r * 0.05)},0 Z`, fill: '#FF8A3D', 'stroke-linejoin': 'round' }, needle);
    E('circle', { r: r * 0.1, fill: '#C9D6DE' }, g);
    g.set = lv => needle.setAttribute('transform', `rotate(${f1(lerp(-58, 58, clamp(lv)))})`);
    g.set(1);
    return g;
  }
  /* electricity pylon h tall, feet at (0,0); g.tip(side) -> the upper insulator's lower end */
  function pylon(parent, h) {
    const g = G(parent), bw = h * 0.3, tw = h * 0.07, top = -h * 0.92;
    const xAt = (side, y) => side * lerp(bw / 2, tw / 2, y / top);
    let d = `M${f1(-bw / 2)},0 L${f1(-tw / 2)},${f1(top)} L0,${f1(-h)} L${f1(tw / 2)},${f1(top)} L${f1(bw / 2)},0`;
    const ys = [0, -0.2, -0.37, -0.52, -0.64, -0.76].map(k => k * h);
    for (let i = 0; i < ys.length - 1; i++) {
      const y0 = ys[i], y1 = ys[i + 1];
      d += ` M${f1(xAt(-1, y0))},${f1(y0)} L${f1(xAt(1, y1))},${f1(y1)} M${f1(xAt(1, y0))},${f1(y0)} L${f1(xAt(-1, y1))},${f1(y1)} M${f1(xAt(-1, y1))},${f1(y1)} L${f1(xAt(1, y1))},${f1(y1)}`;
    }
    const arm = (y, hw) => ` M${f1(-hw)},${f1(y)} L${f1(hw)},${f1(y)} M${f1(-hw)},${f1(y)} L${f1(xAt(-1, y + h * 0.07))},${f1(y + h * 0.07)} M${f1(hw)},${f1(y)} L${f1(xAt(1, y + h * 0.07))},${f1(y + h * 0.07)}`;
    d += arm(-h * 0.84, h * 0.24) + arm(-h * 0.66, h * 0.19);
    E('path', { d, fill: 'none', stroke: '#AFC0CC', 'stroke-width': Math.max(2.5, h * 0.013), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    [[-0.24, -0.84], [0.24, -0.84], [-0.19, -0.66], [0.19, -0.66]].forEach(([x, y]) => E('line', { x1: f1(x * h), y1: f1(y * h), x2: f1(x * h), y2: f1(y * h + h * 0.05), stroke: '#7FD0F0', 'stroke-width': Math.max(3, h * 0.02), 'stroke-linecap': 'round' }, g));
    g.tip = side => [side * h * 0.24, -h * 0.84 + h * 0.05];
    return g;
  }
  /* a wall socket, centred */
  function socket(parent) {
    const g = G(parent);
    E('rect', { x: -48, y: -48, width: 96, height: 96, rx: 14, fill: '#E9EEF2', stroke: '#AEBAC4', 'stroke-width': 3 }, g);
    E('rect', { x: -30, y: -28, width: 60, height: 62, rx: 8, fill: '#2B3035', stroke: '#5C6670', 'stroke-width': 2 }, g);
    E('rect', { x: -18, y: -18, width: 36, height: 8, rx: 3, fill: '#5C6670' }, g);
    E('rect', { x: 30, y: -2, width: 14, height: 12, rx: 3, fill: '#2B3035' }, g);
    return g;
  }
  /* factory and chimney, ground at (0,0); g.top = the chimney's mouth */
  function chimney(parent) {
    const g = G(parent);
    E('path', { d: 'M-50,-60 L-44,-152 L-18,-152 L-12,-60 Z', fill: '#7A4A3A', stroke: '#A0685A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -50, y: -160, width: 38, height: 11, rx: 3, fill: '#A0685A' }, g);
    E('rect', { x: -70, y: -62, width: 150, height: 62, rx: 6, fill: '#4A3A32', stroke: '#7A5E50', 'stroke-width': 3 }, g);
    E('path', { d: 'M-70,-62 L-40,-84 L-40,-62 M-10,-62 L20,-84 L20,-62 M50,-62 L80,-84 L80,-62', fill: '#4A3A32', stroke: '#7A5E50', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    [-46, -10, 26, 62].forEach(x => E('rect', { x: x - 10, y: -42, width: 20, height: 16, rx: 3, fill: '#FFC27A', opacity: 0.75 }, g));
    g.top = [-31, -160];
    return g;
  }
  /* a globe of radius r; g.set(warm 0..1) */
  function globe(parent, r) {
    const g = G(parent), body = G(g, { 'clip-path': clipUrl(circD(r)) }), k = G(body); tr(k, 0, 0, r / 56);
    E('circle', { r: 60, fill: ball('#3E8FD8', '#1D4F8A') }, k);
    E('path', { d: 'M-44,-30 C-24,-50 6,-44 10,-24 C14,-6 -6,2 -14,18 C-22,34 -44,24 -50,4 C-54,-10 -52,-22 -44,-30 Z', fill: '#4FAE5C' }, k);
    E('path', { d: 'M18,-46 C34,-44 50,-30 52,-12 C40,-14 30,-22 22,-18 C14,-26 10,-40 18,-46 Z', fill: '#4FAE5C' }, k);
    E('path', { d: 'M16,8 C30,4 46,12 44,30 C40,46 22,52 12,40 C6,30 8,14 16,8 Z', fill: '#4FAE5C' }, k);
    const warm = E('circle', { r: 60, fill: '#FF5A2E' }, k); op(warm, 0);
    E('circle', { r, fill: 'none', stroke: '#BFE3FF', 'stroke-width': 3 }, g);
    g.set = w => op(warm, 0.55 * clamp(w));
    return g;
  }
  /* two arrows chasing round a circle ("replaced"); g.upd(t) turns it */
  function loopArrow(parent, r, color) {
    const g = G(parent), spin = G(g);
    const seg = (a0, a1) => `M${f1(Math.cos(a0) * r)},${f1(Math.sin(a0) * r)} A${r},${r} 0 0 1 ${f1(Math.cos(a1) * r)},${f1(Math.sin(a1) * r)}`;
    [0, Math.PI].forEach(a => {
      E('path', { d: seg(a + 0.3, a + Math.PI - 0.42), fill: 'none', stroke: color, 'stroke-width': r * 0.13, 'stroke-linecap': 'round' }, spin);
      const ah = a + Math.PI - 0.3;
      E('path', { d: `M${f1(r * 0.24)},0 L${f1(-r * 0.12)},${f1(-r * 0.2)} L${f1(-r * 0.12)},${f1(r * 0.2)} Z`, fill: color, transform: `translate(${f1(Math.cos(ah) * r)} ${f1(Math.sin(ah) * r)}) rotate(${f1(ah * 180 / Math.PI + 90)})` }, spin);
    });
    g.upd = t => tr(spin, 0, 0, 1, (t * 30) % 360);
    return g;
  }
  function warnSign(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-36 L34,24 L-34,24 Z', fill: C.energy, stroke: '#B08A00', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -4.5, y: -16, width: 9, height: 24, rx: 3, fill: '#3A3000' }, g);
    E('circle', { cx: 0, cy: 15, r: 5, fill: '#3A3000' }, g);
    return g;
  }
  /* a push pin; its point at (0,0) */
  function pushPin(parent) {
    const g = G(parent);
    E('line', { x1: 0, y1: 0, x2: 0, y2: -26, stroke: '#C9D6DE', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-16,-26 L16,-26 L10,-36 L10,-50 L16,-56 L-16,-56 L-10,-50 L-10,-36 Z', fill: ball('#FF6070', '#B3324A'), stroke: '#FFB0B8', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  /* a galloping horse silhouette facing +x, hooves at y = 0, about 230 long; g.run(phase) */
  function horse(parent) {
    const g = G(parent), body = G(g);
    const col = '#EBDDC0', far = '#BFA982';
    const mkLeg = (x, y, c) => {
      const a = G(body);
      E('line', { x1: 0, y1: 0, x2: 0, y2: 44, stroke: c, 'stroke-width': 13, 'stroke-linecap': 'round' }, a);
      const lo = G(a);
      E('line', { x1: 0, y1: 0, x2: 0, y2: 40, stroke: c, 'stroke-width': 8.5, 'stroke-linecap': 'round' }, lo);
      E('path', { d: 'M-6,37 L7,37 L8,47 L-7,47 Z', fill: c === col ? '#8A7552' : '#6A5838' }, lo);
      return { a, lo, x, y };
    };
    const hindFar = mkLeg(-62, -92, far), foreFar = mkLeg(42, -92, far);
    const tail = E('path', { fill: far }, body);
    E('path', { d: 'M-88,-104 C-92,-136 -52,-144 -6,-140 C28,-138 54,-136 66,-118 C78,-100 66,-80 42,-78 L-62,-78 C-84,-80 -90,-90 -88,-104 Z', fill: col }, body);
    E('path', { d: 'M34,-128 C48,-150 68,-174 90,-188 C104,-196 118,-192 126,-178 L144,-150 C149,-141 142,-133 132,-136 L108,-148 C98,-134 84,-118 60,-100 Z', fill: col }, body);
    E('path', { d: 'M93,-188 L99,-210 L109,-190 Z', fill: col }, body);
    E('path', { d: 'M92,-188 C76,-180 54,-158 36,-128 L50,-122 C62,-146 78,-166 100,-178 Z', fill: far }, body);
    E('circle', { cx: 115, cy: -172, r: 4, fill: '#5E4E36' }, body);
    const hindNear = mkLeg(-52, -90, col), foreNear = mkLeg(50, -90, col);
    const legs = [[hindFar, 0, false], [hindNear, 0.12, false], [foreFar, 0.46, true], [foreNear, 0.58, true]];
    g.run = ph => {
      legs.forEach(([L, o, fore]) => {
        const s = Math.sin(TAU * (ph + o)), c = Math.cos(TAU * (ph + o));
        const up = (fore ? 40 : 34) * s, knee = (fore ? 70 : 50) * Math.max(0, c);
        L.a.setAttribute('transform', `translate(${L.x} ${L.y}) rotate(${f1(-up)})`);
        L.lo.setAttribute('transform', `translate(0 44) rotate(${f1(knee)})`);
      });
      body.setAttribute('transform', `translate(0 ${f1(-8 * Math.abs(Math.sin(TAU * ph)))}) rotate(${f1(2.5 * Math.sin(TAU * ph))} 0 -100)`);
      const w = 7 * Math.sin(TAU * ph * 2);
      tail.setAttribute('d', `M-84,-124 C-112,-128 -136,${f1(-110 + w)} -152,${f1(-84 + w)} C-130,${f1(-92 + w)} -108,-96 -84,-100 Z`);
    };
    g.run(0);
    return g;
  }
  /* a tree, trunk foot at (0,0) */
  function tree(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -5, y: -34, width: 10, height: 34, rx: 3, fill: '#7A5230' }, k);
    E('circle', { cx: 0, cy: -52, r: 26, fill: ball('#5BD27A', '#2C8C4C') }, k);
    E('circle', { cx: -15, cy: -40, r: 16, fill: ball('#5BD27A', '#2C8C4C') }, k);
    E('circle', { cx: 15, cy: -42, r: 17, fill: ball('#5BD27A', '#2C8C4C') }, k);
    return g;
  }
  function bird(parent) {
    const g = G(parent);
    const wing = E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('ellipse', { rx: 10, ry: 6.5, fill: '#F2F7FA' }, g);
    E('path', { d: 'M9,-2 L17,1 L9,3 Z', fill: C.glucose }, g);
    g.flap = ph => { const k = Math.sin(ph) * 13; wing.setAttribute('d', `M-24,${f1(-k)} Q-12,${f1(-k * 0.3 - 6)} 0,-1 Q12,${f1(-k * 0.3 - 6)} 24,${f1(-k)}`); };
    g.flap(0);
    return g;
  }
  /* a price tag hanging from (0,0) */
  function priceTag(parent) {
    const g = G(parent);
    E('line', { x1: 0, y1: 0, x2: 0, y2: 26, stroke: '#C9D6DE', 'stroke-width': 3 }, g);
    E('path', { d: 'M0,22 L56,48 L56,118 Q56,128 46,128 L-46,128 Q-56,128 -56,118 L-56,48 Z', fill: C.energy, stroke: '#B08A00', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 0, cy: 42, r: 7, fill: '#0B1A24' }, g);
    T(g, 0, 104, '£££', { size: 40, weight: 800, anchor: 'middle', fill: '#3A2A00' });
    return g;
  }
  /* a hanging weight; its ring top at (0,0) */
  function weight(parent, text) {
    const g = G(parent);
    const w = Math.max(160, textWidth(text, 28, FD, 700) + 50);
    E('circle', { cx: 0, cy: 10, r: 10, fill: 'none', stroke: '#9AA8B4', 'stroke-width': 4 }, g);
    E('path', { d: `M${f1(-w / 2 + 16)},20 L${f1(w / 2 - 16)},20 L${f1(w / 2)},92 L${f1(-w / 2)},92 Z`, fill: ball('#6B7986', '#34414C'), stroke: '#A9B6C1', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    T(g, 0, 66, text, { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
    return g;
  }
  /* a radioactive-waste drum standing at (0,0) */
  function wasteDrum(parent) {
    const g = G(parent);
    E('rect', { x: -46, y: -112, width: 92, height: 112, rx: 10, fill: ball('#FFD24A', '#C99500'), stroke: '#8A6A00', 'stroke-width': 3 }, g);
    [-84, -28].forEach(y => E('line', { x1: -46, y1: y, x2: 46, y2: y, stroke: '#8A6A00', 'stroke-width': 4 }, g));
    const tf = G(g); tr(tf, 0, -56);
    for (let i = 0; i < 3; i++) {
      const c = (90 + i * 120) * Math.PI / 180, a0 = c - Math.PI / 6, a1 = c + Math.PI / 6, r0 = 8, r1 = 21;
      E('path', { d: `M${f1(Math.cos(a0) * r0)},${f1(Math.sin(a0) * r0)} L${f1(Math.cos(a0) * r1)},${f1(Math.sin(a0) * r1)} A${r1},${r1} 0 0 1 ${f1(Math.cos(a1) * r1)},${f1(Math.sin(a1) * r1)} L${f1(Math.cos(a1) * r0)},${f1(Math.sin(a1) * r0)} A${r0},${r0} 0 0 0 ${f1(Math.cos(a0) * r0)},${f1(Math.sin(a0) * r0)} Z`, fill: '#1B1B1B' }, tf);
    }
    E('circle', { r: 5, fill: '#1B1B1B' }, tf);
    return g;
  }
  function hourglass(parent) {
    const g = G(parent);
    E('path', { d: 'M-14,-20 L14,-20 L2,0 L14,20 L-14,20 L-2,0 Z', fill: 'rgba(200,230,250,0.16)', stroke: '#CFE7F5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-8,-13 L8,-13 L1,-3 L-1,-3 Z M-9,17 L9,17 L3,9 L-3,9 Z', fill: C.glucose }, g);
    E('path', { d: 'M-17,-22 L17,-22 M-17,22 L17,22', stroke: '#C9A06A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= A. what an energy resource is ================= */
  const gA = G(root);
  const aTitle = T(gA, 600, 186, 'energy resources', { size: 60, weight: 700, anchor: 'middle' });
  const aCoal = enResource(gA, 'coal'), aWind = enResource(gA, 'wind');
  const aArrow = arrow(gA, 398, 400, 470, 400, { color: C.muted, width: 6 });
  const aPyl = pylon(gA, 280); tr(aPyl, 560, 592);
  const tipA = aPyl.tip(1), PT = [560 + tipA[0], 592 + tipA[1]];
  const aWire = drawWire(gA, sagPts(PT, [822, 438], 46, 10), { width: 4, spacing: 40 });
  const aSock = socket(gA); tr(aSock, 870, 440);
  const aCable = drawWire(gA, [[914, 448], [956, 452], [990, 486], [1012, 540], [1040, 548]], { width: 5, spacing: 34, color: '#C9D6DE' });
  const aBulb = enBulb(gA, 'led', { s: 0.9 }); tr(aBulb, 1040, 482);
  const aElec = chip(gA, 'electricity', { size: 26, fill: C.card, stroke: C.energy, sw: 2.5 }); tr(aElec, 728, 392);

  /* ================= B. the two columns ================= */
  const gLeft = G(root), gRight = G(root);
  const pnL = E('rect', { x: 40, y: 118, width: 545, height: 594, rx: 26, fill: 'rgba(176,140,104,0.10)', stroke: BROWN, 'stroke-width': 3 }, gLeft);
  const pnR = E('rect', { x: 615, y: 118, width: 545, height: 594, rx: 26, fill: 'rgba(86,214,155,0.08)', stroke: GRNDK, 'stroke-width': 3 }, gRight);
  const hdL = G(gLeft); T(hdL, 0, 0, 'non-renewable', { size: 40, weight: 700, anchor: 'middle', fill: SAND });
  const hdR = G(root); T(hdR, 0, 0, 'renewable', { size: 40, weight: 700, anchor: 'middle', fill: GRN });

  // left: the fuel gauge, the four resources and their labels
  const gauge = fuelGauge(gLeft, 105);
  const runOut = T(gLeft, 415, 548, 'running out', { size: 32, weight: 700, anchor: 'middle', fill: '#FF9AA4' });
  const fosLab = G(gLeft);
  T(fosLab, 250, 214, 'fossil fuels', { size: 28, weight: 700, anchor: 'middle', fill: SAND });
  const fosBr = E('path', { d: 'M82,254 Q82,238 98,238 L234,238 Q250,238 250,224 Q250,238 266,238 L402,238 Q418,238 418,254', fill: 'none', stroke: SAND, 'stroke-width': 3.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, fosLab);
  const nucLab = G(gLeft);
  T(nucLab, 600, 214, 'nuclear fuel', { size: 28, weight: 700, anchor: 'middle', fill: '#CDB6FF' });
  E('path', { d: 'M538,254 Q538,238 554,238 L586,238 Q600,238 600,224 Q600,238 614,238 L646,238 Q662,238 662,254', fill: 'none', stroke: '#CDB6FF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, nucLab);
  const NRK = ['coal', 'oil', 'gas', 'uranium'];
  const LW = [[130, 318], [250, 318], [370, 318], [600, 318]], RW = [[125, 318], [295, 318], [125, 500], [295, 500]];
  const uGlow = E('circle', { r: 70, fill: glow('#B48CFF') }, gLeft); op(uGlow, 0);
  const four = NRK.map(k => enResource(gLeft, k));
  const pin = pushPin(gLeft);

  // pros
  const gPros = G(gLeft);
  const pros = [['reliable', 486], ['available on demand', 550], ['lots of energy from a little fuel', 614]].map(([txt, y]) => { const r = markRow(gPros, txt, true); return { r, y }; });
  const burst = G(gPros); tr(burst, 728, 628);
  const bCoal = enResource(burst, 'coal', { label: false }); tr(bCoal, 0, 6, 0.55);
  const bSparks = [0, 1, 2, 3, 4].map(i => ({ sp: spark(burst, 13, { seed: i + 2 }), a: -Math.PI / 2 + (i - 2) * 0.55 }));

  // cons
  const gCons = G(gLeft);
  const chim = chimney(gCons); tr(chim, 120, 700);
  const CTOP = [120 + chim.top[0], 700 + chim.top[1]];
  const glb = globe(gCons, 54); tr(glb, 290, 560);
  const glbHeat = heatWaves(gCons, { n: 3, h: 34, spacing: 22, width: 4.5 }); tr(glbHeat, 290, 500);
  const soot = [0, 1, 2, 3, 4].map(() => E('circle', { r: 12, fill: '#56606A' }, gCons));
  const co2s = [];
  for (let i = 0; i < 6; i++) { const a = (-165 + i * 28) * Math.PI / 180; co2s.push({ m: molCO2(gCons, 8), x: 290 + Math.cos(a) * 80, y: 560 + Math.sin(a) * 78, ph: i * 0.7 }); }
  const cons = [['climate change', 486], ['pollution', 550], ['will run out', 614]].map(([txt, y]) => { const r = markRow(gCons, txt, false); return { r, y }; });

  // nuclear: watch out, pinned in place
  const gNuc = G(gLeft);
  const warn = warnSign(gNuc); tr(warn, 110, 520);
  T(gNuc, 160, 532, 'watch out!', { size: 34, weight: 700, fill: C.energy });
  const nucChip = G(gNuc);
  { const segs = [['low-carbon', GRN, 800], [', but ', C.ink], ['non-renewable', '#FF9AA4', 800]];
    const w = textWidth('low-carbon, but non-renewable', 30, FD, 800) + 48;
    E('rect', { x: 415 - w / 2, y: 594, width: w, height: 54, rx: 27, fill: C.card2, stroke: '#CDB6FF', 'stroke-width': 2.5 }, nucChip);
    rich(nucChip, 415, 631, segs, { size: 30, anchor: 'middle' }); }
  const notHere = cross(gLeft, 22);

  // right: replaced, won't run out, little or no CO2
  const gRen = G(gRight);
  const loopG = G(gRen), loop = loopArrow(loopG, 92, GRN);
  T(loopG, 0, 11, 'replaced', { size: 30, weight: 700, anchor: 'middle', fill: GRN });
  const gaugeF = fuelGauge(gRen, 105); tr(gaugeF, 965, 395, 0.62); op(gaugeF.letters, 0); gaugeF.face.setAttribute('stroke', GRNDK);
  const fullLab = T(gRen, 965, 508, "won't run out", { size: 28, weight: 700, anchor: 'middle', fill: C.ink });
  const co2Chip = G(gRen);
  { const c = chip(co2Chip, 'little or no CO₂', { size: 30, fill: 'rgba(86,214,155,0.14)', stroke: GRN, sw: 2.5 }); tr(c, 785, 612); }

  /* ================= C. the seven renewables (they go on to the horses row and the cards) ================= */
  const gSevBack = G(root);       // rcons card backgrounds sit behind the icons
  const gSeven = G(root);
  const RK = EN.renewable;        // solar, wind, hydro, tidal, wave, geothermal, biomass
  const GRID = [[522, 318], [697, 318], [872, 318], [1047, 318], [610, 500], [785, 500], [960, 500]];
  const ROWY = 430, rowX = i => 135 + 155 * i;
  const slots = GRID.map(([x, y]) => E('circle', { cx: x, cy: y, r: 46, fill: 'rgba(86,214,155,0.06)', stroke: GRN, 'stroke-width': 3, 'stroke-dasharray': '9 8', opacity: 0.7 }, gSeven));
  const sevGlow = [E('circle', { r: 76, fill: glow(C.heat) }, gSeven), E('circle', { r: 76, fill: glow(C.plant) }, gSeven)];
  sevGlow.forEach(g => op(g, 0));
  const seven = RK.map(k => { const ic = enResource(gSeven, k); ic.art = ic.firstChild; ic.lab = ic.lastChild; return ic; });
  const miniSun = G(gSeven);
  E('circle', { r: 36, fill: glow('#FFD24A') }, miniSun);
  { let d = ''; for (let i = 0; i < 8; i++) { const a = i * TAU / 8; d += `M${f1(Math.cos(a) * 20)},${f1(Math.sin(a) * 20)} L${f1(Math.cos(a) * 27)},${f1(Math.sin(a) * 27)} `; } miniSun.rays = E('path', { d, stroke: '#FFD24A', 'stroke-width': 3, 'stroke-linecap': 'round' }, miniSun); }
  E('circle', { r: 15, fill: ball('#FFE066', '#F5A300') }, miniSun);
  const SEVEN_AT = [0.12, 0.19, 0.25, 0.37, 0.44, 0.49, 0.8];

  /* ================= D. Six Wild Horses Took Wet Grass Back ================= */
  const gWords = G(root);
  const WORDS = ['Six', 'Wild', 'Horses', 'Took', 'Wet', 'Grass', 'Back'];
  const WORD_AT = [0.32, 0.4, 0.48, 0.66, 0.73, 0.8, 0.87];   // as each word is said
  const words = WORDS.map((w, i) => {
    const g = G(gWords), L = w[0], R = w.slice(1);
    const wl = textWidth(L, 50, FD, 800), wr = textWidth(R, 46, FD, 700);
    const lt = T(g, 0, 0, L, { size: 50, weight: 800, anchor: 'start', fill: GRN });
    const rt = T(g, 0, 0, R, { size: 46, weight: 700, anchor: 'start', fill: C.ink });
    return { g, lt, rt, wl, wr, x: rowX(i) };
  });
  const gHorse = G(root);
  const ground = E('line', { x1: 60, y1: 702, x2: 1140, y2: 702, stroke: C.line, 'stroke-width': 3, 'stroke-linecap': 'round' }, gHorse);
  const hrs = horse(gHorse);

  /* ================= E. unreliable: night and a calm day ================= */
  const gRc = G(gSevBack), gRcF = G(root);
  const cardL = [80, 180, 480, 480], cardR = [640, 180, 480, 480];
  const skyClipL = clipUrl(`M${cardL[0] + 22},${cardL[1]} L${cardL[0] + cardL[2] - 22},${cardL[1]} Q${cardL[0] + cardL[2]},${cardL[1]} ${cardL[0] + cardL[2]},${cardL[1] + 22} L${cardL[0] + cardL[2]},${cardL[1] + cardL[3] - 22} Q${cardL[0] + cardL[2]},${cardL[1] + cardL[3]} ${cardL[0] + cardL[2] - 22},${cardL[1] + cardL[3]} L${cardL[0] + 22},${cardL[1] + cardL[3]} Q${cardL[0]},${cardL[1] + cardL[3]} ${cardL[0]},${cardL[1] + cardL[3] - 22} L${cardL[0]},${cardL[1] + 22} Q${cardL[0]},${cardL[1]} ${cardL[0] + 22},${cardL[1]} Z`);
  const solarCard = G(gRc, { 'clip-path': skyClipL });
  E('rect', { x: 80, y: 180, width: 480, height: 480, fill: '#2A6F95' }, solarCard);
  const nightSky = E('rect', { x: 80, y: 180, width: 480, height: 480, fill: '#081624' }, solarCard);
  const stars = G(solarCard);
  { const r = rng(12); let d = ''; for (let i = 0; i < 12; i++) { const x = 110 + r() * 420, y = 205 + r() * 200, rr = 1.5 + r() * 2; d += `M${f1(x - rr)},${f1(y)} a${f1(rr)},${f1(rr)} 0 1 0 ${f1(2 * rr)},0 a${f1(rr)},${f1(rr)} 0 1 0 ${f1(-2 * rr)},0 `; } E('path', { d, fill: '#F2F7FA' }, stars); }
  const bigSun = sun(solarCard, 32);
  const moon = G(solarCard); E('path', { d: 'M8,-30 A30,30 0 1 0 30,8 A22,22 0 1 1 8,-30 Z', fill: '#F4F1DE' }, moon); tr(moon, 450, 262);
  E('rect', { x: 80, y: 572, width: 480, height: 88, fill: '#1F4A33' }, solarCard);
  E('rect', { x: 80, y: 180, width: 480, height: 480, rx: 22, fill: 'none', stroke: C.line, 'stroke-width': 3 }, gRc);
  const windCard = G(gRc);
  E('rect', { x: 640, y: 180, width: 480, height: 480, rx: 22, fill: '#2A6F95', stroke: C.line, 'stroke-width': 3 }, windCard);
  const calmSky = E('path', { d: 'M662,180 L1098,180 Q1120,180 1120,202 L1120,572 L640,572 L640,202 Q640,180 662,180 Z', fill: '#3F6F86' }, windCard);
  E('path', { d: 'M640,572 L1120,572 L1120,638 Q1120,660 1098,660 L662,660 Q640,660 640,638 Z', fill: '#1F4A33' }, windCard);
  const streaks = G(windCard), streakList = [];
  { const r = rng(7); for (let i = 0; i < 7; i++) streakList.push({ el: E('path', { fill: 'none', stroke: '#E8F4FA', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, streaks), y: 220 + i * 46 + r() * 16, ph: r(), len: 70 + r() * 50 }); }
  const sunLab = T(gRcF, 320, 226, 'day', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const nightLab = T(gRcF, 320, 226, 'night', { size: 30, weight: 700, anchor: 'middle', fill: '#C9D6F0' });
  const windLab = T(gRcF, 1000, 226, 'windy', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
  const calmLab = T(gRcF, 1000, 226, 'calm', { size: 30, weight: 700, anchor: 'middle', fill: '#C9D6F0' });
  const meters = [[110, 616], [670, 616]].map(([x, y]) => {
    const g = G(gRcF);
    T(g, x, y + 10, 'power', { size: 28, weight: 700, fill: C.muted });
    const m = meter(g, { w: 300, h: 26, color: C.energy }); tr(m, x + 110, y - 12);
    return m;
  });
  const unrel = chip(gRcF, 'unreliable', { size: 30, fill: 'rgba(255,96,112,0.14)', stroke: C.bad, sw: 2.5 }); tr(unrel, 600, 140);

  /* ================= F. space, cost and wildlife ================= */
  const gSp = G(root);
  E('rect', { x: 60, y: 160, width: 1080, height: 520, rx: 24, fill: linGrad('#1D4B63', '#123142', true), stroke: C.line, 'stroke-width': 3 }, gSp);
  const spClip = clipUrl('M84,160 L1116,160 Q1140,160 1140,184 L1140,656 Q1140,680 1116,680 L84,680 Q60,680 60,656 L60,184 Q60,160 84,160 Z');
  const land = G(gSp, { 'clip-path': spClip });
  E('rect', { x: 60, y: 470, width: 560, height: 210, fill: '#2C6B45' }, land);
  const PROF = [[600, 470], [660, 488], [720, 520], [780, 566], [840, 604], [900, 616], [990, 618], [1050, 590], [1100, 520], [1140, 470]];
  E('path', { d: 'M' + PROF.map(p => p.join(',')).join(' L') + ' L1140,680 L600,680 Z', fill: '#2C6B45' }, land);
  const trees = [[690, 504, 0.9], [760, 552, 1], [830, 600, 0.9]].map(([x, y, s]) => { const tg = tree(land, s); tr(tg, x, y); return tg; });
  const res = E('path', { fill: C.water, opacity: 0.82 }, land);
  const resTop = E('path', { fill: 'none', stroke: '#BDEBFA', 'stroke-width': 3 }, land);
  E('path', { d: 'M944,618 L1010,618 L994,494 L968,494 Z', fill: ball('#B5C0CA', '#6B7884'), stroke: '#4B5865', 'stroke-width': 3, 'stroke-linejoin': 'round' }, land);
  E('path', { d: 'M1010,616 Q1060,606 1140,612 L1140,630 L1010,630 Z', fill: C.water, opacity: 0.7 }, land);
  const farm = G(gSp), panels = [];
  [[508, 40, 0.62], [548, 48, 0.75], [594, 56, 0.88], [642, 64, 1]].forEach(([y, w, k], row) => {
    let d = '';
    for (let i = 0; i < 6; i++) { const x = 330 + (i - 2.5) * (66 + 14 * k), h = w * 0.42; d += `M${f1(x - w / 2)},${f1(y + h / 2)} L${f1(x + w * 0.38)},${f1(y + h / 2)} L${f1(x + w / 2)},${f1(y - h / 2)} L${f1(x - w * 0.38)},${f1(y - h / 2)} Z `; }
    panels.push({ p: E('path', { d, fill: '#1D3D78', stroke: '#A9C8FF', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, farm), d: (3 - row) * 0.22 });
  });
  const spaceLab = G(gSp);
  { const a1 = arrow(spaceLab, 330, 452, 112, 452, { color: C.ink, width: 4 }), a2 = arrow(spaceLab, 330, 452, 548, 452, { color: C.ink, width: 4 }); a1.set(1); a2.set(1); }
  T(spaceLab, 330, 428, 'lots of space', { size: 30, weight: 700, anchor: 'middle' });
  const placeLab = T(gSp, 975, 452, 'special places', { size: 30, weight: 700, anchor: 'middle' });
  const tag = priceTag(gSp);
  const brd = bird(gSp);
  const wildG = G(gSp);
  const wildWarn = warnSign(wildG); tr(wildWarn, 930, 262, 0.8);
  T(wildG, 930, 330, 'disturbs wildlife', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= G. an energy mix, balancing three weights ================= */
  const gMix = G(root);
  E('rect', { x: 530, y: 132, width: 140, height: 12, rx: 6, fill: '#5E6C78' }, gMix);
  E('line', { x1: 600, y1: 144, x2: 600, y2: 300, stroke: '#9AA8B4', 'stroke-width': 5 }, gMix);
  const mixLab = T(gMix, 300, 214, 'energy mix', { size: 40, weight: 700, anchor: 'middle', fill: C.ink });
  const beam = G(gMix);
  const MIXK = ['gas', 'uranium', 'wind', 'solar', 'hydro', 'biomass'];
  const MIXC = ['#3B82F6', '#B48CFF', '#DDE7EE', '#FFD24A', '#4CC9F0', '#C8955F'];
  const segW = 680 / 6;
  const mixIcons = MIXK.map((k, i) => {
    E('rect', { x: f1(-340 + i * segW), y: 0, width: f1(segW + (i < 5 ? 1 : 0)), height: 34, fill: MIXC[i] }, beam);
    const ic = enResource(beam, k, { label: false }); return { ic, x: -340 + (i + 0.5) * segW };
  });
  E('rect', { x: -340, y: 0, width: 680, height: 34, rx: 6, fill: 'none', stroke: '#E9EEF2', 'stroke-width': 3 }, beam);
  E('circle', { cx: 0, cy: 0, r: 8, fill: '#C9D6DE' }, beam);
  const WT = [['reliability', -270], ['cost', 0], ['low carbon', 270]].map(([txt, x]) => ({ g: weight(gMix, txt), str: E('line', { stroke: '#9AA8B4', 'stroke-width': 3 }, gMix), x }));
  const balTick = G(gMix);
  { const c = chip(balTick, 'balanced', { size: 28, fill: 'rgba(86,214,155,0.14)', stroke: GRN, sw: 2.5 }); tr(c, 600, 626); const tk = tick(balTick, 13); tr(tk, 600 - c.w / 2 - 26, 628); }

  /* ================= H. the nuclear debate ================= */
  const gDeb = G(root);
  const dChip = chip(gDeb, 'science today', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(dChip, 600, 142);
  const dHead = T(gDeb, 600, 214, 'nuclear power: still debated', { size: 40, weight: 700, anchor: 'middle' });
  E('path', { d: 'M520,672 L680,672 L652,646 L548,646 Z', fill: '#5E6C78', stroke: '#9AA8B4', 'stroke-width': 3, 'stroke-linejoin': 'round' }, gDeb);
  E('rect', { x: 592, y: 320, width: 16, height: 330, rx: 4, fill: '#8D9BA7' }, gDeb);
  const dBeam = G(gDeb);
  E('rect', { x: -290, y: -7, width: 580, height: 14, rx: 7, fill: '#B9C6D2', stroke: '#E9EEF2', 'stroke-width': 2 }, dBeam);
  const dRod = enResource(gDeb, 'uranium', { label: false }); tr(dRod, 600, 276, 0.62);
  E('circle', { cx: 600, cy: 320, r: 10, fill: '#E9EEF2' }, gDeb);
  const pans = [-1, 1].map(side => {
    const g = G(gDeb), strs = E('path', { fill: 'none', stroke: '#9AA8B4', 'stroke-width': 3 }, g), cont = G(g);
    E('path', { d: 'M-100,0 Q0,44 100,0 Z', fill: '#8D9BA7', stroke: '#E9EEF2', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    return { g, strs, cont, side };
  });
  // left pan: low-carbon (a small CO2 with a down arrow)
  const lowC = G(pans[0].cont);
  tr(molCO2(lowC, 13), -14, -26);
  { const a = arrow(lowC, 48, -52, 48, -4, { color: GRN, width: 6 }); a.set(1); }
  const lowLab = T(pans[0].g, 0, 76, 'low-carbon', { size: 32, weight: 700, anchor: 'middle', fill: GRN });
  // right pan: radioactive waste
  const drum = wasteDrum(pans[1].cont); tr(drum, 0, -2, 0.85);
  const wasteLab = T(pans[1].g, 0, 76, 'radioactive waste', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const danger = G(pans[1].g);
  const hg = hourglass(danger); tr(hg, -138, 116);
  T(danger, -112, 112, 'dangerous for', { size: 26, weight: 600, fill: C.ink });
  T(danger, -112, 144, 'thousands of years', { size: 26, weight: 600, fill: C.ink });

  /* ================= update ================= */
  return t0 => {
    const t = Math.min(t0, S.D), tc = t * calm;
    const tNon = at('nonrenew'), tFos = at('fossil'), tPro = at('pros'), tCon = at('cons'), tNuc = at('nuclear');
    const tRen = at('renew'), tSev = at('seven'), tHor = at('horses'), tRc = at('rcons'), tSp = at('space'), tMix = at('mix'), tDeb = at('debate');

    /* --- A --- */
    const aOut = P(t, mid('resource', 0.84), 0.45, linear);
    op(gA, 1 - aOut);
    if (aOut < 1) {
      const tp = P(t, at('resource'), 0.7, easeOut);
      op(aTitle, tp); aTitle.setAttribute('transform', `translate(0 ${f1((1 - tp) * 18)})`);
      popAt(aCoal, popIn(t, mid('resource', 0.08)), 175, 410);
      popAt(aWind, popIn(t, mid('resource', 0.16)), 315, 410);
      aWind.upd(tc);
      aArrow.set(P(t, mid('resource', 0.36), 0.5)); op(aArrow, P(t, mid('resource', 0.36), 0.15, linear));
      const pp = P(t, mid('resource', 0.4), 0.6, easeOut); op(aPyl, pp); tr(aPyl, 560, 592 + (1 - pp) * 20);
      aWire.draw(P(t, mid('resource', 0.55), 0.7)); aWire.upd(t, 70);
      op(aSock, P(t, mid('resource', 0.58), 0.4, linear));
      aCable.draw(P(t, mid('resource', 0.64), 0.5)); aCable.upd(t, 60);
      op(aBulb, P(t, mid('resource', 0.64), 0.4, linear)); aBulb.set(P(t, mid('resource', 0.72), 0.5, linear));
      const ep = popIn(t, mid('resource', 0.6)); popAt(aElec, ep, 728, 392, 0.7);
    }

    /* --- B: the columns --- */
    const pIn = P(t, mid('resource', 0.84), 0.8, easeOut);
    const pLW = P(t, tNon - 0.1, 0.9), pRW = P(t, tRen - 0.2, 1.1), pOut = P(t, tHor - 0.35, 0.6, linear);
    const Lc = [lerp(lerp(40, 40, pLW), 40, pRW), lerp(lerp(585, 790, pLW), 380, pRW)];
    const Rc = [lerp(lerp(615, 820, pLW), 410, pRW), lerp(1160, 1160, pLW)];
    const lx0 = lerp(Lc[1] - 4, Lc[0], pIn), rx1 = lerp(Rc[0] + 4, Rc[1], pIn);
    attr(pnL, 'x', lx0); attr(pnL, 'width', Math.max(1, Lc[1] - lx0));
    attr(pnR, 'x', Rc[0]); attr(pnR, 'width', Math.max(1, rx1 - Rc[0]));
    const focL = lerp(1, 0.55, pRW), focR = lerp(lerp(1, 0.45, pLW), 1, pRW);
    op(gLeft, clamp(pIn * 2) * focL * (1 - pOut));
    op(gRight, clamp(pIn * 2) * focR * (1 - pOut));
    const hdIn = P(t, mid('resource', 0.9), 0.5, linear);
    op(hdL, hdIn); tr(hdL, (Lc[0] + Lc[1]) / 2, 170);
    const toMid = P(t, tHor - 0.3, 0.8);
    tr(hdR, lerp((Rc[0] + Rc[1]) / 2, 600, toMid), 170);
    op(hdR, hdIn * lerp(focR, 1, toMid) * (1 - P(t, tRc - 0.6, 0.35, linear)));

    if (pIn > 0 && pOut < 1) {
      // fuel gauge: big while it runs out, then a small reminder in the corner, then at the narrow column's foot
      const gIn = P(t, mid('nonrenew', 0.04), 0.5, easeOut), sh = P(t, tFos - 0.2, 0.8), nb = pRW;
      const gx = lerp(lerp(415, 738, sh), 210, nb), gy = lerp(lerp(372, 166, sh), 652, nb), gs = lerp(lerp(1, 0.3, sh), 0.4, nb);
      op(gauge, gIn * (1 - Math.sin(Math.PI * nb))); tr(gauge, gx, gy, gs * lerp(0.85, 1, gIn));
      op(gauge.letters, 1 - P(t, tFos - 0.2, 0.3, linear));
      const pulse = Math.sin(Math.PI * P(t, mid('cons', 0.9), 0.6, linear)) + Math.sin(Math.PI * P(t, mid('nuclear', 0.42), 0.6, linear));
      gauge.set(lerp(1, 0.04, P(t, mid('nonrenew', 0.12), 3.4)) - 0.04 * pulse);
      if (pulse > 0) tr(gauge, gx, gy, gs * (1 + 0.25 * pulse));
      op(runOut, P(t, mid('nonrenew', 0.55), 0.4, linear) * (1 - P(t, tFos - 0.3, 0.4, linear)));

      // the four non-renewables
      const fosL = P(t, mid('fossil', 0.08), 0.4, linear) * (1 - P(t, tRen - 0.2, 0.4, linear));
      op(fosLab, fosL); fosBr.setAttribute('stroke-dashoffset', (1 - P(t, mid('fossil', 0.1), 0.8)).toFixed(3));
      op(nucLab, P(t, mid('fossil', 0.66), 0.4, linear) * (1 - P(t, tRen - 0.2, 0.4, linear)));
      const NAT = [0.27, 0.36, 0.47, 0.7];
      // nuclear: the rod edges towards the renewable side, is turned back and pinned
      const slide = P(t, mid('nuclear', 0.12), 0.7, ease) * (1 - P(t, mid('nuclear', 0.25), 0.45, pop));
      four.forEach((ic, i) => {
        const p = popIn(t, mid('fossil', NAT[i]));
        let x = lerp(LW[i][0], RW[i][0], ease(pRW)), y = lerp(LW[i][1], RW[i][1], ease(pRW));
        if (i === 3) x += 150 * slide;
        popAt(ic, p, x, y, 0.5);
        ic.upd(tc + i);
      });
      const uPos = [lerp(LW[3][0], RW[3][0], ease(pRW)) + 150 * slide, lerp(LW[3][1], RW[3][1], ease(pRW))];
      op(uGlow, (P(t, mid('fossil', 0.72), 0.5, linear) * 0.5 + 0.5 * win(t, tNuc, tRen - 0.2, 0.4)) * (0.75 + 0.25 * wave(t, 1.4)));
      tr(uGlow, uPos[0], uPos[1]);
      const pinP = P(t, mid('nuclear', 0.32), 0.35, easeIn);
      op(pin, clamp(pinP * 4) * (1 - P(t, tRen - 0.3, 0.3, linear)));
      tr(pin, uPos[0], uPos[1] - 34 - (1 - pinP) * 70);
      const nh = win(t, mid('nuclear', 0.2), mid('nuclear', 0.42), 0.2);
      op(notHere, nh * clamp(pIn * 2)); tr(notHere, 905, 318, 0.6 + 0.4 * pop(clamp(nh * 1.2)));

      // pros
      const aPro = win(t, tPro - 0.1, tCon + 0.1, 0.4);
      op(gPros, aPro);
      if (aPro > 0) {
        [0.2, 0.42, 0.7].forEach((f, i) => { const p = P(t, mid('pros', f), 0.45, easeOut); op(pros[i].r, p); tr(pros[i].r, 120 - (1 - p) * 30, pros[i].y); const m = popIn(t, mid('pros', f) + 0.3); tr(pros[i].r.mark, -28, 2, Math.max(0.01, m)); });
        const bp = P(t, mid('pros', 0.74), 0.4, linear); op(burst, bp);
        bSparks.forEach((b, i) => { const u = frac((t - mid('pros', 0.74)) * 0.7 + i / 5), d = 22 + 62 * easeOut(u); tr(b.sp, Math.cos(b.a) * d, -10 + Math.sin(b.a) * d, 0.7 + 0.5 * (1 - u)); op(b.sp, bp * Math.sin(u * Math.PI)); b.sp.upd(t); });
      }

      // cons
      const aCon = win(t, tCon - 0.1, tNuc + 0.1, 0.4);
      op(gCons, aCon);
      if (aCon > 0) {
        const cp = P(t, tCon, 0.6, easeOut); op(chim, cp); tr(chim, 120, 700 + (1 - cp) * 20);
        op(glb, P(t, mid('cons', 0.1), 0.5, linear));
        const warmP = P(t, mid('cons', 0.3), 2.4, linear); glb.set(warmP);
        glbHeat.upd(tc); op(glbHeat, warmP);
        co2s.forEach((c, i) => {
          const u = clamp((t - mid('cons', 0.08) - i * 0.32) / 1.6), e = ease(u);
          const x = (1 - e) * (1 - e) * CTOP[0] + 2 * (1 - e) * e * (CTOP[0] + 30) + e * e * c.x, y = (1 - e) * (1 - e) * CTOP[1] + 2 * (1 - e) * e * 430 + e * e * c.y;
          tr(c.m, x + (u >= 1 ? Math.sin(tc * 1.3 + c.ph) * 3 : 0), y + (u >= 1 ? Math.cos(tc * 1.1 + c.ph) * 3 : 0), 1, u * 160 + (u >= 1 ? 8 * Math.sin(tc + c.ph) : 0));
          op(c.m, clamp(u * 5));
        });
        const sp = P(t, mid('cons', 0.62), 0.5, linear);
        soot.forEach((s, i) => { const u = frac((t - mid('cons', 0.62)) * 0.45 + i / 5); attr(s, 'cx', CTOP[0] + 4 + u * 34 + Math.sin(u * 6 + i) * 6); attr(s, 'cy', CTOP[1] - 8 - u * 120); attr(s, 'r', 9 + u * 14); op(s, sp * 0.85 * (1 - u) * (t > mid('cons', 0.62) ? 1 : 0)); });
        [0.42, 0.66, 0.9].forEach((f, i) => { const p = P(t, mid('cons', f), 0.45, easeOut); op(cons[i].r, p); tr(cons[i].r, 470 + (1 - p) * 30, cons[i].y); const m = popIn(t, mid('cons', f) + 0.3); tr(cons[i].r.mark, -28, 0, Math.max(0.01, m)); });
      }

      // nuclear
      const aNuc = win(t, tNuc - 0.1, tRen - 0.15, 0.4);
      op(gNuc, aNuc);
      if (aNuc > 0) {
        const w = popIn(t, at('nuclear')); tr(warn, 110, 520, Math.max(0.01, w) * (1 + 0.06 * Math.sin(t * 6) * calm));
        const nc = P(t, mid('nuclear', 0.62), 0.5, easeOut); op(nucChip, nc); tr(nucChip, 0, (1 - nc) * 16);
      }

      // right column: replaced
      const aRen = win(t, tRen - 0.1, tSev + 0.15, 0.4);
      op(gRen, aRen);
      if (aRen > 0) {
        loop.upd(tc); popAt(loopG, popIn(t, mid('renew', 0.14), 0.6), 700, 395, 0.6);
        const gp = popIn(t, mid('renew', 0.36)); op(gaugeF, clamp(gp * 2)); tr(gaugeF, 965, 395, 0.62 * lerp(0.7, 1, gp)); gaugeF.set(0.97 + 0.03 * Math.sin(tc * 2));
        op(fullLab, P(t, mid('renew', 0.42), 0.4, linear));
        const cc = P(t, mid('renew', 0.7), 0.5, easeOut); op(co2Chip, cc); tr(co2Chip, 0, (1 - cc) * 16);
      }
    }

    /* --- C/D: the seven, then the horses row --- */
    const pRow = P(t, tHor - 0.3, 1.0), pCard = P(t, tRc - 0.4, 1.0);
    const sevOut = P(t, tRc - 0.6, 0.35, linear);
    op(gSeven, clamp(pIn * 2) * lerp(focR, 1, pRow));
    slots.forEach((c, i) => op(c, 0.7 * P(t, tSev + 0.15 + i * 0.06, 0.3, linear) * (1 - P(t, mid('seven', SEVEN_AT[i]), 0.25, linear))));
    seven.forEach((ic, i) => {
      const p = popIn(t, mid('seven', SEVEN_AT[i]));
      if (p <= 0) { op(ic, 0); return; }
      let x = lerp(GRID[i][0], rowX(i), ease(pRow)), y = lerp(GRID[i][1], ROWY, ease(pRow)), s = 1;
      const hop = Math.sin(Math.PI * P(t, mid('horses', WORD_AT[i]) - 0.05, 0.4, linear)) * 16;
      y -= hop;
      if (i === 5) s += 0.12 * Math.sin(Math.PI * P(t, mid('seven', 0.6), 0.9, linear));
      if (i === 6) s += 0.12 * Math.sin(Math.PI * P(t, mid('seven', 0.88), 0.9, linear));
      let alpha = clamp(p * 2);
      if (i === 0 || i === 1) {          // solar and wind fly into the cards
        const tx = i === 0 ? 320 : 880, ty = i === 0 ? 472 : 440, ts = i === 0 ? 2.2 : 2.4;
        x = lerp(x, tx, ease(pCard)); y = lerp(y, ty, ease(pCard));
        tr(ic.art, 0, 0, lerp(1, ts, ease(pCard)));
        op(ic.lab, (1 - Math.sin(Math.PI * pRow)) * (1 - P(t, tRc - 0.4, 0.3, linear)));
        alpha *= 1 - P(t, tSp - 0.5, 0.35, linear);
      } else { alpha *= 1 - sevOut; op(ic.lab, 1 - Math.sin(Math.PI * pRow)); }
      op(ic, alpha); tr(ic, x, y, Math.max(0.01, lerp(0.5, 1, p) * s));
    });
    // idle motion; the wind dies away on the calm day
    const tCalm = mid('rcons', 0.66), u = clamp(t - tCalm, 0, 1.8), tau = t < tCalm ? t : tCalm + u - u * u / 3.6;
    seven[1].upd(tau * (1 + 0.6 * pCard) * calm + 0.2);
    [2, 3, 4, 5].forEach(i => seven[i].upd(tc + i));
    const sunOn = popIn(t, mid('seven', 0.12) + 0.15) * (1 - P(t, tRc - 0.4, 0.3, linear));
    op(miniSun, clamp(sunOn * 2)); miniSun.rays.setAttribute('transform', `rotate(${f1((tc * 8) % 360)})`);
    { const sx = lerp(GRID[0][0], rowX(0), ease(pRow)) + 40, sy = lerp(GRID[0][1], ROWY, ease(pRow)) - 48; tr(miniSun, sx, sy, Math.max(0.01, sunOn)); }
    op(sevGlow[0], win(t, mid('seven', 0.58), end('seven') - 0.6, 0.4) * 0.8); tr(sevGlow[0], GRID[5][0], GRID[5][1]);
    op(sevGlow[1], win(t, mid('seven', 0.86), end('seven') + 0.2, 0.3) * 0.8); tr(sevGlow[1], GRID[6][0], GRID[6][1]);

    // the mnemonic grows out of the letters
    const aW = P(t, tHor - 0.1, 0.4, linear) * (1 - sevOut);
    op(gWords, aW);
    if (aW > 0) words.forEach((w, i) => {
      const lp = popIn(t, tHor + 0.15 + i * 0.07, 0.4), gp = P(t, mid('horses', WORD_AT[i]), 0.35, easeOut);
      const full = w.wl + w.wr, x0 = lerp(w.x - w.wl / 2, w.x - full / 2, gp);
      op(w.g, clamp(lp * 2)); tr(w.g, 0, (1 - clamp(lp)) * 14);
      attr(w.lt, 'x', x0); attr(w.lt, 'y', 300);
      attr(w.rt, 'x', x0 + w.wl); attr(w.rt, 'y', 300); op(w.rt, gp);
    });
    const hp = (t - tHor - 0.1) / (tRc - 0.3 - tHor - 0.1);
    op(gHorse, hp > 0 && hp < 1 ? 1 : 0);
    if (hp > 0 && hp < 1) { tr(hrs, lerp(-250, 1360, hp), 702, 0.78); hrs.run(t * 2.4); op(ground, Math.min(1, hp * 6, (1 - hp) * 6) * 0.8); }

    /* --- E: night and calm --- */
    const aRc = win(t, tRc - 0.25, tSp - 0.15, 0.35);
    op(gRc, aRc); op(gRcF, aRc);
    if (aRc > 0) {
      const ur = popIn(t, mid('rcons', 0.06)); popAt(unrel, ur, 600, 140, 0.7);
      const night = P(t, mid('rcons', 0.3), 1.3);
      op(nightSky, night); op(stars, P(t, mid('rcons', 0.3) + 0.6, 0.6, linear));
      tr(bigSun, 180, lerp(262, 640, P(t, mid('rcons', 0.3), 1.2, easeIn))); bigSun.upd(tc); op(bigSun, 1 - P(t, mid('rcons', 0.3) + 0.5, 0.7, linear));
      tr(moon, 450, 262 + (1 - P(t, mid('rcons', 0.4), 0.8, easeOut)) * 30); op(moon, P(t, mid('rcons', 0.4), 0.6, linear));
      op(sunLab, 1 - P(t, mid('rcons', 0.34), 0.25, linear)); op(nightLab, P(t, mid('rcons', 0.34) + 0.3, 0.25, linear));
      const still = P(t, tCalm - 0.1, 1.2, linear);
      op(calmSky, still * 0.9);
      streakList.forEach((s, i) => {
        const q = frac(tc * 0.55 + s.ph), x = 680 + q * 430;
        s.el.setAttribute('d', `M${f1(x - s.len)},${f1(s.y)} Q${f1(x - s.len / 2)},${f1(s.y - 10)} ${f1(x)},${f1(s.y)}`);
        op(s.el, (1 - still) * 0.8 * Math.sin(q * Math.PI));
      });
      op(windLab, 1 - P(t, tCalm, 0.25, linear)); op(calmLab, P(t, tCalm + 0.3, 0.25, linear));
      meters[0].set(lerp(0.85, 0, P(t, mid('rcons', 0.32), 1.2)));
      meters[1].set(lerp(0.8, 0, P(t, tCalm, 1.6)) * (0.97 + 0.03 * Math.sin(tc * 5)));
    }

    /* --- F: space, cost and wildlife --- */
    const aSp = win(t, tSp - 0.15, tMix + 0.1, 0.45);
    op(gSp, aSp);
    if (aSp > 0) {
      panels.forEach(p => op(p.p, P(t, mid('space', 0.04) + p.d * 1.6, 0.3, linear)));
      op(spaceLab, P(t, mid('space', 0.22), 0.4, linear));
      const L = lerp(618, 506, P(t, mid('space', 0.3), 4.5, ease));
      let xl = 600;
      for (let i = 0; i < PROF.length - 1; i++) { const a = PROF[i], b = PROF[i + 1]; if (a[1] <= L && b[1] > L) { xl = lerp(a[0], b[0], (L - a[1]) / (b[1] - a[1])); break; } }
      const below = PROF.filter(p => p[0] > xl && p[0] < 955 && p[1] > L);
      res.setAttribute('d', `M${f1(xl)},${f1(L)} ` + below.map(p => `L${p[0]},${p[1]}`).join(' ') + ` L955,618 L955,${f1(L)} Z`);
      resTop.setAttribute('d', `M${f1(xl)},${f1(L)} L955,${f1(L)}`);
      op(res, L < 617 ? 0.82 : 0); op(resTop, L < 617 ? 1 : 0);
      op(placeLab, P(t, mid('space', 0.36), 0.4, linear));
      const tp = popIn(t, mid('space', 0.55), 0.6), sw = 9 * Math.sin(tc * 2.2) * Math.exp(-Math.max(0, t - mid('space', 0.55)) * 0.5);
      op(tag, clamp(tp * 2)); tag.setAttribute('transform', `translate(600 ${f1(162 + (1 - clamp(tp)) * -40)}) rotate(${f1(sw)})`);
      const fl = P(t, mid('space', 0.72), 1.7, easeIn);
      tr(brd, lerp(830, 740, fl), lerp(526, 200, fl) - 16 * Math.sin(fl * Math.PI)); brd.flap(fl > 0 ? t * 16 : 0.4);
      op(brd, 1 - P(fl, 0.85, 0.15, linear));
      op(wildG, P(t, mid('space', 0.8), 0.4, linear));
    }

    /* --- G: the energy mix --- */
    const aMix = win(t, tMix - 0.15, tDeb + 0.1, 0.45);
    op(gMix, aMix);
    if (aMix > 0) {
      op(mixLab, P(t, mid('mix', 0.1), 0.4, linear));
      mixIcons.forEach((m, i) => { const p = P(t, mid('mix', 0.06 + i * 0.05), 0.45, easeOut); op(m.ic, p); tr(m.ic, m.x, -30 - (1 - p) * 50, 0.6); m.ic.upd(tc + i); });
      // tilt: reliability pulls the left end down, cost hangs at the pivot, low carbon levels it again
      const T1 = mid('mix', 0.52), T2 = mid('mix', 0.66), T3 = mid('mix', 0.8);
      const step = (tt, a) => t < tt ? 0 : a * (1 - Math.exp(-(t - tt) * 3.2) * Math.cos((t - tt) * 7));
      const bob = (tt, a) => t < tt ? 0 : a * Math.exp(-(t - tt) * 3) * Math.sin((t - tt) * 8);
      const th = step(T1, -7) + bob(T2, 1.6) + step(T3, 7);
      beam.setAttribute('transform', `translate(600 300) rotate(${f1(th)})`);
      const rad = th * Math.PI / 180;
      WT.forEach((w, i) => {
        const tt = [T1, T2, T3][i], p = P(t, tt - 0.3, 0.3, linear);
        const ax = 600 + Math.cos(rad) * w.x - Math.sin(rad) * 34, ay = 300 + Math.sin(rad) * w.x + Math.cos(rad) * 34;
        const drop = (1 - P(t, tt - 0.3, 0.35, easeOut)) * -40;
        tr(w.g, ax, ay + 56 + drop); op(w.g, p);
        attr(w.str, 'x1', ax); attr(w.str, 'y1', ay); attr(w.str, 'x2', ax); attr(w.str, 'y2', ay + 58 + drop); op(w.str, p);
      });
      const bt = popIn(t, mid('mix', 0.94)); op(balTick, clamp(bt * 2));
    }

    /* --- H: the debate --- */
    const aDeb = P(t, tDeb - 0.15, 0.45, linear);
    op(gDeb, aDeb);
    if (aDeb > 0) {
      op(dChip, P(t, tDeb, 0.4, linear)); op(dHead, P(t, mid('debate', 0.12), 0.4, linear));
      dRod.upd(tc);
      const L1 = mid('debate', 0.47), L2 = mid('debate', 0.63);
      const settle = (tt, a) => { const s = Math.max(0, t - tt); return t < tt ? 0 : a * (1 - Math.exp(-s * 3) * Math.cos(s * 6)); };
      const A0 = L2 + 0.9, argue = t < A0 ? 0 : 4 * P(t, A0, 0.8, linear) * Math.sin(TAU * (t - A0) / (S.D - A0)) * calm;   // rocks, then comes to rest level: still undecided
      const th = settle(L1, -6) + settle(L2, 6) + argue;
      dBeam.setAttribute('transform', `translate(600 320) rotate(${f1(th)})`);
      const rad = th * Math.PI / 180;
      pans.forEach(pn => {
        const ax = 600 + Math.cos(rad) * pn.side * 270, ay = 320 + Math.sin(rad) * pn.side * 270;
        tr(pn.g, ax, ay + 128);
        pn.strs.setAttribute('d', `M0,-128 L-92,0 M0,-128 L92,0`);
      });
      const lp = popIn(t, L1 - 0.15); op(lowC, clamp(lp * 2)); tr(lowC, 0, -(1 - clamp(lp)) * 30);
      op(lowLab, P(t, L1, 0.4, linear));
      const rp = popIn(t, L2 - 0.15); op(drum, clamp(rp * 2)); tr(drum, 0, -2 - (1 - clamp(rp)) * 30, 0.85);
      op(wasteLab, P(t, L2, 0.4, linear));
      op(danger, P(t, mid('debate', 0.8), 0.4, linear));
    }
  };
});

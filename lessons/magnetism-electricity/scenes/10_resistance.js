/* Chapter: Resistance and resistors.
   Beats: a resistor takes the bulb's place and every dot slows -> small vs large resistance
   (0.4 A vs 0.1 A) -> ohms, the Greek letter omega -> a short and a long wire clip into two
   loops -> a thick and a thin wire -> an LED pops without a resistor, glows safely with one
   -> the variable resistor beside a real rheostat -> showpiece: sliding the contact puts more
   coil in the circuit, the bulb dims and the ammeter falls, then rises again
   -> a dimmer switch and a volume control. */
scene('resistance', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SPD = 150;                     // dot speed per amp: 0.4 A is 60 px/s, as in every circuit in the lesson

  /* ---------- local helpers ---------- */
  // a polyline measured exactly like kit wire(), for current dots on a path that changes shape
  function track(pts) {
    const segs = []; let L = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
      segs.push([L, l, pts[i], pts[i + 1]]); L += l;
    }
    const pos = s => {
      s = ((s % L) + L) % L;
      for (const [s0, l, a, b] of segs) if (s <= s0 + l) { const p = (s - s0) / (l || 1); return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p]; }
      return pts[pts.length - 1];
    };
    return { L, pos };
  }
  // distance the current dots have moved by time t, from speed keys [[t, px/s], ...] (linear between keys)
  function travel(keys) {
    return t => {
      if (t <= keys[0][0]) return keys[0][1] * t;
      let d = keys[0][1] * keys[0][0];
      for (let i = 0; i < keys.length - 1; i++) {
        const [ta, va] = keys[i], [tb, vb] = keys[i + 1];
        if (t <= tb && tb > ta) { const v = va + (vb - va) * (t - ta) / (tb - ta); return d + (va + v) / 2 * (t - ta); }
        d += (va + vb) / 2 * (tb - ta);
      }
      const [tl, vl] = keys[keys.length - 1];
      return d + vl * (t - tl);
    };
  }
  const noLead = g => { g.firstChild.style.display = 'none'; return g; };      // the wire under it is its lead
  function meterAt(parent, x, y) { const g = noLead(meterSym(parent, 'A')); tr(g, x, y); return g; }
  function bulbAt(parent, x, y) { const g = noLead(bulbSym(parent)); tr(g, x, y); return g; }
  function batteryAt(parent, x, y) { const g = noLead(cellSym(parent, { cells: 2 })); tr(g, x, y); return g; }
  function resistorAt(parent, x, y) { const g = noLead(resistorSym(parent)); tr(g, x, y); return g; }
  const pathD = pts => 'M' + pts.map(p => p[0] + ',' + p[1]).join(' L');
  const line = (parent, pts, o) => { o = o || {}; return E('path', { d: pathD(pts), fill: 'none', stroke: o.color || WIRE, 'stroke-width': o.width || 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, parent); };
  const dotsOnly = (parent, pts) => { const w = wire(parent, pts); w.firstChild.style.display = 'none'; return w; };
  const amps = I => (Math.round(I * 10) / 10).toFixed(1) + ' A';
  const glowFor = I => 0.3 + 0.7 * Math.pow(clamp((I - 0.1) / 0.3), 1.35);     // bulb brightness: 1 at 0.4 A, dim at 0.1 A
  const lab = (parent, str, y, size, o) => T(parent, 600, y, str, Object.assign({ size, weight: 600, anchor: 'middle', boldFill: C.energy }, o || {}));
  // falls onto its spot with a little bounce
  function dropIn(g, t, t0, x, y, s) {
    if (t < t0) { op(g, 0); return; }
    const p = P(t, t0, 0.55, pop);
    op(g, clamp((t - t0) / 0.15)); tr(g, x, y - (1 - p) * 180, s);
  }
  // the Greek letter omega as a path (the lesson fonts have no Greek): feet on y = 0, about 0.89 s tall
  function omega(parent, s, color, width) {
    const k = v => (v * s).toFixed(1);
    return E('path', { d: `M${k(-0.46)},0 L${k(-0.2)},0 Q${k(-0.22)},${k(-0.06)} ${k(-0.26)},${k(-0.14)} A${k(0.42)},${k(0.42)} 0 1 1 ${k(0.26)},${k(-0.14)} Q${k(0.22)},${k(-0.06)} ${k(0.2)},0 L${k(0.46)},0`, fill: 'none', stroke: color, 'stroke-width': width || s * 0.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  // a pill reading "10 Ω"
  function ohmTag(parent, value, size) {
    const g = G(parent), tw = textWidth(value, size, FD, 700), ow = size * 0.73, gap = size * 0.24;
    const w = tw + gap + ow + size * 1.3, h = size * 1.75, x0 = -(tw + gap + ow) / 2;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke: C.energy, 'stroke-width': 3 }, g);
    T(g, x0, size * 0.35, value, { size, weight: 700 });
    tr(omega(g, size * 0.79, C.ink, size * 0.1), x0 + tw + gap + ow / 2, size * 0.35);
    return g;
  }
  /* the variable resistor and the LED, copied unchanged from 07_symbols (the owner of the extra symbols) */
  const SYM = { fill: 'none', stroke: WIRE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const sym = (o, extra) => Object.assign({}, SYM, o, extra || {});
  function leadsTo(g, a, b) { E('path', sym({ d: `M-54,0 L${-a},0 M${b === undefined ? a : b},0 L54,0` }), g); }
  /* variable resistor: the resistor box with an arrow through it, from lower left to upper right */
  function varResistorSym(parent) {
    const g = resistorSym(parent);
    g.arrow = G(g);
    E('line', sym({ x1: -36, y1: 27, x2: 25, y2: -19 }, { 'stroke-width': 4 }), g.arrow);
    E('path', { d: 'M38,-28.5 L30,-12.5 L20.4,-25.3 Z', fill: WIRE, stroke: WIRE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g.arrow);
    return g;
  }
  /* LED: the diode inside a circle, with two small arrows pointing up and outwards. g.set(glow 0..1); g.ring, g.arrows */
  function ledSym(parent) {
    const g = G(parent);
    g.halo = E('circle', { r: 80, fill: glow(C.energy) }, g);
    leadsTo(g, 30);
    g.ring = E('circle', { r: 30, fill: C.bg0, stroke: WIRE, 'stroke-width': 5 }, g);
    E('path', sym({ d: 'M-30,0 L-12,0 M12,0 L30,0' }), g);
    E('path', { d: 'M-12,-14 L12,0 L-12,14 Z', fill: WIRE, stroke: WIRE, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('line', sym({ x1: 12, y1: -15, x2: 12, y2: 15 }, { 'stroke-width': 4.5 }), g);
    g.arrows = G(g);
    [[8, -36], [24, -28]].forEach(([x, y]) => {
      const a = G(g.arrows);
      E('line', sym({ x1: x, y1: y, x2: x + 11, y2: y - 16 }, { 'stroke-width': 3.5 }), a);
      E('path', { d: `M${x + 17},${y - 25} L${x + 15.5},${y - 13.9} L${x + 7.3},${y - 19.5} Z`, fill: WIRE, stroke: WIRE, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, a);
    });
    g.set = v => op(g.halo, clamp(v));
    g.set(0);
    return g;
  }
  // the LED on this chapter's wire (its own leads hidden; the wire under it is its lead): g.set(v, t) lights it,
  // its arrows pulsing outwards as in 07_symbols; g.broken(b) shows it burnt out
  function ledPart(parent) {
    const g = ledSym(parent);
    g.childNodes[1].style.display = 'none';
    const crack = E('path', { d: 'M-17,-19 L-6,-7 L-13,1 L1,9 L-4,19', fill: 'none', stroke: '#9DB0BF', 'stroke-width': 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const glowSet = g.set;
    g.set = (v, t) => { v = clamp(v); glowSet(v); const push = v * 7 * calm * wave(t || 0, 0.9); tr(g.arrows, push * 0.57, -push * 0.82); };
    g.broken = b => { op(crack, b); g.ring.setAttribute('fill', b > 0.5 ? '#1A1F24' : C.bg0); };
    g.set(0); g.broken(0);
    return g;
  }
  // a crocodile clip at the end of a test gap
  function clipArt(parent, x, y) {
    const g = G(parent); tr(g, x, y);
    E('rect', { x: -15, y: -11, width: 30, height: 22, rx: 5, fill: '#8E9CA9', stroke: '#D5DEE5', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-11,-11 L-7,-4 L-3,-11 L1,-4 L5,-11 L9,-4', fill: 'none', stroke: '#E9EEF2', 'stroke-width': 2, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  const integ = (f, a, b) => { if (b <= a) return 0; const n = Math.ceil((b - a) * 60), h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };

  /* ================= A. a resistor takes the bulb's place ================= */
  // one loop (wire and battery) serves this beat and the LED beat, which never overlap
  const base = G(root);
  const aW = wire(base, [[575, 500], [300, 500], [300, 270], [900, 270], [900, 500], [625, 500]]);
  batteryAt(base, 600, 500);
  const A = G(root);
  const aAm = meterAt(A, 450, 270);
  const aBulb = bulbAt(A, 730, 270); aBulb.set(1);
  const aRes = resistorAt(A, 730, 270);
  const aRing = E('rect', { x: 672, y: 240, width: 116, height: 60, rx: 18, fill: 'none', stroke: C.energy, 'stroke-width': 4 }, A);
  const aLab = lab(root, '**Resistance**: how hard it is for current to flow', 642, 36);

  /* ================= B. small vs large resistance ================= */
  const B = G(root);
  const LOOPS = [310, 890];
  const bW = LOOPS.map(cx => wire(B, [[cx - 25, 470], [cx - 220, 470], [cx - 220, 250], [cx + 220, 250], [cx + 220, 470], [cx + 25, 470]]));
  LOOPS.forEach(cx => { batteryAt(B, cx, 470); resistorAt(B, cx + 110, 250); });
  const bAm = LOOPS.map(cx => meterAt(B, cx - 115, 250));
  bAm[0].set('0.4 A'); bAm[1].set('0.1 A');
  const bTag = ['small resistance', 'large resistance'].map((s, i) => { const c = chip(B, s, { size: 29, fill: C.card2, stroke: C.line }); tr(c, LOOPS[i], 548); return c; });
  const bLab = lab(root, 'more resistance, smaller current', 650, 38);

  /* ================= C. ohms ================= */
  const Cg = G(root);
  const bigOm = G(Cg); tr(bigOm, 380, 470);
  omega(bigOm, 290, C.energy, 26);
  const cName = T(Cg, 380, 566, 'ohms', { size: 50, weight: 700, anchor: 'middle' });
  const cGreek = T(Cg, 380, 612, 'the Greek letter omega', { size: 28, weight: 500, anchor: 'middle', fill: C.muted });
  const cRes = G(Cg); tr(cRes, 840, 440, 1.5); resistorSym(cRes);
  const cTag = ohmTag(Cg, '10', 34); tr(cTag, 840, 350);

  /* ================= D. long and thin wires ================= */
  const D = G(root);
  const DT = 250, DB = 470, COPPER = '#D9893F', COPPER_LT = '#F2B27A';
  const dLoops = LOOPS.map(cx => {
    const g = G(D), gx0 = cx + 60, gx1 = cx + 160;                     // the test gap between two clips
    line(g, [[cx - 25, DB], [cx - 220, DB], [cx - 220, DT], [gx0, DT]]);
    line(g, [[gx1, DT], [cx + 220, DT], [cx + 220, DB], [cx + 25, DB]]);
    batteryAt(g, cx, DB);
    const am = meterAt(g, cx - 115, DT);
    const before = [[cx - 25, DB], [cx - 220, DB], [cx - 220, DT], [gx0, DT]], after = [[gx1, DT], [cx + 220, DT], [cx + 220, DB], [cx + 25, DB]];
    return { g, cx, gx0, gx1, am, before, after };
  });
  // samples: [loop, path through the gap, thickness]
  const sample = (lp, mid_, width) => {
    const g = G(lp.g);
    line(g, mid_, { color: '#8A4F22', width: width + 4 });
    line(g, mid_, { color: COPPER, width });
    line(g, mid_.map(p => [p[0], p[1] - width * 0.22]), { color: COPPER_LT, width: Math.max(1.5, width * 0.22) });
    const dots = dotsOnly(g, lp.before.concat(mid_.slice(1, -1), lp.after));
    lp.g.appendChild(dots);                                               // dots ride over the whole loop
    return { g, dots };
  };
  const [dl, dr] = dLoops;
  const sShort = sample(dl, [[dl.gx0, DT], [dl.gx1, DT]], 12);
  const sLong = sample(dr, [[dr.gx0, DT], [dr.gx0, DT + 50], [dr.gx1, DT + 50], [dr.gx1, DT]], 12);
  const sThin = sample(dr, [[dr.gx0, DT], [dr.gx1, DT]], 6);
  dLoops.forEach(lp => { lp.clips = [clipArt(lp.g, lp.gx0, DT), clipArt(lp.g, lp.gx1, DT)]; lp.g.appendChild(lp.am); });
  const dTags = [['short', 'long'], ['thick', 'thin']].map(pair => pair.map((s, i) => { const c = chip(D, s, { size: 30, fill: C.card2, stroke: C.line }); tr(c, LOOPS[i], 548); return c; }));
  const dLong = lab(root, 'a **longer** wire: more resistance', 650, 38);
  const dThin = lab(root, 'a **thinner** wire: more resistance', 650, 38);
  const dSum = G(root);
  lab(dSum, '**long** and **thin**: the most resistance', 634, 34);
  lab(dSum, '**short** and **thick**: the least', 684, 34, { boldFill: C.good });

  /* ================= E. an LED needs a resistor ================= */
  const Eg = G(root);
  const eRes = resistorAt(Eg, 470, 270);
  const eLed = ledPart(Eg); tr(eLed, 730, 270);
  const eNew = ledPart(Eg); tr(eNew, 730, 270);
  const ePop = spark(Eg, 46, { color: '#FFF3B0', seed: 4 }); tr(ePop, 730, 262);
  const eFlash = E('circle', { cx: 730, cy: 270, r: 140, fill: glow('#FFFFFF') }, Eg);
  const smoke = [0, 1, 2].map(i => E('circle', { r: 12 + i * 4, fill: '#8A9BAA' }, Eg));
  const eHot = chip(Eg, 'too much current!', { size: 30, fill: 'rgba(255,96,112,0.16)', stroke: C.bad, color: '#FFB3BB' }); tr(eHot, 925, 176);
  const eTick = tick(Eg, 22); tr(eTick, 812, 196);
  const eLab = lab(root, 'a **resistor** limits the current', 640, 38);
  const eLab2 = lab(root, 'and protects parts like an **LED**', 690, 30, { weight: 500, fill: C.muted, boldFill: C.ink });

  /* ================= F. the variable resistor and a real rheostat ================= */
  const F = G(root);
  const fSym = varResistorSym(F); tr(fSym, 300, 330, 1.6);
  const fCap1 = T(F, 300, 440, 'circuit symbol', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const fCap2 = T(F, 790, 440, 'the real thing', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const fLab = lab(root, 'a **variable resistor**, or **rheostat**', 560, 40);
  const fLab2 = lab(root, 'adjusted by sliding a contact', 612, 30, { weight: 500, fill: C.muted });
  const fPtr = G(root);
  const fPtrLine = E('line', { x1: 790, y1: 168, stroke: C.muted, 'stroke-width': 2.5 }, fPtr);
  const fPtrDot = E('circle', { r: 4.5, fill: C.muted }, fPtr);
  T(fPtr, 790, 150, 'sliding contact', { size: 28, weight: 600, anchor: 'middle' });

  /* ================= G. the rheostat in a circuit ================= */
  const Gc = G(root);
  const RX = 560, RY = 300;                                               // rheostat position in the circuit
  const gWires = [wire(Gc, [[575, 560], [200, 560], [200, RY], [RX - 212, RY]]), wire(Gc, [[RX + 212, RY - 66], [1040, RY - 66], [1040, 560], [625, 560]])];
  batteryAt(Gc, 600, 560);
  const gAm = meterAt(Gc, 860, RY - 66);
  const gBulb = bulbAt(Gc, 960, RY - 66);
  const gCoil = T(root, RX, 150, '**more coil** in the circuit', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const gFall = lab(root, 'more resistance: the current **falls**', 652, 36);
  const gRise = lab(root, 'slide back: the current **rises**', 652, 36);

  // the rheostat itself: a coil of wire on a tube, a metal bar above it, a sliding contact between them.
  // Current goes in at A (left end of the coil), along the coil to the slider, up into the bar and out at C.
  const RH = G(root);
  [-200, 178].forEach(x => E('rect', { x, y: -52, width: 22, height: 98, rx: 5, fill: '#4E5D69', stroke: '#8FA1AF', 'stroke-width': 2.5 }, RH));
  E('rect', { x: -178, y: -30, width: 356, height: 60, rx: 14, fill: '#3B4651' }, RH);
  const coilG = G(RH);
  for (let i = 0; i < 38; i++) { const x = -170 + i * 9.1; E('line', { x1: x, y1: -28, x2: x + 5, y2: 28, stroke: COPPER, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, coilG); }
  const active = E('rect', { x: -174, y: -33, width: 10, height: 66, rx: 12, fill: C.energy, opacity: 0 }, RH);
  E('rect', { x: -204, y: -72, width: 408, height: 12, rx: 4, fill: linGrad('#E2E9EE', '#7D8C99', true), stroke: '#EEF3F6', 'stroke-width': 1.5 }, RH);
  [[-212, 0], [212, -66], [212, 0]].forEach(([x, y]) => { E('circle', { cx: x, cy: y, r: 10, fill: ball('#E8C15A', '#9C7A1F'), stroke: '#F5DC94', 'stroke-width': 2 }, RH); E('circle', { cx: x, cy: y, r: 3.5, fill: '#5A4510' }, RH); });
  const rhDotsG = G(RH), rhDots = [];
  for (let k = 0; k < 10; k++) rhDots.push(E('circle', { r: 5.5, fill: C.energy }, rhDotsG));
  const slider = G(RH);
  E('path', { d: 'M-7,-50 L0,-31 L7,-50', fill: 'none', stroke: '#E2E9EE', 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, slider);
  E('rect', { x: -21, y: -84, width: 42, height: 36, rx: 7, fill: '#5E6E7B', stroke: '#C2CED8', 'stroke-width': 2.5 }, slider);
  E('rect', { x: -9, y: -106, width: 18, height: 24, rx: 5, fill: '#26303A', stroke: '#8FA1AF', 'stroke-width': 2 }, slider);
  const RHL = 490;                                                        // current path length through it, whatever the slider
  const xsAt = f => lerp(-150, 160, clamp(f));                            // slider x for a setting 0 (little coil) .. 1 (all of it)
  function setRheo(f, d, on) {
    const xs = xsAt(f);
    tr(slider, xs, 0);
    attr(active, 'width', xs + 174); attr(active, 'opacity', 0.24 * on);
    op(rhDotsG, on);
    if (on > 0) {
      const tk = track([[-212, 0], [-170, 0], [xs, 0], [xs, -66], [196, -66], [212, -66]]);
      rhDots.forEach((c, k) => { const q = tk.pos(k * RHL / rhDots.length + d); attr(c, 'cx', q[0]); attr(c, 'cy', q[1]); });
    }
  }

  /* ================= H. dimmer switch and volume control ================= */
  const Hg = G(root);
  E('path', { d: 'M250,340 L250,130 L450,130', fill: 'none', stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }, Hg);
  const plate = G(Hg); tr(plate, 250, 420);
  E('rect', { x: -80, y: -80, width: 160, height: 160, rx: 18, fill: '#E9EEF2', stroke: '#B8C6D1', 'stroke-width': 3 }, plate);
  for (let i = 0; i <= 6; i++) { const a = (-135 + i * 45) * Math.PI / 180; E('circle', { cx: Math.sin(a) * 64, cy: -Math.cos(a) * 64, r: 2.5 + i * 0.7, fill: '#8FA1AF' }, plate); }
  const knob = G(plate);
  E('circle', { r: 48, fill: ball('#6E7C88', '#2B3440'), stroke: '#C2CED8', 'stroke-width': 3 }, knob);
  E('line', { x1: 0, y1: -38, x2: 0, y2: -16, stroke: C.energy, 'stroke-width': 7, 'stroke-linecap': 'round' }, knob);
  const lamp = G(Hg); tr(lamp, 450, 236);
  const lampCone = E('path', { d: 'M-54,50 L54,50 L150,330 L-150,330 Z', fill: C.energy, opacity: 0.1 }, lamp);
  const lampGlow = E('circle', { cx: 0, cy: 62, r: 130, fill: glow(C.energy) }, lamp);
  E('line', { x1: 0, y1: -106, x2: 0, y2: 4, stroke: '#8FA1AF', 'stroke-width': 3 }, lamp);
  const lampBulb = E('circle', { cx: 0, cy: 56, r: 17, fill: C.energy }, lamp);
  E('path', { d: 'M-20,0 L20,0 L58,52 L-58,52 Z', fill: ball('#5BB7A0', '#2C7765'), stroke: '#9EE0CF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, lamp);
  const hDim = T(Hg, 340, 630, 'dimmer switch', { size: 34, weight: 700, anchor: 'middle' });
  const vol = G(Hg); tr(vol, 770, 410);
  E('rect', { x: -44, y: -128, width: 88, height: 256, rx: 18, fill: C.card, stroke: C.line, 'stroke-width': 3 }, vol);
  E('rect', { x: -5, y: -100, width: 10, height: 200, rx: 5, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, vol);
  for (let i = 0; i <= 8; i++) E('line', { x1: 14, x2: i % 4 ? 24 : 30, y1: -100 + i * 25, y2: -100 + i * 25, stroke: C.muted, 'stroke-width': 2.5 }, vol);
  const fader = G(vol);
  E('rect', { x: -28, y: -12, width: 56, height: 24, rx: 7, fill: ball('#E2E9EE', '#7D8C99'), stroke: '#F2F7FA', 'stroke-width': 2 }, fader);
  E('line', { x1: -18, y1: 0, x2: 18, y2: 0, stroke: '#2B3440', 'stroke-width': 3 }, fader);
  const spk = G(Hg); tr(spk, 905, 410);
  E('path', { d: 'M-34,-22 L-12,-22 L18,-50 L18,50 L-12,22 L-34,22 Z', fill: ball('#8FA1AF', '#4E5D69'), stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, spk);
  const arcs = [40, 72, 104].map(r => E('path', { d: `M${(18 + 0.643 * r).toFixed(1)},${(-0.766 * r).toFixed(1)} A${r},${r} 0 0 1 ${(18 + 0.643 * r).toFixed(1)},${(0.766 * r).toFixed(1)}`, fill: 'none', stroke: C.water, 'stroke-width': 7, 'stroke-linecap': 'round' }, spk));
  const hVol = T(Hg, 860, 630, 'volume control', { size: 34, weight: 700, anchor: 'middle' });

  /* ================= timing ================= */
  const tSwap = at('what') + 0.35;
  const dA = travel([[0, 60], [tSwap + 0.45, 60], [tSwap + 0.85, 30]]);
  const tS1 = mid('long', 0.14), tS2 = mid('long', 0.34), tOut = mid('thin', 0.04), tS3 = mid('thin', 0.14);
  const dD = [travel([[0, 0], [tS1 + 0.5, 0], [tS1 + 0.5, 60]]), travel([[0, 0], [tS2 + 0.5, 0], [tS2 + 0.5, 30]]), travel([[0, 0], [tS3 + 0.5, 0], [tS3 + 0.5, 15]])];
  const tPop = at('resistor') + 0.55, tFix = at('resistor') + 1.55, tOn = tFix + 0.6;
  const dE = travel([[0, 150], [tPop, 150], [tPop, 0], [tOn, 0], [tOn, 45]]);
  const fSl = t => t < at('slide') - 0.5
    ? 0.25 + 0.5 * P(t, mid('variable', 0.28), 1.2) - 0.75 * P(t, mid('variable', 0.68), 1.0)
    : P(t, mid('slide', 0.07), 2.5) - P(t, mid('slide', 0.62), 1.8);
  const curr = f => 3 / (7.5 + 22.5 * clamp(f));                         // 3 V across a 7.5 ohm bulb plus 0..22.5 ohms of coil
  const tG0 = at('slide') - 0.5;

  return t => {
    /* A */
    const aOp = 1 - P(t, at('less') - 0.45, 0.4, linear);
    const eOp = win(t, at('resistor') - 0.35, at('variable') - 0.05, 0.4);
    op(base, Math.max(aOp, eOp));
    op(A, aOp);
    if (aOp > 0) {
      const d = dA(t), v = (dA(t + 0.02) - dA(t - 0.02)) / 0.04;
      aW.set(1); aW.upd(d, 1);
      aAm.set(amps(v / SPD));
      const out = P(t, tSwap, 0.35, easeIn), inn = P(t, tSwap + 0.15, 0.5, pop);
      op(aBulb, 1 - out); tr(aBulb, 730, 270, Math.max(0.01, 1 - 0.7 * out));
      op(aRes, clamp(inn * 3)); tr(aRes, 730, 270, Math.max(0.01, 0.3 + 0.7 * inn));
      const rp = P(t, tSwap + 0.6, 0.5, pop);
      op(aRing, rp > 0 ? clamp(rp * 2) * (1 - P(t, tSwap + 1.6, 0.5, linear)) : 0);
      aRing.setAttribute('transform', `translate(730 270) scale(${(0.8 + 0.2 * rp).toFixed(3)}) translate(-730 -270)`);
    }
    op(aLab, win(t, mid('what', 0.22), at('less') - 0.05, 0.4));

    /* B */
    const bOp = win(t, at('less') - 0.3, at('ohm') - 0.05, 0.4);
    op(B, bOp);
    if (bOp > 0) {
      bW[0].upd(60 * t, 1); bW[1].upd(15 * t, 1);
      bTag.forEach((c, i) => op(c, P(t, mid('less', 0.12 + i * 0.16), 0.4, linear)));
    }
    op(bLab, win(t, mid('less', 0.45), at('ohm') - 0.05, 0.4));

    /* C */
    const cOp = win(t, at('ohm') - 0.3, at('long') - 0.05, 0.4);
    op(Cg, cOp);
    if (cOp > 0) {
      const p = P(t, at('ohm') - 0.15, 0.7, pop);
      tr(bigOm, 380, 470, Math.max(0.01, 0.7 + 0.3 * p));
      op(cName, P(t, mid('ohm', 0.15), 0.4, linear));
      op(cGreek, P(t, mid('ohm', 0.5), 0.4, linear));
      const rp = P(t, mid('ohm', 0.35), 0.5, pop);
      op(cRes, clamp(rp * 2)); op(cTag, P(t, mid('ohm', 0.5), 0.4, linear));
      tr(cTag, 840, 350 + (1 - P(t, mid('ohm', 0.5), 0.5, easeOut)) * 14);
    }

    /* D */
    const dOp = win(t, at('long') - 0.3, at('resistor') - 0.05, 0.4);
    op(D, dOp);
    if (dOp > 0) {
      dropIn(sShort.g, t, tS1, 0, 0);
      dropIn(sLong.g, t, tS2, 0, 0);
      if (t > tOut) { const up = P(t, tOut, 0.45, easeIn); tr(sLong.g, 0, -170 * up); op(sLong.g, 1 - P(t, tOut + 0.2, 0.25, linear)); }
      dropIn(sThin.g, t, tS3, 0, 0);
      // a loop carries current only once its gap is bridged; every dot starts (and stops) together
      const on = [t >= tS1 + 0.5, t >= tS2 + 0.5 && t < tOut, t >= tS3 + 0.5];
      [sShort, sLong, sThin].forEach((s, i) => { s.dots.set(on[i] ? 1 : 0); if (on[i]) s.dots.upd(dD[i](t), 1); });
      dl.am.set(on[0] ? '0.4 A' : '');
      dr.am.set(on[2] ? '0.1 A' : on[1] ? '0.2 A' : '');
      const snap = t0 => Math.sin(Math.PI * P(t, t0, 0.3, linear));
      const sq = [snap(tS1 + 0.45), Math.max(snap(tS2 + 0.45), snap(tS3 + 0.45))];
      dLoops.forEach((lp, k) => { tr(lp.clips[0], lp.gx0, DT, 1 + 0.25 * sq[k]); tr(lp.clips[1], lp.gx1, DT, 1 + 0.25 * sq[k]); });
      dTags[0].forEach((c, i) => op(c, win(t, mid('long', 0.2 + i * 0.2), at('thin') + 0.2, 0.4)));
      dTags[1].forEach((c, i) => op(c, P(t, i ? tS3 + 0.4 : at('thin') + 0.3, 0.4, linear)));
    }
    op(dLong, win(t, mid('long', 0.5), at('thin') + 0.1, 0.4));
    op(dThin, win(t, mid('thin', 0.28), mid('thin', 0.62), 0.4));
    op(dSum, win(t, mid('thin', 0.64), at('resistor') - 0.05, 0.4));

    /* E */
    op(Eg, eOp);
    if (eOp > 0) {
      const on = t < tPop ? 1 : t < tOn ? 1 - P(t, tPop, 0.25, linear) : P(t, tOn, 0.15, linear);
      aW.set(on); aW.upd(dE(t), 1);
      // no resistor: far too much current, the LED blazes and pops
      const blaze = t < tPop ? 1 : 0;
      eLed.set(blaze * (0.85 + 0.15 * wave(t, 0.23)), t); eLed.broken(t >= tPop ? 1 : 0);
      const pp = P(t, tPop, 0.7, linear);
      op(ePop, t >= tPop ? Math.sin(Math.PI * pp) : 0); tr(ePop, 730, 262, 0.6 + 1.2 * pp); ePop.upd(t);
      op(eFlash, t >= tPop ? 1 - P(t, tPop, 0.35, linear) : 0);
      smoke.forEach((c, i) => { const u = (t - tPop - 0.15 - i * 0.18) / 1.4; op(c, u > 0 && u < 1 ? 0.5 * Math.sin(Math.PI * u) : 0); attr(c, 'cx', 730 + i * 9 - 9 + Math.sin(u * 5 + i) * 6); attr(c, 'cy', 250 - u * 90); });
      op(eHot, win(t, tPop + 0.15, tFix + 0.2, 0.3));
      // fix it: a fresh LED and a resistor in series; the LED glows steadily
      op(eLed, 1 - P(t, tFix, 0.3, linear)); op(eNew, P(t, tFix, 0.3, linear));
      eNew.set(t >= tOn ? 0.85 * P(t, tOn, 0.2, linear) : 0, t); eNew.broken(0);
      dropIn(eRes, t, tFix, 470, 270);
      const tk = P(t, tOn + 0.5, 0.45, pop); op(eTick, clamp(tk * 2)); tr(eTick, 812, 196, Math.max(0.01, tk));
    }
    op(eLab, win(t, tOn + 0.2, at('variable') - 0.05, 0.4));
    op(eLab2, win(t, mid('resistor', 0.72), at('variable') - 0.05, 0.4));

    /* F, G: the rheostat, then the rheostat in a circuit */
    const f = fSl(t);
    const fOp = win(t, at('variable') - 0.3, at('slide') - 0.1, 0.4);
    op(F, fOp); op(fLab, win(t, mid('variable', 0.05), at('slide') - 0.1, 0.4)); op(fLab2, win(t, mid('variable', 0.55), at('slide') - 0.1, 0.4));
    op(fCap1, P(t, at('variable') + 0.2, 0.4, linear)); op(fCap2, P(t, at('variable') + 0.5, 0.4, linear));
    const rhOp = P(t, at('variable') - 0.3, 0.4, linear) * (1 - P(t, at('uses') - 0.45, 0.4, linear));
    op(RH, rhOp);
    const mv = P(t, at('slide') - 0.45, 0.9);
    const rx = lerp(790, RX, mv), ry = lerp(330, RY, mv);
    const gOp = P(t, at('slide') - 0.2, 0.5, linear) * (1 - P(t, at('uses') - 0.45, 0.4, linear));
    op(Gc, gOp);
    const ptrOp = win(t, mid('variable', 0.3), at('slide') - 0.2, 0.4);
    op(fPtr, ptrOp);
    if (rhOp > 0) {
      tr(RH, rx, ry);
      let d = 0, I = curr(f);
      if (gOp > 0) d = integ(u => SPD * curr(fSl(u)), tG0, t);
      setRheo(f, d, gOp);
      if (gOp > 0) {
        gWires.forEach(w => w.upd(d, 1));
        gAm.set(amps(I)); gBulb.set(glowFor(I));
      }
      if (ptrOp > 0) {
        const kx = rx + xsAt(f), ky = ry - 104;
        attr(fPtrLine, 'x2', kx); attr(fPtrLine, 'y2', ky - 6);
        attr(fPtrDot, 'cx', kx); attr(fPtrDot, 'cy', ky);
      }
    }
    op(gCoil, win(t, mid('slide', 0.12), mid('slide', 0.6), 0.4));
    op(gFall, win(t, mid('slide', 0.2), mid('slide', 0.6), 0.4));
    op(gRise, P(t, mid('slide', 0.6), 0.4, linear) * (1 - P(t, at('uses') - 0.45, 0.4, linear)));

    /* H */
    const hOp = P(t, at('uses') - 0.3, 0.45, linear);
    op(Hg, hOp);
    if (hOp > 0) {
      const k = P(t, mid('uses', 0.38), 1.3), lv = 1 - 0.75 * k;
      tr(knob, 0, 0, 1, -135 * k);
      attr(lampCone, 'opacity', 0.12 * lv); lampGlow.style.opacity = lv.toFixed(3); lampBulb.style.opacity = (0.3 + 0.7 * lv).toFixed(3);
      const vk = P(t, mid('uses', 0.68), 1.1), vv = 1 - 0.7 * vk;
      tr(fader, 0, lerp(-75, 55, vk));
      arcs.forEach((a, i) => { const o = clamp(vv * 3 - i); op(a, o); tr(a, 0, 0, 0.9 + 0.1 * wave(t, 0.5, i * 0.3) * calm * o); });
      op(hDim, P(t, mid('uses', 0.36), 0.4, linear)); op(hVol, P(t, mid('uses', 0.66), 0.4, linear));
    }
  };
});

/* Chapter: Hazards, concentration and strength.
   Beats: an ACIDS property card (sour, never taste; blue litmus turns red; fizzes with metals and carbonates) and an
   ALKALIS card (soapy; red litmus turns blue; neutralise acids) -> the corrosive hazard symbol beside a bottle of
   concentrated acid, then it steps aside for the irritant symbol and a bottle of dilute acid -> a dilute beaker (six
   acid particles in lots of water) and a concentrated one (a crowd in little water) -> a drop from each, magnified
   -> strength is not concentration: acids splitting into ions beside the two beakers -> showpiece: the 2 x 2 grid of
   dilute / concentrated by strong / weak; the dilute strong one can be safer -> safety goggles, and a bottle of
   concentrated weak acid. */
scene('hazards', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  const RED = '#E8424F', RED_DK = '#A4232E', BLUE = '#3F8FE8';
  const RED_T = '#FF6B76', BLUE_T = '#6FB0FF', CLEAR = '#CFE7F5', INK_DK = '#10202B';
  const GHS = '#E3262F';

  /* ---------- helpers ---------- */
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, p) => { const x = hex(a), y = hex(b); p = clamp(p); return '#' + x.map((v, i) => Math.round(lerp(v, y[i], p)).toString(16).padStart(2, '0')).join(''); };
  /* text in coloured runs: segs [text, fill, weight, {dy, size}] */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; const a = s[3] || {}; E('tspan', { fill: s[1], 'font-weight': s[2], dy: a.dy, 'font-size': a.size }, t).textContent = s[0]; });
    return t;
  }
  const dropD = s => `M0,${-10 * s} C${6 * s},${-2 * s} ${8 * s},${3 * s} ${8 * s},${6 * s} A${8 * s},${8 * s} 0 0 1 ${-8 * s},${6 * s} C${-8 * s},${3 * s} ${-6 * s},${-2 * s} 0,${-10 * s} Z`;
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  /* a point drifting in a box [x0, x1] x [y0, y1], bouncing off the sides */
  function drifter(r, x0, y0, x1, y1, speed) {
    const gx = x0 + r() * (x1 - x0), gy = y0 + r() * (y1 - y0), a = r() * TAU, v = speed * (0.6 + 0.4 * r());
    const f = t => [bounce(gx + Math.cos(a) * v * t, x0, x1), bounce(gy + Math.sin(a) * v * t, y0, y1)];
    f.vx = Math.cos(a) * v; f.vy = Math.sin(a) * v;
    return f;
  }
  /* litmus paper, the indicators chapter's 40 x 150 strip drawn at scale k; origin at the middle of its held (top)
     end; g.set(p) the new colour creeps up from the wet end */
  function litmus(parent, from, to, k) {
    const w = 40, h = 150, g = G(parent), s = G(g); tr(s, 0, 0, k);
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 5, fill: from }, s);
    const wet = E('rect', { x: -w / 2, y: h, width: w, height: 0, rx: 5, fill: to }, s);
    E('rect', { x: -w / 2, y: 0, width: w, height: 30, rx: 5, fill: '#FFFFFF', opacity: 0.42 }, s);
    E('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 5, fill: 'none', stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 }, s);
    g.set = p => { const hh = h * clamp(p); attr(wet, 'y', h - hh); attr(wet, 'height', hh); };
    g.set(0);
    return g;
  }
  function lemonWedge(parent) {
    const g = G(parent);
    E('path', { d: 'M-42,0 A42,42 0 0 0 42,0 Z', fill: ball('#FFE45C', '#D9A400'), stroke: '#FFF3A6', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-34,3 A34,34 0 0 0 34,3 Z', fill: '#FFF2A8' }, g);
    let d = ''; for (let i = 1; i < 5; i++) { const a = Math.PI * i / 5; d += `M0,4 L${(-Math.cos(a) * 31).toFixed(1)},${(4 + Math.sin(a) * 31).toFixed(1)} `; }
    E('path', { d, stroke: '#EBCB4E', 'stroke-width': 2.5 }, g);
    return g;
  }
  /* an open mouth with the tongue poking out (the pH chapter's "never taste" icon) */
  function tongue(parent) {
    const g = G(parent);
    E('path', { d: 'M-62,-14 Q0,-44 62,-14 Q46,30 0,32 Q-46,30 -62,-14 Z', fill: '#4A0F1C', stroke: '#E86A86', 'stroke-width': 7, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-40,-16 Q0,-34 40,-16 L36,-6 Q0,-20 -36,-6 Z', fill: '#F4F7FA' }, g);
    E('path', { d: 'M-28,6 Q0,-6 28,6 L28,40 Q28,66 0,66 Q-28,66 -28,40 Z', fill: ball('#FF8FAF', '#C2456A'), stroke: '#FFC2D4', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M0,10 L0,46', stroke: '#C2456A', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function soapBubbles(parent) {
    const g = G(parent), bs = [];
    [[-14, 10, 22], [20, -12, 15], [24, 22, 10], [-6, -26, 9]].forEach(([x, y, r]) => {
      const b = G(g);
      E('circle', { r, fill: 'rgba(159,216,255,0.16)', stroke: '#DDF1FC', 'stroke-width': 2.5 }, b);
      E('path', { d: `M${-r * 0.55},${-r * 0.3} A${r * 0.62},${r * 0.62} 0 0 1 ${-r * 0.1},${-r * 0.62}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, b);
      bs.push({ b, x, y });
    });
    g.upd = t => bs.forEach((o, i) => tr(o.b, o.x + 2 * Math.sin(t * 1.3 + i) * calm, o.y - 3 * Math.sin(t * 0.9 + i * 2) * calm));
    g.upd(0);
    return g;
  }
  /* GHS hazard diamond, half-diagonal s: 'corrosive' (drips eating a hand and a bar) or 'irritant' (!).
     g.drip(t, damage) animates the corrosive drops */
  function diamond(parent, s, kind) {
    const g = G(parent);
    E('path', { d: `M0,${-s} L${s},0 L0,${s} L${-s},0 Z`, fill: '#FFFFFF', stroke: GHS, 'stroke-width': s * 0.11, 'stroke-linejoin': 'round' }, g);
    const sym = G(g); tr(sym, 0, 0, s / 110);
    const K = '#151A1E';
    if (kind === 'irritant') {
      E('rect', { x: -10, y: -60, width: 20, height: 74, rx: 9, fill: K }, sym);
      E('circle', { cx: 0, cy: 38, r: 12, fill: K }, sym);
      g.drip = () => {};
      return g;
    }
    // two tilted test tubes (rounded end up, mouth down) drip onto a metal bar and a hand
    const tube = (x, y, a) => { const tg = G(sym); tg.setAttribute('transform', `translate(${x} ${y}) rotate(${a})`); E('path', { d: 'M-8,-22 L-8,16 L8,16 L8,-22 A8,8 0 0 0 -8,-22 Z', fill: K }, tg); E('rect', { x: -10, y: 14, width: 20, height: 5, rx: 2, fill: K }, tg); };
    tube(-30, -50, 35); tube(30, -50, -35);
    E('rect', { x: -66, y: 30, width: 52, height: 16, rx: 2, fill: K }, sym);
    E('path', { d: 'M18,48 L18,30 Q18,24 24,24 L24,12 Q24,7 28,7 Q32,7 32,12 L32,22 L33,9 Q33,4 37,4 Q41,4 41,9 L41,22 L42,11 Q42,6 46,6 Q50,6 50,11 L50,26 L54,21 Q57,18 60,21 Q62,24 59,28 L52,40 L52,48 Z', fill: K }, sym);
    E('rect', { x: -74, y: 52, width: 148, height: 6, rx: 2, fill: K }, sym);
    const bite1 = E('circle', { cx: -40, cy: 30, r: 0, fill: '#FFFFFF' }, sym), bite2 = E('circle', { cx: 37, cy: 10, r: 0, fill: '#FFFFFF' }, sym);
    const dr = [0, 1, 2, 3].map(() => E('path', { d: dropD(0.55), fill: K }, sym));
    g.drip = (t, dmg) => {
      dr.forEach((d, i) => { const u = ((t * 0.8 * calm) + i * 0.5) % 1, x = i % 2 ? 39 : -39, y = lerp(-30, i % 2 ? 4 : 24, u); tr(d, x, y); op(d, Math.min(1, u * 5, (1 - u) * 5)); });
      attr(bite1, 'r', 8 * dmg); attr(bite2, 'r', 6 * dmg);
    };
    g.drip(0, 0);
    return g;
  }
  /* a reagent bottle of clear liquid with a hazard sticker; origin at the bottle's centre */
  function bottle(parent, kind) {
    const g = G(parent);
    const body = 'M-44,-46 Q-44,-62 -28,-62 L-16,-62 L-16,-84 L16,-84 L16,-62 L28,-62 Q44,-62 44,-46 L44,70 Q44,82 32,82 L-32,82 Q-44,82 -44,70 Z';
    E('path', { d: body, fill: 'rgba(200,230,250,0.12)' }, g);
    E('path', { d: 'M-39,-24 L39,-24 L39,68 Q39,77 30,77 L-30,77 Q-39,77 -39,68 Z', fill: CLEAR, opacity: 0.3 }, g);
    E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -22, y: -106, width: 44, height: 26, rx: 6, fill: '#2B3A44', stroke: '#5E7482', 'stroke-width': 2 }, g);
    E('rect', { x: -38, y: -10, width: 76, height: 76, rx: 6, fill: '#F4F7FA' }, g);
    const st = diamond(g, 30, kind); tr(st, 0, 28);
    g.sticker = st;
    return g;
  }
  /* the lesson's ion art (as in the acids and pH chapters): a charge badge, + red or - blue */
  function ionBadge(parent, r, sign) {
    const g = G(parent);
    E('circle', { r, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, g);
    E('path', { d: sign > 0 ? `M${-r * 0.5},0 H${r * 0.5} M0,${-r * 0.5} V${r * 0.5}` : `M${-r * 0.5},0 H${r * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, r * 0.3), 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* acid particles for the strength pictures, the shared acid particle at scale s (0.6 to fit these small beakers):
     a red partner joined to a white H. Each splits at its own time (Infinity: stays joined); after that its H drifts
     away as an H+ ion (red + badge) and the partner shows its - badge. Drawn without wrapper groups, and with badges
     only on particles that split, to keep the element count low. Returns update(t). box: [x0, y0, x1, y1] for the
     red partners */
  function acidSet(parent, n, box, splits, seed, speed, s) {
    s = s || 0.6;
    const r = rng(seed), ms = [], D = 29 * s, RB = 7.5 * s;
    const badge = sign => ({
      c: E('circle', { r: RB, fill: sign > 0 ? '#E8424F' : '#3F8FE8', stroke: sign > 0 ? '#FFC2C8' : '#BFDBFE', 'stroke-width': 1.5 }, parent),
      p: E('path', { d: sign > 0 ? `M${-RB * 0.5},0 H${RB * 0.5} M0,${-RB * 0.5} V${RB * 0.5}` : `M${-RB * 0.5},0 H${RB * 0.5}`, stroke: '#ffffff', 'stroke-width': Math.max(1.8, RB * 0.3), 'stroke-linecap': 'round' }, parent),
    });
    const place = (b, x, y) => { attr(b.c, 'cx', x); attr(b.c, 'cy', y); b.p.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`); };
    for (let i = 0; i < n; i++) {
      const split = splits[i] === undefined ? Infinity : splits[i];
      const a = E('circle', { r: 17 * s, fill: ball(RED, '#9E1F2B'), stroke: '#9E1F2B', 'stroke-width': 1.5 }, parent);
      const mb = split < Infinity ? badge(-1) : null;
      const h = E('circle', { r: 14 * s, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 1.5 }, parent);
      const pb = split < Infinity ? badge(1) : null;
      const b = [box[0] - 12, box[1] - 12, box[2] + 12, box[3] + 12];
      ms.push({ a, h, mb, pb, p: drifter(r, box[0], box[1], box[2], box[3], speed), hf: drifter(r, b[0], b[1], b[2], b[3], speed * 1.3), ph: r() * TAU, w: (r() - 0.5) * 1.4, split, b });
    }
    const hAt = (m, t) => { const [px, py] = m.p(t), an = m.ph + m.w * t; return [px + D * Math.cos(an), py + D * Math.sin(an)]; };
    return t => ms.forEach(m => {
      const [px, py] = m.p(t);
      let [hx, hy] = hAt(m, t);
      if (t > m.split) {
        const [sx, sy] = hAt(m, m.split), fx = bounce(sx + m.hf.vx * (t - m.split), m.b[0], m.b[2]), fy = bounce(sy + m.hf.vy * (t - m.split), m.b[1], m.b[3]);
        const k = ease(P(t, m.split, 0.8, linear)); hx = lerp(hx, fx, k); hy = lerp(hy, fy, k);
      }
      attr(m.a, 'cx', px); attr(m.a, 'cy', py); attr(m.h, 'cx', hx); attr(m.h, 'cy', hy);
      if (!m.mb) return;
      const bv = P(t, m.split + 0.3, 0.3, linear);
      [m.mb.c, m.mb.p, m.pb.c, m.pb.p].forEach(e => op(e, bv));
      if (bv > 0) { place(m.mb, px + 13 * s, py - 13 * s); place(m.pb, hx + 11 * s, hy - 11 * s); }
    });
  }
  /* a beaker with a box of drifting red acid particles in its liquid (kit particleBox, gas mode, low energy) */
  function acidBeaker(parent, w, h, level, n, seed) {
    const g = G(parent), bk = beaker(g, w, h, { level, liquid: CLEAR, opacity: 0.28 });
    const top = h / 2 - (h - 18) * level, pw = w - 30, ph = h / 2 - 8 - top - 4;
    const pb = particleBox(g, pw, ph, { n, r: 9, color: RED, dark: RED_DK, box: false, seed }); tr(pb, -pw / 2, top + 4);
    g.bk = bk; g.pb = pb; g.ps = Array.from(pb.childNodes);
    return g;
  }
  function notEqual(parent, s) {
    return E('path', { d: `M${-s},${-s * 0.36} L${s},${-s * 0.36} M${-s},${s * 0.36} L${s},${s * 0.36} M${s * 0.42},${-s * 1.0} L${-s * 0.42},${s * 1.0}`, stroke: C.ink, 'stroke-width': s * 0.2, 'stroke-linecap': 'round', fill: 'none' }, parent);
  }
  function goggles(parent) {
    const g = G(parent);
    E('path', { d: 'M-196,-14 C-236,-14 -250,24 -214,34 M196,-14 C236,-14 250,24 214,34', fill: 'none', stroke: '#2B3A44', 'stroke-width': 20, 'stroke-linecap': 'round' }, g);
    const fr = 'M-172,-56 Q0,-78 172,-56 Q198,-52 196,-14 L192,36 Q188,70 152,70 L44,70 Q22,70 14,52 Q0,28 -14,52 Q-22,70 -44,70 L-152,70 Q-188,70 -192,36 L-196,-14 Q-198,-52 -172,-56 Z';
    E('path', { d: fr, fill: 'rgba(159,216,255,0.24)', stroke: '#3FA9D6', 'stroke-width': 12, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M0,-60 L0,30', stroke: '#3FA9D6', 'stroke-width': 6, opacity: 0.5 }, g);
    E('path', { d: 'M-150,-30 Q-110,-46 -66,-38 M66,-38 Q110,-46 150,-30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, opacity: 0.55, 'stroke-linecap': 'round' }, g);
    for (let i = 0; i < 6; i++) E('circle', { cx: -125 + i * 50, cy: -50 + Math.abs(i - 2.5) * 2, r: 5, fill: '#1B6F96' }, g);
    return g;
  }

  /* ================= A. the two property cards ================= */
  const A = G(root);
  const cardA = G(A), cardB = G(A);
  card(cardA, 70, 118, 510, 548, { fill: C.card, stroke: C.line });
  T(cardA, 325, 178, 'ACIDS', { size: 46, weight: 700, anchor: 'middle', fill: RED_T });
  E('line', { x1: 104, y1: 202, x2: 546, y2: 202, stroke: C.line, 'stroke-width': 2 }, cardA);
  card(cardB, 620, 118, 510, 548, { fill: C.card, stroke: C.line });
  T(cardB, 875, 178, 'ALKALIS', { size: 46, weight: 700, anchor: 'middle', fill: BLUE_T });
  E('line', { x1: 654, y1: 202, x2: 1096, y2: 202, stroke: C.line, 'stroke-width': 2 }, cardB);
  // acids: sour (never taste!), blue litmus turns red, react with metals and carbonates
  const a1 = G(cardA); const lem = lemonWedge(a1); tr(lem, 140, 262, 1, -12); T(a1, 198, 282, 'sour', { size: 34, weight: 700 });
  const a1b = G(cardA); const tg = tongue(a1b); tr(tg, 396, 248, 0.75); const tgX = cross(a1b, 20); tr(tgX, 476, 252);
  const a1c = T(cardA, 420, 336, 'never taste in a lab!', { size: 26, weight: 700, anchor: 'middle', fill: '#FF8F9A' });
  const a2 = G(cardA);
  const stA = litmus(a2, BLUE, RED, 110 / 150);
  const mbA = beaker(a2, 90, 80, { level: 0.62, liquid: CLEAR, opacity: 0.3, marks: false }); tr(mbA, 140, 456);
  rich(a2, 205, 440, [['blue litmus', BLUE_T, 700], [' turns ', C.ink], ['red', RED_T, 800]], { size: 30 });
  const a3 = [0, 1].map(k => {
    const g = G(cardA), x = k ? 336 : 140, tb = testTube(g, 40, 116, { level: 0.6, liquid: CLEAR, opacity: 0.28 }); tr(tb, x, 574);
    if (k === 0) E('path', { d: `M${x - 9},626 q6,-14 0,-26 q-6,-12 2,-24`, fill: 'none', stroke: '#E3E8EE', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    else [[-7, 622, 8], [6, 624, 7], [0, 612, 6]].forEach(([dx, y, r]) => E('circle', { cx: x + dx, cy: y, r, fill: ball('#F2F4F6', '#A9B2BA') }, g));
    const bub = bubbles(g, x - 12, 560, 24, 58, { n: 6, r: 4, seed: 7 + k * 5, speed: 0.6 });
    T(g, x + 36, 586, k ? 'carbonates' : 'metals', { size: 32, weight: 700 });
    return { g, bub };
  });
  // alkalis: soapy, red litmus turns blue, neutralise acids
  const b1 = G(cardB); const soap = soapBubbles(b1); tr(soap, 700, 262); T(b1, 760, 282, 'soapy, slippery', { size: 34, weight: 700 });
  const b2 = G(cardB);
  const stB = litmus(b2, RED, BLUE, 110 / 150);
  const mbB = beaker(b2, 90, 80, { level: 0.62, liquid: CLEAR, opacity: 0.3, marks: false }); tr(mbB, 690, 456);
  rich(b2, 755, 440, [['red litmus', RED_T, 700], [' turns ', C.ink], ['blue', BLUE_T, 800]], { size: 30 });
  const b3 = chip(cardB, 'neutralise acids', { size: 32, fill: '#163F2A', stroke: C.good, color: C.good }); tr(b3, 875, 574);
  // strips go behind their little beakers so the dipped ends sit in the liquid
  a2.insertBefore(stA, mbA); b2.insertBefore(stB, mbB);

  /* ================= B. hazard symbols ================= */
  const B = G(root);
  const cor = G(B), irr = G(B);
  const corD = diamond(cor, 110, 'corrosive'); tr(corD, 215, 270);
  const corB = bottle(cor, 'corrosive'); tr(corB, 430, 300);
  const corBl = G(cor);
  T(corBl, 430, 428, 'concentrated', { size: 28, weight: 700, anchor: 'middle' });
  T(corBl, 430, 460, 'acid or alkali', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const corT = T(cor, 300, 528, 'CORROSIVE', { size: 48, weight: 700, anchor: 'middle', fill: '#FF6B6B' });
  corT.style.fontKerning = 'none';                     // Fredoka kerns "IV" until the letters touch ("CORROSNE")
  const corN1 = T(cor, 300, 572, 'destroys living tissue', { size: 32, weight: 600, anchor: 'middle' });
  const corN2 = T(cor, 300, 612, 'like skin and eyes', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const irrD = diamond(irr, 110, 'irritant'); tr(irrD, 815, 270);
  const irrB = bottle(irr, 'irritant'); tr(irrB, 1030, 300);
  const irrBl = G(irr);
  T(irrBl, 1030, 428, 'dilute', { size: 28, weight: 700, anchor: 'middle' });
  T(irrBl, 1030, 460, 'acid or alkali', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const irrT = T(irr, 900, 528, 'IRRITANT', { size: 48, weight: 700, anchor: 'middle', fill: '#FFB15C' });
  const irrN1 = T(irr, 900, 572, 'less severe: redness, itching', { size: 32, weight: 600, anchor: 'middle' });

  /* ================= C. dilute and concentrated beakers ================= */
  const Cg = G(root);
  const BKW = 230, BKH = 270;
  const bk1 = acidBeaker(Cg, BKW, BKH, 0.85, 6, 31), bk2 = acidBeaker(Cg, BKW, BKH, 0.3, 26, 47);
  const lab1 = T(Cg, 0, 0, 'DILUTE', { size: 46, weight: 700, anchor: 'middle', fill: C.air });
  const lab2 = T(Cg, 0, 0, 'CONCENTRATED', { size: 46, weight: 700, anchor: 'middle', fill: '#FF9A55' });
  const note1 = rich(Cg, 330, 588, [['a ', C.ink], ['little', C.air, 800], [' acid, ', C.ink], ['lots', C.air, 800], [' of water', C.ink]], { size: 30, anchor: 'middle' });
  const note2 = rich(Cg, 870, 588, [['lots', '#FF9A55', 800], [' of acid, ', C.ink], ['little', '#FF9A55', 800], [' water', C.ink]], { size: 30, anchor: 'middle' });
  const small1 = G(Cg), small2 = G(Cg);
  T(small1, 770, 568, 'dilute', { size: 30, weight: 700, anchor: 'middle', fill: C.air });
  T(small1, 770, 602, 'a little acid', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  T(small2, 1010, 568, 'concentrated', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A55' });
  T(small2, 1010, 602, 'lots of acid', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  // danger: a drop from each, magnified
  const warn = E('ellipse', { rx: 170, ry: 190, fill: glow('#FF6A3D') }, Cg);
  Cg.insertBefore(warn, Cg.firstChild);
  const hazChip = chip(Cg, 'more hazardous', { size: 30, fill: '#4A1E14', stroke: '#FF7A45', color: '#FFB08A' }); tr(hazChip, 790, 456);
  const fall = [0, 1].map(() => E('path', { d: dropD(1), fill: 'rgba(207,231,245,0.16)', stroke: GLASS.stroke, 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, Cg));
  const DROP_X = [470, 1010], DROP_Y = 466, DS = 8;
  // the particles in one drop: loosely spaced so they can be counted, each jiggling a little
  const MAG_AT = [[[0, 46]], [[0, -14], [-22, 14], [22, 14], [-42, 46], [0, 46], [42, 46], [-22, 78], [22, 78]]];
  const mags = MAG_AT.map((spots, k) => {
    const g = G(Cg);
    const halo = E('circle', { cx: 0, cy: 20, r: 120, fill: glow('#FF6A3D') }, g);
    E('path', { d: dropD(DS), fill: 'rgba(207,231,245,0.10)', stroke: GLASS.stroke, 'stroke-width': 4 }, g);
    const ps = spots.map(([x, y], i) => ({ el: E('circle', { r: 14, fill: ball(RED, RED_DK), stroke: RED_DK, 'stroke-width': 1.5 }, g), x, y, ph: i * 1.7 + k }));
    return { g, halo, ps };
  });
  const magN = [
    rich(Cg, DROP_X[0], 620, [['few', C.air, 800], [' acid particles', C.ink]], { size: 28, anchor: 'middle' }),
    rich(Cg, DROP_X[1], 620, [['many', '#FF9A55', 800], [' acid particles', C.ink]], { size: 28, anchor: 'middle' }),
  ];
  const DROP_T = [mid('danger', 0.38), mid('danger', 0.46)];

  /* ================= D. strength is not concentration ================= */
  const Dg = G(root);
  const headS = G(Dg), headC = G(Dg);
  T(headS, 305, 190, 'STRENGTH', { size: 46, weight: 700, anchor: 'middle', fill: C.energy });
  T(headS, 305, 230, 'how fully it ionises', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  T(headC, 890, 190, 'CONCENTRATION', { size: 46, weight: 700, anchor: 'middle', fill: C.air });
  T(headC, 890, 230, 'how much acid is in the water', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const neq = G(Dg); notEqual(neq, 40);
  const SBOX = [-52, -16, 52, 68];
  const strong = G(Dg), weak = G(Dg);
  beaker(strong, 170, 190, { level: 0.75, liquid: CLEAR, opacity: 0.28 }); tr(strong, 190, 420);
  beaker(weak, 170, 190, { level: 0.75, liquid: CLEAR, opacity: 0.28 }); tr(weak, 420, 420);
  const SPL = [0, 1, 2, 3, 4, 5].map(i => mid('notsame', 0.36 + 0.035 * i));
  const updStrong = acidSet(strong, 6, SBOX, SPL, 81, 12), updWeak = acidSet(weak, 6, SBOX, [mid('notsame', 0.47)], 83, 12);
  const sLab = G(Dg);
  T(sLab, 190, 566, 'strong', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  T(sLab, 190, 600, 'ionises fully', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const wLab = G(Dg);
  T(wLab, 420, 566, 'weak', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  T(wLab, 420, 600, 'only partly', { size: 24, weight: 600, anchor: 'middle', fill: C.muted });
  const legend = G(Dg);
  { const lg = G(legend); E('circle', { cx: 110, cy: 654, r: 10.2, fill: ball(RED, '#9E1F2B'), stroke: '#9E1F2B', 'stroke-width': 1.5 }, lg); tr(atom(lg, 'H', 8.4), 125, 645); }
  T(legend, 148, 661, 'acid particle', { size: 26, weight: 600, fill: C.muted });
  { const lh = G(legend); tr(lh, 334, 654); atom(lh, 'H', 8.4); tr(ionBadge(lh, 4.5, 1), 6.6, -6.6); }
  rich(legend, 356, 661, [['H', C.muted, 700], ['+', C.bad, 800, { dy: -11, size: 18 }], [' ion split off', C.muted, 600, { dy: 11 }]], { size: 26 });

  /* ================= E. the 2 x 2 grid (showpiece) ================= */
  const Eg = G(root);
  const GX = [520, 820], GYc = [308, 518];
  const colH = [T(Eg, GX[0], 182, 'dilute', { size: 36, weight: 700, anchor: 'middle', fill: C.air }), T(Eg, GX[1], 182, 'concentrated', { size: 36, weight: 700, anchor: 'middle', fill: '#FF9A55' })];
  const rowH = [T(Eg, 362, GYc[0] + 12, 'strong', { size: 36, weight: 700, anchor: 'end', fill: C.energy }), T(Eg, 362, GYc[1] + 12, 'weak', { size: 36, weight: 700, anchor: 'end', fill: C.energy })];
  // each header starts where the same word sat in the strength / concentration picture
  const HEADS = [
    { el: colH[0], dx: 770 - GX[0], dy: 568 - 182 },
    { el: colH[1], dx: 1010 - GX[1], dy: 568 - 182 },
    { el: rowH[0], dx: 190 - (362 - textWidth('strong', 36, FD, 700) / 2), dy: 566 - (GYc[0] + 12) },
    { el: rowH[1], dx: 420 - (362 - textWidth('weak', 36, FD, 700) / 2), dy: 566 - (GYc[1] + 12) },
  ];
  // cells: [col, row, molecules, splits]
  const CELLS = [[0, 0, 3, 'all'], [1, 0, 12, 'all'], [0, 1, 3, 0], [1, 1, 12, 2]].map(([c, r, n, s], k) => {
    const g = G(Eg), x = GX[c], y = GYc[r];
    const frame = E('rect', { x: x - 135, y: y - 98, width: 270, height: 196, rx: 20, fill: C.card, stroke: C.line, 'stroke-width': 2.5 }, g);
    const bg = G(g); beaker(bg, 150, 150, { level: 0.76, liquid: CLEAR, opacity: 0.28 }); tr(bg, x, y - 6);
    const splits = []; for (let i = 0; i < n; i++) splits.push(s === 'all' || i < s ? -50 : Infinity);
    const box = n > 4 ? [-46, -8, 46, 50] : [-38, 0, 38, 44];
    const upd = acidSet(bg, n, box, splits, 90 + k * 7, 10);
    return { g, frame, upd, x, y };
  });
  const safeChip = chip(Eg, 'can be safer', { size: 30, fill: C.good, color: INK_DK }); tr(safeChip, GX[0], GYc[0] + 92);
  const HIL = [mid('grid', 0.13), Infinity, Infinity, mid('grid', 0.42)];

  /* ================= F. safety goggles ================= */
  const Fg = G(root);
  const fHead = rich(Fg, 600, 176, [['Always wear ', C.ink], ['safety goggles', C.energy, 800]], { size: 46, weight: 700, anchor: 'middle' });
  const fBot = bottle(Fg, 'corrosive');
  const fBl = G(Fg);
  T(fBl, 860, 590, 'concentrated', { size: 30, weight: 700, anchor: 'middle', fill: '#FF9A55' });
  T(fBl, 860, 626, 'weak acid', { size: 30, weight: 700, anchor: 'middle' });
  const gog = goggles(Fg);
  const fNote = rich(Fg, 600, 680, [['even a ', C.ink], ['weak', C.energy, 800], [' acid can be ', C.ink], ['concentrated', '#FF9A55', 800], [' and harmful', C.ink]], { size: 30, anchor: 'middle' });

  /* ================= update ================= */
  return t => {
    /* ===== A: cards ===== */
    const outA = P(t, at('corrosive') - 0.25, 0.7, easeIn);
    const aA = P(t, S.first - 0.3, 0.3, linear) * (1 - P(t, at('corrosive') + 0.2, 0.3, linear));
    op(A, aA);
    if (aA > 0) {
      const pa = P(t, at('acids') - 0.1, 0.55, pop), pb = P(t, at('alkalis') - 0.15, 0.55, pop);
      op(cardA, clamp(pa * 2)); cardA.setAttribute('transform', `translate(${(-560 * outA).toFixed(1)} ${((1 - clamp(pa)) * 24).toFixed(1)})`);
      op(cardB, clamp(pb * 2)); cardB.setAttribute('transform', `translate(${(560 * outA).toFixed(1)} ${((1 - clamp(pb)) * 24).toFixed(1)})`);
      const row = (el, t0) => { const p = P(t, t0, 0.45, easeOut); op(el, p); el.setAttribute('transform', `translate(${((1 - p) * 18).toFixed(1)} 0)`); };
      row(a1, mid('acids', 0.04)); row(a1b, mid('acids', 0.2));
      const xp = P(t, mid('acids', 0.3), 0.35, pop); op(tgX, clamp(xp * 2)); tr(tgX, 476, 252, Math.max(0.01, xp));
      op(a1c, P(t, mid('acids', 0.33), 0.4, linear));
      row(a2, mid('acids', 0.48));
      tr(stA, 140, lerp(318, 374, P(t, mid('acids', 0.5), 0.4)));
      stA.set(P(t, mid('acids', 0.56), 0.9, easeOut));
      a3.forEach((o, k) => { row(o.g, mid('acids', k ? 0.9 : 0.8)); o.bub.upd(t * calm, P(t, mid('acids', k ? 0.9 : 0.8) + 0.2, 0.4, linear)); });
      row(b1, mid('alkalis', 0.08)); soap.upd(t);
      row(b2, mid('alkalis', 0.4));
      tr(stB, 690, lerp(318, 374, P(t, mid('alkalis', 0.42), 0.4)));
      stB.set(P(t, mid('alkalis', 0.5), 0.9, easeOut));
      const cp = P(t, mid('alkalis', 0.8), 0.5, pop); op(b3, clamp(cp * 2)); tr(b3, 875, 574, Math.max(0.01, 0.8 + 0.2 * cp));
    }

    /* ===== B: corrosive, then irritant ===== */
    const aB = Math.min(P(t, at('corrosive') - 0.1, 0.3, linear), 1 - P(t, at('dilute') - 0.45, 0.3, linear));
    op(B, aB);
    if (aB > 0) {
      const side = P(t, at('irritant') - 0.1, 0.8);
      cor.setAttribute('transform', `translate(${(300 * (1 - side)).toFixed(1)} 0)`);
      const dp = P(t, mid('corrosive', 0.06), 0.6, pop); op(corD, clamp(dp * 2)); tr(corD, 215, 270, Math.max(0.01, 0.5 + 0.5 * dp));
      corD.drip(t - at('corrosive'), P(t, mid('corrosive', 0.32), 2.0, linear));
      const tp = P(t, mid('corrosive', 0.19), 0.5, pop); op(corT, clamp(tp * 2));
      op(corN1, P(t, mid('corrosive', 0.29), 0.4, linear)); op(corN2, P(t, mid('corrosive', 0.5), 0.4, linear));
      const bp = P(t, mid('corrosive', 0.64), 0.55, pop); op(corB, clamp(bp * 2)); tr(corB, 430, 300 + (1 - clamp(bp)) * 26);
      op(corBl, P(t, mid('corrosive', 0.7), 0.4, linear));
      corB.sticker.drip(t, 0);
      const ia = P(t, at('irritant') + 0.2, 0.4, linear);
      op(irr, ia);
      const ip = P(t, mid('irritant', 0.05), 0.6, pop); op(irrD, clamp(ip * 2)); tr(irrD, 815, 270, Math.max(0.01, 0.5 + 0.5 * ip));
      const itp = P(t, mid('irritant', 0.12), 0.5, pop); op(irrT, clamp(itp * 2));
      op(irrN1, P(t, mid('irritant', 0.3), 0.4, linear));
      const ibp = P(t, mid('irritant', 0.6), 0.55, pop); op(irrB, clamp(ibp * 2)); tr(irrB, 1030, 300 + (1 - clamp(ibp)) * 26);
      op(irrBl, P(t, mid('irritant', 0.66), 0.4, linear));
    }

    /* ===== C: dilute, concentrated, a drop of each ===== */
    const aC = Math.min(P(t, at('dilute') - 0.1, 0.3, linear), 1 - P(t, at('grid') - 0.55, 0.35, linear));
    op(Cg, aC);
    if (aC > 0) {
      const sh = P(t, at('danger') - 0.1, 0.7), ns = P(t, at('notsame') - 0.15, 0.7);
      const pos = (x0, x1, x2) => lerp(lerp(x0, x1, sh), x2, ns);
      const s = lerp(lerp(1, 0.75, sh), 0.55, ns);
      [[bk1, 330, 250, 770, at('dilute')], [bk2, 870, 790, 1010, at('conc')]].forEach(([b, x0, x1, x2, t0], k) => {
        const p = P(t, t0 - 0.05, 0.55, pop);
        op(b, clamp(p * 2));
        const x = pos(x0, x1, x2), y = pos(390, 300, 430);
        b.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + (1 - clamp(p)) * 20).toFixed(1)}) scale(${(s * Math.max(0.01, 0.85 + 0.15 * p)).toFixed(4)})`);
        b.pb.set('gas', t * 0.35 * calm + 3, 0);
        b.ps.forEach((el, i) => op(el, P(t, t0 + (k ? 0.5 : 0.9) + i * (k ? 0.035 : 0.22), 0.3, linear)));
        const lab = k ? lab2 : lab1;
        op(lab, P(t, t0 + 0.1, 0.4, linear) * (1 - P(t, at('notsame') - 0.45, 0.3, linear)));
        attr(lab, 'x', x); attr(lab, 'y', y - (BKH / 2) * s - 26);
      });
      op(note1, P(t, mid('dilute', 0.38), 0.4, linear) * (1 - sh)); op(note2, P(t, mid('conc', 0.36), 0.4, linear) * (1 - sh));
      const smallOut = 1 - P(t, at('grid') - 0.5, 0.15, linear);
      op(small1, P(t, at('notsame') + 0.5, 0.4, linear) * smallOut); op(small2, P(t, at('notsame') + 0.6, 0.4, linear) * smallOut);
      // danger
      const dA = win(t, at('danger') - 0.1, at('notsame') - 0.1, 0.35);
      const wp = P(t, mid('danger', 0.24), 0.5, linear) * (1 - P(t, at('notsame') - 0.2, 0.4, linear));
      op(warn, wp * (0.55 + 0.25 * wave(t, 1.4))); tr(warn, 790, 300, 1);
      const hc = P(t, mid('danger', 0.26), 0.5, pop) * (1 - P(t, at('notsame') - 0.2, 0.3, linear)); op(hazChip, clamp(hc * 2)); tr(hazChip, 790, 456, Math.max(0.01, 0.8 + 0.2 * clamp(hc)));
      // a drop is lifted out of each surface on an arc and grows into a magnified view of that one drop
      [0, 1].forEach(k => {
        const x = pos(k ? 870 : 330, k ? 790 : 250, k ? 1010 : 770), y = pos(390, 300, 430);
        const sy = y + (BKH / 2 - (BKH - 18) * (k ? 0.3 : 0.85)) * s;
        const u = (t - DROP_T[k]) / 0.9;
        op(fall[k], u > 0 && u < 1 ? dA * Math.min(1, u * 8) : 0);
        if (u > 0 && u < 1) {
          const q = ease(u), cx = x + 20, cy = sy - 150;
          const fx = (1 - q) * (1 - q) * x + 2 * (1 - q) * q * cx + q * q * DROP_X[k], fy = (1 - q) * (1 - q) * sy + 2 * (1 - q) * q * cy + q * q * DROP_Y;
          tr(fall[k], fx, fy, lerp(1.2, DS, q * q));
        }
        const m = mags[k], mp = P(t, DROP_T[k] + 0.82, 0.25, linear);
        op(m.g, mp * dA); tr(m.g, DROP_X[k], DROP_Y);
        op(m.halo, k ? (0.5 + 0.3 * wave(t, 1.3)) * P(t, DROP_T[k] + 1.1, 0.5, linear) : 0);
        m.ps.forEach((o, i) => { attr(o.el, 'cx', o.x + 3 * Math.sin(t * 1.9 * calm + o.ph)); attr(o.el, 'cy', o.y + 3 * Math.cos(t * 1.6 * calm + o.ph)); op(o.el, P(t, DROP_T[k] + 0.95 + i * 0.06, 0.3, linear)); });
        op(magN[k], P(t, DROP_T[k] + 1.2, 0.4, linear) * dA);
      });
    }

    /* ===== D: strength vs concentration ===== */
    const aD = Math.min(P(t, at('notsame') - 0.1, 0.4, linear), 1 - P(t, at('grid') - 0.55, 0.35, linear));
    op(Dg, aD);
    if (aD > 0) {
      op(headS, P(t, at('notsame') + 0.5, 0.5, easeOut)); op(headC, P(t, at('notsame') + 0.7, 0.5, easeOut));
      const np = P(t, mid('notsame', 0.16), 0.5, pop); op(neq, clamp(np * 2)); tr(neq, 600, 420, Math.max(0.01, np));
      const sp = P(t, mid('notsame', 0.28), 0.5, pop); op(strong, clamp(sp * 2)); op(weak, clamp(P(t, mid('notsame', 0.3), 0.5, pop) * 2));
      updStrong(t * calm); updWeak(t * calm);
      const labOut = 1 - P(t, at('grid') - 0.5, 0.15, linear);
      op(sLab, P(t, mid('notsame', 0.42), 0.4, linear) * labOut); op(wLab, P(t, mid('notsame', 0.5), 0.4, linear) * labOut);
      op(legend, P(t, mid('notsame', 0.36), 0.5, linear));
    }

    /* ===== E: the grid ===== */
    const aE = Math.min(P(t, at('grid') - 0.5, 0.15, linear), 1 - P(t, at('goggles') - 0.6, 0.3, linear));
    op(Eg, aE);
    if (aE > 0) {
      // the notsame labels fly into place as the grid's column and row headers
      HEADS.forEach(o => { const p = P(t, at('grid') - 0.5, 0.9); o.el.setAttribute('transform', `translate(${((1 - p) * o.dx).toFixed(1)} ${((1 - p) * o.dy).toFixed(1)})`); });
      CELLS.forEach((c, k) => {
        const p = P(t, at('grid') + 0.05 + 0.1 * k, 0.5, pop);
        op(c.g, clamp(p * 2)); c.g.setAttribute('transform', `translate(${c.x} ${c.y}) scale(${Math.max(0.01, 0.8 + 0.2 * p).toFixed(4)}) translate(${-c.x} ${-c.y})`);
        c.upd(t * calm);
        const hl = P(t, HIL[k], 0.4, linear), pulse = Math.sin(Math.PI * P(t, HIL[k], 0.8, linear));
        c.frame.setAttribute('stroke', hl > 0 ? mix(C.line, k === 0 ? C.good : '#FF9A55', hl) : C.line);
        attr(c.frame, 'stroke-width', 2.5 + 3.5 * hl + 3 * pulse);
        c.frame.setAttribute('fill', mix(C.card, '#24566B', hl));
      });
      const cp = P(t, mid('grid', 0.72), 0.55, pop); op(safeChip, clamp(cp * 2)); tr(safeChip, GX[0], GYc[0] + 92 - (1 - clamp(cp)) * 40, Math.max(0.01, 0.8 + 0.2 * cp));
    }

    /* ===== F: goggles ===== */
    const aF = P(t, at('goggles') - 0.15, 0.4, linear);
    op(Fg, aF);
    if (aF > 0) {
      op(fHead, P(t, at('goggles'), 0.45, linear));
      const gp = P(t, mid('goggles', 0.06), 0.7, pop); op(gog, clamp(gp * 3)); tr(gog, 470, lerp(220, 430, clamp(gp)) + (gp > 1 ? (gp - 1) * 30 : 0), 0.9, -4 * (1 - clamp(gp)));
      const bp = P(t, mid('goggles', 0.44), 0.55, pop); op(fBot, clamp(bp * 2)); tr(fBot, 860, 420 + (1 - clamp(bp)) * 24, 1.3);
      fBot.sticker.drip(t, 0.8);
      const sp = Math.sin(Math.PI * P(t, mid('goggles', 0.8), 0.8, linear)); tr(fBot.sticker, 0, 28, 1 + 0.2 * sp);
      op(fBl, P(t, mid('goggles', 0.5), 0.4, linear));
      op(fNote, P(t, mid('goggles', 0.62), 0.5, linear));
    }
  };
});

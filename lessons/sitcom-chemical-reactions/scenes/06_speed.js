/* Scene 6: The speed round.
   A  kitchen: ROUND 6: SPEED; explosion "0.01 s" vs rusty gate "years"; Ferris sighs
   B  Arrow: RATE = how fast reactants turn into products; particles collide (flash = enough energy, ring = bounce off)
   C  temperature up: thermometer rises, particles speed up, collision counter races; "more often", "harder"
   D  concentration: dilute vs crowded box -> the crowded box becomes an MRT carriage (Olly: "rush hour!")
   E  surface area: a lump vs the same lump smashed into powder; far more hits
   F  "And finally... a catalyst": the spotlight finds Kat asleep. DUN DUN DUNNN
   G  Arrow introduces Kat (she opens ONE eye); lower third KAT
   H  energy hill on the board: an easier route; Kat walks off, completely unchanged
   I  Olly's giant tower of plates -> "No. Same products. Same amount. Just faster."
   J  enzymes: amylase snips a starch chain into sugars
   K  Kavya, chewing bread for three minutes
   L  catalytic converter: Monty goes in, carbon dioxide comes out (2CO + O2 -> 2CO2)
   M  Monty's confessional, now with an extra O: "so... boring." */
scene('speed', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers ---------- */
  const cam = (k, fx, fy) => `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`;
  const M = []; let seen = new Set();
  const reg = el => { M.push(el); return el; };
  const show = (el, o) => { seen.add(el); op(el, o === undefined ? 1 : o); };
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.4, pop); show(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const lbl = (parent, text, o) => { o = o || {}; return reg(chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 3, color: o.color || C.ink, weight: 700 })); };
  const title = (parent, text, col) => lbl(parent, text, { size: 40, color: col || C.energy, stroke: col || C.energy, sw: 4, fill: 'rgba(16,10,32,0.94)' });
  const STAR = (() => { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, rr = i % 2 ? 11 : 26; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); } return d + 'Z'; })();
  const bounce = (u, a, b) => { const L = b - a, m = ((u - a) % (2 * L) + 2 * L) % (2 * L); return a + (m < L ? m : 2 * L - m); };
  // distance travelled (px) by a particle whose "energy" ramps s0 -> s1 over [a, a + d], from t0 to t
  const rint = (x, a, d) => (x < a ? 0 : x < a + d ? (x - a) * (x - a) / (2 * d) : d / 2 + (x - a - d));
  const travel = (t, t0, a, d, s0, s1) => { const dt = Math.max(0, t - t0); return 60 * dt + 220 * (s0 * dt + (s1 - s0) * (rint(Math.max(t, t0), a, d) - rint(t0, a, d))); };
  // a box of reacting particles (two kinds), with collision flashes: star = enough energy, ring = bounce off
  function speedBox(parent, w, h, n, seed, r) {
    const g = G(parent), rr = rng(seed), ps = [], fl = [];
    g.frame = E('rect', { x: -8, y: -8, width: w + 16, height: h + 16, rx: 14, fill: 'rgba(12,20,40,0.85)', stroke: '#CFE7F5', 'stroke-width': 4 }, g);
    const eyes = `M${(-r * 0.3).toFixed(1)},${(-r * 0.15).toFixed(1)} h0.1 M${(r * 0.3).toFixed(1)},${(-r * 0.15).toFixed(1)} h0.1`;
    for (let i = 0; i < n; i++) {
      const col = i % 2 ? ['#7CC4FF', '#1D5FA6'] : ['#FF9A6C', '#B5452A'];
      const c = E('circle', { r, fill: ball(col[0], col[1]), stroke: SC_INK, 'stroke-width': 2 }, g);
      const ey = E('path', { d: eyes, stroke: SC_INK, 'stroke-width': r * 0.3, 'stroke-linecap': 'round' }, g);
      const a = rr() * TAU;
      ps.push({ c, ey, x0: r + rr() * (w - 2 * r), y0: r + rr() * (h - 2 * r), vx: Math.cos(a), vy: Math.sin(a), sp: 0.75 + rr() * 0.5 });
    }
    for (let i = 0; i < 4; i++) fl.push({ star: E('path', { d: STAR, fill: C.energy, stroke: '#FFF7C2', 'stroke-width': 2 }, g), ring: E('circle', { r: r * 1.15, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, g) });
    g.set = (ph, e, na) => {
      na = na || n;
      const pos = ps.map(p => [bounce(p.x0 + p.vx * p.sp * ph, r, w - r), bounce(p.y0 + p.vy * p.sp * ph, r, h - r)]);
      pos.forEach((q, i) => { const on = i < na ? 1 : 0; op(ps[i].c, on); op(ps[i].ey, on); if (on) { tr(ps[i].c, q[0], q[1]); tr(ps[i].ey, q[0], q[1]); } });
      let k = 0;
      for (let i = 0; i < na && k < fl.length; i++) for (let j = i + 1; j < na && k < fl.length; j++) {
        const dx = pos[i][0] - pos[j][0], dy = pos[i][1] - pos[j][1];
        if (dx * dx + dy * dy < 4 * r * r * 0.95) {
          const f = fl[k++], hard = ((i * 7 + j * 13) % 10) / 10 < 0.25 + 0.6 * e, x = (pos[i][0] + pos[j][0]) / 2, y = (pos[i][1] + pos[j][1]) / 2;
          op(f.star, hard ? 1 : 0); op(f.ring, hard ? 0 : 1);
          tr(f.star, x, y, 0.8 + 0.7 * e); tr(f.ring, x, y);
        }
      }
      for (; k < fl.length; k++) { op(fl[k].star, 0); op(fl[k].ring, 0); }
    };
    return g;
  }
  function watch(parent, r) {
    const g = G(parent);
    E('rect', { x: -10, y: -r - 14, width: 20, height: 14, rx: 4, fill: '#5A6672' }, g);
    E('circle', { r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
    g.hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.75, stroke: '#E8424F', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 4, fill: SC_INK }, g);
    return g;
  }
  function cube(parent, s, col, dk) {
    const g = G(parent), d = s * 0.38;
    E('path', { d: `M0,0 L${s},0 L${s},${s} L0,${s} Z`, fill: col, stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: `M0,0 L${d},${-d} L${s + d},${-d} L${s},0 Z`, fill: '#F7F3E8', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: `M${s},0 L${s + d},${-d} L${s + d},${s - d} L${s},${s} Z`, fill: dk, stroke: SC_INK, 'stroke-width': 3 }, g);
    g.glow = E('path', { d: `M0,${s} L0,0 L${d},${-d} L${s + d},${-d} L${s + d},${s - d} L${s},${s} Z`, fill: 'none', stroke: C.energy, 'stroke-width': 7, 'stroke-linejoin': 'round', opacity: 0.7 }, g);
    g.insertBefore(g.glow, g.firstChild);
    return g;
  }
  function plateStack(parent, n) {
    const g = G(parent), pl = [];
    for (let i = 0; i < n; i++) { const p = E('ellipse', { cy: 0, rx: 54, ry: 11, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g); tr(p, 0, -i * 15); pl.push(p); }
    g.pl = pl;
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root);
  const Wbg = G(world), Wcast = G(world), Wfront = G(world), Wprops = G(world);
  const Lfg = G(root), Lhud = G(root);

  /* ---------- sets ---------- */
  const kitchen = reg(tkKitchen(Wbg));
  const diagBg = reg(G(Wbg));
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: linGrad('#0E1830', '#1C2A4A', true) }, diagBg);
  E('ellipse', { cx: 600, cy: 420, rx: 560, ry: 270, fill: glow('#3F6FD0'), opacity: 0.4 }, diagBg);
  const lab = reg(tkLab(Wbg));
  const road = reg(G(Wbg));
  E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: linGrad('#7FCBFF', '#D9F0FF', true) }, road);
  E('rect', { x: -100, y: 540, width: 1400, height: 400, fill: '#4A525C' }, road);
  E('path', { d: 'M0,640 L1200,640', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-dasharray': '60 50', opacity: 0.7 }, road);
  E('path', { d: 'M80,540 L80,470 L140,470 L140,500 L200,500 L200,450 L260,450 L260,540 Z M960,540 L960,430 L1040,430 L1040,540 Z M1080,540 L1080,480 L1140,480 L1140,540 Z', fill: '#B9D6EA' }, road);
  const confM = reg(tkConf(Wbg, 'monty'));
  const dim = reg(E('rect', { x: -100, y: -100, width: 1400, height: 950, fill: '#05030C' }, Wbg));
  const counter = reg(tkCounter(Wfront));
  const bench = reg(G(Wfront));
  E('rect', { x: -100, y: 560, width: 1400, height: 26, fill: '#2B2F36' }, bench);
  E('rect', { x: -100, y: 586, width: 1400, height: 300, fill: '#8A6A48' }, bench);
  const spot = reg(E('path', { d: 'M-50,-560 L50,-560 L200,0 L-200,0 Z', fill: glow('#FFF4C2') }, Wfront));

  /* ---------- the cast ---------- */
  const ch = {};
  ['kat', 'olly', 'ferris', 'arrow', 'kavya', 'monty'].forEach(k => { ch[k] = reg(cast(Wcast, k)); });
  // Kat: one eye shut (for "opens ONE eye")
  const katLid = G(ch.kat.firstChild);
  E('ellipse', { cx: -25, cy: -44, rx: 17.5, ry: 19.5, fill: '#D9E0E7', stroke: SC_INK, 'stroke-width': 3 }, katLid);
  E('path', { d: 'M-38,-42 Q-25,-34 -12,-42', fill: 'none', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, katLid);
  // Monty's extra oxygen (he becomes carbon dioxide)
  const mIn = ch.monty.firstChild, extraO = G(mIn);
  tr(extraO, -150, 10);
  E('circle', { r: 56, fill: ball(C.oxygen, C.oxygenDk), stroke: SC_INK, 'stroke-width': 5 }, extraO);
  T(extraO, -10, 12, 'O', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
  mIn.insertBefore(extraO, mIn.firstChild);
  const ltKat = scLowerThird(Lhud, 'KAT', 'Catalyst. Never used up.');

  /* ===== A: round card ===== */
  const roundCard = reg(G(Lfg));
  E('rect', { x: -260, y: -54, width: 520, height: 108, rx: 24, fill: 'rgba(16,10,32,0.94)', stroke: '#FF6FB5', 'stroke-width': 5 }, roundCard);
  T(roundCard, 40, 17, 'ROUND 6: SPEED', { size: 48, weight: 800, anchor: 'middle', fill: '#FFF1F8', ls: 1 });
  const rW = watch(roundCard, 30); tr(rW, -196, 4);
  const panL = reg(G(Lfg)), panR = reg(G(Lfg));
  [panL, panR].forEach(p => card(p, -150, -95, 300, 190, { fill: 'rgba(16,10,32,0.92)', stroke: C.line, sw: 3 }));
  const boom = G(panL); tr(boom, 0, -20);
  let bd = ''; for (let i = 0; i < 20; i++) { const a = i * Math.PI / 10, rr = i % 2 ? 30 : 62; bd += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr * 0.75).toFixed(1); }
  E('path', { d: bd + 'Z', fill: '#FF8A3D', stroke: '#FFE45C', 'stroke-width': 4 }, boom);
  T(boom, 0, 10, 'BANG!', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(panL, 0, 76, 'explosion: 0.01 s', { size: 28, weight: 800, anchor: 'middle', fill: C.energy });
  const gate = G(panR); tr(gate, 0, -24);
  E('path', { d: 'M-80,50 L-80,-50 M80,50 L80,-50 M-80,-40 L80,-40 M-80,40 L80,40 M-50,-40 L-50,40 M-20,-40 L-20,40 M10,-40 L10,40 M40,-40 L40,40', stroke: '#8C97A3', 'stroke-width': 8, 'stroke-linecap': 'round' }, gate);
  [[-50, -10], [10, 20], [40, -30], [-80, 30], [80, -20], [-20, 36]].forEach(([x, y], i) => E('ellipse', { cx: x, cy: y, rx: 10 + (i % 2) * 5, ry: 8, fill: '#C9692A' }, gate));
  T(panR, 0, 76, 'rusting: years', { size: 28, weight: 800, anchor: 'middle', fill: '#FF9A50' });
  const sigh = lbl(Lfg, '*sigh*', { size: 28, color: C.muted });

  /* ===== B: rate ===== */
  const rateT = lbl(Lfg, 'RATE = how fast reactants turn into products', { size: 34, color: C.energy, stroke: C.energy, sw: 4, fill: 'rgba(16,10,32,0.94)' });
    const bCol = lbl(Lfg, 'must COLLIDE', { size: 28, color: '#FFFFFF' });
  const bEn = lbl(Lfg, '...with enough ENERGY', { size: 28, color: C.energy, stroke: C.energy });

  /* ===== C: temperature ===== */
  const tempT = title(Lfg, 'TEMPERATURE ↑', '#FF8A5C');
  const thermo = reg(G(Lfg)); const th = thermometer(thermo, 300, C.bad); tr(thermo, 160, 560);
    const cnt = reg(G(Lfg));
  card(cnt, -130, -80, 260, 150, { fill: 'rgba(16,10,32,0.92)', stroke: C.line });
  T(cnt, 0, -38, 'collisions', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const cntN = T(cnt, 0, 40, '0', { size: 64, weight: 800, anchor: 'middle', fill: C.energy });
  const cOften = lbl(Lfg, 'more often', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' });
  const cHard = lbl(Lfg, 'and HARDER', { size: 32, color: C.energy, stroke: C.energy });

  /* ===== D: concentration, MRT ===== */
  const concT = title(Lfg, 'CONCENTRATION ↑', '#7CC4FF');
  const boxD1 = reg(speedBox(Lfg, 480, 280, 4, 11, 22)); tr(boxD1, 110, 270, 0.84);
  const boxM = reg(speedBox(Lfg, 480, 280, 18, 13, 22));
  const dLab1 = lbl(Lfg, 'dilute', { size: 30 }), dLab2 = lbl(Lfg, 'concentrated', { size: 30 });
  const dHit1 = T(Lfg, 310, 236, '', { size: 28, weight: 800, anchor: 'middle', fill: C.energy }); reg(dHit1);
  const dHit2 = T(Lfg, 890, 236, '', { size: 28, weight: 800, anchor: 'middle', fill: C.energy }); reg(dHit2);
  const dRule = lbl(Lfg, 'more concentrated = more collisions', { size: 32, color: C.energy, stroke: C.energy, sw: 4 });
  const mrt = reg(G(Lfg));   // the carriage drawn around the crowded box (box at 690..1090, 255..525)
  E('path', { d: 'M650,230 L1150,230 L1150,560 L650,560 Z', fill: 'none', stroke: '#E9EEF2', 'stroke-width': 16, 'stroke-linejoin': 'round' }, mrt);
  E('rect', { x: 650, y: 520, width: 500, height: 16, fill: '#E8424F' }, mrt);
  [690, 1070].forEach(x => E('rect', { x: x - 26, y: 236, width: 52, height: 300, fill: 'none', stroke: '#9FB0BF', 'stroke-width': 5 }, mrt));
  [720, 840, 960, 1080].forEach(x => E('circle', { cx: x, cy: 578, r: 18, fill: '#2B2F36', stroke: '#9FB0BF', 'stroke-width': 4 }, mrt));
  const doors = lbl(Lfg, 'DOORS CLOSING', { size: 28, color: '#FFFFFF', fill: '#C62828', stroke: '#FFFFFF' });

  /* ===== E: surface area ===== */
  const surfT = title(Lfg, 'SURFACE AREA ↑', '#56D69B');
  const surf = reg(G(Lfg));
  const lumpL = cube(surf, 160, '#E9E2D0', '#B9AF97'); tr(lumpL, 250, 340);
  const lumpR = cube(surf, 160, '#E9E2D0', '#B9AF97');
  const PIECES = [[760, 470], [830, 470], [900, 470], [970, 470], [795, 410], [935, 410]];
  const pieces = PIECES.map(() => cube(surf, 46, '#E9E2D0', '#B9AF97'));
  const hammer = G(surf);
  E('rect', { x: -10, y: -10, width: 20, height: 170, rx: 8, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, hammer);
  E('rect', { x: -50, y: -46, width: 100, height: 52, rx: 10, fill: '#7D8C99', stroke: SC_INK, 'stroke-width': 4 }, hammer);
  const smash = T(surf, 870, 300, 'CRUSH!', { size: 40, weight: 800, anchor: 'middle', fill: C.energy });
  const acid = [], hitsF = [];
  for (let i = 0; i < 10; i++) acid.push(E('circle', { r: 8, fill: '#7CC4FF', stroke: '#1D5FA6', 'stroke-width': 2 }, surf));
  for (let i = 0; i < 10; i++) hitsF.push(E('path', { d: STAR, fill: C.energy, transform: 'scale(0.6)' }, surf));
  const sLab1 = lbl(Lfg, 'lump', { size: 30 }), sLab2 = lbl(Lfg, 'powder', { size: 30 });
  const sHit1 = T(Lfg, 330, 250, '', { size: 28, weight: 800, anchor: 'middle', fill: C.energy }); reg(sHit1);
  const sHit2 = T(Lfg, 870, 250, '', { size: 28, weight: 800, anchor: 'middle', fill: C.energy }); reg(sHit2);
  const sRule = lbl(Lfg, 'more surface area = more collisions', { size: 32, color: C.energy, stroke: C.energy, sw: 4 });

  /* ===== F/G: catalyst ===== */
  const catT = reg(T(Lfg, 600, 250, 'CATALYST', { size: 84, weight: 800, anchor: 'middle', fill: '#FFE07A', ls: 10 }));
  catT.setAttribute('stroke', '#7A5A10'); catT.setAttribute('stroke-width', 8); catT.setAttribute('paint-order', 'stroke');
  const dun = lbl(Lfg, 'DUN DUN DUNNN', { size: 28, color: C.muted });
  const gTitle = title(Lfg, 'CATALYST', '#FFE07A');
  const gUp = lbl(Lfg, 'speeds up a reaction', { size: 32, color: '#FFFFFF', stroke: '#FFFFFF' });
  const gUsed = lbl(Lfg, 'NOT used up ✓', { size: 32, color: C.good, stroke: C.good });

  /* ===== H: energy hill ===== */
  const boardH = reg(tkBoard(Wprops, 760, 300, ''));
  tr(boardH, 470, 320);
  const hill = G(boardH);   // board coords: centre (470,320) -> local = world - (470,320)
  const X0 = 290 - 470, X1 = 670 - 470;
  const yAt = (x, H) => { const s = clamp((x - X0) / (X1 - X0)); return lerp(360, 400, s) - 320 - H * Math.pow(Math.sin(Math.PI * s), 2); };
  const curve = H => { const pts = [[160 - 470, 40]]; for (let x = X0; x <= X1 + 0.1; x += 10) pts.push([x, yAt(x, H)]); pts.push([830 - 470, 80]); return openPath(pts); };
  E('path', { d: 'M-340,110 L-340,-120 M-340,110 L370,110', stroke: '#E9EEF2', 'stroke-width': 4, opacity: 0.8 }, hill);
  const yl = T(hill, -362, -10, 'energy', { size: 26, weight: 700, anchor: 'middle', fill: C.muted }); yl.setAttribute('transform', 'rotate(-90 -362 -10)');
  T(hill, 20, 140, 'progress of the reaction →', { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
  E('path', { d: curve(190), fill: 'none', stroke: C.bad, 'stroke-width': 6, 'stroke-linejoin': 'round' }, hill);
  const lowP = E('path', { d: curve(80), fill: 'none', stroke: C.good, 'stroke-width': 6, 'stroke-dasharray': '16 10', 'stroke-linejoin': 'round' }, hill);
  T(hill, -255, 80, 'reactants', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(hill, 280, 64, 'products', { size: 26, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(hill, 150, -112, 'without catalyst', { size: 26, weight: 800, anchor: 'start', fill: C.bad });
  const hWith = T(hill, 10, 42, 'with catalyst:\nan easier route', { size: 26, weight: 800, anchor: 'middle', fill: C.good, lh: 28 });
  const ballG = E('circle', { r: 14, fill: ball('#7CF0B0', '#1E8A52'), stroke: SC_INK, 'stroke-width': 2 }, hill);
  const ballR = E('circle', { r: 14, fill: ball('#FF9A9A', '#B5372D'), stroke: SC_INK, 'stroke-width': 2 }, hill);
  const hUnch = lbl(Lfg, 'completely unchanged ✓', { size: 30, color: C.good, stroke: C.good });

  /* ===== I: plates ===== */
  const tower = reg(plateStack(Wprops, 22));
  const stackR = reg(plateStack(Wprops, 6));
  const wL = reg(watch(Wprops, 32)), wR = reg(watch(Wprops, 32));
  const iSlow = lbl(Wprops, 'slow', { size: 28, color: C.muted }), iFast = lbl(Wprops, 'FAST', { size: 28, color: C.energy, stroke: C.energy });
  const iNo = lbl(Wprops, 'no catalyst', { size: 26 }), iCat = lbl(Wprops, 'catalyst', { size: 26, color: '#FFE07A' });
  const iSameP = lbl(Lfg, 'same products', { size: 34, color: '#FFFFFF', stroke: '#FFFFFF' });
  const iSameA = lbl(Lfg, 'same amount', { size: 34, color: '#FFFFFF', stroke: '#FFFFFF' });
  const iFaster = lbl(Lfg, 'just FASTER', { size: 34, color: C.energy, stroke: C.energy, sw: 4 });
  const iMore = lbl(Lfg, 'MORE food?', { size: 32, color: '#FFB3A8', stroke: C.oxygen });

  /* ===== J: enzymes ===== */
  const enzT = lbl(Lfg, 'ENZYMES = biological catalysts', { size: 38, color: '#7CF0B0', stroke: '#56D69B', sw: 4, fill: 'rgba(16,10,32,0.94)' });
  const enz = reg(G(Lfg));
  const GX = [], gls = [];
  for (let i = 0; i < 6; i++) GX.push(300 + i * 110);
  const bonds = [];
  for (let i = 0; i < 5; i++) bonds.push(E('line', { x1: GX[i] + 26, y1: 400, x2: GX[i + 1] - 26, y2: 400, stroke: C.glucoseLt, 'stroke-width': 6, 'stroke-linecap': 'round' }, enz));
  for (let i = 0; i < 6; i++) { const g = molGlucose(enz, 30); gls.push(g); }
  const jStarch = T(enz, 576, 490, 'starch', { size: 32, weight: 800, anchor: 'middle', fill: C.glucoseLt });
  const jSug = T(enz, 576, 520, 'sugars', { size: 32, weight: 800, anchor: 'middle', fill: C.energy });
  const jSparks = [0, 1, 2].map(() => spark(enz, 12));
  const pac = G(enz), pacBody = E('path', { d: '', fill: ball('#7CF0B0', '#22844A'), stroke: SC_INK, 'stroke-width': 4 }, pac);
  E('circle', { cx: 6, cy: -24, r: 6, fill: SC_INK }, pac);
  const pacL = T(enz, 0, 0, 'amylase (in saliva)', { size: 28, weight: 800, anchor: 'middle', fill: '#7CF0B0' });
  const SNIP = [1, 3];   // bonds cut -> three pairs (maltose, a sugar)

  /* ===== K: bread ===== */
  const bread = reg(G(Wfront));
  E('ellipse', { cx: 0, cy: 6, rx: 110, ry: 18, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bread);
  E('path', { d: 'M-70,0 L-70,-80 Q-90,-120 -50,-140 Q0,-160 50,-140 Q90,-120 70,-80 L70,-24 A26,26 0 0,0 44,-8 A20,20 0 0,0 26,0 Z', fill: '#E9B872', stroke: '#8A5A23', 'stroke-width': 6, 'stroke-linejoin': 'round' }, bread);
  E('path', { d: 'M-56,-6 L-56,-80 Q-72,-112 -42,-126 Q0,-142 42,-126 Q72,-112 56,-80 L56,-30', fill: 'none', stroke: '#FFF0C9', 'stroke-width': 8, opacity: 0.6 }, bread);
  const kTimer = reg(G(Lfg));
  card(kTimer, -150, -46, 300, 92, { fill: 'rgba(16,10,32,0.92)', stroke: C.line });
  const kW = watch(kTimer, 26); tr(kW, -100, 4);
  const kTxt = T(kTimer, 30, 18, '3:00', { size: 50, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const kSweet = lbl(Lfg, 'sweeter!', { size: 30, color: C.energy, stroke: C.energy });
  const kWhy = lbl(Lfg, 'amylase: starch → sugar', { size: 30, color: '#7CF0B0', stroke: '#56D69B' });
  const kSp = [0, 1, 2].map(() => reg(spark(Lfg, 12)));

  /* ===== L: catalytic converter ===== */
  const carT = title(Lfg, 'CATALYTIC CONVERTER', '#FFE07A');
  const car = reg(G(Lfg));
  E('path', { d: 'M40,470 L40,390 Q46,360 90,352 L150,300 Q166,288 190,288 L300,288 Q326,288 342,306 L384,352 Q420,358 420,392 L420,470 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, car);
  E('path', { d: 'M168,348 L198,306 L250,306 L250,348 Z M266,348 L266,306 L318,306 L352,348 Z', fill: '#BFE3FF', stroke: SC_INK, 'stroke-width': 4 }, car);
  [120, 340].forEach(x => { E('circle', { cx: x, cy: 476, r: 40, fill: '#2B2F36', stroke: SC_INK, 'stroke-width': 4 }, car); E('circle', { cx: x, cy: 476, r: 16, fill: '#9FB0BF' }, car); });
  const pipe = reg(G(Lfg));
  E('rect', { x: 400, y: 432, width: 820, height: 40, rx: 8, fill: linGrad('#C9D3DC', '#6E7A86', true), stroke: SC_INK, 'stroke-width': 4 }, pipe);
  const conv = G(pipe);
  E('rect', { x: 540, y: 378, width: 240, height: 150, rx: 26, fill: linGrad('#D3DAE1', '#7C8792', true), stroke: SC_INK, 'stroke-width': 5 }, conv);
  let hc = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = 574 + c * 34 + (r % 2) * 17, y = 404 + r * 30; hc += `M${x - 13},${y} l6.5,-11 h13 l6.5,11 l-6.5,11 h-13 Z `; }
  E('path', { d: hc, fill: '#5A6672', stroke: '#C9D3DC', 'stroke-width': 2 }, conv);
  const ptTag = G(conv); tr(ptTag, 760, 384);
  E('circle', { r: 26, fill: ball('#FFE07A', '#C9A227'), stroke: SC_INK, 'stroke-width': 3 }, ptTag);
  T(ptTag, 0, 10, 'Pt', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const lPt = lbl(Lfg, 'platinum (a catalyst)', { size: 28, color: '#FFE07A', stroke: '#C9A227' });
  const lCO = lbl(Lfg, 'carbon monoxide', { size: 28, color: '#FFFFFF', stroke: C.bad });
  const lO = reg(atom(Lfg, 'O', 22, { letter: true }));
  const co2 = reg(molCO2(Lfg, 24, { letter: true }));
  const lCO2 = lbl(Lfg, 'carbon dioxide', { size: 28, color: C.co2, stroke: C.co2 });
  const lEq = reg(G(Lfg));
  card(lEq, -230, -44, 460, 88, { fill: 'rgba(16,10,32,0.94)', stroke: C.energy, sw: 4, rx: 44 });
  tkFormula(lEq, 0, 16, '2CO + O2 -> 2CO2', { size: 46 });

  /* ===== M: boring ===== */
  const mCard = reg(G(Lfg));
  card(mCard, -150, -90, 300, 180, { fill: 'rgba(16,10,32,0.9)', stroke: C.co2, sw: 4 });
  tkFormula(mCard, 0, 20, 'CO2', { size: 80, fill: C.co2 });
  T(mCard, 0, 70, 'carbon dioxide', { size: 28, weight: 700, anchor: 'middle', fill: C.muted });
  const mStamp = reg(tkStamp(Lfg, 'BORING', '#9FB0BF'));

  /* cut points */
  const cB = at('rate') - 0.06, cC = at('temp') - 0.06, cD = at('conc') - 0.06, cE = at('surface') - 0.06, cF = at('cat') - 0.06,
    cG = at('kat') - 0.06, cH = at('route') - 0.06, cI = at('more') - 0.06, cJ = at('enzymes') - 0.06, cK = at('bread') - 0.06,
    cL = at('car') - 0.06, cM = at('boring') - 0.06;

  return t => {
    seen = new Set();
    const put = (k, x, y, s, st, r) => { const c = ch[k]; seen.add(c); op(c, st.op === undefined ? 1 : st.op); tr(c, x, y, s, r); c.set(Object.assign({ t, talk: scTalk(S, t, k) }, st)); };
    const kat = (x, y, s) => put('kat', x, y, s || 0.42, { mood: 'deadpan', still: true });
    const kit = t < cC || (t >= cF && t < cJ);
    if (kit) { show(kitchen); kitchen.upd(t); show(counter); op(kitchen.sign, 0); }
    op(katLid, 0);
    let wcam = cam(1, 600, 375);

    /* ---------- A ---------- */
    if (t < cB) {
      wcam = cam(1 + 0.025 * P(t, 0, cB, linear), 600, 430);
      kat(150, 549);
      const sg = t > mid('round', 0.78);
      put('ferris', 600, 482, 0.75, { copper: 1, rust: 0.82, look: sg ? 0.6 : 0, mood: 'sad' });
      popIn(roundCard, t, at('round') + 0.1, 600, 172);
      tr(rW.hand, 0, 0, 1, (t * 300 * AMP) % 360);
      popIn(panL, t, mid('round', 0.3), 330, 330);
      tr(boom, 0, -20, 1 + 0.08 * Math.sin(t * 20) * AMP);
      popIn(panR, t, mid('round', 0.62), 870, 330);
      popIn(sigh, t, mid('round', 0.85), 600, 360);
    }

    /* ---------- B: rate ---------- */
    if (t >= cB && t < cC) {
      kat(1135, 549);
      put('arrow', 260, 455, 0.9, { look: 0.8 });
      popIn(rateT, t, at('rate') + 0.1, 600, 165);
      show(boxM, P(t, mid('rate', 0.35), 0.3, linear)); tr(boxM, 570, 255);
      boxM.set(travel(t, at('rate'), 0, 1, 0.45, 0.45), 0.45, 12);
      popIn(bCol, t, mid('rate', 0.62), 700, 600);
      popIn(bEn, t, mid('rate', 0.82), 960, 600);
    }

    /* ---------- C: temperature ---------- */
    if (t >= cC && t < cD) {
      show(diagBg);
      popIn(tempT, t, at('temp') + 0.05, 600, 160);
      const a = mid('temp', 0.12), d = mid('temp', 0.45) - a, e = 0.3 + 0.7 * P(t, a, d, linear);
      show(thermo); th.set(0.15 + 0.8 * P(t, a, d, ease));
      show(boxM); tr(boxM, 300, 236, 1.1);
      const ph = travel(t, cC, a, d, 0.3, 1);
      boxM.set(ph, e, 14);
      popIn(cnt, t, at('temp') + 0.3, 1040, 330);
      setText(cntN, String(Math.floor(ph * e * 0.04)));
      popIn(cOften, t, mid('temp', 0.6), 1040, 470);
      popIn(cHard, t, mid('temp', 0.8), 1040, 540);
    }

    /* ---------- D: concentration, MRT ---------- */
    if (t >= cD && t < cE) {
      show(diagBg);
      const ph = travel(t, cD, 0, 1, 0.5, 0.5);
      const isM = t >= at('mrt') - 0.06;
      if (!isM) {
        popIn(concT, t, at('conc') + 0.05, 600, 160);
        show(boxD1, P(t, mid('conc', 0.15), 0.3, linear)); boxD1.set(ph, 0.5);
        popIn(dLab1, t, mid('conc', 0.15), 310, 565);
        show(dHit1, P(t, mid('conc', 0.4), 0.3, linear)); setText(dHit1, 'hits: ' + Math.floor(ph * 0.0012 * 4 * 3));
        show(dHit2, P(t, mid('conc', 0.4), 0.3, linear)); setText(dHit2, 'hits: ' + Math.floor(ph * 0.0012 * 18 * 17));
        popIn(dRule, t, mid('conc', 0.72), 600, 620);
      }
      show(boxM, P(t, mid('conc', 0.3), 0.3, linear)); boxM.set(ph, 0.5, 18);
      if (!isM) popIn(dLab2, t, mid('conc', 0.3), 890, 565);
      if (isM) {
        const jig = t > end('mrt') ? Math.sin(t * 40) * 3 * AMP : 0;
        show(mrt); tr(mrt, jig, 0); tr(boxM, 690 + jig, 270, 0.84);
        put('olly', 300, 400, 1, { look: 0.8, sparkle: 1, mood: 'happy' });
        popIn(doors, t, end('mrt') + 0.05, 900, 200);
        if (t > end('mrt') + 0.05) op(doors, Math.sin(t * 14) > -0.3 ? 1 : 0.25);
      } else tr(boxM, 690, 270, 0.84);
    }

    /* ---------- E: surface area ---------- */
    if (t >= cE && t < cF) {
      show(diagBg);
      popIn(surfT, t, at('surface') + 0.05, 600, 160);
      show(surf);
      const sm = mid('surface', 0.36), crushed = t > sm + 0.25;
      const hp = P(t, sm, 0.25, easeIn);
      op(hammer, t > sm - 0.3 && t < sm + 0.6 ? 1 : 0); tr(hammer, 990, 300 - 40 * (1 - hp), 1, lerp(70, 10, hp) - 40);
      op(smash, win(t, sm + 0.2, sm + 1.0, 0.1));
      op(lumpR, crushed ? 0 : 1); tr(lumpR, 790, 340);
      const ep = P(t, sm + 0.22, 0.5, easeOut);
      pieces.forEach((pc, i) => { op(pc, crushed ? 1 : 0); tr(pc, lerp(870, PIECES[i][0], ep) - 23, lerp(420, PIECES[i][1], ep) - 23); });
      const gl = 0.45 + 0.4 * Math.sin(t * 5);
      [lumpL, lumpR, ...pieces].forEach(c => op(c.glow, gl));
      // acid particles rain down and hit the solid
      const go = t > mid('surface', 0.15);
      acid.forEach((a, i) => {
        const left = i < 5, k = i % 5, x = left ? 272 + k * 32 : 762 + k * 52;
        const yHit = left ? 300 : crushed ? [430, 372, 450, 372, 430][k] : (x < 790 ? 1000 : 300);
        const ph = ((t * 0.9 + k * 0.137 + (left ? 0 : 0.05)) % 1);
        const y = 230 + ph * 420;
        const hit = y >= yHit;
        op(a, go && !hit && y < 640 ? 1 : 0); attr(a, 'cx', x); attr(a, 'cy', Math.min(y, 640));
        const f = hitsF[i], fp = hit ? (y - yHit) / 60 : 1;
        op(f, go && hit && fp < 1 ? 1 - fp : 0); f.setAttribute('transform', `translate(${x} ${yHit}) scale(${(0.4 + 0.5 * fp).toFixed(2)})`);
      });
      popIn(sLab1, t, mid('surface', 0.1), 330, 570);
      popIn(sLab2, t, mid('surface', 0.5), 870, 570);
      const hl = Math.floor(Math.max(0, t - mid('surface', 0.15)) * 3.5), hr = Math.floor(Math.max(0, t - mid('surface', 0.15)) * 3.5 + Math.max(0, t - sm - 0.4) * 10);
      show(sHit1, P(t, mid('surface', 0.5), 0.3, linear)); setText(sHit1, 'hits: ' + hl);
      show(sHit2, P(t, mid('surface', 0.5), 0.3, linear)); setText(sHit2, 'hits: ' + hr);
      popIn(sRule, t, mid('surface', 0.76), 600, 625);
    }

    /* ---------- F: and finally... a catalyst ---------- */
    if (t >= cF && t < cG) {
      const zp = P(t, mid('cat', 0.5), cG - mid('cat', 0.5), ease);
      wcam = cam(1 + 0.3 * zp, 600, 500);
      show(dim, 0.7);
      kat(600, 549, 0.5);
      const sx = lerp(180, 600, P(t, at('cat'), 1.1, ease)) + 30 * Math.sin(t * 3) * (1 - P(t, at('cat'), 1.1, linear));
      show(spot, 0.95); tr(spot, sx, 590);
      const cp = P(t, mid('cat', 0.7), 0.5, pop);
      show(catT, clamp(cp * 2.5)); tr(catT, 0, 0, 1); catT.setAttribute('transform', `translate(600 250) scale(${Math.max(0.01, 0.6 + 0.4 * cp).toFixed(3)}) translate(-600 -250)`);
      popIn(dun, t, end('cat') + 0.05, 600, 330);
    }

    /* ---------- G: this is Kat ---------- */
    if (t >= cG && t < cH) {
      wcam = cam(1 + 0.04 * P(t, cG, cH - cG, linear), 600, 450);
      const oneEye = t > mid('kat', 0.12) && t < mid('kat', 0.42);
      put('kat', 760, 499, 0.95, { mood: oneEye ? 'neutral' : 'deadpan', still: true, look: oneEye ? -0.8 : 0 });
      op(katLid, oneEye ? 1 : 0);
      put('arrow', 330, 445, 0.95, { look: 0.8, mood: t > end('kat') ? 'deadpan' : 'deadpan' });
      popIn(gTitle, t, at('kat') + 0.4, 600, 165);
      popIn(gUp, t, mid('kat', 0.5), 900, 260);
      popIn(gUsed, t, mid('kat', 0.78), 900, 330);
    }
    ltKat.set(t >= cG && t < cH ? win(t, at('kat') + 0.05, at('kat') + 3.3, 0.3) : 0);

    /* ---------- H: an easier route ---------- */
    if (t >= cH && t < cI) {
      put('arrow', 1010, 460, 0.85, { look: t > mid('route', 0.6) ? -0.9 : -0.6 });
      const wk = P(t, mid('route', 0.62), end('route') + 0.5 - mid('route', 0.62), linear);
      const walking = wk > 0 && wk < 1;
      const kx = lerp(780, -140, wk), hopY = walking ? Math.abs(Math.sin(t * 9)) * 8 * AMP : 0;
      put('kat', kx, 549 - hopY, 0.45, { mood: 'deadpan', still: !walking, tail: walking ? Math.sin(t * 6) : undefined });
      show(boardH, P(t, cH, 0.15, linear));
      op(hWith, P(t, mid('route', 0.15), 0.3, linear)); op(lowP, P(t, mid('route', 0.1), 0.3, linear));
      const u = ((t - mid('route', 0.2)) / 1.6) % 1, xg = lerp(-310, 230, clamp(u));
      attr(ballG, 'cx', xg); attr(ballG, 'cy', yAt(xg, 80) - 14); op(ballG, t > mid('route', 0.2) ? 1 : 0);
      const v = ((t - mid('route', 0.2)) / 2.2) % 1, xr = lerp(-290, -110, Math.sin(clamp(v) * Math.PI));
      attr(ballR, 'cx', xr); attr(ballR, 'cy', yAt(xr, 190) - 14); op(ballR, t > mid('route', 0.2) ? 1 : 0);
      popIn(hUnch, t, mid('route', 0.8), 470, 618);
    }

    /* ---------- I: more food? / same, just faster ---------- */
    if (t >= cI && t < cJ) {
      const pz = P(t, end('same'), cJ - end('same'), linear);
      wcam = cam(1 + 0.12 * pz, 960, 430);
      kat(1135, 549);
      const isS = t >= at('same') - 0.1;
      put('olly', 300, 445, 0.95, { look: isS ? 0.8 : 0, sparkle: isS ? 0.2 : 1, mood: isS && t > at('same') + 0.1 ? 'shock' : 'happy' });
      put('arrow', 960, 470, 0.9, { look: t > end('same') ? 0 : -0.8 });
      // the tower: 22 plates, collapsing to 6
      show(tower);
      const cp = P(t, at('same') + 0.1, 0.5, easeIn), keep = 6;
      const wob = isS ? 0 : Math.sin(t * 3.2) * 4 * AMP;
      const tx = lerp(430, 560, P(t, at('same') + 0.5, 0.4, ease));
      tr(tower, tx, 590, 1, wob);
      tower.pl.forEach((p, i) => { tr(p, (i > keep - 1 ? cp * 90 * (i % 2 ? 1 : -1) * (i - keep) / 8 : 0), -(i * 15) + (i >= keep ? cp * (i * 15 - 60) : 0)); op(p, i >= keep ? 1 - cp : 1); });
      popIn(iMore, t, mid('more', 0.5), 300, 280);
      if (isS) op(iMore, 0);
      if (t > at('same') + 0.6) {
        show(stackR); tr(stackR, 740, 590);
        show(wL); show(wR); tr(wL, 560, 410); tr(wR, 740, 410);
        tr(wL.hand, 0, 0, 1, (t * 40 * AMP) % 360); tr(wR.hand, 0, 0, 1, (t * 400 * AMP) % 360);
        popIn(iNo, t, at('same') + 0.6, 560, 470); popIn(iCat, t, at('same') + 0.7, 740, 470);
        popIn(iSlow, t, mid('same', 0.75), 560, 345); popIn(iFast, t, mid('same', 0.8), 740, 345);
      }
      popIn(iSameP, t, mid('same', 0.22), 600, 165);
      popIn(iSameA, t, mid('same', 0.5), 600, 230);
      popIn(iFaster, t, mid('same', 0.82), 900, 290);
    }

    /* ---------- J: enzymes ---------- */
    if (t >= cJ && t < cK) {
      show(diagBg);
      popIn(enzT, t, at('enzymes') + 0.05, 600, 160);
      show(enz, P(t, mid('enzymes', 0.3), 0.3, linear));
      const pacX = lerp(1150, 120, P(t, mid('enzymes', 0.48), mid('enzymes', 0.97) - mid('enzymes', 0.48), linear));
      let cuts = 0;
      bonds.forEach((b, i) => { const bx = (GX[i] + GX[i + 1]) / 2, cut = SNIP.includes(i) && pacX < bx; op(b, cut ? 0 : 1); if (cut) cuts++; });
      // pairs drift apart once their bond is cut
      gls.forEach((g, i) => {
        const pair = Math.floor(i / 2), bxR = pair < 2 ? (GX[pair * 2 + 1] + GX[pair * 2 + 2]) / 2 : -1, bxL = pair > 0 ? (GX[pair * 2 - 1] + GX[pair * 2]) / 2 : -1;
        const sp = (pacX < bxR || pacX < bxL) ? 1 : 0;
        const dx = (pair - 1) * 34 * sp, dy = 30 * sp;
        tr(g, GX[i] + dx, 400 + dy);
        if (i < 5) { attr(bonds[i], 'x1', GX[i] + 26 + dx); attr(bonds[i], 'x2', GX[i + 1] - 26 + dx); attr(bonds[i], 'y1', 400 + dy); attr(bonds[i], 'y2', 400 + dy); }
      });
      const mo = Math.abs(Math.sin(t * 9)) * 0.7 + 0.05;
      const R = 46, ax = Math.cos(mo), ay = Math.sin(mo);
      attr(pacBody, 'd', `M0,0 L${(-R * ax).toFixed(1)},${(-R * ay).toFixed(1)} A${R},${R} 0 1,1 ${(-R * ax).toFixed(1)},${(R * ay).toFixed(1)} Z`);
      const pin = t > mid('enzymes', 0.45);
      op(pac, pin ? 1 : 0); tr(pac, pacX, 400);
      op(pacL, pin ? 1 : 0); attr(pacL, 'x', clamp(pacX, 170, 1030)); attr(pacL, 'y', 320);
      op(jStarch, 1 - P(t, mid('enzymes', 0.85), 0.3, linear)); op(jSug, P(t, mid('enzymes', 0.88), 0.3, linear));
      jSparks.forEach((s, i) => { op(s, cuts >= 2 ? 1 : 0); tr(s, GX[i * 2] + 55 + (i - 1) * 34, 350); s.upd(t + i); });
    }

    /* ---------- K: bread ---------- */
    if (t >= cK && t < cL) {
      show(lab); lab.upd(t); show(bench);
      wcam = cam(1 + 0.03 * P(t, cK, cL - cK, linear) + 0.08 * P(t, end('bread'), 0.6, ease), 520, 400);
      const chew = t > end('bread') + 0.05 ? 0.12 + 0.18 * Math.abs(Math.sin(t * 5)) : 0;
      put('kavya', 430, 400, 1.32, { mood: t > end('bread') ? 'deadpan' : 'smug', sweat: 0.5, look: t > mid('bread', 0.55) ? 0 : 0.6, talk: Math.max(scTalk(S, t, 'kavya'), chew) });
      show(bread); tr(bread, 720, 548);
      const secs = 180 + Math.max(0, Math.floor(t - mid('bread', 0.6)));
      popIn(kTimer, t, mid('bread', 0.58), 930, 250);
      setText(kTxt, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`);
      tr(kW.hand, 0, 0, 1, (t * 120 * AMP) % 360);
      popIn(kSweet, t, mid('bread', 0.22), 680, 270);
      popIn(kWhy, t, mid('bread', 0.35), 750, 345);
      kSp.forEach((s, i) => { show(s, P(t, mid('bread', 0.25) + i * 0.15, 0.2, linear)); tr(s, 520 + i * 30, 430 - i * 22 + 6 * Math.sin(t * 3 + i)); s.upd(t + i); });
    }

    /* ---------- L: catalytic converter ---------- */
    if (t >= cL && t < cM) {
      show(road);
      popIn(carT, t, at('car') + 0.05, 600, 160);
      show(car); show(pipe);
      popIn(lPt, t, mid('car', 0.3), 900, 250); op(lPt, P(t, mid('car', 0.3), 0.3, linear) * (1 - P(t, mid('car', 0.58), 0.2, linear)));
      // Monty rides along the pipe into the converter
      const mp = P(t, mid('car', 0.28), mid('car', 0.55) - mid('car', 0.28), ease);
      if (t > mid('car', 0.22) && t < mid('car', 0.56)) {
        put('monty', lerp(420, 640, mp), 380 + Math.abs(Math.sin(t * 8)) * -6 * AMP, 0.36, { mood: mp > 0.75 ? 'shock' : 'smug', look: 1, op: 1 - P(t, mid('car', 0.52), 0.05, linear) });
        popIn(lCO, t, mid('car', 0.24), lerp(420, 640, mp), 316);
      }
      const opO = P(t, mid('car', 0.44), 0.4, ease);
      show(lO, t > mid('car', 0.44) && t < mid('car', 0.58) ? 1 : 0); tr(lO, 700, lerp(240, 400, opO));
      const cp = P(t, mid('car', 0.6), mid('car', 0.88) - mid('car', 0.6), linear);
      if (t > mid('car', 0.6)) { show(co2); tr(co2, lerp(800, 1100, cp), 408 - 10 * Math.sin(t * 6)); popIn(lCO2, t, mid('car', 0.62), lerp(800, 1040, cp), 340); }
      popIn(lEq, t, mid('car', 0.76), 600, 610);
    }

    /* ---------- M: boring ---------- */
    if (t >= cM) {
      show(confM); confM.set(1, t);
      wcam = cam(1 + 0.1 * P(t, end('boring'), 1.3, linear), 420, 380);
      op(extraO, 1);
      put('monty', 450, 420, 1.25, { mood: t > end('boring') ? 'deadpan' : 'sad', look: t > mid('boring', 0.3) && t < end('boring') ? 0.6 : 0 });
      popIn(mCard, t, mid('boring', 0.15), 900, 290);
      if (t > mid('boring', 0.82)) { show(mStamp); mStamp.set(P(t, mid('boring', 0.82), 0.4, linear)); tr(mStamp, 900, 490); }
    } else op(extraO, 0);

    world.setAttribute('transform', wcam);
    M.forEach(el => { if (!seen.has(el)) op(el, 0); });
  };
});

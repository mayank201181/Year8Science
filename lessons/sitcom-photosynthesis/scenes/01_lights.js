/* Scene 1: Lights on.
   Bedroom at dawn (7:00 AM, sun rises, Plant wakes) -> the factory lights flicker on, belt starts -> Clive shouts
   for Phyllis -> Phyllis sweeps in (lower third, "chlorophyll = the green pigment") -> Clive confessional with a row
   of tiny Phyllises -> white light splits; red + blue go into Phyllis (absorbs light energy) -> Kavya: "it eats
   green" (0.9 s hold) -> Phyllis appalled (green x) -> green bounces off into an eye -> Clive deadpan, Phyllis in a
   green feather boa -> PHOTO + SYNTHESIS -> Kavya: "food from the soil?" -> Clive's deadpan -> producers, soil
   gives water + minerals, not food -> checklist: light ✓, carbon dioxide ?, water ?, Clive eyes the door. */
scene('lights', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed lit) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const litCam = (el, k, fx, fy, sx, sy) => el.setAttribute('transform', `translate(${sx.toFixed(1)} ${sy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  const litPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  // a line of coloured parts, centred on (x, y): parts = [[text, colour, weight], ...]
  function litParts(parent, x, y, parts, o) {
    o = o || {};
    const size = o.size || 32, font = o.font || FD;
    const w = parts.reduce((a, [s, , wt]) => a + textWidth(s, size, font, wt || 700), 0);
    const tx = E('text', { x: x - w / 2, y, 'font-size': size, 'font-family': font, 'font-weight': 700, fill: o.fill || C.ink }, parent);
    parts.forEach(([s, col, wt]) => { const sp = E('tspan', {}, tx); sp.textContent = s; if (col) sp.setAttribute('fill', col); if (wt) sp.setAttribute('font-weight', wt); });
    tx.w = w;
    return tx;
  }
  // dark pill with coloured parts
  function litChip(parent, parts, o) {
    o = o || {};
    if (typeof parts === 'string') parts = [[parts]];
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.75);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    const tx = litParts(g, 0, size * 0.35, parts, { size, fill: o.color || C.ink });
    const w = tx.w + size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w;
    return g;
  }
  // a tiny Phyllis (cheap: no face rig), about 120 px wide at s = 1
  function litMini(parent, mic) {
    const g = G(parent), ink = SC_INK;
    E('path', { d: 'M72,46 Q100,70 92,104', fill: 'none', stroke: '#3DB862', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-60,-92 a40,40 0 1,0 0.1,0 Z M60,-92 a40,40 0 1,0 0.1,0 Z M-60,12 a40,40 0 1,0 0.1,0 Z M60,12 a40,40 0 1,0 0.1,0 Z', fill: '#5CC872', stroke: ink, 'stroke-width': 5 }, g);
    E('circle', { r: 78, fill: ball('#A6F2B0', '#3BAA5A'), stroke: ink, 'stroke-width': 6 }, g);
    E('path', { d: 'M-58,-118 L-8,-118 L-12,-92 Q-34,-82 -54,-92 Z M8,-118 L58,-118 L54,-92 Q34,-82 12,-92 Z', fill: '#FF5FA2', stroke: ink, 'stroke-width': 5 }, g);
    E('path', { d: 'M-30,-14 a13,15 0 1,0 0.1,0 Z M30,-14 a13,15 0 1,0 0.1,0 Z', fill: ink }, g);
    E('path', { d: 'M-26,26 Q0,52 26,26', fill: 'none', stroke: ink, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    E('circle', { cx: -84, cy: 44, r: 12, fill: '#FF4D5E', stroke: ink, 'stroke-width': 3 }, g);
    E('circle', { cx: 84, cy: 44, r: 12, fill: '#3D7BFF', stroke: ink, 'stroke-width': 3 }, g);
    if (mic) {
      E('path', { d: 'M40,40 L70,110', stroke: '#2A2430', 'stroke-width': 12, 'stroke-linecap': 'round' }, g);
      E('circle', { cx: 36, cy: 30, r: 20, fill: ball('#D8DEE4', '#6B7680'), stroke: ink, 'stroke-width': 4 }, g);
    }
    return g;
  }
  function litNote(parent) {   // a music note
    return E('path', { d: 'M0,0 L0,-46 L30,-56 L30,-12 M0,0 a10,8 0 1,1 -0.1,0 M30,-12 a10,8 0 1,1 -0.1,0', fill: 'none', stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, parent);
  }
  function litStar(parent, r, col) {
    return E('path', { d: `M0,${-r} Q${r * 0.18},${-r * 0.18} ${r},0 Q${r * 0.18},${r * 0.18} 0,${r} Q${-r * 0.18},${r * 0.18} ${-r},0 Q${-r * 0.18},${-r * 0.18} 0,${-r} Z`, fill: col || '#FFF7C2' }, parent);
  }

  /* layers */
  const Lbg = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the bedroom (dawn, Kavya's cutaways) ================= */
  const bedShot = G(Lbg), bedWrap = G(bedShot);
  const bed = phBedroom(bedWrap);
  const bedView = bed.childNodes[1], bedSun = bedView && bedView.childNodes[2] && bedView.childNodes[2].tagName === 'g' ? bedView.childNodes[2] : null;
  const clock = phClock(bedWrap, 0.9); tr(clock, 1020, 165);
  const c700 = litChip(bedWrap, '7:00 AM', { size: 34 });
  const cGreen = G(Lfg);
  { const a = litChip(cGreen, [['absorbs ', C.ink], ['green', '#7BE08A', 800], [' light?', C.ink]], { size: 34 }); tr(a, 0, 0);
    const b = litChip(cGreen, [['so it looks green?', C.muted]], { size: 30 }); tr(b, 0, 72); }
  const qMark = T(Lfg, 0, 0, '?', { size: 120, weight: 800, anchor: 'middle', fill: '#7BE08A' });
  const cSoil = G(Lfg);
  { const card = G(cSoil);
    E('rect', { x: -190, y: -70, width: 380, height: 140, rx: 8, fill: '#FFF8C4', stroke: '#C9B53A', 'stroke-width': 3 }, card);
    T(card, 0, -14, 'plants eat', { size: 38, weight: 700, anchor: 'middle', fill: '#2A3A8A' });
    T(card, 0, 36, 'soil?', { size: 38, weight: 800, anchor: 'middle', fill: '#8A4A20' }); }

  /* ================= the factory ================= */
  const facShot = G(Lbg), facWrap = G(facShot);
  const fac = phFactory(facWrap);
  const dark = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#04140B' }, facShot);
  const beam = E('path', { d: 'M760,0 L880,0 L980,600 L680,600 Z', fill: '#FFF3A0' }, facShot);   // Phyllis's sunbeam
  const darkTop = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#04140B' }, Lfg);   // the cast in the dark, before the lights
  // "Plant's working day begins"
  const cDay = litChip(Lfg, [["Plant's working day ", C.ink], ['begins', C.energy, 800]], { size: 34 });
  // shout lines
  const shout = G(Lfg);
  [0, 1, 2].forEach(i => E('path', { d: `M${-40 - i * 26},${-i * 30} Q0,${-40 - i * 34} ${40 + i * 26},${-i * 30}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round' }, shout));
  // Phyllis: chips, sparkle, tongue, boa
  const cChl = chip(Lfg, 'chlorophyll', { size: 56, fill: C.chloro, color: '#0E3A22', stroke: '#C9F2D3', sw: 4 });
  const cPig = litChip(Lfg, [['= the green ', C.ink], ['pigment', '#7BE08A', 800]], { size: 34 });
  const sparkles = G(Lfg), sps = [[-150, -120, 22], [150, -150, 28], [170, 40, 18], [-170, 30, 20]].map(([x, y, r]) => ({ el: litStar(sparkles, r), x, y }));
  const tongue = E('path', { d: 'M4,0 Q14,22 26,4 Z', fill: '#FF7FA8', stroke: SC_INK, 'stroke-width': 3 }, Lfg);
  const boa = G(Lcast);
  { let d = ''; const pts = [];
    for (let i = 0; i <= 10; i++) { const u = i / 10, a = Math.PI * (1.05 - 1.1 * u); pts.push([Math.cos(a) * 104, 30 + Math.sin(a) * 78]); }
    pts.forEach(([x, y], i) => { const r = 19 + (i % 2) * 4; d += `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; });
    E('path', { d, fill: '#6EE07F', stroke: '#2C8C4C', 'stroke-width': 3 }, boa);
    let f = ''; pts.forEach(([x, y], i) => { const s = i % 2 ? 1 : -1; f += `M${x.toFixed(1)},${y.toFixed(1)} q${s * 14},${10} ${s * 6},${26} `; });
    E('path', { d: f, fill: 'none', stroke: '#B8F5BF', 'stroke-width': 3, 'stroke-linecap': 'round' }, boa);
    E('path', { d: 'M-104,34 Q-130,90 -112,150 M-96,40 Q-108,100 -86,150', fill: 'none', stroke: '#6EE07F', 'stroke-width': 16, 'stroke-linecap': 'round' }, boa); }
  // light: white beam splitting into a fan
  const fan = G(Lmid);
  const SP = [430, 420];
  const white = E('path', { d: `M630,-20 L680,-20 L${SP[0] + 18},${SP[1]} L${SP[0] - 18},${SP[1]} Z`, fill: '#FFFFFF', opacity: 0.75 }, fan);
  const SPEC = [['red', '#FF4D5E'], ['orange', '#FF9A3D'], ['yellow', '#FFE45C'], ['green', '#5BD27A'], ['blue', '#3D7BFF'], ['violet', '#9B6BFF']];
  const stripes = SPEC.map(([name, col], i) => {
    const ey = 345 + i * 34;
    const p = E('path', { d: `M${SP[0]},${SP[1]} Q650,${SP[1] + (i - 2.5) * 16} 870,${ey}`, fill: 'none', stroke: col, 'stroke-width': 15, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, fan);
    return { p, name, col, ey };
  });
  const greenHit = E('path', { d: `M${SP[0]},${SP[1]} Q650,${SP[1] + 0.5 * 16} 805,${345 + 3 * 34 - 1}`, fill: 'none', stroke: '#5BD27A', 'stroke-width': 15, 'stroke-linecap': 'round' }, fan);
  const bounce = E('path', { d: 'M805,446 L420,636', fill: 'none', stroke: '#5BD27A', 'stroke-width': 15, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, fan);
  const splitStar = litStar(fan, 34, '#FFFFFF');
  const glowP = E('circle', { r: 150, fill: glow('#FFE45C') }, Lmid);
  const zaps = [0, 1, 2].map(i => spark(Lmid, 18, { seed: i + 1 }));
  const gX = cross(Lmid, 26, '#FF3B4E');
  const cAbs = litChip(Lfg, [['absorbs ', C.ink], ['light energy', C.energy, 800]], { size: 38 });
  const cRB = litChip(Lfg, [['mostly ', C.ink], ['red', '#FF6B78', 800], [' + ', C.ink], ['blue', '#6FA0FF', 800]], { size: 34 });
  const cNoG = litChip(Lfg, [['green: ', '#7BE08A', 800], ['NOT absorbed', C.ink]], { size: 34 });
  const cRBok = litChip(Lfg, [['red', '#FF6B78', 800], [' + ', C.ink], ['blue', '#6FA0FF', 800], [': absorbed ✓', C.ink]], { size: 32 });
  const cRefl = litChip(Lfg, [['green: ', '#7BE08A', 800], ['reflected', C.ink, 800]], { size: 34 });
  const cWhy = litChip(Lfg, [["that's why leaves look ", C.ink], ['green', '#7BE08A', 800]], { size: 30 });
  // the eye that sees the green
  const eye = G(Lfg);
  E('path', { d: 'M-110,0 Q0,-86 110,0 Q0,86 -110,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 6 }, eye);
  const iris = E('circle', { cx: 20, r: 40, fill: '#7A8A99', stroke: SC_INK, 'stroke-width': 4 }, eye);
  E('circle', { cx: 24, r: 17, fill: SC_INK }, eye);
  E('circle', { cx: 34, cy: -12, r: 7, fill: '#FFFFFF' }, eye);
  E('path', { d: 'M-80,-36 l-14,-22 M-40,-58 l-6,-26 M0,-64 l2,-26 M40,-58 l10,-24 M80,-36 l16,-20', stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, eye);

  /* ================= confessional ================= */
  const conf = phConf(Lbg, 'clive');
  const minis = [0, 1, 2, 3].map(i => { const m = litMini(Lmid, i === 1); return m; });
  const notes = [0, 1, 2].map(() => litNote(Lmid));
  const cMil = litChip(Lfg, [['millions', C.energy, 800], [' of chlorophyll molecules', C.ink]], { size: 28 });
  const cPer = litChip(Lfg, [['in every chloroplast', C.muted]], { size: 28 });

  /* ================= word card: PHOTO + SYNTHESIS ================= */
  const wordG = G(Lfg);
  const WS = 84, wP = textWidth('PHOTO', WS, FD, 800), wSy = textWidth('SYNTHESIS', WS, FD, 800);
  const tPhoto = T(wordG, 0, 0, 'PHOTO', { size: WS, weight: 800, anchor: 'end', fill: C.energy });
  const tSyn = T(wordG, 0, 0, 'SYNTHESIS', { size: WS, weight: 800, anchor: 'start', fill: '#7BE08A' });
  const subP = litParts(wordG, 330, 450, [['= ', C.muted], ['light', C.energy, 800]], { size: 44 });
  const subS = litParts(wordG, 870, 450, [['= ', C.muted], ['making', '#7BE08A', 800]], { size: 44 });
  const subAll = litParts(wordG, 600, 470, [['= making ', C.ink], ['food', C.glucose, 800], [', using ', C.ink], ['light', C.energy, 800]], { size: 48 });
  const sunI = sun(wordG, 40);
  const gear = G(wordG);
  { let d = ''; for (let i = 0; i < 16; i++) { const a = i / 16 * TAU, r = i % 2 ? 46 : 60; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); }
    E('path', { d: d + 'Z', fill: '#7BE08A', stroke: '#1B6E37', 'stroke-width': 5, 'stroke-linejoin': 'round' }, gear);
    E('circle', { r: 20, fill: '#04140B', stroke: '#1B6E37', 'stroke-width': 5 }, gear); }
  const food = molGlucose(wordG, 46);

  /* ================= producers: soil strip ================= */
  const soilG = G(Lmid);
  E('rect', { x: 40, y: 520, width: 1120, height: 200, rx: 18, fill: linGrad('#7A5236', '#4E3322', true), stroke: SC_INK, 'stroke-width': 4 }, soilG);
  E('rect', { x: 40, y: 512, width: 1120, height: 20, rx: 8, fill: '#5BBF6A', stroke: SC_INK, 'stroke-width': 3 }, soilG);
  E('path', { d: 'M600,512 C596,560 606,620 600,700 M600,560 l-60,-14 M600,590 l64,-10 M602,624 l-70,6 M600,656 l66,8 M598,684 l-46,12', fill: 'none', stroke: '#F2E2C4', 'stroke-width': 9, 'stroke-linecap': 'round' }, soilG);
  const drops = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-14 Q11,2 0,10 Q-11,2 0,-14 Z', fill: C.water, stroke: '#0E5A78', 'stroke-width': 2.5 }, soilG));
  const minerals = [[790, 640], [870, 684], [960, 650]].map(([x, y]) => { const m = E('path', { d: 'M0,-14 L12,-4 L8,12 L-8,12 L-12,-4 Z', fill: '#E8E1C0', stroke: '#8C7B4A', 'stroke-width': 3 }, soilG); tr(m, x, y); return m; });
  const lWater = T(soilG, 330, 590, 'water', { size: 32, weight: 800, anchor: 'middle', fill: '#9FE6FF' });
  const lMin = T(soilG, 870, 590, 'minerals', { size: 32, weight: 800, anchor: 'middle', fill: '#F3E9C2' });
  const noFood = G(soilG); tr(noFood, 1060, 660);
  E('rect', { x: -78, y: -32, width: 156, height: 64, rx: 10, fill: 'none', stroke: '#FF3B4E', 'stroke-width': 6 }, noFood);
  T(noFood, 0, 12, 'food ✗', { size: 34, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const cProd = litChip(Lfg, [['producers', '#7BE08A', 800], [': make their own food', C.ink]], { size: 36 });

  /* ================= the checklist ================= */
  const listG = G(Lmid);
  const board = phBoard(listG, 640, 340); tr(board, 640, 300);
  T(listG, 640, 188, 'WE NEED:', { size: 38, weight: 800, anchor: 'middle', fill: SC_INK });
  const rowG = [0, 1, 2].map(() => G(listG));
  const sunRow = sun(rowG[0], 22); tr(sunRow, 410, 250);
  const co2 = molCO2(rowG[1], 14); tr(co2, 410, 330);
  const h2o = molH2O(rowG[2], 18); tr(h2o, 410, 408);
  T(rowG[0], 470, 262, 'light', { size: 38, weight: 800, fill: '#8A6A00' });
  T(rowG[1], 470, 342, 'carbon dioxide', { size: 38, weight: 800, fill: '#4C5866' });
  T(rowG[2], 470, 420, 'water', { size: 38, weight: 800, fill: '#1D84A6' });
  const okL = tick(listG, 22); tr(okL, 620, 250);
  const qs = [[790, 342], [600, 420]].map(([x, y]) => T(listG, x, y, '?', { size: 52, weight: 800, anchor: 'middle', fill: '#E8424F' }));
  const door = G(Lmid);
  E('rect', { x: 1000, y: 360, width: 160, height: 290, rx: 6, fill: '#2A4A36', stroke: '#7FE08F', 'stroke-width': 5 }, door);
  E('circle', { cx: 1024, cy: 510, r: 9, fill: '#FFD27A', stroke: SC_INK, 'stroke-width': 3 }, door);
  const doorSign = chip(door, 'DELIVERIES', { size: 26, fill: '#FFC247', color: '#3A2600', h: 42, rx: 8 }); tr(doorSign, 1080, 330);
  const clip = scClipboard(Lcast, 0.55);

  /* ================= the cast ================= */
  const kav = cast(Lcast, 'kavya', { mood: 'smug' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const phyl = cast(Lcast, 'phyllis', { mood: 'smug' });
  Lcast.appendChild(boa); Lcast.appendChild(clip);
  const ltPh = phLower(Lhud, 'phyllis');

  /* ================= cut points ================= */
  const cF = mid('seven', 0.6), tL = mid('seven', 0.72);
  const SH = [['dawn', -1e9], ['fac', cF], ['phyl', at('phyllis') - 0.1], ['conf', at('thphyllis') - 0.1], ['job', at('job') - 0.1],
    ['green', at('green') - 0.1], ['ugh', at('ugh') - 0.1], ['reflect', at('reflect') - 0.1], ['wears', at('wears') - 0.1],
    ['word', at('word') - 0.1], ['soil', at('soil') - 0.1], ['react', end('soil') + 0.1], ['prod', at('producers') - 0.1], ['three', at('three') - 0.1]];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k]; };
  const lightAt = t => { const u = t - tL; if (u < 0) return 0; if (u < 0.1) return 1; if (u < 0.2) return 0.15; if (u < 0.27) return 1; if (u < 0.4) return 0.2; return 1; };

  return t => {
    const [sid, s0] = shotAt(t);
    const BED = { dawn: 1, green: 1, soil: 1 }, FAC = { fac: 1, phyl: 1, job: 1, ugh: 1, reflect: 1, wears: 1, word: 1, react: 1, prod: 1, three: 1 };
    op(bedShot, BED[sid] ? 1 : 0); op(facShot, FAC[sid] ? 1 : 0); conf.set(sid === 'conf' ? 1 : 0, t);
    // hide everything shot-specific; each shot turns on what it needs
    op(darkTop, 0);
    [cGreen, qMark, cSoil, cDay, shout, cChl, cPig, sparkles, tongue, boa, fan, glowP, gX, cAbs, cRB, cNoG, cRBok, cRefl, cWhy, eye,
      cMil, cPer, wordG, soilG, cProd, listG, door, clip, beam, ...minis, ...notes, ...zaps].forEach(e => op(e, 0));
    op(kav, 0); op(clive, 0); op(phyl, 0);
    ltPh.set(0);
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); c.set(Object.assign({ t }, st)); };

    /* ---------- bedroom ---------- */
    if (BED[sid]) {
      const night = sid === 'dawn' ? 1 - P(t, at('seven') - 0.4, 3.6, linear) : 0;
      bed.set({ t, night, lamp: 0 });
      if (bedSun) tr(bedSun, 640, sid === 'dawn' ? lerp(430, 175, P(t, at('seven') - 0.2, 4.4, easeOut)) : 175);
      bed.plant.set({ t, droop: sid === 'dawn' ? 0.4 * (1 - P(t, at('seven') + 1.2, 3.2)) : 0 });
      clock.set(7);
      if (sid === 'dawn') {
        litCam(bedWrap, 1 + 0.06 * P(t, 0, 7, linear), 520, 320, 520, 320);
        litPop(c700, P(t, mid('seven', 0.08), 0.45, pop), 1020, 262);
      } else {
        op(c700, 0);
        const tight = 1 + 0.07 * P(t, s0, (sid === 'green' ? at('ugh') : end('soil') + 0.1) - s0, linear);
        litCam(bedWrap, tight, 860, 520, 860, 520);
        const ks = 1.4 * tight;
        const kx = 860 + (870 - 860) * tight, ky = 520 + (570 - 520) * tight;
        if (sid === 'green') {
          show(kav, kx, ky, ks, { talk: scTalk(S, t, 'kavya'), mood: 'smug', look: t < mid('green', 0.3) ? -0.8 : 0 });
          litPop(cGreen, P(t, mid('green', 0.1), 0.45, pop), 360, 170);
          const q = P(t, mid('green', 0.55), 0.4, pop);
          op(qMark, clamp(q * 2.5)); tr(qMark, 560, 330, Math.max(0.01, 0.5 + 0.5 * q), 8 * Math.sin(t * 3) * AMP);
        } else {
          show(kav, kx, ky, ks, { talk: scTalk(S, t, 'kavya'), mood: t < mid('soil', 0.2) ? 'neutral' : 'smug', look: t < mid('soil', 0.45) ? -0.7 : 0 });
          litPop(cSoil, P(t, mid('soil', 0.25), 0.45, pop), 380, 190, 1, -3);
        }
      }
    }

    /* ---------- factory ---------- */
    if (FAC[sid]) {
      const L = sid === 'fac' ? lightAt(t) : 1;
      fac.set({ t, light: L, belt: sid === 'fac' && t < tL + 0.4 ? 0 : 70 });
      let dim = 0.72 * (1 - L);
      if (sid === 'job' || sid === 'ugh' || sid === 'reflect') dim = 0.45;
      if (sid === 'word') dim = 0.72;
      if (sid === 'prod' || sid === 'three') dim = 0.3;
      dark.setAttribute('opacity', dim.toFixed(3));
      op(darkTop, sid === 'fac' ? 0.55 * (1 - L) : 0);
      let cam = [1, 600, 375, 600, 375];

      if (sid === 'fac') {
        litPop(cDay, P(t, tL + 0.45, 0.45, pop), 600, 160);
        const happy = t >= at('lights') - 0.1;
        show(clive, 420, 480, 1.0, { talk: scTalk(S, t, 'clive'), mood: happy ? 'happy' : 'deadpan', look: 0 }, happy ? -6 : 0);
        if (happy) {
          op(cDay, 1 - P(t, at('lights'), 0.3, linear));
          const sp = win(t, at('lights') + 0.05, end('lights') + 0.3, 0.15);
          op(shout, sp); tr(shout, 470, 300 - 8 * wave(t, 0.35) * AMP, 1, 18);
        }
        cam = [1 + 0.04 * P(t, at('lights'), 2.5, linear), 420, 420, 420, 420];
      }

      if (sid === 'phyl') {
        const pin = P(t, at('phyllis') - 0.05, 0.75, pop);
        op(beam, 0.28 * P(t, at('phyllis'), 0.4, linear));
        const fab = t > mid('phyllis', 0.74);
        show(phyl, 830, lerp(-260, 420, pin), 1.1, { talk: scTalk(S, t, 'phyllis'), mood: fab ? 'happy' : 'smug', look: t < mid('phyllis', 0.2) ? 0 : -0.3 }, 18 * (1 - clamp(pin)));
        show(clive, 200, 500, 0.7, { talk: 0, mood: 'deadpan', look: 1 });
        litPop(cChl, P(t, mid('phyllis', 0.22), 0.45, pop), 330, 200);
        litPop(cPig, P(t, mid('phyllis', 0.42), 0.45, pop), 330, 290);
        ltPh.set(win(t, at('phyllis') + 0.2, at('phyllis') + 3.5, 0.3));
        if (fab) { op(sparkles, 1); sps.forEach((s, i) => { const k = 0.5 + 0.5 * wave(t, 0.7, i * 0.25); tr(s.el, 830 + s.x, 420 + s.y, k * (S.reduce ? 0.8 : 1), (t * 60 + i * 30) % 360); }); }
      }

      if (sid === 'job' || sid === 'ugh' || sid === 'reflect') {
        op(fan, 1);
        const dp = sid === 'job' ? P(t, mid('job', 0.04), 0.9) : 1;
        op(white, 0.75); op(splitStar, dp); tr(splitStar, SP[0], SP[1], 0.8 + 0.2 * wave(t, 0.6), (t * 40) % 360);
        const fade = sid === 'job' ? P(t, mid('job', 0.38), 0.4, linear) : 1;
        stripes.forEach(s => {
          const rb = s.name === 'red' || s.name === 'blue';
          const isG = s.name === 'green';
          s.p.setAttribute('stroke-dashoffset', (1 - dp).toFixed(3));
          op(s.p, (sid === 'job' ? 1 : 0.999) * (rb ? 1 : lerp(1, isG && sid !== 'job' ? 0 : 0.3, fade)));
        });
        op(greenHit, sid === 'job' ? 0 : 1); op(bounce, 0);
        const ab = sid === 'job' ? P(t, mid('job', 0.32), 0.5, linear) : 0.6;
        op(glowP, ab * (0.75 + 0.25 * wave(t, 0.8))); tr(glowP, 900, 430, 1.1);
        zaps.forEach((z, i) => { op(z, ab); tr(z, 900 + [-120, 120, 90][i], 430 + [-120, -110, 120][i]); z.upd(t); });
        let mood = 'smug', look = -0.4;
        if (sid === 'job' && t > mid('job', 0.8)) { mood = 'happy'; op(tongue, 1); tr(tongue, 900 + 14, 430 + 40); }
        if (sid === 'ugh') { mood = t < mid('ugh', 0.35) ? 'shock' : 'annoyed'; look = -0.6; }
        if (sid === 'reflect') { mood = t < mid('reflect', 0.6) ? 'neutral' : 'smug'; look = -0.8; }
        show(phyl, 900, 430, 1.0, { talk: scTalk(S, t, 'phyllis'), mood, look });
        if (sid === 'job') {
          litPop(cAbs, P(t, mid('job', 0.22), 0.45, pop), 780, 160);
          litPop(cRB, P(t, mid('job', 0.48), 0.45, pop), 780, 235);
        }
        if (sid === 'ugh') {
          cam = [1 + 0.1 * P(t, s0, 1.8), 760, 430, 760, 430];
          const xp = P(t, mid('ugh', 0.3), 0.35, pop);
          op(gX, clamp(xp * 2.5)); tr(gX, 650, 432, Math.max(0.01, xp));
          litPop(cNoG, P(t, mid('ugh', 0.45), 0.45, pop), 790, 180);
        }
        if (sid === 'reflect') {
          const bp = P(t, mid('reflect', 0.2), 0.6);
          op(bounce, 1); bounce.setAttribute('stroke-dashoffset', (1 - bp).toFixed(3));
          const ep = P(t, mid('reflect', 0.12), 0.45, pop);
          op(eye, clamp(ep * 2.5)); tr(eye, 300, 650, Math.max(0.01, 0.6 + 0.4 * ep));
          attr(iris, 'fill', phMix('#7A8A99', '#3FBF5F', P(t, mid('reflect', 0.2) + 0.55, 0.3, linear)));
          litPop(cRBok, P(t, mid('reflect', 0.04), 0.45, pop), 800, 160);
          litPop(cRefl, P(t, mid('reflect', 0.35), 0.45, pop), 760, 660);
          litPop(cWhy, P(t, mid('reflect', 0.68), 0.45, pop), 800, 232);
        }
      }

      if (sid === 'wears') {
        const push = P(t, end('wears') - 0.3, 1.2, linear);
        cam = [1 + 0.16 * push, 330, 440, 330 + 60 * push, 440];
        show(clive, 330, 470, 1.0, { talk: scTalk(S, t, 'clive'), mood: 'deadpan', look: t > mid('wears', 0.15) && t < end('wears') ? 0.9 : 0 });
        show(phyl, 850, 420, 1.0, { talk: 0, mood: 'smug', look: 0 });
        op(boa, 1); tr(boa, 850, 420, 1, 4 * Math.sin(t * 2) * AMP);
      }

      if (sid === 'word') {
        op(wordG, 1);
        const m = P(t, mid('word', 0.56), 0.6, ease);
        const joint = 600 - (wP + wSy) / 2 + wP;
        const pp = P(t, mid('word', 0.02), 0.45, pop), ps = P(t, mid('word', 0.26), 0.45, pop);
        attr(tPhoto, 'x', lerp(330 + wP / 2, joint, m)); attr(tPhoto, 'y', 360); op(tPhoto, clamp(pp * 2.5));
        attr(tSyn, 'x', lerp(870 - wSy / 2, joint, m)); attr(tSyn, 'y', 360); op(tSyn, clamp(ps * 2.5));
        op(subP, P(t, mid('word', 0.1), 0.3, linear) * (1 - m)); op(subS, P(t, mid('word', 0.36), 0.3, linear) * (1 - m));
        litPop(sunI, pp * (1 - m), 330, 200); sunI.upd(t);
        litPop(gear, ps * (1 - m), 870, 200, 1, (t * 50 * AMP) % 360);
        op(subAll, P(t, mid('word', 0.7), 0.4, linear));
        litPop(food, P(t, mid('word', 0.72), 0.45, pop), 600, 210);
      }

      if (sid === 'react') {
        const push = P(t, s0, at('producers') - s0, linear);
        cam = [1 + 0.12 * push, 600, 420, 600, 420];
        show(clive, 600, 440, 1.6, { talk: 0, mood: 'deadpan', look: 0 });
      }

      if (sid === 'prod') {
        show(clive, 290, 330, 0.95, { talk: scTalk(S, t, 'clive'), mood: t < mid('producers', 0.5) ? 'annoyed' : 'deadpan', look: t < mid('producers', 0.5) ? 0 : 0.6 });
        litPop(cProd, P(t, mid('producers', 0.12), 0.45, pop), 780, 190);
        const sp = P(t, mid('producers', 0.46), 0.5, easeOut);
        op(soilG, sp); tr(soilG, 0, 220 * (1 - sp));
        drops.forEach((d, i) => { const q = ((t * 0.45 + i / 4) % 1); tr(d, lerp(260 + i * 50, 560, q), lerp(680 - i * 10, 600, q)); op(d, Math.min(1, (1 - q) * 4)); });
        op(lWater, P(t, mid('producers', 0.62), 0.3, linear));
        op(lMin, P(t, mid('producers', 0.78), 0.3, linear));
        minerals.forEach((m, i) => op(m, P(t, mid('producers', 0.74 + i * 0.04), 0.3, linear)));
        const fp = P(t, mid('producers', 0.92), 0.35, pop);
        op(noFood, clamp(fp * 2.5)); tr(noFood, 1060, 660, Math.max(0.01, 1.4 - 0.4 * fp), -8);
      }

      if (sid === 'three') {
        op(listG, 1); op(door, 1);
        rowG.forEach((g, i) => op(g, P(t, mid('three', [0.06, 0.18, 0.36][i]), 0.3, linear)));
        sunRow.upd(t);
        const ok = P(t, mid('three', 0.5), 0.35, pop);
        op(okL, clamp(ok * 2.5)); tr(okL, 620, 250, Math.max(0.01, ok));
        qs.forEach((q, i) => { const p = P(t, mid('three', 0.7 + i * 0.06), 0.35, pop); op(q, clamp(p * 2.5)); attr(q, 'font-size', (52 * (0.6 + 0.4 * p) * (1 + 0.08 * wave(t, 0.9, i * 0.5) * AMP)).toFixed(1)); });
        const lookDoor = t > mid('three', 0.72);
        show(clive, 160, 560, 0.8, { talk: scTalk(S, t, 'clive'), mood: lookDoor ? 'annoyed' : 'neutral', look: lookDoor ? 1 : 0.4 });
        op(clip, 1); tr(clip, 270, 600, 0.55, -10 + (lookDoor ? 6 * Math.abs(Math.sin(t * 7)) * AMP : 0));
      }

      litCam(facWrap, cam[0], cam[1], cam[2], cam[3], cam[4]);
      // the cast and the props over the factory follow the same camera
      [Lmid, Lcast].forEach(L => litCam(L, cam[0], cam[1], cam[2], cam[3], cam[4]));
    } else { Lmid.removeAttribute('transform'); Lcast.removeAttribute('transform'); }
    if (BED[sid]) { Lcast.removeAttribute('transform'); }

    /* ---------- confessional: tiny Phyllises behind Clive ---------- */
    if (sid === 'conf') {
      const push = P(t, end('thphyllis') - 0.2, at('job') - end('thphyllis'), linear);
      const k = 1 + 0.1 * push;
      litCam(conf, k, 430, 380, 430, 380);
      const place = (x, y) => [430 + k * (x - 430), 380 + k * (y - 380)];
      const [cx, cy] = place(430, 400);
      show(clive, cx, cy, 1.5 * k, { talk: scTalk(S, t, 'clive'), mood: 'deadpan', look: t > mid('thphyllis', 0.62) && t < end('thphyllis') ? 0.8 : 0 });
      minis.forEach((m, i) => {
        const p = P(t, mid('thphyllis', 0.3 + i * 0.07), 0.4, pop);
        const hop = Math.abs(Math.sin(t * 4 + i * 1.3)) * 14 * AMP;
        const [x, y] = place(720 + i * 120, 300 - hop);
        op(m, clamp(p * 2.5)); tr(m, x, y, Math.max(0.01, 0.42 * k * p), [-12, 8, -6, 14][i] + 6 * Math.sin(t * 2.4 + i) * AMP);
      });
      notes.forEach((n, i) => { const q = ((t * 0.6) + i / 3) % 1, v = t > mid('thphyllis', 0.68) ? Math.sin(Math.PI * q) : 0; op(n, v); const [x, y] = place(740 + i * 150, 210 - q * 70); tr(n, x, y, k); });
      litPop(cMil, P(t, mid('thphyllis', 0.38), 0.45, pop), 880, 520);
      litPop(cPer, P(t, mid('thphyllis', 0.5), 0.45, pop), 880, 590);
    }
  };
});

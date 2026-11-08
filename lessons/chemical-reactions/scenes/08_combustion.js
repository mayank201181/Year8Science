/* Chapter 8, Complete and incomplete combustion.
   Beats: a fuel burns to release energy; petrol, methane and wood all contain carbon and hydrogen
   -> an oxygen-supply gauge slides between limited and plenty -> COMPLETE (blue panel): methane and
   two oxygen molecules rearrange into carbon dioxide and water -> the word equation, a clean blue flame,
   the most energy -> INCOMPLETE (yellow panel): a smoky yellow flame, less energy -> soot, carbon
   monoxide and water come off it -> carbon monoxide: colourless, no smell; it takes oxygen's seats on a
   red blood cell -> a faulty heater with a blocked chimney, and a carbon monoxide alarm -> showpiece: a
   Bunsen burner with its air hole closed (yellow, smoky), then opened: air rushes in, the flame turns
   blue and roars, and gets hotter -> respiration: the same kind of reaction, gently, in a cell, no flame. */
scene('combustion', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const dots = list => list.map(([x, y, r]) => `M${(x - r).toFixed(1)},${y.toFixed(1)} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0`).join(' ');
  const arcPt = (a, b, u, lift) => { const cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2 - (lift || 0), v = 1 - u; return [v * v * a[0] + 2 * v * u * cx + u * u * b[0], v * v * a[1] + 2 * v * u * cy + u * u * b[1]]; };
  function mover(parent, sym, r, a, b, o) { o = o || {}; return { g: rxAtom(parent, sym, r, { letter: o.letter }), a, b, s1: o.s1 || 1, lift: o.lift === undefined ? 50 : o.lift }; }
  function fly(m, t, t0, dur) { const u = P(t, t0, dur || 1); const p = u <= 0 ? m.a : u >= 1 ? m.b : arcPt(m.a, m.b, u, m.lift); tr(m.g, p[0], p[1], lerp(1, m.s1, u)); return u; }
  function o2(parent, r) { const g = G(parent); [-1, 1].forEach(s => E('circle', { cx: s * r * 0.72, r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 1.5 }, g)); return g; }
  const flameD = (h, w) => `M0,0 C${-w},${-h * 0.3} ${-w * 0.7},${-h * 0.7} 0,${-h} C${w * 0.7},${-h * 0.7} ${w},${-h * 0.3} 0,0 Z`;
  /* a gas jet for a free-standing flame: nozzle top at (0,0) */
  function nozzle(parent) { const g = G(parent); E('rect', { x: -40, y: 22, width: 80, height: 14, rx: 5, fill: '#6B7A88', stroke: '#9DB0BF', 'stroke-width': 2 }, g); E('rect', { x: -10, y: 0, width: 20, height: 24, rx: 3, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, g); return g; }
  /* fade b in only after a has gone (no garbled cross-fades between two words) */
  const swapOp = (a, b, t, t0) => { op(a, 1 - P(t, t0, 0.22, linear)); op(b, P(t, t0 + 0.22, 0.3, linear)); };

  /* ================= 1. fuels ================= */
  const F = G(root);
  const defG = G(F);
  const defChip = chip(defG, 'fuel', { size: 34, fill: C.card2, stroke: C.line }); tr(defChip, 432, 162);
  const defA1 = arrow(defG, 482, 162, 536, 162, { color: C.muted, width: 5 });
  const defFl = rxFlame(defG, 0.42); tr(defFl, 586, 190);
  const defBurn = T(defG, 586, 228, 'burn', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const defA2 = arrow(defG, 632, 162, 686, 162, { color: C.muted, width: 5 });
  const defSp = spark(defG, 22, { seed: 4 }); tr(defSp, 730, 162);
  const defEn = T(defG, 764, 174, 'energy', { size: 34, weight: 700, fill: C.energy });
  const fuels = G(F);
  const petrol = G(fuels); tr(petrol, 300, 410);
  E('path', { d: 'M-50,-62 L26,-62 L52,-36 L52,70 Q52,78 44,78 L-50,78 Q-58,78 -58,70 L-58,-54 Q-58,-62 -50,-62 Z', fill: ball('#E8424F', '#9C2230'), stroke: '#FF9AA5', 'stroke-width': 3, 'stroke-linejoin': 'round' }, petrol);
  E('rect', { x: -42, y: -52, width: 46, height: 22, rx: 8, fill: '#3A1015', opacity: 0.7 }, petrol);
  E('path', { d: 'M36,-48 L56,-76', stroke: '#C9D3DB', 'stroke-width': 12, 'stroke-linecap': 'round' }, petrol);
  E('rect', { x: -44, y: -14, width: 82, height: 76, rx: 10, fill: 'none', stroke: '#FF9AA5', 'stroke-width': 3, opacity: 0.45 }, petrol);
  const gas = G(fuels); tr(gas, 600, 470);
  E('ellipse', { cx: 0, cy: 14, rx: 62, ry: 12, fill: '#26313A', stroke: '#7D8C99', 'stroke-width': 3 }, gas);
  E('ellipse', { cx: 0, cy: 7, rx: 40, ry: 8, fill: linGrad('#A9B6C2', '#5B6873', true), stroke: '#C5D0D9', 'stroke-width': 2 }, gas);
  const gasFl = rxFlame(gas, 0.95); tr(gasFl, 0, 6);
  const ch4 = rxMol(fuels, 'CH4', { r: 15 }); tr(ch4, 690, 330);
  const log = G(fuels); tr(log, 890, 420);
  E('rect', { x: -86, y: -36, width: 160, height: 72, rx: 12, fill: linGrad('#9A6A3A', '#5E3B1C', true), stroke: '#C08A54', 'stroke-width': 3 }, log);
  E('path', { d: 'M-66,-20 L26,-22 M-56,4 L36,2 M-70,22 L16,20', stroke: '#4A2E15', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.7 }, log);
  E('ellipse', { cx: 74, cy: 0, rx: 23, ry: 36, fill: '#E2B77F', stroke: '#C08A54', 'stroke-width': 3 }, log);
  E('path', { d: 'M74,-22 a14,22 0 1,0 0.1,0 M74,-9 a5,9 0 1,0 0.1,0', fill: 'none', stroke: '#B07F47', 'stroke-width': 2.5 }, log);
  const FX = [300, 600, 900];
  const fuelLab = ['petrol', 'methane', 'wood'].map((s, k) => T(fuels, FX[k], 524, s, { size: 30, weight: 700, anchor: 'middle' }));
  const chAtoms = FX.map(x => { const g = G(fuels); tr(rxAtom(g, 'C', 20), x - 24, 584); tr(rxAtom(g, 'H', 14), x + 22, 584); return g; });
  const fuelSum = rich(F, 600, 666, [['they all contain '], ['carbon', '#C9D1D8', 700], [' and '], ['hydrogen', C.hydrogen, 700]], { size: 32, anchor: 'middle', fill: C.muted });

  /* ================= 2. it depends on the oxygen ================= */
  const Dp = G(root);
  T(Dp, 600, 346, 'oxygen supply', { size: 38, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const bigMeter = meter(Dp, { w: 560, h: 36, color: C.oxygen }); tr(bigMeter, 320, 382);
  T(Dp, 320, 462, 'limited', { size: 30, weight: 700, fill: C.muted });
  T(Dp, 880, 462, 'plenty', { size: 30, weight: 700, anchor: 'end' });
  const dO2 = []; { const r = rng(6); for (let k = 0; k < 8; k++) dO2.push({ g: o2(Dp, 13), x: 360 + k * 68, y: 262 + r() * 34, ph: r() * TAU }); }

  /* ================= 3-6. complete (left) and incomplete (right) panels ================= */
  function panel(x, title, col, word, fillTo) {
    const g = G(root);
    card(g, x, 112, 540, 600, { fill: 'rgba(20,54,70,0.55)', stroke: col, sw: 3 });
    T(g, x + 270, 164, title, { size: 38, weight: 700, anchor: 'middle', fill: col });
    T(g, x + 30, 220, 'oxygen', { size: 26, weight: 600, fill: '#FF9A8F' });
    const m = meter(g, { w: 220, h: 24, color: C.oxygen }); tr(m, x + 128, 201);
    T(g, x + 366, 221, word, { size: 28, weight: 700, fill: fillTo > 0.5 ? C.ink : C.muted });
    return { g, m, fillTo };
  }
  const PL = panel(40, 'complete combustion', '#8EC5FF', 'plenty', 0.95);
  const PR = panel(620, 'incomplete combustion', '#FFC266', 'limited', 0.25);
  // complete: methane + 2 oxygen -> carbon dioxide + 2 water, atom by atom
  const cm = G(PL.g), RA = 16;
  const cmGh = G(cm);
  const CH = [120, 335];
  const cmC = mover(cm, 'C', RA, CH, [378, 335], { lift: 40 });
  const cmO = [[210.5, 300, 352.4, 335, 0.9], [233.5, 300, 403.6, 335, 0.9], [210.5, 370, 512, 305, 1], [233.5, 370, 512, 370, 1]].map(([x0, y0, x1, y1, s]) => mover(cm, 'O', RA, [x0, y0], [x1, y1], { s1: s, lift: 50 }));
  const cmH = [[-1, -1, 496.3, 316.5], [1, -1, 527.7, 316.5], [-1, 1, 496.3, 381.5], [1, 1, 527.7, 381.5]].map(([dx, dy, x1, y1]) => mover(cm, 'H', RA * 0.62, [CH[0] + dx * RA, CH[1] + dy * RA], [x1, y1], { letter: false, lift: 90 }));
  cm.appendChild(cmC.g);
  [[[cmC], 'C', RA], [cmO, 'O', RA], [cmH, 'H', RA * 0.62]].forEach(([ms, sym, r]) => E('path', { d: dots(ms.map(m => [m.a[0], m.a[1], r - 1])), fill: 'none', stroke: ATOM[sym][0], 'stroke-width': 2, 'stroke-dasharray': '4 4' }, cmGh));
  const cmPlus = [T(cm, 172, 347, '+', { size: 36, weight: 600, anchor: 'middle', fill: C.muted }), T(cm, 447, 347, '+', { size: 36, weight: 600, anchor: 'middle', fill: C.muted })];
  const cmArr = arrow(cm, 268, 335, 322, 335, { color: C.ink, width: 5 });
  const cmLab = [['methane', 120, C.ink], ['oxygen', 222, '#FF9A8F'], ['carbon dioxide', 378, C.co2], ['water', 512, C.water]].map(([s, x, c]) => T(cm, x, 440, s, { size: 26, weight: 600, anchor: 'middle', fill: c }));
  const cmWhy = [
    rich(cm, 70, 512, [['carbon', '#C9D1D8', 700], ['  →  ', C.muted], ['carbon dioxide', C.co2, 700]], { size: 30 }),
    rich(cm, 70, 560, [['hydrogen', C.hydrogen, 700], ['  →  ', C.muted], ['water', C.water, 700]], { size: 30 }),
  ];
  // methane: the word equation, a clean blue flame, the most energy
  const mtG = G(PL.g);
  const mtEq = [
    rich(mtG, 310, 292, [['methane', C.ink, 700], [' + ', C.muted], ['oxygen', '#FF9A8F', 700], [' →', C.ink]], { size: 34, anchor: 'middle' }),
    rich(mtG, 310, 342, [['carbon dioxide', C.co2, 700], [' + ', C.muted], ['water', C.water, 700]], { size: 34, anchor: 'middle' }),
  ];
  const nzL = nozzle(mtG); tr(nzL, 190, 622);
  const blueFl = rxFlame(mtG, 1.15); tr(blueFl, 190, 622);
  const bigSpark = spark(mtG, 34, { seed: 2 }); tr(bigSpark, 420, 500);
  const mostEn = T(mtG, 420, 590, 'most energy', { size: 32, weight: 700, anchor: 'middle', fill: C.energy });
  const cleanLab = T(mtG, 190, 690, 'clean blue flame', { size: 26, weight: 600, anchor: 'middle', fill: '#8EC5FF' });
  // incomplete: a smoky yellow flame, less energy
  const icG = G(PR.g);
  const nzR = nozzle(icG); tr(nzR, 790, 622);
  const yelFl = rxFlame(icG, 1.15, { smoke: true }); tr(yelFl, 790, 622);
  const smallSpark = spark(icG, 18, { seed: 6 }); tr(smallSpark, 1030, 500);
  const lessEn = T(icG, 1030, 590, 'less energy', { size: 32, weight: 700, anchor: 'middle', fill: '#E8D98A' });
  const smokyLab = T(icG, 790, 690, 'smoky yellow flame', { size: 26, weight: 600, anchor: 'middle', fill: '#FFC266' });
  // products of incomplete combustion
  const prG = G(PR.g);
  const soot = []; { const r = rng(14); for (let k = 0; k < 9; k++) soot.push({ el: E('circle', { r: 6 + r() * 4, fill: '#23272C', stroke: '#B9C4CE', 'stroke-width': 1.8 }, prG), x: 690 + (r() - 0.5) * 60, y: 312 + (r() - 0.5) * 36, k }); }
  const coMol = G(prG); rxMol(coMol, 'CO', { r: 19 });
  const wMol = G(prG); rxMol(wMol, 'H2O', { r: 17 });
  const prLab = [
    T(prG, 690, 392, 'soot', { size: 30, weight: 700, anchor: 'middle' }),
    T(prG, 690, 426, '(carbon)', { size: 26, weight: 600, anchor: 'middle', fill: C.muted }),
    T(prG, 885, 392, 'carbon monoxide', { size: 26, weight: 700, anchor: 'middle', fill: '#FF9A8F' }),
    T(prG, 1068, 392, 'water', { size: 28, weight: 700, anchor: 'middle', fill: C.water }),
  ];
  const toxic = chip(prG, 'toxic', { size: 26, fill: C.bad, color: '#FFFFFF' }); tr(toxic, 885, 436);

  /* ================= 7. carbon monoxide ================= */
  const CO = G(root);
  const bigCO = G(CO); rxMol(bigCO, 'CO', { r: 46 }); tr(bigCO, 280, 296);
  T(CO, 280, 394, 'carbon monoxide', { size: 36, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const eye = G(CO); tr(eye, 190, 508);
  E('path', { d: 'M-46,0 Q0,-36 46,0 Q0,36 -46,0 Z', fill: '#F4F7FA', stroke: '#C9D3DB', 'stroke-width': 3 }, eye);
  E('circle', { r: 15, fill: '#4C8BD9' }, eye); E('circle', { r: 7, fill: '#0A1B27' }, eye);
  const eyeX = cross(eye, 30);
  const nose = G(CO); tr(nose, 370, 508);
  E('path', { d: 'M-8,-44 C-12,-16 -30,6 -30,20 C-30,32 -14,34 -4,30 C4,36 22,34 22,22', fill: 'none', stroke: '#E8B48E', 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, nose);
  E('path', { d: 'M30,-20 q8,-8 0,-16 q-8,-8 0,-16 M44,-12 q8,-8 0,-16 q-8,-8 0,-16', fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, nose);
  const noseX = cross(nose, 30);
  const coLab = [T(CO, 190, 590, 'colourless', { size: 28, weight: 600, anchor: 'middle' }), T(CO, 370, 590, 'no smell', { size: 28, weight: 600, anchor: 'middle' })];
  const rbc = G(CO); tr(rbc, 860, 380);
  E('ellipse', { rx: 200, ry: 128, fill: ball('#E8424F', '#8E1E2A'), stroke: '#FF8A94', 'stroke-width': 4 }, rbc);
  E('ellipse', { rx: 118, ry: 66, fill: '#B12E3B', opacity: 0.55 }, rbc);
  const SEATS = [[-112, -40], [6, -78], [114, -30], [-30, 66]];
  E('path', { d: SEATS.map(([x, y]) => `M${x - 28},${y} a28,17 0 1,0 56,0 a28,17 0 1,0 -56,0`).join(' '), fill: '#6E1520', stroke: '#FF8A94', 'stroke-width': 2 }, rbc);
  const seatO2 = SEATS.map(() => o2(rbc, 13));
  const seatCO = SEATS.map(() => { const g = G(rbc); rxMol(g, 'CO', { r: 13, letter: false }); return g; });
  const rbcLab = T(CO, 860, 566, 'red blood cell', { size: 28, weight: 600, anchor: 'middle', fill: '#FF8A94' });
  const rbcSay = rich(CO, 860, 612, [['so your blood can’t carry '], ['oxygen', '#FF9A8F', 700]], { size: 30, anchor: 'middle' });

  /* ================= 8. danger: a blocked chimney, and an alarm ================= */
  const DG = G(root);
  E('path', { d: 'M150,650 L150,292 L600,152 L1050,292 L1050,650 Z', fill: 'rgba(159,216,255,0.04)', stroke: C.line, 'stroke-width': 6, 'stroke-linejoin': 'round' }, DG);
  E('path', { d: 'M110,650 L1090,650', stroke: '#3E6A80', 'stroke-width': 6, 'stroke-linecap': 'round' }, DG);
  E('rect', { x: 278, y: 176, width: 24, height: 190, fill: linGrad('#B9C6D2', '#7D8C99'), stroke: '#9DB0BF', 'stroke-width': 2 }, DG);
  const boiler = G(DG); tr(boiler, 290, 452);
  E('rect', { x: -72, y: -92, width: 144, height: 184, rx: 14, fill: linGrad('#EEF3F6', '#B9C6D2', true), stroke: '#9DB0BF', 'stroke-width': 3 }, boiler);
  E('rect', { x: -38, y: 8, width: 76, height: 56, rx: 10, fill: '#1B242B', stroke: '#6B7A88', 'stroke-width': 2 }, boiler);
  E('circle', { cx: 0, cy: -46, r: 14, fill: '#6B7A88', stroke: '#C9D3DB', 'stroke-width': 3 }, boiler);
  const boilFl = rxFlame(boiler, 0.34); tr(boilFl, 0, 58);
  const nest = G(DG); tr(nest, 290, 170);
  E('ellipse', { rx: 42, ry: 18, fill: ball('#9A6A3A', '#5E3B1C'), stroke: '#C08A54', 'stroke-width': 2.5 }, nest);
  E('path', { d: 'M-40,-6 L-10,4 M-22,-14 L20,6 M6,-16 L40,0 M-34,8 L30,-4', stroke: '#E2B77F', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, nest);
  const nestX = cross(nest, 22);
  const dgLab = [
    T(DG, 290, 584, 'faulty gas heater', { size: 28, weight: 600, anchor: 'middle' }),
    T(DG, 236, 178, 'blocked chimney', { size: 28, weight: 600, anchor: 'end', fill: '#FF8A94' }),
  ];
  const leaks = [0, 1, 2, 3, 4].map(k => { const g = G(DG); rxMol(g, 'CO', { r: 10, letter: false }); return { g, k, y: 380 + (k % 3) * 70 }; });
  const leakLab = T(DG, 600, 590, 'carbon monoxide builds up', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const alarm = G(DG); tr(alarm, 880, 336);
  const beeps = E('path', { d: 'M-62,-26 Q-76,0 -62,26 M-78,-40 Q-98,0 -78,40 M62,-26 Q76,0 62,26 M78,-40 Q98,0 78,40', fill: 'none', stroke: C.bad, 'stroke-width': 5, 'stroke-linecap': 'round' }, alarm);
  E('circle', { r: 46, fill: '#F4F7FA', stroke: '#C9D3DB', 'stroke-width': 4 }, alarm);
  T(alarm, 0, 16, 'CO', { size: 30, weight: 700, anchor: 'middle', fill: '#26313A' });
  const led = E('circle', { cx: 0, cy: -26, r: 7, fill: C.bad }, alarm);
  const alarmLab = T(DG, 880, 428, 'carbon monoxide alarm', { size: 28, weight: 700, anchor: 'middle' });

  /* ================= 9-10. showpiece: the Bunsen burner's air hole ================= */
  const BG = G(root);
  const bun = bunsen(BG, 1.9); tr(bun, 600, 640);
  const collar = E('rect', { x: 571, y: 564, width: 58, height: 31, rx: 5, fill: '#8E9CA9', stroke: '#C9D3DB', 'stroke-width': 2.5 }, BG);
  const hole = E('rect', { x: 586, y: 571, width: 28, height: 17, rx: 5, fill: '#0E161C' }, BG);
  const puffs = [0, 1, 2, 3, 4, 5].map(k => ({ el: E('circle', { r: 9 + (k % 3) * 4, fill: RX.soot, opacity: 0.8 }, BG), k }));
  const roar = E('path', { d: 'M548,330 Q532,300 548,270 M530,350 Q508,300 530,250 M652,330 Q668,300 652,270 M670,350 Q692,300 670,250', fill: 'none', stroke: '#BFE3FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, BG);
  const holeLead = E('path', { d: 'M682,582 L634,579', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, BG);
  const holeLab = [rich(BG, 692, 592, [['air hole: '], ['closed', C.ink, 700]], { size: 30, fill: C.muted }), rich(BG, 692, 592, [['air hole: '], ['open', C.good, 700]], { size: 30, fill: C.muted })];
  const yLab = G(BG); T(yLab, 716, 284, 'yellow, smoky flame', { size: 32, weight: 700, fill: '#FFC266' }); T(yLab, 716, 324, 'not much oxygen', { size: 26, weight: 600, fill: C.muted });
  const bLab = G(BG); rich(bLab, 716, 284, [['blue', '#8EC5FF', 700], [' flame']], { size: 32, weight: 700 }); T(bLab, 716, 326, 'hotter, and roaring', { size: 30, weight: 700 });
  const airIn = [0, 1, 2, 3, 4].map(k => ({ g: o2(BG, 10), k }));
  const airLab = T(BG, 440, 532, 'more oxygen mixes in', { size: 28, weight: 700, anchor: 'middle', fill: '#FF9A8F' });
  const thermo = thermometer(BG, 260, C.bad); tr(thermo, 1080, 520);
  const thermLab = T(BG, 1080, 584, 'temperature', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const hotLab = T(BG, 1080, 238, 'hotter', { size: 30, weight: 700, anchor: 'middle', fill: C.heat });

  /* ================= 11. respiration: the gentle version, with no flame ================= */
  const RG = G(root);
  const cellG = G(RG); tr(cellG, 600, 452);
  const cell = animalCell(cellG, 300, 200, { seed: 5, nx: -150, ny: -40, nr: 46 });
  const mito = mitochondrion(cell.inner, 230, 100, { glow: true }); tr(mito, 70, 30, 1, -8);
  const rTitle = G(RG);
  T(rTitle, 600, 160, 'respiration', { size: 56, weight: 700, anchor: 'middle', fill: C.chloro });
  T(rTitle, 600, 204, 'a gentle, controlled version of burning', { size: 28, weight: 600, anchor: 'middle' });
  const noFl = G(RG); tr(noFl, 1030, 170);
  E('path', { d: flameD(70, 22), fill: '#FF8A3D', stroke: '#FFC27A', 'stroke-width': 3, transform: 'translate(0 36)' }, noFl);
  cross(noFl, 30);
  const noFlLab = T(RG, 1030, 252, 'no flame', { size: 28, weight: 700, anchor: 'middle' });
  const MITO = [670, 482];
  const inMols = [0, 1, 2, 3, 4].map(k => ({ g: k < 2 ? molGlucose(RG, 24) : molO2(RG, 13), k, y: k < 2 ? 380 + k * 140 : 340 + (k - 2) * 95 }));
  const outMols = [0, 1, 2, 3].map(k => ({ g: k < 2 ? molCO2(RG, 12) : molH2O(RG, 14), k, y: 360 + k * 70 }));
  const rSparks = [0, 1, 2, 3, 4].map(k => spark(RG, 11, { seed: k + 2 }));
  const rLab = [['glucose', 150, 330, C.glucoseLt], ['oxygen', 150, 600, '#FF9A8F'], ['carbon dioxide', 1060, 330, C.co2], ['water', 1060, 600, C.water]].map(([s, x, y, c]) => T(RG, x, y, s, { size: 28, weight: 700, anchor: 'middle', fill: c }));
  const rEq = rich(RG, 600, 704, [['glucose', C.glucoseLt, 700], [' + '], ['oxygen', '#FF9A8F', 700], [' → '], ['carbon dioxide', C.co2, 700], [' + '], ['water', C.water, 700]], { size: 30, anchor: 'middle', fill: C.muted });

  /* ================= update ================= */
  return t => {
    const tDep = at('depends'), tCom = at('complete'), tMet = at('methane'), tInc = at('incomplete'), tPro = at('products');
    const tCO = at('co'), tDan = at('danger'), tBun = at('bunsen'), tOpen = at('open'), tCell = at('cells');

    /* 1. fuels */
    const fA = win(t, S.first - 0.1, tDep + 0.2, 0.45);
    op(F, fA);
    if (fA > 0) {
      const d1 = P(t, mid('fuel', 0.02), 0.45, pop); op(defChip, clamp(d1 * 2)); tr(defChip, 432, 162, Math.max(0.01, 0.7 + 0.3 * d1));
      defA1.set(P(t, mid('fuel', 0.1), 0.4)); op(defA1, P(t, mid('fuel', 0.1), 0.1, linear));
      const fl = P(t, mid('fuel', 0.14), 0.5, linear); defFl.set('yellow', fl * 0.9); defFl.upd(t); op(defBurn, fl);
      defA2.set(P(t, mid('fuel', 0.26), 0.4)); op(defA2, P(t, mid('fuel', 0.26), 0.1, linear));
      const sp = P(t, mid('fuel', 0.32), 0.5, pop); op(defSp, clamp(sp * 2)); tr(defSp, 730, 162, Math.max(0.01, sp)); defSp.upd(t); op(defEn, P(t, mid('fuel', 0.36), 0.4, linear));
      [[petrol, 300, 410], [gas, 600, 470], [log, 890, 420]].forEach(([g, x, y], k) => { const p = P(t, mid('fuel', 0.47 + k * 0.09), 0.5, pop); op(g, clamp(p * 2)); tr(g, x, y + (1 - clamp(p)) * 24, Math.max(0.01, 0.75 + 0.25 * p)); op(fuelLab[k], P(t, mid('fuel', 0.5 + k * 0.09), 0.4, linear)); });
      gasFl.set('blue', 1); gasFl.upd(t);
      const cp = P(t, mid('fuel', 0.6), 0.6, easeOut); op(ch4, cp); tr(ch4, 690 - (1 - cp) * 50, 330 + (1 - cp) * 60 + Math.sin(t * 1.8) * 4 * AMP);
      chAtoms.forEach((g, k) => { const p = P(t, mid('fuel', 0.76 + k * 0.05), 0.45, pop); op(g, clamp(p * 2)); tr(g, 0, (1 - clamp(p)) * 14); });
      op(fuelSum, P(t, mid('fuel', 0.88), 0.4, linear));
    }

    /* 2. depends */
    const dA = win(t, tDep - 0.05, tCom + 0.15, 0.4);
    op(Dp, dA);
    if (dA > 0) {
      const v = 0.55 + 0.4 * Math.sin((t - tDep) * 2.2 - 0.6);
      bigMeter.set(v);
      dO2.forEach((o, k) => { tr(o.g, o.x + Math.sin(t * 1.4 + o.ph) * 6 * AMP, o.y + Math.cos(t * 1.1 + o.ph) * 5 * AMP, 1, (t * 25 + k * 40) % 360); op(o.g, clamp((v * 8 - k) * 1.5)); });
    }

    /* 3-6. panels */
    const lA = win(t, tCom - 0.1, tCO + 0.1, 0.45) * (1 - 0.4 * win(t, tInc + 0.2, tCO + 0.5, 0.5));
    op(PL.g, lA);
    if (lA > 0) {
      PL.m.set(PL.fillTo * P(t, tCom + 0.2, 1.2, easeOut));
      const cA = 1 - P(t, tMet - 0.1, 0.45, linear);
      op(cm, cA);
      if (cA > 0) {
        const molIn = P(t, mid('complete', 0.22), 0.5, linear);
        const T1 = mid('complete', 0.47), T2 = mid('complete', 0.72);
        fly(cmC, t, T1, 1.0); op(cmC.g, molIn);
        cmO.forEach((m, j) => { fly(m, t, j < 2 ? T1 + j * 0.06 : T2 + (j - 2) * 0.08, 1.0); op(m.g, molIn); });
        cmH.forEach((m, j) => { fly(m, t, T2 + j * 0.06, 1.0); op(m.g, molIn); });
        op(cmGh, 0.5 * P(t, T1 + 0.4, 0.5, linear));
        op(cmPlus[0], molIn * (1 - 0.4 * P(t, T1, 0.5, linear))); op(cmPlus[1], P(t, T2 + 0.9, 0.4, linear));
        cmArr.set(P(t, mid('complete', 0.3), 0.6)); op(cmArr, molIn);
        op(cmLab[0], molIn * (1 - 0.35 * P(t, T1, 0.5, linear))); op(cmLab[1], molIn * (1 - 0.35 * P(t, T2, 0.5, linear)));
        op(cmLab[2], P(t, T1 + 0.8, 0.4, linear)); op(cmLab[3], P(t, T2 + 0.9, 0.4, linear));
        op(cmWhy[0], P(t, T1 + 0.9, 0.4, linear)); op(cmWhy[1], P(t, T2 + 1.0, 0.4, linear));
      }
      const mA = P(t, tMet, 0.45, linear);
      op(mtG, mA);
      if (mA > 0) {
        op(mtEq[0], P(t, mid('methane', 0.02), 0.4, linear)); op(mtEq[1], P(t, mid('methane', 0.22), 0.4, linear));
        const fl = P(t, mid('methane', 0.5), 0.6, easeOut); blueFl.set('blue', fl); blueFl.upd(t);
        const sp = P(t, mid('methane', 0.58), 0.6, pop); op(bigSpark, clamp(sp * 2)); tr(bigSpark, 420, 500, Math.max(0.01, sp)); bigSpark.upd(t);
        op(mostEn, P(t, mid('methane', 0.62), 0.4, linear)); op(cleanLab, P(t, mid('methane', 0.8), 0.4, linear));
      }
    }
    const rA = win(t, tInc - 0.1, tCO + 0.1, 0.45);
    op(PR.g, rA);
    if (rA > 0) {
      PR.m.set(PR.fillTo * P(t, tInc + 0.2, 0.9, easeOut));
      const fl = P(t, mid('incomplete', 0.3), 0.6, easeOut); yelFl.set('yellow', fl); yelFl.upd(t);
      const sp = P(t, mid('incomplete', 0.56), 0.6, pop); op(smallSpark, clamp(sp * 2)); tr(smallSpark, 1030, 500, Math.max(0.01, sp)); smallSpark.upd(t);
      op(lessEn, P(t, mid('incomplete', 0.6), 0.4, linear)); op(smokyLab, P(t, mid('incomplete', 0.82), 0.4, linear));
      const pA = P(t, tPro - 0.1, 0.4, linear);
      op(prG, pA);
      if (pA > 0) {
        soot.forEach(s => { const u = P(t, mid('products', 0.04) + s.k * 0.1, 1.1); const p = arcPt([790 + (s.k % 3 - 1) * 8, 470], [s.x, s.y], u, 40); attr(s.el, 'cx', p[0]); attr(s.el, 'cy', p[1]); op(s.el, P(t, mid('products', 0.04) + s.k * 0.1, 0.2, linear)); });
        const cu = P(t, mid('products', 0.38), 1.1), cpt = arcPt([790, 470], [885, 318], cu, 60);
        tr(coMol, cpt[0], cpt[1] + (cu >= 1 ? Math.sin(t * 1.7) * 3 * AMP : 0), Math.max(0.01, lerp(0.5, 1, cu))); op(coMol, P(t, mid('products', 0.38), 0.25, linear));
        const wu = P(t, mid('products', 0.78), 1.0), wpt = arcPt([790, 470], [1068, 318], wu, 70);
        tr(wMol, wpt[0], wpt[1] + (wu >= 1 ? Math.sin(t * 1.5 + 1) * 3 * AMP : 0), Math.max(0.01, lerp(0.5, 1, wu))); op(wMol, P(t, mid('products', 0.78), 0.25, linear));
        op(prLab[0], P(t, mid('products', 0.14), 0.4, linear)); op(prLab[1], P(t, mid('products', 0.24), 0.4, linear));
        op(prLab[2], P(t, mid('products', 0.5), 0.4, linear)); op(prLab[3], P(t, mid('products', 0.9), 0.4, linear));
        const tp = P(t, mid('products', 0.58), 0.45, pop); op(toxic, clamp(tp * 2)); tr(toxic, 885, 436, Math.max(0.01, 0.7 + 0.3 * tp));
      }
    }

    /* 7. carbon monoxide */
    const coA = win(t, tCO + 0.05, tDan + 0.1, 0.45);
    op(CO, coA);
    if (coA > 0) {
      const bp = P(t, tCO + 0.1, 0.6, pop); tr(bigCO, 280, 296 + Math.sin(t * 1.3) * 4 * AMP, Math.max(0.01, 0.7 + 0.3 * bp));
      [[eye, eyeX, 0.18], [nose, noseX, 0.36]].forEach(([g, x, f], k) => { const p = P(t, mid('co', f), 0.45, pop); op(g, clamp(p * 2)); tr(g, k ? 370 : 190, 508, Math.max(0.01, 0.7 + 0.3 * p)); const xp = P(t, mid('co', f) + 0.4, 0.3, easeOut); op(x, xp); tr(x, 0, 0, Math.max(0.01, 0.4 + 0.6 * xp)); op(coLab[k], P(t, mid('co', f) + 0.3, 0.4, linear)); });
      const rp = P(t, mid('co', 0.44), 0.5, pop); op(rbc, clamp(rp * 2)); tr(rbc, 860, 380, Math.max(0.01, 0.8 + 0.2 * rp));
      op(rbcLab, P(t, mid('co', 0.48), 0.4, linear));
      SEATS.forEach(([x, y], k) => {
        const t0 = mid('co', 0.58) + k * 0.25, u = P(t, t0, 0.7), knock = P(t, t0 + 0.55, 0.9, easeIn);
        const a = [x + 380 - k * 40, y - 220 + k * 30], cp = arcPt(a, [x, y], u, 40);
        tr(seatCO[k], cp[0], cp[1]); op(seatCO[k], P(t, t0, 0.2, linear));
        tr(seatO2[k], x + knock * (60 + k * 10), y - knock * 90, 1, knock * 60); op(seatO2[k], 1 - P(t, t0 + 0.8, 0.6, linear));
      });
      op(rbcSay, P(t, mid('co', 0.84), 0.4, linear));
    }

    /* 8. danger */
    const dgA = win(t, tDan + 0.05, tBun + 0.1, 0.45);
    op(DG, dgA);
    if (dgA > 0) {
      boilFl.set('yellow', P(t, mid('danger', 0.06), 0.4, linear)); boilFl.upd(t);
      op(dgLab[0], P(t, mid('danger', 0.14), 0.4, linear));
      const np = P(t, mid('danger', 0.3), 0.45, pop); op(nest, clamp(np * 2)); tr(nest, 290, 170, Math.max(0.01, 0.6 + 0.4 * np));
      const xp = P(t, mid('danger', 0.38), 0.3, easeOut); op(nestX, xp); tr(nestX, 0, 0, Math.max(0.01, 0.4 + 0.6 * xp));
      op(dgLab[1], P(t, mid('danger', 0.36), 0.4, linear));
      const lk = P(t, mid('danger', 0.4), 0.5, linear);
      leaks.forEach(o => { const u = ((t - mid('danger', 0.4)) / 3.6 + o.k / 5) % 1; tr(o.g, lerp(372, 760, u), o.y + Math.sin(u * 7 + o.k) * 18 - u * 40, 1, u * 120 + o.k * 30); op(o.g, t > mid('danger', 0.4) ? lk * Math.min(1, u * 6, (1 - u) * 4) : 0); });
      op(leakLab, P(t, mid('danger', 0.5), 0.4, linear));
      const ap = P(t, mid('danger', 0.66), 0.5, pop); op(alarm, clamp(ap * 2)); tr(alarm, 880, 336, Math.max(0.01, 0.7 + 0.3 * ap));
      const on = t > mid('danger', 0.72), blink = on && ((t - mid('danger', 0.72)) % 0.6) < 0.3;
      led.setAttribute('fill', blink ? '#FF3B4E' : '#6E1520');
      op(beeps, on ? (blink ? 1 : 0.25) : 0);
      op(alarmLab, P(t, mid('danger', 0.72), 0.4, linear));
    }

    /* 9-10. the Bunsen burner */
    const bA = win(t, tBun + 0.05, tCell + 0.1, 0.45);
    op(BG, bA);
    if (bA > 0) {
      const opened = P(t, mid('open', 0.05), 0.9);
      const blue = t >= mid('open', 0.42);
      bun.set(blue ? 'blue' : 'yellow'); bun.upd(t * (blue ? 1.6 : 1) * (0.4 + 0.6 * AMP));
      attr(hole, 'width', 28 * opened); attr(hole, 'x', 600 - 14 * opened);
      op(hole, opened > 0.02 ? 1 : 0);
      puffs.forEach(o => { const u = ((t - tBun) * 0.55 + o.k / 6) % 1; attr(o.el, 'cx', 600 + Math.sin(t * 1.7 + o.k * 2) * 16 * u * AMP); attr(o.el, 'cy', 196 - u * 110); op(o.el, blue ? 0 : P(t, mid('bunsen', 0.55), 0.5, linear) * Math.sin(u * Math.PI) * 0.85); });
      op(roar, blue ? (0.45 + 0.55 * wave(t, 0.18)) * P(t, mid('open', 0.6), 0.4, linear) : 0);
      op(holeLead, P(t, mid('bunsen', 0.52), 0.4, linear));
      if (t < mid('open', 0.05)) { op(holeLab[0], P(t, mid('bunsen', 0.52), 0.4, linear)); op(holeLab[1], 0); } else swapOp(holeLab[0], holeLab[1], t, mid('open', 0.05));
      const yOn = P(t, mid('bunsen', 0.72), 0.4, linear);
      if (t < mid('open', 0.42)) { op(yLab, yOn); op(bLab, 0); } else swapOp(yLab, bLab, t, mid('open', 0.42));
      const air = P(t, mid('open', 0.16), 0.4, linear) * (1 - P(t, mid('open', 0.95), 0.6, linear) * 0.5);
      airIn.forEach(o => { const u = ((t - mid('open', 0.16)) / 1.3 + o.k / 5) % 1; tr(o.g, lerp(330, 590, easeIn(u)), 579 + Math.sin(u * 9 + o.k) * 6, Math.max(0.01, 1 - 0.5 * u), u * 90); op(o.g, t > mid('open', 0.16) ? air * Math.min(1, u * 5, (1 - u) * 6) : 0); });
      op(airLab, P(t, mid('open', 0.2), 0.4, linear));
      const th = P(t, tBun + 0.2, 0.6, linear);
      op(thermo, th); op(thermLab, th);
      thermo.set(lerp(0.42, 0.93, P(t, mid('open', 0.58), 1.6, ease)));
      op(hotLab, P(t, mid('open', 0.72), 0.4, linear));
    }

    /* 11. respiration */
    const cA = P(t, tCell - 0.05, 0.5, linear);
    op(RG, cA);
    if (cA > 0) {
      const cp = P(t, tCell + 0.05, 0.8, easeOut); tr(cellG, 600, 452, 0.85 + 0.15 * cp); cell.upd(t * AMP); mito.upd(t);
      op(rTitle, P(t, mid('cells', 0.3), 0.5, linear)); tr(rTitle, 0, (1 - P(t, mid('cells', 0.3), 0.6, easeOut)) * 12);
      const inOn = P(t, mid('cells', 0.5), 0.5, linear), outOn = P(t, mid('cells', 0.64), 0.5, linear);
      inMols.forEach(o => { const u = ((t - mid('cells', 0.5)) / 2.6 + o.k / 5) % 1, p = arcPt([70, o.y], MITO, easeIn(u), 30); tr(o.g, p[0], p[1], Math.max(0.01, 1 - 0.45 * u), o.k < 2 ? 0 : u * 120); op(o.g, t > mid('cells', 0.5) ? inOn * Math.min(1, u * 6, (1 - u) * 5) : 0); });
      outMols.forEach(o => { const u = ((t - mid('cells', 0.64)) / 2.4 + o.k / 4) % 1, p = arcPt(MITO, [1130, o.y], easeOut(u), 30); tr(o.g, p[0], p[1], Math.max(0.01, 0.55 + 0.45 * u), u * 90); op(o.g, t > mid('cells', 0.64) ? outOn * Math.min(1, u * 5, (1 - u) * 6) : 0); });
      rSparks.forEach((s, k) => { const u = ((t - mid('cells', 0.6)) / 1.8 + k / 5) % 1, a = k * TAU / 5 + 0.4, d = 70 + 60 * easeOut(u); tr(s, MITO[0] + Math.cos(a) * d * 1.3, MITO[1] + Math.sin(a) * d * 0.7, 0.6 + 0.5 * Math.sin(u * Math.PI)); op(s, t > mid('cells', 0.6) ? Math.sin(u * Math.PI) * 0.9 : 0); s.upd(t); });
      op(rLab[0], P(t, mid('cells', 0.56), 0.4, linear)); op(rLab[1], P(t, mid('cells', 0.62), 0.4, linear));
      op(rLab[2], P(t, mid('cells', 0.7), 0.4, linear)); op(rLab[3], P(t, mid('cells', 0.74), 0.4, linear));
      op(rEq, P(t, mid('cells', 0.66), 0.5, linear));
      const np = P(t, mid('cells', 0.84), 0.5, pop); op(noFl, clamp(np * 2)); tr(noFl, 1030, 170, Math.max(0.01, 0.7 + 0.3 * np)); op(noFlLab, P(t, mid('cells', 0.86), 0.4, linear));
    }
  };
});

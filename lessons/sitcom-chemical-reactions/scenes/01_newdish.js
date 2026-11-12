/* Scene 1: "Is it a new dish?" (Round 1: the signature dish).
   Shots (hard sitcom cuts):
   A  kitchen wide: ROUND 1 card + "every dish must be a NEW SUBSTANCE"; Olly bursts in (lower third)
   B  Arrow confessional: "Nobody invites him" + inset family photo that Olly squeezes into
   C  kitchen: melted chocolate under the cloche -> push-in on Arrow ("Just... sadder.") -> PHYSICAL, the fridge
   D  medium: sugar dissolves in tea (magnifier: the same sugar particles, spread out) -> PHYSICAL
   E  kitchen: the fried egg -> CHEMICAL (new substances, can't un-fry it)
   F  Kavya at the bench: "No tasting." (NO EATING OR DRINKING sign)
   G  Olly's demo station + FIVE SIGNS board: colour, gas, temperature, precipitate, light/sound
   H  kitchen wide: Cool Guys Take Pretty Lasses card; Arrow "I didn't write it"
   I  Kavya's boiling water (judge-cam inset of Arrow): water vapour = still water, PHYSICAL
   J  kitchen wide: "1 sign = a clue", "Has a NEW SUBSTANCE been made?"; slow push-in on Arrow. */
scene('newdish', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1, CALM = !!S.reduce;

  /* ---------- local helpers (prefixed nd) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const cam0 = { k: 1, fx: 600, fy: 375, sx: 600, sy: 375 };
  const camAbout = (k, cx, cy) => ({ k, fx: cx, fy: cy, sx: cx, sy: cy });
  const camSet = (el, c) => el.setAttribute('transform', `translate(${c.sx.toFixed(1)} ${c.sy.toFixed(1)}) scale(${c.k.toFixed(4)}) translate(${(-c.fx).toFixed(1)} ${(-c.fy).toFixed(1)})`);
  const place = (el, c, x, y, s, r) => tr(el, c.sx + c.k * (x - c.fx), c.sy + c.k * (y - c.fy), s * c.k, r);
  const popIn = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  // pill label; "**word**" parts are bold in o.boldFill
  function ndChip(parent, text, o) {
    o = o || {};
    const size = o.size || 30, h = Math.round(size * 1.75), g = G(parent);
    const w = textWidth(text, size, FD, 800) + size * 1.5;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 3 }, g);
    T(g, 0, size * 0.35, text, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.boldFill || C.energy });
    g.w = w;
    return g;
  }
  // pill holding a formula with real subscripts
  function ndFChip(parent, src, o) {
    o = o || {};
    const size = o.size || 34, h = Math.round(size * 1.75), g = G(parent);
    const box = E('rect', { y: -h / 2, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': 3 }, g);
    const tx = tkFormula(g, 0, size * 0.33, src, { size, fill: o.color || C.ink });
    let w = 0; try { w = tx.getComputedTextLength(); } catch (e) { w = 0; }
    w = (w || src.length * size * 0.55) + size * 1.4;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    return g;
  }
  const ndHex = c => [1, 3, 5].map(i => parseInt(c.substr(i, 2), 16));
  const ndMix = (a, b, p) => { const A = ndHex(a), B = ndHex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // Kavya's lab-coat arm (she is a bust): sleeve from the shoulder to a hand; kind 'point' | 'hold' | 'flat'
  function ndArm(parent) {
    const g = G(parent);
    const sO = E('path', { fill: 'none', stroke: SC_INK, 'stroke-width': 42, 'stroke-linecap': 'round' }, g);
    const sI = E('path', { fill: 'none', stroke: '#F6F8FA', 'stroke-width': 34, 'stroke-linecap': 'round' }, g);
    const hand = G(g);
    const finger = E('path', { d: 'M10,-9 L48,-9 Q57,-2 48,5 L10,5 Z', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, hand);
    const palm = E('ellipse', { rx: 24, ry: 21, fill: '#B9784E', stroke: SC_INK, 'stroke-width': 3.5 }, hand);
    const knuck = E('path', { d: 'M-6,-14 Q2,-6 -6,2 M6,-14 Q14,-6 6,2', fill: 'none', stroke: '#7A4A2E', 'stroke-width': 3, 'stroke-linecap': 'round' }, hand);
    g.set = (sx, sy, hx, hy, ang, kind) => {
      const cx = (sx + hx) / 2 + (hy - sy) * 0.18, cy = (sy + hy) / 2 - (hx - sx) * 0.18;
      const d = `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${hx.toFixed(1)},${hy.toFixed(1)}`;
      attr(sO, 'd', d); attr(sI, 'd', d);
      tr(hand, hx, hy, 1, ang || 0);
      op(finger, kind === 'point' ? 1 : 0); op(knuck, kind === 'flat' ? 0 : 1);
      attr(palm, 'rx', kind === 'flat' ? 42 : 24); attr(palm, 'ry', kind === 'flat' ? 14 : 21);
    };
    return g;
  }

  /* layers: sets, the cast, things in front of the cast (counter, bench), props, the HUD */
  const Lbg = G(root), Lcast = G(root), Lfront = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const kitchen = tkKitchen(Lbg);
  // the FIVE SIGNS board on the kitchen wall (shot G)
  const boardW = G(Lbg), board = tkBoard(boardW, 380, 420, 'FIVE SIGNS');
  const SIGNS = [['C', 'colour change'], ['G', 'gas given off'], ['T', 'temperature change'], ['P', 'precipitate'], ['L', 'light or sound']];
  const SIGN_IDS = ['colour', 'gas', 'temp', 'precip', 'light'];
  const rows = SIGNS.map(([L, w], i) => {
    const g = G(board), y = -95 + i * 57;
    const letter = T(g, 0, 17, L, { size: 50, weight: 800, anchor: 'middle', fill: C.energy }); tr(letter, -152, y);
    let sz = 30; while (sz > 26 && textWidth(w, sz, FD, 700) > 288) sz--;
    T(g, -116, y + 11, w, { size: sz, weight: 700, fill: '#F2F7FA' });
    return { g, letter };
  });
  const lab = tkLab(Lbg);
  const judgeBG = G(Lbg);
  E('rect', { x: 50, y: 112, width: 210, height: 196, rx: 14, fill: linGrad('#2E2410', '#5E4714', true) }, judgeBG);
  const conf = tkConf(Lbg, 'arrow');
  // the family photo Olly squeezes into (Arrow's confessional)
  const photoBG = G(Lbg), photoIn = G(photoBG); tr(photoIn, 880, 330, 1, -4);
  E('rect', { x: -170, y: -130, width: 340, height: 260, fill: linGrad('#9ED8FF', '#E6F6FF', true) }, photoIn);
  E('rect', { x: -170, y: 50, width: 340, height: 80, fill: '#7CCB7A' }, photoIn);
  [[-80, 6, 48], [8, 18, 40], [84, 46, 28]].forEach(([x, y, r]) => {
    const h = G(photoIn); tr(h, x, y);
    E('circle', { r, fill: ball(C.hydrogen, C.hydrogenDk), stroke: SC_INK, 'stroke-width': 3 }, h);
    E('path', { d: `M${-r * 0.3},${-r * 0.15} l0,0.1 M${r * 0.3},${-r * 0.15} l0,0.1`, stroke: SC_INK, 'stroke-width': r * 0.16, 'stroke-linecap': 'round' }, h);
    E('path', { d: `M${-r * 0.35},${r * 0.25} Q0,${r * 0.6} ${r * 0.35},${r * 0.25}`, fill: 'none', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, h);
  });
  T(photoIn, -150, -100, 'The H Family', { size: 26, weight: 700, fill: '#3F5BD9' });

  /* in front of the cast */
  const counter = tkCounter(Lfront);
  const spot = E('path', { d: 'M-40,-470 L40,-470 L160,0 L-160,0 Z', fill: glow('#FFF4C2') }, Lfront);
  const bench = tkBench(Lfront);
  // boiling-water rig on the bench (shot I)
  const rig = G(Lfront);
  const bun = bunsen(rig, 0.7); tr(bun, 830, 542);
  E('path', { d: 'M762,560 L780,410 M898,560 L880,410', stroke: '#5A6672', 'stroke-width': 7, 'stroke-linecap': 'round' }, rig);
  E('rect', { x: 745, y: 402, width: 170, height: 10, rx: 3, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 2.5 }, rig);
  const boilB = beaker(rig, 160, 160, { level: 0.62, liquid: '#9FD8F5' }); tr(boilB, 830, 322);
  const boilBub = bubbles(boilB, -62, -30, 124, 104, { n: 8, r: 10, speed: 0.9, seed: 5 });
  const steam = heatWaves(rig, { n: 3, h: 80, spacing: 30, color: '#FFFFFF', width: 5 }); tr(steam, 830, 232);
  const photoFR = G(Lfront), photoFrIn = G(photoFR); tr(photoFrIn, 880, 330, 1, -4);
  E('rect', { x: -181, y: -141, width: 362, height: 282, rx: 4, fill: 'none', stroke: '#F4F1E8', 'stroke-width': 22 }, photoFrIn);
  E('rect', { x: -193, y: -153, width: 386, height: 306, rx: 6, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, photoFrIn);
  const judgeFR = G(Lfront);
  E('rect', { x: 50, y: 112, width: 210, height: 196, rx: 14, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 6 }, judgeFR);
  E('circle', { cx: 74, cy: 136, r: 8, fill: '#FF3B3B' }, judgeFR);
  T(judgeFR, 92, 146, 'JUDGE CAM', { size: 26, weight: 800, fill: '#FFFFFF' });

  /* ================= props (kitchen world coordinates) ================= */
  const kitFG = G(Lfg);
  // the dish on the island
  const dish = tkDish(kitFG, 1);
  const fChoc = G(dish.food);
  const puddle = G(fChoc);
  E('path', { d: closedPath(blobPts(66, 13, 9, 0, 0.18, 5).map(([x, y]) => [x, y - 8])), fill: '#6B3A1E', stroke: '#3E200F', 'stroke-width': 3 }, puddle);
  E('ellipse', { cx: -20, cy: -12, rx: 22, ry: 4, fill: '#A86A42', opacity: 0.8 }, puddle);
  E('path', { d: 'M28,-12 L80,-66', stroke: '#C9D3DC', 'stroke-width': 8, 'stroke-linecap': 'round' }, puddle);
  E('ellipse', { cx: 24, cy: -10, rx: 15, ry: 8, fill: '#C9D3DC', stroke: '#8C97A3', 'stroke-width': 2, transform: 'rotate(-40 24 -10)' }, puddle);
  const bar = G(fChoc);
  E('rect', { x: -56, y: -40, width: 112, height: 32, rx: 5, fill: '#6B3A1E', stroke: '#3E200F', 'stroke-width': 3 }, bar);
  E('path', { d: 'M-28,-38 L-28,-10 M0,-38 L0,-10 M28,-38 L28,-10', stroke: '#4E2913', 'stroke-width': 3 }, bar);
  const fCup = G(dish.food);
  E('path', { d: 'M52,-48 Q90,-48 82,-26 Q76,-10 48,-16', fill: 'none', stroke: SC_INK, 'stroke-width': 13 }, fCup);
  E('path', { d: 'M52,-48 Q90,-48 82,-26 Q76,-10 48,-16', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7 }, fCup);
  E('path', { d: 'M-62,-64 L62,-64 Q60,-6 0,-4 Q-60,-6 -62,-64 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, fCup);
  E('path', { d: 'M-57,-40 Q0,-34 57,-40', fill: 'none', stroke: '#5AB4FF', 'stroke-width': 6 }, fCup);
  E('ellipse', { cx: 0, cy: -64, rx: 62, ry: 12, fill: '#B8743E', stroke: SC_INK, 'stroke-width': 4 }, fCup);
  const cubes = [-18, 20].map(x => { const c = G(fCup); E('rect', { x: -13, y: -13, width: 26, height: 26, rx: 4, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, c); c.x = x; return c; });
  const fEgg = G(dish.food);
  E('path', { d: closedPath(blobPts(72, 18, 10, 0, 0.22, 9).map(([x, y]) => [x, y - 9])), fill: '#FFFFFF', stroke: '#C9B79A', 'stroke-width': 3 }, fEgg);
  E('circle', { cx: 8, cy: -16, r: 21, fill: ball('#FFC93C', '#E08A00'), stroke: '#C77A00', 'stroke-width': 2 }, fEgg);
  // the fridge (chocolate goes back to a bar) and the rewind button (the egg does not)
  const fridge = G(kitFG);
  E('rect', { x: -42, y: -64, width: 84, height: 128, rx: 12, fill: linGrad('#F4FAFE', '#C9DCE8', true), stroke: SC_INK, 'stroke-width': 4 }, fridge);
  E('path', { d: 'M-42,-18 L42,-18 M28,-50 L28,-30 M28,-4 L28,24', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, fridge);
  E('path', { d: 'M-12,8 L-12,44 M-28,17 L4,35 M-28,35 L4,17', stroke: '#5AB4FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, fridge);
  const fridgeArr = arrow(kitFG, 540, 496, 540, 548, { color: '#8AD8FF', width: 6 });
  const rew = G(kitFG);
  E('rect', { x: -54, y: -40, width: 108, height: 80, rx: 16, fill: '#22303C', stroke: '#F2F7FA', 'stroke-width': 4 }, rew);
  E('path', { d: 'M-2,-22 L-34,0 L-2,22 Z M30,-22 L-2,0 L30,22 Z', fill: '#F2F7FA' }, rew);
  const rewX = cross(rew, 38);
  // the magnifier on the tea (world (530, 385))
  const magLine = E('line', { x1: 540, y1: 462, x2: 540, y2: 528, stroke: '#D5DCE3', 'stroke-width': 4, 'stroke-dasharray': '8 6' }, kitFG);
  const mag = G(kitFG); tr(mag, 530, 385);
  E('circle', { r: 80, fill: '#B8743E' }, mag);
  const rM = rng(44);
  const teaP = [];
  for (let i = 0; i < 8; i++) { const a = rM() * TAU, r = 20 + rM() * 50; teaP.push({ el: E('circle', { r: 7, fill: '#E2B27A', opacity: 0.85 }, mag), x: Math.cos(a) * r, y: Math.sin(a) * r, ph: rM() * TAU }); }
  const sugP = [];
  for (let i = 0; i < 9; i++) {
    const a = i / 9 * TAU + rM() * 0.5, r = 26 + rM() * 32;
    sugP.push({ el: E('circle', { r: 10, fill: '#FFFFFF', stroke: '#5A4632', 'stroke-width': 2.5 }, mag), x0: (i % 3 - 1) * 21, y0: (Math.floor(i / 3) - 1) * 21 - 6, x1: Math.cos(a) * r, y1: Math.sin(a) * r, ph: rM() * TAU });
  }
  E('circle', { r: 80, fill: 'none', stroke: SC_INK, 'stroke-width': 11 }, mag);
  E('circle', { r: 80, fill: 'none', stroke: '#D5DCE3', 'stroke-width': 5 }, mag);

  /* demo station for the five signs (centre about x 575, on the island) */
  const dCol = G(kitFG); tr(dCol, 575, 495);
  const colB = beaker(dCol, 150, 180, { level: 0.6, liquid: '#3F7BFF' });
  const pip = G(dCol); tr(pip, 0, -186);
  E('rect', { x: -7, y: -10, width: 14, height: 62, rx: 4, fill: 'rgba(200,230,250,0.5)', stroke: '#CFE7F5', 'stroke-width': 3 }, pip);
  E('ellipse', { cx: 0, cy: -22, rx: 15, ry: 20, fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3 }, pip);
  const drop = E('path', { d: 'M0,-10 Q9,3 0,9 Q-9,3 0,-10 Z', fill: '#FF8A3D', stroke: '#C25516', 'stroke-width': 2 }, dCol);
  const dGas = G(kitFG); tr(dGas, 575, 495);
  const gasF = flask(dGas, 1, { level: 0.5, liquid: '#9BE7C4' });
  const gasB1 = bubbles(dGas, -50, 12, 100, 74, { n: 8, r: 7, speed: 1.3, seed: 8 });
  const gasB2 = bubbles(dGas, -12, -200, 24, 104, { n: 4, r: 7, speed: 0.9, seed: 3 });
  const fizz = G(dGas); T(fizz, 0, 12, 'FIZZ!', { size: 38, weight: 800, anchor: 'middle', fill: C.energy });
  const dTemp = G(kitFG);
  const thHot = thermometer(dTemp, 170, C.bad); tr(thHot, 515, 560);
  const thCold = thermometer(dTemp, 170, '#4C9BF0'); tr(thCold, 645, 560);
  const dPre = G(kitFG); tr(dPre, 570, 500);
  const preB = beaker(dPre, 150, 170, { level: 0, liquid: '#DDEFF5' });
  const preSolid = E('rect', { x: -62, y: 85, width: 124, height: 0, rx: 6, fill: '#F5D33F', stroke: '#C9A227', 'stroke-width': 2 }, dPre);
  const specks = []; { const rp = rng(23); for (let i = 0; i < 6; i++) specks.push({ el: E('circle', { r: 4.5, fill: '#F5D33F' }, dPre), x: -52 + rp() * 104, y: -20 + rp() * 70, ph: rp() }); }
  const tubeL = testTube(dPre, 30, 120, { level: 0.6, liquid: '#BFE3FF' }), tubeR = testTube(dPre, 30, 120, { level: 0.6, liquid: '#F2F7FA' });
  const streamL = E('path', { d: 'M-34,-135 Q-24,-110 -14,-40', fill: 'none', stroke: '#BFE3FF', 'stroke-width': 6, 'stroke-linecap': 'round' }, dPre);
  const streamR = E('path', { d: 'M34,-135 Q24,-110 14,-40', fill: 'none', stroke: '#F2F7FA', 'stroke-width': 6, 'stroke-linecap': 'round' }, dPre);
  const dLight = G(kitFG);
  const burst = (parent, R, r, fill) => { let d = ''; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); } return E('path', { d: d + 'Z', fill, stroke: '#FF8A3D', 'stroke-width': 5, 'stroke-linejoin': 'round' }, parent); };
  const bang = G(dLight); burst(bang, 128, 84, C.energy); T(bang, 0, 18, 'BANG!', { size: 54, weight: 800, anchor: 'middle', fill: '#B5372D' });
  const popB = G(dLight); burst(popB, 72, 48, '#FF9BD2'); T(popB, 0, 12, 'POP!', { size: 36, weight: 800, anchor: 'middle', fill: '#5A1E3A' });

  /* ================= Kavya's props (lab world coordinates) ================= */
  const labFG = G(Lfg);
  const heldTube = testTube(labFG, 40, 160, { level: 0.42, liquid: '#9BE7C4' }); tr(heldTube, 712, 318, 1, 12);
  const arm = ndArm(labFG);
  const sign = G(labFG); tr(sign, 190, 455, 1, -2);
  E('rect', { x: -120, y: -78, width: 240, height: 156, rx: 10, fill: '#FFFFFF', stroke: '#C62828', 'stroke-width': 7 }, sign);
  T(sign, 0, -30, 'NO EATING', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(sign, 0, 8, 'OR DRINKING', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });
  T(sign, 0, 50, 'IN THE LAB', { size: 30, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= the cast ================= */
  const arrowC = cast(Lcast, 'arrow');
  const mass = cast(Lcast, 'mass');
  const olly = cast(Lcast, 'olly');
  const kat = cast(Lcast, 'kat');
  const kav = cast(Lcast, 'kavya', { mood: 'annoyed' });
  const ALL = { arrow: arrowC, mass, olly, kat, kavya: kav };

  /* ================= HUD (screen coordinates) ================= */
  const banner = G(Lhud);
  E('rect', { x: -300, y: -40, width: 600, height: 80, rx: 16, fill: '#FF4FA0', stroke: '#FFF1F8', 'stroke-width': 4 }, banner);
  T(banner, 0, 14, 'ROUND 1: SIGNATURE DISH', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const ruleChip = ndChip(Lhud, 'every dish must be a **NEW SUBSTANCE**', { size: 28, stroke: C.energy });
  const oxyChip = ndFChip(Lhud, 'oxygen  O2', { size: 36, stroke: C.oxygen, color: '#FFD2CC' });
  const ltOlly = scLowerThird(Lhud, 'OLLY', 'Oxygen. Celebrity guest chef.');
  const uninv = ndChip(Lhud, 'not invited', { size: 28, color: '#FFB3A8', stroke: C.bad });
  const solidC = ndChip(Lhud, 'chocolate (solid)', { size: 30 });
  const liqC = ndChip(Lhud, 'chocolate (liquid)', { size: 30 });
  const sameArr = arrow(Lhud, -46, 0, 46, 0, { color: C.energy, width: 7 });
  const sadC = ndChip(Lhud, 'same substance', { size: 28, color: '#8AD8FF', stroke: '#5AB4FF' });
  const stPhys = tkStamp(Lhud, 'PHYSICAL', '#5AB4FF');
  const stChem = tkStamp(Lhud, 'CHEMICAL', C.good);
  const physC1 = ndChip(Lhud, 'no new substance', { size: 30, color: '#8AD8FF', stroke: '#5AB4FF' });
  const physC2 = ndChip(Lhud, 'easy to reverse', { size: 30, color: '#8AD8FF', stroke: '#5AB4FF' });
  const fridgeTick = tick(Lhud, 26);
  const sugarC = ndChip(Lhud, 'same sugar particles, just **spread out**', { size: 28, boldFill: '#8AD8FF' });
  const chemC1 = ndChip(Lhud, 'new substances', { size: 30, color: '#9BF0C4', stroke: C.good });
  const chemC2 = ndChip(Lhud, 'new properties', { size: 30, color: '#9BF0C4', stroke: C.good });
  const chemC3 = ndChip(Lhud, "can't un-fry it", { size: 30, color: '#FFB3A8', stroke: C.bad });
  const evid = ndChip(Lhud, 'EVIDENCE', { size: 44, color: C.energy, stroke: C.energy });
  const hotC = ndChip(Lhud, 'hotter', { size: 28, color: '#FFB3A8', stroke: C.bad });
  const coldC = ndChip(Lhud, 'colder', { size: 28, color: '#A8D4FF', stroke: '#4C9BF0' });
  const preC = ndChip(Lhud, 'insoluble solid', { size: 30, color: '#FFE48A', stroke: '#F5D33F' });
  const preArr = arrow(Lhud, 570, 372, 570, 566, { color: '#FFE48A', width: 5 });
  const flash = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#FFFDF0' }, Lhud);
  // mnemonic card
  const mnCard = G(Lhud); tr(mnCard, 600, 272);
  E('rect', { x: -470, y: -78, width: 940, height: 156, rx: 18, fill: 'rgba(14,26,36,0.93)', stroke: C.energy, 'stroke-width': 3 }, mnCard);
  const MNW = ['Cool', 'Guys', 'Take', 'Pretty', 'Lasses'], SCW = ['Colour', 'Gas', 'Temperature', 'Precipitate', 'Light'];
  const mnCols = MNW.map((w, i) => {
    const x = -368 + i * 184, lt = T(mnCard, 0, 18, w[0], { size: 54, weight: 800, anchor: 'middle', fill: C.energy }); tr(lt, x, -30);
    const mw = T(mnCard, x, 24, w, { size: 30, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
    const sw = T(mnCard, x, 62, SCW[i], { size: 26, weight: 700, anchor: 'middle', fill: '#9BE7C4' });
    return { lt, mw, sw };
  });
  // Kavya's lab chips
  const think = ndChip(Lhud, 'bubbles = a gas = a reaction?!', { size: 26, color: C.energy, stroke: C.energy });
  const vapC = ndChip(Lhud, 'water vapour', { size: 30, color: '#BFE9FF', stroke: '#8AD8FF' });
  const vapC2 = ndChip(Lhud, '= still water', { size: 30, color: '#BFE9FF', stroke: '#8AD8FF' });
  const vapLine = E('line', { x1: 908, y1: 306, x2: 858, y2: 336, stroke: '#2B3A4A', 'stroke-width': 3.5 }, Lhud);
  // the clue
  const clueC = ndChip(Lhud, '1 sign = only a **clue**', { size: 30 });
  const qCard = ndChip(Lhud, 'Has a **NEW SUBSTANCE** been made?', { size: 40, stroke: C.energy, sw: 4, rx: 22 });

  /* ---------- the shot list ---------- */
  const cB = at('tharrow') - 0.06, cC = at('choc') - 0.06, cSame = at('same') - 0.06, cPhys = at('phys') - 0.06,
    cSug = at('sugar') - 0.06, cEgg = at('egg') - 0.06, cF = at('taste') - 0.06, cG = at('signs') - 0.06,
    cH = at('mnem') - 0.06, cI = at('boil') - 0.06, cJ = at('clue') - 0.06;
  const AY = 492;                                   // Arrow's height behind the island
  const nextSign = i => (i < 4 ? at(SIGN_IDS[i + 1]) - 0.06 : cH);

  return t => {
    const shown = {};
    const show = (k, c, x, y, s, st) => { shown[k] = 1; op(c, st.op === undefined ? 1 : st.op); place(c, cam, x, y, s, st.rot); c.set(Object.assign({ t, still: CALM }, st)); };
    const talk = who => scTalk(S, t, who);

    const sConf = on(t, cB, cC), sLab = Math.max(on(t, cF, cG), on(t, cI, cJ)), sKit = sConf || sLab ? 0 : 1;
    const sA = on(t, -1e9, cB), sSame = on(t, cSame, cPhys), sSug = on(t, cSug, cEgg), sG = on(t, cG, cH), sH = on(t, cH, cI);

    /* camera */
    let cam = cam0;
    if (sSame) cam = camAbout(1.32 + 0.12 * P(t, end('same') - 0.3, cPhys - end('same') + 0.3, linear), 760, 470);
    if (sSug) cam = camAbout(1.1, 600, 430);
    if (t >= cJ) cam = camAbout(1 + 0.07 * P(t, mid('clue', 0.8), 2.2, ease), 700, 430);
    if (sConf) cam = camAbout(1 + 0.05 * P(t, mid('tharrow', 0.7), cC - mid('tharrow', 0.7), linear), 430, 400);
    if (sLab) cam = t < cG ? camAbout(1 + 0.05 * P(t, mid('taste', 0.8), cG - mid('taste', 0.8), linear), 500, 400) : cam0;

    /* sets */
    op(kitchen, sKit); op(counter, sKit); op(kitFG, sKit);
    op(lab, sLab); op(bench, sLab); op(labFG, sLab); op(rig, t >= cI && sLab ? 1 : 0);
    conf.set(sConf, t); op(photoBG, sConf); op(photoFR, sConf);
    op(judgeBG, t >= cI && sLab && t >= at('vapour') - 0.1 ? 1 : 0); op(judgeFR, t >= cI && sLab && t >= at('vapour') - 0.1 ? 1 : 0);
    op(boardW, sG);
    op(kitchen.sign, sSame ? 0 : 1);
    if (sKit) { kitchen.upd(t); camSet(kitchen, cam); camSet(counter, cam); camSet(kitFG, cam); camSet(boardW, cam); }
    if (sLab) { lab.upd(t); camSet(lab, cam); camSet(bench, cam); camSet(labFG, cam); camSet(rig, cam); }
    if (sConf) { camSet(conf, cam); camSet(photoBG, cam); camSet(photoFR, cam); }

    /* hide every prop, then show the current shot's */
    [banner, ruleChip, oxyChip, uninv, solidC, liqC, sameArr, sadC, physC1, physC2, fridgeTick, sugarC, chemC1, chemC2, chemC3, evid, hotC, coldC, preC, preArr, mnCard, think, vapC, vapC2, vapLine, clueC, qCard, flash,
      dish, fridge, fridgeArr, rew, mag, magLine, dCol, dGas, dTemp, dPre, dLight, spot, heldTube, arm, sign].forEach(e => op(e, 0));
    stPhys.set(0); stChem.set(0); ltOlly.set(0);

    /* Kat asleep on the island's left end, in every kitchen shot */
    if (sKit) show('kat', kat, 170, 545, 0.45, { mood: 'deadpan', still: true });

    /* ========== A: round 1, Olly bursts in ========== */
    if (sA) {
      const oIn = P(t, at('olly') - 0.08, 0.5, easeOut);
      show('arrow', arrowC, 760, AY, 1, { talk: 0, mood: 'deadpan', look: t < at('olly') ? 0 : -0.8 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: t < at('olly') ? -0.2 : -0.7, reading: '0.00 g' });
      if (t >= at('olly') - 0.1) {
        show('olly', olly, lerp(-170, 320, oIn), 450 - 60 * Math.sin(Math.PI * oIn), 0.85, { talk: talk('olly'), mood: t > mid('olly', 0.72) ? 'smug' : 'happy', look: t < mid('olly', 0.4) ? 0.3 : 0, sparkle: 1 });
        op(spot, 0.8 * P(t, at('olly') - 0.1, 0.3, linear) * (1 - P(t, end('olly'), 0.4, linear)) + 0.0); tr(spot, lerp(-170, 320, oIn), 592);
      }
      popIn(banner, t, at('round') + 0.1, 600, 250);
      if (t < at('olly') - 0.15) popIn(ruleChip, t, mid('round', 0.5), 330, 410); else op(ruleChip, 0);
      if (t > at('olly')) op(banner, 1 - P(t, at('olly'), 0.2, linear));
      if (t >= at('olly')) popIn(oxyChip, t, mid('olly', 0.3), 320, 300);
      ltOlly.set(win(t, at('olly') + 0.15, at('olly') + 3.4, 0.3));
    }

    /* ========== B: Arrow's confessional + the family photo ========== */
    if (sConf) {
      show('arrow', arrowC, 420, 410, 1.35, { talk: talk('arrow'), mood: 'deadpan', look: t > mid('tharrow', 0.55) && t < end('tharrow') + 0.2 ? 0.75 : 0 });
      const peek = P(t, mid('tharrow', 0.45), 0.5, easeOut);
      show('olly', olly, lerp(1150, 1032, peek), 352, 0.42, { mood: 'happy', look: -0.6, sparkle: 0, rot: -12 + 4 * Math.sin(t * 6) * AMP });
      popIn(uninv, t, mid('tharrow', 0.7), 880, 532);
    }

    /* ========== C: chocolate; Arrow close; PHYSICAL ========== */
    if (t >= cC && t < cSug) {
      const sx = 540, sy = 596;
      op(dish, 1); place(dish, cam, sx, sy, 1);
      op(fChoc, 1); op(fCup, 0); op(fEgg, 0);
      dish.set(P(t, mid('choc', 0.55), 0.5, ease));
      // the bar comes back after the fridge
      const back = P(t, mid('phys', 0.86), 0.5, ease);
      op(puddle, 1 - back); op(bar, back);
      let aMood = 'deadpan', aLook = -0.5, oMood = 'happy', oLook = 0.7;
      if (t < cSame) { aLook = t < mid('choc', 0.5) ? -0.7 : -0.4; oLook = t < mid('choc', 0.5) ? 0 : 0.5; }
      else if (t < cPhys) {
        aLook = t < mid('same', 0.75) ? -0.4 : 0; oMood = t > mid('same', 0.82) ? 'sad' : 'happy'; oLook = 0.8;
        popIn(solidC, t, mid('same', 0.2), 360, 196);
        if (t > mid('same', 0.5)) { op(sameArr, P(t, mid('same', 0.5), 0.25, linear)); tr(sameArr, 600, 196); }
        popIn(liqC, t, mid('same', 0.55), 840, 196);
        if (t > mid('same', 0.8)) popIn(sadC, t, mid('same', 0.8), 600, 262);
      } else {
        aLook = t > mid('phys', 0.72) ? -0.4 : 0; oMood = t > mid('phys', 0.88) ? 'happy' : 'sad'; oLook = 0.8;
        stPhys.set(P(t, mid('phys', 0.1), 0.35, linear)); tr(stPhys, 600, 252);
        popIn(physC1, t, mid('phys', 0.3), 232, 252);
        popIn(physC2, t, mid('phys', 0.56), 965, 252);
        if (t > mid('phys', 0.72)) { popIn(fridge, t, mid('phys', 0.72), 540, 420); op(fridgeArr, 1); fridgeArr.set(P(t, mid('phys', 0.78), 0.3, linear)); }
        if (t > mid('phys', 0.92)) popIn(fridgeTick, t, mid('phys', 0.92), 640, 470);
      }
      show('arrow', arrowC, 760, AY, 1, { talk: talk('arrow'), mood: aMood, look: aLook });
      show('olly', olly, 320, 450, 0.85, { talk: talk('olly'), mood: oMood, look: oLook, sparkle: t < cSame ? 1 : 0 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: -0.5, reading: '0.00 g' });
    }

    /* ========== D: sugar dissolves in tea ========== */
    if (sSug) {
      op(dish, 1); place(dish, cam, 540, 596, 1);
      op(fChoc, 0); op(fCup, 1); op(fEgg, 0);
      dish.set(P(t, mid('sugar', 0.08), 0.4, ease));
      cubes.forEach((c, i) => { const p = P(t, mid('sugar', 0.45) + i * 0.15, 0.35, easeIn); op(c, t > mid('sugar', 0.4) ? 1 - P(t, mid('sugar', 0.45) + i * 0.15 + 0.35, 0.3, linear) : 0); tr(c, c.x, lerp(-170, -66, p), 1, 20 * p); });
      const spread = P(t, mid('sugar', 0.75), 1.8, ease);
      if (t > mid('sugar', 0.6)) {
        popIn(mag, t, mid('sugar', 0.6), 530, 385); op(magLine, 1);
        teaP.forEach(p => { attr(p.el, 'cx', p.x + 3 * Math.sin(t * 3 + p.ph) * AMP); attr(p.el, 'cy', p.y + 3 * Math.cos(t * 2.6 + p.ph) * AMP); });
        sugP.forEach(p => { attr(p.el, 'cx', lerp(p.x0, p.x1, spread) + 2.5 * Math.sin(t * 3.3 + p.ph) * AMP * spread); attr(p.el, 'cy', lerp(p.y0, p.y1, spread) + 2.5 * Math.cos(t * 2.9 + p.ph) * AMP * spread); });
      }
      if (t > at('still')) popIn(sugarC, t, mid('still', 0.15), 410, 228);
      stPhys.set(P(t, mid('still', 0.78), 0.35, linear)); tr(stPhys, 905, 228, 0.72);
      show('arrow', arrowC, 760, AY, 1, { talk: talk('arrow'), mood: 'deadpan', look: t < at('still') ? -0.7 : t < end('still') ? -0.35 : 0 });
      show('olly', olly, 320, 450, 0.85, { talk: talk('olly'), mood: t > mid('still', 0.8) ? 'sad' : 'happy', look: t < at('still') ? 0.4 : 0.8, sparkle: t < at('still') ? 1 : 0 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: -0.5, reading: '0.00 g' });
    }

    /* ========== E: the fried egg -> CHEMICAL ========== */
    if (t >= cEgg && t < cF) {
      op(dish, 1); place(dish, cam, 540, 596, 1);
      op(fChoc, 0); op(fCup, 0); op(fEgg, 1);
      dish.set(P(t, mid('egg', 0.15), 0.4, ease));
      popIn(chemC1, t, mid('chem', 0.32), 232, 252);
      popIn(chemC2, t, mid('chem', 0.45), 965, 252);
      if (t > mid('chem', 0.58)) {
        popIn(rew, t, mid('chem', 0.58), 540, 425);
        const xp = P(t, mid('chem', 0.66), 0.3, pop); op(rewX, clamp(xp * 3)); tr(rewX, 0, 0, Math.max(0.01, 1.3 - 0.3 * xp));
        popIn(chemC3, t, mid('chem', 0.64), 540, 332);
      }
      stChem.set(P(t, mid('chem', 0.86), 0.35, linear)); tr(stChem, 600, 252);
      const impressed = t > at('chem') && t < mid('chem', 0.22);
      show('arrow', arrowC, 760, AY, 1, { talk: talk('arrow'), mood: impressed ? 'neutral' : 'deadpan', look: t < at('chem') ? -0.7 : t > mid('chem', 0.55) && t < mid('chem', 0.8) ? -0.4 : 0 });
      show('olly', olly, 320, 450, 0.85, { talk: talk('olly'), mood: t > at('chem') ? 'smug' : 'happy', look: t < at('chem') ? 0.3 : 0.8, sparkle: 1 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: -0.5, reading: '0.00 g' });
    }

    /* ========== F + I: Kavya at the bench ========== */
    if (sLab) {
      if (t < cG) {
        // F: "We're not allowed to taste anything. I asked."
        show('kavya', kav, 470, 400, 1.3, { talk: talk('kavya'), mood: t > mid('taste', 0.86) ? 'deadpan' : 'annoyed', look: t < mid('taste', 0.45) ? 0.8 : t < mid('taste', 0.75) ? -0.5 : 0, sweat: 0.6 });
        op(heldTube, 1);
        const lift = 8 * Math.sin(t * 2) * AMP;
        tr(heldTube, 712, 318 + lift, 1, 12);
        op(arm, 1); arm.set(560, 500, 698, 392 + lift, -10, 'hold');
        popIn(sign, t, mid('taste', 0.58), 190, 455, 1, -2);
      } else {
        // I: boiling water; Arrow on the judge cam
        const sad = t > mid('vapour', 0.8);
        show('kavya', kav, 400, 400 + (sad ? 10 * P(t, mid('vapour', 0.8), 0.5, ease) : 0), 1.3,
          { talk: talk('kavya'), mood: t < at('vapour') ? 'happy' : sad ? 'sad' : 'neutral', look: t < at('vapour') ? 0.9 : t < mid('vapour', 0.5) ? -0.7 : 0.6, sweat: 0.6 });
        bun.upd(t); boilBub.upd(t, 1); steam.upd(t);
        if (t < at('vapour') - 0.05) { op(arm, 1); arm.set(500, 500, 640, 400 + 4 * Math.sin(t * 9) * AMP, -6, 'point'); }
        if (t < at('vapour') - 0.1) popIn(think, t, mid('boil', 0.35), 350, 200);
        if (t > at('vapour') - 0.1) {
          show('arrow', arrowC, 155, 236, 0.42, { talk: talk('arrow'), mood: 'deadpan', look: 0.7 });
          popIn(vapC, t, mid('vapour', 0.3), 1030, 300); op(vapLine, P(t, mid('vapour', 0.33), 0.2, linear));
          popIn(vapC2, t, mid('vapour', 0.55), 1030, 362);
          stPhys.set(P(t, mid('vapour', 0.8), 0.35, linear)); tr(stPhys, 662, 440, 0.65);
        }
      }
    }

    /* ========== G: the five signs ========== */
    if (sG) {
      const drp = P(t, mid('signs', 0.5), 0.55, pop);
      tr(board, 930, lerp(-300, 405, drp));
      rows.forEach((r, i) => {
        const t0 = mid(SIGN_IDS[i], 0.45), p = P(t, t0, 0.4, pop);
        op(r.g, clamp(p * 2.5)); tr(r.g, -24 * (1 - clamp(p)), 0);
        tr(r.letter, -152, -95 + i * 57, Math.max(0.01, 1 + 0.35 * (1 - P(t, t0, 0.6, easeOut)) * (t > t0 ? 1 : 0)));
      });
      if (t < at('colour') - 0.1) popIn(evid, t, mid('signs', 0.18), 575, 390);
      const cur = SIGN_IDS.findIndex((id, i) => t >= at(id) - 0.06 && t < nextSign(i));
      if (cur === 0) {
        const L = 'colour'; op(dCol, 1);
        const dp = P(t, mid(L, 0.2), 0.45, easeIn); op(drop, t > mid(L, 0.2) && dp < 1 ? 1 : 0); tr(drop, 0, lerp(-132, -10, dp));
        colB.set(0.6, ndMix('#3F7BFF', '#FF8A3D', P(t, mid(L, 0.3), 0.9, ease)));
      } else if (cur === 1) {
        const L = 'gas'; op(dGas, 1); gasB1.upd(t, P(t, mid(L, 0.15), 0.4, linear)); gasB2.upd(t, P(t, mid(L, 0.3), 0.4, linear));
        op(fizz, P(t, mid(L, 0.55), 0.2, linear)); tr(fizz, -112, -112, 1, -10 + 5 * Math.sin(t * 9) * AMP);
      } else if (cur === 2) {
        const L = 'temp'; op(dTemp, 1);
        thHot.set(lerp(0.25, 0.92, P(t, mid(L, 0.3), 0.8, ease))); thCold.set(lerp(0.8, 0.12, P(t, mid(L, 0.62), 0.8, ease)));
        popIn(hotC, t, mid(L, 0.35), 515, 352); popIn(coldC, t, mid(L, 0.66), 645, 352);
      } else if (cur === 3) {
        const L = 'precip'; op(dPre, 1);
        const pin = P(t, mid(L, 0.18), 0.35, ease), pour = P(t, mid(L, 0.28), 0.55, linear);
        const tubesOut = P(t, mid(L, 0.55), 0.25, linear);
        op(tubeL, (1 - tubesOut) * pin); op(tubeR, (1 - tubesOut) * pin);
        tr(tubeL, -90, -155, 1, 110 * pin); tr(tubeR, 90, -155, 1, -110 * pin);
        tubeL.set(0.6 * (1 - pour)); tubeR.set(0.6 * (1 - pour));
        const streaming = pour > 0 && pour < 1 ? 1 : 0;
        op(streamL, streaming); op(streamR, streaming);
        const cloud = P(t, mid(L, 0.42), 0.4, linear), settle = P(t, mid(L, 0.62), 1.6, ease);
        preB.set(0.58 * pour, ndMix(ndMix('#DDEFF5', '#F2DE6A', cloud), '#E3F0D8', settle));
        attr(preSolid, 'height', 22 * settle); attr(preSolid, 'y', 85 - 22 * settle);
        specks.forEach(s => { op(s.el, cloud * (1 - settle) + (settle > 0 && settle < 1 ? 0.6 : 0)); attr(s.el, 'cx', s.x); attr(s.el, 'cy', lerp(s.y, 78, clamp(settle * (0.7 + s.ph * 0.6)))); });
        if (t > mid(L, 0.74)) { popIn(preC, t, mid(L, 0.74), 570, 340); op(preArr, 1); preArr.set(P(t, mid(L, 0.8), 0.3, linear)); }
      } else if (cur === 4) {
        const L = 'light'; op(dLight, 1);
        const fl = P(t, mid(L, 0.28), 0.08, linear) * (1 - P(t, mid(L, 0.36), 0.3, linear));
        op(flash, fl * 0.75 * AMP);
        popIn(bang, t, mid(L, 0.3), 575, 455, 1, -8 + 4 * Math.sin(t * 7) * AMP);
        popIn(popB, t, mid(L, 0.6), 650, 335, 1, 10);
      }
      show('olly', olly, 300, 470, 0.85, { talk: talk('olly'), mood: t > mid('light', 0.75) ? 'smug' : 'happy', look: t < at('colour') ? 0.6 : (scTalk(S, t, 'olly') > 0 && ((t * 0.7) % 1) < 0.35 ? 0 : 0.9), sparkle: cur === 4 ? 1 : 0.6 });
    }

    /* ========== H: Cool Guys Take Pretty Lasses ========== */
    if (sH) {
      op(mnCard, 1); tr(mnCard, 600, 272, 0.92 + 0.08 * P(t, at('mnem') - 0.06, 0.3, pop));
      mnCols.forEach((c, i) => {
        const pm = P(t, mid('mnem', 0.17 + i * 0.045), 0.3, pop);
        op(c.mw, clamp(pm * 2.5));
        const ps = P(t, mid('mnem', 0.47 + i * 0.075), 0.3, ease);
        op(c.sw, ps);
        tr(c.lt, -368 + i * 184, -30, Math.max(0.01, 1 + 0.3 * Math.sin(Math.PI * ps)));
      });
      const notMine = t > mid('mnem', 0.85);
      show('arrow', arrowC, 760, 520, 1, { talk: talk('arrow'), mood: notMine ? 'annoyed' : 'deadpan', look: notMine ? 1 : 0 });
      show('olly', olly, 320, 470, 0.85, { mood: notMine ? 'smug' : 'happy', look: 0.8, sparkle: notMine ? 1 : 0 });
      show('mass', mass, 1010, 510, 0.8, { mood: 'deadpan', look: -0.6, reading: '0.00 g' });
    }

    /* ========== J: one sign is only a clue ========== */
    if (t >= cJ) {
      popIn(clueC, t, mid('clue', 0.1), 300, 330);
      popIn(qCard, t, mid('clue', 0.5), 600, 250);
      show('arrow', arrowC, 760, AY, 1, { talk: talk('arrow'), mood: 'deadpan', look: t < mid('clue', 0.3) ? -0.3 : 0 });
      show('olly', olly, 320, 450, 0.85, { mood: t > mid('clue', 0.55) ? 'neutral' : 'happy', look: 0.8, sparkle: 0 });
      show('mass', mass, 1010, 500, 0.8, { mood: 'deadpan', look: -0.6, reading: '0.00 g' });
    }

    Object.entries(ALL).forEach(([k, c]) => { if (!shown[k]) op(c, 0); });
  };
});

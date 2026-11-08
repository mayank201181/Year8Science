/* Chapter 1, What a force is.
   Beats: a hand pushes the crate and a rope pulls it -> the arrows fade to "?" (a force is invisible) while
   the crate slides (you see what it does) -> five mini panels: start, speed up, slow down, direction, shape
   -> S, S, S, D, S -> a big N and Isaac Newton -> the newtonmeter -> an apple (1 N) and a 1 kg bag of
   sugar (10 N) -> a force drawn as an arrow (size, direction) -> showpiece: 10 N is exactly twice as long
   as 5 N -> contact forces -> non-contact forces. */
scene('force', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SC = 40;                                    // px per newton: every force arrow in this scene (1 N = 40 px)
  const beat = (t, a, b) => win(t, a, b, 0.4);
  const loop = (t, t0, period) => { const u = (t - t0) / period; return u <= 0 ? 0 : u - Math.floor(u); };
  let nClip = 0;
  function clipRect(x, y, w, h, rx) { const id = 'fbForceClip' + (++nClip); const cp = E('clipPath', { id }, defs()); E('rect', { x, y, width: w, height: h, rx: rx || 0 }, cp); return `url(#${id})`; }

  /* several circles, or rotated ellipses, drawn as one path (fewer elements) */
  const circlesD = list => list.map(([x, y, r]) => `M${x - r},${y} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0`).join(' ');
  const ellipsesD = list => list.map(([cx, cy, rx, ry, d]) => { const a = d * Math.PI / 180, dx = rx * Math.cos(a), dy = rx * Math.sin(a); return `M${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)} A${rx},${ry} ${d} 1 1 ${(cx - dx).toFixed(1)},${(cy - dy).toFixed(1)} A${rx},${ry} ${d} 1 1 ${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)} Z`; }).join(' ');

  /* ---------- art (the Types of force chapter draws the same things the same way) ---------- */
  const SKIN = '#C98E62', SKIN_DK = '#9C6A44', SLEEVE = '#5B8DEF', CUFF = '#4A78D4';
  /* sleeves fade out, so an arm never reads as a long pipe across the stage */
  const fadeG = (id, stops) => { const g = E('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 0 }, defs()); stops.forEach(([o, a]) => E('stop', { offset: o, 'stop-color': SLEEVE, 'stop-opacity': a }, g)); return `url(#${id})`; };
  const SLEEVE_L = fadeG('fbForceSleeveL', [[0, 0], [0.6, 1], [1, 1]]), SLEEVE_R = fadeG('fbForceSleeveR', [[0, 1], [0.4, 1], [1, 0]]);
  /* a hand pushing to the right: an upright palm whose fingertip side is at (0, 0), the arm off to the left */
  function pushHand(parent) {
    const g = G(parent);
    E('rect', { x: -250, y: -2, width: 222, height: 30, rx: 13, fill: SLEEVE_L }, g);
    E('rect', { x: -44, y: -1, width: 16, height: 28, rx: 6, fill: CUFF }, g);
    E('path', { d: 'M-30,26 L-30,-12 Q-30,-34 -17,-34 L-8,-34 Q2,-34 2,-24 L2,18 Q2,30 -9,30 L-22,30 Q-30,30 -30,26 Z', fill: SKIN, stroke: SKIN_DK, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-30,8 Q-47,4 -45,-9 Q-43,-18 -30,-11', fill: SKIN, stroke: SKIN_DK, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-21,-32 L-21,-16 M-13,-33 L-13,-16 M-5,-32 L-5,-16', stroke: SKIN_DK, 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0.6 }, g);
    return g;
  }
  /* a fist gripping a rope (or string) that runs in from the left, at (0, 0); the arm goes off to the right */
  function fistR(parent) {
    const g = G(parent);
    E('rect', { x: 22, y: -15, width: 222, height: 30, rx: 13, fill: SLEEVE_R }, g);
    E('rect', { x: 16, y: -14, width: 16, height: 28, rx: 6, fill: CUFF }, g);
    E('rect', { x: -22, y: -21, width: 42, height: 42, rx: 14, fill: SKIN, stroke: SKIN_DK, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-13,-21 L-13,-6 M-3,-21 L-3,-6 M7,-21 L7,-6', stroke: SKIN_DK, 'stroke-width': 2, opacity: 0.6, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function ropeLine(parent, x1, y1, x2, y2) {
    const g = G(parent);
    E('line', { x1, y1, x2, y2, stroke: '#A97E45', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('line', { x1, y1, x2, y2, stroke: '#E3C08A', 'stroke-width': 9, 'stroke-dasharray': '5 7', opacity: 0.75 }, g);
    return g;
  }
  /* an apple about 62 wide at s = 1, centred; its stalk top is at (5 s, -34 s) */
  function appleArt(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: 'M0,-17 C10,-27 30,-24 31,-4 C32,16 18,30 6,29 C3,28 -3,28 -6,29 C-18,30 -32,16 -31,-4 C-30,-24 -10,-27 0,-17 Z', fill: ball('#F0505C', '#A4232E'), stroke: '#8E1C26', 'stroke-width': 2 }, k);
    E('path', { d: 'M0,-17 Q1,-28 5,-34', fill: 'none', stroke: '#6B4423', 'stroke-width': 4, 'stroke-linecap': 'round' }, k);
    E('path', { d: 'M3,-27 Q15,-37 24,-29 Q14,-21 3,-27 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 1.5 }, k);
    return g;
  }
  function earthArt(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: ball('#4C9BE8', '#1D4E8F') }, g);
    E('path', { d: `M${-r * 0.55},${-r * 0.35} q${r * 0.3},${-r * 0.25} ${r * 0.55},${-r * 0.05} q${r * 0.1},${r * 0.35} ${-r * 0.2},${r * 0.55} q${-r * 0.35},${r * 0.1} ${-r * 0.35},${-r * 0.5} Z M${r * 0.1},${r * 0.25} q${r * 0.35},${-r * 0.1} ${r * 0.45},${r * 0.2} q${-r * 0.15},${r * 0.3} ${-r * 0.45},${r * 0.25} Z`, fill: '#5BD27A', opacity: 0.85 }, g);
    return g;
  }
  /* a paperclip about 66 x 22 at s = 1, centred, lying along x */
  function paperclip(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: 'M-12,-3 L20,-3 A5,5 0 0 1 20,7 L-22,7 A9,9 0 0 1 -22,-11 L26,-11 A9,9 0 0 1 26,7 L4,7', fill: 'none', stroke: '#DCE6EE', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k);
    return g;
  }
  /* a rubbed balloon (minus charges on its skin), centred; its knot is at (0, 60 s) */
  function balloonArt(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('ellipse', { rx: 44, ry: 54, fill: ball('#FF9A57', '#C25516'), stroke: '#FFC59A', 'stroke-width': 2.5 }, k);
    E('path', { d: 'M-7,60 L7,60 L3,53 L-3,53 Z', fill: '#C25516' }, k);
    E('path', { d: [[-20, -14], [8, -28], [22, 6], [-14, 24], [10, 34], [-2, 4]].map(([x, y]) => `M${x - 6},${y} L${x + 6},${y}`).join(' '), stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, k);
    return g;
  }
  /* a head of hair, centred; g.set(lift 0..1, tx, ty) stands the strands up towards (tx, ty) */
  function hairHead(parent) {
    const g = G(parent);
    E('circle', { r: 40, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2 }, g);
    E('path', { d: 'M-39,-6 Q-36,-40 0,-41 Q36,-40 39,-6 Q20,-26 0,-26 Q-20,-26 -39,-6 Z', fill: '#6B4423' }, g);
    E('path', { d: circlesD([[-13, 4, 4], [13, 4, 4]]), fill: '#2A1D14' }, g);
    E('path', { d: 'M-9,20 Q0,25 9,20', fill: 'none', stroke: '#7A4A30', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const st = [];
    for (let i = 0; i < 9; i++) st.push({ el: E('path', { fill: 'none', stroke: '#6B4423', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g), a: -Math.PI / 2 + (i - 4) * 0.26 });
    g.set = (lift, tx, ty) => {
      st.forEach((s, i) => {
        const bx = Math.cos(s.a) * 34, by = Math.sin(s.a) * 34;
        const fa = s.a + (i < 4 ? -0.55 : 0.55), fx = Math.cos(fa) * 44, fy = Math.sin(fa) * 44 + 6;
        const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy) || 1, ux = bx + dx / L * 46, uy = by + dy / L * 46;
        const ex = lerp(fx, ux, lift), ey = lerp(fy, uy, lift);
        s.el.setAttribute('d', `M${bx.toFixed(1)},${by.toFixed(1)} Q${lerp(bx * 1.2, (bx + ex) / 2, lift).toFixed(1)},${lerp(by * 1.25, (by + ey) / 2, lift).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`);
      });
    };
    E('path', { d: [[-38, -60], [38, -60]].map(([x, y]) => `M${x - 6},${y} L${x + 6},${y} M${x},${y - 6} L${x},${y + 6}`).join(' '), stroke: '#FFE29A', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.set(0, 0, -200);
    return g;
  }
  /* a hardback book lying flat, base centre at (0, 0) */
  function bookArt(parent, w, h) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 3, fill: '#8A3B2E', stroke: '#5E2219', 'stroke-width': 2 }, g);
    E('rect', { x: -w / 2 + 7, y: -h + 5, width: w - 11, height: h - 10, fill: '#F2E9D8' }, g);
    E('line', { x1: -w / 2 + 9, x2: w / 2 - 6, y1: -h / 2, y2: -h / 2, stroke: '#CDBF9F', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* a table whose top surface is at y = 0, centred */
  function tableArt(parent, w, legH) {
    const g = G(parent), [mid_, dk, lt] = FM.wood;
    E('rect', { x: -w / 2 + 10, y: 10, width: 10, height: legH, fill: dk }, g);
    E('rect', { x: w / 2 - 20, y: 10, width: 10, height: legH, fill: dk }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: 13, rx: 3, fill: linGrad(lt, mid_, true), stroke: dk, 'stroke-width': 2 }, g);
    return g;
  }
  /* a sledge on the ground at y = 0, its runners curling up at the front (right); rope ring at (64, -22) */
  function sledgeArt(parent) {
    const g = G(parent), [mid_, dk, lt] = FM.wood;
    E('path', { d: 'M-70,0 L38,0 C66,0 76,-24 66,-40 C60,-50 46,-46 50,-34', fill: 'none', stroke: '#B9C6D2', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M-52,-2 L-52,-22 M-16,-2 L-16,-22 M20,-2 L20,-22', stroke: dk, 'stroke-width': 6 }, g);
    E('rect', { x: -76, y: -33, width: 116, height: 12, rx: 4, fill: linGrad(lt, mid_, true), stroke: dk, 'stroke-width': 2 }, g);
    E('path', { d: 'M-46,-33 L-46,-21 M-16,-33 L-16,-21 M14,-33 L14,-21', stroke: dk, 'stroke-width': 2 }, g);
    E('circle', { cx: 64, cy: -22, r: 5, fill: 'none', stroke: '#B9C6D2', 'stroke-width': 3 }, g);
    return g;
  }
  /* a magnifying glass, lens centred at (0, 0), handle to the lower right */
  function magnifier(parent) {
    const g = G(parent);
    E('line', { x1: 52, y1: 52, x2: 116, y2: 116, stroke: '#C9D6DE', 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 74, fill: 'rgba(159,216,255,0.10)', stroke: '#E4EDF2', 'stroke-width': 10 }, g);
    E('path', { d: 'M-48,-26 A54,54 0 0 1 -14,-54', stroke: '#ffffff', 'stroke-width': 6, fill: 'none', opacity: 0.5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  /* dashes marking an air gap */
  function gapDash(parent, x1, y1, x2, y2) { return E('line', { x1, y1, x2, y2, stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7', 'stroke-linecap': 'round' }, parent); }
  /* the floating paperclip: a magnet above, a clip on a thread tied to a base at (0, 0); g.set(sway) */
  function magnetRig(parent) {
    const g = G(parent);
    E('rect', { x: -40, y: -4, width: 80, height: 12, rx: 4, fill: '#5F6E7B', stroke: '#8597A6', 'stroke-width': 2 }, g);
    const thread = E('line', { x1: 0, y1: -4, x2: 0, y2: -200, stroke: '#E9F2F7', 'stroke-width': 2 }, g);
    const clipG = G(g); paperclip(clipG, 0.9);
    const mag = magnet(g, 120, 40); tr(mag, 30, -340);
    gapDash(g, -44, -316, -44, -272);
    g.set = sway => { tr(clipG, sway, -242, 1, 90); attr(thread, 'x2', sway); attr(thread, 'y2', -214); };
    g.clipTop = sway => [sway, -270];
    g.set(0);
    return g;
  }

  /* ================= A. push and pull; forces are invisible ================= */
  const A = G(root);
  fmFloor(A, 250, 1080, 580);
  const rig = G(A);
  const ghosts = G(rig);
  const motion = G(rig);
  fmCrate(rig, 190, 140).at(600, 580);                        // x 505..695, top 440, centre (600, 510)
  const handA = pushHand(rig);
  const ropeA = G(rig); ropeLine(ropeA, 695, 540, 905, 540);
  const fistA = fistR(rig); tr(fistA, 920, 540);
  const pushA = fmArrow(rig, 'push', 505, 478, 3.5, 'right', { tip: true, scale: SC, label: 'push', value: false, size: 34 });
  const pullA = fmArrow(rig, 'pull', 695, 478, 3.5, 'right', { scale: SC, label: 'pull', value: false, size: 34 });
  [[365, 505], [695, 835]].forEach(([x1, x2]) => {
    E('line', { x1, y1: 478, x2: x2 - 24, y2: 478, stroke: C.good, 'stroke-width': 5, 'stroke-dasharray': '10 9', opacity: 0.6 }, ghosts);
    E('path', { d: `M${x2},478 L${x2 - 25},462 L${x2 - 18},478 L${x2 - 25},494 Z`, fill: 'none', stroke: C.good, 'stroke-width': 3, 'stroke-linejoin': 'round', opacity: 0.6 }, ghosts);
  });
  const qs = [T(rig, 435, 448, '?', { size: 54, weight: 700, fill: C.muted, anchor: 'middle' }), T(rig, 765, 448, '?', { size: 54, weight: 700, fill: C.muted, anchor: 'middle' })];
  const moveArrow = arrow(motion, 520, 404, 690, 404, { color: C.muted, width: 5 });
  const moveTxt = T(motion, 605, 386, 'it moves', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  const lens = magnifier(A);
  const seeTxt = T(A, 600, 252, 'You can’t see the force itself…', { size: 38, weight: 600, anchor: 'middle', fill: C.muted });
  const doesTxt = T(A, 600, 252, '…but you see what it **does**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });

  /* ================= B. five things a force can do ================= */
  const B = G(root);
  const PX = [140, 370, 600, 830, 1060], PY = 285, PW = 208, PH = 230;
  const NAMES = ['start moving', 'speed up', 'slow down', 'change direction', 'change shape'];
  const WORDS = ['Start', 'Speed up', 'Slow down', 'Direction', 'Shape'];
  const LETTERS = ['S', 'S', 'S', 'D', 'S'];
  const panels = PX.map((x, i) => {
    const g = G(B); tr(g, x, PY);
    card(g, -PW / 2, -PH / 2, PW, PH, { fill: C.card, stroke: C.line, rx: 18 });
    const inner = G(g, { 'clip-path': clipRect(-PW / 2 + 2, -PH / 2 + 2, PW - 4, PH - 4, 16) });
    const name = T(B, x, PY + PH / 2 + 46, NAMES[i], { size: 28, weight: 700, anchor: 'middle' });
    const letter = T(B, x, 566, LETTERS[i], { size: 96, weight: 700, anchor: 'middle', fill: C.faint });
    const word = T(B, x, 630, WORDS[i], { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
    return { g, inner, name, letter, word, x };
  });
  // 1. a ball starts to roll
  const p1 = panels[0].inner;
  E('line', { x1: -96, x2: 96, y1: 70, y2: 70, stroke: '#8FA3B3', 'stroke-width': 4 }, p1);
  const ball1 = G(p1); const ball1s = G(ball1);
  E('circle', { r: 28, fill: ball('#FFFFFF', '#B9C6D2'), stroke: '#8597A6', 'stroke-width': 2 }, ball1);
  ball1.appendChild(ball1s);
  { const pts = [], dots = []; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5, b = a + Math.PI; pts.push((Math.cos(a) * 10).toFixed(1) + ',' + (Math.sin(a) * 10).toFixed(1)); dots.push([+(Math.cos(b) * 21).toFixed(1), +(Math.sin(b) * 21).toFixed(1), 6]); } E('path', { d: 'M' + pts.join(' L') + ' Z ' + circlesD(dots), fill: '#22323D' }, ball1s); }
  const kick1 = fmArrow(p1, 'push', -80, 42, 1.3, 'right', { tip: true, scale: SC, label: '', value: false });
  // 2. a car speeds up
  const p2 = panels[1].inner;
  E('rect', { x: -104, y: 70, width: 208, height: 26, fill: '#2A3640' }, p2);
  const dash2 = E('line', { x1: -104, x2: 104, y1: 83, y2: 83, stroke: '#C9D6DF', 'stroke-width': 3, 'stroke-dasharray': '16 18', opacity: 0.6 }, p2);
  const car2Lines = [0, 1, 2].map(() => E('line', { stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, p2));
  const car2 = fmCar(p2);
  const drive2 = fmArrow(p2, 'drive', 0, 0, 1.3, 'right', { scale: SC, label: '', value: false });
  // 3. a bike slows down
  const p3 = panels[2].inner;
  E('line', { x1: -104, x2: 104, y1: 70, y2: 70, stroke: '#8FA3B3', 'stroke-width': 4 }, p3);
  const bike3 = fmCyclist(p3, { shirt: '#E07A3E' });
  const brake3 = fmArrow(p3, 'friction', 0, 0, 1.3, 'left', { scale: SC, label: '', value: false });
  // 4. a ball bounces off a bat
  const p4 = panels[3].inner;
  const trail4 = G(p4);
  E('path', { d: 'M96,-74 L-17,4 L96,56', fill: 'none', stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '6 8' }, trail4);
  const bat4 = G(p4), bat4i = G(bat4); tr(bat4i, 0, 0, 1.1);
  E('rect', { x: -6, y: -108, width: 12, height: 50, rx: 5, fill: '#2B2B2B' }, bat4i);
  E('path', { d: 'M-14,-62 L14,-62 L16,52 Q16,64 4,64 L-6,64 Q-16,64 -16,52 Z', fill: linGrad('#F0D9A8', '#C9A66B'), stroke: '#8A6A3E', 'stroke-width': 2 }, bat4i);
  const ball4 = G(p4);
  E('circle', { r: 17, fill: ball('#D8434F', '#8E1C26'), stroke: '#6E1520', 'stroke-width': 1.5 }, ball4);
  E('path', { d: 'M-11,-12 Q-3,0 -11,12 M11,-12 Q3,0 11,12', fill: 'none', stroke: '#F2E9D8', 'stroke-width': 2 }, ball4);
  const hit4 = fmArrow(p4, 'push', 0, 0, 1.3, 'right', { scale: SC, label: '', value: false });
  // 5. a hand squashes a sponge
  const p5 = panels[4].inner;
  E('line', { x1: -104, x2: 104, y1: 70, y2: 70, stroke: '#8FA3B3', 'stroke-width': 4 }, p5);
  const sponge5 = G(p5);
  E('rect', { x: -48, y: -52, width: 96, height: 38, rx: 8, fill: '#F7D54A', stroke: '#C9A21C', 'stroke-width': 2.5 }, sponge5);
  E('rect', { x: -48, y: -16, width: 96, height: 16, rx: 4, fill: '#4FA35A', stroke: '#2C7A37', 'stroke-width': 2 }, sponge5);
  E('path', { d: circlesD([[-30, -40, 5], [-12, -30, 4], [10, -42, 5], [28, -30, 4], [0, -24, 3], [-32, -24, 3], [34, -44, 3]]), fill: '#D9B22A' }, sponge5);
  const hand5 = G(p5); const hand5i = pushHand(hand5); tr(hand5i, 0, 0, 0.85, 90);
  const press5 = fmArrow(p5, 'push', 0, 0, 1.3, 'down', { tip: true, scale: SC, label: '', value: false });

  /* ================= C. newtons, after Isaac Newton ================= */
  const Cn = G(root);
  const bigN = T(Cn, 330, 470, 'N', { size: 260, weight: 700, anchor: 'middle', fill: C.energy });
  const nWord = T(Cn, 330, 560, 'newtons', { size: 60, weight: 700, anchor: 'middle' });
  const newtonG = G(Cn); tr(newtonG, 850, 600);
  {
    const col = '#6F8C9D';
    E('path', { d: 'M-118,0 C-114,-66 -74,-102 -26,-108 L36,-108 C82,-102 114,-66 118,0 Z', fill: col }, newtonG);
    E('path', { d: circlesD([[-58, -142, 30], [-68, -112, 27], [-62, -84, 24], [-44, -64, 22], [-50, -184, 30], [-30, -214, 30], [0, -228, 28], [28, -226, 22]]), fill: col }, newtonG);
    E('path', { d: 'M-34,-118 C-46,-170 -28,-222 14,-224 C40,-224 54,-204 54,-186 L68,-160 L56,-154 C60,-147 58,-141 52,-138 C56,-130 52,-122 44,-119 C34,-112 22,-112 16,-104 L14,-88 L-28,-92 Z', fill: col }, newtonG);
    E('path', { d: 'M6,-104 L30,-104 L24,-66 L12,-66 Z', fill: '#E9F2F7', opacity: 0.85 }, newtonG);
  }
  const tree = G(Cn);
  E('path', { d: 'M1230,140 Q1090,156 990,190', fill: 'none', stroke: '#6B4423', 'stroke-width': 12, 'stroke-linecap': 'round' }, tree);
  E('path', { d: ellipsesD([[1000, 182, 26, 12, -20], [1050, 170, 26, 12, 20], [1100, 160, 26, 12, -10], [1150, 152, 26, 12, 30]]), fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, tree);
  const grassN = E('line', { x1: 690, x2: 1110, y1: 600, y2: 600, stroke: '#78C27C', 'stroke-width': 5, 'stroke-linecap': 'round' }, Cn);
  const appleN = appleArt(Cn, 1);
  const newtonName = T(Cn, 850, 660, 'Isaac Newton', { size: 38, weight: 700, anchor: 'middle' });

  /* ================= D. the newtonmeter, an apple and a bag of sugar ================= */
  const D = G(root);
  const NMY = 118, NMS = 0.9, NM1 = 640, NM2 = 930;
  E('rect', { x: 540, y: NMY - 14, width: 520, height: 12, rx: 6, fill: '#8E9CA9', stroke: FM.metal[2], 'stroke-width': 2 }, D);
  [NM1, NM2].forEach(x => E('path', { d: `M${x},${NMY - 4} L${x},${NMY + 4}`, stroke: FM.metal[2], 'stroke-width': 4 }, D));
  const nm1 = fmNewtonmeter(D, { max: 10, len: 150, readout: true }); tr(nm1, NM1, NMY, NMS);
  const nm2 = fmNewtonmeter(D, { max: 10, len: 150, readout: true }); tr(nm2, NM2, NMY, NMS);
  const appleD = G(D);
  E('path', { d: 'M6,-40 L1,-62 M1,-62 A5,5 0 1 1 1,-72 A5,5 0 1 1 1,-62', fill: 'none', stroke: '#E9F2F7', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, appleD);
  appleArt(appleD, 1.2);
  const bagD = G(D); const bagIn = fmBag(bagD, '1 kg', { s: 0.85 }); T(bagIn, 0, 72, 'sugar', { size: 24, weight: 700, fill: '#3B2A14', anchor: 'middle' });
  const handD = fistR(D);                                   // one hand hooks on the apple, then the bag
  const nmTitle = T(D, 70, 296, 'newtonmeter', { size: 48, weight: 700, fill: C.energy });
  const nmSub = T(D, 70, 346, 'also called a', { size: 30, weight: 500, fill: C.muted });
  const nmSub2 = T(D, 70, 390, 'spring balance', { size: 38, weight: 700 });
  const earthChip = G(D); tr(earthChip, 250, 560);
  const ec = chip(earthChip, 'here on Earth', { size: 30, fill: C.card2, stroke: C.line });
  tr(earthArt(earthChip, 22), -ec.w / 2 - 34, 0);

  /* ================= E. a force is an arrow; longer = bigger ================= */
  const Ea = G(root);
  const FY1 = 360, FY2 = 600, CX = 230, AX = 310, AY1 = FY1 - 62, AY2 = FY2 - 62;   // the arrows start at the crates' right sides
  const shelf = G(Ea); fmFloor(shelf, 100, 760, FY1);
  fmFloor(Ea, 100, 760, FY2);
  fmCrate(Ea, 160, 124).at(CX, FY2);
  const crate1G = G(Ea); fmCrate(crate1G, 160, 124).at(CX, FY1);
  const arrowE = fmArrow(Ea, 'pull', AX, AY2, 10, 'right', { scale: SC, label: '', value: false });
  const arrow10 = fmArrow(Ea, 'pull', AX, AY2, 10, 'right', { scale: SC, label: 'pull', size: 30, side: 'below' });
  const arrow5 = fmArrow(Ea, 'pull', AX, AY1, 5, 'right', { scale: SC, label: 'pull', size: 30 });
  const sizeDim = fmDim(Ea, AX, AY2 - 44, AX + 10 * SC, AY2 - 44, 'size', { side: 'above', size: 32, textColor: C.energy });
  const tailDot = G(Ea); E('circle', { cx: AX, cy: AY2, r: 9, fill: C.energy, stroke: C.bg0, 'stroke-width': 3 }, tailDot);
  T(tailDot, AX + 14, AY2 + 46, 'acts here', { size: 28, weight: 600, fill: C.muted });
  const headTxt = G(Ea);
  T(headTxt, AX + 10 * SC + 26, AY2 + 10, 'direction', { size: 32, weight: 700, fill: C.energy });
  const copies = [0, 1].map(() => fmArrow(Ea, 'pull', 0, 0, 5, 'right', { scale: SC, label: '', value: false }));
  const twice = G(Ea); tr(twice, 990, 470);
  chip(twice, 'twice as long', { size: 34, fill: C.card2, stroke: C.good });
  const plus = T(Ea, AX + 5 * SC, AY2 - 52, '5 N  +  5 N', { size: 28, weight: 700, anchor: 'middle', fill: C.good });
  const scaleE = G(Ea);
  T(scaleE, 950, 682, 'scale', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
  fmScaleBar(scaleE, 968, 676, 1, { scale: SC, text: '1 N' });

  /* ================= F. contact and non-contact forces ================= */
  const F = G(root);
  const famL = G(F), famR = G(F);
  card(famL, 36, 116, 548, 604, { fill: C.card, stroke: C.line });
  card(famR, 616, 116, 548, 604, { fill: C.card, stroke: C.line });
  T(famL, 310, 168, 'Contact forces', { size: 38, weight: 700, anchor: 'middle' });
  const subL = T(famL, 310, 206, 'act only when objects touch', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  T(famR, 890, 168, 'Non-contact forces', { size: 38, weight: 700, anchor: 'middle' });
  const subR = T(famR, 890, 206, 'act at a distance', { size: 27, weight: 500, anchor: 'middle', fill: C.muted });
  const cell = (parent, x, y, w, h, label, color, size) => {
    E('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, fill: 'rgba(10,27,39,0.45)' }, parent);   // the empty slot shows from the start
    const g = G(parent);
    const art = G(g, { 'clip-path': clipRect(x - w / 2, y - h / 2, w, h, 14) });
    T(g, x, y + h / 2 - 20, label, { size: size || 28, weight: 700, anchor: 'middle', fill: color });
    return { g, art };
  };
  // contact: friction, air resistance, tension, normal force
  const cFr = cell(famL, 178, 344, 250, 228, 'friction', FM.col.friction);
  fmFloor(cFr.art, 58, 300, 380);
  const frCrate = fmCrate(cFr.art, 96, 76);
  const frArrow = fmArrow(cFr.art, 'friction', 0, 0, 1.5, 'left', { scale: SC, label: '', value: false });
  const frMove = arrow(cFr.art, 0, 0, 60, 0, { color: C.muted, width: 4 });
  const cAir = cell(famL, 442, 344, 250, 228, 'air resistance', FM.col.drag);
  E('line', { x1: 318, x2: 566, y1: 392, y2: 392, stroke: '#8FA3B3', 'stroke-width': 4 }, cAir.art);
  const airDash = E('line', { x1: 318, x2: 566, y1: 404, y2: 404, stroke: '#8FA3B3', 'stroke-width': 3, 'stroke-dasharray': '26 34', opacity: 0.6 }, cAir.art);
  const airWind = [0, 1, 2].map(() => E('line', { stroke: C.air, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.5 }, cAir.art));
  const airBike = fmCyclist(cAir.art); tr(airBike, 480, 392, 0.58);
  const airDrag = fmArrow(cAir.art, 'drag', 480 + airBike.pt.back[0] * 0.58, 392 + airBike.pt.back[1] * 0.58, 1.7, 'left', { scale: SC, label: '', value: false });
  const cTen = cell(famL, 178, 592, 250, 228, 'tension', FM.col.tension);
  E('path', { d: 'M58,640 Q180,630 302,640 L302,656 Q180,662 58,656 Z', fill: '#DDEBF3', opacity: 0.8 }, cTen.art);
  const sled = sledgeArt(cTen.art); tr(sled, 128, 640);
  ropeLine(cTen.art, 180, 614, 310, 560);
  const tenArrow = fmArrow(cTen.art, 'tension', 180, 614, 2, -22.5, { scale: SC, label: '', value: false });
  const cNor = cell(famL, 442, 592, 250, 228, 'normal force', FM.col.normal);
  tr(tableArt(cNor.art, 170, 40), 442, 612);
  tr(bookArt(cNor.art, 96, 26), 442, 612);
  const norArrow = fmArrow(cNor.art, 'normal', 442, 612, 2, 'up', { scale: SC, label: '', value: false });
  // non-contact: gravity, magnetism, electrostatic, in three tall columns
  const cGr = cell(famR, 712, 466, 172, 480, 'gravity', FM.col.weight);
  E('path', { d: 'M632,250 Q700,256 770,264', fill: 'none', stroke: '#6B4423', 'stroke-width': 9, 'stroke-linecap': 'round' }, cGr.art);
  E('path', { d: ellipsesD([[660, 256, 20, 9, -15], [704, 262, 20, 9, 18], [744, 268, 20, 9, -8]]), fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, cGr.art);
  E('line', { x1: 630, x2: 796, y1: 640, y2: 640, stroke: '#78C27C', 'stroke-width': 5 }, cGr.art);
  const grGap = gapDash(cGr.art, 760, 320, 760, 636);
  const grApple = appleArt(cGr.art, 0.8);
  const grArrow = fmArrow(cGr.art, 'weight', 0, 0, 1, 'down', { scale: SC, label: '', value: false });   // an apple: about 1 N
  const cMag = cell(famR, 890, 466, 172, 480, 'magnetism', FM.col.magnetic);
  const magR = magnetRig(cMag.art); tr(magR, 880, 620);
  const magArrow = fmArrow(cMag.art, 'magnetic', 880, 350, 0.85, 'up', { scale: SC, label: '', value: false });
  const cEl = cell(famR, 1068, 466, 172, 480, 'electrostatic', FM.col.electrostatic, 26);
  const balEl = balloonArt(cEl.art, 0.9); tr(balEl, 1068, 392);
  const headEl = hairHead(cEl.art); tr(headEl, 1068, 590);
  const elArrows = [0, 1].map(() => fmArrow(cEl.art, 'electrostatic', 0, 0, 0.75, 'up', { scale: SC, label: '', value: false }));
  gapDash(cEl.art, 1124, 452, 1124, 512);

  /* ================= update ================= */
  return t => {
    const tA1 = at('does') - 0.1, tB0 = at('does') - 0.2, tB1 = at('newtons') - 0.1, tC0 = at('newtons') - 0.2, tC1 = at('meter') - 0.1;
    const tD0 = at('meter') - 0.2, tD1 = at('arrow') - 0.1, tE0 = at('arrow') - 0.2, tE1 = at('contact') - 0.1, tF0 = at('contact') - 0.2;
    const aA = 1 - P(t, tA1, 0.4, linear), aB = beat(t, tB0, tB1 + 0.4), aC = beat(t, tC0, tC1 + 0.4), aD = beat(t, tD0, tD1 + 0.4), aE = beat(t, tE0, tE1 + 0.4), aF = P(t, tF0, 0.45, linear);
    op(A, aA); op(B, aB); op(Cn, aC); op(D, aD); op(Ea, aE); op(F, aF);

    /* --- A: push, pull, invisible forces --- */
    if (aA > 0) {
      const hIn = P(t, at('push') - 0.1, 0.55, easeOut);
      tr(handA, 505 - 150 * (1 - hIn), 524); op(handA, clamp(hIn * 3));
      pushA.set(P(t, mid('push', 0.35), 0.45));
      const rIn = P(t, mid('push', 0.5), 0.4, easeOut);
      op(ropeA, rIn); op(fistA, rIn); tr(fistA, 920 + 60 * (1 - rIn), 540);
      pullA.set(P(t, mid('push', 0.6), 0.45));
      const fade = P(t, at('see') + 0.1, 0.6, linear);
      op(pushA, 1 - fade); op(pullA, 1 - fade);
      op(ghosts, fade * (1 - P(t, mid('see', 0.6), 0.5, linear)));
      qs.forEach((q, i) => { const p = P(t, at('see') + 0.35 + i * 0.15, 0.4, pop); op(q, clamp(p * 2) * (1 - P(t, mid('see', 0.6), 0.5, linear))); tr(q, 0, (1 - clamp(p)) * 10); });
      const dx = 150 * P(t, mid('see', 0.52), 1.8, ease);
      tr(rig, dx, 0);
      op(motion, P(t, mid('see', 0.56), 0.4, linear)); moveArrow.set(P(t, mid('see', 0.56), 0.6));
      op(moveTxt, P(t, mid('see', 0.62), 0.4, linear));
      // the lens looks at the forces (nothing to see), then at the crate (it moves)
      const lp = P(t, at('see') + 0.3, 0.8), lq = P(t, mid('see', 0.5), 0.9);
      const lx = lerp(lerp(435, 765, P(t, at('see') + 1.0, 0.6)), 600 + dx, lq), ly = lerp(478, 500, lq);
      tr(lens, lx + (1 - lp) * 140, ly + (1 - lp) * 160 + Math.sin(t * 2.3) * 4 * calm);
      op(lens, P(t, at('see') + 0.25, 0.4, linear) * (1 - P(t, end('see') + 0.1, 0.4, linear)));
      op(seeTxt, win(t, at('see') + 0.2, mid('see', 0.5), 0.35));
      op(doesTxt, P(t, mid('see', 0.53), 0.4, linear));
    }

    /* --- B: five panels, then S S S D S --- */
    if (aB > 0) {
      const showAt = [0.2, 0.36, 0.52, 0.68, 0.86].map(f => mid('does', f));
      panels.forEach((p, i) => {
        const pf = P(t, at('does') - 0.1 + i * 0.08, 0.5, pop);
        op(p.g, clamp(pf * 2)); tr(p.g, p.x, PY + (1 - clamp(pf)) * 20, 0.9 + 0.1 * pf);
        op(p.inner, P(t, showAt[i] - 0.15, 0.4, linear));
        op(p.name, P(t, showAt[i], 0.4, linear) * (1 - P(t, mid('sssds', 0.5), 0.4, linear)));
        const lit = [0.27, 0.32, 0.37, 0.41, 0.45][i], wd = [0.54, 0.62, 0.71, 0.8, 0.9][i];
        const lp = P(t, mid('sssds', lit), 0.35, pop);
        op(p.letter, clamp(lp * 2)); p.letter.setAttribute('fill', P(t, mid('sssds', lit), 0.2, linear) > 0.5 ? C.energy : C.faint);
        p.letter.setAttribute('transform', `translate(${p.x} 532) scale(${(0.6 + 0.4 * lp).toFixed(3)}) translate(${-p.x} -532)`);
        op(p.word, P(t, mid('sssds', wd), 0.35, linear));
      });
      // 1. a ball starts to roll
      {
        const q = loop(t, showAt[0] - 0.3, 2.8);
        const roll = P(q, 0.22, 0.62, u => Math.pow(u, 1.7)), x = -50 + 196 * roll;
        tr(ball1, x, 42); ball1s.setAttribute('transform', `rotate(${(196 * roll / 28 * 180 / Math.PI).toFixed(1)})`);
        op(ball1, Math.min(1, (1 - q) * 12, q * 20 + (q < 0.02 ? 1 : 0)));
        kick1.move(x - 28, 42); kick1.set(P(q, 0.1, 0.12)); op(kick1, 1 - P(q, 0.32, 0.1, linear));
      }
      // 2. a car speeds up
      {
        const u = loop(t, showAt[1] - 0.3, 3.0);
        // the car stays in the panel, its driving force always in view, while the road rushes past faster and faster
        const d = 306 * (0.15 * u + 0.85 * u * u), v = (0.15 + 1.7 * u) / 1.85, CX2 = -10, CS2 = 0.4;   // 306 = 9 dash periods: no jump as it loops
        tr(car2, CX2, 70, CS2); car2.roll(d / CS2);
        drive2.move(CX2 + 136 * CS2, 70 - 50 * CS2); drive2.set(1);
        attr(dash2, 'stroke-dashoffset', (d % 34).toFixed(1));
        car2Lines.forEach((l, k) => { const y = 70 - 14 - k * 12, x2 = CX2 - 136 * CS2 - 6, L = 8 + 26 * v * (1 - k * 0.2); attr(l, 'x1', x2 - L); attr(l, 'x2', x2); attr(l, 'y1', y); attr(l, 'y2', y); l.style.opacity = (0.25 + 0.5 * v).toFixed(2); });
      }
      // 3. a bike slows down
      {
        const q = loop(t, showAt[2] - 0.3, 3.2), u = clamp(q / 0.72);
        const x = -175 + 200 * (1 - (1 - u) * (1 - u));
        tr(bike3, x, 70, 0.58); bike3.roll((x + 175) / 0.58);
        brake3.move(x - 58 * 0.58, 70); brake3.set(1); op(brake3, u < 0.97 ? 1 : 0);
        op(bike3, Math.min(1, (1 - q) * 10));
      }
      // 4. a ball bounces off a bat
      {
        const q = loop(t, showAt[3] - 0.3, 2.4);
        let x, y;
        if (q < 0.45) { const u = q / 0.45; x = lerp(96, -17, u); y = lerp(-74, 4, u); }
        else { const u = (q - 0.45) / 0.45; x = lerp(-17, 96, u); y = lerp(4, 56, u); }
        tr(ball4, x, y); op(ball4, Math.min(1, (1 - q) * 10, q * 12 + (q < 0.01 ? 1 : 0)));
        const sw = Math.sin(Math.PI * clamp((q - 0.38) / 0.2));
        tr(bat4, -52, 0, 1, -6 + 10 * sw);
        hit4.move(-17, 4, -7); hit4.set(1); op(hit4, win(q, 0.44, 0.66, 0.05));
      }
      // 5. a hand squashes a sponge
      {
        const q = loop(t, showAt[4] - 0.3, 2.6);
        const sq = Math.min(P(q, 0.22, 0.2), 1 - P(q, 0.66, 0.18));
        const top = 70 - 52 * 1.2 * (1 - 0.45 * sq);
        sponge5.setAttribute('transform', `translate(0 70) scale(${(1.2 * (1 + 0.16 * sq)).toFixed(3)} ${(1.2 * (1 - 0.45 * sq)).toFixed(3)})`);
        tr(hand5, 0, lerp(-130, top, Math.min(P(q, 0.04, 0.2), 1 - P(q, 0.7, 0.22))));
        press5.move(56, top - 2); press5.set(1); op(press5, sq > 0.05 ? sq : 0);
      }
    }

    /* --- C: newtons --- */
    if (aC > 0) {
      const pn = P(t, at('newtons') + 0.2, 0.6, pop);
      op(bigN, clamp(pn * 2));
      const pulse = 1 + 0.1 * Math.sin(Math.PI * P(t, mid('newtons', 0.48), 0.6, linear));
      bigN.setAttribute('transform', `translate(330 400) scale(${((0.7 + 0.3 * pn) * pulse).toFixed(3)}) translate(-330 -400)`);
      op(nWord, P(t, mid('newtons', 0.12), 0.5, linear));
      const pb = P(t, mid('newtons', 0.62), 0.6, easeOut);
      op(newtonG, pb); tr(newtonG, 850 + (1 - pb) * 40, 600);
      op(tree, pb); op(grassN, pb); op(newtonName, P(t, mid('newtons', 0.82), 0.5, linear));
      const fall = P(t, mid('newtons', 0.74), 0.7, easeIn), bounce = Math.sin(Math.PI * P(t, mid('newtons', 0.74) + 0.7, 0.35, linear)) * 14;
      tr(appleN, 1000, lerp(214, 572, fall) - bounce, 0.9, 20 * fall);
      op(appleN, pb);
    }

    /* --- D: the newtonmeter --- */
    if (aD > 0) {
      const pm = P(t, at('meter') - 0.1, 0.6, easeOut);
      op(nm1, pm); tr(nm1, NM1, NMY - (1 - pm) * 20, NMS);
      op(nmTitle, P(t, mid('meter', 0.18), 0.4, linear)); op(nmSub, P(t, mid('meter', 0.55), 0.4, linear)); op(nmSub2, P(t, mid('meter', 0.62), 0.4, linear));
      // the apple is hooked on: the reading settles at 1 N with a little bounce
      const tHook1 = mid('meter', 0.7), tHook2 = mid('apple', 0.62);
      const r1 = t < tHook1 ? 0 : 1 - Math.exp(-(t - tHook1) * 5) * Math.cos((t - tHook1) * 11);
      nm1.set(clamp(r1, 0, 1.25));
      const hy1 = NMY + nm1.hook()[1] * NMS;
      const carry1 = P(t, mid('meter', 0.25), tHook1 - mid('meter', 0.25), ease);
      const aHung = t >= tHook1, ax = aHung ? NM1 : lerp(860, NM1, carry1), ay = aHung ? hy1 + 72 : lerp(640, hy1 + 72, carry1);
      tr(appleD, ax, ay); op(appleD, P(t, mid('meter', 0.2), 0.3, linear));
      const away1 = P(t, tHook1 + 0.1, 0.7, ease);
      // a 1 kg bag of sugar on the second newtonmeter: 10 N
      const pm2 = P(t, mid('apple', 0.3), 0.6, easeOut);
      op(nm2, pm2); tr(nm2, NM2, NMY - (1 - pm2) * 20, NMS);
      const r2 = t < tHook2 ? 0 : 10 * (1 - Math.exp(-(t - tHook2) * 4.2) * Math.cos((t - tHook2) * 8));
      nm2.set(clamp(r2, 0, 10));
      const hy2 = NMY + nm2.hook()[1] * NMS;
      const carry2 = P(t, mid('apple', 0.36), tHook2 - mid('apple', 0.36), ease);
      const bHung = t >= tHook2, bx = bHung ? NM2 : lerp(1100, NM2, carry2), by = bHung ? hy2 - 4 : lerp(700, hy2 - 4, carry2);
      tr(bagD, bx, by); op(bagD, P(t, mid('apple', 0.36), 0.3, linear));
      const away2 = P(t, tHook2 + 0.1, 0.7, ease);
      if (t < mid('apple', 0.3)) {
        tr(handD, ax + 22 + away1 * 260, ay - 66 + away1 * 220);
        op(handD, P(t, mid('meter', 0.2), 0.3, linear) * (1 - P(t, tHook1 + 0.4, 0.4, linear)));
      } else {
        tr(handD, bx + 24 + away2 * 200, by + 6 + away2 * 200);
        op(handD, P(t, mid('apple', 0.36), 0.3, linear) * (1 - P(t, tHook2 + 0.4, 0.4, linear)));
      }
      const ep = P(t, mid('apple', 0.88), 0.5, pop); op(earthChip, clamp(ep * 2)); tr(earthChip, 250, 560 + (1 - clamp(ep)) * 14);
    }

    /* --- E: arrows --- */
    if (aE > 0) {
      arrowE.set(P(t, mid('arrow', 0.08), 0.8)); op(arrowE, 1 - P(t, at('longer') - 0.2, 0.3, linear));
      op(sizeDim, win(t, mid('arrow', 0.12), at('longer') - 0.1, 0.4));
      const hd = P(t, mid('arrow', 0.28), 0.5, pop); op(headTxt, clamp(hd * 2) * (1 - P(t, at('longer') - 0.2, 0.3, linear))); tr(headTxt, (1 - clamp(hd)) * -16, 0);
      op(tailDot, win(t, mid('arrow', 0.74), at('longer') - 0.1, 0.4));
      // longer = bigger: 5 N on the top crate, 10 N on the bottom one, then the 5 N arrow fits in twice
      const sh = P(t, at('longer') - 0.1, 0.6, linear);
      op(shelf, sh); op(crate1G, sh);
      arrow10.set(1); op(arrow10, P(t, at('longer') - 0.2, 0.3, linear));
      arrow5.set(P(t, mid('longer', 0.2), 0.6));
      [P(t, mid('longer', 0.64), 0.7), P(t, mid('longer', 0.78), 0.7)].forEach((c, k) => {
        const cp = copies[k];
        cp.move(lerp(AX, AX + k * 5 * SC, c), lerp(AY1, AY2 - 30, c)); cp.set(1);
        op(cp, c > 0 ? 0.85 * Math.min(1, c * 4) : 0);
      });
      op(plus, P(t, mid('longer', 0.86), 0.4, linear));
      const tw = P(t, mid('longer', 0.9), 0.5, pop); op(twice, clamp(tw * 2)); tr(twice, 990, 470, 0.85 + 0.15 * tw);
      op(scaleE, P(t, mid('longer', 0.3), 0.5, linear));
    }

    /* --- F: contact and non-contact --- */
    if (aF > 0) {
      const dimL = 1 - 0.45 * win(t, at('noncontact') + 0.1, end('noncontact') - 0.6, 0.5);
      const pl = P(t, mid('contact', 0.06), 0.5, pop), pr = P(t, mid('contact', 0.12), 0.5, pop);
      op(famL, clamp(pl * 2) * dimL); tr(famL, 0, (1 - clamp(pl)) * 20);
      op(famR, clamp(pr * 2) * lerp(0.45, 1, P(t, at('noncontact') - 0.2, 0.4, linear))); tr(famR, 0, (1 - clamp(pr)) * 20);
      op(subL, P(t, mid('contact', 0.25), 0.4, linear)); op(subR, P(t, at('noncontact') + 0.3, 0.4, linear));
      [0.55, 0.63, 0.74, 0.83].forEach((f, i) => op([cFr, cAir, cTen, cNor][i].g, clamp(P(t, mid('contact', f), 0.5, pop) * 2)));
      [0.38, 0.47, 0.6].forEach((f, i) => op([cGr, cMag, cEl][i].g, clamp(P(t, mid('noncontact', f), 0.5, pop) * 2)));
      // friction: the crate slides and slows to a stop, again and again (timed to be mid-slide on the last frame)
      {
        const t0 = mid('contact', 0.55), per = (S.D - t0) / 4.35, q = loop(t, t0, per), u = clamp(q / 0.7), x = 120 + 110 * (1 - (1 - u) * (1 - u));
        const vis = Math.min(1, (1 - q) * 10, q * 30 + (t < t0 ? 1 : 0)), moving = u < 0.98 ? 1 : 0;
        frCrate.at(x, 380); op(frCrate, vis);
        frArrow.move(x - 48, 380); frArrow.set(1); op(frArrow, moving * vis);
        frMove.setAttribute('transform', `translate(${(x - 30).toFixed(1)} 288)`); op(frMove, 0.9 * moving * vis);
      }
      // air resistance: the road rushes past
      {
        const s = t * 160 * calm;
        attr(airDash, 'stroke-dashoffset', s % 60);
        airBike.roll(s / 0.58); airDrag.set(1);
        airWind.forEach((l, k) => { const y = [256, 280, 364][k], x = 566 - ((t * 220 * calm + k * 90) % 280); attr(l, 'x1', x); attr(l, 'x2', x + 34); attr(l, 'y1', y); attr(l, 'y2', y); });
      }
      tenArrow.set(1); norArrow.set(1);
      // gravity: the apple drops, over and over; its weight acts all the time (mid-fall on the last frame)
      {
        const t0 = mid('noncontact', 0.38), per = (S.D - t0) / 2.64, q = loop(t, t0, per), f = P(q, 0.2, 0.55, easeIn), y = lerp(298, 614, f);
        const vis = Math.min(1, (1 - q) * 10, q * 40 + (t < t0 ? 1 : 0));
        tr(grApple, 712, y); op(grApple, vis);
        grArrow.move(712, y + 2); grArrow.set(1); op(grArrow, vis);
        attr(grGap, 'y1', y + 26); op(grGap, f < 0.95 ? 0.9 * vis : 0);
      }
      // magnetism: the clip floats under the magnet, held by its thread
      {
        const sway = Math.sin(t * 1.7) * 3 * calm;
        magR.set(sway); magArrow.move(880 + sway, 350); magArrow.set(1);
      }
      // electrostatic: the hair reaches up towards the balloon
      {
        const lift = 0.8 + 0.12 * Math.sin(t * 1.3) * calm;
        headEl.set(lift, 0, -190);
        elArrows.forEach((a, k) => { a.move(1058 + k * 20, 520 - k * 2, 'up'); a.set(1); });
      }
    }
  };
});

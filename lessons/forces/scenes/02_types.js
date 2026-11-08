/* Chapter 2, Types of force.
   A gallery of eight frames, one per force; each zooms to the middle while it is described, then docks back:
   weight (an apple, an arrow to the Earth's centre), friction (a crate sliding on a rough floor), drag (a cyclist
   speeding up), upthrust (a floating swimmer), tension (a hanging lamp), the normal force (a book on a table,
   feet on the floor), magnetic (a floating paperclip), electrostatic (a rubbed balloon and hair). The colour key
   builds along the bottom. Showpiece: the frames turn into chips that fly into two bins, non-contact and contact. */
scene('types', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const SC = FM.scale;                              // 4 px per newton: every force arrow in this scene
  const loop = (t, t0, period) => { const u = (t - t0) / period; return u <= 0 ? 0 : u - Math.floor(u); };
  let nClip = 0;
  function clipRect(x, y, w, h, rx) { const id = 'fbTypesClip' + (++nClip); const cp = E('clipPath', { id }, defs()); E('rect', { x, y, width: w, height: h, rx: rx || 0 }, cp); return `url(#${id})`; }
  const circlesD = list => list.map(([x, y, r]) => `M${x - r},${y} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0`).join(' ');

  /* ---------- art (drawn as in the What a force is chapter) ---------- */
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
  function paperclip(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: 'M-12,-3 L20,-3 A5,5 0 0 1 20,7 L-22,7 A9,9 0 0 1 -22,-11 L26,-11 A9,9 0 0 1 26,7 L4,7', fill: 'none', stroke: '#DCE6EE', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, k);
    return g;
  }
  function balloonArt(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('ellipse', { rx: 44, ry: 54, fill: ball('#FF9A57', '#C25516'), stroke: '#FFC59A', 'stroke-width': 2.5 }, k);
    E('path', { d: 'M-7,60 L7,60 L3,53 L-3,53 Z', fill: '#C25516' }, k);
    E('path', { d: [[-20, -14], [8, -28], [22, 6], [-14, 24], [10, 34], [-2, 4]].map(([x, y]) => `M${x - 6},${y} L${x + 6},${y}`).join(' '), stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, k);
    return g;
  }
  /* a head of hair, centred; g.set(lift 0..1, tx, ty) stands the strands up towards (tx, ty); g.tip(i) is a strand's tip */
  function hairHead(parent) {
    const g = G(parent);
    E('circle', { r: 40, fill: ball('#E8B48E', '#B9825A'), stroke: '#F7D9C2', 'stroke-width': 2 }, g);
    E('path', { d: 'M-39,-6 Q-36,-40 0,-41 Q36,-40 39,-6 Q20,-26 0,-26 Q-20,-26 -39,-6 Z', fill: '#6B4423' }, g);
    E('path', { d: circlesD([[-13, 4, 4], [13, 4, 4]]), fill: '#2A1D14' }, g);
    E('path', { d: 'M-9,20 Q0,25 9,20', fill: 'none', stroke: '#7A4A30', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    const st = [], tips = [];
    for (let i = 0; i < 9; i++) st.push({ el: E('path', { fill: 'none', stroke: '#6B4423', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g), a: -Math.PI / 2 + (i - 4) * 0.26 });
    const plus = E('path', { stroke: '#FFE29A', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.plus = plus;
    g.set = (lift, tx, ty) => {
      st.forEach((s, i) => {
        const bx = Math.cos(s.a) * 34, by = Math.sin(s.a) * 34;
        const fa = s.a + (i < 4 ? -0.55 : 0.55), fx = Math.cos(fa) * 44, fy = Math.sin(fa) * 44 + 6;
        const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy) || 1, ux = bx + dx / L * 46, uy = by + dy / L * 46;
        const ex = lerp(fx, ux, lift), ey = lerp(fy, uy, lift);
        tips[i] = [ex, ey];
        s.el.setAttribute('d', `M${bx.toFixed(1)},${by.toFixed(1)} Q${lerp(bx * 1.2, (bx + ex) / 2, lift).toFixed(1)},${lerp(by * 1.25, (by + ey) / 2, lift).toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`);
      });
      const p1 = tips[0], p2 = tips[8];
      plus.setAttribute('d', [[p1[0] - 12, p1[1] + 14], [p2[0] + 12, p2[1] + 14]].map(([x, y]) => `M${(x - 6).toFixed(1)},${y.toFixed(1)} L${(x + 6).toFixed(1)},${y.toFixed(1)} M${x.toFixed(1)},${(y - 6).toFixed(1)} L${x.toFixed(1)},${(y + 6).toFixed(1)}`).join(' '));
      op(plus, lift);
    };
    g.tip = i => tips[i];
    g.set(0, 0, -200);
    return g;
  }
  function bookArt(parent, w, h) {
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 3, fill: '#8A3B2E', stroke: '#5E2219', 'stroke-width': 2 }, g);
    E('rect', { x: -w / 2 + 7, y: -h + 5, width: w - 11, height: h - 10, fill: '#F2E9D8' }, g);
    return g;
  }
  function tableArt(parent, w, legH) {
    const g = G(parent), [mid_, dk, lt] = FM.wood;
    E('path', { d: `M${-w / 2 + 15},10 L${-w / 2 + 15},${10 + legH} M${w / 2 - 15},10 L${w / 2 - 15},${10 + legH}`, stroke: dk, 'stroke-width': 10 }, g);
    E('rect', { x: -w / 2, y: 0, width: w, height: 13, rx: 3, fill: linGrad(lt, mid_, true), stroke: dk, 'stroke-width': 2 }, g);
    return g;
  }
  const dashLine = (parent, x1, y1, x2, y2, color) => E('line', { x1, y1, x2, y2, stroke: color || C.muted, 'stroke-width': 3, 'stroke-dasharray': '7 7', 'stroke-linecap': 'round' }, parent);

  /* ================= the gallery ================= */
  const FW = 272, FH = 252, FOCUS = [600, 372], FS = 1.7;
  const SLOT = [[168, 236], [456, 236], [744, 236], [1032, 236], [168, 504], [456, 504], [744, 504], [1032, 504]];
  const KINDS = ['weight', 'friction', 'drag', 'upthrust', 'tension', 'normal', 'magnetic', 'electrostatic'];
  const NAMES = ['weight', 'friction', 'drag', 'upthrust', 'tension', 'normal force', 'magnetic', 'electrostatic'];
  const PUSH = [false, true, true, true, false, true, false, false];        // the blank frame's icon
  const LINE = ['weight', 'friction', 'drag', 'upthrust', 'tension', 'normal', 'charges', 'charges'];
  // when each frame is in the middle: [grow from, dock from]
  const FOC = LINE.map((l, i) => i < 6 ? [at(l) - 0.15, end(l) + 0.2] : i === 6 ? [at('charges') - 0.15, mid('charges', 0.6)] : [mid('charges', 0.6), end('charges') + 0.1]);
  const galleryG = G(root);
  const frames = KINDS.map((k, i) => {
    const g = G(galleryG), col = FM.col[k];
    const blank = E('rect', { x: -FW / 2, y: -FH / 2, width: FW, height: FH, rx: 18, fill: C.card, stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, g);
    const full = E('rect', { x: -FW / 2, y: -FH / 2, width: FW, height: FH, rx: 18, fill: C.card, stroke: col, 'stroke-width': 3 }, g);
    const art = G(g, { 'clip-path': clipRect(-FW / 2 + 2, -FH / 2 + 2, FW - 4, FH - 4, 16) });
    const name = T(g, -FW / 2 + 18, -FH / 2 + 38, NAMES[i], { size: 30, weight: 700, fill: col });
    const q = T(g, -FW / 2 + 18, -FH / 2 + 38, '?', { size: 30, weight: 700, fill: C.faint });
    const icon = G(g);
    const box = G(icon); tr(box, PUSH[i] ? 20 : -20, 4);
    E('rect', { x: -22, y: -20, width: 44, height: 38, rx: 6, fill: FM.wood[0], stroke: FM.wood[1], 'stroke-width': 3 }, box);
    const ia = PUSH[i] ? fmArrow(box, 'push', -22, -1, 12, 'right', { tip: true, scale: SC, label: '', value: false }) : fmArrow(box, 'pull', 22, -1, 12, 'right', { scale: SC, label: '', value: false });
    const word = T(icon, 0, 62, PUSH[i] ? 'a push' : 'a pull', { size: 28, weight: 600, fill: C.muted, anchor: 'middle' });
    return { g, blank, full, art, name, q, icon, ia, word, kind: k, col, i, x: SLOT[i][0], y: SLOT[i][1], tIn: FOC[i][0], tOut: FOC[i][1], hold: FOC[i][1] + 0.6 };
  });
  const FR = {}; frames.forEach(f => { FR[f.kind] = f; });

  /* --- weight: straight down, towards the centre of the Earth --- */
  {
    const a = FR.weight.art;
    const earth = earthArt(a, 38); tr(earth, -46, 84);
    const dash = dashLine(a, -46, 18, -46, 84, FM.col.weight);
    const dot = E('circle', { cx: -46, cy: 84, r: 6, fill: '#FFFFFF', stroke: C.bg0, 'stroke-width': 2 }, a);
    const ap = appleArt(a, 0.8); tr(ap, -46, -40);
    const w = fmArrow(a, 'weight', -46, -38, 14, 'down', { scale: SC, label: '', value: false });
    const cen = T(a, 4, 80, 'centre of\nthe Earth', { size: 24, weight: 600, fill: C.muted, lh: 27 });
    const tag = T(a, FW / 2 - 16, -FH / 2 + 37, 'non-contact', { size: 24, weight: 700, fill: C.muted, anchor: 'end' });
    FR.weight.upd = t => {
      w.set(P(t, mid('weight', 0.1), 0.6));
      const dp = P(t, mid('weight', 0.56), 0.9);
      attr(dash, 'y2', lerp(18, 84, dp)); op(dash, dp > 0.01 ? 1 : 0);
      op(dot, P(t, mid('weight', 0.66), 0.3, linear)); op(cen, P(t, mid('weight', 0.66), 0.4, linear));
      op(tag, P(t, mid('weight', 0.87), 0.4, linear));
    };
  }
  /* --- friction: a crate slides on a rough floor and slows down --- */
  {
    const f = FR.friction, a = f.art;
    fmFloor(a, -140, 140, 66, { rough: true, seed: 9 });
    const cr = fmCrate(a, 92, 72);
    const shove = fmArrow(a, 'push', 0, 0, 12, 'right', { tip: true, scale: SC, label: '', value: false });
    const fa = fmArrow(a, 'friction', 0, 0, 12, 'left', { scale: SC, label: '', value: false });
    const mv = G(a); arrow(mv, 0, 0, 58, 0, { color: C.muted, width: 4 }); T(mv, 29, -12, 'motion', { size: 24, weight: 600, fill: C.muted, anchor: 'middle' });
    const note = T(a, 0, 112, 'opposes the motion', { size: 26, weight: 700, fill: FM.col.friction, anchor: 'middle' });
    const t0 = mid('friction', 0.04), per = (f.hold - t0) / 2.4;          // frozen mid-slide once docked
    f.upd = t => {
      const q = loop(Math.min(t, f.hold), t0, per), u = clamp((q - 0.08) / 0.6), x = -78 + 120 * (1 - (1 - u) * (1 - u));
      const vis = Math.min(1, (1 - q) * 12, q * 40 + (t < t0 ? 1 : 0)), sliding = u > 0 && u < 0.97 ? 1 : 0;
      cr.at(x, 66); op(cr, vis);
      shove.move(x - 46, 30); shove.set(1); op(shove, win(q, 0.0, 0.14, 0.04) * vis);
      fa.move(x - 46, 66); fa.set(1); op(fa, sliding * vis);
      tr(mv, x - 28, -20); op(mv, sliding * vis * 0.95);
      op(note, P(t, mid('friction', 0.76), 0.4, linear));
    };
  }
  /* --- drag: a cyclist speeds up, and the drag grows --- */
  {
    const f = FR.drag, a = f.art;
    E('line', { x1: -140, x2: 140, y1: 62, y2: 62, stroke: '#8FA3B3', 'stroke-width': 4 }, a);
    const road = E('line', { x1: -140, x2: 140, y1: 74, y2: 74, stroke: '#8FA3B3', 'stroke-width': 3, 'stroke-dasharray': '24 30', opacity: 0.6 }, a);
    const wind = [0, 1, 2].map(() => E('line', { stroke: C.air, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55 }, a));
    const cy = fmCyclist(a); tr(cy, 26, 62, 0.6);
    const back = [26 + cy.pt.back[0] * 0.6, 62 + cy.pt.back[1] * 0.6];
    const dr = fmArrow(a, 'drag', back[0], back[1], 4, 'left', { scale: SC, label: '', value: false });
    const gauge = meter(a, { w: 130, h: 16, color: C.energy }); tr(gauge, -10, 88);
    T(a, -20, 102, 'speed', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
    const fluid = T(a, FW / 2 - 16, -FH / 2 + 37, 'air or water', { size: 24, weight: 600, fill: C.muted, anchor: 'end' });
    const vAt = t => 0.22 + 0.78 * P(t, mid('drag', 0.6), end('drag') - mid('drag', 0.6), ease);
    // distance travelled = the integral of the speed (sampled), so the road and pedals keep pace with the gauge
    const T0 = at('drag') - 0.3, distAt = t => { const tt = Math.min(t, f.hold); if (tt <= T0) return 0; let d = 0; const n = 24, h = (tt - T0) / n; for (let k = 0; k < n; k++) d += vAt(T0 + (k + 0.5) * h) * h; return d * 260; };
    f.upd = t => {
      const tt = Math.min(t, f.hold), v = vAt(tt), d = distAt(t);
      dr.set(P(t, at('drag') + 0.2, 0.5), 4 + 14 * v * v);
      gauge.set(v);
      cy.roll(d / 0.6); attr(road, 'stroke-dashoffset', d % 54);
      wind.forEach((l, k) => { const y = [-64, -28, 34][k], x = 140 - ((d * 1.6 + k * 97) % 300); attr(l, 'x1', x); attr(l, 'x2', x + 18 + 30 * v); attr(l, 'y1', y); attr(l, 'y2', y); });
      op(fluid, P(t, mid('drag', 0.42), 0.4, linear));
    };
  }
  /* --- upthrust: a swimmer floats; weight and upthrust are equal --- */
  {
    const f = FR.upthrust, a = f.art;
    E('rect', { x: -140, y: -4, width: 280, height: 140, fill: 'rgba(76,201,240,0.10)' }, a);
    const sw = person(a, { shirt: '#E07A3E', shorts: '#2C5468' });
    sw.pose({ lean: 0, armL: [100, 30], armR: [-12, 4], legL: [4, 0], legR: [-4, 0] });
    const water = E('path', { fill: 'rgba(76,201,240,0.22)', stroke: C.water, 'stroke-width': 3 }, a);
    const up = fmArrow(a, 'upthrust', 0, 0, 12, 'up', { scale: SC, label: '', value: false });
    const wt = fmArrow(a, 'weight', 0, 0, 12, 'down', { scale: SC, label: 'weight', value: false, size: 26 });
    const bal = T(a, FW / 2 - 18, 112, 'balanced', { size: 26, weight: 700, fill: C.ink, anchor: 'end' });
    f.upd = t => {
      const tt = Math.min(t, f.hold), bob = Math.sin(tt * 1.6) * 3 * calm, cyy = -8 + bob;
      tr(sw, 72, cyy, 0.72, -90);
      let d = 'M-140,140 L-140,0';
      for (let x = -140; x <= 140; x += 20) d += ` L${x},${(-2 + 3 * Math.sin(x * 0.05 + tt * 2.2)).toFixed(1)}`;
      water.setAttribute('d', d + ' L140,140 Z');
      up.move(2, cyy); up.set(P(t, mid('upthrust', 0.12), 0.6));
      wt.move(2, cyy); wt.set(P(t, mid('upthrust', 0.66), 0.6));
      op(bal, P(t, mid('upthrust', 0.84), 0.4, linear));
    };
  }
  /* --- tension: a lamp hangs on a cable --- */
  {
    const f = FR.tension, a = f.art;
    E('path', { d: 'M-2,-82 L92,-82', stroke: '#8FA3B3', 'stroke-width': 6, 'stroke-linecap': 'round' }, a);
    E('path', { d: [8, 32, 56, 80].map(x => `M${x},-85 L${x + 11},-96`).join(' '), stroke: '#8FA3B3', 'stroke-width': 3, opacity: 0.6 }, a);
    const lampG = G(a);
    E('line', { x1: 0, y1: -82, x2: 0, y2: -6, stroke: '#2B3A44', 'stroke-width': 4 }, lampG);
    E('ellipse', { cx: 0, cy: 32, rx: 34, ry: 24, fill: glow(C.energyLt), opacity: 0.7 }, lampG);
    E('path', { d: 'M-13,-6 L13,-6 L34,26 L-34,26 Z', fill: ball('#7F9AAD', '#3C5566'), stroke: '#A9BDCB', 'stroke-width': 2, 'stroke-linejoin': 'round' }, lampG);
    E('circle', { cx: 0, cy: 31, r: 10, fill: C.energyLt }, lampG);
    const ten = fmArrow(a, 'tension', 0, 0, 10, 'up', { scale: SC, label: '', value: false });
    const wt = fmArrow(a, 'weight', 0, 0, 10, 'down', { scale: SC, label: 'weight', value: false, size: 26, side: 'left' });
    const ropes = T(a, -FW / 2 + 18, 86, 'rope, string,\ncable or spring', { size: 24, weight: 600, fill: C.muted, lh: 27 });
    f.upd = t => {
      const tt = Math.min(t, f.hold), sway = Math.sin(tt * 1.3) * 1.5 * calm, sr = sway * Math.PI / 180;
      lampG.setAttribute('transform', `translate(45 0) rotate(${sway.toFixed(2)} 0 -82)`);
      ten.move(45 - Math.sin(sr) * 76, -82 + Math.cos(sr) * 76, -90 + sway); ten.set(P(t, mid('tension', 0.16), 0.5));
      wt.move(45 - Math.sin(sr) * 94, -82 + Math.cos(sr) * 94); wt.set(P(t, mid('tension', 0.34), 0.5));
      op(ropes, P(t, mid('tension', 0.6), 0.5, linear));
    };
  }
  /* --- the normal force: a book on a table, then feet on the floor --- */
  {
    const f = FR.normal, a = f.art;
    tr(tableArt(a, 124, 58), -66, 40);
    tr(bookArt(a, 74, 20), -66, 40);
    const nr = fmArrow(a, 'normal', -50, 40, 10, 'up', { scale: SC, label: '', value: false });
    const wt = fmArrow(a, 'weight', -66, 30, 10, 'down', { scale: SC, label: '', value: false });
    const rt = E('path', { d: 'M-34,40 L-34,28 L-46,28', fill: 'none', stroke: C.water, 'stroke-width': 3 }, a);
    const rtTxt = T(a, -18, 2, '90°', { size: 24, weight: 700, fill: C.water });
    const kid = G(a);
    E('line', { x1: 22, x2: 140, y1: 112, y2: 112, stroke: '#8FA3B3', 'stroke-width': 4 }, kid);
    const p = person(kid, { shirt: '#56B4A0' }); tr(p, 84, 112, 0.56);
    const feet = [fmArrow(kid, 'normal', 62, 112, 8, 'up', { scale: SC, label: '', value: false }), fmArrow(kid, 'normal', 104, 112, 8, 'up', { scale: SC, label: '', value: false })];
    f.upd = t => {
      nr.set(P(t, mid('normal', 0.16), 0.5));
      op(rt, P(t, mid('normal', 0.4), 0.4, linear)); op(rtTxt, P(t, mid('normal', 0.42), 0.4, linear));
      wt.set(P(t, mid('normal', 0.6), 0.5));
      op(kid, P(t, mid('normal', 0.8), 0.4, linear));
      feet.forEach((fa, k) => fa.set(P(t, mid('normal', 0.84) + k * 0.12, 0.45)));
    };
  }
  /* --- magnetic: a paperclip floats under a magnet's pole, held down by a thread --- */
  {
    const f = FR.magnetic, a = f.art;
    const mg = magnet(a, 112, 36); tr(mg, -18, -54);
    E('rect', { x: -84, y: 100, width: 64, height: 10, rx: 4, fill: '#5F6E7B', stroke: '#8597A6', 'stroke-width': 2 }, a);
    const thread = E('line', { x1: -52, y1: 100, x2: -46, y2: 44, stroke: '#E9F2F7', 'stroke-width': 2 }, a);
    const clipG = G(a); paperclip(clipG, 0.8);
    const ma = fmArrow(a, 'magnetic', 0, 0, 6, 'up', { scale: SC, label: '', value: false });
    const gap = dashLine(a, -14, -34, -14, -6);
    const tag = T(a, FW / 2 - 16, 114, 'non-contact', { size: 24, weight: 700, fill: C.muted, anchor: 'end' });
    const mat = T(a, 4, 26, 'magnetic', { size: 24, weight: 600, fill: C.muted });
    const mat2 = T(a, 4, 52, 'material', { size: 24, weight: 600, fill: C.muted });
    f.upd = t => {
      const tt = Math.min(t, f.hold), rise = P(t, mid('charges', 0.3), 0.8, easeOut), sway = Math.sin(tt * 1.7) * 2 * calm * rise;
      const cy = lerp(80, 18, rise);                       // the clip lifts off the base towards the pole
      tr(clipG, -46 + sway, cy, 1, lerp(0, 90, rise));
      attr(thread, 'x2', -46 + sway); attr(thread, 'y2', cy + 26 * rise);
      ma.move(-46 + sway, cy - 26); ma.set(P(t, mid('charges', 0.38), 0.4)); op(ma, rise > 0.95 ? 1 : 0);
      op(gap, P(t, mid('charges', 0.44), 0.4, linear));
      op(tag, P(t, at('charges') + 0.4, 0.4, linear));
      op(mat, P(t, mid('charges', 0.5), 0.4, linear)); op(mat2, P(t, mid('charges', 0.5), 0.4, linear));
    };
  }
  /* --- electrostatic: a rubbed balloon pulls on hair --- */
  {
    const f = FR.electrostatic, a = f.art;
    const BX = 44, BY = -26, HX = -64, HY = 72, HS = 0.75;
    const bal = balloonArt(a, 0.66); tr(bal, BX, BY);
    const head = hairHead(a); tr(head, HX, HY, HS);
    const ea = [0, 1].map(() => fmArrow(a, 'electrostatic', 0, 0, 7, -45, { scale: SC, label: '', value: false }));
    const gap = dashLine(a, -2, 18, 16, 0);
    const tag = T(a, FW / 2 - 16, 114, 'non-contact', { size: 24, weight: 700, fill: C.muted, anchor: 'end' });
    f.upd = t => {
      const tt = Math.min(t, f.hold), lift = P(t, mid('charges', 0.66), 1.0, ease) * (0.92 + 0.08 * Math.sin(tt * 1.5) * calm);
      head.set(lift, (BX - HX) / HS, (BY - HY) / HS);
      [3, 5].forEach((si, k) => { const tp = head.tip(si); ea[k].move(HX + tp[0] * HS + 2, HY + tp[1] * HS - 2); ea[k].set(P(t, mid('charges', 0.74) + k * 0.1, 0.4)); op(ea[k], lift > 0.6 ? 1 : 0); });
      op(gap, P(t, mid('charges', 0.8), 0.4, linear));
      op(tag, P(t, at('charges') + 0.4, 0.4, linear));
    };
  }

  /* ================= the colour key ================= */
  const keyG = G(root);
  const KEY = [['weight', 'weight'], ['friction', 'friction\ndrag'], ['upthrust', 'upthrust\nnormal force'], ['tension', 'tension'], ['magnetic', 'magnetic\nelectrostatic']];
  const keyOn = ['weight', 'friction', 'upthrust', 'tension', 'charges'];
  const keys = KEY.map(([k, label]) => {
    const g = G(keyG), two = label.includes('\n');
    arrow(g, 0, 0, 44, 0, { color: FM.col[k], width: 8 });
    T(g, 56, two ? -5 : 8, label, { size: 24, weight: 600, fill: C.ink, lh: 26 });
    return { g, w: 56 + Math.max(...label.split('\n').map(s => textWidth(s, 24, FD, 600))) };
  });
  { const gapK = 46, tot = keys.reduce((s, e) => s + e.w, 0) + gapK * (keys.length - 1); let x = 600 - tot / 2; keys.forEach(e => { e.x = x; tr(e.g, x, 683); x += e.w + gapK; }); }

  /* ================= the sort: two bins ================= */
  const binsG = G(root);
  const BINX = [330, 870], BIN_TITLE = ['non-contact', 'contact'];
  const bins = BINX.map((bx, b) => {
    const g = G(binsG);
    E('path', { d: `M${bx - 172},418 L${bx - 156},712 L${bx + 156},712 L${bx + 172},418`, fill: 'rgba(20,54,70,0.6)', stroke: C.line, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('line', { x1: bx - 184, x2: bx + 184, y1: 418, y2: 418, stroke: C.muted, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
    const title = T(g, bx, 396, BIN_TITLE[b], { size: 38, weight: 700, anchor: 'middle' });
    return { g, title, x: bx };
  });
  const DIRS = { weight: [0, 1], friction: [-1, 0], drag: [-1, 0], upthrust: [0, -1], tension: [0, -1], normal: [0, -1], magnetic: [1, 0], electrostatic: [1, 0] };
  const NON = ['weight', 'magnetic', 'electrostatic'];
  const SAY = { weight: 0.08, magnetic: 0.15, electrostatic: 0.23, friction: 0.45, drag: 0.555, tension: 0.61, upthrust: 0.7, normal: 0.77 };
  const order = { weight: 0, magnetic: 1, electrostatic: 2, friction: 0, drag: 1, tension: 2, upthrust: 3, normal: 4 };
  const chipG = G(root);
  const chips = frames.map(fr => {
    const g = G(chipG), k = fr.kind, w = Math.ceil(textWidth(NAMES[fr.i], 26, FD, 700)) + 92, h = 46;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: C.card2, stroke: fr.col, 'stroke-width': 3 }, g);
    const d = DIRS[k], ix = -w / 2 + 34;
    arrow(g, ix - d[0] * 14, -d[1] * 14, ix + d[0] * 14, d[1] * 14, { color: fr.col, width: 6 });
    T(g, ix + 26, 9, NAMES[fr.i], { size: 26, weight: 700, fill: C.ink });
    const bin = NON.indexOf(k) >= 0 ? 0 : 1;
    return { g, fr, bin, slot: [BINX[bin], 682 - order[k] * 54], tFly: mid('sort', SAY[k]) };
  });
  const TH = 0.46, thumb = i => [600 + ((i % 4) - 1.5) * 132, 172 + Math.floor(i / 4) * 122];

  /* ================= update ================= */
  return t => {
    const tSort = at('sort') - 0.45;
    const shrink = P(t, tSort, 0.8);
    const lift = P(t, mid('sort', 0.9), 0.8);                 // everything rises to the middle once sorted
    const focus = frames.map(fr => Math.min(P(t, fr.tIn, 0.6), 1 - P(t, fr.tOut, 0.6)));
    const F = Math.max(...focus);
    // the frame growing into the middle is drawn on top
    let cur = null; frames.forEach(fr => { if (t >= fr.tIn) cur = fr; });
    if (cur && galleryG.lastChild !== cur.g) galleryG.appendChild(cur.g);
    frames.forEach((fr, i) => {
      const pop_ = P(t, at('names') - 0.1 + i * 0.2, 0.5, pop);
      const f = focus[i], filled = P(t, fr.tIn + 0.15, 0.4, linear);
      const th = thumb(i), gone = P(t, chips[i].tFly, 0.3, linear);
      let x = lerp(fr.x, FOCUS[0], ease(f)), y = lerp(fr.y, FOCUS[1], ease(f)), s = lerp(1, FS, ease(f));
      x = lerp(x, th[0], shrink); y = lerp(y, th[1], shrink); s = lerp(s, TH, shrink) * (0.88 + 0.12 * clamp(pop_)) * (1 - 0.6 * gone);
      tr(fr.g, x, y, Math.max(0.01, s));
      op(fr.g, clamp(pop_ * 2) * (1 - 0.6 * clamp(F - f)) * (1 - gone));
      op(fr.blank, 1 - filled); op(fr.full, filled); op(fr.q, 1 - filled); op(fr.name, filled);
      op(fr.art, filled);
      op(fr.icon, 1 - filled);
      if (filled < 1) {
        const pulse = 1 + 0.18 * Math.sin(Math.PI * P(t, mid('names', PUSH[i] ? 0.76 : 0.9), 0.5, linear));
        fr.icon.setAttribute('transform', `scale(${pulse.toFixed(3)})`);
        fr.ia.set(P(t, at('names') + i * 0.2 + 0.25, 0.4));
        op(fr.word, P(t, mid('names', PUSH[i] ? 0.74 : 0.88), 0.3, linear));
      }
      if (filled > 0) fr.upd(t);
    });
    // the colour key
    op(keyG, 1 - P(t, tSort, 0.4, linear));
    keys.forEach((k, i) => { const p = P(t, at(keyOn[i]) + 0.4, 0.5, pop); op(k.g, clamp(p * 2)); tr(k.g, k.x, 683 + (1 - clamp(p)) * 12); });
    // bins, then chips fly in as each force is named
    const bIn = P(t, at('sort') - 0.1, 0.7, easeOut);
    op(binsG, bIn); tr(binsG, 0, (1 - bIn) * 40 - 100 * lift);
    bins.forEach((b, i) => { const pl = Math.sin(Math.PI * P(t, mid('sort', i ? 0.92 : 0.33), 0.5, linear)); b.title.setAttribute('transform', `translate(${b.x} 384) scale(${(1 + 0.12 * pl).toFixed(3)}) translate(${-b.x} -384)`); b.title.setAttribute('fill', pl > 0.05 ? C.energy : C.ink); });
    chips.forEach((c, i) => {
      const a0 = P(t, c.tFly, 0.25, linear), u = P(t, c.tFly + 0.1, 0.75);
      if (a0 <= 0) { op(c.g, 0); return; }
      const st = thumb(i), en = [c.slot[0], c.slot[1] - 100 * lift];
      const cx = (st[0] + en[0]) / 2, cyy = Math.min(st[1], en[1]) - 90;
      const x = (1 - u) * (1 - u) * st[0] + 2 * (1 - u) * u * cx + u * u * en[0], y = (1 - u) * (1 - u) * st[1] + 2 * (1 - u) * u * cyy + u * u * en[1];
      const land = 1 + 0.1 * Math.sin(Math.PI * P(t, c.tFly + 0.85, 0.3, linear));
      tr(c.g, x, y, (0.6 + 0.4 * a0) * land); op(c.g, a0);
    });
  };
});

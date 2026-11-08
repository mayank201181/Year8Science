/* Chapter 10, Longitudinal and transverse waves.
   Two lanes: a slinky pushed by a hand (longitudinal) above a rope flicked by a hand (transverse).
   Beats: two families (still lanes, "vibration?") -> longitudinal: a painted coil moves along the
   direction of travel; compressions and rarefactions (the pattern pauses for its labels) -> push a
   slinky, the squashes and stretches travel; sound is longitudinal -> transverse: a red ribbon moves at
   right angles -> flick a rope: crests and troughs (showpiece: coil and ribbon stay put while both waves
   run) -> light, all electromagnetic waves and water ripples are transverse -> energy moves, the
   material doesn't; vibration along or across. Each wave runs on its own clock so it can pause smoothly. */
scene('kinds', S => {
  const { at, mid } = S, root = S.root;
  const calm = S.reduce ? 0.35 : 1;
  const RED = '#FF5A64';

  /* ---------- helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const textLen = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w || el.textContent.length * 17; };
  /* time lost to a pause [a, b] whose speed ramps down over r seconds and back up over r seconds */
  function lost(t, a, b, r) {
    if (t <= a) return 0;
    if (t <= a + r) return (t - a) * (t - a) / (2 * r);
    if (t <= b) return r / 2 + (t - a - r);
    if (t <= b + r) { const u = t - b; return r / 2 + (b - a - r) + u - u * u / (2 * r); }
    return b - a;
  }
  const clock = (t, t0, pauses) => Math.max(0, t - t0) - pauses.reduce((s, p) => s + lost(t, p[0], p[1], 0.5), 0);
  /* a fist on a sleeve, holding a medium at its right edge (x = 14) */
  function hand(parent) {
    const g = G(parent);
    E('rect', { x: -200, y: -19, width: 170, height: 38, rx: 12, fill: ball('#6E9BF2', '#3D68C4') }, g);
    E('rect', { x: -40, y: -15, width: 22, height: 30, rx: 6, fill: '#C98E62' }, g);
    E('rect', { x: -26, y: -25, width: 42, height: 50, rx: 15, fill: ball('#EBB386', '#B57A52'), stroke: '#F6D3B5', 'stroke-width': 1.5 }, g);
    [-11, 1, 13].forEach(y => E('path', { d: `M5,${y - 5} Q12,${y} 5,${y + 5}`, fill: 'none', stroke: '#A86C45', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g));
    E('ellipse', { cx: -4, cy: -22, rx: 14, ry: 7, fill: '#DFA174', transform: 'rotate(-12 -4 -22)' }, g);
    return g;
  }
  function dblArrow(parent, x1, y1, x2, y2, color, w) {
    const g = G(parent), mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    arrow(g, mx, my, x1, y1, { color, width: w || 5, head: 16 }); arrow(g, mx, my, x2, y2, { color, width: w || 5, head: 16 });
    return g;
  }
  /* bracket over a stretch of the slinky, ticks pointing down; g.set(x1, x2, y) */
  function bracket(parent, color) {
    const g = G(parent), p = E('path', { fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    g.set = (x1, x2, y) => p.setAttribute('d', `M${x1.toFixed(1)},${y + 10} L${x1.toFixed(1)},${y} L${x2.toFixed(1)},${y} L${x2.toFixed(1)},${y + 10}`);
    return g;
  }
  function miniSpeaker(parent) {
    const g = G(parent), k = G(g, { transform: 'scale(0.3)' });   // the lesson's shared loudspeaker (chapters 0-2), small
    E('rect', { x: -46, y: -60, width: 56, height: 120, rx: 10, fill: ball('#36505F', '#16242D'), stroke: '#6F8B9B', 'stroke-width': 3 }, k);
    E('path', { d: 'M8,-24 L44,-58 L44,58 L8,24 Z', fill: linGrad('#7D8E9A', '#C9D5DD'), stroke: '#DCE6EC', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
    E('path', { d: 'M8,-24 Q20,0 8,24', fill: '#5D707C', stroke: '#DCE6EC', 'stroke-width': 2.5 }, k);
    [10, 18].forEach(r => E('path', { d: `M${18 + r * 0.2},${-r * 0.8} A${r},${r} 0 0 1 ${18 + r * 0.2},${r * 0.8}`, fill: 'none', stroke: C.air, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g));
    return g;
  }

  /* ---------- geometry ---------- */
  const XH = 170, XEND = 1110, L1Y = 250, L2Y = 535;
  // slinky: coils every CSP px; wave of amplitude SA (< SLAM / 2pi, so coils never cross)
  const NC = 42, CSP = 22.5, SA = 22, SLAM = 225, SF = 0.8, SV = SLAM * SF, SR = 42, SE = 9;
  const X0 = []; for (let j = 0; j < NC; j++) X0.push(XH + 5 + j * CSP);
  const JC = 17, XC = X0[JC];
  // rope
  const RA = 46, RLAM = 300, RF = 0.7, RV = RLAM * RF, XR = XC;
  // clocks: when each wave starts, and when it pauses for its labels
  const TS0 = at('long') + 0.2, PS = [[mid('long', 0.66), at('slinky') + 0.25], [mid('rope', 0.78), at('key') + 0.15]];
  const TR0 = at('trans') + 0.15, PR = [[mid('rope', 0.76), at('key') + 0.15]];
  const tauS = t => clock(t, TS0, PS), tauR = t => clock(t, TR0, PR);
  const slinkyU = (x0, tau) => { const d = x0 - X0[0]; return tau > 0 && d <= SV * tau ? SA * Math.sin(TAU * (SF * tau - d / SLAM)) : 0; };
  const ropeY = (x, tau) => { const d = x - XH; return tau > 0 && d <= RV * tau ? -RA * Math.sin(TAU * (RF * tau - d / RLAM)) : 0; };
  // labels on the paused patterns: compression near x 610 (rarefaction 1.5 wavelengths on), crest near x 700
  const tpS = tauS(at('slinky')), nS = Math.round(SF * tpS - (610 - X0[0]) / SLAM);
  const compX = tau => X0[0] + SLAM * (SF * tau - nS);
  const tpR = tauR(at('light')), nR = Math.round(RF * tpR - 0.25 - (700 - XH) / RLAM);
  const crestX = XH + RLAM * (RF * tpR - 0.25 - nR);

  /* ================= lane 1: the slinky ================= */
  const L1 = G(root);
  const back = E('path', { fill: 'none', stroke: '#6F7F8C', 'stroke-width': 3, 'stroke-linecap': 'round' }, L1);
  const front = E('path', { fill: 'none', stroke: '#DCE5EC', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, L1);
  const paint = E('path', { fill: 'none', stroke: RED, 'stroke-width': 6, 'stroke-linecap': 'round' }, L1);
  const hand1 = hand(L1);
  const t1a = T(L1, 190, 168, 'family 1', { size: 40, weight: 700, fill: C.muted });
  const t1b = T(L1, 190, 168, 'longitudinal', { size: 40, weight: 700, fill: C.air });
  const t1c = rich(L1, 190, 168, [['longitudinal', C.air, 800], ': along ', ['↔', RED, 800], ['  (sound)', C.muted, 600]], { size: 36, weight: 700 });
  const trav1 = G(L1);
  const trav1A = arrow(trav1, 950, 146, 1110, 146, { color: C.ink, width: 5 });
  T(trav1, 1030, 124, 'wave travels', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const q1 = chip(L1, 'vibration?', { size: 28, fill: 'rgba(10,27,39,0.6)', stroke: RED, color: '#FFB3B8', sw: 2 }); tr(q1, XC, 346);
  q1.box.setAttribute('stroke-dasharray', '7 6');
  const rest1 = E('path', { d: `M${XC},${L1Y + SR + 8} l-9,13 l18,0 Z`, fill: C.ink }, L1);
  const vib1 = dblArrow(L1, XC - 48, 338, XC + 48, 338, RED);
  const vib1Lab = rich(L1, XC, 382, ['vibrates ', ['along', RED, 800], ' the direction of travel'], { size: 28, anchor: 'middle' });
  const crG = G(L1), compB = bracket(crG, C.air), rareB = bracket(crG, C.air);
  const compL = T(crG, 0, 188, 'compression', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const rareL = T(crG, 0, 188, 'rarefaction', { size: 26, weight: 700, anchor: 'middle', fill: C.air });
  const push = G(L1);
  dblArrow(push, 86, 302, 176, 302, C.ink, 4);
  T(push, 131, 338, 'push, pull', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const sndChip = G(L1);
  { const lab = rich(sndChip, 22, 10, [['sound', C.air, 800], ' is longitudinal'], { size: 30, weight: 700, anchor: 'middle' });
    const w = textLen(lab) + 100;
    sndChip.insertBefore(E('rect', { x: -w / 2, y: -27, width: w, height: 54, rx: 27, fill: C.card2, stroke: C.air, 'stroke-width': 3 }), lab);
    const ms = miniSpeaker(sndChip); tr(ms, -w / 2 + 34, 0); }

  /* ================= lane 2: the rope ================= */
  const L2 = G(root);
  const rest2 = E('line', { x1: XR - 44, x2: XR + 44, y1: L2Y, y2: L2Y, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '6 6' }, L2);
  const vib2 = dblArrow(L2, XR, L2Y - RA - 24, XR, L2Y + RA + 24, RED);
  const ropeO = E('path', { fill: 'none', stroke: '#7A5A2E', 'stroke-width': 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, L2);
  const ropeF = E('path', { fill: 'none', stroke: '#D9B26A', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, L2);
  const ropeT = E('path', { fill: 'none', stroke: '#F3DDA8', 'stroke-width': 3, 'stroke-dasharray': '5 7', 'stroke-linecap': 'round' }, L2);
  const ribbon = G(L2);
  E('path', { d: 'M0,0 L-15,-11 L-15,11 Z M0,0 L15,-11 L15,11 Z', fill: RED, stroke: '#FFC2C6', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, ribbon);
  E('path', { d: 'M-3,3 L-9,24 M3,3 L9,24', stroke: RED, 'stroke-width': 4, 'stroke-linecap': 'round' }, ribbon);
  E('circle', { r: 5.5, fill: '#C9303C' }, ribbon);
  const hand2 = hand(L2);
  const t2a = T(L2, 190, 452, 'family 2', { size: 40, weight: 700, fill: C.muted });
  const t2b = T(L2, 190, 452, 'transverse', { size: 40, weight: 700, fill: C.air });
  const t2c = rich(L2, 190, 452, [['transverse', C.air, 800], ': across ', ['↕', RED, 800], ['  (light, ripples)', C.muted, 600]], { size: 36, weight: 700 });
  const trav2 = G(L2);
  const trav2A = arrow(trav2, 950, 432, 1110, 432, { color: C.ink, width: 5 });
  T(trav2, 1030, 410, 'wave travels', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const q2 = chip(L2, 'vibration?', { size: 28, fill: 'rgba(10,27,39,0.6)', stroke: RED, color: '#FFB3B8', sw: 2 }); tr(q2, XR, 636);
  q2.box.setAttribute('stroke-dasharray', '7 6');
  const ra = G(L2);       // the right angle between the vibration and the direction of travel
  E('line', { x1: XR, x2: XR, y1: L2Y + RA + 30, y2: 646, stroke: RED, 'stroke-width': 3, 'stroke-dasharray': '5 6' }, ra);
  const raArrow = arrow(ra, XR, 646, XR + 150, 646, { color: C.ink, width: 5 });
  E('path', { d: `M${XR + 18},646 L${XR + 18},628 L${XR},628`, fill: 'none', stroke: C.energy, 'stroke-width': 3.5 }, ra);
  T(ra, XR - 18, 656, 'vibration', { size: 28, weight: 700, anchor: 'end', fill: RED });
  T(ra, XR + 166, 656, 'at right angles', { size: 28, weight: 700, fill: C.energy });
  const ctG = G(L2);
  const crestL = T(ctG, crestX, L2Y - RA - 22, 'crest', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const troughL = T(ctG, crestX + RLAM / 2, L2Y + RA + 46, 'trough', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const ctDots = [E('circle', { cx: crestX, cy: L2Y - RA, r: 6, fill: C.energy }, ctG), E('circle', { cx: crestX + RLAM / 2, cy: L2Y + RA, r: 6, fill: C.energy }, ctG)];

  /* ================= light: transverse examples ================= */
  const Lt = G(root, { transform: 'translate(0 30)' });
  rich(Lt, 600, 168, ['These are ', ['transverse', C.air, 800], ' too'], { size: 40, weight: 700, anchor: 'middle' });
  const LC = [210, 600, 990];
  const ltCards = LC.map((x, i) => {
    const g = G(Lt);
    card(g, x - 180, 205, 360, 370, { fill: C.card, stroke: C.line });
    const lines = [['light'], ['all electromagnetic', 'waves'], ['water ripples']][i];
    lines.forEach((s, k) => T(g, x, (lines.length > 1 ? 512 : 530) + k * 38, s, { size: 30, weight: 700, anchor: 'middle', fill: i === 2 ? C.water : C.energy }));
    return g;
  });
  // torch with a transverse beam
  const torch = G(ltCards[0]); tr(torch, LC[0] - 96, 360);
  E('path', { d: 'M30,-20 L250,-70 L250,70 L30,20 Z', fill: 'rgba(255,228,92,0.13)' }, torch);
  E('rect', { x: -60, y: -18, width: 70, height: 36, rx: 8, fill: ball('#8796A1', '#3E4C57'), stroke: '#B9C6D0', 'stroke-width': 2 }, torch);
  E('path', { d: 'M8,-18 L28,-27 L28,27 L8,18 Z', fill: ball('#A6B7C4', '#56687A'), stroke: '#B9C6D0', 'stroke-width': 2, 'stroke-linejoin': 'round' }, torch);
  E('ellipse', { cx: 29, cy: 0, rx: 6, ry: 26, fill: C.energyLt, stroke: C.energy, 'stroke-width': 2 }, torch);
  E('rect', { x: -34, y: -24, width: 16, height: 8, rx: 3, fill: '#E8424F' }, torch);
  const beam = sineWave(torch, { w: 212, amp: 24, wl: 53, color: C.energy, width: 5 }); tr(beam, 38, 0);
  // the electromagnetic spectrum: a strip, with waves getting shorter from radio to gamma
  const spec = G(ltCards[1]); tr(spec, LC[1], 350);
  const gid = 'soundKindsSpec';
  { const lg = E('linearGradient', { id: gid, x1: 0, y1: 0, x2: 1, y2: 0 }, defs());
    [[0, '#6B3A2E'], [0.28, '#A9452E'], [0.42, '#E8424F'], [0.47, '#FF8A3D'], [0.5, '#FFE45C'], [0.53, '#56D69B'], [0.56, '#4CC9F0'], [0.6, '#B48CFF'], [0.8, '#7550C4'], [1, '#DCE4EA']].forEach(([o, c]) => E('stop', { offset: o, 'stop-color': c }, lg)); }
  E('rect', { x: -140, y: 22, width: 280, height: 30, rx: 8, fill: `url(#${gid})`, stroke: '#C9D6DE', 'stroke-width': 2 }, spec);
  { let d = '', ph = 0; for (let x = -140; x <= 140; x += 1) { const lam = 70 * Math.pow(15 / 70, (x + 140) / 280); ph += TAU / lam; d += (x === -140 ? 'M' : 'L') + x + ',' + (-34 - 22 * Math.sin(ph)).toFixed(1); }
    E('path', { d, fill: 'none', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, spec); }
  T(spec, -140, 92, 'radio', { size: 26, weight: 600, fill: C.muted });
  T(spec, 140, 92, 'gamma', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  // water ripples from the side, with a floating leaf that only bobs up and down
  const rip = G(ltCards[2]); tr(rip, LC[2], 360);
  const water = E('path', { fill: linGrad('#4CC9F0', '#12506A', true), opacity: 0.9 }, rip);
  const surf = E('path', { fill: 'none', stroke: '#C9F1FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, rip);
  const leafG = G(rip);
  E('path', { d: 'M-22,0 Q0,-14 22,0 Q0,9 -22,0 Z', fill: ball(C.plant, C.plantDk), stroke: '#9EF0B4', 'stroke-width': 1.5 }, leafG);
  dblArrow(rip, 60, -42, 60, 40, RED, 4);

  /* ================= key: energy moves, the material doesn't ================= */
  const K = G(root);
  const sparks = [spark(K, 17, { seed: 1 }), spark(K, 17, { seed: 4 })];
  const ban = G(K);
  { const lab = rich(ban, 0, 11, [['energy', C.energy, 800], ' moves along; the material ', ['stays put', RED, 800]], { size: 32, weight: 700, anchor: 'middle' });
    const w = textLen(lab) + 60;
    ban.insertBefore(E('rect', { x: -w / 2, y: -29, width: w, height: 58, rx: 29, fill: 'rgba(10,27,39,0.85)', stroke: C.energy, 'stroke-width': 3 }), lab); }

  /* ================= update ================= */
  return t => {
    const lanes = Math.min(P(t, S.first - 0.3, 0.45, linear), 1 - P(t, at('light') - 0.15, 0.45, linear)) + P(t, at('key') - 0.1, 0.5, linear);
    const dim1 = 0.5 * win(t, at('trans') - 0.1, at('rope') + 0.1, 0.4), dim2 = 0.4 * win(t, at('long') - 0.1, at('trans') + 0.1, 0.4);
    op(L1, lanes * (1 - dim1)); op(L2, lanes * (1 - dim2));
    const keyOn = P(t, at('key') - 0.1, 0.5, linear);

    if (lanes > 0) {
      /* the slinky */
      const ts = tauS(t);
      const cs = X0.map(x0 => x0 + slinkyU(x0, ts));
      const k = 1.33 * SE;
      let b = '', f = '';
      for (let j = 0; j < NC; j++) {
        const c = cs[j];
        b += `M${c.toFixed(1)},${L1Y - SR} C${(c - k).toFixed(1)},${L1Y - SR} ${(c - k).toFixed(1)},${L1Y + SR} ${c.toFixed(1)},${L1Y + SR}`;
        if (j < NC - 1) { const n = cs[j + 1]; f += `M${c.toFixed(1)},${L1Y + SR} C${(c + k).toFixed(1)},${L1Y + SR} ${(n + k).toFixed(1)},${L1Y - SR} ${n.toFixed(1)},${L1Y - SR}`; }
      }
      back.setAttribute('d', b); front.setAttribute('d', f);
      { const c = cs[JC], n = cs[JC + 1];
        paint.setAttribute('d', `M${c.toFixed(1)},${L1Y - SR} C${(c - k).toFixed(1)},${L1Y - SR} ${(c - k).toFixed(1)},${L1Y + SR} ${c.toFixed(1)},${L1Y + SR} C${(c + k).toFixed(1)},${L1Y + SR} ${(n + k).toFixed(1)},${L1Y - SR} ${n.toFixed(1)},${L1Y - SR}`); }
      tr(hand1, cs[0] - 14, L1Y);
      op(t1a, 1 - P(t, at('long') + 0.1, 0.4, linear));
      op(t1b, P(t, at('long') + 0.1, 0.4, linear) * (1 - P(t, mid('key', 0.76), 0.4, linear)));
      op(t1c, P(t, mid('key', 0.76), 0.4, linear));
      trav1A.set(P(t, mid('families', 0.76), 0.7)); op(trav1, P(t, mid('families', 0.74), 0.3, linear));
      op(q1, win(t, mid('families', 0.42), at('long') + 0.3, 0.35));
      op(rest1, Math.max(win(t, mid('long', 0.14), at('slinky') + 0.2, 0.35), keyOn));
      const v1 = Math.max(win(t, mid('long', 0.16), at('light') + 0.2, 0.35), keyOn);
      op(vib1, v1);
      op(vib1Lab, win(t, mid('long', 0.24), at('slinky') + 0.1, 0.4));
      // compressions and rarefactions: labelled while the pattern is paused, then they ride along
      const crOn = win(t, mid('long', 0.72), at('slinky') + 2.2, 0.4);
      op(crG, crOn);
      if (crOn > 0) {
        const xc = compX(ts), xr = xc + 1.5 * SLAM, half = SLAM / 6;
        compB.set(xc - half, xc + half, 196); rareB.set(xr - half, xr + half, 196);
        attr(compL, 'x', xc); attr(rareL, 'x', xr);
      }
      op(push, win(t, at('slinky') + 0.2, at('trans') + 0.1, 0.4));
      const sc = P(t, mid('slinky', 0.72), 0.5, pop);
      op(sndChip, clamp(sc * 2) * (1 - P(t, at('trans') + 0.6, 0.4, linear))); tr(sndChip, 660, 380, 0.85 + 0.15 * sc);

      /* the rope */
      const tr2 = tauR(t);
      const pts = [];
      for (let x = XH; x <= XEND; x += 10) pts.push(x + ',' + (L2Y + ropeY(x, tr2)).toFixed(1));
      const d = 'M' + pts.join(' L');
      ropeO.setAttribute('d', d); ropeF.setAttribute('d', d); ropeT.setAttribute('d', d);
      const yr = L2Y + ropeY(XR, tr2);
      tr(ribbon, XR, yr);
      tr(hand2, XH - 14, L2Y + ropeY(XH, tr2));
      op(t2a, 1 - P(t, at('trans') + 0.1, 0.4, linear));
      op(t2b, P(t, at('trans') + 0.1, 0.4, linear) * (1 - P(t, mid('key', 0.88), 0.4, linear)));
      op(t2c, P(t, mid('key', 0.88), 0.4, linear));
      trav2A.set(P(t, mid('families', 0.8), 0.7)); op(trav2, P(t, mid('families', 0.78), 0.3, linear));
      op(q2, win(t, mid('families', 0.5), at('trans') + 0.3, 0.35));
      op(vib2, Math.max(win(t, mid('trans', 0.12), at('light') + 0.2, 0.35), keyOn));
      op(rest2, Math.max(win(t, mid('trans', 0.12), at('rope') + 0.2, 0.35), keyOn));
      op(ra, win(t, mid('trans', 0.38), at('rope') + 0.15, 0.35)); raArrow.set(P(t, mid('trans', 0.4), 0.6));
      op(ctG, P(t, mid('rope', 0.82), 0.4, linear) * (1 - keyOn));
      ctDots.forEach((c, i) => attr(c, 'r', 6 + 2 * wave(t, 1.1, i * 0.5) * calm));
    }

    /* light */
    const aL = win(t, at('light') - 0.1, at('key') + 0.05, 0.45);
    op(Lt, aL);
    if (aL > 0) {
      ltCards.forEach((g, i) => { const p = P(t, mid('light', [0.04, 0.3, 0.62][i]), 0.5, easeOut); op(g, p); tr(g, 0, (1 - p) * 18); });
      beam.set({ phase: (t * 1.1) % 1 });
      let top = '';
      for (let x = -150; x <= 150; x += 6) { const y = -16 * Math.sin(TAU * (x / 120 - 0.45 * t)); top += (x === -150 ? 'M' : 'L') + x + ',' + y.toFixed(1); }
      surf.setAttribute('d', top); water.setAttribute('d', top + ' L150,110 L-150,110 Z');
      tr(leafG, 20, -16 * Math.sin(TAU * (20 / 120 - 0.45 * t)) - 5);
    }

    /* key */
    op(K, keyOn);
    if (keyOn > 0) {
      const tk = mid('key', 0.04);
      const ss = ((t - tk) * SV) % 980, sr = ((t - tk) * RV) % 980;
      const xs = X0[0] + Math.max(0, ss), xr = XH + Math.max(0, sr);
      tr(sparks[0], xs, L1Y, 1); op(sparks[0], P(t, tk, 0.3, linear) * Math.min(1, (XEND - xs) / 60, (xs - XH + 20) / 60));
      tr(sparks[1], xr, L2Y + ropeY(xr, tauR(t)) - 2, 1); op(sparks[1], P(t, tk, 0.3, linear) * Math.min(1, (XEND - xr) / 60, (xr - XH + 20) / 60));
      sparks.forEach(s => s.upd(t));
      const bp = P(t, mid('key', 0.26), 0.5, pop); op(ban, clamp(bp * 2)); tr(ban, 600, 690, 0.9 + 0.1 * bp);
    }
  };
});

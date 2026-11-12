/* Scene 6: Turning and pressing (moments and pressure).
   Beats: 1 PM, the empty new flat, fresh paint -> the heavy front door: Pushpa pushes right by the hinges,
   it won't turn -> Rex's whiteboard: moment = force × distance from the pivot (top view of the door) ->
   Piv at the hinge, blinking, lower third PIV -> push at the handle: same force, more distance, bigger
   moment (long spanner inset) -> the door swings open -> Piv under a plank: the seesaw rule -> Kavya 400 N
   at 1 m, her brother 200 N at 2 m, 400 N m each, level -> Kavya glares (CENSORED) -> the sofa goes down on
   four tiny legs -> Norm under one leg: ouch, a red-hot dent -> pressure = force ÷ area, N/m² = Pa ->
   Mum's felt pads: wide area, low pressure -> Norm, tearful: "lovely" -> the box cutter: tiny edge, huge pressure. */
scene('newflat', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed nf) ---------- */
  const on = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const nfCam = (el, k, cx, cy, px, py) => el.setAttribute('transform', `translate(${(px ?? cx).toFixed(1)} ${(py ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  const nfPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const pill = (parent, text, o) => { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 }); };
  const seat = (ch, wrap) => { if (ch.parentNode !== wrap) wrap.appendChild(ch); };
  const fit = (el, maxW, size) => { const w = textWidth(el.textContent, size, FD, 800); if (w > maxW) el.setAttribute('font-size', (size * maxW / w).toFixed(1)); };
  // Piv's blink on cue: Piv never bobs, so his t only drives the blink (seed 29: period 4.58 s)
  const pivT = (t, cues) => { for (const c of cues) if (Math.abs(t - c) < 0.065) return 0.065 + (t - c) - 20.59 + 45.8; return 2 - 20.59 + 45.8; };
  function nfFcam(parent) {
    const g = G(parent);
    E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#19E68C', opacity: 0.1 }, g);
    let scan = ''; for (let y = 3; y < 750; y += 7) scan += `M0,${y} L1200,${y} `;
    E('path', { d: scan, stroke: '#0A2A1A', 'stroke-width': 2, opacity: 0.18 }, g);
    E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#7CFFC0', 'stroke-width': 5 }, g);
    E('rect', { x: 900, y: 58, width: 250, height: 56, rx: 12, fill: 'rgba(6,24,16,0.85)' }, g);
    g.dot = E('circle', { cx: 926, cy: 86, r: 10, fill: '#FF3B3B' }, g);
    T(g, 946, 98, 'FORCE-CAM', { size: 34, weight: 800, fill: '#7CFFC0' });
    g.set = (v, t) => { op(g, v); if (v) op(g.dot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.2); };
    return g;
  }
  function nfClock(parent, r) {
    const g = G(parent);
    E('circle', { r: r + 7, fill: SC_INK }, g);
    E('circle', { r, fill: '#FFFDF5' }, g);
    let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU, r0 = i % 3 ? r * 0.82 : r * 0.7; ticks += `M${(Math.sin(a) * r0).toFixed(1)},${(-Math.cos(a) * r0).toFixed(1)} L${(Math.sin(a) * r * 0.94).toFixed(1)},${(-Math.cos(a) * r * 0.94).toFixed(1)} `; }
    E('path', { d: ticks, stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    E('line', { x1: 0, y1: 0, x2: r * 0.5, y2: -r * 0.29, stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);   // 1 o'clock
    E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.8, stroke: SC_INK, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 5, fill: '#E8424F' }, g);
    return g;
  }
  // a stamp that thumps down: g.set(p, x, y, rot)
  function nfStamp(parent, text, col, size) {
    const g = G(parent), w = textWidth(text, size, FD, 800) + size * 1.2, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#111111', stroke: col, 'stroke-width': 5 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 3 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.7, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // a horizontal dimension bracket from x0 to x1 at y, label underneath (or above): g.set(x0, x1)
  function nfBracket(parent, y, label, o) {
    o = o || {};
    const g = G(parent), col = o.color || SC_INK;
    const p = E('path', { d: '', fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const l = T(g, 0, 0, label, { size: o.size || 30, weight: 800, anchor: 'middle', fill: col });
    g.set = (x0, x1, lx) => {
      attr(p, 'd', `M${x0},${y - 12} L${x0},${y + 12} M${x0},${y} L${x1},${y} M${x1},${y - 12} L${x1},${y + 12}`);
      attr(l, 'x', lx !== undefined ? lx : (x0 + x1) / 2); attr(l, 'y', o.above ? y - 18 : y + 40);
    };
    g.set(0, 10);
    return g;
  }

  const Lset = G(root), Lmid = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= the new flat, with the door (one set; the camera moves) ================= */
  const flatCam = G(Lset);
  const flat = ppNewFlat(flatCam);
  const door = ppDoor(flatCam); tr(door, 465, 560, 0.95);
  const HX = 465, PX = 465 + 30 * 0.95, HDX = 465 + 200 * 0.95, HDY = 560 - 224 * 0.95;
  const sofaG = G(flatCam);
  const sofa = ppSofa(sofaG);
  const straps = E('path', { d: '', stroke: '#7A6A55', 'stroke-width': 5, fill: 'none' }, flatCam);
  const wetSign = G(flatCam); tr(wetSign, 900, 476);
  E('rect', { x: -80, y: -34, width: 160, height: 68, rx: 8, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4 }, wetSign);
  T(wetSign, 0, 11, 'WET PAINT', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const smell = [[180, 300], [610, 260], [1140, 480], [330, 380]].map(([x, y]) => E('path', { d: `M${x},${y} q14,-20 0,-40 q-14,-20 0,-40 q14,-20 0,-40`, fill: 'none', stroke: '#9CC8A8', 'stroke-width': 5, 'stroke-linecap': 'round' }, flatCam));
  const clock = nfClock(flatCam, 46); tr(clock, 250, 280);
  const kidWalk = G(flatCam);                     // Kavya, full body (walks in; sits on the seesaw)
  const kavBody = scKavyaBody(kidWalk);
  const under = E('rect', { x: 0, y: 610, width: 1200, height: 200, fill: '#2E1F12', opacity: 0 }, flatCam);   // x-ray under the floor (Norm close-ups)
  const normWorld = G(flatCam);
  const dent = E('ellipse', { cx: 0, cy: 0, rx: 16, ry: 4, fill: '#5A3A22', opacity: 0 }, flatCam);
  const hot = E('ellipse', { cx: 0, cy: 0, rx: 40, ry: 16, fill: glow('#FF3B3B'), opacity: 0 }, flatCam);
  const mum = person(flatCam, { skin: '#B9784E', shirt: '#3FA463', shorts: '#2A3A5A', hair: '#1E1410', shoes: '#F2F7FA' });

  /* ================= the seesaw (Piv + plank) ================= */
  const seeG = G(Lmid);
  const plankWrap = G(seeG); tr(plankWrap, 600, 468);
  const pivSeat = G(seeG);
  const plank = ppPlank(plankWrap, 600);
  const kavSeat = G(plank.on), broSeat = G(plank.on);
  const bro = person(broSeat, { skin: '#B9784E', shirt: '#FF9466', shorts: '#1E2A44', hair: '#1E1410', shoes: '#F2F7FA' });
  const sitPose = { lean: 0, armL: [30, 40], armR: [20, 50], legL: [85, -85], legR: [80, -80] };
  bro.pose(sitPose); tr(broSeat, 240, -16 + 92 * 0.65); tr(bro, 0, 0, '-0.65 0.65');
  const wK = ppForce(seeG, { color: ppCol.weight, dir: 'down', label: '400 N', side: 'left' });
  const wB = ppForce(seeG, { color: ppCol.weight, dir: 'down', label: '200 N', side: 'right' });
  const b1 = nfBracket(seeG, 318, '1 m', { above: true, color: SC_INK, size: 36 });
  const b2 = nfBracket(seeG, 318, '2 m', { above: true, color: SC_INK, size: 36 });
  const dropL = E('path', { d: 'M600,318 L600,456 M480,318 L480,440 M840,318 L840,440', stroke: SC_INK, 'stroke-width': 2.5, 'stroke-dasharray': '8 7', fill: 'none' }, seeG);
  const sumL = pill(seeG, '400 N × 1 m = 400 N m', { size: 30, color: '#C9CBF5', stroke: ppCol.weight });
  const sumR = pill(seeG, '200 N × 2 m = 400 N m', { size: 30, color: '#C9CBF5', stroke: ppCol.weight });
  const eqS = T(seeG, 600, 712, '=', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const balTick = G(seeG); tr(tick(balTick, 22), -110, -4); const balChip = pill(balTick, 'Balanced.', { size: 30, color: C.good, stroke: C.good }); tr(balChip, 18, 0);
  const ruleCard = G(seeG);
  E('rect', { x: -450, y: -66, width: 900, height: 132, rx: 18, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 3 }, ruleCard);
  T(ruleCard, 0, -14, 'A seesaw BALANCES when', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const ruleEq = T(ruleCard, 0, 40, 'force × distance (left) = force × distance (right)', { size: 34, weight: 800, anchor: 'middle', fill: C.ink });
  fit(ruleEq, 850, 34);

  /* ================= whiteboard (moments, then pressure) ================= */
  const wbG = G(Lmid); tr(wbG, 520, 395);
  const wb = ppWhiteboard(wbG, 860, 420);
  const B = wb.board;
  // moments
  const momB = G(B);
  const kwTurn = chip(momB, 'TURNING EFFECT = a MOMENT', { size: 30, fill: '#FFE9E2', color: ppCol.pushDk, stroke: ppCol.pushDk, sw: 3 }); tr(kwTurn, 0, -165);
  const eqMom = T(momB, 0, -100, 'moment = force × distance from the pivot', { size: 40, weight: 800, anchor: 'middle', fill: SC_INK }); fit(eqMom, 800, 40);
  const DHX = -260, DY = 120;   // the top-view diagram: hinge and door
  const diag = G(momB);
  E('line', { x1: -410, y1: DY, x2: DHX - 12, y2: DY, stroke: '#9AA6B2', 'stroke-width': 16 }, diag);   // wall
  E('line', { x1: DHX, y1: DY, x2: DHX + 570, y2: DY, stroke: '#7E4E2B', 'stroke-width': 14, 'stroke-linecap': 'round' }, diag);   // door, seen from above
  E('path', { d: `M${DHX},${DY - 4} L${DHX + 22},${DY + 34} L${DHX - 22},${DY + 34} Z`, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, diag);
  E('circle', { cx: DHX, cy: DY, r: 9, fill: '#3A434F', stroke: '#FFFFFF', 'stroke-width': 3 }, diag);
  T(diag, DHX - 10, DY + 70, 'pivot (hinge)', { size: 26, weight: 700, anchor: 'middle', fill: '#5F6B78' });
  T(diag, -420, 20, 'top view', { size: 26, weight: 600, anchor: 'start', fill: '#8E99A4', font: FB });
  const turnArc = E('path', { d: '', fill: 'none', stroke: ppCol.resultantDk, 'stroke-width': 6, 'stroke-linecap': 'round' }, diag);
  const turnHead = E('path', { d: 'M0,0 L-16,-10 L-16,10 Z', fill: ppCol.resultantDk }, diag);
  const momLbl = T(diag, 0, 0, '', { size: 28, weight: 800, anchor: 'middle', fill: ppCol.resultantDk });
  const fDoor = ppForce(diag, { color: ppCol.push, dir: 'up', label: 'force', side: 'left', size: 28, width: 18, labelColor: ppCol.pushDk }); fDoor.children[1].setAttribute('stroke', '#FFFFFF');
  const dBr = nfBracket(diag, DY + 34, 'distance', { color: ppCol.pushDk, size: 26 });
  const steps = G(momB);
  const ST = [['same force', ppCol.pushDk], ['more distance', ppCol.pushDk], ['BIGGER moment', ppCol.resultantDk]].map(([s, c], i) => { const k = chip(steps, s, { size: 28, fill: '#FFFFFF', color: c, stroke: c, sw: 3 }); return k; });
  let sx = -420; ST.forEach(k => { k.x0 = sx + k.w / 2; sx += k.w + 46; });
  const stArrows = [0, 1].map(i => T(steps, ST[i].x0 + ST[i].w / 2 + 23, 10, '→', { size: 34, weight: 800, anchor: 'middle', fill: '#5F6B78' }));
  // pressure
  const preB = G(B);
  const eqPre = T(preB, 0, -128, 'pressure = force ÷ area', { size: 58, weight: 800, anchor: 'middle', fill: SC_INK });
  const unitC = chip(preB, 'unit: N/m² = pascal (Pa)', { size: 32, fill: '#EEF0FF', color: ppCol.weightDk, stroke: ppCol.weightDk, sw: 3 }); tr(unitC, 0, -54);
  function nfPressDiag(parent, x, wide) {
    const g = G(parent); tr(g, x, 0);
    E('rect', { x: -170, y: 150, width: 340, height: 34, fill: '#E8CB9A', stroke: '#C29C66', 'stroke-width': 3 }, g);   // floor
    if (wide) {
      E('rect', { x: -110, y: 130, width: 220, height: 20, rx: 8, fill: '#8C8F99', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('rect', { x: -110, y: 150, width: 220, height: 10, fill: C.good, opacity: 0.7 }, g);
      for (let i = 0; i < 5; i++) arrow(g, -88 + i * 44, 96, -88 + i * 44, 126, { color: ppCol.weightDk, width: 4 });
    } else {
      E('rect', { x: -8, y: 130, width: 16, height: 20, rx: 3, fill: '#5A3A22', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('ellipse', { cx: 0, cy: 152, rx: 26, ry: 9, fill: glow('#FF3B3B') }, g);
    }
    const f = ppForce(g, { color: ppCol.weight, dir: 'down', label: 'same weight', side: 'right', size: 26, width: 18, labelColor: ppCol.weightDk }); f.children[1].setAttribute('stroke', '#FFFFFF'); tr(f, 0, wide ? 0 : -6); f.set(wide ? 92 : 130);
    const c = chip(g, wide ? 'LOW pressure' : 'HIGH pressure', { size: 30, fill: wide ? C.good : '#E8424F', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(c, 0, 210);
    g.tag = chip(g, wide ? 'big area' : 'tiny area', { size: 26, fill: '#FFFFFF', color: wide ? '#1E7A4A' : '#C62828', stroke: wide ? '#1E7A4A' : '#C62828', sw: 3 }); tr(g.tag, wide ? -110 : -110, 70);
    return g;
  }
  const pdTiny = nfPressDiag(preB, -210, false), pdWide = nfPressDiag(preB, 210, true);
  // spanner inset
  const span = G(Lfg);
  E('rect', { x: -160, y: -110, width: 320, height: 220, rx: 18, fill: 'rgba(10,27,39,0.94)', stroke: C.line, 'stroke-width': 3 }, span);
  const bolt = G(span); tr(bolt, -112, 36);
  E('path', { d: 'M24,0 L12,21 L-12,21 L-24,0 L-12,-21 L12,-21 Z', fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, bolt);
  const spanArm = G(bolt);
  E('path', { d: 'M-30,-14 Q-40,0 -30,14 L20,14 L210,10 Q222,0 210,-10 L20,-14 Z', fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 3 }, spanArm);
  const spanF = ppForce(spanArm, { color: ppCol.push, dir: 'up', width: 12 }); tr(spanF, 196, -8); spanF.set(60);
  T(span, 0, 94, 'long spanner', { size: 38, weight: 800, anchor: 'middle', fill: '#FFE45C' });

  /* ================= Norm's close-up props ================= */
  const ouches = ['OUCH!', 'ouch', 'OUCH'].map((s, i) => T(Lfg, 0, 0, s, { size: [52, 36, 44][i], weight: 800, anchor: 'middle', fill: '#FF5A5A' }));
  ouches.forEach(o => { o.setAttribute('stroke', '#FFFFFF'); o.setAttribute('stroke-width', 6); o.setAttribute('paint-order', 'stroke'); });
  const tears = G(Lfg);
  const TEAR = [0, 1, 2, 3].map(() => E('path', { d: 'M0,-12 Q9,2 0,8 Q-9,2 0,-12 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, tears));

  /* ================= box cutter ================= */
  const cutG = G(Lmid);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E8CB9A', '#C9A06A', true) }, cutG);
  E('rect', { x: 160, y: 150, width: 880, height: 520, rx: 6, fill: '#C99A5E', stroke: '#8C6235', 'stroke-width': 6 }, cutG);
  E('line', { x1: 160, y1: 410, x2: 1040, y2: 410, stroke: '#8C6235', 'stroke-width': 4 }, cutG);   // flap seam
  T(cutG, 330, 580, 'MISC', { size: 64, weight: 700, anchor: 'middle', fill: '#2A1A22', font: FB, opacity: 0.85 });
  E('rect', { x: 160, y: 380, width: 880, height: 60, fill: '#E9D4A6', opacity: 0.9 }, cutG);    // tape
  const slit = E('line', { x1: 200, y1: 410, x2: 200, y2: 410, stroke: '#2A1A22', 'stroke-width': 7, 'stroke-linecap': 'round' }, cutG);
  const cutter = G(cutG);
  E('path', { d: 'M0,0 L22,-26 L40,-18 Z', fill: '#DDE3EA', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, cutter);   // blade
  E('rect', { x: 26, y: -60, width: 200, height: 48, rx: 14, fill: '#FFC247', stroke: SC_INK, 'stroke-width': 4, transform: 'rotate(-28 26 -36)' }, cutter);
  E('ellipse', { cx: 150, cy: -112, rx: 70, ry: 44, fill: '#C98E62', stroke: SC_INK, 'stroke-width': 4 }, cutter);       // Dad's hand
  E('path', { d: 'M196,-140 L330,-210 L370,-130 L230,-80 Z', fill: '#8E99A4', stroke: SC_INK, 'stroke-width': 4 }, cutter);  // grey T-shirt sleeve
  const mag = G(Lfg);
  E('circle', { r: 150, fill: '#0F2C3A', stroke: '#DDE3EA', 'stroke-width': 12 }, mag);
  E('line', { x1: 106, y1: 106, x2: 170, y2: 170, stroke: '#5A646E', 'stroke-width': 22, 'stroke-linecap': 'round' }, mag);
  E('rect', { x: -130, y: 40, width: 260, height: 50, fill: '#E9D4A6' }, mag);
  E('path', { d: 'M-70,-90 L70,-90 L4,40 L-4,40 Z', fill: '#DDE3EA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, mag);
  E('ellipse', { cx: 0, cy: 42, rx: 30, ry: 10, fill: glow('#FF3B3B') }, mag);
  const magF = ppForce(mag, { color: ppCol.push, dir: 'down', width: 16 }); tr(magF, 0, -138); magF.set(70);
  T(mag, 0, 128, 'tiny edge', { size: 28, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const cutChip = pill(Lfg, 'tiny area → huge pressure', { size: 36, color: '#FF8A8A', stroke: '#FF8A8A' });

  /* ================= chips and HUD ================= */
  const cOne = pill(Lfg, '1:00 PM', { size: 32, color: '#FFE45C', stroke: '#FFE45C' });
  const cPaint = pill(Lfg, 'fresh paint', { size: 30 });
  const cHinge = pill(Lfg, 'right next to the hinges', { size: 30, color: ppCol.push, stroke: ppCol.push });
  const hingeLine = E('path', { d: '', stroke: ppCol.push, 'stroke-width': 4, fill: 'none', 'stroke-dasharray': '8 6' }, Lfg);
  const hingeDot = E('circle', { r: 10, fill: ppCol.push, stroke: '#FFFFFF', 'stroke-width': 3 }, Lfg);
  const cFar = pill(Lfg, 'at the handle: far from the pivot', { size: 30, color: ppCol.push, stroke: ppCol.push });
  const farBr = nfBracket(Lfg, 0, '', { color: ppCol.push });
  const cPivot = G(Lfg);
  const cPivC = chip(cPivot, 'PIVOT', { size: 40, fill: '#B4BEC9', color: SC_INK, stroke: '#FFFFFF', sw: 4 });
  tr(pill(cPivot, 'the point it turns around', { size: 30 }), 0, 66);
  const ltPiv = scLowerThird(Lhud, 'PIV', 'The pivot. Doesn\'t talk.');
  const cOpen = pill(Lfg, 'same push, further from the pivot', { size: 30, color: ppCol.resultant, stroke: ppCol.resultant });
  const sparks = G(Lfg); [[-60, -40], [50, -70], [80, 20], [-80, 40]].forEach(([x, y]) => tr(spark(sparks, 14), x, y));
  const chLegs = pill(Lfg, 'four tiny legs', { size: 32 });
  const chPads = pill(Lfg, 'wide felt pads', { size: 32, color: C.good, stroke: C.good });
  const c400 = pill(Lfg, 'Kavya: 400 N', { size: 34, color: '#C9CBF5', stroke: ppCol.weight });
  const censor = nfStamp(Lfg, 'CENSORED', '#FFFFFF', 34);
  const fcam = nfFcam(Lhud);

  /* ================= cast ================= */
  const rex = cast(root, 'rex', { mood: 'deadpan' });
  const pushpa = cast(root, 'pushpa');
  const piv = cast(root, 'piv');
  const norm = cast(root, 'norm');
  const kav = cast(root, 'kavya', { mood: 'annoyed' });
  const castFg = G(Lfg), castWorld = G(flatCam);
  flatCam.appendChild(hot);

  /* cut points */
  const cDoor = at('door') - 0.06, cMom = at('moment') - 0.06, cPiv = at('piv') - 0.06, cHand = at('handle') - 0.06, cHandB = mid('handle', 0.3);
  const cOpens = at('opens') - 0.06, cSee = at('seesaw') - 0.06, cTv = at('tv') - 0.06, cLegs = at('legs') - 0.06, cOw = at('ow') - 0.06;
  const cPre = at('pressure') - 0.06, cPads = at('pads') - 0.06, cPadsB = mid('pads', 0.48), cLove = at('lovely') - 0.06, cCut = at('cutter') - 0.06;
  const SOFAX = 560, LEG = [SOFAX + 150, 610];

  return t => {
    const sOne = on(t, -1, cDoor), sDoor = on(t, cDoor, cMom) || on(t, cHand, cHandB) || on(t, cOpens, cSee), sPiv = on(t, cPiv, cHand);
    const sBoard = on(t, cMom, cPiv) || on(t, cHandB, cOpens) || on(t, cPre, cPads) || on(t, cPadsB, cLove);
    const sSee = on(t, cSee, cTv), sTv = on(t, cTv, cLegs), sLegs = on(t, cLegs, cOw), sOw = on(t, cOw, cPre), sPads = on(t, cPads, cPadsB);
    const sLove = on(t, cLove, cCut), sCut = on(t, cCut, 1e9);
    const shown = {};

    /* ---------- the set and its camera ---------- */
    const setOn = !sCut;
    op(flatCam, setOn);
    let k = 1, cc = [600, 375], cp = null;
    if (sDoor && t >= at('stuck') - 0.06 && t < cMom) { const q = P(t, at('stuck') - 0.06, cMom - at('stuck'), linear); k = 1.3 + 0.08 * q; cc = [500, 380]; }
    if (sPiv) { const q = P(t, cPiv, cHand - cPiv, linear); k = 1.8 + 0.25 * q; cc = [HX, 480]; cp = [640, 430]; }
    if (sBoard) { k = 1; }
    if (sTv) { const q = P(t, cTv, cLegs - cTv, linear); k = 1.5 + 0.1 * q; cc = [600, 400]; }
    if (sLegs) { const q = P(t, mid('legs', 0.55), end('legs') - mid('legs', 0.55) + 0.2, ease); k = lerp(1, 2.6, q); cc = [lerp(600, LEG[0], q), lerp(375, LEG[1] - 30, q)]; cp = [600, lerp(375, 420, q)]; }
    if (sOw || sLove) { const q = P(t, sOw ? cOw : cLove, sOw ? cPre - cOw : cCut - cLove, linear); k = (sLove ? 3.8 : 3.2) + (sLove ? 0.5 : 0.2) * q; cc = [LEG[0], LEG[1]]; cp = [600, 360]; }
    nfCam(flatCam, k, cc[0], cc[1], cp ? cp[0] : undefined, cp ? cp[1] : undefined);
    // what is in the room
    op(door, sOne || sDoor || sPiv);
    op(wetSign, sOne); op(clock, sOne || sDoor);
    smell.forEach((s, i) => { op(s, sOne ? 0.25 + 0.5 * wave(t, 2.2, i * 0.25) : 0); tr(s, 0, -10 * wave(t, 2.2, i * 0.25) * AMP); });
    let dOpen = 0;
    if (sDoor && t >= at('stuck') - 0.1 && t < cMom) dOpen = 0.02 + 0.015 * Math.sin(t * 30) * AMP;
    if (sPiv) dOpen = 0.32 * Math.sin(clamp((t - mid('piv', 0.35)) / 1.6) * Math.PI);
    if (t >= cOpens && sDoor) dOpen = ease(P(t, at('opens') + 0.05, 0.7, linear));
    door.set(dOpen);
    // sofa: lowered on straps, then resting
    const sofaOn = sLegs || sOw || sPads || sLove;
    op(sofaG, sofaOn); op(straps, sLegs && t < mid('legs', 0.5));
    let sy = 610;
    if (sLegs) { const q = P(t, at('legs') - 0.1, mid('legs', 0.42) - at('legs') + 0.1, easeOut); sy = lerp(300, 610, q) - 8 * Math.sin(clamp((t - mid('legs', 0.42)) / 0.3) * Math.PI); }
    tr(sofaG, SOFAX, sy); attr(straps, 'd', `M${SOFAX - 170},0 L${SOFAX - 170},${sy - 150} M${SOFAX + 170},0 L${SOFAX + 170},${sy - 150}`);
    sofa.pads(sLove ? 1 : sPads ? P(t, mid('pads', 0.18), 0.6, linear) : 0);
    // Mum with the felt pads
    op(mum, sPads);
    op(chPads, 0);
    if (sPads) { nfPop(chPads, t, mid('pads', 0.2), 600, 230); }
    if (sPads) { tr(mum, LEG[0] + 70, 612, '-1.1 1.1'); mum.pose({ lean: 34, armL: [70, 30], armR: [80, 20], legL: [60, -90], legR: [20, -50] }); }
    // x-ray under the floor, the dent and the hot spot
    op(under, sOw || sLove ? 0.55 : 0);
    op(dent, sOw ? P(t, mid('ow', 0.15), 0.6, linear) : 0); attr(dent, 'cx', LEG[0]); attr(dent, 'cy', LEG[1] + 2);
    op(hot, sOw ? (0.6 + 0.4 * wave(t, 0.6)) * P(t, at('ow'), 0.4, linear) : 0); attr(hot, 'cx', LEG[0]); attr(hot, 'cy', LEG[1] + 1);

    /* ---------- FORCE-CAM ---------- */
    const camOn = (sDoor && t > mid('door', 0.4)) || sPiv || sSee || sOw || sLove;
    fcam.set(camOn ? (t < mid('door', 0.4) + 0.12 && sDoor && t < cMom ? Math.floor(t * 30) % 2 : 1) : 0, t);

    /* ---------- one: 1 PM, fresh paint, Kavya walks in ---------- */
    op(cOne, 0); op(cPaint, 0);
    op(kidWalk, sOne);
    if (sOne) {
      seat(kavBody, kidWalk);
      nfPop(cOne, t, at('one') + 0.1, 250, 378);
      nfPop(cPaint, t, mid('one', 0.62), 980, 200);
      const wp = clamp((t - at('one') + 0.3) / 2.6), x = lerp(-60, 300, wp);
      tr(kidWalk, x, 640, 1.05);
      kavBody.pose(wp < 1 ? walkPose(t, 1.1) : { lean: -4, armL: [10, 20], armR: [-10, 20], legL: [4, -2], legR: [-4, -2] });
    }

    /* ---------- the door: Pushpa ---------- */
    op(cHinge, 0); op(hingeLine, 0); op(hingeDot, 0); op(cFar, 0); op(farBr, 0); op(cOpen, 0); op(sparks, 0);
    if (sDoor && camOn) {
      seat(pushpa, castWorld); shown.pushpa = 1; op(pushpa, 1);
      const atHandle = t >= cHand;
      let px = PX - 90;
      if (atHandle && t < cOpens) px = lerp(PX - 90, HDX - 90, ease(P(t, at('handle') + 0.1, 0.8, linear)));
      if (t >= cOpens) px = HDX - 90;
      const hop = atHandle && t < cOpens ? 30 * Math.sin(clamp((t - at('handle') - 0.1) / 0.8) * Math.PI) : 0;
      tr(pushpa, px, HDY + 4 - hop, 0.7);
      let mood = 'happy', arms = 'push', sweat = 0;
      if (t >= at('stuck') - 0.1 && t < cMom) { mood = 'annoyed'; sweat = 1; }
      if (t >= cOpens) { const opened = t > at('opens') + 0.45; mood = opened ? 'happy' : 'neutral'; arms = opened ? 'up' : 'push'; }
      pushpa.set({ t, talk: scTalk(S, t, 'pushpa'), mood, arms, sweat, look: t >= cOpens ? 0 : 0.6 });
      if (t < cMom) {
        const p = P(t, mid('door', 0.62), 0.3, linear);
        op(hingeDot, p); attr(hingeDot, 'cx', PX); attr(hingeDot, 'cy', HDY + 30);
        op(hingeLine, p); attr(hingeLine, 'd', `M${PX},${HDY + 30} L800,250`);
        nfPop(cHinge, t, mid('door', 0.62), 860, 230);
        if (t >= at('stuck') - 0.06) { op(cHinge, 0); op(hingeLine, 0); op(hingeDot, 0); }
      } else if (t < cOpens) {
        const p = P(t, mid('handle', 0.12), 0.3, linear);
        op(farBr, p); tr(farBr, 0, HDY + 70); farBr.set(HX, HDX);
        nfPop(cFar, t, mid('handle', 0.1), 820, 200);
      } else {
        nfPop(cOpen, t, mid('opens', 0.5), 860, 200);
        op(sparks, win(t, at('opens') + 0.4, cSee, 0.2)); tr(sparks, HDX - 60, HDY - 60, 1, (t * 40) % 360);
      }
    }

    /* ---------- Piv at the hinge ---------- */
    op(cPivot, 0);
    if (sPiv) {
      seat(piv, castFg); shown.piv = 1; op(piv, 1);
      const q = P(t, cPiv, cHand - cPiv, linear);
      tr(piv, 640, 577 + 6 * q, 1.15 * (1 + 0.1 * q));
      piv.set({ t: pivT(t, [mid('piv', 0.3), end('piv') + 0.45]), mood: 'neutral', look: 0 });
      nfPop(cPivot, t, mid('piv', 0.12), 880, 200);
    }
    ltPiv.set(sPiv ? win(t, at('piv') + 0.3, at('piv') + 3.4, 0.3) : 0);

    /* ---------- whiteboard ---------- */
    op(wbG, sBoard); op(span, 0);
    if (sBoard) {
      const mom = t < cPre;
      op(momB, mom); op(preB, !mom);
      seat(rex, castFg); shown.rex = 1; op(rex, 1);
      tr(rex, 1065, 470, '-0.72 0.72');
      let rm = 'neutral';
      if (mom && t < cPiv) rm = t < mid('moment', 0.25) ? 'annoyed' : 'neutral';
      if (!mom && t < cPads) rm = t > mid('pressure', 0.8) ? 'annoyed' : 'deadpan';
      if (t >= cPadsB) rm = 'smug';
      rex.set({ t, talk: scTalk(S, t, 'rex'), mood: rm, look: 0.6, len: 0.45 });
      if (mom) {
        nfPop(kwTurn, t, at('moment') + 0.1, 0, -160);
        const ep = P(t, mid('moment', 0.42), 0.45, pop); op(eqMom, clamp(ep * 2.5));
        op(diag, P(t, mid('moment', 0.65), 0.3, linear));
        // the force slides from by the hinge to the handle
        const slide = t < cPiv ? 0 : ease(P(t, mid('handle', 0.34), 0.9, linear));
        const fx = DHX + lerp(46, 540, slide);
        tr(fDoor, fx, DY - 8); fDoor.set(96);
        dBr.set(DHX, fx, Math.max((DHX + fx) / 2, DHX + 175));
        // turning arc: sweep grows with the moment
        const sweep = lerp(20, 75, slide) * Math.PI / 180, R = 90;
        const a0 = -8 * Math.PI / 180, a1 = a0 - sweep;
        const x0 = DHX + Math.cos(a0) * R, y0 = DY + Math.sin(a0) * R, x1 = DHX + Math.cos(a1) * R, y1 = DY + Math.sin(a1) * R;
        attr(turnArc, 'd', `M${x0.toFixed(1)},${y0.toFixed(1)} A${R},${R} 0 0 0 ${x1.toFixed(1)},${y1.toFixed(1)}`);
        attr(turnArc, 'stroke-width', lerp(5, 11, slide));
        tr(turnHead, x1, y1, lerp(0.9, 1.5, slide), -90 - sweep * 180 / Math.PI);
        setText(momLbl, slide > 0.5 ? 'BIG moment' : 'small moment');
        attr(momLbl, 'x', DHX + 200); attr(momLbl, 'y', DY - 40); momLbl.setAttribute('text-anchor', 'start');
        op(steps, t >= cHandB ? 1 : 0);
        ST.forEach((c, i) => { const p = P(t, mid('handle', 0.4 + i * 0.12), 0.4, pop); op(c, clamp(p * 2.5)); tr(c, c.x0, 0, Math.max(0.01, 0.7 + 0.3 * p)); });
        stArrows.forEach((a, i) => op(a, P(t, mid('handle', 0.46 + i * 0.12), 0.2, linear)));
        tr(steps, 0, -40);
        if (t >= cHandB) {
          nfPop(span, t, mid('handle', 0.76), 1035, 636, 0.75);
          tr(spanArm, 0, 0, 1, -32 * ease(P(t, mid('handle', 0.8), 1.4, linear)) * AMP);
        }
      } else {
        const ep = P(t, at('pressure') + 0.1, 0.45, pop); op(eqPre, clamp(ep * 2.5)); tr(eqPre, 0, 0, Math.max(0.01, 0.75 + 0.25 * ep));
        op(unitC, P(t, mid('pascal', 0.12), 0.3, linear));
        op(pdTiny, P(t, mid('pressure', 0.35), 0.3, linear) * (t >= cPadsB ? 0.45 : 1));
        op(pdWide, t >= cPadsB ? P(t, cPadsB + 0.1, 0.3, linear) : 0);
      }
    }

    /* ---------- the seesaw ---------- */
    op(seeG, sSee);
    if (sSee) {
      seat(piv, pivSeat); shown.piv = 1; op(piv, 1);
      tr(piv, 600, 560, 1);
      piv.set({ t: pivT(t, [mid('seesaw', 0.5), mid('kids', 0.62), end('kids') + 0.1]), mood: 'neutral', look: t > at('kids') ? -0.3 : 0 });
      nfPop(ruleCard, t, mid('seesaw', 0.2), 600, 190);
      // riders land, the plank tips, then levels
      const kIn = P(t, mid('kids', 0.02), 0.4, easeOut), bIn = P(t, mid('kids', 0.3), 0.4, easeOut);
      const tilt = -14 * P(t, mid('kids', 0.06), 0.9, ease) * (1 - P(t, mid('kids', 0.33), 1.0, ease)) + (bIn > 0.9 ? 2.2 * Math.sin((t - mid('kids', 0.33) - 0.9) * 9) * Math.exp(-3 * Math.max(0, t - mid('kids', 0.33) - 0.9)) * (t > mid('kids', 0.33) + 0.9 ? 1 : 0) : 0);
      plank.set(tilt);
      seat(kavBody, kavSeat); op(kavSeat, kIn > 0.01 ? 1 : 0);
      tr(kavSeat, -120, -16 + 92 * 0.85 - 120 * (1 - kIn)); tr(kavBody, 0, 0, 0.85); kavBody.pose(sitPose);
      op(broSeat, bIn > 0.01 ? 1 : 0); tr(broSeat, 240, -16 + 92 * 0.65 - 120 * (1 - bIn));
      const a = tilt * Math.PI / 180, seatPt = d => [600 + d * Math.cos(a) - 8 * Math.sin(a), 468 + d * Math.sin(a) + 8 * Math.cos(a)];
      const [kx, ky] = seatPt(-120), [bx, by] = seatPt(240);
      tr(wK, kx, ky); wK.set(160 * P(t, mid('kids', 0.12), 0.4, ease));
      tr(wB, bx, by); wB.set(80 * P(t, mid('kids', 0.42), 0.4, ease));
      const lv = P(t, mid('kids', 0.55), 0.3, linear);
      op(b1, lv); b1.set(480, 600); op(b2, lv); b2.set(600, 840); op(dropL, lv * 0.8);
      nfPop(sumL, t, mid('kids', 0.62), 270, 700);
      nfPop(sumR, t, mid('kids', 0.74), 930, 700);
      op(eqS, 0);
      nfPop(balTick, t, mid('kids', 0.9), 600, 704);
      op(ruleCard, t > mid('kids', 0.5) ? 1 - 0.5 * P(t, mid('kids', 0.5), 0.3, linear) : (t > mid('seesaw', 0.2) ? 1 : 0));
      if (t < at('kids')) {
        seat(rex, castFg); shown.rex = 1; op(rex, 1);
        tr(rex, 1080, 460, '-0.55 0.55');
        rex.set({ t, talk: scTalk(S, t, 'rex'), mood: 'neutral', look: 0.6, len: 0.4 });
      }
    }

    /* ---------- tv: Kavya glares ---------- */
    op(c400, sTv); censor.set(0, 0, 0);
    if (sTv) {
      seat(kav, castFg); shown.kav = 1; op(kav, 1);
      const q = P(t, cTv, cLegs - cTv, linear);
      tr(kav, 700, 470 - 10 * q, 1.55 * (1 + 0.08 * q));
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: t < mid('tv', 0.4) ? 'shock' : 'annoyed', look: t < mid('tv', 0.4) ? -0.5 : 0 });
      tr(c400, 290, 270, 1, -3);
      censor.set(P(t, end('tv') + 0.15, 0.25, linear), 290, 272, -8);
    }

    /* ---------- the sofa goes down ---------- */
    op(chLegs, 0);
    if (sLegs) { op(chLegs, win(t, mid('legs', 0.42), mid('legs', 0.62), 0.15)); tr(chLegs, 560, 240); }

    /* ---------- Norm under the leg ---------- */
    ouches.forEach(o => op(o, 0)); op(tears, 0);
    if (sOw || sLove) {
      seat(norm, castWorld); shown.norm = 1; op(norm, 1);
      const sink = sOw ? 3 * P(t, mid('ow', 0.1), 0.8, ease) : 0;
      const nx = sOw ? LEG[0] - 66 * 0.32 : LEG[0];
      tr(norm, nx, LEG[1] + 116 * 0.32 + sink, 0.32);
      norm.set({ t, talk: scTalk(S, t, 'norm'), mood: sOw ? 'shock' : (t > mid('lovely', 0.2) ? 'happy' : 'neutral'), look: sOw ? 0.3 : 0, still: sLove && t > end('lovely') });
      if (sOw) {
        [[mid('ow', 0.05), 830, 230, -8], [mid('ow', 0.32), 380, 300, 6], [mid('ow', 0.55), 860, 540, -4]].forEach(([t0, x, y, r], i) => {
          const p = P(t, t0, 0.3, pop); op(ouches[i], clamp(p * 3)); tr(ouches[i], x, y + 6 * Math.sin(t * 20 + i) * AMP, Math.max(0.01, 0.6 + 0.4 * p), r);
        });
      } else {
        op(tears, P(t, mid('lovely', 0.25), 0.3, linear));
        const q = P(t, cLove, cCut - cLove, linear), kk = 3.8 + 0.5 * q;
        // Norm's eyes in screen space: his face is at (0, 4) * 0.32 from his origin
        const ex = 600 + 0 * kk, ey = 360 + (116 * 0.32 + 4 * 0.32) * kk;
        TEAR.forEach((d, i) => { const f = ((t * 0.7 + i * 0.5) % 1); tr(d, ex + (i % 2 ? 1 : -1) * 27 * 0.32 * kk, ey + 14 + f * 80, 1.5); op(d, 1 - f); });
      }
    }

    /* ---------- the box cutter ---------- */
    op(cutG, sCut); op(mag, 0); op(cutChip, 0);
    if (sCut) {
      const cx = lerp(220, 940, ease(P(t, at('cutter') + 0.2, 3.0, linear)));
      tr(cutter, cx, 410 + 2 * Math.sin(t * 24) * AMP);
      attr(slit, 'x2', cx);
      nfPop(mag, t, mid('cutter', 0.45), 360, 262);
      nfPop(cutChip, t, mid('cutter', 0.6), 600, 690);
    }

    if (!shown.rex) op(rex, 0);
    if (!shown.pushpa) op(pushpa, 0);
    if (!shown.piv) op(piv, 0);
    if (!shown.norm) op(norm, 0);
    if (!shown.kav) op(kav, 0);
  };
});

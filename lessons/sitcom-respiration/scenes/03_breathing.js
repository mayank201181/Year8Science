/* THE POWERHOUSE, scene 3: "Respiration is NOT breathing".
   Shots: COMMON MISTAKE stamp on Kavya -> Kavya asks (bubble) -> hard cut, Mitch push-in, "No."
   -> split screen BREATHING (lungs, ribs, muscle, delivery van) vs RESPIRATION (Mitch's factory)
   -> the twins come in through the lungs and get used up in the factory; Carl is breathed out
   -> fish, bacteria, plants all respire -> video call with Fern: day / night switch
   -> Mitch confessional, side-eye at Fern's "employee of the month" photo
   -> photosynthesis stores energy in glucose, respiration releases it (two big arrows). */
scene('breathing', S => {
  const { at, end, mid } = S, root = S.root;
  const RED = !!S.reduce, AMP = RED ? 0.35 : 1, F = 0.12;
  const INK = '#1A2A36';

  /* ---------- local helpers (prefixed br) ---------- */
  // shot visibility: snappy cut in at t0 (F seconds), held until the next shot has fully cut in
  const shot = (t, t0, t1) => (t < t0 || t >= t1 + F) ? 0 : clamp((t - t0) / F);
  const brCam = (g, fx, fy, k) => g.setAttribute('transform', `translate(${fx} ${fy}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  const brPut = (parent, kind, x, y, s, mood) => { const w = G(parent); tr(w, x, y); const c = scChar(w, kind, { s, mood }); c.w = w; return c; };
  const brSet = (c, t, who, mood, look, more) => c.set(Object.assign({ t, talk: who ? scTalk(S, t, who) : 0, mood, look, still: RED }, more || {}));
  // text with real subscripts: digits straight after a letter are lowered ('CO2 out' -> CO₂ out)
  function brChem(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const te = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    let low = false, prev = '';
    const re = /(\d+)|([^\d]+)/g; let m;
    while ((m = re.exec(str))) {
      const txt = m[0], isSub = !!m[1] && /[A-Za-z)]/.test(prev);
      const ts = E('tspan', {}, te); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
      prev = txt.slice(-1);
    }
    return te;
  }
  // a rubber stamp: double red outline and capital letters
  function brStamp(parent, lines, size, color) {
    const g = G(parent), inner = G(g);
    const w = Math.max(...lines.map(l => textWidth(l, size, FD, 800))) + size * 1.3, h = lines.length * size * 1.15 + size * 0.75;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 16, fill: 'rgba(255,96,112,0.10)', stroke: color, 'stroke-width': 9 }, inner);
    E('rect', { x: -w / 2 + 12, y: -h / 2 + 12, width: w - 24, height: h - 24, rx: 9, fill: 'none', stroke: color, 'stroke-width': 3 }, inner);
    lines.forEach((l, i) => T(inner, 0, -h / 2 + size * 0.375 + size * 1.15 * (i + 0.5) + size * 0.36, l, { size, weight: 800, anchor: 'middle', fill: color, ls: 2 }));
    return g;
  }
  // thump: big and faint -> lands at scale 1 with a tiny squash
  const brThump = (t, t0) => { const k = P(t, t0, 0.2, easeIn); return { o: clamp(k * 3), s: lerp(2.3, 1, k) - 0.05 * Math.sin(Math.PI * P(t, t0 + 0.2, 0.18, linear)) }; };
  const brShake = (t, t0) => (t < t0 + 0.2 ? 0 : 7 * AMP * Math.sin((t - t0) * 70) * (1 - P(t, t0 + 0.2, 0.35, linear)));
  // a delivery van facing right, centred; g.wheels spin
  function brVan(parent) {
    const g = G(parent);
    E('path', { d: 'M-112,-48 L46,-48 L46,26 L-112,26 Z', fill: '#F2F7FA', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M46,-30 L84,-30 L108,-2 L108,26 L46,26 Z', fill: '#4CC9F0', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M56,-22 L80,-22 L96,-4 L56,-4 Z', fill: '#DDF4FF', stroke: INK, 'stroke-width': 3 }, g);
    const ic = molO2(g, 11); tr(ic, -33, -26);
    T(g, -33, 12, 'DELIVERY', { size: 26, weight: 800, anchor: 'middle', fill: '#1D84A6' });
    g.wheels = [-70, 70].map(x => { const w = G(g); tr(w, x, 30); E('circle', { r: 17, fill: '#2A3440', stroke: INK, 'stroke-width': 3 }, w); E('path', { d: 'M-9,0 L9,0 M0,-9 L0,9', stroke: '#9AA6B2', 'stroke-width': 4 }, w); return { w, x }; });
    return g;
  }
  // a factory with a saw-tooth roof and a chimney, base at y = 0, centred on x = 0
  function brFactory(parent) {
    const g = G(parent);
    E('rect', { x: 150, y: -330, width: 46, height: 120, fill: '#8C5A44', stroke: INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-200,0 L-200,-200 L-133,-250 L-133,-200 L-66,-250 L-66,-200 L0,-250 L0,-200 L66,-250 L66,-200 L133,-250 L133,-200 L200,-250 L200,0 Z', fill: '#B5745A', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -200, y: -40, width: 400, height: 40, fill: '#8C5A44' }, g);
    [-160, 120].forEach(x => E('rect', { x, y: -170, width: 46, height: 40, rx: 4, fill: '#FFE29A', stroke: INK, 'stroke-width': 3 }, g));
    E('rect', { x: 92, y: -96, width: 66, height: 96, rx: 6, fill: '#5A3426', stroke: INK, 'stroke-width': 4 }, g);   // door
    return g;
  }

  const MITCH_PAN = 895;   // Mitch's x in the split screen

  /* ===== shot A: Kavya on the track, COMMON MISTAKE, the question ===== */
  const A = G(root), aShake = G(A);
  const aSet = scTrack(aShake);
  const aKw = G(aShake); tr(aKw, 820, 480);
  const aKtilt = G(aKw); const aKav = scChar(aKtilt, 'kavya', { s: 1.3 });
  const aBub = G(aShake);
  {
    const x0 = 70, x1 = 540, y0 = 160, y1 = 330, r = 30;
    E('path', { d: `M${x0 + r},${y0} H${x1 - r} Q${x1},${y0} ${x1},${y0 + r} V${y1 - r} Q${x1},${y1} ${x1 - r},${y1} H500 L700,452 L430,${y1} H${x0 + r} Q${x0},${y1} ${x0},${y1 - r} V${y0 + r} Q${x0},${y0} ${x0 + r},${y0} Z`, fill: '#FFFFFF', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, aBub);
  }
  const aQ1 = T(aBub, 305, 230, 'Respiration', { size: 50, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const aQ2 = T(aBub, 305, 298, '= breathing?', { size: 50, weight: 800, anchor: 'middle', fill: '#1D84A6' });
  const aStamp = brStamp(A, ['COMMON MISTAKE'], 66, '#E8424F');
  const T_STAMP = mid('mistake', 0.55);
  const CUT_B = end('ask') + 0.3;

  /* ===== shot C: split screen, BREATHING vs RESPIRATION ===== */
  const Cs = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C2230', '#133A4C', true) }, Cs);
  const cPanL = card(Cs, 40, 115, 530, 595, { fill: 'rgba(159,216,255,0.07)', stroke: '#2C5468', sw: 3 });
  const cPanR = card(Cs, 630, 115, 530, 595, { fill: 'rgba(255,228,92,0.06)', stroke: '#2C5468', sw: 3 });
  const cTitL = T(Cs, 305, 182, 'BREATHING', { size: 54, weight: 800, anchor: 'middle', fill: C.air });
  const cSubL = T(Cs, 305, 232, 'moving air in and out', { size: 32, weight: 600, anchor: 'middle' });
  const cBotL = T(Cs, 305, 588, 'using **muscles** and **ribs**', { size: 32, weight: 600, anchor: 'middle', boldFill: '#FF9AA8' });
  const cTitR = T(Cs, 895, 182, 'RESPIRATION', { size: 54, weight: 800, anchor: 'middle', fill: C.energy });
  const cSubR = T(Cs, 895, 232, 'a **chemical reaction**', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const cBotR = T(Cs, 895, 668, 'in every living cell', { size: 32, weight: 600, anchor: 'middle' });
  const cNe = T(Cs, 600, 205, '≠', { size: 96, weight: 800, anchor: 'middle', fill: C.bad });
  // lungs, ribs, diaphragm
  const cLung = G(Cs); tr(cLung, 200, 392);
  const cLg = lungs(cLung, 0.62);
  const cRibs = G(cLung);
  let rd = '';
  for (let i = 0; i < 4; i++) { const y = -48 + i * 40; [-1, 1].forEach(sd => { rd += `M${sd * 14},${y} Q${sd * 128},${y - 30} ${sd * 118},${y + 36} `; }); }
  const cRibP = E('path', { d: rd, fill: 'none', stroke: '#F4E9DC', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.6 }, cRibs);
  const cDia = E('path', { d: '', fill: 'none', stroke: '#E8424F', 'stroke-width': 10, 'stroke-linecap': 'round' }, cLung);
  const cAir = G(cLung), cAirP = [];
  for (let i = 0; i < 3; i++) cAirP.push(E('path', { d: 'M-12,0 Q-4,-8 0,0 Q4,8 12,0', fill: 'none', stroke: C.air, 'stroke-width': 5, 'stroke-linecap': 'round' }, cAir));
  const cRibLbl = labelLine(Cs, 470, 372, 330, 372, 'ribs', { size: 28, fill: '#F4E9DC', anchor: 'start', line: '#F4E9DC' });
  const cDiaLbl = labelLine(Cs, 470, 520, 300, 506, 'muscle', { size: 28, fill: '#FF9AA8', anchor: 'start', line: '#FF9AA8' });
  const cVan = brVan(Cs);
  // the factory and Mitch
  const cFac = G(Cs); tr(cFac, MITCH_PAN, 610);
  brFactory(cFac);
  const cMitch = brPut(Cs, 'mitch', MITCH_PAN - 30, 470, 0.75);
  const cHat = G(cMitch.w);
  E('path', { d: 'M-64,-46 Q-60,-104 0,-106 Q60,-104 64,-46 Z', fill: '#FFD23F', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cHat);
  E('rect', { x: -82, y: -52, width: 164, height: 14, rx: 7, fill: '#FFD23F', stroke: INK, 'stroke-width': 4 }, cHat);
  E('path', { d: 'M0,-104 L0,-50', stroke: '#E0A800', 'stroke-width': 6 }, cHat);
  const cBurst = G(Cs), cSparks = [];
  for (let i = 0; i < 4; i++) cSparks.push({ sp: spark(cBurst, 14, { seed: i }), a: -Math.PI / 2 + (i - 1.5) * 0.55 });
  const cTwins = brPut(Cs, 'twins', 0, 0, 0.42);
  const cCarl = brPut(Cs, 'carl', 0, 0, 0.42);
  const cO2chip = chip(Cs, 'O2', { size: 30, fill: C.oxygen, color: '#FFFFFF' });
  cO2chip.removeChild(cO2chip.label); cO2chip.label = brChem(cO2chip, 0, 11, 'O2 in', { size: 30, fill: '#FFFFFF' });
  cO2chip.box.setAttribute('x', -62); cO2chip.box.setAttribute('width', 124);
  const cCO2chip = chip(Cs, 'CO2', { size: 30, fill: C.co2, color: INK });
  cCO2chip.removeChild(cCO2chip.label); brChem(cCO2chip, 0, 11, 'CO2 out', { size: 30, fill: INK });
  cCO2chip.box.setAttribute('x', -78); cCO2chip.box.setAttribute('width', 156);
  // twins: windpipe -> lungs -> over to the factory door; Carl: door -> lungs -> out of the windpipe
  const DOOR = [MITCH_PAN + 125, 560];
  const qb = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  function twinsPos(t) {
    const u1 = P(t, at('brings') - 0.15, 1.1), u2 = P(t, end('brings') - 0.1, 1.5), u3 = P(t, mid('uses', 0.62), 0.5, easeIn);
    let p = [200, lerp(268, 370, u1)];
    if (u2 > 0) p = qb([200, 370], [600, 160], [DOOR[0], 420], u2);
    if (u3 > 0) p = [lerp(p[0], DOOR[0], u3), lerp(p[1], DOOR[1] - 30, u3)];
    return { p, s: 0.42 * (1 - u3), r: 300 * u3 * u3, u3 };
  }
  function carlPos(t) {
    const u1 = P(t, at('out') - 0.1, 0.5), u2 = P(t, at('out') + 0.35, 1.9), u3 = P(t, mid('out', 0.78), 1.1, easeIn);
    let p = [DOOR[0], DOOR[1] - 40];
    if (u2 > 0) p = qb(p, [600, 640], [200, 420], u2);
    if (u3 > 0) p = [200 + 14 * Math.sin(u3 * 6) * AMP, lerp(420, 150, u3)];
    return { p, s: 0.42 * clamp(u1) * (1 - 0.4 * u3), o: 1 - P(t, mid('out', 0.78) + 0.75, 0.35, linear) };
  }

  /* ===== shot D: everyone respires ===== */
  const D = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0B2A2E', '#164A52', true) }, D);
  const dHead = T(D, 600, 178, 'Who respires?', { size: 50, weight: 800, anchor: 'middle' });
  const dItems = [250, 600, 950].map((x, i) => {
    const g = G(D); tr(g, x, 0);
    E('ellipse', { cx: 0, cy: 400, rx: 160, ry: 150, fill: glow('#9FE8D0'), opacity: 0.35 }, g);
    const art = G(g); tr(art, 0, 400);
    const name = T(g, 0, 568, ['fish', 'bacteria', 'plants'][i], { size: 38, weight: 700, anchor: 'middle' });
    const ok = G(g); tr(ok, 0, 630);
    const ch = chip(ok, 'respires', { size: 30, fill: C.good, color: '#0A2A1C', w: 190 });
    tr(ch, -20, 0);
    const tk = tick(ok, 15, '#0A2A1C'); tr(tk, 52, 2);
    return { g, art, name, ok };
  });
  // fish
  const dFish = G(dItems[0].art), dTail = G(dFish);
  E('path', { d: 'M-70,0 L-130,-46 L-118,0 L-130,46 Z', fill: '#FF8A3D', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, dTail);
  E('path', { d: 'M-20,-48 Q10,-90 40,-46 Z', fill: '#FF8A3D', stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, dFish);
  E('ellipse', { rx: 95, ry: 56, fill: ball('#FFB45C', '#C2611A'), stroke: INK, 'stroke-width': 4 }, dFish);
  E('path', { d: 'M20,-44 Q4,0 20,44', fill: 'none', stroke: INK, 'stroke-width': 3, opacity: 0.6 }, dFish);
  E('circle', { cx: 55, cy: -14, r: 13, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, dFish);
  E('circle', { cx: 58, cy: -14, r: 6, fill: INK }, dFish);
  E('path', { d: 'M78,18 Q86,22 92,16', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, dFish);
  const dBub = bubbles(dItems[0].art, 80, -150, 40, 110, { n: 3, r: 8, seed: 5 });
  // bacterium
  const dBac = G(dItems[1].art);
  const dFlag = E('path', { d: '', fill: 'none', stroke: '#2E8C64', 'stroke-width': 5, 'stroke-linecap': 'round' }, dBac);
  E('rect', { x: -105, y: -46, width: 210, height: 92, rx: 46, fill: ball('#8FE3B4', '#2E8C64'), stroke: INK, 'stroke-width': 4 }, dBac);
  [[-62, 14], [-30, -22], [70, 18], [42, -24]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#2E8C64', opacity: 0.6 }, dBac));
  [-7, 27].forEach(x => { E('circle', { cx: x, cy: -8, r: 10, fill: '#FFFFFF', stroke: INK, 'stroke-width': 3 }, dBac); E('circle', { cx: x + 2, cy: -8, r: 5, fill: INK }, dBac); });
  E('path', { d: 'M-2,14 Q10,26 22,14', fill: 'none', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, dBac);
  // potted plant
  const dPl = G(dItems[2].art);
  E('path', { d: 'M0,40 L0,-70', stroke: C.stem, 'stroke-width': 8, 'stroke-linecap': 'round' }, dPl);
  [[0, -10, -150, 0.42], [0, -30, -30, 0.42], [0, -62, -95, 0.38]].forEach(([x, y, r, s]) => { const lf = leaf(dPl, s); tr(lf, x, y, 1, r); });
  E('path', { d: 'M-62,40 L62,40 L48,120 L-48,120 Z', fill: ball('#D9824A', '#9A4E1E'), stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, dPl);
  E('rect', { x: -70, y: 30, width: 140, height: 22, rx: 6, fill: '#C9733F', stroke: INK, 'stroke-width': 4 }, dPl);
  const dAll = T(D, 600, 178, 'All living things respire', { size: 50, weight: 800, anchor: 'middle', fill: C.good });

  /* ===== shot E: video call with Fern ===== */
  const Ec = G(root);
  scOffice(Ec);
  const eMitchCam = G(Ec);
  const eMitch = brPut(eMitchCam, 'mitch', 230, 410, 0.95);
  const eCall = scVideoCall(Ec, 560, 330, 'Video call: Fern'); tr(eCall, 830, 310);
  // g.slot is shadowed by the DOM's own Element.slot (a string), so take the clip group itself: it is the last child
  const eSlot = eCall.lastChild;
  const eDay = E('rect', { x: -280, y: -165, width: 560, height: 330, fill: linGrad('#8ED8FF', '#D6F2FF', true) }, eSlot);
  const eNight = E('rect', { x: -280, y: -165, width: 560, height: 330, fill: linGrad('#0B1636', '#24305E', true) }, eSlot);
  const eSun = G(eSlot); tr(eSun, -200, -95); E('circle', { r: 60, fill: glow('#FFD24A') }, eSun); E('circle', { r: 24, fill: ball('#FFE066', '#F5A300') }, eSun); eSun.upd = () => {};
  const eMoon = G(eSlot); tr(eMoon, -200, -95);
  E('path', { d: 'M8,-26 A27,27 0 1 0 8,26 A21,21 0 1 1 8,-26 Z', fill: '#FFF2B0', stroke: '#E8D27A', 'stroke-width': 2 }, eMoon);
  E('rect', { x: -280, y: 128, width: 560, height: 37, fill: '#C9A27A', stroke: '#8A6440', 'stroke-width': 3 }, eSlot);   // windowsill
  const ePot = G(eSlot); tr(ePot, 205, 128);
  [[-150, 0.3], [-30, 0.3]].forEach(([r, s]) => { const lf = leaf(ePot, s); tr(lf, 0, -40, 1, r); });
  E('path', { d: 'M-30,-40 L30,-40 L22,0 L-22,0 Z', fill: '#D9824A', stroke: INK, 'stroke-width': 3 }, ePot);
  const eFern = brPut(eSlot, 'fern', -10, 22, 0.9);
  const eLT = scLowerThird(Ec, 'FERN', 'Plant cell, windowsill');
  // day / night switch panel
  const ePan = G(Ec);
  card(ePan, 510, 495, 650, 218, { fill: 'rgba(14,26,36,0.9)', stroke: '#3A4B5C', sw: 3 });
  const eHdr = G(ePan);
  const eHSun = G(eHdr); tr(eHSun, 600, 538); E('circle', { r: 18, fill: ball('#FFE066', '#F5A300') }, eHSun); eHSun.upd = () => {};
  const eHMoon = G(eHdr); tr(eHMoon, 600, 538);
  E('path', { d: 'M6,-20 A21,21 0 1 0 6,20 A16,16 0 1 1 6,-20 Z', fill: '#FFF2B0' }, eHMoon);
  const eHDay = T(eHdr, 640, 550, 'DAY', { size: 34, weight: 800, fill: '#FFE066' });
  const eHNight = T(eHdr, 640, 550, 'NIGHT', { size: 34, weight: 800, fill: '#B9C4FF' });
  const eRow1 = G(ePan), eRow2 = G(ePan);
  T(eRow1, 545, 622, 'respiration', { size: 36, weight: 700, fill: C.energy });
  T(eRow2, 545, 688, 'photosynthesis', { size: 36, weight: 700, fill: C.plant });
  const pill = (parent, txt, fill, col, y) => { const c = chip(parent, txt, { size: 28, fill, color: col, w: 120 }); tr(c, 1070, y); return c; };
  const eOn1 = pill(eRow1, 'ON', C.good, '#0A2A1C', 610);
  const eOn2 = pill(eRow2, 'ON', C.good, '#0A2A1C', 676), eOff2 = pill(eRow2, 'OFF', '#3A4B5C', '#A4BCCB', 676);
  const eAll = T(eRow1, 910, 622, 'all the time', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const eLight = T(eRow2, 910, 688, 'only in light', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const eShift = G(ePan);
  [[700, 'DAY SHIFT', '#FFE066', '#3A3000'], [960, 'NIGHT SHIFT', '#5B6BD9', '#FFFFFF']].forEach(([x, txt, f, c]) => {
    const g = G(eShift); tr(g, x, 540);
    const ch = chip(g, txt, { size: 28, fill: f, color: c, w: 230 }); tr(ch, -14, 0);
    const tk = tick(g, 12, c); tr(tk, 82, 2);
    eShift['b' + x] = g;
  });

  /* ===== shots B and F share Mitch's confessional: B = hard cut, push-in, "No."; F = side-eye at Fern's photo ===== */
  const Fc = G(root);
  const fConf = scConfessional(Fc, 'mitch');
  const fCam = G(Fc);
  const fPhoto = G(fCam); tr(fPhoto, 925, 258, 1, 3);
  E('rect', { x: -118, y: -140, width: 236, height: 280, rx: 8, fill: '#E9FBEC', stroke: '#D4A537', 'stroke-width': 12 }, fPhoto);
  E('rect', { x: -100, y: -122, width: 200, height: 160, rx: 4, fill: linGrad('#8ED8FF', '#D6F2FF', true) }, fPhoto);
  const fFern = brPut(fPhoto, 'fern', 0, -36, 0.55, 'happy');
  T(fPhoto, 0, 82, 'EMPLOYEE', { size: 28, weight: 800, anchor: 'middle', fill: '#245A3B' });
  T(fPhoto, 0, 114, 'OF THE MONTH', { size: 26, weight: 800, anchor: 'middle', fill: '#245A3B' });
    const fMitch = brPut(fCam, 'mitch', 420, 410, 1.5);
  const fMug = scMug(fCam, 0.8); tr(fMug, 680, 560, 0.8);
  const fNever = T(Fc, 925, 470, 'complaints: 0', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const bNo = T(Fc, 1010, 430, 'No.', { size: 130, weight: 800, anchor: 'middle', fill: '#FFFFFF' });

  /* ===== shot G: photosynthesis and respiration, roughly opposites ===== */
  const Gc = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0C2230', '#133A4C', true) }, Gc);
  const gL = G(Gc), gR = G(Gc);
  const gCO2 = molCO2(gL, 24); tr(gCO2, 175, 420);
  T(gL, 282, 432, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted });
  const gH2O = molH2O(gL, 28); tr(gH2O, 375, 412);
  T(gL, 175, 500, 'carbon dioxide', { size: 28, weight: 600, anchor: 'middle', fill: C.co2 });
  T(gL, 375, 500, 'water', { size: 28, weight: 600, anchor: 'middle', fill: C.water });
  const gGlo = brPut(gR, 'gloria', 835, 420, 0.5, 'happy');
  T(gR, 932, 432, '+', { size: 48, weight: 700, anchor: 'middle', fill: C.muted });
  const gO2 = molO2(gR, 26); tr(gO2, 1040, 420);
  T(gR, 835, 500, 'glucose', { size: 28, weight: 600, anchor: 'middle', fill: C.glucoseLt });
  T(gR, 1040, 500, 'oxygen', { size: 28, weight: 600, anchor: 'middle', fill: '#FF9A8F' });
  const gTop = G(Gc);
  const gArT = arrow(gTop, 330, 330, 870, 330, { color: C.plant, width: 12, bend: -110 });
  const gSun = G(gTop); tr(gSun, 330, 190); E('circle', { r: 58, fill: glow('#FFD24A') }, gSun); E('circle', { r: 24, fill: ball('#FFE066', '#F5A300') }, gSun); gSun.upd = () => {};
  const gT1 = T(gTop, 600, 178, 'PHOTOSYNTHESIS', { size: 44, weight: 800, anchor: 'middle', fill: C.plant });
  const gT2 = T(gTop, 600, 226, '**stores** energy in glucose', { size: 32, weight: 600, anchor: 'middle', boldFill: C.plant });
  const gGlow = E('circle', { r: 120, fill: glow(C.energy) }, gR); attr(gGlow, 'cx', 835); attr(gGlow, 'cy', 420);
  gR.insertBefore(gGlow, gR.firstChild);
  const gBot = G(Gc);
  const gArB = arrow(gBot, 870, 540, 330, 540, { color: C.energy, width: 12, bend: -110 });
  const gB1 = T(gBot, 600, 650, 'RESPIRATION', { size: 44, weight: 800, anchor: 'middle', fill: C.energy });
  const gB2 = T(gBot, 600, 696, '**releases** it', { size: 32, weight: 600, anchor: 'middle', boldFill: C.energy });
  const gFly = []; for (let i = 0; i < 3; i++) gFly.push(spark(gBot, 13, { seed: i + 3 }));
  const gOpp = G(Gc); tr(gOpp, 600, 432);
  chip(gOpp, 'roughly opposites', { size: 30, fill: '#FFFFFF', color: INK });

  return t => {
    /* --- A: Kavya, stamp, question --- */
    const vA = shot(t, -10, CUT_B);
    op(A, vA);
    if (vA > 0) {
      aSet.upd(t, 0);
      tr(aShake, brShake(t, T_STAMP), 0);
      const asking = P(t, at('ask') - 0.1, 0.4);
      tr(aKtilt, 0, 0, 1, -7 * asking);
      brSet(aKav, t, 'kavya', 'neutral', lerp(0, -0.35, asking));
      const th = brThump(t, T_STAMP), out = P(t, at('ask') - 0.15, 0.3, linear);
      op(aStamp, th.o * (1 - out)); tr(aStamp, 600, 240, th.s * (1 + 0.3 * out), -9);
      const bp = P(t, mid('ask', 0.12), 0.35, pop);
      op(aBub, clamp(bp * 2)); aBub.setAttribute('transform', `translate(700 452) scale(${Math.max(0.01, bp).toFixed(3)}) translate(-700 -452)`);
      op(aQ1, P(t, mid('ask', 0.16), 0.3, linear)); op(aQ2, P(t, mid('ask', 0.42), 0.3, linear));
    }

    /* --- C: split screen --- */
    const vC = shot(t, at('breath'), at('everyone'));
    op(Cs, vC);
    if (vC > 0) {
      const ap = (el, t0) => op(el, P(t, t0, 0.35, linear));
      const popIn = (el, x, y, t0) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2)); el.setAttribute('transform', `translate(${x} ${y}) scale(${(0.6 + 0.4 * p).toFixed(3)}) translate(${-x} ${-y})`); };
      popIn(cTitL, 305, 170, mid('breath', 0.03));
      ap(cSubL, mid('breath', 0.2));
      ap(cBotL, mid('breath', 0.5));
      ap(cPanR, at('resp') - 0.3); op(cPanL, 1);
      popIn(cTitR, 895, 170, mid('resp', 0.02));
      ap(cSubR, mid('resp', 0.18));
      ap(cBotR, mid('resp', 0.42));
      const ne = P(t, mid('resp', 0.3), 0.45, pop); op(cNe, clamp(ne * 2)); cNe.setAttribute('transform', `translate(600 180) scale(${Math.max(0.01, ne).toFixed(3)}) translate(-600 -180)`);
      // lungs breathe; ribs and muscle light up on "muscles and ribs"
      const lungIn = P(t, mid('breath', 0.12), 0.4, linear);
      op(cLung, lungIn);
      const b = wave(t, 2.6) * (0.4 + 0.6 * AMP);
      cLg.set(b);
      tr(cRibs, 0, 0, 1 + 0.06 * b);
      const hiR = win(t, mid('breath', 0.5), mid('breath', 0.78), 0.3);
      attr(cRibP, 'opacity', 0.55 + 0.45 * hiR); attr(cRibP, 'stroke-width', 7 + 3 * hiR);
      attr(cDia, 'd', `M-122,112 Q0,${(30 + 50 * b).toFixed(1)} 122,112`); attr(cDia, 'stroke-width', 10 + 4 * hiR);
      cRibLbl.set(P(t, mid('breath', 0.52), 0.3, linear)); cDiaLbl.set(P(t, mid('breath', 0.58), 0.3, linear));
      // air in and out of the windpipe, following the breath
      const dir = Math.sin(TAU * t / 2.6) > 0 ? 1 : -1;
      cAirP.forEach((p, i) => { const q = ((t * 0.9 + i / 3) % 1); tr(p, (i - 1) * 16, -100 + (dir > 0 ? -40 + 40 * q : -40 * q)); op(p, Math.sin(q * Math.PI) * 0.9 * lungIn); });
      // van drives in on "the delivery van"
      const vp = P(t, mid('breath', 0.72), 1.1, easeOut), vx = lerp(-160, 305, vp);
      tr(cVan, vx, 652, 1, 0); op(cVan, vp > 0 ? 1 : 0);
      cVan.wheels.forEach(({ w, x }) => tr(w, x, 30, 1, (vx * 2.2) % 360));
      // factory, hard hat
      const fp = P(t, mid('resp', 0.7), 0.45, pop);
      op(cFac, clamp(fp * 2)); tr(cFac, MITCH_PAN, 610, Math.max(0.01, 0.5 + 0.5 * fp));
      const hp = P(t, mid('resp', 0.78), 0.4, easeOut);
      op(cHat, hp); tr(cHat, 0, -60 * (1 - hp));
      // twins and Carl
      const tw = twinsPos(t), tv = P(t, at('brings') - 0.15, 0.25, linear) * (tw.s > 0.01 ? 1 : 0);
      op(cTwins.w, tv);
      if (tv > 0) {
        tr(cTwins.w, tw.p[0], tw.p[1], Math.max(0.01, tw.s / 0.42), tw.r);
        const scared = tw.u3 > 0.02 || t > mid('uses', 0.55);
        cTwins.set({ t, talk: scTalk(S, t, 'otto'), talkB: scTalk(S, t, 'oscar'), mood: scared ? 'shock' : 'happy', moodB: scared ? 'shock' : 'happy', look: 0.3, lookB: -0.3, still: RED });
      }
      const burst = P(t, mid('uses', 0.62) + 0.45, 1.3, linear);
      op(cBurst, burst > 0 && burst < 1 ? 1 : 0);
      cSparks.forEach(({ sp, a }) => { const d = 30 + 150 * easeOut(burst); tr(sp, DOOR[0] - 10 + Math.cos(a) * d, DOOR[1] - 50 + Math.sin(a) * d * 0.9, 0.5 + 0.6 * (1 - burst)); op(sp, Math.sin(burst * Math.PI)); sp.upd(t); });
      const cp = carlPos(t), cv = P(t, at('out') - 0.1, 0.2, linear) * cp.o;
      op(cCarl.w, cv);
      if (cv > 0) { tr(cCarl.w, cp.p[0], cp.p[1], Math.max(0.01, cp.s / 0.42)); brSet(cCarl, t, 'carl', 'sad', -0.6); }
      const o2c = win(t, at('brings') + 0.3, mid('uses', 0.7), 0.25); op(cO2chip, o2c); tr(cO2chip, 600, 330);
      const co2c = win(t, at('out') + 0.5, end('out') + 0.6, 0.25); op(cCO2chip, co2c); tr(cCO2chip, 600, 462);
      // Mitch: watches the left panel for breathing, the twins and Carl as they move
      let look = t < at('resp') ? -0.7 : 0;
      if (t > at('brings') - 0.2 && tw.s > 0.01) look = clamp((tw.p[0] - MITCH_PAN) / 260, -1, 1);
      if (t > at('out')) look = clamp((cp.p[0] - MITCH_PAN) / 260, -1, 1);
      const mMood = t > at('out') ? 'deadpan' : t > mid('uses', 0.6) ? 'smug' : 'neutral';
      brSet(cMitch, t, 'mitch', mMood, look);
    }

    /* --- D: fish, bacteria, plants --- */
    const vD = shot(t, at('everyone'), at('fern'));
    op(D, vD);
    if (vD > 0) {
      const ins = [0.0, 0.3, 0.6], oks = [0.2, 0.5, 0.82];
      dItems.forEach((it, i) => {
        const p = P(t, mid('everyone', ins[i]), 0.45, pop);
        op(it.art, clamp(p * 2)); tr(it.art, 0, 400 + (1 - clamp(p)) * 20, Math.max(0.01, 0.7 + 0.3 * p));
        op(it.name, P(t, mid('everyone', ins[i]) + 0.1, 0.3, linear));
        const k = P(t, mid('everyone', oks[i]), 0.35, pop); op(it.ok, clamp(k * 2)); tr(it.ok, 0, 630, Math.max(0.01, k));
      });
      tr(dFish, 0, 6 * Math.sin(t * 2.2) * AMP, 1, 3 * Math.sin(t * 1.7) * AMP); tr(dTail, 0, 0, 1, 0); dTail.setAttribute('transform', `rotate(${(12 * Math.sin(t * 6) * AMP).toFixed(1)} -70 0)`);
      dBub.upd(t);
      let fd = 'M-105,0';
      for (let k = 1; k <= 8; k++) fd += ` L${-105 - k * 11},${(12 * Math.sin(k * 0.9 - t * 7 * AMP)).toFixed(1)}`;
      attr(dFlag, 'd', fd);
      tr(dBac, 4 * Math.sin(t * 1.6) * AMP, 0);
      tr(dPl, 0, 0, 1, 2 * Math.sin(t * 1.3) * AMP);
      const sw = P(t, mid('everyone', 0.9), 0.3, linear);
      op(dHead, P(t, at('everyone') - 0.1, 0.3, linear) * (1 - sw)); op(dAll, sw);
    }

    /* --- E: Fern's video call --- */
    const vE = shot(t, at('fern'), at('th_fern'));
    op(Ec, vE);
    if (vE > 0) {
      const cp = P(t, at('fern') - 0.05, 0.35, pop);
      eCall.setAttribute('transform', `translate(830 310) scale(${Math.max(0.01, 0.7 + 0.3 * cp).toFixed(3)})`);
      eLT.set(P(t, at('fern') + 0.1, 0.5) * (1 - P(t, at('fern') + 3.1, 0.4, linear)));
      // day / night: day until Fern says "day and night", then it cycles
      const t0 = mid('fernwork', 0.12), night = t < t0 ? 0 : clamp((wave(t - t0, 3.2) - 0.25) / 0.5);
      op(eNight, night); op(eSun, 1 - night); op(eMoon, night); eSun.upd(t);
      op(eHSun, 1 - night); op(eHMoon, night); eHSun.upd(t);
      op(eHDay, 1 - night); op(eHNight, night);
      op(ePan, P(t, at('fernwork') - 0.1, 0.35, linear));
      op(eRow1, P(t, mid('fernwork', 0.05), 0.3, linear));
      op(eAll, P(t, mid('fernwork', 0.2), 0.3, linear));
      tr(eOn1, 1070, 610, 1 + 0.05 * wave(t, 1.2) * AMP);
      op(eRow2, P(t, mid('fernwork', 0.58), 0.3, linear));
      op(eLight, P(t, mid('fernwork', 0.75), 0.3, linear));
      op(eOn2, 1 - night); op(eOff2, night);
      const sh = P(t, mid('shifts', 0.3), 0.4, pop);
      op(eHdr, 1 - clamp(sh * 3)); op(eShift, clamp(sh * 2));
      tr(eShift.b700, 700, 540, Math.max(0.01, P(t, mid('shifts', 0.3), 0.4, pop)));
      tr(eShift.b960, 960, 540, Math.max(0.01, P(t, mid('shifts', 0.62), 0.4, pop)));
      brSet(eFern, t, 'fern', 'happy', t < at('fern2') + 0.6 ? 0.2 : 0);
      brCam(eMitchCam, 230, 380, 1 + 0.12 * P(t, end('shifts'), 0.8, linear) * (RED ? 0.5 : 1));
      brSet(eMitch, t, 'mitch', 'deadpan', 0.85);
    }

    /* --- F: Mitch confessional, side-eye --- */
    const vB = shot(t, CUT_B, at('breath')), vF = shot(t, at('th_fern'), at('opposite'));
    op(Fc, Math.max(vB, vF));
    if (vB > 0) {
      fConf.set(1, t);
      op(fPhoto, 0); op(fNever, 0); tr(fMitch.w, 600, 400); tr(fMug, 830, 520, 0.9);
      brCam(fCam, 600, 390, 1 + 0.32 * P(t, CUT_B, at('breath') - CUT_B, linear) * (RED ? 0.5 : 1));
      brSet(fMitch, t, 'mitch', 'deadpan', 0);
      const np = P(t, at('stare') + 0.05, 0.3, pop);
      op(bNo, clamp(np * 2)); bNo.setAttribute('transform', `translate(1010 390) scale(${Math.max(0.01, np).toFixed(3)}) translate(-1010 -390)`);
    } else if (vF > 0) {
      fConf.set(1, t);
      op(fPhoto, 1); op(bNo, 0); tr(fMitch.w, 420, 410); tr(fMug, 680, 560, 0.8);
      fFern.set({ t: 0.5, mood: 'happy', still: true });
      const side = P(t, mid('th_fern', 0.62), 0.35);
      const push = P(t, mid('th_fern', 0.62), 2.8, linear) * (RED ? 0.5 : 1);
      brCam(fCam, 420, 380, 1 + 0.18 * push);
      brSet(fMitch, t, 'mitch', side > 0.5 ? 'annoyed' : 'deadpan', side * 0.95);
      op(fNever, P(t, mid('th_fern', 0.42), 0.3, linear));
    }

    /* --- G: roughly opposites --- */
    const vG = shot(t, at('opposite'), 1e9);
    op(Gc, vG);
    if (vG > 0) {
      const lp = P(t, at('opposite') - 0.1, 0.4, pop), rp = P(t, at('opposite') + 0.05, 0.4, pop);
      op(gL, clamp(lp * 2)); op(gR, clamp(rp * 2));
      brSet(gGlo, t, '', 'happy', t > mid('opposite', 0.5) ? 0.6 : -0.6);
      [gCO2, gH2O, gO2].forEach((m, i) => m.setAttribute('transform', `translate(${[175, 375, 1040][i]} ${(([420, 412, 420][i]) + 4 * Math.sin(t * 2 + i) * AMP).toFixed(1)})`));
      gArT.set(P(t, mid('opposite', 0.05), 0.8)); op(gTop, P(t, mid('opposite', 0.04), 0.2, linear));
      op(gT1, P(t, mid('opposite', 0.04), 0.3, linear)); op(gT2, P(t, mid('opposite', 0.18), 0.3, linear));
      op(gSun, P(t, mid('opposite', 0.06), 0.3, linear)); gSun.upd(t);
      const store = P(t, mid('opposite', 0.24), 0.5, linear);
      op(gGlow, store * (0.55 + 0.25 * wave(t, 1.2)));
      gArB.set(P(t, mid('opposite', 0.42), 0.8)); op(gBot, P(t, mid('opposite', 0.41), 0.2, linear));
      op(gB1, P(t, mid('opposite', 0.42), 0.3, linear)); op(gB2, P(t, mid('opposite', 0.5), 0.3, linear));
      const rel = P(t, mid('opposite', 0.5), 0.3, linear);
      gFly.forEach((s, i) => { const q = ((t * 0.45 + i / 3) % 1); tr(s, lerp(860, 340, q), 540 + Math.sin(q * Math.PI) * 80, 0.8); op(s, rel * Math.sin(q * Math.PI)); s.upd(t); });
      const op2 = P(t, mid('opposite', 0.72), 0.45, pop);
      op(gOpp, clamp(op2 * 2)); tr(gOpp, 600, 432, Math.max(0.01, op2));
    }
  };
});

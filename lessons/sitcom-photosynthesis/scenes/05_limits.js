/* Scene 5: Kavya tries to help.
   2 PM in the bedroom: Kavya reads her project sheet -> carries her desk lamp to the sill ("You're welcome") ->
   the rate graph rises with the light while the factory belt speeds up, then levels off -> "Is it full?" ->
   Clive: out of Cosmo (the CO2 hopper is empty); the graph labelled light-limited / CO2-limited; Cosmo shrugs ->
   limiting factor = shortest supply (three supply bars) -> the plateau -> Light Cools Things -> the aircon
   compressor; Clive's face -> the temperature graph: enzymes denature above 40-45 °C -> Clive begs -> sunset:
   photosynthesis stops, respiration carries on -> night and day gas exchange panels -> the two opposite
   reactions. */
scene('limits', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed limits) ---------- */
  function limitsPop(el, x, y, p, s, r) { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); }
  function limitsCam(el, k, cx, cy, sx, sy) {
    el.setAttribute('transform', `translate(${(sx ?? cx).toFixed(1)} ${(sy ?? cy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }
  function limitsLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2.5, color: o.color || C.ink, weight: o.weight || 700 });
  }
  // text with real subscripts: 'CO_2 in' -> CO₂ in
  function limitsRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // a pill with rich text (subscripts) centred on its origin
  function limitsRichChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, w = textWidth(str.replace(/_/g, ''), size, FD, 700) + size * 1.4, h = size * 1.75;
    const g = G(parent);
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 2.5 }, g);
    limitsRich(g, 0, size * 0.35, str, { size, fill: o.color || C.ink });
    return g;
  }
  // a cheap potted plant for the diagrams, base of the pot at (0,0), about 200 tall
  function limitsPlant(parent) {
    const g = G(parent);
    E('path', { d: 'M0,-70 C-5,-110 5,-150 0,-190', fill: 'none', stroke: '#2E8A4A', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M0,-110 C-20,-150 -80,-150 -96,-120 C-70,-100 -24,-100 0,-110 Z M0,-140 C20,-180 80,-180 96,-150 C70,-130 24,-130 0,-140 Z M0,-186 C-14,-214 -54,-218 -66,-196 C-46,-180 -16,-180 0,-186 Z M0,-176 C14,-206 50,-214 62,-196 C44,-178 16,-174 0,-176 Z', fill: ball('#7BE08A', C.plantDk), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-48,-74 L48,-74 L38,0 L-38,0 Z M-56,-86 h112 v16 h-112 Z', fill: '#C9643A', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  // a cheap carbon dioxide molecule: 3 elements
  function limitsCO2(parent, r) {
    const g = G(parent), o = r * 0.9;
    E('path', { d: `M${-r * 1.6 - o},0 a${o},${o} 0 1,0 ${2 * o},0 a${o},${o} 0 1,0 ${-2 * o},0 M${r * 1.6 - o},0 a${o},${o} 0 1,0 ${2 * o},0 a${o},${o} 0 1,0 ${-2 * o},0`, fill: C.oxygen, stroke: C.oxygenDk, 'stroke-width': 1.5 }, g);
    E('circle', { r, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 1.5 }, g);
    return g;
  }
  // a cheap glucose ring: 3 elements
  function limitsHex(parent, r) {
    const g = G(parent), pts = phHex(r, true);
    E('path', { d: phPoly(pts), fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': r * 0.1 }, g);
    E('circle', { cx: pts[1][0], cy: pts[1][1], r: r * 0.18, fill: C.oxygen }, g);
    return g;
  }

  // merge static sibling art that the lib draws one element at a time (non-overlapping circles, stroke-only paths
  // with identical styling) into a single path: same look, fewer elements
  function limitsMerge(els) {
    els = Array.from(els).filter(Boolean);
    const byParent = new Map();
    els.forEach(e => { const k = e.parentNode; if (!byParent.has(k)) byParent.set(k, []); byParent.get(k).push(e); });
    byParent.forEach(list => {
      if (list.length < 2) return;
      let d = '';
      list.forEach(e => {
        if (e.tagName === 'circle') { const cx = +(e.getAttribute('cx') || 0), cy = +(e.getAttribute('cy') || 0), r = +e.getAttribute('r'); d += `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 `; }
        else d += e.getAttribute('d') + ' ';
      });
      const p = E('path', {});
      for (const a of Array.from(list[0].attributes)) if (!['cx', 'cy', 'r', 'd'].includes(a.name)) p.setAttribute(a.name, a.value);
      p.setAttribute('d', d);
      list[0].parentNode.insertBefore(p, list[0]);
      list.forEach(e => e.remove());
    });
  }

  const Lbg = G(root), Lcast = G(root), Lfg = G(root);

  /* =====================================================================
     BEDROOM
     ===================================================================== */
  const bedShot = G(Lbg);
  const bedWrap = G(bedShot);
  const bed = phBedroom(bedWrap);
  limitsMerge(bed.querySelectorAll('circle[fill="#2A1A12"]'));   // bubble tea pearls
  limitsMerge(bed.plant.querySelectorAll('path[fill="none"][stroke-width="2.5"]'));   // leaf veins
  const deskLamp = bed.querySelector('path[fill="#FFF3A0"]').parentNode.parentNode;   // the desk lamp, so Kavya can carry it
  const bedDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1B27' }, bedShot);
  const bedFg = G(Lfg);
  const wallClock = phClock(bedFg, 0.9);
  const timeChip = limitsLabel(bedFg, '2:00 PM', { size: 36, color: C.energy, stroke: C.energy });
  const kBodyW = G(Lcast), kBody = scKavyaBody(kBodyW);
  const sheet = G(Lcast);
  E('rect', { x: -78, y: -56, width: 156, height: 112, rx: 4, fill: '#FFF8C4', stroke: '#C9B53A', 'stroke-width': 3 }, sheet);
  T(sheet, 0, -14, 'PROJECT', { size: 28, weight: 800, anchor: 'middle', fill: '#2A3A8A' });
  T(sheet, 0, 28, 'make it faster', { size: 22, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  const moreChip = limitsLabel(bedFg, 'more light = more food?', { size: 34, color: C.energy, stroke: C.energy });
  const fullChip = limitsLabel(bedFg, 'is it full?', { size: 44, color: C.ink, stroke: C.muted });
  const hotChip = limitsLabel(bedFg, 'the aircon compressor: super hot', { size: 32, color: C.heat, stroke: C.heat });

  /* =====================================================================
     FACTORY (rises, notfull, the gasp, crash, dark)
     ===================================================================== */
  const facShot = G(Lbg);
  const facCam = G(facShot);
  const fac = phFactory(facCam);
  limitsMerge(fac.querySelectorAll('circle[r="10"][fill="#5A6B7A"]'));   // belt wheels
  const facGlu = []; for (let i = 0; i < 6; i++) facGlu.push(limitsHex(facCam, 26));
  // the CO2 intake hopper, empty
  const hopper = G(facCam); tr(hopper, 240, 300);
  E('path', { d: 'M-120,-110 L120,-110 L60,40 L60,120 L-60,120 L-60,40 Z', fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, hopper);
  E('path', { d: 'M-100,-96 L100,-96 L48,34 L-48,34 Z', fill: '#1E2A33' }, hopper);
  E('path', { d: 'M-70,-40 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 M-10,-40 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0 M-60,-40 h0', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 3, 'stroke-dasharray': '8 7' }, hopper);
  limitsRich(hopper, 0, -122, 'CO_2 IN', { size: 32, fill: '#E9EEF2' });
  const sign = G(hopper); tr(sign, 0, 70, 1, -6);
  E('rect', { x: -120, y: -36, width: 240, height: 76, rx: 8, fill: '#E8424F', stroke: '#FFFFFF', 'stroke-width': 4 }, sign);
  limitsRich(sign, 0, -4, 'CO_2:', { size: 28, fill: '#FFFFFF' });
  T(sign, 0, 28, 'OUT OF STOCK', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const facDark = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#020806' }, facShot);
  const phGlow = E('ellipse', { rx: 150, ry: 150, fill: glow('#FFF3A0') }, facShot);
  // the mitochondria's window, still lit at night
  const mWin = G(facShot); tr(mWin, 870, 400);
  E('rect', { x: -170, y: -110, width: 340, height: 220, rx: 14, fill: glow('#FFD6A0') }, mWin);
  E('rect', { x: -150, y: -90, width: 300, height: 180, rx: 10, fill: '#FFE6C7', stroke: '#C9A27A', 'stroke-width': 8 }, mWin);
  const mWinMito = mitochondrion(mWin, 220, 96, { folds: 5 });
  E('line', { x1: 0, y1: -90, x2: 0, y2: 90, stroke: '#C9A27A', 'stroke-width': 6 }, mWin);
  const facFg = G(Lfg);
  const lampMeter = G(facFg);
  card(lampMeter, -200, -46, 400, 92, { fill: 'rgba(10,27,39,0.9)', stroke: C.energy, sw: 3, rx: 20 });
  T(lampMeter, -180, 10, 'light', { size: 30, weight: 700, fill: C.energy });
  E('rect', { x: -90, y: -14, width: 270, height: 28, rx: 14, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, lampMeter);
  const lampBar = E('rect', { x: -90, y: -14, width: 0, height: 28, rx: 14, fill: C.energy }, lampMeter);
  const darkChip = limitsLabel(facFg, 'no light: photosynthesis stops', { size: 36, color: C.ink, stroke: C.muted });
  const respChip = limitsLabel(facFg, 'respiration: still on', { size: 34, color: C.mito, stroke: C.mito });
  const crashChip = limitsLabel(facFg, 'shape destroyed → rate crashes', { size: 38, color: '#FF8A94', stroke: '#FF6070' });

  /* =====================================================================
     GRAPHS: the light graph (small, in "rises"; big, for the labels) and the temperature graph
     ===================================================================== */
  const grShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#102A3A', true) }, grShot);
  const smallG = G(Lfg);
  card(smallG, 50, 120, 560, 520, { fill: 'rgba(10,27,39,0.94)', stroke: C.line, sw: 3 });
  const gSmall = phGraph(smallG, 400, 330, { kind: 'plateau', x: 'light intensity' }); tr(gSmall, 160, 540);
  const gDot = E('circle', { r: 10, fill: C.energy, stroke: SC_INK, 'stroke-width': 2 }, smallG);
  const levelChip = limitsLabel(smallG, 'levels off', { size: 30, color: C.ink, stroke: C.muted });
  const bigG = G(Lfg);
  const gBig = phGraph(bigG, 640, 400, { kind: 'plateau', x: 'light intensity' }); tr(gBig, 200, 560);
  gBig.set(1);
  const flatGlow = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 26, 'stroke-linecap': 'round', opacity: 0.35 }, bigG);
  { const pts = []; for (let k = 0; k <= 20; k++) { const [x, y] = gBig.pt(lerp(gBig.kneeP, 1, k / 20)); pts.push([x + 200, y + 560]); } attr(flatGlow, 'd', openPath(pts)); }
  const lblLight = G(bigG);
  { const [px, py] = gBig.pt(0.1); E('line', { x1: 420, y1: 452, x2: px + 200 + 6, y2: py + 560 + 8, stroke: C.energy, 'stroke-width': 3 }, lblLight); E('circle', { cx: px + 200, cy: py + 560, r: 7, fill: C.energy }, lblLight); }
  const lblLightChip = limitsLabel(lblLight, 'light is limiting', { size: 30, color: C.energy, stroke: C.energy }); tr(lblLightChip, 470, 480);
  const lblCO2 = limitsRichChip(bigG, 'CO_2 is limiting', { size: 32, color: C.co2, stroke: C.co2 });
  const normalChip = limitsRichChip(bigG, 'in normal air, CO_2 is often the limiting factor', { size: 30, color: C.co2, stroke: C.co2 });
  const platChip = limitsLabel(bigG, 'plateau', { size: 48, color: C.energy, stroke: C.energy });
  const platSub = limitsLabel(bigG, '= another factor is limiting', { size: 32, color: C.ink, stroke: C.energy });
  const fullX = G(bigG);
  T(fullX, 0, 10, '"the plant is full"', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const fullStrike = strike(fullX, -130, 0, 130);
  const fullCross = cross(fullX, 22); tr(fullCross, 0, -48);
  // temperature graph + an enzyme
  const tempG = G(Lfg);
  const gTemp = phGraph(tempG, 600, 380, { kind: 'temp', x: 'temperature', color: C.heat }); tr(gTemp, 170, 580);
  const peakDash = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: C.heat, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, tempG);
  const peakChip = limitsLabel(tempG, '40–45 °C', { size: 34, color: C.heat, stroke: C.heat });
  const enzCard = G(tempG);
  card(enzCard, 840, 150, 300, 430, { fill: 'rgba(10,27,39,0.92)', stroke: C.line, sw: 3 });
  T(enzCard, 990, 200, 'an enzyme', { size: 30, weight: 700, anchor: 'middle', fill: C.muted });
  const enz = E('path', { d: '', fill: ball('#7FD6FF', '#2A7FB8'), stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, enzCard);
  const enzEye = E('circle', { r: 7, fill: SC_INK }, enzCard);
  const sub_ = limitsHex(enzCard, 22);
  const enzLbl = limitsLabel(enzCard, 'working', { size: 30, color: C.good, stroke: C.good });
  const denLbl = limitsLabel(enzCard, 'denatured', { size: 34, color: '#FF8A94', stroke: '#FF6070' });

  /* =====================================================================
     DEFINE: limiting factor = shortest supply
     ===================================================================== */
  const defG = G(Lfg);
  const defTitle = limitsLabel(defG, 'LIMITING FACTOR', { size: 52, color: C.energy, stroke: C.energy, sw: 4 });
  const defSub = T(defG, 600, 248, '= the factor in **shortest supply**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  const SUP = [['light', 0.82, C.energy], ['CO_2', 0.3, C.co2], ['water', 0.78, C.water]];
  const supRows = SUP.map(([name, v, col], i) => {
    const g = G(defG), y = 330 + i * 76;
    limitsRich(g, 380, y + 12, name, { size: 34, fill: col, anchor: 'end' });
    E('rect', { x: 410, y: y - 20, width: 520, height: 40, rx: 20, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, g);
    const bar = E('rect', { x: 410, y: y - 20, width: 0, height: 40, rx: 20, fill: col }, g);
    return { g, bar, v, y };
  });
  const shortRing = E('rect', { x: 398, y: 386 - 32, width: 544, height: 64, rx: 32, fill: 'none', stroke: '#FF6070', 'stroke-width': 5 }, defG);
  const out1 = G(defG);
  T(out1, 0, 0, 'increase it → **rate rises**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.good });
  const out1T = tick(out1, 16); tr(out1T, 260, -12);
  const out2 = G(defG);
  T(out2, 0, 0, 'increase anything else → **no change**', { size: 36, weight: 600, anchor: 'middle', boldFill: '#FF8A94' });
  const rateMeter = G(defG);
  T(rateMeter, 1060, 300, 'rate', { size: 30, weight: 700, anchor: 'middle', fill: C.good });
  E('rect', { x: 1040, y: 320, width: 40, height: 200, rx: 20, fill: '#0B2230', stroke: C.line, 'stroke-width': 2 }, rateMeter);
  const rateBar = E('rect', { x: 1040, y: 520, width: 40, height: 0, rx: 20, fill: C.good }, rateMeter);

  /* =====================================================================
     LCT: Light Cools Things
     ===================================================================== */
  const lctG = G(Lfg);
  const lctHead = limitsLabel(lctG, '3 limiting factors', { size: 36, color: C.ink, stroke: C.energy });
  const LCT = [['L', 'Light', C.energy, ['light intensity']], ['C', 'Cools', C.co2, ['carbon dioxide', 'concentration']], ['T', 'Things', C.heat, ['temperature']]];
  const lctCards = LCT.map(([L, word, col, lbl], i) => {
    const g = G(lctG), x = 540 + i * 240;
    E('rect', { x: x - 110, y: 180, width: 220, height: 380, rx: 22, fill: 'rgba(10,27,39,0.92)', stroke: col, 'stroke-width': 4 }, g);
    const tx = E('text', { x, y: 262, 'font-size': 76, 'font-weight': 800, 'text-anchor': 'middle', 'font-family': FD, fill: col }, g); tx.textContent = L;
    T(g, x, 306, word, { size: 32, weight: 700, anchor: 'middle', fill: C.ink });
    const ic = G(g); tr(ic, x, 396);
    if (i === 0) { E('path', { d: (() => { let d = ''; for (let k = 0; k < 8; k++) { const a = k * TAU / 8; d += `M${(Math.cos(a) * 40).toFixed(1)},${(Math.sin(a) * 40).toFixed(1)} L${(Math.cos(a) * 54).toFixed(1)},${(Math.sin(a) * 54).toFixed(1)} `; } return d; })(), stroke: C.energy, 'stroke-width': 6, 'stroke-linecap': 'round' }, ic); E('circle', { r: 30, fill: ball('#FFE066', '#F5A300') }, ic); }
    if (i === 1) limitsCO2(ic, 22);
    if (i === 2) { E('rect', { x: -12, y: -60, width: 24, height: 90, rx: 12, fill: '#E9F2F7', stroke: '#8FB0C2', 'stroke-width': 3 }, ic); E('path', { d: 'M-6,30 V-20 a6,6 0 0,1 12,0 V30 Z M-22,40 a22,22 0 1,0 44,0 a22,22 0 1,0 -44,0', fill: C.heat }, ic); }
    const lb = G(g);
    lbl.forEach((s, k) => T(lb, x, 482 + k * 32, s, { size: 26, weight: 700, anchor: 'middle', fill: col }));
    return { g, lb };
  });

  /* =====================================================================
     PANELS: night and day gas exchange; OPPOSITES
     ===================================================================== */
  const panShot = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#102A3A', true) }, panShot);
  const nightP = G(Lfg);
  E('rect', { x: 60, y: 120, width: 520, height: 470, rx: 24, fill: linGrad('#0B1433', '#24305E', true), stroke: '#5A6BB0', 'stroke-width': 4 }, nightP);
  E('path', { d: 'M500,170 a26,26 0 1,0 26,34 a21,21 0 1,1 -26,-34 Z', fill: '#F4F1DE' }, nightP);
  { const r = rng(17); let d = ''; for (let i = 0; i < 12; i++) { const x = 100 + r() * 440, y = 150 + r() * 120; d += `M${x.toFixed(0)},${y.toFixed(0)} m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 `; } E('path', { d, fill: '#FFF7C2' }, nightP); }
  const nPlant = limitsPlant(nightP); tr(nPlant, 320, 520, 1.1);
  const nHead = limitsLabel(nightP, 'NIGHT: respiration only', { size: 30, color: '#DDE6FF', stroke: '#5A6BB0' });
  const nIn = arrow(nightP, 110, 300, 230, 380, { color: C.oxygen, width: 9 });
  const nOut = arrow(nightP, 410, 380, 530, 300, { color: C.co2, width: 9 });
  const nInL = limitsRich(nightP, 140, 284, 'O_2 in', { size: 34, fill: '#FF9A8F' });
  const nOutL = limitsRich(nightP, 500, 284, 'CO_2 out', { size: 34, fill: C.co2 });
  const torch = G(nightP);
  E('path', { d: 'M0,0 L-210,-110 L-210,10 Z', fill: '#FFF3A0', opacity: 0.25 }, torch);
  E('rect', { x: -6, y: -12, width: 46, height: 24, rx: 6, fill: '#5A6B7A', stroke: SC_INK, 'stroke-width': 3 }, torch);
  const dayP = G(Lfg);
  E('rect', { x: 620, y: 120, width: 520, height: 470, rx: 24, fill: linGrad('#6EC3F5', '#D2F0FF', true), stroke: '#FFFFFF', 'stroke-width': 4 }, dayP);
  E('circle', { cx: 700, cy: 200, r: 70, fill: glow('#FFE45C') }, dayP);
  E('circle', { cx: 700, cy: 200, r: 30, fill: '#FFE45C' }, dayP);
  const dPlant = limitsPlant(dayP); tr(dPlant, 880, 520, 1.1);
  const dHead = limitsLabel(dayP, 'DAY', { size: 30, color: '#14243A', fill: 'rgba(255,255,255,0.9)', stroke: '#FFFFFF' });
  const dIn = arrow(dayP, 650, 300, 790, 380, { color: '#5A6B7A', width: 16, head: 46 });
  const dOut = arrow(dayP, 970, 380, 1110, 300, { color: C.oxygen, width: 16, head: 46 });
  const dInL = limitsRich(dayP, 700, 286, 'CO_2 in', { size: 38, fill: '#2A3A57' });
  const dOutL = limitsRich(dayP, 1060, 286, 'O_2 out', { size: 38, fill: '#B5372D' });
  const dSmall = G(dayP);
  arrow(dSmall, 680, 470, 790, 450, { color: C.oxygenDk, width: 4 });
  arrow(dSmall, 970, 450, 1080, 470, { color: '#5A6B7A', width: 4 });
  T(dSmall, 1000, 548, 'respiration (small)', { size: 26, weight: 700, anchor: 'middle', fill: '#2A3A57' });
  const fasterChip = limitsLabel(Lfg, 'photosynthesis faster than respiration', { size: 34, color: C.plant, stroke: C.plant });
  // opposites
  const oppG = G(Lfg);
  const box = (x, l1, l2, col) => { const g = G(oppG); E('rect', { x: x - 165, y: 290, width: 330, height: 170, rx: 20, fill: 'rgba(10,27,39,0.94)', stroke: col, 'stroke-width': 4 }, g); T(g, x, 362, l1, { size: 38, weight: 800, anchor: 'middle', fill: col }); T(g, x, 412, l2, { size: 38, weight: 800, anchor: 'middle', fill: col }); return g; };
  const oL = box(240, 'carbon dioxide', '+ water', C.co2), oR = box(960, 'glucose', '+ oxygen', C.glucose);
  const oTop = G(oppG);
  T(oTop, 600, 236, 'PHOTOSYNTHESIS', { size: 38, weight: 800, anchor: 'middle', fill: C.plant });
  T(oTop, 600, 276, 'stores energy · needs light', { size: 27, weight: 700, anchor: 'middle', fill: C.ink });
  const oTopA = arrow(oTop, 418, 326, 782, 326, { color: C.plant, width: 10, head: 32 });
  const oBot = G(oppG);
  const oBotA = arrow(oBot, 782, 424, 418, 424, { color: C.mito, width: 10, head: 32 });
  T(oBot, 600, 488, 'RESPIRATION', { size: 38, weight: 800, anchor: 'middle', fill: C.mito });
  T(oBot, 600, 528, 'releases energy · all the time', { size: 27, weight: 700, anchor: 'middle', fill: C.ink });
  const oSparkA = spark(oppG, 16, { seed: 1 }), oSparkB = spark(oppG, 16, { seed: 3 });
  const oppChip = limitsLabel(oppG, 'almost exact opposites', { size: 40, color: C.energy, stroke: C.energy });

  /* =====================================================================
     the cast
     ===================================================================== */
  const kav = cast(Lcast, 'kavya', { mood: 'smug' });
  const clive = cast(Lcast, 'clive', { mood: 'deadpan' });
  const phyl = cast(Lcast, 'phyllis', { mood: 'happy' });
  const cosmo = cast(Lcast, 'cosmo', { mood: 'smug' });
  const gus = cast(Lcast, 'gus', { mood: 'happy' });
  nightP.appendChild(gus); nightP.appendChild(torch);   // Gus holds his torch inside the night panel

  /* ---------- cut list ---------- */
  const CUTS = [
    [-1, 'two'], [at('lamp') - 0.08, 'lamp'], [mid('lamp', 0.78), 'lampK'], [at('rises') - 0.08, 'rises'],
    [at('full') - 0.08, 'full'], [at('notfull') - 0.08, 'notfull'], [mid('notfull', 0.42), 'graph'],
    [at('define') - 0.08, 'define'], [at('plateau') - 0.08, 'plateau'], [at('lct') - 0.08, 'lct'],
    [at('hot') - 0.08, 'hot'], [end('hot') + 0.12, 'gasp'], [at('enzymes') - 0.08, 'enz'], [at('crash') - 0.08, 'crash'],
    [at('sunset') - 0.08, 'sunset'], [mid('sunset', 0.5), 'dark'], [at('night') - 0.08, 'panels'], [at('opposite') - 0.08, 'opp'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const VIS = [bedShot, bedFg, kBodyW, sheet, facShot, facFg, grShot, smallG, bigG, tempG, defG, lctG, panShot, nightP, dayP, fasterChip, oppG,
    kav, clive, phyl, cosmo, facDark, phGlow, mWin, hopper, bedDim];
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, Lfg);

  // belt displacement: the integral of its speed (speed follows the rate of photosynthesis)
  const rStart = at('rises') + 0.2, rDur = mid('rises', 0.62) - rStart;
  const lightP = t => P(t, rStart, rDur, linear);
  const rateOf = p => 1 - Math.exp(-5.2 * p * 0.98) ;
  const beltV = t => 40 + 200 * rateOf(lightP(t));
  function beltD(t) { let d = 0; const t0 = at('rises') - 0.1; for (let u = t0; u < t; u += 0.05) d += beltV(u) * Math.min(0.05, t - u); return d; }

  return t => {
    const [c0, shot] = cutAt(t);
    const vis = new Set(), show = (...e) => e.forEach(x => vis.add(x));
    const ct = talk(t, 'clive');

    /* ---------------- BEDROOM ---------------- */
    if (['two', 'lamp', 'lampK', 'full', 'hot', 'sunset'].includes(shot)) {
      show(bedShot, bedFg);
      const night = shot === 'sunset' ? P(t, at('sunset'), (mid('sunset', 0.45) - at('sunset')), ease) : 0;
      // where the desk lamp is
      let lampOn = 0;
      const tPick = mid('lamp', 0.12), tWalk = mid('lamp', 0.2), tDrop = mid('lamp', 0.55), tSet = mid('lamp', 0.64);
      const onSill = (shot === 'lamp' && t >= tSet) || shot === 'lampK' || shot === 'full';
      let kx = 1060;
      if (shot === 'lamp') kx = lerp(1070, 680, P(t, tWalk, tDrop - tWalk, ease));
      if (shot === 'lamp' && t >= tPick && t < tSet) {
        const drop = P(t, tDrop, tSet - tDrop, ease);
        tr(deskLamp, lerp(kx - 110, 560, drop), lerp(lerp(500, 570, P(t, tPick, tWalk - tPick, ease)), 480, drop));
      } else if (onSill) tr(deskLamp, 560, 480);
      else tr(deskLamp, 960, 500);
      if (onSill) lampOn = shot === 'lamp' ? P(t, mid('lamp', 0.7), 0.15, linear) : 1;
      bed.set({ t, night, lamp: lampOn, hot: shot === 'hot' ? 1 : 0 });
      if (shot === 'hot') tr(bed.plant, 650, 700); else tr(bed.plant, 330, 480);
      bed.plant.set({ t });
      op(bedDim, 0);
      // camera
      if (shot === 'lampK' || shot === 'full') limitsCam(bedWrap, 1.45, 430, 380, 470, 400);
      else if (shot === 'hot') limitsCam(bedWrap, 1.25, 600, 400, 560, 380);
      else limitsCam(bedWrap, 1 + 0.03 * P(t, c0, 4, linear), 600, 400);
      // clock + time chip
      const clockOn = shot === 'two' || shot === 'sunset';
      op(wallClock, clockOn ? 1 : 0); op(timeChip, 0);
      if (clockOn) {
        wallClock.set(shot === 'two' ? 14 : lerp(18.5, 19, P(t, at('sunset'), 2, linear)));
        tr(wallClock, 1010, 190, 0.9);
        setText(timeChip.label, shot === 'two' ? '2:00 PM' : '7:00 PM');
        limitsPop(timeChip, 1010, 290, P(t, (shot === 'two' ? at('two') : at('sunset')) + 0.1, 0.4, pop));
      }
      // Kavya, full body (two, lamp)
      if (shot === 'two' || shot === 'lamp') {
        show(kBodyW);
        tr(kBodyW, kx, 702, 1.6);
        const walking = shot === 'lamp' && t >= tWalk && t < tDrop;
        if (walking) kBody.pose(walkPose(t, 1.1));
        else if (shot === 'two') kBody.pose({ lean: 0, armL: [30, 95], armR: [-30, -95] });
        else if (shot === 'lamp' && t >= tDrop) kBody.pose({ lean: -4, armL: [8, 10], armR: [70, 30] });
        else kBody.pose({ lean: 0, armL: [8, 10], armR: [40, 40] });
        if (shot === 'two') { show(sheet); tr(sheet, kx, 702 - 118 * 1.6, 1, -3 + Math.sin(t * 1.3) * 1.5 * AMP); }
      }
      limitsPop(moreChip, 960, 200, shot === 'lamp' ? P(t, at('lamp') + 0.1, 0.4, pop) * (1 - P(t, tDrop, 0.25, linear)) : 0);
      if (shot === 'lampK' || shot === 'full' || shot === 'hot') {
        show(kav);
        let mood = 'smug', look = 0, kxx = 920, ky = 600, s = 1.55;
        if (shot === 'full') { mood = t > mid('full', 0.4) ? 'sad' : 'neutral'; look = t < mid('full', 0.5) ? -0.8 : 0; }
        if (shot === 'hot') { look = t < mid('hot', 0.75) ? -1 : 0; kxx = 940; }
        tr(kav, kxx, ky, s * (shot === 'full' ? 1 + 0.06 * P(t, end('full'), 0.9, easeOut) : 1));
        kav.set({ t, talk: talk(t, 'kavya'), mood, look });
      }
      limitsPop(fullChip, 300, 200, shot === 'full' ? P(t, mid('full', 0.45), 0.4, pop) : 0);
      limitsPop(hotChip, 560, 190, shot === 'hot' ? P(t, mid('hot', 0.45), 0.4, pop) : 0);
    }

    /* ---------------- FACTORY ---------------- */
    if (['rises', 'notfull', 'gasp', 'crash', 'dark'].includes(shot)) {
      show(facShot, facFg);
      op(lampMeter, 0); op(darkChip, 0); op(respChip, 0); op(crashChip, 0);
      facGlu.forEach(m => op(m, 0)); op(hopper, 0);
      if (shot === 'rises') {
        limitsCam(facCam, 1.4, 650, 560, 600, 375);
        const D = beltD(t);
        // belt dashes follow D: the belt speed is chosen so that t * belt = D
        fac.set({ t, light: 1, belt: t > 0 ? D / t : 0 });
        facGlu.forEach((m, i) => {
          const u = ((D / 360) + i / facGlu.length) % 1, x = 800 + u * 360;
          op(m, Math.min(1, u * 12, (1 - u) * 8)); tr(m, x, 618 - 30 * Math.max(0, 0.08 - u) * 12, Math.max(0.01, Math.min(1, u * 14)), u * 300);
        });
        show(smallG);
        const lp = lightP(t);
        gSmall.set(lp);
        const [dx, dy] = gSmall.pt(lp); attr(gDot, 'cx', 160 + dx); attr(gDot, 'cy', 540 + dy); op(gDot, lp > 0 ? 1 : 0);
        limitsPop(levelChip, 470, 200, P(t, mid('rises', 0.7), 0.4, pop));
        op(lampMeter, 1); tr(lampMeter, 880, 160); attr(lampBar, 'width', 270 * Math.min(1, P(t, rStart, rDur * 1.1, linear) * 1.05 + 0.05 * P(t, mid('rises', 0.62), 2, linear)));
      } else {
        limitsCam(facCam, 1, 600, 375);
        if (shot === 'notfull') {
          fac.set({ t, light: 1, belt: 70 });
          show(hopper, phGlow, phyl, clive);
          tr(clive, 610, 470, 1.0); clive.set({ t, talk: ct, mood: 'deadpan', look: t > mid('notfull', 0.2) ? -0.7 : 0 });
          tr(phyl, 950, 400, 0.62); phyl.set({ t, mood: 'happy', look: -0.7 });
          tr(phGlow, 950, 400, 1 + 0.08 * Math.sin(t * 3) * AMP);
          op(sign, 1); tr(sign, Math.sin(t * 3) * 2 * AMP, 70, 1, -6 + Math.sin(t * 2) * 2 * AMP);
        } else if (shot === 'gasp' || shot === 'crash') {
          fac.set({ t, light: 1, belt: 60 });
          limitsCam(facCam, 1.5, 450, 520, 600, 375);
          show(clive);
          const crash = shot === 'crash';
          const k = crash ? 1 + 0.1 * P(t, mid('crash', 0.6), at('sunset') - mid('crash', 0.6), easeOut) : 1 + 0.08 * P(t, c0, 0.8, easeOut);
          const shake = (crash ? 3 : 6) * Math.sin(t * 40) * AMP;
          tr(clive, 600 + shake, 470, 1.5 * k);
          const mood = crash ? (t < mid('crash', 0.45) ? 'shock' : 'sad') : 'shock';
          clive.set({ t, talk: ct, mood, look: 0, sweat: 1 });
          if (crash) limitsPop(crashChip, 600, 150, P(t, at('crash') + 0.1, 0.4, pop));
        } else if (shot === 'dark') {
          fac.set({ t, light: 0, belt: 0 });
          show(facDark, mWin);
          op(facDark, 0.5 * P(t, c0, 0.4, linear));
          limitsPop(darkChip, 560, 160, P(t, c0 + 0.1, 0.4, pop));
          const wp = P(t, mid('sunset', 0.72), 0.4, pop);
          op(mWin, clamp(wp * 3)); tr(mWin, 870, 400, Math.max(0.01, 0.8 + 0.2 * wp));
          tr(mWinMito, 0, 0, 1 + 0.03 * Math.sin(t * 3));
          limitsPop(respChip, 870, 560, P(t, mid('sunset', 0.78), 0.4, pop));
        }
      }
    }

    /* ---------------- GRAPHS ---------------- */
    if (shot === 'graph' || shot === 'plateau') {
      show(grShot, bigG);
      const isG = shot === 'graph';
      op(lblLight, isG ? P(t, c0 + 0.1, 0.3, linear) : 0.25);
      limitsPop(lblCO2, 700, 196, isG ? P(t, mid('notfull', 0.58), 0.4, pop) : 0);
      limitsPop(normalChip, 560, 680, isG ? P(t, mid('notfull', 0.78), 0.4, pop) : 0);
      op(flatGlow, isG ? 0 : 0.35 + 0.25 * Math.sin(t * 4) * AMP);
      if (isG) {
        show(cosmo);
        const sp = P(t, mid('notfull', 0.76), 0.4, pop), shrug = Math.max(0, Math.sin((t - mid('notfull', 0.85)) * 9)) * (t > mid('notfull', 0.85) && t < mid('notfull', 0.85) + 0.7 ? 1 : 0);
        op(cosmo, clamp(sp * 3)); tr(cosmo, 1030, 470 - 14 * shrug, Math.max(0.01, 0.6 * sp));
        cosmo.set({ t, mood: 'smug', look: -0.5 });
        show(clive); tr(clive, 1090, 676, 0.42); clive.set({ t, talk: ct, mood: 'deadpan', look: -0.6 });
      } else {
        show(clive);
        tr(clive, 1070, 640, 0.5); clive.set({ t, talk: ct, mood: 'neutral', look: -0.6 });
      }
      limitsPop(platChip, 700, 166, isG ? 0 : P(t, mid('plateau', 0.2), 0.4, pop));
      limitsPop(platSub, 680, 342, isG ? 0 : P(t, mid('plateau', 0.55), 0.4, pop));
      limitsPop(fullX, 1010, 470, isG ? 0 : P(t, mid('plateau', 0.62), 0.4, pop));
      fullStrike.set(isG ? 0 : P(t, mid('plateau', 0.72), 0.3, linear));
      limitsPop(fullCross, 0, -48, isG ? 0 : P(t, mid('plateau', 0.78), 0.3, pop));
    }
    if (shot === 'enz') {
      show(grShot, tempG, clive);
      const gp = P(t, at('enzymes') + 0.1, mid('enzymes', 0.35) - at('enzymes'), linear) * gTemp.kneeP + P(t, mid('enzymes', 0.68), 0.8, linear) * (1 - gTemp.kneeP);
      gTemp.set(gp);
      const [px, py] = gTemp.pt(gTemp.kneeP);
      attr(peakDash, 'x1', 170 + px); attr(peakDash, 'x2', 170 + px); attr(peakDash, 'y1', 580 + py + 14); attr(peakDash, 'y2', 580);
      op(peakDash, P(t, mid('enzymes', 0.55), 0.3, linear));
      limitsPop(peakChip, 170 + px, 580 + py - 44, P(t, mid('enzymes', 0.55), 0.4, pop));
      // the enzyme: chomps while working, melts when it denatures
      const ep = P(t, mid('enzymes', 0.3), 0.4, pop), den = P(t, mid('enzymes', 0.75), 0.8, ease);
      op(enzCard, 1); op(enz, clamp(ep * 3)); op(enzEye, clamp(ep * 3) * (1 - den));
      const chomp = (0.5 + 0.5 * Math.sin(t * 9)) * (1 - den), mouth = 0.15 + 0.45 * chomp, cx = 990, cy = 340, R = 70;
      const pts = [];
      for (let k = 0; k <= 28; k++) {
        const a = mouth + (TAU - 2 * mouth) * k / 28;
        const wob = den * (18 * Math.sin(a * 3 + t * 2) + 10 * Math.sin(a * 5 - t * 3));
        pts.push([cx + Math.cos(a) * (R + wob) , cy + Math.sin(a) * (R + wob) * (1 - 0.25 * den) + den * 20]);
      }
      const mouthPt = [cx + 10 * den, cy + den * 20];
      attr(enz, 'd', 'M' + mouthPt[0].toFixed(1) + ',' + mouthPt[1].toFixed(1) + ' L' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z');
      attr(enzEye, 'cx', cx + 14); attr(enzEye, 'cy', cy - 34);
      const sx = lerp(1110, cx + 40, (t * 0.8) % 1);
      op(sub_, ep * (1 - den)); tr(sub_, (den > 0 ? cx + 70 : sx), cy, 1, t * 60);
      limitsPop(enzLbl, 990, 470, ep * (1 - P(t, mid('enzymes', 0.75), 0.2, linear)));
      limitsPop(denLbl, 990, 470, P(t, mid('enzymes', 0.85), 0.4, pop));
      tr(clive, 1080, 676, 0.42); clive.set({ t, talk: ct, mood: t > mid('enzymes', 0.75) ? 'shock' : 'neutral', look: -0.6, sweat: t > mid('enzymes', 0.75) ? 1 : 0 });
    }

    /* ---------------- DEFINE ---------------- */
    if (shot === 'define') {
      show(grShot, defG);
      limitsPop(defTitle, 600, 166, P(t, at('define') + 0.05, 0.4, pop));
      op(defSub, P(t, mid('define', 0.15), 0.3, linear));
      const up1 = P(t, mid('define', 0.5), 0.8, ease), up2 = P(t, mid('define', 0.78), 0.8, ease);
      supRows.forEach((r, i) => {
        const v = r.v + (i === 1 ? 0.3 * up1 : 0) + (i === 0 ? 0.18 * up2 : 0);
        attr(r.bar, 'width', 520 * v * P(t, mid('define', 0.12 + i * 0.05), 0.6, easeOut));
      });
      op(shortRing, P(t, mid('define', 0.3), 0.3, linear) * (0.6 + 0.4 * Math.sin(t * 6)));
      limitsPop(out1, 600, 590, P(t, mid('define', 0.5), 0.4, pop));
      limitsPop(out2, 600, 660, P(t, mid('define', 0.78), 0.4, pop));
      op(rateMeter, P(t, mid('define', 0.45), 0.3, linear));
      const rate = 0.3 + 0.3 * up1;
      attr(rateBar, 'y', 520 - 200 * rate); attr(rateBar, 'height', 200 * rate);
    }

    /* ---------------- LCT ---------------- */
    if (shot === 'lct') {
      show(bedShot, bedDim, lctG, kav);
      bed.set({ t, night: 0, lamp: 1 }); tr(deskLamp, 560, 480); limitsCam(bedWrap, 1, 600, 400);
      op(bedDim, 0.72);
      limitsPop(lctHead, 780, 130, P(t, at('lct') + 0.1, 0.4, pop));
      lctCards.forEach((c, i) => {
        const p = P(t, mid('lct', 0.2 + i * 0.07), 0.4, pop);
        op(c.g, clamp(p * 3)); c.g.setAttribute('transform', `translate(${540 + i * 240} 370) scale(${Math.max(0.01, 0.7 + 0.3 * p).toFixed(3)}) translate(${-(540 + i * 240)} -370)`);
        op(c.lb, P(t, mid('lct', [0.5, 0.66, 0.88][i]), 0.3, linear));
      });
      tr(kav, 200, 600, 1.2); kav.set({ t, talk: talk(t, 'kavya'), mood: 'happy', look: 0.4 });
    }

    /* ---------------- PANELS ---------------- */
    if (shot === 'panels') {
      show(panShot, nightP);
      const np = P(t, at('night') - 0.05, 0.35, pop);
      nightP.setAttribute('transform', `translate(320 355) scale(${Math.max(0.01, 0.85 + 0.15 * np).toFixed(3)}) translate(-320 -355)`);
      op(nightP, clamp(np * 3) * (t > at('day') - 0.08 ? 0.75 : 1));
      nIn.set(P(t, mid('night', 0.45), 0.5, linear)); op(nInL, P(t, mid('night', 0.45), 0.3, linear));
      nOut.set(P(t, mid('night', 0.75), 0.5, linear)); op(nOutL, P(t, mid('night', 0.75), 0.3, linear));
      limitsPop(nHead, 320, 166, P(t, at('night') + 0.2, 0.4, pop));
      tr(gus, 470, 520, 0.42); gus.set({ t, talk: talk(t, 'gus'), mood: 'happy', look: t > at('day') ? 1 : -0.5 });
      tr(torch, 430, 520, 1, -8 + Math.sin(t * 1.5) * 4 * AMP);
      if (t >= at('day') - 0.08) {
        show(dayP, fasterChip, clive);
        const dp = P(t, at('day') - 0.08, 0.35, pop);
        dayP.setAttribute('transform', `translate(880 355) scale(${Math.max(0.01, 0.85 + 0.15 * dp).toFixed(3)}) translate(-880 -355)`);
        op(dayP, clamp(dp * 3));
        dIn.set(P(t, mid('day', 0.3), 0.5, linear)); op(dInL, P(t, mid('day', 0.3), 0.3, linear));
        dOut.set(P(t, mid('day', 0.5), 0.5, linear)); op(dOutL, P(t, mid('day', 0.5), 0.3, linear));
        op(dSmall, P(t, mid('day', 0.15), 0.4, linear));
        limitsPop(dHead, 880, 166, P(t, at('day') + 0.1, 0.4, pop));
        limitsPop(fasterChip, 560, 660, P(t, mid('day', 0.25), 0.4, pop));
        tr(clive, 1090, 676, 0.45); clive.set({ t, talk: ct, mood: 'neutral', look: -0.6 });
      }
    }

    /* ---------------- OPPOSITES ---------------- */
    if (shot === 'opp') {
      show(panShot, oppG);
      limitsPop(oL, 0, 0, P(t, at('opposite') + 0.05, 0.4, pop)); tr(oL, 0, 0);
      limitsPop(oR, 0, 0, P(t, at('opposite') + 0.15, 0.4, pop)); tr(oR, 0, 0);
      const ta = P(t, mid('opposite', 0.08), 0.7, ease), ba = P(t, mid('opposite', 0.42), 0.7, ease);
      op(oTop, P(t, mid('opposite', 0.06), 0.3, linear)); oTopA.set(ta);
      op(oBot, P(t, mid('opposite', 0.4), 0.3, linear)); oBotA.set(ba);
      const ua = ((t - mid('opposite', 0.2)) * 0.5) % 1, ub = ((t - mid('opposite', 0.55)) * 0.5) % 1;
      op(oSparkA, t > mid('opposite', 0.2) ? Math.min(1, ua * 6, (1 - ua) * 6) : 0); tr(oSparkA, lerp(430, 770, ua), 326); oSparkA.upd(t);
      op(oSparkB, t > mid('opposite', 0.55) ? Math.min(1, ub * 6, (1 - ub) * 6) : 0); tr(oSparkB, lerp(770, 430, ub), 424); oSparkB.upd(t);
      limitsPop(oppChip, 600, 640, P(t, mid('opposite', 0.78), 0.4, pop));
    }

    op(blackout, 1 - P(t, at('two') - 0.15, 0.3, linear));
    VIS.forEach(e => { if (!vis.has(e)) op(e, 0); else if (e !== nightP && e !== dayP && e !== facDark && e !== mWin && e !== cosmo && e !== bedDim) op(e, 1); });
    if (vis.has(bedShot) && shot !== 'lct') op(bedDim, 0);
  };
});

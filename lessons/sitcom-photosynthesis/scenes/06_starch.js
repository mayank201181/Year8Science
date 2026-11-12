/* Scene 6: The starch inspection.
   Shots: the school lab on Friday (goggles, "PROVE IT") -> destarching in a dark cupboard -> Kavya: "It was in my
   wardrobe" (inset: Plant between the hanging clothes) -> Clive's haunted "We remember." (one sad sock) -> the foil
   strip, back in the bedroom -> step 1 boil in water -> Clive: "That's Kevin's leaf." (a hard hat floats up) ->
   step 2 ethanol in a water bath, the leaf goes pale -> Phyllis, outraged, inside the ethanol -> safety: flammable,
   Bunsen OFF -> steps 3 and 4: warm water, iodine drops -> We End With Iodine -> the result: blue-black except the
   foil strip -> controls: variegated leaf, soda lime -> "Plant does not do nothing." -> food chain to chicken rice
   -> Olive: the oxygen you breathe -> Olive, main character (headphones off, spotlight) -> Clive: "unbearable". */
scene('starch', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed st) ---------- */
  // camera: scale k about the point (fx, fy) of el and put that point at screen (sx, sy)
  function stCam(el, k, fx, fy, sx, sy) {
    el.setAttribute('transform', `translate(${(sx === undefined ? fx : sx).toFixed(1)} ${(sy === undefined ? fy : sy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`);
  }
  function stPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); }
  // dark pill label that reads over any background
  function stLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 28, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  // text with real subscripts: 'CO_2' -> CO₂
  function stRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
    str.split(/_(\d+)/).forEach((seg, i) => {
      if (!seg) return;
      const ts = E('tspan', i % 2 ? { 'font-size': sub, dy } : (i > 0 ? { dy: -dy } : {}), t); ts.textContent = seg;
    });
    return t;
  }
  // a leaf with the starch-test outline, filled in whatever colour we set (for the soda-lime leaf)
  function stLeaf(parent, s) {
    const g = G(parent), inner = G(g); tr(inner, 0, 0, s);
    const L = 'M-150,0 C-110,-92 70,-100 150,0 C70,100 -110,92 -150,0 Z';
    E('path', { d: 'M-150,0 L-210,14', stroke: '#6B8E4E', 'stroke-width': 8, 'stroke-linecap': 'round' }, inner);
    const body = E('path', { d: L, fill: '#3FAE5A', stroke: SC_INK, 'stroke-width': 4 }, inner);
    E('path', { d: 'M-150,0 C-60,-6 60,-6 150,0', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.45 }, inner);
    g.set = col => attr(body, 'fill', col);
    return g;
  }
  // safety goggles on Kavya's head and shoulders (drawn into her bobbing group)
  function stGoggles(ch) {
    const g = G(ch.firstChild);
    E('path', { d: 'M-76,-28 Q0,-38 76,-28', fill: 'none', stroke: '#2A3A8A', 'stroke-width': 8 }, g);
    E('rect', { x: -60, y: -50, width: 120, height: 54, rx: 22, fill: 'rgba(190,230,255,0.28)', stroke: '#3F5BD9', 'stroke-width': 6 }, g);
    E('path', { d: 'M-46,-40 L-28,-40', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.8, 'stroke-linecap': 'round' }, g);
    return g;
  }
  // a little yellow hard hat (Kevin's)
  function stHat(parent) {
    const g = G(parent);
    E('path', { d: 'M-24,0 Q-23,-28 0,-29 Q23,-28 24,0 Z', fill: '#FFC93C', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('rect', { x: -32, y: -4, width: 64, height: 8, rx: 4, fill: '#FFB000', stroke: SC_INK, 'stroke-width': 3 }, g);
    return g;
  }
  // a flame icon (for "flammable" and "flame OFF")
  const FLAME = 'M0,30 C-24,30 -30,8 -20,-8 C-14,-18 -8,-22 -6,-36 C6,-26 4,-14 10,-10 C14,-18 14,-24 12,-30 C26,-16 30,4 22,18 C16,27 8,30 0,30 Z';
  // seat a character in a slot group (it moves between shots)
  function stSeat(ch, slot) { if (ch.parentNode !== slot) slot.appendChild(ch); }

  /* ---------- the cast (one of each; seated in whichever shot is on) ---------- */
  const castHold = G(root); op(castHold, 0);
  const kav = cast(castHold, 'kavya', { mood: 'neutral' });
  const gog = stGoggles(kav);
  const clive = cast(castHold, 'clive', { mood: 'deadpan' });
  const phyl = cast(castHold, 'phyllis', { mood: 'smug' });
  const olive = cast(castHold, 'olive', { mood: 'deadpan' });
  // Olive's own headphones (to take them off) and a copy we can lift away
  const oIn = olive.firstChild;
  const oPhones = [oIn.children[0]].concat([...oIn.querySelectorAll('rect')].filter(r => r.getAttribute('fill') === '#2A2430' || r.getAttribute('fill') === '#FF5FA2'));
  const oLift = G(oIn);
  E('path', { d: 'M-120,-6 Q-124,-136 0,-138 Q124,-136 120,-6', fill: 'none', stroke: '#1E1A22', 'stroke-width': 11, 'stroke-linecap': 'round' }, oLift);
  [-1, 1].forEach(sd => { E('rect', { x: sd * 124 - 16, y: -34, width: 32, height: 58, rx: 12, fill: '#2A2430', stroke: SC_INK, 'stroke-width': 4 }, oLift); E('rect', { x: sd * 124 - 6, y: -24, width: 12, height: 38, rx: 6, fill: '#FF5FA2' }, oLift); });
  op(oLift, 0);

  /* =====================================================================
     THE LAB (a world with a camera): tiled wall, bench, Plant, equipment
     ===================================================================== */
  const BY = 560;   // bench top
  const labShot = G(root), world = G(labShot);
  const wWall = G(world), wKav = G(world), wBench = G(world), wPlant = G(world), wTile = G(world), wLeaf = G(world), wEq = G(world), wCards = G(world);
  E('rect', { x: -200, y: -200, width: 1900, height: 1150, fill: linGrad('#E6EEF3', '#C9D7E0', true) }, wWall);
  { let d = ''; for (let x = -180; x <= 1680; x += 60) d += `M${x},-200 L${x},${BY} `; for (let y = -180; y <= BY; y += 60) d += `M-200,${y} L1700,${y} `; E('path', { d, stroke: '#B7C7D2', 'stroke-width': 2 }, wWall); }
  // safety poster (left wall)
  const poster = G(wWall); tr(poster, 118, 300);
  E('rect', { x: -84, y: -96, width: 168, height: 192, rx: 8, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, poster);
  E('rect', { x: -84, y: -96, width: 168, height: 44, rx: 8, fill: '#E8424F' }, poster);
  T(poster, 0, -64, 'SAFETY', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  E('rect', { x: -46, y: -28, width: 92, height: 40, rx: 16, fill: 'rgba(190,230,255,0.6)', stroke: '#3F5BD9', 'stroke-width': 5 }, poster);
  T(poster, 0, 58, 'GOGGLES', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  // calendar (Friday)
  const calendar = G(wWall); tr(calendar, 1078, 180);
  E('rect', { x: -76, y: -64, width: 152, height: 136, rx: 10, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, calendar);
  E('rect', { x: -76, y: -64, width: 152, height: 36, rx: 10, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4 }, calendar);
  E('path', { d: 'M-40,-76 L-40,-52 M40,-76 L40,-52', stroke: SC_INK, 'stroke-width': 6, 'stroke-linecap': 'round' }, calendar);
  T(calendar, 0, 26, 'FRIDAY', { size: 32, weight: 800, anchor: 'middle', fill: SC_INK });
  // bench and cupboards
  E('rect', { x: -200, y: BY, width: 1900, height: 34, fill: '#38444F', stroke: SC_INK, 'stroke-width': 4 }, wBench);
  E('rect', { x: -200, y: BY + 34, width: 1900, height: 400, fill: '#8A6A4A' }, wBench);
  { let d = '', h = ''; for (let x = -180; x < 1700; x += 200) { d += `M${x + 10},${BY + 54} h180 v170 h-180 Z `; h += `M${x + 84},${BY + 84} h32 `; } E('path', { d, fill: '#9A7A58', stroke: '#5E4430', 'stroke-width': 3 }, wBench); E('path', { d: h, stroke: '#D9DEE3', 'stroke-width': 7, 'stroke-linecap': 'round' }, wBench); }
  // Plant on the bench
  const beamF = E('path', { d: 'M40,-200 L300,-200 L480,430 L330,470 Z', fill: '#FFF3A0', opacity: 0.3 }, wPlant);   // sunlight (the foil shot)
  const plantSlotW = G(wPlant);
  const lPlant = phPlant(plantSlotW, 1.0);   // the one Plant, moved between shots
  // Clive, small, on Plant (kevin), with a pointing arm
  const cliveSlot = G(wPlant);
  const cArm = G(wPlant);
  E('path', { d: 'M0,0 L44,-10', stroke: SC_INK, 'stroke-width': 9, 'stroke-linecap': 'round' }, cArm);
  E('path', { d: 'M0,0 L44,-10', stroke: '#74DE8A', 'stroke-width': 5, 'stroke-linecap': 'round' }, cArm);
  E('circle', { cx: 48, cy: -11, r: 6, fill: '#74DE8A', stroke: SC_INK, 'stroke-width': 2.5 }, cArm);
  // Kavya's slot, behind the bench
  const kavLab = G(wKav);

  // step 1: Bunsen, tripod and gauze, beaker of boiling water
  const bun = bunsen(wEq, 0.7);
  const tripod = G(wEq);
  tr(tripod, 560, 0);
  E('path', { d: `M-70,${BY} L-56,412 M70,${BY} L56,412 M0,${BY - 6} L0,412`, stroke: '#5A6B7A', 'stroke-width': 7, 'stroke-linecap': 'round' }, tripod);
  E('rect', { x: -86, y: 404, width: 172, height: 10, rx: 3, fill: '#9AA6B2', stroke: '#5A6B7A', 'stroke-width': 2 }, tripod);
  const boilBk = G(wEq); tr(boilBk, 560, 0);
  const bk1 = beaker(boilBk, 220, 190, { level: 0.7, liquid: '#9FD8FF', opacity: 0.5 }); tr(bk1, 0, 311);
  const bub1 = bubbles(boilBk, -90, 250, 180, 150, { n: 8, r: 6, seed: 3 });
  const steam1 = heatWaves(boilBk, { n: 3, h: 70, spacing: 40, color: '#FFFFFF', width: 4 }); tr(steam1, 0, 210);
  const hat = stHat(boilBk);
  // step 2 and safety: the water bath (ethanol in a boiling tube) and the rolled-up leaf inside it
  const bath = phWaterBath(wEq, 1);
  const rolled = E('rect', { x: -11, y: -42, width: 22, height: 84, rx: 10, fill: '#3FAE5A', stroke: '#2C8C4C', 'stroke-width': 2 }, wEq);
  // the callout circle for the leaf in the ethanol
  const callout = G(wTile);
  E('circle', { cx: 0, cy: 0, r: 112, fill: '#F7FBFF', stroke: '#3F5BD9', 'stroke-width': 4, 'stroke-dasharray': '12 8' }, callout);
  const calloutLine = E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#3F5BD9', 'stroke-width': 3, 'stroke-dasharray': '10 8' }, wTile);
  // step 3: warm water
  const warmBk = G(wEq);
  const bk2 = beaker(warmBk, 240, 200, { level: 0.68, liquid: '#9FD8FF', opacity: 0.5 }); tr(bk2, 0, -100);
  const warmW = heatWaves(warmBk, { n: 3, h: 50, spacing: 44, color: C.heat, width: 4 }); tr(warmW, 0, -212);
  // step 4: white tile, iodine bottle, dropper, drops
  const tile = G(wTile);
  E('rect', { x: -240, y: -130, width: 480, height: 260, rx: 14, fill: '#FBFDFF', stroke: '#9AA6B2', 'stroke-width': 4 }, tile);
  const bottle = G(wEq);
  E('path', { d: 'M-40,0 L-40,-120 Q-40,-138 -22,-142 L-22,-170 L22,-170 L22,-142 Q40,-138 40,-120 L40,0 Z', fill: '#7A3E12', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bottle);
  E('rect', { x: -26, y: -196, width: 52, height: 28, rx: 6, fill: '#2A2A2A', stroke: SC_INK, 'stroke-width': 3 }, bottle);
  E('rect', { x: -58, y: -102, width: 116, height: 60, rx: 6, fill: '#FFF8E8', stroke: SC_INK, 'stroke-width': 2.5 }, bottle);
  T(bottle, 0, -62, 'iodine', { size: 28, weight: 800, anchor: 'middle', fill: '#7A3E12' });
  const dropper = G(wEq);
  E('path', { d: 'M-8,0 L-8,-80 L8,-80 L8,0 L2,14 L-2,14 Z', fill: 'rgba(210,235,250,0.5)', stroke: '#CFE7F5', 'stroke-width': 3 }, dropper);
  E('rect', { x: -6, y: -40, width: 12, height: 40, fill: '#C8782F', opacity: 0.85 }, dropper);
  E('path', { d: 'M-16,-80 L16,-80 L16,-112 Q16,-132 0,-132 Q-16,-132 -16,-112 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, dropper);
  const drops = [0, 1, 2].map(() => E('path', { d: 'M0,-10 Q8,2 0,8 Q-8,2 0,-10 Z', fill: '#C8782F', stroke: '#7A3E12', 'stroke-width': 1.5 }, wEq));
  const splots = G(wLeaf);   // drawn over the leaf
  // the test leaf (Kevin's), and the KEVIN sticker
  const tLeaf = phTestLeaf(wLeaf, 1, {});
  const kevin = G(wLeaf);
  E('rect', { x: -58, y: -22, width: 116, height: 44, rx: 8, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 3 }, kevin);
  E('rect', { x: -58, y: -22, width: 116, height: 10, rx: 4, fill: '#E8424F' }, kevin);
  T(kevin, 0, 16, 'KEVIN', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  const splotL = [[-40, -10], [30, 20], [80, -26]].map(([x, y]) => E('ellipse', { cx: x, cy: y, rx: 22, ry: 15, fill: '#C8782F', opacity: 0.85 }, splots));

  // the step cards along the top
  const STEPS = [['Boil in', 'water'], ['Boil in', 'ethanol'], ['Warm', 'water'], ['Iodine', 'solution']];
  const cardG = STEPS.map(([a, b], i) => {
    const g = G(wCards); tr(g, 236 + i * 244, 156);
    g.box = E('rect', { x: -112, y: -44, width: 224, height: 88, rx: 14, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 4 }, g);
    E('circle', { cx: -76, cy: 0, r: 24, fill: '#3F5BD9' }, g);
    T(g, -76, 10, String(i + 1), { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    T(g, -42, -6, a, { size: 26, weight: 700, fill: SC_INK });
    T(g, -42, 26, b, { size: 26, weight: 800, fill: '#2A3A8A' });
    g.tk = tick(g, 14, C.good); tr(g.tk, 92, -26);
    return g;
  });

  // lab HUD (chips, not moved by the camera)
  const labHud = G(labShot);
  const clipCard = G(labHud);
  E('rect', { x: -200, y: -130, width: 400, height: 260, rx: 14, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, clipCard);
  E('rect', { x: -182, y: -110, width: 364, height: 222, fill: '#FFFFFF' }, clipCard);
  E('rect', { x: -50, y: -144, width: 100, height: 30, rx: 8, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, clipCard);
  T(clipCard, 0, -46, 'PROVE IT:', { size: 46, weight: 800, anchor: 'middle', fill: '#E8424F' });
  T(clipCard, 0, 12, 'test a leaf', { size: 36, weight: 700, anchor: 'middle', fill: SC_INK });
  T(clipCard, 0, 62, 'for **starch**', { size: 36, weight: 700, anchor: 'middle', fill: SC_INK, boldFill: '#1C2238' });
  const cSpare = stLabel(labHud, 'spare glucose is stored as starch', { size: 28, color: C.glucose, stroke: C.glucose });
  const cKill = stLabel(labHud, 'kills the leaf', { size: 30 });
  const cMemb = stLabel(labHud, 'breaks down membranes', { size: 28 });
  const cIod = stLabel(labHud, 'so iodine can get in', { size: 28, color: '#FFB27A', stroke: '#FFB27A' });
  const cChl = stLabel(labHud, 'removes chlorophyll', { size: 30, color: '#8FE59C', stroke: '#8FE59C' });
  const cSee = stLabel(labHud, 'so the colour change is easy to see', { size: 26, color: C.muted });
  // safety
  const hazard = G(labHud);
  E('rect', { x: -230, y: -66, width: 460, height: 132, rx: 16, fill: '#C62E3A', stroke: '#FFFFFF', 'stroke-width': 4 }, hazard);
  { const d = G(hazard); tr(d, -160, 0); E('rect', { x: -38, y: -38, width: 76, height: 76, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4, transform: 'rotate(45)' }, d); const f = E('path', { d: FLAME, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2.5 }, d); f.setAttribute('transform', 'scale(0.8)'); }
  T(hazard, 40, -10, 'ETHANOL IS', { size: 34, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  T(hazard, 40, 40, 'FLAMMABLE', { size: 46, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  const noFlame = G(labHud);
  E('circle', { r: 46, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 7 }, noFlame);
  E('path', { d: FLAME, fill: '#FF8A3D', stroke: SC_INK, 'stroke-width': 2 }, noFlame);
  E('path', { d: 'M-32,-32 L32,32', stroke: '#E8424F', 'stroke-width': 8, 'stroke-linecap': 'round' }, noFlame);
  const cOff = stLabel(noFlame, 'Bunsen OFF', { size: 28, color: '#FF9AA4', stroke: '#FF9AA4' }); tr(cOff, 0, 80);
  const cBath = stLabel(labHud, 'water bath, flame off', { size: 30, color: C.water, stroke: C.water });
  // steps 3-4
  const cSoft = stLabel(labHud, 'softens it', { size: 32 });
  const key = G(labHud);
  card(key, -190, -120, 380, 240, { fill: 'rgba(10,27,39,0.92)', stroke: C.line });
  E('circle', { cx: -140, cy: -70, r: 20, fill: '#C8782F', stroke: '#FFFFFF', 'stroke-width': 2 }, key);
  T(key, -108, -60, 'orange-brown', { size: 30, weight: 700, fill: '#FFB27A' });
  arrow(key, -140, -42, -140, 2, { color: C.ink, width: 4 });
  E('circle', { cx: -140, cy: 28, r: 20, fill: '#1C2238', stroke: '#FFFFFF', 'stroke-width': 2 }, key);
  T(key, -108, 38, 'blue-black', { size: 30, weight: 700, fill: '#9FB4FF' });
  T(key, 0, 96, '= **starch**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.energy });
  // result labels
  const rStarch = G(labHud);
  const rStarchL = E('line', { stroke: '#1C2238', 'stroke-width': 3 }, rStarch);
  const rStarchC = stLabel(rStarch, 'starch ✓', { size: 34, color: C.good, stroke: C.good });
  const rNo = G(labHud);
  const rNoL = E('line', { stroke: '#7A3E12', 'stroke-width': 3 }, rNo);
  const rNoC = stLabel(rNo, 'no light → no starch', { size: 30, color: '#FFB27A', stroke: '#FFB27A' });
  // destarch (the cupboard) pieces
  const cupG = G(labHud);
  E('rect', { x: 150, y: 170, width: 380, height: 390, rx: 8, fill: '#6B4A33', stroke: SC_INK, 'stroke-width': 5 }, cupG);
  E('rect', { x: 172, y: 192, width: 336, height: 346, fill: '#0E1216' }, cupG);
  const cupSlot = G(cupG);
  const cupDark = E('rect', { x: 172, y: 192, width: 336, height: 346, fill: '#05070A', opacity: 0.55 }, cupG);
  const door = E('path', { d: '', fill: '#8A6A4A', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, cupG);
  const destCard = G(labHud);
  card(destCard, -250, -86, 500, 172, { fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3 });
  T(destCard, 0, -20, 'DESTARCH', { size: 54, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  T(destCard, 0, 44, '1–2 days in the dark', { size: 36, weight: 600, anchor: 'middle', fill: C.ink });
  const grainLeaf = G(labHud);
  { const l = leaf(grainLeaf, 1.1); tr(l, -112, 0); }
  const grains = [];
  for (let i = 0; i < 9; i++) grains.push(E('ellipse', { cx: -60 + (i % 5) * 34 + (i > 4 ? 16 : 0), cy: i > 4 ? 18 : -14, rx: 9, ry: 6, fill: '#1C2238', stroke: '#9FB4FF', 'stroke-width': 1.5 }, grainLeaf));
  const cOld = stLabel(labHud, 'uses up old starch', { size: 30, color: '#9FB4FF', stroke: '#9FB4FF' });
  // "did": the wardrobe polaroid
  const pola = G(labHud);
  E('rect', { x: -190, y: -170, width: 380, height: 380, rx: 6, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, pola);
  E('rect', { x: -170, y: -150, width: 340, height: 290, fill: '#2A1E18' }, pola);
  E('rect', { x: -170, y: -150, width: 340, height: 290, fill: 'none', stroke: '#5E4430', 'stroke-width': 8 }, pola);
  E('path', { d: 'M-170,-112 L170,-112', stroke: '#9AA6B2', 'stroke-width': 6 }, pola);   // rail
  [[-118, '#E8424F'], [-62, '#3F5BD9'], [64, '#56D69B'], [122, '#FF9466']].forEach(([x, col]) => {
    E('path', { d: `M${x},-112 l0,10 l-26,14 l52,0 l-26,-14`, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3 }, pola);
    E('path', { d: `M${x - 28},-86 L${x + 28},-86 L${x + 24},40 L${x - 24},40 Z`, fill: col, stroke: SC_INK, 'stroke-width': 3 }, pola);
  });
  const polaSlot = G(pola);
  T(pola, 0, 190, 'last weekend', { size: 30, weight: 600, anchor: 'middle', fill: '#2A3A8A', font: FB });

  /* =====================================================================
     CONFESSIONAL (Clive): "We remember." and "She's going to be unbearable now."
     ===================================================================== */
  const confShot = G(root);
  const conf = phConf(confShot, 'clive');
  const confWrap = G(confShot);
  const confSlot = G(confWrap);
  const sock = G(confWrap);
  E('line', { x1: 0, y1: -260, x2: 0, y2: 0, stroke: '#C9D3DC', 'stroke-width': 3 }, sock);
  E('path', { d: 'M-22,0 L22,0 L22,90 Q22,110 44,116 Q70,124 66,146 Q60,166 30,160 L-10,150 Q-22,146 -22,130 Z', fill: '#F4F1DE', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, sock);
  E('path', { d: 'M-22,24 L22,24 M-22,48 L22,48 M-22,72 L22,72', stroke: '#E8424F', 'stroke-width': 8 }, sock);
  E('path', { d: 'M10,150 Q34,136 64,148', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 3 }, sock);

  /* =====================================================================
     BEDROOM: the foil strip
     ===================================================================== */
  const cFoil = stLabel(labHud, 'foil = no light', { size: 36, color: C.energy, stroke: C.energy });
  const foilArrow = arrow(labHud, 600, 268, 500, 400, { color: C.energy, width: 5 });

  /* =====================================================================
     PHYLLIS inside the ethanol
     ===================================================================== */
  const phyShot = G(root), phyWrap = G(phyShot);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3E9C4C', '#0F3A1E', true) }, phyWrap);
  E('path', { d: 'M230,-20 L230,620 Q230,800 600,800 Q970,800 970,620 L970,-20', fill: 'none', stroke: '#DDF3FF', 'stroke-width': 14, opacity: 0.5 }, phyWrap);
  E('rect', { x: 880, y: 60, width: 22, height: 560, rx: 11, fill: '#FFFFFF', opacity: 0.18 }, phyWrap);
  const phyBub = bubbles(phyWrap, 260, 80, 680, 640, { n: 7, r: 10, seed: 21, speed: 0.25 });
  const phySlot = G(phyWrap);
  const phyHands = G(phyWrap);
  [-1, 1].forEach(sd => E('ellipse', { cx: sd * 22, cy: 0, rx: 18, ry: 14, fill: '#8BE89A', stroke: SC_INK, 'stroke-width': 3 }, phyHands));
  const cInside = stLabel(phyShot, 'chlorophyll dissolving into the ethanol', { size: 28, color: '#8FE59C', stroke: '#8FE59C' });

  /* =====================================================================
     WE END WITH IODINE
     ===================================================================== */
  const wewiShot = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0A1B27', true) }, wewiShot);
  const wewiSlot = G(wewiShot);
  const WW = [['W', 'e', 'water', C.water], ['E', 'nd', 'ethanol', C.ethanol], ['W', 'ith', 'warm water', C.heat], ['I', 'odine', 'iodine', '#C8782F']];
  const wCardsW = WW.map(([L, rest, step, col], i) => {
    const g = G(wewiShot); tr(g, 720 + (i % 2) * 300, 250 + Math.floor(i / 2) * 260);
    g.box = E('rect', { x: -135, y: -112, width: 270, height: 224, rx: 20, fill: C.card, stroke: col, 'stroke-width': 4 }, g);
    g.big = T(g, 0, 10, L, { size: 110, weight: 800, anchor: 'middle', fill: col });
    g.word = T(g, 0, 10, '', { size: 44, weight: 800, anchor: 'middle', fill: C.ink });
    E('tspan', { fill: col }, g.word).textContent = L; E('tspan', {}, g.word).textContent = rest;
    g.step = T(g, 0, 70, step, { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
    return g;
  });

  /* =====================================================================
     CONTROLS: variegated leaf; soda lime
     ===================================================================== */
  const ctrlShot = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#14243A', '#0A1B27', true) }, ctrlShot);
  const pV = G(ctrlShot), pC = G(ctrlShot);
  card(pV, 40, 110, 540, 600, { fill: C.card, stroke: C.line });
  card(pC, 620, 110, 540, 600, { fill: C.card, stroke: C.line });
  T(pV, 310, 168, 'variegated leaf', { size: 38, weight: 800, anchor: 'middle', fill: C.ink });
  const vBefore = phTestLeaf(pV, 0.5, { variegated: true, strip: false }); tr(vBefore, 190, 320);
  const vAfter = phTestLeaf(pV, 0.5, { variegated: true, strip: false }); tr(vAfter, 450, 320);
  T(pV, 190, 410, 'before', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const vAfterLbl = T(pV, 450, 410, 'after iodine', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const vArrow = arrow(pV, 270, 320, 330, 320, { color: C.ink, width: 4 });
  const vNote = T(pV, 310, 500, 'only the green parts make starch', { size: 28, weight: 600, anchor: 'middle', fill: C.ink, font: FB });
  const vChip = stLabel(pV, 'chlorophyll needed', { size: 34, color: '#8FE59C', stroke: '#8FE59C' }); tr(vChip, 310, 600);
  stRich(pC, 890, 168, 'no carbon dioxide', { size: 38, weight: 800, fill: C.ink });
  const fl = flask(pC, 1.45, { level: 0, liquid: '#FFFFFF' }); tr(fl, 800, 372);
  E('rect', { x: 776, y: 216, width: 48, height: 26, rx: 5, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 3 }, pC);   // bung
  const fLeaf = stLeaf(pC, 0.24); tr(fLeaf, 812, 380, 1, -12);
  E('path', { d: 'M740,476 L860,476 L850,496 L750,496 Z', fill: '#C9D3DC', stroke: '#7D8C99', 'stroke-width': 3 }, pC);   // dish
  { let d = ''; for (let i = 0; i < 12; i++) d += `M${752 + i * 9},${470 - (i % 3) * 4} a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0 `; E('path', { d, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 1 }, pC); }
  const sodaLbl = G(pC);
  E('line', { x1: 870, y1: 486, x2: 930, y2: 560, stroke: C.muted, 'stroke-width': 2.5 }, sodaLbl);
  stRich(sodaLbl, 1000, 588, 'soda lime', { size: 30, weight: 800, fill: C.ink });
  stRich(sodaLbl, 1000, 626, '(absorbs CO_2)', { size: 28, weight: 600, fill: C.muted });
  const cAfterLeaf = stLeaf(pC, 0.42); tr(cAfterLeaf, 1050, 330);
  const cArrowI = arrow(pC, 900, 330, 960, 330, { color: C.ink, width: 4 });
  const cAfterLbl = T(pC, 1050, 420, 'after iodine', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  const cChip = G(pC); { const c = stLabel(cChip, 'CO₂ needed', { size: 34, color: C.co2, stroke: C.co2 }); }
  tr(cChip, 1040, 480);

  /* =====================================================================
     REPORT: "Conclusion. Plant does not do nothing."
     ===================================================================== */
  const repG = G(labHud);
  const paper = G(repG);
  E('rect', { x: -290, y: -170, width: 580, height: 340, rx: 8, fill: '#FFFDF4', stroke: '#C9B53A', 'stroke-width': 3 }, paper);
  for (let i = 0; i < 6; i++) E('line', { x1: -270, y1: -112 + i * 52, x2: 270, y2: -112 + i * 52, stroke: '#CFE0F0', 'stroke-width': 2 }, paper);
  E('line', { x1: -220, y1: -170, x2: -220, y2: 170, stroke: '#F2A0A8', 'stroke-width': 2 }, paper);
  const pT1 = T(paper, -200, -70, 'Conclusion:', { size: 44, weight: 700, fill: '#E8424F', font: FB });
  const pT2 = T(paper, -200, 4, 'Plant does not', { size: 54, weight: 700, fill: '#2A3A8A', font: FB });
  const pT3 = T(paper, -200, 82, 'do nothing.', { size: 54, weight: 700, fill: '#2A3A8A', font: FB });
  [pT1, pT2, pT3].forEach(x => x.setAttribute('font-style', 'italic'));
  const under = E('path', { d: 'M-200,104 Q-60,94 104,104', fill: 'none', stroke: '#E8424F', 'stroke-width': 6, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, paper);
  const starSt = G(paper); tr(starSt, 210, -84);
  { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 18 : 40; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFD23F', stroke: '#B57B12', 'stroke-width': 3, 'stroke-linejoin': 'round' }, starSt); }

  /* =====================================================================
     FOOD CHAIN: sun -> Plant -> chicken -> chicken rice
     ===================================================================== */
  const chainShot = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#173A52', '#0A1B27', true) }, chainShot);
  const chSun = sun(chainShot, 56); tr(chSun, 160, 380);
  const chainSlot = G(chainShot);
  const chick = G(chainShot); tr(chick, 715, 400);
  E('path', { d: 'M40,44 L40,84 M40,84 L28,92 M40,84 L52,92 M2,44 L2,84 M2,84 L-10,92 M2,84 L14,92', stroke: '#FF9A3D', 'stroke-width': 6, 'stroke-linecap': 'round' }, chick);
  E('path', { d: 'M-70,-6 Q-74,-40 -46,-40 Q-8,-40 20,-10 Q70,-20 74,10 Q76,52 22,56 Q-50,60 -70,-6 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, chick);
  E('path', { d: 'M-4,4 Q22,-6 44,10 Q24,32 -4,4 Z', fill: '#F2F2F2', stroke: SC_INK, 'stroke-width': 3 }, chick);
  E('path', { d: 'M-60,-40 Q-60,-58 -50,-56 Q-46,-68 -38,-60 Q-30,-66 -30,-48', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, chick);
  E('path', { d: 'M-72,-24 L-92,-18 L-72,-12 Z', fill: '#FFB000', stroke: SC_INK, 'stroke-width': 2.5 }, chick);
  E('circle', { cx: -56, cy: -26, r: 5, fill: SC_INK }, chick);
  E('path', { d: 'M-70,-8 Q-76,4 -68,8', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, chick);
  const plate = G(chainShot); tr(plate, 995, 420);
  E('ellipse', { rx: 120, ry: 42, fill: '#F4F7FA', stroke: '#9AA6B2', 'stroke-width': 4 }, plate);
  E('ellipse', { rx: 86, ry: 28, fill: 'none', stroke: '#C9D3DC', 'stroke-width': 3 }, plate);
  E('path', { d: 'M-80,4 Q-80,-60 -20,-62 Q30,-62 32,4 Z', fill: '#FFF8E8', stroke: '#C9B98A', 'stroke-width': 3 }, plate);   // rice
  [[20, -18, -18], [44, -14, -8], [66, -8, 4]].forEach(([x, y, a]) => E('path', { d: 'M-16,-20 L16,-20 L18,18 L-18,18 Z', fill: '#F2D3A0', stroke: '#C98E3A', 'stroke-width': 3, transform: `translate(${x} ${y}) rotate(${a})` }, plate));
  E('path', { d: 'M-70,6 a10,7 0 1,0 20,0 a10,7 0 1,0 -20,0 M-48,12 a10,7 0 1,0 20,0 a10,7 0 1,0 -20,0', fill: '#7BC96F', stroke: '#2C8C4C', 'stroke-width': 2 }, plate);
  E('ellipse', { cx: 96, cy: -2, rx: 16, ry: 8, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, plate);   // chilli sauce
  const chArrows = [[240, 380, 300, 380], [520, 380, 600, 380], [820, 380, 870, 380]].map(([a, b, c, d]) => arrow(chainShot, a, b, c, d, { color: C.energy, width: 7 }));
  const chNames = [['sun', 160], ['Plant', 430], ['chicken', 715], ['chicken rice', 995]].map(([s, x]) => T(chainShot, x, 540, s, { size: 32, weight: 700, anchor: 'middle', fill: C.ink }));
  const chSpark = spark(chainShot, 16, { seed: 2 });
  const cChain = stLabel(chainShot, 'photosynthesis starts nearly every food chain', { size: 32, color: C.energy, stroke: C.energy });
  const cLunch = stLabel(chainShot, 'your food began as sunlight', { size: 28, color: C.glucoseLt, stroke: C.glucose });

  /* =====================================================================
     AIR: oxygen from plants and plankton
     ===================================================================== */
  const airShot = G(root);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#7FCBF5', '#D8F2FF', true) }, airShot);
  const airKav = G(airShot);
  E('rect', { x: 0, y: 450, width: 1200, height: 300, fill: linGrad('#2D8BC9', '#0E3E66', true) }, airShot);
  E('path', { d: 'M0,450 Q50,436 100,450 T200,450 T300,450 T400,450 T500,450 T600,450 T700,450 T800,450 T900,450 T1000,450 T1100,450 T1200,450 L1200,462 L0,462 Z', fill: '#5FB6E8' }, airShot);
  E('path', { d: 'M60,470 Q80,412 260,404 Q440,410 470,470 Z', fill: '#F2D49A', stroke: '#C9A25A', 'stroke-width': 3 }, airShot);   // island
  [[170, 300, 1], [300, 290, 1.15]].forEach(([x, y, s]) => {
    E('rect', { x: x - 9 * s, y, width: 18 * s, height: 420 - y, fill: '#8A5A3A', stroke: SC_INK, 'stroke-width': 3 }, airShot);
    E('path', { d: `M${x - 70 * s},${y + 10} a${46 * s},${40 * s} 0 1,1 ${70 * s},-${40 * s} a${46 * s},${40 * s} 0 1,1 ${70 * s},${40 * s} a${40 * s},${34 * s} 0 1,1 -${140 * s},0 Z`, fill: C.plant, stroke: C.plantDk, 'stroke-width': 4 }, airShot);
  });
  { let d = ''; const r = rng(77); for (let i = 0; i < 22; i++) { const x = 560 + r() * 600, y = 500 + r() * 220, rr = 6 + r() * 6; d += `M${(x - rr).toFixed(1)},${y.toFixed(1)} a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0 a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0 `; } E('path', { d, fill: '#7FE08F', stroke: '#2C8C4C', 'stroke-width': 2, opacity: 0.9 }, airShot); }
  const o2s = [];
  for (let i = 0; i < 5; i++) { const m = molO2(airShot, 11); o2s.push({ m, x: i < 2 ? 160 + i * 130 : 640 + (i - 2) * 170, y0: i < 2 ? 300 : 640, h: i < 2 ? 110 : 220, sp: 0.16 + (i % 3) * 0.03, ph: i * 0.37 }); }
  const airBreath = [0, 1].map(() => molO2(airShot, 9));
  const oliveAirSlot = G(airShot);
  const cPlants = stLabel(airShot, 'plants', { size: 30, color: '#8FE59C', stroke: '#8FE59C' });
  const cPlank = stLabel(airShot, 'plankton in the sea', { size: 30, color: '#8FE59C', stroke: '#8FE59C' });
  const cAir = G(airShot);
  { const c = stLabel(cAir, 'oxygen in the air comes from photosynthesis', { size: 32, color: '#FFB0A6', stroke: C.oxygen }); }

  /* =====================================================================
     MAIN CHARACTER: spotlight, dressing-room door
     ===================================================================== */
  const mainShot = G(root), mainWrap = G(mainShot);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1430', '#120A18', true) }, mainWrap);
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#1E1022' }, mainWrap);
  const doorG = G(mainWrap); tr(doorG, 930, 400);
  E('rect', { x: -140, y: -260, width: 280, height: 500, rx: 6, fill: '#6B3A2A', stroke: SC_INK, 'stroke-width': 5 }, doorG);
  E('rect', { x: -112, y: -230, width: 224, height: 200, rx: 6, fill: 'none', stroke: '#4A2418', 'stroke-width': 4 }, doorG);
  E('circle', { cx: 104, cy: 30, r: 11, fill: '#FFD23F', stroke: SC_INK, 'stroke-width': 3 }, doorG);
  const dStar = G(doorG); tr(dStar, 0, -130);
  { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 36 : 82; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } E('path', { d: d + 'Z', fill: '#FFD23F', stroke: '#B57B12', 'stroke-width': 4, 'stroke-linejoin': 'round' }, dStar); }
  T(doorG, 0, 40, 'MAIN', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  T(doorG, 0, 88, 'CHARACTER', { size: 40, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  const spotC = E('path', { d: 'M360,-20 L500,-20 L640,660 L220,660 Z', fill: '#FFF3C4', opacity: 0 }, mainWrap);
  const spotF = E('ellipse', { cx: 430, cy: 650, rx: 220, ry: 34, fill: '#FFF3C4', opacity: 0 }, mainWrap);
  const mainSlot = G(mainWrap);

  /* ---------- cut list ---------- */
  const CUTS = [
    [-9, 'lab'], [at('destarch') - 0.08, 'cup'], [at('did') - 0.08, 'did'], [at('remember') - 0.08, 'rem'],
    [at('foil') - 0.08, 'foil'], [at('boil') - 0.08, 'boil'], [at('kevin') - 0.08, 'kevin'], [at('ethanol') - 0.08, 'eth'],
    [at('outrage') - 0.08, 'phy'], [at('safety') - 0.08, 'safe'], [at('warm') - 0.08, 'warm'], [at('wewi') - 0.08, 'wewi'],
    [at('result') - 0.08, 'res'], [at('controls') - 0.08, 'ctrl'], [at('report') - 0.08, 'rep'], [at('chain') - 0.08, 'chain'],
    [at('air') - 0.08, 'air'], [at('main') - 0.08, 'main'], [at('unbear') - 0.08, 'unb'],
  ];
  const cutAt = t => { let c = CUTS[0]; for (const k of CUTS) if (t >= k[0]) c = k; return c; };
  const LAB = { lab: 1, cup: 1, did: 1, foil: 1, boil: 1, kevin: 1, eth: 1, safe: 1, warm: 1, res: 1, rep: 1 };
  const STEP = { boil: 0, eth: 1, warm: 2, res: 4 };

  // the hard hat bobbing on the boiling water (Kevin's), and the step-4 timings
  const tWarm4 = mid('warm', 0.42);

  return t => {
    const [c0, sh] = cutAt(t);
    const lab = LAB[sh] ? 1 : 0;
    op(labShot, lab); conf.set(sh === 'rem' || sh === 'unb' ? 1 : 0, t);
    op(confShot, sh === 'rem' || sh === 'unb' ? 1 : 0); op(phyShot, sh === 'phy' ? 1 : 0);
    op(wewiShot, sh === 'wewi' ? 1 : 0); op(ctrlShot, sh === 'ctrl' ? 1 : 0); op(chainShot, sh === 'chain' ? 1 : 0);
    op(airShot, sh === 'air' ? 1 : 0); op(mainShot, sh === 'main' ? 1 : 0);
    op(olive, sh === 'air' || sh === 'main' ? 1 : 0);
    op(phyl, sh === 'phy' ? 1 : 0);
    // headphones: on, unless they have just been taken off
    const offP = sh === 'main' ? P(t, at('main') + 0.1, 0.7, ease) : 0;
    oPhones.forEach(e => op(e, offP > 0 ? 0 : 1)); op(oLift, offP > 0 ? 1 - P(t, at('main') + 0.5, 0.3, linear) : 0);
    tr(oLift, 30 * offP, -120 * offP, 1, 14 * offP);
    let kavOn = 0, cliveOn = 0;
    // the one Plant: on the bench, in the cupboard, in the wardrobe photo, or in the food chain
    const PL = { lab: [plantSlotW, 330, BY, 1, 0], kevin: [plantSlotW, 330, BY, 1, 0], foil: [plantSlotW, 330, BY, 1, 0], cup: [cupSlot, 340, 538, 0.95, 0], did: [polaSlot, 0, 128, 0.5, 0.45], chain: [chainSlot, 430, 470, 0.72, 0] }[sh];
    if (PL) { stSeat(lPlant, PL[0]); tr(lPlant, PL[1], PL[2], PL[3]); op(lPlant, 1); lPlant.set({ t: t * AMP, droop: PL[4], foil: sh === 'foil' ? P(t, mid('foil', 0.35), 0.5, ease) : 0 }); }
    else op(lPlant, 0);
    op(beamF, sh === 'foil' ? 0.26 + 0.05 * Math.sin(t * 2) : 0);

    /* ================= the lab ================= */
    if (lab) {
      // camera
      if (sh === 'did') stCam(world, 1.5 + 0.06 * P(t, c0, 4.3, linear), 1000, 400, 420, 470);
      else if (sh === 'kevin') stCam(world, 1.35 + 0.12 * P(t, mid('kevin', 0.75), end('kevin') + 0.7 - mid('kevin', 0.75), ease), 440, 380, 600, 400);
      else if (sh === 'rep') stCam(world, 1, 600, 375);
      else if (sh === 'foil') stCam(world, 1.6 + 0.08 * P(t, c0, 4.2, linear), 380, 400, 430, 400);
      else stCam(world, 1 + 0.025 * P(t, c0, 6, linear), 600, 400);
      op(calendar, sh === 'lab' ? 1 : 0); op(poster, sh === 'lab' || sh === 'kevin' ? 1 : 0);
      // Kavya behind the bench
      const kHere = { lab: [1010, 440, 1.3], did: [1030, 450, 1.25], boil: [1030, 450, 1.25], eth: [1030, 450, 1.25], safe: [1030, 450, 1.25], res: [1030, 450, 1.25], rep: [250, 470, 1.5], foil: [640, 472, 1.0] }[sh];
      if (kHere) {
        kavOn = 1; stSeat(kav, kavLab); tr(kav, kHere[0], kHere[1], kHere[2]); op(gog, 1);
        let mood = 'neutral', look = 0;
        if (sh === 'lab') { mood = 'smug'; look = t < mid('friday', 0.5) ? 0 : -0.6; }
        if (sh === 'did') mood = 'deadpan';
        if (sh === 'foil') look = t > mid('foil', 0.25) ? -0.8 : 0;
        if (sh === 'boil' || sh === 'eth') look = -0.9;
        if (sh === 'safe') { mood = t < mid('safety', 0.4) ? 'annoyed' : 'neutral'; look = 0; }
        if (sh === 'res') { mood = t < end('result') ? 'happy' : 'smug'; look = t < mid('result', 0.3) ? -0.9 : 0; }
        if (sh === 'rep') { mood = t < end('report') ? 'happy' : 'smug'; look = 0.6; }
        kav.set({ t, talk: talk(t, 'kavya'), mood, look });
      }
      // Clive on Plant
      op(cArm, 0);
      if (sh === 'kevin') {
        cliveOn = 1; stSeat(clive, cliveSlot); tr(clive, 330, 404, 0.42);
        const look = t < mid('kevin', 0.22) ? -0.6 : t < end('kevin') - 0.2 ? 1 : 0;
        clive.set({ t, talk: talk(t, 'clive'), mood: 'deadpan', look });
        const ap = win(t, mid('kevin', 0.25), end('kevin') - 0.1, 0.25);
        op(cArm, ap); tr(cArm, 376, 410, 1, -6 + 4 * Math.sin(t * 3) * AMP);
      }
      // equipment visibility
      const showBoil = sh === 'boil' || sh === 'kevin';
      op(tripod, showBoil); op(boilBk, showBoil);
      op(bun, showBoil || sh === 'safe');
      if (showBoil) { tr(bun, 560, BY - 18); bun.set('blue'); bun.upd(t); bub1.upd(t, 1); steam1.upd(t); }
      if (sh === 'safe') { tr(bun, 250, BY - 18); const offT = mid('safety', 0.42); bun.set(t < offT ? 'blue' : 'off'); bun.upd(t); }
      op(hat, sh === 'kevin' ? P(t, end('kevin') - 0.15, 0.35, linear) : 0);
      tr(hat, 40 + 6 * Math.sin(t * 2), 282 + 3 * Math.sin(t * 3.1), 1, 8 * Math.sin(t * 2.3));
      op(bath, sh === 'eth' || sh === 'safe'); op(rolled, sh === 'eth' || sh === 'safe');
      const ethP = P(t, mid('ethanol', 0.2), (end('ethanol') - at('ethanol')) * 0.6, linear);
      if (sh === 'eth' || sh === 'safe') {
        const bx = sh === 'eth' ? 640 : 680;
        tr(bath, bx, BY); bath.upd(t); bath.set({ green: sh === 'safe' ? 1 : ethP });
        tr(rolled, bx + 3, BY - 80, 1, 6);
        attr(rolled, 'fill', phMix('#3FAE5A', '#EFE3B8', sh === 'safe' ? 1 : ethP));
      }
      op(callout, sh === 'eth'); op(calloutLine, sh === 'eth');
      if (sh === 'eth') { tr(callout, 270, 300); attr(calloutLine, 'x1', 376); attr(calloutLine, 'y1', 336); attr(calloutLine, 'x2', 640); attr(calloutLine, 'y2', 455); }
      const w3 = sh === 'warm' ? 1 - P(t, tWarm4 - 0.2, 0.25, linear) : 0;
      op(warmBk, w3); if (w3) { tr(warmBk, 560, BY); warmW.upd(t); }
      const w4 = sh === 'warm' ? P(t, tWarm4 - 0.1, 0.25, linear) : sh === 'res' ? 1 : 0;
      op(tile, w4); tr(tile, 540, 430);
      op(bottle, sh === 'warm' ? w4 : 0); tr(bottle, 190, BY);
      op(dropper, sh === 'warm' ? w4 : 0);
      tr(dropper, 650, 330 - 8 * P(t, tWarm4, 0.4, ease));
      drops.forEach((d, i) => {
        const t0 = tWarm4 + 0.6 + i * 1.1, q = clamp((t - t0) / 0.5);
        op(d, sh === 'warm' && q > 0 && q < 1 ? 1 : 0); tr(d, 650 + [0, -60, 50][i] * q * 0.3 - [0, 18, -14][i] * q, 352 + q * q * 70);
      });
      // the test leaf
      op(kevin, 0); op(splots, 0);
      let lv = null;
      if (sh === 'boil' || sh === 'kevin') {
        const p = sh === 'kevin' ? 1 : P(t, mid('boil', 0.08), 1.0, ease);
        lv = [560, lerp(240, 350, p), 0.5, lerp(-25, 10, p) + 3 * Math.sin(t * 2.5) * AMP, 1];
        tLeaf.set({ pale: 0, iodine: 0 });
        if (sh === 'boil') lv[4] = P(t, at('boil') - 0.05, 0.3, linear);
        if (sh === 'kevin') { const kp = P(t, mid('kevin', 0.3), 0.4, pop); op(kevin, clamp(kp * 2)); tr(kevin, 560, 350, Math.max(0.01, 0.8 * kp), lv[3]); }
      } else if (sh === 'eth') {
        lv = [276, 300, 0.55, -8, 1]; tLeaf.set({ pale: ethP, iodine: 0 });
      } else if (sh === 'warm') {
        if (t < tWarm4) { const dip = Math.sin(Math.PI * P(t, mid('warm', 0.06), 2.2, linear)); lv = [560, 300 + 150 * dip, 0.48, 8, 1]; }
        else lv = [540, 430, 1.2, 0, P(t, tWarm4 - 0.1, 0.25, linear)];
        tLeaf.set({ pale: 1, iodine: 0 });
        op(splots, t > tWarm4 ? 1 : 0); tr(splots, 540, 430, 1.2);
        splotL.forEach((s, i) => op(s, P(t, tWarm4 + 1.1 + i * 1.1, 0.2, linear)));
      } else if (sh === 'res') {
        lv = [540, 430, 1.2, 0, 1];
        const io = P(t, mid('result', 0.02), 1.3, ease);
        tLeaf.set({ pale: 1, iodine: io });
        op(splots, 1 - io); tr(splots, 540, 430, 1.2);
      }
      if (lv) { op(tLeaf, lv[4]); tr(tLeaf, lv[0], lv[1], lv[2], lv[3]); } else op(tLeaf, 0);
      // the step cards
      const showCards = STEP[sh] !== undefined;
      op(wCards, showCards ? 1 : 0);
      if (showCards) {
        const cur = sh === 'warm' ? (t < tWarm4 ? 2 : 3) : STEP[sh];
        cardG.forEach((g, i) => {
          const done = i < cur, now = i === cur;
          op(g, now || done ? 1 : 0.45);
          attr(g.box, 'stroke', now ? '#FFB000' : done ? C.good : '#9AA6B2'); attr(g.box, 'stroke-width', now ? 7 : 4);
          op(g.tk, done ? 1 : 0);
          tr(g, 236 + i * 244, 156, now ? 1.04 + 0.02 * Math.sin(t * 4) * AMP : 1);
        });
      }
      /* ---- HUD ---- */
      op(clipCard, 0); op(cSpare, 0); op(cKill, 0); op(cMemb, 0); op(cIod, 0); op(cChl, 0); op(cSee, 0); op(hazard, 0); op(noFlame, 0); op(cBath, 0);
      op(cSoft, 0); op(cFoil, 0); foilArrow.set(0); op(key, 0); op(rStarch, 0); op(rNo, 0); op(cupG, 0); op(destCard, 0); op(grainLeaf, 0); op(cOld, 0); op(pola, 0); op(repG, 0);
      if (sh === 'lab') {
        stPop(clipCard, t, mid('friday', 0.3), 680, 300, 1, -3);
        stPop(cSpare, t, mid('friday', 0.62), 600, 500);
      } else if (sh === 'cup') {
        op(cupG, 1);
        const cl = P(t, mid('destarch', 0.25), 0.7, ease);   // the door swings (nearly) shut
        const dx = lerp(610, 240, cl), dy = 34 * (1 - cl);
        attr(door, 'd', `M508,192 L${dx.toFixed(1)},${(192 - dy).toFixed(1)} L${dx.toFixed(1)},${(538 + dy).toFixed(1)} L508,538 Z`);
        op(cupDark, 0.4 + 0.45 * cl);
        stPop(destCard, t, at('destarch') + 0.1, 840, 240);
        op(grainLeaf, P(t, mid('destarch', 0.45), 0.3, linear)); tr(grainLeaf, 870, 410);
        grains.forEach((g, i) => op(g, 1 - P(t, mid('destarch', 0.55) + i * 0.12, 0.3, linear)));
        stPop(cOld, t, mid('destarch', 0.6), 860, 512);
      } else if (sh === 'did') {
        const pp = P(t, mid('did', 0.55), 0.45, pop); op(pola, clamp(pp * 2.5)); tr(pola, 900, 330, Math.max(0.01, 0.7 + 0.3 * pp), 4);
      } else if (sh === 'foil') {
        stPop(cFoil, t, mid('foil', 0.55), 640, 230);
        foilArrow.set(P(t, mid('foil', 0.62), 0.35, ease));
      } else if (sh === 'boil') {
        stPop(cKill, t, mid('boil', 0.42), 270, 300);
        stPop(cMemb, t, mid('boil', 0.62), 250, 380);
        stPop(cIod, t, mid('boil', 0.8), 250, 450);
      } else if (sh === 'eth') {
        stPop(cChl, t, mid('ethanol', 0.55), 270, 462);
        op(cSee, P(t, mid('ethanol', 0.78), 0.3, linear)); tr(cSee, 330, 522);
      } else if (sh === 'safe') {
        stPop(hazard, t, at('safety') + 0.05, 330, 180);
        stPop(noFlame, t, mid('safety', 0.45), 420, 380);
        stPop(cBath, t, mid('safety', 0.72), 690, 232);
      } else if (sh === 'warm') {
        op(cSoft, win(t, mid('warm', 0.12), tWarm4 - 0.1, 0.3)); tr(cSoft, 280, 330);
        stPop(key, t, mid('warm', 0.72), 960, 350);
      } else if (sh === 'res') {
        const a = P(t, mid('result', 0.3), 0.4, linear), b = P(t, mid('result', 0.6), 0.4, linear);
        op(rStarch, a); tr(rStarchC, 240, 270); attr(rStarchL, 'x1', 260); attr(rStarchL, 'y1', 292); attr(rStarchL, 'x2', 430); attr(rStarchL, 'y2', 420);
        op(rNo, b); tr(rNoC, 600, 640); attr(rNoL, 'x1', 600); attr(rNoL, 'y1', 618); attr(rNoL, 'x2', 584); attr(rNoL, 'y2', 470);
      } else if (sh === 'rep') {
        const pp = P(t, at('report') + 0.05, 0.45, pop); op(repG, clamp(pp * 2.5)); tr(repG, 770, 340, Math.max(0.01, 0.8 + 0.2 * pp), -2);
        under.setAttribute('stroke-dashoffset', (1 - P(t, mid('report', 0.75), 0.6, ease)).toFixed(3));
        const sp = P(t, end('report') + 0.15, 0.4, pop); op(starSt, clamp(sp * 2.5)); tr(starSt, 210, -84, Math.max(0.01, sp), 12);
      }
    }

    /* ================= confessional (Clive) ================= */
    if (sh === 'rem' || sh === 'unb') {
      cliveOn = 1; stSeat(clive, confSlot); tr(clive, 430, 400, 1.5);
      let k, mood;
      if (sh === 'rem') { k = 1.05 + 0.25 * P(t, c0, at('foil') - c0, linear); mood = t < mid('remember', 0.7) ? 'sad' : 'deadpan'; }
      else { k = 1.1 + 0.3 * P(t, c0, 4.2, linear); mood = 'deadpan'; }
      stCam(confWrap, k, 440, 340, 440, 340);
      clive.set({ t, talk: talk(t, 'clive'), mood, look: 0, still: sh === 'rem' && t > end('remember') });
      op(sock, sh === 'rem'); tr(sock, 860, 170, 1, 4 * Math.sin(t * 1.3) * AMP);
    }


    /* ================= Phyllis in the ethanol ================= */
    if (sh === 'phy') {
      stSeat(phyl, phySlot);
      const rise = P(t, c0, 3.4, linear);
      tr(phyl, 600, 430 - 30 * rise, 1.55);
      const mood = t < mid('outrage', 0.45) ? 'shock' : 'annoyed';
      phyl.set({ t, talk: talk(t, 'phyllis'), mood, look: t > end('outrage') ? 0.5 : 0 });
      phyBub.upd(t, 1);
      tr(phyHands, 600, 430 - 30 * rise - 1.55 * 58 + 2 * Math.sin(t * 6) * AMP, 1.4);
      stCam(phyWrap, 1 + 0.06 * rise, 600, 400);
      op(cInside, P(t, mid('outrage', 0.2), 0.3, linear)); tr(cInside, 820, 150);
    }

    /* ================= We End With Iodine ================= */
    if (sh === 'wewi') {
      kavOn = 1; stSeat(kav, wewiSlot); tr(kav, 280, 470, 1.5); op(gog, 1);
      kav.set({ t, talk: talk(t, 'kavya'), mood: t < end('wewi') ? 'happy' : 'smug', look: 0.5 });
      wCardsW.forEach((g, i) => {
        const a = P(t, mid('wewi', 0.04 + i * 0.11), 0.35, pop), b = P(t, mid('wewi', 0.55 + i * 0.11), 0.3, linear);
        op(g, clamp(0.3 + a)); op(g.big, 1 - clamp(a * 1.5)); op(g.word, clamp(a * 1.5));
        tr(g.word, 0, -10, Math.max(0.01, 0.8 + 0.2 * a)); op(g.step, 0.25 + 0.75 * b);
        attr(g.box, 'fill', b > 0.5 ? C.card2 : C.card);
      });
    }

    /* ================= controls ================= */
    if (sh === 'ctrl') {
      const v1 = P(t, mid('controls', 0.12), 0.8, ease);
      vBefore.set({}); vAfter.set({ iodine: v1 });
      op(vAfter, P(t, mid('controls', 0.06), 0.3, linear)); op(vAfterLbl, P(t, mid('controls', 0.06), 0.3, linear)); vArrow.set(P(t, mid('controls', 0.03), 0.4, ease));
      op(vNote, P(t, mid('controls', 0.3), 0.3, linear));
      stPop(vChip, t, mid('controls', 0.4), 310, 600);
      op(pC, P(t, mid('controls', 0.55), 0.35, linear));
      fLeaf.set('#3FAE5A');
      cArrowI.set(P(t, mid('controls', 0.72), 0.4, ease));
      const io = P(t, mid('controls', 0.78), 0.6, ease);
      op(cAfterLeaf, io > 0 ? 1 : 0); cAfterLeaf.set(phMix('#EFE3B8', '#C8782F', io)); op(cAfterLbl, io > 0 ? 1 : 0);
      stPop(cChip, t, mid('controls', 0.88), 1040, 480);
    }

    /* ================= food chain ================= */
    if (sh === 'chain') {
      chSun.upd(t * AMP);
      const items = [chSun, lPlant, chick, plate];
      const POS = [[160, 380], [430, 470], [715, 400], [995, 420]];
      items.forEach((g, i) => { const p = P(t, at('chain') + 0.1 + i * 0.45, 0.45, pop); op(g, clamp(p * 2.5)); const [x, y] = POS[i]; const s = Math.max(0.01, 0.6 + 0.4 * p); tr(g, x, y, i === 1 ? 0.72 * s : s); op(chNames[i], P(t, at('chain') + 0.3 + i * 0.45, 0.3, linear)); });
      chArrows.forEach((a, i) => a.set(P(t, at('chain') + 0.4 + i * 0.45, 0.4, ease)));
      const sp = ((t - (at('chain') + 2)) * 0.45) % 1, spOn = t > at('chain') + 2 ? 1 : 0;
      op(chSpark, spOn); tr(chSpark, lerp(160, 995, sp), 300 - 30 * Math.sin(sp * Math.PI * 3)); chSpark.upd(t);
      stPop(cChain, t, mid('chain', 0.3), 600, 640);
      stPop(cLunch, t, mid('chain', 0.68), 960, 250);
    }

    /* ================= air: oxygen from plants and plankton ================= */
    if (sh === 'air') {
      kavOn = 1; stSeat(kav, airKav); tr(kav, 410, 372, 0.55); op(gog, 0);
      const br = t > mid('air', 0.75);
      kav.set({ t, talk: 0, mood: br ? 'happy' : 'neutral', look: -0.5 });
      stSeat(olive, oliveAirSlot); tr(olive, 860, 330, 1.0);
      olive.set({ t, talk: talk(t, 'olive'), mood: t < mid('air', 0.6) ? 'deadpan' : 'neutral', look: -0.4 });
      o2s.forEach(({ m, x, y0, h, sp, ph }) => { const f = (t * sp + ph) % 1; tr(m, x + 14 * Math.sin(t * 1.5 + ph * 9), y0 - f * h); op(m, Math.min(1, f * 5, (1 - f) * 4)); });
      airBreath.forEach((m, i) => { const f = ((t - mid('air', 0.7)) * 0.6 + i * 0.5) % 1; const on = t > mid('air', 0.7) ? 1 : 0; tr(m, lerp(300, 440, f), lerp(280, 360, f)); op(m, on * Math.min(1, f * 4, (1 - f) * 4)); });
      stPop(cPlants, t, mid('air', 0.48), 260, 512);
      stPop(cPlank, t, mid('air', 0.62), 850, 600);
      stPop(cAir, t, mid('air', 0.2), 600, 140);
    }

    /* ================= main character ================= */
    if (sh === 'main') {
      stSeat(olive, mainSlot);
      const smug = t > mid('main', 0.45);
      tr(olive, 430, 430, 1.45);
      olive.set({ t, talk: talk(t, 'olive'), mood: smug ? 'smug' : 'neutral', look: smug ? 0 : 0.3 });
      const sp = P(t, mid('main', 0.3), 0.15, linear);
      op(spotC, 0.32 * sp); op(spotF, 0.5 * sp);
      const dp = P(t, mid('main', 0.4), 0.45, pop); op(dStar, clamp(dp * 2)); tr(dStar, 0, -130, Math.max(0.01, 0.7 + 0.3 * dp), 8 * Math.sin(t * 1.5) * AMP);
      stCam(mainWrap, 1 + 0.08 * P(t, mid('main', 0.5), end('main') + 0.6 - mid('main', 0.5), linear), 450, 400);
    }

    if (!kavOn) op(kav, 0); else op(kav, 1);
    if (!cliveOn) op(clive, 0); else op(clive, 1);
  };
});

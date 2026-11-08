/* Recap: a padlock clicks shut beside a face-down deck of four cards. Each memory hook is dealt from
   the deck, flips face up in the middle and its picture builds (Cars Won't Go On Grass; Really Sweet
   Crunchy Plants; Light Cools Things; We End With Iodine); earlier cards pile up underneath.
   Showpiece: the four cards fan out together into a grid, then sweep away for "5 exam traps", where
   each trap shows the wrong idea struck out, the right idea ticked, and a small picture. */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  /* "Cars Won't Go On Grass" with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy, RED = '#FF5A4F', BLUE = '#4D8DFF', GREEN = '#4FE07A';
  const LEAF_D = 'M0,0 C40,-60 150,-70 205,0 C150,70 40,60 0,0 Z';
  /* chemical formula with real subscripts: '6CO2' -> 6CO₂ (o.coef colours the leading number) */
  function formula(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 50, sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 600, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    const m = str.match(/^(\d*)(.*)$/);
    let low = false;
    const push = (txt, isSub, fill) => {
      const ts = E('tspan', { fill }, t); ts.textContent = txt;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
    };
    if (m[1]) push(m[1], false, o.coef);
    m[2].replace(/([A-Za-z]+)|(\d+)/g, (all, letters, digits) => { push(letters || digits, !letters); return ''; });
    return t;
  }
  function sunIcon(parent, r) {
    const g = G(parent);
    let d = '';
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; d += `M${(Math.cos(a) * r * 1.35).toFixed(1)},${(Math.sin(a) * r * 1.35).toFixed(1)} L${(Math.cos(a) * r * 1.85).toFixed(1)},${(Math.sin(a) * r * 1.85).toFixed(1)} `; }
    E('path', { d, stroke: Y, 'stroke-width': Math.max(3, r * 0.22), 'stroke-linecap': 'round' }, g);
    E('circle', { r, fill: ball(Y, '#E0A800') }, g);
    return g;
  }
  function moonIcon(parent, r) {
    const g = G(parent), k = r / 28;
    E('path', { d: 'M14.67,-23.85 A28,28 0 1 0 14.67,23.85 A24,24 0 1 1 14.67,-23.85 Z', fill: '#E4ECF5', transform: `scale(${k.toFixed(3)})` }, g);
    return g;
  }
  /* ---------- shared art: the lesson's potted plant, exactly as drawn in the intro (00_intro.js) ----------
     The same code is in every chapter that shows a potted plant. Origin: the middle of the soil surface;
     about 230 x 545 at o.s = 1. o.s scales it; o.see makes the pot see-through, as in 01_bigidea.js, and
     g.soil is then the layer for roots and anything else in the soil; o.k stretches the stem (1 = the
     intro's height); o.ls scales the leaves; o.bare draws the pot only. g.leaves[i] = { el, blade, x, y, r, s }
     are the intro's four leaves, then its two tip leaves; g.grow(k) restretches the stem; g.leafPt(i, f) is
     the point f of the way along leaf i and g.topY() the stem tip, both in g's own coordinates. */
  function introPlant(parent, o) {
    o = o || {};
    const g = G(parent), pg = G(g), S = o.s || 1, ls = o.ls || 1, f1 = v => +v.toFixed(1);
    if (S !== 1) tr(pg, 0, 0, S);
    if (o.see) {
      E('path', { d: 'M-110,-6 L110,-6 L110,24 L100,24 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 L-100,24 L-110,24 Z', fill: linGrad('#7A5538', '#3E2818', true) }, pg);
      g.soil = G(pg);
    }
    const stem = o.bare ? null : E('path', { fill: 'none', stroke: C.stem, 'stroke-width': 12, 'stroke-linecap': 'round' }, pg);
    g.leaves = (o.bare ? [] : [[-5, -75, 198, 0.62], [5, -135, -24, 0.66], [-4, -205, 206, 0.7], [4, -262, -30, 0.56], [0, -328, -64, 0.2], [0, -328, -116, 0.2]]).map(([x, y, r, s], i) => {
      const el = leaf(pg, s * ls), parts = Array.from(el.firstChild.children), veins = parts.slice(2);
      if (i < 4) veins[0].setAttribute('d', veins.map(v => v.getAttribute('d')).join(' '));   // one path for the side veins
      veins.slice(i < 4 ? 1 : 0).forEach(v => v.remove());                                    // (too small to see on the tip leaves)
      return { el, blade: parts[0], x, y, r, s: s * ls };
    });
    E('path', { d: 'M-100,22 L100,22 L80,164 Q78,176 66,176 L-66,176 Q-78,176 -80,164 Z', fill: o.see ? 'rgba(217,130,74,0.2)' : ball('#D9824A', '#9A4E1E'), stroke: '#F0B48A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, pg);
    E('rect', { x: -114, y: -6, width: 228, height: 32, rx: 9, fill: o.see ? 'rgba(227,149,94,0.3)' : ball('#E3955E', '#A9592A'), stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -6, rx: 113, ry: 12, fill: '#EBA26C', stroke: '#F0B48A', 'stroke-width': 3 }, pg);
    E('ellipse', { cx: 0, cy: -5, rx: 99, ry: 8, fill: C.soil }, pg);
    let kNow = 1;
    g.grow = k => {
      kNow = k;
      if (stem) stem.setAttribute('d', `M0,-6 C-9,${f1(-90 * k)} 10,${f1(-180 * k)} 0,${f1(-268 * k)} C-4,${f1(-298 * k)} 0,${f1(-318 * k)} 0,${f1(-330 * k)}`);
      g.leaves.forEach(L => tr(L.el, L.x, L.y * k, 1, L.r));
    };
    g.grow(o.k || 1);
    g.leafPt = (i, f) => { const L = g.leaves[i], a = L.r * Math.PI / 180, d = 205 * L.s * f; return [S * (L.x + Math.cos(a) * d), S * (L.y * kNow + Math.sin(a) * d)]; };
    g.topY = () => -330 * kNow * S;
    return g;
  }
  /* centres for a row of labels inside a card, spread across maxW */
  function rowX(labels, size, maxW) {
    const ws = labels.map(s => textWidth(s, size, FD, 700));
    const tot = ws.reduce((a, b) => a + b, 0), gap = Math.max(14, (maxW - tot) / (labels.length - 1));
    let x = -(tot + gap * (labels.length - 1)) / 2;
    return ws.map(w => { const c = x + w / 2; x += w + gap; return c; });
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- the deck of memory-hook cards ---------- */
  const CW = 520, CH = 255;
  const FOC = [600, 432, 1.3];                                   // a dealt card, face up
  const DECK = [1046, 640, 0.3, -8];                             // the face-down deck
  const SLOT = [[310, 245, -1.6], [890, 245, 1.3], [310, 525, 1.1], [890, 525, -1.4]];
  const IDS = ['cars', 'rscp', 'lct', 'wewi'];
  function backArt(parent) {
    const g = G(parent);
    E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 22, fill: '#163D31', stroke: C.chloro, 'stroke-width': 5 }, g);
    E('rect', { x: -CW / 2 + 22, y: -CH / 2 + 22, width: CW - 44, height: CH - 44, rx: 14, fill: 'none', stroke: 'rgba(91,210,122,0.45)', 'stroke-width': 4 }, g);
    E('path', { d: LEAF_D, fill: ball(C.plant, C.plantDk), stroke: C.plantDk, 'stroke-width': 4, transform: 'translate(-82 0) scale(0.8)' }, g);
    return g;
  }
  const deckG = G(root);
  const deckBacks = [0, 1, 2, 3].map(k => { const b = backArt(deckG); tr(b, DECK[0] - k * 4, DECK[1] - k * 5, DECK[2], DECK[3]); return b; });
  const cardsG = G(root);
  const HC = IDS.map(id => {
    const g = G(cardsG);
    E('rect', { x: -CW / 2 + 8, y: -CH / 2 + 12, width: CW, height: CH, rx: 22, fill: 'rgba(0,0,0,0.28)' }, g);
    const back = backArt(g);
    const front = G(g);
    card(front, -CW / 2, -CH / 2, CW, CH, { fill: C.card, stroke: C.line });
    const hl = E('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: 22, fill: 'none', stroke: Y, 'stroke-width': 4 }, front);
    return { id, g, back, front, hl };
  });
  const title = (c, str, maxW) => { const s = initials(str, C.ink); rich(c.front, -228, -66, s, { size: fit(s, 36, maxW || 350), weight: 700 }); };

  // 1. Cars Won't Go On Grass, with a little car parked on the grass
  const k1 = HC[0];
  title(k1, "Cars Won't Go On Grass");
  const car = G(k1.front); tr(car, 196, -76);
  E('path', { d: 'M-58,24 Q-40,14 -22,24 Q-4,14 14,24 Q32,14 50,24 L58,24 L58,32 L-58,32 Z', fill: C.plant, stroke: C.plantDk, 'stroke-width': 2 }, car);
  E('path', { d: 'M-50,14 L-50,0 Q-49,-8 -38,-10 L-24,-28 Q-19,-33 -10,-33 L16,-33 Q24,-33 29,-27 L40,-11 Q52,-9 52,2 L52,14 Z', fill: ball('#5B8DEF', '#2A55B5'), stroke: '#B5CEFF', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, car);   // the blue car of 02_equations.js
  E('path', { d: 'M-34,-11 L-21,-27 L-4,-27 L-4,-11 Z M2,-11 L2,-27 L15,-27 Q20,-27 23,-23 L32,-11 Z', fill: '#CFE6FF' }, car);
  [-28, 30].forEach(x => { E('circle', { cx: x, cy: 15, r: 11, fill: '#2B3540', stroke: '#0F1720', 'stroke-width': 2 }, car); E('circle', { cx: x, cy: 15, r: 4.5, fill: '#C9D6DE' }, car); });
  rich(k1.front, -228, 10, [['c', Y, 800], ['arbon dioxide', C.co2, 700], ' + ', ['w', Y, 800], ['ater', C.water, 700], ' →'], { size: 30 });
  rich(k1.front, -228, 56, [['g', Y, 800], ['lucose', C.glucose, 700], ' + ', ['o', Y, 800], ['xygen', C.oxygen, 700]], { size: 30 });
  rich(k1.front, -228, 100, ['(all in a ', ['g', Y, 800], 'reen plant)'], { size: 25, fill: C.muted });

  // 2. Really Sweet Crunchy Plants: the four uses of glucose
  const k2 = HC[1];
  title(k2, 'Really Sweet Crunchy Plants', 456);
  const gluW = textWidth('glucose is used for:', 25, FD, 600);
  T(k2.front, -228, -26, 'glucose is used for:', { size: 25, weight: 600, fill: C.muted });
  tr(molGlucose(k2.front, 15), -228 + gluW + 26, -35);
  const sp2 = spark(k2.front, 15, { seed: 3 }); tr(sp2, -208, 16);
  const grain = G(k2.front); tr(grain, 42, 16);
  E('ellipse', { rx: 17, ry: 13, fill: '#F2EAD3', stroke: '#BCA97A', 'stroke-width': 2.5 }, grain);
  E('path', { d: 'M-10,1 a10,7 0 1,0 20,0 a10,7 0 1,0 -20,0 M-4,1 a4,3 0 1,0 8,0 a4,3 0 1,0 -8,0', fill: 'none', stroke: '#BCA97A', 'stroke-width': 2 }, grain);
  // the cellulose (cell wall of fibres) and protein (bead chain) icons of the uses-of-glucose cards, 06_glucose.js
  const wall = G(k2.front); tr(wall, -208, 74, 0.68);
  E('rect', { x: -26, y: -21, width: 52, height: 42, rx: 9, fill: 'rgba(91,210,122,0.12)', stroke: '#7FE09A', 'stroke-width': 6 }, wall);
  E('path', { d: 'M-26,-8 L-13,-21 M-26,8 L3,-21 M-20,21 L19,-21 M-4,21 L26,-11 M12,21 L26,7', stroke: '#C9F2D3', 'stroke-width': 2, opacity: 0.7 }, wall);
  const beads = G(k2.front); tr(beads, 40, 74, 0.72);
  const BP2 = [[-24, 10], [-12, -6], [2, 8], [15, -8], [26, 6]];
  E('path', { d: 'M' + BP2.map(p => p.join(',')).join(' L'), fill: 'none', stroke: '#E9EEF2', 'stroke-width': 3, opacity: 0.7 }, beads);
  BP2.forEach((p, k) => E('circle', { cx: p[0], cy: p[1], r: 8.5, fill: ball(['#FF8FB1', '#7AD3FF', '#FFD166', '#9BE38A', '#C9A0FF'][k], '#55606B') }, beads));
  [[-180, 26, 'respiration'], [70, 26, 'starch'], [-180, 84, 'cellulose'], [70, 84, 'proteins']].forEach(([x, y, w]) => rich(k2.front, x, y, [[w[0], Y, 800], [w.slice(1), C.ink]], { size: 28, weight: 700 }));

  // 3. Light Cools Things: the three limiting factors
  const k3 = HC[2];
  title(k3, 'Light Cools Things', 456);
  T(k3.front, -228, -26, 'these can limit the rate:', { size: 25, weight: 600, fill: C.muted });
  const L3 = ['light', 'carbon dioxide', 'temperature'], X3 = rowX(L3, 27, 450);
  tr(sunIcon(k3.front, 15), X3[0], 26);
  tr(molCO2(k3.front, 12), X3[1], 26);
  const th3 = thermometer(k3.front, 56, C.bad); tr(th3, X3[2], 46, 0.7); th3.set(0.55);
  L3.forEach((w, i) => rich(k3.front, X3[i], 96, [[w[0], Y, 800], [w.slice(1), C.ink]], { size: 27, weight: 700, anchor: 'middle' }));

  // 4. We End With Iodine: the starch-test steps in order
  const k4 = HC[3];
  title(k4, 'We End With Iodine', 456);
  T(k4.front, -228, -26, 'the starch test, in order:', { size: 25, weight: 600, fill: C.muted });
  const L4 = ['water', 'ethanol', 'warm water', 'iodine'], X4 = rowX(L4, 26, 460);
  const LIQ = [C.water, '#8FDB9E', C.water, '#C8641E'];
  X4.forEach((x, i) => {
    const b = beaker(k4.front, 46, 58, { level: 0.62, liquid: LIQ[i], marks: false }); tr(b, x, 26, 0.84);
    if (i < 3) arrow(k4.front, x + 26, 30, X4[i + 1] - 26, 30, { color: C.faint, width: 3, head: 10 });
  });
  E('path', { d: `M${X4[0] - 7},44 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0 M${X4[0] + 3},37 a2.5,2.5 0 1,0 5,0 a2.5,2.5 0 1,0 -5,0`, fill: 'none', stroke: '#E8F7FF', 'stroke-width': 2 }, k4.front);
  E('path', { d: `M${X4[2] - 7},-6 q-5,-7 0,-13 q5,-6 0,-13 M${X4[2] + 7},-6 q-5,-7 0,-13 q5,-6 0,-13`, fill: 'none', stroke: C.heat, 'stroke-width': 3, 'stroke-linecap': 'round' }, k4.front);
  L4.forEach((w, i) => rich(k4.front, X4[i], 96, [[w[0], Y, 800], [w.slice(1), C.ink]], { size: 26, weight: 700, anchor: 'middle' }));

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['reflects green', 'pigment ≠ structure', 'over the arrow, 6s', 'all the time', 'another factor'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 300, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: Math.max(24, fit([nm], 25, 218)), weight: 600 });
    const tk = tick(g, 11); tr(tk, 86, y + 1);
    return { g, box, disc, num, tk };
  });
  const focus = G(traps);
  card(focus, 370, 215, 780, 420, { fill: C.card, stroke: C.line });
  const hint = T(focus, 760, 438, 'Spot the mistake, then fix it', { size: 30, weight: 600, fill: C.muted, anchor: 'middle' });
  function trapGroup(wrong, right, drawIllus) {
    const g = G(focus);
    const wx = cross(g, 14); tr(wx, 420, 302);
    const wt = T(g, 458, 313, wrong, { size: 32, weight: 600, fill: C.muted });
    const sw = textWidth(wrong, 32, FD, 600);
    const st = strike(g, 452, 302, 466 + sw, C.bad);
    const rg = G(g);
    const rt = tick(rg, 15); tr(rt, 420, 402);
    rich(rg, 458, 414, right, { size: fit(right, 36, 660), weight: 700 });
    const ill = G(g); tr(ill, 760, 540);
    const anim = drawIllus(ill) || (() => {});
    return { g, wt, st, rg, ill, anim };
  }
  const T5 = [
    trapGroup('Chlorophyll absorbs green light', ['Chlorophyll ', ['reflects', Y, 800], ' green light'], g => {
      const lf = leaf(g, 0.8); tr(lf, -250, 40, 1, -6);
      const ray = (x1, y1, x2, y2, col) => E('path', { d: `M${x1},${y1} L${x2},${y2}`, stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none', 'stroke-dasharray': '16 10' }, g);
      const rs = [ray(-262, -70, -166, 30, RED), ray(-222, -80, -140, 26, BLUE), ray(-182, -90, -114, 22, GREEN), ray(-114, 22, -18, -52, GREEN)];
      E('path', { d: 'M0,0 L-20,-12 L-14,0 L-20,12 Z', fill: GREEN, transform: `translate(-12 -57) rotate(${(Math.atan2(-74, 96) * 180 / Math.PI).toFixed(1)})` }, g);
      const s1 = spark(g, 11, { seed: 1 }), s2 = spark(g, 11, { seed: 4 });
      const eye = G(g); tr(eye, 22, -70, 1, -36);
      E('path', { d: 'M-30,0 Q0,-24 30,0 Q0,24 -30,0 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 3 }, eye);
      E('circle', { cx: -7, r: 11, fill: ball(C.plant, C.plantDk) }, eye);
      E('circle', { cx: -7, r: 5, fill: '#10202B' }, eye);
      rich(g, 220, 0, ['absorbs mainly'], { size: 27, anchor: 'middle', fill: C.muted });
      rich(g, 220, 38, [['red', RED, 800], ' and ', ['blue', '#7FB0FF', 800]], { size: 30, anchor: 'middle' });
      return t => {
        const k = (t * 40 * calm) % 26;
        rs.forEach(r => r.setAttribute('stroke-dashoffset', (-k).toFixed(1)));
        s1.upd(t); s2.upd(t + 0.4);
        tr(s1, -166, 30, 0.7 + 0.3 * wave(t, 0.8)); tr(s2, -140, 26, 0.7 + 0.3 * wave(t, 0.8, 0.5));
      };
    }),
    trapGroup('Chlorophyll and chloroplast are the same', ['Chlorophyll = ', ['pigment', Y, 800], ';  chloroplast = ', ['structure', Y, 800]], g => {
      const fl = flask(g, 0.46, { level: 0.6, liquid: C.chloro }); tr(fl, -180, -18);
      const ch = chloroplast(g, 170, 92); tr(ch, 170, -18);
      T(g, 0, -4, '≠', { size: 60, weight: 700, anchor: 'middle', fill: C.muted });
      rich(g, -180, 64, [['chlorophyll', C.chloro, 800], ': the green pigment'], { size: 26, anchor: 'middle' });
      rich(g, 170, 64, [['chloroplast', C.chloro, 800], ': holds it'], { size: 26, anchor: 'middle' });
      return t => tr(ch, 170, -18 + 4 * Math.sin(t * 1.2 * calm), 1, 3 * Math.sin(t * 0.7 * calm));
    }),
    trapGroup('sunlight + CO₂ + H₂O → C₆H₁₂O₆ + O₂', ['Light goes ', ['over the arrow', Y, 800], '. Keep the ', ['6s', Y, 800], '!'], g => {
      const SZ = 40, items = ['6CO2', '+', '6H2O', '>', 'C6H12O6', '+', '6O2'];
      const glowG = G(g);
      const parts = items.map(s => {
        const pg = G(g);
        if (s === '+') { T(pg, 0, 0, '+', { size: SZ, weight: 600, anchor: 'middle', fill: C.muted }); return { pg, w: SZ * 0.55 }; }
        if (s === '>') { arrow(pg, -40, -SZ * 0.3, 40, -SZ * 0.3, { color: C.ink, width: 6 }); return { pg, w: 84, arrow: true }; }
        const te = formula(pg, 0, 0, s, { size: SZ, weight: 700, coef: Y });
        let w = 0; try { w = te.getComputedTextLength(); } catch (e) { w = 0; }
        return { pg, w: w || s.length * SZ * 0.5, six: /^6/.test(s) };
      });
      const GAP = 14, tot = parts.reduce((a, p) => a + p.w, 0) + GAP * (parts.length - 1);
      let x = -tot / 2;
      const glows = [];
      parts.forEach(p => {
        p.x = x + p.w / 2; tr(p.pg, p.x, 24); x += p.w + GAP;
        if (p.six) { const c6 = textWidth('6', SZ, FD, 700); glows.push(E('circle', { cx: p.x - p.w / 2 + c6 / 2, cy: 24 - SZ * 0.34, r: 30, fill: glow(Y) }, glowG)); }
      });
      const ax = parts[3].x;
      const sn = sunIcon(g, 13); tr(sn, ax - 16, -48);
      T(g, ax + 10, -40, 'light', { size: 26, weight: 700, fill: Y });
      T(g, ax, 68, 'chlorophyll', { size: 26, weight: 700, fill: C.chloro, anchor: 'middle' });
      return t => glows.forEach((c, i) => op(c, 0.35 + 0.65 * wave(t, 1.2, i * 0.15)));
    }),
    trapGroup('Plants only respire at night', ['Plants respire ', ['all the time', Y, 800]], g => {
      const sun = sunIcon(g, 24); tr(sun, -150, -8);
      const moon = moonIcon(g, 28); tr(moon, 150, -8);
      const plant = introPlant(g, { s: 0.21 }); tr(plant, 0, 62 - 176 * 0.21);     // pot bottom at y = 62
      const tk1 = tick(g, 11); tr(tk1, -150, 56);
      const tk2 = tick(g, 11); tr(tk2, 150, 56);
      const sp = spark(g, 10, { seed: 4 }); tr(sp, 0, -20);
      const spA = spark(g, 9, { seed: 6 }), spB = spark(g, 9, { seed: 7 });
      return t => { sp.upd(t); spA.upd(t + 0.3); spB.upd(t + 0.6); tr(spA, -150 + 26, -36, 0.8 + 0.2 * wave(t, 1.1)); tr(spB, 150 + 26, -36, 0.8 + 0.2 * wave(t, 1.1, 0.5)); };
    }),
    trapGroup('A plateau means the plant is full', ['Plateau: ', ['another factor', Y, 800], ' is limiting'], g => {
      E('path', { d: 'M-170,-74 L-170,48 L190,48', fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      T(g, -182, -48, 'rate', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
      T(g, 190, 82, 'light intensity', { size: 26, weight: 600, fill: C.muted, anchor: 'end' });
      E('path', { d: 'M-170,48 Q-96,-52 -20,-52', fill: 'none', stroke: C.plant, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      const flat = E('path', { d: 'M-20,-52 L180,-52', fill: 'none', stroke: Y, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
      E('path', { d: 'M-20,-44 L-20,46', stroke: C.faint, 'stroke-width': 3, 'stroke-dasharray': '7 7' }, g);
      T(g, 80, -14, 'another factor', { size: 26, weight: 700, fill: Y, anchor: 'middle' });
      T(g, 80, 18, 'is limiting', { size: 26, weight: 700, fill: Y, anchor: 'middle' });
      return t => flat.setAttribute('stroke-width', (7 + 2 * wave(t, 1.3)).toFixed(2));
    }),
  ];

  /* ---------- update ---------- */
  const tDeal = i => at(IDS[i]) - 0.2;
  const tFan = mid('wewi', 0.5), tSweep = at('traps') - 0.3;
  return t => {
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('cars') + 0.1, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300 - 30 * P(t, at('cars') - 0.4, 0.5), 1 - 0.1 * P(t, at('cars') - 0.4, 0.5));
    }

    // the deck: one face-down card leaves each time a hook is dealt
    op(deckG, P(t, S.first - 0.6, 0.5, linear));
    let dealt = 0; IDS.forEach((id, i) => { if (t >= tDeal(i)) dealt = i + 1; });
    deckBacks.forEach((b, k) => op(b, k < 4 - dealt ? 1 : 0));

    // the hook cards: dealt and flipped, piled, fanned out, swept away
    HC.forEach((c, i) => {
      const t0 = tDeal(i);
      if (t < t0) { op(c.g, 0); return; }
      const pd = P(t, t0, 0.75, easeOut), k = 3 - i;
      const sx0 = DECK[0] - k * 4, sy0 = DECK[1] - k * 5;
      let x = lerp(sx0, FOC[0], pd), y = lerp(sy0, FOC[1], pd) - 90 * Math.sin(pd * Math.PI), s = lerp(DECK[2], FOC[2], pd), r = lerp(DECK[3], 0, pd) + 10 * Math.sin(pd * Math.PI);
      let depth = 0;
      for (let j = i + 1; j < 4; j++) depth += P(t, tDeal(j), 0.6);
      x -= 14 * depth; y += 10 * depth; r -= 2.4 * depth;
      const pf = P(t, tFan + i * 0.08, 0.85, easeOut);
      const sl = SLOT[i];
      x = lerp(x, sl[0], pf); y = lerp(y, sl[1], pf); s = lerp(s, 1, pf); r = lerp(r, sl[2], pf) + 8 * Math.sin(pf * Math.PI) * (i % 2 ? 1 : -1);
      const pw = P(t, tSweep + i * 0.06, 0.55, easeIn);
      x += 1300 * pw; r += 24 * pw;
      op(c.g, 1 - P(t, tSweep + i * 0.06 + 0.35, 0.2, linear));
      if (pw >= 1) return;
      const f = P(t, t0 + 0.08, 0.5, linear), face = f >= 0.5, sx = s * Math.max(0.001, Math.abs(1 - 2 * f));
      op(c.back, face ? 0 : 1); op(c.front, face ? 1 : 0);
      c.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(2)}) scale(${sx.toFixed(4)} ${s.toFixed(4)})`);
      op(c.hl, (1 - clamp(depth)) * (1 - pf) * P(t, t0 + 0.6, 0.3, linear));
    });
    sp2.upd(t);

    // traps
    const ta = P(t, at('traps') + 0.05, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.2 + i * 0.12), 0.45, pop);
        const active = t >= tk - 0.15 && t < nx - 0.15, done = t >= nx - 0.15;
        op(s.g, clamp(appear * 2) * (active || done ? 1 : 0.6));
        tr(s.g, (1 - clamp(appear)) * -30, 0);
        s.box.setAttribute('stroke', active ? C.energy : C.line);
        s.box.setAttribute('fill', active ? C.card2 : C.card);
        s.disc.setAttribute('fill', done ? C.good : active ? C.energy : C.card2);
        s.num.setAttribute('fill', active ? C.bg0 : C.ink);
        op(s.num, done ? 0 : 1); op(s.tk, done ? 1 : 0);
        s.tk.firstChild.setAttribute('stroke', C.bg0);
      });
      T5.forEach((g, i) => {
        const k = 't' + (i + 1), t0 = at(k), nx = i < 4 ? at('t' + (i + 2)) : 1e6;
        const v = win(t, t0 - 0.2, nx + 0.05, 0.3);
        op(g.g, v);
        if (v <= 0) return;
        op(g.wt, P(t, t0 - 0.2, 0.4, linear));
        g.st.set(P(t, mid(k, 0.3), 0.5, easeOut));
        const rp = P(t, mid(k, 0.38), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.55), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

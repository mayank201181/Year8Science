/* Scene 5: The seating plan (the reactivity series).
   Shots (hard sitcom cuts): venue reception (pH 7, green): the seating board on an easel = the REACTIVITY SERIES
   -> most reactive at the top table, least by the door -> the rows light up as they are named, the HYDROGEN line
   -> the mnemonic builds beside the rows, a zebra in the pause -> Henry the doorman on the hydrogen line, STAFF badge
   -> lab: the fizz race (Mg vigorous with a Maggie cameo, Zn steady, Fe slow, Cu nothing, NO REACTION stamp)
   -> Goldie by the door (dilute acid / water / gossip all crossed) -> Goldie's confessional (found as a pure metal)
   -> the top table: Potassium in his jar under oil -> Kavya: "Why is he in a jar?" -> Indi: fast with cold water,
   a piece whizzing on a trough, Potassium's eyes go wide -> metal + water word equations -> Natalie: "That's me!",
   the trough turns purple: alkaline. */
scene('seating', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed seat) ---------- */
  const seatPlain = id => { const l = S.ch.lines.find(x => x.id === id); return l ? l.cap.replace(/^\*\*[^*]*\*\*\s*/, '').replace(/\*\*/g, '') : ''; };
  // time a word is (roughly) said: its character position through the line; `from` skips ahead to a phrase first
  function seatW(id, word, from) {
    const s = seatPlain(id), f = from ? Math.max(0, s.toLowerCase().indexOf(from.toLowerCase())) : 0;
    const m = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').exec(s.slice(f));
    const i = m ? f + m.index : f;
    return at(id) + (end(id) - at(id)) * i / Math.max(1, s.length);
  }
  function seatPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  function seatLabel(parent, text, o) { o = o || {}; return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: 700 }); }
  // a chip with a tick or a cross after it
  function seatMark(parent, text, good, o) {
    const g = G(parent), c = seatLabel(g, text, o);
    const m = good ? tick(g, 15) : cross(g, 14); tr(m, c.w / 2 + 34, 0);
    tr(c, -22, 0); g.w = c.w + 70; return g;
  }
  // a rubber stamp: g.set(p, x, y, rot) thumps it down
  function seatStamp(parent, text) {
    const g = G(parent), size = 50, col = C.bad;
    const w = textWidth(text, size, FD, 800) + size * 1.3, h = size * 1.7;
    E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: 'rgba(24,8,12,0.88)', stroke: col, 'stroke-width': 7 }, g);
    E('rect', { x: -w / 2 + 10, y: -h / 2 + 10, width: w - 20, height: h - 20, rx: 8, fill: 'none', stroke: col, 'stroke-width': 2, opacity: 0.6 }, g);
    T(g, 0, size * 0.36, text, { size, weight: 800, anchor: 'middle', fill: col, ls: 2 });
    g.set = (p, x, y, rot) => { op(g, clamp(p * 4)); tr(g, x, y, lerp(1.8, 1, easeOut(clamp(p))), rot); };
    return g;
  }
  // a glass trough of water; g.set(colour); g.upd(t, on) skates a small grey piece across the surface
  function seatTrough(parent) {
    const g = G(parent);
    const water = E('path', { d: 'M-192,-24 L-180,66 Q-178,76 -166,76 L166,76 Q178,76 180,66 L192,-24 Z', fill: '#7FD3F5', opacity: 0.75 }, g);
    E('path', { d: 'M-192,-24 L192,-24', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.7 }, g);
    E('path', { d: 'M-204,-74 L-184,68 Q-182,82 -168,82 L168,82 Q182,82 184,68 L204,-74', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    E('rect', { x: 150, y: -50, width: 7, height: 110, rx: 3, fill: '#FFFFFF', opacity: 0.3 }, g);
    const fx = G(g), trail = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.75 }, fx);
    const bs = [0, 1, 2, 3, 4].map(() => E('circle', { r: 6, fill: 'rgba(255,255,255,0.25)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, fx));
    const piece = G(fx);
    E('rect', { x: -17, y: -13, width: 34, height: 26, rx: 7, fill: ball('#E0E4E8', '#7E8892'), stroke: '#55606A', 'stroke-width': 3 }, piece);
    g.set = col => attr(water, 'fill', col);
    g.upd = (t, on) => {
      op(fx, on);
      if (!on) return;
      const x = 140 * Math.sin(t * 2.4 * (0.5 + 0.5 * AMP)), v = Math.cos(t * 2.4 * (0.5 + 0.5 * AMP)), dir = v >= 0 ? 1 : -1;
      tr(piece, x, -30 + 2 * Math.sin(t * 17), 1, 8 * Math.sin(t * 11) * AMP);
      attr(trail, 'd', `M${(x - dir * 26).toFixed(1)},-34 L${(x - dir * 80).toFixed(1)},-34 M${(x - dir * 30).toFixed(1)},-22 L${(x - dir * 64).toFixed(1)},-22`);
      bs.forEach((b, i) => { const f = (t * 1.8 + i / 5) % 1; tr(b, x - dir * (10 + i * 12), -34 - f * 40); op(b, 1 - f); });
    };
    g.set('#7FD3F5'); g.upd(0, 0);
    return g;
  }
  // a small cartoon zebra (for the mnemonic)
  function seatZebra(parent) {
    const g = G(parent), ink = SC_INK;
    E('path', { d: 'M-34,20 L-38,62 M-14,24 L-14,64 M22,24 L22,64 M42,20 L46,62', stroke: ink, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    E('path', { d: 'M54,-6 Q80,0 76,30', fill: 'none', stroke: ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('ellipse', { cx: 4, cy: 0, rx: 58, ry: 32, fill: '#FFFFFF', stroke: ink, 'stroke-width': 4 }, g);
    E('path', { d: 'M-20,-30 Q-26,0 -18,30 M0,-32 Q-6,0 2,32 M20,-30 Q14,0 22,30 M38,-24 Q34,0 40,22', fill: 'none', stroke: ink, 'stroke-width': 7 }, g);
    E('path', { d: 'M-40,-14 L-66,-62 Q-74,-80 -92,-70 L-104,-44 Q-106,-32 -94,-30 L-60,-4 Z', fill: '#FFFFFF', stroke: ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-50,-24 L-76,-52 M-60,-12 L-86,-38', stroke: ink, 'stroke-width': 6 }, g);
    E('path', { d: 'M-46,-26 Q-56,-60 -74,-78', fill: 'none', stroke: ink, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);   // mane
    E('circle', { cx: -84, cy: -58, r: 4.5, fill: ink }, g);
    E('path', { d: 'M-78,-76 L-72,-94 L-66,-74', fill: '#FFFFFF', stroke: ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    return g;
  }

  // fewer elements, same picture: merge sibling rects (no rx), circles and paths that share every paint attribute
  // into one path, and keep only a few of the venue's drifting water molecules
  function seatSlim(container) {
    const KEYS = ['fill', 'stroke', 'stroke-width', 'opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray'];
    const groups = new Map();
    [...container.children].forEach(el => {
      if (el.tagName === 'g') { seatSlim(el); return; }
      if (el.getAttribute('transform') || el.getAttribute('style') || el.getAttribute('pathLength')) return;
      const n = k => +el.getAttribute(k) || 0;
      let d = null;
      if (el.tagName === 'rect' && !el.getAttribute('rx')) d = `M${n('x')},${n('y')}h${n('width')}v${n('height')}h${-n('width')}Z`;
      else if (el.tagName === 'circle') { const r = n('r'); d = `M${n('cx') - r},${n('cy')}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`; }
      else if (el.tagName === 'path' && /^M/.test(el.getAttribute('d') || '')) d = el.getAttribute('d');
      if (!d) return;
      const key = KEYS.map(a => el.getAttribute(a)).join('|');
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push({ el, d });
    });
    groups.forEach(list => {
      if (list.length < 2) return;
      const a = {}; KEYS.forEach(k => { const v = list[0].el.getAttribute(k); if (v !== null) a[k] = v; });
      a.d = list.map(o => o.d).join(' ');
      container.insertBefore(E('path', a), list[0].el);
      list.forEach(o => o.el.remove());
    });
  }
  function seatSlimVenue(v) { [...v.children].filter(c => c.tagName === 'g' && c.style.opacity === '0.35').slice(5).forEach(c => c.remove()); seatSlim(v); }

  /* ---------- layers: world (camera) and hud ---------- */
  const world = G(root), bgL = G(world), backL = G(world), benchL = G(world), propL = G(world), castL = G(world), frontL = G(world);
  const hud = G(root);
  let camK = 1, camX = 600, camY = 375;
  function seatCam(k, cx, cy) {
    camK = k; camX = clamp(cx, 600 / k, 1200 - 600 / k); camY = clamp(cy, 375 / k, 750 - 375 / k);
    world.setAttribute('transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-camX).toFixed(1)} ${(-camY).toFixed(1)})`);
  }
  const seatScr = (x, y) => [600 + (x - camX) * camK, 375 + (y - camY) * camK];

  /* ---------- sets ---------- */
  const venue = ngVenue(bgL);
  const venDim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#08121A', opacity: 0.62 }, bgL);
  const labG = G(bgL), lab = ngLab(labG);
  const conf = ngConf(bgL, 'goldie');
  const bench = ngBench(benchL, 540);
  seatSlimVenue(venue); seatSlim(lab);

  /* ---------- the cast ---------- */
  const kavya = cast(backL, 'kavya', { goggles: 'on' });
  const indi = cast(castL, 'indi', { ph: 7 });
  const henry = cast(castL, 'henry');
  const goldie = cast(castL, 'goldie');
  const natalie = cast(castL, 'natalie');
  const jar = ngJar(castL, 1), pot = cast(jar.inner, 'potassium'); tr(pot, 0, 0, 0.8);
  const ALL = [kavya, indi, henry, goldie, natalie, jar];

  /* ================= the seating board ================= */
  const boardG = G(propL);
  E('path', { d: 'M-190,250 L-240,420 M190,250 L240,420 M0,260 L0,430', stroke: '#8A5A2B', 'stroke-width': 16, 'stroke-linecap': 'round' }, boardG);
  const board = ngSeating(boardG);
  const ROWY = [-210, -164, -118, -72, -26, 20, 66, 158, 204, 250], HY = 112;
  const letterGlow = board.rows.map(r => { const gl = E('circle', { cx: -210, cy: -2, r: 30, fill: glow(C.energy) }, r); r.insertBefore(gl, r.children[1]); return gl; });
  const hlRow = E('rect', { x: -252, y: -27, width: 504, height: 54, rx: 14, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, board);
  const reactChip = seatLabel(hud, '= the REACTIVITY SERIES', { size: 34, color: C.energy, stroke: C.energy });
  // most / least reactive
  const sideG = G(propL);
  const sideArrow = arrow(sideG, 500, 610, 500, 170, { color: C.energy, width: 9 });
  const mostG = G(sideG);
  E('rect', { x: 344, y: 172, width: 142, height: 92, rx: 14, fill: 'rgba(10,27,39,0.85)' }, mostG);
  T(mostG, 474, 214, 'MOST', { size: 40, weight: 800, anchor: 'end', fill: C.energy });
  T(mostG, 474, 248, 'reactive', { size: 28, weight: 700, anchor: 'end', fill: C.ink });
  const crown = G(mostG); tr(crown, 420, 152);
  E('path', { d: 'M-34,16 L-34,-12 L-17,4 L0,-22 L17,4 L34,-12 L34,16 Z', fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 4, 'stroke-linejoin': 'round' }, crown);
  E('circle', { cx: 0, cy: -22, r: 5, fill: '#FF6FB5' }, crown);
  const leastG = G(sideG);
  E('rect', { x: 344, y: 540, width: 142, height: 92, rx: 14, fill: 'rgba(10,27,39,0.85)' }, leastG);
  T(leastG, 474, 582, 'LEAST', { size: 40, weight: 800, anchor: 'end', fill: '#9FD8FF' });
  T(leastG, 474, 616, 'reactive', { size: 28, weight: 700, anchor: 'end', fill: C.ink });
  const doorI = G(leastG); tr(doorI, 420, 668);
  E('rect', { x: -24, y: -36, width: 48, height: 72, rx: 4, fill: '#8A5A2B', stroke: '#4A2E14', 'stroke-width': 4 }, doorI);
  E('circle', { cx: 12, cy: 4, r: 4, fill: '#FFD43B' }, doorI);
  // the mnemonic, one word per row
  const WORDS = ['Please', 'Stop', 'Calling', 'Me', 'A', 'Zebra', 'Instead', 'Call', 'Some', 'Gold'];
  const mnemo = G(propL);
  E('rect', { x: 644, y: 186, width: 250, height: 474, rx: 18, fill: 'rgba(10,27,39,0.88)', stroke: '#FF6FB5', 'stroke-width': 4 }, mnemo);
  const wordEls = WORDS.map((w, i) => T(mnemo, 676, 405 + 0.95 * ROWY[i] + 11, `**${w[0]}**${w.slice(1)}`, { size: 32, weight: 600, fill: C.ink, boldFill: C.energy }));
  const zebra = G(propL); seatZebra(zebra);
  // Henry the doorman on the hydrogen line
  const ropeG = G(propL);
  E('path', { d: 'M600,511 L1150,511', stroke: '#E8424F', 'stroke-width': 5, 'stroke-dasharray': '14 8' }, ropeG);
  [660, 940].forEach(x => {
    E('rect', { x: x - 7, y: 427, width: 14, height: 84, rx: 4, fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 2 }, ropeG);
    E('ellipse', { cx: x, cy: 513, rx: 26, ry: 8, fill: '#B8860B', stroke: '#7A5806', 'stroke-width': 2 }, ropeG);
    E('circle', { cx: x, cy: 423, r: 11, fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 2 }, ropeG);
  });
  E('path', { d: 'M660,435 Q800,500 940,435', fill: 'none', stroke: '#B3263A', 'stroke-width': 11, 'stroke-linecap': 'round' }, ropeG);
  const aboveC = seatMark(hud, 'react with dilute acid', true, { size: 32, color: '#B6F5C9', stroke: C.good });
  const belowC = seatMark(hud, 'no reaction', false, { size: 32, color: '#FFB3BA', stroke: C.bad });
  const badge = G(henry.firstChild); tr(badge, 44, 26);
  E('rect', { x: -50, y: -19, width: 100, height: 38, rx: 8, fill: '#FFD43B', stroke: SC_INK, 'stroke-width': 3 }, badge);
  T(badge, 0, 10, 'STAFF', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });

  /* ================= lab: the fizz race ================= */
  const ACID = ngMix(ngPH(1), '#FFFFFF', 0.25);
  const TX = [520, 680, 840, 1000], TY = 405;
  const signPatch = G(propL);   // the lab's GOGGLES sign would sit behind the race chips: cover it with plain wall
  E('rect', { x: 488, y: 186, width: 264, height: 128, fill: '#CFE0D4' }, signPatch);
  E('path', { d: 'M540,186 L540,314 M600,186 L600,314 M660,186 L660,314 M720,186 L720,314 M488,240 L752,240 M488,300 L752,300', stroke: '#B5CBBD', 'stroke-width': 2 }, signPatch);
  const rack = G(propL);
  E('rect', { x: 452, y: 330, width: 616, height: 22, rx: 6, fill: '#B07A45', stroke: '#6B4416', 'stroke-width': 3 }, rack);
  [458, 1052].forEach(x => E('rect', { x, y: 330, width: 14, height: 210, fill: '#9A6634', stroke: '#6B4416', 'stroke-width': 3 }, rack));
  const tubes = [], fizzes = [], metals = [];
  const RATE = [{ n: 11, r: 7, sp: 1.25 }, { n: 6, r: 6, sp: 0.6 }, { n: 3, r: 5, sp: 0.32 }];
  TX.forEach((x, i) => {
    const tt = testTube(rack, 62, 250, { level: 0.56, liquid: ACID }); tr(tt, x, TY); tubes.push(tt);
    const m = G(rack);
    if (i === 0) tr(ngRibbon(m, 0.24), 0, 0);
    else if (i === 1) E('path', { d: 'M-14,-4 Q-10,-16 2,-14 Q16,-12 14,2 Q10,14 -4,12 Q-18,8 -14,-4 Z', fill: ball('#D5DCE3', '#7E8A97'), stroke: '#5F6B78', 'stroke-width': 3 }, m);
    else if (i === 2) E('path', { d: 'M-16,6 L-8,-6 L-2,8 L6,-4 L14,8 L4,12 L-10,12 Z', fill: '#5F6B78', stroke: '#3A434C', 'stroke-width': 3, 'stroke-linejoin': 'round' }, m);
    else E('path', { d: 'M-16,8 Q-14,-12 0,-8 Q12,-6 8,6 Q2,14 -6,4 M2,-2 Q16,-14 18,8', fill: 'none', stroke: '#C46A35', 'stroke-width': 6, 'stroke-linecap': 'round' }, m);
    metals.push(m);
    if (i < 3) { const b = bubbles(rack, x - 20, 412, 40, 90, { n: RATE[i].n, r: RATE[i].r, speed: RATE[i].sp, seed: 5 + i }); fizzes.push(b); }
  });
  const froth = G(rack);
  for (let i = 0; i < 6; i++) E('circle', { cx: 498 + i * 9, cy: 396 + (i % 2) * 5, r: 6 + (i % 3) * 2, fill: '#FFFFFF', opacity: 0.8 }, froth);
  const SYM = ['Mg', 'Zn', 'Fe', 'Cu'];
  const tubeLab = SYM.map((s, i) => { const c = chip(propL, s, { size: 34, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 3 }); tr(c, TX[i], 608); return c; });
  const sameChip = seatLabel(propL, 'the same dilute acid', { size: 30, color: '#FFB3BA', stroke: ACID });
  const RCH = [['VIGOROUS!', '#FFE45C'], ['STEADY', '#B6F5C9'], ['SLOW', '#9FD8FF']].map(([s, col]) => seatLabel(propL, s, { size: 30, color: col, stroke: col }));
  const insetG = G(hud);
  E('circle', { r: 132, fill: ngMix(ngPH(7), '#141C28', 0.45), stroke: '#FFFFFF', 'stroke-width': 7 }, insetG);
  const maggie = cast(insetG, 'maggie', { s: 0.62 });
  const stamp = seatStamp(hud, 'NO REACTION');
  const belowH = seatLabel(hud, 'copper is BELOW hydrogen', { size: 32, color: '#FFB3BA', stroke: C.bad });

  /* ================= Goldie by the door ================= */
  const doorG = G(propL);
  E('rect', { x: 1018, y: 286, width: 150, height: 276, rx: 6, fill: '#7A4E2A', stroke: '#3E2A18', 'stroke-width': 6 }, doorG);
  E('rect', { x: 1038, y: 308, width: 110, height: 100, rx: 4, fill: 'none', stroke: '#5A3A1E', 'stroke-width': 4 }, doorG);
  E('rect', { x: 1038, y: 430, width: 110, height: 110, rx: 4, fill: 'none', stroke: '#5A3A1E', 'stroke-width': 4 }, doorG);
  E('circle', { cx: 1048, cy: 420, r: 7, fill: '#FFD43B' }, doorG);
  const exitS = chip(doorG, 'EXIT', { size: 28, fill: '#2FA35A', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(exitS, 1093, 248);
  const sideTable = G(frontL);
  E('path', { d: 'M-130,-16 L130,-16 L150,120 L-150,120 Z', fill: '#FBF8F2', stroke: '#CFC4B0', 'stroke-width': 4, 'stroke-linejoin': 'round' }, sideTable);
  E('path', { d: 'M-130,-16 L130,-16 L134,8 L-134,8 Z', fill: '#E8DCC4' }, sideTable);
  const noC = ['dilute acid', 'water', 'gossip'].map(s => seatMark(hud, s, false, { size: 32 }));
  const ltGoldie = scLowerThird(hud, 'AUNTIE GOLDIE', 'Gold. Bottom of the list.');

  /* ================= Goldie's confessional: found as a pure metal ================= */
  const rockG = G(propL);
  E('path', { d: 'M-150,40 Q-170,-30 -110,-70 Q-60,-110 10,-96 Q90,-104 140,-50 Q180,0 150,60 Q110,104 0,100 Q-110,104 -150,40 Z', fill: ball('#9AA3AC', '#4E5862'), stroke: '#3A434C', 'stroke-width': 5 }, rockG);
  E('path', { d: 'M-90,-40 L-60,-30 M40,60 L70,40 M-100,50 L-70,60 M90,-40 L110,-10', stroke: '#5E6B75', 'stroke-width': 5, 'stroke-linecap': 'round' }, rockG);
  E('path', { d: 'M-40,-30 Q-20,-58 20,-44 Q60,-40 54,-4 Q50,30 10,34 Q-34,40 -48,10 Q-56,-12 -40,-30 Z', fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 4 }, rockG);
  E('path', { d: 'M-20,-30 Q-6,-38 12,-32', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, rockG);
  const rockSp = spark(rockG, 16, { seed: 2 }); tr(rockSp, 40, -40);
  const pureC = seatLabel(hud, 'found as a PURE METAL', { size: 34, color: '#FFE27A', stroke: '#B8860B' });
  const classSp = [0, 1, 2].map(i => { const s = spark(hud, 16, { seed: i + 3 }); return s; });

  /* ================= the top table ================= */
  const topT = G(propL);
  E('rect', { x: 250, y: 556, width: 700, height: 150, rx: 8, fill: '#FBF8F2', stroke: '#CFC4B0', 'stroke-width': 4 }, topT);
  E('path', { d: 'M250,580 Q600,640 950,580', fill: 'none', stroke: '#C9A24A', 'stroke-width': 6 }, topT);
  for (let i = 0; i < 7; i++) E('path', { d: `M${300 + i * 100},590 l0,110`, stroke: '#ECE3D2', 'stroke-width': 4 }, topT);
  const topSign = G(propL);
  chip(topSign, 'TOP TABLE', { size: 34, fill: '#C9A24A', color: '#FFFFFF', stroke: '#7A5806', sw: 3 });
  const crown2 = G(topSign); tr(crown2, 0, -54);
  E('path', { d: 'M-30,14 L-30,-10 L-15,4 L0,-20 L15,4 L30,-10 L30,14 Z', fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 4, 'stroke-linejoin': 'round' }, crown2);
  const reserved = G(frontL);
  E('path', { d: 'M-84,-30 L84,-30 L92,30 L-92,30 Z', fill: '#FFFFFF', stroke: '#C9A24A', 'stroke-width': 4, 'stroke-linejoin': 'round' }, reserved);
  T(reserved, 0, 10, 'RESERVED', { size: 26, weight: 800, anchor: 'middle', fill: '#7A5806' });
  const oilC = seatLabel(hud, 'under OIL', { size: 32, color: '#FFE7A0', stroke: '#E8C25A' });
  const ltK = scLowerThird(hud, 'POTASSIUM', 'Top table. Kept under oil.');
  const qMark = T(hud, 0, 0, '?', { size: 96, weight: 800, anchor: 'middle', fill: C.energy });

  /* ================= cold water ================= */
  const trough = seatTrough(propL);
  const waterCard = G(hud);
  E('rect', { x: 610, y: 118, width: 540, height: 132, rx: 18, fill: 'rgba(10,27,39,0.9)', stroke: '#9FD8FF', 'stroke-width': 3 }, waterCard);
  T(waterCard, 880, 168, '**potassium** & **sodium**', { size: 34, weight: 600, anchor: 'middle', fill: C.ink, boldFill: C.energy });
  T(waterCard, 880, 222, 'react **FAST** with **COLD** water', { size: 32, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#9FD8FF' });
  const coldC = seatLabel(hud, 'cold water', { size: 30, color: '#9FD8FF', stroke: '#9FD8FF' });

  /* ================= word equations ================= */
  const eqCard = G(hud);
  E('rect', { x: 60, y: 140, width: 1080, height: 470, rx: 24, fill: 'rgba(10,27,39,0.92)', stroke: C.line, 'stroke-width': 3 }, eqCard);
  const EQC = { metal: '#C9D2DB', sodium: '#C9D2DB', water: '#7FD3F5', 'metal hydroxide': '#C7B3FF', 'sodium hydroxide': '#C7B3FF', hydrogen: '#FFFFFF' };
  const eq1 = ngEq(eqCard, ['metal', '+', 'water', '→', 'metal hydroxide', '+', 'hydrogen'], { size: 42, colors: EQC }); tr(eq1, 600, 262);
  const eg = seatLabel(eqCard, 'for example', { size: 28, color: C.muted }); tr(eg, 600, 375);
  const eq2 = ngEq(eqCard, ['sodium', '+', 'water', '→', 'sodium hydroxide', '+', 'hydrogen'], { size: 42, colors: EQC }); tr(eq2, 600, 480);
  const eqBub = [eq1, eq2].map(eq => {
    const last = eq.terms[eq.terms.length - 1], x = +last.getAttribute('x') + textWidth('hydrogen', 42, FD, 800) / 2 - 6, y = +last.getAttribute('y') - 46;
    const b = G(eq); [[0, 0, 10], [16, -18, 7], [-10, -26, 5]].forEach(([dx, dy, r]) => E('circle', { cx: x + dx, cy: y + dy, r, fill: 'rgba(255,255,255,0.2)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, b));
    return b;
  });

  /* ================= Natalie: that's me ================= */
  const natChip = seatLabel(hud, 'sodium hydroxide', { size: 36, color: '#C7B3FF', stroke: '#9A72F2' });
  const meChip = seatLabel(hud, "that's ME!", { size: 32, color: C.energy, stroke: C.energy });
  const dropper = ngDropper(propL, 0.5);
  const uiChip = seatLabel(hud, 'universal indicator', { size: 28, color: '#7CE38F', stroke: '#7CE38F' });
  const alkChip = seatLabel(hud, 'ALKALINE solution', { size: 36, fill: ngPH(12.5), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });

  /* ---------- cut list ---------- */
  const CUTS = [['board', -9], ['lab', at('race') - 0.08], ['back', at('goldie') - 0.08], ['conf', at('thgoldie') - 0.08], ['top', at('topk') - 0.08],
    ['labjar', at('jar') - 0.08], ['venk', at('water') - 0.08], ['eq', at('eqwater') - 0.08], ['nat', at('me') - 0.08]];
  const shotAt = t => { let s = CUTS[0][0]; for (const [k, t0] of CUTS) if (t >= t0) s = k; return s; };

  // word cues
  const NAMES = ['potassium', 'sodium', 'calcium', 'magnesium', 'aluminium', 'zinc', 'iron', 'hydrogen', 'copper', 'silver', 'gold'];
  const nameT = []; { let from = 'from the top'; NAMES.forEach(n => { nameT.push(seatW('order', n, from) - 0.22); from = n; }); }
  const wordT = []; { let from = 'with:'; WORDS.forEach(w => { wordT.push(seatW('zebra', w, from) - 0.1); from = w; }); }
  const tMost = seatW('tables', 'most') - 0.15, tLeast = seatW('tables', 'least') - 0.15;
  const tAbove = seatW('line', 'above') - 0.2, tBelow = seatW('line', 'below') - 0.2;
  const tIron = seatW('zn', 'iron') - 0.15, tCopper = seatW('zn', 'copper') - 0.4;
  const tAcid = seatW('goldie', 'dilute') - 0.15, tWater = seatW('goldie', 'water') - 0.15, tGossip = seatW('goldie', 'gossip') - 0.15;
  const tWaterW = seatW('water', 'cold water') - 0.1, tExcited = seatW('water', 'he gets');
  const tSodium = seatW('eqwater', 'sodium') - 0.15, tAlk = seatW('me', 'alkaline') - 0.2;

  return t => {
    const sh = shotAt(t);
    const isVen = sh === 'board' || sh === 'back' || sh === 'top' || sh === 'venk' || sh === 'eq' || sh === 'nat';
    const isLab = sh === 'lab' || sh === 'labjar';
    op(venue, isVen ? 1 : 0); if (isVen) venue.set(7, t * AMP);
    op(venDim, sh === 'eq' ? 1 : 0);
    op(labG, isLab ? 1 : 0); if (isLab) lab.upd(t * AMP);
    op(bench, isLab ? 1 : 0);
    conf.set(sh === 'conf' ? 1 : 0, t);
    op(venue.chairs, sh === 'board' || sh === 'venk' || sh === 'nat' || sh === 'eq' ? 1 : 0);
    // everything off; each shot turns on what it needs
    ALL.forEach(c => op(c, 0));
    [boardG, sideG, mnemo, zebra, ropeG, rack, signPatch, doorG, sideTable, rockG, topT, topSign, reserved, trough, dropper, ...tubeLab].forEach(el => op(el, 0));
    [reactChip, aboveC, belowC, insetG, stamp, belowH, pureC, oilC, qMark, waterCard, coldC, eqCard, natChip, meChip, uiChip, alkChip, ...noC, ...classSp, ...RCH, sameChip].forEach(el => op(el, 0));
    ltGoldie.set(0); ltK.set(0);
    op(badge, 0);
    let cam = [1, 600, 375];
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); if (st) c.set(Object.assign({ t }, st)); };

    /* ===================== the seating board ===================== */
    if (sh === 'board') {
      op(boardG, 1);
      const zeb = t >= at('zebra') - 0.1, ln = t >= at('line') - 0.1;
      // rows: all shown until 'order' starts, then dim and light up one by one
      const inOrder = t >= at('order') - 0.1;
      board.rows.forEach((r, i) => {
        const ti = nameT[i < 7 ? i : i + 1];
        op(r, inOrder ? 0.32 + 0.68 * P(t, ti, 0.25, linear) : 1);
        const g = zeb ? clamp(1 - 0.75 * P(t, wordT[i] + 0.25, 0.5, linear)) * P(t, wordT[i], 0.2, linear) : 0;
        op(letterGlow[i], g);
      });
      op(board.hline, inOrder ? P(t, nameT[7], 0.3, linear) : 0);
      if (inOrder && !zeb) {
        let y = ROWY[0];
        const stops = NAMES.map((n, k) => (k < 7 ? ROWY[k] : k === 7 ? HY : ROWY[k - 1]));
        for (let k = 0; k < NAMES.length; k++) if (t >= nameT[k]) y = k === 0 ? stops[0] : lerp(stops[k - 1], stops[k], P(t, nameT[k], 0.2, easeOut));
        op(hlRow, P(t, nameT[0], 0.2, linear) * (1 - P(t, end('order') + 0.2, 0.3, linear)));
        attr(hlRow, 'y', y - 27);
      } else op(hlRow, 0);
      if (!zeb) {
        // venue reception: the board on its easel, Indi with her clipboard
        tr(boardG, 800, 405, 0.95);
        const k = inOrder ? 1 + 0.06 * P(t, at('order'), end('order') - at('order') + 0.4, linear) : 1 + 0.02 * P(t, at('plan'), 8, linear);
        cam = [k, 640, 395];
        const lk = t < at('tables') ? 0.8 : 0.9;
        show(indi, 215, 480, 1.0, { talk: talk(t, 'indi'), ph: 7, mood: t < at('tables') ? 'neutral' : inOrder ? 'neutral' : 'deadpan', look: t >= at('tables') && t < at('order') ? (t < mid('tables', 0.4) ? 0 : 0.7) : lk });
        const rp = t < at('tables') ? P(t, seatW('plan', 'reactivity') - 0.3, 0.45, pop) : 0;
        op(reactChip, clamp(rp * 2.5)); tr(reactChip, 290, 190, Math.max(0.01, 0.7 + 0.3 * rp));
        const sOn = t >= tMost - 0.1 && t < at('zebra') - 0.1;
        op(sideG, sOn ? 1 : 0);
        if (sOn) {
          sideArrow.set(P(t, tMost, 0.5, easeOut));
          const mp = P(t, tMost, 0.45, pop); op(mostG, clamp(mp * 2.5));
          const lp = P(t, tLeast, 0.45, pop); op(leastG, clamp(lp * 2.5));
          tr(crown, 420, 152 - 6 * Math.abs(Math.sin(t * 3)) * AMP);
        }
      } else if (!ln) {
        // the mnemonic
        tr(boardG, 330, 405, 0.95);
        op(mnemo, 1);
        wordEls.forEach((w, i) => op(w, P(t, wordT[i], 0.25, linear)));
        const zp = P(t, end('zebra') + 0.05, 0.45, pop);
        op(zebra, clamp(zp * 2.5)); tr(zebra, 1030, 280, Math.max(0.01, 0.9 * (0.6 + 0.4 * zp)), 4 * Math.sin(t * 5) * AMP * zp);
        const after = t > end('zebra') + 0.05;
        show(indi, 1070, 560, 0.85, { talk: talk(t, 'indi'), ph: 7, mood: after ? 'deadpan' : 'neutral', look: after ? -0.4 : -0.9 });
        cam = [1 + 0.05 * P(t, end('zebra'), 0.9, linear), 900, 420];
      } else {
        // Henry, doorman of the hydrogen line
        tr(boardG, 330, 405, 0.95);
        op(ropeG, 1);
        const job = t >= at('job') - 0.1;
        const pp = job ? P(t, mid('job', 0.45), 0.35, pop) : 0;
        show(henry, 800, 436, 1.05 * (1 + 0.1 * pp), { talk: talk(t, 'henry'), mood: job ? 'happy' : t > tBelow ? 'smug' : 'neutral', look: job ? 0 : t > tAbove && t < end('line') ? -0.6 : 0 });
        if (!job) {
          const ap = P(t, tAbove, 0.45, pop); op(aboveC, clamp(ap * 2.5)); tr(aboveC, 870, 270, Math.max(0.01, 0.7 + 0.3 * ap));
          const bp = P(t, tBelow, 0.45, pop); op(belowC, clamp(bp * 2.5)); tr(belowC, 870, 650, Math.max(0.01, 0.7 + 0.3 * bp));
          cam = [1, 600, 375];
        } else {
          op(aboveC, 1 - P(t, at('job') - 0.1, 0.2, linear)); op(belowC, 1 - P(t, at('job') - 0.1, 0.2, linear));
          tr(aboveC, 870, 270); tr(belowC, 870, 650);
          const bdp = P(t, mid('job', 0.2), 0.4, pop); op(badge, clamp(bdp * 2.5)); tr(badge, 44, 26, Math.max(0.01, 0.6 + 0.4 * bdp), -8);
          const k = 1 + 0.65 * P(t, at('job') - 0.1, 0.6, ease) + 0.1 * P(t, end('job'), 0.9, linear);
          cam = [k, 820, 455];
        }
      }
    }

    /* ===================== lab: the fizz race ===================== */
    if (sh === 'lab') {
      op(rack, 1); op(signPatch, 1);
      show(kavya, 240, 440, 1.3, { talk: 0, mood: t < at('cu') ? 'neutral' : 'deadpan', look: 0.85 });
      const drop = i => P(t, mid('race', 0.5) + i * 0.18, 0.4, easeIn);
      metals.forEach((m, i) => {
        const p = drop(i), wob = i === 0 ? Math.sin(t * 14) * 3 * AMP * P(t, mid('race', 0.6), 0.3, linear) : 0;
        op(m, P(t, mid('race', 0.45), 0.1, linear)); tr(m, TX[i] + wob, lerp(250, 497, p), 1, i === 0 ? 10 * wob : 0);
      });
      fizzes.forEach((b, i) => b.upd(t * (i === 0 ? 1.3 : 1) * (S.reduce ? 0.6 : 1), P(t, mid('race', 0.5) + i * 0.18 + 0.4, 0.5, linear)));
      op(froth, P(t, mid('race', 0.8), 0.5, linear)); tr(froth, 0, Math.sin(t * 9) * 2 * AMP);
      tubes.forEach(tt => tt.set(0.56, ACID));
      tubeLab.forEach(c => op(c, 1));
      op(sameChip, t < at('mg') - 0.1 ? P(t, mid('race', 0.2), 0.3, linear) : 0); tr(sameChip, 940, 172);
      if (t < at('mg') - 0.1) cam = [1 + 0.03 * P(t, at('race'), 4, linear), 600, 375];
      else if (t < at('zn') - 0.1) {
        cam = [1.55 + 0.05 * P(t, at('mg'), 2.5, linear), 560, 420];
        const ip = P(t, at('mg') - 0.05, 0.45, pop);
        op(insetG, clamp(ip * 2.5)); tr(insetG, 1020, 520, Math.max(0.01, 0.6 + 0.4 * ip));
        maggie.set({ t, talk: talk(t, 'maggie'), mood: 'happy', fizz: 1, look: -0.6 });
      } else {
        // pan Zn -> Fe -> Cu; hold on the still copper tube
        const x = t < tIron ? TX[1] : t < tCopper ? lerp(TX[1], TX[2], P(t, tIron, 0.4, ease)) : lerp(TX[2], TX[3], P(t, tCopper, 0.5, ease));
        const creep = t >= tCopper ? 0.18 * P(t, tCopper + 0.5, end('zn') + 1 - tCopper, linear) : 0;
        cam = [1.55 + creep, x, 420];
        if (t >= at('cu') - 0.1) cam = [1.73 + 0.04 * P(t, at('cu'), 4, linear), TX[3], 420];
      }
      // per-tube chips above the tubes (in the world, so they ride the camera)
      const ct = [at('mg') + 0.2, at('zn') + 0.15, tIron + 0.3];
      RCH.forEach((c, i) => { if (t >= at('mg') - 0.1) { const p = P(t, ct[i], 0.4, pop), nx = i < 2 ? 1 - P(t, ct[i + 1] - 0.1, 0.2, linear) : 1; op(c, clamp(p * 2.5) * nx * (1 - P(t, at('cu') - 0.1, 0.2, linear))); tr(c, TX[i], 262, Math.max(0.01, 0.75 + 0.25 * p)); } });
      if (t >= at('cu') - 0.1) {
        seatCam(cam[0], cam[1], cam[2]);
        const [sx, sy] = seatScr(TX[3], 380);
        const sp = P(t, mid('cu', 0.06), 0.3, easeOut); stamp.set(sp, Math.min(sx, 950), sy, -8);
        const bp = P(t, seatW('cu', 'below') - 0.1, 0.45, pop); op(belowH, clamp(bp * 2.5)); tr(belowH, 760, 150, Math.max(0.01, 0.7 + 0.3 * bp));
      }
    }

    /* ===================== Goldie by the door ===================== */
    if (sh === 'back') {
      op(doorG, 1); op(sideTable, 1); tr(sideTable, 840, 586);
      const gossip = t > tGossip + 0.2 && t < end('goldie') + 0.3;
      show(goldie, 840, 444, 1.15, { talk: talk(t, 'goldie'), mood: gossip ? 'deadpan' : 'smug', look: gossip ? -0.7 : 0 });
      ltGoldie.set(win(t, at('goldie') + 0.1, at('goldie') + 3.3, 0.3));
      [tAcid, tWater, tGossip].forEach((t0, i) => { const p = P(t, t0, 0.45, pop); op(noC[i], clamp(p * 2.5)); tr(noC[i], 300, 220 + i * 92, Math.max(0.01, 0.7 + 0.3 * p)); });
      cam = [1 + 0.05 * P(t, at('goldie'), 6.5, linear), 760, 420];
    }

    /* ===================== Goldie's confessional ===================== */
    if (sh === 'conf') {
      const cls = seatW('thgoldie', 'class') - 0.1;
      show(goldie, 400, 420, 1.5, { talk: talk(t, 'goldie'), mood: t > cls ? 'smug' : t < mid('thgoldie', 0.45) ? 'smug' : 'neutral', look: t > mid('thgoldie', 0.12) && t < mid('thgoldie', 0.45) ? 0.6 : 0 });
      const rp = P(t, mid('thgoldie', 0.08), 0.45, pop); op(rockG, clamp(rp * 2.5)); tr(rockG, 880, 300, Math.max(0.01, 0.75 + 0.25 * rp));
      rockSp.upd(t);
      const pp = P(t, seatW('thgoldie', 'pure') - 0.2, 0.45, pop); op(pureC, clamp(pp * 2.5)); tr(pureC, 880, 470, Math.max(0.01, 0.7 + 0.3 * pp));
      // "It's called class": sparkles, then a slow push-in through the pause
      const sp = P(t, cls, 0.4, pop);
      [[250, 190], [560, 230], [300, 600]].forEach(([x, y], i) => { op(classSp[i], clamp(sp * 2)); tr(classSp[i], x, y, Math.max(0.01, sp)); classSp[i].upd(t); });
      const push = P(t, end('thgoldie') - 0.3, 1.1, ease);
      cam = [1 + 0.18 * push, lerp(600, 420, push), lerp(375, 380, push)];
    }

    /* ===================== the top table ===================== */
    if (sh === 'top') {
      op(topT, 1); op(topSign, 1); tr(topSign, 600, 196);
      show(jar, 600, 446, 0.85);
      pot.set({ t: 0.5, still: true, mood: 'deadpan' });   // he never blinks
      op(reserved, 1); tr(reserved, 790, 600);
      const kp = seatW('topk', 'potassium') - 0.1;
      ltK.set(win(t, kp, kp + 3.2, 0.3));
      const opn = P(t, seatW('topk', 'under oil') - 0.2, 0.45, pop);
      op(oilC, clamp(opn * 2.5) * (1 - P(t, end('topk') + 0.1, 0.25, linear))); tr(oilC, 870, 400, Math.max(0.01, 0.7 + 0.3 * opn));
      const push = P(t, at('topk'), end('topk') + 0.9 - at('topk'), linear);
      cam = [1 + 0.25 * ease(push), 600, lerp(375, 440, push)];
    }

    /* ===================== lab: Kavya and the jar ===================== */
    if (sh === 'labjar') {
      show(kavya, 360, 432, 1.45, { talk: talk(t, 'kavya'), mood: t > end('jar') ? 'deadpan' : 'neutral', look: 0.9 }, -6 * P(t, at('jar'), 0.4, ease));
      show(jar, 880, 448, 0.7);
      pot.set({ t: 0.5, still: true, mood: 'deadpan' });
      const qp = P(t, mid('jar', 0.3), 0.45, pop); op(qMark, clamp(qp * 2.5)); tr(qMark, 480, 172, Math.max(0.01, 0.6 + 0.4 * qp), 10);
      cam = [1 + 0.04 * P(t, at('jar'), 2, linear), 600, 380];
    }

    /* ===================== cold water ===================== */
    if (sh === 'venk') {
      op(sideTable, 1); tr(sideTable, 470, 612, 0.7);
      const ex = t > tExcited - 0.1;
      show(indi, 200, 470, 1.05, { talk: talk(t, 'indi'), ph: 7, mood: ex ? 'deadpan' : 'neutral', look: ex ? 0.5 : 0.8 });
      const wide = t >= tWaterW && t < end('water') + 0.6;
      const jit = wide && ex ? Math.sin(t * 40) * 2.5 * AMP : 0;
      show(jar, 470 + jit, 522, 0.62);
      pot.set({ t: 0.5, still: true, mood: wide ? (t < tWaterW + 0.6 ? 'shock' : 'neutral') : 'deadpan', look: wide ? 0.4 : 0 });
      const cp = P(t, at('water') + 0.05, 0.45, pop), xo = 1 - P(t, tExcited - 0.1, 0.25, linear); op(waterCard, clamp(cp * 2.5) * xo);
      op(trough, 1); tr(trough, 880, 440); trough.set('#7FD3F5'); trough.upd(t, P(t, tWaterW, 0.3, linear));
      op(coldC, P(t, tWaterW, 0.3, linear) * xo); tr(coldC, 880, 580);
      // "He gets... excited.": snap in on the jar
      const zp = P(t, tExcited - 0.1, 0.35, easeOut);
      cam = [1 + 1.1 * zp + 0.08 * P(t, tExcited + 0.3, 2, linear), lerp(600, 470, zp), lerp(375, 470, zp)];
    }

    /* ===================== word equations ===================== */
    if (sh === 'eq') {
      op(eqCard, 1);
      eq1.set(P(t, at('eqwater'), tSodium - at('eqwater') - 0.3, linear));
      op(eg, P(t, tSodium - 0.3, 0.3, linear));
      eq2.set(P(t, tSodium, end('eqwater') - tSodium - 0.3, linear));
      const lastOn = (t0, t1) => clamp(P(t, t0, t1 - t0, linear) * 7 - 6);
      [lastOn(at('eqwater'), tSodium - 0.3), lastOn(tSodium, end('eqwater') - 0.3)].forEach((v, i) => { op(eqBub[i], v); tr(eqBub[i], 0, -6 * wave(t, 1.4, i * 0.3) * AMP); });
      // Natalie peeks in on "sodium hydroxide"
      const np = P(t, lerp(tSodium, end('eqwater'), 0.45), 0.5, easeOut);
      if (np > 0) show(natalie, 1070, 760 - 110 * np, 0.7, { mood: 'happy', look: -0.8 });
    }

    /* ===================== Natalie: that's me! ===================== */
    if (sh === 'nat') {
      const after = t > end('me') + 0.1;
      show(natalie, 330, 440, 1.3, { talk: talk(t, 'natalie'), mood: after ? 'smug' : 'happy', look: t > tAlk ? 0.7 : 0 });
      const np = P(t, at('me'), 0.45, pop); op(natChip, clamp(np * 2.5)); tr(natChip, 330, 196, Math.max(0.01, 0.7 + 0.3 * np));
      const mp = P(t, seatW('me', "that's me") - 0.1, 0.45, pop); op(meChip, clamp(mp * 2.5)); tr(meChip, 330, 676, Math.max(0.01, 0.7 + 0.3 * mp), -4);
      op(trough, 1); tr(trough, 860, 440);
      const dropT = tAlk - 0.9, dp = P(t, dropT, 0.5, easeIn);
      trough.set(ngMix('#7FD3F5', ngPH(12.5), P(t, dropT + 0.5, 0.6, linear))); trough.upd(t, 0);
      op(dropper, 1 - P(t, end('me') + 0.2, 0.3, linear)); tr(dropper, 860, 300);
      dropper.set(P(t, dropT - 0.3, 0.3, linear) * (1 - P(t, dropT + 0.2, 0.3, linear)), ngPH(7));
      op(dropper.drop, dp < 1 ? 1 : 0); tr(dropper.drop, 0, dp * 232);
      op(uiChip, P(t, dropT - 0.4, 0.3, linear) * (1 - P(t, end('me') + 0.2, 0.3, linear))); tr(uiChip, 1010, 220);
      const ap = P(t, tAlk + 0.1, 0.45, pop); op(alkChip, clamp(ap * 2.5)); tr(alkChip, 860, 600, Math.max(0.01, 0.7 + 0.3 * ap));
      cam = [1 + 0.03 * P(t, at('me'), 5, linear), 600, 375];
    }

    seatCam(cam[0], cam[1], cam[2]);
  };
});

/* Scene 7: The wedding party saves you some marks (8 exam traps) + the stinger.
   Shots (hard sitcom cuts): a three-tier wedding cake, "8 EXAM TRAPS" -> eight quick confessionals, one trap card each
   (Maggie, Henry, Hal, Natalie, Indi, Hal, Goldie, Indi) -> "NEUTRAL GROUND will return" -> stinger: Kavya points at
   the jar on the lab shelf -> Indi beside the jar, deadpan -> close-up: Potassium's eyes open fully, "...Is that...
   water?" -> Henry helpfully offers a glass of water -> "NO, HENRY, DON'T!" -> hard cut to black, a lilac flash,
   FWOOMP -> final frame: the logo in a lilac smoke ring, everyone singed and blinking (except Goldie, who reacts to
   nothing), Potassium smug in his jar. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- helpers (prefixed traps) ---------- */
  function trapsPop(el, t, t0, x, y, s, r) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; }
  // merge sibling rects (no rx), circles and paths with identical paint into one path (same picture, fewer elements)
  function trapsSlim(container) {
    const KEYS = ['fill', 'stroke', 'stroke-width', 'opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray'];
    const groups = new Map();
    [...container.children].forEach(el => {
      if (el.tagName === 'g') { trapsSlim(el); return; }
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
  function trapsPopAt(el, t, t0, cx, cy) { const p = P(t, t0, 0.45, pop), k = Math.max(0.01, 0.6 + 0.4 * p); op(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); }
  const CX = 880;
  // a trap card on the right of the confessional
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 600, 130, 560, 486, { fill: 'rgba(14,26,36,0.94)', stroke: C.line });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 178);
    return g;
  }
  const tx = (parent, x, y, str, o) => T(parent, x, y, str, Object.assign({ weight: 600, anchor: 'middle', fill: C.ink }, o));

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), backL = G(world), benchL = G(world), propL = G(world), castL = G(world), frontL = G(world);
  const hud = G(root);
  function trapsCam(k, cx, cy) {
    cx = clamp(cx, 600 / k, 1200 - 600 / k); cy = clamp(cy, 375 / k, 750 - 375 / k);
    world.setAttribute('transform', `translate(600 375) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`);
  }

  /* ---------- sets ---------- */
  const introBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1424', '#0A1B27', true) }, introBg);
  E('ellipse', { cx: 600, cy: 470, rx: 440, ry: 260, fill: glow('#FFD0E2'), opacity: 0.35 }, introBg);
  const KINDS = ['maggie', 'henry', 'hal', 'natalie', 'indi', 'goldie'];
  const confs = {}; KINDS.forEach(k => { confs[k] = ngConf(bgL, k); });
  const greenBg = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0E2A1A', '#1F5A36', true) }, greenBg);
  let rays = '';
  for (let i = 0; i < 16; i++) { const a0 = i / 16 * TAU, a1 = a0 + TAU / 40; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#7CE38F', opacity: 0.08 }, greenBg);
  const venue = ngVenue(bgL);
  [...venue.children].filter(c => c.tagName === 'g' && c.style.opacity === '0.35').slice(5).forEach(c => c.remove());
  trapsSlim(venue);
  const labG = G(bgL), lab = ngLab(labG); trapsSlim(lab);
  const bench = ngBench(benchL, 540);
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, hud);
  const lilac = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#C9A0FF' }, hud);

  /* ---------- the cast: one of each, moved between shots ---------- */
  const kavya = cast(backL, 'kavya', { goggles: 'up' });
  const ch = {};
  ['indi', 'hal', 'natalie', 'henry', 'maggie', 'goldie'].forEach(k => { ch[k] = cast(castL, k); });
  const jar = ngJar(castL, 1), pot = cast(jar.inner, 'potassium'); tr(pot, 0, 0, 0.8);
  const ALL = [kavya, jar, ...Object.values(ch)];

  /* ===== intro: the cake ===== */
  const cake = G(propL);
  [[600, 575, 400, 110, '#FFF4F8'], [600, 470, 300, 100, '#FFFFFF'], [600, 375, 200, 90, '#FFF4F8']].forEach(([x, y, w, h, col]) => {
    E('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: 14, fill: col, stroke: '#E8B4C8', 'stroke-width': 4 }, cake);
    let d = `M${x - w / 2},${y - h / 2 + 12}`;
    for (let i = 0; i < 8; i++) { const x0 = x - w / 2 + i * w / 8; d += ` Q${(x0 + w / 16).toFixed(1)},${(y - h / 2 + 34 + (i % 2) * 10).toFixed(1)} ${(x0 + w / 8).toFixed(1)},${y - h / 2 + 12}`; }
    E('path', { d, fill: 'none', stroke: '#FF8FC0', 'stroke-width': 6, 'stroke-linecap': 'round' }, cake);
  });
  E('ellipse', { cx: 600, cy: 640, rx: 250, ry: 22, fill: '#C9D3DC', stroke: '#8E9BA8', 'stroke-width': 3 }, cake);
  const topper = G(cake);
  E('path', { d: 'M520,330 L520,270 M680,330 L680,270', stroke: '#C9A24A', 'stroke-width': 6 }, topper);
  E('rect', { x: 390, y: 196, width: 420, height: 84, rx: 16, fill: '#C2283A', stroke: '#FFFFFF', 'stroke-width': 4 }, topper);
  T(topper, 600, 252, '8 EXAM TRAPS', { size: 46, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  const introSub = T(hud, 600, 150, 'the wedding party saves you some marks', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });

  /* ===== the eight trap cards ===== */
  const fx = G(hud), cards = [];
  // 1 Maggie: metal -> hydrogen; only carbonates -> CO2
  { const c = trapsCard(fx, 1); cards.push(c);
    c.a = tx(c, CX, 270, 'acid + metal gives', { size: 34 });
    c.b = G(c); { const h = chip(c.b, 'HYDROGEN', { size: 46, fill: '#FFFFFF', color: SC_INK, stroke: '#9FD8FF', sw: 4 }); [[h.w / 2 + 26, -14, 12], [h.w / 2 + 44, 16, 8], [-h.w / 2 - 28, 4, 10]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: 'rgba(255,255,255,0.2)', stroke: '#FFFFFF', 'stroke-width': 3 }, c.b)); }
    c.c = tx(c, CX, 448, 'only **carbonates** give', { size: 32, boldFill: C.energy });
    c.d = ngFormula(c, CX, 512, 'carbon dioxide, CO_2', { size: 38, fill: C.co2 }); }
  // 2 Henry: squeaky pop = hydrogen; milky limewater = carbon dioxide
  { const c = trapsCard(fx, 2); cards.push(c);
    c.a = G(c); { const p = ngPop(c.a, 'POP!'); p.set(1); tr(p, 700, 300, 0.42); tx(c.a, 920, 292, '**squeaky pop**', { size: 34, boldFill: C.energy }); tx(c.a, 920, 334, '= hydrogen', { size: 32, fill: '#FFFFFF' }); }
    c.b = G(c); { const tt = testTube(c.b, 40, 120, { level: 0.6, liquid: '#F6F6EE' }); tr(tt, 700, 470); tx(c.b, 920, 462, '**milky limewater**', { size: 34, boldFill: '#FFFFFF' }); tx(c.b, 920, 504, '= carbon dioxide', { size: 32, fill: C.co2 }); } }
  // 3 Hal: concentration is not strength
  { const c = trapsCard(fx, 3); cards.push(c);
    c.a = chip(c, 'CONCENTRATION', { size: 32, fill: '#3A1014', color: '#FFB3BA', stroke: '#E8424F' }); tr(c.a, CX, 262);
    c.ne = tx(c, CX, 336, '≠', { size: 60, weight: 800, fill: C.energy });
    c.b = chip(c, 'STRENGTH', { size: 32, fill: '#3A1014', color: '#FFB3BA', stroke: '#E8424F' }); tr(c.b, CX, 386);
    c.c = tx(c, CX, 480, '**dilute strong** can be **SAFER**', { size: 32, boldFill: '#B6F5C9' });
    c.d = tx(c, CX, 528, 'than **concentrated weak**', { size: 32, boldFill: '#FFB3BA' }); }
  // 4 Natalie: not all bases are alkalis
  { const c = trapsCard(fx, 4); cards.push(c);
    c.a = tx(c, CX, 262, '**Not all** bases are alkalis', { size: 34, boldFill: C.bad });
    c.v = G(c);
    E('circle', { cx: 870, cy: 418, r: 118, fill: 'rgba(124,227,143,0.12)', stroke: '#7CE38F', 'stroke-width': 4 }, c.v);
    tx(c.v, 870, 336, 'BASES', { size: 28, weight: 800, fill: '#7CE38F' });
    E('circle', { cx: 912, cy: 440, r: 64, fill: 'rgba(185,160,255,0.22)', stroke: '#B9A0FF', 'stroke-width': 4 }, c.v);
    tx(c.v, 912, 432, 'ALKALIS', { size: 26, weight: 800, fill: '#C7B3FF' });
    tx(c.v, 912, 462, 'soluble', { size: 26, fill: '#C7B3FF' });
    c.cuo = G(c.v); tr(c.cuo, 800, 470);
    E('path', { d: 'M-36,18 Q-30,-20 0,-24 Q30,-20 36,18 Z', fill: '#1E1E24', stroke: '#000000', 'stroke-width': 2 }, c.cuo);
    E('path', { d: 'M-12,-6 l0,4 M12,-6 l0,4', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round' }, c.cuo);
    E('path', { d: 'M-8,10 Q0,4 8,10', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, c.cuo);
    c.arm = E('path', { d: 'M28,0 L48,-22', stroke: '#1E1E24', 'stroke-width': 7, 'stroke-linecap': 'round' }, c.cuo);
    c.b = tx(c, CX, 584, 'only the **soluble** ones', { size: 30, boldFill: '#C7B3FF' }); }
  // 5 Indi: litmus; higher pH = more alkaline
  { const c = trapsCard(fx, 5); cards.push(c);
    c.a = tx(c, CX, 254, '**Litmus**', { size: 34, boldFill: C.energy });
    c.r = G(c); E('rect', { x: 696, y: 280, width: 44, height: 120, rx: 6, fill: '#E8424F', stroke: '#FFFFFF', 'stroke-width': 3 }, c.r); tx(c.r, 718, 434, '**RED**', { size: 28, boldFill: '#FF8A7A' }); tx(c.r, 718, 464, 'in acid', { size: 26, fill: C.muted });
    c.bl = G(c); E('rect', { x: 920, y: 280, width: 44, height: 120, rx: 6, fill: '#3F6FDB', stroke: '#FFFFFF', 'stroke-width': 3 }, c.bl); tx(c.bl, 942, 434, '**BLUE**', { size: 28, boldFill: '#9FC4FF' }); tx(c.bl, 942, 464, 'in alkali', { size: 26, fill: C.muted });
    c.s = G(c);
    for (let i = 0; i <= 14; i++) E('rect', { x: 685 + i * 26, y: 504, width: 24, height: 34, rx: 4, fill: ngPH(i) }, c.s);
    c.ar = arrow(c.s, 700, 494, 1060, 494, { color: '#FFFFFF', width: 5 });
    tx(c.s, CX, 584, '**higher** pH = more **ALKALINE**', { size: 30, boldFill: '#C7B3FF' }); }
  // 6 Hal: neutralisation always makes water
  { const c = trapsCard(fx, 6); cards.push(c);
    c.a = tx(c, CX, 262, 'Neutralisation **ALWAYS** makes', { size: 32, boldFill: C.energy });
    c.eq = ngEq(c, ['acid', '+', 'base', '→', 'salt', '+', 'WATER'], { size: 40, colors: { acid: '#FF8A7A', base: '#C7B3FF', salt: '#FFE6B0', WATER: '#7FD3F5' } }); tr(c.eq, CX, 360);
    c.w = G(c); const m = molH2O(c.w, 30); tr(m, CX, 466);
    c.b = tx(c, CX, 560, '(as well as the salt)', { size: 30, fill: C.muted }); }
  // 7 Goldie: copper, silver, gold don't fizz
  { const c = trapsCard(fx, 7); cards.push(c);
    c.a = tx(c, CX, 258, '**No fizz** with dilute acid', { size: 34, boldFill: C.energy });
    c.h = G(c); E('path', { d: 'M640,318 L1120,318', stroke: '#E8424F', 'stroke-width': 5, 'stroke-dasharray': '14 8' }, c.h); tr(chip(c.h, 'HYDROGEN', { size: 26, fill: '#FFFFFF', stroke: '#E8424F', sw: 4, color: '#C2283A' }), CX, 318);
    c.rows = [['Copper', 'Cu', '#F0A06A'], ['Silver', 'Ag', '#E4EAF0'], ['Gold', 'Au', '#FFE27A']].map(([n, s, col], i) => {
      const g = G(c), y = 380 + i * 58;
      tx(g, 690, y + 11, `**${n}**`, { size: 32, anchor: 'start', boldFill: col }); tx(g, 900, y + 11, s, { size: 32, weight: 800, fill: C.muted });
      tr(cross(g, 13), 1070, y); return g; });
    c.b = tx(c, CX, 584, "they're **below hydrogen**", { size: 30, boldFill: '#FFB3BA' }); }
  // 8 Indi: sulfates not sulfides
  { const c = trapsCard(fx, 8); cards.push(c);
    c.a = tx(c, CX, 270, '**Sulfuric** acid makes', { size: 34, boldFill: C.energy });
    c.ok = G(c); { const k = chip(c.ok, 'sulfATES', { size: 50, fill: '#163A24', color: '#7CE38F', stroke: C.good, sw: 4 }); tr(tick(c.ok, 20), k.w / 2 + 40, 0); }
    c.no = G(c); { const k = chip(c.no, 'sulfIDES', { size: 40, fill: '#3A1014', color: '#FFB3BA', stroke: C.bad, sw: 3 }); c.no.st = strike(c.no, -k.w / 2 - 6, 0, k.w / 2 + 6, C.bad); tr(cross(c.no, 15), k.w / 2 + 38, 0); }
    c.b = tx(c, CX, 572, 'different wedding', { size: 30, fill: C.muted }); }

  /* ===== logo (return + final frame) ===== */
  const logoG = G(hud); ngLogo(logoG);
  const willT = T(hud, 600, 420, 'will return', { size: 46, weight: 700, anchor: 'middle', fill: '#FFFFFF' });
  const ring = E('ellipse', { cx: 0, cy: 0, rx: 420, ry: 150, fill: 'none', stroke: '#C9A0FF', 'stroke-width': 26, opacity: 0.45 }, hud);
  const ring2 = E('ellipse', { cx: 0, cy: 0, rx: 380, ry: 120, fill: 'none', stroke: '#E4D4FF', 'stroke-width': 10, opacity: 0.4 }, hud);
  const harmT = T(hud, 600, 690, 'No particles were harmed. (Mostly.)', { size: 28, weight: 600, anchor: 'middle', fill: '#CFE7D6', font: FB });
  const fwoomp = ngPop(hud, 'FWOOMP!');

  /* ===== stinger props ===== */
  const shelf = G(propL);
  E('rect', { x: 760, y: 392, width: 300, height: 18, rx: 4, fill: '#8A5A2B', stroke: '#4A2E14', 'stroke-width': 3 }, shelf);
  E('path', { d: 'M790,410 L810,440 M1030,410 L1010,440', stroke: '#4A2E14', 'stroke-width': 6 }, shelf);
  const armG = G(frontL);
  E('path', { d: 'M0,0 Q70,-30 150,-112', fill: 'none', stroke: '#2E7DD8', 'stroke-width': 30, 'stroke-linecap': 'round' }, armG);
  E('path', { d: 'M110,-76 Q140,-104 150,-112', fill: 'none', stroke: '#B9784E', 'stroke-width': 24, 'stroke-linecap': 'round' }, armG);
  E('path', { d: 'M150,-112 L180,-142', stroke: '#B9784E', 'stroke-width': 11, 'stroke-linecap': 'round' }, armG);
  const sideTable = G(frontL);
  E('path', { d: 'M-130,-16 L130,-16 L150,120 L-150,120 Z', fill: '#FBF8F2', stroke: '#CFC4B0', 'stroke-width': 4, 'stroke-linejoin': 'round' }, sideTable);
  E('path', { d: 'M-130,-16 L130,-16 L134,8 L-134,8 Z', fill: '#E8DCC4' }, sideTable);
  const glass = G(castL);
  { const b = beaker(glass, 70, 86, { level: 0.7, liquid: '#7FD3F5', marks: false }); }
  // soot for the final frame: smudges and smoke curls on everyone except Goldie (gold reacts to nothing)
  const FIN = [['indi', 130, 560, 0.62], ['hal', 275, 560, 0.6], ['natalie', 425, 560, 0.6], ['henry', 790, 576, 0.62], ['maggie', 935, 560, 0.6], ['goldie', 1080, 560, 0.6]];
  const soot = G(castL), curls = [];
  FIN.forEach(([k, x, y], i) => {
    if (k === 'goldie') return;
    E('path', { d: `M${x - 52},${y + 30} q10,-16 26,-10 q12,-14 26,-2 q10,10 -4,18 q-20,10 -40,4 q-14,-2 -8,-10 Z`, fill: '#2A2A2E', opacity: 0.75 }, soot);
    E('path', { d: `M${x + 8},${y - 34} q8,-12 22,-8 q14,-6 20,6 q2,12 -14,14 q-18,4 -26,-2 q-8,-4 -2,-10 Z`, fill: '#2A2A2E', opacity: 0.7 }, soot);
    curls.push({ el: E('path', { d: '', fill: 'none', stroke: '#B9C0C8', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, soot), x: x + 6, y: y - 70, ph: i * 0.7 });
  });

  /* ---------- shots ---------- */
  const tBlack = end('no') + 0.02, tFinal = end('no') + 1.05;
  const SHOTS = [['I', -9], ['1', at('t1') - 0.05], ['2', at('t2') - 0.05], ['3', at('t3') - 0.05], ['4', at('t4') - 0.05], ['5', at('t5') - 0.05],
    ['6', at('t6') - 0.05], ['7', at('t7') - 0.05], ['8', at('t8') - 0.05], ['R', at('return') - 0.05], ['who', at('who') - 0.05],
    ['k', at('k') - 0.05], ['kw', at('kwater') - 0.05], ['off', at('offer') - 0.05], ['boom', tBlack], ['fin', tFinal]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const SPK = { 1: 'maggie', 2: 'henry', 3: 'hal', 4: 'natalie', 5: 'indi', 6: 'hal', 7: 'goldie', 8: 'indi' };
  const lf = (n, f) => mid('t' + n, f);

  return t => {
    const sh = shotAt(t);
    op(introBg, sh === 'I' ? 1 : 0);
    const spk = SPK[sh];
    KINDS.forEach(k => confs[k].set(spk === k ? 1 : 0, t));
    const green = sh === 'R' || sh === 'fin';
    op(greenBg, green ? 1 : 0); if (green) tr(rayP, 600, 380, 1, (t * 6 * AMP) % 360);
    const isVen = sh === 'k' || sh === 'kw' || sh === 'off';
    op(venue, isVen ? 1 : 0); if (isVen) venue.set(7, t * AMP);
    op(labG, sh === 'who' ? 1 : 0); op(bench, sh === 'who' ? 1 : 0); if (sh === 'who') lab.upd(t * AMP);
    ALL.forEach(c => op(c, 0));
    [cake, introSub, logoG, willT, ring, ring2, harmT, shelf, armG, sideTable, glass, soot, blackout, lilac].forEach(el => op(el, 0));
    cards.forEach(c => op(c, 0));
    fwoomp.set(0);
    let cam = [1, 600, 375];
    const show = (c, x, y, s, st, r) => { op(c, 1); tr(c, x, y, s, r); if (st) c.set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      op(cake, 1);
      const tp = P(t, at('intro') + 0.1, 0.5, pop);
      topper.setAttribute('transform', `translate(600 238) scale(${Math.max(0.01, 0.6 + 0.4 * tp).toFixed(3)}) translate(-600 -238)`); op(topper, clamp(tp * 2.5));
      op(introSub, P(t, mid('intro', 0.4), 0.4, linear));
      cam = [1 + 0.04 * P(t, at('intro'), 4, linear), 600, 420];
    } else if (spk) {
      const n = +sh, c = cards[n - 1], C_ = ch[spk];
      op(c, 1);
      let st = { talk: talk(t, spk), mood: 'neutral', look: 0 };
      // per-trap content, timed to the line
      if (n === 1) {
        st.mood = 'happy'; st.fizz = 0.7;
        op(c.a, P(t, lf(1, 0.1), 0.3, linear)); trapsPop(c.b, t, lf(1, 0.3), CX, 342);
        op(c.c, P(t, lf(1, 0.55), 0.3, linear)); op(c.d, P(t, lf(1, 0.72), 0.3, linear));
      } else if (n === 2) {
        const pp = P(t, lf(2, 0.12), 0.45, pop); op(c.a, clamp(pp * 2.5));
        const flinch = t > lf(2, 0.12) && t < lf(2, 0.4);
        st.mood = flinch ? 'shock' : 'neutral'; st.sweat = flinch ? 1 : 0.2;
        op(c.b, P(t, lf(2, 0.55), 0.3, linear));
      } else if (n === 3) {
        st.mood = t > lf(3, 0.5) ? 'smug' : 'happy';
        op(c.a, P(t, lf(3, 0.08), 0.3, linear)); trapsPopAt(c.ne, t, lf(3, 0.22), CX, 318); op(c.b, P(t, lf(3, 0.3), 0.3, linear));
        op(c.c, P(t, lf(3, 0.5), 0.3, linear)); op(c.d, P(t, lf(3, 0.72), 0.3, linear));
      } else if (n === 4) {
        const sorry = lf(4, 0.72);
        st.mood = t > sorry ? 'smug' : 'neutral'; st.look = t > sorry ? 0.8 : 0;
        op(c.a, P(t, lf(4, 0.08), 0.3, linear)); op(c.v, P(t, lf(4, 0.3), 0.3, linear)); op(c.b, P(t, lf(4, 0.45), 0.3, linear));
        const wv = t > sorry ? Math.sin(t * 8 * (0.5 + 0.5 * AMP)) * 20 : 0;
        c.arm.setAttribute('transform', `rotate(${wv.toFixed(1)} 28 0)`);
        tr(c.cuo, 800, 470 + (t > sorry ? 0 : 6));
      } else if (n === 5) {
        const tRed = lf(5, 0.22), tBlue = lf(5, 0.38), tHi = lf(5, 0.62);
        st.ph = t < tRed ? 7 : t < tBlue ? 1 : t < tHi ? 9.5 : 12.5;
        st.mood = 'deadpan';
        op(c.a, P(t, lf(5, 0.06), 0.3, linear)); trapsPopAt(c.r, t, tRed, 718, 380); trapsPopAt(c.bl, t, tBlue, 942, 380);
        op(c.s, P(t, tHi - 0.1, 0.3, linear)); c.ar.set(P(t, tHi, 0.7, easeOut));
      } else if (n === 6) {
        st.mood = 'happy';
        op(c.a, P(t, lf(6, 0.1), 0.3, linear)); c.eq.set(P(t, lf(6, 0.25), lf(6, 0.6) - lf(6, 0.25), linear));
        trapsPopAt(c.w, t, lf(6, 0.45), CX, 466); op(c.b, P(t, lf(6, 0.7), 0.3, linear));
      } else if (n === 7) {
        st.mood = 'smug';
        op(c.a, P(t, lf(7, 0.08), 0.3, linear)); op(c.h, P(t, lf(7, 0.15), 0.3, linear));
        c.rows.forEach((r, i) => op(r, P(t, lf(7, 0.18 + i * 0.1), 0.3, linear)));
        op(c.b, P(t, lf(7, 0.78), 0.3, linear));
      } else if (n === 8) {
        st.ph = 7; st.mood = t > lf(8, 0.75) ? 'deadpan' : 'neutral';
        op(c.a, P(t, lf(8, 0.05), 0.3, linear)); trapsPop(c.ok, t, lf(8, 0.4), CX, 372);
        trapsPop(c.no, t, lf(8, 0.62), CX, 470); c.no.st.set(P(t, lf(8, 0.7), 0.3)); op(c.b, P(t, lf(8, 0.85), 0.3, linear));
      }
      if (spk === 'indi' && st.ph === undefined) st.ph = 7;
      const sc = { maggie: 1.3, henry: 1.5, hal: 1.3, natalie: 1.3, indi: 1.3, goldie: 1.3 }[spk];
      show(C_, 310, 410, sc, st);
      cam = [1 + 0.03 * P(t, at('t' + n), 4, linear), 600, 375];
    } else if (sh === 'R') {
      const lp = P(t, at('return') + 0.05, 0.6, pop);
      op(logoG, clamp(lp * 2.5)); tr(logoG, 600, 290, Math.max(0.01, 0.5 + 0.5 * lp));
      op(willT, P(t, mid('return', 0.45), 0.4, linear));
    } else if (sh === 'who') {
      op(shelf, 1);
      show(jar, 910, 300, 0.6);
      pot.set({ t: 0.5, still: true, mood: 'deadpan' });
      show(kavya, 360, 440, 1.4, { talk: talk(t, 'kavya'), mood: 'neutral', look: 0.9 });
      const ap = P(t, at('who') + 0.15, 0.35, easeOut);
      op(armG, ap); tr(armG, 460, 560, 1.35, 20 * (1 - ap));
      cam = [1 + 0.04 * P(t, at('who'), 3, linear), 600, 380];
    } else if (sh === 'k' || sh === 'kw' || sh === 'off') {
      op(sideTable, 1); tr(sideTable, 780, 612, 0.8);
      const jx = 780, jy = 506;
      show(jar, jx, jy, 0.8);
      if (sh === 'k') {
        pot.set({ t: 0.5, still: true, mood: 'deadpan' });
        show(ch.indi, 400, 460, 1.25, { talk: talk(t, 'indi'), ph: 7, mood: 'deadpan', look: t > mid('k', 0.2) && t < mid('k', 0.7) ? 0.8 : 0 });
        const push = P(t, end('k') - 0.2, 1.1, linear);
        cam = [1 + 0.18 * ease(push), lerp(600, 700, push), 420];
      } else if (sh === 'kw') {
        // close-up: for the first time, his eyes open fully
        pot.set({ t: 0.5, still: true, mood: t < at('kwater') + 0.25 ? 'deadpan' : 'neutral', talk: talk(t, 'potassium'), look: t > end('kwater') + 0.1 ? -0.5 : 0 });
        cam = [2.3 + 0.12 * P(t, at('kwater'), 2.4, linear), jx, jy - 20];
      } else {
        const lunge = t >= at('no') - 0.05;
        pot.set({ t: 0.5, still: true, mood: 'neutral', look: -0.7 });
        const lp = P(t, at('no') - 0.05, 0.35, easeOut);
        show(ch.indi, lerp(150, 330, lp), 470 - 40 * Math.sin(Math.PI * lp), 1.0, { talk: talk(t, 'indi'), ph: 7, mood: lunge ? 'shock' : 'neutral', look: lunge ? 0.9 : 0.6 }, 18 * lp);
        show(ch.henry, 520, 492, 1.0, { talk: talk(t, 'henry'), mood: lunge ? 'shock' : 'happy', sweat: lunge ? 1 : 0, look: lunge ? -0.8 : 0.6 });
        const gp = P(t, at('offer') + 0.2, 0.9, ease);
        op(glass, 1); tr(glass, lerp(610, 680, gp), 440 - 8 * Math.sin(t * 6) * AMP, 1, -10 * gp);
        const shake = lunge ? Math.sin(t * 60) * 6 * AMP * P(t, at('no'), 0.2, linear) : 0;
        cam = [1 + 0.05 * P(t, at('offer'), 3, linear), 600 + shake, 400];
      }
    } else if (sh === 'boom') {
      op(blackout, 1);
      op(lilac, P(t, tBlack + 0.12, 0.06, linear) * (1 - P(t, tBlack + 0.2, 0.5, linear)));
      fwoomp.set(P(t, tBlack + 0.15, 0.6, linear)); tr(fwoomp, 600, 375, 1.3);
    } else if (sh === 'fin') {
      // final frame: logo in a lilac smoke ring; everyone singed and blinking, Goldie untouched, Potassium smug
      const fp = P(t, tFinal, 0.35, linear);
      op(logoG, 1); tr(logoG, 600, 230, 0.78);
      const rr = P(t, tFinal, 2.5, easeOut);
      op(ring, 0.45 * (1 - 0.4 * rr)); tr(ring, 600, 200, 0.8 + 0.25 * rr); op(ring2, 0.4 * (1 - 0.5 * rr)); tr(ring2, 600, 200, 0.85 + 0.3 * rr);
      FIN.forEach(([k, x, y, s]) => {
        const mood = k === 'goldie' ? 'smug' : k === 'henry' ? 'shock' : k === 'hal' ? 'happy' : 'deadpan';
        show(ch[k], x, y, s, { mood, ph: 7, sweat: k === 'henry' ? 0.6 : 0, fizz: 0 });
      });
      op(soot, 1);
      curls.forEach(c => { let d = `M${c.x},${c.y}`; for (let j = 1; j <= 4; j++) d += ` L${(c.x + 8 * Math.sin(j * 1.5 + t * 3 + c.ph)).toFixed(1)},${c.y - j * 14}`; attr(c.el, 'd', d); });
      show(jar, 600, 548, 0.78);
      pot.set({ t: 0.5, still: true, mood: 'smug' });
      op(harmT, P(t, tFinal + 0.6, 0.4, linear));
      op(blackout, 1 - fp);
    }
    trapsCam(cam[0], cam[1], cam[2]);
  };
});

/* Scene 7: The residents save you some marks.
   Shots: void deck notice "7 EXAM TRAPS" (Silas strolls in, stamp) -> seven snappy confessionals, one trap card
   each (Silas, Gemma, Kavya, Sonny, Chloe, Helena, Harold; Harold's name tag and his cloud raining harder)
   -> logo "BLOCK 118 will return" over the night building -> stinger in Ah Gong's confessional: Silas asks,
   1.4 s of nothing, "...No reaction." -> Silas deadpan, the whole cast peeks in, shocked -> logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed trp) ---------- */
  function trpFit(parent, x, y, str, o, maxW) {
    let size = o.size;
    while (size > 26 && textWidth(str.replace(/\*\*/g, ''), size, o.font || FD, o.weight || 700) > maxW) size -= 1;
    return T(parent, x, y, str, Object.assign({}, o, { size }));
  }
  const trpPop = (el, t, t0, x, y, r) => { const p = P(t, t0, 0.45, pop); vop(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, 0.7 + 0.3 * p), r); return p; };
  // pop a group drawn at absolute coordinates, scaling about (cx, cy)
  const trpPopAt = (el, t, t0, cx, cy) => { const p = P(t, t0, 0.45, pop), s = Math.max(0.01, 0.7 + 0.3 * p); vop(el, clamp(p * 2.5)); el.setAttribute('transform', `translate(${cx} ${cy}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`); };
  const trpFade = (el, t, t0) => vop(el, P(t, t0, 0.3, linear));
  let camStr = '';
  const trpCam = (k, fx, fy) => { camStr = Math.abs(k - 1) < 1e-4 ? '' : `translate(${(+fx).toFixed(1)} ${(+fy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`; };
  const CX = 880;
  function trpCard(parent, n) {
    const g = G(parent);
    card(g, 600, 140, 560, 470, { fill: 'rgba(10,27,39,0.93)', stroke: C.line });
    const h = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(h, CX, 190);
    return g;
  }
  function trpStruck(parent, x, y, str, size, fill) {
    const g = G(parent); tr(g, x, y);
    const w = textWidth(str, size, FD, 700);
    T(g, 0, size * 0.35, str, { size, weight: 700, anchor: 'middle', fill: fill || '#FF9AA4' });
    g.st = strike(g, -w / 2 - 8, 0, w / 2 + 8, C.bad);
    const x_ = cross(g, 15); tr(x_, w / 2 + 38, 0); g.x = x_;
    return g;
  }
  function trpFlame(parent, x, y, s, c1, c2) {
    const g = G(parent); tr(g, x, y, s);
    E('path', { d: 'M0,24 Q-24,8 -12,-16 Q-4,-4 0,-10 Q4,-30 16,-34 Q10,-12 20,0 Q24,18 0,24 Z', fill: c1, stroke: c2, 'stroke-width': 3 }, g);
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), Lbg = G(world), Lcast = G(world), Lfg = G(world), hud = G(root);

  /* ---------- sets ---------- */
  const shIntro = G(Lbg); bkVoidDeck(shIntro);
  const conf = bkConf(Lbg, 'silas');
  const confFill = conf.firstChild;
  const shRet = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0B1430', '#2A2350', true) }, shRet);
  { const r = rng(77); let st = ''; for (let i = 0; i < 60; i++) st += `M${(r() * 1200).toFixed(0)},${(r() * 430).toFixed(0)} h3 v3 h-3 Z `; E('path', { d: st, fill: '#FFFFFF', opacity: 0.7 }, shRet); }
  E('path', { d: 'M150,750 L150,520 L290,520 L290,470 L910,470 L910,520 L1050,520 L1050,750 Z', fill: '#1A2142' }, shRet);
  { const r = rng(118); let lit = ''; for (let y = 490; y < 740; y += 34) for (let x = 170; x < 1040; x += 48) if ((y > 520 || (x > 290 && x < 900)) && r() < 0.45) lit += `M${x},${y} h22 v18 h-22 Z `; E('path', { d: lit, fill: '#FFD98A', opacity: 0.85 }, shRet); }
  const logo = T(shRet, 600, 330, 'BLOCK 118', { size: 116, weight: 800, anchor: 'middle', fill: C.energy });
  logo.setAttribute('stroke', '#1B2A55'); logo.setAttribute('stroke-width', 14); logo.setAttribute('paint-order', 'stroke'); logo.setAttribute('stroke-linejoin', 'round');
  const retSub = T(shRet, 600, 410, 'will return', { size: 48, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ---------- intro: the notice ---------- */
  const notice = bkSign(Lfg, '7 EXAM TRAPS', 'The residents would like to\nsave you some marks.', { w: 660, h: 300, size: 38 });
  const nStamp = G(Lfg);
  E('rect', { x: -215, y: -28, width: 430, height: 56, rx: 8, fill: 'none', stroke: '#C62828', 'stroke-width': 5 }, nStamp);
  T(nStamp, 0, 10, 'BY ORDER OF THE CARETAKER', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });

  /* ---------- trap cards ---------- */
  // 1 Silas: order
  const c1 = trpCard(Lfg, 1);
  const c1a = T(c1, CX, 268, 'The table is in order of', { size: 34, weight: 600, anchor: 'middle', fill: C.muted });
  const c1b = T(c1, CX, 340, 'ATOMIC NUMBER', { size: 56, weight: 800, anchor: 'middle', fill: C.energy });
  const c1c = T(c1, CX, 392, '= the number of **protons**', { size: 32, weight: 600, anchor: 'middle', boldFill: '#FF8A7A' });
  const c1d = trpStruck(c1, CX + 50, 500, 'mass', 52);
  const c1e = T(c1, CX - 90, 518, 'NOT', { size: 44, weight: 800, anchor: 'middle', fill: C.bad });
  // 2 Gemma: atomic number is the smaller number; neutrons = mass - atomic
  const c2 = trpCard(Lfg, 2);
  const c2box = G(c2);
  E('rect', { x: 625, y: 240, width: 150, height: 176, rx: 12, fill: '#E3E7EC', stroke: '#4A525C', 'stroke-width': 5 }, c2box);
  const c2z = T(c2box, 640, 282, '11', { size: 34, weight: 800, fill: '#3F5BD9' });
  T(c2box, 700, 352, 'Na', { size: 62, weight: 800, anchor: 'middle', fill: '#24324F' });
  T(c2box, 700, 400, '23', { size: 34, weight: 800, anchor: 'middle', fill: '#C2453A' });
  const c2l = G(c2);
  arrow(c2l, 800, 290, 682, 274, { color: C.energy, width: 5 });
  T(c2l, 810, 300, 'atomic number', { size: 32, weight: 700, fill: C.energy });
  const c2s = T(c2, 810, 352, '= the **SMALLER** one', { size: 32, weight: 600, fill: C.ink, boldFill: C.energy });
  const c2n = T(c2, CX, 478, 'neutrons = **mass − atomic**', { size: 36, weight: 600, anchor: 'middle', boldFill: C.ink });
  const c2m = T(c2, CX, 550, '23 − 11 = **12**', { size: 50, weight: 700, anchor: 'middle', fill: C.ink, boldFill: C.energy });
  // 3 Kavya: groups and periods
  const c3 = trpCard(Lfg, 3);
  { let d = ''; for (let c = 0; c < 8; c++) for (let r = 0; r < 4; r++) d += `M${680 + c * 50},${232 + r * 46} h50 v46 h-50 Z `; E('path', { d, fill: '#F6F0E2', stroke: '#8F8470', 'stroke-width': 2 }, c3); }
  const c3col = G(c3);
  E('rect', { x: 677, y: 229, width: 56, height: 190, rx: 6, fill: 'rgba(255,228,92,0.35)', stroke: '#FFE45C', 'stroke-width': 5 }, c3col);
  const c3ca = arrow(c3col, 645, 236, 645, 412, { color: '#FFE45C', width: 6 });
  const c3row = G(c3);
  E('rect', { x: 677, y: 275, width: 406, height: 52, rx: 6, fill: 'rgba(127,211,255,0.3)', stroke: '#7FD3FF', 'stroke-width': 5 }, c3row);
  const c3ra = arrow(c3row, 690, 442, 1070, 442, { color: '#7FD3FF', width: 6 });
  const c3a = T(c3, CX, 500, '**GROUPS** = columns ↓', { size: 40, weight: 600, anchor: 'middle', boldFill: '#FFE45C' });
  const c3b = T(c3, CX, 558, '**PERIODS** = rows →', { size: 40, weight: 600, anchor: 'middle', boldFill: '#7FD3FF' });
  const c3star = G(Lfg);
  E('path', { d: (() => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 20 : 46; d += (i ? 'L' : 'M') + (Math.cos(a) * r).toFixed(1) + ',' + (Math.sin(a) * r).toFixed(1); } return d + 'Z'; })(), fill: '#FFD45C', stroke: '#B57B12', 'stroke-width': 4, 'stroke-linejoin': 'round' }, c3star);
  // 4 Sonny: Group 1
  const c4 = trpCard(Lfg, 4);
  const c4a = T(c4, CX, 276, 'GROUP 1: **very reactive**', { size: 40, weight: 800, anchor: 'middle', fill: C.ink, boldFill: '#FF9A6B' });
  const c4rows = [['Li', 0.6, '#FF3D5A', '#9E1F2A'], ['Na', 0.9, '#FFB52E', '#B57B12'], ['K', 1.25, '#B98CFF', '#6E4AC4']].map(([sym, s, a, b], i) => {
    const g = G(c4); const y = 352 + i * 62;
    T(g, 700, y + 12, sym, { size: 40, weight: 800, anchor: 'middle', fill: C.ink });
    trpFlame(g, 790, y, s, a, b);
    return g;
  });
  const c4arr = G(c4); arrow(c4arr, 900, 330, 900, 520, { color: C.energy, width: 8 }); T(c4arr, 930, 400, 'MORE', { size: 32, weight: 800, fill: C.energy }); T(c4arr, 930, 440, 'reactive', { size: 28, weight: 600, fill: C.energy });
  const c4b = T(c4, CX, 574, 'reactivity **INCREASES ↓**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.energy });
  // 5 Chloe: Group 7
  const c5 = trpCard(Lfg, 5);
  const c5a = T(c5, CX, 270, 'GROUP 7', { size: 44, weight: 800, anchor: 'middle', fill: '#C6E35A' });
  const c5rows = [['F', 230], ['Cl', 175], ['Br', 120], ['I', 65]].map(([sym, w], i) => {
    const g = G(c5); const y = 322 + i * 46;
    T(g, 690, y + 11, sym, { size: 32, weight: 800, anchor: 'middle', fill: C.ink });
    E('rect', { x: 730, y: y - 14, width: w, height: 28, rx: 14, fill: '#C6E35A' }, g);
    return g;
  });
  const c5arr = G(c5); arrow(c5arr, 1080, 312, 1080, 446, { color: '#FF9AA4', width: 8 }); T(c5arr, 1080, 482, 'LESS', { size: 28, weight: 800, anchor: 'middle', fill: '#FF9AA4' });
  const c5b = T(c5, CX, 538, 'reactivity **DECREASES ↓**', { size: 38, weight: 600, anchor: 'middle', boldFill: '#FF9AA4' });
  const c5c = chip(Lfg, 'OPPOSITE of Group 1!', { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 });
  // 6 Helena: full, not empty
  const c6 = trpCard(Lfg, 6);
  const c6a = T(c6, CX, 270, 'Noble gases are **unreactive**', { size: 36, weight: 600, anchor: 'middle', boldFill: '#FF8FD0' });
  const c6b = T(c6, CX, 314, 'because the outer shell is...', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const c6atom = G(c6); tr(c6atom, 720, 450);
  { E('circle', { r: 66, fill: 'none', stroke: '#FFD45C', 'stroke-width': 13, opacity: 0.45 }, c6atom);
    E('path', { d: 'M28,0 A28,28 0 1,0 -28,0 A28,28 0 1,0 28,0 M66,0 A66,66 0 1,0 -66,0 A66,66 0 1,0 66,0', fill: 'none', stroke: '#B9CADB', 'stroke-width': 3, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, c6atom);
    E('circle', { r: 11, fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 2 }, c6atom);
    let d = '', m = ''; const pts = []; [[2, 28, 0], [8, 66, 0.3]].forEach(([n, R, o]) => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * TAU / n + o; pts.push([Math.cos(a) * R, Math.sin(a) * R]); } });
    pts.forEach(([x, y]) => { d += `M${(x + 7).toFixed(1)},${y.toFixed(1)} A7,7 0 1,0 ${(x - 7).toFixed(1)},${y.toFixed(1)} A7,7 0 1,0 ${(x + 7).toFixed(1)},${y.toFixed(1)} Z `; m += `M${(x - 3).toFixed(1)},${y.toFixed(1)} L${(x + 3).toFixed(1)},${y.toFixed(1)} `; });
    E('path', { d, fill: '#4FA9EE', stroke: '#0E3F66', 'stroke-width': 2 }, c6atom); E('path', { d: m, stroke: '#FFFFFF', 'stroke-width': 2.5 }, c6atom); }
  const c6full = G(c6); T(c6full, 0, 18, 'FULL', { size: 64, weight: 800, anchor: 'middle', fill: '#FFD45C' }); tr(tick(c6full, 18), 110, 0);
  const c6empty = trpStruck(c6, 940, 540, 'empty', 40);
  // 7 Harold: hydrogen
  const c7 = trpCard(Lfg, 7);
  const c7a = T(c7, CX, 276, 'Group 1 metal **+ water**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.water });
  const c7b = T(c7, CX, 330, 'gives off...', { size: 32, weight: 600, anchor: 'middle', fill: C.muted });
  const c7c = G(c7);
  { const ch = chip(c7c, 'HYDROGEN', { size: 54, fill: '#F4F7FA', color: '#24324F', weight: 800, stroke: '#A9B5C0' }); }
  const c7bub = bubbles(c7, 660, 446, 440, 90, { n: 9, r: 9, speed: 0.4, seed: 7 });
  const c7d = T(c7, CX, 584, '(a gas)', { size: 30, weight: 600, anchor: 'middle', fill: C.muted });
  const tag = G(Lfg);
  E('rect', { x: -112, y: -62, width: 224, height: 124, rx: 10, fill: '#FFFFFF', stroke: '#C62828', 'stroke-width': 4 }, tag);
  E('rect', { x: -112, y: -62, width: 224, height: 46, rx: 10, fill: '#C62828' }, tag);
  T(tag, 0, -29, 'HELLO, I’M', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(tag, 0, 34, 'HYDROGEN', { size: 34, weight: 800, anchor: 'middle', fill: '#24324F' });

  /* ---------- the cast ---------- */
  const ch = {
    silas: cast(Lcast, 'silas'), gemma: cast(Lcast, 'gemma'), kavya: cast(Lcast, 'kavya', { home: true }),
    sonny: cast(Lcast, 'sonny'), chloe: cast(Lcast, 'chloe'), helena: cast(Lcast, 'helena'), harold: cast(Lcast, 'harold'), ahgong: cast(Lcast, 'ahgong'),
  };
  const hRain = E('path', { d: '', stroke: '#7FB6E8', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, ch.harold.cloud);
  // the final logo (in the HUD, so the camera never moves it)
  const logoE = T(hud, 600, 190, 'BLOCK 118', { size: 84, weight: 800, anchor: 'middle', fill: C.energy });
  logoE.setAttribute('stroke', '#1B2A55'); logoE.setAttribute('stroke-width', 12); logoE.setAttribute('paint-order', 'stroke'); logoE.setAttribute('stroke-linejoin', 'round');

  /* ---------- shots ---------- */
  const SH = [['I', -1e9], ['1', at('t1') - 0.06], ['2', at('t2') - 0.06], ['3', at('t3') - 0.06], ['4', at('t4') - 0.06], ['5', at('t5') - 0.06],
    ['6', at('t6') - 0.06], ['7', at('t7') - 0.06], ['R', at('return') - 0.06], ['A', at('ahgong') - 0.06], ['E', at('since') - 0.06]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SH) if (t >= t0) s = k; return s; };
  const CARDS = { 1: c1, 2: c2, 3: c3, 4: c4, 5: c5, 6: c6, 7: c7 };
  const WHO = { 1: 'silas', 2: 'gemma', 3: 'kavya', 4: 'sonny', 5: 'chloe', 6: 'helena', 7: 'harold', A: 'ahgong', E: 'ahgong' };
  const MOOD = { silas: 'deadpan', gemma: 'happy', kavya: 'happy', sonny: 'happy', chloe: 'happy', helena: 'smug', harold: 'sad' };
  const FGX = [notice, nStamp, c3star, c5c, tag];

  // visibility is collected during a frame and applied once at the end, so nothing flips hidden/shown twice
  // the camera goes on a wrapper around each top-level item, and only visible ones are moved:
  // moving one group over everything would also make the browser revisit every hidden shot
  const camItems = [];
  [Lbg, Lcast, Lfg].forEach(layer => [...layer.children].forEach(el => { const w = G(layer); layer.insertBefore(w, el); w.appendChild(el); camItems.push([w, el]); w.cam = ''; }));
  const camApply = () => camItems.forEach(([w, el]) => { if (el.style.display !== 'none' && w.cam !== camStr) { w.cam = camStr; if (camStr) w.setAttribute('transform', camStr); else w.removeAttribute('transform'); } });
  const pend = new Map();
  const vop = (el, v) => pend.set(el, v);
  return t => {
    pend.clear();
    const sh = shotAt(t);
    vop(shIntro, sh === 'I' ? 1 : 0); vop(shRet, sh === 'R' ? 1 : 0);
    const cw = WHO[sh];
    conf.set(cw ? 1 : 0, t);
    if (cw && cw !== confFill.kind) { attr(confFill, 'fill', linGrad(BK_TINT[cw][0], BK_TINT[cw][1], true)); confFill.kind = cw; }
    for (const k in CARDS) vop(CARDS[k], k === sh ? 1 : 0);
    FGX.forEach(e => vop(e, 0));
    const shown = new Set();
    let cam = [1, 600, 375];
    const show = (k, x, y, s, st) => { shown.add(k); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      const np = P(t, at('intro') + 0.05, 0.5, pop);
      vop(notice, clamp(np * 2.5)); tr(notice, 680, 320, Math.max(0.01, 0.6 + 0.4 * np), -1.5);
      const wp = P(t, at('intro') + 0.2, 1.2, easeOut);
      const jig = Math.abs(Math.sin(t * 9)) * 6 * (1 - wp) * AMP;
      show('silas', lerp(-160, 200, wp), 470 - jig, 0.95, { mood: 'deadpan', look: 0.6 });
      const sp = P(t, mid('intro', 0.7), 0.3, pop);
      vop(nStamp, clamp(sp * 3)); tr(nStamp, 760, 425, Math.max(0.01, 1.6 - 0.6 * sp), -6);
      cam = [1 + 0.04 * P(t, at('intro'), 4.5, linear), 600, 375];
    } else if (CARDS[sh]) {
      const line = 't' + sh, k = WHO[sh];
      let mood = MOOD[k], look = 0, x = 320, y = 400, s = 1.3;
      if (k === 'kavya') { x = 320; y = 470; s = 1.3; if (t > mid('t3', 0.78)) mood = 'smug'; }
      if (k === 'sonny') { mood = t > mid('t4', 0.55) ? 'shock' : 'happy'; }
      if (k === 'chloe') { x = 330; s = 1.2; if (t > mid('t5', 0.5)) mood = 'annoyed'; }
      if (k === 'helena') { x = 330; s = 1.25; if (t > mid('t6', 0.62) && t < mid('t6', 0.8)) mood = 'annoyed'; }
      if (k === 'silas') { s = 1.4; }
      show(k, x, y, s, { talk: scTalk(S, t, k), mood, look });
      const c = CARDS[sh];
      if (sh === '1') {
        trpFade(c1a, t, mid('t1', 0.08)); trpPopAt(c1b, t, mid('t1', 0.2), CX, 322); trpFade(c1c, t, mid('t1', 0.5));
        trpFade(c1e, t, mid('t1', 0.8)); trpPop(c1d, t, mid('t1', 0.84), CX + 50, 500); c1d.st.set(P(t, mid('t1', 0.9), 0.3)); vop(c1d.x, P(t, mid('t1', 0.95), 0.2, linear));
      } else if (sh === '2') {
        trpPopAt(c2box, t, mid('t2', 0.06), 700, 328); vop(c2z, t > mid('t2', 0.14) ? 0.6 + 0.4 * wave(t, 0.6) : 1);
        trpFade(c2l, t, mid('t2', 0.14)); trpFade(c2s, t, mid('t2', 0.3));
        trpFade(c2n, t, mid('t2', 0.55)); trpPopAt(c2m, t, mid('t2', 0.78), CX, 534);
      } else if (sh === '3') {
        trpFade(c3col, t, mid('t3', 0.1)); c3ca.set(P(t, mid('t3', 0.14), 0.5)); trpFade(c3a, t, mid('t3', 0.12));
        trpFade(c3row, t, mid('t3', 0.42)); c3ra.set(P(t, mid('t3', 0.46), 0.5)); trpFade(c3b, t, mid('t3', 0.42));
        trpPop(c3star, t, mid('t3', 0.8), 520, 230, -12 + 6 * Math.sin(t * 3) * AMP);
      } else if (sh === '4') {
        trpFade(c4a, t, mid('t4', 0.06));
        c4rows.forEach((g, i) => { trpFade(g, t, mid('t4', 0.4 + i * 0.08)); g.lastChild.setAttribute('transform', `translate(790 ${352 + i * 62}) scale(${([0.6, 0.9, 1.25][i] * (1 + 0.08 * Math.sin(t * 9 + i) * AMP)).toFixed(3)})`); });
        trpFade(c4arr, t, mid('t4', 0.58)); trpFade(c4b, t, mid('t4', 0.62));
      } else if (sh === '5') {
        trpFade(c5a, t, mid('t5', 0.04));
        c5rows.forEach((g, i) => trpFade(g, t, mid('t5', 0.1 + i * 0.05)));
        trpFade(c5arr, t, mid('t5', 0.24)); trpFade(c5b, t, mid('t5', 0.26));
        trpPop(c5c, t, mid('t5', 0.52), CX, 585, -4);
      } else if (sh === '6') {
        trpFade(c6a, t, mid('t6', 0.06)); trpFade(c6b, t, mid('t6', 0.3));
        trpPop(c6atom, t, mid('t6', 0.4), 720, 450);
        const fp = P(t, mid('t6', 0.48), 0.45, pop), pulse = t > mid('t6', 0.86) ? 1 + 0.12 * Math.sin((t - mid('t6', 0.86)) * 12) * Math.exp(-(t - mid('t6', 0.86)) * 2) : 1;
        vop(c6full, clamp(fp * 2.5)); tr(c6full, 930, 440, Math.max(0.01, (0.7 + 0.3 * fp) * pulse));
        trpPop(c6empty, t, mid('t6', 0.64), 920, 540); c6empty.st.set(P(t, mid('t6', 0.7), 0.3)); vop(c6empty.x, P(t, mid('t6', 0.74), 0.2, linear));
      } else if (sh === '7') {
        trpFade(c7a, t, mid('t7', 0.06)); trpFade(c7b, t, mid('t7', 0.24));
        const hp = P(t, mid('t7', 0.34), 0.45, pop); vop(c7c, clamp(hp * 2.5)); tr(c7c, CX, 410, Math.max(0.01, 0.7 + 0.3 * hp));
        vop(c7bub, P(t, mid('t7', 0.34), 0.3, linear)); c7bub.upd(t); trpFade(c7d, t, mid('t7', 0.42));
        // "Me. Please, remember me.": a name tag, the cloud rains harder, slow push-in
        trpPop(tag, t, mid('t7', 0.7), 505, 560, -6);
        const hard = P(t, mid('t7', 0.55), 0.5, linear);
        tr(ch.harold.cloud, -8, -128, 1 + 0.25 * hard);
        let d = ''; if (hard > 0) for (let i = 0; i < 9; i++) { const xx = -40 + i * 10, yy = 16 + ((t * 150 + i * 23) % 46); d += `M${xx},${yy.toFixed(1)} l-4,12 `; }
        attr(hRain, 'd', d); vop(hRain, hard);
        const push = P(t, mid('t7', 0.55), end('t7') + 0.8 - mid('t7', 0.55), linear);
        cam = [1 + 0.14 * push, 560, 420];
      }
      if (sh !== '7') cam = [1 + 0.03 * P(t, at(line), 5, linear), 600, 375];
    } else if (sh === 'R') {
      const lp = P(t, at('return') + 0.05, 0.5, pop);
      vop(logo, clamp(lp * 2.5)); logo.setAttribute('transform', `translate(600 300) scale(${Math.max(0.01, 0.7 + 0.3 * lp).toFixed(3)}) translate(-600 -300)`);
      vop(retSub, P(t, mid('return', 0.5), 0.4, linear));
    } else if (sh === 'A') {
      // Silas asks. Ah Gong does not move. Not even a blink.
      show('ahgong', 560, 420, 1.35, { t: 1.0, still: true, talk: scTalk(S, t, 'ahgong') * 0.3, mood: 'deadpan', look: 0 });
      show('silas', 1080, 520, 0.8, { talk: scTalk(S, t, 'silas'), mood: 'neutral', look: -1 });
      const push = P(t, end('ahgong'), end('noreaction') + 0.6 - end('ahgong'), linear);
      cam = [1 + 0.4 * push, 560, 360];
    } else if (sh === 'E') {
      show('ahgong', 520, 440, 1.2, { t: 1.0, still: true, talk: 0, mood: 'deadpan', look: 0 });
      show('silas', 960, 500, 1.0, { talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: 0 });
      // the residents peek in, shocked: he SPOKE
      const peek = (k, t0, x0, y0, x1, y1, s, look) => { const p = P(t, t0, 0.35, easeOut); if (p > 0) show(k, lerp(x0, x1, p), lerp(y0, y1, p), s, { mood: 'shock', look, sweat: 0.5 }); };
      peek('sonny', mid('since', 0.32), -140, 380, 70, 380, 0.85, 1);
      peek('harold', mid('since', 0.4), 150, 860, 150, 660, 0.8, 1);
      peek('helena', mid('since', 0.36), 1010, -140, 1010, 110, 0.7, -1);
      peek('chloe', mid('since', 0.46), 1360, 270, 1150, 270, 0.7, -1);
      peek('gemma', mid('since', 0.52), 1110, 880, 1110, 690, 0.75, -1);
      const lp = P(t, end('since') + 0.35, 0.5, pop);
      vop(shRet, 0);
      vop(logoE, clamp(lp * 2.5)); logoE.setAttribute('transform', `translate(600 190) scale(${Math.max(0.01, 0.7 + 0.3 * lp).toFixed(3)}) translate(-600 -190)`);
    }
    if (sh !== 'E') vop(logoE, 0);
    for (const k in ch) vop(ch[k], shown.has(k) ? 1 : 0);
    trpCam(cam[0], cam[1], cam[2]);
    for (const [el, v] of pend) op(el, v);
    camApply();
  };
});

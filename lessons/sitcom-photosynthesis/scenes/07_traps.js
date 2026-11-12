/* Scene 7: The staff save you some marks.
   Shots: "7 EXAM TRAPS", the whole staff lined up on the factory floor -> seven snappy confessionals, one trap card
   each (Clive, Phyllis, Cosmo, Olive, Gus, Dewi, Kavya) -> title card "LEAF INC. will return" -> stinger at the
   stoma door at dusk: Clive asks the Guards; 1.4 s of nothing; "...Closed." (the door shuts, the sign flips) ->
   the camera in the dark, only the Guards' eyes, "Crew status: locked in until morning"; they blink once. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed traps) ---------- */
  function trapsCam(el, k, fx, fy) { el.setAttribute('transform', `translate(${fx.toFixed(1)} ${fy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`); }
  function trapsPop(el, t, t0, x, y, s) { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.7 + 0.3 * p))); }
  // text that shrinks (not below 26 px) to fit maxW; '_2' makes a real subscript; o.parts: [[text, colour], ...]
  function trapsText(parent, x, y, parts, o, maxW) {
    o = o || {};
    const plain = parts.map(p => p[0].replace(/_(\d+)/g, '$1')).join('');
    let size = o.size || 36;
    while (size > 26 && textWidth(plain, size, FD, o.weight || 700) > (maxW || 500)) size -= 1;
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': 'middle', 'font-family': FD }, parent);
    const sub = Math.round(size * 0.62), dy = Math.round(size * 0.24);
    let low = false;
    parts.forEach(([str, col, wt]) => {
      str.split(/_(\d+)/).forEach((seg, i) => {
        if (!seg) return;
        const a = {};
        if (col) a.fill = col;
        if (wt) a['font-weight'] = wt;
        if (i % 2) { a['font-size'] = sub; if (!low) a.dy = dy; low = true; } else if (low) { a.dy = -dy; low = false; }
        E('tspan', a, t).textContent = seg;
      });
    });
    return t;
  }
  const CX = 880;   // trap card centre
  function trapsCard(parent, n) {
    const g = G(parent);
    card(g, 610, 128, 540, 500, { fill: 'rgba(16,40,52,0.95)', stroke: C.line, sw: 3 });
    const head = chip(g, 'TRAP ' + n, { size: 30, fill: C.bad, color: '#FFFFFF', weight: 800 }); tr(head, CX, 182);
    return g;
  }

  /* ---------- layers ---------- */
  const world = G(root), bgL = G(world), charL = G(world), fx = G(root);

  /* ---------- sets ---------- */
  const facG = G(bgL);
  const fac = phFactory(facG);
  const KINDS = ['clive', 'phyllis', 'cosmo', 'olive', 'gus', 'dewi', 'kavya'];
  const confs = {};
  KINDS.forEach(k => { confs[k] = phConf(bgL, k); });
  const titleG = G(bgL);
  const title = phTitle(titleG);
  // the stoma door at dusk
  const doorG = G(bgL);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A2A5A', '#C86A4A', true) }, doorG);
  E('circle', { cx: 980, cy: 600, r: 160, fill: glow('#FFB27A'), opacity: 0.7 }, doorG);
  { let d = ''; for (let x = -40; x < 1240; x += 120) { if (x > 360 && x < 760) continue; d += `M${x + 6},270 h108 a12,12 0 0 1 12,12 v226 a12,12 0 0 1 -12,12 h-108 a12,12 0 0 1 -12,-12 v-226 a12,12 0 0 1 12,-12 Z `; }
    E('path', { d, fill: '#A7DDB0', stroke: '#2C8C4C', 'stroke-width': 4 }, doorG); }
  E('rect', { x: 0, y: 520, width: 1200, height: 10, fill: '#2C8C4C', opacity: 0.5 }, doorG);
  const sign = G(doorG); tr(sign, 600, 168);
  E('line', { x1: -60, y1: -60, x2: -40, y2: -26, stroke: '#C9D3DC', 'stroke-width': 3 }, sign);
  E('line', { x1: 60, y1: -60, x2: 40, y2: -26, stroke: '#C9D3DC', 'stroke-width': 3 }, sign);
  const signOpen = G(sign), signShut = G(sign);
  E('rect', { x: -110, y: -30, width: 220, height: 66, rx: 12, fill: '#1E6E3A', stroke: '#FFFFFF', 'stroke-width': 4 }, signOpen);
  T(signOpen, 0, 16, 'OPEN', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  E('rect', { x: -110, y: -30, width: 220, height: 66, rx: 12, fill: '#C62E3A', stroke: '#FFFFFF', 'stroke-width': 4 }, signShut);
  T(signShut, 0, 16, 'CLOSED', { size: 40, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });

  /* ---------- the cast: one of each, moved between shots ---------- */
  const ch = {};
  KINDS.concat(['guards']).forEach(k => { ch[k] = cast(charL, k, { mood: k === 'gus' ? 'happy' : 'deadpan' }); op(ch[k], 0); });

  /* ===== intro ===== */
  const sI = G(fx);
  const iHead = T(sI, 600, 330, '7 EXAM TRAPS', { size: 80, weight: 800, anchor: 'middle', fill: C.energy, ls: 2 });
  iHead.setAttribute('stroke', '#163D12'); iHead.setAttribute('stroke-width', 10); iHead.setAttribute('paint-order', 'stroke');
  const iSub = chip(sI, 'exam advice from the staff of Plant', { size: 32, fill: 'rgba(10,27,39,0.88)', color: C.ink, stroke: C.line, sw: 2 });
  const LINEUP = { clive: [520, 520, 0.58], phyllis: [380, 525, 0.5], cosmo: [240, 530, 0.38], dewi: [105, 525, 0.48], guards: [660, 530, 0.42], gus: [800, 525, 0.52], olive: [940, 530, 0.46], kavya: [1080, 525, 0.58] };

  /* ===== trap cards ===== */
  const cards = [];
  const W = 500;
  // 1 Clive
  { const c = trapsCard(fx, 1);
    const a = trapsText(c, CX, 270, [['chloro', C.ink], ['plast', C.glucose]], { size: 56, weight: 800 }, W);
    const b = trapsText(c, CX, 320, [['= the structure;']], { size: 36, weight: 600 }, W);
    const d = trapsText(c, CX, 420, [['chloro', C.ink], ['phyll', '#8FE59C']], { size: 56, weight: 800 }, W);
    const e = trapsText(c, CX, 470, [['= the green pigment']], { size: 36, weight: 600 }, W);
    const f = trapsText(c, CX, 516, [['inside it']], { size: 36, weight: 600 }, W);
    cards.push({ c, parts: [[a, 0.12], [b, 0.24], [d, 0.36], [e, 0.48], [f, 0.55]] }); }
  // 2 Phyllis
  { const c = trapsCard(fx, 2);
    const a = trapsText(c, CX, 272, [['chlorophyll', '#8FE59C']], { size: 52, weight: 800 }, W);
    const b = trapsText(c, CX, 342, [['REFLECTS', C.energy, 800], [' green;', '#5BD27A']], { size: 46 }, W);
    const d = trapsText(c, CX, 430, [['absorbs mainly']], { size: 36, weight: 600 }, W);
    const e = trapsText(c, CX, 500, [['red', '#FF5A5A', 800], [' + '], ['blue', '#6C9BFF', 800]], { size: 54 }, W);
    cards.push({ c, parts: [[a, 0.1], [b, 0.22], [d, 0.5], [e, 0.6]] }); }
  // 3 Cosmo
  { const c = trapsCard(fx, 3);
    const a = trapsText(c, CX, 266, [['light goes '], ['OVER', C.energy, 800], [' the arrow']], { size: 40 }, W);
    const b = trapsText(c, CX, 314, [['(not a reactant);', C.muted]], { size: 32, weight: 600 }, W);
    const d = trapsText(c, CX, 400, [['keep the '], ['6', C.glucose, 800], ['s:']], { size: 44 }, W);
    const eq = G(c);
    let e = null;
    for (let sz = 36; sz >= 26; sz -= 1) { if (e) e.remove(); e = phChem(eq, CX, 494, '6CO_2 + 6H_2O → C_6H_12O_6 + 6O_2', { size: sz, coef: C.glucose, fill: C.ink }); if (e.w <= W) break; }
    let ax = CX;
    try { const i = e.textContent.indexOf('→'); ax = (e.getStartPositionOfChar(i).x + e.getEndPositionOfChar(i).x) / 2; } catch (err) { ax = CX; }
    const lt = T(eq, ax, 452, 'light', { size: 26, weight: 700, anchor: 'middle', fill: C.energy });
    cards.push({ c, parts: [[a, 0.08], [b, 0.25], [d, 0.52], [eq, 0.6]], lt }); }
  // 4 Olive
  { const c = trapsCard(fx, 4);
    const a = trapsText(c, CX, 274, [['photosynthesis:']], { size: 44, weight: 700 }, W);
    const b = trapsText(c, CX, 362, [['CO_2', C.co2, 800], [' IN', C.good, 800], [', '], ['O_2', '#FF8A7A', 800], [' OUT', C.good, 800]], { size: 54 }, W);
    const d = trapsText(c, CX, 450, [['(the reverse is', C.muted]], { size: 34, weight: 600 }, W);
    const e = trapsText(c, CX, 496, [['respiration)', C.muted]], { size: 34, weight: 600 }, W);
    cards.push({ c, parts: [[a, 0.06], [b, 0.2], [d, 0.6], [e, 0.64]] }); }
  // 5 Gus
  { const c = trapsCard(fx, 5);
    const a = trapsText(c, CX, 280, [['plants respire']], { size: 46, weight: 700 }, W);
    const b = trapsText(c, CX, 370, [['ALL', C.energy, 800], [' the time,', C.energy, 800]], { size: 58 }, W);
    const d = trapsText(c, CX, 460, [['not just at night']], { size: 40, weight: 600, fill: '#FF9AA4' }, W);
    const icons = G(c);
    { const su = sun(icons, 20); tr(su, CX - 80, 530); icons.su = su; E('path', { d: 'M18,-22 A26,26 0 1 0 18,22 A20,20 0 1 1 18,-22 Z', fill: '#E9F2F7', transform: `translate(${CX + 60} 530)` }, icons); tr(tick(icons, 12), CX - 36, 530); tr(tick(icons, 12), CX + 104, 530); }
    cards.push({ c, parts: [[a, 0.1], [b, 0.3], [d, 0.62], [icons, 0.7]], icons }); }
  // 6 Dewi
  { const c = trapsCard(fx, 6);
    const a = trapsText(c, CX, 266, [['a plateau means']], { size: 40, weight: 600 }, W);
    const b = trapsText(c, CX, 340, [['ANOTHER', C.energy, 800], [' factor', C.energy, 800]], { size: 54 }, W);
    const d = trapsText(c, CX, 400, [['is limiting']], { size: 40, weight: 600 }, W);
    const e = trapsText(c, CX, 470, [["(not 'the plant is full')", '#FF9AA4']], { size: 34, weight: 600 }, W);
    const gr = G(c);
    E('path', { d: `M${CX - 90},590 L${CX - 90},520 M${CX - 90},590 L${CX + 90},590`, stroke: C.muted, 'stroke-width': 4, fill: 'none' }, gr);
    E('path', { d: `M${CX - 90},588 Q${CX - 40},528 ${CX},530 L${CX + 86},530`, stroke: C.plant, 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, gr);
    cards.push({ c, parts: [[a, 0.04], [b, 0.6], [d, 0.72], [e, 0.3], [gr, 0.62]] }); }
  // 7 Kavya
  { const c = trapsCard(fx, 7);
    const a = trapsText(c, CX, 268, [['heat ethanol in a']], { size: 40, weight: 600 }, W);
    const b = trapsText(c, CX, 344, [['WATER BATH,', C.water, 800]], { size: 56 }, W);
    const d = trapsText(c, CX, 424, [['flame '], ['OFF', '#FF6070', 800]], { size: 52 }, W);
    const e = trapsText(c, CX, 490, [['(flammable)', C.muted]], { size: 34, weight: 600 }, W);
    const nf = G(c); tr(nf, CX, 556);
    E('circle', { r: 30, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 5 }, nf);
    E('path', { d: 'M0,20 C-16,20 -20,5 -13,-5 C-9,-12 -5,-15 -4,-24 C4,-17 3,-9 7,-7 C9,-12 9,-16 8,-20 C17,-11 20,3 15,12 C11,18 5,20 0,20 Z', fill: '#FF8A3D' }, nf);
    E('path', { d: 'M-21,-21 L21,21', stroke: '#E8424F', 'stroke-width': 6, 'stroke-linecap': 'round' }, nf);
    cards.push({ c, parts: [[a, 0.24], [b, 0.4], [d, 0.58], [e, 0.66], [nf, 0.66]] }); }

  /* ===== "will return" ===== */
  const sR = G(fx);
  const logo = phLogo(sR);
  const rSub = T(sR, 600, 400, 'will return', { size: 48, weight: 700, anchor: 'middle', fill: '#FFFFFF' });

  /* ===== stinger ===== */
  const sD = G(fx);   // the dark: viewfinder and the Guards' eyes
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#020406' }, sD);
  const eyes = [-1, 1].map(sd => { const f = scFace(sD, { eye: 13, gap: 32, mouthW: 28, mouthY: 28, lidCol: '#020406', brow: false }); tr(f, 600 + sd * 34 * 2.2, 380, 2.2); return f; });
  const finder = G(sD);
  E('path', { d: 'M40,150 L40,40 L150,40 M1050,40 L1160,40 L1160,150 M1160,600 L1160,710 L1050,710 M150,710 L40,710 L40,600', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.7 }, finder);
  const recDot = E('circle', { cx: 1066, cy: 76, r: 10, fill: '#FF3B3B' }, finder);
  T(finder, 1084, 86, 'REC', { size: 28, weight: 700, fill: '#FFFFFF' });
  const crew = chip(sD, 'Crew status: locked in until morning', { size: 32, fill: '#1A0A0E', color: '#FF9AA4', stroke: '#FF6070', sw: 3 });
  const mini = phLogo(sD);
  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, root);

  /* ---------- shots ---------- */
  const SHOTS = [['I', -9], ['1', at('t1') - 0.06], ['2', at('t2') - 0.06], ['3', at('t3') - 0.06], ['4', at('t4') - 0.06], ['5', at('t5') - 0.06],
    ['6', at('t6') - 0.06], ['7', at('t7') - 0.06], ['R', at('return') - 0.06], ['A', at('ask') - 0.06], ['D', mid('stuck', 0) - 0.06]];
  const shotAt = t => { let s = 'I'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const SPEAK = { 1: 'clive', 2: 'phyllis', 3: 'cosmo', 4: 'olive', 5: 'gus', 6: 'dewi', 7: 'kavya' };
  const MOOD = { clive: 'deadpan', phyllis: 'smug', cosmo: 'smug', olive: 'deadpan', gus: 'happy', dewi: 'happy', kavya: 'neutral' };
  const SCALE = { clive: 1.4, phyllis: 1.35, cosmo: 1.05, olive: 1.3, gus: 1.4, dewi: 1.35, kavya: 1.55 };

  return t => {
    const sh = shotAt(t);
    op(blackout, 0);
    op(facG, sh === 'I' ? 1 : 0); op(titleG, sh === 'R' ? 1 : 0); op(doorG, sh === 'A' ? 1 : 0);
    for (const k in confs) confs[k].set(SPEAK[sh] === k ? 1 : 0, t);
    for (const k in ch) op(ch[k], 0);
    op(sI, sh === 'I' ? 1 : 0); op(sR, sh === 'R' ? 1 : 0); op(sD, sh === 'D' ? 1 : 0);
    cards.forEach((cd, i) => op(cd.c, sh === String(i + 1) ? 1 : 0));
    let cam = [1, 600, 375];
    const show = (k, x, y, s, st) => { op(ch[k], 1); tr(ch[k], x, y, s); ch[k].set(Object.assign({ t }, st)); };

    if (sh === 'I') {
      fac.set({ t, light: 1, belt: 50 });
      for (const k in LINEUP) {
        const [x, y, s] = LINEUP[k];
        const p = P(t, at('intro') + 0.1 + Object.keys(LINEUP).indexOf(k) * 0.1, 0.4, pop);
        op(ch[k], clamp(p * 3)); tr(ch[k], x, y + 30 * (1 - clamp(p)), Math.max(0.01, s * p));
        ch[k].set({ t, mood: MOOD[k] || 'deadpan', look: k === 'clive' || k === 'guards' ? 0 : (x < 520 ? 0.6 : -0.6), still: k === 'guards' });
      }
      const hp = P(t, at('intro') + 0.05, 0.5, pop); op(iHead, clamp(hp * 2));
      iHead.setAttribute('transform', `translate(600 300) scale(${Math.max(0.01, 0.7 + 0.3 * hp).toFixed(3)}) translate(-600 -300)`);
      trapsPop(iSub, t, mid('intro', 0.45), 600, 396);
      cam = [1 + 0.04 * P(t, at('intro'), 4.4, linear), 600, 450];
      trapsCam(world, cam[0], cam[1], cam[2]);
      return;
    }
    if (SPEAK[sh]) {
      const k = SPEAK[sh], line = 't' + sh, cd = cards[+sh - 1];
      let mood = MOOD[k], look = 0, sweat = 0;
      if (k === 'clive' && t > mid('t1', 0.78)) mood = 'annoyed';
      if (k === 'phyllis' && t > mid('t2', 0.5)) mood = 'happy';
      if (k === 'dewi') sweat = 1;
      if (k === 'kavya' && t > end('t7')) mood = 'smug';
      if (k === 'olive' && t > mid('t4', 0.7)) look = 0.5;
      const bounce = k === 'gus' ? -Math.abs(Math.sin(t * 7)) * 14 * AMP : 0;
      show(k, 330, 410 + bounce, SCALE[k], { talk: talk(t, k), mood, look, sweat });
      cd.parts.forEach(([el, f]) => op(el, P(t, mid(line, f), 0.3, linear)));
      if (cd.icons) cd.icons.su.upd(t);
      cam = [1 + 0.035 * P(t, at(line), 5, linear), 600, 375];
    } else if (sh === 'R') {
      title.set(t * AMP);
      const lp = P(t, at('return') + 0.02, 0.55, pop); op(logo, clamp(lp * 2)); tr(logo, 600, 270, Math.max(0.01, 0.6 + 0.4 * lp));
      tr(logo.sun, -330, -26, 1, (t * 20 * AMP) % 360);
      op(rSub, P(t, mid('return', 0.45), 0.35, linear));
    } else if (sh === 'A') {
      // the stoma door at dusk: Clive asks, the Guards say nothing for a long time, then "...Closed."
      const cl = P(t, at('closed') + 0.1, 0.6, ease);
      show('guards', 600, 400, 1.4, { talk: talk(t, 'guards'), mood: 'deadpan', open: 1 - cl, still: true });
      const asked = t > end('ask');
      const shocked = t > mid('closed', 0.5);
      show('clive', 200, 600, 0.62, { talk: talk(t, 'clive'), mood: shocked ? 'shock' : asked ? 'deadpan' : 'neutral', look: shocked ? 0 : 1 });
      op(signOpen, cl < 0.5 ? 1 : 0); op(signShut, cl < 0.5 ? 0 : 1);
      tr(sign, 600, 168, 1, cl > 0.4 && cl < 1 ? 6 * Math.sin(t * 20) * (1 - cl) : 0);
      // slow push-in on the Guards through the silence
      const push = P(t, end('ask'), at('closed') - end('ask'), linear);
      cam = [1 + 0.16 * push, 600, 400];
    } else if (sh === 'D') {
      op(recDot, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.15);
      const blinkT = end('stuck') + 0.6;
      const bl = Math.max(0, 1 - Math.abs(t - blinkT) / 0.09);
      eyes.forEach(f => f.set({ mood: 'deadpan', look: 0, blink: bl }));
      op(blackout, 1 - P(t, mid('stuck', 0) - 0.06, 0.2, linear));
      trapsPop(crew, t, mid('stuck', 0.35), 600, 590);
      const lp = P(t, end('stuck') + 0.2, 0.5, ease); op(mini, lp); tr(mini, 960, 668, 0.32);
    }
    trapsCam(world, cam[0], cam[1], cam[2]);
  };
});

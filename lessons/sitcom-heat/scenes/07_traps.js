/* Scene 7: The residents save you some marks.
   Beats: "7 EXAM TRAPS" with the cast in a row -> seven quick confessional cuts, one trap card each (red cross
   for the wrong idea, green tick for the right one) with a "marks saved" counter -> Kavya: "Yes. I was
   listening." (smug) -> "BLOCK 34 will return" -> Vic's confessional: his mouth moves, no sound -> Jules leans in:
   sound needs particles -> Cel, happy for the first time -> final frame: Vic waving silently under the logo. */
scene('traps', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- local helpers (prefixed tp) ---------- */
  const tpOn = (t, a, b) => (t >= a && t < b ? 1 : 0);
  const tpPop = (el, t, t0, x, y, s, r, mul) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5) * (mul === undefined ? 1 : mul)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  // a trap card: "TRAP n" tab, a title, rows of [ok, text]; card.rows[i] are the row groups
  function tpCard(parent, n, title, rows) {
    const g = G(parent);
    const h = 170 + rows.length * 92;
    E('rect', { x: 0, y: 0, width: 640, height: h, rx: 24, fill: 'rgba(10,27,39,0.94)', stroke: C.energy, 'stroke-width': 3 }, g);
    const tab = chip(g, `TRAP ${n}`, { size: 28, fill: '#C62828', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 }); tr(tab, 90, 0, 1, -4);
    T(g, 40, 92, title, { size: 44, weight: 800, fill: C.energy });
    E('line', { x1: 40, y1: 116, x2: 600, y2: 116, stroke: C.line, 'stroke-width': 3 }, g);
    g.rows = rows.map(([ok, text], i) => {
      const r = G(g); tr(r, 62, 172 + i * 92);
      tr(ok ? tick(r, 20) : cross(r, 16), 0, 0);
      T(r, 42, 12, text, { size: 32, weight: 600, fill: ok ? '#FFFFFF' : '#FFB3BA', boldFill: ok ? C.good : '#FF6070' });
      if (!ok) { const w = textWidth(text, 32, FD, 600); E('line', { x1: 38, y1: 2, x2: 46 + w, y2: 2, stroke: '#FF6070', 'stroke-width': 4, opacity: 0.8 }, r); }
      return r;
    });
    return g;
  }

  /* layers */
  const Lbg = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ================= sets ================= */
  const burst = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A0C06', '#6E2410', true) }, burst);
  let rays = '';
  for (let i = 0; i < 18; i++) { const a0 = i / 18 * TAU, a1 = a0 + TAU / 44; rays += `M0,0 L${(Math.cos(a0) * 1100).toFixed(0)},${(Math.sin(a0) * 1100).toFixed(0)} L${(Math.cos(a1) * 1100).toFixed(0)},${(Math.sin(a1) * 1100).toFixed(0)} Z `; }
  const rayP = E('path', { d: rays, fill: '#FFB45C', opacity: 0.09 }, burst);
  E('ellipse', { cx: 600, cy: 590, rx: 600, ry: 200, fill: glow('#FF8A3D'), opacity: 0.4 }, burst);
  const ORDER = ['cel', 'jules', 'zip', 'gus', 'ray', 'woolly', 'kavya'];
  const confs = {};
  ORDER.concat(['vic']).forEach(k => { confs[k] = bkConfessional(Lbg, k); });

  /* ================= the cast ================= */
  const cast_ = {};
  ORDER.forEach(k => { cast_[k] = cast(Lcast, k, { mood: 'neutral' }); });
  const vic = cast(Lcast, 'vic', { mood: 'neutral' });
  const hand = G(Lcast);
  E('path', { d: 'M-22,30 L-22,-10 Q-22,-34 0,-34 Q22,-34 22,-10 L22,30', fill: 'none', stroke: '#C9D6E2', 'stroke-width': 5, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' }, hand);
  E('path', { d: 'M22,-2 Q40,-10 38,-26', fill: 'none', stroke: '#C9D6E2', 'stroke-width': 5, 'stroke-dasharray': '8 6', 'stroke-linecap': 'round' }, hand);

  /* ================= cards and labels ================= */
  const logo = G(Lfg); bkLogo(logo);
  const head = T(Lfg, 0, 0, '7 EXAM TRAPS', { size: 92, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  head.setAttribute('stroke', '#5A2B07'); head.setAttribute('stroke-width', 12); head.setAttribute('paint-order', 'stroke');
  const saveChip = bkChip(Lfg, 'save yourself some marks', { size: 32, color: '#FFFFFF' });
  const CARDS = {
    cel: [1, 'HEAT ≠ TEMPERATURE', [[false, 'heat = temperature'], [true, 'heat = energy, in **joules (J)**'], [true, 'temperature = how hot, in **°C**']], [0.08, 0.3, 0.68]],
    jules: [2, 'WHICH WAY?', [[true, 'thermal energy flows **hot → cold**'], [false, 'cold → hot'], [false, '“cold” flows in']], [0.12, 0.45, 0.72]],
    zip: [3, 'METALS CONDUCT WELL', [[true, 'because of **free electrons**'], [false, 'because they’re shiny']], [0.3, 0.68]],
    gus: [4, 'CONVECTION', [[true, 'needs a **fluid** (liquid or gas)'], [true, 'warm fluid rises: **less dense**'], [false, 'because it’s “lighter”']], [0.15, 0.5, 0.82]],
    ray: [5, 'RADIATION', [[false, 'needs particles to travel'], [true, 'crosses a **vacuum**'], [true, 'shiny = **poor absorber**']], [0.18, 0.38, 0.75]],
    woolly: [6, 'INSULATORS', [[false, 'add heat'], [true, '**slow** thermal energy down']], [0.25, 0.6]],
    kavya: [7, 'EXPANSION', [[true, '**volume** goes up'], [true, '**mass** stays the same'], [false, 'mass goes up']], [0.2, 0.42, 0.55]],
  };
  const cards = {};
  ORDER.forEach(k => { const [n, title, rows] = CARDS[k]; cards[k] = tpCard(Lfg, n, title, rows); });
  const marks = chip(Lfg, 'marks saved: 0', { size: 30, fill: '#1F7A4D', color: '#FFFFFF', stroke: '#FFFFFF', sw: 3, w: 300 });
  const listen = bkChip(Lfg, '(she was listening)', { size: 30, color: C.energy });
  const willT = T(Lfg, 600, 560, 'will return', { size: 64, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const noSound = chip(Lfg, '(no sound)', { size: 34, fill: 'rgba(10,27,39,0.9)', stroke: '#C9D6E2', sw: 3, color: '#C9D6E2' });
  const sndChip = chip(Lfg, 'sound needs particles', { size: 36, fill: 'rgba(10,27,39,0.92)', stroke: C.energy, sw: 3, color: C.energy });
  const vacChip = chip(Lfg, 'vacuum: no particles, no sound', { size: 30, fill: 'rgba(10,27,39,0.92)', stroke: '#C9D6E2', sw: 3, color: '#FFFFFF' });
  const dots = T(Lfg, 0, 0, '', { size: 60, weight: 800, anchor: 'middle', fill: '#C9D6E2' });

  /* cut points */
  const cT = ORDER.map((k, i) => at('t' + (i + 1)) - 0.06);
  const cReturn = at('return') - 0.06, cVic = at('vic') - 0.06, cBest = at('best') - 0.06, cFinal = end('best') + 0.35;

  return t => {
    const sIntro = tpOn(t, -1, cT[0]), sRet = tpOn(t, cReturn, cVic), sVic = tpOn(t, cVic, cBest), sBest = tpOn(t, cBest, cFinal), sFinal = tpOn(t, cFinal, 1e9);
    let trap = -1;
    for (let i = 0; i < 7; i++) if (t >= cT[i] && t < (i < 6 ? cT[i + 1] : cReturn)) trap = i;
    const on = {};

    /* ---------- the sunburst (intro, return, final) ---------- */
    const bOn = Math.max(sIntro, sRet, sFinal);
    op(burst, bOn);
    tr(rayP, 600, 590, 1, (t * 6 * AMP) % 360);
    if (sIntro) {
      tpPop(logo, t, at('intro') - 0.2, 600, 175, 0.5);
      tpPop(head, t, mid('intro', 0.2), 600, 380);
      tpPop(saveChip, t, mid('intro', 0.65), 600, 450);
      ORDER.forEach((k, i) => {
        const c = cast_[k], p = P(t, mid('intro', 0.3) + i * 0.12, 0.45, pop);
        on[k] = 1;
        const x = 150 + i * 150, y = 610 + 26 * (1 - clamp(p));
        const s = { cel: 0.5, jules: 0.42, zip: 0.5, gus: 0.45, ray: 0.42, woolly: 0.5, kavya: 0.42 }[k];
        op(c, clamp(p * 3)); tr(c, x, y, Math.max(0.01, s * p));
        c.set({ t, mood: { cel: 'deadpan', jules: 'happy', zip: 'happy', gus: 'smug', ray: 'smug', woolly: 'sad', kavya: 'deadpan' }[k], look: 0, temp: 25, phone: 0 });
      });
    } else { op(head, 0); op(saveChip, 0); }
    if (sRet) {
      tpPop(logo, t, at('return'), 600, 300, 0.85);
      op(willT, P(t, mid('return', 0.5), 0.4, linear)); tr(willT, 0, 30 * (1 - P(t, mid('return', 0.5), 0.4, easeOut)));
    } else op(willT, 0);
    if (sFinal) tpPop(logo, t, cFinal + 0.15, 600, 190, 0.6);
    if (!sIntro && !sRet && !sFinal) op(logo, 0);

    /* ---------- the seven traps ---------- */
    ORDER.forEach((k, i) => {
      const live = trap === i;
      confs[k].set(live || (k === 'cel' && sBest) ? 1 : 0, t);
      const card = cards[k];
      if (!live) { op(card, 0); return; }
      const id = 't' + (i + 1), c = cast_[k];
      on[k] = 1;
      op(c, 1);
      const isK = k === 'kavya';
      const push = P(t, cT[i], (i < 6 ? cT[i + 1] : cReturn) - cT[i], linear);
      const s = ({ cel: 1.45, jules: 1.15, zip: 1.3, gus: 1.2, ray: 1.15, woolly: 1.3, kavya: 1.12 }[k]) * (1 + 0.04 * push);
      tr(c, k === 'ray' ? 250 : 260, isK ? 430 : 410, s);
      let mood = { cel: 'neutral', jules: 'happy', zip: 'happy', gus: 'smug', ray: 'smug', woolly: 'neutral', kavya: 'deadpan' }[k];
      let look = 0.3;
      if (k === 'zip' && t > mid(id, 0.66)) mood = 'annoyed';
      if (k === 'ray' && t > mid(id, 0.7)) mood = 'happy';
      if (k === 'woolly' && t > mid(id, 0.6)) mood = 'sad';
      if (isK && t > mid(id, 0.74)) { mood = 'smug'; look = 0; }
      c.set({ t, talk: scTalk(S, t, k), mood, look, temp: 25, zoom: k === 'zip' ? 0.6 : 0, phone: 1, sweat: 0 });
      tpPop(card, t, at(id) + 0.05, 520, isK ? 170 : 150);
      CARDS[k][3].forEach((f, j) => op(card.rows[j], P(t, mid(id, f), 0.25, linear)));
      if (isK) tpPop(listen, t, mid(id, 0.76), 270, 660); else op(listen, 0);
    });
    if (trap !== 6) op(listen, 0);
    // marks-saved counter
    if (trap >= 0) {
      const n = trap + (t > end('t' + (trap + 1)) - 0.2 ? 1 : 0);
      setText(marks.label, `marks saved: ${n}`);
      const bumpT = end('t' + (trap + 1)) - 0.2;
      const b = t > bumpT ? Math.sin(Math.PI * P(t, bumpT, 0.35, linear)) : 0;
      op(marks, 1); tr(marks, 1000, 698, 1 + 0.15 * b);
    } else op(marks, 0);

    /* ---------- Vic: no sound ---------- */
    if (sVic) {
      on.vic = 1;
      const push = P(t, cVic, cBest - cVic, linear);
      const silent = t > end('vic') + 0.05 && t < at('cant') - 0.1;
      op(vic, 1); tr(vic, 560, 400, 1.6 * (1 + 0.08 * push));
      vic.set({ t, talk: silent ? 0.5 + 0.5 * Math.sin((t - end('vic')) * TAU * 2.6) : 0, mood: t > at('cant') ? 'neutral' : 'neutral', look: t > at('cant') ? -0.7 : 0 });
      op(noSound, silent || (t > end('vic') && t < at('cant') + 0.3) ? P(t, end('vic') + 0.35, 0.2, linear) : 0); tr(noSound, 900, 230);
      setText(dots, silent ? '.'.repeat(1 + Math.floor((t - end('vic')) * 2.5) % 3) : ''); op(dots, silent ? 1 : 0); tr(dots, 760, 300);
      if (t > at('cant') - 0.06) {
        on.jules = 1;
        const lp = P(t, at('cant') - 0.06, 0.4, easeOut);
        const j = cast_.jules;
        op(j, 1); tr(j, lerp(-120, 150, lp), 470, 1.05, 22 * lp);
        j.set({ t, talk: scTalk(S, t, 'jules'), mood: 'happy', look: 0.8 });
        tpPop(sndChip, t, mid('cant', 0.35), 900, 200);
        tpPop(vacChip, t, mid('cant', 0.7), 830, 660);
      } else { op(sndChip, 0); op(vacChip, 0); }
    } else { op(noSound, 0); op(dots, 0); op(sndChip, 0); op(vacChip, 0); }
    confs.vic.set(sVic, t);

    /* ---------- Cel: best colleague ---------- */
    if (sBest) {
      on.cel = 1;
      const c = cast_.cel, push = P(t, cBest, cFinal - cBest, linear);
      op(c, 1); tr(c, 430, 380, 1.5 * (1 + 0.06 * push));
      c.set({ t, talk: scTalk(S, t, 'cel'), mood: 'happy', look: 0, temp: 25 });
    }

    /* ---------- final frame: Vic waves silently ---------- */
    op(hand, sFinal);
    if (sFinal) {
      on.vic = 1;
      const p = P(t, cFinal + 0.1, 0.45, pop);
      op(vic, clamp(p * 3)); tr(vic, 600, 500, Math.max(0.01, 1.2 * p));
      vic.set({ t, mood: 'happy', look: 0 });
      hand.setAttribute('transform', `translate(770 455) rotate(${(18 * Math.sin(t * TAU * 1.3 * (S.reduce ? 0.5 : 1))).toFixed(1)} 0 50) scale(1.7)`);
      op(hand, P(t, cFinal + 0.4, 0.3, linear));
    }

    ORDER.forEach(k => { if (!on[k]) op(cast_[k], 0); });
    if (!on.vic) op(vic, 0);
  };
});

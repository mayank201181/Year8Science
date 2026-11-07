/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (Same, Bonded, Free;
   Big then small; solute and solvent; FECD) -> "5 exam traps": each trap shows the wrong idea
   struck out and the right idea ticked, with a small picture. Same layout as respiration's recap. */
scene('recap', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- local helpers ---------- */
  const Y = C.energy, CY = '#7FD8F5';
  const EL = { N: '#5B8CFF', Co: '#7E8FA6' };
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), f = c => Math.round(c * (1 - k)); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
  function sphere(parent, col, r, dark) { const dk = dark || shade(col, 0.42); return E('circle', { r, fill: ball(col, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.08).toFixed(1) }, parent); }
  const atomS = (parent, kind, r) => sphere(parent, ATOM[kind][0], r, ATOM[kind][1]);
  const BOND = '#F4FAFD';
  function bondLine(parent, ax, ay, ra, bx, by, rb, len) {
    const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    const s = (d * d + ra * ra - rb * rb) / (2 * d), L = (len || 0.6) * Math.min(ra, rb);
    return E('line', { x1: (ax + ux * (s - L / 2)).toFixed(1), y1: (ay + uy * (s - L / 2)).toFixed(1), x2: (ax + ux * (s + L / 2)).toFixed(1), y2: (ay + uy * (s + L / 2)).toFixed(1), stroke: BOND, 'stroke-width': Math.max(2.2, 0.2 * Math.min(ra, rb)).toFixed(1), 'stroke-linecap': 'round', opacity: 0.9 }, parent);
  }
  function diatomic(parent, sym, r) {
    const g = G(parent), k = 0.72 * r;
    [-k, k].forEach(x => attr(ATOM[sym] ? atomS(g, sym, r) : sphere(g, EL[sym], r), 'cx', x));
    bondLine(g, -k, 0, r, k, 0, r);
    return g;
  }
  function water(parent, r) {
    const g = G(parent), hr = r * 0.62, hx = r * 0.98, hy = r * 0.72;
    const h1 = atomS(g, 'H', hr), h2 = atomS(g, 'H', hr); atomS(g, 'O', r);
    attr(h1, 'cx', -hx); attr(h1, 'cy', hy); attr(h2, 'cx', hx); attr(h2, 'cy', hy);
    bondLine(g, 0, 0, r, -hx, hy, hr, 0.5); bondLine(g, 0, 0, r, hx, hy, hr, 0.5);
    return g;
  }
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink, 'letter-spacing': o.ls }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2], 'font-size': s[3] }, t).textContent = s[0]; });
    return t;
  }
  const plain = segs => segs.map(s => (typeof s === 'string' ? s : s[0])).join('');
  const fit = (segs, size, maxW) => { const w = textWidth(plain(segs), size, FD, 700); return w > maxW ? Math.floor(size * maxW / w) : size; };
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], Y, 800], [w.slice(1), col]] : [w]));
  /* small apparatus, drawn about 80 px tall at s = 1, centred */
  function funnelArt(parent, s) {
    const g = G(parent), i = G(g); tr(i, 0, 0, s);
    E('path', { d: 'M-40,-34 L40,-34 L9,8 L9,40 L-9,40 L-9,8 Z', fill: GLASS.fill, stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, i);
    E('path', { d: 'M-32,-30 L32,-30 L0,4 Z', fill: '#F4F7FA', stroke: '#C9D6DE', 'stroke-width': 2, 'stroke-linejoin': 'round' }, i);
    g.inner = i;
    return g;
  }
  function basinArt(parent, s, crust, flame) {
    const g = G(parent), i = G(g); tr(i, 0, 0, s);
    E('path', { d: 'M-34,34 L-24,-2 M34,34 L24,-2 M0,34 L0,-2', stroke: '#7F8C99', 'stroke-width': 5, 'stroke-linecap': 'round' }, i);
    E('rect', { x: -40, y: -6, width: 80, height: 6, rx: 2, fill: '#8E9CA9', stroke: '#B9C6D2', 'stroke-width': 1.5 }, i);
    E('path', { d: 'M-42,-24 Q-38,-6 0,-6 Q38,-6 42,-24 Z', fill: ball('#FFFFFF', '#C9D3DA'), stroke: '#DCE6EE', 'stroke-width': 2 }, i);
    if (crust) [[-18, -17, 9, -8], [-4, -19, 11, 14], [11, -17, 8, 4], [22, -16, 6, -18]].forEach(([x, y, w, r]) => E('rect', { x: -w / 2, y: -w / 2, width: w, height: w, rx: 1.5, fill: '#EAF6FC', stroke: '#8FBCD4', 'stroke-width': 1.5, transform: `translate(${x} ${y}) rotate(${r})` }, i));
    else E('path', { d: 'M-34,-20 Q0,-12 34,-20 L30,-14 Q0,-8 -30,-14 Z', fill: C.water, opacity: 0.85 }, i);
    if (flame) E('path', { d: 'M0,4 C6,12 10,20 8,26 C6,33 -6,33 -8,26 C-10,20 -6,12 0,4 Z', fill: '#5AA8FF', stroke: '#BFE3FF', 'stroke-width': 1.5 }, i);
    return g;
  }
  function crystalsArt(parent, s) {
    const g = G(parent), i = G(g); tr(i, 0, 0, s);
    [[-20, 14, 26, -8], [12, 6, 34, 12], [-4, -22, 22, 28]].forEach(([x, y, w, r]) => {
      const c = G(i); tr(c, x, y, 1, r);
      E('rect', { x: -w / 2, y: -w / 2, width: w, height: w, rx: 3, fill: ball('#F2FBFF', '#9FC9E0'), stroke: '#DDF2FC', 'stroke-width': 2 }, c);
      E('path', { d: `M${-w / 2 + 4},${-w / 2 + 6} L${w / 2 - 6},${-w / 2 + 6}`, stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.8 }, c);
    });
    return g;
  }
  function condenserArt(parent, s) {
    const g = G(parent), i = G(g); tr(i, 0, 0, s, 24);
    E('rect', { x: -46, y: -12, width: 92, height: 24, rx: 10, fill: 'rgba(127,216,245,0.28)', stroke: '#9FDCF2', 'stroke-width': 2.5 }, i);
    E('line', { x1: -58, y1: 0, x2: 58, y2: 0, stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linecap': 'round' }, i);
    E('path', { d: 'M34,-12 L34,-22 M-34,12 L-34,22', stroke: '#9FDCF2', 'stroke-width': 4, 'stroke-linecap': 'round' }, i);
    E('path', { d: 'M28,-26 L34,-34 L40,-26 M-40,26 L-34,34 L-28,26', fill: 'none', stroke: '#5AA8FF', 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, i);
    E('circle', { cx: 60, cy: 4, r: 4, fill: C.water }, i);
    return g;
  }
  function balance(parent, reading) {
    const g = G(parent);
    E('rect', { x: -78, y: 0, width: 156, height: 50, rx: 10, fill: linGrad('#9AA8B5', '#5E6C79', true), stroke: '#C4CFD8', 'stroke-width': 2 }, g);
    E('rect', { x: -52, y: 12, width: 104, height: 28, rx: 5, fill: '#0E2418', stroke: '#2E5A3E', 'stroke-width': 2 }, g);
    E('rect', { x: -62, y: -8, width: 124, height: 9, rx: 4, fill: '#C9D4DC', stroke: '#E6EDF2', 'stroke-width': 1.5 }, g);
    T(g, 0, 35, reading, { size: 24, weight: 700, anchor: 'middle', fill: '#5CF08A' });
    return g;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseLt, 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#3A2A08' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#3A2A08' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Memory hooks', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2 x 2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CH = 262, POS = [[50, 108], [630, 108], [50, 388], [630, 388]];
  function hookCard(i) { const g = G(hooks); tr(g, POS[i][0], POS[i][1]); card(g, 0, 0, CW, CH, { fill: C.card, stroke: C.line }); return g; }

  // 1. Same, Bonded, Free: three little particle pictures
  const h1 = hookCard(0);
  const sbfSegs = initials('Same, Bonded, Free', C.ink);
  rich(h1, 30, 60, sbfSegs, { size: fit(sbfSegs, 36, 460), weight: 700 });
  const mini = [['Same', 'element'], ['Bonded', 'compound'], ['Free', 'mixture']].map(([w, kind], i) => {
    const g = G(h1), cx = 95 + i * 165, cy = 138;
    E('rect', { x: cx - 70, y: cy - 52, width: 140, height: 104, rx: 12, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 2.5 }, g);
    const inner = G(g); tr(inner, cx, cy);
    const items = [];
    if (i === 0) [[-36, -24, 20], [30, -20, -30], [-2, 26, 8]].forEach(([x, y, a]) => items.push({ g: diatomic(inner, 'N', 11), x, y, a }));
    else if (i === 1) [[-36, -20, 10], [32, -22, -14], [0, 24, 6]].forEach(([x, y, a]) => items.push({ g: water(inner, 12), x, y, a }));
    else {
      [[-46, -26], [34, 28]].forEach(([x, y]) => { const s = G(inner); sphere(s, EL.N, 11); items.push({ g: s, x, y, a: 0 }); });
      items.push({ g: diatomic(inner, 'O', 10), x: 26, y: -24, a: 25 });
      items.push({ g: water(inner, 11), x: -20, y: 24, a: -10 });
    }
    items.forEach((o, k) => tr(o.g, o.x, o.y, 1, o.a));
    T(g, cx, 222, w, { size: 28, weight: 700, anchor: 'middle', fill: Y });
    T(g, cx, 249, kind, { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    return { g, items, i };
  });

  // 2. Big then small: Na and Mg tiles
  const h2 = hookCard(1);
  rich(h2, 30, 62, [['Big', Y, 700, 46], [' then ', C.ink, 600, 32], ['small', C.ink, 700, 24]], { size: 32 });
  function tile(parent, cx, cy, a, b, name) {
    const g = G(parent);
    E('rect', { x: cx - 68, y: cy - 63, width: 136, height: 126, rx: 18, fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, g);
    rich(g, cx, cy + 14, [[a, Y, 700], [b, CY, 700]], { size: 62, anchor: 'middle' });
    T(g, cx, cy + 50, name, { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
    return g;
  }
  const naT = tile(h2, 94, 166, 'N', 'a', 'sodium'), mgT = tile(h2, 244, 166, 'M', 'g', 'magnesium');
  const leg1 = rich(h2, 326, 154, [['N', Y, 700, 34], [' = capital', C.ink, 600]], { size: 26 });
  const leg2 = rich(h2, 326, 210, [['a', CY, 700, 34], [' = lower case', C.ink, 600]], { size: 26 });

  // 3. Solute and solvent
  const h3 = hookCard(2);
  const solSegs = [['Solute', Y, 800], ' dissolves in the ', ['solvent', CY, 800]];
  rich(h3, 30, 60, solSegs, { size: fit(solSegs, 34, 460), weight: 700 });
  const sugar = G(h3); tr(sugar, 88, 150);
  E('rect', { x: -27, y: -27, width: 54, height: 54, rx: 8, fill: ball('#FFFFFF', '#CBD6DE'), stroke: '#E9EEF2', 'stroke-width': 2 }, sugar);
  [[-12, -10], [8, -2], [-4, 12], [14, 14], [-16, 8]].forEach(([x, y]) => E('rect', { x: x - 3, y: y - 3, width: 6, height: 6, rx: 1, fill: '#DCE5EB' }, sugar));
  T(h3, 170, 164, '+', { size: 44, weight: 600, anchor: 'middle', fill: C.muted });
  const wBk = beaker(h3, 84, 96, { level: 0.62, marks: false }); tr(wBk, 258, 150);
  const solArrow = arrow(h3, 318, 150, 370, 150, { color: C.ink, width: 5 });
  const sBk = beaker(h3, 84, 96, { level: 0.62, marks: false }); tr(sBk, 432, 150);
  const sDots = G(h3), sdr = rng(8);
  for (let k = 0; k < 9; k++) E('circle', { cx: (432 - 28 + sdr() * 56).toFixed(1), cy: (138 + sdr() * 40).toFixed(1), r: 3, fill: '#FFFFFF', opacity: 0.9 }, sDots);
  const tagSolute = T(h3, 88, 232, 'solute', { size: 28, weight: 700, anchor: 'middle', fill: Y });
  const tagSolvent = T(h3, 258, 232, 'solvent', { size: 28, weight: 700, anchor: 'middle', fill: CY });
  const tagSolution = T(h3, 432, 232, 'solution', { size: 28, weight: 700, anchor: 'middle' });
  const solParts = [[sugar, tagSolute], [wBk, tagSolvent], [sBk, sDots, tagSolution, solArrow]];

  // 4. FECD: four tiles with their apparatus
  const h4 = hookCard(3);
  rich(h4, 30, 62, [['F', Y, 800], ['E', Y, 800], ['C', Y, 800], ['D', Y, 800]], { size: 44, ls: 8 });
  const fecd = [['Filter', funnelArt, 0.62], ['Evaporate', (p, s) => basinArt(p, s, false, true), 0.62], ['Crystallise', crystalsArt, 0.8], ['Distil', condenserArt, 0.62]].map(([w, art, s], i) => {
    const g = G(h4), x0 = i % 2 ? 270 : 20, y0 = i < 2 ? 82 : 168;
    const hl = E('rect', { x: x0, y: y0, width: 230, height: 76, rx: 14, fill: C.card2, stroke: C.line, 'stroke-width': 2 }, g);
    const ic = art(g, s); tr(ic, x0 + 42, y0 + 36, 1);
    rich(g, x0 + 84, y0 + 48, [[w[0], Y, 800], [w.slice(1), C.ink, 700]], { size: 29 });
    return { g, hl, ic, x0, y0 };
  });
  const hookCards = [[h1, 'sbf'], [h2, 'big'], [h3, 'solute'], [h4, 'fecd']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['Co or CO?', 'can’t filter salt', 'solid or liquid?', 'impurities lower it', 'mass is conserved'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: Math.min(25, Math.floor(25 * 200 / textWidth(nm, 25, FD, 600))), weight: 600 });
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
    trapGroup('CO is cobalt', [['Co', Y, 800], ' = cobalt, but ', ['CO', Y, 800], ' = carbon monoxide'], g => {
      const co = G(g); tr(co, -170, -6);
      E('rect', { x: -52, y: -52, width: 104, height: 104, rx: 16, fill: C.card2, stroke: C.line, 'stroke-width': 2.5 }, co);
      rich(co, 0, 4, [['C', Y, 700], ['o', CY, 700]], { size: 48, anchor: 'middle' });
      T(co, 0, 38, 'cobalt', { size: 24, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
      const ne = T(g, -30, 14, '≠', { size: 54, weight: 700, anchor: 'middle', fill: C.muted });
      const mol = G(g); tr(mol, 130, -14);
      const k = 0.78 * 30;
      const cA = G(mol); tr(cA, -k, 0); atom(cA, 'C', 30, { letter: true });
      const oA = G(mol); tr(oA, k, 0); atom(oA, 'O', 30, { letter: true });
      bondLine(mol, -k, 0, 30, k, 0, 30);
      T(g, 130, 52, 'carbon monoxide', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
      const molL = g.lastChild;
      return t => {
        const a = P(t, mid('t1', 0.4), 0.5, pop), b = P(t, mid('t1', 0.62), 0.5, pop);
        op(co, clamp(a * 2)); tr(co, -170, -6, Math.max(0.01, 0.8 + 0.2 * a));
        op(ne, P(t, mid('t1', 0.58), 0.3, linear));
        op(mol, clamp(b * 2)); tr(mol, 130, -14, Math.max(0.01, 0.8 + 0.2 * b)); op(molL, clamp(b * 2));
      };
    }),
    trapGroup('Filter the salt out of salt water', [['Evaporate', Y, 800], ' or ', ['distil', Y, 800], ' it instead'], g => {
      const f = funnelArt(g, 0.95); tr(f, -120, -22);
      const liq = E('path', { d: 'M-27,-20 L27,-20 L0,4 Z', fill: C.water, opacity: 0.7 }, f.inner);
      const bk = beaker(g, 84, 60, { level: 0.5, marks: false }); tr(bk, -120, 50);
      const dots = [], dr = rng(19);
      for (let k = 0; k < 5; k++) dots.push({ el: E('circle', { r: 3.2, fill: '#FFFFFF' }, g), ph: k / 5, x: -126 + dr() * 12 });
      for (let k = 0; k < 6; k++) E('circle', { cx: (-148 + dr() * 56).toFixed(1), cy: (44 + dr() * 20).toFixed(1), r: 2.8, fill: '#FFFFFF', opacity: 0.9 }, g);
      const x = cross(g, 22); tr(x, 20, -6);
      T(g, 60, -12, 'the salt is dissolved:', { size: 26, weight: 600, fill: C.muted, font: FB });
      T(g, 60, 22, 'it slips through', { size: 30, weight: 700 });
      return t => dots.forEach(d => { const u = (t * 0.55 * calm + d.ph) % 1; attr(d.el, 'cx', d.x); attr(d.el, 'cy', -36 + u * 74); d.el.style.opacity = Math.min(1, u * 5, (1 - u) * 5).toFixed(3); });
    }),
    trapGroup('Evaporating gets the water back', [['evaporation', Y, 800], ' keeps the solid; ', ['distillation', CY, 800], ' the liquid'], g => {
      const b = basinArt(g, 1.45, true); tr(b, -150, -10);
      T(g, -150, 72, 'solid', { size: 28, weight: 700, anchor: 'middle', fill: Y });
      const d = condenserArt(g, 0.8); tr(d, 70, -28);
      const bk = beaker(g, 74, 66, { level: 0.55, marks: false }); tr(bk, 150, 20);
      T(g, 150, 76, 'liquid', { size: 28, weight: 700, anchor: 'middle', fill: CY });
      const drip = E('circle', { r: 5, fill: C.water }, g);
      return t => { const u = (t * 0.9 * calm) % 1; attr(drip, 'cx', 114); attr(drip, 'cy', -6 + u * 26); drip.style.opacity = (1 - u).toFixed(3); };
    }),
    trapGroup('Impurities raise the melting point', ['Impurities ', ['lower', Y, 800], ' it, over a ', ['range', Y, 800]], g => {
      const th = thermometer(g, 120, C.bad); tr(th, -250, 52, 0.85);
      const dn = arrow(g, -196, -48, -196, 30, { color: Y, width: 6 });
      T(g, -176, 4, 'lower', { size: 28, weight: 700, fill: Y });
      // a pure and an impure melting step on small axes
      const gr = G(g); tr(gr, 0, -10);
      E('path', { d: 'M-40,-62 L-40,58 L190,58', fill: 'none', stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gr);
      T(gr, -32, -48, 'temperature', { size: 24, weight: 600, fill: C.muted, font: FB });
      T(gr, 190, 84, 'time', { size: 24, weight: 600, fill: C.muted, anchor: 'end', font: FB });
      const pure = E('path', { d: 'M-34,36 L20,-12 L110,-12 L160,-50', fill: 'none', stroke: C.good, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, gr);
      const imp = E('path', { d: 'M-34,46 L14,12 Q60,6 110,-4 L160,-40', fill: 'none', stroke: C.bad, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '10 8' }, gr);
      T(gr, 166, -48, 'pure', { size: 24, weight: 700, fill: C.good, font: FB });
      T(gr, 172, -10, 'impure', { size: 24, weight: 700, fill: C.bad, font: FB });
      return t => {
        const p = P(t, mid('t4', 0.4), 1.2, linear);
        pure.setAttribute('stroke-dashoffset', (1 - p).toFixed(3));
        imp.style.opacity = P(t, mid('t4', 0.55), 0.5, linear).toFixed(3);
        th.set(0.62 - 0.32 * P(t, mid('t4', 0.4), 1.0));
        dn.set(P(t, mid('t4', 0.45), 0.6));
      };
    }),
    trapGroup('Dissolving destroys the solute', ['It’s still there: its mass is ', ['conserved', Y, 800]], g => {
      const b1 = balance(g, '110 g'); tr(b1, -150, -2);
      const k1 = beaker(g, 64, 58, { level: 0.6, marks: false }); tr(k1, -170, -40);
      E('path', { d: 'M-134,-11 Q-120,-34 -106,-11 Z', fill: '#FFFFFF', stroke: '#DCE6EE', 'stroke-width': 1.5 }, g);
      T(g, -150, 78, 'before', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
      T(g, 0, 22, '=', { size: 60, weight: 700, anchor: 'middle', fill: C.good });
      const b2 = balance(g, '110 g'); tr(b2, 150, -2);
      const k2 = beaker(g, 64, 58, { level: 0.68, marks: false }); tr(k2, 150, -40);
      const sp = rng(5);
      for (let k = 0; k < 6; k++) E('circle', { cx: (150 - 20 + sp() * 40).toFixed(1), cy: (-46 + sp() * 22).toFixed(1), r: 2.6, fill: '#FFFFFF' }, g);
      T(g, 150, 78, 'after dissolving', { size: 25, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
      return null;
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    const tt = t * calm;
    // padlock: shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('sbf') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('sbf') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        tr(g, POS[i][0], POS[i][1] + (1 - clamp(p)) * 26);
      });
      // 1: each picture pops in as it is explained; a gentle drift (mixture particles drift most)
      mini.forEach((m, i) => {
        const p = P(t, mid('sbf', [0.27, 0.5, 0.78][i]), 0.5, pop);
        op(m.g, clamp(p * 2));
        m.items.forEach((o, k) => tr(o.g, o.x + Math.sin(tt * (i === 2 ? 0.9 : 0.6) + k * 2) * (i === 2 ? 5 : 2), o.y + Math.cos(tt * 0.8 + k) * (i === 2 ? 4 : 2), 1, o.a + Math.sin(tt * 0.7 + k) * (i === 2 ? 14 : 5)));
      });
      // 2: Na, the rule, then Mg
      const na = P(t, mid('big', 0.18), 0.5, pop), mg = P(t, mid('big', 0.86), 0.5, pop);
      op(naT, clamp(na * 2)); naT.setAttribute('transform', `translate(0 ${((1 - clamp(na)) * 14).toFixed(1)})`);
      op(mgT, clamp(mg * 2)); mgT.setAttribute('transform', `translate(0 ${((1 - clamp(mg)) * 14).toFixed(1)})`);
      op(leg1, P(t, mid('big', 0.3), 0.4, linear)); op(leg2, P(t, mid('big', 0.56), 0.4, linear));
      // 3: solute, solvent, solution
      solParts.forEach((els, i) => { const p = P(t, mid('solute', [0.1, 0.5, 0.76][i]), 0.45, linear); els.forEach(e => op(e, p)); });
      // 4: the letters pop in quickly, then each tile lights up as its word is said
      fecd.forEach((f, i) => {
        const p = P(t, mid('fecd', 0.03 + i * 0.08), 0.4, pop);
        op(f.g, clamp(p * 2)); f.g.setAttribute('transform', `translate(0 ${((1 - clamp(p)) * 12).toFixed(1)})`);
        const on = win(t, mid('fecd', [0.42, 0.57, 0.72, 0.87][i]), mid('fecd', [0.42, 0.57, 0.72, 0.87][i]) + 0.7, 0.2);
        f.hl.setAttribute('stroke', on > 0.05 ? C.energy : C.line);
        tr(f.ic, f.x0 + 42, f.y0 + 36, 1 + 0.15 * on);
      });
    }

    // traps
    const ta = P(t, at('traps') - 0.1, 0.5, linear);
    op(traps, ta);
    if (ta > 0) {
      op(head, P(t, at('traps') - 0.1, 0.5, linear));
      op(hint, 1 - P(t, at('t1') - 0.3, 0.3, linear));
      slots.forEach((s, i) => {
        const k = i + 1, tk = at('t' + k), nx = k < 5 ? at('t' + (k + 1)) : 1e6;
        const appear = P(t, mid('traps', 0.15 + i * 0.12), 0.45, pop);
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
        g.st.set(P(t, mid(k, 0.2), 0.5, easeOut));
        const rp = P(t, mid(k, 0.28), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.4), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

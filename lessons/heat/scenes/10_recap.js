/* Recap: a padlock clicks shut -> four memory-hook cards build a 2x2 grid (Joules Jiggle; Cats Can't
   Radiate, whose three mini panels fly in under the C, C and R; Hot Air Lifts; Dark Drinks, Shiny
   Reflects) -> "5 exam traps": each trap shows the wrong idea struck out, the right idea ticked, and a picture. */
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
  /* "Cats Can't Radiate" with each first letter bold yellow */
  const initials = (str, col) => str.split(/(\s+|,\s*)/).filter(Boolean).flatMap(w => (/^[A-Za-z]/.test(w) ? [[w[0], C.energy, 800], [w.slice(1), col]] : [w]));
  const Y = C.energy;
  const BLUE = ball(C.water, C.waterDk), ORANGE = ball(C.heat, C.heatDk);
  /* Infrared radiation, drawn as in the radiation chapter: a tapered wavy arrow from (x1,y1) to (x2,y2).
     r.upd(time, front 0..1): crests travel towards the head; the front grows from the source. */
  function irRay(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const g = G(parent), L = Math.hypot(x2 - x1, y2 - y1);
    tr(g, x1, y1, 1, Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
    const col = o.color || C.heat, wd = o.width || 5, wl = o.wl || 50, amp0 = o.amp || 12, sp = o.speed || 160;
    const hs = o.hs || wd * 3.2;
    const path = E('path', { fill: 'none', stroke: col, 'stroke-width': wd, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const head = E('path', { d: `M0,0 L${-hs},${(-hs * 0.62).toFixed(1)} L${(-hs * 0.72).toFixed(1)},0 L${-hs},${(hs * 0.62).toFixed(1)} Z`, fill: col }, g);
    g.L = L; g.sp = sp;
    g.upd = (t, rv) => {
      rv = rv === undefined ? 1 : clamp(rv);
      const show = rv > 0.004;
      op(path, show ? 1 : 0); op(head, show ? 1 : 0);
      if (!show) return;
      const tip = rv * L, front = Math.max(2, tip - hs * 0.55), ph = t * sp / wl, tp = Math.min(wl * 0.55, front / 2);
      let d = 'M0,0';
      for (let x = 4; x < front + 4; x += 4) {
        const xx = Math.min(x, front), e = Math.min(1, xx / tp, (front - xx) / tp);
        d += 'L' + xx.toFixed(1) + ',' + (-amp0 * e * Math.sin(TAU * (xx / wl - ph))).toFixed(1);
      }
      path.setAttribute('d', d);
      tr(head, tip, 0);
    };
    g.upd(0, 1);
    return g;
  }
  const grow = (t, t0, r) => clamp((t - t0) * r.sp * calm / r.L);
  /* a small infrared arrow, always fully drawn; g.upd(t) */
  function irArrow(parent, x1, y1, x2, y2, o) {
    o = o || {};
    const wl = o.wl || 16, r = irRay(parent, x1, y1, x2, y2, { amp: o.amp || 5, wl, width: o.width || 3.5, speed: 1.6 * wl, color: o.color });
    const u = r.upd; r.upd = t => u(t * calm, 1);
    return r;
  }

  /* ---------- padlock ---------- */
  const lockG = G(root); tr(lockG, 600, 300);
  const shackle = E('path', { d: 'M-52,0 L-52,-50 A52,52 0 0 1 52,-50 L52,0', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 22, 'stroke-linecap': 'round' }, lockG);
  E('rect', { x: -86, y: -8, width: 172, height: 134, rx: 24, fill: ball(C.heat, C.heatDk), stroke: '#FFC9A0', 'stroke-width': 4 }, lockG);
  E('circle', { cx: 0, cy: 42, r: 15, fill: '#4A1E06' }, lockG);
  E('path', { d: 'M-8,48 L8,48 L11,86 L-11,86 Z', fill: '#4A1E06' }, lockG);
  const clickRing = E('circle', { cx: 0, cy: 40, r: 120, fill: 'none', stroke: C.energy, 'stroke-width': 6 }, lockG);
  T(lockG, 0, 220, 'Lock it in', { size: 54, weight: 700, anchor: 'middle' });

  /* ---------- memory hooks: 2x2 cards ---------- */
  const hooks = G(root);
  const CW = 520, CHh = 255;
  function hookCard(x, y) { const g = G(hooks); tr(g, x, y); card(g, 0, 0, CW, CHh, { fill: C.card, stroke: C.line }); return g; }

  // 1. Joules Jiggle, Celsius Counts hotness
  const h1 = hookCard(50, 115);
  const jjSegs = initials('Joules Jiggle, Celsius Counts hotness', C.ink);
  rich(h1, 30, 62, jjSegs, { size: fit(jjSegs, 34, 460), weight: 700 });
  const r1a = G(h1), r1b = G(h1);
  const jChip = chip(r1a, 'J', { size: 28, fill: C.energy, color: C.bg0, w: 52 }); tr(jChip, 56, 130);
  const jig = [[-18, -9], [0, -11], [18, -8], [-9, 9], [10, 10]].map(([dx, dy], k) => ({ el: E('circle', { r: 8, fill: ORANGE }, r1a), x: 124 + dx, y: 130 + dy, ph: k * 1.9 }));
  rich(r1a, 170, 139, ['heat = ', ['thermal energy', C.heat, 800]], { size: 27 });
  const cChip = chip(r1b, '°C', { size: 28, fill: C.card2, stroke: C.water, color: C.water, w: 52 }); tr(cChip, 56, 205);
  const th1 = thermometer(r1b, 56, C.bad); tr(th1, 124, 214, 0.62);
  rich(r1b, 170, 214, ['temperature = ', ['how hot', C.water, 800]], { size: 27 });

  // 2. Cats Can't Radiate: three mini panels fly in under the C, C and R
  const h2 = hookCard(630, 115);
  const WORDX = [95, 260, 425], WORDS = ['Cats', 'Can’t', 'Radiate'];
  const words = WORDS.map((w, i) => { const g = G(h2); tr(g, WORDX[i], 56); rich(g, 0, 0, initials(w, C.ink), { size: 36, weight: 700, anchor: 'middle' }); return g; });
  /* the radiation chapter's three mini panels (heated bar, convection loop, Sun waves), drawn in that
     chapter's coordinates and shrunk into these smaller cards; anim(t, t0) with t0 when the panel lands */
  const MS = 0.46;
  const FLAME = 'M0,0 C-16,-10 -18,-34 0,-60 C18,-34 16,-10 0,0 Z', FLAME_IN = 'M0,0 C-8,-6 -9,-18 0,-32 C9,-18 8,-6 0,0 Z';
  function miniPanel(parent, kind) {
    const g = G(parent);
    card(g, -75, -72, 150, 144, { fill: C.card2, stroke: C.line, rx: 16 });
    const art = G(g);
    let anim = () => {};
    if (kind === 0) {
      art.setAttribute('transform', `translate(0 -17) scale(${MS}) translate(-240 -441)`);
      E('rect', { x: 120, y: 410, width: 240, height: 44, rx: 8, fill: linGrad(C.heat, C.carbonDk, false), stroke: '#B9C6D2', 'stroke-width': 3 }, art);
      const dots = []; for (let i = 0; i < 8; i++) dots.push(E('circle', { r: 9, fill: ball(i < 3 ? '#FFB37A' : C.carbon, i < 3 ? C.heatDk : C.carbonDk) }, art));
      E('path', { d: FLAME, fill: '#FF8A3D', transform: 'translate(150 516)' }, art);
      E('path', { d: FLAME_IN, fill: '#FFE07A', transform: 'translate(150 514)' }, art);
      const ar = arrow(art, 150, 378, 340, 378, { color: C.heat, width: 6 });
      anim = (t, t0) => {
        dots.forEach((d, i) => { const a = Math.max(0.6, 6 - i * 0.7) * calm; attr(d, 'cx', 135 + i * 30 + Math.sin(t * 17 + i) * a); attr(d, 'cy', 432 + Math.cos(t * 21 + i * 1.3) * a * 0.6); });
        ar.set(P(t, t0 + 0.2, 0.8));
      };
    } else if (kind === 1) {
      art.setAttribute('transform', `translate(0 -17) scale(${MS}) translate(-597 -461)`);
      const bk = beaker(art, 180, 150, { level: 0.82, liquid: '#2C7FB0' }); tr(bk, 600, 430);
      E('path', { d: FLAME, fill: '#FF8A3D', transform: 'translate(560 568)' }, art);
      E('path', { d: FLAME_IN, fill: '#FFE07A', transform: 'translate(560 566)' }, art);
      arrow(art, 560, 488, 560, 410, { color: C.bad, width: 5, bend: -10 });
      arrow(art, 640, 410, 640, 488, { color: '#7FD3FF', width: 5, bend: -10 });
      const dots = []; for (let i = 0; i < 6; i++) dots.push(E('circle', { r: 6, fill: C.ink }, art));
      anim = t => dots.forEach((d, i) => {
        const th = (t * 0.9 * calm + i / 6) * TAU, x = 600 + Math.cos(th) * 52, y = 450 + Math.sin(th) * 30;   // up over the flame, down the far side
        attr(d, 'cx', x); attr(d, 'cy', y); d.setAttribute('fill', Math.cos(th) < 0 ? '#FF9A6A' : '#9FE0FF');
      });
    } else {
      art.setAttribute('transform', `translate(0 -17) scale(${MS}) translate(-956 -432)`);
      const s = sun(art, 30); tr(s, 862, 432);
      { const r = rng(8); let d = ''; for (let i = 0; i < 12; i++) d += `M${(918 + r() * 180).toFixed(1)},${(352 + r() * 160).toFixed(1)} l0.1,0 `; E('path', { d, stroke: '#DCEBFF', 'stroke-width': 3.5, 'stroke-linecap': 'round', opacity: 0.6 }, art); }
      const rays = [[910, 400, 1092, 396], [912, 432, 1096, 432], [910, 464, 1092, 468]].map(([a, b, c, d]) => irRay(art, a, b, c, d, { amp: 9, wl: 36, width: 5, speed: 200, hs: 14 }));
      anim = (t, t0) => { s.upd(t * calm); rays.forEach((r, i) => r.upd(t * calm, grow(t, t0 + 0.2 + i * 0.1, r))); };
    }
    const nm = ['conduction', 'convection', 'radiation'][kind];
    rich(g, 0, 56, [[nm[0], Y, 800], [nm.slice(1), C.ink]], { size: 26, anchor: 'middle' });
    return { g, anim };
  }
  const panels = [0, 1, 2].map(k => miniPanel(h2, k));

  // 3. Hot Air Lifts
  const h3 = hookCard(50, 395);
  const halSegs = initials('Hot Air Lifts', C.ink);
  rich(h3, 30, 62, halSegs, { size: 34, weight: 700 });
  const rows3 = [
    ['a heated fluid ', ['expands', C.heat, 800]],
    ['becomes ', ['less dense', C.good, 800], ','],
    ['and ', ['rises', C.heat, 800]],
  ].map((segs, i) => rich(h3, 30, 128 + i * 46, segs, { size: 27 }));
  const mb = G(h3);
  E('ellipse', { cx: 0, cy: -46, rx: 34, ry: 38, fill: 'rgba(255,107,92,0.25)', stroke: '#FF8A7A', 'stroke-width': 3 }, mb);
  const mbGlow = E('ellipse', { cx: 0, cy: -44, rx: 26, ry: 30, fill: glow('#FFB347') }, mb);
  E('path', { d: 'M0,-84 C-15,-66 -16,-30 -8,-12 M0,-84 C15,-66 16,-30 8,-12', fill: 'none', stroke: '#FFC247', 'stroke-width': 2.5 }, mb);
  E('path', { d: 'M-12,-14 L-8,4 M12,-14 L8,4', stroke: '#D9C49A', 'stroke-width': 2 }, mb);
  E('rect', { x: -11, y: 2, width: 22, height: 16, rx: 3, fill: '#A8743F', stroke: '#E0B07A', 'stroke-width': 2 }, mb);
  const mbUp = arrow(h3, 452, 236, 452, 196, { color: C.heat, width: 5 });

  // 4. Dark Drinks, Shiny Reflects
  const h4 = hookCard(630, 395);
  const ddSegs = initials('Dark Drinks, Shiny Reflects', C.ink);
  rich(h4, 30, 62, ddSegs, { size: fit(ddSegs, 34, 460), weight: 700 });
  const r4a = G(h4), r4b = G(h4);
  const darkGlow = E('rect', { x: 26, y: 94, width: 72, height: 72, rx: 10, fill: glow(C.heat) }, r4a);
  E('rect', { x: 36, y: 104, width: 52, height: 52, rx: 6, fill: '#121417', stroke: '#3B4450', 'stroke-width': 2.5 }, r4a);
  const inD = irArrow(r4a, 172, 104, 96, 126);
  rich(r4a, 190, 122, ['dark, matt:'], { size: 27, weight: 700 });
  rich(r4a, 190, 154, [['absorb', C.heat, 800], ' and ', ['emit', C.heat, 800], ' best'], { size: 26 });
  E('rect', { x: 36, y: 184, width: 52, height: 52, rx: 6, fill: linGrad('#FFFFFF', '#9AA8B4', true), stroke: '#E8EEF2', 'stroke-width': 2.5 }, r4b);
  E('path', { d: 'M46,226 L74,192', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, r4b);
  const inS = irArrow(r4b, 172, 186, 96, 204), outS = irArrow(r4b, 98, 216, 172, 236);
  rich(r4b, 190, 204, ['light, shiny:'], { size: 27, weight: 700 });
  rich(r4b, 190, 236, [['reflect', C.air, 800]], { size: 26 });
  const hookCards = [[h1, 'jiggle'], [h2, 'cats'], [h3, 'lifts'], [h4, 'drinks']];

  /* ---------- exam traps ---------- */
  const traps = G(root);
  const head = G(traps);
  E('path', { d: 'M0,-34 L36,30 L-36,30 Z', fill: C.energy, stroke: '#FFF3A6', 'stroke-width': 4, 'stroke-linejoin': 'round', transform: 'translate(88 150)' }, head);
  T(head, 88, 174, '!', { size: 44, weight: 700, fill: C.bg0, anchor: 'middle' });
  T(head, 140, 170, '5 exam traps', { size: 48, weight: 700 });
  const slotNames = ['hot → cold', 'fluids only', 'crosses a vacuum', 'free electrons', 'mass stays same'];
  const slots = slotNames.map((nm, i) => {
    const g = G(traps), y = 252 + i * 84;
    const box = E('rect', { x: 50, y: y - 32, width: 286, height: 64, rx: 32, fill: C.card, stroke: C.line, 'stroke-width': 3 }, g);
    const disc = E('circle', { cx: 86, cy: y, r: 21, fill: C.card2, stroke: C.muted, 'stroke-width': 2 }, g);
    const num = T(g, 86, y + 9, String(i + 1), { size: 26, weight: 700, anchor: 'middle' });
    T(g, 120, y + 9, nm, { size: fit([nm], 25, 205), weight: 600 });
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
  const block = (g, x, w, h, c0, c1, label, lc) => {
    E('rect', { x: x - w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: linGrad(c0, c1, true), stroke: '#FFFFFF', 'stroke-opacity': 0.4, 'stroke-width': 2 }, g);
    T(g, x, 10, label, { size: 28, weight: 700, anchor: 'middle', fill: lc || C.ink });
  };
  const T5 = [
    trapGroup('Heat flows from cold to hot', ['Thermal energy flows ', ['hot → cold', Y, 800]], g => {
      block(g, -250, 120, 76, '#FF8A6A', '#C23B33', 'hot');
      block(g, 250, 120, 76, '#7FD8F5', '#1D84A6', 'cold', C.bg0);
      const good = arrow(g, -172, -16, 172, -16, { color: C.heat, width: 8 });
      const bad = arrow(g, 172, 26, -172, 26, { color: C.faint, width: 5 });
      const tk = tick(g, 13); tr(tk, 0, -46);
      const cx = cross(g, 12); tr(cx, 0, 58);
      const hw = heatWaves(g, { n: 3, h: 30, spacing: 22, color: '#FFB067', width: 4 }); tr(hw, -90, -30);
      return t => { hw.upd(t); good.set(1); bad.set(1); };
    }),
    trapGroup('Convection happens in solids', ['Convection needs a ', ['fluid', Y, 800], ': a liquid or gas'], g => {
      const bk = beaker(g, 110, 104, { level: 0.8 }); tr(bk, -170, -6);
      arrow(g, -192, 26, -192, -22, { color: C.heat, width: 4.5, bend: -9 });
      arrow(g, -148, -22, -148, 26, { color: C.water, width: 4.5, bend: -9 });
      const tk = tick(g, 15); tr(tk, -80, -10);
      E('rect', { x: 96, y: -44, width: 128, height: 80, rx: 8, fill: 'rgba(200,230,250,0.06)', stroke: GLASS.stroke, 'stroke-width': 2.5 }, g);
      const sol = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) sol.push({ el: E('circle', { r: 10, fill: BLUE }, g), x: 112 + c * 24, y: -24 + r * 22, ph: r * 5 + c });
      const cx = cross(g, 15); tr(cx, 270, -6);
      T(g, -170, 76, 'fluid', { size: 26, anchor: 'middle', fill: C.muted });
      T(g, 160, 76, 'solid', { size: 26, anchor: 'middle', fill: C.muted });
      return t => sol.forEach(p => { attr(p.el, 'cx', p.x + 1.6 * calm * Math.sin(t * 19 + p.ph)); attr(p.el, 'cy', p.y + 1.6 * calm * Math.cos(t * 23 + p.ph)); });
    }),
    trapGroup('Radiation needs particles', ['Radiation can cross a ', ['vacuum', Y, 800]], g => {
      const s = sun(g, 22); tr(s, -272, -6);
      E('rect', { x: -170, y: -46, width: 340, height: 80, rx: 12, fill: 'rgba(255,255,255,0.02)', stroke: C.muted, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, g);
      const w = irArrow(g, -222, -6, 236, -6, { amp: 11, wl: 38, width: 5 });
      T(g, 0, 70, 'empty space: no particles', { size: 26, anchor: 'middle', fill: C.muted });
      const tk = tick(g, 15); tr(tk, 284, -8);
      return t => { s.upd(t); w.upd(t); };
    }),
    trapGroup('Metals conduct because they’re shiny', ['Because of their ', ['free electrons', Y, 800]], g => {
      E('rect', { x: -330, y: -26, width: 250, height: 52, rx: 10, fill: linGrad('#B3BEC8', '#5A6672', true), stroke: '#D3DBE2', 'stroke-width': 2.5 }, g);
      for (let k = 0; k < 6; k++) E('circle', { cx: -308 + k * 41, cy: 0, r: 11, fill: k < 2 ? ORANGE : BLUE }, g);
      const er = rng(9), es = [];
      for (let k = 0; k < 6; k++) es.push({ el: E('circle', { r: 4.5, fill: C.air, stroke: '#0A1B27', 'stroke-width': 1.2 }, g), off: er() * 230, y: k % 2 ? 17 : -17 });
      const tk = tick(g, 15); tr(tk, -40, -4);
      const sh = G(g); tr(sh, 150, -10);
      E('path', { d: 'M0,-30 L7,-7 L30,0 L7,7 L0,30 L-7,7 L-30,0 L-7,-7 Z', fill: '#FFFFFF', opacity: 0.9 }, sh);
      E('path', { d: 'M34,-30 L37,-23 L44,-20 L37,-17 L34,-10 L31,-17 L24,-20 L31,-23 Z', fill: '#FFFFFF', opacity: 0.7 }, sh);
      T(g, 150, 62, 'shiny', { size: 26, anchor: 'middle', fill: C.muted });
      const cx = cross(g, 15); tr(cx, 262, -6);
      return t => {
        es.forEach(e => { const u = ((t * 70 * calm + e.off) % 230 + 230) % 230; attr(e.el, 'cx', -320 + u); attr(e.el, 'cy', e.y); });
        tr(sh, 150, -10, 0.9 + 0.1 * wave(t, 1.4));
      };
    }),
    trapGroup('Expanding makes it heavier', [['Volume', Y, 800], ' goes up; ', ['mass', Y, 800], ' stays the same'], g => {
      E('rect', { x: -330, y: -46, width: 180, height: 30, rx: 8, fill: 'none', stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, g);
      const hot = E('rect', { x: -330, y: 0, width: 180, height: 30, rx: 8, fill: linGrad('#FFB07A', '#C25516', true), stroke: '#FFD0B0', 'stroke-width': 2 }, g);
      T(g, -230, 70, 'volume ↑', { size: 26, anchor: 'middle', fill: C.ink });
      const bal_ = G(g); tr(bal_, 160, 0);
      E('path', { d: 'M-10,44 L10,44 L4,-26 L-4,-26 Z M-40,48 L40,48', stroke: '#C9D6DE', 'stroke-width': 4, fill: '#C9D6DE', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, bal_);
      E('path', { d: 'M-90,-28 L90,-28', stroke: '#C9D6DE', 'stroke-width': 6, 'stroke-linecap': 'round' }, bal_);
      E('path', { d: 'M-90,-28 L-112,4 L-68,4 Z M90,-28 L68,4 L112,4 Z', fill: 'none', stroke: '#C9D6DE', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, bal_);
      E('rect', { x: -110, y: -8, width: 40, height: 12, rx: 3, fill: C.muted }, bal_);
      E('rect', { x: 66, y: -8, width: 48, height: 12, rx: 3, fill: C.heat }, bal_);
      E('circle', { cx: 0, cy: -28, r: 6, fill: C.energy }, bal_);
      T(g, 160, 76, 'mass: the same', { size: 26, anchor: 'middle', fill: C.ink });
      return t => attr(hot, 'width', 180 + 46 * P(t, mid('t5', 0.6), 1.2, easeOut));
    }),
  ];

  /* ---------- update ---------- */
  return t => {
    // padlock: the shackle drops shut, a ring pulses
    const la = win(t, S.first - 0.6, at('jiggle') + 0.25, 0.4);
    op(lockG, la);
    if (la > 0) {
      const shut = P(t, mid('lock', 0.45), 0.35, easeIn);
      tr(shackle, 0, -32 * (1 - shut));
      const rp = clamp((t - mid('lock', 0.45) - 0.35) / 0.7);
      op(clickRing, rp > 0 && rp < 1 ? 1 - rp : 0); attr(clickRing, 'r', 90 + rp * 70);
      tr(lockG, 600, 300, 1 - 0.08 * P(t, at('jiggle') - 0.3, 0.5));
    }

    // memory hooks build up, then clear for the traps
    const hookOut = 1 - P(t, at('traps') - 0.2, 0.5, linear);
    op(hooks, hookOut);
    if (hookOut > 0) {
      hookCards.forEach(([g, id], i) => {
        const p = P(t, at(id) - 0.15, 0.55, pop);
        op(g, clamp(p * 2));
        tr(g, i % 2 ? 630 : 50, (i < 2 ? 115 : 395) + (1 - clamp(p)) * 26);
      });
      // 1. jiggle
      op(r1a, P(t, mid('jiggle', 0.3), 0.5, linear)); op(r1b, P(t, mid('jiggle', 0.66), 0.5, linear));
      jig.forEach(q => { attr(q.el, 'cx', q.x + 3.2 * calm * Math.sin(t * 15 + q.ph)); attr(q.el, 'cy', q.y + 3.2 * calm * Math.cos(t * 13 + q.ph)); });
      th1.set(0.25 + 0.5 * P(t, mid('jiggle', 0.7), 1.2, easeOut));
      // 2. cats: words pulse as their panel lands
      panels.forEach((pn, i) => {
        const t0 = mid('cats', 0.3 + i * 0.2), p = P(t, t0, 0.6, pop);
        tr(pn.g, WORDX[i], lerp(70, 160, clamp(p)), Math.max(0.01, lerp(0.15, 1, p)));
        op(pn.g, clamp(p * 3));
        pn.anim(t, t0);
        const pulse = Math.sin(Math.PI * P(t, t0 + 0.55, 0.45, linear));
        tr(words[i], WORDX[i], 56, 1 + 0.16 * pulse);
      });
      // 3. lifts: the balloon rises gently
      rows3.forEach((r, i) => op(r, P(t, mid('lifts', 0.3 + i * 0.2), 0.45, linear)));
      const lift = ((t - at('lifts')) * 0.25 % 1 + 1) % 1;
      tr(mb, 452, 150 - 14 * Math.sin(lift * Math.PI) * calm);
      op(mbGlow, 0.7 + 0.3 * wave(t, 0.8));
      mbUp.set(P(t, mid('lifts', 0.75), 0.5)); op(mbUp, P(t, mid('lifts', 0.75), 0.2, linear));
      // 4. drinks
      op(r4a, P(t, mid('drinks', 0.25), 0.5, linear)); op(r4b, P(t, mid('drinks', 0.65), 0.5, linear));
      inD.upd(t); inS.upd(t); outS.upd(t);
      op(darkGlow, 0.35 + 0.35 * wave(t, 1.3));
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
        g.st.set(P(t, mid(k, 0.3), 0.5, easeOut));
        const rp = P(t, mid(k, 0.38), 0.55, pop); op(g.rg, clamp(rp * 2)); tr(g.rg, (1 - clamp(rp)) * 20, 0);
        const ip = P(t, mid(k, 0.55), 0.55, pop); op(g.ill, clamp(ip * 2)); tr(g.ill, 760, 540, 0.85 + 0.15 * clamp(ip));
        g.anim(t);
      });
    }
  };
});

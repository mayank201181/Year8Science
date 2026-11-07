/* Chapter 6, Acids and metals: the squeaky pop.
   Magnesium fizzes in dilute acid, giving off hydrogen -> acid + metal -> salt + hydrogen, then the chips
   fill in for hydrochloric acid + magnesium -> showpiece: a lit splint at the mouth, POP! -> zoom: hydrogen
   meets oxygen and flashes into water -> the race: magnesium, zinc, iron, copper in the same acid ->
   vigorous, steady, slow, nothing -> the tubes line up on the reactivity series, copper below hydrogen ->
   naming: the metal first, the acid second -> chlorides, sulfates, nitrates -> zinc sulfate, not sulfide. */
scene('metals', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;

  /* ---------- palette (storyboard) ---------- */
  const ACID = '#E8424F', SALT = C.good, INK = '#13222D', CLEAR = '#CFE7F5', WOOD = '#C8A165', EMBER = '#FF6A2A';
  const SW = { Mg: '#E3E8EE', Zn: '#A9B6C4', Fe: '#7A8590', Cu: '#D9824B' };

  /* ---------- shared gas-test art (drawn the same way in the carbonates and oxygen chapters) ---------- */
  /* hydrogen gas: two white H atoms touching */
  function molH2(parent, r, o) {
    r = r || 12; const g = G(parent);
    tr(atom(g, 'H', r, o), -r * 0.72, 0); tr(atom(g, 'H', r, o), r * 0.72, 0);
    return g;
  }
  /* wooden splint, 16 x 220 at k = 1. Its tip is the origin and the stick runs down local +y.
     g.place(x, y, deg): tip at (x, y), stick turned by deg (0 = tip up, 180 = tip down); flame and smoke stay upright.
     g.set(flame, ember, char, smoke): flame size (1 = lit, more = flaring), glowing ember, charred tip, smoke wisp.
     g.upd(t) flickers; call it after g.set. */
  function splint(parent, k) {
    k = k || 1;
    const g = G(parent), stick = G(g), fx = G(g), body = G(stick);
    if (k !== 1) tr(body, 0, 0, k);
    E('rect', { x: -8, y: 0, width: 16, height: 220, rx: 5, fill: WOOD, stroke: '#8E6B3A', 'stroke-width': 2 }, body);
    E('line', { x1: -2, y1: 44, x2: -2, y2: 204, stroke: '#A8834D', 'stroke-width': 2 }, body);
    const charC = E('rect', { x: -8, y: 0, width: 16, height: 26, rx: 5, fill: '#2E241C' }, body);
    const emb = E('rect', { x: -8, y: 0, width: 16, height: 15, rx: 5, fill: EMBER }, body);
    const eHalo = E('circle', { r: 30 * k, fill: glow(EMBER) }, fx);
    const smoke = E('path', { fill: 'none', stroke: '#9AA6B0', 'stroke-width': 5 * k, 'stroke-linecap': 'round' }, fx);
    const fl = G(fx);
    E('ellipse', { cx: 0, cy: -36, rx: 50, ry: 68, fill: glow('#FFB347') }, fl);
    E('path', { d: 'M0,6 C-19,-6 -21,-42 0,-86 C21,-42 19,-6 0,6 Z', fill: '#FF9A3C' }, fl);
    E('path', { d: 'M0,3 C-9,-5 -10,-26 0,-52 C10,-26 9,-5 0,3 Z', fill: '#FFE07A' }, fl);
    let F = 0, Em = 0, Sm = 0;
    g.place = (x, y, deg) => {
      stick.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)})`);
      fx.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    };
    g.set = (flame, ember, ch, sm) => { F = flame; Em = ember; Sm = sm; op(charC, ch); op(emb, ember); op(eHalo, ember * 0.95); op(fl, clamp(flame * 3)); op(smoke, sm * 0.8); };
    g.upd = t => {
      if (F > 0) { const a = 0.06 * calm, b = 0.11 * calm; fl.setAttribute('transform', `scale(${(k * F * (1 + a * Math.sin(t * 9))).toFixed(3)} ${(k * F * (1 + b * Math.sin(t * 13 + 1))).toFixed(3)})`); }
      if (Em > 0) tr(eHalo, 0, 0, 0.75 + 0.35 * Em + 0.12 * wave(t, 0.8) * calm);
      if (Sm > 0) { const pts = []; for (let i = 0; i <= 8; i++) pts.push([Math.sin(i * 0.8 - t * 2.4) * (2 + i * 2.2) * k, (-12 - i * 15) * k]); smoke.setAttribute('d', openPath(pts)); }
    };
    g.set(0, 0, 0, 0); g.place(0, 0, 0);
    return g;
  }
  /* POP: an 8-point burst (energy yellow, heat-orange edge) with "POP!" and short radial lines. g.set(p) springs it in */
  function popBurst(parent, R) {
    R = R || 84;
    const g = G(parent), star = G(g), rays = G(g);
    let d = '';
    for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i * Math.PI / 8, rr = i % 2 ? R * 0.64 : R; d += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
    E('circle', { r: R * 1.45, fill: glow(C.energy) }, star);
    E('path', { d: d + 'Z', fill: C.energy, stroke: C.heat, 'stroke-width': Math.max(3, R * 0.06), 'stroke-linejoin': 'round' }, star);
    T(star, 0, R * 0.19, 'POP!', { size: Math.round(R * 0.52), weight: 700, anchor: 'middle', fill: '#6B2A00' });
    const rl = [];
    for (let i = 0; i < 8; i++) rl.push({ el: E('line', { stroke: C.energy, 'stroke-width': Math.max(3, R * 0.07), 'stroke-linecap': 'round' }, rays), a: -Math.PI / 2 + Math.PI / 8 + i * Math.PI / 4 });
    g.set = p => {
      p = clamp(p);
      tr(star, 0, 0, Math.max(0.01, pop(p))); op(star, clamp(p * 4));
      rl.forEach(o => {
        const r1 = R * (1.08 + 0.22 * p), r2 = R * (1.2 + 0.42 * p), c = Math.cos(o.a), s = Math.sin(o.a);
        attr(o.el, 'x1', c * r1); attr(o.el, 'y1', s * r1); attr(o.el, 'x2', c * r2); attr(o.el, 'y2', s * r2);
      });
      op(rays, clamp(p * 4) * (1 - 0.55 * clamp((p - 0.5) / 0.5)));
    };
    g.set(0);
    return g;
  }

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* chemical formula with real subscripts: 'H2SO4' -> H₂SO₄ (digits after a letter drop and shrink) */
  function chem(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 30, sub = Math.round(size * 0.66), dy = Math.round(size * 0.24);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': FD }, parent);
    let low = false;
    str.replace(/(\d+)|([^\d]+)/g, (m, dig, txt, idx) => {
      const isSub = !!dig && idx > 0 && /[A-Za-z)]/.test(str[idx - 1]);
      const ts = E('tspan', {}, t); ts.textContent = m;
      if (isSub) { ts.setAttribute('font-size', sub); if (!low) { ts.setAttribute('dy', dy); low = true; } }
      else if (low) { ts.setAttribute('dy', -dy); low = false; }
      return m;
    });
    return t;
  }
  /* wooden test-tube rack: the back (posts, shelf) goes behind the tubes, the front (top rail) in front */
  function rackBack(parent, x0, x1, yTop, yBot) {
    const g = G(parent);
    E('rect', { x: x0, y: yTop - 6, width: 16, height: yBot - yTop + 6, rx: 4, fill: '#7A5236' }, g);
    E('rect', { x: x1 - 16, y: yTop - 6, width: 16, height: yBot - yTop + 6, rx: 4, fill: '#7A5236' }, g);
    E('rect', { x: x0 - 12, y: yBot, width: x1 - x0 + 24, height: 18, rx: 5, fill: '#A87449', stroke: '#6E4A2E', 'stroke-width': 2 }, g);
    return g;
  }
  function rackFront(parent, x0, x1, yTop) {
    const g = G(parent);
    E('rect', { x: x0 - 12, y: yTop, width: x1 - x0 + 24, height: 18, rx: 5, fill: '#B98252', stroke: '#6E4A2E', 'stroke-width': 2 }, g);
    return g;
  }
  /* a layer inside a kit test tube: in front of the liquid, behind the glass */
  function inside(tb) { const g = E('g', {}); tb.insertBefore(g, tb.childNodes[3]); return g; }
  /* metal swatches, drawn around their own centre */
  function mgRibbon(parent) {
    const g = G(parent), pts = [[-26, 8], [-15, -9], [0, 4], [-9, 15], [9, 13], [20, -6], [28, 5]];
    E('path', { d: openPath(pts), fill: 'none', stroke: '#8D98A5', 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    E('path', { d: openPath(pts), fill: 'none', stroke: SW.Mg, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function znGranules(parent) {
    const g = G(parent);
    [[-15, 5, 9], [-1, -4, 10], [14, 5, 8.5], [3, 10, 7]].forEach(([x, y, r], i) => E('path', { d: closedPath(blobPts(r, r * 0.82, 7, 0, 0.2, 30 + i)), transform: `translate(${x} ${y})`, fill: ball(SW.Zn, '#6F7D8B'), stroke: '#5F6B78', 'stroke-width': 1.5 }, g));
    return g;
  }
  function feNail(parent) {
    const g = G(parent);
    E('path', { d: 'M-24,-3.5 L16,-3.5 L27,0 L16,3.5 L-24,3.5 Z', fill: SW.Fe, stroke: '#4E5762', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -29, y: -9, width: 6, height: 18, rx: 2, fill: SW.Fe, stroke: '#4E5762', 'stroke-width': 1.5 }, g);
    return g;
  }
  function cuStrip(parent) {
    const g = G(parent);
    E('rect', { x: -7, y: -23, width: 14, height: 46, rx: 2, fill: linGrad('#ECA570', '#B0602F'), stroke: '#7A3E1C', 'stroke-width': 1.5 }, g);
    return g;
  }
  /* equation slot: a chip with a general word that fills in with a specific one.
     g.set(p, labA): p 0 = the general word; 1 = the specific word in a wider chip, the general word a small label above.
     g.width(p) is its width. o.split = [first, second] draws the specific words separately, for the naming beat (g.split). */
  function slot(parent, gen, spec, fill, ink, o) {
    o = o || {};
    const g = G(parent), H = 52, same = gen === spec;
    const wG = Math.ceil(textWidth(gen, 30, FD, 700) + 42), wS = same ? wG : Math.ceil(textWidth(spec, 28, FD, 700) + 38);
    const box = E('rect', { y: -H / 2, height: H, rx: H / 2, fill, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 2 }, g);
    const tG = T(g, 0, 10.5, gen, { size: 30, weight: 700, anchor: 'middle', fill: ink });
    let tS = null, lab = null;
    if (!same) {
      lab = T(g, 0, -H / 2 - 14, gen, { size: 26, weight: 600, anchor: 'middle', fill: o.labFill || fill });
      if (o.split) {
        tS = G(g);
        const Wd = textWidth(spec, 28, FD, 700), w1 = textWidth(o.split[0], 28, FD, 700), w2 = textWidth(o.split[1], 28, FD, 700);
        const xs = -Wd / 2 + w1 + (Wd - w1 - w2) / 2, r = H / 2;
        g.halves = [
          E('path', { d: `M${xs},${-r} L${-wS / 2 + r},${-r} A${r},${r} 0 0 0 ${-wS / 2 + r},${r} L${xs},${r} Z`, fill: o.split[2] }, g),
          E('path', { d: `M${xs},${-r} L${wS / 2 - r},${-r} A${r},${r} 0 0 1 ${wS / 2 - r},${r} L${xs},${r} Z`, fill: o.split[3] }, g),
        ];
        T(tS, -Wd / 2, 10, o.split[0], { size: 28, weight: 700, fill: ink });
        T(tS, Wd / 2, 10, o.split[1], { size: 28, weight: 700, fill: ink, anchor: 'end' });
        g.white = T(g, Wd / 2, 10, o.split[1], { size: 28, weight: 700, fill: '#FFFFFF', anchor: 'end' });
        g.xL = (-wS / 2 + xs) / 2; g.xR = (xs + wS / 2) / 2;
        g.halves.forEach(h => g.insertBefore(h, tS));
        g.split = (a, b) => { op(g.halves[0], a); op(g.halves[1], b); op(g.white, b); };
        g.split(0, 0);
      } else tS = T(g, 0, 10, spec, { size: 28, weight: 700, anchor: 'middle', fill: ink });
    }
    g.wG = wG; g.wS = wS;
    g.width = p => lerp(wG, wS, clamp(p));
    g.set = (p, labA) => {
      p = clamp(p); const w = g.width(p);
      attr(box, 'x', -w / 2); attr(box, 'width', w);
      if (same) return;
      op(tG, 1 - clamp(p * 2.5)); op(tS, clamp((p - 0.3) / 0.5));
      op(lab, clamp((p - 0.35) / 0.5) * (labA === undefined ? 1 : labA)); tr(lab, 0, (1 - p) * 30);
    };
    g.set(0);
    return g;
  }
  function opPlus(parent) { const g = G(parent); T(g, 0, 13, '+', { size: 38, weight: 600, anchor: 'middle', fill: C.muted }); g.w = 24; return g; }
  function opArrow(parent) { const g = G(parent); arrow(g, -25, 0, 25, 0, { color: C.ink, width: 6 }); g.w = 54; return g; }
  /* lay out widths ws in a row centred on cx; returns centres */
  function rowX(ws, cx, gap) { let x = cx - (ws.reduce((a, b) => a + b, 0) + gap * (ws.length - 1)) / 2; return ws.map(w => { const c = x + w / 2; x += w + gap; return c; }); }
  /* magnifier: dashed callout lines from (sx, sy) to a circle at (cx, cy); content goes in .inner (stage coords, clipped) */
  function zoomBubble(parent, cx, cy, r, sx, sy, id) {
    const g = G(parent);
    const a = Math.atan2(cy - sy, cx - sx), b = Math.acos(r / Math.hypot(cx - sx, cy - sy)), back = a + Math.PI;
    const p1 = [cx + r * Math.cos(back + b), cy + r * Math.sin(back + b)], p2 = [cx + r * Math.cos(back - b), cy + r * Math.sin(back - b)];
    E('path', { d: `M${sx},${sy} L${p1[0].toFixed(1)},${p1[1].toFixed(1)} M${sx},${sy} L${p2[0].toFixed(1)},${p2[1].toFixed(1)}`, stroke: C.muted, 'stroke-width': 2.5, 'stroke-dasharray': '8 7', fill: 'none' }, g);
    E('circle', { cx: sx, cy: sy, r: 24, fill: 'none', stroke: C.muted, 'stroke-width': 3 }, g);
    E('circle', { cx, cy, r, fill: '#0B2230', stroke: '#CFE7F5', 'stroke-width': 5 }, g);
    const cp = E('clipPath', { id }, defs()); E('circle', { cx, cy, r: r - 3 }, cp);
    return { g, inner: G(g, { 'clip-path': `url(#${id})` }) };
  }
  function clock(parent, r) {
    const g = G(parent);
    E('circle', { r, fill: C.card, stroke: C.muted, 'stroke-width': 4 }, g);
    let d = ''; for (let i = 0; i < 12; i++) { const a = i * TAU / 12; d += `M${(Math.cos(a) * r * 0.78).toFixed(1)},${(Math.sin(a) * r * 0.78).toFixed(1)} L${(Math.cos(a) * r * 0.9).toFixed(1)},${(Math.sin(a) * r * 0.9).toFixed(1)} `; }
    E('path', { d, stroke: C.muted, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    g.hr = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.45, stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    g.mn = E('line', { x1: 0, y1: 0, x2: 0, y2: -r * 0.72, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    E('circle', { r: 5, fill: C.energy }, g);
    g.set = deg => { g.mn.setAttribute('transform', `rotate(${(deg % 360).toFixed(1)})`); g.hr.setAttribute('transform', `rotate(${((deg / 12) % 360).toFixed(1)})`); };
    g.set(0);
    return g;
  }

  /* ================= A. one tube: magnesium fizzes; the splint test; the zoom ================= */
  const A = G(root);
  const AX = 280, AY = 470, AW = 92, AH = 340, MY = AY - AH / 2;          // mouth at (280, 300)
  rackBack(A, 200, 360, 330, AY + AH / 2);
  const tubeA = G(A); tr(tubeA, AX, AY);
  const tbA = testTube(tubeA, AW, AH, { level: 0.5, liquid: CLEAR, opacity: 0.3 });
  const inA = inside(tbA);
  const bubA = bubbles(inA, -34, 12, 68, 122, { n: 20, r: 6.5, speed: 0.9, seed: 61 });
  const ribA = G(inA); mgRibbon(ribA);
  rackFront(A, 200, 360, 330);
  const h2A = G(A), h2s = [];
  for (let k = 0; k < 6; k++) h2s.push({ m: molH2(h2A, 11), ph: k / 6, sw: (k % 2 ? 1 : -1) * (6 + k * 2) });
  const lbMg = labelLine(A, 400, 620, AX + 30, 612, 'magnesium', { size: 30, anchor: 'start', fill: SW.Mg });
  const lbAcid = labelLine(A, 400, 534, AX + 34, 528, 'dilute acid', { size: 30, anchor: 'start' });
  const lbH2 = labelLine(A, 400, 268, AX + 18, 262, 'hydrogen gas', { size: 32, anchor: 'start', fill: '#FFFFFF' });
  lbMg.set(0); lbAcid.set(0); lbH2.set(0);
  // the lit splint and the POP
  const flashA = E('circle', { cx: AX + 10, cy: MY - 30, r: 170, fill: glow('#FFF6C8') }, A);
  const spA = splint(A);
  const popA = popBurst(A, 84); tr(popA, AX - 8, MY - 46);
  const squeak = G(A), sq = sineWave(squeak, { w: 120, amp: 9, wl: 30, color: C.energy, width: 5 }); tr(squeak, 52, 250, 1, -14);
  // zoom on the mouth: hydrogen meets oxygen and flashes into water
  const ZX = 800, ZY = 372, ZR = 190;
  const zoom = zoomBubble(A, ZX, ZY, ZR, AX, MY - 16, 'am-metals-zoom');
  const zr = G(zoom.inner); tr(zr, ZX, ZY);
  // 2 H₂ + O₂ -> 2 H₂O, in lib's water geometry (H at ∓0.98 r, 0.72 r from O; H radius 0.62 r)
  const OR = 32, HR = 20, HO = [OR * 0.98, OR * 0.72], HH = HR * 0.72;
  const W1 = [-70, 0], W2 = [78, 24];
  const MOL = { a: { s: [-140, 60], n: [-90, 36] }, b: { s: [-50, 140], n: [-14, 92] }, o: { s: [95, -95], n: [50, -50] } };
  const ZAT = [   // molecule, offset from its centre, final place in a water molecule; H first so O sits on top
    ['H', 'a', -HH, [W1[0] - HO[0], W1[1] + HO[1]]], ['H', 'a', HH, [W1[0] + HO[0], W1[1] + HO[1]]],
    ['H', 'b', -HH, [W2[0] - HO[0], W2[1] + HO[1]]], ['H', 'b', HH, [W2[0] + HO[0], W2[1] + HO[1]]],
    ['O', 'o', -OR * 0.72, W1], ['O', 'o', OR * 0.72, W2],
  ].map(([k, m, dx, f]) => ({ el: atom(zr, k, k === 'O' ? OR : HR, { letter: true }), m: MOL[m], dx, f }));
  const zFlash = E('circle', { cx: 4, cy: 20, r: 120, fill: glow('#FFF3A0') }, zr);
  const zSpark = spark(zr, 26, { seed: 4 }); tr(zSpark, 4, 20);
  const tags = [['a', 0, -36], ['b', 62, 11], ['o', 0, 64]].map(([m, dx, dy]) => ({ el: chem(zr, 0, 0, m === 'o' ? 'O2' : 'H2', { size: 30, fill: m === 'o' ? '#FF9A8F' : '#FFFFFF' }), m: MOL[m], dx, dy }));
  const tagW = chem(zr, 4, 112, 'H2O', { size: 32, fill: C.water });
  const zLab = T(zoom.g, ZX, 630, 'a tiny amount, burning explosively', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });
  const zNote = rich(zoom.g, ZX, 672, [['hydrogen', '#FFFFFF'], [' + ', C.muted], ['oxygen', '#FF9A8F'], [' → ', C.muted], ['water', C.water]], { size: 28, anchor: 'middle' });
  op(zoom.g, 0);

  /* ================= B. the race, then the tubes line up on the reactivity series ================= */
  const B = G(root);
  const TX = [315, 505, 695, 885], TY = 425, RW = 78, RH = 280;
  const ROWS = [180, 314, 448, 628], HROW = 537, LX = 345, QX = 470, QS = 0.46;
  const MET = [
    { s: 'Mg', name: 'magnesium', art: mgRibbon, n: 26, r: 6, sp: 1.15, ramp: 0.9, res: 'vigorous', rc: C.energy, rot: -8 },
    { s: 'Zn', name: 'zinc', art: znGranules, n: 12, r: 5.5, sp: 0.55, ramp: 1.4, res: 'steady', rc: C.good, rot: 0 },
    { s: 'Fe', name: 'iron', art: feNail, n: 5, r: 5, sp: 0.24, ramp: 2.2, res: 'slow', rc: '#C9D6DE', rot: -24 },
    { s: 'Cu', name: 'copper', art: cuStrip, n: 0, res: 'no reaction', rc: C.bad, rot: 22 },
  ];
  const spots = TX.map(x => E('ellipse', { cx: x, cy: TY + 20, rx: 125, ry: 230, fill: glow('#FFE45C') }, B));
  const rackB = rackBack(B, 215, 985, 318, TY + RH / 2);
  MET.forEach((m, i) => {
    m.g = G(B); tr(m.g, TX[i], TY);
    m.tb = testTube(m.g, RW, RH, { level: 0.5, liquid: CLEAR, opacity: 0.3 });
    m.inn = inside(m.tb);
    if (m.n) m.bub = bubbles(m.inn, -27, 10, 54, 100, { n: m.n, r: m.r, speed: m.sp, seed: 70 + i });
    m.piece = G(m.inn); m.art(m.piece);
  });
  const froth = []; for (let k = 0; k < 7; k++) froth.push(E('circle', { r: 3.5 + (k % 3) * 1.6, fill: 'rgba(255,255,255,0.22)', stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 1.5 }, MET[0].inn));
  const rackBF = rackFront(B, 215, 985, 318);
  // the ladder: rails, the dashed hydrogen rung, the hydrogen line
  const rails = [-50, 50].map(dx => E('line', { x1: LX + dx, y1: 136, x2: LX + dx, y2: 676, stroke: C.faint, 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, B));
  const hLine = E('line', { x1: 290, y1: HROW, x2: 1150, y2: HROW, stroke: C.air, 'stroke-width': 3, 'stroke-dasharray': '10 8' }, B);
  const hLineLbl = T(B, 1150, HROW - 14, 'hydrogen', { size: 26, weight: 600, anchor: 'end', fill: C.air });
  const hRung = G(B);
  const hHalo = E('ellipse', { rx: 90, ry: 40, fill: glow(C.air) }, hRung);
  E('rect', { x: -50, y: -18, width: 100, height: 36, rx: 10, fill: '#123447', stroke: C.air, 'stroke-width': 2.5, 'stroke-dasharray': '7 6' }, hRung);
  T(hRung, 0, 10, '(H)', { size: 28, weight: 700, anchor: 'middle', fill: C.air });
  // label chips under the tubes (they become the ladder's rungs), names, results
  MET.forEach((m, i) => {
    m.chip = G(B);
    E('rect', { x: -50, y: -18, width: 100, height: 36, rx: 10, fill: SW[m.s], stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1.5 }, m.chip);
    T(m.chip, 0, 10, m.s, { size: 28, weight: 700, anchor: 'middle', fill: m.s === 'Fe' ? '#FFFFFF' : INK });
    m.nameT = T(B, TX[i], 676, m.name, { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
    m.resC = chip(B, m.res, { size: 26, fill: C.card2, stroke: m.rc, sw: 2.5 });
  });
  const clk = clock(B, 34); tr(clk, 1062, 430);
  const serTitle = chip(B, 'the reactivity series', { size: 30, fill: C.card2, stroke: C.energy, color: C.energy, sw: 2.5 }); tr(serTitle, 935, 178);
  const upArrow = arrow(B, 742, 640, 742, 160, { color: C.energy, width: 7 });
  const upLbl = G(B);
  T(upLbl, 776, 300, 'more reactive', { size: 34, weight: 700, fill: C.energy });
  T(upLbl, 776, 346, '= faster fizz', { size: 32, weight: 600 });
  const cuNote = G(B);
  T(cuNote, 776, 606, 'copper is **below** hydrogen,', { size: 28, weight: 500, boldFill: C.air });
  T(cuNote, 776, 644, 'so it doesn’t react', { size: 28, weight: 500 });

  /* ================= the equation: pattern, filled in; reused for naming ================= */
  const EQY = 175;
  const eqG = G(root);
  const s0 = slot(eqG, 'acid', 'hydrochloric acid', ACID, '#FFFFFF', { labFill: '#FF7A86' });
  const s1 = slot(eqG, 'metal', 'magnesium', SW.Mg, INK);
  const s2 = slot(eqG, 'salt', 'magnesium chloride', SALT, INK, { split: ['magnesium', 'chloride', SW.Mg, ACID] });
  const s3 = slot(eqG, 'hydrogen', 'hydrogen', C.hydrogen, INK);
  const EQI = [
    { g: s0, s: s0, at: 0.27 }, { g: opPlus(eqG), at: 0.39 }, { g: s1, s: s1, at: 0.45 }, { g: opArrow(eqG), at: 0.58 },
    { g: s2, s: s2, at: 0.65 }, { g: opPlus(eqG), at: 0.76 }, { g: s3, s: s3, at: 0.81 },
  ];
  const xFull = rowX(EQI.map(it => it.s ? it.s.wS : it.g.w), 600, 14);
  // naming: the salt's halves light up, with arrows from the metal and from the acid
  const nameG = G(eqG);
  const xM = xFull[2], xH = xFull[0], xSL = xFull[4] + s2.xL, xSR = xFull[4] + s2.xR;
  const arTop = arrow(nameG, xM, EQY - 32, xSL - 6, EQY - 34, { color: SW.Mg, width: 5, bend: -120 });
  const arBot = arrow(nameG, xH, EQY + 32, xSR, EQY + 34, { color: '#FF6B76', width: 5, bend: 190 });
  const lbTop = rich(nameG, (xM + xSL) / 2, EQY - 120, [['first part', SW.Mg, 700], [': from the metal', C.ink]], { size: 30, anchor: 'middle' });
  const lbBot = rich(nameG, (xH + xSR) / 2 + 40, EQY + 170, [['second part', '#FF7A86', 700], [': from the acid', C.ink]], { size: 30, anchor: 'middle' });

  /* ================= acids and their salts ================= */
  const Tb = G(root);
  const TROWS = [
    { acid: 'hydrochloric acid', f: 'HCl', salt: 'chlorides' },
    { acid: 'sulfuric acid', f: 'H2SO4', salt: 'sulfates' },
    { acid: 'nitric acid', f: 'HNO3', salt: 'nitrates' },
  ];
  const TY0 = 270, TP = 110;
  {
    const aw = Math.max(...TROWS.map(r => textWidth(r.acid, 28, FD, 700))) + 38, fw = 120, sw = Math.max(...TROWS.map(r => textWidth(r.salt, 28, FD, 700))) + 38;
    const tot = aw + 30 + fw + 20 + 70 + 24 + sw, x0 = 600 - tot / 2;
    TROWS.forEach((r, i) => {
      const y = TY0 + i * TP;
      r.g = G(Tb);
      r.hi = E('rect', { x: x0 - 22, y: y - 44, width: tot + 44, height: 88, rx: 26, fill: 'rgba(255,228,92,0.10)', stroke: C.energy, 'stroke-width': 3 }, r.g);
      r.ac = chip(r.g, r.acid, { size: 28, fill: ACID, color: '#FFFFFF' }); tr(r.ac, x0 + r.ac.w / 2, y);
      r.fm = chem(r.g, x0 + aw + 30 + fw / 2, y + 12, r.f, { size: 34, fill: '#FFFFFF' });
      r.ar = arrow(r.g, x0 + aw + 30 + fw + 20, y, x0 + aw + 30 + fw + 90, y, { color: C.ink, width: 6 });
      r.sc = chip(r.g, r.salt, { size: 28, fill: SALT, color: INK }); r.scX = x0 + aw + 30 + fw + 114 + r.sc.w / 2; r.y = y;
    });
  }

  /* ================= zinc + sulfuric acid ================= */
  const Zg = G(root);
  const ZQY = 440;
  const zItems = [
    chip(Zg, 'zinc', { size: 28, fill: SW.Zn, color: INK }), opPlus(Zg), chip(Zg, 'sulfuric acid', { size: 28, fill: ACID, color: '#FFFFFF' }), opArrow(Zg),
    chip(Zg, 'zinc sulfate', { size: 28, fill: SALT, color: INK }), opPlus(Zg), chip(Zg, 'hydrogen', { size: 28, fill: C.hydrogen, color: INK }),
  ];
  const zX = rowX(zItems.map(g => g.w), 600, 16);
  const zAt = [0.03, 0.11, 0.15, 0.26, 0.3, 0.42, 0.46];
  const sfW = textWidth('sulfate', 28, FD, 700), zsW = textWidth('zinc sulfate', 28, FD, 700);
  const under = E('line', { x1: zX[4] + zsW / 2 - sfW, y1: ZQY + 17, x2: zX[4] + zsW / 2, y2: ZQY + 17, stroke: INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, Zg);
  const okC = G(Zg); { const c = chip(okC, 'sulfate', { size: 32, fill: '#123A2C', stroke: C.good, color: C.good, sw: 3 }); const tk = tick(okC, 16); tr(tk, c.w / 2 + 34, 0); }
  const noC = G(Zg); const noChip = chip(noC, 'sulfide', { size: 32, fill: '#3A1820', stroke: C.bad, color: '#FFB3BB', sw: 3 });
  const noStrike = strike(noC, -noChip.w / 2 + 14, 0, noChip.w / 2 - 14, C.bad);
  const noX = cross(noC, 15); tr(noX, noChip.w / 2 + 34, 0);
  tr(okC, 420, 592); tr(noC, 760, 592);

  /* ================= update ================= */
  return t => {
    /* ---------- A: one tube ---------- */
    const aA = Math.min(P(t, S.first - 0.1, 0.3, linear), 1 - P(t, at('race') - 0.55, 0.4, linear));
    op(A, aA);
    if (aA > 0) {
      const dropAt = mid('fizz', 0.1), fall = P(t, dropAt, 0.85, easeIn);
      const bob = fall >= 1 ? Math.sin(t * 5) * 1.5 * calm : 0;
      tr(ribA, 0, lerp(-AH / 2 - 92, AH / 2 - 30, fall) + bob, 1, lerp(-24, 6, fall));
      op(ribA, P(t, at('fizz'), 0.3, linear));
      bubA.upd(t, P(t, dropAt + 0.8, 0.7, linear));
      // hydrogen molecules drift up out of the mouth
      const hT = mid('fizz', 0.48), hOn = P(t, hT, 0.6, linear) * (1 - P(t, at('why') - 0.4, 0.4, linear));
      h2s.forEach((o, k) => {
        if (hOn <= 0) { op(o.m, 0); return; }
        const u = (((t - hT) / 2.6 + o.ph) % 1 + 1) % 1;
        tr(o.m, AX + Math.sin(u * 4 + k) * (5 + 8 * u) * calm + o.sw * u, lerp(AY - 14, 246, u), 0.85 + 0.25 * u, (u * 140 + k * 40) % 360);
        op(o.m, hOn * Math.min(1, u * 8, (1 - u) * 5));
      });
      const lOff = 1 - P(t, at('test') - 0.1, 0.4, linear);
      lbMg.set(P(t, mid('fizz', 0.27), 0.4, linear) * lOff);
      lbAcid.set(P(t, mid('fizz', 0.35), 0.4, linear) * lOff);
      lbH2.set(P(t, mid('fizz', 0.6), 0.4, linear) * lOff);

      // the lit splint comes to the mouth; POP!
      const sIn = P(t, mid('test', 0.18), 1.7, ease), sOut = P(t, at('why') - 0.3, 0.5, easeIn);
      const sA = P(t, mid('test', 0.14), 0.3, linear) * (1 - sOut);
      op(spA, sA);
      if (sA > 0) {
        spA.place(lerp(690, AX + 28, sIn) + sOut * 220, lerp(150, MY - 8, sIn) - sOut * 50, lerp(-112, -126, sIn));
        spA.set(1, 0, 1, 0); spA.upd(t);
      }
      const tPop = mid('test', 0.8), pOff = P(t, at('why') - 0.35, 0.4, linear);
      popA.set(P(t, tPop, 0.55, linear)); op(popA, 1 - pOff);
      op(flashA, Math.sin(Math.PI * P(t, tPop - 0.05, 0.4, linear)) * 0.95);
      const sqA = P(t, tPop + 0.1, 0.25, linear) * (1 - pOff);
      op(squeak, sqA); if (sqA > 0) sq.set({ phase: t * 2.6 * calm, amp: 9 + 3 * Math.sin(t * 7) * calm });

      // zoom: two hydrogen molecules and one oxygen molecule flash into two water molecules
      const zA = P(t, at('why') - 0.3, 0.45, linear);
      op(zoom.g, zA);
      if (zA > 0) {
        const n0 = at('why') + 0.1, n1 = mid('why', 0.36);
        const near = P(t, n0, n1 - n0, easeOut), q = P(t, mid('why', 0.4), 0.75, ease);
        const cen = m => [lerp(m.s[0], m.n[0], near), lerp(m.s[1], m.n[1], near)];
        ZAT.forEach((a, i) => {
          const c = cen(a.m), jig = q >= 1 ? Math.sin(t * 2.2 + i) * 1.5 * calm : 0;
          tr(a.el, lerp(c[0] + a.dx, a.f[0], q) + jig, lerp(c[1], a.f[1], q));
        });
        const fl = Math.sin(Math.PI * P(t, mid('why', 0.34), 0.6, linear));
        op(zFlash, fl); op(zSpark, fl); tr(zSpark, 4, 20, 0.6 + 1.2 * fl); zSpark.upd(t);
        const tagA = P(t, at('why') - 0.25, 0.3, linear) * (1 - P(t, lerp(n0, n1, 0.6), 0.35, linear));
        tags.forEach(g => { const c = cen(g.m); op(g.el, tagA); tr(g.el, c[0] + g.dx, c[1] + g.dy); });
        op(tagW, P(t, mid('why', 0.62), 0.35, linear));
        op(zLab, P(t, mid('why', 0.18), 0.4, linear)); op(zNote, P(t, mid('why', 0.66), 0.4, linear));
      }
    }

    /* ---------- the equation ---------- */
    const naming = t > at('naming') - 0.6;
    const eA = naming ? win(t, at('naming') - 0.15, at('acids') + 0.15, 0.4) : win(t, at('eq') - 0.05, at('test') + 0.2, 0.35);
    op(eqG, eA);
    if (eA > 0) {
      tr(eqG, 0, naming ? 150 : 0);
      const ps = [P(t, mid('example', 0.14), 0.6), 0, P(t, mid('example', 0.38), 0.6), 0, P(t, mid('example', 0.57), 0.6), 0, 0];
      const labA = naming ? 0 : 1;
      const xs = rowX(EQI.map((it, i) => (it.s ? it.s.width(ps[i]) : it.g.w)), 600, 14);
      EQI.forEach((it, i) => {
        const a = P(t, mid('eq', it.at), 0.45, pop);
        let s = 0.6 + 0.4 * a;
        if (it.s === s3) s += 0.1 * Math.sin(Math.PI * P(t, mid('example', 0.86), 0.5, linear));
        tr(it.g, xs[i], EQY, s); op(it.g, clamp(a * 2));
        if (it.s) it.s.set(ps[i], labA);
      });
      const nA = naming ? 1 : 0;
      op(nameG, nA);
      const tl = P(t, mid('naming', 0.16), 0.5, linear), tr2 = P(t, mid('naming', 0.58), 0.5, linear);
      s2.split(tl * nA, tr2 * nA);
      if (nA) {
        arTop.set(P(t, mid('naming', 0.18), 0.7)); arBot.set(P(t, mid('naming', 0.6), 0.8));
        op(lbTop, P(t, mid('naming', 0.24), 0.4, linear)); op(lbBot, P(t, mid('naming', 0.66), 0.4, linear));
      }
    }

    /* ---------- B: the race and the series ---------- */
    const aB = Math.min(P(t, at('race') - 0.15, 0.4, linear), 1 - P(t, at('naming') - 0.4, 0.45, linear));
    op(B, aB);
    if (aB > 0) {
      const named = [0.24, 0.36, 0.46, 0.57].map(f => mid('race', f));
      const drop = mid('race', 0.8), land = drop + 0.75;
      const hl = [['mg', 'zn'], ['zn', 'fe'], ['fe', 'cu'], ['cu', 'series']].map(([a, b]) => win(t, at(a) - 0.15, at(b) - 0.1, 0.3));
      const hlMax = Math.max(hl[0], hl[1], hl[2], hl[3]);
      const resAt = [mid('mg', 0.36), mid('zn', 0.32), mid('fe', 0.3), mid('cu', 0.42)];
      const rk = 1 - P(t, at('series'), 0.5, linear);
      op(rackB, rk); op(rackBF, rk);
      MET.forEach((m, i) => {
        const fly = P(t, at('series') + 0.1 + i * 0.14, 1.3, ease);
        tr(m.g, lerp(TX[i], QX, fly), lerp(TY, ROWS[i], fly), lerp(1, QS, fly));
        op(m.g, 1 - 0.55 * clamp(hlMax - hl[i]));
        op(spots[i], hl[i] * 0.3);
        // the metal hovers above its tube as it is named, then all four drop in together
        const ap = P(t, named[i], 0.45, pop), fall = P(t, drop, 0.75, easeIn);
        const rate = P(t, land + 0.1, m.ramp || 1, linear);
        const jig = i === 0 ? Math.sin(t * 11) * 2.2 * rate * calm : 0;
        tr(m.piece, jig, lerp(-RH / 2 - 64, RH / 2 - 27, fall), Math.max(0.01, ap * lerp(1.3, 1, fall)), m.rot * fall);
        op(m.piece, clamp(ap * 2));
        if (m.bub) m.bub.upd(t, rate);
        // label chip -> rung; name; result chip
        const lit = 0.35 + 0.65 * P(t, named[i], 0.3, linear);
        tr(m.chip, lerp(TX[i], LX, fly), lerp(626, ROWS[i], fly));
        op(m.chip, Math.max(lit, fly));
        op(m.nameT, lit * (1 - P(t, at('series'), 0.4, linear)));
        const rp = P(t, resAt[i], 0.45, pop);
        tr(m.resC, lerp(TX[i], 514 + m.resC.w / 2, fly), lerp(242, ROWS[i], fly), 0.7 + 0.3 * rp);
        op(m.resC, clamp(rp * 2));
      });
      // magnesium froths at the surface
      const fr = P(t, land + 0.1, 0.9, linear);
      froth.forEach((f, k) => { attr(f, 'cx', -26 + k * 8.5 + Math.sin(t * 6 + k) * 2 * calm); attr(f, 'cy', 2 + Math.sin(t * 8 + k * 1.7) * 2 * calm); op(f, fr); });
      // copper: the clock hand whirls, nothing happens
      const cA = win(t, mid('cu', 0.1), at('series') + 0.2, 0.3);
      op(clk, cA); if (cA > 0) clk.set((t - mid('cu', 0.1)) * 520 * (S.reduce ? 0.4 : 1));
      // the series
      rails.forEach(r => r.setAttribute('stroke-dashoffset', (1 - P(t, at('series') + 0.7, 1.0)).toFixed(4)));
      op(rails[0], P(t, at('series') + 0.6, 0.2, linear)); op(rails[1], P(t, at('series') + 0.6, 0.2, linear));
      const hp = P(t, at('series') + 1.0, 0.6, easeOut);
      tr(hRung, lerp(LX - 140, LX, hp), HROW); op(hRung, hp);
      const hg = P(t, mid('series', 0.64), 0.5, linear);
      op(hHalo, hg * (0.55 + 0.25 * wave(t, 1.4) * calm));
      op(hLine, hg); hLine.setAttribute('x2', lerp(400, 1150, P(t, mid('series', 0.64), 0.9)).toFixed(1));
      op(hLineLbl, P(t, mid('series', 0.64), 0.4, linear));
      op(serTitle, P(t, mid('series', 0.1), 0.4, linear));
      upArrow.set(P(t, mid('series', 0.34), 0.8)); op(upArrow, P(t, mid('series', 0.34), 0.2, linear));
      op(upLbl, P(t, mid('series', 0.4), 0.4, linear));
      op(cuNote, P(t, mid('series', 0.66), 0.4, linear));
    }

    /* ---------- acids and their salts; zinc ---------- */
    const aT = P(t, at('acids') - 0.15, 0.4, linear);
    op(Tb, aT);
    if (aT > 0) {
      // zinc: the sulfuric acid row rises to the top and lights up; the other two rows leave
      const z = P(t, at('zinc') - 0.1, 0.9);
      const rowAt = [0.0, 0.34, 0.68];
      TROWS.forEach((r, i) => {
        const p = P(t, mid('acids', rowAt[i]), 0.45, easeOut), ps = P(t, mid('acids', rowAt[i] + 0.15), 0.45, pop);
        op(r.ac, p); op(r.fm, P(t, mid('acids', rowAt[i]) + 0.35, 0.4, linear));
        r.ar.set(P(t, mid('acids', rowAt[i] + 0.12), 0.4)); op(r.ar, P(t, mid('acids', rowAt[i] + 0.12), 0.15, linear));
        op(r.sc, clamp(ps * 2)); tr(r.sc, r.scX, r.y, 0.7 + 0.3 * ps);
        op(r.g, i === 1 ? 1 : 1 - P(t, at('zinc') - 0.15, 0.4, linear));
        op(r.hi, i === 1 ? z : 0);
        r.g.setAttribute('transform', `translate(${((1 - p) * -24).toFixed(1)} ${i === 1 ? (-130 * z).toFixed(1) : 0})`);
      });
    }
    const aZ = P(t, at('zinc') - 0.05, 0.3, linear);
    op(Zg, aZ);
    if (aZ > 0) {
      zItems.forEach((g, i) => { const a = P(t, mid('zinc', zAt[i]), 0.45, pop); tr(g, zX[i], ZQY, 0.6 + 0.4 * a); op(g, clamp(a * 2)); });
      op(under, P(t, mid('zinc', 0.6), 0.3, linear));
      const ok = P(t, mid('zinc', 0.62), 0.45, pop); op(okC, clamp(ok * 2)); tr(okC, 420, 592, 0.7 + 0.3 * ok);
      const no = P(t, mid('zinc', 0.84), 0.45, pop); op(noC, clamp(no * 2)); tr(noC, 760, 592, 0.7 + 0.3 * no);
      noStrike.set(P(t, mid('zinc', 0.9), 0.35)); op(noX, P(t, mid('zinc', 0.93), 0.25, linear));
    }
  };
});

/* Scene 6: The penthouse and the empty flat.
   Shots (hard sitcom cuts): crane up the block to the top right flat, Group 0 lit -> Helena's penthouse
   (He 2 / Ne 2,8 / Ar 2,8,8, all FULL; stable card; Sonny offers his electron; "I'm full", Sonny deflates)
   -> Kavya's bedroom ("empty?" thought bubble; Helena bursts in: "FULL, darling") -> rooftop party
   (balloons, MRI) -> neon sign -> workshop (argon bulb, welding; Ah Gong unbothered in the sparks)
   -> Silas confessional with an inset of Ah Gong (he blinks once) -> 1869 blueprint with gaps
   -> the block: flat 32 empty, FOR RENT -> Silas with the old listing card -> corridor: Gemma arrives
   -> the block: Ge moves in, prediction confirmed -> "Please mind the gap." */
scene('penthouse', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed ph) ---------- */
  // rich text: '**bold**', '_2' subscript, '^−' superscript
  function phRich(parent, x, y, str, o) {
    o = o || {};
    const size = o.size || 32, small = Math.round(size * 0.62), dy = Math.round(size * 0.26), up = Math.round(size * 0.38);
    const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 700, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'start', 'font-family': o.font || FD }, parent);
    t.style.fontVariantLigatures = 'none'; t.style.fontKerning = 'none';   // the display font tucks the I of "TI" under the T
    let shift = 0;
    const push = (txt, kind, bold) => {
      const ts = E('tspan', {}, t); ts.textContent = txt;
      if (bold) { ts.setAttribute('font-weight', 800); if (o.boldFill) ts.setAttribute('fill', o.boldFill); }
      const want = kind === 'sub' ? dy : kind === 'sup' ? -up : 0;
      if (kind) ts.setAttribute('font-size', small);
      if (want !== shift) { ts.setAttribute('dy', want - shift); shift = want; }
    };
    String(str).split(/(\*\*[^*]+\*\*)/).forEach(seg => {
      if (!seg) return;
      const bold = seg.startsWith('**'), inner = bold ? seg.slice(2, -2) : seg;
      inner.split(/(_\d+|\^[−+])/).forEach(p => { if (!p) return; if (p[0] === '_') push(p.slice(1), 'sub', bold); else if (p[0] === '^') push(p.slice(1), 'sup', bold); else push(p, '', bold); });
    });
    return t;
  }
  const phW = el => { let w = 0; try { w = el.getComputedTextLength(); } catch (e) { w = 0; } return w; };
  function phChip(parent, str, o) {
    o = o || {};
    const size = o.size || 32, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 2.5 }, g);
    const tx = phRich(g, 0, size * 0.35, str, { size, weight: o.weight || 700, fill: o.color || C.ink, anchor: 'middle', boldFill: o.boldFill });
    const w = (phW(tx) || String(str).length * size * 0.55) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w; g.h = h;
    return g;
  }
  const phPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); vop(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.65 + 0.35 * p)), r); return p; };
  let camStr = '';
  const phCam = (k, fx, fy) => { camStr = Math.abs(k - 1) < 1e-4 ? '' : `translate(${(+fx).toFixed(1)} ${(+fy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-fx).toFixed(1)} ${(-fy).toFixed(1)})`; };
  // a light Bohr diagram: rings, nucleus, electrons as one path; g.set([n per shell]); g.gold = outer ring halo
  function phAtom(parent, shells, o) {
    o = o || {};
    const g = G(parent), r0 = o.r0 || 30, dr = o.dr || 24, er = o.er || 7;
    let rings = '';
    shells.forEach((n, k) => { const R = r0 + k * dr; rings += `M${R},0 A${R},${R} 0 1,0 ${-R},0 A${R},${R} 0 1,0 ${R},0 `; });
    g.R = r0 + (shells.length - 1) * dr;
    g.gold = E('circle', { r: g.R, fill: 'none', stroke: '#FFD45C', 'stroke-width': er * 1.9, opacity: 0.0001 }, g);
    E('path', { d: rings, fill: 'none', stroke: '#B9CADB', 'stroke-width': 3, opacity: 0.75, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, g);
    E('circle', { r: o.nr || Math.max(9, r0 * 0.36), fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 2 }, g);
    const eb = E('path', { d: '', fill: '#4FA9EE', stroke: '#0E3F66', 'stroke-width': 2 }, g);
    const em = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    g.set = (counts, spin) => {
      let d1 = '', d2 = '';
      shells.forEach((n, k) => {
        const R = r0 + k * dr, c = Math.min(n, counts[k] === undefined ? n : counts[k]);
        for (let i = 0; i < c; i++) {
          const a = -Math.PI / 2 + i * TAU / n + (n === 2 ? 0 : k * 0.3) + (spin || 0) * (k % 2 ? -1 : 1);
          const x = Math.cos(a) * R, y = Math.sin(a) * R;
          d1 += `M${(x + er).toFixed(1)},${y.toFixed(1)} A${er},${er} 0 1,0 ${(x - er).toFixed(1)},${y.toFixed(1)} A${er},${er} 0 1,0 ${(x + er).toFixed(1)},${y.toFixed(1)} Z `;
          d2 += `M${(x - er * 0.45).toFixed(1)},${y.toFixed(1)} L${(x + er * 0.45).toFixed(1)},${y.toFixed(1)} `;
        }
      });
      attr(eb, 'd', d1); attr(em, 'd', d2);
    };
    g.set(shells);
    return g;
  }
  // Ah Gong never blinks, except exactly when we say so (scBlink seed 10: period 3.1 s, phase 7.1 s)
  const phStill = (t, cues) => { for (const b of cues || []) if (t >= b && t < b + 0.13) return 2.2 + (t - b); return 1.0; };

  // one <text> for a whole row of short labels: every glyph gets its own x (saves an element per label)
  function phGlyphRow(parent, items, y, o) {
    const xs = [], chars = [];
    items.forEach(({ cx, str }) => {
      const ws = [...str].map(ch => textWidth(ch, o.size, FD, o.weight));
      let x = cx - ws.reduce((a, b) => a + b, 0) / 2;
      [...str].forEach((ch, i) => { xs.push(x.toFixed(1)); chars.push(ch); x += ws[i]; });
    });
    const t = E('text', { x: xs.join(' '), y, 'font-size': o.size, 'font-weight': o.weight, fill: o.fill, 'font-family': FD }, parent);
    t.textContent = chars.join('');
    return t;
  }
  // the block, slimmed: walls as one path, symbols as one text per floor, unused overlays dropped
  function phSlim(b, keepSym) {
    const walls = [], rows = {};
    for (let z = 1; z <= 118; z++) {
      const f = b.flats[z];
      walls.push(`M${f.x + 1.5},${f.y + 1.5} h${f.w - 3} v${f.h - 3} h${-(f.w - 3)} Z`);
      if (!keepSym.includes(z)) { (rows[f.y] = rows[f.y] || []).push({ cx: f.cx, str: BK_SYM[z] }); f.sym.remove(); }
    }
    const w0 = b.flats[1].wall, wg = w0.parentNode;
    E('path', { d: walls.join(' '), fill: '#F6F0E2', stroke: '#8F8470', 'stroke-width': 2 }, wg);
    for (let z = 1; z <= 118; z++) b.flats[z].wall.remove();
    const tg = b.flats[keepSym[0]].sym.parentNode;
    for (const y in rows) phGlyphRow(tg, rows[y], +y + BK_CH * 0.72, { size: 22, weight: 800, fill: '#24324F' });
    b.paper.remove(); b.layers.poster.remove();
    const sign = b.deco.querySelector('g'); if (sign) sign.remove();   // the BLK 118 sign would be cut off in these close shots
    ['metal', 'nonmetal', 'metalloid', 'alkali', 'alkaline', 'halogen', 'hydrogen'].forEach(k => b.layers[k].remove());
    b.stacks.forEach((r, c) => { if (r && c !== 14 && c !== 18) r.remove(); });
    b.floors.forEach((r, k) => { if (r && k !== 1) r.remove(); });
  }

  /* ---------- layers ---------- */
  const world = G(root), Lbg = G(world), Lcast = G(world), Lfg = G(world), hud = G(root);

  /* ================= the block (exterior and close-ups) ================= */
  const shExt = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#4FB6F5', '#BFE8FF', true) }, shExt);
  E('path', { d: 'M90,150 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z M960,110 q30,-40 70,-10 q30,-30 60,0 q30,0 20,24 l-150,0 q-20,-6 0,-14 Z', fill: '#FFFFFF', opacity: 0.85 }, shExt);
  E('rect', { x: 0, y: 700, width: 1200, height: 50, fill: '#5BBF6A' }, shExt);
  const block = bkBlock(shExt, { numbers: false, gaps: [32] });
  phSlim(block, [32]);
  // marks that ride on the block (local coordinates)
  const bMarks = G(block);
  const f2 = block.flats[2], f32 = block.flats[32];
  const mark2 = E('rect', { x: f2.x - 3, y: f2.y - 3, width: f2.w + 6, height: f2.h + 6, rx: 6, fill: 'rgba(255,212,92,0.25)', stroke: '#FFD45C', 'stroke-width': 4 }, bMarks);
  const mark32 = E('rect', { x: f32.x - 3, y: f32.y - 3, width: f32.w + 6, height: f32.h + 6, rx: 6, fill: 'rgba(198,168,255,0.55)', stroke: '#FFD45C', 'stroke-width': 4 }, bMarks);
  const ge32 = T(bMarks, f32.cx, f32.y + f32.h * 0.72, 'Ge', { size: 22, weight: 800, anchor: 'middle', fill: '#24324F' });
  const cPent = phChip(Lfg, 'THE PENTHOUSE', { size: 30, color: '#FFD45C', stroke: '#FFD45C' });
  const cG0 = phChip(Lfg, 'GROUP 0', { size: 44, fill: '#FF8FD0', color: '#3A0A2A', stroke: '#FFFFFF' });
  const cNoble = phChip(Lfg, 'NOBLE GASES', { size: 36, color: '#FFB8E1', stroke: '#FF8FD0' });
  // empty flat close-up
  const rent = G(Lfg);
  E('path', { d: 'M-50,-34 L-30,-62 M50,-34 L30,-62', stroke: '#5A3A24', 'stroke-width': 3 }, rent);
  E('rect', { x: -80, y: -34, width: 160, height: 56, rx: 8, fill: '#D32F2F', stroke: '#FFFFFF', 'stroke-width': 4 }, rent);
  T(rent, 0, 6, 'FOR RENT', { size: 28, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const pointArr = arrow(Lfg, 0, 0, 0, 0, { color: C.energy, width: 7 });
  const cEmpty = phChip(Lfg, 'empty flats = elements **not yet found**', { size: 30, boldFill: '#FF9AA4' });
  const cPred = phChip(Lfg, 'Mendeleev **PREDICTED** what they’d be like', { size: 30, boldFill: C.energy });
  const c1886 = phChip(Lfg, '**1886**: germanium found', { size: 34, boldFill: C.energy });
  const cConf = phChip(Lfg, 'prediction CONFIRMED ✓', { size: 34, fill: '#1E5A3A', color: '#FFFFFF', stroke: C.good });
  const cPat = phChip(Lfg, 'evidence of a **REAL PATTERN** in nature', { size: 34, boldFill: C.energy, stroke: C.energy });

  /* ================= Helena's penthouse ================= */
  const shPent = G(Lbg);
  bkPenthouse(shPent);
  const ropeHi = E('rect', { x: 886, y: 550, width: 188, height: 52, rx: 9, fill: 'none', stroke: '#FFE45C', 'stroke-width': 6 }, shPent);
  const atoms = G(Lfg);
  const AT = [
    { sh: [2], x: 585, r0: 36, lbl: 'He: **2**' },
    { sh: [2, 8], x: 775, r0: 28, dr: 26, lbl: 'Ne: **2, 8**' },
    { sh: [2, 8, 8], x: 995, r0: 24, dr: 23, lbl: 'Ar: **2, 8, 8**' },
  ].map(a => {
    const g = G(atoms); tr(g, a.x, 250);
    const at_ = phAtom(g, a.sh, { r0: a.r0, dr: a.dr, er: 7 });
    const full = T(g, 0, -at_.R - 20, 'FULL', { size: 28, weight: 800, anchor: 'middle', fill: '#FFD45C' });
    const lbl = phRich(g, 0, 118, a.lbl, { size: 30, weight: 600, anchor: 'middle', boldFill: '#FFD45C' });
    return { g, at: at_, full, lbl, x: a.x };
  });
  // the "stable" card
  const stCard = G(Lfg);
  card(stCard, 560, 140, 590, 365, { fill: 'rgba(20,10,30,0.9)', stroke: '#D9B85C', sw: 3 });
  const st1 = T(stCard, 855, 212, 'FULL outer shell', { size: 42, weight: 800, anchor: 'middle', fill: '#FFD45C' });
  const st2 = T(stCard, 855, 268, '= very **STABLE**', { size: 38, weight: 600, anchor: 'middle', boldFill: C.ink });
  const stIc = ['gain', 'lose', 'share'].map((w, i) => {
    const g = G(stCard); tr(g, 665 + i * 180, 350);
    E('circle', { cx: -34, cy: -6, r: 14, fill: '#4FA9EE', stroke: '#0E3F66', 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-40,-6 L-28,-6', stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    T(g, -12, 4, w, { size: 30, weight: 700, fill: C.ink });
    const x = cross(g, 13); tr(x, -12 + textWidth(w, 30, FD, 700) + 22, -8);
    g.x = x;
    return g;
  });
  const stUn = phChip(stCard, '**UNREACTIVE**', { size: 36, fill: '#FFD45C', color: '#3A2600', stroke: '#FFFFFF' });
  const stIn = T(stCard, 0, 0, 'or **inert**', { size: 34, weight: 600, fill: C.muted, boldFill: C.ink });
  // Sonny's flyer and Helena's "pat pat"
  const cFree = phChip(Lfg, 'FREE e^−', { size: 30, fill: '#F2E8C8', color: SC_INK, stroke: '#8A6A3A', rx: 6 });
  const patT = T(Lfg, 0, 0, 'pat pat', { size: 28, weight: 700, fill: '#FFD6EA' });
  const cFull = phChip(Lfg, 'FULL', { size: 34, fill: '#FFD45C', color: '#3A2600', stroke: '#FFFFFF' });

  /* ================= Kavya's bedroom ================= */
  const shKav = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A2340', '#3C3158', true) }, shKav);
  E('rect', { x: 40, y: 110, width: 300, height: 300, rx: 8, fill: linGrad('#0B1430', '#23305E', true), stroke: '#C9C2D8', 'stroke-width': 8 }, shKav);
  E('circle', { cx: 290, cy: 160, r: 22, fill: '#F6F2DA' }, shKav);
  E('path', { d: 'M190,110 L190,410 M40,260 L340,260', stroke: '#C9C2D8', 'stroke-width': 6 }, shKav);
  E('ellipse', { cx: 1080, cy: 560, rx: 380, ry: 260, fill: glow('#FFD98A'), opacity: 0.4 }, shKav);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: linGrad('#8A5A3A', '#5E3B24', true) }, shKav);
  const thought = G(Lfg);
  E('path', { d: 'M560,250 Q540,150 640,120 Q700,70 780,100 Q860,70 910,130 Q990,160 960,250 Q1000,330 920,370 Q880,420 790,400 Q720,430 650,395 Q560,390 570,320 Q530,290 560,250 Z', fill: '#FFFFFF', stroke: '#B9B2D8', 'stroke-width': 4 }, thought);
  E('circle', { cx: 520, cy: 390, r: 18, fill: '#FFFFFF', stroke: '#B9B2D8', 'stroke-width': 3 }, thought);
  E('circle', { cx: 486, cy: 432, r: 11, fill: '#FFFFFF', stroke: '#B9B2D8', 'stroke-width': 3 }, thought);
  const thAtom = phAtom(thought, [2, 8], { r0: 34, dr: 40, er: 8 }); tr(thAtom, 765, 235);
  const thQ = T(thought, 765, 378, 'outer shell: **EMPTY?**', { size: 30, weight: 600, anchor: 'middle', fill: '#4A4466', boldFill: '#C62828' });
  const thX = cross(thought, 34); tr(thX, 765, 235);
  const thFull = phChip(thought, 'FULL ✓', { size: 36, fill: '#FFD45C', color: '#3A2600', stroke: '#B57B12' }); tr(thFull, 765, 378);

  /* ================= rooftop party (uses) ================= */
  const shUse = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6FC2F5', '#DDF2FF', true) }, shUse);
  E('path', { d: 'M0,610 L0,470 h60 v-60 h70 v90 h50 v-130 h80 v150 h60 v-70 h90 v100 h70 v-150 h80 v90 h60 v-60 h70 v120 h60 v-90 h80 v70 h60 v-110 h80 v120 h80 L1200,610 Z', fill: '#A9C8DE' }, shUse);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: linGrad('#D8CDB6', '#A99F8B', true) }, shUse);
  E('rect', { x: 0, y: 600, width: 1200, height: 16, fill: '#B9AE96' }, shUse);
  { let a = '', b = ''; for (let i = 0; i < 16; i++) { const x = 560 + i * 40, y = 118 + 10 * Math.sin(i * 0.4); const seg = `M${x},${y.toFixed(1)} l20,34 l20,-34 Z `; if (i % 2) a += seg; else b += seg; } E('path', { d: 'M560,118 Q880,150 1200,112', fill: 'none', stroke: '#8A7A5A', 'stroke-width': 2 }, shUse); E('path', { d: a, fill: '#FF5FA2' }, shUse); E('path', { d: b, fill: '#FFE45C' }, shUse); }
  const balloons = G(Lcast);
  E('path', { d: 'M-60,40 Q-50,120 -20,220 M0,30 Q10,120 -14,220 M60,40 Q40,120 -8,220', fill: 'none', stroke: '#6E6656', 'stroke-width': 2 }, balloons);
  [[-60, 0, '#E8424F', '#9E1F2A'], [0, -14, '#FFC247', '#B57B12'], [60, 0, '#4CC9F0', '#1D84A6']].forEach(([x, y, c, d]) => E('ellipse', { cx: x, cy: y, rx: 34, ry: 42, fill: ball(c, d), stroke: d, 'stroke-width': 3 }, balloons));
  const hString = E('path', { d: '', fill: 'none', stroke: '#E8E0EC', 'stroke-width': 3 }, Lcast);
  const uUp = G(Lfg);
  { const c = phChip(uUp, '**lighter than air**', { size: 34, boldFill: C.ink }); const a = arrow(uUp, c.w / 2 + 30, 22, c.w / 2 + 30, -26, { color: C.good, width: 7 }); uUp.c = c; }
  const uBurn = G(Lfg);
  { const c = phChip(uBurn, '**can’t burn**', { size: 34, boldFill: C.ink }); const fl = G(uBurn); tr(fl, c.w / 2 + 34, 0);
    E('path', { d: 'M0,22 Q-20,6 -10,-14 Q-4,-2 0,-8 Q4,-26 14,-30 Q8,-10 18,0 Q22,16 0,22 Z', fill: '#FF8A3D', stroke: '#C25516', 'stroke-width': 2.5 }, fl); tr(cross(fl, 20), 0, -2); }
  const uBal = phChip(Lfg, 'BALLOONS ✓', { size: 34, fill: '#FF8FD0', color: '#3A0A2A', stroke: '#FFFFFF' });
  const mri = G(Lfg);
  card(mri, -190, -120, 380, 290, { fill: 'rgba(14,26,36,0.9)', stroke: '#7FD3FF', sw: 3 });
  E('rect', { x: -150, y: 32, width: 300, height: 22, rx: 8, fill: '#C9D3DC', stroke: '#5A6B7A', 'stroke-width': 3 }, mri);
  E('path', { d: 'M0,-92 A68,68 0 1,1 -0.1,-92 Z M0,-52 A30,30 0 1,0 0.1,-52 Z', fill: '#E9EEF4', 'fill-rule': 'evenodd', stroke: '#5A6B7A', 'stroke-width': 4 }, mri);
  E('rect', { x: -110, y: -26, width: 220, height: 14, rx: 6, fill: '#9FB4C8', stroke: '#5A6B7A', 'stroke-width': 2 }, mri);
  const snow = G(mri); tr(snow, 108, -70);
  E('path', { d: 'M0,-26 L0,26 M-22.5,-13 L22.5,13 M-22.5,13 L22.5,-13 M-6,-20 L0,-14 L6,-20 M-6,20 L0,14 L6,20', stroke: '#BDEBFF', 'stroke-width': 5, 'stroke-linecap': 'round', fill: 'none' }, snow);
  T(mri, 0, 104, '**MRI** scanner:', { size: 28, weight: 600, anchor: 'middle', fill: C.ink, boldFill: '#7FD3FF' });
  T(mri, 0, 140, 'helium chills the magnets', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= neon sign ================= */
  const shNeon = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1E24', '#171016', true) }, shNeon);
  { let d = ''; for (let r = 0; r < 25; r++) { const y = 30 * r; d += `M0,${y} L1200,${y} `; for (let c = 0; c < 14; c++) { const x = c * 90 + (r % 2 ? 45 : 0); d += `M${x},${y} L${x},${y + 30} `; } } E('path', { d, stroke: '#3A2A30', 'stroke-width': 2 }, shNeon); }
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: '#141015' }, shNeon);
  const neonSign = G(shNeon); tr(neonSign, 800, 290);
  const nGlow = E('ellipse', { rx: 330, ry: 190, fill: glow('#FF6A3D') }, neonSign);
  const nTube = E('rect', { x: -230, y: -120, width: 460, height: 230, rx: 40, fill: 'none', stroke: '#FF5A2E', 'stroke-width': 9 }, neonSign);
  const nTxt = T(neonSign, 0, 44, 'OPEN', { size: 132, weight: 800, anchor: 'middle', fill: '#FFE2D2' });
  nTxt.setAttribute('stroke', '#FF5A2E'); nTxt.setAttribute('stroke-width', 7); nTxt.setAttribute('paint-order', 'stroke');
  const cNeon = phChip(Lfg, '**NEON** glows **orange-red** in signs', { size: 34, boldFill: '#FF8A5C', stroke: '#FF5A2E' });

  /* ================= workshop (argon) ================= */
  const shWeld = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#1E2630', '#33404E', true) }, shWeld);
  E('rect', { x: 0, y: 590, width: 1200, height: 160, fill: linGrad('#6A5E52', '#43392F', true) }, shWeld);
  E('rect', { x: 0, y: 584, width: 1200, height: 10, fill: '#8A7C6C' }, shWeld);
  const bulb = G(shWeld); tr(bulb, 230, 330);
  E('ellipse', { rx: 150, ry: 150, fill: glow('#FFE7A8'), opacity: 0.55 }, bulb);
  E('path', { d: 'M-34,70 Q-36,40 -60,10 Q-90,-30 -70,-76 Q-44,-124 0,-124 Q44,-124 70,-76 Q90,-30 60,10 Q36,40 34,70 Z', fill: 'rgba(200,190,255,0.28)', stroke: '#E8EEF4', 'stroke-width': 5, 'stroke-linejoin': 'round' }, bulb);
  E('path', { d: 'M-14,66 L-14,-10 L-8,-26 L-2,-10 L4,-26 L10,-10 L14,66', fill: 'none', stroke: '#FFC247', 'stroke-width': 4, 'stroke-linejoin': 'round' }, bulb);
  E('rect', { x: -36, y: 70, width: 72, height: 50, rx: 6, fill: '#A9B5C0', stroke: '#5A6B7A', 'stroke-width': 3 }, bulb);
  E('path', { d: 'M-36,86 L36,86 M-36,102 L36,102', stroke: '#5A6B7A', 'stroke-width': 3 }, bulb);
  T(bulb, -46, -46, 'Ar', { size: 30, weight: 800, anchor: 'middle', fill: '#C9C2FF' });
  T(bulb, 46, -46, 'Ar', { size: 30, weight: 800, anchor: 'middle', fill: '#C9C2FF' });
  const weld = G(shWeld);
  E('rect', { x: 760, y: 548, width: 260, height: 40, rx: 4, fill: ball('#C9D1DA', '#6E7B88'), stroke: '#4E5966', 'stroke-width': 3 }, weld);
  E('path', { d: 'M1140,330 L960,500', stroke: '#2A2F3A', 'stroke-width': 26, 'stroke-linecap': 'round' }, weld);
  E('path', { d: 'M1140,330 L960,500', stroke: '#4A525C', 'stroke-width': 14, 'stroke-linecap': 'round' }, weld);
  E('path', { d: 'M972,488 L930,528', stroke: '#C9A44A', 'stroke-width': 18, 'stroke-linecap': 'round' }, weld);
  const arCloud = E('ellipse', { cx: 905, cy: 540, rx: 130, ry: 70, fill: glow('#B9B2FF'), opacity: 0.9 }, weld);
  const arcG = E('circle', { cx: 912, cy: 546, r: 34, fill: glow('#FFFFFF', '#FFFFFF') }, weld);
  const sparks = E('path', { d: '', stroke: '#FFE45C', 'stroke-width': 4, 'stroke-linecap': 'round' }, weld);
  const SPK = (() => { const r = rng(91), a = []; for (let i = 0; i < 16; i++) a.push({ ang: -Math.PI * (0.15 + r() * 0.75), sp: 160 + r() * 200, ph: r() }); return a; })();
  const arLbl = T(weld, 905, 650, 'argon shield', { size: 28, weight: 700, anchor: 'middle', fill: '#C9C2FF' });
  const cBulb = phChip(Lfg, '**ARGON** fills light bulbs', { size: 32, boldFill: '#C9C2FF', stroke: '#B9B2FF' });
  const cWeld = phChip(Lfg, '**ARGON** protects hot metal in **welding**', { size: 32, boldFill: '#C9C2FF', stroke: '#B9B2FF' });

  /* ================= confessionals (Silas) ================= */
  const conf = bkConf(Lbg, 'silas');
  const inset = G(Lbg);
  E('rect', { x: 680, y: 130, width: 410, height: 310, rx: 14, fill: '#0E1A24', stroke: '#E8EEF4', 'stroke-width': 6 }, inset);
  E('rect', { x: 690, y: 140, width: 390, height: 290, rx: 8, fill: linGrad('#1C1838', '#3A3172', true) }, inset);
  const cal = G(inset); tr(cal, 760, 210);
  E('rect', { x: -44, y: -44, width: 88, height: 92, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, cal);
  E('rect', { x: -44, y: -44, width: 88, height: 26, rx: 6, fill: '#D32F2F' }, cal);
  T(cal, 0, 26, '1894', { size: 28, weight: 800, anchor: 'middle', fill: SC_INK });
  const ltAh = scLowerThird(hud, ...BK_LT.ahgong);
  // the old listing card
  const listing = G(Lfg);
  card(listing, -215, -150, 430, 310, { fill: '#EBDDB6', stroke: '#9C8250', sw: 4, rx: 8 });
  E('path', { d: 'M150,-150 Q170,-120 215,-112 M175,-150 Q185,-132 215,-128 M195,-150 L215,-140', fill: 'none', stroke: '#B8AC8C', 'stroke-width': 2 }, listing);   // cobweb
  E('circle', { cx: -130, cy: 90, r: 40, fill: 'none', stroke: '#C9A97A', 'stroke-width': 6, opacity: 0.6 }, listing);  // coffee ring
  E('rect', { x: -215, y: -150, width: 430, height: 58, rx: 8, fill: '#B23A3A' }, listing);
  T(listing, 0, -110, 'FLAT 32 · FOR RENT', { size: 32, weight: 800, anchor: 'middle', fill: '#FFF6E0' });
  const lsEmpty = T(listing, 0, -40, '(element not yet found)', { size: 26, weight: 600, anchor: 'middle', fill: '#6E5A3A', font: FB });
  const lsGrey = T(listing, -180, 20, 'colour: **grey**', { size: 34, weight: 600, fill: '#3A2A16', boldFill: '#4A525C' });
  const lsMass = T(listing, -180, 76, 'atomic mass **≈ 72**', { size: 34, weight: 600, fill: '#3A2A16', boldFill: '#7A2A1A' });
  const lsSig = T(listing, 190, 132, '— D. Mendeleev', { size: 26, weight: 600, anchor: 'end', fill: '#6E5A3A', font: FB });
  // small copies for the corridor
  const miniList = G(Lfg);
  card(miniList, -150, -78, 300, 156, { fill: '#EBDDB6', stroke: '#9C8250', sw: 3, rx: 8 });
  E('rect', { x: -150, y: -78, width: 300, height: 42, rx: 8, fill: '#B23A3A' }, miniList);
  T(miniList, 0, -48, 'PREDICTED', { size: 26, weight: 800, anchor: 'middle', fill: '#FFF6E0' });
  T(miniList, 0, 4, 'grey', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2A16' });
  T(miniList, 0, 54, 'mass ≈ 72', { size: 32, weight: 700, anchor: 'middle', fill: '#3A2A16' });
  const gemCard = G(Lfg);
  card(gemCard, -150, -78, 300, 156, { fill: '#F2F0FA', stroke: '#7F7BA6', sw: 3, rx: 8 });
  E('rect', { x: -150, y: -78, width: 300, height: 42, rx: 8, fill: '#55517A' }, gemCard);
  T(gemCard, 0, -48, 'GERMANIUM', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const gcGrey = G(gemCard); T(gcGrey, 0, 4, 'grey', { size: 32, weight: 700, anchor: 'middle', fill: '#24324F' }); tr(tick(gcGrey, 13), 74, -8);
  const gcMass = G(gemCard); T(gcMass, -12, 54, 'mass 72.6', { size: 32, weight: 700, anchor: 'middle', fill: '#24324F' }); tr(tick(gcMass, 13), 100, 42);

  /* ================= Mendeleev's blueprint ================= */
  const shPlan = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6B4A33', '#4A301C', true) }, shPlan);
  const paper = G(shPlan); paper.setAttribute('transform', 'rotate(-1.5 600 380)');
  E('rect', { x: 110, y: 120, width: 980, height: 520, rx: 6, fill: '#EBDDB6', stroke: '#9C8250', 'stroke-width': 4 }, paper);
  E('path', { d: 'M110,180 L1090,180 M110,600 L1090,600', stroke: '#C9B48A', 'stroke-width': 2 }, paper);
  T(paper, 600, 166, 'PLANS FOR A BLOCK OF ELEMENTS', { size: 34, weight: 800, anchor: 'middle', fill: '#5A3E1E', ls: 2 });
  const BP = { x0: 158, y0: 230, c: 52 };
  const bpXY = z => { const [c, r] = bkPos(z); return [BP.x0 + (c - 1) * BP.c, BP.y0 + (r - 1) * BP.c]; };
  const ZS = []; for (let z = 1; z <= 36; z++) if (![2, 10, 18, 36].includes(z)) ZS.push(z);
  const GAPS = [21, 31, 32];
  { let d = ''; ZS.forEach(z => { if (GAPS.includes(z)) return; const [x, y] = bpXY(z); d += `M${x},${y} h${BP.c} v${BP.c} h${-BP.c} Z `; }); E('path', { d, fill: 'rgba(255,255,255,0.25)', stroke: '#6E5A3A', 'stroke-width': 2.5 }, paper); }
  const bpCol1 = G(paper), bpCol7 = G(paper);
  { let a = '', b = ''; [3, 11, 19].forEach(z => { const [x, y] = bpXY(z); a += `M${x},${y} h${BP.c} v${BP.c} h${-BP.c} Z `; }); [9, 17, 35].forEach(z => { const [x, y] = bpXY(z); b += `M${x},${y} h${BP.c} v${BP.c} h${-BP.c} Z `; });
    E('path', { d: a, fill: '#FF9A8F', opacity: 0.6, stroke: '#C2453A', 'stroke-width': 3 }, bpCol1); E('path', { d: b, fill: '#C6E35A', opacity: 0.6, stroke: '#6E8A1A', 'stroke-width': 3 }, bpCol7); }
  const bpRows = [1, 2, 3, 4].map(r => {
    const zs = ZS.filter(z => !GAPS.includes(z) && bkPos(z)[1] === r);
    const t = phGlyphRow(paper, zs.map(z => ({ cx: bpXY(z)[0] + BP.c / 2, str: BK_SYM[z] })), BP.y0 + (r - 1) * BP.c + BP.c * 0.68, { size: 26, weight: 700, fill: '#4A3218' });
    t.x0 = bpXY(zs[0])[0]; t.x1 = bpXY(zs[zs.length - 1])[0] + BP.c; t.qy = BP.y0 + (r - 0.5) * BP.c;
    return t;
  });
  const bpGaps = GAPS.map(z => { const [x, y] = bpXY(z); const g = G(paper); E('rect', { x: x + 2, y: y + 2, width: BP.c - 4, height: BP.c - 4, fill: 'rgba(255,96,112,0.12)', stroke: '#C62828', 'stroke-width': 3, 'stroke-dasharray': '7 5' }, g); g.q = T(g, x + BP.c / 2, y + BP.c * 0.74, '?', { size: 36, weight: 800, anchor: 'middle', fill: '#C62828' }); g.cx = x + BP.c / 2; g.cy = y + BP.c / 2; return g; });
  const stamp = G(paper); tr(stamp, 960, 520, 1, -10);
  E('rect', { x: -96, y: -40, width: 192, height: 80, rx: 8, fill: 'none', stroke: '#C62828', 'stroke-width': 6 }, stamp);
  T(stamp, 0, 22, '1869', { size: 58, weight: 800, anchor: 'middle', fill: '#C62828' });
  const quill = G(shPlan);
  E('path', { d: 'M0,0 Q40,-60 120,-130 Q90,-60 14,-6 Z', fill: '#F7F7F2', stroke: '#8A7A5A', 'stroke-width': 2.5 }, quill);
  E('path', { d: 'M0,0 L104,-116', stroke: '#8A7A5A', 'stroke-width': 2 }, quill);
  const ink = G(shPlan); tr(ink, 1120, 690);
  E('path', { d: 'M-34,0 L-30,-40 L30,-40 L34,0 Z', fill: '#1E2A44', stroke: '#0A1020', 'stroke-width': 3 }, ink);
  E('rect', { x: -16, y: -52, width: 32, height: 14, fill: '#2A3A5A', stroke: '#0A1020', 'stroke-width': 2 }, ink);
  const cMend = phChip(Lfg, '**Dmitri Mendeleev**, Russian chemist', { size: 32, boldFill: C.energy });
  const cProp = phChip(Lfg, 'grouped by **similar properties**', { size: 30, boldFill: C.energy });
  const cGaps = phChip(Lfg, 'he **LEFT GAPS**', { size: 34, boldFill: '#FF9AA4', stroke: '#C62828' });

  /* ================= corridor ================= */
  const shCor = G(Lbg);
  const cor = bkCorridor(shCor); setText(cor.plate, '#04-14');
  const box = bkBox(Lfg, 'GEMMA. FRAGILE.');
  const ltGem = scLowerThird(hud, ...BK_LT.gemma);

  /* ================= mind the gap ================= */
  const shMind = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#9FD8FF', '#E6F6FF', true) }, shMind);
  E('path', { d: 'M0,330 Q120,250 240,320 Q360,240 480,320 Q620,250 760,320 Q900,250 1040,320 Q1120,270 1200,310 L1200,520 L0,520 Z', fill: '#5BBF6A' }, shMind);
  E('rect', { x: 0, y: 0, width: 1200, height: 110, fill: '#D8CDB6' }, shMind);
  E('rect', { x: 0, y: 104, width: 1200, height: 14, fill: '#B9AE96' }, shMind);
  E('rect', { x: 0, y: 520, width: 1200, height: 230, fill: linGrad('#CFC6B4', '#A99F8B', true) }, shMind);
  [[60, 118], [1140, 118]].forEach(([x, y]) => { E('rect', { x: x - 34, y, width: 68, height: 420, fill: linGrad('#F0E8D6', '#D2C6AE'), stroke: '#8F8470', 'stroke-width': 3 }, shMind); E('rect', { x: x - 34, y: y + 300, width: 68, height: 60, fill: '#3F8A6A' }, shMind); });
  E('rect', { x: 0, y: 676, width: 1200, height: 22, fill: '#FFD43B' }, shMind);
  const mrt = G(shMind); tr(mrt, 800, 300);
  E('rect', { x: -12, y: 80, width: 24, height: 300, fill: '#8F9CAB', stroke: '#57636F', 'stroke-width': 3 }, mrt);
  E('rect', { x: -250, y: -120, width: 500, height: 210, rx: 12, fill: '#1B2733', stroke: '#E8EEF4', 'stroke-width': 5 }, mrt);
  E('rect', { x: -250, y: 52, width: 500, height: 38, fill: '#FFD43B' }, mrt);
  E('path', { d: 'M-236,52 L-236,90 M-250,90 L250,90', stroke: '#1B2733', 'stroke-width': 0 }, mrt);
  T(mrt, 0, -50, 'PLEASE', { size: 48, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  T(mrt, 0, 18, 'MIND THE GAP', { size: 56, weight: 800, anchor: 'middle', fill: '#FFFFFF', ls: 2 });
  // pictogram on the yellow strip: two flats and a gap between
  E('path', { d: 'M-160,60 h90 v22 h-90 Z M70,60 h90 v22 h-90 Z', fill: '#1B2733' }, mrt);
  T(mrt, 0, 82, '?', { size: 30, weight: 800, anchor: 'middle', fill: '#C62828' });

  /* ---------- the cast (one each, moved between shots) ---------- */
  const helena = cast(Lcast, 'helena');
  const sonny = cast(Lcast, 'sonny', { speed: 1.4 });
  const kav = cast(Lcast, 'kavya', { home: true });
  const neon = cast(Lcast, 'neon');
  const ahg = cast(Lcast, 'ahgong');
  const silas = cast(Lcast, 'silas');
  const gemma = cast(Lcast, 'gemma');
  // Helena: closed smug eyes and a little patting glove (ride on her bobbing body)
  const hClosed = G(helena.firstChild);
  [-27, 27].forEach(x => {
    E('ellipse', { cx: x, cy: -20, rx: 20, ry: 22, fill: '#F6B2D2', stroke: SC_INK, 'stroke-width': 2.2 }, hClosed);
    E('path', { d: `M${x - 13},${-22} Q${x},${-10} ${x + 13},${-22}`, fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, hClosed);
  });
  const hGlove = G(helena.firstChild);
  E('ellipse', { rx: 18, ry: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, hGlove);
  E('path', { d: 'M-8,-12 L-8,-2 M0,-14 L0,-2 M8,-12 L8,-2', stroke: SC_INK, 'stroke-width': 2 }, hGlove);
  const CAST = [helena, sonny, kav, neon, ahg, silas, gemma, balloons, hString];

  /* ---------- shot list ---------- */
  const SH = [
    ['ext', -1e9], ['pent', at('full') - 0.06], ['kav', at('empty') - 0.06], ['use', at('uses') - 0.06],
    ['neon', at('neon') - 0.06], ['weld', mid('neon', 0.4)], ['conf1', at('thahgong') - 0.06], ['plan', at('plans') - 0.06],
    ['bld', at('empties') - 0.06], ['conf2', at('thlisting') - 0.06], ['cor', at('gemma') - 0.06], ['bld2', at('match') - 0.06],
    ['mind', at('mind') - 0.06],
  ];
  const shotAt = t => { let s = SH[0][0]; for (const [k, t0] of SH) if (t >= t0) s = k; return s; };
  const SETS = { ext: shExt, bld: shExt, bld2: shExt, pent: shPent, kav: shKav, use: shUse, neon: shNeon, weld: shWeld, plan: shPlan, cor: shCor, mind: shMind };
  const FG = [cPent, cG0, cNoble, rent, pointArr, cEmpty, cPred, c1886, cConf, cPat, atoms, stCard, cFree, patT, cFull, thought, uUp, uBurn, uBal, mri, cNeon, cBulb, cWeld, listing, miniList, gemCard, cMend, cProp, cGaps, box];
  const AH_BLINK = [end('thahgong') + 0.35];

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
    for (const k in SETS) vop(SETS[k], 0);
    if (SETS[sh]) vop(SETS[sh], 1);
    conf.set(sh === 'conf1' || sh === 'conf2' ? 1 : 0, t);
    vop(inset, sh === 'conf1' ? 1 : 0);
    FG.forEach(e => vop(e, 0));
    const shown = new Set();
    let ltAhV = 0, ltGemV = 0;
    let cam = [1, 600, 375];
    const show = (c, x, y, s, st) => { shown.add(c); tr(c, x, y, s); c.set(Object.assign({ t }, st)); };

    /* ---------------- the block, from outside ---------------- */
    if (sh === 'ext' || sh === 'bld' || sh === 'bld2') {
      vop(block.layers.noble, 0); vop(block.labels, 0); vop(block.floors[1], 0); vop(block.stacks[18], 0); vop(block.stacks[14], 0);
      vop(mark2, 0); vop(mark32, 0); vop(ge32, 0); vop(block.gap[32], 0); vop(block.flats[32].sym, 1);
      let bs = 1, bx = 600, by = 420;
      if (sh === 'ext') {
        const cr = P(t, at('top') + 0.15, mid('top', 0.5) - at('top'), ease);
        bs = lerp(1.0, 1.6, cr); bx = lerp(600, 760 - 1.6 * f2.cx, cr); by = lerp(420, 300 - 1.6 * f2.cy, cr);
        vop(block.floors[1], win(t, mid('top', 0.0), mid('top', 0.3), 0.15));
        vop(block.stacks[18], win(t, mid('top', 0.14), mid('top', 0.48), 0.15));
        vop(mark2, P(t, mid('top', 0.36), 0.3, linear));
        phPop(cPent, t, mid('top', 0.38), 590, 200);
        vop(block.layers.noble, 0.85 * P(t, mid('top', 0.56), 0.4, linear));
        vop(block.labels, P(t, mid('top', 0.56), 0.4, linear));
        phPop(cG0, t, mid('top', 0.58), 1010, 300);
        phPop(cNoble, t, mid('top', 0.72), 1010, 380);
      } else {
        // close-up on Silas's flat (14) and the one below it (32)
        let zs = 2.6, fx = 640, fy = 300;
        if (sh === 'bld2') {
          const pb = P(t, mid('match', 0.5), 2.2, ease);
          zs = lerp(2.6, 1.5, pb); fx = lerp(640, 600, pb); fy = lerp(300, 280, pb);
        }
        const f14 = block.flats[14];
        bs = zs; bx = fx - zs * f14.cx; by = fy - zs * f14.cy;
        const scr = f => [bx + bs * f.cx, by + bs * f.cy];
        const [sx, sy] = scr(f14), [gx, gy] = scr(f32);
        const filled = sh === 'bld2' ? P(t, mid('match', 0.1), 0.5, linear) : 0;
        vop(block.gap[32], 1 - filled); vop(block.flats[32].sym, 0); vop(ge32, filled); vop(mark32, filled * (0.75 + 0.25 * wave(t, 1.2)));
        // Silas leaning out of his own flat
        show(silas, sx, sy + 6 * bs / 2.6, 0.2 * bs, { talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: sh === 'bld' ? 0.5 : 0 });
        if (sh === 'bld') {
          const rp = P(t, mid('empties', 0.08), 0.45, pop);
          vop(rent, clamp(rp * 2.5)); tr(rent, gx, gy + 100, Math.max(0.01, 0.7 + 0.3 * rp), 3 * Math.sin(t * 2.2) * AMP);
          // the arrow from Silas down to the empty flat
          vop(pointArr, P(t, mid('empties', 0.12), 0.2, linear));
          pointArr.set(P(t, mid('empties', 0.12), 0.5, easeOut));
          pointArr.firstChild.setAttribute('d', `M${sx + 80},${sy - 10} Q${sx + 170},${(sy + gy) / 2} ${gx + 86},${gy - 6}`);
          pointArr.lastChild.setAttribute('transform', `translate(${gx + 78} ${gy - 2}) rotate(160)`);
          phPop(cEmpty, t, mid('empties', 0.15), 600, 620);
          phPop(cPred, t, mid('empties', 0.6), 600, 692);
          if (t > mid('empties', 0.6)) vop(cEmpty, 1);
        } else {
          // Gemma moves in: waves from the window of flat 32
          const gp = P(t, mid('match', 0.14), 0.45, pop);
          if (gp > 0.01) { show(gemma, gx, gy + 4 * bs / 2.6, Math.max(0.01, 0.19 * bs * gp), { talk: 0, mood: 'happy', look: 0 }); }
          vop(block.stacks[14], P(t, mid('match', 0.62), 0.4, linear));
          phPop(c1886, t, mid('match', 0.06), 600, 560);
          phPop(cConf, t, mid('match', 0.3), 600, 632);
          phPop(cPat, t, mid('match', 0.68), 600, 700);
          if (t > mid('match', 0.68)) { vop(c1886, 1 - P(t, mid('match', 0.62), 0.3, linear)); tr(cConf, 600, 560); }
        }
      }
      tr(block, bx, by, bs);
    }

    /* ---------------- Helena's penthouse ---------------- */
    if (sh === 'pent') {
      const hin = P(t, at('full') - 0.06, 0.7, easeOut);
      let hm = 'smug', hl = 0, hs = 1.3;
      if (t > mid('full', 0.3) && t < at('stable')) hl = 0.7;
      if (t >= at('stable')) hl = 0.5;
      if (t >= at('offer') - 0.05) hl = 0.8;
      const closed = t > mid('fullup', 0.18) && t < end('fullup') + 0.75;
      vop(hClosed, closed ? 1 : 0);
      const pat = t > mid('fullup', 0.45) && t < end('fullup') + 0.6;
      vop(hGlove, pat ? 1 : 0); tr(hGlove, 52, 44 + (pat ? 8 * Math.abs(Math.sin(t * 9)) : 0));
      show(helena, lerp(-160, 300, hin), 400, hs, { talk: scTalk(S, t, 'helena'), mood: hm, look: hl });
      vop(patT, pat ? 1 : 0); tr(patT, 400, 520);
      // "We don't react, darling": the velvet rope sign lights up
      vop(ropeHi, win(t, at('full') + 0.1, mid('full', 0.32), 0.15) * (0.55 + 0.45 * wave(t, 0.5)));
      // He, Ne, Ar: all full
      if (t < at('stable') + 0.25) {
        const fa = 1 - P(t, at('stable') - 0.05, 0.25, linear);
        vop(atoms, fa);
        const T0 = [mid('full', 0.3), mid('full', 0.62), mid('full', 0.82)];
        AT.forEach((a, i) => {
          const p = P(t, T0[i], 0.45, pop);
          vop(a.g, clamp(p * 2.5)); tr(a.g, a.x, 250, Math.max(0.01, 0.6 + 0.4 * p));
          a.at.set([2, 8, 8], t * 0.25 * AMP);
          const g = P(t, T0[i] + 0.35, 0.3, linear);
          vop(a.at.gold, g * (0.35 + 0.25 * wave(t, 1.1, i * 0.3))); vop(a.full, g);
        });
      }
      // stable, unreactive
      if (t > at('stable') - 0.1 && t < at('offer') - 0.05) {
        vop(stCard, P(t, at('stable') - 0.1, 0.2, linear));
        vop(st1, P(t, at('stable') + 0.05, 0.25, linear));
        vop(st2, P(t, mid('stable', 0.17), 0.25, linear));
        stIc.forEach((g, i) => { const p = P(t, mid('stable', 0.34 + i * 0.07), 0.3, pop); vop(g, clamp(p * 2.5)); vop(g.x, P(t, mid('stable', 0.37 + i * 0.07), 0.2, linear)); });
        phPop(stUn, t, mid('stable', 0.66), 760, 445);
        vop(stIn, P(t, mid('stable', 0.86), 0.3, linear)); tr(stIn, 965, 457);
      }
      // Sonny drops by with his electron
      if (t > at('offer') - 0.12) {
        const sin_ = P(t, at('offer') - 0.12, 0.35, easeOut);
        const sad = P(t, mid('fullup', 0.72), 0.6, ease);
        const sx = lerp(1360, 930, sin_), sy = 420 + 24 * sad;
        show(sonny, sx, sy, 1.1, { talk: scTalk(S, t, 'sonny'), mood: sad > 0.3 ? 'sad' : 'happy', look: -0.8 });
        sonny.firstChild.setAttribute('transform', sonny.firstChild.getAttribute('transform') + ` scale(1 ${(1 - 0.1 * sad).toFixed(3)})`);
        vop(sonny.orbit, 0); tr(sonny.electron, -128, -4 + 60 * sad, 1.7 - 0.4 * sad);
        const fp = P(t, mid('offer', 0.45), 0.4, pop);
        vop(cFree, clamp(fp * 2.5) * (1 - sad)); tr(cFree, sx - 150, sy + 92, Math.max(0.01, 0.7 + 0.3 * fp), -6);
      }
      const fu = P(t, mid('fullup', 0.75), 0.4, pop);
      vop(cFull, clamp(fu * 2.5)); tr(cFull, 300, 210, Math.max(0.01, 0.7 + 0.3 * fu), -5);
      // hold the 0.7 s pause: push in on poor Sonny
      const push = P(t, end('fullup'), 1.0, linear);
      cam = [1 + 0.1 * push, 930, 420];
    }

    /* ---------------- Kavya: "empty?" ---------------- */
    if (sh === 'kav') {
      const g = t >= at('gasp') - 0.1;
      show(kav, 330, 520, 1.25, { talk: scTalk(S, t, 'kavya'), mood: g ? (t > end('gasp') + 0.2 ? 'neutral' : 'shock') : 'neutral', look: g ? 0.9 : 0.6, sweat: g ? 0 : 0.5 * P(t, mid('empty', 0.5), 0.4, linear) });
      const tp = P(t, mid('empty', 0.08), 0.4, pop);
      vop(thought, clamp(tp * 2.5)); thought.setAttribute('transform', `translate(760 260) scale(${Math.max(0.01, 0.7 + 0.3 * tp).toFixed(3)}) translate(-760 -260)`);
      const fill = Math.round(8 * P(t, mid('gasp', 0.35), end('gasp') - mid('gasp', 0.35), linear));
      thAtom.set([2, fill], t * 0.2 * AMP);
      vop(thX, win(t, mid('gasp', 0.08), mid('gasp', 0.45), 0.1));
      tr(thX, 765 + 74 * Math.cos(-0.8), 235 + 74 * Math.sin(-0.8));
      vop(thQ, 1 - P(t, mid('gasp', 0.3), 0.2, linear));
      const fp = P(t, end('gasp') - 0.15, 0.45, pop);
      vop(thFull, clamp(fp * 2.5)); tr(thFull, 765, 378, Math.max(0.01, 0.7 + 0.3 * fp));
      if (g) {
        const hin = P(t, at('gasp') - 0.1, 0.3, easeOut);
        const inflate = P(t, at('gasp'), 0.5, easeOut) * (1 - 0.6 * P(t, end('gasp') + 0.1, 0.5, ease));
        const wob = Math.sin(t * 22) * 0.03 * inflate * AMP;
        show(helena, lerp(1360, 1045, hin), 455, 1.05 + 0.25 * inflate + wob, { talk: scTalk(S, t, 'helena'), mood: 'shock', look: -0.9, sweat: 0.7 * inflate });
        vop(hClosed, 0); vop(hGlove, 0);
      }
    }

    /* ---------------- rooftop: balloons and MRI ---------------- */
    if (sh === 'use') {
      const rise = P(t, mid('uses', 0.14), 2.6, ease);
      const hy = lerp(470, 300, rise);
      vop(hClosed, 0); vop(hGlove, 0);
      show(helena, 360, hy, 1.15, { talk: scTalk(S, t, 'helena'), mood: 'smug', look: t > mid('uses', 0.7) ? 0.7 : 0.2 });
      const b = Math.sin(t * TAU * 0.5 + 11) * 9;
      vop(hString, 1); attr(hString, 'd', `M${(360 + 4 * 1.15).toFixed(1)},${(hy + (156 + b) * 1.15).toFixed(1)} Q${370},${((hy + 640) / 2 + 60).toFixed(1)} 352,640`);
      vop(balloons, 1); tr(balloons, 180, lerp(520, 330, rise) + 6 * Math.sin(t * 1.7) * AMP, 1, 4 * Math.sin(t * 1.3) * AMP);
      phPop(uUp, t, mid('uses', 0.16), 770, 190);
      phPop(uBurn, t, mid('uses', 0.38), 790, 272);
      phPop(uBal, t, mid('uses', 0.55), 790, 354);
      phPop(mri, t, mid('uses', 0.7), 850, 515);
      tr(snow, 108, -70, 1, (t * 30 * AMP) % 360);
    }

    /* ---------------- neon sign ---------------- */
    if (sh === 'neon') {
      const t0 = at('neon');
      const fl = t < t0 + 0.5 ? ([0, 1, 0, 0, 1, 1, 0, 1][Math.floor((t - t0 + 0.06) / 0.07) % 8] || 0) : 1;
      const k = t < t0 - 0.05 ? 0 : fl;
      vop(nGlow, k * (0.85 + 0.15 * wave(t, 0.8))); vop(nTube, 0.3 + 0.7 * k); nTxt.setAttribute('fill', k ? '#FFE2D2' : '#5A3A30'); vop(nTxt, 1);
      show(neon, 320, 440, 1.15, { mood: 'smug', look: 0.7 });
      phPop(cNeon, t, mid('neon', 0.12), 800, 540);
    }

    /* ---------------- workshop: argon ---------------- */
    if (sh === 'weld') {
      const wt = t - mid('neon', 0.4);
      let d = '';
      SPK.forEach(s => {
        const q = (wt * 1.6 + s.ph) % 1, r1 = 20 + q * s.sp, r2 = r1 + 18;
        const x = 912 + Math.cos(s.ang) * r1, y = 546 + Math.sin(s.ang) * r1 + 120 * q * q;
        const x2 = 912 + Math.cos(s.ang) * r2, y2 = 546 + Math.sin(s.ang) * r2 + 120 * q * q;
        d += `M${x.toFixed(1)},${y.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `;
      });
      attr(sparks, 'd', d); vop(sparks, 0.9);
      vop(arcG, 0.75 + 0.25 * Math.abs(Math.sin(t * 31)));
      vop(arCloud, 0.55 + 0.35 * P(t, mid('neon', 0.72), 0.4, linear));
      vop(arLbl, P(t, mid('neon', 0.74), 0.4, linear));
      show(ahg, 690, 470, 0.95, { t: phStill(t), mood: 'deadpan', look: 0 });
      phPop(cBulb, t, mid('neon', 0.46), 310, 180);
      phPop(cWeld, t, mid('neon', 0.7), 820, 250);
    }

    /* ---------------- Silas confessional: that's Ah Gong ---------------- */
    if (sh === 'conf1') {
      const lk = t < mid('thahgong', 0.3) ? 0.75 : (t < mid('thahgong', 0.75) ? 0 : 0.6);
      show(silas, 380, 410, 1.45, { talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: lk });
      show(ahg, 900, 285, 0.72, { t: phStill(t, AH_BLINK), mood: 'deadpan', look: 0 });
      ltAhV = win(t, at('thahgong') + 0.15, at('thahgong') + 3.4, 0.3); tr(ltAh, 620, 470);
      const push = P(t, end('thahgong') - 0.1, 0.9, linear);
      cam = [1 + 0.12 * push, 885, 285];
    }

    /* ---------------- 1869: the plans ---------------- */
    if (sh === 'plan') {
      const st = P(t, at('plans') + 0.15, 0.4, pop);
      vop(stamp, clamp(st * 2.5)); tr(stamp, 960, 520, Math.max(0.01, 1.6 - 0.6 * st), -10);
      // the plans get drawn, cell by cell
      const dr = P(t, mid('plans', 0.6), end('plans') - mid('plans', 0.6), linear);
      const rows = dr * 4, qi = Math.min(3, Math.floor(rows)), fr = rows - qi;
      bpRows.forEach((r, i) => vop(r, t >= at('gaps') - 0.06 ? 1 : clamp((rows - i) * 3)));
      const tgt = bpRows[qi], qx = lerp(tgt.x0, tgt.x1, qi < 4 ? fr : 1), qy = tgt.qy - 6;
      const qd = t < at('gaps') ? 1 : 1 - P(t, at('gaps'), 0.3, linear);
      const qq = P(t, mid('plans', 0.55), 0.4, ease);
      tr(quill, lerp(1000, qx, qq * qd) + 4 * Math.sin(t * 12) * qd * qq, lerp(640, qy, qq * qd));
      // grouped by properties
      vop(bpCol1, win(t, mid('gaps', 0.06), mid('gaps', 0.55), 0.2));
      vop(bpCol7, win(t, mid('gaps', 0.14), mid('gaps', 0.55), 0.2));
      phPop(cProp, t, mid('gaps', 0.12), 600, 690);
      // ... and where the pattern broke, gaps
      bpGaps.forEach((g, i) => { const p = P(t, mid('gaps', 0.58 + i * 0.06), 0.4, pop); vop(g, clamp(p * 2.5)); vop(g.q, 0.6 + 0.4 * wave(t, 0.7, i * 0.3)); });
      if (t > mid('gaps', 0.55)) vop(cProp, 1 - P(t, mid('gaps', 0.55), 0.2, linear));
      phPop(cGaps, t, mid('gaps', 0.62), 600, 690);
      if (t < mid('plans', 0.45)) vop(cMend, 0); else if (t < at('gaps')) phPop(cMend, t, mid('plans', 0.45), 600, 690); else vop(cMend, 0);
      const k = 1 + 0.06 * P(t, at('plans'), end('gaps') + 0.3 - at('plans'), linear);
      cam = [k, 600, 330];
    }

    /* ---------------- Silas: the old listing ---------------- */
    if (sh === 'conf2') {
      const lk = t > mid('thlisting', 0.45) && t < mid('thlisting', 0.97) ? 0.7 : 0;
      show(silas, 390, 410, 1.45, { talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: lk });
      const lp = P(t, at('thlisting') + 0.1, 0.45, pop);
      vop(listing, clamp(lp * 2.5)); tr(listing, 880, 330, Math.max(0.01, 0.7 + 0.3 * lp), -4);
      vop(lsEmpty, P(t, mid('thlisting', 0.2), 0.3, linear));
      vop(lsGrey, P(t, mid('thlisting', 0.58), 0.3, linear));
      vop(lsMass, P(t, mid('thlisting', 0.8), 0.3, linear));
      vop(lsSig, P(t, mid('thlisting', 0.9), 0.3, linear));
      cam = [1 + 0.03 * P(t, at('thlisting'), 7, linear), 600, 375];
    }

    /* ---------------- corridor: Gemma arrives ---------------- */
    if (sh === 'cor') {
      const gin = P(t, at('gemma') - 0.06, 0.45, easeOut);
      const gx = lerp(1380, 880, gin);
      show(gemma, gx, 450, 1.0, { talk: scTalk(S, t, 'gemma'), mood: 'happy', look: t > mid('gemma', 0.72) ? -0.8 : 0 });
      vop(box, 1); tr(box, gx + 170, 588, 0.75, 2 * Math.sin(t * 5) * (1 - gin));
      show(silas, 390, 528, 0.95, { talk: 0, mood: 'deadpan', look: gin > 0.5 ? 0.9 : 0 });
      vop(miniList, 1); tr(miniList, 340, 190, 1, -3);
      const cp = P(t, mid('gemma', 0.28), 0.45, pop);
      vop(gemCard, clamp(cp * 2.5)); tr(gemCard, 880, 190, Math.max(0.01, 0.7 + 0.3 * cp), 3);
      vop(gcGrey, P(t, mid('gemma', 0.42), 0.25, linear));
      vop(gcMass, P(t, mid('gemma', 0.56), 0.25, linear));
      ltGemV = win(t, at('gemma') + 0.15, at('gemma') + 3.4, 0.3);
      // the pause: Silas just looks at her
      const push = P(t, end('gemma') - 0.05, 0.9, linear);
      cam = [1 + 0.1 * push, 390, 460];
    }

    /* ---------------- please mind the gap ---------------- */
    if (sh === 'mind') {
      show(silas, 360, 470, 1.15, { talk: scTalk(S, t, 'silas'), mood: 'deadpan', look: t < at('mind') + 0.25 ? 0.6 : 0 });
      const push = P(t, end('mind') - 0.1, 1.6, ease);
      cam = [1 + 0.16 * push, 360, 420];
    }

    CAST.forEach(e => { if (e !== balloons && e !== hString) vop(e, shown.has(e) ? 1 : 0); });
    if (sh !== 'use') { vop(balloons, 0); vop(hString, 0); }
    phCam(cam[0], cam[1], cam[2]);
    ltAh.set(ltAhV); ltGem.set(ltGemV);
    for (const [el, v] of pend) op(el, v);
    camApply();
  };
});

/* Deficiency diseases and energy needs: a nutrient leaves the plate for months -> "deficiency disease"; a lack,
   not a germ -> four disease cards, each added to a tally: scurvy (gums, slow wounds, connective tissue), James
   Lind's 1747 trial at sea, rickets (bones bow) and vitamin D (gut absorbs calcium; fish, eggs, sunlight),
   anaemia (fewer red cells, less oxygen, pale and tired), constipation -> energy needs depend on five factors
   -> an office worker, a teenager and an athlete with their bars (showpiece) -> energy in vs out, balanced. */
scene('deficiency', S => {
  const { at, mid } = S, root = S.root, R = S.reduce;
  const AMP = R ? 0.3 : 1;
  const ORANGE = '#FF9F43', SUNY = '#FFD24A', RUST = '#E8726A', FIB = '#4FC37A';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  const wedge = (r, a0, a1) => `M0,0 L${(Math.cos(a0) * r).toFixed(1)},${(Math.sin(a0) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1) * r).toFixed(1)},${(Math.sin(a1) * r).toFixed(1)} Z`;
  const popIn = (el, t, t0, x, y, s) => { const p = P(t, t0, 0.5, pop); op(el, clamp(p * 2)); tr(el, x, y + (1 - clamp(p)) * 14, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p))); return p; };
  const lerpHex = (a, b, p) => { const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  // the same food icons as the diet chapter (about 90 px across at s = 1)
  function icon(parent, name, s) {
    const g = G(parent); if (s && s !== 1) tr(g, 0, 0, s);
    const pth = (d, f, st, sw, o) => E('path', Object.assign({ d, fill: f, stroke: st || 'none', 'stroke-width': sw || 3, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, o || {}), g);
    switch (name) {
      case 'bread': { const i = G(g); tr(i, 0, 12, 0.4); const d = 'M-95,95 L-95,-20 C-132,-40 -126,-112 -60,-112 C-30,-138 30,-138 60,-112 C126,-112 132,-40 95,-20 L95,95 Q95,107 83,107 L-83,107 Q-95,107 -95,95 Z'; E('path', { d, fill: '#C8833A', stroke: '#8A5221', 'stroke-width': 8, 'stroke-linejoin': 'round' }, i); E('path', { d, fill: '#F2C46E', transform: 'translate(0 6) scale(0.8)' }, i); break; }
      case 'meat': pth('M-44,-8 C-44,-34 -10,-40 14,-34 C40,-28 48,-6 40,14 C32,34 0,40 -20,32 C-40,24 -44,10 -44,-8 Z', '#C2414B', '#F7DCCF', 6); pth('M-16,-14 C0,-20 16,-14 18,0', 'none', '#E7909A', 4); E('circle', { cx: 18, cy: 8, r: 7, fill: '#F7EBDD', stroke: '#C9B79F', 'stroke-width': 2 }, g); break;
      case 'fish': pth('M-26,0 L-46,-18 L-42,0 L-46,18 Z', '#5E9CC4', '#2F6E96'); pth('M-30,0 C-14,-26 26,-26 42,0 C26,26 -14,26 -30,0 Z', '#7FB6D9', '#2F6E96'); pth('M-4,-14 C2,-6 2,6 -4,14', 'none', '#2F6E96', 3); E('circle', { cx: 26, cy: -5, r: 4, fill: '#10202B' }, g); break;
      case 'egg': E('ellipse', { cx: 0, cy: 2, rx: 27, ry: 35, fill: ball('#FFF6E6', '#D9C4A0'), stroke: '#C9B48A', 'stroke-width': 3 }, g); break;
      case 'butter': E('ellipse', { cx: 0, cy: 18, rx: 46, ry: 13, fill: '#C9D6DE', stroke: '#8FA6B4', 'stroke-width': 3 }, g); pth('M-32,-6 L-18,-20 L36,-20 L22,-6 Z', '#FFF0B0', '#C9A93E', 3); pth('M-32,-6 L22,-6 L22,16 L-32,16 Z M22,-6 L36,-20 L36,2 L22,16 Z', '#FFE27A', '#C9A93E', 3); break;
      case 'orange': E('circle', { cx: 0, cy: 4, r: 32, fill: ball('#FFA64D', '#D9701A'), stroke: '#C25E10', 'stroke-width': 3 }, g); pth('M2,-28 C14,-42 30,-38 30,-30 C22,-24 10,-24 2,-28 Z', '#5BBF4A', '#2F7F26', 2.5); E('circle', { cx: 0, cy: -27, r: 3, fill: '#8A4A10' }, g); break;
      case 'lemon': pth('M-36,4 C-36,-18 -14,-28 4,-26 C24,-24 38,-12 38,4 C38,22 20,30 2,30 C-18,30 -36,22 -36,4 Z', ball('#FFE45C', '#C9A80E'), '#A88A0A', 3); pth('M-36,4 L-44,2 M38,4 L46,6', 'none', '#A88A0A', 4); break;
      case 'milk': pth('M-24,-12 L0,-34 L24,-12 L24,38 L-24,38 Z', '#F7FAFC', '#A9BCD4', 3); pth('M-24,4 L24,4 L24,24 L-24,24 Z', '#5B8DEF', 'none'); pth('M-24,-12 L24,-12 M0,-34 L0,-24', 'none', '#A9BCD4', 3); break;
      case 'rbc': E('circle', { r: 26, fill: ball('#F05A66', '#9A1E2A'), stroke: '#FFB3BA', 'stroke-width': 2.5 }, g); E('ellipse', { rx: 12, ry: 11, fill: 'rgba(110,10,25,0.35)' }, g); break;
      case 'bone': pth('M-28,-7 C-34,-21 -52,-14 -45,-2 C-52,10 -36,20 -28,7 L28,7 C34,21 52,14 45,2 C52,-10 36,-20 28,-7 Z', '#F5EEDC', '#BFB39A', 3); break;
      case 'grain': pth('M2,44 C0,20 0,-10 2,-40', 'none', '#B8913F', 4); { let d = ''; for (let i = 0; i < 4; i++) { const y = -30 + i * 14; d += `M1,${y + 8} C-12,${y + 4} -16,${y - 8} -10,${y - 12} C-2,${y - 10} 1,${y - 2} 1,${y + 8} Z M3,${y + 8} C16,${y + 4} 20,${y - 8} 14,${y - 12} C6,${y - 10} 3,${y - 2} 3,${y + 8} Z `; } d += 'M2,-36 C-4,-46 0,-54 2,-56 C4,-54 8,-46 2,-36 Z'; pth(d, '#E3BE6A', '#A8812F', 2.5); } break;
      case 'drop': pth('M0,-38 C16,-14 28,2 28,16 A28,28 0 0 1 -28,16 C-28,2 -16,-14 0,-38 Z', ball('#8FE0F8', '#1D84A6'), '#1D84A6', 3); pth('M-12,10 C-12,2 -8,-6 -4,-10', 'none', '#E6F8FF', 4); break;
    }
    return g;
  }
  // a balance scale: pivot at (0,0); g.set(tilt degrees, + tips right down)
  function balance(parent, half) {
    const g = G(parent), H = half || 150;
    E('path', { d: 'M-60,190 L60,190 L44,172 L-44,172 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -7, y: -8, width: 14, height: 182, rx: 5, fill: '#AFC1CC' }, g);
    const beam = G(g);
    E('rect', { x: -H - 8, y: -7, width: 2 * H + 16, height: 14, rx: 7, fill: '#C9D6DE', stroke: '#8FA6B4', 'stroke-width': 2 }, beam);
    E('circle', { r: 13, fill: C.energy, stroke: '#B59B12', 'stroke-width': 3 }, g);
    const pan = () => {
      const p = G(g);
      E('path', { d: 'M0,0 L-52,86 M0,0 L52,86', stroke: '#C9D6DE', 'stroke-width': 3 }, p);
      E('path', { d: 'M-66,86 L66,86 Q60,108 0,110 Q-60,108 -66,86 Z', fill: '#8FA6B4', stroke: '#C9D6DE', 'stroke-width': 3, 'stroke-linejoin': 'round' }, p);
      p.load = G(p); tr(p.load, 0, 84);
      return p;
    };
    g.panL = pan(); g.panR = pan();
    g.set = a => {
      beam.setAttribute('transform', `rotate(${a.toFixed(2)})`);
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      tr(g.panL, -H * c, -H * s); tr(g.panR, H * c, H * s);
    };
    g.set(0);
    return g;
  }
  // a cartoon face, r = 50 at s = 1; g.set(health 0 sick/pale .. 1 well, tired 0..1)
  function face(parent, o) {
    o = o || {};
    const g = G(parent);
    const head = E('circle', { r: 50, stroke: '#7A5A44', 'stroke-width': 3 }, g);
    if (o.hat) E('path', { d: 'M-52,-22 C-50,-62 50,-62 52,-22 Z M-60,-22 L60,-22', fill: o.hat, stroke: '#1B2A35', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    const cheeks = G(g);
    E('circle', { cx: -26, cy: 14, r: 9, fill: '#FF7F8F', opacity: 0.6 }, cheeks); E('circle', { cx: 26, cy: 14, r: 9, fill: '#FF7F8F', opacity: 0.6 }, cheeks);
    const eyes = [E('ellipse', { cx: -17, cy: -6, rx: 6, ry: 7, fill: '#1B1208' }, g), E('ellipse', { cx: 17, cy: -6, rx: 6, ry: 7, fill: '#1B1208' }, g)];
    const lids = E('path', { d: 'M-25,-8 L-9,-8 M9,-8 L25,-8', stroke: '#7A5A44', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    const smile = E('path', { d: 'M-18,18 Q0,34 18,18', fill: 'none', stroke: '#5A2A22', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    const frown = E('path', { d: 'M-16,28 Q0,18 16,28', fill: 'none', stroke: '#5A2A22', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, g);
    g.set = (h, tired) => {
      head.setAttribute('fill', lerpHex(o.sick || '#D6D2A8', o.skin || '#E8B48E', h));
      op(cheeks, h); op(smile, h); op(frown, 1 - h);
      const k = 1 - 0.75 * clamp(tired || 0);
      eyes.forEach(e => attr(e, 'ry', 7 * k)); op(lids, clamp((tired || 0) * 2));
    };
    g.set(1, 0);
    return g;
  }
  function germ(parent) {
    const g = G(parent), pts = [];
    for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, r = i % 2 ? 46 : 58; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    E('path', { d: closedPath(pts), fill: ball('#8FE36A', '#3F9A2F'), stroke: '#2F7A22', 'stroke-width': 3 }, g);
    E('circle', { cx: -16, cy: -8, r: 10, fill: '#FFFFFF' }, g); E('circle', { cx: 16, cy: -8, r: 10, fill: '#FFFFFF' }, g);
    E('circle', { cx: -14, cy: -6, r: 5, fill: '#10202B' }, g); E('circle', { cx: 18, cy: -6, r: 5, fill: '#10202B' }, g);
    E('path', { d: 'M-16,18 Q0,28 16,18', fill: 'none', stroke: '#1F5E22', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    return g;
  }

  /* ================= A. a nutrient goes missing from the plate ================= */
  const NUTC = ['#F5B041', '#FF8A80', '#FFE27A', '#FF9F43', '#B48CFF', '#4FC37A', '#4CC9F0'];
  const NUTI = ['bread', 'meat', 'butter', 'orange', 'milk', 'grain', 'drop'];
  const PX = 330, PY = 450, SR = 150, IR = 92;
  const plate = G(root); tr(plate, PX, PY);
  E('circle', { cx: 8, cy: 14, r: 182, fill: 'rgba(0,0,0,0.28)' }, plate);
  E('circle', { r: 182, fill: '#E7EEF2', stroke: '#AFC1CC', 'stroke-width': 3 }, plate);
  E('circle', { r: 161, fill: '#F3F7F9', stroke: '#C9D6DE', 'stroke-width': 2 }, plate);
  let vitSec = null, vitIcon = null;
  NUTC.forEach((col, i) => {
    const am = -Math.PI / 2 + i * TAU / 7;
    const wp = E('path', { d: wedge(SR, am - TAU / 14, am + TAU / 14), fill: col, stroke: '#FFFFFF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, plate);
    const ic = G(plate); tr(ic, Math.cos(am) * IR, Math.sin(am) * IR); icon(ic, NUTI[i], 0.56);
    if (i === 3) { vitSec = wp; vitIcon = ic; vitIcon.home = [Math.cos(am) * IR, Math.sin(am) * IR]; }
  });
  const gapG = G(plate);
  { const am = -Math.PI / 2 + 3 * TAU / 7; E('path', { d: wedge(SR, am - TAU / 14, am + TAU / 14), fill: '#2A3F4C', stroke: '#9FB3C1', 'stroke-width': 3, 'stroke-dasharray': '9 7', 'stroke-linejoin': 'round' }, gapG); T(gapG, Math.cos(am) * IR, Math.sin(am) * IR + 18, '?', { size: 50, weight: 700, anchor: 'middle', fill: '#9FB3C1' }); }
  // months pass
  const cal = G(root); tr(cal, 850, 300);
  E('rect', { x: -90, y: -70, width: 180, height: 150, rx: 14, fill: '#F4F7FA', stroke: '#AFC1CC', 'stroke-width': 3 }, cal);
  E('rect', { x: -90, y: -70, width: 180, height: 44, rx: 14, fill: C.bad }, cal);
  E('rect', { x: -90, y: -40, width: 180, height: 14, fill: C.bad }, cal);
  E('path', { d: 'M-50,-84 L-50,-56 M50,-84 L50,-56', stroke: '#6B7A88', 'stroke-width': 8, 'stroke-linecap': 'round' }, cal);
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY'];
  const calTxt = MONTHS.map(m => T(cal, 0, 46, m, { size: 46, weight: 700, anchor: 'middle', fill: '#1B2A35' }));
  T(cal, 0, 116, 'months go by', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const defCard = G(root); tr(defCard, 860, 300);
  E('rect', { x: -250, y: -62, width: 500, height: 124, rx: 22, fill: C.card, stroke: C.bad, 'stroke-width': 3 }, defCard);
  T(defCard, 0, 16, 'deficiency disease', { size: 46, weight: 700, anchor: 'middle' });
  // a lack, not a germ
  const germG = G(root); tr(germG, 760, 520);
  germ(germG);
  const germX = cross(germG, 56);
  const lackT = rich(root, 860, 510, ['a ', ['lack', C.energy, 800], ','], { size: 36, weight: 600 });
  const notGerm = T(root, 860 + textWidth('a lack,', 36, FD, 700) + 12, 510, 'not a germ', { size: 36, weight: 600 });
  const catchT = T(root, 860, 556, 'so you can’t catch it', { size: 28, weight: 500, fill: C.muted });

  /* ================= B. the disease cards ================= */
  const TALLY = [['scurvy', 'orange', ORANGE], ['rickets', 'bone', SUNY], ['anaemia', 'rbc', RUST], ['constipation', 'grain', FIB]];
  const tally = TALLY.map(([nm, ic, col], i) => {
    const g = G(root); tr(g, 255 + i * 250, 146);
    const w = 220;
    const box = E('rect', { x: -w / 2, y: -26, width: w, height: 52, rx: 26, fill: C.card2, stroke: col, 'stroke-width': 3 }, g);
    const ig = G(g); tr(ig, -w / 2 + 30, 0); icon(ig, ic, 0.36);
    T(g, 18, 9, nm, { size: 26, weight: 700, anchor: 'middle' });
    return { g, box };
  });
  const dCard = card(root, 110, 196, 980, 490, { fill: C.card, stroke: C.line });
  const head = (parent, segs) => rich(parent, 600, 260, segs, { size: 40, weight: 600, anchor: 'middle' });

  // 1. scurvy
  const cSc = G(root);
  head(cSc, [['vitamin C', ORANGE, 800], ' → ', ['scurvy', C.ink, 800]]);
  const scOr = G(cSc); tr(scOr, 270, 400); icon(scOr, 'orange', 1.3);
  const scX = cross(scOr, 34);
  T(scOr, 0, 100, 'too little vitamin C', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const mouth = G(cSc); tr(mouth, 600, 398);
  E('path', { d: 'M-118,0 C-96,-62 96,-62 118,0 C96,62 -96,62 -118,0 Z', fill: '#4A1420', stroke: '#C9636F', 'stroke-width': 7 }, mouth);
  const gumTop = E('path', { d: 'M-96,-14 C-60,-44 60,-44 96,-14 L96,-6 C60,-30 -60,-30 -96,-6 Z', fill: '#F08A9A' }, mouth);
  const gumBot = E('path', { d: 'M-96,14 C-60,44 60,44 96,14 L96,6 C60,30 -60,30 -96,6 Z', fill: '#F08A9A' }, mouth);
  for (let k = 0; k < 6; k++) { const x = -70 + k * 28; E('rect', { x: x - 11, y: -28 + Math.abs(k - 2.5) * 3, width: 22, height: 24, rx: 6, fill: '#F7F1E3' }, mouth); E('rect', { x: x - 11, y: 6 - Math.abs(k - 2.5) * 1, width: 22, height: 22, rx: 6, fill: '#F7F1E3' }, mouth); }
  const blood = G(mouth);
  [[-58, -28], [-16, -33], [30, -32], [64, -26], [-40, 28], [10, 32], [52, 28]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#C21F34' }, blood));
  const drip = E('path', { d: 'M0,-6 C5,0 7,5 7,8 A7,7 0 0 1 -7,8 C-7,5 -5,0 0,-6 Z', fill: '#C21F34' }, mouth);
  T(mouth, 0, 102, 'bleeding gums', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const cut = G(cSc); tr(cut, 930, 398);
  E('rect', { x: -96, y: -54, width: 192, height: 108, rx: 30, fill: '#E8B48E', stroke: '#B9825A', 'stroke-width': 3 }, cut);
  const wound = E('path', { d: 'M-56,10 C-30,-4 -6,14 18,-2 C34,-12 46,-6 58,-14', fill: 'none', stroke: '#C21F34', 'stroke-linecap': 'round' }, cut);
  const clock = G(cut); tr(clock, 70, -62);
  E('circle', { r: 22, fill: C.card2, stroke: C.ink, 'stroke-width': 3 }, clock);
  const hand = E('line', { x1: 0, y1: 0, x2: 0, y2: -15, stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, clock);
  T(cut, 0, 102, 'slow-healing wounds', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  // connective tissue: strong wavy fibres, knitted together by cross-links
  const mesh = G(cSc); tr(mesh, 400, 602);
  let fd = '';
  for (let k = 0; k < 5; k++) { const y = -28 + k * 14; fd += `M-130,${y}`; for (let x = -130; x < 130; x += 26) fd += ` Q${x + 6.5},${y - 5} ${x + 13},${y} T${x + 26},${y}`; }
  const meshP = E('path', { d: fd, fill: 'none', stroke: '#F5D6C8', 'stroke-width': 5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, mesh);
  const meshX = E('path', { d: 'M-104,-30 L-92,30 M-56,-30 L-44,30 M-8,-30 L4,30 M40,-30 L52,30 M88,-30 L100,30', fill: 'none', stroke: '#E58AA2', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, mesh);
  const meshT = rich(cSc, 560, 612, ['makes healthy ', ['connective tissue', C.ink, 800]], { size: 28, weight: 500 });

  // 2. James Lind's trial
  const cLi = G(root);
  T(cLi, 150, 262, 'James Lind', { size: 40, weight: 700 });
  T(cLi, 150 + textWidth('James Lind', 40, FD, 700) + 16, 262, 'naval doctor', { size: 28, weight: 500, fill: C.muted });
  const y1747 = chip(cLi, '1747', { size: 34, fill: C.energy, color: C.bg0 }); tr(y1747, 1000, 250);
  const shipG = G(cLi);
  const sea2 = sineWave(cLi, { w: 440, amp: 9, wl: 110, color: '#1D84A6', width: 6 }); tr(sea2, 140, 548);
  // a square-rigged sailing ship of the 1700s
  const ship = G(shipG);
  E('path', { d: 'M-40,0 L-40,-198 M54,0 L54,-160', stroke: '#6B4A2A', 'stroke-width': 7, 'stroke-linecap': 'round' }, ship);
  const sailD = (x, y0, y1, w) => `M${x - w},${y0} Q${x},${y0 + 8} ${x + w},${y0} Q${x + w + 8},${(y0 + y1) / 2} ${x + w},${y1} Q${x},${y1 - 6} ${x - w},${y1} Q${x - w - 8},${(y0 + y1) / 2} ${x - w},${y0} Z `;
  E('path', { d: sailD(-40, -182, -126, 46) + sailD(-40, -116, -40, 56) + sailD(54, -148, -102, 38) + sailD(54, -94, -36, 46), fill: '#F4F0E4', stroke: '#C9C0A8', 'stroke-width': 3, 'stroke-linejoin': 'round' }, ship);
  E('path', { d: 'M-40,-198 L-6,-188 L-40,-178 Z', fill: C.bad }, ship);
  E('path', { d: 'M-132,-4 L134,-4 Q126,26 102,52 L-100,52 Q-124,26 -132,-4 Z', fill: '#8A5A34', stroke: '#5E3A1E', 'stroke-width': 4, 'stroke-linejoin': 'round' }, ship);
  E('path', { d: 'M-118,14 L120,14 M-70,30 a5,5 0 1 0 0.1,0 M-20,30 a5,5 0 1 0 0.1,0 M30,30 a5,5 0 1 0 0.1,0 M80,30 a5,5 0 1 0 0.1,0', fill: 'none', stroke: '#C9935A', 'stroke-width': 4 }, ship);
  const sea1 = sineWave(cLi, { w: 440, amp: 12, wl: 140, color: C.water, width: 7 }); tr(sea1, 140, 530);
  const crate = G(cLi);
  E('rect', { x: -40, y: -26, width: 80, height: 40, rx: 4, fill: '#B9844E', stroke: '#7A5230', 'stroke-width': 3 }, crate);
  E('path', { d: 'M-40,-6 L40,-6 M-14,-26 L-14,14 M14,-26 L14,14', stroke: '#7A5230', 'stroke-width': 3 }, crate);
  [['orange', -22, -36], ['lemon', 6, -38], ['orange', 26, -34]].forEach(([nm, x, y]) => { const e = G(crate); tr(e, x, y); icon(e, nm, 0.4); });
  const SAIL = [[656, 'sea water', false], [800, 'vinegar', false], [966, 'oranges & lemons', true]].map(([x, lab, cure]) => {
    const g = G(cLi); tr(g, x, 410);
    const f = face(g, { hat: '#2F4A7A' });
    T(g, 0, 96, lab, { size: 24, weight: 600, anchor: 'middle', fill: cure ? ORANGE : C.muted });
    const mark = cure ? tick(g, 18) : cross(g, 16); tr(mark, 0, 140);
    return { g, f, mark, cure, x };
  });
  const trialChip = chip(cLi, 'one of the first clinical trials', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(trialChip, 840, 626);

  // 3. rickets, then vitamin D
  const cRi = G(root);
  head(cRi, [['vitamin D', SUNY, 800], ' or ', ['calcium', '#F5EEDC', 800], ' → ', ['rickets', C.ink, 800]]);
  const legs = G(cRi); tr(legs, 440, 0);
  E('path', { d: 'M-96,310 L96,310 L104,388 L-104,388 Z', fill: '#5B8DEF', stroke: '#2D5E9A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, legs);
  const legSkin = [0, 1].map(() => E('path', { fill: 'none', stroke: 'rgba(232,180,142,0.35)', 'stroke-width': 58, 'stroke-linecap': 'round' }, legs));
  const legBone = [0, 1].map(() => E('path', { fill: 'none', stroke: '#F5EEDC', 'stroke-width': 18, 'stroke-linecap': 'round' }, legs));
  const knees = [0, 1].map(() => E('circle', { r: 15, fill: '#F5EEDC' }, legs));
  const feet = [0, 1].map(() => E('ellipse', { rx: 30, ry: 13, fill: '#E8B48E', stroke: '#B9825A', 'stroke-width': 3 }, legs));
  function setLegs(b, soft) {
    [-1, 1].forEach((sd, i) => {
      const hx = sd * 52, kx = sd * (52 + 46 * b), ax = sd * (46 + 4 * b);
      const d = `M${hx},392 Q${(hx + kx) / 2 + sd * 22 * b},${456} ${kx},${500} Q${(kx + ax) / 2 + sd * 22 * b},${560} ${ax},${618}`;
      legSkin[i].setAttribute('d', d); legBone[i].setAttribute('d', d);
      legBone[i].setAttribute('stroke', lerpHex('#F5EEDC', '#C9B89A', soft));
      attr(knees[i], 'cx', kx); attr(knees[i], 'cy', 500); knees[i].setAttribute('fill', lerpHex('#F5EEDC', '#C9B89A', soft));
      attr(feet[i], 'cx', ax + sd * 12); attr(feet[i], 'cy', 636);
    });
  }
  setLegs(0, 0);
  const riHead = T(cRi, 760, 350, 'children’s bones become', { size: 26, weight: 600, fill: C.muted });
  const riWords = [['soft', 420], ['weak', 490], ['bent', 560]].map(([w, y]) => { const c = chip(cRi, w, { size: 32, fill: C.card2, stroke: SUNY, color: C.ink }); tr(c, 780 + c.w / 2, y); return c; });
  // vitamin D: the gut absorbs calcium into the blood, on to the bones; sources
  const vd = G(cRi);
  const gutT = G(vd); tr(gutT, 0, 380);
  E('rect', { x: 170, y: -36, width: 360, height: 72, rx: 36, fill: '#3A1424', stroke: '#F4A6B8', 'stroke-width': 10 }, gutT);
  T(vd, 160, 390, 'gut', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  const dBadge = G(vd); tr(dBadge, 350, 416);
  E('circle', { r: 22, fill: SUNY, stroke: '#B59B12', 'stroke-width': 3 }, dBadge);
  T(dBadge, 0, 10, 'D', { size: 28, weight: 700, anchor: 'middle', fill: '#3A2E00' });
  const bigBone = G(vd); tr(bigBone, 350, 596); icon(bigBone, 'bone', 2.6);
  const boneFill = G(vd); tr(boneFill, 350, 596); E('path', { d: 'M-28,-7 C-34,-21 -52,-14 -45,-2 C-52,10 -36,20 -28,7 L28,7 C34,21 52,14 45,2 C52,-10 36,-20 28,-7 Z', fill: '#FFFFFF', transform: 'scale(2.6)' }, boneFill);
  T(vd, 160, 606, 'bone', { size: 26, weight: 600, anchor: 'end', fill: C.muted });
  const caBalls = [0, 1, 2, 3, 4, 5].map(k => E('circle', { r: 9, fill: ball('#FFFFFF', '#AFC1CC'), stroke: '#8FA6B4', 'stroke-width': 1.5 }, vd));
  const caLab = T(vd, 560, 396, 'calcium', { size: 26, weight: 700, fill: '#F5EEDC' });
  const srcs = [['fish', 700, 'oily fish'], ['egg', 845, 'eggs']].map(([nm, x, lab]) => { const g = G(vd); tr(g, x, 470); icon(g, nm, 0.85); T(g, 0, 80, lab, { size: 26, weight: 600, anchor: 'middle', fill: C.muted }); return g; });
  const sunG = G(vd); tr(sunG, 1000, 400);
  const sunA = sun(sunG, 34);
  const arm = G(vd); tr(arm, 990, 560);
  E('path', { d: 'M-78,30 L34,4', stroke: '#B9825A', 'stroke-width': 40, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M-78,30 L34,4', stroke: '#E8B48E', 'stroke-width': 34, 'stroke-linecap': 'round' }, arm);
  E('path', { d: 'M30,-14 C48,-24 74,-20 80,-6 C86,8 74,22 52,22 C40,22 30,16 28,8 Z M44,-16 C52,-34 64,-36 66,-28 C66,-22 58,-16 54,-12 Z', fill: '#E8B48E', stroke: '#B9825A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, arm);
  const rays = E('path', { d: 'M-8,-104 L-24,-30 M14,-100 L10,-28 M34,-92 L42,-30', stroke: SUNY, 'stroke-width': 4, 'stroke-dasharray': '8 8', 'stroke-linecap': 'round' }, arm);
  const dMade = [[-30, 10], [8, 4], [40, 0]].map(([x, y]) => { const g = G(arm); tr(g, x, y); E('circle', { r: 12, fill: SUNY, stroke: '#B59B12', 'stroke-width': 2 }, g); T(g, 0, 7, 'D', { size: 18, weight: 700, anchor: 'middle', fill: '#3A2E00' }); return g; });
  T(arm, 0, 76, 'skin + sunlight', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  // 4. anaemia
  const cAn = G(root);
  head(cAn, [['iron', RUST, 800], ' → ', ['anaemia', C.ink, 800]]);
  const vessel = G(cAn); tr(vessel, 0, 410);
  E('rect', { x: 150, y: -54, width: 600, height: 108, rx: 54, fill: '#5E1A26' }, vessel);
  E('rect', { x: 160, y: -44, width: 580, height: 88, rx: 44, fill: '#9C2C3A' }, vessel);
  const cellsA = [];
  for (let k = 0; k < 10; k++) {
    const g = G(vessel);
    E('ellipse', { rx: 24, ry: 15, fill: ball('#F05A66', '#9A1E2A'), stroke: '#FFB3BA', 'stroke-width': 2 }, g);
    const o2 = molO2(g, 7); tr(o2, 0, -1);
    cellsA.push({ g, keep: k % 3 === 0, ph: k / 10 });
  }
  T(cAn, 450, 494, 'red blood cells', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });
  const o2m = meter(cAn, { w: 420, h: 28, color: C.oxygen, label: 'oxygen carried', labelFill: '#FF9A8F', labelSize: 26 }); tr(o2m, 240, 584);
  const faceA = face(cAn, { sick: '#EFE7DC' }); tr(faceA, 930, 400, 1.35);
  const zzz = T(cAn, 1012, 330, 'z z', { size: 34, weight: 700, fill: C.muted });
  const anWords = [['tired', 870], ['pale', 995]].map(([w, x]) => { const c = chip(cAn, w, { size: 28, fill: C.card2, stroke: RUST }); tr(c, x, 560); return c; });

  // 5. constipation
  const cCo = G(root);
  head(cCo, [['fibre', FIB, 800], ' → ', ['constipation', C.ink, 800]]);
  const cg = G(cCo); tr(cg, 0, 440);
  const cLumen = E('path', { fill: '#3A1424' }, cg);
  const pellets = [[0, -6, 1], [44, 10, 0.85], [86, -2, 0.95]].map(([dx, dy, s], k) => { const e = E('path', { d: closedPath([[-16, -12], [6, -16], [18, -2], [12, 14], [-8, 16], [-18, 2]]), fill: ball('#6B4424', '#3A2410'), stroke: '#2A1808', 'stroke-width': 2 }, cg); return { e, dx, dy, s, k }; });
  const cWallT = E('path', { fill: 'none', stroke: '#F4A6B8', 'stroke-width': 16, 'stroke-linecap': 'round' }, cg);
  const cWallB = E('path', { fill: 'none', stroke: '#F4A6B8', 'stroke-width': 16, 'stroke-linecap': 'round' }, cg);
  const strain = E('path', { d: '', fill: 'none', stroke: C.energy, 'stroke-width': 4, 'stroke-linecap': 'round' }, cg);
  function cWalls(sq, k) {
    const top = [], bot = [];
    for (let x = 170; x <= 1030; x += 16) { const p = 34 * k * Math.exp(-Math.pow((x - sq) / 40, 2)); top.push([x, -52 + p]); bot.push([x, 52 - p]); }
    const f = pts => pts.map(p => p[0] + ',' + p[1].toFixed(1)).join('L');
    cWallT.setAttribute('d', 'M' + f(top)); cWallB.setAttribute('d', 'M' + f(bot));
    cLumen.setAttribute('d', 'M' + f(top) + 'L' + f(bot.slice().reverse()) + 'Z');
  }
  cWalls(0, 0);
  const coBulk = chip(cCo, 'without bulk', { size: 28, fill: C.card2, stroke: FIB }); tr(coBulk, 600, 560);
  const coStr = T(cCo, 600, 630, 'gut muscles struggle to push it along', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= C. energy needs ================= */
  const en = G(root);
  const AX0 = 170, AY = 640, AY1 = 236;
  E('path', { d: `M${AX0},${AY1} L${AX0},${AY} L1090,${AY}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, en);
  E('path', { d: `M${AX0 - 10},${AY1 + 14} L${AX0},${AY1} L${AX0 + 10},${AY1 + 14}`, fill: 'none', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, en);
  rich(en, AX0 + 20, AY1 + 12, [['energy', C.energy, 800], ' needed each day'], { size: 26, weight: 600 });
  const FACT = ['age', 'activity', 'body size', 'sex', 'pregnancy'];
  const fw = FACT.map(f => textWidth(f, 30, FD, 700) + 46), ftot = fw.reduce((a, b) => a + b, 0) + 18 * (FACT.length - 1);
  let fx = 600 - ftot / 2;
  const facts = FACT.map((f, i) => { const c = chip(root, f, { size: 30, w: fw[i], fill: C.card2, stroke: C.energy }); const x = fx + fw[i] / 2; fx += fw[i] + 18; return { c, x }; });
  const factAt = [0.36, 0.46, 0.65, 0.76, 0.88];
  // three people, bars behind them
  { const lg = E('linearGradient', { id: 'dgDefBar', x1: 0, y1: 0, x2: 0, y2: 1 }, defs()); E('stop', { offset: 0, 'stop-color': '#FFE45C', 'stop-opacity': 0.75 }, lg); E('stop', { offset: 1, 'stop-color': '#FFE45C', 'stop-opacity': 0.1 }, lg); }
  const PEOPLE = [
    { x: 330, h: 0.56, lab: 'office worker', at: 0.86, shirt: '#8FA6B4', s: 1 },
    { x: 620, h: 0.72, lab: 'teenager', at: 0.02, shirt: '#4FC37A', s: 0.84 },
    { x: 905, h: 1.0, lab: 'athlete', at: 0.6, shirt: '#E8424F', s: 1 },
  ].map(p => {
    const g = G(en);
    p.bar = E('rect', { x: p.x - 78, y: AY, width: 156, height: 0, rx: 10, fill: 'url(#dgDefBar)', stroke: C.energy, 'stroke-width': 3 }, g);
    p.sp = spark(g, 18, { seed: p.x });
    p.fig = G(g);
    p.lbl = T(en, p.x, 684, p.lab, { size: 28, weight: 700, anchor: 'middle' });
    return p;
  });
  // office worker: seated at a desk
  const OW = PEOPLE[0];
  E('path', { d: 'M-46,-44 L4,-44 M-40,-44 L-40,0 M0,-44 L0,0 M-46,-44 L-50,-110', stroke: '#6B7A88', 'stroke-width': 7, 'stroke-linecap': 'round' }, OW.fig);
  OW.p = person(OW.fig, { shirt: OW.shirt, shorts: '#3D4E5C', hair: '#3A2A1E', skin: '#D9A27A' }); tr(OW.p, -20, 47);
  OW.p.pose({ lean: 4, legL: [88, -88], legR: [92, -92], armL: [60, 60], armR: [70, 50] });
  E('path', { d: 'M44,-78 L140,-78 M56,-78 L56,0 M128,-78 L128,0', stroke: '#8FA6B4', 'stroke-width': 7, 'stroke-linecap': 'round' }, OW.fig);
  E('path', { d: 'M66,-80 L104,-80 L112,-112 L76,-112 Z', fill: '#AFC1CC', stroke: '#DDE6EC', 'stroke-width': 2, 'stroke-linejoin': 'round' }, OW.fig);
  // teenager: standing, growing
  const TN = PEOPLE[1];
  TN.p = person(TN.fig, { shirt: TN.shirt, shorts: '#2D5E9A', hair: '#2B1D14', skin: '#C98E62' }); tr(TN.p, 0, 0, TN.s);
  const growA = arrow(TN.fig, 62, -40, 62, -150, { color: FIB, width: 5 });
  // athlete: running
  const AT = PEOPLE[2];
  AT.p = person(AT.fig, { shirt: AT.shirt, shorts: '#1B2A35', hair: '#2B1D14', skin: '#8D5A3C' });
  const speed = E('path', { d: 'M-80,-120 L-50,-120 M-92,-90 L-56,-90 M-80,-60 L-48,-60', stroke: C.muted, 'stroke-width': 4, 'stroke-linecap': 'round' }, AT.fig);

  /* ================= D. energy in vs energy out ================= */
  const bl = G(root);
  const bs = balance(bl, 170); tr(bs, 470, 330);
  const inL = G(bs.panL.load); [['bread', -26, -18, -8], ['butter', 24, -16, 6], ['meat', -4, -44, 0]].forEach(([nm, x, y, r]) => { const g = G(inL); tr(g, x, y, 1, r); icon(g, nm, 0.42); });
  const outL = G(bs.panR.load); const outSp = spark(outL, 18, { seed: 5 }); tr(outSp, 0, -28);
  const blIn = T(bl, 0, 0, 'energy in', { size: 28, weight: 700, anchor: 'middle' });
  const blOut = T(bl, 0, 0, 'energy out', { size: 28, weight: 700, anchor: 'middle' });
  // a simple person who widens, thins and tires
  const fig = G(bl); tr(fig, 950, 470);
  const figLegs = E('path', { stroke: '#3D4E5C', 'stroke-width': 18, 'stroke-linecap': 'round', fill: 'none' }, fig);
  const figArms = E('path', { stroke: '#5B8DEF', 'stroke-width': 14, 'stroke-linecap': 'round', fill: 'none' }, fig);
  const figBody = E('ellipse', { cx: 0, cy: 10, ry: 78, fill: '#5B8DEF', stroke: '#2D5E9A', 'stroke-width': 3 }, fig);
  const figFace = face(fig, { sick: '#EFE7DC' }); tr(figFace, 0, -112, 0.8);
  const blMsg = [['gain weight', C.bad], ['lose weight, feel tired', '#9FD8FF']].map(([w, col]) => { const c = chip(bl, w, { size: 28, fill: C.card2, stroke: col }); tr(c, 950, 680); return c; });
  const balChip = G(bl); tr(balChip, 950, 680);
  { const c = chip(balChip, 'balance', { size: 32, fill: 'rgba(86,214,155,0.18)', stroke: C.good, color: C.good }); const tk = tick(balChip, 14); tr(tk, -c.w / 2 - 26, -2); }

  /* ================= timing ================= */
  const tLi = at('lind'), tRi = at('rickets'), tSun = at('sun'), tAn = at('anaemia'), tCo = at('constipation'), tEn = at('energy'), tTe = at('teen'), tBa = at('balance');
  const DIS = [[at('scurvy'), tRi], [tRi, tAn], [tAn, tCo], [tCo, tEn]];

  return t => {
    /* --- A. missing, germ --- */
    const aA = Math.min(P(t, S.first - 0.1, 0.4, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear));
    op(plate, aA);
    if (aA > 0) {
      const lv = P(t, mid('missing', 0.16), 1.3, easeOut);
      tr(vitIcon, vitIcon.home[0] + 120 * lv, vitIcon.home[1] - 260 * lv, 1, 40 * lv);
      op(vitIcon, 1 - P(t, mid('missing', 0.16) + 0.6, 0.6, linear));
      op(vitSec, 1 - P(t, mid('missing', 0.16) + 0.2, 0.4, linear));
      op(gapG, P(t, mid('missing', 0.16) + 0.3, 0.4, linear) * (0.75 + 0.25 * (t > at('germ') ? wave(t, 1.1) : 1)));
      tr(plate, PX, PY, 1 + 0.03 * Math.sin(Math.PI * P(t, mid('germ', 0.05), 0.8, linear)));
    }
    const aCal = win(t, mid('missing', 0.36), mid('missing', 0.74), 0.35);
    op(cal, aCal);
    if (aCal > 0) {
      const f = P(t, mid('missing', 0.4), mid('missing', 0.72) - mid('missing', 0.4), linear) * (MONTHS.length - 1);
      calTxt.forEach((e, i) => op(e, clamp(1 - Math.abs(f - i) * 2.2)));
      tr(cal, 850, 300 + (1 - P(t, mid('missing', 0.36), 0.4, easeOut)) * 20);
    }
    const aDef = Math.min(P(t, mid('missing', 0.74), 0.5, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear));
    op(defCard, aDef);
    if (aDef > 0) tr(defCard, 860, 300, 0.85 + 0.15 * P(t, mid('missing', 0.74), 0.5, pop));
    const aG = Math.min(P(t, mid('germ', 0.42), 0.45, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear));
    op(germG, aG);
    if (aG > 0) {
      tr(germG, 760, 520 + Math.sin(t * 2.2) * 5 * AMP, 1, Math.sin(t * 1.4) * 6 * AMP);
      const xp = P(t, mid('germ', 0.6), 0.35, pop); op(germX, clamp(xp * 2)); tr(germX, 0, 0, Math.max(0.01, xp));
    }
    op(lackT, Math.min(P(t, mid('germ', 0.2), 0.4, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear)));
    op(notGerm, Math.min(P(t, mid('germ', 0.46), 0.4, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear)));
    op(catchT, Math.min(P(t, mid('germ', 0.72), 0.4, linear), 1 - P(t, at('scurvy') - 0.35, 0.4, linear)));

    /* --- B. the disease cards and their tally --- */
    const aCards = Math.min(P(t, at('scurvy') - 0.2, 0.4, linear), 1 - P(t, tEn - 0.3, 0.4, linear));
    op(dCard, aCards);
    tally.forEach((tl, i) => {
      const p = P(t, DIS[i][0] + 0.1, 0.5, pop), on = win(t, DIS[i][0], DIS[i][1] - 0.1, 0.3);
      op(tl.g, clamp(p * 2) * aCards);
      if (p > 0) tr(tl.g, 255 + i * 250, 146, Math.max(0.01, (0.7 + 0.3 * p) * (1 + 0.06 * on)));
      tl.box.setAttribute('fill', on > 0.5 ? '#25566C' : C.card2);
      tl.box.setAttribute('stroke-width', (3 + 2 * on).toFixed(1));
    });
    const show = (el, a, b) => { const v = win(t, a, b, 0.32); op(el, v); return v; };
    // scurvy (turns edge-on as the card flips over to Lind)
    if (show(cSc, at('scurvy') - 0.05, tLi - 0.05) > 0) {
      const f0 = Math.abs(Math.cos(P(t, tLi - 0.3, 0.6, linear) * Math.PI));
      if (t > tLi - 0.32) cSc.setAttribute('transform', `translate(600 0) scale(${Math.max(0.02, f0).toFixed(3)} 1) translate(-600 0)`); else cSc.removeAttribute('transform');
      popIn(scOr, t, mid('scurvy', 0.02), 270, 400);
      const xp = P(t, mid('scurvy', 0.08), 0.35, pop); op(scX, clamp(xp * 2)); tr(scX, 0, 0, Math.max(0.01, xp));
      popIn(mouth, t, mid('scurvy', 0.2), 600, 398);
      const bl_ = P(t, mid('scurvy', 0.29), 0.5, linear);
      op(blood, bl_); gumTop.setAttribute('fill', lerpHex('#F08A9A', '#D9455C', bl_)); gumBot.setAttribute('fill', lerpHex('#F08A9A', '#D9455C', bl_));
      const dq = ((t - mid('scurvy', 0.33)) / 1.6) % 1;
      tr(drip, -16, -20 + 34 * dq); op(drip, bl_ * Math.sin(Math.PI * clamp(dq)));
      popIn(cut, t, mid('scurvy', 0.41), 930, 398);
      const heal = P(t, mid('scurvy', 0.46), 4, linear);
      attr(wound, 'stroke-width', 9 - 2 * heal); wound.setAttribute('stroke', lerpHex('#C21F34', '#D9666E', heal));
      hand.setAttribute('transform', `rotate(${((t - mid('scurvy', 0.41)) * 220 * AMP).toFixed(1)})`);
      op(mesh, P(t, mid('scurvy', 0.65), 0.3, linear));
      meshP.setAttribute('stroke-dashoffset', (1 - P(t, mid('scurvy', 0.66), 1.4, linear)).toFixed(4));
      op(meshX, P(t, mid('scurvy', 0.84), 0.5, linear));
      op(meshT, P(t, mid('scurvy', 0.7), 0.4, linear));
    }
    // Lind: the card flips to the ship and the trial
    const flip = P(t, tLi - 0.3, 0.6, linear);
    const fl = Math.abs(Math.cos(flip * Math.PI));
    if (t > tLi - 0.35 && t < tLi + 0.35) dCard.setAttribute('transform', `translate(600 0) scale(${Math.max(0.02, fl).toFixed(3)} 1) translate(-600 0)`);
    else dCard.removeAttribute('transform');
    const aLi = Math.min(P(t, tLi, 0.3, linear), 1 - P(t, tRi - 0.35, 0.3, linear));
    op(cLi, aLi);
    if (aLi > 0) {
      cLi.setAttribute('transform', t < tLi + 0.3 ? `translate(600 0) scale(${Math.max(0.02, fl).toFixed(3)} 1) translate(-600 0)` : '');
      sea1.set({ phase: t * 0.35 * AMP }); sea2.set({ phase: -t * 0.25 * AMP + 0.3 });
      tr(ship, 330, 500 + Math.sin(t * 1.6) * 5 * AMP, 1, Math.sin(t * 1.2) * 2.5 * AMP);
      popIn(y1747, t, mid('lind', 0.28), 1000, 250);
      // the crate comes aboard, then the oranges reach the sailor
      const cp = P(t, mid('lind', 0.46), 1.0, easeOut);
      const cx = lerp(80, 300, cp), cy = lerp(300, 474, cp) - Math.sin(Math.PI * cp) * 60;
      tr(crate, cx, cy + Math.sin(t * 1.6) * 5 * AMP * cp);
      op(crate, clamp(cp * 4));
      SAIL.forEach((s, i) => {
        popIn(s.g, t, mid('lind', 0.06 + i * 0.05), s.x, 410);
        const cure = s.cure ? P(t, mid('lind', 0.62), 1.1, linear) : 0;
        s.f.set(cure, s.cure ? 0 : 0.3);
        const m = P(t, mid('lind', 0.7) + i * 0.12, 0.4, pop); op(s.mark, clamp(m * 2)); tr(s.mark, 0, 140, Math.max(0.01, m));
      });
      popIn(trialChip, t, mid('lind', 0.8), 840, 626);
    }
    // rickets, then vitamin D
    if (show(cRi, tRi - 0.05, tAn - 0.05) > 0) {
      const aL = 1 - P(t, tSun - 0.2, 0.4, linear);
      op(legs, aL); op(riHead, Math.min(P(t, mid('rickets', 0.5), 0.4, linear), aL));
      const bend = P(t, mid('rickets', 0.86), 1.0, easeOut), soft = P(t, mid('rickets', 0.74), 0.6, linear);
      setLegs(bend, soft);
      riWords.forEach((c, i) => { const p = P(t, mid('rickets', [0.74, 0.83, 0.89][i]), 0.4, pop); op(c, clamp(p * 2) * aL); tr(c, 780 + c.w / 2, [420, 490, 560][i], Math.max(0.01, 0.8 + 0.2 * p)); });
      const aV = P(t, tSun - 0.1, 0.4, linear);
      op(vd, aV);
      if (aV > 0) {
        popIn(dBadge, t, mid('sun', 0.04), 350, 416);
        const fillB = P(t, mid('sun', 0.26), 1.8, linear);
        op(boneFill, fillB * 0.85);
        // calcium drifts along the gut to the vitamin D "door", passes through the wall and down into the bone
        caBalls.forEach((b, k) => {
          const u = ((Math.max(0, t - mid('sun', 0.1))) / 2.4 + k / 6) % 1, x0 = 200 + ((k * 113) % 300);
          let x, y;
          if (u < 0.5) { const q = ease(u / 0.5); x = lerp(x0, 350, q); y = 380 + Math.sin(t * 2 + k) * 10 * (1 - q); }
          else { const q = ease((u - 0.5) / 0.5); x = 350 + (k - 2.5) * 14 * q; y = lerp(392, 590, q); }
          attr(b, 'cx', x); attr(b, 'cy', y);
          op(b, P(t, mid('sun', 0.08), 0.4, linear) * Math.min(1, u * 8, (1 - u) * 6));
        });
        op(caLab, P(t, mid('sun', 0.24), 0.4, linear));
        srcs.forEach((g, i) => popIn(g, t, mid('sun', [0.58, 0.66][i]), [700, 845][i], 470));
        const sp = popIn(sunG, t, mid('sun', 0.76), 1000, 400); sunA.upd(t);
        popIn(arm, t, mid('sun', 0.78), 990, 560);
        op(rays, clamp(sp) * (0.6 + 0.4 * wave(t, 0.8)));
        rays.setAttribute('stroke-dashoffset', (-t * 30 * AMP).toFixed(1));
        dMade.forEach((g, i) => popIn(g, t, mid('sun', 0.85 + i * 0.04), [-30, 8, 40][i], [10, 4, 0][i]));
      }
    }
    // anaemia
    if (show(cAn, tAn - 0.05, tCo - 0.05) > 0) {
      const fewer = P(t, mid('anaemia', 0.3), 1.2, linear);
      cellsA.forEach((c, k) => {
        const u = (t * 0.09 * (R ? 0.5 : 1) + c.ph) % 1;
        tr(c.g, 190 + u * 520, Math.sin(u * 18 + k) * 10);
        op(c.g, Math.min(1, u * 10, (1 - u) * 10) * (c.keep ? 1 : 1 - fewer));
      });
      op(o2m, P(t, mid('anaemia', 0.48), 0.4, linear));
      o2m.set(1 - 0.62 * P(t, mid('anaemia', 0.52), 1.4, easeOut));
      const tired = P(t, mid('anaemia', 0.78), 0.8, linear), pale = P(t, mid('anaemia', 0.88), 0.8, linear);
      faceA.set(1 - pale, tired);
      op(zzz, tired * (0.5 + 0.5 * wave(t, 1.4))); tr(zzz, 0, -10 * wave(t, 1.4) * AMP);
      anWords.forEach((c, i) => popIn(c, t, mid('anaemia', [0.82, 0.93][i]), [870, 995][i], 560));
    }
    // constipation
    if (show(cCo, tCo - 0.05, tEn - 0.1) > 0) {
      const sqT = (t - mid('constipation', 0.6)) / 1.6;
      const k = t > mid('constipation', 0.58) ? Math.sin(Math.PI * (sqT % 1)) : 0;
      const sq = 380 + (sqT % 1) * 120;
      cWalls(sq, k);
      const push = k * 6;
      pellets.forEach(p => { tr(p.e, 560 + p.dx + push + Math.sin(t * 9 + p.k) * 1.5 * AMP * k, p.dy, p.s, Math.sin(t * 3 + p.k) * 6); });
      strain.setAttribute('d', k > 0.3 ? `M${sq - 20},-92 l-10,-14 M${sq},-96 l0,-16 M${sq + 20},-92 l10,-14` : '');
      op(strain, k);
      popIn(coBulk, t, mid('constipation', 0.45), 600, 560);
      op(coStr, P(t, mid('constipation', 0.62), 0.4, linear));
    }

    /* --- C. energy needs --- */
    const aEn = Math.min(P(t, tEn - 0.1, 0.45, linear), 1 - P(t, tBa - 0.25, 0.4, linear));
    op(en, aEn);
    facts.forEach((f, i) => {
      const p = P(t, mid('energy', factAt[i]), 0.45, pop);
      const hl = i === 0 ? win(t, tTe, mid('teen', 0.52), 0.3) : i === 1 ? win(t, mid('teen', 0.56), tBa - 0.3, 0.3) : 0;
      op(f.c, clamp(p * 2) * aEn);
      if (p > 0) tr(f.c, f.x, 176, Math.max(0.01, (0.7 + 0.3 * p) * (1 + 0.1 * hl)));
      f.c.box.setAttribute('fill', hl > 0.5 ? '#5C5320' : C.card2);
    });
    if (aEn > 0) {
      PEOPLE.forEach(p => {
        const t0 = mid('teen', p.at), ap = P(t, t0 - 0.1, 0.4, linear);
        op(p.fig, ap); op(p.lbl, ap);
        const hb = 404 * p.h * P(t, t0 + 0.15, 1.3, easeOut);
        attr(p.bar, 'y', AY - hb); attr(p.bar, 'height', hb); op(p.bar, ap);
        tr(p.sp, p.x, AY - hb); op(p.sp, ap * clamp(hb / 60)); p.sp.upd(t);
        tr(p.fig, p.x, AY);
      });
      { const sw = Math.sin(t * 1.4) * 4 * AMP; TN.p.pose({ lean: 0, armL: [8 + sw, 10], armR: [-8 - sw, 10] }); }
      growA.set(P(t, mid('teen', 0.2), 0.8)); op(growA, P(t, mid('teen', 0.2), 0.2, linear));
      AT.p.pose(runPose(t * AMP + (R ? 0.2 : 0), 1.6)); op(speed, 0.4 + 0.6 * wave(t, 0.4));
      tr(AT.p, 0, -Math.abs(Math.sin(t * TAU * 1.6)) * 8 * AMP);
    }

    /* --- D. energy in vs out --- */
    const aB = P(t, tBa - 0.2, 0.45, linear);
    op(bl, aB);
    if (aB > 0) {
      // energy in heavier (left pan down), then energy out heavier, then level
      const tipIn = P(t, mid('balance', 0.05), 0.9, easeOut), tipOut = P(t, mid('balance', 0.45), 0.9, easeOut), lev = P(t, mid('balance', 0.84), 0.8, easeOut);
      const a = lev > 0 ? lerp(16, 0, lev) : (-16 * tipIn + 32 * tipOut);
      bs.set(a + (R ? 0 : 0.8 * Math.sin(t * 3)));
      outSp.upd(t);
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
      tr(blIn, 470 - 170 * c, 330 - 170 * s + 140); tr(blOut, 470 + 170 * c, 330 + 170 * s + 140);
      // the person: wider, then thinner and tired, then back to normal
      const wide = P(t, mid('balance', 0.26), 0.8, easeOut) * (1 - tipOut), thin = tipOut * (1 - lev);
      const rx = 52 + 26 * wide - 18 * thin;
      attr(figBody, 'rx', rx);
      figArms.setAttribute('d', `M${-rx + 8},-36 L${-rx - 22},40 M${rx - 8},-36 L${rx + 22},40`);
      figLegs.setAttribute('d', `M${-rx * 0.42},70 L${-rx * 0.46},150 M${rx * 0.42},70 L${rx * 0.46},150`);
      const tiredB = P(t, mid('balance', 0.6), 0.6, linear) * (1 - lev);
      figFace.set(1 - tiredB * 0.8, tiredB);
      op(blMsg[0], win(t, mid('balance', 0.3), mid('balance', 0.46), 0.25));
      op(blMsg[1], win(t, mid('balance', 0.62), mid('balance', 0.84), 0.25));
      popIn(balChip, t, mid('balance', 0.88), 950, 680);
    }
  };
});

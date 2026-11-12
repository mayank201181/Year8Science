/* PASS IT ON, scene 3: "Belle in a jar".
   Shots (hard cuts): the science lab, an empty bell jar -> the corridor: Belle (lower third) -> she rings, the
   students groan -> Nigel's confessional (least popular sounds) -> the bell-jar experiment: Belle hangs inside,
   rings, everyone hears -> the vacuum pump takes the air (Nigel's cousins wave goodbye) -> quieter and quieter,
   but you can still SEE the hammer -> close on Belle: "Can anyone hear me?" -> VACUUM = no particles -> light
   needs no medium -> the air comes back, the class cheers -> Belle, tearful and happy -> space is silent ->
   astronauts use radio -> Archie's rhyme, and Nigel's reluctant nod. */
scene('jar', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.4 : 1;
  const talk = (t, who) => scTalk(S, t, who);

  /* ---------- local helpers (prefixed jar) ---------- */
  function jarLabel(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 32, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function jarBig(parent, text, fill, color, size) { return chip(parent, text, { size: size || 44, fill, color: color || '#FFFFFF', stroke: '#FFFFFF', sw: 4 }); }
  const jarPop = (el, p, x, y, s, r) => { op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); };
  const jarCam = (g, k, fx, fy, px, py) => g.setAttribute('transform', `translate(${(px ?? fx).toFixed(1)} ${(py ?? fy).toFixed(1)}) scale(${k.toFixed(4)}) translate(${-fx} ${-fy})`);
  function jarEar(parent) {
    const g = G(parent);
    E('path', { d: 'M-10,-60 Q50,-66 54,-8 Q56,30 24,44 Q10,52 12,70 Q4,86 -14,76 Q-28,66 -18,46 Q-6,26 -22,10 Q-44,-20 -10,-60 Z', fill: '#E0B48A', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-2,-34 Q30,-36 30,-6 Q30,14 10,22', fill: 'none', stroke: '#A8683F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function jarEye(parent) {
    const g = G(parent);
    E('path', { d: 'M-70,0 Q0,-56 70,0 Q0,56 -70,0 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('circle', { r: 26, fill: '#3E7CC7', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('circle', { r: 12, fill: SC_INK }, g); E('circle', { cx: 8, cy: -8, r: 5, fill: '#FFFFFF' }, g);
    return g;
  }
  function jarTick(parent, x, y) { const g = G(parent); E('circle', { r: 28, fill: C.good, stroke: '#FFFFFF', 'stroke-width': 4 }, g); tick(g, 14, '#FFFFFF'); tr(g, x, y); return g; }
  function jarAstronaut(parent, col) {
    const g = G(parent);
    E('rect', { x: -58, y: -40, width: 30, height: 80, rx: 10, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4 }, g);   // backpack
    E('path', { d: 'M-34,30 L-44,110 L-14,112 L-6,50 M34,30 L44,110 L14,112 L6,50', fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -44, y: -50, width: 88, height: 100, rx: 28, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('path', { d: 'M-40,-20 Q-80,10 -70,50 M40,-20 Q80,0 86,-40', fill: 'none', stroke: '#F2F7FA', 'stroke-width': 18, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -20, y: -6, width: 40, height: 26, rx: 4, fill: col || '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, g);
    E('circle', { cy: -84, r: 50, fill: '#F2F7FA', stroke: SC_INK, 'stroke-width': 5 }, g);
    E('ellipse', { cy: -82, rx: 36, ry: 30, fill: linGrad('#2B5A8A', '#0E1F33', true), stroke: SC_INK, 'stroke-width': 3 }, g);
    E('ellipse', { cx: -12, cy: -94, rx: 10, ry: 6, fill: '#FFFFFF', opacity: 0.5 }, g);
    return g;
  }
  function jarN2(parent, x, y, size, col) {   // "N2" with a real subscript
    const t = E('text', { x, y, 'font-size': size, 'font-weight': 800, fill: col, 'text-anchor': 'middle', 'font-family': FD }, parent);
    E('tspan', {}, t).textContent = 'N';
    const s = E('tspan', { 'font-size': Math.round(size * 0.62), dy: Math.round(size * 0.24) }, t); s.textContent = '2';
    return t;
  }

  /* ---------- the shot list (hard cuts) ---------- */
  const SH = [
    ['lab', -1e9], ['belle', at('belle') - 0.06], ['nobody', at('nobody') - 0.06], ['thnigel', at('thnigel') - 0.06], ['jar', at('jar') - 0.06],
    ['pump', at('pump') - 0.06], ['quiet', at('quiet') - 0.06], ['still', at('still') - 0.06], ['vacuum', at('vacuum') - 0.06],
    ['lightok', at('lightok') - 0.06], ['back', at('back') - 0.06], ['happy', at('happy') - 0.06], ['space', at('space') - 0.06],
    ['radio', at('radio') - 0.06], ['rhyme', at('rhyme') - 0.06],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const t0Of = id => SH.find(s => s[0] === id)[1];

  // the air in the jar, over the whole chapter (one continuous experiment)
  const airAt = t => {
    if (t < at('pump') + 0.3) return 1;
    if (t < at('quiet')) return lerp(1, 0.15, P(t, at('pump') + 0.3, end('pump') - at('pump') - 0.3, linear));
    if (t < at('back') + 0.2) return lerp(0.15, 0, P(t, at('quiet'), mid('quiet', 0.8) - at('quiet'), linear));
    return P(t, at('back') + 0.2, 1.6, ease);
  };
  const ringAt = t => (t > mid('jar', 0.5) ? AMP : 0);

  const Lbg = G(root), Lcam = G(root), Lmid = G(root), Lcast = G(root), Lfg = G(root), Lhud = G(root);

  /* ---------- the lab (inside a camera group so we can push in on Belle) ---------- */
  const labG = G(Lcam); pioLab(labG);
  const JX = 640, JY = 384, JS = 0.9;   // jar placement
  const jarW = G(labG); const jar = pioJar(jarW); tr(jarW, JX, JY, JS);
  E('line', { x1: 0, y1: -262, x2: 0, y2: -132, stroke: '#9AA6B2', 'stroke-width': 4 }, jar.inside);   // the hanger
  const belleJ = cast(jar.inside, 'belle', { s: 0.6 }); tr(belleJ, 0, -40, 0.6);
  // Belle's tear (inside her bobbing group, under her right eye)
  const tear = E('path', { d: 'M0,-20 Q15,4 0,15 Q-15,4 0,-20 Z', fill: '#DFF6FF', stroke: '#2E8BC0', 'stroke-width': 3 }, belleJ.firstChild);
  const BELLE_W = [JX, JY - 40 * JS];   // Belle's centre on the stage
  // cousins (little N2 molecules) sucked down the tube towards the pump
  const cousins = [0, 1, 2].map(() => { const c = cast(jarW, 'nigel', { s: 0.2, mood: 'happy' }); return c; });
  const byes = [0, 1].map(i => T(jarW, 0, 0, 'bye!', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' }));
  // Year 8 heads in the foreground
  const heads = G(labG), headL = [];
  [[120, 0], [330, 1], [960, 2], [1130, 3]].forEach(([x, i]) => {
    const h = G(heads); E('path', { d: 'M-90,120 Q-90,20 0,20 Q90,20 90,120 Z', fill: '#24323C' }, h); E('circle', { cy: -30, r: 52, fill: '#2E3E4A' }, h);
    const arms = E('path', { d: 'M-70,40 L-110,-80 M70,40 L110,-80', stroke: '#24323C', 'stroke-width': 26, 'stroke-linecap': 'round' }, h);
    headL.push({ h, x, i, arms });
  });
  const cheer = T(labG, 0, 0, 'YAY!', { size: 64, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  cheer.setAttribute('stroke', SC_INK); cheer.setAttribute('stroke-width', 8); cheer.setAttribute('paint-order', 'stroke');
  const confetti = G(labG), conf = [];
  { const r = rng(55), cols = ['#FF5FA2', '#FFE45C', '#56D69B', '#4CC9F0', '#B48CFF']; for (let i = 0; i < 40; i++) conf.push({ el: E('rect', { x: -7, y: -4, width: 14, height: 8, fill: cols[i % 5] }, confetti), x: r() * 1200, v: 160 + r() * 160, d: r() * 2, a: r() * 360 }); }
  const dimLab = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A1520', opacity: 0.45 }, labG);

  /* lab overlays */
  const labChip = jarLabel(Lfg, 'Year 8 science lab', { size: 32 });
  const bellQ = jarBig(Lfg, '+ a bell', '#C93A3A', '#FFFFFF', 34);
  const expChip = jarBig(Lfg, 'BELL-JAR EXPERIMENT', '#2E7DD8', '#FFFFFF', 38);
  const sides = G(Lfg);
  E('path', { d: `M${JX + 70},${BELLE_W[1]} L${JX + 150},${BELLE_W[1]}`, stroke: '#FFE45C', 'stroke-width': 4, 'stroke-dasharray': '6 6' }, sides);
  E('path', { d: `M${JX - 70},${BELLE_W[1]} L${JX - 150},${BELLE_W[1]}`, stroke: '#FFE45C', 'stroke-width': 4, 'stroke-dasharray': '6 6' }, sides);
  { const c = jarLabel(sides, 'not touching the sides', { size: 28, color: '#FFE45C', stroke: '#FFE45C' }); tr(c, 1000, 240); E('path', { d: `M860,250 L${JX + 152},${BELLE_W[1] - 4}`, stroke: '#FFE45C', 'stroke-width': 3 }, sides); }
  const hearG = G(Lfg); { const e = jarEar(hearG); tr(e, 0, 0, 1); jarTick(hearG, 60, -60); const c = jarLabel(hearG, 'everyone hears her', { size: 28 }); tr(c, 0, 120); }
  const pumpChip = jarBig(Lfg, 'VACUUM PUMP', '#5A6B7A', '#FFFFFF', 34);
  const pumpSub = jarLabel(Lfg, 'removes the air', { size: 30 });
  const cousinL = G(Lfg); { const c = jarLabel(cousinL, 'Nigel’s cousins', { size: 30, color: '#9FD8FF', stroke: '#9FD8FF' }); const b = G(cousinL); tr(b, c.w / 2 + 46, 0); E('circle', { r: 34, fill: '#2F56C2', stroke: '#FFFFFF', 'stroke-width': 3 }, b); jarN2(b, -2, 11, 32, '#FFFFFF'); tr(c, -40, 0); }
  const quietChip = jarBig(Lfg, 'quieter… and quieter…', '#3A424B', '#FFFFFF', 36);
  const meterG = G(Lfg), bars = [];
  E('rect', { x: -50, y: -170, width: 100, height: 300, rx: 14, fill: '#1B2733', stroke: '#FFFFFF', 'stroke-width': 4 }, meterG);
  for (let i = 0; i < 8; i++) bars.push(E('rect', { x: -34, y: 100 - i * 34, width: 68, height: 26, rx: 5, fill: i > 5 ? '#FF6060' : i > 3 ? '#FFC247' : '#56D69B' }, meterG));
  T(meterG, 0, 170, 'VOLUME', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  const seeG = G(Lfg); { const e = jarEye(seeG); tr(e, 0, 0, 0.8); jarTick(seeG, 62, -40); const c = jarLabel(seeG, 'you can still SEE it', { size: 30, color: '#FFE45C', stroke: '#FFE45C' }); tr(c, 0, 80); }
  const shout = G(Lfg);
  E('path', { d: 'M-220,-60 Q-220,-100 -180,-100 L180,-100 Q220,-100 220,-60 L220,20 Q220,60 180,60 L-120,60 L-170,110 L-150,60 L-180,60 Q-220,60 -220,20 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 5 }, shout);
  T(shout, 0, -6, 'I’M STILL RINGING!', { size: 40, weight: 800, anchor: 'middle', fill: '#C93A3A' });
  const vacCard = G(Lfg);
  { const c = jarBig(vacCard, 'VACUUM = no particles', '#0E1A24', '#FFE45C', 44); }
  const noSound = jarBig(Lfg, 'no particles → no sound', '#C2453A', '#FFFFFF', 36);
  const nobodyT = jarLabel(Lfg, 'nobody to pass it on to', { size: 30, color: '#9FD8FF', stroke: '#9FD8FF' });
  const rays = G(Lfg), rayL = [];
  for (let i = 0; i < 4; i++) rayL.push(E('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-dasharray': '30 18' }, rays));
  const eye2 = G(Lfg); { const e = jarEye(eye2); tr(e, 0, 0, 0.9); jarTick(eye2, 64, -46); }
  const lightChip = jarBig(Lfg, 'light doesn’t need a medium', '#FFE45C', SC_INK, 36);
  const backChip = jarBig(Lfg, 'air back in → sound returns', '#2E7DD8', '#FFFFFF', 36);
  const heart = E('path', { d: 'M0,10 C-22,-6 -16,-26 0,-14 C16,-26 22,-6 0,10 Z', fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3 }, Lfg);

  /* ---------- corridor ---------- */
  const corr = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F3E9C9', '#E2D3A6', true) }, corr);
  E('rect', { x: 0, y: 380, width: 1200, height: 18, fill: '#2E7DD8' }, corr);
  for (let i = 0; i < 10; i++) {
    const x = 20 + i * 118;
    E('rect', { x, y: 410, width: 110, height: 260, rx: 6, fill: i % 3 === 1 ? '#E8584D' : '#4F86C6', stroke: '#2A3A4A', 'stroke-width': 4 }, corr);
    E('path', { d: `M${x + 20},430 h70 M${x + 20},442 h70 M${x + 20},454 h70`, stroke: '#2A3A4A', 'stroke-width': 3, opacity: 0.6 }, corr);
    E('rect', { x: x + 86, y: 520, width: 10, height: 30, rx: 3, fill: '#C9D3DC' }, corr);
  }
  E('rect', { x: 0, y: 670, width: 1200, height: 80, fill: '#B8A27A' }, corr);
  const clockG = G(corr); tr(clockG, 1010, 190);
  E('circle', { r: 64, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 6 }, clockG);
  E('line', { x1: 0, y1: 0, x2: 0, y2: -46, stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, clockG);
  E('line', { x1: 0, y1: 0, x2: 30, y2: 10, stroke: SC_INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, clockG);
  { const c = chip(clockG, 'RECESS ENDS', { size: 26, fill: '#C93A3A', color: '#FFFFFF' }); tr(c, 0, 104); }
  const kids = [[150, '#E8424F', '#C98E62'], [340, '#56D69B', '#8C5A3C'], [860, '#FFC247', '#E0B48A'], [1060, '#9B6BD6', '#C98E62']].map(([x, shirt, skin]) => {
    const w = G(corr); const p = person(w, { shirt, skin, shorts: '#1E2A44', hair: '#1E1410' }); tr(w, x, 712, 1.05); return { w, p, x };
  });
  const groans = ['ugh.', 'nooo', 'already?', 'whyyy'].map(s => { const g = G(Lfg); const c = chip(g, s, { size: 30, fill: '#FFFFFF', color: SC_INK, stroke: SC_INK, sw: 3 }); return g; });
  const yrs = jarBig(Lfg, '30 YEARS', '#C93A3A', '#FFFFFF', 36);
  const ltBelle = scLowerThird(Lhud, 'BELLE', 'School bell. Ends recess. Unloved.');

  /* ---------- confessional ---------- */
  const confN = pioConf(Lbg, 'nigel');
  const rank = G(Lmid);
  E('rect', { x: -250, y: -170, width: 500, height: 340, rx: 18, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 5 }, rank);
  T(rank, 0, -112, 'LEAST POPULAR', { size: 38, weight: 800, anchor: 'middle', fill: '#C93A3A', ls: 1 });
  T(rank, 0, -72, 'school sounds', { size: 28, weight: 700, anchor: 'middle', fill: '#7A6B55', font: FB });
  const r1 = G(rank); T(r1, -200, 10, '1.', { size: 44, weight: 800, fill: '#C93A3A' }); T(r1, -140, 10, 'Belle', { size: 44, weight: 800, fill: SC_INK });
  const r2 = G(rank); T(r2, -200, 80, '2.', { size: 40, weight: 800, fill: '#7A6B55' }); T(r2, -140, 80, 'the recorder', { size: 40, weight: 700, fill: SC_INK });
  T(rank, 0, 140, '3. a chair on the floor', { size: 26, weight: 600, anchor: 'middle', fill: '#9A8B75', font: FB });

  /* ---------- space ---------- */
  const space = G(Lbg);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#05060F', '#141A3A', true) }, space);
  { const r = rng(808); let d = ''; for (let i = 0; i < 110; i++) { const x = r() * 1200, y = r() * 750, s = 1 + r() * 2.2; d += `M${x.toFixed(0)},${y.toFixed(0)} m-${s},0 a${s},${s} 0 1 0 ${2 * s},0 a${s},${s} 0 1 0 -${2 * s},0 `; } E('path', { d, fill: '#FFFFFF', opacity: 0.8 }, space); }
  const blast = G(Lmid); tr(blast, 860, 300);
  const blastGlow = E('circle', { r: 160, fill: glow('#FFB347') }, blast);
  let spikes = ''; for (let i = 0; i < 24; i++) { const a = i * TAU / 24, rr = i % 2 ? 50 : 130; spikes += (i ? 'L' : 'M') + (Math.cos(a) * rr).toFixed(1) + ',' + (Math.sin(a) * rr).toFixed(1); }
  const blastStar = E('path', { d: spikes + 'Z', fill: '#FFE45C', stroke: '#FF8A3D', 'stroke-width': 6, 'stroke-linejoin': 'round' }, blast);
  const boomG = G(Lfg);
  const boomT = T(boomG, 0, 0, 'BOOM!', { size: 96, weight: 800, anchor: 'middle', fill: '#FF8A3D' });
  boomT.setAttribute('stroke', '#2A0E0E'); boomT.setAttribute('stroke-width', 10); boomT.setAttribute('paint-order', 'stroke');
  const boomX = E('line', { x1: -170, y1: 10, x2: 170, y2: -50, stroke: '#FF4D5E', 'stroke-width': 14, 'stroke-linecap': 'round' }, boomG);
  { const c = jarLabel(boomG, 'the films', { size: 26 }); tr(c, 0, -110); }
  const silentT = T(Lfg, 860, 560, '(total silence)', { size: 34, weight: 600, anchor: 'middle', fill: C.muted, font: FB });
  const spaceChip = jarBig(Lfg, 'space is a vacuum: SILENT', '#2B3E8A', '#FFFFFF', 38);
  const astro1 = jarAstronaut(Lcast, '#E8424F'), astro2 = jarAstronaut(Lcast, '#2E7DD8');
  const radioW = E('path', { d: '', fill: 'none', stroke: '#56D69B', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, Lfg);
  const radioHead = E('path', { d: '', fill: '#56D69B' }, Lfg);
  const radioChip = jarBig(Lfg, 'radio waves cross a vacuum', '#1F7A4A', '#FFFFFF', 36);
  const likeLight = jarLabel(Lfg, 'like light', { size: 30, color: '#FFE45C', stroke: '#FFE45C' });
  const helloT = [T(Lfg, 0, 0, '“Hello?”', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' }), T(Lfg, 0, 0, '“Loud and clear.”', { size: 32, weight: 700, anchor: 'middle', fill: '#FFFFFF' })];

  /* ---------- rhyme ---------- */
  const airG = G(Lbg); const air = pioAir(airG);
  const rhymeChip = chip(Lfg, 'NO AIR, NO AWARE!', { size: 56, fill: '#FFD23F', color: SC_INK, stroke: '#FFFFFF', sw: 5 });
  const rhymeSub = jarBig(Lfg, 'no medium → no sound', '#17877A', '#FFFFFF', 36);
  const nodFrame = G(Lmid);
  E('rect', { x: -140, y: -120, width: 280, height: 240, rx: 14, fill: linGrad('#13233F', '#24467A', true), stroke: '#FFFFFF', 'stroke-width': 5 }, nodFrame);
  { const c = jarLabel(nodFrame, 'Nigel', { size: 26 }); tr(c, 0, 150); }

  /* ---------- the cast ---------- */
  const nigel = cast(Lcast, 'nigel'), archie = cast(Lcast, 'archie'), belle = cast(Lcast, 'belle'), nigNod = cast(nodFrame, 'nigel', { s: 0.7 });

  const ALL = [labG, corr, confN, space, airG, rank, blast, boomG, silentT, spaceChip, astro1, astro2, radioW, radioHead, radioChip, likeLight, ...helloT,
    rhymeChip, rhymeSub, nodFrame, nigel, archie, belle, labChip, bellQ, expChip, sides, hearG, pumpChip, pumpSub, cousinL, quietChip, meterG, seeG, shout,
    vacCard, noSound, nobodyT, rays, eye2, lightChip, backChip, heart, yrs, ...groans, cheer, confetti, ...cousins, ...byes, belleJ, tear];

  // a point along the pump tube (jar coordinates), u 0..1
  const tube = u => {
    if (u < 0.3) return [lerp(-40, -120, u / 0.3), 176];
    const v = (u - 0.3) / 0.7, a = [-120, 176], c = [-200, 190], b = [-240, 140];
    const q = (p0, p1, p2) => (1 - v) * (1 - v) * p0 + 2 * (1 - v) * v * p1 + v * v * p2;
    return [q(a[0], c[0], b[0]), q(a[1], c[1], b[1])];
  };

  return t => {
    const sid = shotAt(t), s0 = t0Of(sid);
    ALL.forEach(el => op(el, 0));
    confN.set(0, t); ltBelle.set(0);
    const labShots = ['lab', 'jar', 'pump', 'quiet', 'still', 'vacuum', 'lightok', 'back', 'happy'];
    const inLab = labShots.includes(sid);

    /* ---------- the lab and the jar ---------- */
    if (inLab) {
      op(labG, 1); op(dimLab, 0);
      const airV = airAt(t), ring = sid === 'lab' ? 0 : ringAt(t);
      jar.set({ t, air: airV, ring });
      const hasBelle = sid !== 'lab';
      op(belleJ, hasBelle ? 1 : 0);
      let bMood = 'neutral';
      if (sid === 'quiet') bMood = t > mid('quiet', 0.5) ? 'shock' : 'neutral';
      if (sid === 'still') bMood = t < mid('still', 0.5) ? 'shock' : 'sad';
      if (sid === 'vacuum' || sid === 'lightok') bMood = 'sad';
      if (sid === 'back') bMood = t > at('back') + 1 ? 'shock' : 'sad';
      if (sid === 'happy') bMood = 'happy';
      if (hasBelle) belleJ.set({ t, talk: talk(t, 'belle'), mood: bMood, ring, look: sid === 'back' || sid === 'happy' ? 0.6 : 0 });
      op(tear, sid === 'happy' ? 1 : 0);
      if (sid === 'happy') tr(tear, 36, 14 + 30 * ((t - at('happy')) * 0.35 % 1));
      // camera
      let k = 1, px = 600, py = 375, fx = 600, fy = 375;
      if (sid === 'still' || sid === 'happy') { const st = sid === 'still' ? at('still') : at('happy'); k = 2.3 + 0.25 * P(t, st, 4, linear); fx = BELLE_W[0]; fy = BELLE_W[1]; px = 520; py = 400; }
      jarCam(Lcam, k, fx, fy, px, py);
      // heads (the class): cheer when the sound comes back
      const yay = sid === 'back' ? P(t, mid('back', 0.4), 0.3, linear) : (sid === 'happy' ? 1 : 0);
      op(heads, k > 1.01 ? 0 : 1);
      headL.forEach(h => { tr(h.h, h.x, 690 - yay * (20 + 16 * Math.abs(Math.sin(t * 6 + h.i))) * AMP); op(h.arms, yay); });
      op(cheer, yay * (k > 1.01 ? 0 : 1)); tr(cheer, 600, 110, 1 + 0.05 * Math.sin(t * 8));
      op(confetti, sid === 'back' ? P(t, mid('back', 0.4), 0.2, linear) : 0);
      if (sid === 'back') conf.forEach(c => { const tt = t - mid('back', 0.4) + c.d; tr(c.el, c.x + 30 * Math.sin(tt * 2 + c.a), -20 + ((tt * c.v) % 800), 1, c.a + tt * 200); });
      // cousins on their way out
      const pumping = sid === 'pump';
      cousins.forEach((c, i) => {
        if (!pumping) { op(c, 0); return; }
        const u = P(t, at('pump') + 0.6 + i * 1.3, 2.2, linear);
        op(c, u > 0 && u < 1 ? 1 : 0);
        const [x, y] = tube(u); tr(c, x, y - 22, 0.2, 20 * Math.sin(t * 8 + i) * AMP);
        c.set({ t, mood: 'happy', look: -0.6 });
      });
      byes.forEach((b, i) => { const u = P(t, at('pump') + 0.6 + i * 1.3, 2.2, linear); op(b, pumping && u > 0.05 && u < 0.85 ? 1 : 0); const [x, y] = tube(u); tr(b, x, y - 74); });
    }

    if (sid === 'lab') {
      jarPop(labChip, P(t, at('lab') + 0.1, 0.4, pop), 250, 310);
      jarPop(bellQ, P(t, mid('lab', 0.82), 0.35, pop), 250, 378, 1, -4);
    }
    if (sid === 'jar') {
      jarPop(expChip, P(t, at('jar') + 0.05, 0.4, pop), 960, 120);
      op(sides, P(t, mid('jar', 0.3), 0.3, linear));
      jarPop(hearG, P(t, mid('jar', 0.78), 0.4, pop), 1030, 440);
    }
    if (sid === 'pump') {
      jarPop(pumpChip, P(t, at('pump') + 0.1, 0.4, pop), 300, 300);
      jarPop(pumpSub, P(t, mid('pump', 0.25), 0.4, pop), 300, 368);
      jarPop(cousinL, P(t, mid('pump', 0.62), 0.4, pop), 900 - 0, 640);
      op(meterG, 1); tr(meterG, 1060, 370, 0.85);
      const lit = Math.round(8 * airAt(t)); bars.forEach((b, i) => op(b, i < lit ? 1 : 0.15));
    }
    if (sid === 'quiet') {
      jarPop(quietChip, P(t, at('quiet') + 0.05, 0.4, pop), 900, 120);
      op(meterG, 1); tr(meterG, 1060, 370, 0.85);
      const lit = Math.max(Math.round(8 * airAt(t) * 1.4), t > mid('quiet', 0.6) ? 0 : 1); bars.forEach((b, i) => op(b, i < lit ? 1 : 0.15));
      jarPop(seeG, P(t, mid('quiet', 0.62), 0.4, pop), 300, 290);
    }
    if (sid === 'still') {
      const sp = 1 - P(t, at('still') + 0.3, end('still') + 0.7 - at('still') - 0.3, easeIn);
      op(shout, sp > 0.02 ? clamp(P(t, at('still'), 0.2, linear)) : 0); tr(shout, 900, 200, Math.max(0.01, sp));
    }
    if (sid === 'vacuum') {
      op(dimLab, 0.25);
      jarPop(vacCard, P(t, at('vacuum') + 0.1, 0.45, pop), 920, 120);
      op(nigel, 1); tr(nigel, 1030, 400, 0.85);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: -1 });
      jarPop(noSound, P(t, mid('vacuum', 0.45), 0.4, pop), 920, 620);
      jarPop(nobodyT, P(t, mid('vacuum', 0.75), 0.4, pop), 300, 330);
    }
    if (sid === 'lightok') {
      op(dimLab, 0.3);
      const ex = 1040, ey = 260;
      op(eye2, P(t, at('lightok') + 0.1, 0.3, linear)); tr(eye2, ex, ey);
      op(rays, P(t, at('lightok') + 0.2, 0.3, linear));
      rayL.forEach((r, i) => { attr(r, 'x1', BELLE_W[0] + 40); attr(r, 'y1', BELLE_W[1] - 30 + i * 22); attr(r, 'x2', ex - 70); attr(r, 'y2', ey - 15 + i * 10); attr(r, 'stroke-dashoffset', (-t * 160).toFixed(0)); });
      op(nigel, 1); tr(nigel, 1040, 490, 0.75);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'neutral', look: -1 });
      jarPop(lightChip, P(t, mid('lightok', 0.2), 0.4, pop), 880, 640);
    }
    if (sid === 'back') {
      jarPop(backChip, P(t, at('back') + 0.1, 0.4, pop), 300, 330);
      op(meterG, 1); tr(meterG, 1060, 370, 0.85);
      const lit = Math.round(8 * airAt(t)); bars.forEach((b, i) => op(b, i < lit ? 1 : 0.15));
    }
    if (sid === 'happy') {
      op(heart, P(t, mid('happy', 0.6), 0.3, linear)); tr(heart, 820, 190 - 10 * Math.sin(t * 3), 2.2);
    }

    /* ---------- corridor ---------- */
    if (sid === 'belle' || sid === 'nobody') {
      op(corr, 1);
      const ringing = sid === 'nobody' && t < mid('nobody', 0.45);
      const k = sid === 'nobody' ? 1 + 0.12 * P(t, end('nobody'), 0.8, linear) : 1;
      op(belle, 1); tr(belle, 600, 250 + 20 * (k - 1), 1.1 * k);
      const wob = sid === 'nobody' && t > end('nobody') ? Math.sin(t * 30) * 1.5 * AMP : 0;
      belle.set({ t, talk: talk(t, 'belle'), mood: 'sad', ring: ringing ? AMP : 0, look: sid === 'nobody' && t > mid('nobody', 0.5) ? 0 : 0.3 });
      if (wob) belle.firstChild.setAttribute('transform', `translate(${wob.toFixed(2)} 0)`);
      ltBelle.set(sid === 'belle' ? win(t, at('belle') + 0.2, at('belle') + 3.4, 0.3) : 0);
      const groan = sid === 'nobody' ? P(t, at('nobody') + 0.2, 0.4, ease) : 0;
      kids.forEach((kd, i) => {
        if (groan > 0) kd.p.pose({ lean: 22 * groan, armL: [-6, 4], armR: [6, 4], legL: [4, -4], legR: [-4, -4] });
        else kd.p.pose(walkPose(t + i * 0.3, 0.9));
        tr(kd.w, kd.x + (groan ? 0 : 8 * Math.sin(t * 2 + i)), 712, 1.05);
      });
      groans.forEach((g, i) => jarPop(g, sid === 'nobody' ? P(t, at('nobody') + 0.25 + i * 0.18, 0.35, pop) * (1 - P(t, end('nobody'), 0.3, linear)) : 0, kids[i].x, 470 - (i % 2) * 30, 1, (i % 2 ? 5 : -5)));
      jarPop(yrs, sid === 'nobody' ? P(t, at('nobody') + 0.05, 0.35, pop) : 0, 300, 160, 1, -4);
    }

    /* ---------- Nigel's confessional ---------- */
    if (sid === 'thnigel') {
      const k = 1 + 0.08 * P(t, end('thnigel'), 0.6, linear);
      confN.set(1, t); jarCam(confN, k, 400, 400);
      op(nigel, 1); tr(nigel, 370, 420 - 10 * (k - 1), 1.5 * k);
      nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: t > mid('thnigel', 0.4) && t < end('thnigel') ? 0.6 : 0 });
      const rp = P(t, at('thnigel') + 0.3, 0.4, pop);
      op(rank, clamp(rp * 2.5)); tr(rank, 880, 330, Math.max(0.01, 0.7 + 0.3 * rp), 2);
      op(r1, P(t, mid('thnigel', 0.25), 0.3, linear)); op(r2, P(t, mid('thnigel', 0.75), 0.3, linear));
    }

    /* ---------- space ---------- */
    if (sid === 'space') {
      op(space, 1);
      const bp = P(t, at('space') + 0.2, 0.7, easeOut);
      op(blast, 1 - 0.5 * P(t, at('space') + 1.5, 2, linear)); tr(blast, 860, 300, 0.3 + 0.9 * bp, t * 10 * AMP);
      op(blastGlow, 0.6 + 0.4 * Math.sin(t * 5));
      op(boomG, P(t, mid('space', 0.15), 0.3, linear)); tr(boomG, 860, 330, 1, -6);
      attr(boomX, 'x2', lerp(-170, 170, P(t, mid('space', 0.35), 0.3, ease))); attr(boomX, 'y2', lerp(10, -50, P(t, mid('space', 0.35), 0.3, ease)));
      op(silentT, P(t, mid('space', 0.4), 0.3, linear));
      jarPop(spaceChip, P(t, mid('space', 0.5), 0.4, pop), 600, 660);
      op(astro1, 1); tr(astro1, 300 + 20 * Math.sin(t * 0.7), 380 + 24 * Math.sin(t * 0.9) * AMP, 0.9, 20 * Math.sin(t * 0.5) * AMP);
      op(nigel, 1); tr(nigel, 1100, 650, 0.45); nigel.set({ t, talk: talk(t, 'nigel'), mood: 'deadpan', look: -0.6 });
    }
    if (sid === 'radio') {
      op(space, 1);
      const a1 = [320, 380 + 10 * Math.sin(t * 0.9) * AMP], a2 = [880, 400 + 10 * Math.sin(t * 0.8 + 1) * AMP];
      op(astro1, 1); tr(astro1, a1[0], a1[1], 0.9, 8);
      op(astro2, 1); tr(astro2, a2[0], a2[1], 0.9, -8);
      // zigzag radio wave between the helmets, flowing left to right
      const h1 = [a1[0] + 50, a1[1] - 76], h2 = [a2[0] - 50, a2[1] - 76];
      const wp = P(t, at('radio') + 0.3, 0.6, linear);
      let d = ''; const n = 16;
      for (let i = 0; i <= n; i++) { const u = i / n; if (u > wp) break; const x = lerp(h1[0], h2[0], u), y = lerp(h1[1], h2[1], u) + (i % 2 ? -18 : 18) * (i && i < n ? 1 : 0); d += (i ? 'L' : 'M') + x.toFixed(0) + ',' + y.toFixed(0); }
      attr(radioW, 'd', d); op(radioW, 1);
      attr(radioHead, 'd', `M${h2[0]},${h2[1]} l-22,-14 l0,28 Z`); op(radioHead, wp >= 1 ? 1 : 0);
      jarPop(radioChip, P(t, mid('radio', 0.35), 0.4, pop), 600, 650);
      jarPop(likeLight, P(t, mid('radio', 0.7), 0.4, pop), 600, 180, 1, -3);
      op(helloT[0], win(t, mid('radio', 0.15), mid('radio', 0.55), 0.2)); tr(helloT[0], a1[0], a1[1] - 170);
      op(helloT[1], win(t, mid('radio', 0.55), end('radio') + 0.4, 0.2)); tr(helloT[1], a2[0], a2[1] - 170);
    }

    /* ---------- rhyme ---------- */
    if (sid === 'rhyme') {
      op(airG, 1); air.upd(t);
      op(archie, 1); tr(archie, 380, 470, 1.25);
      archie.set({ t, talk: talk(t, 'archie'), mood: t > end('rhyme') ? 'smug' : 'happy', look: t > end('rhyme') + 0.1 ? 0.8 : 0, bounce: t < end('rhyme') ? AMP : 0 });
      jarPop(rhymeChip, P(t, mid('rhyme', 0.35), 0.4, pop), 700, 170, 1, -3);
      jarPop(rhymeSub, P(t, mid('rhyme', 0.6), 0.4, pop), 700, 262);
      const fp = P(t, at('rhyme') + 0.1, 0.35, pop);
      op(nodFrame, clamp(fp * 2.5)); tr(nodFrame, 980, 480, Math.max(0.01, 0.7 + 0.3 * fp));
      // one tiny, reluctant nod in the pause
      const nod = Math.sin(Math.PI * P(t, end('rhyme') + 0.1, 0.45, linear)) * 12;
      tr(nigNod, 0, 6 + nod, 0.7, 0);
      nigNod.set({ t, mood: 'deadpan', look: -0.8, still: true });
    }
  };
});

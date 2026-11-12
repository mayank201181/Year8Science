/* Scene 1: "Meet the happy couple" (venue at pH 1, red, all chapter; Indi stays red).
   Shots (hard sitcom cuts): Hal bursts up the aisle (pH 1 rosette) -> Indi confessional (Hal's own spotlight)
   -> acid = releases H+ in water, tastes sour -> Hal: lemons! vinegar! stomach! -> Indi: his COUSINS
   (citric, ethanoic; Hal is the one in your stomach) -> here comes the bride, by dropper -> the drop lands:
   Natalie (doormat) -> hydroxide ions, soapy, cleaning cupboard -> Indi confessional (wiped four times)
   -> BASE card -> Venn: alkalis = soluble bases, Natalie hops in; sulking copper oxide; all alkalis are bases
   -> the pH scale: acidic / neutral / alkaline -> Hal drags the pointer to 14 -> Indi: "No." -> higher = more
   alkaline -> Hal: "Number ONE" (foam finger). */
scene('couple', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;
  const INK = SC_INK;

  /* ---------- local helpers (prefixed cp) ---------- */
  const cpPop = (el, t, t0, x, y, s, r) => { const p = P(t, t0, 0.45, pop); op(el, clamp(p * 2.5)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r); return p; };
  const cpCam = (el, k, cx, cy) => el.setAttribute('transform', Math.abs(k - 1) < 1e-4 ? '' : `translate(${cx} ${cy}) scale(${k.toFixed(4)}) translate(${-cx} ${-cy})`);
  // pill with a formula-aware label (ngFormula: "H^+", "OH^-"), centred at (0,0)
  function cpChip(parent, str, o) {
    o = o || {};
    const size = o.size || 30, g = G(parent), h = Math.round(size * 1.7);
    const box = E('rect', { y: -h / 2, height: h, rx: o.rx !== undefined ? o.rx : h / 2, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, 'stroke-width': o.sw || 2.5 }, g);
    const tx = ngFormula(g, 0, size * 0.35, str, { size, fill: o.color || C.ink, weight: o.weight || 700 });
    let w = 0; try { w = tx.getComputedTextLength(); } catch (e) { w = 0; }
    w = (w || str.length * size * 0.55) + size * 1.3;
    attr(box, 'x', -w / 2); attr(box, 'width', w);
    g.w = w; g.h = h;
    return g;
  }
  function cpLemon(p) {
    const g = G(p);
    E('path', { d: 'M-62,0 Q-80,-4 -78,6 Q-70,10 -60,6 Z M62,0 Q80,-4 78,6 Q70,10 60,6 Z', fill: '#F2D23A', stroke: '#9A7A00', 'stroke-width': 3 }, g);
    E('ellipse', { rx: 64, ry: 46, fill: ball('#FFF07A', '#E0B000'), stroke: '#9A7A00', 'stroke-width': 4 }, g);
    E('path', { d: 'M8,-44 Q34,-78 62,-62 Q38,-40 8,-44 Z', fill: '#5BBF6A', stroke: '#2C8C4C', 'stroke-width': 3 }, g);
    return g;
  }
  function cpVinegar(p) {
    const g = G(p);
    E('path', { d: 'M-14,-80 L14,-80 L14,-52 Q44,-36 44,0 L44,66 Q44,78 32,78 L-32,78 Q-44,78 -44,66 L-44,0 Q-44,-36 -14,-52 Z', fill: 'rgba(235,205,150,0.6)', stroke: '#CFE7F5', 'stroke-width': 4 }, g);
    E('rect', { x: -17, y: -98, width: 34, height: 22, rx: 5, fill: '#8A3A2A', stroke: INK, 'stroke-width': 3 }, g);
    E('rect', { x: -38, y: 6, width: 76, height: 46, rx: 6, fill: '#FFFFFF', stroke: '#C9BFA6', 'stroke-width': 2 }, g);
    E('path', { d: 'M-24,22 L24,22 M-24,37 L12,37', stroke: '#C9573F', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function cpStomach(p) {
    const g = G(p);
    E('path', { d: 'M-38,-92 L-38,-44 C-96,-26 -88,72 -4,74 C52,76 84,40 74,-2 L88,-14 L76,-28 L62,-14 C40,24 -2,30 -10,-12 L-12,-92 Z', fill: ball('#FFB3C7', '#D9607E'), stroke: '#9E3A55', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function cpSpray(p) {
    const g = G(p);
    E('path', { d: 'M-34,-20 L34,-20 L40,80 Q40,92 28,92 L-28,92 Q-40,92 -40,80 Z', fill: ball('#C3A2FF', '#6A3FC8'), stroke: INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('rect', { x: -22, y: -46, width: 44, height: 28, rx: 5, fill: '#F4F7FA', stroke: INK, 'stroke-width': 3 }, g);
    E('path', { d: 'M-22,-46 L-22,-70 L44,-70 L52,-58 L22,-58 L22,-46 Z', fill: '#FF6FB5', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M14,-46 Q22,-30 10,-22', fill: 'none', stroke: INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    E('rect', { x: -26, y: 20, width: 52, height: 40, rx: 5, fill: '#FFFFFF', opacity: 0.85 }, g);
    E('circle', { cx: 0, cy: 40, r: 10, fill: '#9FD8FF' }, g);
    return g;
  }
  function cpSuds(p, n, seed) {
    const g = G(p), r = rng(seed || 5);
    for (let i = 0; i < n; i++) E('circle', { cx: (r() - 0.5) * 120, cy: (r() - 0.5) * 50, r: 6 + r() * 12, fill: 'rgba(255,255,255,0.22)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, g);
    return g;
  }
  // a framed "photo" inset for the confessionals, (cx, cy) centre, w x h
  function cpInset(p, cx, cy, w, h, fill) {
    const g = G(p);
    E('rect', { x: cx - w / 2 - 10, y: cy - h / 2 - 10, width: w + 20, height: h + 20, rx: 10, fill: '#F4EFE6', stroke: INK, 'stroke-width': 4 }, g);
    E('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 4, fill: fill || ngMix(ngPH(1), '#141C28', 0.5) }, g);
    const id = 'cpclip' + Math.round(cx * 3 + cy * 7 + w);
    const cp = E('clipPath', { id }, defs()); E('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: 4 }, cp);
    g.in = G(g, { 'clip-path': `url(#${id})` });
    return g;
  }
  function cpRosette(p) {
    const g = G(p);
    E('path', { d: 'M-16,20 L-26,72 L-12,62 L-4,76 L0,24 Z M16,20 L26,72 L12,62 L4,76 L0,24 Z', fill: '#B32630', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    let d = '';
    for (let i = 0; i < 20; i++) { const a = i / 20 * TAU, R = i % 2 ? 34 : 40; d += (i ? 'L' : 'M') + (Math.cos(a) * R).toFixed(1) + ',' + (Math.sin(a) * R).toFixed(1); }
    E('path', { d: d + 'Z', fill: '#FFD43B', stroke: INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
    E('circle', { r: 31, fill: ngPH(1), stroke: '#FFFFFF', 'stroke-width': 3 }, g);
    T(g, 0, 9, 'pH 1', { size: 26, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    return g;
  }

  /* ---------- layers ---------- */
  const cam = G(root), HUD = G(root);
  const Lbg = G(cam), Lprop = G(cam), Lcast = G(cam), Lfg = G(cam);
  const venue = ngVenue(Lbg);
  const dim = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#0A0F18' }, Lbg);
  const conf = ngConf(Lbg, 'indi');

  /* ---------- shot list ---------- */
  const SH = [
    ['hal', -1e9], ['thhal', at('thhal') - 0.08], ['ions', at('ions') - 0.1], ['sour', at('sour') - 0.08],
    ['cousins', at('cousins') - 0.08], ['bride', at('bride') - 0.1], ['soapy', at('soapy') - 0.08],
    ['thnat', at('thnat') - 0.08], ['base', at('base') - 0.1], ['venn', at('alkali') - 0.1],
    ['scale', at('scale') - 0.1], ['indicu', end('fourteen') + 0.45], ['higher', at('higher') - 0.1], ['one', at('one') - 0.08],
  ];
  const shotAt = t => { let k = 0; for (let i = 0; i < SH.length; i++) if (t >= SH[i][1]) k = i; return SH[k][0]; };
  const FG = {}; SH.forEach(([id]) => { FG[id] = G(Lfg); });
  const BK = {}; SH.forEach(([id]) => { BK[id] = G(Lprop); });

  /* ---------- the cast ---------- */
  const indi = cast(Lcast, 'indi', { ph: 1, mood: 'deadpan' });
  const hal = cast(Lcast, 'hal', { mood: 'happy' });
  const nat = cast(Lcast, 'natalie', { mood: 'smug' });
  const rosette = cpRosette(hal.firstChild); tr(rosette, -62, 36, 0.9);

  /* ---------- hal: bursts up the aisle ---------- */
  const halSparks = [[-120, -90], [120, -70], [-100, 80], [130, 70]].map(([x, y], i) => { const s = spark(FG.hal, 18, { seed: i }); s.px = x; s.py = y; return s; });
  const ltHal = scLowerThird(HUD, 'HAL', 'Hydrochloric acid. The groom. pH 1.');
  const ltNat = scLowerThird(HUD, 'NATALIE', 'Sodium hydroxide. An alkali. The bride.');

  /* ---------- thhal: confessional inset, Hal and his own spotlight ---------- */
  const inHal = cpInset(FG.thhal, 880, 320, 380, 290);
  const beam = E('path', { d: 'M930,190 L800,460 L980,460 Z', fill: '#FFF2A0', opacity: 0.35 }, inHal.in);
  const miniHal = cast(inHal.in, 'hal', { mood: 'happy' });
  const lamp = G(inHal.in); tr(lamp, 932, 188);
  E('line', { x1: 0, y1: 0, x2: -40, y2: 120, stroke: '#3A3A44', 'stroke-width': 6, 'stroke-linecap': 'round' }, lamp);
  E('path', { d: 'M-26,-14 L26,-14 L18,14 L-18,14 Z', fill: '#2C2C36', stroke: '#9AA6B2', 'stroke-width': 3, 'stroke-linejoin': 'round' }, lamp);
  E('ellipse', { cx: 0, cy: 14, rx: 18, ry: 5, fill: '#FFF7C2' }, lamp);
  const acidChip = chip(FG.thhal, 'ACID', { size: 40, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const spotChip = cpChip(FG.thhal, 'his own spotlight', { size: 28, color: C.energy });

  /* ---------- ions: an acid releases H+ in water ---------- */
  const cl = ngIon(FG.ions, 'Cl-', 30);
  const hPlus = [0, 1, 2, 3, 4].map(() => ngIon(FG.ions, 'H+', 26));
  const H_DEST = [[150, 200], [520, 190], [130, 640], [540, 650], [90, 420]];
  const ionCard = G(FG.ions);
  card(ionCard, 650, 140, 490, 330, { fill: 'rgba(10,27,39,0.9)', stroke: C.line });
  const icTitle = T(ionCard, 895, 205, 'ACID', { size: 52, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  const icL1 = T(ionCard, 895, 262, 'releases hydrogen ions', { size: 32, weight: 700, anchor: 'middle' });
  const icF = ngFormula(ionCard, 895, 352, 'H^+', { size: 80, fill: '#FFFFFF' });
  const icL2 = T(ionCard, 895, 430, 'in water', { size: 32, weight: 700, anchor: 'middle', fill: C.water });
  const sourG = G(FG.ions);
  const sLemon = cpLemon(sourG); tr(sLemon, 740, 575, 0.8);
  const sourChip = chip(sourG, 'tastes SOUR', { size: 36, fill: '#FFE45C', color: '#3A2600', stroke: '#FFFFFF', sw: 3 }); tr(sourChip, 960, 575);

  /* ---------- sour: lemons, vinegar, stomach ---------- */
  const ICX = [720, 900, 1080];
  const icons = [cpLemon(FG.sour), cpVinegar(FG.sour), cpStomach(FG.sour)];
  const iconCap = ['lemons!', 'vinegar!', 'stomach!'].map((s, i) => { const c = chip(FG.sour, s, { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.line, color: '#FFE6B0' }); tr(c, ICX[i], 515); return c; });
  const proud = chip(FG.sour, 'SOUR & PROUD', { size: 38, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });

  /* ---------- cousins ---------- */
  const COY = [215, 385, 560];
  card(FG.cousins, 600, 130, 560, 560, { fill: 'rgba(10,20,30,0.82)', stroke: C.line });
  const cIcons = [cpLemon(FG.cousins), cpVinegar(FG.cousins), cpStomach(FG.cousins)];
  const cLab = [['citric acid', '#FFE45C'], ['ethanoic acid', '#FFD6A0'], ['hydrochloric acid', '#FF8A7A']].map(([s, c], i) => T(FG.cousins, 770, COY[i] + 12, s, { size: 36, weight: 800, fill: c }));
  const cSub = ['in lemons', 'in vinegar', 'in your stomach'].map((s, i) => T(FG.cousins, 770, COY[i] + 50, s, { size: 26, weight: 600, fill: C.muted, font: FB }));
  const cousinChip = chip(FG.cousins, 'his COUSINS', { size: 32, fill: 'rgba(10,27,39,0.9)', stroke: C.line, color: C.energy });
  const stomHal = cast(FG.cousins, 'hal', { mood: 'happy' });
  const halTag = chip(FG.cousins, '= Hal', { size: 28, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });

  /* ---------- bride: the dropper, the drop, Natalie ---------- */
  const dropper = ngDropper(BK.bride, 1.0);
  dropper.set(0, ngPH(13));
  const fallDrop = E('path', { d: 'M0,-16 Q16,6 0,20 Q-16,6 0,-16 Z', fill: ngPH(13), stroke: '#FFFFFF', 'stroke-width': 3 }, BK.bride);
  const splash = E('ellipse', { rx: 80, ry: 20, fill: 'none', stroke: '#E9DDFF', 'stroke-width': 5 }, BK.bride);
  const mat = G(BK.bride);
  E('rect', { x: -120, y: -30, width: 240, height: 60, rx: 10, fill: '#8A5A2B', stroke: INK, 'stroke-width': 4 }, mat);
  E('rect', { x: -110, y: -22, width: 220, height: 44, rx: 6, fill: 'none', stroke: '#D9A86C', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, mat);
  T(mat, 0, 10, 'WIPE FEET', { size: 28, weight: 800, anchor: 'middle', fill: '#FFE6B0' });
  const heart = E('path', { d: 'M0,12 C-26,-8 -18,-32 0,-16 C18,-32 26,-8 0,12 Z', fill: '#FF6FB5', stroke: INK, 'stroke-width': 3 }, FG.bride);
  const alkChip = chip(FG.bride, 'ALKALI', { size: 40, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const brideChip = cpChip(FG.bride, 'here comes the bride...', { size: 30, color: '#E9DDFF' });

  /* ---------- soapy ---------- */
  const ohs = [0, 1, 2, 3].map(() => ngIon(FG.soapy, 'OH-', 26));
  const OH_DEST = [[140, 210], [520, 230], [120, 600], [520, 640]];
  const ohChip = cpChip(FG.soapy, 'hydroxide ions, OH^-', { size: 34, fill: 'rgba(30,16,60,0.92)', stroke: '#B9A0FF' });
  const soapG = G(FG.soapy);
  const soapChip = chip(soapG, 'feels SOAPY', { size: 36, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const suds = cpSuds(soapG, 9, 4); tr(suds, 0, -62);
  const spray = cpSpray(FG.soapy);
  const cleanChip = chip(FG.soapy, 'cleaning products', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.line });

  /* ---------- thnat: Natalie wiping the glass ---------- */
  const inNat = cpInset(FG.thnat, 880, 310, 380, 270);
  E('path', { d: 'M1010,175 Q990,310 1010,445 L1070,445 L1070,175 Z', fill: '#DDF3FF', opacity: 0.28 }, inNat.in);
  E('path', { d: 'M1012,190 Q994,310 1012,430', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.6 }, inNat.in);
  const miniNat = cast(inNat.in, 'natalie', { mood: 'smug' });
  const cloth = E('path', { d: 'M-22,-18 L20,-22 L24,18 L-18,22 Z', fill: '#FFFFFF', stroke: '#9FD8FF', 'stroke-width': 3, 'stroke-linejoin': 'round' }, inNat.in);
  const squeak = [0, 1, 2].map(i => E('path', { d: `M${1030},${260 + i * 22} l22,${-6 + i * 6}`, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round' }, inNat.in));
  const tallyG = G(FG.thnat);
  T(tallyG, 700, 516, 'wiped today:', { size: 30, weight: 700, fill: C.ink });
  const tallies = [0, 1, 2, 3].map(i => E('line', { x1: 912 + i * 26, y1: 486, x2: 912 + i * 26, y2: 530, stroke: '#FFE45C', 'stroke-width': 8, 'stroke-linecap': 'round' }, tallyG));
  const fullChip = chip(FG.thnat, "it's FULL of liquid", { size: 30, fill: C.waterDk, color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });

  /* ---------- base: the definition card ---------- */
  const baseCard = G(FG.base);
  card(baseCard, 160, 140, 880, 450, { fill: 'rgba(16,14,34,0.93)', stroke: '#B9A0FF', sw: 4 });
  const bTitle = T(baseCard, 600, 225, 'BASE', { size: 66, weight: 800, anchor: 'middle', fill: '#C9B3FF' });
  const bL1 = T(baseCard, 600, 300, 'can **NEUTRALISE** an acid', { size: 42, weight: 600, anchor: 'middle', boldFill: '#7CE38F' });
  const bL2 = T(baseCard, 600, 375, 'many are metal **oxides** or **hydroxides**', { size: 34, weight: 600, anchor: 'middle', boldFill: '#FFE45C' });
  const bEx1 = chip(baseCard, 'copper oxide', { size: 32, fill: '#26262C', color: '#FFFFFF', stroke: '#8A8A96', sw: 3 });
  const bEx2 = chip(baseCard, 'magnesium hydroxide', { size: 32, fill: '#F4F7FA', color: INK, stroke: '#B9A0FF', sw: 3 });
  const bEg = T(baseCard, 600, 475, 'for example', { size: 26, weight: 600, anchor: 'middle', fill: C.muted, font: FB });

  /* ---------- venn: bases and alkalis ---------- */
  const VB = [820, 400, 262], VA = [760, 372, 128];
  const vennBig = G(BK.venn);
  E('circle', { cx: VB[0], cy: VB[1], r: VB[2], fill: '#B9A0FF', opacity: 0.12 }, vennBig);
  E('circle', { cx: VB[0], cy: VB[1], r: VB[2], fill: 'none', stroke: '#B9A0FF', 'stroke-width': 5 }, vennBig);
  T(vennBig, VB[0], 192, 'BASES', { size: 42, weight: 800, anchor: 'middle', fill: '#C9B3FF' });
  const vennIn = G(BK.venn);
  E('circle', { cx: VA[0], cy: VA[1], r: VA[2], fill: ngPH(13), opacity: 0.35 }, vennIn);
  const vennInRing = E('circle', { cx: VA[0], cy: VA[1], r: VA[2], fill: 'none', stroke: '#E9DDFF', 'stroke-width': 5 }, vennIn);
  T(vennIn, VA[0], 296, 'ALKALIS', { size: 34, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  T(vennIn, VA[0], 330, 'soluble bases', { size: 26, weight: 700, anchor: 'middle', fill: '#E9DDFF' });
  const inGlow = E('circle', { cx: VA[0], cy: VA[1], r: VA[2] + 10, fill: 'none', stroke: '#FFE45C', 'stroke-width': 8 }, BK.venn);
  const solChip = chip(FG.venn, 'soluble = dissolves in water', { size: 30, fill: C.waterDk, color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  // copper oxide: a sulky black heap at the bottom of the beaker, with her own rain cloud
  const cuo = scMake(BK.venn, { seed: 6, bob: 0, mood: 'sad',
    draw: g => {
      E('path', { d: 'M-86,34 Q-70,-24 -14,-40 Q40,-48 72,-12 Q88,8 90,34 Z', fill: ball('#55555E', '#141418'), stroke: '#000000', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-60,20 l4,0 M30,22 l4,0 M60,10 l4,0 M-30,-14 l4,0', stroke: '#8A8A96', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    },
    face: { x: 2, y: -2, eye: 11, gap: 34, mouthW: 22, mouthY: 18, lidCol: '#3A3A42' } });
  const CUO = [925, 588];
  const cloud = G(BK.venn); tr(cloud, CUO[0] + 10, 470);
  const rain = [0, 1, 2, 3].map(i => E('line', { x1: -36 + i * 24, y1: 20, x2: -42 + i * 24, y2: 44, stroke: '#9FD8FF', 'stroke-width': 4, 'stroke-linecap': 'round' }, cloud));
  [[-30, 0, 24], [0, -12, 30], [32, 0, 24], [0, 6, 26]].forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#8C99A6', stroke: '#5E6B78', 'stroke-width': 2 }, cloud));
  const cuChip = chip(FG.venn, 'copper oxide', { size: 32, fill: '#26262C', color: '#FFFFFF', stroke: '#8A8A96', sw: 3 });
  const cuChip2 = chip(FG.venn, 'a base, but INSOLUBLE', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: C.line, color: '#FFB0A0' });
  const cuArrow = arrow(FG.venn, 470, 590, 820, 596, { color: '#C9B3FF', width: 5, bend: 30 });
  const vLine1 = G(FG.venn), vLine2 = G(FG.venn);
  chip(vLine1, 'all alkalis are bases', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#7CE38F', sw: 3 });
  tr(tick(vLine1, 16), 200, 0);
  chip(vLine2, 'not all bases are alkalis', { size: 30, fill: 'rgba(10,27,39,0.9)', stroke: '#7CE38F', sw: 3 });
  tr(tick(vLine2, 16), 222, 0);
  const cuGlow = E('ellipse', { cx: CUO[0], cy: CUO[1], rx: 110, ry: 62, fill: 'none', stroke: '#FFE45C', 'stroke-width': 7 }, BK.venn);

  /* ---------- the pH scale (scale + higher) ---------- */
  const SCX = 600, SCY = 330;
  const scaleG = G(Lprop); tr(scaleG, SCX, SCY);
  const zoneGlow = [[0, 6], [7, 7], [8, 14]].map(() => E('rect', { y: -40, height: 80, rx: 12, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6 }, scaleG));
  const phs = ngPhScale(scaleG, 980);
  const sx = ph => SCX + phs.x(ph);
  [[0, 6], [7, 7], [8, 14]].forEach(([a, b], i) => { attr(zoneGlow[i], 'x', phs.x(a) - 33 - 6); attr(zoneGlow[i], 'width', phs.x(b) - phs.x(a) + 65 + 12); });
  const scTitle = chip(FG.scale, 'the pH scale', { size: 40, fill: 'rgba(10,27,39,0.92)', stroke: '#FFFFFF', sw: 3 });
  const endRings = [0, 14].map(() => E('circle', { r: 30, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5 }, FG.scale));
  const acArrow = arrow(FG.scale, 520, 470, 140, 470, { color: '#FF8A7A', width: 7 });
  const acChip = chip(FG.scale, 'lower = MORE acidic', { size: 30, fill: 'rgba(10,27,39,0.92)', stroke: '#FF8A7A', sw: 3, color: '#FFB0A0' });
  const water = G(FG.scale);
  E('path', { d: 'M0,-34 Q24,-2 22,14 A22,22 0 0 1 -22,14 Q-24,-2 0,-34 Z', fill: ball('#9FE6FF', '#1D84A6'), stroke: '#FFFFFF', 'stroke-width': 3 }, water);
  const neuChip = chip(FG.scale, 'pure water', { size: 30, fill: C.waterDk, color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const alChip = chip(FG.scale, 'ALKALINE', { size: 34, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 3 });
  const claim = cpChip(FG.scale, 'pH 14 = most acidic EVER?!', { size: 32, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF' });
  const noStamp = G(FG.indicu);
  E('rect', { x: -110, y: -58, width: 220, height: 116, rx: 16, fill: 'none', stroke: '#FF6070', 'stroke-width': 9 }, noStamp);
  T(noStamp, 0, 30, 'NO.', { size: 84, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const hiArrowA = arrow(FG.higher, 640, 470, 1080, 470, { color: '#B9A0FF', width: 7 });
  const hiChipA = chip(FG.higher, 'more ALKALINE', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#B9A0FF', sw: 3, color: '#D9C8FF' });
  const hiArrowC = arrow(FG.higher, 560, 470, 120, 470, { color: '#FF8A7A', width: 7 });
  const hiChipC = chip(FG.higher, 'more ACIDIC', { size: 32, fill: 'rgba(10,27,39,0.92)', stroke: '#FF8A7A', sw: 3, color: '#FFB0A0' });
  const natEnd = chip(FG.higher, "Natalie's end", { size: 28, fill: ngPH(13), color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });
  const halEnd = chip(FG.higher, 'most acidic', { size: 28, fill: ngPH(1), color: '#FFFFFF', stroke: '#FFFFFF', sw: 2 });

  /* ---------- one: the foam finger ---------- */
  const foam = G(FG.one);
  const foamIn = G(foam);
  E('path', { d: 'M-20,-150 Q-20,-178 6,-178 Q32,-178 32,-150 L32,-40 L-20,-40 Z', fill: '#FF5A6E', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, foamIn);
  E('path', { d: 'M-86,-60 Q-86,-80 -66,-80 L60,-80 Q84,-80 84,-56 L84,70 Q84,96 58,96 L-60,96 Q-86,96 -86,70 Z', fill: '#FF5A6E', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, foamIn);
  E('path', { d: 'M-86,-30 Q-120,-40 -122,-6 Q-120,24 -86,20', fill: '#FF5A6E', stroke: INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, foamIn);
  E('path', { d: 'M-52,-80 L-52,-44 M-14,-80 L-14,-44 M24,-80 L24,-44', stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.5 }, foamIn);
  const foamTx = T(foamIn, 0, 50, 'No.1', { size: 54, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  foamTx.setAttribute('stroke', INK); foamTx.setAttribute('stroke-width', 3); foamTx.setAttribute('paint-order', 'stroke');

  const blackout = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000' }, HUD);

  return t => {
    const sid = shotAt(t);
    const talk = who => scTalk(S, t, who);
    op(blackout, 1 - P(t, S.first - 0.5, 0.5, linear));
    SH.forEach(([id]) => { op(FG[id], id === sid ? 1 : 0); op(BK[id], id === sid ? 1 : 0); });
    const isConf = sid === 'thhal' || sid === 'thnat';
    op(venue, isConf ? 0 : 1); conf.set(isConf ? 1 : 0, t);
    if (!isConf) venue.set(1, t * AMP);
    const DIM = { ions: 0.3, sour: 0.25, cousins: 0.3, base: 0.62, venn: 0.5, scale: 0.55, higher: 0.55 };
    op(dim, isConf ? 0 : (DIM[sid] || 0));
    op(scaleG, sid === 'scale' || sid === 'higher' ? 1 : 0);
    let k = 1, fx = 600, fy = 400;
    const shown = new Set();
    const put = (c, x, y, s, r) => { shown.add(c); tr(c, x, y, s, r); };
    op(rosette, sid === 'hal' || sid === 'one' || sid === 'sour' || sid === 'ions' ? 1 : 0);
    ltHal.set(sid === 'hal' ? win(t, at('hal') + 0.15, at('thhal') - 0.15, 0.3) : 0);
    ltNat.set(sid === 'bride' ? win(t, at('natalie') + 0.15, at('natalie') + 3.3, 0.3) : 0);

    /* ---------- hal ---------- */
    if (sid === 'hal') {
      const p = P(t, at('hal') - 0.15, 0.55, pop);
      const y = lerp(760, 450, clamp(p));
      put(hal, 640, y, Math.max(0.01, 1.05 * (0.5 + 0.5 * p)), 6 * Math.sin(t * 9) * AMP * (1 - P(t, at('hal') + 0.6, 0.6)));
      hal.set({ t, talk: talk('hal'), mood: 'happy', look: -0.2 });
      halSparks.forEach((s, i) => { const q = P(t, at('hal') + 0.05 + i * 0.08, 0.4, pop); op(s, clamp(q * 3) * (1 - P(t, at('hal') + 1.6, 0.4, linear))); tr(s, 640 + s.px * q, 450 + s.py * q, Math.max(0.01, q)); s.upd(t); });
      op(rosette, P(t, mid('hal', 0.78), 0.2, linear)); tr(rosette, -62, 36, 0.9 * Math.max(0.01, P(t, mid('hal', 0.78), 0.4, pop)));
      put(indi, 1010, 510, 0.95);
      const surprised = t >= at('hal') - 0.1 && t < at('hal') + 0.7;
      indi.set({ t, ph: 1, mood: surprised ? 'shock' : 'deadpan', look: -0.8 });
      k = 1 + 0.03 * P(t, at('hal'), 4, linear); fx = 600; fy = 420;
    }

    /* ---------- thhal (confessional) ---------- */
    if (sid === 'thhal') {
      k = 1 + 0.1 * P(t, end('thhal') - 0.2, 0.9, ease); fx = 430; fy = 380;
      put(indi, 430, 410, 1.5);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: t > mid('thhal', 0.5) && t < end('thhal') ? 0.6 : 0 });
      tr(miniHal, 860, 390, 0.72); miniHal.set({ t, mood: 'happy', look: 0.4 });
      const bp = P(t, mid('thhal', 0.55), 0.3, linear);
      op(beam, bp * (0.3 + 0.08 * Math.sin(t * 7))); op(lamp, clamp(bp * 2));
      op(acidChip, 0); op(spotChip, 0);
      cpPop(acidChip, t, mid('thhal', 0.2), 880, 525);
      cpPop(spotChip, t, mid('thhal', 0.6), 880, 600);
    }

    /* ---------- ions ---------- */
    if (sid === 'ions') {
      put(hal, 330, 430, 1.15);
      hal.set({ t, mood: t > mid('ions', 0.72) ? 'smug' : 'happy', look: t < mid('ions', 0.6) ? -0.5 : 0.6 });
      const a = t * 1.1 * AMP;
      tr(cl, 330 + Math.cos(a) * 150, 430 + Math.sin(a) * 120);
      hPlus.forEach((h, i) => {
        const q = P(t, mid('ions', 0.15 + i * 0.07), 1.3, easeOut);
        op(h, q > 0 ? 1 : 0);
        const [dx, dy] = H_DEST[i];
        tr(h, lerp(330, dx, q) + 6 * Math.sin(t * 2 + i) * AMP * q, lerp(430, dy, q) + 8 * Math.cos(t * 1.7 + i * 2) * AMP * q);
      });
      cpPop(ionCard, t, at('ions') + 0.05, 0, 0); tr(ionCard, 0, 0);
      op(icTitle, P(t, at('ions') + 0.1, 0.3, linear)); op(icL1, P(t, mid('ions', 0.14), 0.3, linear));
      const fp = P(t, mid('ions', 0.3), 0.45, pop); op(icF, clamp(fp * 2.5));
      op(icL2, P(t, mid('ions', 0.48), 0.3, linear));
      cpPop(sourG, t, mid('ions', 0.7), 0, 0); tr(sourG, 0, 0);
    }

    /* ---------- sour ---------- */
    if (sid === 'sour') {
      const beats = [mid('sour', 0.32), mid('sour', 0.52), mid('sour', 0.74)];
      let flex = 0; beats.forEach(b => { flex = Math.max(flex, win(t, b - 0.05, b + 0.35, 0.12)); });
      put(hal, 320, 430 - 14 * flex * AMP, 1.3 * (1 + 0.06 * flex), 8 * flex * Math.sin(t * 14) * AMP);
      hal.set({ t, talk: talk('hal'), mood: t < beats[0] ? 'smug' : 'happy', look: t < beats[0] ? 0 : 0.8 });
      icons.forEach((ic, i) => { const p = cpPop(ic, t, beats[i] - 0.05, ICX[i], 380, i === 2 ? 1.05 : 1); op(iconCap[i], clamp(p * 2)); });
      cpPop(proud, t, at('sour') + 0.05, 320, 190);
    }

    /* ---------- cousins ---------- */
    if (sid === 'cousins') {
      const look = t > mid('cousins', 0.16) ? 0.8 : 0;
      put(indi, 300, 450, 1.25);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look });
      cpPop(cousinChip, t, at('cousins') + 0.05, 300, 180);
      const LB = [mid('cousins', 0.18), mid('cousins', 0.44), mid('cousins', 0.7)];
      cIcons.forEach((ic, i) => { tr(ic, 680, COY[i], 0.72); op(ic, 1); });
      cLab.forEach((el, i) => { const p = P(t, LB[i], 0.35, easeOut); op(el, p); op(cSub[i], P(t, LB[i] + 0.2, 0.3, linear)); tr(el, -30 * (1 - p), 0); });
      const hp = P(t, mid('cousins', 0.76), 0.45, pop);
      op(stomHal, clamp(hp * 3)); tr(stomHal, 680, COY[2] + 14, Math.max(0.01, 0.3 * hp));
      stomHal.set({ t, mood: 'happy', look: -0.6 });
      cpPop(halTag, t, mid('cousins', 0.84), 680, COY[2] + 92);
    }

    /* ---------- bride + natalie (one wide shot) ---------- */
    if (sid === 'bride') {
      const DX = 760;
      const down = P(t, at('bride') - 0.05, 1.1, easeOut), up = P(t, at('natalie') + 0.2, 0.9, easeIn);
      const tipY = lerp(-40, 190, down) - 330 * up;
      tr(dropper, DX, tipY);
      const sq = win(t, mid('bride', 0.62), end('bride') + 0.15, 0.25);
      dropper.set(sq, ngPH(13));
      // the drop forms at the tip, then falls during the pause
      const form = P(t, mid('bride', 0.62), 0.5, easeOut), fall = P(t, end('bride') + 0.05, at('natalie') - 0.1 - end('bride') - 0.05, easeIn);
      op(dropper.drop, 0);
      op(fallDrop, form > 0 && fall < 1 ? 1 : 0);
      tr(fallDrop, DX, lerp(tipY + 22, 470, fall), Math.max(0.01, form * (1 + 0.2 * fall)));
      const land = P(t, at('natalie') - 0.12, 0.45, easeOut);
      op(splash, land > 0 && land < 1 ? 1 - land : 0); tr(splash, DX, 540, Math.max(0.01, 0.4 + land));
      const np = P(t, at('natalie') - 0.12, 0.5, pop);
      if (np > 0) {
        put(nat, DX, 450, Math.max(0.01, 1.0 * np));
        const nLook = t > mid('natalie', 0.7) ? -0.8 : 0;
        nat.set({ t, talk: talk('natalie'), mood: 'smug', look: nLook });
      }
      cpPop(brideChip, t, mid('bride', 0.15), 900, 640);
      if (t >= at('natalie')) op(brideChip, 0);
      const mp = P(t, mid('natalie', 0.7), 0.4, easeOut);
      op(mat, mp > 0 ? 1 : 0); tr(mat, DX + 60 * (1 - mp), 590, Math.max(0.01, mp));
      cpPop(alkChip, t, mid('natalie', 0.42), DX, 250);
      // Hal waiting at the arch, Indi on the right with her clipboard
      put(hal, 470, 460, 0.9);
      const smitten = t > at('natalie') + 0.2;
      hal.set({ t, mood: 'happy', look: smitten ? 0.9 : 0.5 });
      op(heart, smitten ? P(t, at('natalie') + 0.2, 0.3, linear) : 0);
      tr(heart, 470, 330 - 10 * Math.abs(Math.sin(t * 3)) * AMP, 1 + 0.15 * Math.abs(Math.sin(t * 6)) * AMP);
      put(indi, 1085, 500, 0.8);
      indi.set({ t, ph: 1, mood: 'deadpan', look: -0.8 });
      k = 1; fx = 600; fy = 400;
    }

    /* ---------- soapy ---------- */
    if (sid === 'soapy') {
      put(nat, 330, 440, 1.25);
      nat.set({ t, talk: talk('natalie'), mood: 'smug', look: t > mid('soapy', 0.4) ? 0.6 : 0 });
      ohs.forEach((h, i) => {
        const q = P(t, at('soapy') + 0.1 + i * 0.25, 1.4, easeOut);
        op(h, q > 0 ? 1 : 0);
        const [dx, dy] = OH_DEST[i];
        tr(h, lerp(330, dx, q) + 6 * Math.sin(t * 2 + i) * AMP * q, lerp(440, dy, q) + 8 * Math.cos(t * 1.6 + i) * AMP * q);
      });
      cpPop(ohChip, t, mid('soapy', 0.12), 880, 200);
      cpPop(soapG, t, mid('soapy', 0.42), 880, 380);
      cpPop(spray, t, mid('soapy', 0.66), 740, 560, 1, -8 + 4 * Math.sin(t * 3) * AMP);
      cpPop(cleanChip, t, mid('soapy', 0.72), 960, 570);
    }

    /* ---------- thnat (confessional) ---------- */
    if (sid === 'thnat') {
      k = 1 + 0.1 * P(t, end('thnat') - 0.3, 0.9, ease); fx = 430; fy = 380;
      put(indi, 430, 410, 1.5);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: 0 });
      tr(miniNat, 900, 340, 0.62); miniNat.set({ t, mood: 'annoyed', look: 1 });
      const wy = 300 + 70 * Math.sin(t * 5 * AMP);
      tr(cloth, 1000, wy, 1, 10 * Math.sin(t * 5));
      squeak.forEach((s, i) => op(s, Math.sin(t * 10 + i) > 0.3 ? 0.9 : 0));
      tallies.forEach((l, i) => { const q = P(t, mid('thnat', 0.18 + i * 0.07), 0.25, easeOut); op(l, q); attr(l, 'y1', lerp(530, 486, q)); });
      op(tallyG, 1);
      cpPop(fullChip, t, mid('thnat', 0.66), 880, 610);
    }

    /* ---------- base ---------- */
    if (sid === 'base') {
      cpPop(baseCard, t, at('base') - 0.05, 0, 0); tr(baseCard, 0, 0);
      op(bTitle, P(t, at('base'), 0.3, linear));
      op(bL1, P(t, mid('base', 0.14), 0.35, linear));
      op(bL2, P(t, mid('base', 0.5), 0.35, linear));
      op(bEg, P(t, mid('base', 0.72), 0.3, linear));
      cpPop(bEx1, t, mid('base', 0.74), 410, 530);
      cpPop(bEx2, t, mid('base', 0.86), 780, 530);
      put(nat, 1105, 668, 0.55);
      nat.set({ t, mood: 'smug', look: -0.8 });
    }

    /* ---------- venn (alkali, cousin, venn) ---------- */
    if (sid === 'venn') {
      const ip = P(t, mid('alkali', 0.1), 0.6, pop);
      op(vennIn, clamp(ip * 2)); vennIn.setAttribute('transform', `translate(${VA[0]} ${VA[1]}) scale(${Math.max(0.01, ip).toFixed(3)}) translate(${-VA[0]} ${-VA[1]})`);
      cpPop(solChip, t, mid('alkali', 0.42), 300, 190);
      if (t >= at('cousin') - 0.1) op(solChip, 0);
      // Natalie talks on the left, then hops into ALKALIS on "Like me."
      const hop = P(t, mid('alkali', 0.8), 0.55, ease);
      const nx = lerp(250, VA[0], hop), ny = lerp(440, 412, hop) - 160 * Math.sin(Math.PI * hop), ns = lerp(1.05, 0.36, hop);
      put(nat, nx, ny, ns, 360 * hop);
      const nLook = t < at('cousin') ? 0 : t < at('venn') ? 0.7 : -0.5;
      nat.set({ t, talk: talk('natalie'), mood: t >= mid('cousin', 0.72) && t < at('venn') ? 'smug' : (hop >= 1 ? 'happy' : 'smug'), look: nLook });
      // copper oxide
      const cp = P(t, mid('cousin', 0.22), 0.5, pop);
      op(cuo, clamp(cp * 3)); tr(cuo, CUO[0], CUO[1] + 30 * (1 - clamp(cp)), Math.max(0.01, 0.95 * cp));
      cuo.set({ t, mood: t > mid('cousin', 0.5) ? 'sad' : 'annoyed', look: -0.6 });
      const rp = P(t, mid('cousin', 0.82), 0.4, easeOut);
      op(cloud, rp); tr(cloud, CUO[0] + 10, 470 - 10 * (1 - rp));
      rain.forEach((r, i) => { const f = (t * 1.6 + i * 0.27) % 1; tr(r, 0, f * 26); op(r, rp * (1 - f)); });
      const vOn = t >= at('venn') - 0.1;
      op(cuChip, 0); op(cuChip2, 0); op(cuArrow, 0);
      if (!vOn) {
        cpPop(cuChip, t, mid('cousin', 0.28), 300, 520);
        cpPop(cuChip2, t, mid('cousin', 0.5), 300, 592);
        op(cuArrow, P(t, mid('cousin', 0.32), 0.2, linear)); cuArrow.set(P(t, mid('cousin', 0.32), 0.5, easeOut));
      }
      // venn: the summary lines, and the matching circles glow
      cpPop(vLine1, t, at('venn') + 0.05, 300, 230);
      cpPop(vLine2, t, mid('venn', 0.5), 300, 310);
      op(inGlow, win(t, at('venn') + 0.05, mid('venn', 0.5), 0.15) * (0.6 + 0.4 * Math.sin(t * 8)));
      op(cuGlow, win(t, mid('venn', 0.5), end('venn') + 0.3, 0.15) * (0.6 + 0.4 * Math.sin(t * 8)));
      if (vOn) {
        put(indi, 270, 560, 0.85);
        const ipop = P(t, at('venn') - 0.1, 0.4, pop);
        tr(indi, 270, 560, Math.max(0.01, 0.85 * ipop));
        indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: 0.7 });
      }
    }

    /* ---------- scale (scale, seven, fourteen) ---------- */
    if (sid === 'scale' || sid === 'higher') {
      const sp = sid === 'scale' ? P(t, at('scale') - 0.1, 0.6, easeOut) : 1;
      tr(scaleG, lerp(1500, SCX, sp), SCY);
    }
    if (sid === 'scale') {
      cpPop(scTitle, t, at('scale') + 0.05, 600, 175);
      endRings.forEach((r, i) => { const tt = mid('scale', i ? 0.86 : 0.7); op(r, win(t, tt, at('seven'), 0.15)); tr(r, sx(i ? 14 : 0), SCY + 62, 1 + 0.08 * Math.sin(t * 8)); });
      // zones light up on "below seven", "seven", "above seven"
      const z0 = win(t, at('seven'), mid('seven', 0.5), 0.15), z1 = win(t, mid('seven', 0.52), mid('seven', 0.8), 0.15), z2 = win(t, mid('seven', 0.8), end('seven') + 0.3, 0.15);
      const zs = [z0, z1, z2];
      zoneGlow.forEach((g, i) => op(g, zs[i]));
      const anyZ = t >= at('seven') && t < end('seven') + 0.3;
      phs.segs.forEach((s, i) => { const zi = i < 7 ? 0 : i === 7 ? 1 : 2; op(s, anyZ ? 0.35 + 0.65 * zs[zi] : 1); });
      const ann = t < at('fourteen') - 0.05;
      op(acArrow, 0); op(acChip, 0); op(water, 0); op(neuChip, 0); op(alChip, 0);
      if (ann) {
        const ap = P(t, mid('seven', 0.22), 0.5, easeOut); op(acArrow, ap > 0 ? 1 : 0); acArrow.set(ap);
        cpPop(acChip, t, mid('seven', 0.24), 330, 530);
        cpPop(water, t, mid('seven', 0.6), 600, 470);
        cpPop(neuChip, t, mid('seven', 0.64), 600, 540);
        cpPop(alChip, t, mid('seven', 0.84), 865, 480);
      }
      // the pointer: shown on "zero to fourteen", then Hal grabs it
      let ph = 7, show = 0;
      if (t < at('seven')) { ph = 14 * P(t, mid('scale', 0.7), mid('scale', 0.9) - mid('scale', 0.7), ease); show = P(t, mid('scale', 0.66), 0.2, linear); }
      const grab = t >= at('fourteen') - 0.1;
      const drag = P(t, mid('fourteen', 0.2), mid('fourteen', 0.62) - mid('fourteen', 0.2), ease);
      if (grab) { ph = lerp(1, 14, drag); show = 1; }
      phs.set(ph, show);
      // the cast below the scale
      put(indi, 600, 650, 0.55);
      const iLook = grab ? 0.9 : scWho(S, t) === 'indi' ? 0 : 0;
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: grab ? (drag > 0.5 ? 0.9 : -0.6) : iLook });
      put(nat, 1010, 650, 0.55);
      nat.set({ t, mood: grab && drag > 0.7 ? 'annoyed' : 'smug', look: grab ? -0.7 : -0.5 });
      if (!grab) { put(hal, 190, 650, 0.55); hal.set({ t, mood: 'happy', look: 0.6 }); }
      else {
        const jump = P(t, at('fourteen') - 0.1, 0.45, ease);
        const hx = lerp(190, sx(ph), jump), hy = lerp(650, 205, jump) - 60 * Math.sin(Math.PI * jump);
        put(hal, hx, hy - 6 * Math.abs(Math.sin(t * 9)) * (drag > 0 && drag < 1 ? 1 : 0) * AMP, 0.55);
        hal.set({ t, talk: talk('hal'), mood: 'happy', look: drag > 0 && drag < 1 ? 0.8 : 0 });
      }
      cpPop(claim, t, mid('fourteen', 0.66), 820, 500);
      if (t > end('fourteen')) { k = 1 + 0.12 * P(t, end('fourteen'), 0.5, ease); fx = 600; fy = 640; }
    }

    /* ---------- indi close-up: "No." ---------- */
    if (sid === 'indicu') {
      put(indi, 560, 430, 1.9);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: 0 });
      k = 1 + 0.08 * P(t, end('fourteen') + 0.45, at('higher') - end('fourteen') - 0.5, linear); fx = 560; fy = 400;
      const np = P(t, at('no') + 0.05, 0.35, pop);
      op(noStamp, clamp(np * 3)); tr(noStamp, 930, 300, Math.max(0.01, 1.6 - 0.6 * np), -10);
    }

    /* ---------- higher ---------- */
    if (sid === 'higher') {
      const toOne = P(t, mid('higher', 0.66), 0.7, ease);
      const ph = lerp(14, 1, toOne);
      phs.set(ph, 1);
      phs.segs.forEach(s => op(s, 1));
      zoneGlow.forEach(g => op(g, 0));
      const aA = P(t, mid('higher', 0.06), 0.6, easeOut); op(hiArrowA, aA > 0 ? 1 : 0); hiArrowA.set(aA);
      cpPop(hiChipA, t, mid('higher', 0.12), 865, 470);
      const aC = P(t, mid('higher', 0.7), 0.6, easeOut); op(hiArrowC, aC > 0 ? 1 : 0); hiArrowC.set(aC);
      cpPop(hiChipC, t, mid('higher', 0.74), 340, 470);
      cpPop(natEnd, t, mid('higher', 0.42), 1010, 555);
      cpPop(halEnd, t, mid('higher', 0.86), 190, 555);
      // Hal rides the pointer back down to 1
      put(hal, sx(ph), 205 + 30 * Math.sin(Math.PI * toOne), 0.55, -20 * Math.sin(Math.PI * toOne));
      hal.set({ t, mood: toOne > 0.95 ? 'happy' : toOne > 0 ? 'shock' : 'happy', look: 0 });
      put(indi, 600, 650, 0.55);
      indi.set({ t, talk: talk('indi'), ph: 1, mood: 'deadpan', look: t < mid('higher', 0.38) ? -0.3 : t < mid('higher', 0.66) ? 0.8 : -0.8 });
      const wave_ = win(t, mid('higher', 0.4), mid('higher', 0.7), 0.15);
      put(nat, 1010, 650 - 16 * wave_ * Math.abs(Math.sin(t * 6)) * AMP, 0.55);
      nat.set({ t, mood: wave_ > 0.5 ? 'happy' : 'smug', look: -0.6 });
    }

    /* ---------- one: Number ONE ---------- */
    if (sid === 'one') {
      k = 1 + 0.05 * P(t, at('one'), 3, linear); fx = 560; fy = 420;
      put(hal, 400, 440, 1.45, 5 * Math.sin(t * 4) * AMP);
      hal.set({ t, talk: talk('hal'), mood: t > mid('one', 0.7) && t < end('one') ? 'smug' : 'happy', look: 0.2 });
      const fp = P(t, mid('one', 0.08), 0.5, pop);
      const bounce = 1 + 0.08 * win(t, mid('one', 0.3), mid('one', 0.62), 0.1) * Math.abs(Math.sin(t * 12));
      op(foam, clamp(fp * 3)); tr(foam, 720, 420 + 80 * (1 - clamp(fp)), Math.max(0.01, fp * bounce), 8 * Math.sin(t * 2.2) * AMP);
      put(indi, 1040, 480, 1.0);
      indi.set({ t, ph: 1, mood: 'deadpan', look: -0.9 });
    }

    [indi, hal, nat].forEach(c => op(c, shown.has(c) ? 1 : 0));
    cpCam(cam, k, fx, fy);
  };
});

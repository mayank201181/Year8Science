/* Scene 6: Final destination: the eye.
   Shots: the bedroom at 10 p.m., lamp on, Kavya reading; Ray hops off the page into her eye; the camera dives in ->
   the eye in cross-section (Ray, the tour guide, in a picture-in-picture inset): cornea (does most of the bending),
   pupil (a hole: Ray dives through it like a cat flap) -> the iris, front view: bright light small pupil, dim light
   wide pupil -> the lens (squishy, tiny Dennis doing yoga) -> near: ciliary muscles contract, lens fatter ->
   far: muscles relax, ligaments tight, lens thinner, ACCOMMODATION -> retina: the picture lands upside down ->
   Kavya, shocked, tilts her head -> optic nerve to the brain, which flips it -> Ray's confessional, the brain's
   own empty tip jar -> 10:15, lamp off, Kavya lies down -> Ray glowing in the dark, alarm set for 7:00. */
scene('eye', S => {
  const { at, end, mid } = S, root = S.root;
  const AMP = S.reduce ? 0.35 : 1;

  /* ---------- helpers (prefixed eye) ---------- */
  function eyeChip(parent, text, o) {
    o = o || {};
    return chip(parent, text, { size: o.size || 30, fill: o.fill || 'rgba(10,27,39,0.9)', stroke: o.stroke || C.line, sw: o.sw || 2, color: o.color || C.ink, weight: o.weight || 700 });
  }
  function eyePop(el, t, t0, x, y, s, r, f) {
    const p = P(t, t0, 0.45, pop);
    op(el, clamp(p * 2.5) * (f === undefined ? 1 : f)); tr(el, x, y, Math.max(0.01, (s || 1) * (0.6 + 0.4 * p)), r);
  }
  // a chip with a leader line to (ax, ay); g.set(p)
  function eyeLabel(parent, text, x, y, ax, ay, o) {
    o = o || {};
    const g = G(parent), col = o.line || '#FFFFFF';
    const ln = E('line', { x1: x, y1: y, x2: ax, y2: ay, stroke: col, 'stroke-width': 3 }, g);
    E('circle', { cx: ax, cy: ay, r: 6, fill: col }, g);
    const c = eyeChip(g, text, o); tr(c, x, y);
    g.set = p => { op(g, clamp(p * 2.5)); };
    g.set(0);
    return g;
  }
  function eyeCam(el, k, cx, cy) { el.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${k.toFixed(4)}) translate(${(-cx).toFixed(1)} ${(-cy).toFixed(1)})`); }
  // a picture with an obvious up and down: a page with a tree on it
  function eyePic(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('rect', { x: -32, y: -42, width: 64, height: 84, rx: 4, fill: '#FBFAF4', stroke: SC_INK, 'stroke-width': 3 }, k);
    E('rect', { x: -22, y: -34, width: 44, height: 7, rx: 3, fill: '#3B82F6' }, k);
    E('path', { d: 'M0,-20 L22,16 L-22,16 Z', fill: '#3FA463', stroke: '#1F6B3A', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, k);
    E('rect', { x: -5, y: 16, width: 10, height: 16, fill: '#8A5A3A' }, k);
    return g;
  }
  function eyeClock(parent, r, label) {
    const g = G(parent);
    E('circle', { r, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: `M0,0 L0,${-r * 0.62} M0,0 L${r * 0.42},0`, stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    if (label) T(g, 0, r + 34, label, { size: 26, weight: 700, anchor: 'middle', fill: C.muted });
    return g;
  }
  function eyeBrain(parent, s) {
    const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
    E('path', { d: 'M-80,10 C-96,-30 -70,-70 -30,-66 C-16,-90 30,-88 42,-64 C80,-70 100,-30 84,0 C100,30 70,62 40,54 C20,76 -20,72 -34,54 C-70,60 -92,40 -80,10 Z', fill: ball('#FFB3C6', '#D9708C'), stroke: '#9E3B5A', 'stroke-width': 4 }, k);
    E('path', { d: 'M0,-80 C-6,-40 8,-10 0,20 C-6,40 4,56 0,66 M-60,-30 C-40,-20 -30,-40 -10,-30 M20,-40 C40,-30 50,-50 70,-36 M-60,20 C-40,10 -24,30 -10,20 M18,20 C40,30 50,10 70,22', fill: 'none', stroke: '#B04A6A', 'stroke-width': 4, 'stroke-linecap': 'round' }, k);
    return g;
  }
  // a light stand-in for Ray in tiny cameos (same proportions as cast 'ray', a handful of elements)
  function eyeMiniRay(parent) {
    const g = G(parent);
    E('ellipse', { cx: 0, cy: -20, rx: 160, ry: 170, fill: glow('#FFF3B0'), opacity: 0.6 }, g);
    E('path', { d: 'M-52,-14 L52,-14 L74,98 L-74,98 Z', fill: '#F3EBD7', stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    E('circle', { cx: 0, cy: -80, r: 62, fill: ball('#FFF8D6', '#F2C84B'), stroke: '#B88A1A', 'stroke-width': 6 }, g);
    E('path', { d: 'M-60,-108 Q-56,-150 0,-152 Q56,-150 60,-108 Z M-62,-108 L86,-100 L-62,-100 Z', fill: '#2F6FD6', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-26,-86 a9,11 0 1,0 0.1,0 Z M26,-86 a9,11 0 1,0 0.1,0 Z M-20,-52 Q0,-36 20,-52', fill: SC_INK, stroke: SC_INK, 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
    g.set = () => {};
    return g;
  }
  function eyeBook(parent) {   // an open book, about 150 wide
    const g = G(parent);
    E('path', { d: 'M0,-34 Q-40,-50 -76,-38 L-76,34 Q-40,22 0,38 Q40,22 76,34 L76,-38 Q40,-50 0,-34 Z', fill: '#3B82F6', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M0,-30 Q-36,-44 -68,-34 L-68,28 Q-36,18 0,32 Z M0,-30 Q36,-44 68,-34 L68,28 Q36,18 0,32 Z', fill: '#FBFAF4', stroke: SC_INK, 'stroke-width': 2.5 }, g);
    E('path', { d: 'M-58,-20 L-12,-14 M-58,-6 L-12,0 M-58,8 L-12,14 M12,-14 L58,-20 M12,0 L58,-6', stroke: '#9AA6B2', 'stroke-width': 3 }, g);
    E('path', { d: 'M34,24 L44,4 L54,24 Z', fill: '#3FA463' }, g);
    return g;
  }

  /* ---------- layers ---------- */
  const Lbed = G(root), Lsec = G(root), Liris = G(root), Lconf = G(root), Lray = G(root), Lhud = G(root);
  const bigW = G(Lray); const big = cast(bigW, 'ray', {});   // Ray, shared by the confessional and the last shot
  const black = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#000000', opacity: 0 }, root);

  /* ================= bedroom ================= */
  const bedBack = G(Lbed), kavL = G(Lbed), bedFront = G(Lbed), glowL = G(Lbed), bedTop = G(Lbed);
  const room = lwBedroom(bedBack, bedFront);
  room.setBeam(0); room.curtains(0);
  const kavW = G(kavL); const kav = cast(kavW, 'kavya', { outfit: 'pyjamas' });
  const bookW = G(bedFront); eyeBook(bookW);
  const lampGlow = E('ellipse', { cx: 1092, cy: 370, rx: 220, ry: 200, fill: glow('#FFE9A8'), opacity: 0 }, glowL);
  const lampPool = E('path', { d: 'M1080,372 L700,600 L1200,600 L1200,520 Z', fill: '#FFE9A8', opacity: 0 }, glowL);
  const zzz = G(bedTop); const zs = ['Z', 'z', 'z'].map((s, i) => T(zzz, 0, 0, s, { size: 46 - i * 8, weight: 800, fill: '#9FB4FF' }));
  const tinyW = G(bedTop); const tiny = eyeMiniRay(tinyW);
  const alarm = G(bedTop);
  E('rect', { x: -110, y: -62, width: 220, height: 124, rx: 18, fill: '#1B2733', stroke: '#FFFFFF', 'stroke-width': 4 }, alarm);
  T(alarm, 0, 10, '7:00', { size: 58, weight: 800, anchor: 'middle', fill: '#FF4D4D' });
  T(alarm, 0, 46, 'TOMORROW', { size: 24, weight: 800, anchor: 'middle', fill: '#FFB3B3', ls: 2 });
  const bubble = G(bedTop);   // Kavya's thought: the picture upside down
  E('ellipse', { rx: 90, ry: 78, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble);
  E('circle', { cx: -78, cy: 86, r: 14, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble);
  E('circle', { cx: -100, cy: 116, r: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bubble);
  { const pc = eyePic(bubble, 1.1); tr(pc, 0, 0, 1, 180); }
  const cTime = eyeChip(Lhud, '10:00 PM', { size: 40, color: C.energy });
  const cTime2 = eyeChip(Lhud, '10:15 PM', { size: 40, color: C.energy });

  /* ================= eye section ================= */
  const EC = [640, 410], R = 220;
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#0A1B27', '#102A3A', true) }, Lsec);
  const secW = G(Lsec); tr(secW, EC[0], EC[1]);
  const eye = lwEyeSection(secW, R, {});
  const A = eye.geo.anchors, PT = a => [EC[0] + a[0], EC[1] + a[1]];
  // glows behind each part
  const hiCornea = E('ellipse', { cx: EC[0] - R * 1.0, cy: EC[1], rx: 70, ry: 190, fill: glow('#BDE9FF'), opacity: 0 }, Lsec);
  const hiLens = E('ellipse', { cx: EC[0] + eye.geo.lensX, cy: EC[1], rx: 80, ry: 120, fill: glow('#E1F2FF'), opacity: 0 }, Lsec);
  const hiRet = (() => { const rr = R + 22, a = lwPt(EC[0], EC[1], -105, rr), b = lwPt(EC[0], EC[1], 105, rr);
    return E('path', { d: `M${a[0].toFixed(1)},${a[1].toFixed(1)} A${rr},${rr} 0 1 1 ${b[0].toFixed(1)},${b[1].toFixed(1)}`, fill: 'none', stroke: '#FF8FB5', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0 }, Lsec); })();
  Lsec.insertBefore(hiCornea, secW); Lsec.insertBefore(hiLens, secW);
  const srcL = G(Lsec);
  const srcPic = eyePic(srcL, 1); const srcClock = eyeClock(srcL, 34, 'clock');
  const rays = [0, 1, 2].map(() => lwRayPath(Lsec, [[0, 0], [1, 1]], { color: LW_OPT.ray, width: 4, head: 13, at: 0.5 }));
  const retPic = G(Lsec); eyePic(retPic, 0.42);
  const pulseG = G(Lsec), pulses = [0, 1, 2, 3].map(() => E('circle', { r: 9, fill: '#FFE45C', stroke: '#FFFFFF', 'stroke-width': 2 }, pulseG));
  const nerveGlow = E('rect', { x: EC[0] + 200, y: EC[1] + 26, width: 150, height: 40, rx: 12, fill: glow('#FFE45C'), opacity: 0 }, Lsec);
  const brainW = G(Lsec); eyeBrain(brainW, 0.95);
  const brainPic = G(Lsec), brainPicIn = G(brainPic); eyePic(brainPicIn, 0.9);
  const flipArrow = E('path', { d: 'M-60,-10 A60,60 0 0 1 60,-10', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round' }, brainPic);
  const diveRayW = G(Lsec); const diveRay = eyeMiniRay(diveRayW);
  // tiny Dennis doing yoga
  const yoga = G(Lsec);
  E('rect', { x: -86, y: 54, width: 172, height: 14, rx: 7, fill: '#B48CFF', stroke: SC_INK, 'stroke-width': 2.5 }, yoga);
  const denW = G(yoga); const den = cast(denW, 'dennis', { mood: 'happy' }); tr(denW, 0, 0, 0.42, 0);
  const omm = T(yoga, 70, -40, 'ommm', { size: 26, weight: 700, fill: '#9FD8FF', font: FB });
  // labels
  const lab = {
    cornea: eyeLabel(Lsec, 'cornea', 330, 175, ...PT(A.cornea), { size: 34, color: '#BDE9FF', stroke: '#BDE9FF' }),
    sclera: eyeLabel(Lsec, 'sclera: tough white coat', 960, 135, ...PT(A.sclera), { size: 26, color: C.muted, line: C.muted }),
    pupil: eyeLabel(Lsec, 'pupil (a hole!)', 380, 650, ...PT(A.pupil), { size: 32 }),
    lens: eyeLabel(Lsec, 'lens: fine-tunes the focus', 700, 130, ...PT(A.lens), { size: 32, color: '#E1F2FF', stroke: '#E1F2FF' }),
    cil: eyeLabel(Lsec, 'ciliary muscles: CONTRACT', 820, 125, ...PT(A.ciliary), { size: 30, color: '#FF9AAA', stroke: '#E57A8A' }),
    fat: eyeLabel(Lsec, 'lens: FATTER, bends MORE', 600, 690, ...PT([eye.geo.lensX, 40]), { size: 30, color: '#E1F2FF', stroke: '#E1F2FF' }),
    lig: eyeLabel(Lsec, 'suspensory ligaments: TIGHT', 820, 125, ...PT(A.ligaments), { size: 30, color: '#F2F7FA', stroke: '#F2F7FA' }),
    thin: eyeLabel(Lsec, 'lens: THINNER', 600, 690, ...PT([eye.geo.lensX, 40]), { size: 30, color: '#E1F2FF', stroke: '#E1F2FF' }),
    retina: eyeLabel(Lsec, 'retina', 960, 170, ...PT(A.retina), { size: 34, color: '#FF9AC2', stroke: '#FF8FB5' }),
    nerve: eyeLabel(Lsec, 'optic nerve', 820, 650, EC[0] + 290, EC[1] + 60, { size: 30, color: '#FFE45C', stroke: '#E9C46A' }),
  };
  const cMost = eyeChip(Lsec, 'does MOST of the bending', { size: 32, color: C.energy, stroke: C.energy });
  const cAcc = eyeChip(Lsec, 'ACCOMMODATION', { size: 44, fill: '#FFE45C', color: '#3A2A06', stroke: '#FFFFFF', sw: 4, weight: 800 });
  const cAccSub = T(Lsec, 0, 0, 'changing the lens shape to focus', { size: 28, weight: 600, anchor: 'middle', fill: C.ink, font: FB });
  const cUpside = eyeChip(Lsec, 'upside down', { size: 30, color: '#FF9AC2', stroke: '#FF8FB5' });
  const cReal = eyeChip(Lsec, 'REAL and INVERTED', { size: 36, color: '#FFFFFF', stroke: '#FFFFFF' });
  const cBrain = eyeChip(Lsec, 'brain flips it the right way up', { size: 28, color: '#FFB3C6', stroke: '#D9708C' });
  // Ray, the tour guide, in a picture-in-picture inset
  const inset = G(Lsec), IN = [140, 612], IR = 92;
  const cpId = 'eyeInsetClip';
  const cp = E('clipPath', { id: cpId }, defs()); E('circle', { cx: IN[0], cy: IN[1], r: IR }, cp);
  E('circle', { cx: IN[0], cy: IN[1], r: IR, fill: linGrad('#2E2A14', '#5E5220', true) }, inset);
  const inClip = G(inset, { 'clip-path': `url(#${cpId})` });
  const guideW = G(inClip); const guide = cast(guideW, 'ray', {}); tr(guideW, IN[0], IN[1] + 66, 0.95);
  E('circle', { cx: IN[0], cy: IN[1], r: IR, fill: 'none', stroke: '#FFE45C', 'stroke-width': 5 }, inset);
  { const c = eyeChip(inset, 'TOUR GUIDE', { size: 22, fill: '#FFE45C', color: '#3A2A06', weight: 800 }); tr(c, IN[0], IN[1] - IR - 4); }

  /* ================= iris, front view ================= */
  const iL = G(Liris);
  E('rect', { x: 0, y: 0, width: 600, height: 750, fill: linGrad('#FFF3C9', '#F2D58A', true) }, iL);
  E('rect', { x: 600, y: 0, width: 600, height: 750, fill: linGrad('#0B1020', '#1A2240', true) }, iL);
  const irisB = lwIrisFront(iL, 92, { iris: '#7A5230' }); tr(irisB, 300, 400);
  const irisD = lwIrisFront(iL, 92, { iris: '#7A5230' }); tr(irisD, 900, 400);
  const sunI = sun(iL, 40); tr(sunI, 300, 200);
  const moonI = lwMoon(iL, 34); tr(moonI, 900, 200);
  const iC1 = G(iL); { const c = eyeChip(iC1, 'bright light: SMALL pupil', { size: 32, fill: 'rgba(58,42,6,0.88)', color: '#FFE45C', stroke: '#FFE45C' }); tr(c, 0, 0); }
  const iC2 = G(iL); { const c = eyeChip(iC2, 'dim light: WIDE pupil', { size: 32, color: '#9FD8FF', stroke: '#9FD8FF' }); tr(c, 0, 0); }
  const iTitle = G(iL); { const c = eyeChip(iTitle, 'IRIS: a coloured ring of muscle', { size: 38, color: '#FFFFFF', stroke: '#FFFFFF', fill: 'rgba(10,27,39,0.94)' }); tr(c, 0, 0); }
  const irisLead = E('path', { d: '', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3 }, iL);

  /* ================= Ray's confessional ================= */
  const conf = lwConf(Lconf, 'ray');
  const cBrainW = G(Lconf); eyeBrain(cBrainW, 1.1);
  const cBrainFace = G(cBrainW);
  E('circle', { cx: -22, cy: -6, r: 6, fill: SC_INK }, cBrainFace); E('circle', { cx: 22, cy: -6, r: 6, fill: SC_INK }, cBrainFace);
  E('path', { d: 'M-14,18 Q0,26 14,18', fill: 'none', stroke: SC_INK, 'stroke-width': 4, 'stroke-linecap': 'round' }, cBrainFace);
  const cJar = G(Lconf); lwTipJar(cJar, 1.0);
  const cJarChip = eyeChip(Lconf, 'tips received: 0', { size: 30, color: C.energy });
  const cFix = G(Lconf);
  { const c = eyeChip(cFix, '12 years of pictures, all flipped', { size: 28, color: C.ink }); tr(c, 0, 0); }

  /* ---------- shots ---------- */
  const SHOTS = [['N', -9], ['X', at('cornea') - 0.25], ['I', at('iris') - 0.05], ['X2', at('lens') - 0.05], ['U', at('upside') - 0.05],
    ['B', at('brain') - 0.05], ['TB', at('thbrain') - 0.05], ['LO', at('lightsout') - 0.05], ['SH', at('shift') - 0.05]];
  const shotAt = t => { let s = 'N'; for (const [k, t0] of SHOTS) if (t >= t0) s = k; return s; };
  const EYEPT = [352.5, 450.2];
  const diveT0 = mid('night', 0.72), diveT1 = at('cornea') - 0.25;
  const SRC = { far: [-560, -150], book: [-520, -110], near: [-380, -70] };

  return t => {
    const sh = shotAt(t);
    op(Lray, 0);
    const bedOn = sh === 'N' || sh === 'U' || sh === 'LO' || sh === 'SH';
    const secOn = sh === 'X' || sh === 'X2' || sh === 'B';
    op(Lbed, bedOn ? 1 : 0); op(Lsec, secOn ? 1 : 0); op(Liris, sh === 'I' ? 1 : 0); op(Lconf, sh === 'TB' ? 1 : 0); conf.set(sh === 'TB' ? 1 : 0, t);
    op(cTime, 0); op(cTime2, 0);
    let blk = 0;

    /* ---------- bedroom ---------- */
    if (bedOn) {
      let dark = 0.5, lamp = 1, cam = [1, 600, 375], kx = 330, ky = 470, kr = 0, kMood = 'neutral', kLook = 0.7, bookOn = 1, asleep = 0;
      op(tinyW, 0); op(alarm, 0); op(zzz, 0); op(bubble, 0);
      if (sh === 'N') {
        eyePop(cTime, t, at('night') + 0.15, 420, 250, 1, 0, 1 - P(t, diveT0 - 0.2, 0.25, linear));
        // Ray hops off the page into her eye
        const hp = P(t, mid('night', 0.4), 1.1, easeIn);
        if (t > mid('night', 0.38)) {
          const x = lerp(460, EYEPT[0], hp), y = lerp(470, EYEPT[1], hp) - Math.sin(hp * Math.PI) * 90;
          op(tinyW, 1 - P(t, mid('night', 0.4) + 1.0, 0.15, linear)); tr(tinyW, x, y, 0.16 * (1 - 0.5 * hp), hp * 200);
          tiny.set({ t, mood: 'deadpan', still: true });
        }
        const z = P(t, diveT0, diveT1 - diveT0, easeIn);
        cam = [1 + 9 * z, EYEPT[0], EYEPT[1]];
        blk = P(t, diveT1 - 0.25, 0.25, linear);
        kLook = t > mid('night', 0.38) && t < mid('night', 0.38) + 1.4 ? 0.2 : 0.7;
        kMood = t > mid('night', 0.38) + 1.0 && t < mid('night', 0.38) + 1.7 ? 'shock' : 'neutral';
      } else if (sh === 'U') {
        kMood = 'shock'; kLook = 0;
        // during the pause she tilts her head, trying to see the right way up
        kr = -28 * P(t, end('upside') - 0.1, 0.5, ease) * (1 - P(t, end('upside') + 0.45, 0.3, ease) * 0);
        const bp = P(t, mid('upside', 0.35), 0.45, pop); op(bubble, clamp(bp * 2.5)); tr(bubble, 560, 220, Math.max(0.01, 0.9 * (0.6 + 0.4 * bp)));
        const push = P(t, at('upside'), end('upside') + 0.6 - at('upside'), linear);
        cam = [1.45 + 0.25 * push, 400, 380];
      } else if (sh === 'LO') {
        eyePop(cTime2, t, at('lightsout') + 0.1, 420, 250);
        const click = mid('lightsout', 0.55);
        lamp = t < click ? 1 : 0; dark = t < click ? 0.5 : 1;
        bookOn = 1 - P(t, mid('lightsout', 0.2), 0.3, linear);
        asleep = P(t, click + 0.15, 0.6, easeOut);
        kMood = asleep > 0.5 ? 'deadpan' : 'neutral'; kLook = 0;
      } else {   // SH
        lamp = 0; dark = 1; bookOn = 0; asleep = 1;
        op(Lray, 1); tr(bigW, 870, 460, 0.95, -4 * P(t, mid('shift', 0.45), 0.25, ease) + 4 * P(t, mid('shift', 0.45) + 0.4, 0.3, ease));
        big.set({ t, talk: scTalk(S, t, 'ray'), mood: 'deadpan', look: t < end('shift') ? -0.4 : 0 });
        eyePop(alarm, t, mid('shift', 0.55), 870, 190);
        const push = P(t, end('shift'), 1.2, linear);
        cam = [1 + 0.12 * push, 870, 420];
      }
      if (asleep > 0) { kx = lerp(330, 205, asleep); ky = lerp(470, 500, asleep); kr = lerp(0, -80, asleep); }
      tr(kavW, kx, ky, 0.88, kr);
      kav.set({ t, talk: scTalk(S, t, 'kavya'), mood: asleep > 0.6 ? 'deadpan' : kMood, look: kLook, still: asleep > 0.6 });
      op(bookW, bookOn); tr(bookW, 470, 520, 0.9, -12);
      if (asleep > 0.6) {
        op(zzz, 1);
        zs.forEach((z, i) => { const f = ((t * 0.45 + i * 0.33) % 1); attr(z, 'x', 230 + f * 70 + i * 6); attr(z, 'y', 430 - f * 120); op(z, Math.sin(f * Math.PI)); });
      }
      room.dark(dark);
      attr(lampGlow, 'opacity', 0.75 * lamp); attr(lampPool, 'opacity', 0.12 * lamp);
      eyeCam(Lbed, cam[0], cam[1], cam[2]); eyeCam(Lray, cam[0], cam[1], cam[2]);
    }

    /* ---------- eye section ---------- */
    if (secOn) {
      blk = Math.max(blk, sh === 'X' ? 1 - P(t, at('cornea') - 0.25, 0.25, linear) : 0);
      Object.values(lab).forEach(l => l.set(0));
      [cMost, cAcc, cAccSub, cUpside, cReal, cBrain, srcClock, retPic, pulseG, brainW, brainPic, diveRayW, yoga].forEach(e => op(e, 0));
      attr(hiCornea, 'opacity', 0); attr(hiLens, 'opacity', 0); attr(hiRet, 'opacity', 0); attr(nerveGlow, 'opacity', 0);
      let src = SRC.book, focus = 0.5, pupil = 0.5, guideTalk = true;
      op(srcPic, 1);
      if (sh === 'X') {
        const c0 = at('cornea');
        attr(hiCornea, 'opacity', 0.9 * win(t, c0 + 0.3, end('cornea') + 0.2, 0.3));
        lab.cornea.set(P(t, c0 + 0.5, 0.3, linear) * (t < at('pupil') - 0.1 ? 1 : 0));
        lab.sclera.set(0.8 * P(t, mid('cornea', 0.4), 0.3, linear) * (t < at('pupil') - 0.1 ? 1 : 0));
        eyePop(cMost, t, mid('cornea', 0.6), 330, 240, 1, 0, t < at('pupil') - 0.1 ? 1 : 0);
        if (t >= at('pupil') - 0.1) {
          lab.pupil.set(P(t, at('pupil') + 0.2, 0.3, linear));
          // Ray dives through the pupil like a cat flap
          const dp = P(t, mid('pupil', 0.55), 1.2, easeIn);
          const px = EC[0] + eye.geo.irisX;
          op(diveRayW, dp > 0 && dp < 1 ? 1 : 0);
          tr(diveRayW, lerp(px - 170, px + 140, dp), EC[1] - 60 * (1 - dp) + 4 * Math.sin(dp * 20), 0.16, lerp(-40, 90, dp));
          diveRay.set({ t, mood: 'happy', still: true });
          pupil = 0.5;
        }
      } else if (sh === 'X2') {
        if (t < at('near') - 0.05) {   // lens
          attr(hiLens, 'opacity', 0.9 * win(t, at('lens') + 0.2, at('near'), 0.3));
          lab.lens.set(P(t, at('lens') + 0.4, 0.3, linear));
          const yp = P(t, mid('lens', 0.55), 0.45, pop); op(yoga, clamp(yp * 2.5)); tr(yoga, 1040, 600, Math.max(0.01, 0.6 + 0.4 * yp));
          tr(denW, 0, 0, 0.42, 14 * Math.sin(t * 1.5) * AMP); den.set({ t, mood: t > end('lens') ? 'happy' : 'neutral', look: -0.3 });
          op(omm, P(t, mid('lens', 0.7), 0.3, linear));
        } else if (t < at('far') - 0.05) {   // near
          const k = P(t, at('near') + 0.2, 1.4, ease);
          src = [lerp(SRC.book[0], SRC.near[0], k), lerp(SRC.book[1], SRC.near[1], k)];
          focus = lerp(0.5, 1, P(t, mid('near', 0.3), 1.6, ease));
          lab.cil.set(P(t, mid('near', 0.3), 0.3, linear));
          lab.fat.set(P(t, mid('near', 0.62), 0.3, linear));
        } else if (t < at('retina') - 0.05) {   // far
          const k = P(t, at('far') + 0.1, 0.5, linear);
          op(srcPic, 1 - k); op(srcClock, k);
          src = SRC.far;
          focus = lerp(1, 0, P(t, at('far') + 0.3, 1.6, ease));
          lab.lig.set(P(t, mid('far', 0.3), 0.3, linear));
          lab.thin.set(P(t, mid('far', 0.45), 0.3, linear));
          eyePop(cAcc, t, mid('far', 0.78), 960, 600);
          op(cAccSub, P(t, mid('far', 0.82), 0.3, linear)); attr(cAccSub, 'x', 960); attr(cAccSub, 'y', 670);
        } else {   // retina
          focus = 0.5;
          attr(hiRet, 'opacity', 0.75 * P(t, at('retina') + 0.2, 0.3, linear) * (0.8 + 0.2 * Math.sin(t * 5)));
          lab.retina.set(P(t, at('retina') + 0.4, 0.3, linear));
          const ip = P(t, mid('retina', 0.55), 0.45, pop);
          const I = eye.image(src[0], src[1]);
          op(retPic, clamp(ip * 2.5)); tr(retPic, EC[0] + I[0] - 16, EC[1] + I[1], Math.max(0.01, 0.6 + 0.4 * ip), 180);
          eyePop(cUpside, t, mid('retina', 0.75), 960, 640);
        }
      } else {   // B: the brain
        guideTalk = false;
        const I = eye.image(src[0], src[1]);
        op(retPic, 1); tr(retPic, EC[0] + I[0] - 16, EC[1] + I[1], 1, 180);
        eyePop(cReal, t, at('brain') + 0.2, 330, 175);
        lab.nerve.set(P(t, mid('brain', 0.3), 0.3, linear));
        attr(nerveGlow, 'opacity', P(t, mid('brain', 0.3), 0.3, linear) * (0.6 + 0.3 * Math.sin(t * 8)));
        op(pulseG, t > mid('brain', 0.3) ? 1 : 0);
        pulses.forEach((c, i) => { const f = ((t - mid('brain', 0.3)) * 1.1 + i / 4) % 1; attr(c, 'cx', EC[0] + 210 + f * 210); attr(c, 'cy', EC[1] + 46 + f * 20); op(c, Math.sin(f * Math.PI)); });
        eyePop(brainW, t, mid('brain', 0.42), 1075, 480);
        const fp = P(t, mid('brain', 0.62), 0.6, ease);
        op(brainPic, P(t, mid('brain', 0.55), 0.3, linear));
        brainPic.setAttribute('transform', 'translate(1075 300)');
        brainPicIn.setAttribute('transform', `scale(1 ${Math.cos(Math.PI * (1 - fp)).toFixed(3)})`);
        op(flipArrow, win(t, mid('brain', 0.6), mid('brain', 0.6) + 1.2, 0.2));
        eyePop(cBrain, t, mid('brain', 0.7), 860, 140);
      }
      eye.focus(focus); eye.pupil(pupil);
      tr(srcL, EC[0] + src[0], EC[1] + src[1]);
      const pts = eye.rays(src[0], src[1], 3, 0);
      const rp = sh === 'X' ? P(t, at('cornea') + 0.1, 1.0, linear) : 1;
      rays.forEach((r, i) => { r.pts(pts[i].map(q => [EC[0] + q[0], EC[1] + q[1]])); r.set(rp); });
      op(inset, sh === 'B' ? 0 : 1);
      guide.set({ t, talk: guideTalk ? scTalk(S, t, 'ray') : 0, mood: sh === 'X2' && t > mid('lens', 0.6) && t < at('near') ? 'deadpan' : 'neutral', look: 0.5 });
    }

    /* ---------- iris ---------- */
    if (sh === 'I') {
      const k = P(t, mid('iris', 0.5), 1.0, ease);
      irisB.pupil(lerp(0.5, 0, k)); irisD.pupil(lerp(0.5, 1, k));
      sunI.upd(t);
      eyePop(iTitle, t, at('iris') + 0.15, 600, 600);
      attr(irisLead, 'd', 'M520,578 L340,470');
      op(irisLead, P(t, at('iris') + 0.4, 0.3, linear));
      eyePop(iC1, t, mid('iris', 0.5), 300, 680);
      eyePop(iC2, t, mid('iris', 0.75), 900, 680);
    }

    /* ---------- Ray's confessional ---------- */
    if (sh === 'TB') {
      const push = P(t, end('thbrain') - 0.1, 0.9, linear);
      const ck = 1 + 0.03 * P(t, at('thbrain'), 5, linear) + 0.2 * ease(push);
      eyeCam(Lconf, ck, 430, 400); eyeCam(Lray, ck, 430, 400);
      op(Lray, 1); tr(bigW, 430, 410, 1.4);
      let mood = 'neutral';
      if (t > mid('thbrain', 0.35)) mood = 'happy';
      if (t > mid('thbrain', 0.7)) mood = 'deadpan';
      big.set({ t, talk: scTalk(S, t, 'ray'), mood, look: t > mid('thbrain', 0.7) && t < end('thbrain') ? 0.6 : 0 });
      eyePop(cBrainW, t, at('thbrain') + 0.2, 880, 280, 1, 3 * Math.sin(t * 1.5) * AMP);
      eyePop(cFix, t, mid('thbrain', 0.3), 880, 420);
      const jp = P(t, mid('thbrain', 0.72), 0.5, easeOut);
      op(cJar, jp > 0 ? 1 : 0); tr(cJar, lerp(1300, 900, jp), 530, 1, lerp(-12, 0, jp));
      eyePop(cJarChip, t, mid('thbrain', 0.85), 900, 640);
      if (t < mid('thbrain', 0.85)) op(cJarChip, 0);
      op(cFix, t < mid('thbrain', 0.3) ? 0 : 1 - P(t, mid('thbrain', 0.7), 0.25, linear));
    }

    attr(black, 'opacity', blk);
  };
});

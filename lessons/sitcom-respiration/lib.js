/* THE POWERHOUSE: shared cast and sets for the sitcom episode. Bundled after engine lib.js and kit.js.

   Who is speaking
     scWho(S, t)            -> the `who` of the line being spoken at chapter-local t ('' between lines)
     scTalk(S, t, who)      -> mouth openness 0..1 while `who` is speaking (syllable flaps), else 0

   Characters: scChar(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     kinds: 'mitch' (mitochondrion, tie), 'fern' (green plant-cell mitochondrion, flower),
            'gloria' (glucose hexagon, bow), 'twins' (O2: Otto left, Oscar right, two faces),
            'carl' (CO2: grey C with a face, red O either side), 'larry' (lactic acid: pink spiky blob, headband),
            'wally' (water: blue O, white H ears), 'bao' (yeast: cream budding cell, baker's hat),
            'kavya' (12-year-old girl, head and shoulders, PE shirt)
     o: { s (scale), mood }
     g.set({ t, talk, mood, look, talkB, moodB, lookB, sweat })   call every frame
       talk 0..1 mouth open (use scTalk); mood: 'neutral' | 'happy' | 'smug' | 'annoyed' | 'sad' | 'shock' | 'deadpan'
       look -1..1 pupils left/right; for 'twins', talk/mood/look drive Otto and talkB/moodB/lookB drive Oscar
       sweat 0..1 (kavya, larry, mitch): sweat drops
     Idle life (blinks, a slight bob) comes from t. Characters are drawn facing the viewer.

   Props and sets
     scMug(parent, s)               Mitch's mug, "#1 POWERHOUSE"
     scClipboard(parent, s)         a clipboard
     scConfessional(parent, kind)   full-stage talking-head background, tinted for the speaker; g.set(p) fades it
     scLowerThird(parent, name, role)  name strap, bottom left above the caption area; g.set(p) slides it in
     scOffice(parent)               inside the mitochondrion: folded cristae walls, warm light (full stage)
     scBlood(parent)                a blood vessel with drifting red cells (full stage); g.upd(t)
     scTrack(parent)                Sports Day: blue sky, sun, running track, lane lines, school building (full stage); g.upd(t)
     scVideoCall(parent, w, h, label)  laptop-style call window; put a character in g.slot
*/

/* ---------- who is speaking ---------- */
function scWho(S, t) {
  const c = S.ch;
  for (const l of c.lines) {
    const a = l.start - c.start, b = l.end - c.start;
    if (t >= a - 0.02 && t < b + 0.05) return l.who || '';
  }
  return '';
}
const SC_SEED = { narr: 1, mitch: 2, gloria: 3, otto: 4, oscar: 5, carl: 6, larry: 7, kavya: 8, fern: 9, bao: 10, wally: 11 };
function scTalk(S, t, who) {
  if (scWho(S, t) !== who) return 0;
  const k = SC_SEED[who] || 1;
  const a = Math.sin(t * TAU * (4.1 + k * 0.13) + k), b = Math.sin(t * TAU * (1.3 + k * 0.07) + k * 2);
  return clamp(0.18 + 0.82 * Math.abs(a) * (0.55 + 0.45 * b));
}

/* ---------- face kit ---------- */
const SC_INK = '#2A1A22';
function scFace(parent, o) {
  // o: w (face width), eye (eye radius), gap (eye spacing), mouthW, mouthY, brow (bool), lidCol, iris
  const g = G(parent);
  const er = o.eye, gap = o.gap, eyes = [];
  [-1, 1].forEach(side => {
    const e = G(g); tr(e, side * gap / 2, 0);
    E('ellipse', { rx: er, ry: er * 1.12, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': Math.max(2, er * 0.12) }, e);
    const pupil = E('circle', { r: er * 0.48, fill: o.iris || SC_INK }, e);
    const shine = E('circle', { r: er * 0.16, fill: '#FFFFFF' }, e);
    const lid = E('path', { d: '', fill: o.lidCol || '#999', stroke: SC_INK, 'stroke-width': Math.max(2, er * 0.12) }, e);
    const brow = o.brow === false ? null : E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': Math.max(3, er * 0.22), 'stroke-linecap': 'round' }, g);
    eyes.push({ side, e, pupil, shine, lid, brow });
  });
  const mouth = E('path', { d: '', fill: '#5A1E2A', stroke: SC_INK, 'stroke-width': Math.max(2.5, o.mouthW * 0.06), 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
  const LID = { neutral: 0.08, happy: 0.12, smug: 0.42, annoyed: 0.45, sad: 0.3, shock: 0, deadpan: 0.55 };
  const SMILE = { neutral: 0.25, happy: 0.9, smug: 0.45, annoyed: -0.3, sad: -0.7, shock: 0, deadpan: 0 };
  const BROW = { neutral: [0, 0], happy: [-0.25, -0.25], smug: [0.15, -0.55], annoyed: [0.55, 0.55], sad: [-0.6, -0.6], shock: [-1, -1], deadpan: [0.15, 0.15] };
  g.set = (st) => {
    const mood = st.mood || 'neutral', talk = st.talk || 0, look = st.look || 0, blink = st.blink || 0;
    let lidF = Math.max(LID[mood] ?? 0.1, blink);
    eyes.forEach(({ side, pupil, shine, lid, brow }) => {
      const px = look * er * 0.42, py = mood === 'sad' ? er * 0.18 : 0;
      attr(pupil, 'cx', px); attr(pupil, 'cy', py); attr(shine, 'cx', px + er * 0.18); attr(shine, 'cy', py - er * 0.2);
      // lid covers the top lidF of the eye; sad lids slope down to the outside, annoyed to the inside
      // the lid is the part of the eye above a line, so it follows the eye's outline
      const ry = er * 1.12, yb = -ry + 2 * ry * Math.min(lidF, 0.98);
      const xw = er * Math.sqrt(Math.max(0, 1 - (yb / ry) * (yb / ry)));
      const tilt = mood === 'sad' ? -side * 14 : mood === 'annoyed' ? side * 12 : 0;
      if (lidF < 0.02) attr(lid, 'd', '');
      else {
        attr(lid, 'd', `M${(-xw).toFixed(1)},${yb.toFixed(1)} A${er.toFixed(1)},${ry.toFixed(1)} 0 ${yb > 0 ? 1 : 0} 1 ${xw.toFixed(1)},${yb.toFixed(1)} Z`);
        attr(lid, 'transform', tilt ? `rotate(${tilt})` : '');
      }
      if (brow) {
        const b = BROW[mood] || [0, 0], inner = side < 0 ? b[1] : b[0];
        const raise = mood === 'smug' && side > 0 ? -er * 0.5 : 0;
        const y0 = -er * 1.55 + raise, xIn = -side * er * 0.15, xOut = side * er * 1.05;
        attr(brow, 'd', `M${(side * gap / 2 + xIn).toFixed(1)},${(y0 + inner * er * 0.45).toFixed(1)} L${(side * gap / 2 + xOut).toFixed(1)},${(y0 - inner * er * 0.25).toFixed(1)}`);
      }
    });
    // mouth: a lip curve; opens into a filled shape while talking (or in shock)
    const w = o.mouthW, my = o.mouthY, k = SMILE[mood] ?? 0.2;
    const open = Math.max(talk, mood === 'shock' ? 0.85 : 0);
    const cy = my - k * w * 0.16, mid = my + k * w * 0.14;
    const sk = mood === 'smug' ? w * 0.12 : 0;   // smug: lopsided
    if (open < 0.04) {
      attr(mouth, 'd', `M${-w / 2},${cy.toFixed(1)} Q0,${mid.toFixed(1)} ${w / 2},${(cy - sk).toFixed(1)}`);
      attr(mouth, 'fill', 'none'); attr(mouth, 'stroke-width', Math.max(4, w * 0.11));
    } else {
      const ow = mood === 'shock' ? w * 0.7 : w;
      const lo = mid + open * w * 0.55;
      attr(mouth, 'd', `M${-ow / 2},${cy.toFixed(1)} Q0,${(mid - open * w * 0.08).toFixed(1)} ${ow / 2},${(cy - sk).toFixed(1)} Q0,${lo.toFixed(1)} ${-ow / 2},${cy.toFixed(1)} Z`);
      attr(mouth, 'fill', '#5A1E2A'); attr(mouth, 'stroke-width', Math.max(3, w * 0.07));
    }
  };
  return g;
}
function scBlink(t, seed) {
  const period = 3.1 + (seed % 5) * 0.37, ph = (t + seed * 0.71) % period;
  return ph < 0.13 ? 1 - Math.abs(ph - 0.065) / 0.065 : 0;
}
function scSweat(parent, pts) {
  const g = G(parent), drops = pts.map(([x, y]) => {
    const d = E('path', { d: 'M0,-12 Q9,2 0,8 Q-9,2 0,-12 Z', fill: '#BFEAFF', stroke: '#5AB4E0', 'stroke-width': 2 }, g); tr(d, x, y); return { d, x, y };
  });
  g.set = (v, t) => drops.forEach(({ d, x, y }, i) => { const f = ((t || 0) * 0.8 + i * 0.37) % 1; op(d, v * (1 - f)); tr(d, x, y + f * 26); });
  return g;
}

/* ---------- characters ---------- */
function scChar(parent, kind, o) {
  o = o || {};
  const outer = G(parent), g = G(outer), s = o.s || 1;
  let face = null, faceB = null, sweat = null, seed = SC_SEED[kind] || 3, bob = 4, extra = null;
  const out = (w) => Math.max(3, w);
  if (kind === 'mitch' || kind === 'fern') {
    const green = kind === 'fern';
    const m = mitochondrion(g, 250, 150, { folds: 5 });
    if (green) m.querySelectorAll('rect,path').forEach(el => {
      const f = el.getAttribute('fill'), st = el.getAttribute('stroke');
      if (f && f !== 'none') el.setAttribute('fill', f === C.mitoIn ? '#D9F7DF' : ball('#7FE08F', '#2C8C4C'));
      if (st && st !== 'none') el.setAttribute('stroke', '#2C8C4C');
    });
    E('ellipse', { rx: 86, ry: 52, fill: green ? '#E9FBEC' : '#FFE6D6', opacity: 0.95 }, g);   // face patch
    face = scFace(g, { eye: 17, gap: 52, mouthW: 46, mouthY: 30, lidCol: green ? '#7FE08F' : '#FF9466' });
    tr(face, 0, -6);
    if (!green) {   // tie
      E('path', { d: 'M-9,70 L9,70 L6,80 L14,128 L0,142 L-14,128 L-6,80 Z', fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-4,96 L8,104 M-6,114 L9,122', stroke: '#9FB4FF', 'stroke-width': 3 }, g);
    } else {        // flower
      const f = G(g); tr(f, 92, -60);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; E('circle', { cx: Math.cos(a) * 12, cy: Math.sin(a) * 12, r: 9, fill: '#FF9BD2', stroke: SC_INK, 'stroke-width': 2 }, f); }
      E('circle', { r: 8, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, f);
    }
    sweat = scSweat(g, [[-108, -40], [112, -30]]);
    bob = 3;
  } else if (kind === 'gloria') {
    const R = 92, pts = [];
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU - Math.PI / 2; pts.push([Math.cos(a) * R, Math.sin(a) * R]); }
    E('path', { d: 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L') + ' Z', fill: ball(C.glucose, C.glucoseDk), stroke: C.glucoseDk, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    face = scFace(g, { eye: 19, gap: 56, mouthW: 44, mouthY: 34, lidCol: C.glucose, iris: '#5A2B07' });
    tr(face, 0, -8);
    // bow and sparkle
    const bw = G(g); tr(bw, 46, -86, 1, 18);
    E('path', { d: 'M0,0 L-30,-18 L-30,18 Z M0,0 L30,-18 L30,18 Z', fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bw);
    E('circle', { r: 8, fill: '#FF3E9A', stroke: SC_INK, 'stroke-width': 3 }, bw);
    extra = spark(g, 16); tr(extra, -78, -70);
    E('ellipse', { cx: -46, cy: 22, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.6 }, g);
    E('ellipse', { cx: 46, cy: 22, rx: 13, ry: 8, fill: '#FF8FB0', opacity: 0.6 }, g);
    bob = 6;
  } else if (kind === 'twins') {
    const L = G(g), R = G(g); tr(L, -54, 0); tr(R, 54, 0);
    E('rect', { x: -30, y: -10, width: 60, height: 20, fill: C.oxygenDk, rx: 6 }, g);  // the bond
    [L, R].forEach(h => E('circle', { r: 70, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 5 }, h));
    face = scFace(L, { eye: 15, gap: 44, mouthW: 36, mouthY: 28, lidCol: C.oxygen });
    faceB = scFace(R, { eye: 15, gap: 44, mouthW: 36, mouthY: 28, lidCol: C.oxygen });
    tr(face, 0, -6); tr(faceB, 0, -6);
    E('path', { d: 'M-22,-66 L-12,-92 L-2,-68 L8,-94 L16,-66', fill: C.oxygenDk, stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, L);  // Otto: spiky tuft
    const gl = G(R); tr(gl, 0, -6);                                                                                    // Oscar: glasses
    E('circle', { cx: -22, r: 21, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, gl);
    E('circle', { cx: 22, r: 21, fill: 'none', stroke: SC_INK, 'stroke-width': 4 }, gl);
    E('path', { d: 'M-1,0 L1,0', stroke: SC_INK, 'stroke-width': 4 }, gl);
    T(L, 0, 98, 'O', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
    T(R, 0, 98, 'O', { size: 30, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
    bob = 5;
  } else if (kind === 'carl') {
    [-1, 1].forEach(sd => { const ox = G(g); tr(ox, sd * 112, 8); E('circle', { r: 50, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 5 }, ox); T(ox, 0, 11, 'O', { size: 32, weight: 800, anchor: 'middle', fill: '#FFE1DC' }); });
    E('path', { d: 'M-70,-2 L-58,-2 M-70,16 L-58,16 M58,-2 L70,-2 M58,16 L70,16', stroke: SC_INK, 'stroke-width': 6 }, g);
    E('circle', { r: 72, fill: ball(C.carbon, C.carbonDk), stroke: C.carbonDk, 'stroke-width': 5 }, g);
    face = scFace(g, { eye: 15, gap: 46, mouthW: 38, mouthY: 30, lidCol: C.carbon });
    tr(face, 0, -8);
    bob = 2;
  } else if (kind === 'larry') {
    const d = closedPath(blobPts(96, 90, 14, 0, 0, 5).map(([x, y], i) => (i % 2 ? [x * 0.78, y * 0.78] : [x * 1.08, y * 1.08])));
    E('path', { d, fill: ball(C.lactic, C.lacticDk), stroke: C.lacticDk, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
    E('path', { d: 'M-66,-46 Q0,-74 66,-46 L60,-30 Q0,-56 -60,-30 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);  // headband
    E('path', { d: 'M-12,-58 L12,-58 L4,-46 Z', fill: '#FF3E3E' }, g);
    face = scFace(g, { eye: 17, gap: 50, mouthW: 58, mouthY: 30, lidCol: C.lactic });
    tr(face, 0, 0);
    sweat = scSweat(g, [[-90, -10], [92, 0]]);
    bob = 8;
  } else if (kind === 'wally') {
    [-1, 1].forEach(sd => { const h = G(g); tr(h, sd * 70, -54); E('circle', { r: 34, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 4 }, h); T(h, 0, 9, 'H', { size: 24, weight: 800, anchor: 'middle', fill: '#6B7B8A' }); });
    E('circle', { r: 72, fill: ball(C.water, C.waterDk), stroke: C.waterDk, 'stroke-width': 5 }, g);
    face = scFace(g, { eye: 14, gap: 44, mouthW: 30, mouthY: 28, lidCol: C.water, brow: false });
    tr(face, 0, 0);
    bob = 2;
  } else if (kind === 'bao') {
    const bud = E('ellipse', { cx: 92, cy: -52, rx: 38, ry: 32, fill: ball('#F3E3BE', '#B99A5C'), stroke: '#8A6D35', 'stroke-width': 5 }, g);
    E('ellipse', { rx: 98, ry: 84, fill: ball('#F7EACB', '#B99A5C'), stroke: '#8A6D35', 'stroke-width': 6 }, g);
    E('circle', { cx: -34, cy: 40, r: 14, fill: '#E5CF9E', opacity: 0.8 }, g);   // a vacuole, for texture
    face = scFace(g, { eye: 16, gap: 50, mouthW: 40, mouthY: 30, lidCol: '#EBD7A8' });
    tr(face, 0, 4);
    const hat = G(g); tr(hat, -10, -72, 1, -8);   // baker's hat
    E('rect', { x: -46, y: -6, width: 92, height: 26, rx: 6, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, hat);
    E('path', { d: 'M-44,-4 C-70,-30 -40,-70 -14,-52 C-8,-84 34,-84 36,-52 C66,-68 80,-28 44,-4 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, hat);
    extra = bud;
    bob = 3;
  } else if (kind === 'kavya') {
    const skin = '#B9784E', hair = '#1E1410';
    E('path', { d: 'M-100,140 Q-96,62 -40,52 L40,52 Q96,62 100,140 Z', fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 4 }, g);  // PE shirt
    E('path', { d: 'M-22,52 L0,74 L22,52', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, g);
    T(g, 52, 118, '8', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('rect', { x: -18, y: 30, width: 36, height: 28, fill: skin }, g);   // neck
    E('path', { d: 'M74,-40 Q132,-10 104,60 Q96,20 70,-6 Z', fill: hair, stroke: SC_INK, 'stroke-width': 3 }, g);   // ponytail
    E('ellipse', { cx: 0, cy: -34, rx: 74, ry: 80, fill: skin, stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-76,-34 Q-80,-120 0,-118 Q80,-120 76,-34 Q60,-84 8,-80 Q-30,-96 -76,-34 Z', fill: hair, stroke: SC_INK, 'stroke-width': 3 }, g);
    E('circle', { cx: 74, cy: -46, r: 8, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2 }, g);   // hair tie
    face = scFace(g, { eye: 15, gap: 50, mouthW: 36, mouthY: 30, lidCol: skin });
    tr(face, 0, -22);
    sweat = scSweat(g, [[-62, -78], [66, -70], [-80, -20]]);
    bob = 2;
  }
  tr(outer, 0, 0, s);
  outer.set = (st) => {
    const t = st.t || 0, b = Math.sin(t * TAU * 0.5 + seed) * bob * (st.still ? 0 : 1);
    tr(g, 0, b);
    if (face) face.set({ mood: st.mood || o.mood || 'neutral', talk: st.talk || 0, look: st.look || 0, blink: scBlink(t, seed) });
    if (faceB) faceB.set({ mood: st.moodB || st.mood || o.mood || 'neutral', talk: st.talkB || 0, look: st.lookB ?? st.look ?? 0, blink: scBlink(t, seed + 3) });
    if (sweat) sweat.set(st.sweat || 0, t);
    if (kind === 'bao' && extra) attr(extra, 'rx', 38 + 3 * Math.sin(t * 1.3));
  };
  outer.set({});
  return outer;
}

/* ---------- props ---------- */
function scMug(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M38,-30 Q70,-30 70,0 Q70,30 38,30', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10 }, g);
  E('rect', { x: -44, y: -50, width: 88, height: 100, rx: 10, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  T(g, 0, -10, '#1', { size: 30, weight: 800, anchor: 'middle', fill: '#E8424F' });
  T(g, 0, 22, 'POWER', { size: 17, weight: 800, anchor: 'middle', fill: SC_INK });
  T(g, 0, 40, 'HOUSE', { size: 17, weight: 800, anchor: 'middle', fill: SC_INK });
  E('path', { d: 'M-18,-62 Q-8,-78 -18,-94 M6,-62 Q16,-78 6,-94', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' }, g);
  return g;
}
function scClipboard(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -70, y: -92, width: 140, height: 184, rx: 10, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -58, y: -74, width: 116, height: 154, fill: '#FFFFFF' }, g);
  E('rect', { x: -28, y: -102, width: 56, height: 22, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, g);
  for (let i = 0; i < 6; i++) E('line', { x1: -44, y1: -48 + i * 22, x2: 44, y2: -48 + i * 22, stroke: '#C9D3DC', 'stroke-width': 4 }, g);
  return g;
}

/* ---------- sets ---------- */
const SC_TINT = { mitch: ['#3B1F2B', '#6B2F3A'], fern: ['#173326', '#245A3B'], gloria: ['#3A2A10', '#6B4A12'], twins: ['#3A1414', '#6E2323'],
  carl: ['#22272E', '#3D4652'], larry: ['#3A1230', '#6B1F55'], wally: ['#0E2C3A', '#14506A'], bao: ['#3A2E18', '#6B5426'], kavya: ['#14243A', '#25446B'] };
function scConfessional(parent, kind) {
  const g = G(parent), [a, b] = SC_TINT[kind] || SC_TINT.mitch;
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad(a, b, true) }, g);
  const r = rng((SC_SEED[kind] || 1) * 31);
  for (let i = 0; i < 9; i++) E('circle', { cx: 620 + r() * 560, cy: 60 + r() * 420, r: 30 + r() * 70, fill: '#FFFFFF', opacity: 0.04 + r() * 0.05 }, g);
  // a "window" behind the speaker, soft-focus
  E('rect', { x: 700, y: 110, width: 330, height: 250, rx: 18, fill: '#FFFFFF', opacity: 0.06 }, g);
  E('line', { x1: 865, y1: 110, x2: 865, y2: 360, stroke: '#FFFFFF', 'stroke-width': 8, opacity: 0.06 }, g);
  // documentary REC mark, top right
  const rec = G(g); tr(rec, 1080, 64);
  E('circle', { cx: -42, cy: -8, r: 9, fill: '#FF3B3B' }, rec);
  T(rec, -26, 2, 'REC', { size: 26, weight: 700, fill: '#FFFFFF', opacity: 0.8 });
  g.rec = rec;
  g.set = (p, t) => { op(g, p); if (t !== undefined) op(rec.firstChild, Math.sin(t * TAU * 0.8) > 0 ? 1 : 0.15); };
  return g;
}
function scLowerThird(parent, name, role) {
  const g = G(parent), inner = G(g);
  const w = Math.max(textWidth(name, 40, FD, 800), textWidth(role, 26, FB, 600)) + 70;
  E('rect', { x: 0, y: 0, width: w, height: 98, rx: 14, fill: '#0E1A24', opacity: 0.88 }, inner);
  E('rect', { x: 0, y: 0, width: 10, height: 98, rx: 5, fill: C.energy }, inner);
  T(inner, 32, 44, name, { size: 40, weight: 800 });
  T(inner, 32, 80, role, { size: 26, weight: 600, font: FB, fill: C.muted });
  tr(g, 50, 600);
  g.set = (p) => { op(g, clamp(p * 2)); tr(inner, -40 * (1 - clamp(p)), 0); };
  return g;
}
function scOffice(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3A1A1E', '#5A2626', true) }, g);
  // cristae: big folded walls reaching in from top and bottom
  let d = '';
  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 175, top = i % 2 === 0, y0 = top ? -20 : 770, y1 = top ? 300 : 450, w = 50;
    d += `M${x - w},${y0} L${x - w},${y1 + (top ? -w : w)} Q${x},${y1 + (top ? w : -w)} ${x + w},${y1 + (top ? -w : w)} L${x + w},${y0} Z `;
  }
  E('path', { d, fill: '#7A3434', stroke: '#9E4A40', 'stroke-width': 8, opacity: 0.55 }, g);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#2A1216', opacity: 0.6 }, g);   // floor
  E('ellipse', { cx: 600, cy: 300, rx: 520, ry: 300, fill: glow('#FFB27A'), opacity: 0.25 }, g);
  return g;
}
function scBlood(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3C0D14', '#6A1620', true) }, g);
  E('rect', { x: 0, y: 150, width: 1200, height: 450, fill: '#8E1F2A', opacity: 0.55 }, g);
  E('path', { d: 'M0,150 L1200,150 M0,600 L1200,600', stroke: '#C2454F', 'stroke-width': 14, opacity: 0.7 }, g);
  const r = rng(77), cells = [];
  for (let i = 0; i < 12; i++) {
    const c = E('ellipse', { rx: 34, ry: 15, fill: ball('#FF6B6B', '#B32635'), opacity: 0.55 }, g);
    cells.push({ c, x: r() * 1300, y: 180 + r() * 390, v: 40 + r() * 50, a: r() * 360 });
  }
  g.upd = t => cells.forEach(({ c, x, y, v, a }) => tr(c, ((x + t * v) % 1350) - 75, y + 10 * Math.sin(t + a), 1, a + t * 20));
  return g;
}
function scTrack(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#5EC4FF', '#BDE9FF', true) }, g);
  const sunG = G(g); tr(sunG, 1060, 110);
  E('circle', { r: 120, fill: glow('#FFE45C') }, sunG); E('circle', { r: 52, fill: '#FFE45C' }, sunG);
  E('rect', { x: 120, y: 250, width: 420, height: 140, fill: '#E9E2D0', stroke: '#9C927C', 'stroke-width': 4 }, g);   // school block
  for (let i = 0; i < 6; i++) E('rect', { x: 145 + i * 66, y: 280, width: 40, height: 34, fill: '#7FB6D9' }, g);
  T(g, 330, 372, 'SPORTS DAY', { size: 30, weight: 800, anchor: 'middle', fill: '#C2453A' });
  E('rect', { x: 0, y: 390, width: 1200, height: 70, fill: '#5BBF6A' }, g);
  E('rect', { x: 0, y: 460, width: 1200, height: 290, fill: '#C9563F' }, g);
  for (let i = 1; i < 5; i++) E('line', { x1: 0, y1: 460 + i * 58, x2: 1200, y2: 460 + i * 58, stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.8 }, g);
  const dash = E('path', { d: '', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.35 }, g);
  g.upd = (t, speed) => { const off = -((t * (speed || 0)) % 200); let d = ''; for (let x = off; x < 1260; x += 200) d += `M${x.toFixed(0)},748 L${(x + 60).toFixed(0)},748 `; attr(dash, 'd', d); };
  return g;
}
function scVideoCall(parent, w, h, label) {
  const g = G(parent);
  E('rect', { x: -w / 2 - 14, y: -h / 2 - 44, width: w + 28, height: h + 58, rx: 18, fill: '#1B2733', stroke: '#3A4B5C', 'stroke-width': 4 }, g);
  E('circle', { cx: -w / 2 + 12, cy: -h / 2 - 22, r: 7, fill: '#FF6060' }, g);
  E('circle', { cx: -w / 2 + 34, cy: -h / 2 - 22, r: 7, fill: '#FFC247' }, g);
  E('circle', { cx: -w / 2 + 56, cy: -h / 2 - 22, r: 7, fill: '#56D69B' }, g);
  T(g, 0, -h / 2 - 12, label || 'Video call', { size: 24, weight: 700, anchor: 'middle', fill: C.muted, font: FB });
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8, fill: linGrad('#1F4A33', '#2E6E4A', true) }, g);
  const clipId = 'scvc' + Math.round(w * 13 + h * 7);
  const cp = E('clipPath', { id: clipId }, defs()); E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 8 }, cp);
  g.slot = G(g, { 'clip-path': `url(#${clipId})` });
  return g;
}

/* Kavya, full body (kit person in her PE kit with a ponytail), feet at (0,0). Use g.pose(runPose(t)) etc. */
function scKavyaBody(parent) {
  const p = person(parent, { skin: '#B9784E', shirt: '#2E7DD8', shorts: '#1E2A44', hair: '#1E1410', shoes: '#F2F7FA' });
  const body = p.firstChild;
  E('path', { d: 'M-14,-186 Q-38,-182 -40,-158 Q-30,-168 -16,-172 Z', fill: '#1E1410' }, body);   // ponytail, behind the head
  E('circle', { cx: -15, cy: -180, r: 4, fill: '#FF5FA2' }, body);
  return p;
}

/* Sitcom kit: shared by every Claude Sitcom episode (bundled when a script's META has "kit": "sitcom").
   An episode's own lib.js builds its cast with scMake and adds its own sets and props.

   Speech
     scWho(S, t)               the `who` of the line being spoken at chapter-local t ('' between lines)
     scTalk(S, t, who)         mouth openness 0..1 while `who` speaks (syllable flaps), else 0
   Characters
     scMake(parent, o)         a character: o.draw(g) draws the body (origin = centre, about 200 px tall);
                               o.face = { x, y, eye, gap, mouthW, mouthY, lidCol, iris, brow }; o.faceB for a second face;
                               o.sweat = [[x, y], ...]; o.bob (px); o.seed; o.s (scale); o.mood (default mood); o.upd(t, g)
                               returns g with g.set({ t, talk, mood, look, talkB, moodB, lookB, sweat, still })
                               moods: neutral | happy | smug | annoyed | sad | shock | deadpan
     scKavya(parent, o)        Kavya, 12, the recurring human (head and shoulders, PE shirt "8"); same g.set
     scKavyaBody(parent)       Kavya full body (kit person + ponytail), feet at (0,0); g.pose(runPose(t)) etc.
   Shots and sets
     scConfessional(parent, a, b)  full-stage talking-head background in colours a (top) and b (bottom), REC mark; g.set(p, t)
     scLowerThird(parent, name, role)  name strap bottom left; g.set(p)
     scVideoCall(parent, w, h, label)  call window; put a character in g.screen
     scTrack(parent), scBlood(parent)  Sports Day track (g.upd(t, speed)), a blood vessel (g.upd(t))
     scClipboard(parent, s)
*/
function scWho(S, t) {
  const c = S.ch;
  for (const l of c.lines) {
    const a = l.start - c.start, b = l.end - c.start;
    if (t >= a - 0.02 && t < b + 0.05) return l.who || '';
  }
  return '';
}

function scSeed(who) { let h = 7; for (const c of String(who)) h = (h * 31 + c.charCodeAt(0)) % 997; return 1 + (h % 23); }
function scTalk(S, t, who) {
  if (scWho(S, t) !== who) return 0;
  const k = scSeed(who);
  const a = Math.sin(t * TAU * (4.1 + k * 0.13) + k), b = Math.sin(t * TAU * (1.3 + k * 0.07) + k * 2);
  return clamp(0.18 + 0.82 * Math.abs(a) * (0.55 + 0.45 * b));
}

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

function scMake(parent, o) {
  const outer = G(parent), g = G(outer);
  if (o.draw) o.draw(g);
  let face = null, faceB = null, sweat = null;
  if (o.face) { face = scFace(g, o.face); tr(face, o.face.x || 0, o.face.y || 0); }
  if (o.faceB) { faceB = scFace(g, o.faceB); tr(faceB, o.faceB.x || 0, o.faceB.y || 0); }
  if (o.sweat) sweat = scSweat(g, o.sweat);
  const seed = o.seed || 3, bob = o.bob === undefined ? 4 : o.bob;
  tr(outer, 0, 0, o.s || 1);
  outer.set = (st) => {
    st = st || {};
    const t = st.t || 0, b = Math.sin(t * TAU * 0.5 + seed) * bob * (st.still ? 0 : 1);
    tr(g, 0, b);
    if (face) face.set({ mood: st.mood || o.mood || 'neutral', talk: st.talk || 0, look: st.look || 0, blink: scBlink(t, seed) });
    if (faceB) faceB.set({ mood: st.moodB || st.mood || o.mood || 'neutral', talk: st.talkB || 0, look: st.lookB ?? st.look ?? 0, blink: scBlink(t, seed + 3) });
    if (sweat) sweat.set(st.sweat || 0, t);
    if (o.upd) o.upd(t, g, st);
  };
  outer.set({});
  return outer;
}
function scKavya(parent, o) {
  o = o || {};
  return scMake(parent, { s: o.s, mood: o.mood, seed: 8, bob: 2,
    draw: g => {
    const skin = '#B9784E', hair = '#1E1410';
    E('path', { d: 'M-100,140 Q-96,62 -40,52 L40,52 Q96,62 100,140 Z', fill: '#2E7DD8', stroke: SC_INK, 'stroke-width': 4 }, g);  // PE shirt
    E('path', { d: 'M-22,52 L0,74 L22,52', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, g);
    T(g, 52, 118, '8', { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
    E('rect', { x: -18, y: 30, width: 36, height: 28, fill: skin }, g);   // neck
    E('path', { d: 'M74,-40 Q132,-10 104,60 Q96,20 70,-6 Z', fill: hair, stroke: SC_INK, 'stroke-width': 3 }, g);   // ponytail
    E('ellipse', { cx: 0, cy: -34, rx: 74, ry: 80, fill: skin, stroke: SC_INK, 'stroke-width': 4 }, g);
    E('path', { d: 'M-76,-34 Q-80,-120 0,-118 Q80,-120 76,-34 Q60,-84 8,-80 Q-30,-96 -76,-34 Z', fill: hair, stroke: SC_INK, 'stroke-width': 3 }, g);
    E('circle', { cx: 74, cy: -46, r: 8, fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 2 }, g);   // hair tie
    },
    face: { x: 0, y: -22, eye: 15, gap: 50, mouthW: 36, mouthY: 30, lidCol: '#B9784E' },
    sweat: [[-62, -78], [66, -70], [-80, -20]] });
}
function scConfessional(parent, a, b) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad(a || '#14243A', b || '#25446B', true) }, g);
  const r = rng(String(a).length * 31 + 7);
  for (let i = 0; i < 9; i++) E('circle', { cx: 620 + r() * 560, cy: 60 + r() * 420, r: 30 + r() * 70, fill: '#FFFFFF', opacity: 0.04 + r() * 0.05 }, g);
  E('rect', { x: 700, y: 110, width: 330, height: 250, rx: 18, fill: '#FFFFFF', opacity: 0.06 }, g);
  E('line', { x1: 865, y1: 110, x2: 865, y2: 360, stroke: '#FFFFFF', 'stroke-width': 8, opacity: 0.06 }, g);
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
  g.screen = G(g, { 'clip-path': `url(#${clipId})` });
  return g;
}

function scKavyaBody(parent) {
  const p = person(parent, { skin: '#B9784E', shirt: '#2E7DD8', shorts: '#1E2A44', hair: '#1E1410', shoes: '#F2F7FA' });
  const body = p.firstChild;
  E('path', { d: 'M-14,-186 Q-38,-182 -40,-158 Q-30,-168 -16,-172 Z', fill: '#1E1410' }, body);   // ponytail, behind the head
  E('circle', { cx: -15, cy: -180, r: 4, fill: '#FF5FA2' }, body);
  return p;
}

function scClipboard(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -70, y: -92, width: 140, height: 184, rx: 10, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -58, y: -74, width: 116, height: 154, fill: '#FFFFFF' }, g);
  E('rect', { x: -28, y: -102, width: 56, height: 22, rx: 6, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 3 }, g);
  for (let i = 0; i < 6; i++) E('line', { x1: -44, y1: -48 + i * 22, x2: 44, y2: -48 + i * 22, stroke: '#C9D3DC', 'stroke-width': 4 }, g);
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


/* NEUTRAL GROUND (Claude Sitcom Ep 8, Acids, Bases & Metals): cast, sets and props.
   Bundled after engine/lib.js, engine/kit.js and engine/sitcom.js. Every top-level name here starts with `ng`
   (except `cast`). Shared kit you will also need: scTalk, scWho, scConfessional, scLowerThird, scClipboard,
   kit beaker / testTube / flask, lib chip / card / arrow / tick / cross / spark / glow / ball.

   COLOUR RULE: universal-indicator colours mean pH everywhere in this episode. ngPH(ph) gives the colour:
   red 0-2, orange 3-4, yellow 5-6, green 7, blue 8-11, purple 12-14. Acid things lean red, alkali things purple.

   ---------------------------------------------------------------- characters
   cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1 (Henry ~130: he is tiny).
     kinds: 'indi'      Indi, universal indicator, the wedding planner: a teardrop whose colour IS her pH, headset, clipboard
            'hal'       Hal, hydrochloric acid, the groom: red spiky star, bow tie, buttonhole flower
            'natalie'   Natalie, sodium hydroxide (alkali), the bride: purple soap bubble, veil, tiara, little floating bubbles
            'henry'     Henry, hydrogen (H2), the best man: two small white atoms, cowlick, tiny bow tie, sweats
            'maggie'    Maggie, magnesium, the wedding crasher: silver metal block, pink sweatband, a curl of ribbon on top, "Mg"
            'goldie'    Auntie Goldie, gold: gold ingot (trapezoid), sunglasses pushed up, pearls, folding fan, "Au"; default mood smug
            'potassium' Potassium: small soft grey cube, "K"; put him in ngJar. Default mood deadpan. Silent until the stinger.
            'kavya'     Kavya (shared scKavya, head and shoulders) with lab goggles: o.goggles 'on' (default) | 'up' | false
     o: { s (scale), mood, ph (Indi only: starting pH, default 1) }
     g.set({ t, talk, mood, look, sweat, still, ph, fizz })     call every frame
       talk 0..1 (use scTalk(S, t, who)); mood: neutral | happy | smug | annoyed | sad | shock | deadpan; look -1..1
       sweat 0..1 (henry, hal, maggie, kavya)
       ph 0..14 (indi): her body colour follows ngPH(ph); keep her pH in step with the liquid she is in
       fizz 0..1 (maggie, hal, henry): hydrogen bubbles stream up around the character
     Idle life (blinks, bob) comes from t. Characters face the viewer.

   ---------------------------------------------------------------- colour and text helpers
   ngPH(ph)                    universal-indicator colour (hex) for pH 0..14, smoothly blended
   ngMix(a, b, p)              blend two hex colours (p = 0 gives a)
   ngFormula(parent, x, y, str, o)   one line of text with real sub/superscripts: "H_2O", "H^+ + OH^- → H_2O", "CO_2"
                               (_ = next char subscript, ^ = next char superscript; use {} for longer runs: "SO_{4}").
                               o: size (40), fill, weight (800), anchor ('middle'), font. Returns the <text>.
   ngEq(parent, terms, o)      a word equation that builds term by term. terms: ['acid','+','base','→','salt','+','water'];
                               '\n' starts a second row. o: size (46), colors { term: colour }, gap. Centred on (0,0).
                               g.set(p 0..1) reveals the terms in order; g.terms[i] are the <text>s; g.w, g.h its size.
   ngIon(parent, kind, r)      an ion ball with its label: 'H+' (white), 'OH-' (red O + white H), 'Cl-' (green), 'Na+' (lilac). r = 30

   ---------------------------------------------------------------- sets (full stage 1200 x 750)
   ngLab(parent)               Kavya's school lab: tiled wall, window with HDB blocks and sky, ceiling fan, "GOGGLES ON" sign,
                               periodic-table poster, dark bench top from y 540. g.upd(t) turns the fan. g.bench: a group on the bench
                               for props (beaker etc.); g.window: the window group.
   ngBench(parent, y)          the lab bench on its own (top at y, default 540) for a FOREGROUND layer, so it hides Kavya's
                               lower half and props can stand on it
   ngVenue(parent)             INSIDE the beaker: liquid tinted by pH, curved glass walls, the meniscus up top with light,
                               a flower arch at (600, 330), aisle carpet, chairs, bunting, drifting particles, rising bubbles.
                               g.set(ph, t) recolours the liquid; g.arch, g.aisle, g.chairs for the animators to hide/show.
   ngConf(parent, kind)        the confessional for a cast kind (scConfessional with that character's tint). g.set(p, t)

   ---------------------------------------------------------------- props
   ngDropper(parent, s)        glass dropper, tip at (0,0) pointing down, about 300 tall. g.set(squeeze 0..1, liquidColour);
                               g.drop: a drop at the tip for the scene to move
   ngSplint(parent, s)         wooden splint from (0,0) to (220,0), the tip on the right. g.set(state, t): 'off' | 'lit' | 'glow' | 'out'
   ngPop(parent, text)         comic burst ("POP!") about 260 wide. g.set(p 0..1): pops in and wobbles
   ngPhScale(parent, w)        pH 0-14 bar, w wide (default 980), centred on (0,0), numbers below (only 0, 7, 14 when w < 780), ACIDIC / NEUTRAL / ALKALINE above.
                               g.x(ph) -> x of that pH on the bar; g.set(ph, show 0..1) places the pointer; g.segs[i] are the 15 blocks
   ngSeating(parent)           the seating plan board (reactivity series), 560 x 640, centred. g.rows[i] (0 = potassium ... 10 = gold),
                               g.hline (the hydrogen line row, between iron and copper), g.title. Rows start fully shown.
   ngJar(parent, s)            jar of oil with a "NO WATER" label, 210 x 250; put Potassium in g.inner (centre about (0, 20))
   ngGiant(parent)             Kavya seen from inside the beaker: one huge goggled eye through the glass. g.set({ look, blink, t })
   ngLogo(parent)              "NEUTRAL GROUND" show logo, two linked rings (red acid, purple alkali) and a green heart; centred
   ngRibbon(parent, s)         a curl of magnesium ribbon (silver), about 160 long
   ngNail(parent, s)           an iron nail, point down, about 260 long; g.set(copper 0..1) grows a brown copper coat
*/

/* ---------- colour helpers ---------- */
const NG_PH = [[0, '#D61F3C'], [2, '#EE3B2B'], [3.5, '#FF8A1F'], [5.5, '#FFD43B'], [7, '#3CC05A'], [8.5, '#2FA6C9'], [10.5, '#2E6FDB'], [12.5, '#6A3FC8'], [14, '#5A2A9E']];
function ngHex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
function ngMix(a, b, p) {
  const A = ngHex(a), B = ngHex(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(p)).toString(16).padStart(2, '0')).join('');
}
function ngPH(ph) {
  ph = clamp(ph, 0, 14);
  for (let i = 1; i < NG_PH.length; i++) if (ph <= NG_PH[i][0]) {
    const [a, ca] = NG_PH[i - 1], [b, cb] = NG_PH[i];
    return ngMix(ca, cb, (ph - a) / (b - a));
  }
  return NG_PH[NG_PH.length - 1][1];
}

/* text with real sub/superscripts: "H_2O", "OH^-", "SO_{4}" */
function ngFormula(parent, x, y, str, o) {
  o = o || {};
  const size = o.size || 40;
  const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 800, fill: o.fill || C.ink, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
  let i = 0, base = '';
  const flush = () => { if (base) { E('tspan', {}, t).textContent = base; base = ''; } };
  while (i < str.length) {
    const ch = str[i];
    if (ch === '_' || ch === '^') {
      flush();
      let run;
      if (str[i + 1] === '{') { const j = str.indexOf('}', i); run = str.slice(i + 2, j); i = j + 1; } else { run = str[i + 1]; i += 2; }
      if (run === '-') run = '−';
      const sub = ch === '_', dy = sub ? size * 0.22 : -size * 0.38;
      E('tspan', { dy: dy.toFixed(1), 'font-size': (size * 0.62).toFixed(1) }, t).textContent = run;
      E('tspan', { dy: (-dy).toFixed(1), 'font-size': size }, t).textContent = ' ';   // back to the baseline
    } else { base += ch; i++; }
  }
  flush();
  return t;
}

/* word equation that builds term by term */
function ngEq(parent, terms, o) {
  o = o || {};
  const g = G(parent), size = o.size || 46, gap = o.gap || size * 0.4, cols = o.colors || {};
  const rows = [[]];
  terms.forEach(tm => (tm === '\n' ? rows.push([]) : rows[rows.length - 1].push(tm)));
  g.terms = [];
  const lh = size * 1.45, y0 = -(rows.length - 1) * lh / 2 + size * 0.35;
  let maxW = 0;
  rows.forEach((row, r) => {
    const ws = row.map(tm => textWidth(tm, size, FD, 800));
    const tot = ws.reduce((a, b) => a + b, 0) + gap * (row.length - 1);
    maxW = Math.max(maxW, tot);
    let x = -tot / 2;
    row.forEach((tm, k) => {
      const op_ = tm === '+' || tm === '→';
      const el = T(g, x + ws[k] / 2, y0 + r * lh, tm, { size, weight: 800, anchor: 'middle', fill: cols[tm] || (op_ ? C.energy : C.ink) });
      g.terms.push(el);
      x += ws[k] + gap;
    });
  });
  g.w = maxW; g.h = rows.length * lh;
  g.set = p => { const n = g.terms.length; g.terms.forEach((el, i) => { const q = clamp(p * n - i); op(el, q); }); };
  g.set(1);
  return g;
}

/* ion balls */
function ngIon(parent, kind, r) {
  r = r || 30;
  const g = G(parent);
  const lab = (x, txt, col, sz) => ngFormula(g, x, (sz || r * 0.62) * 0.36, txt, { size: sz || r * 0.62, fill: col || SC_INK });
  if (kind === 'OH-') {
    E('circle', { cx: r * 0.95, cy: -r * 0.55, r: r * 0.6, fill: ball(C.hydrogen, C.hydrogenDk), stroke: C.hydrogenDk, 'stroke-width': 2.5 }, g);
    E('circle', { r, fill: ball(C.oxygen, C.oxygenDk), stroke: C.oxygenDk, 'stroke-width': 3 }, g);
    lab(0, 'OH^-', '#FFFFFF');
  } else {
    const col = { 'H+': [C.hydrogen, C.hydrogenDk, SC_INK], 'Cl-': ['#9BE36A', '#3E8F2A', SC_INK], 'Na+': ['#C7B3FF', '#7357C8', SC_INK] }[kind] || [C.hydrogen, C.hydrogenDk, SC_INK];
    E('circle', { r, fill: ball(col[0], col[1]), stroke: col[1], 'stroke-width': 3 }, g);
    lab(0, kind.replace('+', '^+').replace('-', '^-'), col[2]);
  }
  return g;
}

/* ---------- characters ---------- */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') {
    const k = scKavya(parent, { s: o.s, mood: o.mood });
    const gg = o.goggles === undefined ? 'on' : o.goggles;
    if (gg) {
      const inner = k.firstChild, gog = G(inner);
      if (gg === 'up') tr(gog, 0, -74, 0.92);
      E('path', { d: 'M-76,-40 L-56,-36 M56,-36 L76,-40', stroke: '#2B3A44', 'stroke-width': 9, 'stroke-linecap': 'round' }, gog);   // strap
      E('rect', { x: -60, y: -60, width: 120, height: 52, rx: 22, fill: '#BFEFFF', opacity: 0.32 }, gog);
      E('rect', { x: -60, y: -60, width: 120, height: 52, rx: 22, fill: 'none', stroke: '#2B7A9E', 'stroke-width': 6 }, gog);
      E('path', { d: 'M-8,-8 Q0,-18 8,-8', fill: 'none', stroke: '#2B7A9E', 'stroke-width': 5 }, gog);
      E('path', { d: 'M-46,-48 L-30,-48', stroke: '#FFFFFF', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, gog);
    }
    return k;
  }
  const P = {};   // per-kind parts the update needs
  const spec = { s: o.s, mood: o.mood, seed: 3, bob: 4 };
  const LIDMARK = '#A1B2C3';
  if (kind === 'indi') {
    spec.seed = 12; spec.bob = 4;
    spec.draw = g => {
      P.body = E('path', { d: 'M0,-128 C34,-84 94,-42 94,22 A94,94 0 0 1 -94,22 C-94,-42 -34,-84 0,-128 Z', fill: ngPH(1), stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M62,-24 C90,6 98,62 58,100 C80,52 78,12 62,-24 Z', fill: '#000000', opacity: 0.16 }, g);   // shade
      E('ellipse', { cx: -46, cy: -34, rx: 13, ry: 30, fill: '#FFFFFF', opacity: 0.45, transform: 'rotate(28 -46 -34)' }, g);   // shine
      // headset: band, earpiece, mic boom
      E('path', { d: 'M-90,-8 C-82,-52 -42,-90 -14,-112', fill: 'none', stroke: '#26323C', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
      E('path', { d: 'M-92,8 C-96,46 -70,70 -40,66', fill: 'none', stroke: '#26323C', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
      E('rect', { x: -106, y: -16, width: 26, height: 36, rx: 10, fill: '#26323C', stroke: SC_INK, 'stroke-width': 3 }, g);
      E('circle', { cx: -38, cy: 66, r: 7, fill: '#26323C' }, g);
      const cb = scClipboard(g, 0.5); tr(cb, 104, 62, 0.5, 12);
    };
    spec.face = { x: 0, y: 0, eye: 21, gap: 62, mouthW: 46, mouthY: 42, lidCol: LIDMARK };
    spec.upd = (t, g, st) => {
      const col = ngPH(st.ph !== undefined ? st.ph : (o.ph !== undefined ? o.ph : 1));
      if (!P.lids) P.lids = Array.from(g.querySelectorAll(`path[fill="${LIDMARK}"]`));
      if (P.col !== col) { P.col = col; attr(P.body, 'fill', col); P.lids.forEach(l => attr(l, 'fill', ngMix(col, '#000000', 0.22))); }
    };
  } else if (kind === 'hal') {
    spec.seed = 5; spec.bob = 6;
    spec.draw = g => {
      const pts = [];
      for (let i = 0; i < 28; i++) { const a = i / 28 * TAU - Math.PI / 2, R = i % 2 ? 80 : 104; pts.push(`${(Math.cos(a) * R).toFixed(1)},${(Math.sin(a) * R * 0.97).toFixed(1)}`); }
      E('path', { d: 'M' + pts.join(' L') + ' Z', fill: ball('#FF6F5E', '#B32630'), stroke: '#7E1820', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-26,58 L0,84 L26,58 L22,90 L-22,90 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // shirt front
      E('path', { d: 'M0,70 L-30,56 L-30,84 Z M0,70 L30,56 L30,84 Z', fill: '#1A1A22', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // bow tie
      E('circle', { cx: 0, cy: 70, r: 7, fill: '#2C2C36', stroke: SC_INK, 'stroke-width': 2 }, g);
      const fl = G(g); tr(fl, 58, 34);   // buttonhole flower
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; E('circle', { cx: Math.cos(a) * 8, cy: Math.sin(a) * 8, r: 7, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, fl); }
      E('circle', { r: 5, fill: '#FFD43B' }, fl);
      P.fizz = ngFizzMake(g, 120, 110, 7);
    };
    spec.face = { x: 0, y: -10, eye: 19, gap: 56, mouthW: 50, mouthY: 34, lidCol: '#E2463C' };
    spec.sweat = [[-96, -30], [96, -20]];
  } else if (kind === 'natalie') {
    spec.seed = 9; spec.bob = 5;
    spec.draw = g => {
      E('path', { d: 'M-34,-84 C-110,-40 -128,60 -112,130 L-70,118 C-86,50 -72,-20 -22,-72 Z', fill: '#FBF8FF', opacity: 0.88, stroke: '#CFC6EA', 'stroke-width': 3 }, g);   // veil
      E('path', { d: 'M34,-84 C110,-40 128,60 112,130 L70,118 C86,50 72,-20 22,-72 Z', fill: '#FBF8FF', opacity: 0.88, stroke: '#CFC6EA', 'stroke-width': 3 }, g);
      E('circle', { r: 90, fill: ball('#C3A2FF', '#5B34B0'), stroke: '#4A2896', 'stroke-width': 5 }, g);
      E('path', { d: 'M-66,-28 A70,70 0 0 1 -18,-72', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.6 }, g);   // bubble shine
      E('path', { d: 'M58,40 A72,72 0 0 1 30,66', fill: 'none', stroke: '#9FF3FF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.55 }, g);
      E('path', { d: 'M-34,-80 L-22,-104 L-10,-86 L0,-112 L10,-86 L22,-104 L34,-80 Z', fill: '#E8EEF5', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // tiara
      E('circle', { cx: 0, cy: -96, r: 6, fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 2 }, g);
      P.bub = [0, 1, 2].map(i => E('circle', { r: 9 - i * 2, fill: 'rgba(255,255,255,0.15)', stroke: '#FFFFFF', 'stroke-width': 2.5, opacity: 0.85 }, g));
    };
    spec.face = { x: 0, y: 2, eye: 19, gap: 56, mouthW: 40, mouthY: 36, lidCol: '#9A72F2' };
    spec.upd = (t, g) => P.bub.forEach((b, i) => { const a = t * (0.7 + i * 0.2) + i * 2.1; tr(b, Math.cos(a) * (112 + i * 8), -10 + Math.sin(a * 1.3) * 70); });
  } else if (kind === 'henry') {
    spec.seed = 14; spec.bob = 3;
    spec.draw = g => {
      E('path', { d: 'M-6,-56 C-14,-82 12,-92 14,-74 C16,-62 0,-62 4,-72', fill: 'none', stroke: '#A9B5C0', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);   // cowlick
      [-1, 1].forEach(sd => E('circle', { cx: sd * 40, r: 62, fill: ball(C.hydrogen, C.hydrogenDk), stroke: '#8E9BA8', 'stroke-width': 5 }, g));
      E('path', { d: 'M-12,-48 Q0,-40 12,-48', fill: 'none', stroke: '#8E9BA8', 'stroke-width': 4 }, g);   // where the atoms meet
      E('path', { d: 'M0,58 L-20,48 L-20,68 Z M0,58 L20,48 L20,68 Z', fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // tiny bow tie
      E('circle', { cx: 0, cy: 58, r: 5, fill: '#3F5BD9', stroke: SC_INK, 'stroke-width': 2 }, g);
      T(g, -74, 46, 'H', { size: 26, weight: 800, anchor: 'middle', fill: '#8E9BA8' });
      T(g, 74, 46, 'H', { size: 26, weight: 800, anchor: 'middle', fill: '#8E9BA8' });
      P.fizz = ngFizzMake(g, 110, 80, 5);
    };
    spec.face = { x: 0, y: -6, eye: 17, gap: 50, mouthW: 32, mouthY: 30, lidCol: '#DCE3EA' };
    spec.sweat = [[-92, -30], [96, -22]];
  } else if (kind === 'maggie') {
    spec.seed = 17; spec.bob = 7;
    spec.draw = g => {
      E('path', { d: 'M-18,-90 C-30,-130 22,-140 18,-108 C14,-84 -24,-98 -6,-124 C10,-146 52,-130 40,-96', fill: 'none', stroke: '#C9D2DB', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);   // ribbon curl
      E('path', { d: 'M-18,-90 C-30,-130 22,-140 18,-108 C14,-84 -24,-98 -6,-124 C10,-146 52,-130 40,-96', fill: 'none', stroke: '#7E8A97', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
      E('rect', { x: -84, y: -92, width: 168, height: 184, rx: 34, fill: ball('#F4F7FA', '#8D9AA8'), stroke: '#5F6B78', 'stroke-width': 6 }, g);
      E('path', { d: 'M-60,-80 L-80,-50 M-36,-86 L-78,-22', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.55 }, g);   // metal shine
      E('path', { d: 'M-84,-70 Q0,-84 84,-70 L84,-50 Q0,-64 -84,-50 Z', fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // sweatband
      T(g, -50, 80, 'Mg', { size: 28, weight: 800, anchor: 'middle', fill: '#5F6B78' });
      P.sp = spark(g, 13); tr(P.sp, 86, -96);
      P.fizz = ngFizzMake(g, 120, 110, 9);
    };
    spec.face = { x: 0, y: -4, eye: 20, gap: 60, mouthW: 52, mouthY: 36, lidCol: '#C9D2DB' };
    spec.sweat = [[-100, -30], [100, -20]];
    spec.upd = t => P.sp.upd(t);
  } else if (kind === 'goldie') {
    spec.seed = 20; spec.bob = 2; spec.mood = o.mood || 'smug';
    spec.draw = g => {
      P.fan = G(g); tr(P.fan, 112, 40);
      let d = '';
      for (let i = 0; i < 7; i++) { const a0 = -150 + i * 17, a1 = a0 + 17, r = 74; d += `M0,0 L${(Math.cos(a0 * Math.PI / 180) * r).toFixed(1)},${(Math.sin(a0 * Math.PI / 180) * r).toFixed(1)} A${r},${r} 0 0 1 ${(Math.cos(a1 * Math.PI / 180) * r).toFixed(1)},${(Math.sin(a1 * Math.PI / 180) * r).toFixed(1)} Z `; }
      E('path', { d, fill: '#FF8FC0', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, P.fan);
      E('rect', { x: -5, y: -4, width: 10, height: 46, rx: 4, fill: '#8A5A2B', stroke: SC_INK, 'stroke-width': 2 }, P.fan);
      E('path', { d: 'M-74,-72 L74,-72 L106,86 L-106,86 Z', fill: ball('#FFE27A', '#B8860B'), stroke: '#7A5806', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
      E('path', { d: 'M-74,-72 L74,-72 L66,-54 L-66,-54 Z', fill: '#FFF3C2', opacity: 0.8 }, g);   // top bevel
      E('path', { d: 'M74,-72 L106,86 L84,86 L60,-54 Z', fill: '#000000', opacity: 0.12 }, g);
      [-1, 1].forEach(sd => {   // sunglasses pushed up
        E('ellipse', { cx: sd * 32, cy: -76, rx: 28, ry: 16, fill: '#2A2230', stroke: SC_INK, 'stroke-width': 3 }, g);
        E('circle', { cx: sd * 98, cy: 18, r: 8, fill: '#FFFFFF', stroke: '#B9B0C8', 'stroke-width': 2 }, g);   // earrings
      });
      E('path', { d: 'M-4,-76 L4,-76', stroke: SC_INK, 'stroke-width': 4 }, g);
      for (let i = 0; i < 9; i++) { const x = -48 + i * 12, y = 50 + 10 * (1 - Math.pow((x / 48), 2)); E('circle', { cx: x, cy: y, r: 6, fill: '#FFFFFF', stroke: '#B9B0C8', 'stroke-width': 1.5 }, g); }   // pearls
      T(g, -66, 78, 'Au', { size: 26, weight: 800, anchor: 'middle', fill: '#7A5806' });
    };
    spec.face = { x: 0, y: -16, eye: 19, gap: 60, mouthW: 44, mouthY: 32, lidCol: '#E9B93A', iris: '#3A2A08' };
    spec.upd = t => tr(P.fan, 112, 40, 1, -10 + 12 * Math.sin(t * 2.2));
  } else if (kind === 'potassium') {
    spec.seed = 22; spec.bob = 1; spec.mood = o.mood || 'deadpan';
    spec.draw = g => {
      E('rect', { x: -64, y: -60, width: 128, height: 120, rx: 22, fill: ball('#E0E4E8', '#7E8892'), stroke: '#55606A', 'stroke-width': 5 }, g);
      E('path', { d: 'M-46,-48 L-56,-26', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.6 }, g);
      T(g, 48, -32, 'K', { size: 28, weight: 800, anchor: 'middle', fill: '#55606A' });
    };
    spec.face = { x: 0, y: -8, eye: 16, gap: 46, mouthW: 30, mouthY: 28, lidCol: '#B8C0C8' };
  }
  const prevUpd = spec.upd;
  spec.upd = (t, g, st) => {
    if (prevUpd) prevUpd(t, g, st);
    if (P.fizz) P.fizz.set(st.fizz || 0, t);
  };
  return scMake(parent, spec);
}

/* hydrogen bubbles streaming up around a character (used by cast) */
function ngFizzMake(parent, w, h, n) {
  const g = G(parent), r = rng(n * 13 + w), bs = [];
  for (let i = 0; i < n; i++) bs.push({ c: E('circle', { r: 5 + r() * 7, fill: 'rgba(255,255,255,0.25)', stroke: '#FFFFFF', 'stroke-width': 2.5 }, g), x: (r() * 2 - 1) * w, ph: r(), v: 0.7 + r() * 0.6 });
  g.set = (v, t) => bs.forEach(({ c, x, ph, v: sp }) => {
    if (v <= 0.01) { op(c, 0); return; }
    const f = ((t || 0) * sp + ph) % 1;
    op(c, v * Math.min(1, (1 - f) * 2.5)); tr(c, x + 6 * Math.sin(f * 9 + ph * 7), h - f * (h * 2.2));
  });
  g.set(0, 0);
  return g;
}

/* ---------- sets ---------- */
const NG_TINT = { indi: ['#1B2A3A', '#33506E'], hal: ['#3A1014', '#6E1F27'], natalie: ['#261A40', '#4A3170'], henry: ['#1F2A33', '#3E5566'],
  maggie: ['#22303A', '#4B6475'], goldie: ['#3A2A08', '#6E5214'], potassium: ['#262626', '#474747'], kavya: ['#14243A', '#25446B'] };
function ngConf(parent, kind) { const [a, b] = NG_TINT[kind] || NG_TINT.indi; return scConfessional(parent, a, b); }

function ngLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#CFE0D4' }, g);
  let tiles = '';
  for (let x = 0; x <= 1200; x += 60) tiles += `M${x},0 L${x},540 `;
  for (let y = 0; y <= 540; y += 60) tiles += `M0,${y} L1200,${y} `;
  E('path', { d: tiles, stroke: '#B5CBBD', 'stroke-width': 2 }, g);
  // window with HDB blocks
  const win_ = G(g); g.window = win_; tr(win_, 760, 120);
  E('rect', { x: 0, y: 0, width: 380, height: 260, fill: linGrad('#7CCBFF', '#D6F0FF', true) }, win_);
  [[20, 70, 90, 190, '#F2E3C6'], [130, 40, 100, 220, '#E8D2E6'], [250, 90, 110, 170, '#D7E6F2']].forEach(([x, y, w, h, c]) => {
    E('rect', { x, y, width: w, height: h, fill: c, stroke: '#A39A8A', 'stroke-width': 2 }, win_);
    let wd = '';
    for (let yy = y + 14; yy < y + h - 10; yy += 22) for (let xx = x + 10; xx < x + w - 12; xx += 20) wd += `M${xx},${yy} h10 v10 h-10 Z `;
    E('path', { d: wd, fill: '#7FA6C2' }, win_);
  });
  E('path', { d: 'M330,260 Q338,190 360,160 M360,160 q-40,-6 -60,14 M360,160 q30,-20 20,-44 M360,160 q-10,-34 -40,-40 M360,160 q40,0 40,30', fill: 'none', stroke: '#2E8B57', 'stroke-width': 8, 'stroke-linecap': 'round' }, win_);
  E('rect', { x: 0, y: 0, width: 380, height: 260, fill: 'none', stroke: '#F4F7F5', 'stroke-width': 14 }, win_);
  E('path', { d: 'M190,0 L190,260 M0,130 L380,130', stroke: '#F4F7F5', 'stroke-width': 8 }, win_);
  // periodic table poster (left, below the chapter tag area)
  const pt = G(g); tr(pt, 70, 150);
  E('rect', { x: 0, y: 0, width: 300, height: 190, rx: 6, fill: '#FFFFFF', stroke: '#9AA8B4', 'stroke-width': 3 }, pt);
  const cols = ['#FF9AA2', '#FFD08A', '#B5EAD7', '#A0C4FF', '#D7B5FF'];
  let k = 0;
  for (let r = 0; r < 6; r++) for (let c = 0; c < 18; c++) {
    if (r === 0 && c > 0 && c < 17) continue;
    if ((r === 1 || r === 2) && c > 1 && c < 12) continue;
    E('rect', { x: 12 + c * 15.5, y: 50 + r * 21, width: 13, height: 18, fill: cols[(c + r + (k++ % 2)) % 5] }, pt);
  }
  T(pt, 150, 36, 'PERIODIC TABLE', { size: 26, weight: 800, anchor: 'middle', fill: '#3A4A57' });
  // safety sign
  const sign = G(g); tr(sign, 620, 250);
  E('rect', { x: -120, y: -54, width: 240, height: 108, rx: 12, fill: '#FFD43B', stroke: '#2A2A2A', 'stroke-width': 5 }, sign);
  T(sign, 0, -8, 'GOGGLES', { size: 36, weight: 800, anchor: 'middle', fill: '#2A2A2A' });
  T(sign, 0, 34, 'ON!', { size: 36, weight: 800, anchor: 'middle', fill: '#2A2A2A' });
  // ceiling fan
  const fan = G(g); tr(fan, 950, 40);
  E('rect', { x: -4, y: -40, width: 8, height: 30, fill: '#7A8791' }, fan);
  const blades = G(fan);
  E('ellipse', { rx: 150, ry: 9, fill: '#E9EEF1', stroke: '#7A8791', 'stroke-width': 3 }, blades);
  E('circle', { r: 16, fill: '#9AA8B4', stroke: '#5E6B75', 'stroke-width': 3 }, fan);
  // bench
  E('rect', { x: 0, y: 540, width: 1200, height: 24, fill: '#2E3B45' }, g);
  E('rect', { x: 0, y: 564, width: 1200, height: 186, fill: '#5C6E7B' }, g);
  E('path', { d: 'M0,640 L1200,640 M300,564 L300,750 M900,564 L900,750', stroke: '#4B5B67', 'stroke-width': 4 }, g);
  g.bench = G(g);
  g.upd = t => { const a = t * 2.4; attr(blades.firstChild, 'rx', (150 * Math.abs(Math.cos(a))).toFixed(1)); attr(blades.firstChild, 'ry', (9 + 5 * Math.abs(Math.sin(a))).toFixed(1)); };
  return g;
}

function ngBench(parent, y) {
  const g = G(parent); y = y === undefined ? 540 : y;
  E('rect', { x: 0, y, width: 1200, height: 24, fill: '#2E3B45' }, g);
  E('rect', { x: 0, y: y + 24, width: 1200, height: 750 - y, fill: '#5C6E7B' }, g);
  E('path', { d: `M0,${y + 100} L1200,${y + 100} M300,${y + 24} L300,750 M900,${y + 24} L900,750`, stroke: '#4B5B67', 'stroke-width': 4 }, g);
  E('rect', { x: 0, y: y + 22, width: 1200, height: 5, fill: '#1E2830', opacity: 0.6 }, g);
  return g;
}

function ngVenue(parent) {
  const g = G(parent);
  const base = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#552222' }, g);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#FFFFFF', '#000000', true), opacity: 0.22 }, g);
  E('ellipse', { cx: 600, cy: 300, rx: 520, ry: 330, fill: glow('#FFFFFF'), opacity: 0.18 }, g);
  // the surface (meniscus) with light from above
  E('path', { d: 'M0,40 Q600,92 1200,40 L1200,0 L0,0 Z', fill: '#0D1620', opacity: 0.55 }, g);
  E('path', { d: 'M0,40 Q600,92 1200,40', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.55 }, g);
  E('path', { d: 'M420,66 L300,560 L520,560 L520,72 Z M700,72 L700,560 L930,560 L800,66 Z', fill: '#FFFFFF', opacity: 0.05 }, g);
  // bunting
  const bd = 'M80,120 Q600,190 1120,120';
  E('path', { d: bd, fill: 'none', stroke: '#F4F7FA', 'stroke-width': 3, opacity: 0.8 }, g);
  const fl = ['#FF6FB5', '#FFFFFF', '#FFD43B', '#9FD8FF'];
  for (let i = 0; i < 16; i++) {
    const p = (i + 0.5) / 16, x = 80 + 1040 * p;
    const yy = (1 - p) * (1 - p) * 120 + 2 * p * (1 - p) * 190 + p * p * 120;
    E('path', { d: `M${(x - 18).toFixed(1)},${yy.toFixed(1)} L${(x + 18).toFixed(1)},${yy.toFixed(1)} L${x.toFixed(1)},${(yy + 34).toFixed(1)} Z`, fill: fl[i % 4], opacity: 0.85 }, g);
  }
  // aisle carpet
  g.aisle = E('path', { d: 'M520,430 L680,430 L820,750 L380,750 Z', fill: '#E8E2D6', stroke: '#C9BFA6', 'stroke-width': 3 }, g);
  E('path', { d: 'M560,430 L640,430 L700,750 L500,750 Z', fill: '#E85C7A', opacity: 0.85 }, g);
  // flower arch
  const arch = G(g); g.arch = arch; tr(arch, 600, 330);
  E('path', { d: 'M-170,110 L-170,-40 A170,170 0 0 1 170,-40 L170,110', fill: 'none', stroke: '#F4EFE6', 'stroke-width': 18 }, arch);
  const ar = rng(31);
  for (let i = 0; i <= 22; i++) {
    const a = Math.PI - i / 22 * Math.PI, x = Math.cos(a) * 170, y = -40 - Math.sin(a) * 170;
    E('circle', { cx: x + (ar() - 0.5) * 10, cy: y + (ar() - 0.5) * 10, r: 13 + ar() * 6, fill: ['#FF8FC0', '#FFFFFF', '#FFD0E2'][i % 3], stroke: '#C9577F', 'stroke-width': 2 }, arch);
  }
  [-1, 1].forEach(sd => { for (let k = 0; k < 4; k++) E('circle', { cx: sd * 170 + (ar() - 0.5) * 12, cy: 90 - k * 36, r: 12, fill: '#7CC97A', stroke: '#3E8F3E', 'stroke-width': 2 }, arch); });
  // chairs
  const chairs = G(g); g.chairs = chairs;
  [[180, 560], [290, 560], [140, 650], [260, 650], [910, 560], [1020, 560], [940, 650], [1060, 650]].forEach(([x, y]) => {
    E('rect', { x: x - 34, y: y - 60, width: 68, height: 64, rx: 10, fill: '#F7F2EA', stroke: '#BFB4A2', 'stroke-width': 3 }, chairs);
    E('rect', { x: x - 40, y: y, width: 80, height: 16, rx: 6, fill: '#EDE5D8', stroke: '#BFB4A2', 'stroke-width': 3 }, chairs);
    E('path', { d: `M${x - 20},${y - 40} q20,-14 40,0`, fill: 'none', stroke: '#FF8FC0', 'stroke-width': 5 }, chairs);
  });
  // glass walls
  E('path', { d: 'M0,40 Q70,400 40,750 L0,750 Z', fill: '#DDF3FF', opacity: 0.16 }, g);
  E('path', { d: 'M1200,40 Q1130,400 1160,750 L1200,750 Z', fill: '#DDF3FF', opacity: 0.16 }, g);
  E('path', { d: 'M30,90 Q84,400 58,720 M1170,90 Q1116,400 1142,720', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.35, 'stroke-linecap': 'round' }, g);
  // drifting water particles and rising bubbles
  const r = rng(91), parts = [], bubs = [];
  for (let i = 0; i < 14; i++) parts.push({ m: molH2O(g, 9), x: r() * 1200, y: 120 + r() * 560, v: 8 + r() * 14, a: r() * 6 });
  parts.forEach(p => op(p.m, 0.35));
  for (let i = 0; i < 10; i++) bubs.push({ c: E('circle', { r: 4 + r() * 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2, opacity: 0.45 }, g), x: 60 + r() * 1080, ph: r(), v: 0.08 + r() * 0.08 });
  g.set = (ph, t) => {
    attr(base, 'fill', ngMix(ngPH(ph), '#141C28', 0.5));
    t = t || 0;
    parts.forEach(p => tr(p.m, ((p.x + t * p.v) % 1240) - 20, p.y + 14 * Math.sin(t * 0.5 + p.a), 1, t * 12 + p.a * 40));
    bubs.forEach(b => { const f = (t * b.v + b.ph) % 1; tr(b.c, b.x + 8 * Math.sin(f * 12), 740 - f * 690); });
  };
  g.set(1, 0);
  return g;
}

/* ---------- props ---------- */
function ngDropper(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const bulb = G(inner); tr(bulb, 0, -250);
  const bulbShape = E('path', { d: 'M-26,40 L-26,-10 Q-30,-56 0,-58 Q30,-56 26,-10 L26,40 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, bulb);
  E('path', { d: 'M-14,-34 Q-16,-8 -14,20', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.5, 'stroke-linecap': 'round' }, bulb);
  const liq = E('path', { d: 'M-12,-160 L12,-160 L12,-40 L3,-6 L-3,-6 L-12,-40 Z', fill: ngPH(13), opacity: 0.85 }, inner);
  E('path', { d: 'M-16,-212 L16,-212 L16,-40 L4,0 L-4,0 L-16,-40 Z', fill: 'rgba(220,240,255,0.18)', stroke: '#CFE7F5', 'stroke-width': 4, 'stroke-linejoin': 'round' }, inner);
  E('rect', { x: 6, y: -200, width: 4, height: 150, rx: 2, fill: '#FFFFFF', opacity: 0.4 }, inner);
  g.drop = E('path', { d: 'M0,-2 Q11,14 0,22 Q-11,14 0,-2 Z', fill: ngPH(13), stroke: '#FFFFFF', 'stroke-width': 2 }, inner);
  g.set = (sq, col) => { bulbShape.setAttribute('transform', `scale(${(1 - 0.28 * clamp(sq)).toFixed(3)} 1)`); if (col) { attr(liq, 'fill', col); attr(g.drop, 'fill', col); } };
  g.set(0);
  return g;
}

function ngSplint(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('rect', { x: 0, y: -7, width: 220, height: 14, rx: 4, fill: '#D9A86C', stroke: '#8A5A2B', 'stroke-width': 3 }, inner);
  const tip = E('rect', { x: 196, y: -7, width: 24, height: 14, rx: 4, fill: '#2A1A12' }, inner);
  const ember = E('circle', { cx: 220, cy: 0, r: 26, fill: glow('#FF7A1A') }, inner);
  const emberDot = E('circle', { cx: 218, cy: 0, r: 7, fill: '#FF8A2A' }, inner);
  const flame = G(inner); tr(flame, 226, 0);
  E('path', { d: 'M0,10 Q-22,-10 6,-58 Q16,-30 30,-26 Q34,8 0,10 Z', fill: '#FFB020', stroke: '#E8642A', 'stroke-width': 3 }, flame);
  E('path', { d: 'M4,6 Q-6,-8 8,-30 Q14,-12 20,-10 Q20,6 4,6 Z', fill: '#FFF2A0' }, flame);
  const smoke = E('path', { d: '', fill: 'none', stroke: '#C9CED4', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.6 }, inner);
  g.set = (state, t) => {
    t = t || 0;
    op(flame, state === 'lit' ? 1 : 0); op(ember, state === 'glow' ? 0.8 + 0.2 * Math.sin(t * 6) : 0); op(emberDot, state === 'glow' ? 1 : 0);
    op(tip, state === 'off' ? 0 : 1);
    if (state === 'lit') tr(flame, 226, 0, 1 + 0.08 * Math.sin(t * 13), 4 * Math.sin(t * 9));
    if (state === 'glow' || state === 'out') {
      let d = 'M220,-6';
      for (let i = 1; i <= 6; i++) d += ` L${(220 + 10 * Math.sin(i * 1.4 + t * 3)).toFixed(1)},${-6 - i * 14}`;
      attr(smoke, 'd', d); op(smoke, 0.55);
    } else op(smoke, 0);
  };
  g.set('off', 0);
  return g;
}

function ngPop(parent, text) {
  const g = G(parent), inner = G(g);
  let d = '';
  for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, R = i % 2 ? 84 : 132; d += (i ? 'L' : 'M') + (Math.cos(a) * R * 1.15).toFixed(1) + ',' + (Math.sin(a) * R * 0.8).toFixed(1); }
  E('path', { d: d + 'Z', fill: '#FFE45C', stroke: '#E8424F', 'stroke-width': 7, 'stroke-linejoin': 'round' }, inner);
  const tx = T(inner, 0, 22, text || 'POP!', { size: 64, weight: 800, anchor: 'middle', fill: '#E8424F' });
  tx.setAttribute('stroke', '#FFFFFF'); tx.setAttribute('stroke-width', 6); tx.setAttribute('paint-order', 'stroke');
  g.set = p => { op(g, clamp(p * 4)); tr(inner, 0, 0, Math.max(0.01, pop(clamp(p * 1.6)) * (1 + 0.04 * Math.sin(p * 30))), -6 + 6 * p); };
  g.set(0);
  return g;
}

function ngPhScale(parent, w) {
  w = w || 980;
  const g = G(parent), sw = w / 15;
  g.segs = [];
  for (let i = 0; i <= 14; i++) {
    const x = -w / 2 + i * sw;
    g.segs.push(E('rect', { x: x + 2, y: -30, width: sw - 4, height: 60, rx: 8, fill: ngPH(i), stroke: SC_INK, 'stroke-width': 3 }, g));
    if (sw >= 52 || i === 0 || i === 7 || i === 14) T(g, x + sw / 2, 72, String(i), { size: sw >= 52 ? Math.min(30, sw * 0.5) : 28, weight: 800, anchor: 'middle', fill: C.ink });
  }
  T(g, -w / 2 + sw * 3.5, -48, 'ACIDIC', { size: 30, weight: 800, anchor: 'middle', fill: '#FF8A7A' });
  T(g, 0, -48, 'NEUTRAL', { size: 30, weight: 800, anchor: 'middle', fill: '#7CE38F' });
  T(g, w / 2 - sw * 3.5, -48, 'ALKALINE', { size: 30, weight: 800, anchor: 'middle', fill: '#B9A0FF' });
  g.x = ph => -w / 2 + (ph + 0.5) * sw;
  const ptr = G(g);
  E('path', { d: 'M0,-34 L-18,-62 L18,-62 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, ptr);
  E('rect', { x: -4, y: -34, width: 8, height: 68, rx: 3, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, ptr);
  g.pointer = ptr;
  g.set = (ph, show) => { op(ptr, show === undefined ? 1 : show); tr(ptr, g.x(ph), 0); };
  g.set(7, 0);
  return g;
}

function ngSeating(parent) {
  const g = G(parent);
  E('rect', { x: -280, y: -320, width: 560, height: 640, rx: 18, fill: '#FBF6EC', stroke: '#C9A24A', 'stroke-width': 6 }, g);
  E('rect', { x: -264, y: -304, width: 528, height: 608, rx: 12, fill: 'none', stroke: '#E6D3A0', 'stroke-width': 2 }, g);
  g.title = T(g, 0, -262, 'SEATING PLAN', { size: 40, weight: 800, anchor: 'middle', fill: '#7A5806' });
  const names = ['Potassium', 'Sodium', 'Calcium', 'Magnesium', 'Aluminium', 'Zinc', 'Iron', 'Copper', 'Silver', 'Gold'];
  const syms = ['K', 'Na', 'Ca', 'Mg', 'Al', 'Zn', 'Fe', 'Cu', 'Ag', 'Au'];
  g.rows = [];
  let y = -210;
  names.forEach((nm, i) => {
    if (i === 7) {
      const hl = G(g); g.hline = hl; tr(hl, 0, y);
      E('path', { d: 'M-240,0 L240,0', stroke: '#E8424F', 'stroke-width': 5, 'stroke-dasharray': '14 8' }, hl);
      const c = chip(hl, 'HYDROGEN', { size: 26, fill: '#FFFFFF', stroke: '#E8424F', sw: 4, color: '#C2283A' });
      tr(c, 0, 0);
      y += 46;
    }
    const row = G(g); tr(row, 0, y);
    E('rect', { x: -240, y: -20, width: 480, height: 40, rx: 10, fill: i < 7 ? '#FFE9D9' : '#E9F1F7', opacity: 0.9 }, row);
    T(row, -220, 10, `**${nm[0]}**${nm.slice(1)}`, { size: 28, weight: 600, fill: SC_INK, boldFill: '#C2283A' });
    T(row, 220, 10, syms[i], { size: 28, weight: 800, anchor: 'end', fill: '#7A8791' });
    g.rows.push(row);
    y += 46;
  });
  T(g, 0, 300, '↑ most reactive at the top', { size: 26, weight: 600, anchor: 'middle', fill: '#7A5806', font: FB });
  return g;
}

function ngJar(parent, s) {
  const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
  E('path', { d: 'M-90,-96 L-90,104 Q-90,124 -70,124 L70,124 Q90,124 90,104 L90,-96 Z', fill: 'rgba(220,240,255,0.12)' }, k);
  E('path', { d: 'M-88,-50 L-88,104 Q-88,122 -70,122 L70,122 Q88,122 88,104 L88,-50 Z', fill: '#E8C25A', opacity: 0.45 }, k);   // oil
  E('path', { d: 'M-88,-50 L88,-50', stroke: '#FFE7A0', 'stroke-width': 4, opacity: 0.8 }, k);
  g.inner = G(k); tr(g.inner, 0, 14);
  E('path', { d: 'M-90,-96 L-90,104 Q-90,124 -70,124 L70,124 Q90,124 90,104 L90,-96', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 5, 'stroke-linejoin': 'round' }, k);
  E('rect', { x: 64, y: -80, width: 8, height: 170, rx: 4, fill: '#FFFFFF', opacity: 0.35 }, k);
  E('rect', { x: -100, y: -126, width: 200, height: 34, rx: 8, fill: '#5E6B75', stroke: SC_INK, 'stroke-width': 4 }, k);   // lid
  const lab = G(k); tr(lab, 0, 88, 1, -4);
  E('rect', { x: -86, y: -22, width: 172, height: 44, rx: 6, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 4 }, lab);
  T(lab, 0, 10, 'NO WATER', { size: 28, weight: 800, anchor: 'middle', fill: '#E8424F' });
  return g;
}

function ngGiant(parent) {
  const g = G(parent);
  E('circle', { r: 330, fill: ball('#C98A5E', '#8A5634') }, g);
  E('path', { d: 'M-300,-200 Q0,-330 300,-200', fill: 'none', stroke: '#1E1410', 'stroke-width': 40, 'stroke-linecap': 'round' }, g);   // eyebrow
  E('circle', { r: 220, fill: '#BFEFFF', opacity: 0.25 }, g);
  E('circle', { r: 220, fill: 'none', stroke: '#2B7A9E', 'stroke-width': 26 }, g);   // goggle lens rim
  E('ellipse', { rx: 150, ry: 112, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 8 }, g);
  const iris = G(g);
  E('circle', { r: 70, fill: '#5A3418' }, iris); E('circle', { r: 34, fill: '#120A06' }, iris); E('circle', { cx: 22, cy: -24, r: 14, fill: '#FFFFFF' }, iris);
  const lid = E('path', { d: '', fill: '#B9784E', stroke: SC_INK, 'stroke-width': 8 }, g);
  E('path', { d: 'M-150,-170 Q-40,-210 60,-180', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 14, opacity: 0.4, 'stroke-linecap': 'round' }, g);   // glass shine
  g.set = st => {
    st = st || {};
    tr(iris, (st.look || 0) * 60, (st.lookY || 0) * 40);
    const b = Math.max(st.blink || 0, scBlink(st.t || 0, 4)), yb = -112 + 224 * Math.min(b, 0.98), xw = 150 * Math.sqrt(Math.max(0, 1 - (yb / 112) * (yb / 112)));
    attr(lid, 'd', b < 0.02 ? '' : `M${(-xw).toFixed(1)},${yb.toFixed(1)} A150,112 0 ${yb > 0 ? 1 : 0} 1 ${xw.toFixed(1)},${yb.toFixed(1)} Z`);
  };
  g.set({});
  return g;
}

function ngLogo(parent) {
  const g = G(parent);
  const rings = G(g); tr(rings, 0, -110);
  E('circle', { cx: -34, r: 48, fill: 'none', stroke: ngPH(1), 'stroke-width': 14 }, rings);
  E('circle', { cx: 34, r: 48, fill: 'none', stroke: ngPH(13), 'stroke-width': 14 }, rings);
  E('path', { d: 'M0,10 C-16,-6 -16,-24 0,-18 C16,-24 16,-6 0,10 Z', fill: ngPH(7), stroke: '#FFFFFF', 'stroke-width': 2 }, rings);
  const t1 = T(g, 0, 10, 'NEUTRAL GROUND', { size: 88, weight: 800, anchor: 'middle', fill: '#7CE38F' });
  t1.setAttribute('stroke', '#123A22'); t1.setAttribute('stroke-width', 12); t1.setAttribute('paint-order', 'stroke'); t1.setAttribute('stroke-linejoin', 'round');
  T(g, 0, 60, 'WEDDINGS FOR ACIDS & ALKALIS', { size: 28, weight: 700, anchor: 'middle', fill: '#FFFFFF', ls: 3 });
  return g;
}

function ngRibbon(parent, s) {
  const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
  const d = 'M-80,10 C-60,-30 -30,30 -10,-6 C10,-40 30,30 50,-4 C64,-26 76,-6 80,-12';
  E('path', { d, fill: 'none', stroke: '#7E8A97', 'stroke-width': 14, 'stroke-linecap': 'round' }, k);
  E('path', { d, fill: 'none', stroke: '#E4EAF0', 'stroke-width': 8, 'stroke-linecap': 'round' }, k);
  return g;
}

function ngNail(parent, s) {
  const g = G(parent), k = G(g); tr(k, 0, 0, s || 1);
  E('rect', { x: -32, y: -130, width: 64, height: 16, rx: 5, fill: '#9AA6B2', stroke: '#4E5A66', 'stroke-width': 3 }, k);
  E('path', { d: 'M-10,-114 L10,-114 L10,96 L0,130 L-10,96 Z', fill: '#9AA6B2', stroke: '#4E5A66', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
  const cu = E('path', { d: 'M-12,-40 L12,-40 L12,96 L0,132 L-12,96 Z', fill: '#B5652D', stroke: '#7A3E14', 'stroke-width': 3, 'stroke-linejoin': 'round' }, k);
  E('rect', { x: 2, y: -108, width: 4, height: 190, rx: 2, fill: '#FFFFFF', opacity: 0.35 }, k);
  g.set = p => op(cu, clamp(p));
  g.set(0);
  return g;
}

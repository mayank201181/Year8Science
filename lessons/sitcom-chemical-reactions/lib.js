/* TEST TUBE KITCHEN (Claude Sitcom Ep 7, Chemical Reactions): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (scWho, scTalk, scMake, scKavya, scConfessional,
   scLowerThird, ...). Every top-level name here starts with `tk`, except `cast`.

   Characters: cast(parent, kind, o) -> g, origin at the character's centre, about 200 px tall at s = 1
     o: { s (scale), mood (default mood) }
     g.set({ t, talk, mood, look, sweat, still, ... })   call EVERY frame
       talk 0..1 (use scTalk(S, t, who)); mood: neutral | happy | smug | annoyed | sad | shock | deadpan;
       look -1..1 pupils left/right; still: true stops the idle bob. Blinks and bob come from t.
     kinds (who key in script.py = kind):
       'arrow'   Arrow, the reaction arrow (→), head judge: gold arrow pointing right, face on the shaft,
                 chef's toque, black bow tie, tired eye-bags. Default mood deadpan. About 270 x 240.
       'olly'    Olly, oxygen (O₂), celebrity guest chef: two red atoms fused into one body, one big face,
                 sunglasses pushed up, headset microphone, "O" "O" on the two lobes. Default happy.
                 Extra: set({ sparkle: 0..1 }) shows a twinkle star by his head.
       'mass'    Madam Mass, the digital balance, auditor: grey top-pan balance, face on the front, half-moon
                 reading glasses, a green LCD readout. Default deadpan.
                 Extra: set({ reading: '24.31 g' }) writes the LCD (default '0.00 g'); set({ lcd: '#FF6070' }) tints it.
                 g.pan is a group on top of the weighing pan (its origin is the pan's top surface, centre):
                 put things on her pan there and they bob with her.
       'ferris'  Ferris, an iron nail, mopey contestant: tall grey nail, point down. Default sad.
                 Extra: set({ rust: 0..1 }) grows orange-brown rust patches; set({ copper: 0..1 }) coats him in
                 shiny copper (displacement) with a glint; sweat: 0..1 works too.
       'monty'   Monty, carbon monoxide (CO), the uninvited guest: grey C (face) bonded to a red O, fedora,
                 popped trench-coat collar. Default smug. Fade him with op() for "you can't see me".
       'kat'     Kat, a platinum catalyst: a small silver cat (about 190 tall), collar tag "Pt". Silent.
                 Default deadpan (sleepy). Extra: set({ tail: -1..1 }) swishes the tail (default idles).
       'kavya'   Kavya, 12, at her practical: scKavya plus a white lab coat and safety goggles pushed up on her
                 forehead. o.coat === false gives plain scKavya (PE shirt). sweat: 0..1 (it is 34 °C).
     Kavya full body: scKavyaBody (sitcom.js) + kit runPose/walkPose.

   Sets (full stage, 1200 x 750)
     tkKitchen(parent)     the cooking-show set at the bottom of the test tube: plum studio, tiled wall, utensil
                           rail, neon sign "TEST TUBE KITCHEN", spotlights, the curved glass of the tube's bottom.
                           g.upd(t) flickers the neon and sweeps the spotlights. g.sign is the neon group.
     tkCounter(parent)     the steel cooking island across the front (top surface at y = g.counterY = 590). Layer
                           it IN FRONT of the cast (kitchen, then cast, then counter, then dishes on top of it).
     tkLab(parent)         Kavya's school lab wall: green wall, sunny window (HDB blocks), the broken aircon with an
                           "OUT OF ORDER" note (aircon centre (700,150)), a periodic-table poster, a ceiling fan.
                           g.upd(t) turns the fan.
     tkBench(parent)       the black lab bench (top at y = g.benchY = 560), gas tap, and a test-tube rack centred at
                           x 1010 (g.rack; g.tubes: three kit testTubes at rack x -60, 0, 60, g.tubes[i].set(level, colour)).
                           Layer it IN FRONT of Kavya's bust.
     tkConf(parent, kind)  scConfessional tinted for that cast member; g.set(p, t) like scConfessional.

   Props (each drawn around its own origin; place with tr())
     tkFormula(parent, x, y, src, o)  chemistry text with REAL subscripts: digits straight after a letter or ')'
                           become subscripts, other digits stay full size (coefficients, coloured o.coef, default
                           C.energy); '->' becomes '→'. o: size (40), fill, weight (800), anchor ('middle'), font.
                           e.g. tkFormula(g, 0, 0, '2H2 + O2 -> 2H2O'). Returns the <text>.
     tkBoard(parent, w, h, title)  chalkboard menu board, wooden frame, title at the top ('MENU'); centred on the
                           origin; write on it with T()/tkFormula() in the same coordinates.
     tkDish(parent, s)     a white plate with a silver cloche: g.food (group sitting on the plate, origin = plate
                           centre); g.set(lift 0..1) lifts and fades the cloche. About 230 wide.
     tkStamp(parent, text, color)  rubber-stamp verdict ("PHYSICAL", "CHEMICAL", "APPROVED", "UNBALANCED"):
                           g.set(p) thumps it in (scale 1.7 -> 1, slight tilt); p = 0 hides it.
     tkAlarm(parent, s)    a carbon monoxide alarm (white disc, "CO" label, LED): g.set(on 0..1, t) flashes the LED
                           and the "BEEP!" bursts.
     tkHob(parent, s)      a gas-cooker burner ring: g.set(mode, t) with mode 'off' | 'blue' | 'yellow'; yellow adds
                           soot specks and smoke puffs.
     tkTitle(parent)       the show logo ("TEST TUBE" / "KITCHEN", two test tubes in chef's hats); centred.
*/

/* ---------- confessional tints ---------- */
const TK_TINT = {
  arrow: ['#2E2410', '#5E4714'], olly: ['#3A1414', '#6E2323'], mass: ['#1E2A33', '#36505F'],
  ferris: ['#2A2622', '#4E4238'], monty: ['#211D2B', '#3D3550'], kat: ['#1D2633', '#3A4A5E'],
  kavya: ['#14243A', '#25446B'],
};
function tkConf(parent, kind) { const [a, b] = TK_TINT[kind] || TK_TINT.arrow; return scConfessional(parent, a, b); }

/* ---------- characters ---------- */
function cast(parent, kind, o) {
  o = o || {};
  const s = o.s || 1, mood = o.mood;
  if (kind === 'kavya') {
    const k = scKavya(parent, { s, mood: mood || 'neutral' });
    if (o.coat === false) return k;
    const g = k.firstChild;                     // the bobbing group: coat and goggles go on top
    const coat = G(g);
    E('path', { d: 'M-100,140 Q-96,62 -40,52 L-16,54 L-4,140 Z', fill: '#F6F8FA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, coat);
    E('path', { d: 'M100,140 Q96,62 40,52 L16,54 L4,140 Z', fill: '#F6F8FA', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, coat);
    E('path', { d: 'M-40,52 L-22,92 L-16,54 M40,52 L22,92 L16,54', fill: '#E3E8ED', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, coat);   // lapels
    E('rect', { x: 44, y: 104, width: 30, height: 22, rx: 3, fill: '#E3E8ED', stroke: '#9AA6B2', 'stroke-width': 2 }, coat);   // pocket
    E('line', { x1: 52, y1: 96, x2: 52, y2: 112, stroke: '#3F5BD9', 'stroke-width': 4, 'stroke-linecap': 'round' }, coat);   // pen
    const gog = G(g); tr(gog, 0, -84);
    E('path', { d: 'M-74,4 Q0,-14 74,4', fill: 'none', stroke: '#2B3A4A', 'stroke-width': 8 }, gog);
    [-1, 1].forEach(sd => {
      E('rect', { x: sd * 27 - 24, y: -18, width: 48, height: 34, rx: 13, fill: 'rgba(170,225,255,0.55)', stroke: '#2B3A4A', 'stroke-width': 5 }, gog);
      E('path', { d: `M${sd * 27 - 14},-8 L${sd * 27 - 4},-12`, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.8 }, gog);
    });
    E('rect', { x: -6, y: -8, width: 12, height: 12, rx: 3, fill: '#2B3A4A' }, gog);
    return k;
  }
  if (kind === 'arrow') {
    let hat = null;
    return scMake(parent, { s, mood: mood || 'deadpan', seed: 4, bob: 3,
      draw: g => {
        const d = 'M-112,-62 L34,-62 L34,-112 L156,0 L34,112 L34,62 L-112,62 Q-134,62 -134,40 L-134,-40 Q-134,-62 -112,-62 Z';
        E('path', { d, fill: ball('#FFD54A', '#C9920F'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M50,-78 L124,-8', stroke: '#FFF3C4', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.7 }, g);   // shine
        // bow tie under the shaft
        const bt = G(g); tr(bt, -38, 64);
        E('path', { d: 'M0,0 L-24,-13 L-24,13 Z M0,0 L24,-13 L24,13 Z', fill: '#1C1C24', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bt);
        E('circle', { r: 6, fill: '#1C1C24', stroke: SC_INK, 'stroke-width': 2 }, bt);
        // chef's toque
        hat = G(g); tr(hat, -44, -62, 1, -4);
        E('rect', { x: -40, y: -24, width: 80, height: 26, rx: 5, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, hat);
        E('path', { d: 'M-38,-22 C-66,-46 -46,-88 -18,-72 C-10,-104 30,-102 34,-72 C62,-88 74,-44 38,-22 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, hat);
        E('path', { d: 'M-14,-24 L-10,-50 M10,-24 L12,-52', stroke: '#D5DCE3', 'stroke-width': 3, 'stroke-linecap': 'round' }, hat);
      },
      face: { x: -40, y: -12, eye: 21, gap: 60, mouthW: 52, mouthY: 42, lidCol: '#F2C232', iris: '#3A2A06' } });
  }
  if (kind === 'olly') {
    let star = null;
    return scMake(parent, { s, mood: mood || 'happy', seed: 9, bob: 7,
      draw: g => {
        const R = 78, cx = 50, yi = Math.sqrt(R * R - cx * cx).toFixed(1);
        const body = `M0,-${yi} A${R},${R} 0 1,0 0,${yi} A${R},${R} 0 1,0 0,-${yi} Z`;
        E('path', { d: body, fill: ball(C.oxygen, C.oxygenDk), stroke: SC_INK, 'stroke-width': 6 }, g);
        E('path', { d: `M0,-${yi} Q-10,0 0,${yi}`, fill: 'none', stroke: C.oxygenDk, 'stroke-width': 3, opacity: 0.45 }, g);   // where the two atoms meet
        T(g, -cx - 18, 66, 'O', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        T(g, cx + 18, 66, 'O', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        // sunglasses pushed up on top
        const sg = G(g); tr(sg, 0, -74, 1, -3);
        E('path', { d: 'M-58,0 L58,0', stroke: '#14141C', 'stroke-width': 5 }, sg);
        E('rect', { x: -56, y: -6, width: 46, height: 24, rx: 10, fill: '#14141C', stroke: SC_INK, 'stroke-width': 3 }, sg);
        E('rect', { x: 10, y: -6, width: 46, height: 24, rx: 10, fill: '#14141C', stroke: SC_INK, 'stroke-width': 3 }, sg);
        E('path', { d: 'M-48,0 L-36,0 M18,0 L30,0', stroke: '#8AA4FF', 'stroke-width': 3, 'stroke-linecap': 'round' }, sg);
        // headset microphone
        E('path', { d: 'M-118,-30 Q-124,30 -64,46', fill: 'none', stroke: '#2B2B36', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
        E('ellipse', { cx: -118, cy: -30, rx: 10, ry: 16, fill: '#2B2B36' }, g);
        E('circle', { cx: -60, cy: 46, r: 8, fill: '#2B2B36' }, g);
        star = spark(g, 13); tr(star, 104, -76);
      },
      face: { x: 0, y: -6, eye: 22, gap: 70, mouthW: 58, mouthY: 40, lidCol: C.oxygen, iris: '#3A0E0A' },
      upd: (t, g, st) => { star.upd(t); op(star, st.sparkle === undefined ? 0.85 : st.sparkle); } });
  }
  if (kind === 'mass') {
    let lcdTxt = null, lcdBg = null, pan = null;
    const m = scMake(parent, { s, mood: mood || 'deadpan', seed: 6, bob: 1.5,
      draw: g => {
        E('rect', { x: -12, y: -56, width: 24, height: 30, fill: '#8C97A3', stroke: SC_INK, 'stroke-width': 4 }, g);          // pan stem
        E('rect', { x: -112, y: -72, width: 224, height: 18, rx: 9, fill: linGrad('#F4F7FA', '#AEB9C4', true), stroke: SC_INK, 'stroke-width': 5 }, g);   // pan
        pan = G(g); tr(pan, 0, -72);
        E('rect', { x: -126, y: -30, width: 252, height: 162, rx: 24, fill: linGrad('#EEF2F6', '#B8C3CE', true), stroke: SC_INK, 'stroke-width': 6 }, g);
        E('rect', { x: -110, y: 132, width: 40, height: 12, rx: 4, fill: '#5A6672' }, g);
        E('rect', { x: 70, y: 132, width: 40, height: 12, rx: 4, fill: '#5A6672' }, g);
        lcdBg = E('rect', { x: -80, y: 80, width: 160, height: 40, rx: 7, fill: '#173322', stroke: SC_INK, 'stroke-width': 4 }, g);
        lcdTxt = T(g, 0, 110, '0.00 g', { size: 28, weight: 700, anchor: 'middle', fill: '#7CFF9E', font: FB });
        E('circle', { cx: 102, cy: 100, r: 8, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2 }, g);   // TARE button
        E('circle', { cx: -102, cy: 100, r: 8, fill: '#56D69B', stroke: SC_INK, 'stroke-width': 2 }, g);
      },
      face: { x: 0, y: 20, eye: 19, gap: 68, mouthW: 44, mouthY: 34, lidCol: '#D6DEE6', iris: '#2B3A4A' },
      upd: (t, g, st) => {
        if (st.reading !== undefined && lcdTxt.textContent !== String(st.reading)) setText(lcdTxt, String(st.reading));
        attr(lcdTxt, 'fill', st.lcd || '#7CFF9E');
      } });
    // half-moon reading glasses, over the face
    const gl = G(m.firstChild); tr(gl, 0, 26);
    E('path', { d: 'M-60,0 A26,24 0 0,0 -8,0 Z M8,0 A26,24 0 0,0 60,0 Z', fill: 'rgba(200,230,250,0.22)', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, gl);
    E('path', { d: 'M-8,0 Q0,-6 8,0', fill: 'none', stroke: SC_INK, 'stroke-width': 3.5 }, gl);
    m.pan = pan;
    return m;
  }
  if (kind === 'ferris') {
    let rust = null, copper = null, glint = null;
    const shape = 'M-46,-92 L46,-92 L46,64 L0,122 L-46,64 Z';
    return scMake(parent, { s, mood: mood || 'sad', seed: 12, bob: 2,
      draw: g => {
        E('path', { d: shape, fill: linGrad('#D3DAE1', '#7C8792'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-30,40 L30,40 M-26,56 L26,56', stroke: '#8C97A3', 'stroke-width': 4, 'stroke-linecap': 'round' }, g);   // grip lines
        E('rect', { x: 22, y: -86, width: 10, height: 140, rx: 5, fill: '#FFFFFF', opacity: 0.35 }, g);                       // shine
        rust = G(g);
        [[-26, -70, 18, 12], [28, 22, 14, 20], [-20, 70, 20, 14], [6, 92, 12, 10], [-34, 18, 10, 16], [34, -60, 9, 12]].forEach(([x, y, rx, ry], i) =>
          E('path', { d: closedPath(blobPts(rx, ry, 7, 0, 0.25, 40 + i).map(([a, b]) => [a + x, b + y])), fill: i % 2 ? '#B5531E' : '#C9692A', opacity: 0.9 }, rust));
        copper = E('path', { d: shape, fill: linGrad('#F2A27A', '#B0552E'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        glint = spark(g, 12, { color: '#FFE6C9' }); tr(glint, 30, -50);
        // nail head, on top of everything so the coat and rust sit under it
        E('rect', { x: -74, y: -116, width: 148, height: 28, rx: 12, fill: linGrad('#E2E7EC', '#8C97A3', true), stroke: SC_INK, 'stroke-width': 6 }, g);
      },
      face: { x: 0, y: -40, eye: 16, gap: 46, mouthW: 32, mouthY: 34, lidCol: '#B9C2CB', iris: '#2B3A4A' },
      sweat: [[-58, -60], [58, -50]],
      upd: (t, g, st) => {
        op(rust, st.rust === undefined ? 0.35 : st.rust);
        const cu = st.copper || 0; op(copper, cu); op(glint, clamp((cu - 0.6) / 0.4)); glint.upd(t);
      } });
  }
  if (kind === 'monty') {
    return scMake(parent, { s, mood: mood || 'smug', seed: 15, bob: 3,
      draw: g => {
        const O = G(g); tr(O, 84, 10);
        E('circle', { r: 56, fill: ball(C.oxygen, C.oxygenDk), stroke: SC_INK, 'stroke-width': 5 }, O);
        T(O, 10, 12, 'O', { size: 34, weight: 800, anchor: 'middle', fill: '#FFE1DC' });
        E('circle', { cx: -30, cy: 0, r: 74, fill: ball('#A8B3C0', '#56616E'), stroke: SC_INK, 'stroke-width': 6 }, g);
        // popped trench-coat collar
        E('path', { d: 'M-96,44 L-62,96 L-30,70 Z M36,44 L2,96 L-30,70 Z', fill: '#C8A97A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        // fedora
        const h = G(g); tr(h, -30, -62, 1, -6);
        E('path', { d: 'M-52,0 L-44,-46 Q0,-62 44,-46 L52,0 Z', fill: '#3B3346', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, h);
        E('path', { d: 'M-24,-50 Q0,-38 24,-50', fill: 'none', stroke: '#2A2433', 'stroke-width': 5 }, h);
        E('rect', { x: -51, y: -16, width: 102, height: 13, fill: '#7A5BA8' }, h);
        E('ellipse', { rx: 90, ry: 13, fill: '#3B3346', stroke: SC_INK, 'stroke-width': 5 }, h);
      },
      face: { x: -30, y: 2, eye: 16, gap: 48, mouthW: 38, mouthY: 32, lidCol: '#98A3B0', iris: '#2B1E36' } });
  }
  if (kind === 'kat') {
    let tail = null;
    return scMake(parent, { s, mood: mood || 'deadpan', seed: 21, bob: 1.5,
      draw: g => {
        tail = E('path', { d: '', fill: 'none', stroke: SC_INK, 'stroke-width': 26, 'stroke-linecap': 'round' }, g);
        g.tailIn = E('path', { d: '', fill: 'none', stroke: '#B9C3CE', 'stroke-width': 16, 'stroke-linecap': 'round' }, g);
        E('ellipse', { cx: 0, cy: 48, rx: 84, ry: 58, fill: ball('#F2F5F8', '#8E99A6'), stroke: SC_INK, 'stroke-width': 6 }, g);   // body
        E('path', { d: 'M-40,98 Q-40,82 -24,82 Q-10,82 -10,98 Z M10,98 Q10,82 24,82 Q40,82 40,98 Z', fill: '#E3E8ED', stroke: SC_INK, 'stroke-width': 4 }, g);   // paws
        E('path', { d: 'M-62,-58 L-58,-118 L-14,-84 Z M62,-58 L58,-118 L14,-84 Z', fill: ball('#F2F5F8', '#8E99A6'), stroke: SC_INK, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);   // ears
        E('path', { d: 'M-52,-70 L-50,-102 L-26,-84 Z M52,-70 L50,-102 L26,-84 Z', fill: '#F3B6C8' }, g);
        E('ellipse', { cx: 0, cy: -38, rx: 72, ry: 62, fill: ball('#F2F5F8', '#8E99A6'), stroke: SC_INK, 'stroke-width': 6 }, g);   // head
        E('path', { d: 'M-72,-24 L-112,-30 M-72,-12 L-112,-6 M72,-24 L112,-30 M72,-12 L112,-6', stroke: SC_INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);   // whiskers
        E('path', { d: 'M-46,18 Q0,34 46,18', fill: 'none', stroke: '#3F5BD9', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);   // collar
        const tag = G(g); tr(tag, 0, 40);
        E('circle', { r: 15, fill: ball('#FFE07A', '#C9A227'), stroke: SC_INK, 'stroke-width': 3 }, tag);
        T(tag, 0, 7, 'Pt', { size: 18, weight: 800, anchor: 'middle', fill: SC_INK });
      },
      face: { x: 0, y: -44, eye: 15, gap: 50, mouthW: 26, mouthY: 30, lidCol: '#D9E0E7', iris: '#3A7D5A' },
      upd: (t, g, st) => {
        const sw = st.tail !== undefined ? st.tail : Math.sin(t * 1.4 + 1) * 0.5;
        const d = `M60,80 Q${(130 + 20 * sw).toFixed(1)},${(70 - 10 * sw).toFixed(1)} ${(120 + 30 * sw).toFixed(1)},${(10 - 20 * sw).toFixed(1)} Q${(116 + 26 * sw).toFixed(1)},${(-14 - 12 * sw).toFixed(1)} ${(96 + 24 * sw).toFixed(1)},${(-10 - 16 * sw).toFixed(1)}`;
        attr(tail, 'd', d); attr(g.tailIn, 'd', d);
      } });
  }
  throw new Error('cast: unknown kind ' + kind);
}

/* ---------- chemistry text with real subscripts ---------- */
function tkFormula(parent, x, y, src, o) {
  o = o || {};
  const size = o.size || 40, fill = o.fill || C.ink;
  const t = E('text', { x, y, 'font-size': size, 'font-weight': o.weight || 800, fill, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || FD }, parent);
  const s = String(src).replace(/->/g, '→');
  let i = 0, sub = false;
  while (i < s.length) {
    const ch = s[i], prev = i > 0 ? s[i - 1] : ' ';
    let j = i + 1;
    if (/[0-9]/.test(ch)) {
      while (j < s.length && /[0-9]/.test(s[j])) j++;
      const num = s.slice(i, j);
      if (/[A-Za-z)]/.test(prev)) {
        E('tspan', { dy: sub ? 0 : size * 0.26, 'font-size': size * 0.64 }, t).textContent = num;
        sub = true;
      } else {
        E('tspan', { dy: sub ? -size * 0.26 : 0, fill: o.coef || C.energy }, t).textContent = num;
        sub = false;
      }
    } else {
      while (j < s.length && !/[0-9]/.test(s[j])) j++;
      E('tspan', { dy: sub ? -size * 0.26 : 0 }, t).textContent = s.slice(i, j);
      sub = false;
    }
    i = j;
  }
  return t;
}

/* ---------- sets ---------- */
function tkKitchen(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#160D2E', '#3A1745', true) }, g);
  // tiled back wall
  let tiles = '';
  for (let r = 0; r < 9; r++) for (let c = 0; c < 15; c++) {
    const x = 60 + c * 72 + (r % 2) * 36, y = 190 + r * 44;
    if (x > 1120) continue;
    tiles += `M${x},${y} h62 v34 h-62 Z `;
  }
  E('path', { d: tiles, fill: '#2C1F52', stroke: '#45357A', 'stroke-width': 2 }, g);
  // utensil rail
  E('line', { x1: 720, y1: 250, x2: 1100, y2: 250, stroke: '#9FB0BF', 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
  const ut = G(g);
  E('path', { d: 'M770,250 L770,330 M770,330 a18,14 0 1,0 0.1,0 M850,250 L850,320 M838,320 Q850,370 862,320 Z M930,250 L930,330 M918,330 h24 v30 h-24 Z M1010,250 L1010,300', fill: 'none', stroke: '#C9D3DC', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ut);
  E('circle', { cx: 1010, cy: 330, r: 30, fill: '#2B2B36', stroke: '#9FB0BF', 'stroke-width': 6 }, ut);   // a little pan
  // spotlights
  const spots = [G(g), G(g)];
  spots.forEach((sp, i) => E('path', { d: 'M0,0 L-170,640 L170,640 Z', fill: glow(i ? '#FF9BD2' : '#8AD8FF'), opacity: 0.22 }, sp));
  // the neon sign
  const sign = G(g); tr(sign, 600, 150);
  E('rect', { x: -330, y: -58, width: 660, height: 96, rx: 22, fill: '#1A0F2A', stroke: '#FF6FB5', 'stroke-width': 5 }, sign);
  const neon = T(sign, 0, 12, 'TEST TUBE KITCHEN', { size: 54, weight: 800, anchor: 'middle', fill: '#FFF1F8' });
  neon.setAttribute('stroke', '#FF4FA0'); neon.setAttribute('stroke-width', 3); neon.setAttribute('paint-order', 'stroke');
  const halo = E('ellipse', { rx: 380, ry: 90, fill: glow('#FF6FB5'), opacity: 0.35 }, sign);
  sign.insertBefore(halo, sign.firstChild);
  g.sign = sign;
  // the curved glass of the bottom of the test tube
  E('path', { d: 'M24,-20 L24,380 Q24,770 600,770 Q1176,770 1176,380 L1176,-20', fill: 'none', stroke: '#CFE7F5', 'stroke-width': 12, opacity: 0.35 }, g);
  E('path', { d: 'M48,-20 L48,360 Q50,600 210,700', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.18, 'stroke-linecap': 'round' }, g);
  g.upd = t => {
    spots.forEach((sp, i) => tr(sp, i ? 980 : 220, -20, 1, (i ? 1 : -1) * (14 + 8 * Math.sin(t * 0.7 + i * 2))));
    const fl = Math.sin(t * 3.1) * Math.sin(t * 17.3) > 0.96 ? 0.55 : 1;
    neon.style.opacity = fl; halo.style.opacity = (0.35 * fl).toFixed(3);
  };
  g.upd(0);
  return g;
}
/* the steel cooking island, drawn in front of the cast: top surface at y = g.counterY = 590 */
function tkCounter(parent) {
  const g = G(parent), CY = 590;
  E('rect', { x: 90, y: CY, width: 1020, height: 22, rx: 8, fill: linGrad('#E8EEF3', '#9FB0BF', true), stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 110, y: CY + 22, width: 980, height: 150, fill: '#1F5463', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('path', { d: `M110,${CY + 70} H1090`, stroke: '#2C7A8C', 'stroke-width': 6 }, g);
  for (let i = 0; i < 4; i++) E('rect', { x: 170 + i * 240, y: CY + 86, width: 160, height: 10, rx: 5, fill: '#9FB0BF', opacity: 0.8 }, g);   // drawer handles
  g.counterY = CY;
  return g;
}

function tkLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#D9EBDF', '#B9D3C2', true) }, g);
  // window with a hot, sunny sky
  const win_ = G(g); tr(win_, 930, 300);
  E('rect', { x: -170, y: -150, width: 340, height: 260, rx: 8, fill: linGrad('#6CC8FF', '#CDEEFF', true), stroke: '#F4F7FA', 'stroke-width': 14 }, win_);
  E('circle', { cx: 80, cy: -70, r: 70, fill: glow('#FFE45C') }, win_); E('circle', { cx: 80, cy: -70, r: 30, fill: '#FFE45C' }, win_);
  E('path', { d: 'M0,-150 L0,110 M-170,-20 L170,-20', stroke: '#F4F7FA', 'stroke-width': 10 }, win_);
  E('path', { d: 'M-160,110 L-160,60 L-120,60 L-120,30 L-80,30 L-80,110 Z M-60,110 L-60,50 L-20,50 L-20,110 Z', fill: '#9FB6C6', opacity: 0.8 }, win_);   // HDB blocks
  // the broken aircon
  const ac = G(g); tr(ac, 700, 150);
  E('rect', { x: -130, y: -40, width: 260, height: 80, rx: 14, fill: '#F4F7FA', stroke: '#8FA2B0', 'stroke-width': 4 }, ac);
  for (let i = 0; i < 4; i++) E('line', { x1: -110, y1: 14 + i * 6, x2: 110, y2: 14 + i * 6, stroke: '#B9C6D2', 'stroke-width': 2 }, ac);
  E('circle', { cx: 104, cy: -20, r: 5, fill: '#FF6060' }, ac);
  const note = G(ac); tr(note, -20, 54, 1, -5);
  E('rect', { x: -84, y: -6, width: 168, height: 52, fill: '#FFF59A', stroke: '#C9B54A', 'stroke-width': 2 }, note);
  T(note, 0, 30, 'OUT OF ORDER', { size: 26, weight: 800, anchor: 'middle', fill: '#C62828' });
  E('rect', { x: -14, y: -12, width: 28, height: 12, fill: '#D9D2B0', opacity: 0.8 }, note);   // tape
  // periodic table poster
  const pt = G(g); tr(pt, 230, 260);
  E('rect', { x: -150, y: -100, width: 300, height: 200, rx: 6, fill: '#FFFFFF', stroke: '#8FA2B0', 'stroke-width': 4 }, pt);
  const cols = ['#FF9E80', '#FFD180', '#A5D6A7', '#81D4FA', '#CE93D8'];
  let cells = ['', '', '', '', ''];
  const lay = [[0, 17], [0, 1, 12, 13, 14, 15, 16, 17], [0, 1, 12, 13, 14, 15, 16, 17], [...Array(18).keys()], [...Array(18).keys()]];
  lay.forEach((row, r) => row.forEach(c => { const k = c < 2 ? 0 : c < 12 ? 1 : c < 16 ? 2 : c < 17 ? 3 : 4; cells[k] += `M${-136 + c * 15},${-70 + r * 22} h13 v19 h-13 Z `; }));
  cells.forEach((d, k) => E('path', { d, fill: cols[k] }, pt));
  T(pt, 0, 86, 'PERIODIC TABLE', { size: 24, weight: 800, anchor: 'middle', fill: '#3F5BD9' });
  // ceiling fan
  const fan = G(g); tr(fan, 600, 46);
  E('line', { x1: 0, y1: -60, x2: 0, y2: 0, stroke: '#7D8C99', 'stroke-width': 6 }, fan);
  const blades = G(fan);
  E('path', { d: 'M0,0 L-140,-8 Q-150,0 -140,8 Z M0,0 L140,-8 Q150,0 140,8 Z', fill: '#8FA2B0' }, blades);
  E('ellipse', { rx: 22, ry: 10, fill: '#5A6672' }, fan);
  g.upd = t => tr(blades, 0, 0, 1, (t * 140) % 360);
  g.upd(0);
  return g;
}
/* the black lab bench with a gas tap and a test-tube rack, drawn in front of Kavya: top at y = g.benchY = 560 */
function tkBench(parent) {
  const g = G(parent), BY = 560;
  E('rect', { x: 0, y: BY, width: 1200, height: 26, fill: '#2B2F36' }, g);
  E('rect', { x: 0, y: BY + 26, width: 1200, height: 164, fill: '#8A6A48' }, g);
  for (let i = 0; i < 5; i++) {
    E('rect', { x: 30 + i * 236, y: BY + 46, width: 210, height: 124, rx: 6, fill: '#9B7A55', stroke: '#6E5236', 'stroke-width': 3 }, g);
    E('rect', { x: 120 + i * 236, y: BY + 60, width: 30, height: 8, rx: 4, fill: '#D5DCE3' }, g);
  }
  E('path', { d: `M120,${BY} L120,${BY - 40} Q120,${BY - 54} 140,${BY - 54} L160,${BY - 54}`, fill: 'none', stroke: '#C9A227', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);   // gas tap
  // test-tube rack
  const rack = G(g); tr(rack, 1010, BY);
  E('rect', { x: -110, y: -20, width: 220, height: 20, rx: 4, fill: '#C9A27A', stroke: '#6E5236', 'stroke-width': 3 }, rack);
  E('path', { d: 'M-100,-80 L-100,-20 M100,-80 L100,-20', stroke: '#6E5236', 'stroke-width': 8 }, rack);
  g.tubes = [-60, 0, 60].map((x, i) => { const tt = testTube(rack, 36, 150, { level: [0.3, 0.45, 0.35][i], liquid: ['#BFE3FF', '#9BE7C4', '#FFD7A0'][i] }); tr(tt, x, -84); return tt; });
  E('rect', { x: -110, y: -96, width: 220, height: 16, rx: 4, fill: '#C9A27A', stroke: '#6E5236', 'stroke-width': 3 }, rack);
  g.rack = rack;
  g.benchY = BY;
  return g;
}

/* ---------- props ---------- */
function tkBoard(parent, w, h, title) {
  const g = G(parent);
  E('rect', { x: -w / 2 - 16, y: -h / 2 - 16, width: w + 32, height: h + 32, rx: 14, fill: '#8A5A33', stroke: SC_INK, 'stroke-width': 5 }, g);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 6, fill: linGrad('#1F3B30', '#173026', true) }, g);
  E('path', { d: `M${-w / 2 + 30},${h / 2 - 26} Q${-w / 4},${h / 2 - 40} 0,${h / 2 - 28}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.08 }, g);   // chalk smudge
  if (title) {
    T(g, 0, -h / 2 + 50, title, { size: 38, weight: 800, anchor: 'middle', fill: '#FFF7C2', ls: 4 });
    E('line', { x1: -w / 2 + 40, y1: -h / 2 + 68, x2: w / 2 - 40, y2: -h / 2 + 68, stroke: '#FFF7C2', 'stroke-width': 3, opacity: 0.5 }, g);
  }
  g.w = w; g.h = h;
  return g;
}

function tkDish(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('ellipse', { cx: 0, cy: 6, rx: 118, ry: 26, fill: '#D5DCE3', stroke: SC_INK, 'stroke-width': 4 }, inner);
  E('ellipse', { cx: 0, cy: 2, rx: 84, ry: 16, fill: '#FFFFFF', stroke: '#C9D3DC', 'stroke-width': 3 }, inner);
  g.food = G(inner);
  const lid = G(inner);
  E('path', { d: 'M-100,4 Q-100,-118 0,-118 Q100,-118 100,4 Z', fill: linGrad('#F4F7FA', '#8C97A3', true), stroke: SC_INK, 'stroke-width': 5 }, lid);
  E('path', { d: 'M-66,-30 Q-60,-86 -14,-96', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, opacity: 0.6, 'stroke-linecap': 'round' }, lid);
  E('rect', { x: -18, y: -136, width: 36, height: 20, rx: 10, fill: '#C9D3DC', stroke: SC_INK, 'stroke-width': 4 }, lid);
  g.set = p => { p = clamp(p); tr(lid, 40 * p, -120 * p, 1, 18 * p); op(lid, 1 - clamp((p - 0.6) / 0.4)); };
  g.set(0);
  return g;
}

function tkStamp(parent, text, color) {
  const g = G(parent), inner = G(g), col = color || C.bad;
  const w = textWidth(text, 50, FD, 800) + 64;
  E('rect', { x: -w / 2, y: -42, width: w, height: 84, rx: 12, fill: 'rgba(10,10,20,0.35)', stroke: col, 'stroke-width': 8 }, inner);
  E('rect', { x: -w / 2 + 10, y: -32, width: w - 20, height: 64, rx: 8, fill: 'none', stroke: col, 'stroke-width': 3 }, inner);
  T(inner, 0, 17, text, { size: 50, weight: 800, anchor: 'middle', fill: col, ls: 3 });
  g.set = p => { p = clamp(p); op(g, clamp(p * 4)); tr(inner, 0, 0, 1 + 0.7 * (1 - easeOut(p)), -8); };
  g.set(0);
  return g;
}

function tkAlarm(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const bursts = G(inner);
  const b1 = T(bursts, -120, -60, 'BEEP!', { size: 40, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const b2 = T(bursts, 120, -40, 'BEEP!', { size: 40, weight: 800, anchor: 'middle', fill: '#FF6070' });
  const waves = E('path', { d: 'M-78,-30 Q-92,0 -78,30 M-94,-44 Q-114,0 -94,44 M78,-30 Q92,0 78,30 M94,-44 Q114,0 94,44', fill: 'none', stroke: '#FF6070', 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
  E('circle', { r: 64, fill: ball('#FFFFFF', '#C9D3DC'), stroke: SC_INK, 'stroke-width': 5 }, inner);
  for (let i = -2; i <= 2; i++) E('rect', { x: -34, y: -30 + i * 9 - 3, width: 68, height: 5, rx: 2.5, fill: '#B9C6D2' }, inner);
  T(inner, 0, 44, 'CO', { size: 26, weight: 800, anchor: 'middle', fill: SC_INK });
  const led = E('circle', { cx: 0, cy: 14, r: 7, fill: '#5A1E2A' }, inner);
  g.set = (on, t) => {
    t = t || 0; const blink = on > 0 && Math.sin(t * TAU * 2.2) > 0;
    attr(led, 'fill', blink ? '#FF3B3B' : '#5A1E2A');
    op(waves, blink ? on : 0); op(b1, on * (blink ? 1 : 0)); op(b2, on * (blink ? 0 : 1));
  };
  g.set(0, 0);
  return g;
}

function tkHob(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  E('ellipse', { cx: 0, cy: 16, rx: 150, ry: 34, fill: '#2B2F36', stroke: SC_INK, 'stroke-width': 4 }, inner);
  E('ellipse', { cx: 0, cy: 8, rx: 90, ry: 20, fill: '#5A6672', stroke: SC_INK, 'stroke-width': 4 }, inner);
  const fl = G(inner), flames = [];
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU, x = Math.cos(a) * 80, y = 4 + Math.sin(a) * 17;
    const f = G(fl); tr(f, x, y);
    flames.push({ f, outer: E('path', { d: 'M0,0 C-11,-10 -9,-34 0,-56 C9,-34 11,-10 0,0 Z' }, f), core: E('path', { d: 'M0,-2 C-5,-8 -5,-20 0,-30 C5,-20 5,-8 0,-2 Z' }, f), ph: i * 1.7, x, y, back: Math.sin(a) < 0 });
  }
  const smoke = G(inner), puffs = [];
  for (let i = 0; i < 4; i++) puffs.push(E('circle', { r: 22, fill: '#3A3A44', opacity: 0.5 }, smoke));
  const soot = G(inner), specks = [], r = rng(31);
  for (let i = 0; i < 10; i++) specks.push({ el: E('circle', { r: 3 + r() * 3, fill: '#111111' }, soot), x: (r() - 0.5) * 160, ph: r() });
  g.set = (mode, t) => {
    t = t || 0; const yel = mode === 'yellow';
    op(fl, mode === 'off' ? 0 : 1); op(smoke, yel ? 1 : 0); op(soot, yel ? 1 : 0);
    flames.forEach(({ f, outer, core, ph, x, y }) => {
      outer.setAttribute('fill', yel ? '#FFB13B' : '#5AA8FF'); core.setAttribute('fill', yel ? '#FFE07A' : '#BFE3FF');
      const k = yel ? 1.6 + 0.35 * Math.sin(t * 9 + ph) : 1 + 0.12 * Math.sin(t * 14 + ph);
      f.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(yel ? 1.25 : 1)} ${k.toFixed(3)})`);
    });
    if (yel) {
      puffs.forEach((p, i) => { const q = (t * 0.35 + i / 4) % 1; attr(p, 'cx', -40 + i * 26 + 20 * Math.sin(t + i)); attr(p, 'cy', -90 - q * 160); attr(p, 'r', 18 + q * 30); p.style.opacity = (0.55 * (1 - q)).toFixed(3); });
      specks.forEach(({ el, x, ph }) => { const q = (t * 0.5 + ph) % 1; attr(el, 'cx', x + 10 * Math.sin(t * 2 + ph * 9)); attr(el, 'cy', -70 - q * 180); el.style.opacity = (1 - q).toFixed(3); });
    }
  };
  g.set('blue', 0);
  return g;
}

function tkTitle(parent) {
  const g = G(parent);
  const word = (txt, y, size, fill, strokeCol) => {
    const t = T(g, 0, y, txt, { size, weight: 800, anchor: 'middle', fill, ls: 2 });
    t.setAttribute('stroke', strokeCol); t.setAttribute('stroke-width', size * 0.14); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round');
    return t;
  };
  word('TEST TUBE', -34, 70, '#BFE9FF', '#123A5A');
  word('KITCHEN', 66, 108, '#FF8A5C', '#5A1A12');
  [-1, 1].forEach(sd => {
    const tt = G(g); tr(tt, sd * 330, 20, 1, sd * 16);
    const tube = testTube(tt, 50, 170, { level: 0.42, liquid: sd < 0 ? '#9BE7C4' : '#FFB36B' });
    const hat = G(tt); tr(hat, 0, -98);
    E('rect', { x: -32, y: -14, width: 64, height: 20, rx: 4, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, hat);
    E('path', { d: 'M-30,-12 C-52,-30 -38,-62 -14,-50 C-8,-76 24,-74 28,-50 C50,-62 60,-30 30,-12 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, hat);
    void tube;
  });
  return g;
}

/* ==========================================================================
   LIGHT WORK (Claude Sitcom Ep 10, Light & Optics): cast, sets, props and exact optics art.
   Bundled after engine/lib.js, engine/kit.js and engine/sitcom.js (scMake, scKavya, scTalk,
   scConfessional, scLowerThird, SC_INK ...). Every top-level name starts with lw / LW_ except cast().

   CAST: cast(parent, kind, o) -> a scMake character, origin at its centre, drawn facing the viewer.
     Every frame: c.set({ t, talk: scTalk(S, t, who), mood, look, sweat, still, ...extras })
       moods: neutral | happy | smug | annoyed | sad | shock | deadpan;  look -1..1 (pupils left/right)
     o: { s (scale), mood (default mood) }
     kinds (about 200-250 px tall at s = 1 unless noted):
       'ray'     Ray, a ray of white light, courier for Light Work Express. Glowing pale-yellow round head with
                 short light spikes, blue courier cap with a straight-arrow badge, cream trench coat with belt,
                 courier bag on his right hip. Tired, sarcastic straight man. Default mood deadpan.
                 EXTRA: c.set({ coat: 0..1 }) swings the coat open and shows the seven colours stacked inside
                 (red at the top ... violet at the bottom), waving. 0 = closed. Use on "seven colours in a trench coat".
       'norman'  Norman, the normal: a pale head with neat hair and square glasses on a straight dashed pole, a
                 right-angle mark at his foot where he meets the "surface" (a short floor line). Never bobs (bob 0):
                 he is always perfectly at 90 degrees. Pedantic. Tall (about 250 px).
       'mirabel' Mirabel, a vain plane mirror: oval silver glass in an ornate gold frame, hanging from a nail,
                 glam lavender eyelids, lashes, beauty mark, pink bow. Default mood smug.
       'dennis'  Dennis, the swimming pool water: a slab of blue water with a wavy (animated) surface, light
                 ripples, rising bubbles, orange swim goggles on his forehead. Slow, gentle. Default neutral.
       'rosie'   Rosie, a red filter (a stage-light gel): red see-through square in a dark metal frame,
                 sunglasses pushed up on top, an earpiece cord, arms folded like a bouncer. Default deadpan.
       'violet'  Violet, one of the seven colours: purple ball, hair bun, sparkle. Hyper. Default happy. (~150 px)
       'indigo'  Indigo: deep blue-violet ball, knitted beanie with pompom. Mopey. Default sad. (~150 px)
       'red'     Red: red ball, sunglasses on his head. Very relaxed, silent. Default smug. (~140 px)
       'hue'     any other spectrum colour: o.hue = 'orange' | 'yellow' | 'green' | 'blue' (or any LW_SPECTRUM name).
       'kavya'   Kavya (scKavya, head and shoulders). o.outfit: 'pe' (default, PE shirt "8") | 'pyjamas' (lilac) |
                 'swim' (navy swimsuit, goggles on forehead) | 'tree' (green costume, crown of leaves).
                 c.shirt (the shirt path) and c.leaves (leaf paths, 'tree' only) can be recoloured, e.g. black
                 under red light: lwTint(c.leaves, '#1A1A1A', p) / lwTint([c.shirt], ...).
   Lower thirds and confessionals:
     lwLower(parent, kind)        scLowerThird with this cast's NAME / role (LW_ROLE); g.set(p)
     lwConf(parent, kind)         scConfessional in this character's colours (LW_TINT); g.set(p, t)
     lwTint(els, colour, p)       blends the fills of els from their original colour to colour (p 0..1)

   SETS (full stage 1200 x 750, draw first, behind the cast):
     lwSpace(parent)              black space, the Sun (left, g.sunAt), Earth (right, g.earthAt), stars; g.upd(t)
     lwBedroom(back, front)       Kavya's HDB bedroom: window (right) with translucent curtains (g.curtL, g.curtR
                                  slide with g.curtains(open 0..1)), a sunbeam (g.beam, g.setBeam(p)), bed (left) with
                                  the blanket drawn into `front` (g.blanket) so Kavya can sit in bed between them;
                                  desk lamp (g.lampAt), clear wall for shadows (g.wall = {x, y, w, h});
                                  g.dark(p) darkens the room (lights out). Kavya in bed: bust at about (330, 470), s 0.9.
     lwBathroom(parent)           tiled bathroom: sink counter along the bottom, towel on a rail (right, g.towelAt),
                                  space for Mirabel on the wall (g.mirrorAt = [600, 300]).
     lwPool(back, front)          swimming complex: sky, HDB blocks, pool deck, the pool in cross-section (we see
                                  through its glass side); g.waterY = 380 (surface), g.floorY = 700 (pool floor).
                                  The see-through water is drawn into `front` so anything in the pool looks underwater.
                                  g.upd(t) ripples the surface.
     lwStorm(parent)              a dark afternoon seen from an HDB window: blocks, heavy rain, lightning bolt;
                                  g.upd(t, rain 0..1, flash 0..1).
     lwLivingRoom(parent)         Grandma's living room after the rain: window (right) with raindrops, a glass prism
                                  hanging on a string (g.prismAt = [840, 300]), clear wall (left) for the rainbow
                                  (g.wall), sofa, potted plant.
     lwHall(parent)               the school hall stage: dark audience, red side curtains, wooden stage, lighting bar
                                  with three stage lanterns (g.spots = [[x, y], ...]); cardboard trees.
   PROPS:
     lwSpot(parent, colour)       a stage lantern pointing down, with a light cone; g.set(on 0..1, colour)
     lwTorch(parent)              a phone with its torch on; g.set(on 0..1)
     lwHandDino(parent)           the dinosaur hand-shadow silhouette (about 220 wide), black; scale with tr()
     lwMoon(parent, r)            a grey full Moon
     lwApple(parent, s)           a prop apple; g.paint(colour) recolours it (red in white light, black in blue light...)
     lwBook(parent, colour)       a closed book standing up, about 120 x 160
     lwList(parent)               Rosie's clipboard: "THE LIST", red tick for RED, crosses for the rest
     lwTipJar(parent, s)          an empty jar labelled "TIPS" (the running gag: nobody tips)
     lwRainbow(parent, r, w)      a rainbow arc, outer radius r, total band width w, red outside, violet inside
     lwRGB(parent, s)             three overlapping spotlight circles red / green / blue on black, with the overlaps
                                  yellow, cyan, magenta and white (exact additive mixing); g.set(p) fades them in one by one
     lwPixels(parent, s)          a magnified phone-screen pixel grid: red, green, blue sub-pixels; g.set(colour) lights the
                                  sub-pixels for 'yellow' | 'white' | 'cyan' | 'magenta' | 'red' ...
   OPTICS (copied from lessons/light/lib.js with an lw prefix; physically exact, use for every ray diagram):
     LW_OPT (colours, refractive indexes), LW_SPECTRUM (red..violet with colours and exaggerated indexes),
     lwDir, lwAng, lwPt, lwSnell, lwCritical, lwUnit, lwReflectVec, lwRefractVec, lwBounce (i = r), lwBend
     (refraction / TIR), lwRayPath (ray with arrowheads, g.set(p) draws it on), lwLightRay, lwNormal (dashed
     normal with 90 degree box), lwArc / lwArcFromNormal (angle arcs labelled 'i = {deg}°'), lwPlaneMirror,
     lwRough (diffuse reflection), lwGlassShape, lwGlassBlock, lwSemiBlock, lwPrism (g.trace for dispersion),
     lwConvexLens, lwLensImage, lwLensFocus, lwEyeSection (labelled eye with g.pupil, g.focus, g.rays, g.image),
     lwIrisFront, lwEyeIcon, lwRayBox. Full notes above each function below.
   ANGLES: screen degrees, 0 points right, 90 points DOWN. Optics angles are always measured FROM THE NORMAL.
   DISPERSION: trace each LW_SPECTRUM colour through lwPrism with its own n, then draw the incoming white ray
   (LW_OPT.white) once on top of them: the seven traces overlap before the prism and the last one would show.
   Check: lwCritical(1.5) is 41.8° (glass), so "about 42°" on screen matches the script.
   ========================================================================== */

/* ---------- cast ---------- */
const LW_HUE = { red: '#FF4D4D', orange: '#FF9A3C', yellow: '#FFE45C', green: '#4CD964', blue: '#3B82F6', indigo: '#5B5BD6', violet: '#A066FF' };
const LW_HUE_DK = { red: '#B32626', orange: '#C2621A', yellow: '#C9A11E', green: '#22844A', blue: '#1D4FB0', indigo: '#2E2E8C', violet: '#6A35C2' };
const LW_ROLE = {
  ray: ['RAY', 'Ray of light. Courier, Light Work Express.'],
  norman: ['NORMAN', 'The normal. Imaginary. Always 90°.'],
  mirabel: ['MIRABEL', 'Plane mirror. Bathroom. Stunning.'],
  dennis: ['DENNIS', 'The pool. Optically dense.'],
  rosie: ['ROSIE', 'Red filter. Stage lights. Exclusive.'],
  violet: ['VIOLET', 'Bends the most. Loves it.'],
  indigo: ['INDIGO', 'A real colour. Honestly.'],
  kavya: ['KAVYA, 12', 'Wanted to sleep in.'],
};
const LW_TINT = {
  ray: ['#2E2A14', '#5E5220'], norman: ['#1C2630', '#36495A'], mirabel: ['#2E1A36', '#5A3266'], dennis: ['#0E2C3A', '#14506A'],
  rosie: ['#2E0E14', '#5E1A24'], violet: ['#26143E', '#4A2A78'], indigo: ['#151638', '#2C2E6E'], kavya: ['#14243A', '#25446B'],
};
function lwLower(parent, kind) { const r = LW_ROLE[kind] || [String(kind).toUpperCase(), '']; return scLowerThird(parent, r[0], r[1]); }
function lwConf(parent, kind) { const c = LW_TINT[kind] || LW_TINT.ray; return scConfessional(parent, c[0], c[1]); }
function lwMix(c1, c2, p) {
  const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), a = h(c1), b = h(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(p))).toString(16).padStart(2, '0')).join('');
}
function lwTint(els, colour, p) {
  (els || []).forEach(el => { if (!el) return; if (!el.lwBase) el.lwBase = el.getAttribute('fill'); el.setAttribute('fill', p > 0.001 ? lwMix(el.lwBase, colour, p) : el.lwBase); });
}

function cast(parent, kind, o) {
  o = o || {};
  const K = SC_INK;
  if (kind === 'kavya') return lwKavya(parent, o);
  if (kind === 'ray') {
    let flapL, flapR, kids, halo;
    const c = scMake(parent, {
      s: o.s, mood: o.mood || 'deadpan', seed: 4, bob: 3,
      draw: g => {
        halo = E('ellipse', { cx: 0, cy: -20, rx: 160, ry: 170, fill: glow('#FFF3B0'), opacity: 0.55 }, g);
        // coat lining and the seven colours inside (seen when the coat opens)
        E('path', { d: 'M-50,-14 L50,-14 L70,98 L-70,98 Z', fill: '#4A3A2E', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        kids = G(g);
        LW_SPECTRUM.forEach((h, i) => {
          const k = G(kids); tr(k, 0, -2 + i * 15);
          E('circle', { r: 11, fill: ball(h.color, LW_HUE_DK[h.name]), stroke: K, 'stroke-width': 2 }, k);
          E('circle', { cx: -4, cy: -2, r: 2.2, fill: K }, k); E('circle', { cx: 4, cy: -2, r: 2.2, fill: K }, k);
          E('path', { d: 'M-4,4 Q0,7 4,4', fill: 'none', stroke: K, 'stroke-width': 1.6 }, k);
          k.arm = E('line', { x1: 10, y1: 0, x2: 20, y2: -8, stroke: h.color, 'stroke-width': 4, 'stroke-linecap': 'round' }, k);
        });
        // the coat: two flaps that swing open from the shoulders
        const flap = side => {
          const f = G(g), sx = side;
          E('path', { d: `M0,-16 L${-52 * sx},-14 Q${-60 * sx},40 ${-74 * sx},98 L0,98 Z`, fill: '#F3EBD7', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, f);
          E('rect', { x: side > 0 ? -66 : 0, y: 40, width: 66, height: 14, fill: '#C9B58E', stroke: K, 'stroke-width': 3 }, f);   // belt
          E('path', { d: `M${-40 * sx},64 L${-18 * sx},64`, stroke: '#BBA77E', 'stroke-width': 4, 'stroke-linecap': 'round' }, f);    // pocket
          if (side > 0) { E('circle', { cx: -10, cy: 14, r: 4.5, fill: '#8A6D35', stroke: K, 'stroke-width': 1.5 }, f); E('circle', { cx: -10, cy: 76, r: 4.5, fill: '#8A6D35', stroke: K, 'stroke-width': 1.5 }, f); }
          return f;
        };
        flapL = flap(1); flapR = flap(-1);
        E('rect', { x: -14, y: 40, width: 28, height: 16, rx: 3, fill: '#E0C878', stroke: K, 'stroke-width': 3 }, flapL);   // buckle
        // popped collar
        E('path', { d: 'M-46,-18 L-22,-30 L-4,8 Z M46,-18 L22,-30 L4,8 Z', fill: '#E8DDBF', stroke: K, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
        // courier bag on his right hip (viewer's left), strap from the shoulder
        E('path', { d: 'M-44,-14 L-70,44', stroke: '#2F6FD6', 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        const bag = G(g); tr(bag, -74, 56, 1, -6);
        E('rect', { x: -26, y: -16, width: 52, height: 40, rx: 7, fill: '#2F6FD6', stroke: K, 'stroke-width': 3 }, bag);
        E('path', { d: 'M-26,-4 L26,-4', stroke: '#1E4E9E', 'stroke-width': 3 }, bag);
        T(bag, 0, 18, 'LW', { size: 17, weight: 800, anchor: 'middle', fill: '#FFE45C' });
        // head: light spikes, glowing face
        let sp = '';
        for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; sp += `M${(Math.cos(a) * 66).toFixed(1)},${(-80 + Math.sin(a) * 66).toFixed(1)} L${(Math.cos(a) * 84).toFixed(1)},${(-80 + Math.sin(a) * 84).toFixed(1)} `; }
        E('path', { d: sp, stroke: '#FFE45C', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        E('circle', { cx: 0, cy: -80, r: 62, fill: ball('#FFF8D6', '#F2C84B'), stroke: '#B88A1A', 'stroke-width': 5 }, g);
        E('ellipse', { cx: -38, cy: -60, rx: 11, ry: 7, fill: '#FFB37A', opacity: 0.55 }, g);
        E('ellipse', { cx: 38, cy: -60, rx: 11, ry: 7, fill: '#FFB37A', opacity: 0.55 }, g);
        // courier cap with a straight-arrow badge
        E('path', { d: 'M-60,-108 Q-56,-150 0,-152 Q56,-150 60,-108 Z', fill: '#2F6FD6', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-62,-108 L62,-108 Q76,-106 86,-100 Q70,-96 56,-100 L-62,-100 Z', fill: '#1E4E9E', stroke: K, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-20,-128 L12,-128 M4,-136 L14,-128 L4,-120', fill: 'none', stroke: '#FFE45C', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      },
      face: { x: 0, y: -78, eye: 17, gap: 52, mouthW: 40, mouthY: 30, lidCol: '#F2D35B' },
      upd: (t, g, st) => {
        const p = clamp(st.coat || 0), a = 50 * ease(p);
        flapL.setAttribute('transform', `rotate(${a.toFixed(2)} -50 -14)`);    // viewer's left half swings out to the left
        flapR.setAttribute('transform', `rotate(${(-a).toFixed(2)} 50 -14)`);  // right half swings out to the right
        op(kids, p > 0.02 ? 1 : 0);
        if (p > 0.02) [...kids.children].forEach((k, i) => attr(k.arm, 'y2', -8 - 6 * Math.sin(t * 9 + i)));
        attr(halo, 'opacity', 0.45 + 0.12 * Math.sin(t * 2.2));
      },
    });
    return c;
  }
  if (kind === 'norman') {
    const c = scMake(parent, {
      s: o.s, mood: o.mood || 'neutral', seed: 6, bob: 0,
      draw: g => {
        E('line', { x1: -64, y1: 112, x2: 64, y2: 112, stroke: '#C9D6DF', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);   // the surface
        E('path', { d: 'M0,94 L18,94 L18,112', fill: 'none', stroke: '#FFE45C', 'stroke-width': 4 }, g);                         // 90° box
        E('line', { x1: -16, y1: 6, x2: -36, y2: 70, stroke: K, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);              // stiff arms
        E('line', { x1: 16, y1: 6, x2: 36, y2: 70, stroke: K, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
        E('rect', { x: -15, y: -36, width: 30, height: 148, rx: 8, fill: '#F4F7FA', stroke: K, 'stroke-width': 4 }, g);
        let d = '';
        for (let y = -24; y < 104; y += 24) d += `M0,${y} L0,${y + 12} `;
        E('path', { d, stroke: '#5E7487', 'stroke-width': 8 }, g);                                                               // the dashes
        const badge = G(g); tr(badge, 0, 30);
        E('circle', { r: 19, fill: '#FFE45C', stroke: K, 'stroke-width': 3 }, badge);
        T(badge, 1, 6, '90°', { size: 16, weight: 800, anchor: 'middle', fill: K });
        E('rect', { x: -60, y: -150, width: 120, height: 118, rx: 34, fill: ball('#F2F6FA', '#BFCCD8'), stroke: K, 'stroke-width': 5 }, g);
        E('path', { d: 'M-58,-110 Q-56,-152 0,-152 Q50,-152 58,-112 Q30,-136 -18,-130 Q-40,-128 -58,-110 Z', fill: '#4A3B30', stroke: K, 'stroke-width': 3 }, g);   // neat side parting
      },
      face: { x: 0, y: -86, eye: 15, gap: 48, mouthW: 32, mouthY: 32, lidCol: '#C9D6DF' },
    });
    const g = c.firstChild, gl = G(g); tr(gl, 0, -86);
    [-24, 24].forEach(x => E('rect', { x: x - 21, y: -19, width: 42, height: 38, rx: 7, fill: 'none', stroke: K, 'stroke-width': 4 }, gl));
    E('line', { x1: -3, y1: -4, x2: 3, y2: -4, stroke: K, 'stroke-width': 4 }, gl);
    E('path', { d: 'M-45,-6 L-60,-12 M45,-6 L60,-12', stroke: K, 'stroke-width': 3.5 }, gl);
    return c;
  }
  if (kind === 'mirabel') {
    const c = scMake(parent, {
      s: o.s, mood: o.mood || 'smug', seed: 9, bob: 1.5,
      draw: g => {
        E('path', { d: 'M-44,-112 L0,-150 L44,-112', fill: 'none', stroke: '#7A6A50', 'stroke-width': 3 }, g);
        E('circle', { cx: 0, cy: -150, r: 6, fill: '#8F9CAB', stroke: K, 'stroke-width': 2 }, g);
        for (let i = 0; i < 18; i++) { const a = i / 18 * TAU; E('circle', { cx: Math.cos(a) * 100, cy: Math.sin(a) * 122, r: 13, fill: '#E9C25A', stroke: '#7A5A10', 'stroke-width': 3 }, g); }
        E('ellipse', { rx: 98, ry: 120, fill: ball('#F7DC86', '#B88A22'), stroke: '#7A5A10', 'stroke-width': 5 }, g);
        E('ellipse', { rx: 80, ry: 102, fill: linGrad('#EAF4FA', '#9FB9CE', true), stroke: '#5F7A8C', 'stroke-width': 3 }, g);
        E('path', { d: 'M-58,-46 L-26,-80 M-62,-14 L-6,-74 M40,70 L60,48', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.55 }, g);
        const bow = G(g); tr(bow, 0, -120);
        E('path', { d: 'M0,0 L-30,-16 L-30,16 Z M0,0 L30,-16 L30,16 Z', fill: '#FF6FB5', stroke: K, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bow);
        E('circle', { r: 8, fill: '#FF3E9A', stroke: K, 'stroke-width': 3 }, bow);
        E('circle', { cx: 36, cy: 44, r: 3.5, fill: K }, g);   // beauty mark
        E('ellipse', { cx: -44, cy: 22, rx: 12, ry: 7, fill: '#FF9BC4', opacity: 0.55 }, g);
        E('ellipse', { cx: 44, cy: 22, rx: 12, ry: 7, fill: '#FF9BC4', opacity: 0.55 }, g);
      },
      face: { x: 0, y: -10, eye: 18, gap: 56, mouthW: 40, mouthY: 42, lidCol: '#C49AE6', iris: '#2B3A66' },
    });
    const g = c.firstChild, lash = G(g); tr(lash, 0, -10);
    let d = '';
    [-1, 1].forEach(sd => { const ex = sd * 28; [[0.55, -0.85], [0.85, -0.5], [1.0, -0.12]].forEach(([fx, fy]) => { const x = ex + sd * 18 * fx, y = 20 * fy; d += `M${x.toFixed(1)},${y.toFixed(1)} L${(x + sd * 9 * fx).toFixed(1)},${(y + 9 * fy - 2).toFixed(1)} `; }); });
    E('path', { d, stroke: K, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, lash);
    return c;
  }
  if (kind === 'dennis') {
    let surf, bub;
    const c = scMake(parent, {
      s: o.s, mood: o.mood || 'neutral', seed: 12, bob: 3,
      draw: g => {
        surf = E('path', { d: '', fill: linGrad('#9BE6FB', '#1D84A6', true), stroke: '#0F5F7A', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-80,10 Q-60,0 -40,10 T0,10 M10,60 Q30,50 50,60 T90,60 M-90,70 Q-74,62 -58,70', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.28 }, g);
        bub = [0, 1, 2].map(i => E('circle', { r: 5 + i * 2, fill: 'none', stroke: '#E6FAFF', 'stroke-width': 2.5, opacity: 0.7 }, g));
        E('path', { d: 'M-108,-44 L108,-44', stroke: '#1E3A8A', 'stroke-width': 7 }, g);   // goggle strap
        [-30, 30].forEach(x => E('ellipse', { cx: x, cy: -46, rx: 24, ry: 15, fill: ball('#FFC56B', '#E07A10'), stroke: K, 'stroke-width': 3.5 }, g));
        E('path', { d: 'M-6,-46 L6,-46', stroke: K, 'stroke-width': 4 }, g);
      },
      face: { x: 0, y: 4, eye: 17, gap: 56, mouthW: 46, mouthY: 38, lidCol: '#5FC6E6' },
      upd: (t, g, st) => {
        const ph = st.still ? 0 : t * 1.6;
        let d = 'M-104,-62';
        for (let i = 1; i <= 8; i++) { const x = -104 + i * 26; d += ` Q${(x - 13).toFixed(1)},${(-62 + 9 * Math.sin(ph + i * 1.3) * (i % 2 ? 1 : -1)).toFixed(1)} ${x},-62`; }
        d += ' L104,84 Q104,102 86,102 L-86,102 Q-104,102 -104,84 Z';
        surf.setAttribute('d', d);
        bub.forEach((b, i) => { const f = ((t * 0.35 + i * 0.33) % 1); attr(b, 'cx', [-70, 74, 52][i] + 4 * Math.sin(t * 2 + i)); attr(b, 'cy', 90 - f * 140); op(b, 0.8 * Math.sin(f * Math.PI)); });
      },
    });
    return c;
  }
  if (kind === 'rosie') {
    const c = scMake(parent, {
      s: o.s, mood: o.mood || 'deadpan', seed: 15, bob: 2,
      draw: g => {
        E('path', { d: 'M90,-30 c14,6 -10,14 4,20 c14,6 -10,14 4,20 c14,6 -10,14 4,20', fill: 'none', stroke: '#1A1A1A', 'stroke-width': 3.5 }, g);   // earpiece cord
        E('rect', { x: -90, y: -100, width: 180, height: 200, rx: 16, fill: '#30353D', stroke: K, 'stroke-width': 5 }, g);
        E('rect', { x: -74, y: -84, width: 148, height: 168, rx: 8, fill: '#FF2E4D', opacity: 0.9 }, g);
        E('path', { d: 'M-62,-70 L-30,-70 M-62,-56 L-50,-56', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.45 }, g);
        E('rect', { x: -16, y: -112, width: 32, height: 16, rx: 4, fill: '#8F9CAB', stroke: K, 'stroke-width': 3 }, g);   // gel clip
        [-30, 30].forEach(x => E('rect', { x: x - 26, y: -96, width: 52, height: 24, rx: 9, fill: '#121418', stroke: K, 'stroke-width': 3 }, g));   // shades, pushed up
        E('path', { d: 'M-4,-86 L4,-86', stroke: K, 'stroke-width': 4 }, g);
        // arms folded, bouncer style
        E('path', { d: 'M-104,50 Q-40,90 56,62 L60,80 Q-40,110 -108,70 Z', fill: '#30353D', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M104,50 Q40,90 -56,62 L-60,80 Q40,110 108,70 Z', fill: '#3A4049', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
      },
      face: { x: 0, y: -18, eye: 17, gap: 54, mouthW: 42, mouthY: 38, lidCol: '#C81E3A' },
    });
    return c;
  }
  if (kind === 'violet' || kind === 'indigo' || kind === 'red' || kind === 'hue') {
    const name = kind === 'hue' ? (o.hue || 'green') : kind, col = LW_HUE[name] || o.hue, dk = LW_HUE_DK[name] || SC_INK;
    const mood = o.mood || { violet: 'happy', indigo: 'sad', red: 'smug' }[name] || 'neutral';
    const c = scMake(parent, {
      s: o.s, mood, seed: 20 + (Object.keys(LW_HUE).indexOf(name) + 1) * 3, bob: name === 'violet' ? 8 : name === 'indigo' ? 1 : 4,
      draw: g => {
        if (name === 'violet') {
          E('circle', { cx: 0, cy: -70, r: 24, fill: ball(col, dk), stroke: dk, 'stroke-width': 4 }, g);   // hair bun
          E('path', { d: 'M-16,-56 Q0,-48 16,-56', fill: 'none', stroke: '#FF6FB5', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        }
        E('circle', { r: 64, fill: ball(col, dk), stroke: dk, 'stroke-width': 5 }, g);
        if (name === 'indigo') {   // beanie
          E('path', { d: 'M-60,-24 Q-60,-82 0,-84 Q60,-82 60,-24 Z', fill: '#2B2C6E', stroke: K, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
          E('rect', { x: -64, y: -34, width: 128, height: 18, rx: 8, fill: '#3B3D8C', stroke: K, 'stroke-width': 3.5 }, g);
          E('circle', { cx: 0, cy: -88, r: 12, fill: '#7C7EE0', stroke: K, 'stroke-width': 3 }, g);
        }
        if (name === 'red') {      // shades on his head
          [-24, 24].forEach(x => E('rect', { x: x - 22, y: -60, width: 44, height: 20, rx: 8, fill: '#121418', stroke: K, 'stroke-width': 3 }, g));
          E('path', { d: 'M-2,-52 L2,-52', stroke: K, 'stroke-width': 4 }, g);
        }
        E('ellipse', { cx: -38, cy: 22, rx: 10, ry: 6, fill: '#FFFFFF', opacity: 0.25 }, g);
        E('ellipse', { cx: 38, cy: 22, rx: 10, ry: 6, fill: '#FFFFFF', opacity: 0.25 }, g);
      },
      face: { x: 0, y: name === 'indigo' ? 2 : -4, eye: 16, gap: 48, mouthW: 34, mouthY: 30, lidCol: dk },
    });
    if (name === 'violet') { const sp = spark(c.firstChild, 13); tr(sp, 48, -66); }
    return c;
  }
  return scMake(parent, { s: o.s, draw: g => E('circle', { r: 60, fill: '#888' }, g), face: { eye: 15, gap: 44, mouthW: 30, mouthY: 28 } });
}

/* Kavya with outfits; c.shirt and c.leaves are exposed for recolouring */
function lwKavya(parent, o) {
  const c = scKavya(parent, o), g = c.firstChild, shirt = g.children[0], vneck = g.children[1], eight = g.children[2];
  c.shirt = shirt; c.leaves = [];
  const outfit = o.outfit || 'pe';
  if (outfit === 'pe') return c;
  op(eight, 0);
  if (outfit === 'pyjamas') {
    shirt.setAttribute('fill', '#B79BE8'); vneck.setAttribute('stroke', '#EDE4FF');
    const dots = G(g); g.insertBefore(dots, vneck);
    [[-60, 110], [-30, 90], [36, 96], [66, 122], [-6, 124], [80, 92]].forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 6, fill: '#FFFFFF', opacity: 0.8 }, dots));
  } else if (outfit === 'swim') {
    shirt.setAttribute('fill', '#1E3A8A'); vneck.setAttribute('stroke', '#5EC4FF');
    const gg = G(g); tr(gg, 0, -88);
    E('path', { d: 'M-76,4 L76,4', stroke: '#E8424F', 'stroke-width': 7 }, gg);
    [-26, 26].forEach(x => E('ellipse', { cx: x, cy: 2, rx: 22, ry: 14, fill: ball('#9FE7FF', '#2A8FC4'), stroke: SC_INK, 'stroke-width': 3.5 }, gg));
    E('path', { d: 'M-4,2 L4,2', stroke: SC_INK, 'stroke-width': 4 }, gg);
  } else if (outfit === 'tree') {
    shirt.setAttribute('fill', '#3FA463'); vneck.setAttribute('stroke', '#2C7A47');
    const cr = G(g); tr(cr, 0, -112);
    [[-70, 18, -50], [-40, -8, -25], [0, -18, 0], [40, -8, 25], [70, 18, 50]].forEach(([x, y, r]) => {
      const lf = G(cr); tr(lf, x, y, 1, r);
      c.leaves.push(E('path', { d: 'M0,24 C-26,6 -22,-26 0,-40 C22,-26 26,6 0,24 Z', fill: '#4CD964', stroke: SC_INK, 'stroke-width': 3 }, lf));
      E('path', { d: 'M0,20 L0,-32', stroke: '#22844A', 'stroke-width': 2.5 }, lf);
    });
    [[-70, 100], [60, 116], [-20, 128]].forEach(([x, y]) => {
      const lf = G(g); g.insertBefore(lf, vneck); tr(lf, x, y, 0.7, x < 0 ? -30 : 30);
      c.leaves.push(E('path', { d: 'M0,24 C-26,6 -22,-26 0,-40 C22,-26 26,6 0,24 Z', fill: '#4CD964', stroke: SC_INK, 'stroke-width': 3 }, lf));
    });
  }
  return c;
}

/* ---------- sets ---------- */
function lwSpace(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#05060F', '#10142A', true) }, g);
  const r = rng(31); let d = '', d2 = '';
  for (let i = 0; i < 90; i++) { const x = r() * 1200, y = r() * 750, s = 0.8 + r() * 1.8; (i % 3 ? (d += `M${x.toFixed(0)},${y.toFixed(0)} m-${s},0 a${s},${s} 0 1,0 ${2 * s},0 a${s},${s} 0 1,0 -${2 * s},0 `) : (d2 += `M${x.toFixed(0)},${y.toFixed(0)} m-${s},0 a${s},${s} 0 1,0 ${2 * s},0 a${s},${s} 0 1,0 -${2 * s},0 `)); }
  E('path', { d, fill: '#FFFFFF', opacity: 0.6 }, g);
  const tw = E('path', { d: d2, fill: '#FFFFFF', opacity: 0.8 }, g);
  const s = sun(g, 110); tr(s, 150, 380);
  const earth = G(g); tr(earth, 1070, 380);
  E('circle', { r: 70, fill: glow('#7FC8FF'), opacity: 0.5 }, earth);
  E('circle', { r: 38, fill: ball('#4AA3F0', '#1B4E8C'), stroke: '#9FD8FF', 'stroke-width': 2 }, earth);
  E('path', { d: 'M-22,-14 Q-8,-24 6,-12 Q14,0 2,8 Q-12,6 -22,-14 Z M10,14 Q22,8 28,18 Q18,30 8,24 Z', fill: '#5BD27A', opacity: 0.9 }, earth);
  g.sunAt = [150, 380]; g.earthAt = [1070, 380];
  g.upd = t => { s.upd(t); attr(tw, 'opacity', 0.45 + 0.35 * Math.sin(t * 2.3)); };
  return g;
}

function lwBedroom(back, front) {
  const g = G(back);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F4E2C2', '#E2C79A', true) }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#B07A45' }, g);
  E('path', { d: 'M0,640 L1200,640 M0,690 L1200,690', stroke: '#8F5F33', 'stroke-width': 3, opacity: 0.6 }, g);
  E('rect', { x: 0, y: 590, width: 1200, height: 14, fill: '#E9DCC4' }, g);
  // window with HDB blocks outside
  const win = G(g); tr(win, 920, 270);
  E('rect', { x: -170, y: -160, width: 340, height: 300, fill: linGrad('#8ED3FF', '#D8F0FF', true), stroke: '#FFFFFF', 'stroke-width': 14 }, win);
  E('rect', { x: -150, y: -40, width: 110, height: 170, fill: '#E8E1D2', stroke: '#B8AE98', 'stroke-width': 3 }, win);
  E('rect', { x: 20, y: -80, width: 120, height: 210, fill: '#F0E6CF', stroke: '#B8AE98', 'stroke-width': 3 }, win);
  let wd = '';
  for (let r = 0; r < 6; r++) for (let k = 0; k < 3; k++) { wd += `M${-138 + k * 34},${-26 + r * 26} h20 v14 h-20 Z `; wd += `M${34 + k * 36},${-66 + r * 32} h22 v16 h-22 Z `; }
  E('path', { d: wd, fill: '#7FB6D9' }, win);
  E('line', { x1: 0, y1: -160, x2: 0, y2: 140, stroke: '#FFFFFF', 'stroke-width': 10 }, win);
  E('rect', { x: -190, y: 140, width: 380, height: 18, fill: '#FFFFFF', stroke: '#D8CCB4', 'stroke-width': 2 }, win);
  E('rect', { x: -200, y: -186, width: 400, height: 10, rx: 5, fill: '#8A6D35' }, win);   // curtain rail
  // translucent curtains: light gets through, scattered
  const curt = (side) => {
    const c = G(win), sx = side;
    E('path', { d: `M${-sx * 196},-180 L${-sx * 36},-180 Q${-sx * 30},0 ${-sx * 44},170 L${-sx * 200},170 Z`, fill: '#FFE9A8', opacity: 0.72, stroke: '#E8C76A', 'stroke-width': 3 }, c);
    E('path', { d: `M${-sx * 160},-176 Q${-sx * 150},0 ${-sx * 166},166 M${-sx * 120},-176 Q${-sx * 108},0 ${-sx * 126},166 M${-sx * 80},-176 Q${-sx * 68},0 ${-sx * 86},166`, fill: 'none', stroke: '#E8C76A', 'stroke-width': 3, opacity: 0.7 }, c);
    return c;
  };
  g.curtL = curt(1); g.curtR = curt(-1);
  g.curtains = p => { tr(g.curtL, -120 * clamp(p), 0); tr(g.curtR, 120 * clamp(p), 0); };
  // the sunbeam through the gap, onto the bed
  g.beam = E('path', { d: 'M890,120 L950,120 L600,560 L380,560 Z', fill: '#FFF3B0', opacity: 0.35 }, g);
  g.setBeam = p => op(g.beam, 0.35 * clamp(p));
  // desk + lamp (right)
  E('rect', { x: 960, y: 500, width: 220, height: 20, fill: '#9C6B3E', stroke: '#6B4423', 'stroke-width': 3 }, g);
  E('rect', { x: 975, y: 520, width: 16, height: 80, fill: '#6B4423' }, g); E('rect', { x: 1150, y: 520, width: 16, height: 80, fill: '#6B4423' }, g);
  const lamp = G(g); tr(lamp, 1080, 500);
  E('rect', { x: -40, y: -10, width: 80, height: 12, rx: 5, fill: '#3B4A57' }, lamp);
  E('path', { d: 'M0,-8 L-30,-90 L10,-130', fill: 'none', stroke: '#3B4A57', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lamp);
  E('path', { d: 'M-14,-148 L40,-120 L22,-96 Z', fill: '#FF9466', stroke: '#C2453A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, lamp);
  g.lampAt = [1104, 600 - 122];
  // poster
  E('rect', { x: 600, y: 120, width: 110, height: 150, rx: 6, fill: '#3F5BD9', stroke: '#FFFFFF', 'stroke-width': 5 }, g);
  E('circle', { cx: 655, cy: 170, r: 26, fill: '#FFE45C' }, g); E('path', { d: 'M615,250 L655,200 L695,250 Z', fill: '#5BD27A' }, g);
  g.wall = { x: 140, y: 120, w: 420, h: 300 };
  // bed (back part)
  E('rect', { x: 40, y: 380, width: 40, height: 230, rx: 10, fill: '#8A5A3A', stroke: '#5E3B22', 'stroke-width': 4 }, g);
  E('rect', { x: 70, y: 520, width: 560, height: 90, rx: 14, fill: '#F2F2F2', stroke: '#C8C8C8', 'stroke-width': 3 }, g);
  E('ellipse', { cx: 180, cy: 520, rx: 90, ry: 34, fill: '#FFFFFF', stroke: '#C8C8C8', 'stroke-width': 3 }, g);
  // blanket (front layer): covers Kavya sitting up in bed
  const fr = G(front || back);
  g.blanket = G(fr);
  E('path', { d: 'M90,560 Q260,520 420,540 Q560,548 640,560 L640,640 Q360,660 80,640 Z', fill: '#2E5FB8', stroke: '#1E3E7A', 'stroke-width': 4 }, g.blanket);
  const st = rng(9); let sd = '';
  for (let i = 0; i < 14; i++) { const x = 120 + st() * 500, y = 570 + st() * 60; sd += `M${x.toFixed(0)},${(y - 7).toFixed(0)} L${(x + 2).toFixed(0)},${(y - 2).toFixed(0)} L${(x + 7).toFixed(0)},${y.toFixed(0)} L${(x + 2).toFixed(0)},${(y + 2).toFixed(0)} L${x.toFixed(0)},${(y + 7).toFixed(0)} L${(x - 2).toFixed(0)},${(y + 2).toFixed(0)} L${(x - 7).toFixed(0)},${y.toFixed(0)} L${(x - 2).toFixed(0)},${(y - 2).toFixed(0)} Z `; }
  E('path', { d: sd, fill: '#FFE45C', opacity: 0.85 }, g.blanket);
  const dark = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#070B1A' }, fr);
  g.dark = p => op(dark, 0.82 * clamp(p));
  g.dark(0);
  return g;
}

function lwBathroom(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#DDEFF2' }, g);
  let d = '';
  for (let x = 0; x <= 1200; x += 80) d += `M${x},0 L${x},560 `;
  for (let y = 0; y <= 560; y += 80) d += `M0,${y} L1200,${y} `;
  E('path', { d, stroke: '#B9D6DC', 'stroke-width': 3 }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#E9E4DA' }, g);
  E('rect', { x: 120, y: 560, width: 960, height: 40, rx: 8, fill: '#FFFFFF', stroke: '#B8C4CC', 'stroke-width': 3 }, g);
  E('rect', { x: 140, y: 600, width: 920, height: 150, fill: '#C9B497', stroke: '#9C8A70', 'stroke-width': 3 }, g);
  E('path', { d: 'M600,600 L600,750', stroke: '#9C8A70', 'stroke-width': 3 }, g);
  E('ellipse', { cx: 600, cy: 572, rx: 120, ry: 14, fill: '#EEF3F6', stroke: '#B8C4CC', 'stroke-width': 3 }, g);
  E('path', { d: 'M600,560 L600,520 Q600,504 620,504 L650,504', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
  // toothbrush cup
  E('rect', { x: 250, y: 500, width: 46, height: 60, rx: 8, fill: '#7FD8F5', stroke: '#1D84A6', 'stroke-width': 3 }, g);
  E('path', { d: 'M262,500 L254,452 M284,500 L294,448', stroke: '#FF6FB5', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  // towel rail + rough towel
  E('rect', { x: 960, y: 230, width: 180, height: 10, rx: 5, fill: '#9AA6B2' }, g);
  const towel = G(g); tr(towel, 1050, 240);
  const rr = rng(4); let tp = 'M-70,0 L70,0 ';
  for (let y = 0; y <= 220; y += 10) tp += `L${(70 + rr() * 6 - 3).toFixed(1)},${y} `;
  for (let x = 70; x >= -70; x -= 10) tp += `L${x},${(220 + rr() * 8).toFixed(1)} `;
  for (let y = 220; y >= 0; y -= 10) tp += `L${(-70 + rr() * 6 - 3).toFixed(1)},${y} `;
  E('path', { d: tp + 'Z', fill: '#FF9F80', stroke: '#C8603E', 'stroke-width': 3, 'stroke-linejoin': 'round' }, towel);
  E('path', { d: 'M-70,180 L70,180 M-70,196 L70,196', stroke: '#FFFFFF', 'stroke-width': 5, opacity: 0.7 }, towel);
  g.towelAt = [1050, 350]; g.mirrorAt = [600, 300];
  return g;
}

function lwPool(back, front) {
  const g = G(back);
  E('rect', { x: 0, y: 0, width: 1200, height: 380, fill: linGrad('#5EC4FF', '#CDEFFF', true) }, g);
  const s = sun(g, 46); tr(s, 1080, 90); g.sunG = s;
  [[60, 120, 150, 240], [250, 70, 130, 290], [880, 110, 140, 250]].forEach(([x, y, w, h]) => {
    E('rect', { x, y, width: w, height: h, fill: '#EDE5D3', stroke: '#B8AE98', 'stroke-width': 3 }, g);
    let wd = ''; for (let yy = y + 16; yy < y + h - 20; yy += 26) for (let xx = x + 14; xx < x + w - 20; xx += 30) wd += `M${xx},${yy} h18 v12 h-18 Z `;
    E('path', { d: wd, fill: '#8CBFDF' }, g);
  });
  E('rect', { x: 0, y: 330, width: 1200, height: 50, fill: '#D9D2C2' }, g);                     // deck
  E('rect', { x: 0, y: 380, width: 1200, height: 370, fill: '#E9F5F9' }, g);                    // pool walls behind the water
  let tl = '';
  for (let x = 0; x <= 1200; x += 60) tl += `M${x},380 L${x},750 `;
  for (let y = 440; y <= 750; y += 60) tl += `M0,${y} L1200,${y} `;
  E('path', { d: tl, stroke: '#B7DCE8', 'stroke-width': 3 }, g);
  E('rect', { x: 0, y: 700, width: 1200, height: 50, fill: '#5C9DB8' }, g);                     // pool floor
  E('path', { d: 'M0,725 L1200,725', stroke: '#1E5F7A', 'stroke-width': 10, 'stroke-dasharray': '120 60' }, g);   // lane line on the floor
  // the water (front)
  const fr = G(front || back);
  const water = E('path', { d: '', fill: linGrad('#4CC9F0', '#1D84A6', true), opacity: 0.55 }, fr);
  const surf = E('path', { d: '', fill: 'none', stroke: '#E6FAFF', 'stroke-width': 5, opacity: 0.9 }, fr);
  const rope = G(fr); for (let x = 20; x < 1200; x += 40) E('circle', { cx: x, cy: 380, r: 10, fill: (x / 40) % 2 < 1 ? '#E8424F' : '#FFFFFF', stroke: '#8A2A30', 'stroke-width': 2 }, rope);
  g.waterY = 380; g.floorY = 700; g.water = water; g.rope = rope;
  g.upd = t => {
    let d = 'M0,380';
    for (let x = 40; x <= 1200; x += 40) d += ` L${x},${(380 + 4 * Math.sin(t * 2 + x * 0.03)).toFixed(1)}`;
    surf.setAttribute('d', d); water.setAttribute('d', d + ' L1200,750 L0,750 Z');
    tr(rope, 0, 3 * Math.sin(t * 1.5));
  };
  g.upd(0);
  return g;
}

function lwStorm(parent) {
  const g = G(parent);
  const sky = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A3242', '#4E5A6C', true) }, g);
  const flashR = E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#DCE6FF' }, g);
  [[80, 220, 200, 530], [330, 160, 180, 590], [760, 240, 190, 510], [990, 190, 170, 560]].forEach(([x, y, w, h]) => {
    E('rect', { x, y, width: w, height: h, fill: '#5E6676', stroke: '#3B4250', 'stroke-width': 3 }, g);
    let wd = '', lit = ''; const r = rng(x);
    for (let yy = y + 18; yy < y + h - 20; yy += 30) for (let xx = x + 14; xx < x + w - 20; xx += 32) { const p = `M${xx},${yy} h20 v14 h-20 Z `; if (r() < 0.3) lit += p; else wd += p; }
    E('path', { d: wd, fill: '#3E4656' }, g); E('path', { d: lit, fill: '#FFD98A' }, g);
  });
  const bolt = E('path', { d: 'M640,0 L600,150 L650,150 L590,330 L700,130 L645,130 L690,0 Z', fill: '#FFF7C2', stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  const rain = E('path', { d: '', stroke: '#BFD3E6', 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }, g);
  const r = rng(51), drops = []; for (let i = 0; i < 90; i++) drops.push([r() * 1260, r() * 750]);
  // window frame in front: we are looking out of the flat
  E('path', { d: 'M0,0 L1200,0 L1200,750 L0,750 Z M40,40 L40,710 L1160,710 L1160,40 Z', fill: '#E9E2D0', 'fill-rule': 'evenodd' }, g);
  E('rect', { x: 592, y: 40, width: 16, height: 670, fill: '#E9E2D0' }, g);
  g.upd = (t, amt, fl) => {
    amt = amt === undefined ? 1 : amt; fl = fl || 0;
    op(flashR, 0.7 * fl); op(bolt, fl > 0.05 ? 1 : 0);
    let d = '';
    if (amt > 0.01) for (const [x, y] of drops) { const yy = (y + t * 900) % 790 - 20, xx = (x - t * 150 + 1260 * 4) % 1260 - 30; d += `M${xx.toFixed(0)},${yy.toFixed(0)} l-8,26 `; }
    rain.setAttribute('d', d || 'M0,0'); op(rain, 0.55 * amt);
  };
  g.upd(0, 1, 0);
  return g;
}

function lwLivingRoom(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F6EEDF', '#E7D7BC', true) }, g);
  E('rect', { x: 0, y: 610, width: 1200, height: 140, fill: '#C9A27A' }, g);
  const win = G(g); tr(win, 980, 300);
  E('rect', { x: -170, y: -200, width: 340, height: 380, fill: linGrad('#9FDBFF', '#E6F7FF', true), stroke: '#FFFFFF', 'stroke-width': 14 }, win);
  const sn = sun(win, 40); tr(sn, 90, -120);
  const rr = rng(12); let dd = '';
  for (let i = 0; i < 22; i++) { const x = -150 + rr() * 300, y = -180 + rr() * 340; dd += `M${x.toFixed(0)},${y.toFixed(0)} q4,8 0,12 q-4,-4 0,-12 Z `; }
  E('path', { d: dd, fill: '#FFFFFF', opacity: 0.75, stroke: '#9FC6DE', 'stroke-width': 1.5 }, win);
  E('line', { x1: 0, y1: -200, x2: 0, y2: 180, stroke: '#FFFFFF', 'stroke-width': 10 }, win);
  // hanging prism on a string
  const pr = G(g); tr(pr, 840, 300);
  E('line', { x1: 0, y1: -220, x2: 0, y2: -40, stroke: '#7A6A50', 'stroke-width': 2.5 }, pr);
  const pm = lwPrism(pr, 92, { fill: 'rgba(170,210,240,0.5)', stroke: '#6F8FA8' }); tr(pm, 0, 0);
  g.prismAt = [840, 300];
  // sofa + plant
  E('rect', { x: 120, y: 470, width: 420, height: 150, rx: 30, fill: '#C2453A', stroke: '#7A2A22', 'stroke-width': 4 }, g);
  E('rect', { x: 100, y: 500, width: 60, height: 120, rx: 20, fill: '#A8382F', stroke: '#7A2A22', 'stroke-width': 4 }, g);
  E('rect', { x: 500, y: 500, width: 60, height: 120, rx: 20, fill: '#A8382F', stroke: '#7A2A22', 'stroke-width': 4 }, g);
  E('path', { d: 'M640,610 L660,540 L720,540 L740,610 Z', fill: '#B07A45', stroke: '#6B4423', 'stroke-width': 3 }, g);
  [[-40, -70], [-10, -100], [20, -80], [40, -50], [-30, -40]].forEach(([x, y], i) => { const l = leaf(g, 0.38, { color: C.plant }); tr(l, 690, 545, 1, -90 + x * 1.4); });
  g.wall = { x: 60, y: 110, w: 560, h: 330 };
  return g;
}

function lwHall(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#141018', '#2A2030', true) }, g);
  E('rect', { x: 60, y: 150, width: 1080, height: 420, fill: '#2E2A3A' }, g);                     // backdrop
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: linGrad('#9C6B3E', '#6B4423', true) }, g);   // stage floor
  let fl = ''; for (let x = 0; x <= 1200; x += 90) fl += `M${x},560 L${x + (x - 600) * 0.4},750 `;
  E('path', { d: fl, stroke: '#5A3A20', 'stroke-width': 3, opacity: 0.6 }, g);
  [-1, 1].forEach(sd => {   // red curtains
    const x0 = sd < 0 ? 0 : 1200;
    E('path', { d: `M${x0},110 L${x0 + sd * -170},110 Q${x0 + sd * -120},350 ${x0 + sd * -190},600 L${x0},600 Z`, fill: '#9E1F2E', stroke: '#5E0F18', 'stroke-width': 4 }, g);
    E('path', { d: `M${x0 + sd * -50},116 Q${x0 + sd * -30},350 ${x0 + sd * -60},596 M${x0 + sd * -110},116 Q${x0 + sd * -80},350 ${x0 + sd * -120},596`, fill: 'none', stroke: '#6E1420', 'stroke-width': 4 }, g);
  });
  E('rect', { x: 0, y: 100, width: 1200, height: 22, fill: '#3B4250' }, g);   // lighting bar
  g.spots = [[320, 140], [600, 140], [880, 140]];
  // cardboard trees (Kavya is Tree Number Three)
  [[230, 470], [980, 480]].forEach(([x, y]) => {
    E('rect', { x: x - 10, y, width: 20, height: 90, fill: '#8A5A3A' }, g);
    E('path', { d: `M${x},${y - 150} C${x + 90},${y - 140} ${x + 90},${y} ${x},${y + 10} C${x - 90},${y} ${x - 90},${y - 140} ${x},${y - 150} Z`, fill: '#3FA463', stroke: '#1F6B3A', 'stroke-width': 4 }, g);
  });
  // audience heads in the dark
  const r = rng(3); let hd = '';
  for (let i = 0; i < 16; i++) { const x = 40 + i * 74 + r() * 20, y = 712 + r() * 14; hd += `M${x - 26},${y + 40} Q${x - 26},${y - 30} ${x},${y - 30} Q${x + 26},${y - 30} ${x + 26},${y + 40} Z `; }
  E('path', { d: hd, fill: '#0B080E' }, g);
  return g;
}

/* ---------- props ---------- */
function lwSpot(parent, colour) {
  const g = G(parent);
  const cone = E('path', { d: 'M-34,26 L34,26 L190,430 L-190,430 Z', fill: colour || '#FFF7C2', opacity: 0.22 }, g);
  const pool = E('ellipse', { cx: 0, cy: 430, rx: 190, ry: 34, fill: colour || '#FFF7C2', opacity: 0.25 }, g);
  E('rect', { x: -30, y: -40, width: 60, height: 70, rx: 10, fill: '#2B2F36', stroke: '#11141A', 'stroke-width': 3 }, g);
  E('path', { d: 'M-40,-30 L-40,-50 L40,-50 L40,-30', fill: 'none', stroke: '#8F9CAB', 'stroke-width': 4 }, g);
  const lensC = E('ellipse', { cx: 0, cy: 28, rx: 30, ry: 8, fill: colour || '#FFF7C2' }, g);
  g.set = (on, col) => {
    if (col) [cone, pool, lensC].forEach(e => e.setAttribute('fill', col));
    op(cone, 0.22 * clamp(on)); op(pool, 0.25 * clamp(on)); attr(lensC, 'opacity', 0.25 + 0.75 * clamp(on));
  };
  return g;
}
function lwTorch(parent) {
  const g = G(parent);
  const beam = E('path', { d: 'M0,-40 L-170,-330 L170,-330 Z', fill: glow('#FFFBE0'), opacity: 0.7 }, g);
  E('rect', { x: -34, y: -40, width: 68, height: 130, rx: 12, fill: '#2B2F36', stroke: '#11141A', 'stroke-width': 3 }, g);
  E('rect', { x: -26, y: -30, width: 52, height: 100, rx: 6, fill: '#3E4E66' }, g);
  const led = E('circle', { cx: 18, cy: -30, r: 7, fill: '#FFFBE0' }, g);
  g.set = on => { op(beam, 0.7 * clamp(on)); attr(led, 'opacity', 0.3 + 0.7 * clamp(on)); };
  return g;
}
function lwHandDino(parent) {
  const g = G(parent);
  E('path', { d: 'M-110,30 Q-120,-10 -80,-30 Q-40,-60 10,-56 Q60,-58 100,-34 Q118,-22 104,-8 L70,-6 L86,8 L60,12 Q30,14 10,10 Q0,40 -10,70 L-40,70 Q-46,40 -60,30 Z M30,-42 a6,6 0 1,0 0.1,0 Z', fill: '#141018', 'fill-rule': 'evenodd' }, g);
  return g;
}
function lwMoon(parent, r) {
  r = r || 60; const g = G(parent);
  E('circle', { r: r * 2, fill: glow('#E9EEF5'), opacity: 0.35 }, g);
  E('circle', { r, fill: ball('#F2F4F7', '#A9B5C0'), stroke: '#8F9CAB', 'stroke-width': 3 }, g);
  [[-0.3, -0.25, 0.18], [0.28, 0.1, 0.24], [-0.1, 0.38, 0.12], [0.35, -0.4, 0.1]].forEach(([x, y, s]) => E('circle', { cx: x * r, cy: y * r, r: s * r, fill: '#B9C4CE', opacity: 0.8 }, g));
  return g;
}
function lwApple(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  const body = E('path', { d: 'M0,-34 C30,-56 64,-30 56,8 C50,44 22,60 0,48 C-22,60 -50,44 -56,8 C-64,-30 -30,-56 0,-34 Z', fill: '#E8282F', stroke: SC_INK, 'stroke-width': 4 }, g);
  const shine = E('path', { d: 'M-34,-18 Q-40,4 -30,20', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.5, 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M0,-34 Q2,-52 8,-60', fill: 'none', stroke: '#6B4423', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);
  E('path', { d: 'M8,-50 Q28,-66 40,-52 Q24,-40 8,-50 Z', fill: '#4CD964', stroke: SC_INK, 'stroke-width': 2.5 }, g);
  g.paint = col => { body.setAttribute('fill', col); op(shine, col === '#111111' || col === '#000000' ? 0.15 : 0.5); };
  return g;
}
function lwBook(parent, colour) {
  const g = G(parent);
  E('rect', { x: -60, y: -80, width: 120, height: 160, rx: 6, fill: colour || '#3B82F6', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: -60, y: -80, width: 18, height: 160, fill: '#000000', opacity: 0.18 }, g);
  E('rect', { x: -30, y: -50, width: 72, height: 28, rx: 4, fill: '#FFFFFF', opacity: 0.85 }, g);
  return g;
}
function lwList(parent) {
  const g = scClipboard(parent, 1.2);
  T(g, 0, -54, 'THE LIST', { size: 20, weight: 800, anchor: 'middle', fill: SC_INK });
  [['RED', '#E8282F', true], ['GREEN', '#22844A', false], ['BLUE', '#1D4FB0', false]].forEach(([n, c, ok], i) => {
    T(g, -46, -20 + i * 32, n, { size: 20, weight: 800, fill: c });
    const m = ok ? tick(g, 9, '#22844A') : cross(g, 8, '#E8282F'); tr(m, 36, -27 + i * 32);
  });
  return g;
}
function lwTipJar(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M-40,-50 L40,-50 L46,50 Q46,60 36,60 L-36,60 Q-46,60 -46,50 Z', fill: '#DDF3FF', opacity: 0.6, stroke: '#9FC6DE', 'stroke-width': 4 }, g);
  E('rect', { x: -44, y: -62, width: 88, height: 14, rx: 5, fill: '#9AA6B2', stroke: SC_INK, 'stroke-width': 2.5 }, g);
  E('rect', { x: -34, y: -14, width: 68, height: 32, rx: 4, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, g);
  T(g, 0, 10, 'TIPS', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
  return g;
}
function lwRainbow(parent, r, w) {
  const g = G(parent), bw = w / 7;
  LW_SPECTRUM.forEach((h, i) => { const rr = r - bw * (i + 0.5); E('path', { d: `M${-rr},0 A${rr},${rr} 0 0 1 ${rr},0`, fill: 'none', stroke: h.color, 'stroke-width': bw + 0.6, opacity: 0.85 }, g); });
  return g;
}
function lwRGB(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -230, y: -220, width: 460, height: 440, rx: 24, fill: '#0B0B10' }, g);
  const R = 105, P3 = [[0, -62], [-70, 52], [70, 52]], cols = ['#FF0000', '#00FF00', '#0000FF'];
  const circles = P3.map((p, i) => E('circle', { cx: p[0], cy: p[1], r: R, fill: cols[i] }, G(g, { style: 'mix-blend-mode:screen' })));
  g.set = p => circles.forEach((c, i) => op(c.parentNode, clamp(p * 3 - i)));
  g.at = P3;
  return g;
}
function lwPixels(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('rect', { x: -170, y: -120, width: 340, height: 240, rx: 14, fill: '#0B0B10', stroke: '#3A4B5C', 'stroke-width': 4 }, g);
  const subs = [];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) ['#FF2020', '#20E040', '#2060FF'].forEach((c, j) => {
    const el = E('rect', { x: -150 + k * 78 + j * 24, y: -100 + r * 70, width: 18, height: 56, rx: 4, fill: c }, g); subs.push({ el, j });
  });
  const MIX = { red: [1, 0, 0], green: [0, 1, 0], blue: [0, 0, 1], yellow: [1, 1, 0], cyan: [0, 1, 1], magenta: [1, 0, 1], white: [1, 1, 1], black: [0, 0, 0] };
  g.set = name => { const m = MIX[name] || MIX.white; subs.forEach(({ el, j }) => attr(el, 'opacity', 0.12 + 0.88 * m[j])); };
  g.set('white');
  return g;
}

/* ---------- optics (from lessons/light/lib.js, lw-prefixed) ---------- */
const LW_OPT = {
  ray: C.energy, white: C.ink, normal: C.muted, angI: C.glucose, angR: C.water,
  mirror: '#DCE6EE', hatch: C.faint,
  glassFill: 'rgba(200,230,250,0.16)', glassStroke: '#CFE7F5', waterFill: 'rgba(76,201,240,0.30)',
  nAir: 1, nWater: 1.33, nGlass: 1.5, nDiamond: 2.42,
};
/* spectrum colours, least bent (red) to most bent (violet); n is an EXAGGERATED index for a visible fan */
const LW_SPECTRUM = [
  { name: 'red', color: '#FF4D4D', n: 1.47 }, { name: 'orange', color: '#FF9A3C', n: 1.49 },
  { name: 'yellow', color: '#FFE45C', n: 1.51 }, { name: 'green', color: '#4CD964', n: 1.535 },
  { name: 'blue', color: '#3B82F6', n: 1.56 }, { name: 'indigo', color: '#5B5BD6', n: 1.595 },
  { name: 'violet', color: '#A066FF', n: 1.63 },
];

/* ---------- geometry (screen degrees, y down) ---------- */
function lwDir(deg) { const a = deg * Math.PI / 180; return [Math.cos(a), Math.sin(a)]; }
function lwAng(v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; }
/* the point len away from (x, y) in direction deg */
function lwPt(x, y, deg, len) { const d = lwDir(deg); return [x + d[0] * len, y + d[1] * len]; }
/* Snell's law: angle of refraction (deg) for angle of incidence i (deg) going from index n1 into n2;
   null when there is none (total internal reflection) */
function lwSnell(i, n1, n2) { const s = n1 / n2 * Math.sin(i * Math.PI / 180); return Math.abs(s) > 1 ? null : Math.asin(s) * 180 / Math.PI; }
/* critical angle (deg) going from the denser n1 into n2 (glass to air: 41.8°) */
function lwCritical(n1, n2) { return Math.asin((n2 || 1) / n1) * 180 / Math.PI; }
function lwUnit(v) { const L = Math.hypot(v[0], v[1]) || 1; return [v[0] / L, v[1] / L]; }
/* direction d reflected by a surface with normal nrm (either sign) */
function lwReflectVec(d, nrm) { d = lwUnit(d); nrm = lwUnit(nrm); const k = 2 * (d[0] * nrm[0] + d[1] * nrm[1]); return [d[0] - k * nrm[0], d[1] - k * nrm[1]]; }
/* direction d refracted crossing a surface with normal nrm (either sign) from index n1 into n2; null = TIR */
function lwRefractVec(d, nrm, n1, n2) {
  d = lwUnit(d); nrm = lwUnit(nrm);
  let c = -(d[0] * nrm[0] + d[1] * nrm[1]);
  if (c < 0) { nrm = [-nrm[0], -nrm[1]]; c = -c; }
  const eta = n1 / n2, k = 1 - eta * eta * (1 - c * c);
  if (k < 0) return null;
  const m = eta * c - Math.sqrt(k);
  return [eta * d[0] + m * nrm[0], eta * d[1] + m * nrm[1]];
}
/* Reflection at (x, y). normalDeg: the normal, pointing out of the mirror towards the light.
   theta: angle of incidence from that normal; its sign picks the side the light comes from
   (the ray starts in direction normalDeg + theta). Returns { a: start, o: hit point, b: end, i, r } with i = r. */
function lwBounce(x, y, normalDeg, theta, lenIn, lenOut) {
  if (lenOut === undefined) lenOut = lenIn;
  return { a: lwPt(x, y, normalDeg + theta, lenIn), o: [x, y], b: lwPt(x, y, normalDeg - theta, lenOut), i: Math.abs(theta), r: Math.abs(theta), tir: false };
}
/* Refraction at (x, y) from index n1 (the side normalDeg points into, where the light comes from) into n2.
   theta as for lwBounce. b continues on the far side at the angle of refraction r (towards the normal when
   n2 > n1). If there is no refracted ray (n1 > n2 beyond the critical angle) the light is totally internally
   reflected: tir = true and b is the reflected end. part: the weak partial reflection's end (non-TIR). */
function lwBend(x, y, normalDeg, theta, n1, n2, lenIn, lenOut) {
  if (lenOut === undefined) lenOut = lenIn;
  const i = Math.abs(theta), r = lwSnell(i, n1, n2), s = theta < 0 ? -1 : 1, a = lwPt(x, y, normalDeg + theta, lenIn);
  if (r === null) return { a, o: [x, y], b: lwPt(x, y, normalDeg - theta, lenOut), i, r: i, tir: true };
  return { a, o: [x, y], b: lwPt(x, y, normalDeg + 180 + s * r, lenOut), i, r, tir: false, part: lwPt(x, y, normalDeg - theta, lenOut) };
}

/* ---------- rays ---------- */
/* A ray along the polyline pts [[x, y], ...] in the parent's coordinates, with an arrowhead part-way along
   each segment pointing the way the light travels. g.set(p) draws it from the source (0..1); g.pts(pts)
   re-routes it (sweeping rays); g.len is its length. o: color (LW_OPT.ray), width (6), glow (soft halo, true),
   heads (true | false | array of segment indexes), at (head position along a segment, 0.55), head (size),
   dash ('10 8' for a dashed virtual ray), opacity. */
function lwRayPath(parent, pts, o) {
  o = o || {};
  const col = o.color || LW_OPT.ray, w = o.width || 6, hs = o.head || Math.max(14, w * 2.6), at = o.at === undefined ? 0.55 : o.at;
  const g = G(parent, o.opacity !== undefined ? { opacity: o.opacity } : {});
  const halo = o.glow === false ? null : E('path', { fill: 'none', stroke: col, 'stroke-width': w * 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.16 }, g);
  const line = E('path', { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || 'none' }, g);
  const hg = G(g);
  let P = [], segs = [], heads = [], prog = 1;
  const build = () => {
    segs = []; g.len = 0;
    for (let k = 1; k < P.length; k++) { const l = Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); segs.push({ a: P[k - 1], b: P[k], l, s0: g.len }); g.len += l; }
    while (heads.length < segs.length) heads.push(E('path', { d: `M0,0 L${-hs},${-hs * 0.62} L${-hs * 0.72},0 L${-hs},${hs * 0.62} Z`, fill: col }, hg));
    heads.forEach((h, k) => {
      const sg = segs[k], want = sg && sg.l > hs * 2 && (o.heads === undefined || o.heads === true || (Array.isArray(o.heads) && o.heads.indexOf(k) >= 0));
      h.style.display = want ? '' : 'none'; h.want = !!want;
      if (want) { const ang = Math.atan2(sg.b[1] - sg.a[1], sg.b[0] - sg.a[0]) * 180 / Math.PI, f = at + hs * 0.5 / sg.l;
        h.f = (sg.s0 + f * sg.l) / (g.len || 1);
        h.setAttribute('transform', `translate(${lerp(sg.a[0], sg.b[0], f).toFixed(1)} ${lerp(sg.a[1], sg.b[1], f).toFixed(1)}) rotate(${ang.toFixed(2)})`); }
    });
  };
  g.set = p => {
    prog = clamp(p);
    const stop = prog * g.len; let d = '';
    for (const sg of segs) {
      if (sg.s0 > stop) break;
      const f = Math.min(1, (stop - sg.s0) / (sg.l || 1)), e = [lerp(sg.a[0], sg.b[0], f), lerp(sg.a[1], sg.b[1], f)];
      d += (d ? '' : `M${sg.a[0].toFixed(1)},${sg.a[1].toFixed(1)}`) + ` L${e[0].toFixed(1)},${e[1].toFixed(1)}`;
    }
    line.setAttribute('d', d || 'M0,0'); line.style.display = d ? '' : 'none';
    if (halo) { halo.setAttribute('d', d || 'M0,0'); halo.style.display = d ? '' : 'none'; }
    heads.forEach(h => { if (h.want) op(h, clamp((prog - h.f) * (g.len || 1) / 30 + 1)); });
  };
  g.pts = pts2 => { P = pts2.map(q => [q[0], q[1]]); build(); g.set(prog); };
  g.color = c => { line.setAttribute('stroke', c); if (halo) halo.setAttribute('stroke', c); heads.forEach(h => h.setAttribute('fill', c)); };
  g.pts(pts);
  return g;
}
/* a single straight ray from (x1, y1) to (x2, y2): lwRayPath with two points */
function lwLightRay(parent, x1, y1, x2, y2, o) { return lwRayPath(parent, [[x1, y1], [x2, y2]], o); }

/* ---------- the normal ---------- */
/* Dashed normal through (x, y) along direction deg (the side the light is on), len long, plus o.back on the
   far side (default len; 0 for a mirror). o.square: draw the 90° box against the surface (true or a size);
   o.label: text placed beyond the end ('normal'); o.color, o.width. g.set(p) grows it out from the point. */
function lwNormal(parent, x, y, deg, len, o) {
  o = o || {};
  const g = G(parent), col = o.color || LW_OPT.normal, back = o.back === undefined ? len : o.back;
  const ln = E('line', { x1: x, y1: y, x2: x, y2: y, stroke: col, 'stroke-width': o.width || 3, 'stroke-dasharray': o.dash || '10 8', 'stroke-linecap': 'round' }, g);
  let sq = null, lab = null;
  if (o.square) {
    const s = o.square === true ? 18 : o.square, n = lwDir(deg), t = [-n[1], n[0]];
    sq = E('path', { d: `M${x + n[0] * s},${y + n[1] * s} L${x + (n[0] + t[0]) * s},${y + (n[1] + t[1]) * s} L${x + t[0] * s},${y + t[1] * s}`, fill: 'none', stroke: col, 'stroke-width': 2.5 }, g);
  }
  if (o.label) { const p = lwPt(x, y, deg, len + (o.labelGap || 34)); lab = T(g, p[0], p[1] + 9, o.label, { size: o.size || 26, weight: 600, fill: col, anchor: 'middle' }); }
  g.set = p => {
    p = clamp(p); const a = lwPt(x, y, deg, len * p), b = lwPt(x, y, deg + 180, back * p);
    attr(ln, 'x1', b[0]); attr(ln, 'y1', b[1]); attr(ln, 'x2', a[0]); attr(ln, 'y2', a[1]);
    if (sq) op(sq, clamp(p * 3 - 2)); if (lab) op(lab, clamp(p * 3 - 2));
  };
  g.set(1);
  return g;
}

/* ---------- angle arcs ---------- */
/* Arc of radius r centred on (x, y) from screen angle a0 to a1 (deg), e.g. from the normal to a ray, with a
   pale wedge and a label on its middle line. o.text: label, where '{deg}' becomes the arc's size in whole
   degrees (e.g. 'i = {deg}°'); o.color (LW_OPT.angI), o.width (4), o.size (28), o.wedge (fill opacity, 0.18).
   The label is pushed out along the middle line until it clears both edges of the angle (so it never sits on
   the ray or the normal), between r + 30 and r + 140; o.lr fixes the distance instead.
   g.set(p) sweeps it open from a0 (0..1); g.to(x, y, a0, a1) re-aims it. */
function lwArc(parent, x, y, a0, a1, r, o) {
  o = o || {};
  const g = G(parent), col = o.color || LW_OPT.angI;
  const wedge = E('path', { fill: col, opacity: o.wedge === undefined ? 0.18 : o.wedge }, g);
  const arc = E('path', { fill: 'none', stroke: col, 'stroke-width': o.width || 4, 'stroke-linecap': 'round' }, g);
  const lab = o.text ? T(g, 0, 0, '', { size: o.size || 28, weight: 700, fill: col, anchor: 'middle' }) : null;
  let cx = x, cy = y, A0 = a0, A1 = a1, prog = 1;
  const draw = () => {
    const e = A0 + (A1 - A0) * prog, p0 = lwPt(cx, cy, A0, r), p1 = lwPt(cx, cy, e, r);
    const big = Math.abs(e - A0) > 180 ? 1 : 0, sw = e > A0 ? 1 : 0;
    const d = `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${big} ${sw} ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`;
    arc.setAttribute('d', d); wedge.setAttribute('d', `M${cx},${cy} L${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${r},${r} 0 ${big} ${sw} ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`);
    op(arc, prog > 0.001 ? 1 : 0); op(wedge, prog > 0.001 ? 1 : 0);
    if (lab) {
      const size = o.size || 28, str = o.text.replace('{deg}', Math.round(Math.abs(A1 - A0))), half = Math.abs(A1 - A0) * Math.PI / 360;
      const u = lwDir((A0 + A1) / 2), tw = textWidth(str, size, FD, 700);
      const need = (Math.abs(u[1]) * tw / 2 + Math.abs(u[0]) * size * 0.45 + 16) / Math.max(0.05, Math.sin(half));   // 16: clear the ray's glow too
      const d = o.lr || Math.min(r + 140, Math.max(r + 30, need)), m = lwPt(cx, cy, (A0 + e) / 2, d);
      attr(lab, 'x', m[0]); attr(lab, 'y', m[1] + size * 0.35); setText(lab, str);
      op(lab, clamp(prog * 4 - 3));
    }
  };
  g.set = p => { prog = clamp(p); draw(); };
  g.to = (x2, y2, b0, b1) => { cx = x2; cy = y2; A0 = b0; A1 = b1; draw(); };
  draw();
  return g;
}
/* arc from the normal (normalDeg) round to a ray theta degrees away from it: lwArc(..., normalDeg, normalDeg + theta) */
function lwArcFromNormal(parent, x, y, normalDeg, theta, r, o) { return lwArc(parent, x, y, normalDeg, normalDeg + theta, r, o); }

/* ---------- surfaces ---------- */
/* A plane mirror len long on the x-axis, centred on the origin, reflecting side up (its normal points to -90°),
   with hatching behind. tr(m, x, y, 1, -90) stands it upright facing left; tr(m, x, y, 1, 90) facing right. */
function lwPlaneMirror(parent, len, o) {
  o = o || {};
  const g = G(parent), h = G(g);
  for (let x = -len / 2 + 6; x < len / 2 - 4; x += o.gap || 16) E('line', { x1: x, y1: 5, x2: x - 12, y2: 20, stroke: o.hatch || LW_OPT.hatch, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, h);
  E('line', { x1: -len / 2, y1: 0, x2: len / 2, y2: 0, stroke: o.color || LW_OPT.mirror, 'stroke-width': o.width || 8, 'stroke-linecap': 'round' }, g);
  E('line', { x1: -len / 2 + 8, y1: -2.5, x2: len / 2 - 8, y2: -2.5, stroke: '#FFFFFF', 'stroke-width': 1.5, opacity: 0.6 }, g);
  return g;
}
/* A rough surface for diffuse reflection: n flat facets at random tilts (seeded) along the x-axis, centred on
   the origin, facing up. g.hit(x) -> { x, y, normalDeg } on the facet under x, so each ray reflects about its
   own facet's normal; g.reflect(x, deg, len) -> { p: hit point, b: end } for a ray travelling in direction deg
   that hits above x (law of reflection about that facet). o: n (9), amp (max facet tilt in degrees, 20: keeps
   every reflection of a 45° ray pointing up, away from the surface), seed, color. */
function lwRough(parent, len, o) {
  o = o || {};
  const g = G(parent), rr = rng(o.seed || 7), n = o.n || 9, w = len / n, amp = o.amp === undefined ? 20 : o.amp;
  const pts = [[-len / 2, 0]], facets = [];
  for (let k = 0; k < n; k++) {
    const tilt = (rr() * 2 - 1) * amp, x0 = pts[k][0], y0 = pts[k][1], x1 = x0 + w;
    let y1 = y0 + Math.tan(tilt * Math.PI / 180) * w;
    if (Math.abs(y1) > w * 0.45) y1 = Math.sign(y1) * w * 0.45;
    const nd = lwAng([y1 - y0, -(x1 - x0)]);      // normal of the facet, pointing up out of the surface
    facets.push({ x0, y0, x1, y1, normalDeg: nd }); pts.push([x1, y1]);
  }
  E('path', { d: 'M' + pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L') + ` L${len / 2},40 L${-len / 2},40 Z`, fill: o.fill || '#3A5568', stroke: o.color || '#C9D6DF', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  g.facets = facets;
  g.hit = x => { const f = facets[Math.max(0, Math.min(n - 1, Math.floor((x + len / 2) / w)))], u = (x - f.x0) / (f.x1 - f.x0); return { x, y: lerp(f.y0, f.y1, u), normalDeg: f.normalDeg }; };
  g.reflect = (x, deg, L) => { const h = g.hit(x), d = lwReflectVec(lwDir(deg), lwDir(h.normalDeg)); return { p: [h.x, h.y], b: [h.x + d[0] * (L || 220), h.y + d[1] * (L || 220)], normalDeg: h.normalDeg }; };
  return g;
}

/* ---------- glass shapes ---------- */
/* adds g.at(x, y) (place it) and g.trace(start, deg, n, endLen) to a glass shape with corners verts
   (local, convex, any order around): the ray from start (parent coords) heading deg refracts in and out with
   index n inside, and reflects inside where it cannot get out (TIR). Returns the polyline [start, ...hits, end]. */
function lwGlassShape(g, verts) {
  let ox = 0, oy = 0;
  g.verts = verts;
  g.at = (x, y) => { ox = x; oy = y; tr(g, x, y); return g; };
  g.trace = (start, deg, n, endLen) => {
    const V = verts.map(v => [v[0] + ox, v[1] + oy]), cx = V.reduce((s, v) => s + v[0], 0) / V.length, cy = V.reduce((s, v) => s + v[1], 0) / V.length;
    let p = [start[0], start[1]], d = lwDir(deg), inside = false, last = -1;
    const out = [p.slice()];
    for (let step = 0; step < 8; step++) {
      let best = null;
      for (let k = 0; k < V.length; k++) {
        if (k === last) continue;
        const a = V[k], b = V[(k + 1) % V.length], ex = b[0] - a[0], ey = b[1] - a[1], den = d[0] * ey - d[1] * ex;
        if (Math.abs(den) < 1e-9) continue;
        const t = ((a[0] - p[0]) * ey - (a[1] - p[1]) * ex) / den, u = ((a[0] - p[0]) * d[1] - (a[1] - p[1]) * d[0]) / den;
        if (t > 1e-6 && u >= 0 && u <= 1 && (!best || t < best.t)) best = { t, k, ex, ey };
      }
      if (!best) break;
      p = [p[0] + d[0] * best.t, p[1] + d[1] * best.t]; out.push(p.slice()); last = best.k;
      let nrm = lwUnit([best.ey, -best.ex]);
      if ((p[0] - cx) * nrm[0] + (p[1] - cy) * nrm[1] < 0) nrm = [-nrm[0], -nrm[1]];   // outward normal
      const nd = inside ? lwRefractVec(d, nrm, n, 1) : lwRefractVec(d, nrm, 1, n);
      if (nd) { d = lwUnit(nd); inside = !inside; if (!inside) break; }
      else d = lwUnit(lwReflectVec(d, nrm));                                          // total internal reflection
    }
    out.push([p[0] + d[0] * (endLen || 200), p[1] + d[1] * (endLen || 200)]);
    return out;
  };
  return g;
}
/* A rectangular glass block w x h centred on the origin. o: label (e.g. 'glass'), fill, stroke, rx. g.at / g.trace as above. */
function lwGlassBlock(parent, w, h, o) {
  o = o || {};
  const g = G(parent);
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: o.rx === undefined ? 4 : o.rx, fill: o.fill || LW_OPT.glassFill, stroke: o.stroke || LW_OPT.glassStroke, 'stroke-width': 3 }, g);
  E('line', { x1: -w / 2 + 12, y1: -h / 2 + 10, x2: -w / 2 + Math.min(90, w * 0.3), y2: -h / 2 + 10, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  if (o.label) T(g, w / 2 - 16, h / 2 - 16, o.label, { size: 26, weight: 600, fill: LW_OPT.normal, anchor: 'end' });
  return lwGlassShape(g, [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]);
}
/* A semicircular glass block: flat face on the x-axis with its centre at the origin, curved side below (+y).
   A ray aimed at the origin along a radius crosses the curved face without bending, so the flat face shows
   refraction, the critical angle and TIR cleanly (use lwBend at the origin with normalDeg 90, n1 1.5, n2 1). */
function lwSemiBlock(parent, r, o) {
  o = o || {};
  const g = G(parent);
  E('path', { d: `M${-r},0 L${r},0 A${r},${r} 0 0 1 ${-r},0 Z`, fill: o.fill || LW_OPT.glassFill, stroke: o.stroke || LW_OPT.glassStroke, 'stroke-width': 3 }, g);
  E('line', { x1: -r + 14, y1: 9, x2: -r * 0.55, y2: 9, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  if (o.label) T(g, 0, r * 0.62, o.label, { size: 26, weight: 600, fill: LW_OPT.normal, anchor: 'middle' });
  return g;
}
/* An equilateral glass prism, side s, apex up, centred on its bounding box: apex (0, -h/2), base on y = +h/2
   (h = 0.866 s). g.at / g.trace as above: trace each LW_SPECTRUM colour with its own n for dispersion. */
function lwPrism(parent, s, o) {
  o = o || {};
  const g = G(parent), h = s * Math.sqrt(3) / 2, V = [[0, -h / 2], [s / 2, h / 2], [-s / 2, h / 2]];
  E('path', { d: `M${V[0]} L${V[1]} L${V[2]} Z`, fill: o.fill || LW_OPT.glassFill, stroke: o.stroke || LW_OPT.glassStroke, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  E('line', { x1: -s * 0.09, y1: -h * 0.24, x2: -s * 0.27, y2: h * 0.08, stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.3, 'stroke-linecap': 'round' }, g);
  g.h = h;
  return lwGlassShape(g, V);
}

/* ---------- lenses ---------- */
/* A convex (converging) lens h tall centred on the origin, axis along x. g.set(fat) morphs it from thin (0)
   to fat (1); g.f() is the matching focal length, from o.fThin (240) down to o.fFat (120): a fatter lens bends
   light more. Use lwLensImage() for where its rays meet. */
function lwConvexLens(parent, h, o) {
  o = o || {};
  const g = G(parent), body = E('path', { fill: o.fill || 'rgba(200,230,250,0.22)', stroke: o.stroke || LW_OPT.glassStroke, 'stroke-width': 3 }, g);
  const shine = E('path', { fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.35, 'stroke-linecap': 'round' }, g);
  const t0 = o.thin || h * 0.07, t1 = o.thick || h * 0.24, fT = o.fThin || 240, fF = o.fFat || 120;
  let fat = o.fat === undefined ? 0.5 : o.fat;
  g.set = v => {
    fat = clamp(v); const w = lerp(t0, t1, fat), y = h / 2;
    body.setAttribute('d', `M0,${-y} C${w * 1.33},${-y * 0.62} ${w * 1.33},${y * 0.62} 0,${y} C${-w * 1.33},${y * 0.62} ${-w * 1.33},${-y * 0.62} 0,${-y} Z`);
    shine.setAttribute('d', `M${-w * 0.45},${-y * 0.45} Q${-w * 0.8},${-y * 0.1} ${-w * 0.62},${y * 0.2}`);
  };
  g.f = () => lerp(fT, fF, fat);
  g.set(fat);
  return g;
}
/* Thin-lens image (1/f = 1/u + 1/v) of the point (sx, sy) for a lens centred at (lx, ly), light travelling
   right: returns [x, y] of the real, inverted image, or null when the point is at or inside the focal length.
   Rays from the point to anywhere on the lens all meet there; parallel rays meet at (lx + f, ly) (lwLensFocus). */
function lwLensImage(lx, ly, f, sx, sy) { const u = lx - sx; if (u <= f) return null; const v = u * f / (u - f); return [lx + v, ly - (v / u) * (sy - ly)]; }
function lwLensFocus(lx, ly, f) { return [lx + f, ly]; }

/* ---------- the eye ---------- */
/* Cross-section of an eye looking left (light comes from the left); eyeball radius R (220) centred on the origin.
   g.parts.{sclera, cornea, iris, lens, ciliary, ligaments, retina, nerve, blind}: <g>s to highlight with op() or a
   glow; g.geo.anchors.<part>: [x, y] points for kit labelLine leaders.
   g.pupil(p): 0 small (bright light) .. 1 wide (dim).
   g.focus(near): 0 far (ciliary muscles relaxed, ligaments tight, lens thin) .. 1 near (muscles contracted,
   ligaments slack, lens fat).
   g.image(sx, sy): where light from the point (sx, sy) (local coords, left of the eye) lands on the retina: on the
   line through the lens centre, so it comes out upside down.
   g.rays(sx, sy, n, shift): n polylines [source, cornea, lens, retina] from that point through the pupil. They bend
   at the cornea (the most) and the lens and meet on the retina; shift < 0 makes them meet in front of the retina,
   > 0 behind it (blurry, for the glasses beat); shift is a fraction of R. Draw each with lwRayPath. */
function lwEyeSection(parent, R, o) {
  R = R || 220; o = o || {};
  const g = G(parent), P = {}, A = {};
  const part = name => (P[name] = G(g));
  const cA = 35 * Math.PI / 180, cx0 = -R * Math.cos(cA), cy0 = R * Math.sin(cA), cCtl = -R * 1.55;
  const lensX = -R * 0.53, lensRy = R * 0.36, irisX = -R * 0.8, Rr = R - 10, nerveDeg = 12;
  // vitreous body + sclera (white outer coat, open at the front for the cornea)
  E('circle', { r: R - 4, fill: o.fill || 'rgba(160,200,225,0.07)' }, g);
  const scl = part('sclera'), s0 = lwPt(0, 0, 180 + 35, R), s1 = lwPt(0, 0, 180 - 35, R);
  E('path', { d: `M${s0[0].toFixed(1)},${s0[1].toFixed(1)} A${R},${R} 0 1 1 ${s1[0].toFixed(1)},${s1[1].toFixed(1)}`, fill: 'none', stroke: '#EEF3F6', 'stroke-width': 11 }, scl);
  // retina (pink lining round the back) and blind spot where the optic nerve leaves
  const ret = part('retina'), r0 = lwPt(0, 0, -112, Rr), r1 = lwPt(0, 0, 112, Rr);
  E('path', { d: `M${r0[0].toFixed(1)},${r0[1].toFixed(1)} A${Rr},${Rr} 0 1 1 ${r1[0].toFixed(1)},${r1[1].toFixed(1)}`, fill: 'none', stroke: C.cell, 'stroke-width': 8, 'stroke-linecap': 'round' }, ret);
  const nv = part('nerve'), nb = lwPt(0, 0, nerveDeg, R - 6);
  E('path', { d: `M${nb[0] - 4},${nb[1] - 17} L${R + 125},${nb[1] + 2} L${R + 125},${nb[1] + 34} L${nb[0] - 4},${nb[1] + 17} Z`, fill: '#E9C46A', stroke: '#B8902F', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, nv);
  const bl = part('blind'), bp = lwPt(0, 0, nerveDeg, Rr);
  E('circle', { cx: bp[0], cy: bp[1], r: 9, fill: '#3A2A1A', stroke: '#E9C46A', 'stroke-width': 2.5 }, bl);
  // cornea (clear bulge at the front)
  const cor = part('cornea');
  E('path', { d: `M${cx0},${-cy0} Q${cCtl},0 ${cx0},${cy0}`, fill: 'rgba(200,230,250,0.18)', stroke: LW_OPT.glassStroke, 'stroke-width': 5 }, cor);
  // ciliary muscles (top and bottom), suspensory ligaments, lens
  const cil = part('ciliary'), lig = part('ligaments'), lns = part('lens'), iri = part('iris');
  const mus = [-1, 1].map(sg => E('ellipse', { rx: R * 0.065, ry: R * 0.12, fill: ball('#E57A8A', '#9E3B4B'), stroke: '#F7B5BF', 'stroke-width': 2 }, cil));
  const fib = [-1, 1].map(() => [0, 1, 2].map(() => E('path', { fill: 'none', stroke: '#F2F7FA', 'stroke-width': 2, opacity: 0.85 }, lig)));
  const lensEl = E('ellipse', { cx: lensX, cy: 0, rx: 10, ry: lensRy, fill: 'rgba(225,242,255,0.40)', stroke: LW_OPT.glassStroke, 'stroke-width': 3.5 }, lns);
  const bars = [-1, 1].map(() => E('line', { x1: irisX, x2: irisX, stroke: o.iris || '#9A6A3E', 'stroke-width': 13, 'stroke-linecap': 'round' }, iri));
  let pup = 0.5, near = 0;
  const lensRx = () => R * lerp(0.085, 0.17, near), lensRyNow = () => lensRy * lerp(1, 0.93, near);
  const layout = () => {
    const ph = R * lerp(0.08, 0.27, pup), top = cy0 * 0.98;
    bars.forEach((b, k) => { const sg = k ? 1 : -1; attr(b, 'y1', sg * top); attr(b, 'y2', sg * ph); });
    const rx = lensRx(), ry = lensRyNow(); attr(lensEl, 'rx', rx); attr(lensEl, 'ry', ry);
    mus.forEach((m, k) => {   // muscle sits against the wall behind the iris; contracting moves it in, towards the lens
      const sg = k ? 1 : -1, wall = lwPt(0, 0, sg > 0 ? 180 - 52 : 180 + 52, R - R * 0.075), inward = lerp(0, R * 0.05, near);
      tr(m, wall[0] + inward * 0.4, wall[1] - sg * inward, 1 + 0.18 * near, sg * -52);
      fib[k].forEach((f, j) => {
        const a = [wall[0] + inward * 0.4 + (j - 1) * 7, wall[1] - sg * (inward + R * 0.09)], b = [lensX + (j - 1) * rx * 0.55, sg * ry * (0.97 - Math.abs(j - 1) * 0.04)];
        const sag = R * 0.05 * near * (j === 1 ? 1 : 0.8), mx = (a[0] + b[0]) / 2 + sag, my = (a[1] + b[1]) / 2 - sg * sag * 0.3;
        f.setAttribute('d', `M${a[0].toFixed(1)},${a[1].toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b[0].toFixed(1)},${b[1].toFixed(1)}`);
      });
    });
  };
  g.pupil = p => { pup = clamp(p); layout(); };
  g.focus = v => { near = clamp(v); layout(); };
  g.pupilHalf = () => R * lerp(0.08, 0.27, pup);
  const corneaAt = y => { const t = (y / cy0 + 1) / 2; return [(1 - t) * (1 - t) * cx0 + 2 * t * (1 - t) * cCtl + t * t * cx0, y]; };
  const retinaHit = (p, d) => { d = lwUnit(d); const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - Rr * Rr, t = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + d[0] * t, p[1] + d[1] * t]; };
  g.image = (sx, sy) => retinaHit([lensX, 0], [lensX - sx, -sy]);
  g.rays = (sx, sy, n, shift) => {
    n = n || 3; shift = shift || 0;
    const I = g.image(sx, sy), ax = lwUnit([I[0] - lensX, I[1]]), M = [I[0] + ax[0] * shift * R, I[1] + ax[1] * shift * R];
    const Q = [M[0] + ax[0] * 2.4 * R, M[1] + ax[1] * 2.4 * R];     // the cornea alone would focus here, far behind the retina (it does about 2/3 of the bending)
    const half = g.pupilHalf() * 0.82, out = [];
    for (let k = 0; k < n; k++) {
      const yc = n === 1 ? 0 : lerp(-half, half, k / (n - 1)), Cp = corneaAt(yc);
      const u = (lensX - Cp[0]) / ((Q[0] - Cp[0]) || 1), Lp = [lensX, lerp(Cp[1], Q[1], u)];
      out.push([[sx, sy], Cp, Lp, retinaHit(Lp, [M[0] - Lp[0], M[1] - Lp[1]])]);      // the lens bends it on to M
    }
    return out;
  };
  A.cornea = corneaAt(-R * 0.3); A.pupil = [irisX - 4, 0]; A.iris = [irisX, -cy0 * 0.62]; A.lens = [lensX, -lensRy * 0.5];
  A.retina = lwPt(0, 0, -40, Rr); A.sclera = lwPt(0, 0, -70, R + 4); A.nerve = [R + 70, nb[1] + 18]; A.blind = bp;
  A.ciliary = lwPt(0, 0, 180 + 52, R * 0.88); A.ligaments = [lensX + 6, -lensRy * 1.12];
  g.parts = P; g.geo = { R, lensX, irisX, retinaR: Rr, cornea: [cx0, cy0, cCtl], anchors: A };
  layout();
  return g;
}
/* Front view of an eye about 2r wide: white sclera, coloured iris, black pupil. g.pupil(p) 0 small .. 1 wide. o.iris colour. */
function lwIrisFront(parent, r, o) {
  o = o || {};
  const g = G(parent);
  E('path', { d: `M${-r * 1.9},0 Q0,${-r * 1.55} ${r * 1.9},0 Q0,${r * 1.55} ${-r * 1.9},0 Z`, fill: '#F4F7F9', stroke: '#C9D6DF', 'stroke-width': 3 }, g);
  E('circle', { r, fill: ball(o.iris || '#B07A45', '#6B4423'), stroke: '#4A2F18', 'stroke-width': 2 }, g);
  const pupil = E('circle', { r: r * 0.4, fill: '#0B0B0D' }, g);
  E('circle', { cx: -r * 0.32, cy: -r * 0.34, r: r * 0.14, fill: '#FFFFFF', opacity: 0.85 }, g);
  g.pupil = p => attr(pupil, 'r', r * lerp(0.22, 0.72, clamp(p)));
  g.pupil(0.5);
  return g;
}
/* A small side-view eye for ray diagrams, about 70 px at s = 1, centred, looking left (o.right: looking right). */
function lwEyeIcon(parent, s, o) {
  o = o || {};
  const g = G(parent), inner = G(g), k = s || 1;
  inner.setAttribute('transform', `scale(${o.right ? -k : k} ${k})`);
  E('path', { d: 'M-34,0 Q-6,-26 30,-12 Q38,0 30,12 Q-6,26 -34,0 Z', fill: '#F4F7F9', stroke: '#C9D6DF', 'stroke-width': 2.5 }, inner);
  E('ellipse', { cx: -20, cy: 0, rx: 6, ry: 12, fill: o.iris || '#6B4423' }, inner);
  E('ellipse', { cx: -22, cy: 0, rx: 3, ry: 6.5, fill: '#0B0B0D' }, inner);
  E('path', { d: 'M-30,-8 Q-6,-30 28,-16', fill: 'none', stroke: '#C98E62', 'stroke-width': 4, 'stroke-linecap': 'round' }, inner);
  return g;
}
/* A ray box (a lamp with a slit) about 100 x 46, centred, pointing right; rotate it with tr(). g.set(on 0..1) lights the slit. */
function lwRayBox(parent, o) {
  o = o || {};
  const g = G(parent);
  E('rect', { x: -50, y: -23, width: 100, height: 46, rx: 8, fill: ball('#4A5866', '#232C35'), stroke: '#8FA3B3', 'stroke-width': 2.5 }, g);
  const halo = E('circle', { cx: 50, cy: 0, r: 34, fill: glow(o.color || LW_OPT.ray) }, g);
  const slit = E('rect', { x: 46, y: -8, width: 6, height: 16, rx: 2, fill: o.color || LW_OPT.ray }, g);
  g.set = p => { p = clamp(p); op(halo, p); slit.setAttribute('opacity', (0.25 + 0.75 * p).toFixed(3)); };
  g.set(1);
  return g;
}

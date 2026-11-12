/* HAPPILY EVER ATOM (Claude Sitcom Ep 6, Elements, Compounds & Mixtures): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js (scWho, scTalk, scMake, scKavya, scKavyaBody,
   scConfessional, scLowerThird, scVideoCall, scClipboard ...). Every top-level name here starts
   with `ec` (except `cast`).

   CHARACTERS: cast(parent, kind, o) -> g, origin at the character's centre, about 200-250 px tall at s = 1.
     o: { s (scale), mood (default mood), col, dark (inky only: body colour, for the separated dyes) }
     Every frame: g.set({ t, talk: scTalk(S, t, who), mood, look, sweat, still })
       moods: neutral | happy | smug | annoyed | sad | shock | deadpan;  look -1..1 (pupils left/right)
       'nigels' has two faces: talk/mood/look drive the LEFT Nigel, talkB/moodB/lookB the RIGHT Nigel
       (both are voiced by `nigels`; pick one mouth per line, or alternate).
     kinds (who in script.py):
       'arthur'  Arthur, argon: lilac glowing ball, grey side tufts and a comb-over,
                 blue lanyard with an "Ar" ID card. Default mood deadpan. The tired matchmaker.
       'nate'    Nate, sodium: shiny silver ball, spiky silver quiff, yellow "Na" badge, little yellow
                 zaps that flicker (very reactive). sweat: 0..1 (he is scared of water). Default happy.
       'chloe'   Chloe, chlorine: a yellow-green gas cloud with wisps, dark purple beret, dark lids,
                 a toxic-hazard badge. The wisps sway. Default smug.
       'sal'     Sal, sodium chloride: a white salt-crystal cube (3-D), a lattice of tiny silver (Na)
                 and green (Cl) dots on the side face, rosy cheeks. Default happy. Body spans x -80..110.
       'nigels'  Nigel & Nigel, N2: two identical blue nitrogen atoms joined by a TRIPLE bond (three
                 bars), matching navy hair swoosh and red bow tie. About 260 wide. Default neutral.
       'sandy'   Sandy, a grain of sand: speckled beige rock, pink floppy sun hat. Default sad.
       'inky'    Inky, black ink: a dark indigo ink drop with a light outline and pink headphones.
                 Default happy. cast(p, 'inky', { col: '#3B82F6', dark: '#1E4FA8', s: 0.5 }) draws a
                 small coloured "dye" Inky for the chromatography split (blue, pink, yellow).
       'kavya'   Kavya, 12 (scKavya: head and shoulders, PE shirt "8"); sweat 0..1.
     sweat drops: nate, sandy, kavya.

   SHOTS
     ecConfessional(parent, kind)   scConfessional tinted for that character; g.set(p, t) (REC blinks with t)
     EC_TINT[kind]                  the [top, bottom] confessional colours
     EC_LOWER[kind]                 [NAME, role] for scLowerThird(parent, ...EC_LOWER[kind])

   SETS (full stage 1200 x 750; keep x < 560, y < 100 free of text for the chapter tag)
     ecKitchen(parent)    Kavya's HDB kitchen: mint tiles, a window with HDB blocks and a laundry pole,
                          fridge (left), sink and stove with a steaming pot along the back counter,
                          wooden table across the foreground (top edge y = 600).
                          g.upd(t) (steam, laundry); g.fridge = [145, 380], g.sink = [390, 450],
                          g.pot = [600, 400], g.table = 600 (table-top y)
     ecAgency(parent)     the matchmaking agency: plum walls with faint hearts, the neon logo on the
                          back wall (g.logo), a "SUCCESS STORIES" corkboard of bonded pairs, a pink
                          waiting sofa, a ticket machine "TAKE A NUMBER", the reception desk (right,
                          top y = 470). g.upd(t) (neon flicker, logo electrons)
     ecAirFlat(parent)    Arthur's flat, in the air: blue sky, a cloud floor (top y ~ 590) with a
                          little sofa and a lamp, a door frame with the sign "FLAT: AIR", and air's
                          molecules drifting (blue N2 pairs, red O2 pairs, lilac Ar singles, in
                          roughly air's proportions). g.upd(t, speed)
     ecLab(parent)        the school science lab: shelves of bottles, a "GOGGLES ON" sign, a small
                          periodic-table poster, the bench top at y = 560. No text in the safe area.
   PROPS (drawn around their own origin; place with tr)
     ecLogo(parent, s)              "HAPPILY EVER ATOM" neon logo with a heart-shaped atom; about 640 x 230 at
                                    s = 1. g.upd(t) spins the electrons; g.set(flicker 0..1) dims the neon
     ecMug(parent, s)               Arthur's mug "WORLD'S OKAYEST MATCHMAKER"
     ecPeriodic(parent, cell)       the periodic table (18 columns, f-block below), cell size `cell`
                                    (default 34), centred; symbols written in the cells of the elements
                                    in this episode. g.hi(sym, v) lights a cell (v 0..1); g.at(sym) -> [x, y]
     ecAtom(parent, sym, r)         one atom ball with its symbol: 'H','C','N','O','Na','Cl','Ar','Fe' (CPK-ish colours)
     ecParticles(parent, kind, o)   particle-picture box, 260 x 210, centred: kind 'element' (N2 pairs),
                                    'atoms' (single identical atoms), 'compound' (H2O groups), 'mixture'
                                    (N2 + O2 + Ar, not joined). g.upd(t) jiggles them. o.seed
     ecFilter(parent)               filter funnel with a paper cone over a conical flask (about 200 x 380).
                                    g.set({ residue 0..1, filtrate 0..1, cloudy 0..1 }); g.upd(t) drips
     ecDistil(parent)               simple distillation: flask of salt water on a Bunsen, delivery tube,
                                    a sloping condenser with "water in / water out" arrows, a collecting
                                    beaker. About 900 x 440; the Bunsen stands about 215 px below the origin (put the origin 215 px above the bench).
                                    g.set({ heat 0..1, flask 0..1, collect 0..1 }); g.upd(t) moves vapour and drips
     ecChroma(parent, o)            chromatography: a beaker of solvent with a paper sheet, pencil line,
                                    lanes of ink spots and labels. Default lanes: NOTE, MUM, DAD, BROTHER
                                    (NOTE and BROTHER match). g.set(p 0..1): the solvent front rises and
                                    the dyes separate. o.lanes = [{ label, dyes: [[colour, height 0..1], ...] }]
     ecSepFunnel(parent)            separating funnel on a stand: oil (yellow) over water (blue), a tap,
                                    a beaker below. g.set(p 0..1): tap open, the lower layer drains into the beaker
     ecTehO(parent, s)              a glass mug of teh-O on a saucer; g.set(sugar 0..1) piles sugar at the bottom
*/

/* ================= confessional tints and name straps ================= */
const EC_TINT = {
  arthur: ['#241A3D', '#46336E'], nate: ['#1E2A36', '#3A5064'], chloe: ['#1C2810', '#3A5220'], sal: ['#16283A', '#2E5070'],
  nigels: ['#121E3C', '#233A78'], sandy: ['#3A2E18', '#6B5426'], inky: ['#1A1430', '#3A2A5E'], kavya: ['#14243A', '#25446B'],
};
const EC_LOWER = {
  arthur: ['ARTHUR', 'Argon. Noble gas. Doesn’t bond.'],
  nate: ['NATE', 'Sodium (Na). A very reactive metal.'],
  chloe: ['CHLOE', 'Chlorine (Cl). Poisonous gas.'],
  sal: ['SAL', 'Sodium chloride (NaCl). Table salt.'],
  nigels: ['NIGEL & NIGEL', 'Nitrogen (N₂). Both Nigel.'],
  sandy: ['SANDY', 'Sand. Insoluble.'],
  inky: ['INKY', 'Black ink. One colour. Allegedly.'],
  kavya: ['KAVYA, 12', 'Has homework. On a Saturday.'],
};
function ecConfessional(parent, kind) {
  const [a, b] = EC_TINT[kind] || EC_TINT.arthur;
  return scConfessional(parent, a, b);
}

/* ================= the cast ================= */
function cast(parent, kind, o) {
  o = o || {};
  if (kind === 'kavya') return scKavya(parent, o);
  const spec = { s: o.s, seed: 3, bob: 4 };
  if (kind === 'arthur') {
    Object.assign(spec, { seed: 5, bob: 2, mood: 'deadpan',
      draw: g => {
        E('circle', { r: 122, fill: glow('#C9A7FF'), opacity: 0.55 }, g);                    // the noble-gas glow
        E('path', { d: 'M-50,58 L-9,124 M50,58 L9,124', stroke: '#3F5BD9', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' }, g);   // lanyard
        [-1, 1].forEach(sd => [[86, -36, 13], [96, -14, 12], [90, 8, 11]].forEach(([x, y, r]) =>
          E('circle', { cx: sd * x, cy: y, r, fill: '#EEEAF5', stroke: SC_INK, 'stroke-width': 3 }, g)));                                    // grey tufts
        E('circle', { r: 88, fill: ball('#CDB2FF', '#7B52D6'), stroke: '#5B37B0', 'stroke-width': 6 }, g);
        const comb = 'M-48,-66 Q-8,-104 46,-76 M-36,-58 Q4,-92 56,-62';
        E('path', { d: comb, fill: 'none', stroke: SC_INK, 'stroke-width': 11, 'stroke-linecap': 'round' }, g);   // comb-over
        E('path', { d: comb, fill: 'none', stroke: '#EEEAF5', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        const id = G(g); tr(id, 0, 140, 1, -4);                                                // ID card
        E('rect', { x: -32, y: -22, width: 64, height: 58, rx: 7, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, id);
        E('rect', { x: -32, y: -22, width: 64, height: 14, rx: 4, fill: '#3F5BD9' }, id);
        T(id, 0, 26, 'Ar', { size: 28, weight: 800, anchor: 'middle', fill: '#6B45C8' });
      },
      face: { x: 0, y: 8, eye: 18, gap: 58, mouthW: 44, mouthY: 36, lidCol: '#B793F2' } });
  } else if (kind === 'nate') {
    let zaps = [];
    Object.assign(spec, { seed: 7, bob: 8, mood: 'happy',
      draw: g => {
        const pts = [];
        for (let i = 0; i <= 10; i++) { const a = (-165 + i * 15) * Math.PI / 180, r = i % 2 ? 132 : 70; pts.push([Math.cos(a) * r, Math.sin(a) * r - 6]); }
        E('path', { d: 'M0,-10 L' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L') + ' Z', fill: '#B4C2D0', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);   // spiky quiff
        E('circle', { r: 82, fill: ball('#F3F6F9', '#8492A0'), stroke: '#56636F', 'stroke-width': 6 }, g);
        E('ellipse', { cx: -34, cy: -44, rx: 18, ry: 9, fill: '#FFFFFF', opacity: 0.7, transform: 'rotate(-30 -34 -44)' }, g);
        const b = G(g); tr(b, 56, 56);
        E('circle', { r: 22, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 3 }, b);
        T(b, 0, 8, 'Na', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
        [[-112, -8, -10], [114, 24, 12], [-96, 58, 18]].forEach(([x, y, r]) => {
          const z = G(g); tr(z, x, y, 1, r);
          E('path', { d: 'M-4,-22 L8,-4 L-2,-2 L6,20 L-10,0 L0,-2 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, z);
          zaps.push({ z, x, y, r });
        });
      },
      upd: (t) => zaps.forEach(({ z, x, y, r }, i) => { const f = Math.sin(t * 11 + i * 2.1); op(z, f > -0.3 ? 1 : 0); tr(z, x + Math.sin(t * 23 + i) * 2, y, 1, r + f * 6); }),
      face: { x: 0, y: 6, eye: 20, gap: 60, mouthW: 50, mouthY: 36, lidCol: '#C5D0DA' },
      sweat: [[-74, -44], [76, -40]] });
  } else if (kind === 'chloe') {
    let wisps = [];
    Object.assign(spec, { seed: 11, bob: 6, mood: 'smug',
      draw: g => {
        const puffs = [[0, -34, 62], [-60, -8, 50], [60, -10, 52], [-44, 40, 48], [44, 42, 48], [0, 52, 52]];
        puffs.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: '#5E8A22', stroke: '#5E8A22', 'stroke-width': 12 }, g));
        puffs.forEach(([x, y, r]) => E('circle', { cx: x, cy: y, r, fill: ball('#DDF68E', '#93BE3E') }, g));
        [[-26, 112, 15], [-8, 136, 10], [8, 152, 6]].forEach(([x, y, r]) => wisps.push({ el: E('circle', { r, fill: '#C9EE73', stroke: '#5E8A22', 'stroke-width': 4 }, g), x, y }));
        const be = G(g); tr(be, 30, -92, 1, -14);                                              // beret
        E('ellipse', { rx: 50, ry: 17, fill: '#3A2348', stroke: SC_INK, 'stroke-width': 3 }, be);
        E('circle', { cx: 6, cy: -16, r: 7, fill: '#3A2348', stroke: SC_INK, 'stroke-width': 3 }, be);
        const hz = G(g); tr(hz, -62, 58);                                                      // toxic badge
        E('rect', { x: -18, y: -18, width: 36, height: 36, fill: '#FFFFFF', stroke: '#E8424F', 'stroke-width': 4, transform: 'rotate(45)' }, hz);
        E('circle', { cy: -3, r: 8, fill: SC_INK }, hz);
        E('rect', { x: -5, y: 3, width: 10, height: 7, rx: 2, fill: SC_INK }, hz);
        E('circle', { cx: -3, cy: -4, r: 2.2, fill: '#FFFFFF' }, hz); E('circle', { cx: 3, cy: -4, r: 2.2, fill: '#FFFFFF' }, hz);
      },
      upd: (t) => wisps.forEach(({ el, x, y }, i) => { attr(el, 'cx', x + Math.sin(t * 1.7 + i * 1.3) * (6 + i * 3)); attr(el, 'cy', y + Math.sin(t * 1.1 + i) * 3); }),
      face: { x: 0, y: -4, eye: 18, gap: 56, mouthW: 40, mouthY: 32, lidCol: '#4A2D5C', iris: '#3A2348' } });
  } else if (kind === 'sal') {
    Object.assign(spec, { seed: 13, bob: 3, mood: 'happy',
      draw: g => {
        const st = { stroke: '#647A90', 'stroke-width': 6, 'stroke-linejoin': 'round' };
        E('path', Object.assign({ d: 'M-80,-62 L-48,-98 L112,-98 L80,-62 Z', fill: '#FFFFFF' }, st), g);          // top
        E('path', Object.assign({ d: 'M80,-62 L112,-98 L112,62 L80,98 Z', fill: '#C2CFDB' }, st), g);             // side
        E('path', Object.assign({ d: 'M-80,-62 L80,-62 L80,98 L-80,98 Z', fill: linGrad('#FFFFFF', '#DCE5EE', true) }, st), g);   // front
        for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {                                // lattice: Na silver, Cl green
          const u = (i + 0.5) / 3, v = (j + 0.6) / 4.3, x = 80 + 32 * u, y = -62 - 36 * u + 160 * v;
          E('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: (i + j) % 2 ? 4.5 : 6, fill: (i + j) % 2 ? '#7CCB5A' : '#98A5B3' }, g);
        }
        E('path', { d: 'M-66,-48 L-30,-48 L-66,-12 Z', fill: '#FFFFFF', opacity: 0.9 }, g);    // crystal shine
        E('ellipse', { cx: -48, cy: 52, rx: 14, ry: 8, fill: '#FF9FB8', opacity: 0.6 }, g);
        E('ellipse', { cx: 48, cy: 52, rx: 14, ry: 8, fill: '#FF9FB8', opacity: 0.6 }, g);
      },
      face: { x: 0, y: 16, eye: 18, gap: 58, mouthW: 46, mouthY: 38, lidCol: '#E3EAF1' } });
  } else if (kind === 'nigels') {
    Object.assign(spec, { seed: 17, bob: 3, mood: 'neutral',
      draw: g => {
        [-15, 0, 15].forEach(y => E('line', { x1: -16, y1: y, x2: 16, y2: y, stroke: '#22398F', 'stroke-width': 7, 'stroke-linecap': 'round' }, g));   // N≡N
        [-1, 1].forEach(sd => {
          const h = G(g); tr(h, sd * 72, 0);
          E('circle', { r: 60, fill: ball('#86A2FF', '#2F4BB5'), stroke: '#22398F', 'stroke-width': 5 }, h);
          E('path', { d: 'M-46,-30 Q-26,-72 30,-56 Q2,-50 -14,-36 Q-30,-40 -46,-30 Z', fill: '#1E2A5A', stroke: SC_INK, 'stroke-width': 2.5 }, h);   // hair swoosh
          const bt = G(h); tr(bt, 0, 66);                                                        // bow tie
          E('path', { d: 'M0,0 L-18,-11 L-18,11 Z M0,0 L18,-11 L18,11 Z', fill: '#E8424F', stroke: SC_INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, bt);
          E('circle', { r: 5, fill: '#B32635', stroke: SC_INK, 'stroke-width': 2 }, bt);
        });
      },
      face: { x: -72, y: 2, eye: 15, gap: 42, mouthW: 34, mouthY: 28, lidCol: '#86A2FF' },
      faceB: { x: 72, y: 2, eye: 15, gap: 42, mouthW: 34, mouthY: 28, lidCol: '#86A2FF' } });
  } else if (kind === 'sandy') {
    Object.assign(spec, { seed: 19, bob: 2, mood: 'sad',
      draw: g => {
        const pts = [[-88, -26], [-58, -70], [-4, -84], [54, -70], [90, -24], [86, 36], [54, 76], [-6, 86], [-62, 72], [-92, 26]];
        E('path', { d: closedPath(pts), fill: ball('#EED39A', '#B08A46'), stroke: '#8A6A30', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        const r = rng(41); let d1 = '', d2 = '';
        for (let i = 0; i < 16; i++) {
          const a = r() * TAU, k = 0.35 + r() * 0.5, x = Math.cos(a) * 80 * k, y = Math.sin(a) * 74 * k + 6, rr = 2.5 + r() * 2.5;
          if (Math.abs(x) < 50 && y > -20 && y < 50) continue;   // keep the face clear
          const s = `M${(x - rr).toFixed(1)},${y.toFixed(1)} a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(2 * rr).toFixed(1)},0 a${rr.toFixed(1)},${rr.toFixed(1)} 0 1,0 ${(-2 * rr).toFixed(1)},0 `;
          if (i % 2) d1 += s; else d2 += s;
        }
        E('path', { d: d1, fill: '#A9823F', opacity: 0.7 }, g); E('path', { d: d2, fill: '#FFF3D6', opacity: 0.8 }, g);
        const hat = G(g); tr(hat, -8, -80, 1, -7);                                              // floppy sun hat
        E('path', { d: 'M-40,0 Q-40,-46 0,-46 Q40,-46 40,0 Z', fill: '#F7A8C8', stroke: SC_INK, 'stroke-width': 3 }, hat);
        E('ellipse', { rx: 82, ry: 15, fill: '#F7A8C8', stroke: SC_INK, 'stroke-width': 3 }, hat);
        E('path', { d: 'M-39,-8 Q0,-14 39,-8 L40,-1 Q0,-7 -40,-1 Z', fill: '#FFFFFF' }, hat);
      },
      face: { x: 0, y: 12, eye: 17, gap: 54, mouthW: 38, mouthY: 34, lidCol: '#DDBB76' },
      sweat: [[-80, -20], [82, -12]] });
  } else if (kind === 'inky') {
    const col = o.col || '#5B63AA', dark = o.dark || '#1A1D3A';
    Object.assign(spec, { seed: 23, bob: 6, mood: 'happy',
      draw: g => {
        E('path', { d: 'M0,-120 C30,-72 88,-30 88,22 C88,74 48,102 0,102 C-48,102 -88,74 -88,22 C-88,-30 -30,-72 0,-120 Z', fill: ball(col, dark), stroke: o.col ? SC_INK : '#A3ABEE', 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
        E('ellipse', { cx: -46, cy: -6, rx: 11, ry: 26, fill: '#FFFFFF', opacity: 0.35, transform: 'rotate(22 -46 -6)' }, g);
        E('path', { d: 'M-80,4 Q-84,-92 0,-96 Q84,-92 80,4', fill: 'none', stroke: SC_INK, 'stroke-width': 12, 'stroke-linecap': 'round' }, g);   // headphones
        E('path', { d: 'M-80,4 Q-84,-92 0,-96 Q84,-92 80,4', fill: 'none', stroke: '#FF6FB5', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
        [-1, 1].forEach(sd => E('rect', { x: sd * 88 - 14, y: -16, width: 28, height: 50, rx: 12, fill: '#FF6FB5', stroke: SC_INK, 'stroke-width': 3 }, g));
      },
      face: { x: 0, y: 22, eye: 19, gap: 56, mouthW: 44, mouthY: 38, lidCol: o.col ? col : '#3A4180' } });
  }
  if (o.mood) spec.mood = o.mood;
  return scMake(parent, spec);
}

/* ================= atoms and particle pictures ================= */
const EC_ATOM = { H: ['#F4F7FA', '#A9B5C0', '#3B4A57'], C: ['#8F9CAB', '#57636F', '#FFFFFF'], N: ['#86A2FF', '#2F4BB5', '#FFFFFF'],
  O: ['#FF6B5C', '#B5372D', '#FFFFFF'], Na: ['#F3F6F9', '#8492A0', '#3B4A57'], Cl: ['#DDF68E', '#93BE3E', '#2E4A10'],
  Ar: ['#CDB2FF', '#7B52D6', '#FFFFFF'], Fe: ['#C98B6B', '#7A4A33', '#FFFFFF'] };
function ecAtom(parent, sym, r) {
  r = r || 18;
  const [c, dk, lc] = EC_ATOM[sym] || EC_ATOM.C, g = G(parent);
  E('circle', { r, fill: ball(c, dk), stroke: dk, 'stroke-width': Math.max(1.5, r * 0.09) }, g);
  if (r >= 14) T(g, 0, r * 0.36, sym, { size: Math.round(r * (sym.length > 1 ? 0.85 : 1)), weight: 800, fill: lc, anchor: 'middle' });
  return g;
}
function ecParticles(parent, kind, o) {
  o = o || {};
  const g = G(parent), W2 = 130, H2 = 105, r = o.r || 15, rr = rng(o.seed || 31);
  E('rect', { x: -W2 - 8, y: -H2 - 8, width: 2 * W2 + 16, height: 2 * H2 + 16, rx: 14, fill: 'rgba(10,27,39,0.82)', stroke: '#CFE7F5', 'stroke-width': 4 }, g);
  const items = [];
  const add = (atoms, x, y) => {     // atoms: [[sym, dx, dy], ...]
    const m = G(g);
    atoms.forEach(([s, dx, dy]) => tr(ecAtom(m, s, r), dx, dy));
    items.push({ m, x, y, a: rr() * 360, ph: rr() * TAU, sp: 0.6 + rr() * 0.8 });
  };
  const slots = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) slots.push([-W2 + 36 + i * 62 + (j % 2) * 12, -H2 + 36 + j * 68]);
  const N2 = [['N', -r * 0.8, 0], ['N', r * 0.8, 0]], O2 = [['O', -r * 0.8, 0], ['O', r * 0.8, 0]];
  const H2O = [['H', -r * 0.95, r * 0.55], ['H', r * 0.95, r * 0.55], ['O', 0, 0]];
  slots.forEach(([x, y], i) => {
    if (kind === 'element') { if (i % 3 !== 2 || i < 6) add(N2, x, y); }
    else if (kind === 'atoms') add([['Ar', 0, 0]], x, y);
    else if (kind === 'compound') { if (i % 2 === 0 || i > 8) add(H2O, x, y); }
    else { const k = [N2, [['Ar', 0, 0]], O2, N2, N2, [['Ar', 0, 0]], O2, N2, N2, O2, [['Ar', 0, 0]], N2][i]; add(k, x, y); }
  });
  g.upd = t => items.forEach(it => tr(it.m, it.x + 5 * Math.sin(t * it.sp + it.ph), it.y + 4 * Math.cos(t * it.sp * 1.3 + it.ph), 1, it.a + 14 * Math.sin(t * 0.7 + it.ph)));
  g.upd(0);
  return g;
}

/* ================= sets ================= */
function ecKitchen(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: '#CFE6DA' }, g);
  let d = '';
  for (let x = 0; x <= 1200; x += 50) d += `M${x},0 L${x},440 `;
  for (let y = 0; y <= 440; y += 50) d += `M0,${y} L1200,${y} `;
  E('path', { d, stroke: '#B5D2C2', 'stroke-width': 2 }, g);
  // window with HDB blocks and a laundry pole
  E('rect', { x: 720, y: 60, width: 400, height: 270, fill: linGrad('#86CFFF', '#DFF4FF', true) }, g);
  [[740, 150, 110, 180, '#F2E6C9'], [870, 110, 120, 220, '#E6D0A8'], [1010, 170, 100, 160, '#F7EEDB']].forEach(([x, y, w, h, c]) => {
    E('rect', { x, y, width: w, height: h, fill: c, stroke: '#B9A57E', 'stroke-width': 2 }, g);
    let wd = '';
    for (let yy = y + 14; yy < y + h - 10; yy += 26) for (let xx = x + 12; xx < x + w - 14; xx += 24) wd += `M${xx},${yy} h12 v12 h-12 Z `;
    E('path', { d: wd, fill: '#7FA9C9' }, g);
  });
  const pole = G(g);
  E('line', { x1: 720, y1: 96, x2: 1120, y2: 88, stroke: '#7D8A96', 'stroke-width': 5 }, pole);
  const clothes = [];
  [[790, '#FF6F91', 'shirt'], [880, '#FFE45C', 'towel'], [970, '#5BD27A', 'shirt'], [1050, '#6FA8FF', 'towel']].forEach(([x, c, k]) => {
    const cl = G(pole); tr(cl, x, 95);
    if (k === 'shirt') E('path', { d: 'M-24,0 L-34,14 L-26,22 L-20,16 L-20,54 L20,54 L20,16 L26,22 L34,14 L24,0 Q0,10 -24,0 Z', fill: c, stroke: SC_INK, 'stroke-width': 2.5 }, cl);
    else E('rect', { x: -18, y: 0, width: 36, height: 62, rx: 3, fill: c, stroke: SC_INK, 'stroke-width': 2.5 }, cl);
    clothes.push({ cl, x });
  });
  E('rect', { x: 720, y: 60, width: 400, height: 270, fill: 'none', stroke: '#F4F7FA', 'stroke-width': 12 }, g);
  E('path', { d: 'M920,60 L920,330', stroke: '#F4F7FA', 'stroke-width': 8 }, g);
  // back counter: sink and stove
  E('rect', { x: 240, y: 430, width: 960, height: 24, fill: '#EDE6D8', stroke: '#B8AE9A', 'stroke-width': 3 }, g);
  E('rect', { x: 240, y: 454, width: 960, height: 160, fill: '#C7956A' }, g);
  let cd = '';
  for (let x = 240; x < 1200; x += 160) cd += `M${x + 6},466 h148 v136 h-148 Z `;
  E('path', { d: cd, fill: 'none', stroke: '#A97A50', 'stroke-width': 4 }, g);
  E('ellipse', { cx: 390, cy: 438, rx: 90, ry: 12, fill: '#8C99A6' }, g);
  E('path', { d: 'M390,430 L390,380 Q390,364 410,364 L430,364', fill: 'none', stroke: '#9AA6B2', 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
  E('rect', { x: 520, y: 424, width: 170, height: 12, rx: 4, fill: '#3A4550' }, g);
  E('path', { d: 'M548,424 L556,370 L654,370 L662,424 Z', fill: '#B9C6D2', stroke: '#6B7A88', 'stroke-width': 4 }, g);   // pot
  E('rect', { x: 540, y: 362, width: 130, height: 12, rx: 6, fill: '#8C99A6' }, g);
  const steam = [0, 1, 2].map(i => E('path', { d: 'M0,0 Q-12,-18 0,-36 Q12,-54 0,-72', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.6 }, g));
  // fridge
  E('rect', { x: 50, y: 150, width: 190, height: 470, rx: 18, fill: '#EEF3F7', stroke: '#9AA9B6', 'stroke-width': 5 }, g);
  E('line', { x1: 50, y1: 300, x2: 240, y2: 300, stroke: '#9AA9B6', 'stroke-width': 4 }, g);
  E('rect', { x: 210, y: 190, width: 12, height: 80, rx: 6, fill: '#B9C6D2' }, g);
  E('rect', { x: 210, y: 330, width: 12, height: 120, rx: 6, fill: '#B9C6D2' }, g);
  [[90, 200, '#FF6F91'], [150, 236, '#FFC247'], [110, 520, '#5BD27A']].forEach(([x, y, c]) => E('circle', { cx: x, cy: y, r: 9, fill: c, stroke: SC_INK, 'stroke-width': 2 }, g));
  // foreground table
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#8A5A3B' }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 18, fill: '#A8724D' }, g);
  g.upd = t => {
    steam.forEach((s, i) => { const f = ((t * 0.5 + i / 3) % 1); tr(s, 580 + i * 26, 360 - f * 40, 1); op(s, 0.6 * Math.sin(f * Math.PI)); });
    clothes.forEach(({ cl, x }, i) => tr(cl, x, 95 - (x - 720) * 0.02, 1, 3 * Math.sin(t * 1.4 + i)));
  };
  g.upd(0);
  g.fridge = [145, 380]; g.sink = [390, 450]; g.pot = [600, 400]; g.table = 600;
  return g;
}

function ecLogo(parent, s) {
  const g = G(parent), inner = G(g); tr(inner, 0, 0, s || 1);
  const neon = G(inner);
  const t1 = T(neon, -60, -30, 'HAPPILY EVER', { size: 66, weight: 800, anchor: 'middle', fill: '#FFF0F7' });
  const t2 = T(neon, -60, 70, 'ATOM', { size: 112, weight: 800, anchor: 'middle', fill: '#FFF0F7' });
  [t1, t2].forEach(t => { t.setAttribute('stroke', '#FF4FA0'); t.setAttribute('stroke-width', 10); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); });
  const icon = G(inner); tr(icon, 236, 34);
  E('circle', { r: 90, fill: glow('#FF8FC8'), opacity: 0.6 }, icon);
  E('path', { d: 'M0,40 C-70,-4 -56,-62 -20,-58 C-6,-56 0,-44 0,-36 C0,-44 6,-56 20,-58 C56,-62 70,-4 0,40 Z', fill: ball('#FF7AB8', '#C2186B'), stroke: '#FFFFFF', 'stroke-width': 4 }, icon);
  const orbits = [], els = [];
  [-32, 32].forEach((a, i) => {
    E('ellipse', { rx: 92, ry: 30, fill: 'none', stroke: '#FFE45C', 'stroke-width': 4, transform: `rotate(${a})`, opacity: 0.9 }, icon);
    orbits.push(a); els.push(E('circle', { r: 9, fill: '#FFE45C', stroke: '#FFFFFF', 'stroke-width': 2 }, icon));
  });
  g.upd = t => els.forEach((e, i) => { const a = t * 2.2 + i * Math.PI, x = Math.cos(a) * 92, y = Math.sin(a) * 30, rad = orbits[i] * Math.PI / 180; attr(e, 'cx', x * Math.cos(rad) - y * Math.sin(rad)); attr(e, 'cy', x * Math.sin(rad) + y * Math.cos(rad)); });
  g.set = v => op(neon, 0.35 + 0.65 * clamp(v));
  g.upd(0);
  return g;
}

function ecAgency(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#3E2348', '#61305E', true) }, g);
  let hd = '';
  const r = rng(5);
  for (let i = 0; i < 26; i++) {
    const x = 40 + r() * 1120, y = 120 + r() * 440, s = 7 + r() * 6;
    hd += `M${x.toFixed(0)},${(y + s).toFixed(0)} c${-2 * s},${-s} ${-s},${-2.2 * s} 0,${-1.4 * s} c${s},${-0.8 * s} ${2 * s},${0.4 * s} 0,${1.4 * s} Z `;
  }
  E('path', { d: hd, fill: '#FF8FC8', opacity: 0.12 }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: '#2A1730' }, g);
  E('path', { d: 'M0,640 L1200,640 M0,690 L1200,690', stroke: '#3A2240', 'stroke-width': 4 }, g);
  // corkboard of success stories
  E('rect', { x: 110, y: 140, width: 340, height: 240, rx: 10, fill: '#B98A55', stroke: '#6B4E28', 'stroke-width': 6 }, g);
  T(g, 280, 182, 'SUCCESS STORIES', { size: 28, weight: 800, anchor: 'middle', fill: '#3A2210' });
  [[170, 250, ['O', 'O'], -4], [280, 250, ['H', 'O', 'H'], 3], [390, 250, ['N', 'N'], -2], [170, 335, ['C', 'O'], 5], [280, 335, ['Na', 'Cl'], -3], [390, 335, ['O', 'C', 'O'], 4]].forEach(([x, y, atoms, a]) => {
    const p = G(g); tr(p, x, y, 1, a);
    E('rect', { x: -44, y: -34, width: 88, height: 70, fill: '#FFFFFF', stroke: '#C9BFA6', 'stroke-width': 2 }, p);
    E('rect', { x: -38, y: -28, width: 76, height: 50, fill: '#F7E3EE' }, p);
    atoms.forEach((s, i) => tr(ecAtom(p, s, 11), (i - (atoms.length - 1) / 2) * 18, -4));
    E('circle', { cy: -32, r: 5, fill: '#E8424F' }, p);
  });
  // waiting sofa
  E('rect', { x: 90, y: 470, width: 380, height: 70, rx: 22, fill: '#E85C8A', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 70, y: 520, width: 420, height: 70, rx: 22, fill: '#F27AA0', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('path', { d: 'M100,590 L100,612 M460,590 L460,612', stroke: SC_INK, 'stroke-width': 8, 'stroke-linecap': 'round' }, g);
  // ticket machine
  E('rect', { x: 520, y: 410, width: 70, height: 190, rx: 10, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 532, y: 430, width: 46, height: 36, rx: 4, fill: '#1B2733' }, g);
  T(g, 555, 457, '07', { size: 26, weight: 800, anchor: 'middle', fill: '#FFE45C' });
  E('path', { d: 'M538,486 L572,486 L572,520 L538,520 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 2 }, g);
  // neon logo on the back wall
  const logo = ecLogo(g, 0.62); tr(logo, 850, 200);
  g.logo = logo;
  // reception desk
  E('rect', { x: 640, y: 470, width: 520, height: 140, rx: 8, fill: '#7A3E6E', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('rect', { x: 628, y: 458, width: 544, height: 22, rx: 6, fill: '#A05A90', stroke: SC_INK, 'stroke-width': 4 }, g);
  T(g, 900, 560, 'RECEPTION', { size: 34, weight: 800, anchor: 'middle', fill: '#F7C8E4', ls: 4 });
  // plant
  E('path', { d: 'M1150,470 Q1120,400 1140,350 M1150,470 Q1170,410 1190,380 M1150,470 Q1140,420 1110,410', fill: 'none', stroke: '#3FA463', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);
  g.upd = t => { logo.upd(t); logo.set(Math.sin(t * 13) > 0.97 ? 0.4 : 1); };
  g.upd(0);
  return g;
}

function ecAirFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#6FC0F2', '#D6F1FF', true) }, g);
  [[260, 170, 120], [980, 120, 150], [660, 260, 90]].forEach(([x, y, w]) => {
    E('ellipse', { cx: x, cy: y, rx: w, ry: w * 0.32, fill: '#FFFFFF', opacity: 0.55 }, g);
    E('ellipse', { cx: x - w * 0.3, cy: y - w * 0.18, rx: w * 0.45, ry: w * 0.3, fill: '#FFFFFF', opacity: 0.55 }, g);
  });
  // drifting molecules: roughly air's proportions (most N2, some O2, the odd Ar)
  const mols = [], r = rng(99), layer = G(g);
  for (let i = 0; i < 22; i++) {
    const k = i < 15 ? 'N2' : i < 20 ? 'O2' : 'Ar', m = G(layer);
    if (k === 'Ar') tr(ecAtom(m, 'Ar', 13), 0, 0);
    else { const s = k === 'N2' ? 'N' : 'O'; tr(ecAtom(m, s, 12), -10, 0); tr(ecAtom(m, s, 12), 10, 0); }
    mols.push({ m, x: r() * 1300, y: 120 + r() * 440, v: 18 + r() * 30, a: r() * 360, ph: r() * TAU });
  }
  // the flat: a cloud floor, a sofa, a lamp, a door frame
  const fl = G(g);
  [[600, 650, 640, 90], [240, 630, 220, 70], [960, 635, 240, 75]].forEach(([x, y, rx, ry]) => E('ellipse', { cx: x, cy: y, rx, ry, fill: '#FFFFFF', stroke: '#BFE3F7', 'stroke-width': 5 }, fl));
  E('rect', { x: 0, y: 650, width: 1200, height: 100, fill: '#FFFFFF' }, fl);
  E('rect', { x: 760, y: 520, width: 300, height: 60, rx: 20, fill: '#7FB6FF', stroke: SC_INK, 'stroke-width': 4 }, fl);
  E('rect', { x: 740, y: 560, width: 340, height: 56, rx: 20, fill: '#9CC8FF', stroke: SC_INK, 'stroke-width': 4 }, fl);
  E('path', { d: 'M1120,600 L1120,430', stroke: SC_INK, 'stroke-width': 6 }, fl);
  E('path', { d: 'M1088,430 L1152,430 L1138,392 L1102,392 Z', fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 4 }, fl);
  E('rect', { x: 120, y: 330, width: 150, height: 280, fill: 'none', stroke: '#8A6A50', 'stroke-width': 12 }, fl);   // door frame
  E('rect', { x: 128, y: 338, width: 134, height: 264, fill: '#FFFFFF', opacity: 0.25 }, fl);
  const sign = G(fl); tr(sign, 195, 300);
  E('rect', { x: -78, y: -24, width: 156, height: 48, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, sign);
  T(sign, 0, 10, 'FLAT: AIR', { size: 28, weight: 800, anchor: 'middle', fill: '#2A5A8A' });
  g.upd = (t, speed) => { const k = speed === undefined ? 1 : speed; mols.forEach(({ m, x, y, v, a, ph }) => tr(m, ((x + t * v * k) % 1300) - 50, y + 14 * Math.sin(t * 0.6 + ph), 1, a + t * 12 * k)); };
  g.upd(0);
  return g;
}

function ecLab(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#23404F', '#2F5468', true) }, g);
  let d = '';
  for (let y = 330; y < 560; y += 46) d += `M0,${y} L1200,${y} `;
  for (let x = 0; x < 1200; x += 92) d += `M${x},330 L${x},560 `;
  E('path', { d, stroke: '#3B6278', 'stroke-width': 2 }, g);
  // shelf of bottles
  E('rect', { x: 620, y: 250, width: 520, height: 14, fill: '#8A6A50' }, g);
  const bc = ['#5BD27A', '#FF6B5C', '#4CC9F0', '#FFC247', '#B48CFF', '#F2F7FA', '#FF5FA2'];
  for (let i = 0; i < 7; i++) {
    const x = 650 + i * 70, h = 60 + (i % 3) * 18;
    E('rect', { x: x, y: 250 - h, width: 44, height: h, rx: 8, fill: 'rgba(200,230,250,0.18)', stroke: '#CFE7F5', 'stroke-width': 3 }, g);
    E('rect', { x: x + 4, y: 250 - h * 0.55, width: 36, height: h * 0.55 - 4, rx: 5, fill: bc[i], opacity: 0.8 }, g);
    E('rect', { x: x + 14, y: 238 - h, width: 16, height: 14, fill: '#6B7A88' }, g);
  }
  // goggles sign
  const sg = G(g); tr(sg, 330, 220);
  E('path', { d: 'M0,-70 L74,58 L-74,58 Z', fill: '#FFC247', stroke: SC_INK, 'stroke-width': 5, 'stroke-linejoin': 'round' }, sg);
  E('rect', { x: -40, y: 4, width: 80, height: 30, rx: 14, fill: SC_INK }, sg);
  E('circle', { cx: -18, cy: 19, r: 9, fill: '#9FD8FF' }, sg); E('circle', { cx: 18, cy: 19, r: 9, fill: '#9FD8FF' }, sg);
  T(g, 330, 316, 'GOGGLES ON', { size: 28, weight: 800, anchor: 'middle', fill: '#FFC247' });
  // bench
  E('rect', { x: 0, y: 560, width: 1200, height: 28, fill: '#1A2933' }, g);
  E('rect', { x: 0, y: 588, width: 1200, height: 162, fill: '#3A5A6A' }, g);
  E('path', { d: 'M300,600 L300,750 M600,600 L600,750 M900,600 L900,750', stroke: '#2C4856', 'stroke-width': 5 }, g);
  return g;
}

/* ================= props ================= */
function ecMug(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('path', { d: 'M40,-28 Q72,-28 72,0 Q72,28 40,28', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10 }, g);
  E('path', { d: 'M40,-28 Q72,-28 72,0 Q72,28 40,28', fill: 'none', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('rect', { x: -46, y: -52, width: 92, height: 104, rx: 10, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  T(g, 0, -20, "WORLD'S", { size: 17, weight: 800, anchor: 'middle', fill: '#6B45C8' });
  T(g, 0, 4, 'OKAYEST', { size: 20, weight: 800, anchor: 'middle', fill: '#E8424F' });
  T(g, 0, 26, 'MATCH-', { size: 16, weight: 800, anchor: 'middle', fill: SC_INK });
  T(g, 0, 44, 'MAKER', { size: 16, weight: 800, anchor: 'middle', fill: SC_INK });
  g.steam = E('path', { d: 'M-16,-64 Q-6,-80 -16,-96 M8,-64 Q18,-80 8,-96', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.6, 'stroke-linecap': 'round' }, g);
  return g;
}

const EC_PT = { H: [1, 1], He: [1, 18], C: [2, 14], N: [2, 15], O: [2, 16], Na: [3, 1], Mg: [3, 2], Cl: [3, 17], Ar: [3, 18],
  Fe: [4, 8], Co: [4, 9], Ni: [4, 10], Cu: [4, 11], Zn: [4, 12], Au: [6, 11] };
function ecPeriodic(parent, cell) {
  const c = cell || 34, g = G(parent), cells = {}, gap = 3;
  const x0 = -9 * c, y0 = -4.6 * c;
  const has = (row, col) => row === 1 ? (col === 1 || col === 18) : row <= 3 ? (col <= 2 || col >= 13) : true;
  const pos = (row, col) => [x0 + (col - 1) * c, y0 + (row - 1) * c];
  let d = '';
  for (let row = 1; row <= 7; row++) for (let col = 1; col <= 18; col++) {
    if (!has(row, col)) continue;
    const [x, y] = pos(row, col);
    d += `M${x + gap / 2},${y + gap / 2} h${c - gap} v${c - gap} h${-(c - gap)} Z `;
  }
  for (let row = 0; row < 2; row++) for (let col = 0; col < 14; col++) {
    const x = x0 + (col + 3) * c, y = y0 + (7.4 + row) * c;
    d += `M${x + gap / 2},${y + gap / 2} h${c - gap} v${c - gap} h${-(c - gap)} Z `;
  }
  E('rect', { x: x0 - 14, y: y0 - 14, width: 18 * c + 28, height: 9.4 * c + 28, rx: 12, fill: '#0E2230', stroke: '#3C6E86', 'stroke-width': 3 }, g);   // poster backing
  E('path', { d, fill: '#1B4457', stroke: '#3C6E86', 'stroke-width': 1.5 }, g);
  const hiCol = { H: '#F4F7FA', He: '#CDB2FF', C: '#8F9CAB', N: '#86A2FF', O: '#FF6B5C', Na: '#C9D3DC', Mg: '#C9D3DC', Cl: '#B8E86A', Ar: '#CDB2FF',
    Fe: '#C98B6B', Co: '#7FA6C9', Ni: '#A9B5C0', Cu: '#E59A5F', Zn: '#A9B5C0', Au: '#FFC247' };
  for (const sym in EC_PT) {
    const [x, y] = pos(...EC_PT[sym]);
    const hl = E('rect', { x: x + gap / 2, y: y + gap / 2, width: c - gap, height: c - gap, rx: 3, fill: hiCol[sym], opacity: 0 }, g);
    const tx = T(g, x + c / 2, y + c * 0.66, sym, { size: Math.round(c * 0.48), weight: 800, anchor: 'middle', fill: '#CFE7F5' });
    cells[sym] = { hl, tx, x: x + c / 2, y: y + c / 2 };
  }
  g.hi = (sym, v) => { const k = cells[sym]; if (!k) return; attr(k.hl, 'opacity', clamp(v)); attr(k.tx, 'fill', v > 0.5 ? SC_INK : '#CFE7F5'); };
  g.at = sym => cells[sym] ? [cells[sym].x, cells[sym].y] : [0, 0];
  return g;
}

function ecFilter(parent) {
  const g = G(parent);
  const fk = flask(g, 0.9, { level: 0, liquid: '#9FD8FF' }); tr(fk, 0, 150);
  const drop = E('path', { d: 'M0,-8 Q6,2 0,6 Q-6,2 0,-8 Z', fill: '#9FD8FF' }, g);
  E('path', { d: 'M-100,-150 L100,-150 L14,-30 L14,40 L-14,40 L-14,-30 Z', fill: 'rgba(200,230,250,0.12)', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M-86,-146 L86,-146 L0,-40 Z', fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   // filter paper
  const mud = E('path', { d: '', fill: '#A97C4A', opacity: 0.6 }, g);
  const sand = G(g), r = rng(12);
  for (let i = 0; i < 22; i++) { const y = -60 - r() * 52, hw = (y + 40) / -106 * 86 * 0.85; E('circle', { cx: ((r() * 2 - 1) * hw).toFixed(1), cy: y.toFixed(1), r: 4 + r() * 3, fill: ball('#EED39A', '#B08A46') }, sand); }
  let st = { residue: 0, filtrate: 0, cloudy: 0 };
  g.set = v => {
    st = Object.assign(st, v || {});
    op(sand, st.residue);
    const top = -146 + 60 * (1 - st.cloudy), hw = (top + 40) / -106 * 86;
    attr(mud, 'd', st.cloudy > 0.02 ? `M${-hw},${top} L${hw},${top} L0,-40 Z` : '');
    fk.set(st.filtrate * 0.7);
  };
  g.upd = t => { const f = (t * 1.6) % 1; tr(drop, 0, 50 + f * 120); op(drop, st.cloudy > 0.05 ? 1 - f : 0); };
  g.set({}); g.upd(0);
  return g;
}

function ecDistil(parent) {
  const g = G(parent);
  const bn = bunsen(g, 0.7); tr(bn, 0, 200);
  E('path', { d: 'M-60,40 L60,40 M-50,40 L-64,200 M50,40 L64,200', stroke: '#6B7A88', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);   // tripod
  const fk = flask(g, 0.85, { level: 0.6, liquid: '#9FD8FF' }); tr(fk, 0, -40);
  E('rect', { x: -22, y: -132, width: 44, height: 16, rx: 4, fill: '#6B4E28' }, g);   // bung
  const path = 'M0,-132 L0,-210 L170,-210';
  E('path', { d: path, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 10, 'stroke-linejoin': 'round' }, g);
  // condenser: from (170,-210) sloping down to (560,-40)
  const cg = G(g); cg.setAttribute('transform', 'translate(170 -210) rotate(23.5)');
  E('rect', { x: 40, y: -32, width: 340, height: 64, rx: 18, fill: 'rgba(76,201,240,0.28)', stroke: GLASS.stroke, 'stroke-width': 4 }, cg);
  E('line', { x1: 0, y1: 0, x2: 425, y2: 0, stroke: GLASS.stroke, 'stroke-width': 9 }, cg);
  E('path', { d: 'M330,32 L330,60 M90,-32 L90,-60', stroke: GLASS.stroke, 'stroke-width': 9 }, cg);
  const wIn = arrow(cg, 330, 110, 330, 66, { color: '#4CC9F0', width: 5 }); wIn.set(1);
  const wOut = arrow(cg, 90, -66, 90, -110, { color: '#4CC9F0', width: 5 }); wOut.set(1);
  const bk = beaker(g, 120, 140, { level: 0, liquid: '#9FD8FF' }); tr(bk, 580, 70);
  const vap = [], drips = [];
  for (let i = 0; i < 7; i++) vap.push(E('circle', { r: 5, fill: '#FFFFFF', opacity: 0.8 }, g));
  for (let i = 0; i < 2; i++) drips.push(E('path', { d: 'M0,-8 Q6,2 0,6 Q-6,2 0,-8 Z', fill: '#9FD8FF' }, g));
  g.wIn = wIn; g.wOut = wOut; g.flask = fk; g.beaker = bk; g.condenser = cg;
  let st = { heat: 0, flask: 0.6, collect: 0 };
  // points along the vapour route
  const route = [[0, -110], [0, -210], [170, -210], [560, -40]];
  const along = f => {
    const L = [78 + 22, 100 + 70, 170, 425]; let d = f * (100 + 170 + 425), i = 1;
    const seg = [[route[0], route[1], 100], [route[1], route[2], 170], [route[2], route[3], 425]];
    for (const [a, b, len] of seg) { if (d <= len) return [lerp(a[0], b[0], d / len), lerp(a[1], b[1], d / len)]; d -= len; }
    return route[3];
  };
  g.set = v => { st = Object.assign(st, v || {}); bn.set(st.heat > 0.05 ? 'blue' : 'off'); fk.set(st.flask); bk.set(st.collect * 0.75); };
  g.upd = t => {
    bn.upd(t);
    vap.forEach((c, i) => { const f = ((t * 0.35 + i / vap.length) % 1); const [x, y] = along(f); attr(c, 'cx', x); attr(c, 'cy', y); op(c, st.heat * (f < 0.62 ? 0.85 : 0.85 * (1 - (f - 0.62) / 0.38))); attr(c, 'fill', f < 0.55 ? '#FFFFFF' : '#9FD8FF'); });
    drips.forEach((d, i) => { const f = ((t * 1.2 + i * 0.5) % 1); tr(d, 560, -32 + f * 70); op(d, st.heat > 0.3 ? 1 - f * 0.5 : 0); });
  };
  g.set({}); g.upd(0);
  return g;
}

function ecChroma(parent, o) {
  o = o || {};
  const lanes = o.lanes || [
    { label: 'NOTE', dyes: [['#3B82F6', 0.82], ['#FF5FA2', 0.55], ['#FFC247', 0.3]] },
    { label: 'MUM', dyes: [['#3B82F6', 0.82], ['#56D69B', 0.42]] },
    { label: 'DAD', dyes: [['#B48CFF', 0.68], ['#FFC247', 0.3]] },
    { label: 'BROTHER', dyes: [['#3B82F6', 0.82], ['#FF5FA2', 0.55], ['#FFC247', 0.3]] },
  ];
  const g = G(parent), n = lanes.length, laneW = 110, pw = n * laneW + 40, ph = 380;
  E('rect', { x: -pw / 2, y: -ph / 2, width: pw, height: ph + 14, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 3 }, g);
  E('rect', { x: -pw / 2 - 20, y: -ph / 2 - 16, width: pw + 40, height: 16, rx: 5, fill: '#8A6A50' }, g);   // the rod it hangs from
  const base = ph / 2 - 70, top = -ph / 2 + 56;
  const wet = E('rect', { x: -pw / 2, y: base, width: pw, height: ph / 2 - base, fill: '#BFE3F7', opacity: 0.55 }, g);
  E('line', { x1: -pw / 2 + 12, y1: base, x2: pw / 2 - 12, y2: base, stroke: '#7D8A96', 'stroke-width': 3, 'stroke-dasharray': '10 6' }, g);   // pencil line
  const front = E('line', { x1: -pw / 2, y1: base, x2: pw / 2, y2: base, stroke: '#4CC9F0', 'stroke-width': 3 }, g);
  const spots = [];
  lanes.forEach((ln, i) => {
    const x = -pw / 2 + 20 + laneW * (i + 0.5);
    const black = E('ellipse', { cx: x, cy: base, rx: 13, ry: 10, fill: '#22252E' }, g);
    const ds = ln.dyes.map(([c, h]) => ({ el: E('ellipse', { cx: x, cy: base, rx: 13, ry: 10, fill: c, opacity: 0.9 }, g), h }));
    T(g, x, -ph / 2 + 32, ln.label, { size: 24, weight: 800, anchor: 'middle', fill: '#3A4550' });
    spots.push({ black, ds });
  });
  const bk = beaker(g, pw + 60, 140, { level: 0.45, liquid: '#BFE3F7', marks: false, opacity: 0.6 }); tr(bk, 0, ph / 2 - 30);
  g.beaker = bk;
  g.lanes = spots; g.base = base; g.top = top; g.laneX = i => -pw / 2 + 20 + laneW * (i + 0.5);
  g.set = p => {
    p = clamp(p);
    const fy = base - (base - top) * p;
    attr(front, 'y1', fy); attr(front, 'y2', fy); op(front, p > 0.02 ? 1 : 0);
    attr(wet, 'y', fy); attr(wet, 'height', ph / 2 - fy);
    spots.forEach(({ black, ds }) => {
      op(black, 1 - clamp(p * 4));
      ds.forEach(({ el, h }) => { attr(el, 'cy', base - (base - top) * p * h); attr(el, 'ry', 10 + 6 * p); });
    });
  };
  g.set(0);
  return g;
}

function ecSepFunnel(parent) {
  const g = G(parent);
  E('path', { d: 'M150,-250 L150,260 M150,-150 L60,-150', stroke: '#6B7A88', 'stroke-width': 10, 'stroke-linecap': 'round' }, g);   // stand and clamp
  E('rect', { x: 90, y: 250, width: 140, height: 18, rx: 4, fill: '#6B7A88' }, g);
  const bk = beaker(g, 130, 130, { level: 0, liquid: C.water }); tr(bk, 0, 190);
  const hw = y => lerp(96, 12, clamp((y + 150) / 200));   // funnel half-width at y (top y = -150, neck y = 50)
  const body = 'M-12,50 L-96,-150 Q-96,-196 0,-196 Q96,-196 96,-150 L12,50 Z';
  E('path', { d: body, fill: 'rgba(200,230,250,0.10)' }, g);
  const water = E('path', { d: '', fill: C.water, opacity: 0.85 }, g);
  const oil = E('path', { d: '', fill: '#F2C94C', opacity: 0.9 }, g);
  const stream = E('rect', { x: -4, y: 104, width: 8, height: 60, rx: 4, fill: C.water, opacity: 0.85 }, g);
  E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M-8,50 L-8,110 M8,50 L8,110', stroke: GLASS.stroke, 'stroke-width': 4 }, g);
  const tap = G(g); tr(tap, 0, 80);
  E('rect', { x: -22, y: -9, width: 44, height: 18, rx: 6, fill: '#E8424F', stroke: SC_INK, 'stroke-width': 3 }, tap);
  const band = (y0, y1) => `M${-hw(y0)},${y0} L${hw(y0)},${y0} L${hw(y1)},${y1} L${-hw(y1)},${y1} Z`;
  g.tap = tap;
  g.set = p => {
    p = clamp(p);
    const wTop = lerp(-40, 48, p), oTop = wTop - 90;
    attr(water, 'd', p < 0.995 ? band(wTop, 50) + ` M-8,50 L8,50 L8,${p > 0.02 ? 110 : 80} L-8,${p > 0.02 ? 110 : 80} Z` : '');
    attr(oil, 'd', band(oTop, wTop));
    tr(tap, 0, 80, 1, p > 0.02 && p < 0.995 ? 90 : 0);
    op(stream, p > 0.02 && p < 0.995 ? 1 : 0);
    bk.set(p * 0.6);
  };
  g.set(0);
  return g;
}

function ecTehO(parent, s) {
  const g = G(parent); tr(g, 0, 0, s || 1);
  E('ellipse', { cx: 0, cy: 92, rx: 110, ry: 20, fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 4 }, g);   // saucer
  const cup = 'M-62,-80 L62,-80 L52,84 Q50,92 40,92 L-40,92 Q-50,92 -52,84 Z';
  E('path', { d: cup, fill: 'rgba(200,230,250,0.15)' }, g);
  E('path', { d: 'M-60,-56 L60,-56 L52,84 Q50,90 40,90 L-40,90 Q-50,90 -52,84 Z', fill: '#B5651D', opacity: 0.85 }, g);
  const sugar = E('path', { d: '', fill: '#FFFFFF', opacity: 0.95 }, g);
  E('path', { d: cup, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 5, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M62,-50 Q104,-44 100,4 Q96,40 58,40', fill: 'none', stroke: GLASS.stroke, 'stroke-width': 8 }, g);
  E('rect', { x: 36, y: -66, width: 7, height: 120, rx: 3, fill: GLASS.shine }, g);
  g.set = v => { v = clamp(v); const h = 34 * v; attr(sugar, 'd', v > 0.02 ? `M-50,${88 - h} Q0,${80 - h * 1.5} 50,${88 - h} L48,88 L-48,88 Z` : ''); };
  g.set(0);
  return g;
}

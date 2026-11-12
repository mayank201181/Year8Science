/* BLOCK 118 (Claude Sitcom Ep 5, The Periodic Table): cast, sets and props.
   Bundled after engine lib.js, kit.js and sitcom.js. Every top-level name starts with `bk`, except `cast`.
   Speech, faces, confessionals and lower thirds come from the shared kit (engine/sitcom.js):
   scTalk(S, t, who), scConfessional(parent, top, bottom), scLowerThird(parent, name, role), scClipboard(...).

   ---------------------------------------------------------------------------------------------
   CAST   cast(parent, kind, o) -> g (made with scMake; origin = centre, about 200 px tall at s = 1)
     o: { s (scale), mood }     every frame: g.set({ t, talk: scTalk(S, t, 'sonny'), mood, look, sweat, still })
     moods: neutral | happy | smug | annoyed | sad | shock | deadpan
     Speaking cast (each wears a round badge with its chemical symbol):
       'silas'   Silas, silicon (Si): slate-blue crystal, green caretaker's cap "118", key ring, tired eye bags.
                 Default mood deadpan. The straight man.
       'sonny'   Sonny, sodium (Na): shiny silver ball, sodium-orange flame hair, ONE blue electron orbiting him.
                 g.electron = that electron's <g> (op() it to 0 once he has given it away); o.electron:false hides it.
                 o.speed sets how fast it orbits (default 1).
       'chloe'   Chloe, chlorine (Cl2): two yellow-green spheres stuck together (diatomic); her face on the left
                 sphere, her "other half" (right sphere) has a smaller face that copies her mood. Pink heart clip.
                 g.set({ ..., talkB }) would move the other half's mouth: never needed, she never talks.
       'helena'  Helena, helium (He): a pink helium balloon with a tiara and pearls; floats (big bob). Default smug.
       'harold'  Harold, hydrogen (H): the smallest; a pale white ball, one droopy curl, his own little rain
                 cloud (g.cloud; op() it). Default sad.
       'gemma'   Gemma, germanium (Ge): silver-lilac rounded square, big round glasses, "NEW" sticker. Default happy.
       'ahgong'  Ah Gong, argon (Ar): violet ball in a white singlet, bushy white eyebrows, sitting on a red plastic
                 stool. NEVER bobs (inert). Default deadpan. Silent until the stinger.
       'kavya'   Kavya (scKavya). o.home: true swaps the PE shirt for a lavender home T-shirt (cold open, 11 pm).
     Extras (no lines, but full faces so they can react):
       'lithium'   small alkali cousin, crimson flame hair (lithium burns crimson), 1 electron, badge Li.
       'potassium' bigger alkali cousin, lilac flame hair (potassium burns lilac), 1 electron, badge K.
       'fluorine'  pale-yellow halogen pair, badge F2 (Auntie Fluorine: give her mood 'annoyed').
       'bromine'   red-brown halogen pair with liquid drips, badge Br2.
       'iodine'    dark-grey halogen pair with purple vapour wisps, badge I2.
       'neon'      orange-red glowing ball, badge Ne.
       'carbon'    grey ball, o.label: 'C-12' or 'C-14' on the badge (the isotope "twins" in flat six).

   ---------------------------------------------------------------------------------------------
   THE BUILDING   bkBlock(parent, o) -> g: the periodic table AS a block of flats (and as Kavya's poster).
     Layout: the real 18-column table. Origin = centre of the main grid (18 x 7 flats). One flat = BK_CW x BK_CH
     (56 x 50) at s = 1, so the main grid is 1008 x 350; the f-block "annexe" (57-71, 89-103) sits below it.
     Period 1 is the TOP floor ("the first floor is at the top"). Groups are the stacks (columns).
     o: { numbers: true (atomic number in each flat), gaps: [32] (flats shown EMPTY with a "?": Mendeleev's gaps) }
     g.flats[z] = { g, wall, sym, num, x, y, w, h, cx, cy }   one per element, z = 1..118 (local coords)
     g.pt(z) -> [cx, cy] centre of flat z (local). Screen = (blockX + s * cx, blockY + s * cy).
     o.look: 1 (default) = the block of flats, 0 = Kavya's poster.  g.look(p) blends them (0 poster .. 1 building).
     g.paper   poster look (cream paper, title, thumb tacks)
     g.deco    building look behind the flats (roof slabs, void deck, "BLK 118" sign, annexe label);
     g.decoFront  windows and laundry poles over the flats. g.look(p) sets all of these.
     g.layers  colour overlays (one <path> each, opacity 0 unless noted): op(g.layers.metal, p) ...
               poster (the poster's own colouring: metals blue, non-metals orange, metalloids lilac, noble pink;
               opacity 1 by default), metal, nonmetal, metalloid, alkali (group 1 minus H), alkaline (group 2),
               halogen (group 7), noble (group 0), hydrogen.
     g.stacks[c]  highlight frame for column c = 1..18 (op it); g.floors[r] for row r = 1..7.
     g.labels  group numbers above the stacks (1, 2, 3...7, 0 school numbering) and period numbers 1-7 on the left: op it.
     g.stair   the metal / non-metal staircase line (bright yellow): g.stair.set(p) draws it on (0..1).
     g.gap[z]  the "empty flat" overlay for each z in o.gaps: op(g.gap[32], v). When it fades, Ge is moved in.
     Elements: about 380 at default; o.numbers: false saves 118.
     BK_SYM[z], BK_NAME[z] (1..36 + a few more), BK_MASS[z] (rounded, as school tables print them), bkPos(z) -> [col, row].

   ---------------------------------------------------------------------------------------------
   SETS (full stage, 1200 x 750)
     bkBedroom(parent)   Kavya's HDB bedroom at 11 pm: dim purple wall, window with lit HDB blocks at night,
                         desk (top edge y = 600) with lamp glow, open textbook, bubble tea, digital clock "11:00 PM"
                         (g.clock text: setText it). Poster spot: BK_POSTER = { x: 800, y: 300, s: 0.6 } (put a bkBlock
                         there, in poster look). Kavya bust: about (330, 520), s 1.25, in front of the desk.
     bkVoidDeck(parent)  daytime void deck: pillars, stone chess table and stools, a wall of letterboxes at the back
                         (g.boxes: centre of the letterbox wall, [x, y]), notice board (g.board: [x, y]).
     bkCorridor(parent)  HDB common corridor, front-on: cream wall, a flat door with grille at x = 600
                         (g.door.set(open 0..1)), a number plate above it (g.plate: setText(g.plate, '#03-01')),
                         shoe rack, potted plants, corridor floor (y > 640).
     bkOilFlat(parent)   inside Sonny's flat: everything under amber oil, furniture silhouettes, rising bubbles; g.upd(t).
     bkPenthouse(parent) Helena's penthouse at night: tall window with city lights, velvet curtains, chandelier,
                         velvet rope with a "NO REACTIONS" sign; floor y > 600.
     bkConf(parent, kind)  a confessional (scConfessional) in that character's colours (BK_TINT); g.set(p, t).
     BK_LT[kind] = [NAME, role] for scLowerThird.

   PROPS (drawn around their own origin)
     bkBadge(parent, sym, o)        round symbol badge (o.r, o.fill, o.ink).
     bkLetterbox(parent, el, o)     a letterbox that is an element box: el = { z, sym, name, mass }; about 230 x 280.
                                    g.parts = { z, sym, name, mass } (the four texts, to pulse/highlight one).
     bkAtom(parent, shells, o)      shell (Bohr) diagram: shells like [2, 8, 1]; o: { p, n (nucleus balls), label ('11p 12n'),
                                    r0 (first shell radius, default 70), dr (spacing, 46), er (electron radius, 11) }.
                                    g.set(n) shows the first n electrons (filling inside-out); g.spin(t) turns the shells;
                                    g.e[i] = { el, shell } for each electron; g.outer = the outer shell's electrons;
                                    g.nucleus; g.ring[k] = shell k circle. About 150 x 150 for one shell, 400 wide for three.
     bkTrough(parent)               glass trough of water behind a safety screen, about 520 x 220; water surface at y = -40.
     bkSign(parent, title, body, o) a Town-Council-style notice (red header): o.w, o.h; body may contain '\n'.
     bkStool(parent)                red plastic stool (Ah Gong's).
     bkBox(parent, label)           a moving box (Gemma's), label like 'GEMMA. FRAGILE.'
*/

/* ---------- element data ---------- */
const BK_SYM = [''].concat('H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' '));
const BK_NAME = [''].concat('hydrogen helium lithium beryllium boron carbon nitrogen oxygen fluorine neon sodium magnesium aluminium silicon phosphorus sulfur chlorine argon potassium calcium scandium titanium vanadium chromium manganese iron cobalt nickel copper zinc gallium germanium arsenic selenium bromine krypton'.split(' '));
BK_NAME[37] = 'rubidium'; BK_NAME[52] = 'tellurium'; BK_NAME[53] = 'iodine'; BK_NAME[54] = 'xenon'; BK_NAME[55] = 'caesium'; BK_NAME[86] = 'radon'; BK_NAME[118] = 'oganesson';
const BK_MASS = [0, 1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35.5, 40, 39, 40, 45, 48, 51, 52, 55, 56, 59, 59, 63.5, 65, 70, 73, 75, 79, 80, 84];
BK_MASS[37] = 85; BK_MASS[52] = 128; BK_MASS[53] = 127; BK_MASS[54] = 131; BK_MASS[55] = 133;

function bkPos(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [18, 1];
  if (z <= 10) return z <= 4 ? [z - 2, 2] : [z + 8, 2];
  if (z <= 18) return z <= 12 ? [z - 10, 3] : [z, 3];
  if (z <= 36) return [z - 18, 4];
  if (z <= 54) return [z - 36, 5];
  if (z <= 56) return [z - 54, 6];
  if (z <= 71) return [z - 54, 9];
  if (z <= 86) return [z - 68, 6];
  if (z <= 88) return [z - 86, 7];
  if (z <= 103) return [z - 86, 10];
  return [z - 100, 7];
}
const BK_CAT = (() => {
  const c = [];
  for (let z = 1; z <= 118; z++) c[z] = 'metal';
  [1, 6, 7, 8, 15, 16, 34].forEach(z => c[z] = 'nonmetal');
  [9, 17, 35, 53, 85, 117].forEach(z => c[z] = 'halogen');       // non-metals
  [2, 10, 18, 36, 54, 86, 118].forEach(z => c[z] = 'noble');     // non-metals
  [5, 14, 32, 33, 51, 52].forEach(z => c[z] = 'metalloid');
  return c;
})();
const BK_CW = 56, BK_CH = 50;
const BK_POSTER = { x: 800, y: 300, s: 0.6 };

/* ---------- small helpers ---------- */
function bkBadge(parent, sym, o) {
  o = o || {};
  const g = G(parent), r = o.r || 22;
  E('circle', { r, fill: o.fill || '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, g);
  const size = sym.length > 2 ? r * 0.72 : r * 0.95;
  T(g, 0, size * 0.36, sym, { size, weight: 800, anchor: 'middle', fill: o.ink || SC_INK });
  return g;
}
function bkFlame(parent, w, h, c1, c2) {      // a spiky flame-shaped tuft of hair, base on y = 0
  const g = G(parent);
  const d = `M${-w / 2},0 Q${-w * 0.55},${-h * 0.5} ${-w * 0.3},${-h * 0.75} Q${-w * 0.25},${-h * 0.45} ${-w * 0.1},${-h * 0.55} Q${-w * 0.12},${-h * 0.9} ${w * 0.05},${-h} Q${w * 0.08},${-h * 0.62} ${w * 0.22},${-h * 0.7} Q${w * 0.2},${-h * 0.42} ${w * 0.38},${-h * 0.62} Q${w * 0.6},${-h * 0.3} ${w / 2},0 Z`;
  E('path', { d, fill: c1, stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
  E('path', { d, fill: c2, transform: 'translate(0 -2) scale(0.55 0.6)' }, g);
  return g;
}

/* ---------- the cast ---------- */
function bkAlkali(g, r, hair1, hair2, sym, orbit) {
  // a shiny alkali-metal ball with flame hair and its single outer electron on a dashed orbit
  const hairG = G(g); tr(hairG, 0, -r * 0.82);
  bkFlame(hairG, r * 1.25, r * 0.95, hair1, hair2);
  E('circle', { r, fill: ball('#EEF2F6', '#7D8995'), stroke: '#4E5966', 'stroke-width': 5 }, g);
  E('path', { d: `M${-r * 0.62},${-r * 0.42} Q${-r * 0.45},${-r * 0.7} ${-r * 0.12},${-r * 0.78}`, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, g);
  const b = bkBadge(g, sym, { r: r * 0.24 }); tr(b, r * 0.58, r * 0.6);
  const orb = G(g);
  E('ellipse', { rx: r * 1.42, ry: r * 0.42, fill: 'none', stroke: '#9FD8FF', 'stroke-width': 3, 'stroke-dasharray': '9 8', opacity: 0.75, transform: 'rotate(-14)' }, orb);
  const e = G(g);
  E('circle', { r: r * 0.16 + 2, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': 3 }, e);
  E('path', { d: `M${-r * 0.07},0 L${r * 0.07},0`, stroke: '#FFFFFF', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, e);
  return { orb, e, place: (t, sp) => {
    const a = t * 1.6 * sp + 0.6, x = Math.cos(a) * r * 1.42, y = Math.sin(a) * r * 0.42, k = -14 * Math.PI / 180;
    tr(e, x * Math.cos(k) - y * Math.sin(k), x * Math.sin(k) + y * Math.cos(k));
  } };
}
function bkHalogen(g, c1, c2, stroke, sym, extra) {
  // a diatomic pair: two touching spheres (left one is the face), badge on the join
  E('circle', { cx: 52, cy: 6, r: 66, fill: ball(c1, c2), stroke, 'stroke-width': 5 }, g);
  E('circle', { cx: -40, cy: 0, r: 76, fill: ball(c1, c2), stroke, 'stroke-width': 5 }, g);
  if (extra) extra(g);
  const b = bkBadge(g, sym, { r: 24 }); tr(b, 8, 74);
}

function cast(parent, kind, o) {
  o = o || {};
  const base = { s: o.s, mood: o.mood, seed: 3 };
  let c;
  if (kind === 'kavya') {
    c = scKavya(parent, { s: o.s, mood: o.mood });
    if (o.home) {
      c.querySelectorAll('path').forEach(p => { if (p.getAttribute('fill') === '#2E7DD8') p.setAttribute('fill', '#9C7BD8'); });
      c.querySelectorAll('text').forEach(t => { if (t.textContent === '8') t.style.display = 'none'; });
    }
    return c;
  }
  if (kind === 'silas') {
    c = scMake(parent, Object.assign(base, {
      seed: 5, bob: 2, mood: o.mood || 'deadpan',
      draw: g => {
        const P = [[-60, -86], [60, -86], [96, -14], [74, 92], [-74, 92], [-96, -14]];
        const d = 'M' + P.map(p => p.join(',')).join(' L') + ' Z';
        E('path', { d, fill: ball('#9DB3DB', '#3A4F7A'), stroke: '#24324F', 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
        E('path', { d: 'M-60,-86 L-30,-40 L30,-40 L60,-86 M-96,-14 L-30,-40 M96,-14 L30,-40 M-74,92 L-52,58 M74,92 L52,58', fill: 'none', stroke: '#DCE6FA', 'stroke-width': 3, opacity: 0.45 }, g);
        // keys on a ring, hanging at his right side
        const k = G(g); tr(k, 100, 34);
        E('circle', { r: 13, fill: 'none', stroke: '#C9CED6', 'stroke-width': 4 }, k);
        [[-8, 26, -18], [4, 30, 4], [14, 24, 22]].forEach(([x, y, a]) => {
          const kk = G(k); tr(kk, x, y - 12, 1, a);
          E('rect', { x: -3, y: 0, width: 6, height: 22, rx: 2, fill: '#E3B341', stroke: SC_INK, 'stroke-width': 2 }, kk);
          E('circle', { cy: -2, r: 6, fill: '#E3B341', stroke: SC_INK, 'stroke-width': 2 }, kk);
        });
        // caretaker's cap
        const cap = G(g); tr(cap, 0, -84);
        E('path', { d: 'M-66,4 Q-64,-50 0,-52 Q64,-50 66,4 Z', fill: '#2F7A57', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        E('path', { d: 'M-70,2 L96,2 Q104,14 88,16 L-66,16 Q-76,12 -70,2 Z', fill: '#24604A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, cap);
        E('rect', { x: -30, y: -34, width: 60, height: 26, rx: 6, fill: '#F2E8C8', stroke: SC_INK, 'stroke-width': 2.5 }, cap);
        T(cap, 0, -14, '118', { size: 20, weight: 800, anchor: 'middle', fill: '#24604A' });
        // tired eye bags
        E('path', { d: 'M-46,26 Q-28,36 -10,26 M10,26 Q28,36 46,26', fill: 'none', stroke: '#24324F', 'stroke-width': 3, opacity: 0.55, 'stroke-linecap': 'round' }, g);
        const b = bkBadge(g, 'Si', { r: 22 }); tr(b, -50, 62);
      },
      face: { x: 0, y: 0, eye: 18, gap: 56, mouthW: 44, mouthY: 42, lidCol: '#7F96C2' },
      sweat: [[-92, -40], [96, -30]],
    }));
  } else if (kind === 'sonny' || kind === 'lithium' || kind === 'potassium') {
    const spec = { sonny: [84, '#FFB52E', '#FFE45C', 'Na', 1], lithium: [64, '#FF3D5A', '#FF9AA8', 'Li', 7], potassium: [98, '#B98CFF', '#E6D4FF', 'K', 13] }[kind];
    let al = null;
    const r = spec[0];
    c = scMake(parent, Object.assign(base, {
      seed: spec[4], bob: kind === 'lithium' ? 2 : 6, mood: o.mood || (kind === 'sonny' ? 'happy' : 'neutral'),
      draw: g => { al = bkAlkali(g, r, spec[1], spec[2], spec[3]); },
      face: { x: 0, y: -4, eye: r * 0.2, gap: r * 0.62, mouthW: r * 0.52, mouthY: r * 0.4, lidCol: '#C9D1DA' },
      sweat: [[-r * 0.95, -r * 0.3], [r * 0.98, -r * 0.2]],
      upd: (t) => al.place(t, o.speed === undefined ? 1 : o.speed),
    }));
    c.electron = al.e; c.orbit = al.orb;
    if (o.electron === false) { op(al.e, 0); op(al.orb, 0); }
  } else if (kind === 'chloe' || kind === 'fluorine' || kind === 'bromine' || kind === 'iodine') {
    const spec = {
      chloe: ['#D9F26E', '#7DA322', '#5E7F17', 'Cl₂', '#C6E35A'],
      fluorine: ['#FFF6B8', '#C9B640', '#9C8A20', 'F₂', '#F2E79A'],
      bromine: ['#D96A4A', '#6E2414', '#4E180C', 'Br₂', '#C2563A'],
      iodine: ['#7A7484', '#2C2933', '#1E1B24', 'I₂', '#5E5A66'],
    }[kind];
    c = scMake(parent, Object.assign(base, {
      seed: kind === 'chloe' ? 9 : 14, bob: 5, mood: o.mood || (kind === 'chloe' ? 'happy' : 'neutral'),
      draw: g => {
        if (kind === 'chloe' || kind === 'fluorine') {      // gas wisps
          E('path', { d: 'M-128,-30 q-16,-14 0,-26 q14,-10 4,-26 M140,-40 q16,-14 2,-28 q-12,-10 0,-24 M-120,70 q-18,4 -20,20', fill: 'none', stroke: spec[0], 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.7 }, g);
        }
        bkHalogen(g, spec[0], spec[1], spec[2], spec[3], gg => {
          if (kind === 'bromine') E('path', { d: 'M-70,64 q6,22 0,30 q-6,-8 0,-30 Z M-20,74 q5,18 0,26 q-5,-8 0,-26 Z M90,62 q5,18 0,26 q-5,-8 0,-26 Z', fill: '#B44A2E', stroke: spec[2], 'stroke-width': 2 }, gg);
          if (kind === 'iodine') E('path', { d: 'M-110,-70 q-14,-16 4,-30 q16,-10 2,-30 M120,-60 q16,-18 -2,-32 M30,-80 q12,-16 -2,-32', fill: 'none', stroke: '#B07CFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.85 }, gg);
        });
        if (kind === 'chloe') {
          const h = G(g); tr(h, -98, -58, 1, -18);
          E('path', { d: 'M0,10 C-20,-6 -14,-24 0,-14 C14,-24 20,-6 0,10 Z', fill: '#FF5FA2', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, h);
        }
      },
      face: { x: -40, y: -8, eye: 18, gap: 50, mouthW: 40, mouthY: 32, lidCol: spec[4] },
      faceB: { x: 52, y: -2, eye: 13, gap: 38, mouthW: 28, mouthY: 24, lidCol: spec[4] },
    }));
  } else if (kind === 'helena') {
    c = scMake(parent, Object.assign(base, {
      seed: 11, bob: 9, mood: o.mood || 'smug',
      draw: g => {
        E('path', { d: 'M2,96 Q-14,116 6,128 Q24,140 4,156', fill: 'none', stroke: '#E8E0EC', 'stroke-width': 3 }, g);   // string
        E('path', { d: 'M-10,96 L10,96 L4,84 L-4,84 Z', fill: '#D9779F', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); // knot
        E('ellipse', { cx: 0, cy: -8, rx: 84, ry: 94, fill: ball('#FFD6EA', '#D46D9C'), stroke: '#A84A77', 'stroke-width': 5 }, g);
        E('ellipse', { cx: -40, cy: -54, rx: 14, ry: 24, fill: '#FFFFFF', opacity: 0.55, transform: 'rotate(28 -40 -54)' }, g);
        // tiara
        E('path', { d: 'M-40,-96 L-34,-126 L-18,-104 L0,-136 L18,-104 L34,-126 L40,-96 Z', fill: '#FFD45C', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
        E('circle', { cx: 0, cy: -112, r: 6, fill: '#7FD3FF', stroke: SC_INK, 'stroke-width': 2 }, g);
        // pearls
        for (let i = 0; i < 9; i++) { const a = Math.PI * (0.18 + i * 0.08); E('circle', { cx: Math.cos(a) * 62, cy: 6 + Math.sin(a) * 52, r: 6.5, fill: '#FFFFFF', stroke: '#B9A9C0', 'stroke-width': 2 }, g); }
        const b = bkBadge(g, 'He', { r: 20 }); tr(b, 56, 52);
      },
      face: { x: 0, y: -20, eye: 18, gap: 54, mouthW: 38, mouthY: 34, lidCol: '#F6B2D2' },
    }));
  } else if (kind === 'neon') {
    c = scMake(parent, Object.assign(base, {
      seed: 12, bob: 4, mood: o.mood || 'smug',
      draw: g => {
        E('circle', { r: 130, fill: glow('#FF6A3D') }, g);
        E('circle', { r: 76, fill: ball('#FFB08A', '#E2461E'), stroke: '#A8300F', 'stroke-width': 5 }, g);
        const b = bkBadge(g, 'Ne', { r: 20 }); tr(b, 50, 52);
      },
      face: { x: 0, y: -6, eye: 16, gap: 48, mouthW: 34, mouthY: 30, lidCol: '#FF9A72' },
    }));
  } else if (kind === 'harold') {
    let cloud = null;
    c = scMake(parent, Object.assign(base, {
      seed: 4, bob: 2, mood: o.mood || 'sad',
      draw: g => {
        E('path', { d: 'M2,-62 Q-6,-92 18,-96 Q34,-96 30,-80', fill: 'none', stroke: '#5C6B7A', 'stroke-width': 5, 'stroke-linecap': 'round' }, g);   // the one curl
        E('circle', { cy: 6, r: 68, fill: ball('#FFFFFF', '#A9B5C0'), stroke: '#7D8B99', 'stroke-width': 5 }, g);
        const b = bkBadge(g, 'H', { r: 18 }); tr(b, 44, 52);
        cloud = G(g); tr(cloud, -8, -128);
        E('path', { d: 'M-46,8 Q-58,-12 -36,-18 Q-30,-40 -6,-34 Q8,-50 28,-34 Q52,-36 48,-10 Q60,4 44,10 Z', fill: '#8E9BAA', stroke: '#5C6B7A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, cloud);
        cloud.rain = E('path', { d: '', stroke: '#7FB6E8', 'stroke-width': 3, 'stroke-linecap': 'round' }, cloud);
      },
      face: { x: 0, y: 4, eye: 15, gap: 42, mouthW: 30, mouthY: 28, lidCol: '#E2E8EE' },
      upd: (t) => { let d = ''; for (let i = 0; i < 5; i++) { const x = -32 + i * 16, y = 18 + ((t * 70 + i * 13) % 34); d += `M${x},${y.toFixed(1)} l-3,9 `; } attr(cloud.rain, 'd', d); },
    }));
    c.cloud = cloud;
  } else if (kind === 'gemma') {
    c = scMake(parent, Object.assign(base, {
      seed: 6, bob: 5, mood: o.mood || 'happy',
      draw: g => {
        E('circle', { cx: 0, cy: -92, r: 22, fill: '#8E8AB8', stroke: SC_INK, 'stroke-width': 3.5 }, g);   // hair bun
        E('rect', { x: -84, y: -84, width: 168, height: 172, rx: 48, fill: ball('#E4E2F2', '#7F7BA6'), stroke: '#55517A', 'stroke-width': 5 }, g);
        E('path', { d: 'M-70,-40 Q-60,-82 0,-84 Q60,-82 70,-40 Q40,-66 0,-64 Q-40,-66 -70,-40 Z', fill: '#8E8AB8' }, g);   // fringe
        const s = G(g); tr(s, 50, 58, 1, -10);
        E('rect', { x: -30, y: -14, width: 60, height: 28, rx: 6, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2.5 }, s);
        T(s, 0, 8, 'NEW', { size: 20, weight: 800, anchor: 'middle', fill: SC_INK });
        const b = bkBadge(g, 'Ge', { r: 20 }); tr(b, -54, 60);
      },
      face: { x: 0, y: -4, eye: 16, gap: 56, mouthW: 38, mouthY: 36, lidCol: '#CFCCE6' },
    }));
    // glasses go over the eyes (drawn after the face)
    const gl = G(c.firstChild); tr(gl, 0, -4);
    E('circle', { cx: -28, r: 26, fill: 'none', stroke: SC_INK, 'stroke-width': 5 }, gl);
    E('circle', { cx: 28, r: 26, fill: 'none', stroke: SC_INK, 'stroke-width': 5 }, gl);
    E('path', { d: 'M-3,-2 Q0,-6 3,-2', fill: 'none', stroke: SC_INK, 'stroke-width': 5 }, gl);
  } else if (kind === 'ahgong') {
    c = scMake(parent, Object.assign(base, {
      seed: 10, bob: 0, mood: o.mood || 'deadpan',
      draw: g => {
        const st = bkStool(g); tr(st, 0, 104, 0.9);
        E('circle', { cy: -6, r: 82, fill: ball('#B9B2FF', '#4E43B8'), stroke: '#3A3096', 'stroke-width': 5 }, g);
        // white singlet
        E('path', { d: 'M-58,50 Q-54,32 -40,28 L-30,56 Q0,66 30,56 L40,28 Q54,32 58,50 Q62,66 48,72 Q0,82 -48,72 Q-62,66 -58,50 Z', fill: '#F7F7F2', stroke: SC_INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, g);
        const b = bkBadge(g, 'Ar', { r: 15 }); tr(b, 0, 66);
        // bushy white eyebrows and moustache
        E('path', { d: 'M-60,-62 q8,-14 18,-6 q8,-12 18,-2 q8,-8 12,4 q-24,-4 -48,4 Z M60,-62 q-8,-14 -18,-6 q-8,-12 -18,-2 q-8,-8 -12,4 q24,-4 48,4 Z', fill: '#FFFFFF', stroke: '#B8B4D8', 'stroke-width': 2 }, g);
        E('path', { d: 'M-32,2 Q-16,-8 0,-2 Q16,-8 32,2 Q16,8 0,3 Q-16,8 -32,2 Z', fill: '#FFFFFF', stroke: '#B8B4D8', 'stroke-width': 2 }, g);
      },
      face: { x: 0, y: -30, eye: 15, gap: 50, mouthW: 30, mouthY: 46, lidCol: '#8E84F0', brow: false },
    }));
  } else if (kind === 'carbon') {
    c = scMake(parent, Object.assign(base, {
      seed: o.label === 'C-14' ? 16 : 15, bob: 3, mood: o.mood || 'neutral',
      draw: g => {
        E('circle', { r: 74, fill: ball('#B4BEC9', '#57636F'), stroke: '#3F4A55', 'stroke-width': 5 }, g);
        const b = bkBadge(g, o.label || 'C', { r: 26 }); tr(b, 0, 70);
      },
      face: { x: 0, y: -10, eye: 16, gap: 48, mouthW: 34, mouthY: 30, lidCol: '#9AA5B1' },
    }));
  } else {
    throw new Error('cast: unknown kind ' + kind);
  }
  return c;
}

/* ---------- the building / the poster ---------- */
function bkBlock(parent, o) {
  o = o || {};
  const g = G(parent), CW = BK_CW, CH = BK_CH, X0 = -9 * CW, Y0 = -3.5 * CH;
  const cellXY = (col, row) => [X0 + (col - 1) * CW, row <= 7 ? Y0 + (row - 1) * CH : Y0 + 7 * CH + 58 + (row - 9) * CH];
  const rectD = (x, y, w, h) => `M${x},${y} h${w} v${h} h${-w} Z `;
  // poster paper (behind everything)
  g.paper = G(g);
  E('rect', { x: X0 - 40, y: Y0 - 120, width: 18 * CW + 80, height: 7 * CH + 58 + 2 * CH + 170, rx: 6, fill: '#FBF7EC', stroke: '#C9BFA6', 'stroke-width': 4 }, g.paper);
  T(g.paper, 0, Y0 - 62, 'THE PERIODIC TABLE', { size: 44, weight: 800, anchor: 'middle', fill: '#2B3A55' });
  [[X0 - 22, Y0 - 102], [X0 + 18 * CW + 22, Y0 - 102], [X0 - 22, Y0 + 7 * CH + 58 + 2 * CH + 32], [X0 + 18 * CW + 22, Y0 + 7 * CH + 58 + 2 * CH + 32]]
    .forEach(([x, y]) => E('circle', { cx: x, cy: y, r: 9, fill: '#E8424F', stroke: '#8E1F2A', 'stroke-width': 2 }, g.paper));
  // building body (behind the flats): roof slabs, void deck, sign
  g.deco = G(g);
  const tops = {}; for (let z = 1; z <= 118; z++) { const [c, r] = bkPos(z); if (r <= 7) tops[c] = Math.min(tops[c] || 99, r); }
  let roof = '';
  for (let c = 1; c <= 18; c++) { const [x, y] = cellXY(c, tops[c]); roof += rectD(x - 2, y - 14, CW + 4, 14); }
  E('path', { d: roof, fill: '#B9AE96', stroke: '#7E7360', 'stroke-width': 2 }, g.deco);
  const vy = Y0 + 7 * CH;
  E('rect', { x: X0 - 6, y: vy, width: 18 * CW + 12, height: 10, fill: '#B9AE96' }, g.deco);
  let pil = ''; for (let c = 0; c <= 18; c += 2) pil += rectD(X0 + c * CW - 6, vy + 10, 12, 26);
  E('path', { d: pil, fill: '#D8CDB6', stroke: '#7E7360', 'stroke-width': 2 }, g.deco);
  E('rect', { x: X0 + 2 * CW - 10, y: vy + 58 - 16, width: 15 * CW + 20, height: 16, fill: '#B9AE96', stroke: '#7E7360', 'stroke-width': 2 }, g.deco);
  T(g.deco, X0 + 2 * CW - 18, vy + 58 + CH, 'ANNEXE', { size: 22, weight: 800, anchor: 'end', fill: '#B9AE96' });
  const sign = G(g.deco); tr(sign, X0 + 7.5 * CW, Y0 + 1.1 * CH);
  E('rect', { x: -170, y: -44, width: 340, height: 88, rx: 10, fill: '#2B3A55', stroke: '#F2E8C8', 'stroke-width': 4 }, sign);
  T(sign, 0, 20, 'BLK 118', { size: 56, weight: 800, anchor: 'middle', fill: '#F2E8C8' });
  // flats
  g.flats = [];
  const wallG = G(g), layerG = G(g), detG = G(g), txtG = G(g);
  let win = '', poles = '', clothes = '';
  const rr = rng(118);
  for (let z = 1; z <= 118; z++) {
    const [col, row] = bkPos(z), [x, y] = cellXY(col, row);
    const wall = E('rect', { x: x + 1.5, y: y + 1.5, width: CW - 3, height: CH - 3, rx: 3, fill: '#F6F0E2', stroke: '#8F8470', 'stroke-width': 2 }, wallG);
    win += `M${x + CW - 17},${y + 6} h11 v9 h-11 Z `;
    if (rr() < 0.3 && row <= 7) {
      poles += `M${x + CW - 4},${y + CH - 12} l14,-4 `;
      clothes += `M${x + CW + 1},${y + CH - 13} l4,-1 l1,8 l-4,1 Z `;
    }
    const sym = T(txtG, x + CW / 2, y + CH * 0.72, BK_SYM[z], { size: 22, weight: 800, anchor: 'middle', fill: '#24324F' });
    const num = o.numbers === false ? null : T(txtG, x + 5, y + 14, String(z), { size: 12, weight: 700, fill: '#5A6B7A', font: FB });
    g.flats[z] = { wall, sym, num, x, y, w: CW, h: CH, cx: x + CW / 2, cy: y + CH / 2 };
  }
  g.decoFront = G(g); txtG.before(g.decoFront);     // windows and laundry poles sit over the walls, under the names
  E('path', { d: win, fill: '#7FB6D9', stroke: '#5A7F99', 'stroke-width': 1 }, g.decoFront);
  E('path', { d: poles, stroke: '#8A7A5A', 'stroke-width': 2 }, g.decoFront);
  E('path', { d: clothes, fill: '#FF8FB0' }, g.decoFront);
  // colour layers
  const LCOL = { metal: '#7FB2F0', nonmetal: '#FFB45C', metalloid: '#C6A8FF', alkali: '#FF6B6B', alkaline: '#FFA36B', halogen: '#C6E35A', noble: '#FF8FD0', hydrogen: '#FFFFFF' };
  const dOf = test => { let d = ''; for (let z = 1; z <= 118; z++) if (test(z)) { const f = g.flats[z]; d += rectD(f.x + 1.5, f.y + 1.5, CW - 3, CH - 3); } return d; };
  const isNon = z => ['nonmetal', 'halogen', 'noble'].includes(BK_CAT[z]);
  g.layers = {};
  const pc = { metal: '#A9CCF5', nonmetal: '#FFD08A', metalloid: '#D9C6FF', noble: '#FFB8E1' };
  g.layers.poster = G(layerG);
  E('path', { d: dOf(z => BK_CAT[z] === 'metal'), fill: pc.metal }, g.layers.poster);
  E('path', { d: dOf(z => BK_CAT[z] === 'nonmetal' || BK_CAT[z] === 'halogen'), fill: pc.nonmetal }, g.layers.poster);
  E('path', { d: dOf(z => BK_CAT[z] === 'metalloid'), fill: pc.metalloid }, g.layers.poster);
  E('path', { d: dOf(z => BK_CAT[z] === 'noble'), fill: pc.noble }, g.layers.poster);
  const mk = (name, test) => { g.layers[name] = E('path', { d: dOf(test), fill: LCOL[name], opacity: 0, stroke: '#FFFFFF', 'stroke-width': 2 }, layerG); };
  mk('metal', z => BK_CAT[z] === 'metal'); mk('nonmetal', isNon); mk('metalloid', z => BK_CAT[z] === 'metalloid');
  mk('alkali', z => z !== 1 && bkPos(z)[0] === 1); mk('alkaline', z => bkPos(z)[0] === 2 && bkPos(z)[1] <= 7);
  mk('halogen', z => BK_CAT[z] === 'halogen'); mk('noble', z => BK_CAT[z] === 'noble'); mk('hydrogen', z => z === 1);
  // the staircase: between metals (left) and non-metals (right)
  const S = [[12, 1], [12, 2], [13, 2], [13, 3], [14, 3], [14, 4], [15, 4], [15, 5], [16, 5], [16, 7]].map(([c, r]) => [X0 + c * CW, Y0 + r * CH]);
  g.stair = E('path', { d: 'M' + S.map(p => p.join(',')).join(' L'), fill: 'none', stroke: '#FFE45C', 'stroke-width': 7, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1', 'stroke-dashoffset': 1 }, detG);
  g.stair.set = p => { attr(g.stair, 'stroke-dashoffset', 1 - clamp(p)); g.stair.style.opacity = p > 0.005 ? 1 : 0; };
  g.stair.set(0);
  // stack (column) and floor (row) highlight frames
  g.stacks = []; g.floors = [];
  for (let c = 1; c <= 18; c++) {
    const r0 = tops[c], [x, y] = cellXY(c, r0);
    g.stacks[c] = E('rect', { x: x - 3, y: y - 3, width: CW + 6, height: (8 - r0) * CH + 6, rx: 8, fill: 'rgba(255,228,92,0.16)', stroke: '#FFE45C', 'stroke-width': 5, opacity: 0 }, detG);
  }
  for (let r = 1; r <= 7; r++) g.floors[r] = E('rect', { x: X0 - 3, y: Y0 + (r - 1) * CH - 3, width: 18 * CW + 6, height: CH + 6, rx: 8, fill: 'rgba(127,211,255,0.14)', stroke: '#7FD3FF', 'stroke-width': 5, opacity: 0 }, detG);
  // labels: school group numbers and period numbers
  g.labels = G(detG); op(g.labels, 0);
  const GN = { 1: '1', 2: '2', 13: '3', 14: '4', 15: '5', 16: '6', 17: '7', 18: '0' };
  for (const c in GN) { const [x, y] = cellXY(+c, tops[c]); T(g.labels, x + CW / 2, y - 22, GN[c], { size: 24, weight: 800, anchor: 'middle', fill: '#FFE45C' }); }
  for (let r = 1; r <= 7; r++) T(g.labels, X0 - 22, Y0 + (r - 0.5) * CH + 8, String(r), { size: 24, weight: 800, anchor: 'middle', fill: '#7FD3FF' });
  // Mendeleev's gaps
  g.gap = {};
  (o.gaps || []).forEach(z => {
    const f = g.flats[z], gg = G(detG);
    E('rect', { x: f.x + 1.5, y: f.y + 1.5, width: CW - 3, height: CH - 3, rx: 3, fill: '#2A2F3A', stroke: '#FF6070', 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, gg);
    T(gg, f.cx, f.cy + 10, '?', { size: 30, weight: 800, anchor: 'middle', fill: '#FF6070' });
    g.gap[z] = gg; op(gg, 0);
  });
  g.pt = z => [g.flats[z].cx, g.flats[z].cy];
  // p = 0: Kavya's poster; p = 1: the block of flats
  g.look = p => { op(g.paper, 1 - p); op(g.deco, p); op(g.decoFront, p); op(g.layers.poster, 1 - p); };
  g.look(o.look === undefined ? 1 : o.look);
  return g;
}

/* ---------- sets ---------- */
const BK_TINT = { silas: ['#2E2216', '#5E4426'], sonny: ['#26282F', '#4A505E'], chloe: ['#1D2B10', '#3B5A1C'], helena: ['#2E1630', '#5E2A62'],
  harold: ['#1E2630', '#36424F'], gemma: ['#23213A', '#433E6E'], ahgong: ['#1C1838', '#3A3172'], kavya: ['#14243A', '#25446B'] };
const BK_LT = {
  silas: ['SILAS', 'Silicon. Caretaker. Lives on the staircase.'],
  sonny: ['SONNY', 'Sodium. Group 1. One spare electron.'],
  chloe: ['CHLOE', 'Chlorine. Group 7. Needs just one.'],
  helena: ['HELENA', 'Helium. Group 0. The penthouse.'],
  harold: ['HAROLD', 'Hydrogen. Flat 1. Nobody’s family.'],
  gemma: ['GEMMA', 'Germanium. New resident.'],
  ahgong: ['AH GONG', 'Argon. Group 0. No reaction since 1894.'],
  kavya: ['KAVYA, 12', 'Test tomorrow. Not ready.'],
};
function bkConf(parent, kind) { const [a, b] = BK_TINT[kind] || BK_TINT.silas; return scConfessional(parent, a, b); }

function bkBedroom(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A2340', '#3C3158', true) }, g);
  // window with the estate at night
  const w = G(g); tr(w, 70, 110);
  E('rect', { x: 0, y: 0, width: 300, height: 300, rx: 8, fill: linGrad('#0B1430', '#23305E', true), stroke: '#C9C2D8', 'stroke-width': 8 }, w);
  const r = rng(808); let lit = '', blocks = '';
  [[18, 120, 80, 180], [110, 70, 90, 230], [214, 140, 70, 160]].forEach(([x, y, bw, bh]) => {
    blocks += `M${x},${y} h${bw} v${bh} h${-bw} Z `;
    for (let yy = y + 10; yy < y + bh - 10; yy += 18) for (let xx = x + 8; xx < x + bw - 10; xx += 16) if (r() < 0.45) lit += `M${xx},${yy} h8 v8 h-8 Z `;
  });
  E('path', { d: blocks, fill: '#1A2142' }, w);
  E('path', { d: lit, fill: '#FFD98A' }, w);
  E('circle', { cx: 250, cy: 50, r: 22, fill: '#F6F2DA' }, w);
  E('path', { d: 'M150,0 L150,300 M0,150 L300,150', stroke: '#C9C2D8', 'stroke-width': 6 }, w);
  // lamp glow and desk
  E('ellipse', { cx: 1080, cy: 560, rx: 380, ry: 260, fill: glow('#FFD98A'), opacity: 0.45 }, g);
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: linGrad('#8A5A3A', '#5E3B24', true) }, g);
  E('rect', { x: 0, y: 596, width: 1200, height: 10, fill: '#A87452' }, g);
  const lamp = G(g); tr(lamp, 1080, 600);
  E('path', { d: 'M-40,0 L40,0 L30,-12 L-30,-12 Z M-4,-12 L-4,-120 L4,-120 L4,-12 Z', fill: '#3A3550', stroke: SC_INK, 'stroke-width': 3 }, lamp);
  E('path', { d: 'M-60,-110 L60,-110 L34,-170 L-34,-170 Z', fill: '#FFE7A8', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, lamp);
  // open textbook
  const bk = G(g); tr(bk, 760, 660);
  E('path', { d: 'M-150,-28 Q-75,-44 0,-24 Q75,-44 150,-28 L150,40 Q75,26 0,44 Q-75,26 -150,40 Z', fill: '#FFFFFF', stroke: '#9AA6B2', 'stroke-width': 3 }, bk);
  E('path', { d: 'M0,-24 L0,44', stroke: '#9AA6B2', 'stroke-width': 3 }, bk);
  E('path', { d: 'M-128,-12 h100 M-128,4 h110 M-128,20 h80 M22,-12 h100 M22,4 h90 M22,20 h108', stroke: '#C9D3DC', 'stroke-width': 5 }, bk);
  // bubble tea
  const bt = G(g); tr(bt, 960, 600);
  E('path', { d: 'M-36,-110 L36,-110 L28,0 L-28,0 Z', fill: 'rgba(240,220,200,0.85)', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, bt);
  E('path', { d: 'M-34,-110 Q0,-130 34,-110 Z', fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 3 }, bt);
  let pearls = ''; for (let i = 0; i < 9; i++) pearls += `M${-20 + (i % 5) * 10},${-14 - Math.floor(i / 5) * 10} a5,5 0 1,0 0.1,0 `;
  E('path', { d: pearls, fill: '#3A2416' }, bt);
  E('path', { d: 'M8,-150 L2,-30', stroke: '#FF5FA2', 'stroke-width': 9, 'stroke-linecap': 'round' }, bt);
  // digital clock
  const ck = G(g); tr(ck, 560, 600);
  E('rect', { x: -86, y: -60, width: 172, height: 60, rx: 10, fill: '#1B1726', stroke: '#6A5F8A', 'stroke-width': 3 }, ck);
  g.clock = T(ck, 0, -16, '11:00 PM', { size: 32, weight: 700, anchor: 'middle', fill: '#FF5F5F' });
  return g;
}

function bkVoidDeck(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#9FD8FF', '#E6F6FF', true) }, g);
  E('path', { d: 'M0,330 Q120,250 240,320 Q360,240 480,320 Q620,250 760,320 Q900,250 1040,320 Q1120,270 1200,310 L1200,520 L0,520 Z', fill: '#5BBF6A' }, g);   // trees
  E('rect', { x: 0, y: 0, width: 1200, height: 110, fill: '#D8CDB6' }, g);          // the slab above
  E('rect', { x: 0, y: 104, width: 1200, height: 14, fill: '#B9AE96' }, g);
  // letterbox wall at the back left
  const lb = G(g); tr(lb, 330, 300);
  E('rect', { x: -170, y: -120, width: 340, height: 240, rx: 6, fill: '#C9CED6', stroke: '#7E8792', 'stroke-width': 4 }, lb);
  let boxes = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) boxes += `M${-156 + i * 54},${-106 + j * 44} h46 v36 h-46 Z `;
  E('path', { d: boxes, fill: '#E3E7EC', stroke: '#7E8792', 'stroke-width': 2 }, lb);
  let slots = ''; for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) slots += `M${-146 + i * 54},${-96 + j * 44} h26 `;
  E('path', { d: slots, stroke: '#4A525C', 'stroke-width': 3 }, lb);
  g.boxes = [330, 300];
  // notice board
  const nb = G(g); tr(nb, 880, 270);
  E('rect', { x: -110, y: -80, width: 220, height: 160, rx: 6, fill: '#B07A45', stroke: SC_INK, 'stroke-width': 4 }, nb);
  E('rect', { x: -96, y: -66, width: 92, height: 70, fill: '#FFFFFF' }, nb); E('rect', { x: 8, y: -60, width: 84, height: 100, fill: '#FFF6C2' }, nb);
  E('rect', { x: -92, y: 14, width: 86, height: 50, fill: '#DDEBFF' }, nb);
  g.board = [880, 270];
  // pillars and floor
  E('rect', { x: 0, y: 520, width: 1200, height: 230, fill: linGrad('#CFC6B4', '#A99F8B', true) }, g);
  let tiles = ''; for (let x = -40; x < 1240; x += 80) tiles += `M${x},520 L${x - 60},750 `; tiles += 'M0,600 L1200,600 M0,680 L1200,680';
  E('path', { d: tiles, stroke: '#978D79', 'stroke-width': 2, opacity: 0.7 }, g);
  [[60, 118], [600, 118], [1140, 118]].forEach(([x, y]) => {
    E('rect', { x: x - 34, y, width: 68, height: 420, fill: linGrad('#F0E8D6', '#D2C6AE'), stroke: '#8F8470', 'stroke-width': 3 }, g);
    E('rect', { x: x - 34, y: y + 300, width: 68, height: 60, fill: '#3F8A6A' }, g);
  });
  // stone chess table and stools
  const tb = G(g); tr(tb, 900, 600);
  E('path', { d: 'M-24,0 L-34,90 L34,90 L24,0 Z', fill: '#A39A8A', stroke: '#6E6656', 'stroke-width': 3 }, tb);
  E('ellipse', { cx: 0, cy: 0, rx: 130, ry: 34, fill: '#C9C1B1', stroke: '#6E6656', 'stroke-width': 4 }, tb);
  E('ellipse', { cx: 0, cy: -2, rx: 60, ry: 16, fill: '#8F8676' }, tb);
  [[-190, 70], [190, 70]].forEach(([x, y]) => { E('path', { d: `M${x - 26},${y} L${x - 20},${y + 50} L${x + 20},${y + 50} L${x + 26},${y} Z`, fill: '#A39A8A', stroke: '#6E6656', 'stroke-width': 3 }, tb); E('ellipse', { cx: x, cy: y, rx: 30, ry: 10, fill: '#C9C1B1', stroke: '#6E6656', 'stroke-width': 3 }, tb); });
  return g;
}

function bkCorridor(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#F2EAD6', '#E2D6BC', true) }, g);
  E('rect', { x: 0, y: 0, width: 1200, height: 60, fill: '#D6CAB0' }, g);
  E('rect', { x: 0, y: 470, width: 1200, height: 170, fill: '#9FC2D9', opacity: 0.0 }, g);
  E('path', { d: 'M0,450 L1200,450', stroke: '#C9BC9E', 'stroke-width': 6 }, g);   // dado line
  // door with grille
  const d = G(g); tr(d, 600, 640);
  E('rect', { x: -130, y: -470, width: 260, height: 470, fill: '#6B4A33', stroke: SC_INK, 'stroke-width': 5 }, d);
  const leaf = G(d);
  E('rect', { x: -116, y: -456, width: 232, height: 456, fill: linGrad('#8A5E3E', '#6E4A30', true), stroke: SC_INK, 'stroke-width': 3 }, leaf);
  E('rect', { x: -86, y: -420, width: 172, height: 160, rx: 6, fill: 'none', stroke: '#5A3A24', 'stroke-width': 4 }, leaf);
  E('rect', { x: -86, y: -220, width: 172, height: 180, rx: 6, fill: 'none', stroke: '#5A3A24', 'stroke-width': 4 }, leaf);
  E('circle', { cx: 92, cy: -230, r: 10, fill: '#E3B341', stroke: SC_INK, 'stroke-width': 2 }, leaf);
  let grille = ''; for (let x = -110; x <= 110; x += 22) grille += `M${x},-450 L${x},-6 `;
  E('path', { d: grille + 'M-116,-300 L116,-300 M-116,-150 L116,-150', stroke: '#3A3F46', 'stroke-width': 5, opacity: 0.85 }, leaf);
  g.door = leaf;
  g.door.set = p => leaf.setAttribute('transform', `translate(-116 0) scale(${(1 - 0.85 * clamp(p)).toFixed(3)} 1) translate(116 0)`);
  // number plate
  const pl = G(g); tr(pl, 600, 130);
  E('rect', { x: -100, y: -34, width: 200, height: 68, rx: 8, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, pl);
  g.plate = T(pl, 0, 14, '#03-01', { size: 40, weight: 800, anchor: 'middle', fill: '#24324F' });
  // shoe rack and plants
  const sr = G(g); tr(sr, 860, 640);
  E('rect', { x: -90, y: -90, width: 180, height: 90, fill: '#C9CED6', stroke: SC_INK, 'stroke-width': 3 }, sr);
  E('path', { d: 'M-90,-45 L90,-45', stroke: SC_INK, 'stroke-width': 3 }, sr);
  [[-60, -58, '#E8424F'], [-10, -58, '#3F5BD9'], [44, -58, '#FFC247'], [-40, -14, '#56D69B'], [30, -14, '#B48CFF']].forEach(([x, y, c]) => E('path', { d: `M${x - 18},${y + 10} Q${x - 18},${y - 6} ${x},${y - 4} L${x + 20},${y + 2} Q${x + 24},${y + 10} ${x + 18},${y + 12} Z`, fill: c, stroke: SC_INK, 'stroke-width': 2 }, sr));
  [[230, 640], [1050, 640]].forEach(([x, y]) => {
    const p = G(g); tr(p, x, y);
    E('path', { d: 'M-40,0 L-50,-70 L50,-70 L40,0 Z', fill: '#C2453A', stroke: SC_INK, 'stroke-width': 3 }, p);
    E('path', { d: 'M0,-70 Q-60,-120 -40,-180 Q-10,-130 0,-70 Q10,-150 40,-190 Q50,-120 0,-70 Q60,-100 70,-150', fill: '#5BBF6A', stroke: '#2C8C4C', 'stroke-width': 3 }, p);
  });
  E('rect', { x: 0, y: 640, width: 1200, height: 110, fill: linGrad('#B8AC94', '#8F8470', true) }, g);
  return g;
}

function bkOilFlat(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#E7A93A', '#9A5A12', true) }, g);
  E('rect', { x: 0, y: 560, width: 1200, height: 190, fill: '#7A440C', opacity: 0.6 }, g);
  E('path', { d: 'M760,560 L760,400 Q760,370 790,370 L1060,370 Q1090,370 1090,400 L1090,560 Z M740,470 L1110,470 L1110,560 L740,560 Z', fill: '#6A3A0A', opacity: 0.55 }, g);   // sofa
  E('rect', { x: 120, y: 300, width: 260, height: 160, rx: 10, fill: '#5A3008', opacity: 0.55 }, g);    // TV
  E('rect', { x: 230, y: 460, width: 40, height: 100, fill: '#5A3008', opacity: 0.55 }, g);
  E('rect', { x: 500, y: 140, width: 160, height: 120, fill: '#F6C86A', opacity: 0.35, stroke: '#7A440C', 'stroke-width': 6 }, g);   // a picture frame
  const surf = E('path', { d: '', fill: '#FFE7A8', opacity: 0.25 }, g);
  const bub = bubbles(g, 40, 120, 1120, 600, { n: 22, r: 9, speed: 0.12, color: 'rgba(255,240,200,0.8)', fill: 'rgba(255,240,200,0.15)', seed: 31 });
  g.upd = t => {
    let d = 'M0,0 L0,70'; for (let x = 0; x <= 1200; x += 60) d += ` L${x},${(70 + 8 * Math.sin(x / 90 + t * 1.2)).toFixed(1)}`;
    attr(surf, 'd', d + ' L1200,0 Z'); bub.upd(t);
  };
  g.upd(0);
  return g;
}

function bkPenthouse(parent) {
  const g = G(parent);
  E('rect', { x: 0, y: 0, width: 1200, height: 750, fill: linGrad('#2A1236', '#4A1E52', true) }, g);
  const w = G(g); tr(w, 600, 300);
  E('rect', { x: -380, y: -230, width: 760, height: 420, fill: linGrad('#0A1030', '#28305E', true), stroke: '#D9B85C', 'stroke-width': 8 }, w);
  const r = rng(441); let sky = '', lit = '';
  for (let i = 0; i < 16; i++) { const x = -370 + i * 47, h = 80 + r() * 200; sky += `M${x},190 v${-h} h40 v${h} Z `; for (let yy = 190 - h + 10; yy < 180; yy += 16) for (let xx = x + 6; xx < x + 36; xx += 12) if (r() < 0.35) lit += `M${xx},${yy} h6 v7 h-6 Z `; }
  E('path', { d: sky, fill: '#161C40' }, w); E('path', { d: lit, fill: '#FFD98A' }, w);
  E('path', { d: 'M0,-230 L0,190 M-380,-20 L380,-20', stroke: '#D9B85C', 'stroke-width': 5, opacity: 0.8 }, w);
  [[-1, 120], [1, 1080]].forEach(([sd, x]) => E('path', { d: `M${x - 120},0 L${x + 120},0 L${x + 120 - sd * 30},620 Q${x},560 ${x - 120 + sd * 30},620 Z`, fill: linGrad('#8E1F4A', '#5A1030', true), stroke: '#3A0820', 'stroke-width': 3 }, g));
  // chandelier
  const ch = G(g); tr(ch, 600, 0);
  E('path', { d: 'M0,0 L0,60', stroke: '#D9B85C', 'stroke-width': 4 }, ch);
  E('path', { d: 'M-90,80 Q0,130 90,80 M-60,66 Q0,100 60,66', fill: 'none', stroke: '#D9B85C', 'stroke-width': 5 }, ch);
  for (let i = -3; i <= 3; i++) { E('circle', { cx: i * 28, cy: 84 + 18 * (1 - Math.abs(i) / 3), r: 7, fill: '#FFF6C2', stroke: '#D9B85C', 'stroke-width': 2 }, ch); }
  E('ellipse', { cx: 0, cy: 90, rx: 160, ry: 70, fill: glow('#FFE7A8'), opacity: 0.6 }, ch);
  // carpet and velvet rope with sign
  E('rect', { x: 0, y: 600, width: 1200, height: 150, fill: linGrad('#6E1F3A', '#4A1228', true) }, g);
  const rope = G(g); tr(rope, 980, 640);
  [-110, 110].forEach(x => { E('rect', { x: x - 8, y: -110, width: 16, height: 110, fill: '#D9B85C', stroke: SC_INK, 'stroke-width': 2 }, rope); E('circle', { cx: x, cy: -116, r: 12, fill: '#D9B85C', stroke: SC_INK, 'stroke-width': 2 }, rope); });
  E('path', { d: 'M-104,-96 Q0,-40 104,-96', fill: 'none', stroke: '#B0123E', 'stroke-width': 10, 'stroke-linecap': 'round' }, rope);
  const sg = G(rope); tr(sg, 0, -64);
  E('rect', { x: -88, y: -22, width: 176, height: 44, rx: 6, fill: '#F7F0DA', stroke: '#D9B85C', 'stroke-width': 3 }, sg);
  T(sg, 0, 9, 'NO REACTIONS', { size: 24, weight: 800, anchor: 'middle', fill: '#6E1F3A' });
  return g;
}

/* ---------- props ---------- */
function bkLetterbox(parent, el, o) {
  o = o || {};
  const g = G(parent);
  E('rect', { x: -115, y: -140, width: 230, height: 280, rx: 14, fill: '#E3E7EC', stroke: '#4A525C', 'stroke-width': 6 }, g);
  E('rect', { x: -70, y: -122, width: 140, height: 14, rx: 7, fill: '#4A525C' }, g);          // mail slot
  E('circle', { cx: 86, cy: 110, r: 7, fill: '#9AA6B2', stroke: '#4A525C', 'stroke-width': 2 }, g);   // keyhole
  g.parts = {
    z: T(g, -88, -70, String(el.z), { size: 40, weight: 800, fill: '#3F5BD9' }),
    sym: T(g, 0, 30, el.sym, { size: 104, weight: 800, anchor: 'middle', fill: '#24324F' }),
    name: T(g, 0, 76, el.name, { size: 30, weight: 700, anchor: 'middle', fill: '#4A525C', font: FB }),
    mass: T(g, 0, 122, String(el.mass), { size: 34, weight: 800, anchor: 'middle', fill: '#C2453A' }),
  };
  return g;
}

function bkAtom(parent, shells, o) {
  o = o || {};
  const g = G(parent), r0 = o.r0 || 70, dr = o.dr || 46, er = o.er || 11;
  g.ring = [];
  shells.forEach((n, k) => g.ring.push(E('circle', { r: r0 + k * dr, fill: 'none', stroke: '#9FB4C8', 'stroke-width': 3, opacity: 0.6, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, g)));
  g.nucleus = G(g);
  const np = o.p || 0, nn = o.n || 0, tot = np + nn;
  if (tot) {
    E('circle', { r: 40, fill: glow('#FFB27A'), opacity: 0.5 }, g.nucleus);
    const pts = []; for (let i = 0; i < tot; i++) { const a = i * 2.39996, rad = 7.6 * Math.sqrt(i + 0.5); pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
    pts.reverse().forEach(([x, y], i) => {
      const isP = (i * 7) % tot < np;   // spreads protons and neutrons evenly through the cluster
      E('circle', { cx: x, cy: y, r: 9, fill: isP ? ball('#FF7A6B', '#B5372D') : ball('#C9D1DA', '#6E7B88'), stroke: isP ? '#8E1F2A' : '#4E5966', 'stroke-width': 1.5 }, g.nucleus);
    });
  } else E('circle', { r: 26, fill: ball('#FF7A6B', '#B5372D'), stroke: '#8E1F2A', 'stroke-width': 3 }, g.nucleus);
  if (o.label) { const lb = chip(g, o.label, { size: 24, fill: 'rgba(10,27,39,0.85)', stroke: C.line, sw: 2 }); tr(lb, 0, -(r0 + (shells.length - 1) * dr) - 40); }
  g.e = []; g.outer = [];
  const shellG = shells.map(() => G(g));
  shells.forEach((n, k) => {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * TAU / n + (n === 2 ? 0 : k * 0.3), R = r0 + k * dr;
      const e = G(shellG[k]); tr(e, Math.cos(a) * R, Math.sin(a) * R); e.a0 = a; e.R = R; e.k = k;
      E('circle', { r: er, fill: ball('#7FD3FF', '#1E6FB0'), stroke: '#0E3F66', 'stroke-width': 2.5 }, e);
      E('path', { d: `M${-er * 0.45},0 L${er * 0.45},0`, stroke: '#FFFFFF', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, e);
      g.e.push({ el: e, shell: k });
      if (k === shells.length - 1) g.outer.push(e);
    }
  });
  g.set = n => g.e.forEach((e, i) => op(e.el, i < n ? 1 : 0));
  g.spin = t => g.e.forEach(({ el }) => { const a = el.a0 + t * (0.24 - el.k * 0.05) * (el.k % 2 ? -1 : 1); tr(el, Math.cos(a) * el.R, Math.sin(a) * el.R); });   // electrons stay upright
  g.set(g.e.length);
  return g;
}

function bkTrough(parent) {
  const g = G(parent);
  const body = 'M-260,-110 L-260,90 Q-260,110 -240,110 L240,110 Q260,110 260,90 L260,-110';
  E('rect', { x: -258, y: -40, width: 516, height: 148, fill: C.water, opacity: 0.45 }, g);
  E('path', { d: 'M-258,-40 L258,-40', stroke: '#BDEBFF', 'stroke-width': 4, opacity: 0.9 }, g);
  E('path', { d: body, fill: 'none', stroke: GLASS.stroke, 'stroke-width': 6, 'stroke-linejoin': 'round' }, g);
  E('rect', { x: 230, y: -90, width: 8, height: 170, rx: 4, fill: GLASS.shine }, g);
  // safety screen in front
  const sc = G(g);
  E('rect', { x: -300, y: -230, width: 600, height: 370, rx: 10, fill: 'rgba(200,230,250,0.07)', stroke: '#E8EEF4', 'stroke-width': 5 }, sc);
  E('rect', { x: -110, y: -222, width: 220, height: 34, rx: 6, fill: '#FFE45C', stroke: SC_INK, 'stroke-width': 2 }, sc);
  T(sc, 0, -198, 'SAFETY SCREEN', { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
  g.screen = sc;
  return g;
}

function bkSign(parent, title, body, o) {
  o = o || {};
  const g = G(parent), w = o.w || 420, h = o.h || 220;
  E('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: '#FFFFFF', stroke: SC_INK, 'stroke-width': 4 }, g);
  E('path', { d: `M${-w / 2 + 10},${-h / 2} L${w / 2 - 10},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 10} L${w / 2},${-h / 2 + 56} L${-w / 2},${-h / 2 + 56} L${-w / 2},${-h / 2 + 10} Q${-w / 2},${-h / 2} ${-w / 2 + 10},${-h / 2} Z`, fill: '#D32F2F' }, g);
  T(g, 0, -h / 2 + 39, title, { size: 30, weight: 800, anchor: 'middle', fill: '#FFFFFF' });
  g.body = T(g, 0, -h / 2 + 100, body || '', { size: o.size || 28, weight: 700, anchor: 'middle', fill: SC_INK, font: FB });
  return g;
}

function bkStool(parent) {
  const g = G(parent);
  E('path', { d: 'M-44,-10 L-54,60 L-40,60 L-28,6 L28,6 L40,60 L54,60 L44,-10 Z', fill: '#E23B3B', stroke: SC_INK, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  E('ellipse', { cx: 0, cy: -12, rx: 50, ry: 13, fill: '#FF5A5A', stroke: SC_INK, 'stroke-width': 3 }, g);
  E('ellipse', { cx: 0, cy: -12, rx: 14, ry: 4, fill: '#B92424' }, g);
  return g;
}

function bkBox(parent, label) {
  const g = G(parent);
  E('path', { d: 'M-90,-50 L90,-50 L90,60 L-90,60 Z', fill: '#C9955A', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('path', { d: 'M-90,-50 L-70,-72 L70,-72 L90,-50 Z', fill: '#DDAE73', stroke: SC_INK, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
  E('rect', { x: -18, y: -50, width: 36, height: 110, fill: '#E9D7A8', opacity: 0.8 }, g);
  if (label) T(g, 0, 22, label, { size: 22, weight: 800, anchor: 'middle', fill: SC_INK });
  return g;
}

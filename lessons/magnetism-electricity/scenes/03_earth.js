/* Chapter 3, The Earth as a giant magnet.
   A compass is a tiny magnet that settles N-S -> the Earth turns see-through: a molten outer core and a
   giant bar magnet, field lines looping south to north -> the twist: the compass's N points north and unlike
   poles attract -> so the magnetic SOUTH pole is up north (showpiece) -> sailors, hikers and pilots
   -> the field shields us from the Sun's particles -> animals steer by it -> the poles have flipped. */
scene('earth', S => {
  const { at, end, mid } = S, root = S.root;
  const calm = S.reduce ? 0.3 : 1;
  const FIELD = '#C4B5FD';
  const RED = '#E8424F', REDK = '#A4232E', BLUE = '#3B82F6', BLUEK = '#1E4FA8', NLT = '#FF8F98', SLT = '#8DB9FF';

  /* ---------- local helpers ---------- */
  function rich(parent, x, y, segs, o) {
    o = o || {};
    const t = E('text', { x, y, 'font-size': o.size || 30, 'font-weight': o.weight || 600, 'font-family': o.font || FD, 'text-anchor': o.anchor || 'start', fill: o.fill || C.ink }, parent);
    segs.forEach(s => { if (typeof s === 'string') s = [s]; E('tspan', { fill: s[1], 'font-weight': s[2] }, t).textContent = s[0]; });
    return t;
  }
  /* compass: dial (C.card, C.line rim), diamond needle (north half red), pivot. g.set(deg) points the red end */
  function compass(parent, r, o) {
    o = o || {};
    const g = G(parent);
    if (o.glow) g.halo = E('circle', { r: r * 2.1, fill: glow(C.energy) }, g);
    E('circle', { r, fill: C.card, stroke: o.rim || C.line, 'stroke-width': Math.max(3, r * 0.09) }, g);
    if (o.marks) {
      for (let i = 0; i < 16; i++) { const a = i * TAU / 16, r1 = r * (i % 4 ? 0.86 : 0.8); E('line', { x1: Math.cos(a) * r1, y1: Math.sin(a) * r1, x2: Math.cos(a) * r * 0.93, y2: Math.sin(a) * r * 0.93, stroke: C.muted, 'stroke-width': i % 4 ? 2 : 3.5, 'stroke-linecap': 'round' }, g); }
    }
    const nd = G(g), L = r * 0.78, w = Math.max(5, r * 0.2);
    E('path', { d: `M${L},0 L0,${-w} L0,${w} Z`, fill: RED, stroke: '#FFB3B9', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('path', { d: `M${-L},0 L0,${-w} L0,${w} Z`, fill: C.ink, stroke: '#ffffff', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }, nd);
    E('circle', { r: Math.max(3, r * 0.11), fill: C.bg0, stroke: C.ink, 'stroke-width': 2 }, g);
    E('path', { d: `M${(-r * 0.62).toFixed(1)},${(-r * 0.5).toFixed(1)} A${(r * 0.8).toFixed(1)},${(r * 0.8).toFixed(1)} 0 0 1 ${(r * 0.1).toFixed(1)},${(-r * 0.8).toFixed(1)}`, fill: 'none', stroke: '#ffffff', 'stroke-width': Math.max(2, r * 0.06), opacity: 0.22, 'stroke-linecap': 'round' }, g);
    g.nd = nd; g.L = L;
    g.set = deg => nd.setAttribute('transform', `rotate(${deg.toFixed(2)})`);
    g.set(-90);
    return g;
  }
  function headPath(parent, color, s) {
    s = s || 1;
    return E('path', { d: `M${8 * s},0 L${-7 * s},${-7 * s} L${-3.5 * s},0 L${-7 * s},${7 * s} Z`, fill: color, 'stroke-linejoin': 'round' }, parent);
  }
  const circD = R => `M${-R},0 A${R},${R} 0 1 0 ${R},0 A${R},${R} 0 1 0 ${-R},0 Z`;
  /* the Earth of radius R around (0,0): interior (mantle, molten outer core with swirls, inner core) under a
     surface of ocean and land; g.surf fades to see-through, g.swirl turns, g.magnet is the inner bar magnet */
  function earthArt(parent, R, o) {
    o = o || {};
    const g = G(parent);
    const inside = G(g);
    E('circle', { r: R, fill: ball('#7B3A27', '#35170F') }, inside);
    const core = G(inside);
    E('circle', { r: R * 0.55, fill: ball('#FFA24A', '#C2461A') }, core);
    const swirl = G(core);
    for (let i = 0; i < 6; i++) {
      const a0 = i * TAU / 6, rr = R * (0.3 + 0.17 * (i % 2)), a1 = a0 + 1.5;
      E('path', { d: `M${(Math.cos(a0) * rr).toFixed(1)},${(Math.sin(a0) * rr).toFixed(1)} A${rr.toFixed(1)},${rr.toFixed(1)} 0 0 1 ${(Math.cos(a1) * rr * 0.9).toFixed(1)},${(Math.sin(a1) * rr * 0.9).toFixed(1)}`, fill: 'none', stroke: '#FFE0A6', 'stroke-width': Math.max(2.5, R * 0.035), 'stroke-linecap': 'round', opacity: 0.75 }, swirl);
    }
    E('circle', { r: R * 0.2, fill: ball('#FFF0B8', '#E5A93C') }, core);
    // the surface (it turns see-through)
    const surf = G(g);
    E('circle', { r: R, fill: ball('#2F7DD1', '#123E7A') }, surf);
    const land = G(surf, { 'clip-path': _clipUrl(circD(R - 1)) });
    [[-0.38, -0.3, 0.46, 0.3, 3], [0.36, 0.12, 0.3, 0.46, 9], [-0.12, 0.66, 0.4, 0.17, 13], [-0.5, 0.36, 0.2, 0.2, 21]].forEach(([x, y, rx, ry, sd]) => {
      E('path', { d: closedPath(blobPts(rx * R, ry * R, 11, 0, 0.22, sd)), fill: ball('#5BD27A', '#2C8C4C'), transform: `translate(${(x * R).toFixed(1)} ${(y * R).toFixed(1)})` }, land);
    });
    E('ellipse', { cx: 0, cy: -R * 0.96, rx: R * 0.42, ry: R * 0.1, fill: '#F2F7FA', opacity: 0.9 }, land);
    E('ellipse', { cx: 0, cy: R * 0.97, rx: R * 0.46, ry: R * 0.1, fill: '#F2F7FA', opacity: 0.9 }, land);
    // the giant bar magnet, seen through the surface: unlabelled grey at first; top (S) and bottom (N) halves light up
    const mag = G(g), MW = R * 0.24, MH = R * 1.16;
    E('rect', { x: -MW / 2, y: -MH / 2, width: MW, height: MH, rx: MW * 0.22, fill: linGrad('#C6CFD7', '#6E7B87'), stroke: '#E3E9EE', 'stroke-width': 2 }, mag);
    const top = E('rect', { x: -MW / 2, y: -MH / 2, width: MW, height: MH / 2, rx: MW * 0.22, fill: ball(BLUE, BLUEK) }, mag);
    const bot = E('rect', { x: -MW / 2, y: 0, width: MW, height: MH / 2, rx: MW * 0.22, fill: ball(RED, REDK) }, mag);
    const lsz = Math.max(18, MW * 0.8);
    const lS = T(g, 0, -MH / 4 + lsz * 0.36, 'S', { size: lsz, weight: 700, anchor: 'middle', fill: '#fff' });
    const lN = T(g, 0, MH / 4 + lsz * 0.36, 'N', { size: lsz, weight: 700, anchor: 'middle', fill: '#fff' });
    const lS2 = T(g, 0, -MH / 4 + lsz * 0.36, 'N', { size: lsz, weight: 700, anchor: 'middle', fill: '#fff' });
    const lN2 = T(g, 0, MH / 4 + lsz * 0.36, 'S', { size: lsz, weight: 700, anchor: 'middle', fill: '#fff' });
    E('circle', { r: R, fill: 'none', stroke: '#9CC9F2', 'stroke-width': Math.max(2, R * 0.016) }, g);
    g.surf = surf; g.swirl = swirl; g.core = core; g.mag = mag; g.MH = MH;
    /* light the top (S) and bottom (N) halves; the letters stay upright outside the turning magnet:
       flipped shows N on top, k fades the letters (while the magnet turns) */
    g.poles = (s, n, flipped, k) => {
      k = k === undefined ? 1 : k;
      op(top, s); op(bot, n);
      op(lS, s * k * (flipped ? 0 : 1)); op(lN, n * k * (flipped ? 0 : 1)); op(lS2, n * k * (flipped ? 1 : 0)); op(lN2, s * k * (flipped ? 1 : 0));
    };
    g.poles(0, 0, false);
    return g;
  }
  /* dipole field lines r = L sin^2(theta) outside a sphere of radius R at (cx, cy), drawn from the southern
     surface up to the northern surface; each line has a draw path and an arrowhead at its equator point */
  function dipoleSet(parent, cx, cy, R, Ls, o) {
    o = o || {};
    const lines = [];
    Ls.forEach(Lk => {
      const L = Lk * R, th0 = Math.asin(Math.sqrt(R / L));
      [-1, 1].forEach(side => {
        const pts = [];
        for (let i = 0; i <= 70; i++) { const th = Math.PI - th0 - (Math.PI - 2 * th0) * i / 70, s = Math.sin(th); pts.push([cx + side * L * s * s * s, cy - L * s * s * Math.cos(th)]); }
        const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
        const path = E('path', { d, fill: 'none', stroke: FIELD, 'stroke-width': o.width || 3.4, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, parent);
        const head = headPath(parent, FIELD, o.head || 1.25);
        lines.push({ path, head, x: cx + side * L, y: cy });
      });
    });
    return lines;
  }

  /* ================= A. compass, Earth, twist, south ================= */
  const A = G(root);
  const EX = 760, EY = 420, ER = 220;
  const axis = E('line', { x1: EX, y1: EY - ER - 30, x2: EX, y2: EY + ER + 30, stroke: '#E3EEF5', 'stroke-width': 3, 'stroke-dasharray': '10 8', opacity: 0.7 }, A);
  const earthG = G(A); tr(earthG, EX, EY);
  const earth = earthArt(earthG, ER);
  const lblGN = T(A, EX, 148, 'geographic North', { size: 30, weight: 700, anchor: 'middle' });
  const lblGS = T(A, EX, 708, 'geographic South', { size: 30, weight: 700, anchor: 'middle' });
  const fieldLines = dipoleSet(A, EX, EY, ER, [1.2, 1.4, 1.62]);
  const coreLbl = G(A);
  E('line', { x1: 936, y1: 590, x2: EX + ER * 0.43, y2: EY + ER * 0.36, stroke: C.muted, 'stroke-width': 2.5 }, coreLbl);
  E('circle', { cx: EX + ER * 0.43, cy: EY + ER * 0.36, r: 4.5, fill: C.muted }, coreLbl);
  T(coreLbl, 1030, 604, 'molten iron,', { size: 28, weight: 700, anchor: 'middle', fill: '#FFC27A' });
  T(coreLbl, 1030, 638, 'outer core', { size: 28, weight: 700, anchor: 'middle', fill: '#FFC27A' });
  // the big compass on the left, then on the Earth's surface
  const BCX = 230, BCY = 420, BCR = 90;
  const big = compass(A, BCR, { marks: true });
  const mini = G(A); magnet(mini, 112, 32);            // "just a tiny bar magnet"
  const lblNeedle = G(A);
  T(lblNeedle, BCX, 268, 'north pole of the needle', { size: 28, weight: 700, anchor: 'middle', fill: NLT });
  E('line', { x1: BCX, y1: 280, x2: BCX, y2: 346, stroke: NLT, 'stroke-width': 2.5 }, lblNeedle);
  E('circle', { cx: BCX, cy: 348, r: 4.5, fill: NLT }, lblNeedle);
  const lblFree = T(A, BCX, 566, 'free to spin', { size: 28, weight: 600, anchor: 'middle', fill: C.muted });
  // on the surface: colatitude 70 degrees on the left, on the 1.4 R field line
  const CTH = 70 * Math.PI / 180, CRAD = ER * 1.4 * Math.sin(CTH) * Math.sin(CTH);
  const CX = EX - CRAD * Math.sin(CTH), CY = EY - CRAD * Math.cos(CTH), CR = 40;
  const cDir = (() => { const rx = -Math.sin(CTH), ry = -Math.cos(CTH), mr = ry; const bx = 3 * mr * rx, by = 3 * mr * ry - 1; return Math.atan2(by, bx) * 180 / Math.PI; })();
  const attractIcon = G(A);
  E('circle', { cx: -62, cy: 0, r: 26, fill: ball(RED, REDK) }, attractIcon); T(attractIcon, -62, 10, 'N', { size: 28, weight: 700, anchor: 'middle', fill: '#fff' });
  E('circle', { cx: 62, cy: 0, r: 26, fill: ball(BLUE, BLUEK) }, attractIcon); T(attractIcon, 62, 10, 'S', { size: 28, weight: 700, anchor: 'middle', fill: '#fff' });
  arrow(attractIcon, -30, 0, -6, 0, { color: C.good, width: 6, head: 16 }); arrow(attractIcon, 30, 0, 6, 0, { color: C.good, width: 6, head: 16 });
  tr(attractIcon, 230, 470);
  const chipUnlike = chip(A, 'unlike poles attract', { size: 30, fill: C.card2, stroke: C.good }); tr(chipUnlike, 230, 548);
  const tipX = CX + Math.cos(cDir * Math.PI / 180) * (CR * 0.78 + 8), tipY = CY + Math.sin(cDir * Math.PI / 180) * (CR * 0.78 + 8);
  const sGlow = E('ellipse', { cx: 0, cy: -earth.MH / 4, rx: 78, ry: 100, fill: glow('#6FA8FF') }, earth);
  earth.insertBefore(sGlow, earth.mag);            // behind the giant magnet, over the see-through surface
  const pullArr = arrow(A, tipX, tipY, EX - 22, EY - earth.MH / 2 + 26, { color: C.good, width: 6, bend: -18 });
  const chipMS = chip(A, 'magnetic south pole', { size: 28, fill: C.card2, stroke: SLT, color: SLT }); tr(chipMS, EX, 246);
  const lblMN = chip(A, 'magnetic north pole', { size: 26, fill: C.card2, stroke: NLT, color: NLT }); tr(lblMN, EX, 600);

  /* ================= B. navigation ================= */
  const B1 = G(root);
  const starsG = G(B1), stars = [], sr = rng(77);
  for (let i = 0; i < 16; i++) stars.push({ el: E('circle', { cx: 120 + sr() * 960, cy: 120 + sr() * 210, r: 2 + sr() * 2.5, fill: '#F2F7FA' }, starsG), ph: sr() });
  const clouds = [[180, 170, 150, 46], [520, 140, 190, 52], [860, 190, 170, 48], [380, 270, 130, 36], [1040, 280, 120, 34]].map(([x, y, rx, ry], i) => {
    const g = G(B1);
    E('path', { d: closedPath(blobPts(rx, ry, 12, 0, 0.18, 30 + i)), fill: '#2E3D49', stroke: '#4A5C6A', 'stroke-width': 3 }, g);
    E('path', { d: closedPath(blobPts(rx * 0.7, ry * 0.65, 10, 0, 0.2, 40 + i)), fill: '#3A4A57', transform: `translate(${(-rx * 0.15).toFixed(1)} ${(-ry * 0.2).toFixed(1)})` }, g);
    return { g, x, y };
  });
  const seaBack = E('path', { fill: '#123B52' }, B1);
  const ship = G(B1), shipBody = G(ship);
  E('path', { d: 'M-160,-12 L160,-12 L128,42 Q0,58 -132,42 Z', fill: ball('#8A5530', '#4E2C15'), stroke: '#C08A5A', 'stroke-width': 3, 'stroke-linejoin': 'round' }, shipBody);
  E('path', { d: 'M-150,4 L150,4', stroke: '#E9C9A0', 'stroke-width': 4, opacity: 0.7 }, shipBody);
  E('path', { d: 'M8,-12 L8,-226 M-86,-12 L-86,-180', stroke: '#6E4A2E', 'stroke-width': 7, 'stroke-linecap': 'round' }, shipBody);
  E('path', { d: 'M14,-214 Q86,-130 14,-40 Z', fill: '#F3EAD6', stroke: '#CDBF9E', 'stroke-width': 2.5 }, shipBody);
  E('path', { d: 'M-80,-170 Q-22,-108 -80,-46 Z', fill: '#F3EAD6', stroke: '#CDBF9E', 'stroke-width': 2.5 }, shipBody);
  E('path', { d: 'M16,-176 L120,-30 L16,-30 Z', fill: '#E6DCC2', stroke: '#CDBF9E', 'stroke-width': 2 }, shipBody);
  E('path', { d: 'M8,-226 L40,-216 L8,-206 Z', fill: C.bad }, shipBody);
  const shipC = compass(shipBody, 24, { glow: true }); tr(shipC, -118, -42);
  const seaFront = [E('path', { fill: '#0F3349' }, B1), E('path', { fill: '#0B2838' }, B1)];
  const lblSail = T(B1, 205, 394, 'steering by compass', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const sailArrow = arrow(B1, 236, 410, 330, 462, { color: C.energy, width: 4, bend: 18 });
  const waveD = (y0, amp, wl, ph) => { let d = `M0,750 L0,${y0}`; for (let x = 0; x <= 1200; x += 24) d += ` L${x},${(y0 + amp * Math.sin(TAU * (x / wl - ph))).toFixed(1)}`; return d + ' L1200,750 Z'; };
  const shipBase = [470, 520];

  const B2 = G(root);
  const hike = G(B2);
  E('path', { d: 'M-170,140 Q-60,20 0,26 Q70,30 170,140 Z', fill: ball('#4E8C55', '#2B5A31'), stroke: '#7FC08A', 'stroke-width': 3 }, hike);
  const hiker = person(hike, { shirt: '#E9884A', shorts: '#4B5B6B', hair: '#3A2414' });
  tr(hiker, -10, 30, 0.95);
  hiker.pose({ armR: [50, 80], armL: [-10, 10], legL: [6, -4], legR: [-6, -4] });
  E('rect', { x: -26, y: -142, width: 20, height: 52, rx: 6, fill: '#5C6B3A', transform: 'translate(-10 30) scale(0.95)' }, hike);
  const hikeC = compass(hike, 16); tr(hikeC, -10 + 49 * 0.95 + 8, 30 - 145 * 0.95 - 4); hikeC.set(-90);
  T(hike, 0, 186, 'hikers', { size: 30, weight: 700, anchor: 'middle' });
  const fly = G(B2), plane = G(fly);
  E('path', { d: 'M-92,-6 Q-96,-22 -70,-22 L58,-20 Q92,-16 100,0 Q92,14 58,16 L-70,16 Q-96,14 -92,-6 Z', fill: ball('#E9EEF2', '#9AA7B2'), stroke: '#FFFFFF', 'stroke-width': 2 }, plane);
  E('path', { d: 'M-10,-4 L-44,-72 L-22,-72 L28,-4 Z', fill: '#C9D3DC', stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, plane);
  E('path', { d: 'M-70,-20 L-96,-62 L-80,-62 L-48,-20 Z', fill: '#C9D3DC', stroke: '#FFFFFF', 'stroke-width': 2, 'stroke-linejoin': 'round' }, plane);
  E('path', { d: 'M54,-16 Q78,-14 88,-4 L56,-4 Z', fill: '#4CC9F0', opacity: 0.85 }, plane);
  for (let k = 0; k < 4; k++) E('circle', { cx: -40 + k * 22, cy: -4, r: 4.5, fill: '#4CC9F0', opacity: 0.8 }, plane);
  const flyC = compass(fly, 26); tr(flyC, 0, 112); flyC.set(-90);
  T(fly, 0, 214, 'pilots', { size: 30, weight: 700, anchor: 'middle' });
  const gps = G(B2);
  E('rect', { x: -22, y: -22, width: 44, height: 44, rx: 6, fill: ball('#F2C14E', '#A8780F'), stroke: '#FFE8A6', 'stroke-width': 2 }, gps);
  [[-1, 0], [1, 0]].forEach(([s]) => {
    E('line', { x1: s * 22, y1: 0, x2: s * 36, y2: 0, stroke: '#C9D3DC', 'stroke-width': 4 }, gps);
    E('rect', { x: s > 0 ? 36 : -106, y: -20, width: 70, height: 40, rx: 3, fill: '#2E5FA8', stroke: '#9CC2F2', 'stroke-width': 2 }, gps);
    for (let k = 1; k < 4; k++) E('line', { x1: (s > 0 ? 36 : -106) + k * 17.5, y1: -20, x2: (s > 0 ? 36 : -106) + k * 17.5, y2: 20, stroke: '#9CC2F2', 'stroke-width': 1.5 }, gps);
  });
  E('path', { d: 'M-8,-22 L-14,-44 M8,-22 L14,-44 M-16,-46 Q0,-58 16,-46', fill: 'none', stroke: '#E3E9EE', 'stroke-width': 3, 'stroke-linecap': 'round' }, gps);
  const gpsX = cross(gps, 46);
  T(gps, 0, 204, 'if GPS fails', { size: 30, weight: 700, anchor: 'middle' });

  /* ================= C. the shield ================= */
  const Cg = G(root);
  const SX0 = 150, SY0 = 400, X0 = 694, PP = 150, ECX = 850;
  const sunG = G(Cg); const sunA = sun(sunG, 62); tr(sunG, SX0, SY0);
  const bnd = [];
  for (let yy = -330; yy <= 330; yy += 10) bnd.push([X0 + yy * yy / (2 * PP), SY0 + yy]);
  const bndD = 'M' + bnd.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  E('path', { d: bndD + ' L1240,730 L1240,70 Z', fill: 'rgba(76,201,240,0.07)' }, Cg);
  E('path', { d: bndD, fill: 'none', stroke: 'rgba(76,201,240,0.25)', 'stroke-width': 18, 'stroke-linecap': 'round' }, Cg);
  const bndLine = E('path', { d: bndD, fill: 'none', stroke: '#7FD8F5', 'stroke-width': 3.5, 'stroke-dasharray': '2 10', 'stroke-linecap': 'round' }, Cg);
  const smallEarthG = G(Cg); tr(smallEarthG, ECX, SY0);
  const smallEarth = earthArt(smallEarthG, 66);
  op(smallEarth.mag, 0);
  dipoleSet(Cg, ECX, SY0, 66, [1.5, 2.1], { width: 2.6, head: 0.9 }).forEach(l => { l.path.setAttribute('stroke-dasharray', 'none'); l.head.setAttribute('transform', `translate(${l.x} ${l.y}) rotate(-90)`); });
  const parts = [], pr = rng(99);
  const partG = G(Cg);
  for (let i = 0; i < 36; i++) {
    const h = (((i * 7) % 36) / 35 - 0.5) * 440 + (pr() - 0.5) * 12;
    parts.push({ h: Math.abs(h) < 3 ? (i % 2 ? 3 : -3) : h, ph: pr(), v: 220 + pr() * 80, el: E('circle', { r: 5 + pr() * 1.5, fill: C.energy }, partG), tail: E('path', { stroke: '#FFE45C', 'stroke-width': 3.5, 'stroke-linecap': 'round', fill: 'none', opacity: 0.55 }, partG) });
  }
  const pathY = (h, x) => {
    const wb = Math.sqrt(Math.max(0, 2 * PP * (x - X0 + 30))) + 18, a = Math.abs(h);
    const m = (a + wb + Math.sqrt((a - wb) * (a - wb) + 900)) / 2;
    return SY0 + Math.sign(h) * m;
  };
  const lblParts = T(Cg, 420, 150, 'harmful particles from the Sun', { size: 28, weight: 700, anchor: 'middle', fill: C.energy });
  const lblShield = rich(Cg, 1040, 250, [['Earth’s field', '#7FD8F5', 700]], { size: 28, anchor: 'middle' });
  const lblShield2 = T(Cg, 1040, 284, 'steers them away', { size: 26, weight: 600, anchor: 'middle', fill: C.muted });

  /* ================= D. animals on a map ================= */
  const Dg = G(root);
  card(Dg, 120, 150, 960, 500, { fill: '#174E73', stroke: '#2C6E96', rx: 26 });
  const mapLand = G(Dg, { 'clip-path': _clipUrl('M146,150 L1054,150 Q1080,150 1080,176 L1080,624 Q1080,650 1054,650 L146,650 Q120,650 120,624 L120,176 Q120,150 146,150 Z') });
  [[300, 300, 190, 130, 5], [330, 560, 110, 90, 8], [760, 250, 170, 100, 12], [860, 470, 120, 150, 17]].forEach(([x, y, rx, ry, sd]) => E('path', { d: closedPath(blobPts(rx, ry, 13, 0, 0.24, sd)), fill: '#4E9A5E', stroke: '#7FC08A', 'stroke-width': 3, transform: `translate(${x} ${y})` }, mapLand));
  const ROUTES = [
    { pts: [[200, 255], [270, 225], [350, 250], [420, 300]], name: 'pigeon', f: 0.03, lx: 230, ly: 390 },
    { pts: [[420, 610], [560, 560], [660, 420], [610, 300], [520, 210]], name: 'sea turtle', f: 0.16, lx: 470, ly: 470 },
    { pts: [[760, 180], [850, 280], [900, 420], [930, 560]], name: 'migrating bird', f: 0.32, lx: 934, ly: 204 },
  ].map(r => {
    const pts = []; for (let i = 0; i < r.pts.length - 1; i++) { const a = r.pts[i], b = r.pts[i + 1]; for (let k = 0; k < 20; k++) pts.push([lerp(a[0], b[0], k / 20), lerp(a[1], b[1], k / 20)]); }
    pts.push(r.pts[r.pts.length - 1]);
    const smooth = openPath(r.pts);
    r.path = E('path', { d: smooth, fill: 'none', stroke: '#F2F7FA', 'stroke-width': 4.5, 'stroke-dasharray': '0.1 13', 'stroke-linecap': 'round', opacity: 0.85 }, Dg);
    r.g = G(Dg); r.art = G(r.g); r.c = compass(r.g, 15); tr(r.c, 34, -30);
    r.lbl = T(Dg, r.lx, r.ly, r.name, { size: 28, weight: 700, anchor: 'middle' });
    // sample the smooth route once, for a pure-function lookup by arc length
    let L = 0; try { L = r.path.getTotalLength(); } catch (e) { L = 0; }
    r.samp = [];
    for (let i = 0; i <= 80; i++) { let q = null; try { q = L ? r.path.getPointAtLength(L * i / 80) : null; } catch (e) { q = null; } r.samp.push(q ? [q.x, q.y] : pts[Math.round(i / 80 * (pts.length - 1))]); }
    r.at = u => { const f = clamp(u) * 80, i = Math.min(79, Math.floor(f)), k = f - i, a = r.samp[i], b = r.samp[i + 1]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI]; };
    return r;
  });
  { // pigeon (side view)
    const p = ROUTES[0].art;
    E('path', { d: 'M-26,6 Q-28,-14 -6,-16 Q14,-18 24,-6 L34,-8 L28,2 Q18,14 -6,14 Q-20,14 -26,6 Z', fill: ball('#A9B5C0', '#5E6B77'), stroke: '#D8E0E6', 'stroke-width': 2 }, p);
    E('path', { d: 'M-14,-6 Q2,-30 16,-10 Z', fill: '#7E8C98', stroke: '#C2CCD4', 'stroke-width': 1.5 }, p);
    E('circle', { cx: 20, cy: -8, r: 2.6, fill: '#1B2731' }, p);
    E('path', { d: 'M-26,6 L-40,0 L-36,12 Z', fill: '#7E8C98' }, p);
  }
  { // sea turtle (from above)
    const p = ROUTES[1].art;
    [[-20, -16, -40], [20, -16, 40], [-18, 18, -150], [18, 18, 150]].forEach(([x, y, r]) => E('ellipse', { cx: 0, cy: 0, rx: 9, ry: 16, fill: '#6FBF73', transform: `translate(${x} ${y}) rotate(${r})` }, p));
    E('ellipse', { cx: 0, cy: -30, rx: 9, ry: 10, fill: '#7FCB83' }, p);
    E('ellipse', { rx: 22, ry: 27, fill: ball('#8F7A3E', '#4E3F18'), stroke: '#C8B06A', 'stroke-width': 2.5 }, p);
    E('path', { d: 'M0,-20 L0,20 M-16,-6 L16,-6 M-14,8 L14,8', stroke: '#C8B06A', 'stroke-width': 2, opacity: 0.8 }, p);
  }
  { // migrating bird (wings spread)
    const p = ROUTES[2].art;
    E('path', { d: 'M0,4 Q-16,-14 -38,-8 Q-20,-4 -6,10 Q0,16 6,10 Q20,-4 38,-8 Q16,-14 0,4 Z', fill: '#E9EEF2', stroke: '#FFFFFF', 'stroke-width': 1.5 }, p);
    E('circle', { cx: 0, cy: -2, r: 5, fill: '#E9EEF2' }, p);
    E('path', { d: 'M0,-6 L3,-12 L-3,-12 Z', fill: C.energy }, p);
  }
  const lblBuilt = T(Dg, 600, 700, 'a built-in compass', { size: 30, weight: 700, anchor: 'middle', fill: C.energy });

  /* ================= E. the poles flip ================= */
  const Eg = G(root);
  const FX = 600, FY = 318, FR = 150;
  const flipEarthG = G(Eg); tr(flipEarthG, FX, FY);
  const flipEarth = earthArt(flipEarthG, FR);
  const flipLines = dipoleSet(Eg, FX, FY, FR, [1.25, 1.62], { width: 3, head: 1.1 });
  flipLines.forEach(l => l.path.setAttribute('stroke-dasharray', 'none'));
  const chipToday = chip(Eg, 'science today', { size: 28, fill: C.card2, stroke: C.energy, color: C.energy }); tr(chipToday, 1010, 150);
  const strip = G(Eg), stripe = [];
  const SW = [44, 62, 38, 70, 46, 54, 34, 66, 48, 58, 40, 72, 44, 52, 40, 32];
  { let x = 200; SW.forEach((w, i) => {
      const g = G(strip), up = i % 2 === 0;
      E('rect', { x, y: 528, width: w, height: 70, fill: up ? '#C2414D' : '#2F66C4', stroke: '#0A1B27', 'stroke-width': 1.5 }, g);
      const ax = x + w / 2; E('path', { d: up ? `M${ax},544 L${ax},582 M${ax - 7},553 L${ax},542 L${ax + 7},553` : `M${ax},544 L${ax},582 M${ax - 7},573 L${ax},584 L${ax + 7},573`, stroke: '#ffffff', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, g);
      stripe.push({ g, x }); x += w;
    }); }
  E('rect', { x: 200, y: 528, width: 800, height: 70, rx: 4, fill: 'none', stroke: '#8395A3', 'stroke-width': 3 }, strip);
  const lblRocks = T(Eg, 390, 650, 'rocks record the flips', { size: 30, weight: 700, anchor: 'middle' });
  const chipWhy = chip(Eg, 'why? still being researched', { size: 28, fill: C.card2, stroke: C.line }); tr(chipWhy, 820, 640);

  return t => {
    /* ---------- A ---------- */
    const aA = 1 - P(t, at('navigate') - 0.35, 0.45, linear);
    op(A, aA);
    if (aA > 0) {
      // the compass: a tiny magnet becomes the needle, spins freely, then settles pointing north
      const cin = P(t, S.first - 0.1, 0.6, pop);
      const mg = P(t, mid('compass', 0.08), 0.6, easeOut), morph = P(t, mid('compass', 0.27), 0.45, linear);
      op(mini, mg * (1 - morph)); tr(mini, BCX, BCY, Math.max(0.01, 0.4 + 0.3 * mg) * (1 - 0.3 * morph), 90 * P(t, mid('compass', 0.18), 0.5));
      op(big.nd, morph);
      const t0 = mid('compass', 0.33), t1 = mid('compass', 0.82);
      let ang;
      if (t < t0) ang = -90;
      else if (t < t1) { const u = (t - t0) / (t1 - t0), spin = 720 * (1 - Math.pow(1 - Math.min(1, u / 0.55), 2)); ang = -90 + spin + (u > 0.55 ? 48 * Math.exp(-9 * (u - 0.55)) * Math.sin(TAU * 2.2 * (u - 0.55)) : 0); }
      else ang = -90;
      // the twist: shrink onto the surface, pointing along the field there
      const mv = P(t, at('twist') + 0.1, 1.3);
      let a2 = ang;
      if (mv > 0) { let da = cDir - (-90); a2 = -90 + da * ease(mv); }
      tr(big, lerp(BCX, CX, mv), lerp(BCY, CY, mv), Math.max(0.01, lerp(1, CR / BCR, mv) * (0.85 + 0.15 * cin)));
      big.set(a2);
      op(big, clamp(cin * 2));
      op(lblFree, win(t, mid('compass', 0.33), mid('compass', 0.62), 0.3));
      op(lblNeedle, win(t, mid('compass', 0.84), at('twist') + 0.2, 0.35));
      // the Earth: appears, then turns see-through
      const ein = P(t, mid('compass', 0.55), 0.8, easeOut), see = P(t, at('earth') + 0.1, 1.0, linear);
      op(earthG, ein); tr(earthG, EX, EY, 0.9 + 0.1 * ein);
      op(earth.surf, 1 - 0.72 * see);
      earth.swirl.setAttribute('transform', `rotate(${((t * 22 * calm) % 360).toFixed(1)})`);
      const mgp = P(t, mid('earth', 0.2), 0.6, pop);
      op(earth.mag, clamp(mgp * 2)); earth.mag.setAttribute('transform', `scale(1 ${Math.max(0.01, mgp).toFixed(3)})`);
      op(axis, ein * 0.7); op(lblGN, ein); op(lblGS, ein);
      fieldLines.forEach((l, i) => {
        const p = P(t, mid('earth', 0.3 + Math.floor(i / 2) * 0.08), 1.0, easeOut);
        l.path.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); op(l.path, p > 0 ? 1 : 0);
        const hp = P(t, mid('earth', 0.3 + Math.floor(i / 2) * 0.08) + 0.5, 0.4, pop);
        op(l.head, clamp(hp * 2)); l.head.setAttribute('transform', `translate(${l.x} ${l.y}) rotate(-90) scale(${Math.max(0.01, hp).toFixed(3)})`);
      });
      op(coreLbl, P(t, mid('earth', 0.62), 0.5, linear) * (1 - P(t, at('twist') - 0.2, 0.4, linear)));
      // twist: unlike poles attract; north highlight
      op(attractIcon, P(t, mid('twist', 0.68), 0.4, linear)); op(chipUnlike, P(t, mid('twist', 0.72), 0.4, linear));
      const gnPulse = Math.sin(Math.PI * P(t, mid('twist', 0.45), 0.8, linear));
      lblGN.setAttribute('transform', `translate(${EX} 148) scale(${(1 + 0.12 * gnPulse).toFixed(3)}) translate(${-EX} -148)`);
      lblGN.setAttribute('fill', gnPulse > 0.01 ? C.energy : C.ink);
      // south: the top of the giant magnet lights up blue S, the attract arrow, then N at the bottom
      const sp = P(t, mid('south', 0.12), 0.6, linear), np = P(t, mid('south', 0.62), 0.5, linear);
      earth.poles(sp, np, false);
      op(sGlow, sp * (0.55 + 0.45 * Math.sin(Math.PI * P(t, mid('south', 0.12), 0.9, linear))) * (0.85 + 0.15 * calm * wave(t, 1.6)));
      const cm = P(t, mid('south', 0.2), 0.5, pop); op(chipMS, clamp(cm * 2)); tr(chipMS, EX, 246, Math.max(0.01, 0.85 + 0.15 * cm));
      op(pullArr, P(t, mid('south', 0.36), 0.3, linear)); pullArr.set(P(t, mid('south', 0.36), 0.6));
      op(lblMN, P(t, mid('south', 0.68), 0.5, linear));
    }

    /* ---------- B ---------- */
    const aB1 = win(t, at('navigate') - 0.25, mid('navigate', 0.47), 0.45);
    op(B1, aB1);
    if (aB1 > 0) {
      const tl = t - at('navigate');
      seaBack.setAttribute('d', waveD(522, 10, 300, tl * 0.25 * calm));
      seaFront[0].setAttribute('d', waveD(560, 12, 380, -tl * 0.18 * calm + 0.3));
      seaFront[1].setAttribute('d', waveD(612, 9, 260, tl * 0.32 * calm + 0.6));
      const bob = Math.sin(tl * 1.7) * calm, rollA = Math.sin(tl * 1.3 + 0.6) * calm;
      tr(ship, shipBase[0] + 30 * P(t, at('navigate') - 0.2, 3.6, linear), shipBase[1] + 6 * bob, 1, 2.5 * rollA);
      shipC.set(-90 + 6 * Math.sin(tl * 2.1) * calm); op(shipC.halo, 0.75 + 0.25 * wave(t, 1.3));
      clouds.forEach((c, i) => tr(c.g, c.x + (tl * (8 + i * 2)) * calm, c.y));
      stars.forEach(s => op(s.el, (0.45 + 0.55 * wave(t, 2.4, s.ph))));
      op(lblSail, P(t, mid('navigate', 0.2), 0.4, linear)); op(sailArrow, P(t, mid('navigate', 0.22), 0.3, linear)); sailArrow.set(P(t, mid('navigate', 0.22), 0.6));
    }
    const aB2 = win(t, mid('navigate', 0.44), at('shield') - 0.15, 0.4);
    op(B2, aB2);
    if (aB2 > 0) {
      const ph = P(t, mid('navigate', 0.5), 0.5, pop), pp = P(t, mid('navigate', 0.62), 0.5, pop), pg = P(t, mid('navigate', 0.8), 0.5, pop);
      op(hike, clamp(ph * 2)); tr(hike, 250, 420 + (1 - clamp(ph)) * 30);
      op(fly, clamp(pp * 2)); tr(fly, 600, 390);
      tr(plane, 14 * Math.sin(t * 0.9) * calm, 8 * Math.sin(t * 1.6) * calm, Math.max(0.01, 0.7 + 0.3 * pp), -3 * Math.sin(t * 1.6) * calm);
      op(gps, clamp(pg * 2)); tr(gps, 950, 400 + (1 - clamp(pg)) * 30);
      const xp = P(t, mid('navigate', 0.88), 0.4, pop); op(gpsX, clamp(xp * 2)); gpsX.setAttribute('transform', `scale(${Math.max(0.01, xp).toFixed(3)})`);
      hikeC.set(-90 + 8 * Math.sin(t * 2.3) * calm * (1 - P(t, mid('navigate', 0.6), 1, linear)));
      flyC.set(-90 + 5 * Math.sin(t * 1.9) * calm);
    }

    /* ---------- C ---------- */
    const aC = win(t, at('shield') - 0.2, at('animals') - 0.15, 0.4);
    op(Cg, aC);
    if (aC > 0) {
      sunA.upd(t);
      smallEarth.swirl.setAttribute('transform', `rotate(${((t * 22 * calm) % 360).toFixed(1)})`);
      bndLine.setAttribute('stroke-dashoffset', (-t * 14 * calm).toFixed(1));
      const flow = P(t, at('shield') - 0.1, 0.6, linear), ts = t - at('shield') + 2.2;
      parts.forEach(q => {
        const span = 1060, xx = SX0 + 70 + ((ts * q.v * (S.reduce ? 0.6 : 1) + q.ph * span) % span);
        const y = pathY(q.h, xx), x2 = xx - 28, y2 = pathY(q.h, x2);
        const fade = Math.min(1, (xx - SX0 - 70) / 60, (1190 - xx) / 60);
        attr(q.el, 'cx', xx); attr(q.el, 'cy', y); op(q.el, flow * clamp(fade));
        q.tail.setAttribute('d', `M${x2.toFixed(1)},${y2.toFixed(1)} L${xx.toFixed(1)},${y.toFixed(1)}`); op(q.tail, flow * clamp(fade) * 0.55);
      });
      op(lblParts, P(t, mid('shield', 0.4), 0.4, linear));
      op(lblShield, P(t, mid('shield', 0.12), 0.4, linear)); op(lblShield2, P(t, mid('shield', 0.2), 0.4, linear));
    }

    /* ---------- D ---------- */
    const aD = win(t, at('animals') - 0.2, at('flip') - 0.15, 0.4);
    op(Dg, aD);
    if (aD > 0) {
      ROUTES.forEach((r, i) => {
        const pa = P(t, mid('animals', r.f), 0.5, linear), go = P(t, mid('animals', r.f) + 0.2, end('animals') - mid('animals', r.f) - 0.1, linear);
        op(r.path, pa);
        const q = r.at(go);
        tr(r.g, q[0], q[1]); op(r.g, pa);
        r.art.setAttribute('transform', i === 1 ? `rotate(${(q[2] + 90).toFixed(1)})` : i === 2 ? `scale(${(1 - 0.14 * Math.abs(Math.sin(t * 7)) * calm).toFixed(3)} 1)` : `scale(${Math.cos(q[2] * Math.PI / 180) < 0 ? -1 : 1} 1)`);
        r.c.set(-90 + 10 * Math.sin(t * 2.5 + i) * calm * (1 - P(t, mid('animals', 0.6), 1.2, linear)));
        op(r.lbl, P(t, mid('animals', r.f) + 0.15, 0.4, linear));
      });
      op(lblBuilt, P(t, mid('animals', 0.62), 0.5, linear));
    }

    /* ---------- E ---------- */
    const aE = P(t, at('flip') - 0.2, 0.45, linear);
    op(Eg, aE);
    if (aE > 0) {
      op(flipEarth.surf, 0.3);
      flipEarth.swirl.setAttribute('transform', `rotate(${((t * 22 * calm) % 360).toFixed(1)})`);
      const f1 = P(t, mid('flip', 0.3), 1.1), f2 = P(t, mid('flip', 0.52), 1.1);
      const rot = 180 * (f1 + f2), flipped = (f1 >= 0.5) !== (f2 >= 0.5);
      flipEarth.mag.setAttribute('transform', `rotate(${rot.toFixed(1)})`);
      const showL = clamp(Math.min(Math.abs(Math.cos(Math.PI * f1)), Math.abs(Math.cos(Math.PI * f2))) * 3 - 2);
      flipEarth.poles(1, 1, flipped, showL);
      flipLines.forEach(l => l.head.setAttribute('transform', `translate(${l.x} ${l.y}) rotate(${(-90 + rot).toFixed(1)})`));
      op(chipToday, P(t, at('flip') + 0.05, 0.4, linear));
      stripe.forEach((s, i) => op(s.g, P(t, mid('flip', 0.18) + i * 0.16, 0.25, linear)));
      op(lblRocks, P(t, mid('flip', 0.42), 0.4, linear));
      const cw = P(t, mid('flip', 0.68), 0.5, pop); op(chipWhy, clamp(cw * 2)); tr(chipWhy, 820, 640, Math.max(0.01, 0.85 + 0.15 * cw));
    }
  };
});
